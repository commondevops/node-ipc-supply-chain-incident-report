# Root Cause Analysis

[← Back to report index](../README.md)

## Summary

Publication metadata pointed investigators toward a dormant maintainer identity associated with an address at `atlantis-software.net`. The domain had lapsed and later returned under new control, and investigators found working mail infrastructure for it after the incident. Publishing authority can outlive the person or organization that originally created it.

## The identity nobody was watching

A publishing account is not secured only by its current password or MFA configuration; it can also depend on old email addresses, old domains, recovery workflows, collaborator lists, and permissions that nobody has reviewed in years. When those pieces remain connected, abandoned identity infrastructure can quietly remain part of the software supply chain. A forgotten maintainer domain was not merely a web property that had expired. It was part of an identity chain connected to package publishing.

## Dormant authority is security debt

Dormant publishing authority is security debt. So are expired domains, forgotten recovery addresses, and contributors who still possess privileges long after their role in a project has ended.

> **Old identities do not stop mattering just because everyone has stopped thinking about them.**

## Causal Analysis

A useful causal model separates what is demonstrated from what is hypothesized. Confidence language below marks the strength of each link: **Confirmed** (directly observed), **Supported** (consistent with evidence but not directly observed), **Plausible** (reasoned, not yet evidenced), and **Not established** (no current evidence).

### Demonstrated chain

The demonstrated chain runs from valid npm publishing authority to malicious npm versions, then to vulnerable dependency resolution, then to a compromised CommonJS execution path, and finally to credential collection and DNS-exfiltration capability.

Valid npm publishing authority is **Confirmed** because the affected versions were published through an authoritative channel. The malicious npm versions are **Confirmed**, because `9.1.6`, `9.2.3`, and `12.0.1` contain a malicious CommonJS path (`node-ipc.cjs`) with an appended obfuscated IIFE. Vulnerable dependency resolution is **Supported** because consumers that resolve these versions load the malicious artifact, though no victim-specific telemetry is on file to confirm a given consumer did so. The compromised CommonJS execution path is **Plausible**, because the code path is present in the artifact, but execution on a specific host is not yet evidenced. Credential collection and DNS-exfiltration capability is **Supported** as a capability but **Not established** as impact for any specific consumer (see evidentiary boundary below).

Every arrow after package publication remains conditional on the consumer environment until victim-specific telemetry is available.

### Plausible but unproven identity chain

The plausible but unproven identity chain runs from an expired or lapsed maintainer email domain to a new registration, then to mailbox operation, then to npm account recovery, and finally to the use of publisher authority.

The expired or lapsed maintainer email domain is **Confirmed**, because the `atlantis-software.net` address had lapsed and later returned under new control, with working mail infrastructure found after the incident. A new registration is **Supported** because a May 7 registration is directly supported by the evidence. Mailbox operation is **Supported** because a later operational mailbox is directly supported by the evidence. npm account recovery is **Not established** because the evidence does not contain the npm recovery event required to close this link. The use of publisher authority is **Plausible**, because it is inferred from the published artifacts, but the intervening recovery mechanism is unresolved.

The evidence directly supports the middle observations (a May 7 registration and later operational mailbox) but does not contain the npm recovery event required to close the chain. No actor identity or victim data is asserted beyond what the evidence shows.

### Root-cause statement

> **Unauthorized use of valid npm publishing authority associated with a maintainer identity allowed malicious package artifacts to enter the official distribution channel. The exact credential-recovery or account-takeover mechanism is unresolved.**

### Evidentiary boundary: capability is not impact

A package containing credential collection and DNS-exfiltration code does not by itself prove that a specific consumer executed it, that credentials were collected from that consumer, or that data was received remotely. Capability observed in the artifact is **Supported**; impact on any particular victim remains **Not established** absent victim-specific telemetry.
