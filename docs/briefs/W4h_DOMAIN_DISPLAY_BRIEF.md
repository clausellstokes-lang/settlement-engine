# W4h Implementer Brief — Domain-display read-models (army / trade-pressure / visibility)

Opus implementer, Phase 5 Reunification W4h, /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; manager reviews + commits. BINDING:
memory/feature-parity-ledger.md. REFERENCE (read-only): /Users/cstokes/Desktop/settlement-generator/settlement-engine.

FENCE: src/domain/display/** (the 3 new read-models), src/pdf/lib/liveWorld.js (un-stub only),
src/components/admin/AdminSimTuningPanel.jsx (NEW) + its mount in src/components/AdminPanel.jsx.
NO git add/commit/stash.

## What this wave closes
Three PURE domain-display read-models THEIRS has that OURS dropped — they block two already-landed
surfaces that currently degrade to an off-state:
- W4f left `army = null` and `tradePressure = []` in src/pdf/lib/liveWorld.js (the PDF Faith & War
  chapter's army-in-field + trade-pressure lines are stubbed off, awaiting these).
- W4g STOP-AND-REPORTED AdminSimTuningPanel because it needs `armyStrength.js` + `visibilityAudit.js`.

THEIRS files (verbatim targets, but VERIFY inputs — see the critical constraint):
- `src/domain/display/armyStrength.js` (189L) — exports latentStrength, attritionPhrase,
  deployedArmyStatus, deployedArmyStandings, hasDeployedArmy, ARMY.
- `src/domain/display/visibilityAudit.js` (95L) — exports runVisibilityAudit.
- `src/domain/display/tradePressure.js` (204L) — exports saliencePhrase, pairTradePressure,
  settlementTradePressure, hasTradePressure, TRADE.

## THE CRITICAL CONSTRAINT — port-and-ADAPT, do NOT blind-copy
OURS and THEIRS are divergent lineages (memory/third-lineage-mystifying-ride.md). These read-models
read specific `worldState` / army-deployment / trade fields. Before adopting each, VERIFY the exact
input fields it reads EXIST in OUR worldState/army/trade shape (OUR W-C1/W-C2 war cluster produced
OUR army/deployment state; confirm the field names + shapes match). Where a field differs, ADAPT
the read-model to OUR shape. Where a read-model depends on an input OURS does not produce at all,
WIRE what exists and STOP-AND-REPORT the rest — never fabricate a plausible-looking number over
absent data. Add a focused test that each ported read-model returns the correct off-state (empty/
dormant) for a settlement with no army / no trade / no live world, and a real value for one that has.

## Two hard laws
1. **Premium / faith-seam gating (constitutional).** These read-models are PURE and tier-blind, but
   they must ONLY be consumed by ALREADY-GATED surfaces: the W4f PDF Faith & War chapter (premium +
   campaign + faithUnlocked) and the admin diagnostics (isElevated). Do NOT wire them into any
   ungated surface. In particular do NOT adopt THEIRS' `WarFaithSection.jsx` (it leaks live pantheon
   to free/anon — the exact thing W4e's gated WarFaithTab was built to avoid). `runVisibilityAudit`
   is itself a DM/admin tool that verifies free/anon DON'T see gated info — it belongs only in the
   admin panel.
2. **Determinism + goldens.** These are pure display reads — NO Date/Math.random. Un-stubbing the
   army + tradePressure lines in liveWorld.js only affects the PREMIUM campaign PDF path (not the
   golden corpus, which snapshots canon not vm and never renders FaithWar without the premium+
   campaign gate). CONFIRM goldens stay byte-identical after your change.

## Items
1. Port armyStrength.js + tradePressure.js + visibilityAudit.js into src/domain/display/, adapted to
   OUR worldState/army/trade shape (per the critical constraint). Keep them pure + tree-shakeable.
2. Un-stub src/pdf/lib/liveWorld.js: replace `army = null` / `tradePressure = []` with the real
   `deployedArmyStandings(...)` / `settlementTradePressure(...)` reads (guard to the off-state when
   absent — the chapter already degrades gracefully). Preserve the F41 worker-clone contract (pass
   plain cloneable data, never a function — recall W4f's nameById fix).
3. Adopt AdminSimTuningPanel.jsx (read-only diagnostics: balance warnings + the visibility audit)
   over the now-present read-models; mount it in AdminPanel.jsx beside the other W4g panels. Keep
   admin lazy.

## Gates
eslint clean; typecheck + domain-strict; build; verify:dist GREEN (1,440,000; admin + pdf stay
lazy); goldens byte-identical (CONFIRM — the whole point of law 2). Report per-file: which inputs
were present vs adapted vs STOP-AND-REPORTED, the off-state tests, files + line counts, whether the
PDF army/trade lines now render on the premium path, gate results, and confirmation no ungated
surface consumes these.
