---
name: osr-schema6-mint-landed
description: "⭐⭐⭐ THE SCHEMA-6 MINT LANDED (code half `2fe94f77` + genesis `2b59122d`, 2026-08-12) on claude/composite-r4 — the observed-shape gate is GREEN. Schema 6 = the leaf identity narrowed by FOUR declared post-filters: M6 shape-family + NEW M11 DOM-global receiver + NEW M12 language-surface residual + M8/M9 explained-writer (now FOUR entries). Measured 1975/1394/385 → 1954/1381/381, reconciling 1381 same / 13 gone / 0 new / 0 issues — a PURE SHRINK. Carries three prose corrections and the `factions on locks` re-triage out of class (a). ⚠⚠ Two guards here were written FROM MEASUREMENTS THAT REFUTED THE OBVIOUS DESIGN — see the two laws below; both would have red the gate."
metadata:
  type: project
  date: 2026-08-12
  branch: claude/composite-r4
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-12T01:02:53.273Z
---

**LANDED 2026-08-12:** `2fe94f77` (code half, deliberately gate-red) + `2b59122d`
(genesis) on `claude/composite-r4`. Predecessor pair: schema 5's `36159389`+`ffc85a90`
(see `osr-schema5-mint-built.md`). Base was `5853732a`.

## What schema 6 IS

The `<key> on <shape>` leaf identity is UNCHANGED for the third mint running, so the
5→6 migration is a RECONCILIATION, not a re-spelling. What changed is which findings
the instrument EMITS: the byte-frozen detector's output is now narrowed by **four**
declared post-filters, applied in this order in `run()` **and in the walker's
hand-composed chain**:

    M6   shape-family union          cleared 122 reads / 31 identities
    M11  DOM-global receiver         cleared  11 reads /  3 identities   NEW
    M12  language-surface residual   cleared   2 reads /  1 identity     NEW
    M8/M9 explained-writer           cleared  44 reads /  4 identities   (was 1 entry)

Envelope: **1975 → 1954 reads · 1394 → 1381 identities · 385 → 381 files.**
Ledger: **1381 same / 13 gone / 0 new / 0 increased / 0 decreased / 0 issues.**
UI cohort (derived, never transcribed): 51/127/192 → **49/123/185**.
Four files leave entirely: `CompendiumPanel.jsx`, `WhatChangedPanel.jsx`,
`useRoute.js`, `stripe.js`.

## ⚠⚠ TWO GUARDS WRITTEN FROM A MEASUREMENT THAT REFUTED THE OBVIOUS DESIGN

**1. `window` IS AN OBSERVED CORPUS SHAPE.** The natural M11 guard — "a declared
DOM-global root may not be an observed corpus shape" — would have THROWN on `window`
itself and red the gate on the very exclusion M11 exists to make. Measured, not
reasoned: `corpus.shapes.window` exists. The correct guard is against
`corpus.rootShapes` (`campaign`, `pulseResult`, `save`, `settlement`, `wizardNews`,
`worldState`) — the names the detector's ROOT NAME PRIOR actually grounds, which is the
addition that would really gut the instrument. **Always ask the corpus before writing a
corpus-derived guard.**

**2. THE CORPUS CARRIES `test` AS A REAL KEY** (on shape `root`). That is the
independent, executed reason `test on test` (`hookEscalation.js`, `rule.test.test(text)`
where `rule.test` is a RegExp) cannot join M12: the filter's corpus guard refuses any
declared key an observed shape genuinely carries. Deliberately deferred — documented,
not a bug to re-find.

## Laws this mint establishes or re-proves

- **M11 KEYS ON THE RECEIVER TEXT, NEVER THE KEY NAME.** A key-name list containing
  `state`/`replaceState` would suppress a plausible domain key on every shape forever.
  The finding record's `text` is `node.getText(sf).slice(0,80)` of the whole property
  access, so `window.history.replaceState` starts with the root. `?.` at the root is
  matched too. `self` is admissible in the vocabulary but DELIBERATELY NOT DECLARED —
  it is a plausible domain identifier.
- **M12 IS AN EXACT FROZEN KEY SET, NEVER A PATTERN, and the measurement is why:** a
  tempting `/^to[A-Z]/` would also have cleared `toType on history`
  (`stressorDynamics.js`), a real domain key on a real record. Its declaration guard is
  EXECUTED (`key in Object.prototype` etc.); `RegExp.prototype`/`Function.prototype` are
  excluded from the vocabulary because they would admit `source`, `flags`, `name`.
- **A CLASS-(a) REMOVAL AND ITS EXEMPTION ARE ONE COMMIT BY NECESSITY.**
  `assertExplainedWriterExemptions()` runs at MODULE SCOPE and throws if an entry names
  a `CLASS_A_PROTECTED_IDENTITIES` member, so removing `factions on locks` from the
  guard set and declaring it cannot be separated — the file would not import.
