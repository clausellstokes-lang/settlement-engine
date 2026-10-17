# FINDINGS — WAYFARE (WY) — coherence reader, 2026-10-16 (chair session 2fc13d59)

Read WHOLE: `volumes-master/DESIGN_FP_ARCH_WY.md` (1721 lines, identical to `volumes/` copy — `diff -q` silent). Also read: SPINE §1 (lines 17-110) and §3 (494-552); SP volume V21 row (`DESIGN_FP_ARCH_SP.md:129`); the fold's WY sections (`DESIGN_FP_ARCHITECTURE.md` 684-692, 1096-1106, 1276-1285, 3142, 3186-3213); ES/IN/WAR/WC/CN/MF/EP by grep; the board, FP-ORDER, FP-QUEUE, the 09-23 fold kit; the owner directive memory (`memory/rumor-durability-and-absolute-distance-directive.md`). Code of record: `master-00b648c9d` (abbreviated `M/`). Every claim is a READ unless marked PLAUSIBLE. Measurements saved under the scratchpad `wy-reader/literals-*.txt`.

Line refs `WY:n` = DESIGN_FP_ARCH_WY.md; `ARCH:n` = DESIGN_FP_ARCHITECTURE.md; `SPINE:n` = DESIGN_FP_SPINE.md.

---

## 1. THESIS

Wayfare makes the roads physical and honest: distance is the map's own (absolute km, the week floor), big truths survive the road, every conserved unit (goods, people, faith-mix, army supply) is served by exactly one regime — netted XOR physical — and the map shows movers as PRESENCE only (no direction, no destination), with clicking as reading through one projection per entity kind (WY:105-134).

The DM-felt sentences are in §9 (WY:1684-1696), one per mechanism:
- WY-1 scale: "The far shore is beyond a year's march." (WY:1693) — the ONLY WY-1 sentence; the felt consequences (war duration, fog by distance, WY:298-302) have NO receipt line.
- WY-2 severity durability: **NO §9 sentence.** The only tellable is doctrine prose, "Fog belongs on details, states, and intentions — never on burned cities." (WY:393-395), not a receipt a DM reads.
- WY-3 bodies: "Still on the road, expected by first thaw." (WY:1684); "The grain that never came: Aldmere's caravans stopped three weeks ago." (WY:1688).
- WY-4 cargo: "A column of the Lakefaith marches toward a town of the Flame." (WY:1690).
- WY-5 carried word: "No word has come from Alderford since the thaw." (WY:1691).
- WY-6 prize: "They took the wagons at the ford; the grain feeds the besiegers now." (WY:1689).
- WY-8a supply: "Three weeks of bread in the wagons, and the road home is cut." / "The column ate Aldmere bare, and Aldmere remembers." (WY:1694-1695).
- WY-11 floor/2j: "The road between them was thick with wagons once." (WY:1692).
- 2l: "The garrison costs more than the holding yields." (WY:1696).
- Quantization cadence (WY-3b), the flow-regime contract, the exactly-one walker, the dedup pin, the mirror walker, the encounter walker: **no DM sentence** (instruments).

