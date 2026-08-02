# DESIGN — FP-GRAMMAR: THE PACT GRAMMAR (diplomacy's peacetime completion)

## Fable 5 architecture, 2026-08-02. One of the six program volumes bound by
## DESIGN_FP_SPINE.md (the constitution; where this volume and the spine conflict,
## the spine wins and the conflict is a bug to report). Compiled from the spine's
## §3 FP-GRAMMAR crux rulings (settled law — elaborated here, never re-opened) and
## the three GRAMMAR surveys executed 2026-08-02 against the minifold tree
## (claude/composite-r4 @ 38f81d05; 89/89 + 51/51 focused treaty tests green).
## IMPLEMENTATION IS ASSIGNED TO THE EXTERNAL IMPLEMENTER (Sol). This document is
## self-contained enough to build every wave without inventing architecture.

**Status: ARCHITECTURE. Nothing here is scheduled until the owner sequences it
(spine §5: programs ride behind the sim-proof path, GRAMMAR first among the six).
The judgment blocks in §6 are the drafting chair's rulings under delegation —
vetoable here. The war volume's implementer protocol
(DESIGN_WAR_RULINGS_ARCHITECTURE.md §10) binds verbatim.**

**Reading order for the implementer:** DESIGN_FP_SPINE.md (the twelve requirements
and SP-1..SP-7 — every mechanism below carries all twelve or it is a defect) →
this document top to bottom → DESIGN_WAR_RULINGS_ARCHITECTURE.md §3 (THE SEAM
MECHANICS — the two-picture contract this volume consumes) and §WR-7 (the envoy
program, this volume's war-side sibling — cross-referenced throughout, never
duplicated) → DESIGN_PEACE_ENGINE.md (the treaty substrate) → DESIGN_FP_COUPLINGS.md
(every coupling this volume declares has its row there).

---

## §0 THE THESIS

**Every treaty, at last, can be negotiated rather than dictated.**

The survey's central finding, CONFIRMED with executed proof: every negotiated,
term-bearing, enforced, document-rendered agreement in the engine mints at exactly
one seam — a war winding down through `sue_for_peace` (`peaceTerms.js` PASS 1,
sole caller `pulseKernel.js:2371`) — and even there the victor drafts unilaterally;
no counter-offer machinery exists anywhere in the tree. `non_aggression` is in the
catalog, but the only path to a non-aggression pact runs through fighting and
ending a war. Two peaceful neighbours cannot sign one. A grain-for-ore pact is
structurally unrepresentable. Faith has zero terms in code; population has zero
terms in code OR design. The full enforcement stack — compliance under fog, caps
that bite, breach, expiry — exists only for the war-end artifact; peacetime bonds
are labels with scalars and no compliance semantics at all.

