# DESIGN — FP-INTERIOR: THE SEAT, THE COURT, AND THE CROWD (the interior completions volume)

## Fable 5 architecture, 2026-08-02. One of the six program volumes bound by
## DESIGN_FP_SPINE.md (the constitution; where this volume conflicts with it, the
## spine wins and the conflict is a bug to report). The interior — books + memory —
## is the DRIVER of the other six layers: every war opened, pact signed, route
## chartered, rite adopted, and column departed is chosen by a seat reading two
## ledgers under a crowd that remembers. War taught the estate how to end things;
## this volume teaches the estate WHO decides, WHAT the deciding costs at home, and
## HOW the home remembers — and it closes TWO of the survey's three named holes
## (the two-books mechanism, the memory-clock seam) and DECLARES the third
## deferred: dispositionStats' permanence (the disposition ratchet) is cured by
## WR-2's channel extension — a hard precondition of §10.1, never a wave here
## [CORRECTED 2026-08-02 (fp-audit)] — plus the drama gaps its own measurement
## survey proved (the silent causal join, the unattributed grudge, the flat
## middle). IMPLEMENTATION IS ASSIGNED TO
## THE EXTERNAL IMPLEMENTER (Sol); architecture and validation by Fable. This
## document is self-contained given its two named companions: an implementer with
## zero session context, this document, DESIGN_FP_SPINE.md, and
## DESIGN_WAR_RULINGS_ARCHITECTURE.md can build every wave.

**Status: ARCHITECTURE. Nothing here is scheduled until the owner sequences it (spine
§5: the interior completions build LAST of the six programs, after POP, before the
COUPLINGS cross-wires — because every other program lands consumers this volume's
waves then wire to the seat). Every wave dark, every band authored, every claim
receipted. The judgment blocks in §7 are the chair's rulings under delegation —
vetoable there. The §0 settled rulings are spine law — elaborated here, never
re-opened.**

**Reading order for the implementer:** DESIGN_FP_SPINE.md (the constitution — its
twelve requirements bind every mechanism below) → this document top to bottom →
DESIGN_WAR_RULINGS_ARCHITECTURE.md §5 WR-5 (the two-books spec this volume lands and
generalizes; its §10 implementer protocol binds here VERBATIM) →
DESIGN_REALM_DIRECTIVES.md amendments G/G2/H/D (the owner law behind WR-5; where this
document and an amendment disagree, the amendment wins and the disagreement is a bug
to report) → DESIGN_FP_COUPLINGS.md (the coupling walk §6 points into).

**[CORRECTED 2026-08-02 (fp-audit)] NAMESPACE RENUMBER (chair ruling R4):** this
volume's waves and judgment blocks are renumbered IN-\* → INT-\* and J-IN-\* →
J-INT-\* — the corpus audit found FP-INFORMATION and FP-INTERIOR both minting
IN-\*/J-IN-\* ids, making vetoes and STOP-and-reports unresolvable.
DESIGN_FP_COUPLINGS.md already uses the INT- aliases; any external citation of an
interior `IN-n`/`J-IN-n` resolves to `INT-n`/`J-INT-n` here. INFORMATION's
judgment blocks renumber to J-INF-\* in their own volume.

---

## §0 THE SETTLED RULINGS (spine §3 FP-INTERIOR — binding; this volume elaborates,
## never re-opens)

1. **G'S TWO BOOKS LAND** — WR-5's spec, built against the three substrates this
   volume's survey CONFIRMED ready (momentum's legitimacy-fragility cliff, the bloc
   decision loading, the corruption web's patron bias — §2 row 10). Homed: INT-1.
2. **THE INTERIOR VETO COMPLETES** — H's overturn: the war/pact decision as the
   organizing grievance; pressure exists, replacement exists, the CAUSAL JOIN lands
   with its receipt. Homed: INT-3.
3. **THE KING-WHO-PAID ARC GAINS ITS NARRATED MIDDLE** — strain→coup causality named
   in one chain; the survey's PARTIAL verdict (every beat narrated, the join silent,
   the strongest wire flag-dark) cured. Homed: INT-4.
4. **FACTION FOREIGN POSITIONS LIGHT** — the dark bloc-grain substrate
   (settlementPolitics.js, flag `settlementPoliticsEnabled`) wired to consequences,
   projected to the dossier, registered for the owner's lighting order (the flag
   itself lights ONLY at an owner-signed soak, like every flag in the estate).
   Homed: INT-2.
5. **LEGITIMACY'S CERTIFICATION ROW** — the single most load-bearing interior scalar
   gains a standalone certified, soak-measured row (today it is proxy-observed only).
   Homed: INT-7.
6. **THE MEMORY DECAY SEAM CLOSES** — the documented D5 seam (the incident half-life
   is not lifespan-band-scaled; an undying town's derived memory decays on the human
   clock) gets its wiring, dark. Homed: INT-5.
7. **DELIBERATE FORGIVENESS** — burying a grudge as PRICED POLICY: reconciliation as
   a decision, not only clock decay; the counterforce (digging it up) priced off the
   same record. Homed: INT-6.

---

## §1 THE LAWS THAT BIND EVERY WAVE

### 1a Constitutional (the engine's standing laws — restated from the war volume §1a,
### which binds here unchanged)
1. **Same-seed byte identity.** Same seed and inputs ⇒ byte-identical output, forever.
2. **Dormancy.** Every wave ships DARK behind a virtual flag (absent from
   DEFAULT_SIMULATION_RULES); dark ⇒ byte-identical, golden-pinned BEFORE wiring.
3. **Seeded purity.** No Date.now, no Math.random, no locale reads, no Object-key
   iteration on user data without codepoint sort, no transcendentals in engine paths.
4. **Monotone ratchets.** Size/any-cast/first-paint baselines only shrink; new engine
   code is a lazy leaf; zero new any-casts. This volume RETIRES two frozen ratchet
   rows (§5 INT-8) — the baseline follows the debt DOWN.
5. **Receipts carry enforcement.** Every news entry carries `id`, full address chain,
   typed action, settlements BY NAME, recorded reason (the id-less drop class voids
   entries at BOTH normalizeEntry and the audit sink).
6. **Premium isolation + audience projection.** includeCovert/includeGroundTruth on
   every new projection; free surfaces never see DM truth.
7. **Finite semantics.** Every vocabulary here is CLOSED and banded; no float reaches
   a surface (this volume CURES two standing float leaks rather than adding any).

### 1b Interior-specific laws (each is spine law or an owner ruling; violations are
### design defects)
- **THE DOMESTIC-TRUTH BOUNDARY (Law One applied to the interior):** a court
  legitimately reads its OWN state — its granary, its legitimacy, its factions' ends.
  Every CROSS-BORDER quantity in any interior read (the rival's triumph in a books
  comparison, the counterpart's response to a burial, the émigré's tale of home)
  routes through belief machinery — K3's structural enforcement (import pin + token
  scan + guard-the-guard) applies to every new module this volume adds that composes
  a cross-border term. And Law One's deeper cut: legitimacy IS ALREADY a belief stock
  — the crowd's confidence in the seat, not a measurement of the seat's virtue. This
  volume never adds a "true worthiness" anywhere; the engine models courts and
  crowds, never the right to rule.
