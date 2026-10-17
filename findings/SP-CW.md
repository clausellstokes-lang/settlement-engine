# FINDINGS — SP-CW: THE SPINE AND THE COUPLINGS
Reader seat, FP coherence read, 2026-10-16 (chair session 2fc13d59). Family files, read WHOLE, every line: `volumes/DESIGN_FP_SPINE.md` (1–1095), `volumes/DESIGN_FP_ARCH_SP.md` (1–952), `volumes/DESIGN_FP_COUPLINGS.md` (1–1955), `volumes/DESIGN_FP_ARCH_CW.md` (1–625). Fold sections read: `DESIGN_FP_ARCHITECTURE.md` header (1–38), PHASE 0/1 (912–1053), PHASE 8 (2239–2305). Code of record: `master-00b648c9d` (static reads; one `node -e` import of `peaceTermsCatalog.js` to count the catalog; read-only `git log` in that detached copy to date first commits; one `git show`/`wc` of the ledger branch to identify which copy the kit holds — no test, no edit, no ref moved).

Evidence classes: **CONFIRMED** = read in a file or the code at the cited line; **PLAUSIBLE** = my reasoning over reads. Volume receipts are `FILE:line` in the KIT copies.

> ⚠ **PROVENANCE OF THE KIT COPIES (read this first).** The kit's `volumes/` are the LEDGER-branch versions, not master's. CONFIRMED by line counts and `cmp`: kit SPINE 1095 = ledger 1095, master 1097; kit fold 3035 = ledger 3035, master 3318 (master carries §12 THE EDIT MODE FOLD at master:3077 and §13 THE SEAM FAMILY at master:3302, which the kit copy lacks); ARCH_CW is identical in all three. Master's SPINE already carries the R1 alignment erratum (master SPINE:80-83 names `settlementAlignment(item, worldState)` at `src/domain/worldPulse/settlementAlignment.js:44`), and master's ARCH_SP/COUPLINGS carry a handful of line-address refreshes (`settlementStrategy.js:1290`, `coup.js:103-104`, `warHomeCosts.js:517-520`). **Before amending in place, the chair must pick which copy is the amendment base, or corrections will be applied twice or lost.**

---

## 1. THESIS

The SPINE is the constitution of the FP corpus. Foreign policy is four SUBSTANCES (war, trade, faith, populations), seen through one MEDIUM (information), negotiated in one GRAMMAR, and driven by the INTERIOR (SPINE:3-7). It sets twelve requirements plus two chair amendments that every mechanism must carry (SPINE:17-108), and it builds shared infrastructure once (SP-1..SP-8, SPINE:109-490) so that a wide corpus can stay deep. COUPLINGS maps the seven layers into 21 pairs and 42 directions (COUPLINGS:22-29), assigns each coupling exactly one owner (J-CPL-1, COUPLINGS:1747), and builds four cross-wires of its own: the registry, the braid, the cause-walk and the measure (CW-0..3). ARCH_SP and ARCH_CW turn both volumes into wave specs.

