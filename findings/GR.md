# GR — THE GRAMMAR FAMILY: COHERENCE READ (2026-10-16, reader seat, chair session 2fc13d59)

Scope read WHOLE: `volumes/DESIGN_FP_GRAMMAR.md` (1573 lines, cited `GRAMMAR:n`), `volumes/DESIGN_FP_ARCH_GR.md` (694, cited `ARCH_GR:n`); `volumes/DESIGN_FP_SPINE.md` §1 (:17-107), SP-3 (:139-162) and §3's FP-GRAMMAR crux (:534-541); `volumes/DESIGN_FP_ARCHITECTURE.md` PHASE 2 (:1053-1157) and the progress block (:891-910). Code of record: `master-00b648c9d` (cited `src/...:n`, static reads only). Build record: `fp-kit-87797a6a-2026-09-23/FP-PROGRESS-BOARD.md` (`BOARD:n`), `FP-ORDER.md`, `FP-QUEUE.md` (`FPQ-n`), `FP-ARCHITECTURE-FOLD-2026-09-23.md` (`FOLD:n`).
Evidence class: every claim below is a READ (CONFIRMED by file:line) unless marked PLAUSIBLE. No test was run.

---

## 1. THESIS

GRAMMAR makes every treaty negotiable rather than dictated: one instrument per pair, a second (now fourth) door for peacetime formation from typed triggers, faith/population/security term families, an oath-holder's name on every signature, a lifecycle that speaks at lapse/detection/renewal, the heir's succession question, and mediation before the first march (`GRAMMAR:30`, `:44-59`; spine `:534-541`).

The DM-felt sentence for the flagship (peacetime formation), the volume's own receipt line: **"Grain for ore: the courts have set their names to it."** (`GRAMMAR:799`, `:1508`) — wired at `src/domain/worldPulse/grammarReceiptPools.js:150`.

Per-mechanism DM sentences and their wiring at master:
- GR-0 lapse: "The peace of the two rivers has run its course — twenty years, and no man now living signed it." (`GRAMMAR:581`) — kinds `treaty_lapsed`/`ran_its_term` wired (`grammarReceiptPools.js:49,:108`).
- GR-0 detection: "The tribute came light, and this time the court noticed." (`GRAMMAR:582`) — `treaty_default_detected` wired (`:67`).
- GR-0 lie tie: "The peace was priced on a lie, and now the lie is out." (`GRAMMAR:583`) — pool exists (`docs/content/RECEIPT_POOLS_GRAMMAR.md:172`) but **NO producer**: `treatiesPricedDuring` is exported and unconsumed (seam-5 tripwire, `ARCH_GR:632-635`); INFO's volume never names it (grep: zero hits in DESIGN_FP_INFORMATION.md / ARCH_IN.md). **No DM-felt sentence reaches a DM.**
- GR-1 signature: "Aldric of Thornwall and Merek of the Vale set their names to it." (`GRAMMAR:653`) — pool exists (`RECEIPT_POOLS_GRAMMAR.md:232`), **no kind wired** (absent from the 15 kinds in `grammarReceiptPools.js:49-235`), and no dossier signature line (`swornPartiesOf` is read only by the succession surfaces — `treatySuccession.js:65`, `display/treatySuccessionDossier.js:50`). **No DM-felt sentence.**
- GR-2 refusal: "They asked, and were refused; the refusal will be remembered." (`GRAMMAR:799-800`) — **no `pact_refused` kind** in the pools; READ 3 recorded "proposals/answers never shown — by design, no slot" (`BOARD:178`). **No DM-felt sentence.**
- GR-3 rights: "Their priests may walk our roads…" (`GRAMMAR:974`) — **no kind**; terms render only through the document's family×state table.
- GR-4: "The old king swore it; the young king must choose." (`GRAMMAR:1089`) — `succession_question_opened`/`_open`/`reaffirmed`/`disavowed_by_succession` wired (`grammarReceiptPools.js:168-212`).
- GR-5: "Rebuilt and unbowed, they have asked for new terms." / "The compelled alliance is compelled no longer." (`GRAMMAR:1190-1191`) — **no kind** ("No news kind (GR-5e is the voice …)", `src/domain/worldPulse/pactRenewal.js:123`). **No DM-felt sentence for renewal, renegotiation or conversion.**
- GR-6: "X stood between them before the first march; there will be no war this spring." (`GRAMMAR:1301`) — `brokered_back` wired (`grammarReceiptPools.js:235-236`). Temple line (`GRAMMAR:1300`) has no producer (occasion 3 unbuilt).

---

## 2. STATUS, TRUTHFULLY

Volume headers: `GRAMMAR:12-16` "Status: ARCHITECTURE. Nothing here is scheduled until the owner sequences it"; `ARCH_GR:14-17` "COMPILED IMPLEMENTATION LAYER. Nothing here is scheduled…". Neither header records that every GR flag is now LIT in shipped presets, nor the sub-unit ids the build used (GR-2b, GR-3a/3b, GR-4a..4e, GR-5A..5f, GR-6-c, GR-RENEWAL, TREATY-VOICE(-2), PACT-REASK/ANSWER/COMPLIANCE). Only GR-2 and GR-3 carry inline build banners (`ARCH_GR:431`, `:483-520`), and the GR-3 banner is now wrong.

Lighting at master (`src/domain/worldPulse/simulationRules.js:789-803`): `FP_LIT_ALIVE` = {`faithUnseatingEnabled`, `pactFormationEnabled`} spread into realistic_regional (`:898`, the DEFAULT preset), dramatic_campaign (`:956`), living_realm (`:999`), full_simulation (`:1213`); `FP_LIT_WARPEACE` = {`mediationGeneralizedEnabled`, `oathHolderEnabled`, `treatyLifecycleVoiceEnabled`, `treatyRenewalEnabled`} only in dramatic_campaign (`:958`) and full_simulation (`:1215`). Owner authority: ODQ §934.84 "no just build it all shipped lit" (ODQ line 32951).

