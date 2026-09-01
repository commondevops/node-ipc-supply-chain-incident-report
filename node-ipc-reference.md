---
title: "node-ipc 2026 Supply-Chain Compromise"
subtitle: "Evidence-Based Technical Investigation Report"
organization: "Common DevOps"
date: "2026-09-01"
status: "Reference Report"
---

# Executive Summary

On 14 May 2026, investigators reported that malicious code had been appended to the CommonJS distribution of the npm package `node-ipc`. The public GitHub security issue identified `node-ipc@12.0.1` and described an obfuscated credential-stealing payload placed after the legitimate CommonJS bundle. Contemporaneous comments expanded the affected set to `9.2.3` and `9.1.6`.

The evidence reviewed for this report supports six high-confidence technical conclusions:

1. **Malicious npm artifacts were published under the `node-ipc` package name.** The public incident record identifies three affected versions: `9.1.6`, `9.2.3`, and `12.0.1`.
2. **The malicious payload was attached to the CommonJS entry point.** The issue reports that `node-ipc.cjs` contained the appended payload while the ESM entry point was clean.
3. **The payload was designed to collect credentials and host information.** The documented collection targets include environment variables, SSH material, cloud and Kubernetes configuration, shell history, application configuration, and other files likely to contain credentials.
4. **The payload implemented DNS-based exfiltration.** The reconstructed behavior stages collected data into a gzip-compressed tar archive, encodes it, divides it into chunks, and places those chunks into DNS query names.
5. **A maintainer identity with valid npm publishing authority was involved in the malicious publication path.** GitHub investigators reported that the malicious tarballs carried `_npmUser: atiertant` and the email `a.tiertant@atlantis-software.net`.
6. **The exact mechanism by which unauthorized control of that publishing authority was obtained is not proven by the available evidence.** Re-registration of `atlantis-software.net`, operation of the associated mailbox, and authenticated email from that domain make an email-account-recovery path plausible, but no npm password-reset or audit log has been produced.

The most important evidentiary boundary is this:

> **Capability is not impact.** A malicious package containing credential collection and DNS exfiltration code does not, by itself, prove that a specific consumer executed the payload, that credentials were collected from that consumer, or that data was successfully received by a remote operator.

This report therefore treats the incident as a **confirmed software supply-chain compromise with confirmed credential-theft and DNS-exfiltration capability**, while victim-specific execution, successful data receipt, the exact account-takeover mechanism, and actor attribution remain unconfirmed.


## Findings at a Glance

| Finding | Assessment | Confidence |
|---|---|---|
| Malicious npm artifacts published | Confirmed | High |
| CommonJS distribution contained appended payload | Confirmed | High |
| Credential collection capability | Confirmed | High |
| DNS query-name exfiltration capability | Confirmed | High |
| Valid maintainer publishing authority abused | Supported | High |
| Email-domain recovery caused npm takeover | Plausible, not proven | Medium/Low |
| Successful victim data receipt | Not established | Unknown |
| Human actor attribution | Not established | Unknown |

# 1. Scope and Evidence Method

## 1.1 Scope

This report reconstructs four related questions:

- What malicious behavior was present in the affected `node-ipc` npm releases?
- What evidence connects the publication event to a maintainer publishing identity?
- What did the independent domain, DNS, and email investigation establish?
- Which causal claims are supported, plausible, or still unresolved?

The report does **not** attempt to identify a specific human actor. It also does not claim victim compromise without victim-specific telemetry.

## 1.2 Evidence classes

The analysis uses three evidence classes.

| Class | Meaning | Examples in this report |
|---|---|---|
| **Primary / direct** | Original records or contemporaneous artifacts | GitHub issue/comments, original screenshots, original email thread, full message headers, Namecheap correspondence |
| **Corroborating technical** | Independent technical observations consistent with primary evidence | Package reconstruction in the issue, DNS/WHOIS observations, npm/GitHub profile captures |
| **Inference** | Explanation that connects established observations | Domain reacquisition used for npm password recovery; operator identity; motive |

A primary record can still contain an investigator's hypothesis. The classification applies to the **claim**, not simply to the document containing it.

## 1.3 Confidence language

- **Confirmed / High** - directly supported by primary evidence or multiple independent observations.
- **Supported / Medium** - evidence is consistent and meaningful but incomplete.
- **Plausible / Low** - a reasonable explanation, but a required causal link is absent.
- **Not established** - the available evidence does not support the claim.

# 2. Incident Overview

