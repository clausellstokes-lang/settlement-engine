# CL-0 Implementer Brief — the Simulation Control Layer, aspatial core

Opus 4.8 ultracode implementer, Phase 5.5 wave CL-0, /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; the manager (Fable) reviews + commits. BINDING:
docs/PHASE55_SPATIAL_ENGINE_DESIGN.md §11 (the control layer) + PART VII (the verified seams +
scope rulings — read BOTH in full first). This wave is ASPATIAL: no spatial engine required; it
ships value at every tier.

FENCE: src/domain/worldPulse/simulationRules.js, src/domain/worldPulse/changeAuthorityPolicy.js,
src/domain/worldPulse/candidateEvents.js (gating reads only), src/domain/worldPulse/worldState.js
(the 3 conditional-ledger lines only), src/store/campaignWorldPulseSlice.js
(updateCampaignSimulationRules + advance guards only), src/components/map/SimulationRulesDialog.jsx,
src/components/settlements/LivingWorldGates.jsx (legacy-key cleanup only), the candidate families
that must consult authority policy (tierResourceDynamics.js + the 4 rogue families
changeAuthorityPolicy.js:267 names — authority-consultation edits only). NO git add/commit/stash.

## THE CONSTITUTIONAL LAW OF THIS WAVE (read first)
ABSENT PROFILE = LEGACY BEHAVIOR, BYTE-EXACT, VIRTUAL. A campaign that has never touched the new
controls must (a) carry NO new persisted fields (no write-on-load), and (b) normalize to EXACTLY
today's behavior per flag. Every default you choose must reproduce the current engine output
byte-identically — including the 4 rogue candidate families, whose CURRENT behavior
(escalate-to-proposal on severity, ignoring the global flag) IS the legacy default their per-domain
policy must encode. Goldens + the worldpulse masters must pass untouched. This law outranks every
feature below.

## Items

1. **Profile extension (simulationRules.js).** Add enum fields to DEFAULT_SIMULATION_RULES +
   normalizeSimulationRules: `worldProgression: 'dm_advanced'` ('frozen'|'dm_advanced'; 'living'/
   'autonomous' values ACCEPTED by the normalizer but coerced to 'dm_advanced' until built — fail-closed),
   `politicalAutonomy: 'routine'` ('dm_only'|'recommendations'|'routine'|'full'),
   `spatialMode: 'ignore'`, `travelMode: 'instant'`, `infoMode: 'omniscient'` (each accepting only
   currently-meaningful values; forward values coerce to the safe default). Add per-domain TRI-STATES
   as a derived view: `domainState(rules, domain) → 'off'|'dm'|'auto'` computed from the existing
   booleans + authority policy — do NOT duplicate state; the booleans remain the storage, the
   tri-state is the read model. `profileVersion: 1`. Keep presetIdForRules working (extend its
   structural match to the new fields).

2. **validateSimulationProfile (new, pure, in simulationRules.js).** `(raw) → { canonical, coercions[] }`
   — deterministic, versioned; encodes the §11 dependency-gating matrix (e.g. frozen ⇒ autonomy
   coerces to dm_only presentation-wise but stores as-is per §11 "settings preserved, reactivate on
   resume"; spatialMode 'ignore' ⇒ travelMode limited to 'instant'). Coercions are DATA (consumed by
   item 6's receipts + the dialog's messaging). All engine consumers read only the canonical result
   (pulseKernel already re-normalizes at entry — extend that call).

3. **Per-domain AUTHORITY plumbing.** Introduce a per-domain authority policy in
   changeAuthorityPolicy.js: `authorityFor(rules, domain) → 'proposal'|'auto'` resolving from
   politicalAutonomy + (future) per-domain overrides. Route ALL candidate families through it —
   including the 4 rogue families that today ignore majorChangesRequireProposal (their legacy
   default = their CURRENT severity-escalation behavior, encoded exactly). politicalAutonomy maps:
   'dm_only'/'recommendations' ⇒ force-proposal for ALL candidates (recommendations additionally
   carries the candidate's existing reasons[] as rationale — verify candidates already carry
   reasons; do not invent), 'routine' ⇒ today's exact behavior, 'full' ⇒ all-auto. Keep
   majorChangesRequireProposal as the legacy input the normalizer maps INTO politicalAutonomy
   (true→'routine', false→'full') — do not break old saves.