| Wave / unit | Volume's claim | Board / fold | Code @ 00b648c9d | Verdict |
|---|---|---|---|---|
| GR-0 lifecycle voice | ARCHITECTURE, dark (`GRAMMAR:12`, `:244`) | LANDED (FOLD:18; ARCHITECTURE:897); cures TREATY-VOICE (09-24) + TREATY-VOICE-2 U1/U2/U4 (10-02, `BOARD:205-206`) | `treatyLifecycleVoice.js` (567 lines); kinds `treaty_lapsed`/`treaty_default_detected`/`ran_its_term`/`hollowed_detected`; negotiated pacts named (`treatyOrientation.js:62`); TreatyPanel DM chip (`components/map/TreatyPanel.jsx:84,:152`); flag lit in 2 presets | LANDED + LIT (2 presets). Lie tie: read landed, consumer ABSENT (INFO silent) |
| GR-1 oath holder | ARCHITECTURE; "both doors" stamp + credit obligations (`GRAMMAR:604-626`) | PARTIAL — credit-obligation stamp owed, `generosityKernel.js` 800/800 (FOLD:18-19; FP-ORDER pair 1 "GR-1's stamp (after generosityKernel's extraction)") | `stampSworn` at war mint `peaceTerms.js:586`, sale `peaceTermsSale.js:269`, pact `pactFormation.js:651`, renewal `pactRenewal.js:687`; zero `sworn` in `generosityKernel.js`; no dossier signature line | PARTIAL + LIT (2 presets). Dossier round-trip (`GRAMMAR:672-674`) UNBUILT |
| GR-2 formation + NAP | ARCHITECTURE; mount in pulseKernel (`GRAMMAR:296-298`) | LANDED 2026-08-06 `a18fdcfa`/`91075d45` (`ARCH_GR:431`); FOLD:18 says PARTIAL (verb); GR-2b `c0327dfd2` 09-24 (`BOARD:27`); LIT1b-pre U1/U2/U4 (`BOARD:104-106`); PACT-REASK U1 + PACT-ANSWER U1 in batch 7 (BATCH-7-REPORT rows) | `pactTriggers.js`/`pactProposals.js`/`pactFormation.js` (1131 lines)/`pactAmendment.js`; mounted `settlementLifecycleKernel.js:91,:565`; `PROPOSE_PACT` registered; NO `negotiationPictures` import in any pact module; valuation in `pactFormation.js:417,:446`; no proposal/“courts remember” dossier line; FPQ-76 (PACT-ANSWER-2) parked off master (`BOARD:254`) | LANDED-WITH-DIVERGENCES + LIT (4 presets incl. the default) |
| GR-3 term families | ARCHITECTURE (`GRAMMAR:855`); ARCH_GR "GR-3a LANDED; GR-3b OWED/BLOCKED" (`ARCH_GR:489`) | FOLD:18 "GR-3 LANDED" | 12 rows `peaceTermsCatalog.js:249-308`; `grant` executor + seven reads `treatyEnforcement.js:246-328`; producers LANDED — `PACT_DRAFT_LENS` drafts all nine (`pactFormation.js:190-210`); every grant read UNCONSUMED (consumer-dark arm); J-GR-14a war-end lens NOT built (`CLASS_TERM` has no faith/pop class, `peaceTermsCatalog.js:406-416`) | LANDED (both slices); ARCH_GR banner STALE; consumers dark; J-GR-14a unbuilt |
| GR-4 succession | ARCHITECTURE (`GRAMMAR:1005`) | PARTIAL — voice slices GR-4b-β `repudiated`, `honored_by_silence` owed (FOLD:18-19) | `treatySuccession.js`, `…Decision.js`, `…OpeningVoice.js`, `…ProposalApply.js`, `…ReaffirmedVoice.js`, `…Voice.js`; `succession_repudiation` (`treatyBreachTypes.js`); credibility charge `treatyBreachCredibility.js` (GR-4c); `honored_by_silence` appears only in `grammarReceiptPools.js` | LANDED except voice slice; LIT (2 presets) |
| GR-5 renewal / renegotiation / conversion | ARCHITECTURE (`GRAMMAR:1125`) | GR-5A 2026-08-15 (`simulationRules.js:484`); GR-5b `733984e0f` (`BOARD:79-80`); GR-5c `88a9e41ee` (`BOARD:113-114`); GR-RENEWAL U1 organic proposer / U2 GR-5c-b / U3 GR-5d conversion (`BOARD:200-202`); owed GR-5d-l `allied` label (FPQ-70), GR-5e voice, FPQ-47 upward demand | `pactRenewal.js` (1063 lines), `worstObservedEver` fold, `PACT_LINEAGE_ACTS`, `COMPOSABLE_SECURITY_PAIR` (`pactAmendment.js:90`); window 26 wk (`pactRenewal.js:170`); renegotiation once per lineage (`pactRenewal.js:516`); NO news kind | LANDED mechanics, SILENT (no Herald voice); conversion label owed; LIT (2 presets) |
| GR-6 mediation | ARCHITECTURE; three occasions, four endings (`GRAMMAR:1229-1299`) | LANDED `f0f433a05` 09-24 (`BOARD:70-71`); lit by LIT-2 (`BOARD:195-198`); FPQ-26 temple arm impossible under one finder → pair 3 | `mediationPressure.js` (312): occasion 1 at the opener `warDeployment.js:1088`, occasion 2 fray soften; NO temple arm; endings: only `brokered_back` (zero hits `brokered_terms`/`declined_to_broker`/`brokerage_failed`); no reach band / transit read | PARTIAL (2 of 3 occasions, 1 of 4 endings) + LIT (2 presets) |
| GR-7 measurement | the program's DONE gate (`GRAMMAR:1391-1392`) | NOT STARTED (FOLD:19); COURT BONDS flavour (FPQ-56, owner-approved) rides here | No treaty section in `scripts/audit/*` (zero hits for negotiated/pactProposals); per-flag certification rows exist (`certification/subsystemRowsCompact.js:51,:119,:238,:469`, `subsystemRowsVirtual.js:716`) | NOT STARTED, yet every flag is lit — the "DONE when envelopes hold" gate was bypassed by the lighting signature |

Also on master, outside the volume's wave list: PACT-COMPLIANCE U1 (FP-44: `PACT_HONORED_FLOOR 0.5 / PACT_DEFAULT_FLOOR 0.2`, `peaceTermsCatalog.js:36-46`) and U2 (FPQ-75 stream carry); `treatyTermRoles.js` (CR-GR3B-3-R1, the per-clause obligor/monitor roles the volume called `pactCompliance.js`).

---

## 3. LAWS AND OWNER-SETTLED ITEMS (verbatim; the fold may NOT re-narrate)

