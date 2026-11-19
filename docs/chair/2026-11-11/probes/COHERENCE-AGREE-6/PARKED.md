# Parked items (COHERENCE-AGREE-6), for the hand-back and one message at the end

## P1 — F8 (ii) the hospital cure, and with it the walker widening (third member, atom test, nine plants)
- Cure tried: priorityHelpers.js `hasHospital: home.hasHospital || home.hasHealer` (the home's hospital or healer).
- Differs from the old list: a ruined hospital/monastery/healer/friary no longer counts; "Infirmary", "Monastic
  infirmary", "Major monasteries" now count.
- Field diff a9d2bc1cf -> cure, 4,141 births: 176 births move (12 golden): compound.inst.hasHospital 176,
  defenseProfile.readiness.score 165, publicLegitimacy 20, activeConditions severity 16, 3 NPC re-deals.
- LABELS MOVE (the ruling: stop on a label that moves), all toward safety: readiness Well-Defended -> Fortress 16,
  Defensible -> Well-Defended 3, Undefended -> Vulnerable 1; legitimacy Tolerated -> Approved 2, Approved -> Endorsed 1.
- Recommendation: rule the cure with these moves declared (all toward safety; the home is the ruled one answer), or
  keep the old union's sense as a named home answer (e.g. defenseFacts `hasHospitalOrHealer` over the raw roster) —
  the first is the one-answer cure. The widening (third member) waits on it: the lane's own reader may not be banked.
- Town list: scratch d/KEEP-hospital-parked.births.jsonl.

## P2 — F5 (c) the base roll's pass off its terrain: LEFT OUT (the brief: leave (c) out, say so with the table)
- Built in a scratch tree only (resolveResources.js slots: `admitsAccess(key) && admitsTerrain(key)`, the A′ door).
- Measured over 4,141 births (after (b)): holders 963 (a pass rolled off the mountains), non-holders moved 0, golden
  rows moved 297, no roster shorter, passes off the mountains 963 -> 0.
- Labels over the holders, by direction (safety / danger): readiness 40 / 10; legitimacy 36 / 17; safety ~20 / 2;
  prosperity 9 / 19 (net 10 toward danger, under the one-in-fifty bound ~19); food net toward safety.
- FAILS A′'S PROOF: 11 holders are left with NOTHING LIVE where the roll had something (the pass was their one live
  resource; the replacement takes the slot's depletion draw and arrives depleted): agree-metropolis-33,
  l2-wartime-metropolis-9, rvw12-town-133, rvw12b-city-265, agree-metropolis-18, … (scratch d/KEEP-7c-parked).
- Replacements arriving depleted 238/983 (24.2%) beside the base roll's 30.4% on the same mix.
- Recommendation for the next wave: the refilled member takes the slot's depletion draw only where the refused member
  was itself randomly depletable (a position — pass, crossroads — never is). That re-touches A′'s ruled refill
  (its 24 depleted arrivals), so it is the chair's to rule; measured, it would take the 11 (and (b)'s 3) to 0.

## P3 — F5 (b) the refill reads the terrain: PARKED on a pin (patch: scratch PARKED-7b.patch)
- Built and measured: `resolveResources.js` refill's `admitsTerrain` (RESOURCE_DATA[key].requiresTerrain).
- 269 births move, every one a holder whose refill was a pass off the mountains (0 non-holders, no roster shorter);
  passes off the mountains from the refill 269 -> 0 (the review's 46 of 54 on its own seeds).
- Labels by direction (safety / danger): readiness 15 / 7; prosperity 3 / 3; safety 3 / 2; legitimacy 5 / 2; food 1 / 0.
- Depleted arrivals 94/269 (34.9%) beside the base roll's 35.0% on the same mix.
- 3 holders left with nothing live: rvw12-village-48, rvw12b-metropolis-52, rvw12b-metropolis-123 (see P2's recommendation).
- THE PIN: tests/generators/generationCertificationCorpus.test.js "pins the advisory record_coherence_battery failures
  BY IDENTITY" gains one failing specimen: certification-v1-plagued-martial-city-bracken (a road holder; its refill
  was the pass, now iron_deposits; the re-deal brings "a role-only person (Archmagister)", a battery class outside
  the lane). The pin would GROW by one — the brief's "a pin loosened" — so the item is parked.
- Recommendation: re-key the pin with the cause (the pin's own header records upward re-keys with their causes,
  2026-11-04), or rule (b) together with P2's depletion rule.

## P4 — F5 (d) the structural validator's half: PARKED with P2
- The wizard's half landed (the pass offered on the mountains only; the pool unchanged).
- The validator's warning on a pass off the mountains runs at every birth: with (c) parked, the 963 + 269 passes the
  roll and the refill still place off the mountains would each gain a `resource_access_violation` warning, moving the
  record of every holder (an undeclared family). It lands with (c), when only a forced pass can stand off its terrain.

## P5 — F4 (item 9) the income sources read the chain model: PARKED on its own STOP bounds (patch: scratch PARKED-f4.patch)
- Built as ruled: a new leaf `src/generators/economy/chainIncome.js :: chainIncomeLine` (families by the chain's
  input key: metal = iron, coal, precious; timber = managed forest and the three timbers; stone = the quarry; running =
  running, operational, entrepôt, vulnerable, magically sustained; own resource = input available and live; ore line
  where iron is the own input, coal line where coal alone, else the bought-in line). In `economicState.js` the three
  sources are held in their old places and resolved after Stage 4 (the chains), Stage 3's normalisation moved after
  them; the old gates (resource; local-production and export words) go.
- MEASURED (4,141 births, 97804b535's generator -> the cure): births move 2,019 (golden 350). A source lost in 1,671
  births (Iron & Metalwork 1,269; Stone 393; Timber 208); gained in 321 (Timber 153, Iron 115, Stone 83); the line
  re-read in 100 (coal -> bought-in 94; ore -> bought-in 3; ore -> coal 3). No town is left with NO income source.
  Census (roster-word gate, 720 births): 281 lose; mine is wider (the chain needs its processors running).
- THE STOPS IT HITS:
  - prosperity moves in 54 of the 1,671 births that lose a source (3.2%, over the one-in-fifty bound): Comfortable ->
    Moderate 24, Prosperous -> Comfortable 20, Poor -> Struggling 5, Wealthy -> Prosperous 3, Moderate -> Poor 2;
  - by another path (a source gained or re-read): Struggling -> Poor 1 (toward danger), Moderate -> Comfortable 1;
  - a roster moves: rvw12b-town-264 gains "Harbour master's office";
  - history moves: history.legacyAnnotations re-dealt in 22 (prosperity-keyed pool, e.g. rvw12b-village-52),
    history.founding in 31; no historicalEvents move;
  - also: npcs re-dealt in 21 births, legitimacy in 56, arrival scenes in 370, economicComplexity in 91.
- Recommendation: rule the scope — (i) the census's narrower gate (a roster working word, its measured 281/720 and
  3 prosperity moves), or (ii) the chain gate with these moves declared and the bound raised, or (iii) keep the
  sources and re-word only (TEXT-ONLY, the census's (d) second option).
