# Appendix C — About the Authors

## C.1 Who we are

This report was produced by Common Devops.
We are the authors of this incident investigation.

## C.2 How we became involved

We first learned about the `node-ipc` compromise through public reporting.
We went to the primary source — the [GitHub security issue #15](https://github.com/RIAEvangelist/node-ipc/issues/15) and its thread — and engaged directly with the maintainer.
From that starting point we conducted an independent investigation into the domain, DNS, email, and registrar evidence surrounding the incident.

## C.3 What we did

- **Independent domain, DNS, and email/registrar investigation.**
We examined `atlantis-software.net` (WHOIS, nameservers, registration timing) and `azurestaticprovider.net`, analyzed mailbox control, and assessed message authentication (SPF/DKIM/DMARC).
- **Preserved contemporaneous evidence.**
We retained WHOIS and DNS captures, [npm](https://www.npmjs.com)/GitHub profile screenshots, the preserved email thread, and an original-message header export.
- **Submitted a preservation request to Namecheap** on 2026-05-19, requesting registrar account details, webmail sessions, and related records.
We documented their 2026-05-22 response and the legal-process (court order / subpoena) boundary for preservation.
- **Compiled the evidence register** (E-01 through E-09) and produced this structured, confidence-rated report.

## C.4 Scope and boundaries

We did not attempt to identify a specific human actor, and we did not claim victim compromise without victim-specific telemetry; where evidence was insufficient we marked the claim as Plausible or Not established rather than asserting it (full scope statement in Appendix B, Section B.1).