The public incident began with GitHub issue #15, opened on **14 May 2026 at 15:01:21Z**, titled *"[SECURITY][REPORT] node-ipc@12.0.1 CJS bundle contains obfuscated infostealer payload."* The report states that malicious code had been appended to the CommonJS bundle after the legitimate `module.exports` boundary.

The issue documents a package shasum for `12.0.1` of:

`fe5d107b9d285327af579259a32977c4f475fa26`

The original analysis identified:

- system reconnaissance;
- full environment-variable collection;
- sensitive-file harvesting;
- custom tar archive creation;
- gzip compression;
- DNS-based data exfiltration;
- child-process detachment and re-execution guards;
- temporary-file cleanup and silent failure behavior.

A researcher responding to the issue reported manually confirming the compromise and notifying npm security. The same thread identified `9.2.3`, `12.0.1`, and then `9.1.6` as affected.

## 2.1 Affected versions

| Version | Evidence | Assessment |
|---|---|---|
| `9.1.6` | Added in contemporaneous GitHub issue discussion | Confirmed affected in incident record |
| `9.2.3` | Reported by independent investigator in GitHub issue | Confirmed affected in incident record |
| `12.0.1` | Original issue and technical analysis | Confirmed affected |

The investigation record also reports a rapid three-release sequence: `12.0.1`, followed roughly 30 seconds later by `9.2.3`, then roughly 30 seconds later by `9.1.6`. The comment gives a first clock time of **14:25:30** but does not state a timezone; this report does not invent one.

# 3. Technical Attack Reconstruction

## 3.1 Entry point and execution condition

The issue states that the malicious code existed in `node-ipc.cjs`, the CommonJS entry point, while the ESM entry point `node-ipc.js` and other source files were clean.

That distinction matters operationally. Package presence alone was not equivalent to malicious execution. The highest-risk condition was a consumer environment that resolved an affected npm version and then loaded the compromised CommonJS path.

A defensible exposure sequence is:

1. affected version selected;
2. package downloaded or installed;
3. compromised CommonJS entry point loaded;
4. malicious code executed;
5. collection activity occurred;
6. archive was staged;
7. DNS exfiltration queries were emitted;
8. remote receipt occurred.

Only steps 1-3 can be inferred from dependency/package state. Steps 4-8 require progressively stronger host, DNS, or receiver-side evidence.

## 3.2 Reconnaissance and credential collection

The incident report describes collection of:

- OS platform, architecture, hostname, home directory, and temporary directory;
- `uname -a`;
- process ID and working directory;
- all environment variables;
- `/etc/hosts`;
- SSH keys and configuration;
- shell history and profiles;
- cloud-provider credentials and configuration;
- Kubernetes configuration;
- application and developer configuration;
- source-control and package-management material;
- other files likely to contain secrets.

The evidence establishes **collection capability**. It does not establish which files existed on any specific victim host.

## 3.3 Staging and encoding

The payload was reconstructed as building a tar archive with a custom implementation and compressing the result with `zlib.gzipSync()`. The public reconstruction shows staging beneath a temporary `nt-*` path and includes a manifest-like `_paths.txt` file.

This design minimizes the number of independent outbound operations: multiple local files are normalized into a single compressed object before exfiltration.

## 3.4 DNS exfiltration design

The reconstructed code uses DNS query names as the data channel. It divides encoded archive material into chunks and constructs a header/data/footer sequence using prefixes such as:

- `xh` - header;
- `xd` - data;
- `xf` - footer.

The issue discussion identifies `sh.azurestaticprovider.net` as the resolver/C2-related host and `bt.node.js` as the query suffix used by the reconstructed protocol.

The practical detection lesson is that defenders cannot restrict their analysis to DNS answers. **The query name itself is the payload carrier.**

## 3.5 Process behavior and cleanup

The public incident analysis reports a detached child process, environment guards such as `__ntw` / `__ntRun`, and deletion of staged temporary material. Those behaviors support stealth and execution separation.

The available evidence does **not** establish a durable autorun or persistence mechanism. Detaching a process from its parent is not, by itself, persistence across reboot or login.

# 4. Maintainer Identity and Publishing Path

The strongest public connection between the malicious npm artifacts and a maintainer identity appears in the GitHub investigation thread. Investigators reported that the malicious tarballs contained:

`_npmUser: atiertant`

with:

`a.tiertant@atlantis-software.net`

One investigator described this as a likely "Email Takeover." Another later comment explicitly acknowledged uncertainty: the domain had expired, it was registered again, and the attacker **likely** used the mailbox to reset the npm password.

That distinction is critical. The evidence supports the following:

