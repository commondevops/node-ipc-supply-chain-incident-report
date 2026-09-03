# 6. Root Cause Analysis

## 6.1 Unmonitored identity infrastructure

### Summary

Publication metadata pointed investigators toward a dormant maintainer identity associated with an address at `atlantis-software.net`.
The domain had lapsed and later returned under new control, and investigators found working mail infrastructure for it after the incident.
Publishing authority can outlive the person or organization that originally created it.

### Unmonitored identity infrastructure

A publishing account is not secured only by its current password or MFA configuration; it can also depend on old email addresses, old domains, recovery workflows, collaborator lists, and permissions that nobody has reviewed in years.
When those pieces remain connected, abandoned identity infrastructure can quietly remain part of the software supply chain.
A forgotten maintainer domain was not merely a web property that had expired.
It was part of an identity chain connected to package publishing.

### Dormant publishing authority as a risk

Dormant publishing authority is security debt.
So are expired domains, forgotten recovery addresses, and contributors who still possess privileges long after their role in a project has ended.

Dormant identities remain exploitable even after they are no longer actively managed.

## 6.2 Root-cause statement

The demonstrated chain runs from valid [npm](https://www.npmjs.com) publishing authority through malicious npm versions, vulnerable dependency resolution, a compromised CommonJS execution path, and finally to credential collection and DNS-exfiltration capability; the identity chain runs from a lapsed maintainer email domain to a new registration, mailbox operation, npm account recovery, and the use of publisher authority.
The step-by-step confidence assessment for each link is given in Section 3.3.

The evidence directly supports:

> **Unauthorized use of valid npm publishing authority associated with a maintainer identity allowed malicious package artifacts to enter the official distribution channel.**
