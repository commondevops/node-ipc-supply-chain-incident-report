# The Trusted npm Package That Turned Malicious

**node-ipc Supply Chain Incident Report — a structured post-incident document**

| Field | Value |
| --- | --- |
| Published | August 30, 2026 |
| Incident date | May 14, 2026 |
| Contained by | May 15, 2026 |
| Severity | CRITICAL |
| Category | Software Supply Chain |
| Author | Common Devops |

## Executive Summary

In May 2026, three malicious node-ipc releases appeared on npm while the upstream project still showed 12.0.0. The malicious versions were 9.1.6, 9.2.3, and 12.0.1, published through the official npm distribution channel. The gap exposed how much modern software depends on trust outside the code we can see.

## Key Facts

| Field | Value |
| --- | --- |
| Package | node-ipc |
| Upstream version | 12.0.0 |
| Malicious versions | 9.1.6, 9.2.3, 12.0.1 |
| Incident date | May 14, 2026 |
| Contained by | May 15, 2026 |
| Detection | Public GitHub issue #15 |
| Root cause | Dormant maintainer identity tied to lapsed domain atlantis-software.net |
| 12.0.1 shasum | fe5d107b9d285327af579259a32977c4f475fa26 |
| Malicious entry point | node-ipc.cjs (CommonJS); ESM node-ipc.js clean |

## Contents

1. [Incident Overview & Background](docs/overview.md)
2. [Timeline: Forty-Eight Hours](docs/timeline.md)
3. [Technical Attack Reconstruction](docs/technical-analysis.md)
4. [Maintainer Identity & Publishing Path](docs/maintainer-identity.md)
5. [Domain, Email & Registrar Evidence](docs/domain-email-registrar.md)
6. [Root Cause Analysis](docs/root-cause.md)
7. [Impact & Threat Model](docs/impact.md)
8. [Indicators & Detection Opportunities](docs/indicators.md)
9. [Remediation & Recommendations](docs/remediation.md)
10. [Known Unknowns](docs/known-unknowns.md)
11. [Lessons Learned](docs/lessons-learned.md)
12. [Scope, Evidence Method & Register](docs/evidence-method.md)
13. [Full Narrative (original long-read)](assets/full-narrative.md)

## About this report

This is a structured incident report built from the original long-read. The full original narrative is preserved unchanged in [full-narrative.md](assets/full-narrative.md).
