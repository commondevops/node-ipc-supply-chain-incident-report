# Build & GitHub Pages Deployment

Repo: node-ipc-supply-chain-incident-report (default branch `main`)

- Build: `bash scripts/build.sh` at repo root. Runs `node scripts/md2html.js <14 markdown files> -o dist/index.html`. Uses js-yaml devDependency for YAML validation; package.json and package-lock.json are tracked, node_modules/ is gitignored. Output: single self-contained `dist/index.html` (~79KB). `dist/` is gitignored.
- GitHub Pages workflow: `.github/workflows/deploy-pages.yml` uses the modern "GitHub Actions" deployment model: `actions/upload-pages-artifact@v3` (path `dist`) + `actions/deploy-pages@v4`, environment name `github-pages`, permissions `pages:write` + `id-token:write`. Triggers: push to `main` + `workflow_dispatch`.
- One-time setup required: Settings > Pages > Source = "GitHub Actions". Without this, the workflow will not deploy.