Spine-level settled law (binding on GRAMMAR):
- Spine §3 FP-GRAMMAR crux, `SPINE:534-541`: "SP-3 IS this program's core (peacetime formation, two-sided drafting, the two new term families, expiry receipts, succession-repudiation, the standalone NAP, renegotiation); plus THE OATH-HOLDER IDENTITY (treaties/obligations record WHO swore — the heir who breaks the father's oath becomes tellable, and succession-repudiation gains its human face); mediation generalizes (any cross-pressured neighbour, the temple arm via FAITH); the envoy program (WR-7) is this volume's war-side sibling — cross-referenced, never duplicated."
- SP-3, `SPINE:139-162`: "drafting is TWO-SIDED via the two-picture contract (negotiationPictures — WR-7's seam, built once, used for war-end AND peacetime)"; "**R1, ONE INSTRUMENT PER PAIR IS LAW**"; "**R3, ONE CATALOG LIST** — term-family membership, spelling, and closure for ALL families … live in GRAMMAR's canonical TERM_CATALOG list (GR-3 mints); this document and every volume POINT at that list and never carry a second one"; "EVERY TREATY, at last, can be negotiated rather than dictated."
- Spine §1 req 1, `SPINE:21-25` (Law One): "the engine models believers, buyers, migrants, and courts — never the underlying truth of a DM's world… never resolves a fate".

Volume laws (`GRAMMAR:90-155`), quoted by name and line — each is design law; amend beside, never rewrite:
- ONE-INSTRUMENT LAW `:91-100` (chair ruling R1).
- WRITER-FAMILY LAW `:101-113` (R2) — arithmetic RELAXED by `ARCH_GR:99-104` (R-1 cure), law stands.
- TWO-PICTURE LAW `:114-119` "(SP-3, settled)": "each party's sheet is drafted and valued under that party's OWN `truthFor`; acceptance is each side's own-picture valuation clearing its own reserve … No merged estimate exists anywhere".
- NO MARGIN IN PEACE `:120-124`.
- K3 — NOBODY IS EVER CURRENT `:125-141`, incl. "THE VALUATION HOME IS RULED: acceptance valuation … lives in `pactProposals.js`" (`:132-135`).
- PAIRWISE ONLY `:142-143` "(law I, verbatim): no congress, no multilateral pact object."
- THE REFUSAL LAW `:144-148`.
- THE OATH LAW `:149-152`: "the death or fall of an oath-holder NEVER voids a treaty automatically. It opens a QUESTION, and the question has a safe default: silence honors the oath."
- NO TIMERS, NO CLAMPS `:153-155` (law L).
- J-GR3-C2 (spelling ruling, `GRAMMAR:461-483`): "RULED: bare `exclusivity` stands … GR-3 mints the ROWS ONLY, as `executor:'seam'` with NO producer … TR-5 lands the EXECUTORS and re-points to this spelling; it must never re-mint under the other one."
- Judgment blocks J-GR-1..J-GR-16 (`GRAMMAR:1399-1482`) — chair rulings, vetoable, "an implementer NEVER re-rules these silently" (`:1396-1397`). J-GRC-1/2/3 (`ARCH_GR:120,:127,:157`).

