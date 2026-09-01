# Indicators & Detection Opportunities

[← Back to report index](../README.md)

## Package and file indicators

- Affected versions: `9.1.6`, `9.2.3`, `12.0.1`
- Malicious CommonJS path: `node-ipc.cjs`
- `12.0.1` npm shasum reported in issue: `fe5d107b9d285327af579259a32977c4f475fa26`
- Unexpected appended obfuscated IIFE after the legitimate bundle

## Runtime indicators

- Child environment marker `__ntw=1`
- `__ntRun` guard/export marker reported in reconstruction
- Temporary `nt-*` staging directory
- Collection of `envs.txt`, `uname.txt`, `/etc/hosts`, keys, history, and cloud/developer configuration
- Node.js child process detached from the parent

## Network indicators

- `sh.azurestaticprovider.net`
- `azurestaticprovider.net`
- DNS query-name suffix `bt.node.js`
- Query prefixes `xh`, `xd`, `xf`
- Anomalously long, high-entropy DNS labels
- Node.js processes sending DNS traffic to non-standard or explicitly configured resolvers

## Detection priorities

The highest-value defensive data sources are:

1. Dependency lockfiles, SBOMs, and package caches
2. Process/module telemetry identifying CommonJS loads
3. File-access telemetry around SSH/cloud/Kubernetes credentials
4. Temporary-directory creation/deletion
5. DNS logs retaining full query names
6. Firewall telemetry showing DNS outside approved resolvers
7. Credential-provider logs showing anomalous reuse after potential exposure
