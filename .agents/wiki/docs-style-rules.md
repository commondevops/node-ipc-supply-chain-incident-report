# Documentation Style Rules (docs/*.md)

Apply these rules to all files under `docs/`. They govern line-break topology only; content is never altered.

## Rules

- **Sentence-per-line**: Every sentence in a body paragraph sits on its own line. Consecutive sentences from the same original paragraph are separated by exactly one newline (no blank line between them). This lets git track changes at sentence granularity.
- **Headings**: `#`, `##`, `###` headings stay on their own line. One blank line separates a heading from content below it.
- **Paragraph separation**: A blank line that originally separated two distinct paragraphs is preserved in the output.
- **List items**: Each list item (lines starting with `-` or `*`) stays on a single line, even if it contains multiple sentences. Never split a list item across lines.
- **Blockquotes**: One sentence per line, each prefixed with `> `.
- **Content integrity**: Only line-break topology changes. No words added, removed, or reworded during transformation.
- **No double blank lines** anywhere in the file.
- **File ending**: Each file ends with a single newline.
- **Code blocks and image references**: Kept intact on single lines; not treated as sentences to split.
- **Tricky sentence boundaries**: Version numbers (e.g., `9.1.6`), section references (e.g., `Section 2.1`), file extensions (`.cjs`, `.js`), method calls (`zlib.gzipSync()`), and domain names (`sh.azurestaticprovider.net`) are NOT treated as sentence ends.

## Affected files

- docs/A-known-unknowns.md
- docs/B-evidence-method.md
- docs/C-about-authors.md
- docs/01-background.md
- docs/02-incident-overview.md
- docs/03-impact.md
- docs/04-technical-analysis.md
- docs/05-attribution.md
- docs/06-root-cause.md
- docs/07-detection.md
- docs/08-remediation.md
- docs/09-lessons-learned.md
