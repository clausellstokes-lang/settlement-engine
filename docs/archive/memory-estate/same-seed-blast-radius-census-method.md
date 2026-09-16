---
name: same-seed-blast-radius-census-method
description: The census that characterises a same-seed change — most determinism tests CANNOT move (they compare two live runs), and the real risks are the one committed hash and the in-pipeline persisted receipt
metadata:
  type: reference
---

**MEASURED 2026-08-11** for the owner-approved `isPort` + `linkedInstitutionIds`
generation repair. This is the method and the map for ANY future same-seed change.

⭐ **THE STRUCTURAL INSIGHT: nearly every determinism test in this estate CANNOT MOVE,
because it generates TWICE AT RUNTIME and compares the two results against each other.**
A deterministic output change shifts both sides identically. That covers
`pipeline.property.test.js` (100 fast-check runs of full-JSON identity),
`generation.test.js`, `customContentDeterminism`, `generationCertificationCorpus`
(byte-for-byte replay of every profile), `pipelineSeedSlotContract`,
`structuralValidatorDeterminism`, `determinismLeaks`. **The only way they red is if the
change introduces NEW NONDETERMINISM** (an insertion-ordered `Set`/`Map` walk) — which is
exactly what they should be run to prove.

⚠⚠ **THE ONE COMMITTED HASH OVER A GENERATED SETTLEMENT IS
`tests/fixtures/generator-golden-master.json`** (525 rows,
`tier|culture|terrain|trade|threat|seed → sha256(JSON.stringify(settlement))`, driven by
`tests/property/generatorGoldenMaster.test.js`). Repo-wide there are only TWO snapshot
assertions and ONE `.snap` file. Every other hasher works on hand fixtures, worldPulse
projections, GLB bytes, or edge-bundle source — not pipeline output.

⭐ **FINGERPRINT MODULES THAT LOOK DANGEROUS AND ARE NOT:**
`src/lib/settlementFingerprint.js` serialises the WHOLE settlement but has **no committed
golden** (minted live by `aiSlice` for staleness detection; zero test references);
`contentFingerprint.js` never sees a generated settlement (zero `npc` occurrences);
`structuralFingerprint.js` reads NPCs only as COUNTS and DISTRIBUTIONS and its docblock
says "NEVER copied: any npc field".

⚠⚠ **THE RESIDUAL NOBODY ASKS ABOUT — `settlement.generationCoherenceReceipt` IS A
PERSISTED IN-PIPELINE SURFACE**, minted at `assembleSettlement.js:248`, the very next
statement after `ensureFactionStructuralNpcs` at `:237`. Its `presentationBranches`
include `npcs: settlement?.npcs` and `collectStrings` RECURSES INTO ARRAYS — so a
newly-non-empty array element becomes a NEW GENERATED STRING run through four scanners.
Two tail risks: a finding row can be appended at a new path while the same verdict already
fires elsewhere (changing persisted bytes without changing `status`), and the finding
lists **`break` at >= 25**, so an inserted finding can EVICT a later one. Both bite only on
settlements already at `needs_review`.

⭐ **THE VERIFICATION ORDER THAT FALLS OUT:** (1) the one genuinely uncertain gate alone
(here `observedShapeReaders.walker`, ~50 s corpus build); (2) the exact committed COUNT
pins — `generation.test.js`'s inline snapshot and `tests/pdf/__snapshots__/
goldenViewModel.test.js.snap` (⭐ `GOLDEN_SHIFT_LEDGER.md:910` records a past shift moving
"exactly one value, headcounts.npcs 10 → 11", so that snapshot IS npc-count sensitive and
is the canary); (3) the self-comparing determinism suites, to prove no NEW nondeterminism.

⚠ Baselines that are NOT exact and therefore cannot red on perturbation: the test-ratchet
`totalTests` is a **90% scope floor**, and the OSR sentinel is a **90% anti-vacuity floor**.
⚠ But `.observed-shape-readers-baseline.json` IS exact and BIDIRECTIONAL — schema 4
"permits no dormant headroom", so a row that GOES reds as `stale` exactly like a row that
appears. Related: [[the-promise-ratified]], [[regen-edit-loss-hazard]].

## ⭐⭐ THE REPAIR LANDED @ `0f85ced0` — and two techniques are worth keeping

**THE ID-LESS-INSTITUTION PREMISE, MEASURED: 3632 of 3632 institutions across 120 seeded
generations carry NO `id`.** So `linkedInstitutionIds` was never a re-ordering or a late
binding — **it was the WRONG IDENTITY.** ⭐ **THE JOIN LAW:** consumers join on
`i?.id || i?.name` (`propagate.js:478`, and `EventComposer.jsx:332` builds the DM picker's
option values identically), so reading that makes a GENERATED link and a DM-AUTHORED link
**the same string**. Rejected alternatives and why: `catalogId` (no consumer joins on it,
null for custom content), bare `name` (six post-generation writers DO mint real ids), and
stamping ids onto institutions (a persistence-shape change, owner-gated, far wider than
approved).

⭐⭐ **THE FORCED-FIELD TECHNIQUE — how to PROVE a golden shift is confined rather than
assert it:** re-hash every new settlement with the changed field forced back to its old
value, and require the OLD manifest to reproduce EXACTLY. Here: **525/525 rows, 0
unexplained**, which converts "only 25 rows moved and I think I know why" into a proof
that nothing else moved for any other reason. Use this for every future same-seed change.

⭐ **REGISTER, DON'T RE-RECORD.** This tree's `GOLDEN_SHIFT_LEDGER_MAIN.md` discipline
leaves the manifest BYTE-IDENTICAL and lets the golden read **RED BY DESIGN** pending the
owner's batched `UPDATE_GOLDEN`. A registered red with all before→after hashes recorded is
**not debt and not a regression** — it is the owner's gate held open honestly.

⚠⚠ **A REPAIR CAN MAKE A PRE-EXISTING DEFECT VISIBLE, AND THAT IS NOT THE REPAIR'S BUG.**
4 of the 20 new links are absurd (`/council|court|hall|government/` matches any "…hall", so
a Lord Mayor links to "Gambling halls"). The lane REFUSED to narrow the pattern — it would
have been a **second, unapproved same-seed shift smuggled beside an approved one.** ⭐ The
right sequencing is to fix it under the SAME `UPDATE_GOLDEN` so the seed line moves ONCE.
