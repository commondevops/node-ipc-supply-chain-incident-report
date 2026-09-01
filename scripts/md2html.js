#!/usr/bin/env node
'use strict';

/*
 * md2html.js - dependency-free Markdown -> HTML converter.
 *
 * Usage:
 *   node scripts/md2html.js <file1.md> <file2.md> ... -o <out.html>
 *
 * Renders an ordered list of markdown files into ONE self-contained HTML
 * document (inlined CSS, no external assets), with a generated clickable
 * table of contents and internal .md links rewritten to in-page anchors.
 *
 * Uses ONLY Node built-in modules (node:fs, node:path).
 */

const fs = require('node:fs');
const path = require('node:path');

/* ------------------------------------------------------------------ *
 * Global state shared across sections (heading id uniqueness + the set
 * of rendered section ids used for internal-link rewriting).
 * ------------------------------------------------------------------ */
const state = {
  usedIds: new Set(),
  sectionIds: [],
};

/* ------------------------------------------------------------------ *
 * Small helpers
 * ------------------------------------------------------------------ */

// Escape raw HTML-significant characters. Applied to ALL user text so we
// never emit unescaped < > & from prose.
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// slug(text): lowercase; spaces -> -; drop chars not in [a-z0-9-];
// collapse consecutive -; trim leading/trailing -. Empty -> "section".
function slug(text) {
  let s = String(text).toLowerCase();
  s = s.replace(/\s+/g, '-');
  s = s.replace(/[^a-z0-9-]/g, '');
  s = s.replace(/-+/g, '-');
  s = s.replace(/^-+|-+$/g, '');
  if (s === '') s = 'section';
  return s;
}

// Strip inline markdown markers so a heading's text can be slugified.
// Removes: backtick code spans, ** / __ bold, * / _ italic, ~~strike~~,
// and link/image marker characters [ ] ( ).
function stripInline(text) {
  let s = String(text);
  s = s.replace(/`/g, '');
  s = s.replace(/\*\*/g, '');
  s = s.replace(/__/g, '');
  s = s.replace(/\*/g, '');
  s = s.replace(/_/g, '');
  s = s.replace(/~~/g, '');
  s = s.replace(/[\[\]()]/g, '');
  return s;
}

// Produce a document-unique id from a base slug. Registers it in the
// global seen-set and appends -1, -2, ... on collision.
function uniqueId(base) {
  let candidate = base || 'section';
  let n = 0;
  while (state.usedIds.has(candidate)) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  state.usedIds.add(candidate);
  return candidate;
}

/* ------------------------------------------------------------------ *
 * Internal link rewriting
 * ------------------------------------------------------------------ */

// Rewrite an href. External / mailto / anchor-only links pass through.
// Relative .md links are rewritten to in-page anchors ONLY when the target
// basename matches one of the rendered sectionIds; otherwise unchanged.
function rewriteHref(href) {
  const h = String(href);
  if (/^(https?:|mailto:)/i.test(h)) return h;
  if (h.startsWith('#')) return h;

  // Strip query / hash, then take the basename.
  let cleaned = h.split('#')[0].split('?')[0];
  if (cleaned === '') return h;
  const base = path.posix.basename(cleaned);
  const name = base.replace(/\.md$/i, '');

  // Section ids are slugs (lowercased). Compare the slug of the target's
  // basename against them so case / extension differences still match.
  const target = slug(name);
  if (state.sectionIds.includes(target)) {
    return `#${target}`;
  }
  return h;
}

/* ------------------------------------------------------------------ *
 * Inline rendering
 * ------------------------------------------------------------------ */

// inlineRender(text): escape, protect code spans, then images, links,
// bold, italic, strikethrough, and finally restore code placeholders.
function inlineRender(text) {
  // a. HTML-escape the raw text.
  let s = escapeHtml(String(text));

  // b. Extract code spans FIRST so other rules don't mangle their content.
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (m, content) => {
    const idx = codes.length;
    codes.push(`<code>${content}</code>`);
    return `\u0000CODE${idx}\u0000`;
  });

  // c. Images (before links so the leading ! is consumed).
  s = s.replace(
    /!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+&quot;[^&quot;]*&quot;)?\s*\)/g,
    (m, alt, url) => `<img src="${url}" alt="${alt}">`
  );

  // d. Links (apply internal-link rewriting to the href).
  s = s.replace(
    /\[([^\]]+)\]\(\s*([^)\s]+)(?:\s+&quot;[^&quot;]*&quot;)?\s*\)/g,
    (m, txt, url) => `<a href="${rewriteHref(url)}">${txt}</a>`
  );

  // e. Bold (non-greedy).
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // f. Italic.
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/_([^_]+)_/g, '<em>$1</em>');

  // g. Strikethrough.
  s = s.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // h. Restore code placeholders.
  s = s.replace(/\u0000CODE(\d+)\u0000/g, (m, num) => codes[Number(num)]);

  return s;
}