- `atiertant` was a known maintainer identity associated with `node-ipc`;
- investigators reported that the malicious tarballs carried `atiertant` npm publisher metadata;
- the public/display email associated with that npm identity used `atlantis-software.net`;
- the domain was under a new/current registration before the malicious publication;
- PrivateEmail infrastructure was configured and the mailbox was demonstrably capable of sending authenticated mail after the incident.

The evidence does **not** include:

- npm password-reset records;
- npm login IPs;
- npm MFA/recovery logs;
- a registrar account login history tying domain control to the npm publisher session;
- human identity evidence for the mailbox operator.

Therefore, the most defensible causal statement is:

> **The incident was enabled by valid npm publishing authority associated with a maintainer identity. Domain reacquisition and mailbox control provide a plausible account-recovery path, but the exact mechanism of npm account takeover remains unresolved.**

## 4.1 Contemporaneous profile evidence

The investigator screenshot below preserved the GitHub profile associated with `atiertant` during the investigation.

![GitHub profile evidence](assets/github-atiertant-profile.png)

*Figure 1. Contemporaneous investigator screenshot of the GitHub profile associated with `atiertant`. Source: original May 2026 screenshot archive.*

The profile capture is contextual evidence. It establishes how the account and associated projects appeared during the investigation; it does not prove that the GitHub account itself was compromised or used to publish the npm malware.

# 5. Domain Registration Investigation

## 5.1 `atlantis-software.net`

A contemporaneous WHOIS screenshot preserved by the investigator shows:

- domain: `ATLANTIS-SOFTWARE.NET`;
- registrar: Namecheap, Inc.;
- creation date: **2026-05-07T11:49:33Z**;
- nameservers: `DNS1.REGISTRAR-SERVERS.COM` and `DNS2.REGISTRAR-SERVERS.COM`;
- privacy-protected registrant details.

![atlantis-software.net WHOIS evidence](assets/atlantis-whois.png)

*Figure 2. Investigator WHOIS capture for `atlantis-software.net`. The observed current registration creation timestamp is 2026-05-07T11:49:33Z.*

This screenshot materially strengthens the May 7 date because it is a contemporaneous capture of registry/registrar output rather than a later narrative recollection.

A GitHub comment elsewhere in the incident thread asserted a **2026-03-10** re-registration date. A later investigator comment stated **2026-05-07** and said the exact prior expiry could not be determined. The primary screenshot and the subsequent preservation request both support the May 7 creation timestamp for the registration visible during the incident.

Accordingly:

- **Current registration creation timestamp observed:** 2026-05-07T11:49:33Z - High confidence.
- **Exact date the prior registration expired:** Not established.
- **Historical "re-registration" chronology before May 7:** Not fully established from the preserved evidence.

# 6. Email Evidence and Mailbox Control

Email evidence is central because the account-recovery hypothesis depends on the ability to receive and send mail as `a.tiertant@atlantis-software.net`.

## 6.1 Direct exchange with the mailbox

A preserved six-message thread shows the repository owner emailing `a.tiertant@atlantis-software.net` after the incident became public. Replies were received from that address.

The exchange included short responses such as "meow" and "hehe." The owner then asked whether the sender had acquired the server and found credentials. The final reply was "Sayonara, friend."

![Mailbox exchange](assets/mailbox-thread-excerpt.png)

*Figure 3. Preserved email-thread excerpt. The operator of `a.tiertant@atlantis-software.net` replied after the node-ipc incident. The response does not admit how the npm publishing authority was obtained.*

The evidentiary value is **operational mailbox control**, not confession. The final response does not admit server acquisition, password recovery, npm access, or malware publication.

## 6.2 Authentication of the final reply

The original-message export for the final reply records:

- Message-ID: `<1535103746.754187.1778957015937@privateemail.com>`;
- created: **16 May 2026 at 1:43 PM**;
- From: `a.tiertant@atlantis-software.net`;
- mailer: Open-Xchange Mailer v7.10.6-Rev91;
- SPF: **PASS** with IP `198.54.127.77`;
- DKIM: **PASS** with domain `atlantis-software.net`;
- DMARC: **FAIL**.

![Authenticated mail header](assets/authenticated-mail-header.png)

*Figure 4. Original-message authentication summary for the 16 May reply. SPF and DKIM support authorized use of the domain's mail infrastructure; DMARC failed.*

SPF/DKIM success is meaningful because it shows that the message was sent through infrastructure authorized for the domain and carried a valid domain signature at that time.

It does **not** authenticate the human identity of the sender. Domain control and identity are separate propositions.

# 7. Preservation Request and Registrar Response

On **19 May 2026**, a preservation request was sent to Namecheap regarding `atlantis-software.net`. It supplied the observed registration timestamp, relevant mailbox, incident link, three PrivateEmail Message-IDs, and two outbound relay observations.

