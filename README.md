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

## Contents

- [Incident Overview & Background](docs/overview.md)
- [Timeline: Forty-Eight Hours](docs/timeline.md)
- [Root Cause Analysis](docs/root-cause.md)
- [Impact & Threat Model](docs/impact.md)
- [Remediation & Recommendations](docs/remediation.md)
- [Lessons Learned](docs/lessons-learned.md)
- [Full Narrative (original long-read)](full-narrative.md)

## About this report

This is a structured incident report built from the original long-read. The full original narrative is preserved unchanged in [full-narrative.md](full-narrative.md).
