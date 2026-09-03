# Domain, Email & Registrar Evidence

## 1. `atlantis-software.net` registration

The contemporaneous WHOIS capture preserved by the investigator records the details of the domain visible during the incident.

The domain was `ATLANTIS-SOFTWARE.NET`. The registrar was Namecheap, Inc. The creation date was `2026-05-07T11:49:33Z`. The nameservers were `DNS1.REGISTRAR-SERVERS.COM` and `DNS2.REGISTRAR-SERVERS.COM`. The registrant details were privacy-protected.

This contemporaneous capture materially strengthens the May 7 date. It is a snapshot of registry/registrar output taken at the time, not a later narrative recollection.

### Conflicting re-registration dates

A GitHub comment elsewhere in the incident thread asserted a **2026-03-10** re-registration date. A later investigator comment stated **2026-05-07** and said the exact prior expiry could not be determined. The primary WHOIS capture and the subsequent preservation request both support the May 7 creation timestamp for the registration visible during the incident.

### Conclusions

The current registration's creation timestamp was observed at `2026-05-07T11:49:33Z`, with high confidence. The exact date the prior registration expired is not established by the preserved evidence. The historical "re-registration" chronology before May 7 is not fully established from the preserved evidence.

## 2. Direct exchange with the mailbox

A preserved six-message thread shows the repository owner emailing `a.tiertant@atlantis-software.net` after the incident became public. Replies were received from that address. The exchange included short responses such as "meow" and "hehe." The owner then asked whether the sender had acquired the server and found credentials. The final reply was "Sayonara, friend."

The evidentiary value here is **operational mailbox control**, not confession. The final response does not admit server acquisition, password recovery, npm access, or malware publication.

## 3. Authentication of the final reply

The original-message export for the final reply records:

The Message-ID was `<1535103746.754187.1778957015937@privateemail.com>`. It was created on 16 May 2026 at 1:43 PM. The From field was `a.tiertant@atlantis-software.net`. The mailer was Open-Xchange Mailer v7.10.6-Rev91. [SPF](https://datatracker.ietf.org/doc/html/rfc7208) was **PASS** with IP `198.54.127.77`. [DKIM](https://datatracker.ietf.org/doc/html/rfc6375) was **PASS** with domain `atlantis-software.net`. [DMARC](https://datatracker.ietf.org/doc/html/rfc7489) was **FAIL**.

SPF/DKIM success is meaningful because it shows the message was sent through infrastructure authorized for the domain and carried a valid domain signature at that time. It does **not** authenticate the human identity of the sender. Domain control and identity are separate propositions.

## 4. Preservation request and registrar response

On **19 May 2026**, a preservation request was sent to Namecheap regarding `atlantis-software.net`. It supplied the observed registration timestamp, the relevant mailbox, an incident link, three PrivateEmail Message-IDs, and two outbound relay observations.

The request asked Namecheap to preserve several categories of records.

Domain registration-account details would identify who registered and controlled the domain. Registrar login IPs and user agents could place an actor at the account. Account creation, recovery, and password-reset events are central to testing whether the domain mailbox was used to recover the npm account. DNS and mail-record history would show when authoritative records were configured for the new registration. Mailbox creation time helps date when the operational mailbox came into use. Webmail sessions could tie a human operator to the mailbox. SMTP submission logs corroborate the preserved outbound relay observations. DKIM signing records support authentication of the preserved replies. Support/recovery records may document recovery actions taken on the account. Related abuse or fraud flags would indicate prior warnings to the registrar.

Namecheap acknowledged receipt on 19 May and stated that the report would be reviewed.

On **22 May 2026**, Namecheap responded that it had investigated "to the extent of our capabilities" but could not validate the allegation from the supplied evidence. It requested additional evidence and stated that preservation requests are processed upon receipt of a **U.S. court order or subpoena** by the Senior Legal department.

### Legal/evidentiary boundary

A preservation request was submitted. Namecheap acknowledged and reviewed it. The available correspondence does **not** establish that the requested records were preserved. No registrar account, webmail-session, or npm-recovery logs were obtained through this process.