- **THE CLASS-(a) EROSION LAW NOW HAS ONE HOME** (`assertClassADebtPreserved`), with
  per-filter prose. M6's pinned message is byte-identical through the refactor.
- **M12 NEEDS NO CLASS-(a) REFUSAL CONTROL AND THE PIN SAYS WHY:** every banked true
  positive is a domain key, so the prototype guard refuses all 20 outright. Driven over
  the whole guard set — stronger than a synthetic clearing control.
- **THE WALKER'S CHAIN IS THE DISABLED-GUARD RISK, and it was PROVEN not asserted:**
  dropping M11 from the walker alone killed three arms (SHRINK-ONLY, the four-filter
  arithmetic, the cohort). The arithmetic line `raw − each filter = live` is what makes
  a forgotten fifth filter red instead of silently pass.
- **The four filters are MEASURED DISJOINT** (no read claimed by two), which is why
  chain order cannot move a figure — but the order is fixed anyway.
- The anti-vacuity floor does NOT move: like 4→5 and unlike 2→4, schema 6 changes what
  is REPORTED, not what is RESOLVED.

## The intended reds at the code half (all three, verbatim)

1. CLI exit 1: `observed-shape baseline: schema 5 — expected 6.` ⚠ Note this is the
   SCHEMA branch, not the detector-digest branch the charter predicted — the schema
   check short-circuits first.
2. walker `the baseline is CONTENT-ADDRESSED…` — expected 5 to be 6.
3. walker `SHRINK-ONLY…` — `{ violations: 0, stale: 13 }`. **violations 0 is the
   headline: a pure shrink adds no identity anywhere.**

## Prose corrections carried (each unjustifiable alone, free behind the filters)

- `deriveOwnNeighbourEntry` **never existed** — one grep, one hit, the M9 comment
  itself. Real writer: `withNeighbourNetworkFromRelationship` (`src/lib/saves.js:233`).
- The M6 docstring's "the corpus binds the THINNEST member" and "the corpus observes one
  shape per leaf NAME" are both FALSE. The mechanism it named was right. The
  "polymorphic parameter" reading proposed against it is REFUTED in source by
  `scanReaders`'s `objects.length === 1` guard — a receiver binding to several shapes
  produces NO finding, so no such row ever reaches M6.
- `cohortNotice()` no longer says the UI cohort "awaits per-row triage" (Lane D
  re-triaged 128/128). Reworded with no number, date or tally, so nothing can rot.

## H26, and what is chartered next

`worldPulse on campaignState`'s exemption was gated on the CR-S6-6 repair landing first
(`da31d170`): gate 0 probes the CONTAINER key while both readers ask `.events`. That is
H26's accepted blind spot, recorded at the declaration. **The chair's standing cure is
BANK-BY-RULE — chartered as SCHEMA 7 — because re-admitting rows is SET-GROWING and
would have made this genesis unreviewable.** Also chartered separately and NOT in this
mint: the `eventLog` corpus-coverage cure (its movement is unpredictable in sign).

## ⏳ ONE PROSE DEBT, MEASURED AND CARRIED TO THE SCHEMA-7 BATCH

`check-observed-shape-readers.mjs`, the `LANGUAGE_SURFACE_PROTOTYPES` comment, says
`source` "is already an observed domain key on **four** shapes in this very estate."
**The measured figure is TWELVE** (`causes`, `changes`, `charter`, `evidence`,
`garrison`, `incomeSources`, …). "Four" was mis-taken from four baseline FINDINGS on
`source` — and a finding proves the shape does NOT carry the key, which is the opposite
of what the sentence needed. The CONCLUSION is unaffected and in fact strengthened: a
vocabulary admitting `RegExp.prototype`/`Function.prototype` is a door, not a guard.

Measured at the same time, and all confirming the design:
`name` on **317** shapes · `toType` on **3** (so the "genuine domain key" phrasing beside
the `/^to[A-Z]/` refutation is sound) · `flags` on 1 · `test` on 1 · `lastIndex` on 0 ·
`toLocaleString` on **0** (so M12's corpus guard is satisfied and non-arbitrary).

**Why it is not fixed in place:** one byte anywhere in that file moves
`detectorTreeDigest` and reds the gate until a new mint — the same forcing mechanism the
mint exists to satisfy. A schema-7 mint for one wrong numeral is not proportionate, and
**schema 7 is already chartered** (bank-by-rule), so this rides its prose batch exactly
as schema 6 carried schema 5's. ⚠ Deliberately deferred — documented, not a bug to
re-find.
