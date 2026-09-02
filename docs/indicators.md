# Indicators & Detection Opportunities

## Package and file indicators

`9.1.6`, `9.2.3`, and `12.0.1` are the three affected npm versions confirmed to contain the malicious CommonJS path. `node-ipc.cjs` is the compromised CommonJS entry point, while the ESM entry point `node-ipc.js` and the other source files were clean. The npm shasum `fe5d107b9d285327af579259a32977c4f475fa26` is reported for `12.0.1` in issue #15. An unexpected appended obfuscated IIFE after the legitimate bundle marks where the payload was inserted, after the legitimate `module.exports` boundary.

## Runtime indicators

The child environment marker `__ntw=1` is one of the environment guards reported in the reconstruction. The `__ntRun` guard/export marker reported in the reconstruction signals the payload's execution-guard behavior. The temporary `nt-*` staging directory is where staged archive material was placed before exfiltration. A collection of `envs.txt`, `uname.txt`, `/etc/hosts`, keys, history, and cloud/developer configuration reflects the credential-collection targets the payload attempted to read. A Node.js child process detached from the parent separates the malicious execution from the invoking process.

## Network indicators

`sh.azurestaticprovider.net` was identified in the issue discussion as the resolver/C2-related host. `azurestaticprovider.net` is the domain family associated with that C2 host, newly registered around the publication date. The DNS query-name suffix `bt.node.js` is the query-name suffix used by the reconstructed exfiltration protocol. The query prefixes `xh`, `xd`, and `xf` are the header/data/footer prefixes of the DNS query-name encoding. Anomalously long, high-entropy DNS labels signal encoded archive material carried in the query name rather than a normal lookup. Node.js processes sending DNS traffic to non-standard or explicitly configured resolvers indicate exfiltration attempts directed away from approved resolvers.

## Detection priorities

The highest-value defensive data sources are:

1. Dependency lockfiles, SBOMs, and package caches — let defenders confirm which environments resolved an affected version.
2. Process/module telemetry identifying CommonJS loads — can show whether the compromised entry point was actually loaded.
3. File-access telemetry around SSH/cloud/Kubernetes credentials — reveals whether credential files were read.
4. Temporary-directory creation/deletion — matches the `nt-*` staging behavior.
5. DNS logs retaining full query names — are required because the query name itself carries the exfiltrated data.
6. Firewall telemetry showing DNS outside approved resolvers — catches queries directed at the C2 host.
7. Credential-provider logs showing anomalous reuse after potential exposure — can detect whether exposed credentials were later used.