/* ------------------------------------------------------------------ *
 * Block-level classification helpers
 * ------------------------------------------------------------------ */

// A horizontal rule: 3+ of (- or * or _) possibly separated by spaces.
// Guarded against table separators and list items.
function isHorizontalRule(line) {
  const t = line.trim();
  if (t.includes('|')) return false; // table separator context
  if (/^\s*[-*]\s+/.test(line)) return false; // looks like a list item
  if (!/^(\s*)(-|\*|_)(\s*\1(-|\*|_))*\s*$/.test(line)) return false;
  const chars = t.replace(/\s+/g, '');
  if (chars.length < 3) return false;
  const first = chars[0];
  for (const c of chars) {
    if (c !== first) return false;
  }
  return true;
}

// Table separator row: dashes/colons/pipes/spaces with at least 3 dashes.
function isTableSeparator(line) {
  if (line === undefined || line === null) return false;
  const t = String(line).trim();
  if (t === '') return false;
  if (!/^[\s|:-]+$/.test(t)) return false;
  return /-{3,}/.test(t);
}

// True when `line` would begin a non-paragraph block. Used to terminate
// paragraph collection. nextLine is used for table detection.
function startsSpecialBlock(line, nextLine) {
  const t = line.trim();
  if (t === '') return true; // blank
  if (/^```/.test(t)) return true; // code fence
  if (/^(#{1,6})\s+/.test(t)) return true; // heading
  if (isHorizontalRule(line)) return true; // hr
  if (line.includes('|') && isTableSeparator(nextLine)) return true; // table
  if (/^>/.test(t)) return true; // blockquote
  if (/^\s*\d+\.\s+/.test(line)) return true; // ordered list
  if (/^\s*[-*]\s+/.test(line)) return true; // unordered list
  return false;
}

/* ------------------------------------------------------------------ *
 * Table rendering
 * ------------------------------------------------------------------ */

// Split a table row on | and drop the empty cells produced by leading /
// trailing pipes. Returns trimmed raw cell strings.
function splitRow(row) {
  let parts = row.split('|');
  if (parts.length > 0 && parts[0].trim() === '') parts.shift();
  const lastIdx = parts.length - 1;
  if (lastIdx >= 0 && parts[lastIdx].trim() === '') parts.pop();
  return parts.map((c) => c.trim());
}

function renderTable(tableLines) {
  const headerCells = splitRow(tableLines[0]);
  // tableLines[1] is the |---| separator; body rows start at index 2.
  // Defensively drop any remaining pure-separator rows as well.
  const bodyRows = tableLines.slice(2).filter((row) => !isTableSeparator(row));

  let html = '<table><thead><tr>';
  for (const cell of headerCells) {
    html += `<th>${inlineRender(cell)}</th>`;
  }
  html += '</tr></thead><tbody>';
  for (const row of bodyRows) {
    const cells = splitRow(row);
    html += '<tr>';
    for (let i = 0; i < headerCells.length; i++) {
      const cell = i < cells.length ? cells[i] : '';
      html += `<td>${inlineRender(cell)}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

/* ------------------------------------------------------------------ *
 * Block parser (line-based state machine)
 * ------------------------------------------------------------------ */

// Parse an array of markdown lines into HTML. `headings` accumulates the
// per-section heading list for TOC generation. Uses the global state for
// heading id uniqueness.
function parseBlocks(lines, headings) {
  let html = '';
  let i = 0;
  const n = lines.length;

  while (i < n) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Fenced code block: a line whose trimmed start is ``` toggles in/out.
    if (/^```/.test(trimmed)) {
      const lang = trimmed.slice(3).trim().replace(/[^A-Za-z0-9_-]/g, '');
      i++;
      const codeLines = [];
      while (i < n && !/^```/.test(lines[i].trim())) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < n) i++; // consume the closing ```
      const escaped = codeLines.map(escapeHtml).join('\n');
      html += lang
        ? `<pre><code class="language-${lang}">${escaped}</code></pre>`
        : `<pre><code>${escaped}</code></pre>`;
      continue;
    }

    // 2. Blank line: close any open block, emit nothing.
    if (trimmed === '') {
      i++;
      continue;
    }

    // 3. Heading.
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const plainText = stripInline(text);
      const id = uniqueId(slug(plainText));
      headings.push({ level, text: plainText, id });
      html += `<h${level} id="${id}">${inlineRender(text)}</h${level}>`;
      i++;
      continue;
    }

    // 4. Horizontal rule.
    if (isHorizontalRule(line)) {
      html += '<hr>';
      i++;
      continue;
    }

    // 5. Table: current line has | and next line is a separator.
    if (line.includes('|') && isTableSeparator(lines[i + 1])) {
      const tableLines = [line];
      i++;
      while (i < n && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      html += renderTable(tableLines);
      continue;
    }

    // 6. Blockquote: consecutive lines starting with >, rendered recursively.
    if (/^>/.test(trimmed)) {
      const quoteLines = [];
      while (i < n && /^>/.test(lines[i].trim())) {
        quoteLines.push(lines[i]);
        i++;
      }
      const stripped = quoteLines.map((l) => l.replace(/^>\s?/, ''));
      const inner = parseBlocks(stripped, headings);
      html += `<blockquote>${inner}</blockquote>`;
      continue;
    }

    // 7. Ordered list.
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < n && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      html += `<ol>${items.map((it) => `<li>${inlineRender(it)}</li>`).join('')}</ol>`;
      continue;
    }

    // 8. Unordered list.
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < n && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      html += `<ul>${items.map((it) => `<li>${inlineRender(it)}</li>`).join('')}</ul>`;
      continue;
    }

    // 9. Paragraph (default): consecutive plain lines joined by a space.
    const paraLines = [line];
    i++;
    while (i < n && !startsSpecialBlock(lines[i], lines[i + 1])) {
      paraLines.push(lines[i]);
      i++;
    }
    const joined = paraLines.map((l) => l.trim()).join(' ');
    html += `<p>${inlineRender(joined)}</p>`;
  }

  return html;
}

