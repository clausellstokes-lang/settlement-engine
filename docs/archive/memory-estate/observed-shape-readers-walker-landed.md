---
name: observed-shape-readers-walker-landed
description: "⭐⭐ The reader-without-a-writer walker LANDED @ 1d3cdf73 — it rediscovered all three TCD defects at a pre-fix sha. ⚠⚠ The STEADING leg is load-bearing (40 driven intervals mint ZERO); the ratchet is COUNT-based so an identity swap at constant count passes."
metadata:
  node_type: memory
  type: project
  created: 2026-08-07
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T10:44:33.107Z
---

# The observed-shape reader walker — structural prevention for a whole defect class

Landed `1d3cdf73`. Cures the class where **a reader asks for a key no writer produces**, which
is invisible because the read is defensively guarded and degrades to a default. Four earlier
members: TCD-1/2/3 and the recorded [[faction-key-defect-class]].

**Deliverable:** `scripts/lib/observed-shape-corpus.mjs` (the EXECUTED key census) ·
`scripts/lib/reader-shape-scan.mjs` (the AST receiver resolver) ·
`scripts/check-observed-shape-readers.mjs` (shrink-only CLI) ·
`scripts/.observed-shape-readers-baseline.json` (**3,236 findings / 547 files**, frozen at
`3800bcb6`) · `tests/lint/observedShapeReaders.walker.test.js` (17 tests) · a
mutation-coverage-manifest row. ⚠ Wired as **`check:observed-shape-readers`, NOT in the
`npm run check` chain.**

## ⭐⭐ THE ACCEPTANCE THAT MAKES IT NON-VACUOUS

**It rediscovered all three ground-truth defects at the PRE-FIX sha `eca65c8a`**, independently
reproduced by a verifier who built its own archive: TCD-1 at `rulingPower.js:225` (**plus 31
further `.id`-on-a-faction reads across 12 modules nobody had found**), TCD-2's four rows at
`envoyNegotiationPictureBuilder.js:137-142`, TCD-3's `foundingTier`.
⭐ **A WALKER'S ACCEPTANCE TEST SHOULD BE THE BUGS THAT MOTIVATED IT, RUN AT A SHA WHERE THEY
STILL EXIST.** Derive the corpus INSIDE that archive so both halves belong to one commit.

## The method — executed, never transcribed

16 real generations (**4 seeds × 4 configs**), 12 intervals of the real campaign world pulse
with all **73 DISCOVERED `*Enabled` flags** lit, and 12 steadings minted through the shipped
`FORCE_FOUND_STEADING` realm verb. Types are consulted NOWHERE (types were wrong or silent in
all four defects).

- ⚠⚠ **THE STEADING LEG IS LOAD-BEARING AND WAS ONLY FOUND BY MEASURING: 40 driven intervals
  mint ZERO steadings** (seeding integrator + cooldown + tier cap never reached), so without
  the forced verb the `SatelliteRecord` shape — and TCD-3 with it — is UNMEASURABLE. **A corpus
  that never produces a shape reports NO findings on it and looks clean.**
- ⚠ **UNION NEVER INTERSECTION**, enforced by construction: a key present in ANY run counts as
  written. Measured: the 4-seed corpus observes **269 extra keys across 37 shapes** that a
  1-seed corpus never sees. Single-seed would have flooded the output with situational keys.

## ⚠⚠ KNOWN BLIND SPOT — IDENTITY SWAP AT CONSTANT COUNT

The ratchet holds a per-file **COUNT** ceiling, so a file's findings can CHANGE IDENTITY while
the count holds and the ratchet stays green — demonstrated live on `rulingPower.js` (ceiling
10). The inventory cannot GROW behind a failing row (per-file ceilings; unbaselined file = 0),
but it can CHURN. Cure = a content-addressed baseline. ⏳ Repair round dispatched 2026-08-07.

**Why:** three live bugs were found by accident during a typecheck census, all one shape, and
nothing existed that could find the rest.

**How to apply:** run `npm run check:observed-shape-readers` after any wave that adds a reader
of a persisted record. Treat a new finding as "read the WRITER before annotating" — decide
whether the type is wrong or the code is. Related:
[[typecheck-red-root-cause-and-reader-without-writer-class]] · [[epistemic-prevention-shipped]] ·
[[fixture-mirrors-deriver-dead-arm-class]].