Owner quotations touching this family (exact):
- ODQ §934.84 (ODQ:32951): "no just build it all shipped lit" · "then do everything else" · "alright do everything according to your judgement." — signs EVERY FP layer's lighting before launch.
- ODQ §934.89 (ODQ:32964): "I leave everything to your judgement and leave you to build it all" — FP-40 chain-first; CHAIN 1 is THE PACT CHAIN (FP-ORDER.md amendment).
- ODQ §934.85 (FPQ-56): "then i approve of your suggestions, add them to the sequence" — COURT BONDS approved "as a treaty FLAVOUR on GR-7".
- ODQ §934.88 (ODQ:32962): "Updates like these need to reflect actions not to potential. Like a definitive actions. Such as X is targeting Y. A has captured B." — binds every GR Herald line.
- The Evidence Law, amended 10-03 ("COMPLETE, NOT CRYPTIC"; memory `owner-law-2026-10-02-the-evidence-law.md`) — binds §8's sentence list.
- FPQ-36 DECIDED 09-24 (FP-23 under the owner's word): "the pact treaty's court names by a NEW SAVED KEY on the signed record" — implemented as `courtNamesOf` (`pactFormation.js:508`).
- Delegated signature FP-44 (PACT band 0.5/0.2) "SIGNED BY DELEGATION … under ODQ §934.89" (`peaceTermsCatalog.js:38-41`); FP-39 conversion trust band 0.68 "RATIFIED as the working band (the owner signs at the sitting)" (`BOARD:200`).

---

## 4. CROSS-PROGRAM CLAIMS

| GRAMMAR claim | Line | Other side (volume or code) | Verdict |
|---|---|---|---|
| `mutual_defense` "feeds the EXISTING `defensive_pact` readers … reachability is instant because the consumers pre-date the term" | `GRAMMAR:902-907`; J-GR-11 `:1439-1444`; `ARCH_GR:192` | Readers key on the RELATIONSHIP type string (`warCapacityReads.js:63`, `warHomeCosts.js:81`, `warAllianceRisk.js:44`, `roads/thirdPartyRansom.js:75`); `mutualDefenseFor` has zero consumers; the coupling row's tripwire says "the day a reader consults `mutualDefenseFor` it reds" (`certification/couplingRegistryGrammar.js:229`) | DISAGREES (code) — the found-writer is not connected; a converted alliance gains no war support |
| `treatiesPricedDuring` consumed by INFO's exposure path | `GRAMMAR:555-561`; seam 5 `ARCH_GR:632-635` | DESIGN_FP_INFORMATION.md / ARCH_IN.md: zero hits | SILENT |
| Succession-risk belief read "declared as the GRAMMAR×INFO row, built there" | `GRAMMAR:631-633` | INFO volumes: no oath/sworn/succession-risk consumer | SILENT |
| Pilgrimage right "forms only with WF-2 lit — §3 precondition, both docs" | `ARCH_WF:494`, `:638` | GRAMMAR/ARCH_GR: zero hits for `pilgrimageEnabled`/WF-2; code drafts `pilgrimage_right` ungated (`pactFormation.js:193`) | DISAGREES ("both docs" is false) |
| Trade-rights spelling `exclusivity` canonical | `GRAMMAR:461-483` | DESIGN_FP_TRADE.md:234 and :857 still say `trade_exclusivity`, with NO pointer beside it although `DESIGN_WAR_RULINGS_ARCHITECTURE.md:213` says "The divergent FP-TRADE row is left standing with a pointer beside it"; COUPLINGS:283 also says `trade_exclusivity` | STALE (TRADE, COUPLINGS); the promised pointer is missing |
| TR-5 lands the three trade-rights EXECUTORS | `GRAMMAR:480-483`; seam 2 `ARCH_GR:620-624` | ARCH_EC:1312-1318: "EC-6 lands ZERO catalog rows, uses those three spellings exactly, and lands the SEAM EXECUTOR"; FOLD:63 (J-EM-6): "TR-5 builds executors for the THREE commercial term rows" | DISAGREES — two programs (EC-6, TR-5) each claim the same three executors |
| GRAMMAR's list is canonical for ALL families | `GRAMMAR:439-447`; SP-3 R3 | TRADE's TR-5 still lists `grain_provision`, `route_wardenship` (TRADE:859-862) not in GRAMMAR §4; ARCH_TR:370-372 "mints ONLY the genuinely-absent remainder of its five"; FOLD:63 "TR-5 mints no term family (the catalogue is GR's)"; ARCH_EC:1318-1319 "The two further GR-3 commercial rows `tradeConvergenceContract.js:334-337` expects remain GRAMMAR's"; code `tradeConvergenceContract.js:334` "GR-3's five commercial TERM_CATALOG rows" | DISAGREES — a second citation cycle: two rows every document assigns to someone else; GRAMMAR §4 silent |
| Catalog canonical; others never re-mint | `GRAMMAR:439-447` | WC-0D minted `amnesty`, `jubilee` with own families (`peaceTermsCatalog.js:341-342`; ARCH_WC:3306, :3549) | DISAGREES with R3's letter — GRAMMAR §4 silent on two landed rows (and on WR-10's `sovereignty_transfer`, `peaceTermsCatalog.js:224`) |
| `shared_rite` spelling (never `shared_rite_compact`) | `GRAMMAR:448-454`; J-GR-15 | FAITH:1094 "follows GRAMMAR: `shared_rite`"; code `peaceTermsCatalog.js:249` | AGREES |
| POP consumes `migration_right` / `settlement_provision` | `GRAMMAR:889-901` | POPULATIONS:985-992 AGREES; ARCH_POP:52 (S34) "TERM_CATALOG carries NO migration_right/settlement_provision" | AGREES (volume) / STALE (ARCH_POP census) |
| Formation feeds INTERIOR's coup lane ("a pact against the powers' wishes") | `GRAMMAR:791-793` | ARCH_INT:394 "the pact half triggers SP-3's writer — SP-3 ABSENT, so … STOP-and-report" | STALE (INTERIOR premise; SP-3's writer exists) |
| `trade_demand` reads belief on both ends ("both ends beliefs") | `GRAMMAR:683-687` | Code own-side reads TRUTH ("WHAT A COURT KNOWS ABOUT ITSELF … the reason this composer sits outside the K3 set", `pactFormation.js:226-250`); ARCH_EC:1951-1957 (EC-17, owner 10-16) adds a truth-side own NEED to the same trigger | AGREES between code and EC; GRAMMAR stale |
| `market_access` is "the TR-5 catalog row" | ARCH_EC:1982 | the row is GR-3's (`peaceTermsCatalog.js:307`) | DISAGREES (ownership homonym) |
| Shared-threat via WR-6 alliance-web read, third consumer | `GRAMMAR:700-702`; `ARCH_GR:199` | `pactFormation.js:123` imports `readAllianceWebRisk`; walker `tests/lint/allianceWebRiskConsumers.walker.test.js` lists pact modules | AGREES |
| Transport: envoy errand lit / abstract dark, mode on receipt | `GRAMMAR:315-320`; `ARCH_GR:298-300` | `PACT_TRANSPORTS` (`pactProposals.js:84`); envoy keys dark in every preset (`simulationRules.js:782-784` comment, `:1063`) | AGREES (abstract arm only ever runs) |
| Temple arm via FAITH's facet resolution | `GRAMMAR:1248-1253` | FPQ-26: "'faith-led on both sides' cannot occur under the one finder … needs a second finder or a widened one (a design act at the GR × WF seam)" | DISAGREES with J-GR-6's single-finder law — needs a ruling |
| `seatBooksEnabled` input to the reserve | `GRAMMAR:275-278` | `reserveFor` reads posture + appetite + credibility only (`pactFormation.js:417-433`); `seatBooksEnabled` in 1 src file | AGREES as the declared degraded arm (books never read) |

---

## 5. INTERNAL CONTRADICTIONS

1. K3 membership of `pactFormation.js`: `GRAMMAR:127-129` puts `pactFormation.js` IN the K3 pin set; `GRAMMAR:136-138` says it "EXECUTES accepted proposals … and never values a sheet" (an executor need not be in K3); `ARCH_GR:40-42` lists only `pactTriggers`/`pactProposals`/renewal evaluator. The code resolves it a third way: `pactFormation.js` is outside K3 AND does the valuation (`pactFormation.js:227`, `:417`, `:446`).
2. Trigger vocabulary "CLOSED, five" (`GRAMMAR:338-340`; `ARCH_GR:296`) vs the code's six (`pactTriggers.js:60-62`, `renegotiation` added by GR-5c "growth by R-24"). GR-5's own text makes the mid-term demand "a proposal like any other" (`GRAMMAR:1143-1146`) without minting the trigger — the volume needed the sixth word and never wrote it.
3. Flag shape: `GRAMMAR:239-240` "lit only at owner-signed points"; `ARCH_GR:226-227` "ABSENT … from every preset override, with NO exception — manifest-only is the law" vs the same family lit in presets under the owner's signature (`simulationRules.js:789-803`). The ARCH_GR erratum (`:229-270`) is about the `false`-declaration arm and predates LIT-1a; nothing records that "manifest-only" stopped being the state.
4. Lighting order: `GRAMMAR:256-258` "Lighting order = build order (GR-0 → GR-1 → GR-2/3 → …); a flag lit out of order is an invalid config the GR-7 certification walker reds" vs `FP_LIT_ALIVE` lighting `pactFormationEnabled` alone in realistic_regional and living_realm while GR-0/GR-1 stay dark there (`simulationRules.js:898`, `:999`). Both cannot hold; the walker that would red does not exist (GR-7 not started).
5. Dossier surfaces: `GRAMMAR:225` "every GR dossier round-trip lands on these three" (WarFaithTab, TreatyPanel, PDF) — WarFaithTab no longer exists; the TreatyBlock "move[d] here whole from WarFaithTab" (`components/new/tabs/WarTab.jsx:32`, `:354`).
6. Mediation endings: `GRAMMAR:1297-1299` closes four members and `:1368-1372` makes floors on two of them the program's acceptance criterion; GR-6 landed one (`mediationPressure.js:76`). The volume's DONE gate cannot be met by the landed design.
7. GR-3 status: `ARCH_GR:483-487` "GR-3b is owed but BLOCKED" vs FOLD:18 "LANDED: … GR-3" and `PACT_DRAFT_LENS` (`pactFormation.js:190-210`) — the producer side exists.
8. Herald §8 vs the owner's later voice law: `GRAMMAR:1508-1522` lists sentences without actors ("Grain for ore: the courts have set their names to it.", "The tribute came light, and this time the court noticed.") — §934.88 requires "X is targeting Y. A has captured B." and the 10-03 amendment requires "name who, which power, what effect". The pool already slots `{good}` but not the courts (`grammarReceiptPools.js:150`).

