# FINDINGS — INTERIOR (INT) — the FP coherence read, 2026-10-16

Reader seat for the INTERIOR family (the seat's books, legitimacy, the court's interior politics, the burial, the commons' standing, seat interventions). Sources read WHOLE: `volumes-master/DESIGN_FP_INTERIOR.md` (1747 lines, cited `INT:n`) and `volumes-master/DESIGN_FP_ARCH_INT.md` (739 lines, cited `AINT:n`). The master copies differ from `volumes/` only in four re-measured line cites inside ARCH_INT (S5, the §2 manifest note, §2 row 6, INT-2's preset cite), and none of those changes the design. Also read: SPINE §1 (`SPINE:17-109`), §2 SP-1/SP-4/SP-5 (`SPINE:122-195`), §3 (`SPINE:494-552`); the compiled fold's PHASE 7 (`ARCH:2196-2294`); `volumes/DESIGN_FP_ARCH_EC.md` (cited `EC:n`) by grep, with EC-3 (`EC:1001-1100`) read in full. Code of record: `master-00b648c9d` (cited `src/...:n`). The build record is the FP board and FP-ORDER. A second census at master, `docs/DESIGN_FP_ARCH_EDITOR.md` (cited `EDITOR:n`, measured at `8b5565922`), turned out to be the most current status record for this family.

Evidence classes: every code claim below is CONFIRMED by a read executed in this seat unless marked PLAUSIBLE. I ran no tests.

---

## 1. THESIS

The interior asks who decides foreign policy, what the deciding costs at home, and how the home remembers. Under that sit three stocks or reads: the seat's two books (realm versus ruler), legitimacy (the crowd's confidence in the seat), and memory (grudges, and their deliberate burial). The volume says the interior is the "DRIVER of the other six layers" (`INT:5-8`). Its eight waves turn existing arithmetic into spoken causality: the seat's books, bloc counsel, the coup verdict that names the decision, the king who paid, the memory seam, the burial, the legitimacy crossings, and the voice.

**The DM-felt sentence of the flagship.** The flagship is the interior veto with its causal join (settled ruling 2, `INT:54-56`). Its sentence: *"The peace party holds the hall; the war the Margrave would not end is named in the verdict."* (`INT:624-625`, repeated `INT:1660-1661`). The other mechanisms' own receipt lines are: INT-1 *"the Margrave's counsel weighed her seat above the town, and the war went on"* (`INT:456`); INT-4 *"He paid the tribute of Ashford, and it cost him the seat."* (`INT:1668`); INT-6 *"By decree of the seat, the grudge with Ashford is buried; the price was paid in grain and pride."* (`INT:1674-1675`); INT-7 *"The seat has fallen to Crisis — the assize was a sham."* (`INT:1680-1681`).

**Mechanisms with NO DM-felt sentence, named:** INT-5's band-scaled half-life by itself (the volume says so: "Fast: nothing new fires", `INT:971`). The `decision` pressureKind (`INT:620-621`) is arithmetic only, and its only voice is the join receipt. The INT-7 certification row and the endings envelopes are instruments, not story. The `originHolderId` field has a sentence (`INT:1672-1673`), but it fires only when an inherited grudge decides an outcome past a margin. That is a yearly-to-epoch event. Nothing in the family speaks **seat interventions** (`seatIntervention.js`, W-SEAT D9). The INT volumes never mention that module (§4 row X1).

---

## 2. STATUS, TRUTHFULLY

**The volume's own header:** "Status: ARCHITECTURE. Nothing here is scheduled until the owner sequences it … Every wave dark" (`INT:22-28`). ARCH_INT is a compilation layer measured at `e564e135` on 2026-08-04 (`AINT:3`), amended later by the "INT-F round", which asserts "INT-3b itself is LANDED" (`AINT:135-138`, `AINT:405-415`).

**The board:** `FP-PROGRESS-BOARD.md` carries ZERO INT-n entries (grep for `INT-[1-8]` hits only an unrelated line). INTERIOR sits in FP-ORDER pair 4, "INT-1 · INT-2 · INT-3's remainder · INT-4 · INT-5 · INT-6 · INT-7 · INT-8" (`FP-ORDER.md` row 4). The CHAIN-FIRST AMENDMENT ("I leave everything to your judgement and leave you to build it all", FP-40) supersedes pair order: units are taken only as felt chains need them. No chain yet named needs an INT unit. Chain 3 is THE GENERALS (FPQ-77), "folded into WC with INT/GR/HB/IN/ES couplings" (board :211).

| wave/unit | volume's claim | board | code @ 00b648c9d | verdict |
|---|---|---|---|---|
| INT-1 books | generalize `seatBooks.js`; flag `seatBooksEnabled` (`INT:257,299-335`); ARCH_INT: warSeatBooks IS seatBooks, 515/588 lines, 3 books (`AINT:56-73,297-303`) | none | `warSeatBooks.js` 810 lines, **FOUR** books `['realm','seat','patron','foreign']` (`src/domain/worldPulse/warSeatBooks.js:540`), partition law forbids enumerating weight fields (`:530-538`), ≥9 importing modules; `seatBooksEnabled` zero hits (only `strategicPosture.js:36` names it as absent); `seatBooksReceipt.js` absent | NOT STARTED; the substrate has outgrown the spec |
| INT-2 counsel | completes `settlementPoliticsEnabled` (`INT:258,517-597`) | none | key in manifest `simulationRules.js:425`, in no preset; `blocCounsel.js` absent; `blocDecisionFactor` live at `settlementPolitics.js:628-649`, consumed `settlementStrategy.js:1171` | NOT STARTED (the substrate is dark everywhere) |
| INT-3a veto + join | `interiorVetoEnabled` (`INT:259,604-692`) | none | flag absent; `decisionPolitics.js`/`decisionJoinReceipt.js` absent; the war half (`warPoliticalLoop.js`, `warPeaceDecision.js` inheritedDemand) exists, but its gates (`warTerminationEnabled` `simulationRules.js:1036`, `memoryWeaveEnabled` `:740`) are dark in every preset | NOT STARTED; the war half is built but dark |
| INT-3b émigré | ARCH_INT: "⭐ LANDED" (`AINT:405-415`) | none | `emigreErrand.js` (121 lines) at `8401efbc7 → 28d2824b4 → d5a6c0094` (all ancestors of HEAD). Its header: "NOTHING IN `src/` CALLS THIS" (`emigreErrand.js:13-19`), "THIS LEAF MINTS NO LEDGER ROW, AND IT MAY NOT" (`:21-28`); Q-TC12-1 open (ODQ:2209) | **SEAM ONLY.** "LANDED" overclaims; EDITOR:921 says "PARTIAL: only 3b's seam … The landed leaf has NO caller" |
| INT-4 middle | `strainAttributionEnabled` (`INT:260,775-885`) | none | flag absent; `strainAttribution.js` absent; `economicCoupReadEnabled` in no preset (only `coup.js:115-122` reads it); `commonsVoiceEnabled` **absent from simulationRules.js entirely** (gate `commonsVoiceKernel.js:48-50`) | NOT STARTED; two of its three substrates are dark everywhere |
| INT-5 seam | `memoryHorizonSeamEnabled` (`INT:261,887-980`) | none | flag absent; `relationshipMemory.js:16` still reads "D5 SEAM (deliberately deferred …)"; constants `:14-15`; hard-zero `:129`; `originHolder` zero hits | NOT STARTED |
| INT-6 burial | `deliberateForgivenessEnabled` (`INT:262,982-1135`) | none | flag absent; `burialLedger.js`, `woundFamilyOf` absent; `WOUND_TYPE_RE` live `grievanceRead.js:48`, used `:82` | NOT STARTED |
| INT-7 crossings | `legitimacyCrossingsEnabled` (`INT:263,1137-1228`) | none | flag absent; `legitimacyCrossings.js` absent; `subsystemRowsInterior.js` absent (superseded, `AINT:165-172`) | NOT STARTED |
| INT-8 voice | two cures + walker habitat owed (`INT:1260-1268`, `AINT:577-594`) | none | **cures DONE elsewhere:** `deploymentReturn.js:592` now speaks `seatGripWordFor(verdict.pHold)` (band word, `:192`); `relationshipMemory.js:302-307` "TE-HERALD-1 … the float only repeated it"; walker push-indexing at `tests/helpers/proseNumericsWalk.js:230-231`. Commits `2b8f47e26` (TE-HERALD-1), `e30770bd0` (CW-0w slice 4) are ancestors of HEAD | cure half DISCHARGED by other lanes; pools NOT STARTED |
| seat interventions | never named in INT volumes | none | `seatIntervention.js` (263 lines, W-SEAT D9), gated by `foreignSeatEnabled` (manifest `simulationRules.js:589`), "imported only by `convergence.js`" (`seatIntervention.js:44-46`) | OUTSIDE the family's volumes. The W-SEAT design doc is not in the master `docs/`. SILENT |

