# 8. Remediation & Recommendations

No development team can realistically inspect every line of every dependency it uses, and perfect inspection would not solve the larger problem anyway. Software changes continuously. Maintainers change, releases change, account ownership changes, infrastructure changes, and dependencies acquire dependencies of their own. Security has to survive those changes rather than assume they will never happen.

## 8.1 Corrective & Preventive Actions

The incident exposes a chain of trust assumptions that can be broken at several points: who is authorized to publish, what credentials the package can reach, and how a malicious release is detected and contained. The actions below are grouped by horizon.

### Immediate

Remove or disable stale [npm](https://www.npmjs.com) publisher identities, and give old collaborator accounts and maintainer domains proper lifecycle management so dormant identities are removed rather than left behind. Rotate credentials present on systems that executed affected CommonJS versions, to limit what a compromised host can do with them. Hunt package caches, lockfiles, CI environments, and developer workstations for affected versions, so every environment that may have resolved the malicious artifacts is identified. Block or investigate the documented DNS indicators, to contain and detect exfiltration attempts. Preserve relevant DNS, process, endpoint, and identity telemetry, so that host-level evidence can be correlated later.

### Near term

Require phishing-resistant MFA for publisher accounts where available, to reduce the chance a publisher account is taken over via credential theft. Review account-recovery channels separately from login MFA, because recovery is a distinct path that login MFA alone does not protect. Inventory maintainer email domains and alert on expiration or ownership changes, so a lapsed domain can be detected before it is re-registered by someone else. Minimize long-lived secrets in environment variables and developer home directories; every secret available to the environment is potentially available to code running inside it. Restrict DNS egress to approved resolvers, to block exfiltration directed at non-standard resolvers. Detect high-entropy DNS query labels and non-standard DNS destinations, because the exfiltration encoded data into unusually long query names. Compare published package contents against expected source/build artifacts, and scrutinize unexpected releases that do not correspond to expected source history.

### Strategic

Establish formal publisher lifecycle governance, and treat publishing access for critical packages like production access—limited, reviewed, and removed when it is no longer necessary. Create rapid package-takedown and maintainer-notification procedures, to shorten the time a malicious release stays available. Require provenance or verifiable build relationships for critical packages, so consumers can confirm a release matches its claimed source. Perform exercises that treat dependency compromise as both a software and identity incident, because the publishing path—not just the code—is what must be defended.

## 8.2 Trust-path analysis

A dependency incident should therefore trigger a broader question than "Which version did we install?" Teams also need to ask what the package could reach, what credentials were present, where those credentials led, and what assumptions allowed the package to run there in the first place.

Moving from package inventory to trust-path analysis is a key recommendation from this incident.
