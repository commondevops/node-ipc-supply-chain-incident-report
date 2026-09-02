# Incident Overview & Background

[← Back to report index](../README.md)

## The source-vs-distribution gap

![Source repository vs distribution channel divergence](https://comdevopsai.github.io/node-ipc-post-incident/01-source-vs-distribution.png)

In May 2026, three malicious `node-ipc` releases appeared on npm while the upstream project still showed `12.0.0`. The gap exposed how much modern software depends on trust outside the code we can see.

On May 14, 2026, a developer opening the `node-ipc` project on GitHub would have seen little reason for alarm. The upstream repository still pointed to version `12.0.0`, the project looked much as it had before, and nothing about the familiar source page suggested that the package had become the center of a security incident. But the software arriving through npm no longer matched what the source page showed.

That day, three malicious versions of `node-ipc`—`9.1.6`, `9.2.3`, and `12.0.1`—appeared through the official npm distribution channel. The discrepancy was small enough to fit inside a version number, yet large enough to expose one of the software industry's most consequential assumptions: the code developers inspect and the package they install are not necessarily governed by the same systems, credentials, or trust relationships.

For most developers, the distinction is almost invisible. GitHub is where a project is read, discussed, and reviewed; npm is where the package is retrieved. In ordinary use, they feel like two windows onto the same thing. The `node-ipc` incident made clear that they are not. A source repository can remain unchanged while the distribution path around it changes completely.

That was what made the incident larger than a single case of malicious code. The package name remained familiar, the installation command remained familiar, and the project developers recognized was still there. What had changed was the chain of authority behind the package being delivered to them.

Modern software depends on that chain. Applications are assembled from libraries, frameworks, build tools, and packages maintained by people all over the world. Every installation carries a quiet promise that the software arriving through a registry is the software its maintainers intended to publish.

**The `node-ipc` incident began when that promise broke.**

## The package was only the beginning

Open-source software works because developers do not build everything themselves. A modern application may rely on hundreds or thousands of components maintained by people the application team will never meet. That arrangement is one of software's great force multipliers: small teams can build enormous systems because they inherit years of work from the ecosystem around them.

They inherit something else as well. Every dependency brings assumptions about who controls it, how releases are published, and what the package will be allowed to do once it reaches a developer workstation or CI environment. Most of those assumptions remain invisible until one of them fails.

The malicious `node-ipc` releases were designed to inspect developer and CI environments for sensitive information. Their targets included SSH keys, cloud credentials, Kubernetes configuration, package-manager credentials, source-control credentials, database configuration, `.env` files, shell history, and other developer-tool settings. These were not simply interesting files on a machine; many represented access to the systems developers use to build, deploy, and operate software.

That proximity is what gave the compromise its reach. A third-party package running in a development environment may sit only a few steps away from private repositories, cloud accounts, deployment infrastructure, and production-adjacent systems. The dangerous part of a malicious dependency is therefore not only the code inside it, but the environment that agrees to run it.

![Multiple layers of trust around node-ipc](https://comdevopsai.github.io/node-ipc-post-incident/03-multiple-layers-of-trust.png)

A compromised dependency does not need to attack every downstream system directly. If it reaches an environment that already possesses legitimate access, some of the hardest work has already been done for it.

> **The package was not valuable because of what it contained. It was valuable because of where developers were willing to run it.**

## Incident record

This section records the technical facts from the incident record, with a confidence rating for each claim. A claim is **Confirmed** (stated directly in the record), **Supported** (reported but approximate or inferential), **Plausible** (reasonable but not directly evidenced), or **Not established** (absent or unproven).

### Origin of the public report

The public incident began with GitHub issue #15, opened on **14 May 2026 at 15:01:21Z**, titled *"[SECURITY][REPORT] node-ipc@12.0.1 CJS bundle contains obfuscated infostealer payload."* The report states that malicious code had been appended to the CommonJS bundle after the legitimate `module.exports` boundary.

The issue documents a package shasum for `12.0.1`:

```
fe5d107b9d285327af579259a32977c4f475fa26
```

### Affected versions

Version `9.1.6` was added in a contemporaneous GitHub issue discussion, and it is confirmed affected in the incident record. Version `9.2.3` was reported by an independent investigator in a GitHub issue, and it is confirmed affected in the incident record. Version `12.0.1` is documented by the original issue and technical analysis, and it is confirmed affected.

### Release timing

The investigation record reports a rapid three-release sequence: `12.0.1`, followed roughly 30 seconds later by `9.2.3`, then roughly 30 seconds later by `9.1.6`. The comment gives a first clock time of **14:25:30** but does not state a timezone; this report does not invent one.

### Entry point and execution condition

The issue states that the malicious code existed in `node-ipc.cjs`, the CommonJS entry point, while the ESM entry point `node-ipc.js` and other source files were clean. That distinction matters operationally: package presence alone was not equivalent to malicious execution. The highest-risk condition was a consumer environment that resolved an affected npm version and then loaded the compromised CommonJS path.

### Verification in the issue thread

A researcher responding to the issue reported manually confirming the compromise and notifying npm security. The same thread identified `9.2.3`, `12.0.1`, and then `9.1.6` as affected.

### Confidence assessment

The claim that Issue #15 opened on 14 May 2026 at 15:01:21Z with the stated title is Confirmed, based on the GitHub issue record. The claim that the package shasum `fe5d107b9d285327af579259a32977c4f475fa26` is for `12.0.1` is Confirmed, based on documentation in issue #15. The claim that `9.1.6`, `9.2.3`, and `12.0.1` are affected is Confirmed, based on the issue thread and technical analysis. The claim of a three-release sequence ~30s apart (`12.0.1` → `9.2.3` → `9.1.6`) is Supported, reported in the investigation record with intervals approximate. The claim that the first release clock time was 14:25:30 is Supported, as it is given in a record comment. The timezone for the 14:25:30 clock time is Not established, because the record does not state it. The claim that malicious code was in `node-ipc.cjs` while `node-ipc.js` and other source files were clean is Confirmed, because the issue states the entry-point distinction. The claim that package presence alone was not equivalent to malicious execution is Supported, inferred from the CommonJS-entry-point execution condition. The claim that a researcher manually confirmed the compromise and notified npm security is Confirmed, as it was reported in the issue thread.
