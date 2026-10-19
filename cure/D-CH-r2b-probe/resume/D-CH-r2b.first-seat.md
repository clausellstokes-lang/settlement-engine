# D-CH-r2b — DISPOSITION LOG for `docs/DESIGN_FP_ARCH_CH.md`, P3 round 2b (lane D-CH-r2b, chair a73343ed; seat Opus 5.5; 2026-10-18, 08:32–08:4x EDT by `date`)

## OUTCOME
All 21 items that reach CH in round 2b are disposed: **6 CURED · 0 REFUTED · 0 STOP · 15 NOTED**, plus 3 REFINED brackets.

The inputs were:
- `skeptic/SEAMS-r2.md`, whose ROUTES give CH one id (SEAMS-r2-6).
- `skeptic/HOST-r2.md`, whose ROUTES give CH none.
- Every `briefs/RULINGS-ROUND2b.md` item that names CH or reaches CH's text.
- Two notes from sibling round-2b lanes: `cure/D-PL-r2b.md` §5 item 3 (CH still said "opens H16") and `cure/D-MN-r2b.md`'s note on §6.2's prose.
- The round-2 ids whose cures in PR, PS and ST changed a symbol CH cites (SEAMS-r2-8, PR-r2-12, ST-r2-1).

`cure/D-MN-r2.md` and `cure/D-PT-r2.md` route nothing to CH; their "ROUTE to the chair / fold" notes are the fold lane's.

The volume grew from 984 lines (284,489 B, sha1 `827815b4…`) to 1,018 lines (302,224 B). The diff removes 19 lines and adds 51. The pre-round copy is `D-CH-r2b-probe/CH.before-r2b.md`, the diff is `D-CH-r2b-probe/volume.diff`, the edit script is `D-CH-r2b-probe/apply.py` (29 single-occurrence anchored replacements, all-or-nothing) and the receipts are in `D-CH-r2b-probe/receipts.out`. The volume's §25 has a Round 2b block. Git and the test suite were not touched. Master `81f1cd963` was only read.

## 1. FIRST ACT — the measurements that could refute the round's directions (CONFIRMED by read at `81f1cd963` unless marked)
- **Slow, never cut.** `spatial/spatialCost.js :: SLOW_NOT_SEVER_MAX = 6` says winter makes a pass "NEVER infinite/cut — so a snowed-in town is dear to reach yet still RESCUABLE by spring". `SEASON_TERRAIN_COST` says "Every value FINITE and ≥ 1, and ≤ SLOW_NOT_SEVER_MAX". CH had no "closed pass" sentence (searched), so HOST-r2-1 reaches CH only through the climate-band sentence.
- **The climate band is landed.** `spatial/spatialDigest.js :: CLIMATE_BAND_VERSION = 1`. `worldPulse/seasons.js :: climateBandFor` reads "W-CAP CAP-3 — this settlement's frozen climate band". Round 2 had called the band "the fold's one owed host consumer". In fact only its H11 re-version is owed.
- **The navy is landed and lit.**
  - `spatial/armyTransit.js :: ARMY_ROLES` holds `CONVOY: 'convoy', BLOCKADE: 'blockade'`.
  - `spatial/navalLayer.js` says "A navy convoys an own/allied army over water".
  - `worldPulse/navalKernel.js` says a lost convoy's "embarked army SHARES the convoy's fate (… a forced debark …)".
  - `worldPulse/simulationRules.js :: WAVES` sets `navalEnabled: true`.
  - CH's round-2 sentence "A ship is a column's or an army's carriage (CHAIR-NOTES item 14)" echoed the clause that SEAMS-r2-1 refutes.
- **The person leg still drops the season.** `npcCirculationTransit.js :: planWanderLeg` calls `hopWeeks(…, text(fromId), hop.toId)` with no season. CH-1's car stands as written. `hopWeeks(digest, fromId, toId, season = null, mode = null)` and `pathCost(…, season = null)` are unchanged.
- **The `u:` prefix is free in code.** No `'u:'` key literal exists in master `src`. The prefix is RN's design token.
- **The siblings' current text, read at 08:33–08:38 EDT while their lanes were writing.**
  - PS §2.1 and §5.5 put `corps` in `PASSAGE_MOVER_KINDS`. A RETAINED corps is the employer's unit, keyed `corps:<unitKey>`. A FREE corps "meets a town through CH's gate (the corps arm of `person_at_the_gate`), never this ladder". PS gives the RN key as `u:<unitKey>`.
  - PR §2.2 defines THE ONE STRETCH KEY: `road{a, b}`, unordered, keyed `a␟b`, split into halves at the digest gate, with a hop-to-half map. PR also reads `believedWatch(…, roadKey, tick)` and takes cover from `fameIn` at the riders' town (PR-r2-12). PR §13 sends patrol facts out through the window and never through H16.
  - ST §2.4 defines `FUNDING_BANDS = unfunded · meagre · funded · lavish`, the effective band `min(fundingSet, derived)` and `settlementFundingBand`. Its person arm reads "CH's derived purse band … `meagre` meanwhile".
  - MN §5.2 and §5.5 already read `exertion.outcome` through CH's `paragonLean`.
  - RN and PT have 0 `corps` / `u:` hits. Their round-2b lanes own those rows.

