#!/usr/bin/env bash
set -euo pipefail

# Build: compile all markdown docs into a single HTML page using scripts/md2html.js.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

OUT_DIR="$ROOT/dist"
OUT_FILE="$OUT_DIR/index.html"
mkdir -p "$OUT_DIR"

files=(
  "$ROOT/README.md"
  "$ROOT/docs/01-background.md"
  "$ROOT/docs/02-incident-overview.md"
  "$ROOT/docs/03-impact.md"
  "$ROOT/docs/04-technical-analysis.md"
  "$ROOT/docs/05-attribution.md"
  "$ROOT/docs/06-root-cause.md"
  "$ROOT/docs/07-detection.md"
  "$ROOT/docs/08-remediation.md"
  "$ROOT/docs/09-lessons-learned.md"
  "$ROOT/docs/A-known-unknowns.md"
  "$ROOT/docs/B-evidence-method.md"
  "$ROOT/docs/C-about-authors.md"
)

for f in "${files[@]}"; do
  if [ ! -f "$f" ]; then
    echo "missing: $f" >&2
    exit 1
  fi
done

node "$ROOT/scripts/md2html.js" "${files[@]}" -o "$OUT_FILE"

# Copy image assets into dist/
mkdir -p "$ROOT/dist/images"
cp "$ROOT/assets/images-web/"*.jpeg "$ROOT/dist/images/"
echo "Images copied to dist/images/"
ls -la "$ROOT/dist/images/"

echo "wrote $OUT_FILE ($(wc -c < "$OUT_FILE") bytes)"
