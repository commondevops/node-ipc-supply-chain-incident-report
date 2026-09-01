# Timeline: Forty-Eight Hours

[← Back to report index](../README.md)

Once researchers recognized the malicious releases, the incident moved quickly. It went from malicious publication to public investigation and containment in roughly two days.

## Master Timeline

| Date / time | Event | Evidence strength |
|---|---|---|
| **2026-05-07 11:49:33Z** | Current registration for `atlantis-software.net` created, as observed in preserved WHOIS output | High |
| **2026-05-14 07:26:10Z** | `azurestaticprovider.net` creation timestamp observed in WHOIS | High |
| **2026-05-14 14:25:30** *(timezone unstated)* | Investigator reports first malicious publish (`12.0.1`), followed by `9.2.3` and `9.1.6` at roughly 30-second intervals | Medium/High; investigator report |
| **2026-05-14 15:01:21Z** | GitHub security issue #15 opened | High |
| **2026-05-14** | Independent investigator reports manual confirmation and npm security notification; affected version set expands | High |
| **2026-05-15** | WHOIS, npm/GitHub profile, and DNS screenshots preserved during investigation | High |
| **2026-05-15** | Repository owner reports restricting write access to himself | High as first-party remediation statement |
| **2026-05-16 13:43** | Final preserved reply from `a.tiertant@atlantis-software.net`; SPF and DKIM pass | High for mail infrastructure use |
| **2026-05-19 16:02 -0400** | Preservation request sent to Namecheap | High |
| **2026-05-19 20:03Z** | Namecheap acknowledges report | High |
| **2026-05-22 20:51Z** | Namecheap says allegation could not be validated from supplied evidence and legal process is required for preservation | High |

![Two-day shockwave timeline of the node-ipc incident](https://comdevopsai.github.io/node-ipc-post-incident/02-two-day-shockwave.png)

## Why the speed matters

Trust accumulates slowly while compromise can happen all at once. A change in publishing authority can alter what a familiar name delivers within hours.
