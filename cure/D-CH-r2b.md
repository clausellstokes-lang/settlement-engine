# D-CH-r2b — DISPOSITION LOG for `docs/DESIGN_FP_ARCH_CH.md`, P3 round 2b (lane D-CH-r2b, chair a73343ed; two Opus 5.5 seats on 2026-10-18 by `date`: the first 08:32–08:4x EDT, the resumed one 12:10–12:2x EDT)

## OUTCOME (both seats)
All 36 items that reach CH in round 2b are disposed: **15 CURED · 0 REFUTED · 0 STOP · 21 NOTED**, with 6 REFINED brackets (3 per seat).

- **The first seat** disposed 21 items (6 CURED · 15 NOTED) and wrote §F below. It died on the five-hour limit before it returned (BOARD 12:00).
- **The resumed seat** verified the first seat's edits in place and disposed 15 more (9 CURED · 6 NOTED):
  - the chair's ADDENDUM to `briefs/RULINGS-ROUND2b.md`, written ~10:0x after the first seat died;
  - the round-2b body's STOP-PR-0, which the first seat had not taken;
  - four halves that sibling lanes route to CH and that the first seat did not take (`cure/D-RN-r2b.md` §5, `cure/D-PT-r2.md` §5 item 3, `cure/D-PR-r2.md`'s CH row, `cure/D-PS-r2.md`'s PL note).

The volume is 1,053 lines and 321,689 B (sha1 `b4d4e534…`); before this seat it was 1,018 lines, 302,224 B, sha1 `9d68830c…`. This seat's edits are 30 anchored single-occurrence replacements, all or nothing, plus one appended §25 block. The files are in `D-CH-r2b-probe/resume/`: `apply-resume.py`, the pre-edit copy `CH.before-r2b-resume.md`, `volume-resume.diff`, `census-r2b-resume.out`, and the first seat's log as it stood, `D-CH-r2b.first-seat.md`. Git and the test suite were not touched. Master `81f1cd963` was only read.

## R. THE RESUMED SEAT

### R.1 FIRST ACT — the measurements that could refute the dispositions (CONFIRMED unless marked)
- **The first seat's edits are in place, unchanged.** `diff -u D-CH-r2b-probe/CH.before-r2b.md docs/DESIGN_FP_ARCH_CH.md` reproduces `D-CH-r2b-probe/volume.diff` byte for byte (CONFIRMED by execution: `cmp` equal). No other lane touched the volume after 08:41.
- **Code read at `81f1cd963`:**
  - **One hop per leg.** `npcCirculationTransit.js :: nextHopToward` takes `path[1]` of `candidateRoutes(digest, from, dest, 1)`, the routing graph that is "sea-augmented for a trip involving a port". `advanceWanderer` says "arriving ⇒ land at the far end and CLOSE the leg, taking no further hop this tick". `planWanderLeg`'s note says "The arrival is always at least one tick after departure". So a voyage over several lanes lands at every port between, which is why OD-PS-28 reaches CH.
  - **The landed modality read.** `roads/seaRoads.js :: classifyLegModes(digest, path)` returns `Array<'land'|'sea'>`, one entry per hop.
  - **What a telling carries.** `spatial/rumorNetwork.js :: captureContent` copies "ONLY structured fields": `what`, `whereId`, `scope`, `magnitude`, `partyIds`, `causeClass`, `deityName`, and `visibility: 'mechanical'` for a `state_only` seed. `degradeTelling` copies `{ ...record.content, partyIds: [...record.content.partyIds] }`. `RUMOR_TTL_TICKS` is `{ major: 26, notable: 13 }`. The forks are labelled per record (`rng.fork('rumor-organic:' + eventRef + ':' + carrier + ':' + edgeId + ':' + hop)`).
  - **The belief road.** `worldPulse/beliefMap.js :: reportsBySubject` treats a record as a report about S only for S in `content.whereId` ∪ `content.partyIds`.
  - **What is never displayed.** `display/settlementRumors.js` keeps only records whose `content?.visibility !== 'mechanical'`, both in the arrival list and in `hasRumorLedgers`.
  - **Who may see it.** `display/worldSnapshotPublic.js :: WORLD_SNAPSHOT_HARD_DENY` holds `'spatialLedgers'`.
  - **Who may be an actor.** `worldPulse/strategicPosture.js :: POSTURE_ACTOR_KINDS = Object.freeze(['settlement'])`, with the comment "a posture read that quietly treats a temple as a settlement would be wrong in a way no gate could see".
