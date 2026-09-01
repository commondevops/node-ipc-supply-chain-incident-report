# Impact & Threat Model

[← Back to report index](../README.md)

## Why developer machines are such valuable ground

A developer laptop is rarely just a laptop, and a CI runner is rarely just a machine that runs tests. These environments sit at the intersection of an organization's code, credentials, infrastructure, and release process. They may be able to reach private repositories, cloud services, deployment platforms, package registries, Kubernetes clusters, internal databases, and production-adjacent systems.

That makes the development environment a particularly attractive place for a supply-chain attack to land. The attacker does not need to discover every service from the outside if the compromised code runs somewhere those services are already trusted. Existing permissions, configuration files, tokens, and automation can turn the development environment into a map of the organization around it.

This is why a small dependency can produce outsized concern. The package itself may represent only a tiny fraction of an application's codebase, but its position inside the development process can give it proximity to systems far more valuable than the package itself.

A useful analogy is not a thief breaking into every building on a street, but someone compromising the courier who already has keys, routes, and permission to enter.

## Trust travels with the package

The `node-ipc` incident crossed layers that software teams often manage as separate problems. A maintainer identity can possess publishing rights. Publishing rights determine what appears in a registry. The registry supplies software to developer machines and CI systems. Those systems contain credentials and configuration. Those credentials can lead to larger environments.

![Trust chain diagram](https://comdevopsai.github.io/node-ipc-post-incident/04-trust-chain.png)

Seen that way, `node-ipc` was not only an npm incident. It was an identity incident, a distribution incident, and a developer-security incident. Each layer inherited confidence from the one before it. The package was trusted partly because the registry delivered it; the registry release was trusted partly because valid publishing authority had produced it; the code was allowed to run because all of those earlier assumptions normally hold.

This is both the strength and the weakness of modern software reuse. Developers can build extraordinary systems because they do not have to renegotiate every trust relationship from first principles each time they install a package. But the same efficiency means risk can also be inherited.

The answer is not to distrust open source. Modern software development would be nearly impossible without it. The more useful lesson is to stop thinking of trust as permanent. A package can deserve confidence for years and still become dangerous if control of its publishing path changes.
