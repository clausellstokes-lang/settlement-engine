# R6: the place, not the tier (lane report, 2026-11-04)

> A dated archival record. Branch `lane/rung1-place-not-tier-2026-11-04`, cut from the window tip `fb0341b93` (`lane/window-rung1-2026-11-04` at origin; the brief named `90dc22f18`, two commits earlier: the rung 1 soak record and the x46-1b compose). The brief is the chair's R6 dispatch (`docs/SOAK_1000_RUNG1_2026-11-04.md` §2 rows 3, 10 and 17; `docs/SOAK_1000_2026-11-03.md` §4b R6).

## 1. The outcome

| unit | commit | outcome |
|---|---|---|
| 1. the soldiers line, Guard Captain and "The garrison" read `defenseFactsOf` | `9ac0c24` | landed, red-first |
| 2. a small place seats no guild power without a market | `e9945b6` | landed, red-first; 1 case remains by the rule |
| 3. the hamlet seat title is never "Lord Mayor" | none | **STOP**: already 0 at the base |
| 4. the Lord Mayor driver | measurement | driver found on the pre-law path |
| 5. the military slider inside every tier's band | none | **STOP**: the mechanism premise is refuted |

## 2. The 1,000 corpus, before and after

Command: `node scripts/audit/soak-review.mjs --count 1000 --workers 4 --out artifacts/pnt1000[-before]`. The before run is at `fb0341b` and the after run at the lane tip. Both have 0 errors.

| figure | before | after |
|---|---|---|
| kind 4 `coh:defense-words` (settlements) | 583 | **532** |
| …the military government line | 140 | **0** |
| …a Guard Captain term finding | (in 46 mixed lines) | **0** |
| …"The garrison" as a tension party | 14 | **0** |
| …Garrison Commander with no garrison (not in the brief) | 28 | 28 |
| `A-14:guild-power-small` (thorp/hamlet) | 5 | **1** (`soak1k-313`) |
| `A-14:lord-mayor-small` | 0 | 0 |
| A-05 "X exists but lacks access" lines (informational) | 977 | 977 |
| chain C6a, military slider → garrison (η) | 0.031 | 0.031 |

The rest of the 532 are writers outside this brief: hospital words in 162 settlements, walls in 247, and the "Standing Garrison" chain row, whose `processingInstitutions` include the Town watch (`src/data/supplyChainData.js`, chain `garrison`), in 125+. The row label says garrison where only a watch stands. That is an intake item for the next defence-words lane.

## 3. Unit 3: STOP

The premise is refuted at the base. "Lord Mayor" appears in 0 of 1,000 settlements on the rung corpus. On 1,000 hamlets generated under the lit law (Register VII, `birthConfig`) it is 0, and the Manor Household itself stands in 1 of the 1,000. The only writer of the hamlet "Lord Mayor" is `src/generators/factionRoles.js :: ensureFactionStructuralNpcs`, which mints "The Lord Mayor" for a noble seat. Under Register VII that function is switched off by a version gate (ODQ §817-Q1). Its own comment says "every existing world keeps its structural office-holders verbatim". Changing the pre-law path would change how legacy worlds regenerate from their seed. That is a ruling on a version gate, not a repair, so it is left for the chair.

## 4. Unit 4: the driver

This was measured on 1,000 hamlets (corpus indices 1 + 6k). Each was generated from the corpus cell on the pre-law path (the config without the density marker) and again under the lit law. The η figures put the sliders in deciles; V is Cramér's V for the categorical inputs (for a binary outcome η equals V).

| input | pre-law (210 / 1,000 hamlets carry "Lord Mayor") | lit law (0 / 1,000) |
|---|---|---|
| monster threat | **V 0.339** (heartland 31/363, frontier 46/307, plagued 133/330) | 0 |
| military slider | **η 0.269** (terciles 30/340, 68/315, 112/345) | 0 |
| economy slider | η 0.187 (low 69, mid 93, high 48) | 0 |
| criminal / religion / magic sliders | η 0.107 / 0.103 / 0.034 | 0 |
| route / terrain / magic scenario | V 0.105 / 0.055 / 0.022 | 0 |
| culture / content profile | V 0.127 / 0.054 | 0 |
| stress cell | V 0.306 (inflated by single-settlement pair cells) | 0 |

The mechanism, read in code (CONFIRMED by reading):
- `priorityHelpers.js` computes `militaryEffective` as the military slider × the monster-threat multiplier × the stress multiplier.
- That feeds `rulingStructure.js :: generatePowerStructure`'s `noblePower`.
- `noblePower` above 5 seats the Manor Household in a hamlet.
- The pre-law appender then gives that seat "The Lord Mayor": 191 of the 327 hamlets with a Manor Household, against 19 of the 673 without one.

