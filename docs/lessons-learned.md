# Lessons Learned

[← Back to report index](../README.md)

## The familiar thing at the door

What makes the `node-ipc` story unsettling is how ordinary its starting point was. There was no need for the package name to change, no need for developers to adopt an unfamiliar tool, and no need for the upstream project to suddenly look obviously hostile. The attack could benefit from trust that had already been earned.

That is the defining advantage of a software supply-chain attack. Instead of forcing its way through every organization's front door, it can compromise something organizations have already decided to invite inside.

## Trust belongs to a chain, not a name

Open source runs on that invitation. Developers build on one another's work because the ecosystem makes reuse cheap, fast, and usually dependable. That model is not going away, nor should it. But the model works only if teams understand that trust belongs to a chain of people, identities, registries, tools, and runtime environments—not to a package name alone.

The `node-ipc` compromise was therefore more than the story of malicious releases. It was a reminder that familiar software arrives carrying the authority of everything behind it: the maintainer who can publish it, the registry that distributes it, the tooling that installs it, and the environment that permits it to run.

Most days, those relationships are invisible.

On May 14, 2026, they became the story.
