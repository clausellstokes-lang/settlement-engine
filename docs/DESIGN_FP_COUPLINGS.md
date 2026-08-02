# DESIGN — THE FOREIGN POLICY COUPLING MAP (the 21 pairs, walked)

## Fable 5 architecture, 2026-08-02. The coupling volume of the Foreign Policy
## program, BOUND BY docs/DESIGN_FP_SPINE.md (the constitution — where this volume
## and the spine conflict, the spine wins and the conflict is a bug to report).
## Format and discipline mirror DESIGN_WAR_RULINGS_ARCHITECTURE.md; the war
## volume's §10 implementer protocol binds here verbatim. Substrate = the four
## survey batteries executed 2026-08-02 against the minifold tree
## (claude/composite-r4 @ 38f81d05): trade (3 agents), faith (3), populations (3),
## and the information/grammar/interior battery (9). Every EXISTS claim below
## carries a survey file:line receipt; anything asserted beyond the surveys is
## marked VERIFY-AT-BUILD. Implementation is assigned to the external implementer
## (Sol); architecture and validation by Fable.

**Status: ARCHITECTURE. This volume is the map every other volume points at when
it declares a coupling (spine req. 8). It walks all 21 pairs of the seven layers
{war, trade, faith, populations, information, grammar, interior}, rules which
volume OWNS each designed coupling, declares the deliberately-empty directions as
decisions, derives the six cross-layer signature stories end to end by named
reads and receipts (spine req. 7's proof-by-construction), and specs the FOUR
cross-wire waves (CW-0..CW-3) that no single volume owns. Judgment blocks in §7
are the drafting chair's rulings under delegation — vetoable there.**

**Cross-reference key.** War volume waves = WR-0..WR-10
(DESIGN_WAR_RULINGS_ARCHITECTURE.md). Faith = WF-0..WF-9 (DESIGN_FP_FAITH.md).
Populations = POP-1..POP-7 (DESIGN_FP_POPULATIONS.md). Information = IN-0..IN-6
(DESIGN_FP_INFORMATION.md). Interior = the waves DESIGN_FP_INTERIOR.md numbers
IN-1..IN-8 — **cited here as INT-1..INT-8 throughout**, because the information
volume already holds the IN- prefix (the collision is real in the two volumes as
drafted and is REPORTED to the validation chair in §10; this volume's aliases are
unambiguous either way). Trade and Grammar volumes were drafting in parallel when
this map was written: they are cited by their spine §3 crux rulings as
**FP-TRADE(...)** and **FP-GRAMMAR(...)**, never by invented wave numbers. Shared
spine infrastructure = SP-1..SP-7 (spine §2); SP flag names are the SP waves' to
assign (VERIFY-AT-BUILD).

---

## §0 THE COUPLING DOCTRINE (how to read this volume)

1. **What a coupling IS (spine req. 8):** a named READ one layer performs on
   another layer's state, a RECEIPT that lands where a reader can find it, and a
   NAMED COUNTERFORCE scoring off the same evidence. Anything less — a shared
   constant, an incidental import, a float that drifts across a boundary — is
   LEAKAGE, and leakage is not coupling.
2. **The count.** Seven layers give 21 unordered pairs; the spine's "21 ordered
   pairs" is honored INSIDE each pair section: every pair is walked in BOTH
   directions (A→B and B→A are separate entries, separately graded), so all 42
   directions are ruled — designed, existing, or declared empty.
3. **Pair anchors.** The pairs are CPL-1..CPL-21 (§4). Other volumes point at
   these anchors when they declare a coupling; a coupling declared in a volume
   with no CPL row, or a CPL row with no owning wave, is a defect one side must
   fix.
4. **The ownership law (J-CPL-1):** every designed coupling has exactly ONE
   owning wave in ONE volume — the wave that builds its writer or its read. This
   volume builds NOTHING per-pair; it builds only the four cross-wires (§6),
   which are the machinery of coupling-as-such: the registry, the governor, the
   cause-walk, and the measure.
5. **Empty is a decision.** A direction with no designed coupling is DECLARED
   EMPTY in its pair section with its rationale. Silence is not permitted;
   implementing a declared-empty coupling is a STOP-and-report (C-LAW-8).
6. **Evidence rule.** EXISTS = a survey receipt (file:line, executed read).
   ADDS = an owning wave in a named volume, or a spine §3 crux ruling where the
   volume is still drafting. Neither is ever asserted bare.

---

## §1 THE LAWS THAT BIND EVERY COUPLING

### 1a Constitutional (inherited verbatim)
The war volume's §1a (same-seed byte identity; dormancy behind virtual flags;
seeded purity; monotone ratchets; receipts carry enforcement — id + full address
chain + typed action + settlements BY NAME + recorded reason; premium isolation +
audience projection; finite semantics) and the spine's twelve requirements bind
every mechanism this volume touches. Where a coupling's two ends sit in two
volumes, BOTH volumes' §1 laws bind the coupling — the stricter clause wins.

### 1b Coupling-specific laws (violations are design defects)
- **C-LAW-1 — ONE OWNER, ONE WRITER.** Each coupling's state (if any) has one
  writer, and that writer lives in the owning volume's wave. A coupling
  implemented twice — once per side — is the double-count defect J-WR-11 exists
  to prevent, at estate scale.
- **C-LAW-2 — COUPLINGS RIDE EXISTING READS (spine req. 8 verbatim).** A
  coupling that needs a NEW read gets that read built in the owning volume's
  wave with its own pins; the coupling then rides it. No read is ever built "in
  the seam between volumes" — the seam is where reads go to be unowned and
  untested.
- **C-LAW-3 — THE COUNTERFORCE READS THE SAME EVIDENCE (spine req. 2).** Every
  pair section names force and counterforce off one state. A coupling whose
  counterforce reads different evidence is two mechanisms wearing one name, and
  one of them is a ratchet.
- **C-LAW-4 — THE CARRIER CLOCK (spine req. 9).** A coupling propagates no
  faster than its carrier: information at hop latency (rumorNetwork
  arrivalTick += hopWeeks; distance-priced surcharge), people at law M's
  one-week-per-leg floor, goods at caravan speed, faith's spread lane at carrier
  reach, grammar at errand speed, interior couplings same-settlement and
  same-tick (the fast layer of the two-timescale echo). A cross-court effect
  that lands the same tick it was caused, without a same-tick carrier, is a
  telepathy defect.
- **C-LAW-5 — BELIEF AT THE BOUNDARY, WITH THE LOUD-FACT EXEMPTION.** Any read
  that crosses a court boundary routes through belief machinery (K3
  generalized: nobody is ever current about a neighbour). EXEMPTION, following
  J-WR-7's mint-on-the-public-fact discipline: PUBLIC facts — a razing, a
  standing altar, a signed treaty's existence, an army in the field — may be
  read at truth once news-latency has been paid, because they are loud;
  SECRETS (books, granary counts, intentions, compliance) ride belief always.
  Each pair section states which side of the line its reads sit on.
- **C-LAW-6 — PACING (spine req. 12).** Every coupling's receipts register with
  the pacing/significance machinery, and cross-layer CASCADES additionally
  register with the governor (CW-1). History at full coupling can flood the
  Herald; depth never becomes wallpaper.
- **C-LAW-7 — RECEIPT-CHAIN CONTINUITY (spine req. 7).** Every coupling receipt
  carries provenance the backward walk can follow (sourceEventId / causes[] /
  the §1b-B receipt field naming the producing state). The test is CW-2's:
  "why is this village suddenly X?" walks backward link by named link, across
  every layer the cause crossed. A coupling that breaks the chain is invisible
  history — worse than no coupling, because it produces effects a DM cannot
  explain.
- **C-LAW-8 — DECLARED-EMPTY IS BINDING.** The empty directions in §4 are
  decisions with rationale. Building one is a STOP-and-report to the validation
  chair, not an implementer pick.

### 1c Recorded hazards that WILL bite the cross-wires (each has bitten)
- **The id-less news drop:** every cross-layer beat carries `id` or it is voided
  at BOTH normalizeEntry and the audit sink — cascades are especially exposed
  because braided items are new pushes.
- **The wizard-news id token skew:** `moverFamilyOf` classifies any id carrying
  a bare token by word-association — the knowledge family's measured
  contamination (knowledgeLaneEvidence.js:12-29: FIFTEEN impactKinds reach
  `knowledge` on the 'news' token alone) and the `belief_misjudgment`-under-the-
  faith-desk misfile (heraldRouting.js:118) are the SAME hazard. Every new
  cross-layer kind chooses its id tokens deliberately and registers routing
  explicitly; CW-0's registry records the intended desk so the misfile class is
  walker-visible.
- **Writer/reader payload-spelling drift:** a coupling is by definition a writer
  in one module and a reader in another — the class's home terrain. Every
  cross-wire pin boots the REAL writer and reads through the REAL reader.
- **Forbidden-list polarity:** a "forbidden couplings" scan misses everything it
  never imagined. CW-0's registry is an INCLUSION ratchet (J-CPL-2): a
  cross-layer read without a registry row reds the walker; the declared-empty
  list is enforced as the absence of a row, not as a blacklist.
- **Vacuous absence pins:** a declared-empty direction pinned against a harness
  whose producing state defaults empty proves nothing — empty-direction pins
  seed the ADJACENT coupling live first (prove the machinery CAN fire, then that
  this direction does not).
- **The parallel-volume prefix collision:** INFORMATION and INTERIOR both number
  waves IN-* (§10 report). Cross-references in ANY volume that say bare "IN-3"
  are ambiguous today; this volume's INT- aliases are the interim discipline.

---

## §2 THE SEVEN PORTS (what each layer exposes for coupling — from the surveys;
## re-verify anything you build on; live code outranks this table)

| Layer | Reads it exports (the ports) | Receipts it emits | Ledgers/state it owns | Native clock |
|---|---|---|---|---|
| **WAR** | warReasonFactor, treatyBlocksWar/demilitarizationCapFor/occupationHoldFor (treatyEnforcement.js:82-141), momentum's published exports (FOREIGN — C2 law), supplyInterdictionLevel (supplyShipments.js:504), warFrontsInto/mobilizationSeverity | ~26-28 phrased kinds: deploy/siege/homecoming/webwar/naval/infowar/peace-terms battery; casus receipts 13×4 variants | spatialLedgers.warReasons (per-pair directed), warIntents, deployments/occupations, treaties (via grammar) | weekly tick; casus decay-inherent; revanchism ≥8-tick wounds |
| **TRADE** | tradeSalience (per-commodity value-of-tie), foodCapacityOf's import arm (demographicsRates.js:332-380, ARTERY_IMPORT_FACTORS), entrepot centrality, dispatchEV refusals (evRefused), primarySupplierInto | flow_trade_scarcity, route_disruption, import_shortage, boom/bust, generosity 6-kind family; route_* kinds exist but Herald-silent today (settlementRumors census) | commodityStocks + supplyShipments (conserved, refuse-to-persist — commodityFlow.js:241-269), tradeFlow, merchantAppetite, entrepots, routeNetwork (dark) | caravan legs; EWMA windows; FLIP_COOLDOWN 6 ticks |
| **FAITH** | faithProximityOf/faithAlignmentQuadrant (sacredClaim.js:67-123), patronSecurity, piety/legitimacy bands, institutionTolerance (baseline IS patron conviction), templeMediated relief warmth (generosityEV.js:243-253) | conversionOutcome, faith_pact/betrayal/foothold, pantheon Ascendancy/Twilight, ~9 phrased tokens (vs war's ~27) | worldState.religionStates (shares/standings/legitimacy/heresyStain/suppressed), worldState.pantheon, institutionTolerance | LOCAL lane every tick on deity presence; SPREAD lane behind faithSpreadEnabled; piety lag 0.06 |
| **POP** | demographicReadings/destinationMenuFor (the ONE menu seam — demographicsMigration.js:276-315), pressureOf, viability ladder + moverPermitted (one consumer today), realmPressure01 (war-motive only), populationTrendBand (belief axis) | hungry_gap + migration_flight (the two Herald lines, graded the estate's model translation), lifecycle beats (steading_*, terminal death, resettled) | population integer + 12-row history, spatialLedgers.migration columns (travelClass mutex), demographicPlans | weekly rates; columns at leg speed; plans PATIENCE 78; exact conservation pinned w/ negative control |
| **INFO** | beliefMap per-observer/per-slot reads (beliefMap.js:10-12), credibilityOf (rise 0.6/fall 5, half-life 52), brokerage stamps (measured 18,377-record ladder), detectMisjudgment, reputationRace (built, ZERO consumers) | infowar_lie_exposed/spy_exposed, intel_transfer, belief_misjudgment — 4 beats among 269 routed tokens (~1.5%); speaks only when a secret dies | beliefMaps, rumorLedgers (TTL/top-K/hop-weathered), disinfo, sightPostures, credibility | hop latency + distance surcharge; silence decay 0.92/tick; lie shelf-life 8 ticks |
| **GRAMMAR** | treatiesForPair→treaty_default casus, treatyDocument/frayingTermOf, compliance-under-fog (trueState vs observed, DETECT_FLOOR), findCrossPressuredMediator (one finder, two consumers) | treaty_signed (major, cured of the id-less drop), treaty_breached (DM-verb path only); expiry RECEIPTLESS today (peaceTerms.js:720-724) | treaties ledger (11-term catalog, 7 families, six executors; sole mint = war-exit PASS 1) | treaty clock 52-week (WR-0c item 4; legacy 12 marked); strain 0.6/yr; errand legs law M when WR-7 lands |
| **INTERIOR** | postureOf/blocDecisionFactor (settlementPolitics, dark), publicLegitimacy bands + gates (coup spawn, insurgency null ≥75), grievanceRead (fixation/revanchism), obligations/gratitudeBonds, dispositionStats (permanent until WR-2) | coup verdicts (dice-clean main lane), faction 7-type table, commons petition/gathering/riot, investiture beat, generosity 6 headlines | legitimacy 0-100 stock (never passively decays), factionPairStates, relationshipMemory + turningPoints(24), commonsVoice ledger | same-settlement, same-tick (the fast layer); memory clocks 4-tick incident half-life / 156w bonds / permanent disposition |

**The three cross-cutting substrate facts every pair below leans on:**
(1) **Belief exists but is consumed asymmetrically** — courts get it (war
motive, chooser, siege reads), migrants/merchants/priests do not (populations
survey: destinationMenuFor reads truth only; trade survey: zero belief imports
across nine core commerce modules; faith survey: sacred_claim compares embedded
refs). SP-2's three subject families are the cure, and POP-1/FP-TRADE(believed
markets)/WF-4 are the owning waves. (2) **The grammar is war-exit-shaped** —
the single agreement artifact mints only from sue_for_peace (peaceTerms.js PASS
1, sole caller pulseKernel.js:2371); SP-3 peacetime formation is the cure and
FP-GRAMMAR owns it. (3) **Every layer's memory outruns its voice** — the
surveys' uniform verdict (population 2 dedicated lines, faith ~9 tokens, info
~1.5%, interior single-template) — so EVERY pair below has a narration debt its
owning volumes' voice waves (WF-8, POP-6, IN-5, INT-8) pay; this volume does not
duplicate those waves, it routes cascade-grade tellings through CW-1/CW-2.