![Preservation request evidence](assets/preservation-request-evidence.png)

*Figure 5. Structured rendering of the 19 May preservation request. The original `.eml` is retained as evidence.*

The request asked Namecheap to preserve:

- domain registration-account details;
- registrar login IPs and user agents;
- account creation, recovery, and password-reset events;
- DNS and mail-record history;
- mailbox creation time;
- webmail sessions;
- SMTP submission logs;
- DKIM signing records;
- support/recovery records;
- related abuse or fraud flags.

Namecheap acknowledged receipt on 19 May and stated that the report would be reviewed.

On **22 May 2026**, Namecheap responded that it had investigated "to the extent of our capabilities" but could not validate the allegation from the supplied evidence. It requested additional evidence and stated that preservation requests are processed upon receipt of a **U.S. court order or subpoena** by the Senior Legal department.

This produces a precise legal/evidentiary boundary:

- a preservation request was submitted;
- Namecheap acknowledged and reviewed it;
- the available correspondence does **not** establish that the requested records were preserved;
- no registrar account, webmail-session, or npm-recovery logs were obtained through this process.

# 8. C2 and DNS Infrastructure Investigation

The investigation also preserved WHOIS and DNS observations for `azurestaticprovider.net`, the domain family associated in the GitHub issue with `sh.azurestaticprovider.net`.

The captured WHOIS result shows:

- creation date: **2026-05-14T07:26:10Z**;
- registrar: NICENIC INTERNATIONAL GROUP CO., LIMITED;
- nameservers: `NS3.MY-NDNS.COM` and `NS4.MY-NDNS.COM`;
- privacy-redacted registrant information.

![azurestaticprovider.net WHOIS](assets/azurestaticprovider-whois.png)

*Figure 6. Contemporaneous WHOIS capture for `azurestaticprovider.net`. The creation timestamp falls on the same date as the malicious node-ipc publication.*

The same investigation captured DNS responses for the domain and its authoritative nameserver set.

![DNS evidence](assets/azurestaticprovider-dns.png)

*Figure 7. Investigator DNS capture for `azurestaticprovider.net`, preserving NS/SOA observations made during the incident investigation.*

The timing is suspicious and technically relevant, but timing alone does not establish operator identity. Likewise, later DNS misconfiguration or inconsistent referrals cannot prove evasive intent.

# 9. Master Timeline

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

# 10. Impact and Exposure Assessment

The incident should be evaluated as a sequence of increasingly strong impact states.

| State | What it proves | Status in this investigation |
|---|---|---|
| Malicious version published | Supply-chain compromise exists | **Confirmed** |
| Package selected/downloaded | Potential consumer exposure | Environment-specific |
| Compromised CJS loaded | Malicious runtime path reached | Requires victim evidence |
| Collection observed | Host secrets actually read | Requires victim evidence |
| Archive staged | Collection pipeline progressed | Requires victim evidence |
| DNS exfil queries emitted | Exfiltration attempt occurred | Requires DNS/host evidence |
| Remote receipt proven | Attacker received victim data | **Not established** |

This distinction is operationally important for incident response. A host that merely contains a malicious package may warrant investigation and secret rotation based on risk, but the forensic statement should not be upgraded to "confirmed data theft" without supporting telemetry.

# 11. Indicators and Detection Opportunities

## 11.1 Package and file indicators

- affected versions: `9.1.6`, `9.2.3`, `12.0.1`;
- malicious CommonJS path: `node-ipc.cjs`;
- `12.0.1` npm shasum reported in issue: `fe5d107b9d285327af579259a32977c4f475fa26`;
- unexpected appended obfuscated IIFE after the legitimate bundle.

## 11.2 Runtime indicators

- child environment marker `__ntw=1`;
- `__ntRun` guard/export marker reported in reconstruction;
- temporary `nt-*` staging directory;
- collection of `envs.txt`, `uname.txt`, `/etc/hosts`, keys, history, and cloud/developer configuration;
- Node.js child process detached from the parent.

## 11.3 Network indicators

- `sh.azurestaticprovider.net`;
- `azurestaticprovider.net`;
- DNS query-name suffix `bt.node.js`;
- query prefixes `xh`, `xd`, `xf`;
- anomalously long, high-entropy DNS labels;
- Node.js processes sending DNS traffic to non-standard or explicitly configured resolvers.

## 11.4 Detection priorities

The highest-value defensive data sources are:

