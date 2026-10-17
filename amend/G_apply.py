# Lane G — apply coherence-fold brackets to DESIGN_FP_ARCH_WC.md (insertions only).
# Usage: python3 -I G_apply.py <base> <dest> <log.json>
# Each entry: (id, anchor, mode, text). mode 'in' = insert " "+text right after anchor;
# 'after' = insert a new line (prefix copied from the anchor's last line) after the line where the anchor ends.
import json, re, sys

base_path, dest_path, log_path = sys.argv[1:4]
F = "2026-10-16 (coherence fold"
FV = "[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: "
OD20 = "[OWNER ROW OD-FC-20 — PARKED until chain 2 asks for a field; WC-0E's two normalizers stand writer-less]"
C = "[CORRECTED 2026-10-16 (coherence fold) — "
CL = "[CLARIFIED 2026-10-16 (coherence fold) — "
SE = "[SUPERSEDED BY EVENT 2026-10-16 (coherence fold) — "
def R(sec): return f"[RULED 2026-10-16 (coherence fold {sec}) — "
NAV = "navigate by symbol.]"

E = [
# ---------------- header / status ----------------
("A1-banner0814", "volume is **ARCHITECTED, NOT BUILT**.", "in",
 SE + "WC-0A..WC-0E landed 2026-08-15; the status of record is the bracket in the PROGRESS blockquote below, which points at docs/DESIGN_FP_COHERENCE_FOLD.md §2.]"),
("A2-hdr-CRWC9", "## owner-gated on persisted shape — and it blocks WAVES, not the fold.", "after",
 OD20 + " " + CL + "CR-WC-9's status was spelled five ways (SOL_QUEUE:3-7 superseded-by-the-grant; SOL_QUEUE:413-414 OWNER-GATED and LIVE; ODQ §73.4 owner-parked; fold J-EM-9 ARCH:3142 SIGNED against the same fold's ARCH:3229 gated; GENERALS:270 \"signed with the batch\"); no owner word specific to it exists and the 08-05 grant pre-dates the escalation; the fold routes it to OD-FC-20 (findings WC-1 §2, WC-2 C6).]"),
("A3-STATUS", "> **PROGRESS**: ARCHITECTED, NOT STARTED. No wave has landed.", "in",
 C + "THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2; this header is history. In one line: LIT: none · BUILT DARK: WC-0A..WC-0E (warStance.js, peopleLedger.js, lawBandModulation.js shape-only, the column union + isMilitaryColumn + the widened release guard, the amnesty/jubilee catalog rows, both root flags, contributionLedger.js's record shape and the blocks[] normalizer; 511d2ceb7 · 4c87bae45 · cf7e64660 · e47d67631 · 9602952ba, landed 2026-08-15, no writer, no src importer) · UNBUILT: WC-1..WC-16 (no board row; FP-ORDER pair 5; the fold recommends chain 2 THE AUXILIARY = WC-1, WC-2, WC-4, WC-5 minus the reliability page and WC-14's homecoming sentence, Arcs B-D recorded with the slot \"THE HOST\", OD-FC-19). CR-WC-9: " + OD20 + "]"),
# ---------------- section 0 ----------------
("B0-CRWC21-0.1", "and it is parked the same way, at CR-WC-21, with both positions stated\nand neither taken.", "in",
 C + "RULED 2026-08-06, Position B as ruled (calendar bands, a floored recency modulation, not a decay law); see 1.13.2's bracket.]"),
("B1-ref20-pools", "                  (deployment.blocks[], extending leviedPopulationBySource)", "after",
 C + "shaped like, and reconciled DIRECTIONALLY against, the levy map; never written to it (0.3's one-mouth ruling, 1.4.1's pin). The same retired equality form survives at 4.4 and seam row 14 (\"reconciles to it exactly\") and in DESIGN_WAR_RULINGS_ARCHITECTURE.md §9 item 7 (WAR:1735-1737), which takes this bracket at its own fold (findings WC-1 C-11, X-22).]"),
("B2-vocab-settled", "                  ('veteran' | 'settled'); the diaspora/veteran read.", "after",
 R("§5") + "the cohort KIND 'settled' collides with COHORT_AGE_BANDS' 'settled' on the same row (findings WC-1 C-12); the unlanded kind is renamed **'civilian'** ('veteran' | 'civilian'). Every later 'settled' KIND in this volume reads 'civilian'; the age band keeps 'settled'.]"),
("B3-vocab-brigand", "    brigand       free_unit state change   (counts unchanged)", "after",
 R("§5") + "`brigand` here is the LANDED TAG_EVENTS member (peopleLedger.js:98) and stands; the UNLANDED FREE_UNIT_STATES member of the same spelling (1.7.2, 7.A.6) is renamed **`raiding`**, so this event moves a free unit INTO state `raiding`.]"),
("B4-faith-3.1.6", "religionState share nudges through the ONE\nexisting writer (traditionsKernel's sanctioned nudge);", "in",
 R("§3.1.6") + "the nudge (traditionsKernel.applyFaithNudges) is routed THROUGH religionState's writer family as a declared ±1 share transition: one writer FAMILY per field family, two entry points; the code cure is slotted to the next faith unit.]"),
# ---------------- 1.1 ----------------
("C0-newroad", "THE SENDER-ELECTED CONTRIBUTION IS A NEW ROAD, NOT A WIDENING OF THE\nLEVY SWEEP.", "in",
 CL.replace("coherence fold)", "coherence fold §5 addendum)") + "new beside the levy sweep, but NOT the estate's first reinforcement road: reinforcement.js (the own-army flow), convergenceReactive.js's `reinforce` and the greyed realm verb `REINFORCE` already exist; WC-4 BINDS all three into one road (see WC-4's bracket; findings WC-1 X-26, WC-2 S2).]"),
("C1-S5-391", "1. THE DEPLOYER EXCLUSION. warHomeCosts.js:391", "in",
 C + "now :393 at 00b648c9d (`excludeSet`); " + NAV),
("C2-S5-115", "2. THE WR-6 PEER-LEVY REMOVAL. warHomeCosts.js:115-116", "in",
 C + "the WR-6 comment and its skip now sit at :116-118; " + NAV),
("C3-ref17", "   `new Set(['vassal', 'allied', 'ally', 'defensive_pact'])`.", "in",
 C + "now `new Set(['vassal', 'allied', 'defensive_pact'])` at warHomeCosts.js:81 (`'ally'` removed); re-read CR-WC-13's dead-arm finding against it; " + NAV),
("C4-S5-80", "0.004 (:80) against LEVY_POP_FLOOR 300 (:81)", "in",
 C + "now :82 / :83 (values unchanged); " + NAV),
("C5-S7-117", "                                     STATE_LADDER (:117,", "after",
 C + "occupation.js STATE_LADDER is now :125 and NOT exported (HB-9 owes the export, R-14); " + NAV),
("C6-ref3-shape", "in this volume's tuning table and owner-signed at soak.", "in",
 R("§3.2.17") + "WC-0E landed a DIFFERENT shape: flat {amount, kind, sinceTick, toPartyId} with a raw `amount` (contributionLedger.js:54-56, 9602952ba), not the nested pair>anchor banded record above. The CODE is the shape of record (writer-less, no byte persisted); WC-1 reconciles this section to it with each band DERIVED from `amount` at read (a read, not a second stored field). Inside OD-FC-20's batch.]"),
("C7-supplies-3.1.14", "the supplyShipments link arrival before then).", "in",
 R("§3.1.14") + "no built road carries supplies to an army: food is NON_SHIPPED (supplyKernel.js:73) and supplyShipments records are quantity-free institution links that never route food (supplyShipments.js:17-21, :32-33). EC-4 PROCUREMENT is THE army-draw (own army); a contribution of supplies to an ALLY's army is a CONTRACTED caravan stream under EC-12/EC-18 whose ARRIVAL WC-1 credits, one physical arm credited once; arms/iron/leather only until EC-12's grain road. OWNER ROW OD-FC-35 (wait on EC, or WC builds its own goods road; recommendation: wait).]"),
("C8-alignline-first", "a lit-only behavior shift, declared in WC-6's alignment line, never\n  silent.", "in",
 R("§5") + "this volume's \"alignment line\" is renamed **\"the DOC ROW\"**; it is not the spine's requirement-13 Alignment line (see the bracket at SECTION 3's EVERY WAVE CARRIES).]"),
("C9-S8-relstate", "coalitionSettlementActionWasRecorded(state, actionId) (:266)", "in",
 C + "relationshipState.js is 540 lines at 00b648c9d; the appenders are now :251/:335/:356, the caps :198/:203/:207, the predicate :328; " + NAV),
("C10-ref4-flagship", "lines through the winter; the debt stands\"; TABLE the per-war rows from\nthe edge archive.", "in",
 C.replace("coherence fold)", "coherence fold §3.1.14)") + "undeliverable as written: no built road carries grain to an army (see 1.1.2's bracket). Until EC-12/EC-18 (OD-FC-35) the authored example is troops: \"Emberford's levy held Thornhold's siege lines through the winter; the debt stands\" (findings WC-1 S-1, refinement 4).]"),
("C11-S6-1263", "THE CALL SITE, NAMED. warDeployment.js:1263", "in",
 C + "the call is now warDeployment.js:1317 (the \"Steps 5 + 5b\" comment :1312); " + NAV),
("C12-3.2.18", "those events are PROVEN conserved, which WC-4's alignment line says in\nterms.", "after",
 R("§3.2.18, §6 chain 2") + "the executor's ASPATIAL arm (the `muster` road with muster-time credit, and the reservation) lands WITH WC-1, not at WC-4: the levy sweep is measured silent, so without it WC-1..WC-3 credit nothing on any seeded world. WC-4 keeps the chooser and the coercion arms; the SPATIAL arm still follows at WC-6. The executor is BOUND to the three live reinforcement roads (see WC-4's bracket).]"),
# ---------------- 1.2 ----------------
("D1-vocab-stance", "    WAR_STANCE_LADDER = ['neutral', 'materiel', 'auxiliary',\n                         'belligerent', 'principal']", "after",
 R("§5") + "`stance` names two ladders in the corpus, this WAR stance ladder and EC's TRADE stance {open, taxed, restricted, closed}: prose always says \"war stance\" / \"trade stance\". The rung `materiel` stands (it also names reinforcement.js's W_MATERIEL; WC-4 binds the reinforcement roads and mints no fourth name). `principal` collides with W-OPS's mission principal, which is unsanctioned (OD-FC-4).]"),
("D2-3.2.19", "    warStanceOf(worldState, partyId, warEpisodeKey)\n", "after_exact",
 R("§3.2.19") + "`warStanceOf(rung)` is the LANDED accessor (warStance.js:116) and keeps that meaning; the derivation is spelled `derivedWarStanceOf(worldState, partyId, warEpisodeKey)`, carrying the episode key this section's law requires, and fold J-EM-6's `derivedWarStanceOf(deployments, credit)` is amended to carry it. Every later DERIVING `warStanceOf` in this volume reads `derivedWarStanceOf`.]"),
("D3-generals", "crossing beat says so on both sides of the ledger.", "in",
 R("§3.1.18") + "THE GENERALS FOLD (FPQ-77; docs/DESIGN_FP_GENERALS.md:270 on its branch): a named general's standing may scale the SIZE of what is sent (an input to the contributionMoves chooser) and NEVER the stance, which stays derived from what arrived under this law; GENERALS:270 is amended when that volume folds. A general colouring the stance word itself is OWNER ROW OD-FC-36 (a change to directive (f)'s reading; recommendation NO).]"),
("D4-four-scalars", "casus exposure, terms weight, spoils) re-derive from that one read for\nboth parties.", "in",
 C + "three landed scalar axes, not four; see 1.2.4's opening bracket.]"),
("D5-vocab-crossing", "The crossing is edge-detected (previous band != current\nband) and emits the mission-creep beat, addressed.", "in",
 R("§5") + "prose always qualifies \"crossing\": \"stance crossing\" (this beat) vs \"entrepot crossing\" (1.3.1's crossing accounting, WC-3).]"),
("D6-ref6-banners", "spies count banners (section 4.3).", "in",
 R("§3.1.17") + "NO ES product: ES products are CLOSED at three (`ENVOY_COVERT_PRODUCTS = ['acquire','confirm','refute']`, envoyErrandVocabulary.js:168) and the target read carries no strength band by design (espionageProducts.js:28-31). The enemy's believed share rides the ordinary rumor road only (L-WC-9 stands); composition intel is WC-7's own hop-worn composition news, not an ES row.]"),
("D7-perepisode", "A consumer that asks per anchor is a defect, and the\nWC-2 source scan says so.", "in",
 R("§3.2.19") + "the per-episode consumer reads `derivedWarStanceOf(worldState, partyId, warEpisodeKey)`; see 1.2.2's bracket.]"),
("D8-ref11", "All three quantities below, in both directions, each at its EXISTING\nwrite or read site, never a new writer:", "in",
 C + "FOUR bullets follow; the landed STANCE_SCALAR_AXES is THREE (`['casus','exhaustion','terms']`, warStance.js:89) with spoils folded into terms, and WC-7's swap pin (1.2.2, WC-7 PINS) names the same three (findings WC-1 C-2).]"),
# ---------------- 1.3 ----------------
("E1-3.1.15", "The relay is a COMPOSITION of three existing substrates (census D\nsection F), forking none of them:", "in",
 R("§3.1.15, §6") + "not a composition: supplyShipments records are quantity-free links, one per active institution link, food never routed (supplyShipments.js:17-21, :32-33), and an entrepot toll is a route COST that takes no goods (entrepots.js:13-16). The skim, the staging credit and the four-term stores identity (1.3.3) are NEW mechanism and NEW persisted shape (CR-WC-9's \"shipment relay buckets\", OD-FC-20). WC-3 is CUT-TO-SENTENCE: L10/L11 (people are not stores; shortfall immediate, attribution lagged) stand; the per-hop staging network is RECORDED with the slot \"THE HOST\" (chain 2's successor).]"),
("E2-skimstores", "booked as shortfallBand on the\n              contribution record (the grievance fact)", "in",
 CL.replace("coherence fold)", "coherence fold §3.1.15)") + "the staging-stores credit has no substrate; see 1.3.1's bracket.]"),
("E3-ref7-3.1.13", "section 4.1: one dependency-free leaf, minted once, by whichever volume\nbuilds first.", "in",
 R("§3.1.13") + "the single-table contract is UNMET in code: HB-0 landed its learning curves PRIVATELY a day before WC-0C (habitCurve.js:84 `LAW_WORD_VOLATILITY`, :101 `LEARN_RATES`), lawBandModulation.js has zero importers, and the WC-0C fence's pattern (tests/lint/lawBandTable.walker.test.js:8-11) cannot see habitCurve's names. RULED: ONE table; HB's `learning` row is REGISTERED in lawBandModulation.js (`registerLawBandCurve`) at the next HB unit and habitCurve.js reads it; the fence pattern widens to catch LEARN_RATES-shaped private tables. Dark-identical.]"),
("E4-bucket", "Every term is a named bucket on the shipment record", "in",
 C.replace("coherence fold)", "coherence fold §3.1.15)") + "the shipment record carries no quantity to bucket (supplyShipments.js:17-21); see 1.3.1's bracket.]"),
# ---------------- 1.4 ----------------
("F1-S5-1624", "(the :115-116 WR-6 clause), nor an occupation edge (:79)", "in",
 C + "warHomeCosts.js addresses at 00b648c9d: :391 -> :393, :115-116 -> :116-118, :79 -> :81, :443-450 -> :445-452; " + NAV),
("F2-S10", "1. THE DEPLOYER'S OWN CONSCRIPTS HAD NO BLOCK. deploymentReturn.js:273", "in",
 C + "now :367 (and :302 -> :396); " + NAV),
("F3-3.2.17-arm", "save-file smuggling surface), and that arm covers drawnCohorts by the\nsame fail-closed rule.", "in",
 R("§3.2.17") + "the landed WC-0E arm (worldState.js:163-174) KEEPS any row with a non-empty originId and an integer headcount and passes every other field through unexamined: `drawnCohorts`, `shareIntegral` and unknown keys are never checked. The CODE is the shape of record (writer-less, no byte persisted); WC-6 owes the FIELD-CLOSED row normalizer before any writer lands. Inside OD-FC-20's batch.]"),
("F4-ref9", "sum(tags) <= census law is its sibling.", "in",
 C + "superseded by 0.2's TWO totality laws (LAW 1 the cohort partition, LAW 2 the overlay bound, the named overlap); the single sum is retired (findings WC-1 C-1).]"),
# ---------------- 1.5 / 1.6 ----------------
("G1-taint", "taint read, section 4.3).", "in",
 R("§5, §3.1.17") + "renamed **\"the watched block\"** (ES's \"taint\" is §3.5's journey exposure, a different object); it is the block's army owner's read, not an ES product row.]"),
("H0-vocab-bond", "    `bondOf` reads THIS ledger and nothing else.", "in",
 R("§5") + "prose never says bare \"bond\": \"service bond\" (this ledger), \"diaspora bond\" (1.13.3), \"court bond\" (the compiled fold's §13).]"),
("H1-S9", "clamp01(relation.trust) * 0.3\n   (:108-109, verified)", "in",
 C + "now warCoalitionDecision.js:77 / :126-127 (weights 0.5 / 0.3 hold); " + NAV),
# ---------------- 1.7 ----------------
("I1-vocab-raiding", "    FREE_UNIT_STATES = ['operating', 'foraging', 'brigand', 'dissolving']", "after",
 R("§5") + "the unlanded member `brigand` is renamed **`raiding`** (`['operating', 'foraging', 'raiding', 'dissolving']`); the landed TAG_EVENTS member `brigand` (peopleLedger.js:98) is the event that moves a unit INTO `raiding`.]"),
("I2-S12", "(:467, :502, :698, :742, the symbol imported at :33),", "in",
 C + "the live calls are armyTransitKernel.js:482/:517/:738/:789 at 00b648c9d, AND an OMITTED counts stepper navalKernel.js:302 (`stepArmyPosition(rec, nowTick)`) the manifest's discovery signature must find; FPQ-18 also routes four speed-floor pairs here; " + NAV),
("I3-S11", "spatial/migration.js's releaseArrivals (:578)", "in",
 C + "declared :616, its guard :641 (already widened by WC-0B); " + NAV),
# ---------------- 1.8 ----------------
("J1-ref8-3.1.16", "the brigand envelope refilling by theft -- the relay\n  network's dark mirror.", "in",
 R("§3.1.16, §5") + "a persisted `embattlement` region ledger already exists, phase `embattled`, ramping on occupation + siege + war exhaustion + high crime − security (spatial/embattlement.js:1-30; its row in spatialUsage.js). A brigand siege is ONE MORE RAMP TERM on embattlement.js, never a parallel stressor; \"embattled\" means that ledger's phase; CR-WC-11 is re-read against it at build.]"),
("J2-vocab-worn", "                             'buy_off']", "after",
 R("§5") + "the unlanded rungs `attrition` / `absorption` collide with attrition.js / `accumulatedAttrition` and moverAbsorption; they are renamed **`worn_down`** / **`absorbed`** (`['suppression', 'worn_down', 'absorbed', 'buy_off']`).]"),
("J3-crime-3.1.16", "CRIME_ARCHETYPES read, pressureModel.js -- an extension of a frozen\nset, walked).", "in",
 R("§3.1.16") + "\"embattled\" is the embattlement.js ledger's phase; the crime coupling reads that phase (whose ramp already carries high crime) rather than a parallel stressor; see 1.8.1's bracket.]"),
# ---------------- 1.9 / 1.10 / 1.11 ----------------
("K1-vocab-half", "    CALL_IN_ANSWERS = ['answered', 'partial', 'refused', 'lapsed']", "after",
 R("§5") + "the answer rung `partial` is renamed **`half_answered`** (`['answered', 'half_answered', 'refused', 'lapsed']`); `partial` stays CONTRIBUTION_CLOSE_GRADES' member (7.A.3), so the composed pair never carries one word twice.]"),
("K2-S19-coin", "is preserved by both landing as catalog rows through the same floor).", "in",
 "[ADDED 2026-10-16 (coherence fold) — PREMISE OVERTAKEN: the owner reversed the no-treasury record (ODQ §731.1, 2026-08-29, Q-W8 GRANTED; `treasuryEnabled` minted, simulationRules.js:478), so the buy-off and the debt exits now have a possible coin road this volume never considered (PLAUSIBLE coupling, findings WC-1 S-19).]"),
("K3-reliability", "Spies\nsteal ally-reliability as an ES tap PRODUCT (section 4.3).", "in",
 C.replace("coherence fold)", "coherence fold §3.1.17, §6)") + "no ES product road exists (closed at three, envoyErrandVocabulary.js:168); see 1.2.3's bracket. The reliability page itself is HB-6-gated and is cut from chain 2.]"),
# ---------------- 1.13 ----------------
("L1-ref19", "        '<originId>:<kind>': {       // kind: 'veteran' | 'settled'", "after",
 R("§5") + "the KIND reads 'veteran' | 'civilian' (see 0.2's cohort-row bracket); 'settled' is the AGE BAND only (COHORT_AGE_BANDS below).]"),
("L2-ref12", "PARKED, NOT RESOLVED (CR-WC-21): WHAT STEPS THE AGE BAND.", "in",
 C + "RULED 2026-08-06 (b75e8c4d; WC_CHAIR_RULINGS.md:1434), Position B as ruled: calendar bands kept (AGE_BAND_EDGES_YEARS 5 / 20); RECENCY_WEIGHTS reclassified as a BOUNDED, FLOORED band modulation registered with its consumer, NOT a decay law; only mortality zeroes a bond; 5.1 stands un-narrowed (5.1's RULED paragraph). WC-15 carries ONE three-pin set, not two variants, and is not gated on CR-WC-21. This section below is the pre-ruling record.]"),
("L3-bothvariants", "Until it is ruled,\nthe WC-15 pin is carried in BOTH variants", "in",
 C + "ruled; see this section's PARKED-line bracket.]"),
("L4-unruled", "WHAT STEPS THAT BAND IS UNRULED: CR-WC-21)", "in",
 C + "RULED: calendar edges 5 / 20 years with a floored recency modulation; see 1.13.2's bracket.]"),
# ---------------- 1.17 ----------------
("M1-S7-1171", "STATE_LADDER, :117, verified: contested /", "in",
 C + "STATE_LADDER is now :125; see 1.17.2's bracket.]"),
("M2-S7-1172", "so accelerating the climb toward `vassalized`.", "in",
 C + "occupation.js addresses at 00b648c9d: STATE_LADDER :117 -> :125 (and NOT exported; HB-9 owes the export, R-14), stabilizationSuitability :386 -> :645, advanceOccupationState :442 -> :724, vassalizationOutcomes :724 -> :1059, so the old :724 now names advanceOccupationState; " + NAV),
# ---------------- section 2 ----------------
("N1-ref18", "    warCoalitionSettlement.js 742 eff      (58 lines)", "after",
 C.replace("coherence fold)", "coherence fold §3.3.8)") + "re-measured at 00b648c9d: cite scripts/.size-baseline.json and eslint's EFFECTIVE count, never a raw wc. Baselines: applyWorldPulse 907, pulseKernel 1581 (frozen), roadsKernel 838, warTermination 818; stressorDynamics.js is no longer baselined. Approx eff (PLAUSIBLE precision): peaceTerms ≈799 (ONE line of headroom: AT CEILING, it takes ZERO lines from any wave without a leaf-first decomposition car), envoyDiplomacy ≈762, beliefMap ≈781, settlementStrategy ≈763 (no per-file override needed), armyTransitKernel ≈798.]"),
("O1-ref15b", "                                        drifted-self-alignment by drift\n                                        depth, typed reasons out.", "after",
 C + "THREE consumers (block-fork defect, army rejoin, unit merge), per 1.7.3 (findings WC-1 C-8).]"),
("O2-ref14", "covered by the widened law-M\n                                        manifest (CR-WC-10).", "in",
 C + "CR-WC-10 RULED: law M is NOT widened; freeUnitKernel.js registers in the SECOND counts-mover manifest (1.7.3).]"),
("O3-ref15", "the tag-totality law, absorb/\n                                        demobilize tag events,", "in",
 C + "`absorb` is retired into `untag` kind 'cohort' (0.2); read \"untag/demobilize\".]"),
("O4-C9", "genuinely-new figure, used in both sentences, with every part shown.", "in",
 CL + "\"4,960\" still names TWO quantities in adjacent paragraphs: the post-round-3 24-leaf DOMAIN total (which includes the 200-eff extraction) and the pre-round-3 genuinely-new total (5,160 − 200). The post-round-3 genuinely-new figure is 5,090; a reader citing \"4,960 genuinely new\" is citing the pre-round-3 number (findings WC-1 C-9).]"),
("P1-attach", "                               freeUnitKernel.js when it lands)       (CR-WC-10)", "after",
 C + "this table's line addresses were measured at 3e2bd309/cbd348a5 and have drifted (00b648c9d: warDeployment.js:1263 -> :1317; warHomeCosts.js :391 -> :393, :115-116 -> :116-118, :79 -> :81, :443-450 -> :445-452; warCoalitionDecision.js :59 / :108-109 -> :77 / :126-127; migration.js :520 -> :558, :553 -> :591, :578 -> :616, :598 -> :641 (guard already widened); stepArmyPosition calls armyTransitKernel.js:482/:517/:738/:789 plus navalKernel.js:302); navigate by symbol. Three rows are RULED: \"arrival credit (supplies)\" (§3.1.14, OD-FC-35), \"relay staging\" / \"relay links\" (§3.1.15, CUT-TO-SENTENCE), \"composition intel\" (§3.1.17, no ES product).]"),
# ---------------- section 3 head ----------------
("Q1-ref13", "                                                early -- K6 CORE)", "after",
 C.replace("coherence fold)", "coherence fold §3.2.18, §6)") + "with the levy sweep measured silent and the executor at WC-4, WC-1..WC-3 credit nothing on any seeded world; RULED: the dispatch executor's ASPATIAL arm lands WITH WC-1. The felt chain is fold §6 chain 2 THE AUXILIARY (WC-1, WC-2, WC-4 bound to REINFORCE, WC-5 minus the reliability page, WC-14's homecoming sentence on the live return; OD-FC-19); WC-3 is CUT-TO-SENTENCE and Arcs B-D are RECORDED with the slot \"THE HOST\".]"),
("Q2-ref21-22", "- ALIGNMENT LINE: the wave's doc row lands in this volume's PROGRESS\n  blockquote and FABLE_VALIDATION_QUEUE.md in the landing commit.", "after",
 R("§5") + "this \"ALIGNMENT LINE\" is renamed **\"the DOC ROW\"** (the wave's doc-alignment row); it is NOT the spine's requirement-13 Alignment line (SPINE:92). Each wave still owes its requirement-13 read: lawfulness via lawWordFor (relay, cohesion, drift, rejection); malice is unengaged, and the reason is owed (findings WC-2 refinement 21).] [ADDED 2026-10-16 (coherence fold) — THE DOSSIER ROUND-TRIP (SPINE §1 requirement 6, the crown law): \"dossier\" appears ZERO times in this volume. Every wave that writes a DM-facing fact owes its DOSSIER ROUND-TRIP pin in its landing commit: the credit (WC-1), the war stance (WC-2/WC-7), the call-in answer (WC-5), the roster (WC-6), the cohort (WC-15) and the veteran read (WC-16) each land on the town's dossier where a DM looks and read back from it (findings WC-2 refinement 22). Each charter below also carries its requirement-16/17 FIRST-VISIBLE/TIER line and, per requirement 19, its DM-felt sentence or the word instrumentation.]"),
# ---------------- WC-0 ----------------
("R0-FV-WC0", "### WC-0 REGISTRATION (the vocabulary wave)", "after",
 FV + "none — instrumentation (registration; LANDED dark 2026-08-15) · TIER: aspatial-safe · DEGRADED ARM: dark]"),
("R1-WC0-landed", "Dependencies: none. Buildable now.", "in",
 SE + "LANDED 2026-08-15 as WC-0A..WC-0E (511d2ceb7, 4c87bae45, cf7e64660, e47d67631, 9602952ba), dark, no writer; this charter is the record of what landed.]"),
("R2-S7-mig", "have shipped GREEN, because WC-0's byte-identity pin holds perfectly\n(no producer yet) and the failure surfaces only at WC-6.", "in",
 SE + "LANDED by WC-0B (4c87bae45): the guard reads `if (isDemographicColumn(col) || isMilitaryColumn(col))` at migration.js:641 (releaseArrivals declared :616; class spread :520 -> :558, key :553 -> :591; :474 and :483 exact); this paragraph is history; " + NAV),
("R3-ref16", "fail-closed arm (rejecting, since nothing writes it),", "in",
 C.replace("coherence fold)", "coherence fold §3.2.17)") + "the landed arm KEEPS rows with originId + integer headcount and passes other fields through (worldState.js:163-174); see 1.4.1's bracket.]"),
("R4-tracked", "rows for warContributions/freeUnits/residentCohorts (counts-banded\nemission note),", "in",
 C + "overruled by ODQ §73.3 F-1: TRACKED rows land only WITH their live setSpatialLedger writers (WC-1, WC-11, WC-13); the code agrees (subsystemRowsVirtual.js:373, \"refusing a TRACKED row for a key nothing writes\").]"),
("R5-S8-termfam", "      THAT REDS OUTRIGHT. WR10_FAMILIES_AT_LANDING is the eight-member\n      landing record at sovereigntyBundle.js:91.", "after",
 SE + "LANDED by WC-0D (e47d67631): TERM_FAMILIES is now at peaceTermsCatalog.js:349; sovereigntyBundle.js :91/:156/:167 -> :116/:179/:191; the exact-equality pin at sovereigntyBundleWr10.test.js:322 is now the consumed grown-set pin at :347-348 (`toEqual(['amnesty','commercial','faith','jubilee','population'])`); " + NAV),
("R6-ref8-3663", "settlementStrategy.js keeps enumerateMoves module-private at :634 with\na bare re-export at :1360,", "in",
 C + "settlementStrategy.js:569 / :1314 at 00b648c9d; navigate by symbol. The zero-exporter premise is SUPERSEDED BY EVENT: HB-1 minted STRATEGY_MOVES (strategyMoves.js:61, 1013d58ba); see 4.1.1's bracket.]"),
("R7-ref13a", "a different question and would red this walker on day one otherwise;", "in",
 C + "REACTIVE_MOVES now lives at convergenceReactive.js:40 (re-exported at convergence.js:774; ENGAGEMENT_MOVES :185 -> :190) and holds `'reinforce'`, the ally-relief move (ALLY_UNDER_SIEGE -> REINFORCE, :44): THAT is this volume's question. The fence exclusion stands for the scan (it names identifiers); the semantic overlap is owed at WC-4 (see WC-4's bracket).]"),
("R8-ref13b", "                resolution, a different question", "in",
 C + "not for `reinforce`; see the bracket at the AT-MOST-ONE paragraph above.]"),
("R9-S18", "TUNING: none, and NOW TRULY\nNONE", "in",
 C + "WC-0D's catalog rows landed with four authored numbers each (`weight: 0.5`, baseYears, maxYears, `baseMag: 1.0`; peaceTermsCatalog.js:341-342): producer-less and dark, but not zero constants (PLAUSIBLE that the catalog floor requires them; they are UNMEASURED rows under requirement 18; findings WC-1 S-18).]"),
# ---------------- WC-1 ----------------
("S0-FV-WC1", "### WC-1 THE ARRIVAL LEDGER", "after",
 FV + "the arrival beat (`wc_contribution_arrival`) and the credit chip in the WEEK a contingent is sent (aspatial: credit at muster, which needs the dispatch executor's aspatial arm landing with this wave, §3.2.18) — weekly, chain 2 · TIER: aspatial-safe; the spatial arrival edge needs spatial canon (WC-6) · DEGRADED ARM: aspatial effect-time = muster-time (the bank)]"),
("S1-S10-corpus", "with LEVY_POP_RATE_PER_TICK 0.004 (warHomeCosts.js:80) against\nLEVY_POP_FLOOR 300 (:81)", "in",
 C + "now :82 / :83 (values unchanged); " + NAV),
("S2-3.2.18-wc1", "the levy/reinforcement effect edge", "in",
 R("§3.2.18") + "the dispatch executor's ASPATIAL arm (contributionDispatch.js's `muster` road and the reservation, 1.1.5) lands IN THIS WAVE, since the levy edge is measured silent; supplies credit waits on EC-12/EC-18 (§3.1.14, OD-FC-35); the record shape is WC-0E's (§3.2.17).]"),
# ---------------- WC-2..WC-5 ----------------
("T0-FV-WC2", "### WC-2 THE DERIVED STANCE", "after",
 FV + "the war stance word on the war chip in the same week the first credit lands (\"Millbrook has joined the war in materiel only\"); the mission-creep stance-crossing beat is SEASONAL · TIER: aspatial-safe · DEGRADED ARM: non-composite worlds read own-army share 1.0 (no roster)]"),
("U0-FV-WC3", "### WC-3 THE RELAY", "after",
 FV + "none — CUT-TO-SENTENCE (§3.1.15); once a goods road exists, the immediate `wc_relay_shortfall` beat in the week of arrival · TIER: spatial canon + CR-WC-9's shipment relay buckets (OD-FC-20) + a goods road (EC-12/EC-18, OD-FC-35) · DEGRADED ARM: dark]"),
("U1-ref14", "skim credited to staging\nstores + booked as shortfall),", "in",
 R("§3.1.15") + "CUT-TO-SENTENCE: the staging credit and the relay identity have no substrate (supplyShipments.js:17-21, :31-33: one QUANTITY-LESS record per active institution link, food excluded); they need CR-WC-9's \"shipment relay buckets\" (OD-FC-20), so WC-3 depends on CR-WC-9 and 7.F's WC-3 edge says so. L10/L11 stand; the network is RECORDED with the slot \"THE HOST\".]"),
("V0-FV-WC4", "### WC-4 STRATEGY AND COERCION", "after",
 FV + "the ally's send-or-keep decision as a beat in the week it is made (\"Aldmere sent a company to Thornhold's army\"), through the lit REINFORCE verb (§5 addendum) — weekly, chain 2; R6's release standing is YEARLY (CUT-TO-SENTENCE, fold §6) and its fast-layer sign is a PLANTING LINE (fold §4) at the over-delivery (\"Brenmoor delivered above Kell's requisition through the winter\") · TIER: aspatial-safe (the muster arm; the spatial `dispatch` arm at WC-6) · DEGRADED ARM: the aspatial muster-time road]"),
("V1-REINFORCE", "threat, favor balance, law band, contribution habit (a HABIT read\nwhere lit, neutral where dark).", "in",
 "[RULED 2026-10-16 (coherence fold §5 addendum, the REINFORCE binding) — three live reinforcement mechanisms precede this wave: reinforcement.js (the own-army per-tick flow, called from warHomeCosts.js), convergenceReactive.js's `reinforce` (REACTIVE_MOVES :40; ALLY_UNDER_SIEGE -> REINFORCE, the relief column, :44) and realmManifest.js's greyed realm verb `REINFORCE` (\"Reinforce a treaty-ally\", lane 'deferred', :471-487); beside them `computeAllyRelief` (warCapacityReads.js:74), the `reinforcement_cost` condition (activeConditions.js:371) and `ARMY_ROLES.REINFORCEMENT` (armyTransit.js:110). WC-4's executor BINDS them: it LIGHTS the greyed REINFORCE verb and routes the reactive `reinforce` move and the own-army flow through ONE commitment seam (three entry points, one road, one Herald family); no fourth road and no separate `resupply` seal is minted (answers ARCH:3227; RULINGS-OVER-THE-DRAFTS R-9). Edit Mode's visibility (U16) is untouched.]"),
("V2-S11", "5c -- after applyHomeWarCosts (:1263, verified)", "in",
 C + "the call is now warDeployment.js:1317; " + NAV),
("W0-FV-WC5", "### WC-5 CALL-INS, EXITS, AND THE DOCTRINE PAGE", "after",
 FV + "the call-in answer beat within the weeks of the ask (\"Thornhold called on Aldmere; Aldmere refused with the debt standing\"); a lapse shows at 26 weeks; the exits at war end — weeks to a season, chain 2 minus the reliability page (HB-6-gated) · TIER: aspatial-safe; the envoy CARRIAGE needs errandSpineEnabled (held dark, OD-FC-39) · DEGRADED ARM: a standing ask that lapses on its horizon]"),
# ---------------- WC-6..WC-16 ----------------
("X6", "### WC-6 BLOCK ROSTERS AND THE CONSERVATION WALKER", "after",
 FV + "the block roster table and the \"who really fields this force\" chip on the war card, the week a foreign block arrives · TIER: spatial canon + compositeArmiesEnabled; CR-WC-9-gated (OD-FC-20) · DEGRADED ARM: dark (aspatial worlds keep WC-1's bank at muster)]"),
("X7", "### WC-7 REALIZED STANCE AND THE CROSSING", "after",
 FV + "the stance-crossing beat (SEASONAL) and `wc_composition_revealed` at news speed weeks after it · TIER: spatial canon + belief infoMode (non-omniscient); CR-WC-9-gated via WC-6 · DEGRADED ARM: omniscient collapses the lag; aspatial worlds keep WC-2's crossing]"),
("X7a-ESrow", "row (spies count banners -- gated on espionageEnabled, the existing\ngate conjunction).", "in",
 R("§3.1.17") + "NO ES product row: composition intel is this wave's own hop-worn composition news (above); see 1.2.3's bracket.]"),
("X7b-four", "and that ALL FOUR scalars (exhaustion accrual, casus exposure, terms\nweight, spoils split)", "in",
 C + "THREE landed axes (casus, exhaustion, terms; spoils folded into terms, warStance.js:89); see 1.2.4's bracket.]"),
("X8", "### WC-8 THE BLOCK FORKS", "after",
 FV + "the block-fork beat on news arrival (\"Word reached the Emberford company that Emberford had fallen; by morning they were marching home\") — weeks to a season · TIER: spatial canon (the news gate) + belief infoMode; CR-WC-9-gated via WC-6 · DEGRADED ARM: omniscient = an immediate fork; aspatial dark]"),
("X8a-taint", "occupied-block WATCHED taint (ES read),", "in",
 R("§5") + "\"the watched block\", the army owner's read, not an ES product; see 1.5.2's bracket.]"),
("X9", "### WC-9 THE SERVICE INTEGRALS", "after",
 FV + "the PLANTING LINE (fold §4) at the war close, in the record's voice (\"the Emberford company served beside Thornhold's through the winter siege\"); the comradeship verdict arrives a war later and names the planting as its cause (requirement 20) · TIER: spatial canon (CR-WC-9-gated via WC-6); the fidelity rider HB-6-gated · DEGRADED ARM: dark] [RULED 2026-10-16 (coherence fold §6) — CUT-TO-SENTENCE: keep ONE comradeship integral folded at war close (it already writes `shared_service`); blend, drift and the fidelity rider keep their laws and one line each and build no machinery until a chain asks; recorded with the slot \"THE HOST\".]"),
("X9a-S14", "(warCoalitionDecision.js:108-109), asserted as a real read", "in",
 C + "now :126-127; " + NAV),
("X10", "### WC-10 ENDURANCE AND CONCENTRATION", "after",
 FV + "during a siege, the two envelope words racing in the siege document each week; the massing tell at news speed — season · TIER: spatial canon + WY-8a (OD-FC-21) · DEGRADED ARM: dark]"),
("X10a-ref11", "This wave is a spec row until the gate clears (CR-WC-14).", "in",
 "[ADDED 2026-10-16 (coherence fold) — a carried supply ALREADY exists on the army record: `supplyIntegrity` / `foodReserve` (warArmyRecord.js:127, :132), eroded at attrition.js:312, mitigating loss at attrition.js:226, fed at reinforcement.js:213. The envelope reads THAT quantity or the owner rules F9's relation to it, never a third supply truth.] [OWNER ROW OD-FC-21 — one army-supply truth: grow the live scalar, or keep F9 `supplyCargo` as the integer stock with the scalar DERIVED from it (recommendation: F9 the stock, the band a read); \"F9 is owner-SIGNED\" is itself contested (ARCH:689 UNSIGNED vs J-EM-9 SIGNED) and rides the same row.]"),
("X11", "### WC-11 FISSION AND FREE UNITS", "after",
 FV + "`wc_fission` (\"the host broke along its weakest bonds\") when an envelope closes, weeks to seasons; `wc_stand_down` at road speed · TIER: spatial canon + WY-8a (via WC-10) + CR-WC-9 · DEGRADED ARM: dark]"),
("X11a-ref18", "(armyTransitKernel.js's stepArmyPosition calls at :467/:502/:698/:742,\nmigrationKernel.js's releaseMigrationArrivals at :336)", "in",
 C + "the live calls are armyTransitKernel.js:482/:517/:738/:789 AND navalKernel.js:302 (omitted); the manifest's discovery signature must find the naval stepper; migrationKernel.js:336 is exact; FPQ-18 also routes four speed-floor pairs here; " + NAV),
("X12", "### WC-12 BRIGANDAGE AND THE EMBATTLED STATE", "after",
 FV + "`wc_brigand_arrival` and the embattled phase (\"the free company came down on Kell; Kell is embattled\") within weeks, as an embattlement.js ramp term (§3.1.16) · TIER: spatial canon (nearest by road) + WY-8a via WC-11 · DEGRADED ARM: dark]"),
("X12a", "the embattled stressor injected\nthrough normalizeStressor with a typed source reference;", "in",
 R("§3.1.16") + "a ramp term on spatial/embattlement.js, not a parallel stressor; see 1.8.1's bracket.]"),
("X13", "### WC-13 HOP-AND-SHED AND THE ONE ABSORPTION MARKET", "after",
 FV + "`wc_shed_homecoming` at war end (\"300 of Aldmere's people stopped at Brenmoor\") — once per war · TIER: spatial canon (migration columns) + WY-8a via WC-11 · DEGRADED ARM: dark]"),
("X14", "### WC-14 HOMECOMING AND THE PULSE", "after",
 FV + "the homecoming double sentence on the LIVE return (deploymentReturn and the existing `army_homecoming` Herald kind, chain 2's homecoming sentence) in the week a company comes home; the institutions and introduction attempts are YEARS, so their fast-layer sign is a PLANTING LINE (fold §4) at the founding cause (\"two hundred of Emberford's disbanded company stayed on at Kell\") · TIER: the homecoming sentence aspatial-safe; the rest spatial (via WC-13) · DEGRADED ARM: the homecoming sentence alone]"),
("X15", "### WC-15 RESIDENT COHORTS AND DIASPORA BONDS", "after",
 FV + "a PLANTING LINE (fold §4) at the shed or homecoming that writes the cohort (\"two hundred of Emberford's people settled at Thornhold after the war\"); the diaspora bond (EPOCH, a 20-40 year arc) names that planting when it speaks · TIER: aspatial-safe reads over a tag ledger WC-13 writes spatially · DEGRADED ARM: dark]"),
("X15a-ref2", "GATED ON CR-WC-21 for the\nage-band stepping rule (1.13.2).", "in",
 C + "RULED 2026-08-06 (5.1's RULED paragraph): calendar bands 5 / 20 with a FLOORED recency modulation, not a decay law; WC-15 is NOT gated on CR-WC-21.]"),
("X15b", "steps -- WHOSE STEPPING RULE IS UNRULED, see the pin note below and\nCR-WC-21;", "in",
 C + "ruled; see this wave's Dependencies bracket.]"),
("X15c-ref5", "narrows, which is the honest cost of that arm", "in",
 C + "under the ruling the DOC claim does NOT narrow: RECENCY_WEIGHTS is a floored band modulation, not a decay constant (5.1).]"),
("X16", "### WC-16 VETERANS AND THE ORDER DIVIDEND", "after",
 FV + "a PLANTING LINE (fold §4) at the return (\"Thornhold's company came home and stood the wall watch\"); the veteran dividend is felt at the NEXT muster (years) · TIER: aspatial-safe (via WC-15) · DEGRADED ARM: dark]"),
("X16a-ref20", "warCapabilityOf + martialReadiness;", "in",
 "[ADDED 2026-10-16 (coherence fold) — martialReadiness.readiness01 already accrues from war and decays through peace (martialReadiness.js:1-31); VETERAN_READINESS_MAX composes WITH it under one cap over both, or is not added; measure double counting at build (findings WC-2 X19, PLAUSIBLE).]"),
# ---------------- section 4 ----------------
("Y1-4.1.1", "Both volumes want to mint the\nclosed list.", "in",
 SE + "HB-1 MINTED STRATEGY_MOVES + the ALL_MOVE_TOKENS union (strategyMoves.js:61, 1013d58ba) with the cure \"an amending volume adds its dispatched-but-unemitted moves to the UNION and not to the emitted set\" (:29-31); WC-4 AMENDS the union; CR-WC-1 is closed by build order; wc-1b is SIGNED, not built (ODQ §186). Addresses: settlementStrategy.js:569 / :1314; " + NAV),
("Y2-4.1.2", "### 4.1.2 The law-band modulation table (collision C3)", "after",
 R("§3.1.13") + "HB's learning row is NOT yet in the one table; see 1.3.2's bracket.]"),
("Y3-4.2-F9", "F9 is\n  owner-SIGNED under the blanket sign-off (2026-08-05) but UNBUILT.", "in",
 "[OWNER ROW OD-FC-21 — one army-supply truth: the live scalar `supplyIntegrity`/`foodReserve` (warArmyRecord.js:127, :132) already exists; F9's signature is contested (ARCH:689 UNSIGNED vs J-EM-9 SIGNED); recommendation: F9 the integer stock, the scalar DERIVED; see WC-10's bracket.]"),
("Y4-4.2-carrier", "5, resolved: carrier = shipments, cargo = F9).", "in",
 R("§3.1.14, §3.1.15") + "supplyShipments carries no quantity, no army endpoint and no food (supplyShipments.js:17-21, :31-33); the settlement-to-army carrier is EC-12/EC-18's contracted caravan stream, credited by WC-1 (OWNER ROW OD-FC-35).]"),
("Y5-ref10", "kmScale does not exist at\n  HEAD;", "in",
 C + "kmScale is LIVE (WY-1, d0c135f20: spatialDigest.js, distanceRead.js, modeSpeeds.js, campaignSpatialCanonize.js), though no world writes it yet (FPQ-37); CR-WC-15's ordering note now reads against the published scale.]"),
("Y6-4.3-tap", "Each is a product row through ES's existing product\n  registration, ranked by TAP_DEPTH, never by array index.", "in",
 "[STRUCK 2026-10-16 (coherence fold §3.1.17) — no product road: ES products are CLOSED at three (envoyErrandVocabulary.js:168), the target read carries no strength band (espionageProducts.js:28-31), and there is no registry to add a product to. Composition intel is WC-7's own news; ally-reliability rides HB-6's doctrine page; \"the watched block\" is the army owner's read (§5).]"),
("Y7-4.4-levied", "people ledger EXTENDS it (blocks[] reconciles to it exactly) and\n  never forks it.", "in",
 C + "the retired equality form: blocks[] reconciles DIRECTIONALLY (1.4.1's pin) and never writes the map (0.3); see 0.2's POOLS bracket. The writer address drifted (warHomeCosts.js:443/450 -> :445/:452); re-measure the reader addresses and navigate by symbol.]"),
("Y8-4.4-occ", "- occupation.js: owns the five-rung ladder (STATE_LADDER :117,", "in",
 C + "occupation.js addresses :117/:386/:442/:724 are now :125/:645/:724/:1059; " + NAV),
("Y9-ref17", "the\n  cohort tag banked in the column record is the same pattern, stated\n  in WC-13.", "in",
 C + "the column carries the ORIGIN (the capture-timing law); the cohort TAG is written by `shed` in the same event (WC-13, 0.2). No tag is banked for a later transfer (findings WC-2 C3).]"),
("Y10-S15", "row stressorDynamics needs (at ~759 eff) forces the leaf extraction\n  FIRST (census B question 6's answer: extract, never baseline-grow).", "in",
 C + "moot as stated: stressorDynamics.js is no longer in scripts/.size-baseline.json; the 800 layer ceiling still binds; re-measure its EFFECTIVE count before WC-12.]"),
# ---------------- section 6 ----------------
("Z1-CRWC1", "The directive itself defers; the contract (4.1.1) makes either\norder safe.", "in",
 SE + "HB-1 minted first (strategyMoves.js:61); CR-WC-1 is closed by build order; WC-4 amends the union (see 4.1.1's bracket).]"),
("Z2-CRWC7", "approve as a declared lit-only behavior shift with a one-time golden\nrecord at lighting; dark worlds untouched.", "in",
 "[OWNER ROW OD-FC-30 — the lit-only coalitionShares golden shift is signed by the owner at its LIT unit (chain 2's lighting), recorded now so it is not discovered.]"),
("Z3-CRWC9", "field batch signed in two pieces is the shape a later wave cites without\nre-reading.", "after",
 OD20 + " " + CL + "this question's status was spelled five ways (see the header bracket); WC-0E has already fixed two members' normalizer shapes (contributionLedger.js:54, worldState.js:163-174; §3.2.17); the list's \"shipment relay buckets\" is what WC-3 depends on (§3.1.15); the generals' `deployment.general` would join it (§3.1.18); the batch gates WC-3 and WC-6 onward.]"),
("Z4-CRWC11", "comes back to the chair before landing.", "in",
 R("§3.1.16") + "re-read against spatial/embattlement.js: a brigand siege is one more ramp term on the existing ledger, not a new stressor.]"),
("Z5-CRWC13", "repair in a hygiene wave outside WC (behavior-neutral today; not\nthis volume's scope).", "in",
 C + "`'ally'` is now gone from LEVY_SUPPORT_TYPES (warHomeCosts.js:81); re-read this dead-arm finding against the live sets.]"),
("Z6-CRWC14", "but the recommendation is to wait.", "in",
 "[OWNER ROW OD-FC-21 — the gate's premise is contested: a carried-supply scalar already exists (see WC-10's bracket).]"),
("Z7-CRWC16", "so the block forks cannot be deferred past the fission\nwave.", "in",
 SE.replace("coherence fold)", "coherence fold §6)") + "FP-40 CHAIN-FIRST (FP-ORDER:12-17) replaced the queue slot: the unit of work is the next felt chain, and the fold recommends chain 2 THE AUXILIARY (WC-1, WC-2, WC-4 bound to REINFORCE, WC-5 minus the reliability page, WC-14's homecoming sentence on the live return) after the UI + prose release, with Arcs B-D RECORDED with the slot \"THE HOST\". OWNER ROW OD-FC-19 (the re-sequencing is the owner's).]"),
("Z8-ref3", "BOTH POSITIONS, NEITHER TAKEN:", "in",
 "[RULED 2026-08-06 (b75e8c4d; WC_CHAIR_RULINGS.md:1434), recorded 2026-10-16 (coherence fold) — neither A nor B as drafted: B's calendar bands, with RECENCY_WEIGHTS reclassified as a BOUNDED, FLOORED band modulation (not a decay constant); 5.1 stands un-narrowed; WC-15 lands the three-pin set. The text below is the pre-ruling record.]"),
("Z8a-C2", "the COUNT-driven term is mortality-driven.", "in",
 C + "the RULED reading is NOT this Position B as drafted: RECENCY_WEIGHTS was reclassified a bounded floored modulation, so none of these amendments is owed (5.1; findings WC-2 C2).]"),
("Z8b", "The chair rules; until then WC-15 carries the pin in both variants and\nthe wave does not land.", "in",
 C + "ruled; see this question's opening bracket.]"),
("Z9-CRWC22", "GATE 1 -- THE DEPLOYER EXCLUSION. warHomeCosts.js:391", "in",
 C + "now :393 (and :115-116 -> :116-118); " + NAV),
# ---------------- section 7 ----------------
("AA1-half", "lapsed -- `lapsed` is silence past the horizon and is NOT a refusal.", "in",
 R("§5") + "the answer rung reads `half_answered`; see 1.9.1's bracket.]"),
("AA2-raiding", "    dissolving   hop-and-shed in progress; sheds until empty", "after",
 R("§5") + "`brigand` reads `raiding`; see 1.7.2's bracket.]"),
("AA3-worn", "                  (graded close into the habit system)", "after",
 R("§5") + "`attrition` / `absorption` read `worn_down` / `absorbed`; see 1.8.1's bracket.]"),
("AA4-3.1.7", "    MILITARY_COLUMN_CLASSES    = ['reinforcement_column', 'shed_column',\n                                  'veteran_return']", "after",
 R("§3.1.7") + "ownership: POP owns the CIVILIAN classes, WC the MILITARY classes, ONE union, one `columnOf` whitelist (migration.js:504-511, landed by WC-0B); POP-1's return class is ruled ONCE across POP/WC/LG/ES as `column_return` (not `returning`); WC's landed `veteran_return` stands (landed tokens never rename).]"),
("AA5-S7b", "widening-omitted mutant, and it is the highest-value pin in that wave\nbecause everything else there is byte-identical.", "in",
 SE + "landed (WC-0B); the addresses drifted as WC-0's bracket records; " + NAV),
("AA6-ref4", "WHAT STEPS THESE BANDS IS UNRULED (CR-WC-21).", "in",
 C + "RULED: calendar edges AGE_BAND_EDGES_YEARS 5 / 20; RECENCY_WEIGHTS a floored band modulation; mortality is the only zeroing road (5.1).]"),
("AA7-7B-time", "wave's landing and recorded in-file with range and date (the\ndead-band discipline, 5.5).", "in",
 "[ADDED 2026-10-16 (coherence fold §4, §3.3.10, req 18) — the pulse tick is ONE WEEK and this volume cites INTERVAL_WEEKS zero times: every tick-denominated row here (RESERVATION_HORIZON 13, CALL_IN_HORIZON_TICKS 26, FORAGE_ESCALATE_TICKS 3, the year-denominated age bands) is authored as a named constant whose comment names its season / half-year / year and reads INTERVAL_WEEKS where its file is not frozen; the time-base walker (SP-7, tests/lint/timeBase.walker.test.js) REDS a bare 13/26/52 in an expression. Every row of this table is UNMEASURED under requirement 18 until its soak.]"),
("AA8-ref5", "                                                       the same commit\n                                                       (1.13.2)", "after",
 C + "under the CR-WC-21 ruling AGE_BAND_EDGES_YEARS (the row above) is LIVE (calendar bands kept) and RECENCY_WEIGHTS is a floored band modulation, NOT a decay constant: 5.1 does not narrow; the floor is the last weight (.25).]"),
("AA9-ref24", "sentence families ship in the same wave as the kind (K7); pools are\nscript-extracted and never hand-edited after extraction (the TR-1\npool law).", "in",
 "[ADDED 2026-10-16 (coherence fold, req 22c) — every shape here is re-authored at build under THE EVIDENCE LAW (owner 10-02/10-03, \"complete, not cryptic\") and the voice program (\"actions, not potential\"): rung words (principal / belligerent / materiel) never reach a DM sentence raw; wc_relay_shortfall names the consignment, the loss and the road and stays silent on the hand; a PLANTING LINE (fold §4) names a cause in the record's voice and nothing about the future.]"),
("AA10-ref23", "    wc_contribution_close       WC-1   the war done, the ledger read\n                                       aloud: grade + band", "after",
 C + "at WC-1 the grade is the deliveryGrade; the CONTRIBUTION_CLOSE_GRADES grade joins at WC-9 (findings WC-2 C9).]"),
("AA11-7F", "    WC-3  <- WC-1            [E-row slice gated: WY encounter table]", "after",
 "[ADDED 2026-10-16 (coherence fold §3.1.15) — WC-3 also depends on CR-WC-9's \"shipment relay buckets\" (OD-FC-20); it is CUT-TO-SENTENCE and RECORDED with the slot \"THE HOST\".]"),
("AA12-ref19", "Both flags and both trios are\nunchanged,", "in",
 C + "SIX flags (SECTION 3's FLAG FAMILY); the five flag-landing commits carry six trios, WC-0 carrying two (findings WC-2 C5).]"),
# ---------------- section 8 (table cells inline; no pipes) ----------------
("AB1-row1", "a bare re-export at `:1360`.", "in",
 C + "settlementStrategy.js:569 / :1314; navigate by symbol; HB-1 minted STRATEGY_MOVES (strategyMoves.js:61), so WC-4 amends the union.]"),
("AB1b-row1", "EXCLUDES `ENGAGEMENT_MOVES` (`convergence.js:185`) and `REACTIVE_MOVES` (`:743`)", "in",
 C + "now convergenceReactive.js:40 (ENGAGEMENT_MOVES convergence.js:190); REACTIVE_MOVES holds `reinforce`, which WC-4 binds.]"),
("AB2-row5", "F9 is owner-SIGNED under the blanket sign-off (2026-08-05) but **UNBUILT**.", "in",
 "[OWNER ROW OD-FC-21 — one army-supply truth; the live `supplyIntegrity`/`foodReserve` scalar already exists (warArmyRecord.js:127, :132); see WC-10's bracket.]"),
("AB3-row8", "⚠ **MEASURED: `kmScale` does not exist at HEAD.**", "in",
 C + "kmScale is live (WY-1, d0c135f20).]"),
("AB4-row14", "The people ledger **EXTENDS it — `blocks[]` reconciles to it exactly — and never forks it.**", "in",
 C + "the retired equality form; the reconciliation is DIRECTIONAL (1.4.1) and blocks[] never writes the map (0.3).]"),
("AB5-row18", "(`STATE_LADDER :117`: contested / unstable / extractive / stabilized / vassalized)", "in",
 C + "addresses :117/:386/:442/:724 are now :125/:645/:724/:1059; " + NAV),
("AB6-row20", "— the cohort tag banked in the column record is the same pattern.", "in",
 C + "the column carries the ORIGIN; the cohort TAG is written by `shed` in the same event (WC-13); see 4.5's bracket.]"),
("AB7-row21", "⚠ CARRIED IN BOTH VARIANTS until CR-WC-21 is ruled, so **the wave does not land on a coin flip.**", "in",
 C + "CR-WC-21 is ruled; the three-pin set of WC-15 is the tripwire.]"),
("AB8-ref8-6813", "    settlementStrategy.js:1294   export { enumerateMoves };", "after",
 C + "settlementStrategy.js:569 / :1314 at 00b648c9d; the occupation.js rows below drifted to :125 / :645 / :724 / :1059; " + NAV),
("AB9-ref9", "the AT-MOST-ONE fence is still the right pin rather than EXACTLY-ONE.", "in",
 SE + "HB-1 MINTED STRATEGY_MOVES + ALL_MOVE_TOKENS (strategyMoves.js:61, 1013d58ba); WC-4 AMENDS the UNION, never the emitted set (:29-31); CR-WC-1 is closed by build order; HB-1's single-exporter fence is tests/lint/strategyMoveVocabulary.walker.test.js.]"),
("AB10-row5p", "F9 is still unbuilt; WC-10's hard gate still binds.", "in",
 "[OWNER ROW OD-FC-21 — still true of `supplyCargo`, but a live scalar supply exists; see WC-10's bracket.]"),
("AB11-ref10", "- **Row 8's premise HOLDS.** `kmScale` returns **ZERO hits in `src/`.**", "in",
 C + "refuted by event: kmScale is live in four src files (WY-1, d0c135f20).]"),
# ---------------- closing ----------------
("AC-closing", "END OF VOLUME. Chair questions CR-WC-1..CR-WC-22 await rulings;", "in",
 C + "THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2. All 22 were RULED 2026-08-06 (b75e8c4d; WC_CHAIR_RULINGS.md) except CR-WC-9, which escalated unruled and is OWNER ROW OD-FC-20 (PARKED until chain 2 asks for a field; WC-0E's two normalizers stand writer-less). WC-0 has LANDED (WC-0A..WC-0E, dark). The first felt chain is fold §6 chain 2 THE AUXILIARY (WC-1, WC-2, WC-4 bound to REINFORCE, WC-5 minus the reliability page, WC-14's homecoming sentence on the live return; OD-FC-19); WC-10's showcase and WC-14's institutions sit in Arcs B-D, RECORDED with the slot \"THE HOST\".]"),
]