---

## §3 THE MATRIX (grades per direction: **LIVE** = built + lit today · **DARK**
## = built, flag-dark · **ADDS** = designed in a named wave · **EMPTY** =
## declared empty in §4)

| Pair | A→B | B→A |
|---|---|---|
| CPL-1 WAR×TRADE | LIVE (interdiction, seizure, treaty grain) | LIVE/ADDS (salience dampener; casus commercii — FP-TRADE) |
| CPL-2 WAR×FAITH | LIVE (occupation faith-pull) | LIVE/ADDS (sacred_claim + dissolution; WF-6 terms) |
| CPL-3 WAR×POP | LIVE (war dead, flight, sack) | LIVE/ADDS (realm-pressure motive; WR-8 razing arithmetic) |
| CPL-4 WAR×INFO | LIVE (belief-wrapped strength, bluff) | ADDS (the lure, feasibility, race — IN-2/WR-8/IN-4) |
| CPL-5 WAR×GRAMMAR | LIVE (war-exit mint, enforcement bites) | ADDS (WR-7 transport; SP-3 peacetime; oath identity) |
| CPL-6 WAR×INTERIOR | LIVE (4 channels) / DARK (war party) | ADDS (WR-5 books/veto/re-read; INT-3/INT-4) |
| CPL-7 TRADE×FAITH | LIVE (conscience embargo, relational contraband) | ADDS (WF-7 tithe; FP-TRADE moral drift) |
| CPL-8 TRADE×POP | LIVE (import arm, prosperity pull) | ADDS (POP-1 believed conditions; food pipeline) |
| CPL-9 TRADE×INFO | LIVE (believed danger EV) / gap (prices read truth) | ADDS (SP-2 believed scarcity; IN-0 HIDE tax; the run) |
| CPL-10 TRADE×GRAMMAR | EMPTY-today (no peacetime pact) | ADDS (SP-3 IS the cure; trade term families) |
| CPL-11 TRADE×INTERIOR | LIVE (merchant seats, commerce blocs dark) | ADDS (THE HOUSE; seatBooks venture appetite) |
| CPL-12 FAITH×POP | LIVE (crisis conversion, adoption, affinity) | ADDS (WF-2 pilgrims; POP-3 diaspora rite) |
| CPL-13 FAITH×INFO | LIVE (faithLabel staleness) | ADDS (WF-4 omens; SP-2 believed devotion; lure) |
| CPL-14 FAITH×GRAMMAR | LIVE (faith-brother mediation) | ADDS (WF-6 faith terms; communion trigger) |
| CPL-15 FAITH×INTERIOR | LIVE (divine mandate → legitimacy) | ADDS (WF-1 unseating; the reformation chain) |
| CPL-16 POP×INFO | LIVE (columns carry rumors — one direction only) | ADDS (POP-1 believed road; letters home; lost column) |
| CPL-17 POP×GRAMMAR | EMPTY-today (nothing negotiable about people) | ADDS (SP-3 population term families; permits) |
| CPL-18 POP×INTERIOR | DARK (commons voice built, unlit) | ADDS (POP-2 refusal rung; émigré arm INT-3) |
| CPL-19 INFO×GRAMMAR | LIVE (compliance fog, believed margins) | ADDS (WR-7 envoys; IN-1 mirror; the lie-bought pact named) |
| CPL-20 INFO×INTERIOR | LIVE (council_schism, exposure blowback) | ADDS (INT-2 counsel receipts; the scandal→fall join) |
| CPL-21 GRAMMAR×INTERIOR | LIVE (approval lanes) / gap (no signer identity) | ADDS (oath-holder identity; succession-repudiation; INT-4) |

---

## §4 THE 21 PAIRS (each walked both directions; format: EXISTS with survey
## receipts → ADDS with owning waves → COUNTERFORCE off the same evidence →
## BELIEF + CLOCK → RECEIPTS + DOSSIER → PINS (negative hardest) → DECLARED
## EMPTY. Historical archetype in the title clause.)