1. dependency lockfiles, SBOMs, and package caches;
2. process/module telemetry identifying CommonJS loads;
3. file-access telemetry around SSH/cloud/Kubernetes credentials;
4. temporary-directory creation/deletion;
5. DNS logs retaining full query names;
6. firewall telemetry showing DNS outside approved resolvers;
7. credential-provider logs showing anomalous reuse after potential exposure.

# 12. Causal Analysis

A useful causal model separates what is demonstrated from what is hypothesized.

## 12.1 Demonstrated chain

**Valid npm publishing authority -> malicious npm versions -> vulnerable dependency resolution -> compromised CommonJS execution path -> credential collection + DNS-exfiltration capability**

Every arrow after package publication remains conditional on the consumer environment until victim-specific telemetry is available.

## 12.2 Plausible but unproven identity chain

**Expired/lapsed maintainer email domain -> new registration -> mailbox operation -> npm account recovery -> use of publisher authority**

The evidence directly supports the middle observations - a May 7 registration and later operational mailbox - but does not contain the npm recovery event required to close the chain.

## 12.3 Root-cause statement

A technically defensible root-cause formulation is:

> **Unauthorized use of valid npm publishing authority associated with a maintainer identity allowed malicious package artifacts to enter the official distribution channel. The exact credential-recovery or account-takeover mechanism is unresolved.**

# 13. Corrective and Preventive Actions

## Immediate

- remove or disable stale publisher identities;
- rotate credentials present on systems that executed affected CommonJS versions;
- hunt package caches, lockfiles, CI environments, and developer workstations for affected versions;
- block or investigate the documented DNS indicators;
- preserve relevant DNS, process, endpoint, and identity telemetry.

## Near term

- require phishing-resistant MFA for publisher accounts where available;
- review account-recovery channels separately from login MFA;
- inventory maintainer email domains and alert on expiration or ownership changes;
- minimize long-lived secrets in environment variables and developer home directories;
- restrict DNS egress to approved resolvers;
- detect high-entropy DNS query labels and non-standard DNS destinations;
- compare published package contents against expected source/build artifacts.

## Strategic

- establish formal publisher lifecycle governance;
- create rapid package-takedown and maintainer-notification procedures;
- require provenance or verifiable build relationships for critical packages;
- perform exercises that treat dependency compromise as both a software and identity incident.

# 14. Known Unknowns

The following questions remain open:

1. **What exact npm authentication or recovery event preceded the malicious publication?**
2. **Which IP addresses, devices, and user agents accessed the npm publisher account?**
3. **When did the previous `atlantis-software.net` registration lapse, and what is the complete historical registration chain?**
4. **Who controlled the re-registered domain and mailbox?**
5. **Did any specific victim execute the malicious CommonJS path?**
6. **Did any victim emit the DNS exfiltration sequence?**
7. **Did the remote operator successfully reconstruct or receive victim archives?**
8. **Can a specific person or group be attributed from evidence stronger than infrastructure control?**

The current evidence does not justify closing these gaps through inference.

# 15. Conclusion

The 2026 `node-ipc` incident demonstrates how a software supply-chain event can begin as an identity and publishing-authority failure and end as malicious code executing inside trusted developer or CI contexts.

The malicious behavior itself is technically well supported: compromised CommonJS artifacts, credential collection, archive staging, and DNS query-name exfiltration were documented in the public incident response. The independent investigation adds a separate evidentiary layer: a newly/currently registered maintainer email domain, an operational PrivateEmail mailbox, authenticated replies from that domain, contemporaneous WHOIS and DNS captures, and a documented attempt to preserve registrar and email-provider records.

Those facts make an email-based account-recovery compromise plausible. They do not prove it.

The strongest report therefore stops at the evidence boundary: **valid npm publishing authority was abused; the exact acquisition mechanism remains unresolved.** That distinction is not a weakness in the analysis. It is what makes the analysis reproducible.

# Appendix A - Evidence Register

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

# Appendix B - Primary Source Notes

**GitHub Issue #15**  
`https://github.com/RIAEvangelist/node-ipc/issues/15`

Use of the issue is claim-specific. Technical observations from the original report are treated as primary incident-analysis evidence. Investigator statements about account takeover remain investigator hypotheses unless independently supported.

**Email evidence**  
SPF and DKIM results demonstrate authorized domain-mail infrastructure use for the preserved message. They do not identify the human sender.

**WHOIS/DNS screenshots**  
The screenshots document what queried services returned during the investigation. They do not prove historical state outside the query time, actor ownership, or malicious intent.

**Preservation correspondence**  
The correspondence proves submission, acknowledgement, and Namecheap's stated legal-process requirement. It does not prove that preservation occurred.
