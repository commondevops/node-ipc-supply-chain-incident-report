# The Ghost in the Supply Chain

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

In May 2026, three malicious [node-ipc](https://www.npmjs.com/package/node-ipc) releases appeared on npm while the upstream project still showed 12.0.0. The malicious versions were 9.1.6, 9.2.3, and 12.0.1, published through the official npm distribution channel. The gap exposed how much modern software depends on trust outside the code we can see.

## Contents

### Part I — Background & The Incident

1. [What is node-ipc?](docs/what-is-node-ipc.md)
2. [Incident Overview & Background](docs/overview.md)
3. [Timeline: Forty-Eight Hours](docs/timeline.md)

### Part II — Investigation & Attribution

1. [Technical Attack Reconstruction](docs/technical-analysis.md)
2. [Maintainer Identity & Publishing Path](docs/maintainer-identity.md)
3. [Domain, Email & Registrar Evidence](docs/domain-email-registrar.md)

### Part III — Root Cause & Impact

1. [Root Cause Analysis](docs/root-cause.md)
2. [Impact & Threat Model](docs/impact.md)

### Part IV — Detection & Remediation

1. [Indicators & Detection Opportunities](docs/indicators.md)
2. [Remediation & Recommendations](docs/remediation.md)

### Part V — Reflection & Method

1. [Known Unknowns](docs/known-unknowns.md)
2. [Lessons Learned](docs/lessons-learned.md)
3. [Scope, Evidence Method & Register](docs/evidence-method.md)
4. [Common Devops & Our Involvement](docs/our-involvement.md)

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

## About this report

This is a structured, evidence-based incident report. Claims carry confidence ratings (Confirmed / Supported / Plausible / Not established); see Scope, Evidence Method & Register for the evidence register and method.

## Related Coverage

Independent analyses of this incident:

- [Datadog Security Labs](https://securitylabs.datadoghq.com/articles/node-ipc-npm-malware-analysis/) — malware analysis and payload breakdown
- [Socket.dev](https://socket.dev/blog/node-ipc-package-compromised) — package compromise detection and timeline
- [StepSecurity](https://www.stepsecurity.io/blog/node-ipc-npm-supply-chain-attack) — supply-chain attack writeup
