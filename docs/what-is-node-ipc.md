# What is node-ipc?

[← Back to report index](../README.md)

## A Node.js inter-process communication library

`node-ipc` is an open-source JavaScript library for inter-process communication (IPC). It lets separate Node.js processes exchange messages and coordinate, a common need for multi-process applications, CLI tooling, and local services. The public project lives at `RIAEvangelist/node-ipc`. The maintainer has also published companion variants, including a Rust implementation and a C# implementation, so the same IPC capability can bridge JavaScript with other runtimes.

## Why it matters

`node-ipc` is one of the most widely adopted packages in the Node.js ecosystem. It has been widely reported to have accumulated over 2 billion downloads on npm, with very high weekly download volume (per the maintainer interview and public reporting; the exact figure is not part of the preserved evidence for this report).

That ubiquity is precisely what made the incident consequential. Because the package is ordinary and trusted, a large number of developer workstations and CI environments install and run it without second thought. When a malicious version appears through the official npm channel, those same environments are the ones that may resolve and load the compromised code — which is the core of the source-vs-distribution gap described in this report.
