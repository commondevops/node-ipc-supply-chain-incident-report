# Root Cause Analysis

## Summary

Publication metadata pointed investigators toward a dormant maintainer identity associated with an address at `atlantis-software.net`. The domain had lapsed and later returned under new control, and investigators found working mail infrastructure for it after the incident. Publishing authority can outlive the person or organization that originally created it.

## Unmonitored identity infrastructure

A publishing account is not secured only by its current password or MFA configuration; it can also depend on old email addresses, old domains, recovery workflows, collaborator lists, and permissions that nobody has reviewed in years. When those pieces remain connected, abandoned identity infrastructure can quietly remain part of the software supply chain. A forgotten maintainer domain was not merely a web property that had expired. It was part of an identity chain connected to package publishing.

## Dormant publishing authority as a risk

Dormant publishing authority is security debt. So are expired domains, forgotten recovery addresses, and contributors who still possess privileges long after their role in a project has ended.

Dormant identities remain exploitable even after they are no longer actively managed.

### Demonstrated chain

The demonstrated chain runs from valid npm publishing authority to malicious npm versions, then to vulnerable dependency resolution, then to a compromised CommonJS execution path, and finally to credential collection and DNS-exfiltration capability.

Valid npm publishing authority is **Confirmed** because the affected versions were published through an authoritative channel. The malicious npm versions are **Confirmed**, because `9.1.6`, `9.2.3`, and `12.0.1` contain a malicious CommonJS path (`node-ipc.cjs`) with an appended obfuscated IIFE. Vulnerable dependency resolution is **Supported** because consumers that resolve these versions load the malicious artifact, though no victim-specific telemetry is on file to confirm a given consumer did so. The compromised CommonJS execution path is **Plausible**, because the code path is present in the artifact, but execution on a specific host is not yet evidenced. Credential collection and DNS-exfiltration capability is **Supported** as a capability but **Not established** as impact for any specific consumer (see evidentiary boundary below).

Every arrow after package publication remains conditional on the consumer environment until victim-specific telemetry is available.

### Maintainer identity theft
The identity chain runs from an expired or lapsed maintainer email domain to a new registration, then to mailbox operation, then to npm account recovery, and finally to the use of publisher authority.

The expired or lapsed maintainer email domain is **Confirmed**, because the `atlantis-software.net` address had lapsed and later returned under new control, with working mail infrastructure found after the incident. Confirmed by DNS records showing a 2026-05-07 registration date. Mailbox operation is **Confirmed**, screenshots and messages in the Github Issue. Npm account recovery is **Confirmed** from interview with Brandon Miller.

The evidence directly supports:

### Root-cause statement

> **Unauthorized use of valid npm publishing authority associated with a maintainer identity allowed malicious package artifacts to enter the official distribution channel.**

