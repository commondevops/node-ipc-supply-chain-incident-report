# Impact & Threat Model

## Why developer machines are such valuable ground

A developer laptop is rarely just a laptop, and a CI runner is rarely just a machine that runs tests. These environments sit at the intersection of an organization's code, credentials, infrastructure, and release process. They may be able to reach private repositories, cloud services, deployment platforms, package registries, Kubernetes clusters, internal databases, and production-adjacent systems.

That makes the development environment an attractive place for a supply-chain attack to land. The attacker does not need to discover every service from the outside if the compromised code runs somewhere those services are already trusted. Existing permissions, configuration files, tokens, and automation can turn the development environment into a map of the organization around it.

This is why a small dependency can produce outsized concern. The package itself may represent only a tiny fraction of an application's codebase, but its position inside the development process can give it proximity to systems far more valuable than the package itself.

A useful analogy is not a thief breaking into every building on a street, but someone compromising the courier who already has keys, routes, and permission to enter.

## Trust travels with the package

The `node-ipc` incident crossed layers that software teams manage as separate problems. A maintainer identity can possess publishing rights. Publishing rights determine what appears in a registry. The registry supplies software to developer machines and CI systems. Those systems contain credentials and configuration. Those credentials can lead to larger environments.

![Trust chain diagram](../assets/images/04-trust-chain.png)

Seen that way, `node-ipc` was not only an npm incident. It was an identity incident, a distribution incident, and a developer-security incident. Each layer inherited confidence from the one before it. The package was trusted partly because the registry delivered it; the registry release was trusted partly because valid publishing authority had produced it; the code was allowed to run because all of those earlier assumptions normally hold.

This is both the strength and the weakness of modern software reuse. Developers can build extraordinary systems because they do not have to renegotiate every trust relationship from first principles each time they install a package. But the same efficiency means risk can also be inherited.

The answer is not to distrust open source. Modern software development would be nearly impossible without it. The more useful lesson is to stop thinking of trust as permanent. A package can deserve confidence for years and still become dangerous if control of its publishing path changes.

## Impact & Exposure Assessment

The incident should be evaluated as a sequence of increasingly strong impact states, rather than as a single binary outcome. Each state proves something different, and the investigation's confidence in each state differs accordingly.

The "Malicious version published" state proves that a supply-chain compromise exists, with a status of Confirmed in this investigation. The "Package selected/downloaded" state proves potential consumer exposure, with a status of Environment-specific in this investigation. The "Compromised CJS loaded" state proves that the malicious runtime path was reached, with a status of Requires victim evidence in this investigation. The "Collection observed" state proves that host secrets were actually read, with a status of Requires victim evidence in this investigation. The "Archive staged" state proves that the collection pipeline progressed, with a status of Requires victim evidence in this investigation. The "DNS exfil queries emitted" state proves that an exfiltration attempt occurred, with a status of Requires DNS/host evidence in this investigation. The "Remote receipt proven" state proves that the attacker received victim data, with a status of Not established in this investigation.

This distinction is operationally important for incident response. A host that merely contains a malicious package may warrant investigation and secret rotation based on risk, but the forensic statement should not be upgraded to "confirmed data theft" without supporting telemetry. Stages marked *Requires victim evidence* or *Not established* cannot be asserted from the package contents alone; they depend on host-level telemetry (process, filesystem, and DNS records) specific to each affected machine. Where that evidence is absent, the correct statement is a risk-based recommendation, not a confirmed impact claim.

The boundary between **capability** and **impact** is the core of this assessment. A malicious package that contains credential-collection and DNS-exfiltration code demonstrates what the payload *can* do; it does not by itself prove that a specific consumer executed the payload, that credentials were collected from that consumer, or that data was successfully received by a remote operator. Capability is established from the code; impact requires evidence from the victim environment. Conflating the two overstates the incident and can misdirect response effort.
