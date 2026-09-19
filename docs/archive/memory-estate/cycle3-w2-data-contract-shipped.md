---
name: "Cycle-3 Wave 2 (data-contract reversible half) shipped"
metadata:
  node_type: memory
  created: 2026-07-22
  type: project
  scope: "Cycle-3 fix program, Wave 2 — the dead-vocabulary / data-contract class (H1,H3,H14,M2,M5,M15,M16) + chokepoints + vocabularyTotality walker"
  branch: claude/cycle3-w2-data-contract
  commit: 2b40317a
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T06:31:48.962Z
---

# Cycle-3 Wave 2 (data-contract) — SHIPPED

Branch `claude/cycle3-w2-data-contract` off the Wave-1 fold **182f98f8**; two commits,
NOT folded/pushed (the manager folds): **8c5dad6c** (chokepoints + fixes) + **2b40317a**
(the walker + T4 waivers). The class = the FACTION-KEY defect one level up: per-consumer
hand-rolled derivations of a producer's value set, hidden by silent defaults.

## Golden-neutral receipts (the wave's law — all HELD)
- generatorGoldenMaster is **100% drifted at base (187/187, parked for Wave 9)**; I diffed
  the drift KEY-SET before/after every generation-touching change — **identical 187 keys**
  each time (monsterThreat extraction, M5 bg, legitimacyBandFor). So a fully-parked golden
  can't move its signature; the drift-set-diff is the byte-identity proof.
- goldenViewModel parked signature (the SHARED_FIELDS canon snapshot) **byte-identical** to
  base after H3/M5.
- Full-surface: broad sweep 8672 + shard1 7502 + shard3/4 4161 ≈ 20k executions, **zero real
  reds beyond parked goldens**. ⚠️ Parallel shard runs spuriously red ~14 files under CPU
  contention (all 8 *.pglite* + perf/distribution/property/component) — **re-run failures
  with `--no-file-parallelism`; they ALL pass sequentially.** ordering.test.js +
  creditAutoReload are the same flaky class (pass in isolation).

## Closure hazard (⚠️ bit this wave — READ before touching src/data)
- **src/data/stressTypes.js is EAGER** (bundled in the first-paint `data` chunk). Adding the
  15 `militaryPosture` fields there added **+540 B** and breached the ratchet. **Cure
  (module-split, pre-approved): display-only data belongs in the LAZY display module.** The
  posture map now lives in `defenseDisplay.js` (MILITARY_POSTURE) with the COLOUR still
  single-sourced from STRESS_TYPE_MAP; the walker enforces coverage at test time instead.
