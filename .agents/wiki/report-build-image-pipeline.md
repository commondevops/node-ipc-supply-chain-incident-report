# Report Build + Image Pipeline

How the finished report is built and how images flow from markdown to dist. See this before editing docs or adding figures.

## Build

- Finished report is `dist/index.html`, produced by `bash scripts/build.sh`.
- `scripts/build.sh` compiles an ordered list of markdown files (README.md + docs/*.md) in a FIXED order defined by the `files=(...)` array in build.sh into ONE self-contained HTML page.
  - Order: README, part-01, what-is-node-ipc, overview, timeline, part-02, technical-analysis, maintainer-identity, domain-email-registrar, part-03, root-cause, impact, part-04, indicators, remediation, part-05, known-unknowns, lessons-learned, evidence-method, our-involvement.
  - Adding/reordering a section = edit the `files` array; build.sh fails if any listed file is missing.
- Compilation done by `scripts/md2html.js`: dependency-free, Node built-ins only (node:fs, node:path). Inlines all CSS; no external assets besides images.
- `dist/` is gitignored (build artifact). Source of truth = the `docs/*.md` files. Do NOT hand-edit `dist/index.html`; edit docs and rebuild.

## Images

- In markdown, reference an image as `![alt text](../assets/images/name.png)` on its OWN line with blank lines above/below so it renders as a standalone paragraph (an image inside a joined paragraph still works, but standalone is the convention).
- `md2html.js` rewrites any image path ending in `images/<file>` or `assets/images/<file>` to `src="images/<file>"` for dist serving (see inlineRender image rule).
- `build.sh` auto-copies every `assets/images/*.png` into `dist/images/`.
- Net effect: to add a figure you only (1) drop the PNG in `assets/images/`, (2) add the markdown image line, (3) rebuild. The PNG copy and path rewrite are automatic.
- `md2html.js` has NO figcaption/figure support — the alt text is the only "caption". Keep alt text terse (existing images use short descriptive alt like "Source repository vs distribution channel divergence").

## Verifying a build

- Grep `dist/index.html` for `src="images/<name>.png"` to confirm an image made it through.
- Caveat: the HTML is line-packed, so count distinct `src` refs; do NOT use `grep -c '<img'` (undercounts).