/* ------------------------------------------------------------------ *
 * Per-section rendering
 * ------------------------------------------------------------------ */

// Render a single markdown file into a <section> element. `sectionId` is the
// pre-assigned (unique) id for this section. Returns the HTML string for that
// section plus its metadata for TOC generation.
function renderSection(filePath, sectionId) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const baseName = path.basename(filePath);

  const lines = raw.split('\n');
  const headings = [];
  const bodyHtml = parseBlocks(lines, headings);

  // data-title: first h1 text if present, else the filename.
  const firstH1 = headings.find((h) => h.level === 1);
  const title = firstH1 ? firstH1.text : baseName;

  return {
    sectionId,
    title,
    headings,
    html: `<section id="${sectionId}" data-title="${escapeHtml(title)}">\n${bodyHtml}\n</section>`,
  };
}

// Render all input files into sections. Section ids are pre-computed (and
// registered) BEFORE any section is rendered so that internal links can be
// rewritten to in-page anchors even when they reference a later file
// (forward references). The set of valid targets = the slugs of ALL input
// files, per spec.
function processFiles(files) {
  const rawSlugs = files.map((f) => slug(path.basename(f).replace(/\.[^.]*$/, '')));
  const sectionIds = rawSlugs.map((s) => uniqueId(s));
  state.sectionIds = sectionIds;

  const sections = [];
  for (let idx = 0; idx < files.length; idx++) {
    try {
      sections.push(renderSection(files[idx], sectionIds[idx]));
    } catch (err) {
      process.stderr.write(`Error reading "${files[idx]}": ${err.message}\n`);
      process.exit(1);
    }
  }
  return sections;
}

/* ------------------------------------------------------------------ *
 * TOC generation
 * ------------------------------------------------------------------ */

// Build the table of contents from the rendered sections.
function buildToc(sections) {
  let html = '<nav class="toc"><h2>Contents</h2><ul class="toc-list">';
  for (const sec of sections) {
    html += `<li><a href="#${sec.sectionId}">${escapeHtml(sec.title)}</a>`;
    const h2s = sec.headings.filter((h) => h.level === 2);
    if (h2s.length > 0) {
      html += '<ul>';
      for (const h of h2s) {
        html += `<li><a href="#${h.id}">${escapeHtml(h.text)}</a></li>`;
      }
      html += '</ul>';
    }
    html += '</li>';
  }
  html += '</ul></nav>';
  return html;
}

/* ------------------------------------------------------------------ *
 * CSS (inlined, self-contained)
 * ------------------------------------------------------------------ */

