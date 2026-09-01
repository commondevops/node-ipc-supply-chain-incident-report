# Remediation & Recommendations

[← Back to report index](../README.md)

No development team can realistically inspect every line of every dependency it uses, and perfect inspection would not solve the larger problem anyway. Software changes continuously. Maintainers change, releases change, account ownership changes, infrastructure changes, and dependencies acquire dependencies of their own. Security has to survive those changes rather than assume they will never happen.

## Corrective & Preventive Actions

The incident exposes a chain of trust assumptions that can be broken at several points: who is authorized to publish, what credentials the package can reach, and how a malicious release is detected and contained. The actions below are grouped by horizon.

### Immediate

- Remove or disable stale publisher identities; give old collaborator accounts and maintainer domains proper lifecycle management so dormant identities are removed rather than left behind.
- Rotate credentials present on systems that executed affected CommonJS versions.
- Hunt package caches, lockfiles, CI environments, and developer workstations for affected versions.
- Block or investigate the documented DNS indicators.
- Preserve relevant DNS, process, endpoint, and identity telemetry.

### Near term

- Require phishing-resistant MFA for publisher accounts where available.
- Review account-recovery channels separately from login MFA.
- Inventory maintainer email domains and alert on expiration or ownership changes.
- Minimize long-lived secrets in environment variables and developer home directories; every secret available to the environment is potentially available to code running inside it.
- Restrict DNS egress to approved resolvers.
- Detect high-entropy DNS query labels and non-standard DNS destinations.
- Compare published package contents against expected source/build artifacts, and scrutinize unexpected releases that do not correspond to expected source history.

### Strategic

- Establish formal publisher lifecycle governance; treat publishing access for critical packages like production access—limited, reviewed, and removed when it is no longer necessary.
- Create rapid package-takedown and maintainer-notification procedures.
- Require provenance or verifiable build relationships for critical packages.
- Perform exercises that treat dependency compromise as both a software and identity incident.

## From package inventory to trust-path analysis

A dependency incident should therefore trigger a broader question than "Which version did we install?" Teams also need to ask what the package could reach, what credentials were present, where those credentials led, and what assumptions allowed the package to run there in the first place.

That shift—from package inventory to trust-path analysis—is one of the most useful lessons from the incident.