- **The siblings' text, quoted at 12:1x (CONFIRMED by reading):**
  - **RN.** §3.4 `TELLING_SOURCES` lists CH's two rows; each "a pure function of `(worldState, tick)` returning its seeds `{ eventRef, eventTick, originIds, significance, score, content }`", and "each declared field is a persisted rumor-ledger field whose lifecycle row is its OWNER's — CH's"; the fallback is "not needed (PLAUSIBLE until CH-7's car-0 measures …)". §2.3 has `heardAt(worldState, deed, observerSettlementId, tick) → { heard, arm, ver, mag, heardTick }` and R55 (`believedWhereabouts`). §5.1 says the stage "REBINDS the three parameters" (RN's lane executed it: `cure/D-RN-r2b-probe/earlyReturn.out`). The `u:<unitKey>` key row and the `{kind:'corps', id}` doer are in.
  - **PT.** §7.3: "PT's door mints `met_in_person` (doer the party, target the person, `actAt` where they met); CH's paragon stage reads it to set the one-way `marks.metParty` (CH stays that field's writer)". PT has **0** `corps` hits, because PT's round-2b lane died.
  - **PR.** §2.3: `believedWatch(worldState, snapshot, observerId, roadKey, tick) → { watch01, known }`. §10.5: a warden "lifts their quality one step on the stretches it rides — ONE `{ mult, reason }` lean through CH's shared seam leaf". PR5 (a): riders lower only what raiding menaces and untied dens added, "never the walls term and never an enemy column".
  - **PS.** PS2: "a node entered by sea and left by sea is a WAYPOINT AT SEA — sailing past a harbour is not landing at it", classified by `classifyLegModes`. §2.1 keeps the corps key `corps:<unitKey>`. §5.5: "A FREE corps … meets a town through CH's gate (the corps arm of `person_at_the_gate`)".
  - **ST.** §7.3's STOP ST-r2-14 text, accepted by the chair's ADDENDUM.
- **Token census** (`resume/census-r2b-resume.out`, grep over master `src` · `tests` · `docs` and the ledger volumes). `paragon_leak`, `paragon_findings` and `paragonId` have 0 hits everywhere. `employerId` has 0 in src and 2 in the ledger volumes (CH and RN, the same meaning). `rendezvous` has 0 in src and 3 in the ledger docs, all prose. There is no `'leak:` or `'rendezvous:` literal in src. All are FREE.

