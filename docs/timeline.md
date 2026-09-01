# Timeline: Forty-Eight Hours

[← Back to report index](../README.md)

Once researchers recognized the malicious releases, the incident moved quickly. It went from malicious publication to public investigation and containment in roughly two days.

## Master Timeline

At **2026-05-07 11:49:33Z**, the current registration for `atlantis-software.net` was created, as observed in preserved WHOIS output (evidence strength: High).

At **2026-05-14 07:26:10Z**, the creation timestamp for `azurestaticprovider.net` was observed in WHOIS (evidence strength: High).

At **2026-05-14 14:25:30** *(timezone unstated)*, an investigator reported the first malicious publish (`12.0.1`), followed by `9.2.3` and `9.1.6` at roughly 30-second intervals (evidence strength: Medium/High; investigator report).

At **2026-05-14 15:01:21Z**, GitHub security issue #15 was opened (evidence strength: High).

On **2026-05-14**, an independent investigator reported manual confirmation and npm security notification, and the affected version set expanded (evidence strength: High).

On **2026-05-15**, WHOIS, npm/GitHub profile, and DNS screenshots were preserved during investigation (evidence strength: High).

On **2026-05-15**, the repository owner reported restricting write access to himself (evidence strength: High as first-party remediation statement).

At **2026-05-16 13:43**, the final preserved reply from `a.tiertant@atlantis-software.net` was captured, with SPF and DKIM passing (evidence strength: High for mail infrastructure use).

At **2026-05-19 16:02 -0400**, a preservation request was sent to Namecheap (evidence strength: High).

At **2026-05-19 20:03Z**, Namecheap acknowledged the report (evidence strength: High).

At **2026-05-22 20:51Z**, Namecheap said the allegation could not be validated from supplied evidence and that legal process is required for preservation (evidence strength: High).

![Two-day shockwave timeline of the node-ipc incident](https://comdevopsai.github.io/node-ipc-post-incident/02-two-day-shockwave.png)

## Why the speed matters

Trust accumulates slowly while compromise can happen all at once. A change in publishing authority can alter what a familiar name delivers within hours.
