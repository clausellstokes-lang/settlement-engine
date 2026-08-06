---
name: enforcer-ej-depth-blocked-finding
description: "⚠⚠ ENFORCER E-J (kernel outcome→outcome causal depth / deepChains) IS BLOCKED as briefed — PROVEN the mover-beat causedBy seam (ladder-contest / generosity / roads V-24d) can NEVER reach the recorded provenance ledger, so threading causedBy on those beats records ZERO deepChains. NOT shipped; no commit. The real seam is central + owner-gated. Base claude/e-j-depth @ b339e178 untouched."
metadata:
  node_type: memory
  type: reference
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T07:31:17.166Z
---

## What was asked
Enforcer E-J: have 2-3 kernels (ladder contests resolved→opened, generosity→gratitude,
war→occupation) mint RECORDED outcome→outcome `causedBy` edges, dark-gated on
provenanceLedgerEnabled, mirroring roads V-24d, so the arc-soak's `deepChains` metric
(tests/simulation/emergentArcSoak.test.js) lights up ≥ a measured floor. Owner-gated part:
ContestRec.openedTick schema add.

## Why it's blocked (CONFIRMED — code trace + empirical)
The recorded provenance ledger (`worldState.spatialLedgers.provenance`, written by
`appendPulseHistoryWithProvenance`, provenanceKernel.js) records ONLY receipts whose id lands
in the durable pulseRecord = `selectedOutcomes` (top-24 applied candidate outcomes) ∪
`impactDigest`. **`impactDigest` is snapshotted ONCE at `pulseKernel.js:1615` =
`compactImpactDigest(applied.newsEntries)` — BEFORE every mover runs** (generosity @2205,
ladder/traditions/**roads** @2359 via `advanceNpcGrowth…AndLadderAndTraditionsAndRoads…`,
treaties @2374, …). Those movers append their beats to **`wizardNews`** (via
`appendWizardNewsEntries` / `applyPulseMover`), **never to `applied.newsEntries`**. So the
ladder-contest / generosity / roads beats are STRUCTURALLY EXCLUDED from the recorded ledger.

- Two namespaces never meet: ledger KEYS are receipt ids `wizard_news.${tick}.${transition}.${id}`;
  `causedBy`/`sourceEventId` values are raw ids (`world_outcome.conquest.f.104`, `candidate.*`).
  `deepChains` counts `keySet.has(parent)` — a parent only counts if it equals a full receipt
  KEY. roads V-24d's `captureCauseId` returns a full `wizard_news.…` shaped id (why the UNIT
  test roadsProvenanceThread passes), but in a real drive the roads beat never reaches the
  durable set, so it never lights `deepChains`. The memory [[recorded-causal-depth-reality]]
  said roads "doesn't survive the ≤18-slot impactDigest" — imprecise: it never even REACHES the
  impactDigest candidate pool (minted after the 1615 snapshot).

**Empirical proof:** drove the arc-soak fixture 15y (180 one_month ticks × 8 settlements) with
`provenanceLedgerEnabled + npcLadderEnabled + contestedGoalsEnabled + memoryWeaveEnabled +
constructiveFlowsEnabled + roadsEnabled` ALL lit → ledger = **byte-identical 3144 entries**,
ZERO npc_contest / generosity / roads receipts (identical to flags-off). All 3144 recorded
entries are `wizard_news.${tick}.world_pulse.applied.candidate.*` (3080) or
`wizard_news.${tick}.queued.regional_*` (64), each parented to its ROOT (one-hop-to-root).

## The REAL seam (why it's owner-gated + out-of-scope)
Recorded outcome→outcome DEPTH can only live among the recorded receipts: the queued
regional-wave lineage (`src/domain/region/propagation.js` `waveImpactForChannel` — each wave
already carries `sourceImpactId` = immediate parent) and/or war/occupation applied-outcomes.
The queued-impact receipt builder `createWizardNewsEntryFromImpact` (region/wizardNews.js:603)
sets `sourceEventId` = the ROOT event (flatten). Making a d≥1 wave (or a conquest) receipt name
its IMMEDIATE parent's RECORDED RECEIPT KEY requires reconstructing that key
`wizard_news.${parentTick}.${transition}.${parentImpact.id}` — but the child carries only the
parent's raw `sourceImpactId`, NOT the parent's recorded tick/transition. That needs NEW
parent-receipt-tick tracking infra, touches CENTRAL files (applyWorldPulse / region propagation
/ war layer — not "the 2-3 kernels"), and CHANGES recorded-provenance attribution SEMANTICS
(immediate-parent vs root) — an owner-gated schema/persistence-shape call the brief did NOT
authorize (it authorized only ContestRec.openedTick).

## Decision (judgment-ledger §6 — doomed literal instruction + owner gate)
Did NOT commit. Building the briefed mover-beat `causedBy` would be byte-neutral but record
NOTHING (a no-op dressed as a feature); building the central wave/war semantic change is
owner-gated + out-of-scope. Escalated the proven finding + recommended design to the owner.
ContestRec.openedTick was NOT added (its only purpose was reconstructing the opened-beat id,
which is a mover beat that isn't recorded). Base @ b339e178 untouched, tree clean.

## Recommended path (if owner wants real recorded depth)
Mint `causedBy` at the LEVEL THAT REACHES THE LEDGER, pointing at a full recorded receipt KEY:
(a) queued regional-wave d≥1 receipt → its immediate-parent impact's recorded receipt key
(needs parent-receipt-tick tracking through the queue), and/or (b) a conquest/occupation
applied-outcome → the mobilization/deploy applied-outcome's recorded receipt key (war layer
tracks startedTick; reconstruct the `newsEntryForOutcome` candidate receipt id, pin it).
Both dark-gated + additive (keep the root edge, ADD the immediate-parent edge). Then the
arc-soak `deepChains` lights up for a REAL drive. This is a provenance-semantics change ⇒
owner sign-off first.
