# Maintainer Identity & Publishing Path

[← Back to report index](../README.md)

## Introduction

The strongest public connection between the malicious npm artifacts and a maintainer identity appears in the GitHub investigation thread. Investigators reported that the malicious tarballs contained:

```
_npmUser: atiertant
```

with the associated email:

```
a.tiertant@atlantis-software.net
```

One investigator described this as a likely "Email Takeover." A later comment explicitly acknowledged uncertainty: the domain had expired, it was registered again, and the attacker **likely** used the mailbox to reset the npm password. That distinction matters. The evidence supports a plausible recovery path but does not establish the exact mechanism of npm account takeover.

## What the evidence supports

- `atiertant` was a known maintainer identity associated with `node-ipc`.
- Investigators reported that the malicious tarballs carried `atiertant` npm publisher metadata.
- The public/display email associated with that npm identity used `atlantis-software.net`.
- The domain was under a new/current registration before the malicious publication.
- PrivateEmail infrastructure was configured and the mailbox was demonstrably capable of sending authenticated mail after the incident.

## What the evidence does not include

- npm password-reset records — would directly show whether a recovery was performed.
- npm login IPs — could place an actor at the publisher account.
- npm MFA/recovery logs — would distinguish login from recovery and show which channels were used.
- A registrar account login history tying domain control to the npm publisher session — is needed to connect domain control to the publishing event.
- Human identity evidence for the mailbox operator — would move attribution beyond infrastructure control.

The absence of these artifacts means the chain from domain reacquisition to a concrete npm password reset is inferred, not directly observed. Where a claim rests on inference rather than a preserved record, this document marks it as plausible rather than confirmed.

## Contemporaneous profile evidence

A contemporaneous investigator screenshot preserved the GitHub profile associated with `atiertant` during the investigation (source: original May 2026 screenshot archive). This capture is contextual evidence only. It establishes how the account and its associated projects appeared at the time, but it does not prove that the GitHub account itself was compromised or used to publish the npm malware.

## Defensible causal statement

> The incident was enabled by valid npm publishing authority associated with a maintainer identity. Domain reacquisition and mailbox control provide a plausible account-recovery path, but the exact mechanism of npm account takeover remains unresolved.
