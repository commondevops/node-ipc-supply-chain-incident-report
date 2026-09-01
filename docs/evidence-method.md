# Scope, Evidence Method & Register

[← Back to report index](../README.md)

## 1. Scope

This report reconstructs four related questions:

- What malicious behavior was present in the affected `node-ipc` npm releases?
- What evidence connects the publication event to a maintainer publishing identity?
- What did the independent domain, DNS, and email investigation establish?
- Which causal claims are supported, plausible, or still unresolved?

The report does **not** attempt to identify a specific human actor. It also does not claim victim compromise without victim-specific telemetry.

## 2. Evidence classes

The analysis uses three evidence classes.

| Class | Meaning | Examples in this report |
|---|---|---|
| **Primary / direct** | Original records or contemporaneous artifacts | GitHub issue/comments, original screenshots, original email thread, full message headers, Namecheap correspondence |
| **Corroborating technical** | Independent technical observations consistent with primary evidence | Package reconstruction in the issue, DNS/WHOIS observations, npm/GitHub profile captures |
| **Inference** | Explanation that connects established observations | Domain reacquisition used for npm password recovery; operator identity; motive |

A primary record can still contain an investigator's hypothesis. The classification applies to the **claim**, not simply to the document containing it.

## 3. Confidence language

- **Confirmed / High** - directly supported by primary evidence or multiple independent observations.
- **Supported / Medium** - evidence is consistent and meaningful but incomplete.
- **Plausible / Low** - a reasonable explanation, but a required causal link is absent.
- **Not established** - the available evidence does not support the claim.

## 4. Evidence register (Appendix A)

| ID | Artifact | Role | SHA-256 |
|---|---|---|---|
| E-01 | GitHub issue `RIAEvangelist/node-ipc#15` and comments | Primary public incident record | URL-based source |
| E-02 | `NODE-IPC.pdf` | Compiled investigation screenshots | `5947a56cf21ebfe84a2f058363cc7fa6437ca7bfab84ea51eed862546a62fadc` |
| E-03 | `Attachments.zip` | Original screenshot archive | `3ffb9b66c8cbffc1a763d8930bca775050f3596591cdcd3057861525aabd39e5` |
| E-04 | `digiNow.Mail.-.Node-IPC.breach.pdf` | Preserved mailbox exchange | `02a4d49183f2e8b8de9b1dde20918af38fc0c011174cba103877c83e875e27b1` |
| E-05 | `Original.Message.3.pdf` | Full original-message/header export | `30fd5dc7683ff00fb3c363b109a1f0fc1fd2ebe45ff1f9b5131f457cba164768` |
| E-06 | `Urgent preservation request_ ... .eml` | Initial Namecheap preservation request | `ec82dc8dd1501188e35af3fa5fd1de1157cd6c3cfd30d208d39f4ba95671bfe9` |
| E-07 | `[NC-HHL-2847] ... (1).eml` | Namecheap acknowledgement | `94b4e53d04de427990e54a676412c4ffa9938ad42881b436dcf6f357ea475144` |
| E-08 | `Re_ [NC-HHL-2847] ... .eml` | Investigator follow-up | `64f7e0b064aabc663b0870033b791bd1bc369f4e817be4962714cd45a0da3ad2` |
| E-09 | `[NC-HHL-2847] ... .eml` | Namecheap final response | `add337e740d20c0080c41dc53034021fde2930e577309aed9cf7cb3645b41265` |

## 5. Primary source notes (Appendix B)

**GitHub Issue #15**
`https://github.com/RIAEvangelist/node-ipc/issues/15`

Use of the issue is claim-specific. Technical observations from the original report are treated as primary incident-analysis evidence. Investigator statements about account takeover remain investigator hypotheses unless independently supported.

**Email evidence**
SPF and DKIM results demonstrate authorized domain-mail infrastructure use for the preserved message. They do not identify the human sender.

**WHOIS/DNS screenshots**
The screenshots document what queried services returned during the investigation. They do not prove historical state outside the query time, actor ownership, or malicious intent.

**Preservation correspondence**
The correspondence proves submission, acknowledgement, and Namecheap's stated legal-process requirement. It does not prove that preservation occurred.