This program ends that. The treaty artifact stays ONE instrument (the 89/89-green
compliance stack, extended, never forked) — and ONE PER PAIR, by law
[CORRECTED 2026-08-02 (fp-audit)]: the ledger's one-per-unordered-pair key
(`peaceTerms.js:665-678`, the mint pass's own comment: "one treaty per unordered
pair") is ruled LAW, not a defect. Peacetime formation AMENDS the pair's standing
instrument, minting it only when the pair holds none; reciprocity is DIRECTIONAL
TERMS inside the one instrument (§13's stacking machinery gains a beneficiary
axis); renewal is lineage inside the record, never a second record. The program
gains peacetime formation from typed triggers, two-sided drafting through the
two-picture contract, faith and population term families, an oath-holder's name
on every signature, a lifecycle that speaks at every moment instead of only at
birth and murder, renewal and renegotiation, and a mediator who can appear before
the first march instead of only at the war's exhausted end. Historical register:
the treaty of Kadesh — the first recorded parity instrument, signed by equals in
peacetime, brothers not vassals — arriving in an engine that until now knew only
Versailles.

---

## §1 THE LAWS THAT BIND EVERY WAVE

### 1a Inherited constitutional law (by pointer, in full force)
The war volume's §1a laws 1–7 bind verbatim: same-seed byte identity; dormancy
(every wave DARK behind a virtual flag absent from DEFAULT_SIMULATION_RULES,
golden-pinned before wiring); seeded purity; monotone ratchets (new engine code is
a lazy leaf); receipts carry enforcement (`id` + full address chain + typed action
+ settlements BY NAME + recorded reason — the id-less drop class is this program's
own origin story: "every treaty this engine has ever signed was narrated into a
void" is a comment IN `peaceTerms.js`); premium isolation + audience projection
(`includeCovert`/`includeGroundTruth`); finite semantics (closed vocabularies,
banded, no float leaks).

### 1b The spine's twelve requirements (the density contract)
Every mechanism below carries: law · force · NAMED counterforce off the same
evidence · belief posture (Law One) · named-actor casting through existing planes ·
receipts in the house voice · pins with the negative case hardest · bands ·
declared couplings (rows in DESIGN_FP_COUPLINGS.md) · its clock against
INTERVAL_WEEKS plus travel physics where anything moves · posture/risk consumption
(SP-4) · endings-vocabulary entries · and THE DOSSIER ROUND-TRIP pin (the crown
law: open the town, find the trace where a DM would look). The waves in §5 are
written with these as labeled fields so the audit stage can hunt shallow spots
mechanically.

### 1c Grammar-specific laws (each anchored in settled rulings)
- **THE ONE-INSTRUMENT LAW [CORRECTED 2026-08-02 (fp-audit), chair ruling R1]:**
  the treaty ledger's one-record-per-unordered-pair key is LAW. Peacetime
  formation AMENDS the pair's standing instrument (minting it when absent);
  reciprocal and two-sided pacts are DIRECTIONAL TERMS inside the one instrument
  — a term gains a `beneficiary` field and §13 stacking keys on
  family × beneficiary for `provenance:'negotiated'` lineage (war-door drafting
  unchanged); two same-family symmetric terms on one treaty compose under the
  stacking rules or the SECOND IS REFUSED WITH A RECEIPT (never silently
  dropped, never silently stacked). Renewal, renegotiation, and conversion are
  amendment lineage acts on the living record, never a re-mint at the same key.
- **THE WRITER-FAMILY LAW (J-WR-1 extended; [CORRECTED 2026-08-02 (fp-audit),
  chair ruling R2]):** `peaceTerms.js` remains the HEAD of the one terms-writer
  FAMILY for every treaty in the world — war-end, peacetime, renewal, conversion,
  sovereignty (WR-10). "Extend, never fork" means ONE WRITER FAMILY, never one
  file: peaceTerms.js sits at 794 of its 800 effective-line domain ceiling with
  NO size-baseline grandfather, so ALL new grammar capability lands in LAZY LEAF
  SIBLINGS (`pactFormation.js`, `pactAmendment.js`, `treatyLifecycleVoice.js`,
  `oathHolder.js` — named per wave) consuming peaceTerms' exports; peaceTerms.js
  itself gains only NET-ZERO seam lines (each export line bought by moving an
  equal number of read-model lines into a leaf in the same commit — sizeBaseline
  is TOLERANCE-0). A second terms writer OUTSIDE the family is a design defect;
  a leaf that mints or amends other than through peaceTerms' exported seam is a
  fork.
- **THE TWO-PICTURE LAW (SP-3, settled):** peacetime drafting is TWO-SIDED via
  `negotiationPictures.js` (WR-7's seam, built once, used for war-end AND
  peacetime): each party's sheet is drafted and valued under that party's OWN
  `truthFor`; acceptance is each side's own-picture valuation clearing its own
  reserve — the amendment-S two-sided conjunction generalized. No merged estimate
  exists anywhere (K4's law reaches peacetime).
- **NO MARGIN IN PEACE (the WR-10 precedent, extended):** `termBudgetFor` prices a
  victor's believed margin; a peacetime pact has no victor and no margin. The
  budget analogue is THE DEMAND'S MEASURE — what the trigger read says each side
  needs — and the no-deal outcome is first-class (the whitePeace precedent: the
  machinery ran and produced nothing, receipted in the proposal's failure).
- **K3 — NOBODY IS EVER CURRENT (structural):** every formation, drafting,
  acceptance, renewal, and mediation read routes through belief machinery
  (SP-2's believed scarcity/conditions/devotion feed the triggers). The K3 pin set
  extends to this volume's modules: `pactProposals.js`, `pactTriggers.js`,
  `pactFormation.js`, and the renewal evaluator — import lists pinned,
  token-scanned, guard-the-guard proven against a legitimate truth-reader outside
  the negotiation set (never `peaceTerms.js`, which cannot sit on both sides of
  its own guard). [CORRECTED 2026-08-02 (fp-audit)] THE VALUATION HOME IS RULED:
  acceptance valuation (each side's own-truthFor value vs its reserve, the
  two-sided conjunction) lives in `pactProposals.js` — INSIDE the K3 pin set —
  which writes ONLY the proposal's state through its own writer.
  `pactFormation.js` EXECUTES accepted proposals (amend/mint through peaceTerms'
  exported seams) and never values a sheet; a source-scan walker asserts no
  `negotiationPictures` import inside `peaceTerms.js` OR `pactFormation.js`. The
  single-writer boundary at signing: `pactProposals.js` owns every proposal state
  transition including `signed`, exposed to `pactFormation.js` as an exported
  closer — no second module flips a proposal's state.
- **PAIRWISE ONLY (law I, verbatim):** no congress, no multilateral pact object.
  A three-realm arrangement is three bilateral treaties that happen to rhyme.
- **THE REFUSAL LAW (G2 generalized, asymmetric by ruling):** every proposal is
  refusable, and refusal is REMEMBERED — a receipted fact on the relationship
  record — but peacetime refusal is CHEAP where war-peace refusal is dear
  (no grievance mint, a banded trust delta only; J-GR-7). No free-proposal spam:
  the proposal cap and dwell bound the surface.
- **THE OATH LAW (never-resolve-fates, absolute):** the death or fall of an
  oath-holder NEVER voids a treaty automatically. It opens a QUESTION, and the
  question has a safe default: silence honors the oath. The engine never resolves
  a named character's fate to force drama.
- **NO TIMERS, NO CLAMPS (law L):** mediation never forces a peace; renewal never
  forces a renewal; the succession question expires to HONOR, not to a forced
  choice. Convergence pressures are priced forces, not arbiters.

### 1d Recorded hazards that WILL bite these waves (each has bitten this estate)
- **Id-less news drop:** every new `newsEntries.push` carries `id`; every new kind
  registers in WHAT_PHRASES + heraldRouting or the totality walkers red.
- **Unreachable predicate conjunctions / producer-less vocabulary:** the catalog
  already contains the cautionary corpse — `non_intervention`, catalogued with
  ZERO producers, never drafted (`peaceTerms.js:370-378`, the D4 deferral). NO new
  term lands without a named producer AND a biting consumer, each with a
  reachability pin on a real generated corpus.
- **Writer/reader payload-spelling drift:** every new ledger (pactProposals) gets
  a pin that boots the REAL writer and reads through the REAL reader.
- **JSON-alias trap:** oath stamps reference roster NPC objects — every
  stamp/round-trip fixture JSON-round-trips.
- **Vacuous absence pins:** a `toHaveLength(0)` against a harness defaulting the
  producing state empty proves nothing — seed non-empty state first.
- **Golden discipline:** a golden that moves unexpectedly is STOP-and-report;
  re-records only against a recorded ruling.
- **Hot files at ceiling [CORRECTED 2026-08-02 (fp-audit)]:** `peaceTerms.js`
  measures 794 effective lines against the 800 domain `max-lines` ceiling with NO
  size-baseline grandfather, and `tests/lint/sizeBaseline.test.js` is an
  EXACT-SET, TOLERANCE-0 property — roughly seven added effective lines red
  eslint AND the baseline walker. Every wave that touches `peaceTerms.js` obeys
  the §1c writer-family law: capability in lazy leaf siblings, peaceTerms gains
  only net-zero seam lines (each seam line bought by moving an equal number of
  read-model lines into a leaf in the same commit). §10 carries this as a
  per-wave obligation.

---

## §2 SUBSTRATE CENSUS (from the three GRAMMAR surveys, executed 2026-08-02 on
## claude/composite-r4 @ 38f81d05; live code outranks this table — re-verify
## anything you build on; rows marked VERIFY-AT-BUILD were not directly evidenced)

| Substrate | Where | State |
|---|---|---|
| Treaty artifact: 11-term TERM_CATALOG across 7 families, 6 executor kinds, codepoint-frozen for the walker | `peaceTerms.js:164-188`, freeze `:190-194` | BUILT, 89/89 focused green |
| Every stream/status term REQUIRES `expiresTick` — perpetual extraction unrepresentable | TermRecord `peaceTerms.js:399-415` | BUILT |
| §13 stacking (one term per family, TOP_ASSETS=3) | `draftTerms peaceTerms.js:426-478` | BUILT — war-door shape, unchanged; the beneficiary axis for `provenance:'negotiated'` lineage (§1c, §4) is NEW WORK carrying its own pins [CORRECTED 2026-08-02 (fp-audit)] |
| Victor budget from BELIEVED margin; white peace below CLEAN_EXIT_FLOOR=0.08 | `termBudgetFor`; appraisal `:326-384` | BUILT — war-side only; NOT reused in peace (§1c) |
| Treaty clock: `treatyTicksPerYear: 52` on new treaties, identity-pinned to `INTERVAL_WEEKS.one_year`; legacy 12 by explicit marker | `treatyClock.js`; WR-0c item (4) LANDED | BUILT — the provenance discipline GR-1 reuses |
| Sole mint path: advanceTreaties PASS 1, war-exit only (de-escalation off `hostile` + fresh `sue_for_peace`); `mintTreaty` module-internal; sole engine caller `pulseKernel.js:2371` | `peaceTerms.js:643-682` | BUILT — the one-seam fact this program widens |
| Compliance under fog: trueState vs observedState; HONORED_FLOOR .75 / DEFAULT_FLOOR .4 / DETECT_FLOOR .6; victor monitor reach | `evolveCompliance peaceTerms.js:524-535`; `:1093-1101` | BUILT |
| Enforcement reads that BITE, one dependency-free leaf so expiry lifts every effect the same tick | `treatyEnforcement.js:82-141`; lift `:59-62` | BUILT |
| Conserved grain streams, spoilage the sink; delivered/extracted accumulators | `treatyTransfer.js`; `peaceTerms.js:731-755, :753-754` | BUILT |
| Strain→resentment (`tribute_strain` feeding revanchism); STRAIN_RESENTMENT_PER_YEAR 0.6 on the treaty's own clock | `peaceTerms.js:1032-1043, :104-105` | BUILT |
| Fraying legibility: `frayingTermOf`, `treatyFrayingSummary`, `treatyDocument`, house-voice totality table | `peaceTerms.js:1322-1354, :1420-1487`; `display/treatyDocument.js:36-60` | BUILT |
| Deliberate repudiation (WR-0c): defaults every live term, broken shell legible until horizon, always-proposal realm verb, 6-week hold-then-expire-to-decline | `treatyBreach.js:90-149`; `realmManifest.js:252-268`; `changeAuthorityPolicy.js:223-230`; `actorMajorApproval.js:57` | BUILT — but repudiation targets only treaties with a LIVE `non_aggression` term (`treatyBreach.js:46-51`), and the ENGINE never organically repudiates (composer-only) |
| Broken-oath cascade: defaulted shell → `treaty_default` casus → "Oathbreach is casus" prose → war-block lifts | `peaceTerms.js:555-573`; `warReasons.js:445-456`; `eventProse.js:208-212`; `treatyEnforcement.js:116` | BUILT — TELLABLE-NOW, preserved |
| Mediation, single-source: cross-pressured finder (adjacent to BOTH, faith/alignment quadrants cross-cut), MEDIATION_SOFTEN 0.2, trust both edges, peace reason led by the broker's name, live face-saving exit | `peaceTerms.js:1128-1146, :841-843, :1156-1171`; `cohesionWeave.js:110-126`; `peaceReasons.js:181-187, :485`; `pulseKernel.js:2464-2473` | BUILT — war-exit occasions only; GR-6 generalizes occasions, never the finder |
| Three-lane DM proposal machinery: always-proposal relabels; severity-gated drift (0.72); actor-initiated majors with hold-then-expire; realm verbs | `relationshipRuleHelpers.js:199-228`; `relationshipRulesCore.js:776`; `actorMajorApproval.js`; `realmManifest.js` | BUILT — GR-4's question rides lane 2 |
| Relationship vocabularies, two by design: 10 evolving types × 7 axes (incl. `dependency`/`leverage`) with turning-point archive (cap 24); 13 static regional types; collapse refused | `relationshipState.js:19-110, :136`; `regionalGraph.js:28-42`; `canonicalRelationship.js:20-26` | BUILT — the refusal memory and the dependency-fear counterforce read these, invent nothing |
| Peacetime "agreements" today: labels with scalars — trade drift, patronage, shared-enemy alliance, rival détente; no goods, no durations, no compliance | `relationshipRulesCore.js:56, :115, :149`; `relationshipRuleHelpers.js:565-592` | BUILT, and deliberately NOT torn up — labels stay the weather; treaties become the law |
| `defensive_pact` edges: readers honor them (war support, ransom); NO simulation writer mints one — grep confirms read-sites only | `warDeployment.js:218-225`; `thirdPartyRansom.js:70` | HALF-BUILT — the found-a-writer opportunity GR-3 closes |
| Generosity credit obligations: kind `credit`, maturity → repayment (trust) or default (grievance + casus seam) — the ONLY peacetime arrangement with enforcement semantics, unilaterally minted | `generosityKernel.js` E1b header | BUILT — gains the oath stamp in GR-1 |
| Embassy machinery: exclusively a war-exit channel (deposited suit = bounded multiplier on sue_for_peace weight) | `embassyLedger.js:8-14` | BUILT — untouched by this program |
| Signing beat: fully receipted (id, both parties, per-term reasons, mediated/separate-exit variants); routed trade/rumor/chronicler | `peaceTerms.js:921-954, :681`; `heraldRouting.js:141`; `settlementRumors.js:210`; `chroniclersLetter.js:92` | BUILT |
| Breach beat: DELIBERATE path only; organic under-delivery default flips ledger fields silently — no news | `realmVerbExecution.js:196-213`; quiet default `peaceTerms.js:757-774` | PARTIAL — GR-0's detection beat |
| EXPIRY: terms lapse and treaties prune in TOTAL SILENCE — no beat, no kind, no receipt anywhere in src | `peaceTerms.js:720-724, :763-765` | ABSENT — GR-0's first cure; the survey's cheapest density win |
| Longevity: `mintedTick`/`signedTick` persisted, `yearsRemaining` rendered; AGE never computed or spoken; no anniversary, no eulogy | `peaceTerms.js:884, :1446` | ABSENT — GR-0 |
| Lie-priced treaties: `believedMarginAtSignature` persisted; exposed-lie credibility charges exist; NOTHING ties a lie to the treaty it purchased | `peaceTerms.js:885`; `informationStatecraft.js:125-134, :590` | ABSENT tie — GR-0's fourth beat; coupling row GRAMMAR×INFO |
| Open repudiation prices NO credibility delta (coalition fracture does: `fractureCredibilityDeltas`) | `informationStatecraft.js:363` | GAP — GR-4 cures for all repudiation paths |
| Succession-repudiation: designed (`DESIGN_PEACE_ENGINE.md:212-214`), ZERO coup-to-treaty code; treaties key on settlement ids, seats change silently; only breachType `repudiation` severity 1 exists | grep-confirmed absent | ABSENT — GR-4 |
| Renegotiation/renewal/conversion: designed (`DESIGN_PEACE_ENGINE.md:215-217`), clean-lapse only in code; zero renegotiation code paths | grep-confirmed absent | ABSENT — GR-5 |
| Standalone NAP writer: none; symmetric peacetime instruments unmintable | grep-confirmed absent | ABSENT — GR-2 |
| Faith terms (missionary access/conversion mandate/temple restitution): design-doc only; population terms: absent from code AND design | `DESIGN_PEACE_ENGINE.md:~186-191, :162` vs TERM_CATALOG | ABSENT — GR-3 |
| Soak observation of agreement health: zero `treaty` hits in any audit script; counts, compliance distributions, stream-grain movement all unmeasured | `scripts/audit/*.mjs` grep | ABSENT — GR-7 |
| `negotiationPictures.js` (the two-picture wrapper): NEW WORK homed in WR-7 | war volume §3 | ABSENT — BUILD-PRECONDITION for GR-2/5 (§9) |
| `warIntents` ledger (W1): landed with WR-0 | war volume §4/WR-0 Progress | BUILT — GR-6's pre-war mediation surface; VERIFY-AT-BUILD its read shape |
| SP-2 believed subjects, SP-4 `postureOf`/`riskToleranceOf`, SP-1 errands, SP-6 narration kit, SP-7 temporal walker | DESIGN_FP_SPINE.md §2 | SPINE WORK — build-preconditions per §9; VERIFY-AT-BUILD their landed shapes |
| Dossier surfaces: WarFaithTab treaty block (house voice), TreatyPanel (Realm Inspector via HeraldBody), PDF export | `WarFaithTab.jsx:110-134`; `TreatyPanel.jsx`, `HeraldBody.jsx:227`; `pdf/lib/liveWorld.js:254-261` | BUILT — every GR dossier round-trip lands on these three, PLUS the chronicle (wizard_news-routed, already live) |
| Turning-point RENDERING: `turningPoints` lives in four domain modules and in ZERO components and ZERO pdf sections (grep re-verified 2026-08-02) | `relationshipState.js:136` (archive) vs `src/components`, `src/pdf` | ABSENT — the archive is a domain record only; GR-2/GR-6 land their memory surfaces on the chronicle + WarFaithTab lines instead [CORRECTED 2026-08-02 (fp-audit)] |
| Ruler-person read: NO `rulerOf`/`seatHolder`/`legitimatePowerOf` exists anywhere in `src/domain`; `rulingPower.js` deals in faction/power NAMES, never npc ids | grep re-verified 2026-08-02 | ABSENT — GR-1's `oathHolderOf` is NEW WORK, not read-wiring [CORRECTED 2026-08-02 (fp-audit)] |
| Compliance history: `complianceState` (term and treaty) is OVERWRITTEN every advance from the current tick's observation; nothing persists a worst-ever mark or strike count | `peaceTerms.js:407-408, :458, :728, :759-768` | ABSENT — GR-5's `worstObservedEver` is NEW WORK [CORRECTED 2026-08-02 (fp-audit)] |
| Actor-major routing: gated on OPT-IN `simulationRules.routineMajorApproval === true`, DELIBERATELY absent from DEFAULT_SIMULATION_RULES (dark in every default/golden/soak profile); the hold queue EXPIRES TO DECLINE | `actorMajorApproval.js:14-31, :75-76, :103, :122-136` | BUILT — GR-4 declares BOTH modes and its HONOR-terminal divergence explicitly [CORRECTED 2026-08-02 (fp-audit)] |
| `peaceTerms.js` size: 794 effective lines vs the 800 domain ceiling, no baseline grandfather | eslint max-lines measure, 2026-08-02 | HAZARD — the §1c writer-family law is the cure; §10 per-wave obligation [CORRECTED 2026-08-02 (fp-audit)] |

**The census STOP rule (J-WR-13's discipline, adopted):** any implementer finding
this table overstating the tree STOPS and reports rather than building on it.

---

## §3 THE FLAG FAMILY + THE FORMATION SEAM

Five new virtual flags, all absent from DEFAULT_SIMULATION_RULES, lit only at
owner-signed points:

| Flag | Gates | Waves |
|---|---|---|
| `treatyLifecycleVoiceEnabled` | lapse beat, detection beat, longevity voice, the lie-revealed tie, DM true-state chip | GR-0 |
| `oathHolderEnabled` | sworn stamps on treaties + credit obligations; the succession question; `succession_repudiation`; the repudiation credibility charge | GR-1, GR-4 |
| `pactFormationEnabled` | the proposal ledger, four peacetime triggers, two-sided drafting (amendment-shaped — §1c), the standalone NAP, the war-overtaken closure (`broken_by_war`), the faith/population/mutual-defense terms, AND the war-end draft-lens extension (a DISCLOSED lit-path shift on a landed feature — J-GR-14) | GR-2, GR-3 |
| `treatyRenewalEnabled` | the renewal window, renegotiation-from-strength, compelled-alliance conversion | GR-5 |
| `mediationGeneralizedEnabled` | intent-stage mediation, fraying-pact mediation, the temple arm | GR-6 |

GR-7 (measurement) carries no flag — envelopes, certification rows, soak reads.

**FLAG DEPENDENCIES (the war volume's ruling shape):** independent dark switches;
lighting ordered. `treatyRenewalEnabled` ⇒ `pactFormationEnabled` (renewal
proposals ride the proposal ledger and the two-picture drafting). `oathHolderEnabled`
and `mediationGeneralizedEnabled` are independent. GR-4's succession question
requires `oathHolderEnabled` only (same flag, second slice). Lighting order = build
order (GR-0 → GR-1 → GR-2/3 → GR-4 → GR-5 → GR-6); a flag lit out of order is an
invalid config the GR-7 certification walker reds.
[CORRECTED 2026-08-02 (fp-audit)] DECLARED CROSS-PROGRAM INTERACTIONS (this table
was silent on them; silence was the defect):
- `envoyDiplomacyEnabled` (WAR program, WR-7): `pactFormationEnabled` is valid
  under BOTH transports, but lighting envoy SHIFTS pact timing (leg-priced dwell
  replaces the abstract clock, agreeing only within a band) and INTRODUCES LOSS —
  an intercepted or DM-KILLed carrier expires the proposal unanswered, an outcome
  the dark transport can never produce. This is a disclosed same-seed shift at
  lighting time. Every formation-trigger receipt records its TRANSPORT MODE so a
  soak's formation numbers are attributable to a transport, and the GR-7
  certification walker asserts the cross-flag combination is legal in both
  states (it reds only on GRAMMAR-internal order violations otherwise).
- `oathHolderEnabled` × `pactFormationEnabled`: GR-2's acceptance reserve reads
  the oathbreaker-credibility band that only GR-4 writes. With `oathHolderEnabled`
  dark the band reads clean-by-absence (no charge, no read — the declared
  degraded arm); the counterforce bites only when both are lit. Recorded here so
  the dependency is visible to the walker, not discovered at soak.
- `seatBooksEnabled` (INTERIOR IN-1): GR-2's acceptance reserve names `booksOf`
  as an INPUT behind `seatBooksEnabled` AND `pactFormationEnabled`; dark ⇒
  posture + risk only (declared degraded arm, receipt names which inputs it had).
- `routineMajorApproval` (opt-in simulation rule, NOT a program flag): GR-4's
  question queue exists only where it is explicitly true — GR-4 declares both
  modes; the GR-7 succession-mix envelope is measurable ONLY on profiles that
  set it (declared there).

**THE FORMATION SEAM (this volume's largest architectural decision, binding):**
peacetime formation does not fork the treaty machinery — it adds a SECOND DOOR to
the same room. Concretely:
- `pactTriggers.js` (NEW, pure, no state): scores the four typed triggers per
  directed pair per pulse, entirely from belief-side reads (SP-2 subjects,
  believed threat via the WR-6 alliance-web read, migration-pressure bands). A
  trigger crossing its band while posture and cap permit emits a PROPOSAL
  CANDIDATE — a scored intention, exactly the warReasons discipline (state-derived,
  decay-inherent, zero RNG).
- `pactProposals.js` (NEW, ONE writer for `spatialLedgers.pactProposals`): owns
  the proposal lifecycle — open, answer-due, refused, expired, signed. It never
  mints a treaty.
- `peaceTerms.js` gains ONE exported pass, `advancePeacetimePacts(worldState)`,
  called from `pulseKernel` adjacent to `advanceTreaties`, flag-gated at the call
  site (dark ⇒ the call is absent ⇒ byte-identical). The pass reads accepted
  proposals and mints through the SAME internal `mintTreaty`, stamping
  `provenance: 'negotiated'`. One artifact, one compliance stack, one document,
  two doors.
- **Transport is the WR-7 two-transport pattern, verbatim:** `envoyDiplomacyEnabled`
  dark ⇒ the proposal travels abstractly — its `answerDueTick` is computed from
  the SAME transit-kernel leg read the errand would use (read-only; no NPC minted),
  so the dark clock and the lit clock agree within a band and law M's physics are
  honored in both. Lit ⇒ the proposal rides an SP-1 errand, purpose `diplomatic`,
  declared/true split and interception per WR-7b — elaborated THERE, consumed here.
- **Drafting is ALWAYS two-pictured** (transport is what the envoy flag swaps,
  never the math): proposer's sheet drafted under its own `truthFor` via
  `negotiationPictures.js`; the counterparty values the sheet under ITS own
  `truthFor`; acceptance = the two-sided conjunction (proposer's own-lens value of
  what it receives ≥ its reserve AND counterparty's own-lens value ≥ its reserve).
  Non-overlap is a first-class no-deal, receipted in the proposal record only.

---

## §4 CANONICAL MODEL — new state, deliberately small

Everything conditionally materialized (drop-when-empty, zero eager bytes, absent ⇒
byte-identical), ONE writer each.

```
worldState.spatialLedgers.pactProposals    — GR-2, writer pactProposals.js
  [ { id, from, to,                        // directed; the proposer speaks
      trigger,                             // trade_demand | faith_communion |
                                           //   migration_pressure | shared_threat |
                                           //   renewal          (CLOSED, five)
      sheet: { terms: [...] },             // proposer's OWN-PICTURE draft; closed
                                           //   TermRecord shapes only
      openedTick, answerDueTick,           // dwell from the transit-kernel leg read
      state } ]                            // open | signed | refused | expired
  // Cap: MAX_OPEN_PROPOSALS per settlement (band, default 2). Refusal memory is
  // NOT stored here — it lands on the relationship record's existing
  // turningPoints archive (cap 24, relationshipState.js:136). Signed/refused/
  // expired records prune after their receipt lands (the ledger is a queue,
  // not an archive; the chronicle keeps the story).

treaty record extensions                   — GR-1/GR-2/GR-4; peaceTerms.js stays
  sworn: { [settlementId]:                 //   the ONE writer
      { npcId, name, swornTick } }         // stamped at mint from the seat's
                                           //   legitimate power (existing reads);
                                           //   LEGACY treaties carry NO stamp and
                                           //   render seat-voice forever — the
                                           //   treatyTicksPerYear provenance
                                           //   discipline reused verbatim, never
                                           //   backfilled
  provenance: 'dictated' | 'negotiated'    // GR-2/5; legacy unmarked ⇒ 'dictated'
             | 'renewed' | 'converted'     //   at read, never rewritten
  breachType gains 'succession_repudiation' // GR-4; severity BANDED below
                                           //   repudiation's 1.0

TERM_CATALOG extensions                    — GR-3, same-commit with the frozen
  faith family:      missionary_access | shared_rite | pilgrimage_right
  population family: migration_right | labor_compact | settlement_provision
  security family +: mutual_defense        // the shared-threat trigger's product;
                                           //   its readers ALREADY EXIST
                                           //   (warDeployment.js:218-225)
  executor kind 'grant' (7th)              // standing-right reads exposed from
                                           //   treatyEnforcement.js (the one-reader
                                           //   law: expiry lifts same tick)

succession questions                       — GR-4: NO new ledger. The question is
                                           //   an actor-initiated-major proposal
                                           //   riding worldState.proposals
                                           //   (actorMajorApproval's machinery),
                                           //   hold-then-expire-to-HONOR.
```

**What is deliberately NOT modeled:** no negotiation-session state beyond the
proposal record; no counter-offer object (a refusal may be followed by a fresh
proposal the other way — the rounds ARE proposals); no peacetime margin budget; no
new confidence stock (SP-5 consumed, never minted here); no multilateral anything;
no anniversary scheduler (ruled out, J-GR-10); no second mediation finder; no new
relationship vocabulary (the dependency-fear counterforce reads the existing
`dependency`/`leverage` axes).

---

## §5 THE WAVES (dependency order; each: one commit, focused gates per slice, full
## gate at wave end, ledger row; every flagged wave DARK per §3)

### GR-0 — THE LIFECYCLE VOICE (flag `treatyLifecycleVoiceEnabled`)
The survey's verdict, verbatim: "the grammar speaks at a treaty's birth and its
deliberate murder and at no other moment of the lifecycle." This wave gives the
instrument its missing registers — the cheapest density wins, in the survey's own
order. Historical register: the medieval truce was term-dated and its lapse was a
public fact — everyone knew the day the truce of Espléchin ran out.
- **The lapse beat:** the expiry loop already walks every expiring term
  (`peaceTerms.js:720-724`) and the prune site already knows when a treaty is
  spent (`:763-765`) — the beat is one push away. New kind `treaty_lapsed`:
  id `wizard_news.{tick}.treaty_lapsed.{a}.{b}`, both parties BY NAME, the term
  family that lapsed, the treaty's AGE in years (from `signedTick`, on the
  treaty's own clock marker), and the reason ("ran its term"). The eulogy names
  the age: a twenty-year peace dies as news, not as a pruned key. Downstream
  honesty: the same beat is the warning — `treatyEligibleWarTargets` starts
  returning the pair the same tick (`warIntent.js:341-353`, survey-verified), and
  the beat says so in the house voice ("the road between them is open again, to
  anything").
- **The detection beat:** when a term's OBSERVED state first crosses out of
  honored (the victor's picture, behind monitor reach — `DETECT_FLOOR`), mint
  `treaty_default_detected` naming the term, the defaulter, and what the monitor
  actually saw. The NEGATIVE is the law: an undetected cheat mints NOTHING — the
  fog holds; quiet default stays silent in every feed (Law One: the engine models
  what courts believe, and an unbelieved default is not yet a story).
- **Longevity voice:** `treatyDocument` gains `ageYears` + a house-voice age line
  ("Twenty years this peace has held") rendered on all three dossier surfaces. NO
  anniversary beats (J-GR-10 — the pacing governor is the editor; age is dossier
  voice plus the eulogy, not an annual drumbeat).
- **The lie-revealed tie (THE PACT SIGNED FOR A LIE, the survey's PARTIAL made
  TELLABLE):** `believedMarginAtSignature` already persists (`peaceTerms.js:885`);
  exposure machinery already charges credibility (`informationStatecraft.js:125-134`).
  NEW: a pure read `treatiesPricedDuring(pair, tickWindow)` exported from the
  peaceTerms read surface; the INFO exposure path consumes it so an exposed
  strength-lie's receipt names the treaty signed inside the lie's live window —
  "the peace of the two rivers was priced on that lie." The read lands here; the
  consumer wiring is FP-INFORMATION's (coupling row GRAMMAR×INFO); the pin here
  proves the read finds the fixture treaty and finds NOTHING when the window
  misses (negative).
- **DM true-state chip:** TreatyPanel gains the true-vs-observed compliance chip
  behind `includeGroundTruth` — audience projection law; free surfaces never see
  the quiet default.
**Force / counterforce:** the voice itself is the force (legibility); the
counterforce is the pacing governor — all four kinds register significance so a
treaty-dense century cannot wallpaper the Herald.
**Belief posture:** detection speaks the OBSERVED state only; the lapse beat
speaks ledger fact; the lie tie speaks only at exposure (a belief event).
**Casting:** the lapse eulogy names the sworn parties when GR-1's stamps exist
(seat-voice when legacy).
**Clock:** age and expiry on the treaty's OWN clock marker (52 current / legacy 12
— WR-0c item (4)'s provenance rule); beats denominated in ticks, spoken in years.
**Posture consumption:** none — receipts don't consult posture (they report).
**Couplings:** GRAMMAR×INFO (the lie tie). Row in DESIGN_FP_COUPLINGS.md.
**Endings entries:** `ran_its_term`, `hollowed_detected` join the pact endings
vocabulary (§GR-7); `hollowed_quiet` exists as a DM-only ending (ground-truth
surfaces).
**Herald:** "The peace of the two rivers has run its course — twenty years, and
no man now living signed it." · "The tribute came light, and this time the court
noticed." · "The peace was priced on a lie, and now the lie is out."
**Pins (negative hardest):** undetected cheat ⇒ NO beat, feed-silent, DM chip
honest (the fog pin); every ending path emits exactly one lifecycle beat — a
walker over the ending vocabulary asserts no silent ending remains (totality);
THE TWENTY-YEAR PACT pin: a fixture pact runs full term and the eulogy speaks its
age (the survey's PARTIAL made TELLABLE); the lie-window negative; dormancy golden
(dark ⇒ byte-identical news stream); id + address chain on all four kinds (walker).
**Lifecycle:** no new persisted state; beats are per-tick emissions; `ageYears` is
a read. Nothing to regen or undo.
**Dossier round-trip:** open the town → WarFaithTab treaty block shows the age
line and, after a lapse, the chronicle carries the eulogy; TreatyPanel + PDF show
the same; DM chip on TreatyPanel only. The pin opens a fixture town and finds all
three.
**Bands:** detection-beat significance, lapse-beat significance, lie-window width
(ticks), age-line phrasing thresholds (young/settled/old — band words, SP-6).

### GR-1 — THE OATH-HOLDER IDENTITY (flag `oathHolderEnabled`; settled law, spine §3)
Treaties and obligations record WHO swore. Historical register: the medieval
treaty was a personal oath between princes — every royal death reopened every
question. THE HEIR WHO BREAKS THE FATHER'S OATH becomes tellable (GR-4 pays this
off; this wave lands the identity).
- **The stamp:** at mint (BOTH doors — war-end and peacetime), `peaceTerms.js`
  stamps `sworn` per party from the seat's legitimate power at signature —
  read-wiring through existing planes (the legitimate-power read the succession
  machinery already owns; H1 durable ids), never new NPC state. Mediated treaties
  already name the broker (`peaceTerms.js:893`); the stamp completes the
  signature line.
- **The provenance rule (reused verbatim from WR-0c item (4)):** legacy treaties
  are NEVER backfilled. Unstamped ⇒ "the seat swore" — seat-voice forever. No
  migration invents a signer.
- **Obligations too (spine §3: "treaties/obligations record WHO swore"):**
  generosity `credit` obligations gain the same stamp at mint. The debtor's-heir
  question is NOT built here — a debt survives the debtor; the heir question for
  debts is INTERIOR/TRADE material, declared deferred with its coupling row
  (GRAMMAR×INTERIOR), documented not dropped.
- **The oath is voice and read, never physics by itself:** compliance math is
  UNTOUCHED by whose name is on the parchment (no oath-compliance bonus — that
  would be a courage ratchet wearing a ring). What the stamp changes: the Herald
  speaks persons ("the peace of Aldric and Merek"); the succession question (GR-4)
  becomes askable; neighbours' SP-2 believed reads may weigh an aging oath-holder
  as succession risk — a BELIEF consumer, declared as the GRAMMAR×INFO row, built
  there.
**Force / counterforce:** force — the personal bond makes treaties tellable
through persons (the named-actor rule). Counterforce, same evidence — the bond's
mortality: the same stamp that lets the Herald say "Aldric's peace" is what makes
"Aldric is dying" a diplomatic fact. Neither moves a number in this wave; both
arm GR-4.
**Belief posture:** the stamp is ledger fact (public signature — a signing is
loud, J-WR-7's discipline); WHO currently holds the seat vs who swore is a read
any court can make from public history.
**Casting:** rulers via existing legitimate-power reads; never-kill,
never-resolve-fates absolute — the stamp records history, it never schedules a
death.
**Clock:** `swornTick` on the world clock; no durations introduced.
**Posture consumption:** none in this wave.
**Couplings:** GRAMMAR×INTERIOR (the deferred debtor's-heir question);
GRAMMAR×INFO (succession-risk belief reads). Rows declared.
**Endings entries:** none new; GR-4 adds `disavowed_by_succession`.
**Herald:** "Aldric of Thornwall and Merek of the Vale set their names to it." ·
(at GR-0's eulogy, with stamps:) "Signed by two men now dead, it outlived them
both."
**Pins (negative hardest):** LEGACY UNSTAMPED renders seat-voice and NO migration
writes a stamp (the provenance negative — the hazard class item (4) already
taught); JSON-round-trip on stamps (the alias trap — `npcId` references roster
objects); death of an oath-holder changes NOTHING in this wave (no auto-void, no
beat — the oath law's negative); both doors stamp (war-end fixture + peacetime
fixture once GR-2 lands; until then the war-door pin suffices and the GR-2 pin
extends it); dormancy golden.
**Lifecycle:** `sworn` persists with the treaty — serialize + JSON-round-trip
pinned; regen that rebuilds a treaty re-stamps from the regenerated world's seat;
undo restores stamps with the record; import validates npcId against the roster
and DEGRADES to seat-voice on a dangling ref (never a crash, never an invented
name).
**Dossier round-trip:** WarFaithTab's treaty block shows the signature line
("sworn by X for Thornwall"); TreatyPanel + PDF the same. The pin opens the town
and finds the names.
**Bands:** none (this wave is identity, not tuning) — the band-free wave is
declared deliberately.

### GR-2 — PEACETIME FORMATION + THE STANDALONE NAP (flag `pactFormationEnabled`;
settled law, SP-3)
The second door. Historical register: Kadesh — equals, in peacetime, brothers not
vassals; the instrument the engine has never minted.
- **The four triggers (CLOSED; `pactTriggers.js`, pure):**
  - `trade_demand` — SP-2 BELIEVED SCARCITY crossing: A believes it lacks what it
    believes B has dear (both ends beliefs; the wrong-market tragedy is legal and
    receipted — a pact CAN be signed for grain the counterparty never had; the
    world discovers the mismatch as the next grievance, K3's absurdity law
    reaching peacetime).
  - `faith_communion` — shared-rite alignment: the existing faith-facet quadrant
    reads (`cohesionWeave` substrate) crossing a communion band; proposes faith
    terms (GR-3).
  - `migration_pressure` — a believed-conditions flow band (SP-2's gold-rush
    subject + the existing migration pressure reads) crossing between the pair;
    proposes population terms (GR-3).
  - `shared_threat` — the WR-6 alliance-web risk read pointed at a COMMON believed
    threat (built in WR-6, consumed here — never duplicated); proposes
    `mutual_defense` + `non_aggression`.
- **Proposal mint:** trigger crossing + posture gate + cap ⇒ `pactProposals.js`
  opens a proposal; the sheet drafts through `negotiationPictures.js` under the
  proposer's OWN truthFor, terms drawn from the trigger's own family (the demand's
  measure — §1c NO MARGIN IN PEACE). Out-of-posture proposals are LEGAL and priced:
  an insular seat that proposes anyway pays the posture price and the receipt
  says so (Req 10 — priced news, never forbidden).
- **The answer:** at `answerDueTick` (transit-kernel dwell — §3), the counterparty
  evaluates under ITS OWN truthFor + ITS reserve (posture- and risk-derived,
  SP-4): sign (both-yes ⇒ `advancePeacetimePacts` mints, provenance `negotiated`,
  signing beat with trigger named), refuse (receipted `pact_refused`; a
  turning-point entry on the relationship record — THE REFUSAL REMEMBERED; banded
  trust delta only, J-GR-7's asymmetry), or the proposal expires unanswered
  (silence is an answer; cheaper still, but remembered as silence).
- **THE STANDALONE NAP (settled: "the standalone NAP gets its writer"):** the
  writer IS this pass. A `shared_threat` or post-rivalry détente crossing may
  propose a sheet of exactly one symmetric `non_aggression` term. Same artifact,
  same compliance, same war-block read (`treatyBlocksWar` — already pair-symmetric),
  same repudiation surface (WR-0c's `isRepudiableTreaty` gate already keys on a
  live NAP term — the peacetime NAP is repudiable at cost the day it is born).
  The survey's sharpest sentence dies here: two peaceful neighbours can sign one.
- **DM grammar:** a realm verb `PROPOSE_PACT` (composer lane, always available)
  lets the DM open a proposal by fiat; engine-minted signings are autonomous like
  war-end signings (parity), while label changes keep riding their existing
  proposal lanes untouched.
**Force / counterforce (named, same evidence):** force — the demand: believed
scarcity/communion/pressure/threat scores the proposal. Counterforce — THE
DEPENDENCY FEAR: the SAME believed-flow evidence scores the counterparty's (and
proposer's) fear of reliance, read through the EXISTING `dependency`/`leverage`
relationship axes and the insular posture; a pact that would bind too tightly is
refused BY THE SAME NUMBERS that invited it. The pin makes the counterforce WIN
on a real fixture.
**Belief posture:** every read belief-side (K3 pin set: `pactTriggers.js`,
`pactProposals.js` import-pinned + token-scanned + guard-the-guard); SECOND-ORDER
BELIEF (SP-2's heuristic) shapes the sheet — the proposer drafts what it believes
the counterparty can accept, derived from the outbound record only.
**Casting:** the proposing court speaks (seat voice; oath stamps at mint via
GR-1); when `envoyDiplomacyEnabled` is lit the carrier is a named SP-1 envoy with
everything WR-7b–d implies (interception, testimony, the compromised envoy) —
elaborated there, consumed here.
**Clock:** trigger cadence per pulse; proposal dwell = transit legs (M's floor
binds — one week per leg minimum, so a far court answers slowly BY PHYSICS);
`answerDueTick` against INTERVAL_WEEKS; the temporal walker (SP-7) asserts the
denomination.
**Posture consumption (SP-4):** `postureOf` gates initiation (insular raises the
bar, diplomatic lowers it); `riskToleranceOf` shapes the reserve (a bold court
accepts thinner value); out-of-posture priced and receipted.
**Two-timescale echo:** fast — the proposal/answer/refusal cycle (weeks); slow —
what the signed pact becomes (years: the compliance record, the ending, the
remembered refusals shaping the next proposal's odds).
**Couplings:** GRAMMAR×TRADE (trade_demand; grain-for-ore pacts; house credibility
at acceptance — SP-5 read); GRAMMAR×FAITH (faith_communion); GRAMMAR×POP
(migration_pressure); GRAMMAR×WAR (shared_threat via WR-6's read; treatyBlocksWar);
GRAMMAR×INTERIOR (a pact against the powers' wishes feeds the coup lane — WR-5's
H generalized to peacetime; the INTERIOR volume elaborates); GRAMMAR×INFO
(second-order belief in drafting). Rows declared, each with reads/receipts/
counterforce per the coupling doctrine.
**Endings entries (formation vocabulary, closed):** `signed`, `refused`,
`no_overlap`, `expired_unanswered`.
**Herald:** "Grain for ore: the courts have set their names to it." · "They asked,
and were refused; the refusal will be remembered." · "Neither shall march on the
other — signed in peace, not extracted at a war's end." · "No pact was reached;
the ore stays east and the grain stays west."
**Pins (negative hardest):** THE REFUSAL pin — a proposal refused mints NO
grievance, NO casus, a banded trust delta only, and the turning-point entry exists
(no ratchet toward war OR toward pacts); THE NO-OVERLAP pin — two-sided
conjunction fails ⇒ no treaty, the proposal record carries the receipt, the feed
carries nothing louder than the plan-lane note (whitePeace precedent); THE
DEPENDENCY-FEAR pin — the counterforce wins on a fixture where the demand alone
would sign (receipt names the fear); the K3 structural pin set + guard-the-guard;
POSTURE pin — same trigger evidence, two postures, two outcomes, both receipted;
SPAM bound — cap + dwell hold under a corpus that tries to flood; REACHABILITY —
each of the four triggers fires at least once in a real generated corpus
(the unreachable-predicate hazard; `non_intervention` is the tombstone); NAP
SYMMETRY — the peacetime NAP blocks BOTH openers and stays repudiable at cost;
JSON-round-trip + writer/reader payload pin on the proposal ledger (boot the REAL
writer, read through the REAL reader); dormancy golden.
**Lifecycle:** `pactProposals` persists — serialize/JSON-round-trip pinned; regen
re-derives open proposals from re-scored triggers (proposals are re-derivable
intentions, NOT precious state — ruled J-GR-8; signed history lives in treaties
and the chronicle, which regen preserves per their own laws); undo restores the
ledger byte-true; import validates trigger tokens against the closed five and
drops invalid rows with a logged receipt; a DM KILL of a carrying envoy closes
through WR-7's `lost` path and the proposal expires unanswered (the honest
silence).
**Dossier round-trip:** WarFaithTab gains the standing-proposal line ("An offer
stands before the court: grain for ore; an answer is owed by spring") and the
refusal memory surfaces through the existing turning-point rendering; TreatyPanel
lists open proposals for the realm; PDF carries signed pacts as treaties (already
does). The pin opens both towns mid-proposal and finds the line on each side —
proposer sees "we have asked", counterparty sees "they ask".
**Bands:** four trigger crossing bands (family-shared shape, SP tuning
discipline); MAX_OPEN_PROPOSALS (default 2); refusal trust delta; reserve
derivation weights (posture × risk); out-of-posture price; dwell floor.

### GR-3 — THE NEW TERM FAMILIES (rides `pactFormationEnabled` — second slice,
same flag; settled law, SP-3)
Faith and population join the catalog; the shared-threat product joins security.
Historical register: Augsburg's cuius regio — the rite settled by compact — and
the Ostsiedlung locatio charters — settlers invited on written terms.
- **Faith family** (Law One absolute — the engine moves believers, never gods):
  - `missionary_access` — executor `grant`: `missionaryAccessFor(pair)` from the
    enforcement leaf; while live, the FAITH program's stance lanes read it as
    lawful access (consumer: FP-FAITH; coupling row). Moves believer-share bands
    and sacred tension, never confirms a divine.
  - `shared_rite` — executor `grant`: standing communion; consumed by FAITH's
    tension reads (band-down while live) and by `common_rite`'s peace-reason
    scorer, which ALREADY exists (`peaceReasons.js:526`) — the term gives the
    reason something signed to point at.
  - `pilgrimage_right` — executor `grant`: route-scoped right consumed by SP-1
    pilgrim errands (FP-FAITH's legates/pilgrims) and by the route layer's
    existing flow classes. The pilgrimage that IS an economy and an interception
    surface is FAITH's to elaborate; the right that makes it lawful is minted here.
  - Conversion-mandate is deliberately NOT catalogued (design-doc idea rejected:
    it resolves belief by fiat — Law One; recorded as a declared non-goal, not an
    omission).
- **Population family** (no census realism — bands and rights, never headcounts):
  - `migration_right` — executor `grant`: `migrationRightFor(pair)` gates the
    permit surface FP-POPULATIONS lights (its volume names the permit table's dead
    columns going live — the consumer is THERE; the right and its compliance
    semantics are HERE; coupling row GRAMMAR×POP with both volumes named).
  - `labor_compact` — executor `grant` + a banded flow read `laborCompactFor(pair)`
    consumed by TRADE/POP production arms (banded bonus, capped — a compact
    colours an economy, never replaces one).
  - `settlement_provision` — executor `transfer` (the existing conserved-grain
    stream physics, direction chosen at draft) + a founding provision receipt
    consumed by wave-E/P founding machinery (FP-POPULATIONS elaborates;
    grain-for-settlement is SP-3's own phrase).
- **Security family gains `mutual_defense`** — executor `grant`:
  `mutualDefenseFor(pair)` feeds the EXISTING `defensive_pact` readers
  (`warDeployment.js:218-225`, `thirdPartyRansom.js:70` — the survey found readers
  with no writer; this is the writer, and reachability is instant because the
  consumers pre-date the term). The voluntary alliance stops being a label with
  no terms.
- **Compliance semantics per new term:** `grant` terms evolve compliance like any
  status term (a granted right can be QUIETLY throttled — observed vs true state
  under monitor reach: the pilgrimage right that is honored on parchment and
  harassed on the road is the fog's peacetime face); `expiresTick` REQUIRED on
  every one (the perpetual-extraction impossibility holds); strain applies where
  a term burdens (a resented `migration_right` accrues the same
  strain→resentment the tribute does).
- **Producers:** GR-2's triggers draft from their own families (the producer per
  term is named in `pactTriggers.js`' candidate table); war-end drafting MAY draw
  the new families where the victor's appraisal reaches them (faith/population
  asset classes join `appraiseLoserPortfolio`'s lens as banded reads — the
  missionary access EXTRACTED at a war's end is Augsburg's darker half, legal and
  receipted).
**Force / counterforce (named, same evidence):** `missionary_access` — force:
communion/influence; counterforce: SACRED TENSION — the host temple reads the
same believer-share drift as erosion (FAITH's stance lanes, same evidence, other
sign). `migration_right`/`labor_compact` — force: labor and growth; counterforce:
THE COMMONS VOICE — the same arrival evidence feeds the popular-arc pressure
FP-POPULATIONS owns. `mutual_defense` — force: security; counterforce: THE
ENTANGLEMENT READ — the same WR-6 alliance-web evidence that recommended the
pact prices being dragged into the partner's wars (consumed at WR-6's join
decision when the call comes).
**Belief posture:** rights are public parchment (ledger fact); their exercise and
throttling live under fog like every compliance state.
**Casting:** the terms are court instruments; the PERSONS they move (pilgrims,
legates, settlers, factors) are the sibling volumes' SP-1 movers — cross-referenced,
never duplicated here.
**Clock:** durations on the treaty clock (52-week year, WR-0c item (4)); `grant`
reads lift at `expiresTick` the same tick via the one-reader law.
**Posture consumption:** drafting weights family choice by posture (insular
courts under-draft access rights; mercantile over-draft compacts) — colour,
never selection.
**Couplings:** GRAMMAR×FAITH (access/rite/pilgrimage consumers); GRAMMAR×POP
(migration_right permit gate; settlement_provision founding; labor_compact);
GRAMMAR×TRADE (labor_compact production arm; settlement_provision streams);
GRAMMAR×WAR (mutual_defense readers). Every row declared with its consumer volume
named — the consumption split is explicit so no term repeats `non_intervention`'s
fate silently.
**Endings entries:** none new (term families ride the pact endings).
**Herald:** "Their priests may walk our roads and speak in our squares: it is
written." · "A hundred families may cross, and the fields they clear are theirs
to work." · "If one is struck, both answer: so it is sworn."
**Pins (negative hardest):** NO PRODUCER-LESS TERM — a walker asserts every
catalog row has ≥1 named producer or is an explicitly documented seam (the D4
lesson made law); each new term DRAFTS on a real fixture (producer reachability)
AND its `grant` read returns live/absent correctly across mint→expiry (the
one-reader lift pin); Law One negatives — `missionary_access` moves NO deity
truth (fixture asserts believer-band writes only); `labor_compact` exposes bands,
never counts; TERM_CATALOG freeze + families walker updated same-commit (the
frozen-list discipline); `mutual_defense` fires the EXISTING readers on a fixture
(the found-writer pin); war-door drafting of new families respects §13 stacking;
JSON-round-trip on treaties carrying new terms; dormancy golden (dark ⇒ catalog
extension inert — no producer runs, no read consulted; the freeze walker is
updated but behavior is byte-identical).
**Lifecycle:** new terms persist inside the existing treaty record (no new
ledger); import validates term types against the extended frozen list; legacy
saves never contain them (nothing to migrate); regen/undo ride the treaty
record's existing pins.
**Dossier round-trip:** WarFaithTab + TreatyPanel render the new families through
the SAME totality table — `TREATY_COMPLIANCE_VOICE` (family × state) gains the
new family rows, walker-guarded (`display/treatyDocument.js:36-60`); the pin
opens a town holding a faith-term pact and reads the right, its state, and its
remaining years in house voice.
**Bands:** per-family draft weights, grant-throttle detection floor (family-shared
with DETECT_FLOOR's shape), labor/production bonus caps, strain weights for
burdening rights.

### GR-4 — THE SUCCESSION QUESTION (rides `oathHolderEnabled` — second slice;
settled law: "succession-repudiation lands" + THE OATH-HOLDER IDENTITY's payoff)
The heir who breaks the father's oath becomes tellable. Historical register:
Charles VII's France disavowing the Treaty of Troyes — the world understood the
revolution, and priced the disavowal differently.
- **The trigger:** on ANY legitimate-power change (succession, coup, faction
  capture, H2 verdict removal, DM KILL/ASSIGN — the same event list WR-5's D
  re-read consumes; shared surface, declared), every treaty whose `sworn` stamp
  for that settlement names the FALLEN holder opens THE QUESTION. Legacy
  unstamped treaties open NO question (seat-voice treaties bind the seat —
  the provenance rule's teeth).
- **The three answers**, run through the new seat's character + books (WR-5's
  machinery where lit; existing legitimacy/alignment reads where dark) + posture
  (SP-4):
  - HONOR — the default and the expiry outcome: the question rides
    `worldState.proposals` as an actor-initiated major with
    hold-then-expire-to-HONOR (J-GR-3: silence honors the oath — the safe
    default; no forced drama). Honoring mints a small receipted beat ("the young
    king will keep his father's word") — continuity is ALSO a story.
  - DISAVOW — breachType `succession_repudiation`: every live term defaults
    through the EXISTING repudiation machinery (`treatyBreach.js`' shell
    discipline reused — broken shell legible until horizon, war-block lifts,
    `treaty_default` casus feeds), but severity is BANDED below 1.0 and graded by
    succession kind: coup-born seats pay least (the world understands a
    revolution), lineal heirs most (the world expected the word to hold).
    Approval-routed like all repudiation (always-proposal discipline preserved).
  - RENEGOTIATE — opens GR-5's renewal machinery early (a renewal proposal rides
    the pactProposals ledger, trigger `renewal`); available only where
    `treatyRenewalEnabled` is lit, else the arm is absent (flag independence).
- **THE CREDIBILITY CHARGE (the survey's thin leg, cured for ALL repudiation
  paths):** open repudiation (WR-0c's verb) and succession disavowal BOTH write a
  credibility delta through the existing `informationStatecraft` machinery (the
  `fractureCredibilityDeltas` idiom, new consumer) — banded by breach type
  (succession lighter). The oathbreaker's word finally costs something in the
  belief economy; a serial disavowing lineage becomes unpactable BY THE SAME
  NUMBERS that let it disavow cheaply once. Gated under `oathHolderEnabled`; the
  WR-0c path's charge is a disclosed lit-path behavior addition, declared here.
**Force / counterforce (same evidence):** force — succession freedom: the
succession record that names a new holder is what opens the choice. Counterforce
— THE CREDIBILITY LEDGER: the same succession record grades the price, and the
accumulated deltas close the door on the third disavowal. Both read the one
succession + breach history.
**Belief posture:** the question and its answer are public court facts;
NEIGHBOURS' reading of the disavowal arrives at news speed and lands as belief
(the deceived-distant-court can honor a dead peace for weeks — legal, tellable).
**Casting:** the fallen holder, the heir, the installing faction (coup path —
WR-5's demand-rides-succession-record read consumed, not duplicated) — all
existing planes.
**Clock:** question hold window = the actor-major hold band (6-week precedent,
own band); credibility decay per SP-5's family laws.
**Posture consumption:** the answer consults posture (an insular seat lets
distant oaths lapse toward disavowal; a diplomatic seat honors) — colour on the
choice's scoring, never a selector.
**Two-timescale echo:** fast — the question opens and answers in weeks; slow —
the credibility and casus consequences unwind over years.
**Couplings:** GRAMMAR×INTERIOR (the coup that was ABOUT the treaty: the interior
veto's organizing grievance naming the pact — INTERIOR's volume elaborates;
GRAMMAR supplies the treaty-side receipt); GRAMMAR×INFO (credibility deltas);
GRAMMAR×WAR (casus feed, war-block lift). Rows declared.
**Endings entries:** `disavowed_by_succession` joins pact endings.
**Herald:** "The old king swore it; the young king must choose." · "The son has
torn up the father's treaty, and the world understands — and does not forgive." ·
"The young king will keep his father's word." · "Twice now this line has
disavowed; who will sign with them a third time?"
**Pins (negative hardest):** THE SILENCE-HONORS pin — an unanswered question
expires to HONOR with its receipt, and NOTHING defaults (the no-forced-drama
negative, hardest); legacy-unstamped treaties open NO question; the PRICE
DIFFERENTIAL pin — same treaty, coup-born vs lineal succession, two severities
and two credibility deltas, both receipted; war-block lifts on disavowal exactly
as on repudiation; THE COMPOSITION PIN (the program's signature fixture, the
D-chain's sibling): coup resolves → question opens → heir disavows → casus feeds
→ the next war cites the broken oath — one fixture, five subsystems, all
existing; THE HEIR'S DISAVOWAL TELLABLE pin: the survey's IMPOSSIBLE story walks
end to end in receipts; credibility charge fires for BOTH repudiation paths and
for NEITHER when dark; dormancy golden.
**Lifecycle:** the question rides `worldState.proposals` (existing lifecycle
laws — VERIFY-AT-BUILD its exact payload shape); `succession_repudiation`
breach records persist through the existing shell discipline; JSON-round-trip
on the graded severity; regen re-opens no settled questions (answers are
history); undo restores an open question with the proposals queue.
**Dossier round-trip:** WarFaithTab shows the open question ("the new seat has
not yet said whether the old peace holds"); after the answer, the treaty block
shows honored-by-the-heir voice or the broken shell; TreatyPanel + PDF the same.
The pin opens the town mid-question and after each answer arm.
**Bands:** severity bands by succession kind; credibility delta bands by breach
type; question hold window; honor-beat significance.

### GR-5 — RENEWAL, RENEGOTIATION-FROM-STRENGTH, CONVERSION (flag
`treatyRenewalEnabled`; settled law: "renegotiation-from-strength opens")
Clean-lapse-only dies. Historical register: Meiji Japan revising the unequal
treaties — rebuilt first, then re-tabled, and the powers signed because the ratio
had truly moved.
- **The renewal window:** in the last `renewalWindowWeeks` (band) of any treaty's
  longest live term, either party may open a `renewal` proposal (the pactProposals
  ledger, trigger `renewal` — the fifth closed trigger). The sheet re-drafts AT
  THE CURRENT BELIEVED RATIO through the two-picture contract: each side
  re-appraises under its OWN present truthFor. A rebuilt loser renegotiates from
  strength — the design's own sentence, now a code path. No taker ⇒ the treaty
  lapses clean through GR-0's eulogy (renewal never forced — law L).
- **Renegotiation-from-strength mid-term:** a party whose believed ratio has
  swung past a band may DEMAND renegotiation before the window. The demand is a
  proposal like any other (refusable); refusal leaves the treaty standing and
  mints the strain fact on the demander's side (the existing strain→resentment
  idiom — a refused renegotiation is a grievance seed, not a casus; the war road
  stays the war road). The ask is CAPPED (band): renegotiation extracts toward
  the current ratio, never past it — no ratchet.
- **CONVERSION (the §12.5 arm, ruled):** a `compelled_alliance` reaching its
  window with compliance HONORED throughout and trust above band converts on
  renewal acceptance: the relationship label proposes `allied` through the
  EXISTING label-proposal lane, and the new treaty re-mints the alliance as
  voluntary — `mutual_defense` + `non_aggression`, provenance `converted`
  (J-GR-9: conversion is a label + re-minted symmetric terms, never a new term
  type). The compelled thing becomes the chosen thing, and the document says so.
**Force / counterforce (same evidence):** force — the current ratio: the believed
strength read that moved is what powers the demand. Counterforce — THE STANDING
PAPER: the same compliance record that proves the treaty held is the argument for
keeping it (a counterparty whose books value stability scores renewal-as-is above
concession; the refusal arm is priced by the same ratio read the demand cites).
**Belief posture:** ratios are beliefs on BOTH sides (K3; the renewal evaluator
joins the pin set); a court that misjudges its own rebuilt strength demands, is
refused, and the receipt can say why post hoc — the mistaken-court pin, peacetime
edition.
**Casting:** GR-1 stamps re-mint on renewal (the NEW holders swear — a renewed
peace is a new oath; the eulogy of the old and the signing of the new are one
tick's two beats).
**Clock:** window and caps on the treaty's own clock marker; renewal proposals
ride the same dwell physics as GR-2.
**Posture consumption:** demand initiation gated by posture + risk (a timid
rebuilt court sits on its strength — legal, and the dossier's strategy read may
say so); acceptance reserve as GR-2.
**Couplings:** GRAMMAR×WAR (the ratio reads; a refused demand's strain feeding
revanchism's existing clock); GRAMMAR×INTERIOR (renewal against the powers'
wishes feeds the same interior lane as formation). Rows declared.
**Endings entries:** `renewed`, `renegotiated`, `converted` join pact endings.
**Herald:** "Rebuilt and unbowed, they have asked for new terms." · "The peace
was renewed at the river, lighter than the one it replaces." · "The compelled
alliance is compelled no longer." · "They asked for new terms and were told the
old ones stand."
**Pins (negative hardest):** REFUSAL-OF-RENEWAL ⇒ clean lapse through GR-0's
beat, NOTHING else moves (no forced renewal, no grievance mint — the L-law
negative, hardest); REBUILT-AND-UNBOWED TELLABLE pin: the survey's IMPOSSIBLE
story on one fixture — loser rebuilds, window opens, terms lighten, both
appraisals receipted; the ASK-CAP pin (a demand past the cap drafts AT the cap —
no ratchet); CONVERSION NEGATIVE — compelled alliance with a strained record does
NOT convert (the gate is the record, not the calendar); mid-term demand refused
⇒ strain fact, NO casus; the K3 pin set extension; dormancy golden.
**Lifecycle:** renewal re-mints a NEW treaty record (old one ends `renewed` —
its full compliance history stays chronicle-legible; no in-place mutation of a
spent instrument); provenance chain pinned (`renewed`/`converted` point at the
predecessor's id — VERIFY-AT-BUILD the treaty id shape); JSON-round-trip; regen/
undo ride the treaty and proposal ledgers' existing pins.
**Dossier round-trip:** WarFaithTab shows the window ("the peace runs out with
the spring; the courts are speaking"), then the renewed instrument with its
lineage line ("the third peace of this name"); TreatyPanel + PDF the same. The
pin opens the town in-window and post-renewal.
**Bands:** renewal window length; mid-term demand threshold (ratio swing band);
ask cap; conversion trust band; renewal-beat significance.

### GR-6 — MEDIATION GENERALIZED (flag `mediationGeneralizedEnabled`; settled
law: "mediation generalizes — any cross-pressured neighbour, the temple arm via
FAITH")
The broker before the blood. Historical register: the papal arbiter at
Tordesillas — the cross-pressured third whose interest is the peace itself.
- **THE SINGLE-FINDER LAW:** `findCrossPressuredMediator` (`peaceTerms.js:
  1128-1146`) remains the ONE finder; this wave adds OCCASIONS, never a second
  algorithm (the mint/reason no-drift discipline that already guards it —
  comment at `:1103-1108` — extends to every new consumer).
- **Occasion 1 — THE INTENT STAGE (pre-war):** a deposited war intent (the W1
  `warIntents` ledger) whose pair admits a cross-pressured neighbour triggers a
  mediation attempt BEFORE the opener fires: the mediator's weight lands as a
  peace-side pressure on the intent's scoring (a bounded multiplier — the
  embassyLedger idiom pointed the other way), receipted with the broker's name.
  Success ⇒ the intent decays un-opened and the receipt says who stood between
  ("the war that did not happen" gains its name); failure ⇒ the opener proceeds
  through every existing gate UNTOUCHED (mediation never blocks — law L; a
  pressure, not a wall).
- **Occasion 2 — THE FRAYING PACT:** a treaty whose fraying term crosses toward
  default (the existing `frayingTermOf` read) admits a mediation pass before the
  cascade: the mediator proposes a renewal round (GR-5's machinery where lit;
  where dark, the pass softens the strain accrual one notch, banded) — the
  neighbour who saves the peace earns the same two-edge trust the war-exit broker
  does (`accrueMediationTrust` reused).
- **Occasion 3 — THE TEMPLE ARM (via FAITH):** when the cross-cut is faith-led on
  BOTH sides, the mediator's TEMPLE is the named broker — casting through the
  existing institution + faith-facet planes (`cohesionWeave.js:261`'s facet
  resolution — the survey confirmed temples already enter the math there; this
  arm NAMES them in the receipt and hands FP-FAITH its stake: the temple that
  brokered a peace holds standing in both towns, elaborated in FAITH's volume).
- **THE INTERESTED BROKER (counterforce, same evidence):** the cross-cut test IS
  the interest detector — a third party whose ties run to ONE side fails the
  cross-pressure read and is NEVER the finder's answer (already true); NEW: a
  failed-cross-cut neighbour with high stakes may appear as the war-side
  interceptor kind (b) ("a third party wanting the war continued" — WR-7b's
  actor, cross-referenced) — the same evidence that disqualifies the broker
  CASTS the saboteur. No new state; the read is the casting.
**Belief posture:** the mediator scores from ITS OWN beliefs of both parties'
states (K3 — the finder's quadrant reads are already belief-adjacent;
VERIFY-AT-BUILD that the intent-stage read routes through belief, and pin it into
the K3 set).
**Casting:** the mediator settlement BY NAME everywhere (already law at the
war-exit table); the temple arm names the institution; seats and priests via
existing planes only.
**Clock:** mediation attempts per pulse at the trigger sites; no dwell state (a
pass is a read + a receipt, not a process).
**Posture consumption:** a mediator's WILLINGNESS gates through its own posture
(insular neighbours decline to broker — receipted decline, priced in trust
foregone); out-of-posture brokerage legal and priced.
**Two-timescale echo:** fast — the pass and its receipt; slow — the trust
accrual and the brokered peace's own long life.
**Couplings:** GRAMMAR×WAR (intent-stage pressure; interceptor casting);
GRAMMAR×FAITH (the temple arm's standing); GRAMMAR×INFO (the broker acts on
beliefs — a deceived broker mis-brokers, legal and tellable). Rows declared.
**Endings entries (mediation vocabulary, closed):** `brokered_back` (intent
dissolved), `brokered_terms` (pact saved/renewed), `declined_to_broker`,
`brokerage_failed`.
**Herald:** "The temple stood between two angers, and both stood down." · "X
stood between them before the first march; there will be no war this spring." ·
"They were asked to stand between, and would not."
**Pins (negative hardest):** MEDIATION NEVER FORCES — a failed pass changes NO
gate outcome (the opener fires exactly as un-mediated; law L's negative,
hardest); the INTERESTED-BROKER negative — a one-sided neighbour is never
selected, and the same read casts it as WR-7b's interceptor on the war side
(one fixture, both faces); THE WAR-THAT-DIDN'T-HAPPEN TELLABLE pin — intent
deposited, broker found, intent decays, receipt names the broker (the mediation
story moves from the exhausted end to before the first march); temple-arm
casting pin (faith-led both sides ⇒ the institution named); single-finder walker
(no second finder module anywhere — source scan); trust accrues on BOTH edges at
every occasion (the war-exit invariant preserved); dormancy golden.
**Lifecycle:** no new persisted state — occasions read existing ledgers; receipts
only. Nothing to regen or undo.
**Dossier round-trip:** the mediator's town shows its brokerage ("this court
stood between Thornwall and the Vale") through the turning-point/chronicle
rendering; the saved pair's WarFaithTab names the broker on the pact line
(already does at war-exit — extended to the new occasions). The pin opens all
three towns.
**Bands:** intent-stage pressure multiplier (bounded — the embassy precedent);
fraying-pass strain soften; decline posture threshold; temple-arm significance.

### GR-7 — MEASUREMENT + CERTIFICATION (no flag; the WR-9 discipline)
The survey's flattest finding: NO soak script observes the treaties ledger at
all — counts, compliance distributions, stream-grain movement, all unmeasured
claims. This wave is the program's acceptance harness.
- **Soak observations (the audit scripts gain a treaty section):** live-treaty
  count over time; compliance-state distribution; formation-vs-dictation ratio
  (THE THESIS METRIC — before this program it is structurally 0; the program is
  real when negotiated instruments hold a sane share); endings mix; term-lifetime
  distribution against the 52-week clock; grain actually moved by stream terms at
  population scale; proposal refusal/no-overlap rates; mediation occasion counts
  and save rate; succession-question answer mix.
- **THE PACT ENDINGS VOCABULARY (closed) + share envelopes:** {`ran_its_term`,
  `renewed`, `converted`, `renegotiated`, `repudiated`,
  `disavowed_by_succession`, `hollowed_quiet` (DM-only), `hollowed_detected`,
  `broken_by_war`} — each with a share envelope (WR-9's shape; SP-6's harness);
  one path carrying nearly all endings means the others are decoration (L's
  criterion). Lapse+renewal should dominate; repudiation rare; disavowal rarer;
  quiet hollowing a real minority (the fog must actually hide things or the
  monitor bands are wrong).
- **Formation envelopes:** trigger mix (no single trigger >banded share);
  refusal rate inside a healthy band (all-signed means reserves are decoration;
  all-refused means triggers are noise).
- **Certification rows** for all five flags (the subsystem registry's Growth-lane
  discipline); receipt fields for the formation-trigger histogram and the
  endings histogram (the Herald's "how do pacts die here?" at soak scale). ⚠️
  never declare a `wizard_news.*`-fed identity on a certification row (the
  moverFamily skew hazard, standing).
- **Every envelope carries a mutant negative control** (house law).
**Pins:** envelope harness fixtures; the thesis-metric pin (a soaked world with
formation lit mints ≥1 negotiated treaty — the vacuous-absence discipline:
seeded non-empty, never asserted on an empty harness); certification walker reds
on out-of-order lighting (§3).
**Lifecycle:** no world state — envelopes, rows, receipt fields only.
**Dossier round-trip:** not applicable (measurement); the certification rows ARE
this wave's landing surface.
**This wave closes the program: the program is DONE when these envelopes hold on
an owner-ordered soak, and not before.**

---

## §6 JUDGMENT BLOCKS (the drafting chair's rulings under delegation — vetoable
## here; an implementer NEVER re-rules these silently)

- **J-GR-1 (the formation seam):** peacetime formation is a second exported pass
  INSIDE `peaceTerms.js` (`advancePeacetimePacts`), fed by a proposer/ledger pair
  (`pactTriggers.js` pure, `pactProposals.js` one-writer); `mintTreaty` stays
  module-internal. VETO builds a second minting module and accepts the forked-
  writer risk consciously.
- **J-GR-2 (the demand's measure):** no peacetime margin budget; sheets draft from
  the trigger's own read and clear on the two-sided conjunction. VETO reuses
  `termBudgetFor` with a synthetic margin.
- **J-GR-3 (silence honors):** the succession question expires to HONOR. VETO
  makes expiry disavow (and accepts forced drama + the oath law's breach) or
  makes it a coin-band.
- **J-GR-4 (graded disavowal):** `succession_repudiation` is a NEW breachType
  with banded severity by succession kind, riding the existing shell machinery.
  VETO rides plain `repudiation` with a discount field.
- **J-GR-5 (the `grant` executor):** the 7th executor kind carries all
  standing-right terms; reads consolidated in `treatyEnforcement.js` per the
  one-reader law. VETO spreads right-reads across consumer modules (and accepts
  desynchronized expiry).
- **J-GR-6 (single finder, occasions only):** mediation generalizes by occasion;
  `findCrossPressuredMediator` stays the one algorithm. VETO forks a
  peacetime finder.
- **J-GR-7 (refusal asymmetry):** peacetime refusal = turning-point + banded
  trust delta, NO grievance; war-peace refusal keeps G2's full price. VETO prices
  them alike (and accepts either proposal-spam deterrence collapsing or peacetime
  refusal warmongering).
- **J-GR-8 (proposals are re-derivable):** regen re-derives open proposals from
  re-scored triggers; signed history is what regen preserves. VETO treats open
  proposals as precious state carried through regen.
- **J-GR-9 (conversion's shape):** compelled→real alliance converts as label
  (`allied`, existing lane) + re-minted symmetric terms (`mutual_defense` +
  `non_aggression`), provenance `converted`. VETO invents a conversion term type.
- **J-GR-10 (no anniversary beats):** longevity is dossier voice + the lapse
  eulogy. VETO schedules anniversary news (and answers to the pacing governor).
- **J-GR-11 (`mutual_defense` joins security):** SP-3 names faith + population
  families; the shared-threat trigger needs a product and the tree holds readers
  with no writer (`defensive_pact` read-sites) — the term is the found writer,
  an elaboration within settled law, NOT a re-opening. VETO drops the term and
  leaves shared_threat minting NAP-only sheets (and records that the voluntary
  alliance stays a label with no terms).
- **J-GR-12 (conversion-mandate refused):** the design-doc's conversion-mandate
  term is NOT catalogued — it resolves belief by fiat (Law One). This is a
  declared non-goal, not an omission. VETO catalogs it with a belief-side
  executor and takes the Law One argument to the owner.
- **J-GR-13 (the credibility charge reaches WR-0c's path):** open repudiation
  gains its delta under `oathHolderEnabled` — a lit-path behavior addition to a
  landed feature, disclosed here, flag-fenced. VETO scopes the charge to
  succession disavowal only.

## §7 THE TUNING SURFACE (owner-signed, per THE PROMISE; band FAMILIES keep the
## signature surface tractable — spine §5)
GR-0 beat significances + lie-window + age-phrase thresholds · GR-2 trigger
crossings (ONE family-shaped band set × four triggers) + proposal cap + dwell
floor + refusal trust delta + reserve weights + out-of-posture price · GR-3
draft weights + grant-throttle floor + labor caps + right-strain weights · GR-4
severity-by-succession bands + credibility deltas + hold window · GR-5 renewal
window + demand threshold + ask cap + conversion trust band · GR-6 intent
pressure multiplier + strain soften + decline threshold · GR-7 envelope shapes
(endings mix, trigger mix, refusal band, thesis floor). Every one banded, none a
bare float on a surface, one tuning table per wave (the house idiom).

## §8 HERALD + LEGIBILITY CONTRACT (sentences this program must be able to say)
- "Grain for ore: the courts have set their names to it." (GR-2)
- "Neither shall march on the other — signed in peace, not extracted at a war's
  end." (GR-2)
- "They asked, and were refused; the refusal will be remembered." (GR-2)
- "Twenty years this peace has held." / "…and no man now living signed it." (GR-0)
- "The tribute came light, and this time the court noticed." (GR-0)
- "The peace was priced on a lie, and now the lie is out." (GR-0×INFO)
- "The old king swore it; the young king must choose." (GR-4)
- "The son has torn up the father's treaty, and the world understands — and does
  not forgive." (GR-4)
- "Rebuilt and unbowed, they have asked for new terms." (GR-5)
- "The compelled alliance is compelled no longer." (GR-5)
- "The temple stood between two angers, and both stood down." (GR-6)
- "X stood between them before the first march; there will be no war this
  spring." (GR-6)
Every one carries id + full address chain + typed action + named settlements +
recorded reason (law 1a-5), registers in WHAT_PHRASES + heraldRouting + the
pacing/significance machinery (§1.12 — story density has flow control by law).

## §9 SEQUENCING + PRECONDITIONS
1. This program builds behind the sim-proof path and FIRST among the six (spine
   §5: SP → GRAMMAR → …). BUILD-PRECONDITIONS: the war program through WR-7c
   (`negotiationPictures.js` exists — built once, THERE; if owner re-ordering
   puts GRAMMAR first, the wrapper builds here and WR-7 consumes it —
   STOP-and-report so the chair re-homes it, never two copies) and the SP spine
   waves this volume consumes (SP-1 errands for lit transport, SP-2 believed
   subjects for triggers, SP-4 posture, SP-6 narration kit, SP-7 temporal
   walker). Each wave names its degraded-dark reads where a precondition may
   lawfully be dark; silence means the precondition is hard.
2. Wave order: GR-0 → GR-1 → GR-2 → GR-3 (same flag, second slice) → GR-4 →
   GR-5 → GR-6 → GR-7. Each consumes the last; GR-7 closes.
3. THE OWNER-HELD BOUNDARY IS UNCHANGED: nothing here lights a flag, runs a
   soak, or ratifies a band. Lighting happens at owner-signed points in build
   order, after the war program's flags per its own §9.
4. The AUDIT STAGE is part of the build (spine §5): this volume does not ship to
   Sol unaudited.

## §10 IMPLEMENTER PROTOCOL
DESIGN_WAR_RULINGS_ARCHITECTURE.md §10 binds verbatim (worktree/branch
discipline, no `git add -A`, no stash, gate-tail only, one wave = one commit,
golden discipline, helper obligations, report-don't-rule, CONFIRMED/PLAUSIBLE
labeling). Grammar-specific additions:
1. Never fork a peaceTerms evaluator; never mint a treaty outside
   `peaceTerms.js`; never edit `momentum.js` (inherited).
2. The TERM_CATALOG freeze, its families walker, and `TREATY_COMPLIANCE_VOICE`'s
   totality table update in the SAME commit as GR-3 or the walkers red.
3. Every new news kind registers in WHAT_PHRASES + heraldRouting + rumor voice +
   chroniclersLetter rows in the kind's own commit.
4. Any conflict between this volume, the spine, an amendment, or the tree is a
   STOP-and-report to the validation chair.
