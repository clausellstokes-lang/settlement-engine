# F13 CRISIS FACTS — the measure and the cure (2026-11-04)

Lane `lane/rung2-f13-crisis-facts-2026-11-04`, cut from `lane/rung2-2026-11-04` at `d0068d35e`.
Brief: rung 2 §3c (`docs/SOAK_10000_RUNG2_2026-11-04.md`), three record-level contradictions the
chair rules as CONTRADICTION kinds joining the stop rule. A dated lane record; no signed record,
no golden re-recorded.

## 1. The checks (kind 10, "crisis")

`src/domain/coherence/crisisFactFindings.js`, page-only in `coherenceBattery` (the generation
receipt's record battery never runs them, so no receipt moves); `KIND_OF` 10 and `KIND_NAMES[10]
= 'crisis'` (F12 had not pushed; the compose unions by identity).

| check | definition |
|---|---|
| `coh:famine-stores` | food record band `famine` and a printed stores line (`Stores: a granary…`) of ≥ 6 months with no holding words (will not open / withheld / hoard). Per surface. |
| `coh:migration-direction` | a mass_migration crisis and a sentence telling the other direction (`migrationDirectionOf`: entry → catalog → the ruled influx). Per surface. |
| `coh:crisis-cast-sense` | on the composed Tonight sheet: `want_not_role:<role>` (a cast-voiced person's want not from `CAST_WANTS[role]`); `target_runs_plot` (a crisis's target voiced with that crisis's own secret); `plotter_governs` (the instigator is the governing house, or a criminal house holding the seat by `criminalCaptureState` 'capture'; or a page sentence `<governing house> is conducting meetings with people who should not be meeting privately.`). |

## 2. Counts, 1,000 (all rendered), settlements

| check | base `d0068d35e` (+checks) | by tier (thorp/hamlet/village/town/city/metro) | tip `ad47f711c` |
|---|---|---|---|
| famine-stores | 40 | 0/0/0/12/13/15 | 0 (after unit 1 alone: 0, `f3131e917`) |
| migration-direction | 62 | 10/12/7/9/15/9 | 0 |
| crisis-cast-sense | 641 | 72/83/117/127/117/125 | 0 |
| — want_not_role instigator · brunt · lever · defender · exploiter | 250 · 261 · 94 · 85 · 44 | | 0 |
| — target_runs_plot · plotter_governs | 86 · 35 | | 0 |
| A-12 self-vouch (reads kind 10 as a contradiction) | 38 | | 0 |

Every other finding class holds its count at the tip; the verdict line reads **CLIMB**; the 60
sampled settlements carry 0 `coh:*` and 0 `cert:*` findings. Reader side effect (outside the
rule): `reader:tonight-wants` 337 → 128 (cast slots no longer print a goal or a secret).
The §3c seeds re-born through the rendered battery (`soak1k-3605, -0, -4204, -1805, -4200,
-3000, -2404, -3005, -4203`): 0 on all three checks.

## 3. Golden rows (525, hashed the golden suite's way, before/after)

Unit 1: 36 (every famine row; cause: the famine stores). Unit 2: 0 (no mass_migration row).
Unit 3: 0 (the Tonight sheet is composed at render; no row has a captured-house instigator or
the institutional-insurgency vignette). Total 36, one cause.

## 4. The new sentences (the owner's veto point)

- Stores (`foodStoresWords`, when `foodRecord.storesHeld`): "Stores: a granary of {N} that the hall will not open."
- Power vignette, migration, weak economy under an influx: "More families arrived this week, and more the week before. The work they came for is not here, and every household taken in is one more the stores must cover. {Governing house} is being asked to choose between the residents who were here first and the ones still arriving, and has not chosen."
- Faction (weak economy, influx): "Newcomers' Committee" — "Informal group speaking for the newcomers camped at the edges: who sleeps where, who is fed, who is turned away. Its existence is a public statement that the settlement has taken in more people than it can keep."; governing desc suffix "Managing the influx while maintaining the appearance that it is not a crisis."
- Secret (mass_migration slot 4): "Has been quietly buying up the houses the newcomers need, through a third party, and letting them at a price that rises with every arrival" / "The tenants have begun comparing what they pay. The third party's name will not survive the first honest question"
- Power vignette, institutional insurgency: "Meetings are being held between people who should not be meeting privately."
- `CAST_WANTS` (read after "Wants to"): instigator — "keep the pressure on until the seat gives way, and keep their own hand out of sight." · "turn this crisis into the settlement's next arrangement, with themselves at the head of it." · "be the one still standing when the present order runs out of answers."; brunt — "get their own people through this with what little they have left." · "be heard by someone with power before the crisis takes the rest." · "hold on until the worst has passed, and remember who helped."; lever — "decide who gets what the crisis has made scarce, and be thanked rather than blamed for it." · "keep the office the crisis turns on working, whatever it costs them." · "hold the one thing everyone now needs without being crushed between those who want it."; exploiter — "sell what the crisis has made scarce for as long as the crisis lasts." · "come out of this richer than they went in, without anyone tracing how."; defender — "hold the line until the crisis breaks, with fewer hands than the line needs." · "keep the defence standing long enough for someone else to end this."

## 5. Measured with

`node scripts/audit/soak-review.mjs --count 1000 --workers 4` (base in `artifacts/f13-base`; unit 1 and
the tip from worktrees of `f3131e917` and `ad47f711c`). Tests through the mutex only.