The bottom line: of eight waves, zero have landed and one seam exists. Every substrate the interior reads is dark in every shipped preset except four: `factionCompetitionEnabled` (default true, `simulationRules.js:70`), `npcLadderEnabled` and `reframeEnabled` (lit in the ONE_REGEN spread, `:742-752`), and `warDispositionEnabled` (lit in full_simulation, `:1030`). The dark ones are blocs, memory weave, war termination, disposition channels, commons voice, economic coup read and posture.

---

## 3. LAWS AND OWNER-SETTLED ITEMS (the fold may NOT re-narrate these)

**Owner verbatim quotations in the family: NONE.** Neither volume carries an owner quotation. The family's authority is spine law (§3 crux) plus chair rulings under delegation. Three owner words govern it from outside:
- The spine §3 FP-INTERIOR crux (`SPINE:544-552`) is spine law, not an owner quote: "G'S TWO BOOKS LAND … THE INTERIOR VETO completes … the king-who-paid arc gains its narrated middle … faction foreign POSITIONS light … legitimacy gains its certification row; memory closes its documented decay seam; forgiveness gains the DELIBERATE arm (a seat may bury a grudge at a price — reconciliation as policy, not only clock decay)."
- The owner, 2026-09-23 (J-EM-16): "no just build it all shipped lit" (`simulationRules.js:755-756`). This is the law under which the FP layers light. No INT key is in any FP_LIT fragment (`:789-803`).
- The owner, 2026-10-02, FP-40 CHAIN-FIRST: "I leave everything to your judgement and leave you to build it all" (`FP-ORDER.md`, amendment). The unit of work is the next felt chain.

**Settled rulings (spine law elaborated, "never re-opens"):** §0 items 1–7 (`INT:51-73`). In order: the two books land (INT-1); the interior veto completes (INT-3); the narrated middle (INT-4); faction positions light (INT-2), "the flag itself lights ONLY at an owner-signed soak" (`INT:62-63`); legitimacy's certification row (INT-7); the memory decay seam closes (INT-5); deliberate forgiveness (INT-6).

**Laws (§1a/§1b):** same-seed identity, dormancy, seeded purity, monotone ratchets, receipts carry enforcement, premium isolation, finite semantics (`INT:81-95`). Then the interior-specific laws:
- DOMESTIC-TRUTH BOUNDARY: "legitimacy IS ALREADY a belief stock … This volume never adds a 'true worthiness' anywhere" (`INT:99-108`).
- THE VETO IS REPLACEMENT, NEVER A ZERO: "The interior's ONLY hard veto remains the TABLE's approval queue … take the seat, then decide" (`INT:109-116`).
- SUPPRESSION, NEVER DELETION (`INT:117-121`).
- ONE WRITER PER STOCK (`INT:122-126`).
- E3 GENERALIZED, positions are pressure, never selectors (`INT:127-131`).
- NEVER-KILL, NEVER-RESOLVE-FATES, "product scope law, absolute" (`INT:132-134`).
- THE TWO-TIMESCALE ECHO (`INT:135-139`).

**The seam ruling:** ONE BOOKS READ, MANY CONSUMERS; "A SECOND books evaluator anywhere is a design defect" (`INT:299-335`).

**Judgment blocks J-INT-1…15** (`INT:1521-1623`), vetoable by the owner. Two are boundary-owner items stated inside them:
- J-INT-8: "VETO widens the cap or adds an ending class (owner ruling required — the never-resolve-fates boundary is the owner's, not the chair's)" (`INT:1558-1559`).
- J-INT-13: the lit-kind pool upgrade is OWNER-GATED (`INT:1585-1598`).

**The owner-held boundary:** "the release soak grid, the 300y rerun, the certification sweep … and the tuning pass wait on the owner — and INT-8's LIT-KIND POOL UPGRADE sits with them" (`INT:1709-1715`). §8 tuning is "owner-signed at the soak, per THE PROMISE" (`INT:1625`).

**ARCH_INT rulings:**
- ⛔ RULED §92.2 / C-INTF-1: "the six INT flags are VIRTUAL keys; each certification row lands IN `subsystemRowsVirtual.js` … `subsystemRowsInterior.js` is NOT minted" (`AINT:165-181`).
- The naming JUDGMENT "warSeatBooks.js IS the volume's `seatBooks.js` — no rename, no facade" (`AINT:297-302`).
- The INT-6 naming JUDGMENT "the word `forgiveness` never enters an INT-6 type, status, or id" (`AINT:503-506`).
- C-INTF-5: the static_campaign preset negative (`AINT:357`).
- C-INTF-6: envelopes register in `distribution-envelopes.manifest.json`, "the drafted 0.005/settlement-year literal is exactly what the landed envelope machinery forbids" (`AINT:556-560`).

**Owner-gated and open:** Q-TC12-1, "where an émigré record persists" — "STAYS OPEN AND BATCHED" (ODQ:2209). It is a persistence shape, so it is the owner's. ODQ §925.7: the undecaying character ratchet feeding seatBooks is "a live launch-path defect … so this sweep could not schedule it and it goes to the owner instead" (ODQ:32624).

---

## 4. CROSS-PROGRAM CLAIMS

Verdict key: AGREES / DISAGREES / SILENT / STALE.