4. **FROZEN progression guard.** worldProgression==='frozen' ⇒ advance/preview actions no-op at the
   store (same pattern as the existing isAdvanceInFlight guard, slice:205) + the advance UI controls
   render disabled with a plain-language reason. State fully preserved; unfreeze restores everything.

5. **WAR tri-state scope (deferred half).** The war domain row exposes Off/Autonomous ONLY
   (warLayerEnabled as today). DM-Driven for war is DEFERRED to the war initiate/resolve split
   (PART VII.1) — the dialog shows the disabled middle state with honest copy ("arrives with the
   war-layer rework"). Do NOT attempt the evaluateWarLayer split in this wave.

6. **rulesetLog + ruleset_change receipts.** At updateCampaignSimulationRules (slice:219), on any
   effective change: (a) append a `kind:'ruleset_change'` wizardNews entry via the public
   appendWizardNewsEntries (settlement-scope realm entry; headline = plain-language diff, e.g.
   "World law changed: trade now adjusts autonomously"); (b) fold a receipt into a NEW
   conditionally-materialized `worldState.rulesetLog` — an OBJECT keyed `rc_<tick>_<seq>` (PART VII
   ruling; deepCloneConditionalLedger rejects arrays) with { tick, changedKeys, from, to, preset,
   coercions }. Wire via the exact worldState.js 3-line procedure (strip / clone / spread —
   PART VII.1 cites the lines). Absent ⇒ byte-invisible.

7. **Dialog v2 (SimulationRulesDialog.jsx).** Grow the existing structure: presets 3→5
   (SIMULATION_RULE_PRESETS: static_campaign, narrative_campaign, living_realm, full_simulation +
   custom-by-inference; map their §11 definitions onto TODAY'S meaningful fields — spatial/travel/info
   fields included at their locked values so preset identity is stable when those axes light up
   later), the 5 axis-mode cards between the preset grid and the Detail disclosure (World Progression
   + Political Autonomy live; Spatial/Travel/Information rendered but locked to available modes with
   honest fiction-level copy), tri-state domain rows replacing the relevant boolean toggles (war row
   per item 5), dependency-gating hides/disables per validateSimulationProfile coercions.
   FICTION-NOT-INTERNALS copy law is binding: every control describes a world assumption, never a
   mechanism. Preserve the RP-1 focus-trap + mid-advance write guard untouched.

8. **LivingWorldGates.jsx cleanup.** Migrate its direct legacy religionDynamicsEnabled read/write to
   the canonical simulationRules path (the normalizer's lockstep keeps back-compat).

## Gates
eslint + typecheck + domain-strict + build + verify:dist (budget 1,441,000 — dialog stays lazy);
goldens + generator/worldpulse masters BYTE-IDENTICAL (the constitutional law); NEW tests:
(a) legacy-normalization byte-exactness PER FLAG (absent profile ⇒ today's normalized rules object,
deep-equal), (b) the 4 rogue families under legacy defaults produce IDENTICAL candidates/applyMode
to HEAD (pin with a fixture advance), (c) validateSimulationProfile property tests (idempotent,
deterministic, total on garbage input), (d) frozen guard (advance no-ops, state preserved,
unfreeze restores), (e) rulesetLog receipt (emitted on change, absent when untouched, object-keyed),
(f) preset stability (presetIdForRules still back-derives all 5 + custom). Report per-item status,
the exact legacy-default mapping table you encoded (flag → tri-state/mode), any seam that forced a
STOP-AND-REPORT, files + line counts, and every gate result.
