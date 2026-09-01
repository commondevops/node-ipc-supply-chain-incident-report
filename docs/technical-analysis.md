# Technical Attack Reconstruction

[← Back to report index](../README.md)

This section reconstructs the technical behavior documented in the public incident record for the affected `node-ipc` releases (`9.1.6`, `9.2.3`, `12.0.1`). It separates what the code is demonstrated to do from what cannot be concluded without host, DNS, or receiver-side evidence.

## 1. Entry point and execution condition

The malicious code was appended to `node-ipc.cjs`, the CommonJS entry point. The ESM entry point `node-ipc.js` and the other source files were clean. This distinction matters operationally: package presence alone was not equivalent to malicious execution. The highest-risk condition was a consumer environment that resolved an affected version and then loaded the compromised CommonJS path.

A defensible exposure sequence is:

1. Affected version selected
2. Package downloaded or installed
3. Compromised CommonJS entry point loaded
4. Malicious code executed
5. Collection activity occurred
6. Archive was staged
7. DNS exfiltration queries were emitted
8. Remote receipt occurred

Only steps 1-3 can be inferred from dependency/package state. Steps 4-8 require progressively stronger host, DNS, or receiver-side evidence. A host that merely contains a malicious version may warrant investigation and secret rotation based on risk, but the forensic statement should not be upgraded to confirmed execution or confirmed data theft without supporting telemetry.

## 2. Reconnaissance and credential collection

The incident report documents collection of the following targets:

- OS platform, architecture, hostname, home directory, and temporary directory
- `uname -a`
- Process ID and working directory
- All environment variables
- `/etc/hosts`
- SSH keys and configuration
- Shell history and profiles
- Cloud-provider credentials and configuration
- Kubernetes configuration
- Application and developer configuration
- Source-control and package-management material
- Other files likely to contain secrets

This establishes **collection capability**. It does not establish which of these files actually existed on any specific victim host.

## 3. Staging and encoding

The payload was reconstructed as building a tar archive with a custom implementation and compressing the result with `zlib.gzipSync()`. The public reconstruction shows staging beneath a temporary `nt-*` path and includes a manifest-like `_paths.txt` file.

This design minimizes the number of independent outbound operations: many local files are normalized into a single compressed object before exfiltration.

## 4. DNS exfiltration design

The reconstructed code uses DNS query names as the data channel. It divides encoded archive material into chunks and constructs a header/data/footer sequence using prefixes such as:

| Prefix | Role |
|---|---|
| `xh` | Header |
| `xd` | Data |
| `xf` | Footer |

The issue discussion identifies `sh.azurestaticprovider.net` as the resolver/C2-related host and `bt.node.js` as the query suffix used by the reconstructed protocol.

The practical detection lesson is that defenders cannot restrict their analysis to DNS answers. **The query name itself is the payload carrier.**

## 5. Process behavior and cleanup

The public incident analysis reports a detached child process, environment guards such as `__ntw` / `__ntRun`, and deletion of staged temporary material. Those behaviors support stealth and execution separation.

The available evidence does **not** establish a durable autorun or persistence mechanism. Detaching a process from its parent is not, by itself, persistence across reboot or login.

## 6. C2 and DNS Infrastructure Investigation

The investigation also preserved WHOIS and DNS observations for `azurestaticprovider.net`, the domain family associated in the GitHub issue with `sh.azurestaticprovider.net`.

The captured WHOIS result shows:

| Field | Observed value |
|---|---|
| Creation date | 2026-05-14T07:26:10Z |
| Registrar | NICENIC INTERNATIONAL GROUP CO., LIMITED |
| Nameservers | `NS3.MY-NDNS.COM`, `NS4.MY-NDNS.COM` |
| Registrant | Privacy-redacted |

The creation timestamp falls on the same date as the malicious `node-ipc` publication. The same investigation captured DNS responses for the domain and its authoritative nameserver set.

The timing is suspicious and technically relevant, but timing alone does not establish operator identity. Likewise, later DNS misconfiguration or inconsistent referrals cannot prove evasive intent.