- **TRUE base closure at 182f98f8 = 1,039,995 B** (measured via temp worktree), NOT the
  1,039,975 the vendorPdfLazy header quotes (that's the composite lineage, ~20 B smaller).
  My final = **1,039,995 = Δ0**. To measure: `git worktree add --detach .../w2-base 182f98f8`,
  build, BFS the entry static closure (vendorPdfLazy's `entryStaticClosure` logic).

## Per-finding disposition (all pinned, plant-verified where behavioral)
- **H1** `settlementThreat.js`: drop dead `embattled` arm, add `heartland`, new `isCalmThreat`
  suppresses BOTH calm baselines (frontier+heartland) in DossierHeaderRow + SettlementPalette
  (was a broken raw HEARTLAND chip on ~a third of settlements). contrast.test.js hardcodes its
  pairs (no THREAT_DISPLAY iteration) so it didn't break.
- **H3** `DEFENSE_STRESS_STATUS` derived over STRESS_TYPE_MAP → all 15 (was 6). ⚠️ This
  REVERSES the earlier pdf-4 fix that wrongly SHRANK the PDF to 6 to match the buggy screen;
  updated pdfParityFixes.test.js (wartime NOW raises a callout on both surfaces). Graduated it
  from a "partial by design" EXEMPTION to a full-coverage `importedTables` entry in
  stressTypeRegistration.test.js.
- **M2** new `safetySeverity.js` chokepoint (total, LOUD `unknown` fallback). Classifies
  `Strained`+Critical/Quarantined/Restricted (were silent neutral). Unifies DefenseTab +
  OverviewTab (JUDGMENT: OverviewTab's divergent accent palette now matches DefenseTab's —
  the "mirror" the finding wants; display-only, not golden).
- **M5 + chokepoint 4** `legitimacyBandFor` extracted in factionDynamics.js; computePublicLegit
  + assembleSettlement patch delegate. Fixes the stale `publicLegitimacy.bg` on band crossings.
  ⚠️ M5 DOES shift generation (bg on band-crossers) — absorbed by parked generatorGoldenMaster
  (drift-key-set unchanged); Wave-9 ONE REGEN bakes it. ⚠️ **computePublicLegitimacy return
  key order preserved verbatim** (it's JSON.stringify-hashed).
- **H14** `dramaticIronyBrief` (composers.js): read the REAL rumor projection shape
  (headline + nested truth.divergence; NO `belief`/`subject` keys) — the branch was
  100% DEAD. Pinned via the REAL rumorNetwork (`advanceRumorLedgers`), not a fixture.
  ⚠️ needed a JSDoc cast (`{ truth?: {divergence?, trueHeadline?} }`) or domain-strict reds +4.
- **M15** `neighbourBackLink.js`: partner-side description uses `sourceRole` (new settlement's
  role), not `targetRole` (partner's) — fixes inverted overlord/vassal. Symmetry pin.
- **M16** `laneClassifier.js`: GOLDEN-LAW gate fails CLOSED — `shiftsGolden !== false` (trusts
  only an explicit false). ⚠️ safe only because the existing `greenSoak` fixture sets
  `shiftsGolden: false` explicitly.

## The guard — vocabularyTotality.walker (2b40317a)
- HARD contracts (bound consumers, both ways): THREAT_DISPLAY==tiers, DEFENSE_STRESS_STATUS==
  STRESS_TYPE_MAP keys + non-empty postures, safetySeverity total over producer tokens.
- **WAIVER manifest (shrink-only, dated 2026-07-21)**: H15 (deriveExternalThreat threat branch —
  dead {safe,civilized}, missing {heartland}), H16 (dead `'occupation'` substring vs emitted
  `occupied`), H4 (safetyContrib missing {critical,controlled,restricted,quarantined}). Asserted
  by EQUALITY → the Wave-9 fix forces the waiver to shrink. Adversarial self-tests included.
- ⚠️ **New invariant test files trip `mutationCoverageManifest.test.js`** (E-A totality):
  enumeration = every test under tests/lint (+ 6 enforcer dirs) OR basename matching
  /(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|
  exhaustiveness|roundtrip|golden|contract|pin)/i. My `vocabularyTotality.walker` (lint dir) +
  `defenseStressStatusCoverage` ("coverage") needed manifest entries. Used `{"kind":"rationale",
  "ref":"self-proving-meta"}` (walker, has embedded adversarial self-tests) + an inline rationale
  (coverage pin, mutation-covered by the walker). ⚠️ `uncovered` would breach uncoveredBaseline=199.

## Deferrals (documented, not missed)
- **`timeProgression.reBand` is a THIRD legitimacy-band hand-roller** (PLAY-TIME). Deliberately
  NOT unified into legitimacyBandFor: importing a generator export into src/domain trips the
  domainGeneratorsBoundary ratchet, and reBand feeds the parked worldPulse goldens — a play-time
  change belongs to a worldPulse lane, not this golden-neutral wave. Header-documented in
  factionDynamics.legitimacyBandFor's JSDoc.
- **H15/H16/H4** stay broken until the owner's Wave-9 ONE REGEN (T4 golden-shifters); the walker
  waivers hold them exactly.
- Safety-token totality: the producer set is CURATED (safetyProfile composes labels at runtime)
  and bound to source by a presence check — a brand-new leading token upstream is caught only
  once curated. Honest-note in the walker header.