**The DM-felt sentence of the flagship mechanisms:**
- **CW-1 (the cascade braid)** is the only spine/coupling mechanism with a measured, built sentence: *"In the wake of one cause, four consequences now run across politics, war, treaties, belief and trade: Schwarzholz declares war on Cathfield"* (board, `FP-PROGRESS-BOARD.md:193`; READ 3's scorer gave it 4 of 4). The braid is DARK at master: `cascadeGovernorEnabled` appears only in the manifest (`simulationRules.js:274`) and in no preset. CONFIRMED.
- **SP-6 (the causal voice)** has the volume's exemplar *"X declares vengeance on its weakened neighbour — a generation's grudge will be met"* (SPINE:271-273, 296-297). It is DARK: `heraldCausalVoiceEnabled` is read only at `heraldCausalVoice.js:119`, and no preset or store path sets it (CONFIRMED, by grep). A DM reads none of it today.
- **COUPLINGS §9** lists twelve contract sentences (COUPLINGS:1831-1851), for example *"The court knew, and sat still."* (CPL-20). None is pinned to a built kind. Most depend on unbuilt waves (§2 table).
- **No DM-felt sentence exists for:** SP-A (bandedStock / bandFamilies, which are vocabulary), SP-C posture (a colour on other verbs, with no news kind of its own), SP-D errand spine (substrate), SP-E (instruments), SP-8 age layer (unbuilt), CW-0 (gate-time), CW-2x (unbuilt), CW-3 (soak-side).

## 2. STATUS, TRUTHFULLY

**Headers.** SPINE has no status line. It calls itself "the unified program's constitution" with "Implementation = the external implementer (Sol)" (SPINE:1, 8-9), and the chair seats now build that, so this clause is stale. ARCH_SP says "Status: ARCHITECTURE. Nothing here is scheduled until the chair sequences it" (ARCH_SP:12), but five of its six waves have landed. COUPLINGS says "Status: ARCHITECTURE" (COUPLINGS:22). ARCH_CW says "IMPLEMENTATION ARCHITECTURE" and marks CW-0w "LANDED IN FULL" (ARCH_CW:15, 174). Its CW-1 heading still reads "BLOCKED on SP-6a" (ARCH_CW:346), although CW-1 has landed.

| Wave / unit | Volume's claim | Board / order | Code at `00b648c9d` | Verdict |
|---|---|---|---|---|
| SP-A bandedStock + bandFamilies + walkers | SPINE §6 record "landed" (SPINE:980-1094); ARCH_SP heading carries no LANDED mark (ARCH_SP:325) | pre-board (August) | `59df13a97` 2026-08-04; `bandedStock.js:57-75` (five half-life rungs), `bandFamilies.js:75,85`; consumed by 20 / 12 src modules | **LANDED**. CONFIRMED. ARCH_SP header stale |
| SP-B believed-world axes | ARCH_SP:374, no LANDED mark | rides LIT-1b | `4c0f2f38b` 2026-08-05; `beliefAxisSubjects.js`; scarcity + conditions **LIT** in `FP_LIT_BELIEF` (`simulationRules.js:793-797`); devotion manifested, **DARK** | **LANDED; 2 of 3 families lit**. CONFIRMED |
| second-order belief (outboundImpression) | "no flag" J-SP-6 (ARCH_SP:803-805) | — | `outboundImpression.js` + `secondOrderBelief.js`; `secondOrderBeliefEnabled` manifested (IN-1), not lit | **LANDED, dark**. J-SP-6's "no flag" is superseded by IN-1's flag. CONFIRMED |
| SP-B2 belief legs | "LANDED 2026-08-05" (ARCH_SP:450) | — | `sovereigntyMarketStage.js:51` "ALL FOUR LEGS NOW HAVE A SURFACE"; ES-4 marker present (`espionageDistantSourceEs4.test.js:400`) | **LANDED**. The ARCH_SP clause "ES-4 … ABSENT today" (ARCH_SP:523) is stale. `sovereigntyTradeEnabled` is manifested and lit in no preset. CONFIRMED |
| SP-C posture read | ARCH_SP:538, no LANDED mark | FP-ORDER: "SEAM-0 (SP-C's appetite mount, owed — the facet has no data, B4)" | `cbd348a50` 2026-08-06; `courtPostureOf` `strategicPosture.js:222`, `courtRiskAppetiteOf` :303; consumers pactFormation, pactRenewal, suspicion, envoyTaskCatalog; `strategicPostureEnabled` **DARK** | **LANDED, dark; appetite starved (SEAM-0 owed)**. Lit-but-empty is PLAUSIBLE, from FP-ORDER |
| SP-D errand spine | "LANDED @ 0aac6792, repaired @ 57fe385b" (ARCH_SP:624) | SP-D2 `3fd25f5df` 2026-09-24 (board:16-34) | `errandMint.js` imported by 12 other src files (espionage, emigré, pact proposals); `errandSpineEnabled` **DARK**, held on purpose (`simulationRules.js:782-786`) | **LANDED, dark**. CONFIRMED |
| SP-E narration kit | ARCH_SP:718, no LANDED mark | — | `7a77c84ba` 2026-08-06; `kindPoolWalker.js`, `phraseRepetitionEnvelope.js`, walker; `heraldFeed.js:120` still mixes `significance === 'major'` with `severity >= 0.72` | **LANDED**. The SP-6a migration of heraldFeed is still owed. CONFIRMED |
| SP-F era marking | "declared NON-WAVE" (ARCH_SP:756) | — | only SP-family docs carry the ERA-PRESET-ELIGIBLE marking (count, §12) | **Obligation unmet corpus-wide**. CONFIRMED (count) |
| SP-7 temporal walker / mode table | "MOSTLY BUILT; mode table NOT SP work" (ARCH_SP:129) | — | `src/domain/spatial/modeSpeeds.js` exists | **BUILT** (WY-1). V21's "zero hits" is stale. CONFIRMED |
| SP-8 age layer (J-D12) | "veto open … preset tables land with the age wave" (SPINE:467-490) | not in FP-ORDER | no era-preset module in src (grep) | **UNBUILT**. CONFIRMED |
| SP-3 pact grammar | delegated to GR (ARCH_SP:204-216) | pair 1 GR waves | `pactFormationEnabled` LIT (`FP_LIT_ALIVE`); TERM_CATALOG 26 types / 13 families incl. faith, population, commercial | **LANDED via GR**. CONFIRMED |
| Lanes H/HG/HR/CF causal voice | "BUILT AND DARK" (SPINE:584) | — | `6eb6c445f` 2026-08-03; consumed by `HeraldHeadline.jsx` and `CausalityPopup.jsx`; flag set nowhere | **BUILT, dark**. CONFIRMED |
| Lanes P/PR dossier state-prose | "NO COMPONENT CONSUMES THE READER" (SPINE:829-832); "FIVE OF THE SIX DESKS ARE UNWIRED" (SPINE:822-827) | — | `stateProse/` holds power/defense/general/stressors desks; imported by `EconomicsTab.jsx`, `WarFaithDesk.jsx`, `ProseBlock.jsx` | **WIRED and live**. The SPINE §6 lane-P record is stale. CONFIRMED |
| CW-0 registry | "BUILT and growing" (ARCH_CW:41) | — | 8 files (head 284 lines + 6 leaves + schema), **68 rows**, schema v4 | **LANDED**. ARCH_CW S1's "178-line head over six leaves" is stale. CONFIRMED |
| CW-0w walkers ×4 | "LANDED IN FULL" (ARCH_CW:174) | — | `b3fb8f494`, `f7da6b607`, `03dee5fd5`, `e30770bd0`; `couplingInclusion` / `couplingDesk` walkers + `couplingReceiptSample` helper exist | **LANDED**. CONFIRMED |
| CW-1 cascade braid | "BLOCKED on SP-6a" (ARCH_CW:346); fold PHASE 8 "LAST" | FP-25 pulled forward; DONE `a74efaa7a` (board:193) | `155da82f2` 2026-09-24; `cascadeBraid.js` (WINDOW_WEEKS 13, MEMBER_FLOOR 3, LAYER_FLOOR 3 at :77-81); one line in `heraldFeed.js`; flag **DARK** | **LANDED, dark**. ARCH_CW heading and SC-3 are stale. CONFIRMED |
| CW-2x cause-walk extension | "chair Q1, recommendation: ratify" (ARCH_CW:415) | FP-ORDER pair 6 | `causeWalkCouplingJoin.js` ABSENT | **UNBUILT**. COUPLINGS never received the re-scope (0 mentions). CONFIRMED |
| CW-3 coupling measure | "closes the program" (ARCH_CW:467) | FP-ORDER pair 6 | `subsystemRowsCoupling.js` ABSENT | **UNBUILT**. CONFIRMED |

## 3. LAWS AND OWNER-SETTLED ITEMS (the fold may NOT re-narrate these)

**Owner quotations and owner-sourced amendments (verbatim; SPINE §2 SP-6).**
- Law One is "owner-dictated" (SPINE:21): *"the engine models believers, buyers, migrants, and courts — never the underlying truth of a DM's world"* (SPINE:21-23); *"The engine never confirms the divine, never resolves a fate, never contradicts a DM's canon."* (SPINE:24-25).
- THE CONTENT-DEPTH FLOOR comes from the owner's question *"is there enough content, with enough variability?"* (SPINE:232-233). It is a chair amendment, vetoable (SPINE:231-232).
- THE FREQUENCY-SCALED FLOOR (owner: *"I want more sentences"*, SPINE:253): chronic/routine ≥8–12, notable ≥6, major/rare ≥4; the soak envelope is the arbiter; THE LEGACY CLAUSE covers ~269 live routed tokens (SPINE:253-268).
- THE CAUSAL GRAMMAR, by owner order (SPINE:269-290). Three laws: PER-LINK ENTAILMENT, TIME BANDS (*"a generation's grudge", never a digit*), COMPOSITION LIVES DISPLAY-SIDE (SPINE:280-288).
- THE TWO REGISTERS, an owner constraint (SPINE:291-306). The headline carries *"AT MOST ONE causal gesture"*; chains of two or more links are *"FORBIDDEN in this register"* (SPINE:296-300); *"the pacing governor reads headlines only (the telling is pull, never push)"* (SPINE:305-306).
- SCOPE + THE SURFACE CONTRACT, an owner clarification (SPINE:307-325): the four Herald tiers; THE POPUP CONVENTION *"(product-wide UI law, all surfaces)"* (SPINE:319-323).
- THE HERALD INDEX, by owner order (SPINE:326-344): faceted search on typed refs only; *"search is a view, never a leak"* (SPINE:340).
- **THE TRUTH LAW + THE CONTAMINATION FENCE, an owner LAW** (SPINE:345-372): *"THE HERALD IS THE DM'S PAPER AND IT ALWAYS TELLS THE TRUTH."* (SPINE:347); no belief prints as ground fact (SPINE:348-353); Law One holds even in the DM's truth (SPINE:354-355); the Herald composers may never read a rumour ledger, a belief map or a disinfo record AS A CONTENT SOURCE (SPINE:360-363); *"men said"* phrasings are lawful in the rumour mill and in-world voices only (SPINE:368-372).
- THE PORTABLE POPUP + THE MANIPULATION DISCLOSURE, by owner order (SPINE:373-391): CLEAN · WORN IN THE TELLING · PLANTED; *"a link the records cannot classify renders UNKNOWN, never guessed"* (SPINE:390-391).
- THE MUTATED PLANT, an owner refinement (SPINE:392-410): THE SEED-NOT-GROWTH LAW, *"the planter owns the seed, never the growth"* (SPINE:399-400).
- THE DOSSIER EXTENSION, by owner order (SPINE:411-434): the DOSSIER-NATIVE register, described as "refined per owner 2026-08-03" (SPINE:420-421).
- THE STATE-PROSE CORPUS + THE FOREIGN DESK OF THE TOWN, by owner order (SPINE:435-457): good states get prose as rich as broken ones; foreign policy is narrated at the town's own vantage.
- J-D12(f), quoted as *"owner verbatim"*: the age axis family is CLOSED at two (SPINE:474-476). The age tables are *"owner-signed"* (SPINE:490).
- **OWNER-OVERRIDE 2026-08-02:** *"`tribute_population` is ruled INTO the catalog by owner order — the levy is anonymous-population columns only"* (COUPLINGS:1110-1112).

**Constitutional requirements** (SPINE:17-108): the twelve plus 13 (the alignment coupling) and 14 (the edit verb). The text calls 13/14 *"CHAIR AMENDMENT … under full owner delegation — vetoable"* (SPINE:76-79, 93-94).

**Chair rulings at the constitution** (binding, vetoable in their own rows): R1 ONE INSTRUMENT PER PAIR IS LAW (SPINE:147-154); R3 ONE CATALOG LIST (SPINE:154-160); SP-4a actor-class set CLOSED at settlement + house + temple (SPINE:163-169); THE DEGRADED ARM (SPINE:174-183); SP-5 confidence-stock closure, scoped (SPINE:186-195); SP-5b one banded-stock idiom (SPINE:196-208); **R5** band families are minted in SP-6, *"volumes … never author a scale"* (SPINE:210-216), plus the two standing rules (SPINE:223-229); the SP-6 DM-FIELD PROJECTION RULE (SPINE:458-466); §3 crux rulings *"binding; the volumes elaborate, never re-open"* (SPINE:492-550); §5 the CW-0 same-commit obligation (SPINE:569-574).

**ARCH_SP laws and rulings:** L1–L9 bound verbatim (ARCH_SP:28-97); SEAM RULINGS 1–4 (ARCH_SP:181-225); THE LADDER LAW J-FP-2, *"`OVERFLOW_BANDS` is a pressure LEVEL, never a DIRECTION"* (ARCH_SP:364-372); J-SP-1..8 (ARCH_SP:768-809); **CR-C4-1** (chair, 2026-08-06): the court reads are `courtPostureOf` / `courtRiskAppetiteOf`, and `riskToleranceOf` resolves to ONE definition under `src/domain` (ARCH_SP:554-567, 783-796, 934-940). I found no CR-C4-1 row by grep in `OWNER_DECISION_QUEUE.md`; its text lives only in the volumes.

**COUPLINGS laws:** C-LAW-1..8 (COUPLINGS:106-149). C-LAW-8 says *"Building one is a STOP-and-report"* (COUPLINGS:146-149). The ownership law J-CPL-1 (COUPLINGS:79-84, 1747-1749); J-CPL-2..12 (COUPLINGS:1750-1814); the matrix legend (COUPLINGS:218-224); *"This wave closes the program"* (COUPLINGS:1739-1740); the owner-held boundary *"no flag lights, no soak runs, no band ratifies outside the owner-signed schedule"* (COUPLINGS:1864-1866).

**ARCH_CW rulings:** CR-FP-11, the reach repair, plus THE STANDING CANNOT-CATCH LIST (ARCH_CW:230-260; the OWED ROWS register at :261-271); **CR-FP-1**, the desk rule is AUTHORITY-OR-TOKEN (ARCH_CW:288-309); the §3 JUDGMENT that the braid is a VIEW-ITEM-WITH-RECEIPT-DISCIPLINE (ARCH_CW:158-166); *"newPersistedKeys = []"* (ARCH_CW:128-130); SC-1..9 (ARCH_CW:517-585). In SPINE §6: **CR-HR-F4**, recordedType (SPINE:902-925), and the HG chair call *"THE MOLD KEY IS THE SIXTEEN POOLS"* (SPINE:705-709).

**Items marked owner-held:** soaks, lighting, tuning ratification and pushes (ARCH_SP:907-908; ARCH_CW:23, 498-500). The migration of the errand ledger home is owner-gated (J-SP-2, ARCH_SP:771-774). A property system is owner-gated (J-CPL-7). The forged-instrument line, domestic propaganda, conscription economics, a praetorian lane, the servile-war arc, the natalist coupling, excommunication, and the indulgence market each "needs its own owner ruling" (COUPLINGS:416 conscription, 553 praetorian, 806-808 property, 863 natalist, 1001 excommunication, 1168 servile war, 1212 forged instruments, 1258 domestic propaganda). The indulgence market is closed by Law One, not left to a ruling (COUPLINGS:604-608).

## 4. CROSS-PROGRAM CLAIMS

| # | Claim (family → other) | Line | Other side (volume grep / code) | Verdict |
|---|---|---|---|---|
| X1 | GR-3 mints ONE canonical TERM_CATALOG list incl. faith (5) + population rows; WF-6 consumes behind `faithTermsEnabled` | SPINE:154-160; COUPLINGS:921-937 | `peaceTermsCatalog.js:437-448` labels all five faith + three population + `exclusivity`/`market_access`/`toll_exemption`; 26 types / 13 families; ARCH_WF:192, 596 `faithTermsEnabled` "needs SP-3 lit + GR-3 rows" | **AGREES** (catalog). The WF-6 flag is not manifested, so it is unbuilt |
| X2 | WR-10 trade-rights rows are "zero hits", a declared dependency | COUPLINGS:280-288, 1875-1885 | catalog has `exclusivity` (`peaceTermsCatalog.js:306`), not `trade_exclusivity` | **STALE** (built since). The spelling diverges from COUPLINGS:283 `trade_exclusivity` |
| X3 | The posture is consumed as `postureOf` by five programs; the INT-1 disclosed-shift list carries seatBooks | SPINE:171-183; fold:1013-1022 | ARCH_INT:133 spells `courtPostureOf`/`courtRiskAppetiteOf`; no "disclosed … posture" sentence found in ARCH_INT by grep | **DISAGREES** (SPINE and fold spell the old names). The INT disclosure is **SILENT** |
| X4 | SP-1's errand ledger is `spatialLedgers.errands` | SPINE:120 | `worldState.js:483` `'envoyErrands'` (top level); ARCH_SP J-SP-2 | **DISAGREES**. The constitution erratum is owed |
| X5 | `alignmentOf(id)` lives at beliefMap.js:915 / informationStatecraft.js:584 | SPINE:80-81 (kit) | no exported `alignmentOf` in src; `settlementAlignment.js:44` exports `settlementAlignment`; master SPINE:80-83 is already corrected | **STALE in the kit/ledger copy; fixed on master** |
| X6 | IN-5 refiles `belief_misjudgment` to a seventh KNOWLEDGE desk | COUPLINGS:193-197, 1797-1806 | `heraldRouting.js:74` HERALD_SECTIONS has `knowledge`; :151-152 "RE-FILED to the KNOWLEDGE block below (J-INF-6)" | **AGREES** (landed) |
| X7 | IN-5(d) owns the scandal join; INT-3a owns the decision join | COUPLINGS:1229-1240 (the join split at 1235) | INFORMATION:1140 "the coup/capture beat cites the standing corruption_exposed condition"; ARCH_INT:99 INT-3a's verdict surface | **AGREES** (design). Code not checked |
| X8 | WF-7 owns the tithe executor END TO END; TRADE is a read surface only | COUPLINGS:568-584 | ARCH_WF:193 `titheEnabled` WF-7 "tithe.js's quarterly-fold gate"; ARCH_WF:752 "entries ONLY through TRADE's own writer at the couplings volume's declared" port | **AGREES**. Unbuilt (no flag) |
| X9 | WF-2a owns the feast economy; pilgrims are SP-1 movers | COUPLINGS:826-834 | ARCH_WF:188 `pilgrimageEnabled` needs `errandSpineEnabled === true` | **AGREES**. Unbuilt |
| X10 | TR-7's posture block reserves the seatBooks read; POP-5b reserves it too | COUPLINGS:780-786, 1137-1142, 1913-1927 | ARCH_TR:579 "ABSENT-not-zero until `seatBooksEnabled` exists"; ARCH_POP: **no `seatBooksEnabled`** (grep 0); ARCH_EC (which "absorbs TR"): 0 | **TR AGREES; POP SILENT; EC SILENT**. The reservation may be lost in the TR→EC absorption (PLAUSIBLE) |
| X11 | POP-1 owns THE ARRIVAL CLEARING (new work) | COUPLINGS:1031-1040 | ARCH_POP:98, 145 name it | **AGREES**. Unbuilt (`believedMigrationEnabled` not manifested) |
| X12 | SP-B + SP-B2 + ES-4 discharge CR-WR10-H | ARCH_SP:504-536, 866-880 | ES-4 marker in an `it` title, `espionageDistantSourceEs4.test.js:400`; `sovereigntyMarketStage.js:72` | **AGREES; the condition is now satisfiable** (ES-4 landed). ARCH_SP:523 "ABSENT today" is STALE |
| X13 | SP-D unblocks WF-2b (religious), TR-8 (commercial), IN-4 courier, INT-3b émigré | fold:1024-1040 | `emigreErrand.js`, `espionageMissions.js`, `pactProposals.js` import `errandMint` | **AGREES** for INT-3b, ES and GR. WF-2b and TR-8 are unbuilt |
| X14 | CW-0: every FP wave landing a cross-layer read adds a registry row with a CHARTERED prefix | SPINE:569-574; COUPLINGS:71-80 | `CHARTERED_VOLUME_PREFIXES` = WR TR GR WF POP IN INT SP CW ES WY HB ENC (`couplingRegistry.test.js:119`); **no EC, WC, EP, LG, PG, MF, CN** | **SILENT / gap**. A WC or EC row cannot be legally spelled today (§12) |
| X15 | Pair anchors are CPL-1..21; a wave never mints a 22nd where a canonical one fits | COUPLINGS:69-80 (anchors at 70) | registry mints `CPL-22.TRADE_TO_GRAMMAR` (`couplingRegistryEspionage.js:125`), whose comment says "TRADE × GRAMMAR genuinely has no anchor" (:275), yet COUPLINGS:703 IS CPL-10 TRADE × GRAMMAR; it also mints `CPL-23.FAITH_TO_WAR` (`couplingRegistryWar.js:661`), yet CPL-2 IS WAR × FAITH (COUPLINGS:313); and `CPL-20.INFO_TO_INFO` (:574), a within-layer row under a cross-layer pair | **DISAGREES**. The pairId vocabulary has no closure pin: the regex is `CPL-\d+` (`couplingRegistry.test.js:139`) |
| X16 | SC-6: every FP volume adopts `causedBy` at its mint sites | ARCH_CW:544-551 | `causedBy` appears **0×** in ARCH_{WF,GR,TR,POP,INT,IN,ES,EP,WY,EC,WC,HB}; src: 6 files, engine writers = provenanceKernel + roadsKernel only (unchanged since ARCH_CW S11:56) | **SILENT, everywhere**. CW-3's `chainDepthDegenerate` will red by design (PLAUSIBLE) |
| X17 | Story 3 rides TR-2's closed house act set {sponsor_caravan, …} | COUPLINGS:1484-1490 | `sponsor_caravan`: 0 hits in ARCH_TR and ARCH_EC | **SILENT** (vocabulary moved or unrecorded). VERIFY in DESIGN_FP_TRADE |
| X18 | "owner's no-coin ruling", "no prices exist" as the basis for declared empties | COUPLINGS:308-310, 608, 654, 698-700 | ODQ §731.1 (ODQ:31490): the owner "KNOWINGLY REVERSES the recorded no-conserved-coin ruling"; `treasuryEnabled` manifested (W-COIN); ODQ §934.90 addendum 3 THE REFERENCE PRICE (ODQ:32973) | **STALE premise**. The empties may still hold (bands, not floats), but their stated reason is overturned |
| X19 | CPL-17 owner override: `tribute_population` in the catalog, TB-3 spec | COUPLINGS:1110-1112 | 0 hits in src; 0 hits in ARCH_GR | **SILENT**. The owner's order is unbuilt and unscheduled in GR |
| X20 | SP-8 cross-wires J-D12 as the era layer; every volume marks ERA-PRESET-ELIGIBLE bands | SPINE:467-490 | `DESIGN_REALM_DIRECTIVES.md:1511` J-D12 "veto open"; ERA marks in 0 non-SP volumes | **SILENT corpus-wide** (§12) |
| X21 | The braid's layer authority is the registry (no second layer table) | ARCH_CW:351-356 | board:193 "the braid keeps its OWN COPY of the registry's layer table (an import would break the Herald contamination fence)"; `cascadeBraid.js:21-31` frames it as "the registry's own projection"; `cascadeBraidCw1.test.js:57` imports `COUPLING_REGISTRY` | **AGREES in intent; a second copy exists**. An equality pin is PLAUSIBLE (the test imports the registry) |
| X22 | Lane P: the dossier reader has no consumer | SPINE:829-832 | `EconomicsTab.jsx`, `WarFaithDesk.jsx`, `ProseBlock.jsx` import `stateProse/` | **STALE** (wired) |

## 5. INTERNAL CONTRADICTIONS (both halves quoted)

1. **Posture names.** SPINE: *"exposing `postureOf(settlement)` + `riskToleranceOf(actor)`"* (SPINE:171). ARCH_SP: *"the court reads `courtPostureOf` / `courtRiskAppetiteOf`"* (ARCH_SP:554-560). ARCH_SP also says *"The constitution owes the erratum for the five volumes that bind the old spelling"* (ARCH_SP:795-796). That erratum was never applied: the kit SPINE still reads the old names, and the fold at :1013-1019 still reads "postureOf … **BLOCKED ON Q1**".
2. **Errand ledger home.** SPINE: *"`spatialLedgers.errands`, one writer"* (SPINE:120). ARCH_SP: *"SP-1 generalizes `worldState.envoyErrands` IN PLACE"* (ARCH_SP:193-202). The constitution owes the erratum (ARCH_SP:15-16, Q1 at :929-933).
3. **How many refutations.** ARCH_SP's header says the tree contradicts the constitution in *"three cases measured in §2"* (ARCH_SP:16). Its own §2b is titled *"REFUTED (4 rows"* (ARCH_SP:138) and lists R1–R4.
4. **SP-B2's ES-4 member.** ARCH_SP §5 says *"ES-4-DISTANT-SOURCE-EVIDENCE`, ABSENT today"* (ARCH_SP:523). The marker is present (`espionageDistantSourceEs4.test.js:400`). This is internal staleness rather than a logical contradiction, but the block reads as present tense.
5. **CW-1 blocked and not blocked.** ARCH_CW heading: *"CW-1 — THE CASCADE GOVERNOR … BLOCKED on SP-6a (S15)"* (ARCH_CW:346); SC-3: *"CW-1 is BLOCKED until SP-6a lands (S15 — 'routine' does not exist in the tree today)"* (ARCH_CW:526-529). Against both, S15 itself: *"⏱ SP-6a LANDED … CW-1's braid-class blocker is DEAD"* (ARCH_CW:67). SPINE SP-A adds that `routine` *"IS LIVE IN THE TREE"* and always was (SPINE:1000-1013). CW-1 landed (`155da82f2`).
6. **All 42 directions ruled, none EMPTY.** COUPLINGS §0.2: *"every one of the 42 directions is ruled there (designed, existing, or declared empty)"* (COUPLINGS:58-60). The legend defines `EMPTY = declared empty in §4` (COUPLINGS:224), yet the §3 matrix (COUPLINGS:228-250) grades no cell EMPTY. Every "declared empty" in §4 is a SUB-coupling inside a designed direction. SPINE §4 says *"Pairs with no designed coupling are DECLARED empty"* (SPINE:560-561), and none is. The registry's "declared-empty enforced as absence of rows" (J-CPL-2, COUPLINGS:1750-1754) therefore has nothing to enforce at direction grain: the inclusion walker keys on (module, module) pairs, not on CPL directions.
7. **People as payment.** CPL-17 DECLARED EMPTY: *"no serfdom/population-transfer term (people are never the PAYMENT — grain, rights, and access are; the sovereignty market trades EDGES, not souls)"* (COUPLINGS:1107-1109). The next line: *"[OWNER-OVERRIDE 2026-08-02: `tribute_population` is ruled INTO the catalog by owner order — the levy is anonymous-population columns only"* (COUPLINGS:1110-1112). The override does not amend the empty line it overturns. The owner's word wins, so the empty clause needs the bracket.
8. **The braided item.** COUPLINGS CW-1: *"the braided item is itself a receipt"* (COUPLINGS:1653) and *"Lifecycle: display-side; no save state"* (COUPLINGS:1662). ARCH_CW reconciles the two by JUDGMENT (ARCH_CW:158-166, Q4 at :609-617), but Q4 is recorded nowhere as ruled.
9. **CW-2 greenfield vs extension.** COUPLINGS still specs CW-2 as a surface to build (COUPLINGS:1667-1705). ARCH_CW S9 says *"REFUTED — … Building the volume's CW-2 as written would erect a SECOND cause-walk"* (ARCH_CW:54) and asked for *"a one-line correction in the volume's §10 register"* (ARCH_CW:590-595). COUPLINGS contains 0 occurrences of `CW-2x`.
10. **Second-order belief flag.** J-SP-6: *"second-order belief has no flag … VETO adds `secondOrderBeliefEnabled`"* (ARCH_SP:797-799). The tree manifests `secondOrderBeliefEnabled` (engine-gated list, IN-1). The veto arm was taken in another volume and J-SP-6 was never annotated.
11. **Matrix vs ports on treaty mints.** The §2 GRAMMAR port says *"sole mint = war-exit PASS 1"* (COUPLINGS:199), and CPL-5/CPL-10 build their EXISTS on it (COUPLINGS:205, 469). CPL-10's own pin promises *"two peaceful neighbours CAN now sign"* (COUPLINGS:752-753). Both are design-time truths. Today the peacetime mint is LIT (`pactFormationEnabled` in `FP_LIT_ALIVE`), so §2/§3 read as present tense and are wrong (see §6).

## 6. STALE PREMISES (substrate claims refuted at `00b648c9d`; the live line quoted)

| # | Volume premise | Live line at `00b648c9d` | Verdict |
|---|---|---|---|
| S1 | `alignmentOf(id)` at beliefMap.js:915 / informationStatecraft.js:584 (SPINE:80-81, kit) | `settlementAlignment.js:44` `export function settlementAlignment(item, worldState) {`; zero `export … alignmentOf` | STALE (kit). Master SPINE already fixed. ARCH_SP R1's "an INJECTED CLOSURE … no exported" (ARCH_SP:142) is now also stale: an exported derived read exists |
| S2 | `spatialLedgers.errands` (SPINE:120) | `worldState.js:483` `'envoyErrands',` | STALE (constitution erratum owed) |
| S3 | `riskToleranceOf` is SP-4's name (SPINE:171); roads at `state.js:319` (ARCH_SP:144) | `roads/state.js:334` `export function riskToleranceOf(npc) {`; `strategicPosture.js:222` `export function courtPostureOf(…)` | STALE name; the address moved :319→:334 |
| S4 | `routine` is absent until SP-6a mints it (ARCH_CW S15:65 at survey; SC-3:527; fold §2a per SPINE:1001-1004) | `bandFamilies.js:75` `SIGNIFICANCE_CLASSES = Object.freeze(['routine', 'notable', 'major'])`; borrowed, live before SP-A | STALE |
| S5 | `pulseKernel.js` "measured 2,820 lines" (ARCH_SP:39) | `scripts/.size-baseline.json:13` `"src/domain/worldPulse/pulseKernel.js": 1581` (effective, banked permanently by R-BLD-10 at :6); raw `wc` 3007 | STALE figure. The frozen kernel is 1581 effective, and the volume quoted a raw count |
| S6 | Mode-speed table: `kmPerWeek\|MODE_SPEED` → zero hits (ARCH_SP:129) | `src/domain/spatial/modeSpeeds.js` exists (WY-1) | STALE |
| S7 | The treaty artifact's sole mint = war-exit PASS 1, `pulseKernel.js:2371` (COUPLINGS:199, 205, 469) | `pulseKernel.js:2752` `const treatyAdvance = advanceTreatiesWithDisposition({`; peacetime formation LIT (`FP_LIT_ALIVE`, `simulationRules.js:789-792`) | STALE twice (address, and "sole mint") |
| S8 | TERM_CATALOG "11-term catalog, 7 families" (COUPLINGS:199); "12 types, 8 families" (ARCH_SP:116) | node import: **26 types, 13 families** (economic … faith, population, commercial, amnesty, jubilee); `peaceTermsCatalog.js:306` `exclusivity: … family: 'commercial'` | STALE |
| S9 | `belief_misjudgment` at the faith desk, `heraldRouting.js:118`/`:134`; knowledge desk absent (COUPLINGS:158, 871; ARCH_CW S13:63) | `heraldRouting.js:74` `HERALD_SECTIONS = …['war', 'faith', 'trade', 'knowledge', …]`; :151-152 "RE-FILED to the KNOWLEDGE block" | STALE (IN-5 landed) |
| S10 | `ENGINE_GATED_VIRTUAL_RULE_KEYS` at `simulationRules.js:185`; `infoModeOf` at `:739` (ARCH_SP:49, 110; ARCH_CW S23:83) | `simulationRules.js:230` (the list), `:1404` `export function infoModeOf(rules) {` | STALE addresses (the symbols hold) |
| S11 | `detectMisjudgment` at `beliefMap.js:1362-1457` (COUPLINGS:422) / `:1468` (ARCH_CW S21:76) | `beliefMap.js:1504` `export function detectMisjudgment({` | STALE address |
| S12 | Heralding significance is ad hoc at `heraldFeed.js:95` (ARCH_SP R4:145; SP-E:736) | `heraldFeed.js:120` `const major = record.significance === 'major' \|\| … \|\| severity >= 0.72;` | **PREMISE STILL TRUE; the address moved**. SP-E's named migration target is still unmigrated |
| S13 | Lane P: "NO COMPONENT CONSUMES THE READER"; five desks unwired (SPINE:822-832) | `stateProse/` holds `powerStateProse.js`, `defenseStateProse.js`, `generalStateProse.js`, `stressorsStateProse.js`; imported by `components/new/tabs/EconomicsTab.jsx`, `WarFaithDesk.jsx` | STALE |
| S14 | Couplings registry = 575 lines / 26 rows / desks {adjudication 10, war 6, …} (ARCH_CW S1:41, S13:63) | 8 files, 2,803 raw lines; **68 rows** (couplingId census); head `couplingRegistry.js` 284 lines | STALE |
| S15 | The chartered prefix set is twelve, "a THIRTEENTH now reds" (ARCH_CW:552-562) | `couplingRegistry.test.js:119` … `'ES', 'WY', 'HB', 'ENC']` (13) | STALE (ENC admitted). ARCH_CW's own point-at-it rule is vindicated |
| S16 | The "owner's no-coin ruling" grounds the declared empties of CPL-1/7/8/9 (COUPLINGS:308-310, 608, 654, 698) | ODQ:31490 §731.1 *"KNOWINGLY REVERSES the recorded no-conserved-coin ruling"*; `treasuryEnabled` in the engine-gated list (`simulationRules.js` W-COIN comment); ODQ:32973 §934.90 addendum 3 THE REFERENCE PRICE | STALE rationale. The banded-not-float conclusions may survive (PLAUSIBLE) but must cite the new ground |
| S17 | `seatBooksEnabled` → zero hits; the degraded arm binds (ARCH_SP V13:122) | `strategicPosture.js:36` (a comment only); 0 gate reads in src | **STILL TRUE** (premise holds) |
| S18 | causedBy has 6 files, two engine writers (ARCH_CW S11:56) | unchanged: provenanceKernel, roadsKernel, roads/state, realmItemReadModel + 2 display | **STILL TRUE**, 2.5 months and ~60 waves later. SC-6 has never been honoured (§4 X16) |

**Rulings from other programs that overturn a family premise.** (a) The coin reversal, ODQ §731.1 (S16). (b) **The birth door / pulseKernel-frozen law**: L1's *"`pulseKernel.js` … and `applyWorldPulse.js` … receive ZERO edits ever"* (ARCH_SP:39-42) is an SP-wave law, and it held for SP. But the kernel took 23 commits after 2026-08-04 from the EM lanes (git log on the master copy), so *"ever"* is not an estate fact. The kernel is a size-banked mouth (R-BLD-10), not an untouchable file. (c) **EC absorbs TR** (ARCH_EC:1, "absorbs TR"): every COUPLINGS row owned by a TR wave (TR-1..TR-9; the CPL-1/7/8/9/10/11 ADDS) now has an owner whose volume says it is absorbed. The ownership law J-CPL-1 needs the re-pointing written down. ARCH_EC mentions `seatBooksEnabled`, `causedBy`, `bandedStock` and `sponsor_caravan` zero times each.

## 7. THE CLOCK AND THE TIER

The DM's advance unit is one of week / month / season / year (`RealmForecast.jsx:24`; `AuspicePanel.jsx:42`). The scrollback defaults to `one_month` (`ChronicleScrollback.jsx:54`), and one tick = one week (`intervalWeeks.js:8`). So a typical session advances 1–13 ticks. "Felt at" below means the clock at which a DM can first SEE the effect.

| Mechanism | Cadence / dwell / half-life (receipt) | Tier needs | Felt at |
|---|---|---|---|
| SP-5b banded stocks | half-lives a_season 13 · a_year 52 · a_few_years 156 · a_decade 520 · a_generation 1040 (`bandedStock.js:72-76`; SPINE:986) | aspatial | **yearly to generational**; a band crossing on a 156-week stock is rarely seen inside a session |
| SP-B belief axes | per-tick fold; SILENCE_DECAY 0.92, HOP_DECAY 0.75 (ARCH_SP V2:110); hop latency | needs an infoMode that RECORDS beliefs (LIT only in `FP_LIT_BELIEF` presets, `simulationRules.js:766-772`); `routePositionBand` borrows ROUTE_FLOW_BANDS, so a world with no route network reads `unknown` (PLAUSIBLE) | **fast (weekly)** when beliefs are on; inert in omniscient presets (realistic_regional, ruling FP-24) |
| SP-B2 sovereignty legs | at appraisal | needs ES-4's distant missions (espionage, spatial) | gated on `sovereigntyTradeEnabled`, lit nowhere |
| SP-C appetite + posture | appetite half-life `a_few_years` 156w; channels `a_generation` (ARCH_SP:612-615) | aspatial; needs the WR-2 channel host lit (`dispositionChannelsEnabled: false` at `simulationRules.js:1041`) | **yearly+, and starved** (SEAM-0: "the facet has no data") |
| SP-D errands | law M: one-week floor per leg; transit kernel | **spatial**: legs need a route plan / positions | weekly (an envoy is seen leaving and arriving) |
| SP-6 causal voice | display-side; time bands rendered from sinceTick (SPINE:283-285) | aspatial | instant, but DARK |
| SP-6 phrase-repetition envelope | per settlement per **season window** (SPINE:245-246) | soak | gate-time |
| SP-8 age layer | era drift with its own dwell, hysteresis (SPINE:477-482) | aspatial | **epoch**; unbuilt |
| CW-1 braid | window 13 weeks (`cascadeBraid.js:79`); COUPLINGS says it "braids when its window CLOSES, one edition late by design" (COUPLINGS:1651) | needs ≥3 receipts sharing one recorded ancestor across ≥3 registry layers. Recorded ancestors come from `sourceEventId`/`causedBy`, and `causedBy` has two engine writers (S18) | **seasonal** if the volume's "window closes" reading is built. The code's "CLOSED window" (`cascadeBraid.js:11-12`) reads as an inclusive interval, so the braid may be immediate (PLAUSIBLE, VERIFY). This is a felt-cadence question the owner should see: a one-month session may never see the braid of a cascade it caused |
| CW-2x walk | instant; horizon = pulseHistory **80 RECORDS**, wizardNews 240, turningPoints 24 (ARCH_CW S12:57) | aspatial | instant. **Retention is counted in records, not weeks**, so a busy realm forgets faster in calendar time (see §12 gap G4) |
| CW-3 | soak-side | soak | n/a |
| Couplings (COUPLINGS §2, §4) | treaty clock 52w (COUPLINGS:199); lie shelf-life 8 ticks; credibility half-life 52; FLIP_COOLDOWN 6 ticks; PATIENCE 78; incident half-life 4 ticks, bonds 156w (COUPLINGS:189-195); adoption 3-year rolling window (COUPLINGS:846-847); commons ladder 3-tick dwell (COUPLINGS:1148); interregnum cooldown 104w (COUPLINGS:1289) | mixed; the caravan/column/errand carriers are spatial (C-LAW-4) | **The felt drama of most signature stories is yearly or slower:** Story 1 "ten years on" (COUPLINGS:1844), Story 4 "their grandsons' silver" (COUPLINGS:1838), Story 6 "war in the spring" (seasonal). Stories 2, 3 and 5 are seasonal (the shrine season, the hungry season) |

**Flagged (felt drama at the seasonal or yearly clock):** SP-C posture, SP-5b stocks, SP-8, CW-1 (if built as the volume says), CPL-12 adoption, CPL-15 legitimacy/piety lag, CPL-21 succession repudiation (rare, yearly), and Stories 1/4/6. A DM advancing a few weeks between sessions sees these only as band words that rarely change.

## 8. DEPTH VS FELT VALUE

| Mechanism | What a DM sees | Judgment |
|---|---|---|
| SP-A bandedStock / bandFamilies / walkers | nothing directly; one decay law and one significance scale everywhere | **KEEP**. Cheap, already adopted by 20 / 12 modules |
| SP-B scarcity + conditions | believed-demand pacts, mistaken-court receipts (lit) | **KEEP** |
| SP-B devotion | nothing (dark); feeds faith_communion | **DEFER** lighting until WF-6 / WF-4 exist to consume it |
| Second-order belief (outbound impression / IN-1 mirror) | nothing (dark) | **CUT-TO-SENTENCE** until a lit consumer exists. The law stays; the engine is built |
| SP-B2 legs | nothing until sovereignty trade lights | **FOLD** into WR-10's lighting unit |
| SP-C posture + appetite | a colour word in pact and suspicion verbs; no news of its own; appetite starved | **FOLD** the posture into its consumers' receipts. **DEFER** the appetite stock's own crossing receipts until SEAM-0 feeds it |
| SP-D errand spine | envoys, missions, émigrés on the road | **KEEP** |
| SP-E kit (floors, envelope) | indirectly: fewer repeated sentences | **KEEP**. SP-E's heraldFeed migration (S12) is the owed unit |
| SP-6 headline + subheader | one causal gesture per headline | **KEEP and LIGHT**. It is built and pinned, and dark only by flag |
| SP-6 telling register + portable popup + manipulation disclosure | the chain behind a click; "planted by {house}, to {purpose}" | **KEEP** (the DM's fog-of-war instrument, derived, no state) |
| SP-6 mutated-plant compound state | "planted … grown in the carrying into …" | **CUT-TO-SENTENCE**. The seed-not-growth law stays; the compound rendering is rare |
| SP-6 Herald index (5 of 10 facets pending) | search | **DEFER** the pending facets |
| SP-6 dossier-native register + state-prose corpus + the town's foreign desk | prose on the town page (live: economy, warFaith desks) | **KEEP**. This is where the DM actually reads FP today |
| SP-8 age layer | era events in the Herald's grandest register | **DEFER** (J-D12 veto open; unbuilt; owner-signed tables) |
| CW-0 registry + walkers | nothing (gate) | **KEEP** |
| CW-1 braid | the measured 4-of-4 sentence | **KEEP and LIGHT** (owner's lighting call) |
| CW-2x | registry join, horizon line, layer tags, story harness | **CUT-TO-SENTENCE**, except **KEEP** the horizon-honesty split (true root vs retention cut), which a DM feels ("the trail runs past living memory"). The story harness duplicates CW-3's story-shape envelope |
| CW-3 measure | nothing until the owner's soak | **DEFER** (the owner's terminal phase); keep aliveness floors as law |
| The six signature stories | none renders end to end today (most links unbuilt: WF-7, INT-1, TR-4..7, POP-1/3, WF-2) | **KEEP as acceptance fixtures**, but re-grade each against what has landed. Stories 1/3/5 need TR-2..7 + INT-1 + WF-7 (none lit) |
| CPL "DECLARED EMPTY" sub-couplings (~45 lines) | nothing (by design) | **KEEP as law**. The rationale texts that cite "no coin / no prices" must be re-grounded (S16) |

## 9. VOCABULARY (closed ladders and enums the family mints or borrows)

| Name | Values | Line | Homonym risk |
|---|---|---|---|
| SP-6a SIGNIFICANCE | routine · notable · major | SPINE:220; `bandFamilies.js:75` | `heraldFilter.js` severityBand {**routine**, strained, critical} is a display band with the same bottom word (`bandFamilies.js:53`) |
| SP-6b SEVERITY | glancing · **telling** · grave · ruinous | SPINE:990; `bandFamilies.js:85` | ⚠ **`telling` is also the TELLING register** (SPINE:300-306, 428) and the verb family `degradeTelling` / "WORN IN THE TELLING" (SPINE:386; COUPLINGS:1014). One word, three meanings |
| SP-5b half-life ladder | a_season 13 · a_year 52 · a_few_years 156 · a_decade 520 · a_generation 1040 | SPINE:986; `bandedStock.js:57-76` | the CAUSAL time-band family (six bands, SPINE:592, "a generation's grudge") is a separate ladder that shares the word *generation* |
| crossing directions | rose · fell | `bandedStock.js:80` | — |
| Errand purpose classes | diplomatic · commercial · religious · factional · personal · covert | SPINE:37; ARCH_SP:234-238 | `covert` the purpose class vs `covert:true` the audience mark (ARCH_SP L6:79) |
| War purposes | sue · self_parlay | ARCH_SP:117 | — |
| Actor-class set (appetite) | settlement · house · temple (CLOSED) | SPINE:163-167 | ⚠ six appetite/tolerance readers exist in src: `courtRiskAppetiteOf` (`strategicPosture.js:303`), `riskAppetiteOf(npc, words)` (`npcLadderGoals.js:107`), `riskToleranceOf(npc)` (`roads/state.js:334`), `saleAppetiteOf` (`sovereigntyIntent.js:186`), `lendAppetiteOf` (`generosityReactions.js:485`), `appetiteOf` (`dispatchEV.js:259`). The CLOSED set covers one of them, and ES's registry uses the NPC one as a counterforce (`couplingRegistryEspionage.js:282`) |
| Posture | court posture (band = CHANNEL_BANDS at the composite) | ARCH_SP:617-620 | `occupationPostureOf` (`occupation.js:382`), undercity `postureOf` (`connectivity.js:232`), IN's HIDE posture / sightPostures (COUPLINGS:193), the "insular posture" channel (COUPLINGS:1078), and the COUPLINGS INTERIOR port's stale `postureOf` (COUPLINGS:195) |
| SP-5 confidence family | confidence-in-god · house credibility · domestic credit · source credibility | SPINE:185-191 | TRADE `books.credit` is a WEALTH band, "spelled distinct" (SPINE:192-195) |
| Belief conditions | tierBand · storesBand · routePositionBand · pullBand; consumer key `routeBand` | ARCH_SP:263-264, 466-474 | the supply key `routePositionBand` vs consumer key `routeBand`: a recorded trap |
| Pressure ladders | capacity `OVERFLOW_BANDS` vs intensity {quiet, present, pressing, decisive} (± unknown), the latter declared 9× | SPINE:1015-1028; ARCH_SP:364-372 | `pressed` vs `pressing` differ by one letter (SPINE:1027-1028) |
| Integrity register | CLEAN · WORN IN THE TELLING · PLANTED · (PLANTED-THEN-WORN) · UNKNOWN | SPINE:383-391, 405-410; ARCH_CW S9:54 | — |
| Causal edge warrants | planted · exposed · refused · breached · dissolved · caused (+ `followed` default) | SPINE:609-612 | — |
| Herald registers | HEADLINE · SUBHEADER · TELLING · (table) · DOSSIER-NATIVE | SPINE:313-320, 428-430 | see `telling` |
| Herald desks | war · faith · trade · knowledge · events · divination · adjudication | `heraldRouting.js:74` | `adjudication` is authority-routed, `sectionAuthority` ∈ {war_rulings, war_coalition, envoy, sovereignty} (ARCH_CW:297) |
| Age axes | War ↔ Peace; PIOUS ↔ SECULAR ↔ DYNAMIC (family CLOSED at two) | SPINE:474-476 | — |
| Matrix grades | LIVE · DARK · ADDS · ADDS (nil today) · EMPTY | COUPLINGS:218-224 | EMPTY is never used (§5 item 6) |
| GR-2 proposal triggers | trade_demand · faith_communion · migration_pressure · shared_threat ("the closed four") | COUPLINGS:718-719; SPINE:141-143 | — |
| Believed scarcity words | dear · fair · glut (family) | COUPLINGS:699 | EC's reference-price rungs ("triple or more") — PLAUSIBLE overlap, check against ARCH_EC |
| TRADE endings | fortune · ruin · monopoly · collapse · severance · cornered | SPINE:501 | `collapse` also in POP / sovereignty vocabularies (PLAUSIBLE) |
| POP popular arc | petition → gathering → refusal → riot | SPINE:516-518 | the built ladder is petition → gathering → riot; `refusal` is the POP-2 addition |
| Horizon / hop lines | NO_DEEPER_MEMORY · LEDGER_DARK_LINE · UNRECEIPTED_HOP · REDACTED_HOP · "the trail goes cold" · "the trail runs past living memory" | ARCH_CW S9:54; SPINE:732-748; COUPLINGS:1678, 1681 | two player-facing truncation sentences with different meanings (covert vs retention), by design |
| Coupling layers | war · trade · faith · populations · information · grammar · interior (closed at 7) | COUPLINGS:24; inclusion walker `couplingInclusion.walker.test.js:116-322` | the registry's `owningVolume` set and `CHARTERED_VOLUME_PREFIXES` (13) are wider than the 7 layers |
| Braid action | `cascade` (typed action) | COUPLINGS:1654; ARCH_CW:144 | — |

## 10. REFINEMENTS (in-place, dated-bracket idiom; never rewrite a law)

Base first: the kit copies are the ledger versions (see the provenance note). R-1 is already applied on master; carry it, don't duplicate it.

1. `[SPINE:80-81]` — "`alignmentOf(id) → { lawfulness01, malice01 }` (beliefMap.js:915," → master's text already reads `settlementAlignment(item, worldState)` (master SPINE:80-83). **Port master's sentence to the ledger copy verbatim** rather than writing a new bracket — reason: ARCH_SP R1 erratum owed (ARCH_SP:142), already discharged on one branch only.
2. `[SPINE:120]` — "`spatialLedgers.errands`, one writer" → `[CORRECTED 2026-10-16 (coherence fold) — the ledger lives at top-level worldState.envoyErrands (worldState.js:483); SP-1 generalizes it IN PLACE per J-SP-2 / ARCH_SP seam ruling 2; spatialLedgers.errands is descriptive, never an address.]` — reason: the erratum owed since 2026-08-04 (ARCH_SP:15-16, 929-933).
3. `[SPINE:171]` — "`postureOf(settlement)` + `riskToleranceOf(actor)`" → `[CORRECTED 2026-10-16 (coherence fold) — built as courtPostureOf / courtRiskAppetiteOf (strategicPosture.js:222, :303) under chair ruling CR-C4-1; riskToleranceOf is the roads NPC read (roads/state.js:334) and is held single-definition by postureNameCollision.walker.]` — reason: ARCH_SP:795-796 "the constitution owes the erratum".
4. `[SPINE:8-9]` — "Implementation = the external implementer (Sol)" → `[CORRECTED 2026-10-16 (coherence fold) — implementation runs as chair-dispatched lane seats under docs/OPERATING_STANDARD.md; "Sol" is historical.]` — reason: stale actor; COUPLINGS:19-20 says the same and takes the same bracket.
5. `[SPINE:10-13]` — "The six program volumes … and the coupling volume … are BOUND BY THIS DOCUMENT" → `[CORRECTED 2026-10-16 (coherence fold) — the binding extends to every DESIGN_FP_ARCH_* volume and every later FP program volume (ES, WY, HB, WC, EP, EC, MF, LG, PG, CN, POP, INT and successors); a volume that declares itself outside the twelve says so in its header with the reason.]` — reason: §12 G1.
6. `[SPINE:560-561]` — "Pairs with no designed coupling are DECLARED empty" → `[CORRECTED 2026-10-16 (coherence fold) — no pair is empty at direction grain (COUPLINGS §3 grades all 42 LIVE/DARK/ADDS); declared-empty lives at SUB-coupling grain inside §4, and the registry enforces it only as absent (module, module) pairs.]` — reason: §5 item 6.
7. `[SPINE:1001-1004]` (the SP-A record) — no change; it is the correct record. **Point ARCH_CW:346 and :526-529 at it:** `[CORRECTED 2026-10-16 (coherence fold) — not blocked: SP-6a's three-band scale was always live (SPINE §6 SP-A ⚠1) and CW-1 LANDED 2026-09-24 @ 155da82f2, dark (cascadeGovernorEnabled).]` — reason: §5 item 5.
8. `[ARCH_SP:12-13]` — "Status: ARCHITECTURE. Nothing here is scheduled" → `[CORRECTED 2026-10-16 (coherence fold) — SP-A 59df13a97, SP-B 4c0f2f38b, SP-B2, SP-C cbd348a50, SP-D 0aac6792/57fe385b (+SP-D2 3fd25f5df), SP-E 7a77c84ba LANDED; SP-F non-wave; scarcity+conditions LIT (FP_LIT_BELIEF); devotion, posture, errand spine DARK.]` — reason: §2.
9. `[ARCH_SP:16]` — "three cases measured in §2" → `[CORRECTED 2026-10-16 (coherence fold) — four (R1–R4).]` — reason: §5 item 3.
10. `[ARCH_SP:523]` — "`ES-4-DISTANT-SOURCE-EVIDENCE`, ABSENT today" → `[CORRECTED 2026-10-16 (coherence fold) — PRESENT: espionageDistantSourceEs4.test.js:400 carries it as an it-title; the CR-WR10-H condition is satisfiable; sovereigntyTradeEnabled remains lit in no preset.]`
11. `[ARCH_SP:797-799]` (J-SP-6) — "second-order belief has no flag" → `[CORRECTED 2026-10-16 (coherence fold) — the veto arm was taken at IN-1: secondOrderBeliefEnabled is manifested; the outbound-impression read stays flagless, its consumer is gated.]`
12. `[ARCH_SP:39]` — "`pulseKernel.js` (measured 2,820 lines" → `[CORRECTED 2026-10-16 (coherence fold) — 1581 EFFECTIVE, banked permanently (scripts/.size-baseline.json:13, R-BLD-10); raw counts are not the enforcer's measure.]`
13. `[ARCH_SP:129]` (V21) — "grep `kmPerWeek|MODE_SPEED` → zero hits" → `[CORRECTED 2026-10-16 (coherence fold) — the mode table landed with WY-1 at src/domain/spatial/modeSpeeds.js.]`
14. `[COUPLINGS:22-29]` (status) → append `[CORRECTED 2026-10-16 (coherence fold) — the live map is the coupling REGISTRY (68 rows, src/domain/certification/couplingRegistry*.js); this volume is its design; CW-0w/CW-1 LANDED; CW-2 is RE-SCOPED to CW-2x (DESIGN_FP_ARCH_CW §1 S9, ratified in the fold as #59); CW-2x and CW-3 unbuilt.]` — reason: §5 item 9, and ARCH_CW Q1 asked for exactly this line.
15. `[COUPLINGS:69-80]` (pair anchors) — add `[CORRECTED 2026-10-16 (coherence fold) — the registry minted CPL-22 (TRADE→GRAMMAR, couplingRegistryEspionage.js:125) and CPL-23 (FAITH→WAR, couplingRegistryWar.js:661) although CPL-10 and CPL-2 are those pairs, and CPL-20.INFO_TO_INFO (within-layer). Owner of the fix: the chair re-anchors or rules a within-layer/extension anchor family; the pair id needs a closure pin beside CHARTERED_VOLUME_PREFIXES.]`
16. `[COUPLINGS:195]` — "postureOf/blocDecisionFactor (settlementPolitics, dark)" → `[CORRECTED 2026-10-16 (coherence fold) — settlementPolitics exports blocDecisionFactor (settlementPolitics.js:628) and no postureOf; the court posture read is SP-C's courtPostureOf.]`
17. `[COUPLINGS:194, 199, 205, 469]` — "11-term catalog, 7 families … sole mint = war-exit PASS 1 … pulseKernel.js:2371" → `[CORRECTED 2026-10-16 (coherence fold) — 26 term types / 13 families (GR-3 landed); peacetime formation LIT (pactFormationEnabled); the treaty advance is pulseKernel.js:2752 advanceTreatiesWithDisposition.]`
18. `[COUPLINGS:283]` — "trade_exclusivity/market_access/toll_exemption, zero hits" → `[CORRECTED 2026-10-16 (coherence fold) — minted by GR-3 as exclusivity / market_access / toll_exemption (peaceTermsCatalog.js:306, 447-448); spelling `exclusivity`, never `trade_exclusivity`.]`
19. `[COUPLINGS:308-310]` (and 608, 654, 698) — "no numeric price exists to panic (owner's no-coin ruling" → `[CORRECTED 2026-10-16 (coherence fold) — the no-coin ruling was REVERSED by the owner (ODQ §731.1, W-COIN); the empty now rests on finite semantics and EC's banded reference price (ODQ §934.90 addendum 3), not on the absence of coin.]` — reason: S16. The owner's words stay where they are; only the rationale is re-grounded.
20. `[COUPLINGS:1107-1109]` — "people are never the PAYMENT" → `[CORRECTED 2026-10-16 (coherence fold) — except the owner's tribute_population (the bracket below, COUPLINGS:1110-1112): anonymous population columns as a levy term; persons and named cast stay out.]`
21. `[COUPLINGS:1831-1851]` (§9) — "Grain is dear in the east, they say …" / "There was gold in the river, men said." → `[CORRECTED 2026-10-16 (coherence fold) — under the Herald TRUTH LAW (SPINE:345-372) "they say / men said" is rumour-mill register; the Herald forms report the believing as the true event ("…, men said — and they were wrong"). Lines 1833 and 1848 read as riddles under the owner's EVIDENCE LAW (10-02/10-03, "complete, not cryptic"); re-author at build.]` — reason: two later owner laws bind these sentences.
22. `[ARCH_CW:557-562]` (SC-7) — "a THIRTEENTH now reds" → `[CORRECTED 2026-10-16 (coherence fold) — ENC admitted thirteenth; point at CHARTERED_VOLUME_PREFIXES (couplingRegistry.test.js:119); EC, WC, EP, LG, PG, MF, CN are NOT chartered.]`
23. `[ARCH_CW:41]` (S1) — "178-line COMPOSING HEAD over six desk leaves" → `[CORRECTED 2026-10-16 (coherence fold) — 284-line head + six leaves + schema; 68 rows.]`
24. `[fold DESIGN_FP_ARCHITECTURE.md:1013-1019]` — "`strategicPosture.js` (postureOf … **BLOCKED ON Q1**" → `[CORRECTED 2026-10-16 (coherence fold) — Q1 RULED (CR-C4-1): courtPostureOf / courtRiskAppetiteOf; SP-C LANDED cbd348a50, dark.]`
25. `[SPINE:822-832]` (lane P record) — "FIVE OF THE SIX DESKS ARE UNWIRED … NO COMPONENT CONSUMES THE READER" → `[CORRECTED 2026-10-16 (coherence fold) — superseded: power/defense/general/stressors desks exist in stateProse/ and EconomicsTab/WarFaithDesk consume the reader.]`

## 11. OPEN QUESTIONS FOR THE OWNER (only what is his)

1. **Lighting the two built voices.** CW-1's braid (READ 3 scored its sentence 4 of 4, board:193) and SP-6's causal headline + popup are built, pinned, and dark (`cascadeGovernorEnabled`, `heraldCausalVoiceEnabled`). Lighting them is a disclosed display shift and the owner's call. Recommendation: light both in the presets that carry the belief chain.
2. **`tribute_population`** (owner order 2026-08-02, COUPLINGS:1110-1112) is unbuilt (0 hits in src) and unscheduled in ARCH_GR. Is it still wanted, and in which GR unit?
3. **SP-8 / J-D12 the age layer** is "veto open" (SPINE:467; `DESIGN_REALM_DIRECTIVES.md:1511`), unbuilt, and absent from FP-ORDER. Keep it in the sequence, defer it past launch, or retire it? (The ERA-PRESET-ELIGIBLE marking obligation stands or falls with it; §12.)
4. **The felt-cadence law (G2 below)** is a product rule about what a DM must see within one session's advance. It reshapes CW-1's window semantics and every yearly-clock mechanism's voice, so it is the owner's to set, not a chair amendment.
5. **J-SP-2, the errand ledger home** (owner-gated persistence shape, ARCH_SP:771-774). The tree has lived on `worldState.envoyErrands` since WR-7 with 14 consumers. Confirm "keep" so the constitution erratum (refinement 2) can be written as settled.

## 12. THE CONSTITUTION'S OWN GAPS

**What the twelve (plus 13/14) do not state but the corpus needs**, each with the evidence that the gap bites:

- **G1 — THE BINDING-SCOPE LAW.** SPINE binds by name only *"The six program volumes … and the coupling volume"* (SPINE:10-13). The fold already compiles THIRTEEN programs (`DESIGN_FP_ARCHITECTURE.md:5-9`), and the kit holds EC, MF, LG, PG, CN and POP/INT-arch on top. Counts (CONFIRMED as counts, PLAUSIBLE as adherence): "twelve requirements" is cited by 0 later volumes except EC (3); `DESIGN_FP_SPINE` is cited by 0 of ES, EP, HB, WC, WY, MF, LG, PG, CN. **Needed:** "every FP volume, present and future, is bound; a volume outside the twelve says so in its header with the reason."
- **G2 — THE CLOCK-VS-DM-CADENCE LAW.** Req 9 denominates every clock against INTERVAL_WEEKS (SPINE:54-60) but never against the DM's advance (week / month / season / year, `RealmForecast.jsx:24`). Many mechanisms in this family are felt only yearly or slower (§7: SP-C 156w, SP-5b stocks, Stories 1/4/6, CW-1's 13-week window). The four experience reads found lit layers "nearly silent at the table" (FP-ORDER chain-first amendment). **Needed:** every mechanism declares its FIRST-VISIBLE LATENCY in DM advances (a one-month advance must surface at least its fast-layer sign: a band word, a beat, a dossier line), plus its slow verdict. The two-timescale echo (SPINE:58-60) becomes measurable at the session grain.
- **G3 — THE TIER / ASPATIAL DECLARATION LAW.** Nothing requires a mechanism to declare what world it needs: aspatial, spatial canon (km scale, route network), an infoMode that records beliefs, or a host layer lit. The code already partitions lighting by capability sets (`simulationRules.js:764-786`: FP_LIT_ALIVE / FP_LIT_BELIEF / FP_LIT_WARPEACE, with the "HELD DARK ON PURPOSE" reasons). SP-B is inert under omniscient presets (ruling FP-24). SP-D needs route plans. WY-1 is data-gated on `spatialDigest.kmScale` (fold:1042-1044). **Needed:** a **Tier line** per wave (aspatial-safe? / spatial-canon / belief-mode / host flags), plus the degraded arm in the lesser tier, in the same way req 13 forces an Alignment line. The paid-tier sense of "tier" (the owner's 10-02 demo tiers: anonymous = town, free = village + town) is also unaddressed by any requirement; COUPLINGS §1a's "premium isolation + audience projection" (COUPLINGS:100-101) is a war-volume law, not one of the twelve.
- **G4 — THE RETENTION-HORIZON LAW.** Req 9 lists cadence, dwell, half-life and duration, but not RETENTION. The rings are counted in RECORDS (pulseHistory 80 at `worldState.js:16`; wizardNews 240; turningPoints 24; MAX_PROVENANCE_EDGES sized to 80, ARCH_CW S7/S12). So req 7's "walks backward link by named link" is silently capped by event density, not by time, and a busy realm forgets faster in calendar weeks. **Needed:** every ring declares its horizon in INTERVAL_WEEKS at a measured event rate, or is re-denominated.
- **G5 — THE TUNING-EVIDENCE LAW.** SP-6's two standing rules force every band into a §7 table with an owner signature (SPINE:223-229). Nothing requires a constant to be SET from evidence. The FP-ORDER chain-first amendment had to add it outside the constitution: "bands every new constant against a measured spread at build time (never 'absent means zero' without a dormancy reason written down)". The board counts 255 tuning tables (board:198). **Needed:** each band row carries its measured spread (seed family, preset, window) or the word UNMEASURED, and the owner signs measured rows only.
- **G6 — THE LIT-PROOF (FELT) LAW.** Req 6's dossier round-trip pin and req 11's tellable list are fixture-level. No requirement says a mechanism is incomplete until a seeded LIT world shows its sentence to a DM. **Needed:** "a mechanism is done when its DM-felt sentence fires in a lit preset on a seeded world and an experience read scores it": the chain-first rule, constitutionalised.
- **G7 — THE PROVENANCE-ADOPTION LAW.** Req 7 demands receipt traceability. The SEAM that makes it machine-walkable (`causedBy` / `sourceEventId` at mint, provenanceKernel) lives only as ARCH_CW's SC-6 pre-pin (ARCH_CW:544-551). Result: 0 volumes mention `causedBy`, and src still has two engine writers (§6 S18). CW-3's own envelope will red `chainDepthDegenerate` by design. **Needed:** req 7 names the seam: every child receipt of a known outcome populates `causedBy` at its mint.
- **G8 — THE COUPLING-IDENTITY LAW.** Req 8 points at a map closed at SEVEN layers (COUPLINGS:24). The estate now has 13+ programs, the registry has invented CPL-22/23 and an INFO→INFO row (§4 X15), and `CHARTERED_VOLUME_PREFIXES` excludes EC, WC, EP, LG, PG, MF and CN. **Needed:** (a) a rule for which layer a new program's modules belong to (ES→INFO, EC→TRADE, WC→WAR, …), written once; (b) a pair-id closure pin (1..21, or a declared extension family); (c) a same-commit chartering rule for new prefixes.
- **G9 — THE VOCABULARY-REGISTER LAW.** R5 closes significance and severity, and SP-5b closes stock shapes. No law covers the NAMES of closed ladders across volumes: `telling` carries three meanings, six appetite readers exist, five posture readers exist, and `pressed`/`pressing` differ by one letter (§9). **Needed:** a corpus vocabulary register (ladder name → values → home) with a homonym check at mint, the J-WR-10-B borrow census generalised.
- **G10 — THE ENGINE-STATE LIFECYCLE LAW.** Req 14(b) demands lifecycle survival for DM EDITS only (SPINE:100-101). The six-path discipline (create / read / persist / regen / undo / migrate / import / veil) for ENGINE-written state lives in ARCH_SP L4 and §4 (ARCH_SP:64-69, 281-320), not in the constitution, although it is "the estate's most-bitten class" (SPINE:101). **Needed:** promote L4's Lifecycle-paths clause into the twelve.
- **G11 — THE ERRATUM-APPLICATION LAW.** SPINE says a conflict "is a bug to report" (SPINE:12-13), with no rule that a reported erratum is APPLIED. Three errata owed since 2026-08-04 / 08-06 (R1, R2, R3/CR-C4-1) are unapplied in the kit/ledger copy, and only R1 is applied on master. **Needed:** an erratum reported against the constitution lands as a dated bracket in the same commit as the ruling that makes it true.
- **G12 — THE PROSE-LAW POINTER.** Req 11 (narration parity) predates the owner's EVIDENCE LAW (10-02, amended 10-03, "complete, not cryptic", scope widened to "anything that has constructed prose") and the voice program ("actions not … potential"). COUPLINGS §9's contract sentences already fail them (refinement 21). **Needed:** req 11 points at `docs/VOICE_AND_TONE.md` pillar 10 as binding on every phrased kind.

**Requirements the later volumes systematically fail** (grep counts over the kit copies; CONFIRMED as counts, PLAUSIBLE as semantic failure, because a volume may phrase a requirement differently):

| Requirement | Volumes with ZERO occurrences of its marker |
|---|---|
| Req 2 counterforce (`counterforce` / `counter-force`) | ARCH_EP, ARCH_WY, ARCH_ES, ARCH_GR, ARCH_INT, ARCH_LG, ARCH_MF |
| Req 12 pacing (`pacing` or `significance`, the broad pattern) | ARCH_EP, ARCH_WY, ARCH_MF, ARCH_CN, ARCH_LG, ARCH_PG |
| Req 13 alignment (any `alignment` / `req 13`, the broad pattern) | ARCH_LG, ARCH_PG. ARCH_WC carries 15 hits of the word but 0 of `req 13` / `Alignment line`, so its per-wave Alignment lines need a reader check |
| Req 14 edit verb (`req 14` / `edit verb` / `edit story`) | ARCH_WC (431 KB), ARCH_WY, ARCH_MF, ARCH_CN, ARCH_LG, ARCH_PG |
| Req 8 CPL anchor (`CPL-n`) | ARCH_EC, ARCH_EP, ARCH_ES (although ES owns 13 registry rows), ARCH_HB, ARCH_WC, ARCH_WY, ARCH_GR, ARCH_MF, ARCH_CN, ARCH_LG, ARCH_PG |
| SP-8 ERA-PRESET-ELIGIBLE marking | **every volume except the SP family** |
| SC-6 `causedBy` adoption | **every volume** (ARCH_WF, GR, TR, POP, INT, IN, ES, EP, WY, EC, WC, HB) |
| SP-5b shared stock idiom (`bandedStock` / `SP-5b`) | ARCH_EC (the newest volume, which "absorbs TR", whose house books/credit were SP-5b's named first instances, SPINE:192-195) |

## 13. THE COUPLING SPINE: every coupling COUPLINGS declares

**Key for "landed?":** **LIVE** = pre-program substrate the volume's EXISTS block receipts (lit today, per the volume; not re-verified row by row). **DARK** = the volume says built and flag-dark. **BUILT-LIT / BUILT-DARK** = the owning wave's flag is in `ENGINE_GATED_VIRTUAL_RULE_KEYS` at master, and lit or not in a preset. **ROW** = a CW-0 registry row exists at master (id quoted). **UNBUILT** = the owning wave's flag or module is absent at master. **EMPTY** = a declared-empty sub-coupling (C-LAW-8: building it is a STOP). Owner-wave status comes from the flag census (`simulationRules.js:230-…`) and the 68-row registry census. Per-row code reads beyond those are PLAUSIBLE unless a line is given.

| CPL | From → to | Read | Receipt | Counterforce (same evidence) | Landed? |
|---|---|---|---|---|---|
| 1 | WAR→TRADE | hostile-gate interception/seizure (supplyShipments routeIntercepted; smuggle one-roll) | seizure conserved into seizer's stock; starvationReceipt | — (physics) | LIVE |
| 1 | WAR→TRADE | siege interdiction `supplyInterdictionLevel` | siege verdict | — | LIVE |
| 1 | WAR→TRADE | war treaties move conserved grain (treatyTransfer) | delivered === extracted | spoilage sink; reserve floor | LIVE. ROW `CPL-1.WAR_TO_TRADE.WR-6.coalition_settlement` |
| 1 | TRADE→WAR | tradeSalience dampens hostility | — | the same edge scores both ways | LIVE |
| 1 | TRADE→WAR | contested trade flip → war intent via the one opener | intent receipt | CONQUEST_MARGIN gate | LIVE |
| 1 | TRADE→WAR | TR-1 casus commercii (severance↔partnership mirrors) | commercial casus | severance mirrors partnership | BUILT-DARK (`casusCommerciiEnabled`). ROW `…TR-1.severance_pressure` |
| 1 | TRADE→WAR | WR-4 home front reads partners lost / route decay | war-cost receipt | — | ROW `…WR-4.home_front_trade` |
| 1 | TRADE→WAR | WR-6 expenditure prices allied trade | expenditure | — | ROW `…WR-6.coalition_expenditure` |
| 1 | TRADE→WAR | TR-4 grain road makes the blockade material | intercepted grain | — | UNBUILT |
| 1 | — | trade→war auto-war; war→trade price panic | — | — | EMPTY (the price-panic rationale is stale, S16) |
| 2 | FAITH→WAR | sacred_claim over CLAIM_BY_QUADRANT (`warReasons.js:804`) | casus receipt | common_rite at the opposite pole; patronSecurity | LIVE |
| 2 | WAR→FAITH | occupation faith-pull; war carrier channels; forced flip stains legitimacy | conversionOutcome | — | LIVE |
| 2 | WAR→FAITH / FAITH→WAR | sacred_claim dissolution on patron_anchor_changed | dissolution receipt | — | DARK (`warTerminationEnabled`). **WF-1d names the fall**: ROW `CPL-23.FAITH_TO_WAR.WF-1d…` (wrong anchor; X15) |
| 2 | GRAMMAR→WAR | faith terms end holy wars (GR-3 rows + WF-6 executors) | treaty | `shared_rite` compact | GR-3 rows BUILT; WF-6 UNBUILT |
| 2 | FAITH→WAR | WF-2 pilgrims/legates as targets; WR-8 deity judgment; J-WR-14 atrocity casus | interception, casus | — | WF-2 UNBUILT; WR-8 PLAUSIBLE-built (not verified) |
| 2 | — | divine verdict from battle; holy-war gate waiver | — | — | EMPTY |
| 3 | WAR→POP | war dead conserved; sack split; M4 crisis flight; refugee rumour carriers | departure line | — | LIVE |
| 3 | POP→WAR | realm pressure → resource_pressure casus via perceivedScarcityOf | `mistaken` clause | capability floor 0.20 (wants more, can less) | LIVE |
| 3 | POP→WAR | WR-3 lineage claims on overflow foundings | lineage receipt | — | ROW `CPL-3.POP_TO_WAR.WR-3.lineage` |
| 3 | POP→WAR | WR-4 home-front hands; WR-6 people spent | war-cost | — | ROWs `…WR-4.home_front_hands`, `…WR-6.coalition_people_spent` |
| 3 | WAR→POP | WR-8 razing via the sack cause class | sack demographic receipt | escape share conserved | PLAUSIBLE (not verified) |
| 3 | POP→WAR | POP-5b LEVY PERMIT `moverPermitted(grade,'levy')` | muster refusal naming grade | the caller's demand off the same viability | UNBUILT |
| 3 | WAR→POP | POP-4 plague arc; POP-5a road drama; POP-3 departure memory | arc / road / memory receipts | — | UNBUILT |
| 3 | — | massacre outside R's gate; levy manpower arithmetic | — | — | EMPTY |
| 4 | INFO→WAR | belief-wrapped chooser; `belief_misjudgment`; compromised ally leaks | "marches on a misjudgment" | credibility asymmetry | LIVE |
| 4 | WAR→INFO | front re-prices rumours; Blainey discount; garrison bluff | infowar beats | LIE_FALL 5 blowback | LIVE |
| 4 | INFO→WAR | WR-4 believed trajectory; WR-6 alliance-web risk | — | — | ROWs `CPL-4.INFO_TO_WAR.WR-4.believed_trajectory`, `…WR-6.alliance_web_risk` |
| 4 | INFO→WAR | IN-2 THE LURE; IN-1 mirror; IN-0 PLANT_WIRING; IN-3 counter-game; IN-5 grievance naming | lure/exposure receipts | corroboration refutes, charges planter | IN-2 / IN-1 / IN-3 BUILT-DARK; IN-0 ROWs (`IN-0a`, `IN-0c`); IN-5 knowledge desk BUILT |
| 4 | WAR→INFO | IN-4 army-arrival race; ES-5 doctrine moral ladder | race outcome | — | ROWs `CPL-4.WAR_TO_INFO.IN-4.army_arrival_race`, `…ES-5.doctrine_moral_ladder`; IN-4 BUILT-DARK |
| 4 | — | forged war orders | — | — | EMPTY (J-CPL-8) |
| 5 | WAR→GRAMMAR | war-exit mint; enforcement bites; repudiation; mediation; coalition peel | treaty_signed / breached | compliance fog both ways; face-saving exits | LIVE. ROWs `CPL-5.WAR_TO_GRAMMAR.WR-5/6/7.*` (6) |
| 5 | WAR→GRAMMAR | GR-2 shared-threat trigger; GR-6 intent broker | pact formation; mediation | dependency fear | BUILT-LIT. ROWs `…GR-2.shared_threat`, `…GR-6.intent_broker` |
| 5 | GRAMMAR→WAR | treaty blocks/caps; carried sheet; home delivery; mutual defence; soft gate; seal grace | enforcement | — | ROWs `CPL-5.GRAMMAR_TO_WAR.*` (6, incl. GR-3 mutual_defense, GR-6 soft_gate) |
| 5 | GRAMMAR→WAR | GR-0 expiry receipt; GR-1 oath identity; GR-5 renegotiation | lifecycle voice; "sworn under X" | the heir who honours | GR-0 BUILT-LIT (`treatyLifecycleVoiceEnabled`, PLAUSIBLE mapping); GR-1 BUILT-LIT (`oathHolderEnabled`); GR-5c BUILT-LIT (`treatyRenewalEnabled`) |
| 5 | — | congress; ceasefire object | — | — | EMPTY |
| 6 | WAR→INTERIOR | war sentiment → coup hold 0.22; reinforcement costs legitimacy; climb-down hits | coup verdict | sustainable war raises the hold (same read) | LIVE |
| 6 | INTERIOR→WAR | legitimacy_hunger casus; treaty-burdened war party / commerce peace pull | casus line | — | LIVE / DARK (`settlementPoliticsEnabled`, manifested) |
| 6 | INTERIOR→WAR | WR-5 books / refusal / re-read; WR-6 coalition books / coffers; WR-4 institutions; WR-6e irregulars | — | momentum discount | ROWs `CPL-6.INTERIOR_TO_WAR.*` (5) |
| 6 | WAR→INTERIOR | WR-5 war-decision grievance; WR-6 coalition relationship | grievance | — | ROWs `CPL-6.WAR_TO_INTERIOR.*` (2) |
| 6 | INTERIOR→WAR | INT-1 seatBooks; INT-3 veto; INT-4 king-who-paid; WR-2 decay | veto/strain receipts | both-polarity veto | UNBUILT (`seatBooksEnabled` absent) |
| 6 | — | praetorian garrison coup | — | — | EMPTY |
| 7 | FAITH→TRADE | conscience embargo (EMBARGO_FLOOR 0.15); relational contraband; moral-institution pressure | — | exit when the institution closes | LIVE |
| 7 | TRADE→FAITH | trade edges as conversion carriers; temple-mediated relief warmth | conversionOutcome | — | LIVE |
| 7 | TRADE→FAITH | WF-7 THE TITHE (FAITH-owned executor; TRADE stream port where TR-4 lit) | tithe band crossing | tolerance/abhorrence reads provenance | UNBUILT (`titheEnabled` absent) |
| 7 | TRADE→FAITH | TR-6 moral drift prices profiteering | conscience stain | the temple refuses the tainted gift | UNBUILT |
| 7 | — | indulgence market; blessed-goods price tier | — | — | EMPTY (rationale partly stale, S16) |
| 8 | TRADE→POP | K_food import arm (ARTERY_IMPORT_FACTORS); prosperity pull; relief-creditor draw | hungry_gap; import_shortage | capacity truth (competeForDestinations) | LIVE |
| 8 | POP→TRADE | migration columns in J2 flows; population as demand | flow attribution | — | LIVE |
| 8 | TRADE→POP | TR-4 grain road; GR-3 `settlement_provision` / `labor_compact`; POP-1 believed conditions; POP-5b trade permit | caravan / pact / disappointment | the boomtown shrinks by the same K_food | GR-3 rows BUILT; TR-4 / POP-1 / POP-5b UNBUILT |
| 8 | — | rumour moves grain; per-capita price | — | — | EMPTY |
| 9 | INFO→TRADE | dispatch refusal reads BELIEVED danger; charter scores the known picture | refusal | arrivals as independent witnesses | LIVE |
| 9 | TRADE→INFO | trade carriers move rumours; intel_transfer to trade desk; brokerage books | — | — | LIVE |
| 9 | INFO→TRADE | TR-3 believed markets over SP-2 believed scarcity | believed dearness | stamp ladder 1.000→0.465 | BUILT-DARK (`believedMarketsEnabled`); SP-B scarcity BUILT-LIT. ROW `CPL-9.INFO_TO_TRADE.TR-3.believed_dearness` |
| 9 | TRADE→INFO | IN-4 reputation race at the market gate | race outcome | — | BUILT-DARK. ROW `CPL-9.TRADE_TO_INFO.IN-4.reputation_race` |
| 9 | INFO→TRADE | IN-0 HIDE trade tax; IN-2 planted scarcity; SP-5 house credibility (the run) | — | SEE/HIDE symmetry | IN-0 PLAUSIBLE; IN-2 BUILT-DARK; house credibility UNBUILT |
| 9 | — | numeric price feed; house SELL spammer | — | — | EMPTY |
| 10 | TRADE→GRAMMAR | GR-2 `trade_demand` trigger | pact formation | compliance fog; severance mirror | BUILT-LIT (`pactFormationEnabled`) |
| 10 | GRAMMAR→TRADE | GR-3 trade term rows; TR-5 pact lane; GR-0/4/5 lifecycle | treaty document | — | GR-3 rows BUILT (`exclusivity`, `market_access`, `toll_exemption`); TR-5 UNBUILT. The registry put an ES TRADE→GRAMMAR row under **CPL-22**, not CPL-10 (X15) |
| 10 | — | spot market / auction; auto-signing dependency | — | — | EMPTY |
| 11 | TRADE→INTERIOR | merchant seats; commerce blocs (dark); merchant faction domains | contest receipts | commons read seated corruption (0.35) | LIVE / DARK |
| 11 | TRADE→INTERIOR | TR-2 THE HOUSE (books, appetite, factors); TR-7 ventures; SP-4 posture colours the house | venture receipts | outcome-learned reversal | TR-2 BUILT-DARK (`merchantHousesEnabled`, "no pulse mount yet", `simulationRules.js:782-786`); TR-7 UNBUILT |
| 11 | INTERIOR→TRADE | INT-1 seatBooks → TR-7 venture appetite (RESERVED) | receipt naming seatBooks | — | UNBUILT. ⚠ the registry's CR-FP-11 OWED row `commercialReasons.js → relationshipState.js` (INTERIOR→TRADE, TR-1) is unminted (ARCH_CW:261-271) |
| 11 | — | faction route/institution ownership; house→seat bribery verb | — | — | EMPTY (J-CPL-7) |
| 12 | FAITH→POP | crisis conversion; revival arm; pilgrimageDraw (computed then discarded) | — | — | LIVE |
| 12 | POP→FAITH | traditions adoption ≥12% / 3 yrs; refugees prefer near cultures | adoptedFrom rite | tier-capped threshold; comfort drift | LIVE |
| 12 | FAITH→POP | WF-2/2a pilgrims + feast economy; WF-5b covert congregation flight; POP-3 diaspora rite; POP-1 refuge pull | pilgrim receipts | — | UNBUILT (`pilgrimageEnabled` absent) |
| 12 | — | faith-commanded resettlement; natalist piety | — | — | EMPTY |
| 13 | INFO↔FAITH | faithLabel / observanceLabel stale beliefs; divergence envelope | — | — | LIVE |
| 13 | FAITH→INFO | WF-4 omen reads (belief writes); SP-2 believed devotion; IN-2 planted devotion; WF-8 voices | reading receipts | the failed-prophecy ledger | SP-B devotion BUILT-DARK; WF-4 / WF-8 UNBUILT |
| 13 | — | true divination | — | — | EMPTY |
| 14 | FAITH→GRAMMAR | faith-brother mediation; common_rite peace reason | — | schism-axis blocks communion | LIVE |
| 14 | GRAMMAR→FAITH | GR-3 faith rows; WF-6 executors; `faith_communion` trigger; GR-6 mediation | compact = treaty doc | duress stain | GR-3 BUILT. ROW `CPL-14.GRAMMAR_TO_FAITH.GR-3.faith_grants`; GR-6 BUILT-LIT; WF-6 UNBUILT |
| 14 | — | conversion-mandate term; temple as party | — | — | EMPTY (J-CPL-6) |
| 15 | FAITH→INTERIOR | divine mandate → legitimacy (soak-proven coup chain); ruler stance 42%; clergy reveal sharpen | mandate lines | the same ruler-stance state; heresy decay | LIVE |
| 15 | FAITH→INTERIOR | WF-1 unseating types the fall; INT-7 crossings; WF-5 schism; INT-6 forgiveness | fall cause | — | WF-1 BUILT-LIT (`faithUnseatingEnabled`); INT-6/7, WF-5 UNBUILT |
| 15 | — | state-church object; excommunication verb | — | — | EMPTY |
| 16 | POP→INFO | columns as rumour carriers; migration_flight rumours | rumour beat | — | LIVE (`migrationRumorsEnabled` manifested) |
| 16 | INFO→POP | POP-1 believed road; letters home; POP-5a lost-column inference; IN-2 planted wealth; IN-4 race | disappointment receipts | letters as independent witnesses | UNBUILT (POP-1); IN-2/IN-4 BUILT-DARK |
| 16 | — | rumour moves capacity; boosterism actor | — | — | EMPTY |
| 17 | POP→GRAMMAR | GR-2 `migration_pressure` trigger | pact formation | GR-2 dependency fear | BUILT-LIT |
| 17 | GRAMMAR→POP | GR-3 `migration_right` / `labor_compact` / `settlement_provision`; POP-5b permit lanes | delivery against the conservation identity | refusal at formation `no_overlap` | GR-3 BUILT. ROW `CPL-17.GRAMMAR_TO_POP.GR-3.population_grants`; POP-5b UNBUILT |
| 17 | GRAMMAR→POP | owner's `tribute_population` | — | — | UNBUILT (0 hits) |
| 17 | — | hostage surety; serfdom transfer | — | — | EMPTY (contradicted by the owner override, §5 item 7) |
| 18 | POP→INTERIOR | commons voice kernel (petition→gathering→riot) | commons beats | answered petition; 3-tick dwell | DARK |
| 18 | INTERIOR→POP | POP-2 refusal rung; POP-5b institution permit; seatBooks permit posture; INT-3 émigré | refusal receipts | the same grievance → emigration | UNBUILT (INT-3b émigré errand exists: `emigreErrand.js`) |
| 18 | — | crowd at the treaty table; servile-war arc | — | — | EMPTY |
| 19 | INFO→GRAMMAR | lie-bought pact (believedMarginAtSignature); compliance fog; disclosure seam | treaty record | send-two corroboration; Blainey | LIVE |
| 19 | INFO→GRAMMAR | WR-7 envoy picture plant / moving picture; GR-2 believed demand; GR-4c breach credibility; GR-5c believed swing; IN-0a plant handoff; ES-Da covert rider; ENC-3 exposure wariness | — | — | ROWs `CPL-19.INFO_TO_GRAMMAR.*` (8) |
| 19 | GRAMMAR→INFO | WR-7 silence inference; WR-6c anticipated reaction; IN-0c disclosure credit; IN-3 envoy word tested; IN-4 envoy return race; ES-1/2/3 mission mint / gauntlet / gradient | — | — | ROWs `CPL-19.GRAMMAR_TO_INFO.*` (10) |
| 19 | — | forged instruments | — | — | EMPTY (J-CPL-8) |
| 20 | INFO→INTERIOR | council_schism; exposure blowback triple; compromised seat | schism condition | the vindicated minority | LIVE |
| 20 | INFO→INTERIOR | INT-2 counsel receipts; IN-3 suspicion; IN-5(d) scandal join; INT-3a decision join; IN-5 inaction receipt | "the court knew, and sat still" | — | IN-3 BUILT-DARK; INT-2/3a UNBUILT; IN-5(d) PLAUSIBLE |
| 20 | INFO↔INTERIOR (ES) | ES-5b/c/d career; ES-3 flaw distortion; IN-3 suspicion temper; ES-6a double-agent leak (INFO→INFO) | — | `npcLadderGoals.riskAppetiteOf` (ES-3) | ROWs `CPL-20.*` (6, one within-layer) |
| 20 | — | domestic propaganda; thought-police verb | — | — | EMPTY (J-CPL-9) |
| 21 | GRAMMAR→INTERIOR | approval lanes; tribute_strain points outward | — | — | LIVE. ROWs `CPL-21.GRAMMAR_TO_INTERIOR.WR-5.refusal_price`, `…ENC-2.meeting_mark_consume` |
| 21 | INTERIOR→GRAMMAR | GR-1 oath identity; GR-4 succession repudiation; WR-5 seat acceptance; GR-2 posture reserve; GR-5c demand nerve; ENC-3 stage reads | "sworn under X" | the heir who honours; 104w interregnum | GR-1 BUILT-LIT. ROWs `CPL-21.INTERIOR_TO_GRAMMAR.*` (4). ⚠ OWED row `oathHolder.js → npcLadderState.js` (INTERIOR→GRAMMAR, GR-1) unminted (ARCH_CW:261-271) |
| 21 | INTERIOR→GRAMMAR | INT-4 strain attribution; INT-6 deliberate forgiveness | attributed lines | dig-up re-prices | UNBUILT |
| 21 | — | dynastic marriage; personal union | — | — | EMPTY |
| CW-0 | all → registry | the inclusion ratchet over (module, module) pairs | gate red | positive control | LANDED |
| CW-1 | receipts → Herald | cascade detection by recorded ancestor | braided item, typed action `cascade` | a `major` member is never damped | BUILT-DARK |
| CW-2x | receipts → town page | registry join + horizon + layer tags | walk | fail-closed truncation | UNBUILT |
| CW-3 | registry → soak | differential / aliveness / cascade envelopes | certification rows | mutant controls | UNBUILT |

**Totals:** 21 pairs, 42 directions, 0 direction-grain empties, about 45 sub-coupling empties. Registry: 68 rows across CPL-1,3,4,5,6,9,14,17,19,20,21,22,23. **There are no rows for CPL-2 (filed as 23), 7, 8, 10 (filed as 22), 11, 12, 13, 15, 16, 18.** Faith, populations and the trade/faith/pop pairs have no registry footprint, matching the unbuilt WF/POP/TR-4..8 waves. The pre-program LIVE couplings are baseline-frozen in the inclusion walker, not rowed (ARCH_CW slice 2 JUDGMENT, :211-222).