| # | INT claim (line) | Other side | Verdict |
|---|---|---|---|
| C1 | WR-5 builds the two-books combination; INT-1 extracts or generalizes it (`INT:334-335`, J-INT-1 `INT:1521-1526`) | `warSeatBooks.js` landed as a module (`AINT:56-73`); the code now has FOUR books including W-SEAT's `foreign` (`warSeatBooks.js:540-548`); the receipt lives on warTermination's lane | AGREES on the module. **STALE** on shape: the volume's `booksOf → {settlementPosition, rulerPosition, weight01, receipt}` (`INT:303-304`) is a two-way split; the code's is a four-way partition |
| C2 | Five volumes name `booksOf(settlementId)` as the consumer seam (TRADE `DESIGN_FP_TRADE.md:1144`, POP `DESIGN_FP_POPULATIONS.md:1025`, FAITH `DESIGN_FP_FAITH.md:323-326`, GRAMMAR `DESIGN_FP_GRAMMAR.md:276`) | No `booksOf` exists. ARCH_INT rules that non-war consumers import `readWarSeatBooks({worldState, snapshot, actorId, opponentId})` directly (`AINT:302`; `warSeatBooks.js:618-623`). That read is OPPONENT-keyed; venture appetite and permit posture have no opponent (PLAUSIBLE gap) | **STALE** vocabulary corpus-wide; the shape question is open |
| C3 | SP-4b posture includes the ruler's books; lighting `seatBooksEnabled` "moves EVERY postureOf consumer in five programs" (`INT:479-487`) | SPINE agrees (`SPINE:175-183`); SP-C landed as `courtPostureOf`/`courtRiskAppetiteOf` with books ABSENT, "the caller supplies it or it is absent" (`strategicPosture.js:36-39`). **EC is a SIXTH posture consumer** (EC-3 reserve tint `EC:1019-1021`; EC-16/17/18 appetite tints `EC:1871, 2032, 2170`) | AGREES on the degraded arm. **DISAGREES** on the count ("five programs" is stale). The books term enters ONLY where a caller passes it (`strategicPosture.js:22-32`: an exact import list with no books import), so "every consumer moves" is false by construction unless INT-1 edits every caller (PLAUSIBLE) |
| C4 | Legitimacy is SP-5's "seat's domestic credit" member; INT-7 instantiates the grammar; "the stock has no passive clock" (`INT:1143-1151, 1222-1224`) | SP-5's family idiom is "banded stock, event-moved, **decay toward neutral**, receipts on band crossings" (`SPINE:185-189`) | **DISAGREES.** The member has no decay toward neutral, yet the family idiom requires one. At master the stock has a passive weekly DRAIN (`timeProgression.js:252-302`, the FPQ-80 defect). The cure (`c860b7345`, "recovers toward its structural baseline") is NOT an ancestor of `00b648c9d` |
| C5 | SP-1 names INTERIOR's errand consumer "the ambitious"; INT-3b DECLARES a narrowing to the defeated, "the ambitious … is DEFERRED" (`INT:697-708`) | SPINE `:126`. Code: `ERRAND_CONSUMERS` row `consumer: 'ambitious'` → `emigreErrand.js` (`envoyErrandVocabulary.js:358-360`); ARCH_INT says "the `ambitious` row flipped `built:true`" (`AINT:410-411`) | **DISAGREES.** The registry calls a defeated-flight seam "ambitious", which is exactly the arm the volume deferred |
| C6 | INT-3b: "NO NEW LEDGER — SP-1 errands … declared/true split riding the covert seam" (`INT:392-398`); J-INT-15: "PURE PROJECTIONS over the SP-1 errand record" (`INT:1614-1616`) | `emigreErrand.js:21-28`: "the design volume's 'NO NEW LEDGER — SP-1 errands' sentence is REFUTED at this base … no émigré record can be persisted"; ODQ §54 item 2 (ODQ:2200-2203) | **STALE / REFUTED** (signed). J-INT-15 has no record to project over until Q-TC12-1 is ruled |
| C7 | INT-3 owns the succession TRIGGER for pacts: "past the repudiation band it TRIGGERS SP-3's succession-repudiation writer (GRAMMAR owns the writer; the interior owns the trigger)" (`INT:638-643`); reaffirmation "is a receipt too" (`INT:666-667`); INT-7 floors `reaffirmed_by_heir` (`INT:1176-1177`) | GRAMMAR GR-4 owns trigger AND answer: "The three answers, run through the new seat's character + books" (`DESIGN_FP_GRAMMAR.md:1045-1047`). Code GR-4a: `treatySuccession.js` derives the question; HONOR "writes NOTHING AT ALL — no key, no receipt, no ending" (`treatySuccession.js:49-54`); DISAVOW writes `succession_repudiation` (`treatyBreach.js:49`) | **DISAGREES** twice. (a) A second trigger and band in INT-3 would be a second decider over the same treaty question. INT's role is at most a books COLOUR inside GR-4a's scoring. (b) `reaffirmed_by_heir` and its floor have NO producer, and GR-4a forbids one by design |
| C8 | INT-3's re-read fires "on ANY legitimate power change" (`INT:638`); the installed successor's demand rides the succession record (`INT:634-637`) | `treatySuccession.js:31-39` and GRAMMAR CR-GR4-5 (`DESIGN_FP_GRAMMAR.md:1028-1037`): "A coup VERDICT, a conquest, a DM `CHANGE_RULING_POWER` … write NO row" in `seatTransitions` | **STALE.** The coup-installed successor, the INT-3 case itself, opens no GRAMMAR question. The war arm uses its own `carriedDemand` path (`AINT:85-86`) |
| C9 | GRAMMAR's oath-holder identity is not yet landed; INT-3's heir clause "ships dormant" (`INT:644-648`, J-INT-10 `INT:1565-1569`) | `oathHolderEnabled` is LIT in `FP_LIT_WARPEACE` (`simulationRules.js:798-803`); `treatySuccessionVoice.js` speaks the disavowal beat, and "The SUCCESSOR's name is on no surface this stage can read" (`treatySuccessionVoice.js:39-44`) | **STALE.** The degraded arm is obsolete. "The son burned it" has no successor-name surface (CR-GR4B-3) |
| C10 | The seat_held credibility restoration fix "IS OWNED BY FP-INFORMATION" (`INT:1480-1483`, `INT:225-228`) | `DESIGN_FP_INFORMATION.md` and `DESIGN_FP_ARCH_IN.md`: **zero** `seat_held` hits. Code is still `holder: 'people_held'` only (`informationStatecraft.js:156-163, 391`) | **SILENT.** INFO never accepted the assignment |
| C11 | TRADE TR-7 reserved the books seam (`INT:470-471`) | `DESIGN_FP_TRADE.md:1141-1146`; `DESIGN_FP_ARCH_TR.md:555-556` | AGREES (modulo C2's naming) |
| C12 | POP-5b reserved the books seam (`INT:471-472`) | `DESIGN_FP_POPULATIONS.md:1025-1028`; `DESIGN_FP_ARCH_POP.md:531-532` | AGREES (modulo C2) |
| C13 | FAITH stance choices are the one open deferral (`INT:473-475`) | `DESIGN_FP_FAITH.md:322-328`; `DESIGN_FP_ARCH_WF.md:520-521` "deliberately NOT reserved — the volume's declared decision, re-affirmed" | AGREES |
| C14 | GRAMMAR SP-3 pact accept/refuse is a stated books consumer (`INT:466-468`) | `DESIGN_FP_GRAMMAR.md:275-277` behind `seatBooksEnabled` AND `pactFormationEnabled`; `DESIGN_FP_ARCH_GR.md:659-660`. `pactFormationEnabled` is LIT (`simulationRules.js:789-792`) | AGREES. Lighting `seatBooksEnabled` therefore shifts a LIT pact chain; INT-1's disclosed-shift list should name it |
| C15 | WR-10 sell-the-silver consumes books (`INT:468-469`; `AINT:619-621`) | `sovereigntyIntent.js` imports warSeatBooks (consumer list) | AGREES. The consumer census is ≥9 modules today (warCoalitionRefusal, envoyInterceptionStage, warPeaceDecision, armyTransitKernel, warTermination, sovereigntyIntent, peaceTermsCoalition, envoyNegotiationPictureBuilder, warCoalitionDecision), not one |
| C16 | ES shares warSeatBooks' words (no INT claim) | ES CR-ES-3 retargets warSeatBooks' security word `contested`→`holding` and mints `lawWordFor` (`DESIGN_FP_ARCH_ES.md:968-1003, 2028-2034`); code `warSeatBooks.js:718`, `lawWord.js:50` | INT SILENT. INT-1's dossier words ("Seat: secure", `INT:500-501`) must use the landed `{secure, holding, precarious, unseated}` |
| C17 | POP×INTERIOR: "POP's departure-memory arm reading INT-6's ledger"; the dig-up feeds POP departures (`INT:1438-1446`) | POP volumes: no reference to INT-6, burials ledger or dig-up (grep). POP's only "burial" is the plague sickness-burial kind (`DESIGN_FP_POPULATIONS.md:759-807`) | **SILENT** (plus the homonym, §9) |
| C18 | POP rides INT's commons substrate; the commons' popular arc is POP's (`INT:190, 1435-1437`) | POP: "`commonsVoiceKernel.js` stays the ONE crowd writer" (`DESIGN_FP_POPULATIONS.md:292-296`); its composite has THREE terms, 0.55 legitimacy-deficit + 0.35 corruption + 0.55 unrest (`:169`) | AGREES on ownership. **STALE** on INT's side: INT-4 says the composite is "today: legitimacy/corruption" (`INT:813-814`) and omits unrest |
| C19 | INT-4 adds a treaty-burden term to the commons composite, "the commons composite stays clamped" (`INT:813-818, 879`) | Other claimants on the same composite: INFO's witch-hunt (`DESIGN_FP_INFORMATION.md:1020-1021`), FAITH's omen writes (`INT:1422-1424`, FAITH's own), EC's `rough_for_common` (`EC:1471-1474`) and EC-6's restricted food stance (`EC:1348-1349`) | **DISAGREES (structural).** Five programs add terms to one three-weight clamped blend and none owns the term budget. Each volume caps only its own term (PLAUSIBLE runaway-by-sum) |
| C20 | The commons substrate is "BUILT"; the compiled fold says "commonsVoiceKernel is live-lit" (`ARCH:2240-2241`); INT §11 fences it as LIVE (`INT:1727-1731`) | `commonsVoiceEnabled` appears nowhere in `simulationRules.js` (not in DEFAULT, the manifest or any preset); gate `commonsVoiceKernel.js:48-50` | **STALE.** The commons voice is dark in every world. So are the "commons rung dips" legitimacy hit (`INT:182`) and INT-4's term host |
| C21 | EC ⇒ INTERIOR: "the crown that eats first bleeds legitimacy while the household wants tools (INTERIOR coupling)" ⇒ "INTERIOR (legitimacy bleed via the existing writer)" (`EC:1043-1044, 1080-1081`; also `EC:1150-1151, 1829`) | INT's typed-hit writer census (`INT:182`; INT-7's crossing-has-a-hit vocabulary `INT:1155-1157`) has no EC hit. No "existing writer" takes a goods-starvation input. One-writer law (`INT:122-126`) | **SILENT.** INT has no receiving read. Whatever EC mints must also join INT-7's typed-hit vocabulary, or the crossing-has-a-hit walker reds |
| C22 | EC ⇒ INTERIOR: "a grievance against the seat is minted when the household starves for the crown" (`EC:1188-1189`); `rough_for_common` "reads as grievance on the seat when sustained" (`EC:1473-1474`); "⇒ INTERIOR (grievance via existing writer)" (`EC:1508`) | INT has no grievance-against-OWN-seat record. Its grievances are pairwise (relationship/faction-pair) or bloc decision entries (`INT:350-362`). The commons composite (C19) is the only seat-directed grievance and it is POP's writer | **SILENT** (no named home) |
| C23 | EC: "the reserve reads as a line in the seat's standing" (`EC:1090`) | INT-1's dossier "standing line" ("Seat: secure. Counsel: …", `INT:498-503`) is unbuilt; INT-7's "Standing: Contested (fell year 38 …)" (`INT:1219-1220`) is unbuilt | **SILENT.** The reserve is EC's own ledger (`EC:631`), and its seat-standing landing presumes an INT surface that has no spec for a reserve line |
| C24 | EC's reserve and posture "lean on INTERIOR" (the brief) | EC reads the disposition channels (`dispositionLedger.js`) and the SP-C posture tint, not INT's books (`EC:1015-1021, 1076-1077`) | AGREES that EC does not read INT directly. Posture's books term (C3) is the only indirect INT input, and it is ABSENT until INT-1 |
| C25 | W-SEAT is not named in either INT volume | W-SEAT added: the 4th book (`warSeatBooks.js:540`); a legitimacy-scaled upheaval gate `legitimacyUpheavalEnabled` (`stressorGates.js:59-75`, manifest `simulationRules.js:601`); `seatIntervention.js`; the pHold budget (C26). EDITOR J20: "INT-7's writer census includes W-SEAT's upheaval lane" (`EDITOR:218`) | **SILENT.** The upheaval lane is a legitimacy READER (a sensitivity table, "A REDISTRIBUTION, NOT AN INFLATION", `stressorGates.js:70-72`), not a writer. EDITOR's "mover" wording is itself PLAUSIBLE-wrong |
| C26 | INT-3/INT-4 tilt coup verdicts (the reversal "tilt returns to baseline", `INT:661-662`; the rally margin over warSentimentAdj, `INT:828-833`) | `rulingPowerCoup.js:185-200`: five additive pHold terms "sum to exactly 0.815 against a DECLARED_BUDGET of 0.82 … a sixth ADDITIVE term … needs an owner tuning signature" | AGREES only if INT adds no pHold term (INT-3 routes through a pressureKind; INT-4 is words-only). **Recorded constraint:** any INT verdict weight is owner-gated |
| C27 | HB: an HB factor appended at INTERIOR seat decisions (`DESIGN_FP_ARCH_HB.md:4019-4021, 4057`) | INT volumes never mention HB | **SILENT** |
| C28 | CPL rows map onto CPL-6/11/15/18/20/21 (`AINT:669`); CW-0 registry mint "`couplingRegistryInterior.js` ONCE" (`AINT:673-676`) | `src/domain/certification/`: no `couplingRegistryInterior.js`; WR-5's interior rows live in `couplingRegistryWar.js:133, 151` | AGREES (not yet owed; X5 RESOLVED-NOT-PAID, ODQ:2205-2207) |
| C29 | INFO owns the SCANDAL join; INT-3a owns the DECISION join (`DESIGN_FP_INFORMATION.md:1196-1199`) | INT's closed decision vocabulary (`INT:611-613`) excludes conditions | AGREES |
| C30 | `interventionEnabled` "VIRTUAL-dark"; divided-court story "TELLABLE-when-lit" (`INT:214`) | LIT in the WAVES spread of all world-alive presets (`simulationRules.js:721-731`) | **STALE** |
| C31 | Reframe lane "BUILT, DARK (`reframeEnabled`…)" (`INT:195`; `AINT:39` "Reframe lane dark") | `reframeEnabled: true` in ONE_REGEN (`simulationRules.js:742-746`), spread into the world-alive presets | **STALE.** The ORGANIC forgiveness lane INT-6 pairs with is lit; casus consumers additionally need `peaceCausalActive` |

---

## 5. INTERNAL CONTRADICTIONS

1. **ARCH_INT contradicts itself in one paragraph.** `AINT:131-138`: "SP-1, SP-3 and SP-4 are LANDED … The BUILD-PRECONDITION list this section carried is DISCHARGED, and INT-3b itself is LANDED". Then `AINT:142-145`: "The volume's BUILD-PRECONDITION list therefore still binds: INT-3b (SP-1), the posture consumptions (SP-4), the SP-5 grammar, SP-6 kit, SP-7 walker are all still unbuilt". Both cannot hold. The second sentence is the unamended 08-04 text.
2. **INT-3b "LANDED" versus "ambitious DEFERRED".** `AINT:405-415` says "⭐ LANDED … the `ambitious` row flipped `built:true` with `emigreErrand.js`". `INT:697-708` says "this wave mints ONLY the DEFEATED … The ambitious-but-undefeated traveller … is DEFERRED". The family both defers "the ambitious" and marks "ambitious" built. The leaf itself has no caller (`emigreErrand.js:13-19`), so neither "LANDED" nor "built" describes a mechanism.
3. **INT-6's Req 14.** `AINT:534-535`: "Req 13: engagement … Req 14: none; declared empty." Against that, J-INT-5 (`INT:1540-1543`): "the burial is BOTH a DM-side approval-routed realm verb (the REPUDIATE_TREATY twin — table decree) …". `AINT:517-519` also charters "the DM verb arm (realmManifest + approval routing…)", and SPINE §1.14 names "INTERIOR's burial verb" as the house pattern (`SPINE:107-108`). EDITOR:924 found the same contradiction.
4. **One preset, three addresses, one document.** `AINT:31`: quiet_local at `simulationRules.js:743`. `AINT:186`: `simulationRules.js:45` / "quiet_local FALSE :345". `AINT:357-358`: ":517 beside quiet_local's :477" and ":345". The code is quiet_local `:870`, static_campaign `:972`, factionCompetition default `:70`. The rule "cite symbols, not lines" (`AINT:23, 727-729`) was violated three times inside the same file.
5. **"Two deltas" lists three.** `INT:1725`: "Two deltas for this volume:", followed by items 1, 2 and 3 (`INT:1727-1743`).
6. **The token arithmetic in INT-7.** `INT:1162-1164`: "the audit found 12 of 17 declared tokens unenveloped". `INT:1640` and `AINT:555`: "TOTAL over all 20 declared tokens". Counted from §5: INT-2 2 + INT-3 10 + INT-4 3 + INT-6 5 = 20, or 19 before the buried_and_held split. Neither count is 17 (PLAUSIBLE: the 17 was a pre-INT-3b-endings count and was never recomputed).
7. **The closed loop overclaim.** §2 row 6 says "BUILT — the loop is closed in both directions today" (`INT:187`). INT-4 and §3 say the strongest wire is VIRTUAL-dark and the WR quartet must light before strain attribution "is MEANINGFUL" (`INT:210, 292-297`). Both are the volume's own words. The second is true at master: `warDispositionEnabled` is lit in full_simulation only (`simulationRules.js:1030`), and the war-decision lane is dark everywhere.
8. **J-INT-15 versus INT-3b's model.** J-INT-15 says both towns render "PURE PROJECTIONS over the SP-1 errand record" (`INT:1614-1616`). The §4 model says "NO NEW LEDGER — SP-1 errands" (`INT:392-398`). The signed INT-3b landing says no record exists or may be written (`emigreErrand.js:21-28`). The projection law and the landed seam point at different nothings.
9. **ARCH_INT R6 versus the open owner item.** `AINT:112-120`: "R6 … RESOLVED SINCE. WR-2 landed". `INT:228-232`: "until WR-2 lands, an undecaying character ratchet feeds every seatBooks ruler-position read". ODQ §925.7 calls that row "a live launch-path defect" (ODQ:32624). WR-2 landed DARK (`dispositionChannelsEnabled` false in every preset, `simulationRules.js:1037-1041`), so the ratchet is what every shipped world runs. "Resolved" means "built", not "running".
10. **The books receipt's home.** `INT:455-464` says every books read derives ONE receipt, change-gated. `AINT:307-310` says "Receipt emission mounts at the existing warTermination receipt lane for the war arm (NO growth — 818 frozen)". The war arm's receipt lane is behind `warTerminationEnabled`, which is dark everywhere (`simulationRules.js:1031-1036`). So the INT-1 standing receipt cannot speak for the war arm in any preset until WR lighting. This is not stated as a degraded arm (PLAUSIBLE omission).

---

## 6. STALE PREMISES (the code at 00b648c9d refutes them; live lines quoted)

| # | Premise (line) | Live code | Verdict |
|---|---|---|---|
| S-1 | "two books … three confirmed substrates"; `interestKind:'realm'|'seat'|'patron'` (`INT:191`; `AINT:59-61`) | `export const SEAT_BOOK_KINDS = Object.freeze(['realm', 'seat', 'patron', 'foreign']);` (`warSeatBooks.js:540`) plus "no consumer outside this file may enumerate book weight FIELD NAMES" (`:530`) | REFUTED. The fourth book is W-SEAT's. INT-1's receipt and dossier must speak four books, or name foreign as a private book (`PRIVATE_BOOK_KINDS`, `:551-553`) |
| S-2 | warSeatBooks 515 lines; INT-1 budget "≤ +80" on 588 (`AINT:57, 303-304`) | 810 raw lines (`wc`) | STALE. The +80 budget would cross the 800 raw mark (PLAUSIBLE: effective lines may still be under the layer ceiling; not measured with the enforcer) |
| S-3 | The two voice defects are live and owed by INT-8 (`INT:202, 1260-1268`; `AINT:43-44, 577-594`; `ARCH:2289-2294`) | `deploymentReturn.js:592` `…a grip that had looked ${seatGripWordFor(verdict.pHold)} did not survive…`; `relationshipMemory.js:302-305` "TE-HERALD-1: each of these three lines is GATED above a threshold … the float only repeated it"; `proseNumericsWalk.js:230` "Index `.push(...)` writes by the exact const-array binding they target" | REFUTED. Discharged by `2b8f47e26` and `e30770bd0` (ancestors of HEAD). INT-8 shrinks to pools |
| S-4 | The commons rung ladder is BUILT and live (`INT:190, 182`; `ARCH:2240-2241` "commonsVoiceKernel is live-lit") | `commonsVoiceActive` reads `rules.commonsVoiceEnabled === true` (`commonsVoiceKernel.js:48-50`); the key appears in no line of `simulationRules.js` | REFUTED for "live". BUILT, but dark in every world |
| S-5 | Reframe DARK (`INT:195`; `AINT:39`) | `const ONE_REGEN = Object.freeze({ distancePricedNewsEnabled: true, reframeEnabled: true, …` (`simulationRules.js:742-744`) | REFUTED |
| S-6 | `interventionEnabled` VIRTUAL-dark (`INT:214`) | `const WAVES = Object.freeze({ momentumEnabled: true, navalEnabled: true, interventionEnabled: true, …` (`simulationRules.js:721-724`) | REFUTED |
| S-7 | Oath-holder identity absent; the heir clause is dormant (`INT:212, 644-648, 1565-1569`; `AINT:655-657`) | `const FP_LIT_WARPEACE = Object.freeze({ mediationGeneralizedEnabled: true, oathHolderEnabled: true, …` (`simulationRules.js:798-800`); `SUCCESSION_REPUDIATION_TYPE = 'succession_repudiation'` (`treatyBreach.js:49`) | REFUTED. GRAMMAR's identity and its succession road are lit |
| S-8 | INT-3's re-read covers ANY legitimate power change (`INT:638`) | "A coup VERDICT, a conquest, a DM `CHANGE_RULING_POWER`, an H2 verdict removal, DM KILL/ASSIGN and an underworld faction capture all change or vacate a seat and write NO row" (`treatySuccession.js:33-36`) | REFUTED for the pact arm |
| S-9 | Legitimacy: "NO passive decay found … memory that does not fade" (`INT:182`); INT-7 "the stock has no passive clock" (`INT:1222`) | `applyFactionDeltasToSettlement` applies `deltas.legitimacy` to `publicLegitimacy.score` every advance (`timeProgression.js:252-302`). The board measures this as a weekly per-held-condition charge "and nothing restored it" (FPQ-80, board :242). The cure `c860b7345` ("a seat's legitimacy recovers toward its structural baseline") is NOT in master | REFUTED. There is a passive drain at master; after batch 8 there will be a passive recovery. Either way INT-7's "no passive clock" and the crossing-has-a-hit invariant need a `recovery`/`condition_charge` cause row. The writer is CONFIRMED; its weekly cadence is from the board, PLAUSIBLE here |
| S-10 | The legitimacy band edges are "EXISTING (Endorsed…Crisis — no new bands)" (`INT:1225`) | "the estate holds three copies of the legitimacy band table already (rulingPower, timeProgression, generators/factionDynamics)" (`stressorGates.js:72-74`); live labels `Endorsed / Approved / Tolerated / Contested / Legitimacy Crisis` (`rulingPower.js:335-339`) | STALE. INT-7 must name WHICH copy is canonical; the label is "Legitimacy Crisis", not "Crisis" |
| S-11 | INT-3b rides SP-1 with "NO NEW LEDGER" (`INT:392-398`) | `emigreErrand.js:21-28` (quoted in §4 C6); ODQ:2200-2203 | REFUTED (signed) |
| S-12 | Frozen sizes: applyWorldPulse 941, pulseKernel 1580, settlementStrategy 812 frozen (`AINT:52, 283-285, 380-382, 432`) | `scripts/.size-baseline.json`: applyWorldPulse **907**, pulseKernel **1581**; settlementStrategy and warTermination's war twin: settlementStrategy has **no entry** (removed); warTermination 818 holds | STALE. The kernel-at-1581 ruling matches the brief's frozen-kernel premise |
| S-13 | Code addresses: coup.js:44-46 (`INT:112-113`); coup.js:118-127 (`INT:264`; `AINT:29`); settlementPolitics.js:615-616 (`INT:112`), :140 (`AINT:30`); settlementStrategy.js:1044/:1220 (`INT:186`; `AINT:30, 344`); relationshipMemory.js:12-13/:127 (`INT:192`; `AINT:32`); npcLadderState :264-266/:306/:386 (`AINT:38`) and :555/:572 (`AINT:477`) | `coup.js:48-49`; `coup.js:115-122`; `settlementPolitics.js:145` (`DECISION_LOAD_SPAN: 0.3`), `:628-649` (blocDecisionFactor + clamp); `settlementStrategy.js:1171`; `relationshipMemory.js:14-15`, `:129`; `npcLadderState.js:566`, `:583` (`inherited: true`) | STALE lines (the values hold) |
| S-14 | WR-2 precondition resolved (`AINT:112-120`) | `dispositionChannelsEnabled: false` with the comment "absent from DEFAULT_SIMULATION_RULES and every other preset" (`simulationRules.js:1037-1041`) | STALE in effect (see §5 item 9) |
| S-15 | The seat security vocabulary in the receipts (`INT:500` "Seat: secure") | `const securityBand = security01 >= 0.67 ? 'secure' : security01 >= 0.4 ? 'holding' : 'precarious';` plus `'unseated'` (`warSeatBooks.js:718, 675`) | AGREES on `secure`. INT must not use ES's retired `contested` |
| S-16 | The pHold verdict has headroom for INT tilts (implicit in INT-3/INT-4) | five terms "sum to exactly 0.815 against a DECLARED_BUDGET of 0.82" (`rulingPowerCoup.js:186-187`) | CONSTRAINT. A new additive tilt is an owner tuning act |
| S-17 | `tribute_strain` is a new closed burden word (`INT:800-801`) | "typed as a 'tribute_strain' incident" (`peaceTermsOverlay.js:54`, `:71`) | HOMONYM (CONFIRMED): the burden word and an existing incident type share one spelling |

Premises overturned by later rulings elsewhere:
- ODQ §54 refuted "NO NEW LEDGER".
- CR-GR4-5 (GRAMMAR) refuted the shared-surface re-read and the trigger breadth.
- CR-ES-3 retired the security word `contested`.
- §92.2/C-INTF-1 retired `subsystemRowsInterior.js`. The compiled fold still names it (`ARCH:2278`), so the fold is stale.
- CR-C4-1 renamed `postureOf`/`riskToleranceOf` to `courtPostureOf`/`courtRiskAppetiteOf`. INT still spells `postureOf` throughout (`INT:434, 585, 690, 873, 1117`).
- The coin reversal (ODQ §731.1) does not touch INT directly. INT-6's "price … restitution/gift streams" (`INT:1026-1030`) is grain-shaped, consistent with "Treaties move GRAIN ONLY" (`EC:417`). No coin premise was found in the family.

---

## 7. THE CLOCK AND THE TIER

| Mechanism | Cadence / dwell | Felt clock | Aspatial? | Needs |
|---|---|---|---|---|
| INT-1 books read | per pulse (a read), receipt change-gated (`INT:504-506, 457-461`) | slow: "when the books stay split for SEASONS" (`INT:506`) | yes | warTermination (dark) for the war arm |
| INT-2 counsel | per verb event; blocs MIN_DWELL 8 ticks (`INT:579-583`) | fast for the counsel line; seasonal for patience → grievance | yes | `settlementPoliticsEnabled` + `factionCompetitionEnabled` (dark in quiet_local AND static_campaign, `AINT:357`) |
| INT-3a decision grievance + join | grievance per pulse; join at verdict tick (`INT:676-686`) | **YEARLY**: the coup verdict "seasons later" (`INT:686`) | yes | memoryWeave (dark), warTermination (dark), blocs (dark) |
| INT-3 pact re-read | at the power-change tick (`INT:677-679`) | event; heir drama is generational | yes | GRAMMAR's GR-4a owns it (C7) |
| INT-3b émigré | per contest event; patience band in weeks; travel on the errand kernel (`INT:759-761`) | **SEASONAL to YEARLY**: "the return/fade/reconcile verdict seasons later" | PLAUSIBLE no: the mint prices a route plan (`emigreErrand.js:110-118`) and needs a lawful journey | the producer (OQ §42/§43), a record home (Q-TC12-1) |
| INT-4 co-presence + rally | per stressor crossing; installments on the treaty's 52-week cadence (`INT:868-872`) | **YEARLY**: "Slow: the verdict, or the forgiveness" | yes | `economicCoupReadEnabled` (dark), commons voice (dark), war quartet |
| INT-5 seam | a clock correction: half-life 4 / lookback 24 × the D5 band (`INT:969-972`) | **EPOCH**: "forty years gone" | yes | memoryWeave at the consumers (`AINT:122-129`) |
| INT-6 burial | decree = event; package on transfer physics; hold-dwell banded (`INT:1110-1116`) | the DM verb is felt AT THE TABLE immediately; the dividend and blessing are seasonal to yearly; the dig-up price is **generational** | yes | memoryWeave; reframe (lit); FAITH rite (optional) |
| INT-7 crossings | event-driven (`INT:1222-1224`) | fast when it happens; the band dwell is slow | yes | none (reads the stock) |
| INT-7 envelopes | soak-scale | none at the table | n/a | an owner soak |
| INT-8 pools | none | fast | yes | each kind's flag |

**Flagged (felt drama lives at the seasonal, yearly or epoch clock, while a DM advances a few weeks between sessions):** INT-3a's join (yearly), INT-3b's endings (seasonal and up), INT-4's fall or forgiveness (yearly), INT-5 entirely (epoch), INT-6's blessed/borne and dig-up (yearly to generational), and INT-1's "split for seasons". In a few-week window, only INT-2's counsel line, INT-6's decree, INT-7's crossing beat and the INT-1 dossier line can fire.

---

## 8. DEPTH VS FELT VALUE

| Mechanism | What a DM sees | Judgment |
|---|---|---|
| INT-1 books generalization | One dossier line ("Seat: secure. Counsel: …") plus a rare change receipt | **KEEP the dossier line; CUT-TO-SENTENCE the Herald books-standing receipt** (lowest class, change-gated; it will almost never print). The one-evaluator census is cheap; keep it |
| INT-2 counsel | A FOREIGN-COUNSEL line per faction card; the override beat | **KEEP**, but the override beat is the payload. The per-verb loading generalization should grow only verb by verb (J-INT-12 already says so) |
| INT-3a join receipt | One clause in the verdict: "the peace of Ashford is named in the verdict" | **KEEP** (the flagship sentence, and cheap: a receipt over existing records) |
| INT-3a sibling decision types (5) | Nothing until each producer exists | **DEFER** each type until its event exists. Today only `war_decision` has a producer |
| INT-3 pact re-read + heir pair | "the father swore it; the son burned it" | **FOLD into GRAMMAR GR-4a** (books as a colour on GR-4a's band). Drop `reaffirmed_by_heir` as an INT ending: GR-4a's honor-writes-nothing law forbids its producer |
| INT-3 installed-successor demand (non-war) | "the trade party that installs a seat expects the severance" | **DEFER.** It has no succession row at coups (S-8) |
| INT-3b émigré | "Corin of Thornwall, in exile at this court" | **DEFER** (an owner persistence question, no producer, yearly payoff) |
| INT-4 co-presence crossing receipt | "the seat weakens, and these burdens stand — …" | **KEEP** (words only, cheap, honest) |
| INT-4 rally receipt | "the seat steadied — the war did what the court could not" | **KEEP** |
| INT-4 commons tribute term + peace-dividend discount | Nothing while commons voice is dark | **CUT-TO-SENTENCE** until commons voice lights. Then fold it into a commons-composite budget ruling (C19) |
| INT-5 seam (both constants) | Nothing at the table; it lengthens what revanchism reads | **KEEP as a repair**, dark (J-INT-6), but it is felt only with memoryWeave lit |
| INT-5 `originHolderId` + `grudgeLineageOf` | "the grudge of old Master Berin, carried by three successors" (epoch) | **DEFER** |
| INT-5 `foundingWoundOf` dossier line | "Oldest wound: the sack of Thornwall, forty years gone." | **KEEP** (a felt dossier line, a pure read) |
| INT-6 classifier slice | Nothing (a finite-semantics repair) | **KEEP** (it retires an open regex) |
| INT-6 DM burial verb + suppression | The DM buries a grudge at the table; the neighbour card shows "buried by decree" | **KEEP** (felt immediately; it is the spine's named req-14 house pattern) |
| INT-6 autonomous arm, domestic dividend, hold-dwell verdict, age-priced dig-up | yearly-to-generational endings | **DEFER** (right but not before launch). Keep the suppression-not-deletion law |
| INT-7 crossing beat + dossier "last crossing" | "The seat has fallen to Crisis — the assize was a sham." | **KEEP** (cheap, felt, certifies the stock) |
| INT-7 envelope set (20 tokens) | none | **FOLD** into each wave's own row. Envelope only the tokens whose producers exist |
| INT-8 | pooled sentences | **FOLD into each wave.** The cure half is done (S-3); lit-kind upgrades stay owner-gated |

---

## 9. VOCABULARY (closed ladders and enums the family mints, with homonym risks)

| Name | Values | Line | Homonym / collision |
|---|---|---|---|
| decision vocabulary | {war_opened, peace_signed, peace_refused, pact_signed, pact_refused, pact_repudiated, severance_declared, stance_changed, settlement_sold, grudge_buried} | `INT:611-613` | ARCH_INT maps these ten to FIVE incident types plus `war_decision` (`AINT:228-230`); the mapping table is unwritten |
| decision incident types | {pact_decision, severance_decision, stance_decision, sale_decision, burial_decision} (sibling of `war_decision`) | `AINT:228-230` | `burial_decision` vs POP's burial kind |
| burial state | {held, dug_up, lapsed} | `INT:377-378` | |
| woundFamily | {armed_conflict, betrayal, tribute_burden, conquest_occupation, raid_seizure, imposition, contest} | `INT:1015-1018` | `betrayal` vs ES `betrayal` stressor (`DESIGN_FP_ARCH_WF.md:520`) |
| burden vocab | {tribute_strain, war_exhaustion, famine, occupation, corruption} | `INT:800-801` | `tribute_strain` is a pre-existing incident type (`peaceTermsOverlay.js:71`); `war_exhaustion` and `famine` are condition names |
| host decision | {shelter, turn_away, sell_back} | `INT:720` | EDITOR proposes binding to `npcCirculationTable.js :: ADMISSION_OUTCOMES` instead (`EDITOR:162`) |
| counsel endings | {heeded, overridden} | `INT:593` | |
| INT-3 endings | {held, overturned_war_party, overturned_peace_party, demand_honoured, demand_betrayed, repudiated_by_heir, reaffirmed_by_heir, exile_returned, exile_faded, exile_reconciled} | `INT:768-770` | `repudiated_by_heir` vs GRAMMAR's `disavowed_by_succession` lineage ending (`treatyBreach.js:52`), two names for one event; `reaffirmed_by_heir` has no producer (C7) |
| émigré endings | {returned, faded, reconciled} | `INT:728-732` | |
| INT-4 endings | {paid_and_fell, paid_and_stood, paid_and_forgiven} | `INT:880` | |
| INT-6 endings | {buried_and_blessed, buried_and_borne, buried_and_answered, dug_up, lapsed_with_the_pair} | `INT:1125-1126` | |
| bloc ends | {seats, doctrine, commerce, survival, patron} | `INT:540` | `patron` vs the `patron` BOOK kind (`warSeatBooks.js:540`) and FAITH's patron god |
| errand purpose | declared {personal}, true {factional}; landed `purpose:'emigre_flight'`, `purposeClass:'factional'` | `INT:712-713`; `emigreErrand.js:105-106` | registry consumer named `ambitious` (C5); `ambitious` is also an NPC trait (`paradigmAxisCatalog.js:329`) |
| seat books (code) | {realm, seat, patron, foreign} | `warSeatBooks.js:540` | |
| security band (code) | {secure, holding, precarious, unseated} | `warSeatBooks.js:675, 718` | **legitimacy band `Contested`** (`rulingPower.js:338`) vs ES-retired security word `contested`. Two seat ladders on one ruling-power card (INT-1 "Seat: secure", INT-7 "Standing: Contested") |
| legitimacy bands (code) | {Endorsed, Approved, Tolerated, Contested, Legitimacy Crisis} | `rulingPower.js:335-339` | three copies of the table (`stressorGates.js:72-74`) |

**"Standing" carries FOUR meanings:**
- INT-1's seat "standing line" (`INT:500`);
- INT-7's "Standing: Contested" (`INT:1219`);
- SP-C's remembered `standing` (the legacy disposition score, `strategicPosture.js:57, 122`);
- DESIGN_FP_STANDING's `relationshipStates[edgeKey].standing[holderId]` (board :231).

EC adds a fifth: "the reserve reads as a line in the seat's standing" (`EC:1090`).

**"Burial" carries two meanings:** INT-6's grudge burial and POP-4's sickness-burial Herald kind (`DESIGN_FP_POPULATIONS.md:759, 803`). The ARCH_INT naming ruling made `burial` INT-6's exclusive word (`AINT:503-506`) without seeing POP's.

**"Books" carries two meanings:** seat books vs TRADE's house `books.holdings/credit` (the spine notes "credit"; `SPINE:192-195`).

**"Forgiveness":** WR-6's coalition `forgiveness` action vs the INT-6 flag `deliberateForgivenessEnabled`. The volume handles it (`AINT:503-506`).

**"Interior":** the CHARACTER interior (this family) vs the map's BUILDING interiors (ODQ §925.7).

---

## 10. REFINEMENTS (in-place, dated-bracket; laws untouched)

1. `[DESIGN_FP_ARCH_INT.md:405-415]`: "INT-3b … ⭐ LANDED (history note)." → `[CORRECTED 2026-10-16 (coherence fold) — the SEAM landed (emigreErrand.js, no caller, no ledger row: its own header :13-28); the mechanism did not. Producer (OQ §42/§43), record home (Q-TC12-1, owner), host decision, harboring grievance, endings and both UI marks remain. Status: PARTIAL.]` Reason: §5 item 2; EDITOR:921.
2. `[DESIGN_FP_ARCH_INT.md:142-145]`: "The volume's BUILD-PRECONDITION list therefore still binds…" → `[CORRECTED 2026-10-16 (coherence fold) — superseded by the paragraph above: SP-1/SP-3/SP-4 LANDED; SP-5 grammar, SP-6 kit and SP-7 walker re-measure at each wave's base.]` Reason: self-contradiction.
3. `[DESIGN_FP_INTERIOR.md:638-643]`: "past the repudiation band it TRIGGERS SP-3's succession-repudiation writer … the interior owns the trigger" → `[CORRECTED 2026-10-16 (coherence fold) — GRAMMAR's GR-4a LANDED the trigger AND the band (treatySuccession.js; honor writes nothing). INT-3's pact arm is at most a books COLOUR on GR-4a's scoring through readWarSeatBooks, never a second band; seatTransitions has no row for coups, conquest or DM changes (treatySuccession.js:31-39).]` Reason: C7, C8.
4. `[DESIGN_FP_INTERIOR.md:768-770, 1176-1177]`: `reaffirmed_by_heir` floored → `[CORRECTED 2026-10-16 (coherence fold) — no producer: GR-4a's HONOR "writes NOTHING AT ALL — no key, no receipt, no ending" (treatySuccession.js:49-54). Drop the floor; keep the token only if GRAMMAR rules an honor beat.]` Reason: C7(b).
5. `[DESIGN_FP_INTERIOR.md:644-648; J-INT-10 :1565-1569]`: the "DEGRADED ARM … if the oath-holder identity has not landed" → `[CORRECTED 2026-10-16 (coherence fold) — landed and LIT (oathHolderEnabled in FP_LIT_WARPEACE). The disavowal beat speaks the FALLEN holder; the successor's name has no surface (CR-GR4B-3).]` Reason: S-7.
6. `[DESIGN_FP_INTERIOR.md:182, 1222]`: "NO passive decay found" / "the stock has no passive clock" → `[CORRECTED 2026-10-16 (coherence fold) — timeProgression's applyFactionDeltasToSettlement moves the stock each advance (FPQ-80); the recovery-toward-baseline cure (c860b7345) is post-master. INT-7's typed-hit vocabulary gains the condition charge and the recovery as cause rows; the SP-5 "decay toward neutral" idiom is reconciled at the spine.]` Reason: S-9, C4.
7. `[DESIGN_FP_INTERIOR.md:190; DESIGN_FP_ARCHITECTURE.md:2240-2241]`: "commonsVoiceKernel is live-lit" → `[CORRECTED 2026-10-16 (coherence fold) — commonsVoiceEnabled is in no preset and not in the manifest (commonsVoiceKernel.js:48-50): the commons ladder, its legitimacy dips and INT-4's term host are dark everywhere.]` Reason: S-4.
8. `[DESIGN_FP_INTERIOR.md:195, 214]`: reframe "DARK"; `interventionEnabled` "VIRTUAL-dark" → `[CORRECTED 2026-10-16 (coherence fold) — both LIT in the world-alive presets (ONE_REGEN :744; WAVES :723).]` Reason: S-5, S-6.
9. `[DESIGN_FP_INTERIOR.md:1260-1268; DESIGN_FP_ARCH_INT.md:588-594]`: "THE TWO CURES" → `[CORRECTED 2026-10-16 (coherence fold) — DISCHARGED by TE-HERALD-1 (2b8f47e26) and CW-0w slice 4 (e30770bd0); INT-8 = pools only.]` Reason: S-3.
10. `[DESIGN_FP_INTERIOR.md:303-304]`: `booksOf(…) → { settlementPosition, rulerPosition, weight01, receipt }` → `[CORRECTED 2026-10-16 (coherence fold) — landed as readWarSeatBooks({worldState, snapshot, actorId, opponentId}) over FOUR books {realm, seat, patron, foreign} read through seatBooksPartition; every volume's "booksOf" means this read. Non-war consumers need an opponent-free arm (to be specced in INT-1).]` Reason: S-1, C2.
11. `[DESIGN_FP_INTERIOR.md:484-487]`: "moves EVERY postureOf consumer in five programs" → `[CORRECTED 2026-10-16 (coherence fold) — six (EC-3/16/17/18 tint courtPostureOf/courtRiskAppetiteOf), and only at callers that SUPPLY the books term (strategicPosture.js imports no books). Also named: the LIT pact chain (GR-2's reserve behind pactFormationEnabled).]` Reason: C3, C14.
12. `[DESIGN_FP_INTERIOR.md:1480-1483]`: "THE FIX IS OWNED BY FP-INFORMATION" → `[CORRECTED 2026-10-16 (coherence fold) — FP-INFORMATION's volumes carry no seat_held row (grep: zero). Unaccepted; route to the chair as an orphan.]` Reason: C10.
13. `[DESIGN_FP_INTERIOR.md:813-818]`: "commonsVoiceKernel's grievance composite (today: legitimacy/corruption…)" → `[CORRECTED 2026-10-16 (coherence fold) — three terms today (legitimacy deficit, exposed corruption, top unrest stressor; commonsVoiceKernel.js:102-109); five programs propose more (INT-4, INFO witch-hunt, FAITH omen, EC rough_for_common / restricted stance); one composite budget owner is owed.]` Reason: C18, C19.
14. `[DESIGN_FP_ARCH_INT.md:534-535]`: INT-6 "Req 14: none; declared empty." → `[CORRECTED 2026-10-16 (coherence fold) — Req 14 IS the DM burial verb (J-INT-5; SPINE §1.14 names it the house pattern): realm verb + approval route + edits-delta lifecycle.]` Reason: §5 item 3.
15. `[DESIGN_FP_INTERIOR.md:1725]`: "Two deltas for this volume:" → `[CORRECTED 2026-10-16 (coherence fold) — three.]`
16. `[DESIGN_FP_ARCH_INT.md:186, 357-358]`: quiet_local `:45/:345/:477`, static `:517` → `[CORRECTED 2026-10-16 (coherence fold) — navigate by symbol: presets quiet_local and static_campaign both set factionCompetitionEnabled:false.]`
17. `[DESIGN_FP_ARCH_INT.md:112-120]`: R6 "RESOLVED SINCE" → `[CORRECTED 2026-10-16 (coherence fold) — BUILT dark; dispositionChannelsEnabled is false in every preset, so the undecaying legacy score feeds every shipped world (ODQ §925.7, owner).]`
18. `[DESIGN_FP_INTERIOR.md:1225]`: "the band edges are EXISTING (Endorsed…Crisis)" → `[CORRECTED 2026-10-16 (coherence fold) — three copies exist (rulingPower, timeProgression, factionDynamics); INT-7 names rulingPower.js's as canonical and pins the other two equal; the label is "Legitimacy Crisis".]`
19. `[DESIGN_FP_INTERIOR.md:697-708]` beside the narrowing → `[CORRECTED 2026-10-16 (coherence fold) — the errand registry row naming this seam is spelled consumer:'ambitious' (envoyErrandVocabulary.js:358); either rename it 'defeated'/'emigre' or record that the label is the spine's and the content is the narrowing.]`
20. `[DESIGN_FP_INTERIOR.md:§1b]` add a W-SEAT note → `[CORRECTED 2026-10-16 (coherence fold) — W-SEAT is an interior-grain program this volume never names: the foreign book, legitimacyUpheavalEnabled (a reader; stressorGates.js:59-75), seatIntervention.js (D9) and the pHold budget at 0.815/0.82 (rulingPowerCoup.js:186-187). INT waves add no additive pHold term without an owner tuning signature.]`

---

## 11. OPEN QUESTIONS FOR THE OWNER

1. **Q-TC12-1** (already batched, ODQ:2209): where does an émigré record persist? This is a persistence shape, and INT-3b's whole remainder waits on it.
2. **ODQ §925.7:** the undecaying disposition ratchet feeds the seat's books in every shipped world, because WR-2 is built but dark. Light `dispositionChannelsEnabled`, or accept it for launch?
3. **The commons composite budget:** five programs propose terms for one clamped three-weight blend (C19). Who owns its term budget, and is lighting `commonsVoiceEnabled` itself on the launch path? Today it is in no preset and not even in the manifest.
4. **Re-sequencing:** under FP-40 chain-first, INTERIOR enters only through a felt chain. Should the GENERALS chain (chain 3, "the coup home") carry INT-3a's join receipt and INT-7's crossing beat as its interior hops? Those two are cheap and felt; the rest of the program is yearly-to-epoch.
5. **The legitimacy recovery clock (FPQ-80, `c860b7345`) is a same-seed behaviour shift on shipped worlds.** It reaches INT-7's certification premise. It is already signed by delegation (FP-60/FP-46) and listed for the end tuning review; this seat records only that INT-7 depends on it.
