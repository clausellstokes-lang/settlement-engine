---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-27
  status: "one instance CURED, class OPEN (unswept)"
  severity: "silent — no throw, no red, no user-visible symptom until a second consumer arrives"
  originSessionId: a84f4ff8-9bed-4c25-855b-122c9ed57f27
  modified: 2026-07-28T01:12:45.003Z
---

# Hazard: writer/reader payload-spelling drift across module boundaries

## The bite (2026-07-27, VersionsTab queue #18)

`recordSnapshot` (src/store/settlementSlice.js) writes a version-history entry
as `{ id, ts, kind, label, settlement }`. `buildVersionTimeline`
(src/components/settlement/VersionsTab.jsx) read the payload as `v.snapshot`.
The two spellings never matched, so **every real store-written snapshot reached
the UI with `snapshot: undefined`** for the entire life of the feature.

Nothing detected it because:

1. The only consumer of the entries, `revertToSnapshot`, addresses snapshots by
   `id`. The payload was carried but never read.
2. The reader's own unit test (`tests/components/versionsTab.test.js`) used a
   **hand-rolled fixture spelling it `snapshot`** — the fixture agreed with the
   reader, so the test was green and wrong.
3. The reader's file header documented the shape as
   `save.versionHistory: [{ id, ts, label, snapshot }]`, i.e. the DOC agreed with
   the bug too.

It surfaced only when a second consumer (the diff view) actually needed the
payload.

## Why this class is nasty

An undefined-payload read is not an error in JS. It renders as nothing, compares
as equal to nothing, and diffs as "no change" — the failure mode is a
**confidently empty answer**, which looks like a correct answer.

## How to apply

- **A fixture written by the reader's author cannot test the writer's contract.**
  When a record crosses a module boundary, at least one pin must boot the REAL
  writer and feed its actual output to the real reader. The cure pin here
  (`tests/components/versionDiffView.test.jsx`) boots the settlement slice, calls
  the real `recordSnapshot` twice across a real edit, routes the output through
  the real `buildVersionTimeline`, then renders.
- **Suspect any field that is written but never read.** A payload carried for
  "future use" has no consumer holding its spelling honest, so it drifts for free.
- **Cure shape used:** `const payload = v.settlement ?? v.snapshot;` — store
  spelling first, legacy/fixture spelling as fallback, so existing fixtures and
  any historical rows keep working. Plus an explicit `comparable: payload != null`
  flag so a payload-free entry is a first-class state rather than a silent blank.

## UNSWEPT

Only the versionHistory instance is cured. Sibling candidates never checked:
other store records whose payload key is written in the slice and read in a
component (pendingEditReceipts, pipelineHistory, regenerationDelta stash,
mapEdits). A sweep would grep each writer's object literal against every reader's
property access. Deliberately deferred, recorded here so it is not re-found as a
mystery.