text = open(base_path, encoding="utf-8").read()
inserts = []  # (pos, string, id)
errors = []
for eid, anchor, mode, body in E:
    n = text.count(anchor)
    if n != 1:
        errors.append(f"{eid}: anchor found {n}x: {anchor[:70]!r}")
        continue
    i = text.index(anchor)
    end = i + len(anchor)
    if mode == "in":
        inserts.append((end, " " + body, eid))
    elif mode in ("after", "after_exact"):
        if mode == "after_exact":
            nl = end - 1  # anchor already ends with newline
            assert text[nl] == "\n"
        else:
            nl = text.find("\n", end)
        ls = text.rfind("\n", 0, end - (1 if mode == "after_exact" else 0)) + 1
        line = text[ls:nl]
        assert not line.lstrip().startswith("|"), eid + " after-mode in a table"
        m = re.match(r"^(> |## |\s*)", line)
        prefix = m.group(1)
        inserts.append((nl + 1, prefix + body + "\n", eid))
if errors:
    print("ANCHOR FAILURES:"); print("\n".join(errors)); sys.exit(2)
inserts.sort(key=lambda t: t[0])
out, last = [], 0
for pos, s, eid in inserts:
    out.append(text[last:pos]); out.append(s); last = pos
out.append(text[last:])
new = "".join(out)
# verification: strip every inserted chunk -> byte-equal base
rebuilt, cur, off = [], 0, 0
for pos, s, eid in inserts:
    p = pos + off
    assert new[p:p+len(s)] == s
    off += len(s)
stripped = new
for pos, s, eid in sorted(inserts, key=lambda t: -t[0]):
    pass
# recompute strip by walking
acc, k, off = [], 0, 0
for pos, s, eid in inserts:
    p = pos + off
    acc.append(new[k:p]); k = p + len(s); off += len(s)
acc.append(new[k:])
assert "".join(acc) == text, "strip check failed"
open(dest_path, "w", encoding="utf-8").write(new)
json.dump([{"id": e, "pos": p} for p, s, e in inserts], open(log_path, "w"), indent=0)
print(f"applied {len(inserts)} insertions; strip-check OK")