PLAUSIBLE (judged against the owner's EVIDENCE LAW of 2026-10-02/03 as the memory index records it — "COMPLETE, NOT CRYPTIC — name who, which power, what effect"): "Aldmere remembers" (WY:1695) is a riddle clause (the effect — occupation resistance — is unnamed), and "The road between them was thick with wagons once." (WY:1692) names neither road nor parties. Both would fail the law as written.

---

## 2. STATUS, TRUTHFULLY

Volume header: "A LANDED MEMBER OF THE docs/DESIGN_FP_ARCH_* FAMILY" (WY:3) — the VOLUME landed at the 2026-08-05 fold; every wave is spec. The fold's status table (ARCH:3192-3213, dated 2026-09-23) says every WY wave NOT STARTED — **stale for WY-1** (landed 2026-09-24).

| Wave | Volume's claim | Board / kit | Code at 00b648c9d | Verdict |
|---|---|---|---|---|
| WY-0 lawful canvas | "buildable NOW; the program's first commit" (WY:1321-1322) | no row | chevrons + 180° flips LIVE: `TravelersLayer.jsx:87,126,148`; `chevronPoints` `travelersGeometry.js:84`; no `mapLayerManifest` walker | NOT BUILT (the "first commit" never happened; WY-1 went first) |
| WY-1 scale charter | data-gated by `kmScale`, Lane B creation-flow disclosure + spectrum lint census in-wave (WY:1125-1153) | BUILT `d0c135f20`, picked `bfe4830d0` (board:37-38); FPQ-37 "kmScale is never written, so WY-1's mode table … never lights" (FP-QUEUE:40) | `modeSpeeds.js` present; absolute arm `distanceRead.js:597-627`; carry-forward `campaignSpatialCanonize.js:110`; digest stamp `spatialDigest.js:898,921`. BUT: `creationKmScale` has ZERO src callers (only tests); no caller passes `options.kmScale`; `hopWeeks(...,mode)` 5th arg passed by NO caller; `realmReach` (the spectrum surface, `distanceRead.js:783`) has ZERO consumers; no spectrum-derivation lint census in `tests/lint`; no disclosure copy | LANDED-DARK, PARTIAL — engine half in, Lane B slice + lint census unbuilt; lights in NO world, new or old |
| WY-2 durable truth | flag 45 (WY:1155-1177) | FP-ORDER row 2 lists it; no board row | `severityDurability.js` absent; `severityDurableRumorsEnabled` 0 hits; `degradeTelling` unchanged `rumorNetwork.js:472-490` | NOT STARTED |
| WY-3 mover bodies | flag 46, F1-F3 (WY:1179-1210) | none | shipment record has no `departTick`/`path` (`commodityFlow.js:781-784`); `legDepartTick` 0 hits; `flowRegimeContract.js` absent | NOT STARTED |
| WY-4 cargo + fence | flags 47/48, F4/F5 (WY:1212-1244) | none | `flows.js:57-62` `populationFlows` has no spatial check (C3 violation LIVE); `faithCargo` 0 hits | NOT STARTED |
| WY-5 carried word | flag 49 (WY:1246-1269) | none | `moverTidings.js` absent; `no_word_from`/`lastWordFrom` 0 hits | NOT STARTED |
| WY-6 prize + pairs table | flag 50, F8 (WY:1271-1293) | none | `armyCaravanSeizure.js` absent; `encounterPairs.walker` absent; E15 ROW acknowledged ES-side (`espionageGauntlet.js:6-12`) | NOT STARTED |
| WY-7 projection spine | no flag (WY:1337-1363) | none | `treatyProjection`/`personProjection` 0 hits; `KIND_PREFIX` still module-local `dossier/entityLinks.js:13` | NOT STARTED |
| WY-8a supply train | flag 52, F9 (WY:1369-1403) | none; WC-10 HARD-GATES on it (ARCH:1912) | `armySupply.js` absent; `supplyCargo` 0 hits — but a SCALAR supply substrate is LIVE (see §6 S1) | NOT STARTED |
| WY-8b army mirror | (WY:1404-1433) | none | `armyProjection` 0 hits | NOT STARTED |
| WY-9 clickable canvas | (WY:1435-1451) | none | covert hole LIVE: `viewerSeesDmSecrets({ isOwner: !!auth?.user, … })` at `HeraldWanderers.jsx:142`, `RoadScenePanel.jsx:64`, `HeraldGazetteer.jsx:195` | NOT STARTED |
| WY-10 flow layers | (WY:1453-1463) | none | — | NOT STARTED |
| WY-11 lifeblood envelope | flag 51 (WY:1295-1317) | none | `caravanFloorEnabled` 0 hits | NOT STARTED |

CONFIRMED: of the seven units the chair named (WY-2, -3, -4, -5, -6, -8a, -11), **none landed**; WY-1 is the only WY code in master, and it is inert. The eight WY flags: 0 src hits each. The nine fields F1-F9: 0 src hits each (F6/F7 `experience` exists as a pre-existing martial field, not the WY stamp — not separately verified, PLAUSIBLE).

Signing status (a fold-internal contradiction, §5 C3): F1-F9 are "SIGNED" by J-EM-9 reading the 2026-08-05 blanket grant (`fp-kit…/FP-ARCHITECTURE-FOLD-2026-09-23.md:66`; ARCH:3142), while ARCH:689 still says "F9 `supplyCargo` is UNSIGNED" and ARCH:3192/3211/3212 still say "⛔ OWNER sign-off rows".

---

## 3. LAWS AND OWNER-SETTLED ITEMS (may not be re-narrated)

**No literal owner quotation appears in the WY volume.** Every "owner verbatim intent" line (WY:212, WY:317) is a chair restatement; the directive memory itself labels them "Owner verbatim intent" and carries only three literal quoted strings: "low supply drags exhaustion up" (memory:39, the 2k clause the chair TRANSLATED), "owner-signed when the mode table lands" (memory:71 — the WAR volume's words, not the owner's), "are we set up?" (memory:125). The one owner quotation the WY program rests on for sign-off is J-EM-9's: "I give permission for everything that requires my sign off in the full queue" (ARCH:3142; 2026-08-05).

Laws and rulings (verbatim, line):
- L-1a ABSOLUTE-DISTANCE: "realm distance is ABSOLUTE, derived from the map's declared scale. Tens of miles and thousands of miles are different worlds; settlements price by literal distance; the 2-8 march-week normalization dies for scaled worlds." (WY:212-215)
- Absent scale is forever legacy: "**Absent scale = legacy normalized behavior, byte-identical, forever**" (WY:268-269).
- The flag-home supersession (chair-ruled, vetoable): mode table "DATA-GATED by `spatialDigest.kmScale` (absent = legacy, forever), DECOUPLED from `portOpportunityEnabled`" (WY:238-240).
- Law-M floor binds in every denomination (WY:278-279; seam 6 WY:1594).
- PER-MAP SPECTRUM LAW (WY:283-297) incl. the clamp: "CLAMPING the march at 52 weeks with a receipt (\"the far shore is beyond a year's march\")" (WY:295-297).
- L-1b SEVERITY-DURABILITY: "truth in rumors becomes MORE DURABLE through transit and hopping, scaling with the event's severity, UNLESS deliberately manipulated." (WY:317-319)
- RUNG DERIVATION: "TABLE-MAPPED, NEVER WORD-MAPPED" (WY:371).
- THE REGIME-FLIP HOUSE IDIOM (the quoted block, WY:405-416), incl. "if it is on the map it is REAL, and if it is real it is CONSERVED".
- ZERO new keys: "**ZERO new top-level worldState keys. ZERO new spatialLedgers keys. ZERO new mapState keys.**" (WY:551-552)
- THE ROUTE-POSITION GUARD (WY:704-713).
- THE AMBIGUITY LAW (WY:761-764).
- THE COVERT LAW (WY:782-783).
- THE SINGLE-PROJECTION MIRROR LAW (WY:853-858), incl. "Populations and caravans are map-only BY OWNER EXCEPTION".
- The commander-name boundary: "NEVER: a commander's name (H11, binding)" (WY:974-975); WY:200-202.
- The r3 chair translation (owner one-clause veto surface = WY-8a ledger row): "low supply drags the ARMY'S OWN `accumulatedAttrition` — NEVER the realm's `warExhaustion`" (WY:71-76).
- §7 Q1 BLEND, Q2 DECLARE-ABSENT, Q3 DELETE the deployment arrows, Q4 PortablePopup MODAL, Q5 SHIP CARAVANS ON WY-3 (WY:1602-1663) — chair rulings, each VETOABLE (WY:1600).
- CR-ES-6 the ONE encounter registry, TWO mathematics (WY:1038-1064; ES:2065-2099).
- R-4 (J12, the Edit Mode fold): "rumour weathering (WY-2's per-hop roll, WY-5's mover hop) is NEVER PINNABLE" (`fp-kit…/RULINGS-OVER-THE-DRAFTS.md:5`).
- J-EM-9: F1..F9 + CR-WC-9 SIGNED; "Veto surface: one word on F1..F8 re-parks WY-3/4/6." (fold-kit:66).
- FP-10 ratification at WY-1's pick: "'default scale' = each map's implied scale; the import heal at read time" (board:37) — NOTE this is a ruling that the code does NOT implement as worded (§5 C6).

---

## 4. CROSS-PROGRAM CLAIMS

| # | WY claim (line) | Other side | Verdict |
|---|---|---|---|
| X1 | "the espionage program's covert manipulation (ES amendment I) becomes the law's AGENT" (WY:388-389); seam 7 "the thing ES-I's manipulation bypasses" (WY:1595) | ES carries owner additions **A–H only** (ES:10-11 "owner additions G … and H"; additions A–F at ES:1163, 801, 504, 580, 216, 1198). No "I". ES's double agent is "LEAK-ONLY. No false reporting home … falsified product belongs to info-statecraft disinfo" (ES:1227-1229, J-ES-11). The directive names the agent "Deliberate manipulation (LIE/plants)" (memory:55) = INFO's plant road (`disinformationPlant.js`, `brokerageServicesPlant.js`, lineage `disinfo:` live) | **DISAGREES — "ES amendment I" does not exist (CONFIRMED). The agent is IN's plant road.** Concurs with IN-ES finding 34. |
| X2 | §5b item 8: "the espionage volume's §3 manipulation mechanics cite WY-2's multiplier as the durability floor they bypass" (WY:1548-1550); seam 7 "the plant-site pricing pin lands ES-side and cites WY-2" (WY:1595) | ES: zero hits for `WY-2`, `severity-durab`, `durability floor` | **SILENT** (the queue-fold obligation was never executed on the ES side, and cannot be — ES has no manipulation mechanic) |
| X3 | §5b item 8: IN gains a line naming WY-2 (WY:1547-1548) | IN:471-473 "ROUTED AT THE QUEUE FOLD (WY §5b item 8 …) … **WY-2**" | AGREES |
| X4 | §5b item 9: war volume carries two J-D11(b) pointer sentences (WY:1551-1561) | WAR:929 and WAR:1614 "[AMENDED 2026-08-05 (the Wayfare fold …)]" | AGREES |
| X5 | Seam 6: "WY-1 consumes the transit kernel's documented gradeMultiplier socket" (WY:1594); §1a "The transit kernel (`namedPersonTransit.js`) already exposes the injection point: its `gradeMultiplier`" (WY:220-224) | Code: the absolute arm lives in `distanceRead.calibration` → `absoluteCalibration` (`distanceRead.js:597-627`), not in `namedPersonTransit`'s `gradeMultiplier` (still `1` or grade-derived at `npcCirculationTransit.js:141`, `routeNetworkConsumersTransit.js:147`) | **STALE vs build** (the build chose the better mount — one constant every mover inherits — but the seam row names the wrong socket) |
| X6 | Seam 6 tripwire: "a second speed floor anywhere reds law M's walker" (WY:1594) | Code: FOUR independent floor/cap pairs outside the walker — `distanceRead.js:742` (1..52), `supplyShipments.js:144` (1..52), `armyTransit.js:300` (1..MAX_MARCH_WEEKS 52), `navalLayer.js:267` (1..MAX_CONVOY_WEEKS 52); FPQ-18 (FP-QUEUE:21) assigns the cure to WC-11 | **DISAGREES** (the tripwire claims a guard that does not exist; values agree today, so no behavior drift yet) |
| X7 | SPINE req 9: "Everything that moves obeys the one travel physics (transit kernel, km/week mode table, the week floor)" (SPINE:57-58); SP-7 "the INTERVAL_WEEKS trace assertion + the mode-speed table (J-D11(b)) landed as spine infrastructure ahead of all six" (SPINE:469-470) | WY-1 claims the mode table as ITS wave (WY:1125); SP V21 says "SP-7 is MOSTLY BUILT. Remaining: the mode-speed table (grep `kmPerWeek\|MODE_SPEED` → zero hits — J-D11(b)'s, cross-referenced, NOT SP work)" (SP:129) | **DISAGREES/STALE** — SPINE says SP-7 owns the table, SP and WY say WY owns it; SP's "zero hits" is stale (`MODE_SPEEDS` live). No fold §5 wave id exists for SP-7 (ARCH has only `J-SP-7`, an unrelated ruling at ARCH:2416). |
| X8 | SPINE req 9 "a time-base walker asserts it — the 12-tick-year defect class dies estate-wide" (SPINE:55-57) | No temporal walker in `tests/lint`; `temporalGates.w0.test.js` guards only two mirrors (its header) — see §7 measurement | **DISAGREES** (the walker that would kill the class is unbuilt and unscheduled) |
| X9 | WY never names `INTERVAL_WEEKS` (0 hits in WY) | Req 9 binds "every mechanism declares its clock … denominated against INTERVAL_WEEKS" | **SILENT — WY violates req 9 on its face** (its clocks are hopWeeks-derived or phrased "first thaw", "one caravan per two months", WY:413-414, never declared) |
| X10 | TR: "WY-3 lands BEFORE TR-4 and hands it the caravan body … the FP #26 one-line delta" (WY:1590, 1508-1512) | `DESIGN_FP_ARCH_TR.md`, `DESIGN_FP_TRADE.md`: zero WY mentions. FP-ORDER row 2: "TR-4 (after WY-3)" | **SILENT in TR's volume** (order AGREES; the TR volume never received the one-line delta) |
| X11 | POP: WY-4 after POP-1, columnOf composed by order (WY:1591, 1514) | POP volumes: zero WY mentions. FP-ORDER row 3 "POP-1 · WY-4 · WY-5" | SILENT in POP volume; order AGREES |
| X12 | WF: F4 credit through religionState's writer family, faith-spread flag pair + legacy mirror (WY:1592, 516-524) | WF volumes: zero WY mentions; `occupationFaithPull` live in `religiousContest.js` | SILENT in WF volume; shape precedent CONFIRMED |
| X13 | WC: §4 erratum — E16/E17 land in WC-3/WC-12's own commits (WY:1005-1036) | WC SECTION 8 row 7 (per WY's quote); WC:4758-4770 "SUPPLY IS WY'S: F9 supplyCargo … HARD-GATE on WY-8a's build … carrier = shipments, cargo = F9" | AGREES |
| X14 | WC row 8 premise "`kmScale` returns ZERO hits in `src/`" (WC:6806) | `kmScale` in 4 src files at master | **STALE** (WC's premise; WY-1 landed) |
| X15 | MF: "no `kmScale` and no physical-distance metric exists anywhere in the estate" (MF:190) | as X14 | **STALE** (MF's premise) — and a homonym risk: MF's scale bar wants a TOWN-scale `viewMetersPerUnit`, not the realm digest's `kmScale` |
| X16 | CN C9 "Army-supply one-truth (§94.2i)" — cites live `warArmyRecord.js:69`/`:127 supplyIntegrity` (CN:104) | WY §2a F9 / WY-8a never name `supplyIntegrity` or `foodReserve` (0 hits) | **DISAGREES in substance** — see §6 S1 |
| X17 | E15 row (WY:1082) authored for ES-2's commit | `espionageGauntlet.js:6-12` "THAT ROW WAS ALREADY IN docs/DESIGN_FP_ARCH_WY.md … this commit CONFIRMS it" | AGREES |
| X18 | EP: WY-2 position | EP:3346-3357 erratum: "WY-2 sits BEFORE ES-0" | AGREES (with WY:1500 "immediately before ES-1") |
| X19 | WY-5 going-dark (silence = an event: "No word has come…") (WY:1259-1262) | Roads estate: `SILENCE_CALM_WEEKS: 26, // no news from a region for this long ⇒ ASSUMED calm` (`roads/state.js:254`; `roads/knownWorld.js:17,65`) | **SILENT** — two readings of silence (roads: calm; WY-5: ominous) with no cross-reference (PLAUSIBLE tension, not a contradiction: one is a belief decay, the other a factual tell) |
| X20 | `distancePricedNews` — information pays for distance at `NEWS_SPEED_FACTOR = 0.5` of hopWeeks (`distancePricedNews.js:20,29-34`), and `routeAwareHopDelayTicks` re-prices in-flight rumors by endpoint embattlement (`:65-76`), consumed by beliefMap, believedRazings, brokerageFidelity, settlementRumors | WY: zero mentions of either | **SILENT** — WY-1's absolute arm silently rescales every belief-age surcharge (news inherits `calibration().weeksPerCost`), and the mode table has no courier/news mode while news runs at a half-speed constant outside it. Not in WY's consequence list (WY:298-306) nor its spectrum-law consumer set (WY:289-292). |

---

## 5. INTERNAL CONTRADICTIONS

- **C1 — Q5 is mooted by WY-10's own dependency.** Q5: "ship against M6a non-food shipments the moment WY-3 lands … Waiting for TR-4 buys nothing but a darker map." (WY:1658-1663). But WY-10 (the caravan sub-layer's ONLY wave) "blocks on WY-3 + WY-4" (WY:1453) and Lane B says "WY-10 additionally waits on engine WY-3/WY-4" (WY:1524); WY-4 lands "in PHASE 6 immediately after #42 POP-1" (WY:1514), i.e. AFTER TR-4 (#26, phase 4). As written, caravan markers wait LONGER than TR-4 — the outcome Q5 ruled against. (Also WY-9: caravans "render 'no bodies to draw' until WY-10's bindings", WY:1442-1443.)
- **C2 — the encounter count is struck in one place and live in three.** The erratum strikes "anti-vacuity at fifteen", "this slice mints no sixteenth", and "WY-6's sixteenth-arm plant" (WY:1005-1010) and rules "DERIVE, DON'T RESTATE … the UNTABLED-RESOLVER PLANT" (WY:1027-1033). Still unstruck in the body: WY-6 "Mutants: sixteenth-arm plant (walker reds — the count moved with CR-ES-6)" (WY:1290-1291); WY-8a "§4 stays CLOSED — at FIFTEEN … this slice mints no sixteenth" (WY:1386-1388); seam 7 "anti-vacuity is FIFTEEN … the sixteenth-arm mutant proves the count moved" (WY:1595). Seam 7's clause is not in the erratum's strike list at all.
- **C3 — sign-off state, three spellings (WY + fold).** WY:97-98 "no wave that mints a field builds until its row is signed"; ARCH:689 "F9 `supplyCargo` is UNSIGNED at this fold"; fold-kit:66 / ARCH:3142 J-EM-9 "F1..F9 and CR-WC-9 are SIGNED"; ARCH:3192, 3211, 3212 "⛔ OWNER sign-off rows F4/F5 … F1/F2/F3 … F8". WC:4762 "F9 is owner-SIGNED under the blanket sign-off". A builder reading WY alone stops; one reading J-EM-9 builds.
- **C4 — two mount points for the mode table.** §1a socket: the injection point is `namedPersonTransit`'s `gradeMultiplier` (WY:220-224); §1a.2: "consumed by `hopWeeks` when `kmScale` is present … composed with the existing grade multiplier" (WY:275-279); seam 6: "WY-1 consumes the transit kernel's documented gradeMultiplier socket" (WY:1594). Built: neither socket — the calibration constant (`distanceRead.js:617-627`).
- **C5 — "the house idiom … conserved" vs Q1 BLEND.** WY:414-416 "if it is real it is CONSERVED — a marker is never a lie"; Q1: BLEND "is NOT conservation: the origin loses no faith by sending people away" (WY:1612). The volume DOES disclose the bend (WY:1616-1619) — recorded, so a known tension, not a hidden one.
- **C6 — FP-10's ratification vs the code.** Board:37 "RATIFIED (judgment FP-10): … 'default scale' = each map's implied scale"; code: `DEFAULT_KM_SCALE: 3` "FMG's own default distance scale" (`modeSpeeds.js:66-77`) and `creationKmScale` falls back to `DEFAULT_KM_SCALE` (`:178-181`). The implied scale exists only as a receipt field (`distanceRead.js:618,625`). Either the ruling or the code is wrong; at the implied scale the absolute read equals the legacy read to the bit (`:607-612`), so FP-10's reading would make a "scaled" world indistinguishable from a legacy one.
- **C7 — WY-0 is "the program's first commit in either lane" (WY:1321-1322)** vs the build order that landed WY-1 first (board:29,37) and FP-ARCHITECTURE-FOLD:84 "WY-1 → WY-2 → WY-3". The "first commit" sentence is now history, not order.
- **C8 — §1a.3's dead-band law vs WY-1's spec.** §1a.3 says EVERY distance-derived band "derives from that spectrum or carries an in-file justification" and WY-1 "lands … a shrink-only lint census" (WY:289-294); WY-1 as built has no census (test file `modeSpeedsWy1.test.js` describes A1-A7 only), and `MAX_REINFORCEMENT_WEEKS: 5` (`sovereigntyReach.js:81`), the band §1a.3 names first, is an authored literal with only an "UNSOAKED BAND" note (`:39`). WC carries the debt forward (WC:4932-4935 "Until WY-1 publishes the min/median/max spectrum surface…") — the surface exists (`realmReach`) but nothing reads it.

---

## 6. STALE PREMISES (spot-checked at 00b648c9d; quote the live line)

Load-bearing premises CONFIRMED still true: C1 chevrons (`TravelersLayer.jsx:148` `<polygon points={chevronPoints(…)}`); C2/C4 shipment record `{ institutionId, settlementId, input, sourceId, arrivalTick, carried, starving }` — no `departTick`, no `path` (`commodityFlow.js:781-784`); `MIN_SHIP: 2` (`:121`); C3 `populationFlows` with no spatial gate (`flows.js:57-62`); F3 "NINE sites in TWO modules" — exactly 9 `legArrivalTick` writes in `roadsKernel.js` + `roads/state.js`; SEVERITY_LADDER at `bandFamilies.js:85` (exact); the 30%/12% discrete draws `rumorNetwork.js:486,490`; the `rumor-organic:` fork key `:710`; `hash01` exported `region/contestMath.js:46`; `KIND_PREFIX` module-local `dossier/entityLinks.js:13`; the covert hole (three `isOwner: !!auth?.user` sites); `MAX_MARCH_WEEKS: 52` < `SIEGE_MAX_AGE = 60` (`armyTransit.js:59`, `warSiegeVerdict.js:179`); `seizureTake` in `smuggle.js`; `occupationFaithPull` in `religiousContest.js`; WY in `CHARTERED_VOLUME_PREFIXES` (`couplingRegistry.test.js:119`).

STALE:
- **S1 — ARMY SUPPLY ALREADY EXISTS AS A SCALAR (the highest-stakes stale premise).** WY-8a/F9 mints `supplyCargo` as the army's supply (WY:571, 1369-1403) and never names the live quantity. Live: `supplyIntegrity: clamp01(norm(facets.logistics, 0.5) * qMult)` and `foodReserve: norm(facets.logistics, 0.5)` seeded per deployment (`warArmyRecord.js:127,132`, header `:120-123` "seeded from the model, eroded by attrition, lifted by reinforcement"); eroded per battle `supplyIntegrity: erode(r.supplyIntegrity, 0.5)` (`attrition.js:312`); read as attrition mitigation (`attrition.js:226,229`); LIFTED by reinforcement `supplyIntegrity: lift(r.supplyIntegrity, flow.flowFraction * 0.8)` (`reinforcement.js:213`); carried in transit (`armyTransitKernel.js:316-318,674`); displayed (`armyStrength.js:148` → `CONDITION_BANDS` `:133`, exported via `ARMY_STRENGTH_PHRASES` `:237` — the very "supply-worded CONDITION_BANDS" C-WYF-3 names at WY:1413-1418). Half of 2k (reinforcement replenishes, low supply worsens attrition) is ALREADY BUILT in scalar form. F9 as specced is a SECOND supply truth on the same record; CN C9 calls this "Army-supply one-truth" (CN:104). What is genuinely missing: per-tick/march CONSUMPTION, rest-debits on real host stores, requisition→resistance, and the 2i grounding (debit real origin stores).
- **S2 — `hasMartialRecord` "NOT NEW: the spelling already exists module-local at `opportunism.js:122` … EXPORT-AND-REUSE, never a second spelling" (WY:1409-1412).** Live: an EXPORTED `hasMartialRecord(settlement)` already exists at `martialReadiness.js:256` ("the HONEST PRESENCE read for display surfaces (§805 WAR tab)"), consumed by `WarTab.jsx:49,471`; `opportunism.js:122` keeps a private twin reading `config.faithProfile.martial`. The second spelling already exists; the cure is now "retire the opportunism twin onto martialReadiness's export" (semantic equality PLAUSIBLE, not proven).
- **S3 — `WarFaithTab.jsx` (WY:1119, 1351, 1359, 1424, 1525) does not exist.** The tabs are `components/new/tabs/WarTab.jsx` and `FaithTab.jsx`. The WarFaithSection census is still TWELVE files but with changed membership: 8 src (`LivingWorldTab.jsx`, `liveWorld.js`, `faithPanelModel.js`, `FaithWar.jsx`, `FaithTab.jsx`, `livingWorldSignals.js`, `dossier/entityLinks.js`, `dossierLazyTabs.js`) + 4 tests — `FaithTab.jsx` replaces the named `WarFaithTab`.
- **S4 — `CONDITION_BANDS` "`armyStrength.js:94-98` already exports" (WY:1414).** Live at `:133`, a module-local const exported only inside `ARMY_STRENGTH_PHRASES` (`:237`). (Line drift; the header law "navigate by SYMBOL" covers it, but the "zero external consumers" FREE-rename claim should be re-measured through the phrases export.)
- **S5 — "Grep confirms zero hits for `kmPerWeek|MODE_SPEED|milesPerWeek|scaleKm`" (WY:219-220)** — now `MODE_SPEEDS`/`MODE_SPEED_TUNING` live (`modeSpeeds.js:47-64`). Expected (WY-1 landed); same staleness in SP:129, WC:6806, MF:190.
- **S6 — "the creation flow supplies it on FIRST canonize" (WY:252-253) and "the datum starts flowing only when the creation flow ships it" (WY:1150-1151).** Live: `creationKmScale` "Nothing calls it until the creation flow ships the datum" (`modeSpeeds.js:173-174`) — zero src callers; the only canonize caller (`campaignWorldPulseDeferred.js:177`) forwards `options`, and no src site puts `kmScale` in them. FPQ-37 open. So "large maps regionalize … fog scales with real distance" (WY:298-302) is a promise with no writer.
- **S7 — §1a.2 "Every mover inherits through the one kernel … armies, envoys, wanderers, columns, caravans" (WY:280-281).** True for the foot speed (all read `calibration().weeksPerCost`), FALSE for modes: `hopWeeks(…, mode)` has no 5-argument caller in src, so river/coastal/sea/cart speeds affect nothing; naval convoys keep their own mode factor (`navalLayer.js:77-82`).
- **S8 — `mapSlice.js:328-330` / `:103` (WY:686-690)** — live at `mapSlice.js:382` (`setLayerFilter`) and `:109`; `operationRegistry.js:531` now records `setLayerFilter` as "NOT part of saved campaign mapState" — which contradicts §2c's premise that `travelersFilter` is "persisted per campaign and merged on load" (WY:698-700). PLAUSIBLE contradiction (registry comment read; persistence path not traced).
- **S9 — C5 "two of the four B-track selectors have zero screen consumers" (WY:176-177)** — not re-measured (PLAUSIBLE still true; `armyProjection` absent).
- **S10 — `temporalGates.w0.test.js` header: "INTERVAL_WEEKS … single-sourced in worldState.js"** — the canonical home is now `worldPulse/intervalWeeks.js` (worldState re-exports it, `worldState.js:6,38`). Not WY's text, but the guard WY's clocks would ride.

Later-ruling overturns checked: the frozen kernel — WY "builds NOTHING that reads `pulseKernel.js`" (WY:202-204) holds; but the kernel carries an inline interval table `tickWeeks: { one_week: 1, one_month: 4, one_season: 13, one_year: 52 }[tickInterval]` (`pulseKernel.js:850`, baseline 1580 effective lines per `scripts/.size-baseline.json`) — a shadow clock in the one file nobody may decompose. The coin reversal and the birth door: no WY dependency found (grep, PLAUSIBLE irrelevant).

---

## 7. THE CLOCK AND THE TIER

Every WY mechanism needs SPATIAL CANON (spatialDigest + spatialLedgers): commodityFlow, rumorNetwork, migration columns, armyTransit, roads missions are all spatial-ledger machinery. An ASPATIAL world sees none of Wayfare. WY-1 additionally needs a `kmScale` writer that does not exist, so it is dark in EVERY world (S6).

| Mechanism | Clock | Tier | Felt-drama clock |
|---|---|---|---|
| WY-1 absolute distance | per hop, 1..52 weeks (floor `distanceRead.js:742`) | spatial + kmScale writer (absent) | seasonal-to-yearly on continental maps (war duration, fog) |
| WY-2 severity durability | per relay hop (hopWeeks) | spatial (rumorNetwork) | fast, but invisible — no sentence |
| WY-3 bodies + quantization | dispatch 1..52 weeks; cadence "one caravan per two months" (WY:413-414) | spatial | monthly; "stopped three weeks ago" weekly |
| WY-4 fence + faith cargo | column transit weeks; faith credit at arrival | spatial + faith-spread flags | **yearly** ("next year's religious tension", WY:525-527) |
| WY-5 carried word / going dark | per arrival; silence read | spatial | **seasonal** ("since the thaw") |
| WY-6 prize arm | per tick co-location | spatial + war | fast weekly |
| WY-8a supply | per tick consumption | spatial + war | fast ("condition degrades in weeks", WY:1398) |
| WY-11 floor/density | per region dispatch, envelope at soak | spatial + TR-9 | **yearly** ("thick with wagons once") |
| 2l occupation register | war-side | war | **yearly** |
| Surfaces WY-0/7/9/10 | render | spatial map for 0/9/10; dossier for 7/8b | immediate |

Flag (a DM advances a few weeks between sessions): WY-4's faith tellable, WY-5's going-dark, WY-11's density read, and 2l live at the seasonal/yearly clock.

### THE CHAIR'S MEASUREMENT — do the FP kernels read INTERVAL_WEEKS? NO.

Method: `rg` for the literals 12/13/26/52 in `src/domain/**/*.js` on lines carrying a time word, comments excluded → 176 code lines (`scratchpad/wy-reader/literals-code.txt`), then hand-classified. Genuine `import { … INTERVAL_WEEKS … }`: **11-12 src modules** (`advanceInterval`, `bandedStock`, `faithWitnessSource`, `treatyClock`, `treatyLifecycleVoice`, `vengeanceLicense`, `worldState`, `modeSpeeds`, `livedExperienceFunnel`, `livedExperienceSources`, `ChronicleScrollback.jsx`, + `ageBands` by its own path). Ten more files only MENTION it in comments while using literals ("pinned equal to INTERVAL_WEEKS.one_year", e.g. `wizardNews.js:29,33`, `envoyChanceMeeting.js:239-242`, `cascadeBraid.js:78-79`, `proposalAdmission.js:54,59`). Two files SHADOW it with a same-named local const (`populationDynamics.js:19`, `foodStockpile.js:66` — documented, drift-guarded by `temporalGates.w0.test.js`).

**Class A — twelve-tick values (the 12-tick-year defect class), not read through INTERVAL_WEEKS:**
- `worldPulse/warSiegeVerdict.js:141` `STARVE_FULL_TICKS = 12; // a season of total interdiction fully starves the town` — **value/word mismatch CONFIRMED** (a season is 13).
- `spatial/generosityReactions.js:72` `CREDIT_TERM: 12, // ticks to maturity ("a season or two")` — **mismatch CONFIRMED** (12 < one season).
- PLAUSIBLE relics (unlabeled 12s): `activeConditions.js:63,471` `defaultExpiresAtTicks: 12` (Plague, Reconstruction); `region/propagation.js:303,468` `maxAgeTicks ?? 12`; `worldPulse/stressorDynamics.js:601` `MEMORY_LOOKBACK_TICKS = 12`; `worldPulse/generosityKernel.js:234` `REFUGE_STALE_TICKS: 12`; `worldPulse/upswingKernel.js:133` `FLOUR_COOLDOWN: 12`; `worldPulse/stressorsCore.js:31` `dormant_residual … maxAge: 12`; `worldPulse/espionage/espionageMath.js:210` `PROMOTION_AWAY_CAP_WEEKS: 12`; `worldPulse/treasury.js:208` `COVERAGE_FULL_AT: 12`.
- Declared legacy (exempt by name): `worldPulse/treatyClock.js:6` `LEGACY_TREATY_TICKS_PER_YEAR = 12`.

**Class B — local re-declarations of the interval grid (shadow clocks):** `worldPulse/pulseKernel.js:850` (inline table, frozen kernel); `worldPulse/worldState.js:40-46` (`WEEKS_PER_YEAR`, `WEEKS_PER_SEASON`, `MONTH_END_WEEKS` beside its own INTERVAL_WEEKS import); `traditions/almanac.js:21-22`; `traditions/genesis.js:123`; `display/dossierViewModel.js:324,330,361`; `display/chronicleReadModel.js:100-101`; `display/humanizeEngineTokens.js:21-22`; `display/heraldCausalGrammar.js:334-338`; `display/chronicleGraph.js:160`; `spatial/distanceRead.js:82,87` (`SEASON_WEEKS = 13`, `MAX_HOP_WEEKS = 52`); `spatial/intelActs.js:71` `WEEKS_PER_YEAR: 52`; `worldPulse/factionCompetition.js:453` `YEAR_WEEKS: 52`; `worldPulse/npcLadderContest.js:80,486`; `worldPulse/npcGrowthKernel.js:411` and `worldPulse/upswingKernel.js:378` (`tick / 52` year); `worldPulse/traditionsKernel.js:290-291`; `worldPulse/roadsKernel.js:161-162,242`; `certification/phraseRepetitionEnvelope.js:61`; `townMap/mapDress.js:129`.

**Class C — FP/world kernels with authored 13/26/52 durations as bare literals (right value, underived):** `pactRenewal.js:170` (26) · `pactFormation.js:152` (52) · `houseLedger.js:96-98` (13/26/26) · `routeNetworkDecay.js:106-107` (52/13) · `routeNetworkCharter.js:119-120` (13/52) · `routeNetworkCharterBypass.js:75` (26) · `espionage/espionageGauntlet.js:181` (26) · `espionage/espionageWariness.js:100` (26) · `settlementPolitics.js:138` (26) · `informationStatecraft.js:185` (52) · `npcCredibility.js:91` (52) · `npcGrowthKernel.js:160` (52) · `momentum.js:86` (52) · `reputationRaceConsumer.js:99` (13) · `sovereigntyMarketStage.js:125` (52) · `settlementLifecycleKernel.js:194,209,211,245,252` (52/13/26/13/52) · `resourceDynamicsKernel.js:150,157` (52/52) · `demographicsPlans.js:171` (52) · `npcLadderGoals.js:38` (26) · `narrativeTempo.js:112,126-127` (52/26/13) · `simulationRules.js:1388` (26) · `spatial/pestilence.js:107` (26) · `spatial/rumorNetwork.js:117` `RUMOR_TTL_TICKS = { major: 26, notable: 13 }` · `roads/state.js:254,279-280,295,308` (26/13/26/26/26) · `spatial/intelActs.js:64` (26) · `envoyChanceMeeting.js:240,242` (13/52) · `wizardNews.js:33` (52) · `cascadeBraid.js:79` (13) · `proposalAdmission.js:59` (52) · `certification/behavioralContract.js:176` (52). **Movers: four independent 52-week caps** — `distanceRead.js:87`, `armyTransit.js:59`, `navalLayer.js:82`, `supplyShipments.js:144` (the FPQ-18 class; X6).

Verdict (CONFIRMED by read): requirement 9's "denominated against INTERVAL_WEEKS … the 12-tick-year defect class dies estate-wide" (SPINE:55-57) is NOT true at master. Roughly 12 modules read the canonical leaf; ~60 time constants in ~45 modules are hand-keyed; two carry a twelve where their own comment says a season. The guard that would make it true (SP-7's "INTERVAL_WEEKS trace assertion", SPINE:469) has no wave.

---

## 8. DEPTH VS FELT VALUE

| Mechanism | What a DM sees | Judgment |
|---|---|---|
| WY-0 lawful canvas | markers stop pointing at their destinations | KEEP (cheap, owner-visible, the ambiguity law's whole cost) |
| WY-1 kmScale + mode table | nothing today (no writer) | KEEP the landed leaf; the ONE owed act is FPQ-37's writer + the disclosure copy. CUT-TO-SENTENCE the non-foot modes until a caller exists. DEFER the spectrum lint census into each band's own wave (WC already does, CR-WC-15) |
| WY-2 severity durability | catastrophes arrive intact; small facts drift (no receipt) | FOLD into IN (the directive itself says "Lands in the IN program's rumor mechanics as a one-multiplier amendment", memory:61-62). Keep the law; the closed-outcome table is fine machinery but it is IN's rumor estate, and R-4 makes it unpinnable |
| WY-3 bodies (F1-F3) | caravans can be drawn where they really are | KEEP (prerequisite of every caravan marker and of TR-4) |
| WY-3b quantization cadence | sub-floor needs get a caravan every N ticks | FOLD into TR-4's batch (it is TR's MIN_SHIP law; same file, same lane — efficiency standard rule 1) |
| flowRegimeContract | nothing | CUT-TO-SENTENCE as a walker inside WY-3/TR-4 (no new module needed until a second class is physical) |
| WY-4 fence | refugees stop teleporting in spatial worlds | KEEP (repairs a LIVE law violation, C3) |
| WY-4 faith cargo (BLEND) | "a column of the Lakefaith marches…"; destination mix nudges at arrival | KEEP F5 `causeReceipt` (the popup's "why"); DEFER the faith-credit arm behind WF (yearly felt clock, BLEND is admittedly not conservation) |
| WY-5 carried word | "No word has come from Alderford since the thaw." | KEEP the going-dark read (the one felt line); CUT-TO-SENTENCE the fidelity injection (invisible, unpinnable per R-4) |
| WY-6 prize arm | "They took the wagons at the ford" | KEEP |
| encounter-pairs walker | nothing | KEEP as a test (growth-proof per the erratum) |
| WY-7 projection spine | popup = dossier = PDF | KEEP (retires real debts) — but it sits in the dirtiest files; batch it with WY-8b |
| WY-8a supply train (F9) | supply band; "three weeks of bread" | FOLD into the live `supplyIntegrity`/`foodReserve` scalars (§6 S1): add consumption-by-march and rest-debit to the existing quantity; keep integer `supplyCargo` only if 2i's real-store debit is ruled essential (owner question 1) |
| WY-8b army mirror | one army truth across tab/popup/PDF | KEEP |
| WY-9 clickable canvas | click a marker, read its sentence | KEEP (the DM-felt surface of the whole program) |
| WY-10 flow layers | caravans and columns on the map | KEEP, but split: caravans on WY-3, populations on WY-4 (C1) |
| WY-11 floor + envelope | lively/lean regions at soak | DEFER (after TR-9; soak instrument; yearly clock) |
| 2l both-sided occupation | "The garrison costs more than the holding yields." | CUT-TO-SENTENCE here (already routed war-side, WY:1562-1581) |
| §2d route-position guard | nothing | KEEP as a lint (cheap) |

---

## 9. VOCABULARY (closed ladders / enums WY mints or binds)

- `MODES` `['foot','cart','river','coastal','sea']` (`modeSpeeds.js:42`; WY:275).
- `REACH_BANDS` `['within_a_week','within_a_month','within_a_season','within_a_year','beyond_a_year']` (`modeSpeeds.js:198-204`) — **HOMONYM**: `reachBandOf` also exists module-local in `conquestFeasibility.js:219` (a 0..1 reach → band, different domain).
- `KM_SCALE_REFUSALS` `['not_a_number','not_finite','not_positive','unknown_cost_law']` (`modeSpeeds.js:97-102`); receipt kind `'kmScale_healed_to_absent'` (`:109`).
- `kmScale` — **HOMONYM RISK** with MF's town-map scale bar (`viewMetersPerUnit`, MF:190).
- WY-2 closed outcome table `{perfect | plain-wear | band-drift-up | band-drift-down | name-swap | severe-garble}` (WY:351-352); rung multipliers over SP-A's `SEVERITY_LADDER` (WY:337-340) — **the 'grave' collision** with rumor magnitude `faint/notable/serious/grave` (WY:373-378, `rumorNetwork.js:245`).
- Flow regime `physical | netted | dark` (WY:425-426).
- Four sub-layers `['armies','caravans','persons','populations']` (WY:693) + filter migration `'migrants'→'populations'`, `'envoys'→'persons'` (WY:697-698).
- `SURFACE_EXEMPT` reason class `{map-only, print-only, dm-only, home-absent}` (WY:888-889).
- `UNIT_SOURCES` `['deployments','armyTransit','navalTransit','interventions','defenderSiegeLedger']` (WY:901-902).
- Army role word `march/reinforcement/retreat/convoy/blockade` + `garrison` (WY:947).
- The three exhaustions: "condition" / "the home front" / "march fatigue" (WY:73-76, 966-968).
- ARMY CONDITION ladder (WY-8b M4) — **HOMONYM** with `armyStrength.js:133` `CONDITION_BANDS` (supply-worded, `supplyIntegrity`-derived) — C-WYF-3 names it.
- "supply BAND" (F9 ladder, unnamed) — **HOMONYM RISK** with the live `supplyIntegrity`.
- Location discriminator `{kind:'settlement'|'route_node'}` (WY:707).
- `causeReceipt` — **HOMONYM** acknowledged (WY:505-509: `realmItemReadModel.js`/`SettlementWorkbench.jsx`).
- Encounter pairs E1-E15 (WY:1066-1082) (+E16/E17 WC's).
- Herald kinds `no_word_from` (WY:1261), `caravan_seized` (WY:1282).
- "pin" — **HOMONYM**: a test pin (WY passim) vs an Edit-Mode DM seal ("NEVER PINNABLE", R-4).
- `INTERVAL_WEEKS` — **HOMONYM**: two same-named shadow consts (`populationDynamics.js:19`, `foodStockpile.js:66`).
- `hasMartialRecord` — two spellings (`martialReadiness.js:256` exported; `opportunism.js:122` local).

---

## 10. REFINEMENTS

- `[WY:388-389]` — "the espionage program's covert manipulation (ES amendment I) becomes the law's AGENT" → `[CORRECTED 2026-10-16 (coherence fold) — ES carries owner additions A–H; there is no amendment I, and ES is LEAK-ONLY (J-ES-11, ES:1227-1229). The manipulation agent is INFO's plant road (the `disinfo:` lineage, disinformationPlant / brokerageServicesPlant); the plant-site pricing pin lands IN-side.]` — X1.
- `[WY:1547-1550]` (§5b item 8, second half) — "the espionage volume's §3 manipulation mechanics cite WY-2's multiplier" → `[CORRECTED 2026-10-16 (coherence fold) — re-routed: the citation belongs in DESIGN_FP_ARCH_IN beside IN's plant waves; ES has no manipulation mechanic to amend.]` — X2.
- `[WY:1595]` (seam 7) — "WY-2's durability floor is the thing ES-I's manipulation bypasses … anti-vacuity is FIFTEEN … the sixteenth-arm mutant proves the count moved" → `[CORRECTED 2026-10-16 (coherence fold) — the bypassing agent is IN's plant road (X1); and per the §4 erratum the count is DERIVED, the proof is the untabled-resolver plant — this clause was missed by the erratum's strike list.]` — C2.
- `[WY:1290-1291]` and `[WY:1386-1388]` — "sixteenth-arm plant …" / "at FIFTEEN … mints no sixteenth" → `[CORRECTED 2026-10-16 (coherence fold) — superseded by the §4 erratum (WY:1005-1036): derive the count from the table, prove with the untabled-resolver plant.]` — C2.
- `[WY:1453]` (WY-10) — "blocks on WY-3 + WY-4" → `[CORRECTED 2026-10-16 (coherence fold) — split per Q5: the CARAVAN binding ships on WY-3 (+WY-9); only the POPULATIONS binding waits on WY-4. As written the caravan layer waited past TR-4, the outcome Q5 ruled against.]` (and the same at WY:1524) — C1.
- `[WY:97-98]` — "no wave that mints a field builds until its row is signed" → `[CORRECTED 2026-10-16 (coherence fold) — F1..F9 are SIGNED by J-EM-9's reading of the 2026-08-05 blanket grant (fold-kit:66; ARCH:3142); one owner word on F1..F8 re-parks WY-3/4/6. ARCH:689 and the ⛔ rows at ARCH:3192/3211/3212 are superseded.]` — C3.
- `[WY:220-224]`, `[WY:1594]` — "the transit kernel (`namedPersonTransit.js`) … `gradeMultiplier` … WY-1 consumes the … socket" → `[CORRECTED 2026-10-16 (coherence fold) — as built (d0c135f20) the absolute arm is the calibration constant (`distanceRead.calibration` → `absoluteCalibration`), which every mover inherits; the gradeMultiplier socket is untouched.]` — C4/X5.
- `[WY:1594]` (seam 6 tripwire) — "a second speed floor anywhere reds law M's walker" → `[CORRECTED 2026-10-16 (coherence fold) — false at 00b648c9d: four floor/cap pairs live outside the walker (distanceRead:742, supplyShipments:144, armyTransit:300, navalLayer:267); FPQ-18 routes the guard to WC-11's counts-mover manifest.]` — X6.
- `[WY:252-253]`, `[WY:1150-1151]` — "the creation flow supplies it on FIRST canonize" → `[CORRECTED 2026-10-16 (coherence fold) — no src caller supplies kmScale (creationKmScale has zero callers; FPQ-37 OPEN): WY-1 is dark in every world until the creation-flow slice ships.]` — S6.
- `[WY:280-281]` — "Every mover inherits through the one kernel" → `[CORRECTED 2026-10-16 (coherence fold) — the FOOT speed is inherited by all; the other four modes are read by no caller (no 5-argument hopWeeks call), and news rides distancePricedNews's own NEWS_SPEED_FACTOR 0.5 outside the table.]` — S7/X20.
- `[WY:298-306]` (§1a.4 consequences) — add → `[ADDED 2026-10-16 (coherence fold) — under kmScale, distancePricedNews.hopDelayTicks and routeAwareHopDelayTicks (beliefMap, believedRazings, brokerageFidelity, settlementRumors) rescale with the absolute arm: belief staleness becomes distance-true. Name it in the disclosure.]` — X20.
- `[WY:1409-1412]` — "spelling already exists module-local at `opportunism.js:122` … EXPORT-AND-REUSE" → `[CORRECTED 2026-10-16 (coherence fold) — an exported hasMartialRecord already lives at martialReadiness.js:256 (WarTab consumes it); the cure is retiring opportunism's private twin onto it.]` — S2.
- `[WY:1119, 1351, 1359, 1424, 1525]` — "WarFaithTab" → `[CORRECTED 2026-10-16 (coherence fold) — the tab files are WarTab.jsx / FaithTab.jsx; FaithTab.jsx is in the twelve-file WarFaithSection census.]` — S3.
- `[WY:571]` (F9) / `[WY:1369-1403]` (WY-8a) — add beside → `[ADDED 2026-10-16 (coherence fold) — a scalar army supply is LIVE: supplyIntegrity + foodReserve seeded (warArmyRecord:127,132), eroded (attrition:312), lifted by reinforcement (reinforcement:213), mitigating attrition (attrition:226-229). WY-8a must GROW that quantity or rule F9's relation to it; two supply truths on one record breaks the army-supply one-truth (CN C9).]` — S1.
- `[WY:283-294]` (§1a.3) — "WY-1 lands the spectrum surface plus a shrink-only lint census" → `[CORRECTED 2026-10-16 (coherence fold) — the surface landed as `realmReach` (distanceRead:783) with zero consumers; the census did not land; MAX_REINFORCEMENT_WEEKS 5 (sovereigntyReach:81) is still an authored literal.]` — C8.
- `[WY:1321-1322]` — "the program's first commit in either lane" → `[CORRECTED 2026-10-16 (coherence fold) — history: WY-1 landed first (d0c135f20, 2026-09-24); WY-0 remains buildable and unbuilt.]` — C7.
- `[SPINE:469-470]` — "the INTERVAL_WEEKS trace assertion + the mode-speed table (J-D11(b)) landed as spine infrastructure" → `[CORRECTED 2026-10-16 (coherence fold) — the mode table is WY-1's (landed, dark); the INTERVAL_WEEKS trace assertion is UNBUILT and has no wave; at 00b648c9d ~12 modules read INTERVAL_WEEKS and ~45 hand-key their clocks (findings/WY.md §7).]` — X7/X8.
- `[SP:129]` (V21) — "SP-7 is MOSTLY BUILT … MODE_SPEED → zero hits" → `[CORRECTED 2026-10-16 (coherence fold) — MODE_SPEEDS is live (modeSpeeds.js); "mostly built" covers only two guarded mirrors, not the estate-wide time-base walker req 9 names.]`.
- `[WC:6806]`, `[MF:190]` — "kmScale … zero hits" → `[CORRECTED 2026-10-16 (coherence fold) — kmScale is live in spatialDigest/distanceRead/modeSpeeds/campaignSpatialCanonize (WY-1), never written (FPQ-37).]`.
- `[ARCH:3209]` — "WY-1 | NOT STARTED" → `[CORRECTED 2026-10-16 (coherence fold) — LANDED-DARK at d0c135f20 (picked bfe4830d0); the Lane B creation-flow slice and the spectrum census remain.]`.
- `[WY:1693-1695]` (§9) — add → `[ADDED 2026-10-16 (coherence fold) — WY-2 owes a §9 receipt line; "Aldmere remembers" and "thick with wagons once" are re-written to name who/which power/what effect under the 2026-10-02 evidence law.]` (PLAUSIBLE that the law binds §9 drafts).

---

## 11. OPEN QUESTIONS FOR THE OWNER

1. **One army-supply truth (persisted shape).** F9 `supplyCargo` (signed) vs the live `supplyIntegrity`/`foodReserve` scalars. Grow the scalars with march consumption and rest-debits, or keep F9 as the integer stock-in-transit and define the scalar as its derived band? (Either way the current spec mints a second truth.)
2. **The kmScale writer (FPQ-37) and the two DRAFT tuning rows.** Shipping the creation-flow slice lights absolute distance for NEW worlds only; `MODE_SPEEDS` (foot 150 … sea 900 km/week) and `DEFAULT_KM_SCALE 3` are unsigned DRAFT rows — and FP-10's "'default scale' = each map's implied scale" contradicts the code's FMG default (C6). Which default does the owner sign?
3. **Re-sequencing WY-10 (Q5)** so caravan markers ship on WY-3 rather than after WY-4/POP-1 (phase 6).
4. **Golden shifts from the 12-tick cures**: `STARVE_FULL_TICKS 12→13` and `CREDIT_TERM 12→13` (and any Class A relic fixed) move same-seed outputs; the owner signs each.
5. **A wave for the temporal walker** (req 9's "time-base walker"): it has no slot; it would convert ~60 constants or carry ~45 modules' exemptions. New instrument vs repair — the owner's.
6. (Optional) **WY-2 into IN's family** — moving a wave between families re-sequences phase 3.

---
CONFIRMED vs PLAUSIBLE: the status table, every code quotation, X1/X2/X5/X6/X7/X8, C1-C8, S1-S7 and the §7 measurement are CONFIRMED by read; S8's persistence contradiction, S2's semantic equality, the Class A "relic" labels, X19's tension and the evidence-law judgments are PLAUSIBLE.
