# node-ipc Supply Chain Incident Report

*A structured, evidence-based report of the node-ipc supply chain incident.*

## Executive Summary

In May 2026, three malicious [node-ipc](https://www.npmjs.com/package/node-ipc) releases—9.1.6, 9.2.3, and 12.0.1—appeared on [npm](https://www.npmjs.com) while the upstream project still showed 12.0.0, published through the official distribution channel.
The root cause was unauthorized use of valid npm publishing authority tied to a dormant maintainer identity whose email domain (`atlantis-software.net`) had lapsed and been re-registered.
The incident was detected through public [GitHub issue #15](https://github.com/RIAEvangelist/node-ipc/issues/15) and contained within two days.
This report reconstructs the technical behavior, the attribution evidence, the root cause, and the detection and remediation path; every claim carries a confidence rating (definitions in Appendix B).

## Contents

1. [Background](docs/01-background.md)
   1. What is node-ipc?
   2. The source-vs-distribution gap
2. [Incident Overview](docs/02-incident-overview.md)
   1. Incident record
   2. Timeline
3. [Impact Assessment](docs/03-impact.md)
   1. Why the developer environment is the target
   2. How trust propagates through the supply chain
   3. Capability vs impact & exposure states
4. [Technical Analysis](docs/04-technical-analysis.md)
   1. Entry point and execution condition
   2. Reconnaissance and credential collection
   3. Staging and encoding
   4. DNS exfiltration design
   5. Process behavior and cleanup
   6. C2 and DNS infrastructure investigation
5. [Attribution & Evidence](docs/05-attribution.md)
   1. Maintainer identity & publishing path
   2. Domain, email & registrar evidence
6. [Root Cause Analysis](docs/06-root-cause.md)
   1. Unmonitored identity infrastructure
   2. Root-cause statement
7. [Detection & Indicators](docs/07-detection.md)
   1. Package and file indicators
   2. Runtime indicators
   3. Network indicators
   4. Detection priorities
8. [Remediation & Recommendations](docs/08-remediation.md)
   1. Corrective & Preventive Actions
   2. Trust-path analysis
9. [Lessons Learned](docs/09-lessons-learned.md)
   1. Exploiting existing trust
   2. Trust is a property of the supply chain, not the package name
   3. Findings at a Glance
   4. Conclusion

### Appendices

- [Appendix A — Known Unknowns](docs/A-known-unknowns.md)
- [Appendix B — Scope, Evidence Method & Register](docs/B-evidence-method.md)
- [Appendix C — About the Authors](docs/C-about-authors.md)

## Key Facts

| Field | Value |
| --- | --- |
| Package | node-ipc |
| Upstream version | 12.0.0 |
| Malicious versions | 9.1.6, 9.2.3, 12.0.1 |
| Incident date | 2026-05-14 |
| Contained by | 2026-05-15 |
| Detection | Public GitHub issue #15 |
| Root cause | Dormant maintainer identity tied to lapsed domain atlantis-software.net |
| 12.0.1 shasum | fe5d107b9d285327af579259a32977c4f475fa26 |
| Malicious entry point | node-ipc.cjs (CommonJS); ESM node-ipc.js clean |

## About this report

This is a structured, evidence-based incident report.
Claims carry confidence ratings (Confirmed / Supported / Plausible / Not established); see Appendix B (Scope, Evidence Method & Register) for the evidence register and method.

| Field | Value |
| --- | --- |
| Published | 2026-08-30 |
| Incident date | 2026-05-14 |
| Contained by | 2026-05-15 |
| Severity | CRITICAL |
| Category | Software Supply Chain |
| Author | Common Devops |

## Related Coverage

Independent analyses of this incident:

- [Datadog Security Labs](https://securitylabs.datadoghq.com/articles/node-ipc-npm-malware-analysis/) — malware analysis and payload breakdown
- [Socket.dev](https://socket.dev/blog/node-ipc-package-compromised) — package compromise detection and timeline
- [StepSecurity](https://www.stepsecurity.io/blog/node-ipc-npm-supply-chain-attack) — supply-chain attack writeup
