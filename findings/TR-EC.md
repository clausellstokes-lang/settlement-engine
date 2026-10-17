# FINDINGS — TRADE AND THE ECONOMY (reader seat, coherence read 2026-10-16)

Files read WHOLE: `volumes/DESIGN_FP_TRADE.md` (1454), `volumes/DESIGN_FP_ARCH_TR.md` (629), `volumes/DESIGN_FP_ARCH_EC.md` (2979, incl. the §7 matrix in full). Also SPINE §1 + §2 SP-2/SP-3/SP-4 + §3 FP-TRADE crux; the fold's TR section (`DESIGN_FP_ARCHITECTURE.md:1585-1730`); GRAMMAR's commercial family rows; FP board + FP-ORDER; ODQ §934.90 (grep only). Code of record: `master-00b648c9d` (static reads only). Effective-line figures marked "≈" come from a comment/blank-stripping counter that reproduced eslint's recorded figures EXACTLY on five calibration files (pulseKernel 1581, supplyKernel 489, commodityFlow 474, peaceTerms 799, institutionLifecycle 800). They are still READS, not gate runs.

Abbreviations: TRADE = DESIGN_FP_TRADE.md, TR = DESIGN_FP_ARCH_TR.md, EC = DESIGN_FP_ARCH_EC.md, SPINE = DESIGN_FP_SPINE.md. `code:` = `master-00b648c9d/src/...`.

---

## 1. THESIS

TRADE (the design law) gives commerce the same kit war has: typed grievance reasons, merchant houses as actors at faction grain, markets known only through belief, grain carried as physical goods, pacts, corners, ventures, travelling factors, and six owner-settled endings. All of it sits under T1–T10, chiefly no price engine, no coin (since reversed), single writers, never merging truth and belief, and the double-count law (TRADE:56-130). EC (compiled 2026-10-16) says it absorbs TR. It adds a truth-side CONDITION band with typed pressures for each (settlement, good). On top of that it adds a claimant ladder, procurement, propagation, stances, grades and slow verdicts. Three owner amendments come next: expectation (EC-16), the court's remedy (EC-17) and the open road (EC-18). §18 adds seven refinements (EC:1-49, 2963-2979).

The sentence a DM reads when the flagship fires:
- EC-1 (the flagship): "Grain is dear in Mossgate: the Aldenmoor road is cut at the siege of Harrow, and the garrison has drawn the stores" (EC:866-868).
- TR-3 (built): "The caravans came for the famine and found the harvest" (TRADE:704). It is built and computed, then DROPPED: `wrongMarketArrivals` is never forwarded (EC S26:390).
- TR-1 (built): "Aldenmoor shut its market to Thornwall wool and called it prudence" (TRADE:497). The writer has NO CALLER (`code: lib/spatialUsage.js:362`, "advanceCommercialReasons has NO CALLER IN src/"). So the DM reads nothing today.
- EC-16: "Harrow's duke believes Aldenmoor is arming and has filled his armoury; iron is dear in Harrow though no war has come" (EC:1866-1868). §4 below argues the "filled armoury" has no state to stand on.
- EC-17: "Iron has been dear in Mossgate for a year and its one smithy cannot meet the need; the council has sent envoys to Harrow for a pact" (EC:2024-2026).
- EC-18: "Mossgate's iron, cheap at home, went up the Harrow road on word that it was dear there" (EC:2154-2155).
- **No DM-felt sentence:** EC-10 (the auditor). EC-9 has none by design. The posture arm of EC-16 gives only a `slight` pressure in aspatial worlds.

---

## 2. STATUS, TRUTHFULLY

Header claims: TRADE:13-18 "Status: ARCHITECTURE. Nothing here is scheduled". TR:13-14 "IMPLEMENTATION ARCHITECTURE. Nothing here is scheduled … Every wave ships DARK". EC:17-49 "IMPLEMENTATION ARCHITECTURE, DARK — ITS EIGHTEEN RULING ROWS ARE RULED … no EC lane … dispatches until the UI + prose release is PUSHED AND DEPLOYED". The TRADE and TR headers are STALE: four TR units have landed.

