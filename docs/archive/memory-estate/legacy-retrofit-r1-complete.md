---
name: legacy-retrofit-r1-complete
description: "THE LEGACY RETROFIT'S R1 HALF IS COMPLETE @ fe32c253 (170/170 subject-phrase kinds, §3+§4) — what remains is §1+§2's 30 registry-backed pools, which THROW if wired the same way; plus the thin-band non-widening fact and the load-bearing single-voiced control"
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-03T14:22:35.255Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

# THE LEGACY RETROFIT — R1 CLOSED @ `fe32c253` (2026-08-03, minifold / claude/composite-r4)

`docs/content/RECEIPT_POOLS_LEGACY.md` is wired at **170 of 200 kinds**. Four slices:
`1b9b2b10` (§3c population, 4) · `6d33aa8d` (§3a war 12 + §3d events 28) · `9dc12049`
(§3c trade 13) · **`fe32c253` (§3b faith 5 + §3e divination 1 + ALL of §4's 107)**.
The annex header now carries a RETROFIT COMPLETE table; rulings are J-LEG-WIRE-1..17 in
`docs/FABLE_VALIDATION_QUEUE.md`; `docs/SOL_QUEUE.md` item 22 carries the do-not-re-wire
note.

## Why

Successors keep re-deriving what is wired and what is not, and the annex's own accounting
(200 kinds) invites the wrong conclusion that the retrofit is 30 kinds from done in the
same shape. It is not — the remainder is a different machine with a runtime-throw failure
mode.

## ⚠️ WHAT REMAINS IS NOT MORE OF THE SAME — §1 + §2 WILL THROW

- **§3 + §4 (done)** are read by ONE pure selector, `whatPhrase` in
  `src/domain/display/settlementRumors.js`. No slots. Pools live in
  `rumorPhrasePools.js` (§3, 63) and `rumorFallbackPhrasePools.js` +
  `rumorFallbackPhrasePoolsEvents.js` (§4, 107 — split ONLY for the 800-effective-line
  domain ceiling, R-BLD-4).
- **§1's 24 receipt-sentence pools** are consumed by five registry-backed functions in
  `eventProse.js`, each indexing a PARALLEL `requiredSlots` array. **A pool grown without
  its parallel row THROWS at the new index.** Wiring note LEG-3 requires a walker
  (`pool.length === requiredSlots.length`) as a PREREQUISITE, not a follow-up. §1c
  (`corruption_exposed`) is the one exemption — `warReceipt` → `pickLine` does no slot
  filtering and has no parallel array.
- **§2's 6 news-summary pools** are `{headline, summary, reasons}` triples keeping live
  interp keys (`${x.dep}`, `${x.built}`, `${x.graft}`; `reconstruction` carries `${x.year}`).

## How to apply

- **Never re-wire §3/§4.** CHECK GIT FIRST; the queue lists specs, not open work.
- **The two corpora differ only in variant-1 provenance.** §3's index 0 stays in
  `WHAT_PHRASES`; §4's index 0 is COMPUTED by `whatPhrase` and PREPENDED — deliberately
  not transcribed, so the byte-identity anchor cannot drift (J-LEG-WIRE-13). Both arms go
  through one `widenedPhrase()` helper on key `${seed}::what::${key}`.
- **12 MUTILATED §4 anchors are OWNER-GATED** (DEFECT-1/2/3, LEG-7): `coup_detat` still
  renders `"detat"`, `institution_capture` → `"capture"`. The roster is frozen BOTH as a
  literal and by doc parse in `tests/domain/rumorFallbackPhrasePools.test.js`, so a silent
  repair AND a new mutilation both red. Do not repair opportunistically.

## Facts a successor would otherwise re-derive the hard way

- **⚠️ THE `thin` RUMOR BAND DOES NOT WIDEN, EVER.** Its `HEADLINE_FRAMES` entries carry
  no `{what}` slot (a maximally degraded rumor is only "trouble near {where}"), so no
  subject phrase reaches it. Pinned in `tests/domain/settlementRumors.test.js` as
  `band === 'thin' ? 1 : pool`. A future "why didn't thin widen" investigation is answered
  here.
- **⚠️ `war_mobilization` IS NOW LOAD-BEARING IN TWO TEST FILES.** It is the unwired
  negative control in `rumorPhrasePools.test.js` AND the single-voiced carrier that makes
  `settlementRumors.test.js`'s ANTI-REPETITION frame count mean frames. It is safe because
  it is one of the **102 `WHAT_PHRASES` kinds in NEITHER §3 nor §4** — no slice can consume
  it. Do not wire it without fixing both files.
- **§4 attribution must be LONGEST-MATCH.** Index 0 there is a bare de-underscored token,
  so it can nest inside its own variants — exactly 3 do (`hostile`, `patron`,
  `institution_capture`). Scanning a pool in order silently UNDER-REPORTS the widening and
  makes a live-path pin weaker than it looks. No two AUTHORED variants nest (measured: 0).
- **⚠️ `WHAT_PHRASES` must stay a map of plain STRINGS** — six walkers across three lanes
  read its shape. That is why the widened variants live in sibling leaves and index 0 is
  prepended rather than turning the map into arrays. Carried forward from slice 1.
- **Zero goldens capture rumor prose, and it was measured, not assumed** (byte scan of all
  56 persisted fixtures + before/after runs of the whole `tests/property` tree). The ledger
  goldens hash STRUCTURED records; `settlementRumors` renders fresh into the lazy
  dossier/PDF/brief chunks. This is why four slices moved shipped prose with no re-record.
- **The repetition-envelope band MUST be normalized to `1/poolLength`.** A fixed 0.25 band
  is arithmetically impossible for floor-4 pools (uniform on four members IS 0.25). Carried
  forward from slices 2-3.
- **Generate pool literals FROM the doc, never transcribe them.** A parser + emitter script
  over the annex is how all four slices were built; hand-copying 1,026 variants would have
  broken the corpus join.
- **⚠️ The anchor walker's `// anchored:` must be the LAST comment line above the
  assertion**, and five shape laws belong in ONE table-driven site (`R1_FORBIDDEN`) rather
  than five bare `not.toMatch` lines — `negativeAssertionAnchor.walker.test.js` counts
  SITES and its frozen roster may not grow.
- **The refactor-safety control that should be reused:** `git archive HEAD` into the
  scratchpad, import the old and new modules side by side under plain `node` (these
  modules import cleanly without vite), and compare seeded draws. This lane compared
  **28,500 draws across the 57 already-shipped kinds: 0 moved**, which is how "the earlier
  slices' shift is not re-disclosed" became a measurement rather than a hope.

## Shared-tree note (this bit bites)

At commit time `docs/SOL_QUEUE.md` held a FOREIGN hunk from the concurrent About-split
lane. The index was carved (`git diff -- file > p.patch`, delete the foreign hunk, fix the
`@@` new-side start, `git apply --cached p.patch`) so only this lane's bullets committed;
the foreign bullet stayed uncommitted in the tree. The pre-commit hook (lint-staged) runs
`eslint --fix` and a full stash/restore cycle — the post-commit survival check ran clean
(nothing vanished) and the gate was RE-EARNED on the committed bytes (972 passed).
Concurrent lanes active in minifold that day: About-split, a WR-7d ransom lane
(`ransomChoices.js`, `ransomClaim.js`, `sendTwoDivergence.js`), and a size-baseline lane
touching `scripts/.size-baseline.json` + `src/App.jsx`.