The economy slider works against it through `economyDisplacesNobles`. SOAK-3's 31 → 46 was this dependence seen through two corpus draws of about 167 hamlets each, before Register VII was lit.

Does unit 3 remove the dependence? There is nothing for unit 3 to remove on new worlds: under the lit law the title no longer varies with any input (0 at every level). The dependence survives only on the pre-law path (§3).

## 5. Unit 5: STOP

The brief's mechanism is that `generateDefenseProfile` gates the garrison on tier first. The code refutes it. `src/generators/defenseGenerator.js :: generateDefenseProfile` draws nothing. It reads the roster that `steps/assembleInstitutions.js` rolled, and that roll already applies the slider inside every tier's band: `institutionProbability.js :: getBaseChance` multiplies every defence row by `chance *= priorityMilitary / 50`. The town Barracks goes from 0.00 at slider 0 to 0.60 at slider 100, and the hamlet militia from 0 to 0.30. On 60 towns, garrisons (Barracks) stand in 10 at slider 0 and 25 at slider 100. Eight of the 10 at slider 0 come from the cascade, which does not read the slider.

What the tier fixes is the catalogue (`src/data/institutionalCatalog.js`):
- no garrison and no watch row exists below town;
- the Town watch, the city and metropolis Garrison and the Professional city watch are `required: true`.

Garrison rates by tier on the 1,000 corpus:

| tier | garrison (low / mid / high slider) |
|---|---|
| thorp, hamlet, village | 0 / 0 / 0 (no catalogue row) |
| town | 15/60, 13/48, 14/59 |
| city, metropolis | 100% (required) |

The pooled η is 0.106 on deciles (the chain instrument's C6a reads 0.031). It is unchanged by this lane.

The ruling's own examples need catalogue rows and floors changed:
- "a village may raise a watch" needs a watch row in the village catalogue, that is, a new row;
- "a town with it low may have none" needs the `required` flags lifted.

Neither happens through the existing roll without a new row or a changed floor. The chair rules which of these, if any. The pooled η cannot rise much while the required rows and the empty small-tier rows stand.

## 6. The red suites and predicted rows (no golden re-record, no register refreeze)

**Generator golden master** (`generator-golden-master`, 525 rows): the per-row hash at the base against the lane tip moves **180 rows** (hamlet 72, village 84, town 24). The facets that move:
- relationship narratives: 168;
- power factions: 84 (unit 2);
- NPC roles: 84 (unit 1).

The manifest is already 525/525 off at the base (the window), so this lane's movement rides inside the window's re-record.

**Other suites red at the tip:**
- Identical to the base, by title (`comm` of the failing titles): `espionageDormancyFence` (the driven 360-settlement golden), `pipelinePinnedChoosers` A1/A3/A6, `pipelinePinnedMode` (6), `powerEconomyFreshness` (5), `editCorpusRatchet` (6), `proseWiringCensus` (8), `proseNumerics` (3), `proseEntryContradiction` (2), `worldFactRederive` A7, `hookThemeDraws`, `seatHolder`, `religionLegitimacyFactionKey`, `captureBirthScale`, `riverPortPowerNarrative`, `smallPlaceMarket`, `terrainPoolsSeat`, `economicStructure` (2), and the `defense*` seed pins (5).
- New with unit 2: `tests/domain/mergeLadderHeldKeys.test.js` "A4 · one trial, two declarations…". This is a seed-premise pin in the family whose A2, A3, A5 and A6 are red at the base.

## 7. Declared judgments (vetoable)

1. The soldiers line is gated on what its word needs: a garrison or a hired company, which is the defence-words check's reading of "soldiers". The brief said "garrison, watch or militia".
2. A place with no force gets no Guard Captain (the brief's "or none"). The slot goes to the weighted fill.
3. "The garrison" as a party falls back to `safetyProfile.js`'s `lawRef` words: The watch, The militia, Local enforcement.
4. A small place with no market seats no Thieves' Guild either. The catalogue has no criminal faction with a non-guild name.
5. Intake for the next defence-words lane, not done here:
   - Garrison Commander with no garrison (28 settlements, from the stress and pool rows); it would be one row in `defenseFacts.js :: ROLE_NEEDS`;
   - the "Standing Garrison" chain label where only a watch stands (125+ settlements).

## 8. CONFIRMED vs PLAUSIBLE

**CONFIRMED:** every count above (read from `artifacts/pnt1000-before` and `artifacts/pnt1000`); the red-firsts; the base-versus-tip suite comparison; the 180 golden rows; the η and V tables; the code mechanisms in §4 and §5.

**PLAUSIBLE:** that the stress-cell V (0.306) is mostly small-cell inflation; that A4 is premise drift only.