| Wave/unit | Volume's claim | Board / git | Code at 00b648c9d | Verdict |
|---|---|---|---|---|
| TR-1 casus commercii | TR:13 "nothing scheduled"; EC S49:427 "no caller" | git `d7ea69a4b` 2026-08-04 (pre-board) | `commercialReasons.js:133` gate; T9 seam LIVE `tradeWar.js:335`; key in `ENGINE_GATED_VIRTUAL_RULE_KEYS` (`simulationRules.js:281`); writer unmounted (`spatialUsage.js:362`) | BUILT DARK, UNMOUNTED. 3 of 8 pairs read live state (`commercialReasons.js:58-61`) |
| TR-2 house | EC §4:588 "the ONE TR flag with a gate read" | board:21-24 `1f65f03bd`→`c8c21a9f3`; cures `d36f43c21` (09-24) | `houseLedger.js:173` gate; key `simulationRules.js:374`; no pulse mount | BUILT DARK, UNMOUNTED |
| TR-2b syndicate | RESERVED (TRADE:633-655; EC:597; OD-EC-16) | — (FP-ORDER:5's "TR-2b" is a DIFFERENT unit, see §9) | `syndicateHousesEnabled` 0 hits | RESERVED (honest) |
| TR-3 believed markets | TR:281 "RE-DERIVE"; EC §2 "dark" | board:53-55 `0e4d54161`→`0fd6b9209` LANDED 09-24 | `dispatchDestination.js:93` gate; key `simulationRules.js:263` | BUILT DARK. Wrong-market evidence dropped (EC S26) |
| TR-4 grain road | EC-12 "named only" | FP-ORDER:5 pair 2 "TR-4 (after WY-3)"; not dispatched | `foodCaravansEnabled` only in `tradeConvergenceContract.js` | ABSENT |
| TR-5 pact lane | EC §4:592-595 "pact lane is GRAMMAR's"; EC-6 absorbs the "residue" | — | `tradePactsEnabled` name-only; 3 commercial rows `peaceTermsCatalog.js:306-308`, executor `'seam'`, ZERO producers anywhere in src; `realmPressure01` consumed only by war (`warReasons.js:803`) | ABSENT, and EC declines to build it (see §4 rows R-TR5-*) |
| TR-6 / TR-7 / TR-8 | EC-13/14/15 "named only" | not dispatched | flags name-only | ABSENT |
| TR-9 convergence | EC-10 "absorbs TR-9" | git `c7933e845` (TR-9c contract, 2026-08-04) | `certification/tradeConvergenceContract.js` present, no envelopes | CONTRACT BUILT; collectors ABSENT |
| EC-0 … EC-18 | EC:17-49 dark; dispatch gate = release pushed+deployed | nothing on board | all ten EC flag names and `marketConditions` = 0 src hits | NOT STARTED (honest) |

---

## 3. LAWS AND OWNER-SETTLED ITEMS (verbatim; the fold may not re-narrate)

**TRADE program laws T1–T10** (TRADE:56-130): T1 NO PRICE ENGINE ("the engine models BUYERS who believe, never markets that clear … `SCARCITY_BANDS = {glut, soft, fair, dear, desperate}` … TRUTH-SIDE scarcity … consumed only by physics … BELIEVED scarcity … consumed by every decision", :56-62). T2 NO COIN (:63-67, REVERSED by ODQ §731.1, EC S45:417). T3 SINGLE WRITERS (:68-86). T4 E3 FOR COMMERCE ("never select a partner, a victim, or a market. No read exported by any house/market module may return a target list", :87-91). T5 NO RATCHETS (:92-96). T6 MORAL PRICING, NEVER PROHIBITION (:97-101). T7 THE DOUBLE-COUNT LAW (:102-115). T8 BELIEF DISCIPLINE (:116-121). T9 SHARED-SUBSTRATE FENCE (:122-127). T10 TWO-TIMESCALE (:128-132).
**Seam Three's whitelist rule** (TRADE:366-370): "The whitelist is enumerated HERE and only here".
**Owner-settled endings** (TRADE:16-18): "{fortune, ruin, monopoly, collapse, severance, cornered} is OWNER-SETTLED (SPINE §3) — names not vetoable; envelopes are." TR-9 binds the DEFINITIONS (TRADE:1238-1251).
**SPINE §3 FP-TRADE crux** (SPINE:494-501), including "FOOD JOINS THE PHYSICAL PIPELINE (the flagship-good asymmetry dies …)".
**J-TR-1…12** (TRADE:1309-1363), all "vetoable here; an implementer NEVER re-rules these silently". J-TR-2 (TRADE:1313-1315): "commerce reaches war ONLY through tradeWar's existing intent deposit reading severance magnitude."
**EC owner words** (each verified VERBATIM in ODQ §934.90, `OWNER_DECISION_QUEUE.md:32967-32979`, one hit each):
- Addendum 1 (EC:2680): "Go with the chair's recommendations on OD-EC-1 through OD-EC-18; record them as an ODQ addendum with my words. Still nothing dispatches before the release is pushed and deployed."
- E13 (EC:231): "belief should also play a role in this as well as if there is an impending war that is believed... for example, the prices of weapons would still go up and the capacity growing towards its capacity following the market / that should complicate or foil what you've already built rather than replace"
- E14 (EC:245): "persistent price heuristics should also be included in what moves courts and settlements in most if not all aspects of foreign trade... take the mosgate for example, if the price of iron remains low and it impacts their needs and if their capacity is low in comparison, that pushes them to attempt to expand that capacity to meet critical needs or seek out new trade partners, allies, or to go on conquest for example."
- E15 (EC:261-262): "it should also partially influence the flow of trade as well from capacity to pricing between settlements and how and where caravans travel to if they are not under contract to a specific settlement"
- OD-EC-14 (EC:915): "also i see that you are avoiding things like \"the price is triple or more than the standard\". in this, we still don't set an absolute price, but we give the DM a reference to their own determined standard price. what are your thoughts to that?"
- §18 (EC:2963): "how would you refine it further?" → "do those".
**ODQ §776** (EC:55): "WE DO NOT HAVE ABSOLUTE PRICES because of the DM's mandate".
**EC laws E1–E15** (EC:147-271) and **J-EC-1…21** (EC:2587-2678, vetoable by one owner clause). **OD-EC-1…18 RULED** (EC:2680-2721).
**Chair readings of owner words, recorded and vetoable:** J-EC-20 (EC:2660-2666) reads "low" as low SUPPLY; J-EC-21 (EC:2667-2672) reads "partially" as a weight capped below path cost.

---
## 4. CROSS-PROGRAM CLAIMS

### 4A. THE ABSORPTION RECONCILIATION — does EC honour TR? (the special duty)

EC's absorption contract (EC:41-46, J-EC-1 EC:2587-2591, §0b EC:91-99): the TR waves keep "names, texts and pins". Where EC and TR disagree on DESIGN, "DESIGN_FP_TRADE.md (the design law) wins", except for §731.1 and except where §2 refutes TR. §0b names only **TR-2/4/6/7/8** §4 text as "normative where this volume compresses them". So TR-5's and TR-9's per-wave text is NOT kept normative: TR-5 is "GRAMMAR's" and TR-9 "is EC-10". EC mentions no J-TR block, no T-n tellable, no tickScanBudget, no Gini, no route_* Herald debt, no CR-WR10-B and no calm-equivalence. Grep counts in EC are all **0**.

Verdict key: **HONOURED** · **HONOURED-BY-REF** (kept only through the supremacy clause; EC is silent) · **AMENDED+REASON** · **AMENDED-SILENTLY** (EC changes it without naming the TR item it changes) · **DROPPED-SILENTLY** · **CONTRADICTED** (EC text breaks it).

| TR item (receipt) | EC treatment (receipt) | Verdict |
|---|---|---|
| **T1 no price engine; one 5-band vocabulary in two forms** (TRADE:56-62) | E1 takes the five words for TRUTH (EC:147-156). E2 keeps SP-B's four for belief (EC:157-163). J-EC-17 records the deviation (EC:2673-2678). Phrases relative to the DM's standard are ruled by the owner (OD-EC-14). | **AMENDED+REASON** (vocabulary) |
| **T1 "TRUTH-SIDE scarcity … consumed only by physics; BELIEVED … consumed by every decision"** (TRADE:59-61; Seam Three TRADE:355-358) | Truth-side conditions now drive DECISIONS: the seat's reserve notch (EC-3, EC:1027-1031), the build governor (EC-8, EC:1548-1563), all four court deciders (E14 EC:236-252; EC-17 arm 2 "the OWN-side lack reads the condition", EC:1952-1955) and the open-road push (EC-18, EC:2079-2082). Only EC-17's local line "the court knows its own shelves" (EC:2001) gives a reason. No J-block amends T1's consumption rule. | **AMENDED-SILENTLY** (a real change of law, never recorded against T1) |
| **T2 no coin** (TRADE:63-67) | Reversal by ODQ §731.1 is cited (EC:44, S45). Coin only through the treasury's one mint (E9; EC-6 slice 3). | **AMENDED+REASON** (owner) |
| **T3 single writers; report the applyWorldPulse fold** (TRADE:68-86) | One writer per ledger (EC §5:599-607). EC-12 credits through `applyFoodDeltasToUpdates` (EC:1730-1731). The applyWorldPulse report (TR Q2) is not mentioned. | **HONOURED** (Q2 HONOURED-BY-REF) |
| **T4 never select partner/victim/market; closed verb sets** (TRADE:87-91; TR-2 verbs TRADE:539-546) | J-EC-16 reads T4 for claimant classes (EC:2648-2651). That reading has a reason. But EC-16 arm 3 gives the house a NEW act, "a POSITION, TR-6's purchase mechanics without the corner gate" (EC:1778-1784). That act is outside TR-2's CLOSED verb set {sponsor_caravan, take_route_interest, extend_credit, corner_attempt, venture_stake, petition_pact, relief_grant}. | **AMENDED+REASON** (J-EC-16) / **AMENDED-SILENTLY** (the verb set grows) |
| **T5 no ratchets; "monopoly and the corner are ENDINGS with counterforces"** (TRADE:92-96) | Bands are re-derived (EC:799-802) and the reserve/lifecycle reverse (EC-3, EC-8). But EC-8's monopoly exists ONLY where "no build candidate [is] possible (tier-illegal second processor)" (EC:1590-1593). That makes it structurally immune to TR's ENTRY counterforce (TRADE:1009-1013). | **CONTRADICTED** (see TR-6 row) |
| **T6 moral pricing, never prohibition** (TRADE:97-101) | Every EC wave's Req-13 line prices conduct and never gates it (EC-3:1085-1089; EC-16:1891-1893; EC-17:2047-2050). | **HONOURED** |
| **T7 one food arm; never rewrite the stash** (TRADE:102-115) | E4 (EC:169-172); EC-3 non-food + the no-food pin (EC:1001, :1066-1067); EC-12 (EC:1726-1732). BUT E4 says food is "never a commodity unit" (EC:170-171), which contradicts TR-4/EC-12's grain units "in the M6a balance" (EC:1727). §18 R3 puts `provisions` on "the household link's target (EC-3)" (EC:2969). EC-3 has no food household link (EC:1066). | **HONOURED in substance; two CONTRADICTING sentences** |
| **T8 no merge; Seam Three whitelist "enumerated HERE and only here"** (TRADE:116-121, :366-370) | EC-1 adds a third whitelisted composer, `conditionToScarcityTruth.js`, with a reason (J-EC-13/17; skeptic #19). It pins that leaf as "the ONLY module that may name both ladders" (EC:818-819), with guard-the-guard reds "elsewhere" (EC:836-838). Then EC-17's pactTriggers fork (EC:1952-1956) and EC-18's composer (EC:2139-2142, "the whitelist grows by this one composer") break EC-1's own pin. The list now grows in EC, not in TRADE §3. | **CONTRADICTED** (by EC-17/EC-18 against EC-1 and TRADE §3) |
| **T9 shared-substrate fence** (TRADE:122-127) | EC-4 `procuredQuality` is a WR seam (EC:1138-1147). EC-17 adds "ONE net-zero seam line each" to warReasons/settlementStrategy (EC:2057-2059), while its own file list says "(+1 seam)" (EC:2067-2068). | **HONOURED** (one internal inconsistency) |
| **T10 two-timescale echo** (TRADE:128-132) | E10 (EC:208-214); §9c clock table (EC:2431-2453). | **HONOURED** |
| **SPINE crux "FOOD JOINS THE PHYSICAL PIPELINE"** (SPINE:498-500) | EC-12 keeps TR-4, but in Phase E, with nothing lit at the first soak (EC:2914-2928). That is ordering, not removal. | **HONOURED** (deferred by sequence) |
| **TR-1 casus commercii** (TRADE:453-532; TR:226-260) | EC-2 car 1 mounts it from the EC kernel and declares that 6 of 16 types can score (EC:933-939). That matches code: 3 pairs live (`commercialReasons.js:58-61`). BUT EC names three TR-1 reason types that DO NOT EXIST: `supply_withheld` (EC:1042, :1080, :1189, :2039, matrix M1/M42/M58), `toll_war` (EC:1345, M21) and `market_closed` (EC:1347, M22). The taxonomy (`commercialReasonTaxonomy.js:46-67`) has `market_exclusion`, `toll_extortion`, and nothing for withheld supply. EC-3 calls `supply_withheld` "one of the six" (EC:1042-1043). It is not one of them. | **HONOURED (mount) / CONTRADICTED BY CODE (three phantom reason types)** |
| **TR-2 house** (TRADE:533-631; TR:262-288) | EC-11 seam: stock interests read EC-1 conditions into books; the mount lands in the EC kernel slot (EC:1716-1720). | **HONOURED** |
| **TR-2b syndicate** (TRADE:633-655) | Stays RESERVED (EC:597; OD-EC-16). | **HONOURED** |
| **Universality clause** (TRADE:657-670) | Not mentioned. EC-18's "merchant faction" actor (E15 EC:268-270, J-EC-21) reads a per-ORIGIN-SETTLEMENT scalar (`dispatchEV.js:47` "per-ORIGIN scalar in a new `merchantAppetite` sub-ledger"; `appetiteOf(appetiteLedger, originId, …)` :259). | **HONOURED-BY-REF** (actor labelled at faction grain, measured at settlement grain) |
| **TR-3 believed markets** (TRADE:671-735) | EC-2 car 2 forwards `wrongMarketArrivals` (EC:940-943). EC-14 and EC-18 consume it. | **HONOURED** |
| **TR-4 grain road** (TRADE:737-842; TR:290-358) | EC-12 seam line (EC:1721-1727). J-EC-15 lets "TR-4 [land] any time after EC-3" (EC:2640-2642). Both the fold (`ARCHITECTURE.md:1613-1628`, "slots … IMMEDIATELY BEFORE #26 TR-4", "the … round-trip pin LANDS HERE [WY-3]") and FP-ORDER:5 ("TR-4 (after WY-3)") order TR-4 after WY-3. EC never mentions WY-3 (0 hits). Slice 2 (J-TR-6 robbed-tribute claim) and the calm-equivalence pin are only by reference. | **AMENDED-SILENTLY** (WY-3 dependency lost) |
| **TR-5 the five commercial executors** (TRADE:847-873; TR:360-415) | EC-6 lands ONE seam executor (a stance read) over the THREE rows that exist (`peaceTermsCatalog.js:306-308`; EC:1313-1320). `grain_provision` and `route_wardenship` (TRADE:858-862) are handed off: "remain GRAMMAR's … EC owes neither" (EC:1318-1319). But GRAMMAR's canonical commercial family is THREE rows (`DESIGN_FP_GRAMMAR.md:461`), and GR says "TR-5 lands executors + producers" (`DESIGN_FP_ARCH_GR.md:533-537`). The `tradeConvergenceContract.js:334-337` line EC cites says "GR-3's five", which is stale; it names neither. | **DROPPED-SILENTLY** (two terms owned by nobody; the food-export debt "demographicsRates.js:271-277 … PAID", TRADE:860-862, unpaid) |
| **TR-5 PRODUCERS of commercial terms** (GR:536 "TR-5 lands executors + producers"; GRAMMAR:691-693 "TRADE's TR-5 commercial family JOINS this trigger's draft lens") | EC-6 lands only the read. `rg 'market_access\|toll_exemption'` finds nothing in src outside the catalog. No drafter ever puts the terms in a pact. EC-17's market-seeking arm assumes "a pact `market_access` demand" (EC:1981-1982). | **DROPPED-SILENTLY** (EC-6's executor reads terms nothing writes) |
| **TR-5 "THE DEAD CONSUMER LANDS": realmPressure01 → trade demand; T-5 TELLABLE** (TRADE:866-870, :895-900; TR:362-365) | `realmPressure` gets 0 hits in EC. Code: still consumed only by war (`warReasons.js:803-804`; `rg -l realmPressure01` = 4 war/demography/cert files). EC-17's per-good need is a different read and never discharges this. | **DROPPED-SILENTLY** |
| **TR-5 discharge items (3): amend the war volume's CR-WR10-B blockquote and `ARCHITECTURE.md:2349` "→ DISCHARGED"** (TR:385-390) | 0 hits in EC. With TR-5 never built, those two "TR-5 STILL OWED" sentences become permanently stale. | **DROPPED-SILENTLY** |
| **TR-5 flag `tradePactsEnabled`** | EC: "has no gate read" (EC:595) and builds none. TR-8/EC-15 still needs "SP-1 + TR-5 + TR-7" (EC:591). The contract table needs `tradePactsEnabled` lit for TR-8 (`tradeConvergenceContract.js:328-338`). | **CONTRADICTED** (TR-8 can never light validly; EC-15 is unreachable) |
| **TR-6 corner + famine speculator** (TRADE:936-1092) | EC-13: the forced band becomes a `corner` PRESSURE, and the seizure moves stock into the HOUSEHOLD class (EC:1728-1738). EC-13 also says "M6a has no holder concept" (EC:1736). That refutes TR-6's "real M6a purchases into house-interest warehouse stocks" (TRADE:941-944) and J-TR-5's "stock interests over real M6a stocks" (TRADE:1338-1340). The corner gate's NUMERATOR (the house's held share) then has no measurement, and EC does not say how it is measured. | **AMENDED-SILENTLY** (premise refuted, no replacement given) |
| **TR-6 MONOPOLY definition** (TRADE:997-1014; TR-9 "Definitions bind here" TRADE:1238-1243: house's held share of REACHABLE supply, the independent census, MONOPOLY_DWELL in seasons, counterforce ENTRY via TR-2) | EC-8 re-defines it as "a category whose ONLY processor stands under sustained `dear` with no build candidate possible … ≥ 52 ticks … processor COUNT alone" (EC:1589-1595). This is settlement-grain, not house-grain, it has no entry counterforce, and the dwell is a fixed 52. The only reason given is "absorbing TR-6's R5 correction" plus skeptic #36 (EC:2766). | **AMENDED-SILENTLY** (the definition of an owner-settled ending changed) |
| **TR-6 ordering** (TRADE §9 build order TR-6 before TR-7/8, TRADE:1424) | J-EC-15 makes it "the corner TR-6 LAST of all, after the factor" (EC:2641-2642). The only reason is "§17 Phase E agrees", which is circular. | **AMENDED (no real reason)** |
| **TR-7 ventures** (TRADE:1094-1160) | EC-14 seam (EC:1739-1742). EC-18 yields to it (EC:2130-2134). | **HONOURED** |
| **TR-8 factor** (TRADE:1162-1230) | EC-15 seam (EC:1743-1746). Its TR-5 precondition is orphaned (see the `tradePactsEnabled` row). | **HONOURED-BY-REF / blocked** |
| **TR-9 contract + envelopes** (TRADE:1232-1304; TR:449-483) | EC-10 extends the contract; the six endings and eight flags stay (EC:1692-1713). DROPPED from EC-10's scope, with §0b excluding TR-9's text: the T-11 Herald debt (route_* WHAT_PHRASES rows + totality pin), tickScanBudget lanes, house-Gini, corner envelope, pact-mix guard, deciding-component histogram, self-sufficiency trend envelope (TRADE:1252-1272). | **DROPPED-SILENTLY** (seven TR-9 instruments) |
| **Ending `severance`** (TRADE:517 "the formal cut, minted WITH its casus named"; TR-5 TRADE:917) | EC-6: "a `closed` stance dwelling a season … is the severance ending's evidence" (EC:1391-1392). | **AMENDED-SILENTLY** (new evidence source for a bound definition) |
| **Ending `collapse` honest zero** (TRADE:279-284) | Kept (EC:589). | **HONOURED** |
| **J-TR-1 pact seam, one evaluator, transport switch at TR-8** | EC-17 forks INSIDE the existing evaluator (EC:2060-2061). EC-15 does not say which abstract path TR-8 suppresses now that the lane is GRAMMAR's `pactFormation`. | **HONOURED-BY-REF** |
| **J-TR-2 "commerce reaches war ONLY through tradeWar's existing intent deposit"** (TRADE:1313-1315; restated in code `subsystemRowsCompact.js:293` "The war coupling runs ONE way through ONE door") | EC-17 arm 3 feeds the economy's need straight into `resource_pressure` and into settlementStrategy's chooser (EC:1963-1976). That is a second commerce→war door. The owner's E14 ("go on conquest") gives it a reason, but J-TR-2 is never named or amended. | **CONTRADICTED** (needs a recorded supersession) |
| **J-TR-3 / J-TR-9 / J-TR-12** | EC-11 / EC-15 / EC-14 | **HONOURED-BY-REF** |
| **J-TR-4 / J-TR-8 granary + grain in the balance** | EC-12 | **HONOURED** (E4 sentence contradicts, see T7) |
| **J-TR-5 the corner is books, not a ledger** | EC-13's "M6a has no holder concept" (EC:1736) | **CONTRADICTED** (unbuildable as written) |
| **J-TR-6 robbed tribute → claim** | 0 hits | **HONOURED-BY-REF** |
| **J-TR-7 moral pricing composition** | Req-13 lines | **HONOURED** |
| **J-TR-10 no clamps / timers** | EC-16's one-season `outcome` memory (EC:1806-1812) is a display memory, not a clamp | **HONOURED** |
| **J-TR-11 envelopes police, never wired back** | §17 Phase F loop envelope (EC:2925-2932) | **HONOURED** |
| **Seam 5a-1 WR-10 tripwire / 5a-2 CR-WR10-B twin sentence** (TR:547-555) | 0 hits | 5a-1 **HONOURED-BY-REF** (GR-3 executed it); 5a-2 **HONOURED** by not touching it, but its "TR-5 STILL OWED" text is now permanent (see TR-5 row) |
| **Seam 5a-3 one terms evaluator** | EC-17 inside `pactTriggers` | **HONOURED** |
| **Seam 5a-4 hold writer / 5a-5 T7 fence** | EC-15 / EC-12 | **HONOURED-BY-REF** |
| **Seam 5b-6 toward SP-2** (TR:563-567) | SP-B built; EC-1's truth-door seam (EC:809-822) | **HONOURED** (with the truth-door error in §6) |
| **Seam 5b-7 toward GR-3 "the five term spellings … EXACTLY ONCE"** (TR:568-571) | EC-6 pins THREE (EC:1374-1376) | **AMENDED-SILENTLY** (five→three; the two missing terms never named) |
| **Seam 5b-8 INT-1 / 5b-9 FAITH tithe / 5b-11 INFO lure** | EC-14 by ref / 0 hits / EC-16 deception arm | **HONOURED-BY-REF** |
| **Seam 5b-10 POPULATIONS commons + seizure writer** | EC-13: seizure into the household class (EC:1734-1738). The matrix M37 says "a crown-class claimant" (EC:2274). | **AMENDED** (destination changed; contradicts its own matrix) |
| **TR §6 Q1 pre-spine partial build** | OD-EC-4: after the release, pushed and deployed (EC:2687) | **AMENDED+REASON** (owner) |
| **TR §6 Q3 sibling leaves for belief** | Holds (EC-16 does not touch beliefMap, EC:1898). Its figure "771/800" is stale: ≈781 at the tip; TR itself says 778 (TR S41). | **HONOURED** (stale figure) |
| **TR §6 Q4 / §2 "DECLARED-PENDING" certification** (TR:121-124, :616-620) | EC §4 (EC:550), EC-1 file list ("declared-pending row", EC:927-928) and EC-10 (EC:1709-1710) all rely on it. Code: `VIRTUAL_PENDING_RULE_KEYS = Object.freeze([])`, "SHRINK-ONLY … a measured gate with no row is exactly the blindness this lane exists to end" (`subsystemRowsVirtual.js:889-897`). TR S38 says "the 'declared-pending entry' door is STRUCK" (TR:99-101). | **REFUTED BY CODE** (EC inherited TR's stale half) |
| **Tellables T-1…T-11** (TRADE:445-451) | 0 hits for "T-n". T-5 and T-11 are dropped (above). T-7 needs `contract_default`'s producer ("the compliance stack (GRAMMAR GR-3 / TR-5)", `commercialReasons.js:50`), which nobody now owns. | **T-1/2/3/4/6/8/9/10 HONOURED-BY-REF · T-5, T-7, T-11 DROPPED-SILENTLY** |

**Tally:** 51 rows; verdict tags (a row may carry two) are HONOURED 18, HONOURED-BY-REF 10, AMENDED+REASON 4, AMENDED-SILENTLY 7 (+2 other amendments), DROPPED-SILENTLY 6, CONTRADICTED 6 and REFUTED-BY-CODE 1. The claim that "TR's waves keep their texts" holds for TR-2, TR-3 and TR-7. It FAILS for TR-5 (its trade half is owned by nobody), TR-6 (the monopoly is redefined and the holder is refuted), TR-9 (seven instruments dropped), J-TR-2 (a second door to war), and T1's consumption rule (truth now drives decisions without a recorded amendment).

### 4B. Claims about OTHER programs (and the code they assume)

| Claim (EC/TR line) | Other side (receipt) | Verdict |
|---|---|---|
| SP-B believed ladder `{scant, pinched, sufficient, plentiful}` (EC:157-163) | `beliefAxisSubjects.js:85` `SCARCITY_BANDS = ['scant','pinched','sufficient','plentiful']` | AGREES |
| "the ONE TRUTH DOOR `axisGroundTruth` (`beliefAxes.js:150-174`)" for scarcity (EC:811) | `pactFormation.js:248` calls `scarcityGroundTruth(row)` DIRECTLY, bypassing the door (also `beliefAxisSubjects.js:389`) | DISAGREES. Lit EC-1 would leave the pact trigger's self-read on generation lists while beliefs move to the condition: split-brain |
| GRAMMAR's `trade_demand`: "A believes it lacks what it believes B has dear" (EC:1952) | `pactTriggers.js:186-216`. "BOTH ENDS ARE BELIEFS" (docstring :189). In fact the own side is `scarcityGroundTruth` (truth) and the score is `rungGap(ladder, mine, theirs)` (:206), an index difference on ONE ladder | DISAGREES with its own docstring. EC-17's change of the own side to a CONDITION rung (5-rung or {marked,severe}) cannot enter `rungGap` on SP-B's 4-rung ladder (`rungOf` → −1 → null → "no occasion", :149-165) unless it is translated back. Then a truth band and a belief band are combined arithmetically: a Seam Three breach EC-17 says it avoids (EC:1955) |
| GRAMMAR owns grain_provision/route_wardenship (EC:1318-1319) | `DESIGN_FP_GRAMMAR.md:461` commercial family = exclusivity / market_access / toll_exemption only; `DESIGN_FP_ARCH_GR.md:536-537` "TR-5 lands executors + producers" | DISAGREES (ownership circle) |
| War `resource_pressure` "via `perceivedScarcityOf` … today it reads `perceivedScarcityOf`'s food-and-realm inputs" as the OWN side (EC:1963-1967) | `demographicsWar.js:302-307`: `perceivedScarcityOf` is the FOE side (observer=fromId, subject=toId, `truth01: foeDemo01`). It reads the foe's believed `populationTrendBand` (:229-231), not goods. The own side is `foldDemographicMotive(base01, ownDemo01, realm01)` (:317-321), all truth. The score is `gap = own01 − foe01` (`warReasons.js:518`) | DISAGREES (sides swapped; no per-good foe read exists, so "a hostile neighbour believed to have iron", EC:2009, has no existing read) |
| settlementStrategy "up to six legal moves … `marketNeed01` colours `deploy`/`reroute`/`credit`/`embargo` by the disposition channel" (EC:1971-1975) | `settlementStrategy.js:660-676`: `reroute/embargo/credit` exist only when the scoring OBJECTIVE carries a `levers` bag (the merchant archetype), not by disposition channel. "functions of the same signals" (:664) AGREES | PARTLY DISAGREES (levers are archetype-gated) |
| `beliefMap.js:196` "the belief map's own activation gate … verify its key at build" (EC:571) | `beliefMap.js:196-209` `beliefsActive`: spatialCanonVersion > 0 ∧ infoMode ≠ 'omniscient'. NO rule key | DISAGREES ("key" does not exist). This also refutes EC-16's "Aspatial arm? YES (… the founding arm)" (EC:571): in aspatial worlds `belief()` returns `{source:'truth'}` (`beliefMap.js:361-366`) |
| readiness rungs from warPosture (EC:1759-1761) | `beliefMap.js:164` `peace: 0, alert: 0.25, war_preparation: 0.5, mobilized: 0.75` | AGREES |
| "silence decay (0.92/tick …) — SP-B's" (EC:1870) | `beliefMap.js:110-113` `BELIEF_TUNING.SILENCE_DECAY: 0.92`. It is the CORE belief map's and it decays CONFIDENCE, not readiness | STALE attribution (minor) |
| INFO forges readiness (`beliefMap.js:993`) (EC:1762) | `beliefMap.js:966-997` "A deceiver reports a non-hostile subject as MOBILIZING" | AGREES |
| Treasury one mint; `TAX_FORMS` carry `market_tolls`/`port_customs` (EC:1333-1340) | `treasury.js:269-272` | AGREES (the mint's external-input seam is unverified; EC already makes it a STOP) |
| Disposition channels martial/mercantile/diplomatic/insular (EC:1018-1020) | `dispositionLedger.js:66-71` | AGREES |
| `courtPostureOf` (`strategicPosture.js:222`) | present | AGREES |
| Iron criticality 0.72 (M60, EC:2303); bar 0.5 | `goodsCatalog.js:104-108` iron 0.72; leather 0.48 (a kit good under the bar) | AGREES |
| seasons vocabulary incl. "hard winter" (R3, EC:2969) | `seasons.js:68-70,:137` drought / hard_winter / bountiful; four seasons | AGREES. But R3's "marching season" has no seasons.js term (only a comment, `spatialCost.js:92`) |
| History is "the crossing NEWS (newsLog …)"; "the distance-priced newsLog is already per-reach" (EC:653, :2412, R2 :2968) | No `newsLog` identifier in src. Pulse news lands in the store-side `wizardNews` feed (`campaignWorldPulseDeferred.js:1244-1246`), `MAX_ENTRIES = 240` WORLD-WIDE (`wizardNews.js:21`), not per observer. `pulseHistory` keeps 80 entries (`worldState.js:16,:798`) | DISAGREES. R2's "heard … over the last N years" has no per-observer, multi-year substrate. EC-18's ENGINE push reading it would breach layering (the pulse is pure over `(worldState, saves, rules, now)`, EC §9b:2421) |
| `trade_overture` is "the pact's first step" (EC:1958-1960; R5) | No pact module names it (`rg tradeOverture` in pactFormation/pactTriggers/pactProposals = 0). It is a separate generosity corridor (`generosityKernel.js:574`) | DISAGREES (R5's fold rests on a link that does not exist) |
| SPINE §1.14(a) edit verb "operationRegistry-registered" (SPINE:91-93) | EC uses realm verbs instead, with a reason: "NOT `operationRegistry`, which is a manifest with no action lane" (EC:1096-1098; skeptic #18) | DISAGREES WITH SPINE, measured. SPINE needs a bracket (SPINE wins until amended) |
| FP-ORDER pair 2 lights TR-4…TR-8 at the pair's end (FP-ORDER:5) | EC Phase E/F: no TR flag in the first soak; TR last (EC:2910-2928) | STALE FP-ORDER (OD-EC-1/OD-EC-4 ruled; FP-ORDER not amended) |
| `ARCHITECTURE.md` fold (#23-#31) | Has no EC mention; still sequences TR-4 after WY-3 and TR-5 as "the DEAD CONSUMER finally lands" (`:1674-1676`) | STALE (fold predates EC) |
| War chair owns the `procuredQuality` wiring (EC-4, EC:1196-1198) | `DESIGN_WAR_RULINGS_ARCHITECTURE.md`: not checked by this seat | SILENT (PLAUSIBLE: the WR volume has no such seam row; the WR reader should check) |

---
## 5. INTERNAL CONTRADICTIONS

### 5A. The un-reviewed amendments: EC-16, EC-17, EC-18, §18 (the adversarial read EC:2799-2802 asks for)

**EC-16 EXPECTATION**
1. **The "filled armoury" has no state, so the foil and the reward are both unbuildable.** E13 says "the world holds what it bought on the rumour (the FOIL)" (EC:226-228), and EC-16 says "the drawn stock sits" (EC:1806-1808). But E5/EC-3 put crown draws in the conservation `consumed` term (EC:1057), and §5 says "procurement draws — rows in the M6a balance (E5), not a ledger" (EC:649). Nothing holds the drawn arms. The RIGHT-WAR tellable then claims "the band at war's start sits one rung LOWER than in a town that did not believe" (EC:1771-1773, :1811; M59 EC:2301; §10b EC:2519). Under the written physics this runs backwards. The believer drew stock EARLIER, so at war's start its warehouse is lower and its band DEARER. EC-4's `procuredQuality` is "a stock-depth term on the drawable three" (EC:1143-1146), so the believer's army also marches with LOWER deployed quality. Foresight is PENALISED, not "rewarded by the physics" (EC:1812). M59's sentence "Harrow marched with full racks" (EC:2301) has no record behind it (Evidence Law). Cure: an armoury holding is a NEW persisted shape (owner-gated), or the tellable must be re-stated (the believer pays early and gains only EC-8's speculative second smithy).
2. **Arm 1 breaks EC-4's own pins.** It draws "BEFORE its own readiness rises" (EC:1768). EC-4 says "no draw without a deployment or readiness rise" (EC:1153), and its mutant is "planted draw without deployment ⇒ reds" (EC:1197). EC-5 re-affirms "EC-4's 'no draw without a deployment' holds" (EC:1240). The amendment never amends those pins.
3. **The founding arm's "aspatial YES" is false at the gate.** §4 says "Aspatial arm? YES (the posture arm + the founding arm)" (EC:571). The founding arm reads believed readiness. Code: `beliefsActive` requires `spatialCanonVersion > 0` (`beliefMap.js:204-209`), and in an aspatial world `belief()` returns `{source:'truth'}` (`:361-366`). The arm is either EMPTY aspatially (`beliefRecord` → null) or reads TRUTH, which breaks EC-16's "no arm reads a truth-side readiness" (EC:1835-1839). Either way the §4 cell is wrong. CONFIRMED by read.
4. **The house "position" is a new act outside a closed set, with no holder.** Arm 3 "sponsors caravans to BUY into its warehouse stock" (EC:1781). EC-13 says "M6a has no holder concept" (EC:1736). TR-2's verb set is CLOSED (TRADE:539-546) and has no purchase or position verb. The collision line says "(TR-2's purchase verb, +0 until TR-2 lands)" (EC:1901), but TR-2 LANDED on 09-24 (`c8c21a9f3`) with no such verb.
5. **There is no stop for a true-but-quiet threat.** The arms stop only when "the belief decays below the bar or the war opens" (EC:1770-1771, stop pin EC:1861-1862). The bars are readiness ≥ preparing and confidence ≥ fair (EC:1762-1763). A neighbour that really sits at `war_preparation` keeps readiness truth-anchored on every report (`beliefMap.js:628`), so confidence does not decay. The precautionary draw then runs FOREVER: a standing armed peace drains the kit with no counterforce and no `outcome`. That is the T5 ratchet in cold-war form (PLAUSIBLE, reasoned from the stop rule; no fixture covers it). The prophecy fence (R1) does not apply because EC-17 is dark in Phase F.
6. "silence decay (0.92/tick, ~8-tick half-life — SP-B's, unchanged)" (EC:1870) is the CORE map's `BELIEF_TUNING.SILENCE_DECAY` and it decays CONFIDENCE (`beliefMap.js:110-113`). The bar logic must name confidence as the decaying operand.
7. Collision: "`beliefMap.js` is 771/800 (TR §6 Q3)" (EC:1898) is stale. It is ≈781 at the tip (TR S41 already said 778).
8. The posture arm stamps an `expectation` pressure whose slots are "the believed readiness rung" and "the confidence rung {faint, fair, firm}" (EC:793-794) for a self-read with no belief (subject = itself, EC:1798-1800). The pressure's own schema mislabels a truth act as a belief. Also `fair` is both a confidence rung and a condition band in ONE sentence frame (§9).

**EC-17 THE COURT'S REMEDY**
9. **Arm 2 cannot run through `rungGap` without merging truth and belief.** See §4B: `scoreTradeDemand` computes `rungGap(ladder, mine[c], theirs[c])` on ONE ladder (`pactTriggers.js:206`). The own side is ALREADY truth (`scarcityGroundTruth`, `pactFormation.js:248`). Today's code therefore already composes an own-truth rung with a counterparty-belief rung arithmetically, and the docstring "BOTH ENDS ARE BELIEFS" (`pactTriggers.js:189`) is wrong. EC-17's claim "two inputs to one DECISION, never one band" (EC:1955) is false for this decider as built. It breaks EC-1's "the ONLY module that may name both ladders" (EC:818-819) unless `pactTriggers` is enumerated. CONFIRMED by read.
10. **Arm 3 has the sides of `resource_pressure` swapped.** EC says the own-side term "today … reads `perceivedScarcityOf`'s food-and-realm inputs" (EC:1966-1967). Code: `perceivedScarcityOf` is the FOE term and reads the foe's believed POPULATION trend (`demographicsWar.js:206-231, :302-307`). There is no per-good foe read, so "a hostile neighbour believed to have iron" (EC:2009) has no existing input. A per-actor own-side need also raises `gap = own01 − foe01` (`warReasons.js:518`) against EVERY neighbour uniformly. The chooser's `deploy` keeps its own `bestTargetId` (`settlementStrategy.js:782`). So "the duke marches on the Aldenmoor mines" (EC:2027-2028) is not derivable: an Evidence Law risk. CONFIRMED by read.
11. **Arm 3 opens a second commerce→war door** that J-TR-2 forbids (TRADE:1313-1315; code `subsystemRowsCompact.js:293` "runs ONE way through ONE door"). EC never names J-TR-2. The owner's "go on conquest" (E14) supports a supersession, but it must be recorded.
12. **`generosityKernel.js (+3)` lands on a file at ≈800/800** (EC:2061, :2067). That reds the 800 domain ceiling. No measured headroom, no leaf-first STOP. Measured ≈ (method in the header). EC measured `institutionLifecycle` at 800/800 (EC:1537) but not this file.
13. "the two war files gain ONE net-zero seam line each" (EC:2058) vs "`warReasons.js` (+1 seam), `settlementStrategy.js` (+1 seam)" (EC:2067-2068): the same file list says both net-zero and +1.
14. **Need streak vs the one dwell clock.** The need counts "held `dear`+ for ≥ NEED_STREAK (13) ticks (from `sinceTick`)" (EC:1926-1927). `sinceTick` is "the tick the band was entered" (EC:614), and EC-1 moves bands one rung per tick (EC:799-802). A record that goes dear→desperate→dear resets `sinceTick` at each crossing, so "dear+" streaks cannot come from it. EC-8 (EC:1548-1550) and EC-17 both rely on it. Either `sinceTick` must mean "entered the dear+ side" or a second clock is needed: a persistence-shape question.
15. **The prophecy fence leaks.** It excludes dearness "whose strongest pressures are the court's OWN expectation acts (`crown_draw`/`reserve_held`…)" (EC:1932-1934). It does not cover arm 3 (a house of this court buying a position), arm 4, or the case where the self-made pressure is second-strongest. A court's own houses can still talk it into a need (PLAUSIBLE).
16. **The overture fold (R5) rests on a link that does not exist.** "an overture is a pact's first step" (EC:1940-1941, :1958-1960). No pact module reads `tradeOverture` (§4B).
17. **E14 vs E15 on ally/glut.** The market-seeking arm needs "a pact `market_access` demand (the TR-5 catalog row)" (EC:1981-1982). Nothing produces commercial terms (§4A TR-5 PRODUCERS), so the glut arm's pact half is dead on arrival.

**EC-18 THE OPEN ROAD**
18. **The whitelist grows here, against TRADE §3 and EC-1.** "TR-3's Seam Three whitelist grows by this one composer, enumerated" (EC:2141-2142). The push reads the condition (origin glut) and SP-B (destination `scant`/`pinched`, EC:2085-2086), so it names both ladders. EC-1's pin forbids that anywhere but the translation leaf (EC:818-819, :836-838). TRADE says the whitelist is enumerated "HERE and only here" (TRADE:368).
19. **The actor grain is mislabelled.** "whose merchant faction's `merchantAppetite`" (EC:2080-2081) and J-EC-21 "the actor … is the origin's merchant faction" (EC:2669-2670). `merchantAppetite` is a per-ORIGIN-SETTLEMENT scalar (`dispatchEV.js:47, :259`). For an origin with no merchant faction the actor is undefined.
20. **The push lags its own trigger.** It fires on a record that "reads `glut`" (EC:2080). Bands move one rung per tick toward target (EC:799-802). After the warehouse drops below cap the record still reads `glut` for ticks, so pushes continue on a stale band. The "one-per-tick" pin (EC:2154) does not bound this (PLAUSIBLE).
21. **The contract fence names things that cannot be pushed anyway.** "pact streams (TR-4/TR-5), treaty tribute" (EC:2120-2121) are GRAIN, and M6a excludes food (EC S29). The fence is honest but partly vacuous. "any link a DM pinned by verb … the DM pins a link by the existing verbs" (EC:2125, :2187): no link-pin verb is named or verified (PLAUSIBLE absent).
22. **R2 has no substrate for the market memory** it adds to the push: see §4B (there is no per-observer, multi-year news store).

**§18 REFINEMENTS**
23. **R7's loop envelope is vacuous by construction.** Phase F lights EC-1/2/3/4 + EC-16 crown arm + EC-10, and keeps EC-17 DARK (EC:2918-2924). Its first envelope is "the share of wars whose resource_pressure casus traces to a need born of the court's OWN expectation draw must be ZERO" (EC:2925-2928). With EC-17 dark no need ever reaches `resource_pressure`, so the envelope is an honest permanent zero that proves nothing. That is the vacuous-pin class TRADE §1c names (TRADE:147-148). The prophecy fence is untested at the first soak.
24. **R7's "authored arm mask"** (EC:2921-2922) is a new configuration surface on a one-key flag, never specified: is it a tuning row, a rule key, or a persisted shape? It is a FLAG-SHAPE change under §4's law-2 shape (EC:545-553).
25. **R3 contradicts EC-3.** "provisions before the marching season … applied to the household link's target (EC-3)" (EC:2969). `provisions` is food, NON_SHIPPED (EC:1123-1126), and EC-3 pins "no food-category good gets a household link while EC-12 is dark" (EC:1066-1067). "marching season" is not a seasons.js term. A `season_draw` on the `provisions` record also adds a second seasonal food signal beside the granary's own seasonal swing (`seasons.js:123-129`) on the very record that carries the granary band (EC:761-764). This sits against T7's one-food-arm spirit (PLAUSIBLE double count).
26. **R2 contradicts its own "no state" claim** once the push reads it in the engine: "None of R1–R7 adds a persisted key, a kernel line, or a decider" (EC:2974). R2 also changes TR-2 credibility writes ("loses `credibility`", EC:2968), which is a writer-input change to a landed module.
27. **R1's new TR-1 pair `false_alarm ↔ fair_warning`** (EC:2966) is a commercial-reason amendment for a grievance about a WAR rumour. Under J-TR-2 that is war material entering the commerce taxonomy. Recorded, not minted, so it is an owner/chair row.

### 5B. Elsewhere in EC
28. PRESSURE_KINDS count: "closed, 27" (EC:618), "27 phrase rows" (EC:913), "27 pressure kinds" (EC:2886) vs "CLOSED at 29" (EC:783). The list at EC:787-793 counts 29. OD-EC-15 RULED two MORE kinds, `labor_short`/`transport_short` (EC:2704), and OD-EC-17 a reserved `credit_tight` slot (EC:2706). Neither is in the closed list ("a 30th is a volume amendment", EC:786). The rulings have no landing in the vocabulary.
29. `sinceTick` regen: "NOT lossy" (§5 table EC:665; skeptic #22 EC:2752) vs "`sinceTick` lossy on regen" (EC:864) and "the lossy `sinceTick` is receipted once" (EC:2561-2562).
30. MOVEMENTS: "stays FIVE" (EC:879; J-EC-2 EC:2596) vs "five today, six under EC-1" (EC:2345).
31. "the ONE TR flag with a gate read: `houseLedger.js:173`" (EC:573; skeptic #55 EC:2797) vs EC-2 "two existing flags" (EC:930), and code: three TR flags gated (`commercialReasons.js:133`, `tradeWar.js:335`, `dispatchDestination.js:93`, `houseLedger.js:173`), all three in `ENGINE_GATED_VIRTUAL_RULE_KEYS`.
32. E4 "food is … never a commodity unit" (EC:170-171) vs EC-12 "grain rows in the M6a balance" (EC:1727).
33. EC-5: upstream draw is "a household-class effect, never a crown draw" (EC:1239-1241; skeptic #26) vs matrix M1/M2/M4 "the crown's upstream draw also falls on iron and `fuel`" (EC:2212-2215) and M28 "the crown's upstream draw competes" (EC:2260).
34. EC-6: "`flows.js` condition cascade is NOT re-weighted … struck" (EC:1325-1327) vs M19 "In an aspatial world the cascade channel is halved" (EC:2245).
35. EC-6 slice 3 "never a second mint, never coin per caravan" (EC:1337-1339) vs M21 "a typed `tariff` row credits the taxing seat" (EC:2247) and M45 "Only EC-6's `tariff` rows move coin" (EC:2284).
36. EC-8 monopoly "processor COUNT alone, no grade requirement" (EC:1592; skeptic #36) vs M37 "a category's ONLY processor, at `fine`" (EC:2274).
37. EC-13 seizure "a TRANSFER into the HOUSEHOLD class … never a crown draw" (EC:1734-1738; skeptic #43) vs M37 "The commons' warehouse seizure is a crown-class claimant (EC-13)" (EC:2274).
38. EC-8 close pick "by `vulnerability` … 'newest first' is struck" (EC:1569-1570) vs M39 "EC-8 contracts the newest processor" (EC:2276).
39. M20's FLAG ("§6 does not say which yields", EC:2246) is stale: EC-6's "ONE SOURCE PER CAUSE" resolves it (EC:1328-1331). M48's FLAG (EC:2289) is likewise cured at EC:747-751.
40. M7 "Provisions sell at several times their usual price" (EC:2223) and §15 "several times its usual price is the ceiling of specificity" (EC:2835-2836) vs the five ruled phrases ("triple or more", EC:879-884). "several times" is not a phrase of the enum.
41. Wave count: "twelve EC waves" (EC:85) vs "eleven EC waves" (EC:2887) vs the volume's fourteen (EC-0…EC-10 + EC-16/17/18).
42. EC-6 header "slice 1 buildable today" (EC:1291) vs §4 "slice 1 … `requiresLandedWork('EC-2')` + EC-1" (EC:567).
43. EC-2 says "`marketNews.js`'s already-written kind mints" (EC:942). E2 says the Why panel shows "fair here; dear in Aldenmoor, they say" (EC:161-162) and EC-1 "dear in Aldenmoor, they say" (EC:870-871). `dear` is a CONDITION word, and believed bands are SP-B's {scant…plentiful}. No inverse map belief→condition words is defined, so the "they say" line would render a truth-ladder word for a belief. That is the very homonym J-EC-17 exists to prevent.

### 5C. Inside TR / TRADE
44. TR §2 "a certification row **or a DECLARED-PENDING entry** … (see Q4: pending at the wave)" (TR:121-124) and Q4 (TR:616-620) vs TR S38 "the 'declared-pending entry' door is STRUCK" (TR:99-101).
45. beliefMap headroom: TR S41 "778/800" (TR:103) vs TR-3 "771/800" (TR:283) and Q3/seam 6 "771/800" (TR:566, :611).
46. peaceTerms: TR-5 "766/800" (TR:368) vs S20/discharge "797/800" (TR:68, :391). Code ≈799 (EC agrees, EC:290).
47. Trade-rights row addresses: TR "`peaceTermsCatalog.js:285-287`" (TR:375) vs EC "`:306-308`" (EC:1313) vs code `:306-308`.
48. TRADE TR-5 body still says `trade_exclusivity` (TRADE:856), and §2 keeps the old spelling "so the divergence stays findable" (TRADE:226-229). That is honest, but the TR-5 body was never bracketed.
49. TRADE T3 cites "`applyWorldPulse.js:322`" (TRADE:77) vs TR S15 "`applyWorldPulse.js:92-110` … claim said :322, REFUTED ADDRESS" (TR:50).
50. TRADE §2 "lit only in full_simulation (simulationRules.js:424)" (TRADE:201) vs EC S28 "lit in `realistic_regional` and `full_simulation`" (EC:396).

---

## 6. STALE PREMISES (substrate claims vs `00b648c9d`; ≥10 load-bearing spot-checks)

| # | Claim (line) | Live receipt | Verdict |
|---|---|---|---|
| 1 | TR/TRADE headers "Nothing here is scheduled" (TR:13; TRADE:13) | TR-1 `d7ea69a4b`, TR-9c `c7933e845`, TR-2 `c8c21a9f3`, TR-3 `0fd6b9209` | STALE |
| 2 | EC "the ONE TR flag with a gate read" (EC:573) | four gate reads across three flags (§5B-31) | REFUTED |
| 3 | EC "ONE TRUTH DOOR `axisGroundTruth`" (EC:811) | `pactFormation.js:248` direct `scarcityGroundTruth` | REFUTED |
| 4 | EC-17 "`perceivedScarcityOf` … own-side" (EC:1963-1967) | `demographicsWar.js:302-307` (foe side) | REFUTED |
| 5 | EC-16 "activation gate … verify its key" / aspatial founding arm (EC:571) | `beliefMap.js:204-209` (marker + infoMode, no key; dormant aspatially) | REFUTED |
| 6 | Certification "declared-pending" (EC:550, :927-928, :1709; TR:121) | `subsystemRowsVirtual.js:889-897` `VIRTUAL_PENDING_RULE_KEYS = []`, shrink-only | REFUTED (the door is struck) |
| 7 | EC-17 `generosityKernel.js (+3)` (EC:2061) | ≈800 effective (calibrated counter) | REFUTED (no headroom; STOP) |
| 8 | EC-16 `beliefMap.js` 771/800 (EC:1898) | ≈781; raw 1602 | STALE |
| 9 | EC-6 "two further GR-3 commercial rows `tradeConvergenceContract.js:334-337` expects" (EC:1317-1319) | that line says "GR-3's five commercial TERM_CATALOG rows" (stale code comment); catalog has three (`peaceTermsCatalog.js:306-308`); GRAMMAR:461 three | STALE (in both code comment and EC) |
| 10 | History "newsLog … per-reach" (EC:653, :2412, :2968) | no `newsLog` in src; store-side `wizardNews` MAX 240 world-wide (`wizardNews.js:21`) | REFUTED |
| 11 | EC-17 overture = pact's first step (EC:1958-1960) | no pact module reads `tradeOverture` | REFUTED (PLAUSIBLE by grep) |
| 12 | TR-5 "THE DEAD CONSUMER LANDS" (TRADE:866-870) still the plan | `realmPressure01` consumers: warReasons/demographics only | STALE (nobody owns it now) |
| 13 | `commercialReasonTaxonomy.js:23` "Four of the eight pairs read live state today" (code comment) | `commercialReasons.js:43, :58-61` "Five of the eight … do not exist … Three pairs read LIVE" | CODE-INTERNAL STALE COMMENT (report to the TR-1 owner) |
| 14 | EC S28 commodity lit presets (EC:396) | verified by EC; confirms TRADE:201 is stale (`full_simulation` only) | AGREES with EC; TRADE STALE |
| 15 | EC frozen kernel 1581 (EC:286-287) | `scripts/.size-baseline.json` `"pulseKernel.js": 1581` | AGREES |
| 16 | EC settlementStrategy +1 seam headroom (implicit) | ≈763; baseline entry DELETED at 760 (`.size-baseline.json` `_te_ceil_settlement_strategy`) | AGREES (headroom 37) |
| 17 | EC-3/6/18 seam budgets on `commodityFlow.js` (+12/+4/+8) and `supplyKernel.js` (+8/+6/+4/+3/+6) | ≈474 / 489 → ≈498 / ≈516 | AGREES |
| 18 | Iron criticality 0.72, bar 0.5 (M60) | `goodsCatalog.js:104-108` | AGREES |
| 19 | §731.1 coin reversal overturns T2 (EC:44, S45) | `treasury.js` present, TAX_FORMS :269-272 | AGREES (TRADE T2 STALE) |
| 20 | FP-ORDER pair 2 lighting (FP-ORDER:5) vs OD-EC-1/4 | — | STALE FP-ORDER |

---
## 7. THE CLOCK AND THE TIER

Tier: **A** = runs aspatially · **S** = needs spatial canon + `commodityFlowEnabled` (lit only in `realistic_regional`/`full_simulation`, ABSENT from the birth door, EC:310-315) · **B** = needs live beliefs (spatial marker ∧ infoMode ≠ omniscient, `beliefMap.js:204-209`, which is also spatial-only).
⏳ = the felt drama lives at the seasonal or yearly clock (a DM advancing a few weeks between sessions will rarely see it).

| Mechanism | Cadence / dwell | Tier | ⏳ |
|---|---|---|---|
| EC-1 condition (structural arm) | weekly, one rung/tick | A | |
| EC-1 condition (physical arm) | weekly | S | |
| EC-2 receipts / Why panel | per render | A | |
| EC-3 ladder draws / starve dwell 2 (fragile 4) | weekly | S | |
| EC-3 reserve notch | 13 ticks | S | ⏳ |
| EC-4 procurement | weekly; postwar glut by +6 | S | |
| EC-5 propagation | one hop/tick | A (structural) / S | |
| EC-6 stance | weekly; treaty terms on 52-week years | A (buyer pressures) / S (caravans) | |
| EC-7 grade mismatch | weekly | A | |
| EC-8 build 13 / close 26 / envelope 26 / monopoly 52 | seasonal–yearly | A | ⏳⏳ |
| EC-9 counterfactual | on click, h ≤ 13 | A | |
| EC-16 crown/reserve/house arms | weekly re-read; memory 13 | S+B | (reserve ⏳) |
| EC-16 founding arm | 13 + lifecycle clock + 26 to close | **B (NOT A, contrary to EC:571)** | ⏳⏳ |
| EC-16 posture arm | weekly, `slight`, band unmoved | A | |
| EC-17 need | ≥13 ticks dear (26 glut) then each decider's clock | A (need) / mixed (arms) | ⏳⏳ by definition ("the need is a season by definition", EC:2028) |
| EC-18 push | weekly; arrivals on route weeks | S+B (pull) | |
| TR-1 reasons | per-tick accrual; the "nine years" record | A | ⏳⏳ (T-7) |
| TR-2 house books | weekly acts; season-grade dwell | A | ⏳ |
| TR-3 believed markets | weekly rumour; seasonal conviction | S+B | |
| TR-4 grain road | weekly wagons; seasonal storageMonths verdict | S | ⏳ |
| TR-5 pacts | annual installments | A | ⏳⏳ |
| TR-6 corner | weekly buys; seasonal hold; MONOPOLY_DWELL seasons | S+B | ⏳ |
| TR-7 ventures / TR-8 factor | weekly legs; a season's circuit | S | ⏳ |

Flagged: EC-8, EC-16's founding arm, EC-17 as a whole, TR-1's honoured record, TR-5 and TR-6's hold/monopoly. Their felt drama arrives a season or more after its cause. The court's remedy (EC-17) is the owner's own example, and by construction it cannot fire until 13 weekly ticks of `dear`. The between-session DM sees it only if advances are coarse. The Herald/pacing line must carry the "a year of dear iron" sentence at the moment of crossing, or the DM never connects cause and effect.

---

## 8. DEPTH VS FELT VALUE

| Mechanism | What a DM sees | Judgment |
|---|---|---|
| EC-0 cures | an honest crier line ("of late"), true headers | KEEP (cheap, honest) |
| EC-1 condition + pressures | "Grain is dear in Mossgate: the road is cut at Harrow…" in every world | KEEP (the flagship; highest felt value) |
| EC-2 Why panel + TR-1/TR-3 mounts | "why is grain dear?" answered from a record | KEEP |
| EC-3 ladder | "the wool road took what the weavers wanted"; the single-sourced town that starves | KEEP (it cures S33's inversion) |
| EC-4 procurement | "the march took the last of Cnocby's arms" | KEEP |
| EC-5 propagation | "provisions dear because flour is, because…" | KEEP (cheap band arithmetic) |
| EC-6 stances | embargo that bites; tariffs as route cost | KEEP slices 1–2; DEFER slice 3 (coin) until W-COIN lights |
| EC-7 grades | "the court wants what the smithy cannot make" | FOLD into EC-1 as one pressure kind plus the class table. The profile machinery is heavy for a demand-side sentence |
| EC-8 slow verdicts | a second mill after a year | KEEP the build/close; CUT-TO-SENTENCE the grade envelope (26-tick clamp-at-read for one word) |
| EC-9 counterfactual | "what if the war ends?" on click | DEFER (right, but h pulses per click on a frozen pulse; after the first soak) |
| EC-10 instrumentation | nothing (auditor) | KEEP the contract; restore TR-9's dropped instruments or drop them by ruling |
| EC-16 crown arm | "the duke believes Aldenmoor is arming" | KEEP the sentence. CUT the "foresight rewarded" claim until an armoury holding exists (§5A-1). The other arms stay DEFER (already masked in Phase F) |
| EC-16 house position | the house ruined by a peace | FOLD into TR-6 (it IS a sub-corner) |
| EC-16 posture arm | "the duke musters; arms are wanted" aspatially | KEEP (the only aspatial expectation sentence) |
| EC-17 remedy | envoys for iron; a march for ore | KEEP arm 1 (expand) and arm 2 (partner) after the rungGap fix. DEFER arm 3 (conquest) until the war program rules the second door (J-TR-2) and a per-good foe read exists |
| EC-17 glut arm | "Cnocby's factors seek a market beyond the pass" | DEFER (needs a commercial-term producer nobody owns) |
| EC-18 push | uncontracted iron goes up the Harrow road | KEEP arm 1. Arm 2 is already conditional (car 0); arm 3 is CUT-TO-SENTENCE (it is a description, not a mechanism) |
| §18 R2 market memory | "often dear, they say" | DEFER (no substrate) |
| §18 R3 seasonal draw | fuel dear as winter closes | KEEP for non-food categories; CUT the `provisions` row |
| §18 R4 contract visible | "under contract — the tribute" | KEEP |
| TR-1 reasons | typed grievance per pair | KEEP (built; mount it) |
| TR-2 house | named merchant houses with books | KEEP (built; mount it) |
| TR-3 believed markets | the wrong-market tragedy | KEEP (built; forward the evidence) |
| TR-4 grain road | "no wagon has come up the river road in a season" | KEEP (SPINE crux), on WY-3 |
| TR-5 pacts' trade half | "a grain compact… honored, third year of ten" | KEEP, but it NEEDS AN OWNER (§11) |
| TR-6 corner | "House Verren holds the grain, and the bread knows it" | KEEP (crown drama), on a re-stated holder model |
| TR-7 ventures | "The sea took the Verren fortune" | KEEP |
| TR-8 factor | "Factor Maren rode … with one price in her head" | KEEP. FOLD fair-circuit belief writes into TR-3's arrivals |

---

## 9. VOCABULARY (closed ladders/enums minted or adopted)

| Name | Values | Line | Homonym risk |
|---|---|---|---|
| CONDITION_BANDS | glut · soft · fair · dear · desperate | EC:149 | = TRADE T1's `SCARCITY_BANDS` words (TRADE:58), re-assigned to the truth side |
| SCARCITY_BANDS (TRADE) | glut … desperate (5) | TRADE:58 | ⚠ SAME NAME as SP-B's 4-rung `SCARCITY_BANDS` (`beliefAxisSubjects.js:85`). Two ladders, one identifier |
| SCARCITY_BANDS (SP-B) | scant · pinched · sufficient · plentiful | EC:158 | see above |
| PRESSURE_KINDS | 29 listed (EC:787-793) + ruled `labor_short`, `transport_short`, reserved `credit_tight` | EC:783 | count drift 27/29/32 |
| pressure magnitude | slight · marked · severe | EC:618 | ⚠ `marked`/`severe` reused as EC-17's shortfall rung (EC:1927) |
| arm | structural · physical | EC:622 | |
| reserve band | none · tithe · prudent · hoard | EC:631, EC:1006 | "tithe" collides with FAITH's tithe |
| claimant classes | household · crown · road (+ reserve pre-deduction) | EC:1009-1015 | E5 still says four "{household, crown, road, reserve}" (EC:179) |
| STANCES | open · taxed · restricted · closed | EC:1295 | "closed" also a TRADE ending context; M19 uses "closed" as a band (EC:2245) |
| tariffBand | none · light · heavy | EC:1309 | |
| GRADES | rough · common · fine | EC:190, :1431 | |
| procurement classes | levy · guard · court | EC:1131 | |
| competition | sole · few · many | EC:1587 | |
| expectation actor | crown · seat · house · founder | EC:792 | |
| readiness rung | alert · preparing · mobilized | EC:794 | code spells `war_preparation` (`beliefMap.js:164`) |
| confidence rung | faint · fair · firm | EC:794 | ⚠ `fair` = a condition band; both can occur in one `expectation` sentence |
| outcome | borne_out · unfounded | EC:795 | |
| capacity reading | none · thin · adequate | EC:1927-1929 | |
| contract kinds | exclusivity · pact_stream · tribute · must_go · household · dm_pinned | EC:2115-2116 | `exclusivity` = the TERM_CATALOG row |
| market memory | unremembered · sometimes dear · often dear · dear as long as anyone remembers | EC:2968 | uses CONDITION words for a BELIEF read (the J-EC-17 homonym again) |
| fineShare | none · little · some · most | EC:2687 | |
| COUNTERFACTUAL_OPS | end_war · repair_route · lift_blockade · end_embargo · close_mine · open_import · set_reserve | EC:1644-1646 | |
| MOVEMENTS phrases | a third under · a shade under · its usual price · nearly double · triple or more | EC:879-884 | "five" vs "six" (§5B-30) |
| SEVERANCE/PARTNERSHIP | 8+8 (code `commercialReasonTaxonomy.js:46-67`) | TRADE:466-479 | EC invents `supply_withheld`, `toll_war`, `market_closed`; `toll_war` is ALSO a live key in `supplyWebWarfare.js:211` |
| House acts | sponsor_caravan · take_route_interest · extend_credit · corner_attempt · venture_stake · petition_pact · relief_grant | TRADE:539-546 | EC-16 adds an unlisted "position" |
| House interests | route · market · stock · venture | TRADE:392-393 | |
| Venture kinds / states | far_market · new_route · joint_venture / proposed · underway · completed · failed · abandoned | TRADE:1105-1109, :404-405 | |
| TRADE_ENDING_KEYS | fortune · ruin · monopoly · collapse · severance · cornered | TRADE:16 | `monopoly`/`severance` DEFINITIONS diverge (EC-8, EC-6) |
| Factor errand kinds | pact proposal/renewal · venture supercargo · fair circuit | TRADE:1166-1173 | |
| M6d tally | shortage · adequate · surplus | EC:770 | `adequate`/`surplus` in five ladders (EC S22) |
| **"TR-2b"** | TRADE: the covert syndicate (TRADE:633) · FP-ORDER:5: "TR-2b (the mount + the house kinds)" | — | ⚠ ONE ID, TWO UNITS |
| **"T10" / "T8"** | TRADE laws T10 (two-timescale) / T8 (belief discipline) · EC S19 "the TRAIN T10 product-surface car" (EC:382) · EC "T8's next signed shift window" (EC:2691, :2559) | — | ⚠ "T8" in OD-EC-8 and §11a names a shift WINDOW, not the belief law |

---
## 10. REFINEMENTS (in place, dated-bracket idiom; never rewrite a law)

1. `[EC:573]` — "existing (the ONE TR flag with a gate read: `houseLedger.js:173`)" → `[CORRECTED 2026-10-16 (coherence fold) — THREE TR flags carry gate reads and sit in ENGINE_GATED_VIRTUAL_RULE_KEYS: casusCommercii (commercialReasons.js:133 + tradeWar.js:335), believedMarkets (dispatchDestination.js:93), merchantHouses (houseLedger.js:173). Skeptic #55's cure is itself refuted.]` — code read.
2. `[EC:550, :927-928, :1709]` — "a certification row or DECLARED-PENDING entry" → `[CORRECTED 2026-10-16 (coherence fold) — the virtual pending door is STRUCK (VIRTUAL_PENDING_RULE_KEYS = [], shrink-only, subsystemRowsVirtual.js:889-897; TR S38). Every EC flag lands its AUTHORED certification row in the same commit as its first gate read. EC-10 converts nothing.]` Mirror the bracket at TR:121-124 and TR Q4 (TR:616-620).
3. `[EC:811]` — "the ONE TRUTH DOOR `axisGroundTruth`" → `[CORRECTED 2026-10-16 (coherence fold) — a SECOND scarcity truth read exists: pactFormation.js:248 calls scarcityGroundTruth directly. EC-1's lit fork must cover both, or the pact trigger's self-read stays generation-frozen while beliefs move (split-brain).]`
4. `[EC:1955]` (EC-17 arm 2) — "Seam Three held (two inputs to one DECISION, never one band)" → `[CORRECTED 2026-10-16 (coherence fold) — scoreTradeDemand is rungGap(ladder, own, counterpart) on ONE ladder (pactTriggers.js:206). The own side is already truth (pactFormation.js:248). A condition rung cannot enter it without translation, and after translation it IS an arithmetic truth–belief combination. Either enumerate pactTriggers in Seam Three's whitelist by TRADE amendment, or redesign the own-side read as a gate, not an operand.]`
5. `[EC:1963-1967]` (EC-17 arm 3) — "today it reads `perceivedScarcityOf`'s food-and-realm inputs" → `[CORRECTED 2026-10-16 (coherence fold) — perceivedScarcityOf is the FOE term (demographicsWar.js:302-307) and reads the foe's believed population trend, not goods. The own side is foldDemographicMotive (truth). No per-good foe read exists, so the arm needs a NEW foe-side read, and an own-side need raises resource_pressure toward EVERY neighbour equally.]` Also beside it: `[J-TR-2 SUPERSEDED IN PART by E14, pending the owner's word — commerce gains a second road to war]`.
6. `[EC:2061, :2067]` — "`generosityKernel.js` (+3)" → `[CORRECTED 2026-10-16 (coherence fold) — generosityKernel.js measures ≈800/800 effective. +3 reds the domain ceiling: leaf-first or STOP, as EC-8 car 0 does for institutionLifecycle.]`
7. `[EC:571]` (EC-16 row, "Aspatial arm? YES (the posture arm + the founding arm)") → `[CORRECTED 2026-10-16 (coherence fold) — beliefsActive is spatialCanonVersion>0 ∧ infoMode≠omniscient (beliefMap.js:204-209), with no rule key. Aspatially the founding arm is EMPTY (or reads truth through belief()'s identity fallback, which the observer-only pin must forbid). Only the posture arm is aspatial.]`
8. `[EC:1771-1773, :1811-1812; M59 EC:2301; §10b EC:2519]` — "one rung LOWER … foresight is rewarded" → `[CORRECTED 2026-10-16 (coherence fold) — crown draws are `consumed` (E5) and nothing holds an armoury, so under the written physics the believer meets war DEARER and with lower procuredQuality. Re-state the tellable as "paid early, gained the second smithy" (EC-8 arm), or name an armoury holding as a NEW persisted shape (owner row).]`
9. `[EC:1768]` — "draw … BEFORE its own readiness rises" → `[AMENDED 2026-10-16 (coherence fold) — this arm EXEMPTS EC-4's "no draw without a deployment or readiness rise" (EC:1153) and its mutant (EC:1197). EC-4's pin gains the explicit expectation carve-out, or the arm reds it.]`
10. `[EC:1042, :1080, :1189, :1345, :1347, :2039; M1/M21/M22/M41/M42/M58]` — `supply_withheld` / `toll_war` / `market_closed` → `[CORRECTED 2026-10-16 (coherence fold) — no such TR-1 types exist (commercialReasonTaxonomy.js:46-67). Read `toll_war`→`toll_extortion` and `market_closed`→`market_exclusion`. `supply_withheld` has NO home: either map it to an existing pair (dependency_fear?) or record a registration-first taxonomy amendment beside R1's false_alarm pair.]`
11. `[EC:1589-1595]` (EC-8 monopoly) → `[AMENDED 2026-10-16 (coherence fold) — this RE-DEFINES an owner-settled ending's evidence: TR-9 bound monopoly to a HOUSE's independent-census share past MONOPOLY_DWELL with ENTRY as counterforce (TRADE:1238-1243, :1003-1014). The processor-count reading has no entry counterforce (it requires entry be impossible), which is T5's ratchet. Record it as a definition change for the owner, or keep TR-6's definition and use processor count only as a Why-panel read.]`
12. `[EC:1318-1319]` — "remain GRAMMAR's … EC owes neither" → `[CORRECTED 2026-10-16 (coherence fold) — GRAMMAR's canonical commercial family is THREE rows (DESIGN_FP_GRAMMAR.md:461) and GR says "TR-5 lands executors + producers" (DESIGN_FP_ARCH_GR.md:536-537). grain_provision and route_wardenship, and every commercial-term PRODUCER, are owned by nobody. Owner row.]` Mirror at TRADE:858-862 and at the code comment `tradeConvergenceContract.js:334-337` ("five").
13. `[EC:1716-1746]` (EC-11…15 header) → add `[AMENDED 2026-10-16 (coherence fold) — TR-5's realmPressure01 trade consumer ("THE DEAD CONSUMER LANDS", TRADE:866-870; T-5) and TR-9's Herald debt (route_* WHAT_PHRASES + T-11 totality), tickScanBudget lanes, house-Gini, corner and pact-mix envelopes, deciding-component histogram and trend envelope (TRADE:1252-1272) are NOT carried by EC-6/EC-10. Each needs a slot or a CLOSED-with-reason (the never-deferred law).]`
14. `[EC:2640-2642]` (J-EC-15) — "TR-4 any time after EC-3" → `[CORRECTED 2026-10-16 (coherence fold) — the fold and FP-ORDER order TR-4 AFTER WY-3 (the caravan body and the commodity round-trip pin, ARCHITECTURE.md:1613-1628; FP-ORDER:5).]`
15. `[EC:2925-2928]` (Phase F loop envelope) → `[CORRECTED 2026-10-16 (coherence fold) — with EC-17 dark this share is structurally zero (vacuous). Either light EC-17's need read (no arms) in Phase F, or replace the envelope with one the lit set can move (e.g. the precautionary-draw share of crown draws).]`
16. `[EC:2969]` (R3) — "provisions before the marching season … household link's target (EC-3)" → `[CORRECTED 2026-10-16 (coherence fold) — provisions is food/NON_SHIPPED and EC-3's no-food pin forbids its household link. Strike the provisions row or make it a structural pressure only, and name it against the granary's own seasonal swing (T7). "marching season" is not a seasons.js term.]`
17. `[EC:653, :2412, :2968]` — "newsLog … per-reach" → `[CORRECTED 2026-10-16 (coherence fold) — there is no newsLog. News lands in the store-side wizardNews feed (MAX 240 world-wide, wizardNews.js:21) and pulseHistory (80). Neither is per-observer or multi-year. R2 needs a substrate (owner-gated persistence) or stays display-only over pulseHistory.]`
18. `[EC:618, :913, :2886]` — "27" → `[CORRECTED 2026-10-16 (coherence fold) — 29 (EC:783). OD-EC-15/17 add labor_short, transport_short and credit_tight, so the closed list needs a volume amendment naming 30–32.]`
19. `[EC:665]` vs `[EC:864, :2561]` — pick one: `[CORRECTED 2026-10-16 (coherence fold) — sinceTick IS carried where the band is unchanged (NOT lossy, per the §5 table); EC:864 and §11a are struck.]` Also beside EC:614: `[the dear+ streak (EC-8/EC-17) needs a "side-entered" tick, not a band-entered tick]`.
20. `[EC:2345]` — "five today, six under EC-1" → `[CORRECTED 2026-10-16 (coherence fold) — FIVE (J-EC-2, EC:879).]`
21. Matrix stale cells `[EC:2212-2215, :2260]` (crown upstream draw), `[EC:2245]` (cascade halved), `[EC:2247, :2284]` (typed tariff row), `[EC:2274]` (monopoly at fine; seizure crown-class), `[EC:2276]` (newest processor), `[EC:2223]` ("several times"), `[EC:2246, :2289]` (resolved FLAGs) → one bracket each pointing at the §6 text that supersedes it.
22. `[EC:170-171]` — "food is … never a commodity unit" → `[CORRECTED 2026-10-16 (coherence fold) — except grain under EC-12/TR-4, whose integer units ride the M6a balance (EC:1727); the T7 one-arm walker is the fence, not the denomination.]`
23. `[EC:161-162, :870-871]` — "dear in Aldenmoor, they say" → `[AMENDED 2026-10-16 (coherence fold) — a believed band renders in SP-B's words ("pinched in Aldenmoor, they say") or through a NAMED belief→phrase table enumerated beside conditionToScarcityTruth. A condition word on a belief is the J-EC-17 homonym.]`
24. `[EC:2083, :2669-2670]` — "merchant faction's merchantAppetite" → `[CORRECTED 2026-10-16 (coherence fold) — merchantAppetite is per-ORIGIN SETTLEMENT (dispatchEV.js:47, :259). The faction is the receipt's voice, not the scalar's owner.]`
25. `[SPINE:91-93]` (§1.14 a) — "operationRegistry-registered" → `[CORRECTED 2026-10-16 (coherence fold) — operationRegistry is a manifest with no action lane. DM verbs ride realmManifest + realmVerbExecution (EC-3/EC-6, measured).]`
26. `[TR:13-14; TRADE:13-18]` headers → `[CORRECTED 2026-10-16 (coherence fold) — TR-1 (d7ea69a4b) and TR-9c (c7933e845) landed 08-04, TR-2 (c8c21a9f3) and TR-3 (0fd6b9209) landed 09-24, all DARK and UNMOUNTED; the compiled layer is now DESIGN_FP_ARCH_EC.md (OD-EC-1 ABSORB).]`
27. `[FP-ORDER:5]` (pair 2) → `[AMENDED 2026-10-16 — pair 2's trade half is superseded by DESIGN_FP_ARCH_EC.md §17 (OD-EC-1/-4): no TR flag lights before EC's Phase E. "TR-2b" here = the TR-2 mount + house kinds, NOT TRADE's syndicate TR-2b.]`
28. `[EC:1898]` and `[TR:283, :566, :611]` — "771/800" → `[CORRECTED 2026-10-16 — beliefMap ≈781/800 at 00b648c9d.]`
29. `[EC:2058]` vs `[EC:2067-2068]` → one figure (+1 each; settlementStrategy ≈763 has headroom; warReasons ≈515).
30. `[EC:1781]` (EC-16 arm 3) → `[AMENDED 2026-10-16 (coherence fold) — a "position" is an act outside TR-2's CLOSED verb set (TRADE:539-546) and needs a holder M6a lacks (EC:1736). Name it a TR-2 verb amendment, or fold it into TR-6's corner_attempt below the corner band.]`

---

## 11. OPEN QUESTIONS FOR THE OWNER (only what is his)

1. **Who owns TR-5's trade half?** That covers grain_provision and route_wardenship (the standing food-export quantity), the producers that draft commercial terms into pacts, and the realmPressure01 "buy the grain before you bleed for it" consumer. EC assigns them to GRAMMAR, and GRAMMAR assigns them to TR-5. Today nobody builds them. (A new-capability vs repair call, and a re-sequencing of a program you sequenced.)
2. **Does E14's "go on conquest" supersede J-TR-2's "ONE door" law** (commerce reaches war only through tradeWar's intent deposit)? If yes, it needs recording. The conquest arm also needs a NEW per-good foe-side read in the war program, which is a war-chair surface.
3. **Monopoly's definition.** It is an owner-settled ending. Is EC-8's processor-count, entry-impossible reading the ending, or is TR-6's house share with an entry counterforce the ending?
4. **The armoury.** Should a believed war leave a HELD stock (a new persisted shape) so that foresight can be rewarded as EC-16 promises? Or is the honest model "paid early, gained a second smithy"?
5. **R2's market memory** needs a per-observer, multi-year news substrate that does not exist. Should one be built (a persistence shape), or should it be display-only over the 80-entry pulseHistory?
6. **Phase F's loop envelope** is vacuous while EC-17 is dark. Should EC-17's need read (no arms) be lit at the first soak?
7. **FP-ORDER pair 2.** Confirm that EC's Phase A–F order (OD-EC-1/4) replaces pair 2's trade half and its lighting line. Also confirm TR-4's place after WY-3 (the fold) versus "any time after EC-3" (J-EC-15).
8. **EC-6 slice 3 / OD-EC-6 coin arm.** It rests on the treasury mint accepting an external input, which is unverified. It is already a STOP; noted only because W-COIN is your program.
