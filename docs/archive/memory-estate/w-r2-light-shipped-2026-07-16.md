---
name: ""
metadata:
  node_type: memory
  title: W-R2-LIGHT shipped — the nine engine-wave gates lit in the three world-alive presets
  date: 2026-07-16
  tags:
    - w-r2-light
    - preset-lighting
    - simulation-rules
    - engine-waves
    - virtual-flags
    - dialog
    - realm-manifest
    - first-paint-budget
    - golden-shift
    - comprehensive-review-r2
  status: RATIFIED + MERGED (fast-forward) into the working lineage claude/w7-prep @ db07979b, 2026-07-16 — parked-red rationale evaporated (shift set EMPTY); still NOT pushed (holds to THE VERY END)
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
---

# W-R2-LIGHT shipped — the lighting wave

The owner lighting ruling (COMPREHENSIVE_REVIEW_PROGRAM.md, 2026-07-16, "feel free to preset
lighting"): `dramatic_campaign`, `living_realm`, `full_simulation` each gain ALL NINE post-close
engine-wave gates — momentum/naval/intervention/settlementLifecycle/peaceEngine/supplyWebWarfare/
upswingArcs/resourceDynamics/constructiveFlows. quiet_local / static_campaign / narrative_campaign /
realistic_regional UNCHANGED. Resolves finding sim-cohesion-counterparts-4.

## What shipped (4 commits, claude/w-r2-light off b1e6aa24, tip db07979b)
- `0b28f032` (1/4): the nine flags lit via a shared frozen `WAVES` object (QUIET/OPEN dedupe idiom)
  spread into the three presets in `src/domain/worldPulse/simulationRules.js`; stability pin +
  moverComposition coverage assertion.
- `84af8c3a` (2/4): the dialog `EngineWaves` section (new component in `SimulationRulesAxes.jsx`,
  wired into `SimulationRulesDialog.jsx`) — nine toggles, fiction-register one-liners, war-coupled
  waves lock until War is lit; + dialog test coverage.
- `f3169cab` (3/4): dark-gate refusal prose in `realmManifest.js` (+ the module-owned
  `casus/peace/webwar_gate_dark` in warReasons/peaceReasons/supplyWebWarfare) now names the preset +
  the `Simulation rules → Engine waves` path instead of a raw flag.
- `db07979b` (4/4): `docs/review-r2/LIGHT_SHIFT_MAP.md`.

## Why it matters / how to apply
- **The nine are VIRTUAL flags** — ABSENT from `DEFAULT_SIMULATION_RULES` (the `disastersEnabled`
  precedent). So they are NOT `RULE_COMPARISON_KEYS`: existing campaigns stay byte-identical
  (`normalize({})` carries none) and preset IDENTITY is unchanged (a legacy save missing them still
  infers its preset). If you add a 10th wave flag, follow this exact pattern (add to `WAVES`, never
  to `DEFAULT_SIMULATION_RULES`, and extend the stability pin).
- **KEY FINDING — the golden-shift set is EMPTY.** The brief anticipated "worldpulse goldens riding
  lit presets" would park red. The TREE refutes it: EVERY committed golden driver
  (worldpulse{Deity,Spatial,Seasons}, all seven `*DormancyGolden`, seaLanes, generator, PDF) builds
  its `simulationRules` as an explicit hand-written object, NEVER `SIMULATION_RULE_PRESETS.*.rules`.
  So lighting the presets shifts NO golden file. No regen was performed. (Verified: golden + soak
  suite all byte-identical green.) Lesson: goldens here are hermetic to preset changes by design —
  do not assume a preset change moves them; check the driver's rules object.
- **Eager delta is +252 B, NOT zero.** The brief said "simulationRules.js rides the lazy engine
  chunk — zero eager delta." Wrong: the preset catalog IS in the eager first-paint closure via
  `campaignWorldPulseSlice` (eager) → `normalizeSimulationRules` → `presetIdForRules` →
  `SIMULATION_RULE_PRESETS`. Closure 1,063,344 → 1,063,596 (budget 1,066,400; margin now 2,804 B).
  The shared `WAVES` object (vs. 27 explicit lines) held the delta to +252 B. Any future preset-flag
  add lands in the eager closure — measure it.
- **JUDGMENT (vetoable):** living_realm lights the nine wave flags but leaves `warLayerEnabled`
  inherited-false, so the three warLayer-AND-gated waves (intervention/peaceEngine/supplyWebWarfare)
  stay dormant there — a "living realm" moves but does not start wars on its own.

## Gate + hazards
- Full `npm run check`: Tests 1 failed | 11,604 passed | 11 skipped — the single red is the known
  owner-gated `operationRegistry` EXEMPT_CEILING 69>66 (pre-existing, orthogonal to this diff).
  `npm run verify:dist` 143/143.
- ⚠️ A FOREIGN stash was present the whole session: `stash@{0}: On analytics-intelligence-layer:
  generation-tuning fixes` — another session's WIP. Left untouched; NEVER pop it (the agent-stash
  incident). lint-staged's own internal stash is separate and self-cleaning.
- MERGED: manager ratified all 4 judgment calls + fast-forwarded claude/w7-prep to db07979b (2026-07-16). NOT pushed — push holds to THE VERY END per owner ruling. Consequence: THE ONE REGEN batch loses its LIGHT component (now G2+Underways+tuning+D7 only).
