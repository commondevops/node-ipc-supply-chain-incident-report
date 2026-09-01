# Root Cause Analysis

[← Back to report index](../README.md)

## Summary

Publication metadata pointed investigators toward a dormant maintainer identity associated with an address at `atlantis-software.net`. The domain had lapsed and later returned under new control, and investigators found working mail infrastructure for it after the incident. Publishing authority can outlive the person or organization that originally created it.

## The identity nobody was watching

A publishing account is not secured only by its current password or MFA configuration; it can also depend on old email addresses, old domains, recovery workflows, collaborator lists, and permissions that nobody has reviewed in years. When those pieces remain connected, abandoned identity infrastructure can quietly remain part of the software supply chain. A forgotten maintainer domain was not merely a web property that had expired. It was part of an identity chain connected to package publishing.

## Dormant authority is security debt

Dormant publishing authority is security debt. So are expired domains, forgotten recovery addresses, and contributors who still possess privileges long after their role in a project has ended.

> **Old identities do not stop mattering just because everyone has stopped thinking about them.**
