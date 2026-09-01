# Timeline: Forty-Eight Hours

[← Back to report index](../README.md)

Once researchers recognized the malicious releases, the incident moved quickly. It went from malicious publication to public investigation and containment in roughly two days.

## Timeline

| Date | Event |
| --- | --- |
| May 14, 2026 | A public GitHub issue (#15) documents the malicious `12.0.1` package; researchers begin examining the releases, the publishing identity behind them, and the gap between npm and upstream. |
| May 14, 2026 | Defining clue identified: the GitHub project was still on `12.0.0`, while npm contained releases that did not belong to the same source history — a distribution path that had separated from the repository. |
| May 15, 2026 | The repository owner publicly confirms the malicious package is present on the official npm channel; write access is restricted; credentials other than the owner's are revoked; the malicious tarballs are reported removed. |

![Two-day shockwave timeline of the node-ipc incident](https://comdevopsai.github.io/node-ipc-post-incident/02-two-day-shockwave.png)

## Why the speed matters

Trust accumulates slowly while compromise can happen all at once. A change in publishing authority can alter what a familiar name delivers within hours.