- **THE VETO IS REPLACEMENT, NEVER A ZERO (H's shape, survey-confirmed):** the
  interior PRICES, PRESSURES, and REPLACES — it never zeroes an exterior verb.
  blocDecisionFactor stays clamped (1 ± DECISION_LOAD_SPAN,
  settlementPolitics.js:615-616); the coup's war-sentiment weight stays modest (0.22,
  coup.js:44-46 — "a sour war tilts the seat's footing, it does not by itself topple
  a secure ruler"). The interior's ONLY hard veto remains the TABLE's approval queue.
  A wave that lets a faction zero a move directly is a defect; the faction's road to
  the decision runs through the seat — take the seat, then decide.
- **SUPPRESSION, NEVER DELETION (§1b-B's idiom, extended to memory):** no interior
  mechanism ever deletes a ledger row to change behavior. The burial (INT-6)
  suppresses reads with a receipt naming the burial; the record stays, auditable and
  dig-uppable. Deleting memory is the lifecycle bug class this estate is most bitten
  by, wearing a feature's clothing.
- **ONE WRITER PER STOCK (standing house law, restated for the two stocks this
  volume touches):** legitimacy's hits flow through the existing typed-hit writers
  only (no new direct writes — J-INT-3 rules the tribute case explicitly);
  relationship/incident records keep their existing single writers; every new record
  in §4 names its one writer.
- **E3 GENERALIZED — POSITIONS ARE PRESSURE, NEVER SELECTORS:** a bloc's foreign
  position loads weights on verbs the chooser already deliberates; it never
  manufactures a target, a grievance, or a casus. (The revanchist bloc PUSHES the
  war party's bar down; the casus still comes from the reasons layer or it does not
  exist.)
- **NEVER-KILL, NEVER-RESOLVE-FATES (product scope law, absolute):** the émigré arc
  (INT-3b) ends in {returned, faded, reconciled} — never death; no named character's
  fate is resolved by the engine, ever.
- **THE TWO-TIMESCALE ECHO (spine req. 9, this program's instantiation):** the
  interior's fast layer is the RECEIPT (the counsel given, the decree read aloud,
  the crossing announced); its slow verdict is the SEAT'S FATE (the coup verdict
  seasons later, the grudge that stays buried or does not, the heir's choice a
  generation on). Every wave below names both.

### 1c Recorded hazards that WILL bite these waves (each has bitten this program)
- **JSON-alias trap:** `factions[].members[]` ARE the `npcs[]` objects in memory —
  every bloc/burial/émigré fixture JSON-round-trips before asserting.
- **Writer/reader payload-spelling drift:** every new record gets a pin that boots
  the REAL writer and reads through the REAL reader (the `settlement` vs `snapshot`
  lesson).
- **The unconditional-container observability trap (this survey's own finding):**
  `relationshipStates` is written unconditionally every pulse, so its census count is
  edge count, never health — certified UNUSABLE as a gate. Every new record in §4 is
  drop-when-empty so v5 absence-is-evidence observability holds; a new unconditional
  container is a defect.
- **The push-indirection prose leak (this survey's own finding):** the prose-numerics
  walker follows returns of prose-named functions but not strings traveling through
  `out.push(...)` on a non-prose-named array (proseNumericsWalk.js:5-7,20-25) — the
  postureReasons float leak escaped it. INT-8 cures the instance AND the walker's
  blind spot (structural prevention, not just the fix).
- **Vacuous absence pins:** seed non-empty state before pinning absence (a
  `toHaveLength(0)` against a harness that defaults the producing state empty proves
  nothing) — the burial-suppression and veto-negative pins are the exposed cases here.
- **Unreachable predicate conjunctions:** the burial gate, the dig-up gate, and the
  organizing-grievance gate are ANDed predicates — each gets a reachability pin
  proving the TRUE branch fires in real generated corpora.
- **Stream theft:** any seeded draw this volume adds is keyed per entity
  (`emigre:<npcId>`, `burial:<pairKey>`), draw-accounted per the wave-E instrument.
- **Id-less news drop:** every `newsEntries.push` site carries `id`; every new kind
  registers in WHAT_PHRASES + heraldRouting or the totality walkers red.

---

## §2 SUBSTRATE CENSUS (verified against the tree 2026-08-02 by three read-only
## surveys with file:line receipts — interior agency/inheritance, interior
## mechanics, interior measurement/drama; minifold @ 38f81d05. Re-verify anything
## you build on — live code outranks this table. Anything asserted here beyond a
## survey finding is marked VERIFY-AT-BUILD. THE CENSUS COVERS ENGINE SUBSTRATE
## ONLY [CORRECTED 2026-08-02 (fp-audit)]: the three surveys' receipts live
## exclusively under src/domain, src/generators, tests and scripts/audit — ZERO
## UI evidence; every §5 dossier surface that does not quote a component
## file:line is therefore VERIFY-AT-BUILD by construction.)

| # | Substrate | Where | State |
|---|---|---|---|
| 1 | Legitimacy: persisted 0-100 stock, bands Endorsed ≥75 ×1.30 → Crisis <30 ×0.60, cause-reseeded on every transfer (coup 38 / conquest 28 / election 56 / succession 48 / appointment 45), moved ONLY by typed hits (assize ±2, commons rung dips 0-3, ladder norm-tax 0.12, upswing dividend +4, calamity/occupation/canon deltas), NO passive decay found | rulingPower.js:222-257; factionDynamics.js:146 (generation source); assizeKernel.js:77-96; commonsVoiceKernel.js:55-63; npcLadderKernel.js:815; upswingKernel.js:112; calamityKernel.js:341-360; timeProgression.js:159-168 | BUILT — memory that does not fade, only gets spent or earned |
| 2 | Legitimacy readers end to end: fracture ×1.6/<30, insurgency null ≥75, rebellion null ≥75, coupSpawnGate needs Contested-or-worse, incumbent coup weight = power × govMultiplier, legitimacyFragility01 cliff term | stressorGates.js:378-389, 539-545, 580-585, 732-747; rulingPowerCoup.js:85-124; factionCompetition.js:610,858; momentum.js:565-573 | BUILT — the coup/unrest lane is legitimacy-gated end to end |
| 3 | Two contest lanes, coupled: faction coup (verdict recomputed from LIVE state; locked faction ⇒ proposal; pHold clamp [0.1,0.9]) + NPC ladder (TURN_MARGIN 1.15, CHALLENGE_RATE 0.05, 104-week interregnum, D-4 contested goals, no-death law); ladderEffectivePowerFactor folds ladder churn into coup weight | coup.js:99-226; rulingPowerCoup.js:147-204; npcLadderChallenge.js:1-40; npcLadderContest.js:1-35 | BUILT |
| 4 | Seat capture ×3 paths: criminal ladder, government challenge, interior blocs — all writing through transferRulingPower (winner +6, losers get grudge edges, previousGovernments cap 6) | factionCapture.js:1-30; factionCompetition.js:610; settlementPolitics.js:1-120; rulingPower.js:313-380 | BUILT (blocs DARK) |
| 5 | Bloc foreign positions: blocDecisionFactor loads `deploy` +0.4 (seats bloc) / −0.5 (commerce), `sue_for_peace` +0.5 (commerce) / +0.4 (survival) / −0.5 (strain); factionRevanchism01 = the treaty-LOSER's measurably-risen war appetite ("the term-burdened faction becomes the war party"); survival blocs born of sieges, dissolve when the siege lifts; MAX 3 blocs, formation floor 0.55, warm-tie boost 1.4, rivalry floor 0.12, MIN_DWELL 8 ticks, clamp 1 ± DECISION_LOAD_SPAN | settlementPolitics.js:609, ~620, 615-616, 489-513, 430; consumed at settlementStrategy.js:1044 | BUILT, DARK — `settlementPoliticsEnabled` composed with `factionCompetitionEnabled`; no DEFAULT_SIMULATION_RULES entry |
| 6 | The domestic audience, four LIVE channels: war exhaustion tilts coup verdicts (weight 0.22, `warDispositionEnabled`, lit in full_simulation); reinforcement costs bite public_legitimacy; climb-downs land legitimacy hits + credibility charges (organic + DM-forced twins); legitimacy_hunger motivates war from domestic weakness; intervention legitimacy pricing | coup.js:113-114 + disposition.js:223; warDeployment.js:~2038; momentum.js:1255-1290 + realmVerbExecution.js:503-519; warReasons.js:489-500; convergence.js:397-412, 117 | BUILT — the loop is closed in both directions today |
| 7 | Succession: cause-typed transfers; clean-identity successor on corruption ousting; V-7 heirs-lite (heir inherits predecessor bonds AND grudges at 0.4, marked `inherited:true`, heir's own ties take precedence); 104-week interregnum | rulingPower.js:246-257; successorNpc.js:1-55; npcLadderState.js:69-72, 473-550, 508-530; wired npcLadderKernel.js:605; npcLadderChallenge.js:38-39 | BUILT — settlement-grain memory persists UNTOUCHED across succession; NPC-seat memory inherits dampened; NOTHING re-reads a standing decision |
| 8 | Ruler temper reads ×3: W0 court-aggregate alignment (live, never persisted), leader-temperament momentum cliff (proud 0.7 / stubborn 0.8 / fanatical 0.85 / humble −0.6), coup-coercion government tilt; five closed reputation facets with no-read rungs | settlementAlignment.js:1-55; disposition.js:1-70; momentum.js:505-573; npcLedgerFacets.js:1-55 | BUILT |
| 9 | Unrest = the commons rung ladder (petition → gathering → riot band, LEGIT_FLOOR 55, rung-entry legitimacy dips) + legitimacy-gated stressors; NO persisted unrest scalar | commonsVoiceKernel.js:14-28, 55-63; settlement.schema.js:1051-1054 | BUILT — the popular ARC beyond the rungs is FP-POPULATIONS' program, riding this substrate |
| 10 | G's two books — the three CONFIRMED partial substrates: (i) the LEADER's temperament + legitimacy fragility + court consolidation move the reconsideration cliff (divergence by cliff, not by books); (ii) a ruling bloc loads decision weights toward member interests; (iii) corruptionWeb directionBias — a compromised seat already optimizes a foreign patron's books covertly | momentum.js:499-573; settlementPolitics.js:11-15; corruptionWeb.js:506 | SUBSTRATES BUILT; the MECHANISM verified ABSENT (no warCosts.js/books module in worldPulse as of the survey) — WR-5 designs it, INT-1 lands + generalizes it |
| 11 | relationshipMemory: incident half-life 4 ticks, lookback 24, one-event-scores-once dedup across five stores (outcome-id first), applied-marker honesty, 18 postures, per-pulse persisted posture blob; THE D5 SEAM documented at :14-23 — the lifespan band scales grievance mean-reversion but NOT the incident half-life, AND NOT the 24-tick hard lookback: `relationshipMemoryWeight` returns 0 for any row older than `maxLookbackTicks` BEFORE the half-life applies (:127), and `memoryEntry` drops the zero-weight row entirely (:136) — the cutoff routes through collectMemories to EVERY store, turningPoints included; scaling the half-life alone reads nothing old [CORRECTED 2026-08-02 (fp-audit)] | relationshipMemory.js:12-13, 14-23, 116-117, 127, 136, 149-248, 279-294, 438-477 | BUILT; seam deliberately deferred, wiring point ready (relationshipMemoryWeight's {halfLifeTicks, maxLookbackTicks} options — BOTH threadable) — INT-5 closes it by scaling BOTH constants |
| 12 | Grievance/revanchism at three grains with distinct clocks: fixation read (0.65 × resentment + 0.35 × decayed memoryScore; wounds ≥8 ticks × 0.35 under resentment floor 0.2); settlement edges relax 12%/tick ÷ D5 band (undying = event-driven erosion only); faction pairs + NPC marks halve ~156w × band (stigma 312w) | grievanceRead.js:27-48, 74-106; relationshipEvolution.js:125, 202-215; factionPairLedger.js:42-49, 107, 120-157 | BUILT — revanchism is a READ over old typed wounds, not a stored stock |
| 13 | Obligations/gratitude on two clocks by design (obligation = the DEBT, 2%/tick under ONE decay owner; bond = the FRIENDSHIP, 156w band-scaled; credit default mints a 0.7 betrayal-class grievance = the casus seam; widow's-mite gratitude; predatory gifts deposit no friendship) | generosityReactions.js:27-110, 220-268; obligationDecay.js:12-22; gratitudeBonds.js:1-55 | BUILT |
| 14 | Reconciliation machinery, both signs, sticky: dark lane gift→debt_unpaid→tribute_extracted AND bright lane debt_unpaid→gift_forgiven, negativity bias (DARK_ENTER 0.35 < BRIGHT_ENTER 0.55), debtForgiven01 wired as the debt_forgiven peace mirror | reframeKernel.js:26-30, 133-140, 275; peaceReasons.js:242, 518 | BUILT, DARK (`reframeEnabled`; casus consumers additionally need `peaceCausalActive`) — NO deliberate forgive/amnesty verb exists (grep: none); INT-6 adds the deliberate arm |
| 15 | Deliberate realm levers today: SUE_FOR_PEACE + DECLARE_CASUS; REPUDIATE_TREATY (WR-0c: exact-pair, approval-routed, defaults every live term, feeds treaty_default casus) | realmVerbExecution.js:111, 311; realmManifest.js:252; treatyBreach.js header | BUILT — the burial (INT-6) is REPUDIATE_TREATY's bright twin in shape |
| 16 | dispositionStats: signed win/loss score clamped ±12, multiplier 1 ± 0.5, order-stable fold, read-last-tick/write-next-tick — and NO decay (permanent character ratchet) | dispositionLedger.js:1-53, 91-113; dispositionDeltas.js:1-27; pulseKernel.js:1340-1348 | BUILT; the decay cure is WR-2's (war volume) — this volume CONSUMES the channels, never touches the ledger |
| 17 | Kinship three layers: generation-frozen NPC ties read live by leaderTiePosture (warm ties multiply bloc formation to 1.4; a bitter enmity floors affinity to 0); V-7 heir edges at 0.4; settlement parentRef lineage (wave E) | settlement.relationships[]; settlementPolitics.js:310-360; npcStates[].rivalryTargets; npcLadderState.js:473-550 | BUILT — no NPC dynasty graph exists and none is planned |
| 18 | The chronicle is bounded rings: wizardNews 240, pulseHistory 80, turningPoints 24 (the ONLY durable pairwise archive), previousGovernments 6; server-side AI grounding pinned to headlines | chronicle.js:1-140; wizardNews.js:12; worldState.js:13, 492; relationshipState.js:136; rulingPower.js:267 | BUILT — anything older than ~80 pulses survives only via turning point, disposition ratchet, legitimacy reseed, or a still-decaying stock |
| 19 | Certification: coup certified inside the stressorsEnabled row with the a_coup_verdict_has_a_coup_behind_it invariant (soak measured 30/30 + 30/30, but 2/100 years-with-stressor-drama ON THE 4-SETTLEMENT CENTURY FIXTURE — the tempo finding; the fraction is fixture-bound, never portable bare [CORRECTED 2026-08-02 (fp-audit)]); faction certified 100/100; legitimacy has NO standalone row — proxy-observed via strategy_legitimacy, the coup lane's SINGLE legitimacy pressureKind (`coup_detat` declares pressureKinds ['legitimacy'] ONLY, birth 0.6 — the birth pressure is one-strain by construction, stressorsCore.js:239-240), faction legitimacy bands | subsystemRowsPeople.js:82-83, 175, 206-213; subsystemRowsBaseline.js:94, 146-197; stressorsCore.js coup_detat | BUILT/GAP — INT-7 lands the row |
| 20 | v5 envelopes: census total over worldState keys + one level into spatialLedgers; drop-when-empty ledgers (factionPairStates, obligations, npcLadder, interventions) are absence-is-evidence observable; relationshipStates is unconditional ⇒ structurally unobservable (certified as such); all completed release cases are v4 — the v5 interior channels are instruments-in-waiting | behavioral-observation.mjs:1001; factionPairLedger.js:146-155; obligationDecay.js:18-20; subsystemRowsPeople.js:228-233, 430-431 | BUILT |
| 21 | Voice defects, receipted: postureReasons interpolates `toFixed(2)` floats into persisted reader prose, escaping the prose-numerics walker via push-indirection (gate executed green, file absent from baseline); deploymentReturn still prints "Hold chance X, roll Y" on the vassal-homecoming coup, frozen in the ratchet baseline | relationshipMemory.js:300-302, 463-473; tests/helpers/proseNumericsWalk.js:5-7, 20-25; deploymentReturn.js:471 | DEFECTS — INT-8 cures both + the walker's blind spot |
| 22 | Narration density: interior = near-total event coverage with single-template voices (coup 2 templates + 4 fixed sentences; faction fixed verb table; one investiture beat; 6 generosity headlines) vs war's ~12 casus × 4 seeded variants + authored termination sentences; interior DRAMA thins to 2/100 years ON THE 4-SETTLEMENT CENTURY FIXTURE while interior MOTION stays 100/100 [CORRECTED 2026-08-02 (fp-audit): fixture named — the fraction does not travel] | factionCompetition.js:557-575; npcLadderKernel.js:884-915; generosityNews.js:34-182; eventProse.js:81, 180-300, 464, 580 | GAP — "the interior engine's memory outruns its voice"; INT-8 is the cure |

**The drama inventory (this survey's measured verdicts — spine req. 11 makes every
IMPOSSIBLE/PARTIAL below a NAMED pin in §5):**

| Story | Verdict | The gap, precisely | Cured by |
|---|---|---|---|
| The king who paid the tribute and lost his throne | PARTIAL | every beat separately narrated; the causal join silent ("no surface says 'he paid, and it cost him the seat'"); the strongest wire (`economicCoupReadEnabled`) VIRTUAL-dark; tribute resentment points only OUTWARD at the victor | INT-4 |
| The grudge that outlived both holders | PARTIAL | carried on three planes and narrated at transfer and at war-mint — but at payoff no surface names the original wound or the dead holders; the 4-tick incident half-life has erased the founding wound's prose by then | INT-5 (provenance) + INT-8 (the payoff sentence) |
| The heir who broke the father's oath | IMPOSSIBLE | treaties are settlement-plane; no signer identity exists to break faith WITH (treatyBreach.js:34-37); the cheap cure is mint-time provenance — homed in FP-GRAMMAR (the oath-holder identity), CONSUMED here | INT-3 (the interior half: the re-read + the character choice), GRAMMAR (the substrate) |
| The reconciliation sealed by aid | TELLABLE-NOW | the fullest interior arc; both bright conversion and dark mirror narrated | consumed as-is; INT-6 adds the DELIBERATE sibling |
| The court divided while the enemy watched | TELLABLE-when-lit | the richest interior/exterior coupling; `interventionEnabled` VIRTUAL-dark | lighting-order registration (§3); INT-3b feeds it a new invitation path |
| The seat that survived by starting a war | TELLABLE-NOW | mechanically closed, narrated at open and close; the MIDDLE is generic — the hold verdict never names the war's contribution though it is arithmetic in pHold | INT-4 (the rally receipt) |

**Verified ABSENT (each homed below; never build on these as if they existed):** the
two-books mechanism and any books module (INT-1/WR-5) · the refusal-price lane
(WR-5's G2 arm; consumed here) · the succession re-read and installed-successor
demand (WR-5's D/H arms; generalized here) · any forgive/amnesty verb (INT-6) · signer
identity on treaties (GRAMMAR's oath-holder identity; consumed by INT-3) · a
tribute→legitimacy write (deliberately NOT added — J-INT-3) · a legitimacy
certification row (INT-7) · coup-verdict decision naming ("the reasons name the
contest, never the treaty" — INT-3) · founding-wound attribution at payoff (INT-5/INT-8)
· the seat_held credibility restoration (informationStatecraft.js:112-113 header
doctrine "a new dynasty inherits the paper, not the hatred" vs a typedef carrying
only `people_held` — a DOCUMENTED DRIFT; homed as a coupling note in §6 row 11, the
fix owned by FP-INFORMATION) · dispositionStats decay [CORRECTED 2026-08-02
(fp-audit)] — the disposition ratchet's cure is WR-2's channel extension, a §10.1
hard precondition, DELIBERATELY DEFERRED here (§2 row 16): until WR-2 lands, an
undecaying character ratchet feeds every seatBooks ruler-position read — build
nothing that assumes it decays · the AMBITIOUS arm of SP-1's interior errand
consumer [CORRECTED 2026-08-02 (fp-audit)] — spine SP-1 assigns "the ambitious"
to INTERIOR; INT-3b mints ONLY the defeated (contest-loss) émigré this program, a
DECLARED SCOPED DEFERRAL, not fulfilment (rationale at INT-3b; the
ambitious-but-undefeated departure returns when its producer event exists).

**Spine infrastructure this volume consumes (BUILD-PRECONDITIONS, none in the tree
yet — VERIFY-AT-BUILD, and STOP-and-report if consumed before landed):** SP-1 errands
(INT-3b's émigré rides it) · SP-3 pact grammar (succession-repudiation's writer lives
there; INT-3 triggers it) · SP-4 postureOf/riskToleranceOf (every decision surface
below consumes it) · SP-5 the confidence-stock family (INT-7's legitimacy crossings
instantiate its grammar — legitimacy is the family's "seat's domestic credit"
member) · SP-6 the narration kit (INT-8 completes its checklist) · SP-7 the temporal
walker (every clock below denominates against INTERVAL_WEEKS under its assertion).

---

## §3 THE FLAG FAMILY + LIGHTING ORDER + THE ONE SEAM RULING

Six new virtual flags, plus two EXISTING dark flags this program completes and
registers for the owner's lighting order. All absent from DEFAULT_SIMULATION_RULES;
lit only at an owner-signed soak:

| Flag | Gates | Wave |
|---|---|---|
| `seatBooksEnabled` | the generalized two-books read's NON-WAR consumers (the war arm rides WR-5's `warTerminationEnabled`) | INT-1 |
| `settlementPoliticsEnabled` (EXISTS, dark) | bloc formation + decision loading (built); INT-2 completes its counsel receipts, foreign-position generalization, and dossier projection UNDER THE SAME FLAG | INT-2 |
| `interiorVetoEnabled` | the organizing grievance, the causal-join receipts, the generalized re-read triggers, the émigré arm | INT-3 |
| `strainAttributionEnabled` | the attributed pressure receipts, the commons tribute term, the rally receipt | INT-4 |
| `memoryHorizonSeamEnabled` | the band-scaled incident half-life + founding-wound provenance reads | INT-5 |
| `deliberateForgivenessEnabled` | the burial verb (both arms), suppression reads, the dig-up | INT-6 |
| `legitimacyCrossingsEnabled` | legitimacy band-crossing receipts (the SP-5 instantiation); INT-7's certification row keys on them | INT-7 |
| `economicCoupReadEnabled` (EXISTS, VIRTUAL-dark) | the tribute-drain → coup-footing wire (coup.js:118-127) — INT-4's arc is inert in a stock world without it; REGISTERED here for the owner's lighting order, no code change | INT-4 note |

INT-8 (the voice) carries NO flag of its own: new receipt pools for dark kinds ride
their kinds' flags; text upgrades on LIT kinds are same-seed prose shifts that
REQUIRE a recorded ruling BEFORE the wave starts — J-INT-13 governs; war volume
§10.4 forbids a mass golden re-record without one [CORRECTED 2026-08-02
(fp-audit)] — never silent, never merely "disclosed".

**[CORRECTED 2026-08-02 (fp-audit)] `factionCompetitionEnabled` IS NOT DARK:** it
is a member of DEFAULT_SIMULATION_RULES with value TRUE (simulationRules.js:45) —
lit by default, certified 100/100 (§2 row 19), and NOT part of any lighting batch.
"Composition partner" means only that bloc surfaces require BOTH flags true. The
arm that needs declaring is the INVERSE: the `quiet_local` preset sets
`factionCompetitionEnabled: false` (simulationRules.js:306), so under that preset
NO blocs form even with `settlementPoliticsEnabled` lit — INT-2 emits no counsel,
and INT-3's bloc-held organizing grievance never arms. DEGRADED ARM, explicit per
the war volume's flag-dependency ruling shape: under quiet_local the re-read, the
installed-successor demand (both ride succession records), and INT-3b's émigré
(rides contest events) still function; the decision-grievance lane is dormant
because its entries live on bloc records. INT-2 carries the preset-negative pin.

**THE LIGHTING ORDER (the §9 build order is the lighting order, exactly as the war
volume rules for WR flags):** `settlementPoliticsEnabled` (composed at read time
with the default-true `factionCompetitionEnabled` — the partner is NOT queued)
before `interiorVetoEnabled` (the veto's
organizing grievance holders are blocs); `seatBooksEnabled` before
`interiorVetoEnabled` (the join receipt names whose books the decision served);
`memoryHorizonSeamEnabled` before `deliberateForgivenessEnabled` (dig-up pricing
reads wound age through the seam-corrected clock); `warTerminationEnabled` +
`warDispositionEnabled` + `economicCoupReadEnabled` before `strainAttributionEnabled`
is MEANINGFUL (it is VALID dark-predecessor config — the pressure receipts simply
have fewer co-present burdens to name; the degraded arm is explicit, per the war
volume's flag-dependency ruling shape). A flag lit out of order beyond these
declared degradations is an invalid config the INT-7 certification walker reds.

**THE SEAM RULING (this volume's largest architectural decision — ONE BOOKS READ,
MANY CONSUMERS):** WR-5 specs the two-books combination for the war table. This
volume rules WHERE IT LIVES: a pure read-side module **`seatBooks.js`** — no state,
no writer, the dispositionProfile shape (war volume WR-2) — exporting
`booksOf(settlementId, worldState)` → `{ settlementPosition, rulerPosition,
weight01, receipt }`. WR-1/WR-4/WR-5's war reads consume it under
`warTerminationEnabled`; SP-3's pact acceptance and WR-10's asset sale consume it
under `seatBooksEnabled` + their own flags. [CORRECTED 2026-08-02 (fp-audit)] THE
CONSUMER LIST IS SPLIT HONESTLY: the war arm and SP-3 are the two consumers with a
STATED SEAM. TRADE's venture appetite, FAITH's stance choices, and POP's permit
posture are DECLARED DEFERRALS (a decision, not an omission — the corpus audit
confirmed none of the three volumes reserves the read: GR-2 reads
postureOf/riskToleranceOf only, TR-7 consumes house appetite only, WF-3 consumes
riskToleranceOf(temple) only, POP-5b reads viability grade only). Each deferral
LIFTS when the consuming volume reserves the seam in its own wave spec — one line
naming `booksOf` behind `seatBooksEnabled` AND its own flag, with the receipt
clause ("names seatBooks in its own receipt") included — and the corresponding
CPL row records the wiring. [CORRECTED 2026-08-02 (fp-audit), cohesion pass:
TWO of the three deferrals have since LIFTED exactly as this rule requires —
TRADE reserved the seam at TR-7 (venture appetite coloured by `booksOf` behind
`seatBooksEnabled` AND `venturesEnabled`, receipt naming seatBooks,
absent-not-zero) and POP reserved it at POP-5b's posture block (the caller's
press-or-yield behind both flags, same receipt clause). FAITH's stance choices
remain the ONE open deferral — WF-3 still consumes `riskToleranceOf(temple)`
only, and no FAITH wave reserves the read.] Until a volume reserves its seam,
no interior wave, and no implementer,
treats the deferred read as built. A SECOND books evaluator anywhere is a design
defect — exactly the war volume's terms-evaluator law, applied to the seat.
Composition is fixed: the WEIGHT derives from the ruler's security/legitimacy/
facets/alignment (amendment B, WR-5's derivation verbatim); the RULER-POSITION term
composes the three confirmed substrates (§2 row 10) — the fragility cliff read
CONSUMED from momentum.js's published exports (FOREIGN FILE — read-only, the C2 law
binds verbatim), the bloc loading read from settlementPolitics, the patron bias read
through the EXISTING covert seam (G's third-party books — no new state; the
corruption web already knows the patron). Coordination with WR-5's implementer is
J-INT-1 (§7): if WR-5 builds first and inlines the combination, INT-1's first slice is
the EXTRACTION into seatBooks.js, behavior-identical, golden-pinned.

---

## §4 CANONICAL MODEL — new state, and it is deliberately small

Everything below is conditionally materialized (drop-when-empty at every level, zero
eager bytes, absent ⇒ byte-identical — the §1c observability law) and has exactly ONE
writer module.

```
seatBooks.js                                 — INT-1: PURE READ-SIDE, no state, no
                                             // writer (the dispositionProfile
                                             // pattern). Receipts only.

decision grievances                          — INT-3: NO NEW LEDGER. A typed entry
  on the EXISTING faction/succession records // {kind:'decision_grievance',
  writer: the records' own existing writers  //  decision: closed vocab (§INT-3),
                                             //  decidedTick, blocId, receiptId}
                                             // rides factionStates (the losing
                                             // bloc's record) and, for installed
                                             // successors, the succession record
                                             // WR-5 already extends (the demand).
                                             // Decays: state-derived like every
                                             // grievance — dies when the producing
                                             // bloc dissolves or the decision's
                                             // object (the war, the pact) ends +
                                             // a banded tail.

worldState.spatialLedgers.burials            — INT-6, writer burialLedger.js (ONE
  [ { id, pairKey,                           // writer; release/dig-up/expiry all
      woundFamily,                           // close through it). woundFamily is a
      decreedTick, decreedBy,                // CLOSED vocab AUTHORED IN §INT-6 —
      price: { receiptId },                  // seven families partitioning the
      state } ]                              // tree's open WOUND_TYPE_RE; the
                                             // regex is REPLACED by INT-6's typed
                                             // classifier (no "existing typed
                                             // families" exist in the tree — the
                                             // audit confirmed the only typing is
                                             // an open substring regex,
                                             // grievanceRead.js:48) [CORRECTED
                                             // 2026-08-02 (fp-audit)]. Never a
                                             // free string. state: held | dug_up
                                             // | lapsed. Suppression is a READ over
                                             // this ledger (grievanceRead-side);
                                             // no incident row is ever deleted.

founding-wound provenance                    — INT-5: TWO FIELD ADDITIONS, no new
  LadderGrudge gains { originHolderId? }     // records: the V-7 inheritance writer
  (writer: npcLadderState, at inheritance)   // stamps the predecessor's id when a
  incident rows KEEP their existing          // grudge first crosses a succession
  {type, tick} — the payoff attribution      // (chains preserve the FIRST holder).
  is a READ over what is already stored      // Incident rows already carry type +
                                             // tick — the oldest-wound read (INT-5)
                                             // derives "the sack of Thornwall,
                                             // forty years gone" from them.

émigré errands                               — INT-3b: NO NEW LEDGER — SP-1 errands
                                             // with purpose 'factional'|'personal',
                                             // declared/true split riding the
                                             // covert seam. The interior adds only
                                             // the MINT SITE (contest-loss) and the
                                             // CLOSE reads (returned/faded/
                                             // reconciled).

legitimacy crossings                         — INT-7: receipts only (SP-5's grammar:
                                             // banded stock, event-moved, receipts
                                             // on band crossings). NEVER a second
                                             // legitimacy writer — the crossing
                                             // detector reads the stock the
                                             // existing hit writers moved.
```

**What is deliberately NOT modeled:** no unrest scalar (the rung ladder + gated
stressors remain the shape — §2 row 9); no "court opinion" stock (blocs + books ARE
the court's opinion, derived); no dynasty graph (§2 row 17's law stands); no stored
books/positions (pure reads, receipts only); no second legitimacy writer; no
tribute→legitimacy write (J-INT-3); no new relationship vocabulary EXCEPT the one
this volume must author [CORRECTED 2026-08-02 (fp-audit)]: woundFamily — the tree
has NO closed typed-wound families to reuse (only the open WOUND_TYPE_RE regex);
INT-6 authors the seven-family enum and the classifier that replaces the regex,
and postures stay 18.

---

## §5 THE WAVES (dependency order; each: one commit, focused gates per slice, full
## gate at wave end, ledger row; every wave DARK per §3; the war volume's §10
## implementer protocol binds every one VERBATIM)

### INT-1 — THE BOOKS GENERALIZED (settled ruling 1; flag `seatBooksEnabled`;
### historical archetype: the Sun King's wars — the dynasty's ledger ruinous to the
### realm's, and nobody at Versailles reading the second book aloud)
**Scope:** G's two books land per WR-5's spec — this wave rules the module shape
(§3's seam ruling: `seatBooks.js`, pure read-side, ONE evaluator) and extends
consumption from the war table to the FULL foreign-verb space.
**Model:** no state (§4). **Seams:** momentum.js FOREIGN (published exports only);
corruptionWeb's covert seam consumed, never extended; the SP-4b posture derivation
declares seatBooks an INPUT (state × disposition channels × the ruler's books — the
spine's own formula), so this module feeds posture and must never CONSUME
`postureOf` (a cycle is a design defect; the import pin proves the absence).
- **Law:** every foreign read is performed BY the seat — a weighted combination of
  settlement-position and ruler-position, the weight derived from the ruler's
  security/legitimacy/facets/alignment (amendment B verbatim, via WR-5).
- **Force / counterforce, same evidence:** the ruler-position term pulls decisions
  toward the seat's survival (a fragile seat holds the war, sells the satellite,
  refuses the humbling pact); the counterforce is the SETTLEMENT-POSITION term
  scoring off the SAME state — the same drained granary that terrifies the seat
  (coup footing) also screams for peace (the town's book). The weight, not the
  evidence, decides — and the weight is character + security, receipted.
- **Belief posture (Law One):** domestic terms read domestic truth (the
  domestic-truth boundary, §1b); every cross-border term in either book (the rival's
  believed trajectory, believed prices, believed strength) routes through belief
  machinery — K3's structural pin set extends to seatBooks.js: import pin + token
  scan + guard-the-guard (positive control pointing at a legitimate truth-reader
  OUTSIDE the set, per the war volume's mechanics).
- **Named-actor casting:** the ruler-position term IS the named ruler read through
  existing planes — facets (npcLedgerFacets), temperament (W0/momentum's trait
  table), goals/rivalries where the ladder holds them. Casting is read-wiring; no
  new NPC state.
- **Receipts (house voice):** every books read derives ONE receipt naming both
  positions' bands, the weight band, and WHICH BOOK WON — "the Margrave's counsel
  weighed her seat above the town, and the war went on." Bound-Book register floor;
  band words only (finite semantics). [CORRECTED 2026-08-02 (fp-audit)] EMISSION IS
  CHANGE-GATED, NEVER PER-PULSE: the books-standing receipt EMITS only on a
  weight-band or winning-book CHANGE — the agreement deadband (Bands below) is the
  gate; it exists to stop oscillating receipts and it stops chronic ones too. The
  books-standing class is pacing-registered at the LOWEST class (SP-6 significance
  family — J-INT-11 names this class distinctly from INT-2's counsel beats), and
  INT-8's pool inventory carries it, so §9's two INT-1 sentences have a pool that
  can print them.
- **Consumers (the generalization — each behind ITS program's flag AND
  `seatBooksEnabled`):** STATED-SEAM TODAY [CORRECTED 2026-08-02 (fp-audit)]:
  WR-1's termination read (via WR-5 — war volume law); SP-3 pact accept/refuse
  (GRAMMAR); WR-10's sell-the-family-silver divergence (the war volume already
  names it — this read is how). RESERVED SEAMS (deferrals lifted per §3's rule
  [CORRECTED 2026-08-02 (fp-audit), cohesion pass]): TRADE venture appetite
  (TR-7's posture block — both flags, receipt clause, absent-not-zero) and POP
  permit posture (POP-5b's posture block, same form) — reserved in spec, dark
  until both flags light. DECLARED DEFERRAL (§3's seam ruling records why):
  FAITH stance choices — lifts when a FAITH wave reserves the seam in its own
  spec; until then that read is NOT built and no receipt claims it. Each live
  consumer names seatBooks in
  its own receipt ("whose books the refusal served" — WR-5's G2 sentence, speakable
  wherever the seam is actually reserved).
- **THE POSTURE-WIDE DISCLOSED SHIFT [CORRECTED 2026-08-02 (fp-audit)]:** spine
  SP-4b's posture formula names the ruler's books as an input, and this module —
  built LAST of the six programs — is that input. Until `seatBooksEnabled` lights,
  SP-4b composes state × disposition channels only: the books term is ABSENT, not
  zero (the spine owns the degraded-arm sentence; if SP-4 lacks it at build time,
  STOP-and-report). Lighting `seatBooksEnabled` therefore moves EVERY postureOf
  consumer in five programs at once — a disclosed shift adjudicated with the
  lighting batch, golden'd with-and-without the books term, and named in the
  owner's lighting queue entry.
- **Pins (negative hardest):** the CONVERGENCE negative — a secure, endorsed,
  aligned seat produces books that AGREE, and the receipt says so ("seat and town of
  one mind") — divergence must be earned by state, never ambient; both WR-5
  divergence shapes reachable on real fixtures (ruinous war continued for the seat;
  winning war ended against a rival's triumph); the BOOKS-COLLAPSE fixture
  (existential threat collapses the two books — desperation makes courts honest;
  WR-8 pins it for conquest, INT-1 pins the general case); the patron arm — a
  compromised seat's ruler-position optimizes the patron's books and the receipt
  carries the covert projection discipline (includeCovert only); the cycle-absence
  import pin (no postureOf); dormancy golden.
- **THE DOSSIER ROUND-TRIP PIN (crown law):** open the town page → the ruling-power
  card (the power-structure family surface; exact panel VERIFY-AT-BUILD) shows the
  seat's standing line in band words — "Seat: secure. Counsel: the realm's good
  above her own." — sourced from the latest books receipt, updated per pulse,
  projected through includeCovert for the patron case. The pin walks entry → receipt
  → dossier and back to the producing state.
- **Clock:** recomputed per pulse (a read, not a stock); its INPUTS move on their
  own lawful clocks (§2 rows 1, 5, 8). Fast layer: the counsel receipt each pulse.
  Slow verdict: the seat's fate when the books stay split for seasons (INT-3).
- **Bands:** weight-derivation bands (security/legitimacy/facet contributions), the
  agreement deadband (books within it read as "of one mind" — no oscillating
  receipts), per-consumer color caps (a book COLOURS a verb's bar, never drowns it —
  E3's law generalized), the books-standing class assignment (SP-6's significance
  family — lowest class [CORRECTED 2026-08-02 (fp-audit)]).
- **Endings vocabulary:** none of its own (a read); its receipts feed INT-3's and
  INT-8's endings.
- **Couplings:** §6 rows 1, 3, 5, 7, 9 — the books read is the interior's largest
  export; DESIGN_FP_COUPLINGS.md walks each consumer pair.

### INT-2 — THE POSITIONS WIRED (settled ruling 4; flag `settlementPoliticsEnabled`,
### EXISTING and dark — this wave completes its surface under the same flag;
### historical archetype: Guelph and Ghibelline — factions whose FOREIGN alignment
### was their domestic identity, and every city's hall split by it)
**Scope:** the dark bloc-grain substrate (§2 row 5) wired to consequences: counsel
receipts, the foreign-position generalization beyond war verbs, the dossier
projection, and the organizing-grievance handoff INT-3 consumes. The chooser loading
itself is BUILT (settlementStrategy.js:1044) — this wave makes it VISIBLE,
REMEMBERED, and GENERAL.
**Model:** no new state — bloc records already exist; the counsel receipt is
news-plane; the lost-argument handoff writes the §4 decision-grievance entry through
the faction record's existing writer (INT-3 consumes it).
- **Law:** positions are pressure, never selectors (§1b E3-generalized); the clamp
  stands (1 ± DECISION_LOAD_SPAN — survey-verified).
- **Force / counterforce, same evidence:** BUILT-IN and survey-verified — the same
  war reads as redemption to the treaty-burdened seats bloc (revanchism pull 0.6)
  and ruin to the commerce bloc (deploy −0.5); the same siege births the survival
  bloc that dissolves when it lifts. This wave adds no new force — it names the
  existing ones aloud.
- **The generalization:** blocDecisionFactor's move vocabulary extends from
  {deploy, sue_for_peace} to the full foreign-verb space AS EACH PROGRAM LANDS ITS
  VERBS — pact proposal/acceptance (SP-3), trade severance/venture (TRADE), stance
  moves (FAITH), sovereignty sale (WR-10). Per-verb loadings are authored from the
  same bloc-end grammar (seats/doctrine/commerce/survival/patron); a commerce bloc
  reaches for the pact and against the severance; a doctrine bloc against the
  missionary-access term. The loading table is CLOSED per verb — finite semantics.
- **Belief posture:** a bloc scores its position off the SETTLEMENT'S OWN state and
  BELIEVED cross-border state (the commerce bloc fears a war against what it
  BELIEVES the trade partner to be — SP-2's believed scarcity where lit); never
  truth across the border.
- **Named-actor casting:** counsel receipts NAME the bloc's leading NPC through the
  existing leaderTiePosture read (warm ties/bitter enmities already read at
  settlementPolitics.js:310-360) — "Master Corin of the Salt Ring counsels peace";
  the champion is cast, never stored.
- **Receipts (house voice):** the COUNSEL beat — when a loaded verb is actually
  taken or refused against a bloc's loading past a margin band, one receipt: "The
  Old Swords called for the march, and the Margrave heard them" / "…and the Margrave
  did not." The OVERRIDE case (counsel refused) is the dramatic one and feeds INT-3.
  Pacing-registered (§1a-12 via SP-6) — counsel is chronic; the governor keeps it
  from wallpapering the Herald.
- **Pins (negative hardest):** the CLAMP negative — no bloc composition, however
  loaded, zeroes a verb or forces one (property-shaped over generated bloc states);
  the quiet-town negative — no blocs above the formation floor ⇒ zero counsel
  receipts (seed non-empty first per §1c, then remove); the override handoff — a
  counsel override writes EXACTLY ONE decision-grievance entry on the losing bloc's
  record (dedup pinned); the survival-bloc dissolution (siege lifts ⇒ bloc gone ⇒
  its counsel stops — state-derived decay honesty); JSON-round-trip on bloc
  member/NPC aliasing (§1c); dormancy golden (the flag is live-composed — pin BOTH
  compositions dark); the PRESET NEGATIVE [CORRECTED 2026-08-02 (fp-audit)] —
  under `quiet_local` (`factionCompetitionEnabled: false`, simulationRules.js:306)
  with `settlementPoliticsEnabled` lit, NO blocs form, zero counsel receipts, and
  INT-3's bloc-held grievance lane stays empty, while the re-read, the
  installed-successor demand, and the émigré still function (§3's declared
  degraded arm, pinned — the dormancy golden covers only the two dark
  compositions and cannot catch this).
- **THE DOSSIER ROUND-TRIP PIN [CORRECTED 2026-08-02 (fp-audit): the surveys
  gathered zero UI evidence — exact panel VERIFY-AT-BUILD, in INT-1's words;
  fallback landing = the town page's faction-card family]:** the town page's
  faction cards each gain a FOREIGN-COUNSEL line in band words — "The Salt Ring:
  counsels peace with Ashford; weight in the hall: rising." Open the town, find
  the bloc, read its position; the pin walks card → latest counsel receipt → the
  bloc record that produced it.
- **Clock:** blocs re-read per pulse over MIN_DWELL 8 ticks (existing); counsel
  receipts fire on verb events, not per pulse. Fast: the counsel line. Slow: the
  bloc's patience — a counsel overridden repeatedly matures into INT-3's grievance
  (the banded tail is the patience clock, denominated INTERVAL_WEEKS under SP-7's
  assertion).
- **Posture consumption (SP-4):** bloc formation is state-driven (built); the
  COUNSEL MARGIN consumes `postureOf` — a bold-posture settlement's hall tolerates
  wider divergence before counsel becomes grievance; out-of-posture overrides price
  higher in INT-3.
- **Bands:** per-verb loading tables, counsel-margin band, patience band (overrides
  to grievance), counsel-significance CLASS ASSIGNMENT — into SP-6's significance
  family; this volume assigns classes, never mints a scale [CORRECTED 2026-08-02
  (fp-audit): the corpus audit found a dozen per-volume significance scales
  feeding one governor — the family is the spine's].
- **Endings vocabulary:** counsel {heeded, overridden} — consumed by INT-3's
  endings; share envelope (override floor AND ceiling) authored in INT-7
  [CORRECTED 2026-08-02 (fp-audit)].
- **Couplings:** §6 rows 1, 4, 5, 7 — the bloc grammar is how every substance's
  stakes enter the hall; DESIGN_FP_COUPLINGS.md walks the per-substance loadings.

### INT-3 — THE INTERIOR VETO COMPLETES (settled ruling 2; flag `interiorVetoEnabled`;
### two slices, each its own commit; historical archetype: February 1917 and
### Brest-Litovsk — the war continued past the country's interest until the interior
### replaced the seat, and the successor repudiated the father's war)

**INT-3a — THE ORGANIZING GRIEVANCE + THE CAUSAL JOIN.**
- **Law:** the veto is replacement, never a zero (§1b). WR-5 builds the war-decision
  arm (refused-or-signed peace feeds the coup/faction-capture lane as an organizing
  grievance, both polarities pinned, the installed successor inherits the demand);
  INT-3a GENERALIZES the arm to the full decision vocabulary and lands the RECEIPT
  the survey proved missing — "the coup verdict's reasons name the contest, never
  the treaty."
- **The decision vocabulary (CLOSED):** {war_opened, peace_signed, peace_refused,
  pact_signed, pact_refused, pact_repudiated, severance_declared, stance_changed,
  settlement_sold, grudge_buried} — each a decision a bloc can organize AGAINST.
  Every entry maps to an event the estate already receipts (the vocabulary is a
  projection, not new events); the walker asserts totality against the §4
  decision-grievance record's `decision` field.
- **Mechanism:** a counsel override (INT-2) or a books-won-against-the-town read
  (INT-1) past the patience band writes the decision-grievance entry on the losing
  bloc's record. The entry LOADS the existing lanes — coup pressure (the coup lane's
  legitimacy pressureKind gains a sibling `decision` pressureKind reading these
  entries), faction capture, the ladder challenge — all through their existing
  writers and clamps. THE CAUSAL JOIN RECEIPT: when a verdict lands in a settlement
  holding a live decision-grievance that materially loaded it (margin band), the
  verdict receipt NAMES THE DECISION: "The peace party holds the hall; the war the
  Margrave would not end is named in the verdict." The join is arithmetic today
  (survey row 6) — this wave makes it SPOKEN.
- **Force / counterforce, same evidence:** the grievance loads the coup lane; the
  counterforce is LIVE-STATE RECOMPUTATION, already built — the verdict recomputes
  from live state (coup.js:99-226), so a seat that repairs legitimacy or reverses
  the decision (sues the peace, repudiates the pact) genuinely defuses the verdict;
  the SAME decision record that armed the grievance records its own reversal and the
  grievance dies state-derived. Reversal receipted: "the Margrave sued for peace,
  and the hall grew quiet."
- **The installed successor (WR-5's H arm, generalized):** the demand rides the
  succession record for ANY decision kind, not only war — the trade party that
  installs a seat expects the severance; D's re-read must honour it or the coup was
  pointless (WR-5's own pin, generalized across the vocabulary).
- **The re-read generalized (D beyond war):** on ANY legitimate power change, the
  seat's standing FOREIGN POSITIONS re-read under the new character — standing wars
  via WR-5 (built there); standing PACTS here: the re-read scores each live treaty
  under the new books; past the repudiation band it TRIGGERS SP-3's
  succession-repudiation writer (GRAMMAR owns the writer; the interior owns the
  trigger — cross-referenced, never duplicated). THE HEIR'S SENTENCE consumes
  GRAMMAR's oath-holder identity: "the father swore it; the son burned it" /
  "the son kept the father's word." DEGRADED ARM (named per §3): if the oath-holder
  identity has not landed at build time, the receipt's holder clause ships dormant —
  the repudiation still receipts at settlement grain; the clause lights when GRAMMAR
  lands. STOP-and-report if tempted to mint signer provenance here.
- **Belief posture:** the bloc organizes against the decision AS IT BELIEVES IT — a
  peace signed on terms the hall has only heard third-hand organizes on the rumor's
  version (the decision-grievance entry stores the receiptId of what was PUBLISHED,
  not a private truth; infoMode governs what the hall saw).
- **Named-actor casting:** the grievance's face is the losing bloc's cast champion
  (INT-2); the verdict's beneficiary is the existing contender machinery's winner —
  no new NPC state.
- **Pins (negative hardest):** BOTH polarities on real fixtures (war party overturns
  peacemaker; peace party overturns warmonger — WR-5's pin, re-pinned here at pact
  grain: sign-party vs refuse-party); the JOIN NEGATIVE — a coup in a settlement
  with NO live decision-grievance names no decision (the join must never
  confabulate; this is the hardest pin — seed a coup from pure legitimacy collapse
  and prove the verdict stays decision-silent); the reversal defusal (decision
  reversed ⇒ grievance dies ⇒ verdict tilt returns to baseline, receipted); the
  installed-successor honour pin (generalized demand honoured across the vocabulary)
  and its CHARACTER pin (same demand, two tempers ⇒ honoured vs betrayed — the
  installers learn what the coup bought); the re-read bidirectional pin (same pact,
  successor repudiates under one character, REAFFIRMS under another — the
  reaffirmation is a receipt too: "the son kept the father's word"); unreachable-
  conjunction reachability on the grievance gate; dormancy.
- **THE DOSSIER ROUND-TRIP PIN:** the town page's power-transfer history — the
  previousGovernments surface, VERIFIED IN THE TREE [CORRECTED 2026-08-02
  (fp-audit)]: it renders at src/components/dossier/EngineSections.jsx:225 and
  src/pdf/sections/PowerStructure.jsx:291 — shows the organizing decision on each
  verdict row: "Year 34: the seat fell; the peace of Ashford is named in the
  verdict." Open the town, read WHY the seat fell, walk to the decision's own
  receipt.
- **Clock [CORRECTED 2026-08-02 (fp-audit) — the wave's missing bullet; every
  sibling declares one]:** the RE-READ is event-driven — it evaluates ON the
  power-change event's own tick (the transfer that installs the successor), never
  on a polling cadence; the JOIN MARGIN evaluates at verdict time (the coup/capture
  verdict's tick, reading the live decision-grievance entries at that instant);
  the `decision` pressureKind composes into coup pressure per pulse, like its
  legitimacy sibling; a decision-grievance entry lives while its producing bloc
  lives AND its decision's object stands, then dies on a BANDED TAIL — the tail is
  INT-2's patience band read in reverse, denominated in INTERVAL_WEEKS under SP-7's
  assertion. Fast layer: the counsel-override and join receipts. Slow verdict: the
  seat's fate, and the installed successor's honour-or-betray choice seasons later.
- **Posture consumption (SP-4) [CORRECTED 2026-08-02 (fp-audit) — discharged
  inside the wave that owns the decision surface, not by reference from INT-2]:**
  an OUT-OF-POSTURE override prices higher — the decision-grievance entry's
  magnitude band reads `postureOf` at write time (a martial town's overridden war
  counsel wounds deeper than a weary one's), and the join margin consumes the same
  read at verdict time. Priced and receipted, never forbidden.

**INT-3b — THE ÉMIGRÉ (SP-1's assigned interior errand consumer; historical
archetype: the Jacobite court in exile — the defeated claimant whose hosting is
itself a foreign-policy act).**
- **Scope — A DECLARED NARROWING [CORRECTED 2026-08-02 (fp-audit)]:** spine SP-1
  names INTERIOR's errand consumer "the ambitious"; this wave mints ONLY the
  DEFEATED — every trigger below is a contest loss the estate already records.
  The ambitious-but-undefeated traveller (the second son seeking service abroad,
  the rising contender shopping for a patron BEFORE risking the challenge) is
  DEFERRED, not forgotten (§2's verified-absent register carries the entry):
  rationale — the defeated mint rides receipted contest events that exist today,
  while the ambitious mint needs a rising-goal departure trigger no event yet
  produces; J-INT-12's law (the vocabulary never leads the events) applies to
  errand mints exactly as to decisions. The arm returns when its producer exists —
  and it is the sharper covert/revealed case (declared-diplomatic / true-personal),
  so the deferral is recorded where the spine's reader will look, never silent.
- **Mechanism:** on a contest loss the estate already records (failed coup
  contender, failed ladder challenger dropping a rung, ousted seat-holder), a
  banded, seeded share (keyed `emigre:<npcId>` — §1c stream discipline) of NAMED
  losers departs on an SP-1 errand — purpose DECLARED {personal}, TRUE purpose
  possibly {factional}: seeking a host court's backing. The errand rides the full
  SP-1 lifecycle (legs, snapshot, interception, K.7 silence window, DM-KILL closes
  `lost`); law M's week floor binds — the pretender travels at the world's speed.
- **The host's decision:** the receiving seat reads the guest through ITS books
  (INT-1) + posture (SP-4) + its believed picture of the home seat's weakness (SP-2)
  — {shelter, turn_away, sell_back}. Shelter feeds convergence's EXISTING
  regime-change/kinship intervention motives (§2 drama row 5 — the divided-court
  story gains its invitation path); turn_away is a receipted mercy or prudence;
  sell_back mints the betrayal grievance on the guest's faction and a gratitude
  obligation from the home seat (existing ledgers both).
- **Force / counterforce, same evidence:** the émigré's tale raises the host's
  believed odds of profitable intervention; the counterforce reads the SAME guest —
  harboring is a STANDING GRIEVANCE the home seat holds against the host
  ("they keep our traitor at their table"), state-derived, decaying only when the
  exile's arc closes. Shelter is priced, not free.
- **Endings (closed, never death):** {returned (a later verdict restores the
  faction and the exile's record closes home), faded (the banded patience clock
  runs out — the host tires, the errand closes, the NPC re-enters ordinary
  circulation), reconciled (a burial (INT-6) or amnesty term (SP-3 family) closes it
  warmly)}. Never engine-killed; never fate-resolved.
- **Belief posture:** the émigré is a MOTIVATED SOURCE — their account of home
  enters the host's belief through the credibility ladder at their own credibility
  (the pretender's court believes its own dispatches); the false-hope arc (host
  intervenes on an exile's stale snapshot and finds the home seat secure) is
  explicitly reachable and receipted post hoc.
- **Pins (negative hardest):** the CAP (one live émigré errand per settlement pair —
  band; the world is not a pretender factory); the no-death lifecycle (every ending
  path closes through SP-1's writer; a DM KILL mid-errand closes `lost` and the
  host's motive dies with it); the sold-back double receipt (both courts' news name
  the price); the stale-snapshot intervention (the false-hope arc receipted);
  JSON-alias round-trip (the émigré IS a roster object); the LIFECYCLE TRIAD
  [CORRECTED 2026-08-02 (fp-audit)] — J-INT-15's projection ruling pinned per
  path: REGEN (an errand whose NPC no longer exists after regen closes `lost`,
  never dangles), UNDO (both towns' projections revert with the errand record —
  the record is the only state there is), IMPORT (an errand referencing an
  unimported host settlement drops to absent, never a dangling read); dormancy.
- **THE DOSSIER ROUND-TRIP PIN [CORRECTED 2026-08-02 (fp-audit) — the surveyed
  tree has NO "notable-souls" surface (the nearest is the NotableNPCs ORDERING,
  src/components/session/SessionMode.jsx:22); and per J-INT-15 the home page
  shows an AWAY-MARK, never an absence]:** the guest projection on the HOST
  town's roster/NPC surface is NEW UI WORK OWNED BY THIS WAVE (exact panel
  VERIFY-AT-BUILD; the fallback landing is the settlement NPC-listing family the
  dossier already renders) — "Corin of Thornwall, in exile at this court"; the
  HOME town's faction card renders the away-mark — "its captain rides east, year
  31" — the exile still ON its roster (J-INT-15: pure projections over the SP-1
  errand record, both ends). Both marks walk to the errand record.
- **Clock:** departure share per contest event; patience band in weeks
  (INTERVAL_WEEKS-denominated); travel on SP-1's kernel. Fast: the flight beat.
  Slow: the return/fade/reconcile verdict seasons later.
- **Bands (INT-3 family):** grievance patience band, decision-load margin, join
  margin, re-read repudiation band, émigré departure share, émigré patience band,
  émigré cap (one live errand per settlement pair — named here so §8's ledger row
  has its §5 anchor [CORRECTED 2026-08-02 (fp-audit): the tuning audit caught the
  cap living only inside the pin list]), host-decision loadings,
  harboring-grievance magnitude.
- **Endings vocabulary (INT-3 family):** {held, overturned_war_party,
  overturned_peace_party, demand_honoured, demand_betrayed, repudiated_by_heir,
  reaffirmed_by_heir, exile_returned, exile_faded, exile_reconciled} — share
  envelopes authored in INT-7.
- **Couplings:** §6 rows 1, 3, 4, 11, 12 — the veto is the interior's loudest
  export; the émigré is its longest-range one.

### INT-4 — THE NARRATED MIDDLE (settled ruling 3; flag `strainAttributionEnabled`;
### historical archetype: Æthelred and the Danegeld — he paid, and paid again, and
### the paying itself unmade the seat)
**Scope:** the king-who-paid arc's silent join spoken, and the legitimacy_hunger
arc's flat middle cured — the two PARTIAL/flat verdicts from the survey's drama
inventory that live entirely inside existing arithmetic.
**Model:** NO new state, NO new writes (J-INT-3 is this wave's spine): attribution
READS + receipts + one commons-voice grievance TERM.
- **Law:** no direct tribute→legitimacy write is added — the chain already runs
  tribute → conserved grain drain → economic_capacity → coup footing
  (`economicCoupReadEnabled`) alongside the legitimacy pressure lane; adding a
  parallel write would double-count the same grain (the ratchet lesson). The cure
  is ATTRIBUTION, not amplification.
- **THE ATTRIBUTED PRESSURE RECEIPT — CO-PRESENCE, NOT DECOMPOSITION [CORRECTED
  2026-08-02 (fp-audit), chair ruling R7 — respecced against the tree]:** the
  coup's birth pressure is ONE-STRAIN BY CONSTRUCTION — `coup_detat` declares
  pressureKinds `['legitimacy']` only (stressorsCore.js:239-240); tribute
  (`vassal_extraction`) classifies into TRADE_ARCHETYPES and feeds the ECONOMY
  kind the coup never consumes, and war_exhaustion/famine/occupation are absent
  from LEGITIMACY_ARCHETYPES entirely (pressureModel.js:34-41). The legitimacy
  stock is a bare persisted integer with no per-hit provenance (§2 row 1), and
  §4 adds none. So the receipt DOES NOT claim causal shares it cannot compute.
  When coup pressure crosses birth (0.6), the receipt reads LIVE STATE at the
  crossing — the outstanding treaty installment stream, the exhaustion scar,
  active famine/occupation conditions, the corruption plane — and names them as
  CO-PRESENT BURDENS: {tribute_strain, war_exhaustion, famine, occupation,
  corruption} (closed vocab, banded presence, band words only): "the seat
  weakens, and these burdens stand — the tribute of Ashford, a war grown long."
  The ONE causal clause the substrate supports is stated when true: a matched
  LEGITIMACY_ARCHETYPES condition (the flat +0.16 term, pressureModel.js:294-301)
  is named AS cause — corruption_exposed is the only §5 burden in that set. The
  co-presence read is NEW WORK carrying its own pins (below). Settled ruling 3's
  narrated middle is discharged by the PAIR of receipts — the crossing receipt
  names the burdens, and when the verdict later lands, INT-3's join receipt names
  the decision: "he paid, and it cost him the seat" becomes two receipts a reader
  walks, or one Herald sentence where the pacing governor grants it the
  column-inches. Causality lives in the JOIN, where it is real; the crossing
  speaks only what the state can prove.
- **THE COMMONS TRIBUTE TERM:** commonsVoiceKernel's grievance composite (today:
  legitimacy/corruption — §2 row 9) gains a TREATY-BURDEN term reading live
  outbound-stream state (the treaty's own compliance records — the payer's book of
  the same conserved grain peaceTerms already moves). The rungs, dips, and
  LEGIT_FLOOR are untouched — the term feeds the EXISTING composite through the
  existing writer.
- **Force / counterforce, same evidence (the wave's heart):** the SAME TREATY both
  drains and relieves. Force: installments feed the commons grievance term and the
  economic coup footing. Counterforce: THE PEACE DIVIDEND — the same treaty record
  proves the war ended; the commons term is DISCOUNTED by the believed severity of
  the war the treaty closed (a tribute after a war believed lost reads as the price
  of survival; the same tribute after a war believed winnable reads as the seat's
  weakness). Both readings receipted: "he paid, and the town forgave him — the war
  was over" is as reachable as the fall. The discount reads the war's closing
  receipts and the town's own exhaustion scar — belief-side, never a truth re-read.
- **THE RALLY RECEIPT (legitimacy_hunger's middle):** when warSentimentAdj
  contributes past a margin band to a HOLD verdict, the hold receipt names the war:
  "the seat steadied — the war did what the court could not." The survey proved the
  contribution is arithmetic in pHold and invisible in prose (rulingPowerCoup.js:184
  stays the generic fallback when no single contributor clears the margin — the
  margin keeps the receipt honest).
- **Belief posture:** the commons read the tribute through what was PUBLISHED (the
  signing beat, the Herald's war coverage) — infoMode governs; a court that hid the
  terms faces a crowd reading rumors instead (the hidden-terms case receipts
  through the existing covert/revealed seam).
- **Named-actor casting:** the paying seat's holder is named in the attribution
  receipts through the existing power-structure read; their facets color INT-8's
  pool variants ("the proud Margrave paid in silence").
- **Pins (negative hardest):** the CO-PRESENCE NEGATIVE (hardest) [CORRECTED
  2026-08-02 (fp-audit) — with the live-state respec this pin is no longer
  vacuous]: a coup born of pure legitimacy collapse with NO tribute outstanding
  names no tribute, AND its positive control — the same crossing WITH a live
  installment stream names it (the pair proves the receipt reads real state, not
  a hardcoded list; seed both states); the CAUSAL-CLAUSE negative — no burden
  outside a matched LEGITIMACY_ARCHETYPES condition is ever worded as cause
  (co-present burdens keep co-presence wording); the dividend pin — same tribute, two
  believed-war-severities ⇒ the term lands at two banded magnitudes, both receipted;
  the rally margin negative — a hold where the war's contribution is sub-margin
  keeps the generic receipt (no false credit); the double-count guard — with
  `strainAttributionEnabled` lit and `economicCoupReadEnabled` lit, total coup tilt
  from one installment stream stays within the existing clamps (property-shaped:
  attribution adds WORDS, never weight); degraded-arm validity (dark
  `economicCoupReadEnabled` ⇒ fewer named strains, receipts still honest); dormancy.
- **THE DOSSIER ROUND-TRIP PIN [CORRECTED 2026-08-02 (fp-audit) — the tree has NO
  town-page treaty card: the only treaty surface is src/components/map/
  TreatyPanel.jsx, by its own header "the Realm Inspector's 'Treaties' tab" (a
  REALM surface, rendered from HeraldBody.jsx), and under the crown law's own
  wording a Realm Inspector landing does not discharge "open the town, find the
  trace"]:** the TOWN-PAGE STRAIN LINE is NEW UI WORK OWNED BY THIS WAVE (exact
  panel VERIFY-AT-BUILD; the natural home is the town page's treaty/obligation
  summary in the power-structure card family) — "The tribute of Ashford: heavy;
  the town remembers the war it ended." The Realm Inspector's treaty panel ALSO
  gains the line (cheap, the surface exists) but is the secondary landing, not
  the pin's discharge. Open the town, read the treaty's domestic cost next to
  its terms; walk to the latest attributed pressure receipt.
- **Clock:** installments on the treaty's OWN cadence marker (WR-0c item 4's law:
  current treaties 52-week years, legacy 12 — the attribution read resolves the
  treaty's marker and never re-prices it); pressure receipts per crossing; the
  dividend discount decays with the exhaustion scar's own clock. Fast: the
  installment strain beat. Slow: the verdict, or the forgiveness.
- **Posture consumption:** the dividend's floor consumes `postureOf` — a defiant-
  posture town forgives tribute more slowly than a weary one; priced, receipted,
  never forbidden.
- **Bands:** burden-presence bands per kind (the threshold at which a live burden
  is named, and its band words — renamed from "contribution" with the co-presence
  respec [CORRECTED 2026-08-02 (fp-audit)]), the dividend discount curve, the
  rally margin, the treaty-burden term's cap (the commons composite stays clamped).
- **Endings vocabulary:** {paid_and_fell, paid_and_stood, paid_and_forgiven} —
  share envelopes in INT-7 (paid_and_fell rare-but-present is the health metric; a
  world where every payer falls has a ratchet, a world where none does has
  decoration).
- **Couplings:** §6 rows 2, 6 — WAR→INTERIOR and TRADE→INTERIOR both flow through
  this wave's receipts; DESIGN_FP_COUPLINGS.md walks the grain.

### INT-5 — THE MEMORY SEAM + THE FOUNDING WOUND (settled ruling 6; flag
### `memoryHorizonSeamEnabled`; historical archetype: Kosovo Polje — the wound six
### centuries old that a long-memoried culture could still name, holder by holder)
**Scope:** the documented D5 seam closes (the incident half-life joins the lifespan
band the mean-reversion already obeys), and the founding wound becomes NAMEABLE at
payoff (the provenance the PARTIAL grudge drama needs).
**Model:** §4 — one field addition (`originHolderId` on inherited LadderGrudge rows,
stamped by the V-7 writer at the FIRST succession crossing), plus reads. The seam
wiring point is the one the module itself documents (relationshipMemory.js:14-23 —
"wiring point ready at relationshipMemoryWeight's options").
- **Law:** relationshipMemory is a LIVE lit-path module — the seam closes DARK
  behind the flag despite being a repair (J-INT-6): dark ⇒ byte-identical weights;
  lit ⇒ BOTH `halfLifeTicks` AND `maxLookbackTicks` scale by the same D5 band
  multiplier the mean-reversion uses (fleeting 0.5× … undying = the memoryScore
  stops decaying on the human clock; erosion becomes event-driven, matching the
  resentment law it was always meant to mirror). [CORRECTED 2026-08-02
  (fp-audit), chair ruling R7 — the audit proved the half-life alone reads
  nothing old:] `relationshipMemoryWeight` HARD-ZEROES any row older than the
  24-tick lookback BEFORE the half-life applies (`if (age > maxLookbackTicks)
  return 0` — relationshipMemory.js:127; `memoryEntry` then drops the row,
  :136), and 24 ticks is ~24 weeks to ~1.8 years by INTERVAL_WEEKS — 20-80×
  short of "forty years". The cutoff routes through collectMemories to EVERY
  store, turningPoints included, so there is no fallback archive either. Both
  constants are already threadable ({halfLifeTicks, maxLookbackTicks},
  :116-117) — THREADING THE SECOND IS THIS WAVE'S NEW WORK, carrying its own
  pins (below), never an assumed substrate.
- **Force / counterforce, same evidence:** longer memory is MORE grievance fuel
  (revanchism reads decayed memoryScore — the seam directly feeds war appetite in
  long-memoried cultures); the counterforce reads the SAME lengthened record — the
  bright lane remembers too (gift_forgiven crossings, debt repaid, the burial's
  suppression receipt all persist on the same clock). An undying town holds its
  grudges AND its gratitudes; the band lengthens both signs or it is a ratchet
  (the pin below).
- **THE OLDEST-WOUND READ:** a pure read over the incident rows already stored
  (type + tick — §2 row 11): `foundingWoundOf(pairKey)` returns the oldest
  still-scoring typed wound with its age in years and, where the wound's producing
  event receipted a counterpart, the name. INT-8's payoff sentences consume it; no
  new storage (the read derives "the sack of Thornwall, forty years gone" from what
  the ledger already keeps — and the row is still there ONLY BECAUSE this wave
  scales the LOOKBACK WINDOW with the band, not the half-life alone [CORRECTED
  2026-08-02 (fp-audit)]: under the default 24-tick window a forty-year wound is
  gone from every store, which is precisely why the seam must close first).
- **THE INHERITED HOLDER CHAIN:** `originHolderId` preserves the FIRST holder across
  chained successions (V-7 already marks `inherited:true`; the field answers WHO
  first bore it). Read-side: `grudgeLineageOf(grudge)` — "a grudge older than either
  man." Never a dynasty graph (§2 row 17's law): one id, stamped once, immutable.
- **Belief posture:** memory is per-observer by construction (each side's ledger is
  its own); the seam scales EACH observer's clock by ITS OWN lifespan band — a
  fleeting town forgets a wound the undying counterpart still nurses, and the
  asymmetry is the drama (receipted when it decides: "Thornwall had forgotten;
  Karak-Vol had not").
- **Named-actor casting:** the payoff attribution names the original holder (the
  `originHolderId` NPC — durable H1 id; possibly long out of the roster's active
  circulation, named as history: "the grudge of old Master Berin, carried by three
  successors").
- **Pins (negative hardest):** BOTH-SIGNS scaling (hardest — the anti-ratchet pin):
  the band lengthens bright-lane memory exactly as it lengthens dark-lane memory,
  property-shaped over the weight function — same multiplier, both signs, AND BOTH
  CONSTANTS [CORRECTED 2026-08-02 (fp-audit)]: the band-scaled LOOKBACK window
  admits bright-lane rows (gift_forgiven, debt repaid) exactly as it admits
  wounds, or the seam ships a grudge ratchet; the FORTY-YEAR pin [CORRECTED
  2026-08-02 (fp-audit) — the current pin set never tests age beyond the default
  window]: on a REAL GENERATED CORPUS under an `undying` band, an incident row 40
  campaign-years old still scores non-zero and returns from `foundingWoundOf`
  (executed, not reasoned — the default window is 24 ticks and this pin is the
  proof the seam opened it); the dark byte-identity golden (a live module — the
  fence captured FIRST, the J1 precedent); the fleeting negative (a fleeting-band
  town under the lit seam decays FASTER than the human default — the band goes both
  ways); the asymmetric-pair fixture (one wound, two bands, two decays, the
  difference receipted when it decides an outcome); the chain-immutability pin
  (`originHolderId` survives a second succession UNCHANGED — first holder, not
  last); JSON-round-trip + regen/undo on the new field (a regen that rebuilds the
  ladder re-stamps only where inheritance re-occurs; undo restores the field with
  the record; import validates the id against the roster or drops to absent —
  never a dangling read).
- **THE DOSSIER ROUND-TRIP PIN [CORRECTED 2026-08-02 (fp-audit) — the surveys
  gathered ZERO UI evidence (§2 preamble); the neighbour-card FAMILY exists
  (src/components/settlementDetail/SettlementDetailLinkNeighbourCard.jsx), the
  exact panel and line placement are VERIFY-AT-BUILD, fallback landing = that
  card]:** the town page's neighbours/relationship card shows the oldest-wound
  line where one still scores — "Oldest wound: the sack of Thornwall, forty years
  gone." Open the town, see what the town cannot forget; walk to the incident row.
- **Clock:** the seam IS a clock correction — half-life 4 ticks AND lookback 24
  ticks, EACH × the D5 band when lit [CORRECTED 2026-08-02 (fp-audit)]; all
  denominations INTERVAL_WEEKS under SP-7's assertion. Fast: nothing new fires.
  Slow: everything — this wave is the slow verdict's custodian.
- **Posture consumption:** none directly (a memory law, not a decision surface);
  its products feed every decision surface above.
- **Bands:** the band multiplier table is the EXISTING D5 table (no new bands — the
  seam adopts, never invents); the oldest-wound scoring floor (below it, no line).
- **Endings vocabulary:** none of its own; it makes INT-3's and INT-6's endings
  attributable.
- **Couplings:** §6 rows 2, 10, 12 — memory is the interior's import surface;
  DESIGN_FP_COUPLINGS.md walks what writes into it.

### INT-6 — DELIBERATE FORGIVENESS (settled ruling 7; flag
### `deliberateForgivenessEnabled`; historical archetype: the Edict of Nantes — a
### crown decreeing the wars of religion buried, at a price, over a party that never
### forgave the burying; and its Revocation — the dig-up that emptied the towns)
**Scope:** the deliberate arm the survey proved absent ("a court cannot decree a
grudge buried; it can only do the things that swing the warmth state"): THE BURIAL —
a seat formally buries a named grudge ledger against a named counterpart, at a
price; and THE DIG-UP — the counterforce, priced off the same record.
**Model:** §4 `spatialLedgers.burials`, ONE writer `burialLedger.js` (the
REPUDIATE_TREATY twin in shape: exact-pair, deliberate, receipted, feeding existing
casus machinery — but bright).
- **Law:** suppression, never deletion (§1b), IN TWO ARMS WITH TWO SCOPES
  [CORRECTED 2026-08-02 (fp-audit), chair ruling R7 — respecced against the
  tree; J-INT-14 rules the fork]: (i) the REVANCHISM arm is family-scoped
  EXACTLY — the read iterates typed incidents (grievanceRead.js:79-89), so rows
  classified to the covered woundFamily stop counting, WITH A RECEIPT NAMING THE
  BURIAL; an uncovered family's rows count on untouched. (ii) the GRIEVANCE arm
  CANNOT be family-scoped — `scoreGrievanceLean` composes two FAMILY-BLIND edge
  scalars (0.65 × resentment + 0.35 × memoryScore, §2 row 12) and §4 declines to
  decompose resentment by family — so a held burial applies a BANDED, RECEIPTED
  DISCOUNT to the edge's grievance read AS A WHOLE, the family named FOR
  LEGIBILITY, never for scoping, and NEVER a zero (a zero on a family-blind
  scalar would be over-broad where other wounds stand, or a lie where the label
  claims family scope). Every incident row stays, both arms
  (grievanceRead-side consumption — the §1b-B suppress-the-score idiom). The
  reframe layer's bright crossing (§2 row 14) remains the ORGANIC lane; the
  burial is the DELIBERATE one — two lanes, one substrate, and the burial's
  warmth effects run through the EXISTING levers it pays with.
- **THE WOUND FAMILIES (the closed vocabulary §4 promises — AUTHORED HERE
  [CORRECTED 2026-08-02 (fp-audit): six references existed, zero enumerations,
  and the "existing typed-wound families" the volume claimed to reuse do not
  exist — the tree's only typing is the OPEN substring regex WOUND_TYPE_RE,
  grievanceRead.js:48, the exact shape the finite-semantics law forbids]):**
  seven families partitioning the incident-type space — {armed_conflict (war),
  betrayal (betray), tribute_burden (tribute), conquest_occupation (conquest,
  occupation), raid_seizure (sack, raid, seiz-), imposition (impos-), contest
  (contest_loss, contest_forestalled)}. The regex is REPLACED at its call sites
  by a single-writer typed classifier `woundFamilyOf(incidentType)` — TOTAL over
  the incident-type inventory, walker-asserted (an incident type with no family
  reds the walker; new incident types must register a family or the walker
  refuses them). THE CLASSIFIER IS THIS WAVE'S FIRST SLICE — its own commit,
  behavior-identical where the regex matched (golden-pinned), NEW WORK never
  assumed substrate. Import validates `woundFamily` against this enum; never a
  free string.
- **THE PRICE (a burial is a package, not a signature):** the decree binds only
  when its price executes — a composed package through EXISTING physics:
  restitution/gift streams (generosityReactions' machinery — the widow's-mite law
  prices a poor town's burial dearer in meaning), a public rite where FAITH's
  shared-rite term family exists (SP-3), and a LEGITIMACY CHARGE when a live bloc
  holds the grudge being buried (burying the war party's wound over their counsel
  is an INT-2 override — it writes the decision-grievance `grudge_buried` entry;
  reconciliation abroad can cost the seat at home, which is the drama). Out-of-
  posture burials (a martial seat burying a war grudge) price the charge higher
  through `postureOf` — priced and receipted, never forbidden.
- **THE DOMESTIC DIVIDEND (the counterforce at home, off the SAME record —
  INT-4's dividend shape [CORRECTED 2026-08-02 (fp-audit): the audit proved the
  domestic ledger ran one direction only, which made J-INT-5's autonomous arm
  dead code — a books read that weights seat survival (INT-1) can never CHOOSE a
  verb whose entire modelled home effect is a legitimacy charge plus downside
  risk]):** a burial HELD past its hold-dwell pays the seat back at home: a
  banded LEGITIMACY DIVIDEND and a relief term on the commons grievance
  composite, both DISCOUNTED by the town's own believed severity of the feud it
  ended — a burial of a wound the town still feels reads as SURRENDER (no
  dividend; the charge stands), a burial of a wound the town is tired of reads
  as STATESMANSHIP (the dividend lands). Both readings receipted, both pinned,
  the same evidence scoring both (the belief-side severity read INT-4's
  dividend already uses). The HOLD-DWELL VERDICT READ that scores this is the
  producer of the {buried_and_blessed, buried_and_borne} endings below — "the
  seat that made peace and was rewarded for it" becomes measurable at soak
  (INT-7's envelope) instead of structurally impossible.
- **Two-sided by belief (Law One):** the burial closes the DECREEING side's ledger
  reads only. The counterpart LEARNS of it at news speed (distance-priced news) and
  its own ledger is its own — a burial the counterpart never answers leaves their
  casus lanes untouched (unilateral burial is half a peace, and the receipt says
  which half). The ANSWERED burial (counterpart buries in kind, or the pact grammar
  seals it as a term — SP-3's family) is the full reconciliation; gratitudeBonds'
  court-to-court friendship clock starts where it lands.
- **THE DIG-UP (the counterforce, same evidence):** a held burial may be REPUDIATED
  — by the seat itself (posture swung, new ruler's re-read per INT-3), or petitioned
  by a revanchist bloc past its patience band. The price reads the SAME record: a
  credibility charge (the burial was the seat's word — informationStatecraft's
  existing credibility machinery), the counterpart's grievance RE-ARMS with the
  betrayal stacked on the original wound (a typed incident through the existing
  incident writer — the dig-up is itself a wound), and the price SCALES WITH HELD
  AGE (banded: dug up within the season, a lie; dug up a generation later, a
  betrayal of the dead — the age read rides INT-5's corrected clock). Both
  directions receipted.
- **Named-actor casting:** the burial is spoken BY the seat-holder — facets color
  the receipt (a proud ruler's burial is dearer and INT-8's pool says so); the
  grudge-holding bloc's champion (INT-2 cast) answers in the override receipt; the
  heir's re-read of an inherited burial is INT-3's machinery pointed here
  ({reaffirmed, dug_up} — the son honours or unearths the father's peace, the
  oath-holder sentence's bright sibling).
- **Belief posture:** the seat buries what IT believes the grudge to be; a burial
  decreed on a misread of the counterpart's ledger (they hold a second, unburied
  wound family) reconciles less than the seat paid for — reachable, receipted post
  hoc ("the grain was given, and Karak-Vol's other grudge still burned").
- **Pins (negative hardest):** the SUPPRESSION-NOT-DELETION pin (hardest, two
  arms): (i) a held burial ⇒ covered reads return 0 with the burial receipt AND
  every underlying incident row survives byte-identical; (ii) the dig-up ⇒ reads
  RESUME from the surviving rows plus the new betrayal wound — nothing was lost,
  which is the whole design; the unilateral-burial negative (the counterpart's
  casus lanes untouched — seed the counterpart's ledger non-empty first, §1c); the
  family-scope negative [CORRECTED 2026-08-02 (fp-audit) — re-scoped to
  J-INT-14's two arms]: an uncovered family's REVANCHISM read is unaffected
  (typed rows, exactly filterable), while the GRIEVANCE discount is banded and
  receipted and NEVER a zero — both arms asserted on one fixture holding two
  wound families; the DOMESTIC VERDICT pin — same held burial, two
  believed-severity states ⇒ surrender (no dividend) vs statesmanship (the
  dividend lands), both receipted; the price-executes gate (a decree whose package fails
  to execute — insufficient stores — binds NOTHING and receipts the failure: the
  poor seat that could not afford its peace); the bloc-override entry (exactly one
  `grudge_buried` decision-grievance when a live bloc held the wound; none when
  none did); the age-scaled dig-up price (two fixtures, two ages, two banded
  prices); reachability on the burial gate's conjunction (a real generated corpus
  produces an eligible burial candidate — §1c); JSON-round-trip + regen/undo/import
  on the burials ledger (regen preserves held burials with the pair; undo restores
  state exactly; import validates woundFamily against the closed vocab); the
  writer/reader spelling pin (boot burialLedger.js, read through grievanceRead —
  §1c); dormancy golden.
- **THE DOSSIER ROUND-TRIP PIN [CORRECTED 2026-08-02 (fp-audit) — surveys
  gathered zero UI evidence; the neighbour-card FAMILY exists
  (SettlementDetailLinkNeighbourCard.jsx), exact panel and line placement
  VERIFY-AT-BUILD, fallback landing = that card]:** the town page's
  neighbours/relationship card shows the burial line — "The grudge with Ashford:
  buried by decree, spring of year 34; the price was paid in grain and pride." A
  dug-up burial shows the scar — "…unearthed, year 41." Walk from the line to
  the decree receipt to the surviving wound rows beneath it.
- **Clock:** the decree is an event; the package executes on transfer physics'
  own cadence; the HOLD is the slow verdict (two-timescale echo: fast = the decree
  read aloud; slow = whether it holds a generation). Suppression credits FULLY only
  past a banded hold-dwell (a burial is believed when it has held, not when it is
  announced — the counterpart's casus discount phases in on the dwell); the
  DOMESTIC VERDICT scores at the same hold-dwell maturity [CORRECTED 2026-08-02
  (fp-audit)] — the dividend is earned by holding, never by announcing.
- **Posture consumption:** the burial decision consumes `postureOf` +
  `riskToleranceOf` (a bold seat buries bigger wounds); the dig-up petition
  consumes the bloc's patience band (INT-2).
- **Bands:** package-adequacy derivation (wound magnitude × age → price),
  legitimacy-charge band, hold-dwell band, dig-up age-price curve, patience band,
  the suppression phase-in, the grievance-discount band (J-INT-14's arm ii), the
  domestic-dividend band + believed-severity discount [CORRECTED 2026-08-02
  (fp-audit)].
- **Endings vocabulary:** {buried_and_blessed, buried_and_borne,
  buried_and_answered, dug_up, lapsed_with_the_pair} [CORRECTED 2026-08-02
  (fp-audit): buried_and_held SPLIT on the hold-dwell domestic verdict —
  BLESSED (the dividend landed; statesmanship) vs BORNE (held abroad, unforgiven
  at home; the charge stood); the verdict read above is the producer] — share
  envelopes in INT-7 (dug_up rare-but-present — a world of permanent burials is
  a delete pretending otherwise; buried_and_blessed floored — a world where no
  held peace is ever blessed is the one-way ledger this wave just cured).
- **Couplings:** §6 rows 3, 5, 7, 9 — the burial consumes TRADE's transfer physics,
  FAITH's rites, GRAMMAR's sealing terms, and drives POP's return migration
  (the reconciled road home); DESIGN_FP_COUPLINGS.md walks each.

### INT-7 — LEGITIMACY'S ROW + THE INTERIOR ENVELOPES (settled ruling 5; flag
### `legitimacyCrossingsEnabled` for the crossing receipts; the certification row
### and envelopes are measurement, no flag — WR-9's shape; no historical archetype:
### this wave is the instrument bench)
**Scope:** the estate's most load-bearing interior scalar becomes standalone-
certified and soak-measured; the interior program gets its endings envelopes.
- **THE CROSSING RECEIPTS (the SP-5 instantiation):** legitimacy is the confidence-
  stock family's "seat's domestic credit" member (spine SP-5 — the family grammar:
  banded stock, event-moved, receipts on band crossings). The crossing detector
  READS the stock after the existing typed-hit writers have moved it (never a
  second writer — §1b) and emits the crossing beat: "the seat stands Endorsed" /
  "the seat has fallen to Crisis." One receipt per crossing, hysteresis on the
  existing band edges (no flutter — the deadband is the bands' own width),
  id-carrying, WHAT_PHRASES + heraldRouting registered, pacing-registered
  (crossings are rare by construction; the governor barely sees them).
- **THE CERTIFICATION ROW:** keyed on the crossing events + the invariant EVERY
  CROSSING HAS A HIT BEHIND IT (the a_coup_verdict_has_a_coup_behind_it discipline
  pointed at legitimacy: each crossing receipt's causal hit enumerable from the
  typed-hit vocabulary — assize, commons rung, ladder tax, upswing dividend,
  calamity, occupation, canon, reseed-on-transfer); soakEvidence measured, with the
  reseed case certified separately (a transfer reseed that crosses bands receipts
  AS the transfer's crossing, cause-typed — never a phantom hit). stateKeys stays
  honest per the survey's law: the score is an unconditional field, so aliveness
  rides the EVENT literals (the row documents this, as faction's row does).
- **THE INTERIOR ENVELOPES (WR-9's discipline for this program) [CORRECTED
  2026-08-02 (fp-audit): the audit found 12 of 17 declared tokens unenveloped —
  the gather below is TOTAL over every token §5 declares, grouped by family; a
  declared ending with no envelope is the drift this correction retires]:**
  — **INT-2 counsel {heeded, overridden}:** the override share carries a FLOOR
  (INT-3's grievance chain needs overrides to exist — a hall always heeded means
  the clamp never binds and blocs are selectors in disguise) AND a CEILING (a
  hall routinely ignored means the loading never entered the chooser) — this is
  the direct empirical test of §1b's "positions are pressure, never selectors";
  the CLAMP pin proves a bound, only this envelope proves the distribution.
  — **INT-3 {held, overturned_war_party, overturned_peace_party, demand_honoured,
  demand_betrayed, repudiated_by_heir, reaffirmed_by_heir, exile_returned,
  exile_faded, exile_reconciled}:** coup verdicts carrying a named decision get a
  floor (the join must actually fire at soak scale or INT-3 is decoration) and a
  ceiling (if EVERY coup names a foreign decision, the join confabulates); BOTH
  overturn polarities present; the succession pair distributed with a FLOOR on
  reaffirmed_by_heir and demand_honoured (the bright lane must fire); all three
  exile endings reachable at century scale, exile_reconciled floored.
  — **INT-4 {paid_and_fell, paid_and_stood, paid_and_forgiven}:** paid_and_fell
  rare-but-present (every payer falling is a ratchet, none falling is
  decoration); paid_and_forgiven FLOORED (the dividend must actually land).
  — **INT-6 {buried_and_blessed, buried_and_borne, buried_and_answered, dug_up,
  lapsed_with_the_pair}:** dug_up rare-but-present; buried_and_blessed and
  buried_and_answered FLOORED (the bright-lane counterforces must be measurable
  or the burial is a one-way ledger).
  Every envelope carries a mutant negative control (house law).
- **THE TEMPO ENVELOPE, IN TWO PARTS [CORRECTED 2026-08-02 (fp-audit): the old
  single floor had no denominator and measured a LARGER, partly-new event set
  against a baseline that never measured it — it would clear by construction and
  detect nothing]:** (a) THE REGRESSION FLOOR — over the SAME event set the
  baseline measured (stressor drama, coup verdicts included), denominated
  PER-SETTLEMENT-YEAR on the named fixture: the 2/100 baseline is 2 drama-years
  per 100 years ON THE 4-SETTLEMENT CENTURY FIXTURE (= 0.005 per
  settlement-year, §2 rows 19/22) — the only honest comparison against the
  measured number, portable because the denominator travels; (b) THE NEW-KINDS
  BAND — a separate ABSOLUTE envelope, floor AND ceiling, over the kinds this
  program mints (legitimacy crossings, burials, dig-ups, domestic verdicts,
  émigré arcs), authored fresh at soak rather than anchored to a number that
  never measured them — the CEILING is the counterforce every other envelope in
  this wave carries (an uncountered drama floor is standing pressure to tune
  interior drama upward). The program's acceptance: long-form readers get
  interior story, not only interior motion — and the instrument can actually
  detect the thinness it exists to fix.
- **v5 channels:** the burials ledger and the decision-grievance entries join the
  drop-when-empty census (absence-is-evidence per §1c); the row documents
  relationshipStates' structural unobservability as inherited, not cured (curing it
  would mean making a live container conditional — out of scope, recorded).
- **Pins:** crossing-has-a-hit (the invariant, walker-shaped over the typed-hit
  vocabulary); the hysteresis negative (a score oscillating within one band mints
  ZERO crossings — seed the oscillation); the reseed crossing's cause-typing;
  dormancy golden for `legitimacyCrossingsEnabled`; the envelope harness boots on a
  real soak corpus (VERIFY-AT-BUILD: the harness pattern is WR-9's; if WR-9 has not
  landed at build time, this wave lands the interior half standalone and WR-9
  adopts it — coordination note, not a blocker).
- **THE DOSSIER ROUND-TRIP PIN [CORRECTED 2026-08-02 (fp-audit): exact panel
  VERIFY-AT-BUILD — the power-structure surface FAMILY is verified
  (EngineSections.jsx / PowerStructure.jsx render it), the crossing line's panel
  is not; fallback landing = the ruling-power card family]:** the town page's
  ruling-power card shows the band word and the LAST CROSSING with its cause —
  "Standing: Contested (fell year 38 — the assize was a sham)." Walk from the
  card to the crossing receipt to the hit.
- **Clock:** crossings are event-driven (the stock has no passive clock — §2 row 1;
  the row certifies that fact rather than fighting it). Fast: the crossing beat.
  Slow: the band dwelling — the envelopes measure time-in-band distributions.
- **Bands:** the band edges are EXISTING (Endorsed…Crisis — no new bands); envelope
  shares are the new authored surface (owner-signed at the soak, per THE PROMISE).
- **Couplings:** §6 rows 2, 6, 8, 10 — legitimacy is the interior's common currency;
  every layer's receipts eventually price in it.

### INT-8 — THE INTERIOR VOICE (spine req. 11 — narration parity; no flag of its own
### (§3); historical archetype: Froissart — the chronicler who made the deeds
### legible, without whom the deeds might as well not have happened)
**Scope:** the survey's verdict — "the interior engine's memory outruns its voice;
war still owns the best sentences" — cured to war's density class, plus the two
receipted voice defects retired.
- **THE POOL UPGRADE:** seeded four-variant receipt pools (war's grade — the
  WAR_RECEIPTS shape, seeded per entity so same-seed worlds keep their sentences)
  for: coup verdicts (hold + fall, replacing the 2-template/4-fixed-sentence
  inventory), faction competition's seven types (replacing the fixed verb table),
  the investiture beat's variants, legitimacy crossings (INT-7's kinds), counsel
  given/heeded/overridden (INT-2), the BOOKS-STANDING receipts (INT-1 —
  change-gated, lowest class; §9 lists two of its sentences as acceptance
  criteria, so the pool must exist [CORRECTED 2026-08-02 (fp-audit)]), the
  crossing + rally receipts (INT-4), burial/answer/dig-up + the domestic verdict
  (INT-6), the émigré's flight/shelter/return/fade (INT-3b).
  New-kind pools ride their kinds' flags; upgrades to LIT kinds (coup, faction,
  investiture) are same-seed prose shifts on shipped worlds and ship ONLY under
  J-INT-13's RECORDED RULING [CORRECTED 2026-08-02 (fp-audit)] — owner-signed or
  chair-recorded in FABLE_VALIDATION_QUEUE.md BEFORE the wave starts, field-level
  diff and estimated golden blast radius quoted in the re-record header (WR-0b's
  discipline); absent the ruling, the lit-kind pools ship DARK behind a
  prose-version flag and light with the batch, every existing golden
  byte-identical — never silent, and never merely "disclosed".
- **THE PAYOFF ATTRIBUTION SENTENCES (the PARTIAL grudge cured):** when revanchism
  or an inherited grudge materially decides an outcome (war mint, verdict tilt,
  challenge), the receipt consumes INT-5's reads: "the grudge was older than either
  man: the sack of Thornwall, forty years gone, still burned" — foundingWoundOf +
  grudgeLineageOf, band-worded, only past the same margin discipline as INT-4's
  rally receipt (no confabulated attribution; the margin negative pins).
- **THE TWO CURES (ratchet rows RETIRED, not frozen):** (i) deploymentReturn.js:471
  — the vassal-homecoming coup receipt drops "Hold chance ${pHold}, roll ${roll}"
  for pool prose (dice stay in metadata, as the main lane already rules); its
  baseline rows DELETE and the prose-numerics ratchet shrinks. (ii) the
  postureReasons float leak — banded phrase tables replace `toFixed(2)`
  interpolation in the persisted reasons; AND THE WALKER'S BLIND SPOT CLOSES
  (structural prevention, §1c): proseNumericsWalk follows push-target arrays out of
  prose-named functions, and the guard-the-guard arm proves the extended walker now
  CATCHES the exact pre-fix postureReasons pattern planted in a fixture.
- **SP-6 checklist:** every kind above completes the narration kit — two-voices
  register, band-word vocabularies, address law (full chain, settlements BY NAME,
  typed action, recorded reason), id discipline, WHAT_PHRASES + heraldRouting
  registration, pacing registration. The totality walkers red on any miss (house
  law; §1c).
- **Pins (negative hardest):** the attribution margin negative (sub-margin
  contributions keep generic prose — both INT-4's rally and INT-8's payoff shapes);
  pool determinism (same seed ⇒ same sentence, per-entity keys, draw-accounted);
  the walker guard-the-guard (the planted pre-fix pattern caught); the ratchet
  DOWN-only assertions (both baselines shrink and the walkers hold them down); the
  disclosed-shift goldens for every lit-kind prose change (field-level diffs quoted
  in the re-record headers, the WR-0b discipline); id-carry on every new push site.
- **THE DOSSIER ROUND-TRIP PIN [CORRECTED 2026-08-02 (fp-audit): the
  World Book/Herald FAMILY is real (the Herald shipped); the exact chronicle
  panel per kind is VERIFY-AT-BUILD, fallback landing = the Herald's registered
  desks]:** the chronicle surface (World Book/Herald family) renders every new
  kind through its registered phrases — open the town's chronicle, find the coup
  told in pooled prose with the decision named (INT-3), the wound named (INT-5),
  the burial named (INT-6); walk each sentence's id back to its ledger row. The voice pin IS a dossier pin — a sentence that cannot be walked
  back is a defect.
- **Clock:** none (voice). Fast/slow echo lives in WHAT the sentences narrate:
  the fast beats and the slow verdicts each have their register (SP-6's two
  voices).
- **Bands:** pool weights are uniform (seeded pick, war's shape); the attribution
  margins are INT-4/INT-5's bands consumed, not new.
- **Endings vocabulary:** none new — this wave SPEAKS the others'.
- **Couplings:** §6 all rows — the voice is how every coupling becomes visible to
  the reader; DESIGN_FP_COUPLINGS.md's every row names the sentence this wave must
  be able to print.

---

## §6 THE COUPLING REGISTER (the interior is every other layer's driver — this is
## deliberately the volume's largest section. Twelve directed rows, each naming its
## reads, receipts, counterforce, owning wave/program, and historical archetype.
## DESIGN_FP_COUPLINGS.md walks every pair at full grain under the spine's §4
## doctrine; the rows below are the interior's half of that contract — where a row
## and the couplings volume disagree, report the conflict, never fork the design.
## NO ROW IS DECLARED EMPTY: the seat decides, pays for, and remembers something in
## every layer — an interior row with no coupling would mean a substance no court
## cares about, which is a design defect by definition.
##
## [CORRECTED 2026-08-02 (fp-audit)] THE POINTER GRANULARITY RULE: the couplings
## volume walks 21 UNORDERED pairs keyed CPL-N, each walked both directions
## inside one row; this register is DIRECTED — TWO rows here map onto ONE CPL
## row, and the CPL row is the merge point of record. Every trailing pointer
## below cites the CPL id in the couplings volume's own name order, plus the
## direction this row contributes; the layer spellings are the couplings
## volume's (POP, INFO). THE CW-0 OBLIGATION (standing, per the couplings
## volume's inclusion ratchet): any interior wave landing a cross-layer read
## adds its CW-0 registry row {pairId, direction, read, receiptField,
## counterforce, flags, owningVolume, owningWave, intendedDesk} IN THE SAME
## COMMIT — the walker asserts it, and a cross-layer read with no registry row
## reds the build.)

**Row 1 — INTERIOR → WAR (the seat chooses the war).**
Reads: seatBooks (INT-1) weighting WR-1's four-term read; bloc loading on
deploy/sue_for_peace (BUILT, §2 row 5); legitimacy_hunger's open (BUILT,
warReasons.js:489-500); the organizing grievance loading the coup lane against the
war decision (INT-3). Receipts: the deciding-term receipt names WHOSE BOOK decided
(WR-5's sentence); the counsel beat; the join receipt. Counterforce, same evidence:
the commerce bloc and the settlement-position book score the SAME war as ruin —
the hall that pushes the march contains the party that will name it in the verdict.
Owning waves: INT-1/INT-2/INT-3 consume-side; WR-1/WR-5 war-side. Archetype: February
1917 — the war outlived the crowd's patience, and the crowd replaced the seat.
→ CPL-6 (WAR × INTERIOR), the INTERIOR→WAR direction. [CORRECTED 2026-08-02 (fp-audit)]

**Row 2 — WAR → INTERIOR (the war bills the home).**
Reads: exhaustion tilting verdicts (0.22, BUILT); reinforcement costs biting
public_legitimacy (BUILT, warDeployment.js:~2038); climb-down legitimacy hits +
credibility charges (BUILT, momentum.js:1255-1290); the attributed pressure receipt
naming war_exhaustion (INT-4); time-in-band envelopes registering wartime legitimacy
dwell (INT-7). Receipts: "the seat weakens under a war grown long"; the rally receipt
when the war STEADIES the seat (INT-4 — the counterforce made visible). Counterforce,
same evidence: the SAME war that exhausts the crowd rallies it while it is believed
winnable (computeWarSentiment's two signs, BUILT — disposition.js:223); the dividend
discount (INT-4) prices the peace the war eventually buys. Owning wave: INT-4.
Archetype: the Danegeld — the paying, not the enemy, unmade Æthelred's seat.
→ CPL-6 (WAR × INTERIOR), the WAR→INTERIOR direction. [CORRECTED 2026-08-02 (fp-audit)]

**Row 3 — INTERIOR → GRAMMAR (the seat signs, refuses, and repudiates).**
Reads: seatBooks on every SP-3 accept/refuse (INT-1); the re-read triggering
succession-repudiation through GRAMMAR's writer (INT-3 — the interior owns the
trigger, GRAMMAR the instrument); the burial sealed as a pact term (INT-6 → SP-3's
term families); refusal costs landing on interior ledgers (WR-5's G2, consumed).
Receipts: "whose books the refusal served"; "the father swore it; the son burned
it" (the oath-holder identity — GRAMMAR's substrate, this volume's sentence; the
IMPOSSIBLE drama becomes tellable exactly at this join). Counterforce, same
evidence: the heir who HONOURS the oath earns the credibility dividend off the same
succession record ("the son kept the father's word") — reaffirmation is as
receipted as repudiation (INT-3's bidirectional pin). Owning waves: INT-1/INT-3/INT-6.
Archetype: Brest-Litovsk — the successor regime repudiating the fallen seat's war,
at a price named in the treaty itself.
→ CPL-21 (GRAMMAR × INTERIOR), the INTERIOR→GRAMMAR direction. [CORRECTED 2026-08-02 (fp-audit)]

**Row 4 — GRAMMAR → INTERIOR (the pact organizes the hall).**
Reads: a pact signed/refused against the loaded weights writes the decision
grievance (INT-3's vocabulary: pact_signed/pact_refused/pact_repudiated); treaty
burdens breed the revanchist bloc (BUILT — factionRevanchism01, the term-burdened
faction as war party); expiry receipts (SP-3) relieving the strain term (INT-4).
Receipts: the counsel-override beat on the signing; the join receipt when the
sign-party or refuse-party takes the hall. Counterforce, same evidence: the SAME
pact that burdens the seats bloc enriches the commerce bloc (§2 row 5's two ends —
one treaty, two positions, receipted both). Owning waves: INT-2/INT-3/INT-4.
Archetype: the Corn Laws repeal — the policy signed against the party's wishes,
and the party splitting the seat over it.
→ CPL-21 (GRAMMAR × INTERIOR), the GRAMMAR→INTERIOR direction. [CORRECTED 2026-08-02 (fp-audit)]

**Row 5 — INTERIOR → TRADE (the hall prices the venture).**
Reads: the commerce bloc's loadings on severance/venture/pact verbs (INT-2's
generalization); seatBooks on venture appetite (INT-1 → TRADE's house decisions —
seam RESERVED at TR-7 [CORRECTED 2026-08-02 (fp-audit), cohesion pass]);
the burial's restitution package riding transfer physics (INT-6 — reconciliation
consumes grain); mercantile posture (SP-4 composing WR-2's mercantile channel,
consumed at trade bars). Receipts: counsel beats on trade verbs; the burial package
receipt ("paid in grain and pride"). Counterforce, same evidence: the war party
taxes the same ledger the commerce bloc grows — the seats bloc's levy and the Salt
Ring's counsel read one granary. Owning waves: INT-1/INT-2/INT-6; TRADE's volume owns
the house-side consumption. Archetype: the Medici — the bank that bought the
peace because war was bad for the ledger.
→ CPL-11 (TRADE × INTERIOR), the INTERIOR→TRADE direction. [CORRECTED 2026-08-02 (fp-audit)]

**Row 6 — TRADE → INTERIOR (the ledger crowns and uncrowns).**
Reads: prosperity as legitimacy's GENERATION SOURCE (BUILT —
factionDynamics.computePublicLegitimacy reads economicState, §2 row 1);
famine/debt lifting rebellion gates ×1.3 (BUILT, stressorGates); tribute drain →
economic coup footing (`economicCoupReadEnabled` — registered in §3's lighting
order); the commons tribute term (INT-4). Receipts: the attributed pressure receipt
naming famine/tribute; the crossing beat when prosperity's hits move the band
(INT-7). Counterforce, same evidence: the upswing dividend (+4, BUILT) and the
peace dividend (INT-4) read the same recovering ledger — the granary that starved
the seat refills and the crowd re-crowns it (live-state recomputation, §INT-3's
defusal). Owning waves: INT-4/INT-7. Archetype: the Flour War — bread prices as the
crown's standing, week by week.
→ CPL-11 (TRADE × INTERIOR), the TRADE→INTERIOR direction. [CORRECTED 2026-08-02 (fp-audit)]

**Row 7 — INTERIOR → FAITH (the seat kneels, adopts, and buries by rite).**
Reads: doctrine blocs loading stance verbs (INT-2's generalization — the zealot
bloc against the missionary-access term); seatBooks on stance choices (INT-1 —
DECLARED DEFERRAL, not a wired read: dark until a FAITH wave reserves the seam
per §3's rule [CORRECTED 2026-08-02 (fp-audit), cohesion pass]); the
burial's public rite arm (INT-6 consuming FAITH's shared-rite family where lit —
the degraded arm without it is the grain-and-decree package, named). Receipts:
counsel beats on stance moves; the rite-sealed burial's beat names the temple.
Counterforce, same evidence: the temple arm mediates the same grudge the zealot
bloc feeds (FAITH's mediation, GRAMMAR's generalization — one congregation, two
pulls, both scored off the local faith state). Owning waves: INT-1/INT-2/INT-6;
FAITH's volume owns stance/omen mechanics. Archetype: Canossa — the seat kneeling
in the snow because the interior could not afford the temple's anger.
→ CPL-15 (FAITH × INTERIOR), the INTERIOR→FAITH direction. [CORRECTED 2026-08-02 (fp-audit)]

**Row 8 — FAITH → INTERIOR (the god steadies or shakes the seat).**
Reads: religion's typed legitimacy hits (BUILT — §2 row 1's vocabulary); FAITH's
omen writes coloring the commons grievance composite (FAITH's program, landing on
INT-4's term architecture — famine-as-wrath reaches the rung ladder through
belief); the patron god's fall (FAITH's unseating) reaching the seat that
patronized it as a legitimacy hit with a named cause. Receipts: the crossing beat
cause-typed to canon/omen; "the seat stands in crisis — the god it crowned under
has fallen." Counterforce, same evidence: the same omen lens that reads calamity
as wrath reads recovery as favour — the bright reading is FAITH's to write and
INT-7's to certify (no wrath ratchet; both signs on one lens). Owning waves:
INT-4/INT-7 consume-side; FAITH owns the lens. Archetype: the Mandate of Heaven —
calamity read as the mandate withdrawn, prosperity as its return.
→ CPL-15 (FAITH × INTERIOR), the FAITH→INTERIOR direction. [CORRECTED 2026-08-02 (fp-audit)]

**Row 9 — INTERIOR → POP (the seat's standing moves the feet).**
Reads: the commons rung ladder is POP's popular-arc substrate (spine §3 FP-POP
rides §2 row 9 — legitimacy-gated by construction); the émigré departure (INT-3b —
the defeated leave, and SP-1 carries the named ones); the dig-up emptying the
town (INT-6's revocation arm feeding POP's departure evaluation — a seat that
unearths a buried peace makes its own believers into leavers); permit posture
through seatBooks (INT-1 → POP's permit table columns — seam RESERVED at
POP-5b's posture block [CORRECTED 2026-08-02 (fp-audit), cohesion pass]).
Receipts: the flight beat;
departure receipts naming the decree that moved them. Counterforce, same
evidence: the burial HELD is the road home — reconciliation feeds return
migration and the old-country pull off the same burial record (POP's
departure-memory arm reading INT-6's ledger). Owning waves: INT-3b/INT-6
consume-side; POP owns flows. Archetype: the Revocation of the Edict of Nantes —
the dig-up that emptied the towns; and the Huguenot return that never came, which
is also a story.
→ CPL-18 (POP × INTERIOR), the INTERIOR→POP direction. [CORRECTED 2026-08-02 (fp-audit)]

**Row 10 — POP → INTERIOR (the crowd remembers who it is).**
Reads: departure memory feeding grudges at both ends (POP's banded diaspora
memory landing in the same incident/grievance substrate INT-5 corrects — the
generation that left is a wound with a tick, readable by foundingWoundOf);
arrivals diluting blocs (a boomtown's newcomers hold none of the old wounds —
bloc formation reads the roster that IS, not the roster that was; the dilution is
emergent, receipted when a bloc dissolves below its floor); plague-year calamity
hits (BUILT — calamityKernel's response conditions). Receipts: the crossing beat
cause-typed to calamity; the bloc-dissolution beat naming the changed town.
Counterforce, same evidence: the same newcomers who dilute the Old Swords found
the new commerce bloc — one migration, two halls (formation reads the same
roster). Owning waves: INT-2/INT-5/INT-7 consume-side; POP owns the flows and the
diaspora ledger. Archetype: the diaspora that funds the reconquest — the spine
§4's own named archetype, landed at this row.
→ CPL-18 (POP × INTERIOR), the POP→INTERIOR direction. [CORRECTED 2026-08-02 (fp-audit)]

**Row 11 — INTERIOR → INFO (the seat's word is a currency it spends).**
Reads: climb-down credibility charges (BUILT); the dig-up's credibility charge
(INT-6 — the burial was the seat's word); the émigré as motivated source (INT-3b —
the pretender's account enters at his own credibility, and the host's
belief-selection is character); vetting as seat character (WR-7d's discipline,
generalized by INFO's program). Receipts: the charge beats; the exposure beat
when a planted tale unravels. Counterforce, same evidence: the seat that keeps
its word BANKS credibility on the same ledger the breaker drains — source
credibility is SP-5 family, event-moved both directions. THE DRIFT NOTE (§2
verified-absent register): informationStatecraft.js:112-113's header promises
seat-scoped credibility restoration on succession ("a new dynasty inherits the
paper, not the hatred") while the typedef carries only `people_held` — as built,
the town's credibility simply persists. THE FIX IS OWNED BY FP-INFORMATION
(their substrate, their writer); the interior's re-read (INT-3) DECLARES the
succession trigger it would consume and ships the consumption dormant until INFO
lands or corrects the doctrine — STOP-and-report if tempted to write credibility
state from an interior module. Owning waves: INT-3/INT-6 consume-side; INFO owns
the ladder. Archetype: the pretender's court believing its own dispatches — and
the ministers who learned to discount them.
→ CPL-20 (INFO × INTERIOR), the INTERIOR→INFO direction. [CORRECTED 2026-08-02 (fp-audit)]

**Row 12 — INFO → INTERIOR (what the hall believes moves the hall).**
Reads: believed external threat compressing bloc formation (BUILT —
settlementPolitics.js:489-513, siege/war-footing; survival blocs born of an
external rally); THE LURE's domestic edge (INFO's program: planted weakness
feeding a rival hall's confidence, planted wealth feeding its envy — landing on
the SAME believed-state reads INT-2's blocs already consume); who-knew-first in
contest windows (INFO's reputation race — the challenger who heard of the seat's
stumble a week early moves first; the race's consumers include the ladder's
challenge windows); the decision-grievance organizing on the PUBLISHED version of
a decision (INT-3's belief posture — the hall riots over the rumor of terms, and
the correction arrives too late). Receipts: the survival-bloc beat naming the
believed threat; the exposure beat when the lure is caught. Counterforce, same
evidence: the exposed plant reverses through the same credibility ledger (INFO's
expose verb) — the hall that was moved by the lie is moved again by its
unmasking, and the planter pays on row 11's currency. Owning waves: INT-2/INT-3
consume-side; INFO owns carriers and verbs. Archetype: the Ems Dispatch — a
doctored paragraph, a hall inflamed, a war chosen by a crowd that read an edit.
→ CPL-20 (INFO × INTERIOR), the INFO→INTERIOR direction. [CORRECTED 2026-08-02 (fp-audit)]

**The register's discipline:** every row above rides EXISTING reads or reads a §5
wave lands — leakage is not coupling (spine req. 8); every row names its
counterforce off the same evidence (req. 2); every cross-border read in every row
is belief-side (req. 1). The couplings volume owns the pair-by-pair walk,
including the pairs that do not touch the interior; this register is the
interior's binding half and the couplings volume MUST NOT weaken it — conflicts
report to the validation chair.

---

## §7 JUDGMENT BLOCKS (the Fable chair's rulings under delegation — vetoable here;
## an implementer NEVER re-rules these silently)

- **J-INT-1 (the books module coordination):** the two-books combination lands as
  the pure read-side module `seatBooks.js` AT WR-5 BUILD TIME (WR-5's implementer
  builds the combination there rather than inlining it in warTermination); if
  WR-5 has already built inline when INT-1 starts, INT-1's first slice is the
  behavior-identical extraction, golden-pinned. VETO: two books evaluators — the
  named defect either way.
- **J-INT-2 (the grievance is an entry, not a ledger):** decision grievances ride
  the EXISTING faction/succession records through their existing writers; no new
  ledger, no new writer. VETO orders `decisionGrievances` as a spatialLedgers key
  and accepts the second memory plane consciously.
- **J-INT-3 (no tribute→legitimacy write):** the narrated middle is attribution +
  the commons tribute term through the existing composite — NEVER a new direct
  legitimacy write from treaty state; the grain already bills through
  economic_capacity and the pressure lanes, and a parallel write double-counts
  the same drain. VETO adds the write and re-tunes every clamp it inflates.
- **J-INT-4 (suppression, never deletion):** the burial suppresses grievance-side
  reads with a receipt; every incident row survives; the dig-up resumes from the
  surviving rows. VETO clears ledger rows and accepts that undo/regen/audit all
  lose the wound's history.
- **J-INT-5 (the burial's two arms):** the burial is BOTH a DM-side approval-routed
  realm verb (the REPUDIATE_TREATY twin — table decree) AND an autonomous
  plan-lane act when lit (the seat may choose it, priced by posture and books).
  One writer serves both arms. VETO drops either arm (DM-only makes
  reconciliation a cheat code; engine-only takes the pen from the table).
- **J-INT-6 (the seam closes dark):** the D5 half-life correction ships behind
  `memoryHorizonSeamEnabled` even though it is a repair — relationshipMemory is a
  live lit-path module and the correction moves live behavior (dark ⇒
  byte-identical; the fence golden captured FIRST). VETO ships it as an unflagged
  fix with a disclosed same-seed shift across every relationship golden at once.
- **J-INT-7 (crossings certify the stock):** legitimacy's certification row keys
  on the SP-5 crossing events + the crossing-has-a-hit invariant — never on the
  raw score (an unconditional field certifies nothing; the survey's own law).
  VETO certifies score distributions directly and accepts a row that cannot
  distinguish silence from health.
- **J-INT-8 (the émigré caps and closes):** one live émigré errand per settlement
  pair (band); endings {returned, faded, reconciled} only — never death, never a
  resolved fate (product scope law, absolute); every close through SP-1's one
  writer. VETO widens the cap or adds an ending class (owner ruling required —
  the never-resolve-fates boundary is the owner's, not the chair's).
- **J-INT-9 (the walker extension lands with the cure):** INT-8's postureReasons
  fix is invalid without the proseNumericsWalk push-indirection extension and its
  guard-the-guard fixture — the instance AND the habitat, one commit
  (structural-prevention law). VETO fixes the instance alone and freezes the
  class's next member into the baseline like the last one.
- **J-INT-10 (the oath sentence waits for its substrate):** INT-3's heir sentences
  consume GRAMMAR's oath-holder identity; until it lands, the holder clause ships
  dormant and the repudiation receipts at settlement grain. VETO mints signer
  provenance in an interior module (a second writer for GRAMMAR's substrate — the
  named defect).
- **J-INT-11 (two chronic classes, the governor edits both) [CORRECTED
  2026-08-02 (fp-audit): the old wording bound one ambiguous "counsel" class
  while TWO distinct classes exist — the audit caught INT-1's per-pulse receipt
  escaping pacing entirely]:** (a) INT-1's BOOKS-STANDING receipts register at
  the LOWEST class and are CHANGE-GATED — emitted only on a weight-band or
  winning-book change, the agreement deadband the gate; (b) INT-2's BLOC COUNSEL
  beats register at a LOW class; overrides and joins register HIGH. Both are
  class ASSIGNMENTS into SP-6's significance family, never volume-minted scales.
  The Herald prints the hall's temper when it matters, not weekly minutes. VETO
  exempts either class from pacing and accepts the wallpaper.
- **J-INT-12 (the decision vocabulary is a projection):** INT-3's decision
  vocabulary maps 1:1 onto events the estate already receipts; adding a decision
  kind REQUIRES the underlying receipted event to exist first. VETO lets the
  vocabulary lead the events and accepts organizing grievances against decisions
  no reader can find.
- **J-INT-13 (the lit-kind pool upgrade is OWNER-GATED) [CORRECTED 2026-08-02
  (fp-audit) — the audit found the volume pre-authorizing a mass golden
  re-record that §11's verbatim binding of war §10.4 forbids ("a golden that
  moves unexpectedly is a STOP-and-report, never a re-record"), with no §7
  block; coup and faction receipts are among the highest-volume interior kinds
  in the golden corpus, and a same-seed prose shift on shipped worlds sits under
  THE PROMISE]:** INT-8's upgrades to LIT kinds (coup, faction, investiture)
  proceed ONLY against a ruling recorded in FABLE_VALIDATION_QUEUE.md
  (owner-signed or chair-recorded) BEFORE the wave starts, carrying the
  field-level diff and an estimated golden blast radius quoted in the re-record
  header (the WR-0b discipline). Until that ruling exists, the lit-kind arm is
  OWNER-GATED (§10.4's boundary list names it). VETO — the stated alternative
  the ruling weighs: ship the lit-kind pools DARK behind a prose-version flag
  and light them with the batch, keeping every existing golden byte-identical.
- **J-INT-14 (the burial's suppression scope — two arms, two scopes) [CORRECTED
  2026-08-02 (fp-audit): the old law promised family-scoped zeroes on BOTH
  reads; the grievance scalar is family-blind (0.65 × resentment + 0.35 ×
  memoryScore over two edge scalars) and cannot be family-scoped without
  decomposing resentment by family, which §4 declines]:** the REVANCHISM read
  suppresses family-scoped and exact (typed incident rows classified by INT-6's
  `woundFamilyOf`); the GRIEVANCE read takes a BANDED, RECEIPTED DISCOUNT on
  the whole edge, family named for LEGIBILITY only — never a zero. VETO takes
  one of the two shapes the chair rejected: (i) suppress revanchism only and
  leave grievance untouched (re-word the law and Herald sentence accordingly),
  or (ii) decompose resentment by family (a new memory plane — accept the
  lifecycle burden consciously).
- **J-INT-15 (the émigré is a projection, never a roster move) [CORRECTED
  2026-08-02 (fp-audit): the volume's most lifecycle-exposed wave had ruled
  neither the roster question nor the regen/undo/import paths]:** the exile
  STAYS in the HOME settlement's npcs[] — both towns' surfaces render PURE
  PROJECTIONS over the SP-1 errand record (guest-mark at the host, away-mark at
  home — never an "absence": the roster did not change). This is the only
  answer that satisfies spine req. 4 (casting is read-wiring, never new NPC
  state) and §4's no-new-ledger claim, and it keeps regen/undo/import to the
  errand record alone (the pinned triad in INT-3b). VETO moves the roster row
  between settlements and accepts the full lifecycle burden: regen re-derives
  rosters at both ends, undo must restore both, import must not strand a guest
  whose host was never imported — the estate's most-bitten class, chosen
  deliberately or not at all.

## §8 THE TUNING SURFACE (owner-signed at the soak, per THE PROMISE; every band
## named in §5, gathered — band FAMILIES shared with the spine keep the signature
## surface tractable)

INT-1 weight-derivation bands + agreement deadband + per-consumer color caps +
books-standing class assignment (SP-6 family) · INT-2 per-verb loading tables +
counsel margin + patience band + counsel-significance class assignment (SP-6
family) · INT-3 decision-load margin + join margin + re-read repudiation band +
émigré share/patience/cap + host-decision loadings + harboring-grievance
magnitude · INT-4 burden-presence bands per kind + dividend discount curve +
rally margin + treaty-burden cap · INT-5 the EXISTING D5 band table (adopted,
never re-authored — scaling BOTH memory constants) + oldest-wound floor · INT-6
package-adequacy derivation + legitimacy charge + hold-dwell + dig-up age-price
curve + suppression phase-in + grievance-discount band + domestic-dividend band
with believed-severity discount · INT-7 the endings share envelopes (TOTAL over
all 20 declared tokens, by family, bright-lane floors named) + the TWO-PART
tempo envelope (the regression floor per-settlement-year over the baseline's own
event set on the named fixture; the fresh floor-AND-ceiling band over the new
kinds) + time-in-band envelope shapes. [CORRECTED 2026-08-02 (fp-audit): this
table reconciled line-by-line against every §5 Bands field — the tuning audit
caught one band absent here and one band here absent from §5; both ends now
match. Significance classes are ASSIGNMENTS into SP-6's spine-owned family —
this volume references, never mints.] None a bare float on any surface; all in
one tuning table per wave (the house idiom); the spine's tuning-debt
acknowledgment (§5 of the spine) prices this section's growth deliberately.

## §9 HERALD + LEGIBILITY CONTRACT (the sentences this program must be able to
## say — an acceptance criterion, not decoration; every one carries id + full
## address chain + typed action + named settlements + recorded reason)

- "The Salt Ring counsels peace; the Old Swords call for the march." (INT-2)
- "The Old Swords called for the march, and the Margrave did not hear them." (INT-2)
- "Seat and town of one mind: the counsel weighed the realm's good." (INT-1)
- "The Margrave's counsel weighed her seat above the town, and the war went on."
  (INT-1)
- "The peace party holds the hall; the war the Margrave would not end is named in
  the verdict." (INT-3)
- "The Margrave sued for peace, and the hall grew quiet." (INT-3 — the defusal)
- "The father swore it; the son burned it." (INT-3, via GRAMMAR's oath-holder)
- "The son kept the father's word, and both towns remembered." (INT-3)
- "The defeated captain of the Old Swords rode east; Ashford's hall received
  him." (INT-3b)
- "They keep our traitor at their table." (INT-3b — the harboring grievance)
- "He paid the tribute of Ashford, and it cost him the seat." (INT-4)
- "He paid, and the town forgave him — the war was over." (INT-4)
- "The seat steadied — the war did what the court could not." (INT-4)
- "Thornwall had forgotten; Karak-Vol had not." (INT-5)
- "The grudge was older than either man: the sack of Thornwall, forty years gone,
  still burned." (INT-5/INT-8)
- "By decree of the seat, the grudge with Ashford is buried; the price was paid
  in grain and pride." (INT-6)
- "The peace held, and the town came to bless it." (INT-6 — the domestic
  dividend [CORRECTED 2026-08-02 (fp-audit)])
- "The grain was given, and Karak-Vol's other grudge still burned." (INT-6)
- "They dug up what their fathers buried, and the old wound bled new." (INT-6)
- "The seat stands Endorsed." / "The seat has fallen to Crisis — the assize was a
  sham." (INT-7)

## §10 SEQUENCING (spine §5 binds: the interior completions build LAST of the six
## programs, after POP, before the COUPLINGS cross-wires — every other program
## lands consumers these waves wire to the seat)

1. **Preconditions (build-order, not lighting):** WR-0..WR-0c landed (they are);
   WR-1..WR-5 built dark (the war program precedes all six FP programs — the
   books spec, the refusal lane, the war-side veto arm, and the re-read's war
   half all land THERE); SP-1..SP-7 landed (spine infrastructure precedes all
   six); GRAMMAR/INFO/TRADE/FAITH/POP volumes built dark per the spine's order.
   Where an interior wave names a degraded arm for a missing predecessor (INT-3's
   oath clause, INT-4's dark-`economicCoupReadEnabled` validity, INT-6's rite arm,
   INT-7's envelope-harness adoption), the degraded arm is EXPLICIT; silence
   means the precondition is hard.
2. **Internal order:** INT-1 → INT-2 → INT-3 (a+b, two commits) → INT-4 → INT-5 →
   INT-6 → INT-7 → INT-8. Each consumes the last: positions need books' receipts to
   name; the veto needs positions; the middle needs the join's receipt
   discipline; the burial prices off the seam-corrected clock; the envelopes
   measure everything before the voice speaks it. INT-5 may build in parallel
   with INT-4 by path (no shared files) at the implementer's option — the only
   sanctioned parallelism.
3. **THE LIGHTING ORDER IS §3's:** flags light at owner-signed soaks only, in §3's
   declared order; `settlementPoliticsEnabled`'s composition partner and the two
   registered existing flags (`economicCoupReadEnabled`, with
   `warDispositionEnabled` already lit in full_simulation) join the owner's
   lighting queue with this program's batch. Nothing here lights a flag, runs a
   soak, or ratifies a band.
4. **THE OWNER-HELD BOUNDARY IS UNCHANGED:** the release soak grid, the 300y
   rerun, the certification sweep over new receipts, and the tuning pass wait on
   the owner — and INT-8's LIT-KIND POOL UPGRADE sits with them [CORRECTED
   2026-08-02 (fp-audit)]: it proceeds only against J-INT-13's recorded ruling
   (a same-seed prose shift on shipped worlds is THE PROMISE's surface). INT-7's
   envelopes are the program's acceptance harness: the program is DONE when they
   hold on the owner-ordered soak, and not before.

## §11 IMPLEMENTER PROTOCOL

The war volume's §10 binds here VERBATIM (worktree + branch discipline, the
hard-gate line, no `git add -A`, `git stash` FORBIDDEN, never touch momentum.js,
never edit another program's dirty files, gate-tail discipline, one wave = one
commit, dormancy goldens captured FIRST, golden moves are STOP-and-report,
anchoredNegatives/seedFailures helpers, WHAT_PHRASES + heraldRouting +
operationRegistry registrations, report-don't-rule, CONFIRMED-or-PLAUSIBLE
labeling). Two deltas for this volume:

1. **The live-module fence list for THIS program:** relationshipMemory.js,
   commonsVoiceKernel.js, coup.js, rulingPowerCoup.js, npcLadderState.js,
   settlementPolitics.js, grievanceRead.js are LIVE or live-composed — every
   touch is fence-golden-first, and the dark path of every flag in §3 is
   byte-identical by construction, pinned before wiring.
2. **The survey is the census's warranty:** §2's rows carry file:line receipts
   from three read-only surveys dated 2026-08-02 @ 38f81d05. Any implementer
   finding a census overstatement STOPS and reports rather than building on it
   (the war volume's J-WR-13 discipline, applied here from day one — this
   volume's census has NO known overstatements at issue time). The surveys
   covered ENGINE SUBSTRATE ONLY (§2 preamble): every dossier surface not
   quoting a component file:line is VERIFY-AT-BUILD, per its pin's marking.
3. **The CW-0 same-commit obligation [CORRECTED 2026-08-02 (fp-audit)]:** any
   wave landing a cross-layer read adds its CW-0 registry row IN THE SAME
   COMMIT (§6's standing obligation) — the couplings volume's inclusion ratchet
   reds a cross-layer read with no registry row, so a wave that defers its row
   defers its own gate.




