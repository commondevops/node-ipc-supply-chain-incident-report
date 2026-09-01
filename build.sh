#!/usr/bin/env bash
set -euo pipefail

# Build: compile all markdown docs into a single HTML page using scripts/md2html.js.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

OUT_DIR="$ROOT/dist"
OUT_FILE="$OUT_DIR/index.html"
mkdir -p "$OUT_DIR"

files=(
  "$ROOT/README.md"
  "$ROOT/docs/overview.md"
  "$ROOT/docs/timeline.md"
  "$ROOT/docs/technical-analysis.md"
  "$ROOT/docs/maintainer-identity.md"
  "$ROOT/docs/domain-email-registrar.md"
  "$ROOT/docs/root-cause.md"
  "$ROOT/docs/impact.md"
  "$ROOT/docs/indicators.md"
  "$ROOT/docs/remediation.md"
  "$ROOT/docs/known-unknowns.md"
  "$ROOT/docs/lessons-learned.md"
  "$ROOT/docs/evidence-method.md"
  "$ROOT/full-narrative.md"
)

for f in "${files[@]}"; do
  if [ ! -f "$f" ]; then
    echo "missing: $f" >&2
    exit 1
  fi
done

node "$ROOT/scripts/md2html.js" "${files[@]}" -o "$OUT_FILE"

echo "wrote $OUT_FILE ($(wc -c < "$OUT_FILE") bytes)"