const CSS = `:root {
  --bg: #030906;
  --fg: #d7ffe0;
  --muted: #7fbf8f;
  --accent: #00ff41;
  --border: #1f4d2b;
  --code-bg: #071f10;
  --pre-bg: #04130a;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--bg); }
body {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  line-height: 1.6;
  color: var(--fg);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
}
.report-header { margin-bottom: 16px; }
.report-header h1 {
  font-size: 2rem;
  line-height: 1.2;
  margin: 0 0 8px;
  color: var(--accent);
}
.toc {
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 32px;
  background: #05130c;
}
.toc h2 { margin-top: 0; font-size: 1.1rem; color: var(--accent); }
.toc-list { list-style: none; padding-left: 0; margin: 8px 0 0; }
.toc-list > li { margin: 6px 0; }
.toc a { color: var(--accent); text-decoration: none; }
.toc a:hover { text-decoration: underline; }
.toc-list ul { list-style: none; padding-left: 20px; margin: 4px 0; }
.toc-list ul li { margin: 3px 0; font-size: 0.95rem; }
.content section { margin-top: 40px; }
.content section:first-of-type { margin-top: 0; }
section h1 {
  font-size: 1.8rem;
  border-bottom: 2px solid var(--border);
  padding-bottom: 6px;
  color: var(--accent);
}
h2 { font-size: 1.4rem; margin-top: 28px; }
h3 { font-size: 1.15rem; }
a { color: var(--accent); }
pre {
  background: var(--pre-bg);
  border: 1px solid var(--border);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.9rem;
}
code {
  background: var(--code-bg);
  padding: 2px 5px;
  border-radius: 3px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.9em;
}
pre code { background: transparent; padding: 0; }
a code { color: inherit; }
blockquote {
  margin-left: 0;
  padding-left: 16px;
  border-left: 4px solid var(--accent);
  color: #9fd8ab;
}
table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}
th, td {
  border: 1px solid var(--border);
  padding: 6px 10px;
  text-align: left;
  vertical-align: top;
}
thead { background: #072312; color: var(--accent); }
tbody tr:nth-child(even) { background: #051a0e; }
img { max-width: 100%; }
.report-footer {
  margin-top: 48px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 0.9rem;
}
@media (max-width: 600px) {
  body { padding: 12px; }
  .toc { padding: 12px 14px; }
}`;

/* ------------------------------------------------------------------ *
 * Document assembly
 * ------------------------------------------------------------------ */

function buildDocument(sections, fileCount) {
  const toc = buildToc(sections);
  const content = sections.map((s) => s.html).join('\n');
  return (
    `<!DOCTYPE html>\n` +
    `<html lang="en"><head>\n` +
    `<meta charset="utf-8">\n` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">\n` +
    `<title>node-ipc Supply Chain Incident Report</title>\n` +
    `<style>${CSS}</style>\n` +
    `</head>\n` +
    `<body id="top">\n` +
    `<header class="report-header"><h1>node-ipc Supply Chain Incident Report</h1></header>\n` +
    `${toc}\n` +
    `<main class="content">\n${content}\n</main>\n` +
    `<footer class="report-footer">Generated by scripts/build.sh from ${fileCount} markdown files.</footer>\n` +
    `</body></html>\n`
  );
}

/* ------------------------------------------------------------------ *
 * Argument parsing
 * ------------------------------------------------------------------ */

// Manually parse CLI args. Positional .md args are the ordered source
// files; -o <path> is the output path.
function parseArgs(argv) {
  const files = [];
  let outPath = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-o') {
      if (i + 1 >= argv.length) {
        process.stderr.write('Error: -o requires a value.\n');
        process.exit(1);
      }
      outPath = argv[++i];
    } else if (arg.startsWith('-o') && arg.length > 2) {
      outPath = arg.slice(2);
    } else if (arg === '-h' || arg === '--help') {
      process.stdout.write(
        'Usage: node scripts/md2html.js <file1.md> <file2.md> ... -o <out.html>\n'
      );
      process.exit(0);
    } else {
      files.push(arg);
    }
  }
  return { files, outPath };
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

function main() {
  const argv = process.argv.slice(2);
  const { files, outPath } = parseArgs(argv);

  if (outPath === null) {
    process.stderr.write('Error: missing -o <output.html>.\n');
    process.stderr.write(
      'Usage: node scripts/md2html.js <file1.md> <file2.md> ... -o <out.html>\n'
    );
    process.exit(1);
  }

  if (files.length === 0) {
    process.stderr.write('Error: no input markdown files provided.\n');
    process.exit(1);
  }

  const sections = processFiles(files);

  const html = buildDocument(sections, files.length);
  fs.writeFileSync(outPath, html);

  const byteSize = Buffer.byteLength(html, 'utf8');
  process.stdout.write(
    `Wrote ${files.length} file(s) -> ${sections.length} section(s) to ${outPath} (${byteSize} bytes)\n`
  );
}

main();