### CPL-1 — WAR × TRADE (the Hansa's grain embargoes: merchants waging war without banners; and the blockade that starves the siege)
**EXISTS, war→trade:** hostile gates physically intercept and seize caravans
(supplyShipments routeIntercepted :209; smuggle's one-roll-vs-worst-gate,
smuggle.js:258-287, seizures conserving loot into the seizer's stock,
commodityFlow.js:613-617); siege interdiction feeds the SIEGE verdict —
`supplyInterdictionLevel` (supplyShipments.js:504) means trade physically
weakens a besieged city's hold; entrepot centrality attracts a bounded wartime
targeting premium (entrepots.js brakes); war treaties move real conserved
grain-months (treatyTransfer.js — deliveredToVictor === extractedFromLoser,
spoilage the sink). **EXISTS, trade→war:** tradeSalience's per-commodity
value-of-tie feeds the hostility DAMPENER (tradeWar.js survey row — trade-as-
peace); a contested trade flip can escalate to a deposited war INTENT through
the one opener (tradeWar.js:573-599, hardened by WR-0c item 3: an escalation
intent orders WHOM only, no CONQUEST_MARGIN waiver); embargo lanes exist three
ways (conscience embargo institutionTolerance.js:52-119; trade_dependency_
embargo relationshipRulesAdversarial.js:535-627; the merchant lever); war
motive reads perceived scarcity (perceivedScarcityOf, demographicsWar.js:206).
**ADDS:** FP-TRADE(casus commercii) gives commerce its own walker-enforced
reason taxonomy with severance↔partnership mirrors — the trade grievance stops
borrowing war's vocabulary; FP-TRADE(food joins the physical pipeline) makes
the blockade materially true for the flagship good (today food moves by rate
arithmetic — foodBalance survey row — so a "starved" city starves by
percentage, not by intercepted grain); WR-4's home front reads trade partners
lost + route decay as war cost; WR-6's expenditure read prices allied trade
spent; WR-10's bundle stacks trade-rights term families — **which do not exist
in the tree** (trade survey: trade_exclusivity/market_access/toll_exemption,
zero hits) — a declared cross-volume dependency: SP-3/FP-TRADE mint the term
families; WR-10 consumes them (§10).
**COUNTERFORCE:** the same dependency edge scores both ways — tradeSalience
dampens hostility exactly where resource_pressure/opportunism would raise it;
an embargo that cuts a salient tie charges the embargoer's own supply web
(supply-web campaigns re-scored per tick and ABANDONED on EV collapse,
supplyWebWarfare.js:26-28).
**BELIEF + CLOCK:** the aggressor's supply-web read is already belief-gated
(believedOnly satellites, wrong-village strikes — supplyWebWarfare.js:267-278);
caravan refusal reads believed danger (M6c). Goods move at caravan legs; the
war's trade pain accrues at route-decay and stockpile-drawdown speed — the slow
verdict of the two-timescale echo; the seizure beat is the fast layer.
**RECEIPTS + DOSSIER:** starvationReceipt is mandatory and causal ("the smithy
starves: the iron road is cut" — supplyShipments.js:227); webwar_* kinds exist.
Dossier round-trip: the town page's supply/institution panels already show
supply_starved impairments with cause; FP-TRADE's dossier waves add the house
ledger view. The DM asks "why is the smithy dark?" and the walk (CW-2) runs
seizure→route→war.
**PINS:** negative-hardest — an embargo against a NON-salient tie moves nothing
(no phantom leverage); a trade-war escalation intent failing CONQUEST_MARGIN
does not open (pinned in WR-0c); conservation holds through seizure (built pin,
commodityFlow).
**DECLARED EMPTY:** trade→war auto-war — no economic condition ever opens a war
except through the one opener's full gate stack (settled by WR-0c item 3;
re-litigating it here is a defect). War→trade price panic — no numeric price
exists to panic (owner's no-coin ruling, treatyTransfer.js:11-20); scarcity
speaks in bands only.

### CPL-2 — WAR × FAITH (Saladin and the raided pilgrim roads: the casus a holy man hands a general)
**EXISTS, faith→war:** sacred_claim reads the closed four-quadrant table
(CLAIM_BY_QUADRANT — schism_axis 0.75 OUTRANKS natural_enemy 0.60: the heretic
before the stranger; sacredClaim.js:67-84), scaled by the observer's own
patronSecurity (a contested church presses no claim), mirrored by common_rite;
wired at warReasons.js:804. **EXISTS, war→faith:** the creed follows the
garrison — occupation faith-pull (OCC_CONVERSION_GAIN 0.5, WARBOUND 1.35×,
religiousContest.js:109-127); war_front/military_protection are conversion
carrier channels (:80-93); forced flips stain legitimacy (LEGIT_STAIN_IMPOSED
0.45); and the war DIES with the god: warTermination's sacred_claim dissolution
keys on patron_anchor_changed (warTermination.js:88, :308-322 — "a god named
when the banners rose is no longer worshipped from the same throne"), BUILT and
flag-dark.
**ADDS:** WF-1 (the unseating) gives the dissolution a typed, receipted fall to
anchor on — the believer-side collapse with named causes; WF-6 puts faith terms
on the table via SP-3 (missionary access, shared-rite compacts, pilgrimage
rights) so holy wars can END with terms about what they were fought over —
today "holy wars can start over gods but never end with terms about them"
(faith survey verdict); WF-2's pilgrims + legates become interceptable war
targets (CPL-12/CPL-5; signature story #2); WR-8's world-judgment includes
deities judging the razing on the observer's axis, and the atrocity casus pair
(J-WR-14) gives moral outrage its own cause.
**COUNTERFORCE:** common_rite is the same quadrant table read at the opposite
pole (RITE_BY_QUADRANT mirrored 0.80/0.45/0/0); patronSecurity gates both
signs; WF-6's shared-rite compact is the pact-shaped counterforce to the
sacred_claim war.
**BELIEF + CLOCK:** the quadrant read compares embedded patron snapshots — a
LOUD-FACT read under C-LAW-5 (altars are public; ruled J-CPL-6); the neighbours'
DEVOTION (how sincerely they keep the rite) is a secret and rides SP-2's
believed-devotion family when WF-4/IN-2 land. Spread moves at carrier reach;
dissolution re-reads at pulse cadence once warTerminationEnabled lights.
**RECEIPTS + DOSSIER:** conversionOutcome receipts name amplifiers per the
legibility law; the dissolution receipt is authored. Dossier: WarFaithTab
already composes both; WF-0/WF-8 add the fall causes and war-of-the-faith lines
to FaithSection (ACTIVE state only — premium gate maps in WF §3).
**PINS:** negative-hardest — two towns with NO patrons share no rite and press
no claim ("absence of a faith is not a shared faith", sacredClaim.js:39-49,
built); a contested patron presses no claim; the dissolution does NOT fire on
anchor_unavailable legacy records ("missing history is not evidence a god was
unseated", warTermination.js:313, built).
**DECLARED EMPTY:** war→faith divine verdict — no battle outcome ever proves a
god (Law One; the engine models believers only); victory moves SHARES and
MANDATE, never truth. Faith→war holy-war exemption — no sacred_claim ever
bypasses the opener's gates, the treaty block, or law N's overwhelming gate
(faith is a reason, never a waiver).

### CPL-3 — WAR × POP (the Völkerwanderung: armies make refugees, and hungry realms make armies)
**EXISTS, war→pop:** war dead are conserved (deployed − returned === war dead,
simulationRules.js:94); sack arithmetic splits captured-vs-dead conservedly
(warDeployment SACK/FORAGE); M4 crisis flight reads live safety/hostility in
its four-axis destination score (spatial/migration.js:228-268) with
culture-affinity weighting; refugee columns become rumor carriers
(RUMOR_CARRIER_REFUGEE). **EXISTS, pop→war:** realm carrying-capacity pressure
feeds ONLY the war-motive side inside the existing resource_pressure casus and
the ×1.30 cap, through the ONE belief selector (perceivedScarcityOf with the
`mistaken` receipt clause — demographicsWar.js:206-230, 295-312), with a
never-zero capability floor 0.20; the anti-governor separation is structural
and source-scanned (realm total reaches motive, never incidence —
demographicsObservation.js:30-36).
**ADDS:** WR-8's razing routes deaths-not-departures through §3 demographics
(conserved `sack` cause class; banded escape share as refugees; named cast
disperses roaming, never engine-killed); POP-4's plague arc gives war's camp-
follower pestilence a narratable spine; POP-5a narrates the column that meets
the war (road drama; the lost-column inference is K.7's shape pointed at
civilians); POP-3's departure memory turns war exoduses into generational
story-fuel (CPL-18, signature story #4); WR-3's lineage claims ride wave-P
overflow foundings (flag-dependency: WR-3 declares demographicsEnabled a
lit-precondition).
**COUNTERFORCE:** the capability damper — a starving realm WANTS war more and
can WAGE it less, both read from the same pressure state (demographicsWar's
motive vs capability floor); the mistaken court's receipt admits the error
("...and the court is wrong about it").
**BELIEF + CLOCK:** the war side already reads belief (populationTrendBand
through the one selector); the migration side reads truth until POP-1 —
belief moves feet, never grain (POP §3 seam ruling; capacity/viability/landing
stay truth). Columns at leg speed; realm pressure at yearly observation
cadence.
**RECEIPTS + DOSSIER:** the hunger line and departure line are the estate's
model translation (demographicsHerald.js, graded review:500); WR-8 adds the
sack's demographic receipt. Dossier: population panel + the ladder census;
POP-6 adds the arrival/recovery voice (the hopeful half is voiceless today —
populations survey verdict).
**PINS:** negative-hardest — the razing's escape share lands as REFUGEE
COLUMNS that conserve exactly (no soul minted or ghosted; the 300-tick
accounting identity extends over the sack class); a pressured realm below the
capability floor still cannot march (floor 0.20 built); named cast never dies
in a sack (never-kill law).
**DECLARED EMPTY:** war→pop deliberate massacre outside R's double gate —
no mechanism kills population as policy except the razing (extremity-gated,
evil-exclusive at initiation); pop→war manpower arithmetic — armies do not
deduct working population per levy in v1 beyond the existing levy/mobilization
machinery (a conscription-economics coupling needs its own owner ruling).

### CPL-4 — WAR × INFO (the Ems Dispatch: a war started by an edited sentence; and the two liars whose war cannot end)
**EXISTS, info→war:** the chooser is belief-wrapped end to end
(makeBeliefStrengthFor, settlementStrategy.js:310; belief-aware siege :227;
belief-sourced targeting :374); "X marches on a misjudgment" is minted on
selected offensive moves (detectMisjudgment → belief_misjudgment,
beliefMap.js:1362-1457); the compromised believed-ally leaks true footing to
real enemies at confidence 0.9 (beliefMap.js:964-976 — belief-map accuracy is
load-bearing). **EXISTS, war→info:** war fronts re-price in-flight rumors
(V-24b route impedance); armies are rumor carriers; wars against proven liars
converge SLOWER (the Blainey discount, informationStatecraft.js:244-272,
pinned) — the two-liars war that will not end is already executable drama
(info survey). The wired autonomous lie is DETERRENT-only: the garrison bluff
inflates self-strength (LIE_TUNING :393-430) with exposure blowback (credibility
charge LIE_FALL 5, grievance, legitimacy).
**ADDS:** IN-2 THE LURE — lies that bait: planted weakness feeding
opportunism's foe-half, planted wealth feeding the gold rush (CPL-16, story
#6), planted devotion feeding sacred tension; bluff-vs-bluff becomes the
program's signature tragedy via IN-1's mirror (what they likely believe of us,
derived from the outbound record, never nested belief — SP-2's second-order
heuristic); PLANT_WIRING lands in IN-0 (the fold into processLies — the named
unwired seam, brokerageServicesPlant.js:87); WR-8's feasibility composite is a
pure belief read (K3-pinned) so conquest itself runs on the medium; IN-4's
reputation race gains consumers keyed to who-knew-first (the built, pinned,
zero-consumer read — routeNetworkConsumersRace.js:322); IN-3's counter-game
gives the deceived court agency (vet, send-two, sweep).
**COUNTERFORCE:** credibility is asymmetric off the same exposure evidence
(TRUE_RISE 0.6 vs LIE_FALL 5) — the lure spends a stock the bluffer needs for
its next war; the Blainey discount makes serial deception self-defeating at
the peace table.
**BELIEF + CLOCK:** the whole pair IS the belief boundary; lie shelf-life 8
ticks, exposure on 2-band contradiction; news at hop latency — and the war
brief's grievance receipt today never names the lie (the anonymous final join,
info survey) — IN-5 gives scoreGrievance the incident-naming receipt variant.
**RECEIPTS + DOSSIER:** infowar beats exist; the dramatic-irony brief renders
the belief/truth gap (composers.js:262-318); BeliefDivergenceBand ships without
its truth join (documented v1 follow-up) — IN-5/IN-6 close it. Dossier: the DM
sees the misjudgment band on the map surface and the lie's exposure in the
feed; CW-2 walks war→lie backward once the naming variant lands.
**PINS:** negative-hardest — a lure against a court whose counter-intel
corroboration refutes it moves NOTHING and charges the planter (both the
brokerage's stamp ladder and the liar's credibility — the same evidence
pricing force and counterforce); the deterrent bluff and the lure bluff are
DISTINCT intents pinned separately (PLANT_INTENTS ['inflate','deflate'] both
reachable); a war between two proven liars converges slower than the identical
war between honest courts (Blainey pin, built).
**DECLARED EMPTY:** info→war forged war-orders — no lie ever mints an
engine-level order, intent, or ledger artifact; lies move BELIEFS about state
(the forged-instrument boundary, J-CPL-8, shared with CPL-19).

### CPL-5 — WAR × GRAMMAR (Versailles: the dictated peace that pre-paid the next war)
**EXISTS:** this is the grammar's home lane — the entire treaty artifact mints
at war-exit (advanceTreaties PASS 1, sole caller pulseKernel.js:2371; victor
drafts unilaterally from believed margin, no counter-offer machinery anywhere);
enforcement BITES (war block, demil cap, occupation hold — treatyEnforcement.js
:82-141); detected default feeds the treaty_default casus; WR-0c made
repudiation a first-class approval-routed act with a legible broken shell and
made the war-block reach the one opener; strain accrues typed tribute_strain
resentment feeding revanchism; mediation softens budgets 20% and earns the
broker trust both ways; coalition peel exists.
**ADDS:** WR-7 replaces the TRANSPORT never the math (the seam ruling: one
evaluator, two transports; negotiationPictures.js invokes the leaf evaluators
once PER PARTY under its own truthFor); WR-5 prices refusal (G2: a declined
peace is a first-class news event with real costs); FP-GRAMMAR(SP-3) opens
PEACETIME formation so the NAP stops being a victor's term only (survey's
sharpest fact: two peaceful neighbours cannot sign a non-aggression pact —
the only path runs through fighting); FP-GRAMMAR(oath-holder identity) puts
WHO SWORE on the record (CPL-21); expiry gains its receipt (today a
twenty-year pact dies in total silence — peaceTerms.js:720-724, 763-765);
renegotiation-from-strength opens (§12.5's unbuilt window).
**COUNTERFORCE:** compliance fog cuts both ways off the same monitor-reach
state — a poorly-watched cheat ghosts as honored (the victor's problem), and
an honest payer under-credited breeds the payer's grievance (the loser's);
face-saving exits price the climb-down so peace stays reachable.
**BELIEF + CLOCK:** believedMarginAtSignature persists on the record (the
lie-bought pact's fingerprint — CPL-19); the treaty clock is 52-week current /
legacy-12-marked (WR-0c item 4 landed). Errand legs at law M when WR-7 lights.
**RECEIPTS + DOSSIER:** treaty_signed (major) + treaty_breached exist;
TreatyPanel/WarFaithTab/PDF render per-term compliance and the fraying line —
mid-life legibility is excellent, both ends near-mute (survey verdict) —
FP-GRAMMAR's voice work adds lapse/detection/longevity beats. Dossier: the
treaty document IS the round-trip.
**PINS:** negative-hardest — a live honored NAP blocks the opener AND the
chooser's deploy weight collapses at warReasonFactor=0 (WR-0c, built + pinned);
white peace below CLEAN_EXIT_FLOOR takes no terms; an expired treaty lifts
every effect the same tick through the one enforcement reader.
**DECLARED EMPTY:** no congress — peace is pairwise along edges, ever (law I);
no ceasefire object exists anywhere in the model (WR-7c: war continues through
compromise rounds).

### CPL-6 — WAR × INTERIOR (February 1917: the war continued past the country's interest until the interior replaced the seat)
**EXISTS:** four live channels both directions — war sentiment tilts the coup
hold-chance at 0.22 weight (coup.js:113-114 ← computeWarSentiment,
disposition.js:223); reinforcement costs bite public_legitimacy
(warDeployment ~:2038); climb-downs land legitimacy hits + credibility charges
(momentum.js:1255-1290); a domestically weak seat seeks foreign war
(legitimacy_hunger, warReasons.js:489-501, TELLABLE-NOW with its authored
closing line). DARK: settlementPolitics makes treaty-burdened factions a
literal revanchist war party ("pull += strain * 0.6" :609) and commerce blocs
a peace pull, consumed at settlementStrategy.js:1044. Inheritance is
asymmetric by construction: settlement-grain memory persists untouched across
succession; heirs inherit bonds/grudges at 0.4× marked inherited:true
(npcLadderKernel.js:605); but NO power change re-reads a war — amendment D's
own words: every trigger exists "and none of them currently changes the
answer".
**ADDS:** WR-5 is the cure's war arm (the two books, refusal priced, the
coalition inside the walls both polarities, the re-read with the momentum
discount); INT-1 generalizes the books to every layer's decisions
(seatBooks.js, ONE books read, many consumers); INT-3 completes the interior
VETO (the war/pact decision as organizing grievance with the causal join
receipted); INT-4 narrates the king-who-paid middle (strain→coup causality in
one chain, tribute_strain today points OUTWARD at the victor only — interior
survey); WR-2 ends the disposition ratchet (permanent war-character until the
generational decay lands).
**COUNTERFORCE:** the same war state feeds both the rally and the rot — a
sustainable war RAISES the hold-chance, a sour one lowers it (coup.js:44-45,
same computeWarSentiment read); legitimacy repair genuinely moves the verdict
(recomputed from live state).
**BELIEF + CLOCK:** interior couplings are same-settlement, same-tick — the
fast layer; the slow verdict is the memory estate (incident half-life 4 ticks,
bonds 156w, disposition permanent-until-WR-2). The commons and factions read
TRUE local state (legitimacy, seated corruption) — the boundary law does not
apply inside the walls (and the seat lying to its own crowd is declared empty,
J-CPL-9).
**RECEIPTS + DOSSIER:** coup verdicts are dice-clean on the main lane; the
investiture beat narrates inherited grudges; INT-4's attributed receipts name
the strain's source. Dossier: the power structure panel + INT-2's counsel
projection.
**PINS:** negative-hardest — a secure, legitimate seat survives an unpopular
war (0.22 weight tilts, never topples — built); the re-read is BIDIRECTIONAL
(a successor repudiates OR escalates from the same state under different
character — WR-5 pin); the veto's both polarities (war party overturns
peacemaker; peace party overturns warmonger).
**DECLARED EMPTY:** no standing army as a domestic actor — the garrison never
coups on its own (coups run through factions/ladder contenders; a praetorian
lane would need its own owner ruling).

### CPL-7 — TRADE × FAITH (the Fugger loan behind the indulgence sale: money and mitres in one ledger)
**EXISTS, faith→trade:** the conscience embargo — tolerance baseline IS patron
conviction, trade-normalized, mult falling toward EMBARGO_FLOOR 0.15 as
abhorrence rises, exit automatic when the offending institution closes
(institutionTolerance.js:52-119); contraband is RELATIONAL (slaves banned by
good/lawful/culturally-distant gates, legal at a slaver gate — CONTRABAND_TABLE
smuggle.js:87); moral institution pressure founds/abolishes morally-loaded
institutions under the patron plane × piety megaphone (moralInstitutionPressure
.js:1-88). **EXISTS, trade→faith:** trade edges are conversion CARRIERS
(religiousContest.js:80-93); temple-mediated relief adds 0.4 piety warmth
(generosityEV.js:243-253); and the tithe does NOT exist — no gold/treasury
stream touches a temple anywhere in src/domain (faith survey, tithe grep;
'tithe_rights' is a faction-competition prize TOKEN only,
factionCompetition.js:68).
**ADDS:** WF-7 THE TITHE COUPLING (the stream, the temple wealth band, the
relief lever, the sack-lure coupling — a rich temple is a reason to come);
FP-TRADE(moral drift prices profiteering) — the famine speculator's fortune
carries a conscience stain the tolerance/moral machinery can read (story #5);
WF-2's shrine economy makes pilgrim traffic a trade flow (CPL-12); SP-5's
house credibility and confidence-in-god are siblings in one stock family —
the grammar of trust is shared, the stocks never merge.
**COUNTERFORCE:** the same wealth state — the endowment that buys standing
(WF-7 + faction competition) versus the tolerance/abhorrence read that prices
how the wealth was made; the temple that refuses the tainted gift is the
alignment gate reading the SAME provenance.
**BELIEF + CLOCK:** tithe flows at local (LOCAL-lane, deity presence) cadence;
the speculator's cornering rides SP-2 believed scarcity (CPL-9). Neighbours'
knowledge of a temple's wealth is a SECRET (belief-side, sack-lure reads
believed wealth) — the altar is loud, the coffer is not (C-LAW-5 applied).
**RECEIPTS + DOSSIER:** WF-7's tithe band + relief receipts land in
FaithSection (ACTIVE only); moral_reckoning exists as a phrased token today.
Dossier: the temple's wealth band and the house's stain both render where the
DM looks — the town page's faith and economy panels.
**PINS:** negative-hardest — a poor temple lures no sack (the sack-lure reads
the band, and the band must be reachable BOTH ways); the conscience embargo
never zeroes trade below EMBARGO_FLOOR (a principled town still eats — built);
profiteering unexposed carries its stain only where a reader exists (no
omniscient morality — the stain rides receipts, not truth).
**DECLARED EMPTY:** no indulgence market — forgiveness of the corruption/
grievance estates is never purchasable through the tithe stream (INT-6's
deliberate forgiveness is a SEAT act with a price, not a commodity; Law One
keeps the divine ledger closed); no blessed-goods price tier (no prices exist).

### CPL-8 — TRADE × POP (the grain fleets of the Baltic: bread decides where people can live)
**EXISTS, trade→pop:** K_food's import arm is the coupling's spine —
floor(dailyNeed × importDependency × arteryFactor × importFactorOf ×
mouthsPerUnit), with ARTERY_IMPORT_FACTORS [0.25, 0.70, 1.00, 1.15] indexing
live interdictable arteries when route lifecycle is lit — siege-by-starvation
falls out of the import band (demographicsRates.js:332-380); prosperity pull
reads the destination's causal economic_capacity (demographicsPushPull.js:
347-350); the relief-creditor draw caps at 10% of local production.
**EXISTS, pop→trade:** migration columns are counted by J2's flows in the
population class (ROUTE_FLOW_SOURCES attribution table); population IS the
demand side of every supply chain; boomtown upswing arcs read sustained
surplus + earned centrality.
**ADDS:** FP-TRADE(food joins the physical pipeline) — the flagship-good
asymmetry dies: grain caravans become interceptable objects, so the import arm
stops being pure arithmetic and starts being a road you can cut and a caravan
you can rob; POP-1's believed conditions make destination attractiveness a
belief the trade net carries (the rush chases the boom the rumors sold —
story #6); SP-3's grain-for-settlement provisions and labor compacts make
bread-for-people a signable pact (CPL-17); POP-5b lights the permit table's
trade column (moverPermitted's dark vocabulary — populations survey found ONE
consumer).
**COUNTERFORCE:** capacity truth — competeForDestinations caps takes at true
spare and the landing stage runs before departures (built); the boomtown that
cannot feed its arrivals shrinks by the same K_food read that drew them
(force and counterforce are literally one function).
**BELIEF + CLOCK:** belief colors what the menu PROMISES, physics rules what
the road DELIVERS (POP §3 pull seam ruling — the gap between the two IS the
drama); grain at caravan legs, columns at column legs, the two racing is
POP-5a's road drama.
**RECEIPTS + DOSSIER:** hungry_gap names the burial line; import_shortage and
flow_trade_scarcity exist; POP-6 adds the arrival voice ("newcomers pour into
X" does not exist today — populations survey). Dossier: foodBalance + the
binding-wall word (granary vs walls) already render; FP-TRADE adds the
caravan/stock view.
**PINS:** negative-hardest — cutting the LAST artery drops the import factor
to the irregular-traffic trickle, never zero (built band); a boom whose
believed pull exceeds truth strands arrivals as UNPLACED with receipts (POP-1's
disappointment machinery, pinned there); conservation across arrival/turn-back
(the 300-tick identity with negative control, built).
**DECLARED EMPTY:** no rumor moves grain — belief never enters the conserved
goods arithmetic anywhere (the POP seam ruling's law, restated here as the
pair's boundary); no per-capita price signal (no prices).

### CPL-9 — TRADE × INFO (the Panic of 1907: runs started by whispered association, not audited books)
**EXISTS, info→trade:** dispatch refusal reads BELIEVED destination danger —
"reads BELIEF, never truth"; a stale siege rumor deters real caravans
(dispatchEV.js:12-31, 75, 185-190); route chartering scores the KNOWN picture
(routeNetworkCharterDanger.js:20-35); the frightened endpoint governs.
**EXISTS, trade→info:** trade carriers move rumors (rumorNetwork's trade
carrier — six carriers, each riding a real mover); intel_transfer routes to
the trade desk; brokerage houses are patron-bound institutions with real
service books (the only "actor books" in the estate today — info survey).
THE GAP, measured: prices, scarcity, and partner choice read omniscient truth —
zero belief imports across all nine core commerce modules (trade survey,
epistemics row); HIDE's trade tax is narrated, not wired (SEAM NOTE,
informationStatecraft.js:1448-1452).
**ADDS:** SP-2 BELIEVED SCARCITY ("grain is dear in the east, they say") —
FP-TRADE(believed markets) owns the consumers: the wrong-market tragedy,
cornering, the famine speculator; IN-0 lands the HIDE trade tax (the sealed
court stops hearing prices too); IN-2's planted wealth/planted scarcity are
the lure pointed at markets; SP-5's house credibility instantiates the
confidence-stock family for commerce — the run becomes mechanics (story #3);
IN-4's race decides who-knew-first at the market gate.
**COUNTERFORCE:** arrivals correct beliefs — every physical delivery is an
independent witness against the rumor (the stamp ladder's hop-count theorem is
MEASURED: hop count predicts truth 1.000→0.465, brokerageStamps.js:22-49); a
house of confirmed record survives tavern-talk (creditors weight by stamp).
**BELIEF + CLOCK:** the believed-scarcity subject family decays on the belief
laws (silence decay, contradiction, forgetting); caravans move slower than
rumors — the say arrives before the sail, which is exactly the speculator's
window and the race's stake.
**RECEIPTS + DOSSIER:** the say-versus-delivery divergence is receipt-
derivable (belief record vs arrival record); FP-TRADE's dossier lane shows the
house ledger; the brokerage stamps already dress Herald items. Dossier: the
market panel's scarcity band beside the belief band — the DM sees the wedge.
**PINS:** negative-hardest — a planted scarcity CONTRADICTED by visible
arrivals dies on the 2-band contradiction law and charges the planter; the
cornering play against a well-connected market fails (independent witnesses
arrive too fast); HIDE's tax must show the sealed court mis-pricing (the cost
of secrecy is ignorance, both directions — built as SEE/HIDE symmetry).
**DECLARED EMPTY:** no numeric price feed — believed scarcity is BANDED
("dear/fair/glut" family), never a float (finite semantics); no autonomous
house-side SELL spammer (the anti-whisper-war-hum law, recorded deferral in
informationStatecraft's foot notes, honored here).

### CPL-10 — TRADE × GRAMMAR (the Methuen Treaty: wool for wine, signed by two courts at peace)
**EXISTS:** almost nothing, and the survey proved the hole exactly — the
treaties ledger is the ONLY typed, term-bearing, enforced agreement artifact
and its sole mint path is war-exit; "two neutral realms form a grain-for-ore
pact" has no representation, no formation path, no negotiator, and no
enforcement surface anywhere in the tree; non_aggression is in the catalog but
only a victor's dictation; peacetime "agreements" are relationship LABELS with
scalars, no goods, no durations, no compliance (grammar survey, all
CONFIRMED). The lone peacetime arrangement with enforcement semantics is the
generosity CREDIT obligation (maturity→repayment/default, default minting a
0.7-severity betrayal-class grievance — the casus seam), and it is unilateral.
demographicsRates.js:271-277 is the tree's own admission: the food-export
treaty quantity waits on trade agreements landing.
**ADDS:** SP-3 IS this pair's cure and FP-GRAMMAR owns it — peacetime
formation from typed triggers (a trade-demand crossing among them), two-sided
drafting via negotiationPictures (built once for WR-7, used for peacetime),
the standalone NAP writer, expiry receipts, succession-repudiation,
renegotiation-from-strength; FP-TRADE(pacts via SP-3) supplies the TRADE TERM
FAMILIES — including the exclusivity/market-access/toll-exemption rows that
WR-10's bundle spec name-drops but the tree lacks (trade survey: zero hits;
the dependency is declared in §10); FP-TRADE(casus commercii) gives pact
breach its commercial casus siblings so a defaulted grain pact angers like a
defaulted peace.
**COUNTERFORCE:** compliance-under-fog transfers whole (the same monitor-reach
machinery — an unwatched partner's default ghosts as honored); severance
mirrors partnership in the casus taxonomy (walker-enforced, FP-TRADE crux).
**BELIEF + CLOCK:** formation triggers read believed demand (SP-2) — the pact
you propose is the pact you BELIEVE you need; the treaty clock (52-week,
marked legacy) governs all durations; food streams ride the physical pipeline
once FP-TRADE lands it.
**RECEIPTS + DOSSIER:** treaty_signed already carries per-term reasons;
peacetime pacts inherit the whole document surface (TreatyPanel, fraying line,
PDF) for free — the single-artifact ruling pays here. Dossier: the treaty
document on both towns' pages.
**PINS:** negative-hardest — a proposed pact NEITHER side's own-picture
valuation clears mints NOTHING but a receipted no-deal (the whitePeace
precedent extended to peacetime); a grain pact whose payer starves performs
the reserve-floor law (impoverish, never starve-out — treatyTransfer's floor
generalizes); the survey's sharpest sentence stays pinned until cured: two
peaceful neighbours CAN now sign what only victors could dictate.
**DECLARED EMPTY:** no spot-market, no auction, no clearing-house object —
pacts are bilateral court instruments (law I's pairwise discipline applies to
commerce too); DM-confirmed dependency discovery stays advisory, never
auto-signing.

### CPL-11 — TRADE × INTERIOR (the Medici: the house that got rich off the route and then bought the seat)
**EXISTS:** merchant SEATS bias the chooser (MERCHANT_OBJECTIVE — war-averse,
own levers reroute/embargo/credit, scoringObjective.js:71-114); commerce-end
blocs damp deploy −0.5 and lift sue_for_peace +0.5 (settlementPolitics.js:
595-617, DARK); merchant factions hold interest domains ['wealth',
'trade_connectivity','debt'] and contest institution foundings
(factionCompetition.js:32, 661-729); supply-web instrument choice leans by
archetype ("a merchant reaches for embargo/toll/purchase-denial"). THE GAP,
measured: no faction or seat HOLDS trade assets — entrepot greed is a
self-balancing toll derivation, not an actor's choice; "there is no guild that
gets rich off a route and defends it" (trade survey, actors'-books row).
**ADDS:** FP-TRADE(THE HOUSE) — the merchant actor at faction grain: books,
appetite, named factor NPCs (no micro-agents; Law One), ventures as receipted
risk instruments through the plan lane, endings {fortune, ruin, monopoly,
collapse, severance, cornered}; SP-4's posture colours the house's appetite
(SP-4a per house/temple actor class); SP-5's house credibility; INT-1's
seatBooks is DECLARED a consumer surface for trade venture appetite (INTERIOR
§3 names TRADE's venture appetite among seatBooks consumers under
seatBooksEnabled); INT-2's positions generalize so a house-aligned bloc's
FOREIGN position (favor the partner, oppose the embargo) loads the chooser.
**COUNTERFORCE:** the house's own books — a venture priced by appetite that
outcome-learning reverses (the merchantAppetite pattern generalized, reversal
pinned by SP-4's law: no courage ratchets); the commons' grievance reads
seated corruption when the house captures the seat (commonsVoice 0.35
corruption weight — the crowd is the counterweight to the countinghouse).
**BELIEF + CLOCK:** the house prices ventures on believed markets (SP-2);
books are SECRETS (belief-side to outsiders, truth to the seat that owns
them — C-LAW-5); venture arcs run plan-lane clocks (proposed→underway→
completed|failed).
**RECEIPTS + DOSSIER:** venture receipts through the plan lane; faction
competition already narrates institution contests. Dossier: the house's
standing on the factions panel; FP-TRADE's dossier round-trip pins the ledger
view.
**PINS:** negative-hardest — a ruined house's seat does not silently absorb
the loss (the ruin ending must land its interior consequences: bloc
realignment, legitimacy question); a house cannot hold assets in v1 beyond
its books' instruments (no route ownership — the entrepot stays a derivation;
J-CPL-7 records the deliberate line).
**DECLARED EMPTY:** no route/institution OWNERSHIP by factions in v1 — tolls
stay earned-centrality derivations with brakes (the four co-built brakes are
the anti-monopolist law; a property system is a new capability needing an
owner ruling); no engine-side bribery verb from house to seat (capture rides
the EXISTING criminal-capture and corruption webs).

### CPL-12 — FAITH × POP (the Huguenot flight: a creed suppressed is a town emptied; and the pilgrim road that feeds two economies)
**EXISTS, faith→pop:** crisis conversion ("chaos converts in the cracks" —
receptivity over 5 disorder contexts, religiousContest.js:140-190) and the
sink's revival arm ("crisis calls the faithful home"; pestilence's
prayers-called-them-home seam, spatial/pestilence.js:58); pilgrimage is an
INVISIBLE score lift — pilgrimageDraw computes exactly who-would-come-from-
where in [0, 0.1] and DISCARDS it (pilgrimage.js:8-104; the news even claims
"the faithful walk the roads" while no mechanic puts them there — faith
survey's IMPOSSIBLE row). **EXISTS, pop→faith:** culture travels with
population — traditions ADOPTION plants an adoptedFrom rite when cumulative
influx from one origin ≥12% over 3 rolling years (relations.js:48-49,
traditionsKernel.js:623-646); refugees prefer culturally-near hosts
(cultureAffinity01 at 0.26 in M4's destination choice).
**ADDS:** WF-2 makes pilgrims REAL — named pilgrims + legates as SP-1 movers
with the pilgrim season read and shrine economy (the discarded draw math
becomes the errand mint's source); WF-5b's covert congregation gives the
suppressed faith secret practitioners — and its exposure/flight arm is the
Huguenot mechanism: suppression → underground → exposure or emigration, the
choice priced by the covert seam; POP-3's departure memory carries the rite
with the diaspora BOTH ends ("the generation that left" keeps the faith the
old country suppressed — old-country ties feed later pulls); POP-1's believed
conditions let a tolerant town's reputation PULL the persecuted (belief-side
refuge attractiveness riding SP-2).
**COUNTERFORCE:** adoption is tier-capped and threshold-gated (a trickle
plants nothing); the sink's comfort drift empties pews in the safe town the
refugees fled to — the same comfort state that drew them cools the faith they
carried.
**BELIEF + CLOCK:** pilgrim errands at law M's leg speed, seasonal; adoption
on the 3-year rolling window (the slow verdict); flight at column speed;
neighbours' knowledge of a suppression is belief-side until the exposure beat
makes it loud.
**RECEIPTS + DOSSIER:** WF-2's pilgrim receipts + shrine economy lines land in
FaithSection; adoption already stamps adoptedFrom. Dossier: the rites list
names the origin; POP-3 adds the diaspora tie where a DM looks at either end.
**PINS:** negative-hardest — a suppressed faith with NO covert congregation
seeds no flight and no revival beyond the built latent-memory arm (the
underground is WF-5b's flag, not a free upgrade of every suppression);
pilgrims are NEVER a migration (they return — the errand's return leg is
mandatory, K.5's law generalized; a pilgrimage that becomes a permanent move
is declared empty for v1).
**DECLARED EMPTY:** no faith-commanded resettlement (no crusader-colony verb:
a creed never orders a column; population moves on push/pull/flight physics
only — Law One keeps gods out of the founding lane); no birth-rate piety
coupling (demographic rates never read faith — the natalist coupling would
need its own owner ruling and its own counterforce).

### CPL-13 — FAITH × INFO (the flagellants of the plague year: a calamity read as wrath, and the prophecy that failed)
**EXISTS:** the fog already covers faith — beliefAxes carries faithLabel /
observanceLabel so a settlement can hold a STALE belief about a neighbour's
rite (beliefAxes.js:10-16); the beliefDivergence envelope MEASURES faith
mismatch rates per year (behavioral-observation.mjs:630-717); belief_
misjudgment routes to the faith desk today (the word-association misfile,
heraldRouting.js:118 — CW-0's registry records intended desks so this class
is walker-visible). THE GAP, measured: no interpretation layer tags an event
as read-as-divine — "the engine moves piety and revival numbers in response
to crisis but never mints the sentence 'the priests say the Lady of Harvests
is angry'" (faith survey, famine-as-wrath row: PARTIAL, weakest).
**ADDS:** WF-4 OMEN READS — calamities interpreted through the local faith
lens as BELIEF WRITES (famine-as-wrath becomes tellable, heuristically; the
failed-prophecy ledger is the counterforce's home); SP-2 BELIEVED DEVOTION
(how the neighbours' gods fare — feeding sacred tension without confirming a
god); IN-2's planted devotion is the lure pointed at the pulpit (a rival
plants "their god has abandoned them" ahead of a sacred_claim press — the
righteous lie); WF-8's narration 3× gives the silent share/legitimacy
transitions their voices so the medium has something to carry.
**COUNTERFORCE:** the failed prophecy — an omen read that events contradict
charges the reading institution's standing off the same calamity evidence
(WF-4's ledger); confidence-in-god is lagged and loss-averse (piety erodes 2×
faster on conduct drift than it builds — built), so wrath-readings spend a
real stock.
**BELIEF + CLOCK:** omen reads are LOCAL-lane (deity presence) and land as
belief writes decaying on belief laws; believed devotion crosses borders at
news speed; Law One is absolute — the engine never confirms the wrath, it
models the READING.
**RECEIPTS + DOSSIER:** WF-4's reading receipts in the house voice ("the
priests read the famine as wrath; the granaries emptied all the same");
FaithSection's ACTIVE state carries the reading and its record. Dossier: the
omen ledger beside the calamity's own receipt — the DM sees both the event
and its interpretation, separately attributed.
**PINS:** negative-hardest — a deity-free town reads NO omen (absence of a
faith is not a lens); a correct-by-luck prophecy still decays on the same
ledger (no oracle ratchet); the misfile class: every WF-4/IN kind's desk is
asserted by the CW-0 registry walker (belief_misjudgment's faith-desk seat is
either ruled intentional or moved — flagged for FP-GRAMMAR/IN-5's routing
pass, J-CPL-10).
**DECLARED EMPTY:** no true divination — the Auspice stays a DM-facing
deterministic forecast with its honest label ("an omen, not a promise"); no
prophecy ever reads the future's actual state (seeded purity + Law One).

### CPL-14 — FAITH × GRAMMAR (the Truce of God: the church as the peace's grammar, not its subject)
**EXISTS:** mediation reads the faith quadrant of the mediator toward BOTH
parties (the faith-brother broker — peaceTerms.js:1121-1146, cross-pressure
via cohesionWeave's temple-facet regex); common_rite is a scored peace REASON
(the parties' own shared floor, deliberately distinct from mediation —
sacredClaim.js:178-181); and NO faith term exists in TERM_CATALOG — a victor
cannot demand a creed, missionary access, or temple rights at any table
(faith survey + grammar survey, both CONFIRMED).
**ADDS:** WF-6 puts the faith term families into SP-3's catalog — missionary
access, shared-rite compacts, pilgrimage rights — with executors, so faith
becomes negotiable WITHOUT becoming dictatable (the families join peacetime
formation AND the war-exit draft through the one catalog); the COMMUNION
TRIGGER joins SP-3's typed proposal triggers (a faith communion proposes a
compact the way a trade-demand crossing proposes a pact); FP-GRAMMAR
(mediation generalizes) extends the broker beyond war-exit — any
cross-pressured neighbour, the temple arm explicit.
**COUNTERFORCE:** the schism axis blocks communion where it feeds claims
(same quadrant table, opposite pole — a compact between same-god readers on
opposite sides of the schism axis is structurally the HARD case and prices
accordingly); suppression consequences (WF-3's stance lanes landing) make the
broken faith compact a stance event, not a shrug.
**BELIEF + CLOCK:** the communion trigger reads the LOUD facts (patrons,
public rites) plus believed devotion for sincerity (SP-2); compacts live on
the treaty clock with expiry receipts (FP-GRAMMAR's lapse beat covers faith
compacts for free — single artifact).
**RECEIPTS + DOSSIER:** the compact IS a treaty document — TreatyPanel,
fraying line, PDF, dossier round-trip all inherited; WF-6 adds the
faith-family compliance voice rows (walker-guarded totality, the
TREATY_COMPLIANCE_VOICE pattern).
**PINS:** negative-hardest — missionary access granted under duress stains
exactly like imposition (LEGIT_STAIN_IMPOSED reads the formation context —
a term extracted at war-exit carries the stain a peacetime compact does not);
the mediator's trust accrual stays TWO-sided (built) and a failed mediation
accrues nothing.
**DECLARED EMPTY:** NO CONVERSION MANDATE TERM — the spine's SP-3 family list
(missionary access, shared-rite compacts, pilgrimage rights) is CLOSED, and
the old design-doc's "conversion mandate" is deliberately dropped: belief
itself is never a term's deliverable (Law One — access can be signed,
conviction cannot; J-CPL-6 records the ruling). No temple as treaty PARTY —
parties are settlements, ever (the temple is a broker and a beneficiary,
never a signatory).

### CPL-15 — FAITH × INTERIOR (Henry VIII: the revenue dispute that became a reformation)
**EXISTS:** divine mandate moves publicLegitimacy (applyDivineMandate,
MANDATE_STEP 2/tick, theocracy weight 1.0 / royal 0.45 — religionState.js:
557-630), and the coup coupling is SOAK-PROVEN (religion-coup-soak: contested
theocracy patron → legitimacy erosion → coups, with a non-theocracy control
cohort — the estate's only executed cross-layer soak); the ruler's stance is
42% of a creed's legitimacy (W_RULER 0.42, religionLegitimacy.js:74-121);
clergy compromise scandals sharpen on reveal (CLERGY_REVEALED_SHARPEN,
religionLegitimacy.js:127-132); religious factions contest temple_authority
with tithe_rights/moral_codes as prizes (factionCompetition.js:56,68);
targeted footholds recruit a SPECIFIC named minister via clergyTraitPlane
(religiousContest.js:830-860) — the named-actor plane is already wired.
**ADDS:** WF-1's unseating types the fall (patron falls = share/legitimacy
collapse with named causes — the interior reads WHY, not just that); INT-7's
legitimacy crossing receipts make the mandate's motion legible (SP-5's
instantiation); WF-5's schism gives the interior a faction-shaped religious
split (the temple actually splits — congregations as sides); story #1 (§5)
chains this pair end to end: the tithe dispute → temple_authority contest →
ruler-stance collapse of the creed's legitimacy → schism → the neighbours'
sacred tension. INT-6's deliberate forgiveness can bury a religious grievance
at a price — and its dig-up (the Revocation) re-opens it over a party that
never forgave the burying.
**COUNTERFORCE:** the same ruler-stance state — the seat that backs the
temple borrows its mandate (legitimacy UP), the seat that fights it erodes
the creed AND spends its own legitimacy on the fight (assize/commons reads);
heresy stain decays (0.06/tick) so reconciliation is always reachable.
**BELIEF + CLOCK:** interior-local, same-tick fast layer; the creed's
legitimacy and piety are LAGGED stocks (the slow verdict — "a burned church
holds its flock for years", piety.js:57-58).
**RECEIPTS + DOSSIER:** conversion receipts + mandate lines exist;
INT-7/WF-8 add crossing voices. Dossier: FaithSection's legitimacy + divine
mandate lines already render with cause chains as sentences.
**PINS:** negative-hardest — a secular seat (no patron) neither borrows nor
erodes mandate (the coupling nulls, never defaults); the theocracy/royal
weight split is reachable both ways; the soak-proven coup chain keeps its
non-theocracy control (the negative cohort IS the pin).
**DECLARED EMPTY:** no state church object — the seat-temple relation is
read-derived (ruler stance × institution backing), never a stored
establishment flag; no engine-side excommunication verb (the temple prices
stances through existing lanes; a formal ban verb needs an owner ruling).

### CPL-16 — POP × INFO (the Black Hills letters: the strike exaggerated at every telling, and the letters home that told the truth too late)
**EXISTS, pop→info:** migration PRODUCES information — in-flight columns are
rumor carriers and the columns THEMSELVES are migration_flight rumor events,
banded (small/notable/exodus), landing the tick behind the column ("news
travels behind the column", migrationRumors.js:13-49). **EXISTS, info→pop:
NOTHING** — the gold-rush tragedy is structurally impossible today: no
population movement consumes the rumor/news/belief layer; destinationMenuFor
reads actual K_food, actual ceilings, actual prosperity (populations survey,
epistemics row: ABSENT, the sharpest single verdict in the four batteries).
And the physics of exaggeration ALREADY EXISTS on the carrier: degradeTelling
drifts magnitude ±1 per hop with name-swaps to real settlements only
(rumorNetwork.js:472-507) — the strike grows in the telling with no new
machinery (J-CPL-11 rules reuse).
**ADDS:** POP-1 THE BELIEVED ROAD — SP-2's believed-conditions family enters
at the ONE menu seam (the pull seam ruling); the rush chases the belief, the
capacity truth strands the surplus, ARRIVAL DISAPPOINTMENT writes the
correction, and LETTERS HOME are the corrective flow (arrivals' reports
re-anchor the origin's belief — the bust); POP-5a's lost-column inference
(silence past the window reads as disaster at home — K.7's shape for
civilians); IN-2's planted wealth is the lure that STARTS a rush (story #6);
IN-4's race decides whether the rush or the correction arrives first.
**COUNTERFORCE:** the letters — every arrival is an independent witness
whose report contradicts the inflated telling on the same subject family;
the boomtown that couldn't hold them empties, and returning survivors carry
the cautionary tale (spine §3 FP-POP, verbatim).
**BELIEF + CLOCK:** rumor at hop latency WITH per-hop drift; columns at leg
speed; the rush's tragedy is precisely that the two clocks race — belief
outruns correction by construction until arrivals close the loop.
**RECEIPTS + DOSSIER:** the departure line already names destinations;
POP-1 adds disappointment receipts and POP-6 the arrival voice. Dossier:
the population panel's inbound line beside the belief band — the DM sees
the promise and the fact.
**PINS:** negative-hardest — a rush toward a town whose TRUE spare is zero
lands zero (capacity truth binds; the unplaced are receipted, not teleported
home); a lost column that was merely SLOW un-mints its inference when it
arrives (the false-mourning correction, K.7's jewel pointed at civilians);
belief never enters competeForDestinations' arithmetic (the seam ruling's
walker).
**DECLARED EMPTY:** no rumor ever moves grain or capacity (restated from
CPL-8 — one law, two anchors); no engine-authored "boosterism" actor (the
lure is a bought plant with a liable planter, never ambient marketing).

### CPL-17 — POP × GRAMMAR (the Ostsiedlung locator charters: settlement by signed compact)
**EXISTS:** nothing negotiable — population appears in NEITHER code nor
design as a treaty subject (grammar survey: no migration-rights, labor, or
settlement term anywhere; hostage sureties design-only); refuge is a
UNILATERAL host posture (E1c); the permit table's destination column is
authored but the wired gate is stricter and three mover columns are dark
vocabulary (populations survey, ladder row).
**ADDS:** SP-3's POPULATION TERM FAMILIES — migration rights, labor
compacts, grain-for-settlement provisions — with MIGRATION PRESSURE as a
typed proposal trigger (the crowded realm proposes the compact before it
exports the crisis); FP-GRAMMAR owns formation; POP-5b lights the permit
table's levy/institution/trade columns so a signed labor compact has a
permit lane to run in; WR-10's people-do-not-move law bounds the sovereignty
market's population effects (the sold town's people stay; only the edge
rewrites).
**COUNTERFORCE:** the commons — POP-2's refusal rung prices a compact the
crowd won't carry (a labor draft the petition ladder refuses is a compact
the seat signed and cannot deliver — compliance fog then shows the partner
a default with a NAMED domestic cause); the voluntary margin (nobody walks
for a treaty that out-promises home by less than 0.06).
**BELIEF + CLOCK:** compacts on the treaty clock; deliveries at column
speed; the partner's knowledge of compliance rides monitor reach (a
distant partner learns the columns stopped coming one report late).
**RECEIPTS + DOSSIER:** compact documents inherit the treaty surface;
delivery receipts ride the migration ledger's existing conservation
identity (departures = arrivals + returned + lost + in-transit — the
compact's audit is the built identity read against the promised flow).
Dossier: the treaty document + the population panel's flows, one page.
**PINS:** negative-hardest — a compact whose flow physics cannot deliver
(no reachable route, nonviable destination) is REFUSED AT FORMATION by the
same closed refusal vocabulary the homeostat uses (none/partial/unreachable/
no_capacity/unattractive — reused, never duplicated); default-by-commons-
refusal receipts the DOMESTIC cause, not a phantom foreign breach.
**DECLARED EMPTY:** no hostage-surety term in v1 (the old design's one
population-adjacent term stays out: persons as compliance bonds crosses the
named-cast never-resolve line — a held hostage is WR-7b's foreign-guest
hold, a war mechanism, not a peacetime term); no serfdom/population-
transfer term (people are never the PAYMENT — grain, rights, and access
are; the sovereignty market trades EDGES, not souls).

### CPL-18 — POP × INTERIOR (the Peasants' Revolt: the levy refused, the petition marched)
**EXISTS:** the commons voice kernel is BUILT and dark — a persistent
per-settlement crowd ledger, grievance = 0.55×legitimacy-deficit + 0.35×
exposed/seated corruption + 0.55×live unrest, deterministic three-rung
escalation (petition→gathering→riot) with consequences through existing
writers and news beats commons_petition/gathering/riot (commonsVoiceKernel.js
:54-197, wired via assizeKernel.js:435 BEFORE the assize so a fresh petition
is answerable same tick). THE GAPS, measured: no popular veto of §5c plans
(RESPONSE_REFUSALS is entirely mechanical), no draft resistance (grep zero),
no strikes; refusal-to-move exists only as the voluntary margin (populations
survey, people's-voice row).
**ADDS:** POP-2 THE COMMONS ARC — the REFUSAL rung extends the built ladder
(the people refuse the seat's plan/levy/emigration-encouragement; priced,
legitimacy-gated); the answered-petition counterforce receipts (the seat
that listens spends less than the seat that suppresses); INT-3's émigré arm
(the interior veto's exile connection — the ousted party that left keeps a
voice through POP-3's diaspora memory); INT-7's legitimacy crossings give
the rung ladder's cause a legible trail.
**COUNTERFORCE:** the answered petition — same grievance state, two seat
choices, two prices; and the ladder's OWN dwell (3-tick) keeps the crowd
from being a hair-trigger veto.
**BELIEF + CLOCK:** interior-local, same-tick fast layer; the crowd reads
TRUE local state (legitimacy, seated corruption — the boundary law stops at
the walls); the slow verdict is emigration (the crowd that is never heard
stops petitioning and starts leaving — the refusal rung's terminal arm reads
the same grievance the departure rate does).
**RECEIPTS + DOSSIER:** the three rung beats exist; POP-2 adds refusal
receipts naming WHAT was refused (the plan, the levy, the encouragement).
Dossier: the commons ledger's rung + the plan lane's named refusal on one
page — the DM sees the standoff.
**PINS:** negative-hardest — a legitimate seat (≥ LEGIT_FLOOR 55) draws no
petition from prosperity alone (grievance needs deficit/corruption/unrest —
built); the refusal rung CANNOT fire against a plan the settlement never
proposed (vacuous-absence discipline: seed the plan live first); riot
consequences flow through existing writers only (no second unrest stock).
**DECLARED EMPTY:** no crowd at the treaty table (the commons refuse and
riot; they never negotiate — pairwise-courts law; their veto is priced
delivery failure, not a signature); no slave-revolt expansion in v1 (the
stressor type exists and commonsVoice reads it; a dedicated servile-war arc
needs its own owner ruling).

### CPL-19 — INFO × GRAMMAR (the Donation of Constantine: diplomacy powered by a believed document, broken by its exposure)
**EXISTS:** the pact-for-a-lie is EMERGENTLY possible and never narrated —
processLies plants false strength, resolveVictor prices terms off
believedAdvantage, and believedMarginAtSignature persists on the record (the
fingerprint is on the ledger; "the deception story exists only for an
auditor doing arithmetic" — grammar survey, drama row); compliance runs
under fog (trueState vs observedState, DETECT_FLOOR — an unwatched cheat
ghosts as honored); the disclosure term is a typed SEAM (minted, recorded,
unenforced — executor 'seam'); envoy testimony's credibility machinery is
WR-7c spec.
**ADDS:** WR-7 is this pair's spine — the errand, the decaying snapshot,
interception, per-party pictures (negotiationPictures), ratification on
OWN pictures, the compromised envoy (Q: the true snapshot handed over — the
one honest channel is the traitor's); IN-1's mirror gives negotiation
posture its second-order read (what they likely believe of us, derived from
the outbound record); IN-0's disclosure executor closes the compelled-intel
seam (the loser can finally feed the channel — and feed it FALSE, Q's
sibling); FP-GRAMMAR's lie-bought-pact NAMING (the join from exposure beat
to the treaty it purchased — the survey's missing tie) and succession-
repudiation reading believed provenance.
**COUNTERFORCE:** SEND-TWO — divergent accounts of one parlay are the
traitor's signature, caught by the corroboration ladder (the same
credibility evidence prices the envoy's word and unmasks its corruption);
the Blainey discount at the table (a proven liar's signals converge slower).
**BELIEF + CLOCK:** K3 IS this pair's constitution — nobody at any table is
ever current; terms can be agreed for a town already fallen (the absurdity
law, pinned in WR-7b); demand and answer both TRAVEL (law M).
**RECEIPTS + DOSSIER:** treaty records carry believed margins; WR-7's
receipts name pictures; the lie-naming variant lands the final join.
Dossier: the treaty document beside the exposure beat, joined by CW-2's
walk.
**PINS:** negative-hardest — a lie exposed BEFORE signature re-prices the
table (the correction arrives in time exactly when the race says it does —
IN-4 consumed at the parlay); the compromised envoy's divergent account is
caught only when TWO were sent (vetting is a real choice with a real cost;
the hurried seat that sent one deserves its treaty).
**DECLARED EMPTY:** no forged INSTRUMENTS — a lie targets beliefs about
states (strength, compliance, margins), never mints, alters, or counterfeits
a treaty record, an obligation, or any ledger artifact; peaceTerms.js is the
single terms writer and NO belief-side shadow-treaty exists (J-CPL-8 — the
Donation's full forgery is the archetype of what v1 deliberately cannot do;
crossing that line needs an owner ruling on how far a lie can mint paper).

### CPL-20 — INFO × INTERIOR (the Dreyfus Affair: a court divided by what it believed, and the forgery that fell with the house that made it)
**EXISTS:** council_schism — a faction confidently reading the world
differently from the seat mints a legible activeCondition ("the council is
split over which threat is real"; detection beliefMap.js:1313-1345, minted
pulseKernel.js:564-591); a foreign asset's exposure fires the full blowback
triple (exposedCorruption ledger → corruption_exposed casus; grievance;
credibility charge; both-court legitimacy hits — pulseKernel.js:595-627,
corruptionWeb.js:891-960); the compromised seat optimizes a foreign patron's
books covertly (directionBias, corruptionWeb.js:506); the dramatic-irony
brief renders the divergence DM-side. THE GAPS, measured: no composer joins
secret → break → fall (each beat independent — info survey); pure inaction
on an accurate belief is unreceipted ("the court that knew and sat still");
posture-reason floats escape the prose ratchet via push-indirection
(relationshipMemory.js:300-302 — latent, not live; carried to CW-0's scan).
**ADDS:** INT-2's counsel receipts (whose read prevailed at the seat, and
against whose dissent — the schism gains its resolution voice); IN-3's
suspicion reads give the interior deliberate counter-intelligence (the
sweep that finds the asset before the organic roll does); INT-3's causal
join receipts cover scandal→coup (the standing corruption_exposed condition
CITED on the capture/coup beat — the survey's named missing line); IN-5's
inaction receipt (high-confidence hostile belief + no selection = "the court
knew, and sat still," receipted).
**COUNTERFORCE:** the vindicated minority — a council_schism resolved by
events pays the faction that read the world right (standing/counsel weight
off the same belief-vs-outcome evidence that charged the wrong reader).
**BELIEF + CLOCK:** the interior consumes the medium same-tick once word
ARRIVES (arrival still pays news latency); the schism condition persists
until beliefs reconverge — the slow verdict.
**RECEIPTS + DOSSIER:** the schism condition, exposure beats, and coup
verdicts all exist; the joins are the adds. Dossier: the council's split
and its resolution on the power panel; the irony brief remains DM-only
(audience projection law).
**PINS:** negative-hardest — a schism between readings that are BOTH wrong
resolves for neither (no vindication without outcome evidence); the
scandal→fall join cites only PERSISTED conditions (no retroactive
storytelling from pruned state — the walk is honest about horizon).
**DECLARED EMPTY:** no domestic propaganda ministry — the seat never LIES to
its own commons in v1 (the crowd reads true local state; a seat-to-crowd
deception lane needs its own owner ruling and its own counterforce —
J-CPL-9); no thought-police verb (suspicion reads target FOREIGN assets and
travelling strangers, never the resident crowd's beliefs).

### CPL-21 — GRAMMAR × INTERIOR (Brest-Litovsk and the repudiated debts: the successor who disavows the ancien régime's signature)
**EXISTS:** treaties are settlement-plane — parties are settlement ids with
NO ruler, faction, or seat provenance, so "the father's oath" is
INEXPRESSIBLE (treatyBreach.js:34-37; the interior survey's verdict: the one
true data-model gap on its list, "cheaply curable with mint-time
provenance"); WR-0c repudiation is approval-routed with no succession
trigger; tribute_strain resentment points OUTWARD at the victor, never
inward at the paying seat (peaceTerms.js:1023-1044); refusal costs are
G2-designed, not built; the approval machinery (three lanes, hold-then-
expire) is the DM's, not a faction's.
**ADDS:** FP-GRAMMAR(THE OATH-HOLDER IDENTITY) — treaties/obligations record
WHO SWORE (mintedUnder provenance: governing faction + seat-holder at
signature), making the heir-breaks-the-father's-oath TELLABLE and giving
succession-repudiation its human face (softer reputation cost for the
coup-born seat that disavows — the world understands a revolution); WR-5's
refusal price + the coalition inside the walls; INT-4's strain attribution
(the commons tribute term — the paying seat's OWN crowd finally reads the
drain; the arc INERT without economicCoupReadEnabled, registered in INT §3
for the owner's lighting order); INT-6's deliberate forgiveness (a seat may
bury a grudge at a price — reconciliation as policy; and the dig-up
re-prices it).
**COUNTERFORCE:** the heir who HONORS — inherited-oath-kept earns
credibility and standing off the same provenance record that would have
priced the breach (one record, two exits); the interregnum cooldown (104
weeks) keeps succession from being a treaty-laundering trick.
**BELIEF + CLOCK:** the successor's repudiation window is a re-read event
(D's trigger family); the partner LEARNS of succession at news speed and of
compliance at monitor reach — a treaty honored by a dead man's town for two
reports' time is the fog working as designed.
**RECEIPTS + DOSSIER:** the repudiation receipt exists; oath provenance adds
"sworn under X" to the treaty document; INT-4's attributed lines name the
drain. Dossier: the treaty document's swearer line + the succession beat,
joined.
**PINS:** negative-hardest — succession does NOT auto-void anything (the
treaty persists unexamined unless the re-read fires and chooses — silence
is a choice with the oath standing); the softer succession-repudiation
price applies ONLY to a genuinely coup/succession-born seat (the standing
seat that fakes a "new government" discount is structurally unreachable —
provenance compares seat-holder identity, not proclamations).
**DECLARED EMPTY:** no dynastic-marriage instrument (kinship is generation-
frozen; lineage claims are WR-3's settlement-plane machinery; a marriage-
diplomacy lane would mint NPC state the never-resolve law protects); no
personal-union of settlements (seats are per-settlement, ever).

---

## §5 THE SIGNATURE STORIES (spine req. 7's proof-by-construction: each story
## is derived end to end by NAMED reads and receipts, link by link, with the
## owning wave for every link that does not exist yet. Each story is an
## acceptance fixture of CW-2: the backward walk must render the whole chain,
## or the coupling program has failed its own crown law. Counterforce named
## per story — every tragedy here can also NOT happen, receiptedly.)

### Story 1 — THE TAX DISPUTE THAT BECOMES A REFORMATION
*(Henry VIII: a revenue-and-jurisdiction quarrel that ended with the altars
changed. Pairs: CPL-15, CPL-7, CPL-2, CPL-13.)*
1. WF-7's tithe stream runs; the temple wealth band rises (receipt: the tithe
   band crossing, WF-7).
2. The seat, strained (WR treaty stream or plain deficit — INT-4's attributed
   pressure receipts name which), reads its books: seatBooks.js (INT-1) prices
   the temple's wealth as the affordable answer.
3. The seat presses: a factionCompetition temple_authority contest with
   tithe_rights the prize (BUILT token, factionCompetition.js:68; the contest
   receipt names the prize).
4. The ruler's stance turns against the creed — and the ruler's stance is 42%
   of that creed's legitimacy (W_RULER 0.42, religionLegitimacy.js:74-121,
   BUILT): the legitimacy slide is arithmetic, receipted at INT-7/WF-0's band
   crossings.
5. Legitimacy-weighted schism contest fires (CONTEST_LEGIT_W 0.78,
   religionState.js:444-496, BUILT): the temple splits — WF-5a types the split;
   the losing congregation goes UNDERGROUND (WF-5b, the covert seam).
6. The neighbours' picture goes stale then hostile: faithLabel belief axes
   (BUILT) read the town's rite wrong, then the schism axis reads it WORSE than
   a stranger's (CLAIM_BY_QUADRANT schism_axis 0.75 > natural_enemy 0.60,
   BUILT) — sacred tension with every same-god neighbour, receipted as
   religious pressure or a scored sacred_claim (CPL-2).
7. The Herald tells it at every link (WF-8's voices); CW-2 walks it backward
   from "why does the whole valley hate this town?" to the tithe receipt.
**COUNTERFORCE:** the seat that settles the tithe dispute at the assize
(LEGIT_JUST, BUILT) buries the quarrel at step 3 — same grievance state, one
honest hearing, no reformation; INT-6 can later bury even the schism, at a
price, over a party that never forgave the burying.

### Story 2 — THE PILGRIMAGE ROUTE THAT BECOMES A WAR TARGET
*(Reynald of Châtillon raiding the Hajj caravans: the raid that handed
Saladin his casus. Pairs: CPL-12, CPL-1, CPL-2, CPL-5.)*
1. WF-2's pilgrim season read mints named pilgrim + legate errands (SP-1) down
   the lived route to the shrine town (receipt: the pilgrim column, law M
   legs).
2. The shrine economy pays BOTH ends: host observance lift (BUILT draw math,
   finally consumed) + pass-through centrality on the road towns (entrepot
   crossings, BUILT) — the route's flow class fills (J2 population-class
   attribution, BUILT).
3. A hostile neighbour reads the pilgrim road as the shrine town's artery —
   through its BELIEVED web picture (supplyWebWarfare's believedOnly reads,
   BUILT) — and interdicts: gates turn hostile, pilgrims are intercepted
   (SP-1's interception surface; a named legate lands in the FOREIGN-GUEST
   HOLD, WR-7b's one writer).
4. Outrage compounds on BOTH axes: the intercepted pilgrimage feeds grievance
   incidents (E1 machinery, BUILT) AND sacred-tension pressure (CPL-2); the
   world judges on the observer's alignment axis (WR-8's judgment read); the
   war that opens carries the road on its casus receipts.
5. The peace that ends it can finally SAY what it was about: pilgrimage
   rights are a WF-6 term family in SP-3's catalog — the compact that reopens
   the road, brokered where a faith-brother mediator stands (BUILT finder).
**COUNTERFORCE:** the toll instead of the raid — the road town that CHARTERS
the pilgrim traffic (earned centrality, BUILT brakes) gets rich off what the
raider burned; same road, same flow, two dispositions (WR-2's channels), two
endings.

### Story 3 — THE BANK BROKEN BY A BELIEVED RUMOR
*(the Panic of 1907: solvency decided by the whisper, not the audit.
Pairs: CPL-9, CPL-4, CPL-11, CPL-20.)*
1. FP-TRADE's HOUSE stands with real books and SP-5 house credibility; its
   counterparties hold E1b credit obligations (BUILT ledger, CREDIT_TERM 12).
2. A rival commissions a PLANT with deflate intent against the house's
   standing — SP-2's believed-scarcity/solvency subject family the target
   (IN-2 THE LURE; priced by the market, DISREPUTE_SURCHARGE, BUILT pricing).
3. The lie enters the world through the ONE lifecycle: PLANT_WIRING's fold
   into processLies (IN-0 seam contract one) — one writer, one exposure law,
   the market's host wearing liarId (BUILT collateral design).
4. Creditors' per-observer beliefs update on the belief laws (BUILT);
   renewals refuse on believed danger exactly as caravans do (the dispatchEV
   idiom pointed at credit — FP-TRADE's believed-markets consumer); the run
   is a cascade of individually-receipted refusals.
5. The house's real books break under the refusals: the RUIN ending from
   FP-TRADE's endings vocabulary, receipted; the exposure comes too late —
   the 2-band contradiction fires only when real deliveries contradict, and
   the deliveries stopped.
6. Blowback lands where it belongs: the planter's credibility charged
   LIE_FALL 5 (BUILT), the ruined house's faction mints the grudge
   (factionPairLedger, BUILT), the interior shifts (CPL-11); CW-2 walks
   ruin → refusals → belief → plant → patron.
**COUNTERFORCE:** the stamp ladder — a house of confirmed record survives
tavern-talk (creditors weight by the MEASURED hop-count theorem, BUILT); the
run only kills where the rumor arrived corroborated or the books were
already thin, and the walk shows which.

### Story 4 — THE DIASPORA THAT FUNDS THE RETURN
*(the reconquest funded from beyond the mountains. Pairs: CPL-3, CPL-16,
CPL-18, CPL-8, plus WR-3/WR-8.)*
1. A razing or famine year drives the exodus (WR-8's escape share as refugee
   columns / the built hunger-exodus lines; the departure line names every
   destination BY NAME — BUILT).
2. POP-3's DEPARTURE MEMORY writes the diaspora ledger at BOTH ends: "the
   generation that left" at the origin's remnant, the old-country tie at
   every host (the wave's own state, banded, decaying generationally).
3. The diaspora prospers (upswing arcs, BUILT) and the tie WORKS: gratitude
   bonds + credit instruments flow home-ward (E1 machinery reversed by
   POP-3's kin-pull arm; FP-TRADE's venture instruments through the plan
   lane where the flow is commercial).
4. The ruin is a PRIVILEGED birth site (BUILT resettlement law) and the
   kin-pull arm makes the diaspora settlements the donors: "New Thornwall,
   raised on the old stones" (BUILT receipt) — funded, this time, by the
   grandsons.
5. And the grudge rode with the silver: departure memory feeds the
   revanchism-shaped claims — WR-3's lineage_claim from the refounded child,
   or the vengeance license an heir may collect (R2, WR-8) — the return that
   is also a reckoning, every link receipted.
**COUNTERFORCE:** assimilation — traditions ADOPTION at the host (BUILT)
converts the tie into belonging on the same influx evidence; the diaspora
that stops remembering funds nothing, and POP-3's decay law says exactly
when.

### Story 5 — THE FAMINE SPECULATOR WHO BUYS A BISHOPRIC
*(the Fugger loan behind Albrecht's pallium: the grain corner that financed
a mitre. Pairs: CPL-9, CPL-7, CPL-15, CPL-20.)*
1. SP-2's believed scarcity diverges from truth ahead of the hungry gap; the
   HOUSE corners — buys through ventures while the say is still cheap
   (FP-TRADE's cornering consumer; every purchase a receipted venture).
2. The gap arrives; scarcity bands spike; the house's FORTUNE ending fires —
   and moral drift PRICES the profiteering (FP-TRADE crux, spine §3): the
   fortune carries a conscience stain the tolerance/moral machinery reads
   (institutionTolerance's abhorrence idiom, BUILT shape).
3. The house buys standing: its endowment backs a candidate in the
   temple_authority contest (BUILT contest, tithe_rights prize) — WF-7's
   temple wealth band receives what the corner earned.
4. The bought bishop is a COMPROMISED minister: the corruption web's covert
   mark with the house as patron (BUILT covert seam; directionBias optimizes
   the patron's books, corruptionWeb.js:506).
5. Exposure risk runs the organic clock (BUILT per-tick odds): on reveal,
   CLERGY_REVEALED_SHARPEN (religionLegitimacy.js:127-132, BUILT) makes the
   scandal bite the creed; the commons read seated corruption at 0.35 weight
   (commonsVoiceKernel, BUILT) and the ladder climbs; INT-3's causal join
   cites the standing exposure on whatever falls.
**COUNTERFORCE:** the temple that refuses the tainted endowment — the
alignment gate reading the SAME provenance the stain rides; and the honest
corner-breaker: arrivals (CPL-9's independent witnesses) collapsing the
believed scarcity before the corner closes.

### Story 6 — THE BORDER TOWN WHOSE GOLD RUSH STARTS A WAR NOBODY WANTED
*(the Black Hills: gold rumored on treaty land, a rush no court ordered, a
war no court priced. Pairs: CPL-16, CPL-4, CPL-3, CPL-5, CPL-1.)*
1. A resource_strike satellite seeds at the border (BUILT provenance,
   SEED_STRIKE_BONUS).
2. The strike EXAGGERATES in the telling with zero new machinery: per-hop
   magnitude drift ±1 (degradeTelling, rumorNetwork.js:472-507, BUILT) — by
   the third relay the creek is a motherlode (J-CPL-11).
3. SP-2's believed conditions inflate the destination's pull; POP-1's rush
   converges columns from BOTH realms (believedMigrationEnabled); capacity
   truth strands the surplus — unplaced receipts, disappointment writes, the
   camps swell (crowding→disease lift, sprawl→raid lift, BUILT continuous
   couplings).
4. Each court reads the strike through ITS beliefs: mistaken-court reads
   (the perceivedScarcityOf idiom, `mistaken` receipt clause, BUILT) and —
   where a rush crosses a standing pact's ground — the treaty_default casus
   (BUILT) joins resource_pressure and opportunism; an evil believed-ally
   styles the reports hotter (M9b, BUILT); "X marches on a misjudgment"
   (belief_misjudgment, BUILT) is the war's own receipt confessing the
   epistemics.
5. The war nobody wanted opens through the one opener on believed wealth —
   and DISSOLVES the honest way: the bust's letters home (POP-1) correct the
   belief, Blainey convergence (BUILT) grinds the reckonings together, and
   WR-1's opportunism dissolution fires when the victim stops being
   believed-rich; the deciding-term receipt says which force ended it.
**COUNTERFORCE:** the letters, at every step — arrivals are independent
witnesses against the inflated telling (the same subject family, the same
belief laws); a well-connected border (short hop counts, high stamps) never
inflates far enough to march on.

---

## §6 THE CROSS-WIRE WAVES (the only machinery this volume builds — the
## couplings themselves land in their owning volumes' waves. Dependency
## order; each: one commit, focused gates per slice, full gate at wave end,
## ledger row; DARK per the war volume's dormancy law where a flag exists;
## instrument-side waves follow WR-9's precedent — requirements 4/5/10 bind
## trivially and are stated as such.)

### CW-0 — THE COUPLING REGISTRY + WALKER (no flag — structural prevention;
### the WR-9 instrument-wave precedent; historical archetype: the customs
### rolls — trade existed before the rolls, but only the rolls made smuggling
### a crime you could see)
**Scope:** a machine-readable registry module (certification family; pure
data + pure reads, no state, no writer) enumerating every DESIGNED coupling:
`{ pairId (CPL-1..21), direction, read (module.export), receiptField,
counterforce (module.export), flags[], owningVolume, owningWave,
intendedDesk }`. Three walkers:
- **The inclusion ratchet (J-CPL-2):** an import-graph scan over the seven
  layers' module families — a cross-layer read without a registry row reds;
  the DECLARED-EMPTY directions are enforced as the ABSENCE of rows (never a
  forbidden-list — the polarity hazard class, §1c). The scan's positive
  control proves it FINDS a known cross-layer read (guard-the-guard, the K3
  idiom).
- **The receipt-field walker:** every registry row's receiptField lands on
  receipts emitted under its flags (fixture-sampled, seeded non-empty per
  the vacuous-absence law).
- **The desk walker:** every registry row's kinds route to intendedDesk in
  heraldRouting — the belief_misjudgment-under-faith misfile class becomes
  walker-visible estate-wide (the row for that beat records its CURRENT desk
  with a `deskDisputed: true` marker until J-CPL-10's referral resolves).
**Also in scope:** the prose-numerics push-indirection escape (interior
survey: relationshipMemory.js:300-302 floats escape the walker via
out.push on a non-prose-named array) — CW-0 extends the prose-numerics
walk to pushed arrays that feed prose-named returns, and the baseline
ratchets. **Model:** no world state; registry + tests only. **Lifecycle:**
nothing persists in saves. **Dossier round-trip:** none (instrument);
CW-2 carries the crown law for this volume. **Pins:** the ratchet's
positive control; a registry row whose read does not exist reds at import
time (writer/reader drift caught at the map itself); empty-direction rows
are structurally impossible (empties are absences). **Bands:** none.

### CW-1 — THE CASCADE GOVERNOR (flag `cascadeGovernorEnabled`; spine req.
### 12 made structural for cross-layer chains; historical archetype: the
### newspaper edition — the world does not stop happening, but the paper
### chooses what a morning can carry)
**Scope:** DISPLAY-SIDE composition only (J-CPL-4: pacing edits the paper,
never the world — no engine receipt is ever suppressed or unminted). At
Herald composition, a CASCADE is detected: N ≥ depth-band receipts within a
window sharing a causal ancestor (sourceEventId/causes[] chains — C-LAW-7's
continuity is the substrate) whose links cross ≥3 layers. The cascade is
BRAIDED: one story item at the cascade's top significance carrying the chain
as its body (the cause-walk rendered forward, in the house voice), while
member beats are pacing-damped to routine WITHOUT losing their ids or their
feed presence (damped, never dropped — the two-timescale echo: the fast
beats individually, the slow verdict braided).
**Force/counterforce:** flood vs silence off the same chain evidence — the
significance floor is the counterforce: a member beat of headline class
(major) is NEVER damped (the razing inside a cascade still leads the page).
**Belief posture:** the braid renders only what its audience may see —
covert links truncate for players (the CW-2 rule); the DM's braid is whole.
**Named actors:** the braid names every named actor its member receipts
name — no summarization ever drops a name the address law carried.
**Clock:** window and dwell in INTERVAL_WEEKS-denominated bands; a cascade
braids when its window CLOSES, one edition late by design (the paper
reports; it does not prophesy).
**Receipts:** the braided item is itself a receipt (id-carrying, full
address chain across every member settlement, typed action `cascade`,
reason = the chain).
**Pins (negative hardest):** two unrelated same-window misfortunes DO NOT
braid (no false causality — the ancestor join is identity, never
similarity); a chain of 2 layers never braids (depth floor); dark ⇒
byte-identical feed (dormancy golden); the damped members remain
individually reachable in the feed (nothing dropped).
**Bands:** window length, depth threshold (default ≥3 layers), member cap,
braid significance derivation. **Lifecycle:** display-side; no save state.
**Dossier round-trip:** the braided story lands on EVERY named settlement's
page — the DM finds the whole chain where any of its victims live.
**Endings vocabulary:** none of its own (it carries the members').

### CW-2 — THE CAUSE-WALK SURFACE (no flag — a read-only DM surface over
### persisted receipts; the crown law made a page; historical archetype:
### the coroner's inquest — the verdict is only as good as the chain of
### custody)
**Scope:** from any receipt, condition, or coupling receipt-field on a town
page, walk BACKWARD across provenance (sourceEventId / causes[] / §1b-B
receipt fields / the registry's receiptField map) up to a banded depth,
across every layer the cause crossed, rendered glance → sentence → table
(LEGIBILITY LAW). Pure read over persisted state and bounded history rings —
no new state, no engine change; where the chain leaves the retention horizon
(pulseHistory 80 / wizardNews 240 / turningPoints 24 — interior survey), the
walk says so honestly: "the trail runs past living memory," never a
fabricated link.
**Audience projection (J-CPL-5):** player-safe walks FAIL CLOSED at covert
seams — the walk truncates with "the trail goes cold" (no covert link's
existence leaked, not even as a stub count); the DM's walk passes through
under includeCovert/includeGroundTruth.
**Belief posture:** the walk renders what RECORDS say, including records of
being wrong — a belief_misjudgment link renders as the misjudgment it was
(the walk never retro-corrects history to truth; dramatic irony is the
product).
**Named actors:** every link's named persons render with their facet bands
(H1 planes) — the walk is where the estate's persons-beat-systems stories
become READABLE as chains.
**Clock:** instant read; depth banded; no engine cost (display-side,
lazy-leaf per the ratchet laws).
**Pins (negative hardest):** THE SIX STORIES OF §5 ARE THE ACCEPTANCE
FIXTURES — each story's chain, seeded on a real fixture with its owning
waves lit, renders end to end or CW-2 (and the couplings it audits) has
failed; the trail-goes-cold truncation leaks nothing (a player walk over a
covert chain is byte-identical to a walk over a chain that genuinely ends
there); the horizon honesty line renders where retention actually cut the
chain (seeded by aging a fixture past a ring cap).
**Bands:** walk depth cap, rendered-link cap per page. **Lifecycle:** none.
**Dossier round-trip:** this wave IS the dossier round-trip for the whole
coupling program — the mandatory "where does a DM see this" answer for
every coupling in §4 that lacks a dedicated panel is: on the cause-walk,
from the receipt the coupling landed.

### CW-3 — THE COUPLING MEASURE (no flag — WR-9's sibling for the coupling
### estate; the program's acceptance harness; historical archetype: the
### assay office — the rush is rumor until the ore is weighed)
**Scope:** three instruments, all soak-side, none engine-side:
- **The differential harness:** paired lit/dark same-seed soaks per coupling
  flag family, compared over the divergence series — the instrument the
  certification estate already NAMES as the honest gap for distance-priced
  news (subsystemRowsRegen.js:59, survey-verified); built once here, pointed
  at every coupling family (POP-1's belief arm, IN-2's lure, WF-7's tithe,
  the governor itself).
- **Coupling aliveness floors:** every CW-0 registry row must FIRE at or
  above a banded floor in the owner-signed lit soak, or the coupling is
  decoration and reds its row (the WR-9 endings-mix criterion generalized:
  a coupling nobody can observe is not a coupling).
- **Cascade envelopes:** chain-depth distribution over the lit soak — most
  chains shallow, some deep, none unbounded (a chain still growing at the
  soak horizon reds exactly as the year-300 war does); the six stories'
  chain SHAPES each observed at least once across the seed family, or the
  drama the program promised is vacant (measured, not asserted).
**Pins:** every envelope carries a mutant negative control (the estate's
law); the differential harness proves a KNOWN coupling diverges lit-vs-dark
before it certifies an unknown one (guard-the-guard). **Bands:** floors,
depth envelope shape, divergence minima. **Lifecycle:** receipts only.
**This wave closes the program: the coupling map is DONE when these
envelopes hold on the owner-signed lit soak, and not before.**

---

## §7 JUDGMENT BLOCKS (the drafting chair's rulings under delegation —
## vetoable here; an implementer NEVER re-rules these silently)

- **J-CPL-1 (ownership):** every designed coupling has exactly ONE owning
  wave in ONE volume; this volume builds only CW-0..CW-3. VETO builds
  couplings "in the seam" and accepts unowned, untested reads.
- **J-CPL-2 (the registry is an inclusion ratchet):** cross-layer reads
  require a registry row; declared-empty directions are enforced as absent
  rows, never as a forbidden-list (the polarity hazard class — a blacklist
  misses everything it never imagined). VETO ships the forbidden-list and
  accepts the class.
- **J-CPL-3 (the loud-fact exemption, C-LAW-5):** public facts (razings,
  altars, signed treaties' existence, armies in the field) may be read at
  truth once news latency is paid; secrets ride belief always. This
  generalizes J-WR-7's mint-on-the-public-fact discipline estate-wide. VETO
  routes even loud facts through belief (full-epistemic) — priced as a much
  larger build with its own owner ruling.
- **J-CPL-4 (the governor edits the paper, never the world):** CW-1 is
  display-side composition; no engine receipt is suppressed, dropped, or
  unminted; damped members keep ids and feed presence. VETO's engine-side
  event suppression is a determinism and honesty hazard both.
- **J-CPL-5 (the walk fails closed):** CW-2's player walks truncate at
  covert seams leaking nothing — byte-identical to a genuinely-ended chain.
  VETO (stub counts, "N hidden links" hints) leaks covert structure.
- **J-CPL-6 (no conversion-mandate term):** SP-3's faith family list
  (missionary access, shared-rite compacts, pilgrimage rights) is CLOSED;
  the legacy design-doc's "conversion mandate" is dropped — access is
  signable, conviction is not (Law One). Recorded here because the coupling
  map is where the old doc's wider list would otherwise leak back in
  through a cross-reference. Elaborates spine SP-3; vetoable at the spine's
  level only.
- **J-CPL-7 (no faction property in v1):** houses hold BOOKS and
  instruments, never routes or institutions as owned assets; entrepot tolls
  stay earned-centrality derivations with their four brakes. A property
  system is new capability — owner-gated. VETO consciously opens the
  ownership build.
- **J-CPL-8 (the forged-instrument boundary):** lies move beliefs about
  states; no lie mints, alters, or counterfeits a ledger artifact (treaty,
  obligation, order, intent). peaceTerms.js stays the single terms writer
  with no belief-side shadow. Crossing this line (the Donation of
  Constantine build) needs its own owner ruling on how far a lie can mint
  paper. Sibling of J-WR-7's deferred false-license.
- **J-CPL-9 (no domestic propaganda in v1):** the seat never lies to its
  own commons; the crowd reads true local state. A seat-to-crowd deception
  lane needs its own owner ruling AND its own counterforce before it
  exists. VETO opens it now, with the counterforce named.
- **J-CPL-10 (the desk-misfile referral):** belief_misjudgment's routing to
  the faith desk (heraldRouting.js:118) is either ruled intentional or
  moved when IN-5/FP-GRAMMAR's routing passes land; CW-0's registry carries
  it `deskDisputed: true` until then. The walker pins the CURRENT desk so
  moving it is a conscious act (the built discipline, honored).
- **J-CPL-11 (exaggeration is the carrier's, not new machinery):** the gold
  rush's inflation IS degradeTelling's per-hop magnitude drift — no
  dedicated exaggeration parameter, no boosterism actor. VETO builds a
  bespoke inflation knob and accepts a second telephone.
- **J-CPL-12 (the pilgrim returns):** pilgrimages are errands with
  mandatory return legs (K.5 generalized), never migrations; a pilgrimage
  that becomes a permanent move is out of v1. VETO opens pilgrim-settling
  with its own demographic accounting.

## §8 THE TUNING SURFACE (owner-signed at the lit soak, per THE PROMISE)
This volume's own bands, gathered: CW-1 window · depth threshold · member
cap · braid significance derivation · CW-2 walk depth + rendered-link caps ·
CW-3 aliveness floors · chain-depth envelope shape · divergence minima.
Everything else in §4 points at bands owned and gathered by the owning
volumes' §7 tables (C-LAW-2's corollary: the coupling map holds no band a
volume owns). Coupling LATENCIES are not bands — they are the carriers'
physics (C-LAW-4) and are never tuned here.

## §9 HERALD + LEGIBILITY CONTRACT (the sentences the coupled world must be
## able to say — acceptance criteria, not decoration; every one carries id +
## full address chain + typed action + named settlements + recorded reason)
- "Grain is dear in the east, they say — and the say was worth more than
  the grain." (CPL-9)
- "The house of Marrow could not pay what it never owed." (story 3)
- "The priests read the famine as wrath; the granaries emptied all the
  same." (CPL-13)
- "The road to the shrine ran red, and the faithful called it war."
  (story 2)
- "They left in the famine year; their grandsons' silver raised the walls."
  (story 4)
- "He cornered the grain in the hungry season, and bought a mitre with the
  profit." (story 5)
- "There was gold in the river, men said. There was war in the spring."
  (story 6)
- "The tithe was disputed at law; ten years on, the altars are strangers to
  each other." (story 1)
- "Sworn under the old Margrave; broken by the new." (CPL-21)
- "The court knew, and sat still." (CPL-20)
- "One misfortune, told once, with its whole tail." (CW-1's promise)
- "Ask the town why, and the town can answer — or tell you honestly that
  the trail runs past living memory." (CW-2's promise)

## §10 SEQUENCING + DISCIPLINE + THE COORDINATION REGISTER

**Sequencing (spine §5, binding):** per-pair couplings land INSIDE their
owning volumes' waves, in the spine's program order (SP → GRAMMAR → INFO →
TRADE → FAITH → POP → INTERIOR-completions); the CROSS-WIRES (CW-0..CW-3)
land LAST — CW-0 may land early (it is pure prevention and its registry
grows with each volume's waves), CW-1/CW-2 need C-LAW-7's provenance
discipline landed across the volumes to have chains to braid and walk, and
CW-3 closes the whole program. Everything dark, one commit per wave, full
gate per wave, ledger rows, per the war volume's §10 implementer protocol
VERBATIM. The owner-held boundary is unchanged: no flag lights, no soak
runs, no band ratifies outside the owner-signed schedule.

**The coordination register (conflicts and dependencies found while drawing
this map — each is a bug to report per the spine, reported here):**
1. **The IN- prefix collision:** DESIGN_FP_INFORMATION.md numbers its waves
   IN-0..IN-6 and DESIGN_FP_INTERIOR.md numbers its waves IN-1..IN-8. Bare
   "IN-3" is ambiguous across the program. This volume uses INT- aliases
   for the interior volume throughout; the two volumes should reconcile
   (chair's suggested resolution: interior renumbers to INT-*, matching
   this map — vetoable).
2. **The WR-10 trade-rights dependency:** WR-10's bundle spec names trade
   rights (exclusivity / market access / toll exemption) as stackable term
   families; the trade survey verified all three ABSENT from the tree (zero
   hits). SP-3/FP-TRADE must mint those term families BEFORE WR-10's bundle
   can stack them — a lit-precondition the war volume's §3 table does not
   yet carry. Report to the chair for a war-volume amendment row.
3. **The sacred_claim boundary note:** sacredClaim reads both towns'
   embedded patron snapshots — a truth-read ruled LEGAL under J-CPL-3's
   loud-fact exemption (altars are public). Recorded so nobody "fixes" it
   into a belief read without a ruling, and nobody cites it as precedent
   for reading SECRETS at truth.
4. **The permit-table discrepancy** (populations survey: the wired P2
   destination gate is stricter than the authored failing:destination=true
   row) is owned by POP-5b's reconciliation (J-POP-11 per that volume);
   this map's CPL-17 depends on the reconciled table and builds nothing
   until it lands.
5. **The prose-numerics push-indirection escape** (interior survey) is
   homed in CW-0's scope rather than any interior wave — it is a
   walker-of-walkers repair, which is this volume's trade.

**In one sentence:** the seven layers already touch in more places than any
one survey suspected — but almost every touch today is either truth leaking
across a boundary or a number moving without a sentence; this map names the
owner of every touch, prices every boundary crossing in belief and time,
declares the silences that are decisions, and builds the four pieces of
machinery — the rolls, the edition, the inquest, and the assay — that make
coupling itself visible, tellable, and measurable.




