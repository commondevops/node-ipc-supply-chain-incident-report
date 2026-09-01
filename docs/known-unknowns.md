# Known Unknowns

[← Back to report index](../README.md)

The following questions remain open; the current evidence does not justify closing these gaps through inference.

1. What exact npm authentication or recovery event preceded the malicious publication? No npm login or recovery telemetry is on file to identify that event.
2. Which IP addresses, devices, and user agents accessed the npm publisher account? No npm access logs were preserved to identify the systems involved.
3. When did the previous `atlantis-software.net` registration lapse, and what is the complete historical registration chain? The preserved WHOIS shows only the current registration, not the prior history.
4. Who controlled the re-registered domain and mailbox? Registrant details are privacy-protected and no operator identity is on file.
5. Did any specific victim execute the malicious CommonJS path? No victim-specific telemetry confirms execution on a given host.
6. Did any victim emit the DNS exfiltration sequence? No DNS or host evidence shows the sequence leaving a victim machine.
7. Did the remote operator successfully reconstruct or receive victim archives? Receiver-side evidence is absent, so remote receipt is not established.
8. Can a specific person or group be attributed from evidence stronger than infrastructure control? Attribution currently rests on infrastructure control, which alone does not identify an actor.
