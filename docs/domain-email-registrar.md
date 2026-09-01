# Domain, Email & Registrar Evidence

[← Back to report index](../README.md)

## 1. `atlantis-software.net` registration

The contemporaneous WHOIS capture preserved by the investigator records the following for the domain visible during the incident:

| Field | Value |
|-------|-------|
| Domain | `ATLANTIS-SOFTWARE.NET` |
| Registrar | Namecheap, Inc. |
| Creation date | `2026-05-07T11:49:33Z` |
| Nameservers | `DNS1.REGISTRAR-SERVERS.COM`, `DNS2.REGISTRAR-SERVERS.COM` |
| Registrant details | Privacy-protected |

This contemporaneous capture materially strengthens the May 7 date. It is a snapshot of registry/registrar output taken at the time, not a later narrative recollection.

### Conflicting re-registration dates

- A GitHub comment elsewhere in the incident thread asserted a **2026-03-10** re-registration date.
- A later investigator comment stated **2026-05-07** and said the exact prior expiry could not be determined.
- The primary WHOIS capture and the subsequent preservation request both support the May 7 creation timestamp for the registration visible during the incident.

### Conclusions

- **Current registration creation timestamp observed:** `2026-05-07T11:49:33Z` — High confidence.
- **Exact date the prior registration expired:** Not established.
- **Historical "re-registration" chronology before May 7:** Not fully established from the preserved evidence.

## 2. Direct exchange with the mailbox

A preserved six-message thread shows the repository owner emailing `a.tiertant@atlantis-software.net` after the incident became public. Replies were received from that address. The exchange included short responses such as "meow" and "hehe." The owner then asked whether the sender had acquired the server and found credentials. The final reply was "Sayonara, friend."

The evidentiary value here is **operational mailbox control**, not confession. The final response does not admit server acquisition, password recovery, npm access, or malware publication.

## 3. Authentication of the final reply

The original-message export for the final reply records:

| Field | Value |
|-------|-------|
| Message-ID | `<1535103746.754187.1778957015937@privateemail.com>` |
| Created | 16 May 2026 at 1:43 PM |
| From | `a.tiertant@atlantis-software.net` |
| Mailer | Open-Xchange Mailer v7.10.6-Rev91 |
| SPF | **PASS** with IP `198.54.127.77` |
| DKIM | **PASS** with domain `atlantis-software.net` |
| DMARC | **FAIL** |

SPF/DKIM success is meaningful because it shows the message was sent through infrastructure authorized for the domain and carried a valid domain signature at that time. It does **not** authenticate the human identity of the sender. Domain control and identity are separate propositions.

## 4. Preservation request and registrar response

On **19 May 2026**, a preservation request was sent to Namecheap regarding `atlantis-software.net`. It supplied the observed registration timestamp, the relevant mailbox, an incident link, three PrivateEmail Message-IDs, and two outbound relay observations.

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

### Legal/evidentiary boundary

- A preservation request was submitted.
- Namecheap acknowledged and reviewed it.
- The available correspondence does **not** establish that the requested records were preserved.
- No registrar account, webmail-session, or npm-recovery logs were obtained through this process.