---

## 6. STALE PREMISES (refuted at 00b648c9d)

| # | Premise | Line | Live line | |
|---|---|---|---|---|
| 1 | Valuation home is `pactProposals.js` | `GRAMMAR:132-135` | `export function reserveFor` `pactFormation.js:417`; `answerPactProposal` `:446` | REFUTED |
| 2 | Drafting/acceptance ride `negotiationPictures.js`, each side under its own truthFor (SP-3 settled) | `GRAMMAR:114-119`, `:321-326`; `ARCH_GR:133-139` | no pact module imports `negotiationPictures` (src consumers: envoy/coalition/sovereignty files only); acceptance = responder-only `offer01 >= reserve01 && !fear.refuses` (`pactFormation.js:476-494`); offer = `0.5*substance + 0.5*responderDemand01` (`:458`) | REFUTED — the proposer-side arm of the two-sided conjunction does not exist; the "two arms" are value + reliance of the responder |
| 3 | `advancePeacetimePacts` called from pulseKernel | `GRAMMAR:296-299` | `settlementLifecycleKernel.js:91`, `:565` (ARCH_GR R-3 already said so) | REFUTED (cured in ARCH_GR, not in the volume) |
| 4 | TERM_CATALOG 11 terms / 7 families (`GRAMMAR:191`); 12/8 (`ARCH_GR:176`) | | 26 rows, 13 families, 7 executors (`peaceTermsCatalog.js:181-342`, `TERM_EXECUTORS` `:376-378`) | STALE |
| 5 | GR-1 stamps "both doors"; ARCH_GR "three doors" | `GRAMMAR:604-606`; `ARCH_GR:408-411` | four stamp sites: `peaceTerms.js:586`, `peaceTermsSale.js:269`, `pactFormation.js:651`, `pactRenewal.js:687` | STALE (renewal re-swear is a fourth) |
| 6 | `mutual_defense` fires the existing `defensive_pact` readers | `GRAMMAR:902-907` | `mutualDefenseFor` `treatyEnforcement.js:328` unconsumed; readers read relationship-type sets (`warCapacityReads.js:63`) | REFUTED |
| 7 | GR flags absent from every preset | `ARCH_GR:226-227`; also code comment `pactProposals.js:120` "absent from DEFAULT_SIMULATION_RULES and from every preset spread" | `simulationRules.js:789-803` | REFUTED (owner-signed shift; the code comment is stale too) |
| 8 | SP-4 reads `postureOf`/`riskToleranceOf` | `GRAMMAR:783-784` | `courtPostureOf, courtRiskAppetiteOf` `pactFormation.js:120` (ARCH_GR Q2's rename adopted) | STALE |
| 9 | Per-party compliance lives in a `pactCompliance.js` leaf with `observerReach` | `GRAMMAR:399-425` | zero hits for both; built as `treatyTermRoles.js` (CR-GR3B-3-R1, header :1-40) | STALE (renamed design) |
| 10 | Dwell = transit legs | `GRAMMAR:778-780` | `answerDueTick = tick + 2*weeks + DELIBERATION_WEEKS(2)` `pactProposals.js:220-227` (round trip + deliberation) | STALE (law M honored; the formula is richer) |
| 11 | pulseKernel BANKED at 1580 | `ARCH_GR:28` | `scripts/.size-baseline.json:13` → 1581 | STALE (by one; matches the brief's frozen-kernel 1581) |
| 12 | `peaceTerms.js` 794/800 (`GRAMMAR:105`); ~766/800 (`ARCH_GR:92`) | | header comment "at 790 of its 800" (`treatyTermRoles.js:11`); board "797" (`BOARD:70`); my non-blank/non-comment approximation 789 (PLAUSIBLE — not the enforcer) | STALE, still within ceiling |
| 13 | Leaf budgets: `pactFormation.js` ≤200 eff | `ARCH_GR:450-452` | ~563 effective (approximation; board measured 511 at GR-5c, `BOARD:118`) | STALE (budget blown 2.5×, still under 800) |
| 14 | Turning-point rendering → GR-2 lands "the courts remember" WarFaithTab line + standing-proposal line | `GRAMMAR:836-848` | no component/display reads `pactProposals` or `turningPoints` for pacts (zero hits in `src/components`, `src/domain/display`, `src/pdf`) | UNBUILT |
| 15 | Code comment says GRAMMAR §4 has no trade-rights row | `peaceTermsCatalog.js:297-305` | `GRAMMAR:461-483` carries it [ADDED 2026-08-06] | code comment STALE |
| 16 | "GR-3's five commercial TERM_CATALOG rows" | `tradeConvergenceContract.js:334` | three rows `peaceTermsCatalog.js:306-308` | code comment STALE |
| 17 | `reparations` producer-less "owed to the chair" | `ARCH_GR:515-519` | `CLASS_TERM` still has no class → `reparations` (`peaceTermsCatalog.js:406-416`) | STILL TRUE, still unslotted in any volume |
| 18 | Owner's later rulings overturning premises | — | the coin reversal (ODQ §731.1), birth door, frozen kernel: GRAMMAR is coin-free (streams are grain-months) and births nothing; only #11 touches the kernel. No GR premise is overturned by them. | CHECKED, none |

---

## 7. THE CLOCK AND THE TIER

| Mechanism | Fast layer / slow verdict (cadence) | Aspatial? / lit preset needed | Felt-drama clock |
|---|---|---|---|
| Trigger scoring | per pulse (weekly) | runs aspatial (`answerDueTickFor` falls back to the 1-week floor when no digest, `pactProposals.js:216-222`); belief triggers (`trade_demand`, `migration_pressure`) need a belief-recording infoMode — dramatic, living_realm, full_sim (`simulationRules.js:766-773`); `shared_threat` needs no beliefs; `faith_communion` needs `believedDevotionEnabled`, lit in NO preset (`:251` manifest only, `:772` comment) → PLAUSIBLE: faith_communion never crosses in any shipped world, so the five faith terms reach the table only through `PROPOSE_PACT` | weekly but invisible (no beat) |
| Proposal → answer | 2×legs+2 wk = 4–18 weeks (digest 2..8 wk, `ARCH_GR:201`) | aspatial OK | SEASONAL — a DM advancing a few weeks sees nothing (no proposal line, no refusal beat) |
| Refusal cooldown | 52 ticks (`pactFormation.js:152`) | — | YEARLY |
| Signing beat | at signing | — | event; rate measured ~7–15 pacts / 20 years per world (`BOARD:207`, `:228`) → roughly one signing per 1.3–3 years |
| Term life | 3–8 base years (`peaceTermsCatalog.js:249-285`) | — | YEARLY–EPOCH |
| Detection beat | crossing tick (fast) after strain | WARPEACE presets only | event, years in |
| Lapse eulogy / age line | at term end; age line on dossier always | WARPEACE presets only | YEARLY–EPOCH (the eulogy fires 3–8 years after signing) |
| Renewal window | last 26 weeks (`pactRenewal.js:170`) | WARPEACE only | YEARLY (at year 3–8), and silent |
| Renegotiation | anniversary demand (yearly), once per lineage (`pactRenewal.js:516`) | WARPEACE only | YEARLY, silent |
| Conversion | at a compelled alliance's renewal (4–8 yr) | WARPEACE + a war-end alliance | EPOCH, silent |
| Succession question | at a power change; 6-week hold band | WARPEACE only; queue mode needs `routineMajorApproval` (opt-in) | event, rare (years) |
| Mediation occasion 1 | 2-tick intent TTL | WARPEACE + war layer + a cross-pressured neighbour | fast but rare |
| Mediation occasion 2 | per tick soften, trust once | WARPEACE | invisible (no beat) |
| Credibility charge | SP-5 decay | — | slow, invisible except the reserve's "will not treat" clause |

Flagged: every GR mechanism except mediation occasion 1 and the detection crossing has its felt drama at the seasonal clock or slower, and the four that run yearly-or-slower (renewal, renegotiation, conversion, lapse) are either silent or fire years after the event a DM remembers. The pacts a DM can watch within a few weeks are the DM's own `PROPOSE_PACT` asks, and those also go unanswered on any surface.

---

## 8. DEPTH VS FELT VALUE

| Mechanism | What a DM sees today | Judgment |
|---|---|---|
| GR-0 lapse eulogy + age line | age line on the treaty card; eulogy years later | KEEP |
| GR-0 detection beat | one beat when a court notices | KEEP |
| GR-0 lie tie (`treatiesPricedDuring`) | nothing (no consumer) | CUT-TO-SENTENCE until INFO slots its consumer; keep the read |
| GR-0 DM true-state chip | premium chip on TreatyPanel | KEEP |
| GR-1 oath stamp | nothing directly; powers GR-4 | KEEP the stamp; BUILD the signature line or it is invisible |
| GR-1 credit-obligation stamp | nothing (no reader) | CUT-TO-SENTENCE (no consumer anywhere; the heir-of-debt question is declared deferred, `GRAMMAR:622-626`) |
| GR-2 four triggers + answer | a signing beat ~once per 1–3 years; nothing for asks/refusals | KEEP; the proposal/refusal dossier line is the cheapest felt win (seasonal clock) |
| GR-2 two-picture drafting | nothing — not built | owner-level: rule the code's one-sided answer as the design, or build the proposer arm (§11) |
| GR-2 standalone NAP | a "neither shall march" beat | KEEP |
| GR-2 `broken_by_war` closure | nothing spoken (no kind) | FOLD into the war record's own narration |
| GR-2 dependency-fear counterforce | the refusal receipt only | KEEP (it is the counterforce) |
| GR-2 `PROPOSE_PACT` verb | the DM's ask; answer consumer (FPQ-1/GR-2b-c) owed | KEEP |
| GR-3 faith/pop grant rights | document family rows; no consumer bites | DEFER the nine to their consumer waves (already "teeth deferred", `GRAMMAR:914-925`); they cost nothing standing |
| GR-3 `mutual_defense` | nothing (unconsumed) | KEEP, but wire one reader — it is the only thing that makes conversion and shared-threat pacts matter in a war |
| GR-3 trade-rights seams | nothing | KEEP (seam rows only); settle executor owner (§11) |
| J-GR-14a war-end lens | not built | DEFER (golden shift for a darker-Augsburg story nobody has asked for) |
| GR-4 succession question + disavowal | open-question line, disavowal/reaffirmed beats | KEEP |
| GR-4 credibility charge | "will not treat with this court on its word alone" clause | KEEP |
| GR-5 renewal window | silent continuation (or lapse) | KEEP the mechanic, BUILD GR-5e's beat or FOLD renewal into the eulogy line ("renewed, not lapsed") |
| GR-5 renegotiation-from-strength | silent | CUT-TO-SENTENCE until GR-5e lands; yearly, once-per-lineage, silent |
| GR-5 conversion | silent; label proposal owed (FPQ-70); `mutual_defense` unconsumed | DEFER (epoch clock, three missing links) |
| GR-6 occasion 1 ("the war that did not happen") | one beat, rare | KEEP |
| GR-6 occasion 2 (fray soften) | nothing | CUT-TO-SENTENCE (a strain notch nobody sees) |
| GR-6 occasion 3 temple arm | not built; impossible under one finder (FPQ-26) | DEFER to pair 3 with the finder ruling |
| GR-6 three unbuilt endings | — | FOLD into `brokered_back` + a single "declined" receipt, or record the four-member vocabulary as aspirational |
| GR-7 envelopes | — | KEEP the thesis metric + endings mix only; the other eight envelopes CUT-TO-SENTENCE until the layers they measure speak |

---

## 9. VOCABULARY (closed ladders / enums minted by GRAMMAR)

| Name | Values | Volume line | Code line |
|---|---|---|---|
| PACT_TRIGGERS | volume: trade_demand, faith_communion, migration_pressure, shared_threat, renewal (five) | `GRAMMAR:338-340` | six incl. `renegotiation` `pactTriggers.js:60-62` |
| proposal state | open, signed, refused, expired | `GRAMMAR:344` | `pactProposals.js:81` |
| PACT_TRANSPORTS | abstract, envoy | `ARCH_GR:299` | `pactProposals.js:84` |
| PACT_PROPOSAL_REFUSALS (veto codes) | no_cap_headroom, open_proposal_exists, invalid_term_sheet | `GRAMMAR:752-753` | `pactProposals.js:93` |
| provenance | dictated, negotiated, renewed, converted | `GRAMMAR:362-365` | `pactRenewal.js:216-219`, `pactAmendment.js` |
| lineage act | formed, amended, renewed, renegotiated, converted | `GRAMMAR:368-370` | `PACT_LINEAGE_ACTS` `pactAmendment.js` |
| worstObservedEver | honored, strained, defaulted | `GRAMMAR:426-427` | `pactAmendment.js:120ff` |
| beneficiary | settlementId \| 'both' | `GRAMMAR:379-381` | `pactFormation.js:367-385` |
| COMPOSABLE pair | {non_aggression, mutual_defense} | `GRAMMAR:394-398` | `pactAmendment.js:90` |
| breachType + | succession_repudiation | `GRAMMAR:436` | `treatyBreachTypes.js` |
| formation endings | signed, refused, no_overlap, expired_unanswered | `GRAMMAR:795-796` | `pactAmendment.js:66` |
| PACT ENDINGS | ran_its_term, renewed, converted, renegotiated, repudiated, disavowed_by_succession, hollowed_quiet, hollowed_detected, broken_by_war | `GRAMMAR:1346-1348` | `treatyLifecycleVoice.js:91` (GR-0's subset) |
| mediation endings | brokered_back, brokered_terms, declined_to_broker, brokerage_failed | `GRAMMAR:1297-1299` | only `brokered_back` |
| succession answers | HONOR, DISAVOW, RENEGOTIATE | `GRAMMAR:1016-1050` | `treatySuccessionDecision.js` |
| term families | faith ×5, population ×3, security +mutual_defense, commercial ×3 | `GRAMMAR:448-461` | `peaceTermsCatalog.js:249-308` (+ amnesty, jubilee, sovereignty_transfer from other programs) |
| executor kinds | + grant (7th) | `GRAMMAR:484` | `TERM_EXECUTORS` `peaceTermsCatalog.js:376-378` |
| age phrasing | young / settled / old | `GRAMMAR:596-597` | `TREATY_AGE_BANDS` `treatyLifecycleVoice.js:105` (TREATY-VOICE-2 U2 added weeks/seasons) |

Homonym hazards for the chair: `renegotiated` is BOTH a lineage act and a pact ending (GRAMMAR-internal, consistent); `restitution` (economic, war-door) vs `temple_restitution` (faith); `signed` is BOTH a proposal state, a formation ending AND a wizard_news kind (`grammarReceiptPools.js:149`); `expired` (proposal state) vs `expired` (term compliance state, `GRAMMAR:1359-1361`); `defensive_pact` (relationship type) vs `mutual_defense` (term) — the very gap in §4 row 1; "endings" — `GRAMMAR:1358-1361` already warns siblings that "the treaty's own endings" means compliance states; TRADE's endings {fortune, ruin, monopoly, collapse, severance, cornered} (`SPINE:501`) share no token.

---

## 10. REFINEMENTS (in place, bracketed; never rewriting a law)

1. `[GRAMMAR:12]` — "Status: ARCHITECTURE. Nothing here is scheduled…" → `[CORRECTED 2026-10-16 (coherence fold) — BUILT AND LIT. GR-0/2/3/4/5/6 landed (GR-1 partial, GR-7 not started) and every GR flag is lit in shipped presets under ODQ §934.84 ("no just build it all shipped lit"); see ARCH_GR §2's status table. This volume stays the design law; build state lives in docs/implementation/INDEX.md.]` — the header misleads every reader.
2. `[GRAMMAR:114-119]` (beside the TWO-PICTURE LAW) → `[CORRECTED 2026-10-16 (coherence fold) — NOT AS BUILT. The landed answer is the responder's own value-vs-reserve plus its dependency fear (pactFormation.js:446-494); no pact module reads negotiationPictures.js and the proposer's own-picture acceptance arm does not exist. Owner question §11-Q1 decides whether the law or the code yields.]` — a settled SP-3 law silently unbuilt.
3. `[GRAMMAR:132-135]` → `[CORRECTED 2026-10-16 (coherence fold) — valuation lives in pactFormation.js (reserveFor :417, answerPactProposal :446), which sits OUTSIDE the K3 set because a court's self-read is knowledge (:226-250); pactProposals.js owns state only.]`
4. `[GRAMMAR:338-340]` → `[CORRECTED 2026-10-16 (coherence fold) — SIX: GR-5c added `renegotiation` (pactTriggers.js:60-62); the import validator checks six.]` (same bracket at `ARCH_GR:296`, `ARCHITECTURE:1090`).
5. `[GRAMMAR:902-907]` and J-GR-11 `[:1439]` → `[CORRECTED 2026-10-16 (coherence fold) — NOT CONNECTED. The defensive_pact readers key on the relationship TYPE (warCapacityReads.js:63, warHomeCosts.js:81, warAllianceRisk.js:44, thirdPartyRansom.js:75); mutualDefenseFor (treatyEnforcement.js:328) has no reader (couplingRegistryGrammar.js:229 tripwire). Slot: one reader unit, with GR-5d-l.]`
6. `[GRAMMAR:461]` (the commercial row) → `[CORRECTED 2026-10-16 (coherence fold) — the list also carries rows other programs minted: `sovereignty_transfer` (WR-10), `amnesty`, `jubilee` (WC-0D, own families) — listed here by pointer so the canonical home is complete; `grain_provision` and `route_wardenship` (TRADE TR-5) are NOT catalogued and no document owns them (see §11-Q3).]` — the J-GR3-C2 citation-cycle failure is recurring.
7. `[GRAMMAR:480-483]` → `[CORRECTED 2026-10-16 (coherence fold) — EXECUTOR OWNER CONTESTED: ARCH_EC:1312-1318 (EC-6) and FOLD J-EM-6 (TR-5) both claim the three seam executors; one must yield (§11-Q3).]`
8. `[GRAMMAR:225]` and `[:592]`,`[:672]`,`[:836]`,`[:1117]`,`[:1213]`,`[:1318]` → `[CORRECTED 2026-10-16 (coherence fold) — WarFaithTab is gone; the TreatyBlock lives in components/new/tabs/WarTab.jsx:354. As built, the card shows the age line and succession lines (display/treatyDocument.js:382,:388); the signature line, lineage line, standing-proposal line and "courts remember" line are UNBUILT.]`
9. `[GRAMMAR:256-258]` → `[CORRECTED 2026-10-16 (coherence fold) — SUPERSEDED BY THE LIGHTING SIGNATURE: pactFormationEnabled lights in four presets, GR-0/1/5/6 in two (simulationRules.js:789-803), so realistic_regional and living_realm run GR-2 without GR-0/GR-1 — a lawful degraded arm, not an invalid config; the GR-7 walker must encode the preset sets, not the build order.]`
10. `[GRAMMAR:1297-1299]` → `[CORRECTED 2026-10-16 (coherence fold) — one of four landed (brokered_back, mediationPressure.js:76); `declined_to_broker`/`brokerage_failed` have no producer, so GR-7's floors at :1368-1372 cannot be met until they do.]`
11. `[GRAMMAR:1248]` (temple arm) → `[CORRECTED 2026-10-16 (coherence fold) — UNREACHABLE under J-GR-6's one finder (FPQ-26, measured 09-24): a faith-led-both-sides broker is never the finder's answer. Needs a finder ruling at the GR×WF seam, pair 3.]`
12. `[GRAMMAR:1507]` (§8 head) → `[CORRECTED 2026-10-16 (coherence fold) — every sentence below is bound by ODQ §934.88 ("…Such as X is targeting Y. A has captured B.") and the Evidence Law's COMPLETE, NOT CRYPTIC amendment: a line names its courts and what changed; actorless exemplars are retired at their pool's next rewrite.]`
13. `[ARCH_GR:483-489]` → `[CORRECTED 2026-10-16 (coherence fold) — GR-3b LANDED: PACT_DRAFT_LENS (pactFormation.js:190-210) drafts all nine new rows; FOLD:18 records GR-3 LANDED. Still owed: J-GR-14a; `reparations`' producer.]`
14. `[ARCH_GR:226-227]` → `[CORRECTED 2026-10-16 (coherence fold) — superseded for lighting by LIT-1a/1b/2 under ODQ §934.84; manifest membership stands (simulationRules.js:365-498), preset absence does not.]` Code comment `pactProposals.js:120` carries the same stale sentence — slot with the next pact unit.
15. `[ARCH_GR:28]` "BANKED at 1580" → `[CORRECTED 2026-10-16 (coherence fold) — 1581 (scripts/.size-baseline.json:13).]`
16. `[ARCH_GR:450-452]` → `[CORRECTED 2026-10-16 (coherence fold) — budgets blown: pactFormation.js ~511–563 effective, pactRenewal.js (unbudgeted, a sixth leaf) ~470; both under 800.]`
17. `[DESIGN_FP_TRADE.md:857]` → `[CORRECTED 2026-10-16 (coherence fold) — spelling is `exclusivity` (GRAMMAR §4, J-GR3-C2; peaceTermsCatalog.js:306); this is the pointer DESIGN_WAR_RULINGS_ARCHITECTURE.md:213 promised.]` Same at `TRADE:234`, `COUPLINGS:283`.
18. `[ARCH_WF:494]` → `[CORRECTED 2026-10-16 (coherence fold) — NOT "both docs": GRAMMAR carries no pilgrimage gate and PACT_DRAFT_LENS drafts pilgrimage_right ungated (pactFormation.js:193); the gate lands with WF-2 in FAITH's commit, or the claim is struck.]`
19. `[ARCH_POP:52]`, `[ARCH_INT:394]` → `[CORRECTED 2026-10-16 (coherence fold) — stale: the rows exist (peaceTermsCatalog.js:271-275) / SP-3's writer exists (pactFormation.js).]`
20. Add to GR-7 `[GRAMMAR:1330]` → `[ADDED 2026-10-16 (coherence fold) — COURT BONDS (FPQ-56, owner-approved 2026-09-24 under §934.85) ride this wave as a treaty FLAVOUR, never a mechanism; the volume was silent on an approved item.]`

---

## 11. OPEN QUESTIONS FOR THE OWNER

- **Q1 — The two-picture law (SP-3, settled) vs the built answer.** Peacetime acceptance is one-sided (responder value + reliance); the proposer never re-values under its own picture, and no pact reads `negotiationPictures.js`. Either amend SP-3's "drafting is TWO-SIDED via the two-picture contract" for peacetime, or schedule the proposer arm (a golden-moving change on every lit preset). Spine law is the owner's.
- **Q2 — GR-7 was the program's "DONE" gate, and the program is lit without it.** Record that the §934.84 signature superseded "the program is DONE when these envelopes hold on an owner-ordered soak" (`GRAMMAR:1391-1392`), or slot GR-7 ahead of more GR building.
- **Q3 — Who owns the trade-rights executors and the two uncatalogued TRADE rows?** EC-6 and TR-5 both claim the three seam executors; `grain_provision`/`route_wardenship` are assigned by each document to another. Re-sequencing between programs is the owner's (EC's own dispatch gate is "the release PUSHED AND DEPLOYED", §934.90 addendum 1).
- **Q4 — `faith_communion` is dark in every shipped preset** (PLAUSIBLE, `believedDevotionEnabled` lit nowhere): light the devotion family (a golden shift) or accept that faith pacts exist only by the DM's verb.