### R.2 THE RECORD (resumed seat)
| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| ST-r2-14 (ADDENDUM, ACCEPTED) | M | CURED | §0 actor-kinds row, §16b | `POSTURE_ACTOR_KINDS` quote; ST4 "A site has no mind"; the ADDENDUM. The first seat's §0 bracket had copied the fold's `… · menace · site` |
| SEAMS-r2-7 (ADDENDUM: OD-PS-19 STANDS) | M | CURED | §5 patrols (d), §4.4, OD-CH-38, S42 | PR5 (a) "never an enemy column"; PR §10.5's warden lean rides inside PR's leans |
| OD-PS-28 (ADDENDUM) | — | CURED + REFINED | §11 "A waypoint at sea is no arrival", §5 sea, CH-1 car-0, OD-CH-39, S41 | `nextHopToward`/`advanceWanderer` (one hop per leg, landing at its far end); `classifyLegModes`; PS2 |
| STOP-PR-0 (round-2b body) | — | CURED | §5 patrols (d), §4.4, OD-CH-38, S42 | the ruling "a patrol is a WEEKLY-PLACED DETACHMENT … never a WC column"; PR1 |
| D-RN-r2b §5: `TELLING_SOURCES` inputs and declared content | M (routed) | CURED + REFINED | §9 road 1, §8, CH-7 hosts and car-0, waves table, §2.3, §21 L9, OD-CH-40, S6, S7 | RN §3.4 quote; `captureContent`; `reportsBySubject`; `settlementRumors.js`'s `mechanical` filter; the hard-deny; `RUMOR_TTL_TICKS` |
| D-CH-r2 §5.2(a) (closed in RN) | m | CURED | §4.1 | RN §5.1's rebinding; RN's `earlyReturn.out` |
| D-CH-r2 §5.2(c) (closed in RN) | m | CURED | §2.2 `believedWhereabouts`, §7, CH-4 car-0 | RN §2.3 `heardAt(…).heardTick`; R55 |
| D-PT-r2 §5 item 3 | m (routed) | CURED | §16, §21 L3 | PT §7.3's `met_in_person` and `RECORD_MEETING` |
| D-PR-r2's CH row | m (routed) | CURED | §5 patrols (a) | PR §2.3's return; the "opens H16" half was already cured by the first seat |
| HOST-r2-11 (ADDENDUM, ACCEPTED) | M | NOTED | — | CH has no conveyance, territory or re-canonize text (searched); a held site's holder killed by the DM goes to ST's endings (§5 sites (e)) |
| OD-PS-29 (ADDENDUM) | — | NOTED | — | a paragon with an army mirrors the leg the march chose (CH8); CH prices only its own legs |
| PS-r2-14 / OD-PS-21 (ADDENDUM) | — | NOTED | — | CH has no welcome or treaty-road card |
| PS S-e, S-f (ADDENDUM) | — | NOTED | — | PS's own car-0 stop conditions |
| D-RN-r2b §5: `c:` → `u:` | — | NOTED | §16b, CH-10, OD-CH-36 | cured by the first seat; no `c:<unitKey>` survives outside brackets that quote the old text (searched) |
| D-PS-r2: `patrol:`/`corps:` prefixes are PL's row | — | NOTED + REFINED | §11 | PS's crossing prefixes are a different occasion. CH's corps harbouring keeps the registered `polity_ban:` (`polity_ban:corps:<unitKey>:<banTick>`) |

### R.3 STOPS
None.
- Every cure either executes an ADDENDUM row or a round-2b ruling (ST-r2-14, SEAMS-r2-7/OD-PS-19, OD-PS-28, STOP-PR-0), or aligns CH's text with a sibling's cure that names a CH symbol (RN, PT, PR).
- No cure re-rules a chair text.
- No cure needs a kernel line: zero host lines are added, and the `TELLING_SOURCES` rows remove CH's ≤ 3-line fallback.

### R.4 REFINED (each bracketed in the volume, vetoable)
1. **The same-pass next leg at a waypoint at sea** (§11, OD-CH-39).
   - Why: a ship that touches a harbour and sails on costs no rest week, and it never stands in a town it did not enter.
   - If vetoed: it rests a week aboard, which needs a whereabouts state the ledger does not have.
2. **The leak telling carries an empty `whereId`/`partyIds` and `visibility: 'mechanical'`** (§9, OD-CH-40).
   - Why: a secret about a person and a court should move no town's belief slot and appear on no rumour panel. The accusation's one surface stays CH's dossier line in the court's voice.
   - If vetoed: it names the worked-against town, and that town's belief slot refreshes on each arrival. That is a disclosed shift either way (RN §3.4).
