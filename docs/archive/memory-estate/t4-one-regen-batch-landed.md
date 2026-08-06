---
name: t4-one-regen-batch-landed
description: "The T4 ONE-REGEN batch (lawAxis restore + deity pool removal + Herald record ids) landed 2026-07-28 — one declared shift, 523/523 generator golden rows, plus four spec corrections a successor must not re-derive"
metadata: 
  node_type: memory
  type: project
  originSessionId: a84f4ff8-9bed-4c25-855b-122c9ed57f27
  modified: 2026-07-28T11:24:12.797Z
---

# THE T4 ONE-REGEN BATCH — landed 2026-07-28 (UNCOMMITTED at write time; orchestrator folds)

The deliberately-last lane of the owner's tail, executed as ONE declared same-seed shift.
Owner signature = the 2026-07-27 order naming this batch with its written notes.
Full declaration lives in `docs/CAPABILITY_REMEDIATION_PLAN.md` Progress blockquote.

## What moved — exactly one golden surface
`tests/fixtures/generator-golden-master.json`: **523 of 523 rows**, ZERO added or removed
(before/after key-set diff = pure value churn). Driver: deity-pool removal — every seed baked
`config.latentPantheon` + `config.faith='pantheon'` into the settlement blob the golden hashes.

**THE HARD-STOP GATE that licensed the re-record:** `tests/generation.test.js` 21/21 green with
its inline structure-fingerprint snapshot **byte-unchanged**. That is the executable proof that
per-step named PRNG forks held — removing a step moved only its own keys, never structure. Run it
BEFORE any re-record on any future step removal; it is the cheapest isolation proof in the repo.

## ⚠️ Four spec claims that were WRONG (ground-truthed; do not re-derive)
1. **The generator golden corpus is 523 rows, not 187.** Any plan quoting 187 is stale.
2. `tests/domain/deityEmbedWriterParity.test.js` imported `poolDeityEmbed` **from the deleted
   step**, so the "FOUR deity embed writers" are now **THREE**. The pool builder has no survivor:
   the activation seam copies a persisted record verbatim and mints no embed.
3. `tests/domain/latentPantheon.test.js` carried a **real-pipeline e2e test** asserting a baked
   latent patron (the spec believed the file was fixture-only). It was re-sourced onto a persisted
   record. A grep for `generateSettlementPipeline` in the "keep" list catches this class.
4. **`tableEvents` cannot carry actor ids at all**: `TableEventTargets` holds `npcNames` (prose),
   never ids. Wiring it would violate the NEWS ADDRESS LAW it was meant to serve.

## Herald record ids — the census, with its denominator
98 news-entry mint sites in `src/`. **8 wired** (a typed id was genuinely in hand, in the realm
entity web's own spelling): factionCapture (`factionIds`), npcLadderKernel ladder beat +
investiture, npcLadderContest contest + support, npcGrowthKernel, assizeKernel verdict,
informationStatecraft exposed-lie mouthpiece. **1 deferred with reason**: the ladder/assize `fkey`
is `fac.<token>` — a DIFFERENT id space from the web's `<saveId>:<stablePart(name)>`, so wiring it
mints ids that resolve to nothing. **89 not-applicable**: their actors are settlement ids already
carried by `settlementIds` (infowar spy/intel, all supplyWebWarfare beats, armyTransit, naval,
moral reckoning, belief misjudgment, cause lifecycle, seasons, realm events…).

⭐ **The id-space rule this batch established:** an address-chain id is resolvable ONLY if it is
`${saveId}:${npc.id || stablePart(name)}` (npcAgency.npcId ≡ realmEntityWeb.realmNpcPulseId) or
`${saveId}:${stablePart(factionName)}` (factionCompetition.factionId ≡ realmFactionPulseId).
Kernel-local handles (`fkey`, assize's local `npc.id` charge key) are NOT in that space — check
before wiring, or the Herald renders dead links.

## Non-mover findings (recorded because absence is evidence)
- **`worldpulseDeityGolden` did NOT move**: its scenario never commits a conversion re-embed, so
  the lawAxis restore ships with NO golden witness. The compensating proof is the new `chaos01`
  effect-reachability pin in `deityEmbedWriterParity.test.js` (lawful⇒0 vs chaotic⇒1; both read
  0.5 before the restore, so it reds on the old writer — negative-controlled in-session).
- **The PDF fixed-seed `goldenViewModel` snapshot did NOT move**: latent keys never reached the
  view model.

## Hazards that bit during execution
- **sizeBaseline TOLERANCE-0 fired as recorded**: one added effective line took
  `applyWorldPulse.js` 948 → 949. Cure applied = net-zero combine inside the same function (name
  the embed, build the config in the `return`). Comments do NOT count; only code lines.
- **`compactIds` in `wizardNews.js` threw on non-array input** (pre-existing). It runs on
  PERSISTED save data every feed read, so it was hardened to degrade to `[]` (JUDGMENT, vetoable).
- **`ARCHITECTURE.md` is a code-derived doc**: `tests/docs/architectureFreshness.test.js` pins the
  exact step count and Order list against `steps/index.js`. Any step add/remove must edit it
  (23 → 22 here).

## Foreign dirt observed mid-batch (NOT this batch's; never stage with it)
- `tests/generators/effectReachability.coverage.test.js` (+82/-18, access-compatibility corpus row)
- `tests/fixtures/distribution-envelopes.manifest.json` (roads-missions GENESIS re-measurement,
  cites commit f9560c57)

Related: [[deity-doctrine-no-premade-pool]] · [[the-promise-ratified]] · [[news-address-law]] ·
[[sizebaseline-exact-ceiling-hazard]] · [[minifold-tree-is-live]]