## 2. THE RECORD
| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| SEAMS-r2-6 (routed) | M | CURED | §16b, §2.2b, §11 corps arm, CH12, §2.2 `gateDefault`, §18 `person_at_the_gate`, §0 actor-kinds row, §2.3, CH-10, OD-CH-15, OD-CH-36, S40 | ROUND2b SEAMS-r2-6 ruling; PS1 (d), PS §5.5, OD-PS-34 |
| HOST-r2-5 (ruled; reaches CH; D-PL-r2b §5 item 3) | M | CURED | §5 patrols, §19 TIER, S39, OD-CH-38, the round-2 record row (bracketed) | ROUND2b HOST-r2-5; PR14, PR §13 |
| HOST-r2-1 (ruled; reaches CH) | B (chair's text) | CURED | §5 sea and seasons, OD-CH-37 | `SLOW_NOT_SEVER_MAX`; `CLIMATE_BAND_VERSION`; `climateBandFor` |
| ST-r2-1 (ruled; reaches CH) | B (ST's) | CURED | §5 sites (d) | ST §2.4 `FUNDING_BANDS`, `min(fundingSet, derived)` |
| SEAMS-r2-8 (PR's stretch key, cited by CH) | M (PR's) | CURED | §5 patrols (a)/(b), §18 row and scope, S39, OD-CH-38 | PR §2.2 THE ONE STRETCH KEY |
| PR-r2-12 (`fameIn`, cited by CH) | M (PR's) | CURED | §5 patrols (b), S39 | PR §8.1 `cover` |
| SEAMS-r2-1 (navy; the chair's) | B (chair's text) | NOTED, sentence rewritten (REFINED) | §5, OD-CH-37 | `ARMY_ROLES.CONVOY`, `navalLayer.js`, `navalKernel.js`, `navalEnabled: true` |
| SEAMS-r2-5 · D-MN-r2b note | M (MN's) | NOTED, prose aligned (REFINED) | §6.2 wildland | CH §2.2 `paragonLean`; MN §5.2/§5.5 |
| STOP-PR-2 ("CH's words unchanged") | — | NOTED | §18 | CH's road arm already stands |
| SEAMS-r2-2 (ruled) | B (PR's) | NOTED (+ a clarifying clause) | §5 patrols (b) | CH mints no envoy kind; a diplomacy paragon is a person (CH-V1) |
| ROUND2b open question 3 | — | NOTED | — | PR8's paragon row is CH's turn-back; a posted operative is not an ES mission |
| HOST-r2-3 (J385) | B (ST's) | NOTED | — | CH names no gate keeper; `SITE_FIT`'s `crossing` is a weight |
| PS-r2-1 | B (PS's) | NOTED | — | CH reads no tolerance |
| SEAMS-r2-14 | m | NOTED | §18 | fold's WHERE row at P4 |
| SEAMS-r2-16 | m | NOTED | §18 | CH's BENCH default is the text of record |
| SEAMS-r2-10 | M (PR/PS) | NOTED | §11 | CH uses `requestFealtyRow`, prefix `polity_ban:` |
| SEAMS-r2-11 | M (PR's) | NOTED | — | CH reads RN regard of `p:`/`u:` subjects only |
| SEAMS-r2-17 | m | NOTED | §2.3 | `warden` a display noun only |
| D-PL-r2 §5.3 ":500" | — | NOTED | §11 | already cured in round 2 (the hold reads a defiance only through `D̄`) |
| PR8 "a corps → PS's ladder" | — | NOTED, routed | — | PS sends a FREE corps to CH's gate |
| `fundingBandOfSettlement` (PR) vs `settlementFundingBand` (ST) | — | NOTED, routed | — | 3 hits vs 9; ST owns the name |

## 3. STOPS
None. Every cure follows a RULINGS-ROUND2b row (SEAMS-r2-6, HOST-r2-5, HOST-r2-1, ST-r2-1) or aligns CH's citation of a symbol that a sibling's round-2b cure changed. SEAMS-r2-1 contradicts a chair text, CHAIR-NOTES item 14, but it is routed to the chair, not to CH. CH re-rules nothing. It only stops citing the contested clause and rests on the landed carriers, which need no ruling either way.

## 4. REFINED (each bracketed in the volume, vetoable)
1. **The BAND/COIN split for retainer terms (§7, CH10).** A court's terms ceiling reads ST's ONE settlement band `settlementFundingBand`: `unfunded` caps terms at `meagre`, `meagre` at `decent`, `funded` at `handsome`, `lavish` at `princely` (DRAFT, UNMEASURED). The coin stays W-COIN's `retainers` row.
   - Why: round 2 cut `prosperityRank01` a second time for the same quantity, a court's purse. This applies the chair's split for ST-r2-1 and SEAMS-r2-12.
   - If CH lands before ST's leaf, CH's commit lands the pure read in ST's module, with ST as its owner.
   - If vetoed, the terms read `prosperityRank01` directly, as in round 2.
2. **The sea sentence rests on the landed navy alone (§5, OD-CH-37).**
3. **§6.2's wildland prose reads the outcome (`exerted`) and not "exerting".**

## 5. OTHER FILES' HALVES — routed to the chair and the owning lanes (this lane wrote none of them)
1. **RN (D-RN-r2b).** Add the `u:<unitKey>` row to the key table and `corps` to `doer`, and state the refused-pair exemption (ROUND2b SEAMS-r2-6). RN currently has 0 hits for either.
2. **PT.** The exclusion edge's actor-ref widening gains its `corps` arm. Until then, CH's corps arm cannot carry a ban (stated in §11).
3. **PR.** PR8's "a military unit (an army, a column, a corps) through PS's witness and ladder" should read "a RETAINED corps", because PS §5.5 sends a FREE corps to CH's town's gate. PR's route calls ST's export `fundingBandOfSettlement` (3 hits), but ST names it `settlementFundingBand` (9 hits). One spelling is needed, and ST's is the owner's.
4. **The fold (P4).**
   - The actor-ref convention gains `corps`, and CHAIR-NOTES item 16 gains the `u:` key, the actor kind and PT's arm.
   - The WHERE `road` row gains `person_at_the_gate` (SEAMS-r2-14), noting its corps party.
   - The register gets the `meagre` pair (CH `termsBand` and ST `FUNDING_BANDS`, one sense).
5. **The chair.** SEAMS-r2-1 (CHAIR-NOTES item 14) and SEAMS-r2-3 / HOST-r2-1 (item 13) are still owed before P4. CH no longer depends on either clause.

## 6. OPEN FOR THE CHAIR
1. **REFINED 1, the terms ceiling from ST's one settlement band.** Veto it and CH reads `prosperityRank01` directly again.
2. **The corps arm keeps the kind name `person_at_the_gate`.** That name is now cited by PR8, PS1 (d), PS §5.5 and the fold. Renaming it (for example to `paragon_at_the_gate`) would ripple through four volumes. I kept the name and registered it. Ruling otherwise is the chair's call.
3. **CHAIR-NOTES item 14.** SEAMS-r2-1's rewrite ("THE SEA IS IN THE BOOKS" on M8 · W-NAVY · seaRoads) is the chair's to make before P4.

## CONFIRMED vs PLAUSIBLE
**CONFIRMED by code read at `81f1cd963`:**
- `SLOW_NOT_SEVER_MAX` and `SEASON_TERRAIN_COST`.
- `CLIMATE_BAND_VERSION` and `climateBandFor`.
- `ARMY_ROLES.CONVOY`, the `navalLayer.js` convoy line, the `navalKernel.js` shared-fate line and `navalEnabled: true` in `WAVES`.
- `planWanderLeg`'s season-less `hopWeeks` call.
- The absence of a `'u:'` key literal.

**CONFIRMED by quoting the sibling volumes' current text:** PS's corps arm, PR's stretch key, `fameIn` and window, ST's band words and ceiling, and MN's outcome read.

**PLAUSIBLE, not upgraded:**
- That the round-2b lanes of RN and PT will add the `u:` row and the `corps` edge arm.
- The corps arm's behaviour under WC-10's stepper. WC-10 is unbuilt, so a refused company "keeps where it stood" is a design statement, not something executed.
