# W-R2-LIGHT — PREDICTED GOLDEN SHIFT MAP

**Wave:** W-R2-LIGHT (the lighting wave). **Branch:** `claude/w-r2-light` (off `b1e6aa24`).
**Ruling:** the owner lighting ruling (COMPREHENSIVE_REVIEW_PROGRAM.md, 2026-07-16) — the three
world-alive presets (`dramatic_campaign`, `living_realm`, `full_simulation`) each gain the nine
engine-wave gates: `momentumEnabled`, `navalEnabled`, `interventionEnabled`,
`settlementLifecycleEnabled`, `peaceEngineEnabled`, `supplyWebWarfareEnabled`, `upswingArcsEnabled`,
`resourceDynamicsEnabled`, `constructiveFlowsEnabled`.

## THE GOLDEN LAW FOR THIS WAVE

Golden-shifting BY DESIGN for preset-dependent fixtures — the branch was to PARK RED on the
enumerated preset-golden fixtures (the TRACK-G2 pattern), with this map predicting each; the regen
executes later at the owner-signed moment. **Dark-config goldens must remain byte-identical — any
red outside this map is a bug in this wave.**

## HEADLINE RESULT — THE GOLDEN-SHIFT SET IS EMPTY (tree wins over the brief's anticipation)

The brief anticipated shifts in "worldpulse goldens riding lit presets" + "preset identity
snapshots." **Empirically, NO committed golden-FILE fixture rides the preset catalog.** Every
golden driver constructs its `simulationRules` as an explicit, minimal, hand-written object — never
`SIMULATION_RULE_PRESETS.<preset>.rules`. The nine flags are also VIRTUAL (absent from
`DEFAULT_SIMULATION_RULES`), so they are NOT `RULE_COMPARISON_KEYS` and cannot move any
preset-identity inference. Therefore this wave parks **zero** red golden fixtures; the full gate is
green except the two known owner-gated reds. This is confirmed by running the golden suite (see
"Verification" below).

The evidence, per candidate:

### A. Golden-FILE comparison drivers — DO NOT ride the presets (byte-identical, verified green)

| Golden fixture | Driver test | Rules it drives | Shift? |
|---|---|---|---|
| `worldpulse-golden-master.json` | `worldpulseDeityGolden.test.js` | `{ religionDynamicsEnabled: true }` | none |
| `worldpulse-spatial-golden.json` | `worldpulseSpatialGolden.test.js` | `{ religionDynamicsEnabled, warLayerEnabled, propagationMode }` | none |
| `worldpulse-seasons-golden.json` | `worldpulseSeasonsGolden.test.js` | `{ seasonsEnabled: true }` | none |
| `*-dormancy-golden.json` (momentum, intervention, upswing, resource-dynamics, supply-web-warfare, settlement-lifecycle, peace-causal) | the matching `*DormancyGolden.test.js` | flag-OFF dark configs | none (dormant path; flags absent) |
| `sea-lanes-golden.json` | `seaLanesGolden.test.js` | explicit naval fixture (flag set in-test) | none |
| `generator-golden-master.json` | `generation.test.js` | no `simulationRules` (generation ≠ tick engine) | none |
| PDF `goldenViewModel.test.js.snap` | `goldenViewModel.test.js` | no preset dependency | none |

Because the nine wave gates read `=== true` and the dormancy configs carry none of them, the
dormancy goldens exercise the exact same dormant no-op path as before → byte-identical.

### B. Tests that DO consume the literal lit-preset rules — all stay green (no golden-file compare)

| Test | How it uses the preset | Outcome |
|---|---|---|
| `moverCompositionSmoke.test.js` | drives `full_simulation.rules` verbatim, 24 ticks | ENVELOPE (alive / bounded / deterministic), NOT a golden → stays green; the nine now-active movers stay bounded (verified). A coverage assertion was ADDED pinning that the preset carries all nine. |
| `simulationRulesPreset.stability.test.js` | structural round-trip + war-flag pin | green; a NEW W-R2-LIGHT pin was ADDED (nine flags virtual + lit in the three, dark in the other four, identity preserved). |
| `simulationProfileLegacyNormalize.test.js` | `normalize(preset.rules)` round-trip + accepted-drift | green (nine flags aren't comparison keys; the accepted dramatic_campaign drift already covers the war-flag mismatch). |
| `worldPulseExpansion.test.js` | `normalize(dramatic_campaign.rules)` identity + custom-after-edit | green. |
| `infoModeUnlock.test.js` / `simulationProfileValidate.test.js` | read specific fields (infoMode / seasons domainState) | green. |
| `spatialUsage.test.js` | hand-written rules (not the preset) | green. |
| `cacophonySoak.test.js` (the "checkpoint soak") | `narrativeTempo: 'full_simulation'` — a TEMPO-BUDGET key, NOT the preset rules | green — does NOT ride the nine flags. |

### C. "Checkpoint-soak / composition coverage" (brief item 4)

- `moverCompositionSmoke.test.js` drives `SIMULATION_RULE_PRESETS.full_simulation.rules` verbatim,
  so it now covers the full nine-wave stack automatically. A coverage assertion was added so a
  future edit that drops a wave flag fails loud instead of silently un-covering a layer.
- `scripts/audit/whole-world-soak.mjs` spreads the literal `full_simulation.rules`, so it too now
  drives the full stack (ungated manual harness — the successor's soak consumes it).
- `cacophonySoak.test.js` is NOT a full-stack cover: it keys on `narrativeTempo`, not preset rules
  (documented above so a future reader does not mistake it for one). Left unchanged.

## Preset-identity / byte-stability (verified, NO drift beyond the pre-existing accepted class)

- Existing campaigns are byte-identical: `normalize({})` carries none of the nine keys (they are
  absent from `DEFAULT_SIMULATION_RULES`) — `simulationProfileLegacyNormalize` green.
- Preset IDENTITY is unchanged: the nine flags are not comparison keys, so a legacy save missing
  them still infers its preset. The ONLY accepted display-only drift is the pre-existing
  `dramatic_campaign` one (a pre-CL0 light-shape save re-infers `custom` because war/faith/seasons
  ARE comparison keys) — unchanged by this wave, still covered by its existing pin.

## Verification

- Golden + soak suite run post-change: `worldpulse{Deity,Spatial,Seasons}Golden`, all seven
  `*DormancyGolden`, `seaLanesGolden`, `cacophonySoak` → all green (byte-identical).
- Eager first-paint closure: `1,063,344 → 1,063,596 = +252 B` (the preset catalog rides the eager
  store slice; the dialog + manifest changes are lazy). Margin to the 1,066,400 budget: 2,804 B.
- Full gate (`npm run check`): `Tests 1 failed | 11,604 passed | 11 skipped`. The single failure is
  the one known owner-gated red — `operationRegistry.walker` EXEMPT_CEILING `69 > 66` (orthogonal to
  this diff, which touches no operations/exempts) — and NO preset-golden shift. No golden regen is
  performed by this wave.
- `npm run verify:dist`: `143 passed (143)` — every dist contract green, including the first-paint
  closure budget (`1,063,596 ≤ 1,066,400`).