3. **The corps' harbouring episode is `polity_ban:corps:<unitKey>:<banTick>`** (§11).
   - Why: the corps arm reads `polity_ban` "as for a person", but the row's episode named only a `wnpc_` id.

### R.5 OTHER FILES' HALVES — routed (this seat wrote none of them)
1. **PT** (its round-2b lane died): the exclusion edge's actor-ref widening still owes its `corps` arm (PT has 0 hits). Until it lands, CH's corps arm carries no ban (§11). PT's `party_gate` road WHERE (STOP-PR-2) also waits on that lane.
2. **The fold (P4):**
   - §3.3.12 ↳ r2 is re-bracketed per ST-r2-14: actor kinds `settlement · person · party · menace` plus `corps` (SEAMS-r2-6), with `site` a WHERE and a subject.
   - §5 rows are needed for `paragon_leak`, `paragon_findings`, `paragonId`, `rendezvous:` and the waypoint at sea, which has one meaning across PS and CH.
   - The first seat's fold notes (§F.5 item 4) stand.
3. **RN:** nothing new. CH now declares what RN asked for. RN §3.4's "PLAUSIBLE until CH-7's car-0" stands until CH-7 builds.
4. **The chair:** the first seat's open items (§F.6) stand.

### R.6 OPEN FOR THE CHAIR
1. REFINED 1, the same-pass waypoint leg.
2. REFINED 2, the leak's empty subject and its `mechanical` visibility.
3. The first seat's three items (§F.6).

### R.7 CONFIRMED vs PLAUSIBLE
**CONFIRMED by execution:** the first seat's diff reproduces.

**CONFIRMED by code read at `81f1cd963`:** every symbol in R.1.

**CONFIRMED by quoting the live sibling volumes:** RN, PT, PR, PS and ST as quoted in R.1.

