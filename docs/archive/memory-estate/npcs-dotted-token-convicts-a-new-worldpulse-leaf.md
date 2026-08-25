---
name: npcs-dotted-token-convicts-a-new-worldpulse-leaf
description: "tests/domain/roadsParticipation.test.js runs a RAW `grep -rl '\\.npcs' src/domain/worldPulse src/domain/spatial` with NO comment stripping and asserts EXACT set equality against a dispositioned census (undispositioned ceiling 7, monotone-down). So ANY new worldPulse/spatial leaf containing the four characters `.npcs` — including in a header comment — is convicted as a roster reader and REDS the gate. This is the comment-convicts-itself hazard's third distinct home."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T12:36:04.321Z
---

2026-08-11, ES-5d Opus implementation lane. Caught BEFORE the first edit, by
reading the scan rather than by taking the red.

## Why

`tests/domain/roadsParticipation.test.js` maintains the §8 participation census of
every `.npcs` roster reader. Its live scan is:

```js
execFileSync('grep', ['-rl', '\\.npcs', 'src/domain/worldPulse', 'src/domain/spatial'], …)
```

That is a **raw text grep**. It does not parse, does not strip comments, and does
not care whether the file actually reads a roster. The assertion is EXACT set
equality against `[...EXPECTED, ...UNDISPOSITIONED_NPCS_READERS]`, so a new name
appearing reds it, and the quarantine list carries a literal ceiling of 7 that is
monotone-DOWN — you may burn it, never pad it.

## How to apply

- ⛔ **A new leaf under `src/domain/worldPulse/**` or `src/domain/spatial/**` must
  not contain the string `.npcs` anywhere — code OR prose.** Say "the roster
  entry", "the settlement's cast list", "the home settlement's roster"; never the
  dotted form.
- This is the **third** home of the comment-convicts-itself class in this estate.
  The other two: ES-5c's `espionageCareer.js` header had to be reworded for this
  exact scan, and the ES-5D packet warns it "has fired twice recently".
- ⚠ The cure when a scan reds on a comment is **always to reword the comment,
  never to widen the scan** — widening turns a census into a second, softer census.
- Sibling scans that DO strip comments, so they are safe to write about plainly:
  the ES-5c ladder-writer scan and the `amendersOf` errand-writer scan in
  `tests/domain/espionageProducts.test.js` (it even PINS that a commented writer
  must not convict). **Do not generalise that safety** — `spatialLedgerCoverage.walker`
  and `roadsParticipation` both scan raw.
- Cheapest guard while authoring: `grep -c '\.npcs' <newfile>` before running
  anything, and re-check the census total with
  `grep -rl '\.npcs' src/domain/worldPulse src/domain/spatial | wc -l` (was **39**
  at `73f00920`, unchanged by a leaf written correctly).
