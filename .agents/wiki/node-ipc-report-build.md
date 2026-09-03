# node-ipc report build system

Repo: `node-ipc Supply Chain Incident Report` paper. Single-page HTML built from ordered markdown.

## Build order is driven ONLY by scripts/build.sh array

- The reading/section order of the compiled page = the ordered `files=(...)` bash array in `scripts/build.sh` (currently 20 entries, lines 12-33).
- Reordering that array reorders the single-page output `dist/index.html`. Nothing else controls order.
- README.md `## Contents` block is HUMAN-FACING only; it does NOT drive build order. Keep it in sync manually if you regroup.

## Section ids = slug of filename basename

- `scripts/md2html.js` renders each input .md as one `<section id="...">`.
- id = `slug(basename without extension)` (lowercase, spaces->-, strip non [a-z0-9-]). See `processFiles` (line 401) + `slug()` (line 45).
- On collision, `uniqueId()` appends `-1`, `-2`, ... (line 72). So basenames MUST stay unique or ids collide.
- Internal .md links are rewritten to in-page anchors only when target basename slug matches a rendered section id (`rewriteHref`, line 90).

## No doc-to-doc .md cross-links exist

- The ONLY `.md` references in the repo live in README.md `## Contents` and the build.sh `files=(...)` array.
- Individual docs/*.md files contain no links to other docs (only external URLs). Verified: evidence-method.md, our-involvement.md.
- Implication: reordering/regrouping sections is SAFE (no link fixes needed). But RENAMING or MOVING a file breaks BOTH the README Contents links AND the build.sh path.

## Part-divider convention (auto-detected)

- Files named `docs/part-NN.md` are auto-detected by basename regex `/^part-\d+\.md$/` in `renderSection` (line 386).
- They render with `class="part-divider"` -> distinct group-header CSS (bigger h1, left accent border, no underline; lines 455-463).
- Any new file matching `part-NN.md` becomes a styled divider automatically. No config needed.

## Build + verify loop

```
bash scripts/build.sh
# -> writes dist/index.html AND copies assets/images/*.png to dist/images/
grep -o '<section id="[^"]*"' dist/index.html   # verify section order
```

- build.sh validates every file exists (exits 1 on missing) before running `node scripts/md2html.js "${files[@]}" -o dist/index.html`.