**PLAUSIBLE, not upgraded:**
- That each `TELLING_SOURCES` row's inputs stand on `worldState` at the rumour stage (RN's own PLAUSIBLE, carried into CH-7's car-0).
- That the declared content fields survive a save round trip (the spread copy was read, not executed).
- That the per-record fork labels keep other records' draws unmoved.
- That the same-pass waypoint leg opens cleanly at its arrival tick (CH-1's car-0).
- The corps' behaviour at sea under WC-10's unbuilt stepper.

## F. THE FIRST SEAT (08:32–08:4x EDT) — its log as written (the volume's §25 "Round 2b — first seat" block)

### F.0 OUTCOME (first seat)
All 21 items that reach CH in round 2b are disposed: **6 CURED · 0 REFUTED · 0 STOP · 15 NOTED**, plus 3 REFINED brackets.

The inputs were:
- `skeptic/SEAMS-r2.md`, whose ROUTES give CH one id (SEAMS-r2-6).
- `skeptic/HOST-r2.md`, whose ROUTES give CH none.
- Every `briefs/RULINGS-ROUND2b.md` item that names CH or reaches CH's text.
- Two notes from sibling round-2b lanes: `cure/D-PL-r2b.md` §5 item 3 (CH still said "opens H16") and `cure/D-MN-r2b.md`'s note on §6.2's prose.
- The round-2 ids whose cures in PR, PS and ST changed a symbol CH cites (SEAMS-r2-8, PR-r2-12, ST-r2-1).

`cure/D-MN-r2.md` and `cure/D-PT-r2.md` route nothing to CH; their "ROUTE to the chair / fold" notes are the fold lane's.

The volume grew from 984 lines (284,489 B, sha1 `827815b4…`) to 1,018 lines (302,224 B). The diff removes 19 lines and adds 51. The pre-round copy is `D-CH-r2b-probe/CH.before-r2b.md`, the diff is `D-CH-r2b-probe/volume.diff`, the edit script is `D-CH-r2b-probe/apply.py` (29 single-occurrence anchored replacements, all-or-nothing) and the receipts are in `D-CH-r2b-probe/receipts.out`. The volume's §25 has a Round 2b block. Git and the test suite were not touched. Master `81f1cd963` was only read.

### F.1 FIRST ACT — the measurements that could refute the round's directions (CONFIRMED by read at `81f1cd963` unless marked)
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

### F.2 THE RECORD
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

### F.3 STOPS
None. Every cure follows a RULINGS-ROUND2b row (SEAMS-r2-6, HOST-r2-5, HOST-r2-1, ST-r2-1) or aligns CH's citation of a symbol that a sibling's round-2b cure changed. SEAMS-r2-1 contradicts a chair text, CHAIR-NOTES item 14, but it is routed to the chair, not to CH. CH re-rules nothing. It only stops citing the contested clause and rests on the landed carriers, which need no ruling either way.

### F.4 REFINED (each bracketed in the volume, vetoable)
1. **The BAND/COIN split for retainer terms (§7, CH10).** A court's terms ceiling reads ST's ONE settlement band `settlementFundingBand`: `unfunded` caps terms at `meagre`, `meagre` at `decent`, `funded` at `handsome`, `lavish` at `princely` (DRAFT, UNMEASURED). The coin stays W-COIN's `retainers` row.
   - Why: round 2 cut `prosperityRank01` a second time for the same quantity, a court's purse. This applies the chair's split for ST-r2-1 and SEAMS-r2-12.
   - If CH lands before ST's leaf, CH's commit lands the pure read in ST's module, with ST as its owner.
   - If vetoed, the terms read `prosperityRank01` directly, as in round 2.
2. **The sea sentence rests on the landed navy alone (§5, OD-CH-37).**
3. **§6.2's wildland prose reads the outcome (`exerted`) and not "exerting".**

### F.5 OTHER FILES' HALVES — routed to the chair and the owning lanes (this lane wrote none of them)
1. **RN (D-RN-r2b).** Add the `u:<unitKey>` row to the key table and `corps` to `doer`, and state the refused-pair exemption (ROUND2b SEAMS-r2-6). RN currently has 0 hits for either.
2. **PT.** The exclusion edge's actor-ref widening gains its `corps` arm. Until then, CH's corps arm cannot carry a ban (stated in §11).
3. **PR.** PR8's "a military unit (an army, a column, a corps) through PS's witness and ladder" should read "a RETAINED corps", because PS §5.5 sends a FREE corps to CH's town's gate. PR's route calls ST's export `fundingBandOfSettlement` (3 hits), but ST names it `settlementFundingBand` (9 hits). One spelling is needed, and ST's is the owner's.
4. **The fold (P4).**
   - The actor-ref convention gains `corps`, and CHAIR-NOTES item 16 gains the `u:` key, the actor kind and PT's arm.
   - The WHERE `road` row gains `person_at_the_gate` (SEAMS-r2-14), noting its corps party.
   - The register gets the `meagre` pair (CH `termsBand` and ST `FUNDING_BANDS`, one sense).
5. **The chair.** SEAMS-r2-1 (CHAIR-NOTES item 14) and SEAMS-r2-3 / HOST-r2-1 (item 13) are still owed before P4. CH no longer depends on either clause.

### F.6 OPEN FOR THE CHAIR
1. **REFINED 1, the terms ceiling from ST's one settlement band.** Veto it and CH reads `prosperityRank01` directly again.
2. **The corps arm keeps the kind name `person_at_the_gate`.** That name is now cited by PR8, PS1 (d), PS §5.5 and the fold. Renaming it (for example to `paragon_at_the_gate`) would ripple through four volumes. I kept the name and registered it. Ruling otherwise is the chair's call.
3. **CHAIR-NOTES item 14.** SEAMS-r2-1's rewrite ("THE SEA IS IN THE BOOKS" on M8 · W-NAVY · seaRoads) is the chair's to make before P4.

### F.7 CONFIRMED vs PLAUSIBLE
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
