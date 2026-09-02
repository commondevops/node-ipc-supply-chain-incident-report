# Common Devops & Our Involvement

[← Back to report index](../README.md)

## Who we are

This report was produced by Common Devops. We are the authors of this incident investigation.

## How we became involved

We first learned about the `node-ipc` compromise through public reporting. We went to the primary source — the GitHub security issue (#15) and its thread — and engaged directly with the maintainer. From that starting point we conducted an independent investigation into the domain, DNS, email, and registrar evidence surrounding the incident.

## What we did

- **Independent domain, DNS, and email/registrar investigation.** We examined `atlantis-software.net` (WHOIS, nameservers, registration timing) and `azurestaticprovider.net`, analyzed mailbox control, and assessed message authentication (SPF/DKIM/DMARC).
- **Preserved contemporaneous evidence.** We retained WHOIS and DNS captures, npm/GitHub profile screenshots, the preserved email thread, and an original-message header export.
- **Submitted a preservation request to Namecheap** on 19 May 2026, requesting registrar account details, webmail sessions, and related records. We documented their 22 May response and the legal-process (court order / subpoena) boundary for preservation.
- **Compiled the evidence register** (E-01 through E-09) and produced this structured, confidence-rated report.

## Scope and boundaries

We did not attempt to identify a specific human actor, and we did not claim victim compromise without victim-specific telemetry. Where evidence was insufficient, we marked the claim as Plausible or Not established rather than asserting it.
