# Timeline: Forty-Eight Hours

[← Back to report index](../README.md)

Once researchers recognized the malicious releases, the incident moved quickly. It went from malicious publication to public investigation and containment in roughly two days.

## Master Timeline

### 2026-05-07 — atlantis-software.net registration created

The current registration for `atlantis-software.net` was created at 11:49:33Z, as observed in preserved WHOIS output (evidence strength: High). The preserved WHOIS recorded the registrar as Namecheap, Inc., nameservers `DNS1.REGISTRAR-SERVERS.COM` and `DNS2.REGISTRAR-SERVERS.COM`, and a privacy-protected registrant. The domain had lapsed and later returned under new control. Note the conflicting dates: an earlier GitHub comment elsewhere in the thread asserted a 2026-03-10 re-registration, while a later investigator comment stated 2026-05-07 and said the exact prior expiry could not be determined; the primary WHOIS capture and the subsequent preservation request both support the May 7 creation timestamp.

### 2026-05-14 07:26:10Z — azurestaticprovider.net creation observed in WHOIS

The creation timestamp for `azurestaticprovider.net` was observed in WHOIS (evidence strength: High). The captured WHOIS recorded the registrar as NICENIC INTERNATIONAL GROUP CO., LIMITED, nameservers `NS3.MY-NDNS.COM` and `NS4.MY-NDNS.COM`, and a privacy-redacted registrant. In the GitHub issue, this domain family is associated with `sh.azurestaticprovider.net`, the resolver/C2-related host. The creation timestamp falls on the same date as the malicious `node-ipc` publication; timing alone does not establish operator identity.

### 2026-05-14 14:25:30 — First malicious publish (timezone unstated)

An investigator reported the first malicious publish (`12.0.1`), followed by `9.2.3` and then `9.1.6` at roughly 30-second intervals (evidence strength: Medium/High; investigator report). The record gives a first clock time of 14:25:30 but does not state a timezone, and this report does not invent one. The compromise lived in `node-ipc.cjs`, the CommonJS entry point; the ESM entry point `node-ipc.js` and the other source files were clean.

### 2026-05-14 15:01:21Z — GitHub security issue #15 opened

The public incident began with GitHub issue #15, opened at 15:01:21Z and titled "[SECURITY][REPORT] node-ipc@12.0.1 CJS bundle contains obfuscated infostealer payload." (evidence strength: High). The report states that malicious code had been appended to the CommonJS bundle after the legitimate `module.exports` boundary, and it documents a package shasum for `12.0.1`: `fe5d107b9d285327af579259a32977c4f475fa26`.

### 2026-05-14 — Independent confirmation and npm security notification

An independent investigator reported manually confirming the compromise and notifying npm security (evidence strength: High). The same issue thread identified `9.2.3`, `12.0.1`, and then `9.1.6` as affected, expanding the affected version set.

### 2026-05-15 — Evidence screenshots preserved

WHOIS, npm/GitHub profile, and DNS screenshots were preserved during the investigation (evidence strength: High). These correspond to the compiled investigation screenshots (`NODE-IPC.pdf`, artifact E-02) and the original screenshot archive (`Attachments.zip`, artifact E-03).

### 2026-05-15 — Repository owner restricted write access

The repository owner reported restricting write access to himself (evidence strength: High as a first-party remediation statement).

### 2026-05-16 13:43 — Final preserved reply captured

The final preserved reply from `a.tiertant@atlantis-software.net` was captured, with SPF and DKIM passing (evidence strength: High for mail infrastructure use). It was the last of a six-message thread in which the repository owner emailed after the incident became public; the replies included short responses such as "meow" and "hehe," the owner asked whether the sender had acquired the server and found credentials, and the final reply was "Sayonara, friend." The original-message export records Message-ID `<1535103746.754187.1778957015937@privateemail.com>`, created 16 May 2026 at 1:43 PM, From `a.tiertant@atlantis-software.net`, mailer Open-Xchange Mailer v7.10.6-Rev91, SPF **PASS** with IP `198.54.127.77`, DKIM **PASS** with domain `atlantis-software.net`, and DMARC **FAIL**. The evidentiary value is operational mailbox control, not confession.

### 2026-05-19 16:02 -0400 — Preservation request sent to Namecheap

A preservation request was sent to Namecheap regarding `atlantis-software.net` (evidence strength: High). It supplied the observed registration timestamp, the relevant mailbox, an incident link, three PrivateEmail Message-IDs, and two outbound relay observations. It asked Namecheap to preserve domain registration-account details, registrar login IPs and user agents, account creation/recovery/password-reset events, DNS and mail-record history, mailbox creation time, webmail sessions, SMTP submission logs, DKIM signing records, support/recovery records, and related abuse or fraud flags.

### 2026-05-19 20:03Z — Namecheap acknowledges report

Namecheap acknowledged the report (evidence strength: High) and stated that it would be reviewed.

### 2026-05-22 20:51Z — Namecheap: allegation not validated

Namecheap said the allegation could not be validated from the supplied evidence and that legal process is required for preservation (evidence strength: High). It had investigated "to the extent of our capabilities," requested additional evidence, and stated that preservation requests are processed upon receipt of a U.S. court order or subpoena by the Senior Legal department.

![Two-day shockwave timeline of the node-ipc incident](https://comdevopsai.github.io/node-ipc-post-incident/02-two-day-shockwave.png)

## Why the speed matters

Trust accumulates slowly while compromise can happen all at once. A change in publishing authority can alter what a familiar name delivers within hours.
