# Incident Report Build Pipeline & Authoring Conventions

Verified 2026-09-03 against scripts/build.sh, scripts/md2html.js, README.md, .gitignore.
This is a single-file compiled report: many markdown sources -> one self-contained HTML page.

## Build pipeline (scripts/build.sh)
- `bash scripts/build.sh` runs `node scripts/md2html.js <files...> -o dist/index.html`, then copies `assets/images-web/*.jpeg` into `dist/images/`.
- Concatenates README.md + 12 section files into ONE self-contained HTML page (inlined CSS, no external assets).
- Source files: README.md, docs/01-background ... docs/09-lessons-learned, docs/A-known-unknowns, docs/B-evidence-method, docs/C-about-authors.
- Page order = order of the `files=(...)` array in build.sh (lines ~12-26). Reorder there to reorder the page.
- `dist/` is gitignored (.gitignore line 1) — it is a build artifact, never committed. To preview: run `bash scripts/build.sh`, open dist/index.html.

## Anchor links are FILE-level only (key non-obvious constraint)
- md2html.js renders each .md file as `<section id="<slug>">` where slug = filename sans extension (slugified).
- The internal-link rewriter (`rewriteHref`) ONLY maps a link to another `.md` FILE into an in-page `#<file-slug>` anchor. It passes `#...` links through unchanged and never rewrites links that target subsections/headings.
- Nuance: every heading does get an auto `id` (slug of the heading text, md2html.js ~line 294), but these are NOT part of the supported cross-link mechanism — you would have to hand-compute the exact slug. Do not rely on them for cross-references.
- Consequence: README Table of Contents top-level entries = real clickable links (file level). Subsection (X.Y) entries MUST be indented PLAIN TEXT, never hyperlinks — they will not resolve through this pipeline. If a task expects clickable subsection anchors in the compiled HTML, that expectation is wrong for this pipeline.

## Report structure convention (post-restructure; commit 7df8055, branch task/consolidate-sections)
- Top-level sections are numbered 1-9 plus Appendices A/B/C (NOT the old "Part I-V" dividers). Author/about content lives in Appendix C.
- De-duplication convention: each fact has ONE canonical home; other sections reference it via plain-text prose ("see Section X.Y"), NOT markdown anchor links (see constraint above) and NOT by duplicating the content.
- Canonical homes for shared facts:
  - incident facts / shasum / entry-point = Section 2.1
  - capability-vs-impact + exposure progression states = Section 3.3
  - email / preservation / SPF-DKIM-DMARC detail = Section 5.2
  - root-cause causal statement = Section 6.2
  - confidence-rating definitions = Appendix B.3

## Date & terminology convention
- Specific calendar dates are written in ISO format (YYYY-MM-DD) throughout README and section files. Month-only prose references (e.g. "In May 2026") are intentionally left as-is.
- The DNS data-exfiltration capability is referred to consistently as "DNS-exfiltration" / "DNS query-name exfiltration". Avoid the bare "exfil" shorthand.
