# THE COMPREHENSIVE REVIEW + FIX PROGRAM (Playbook PART 9 grade-check, executed)
## Opened 2026-07-13 — Fable 5 main loop (surveyor/architect/manager/checker) + Opus 4.8 (verifier/implementer)

This is the live program doc for the owner-directed comprehensive review of the ENTIRE codebase
followed by a verified fix program. It is written so a successor AI (or a fresh session after a
usage-window reset) resumes from THIS FILE + fresh `git log`/`git status` + the playbook §0.0 state
ledger — never from a session digest.

> **Progress** (append after every phase/wave — this blockquote alone must reconstruct program state)
> - 2026-07-13: Program opened on branch `review-fixes-2026-07-08` @ 62c81a0c (M11b calamity tip,
>   clean tree). Phase S (survey) DISPATCHED: workflow `wf_c21bb055-cb9` — 28 Fable agents
>   (18 subsystem readers + 10 dimension reviewers), running in background. Baseline full gate
>   (`npm run check`) on the clean tree: **GREEN, exit 0 — 8,348/8,348 tests (726 files),
>   verify:dist 108/108** (2026-07-13, run under survey load; the known pipeline.property flake
>   did NOT fire). Any red later in this program is program-caused until proven otherwise.
>   Nothing committed by this program yet except this doc.
> - 2026-07-13 ~19:40: Phase S landed WITH A CUT: 20/28 agents completed (9.4M survey tokens,
>   1,837 tool uses, ~63min) → 208 findings (0 critical / 44 high / 85 medium / 79 low; 190
>   surveyor-confirmed). 8 slices died on the 5h session limit (build-tooling-docs + 7 dimensions);
>   re-dispatched post-reset via workflow resume (cached prefix + live re-runs). Phase A COMPLETE:
>   assessment + full findings register committed as docs/COMPREHENSIVE_REVIEW_2026-07-13.md.
>   Phase V DISPATCHED: Opus verifiers — 2 independent lenses per high finding, 1 per medium;
>   79 lows deferred to implementation-time verification (recorded deferral, not dropped).
> - 2026-07-13 late eve: SURVEY COMPLETE 28/28 (round-2: +71 findings → cumulative 271, 0C/57H/
>   121M/101L; security A+; counterpart matrix confirms synthesis; new: entity-ref half-merge,
>   dramatic_campaign zero-drama, display token leaks). Banked @ b4954688. Round-2 verification
>   dispatched (21 new non-dup code findings; doc-drift findings manager-verified instead).
>   **W-DOCS-1 SHIPPED @ f8e5f6e7** (succession-ledger repair: M11a/M11b rows, stale budget/NEXT/
>   foreign-WIP notes, W5+W2 double-allocation flagged) — first fix wave of the program, closes
>   register ids docs-knowledge-1/3/4/5, build-tooling-docs-1/2, spatial-engine-7,
>   sim-logic-counterparts-11. Both Phase-V workflows in flight.

## The owner's directive (2026-07-13, verbatim intent)
1. Fable 5 does the survey + dimensions survey: read/review/analyze the ENTIRE codebase; deliver
   objective, holistic, comprehensive, exhaustive thoughts on it as CODE, as PRODUCT, and how well
   the code meets the product's goals and ambitions.
2. Only after that: for each finding, Opus 4.8 (ultracode) both VERIFIES the finding and IMPLEMENTS
   the fix — comprehensively, coherently, seamlessly, carefully, cohesively, exhaustively.
3. BOLD-OVER-SAFE, owner-escalated: "If you ever have to choose between maximal safety of the
   current architecture vs something objectively better that comes with risk or overhauling the
   architecture, choose the latter every time and clean up. I am trying to mature my code to
   absolute perfection — not simply fix it cleanly where it is at."
4. Substantive logic is in scope: cohesiveness, appropriate counterparts to mechanics, whether the
   sim makes sense — "as cohesive, complete, and immersive as possible, not just in code but in
   experience."
5. Fable 5 acts as architect, manager, and checker after each fix.
Constitutional laws (§0.2) and product boundaries still bind (the owner's bold-over-safe has always
been "within the constitution" — §0.2-6). Owner-gated classes are NEVER self-ruled: push/deploy,
migrations, schema/persistence shape changes, data deletion, security posture, paid-surface
behavior, budget raises, golden regens.

## Owner rulings landed during this program (binding on wave plans)
- **2026-07-14 — G3 APPROVED TO ARCHITECT (owner: "I like your thoughts about the upswings and
  building on the relationships, and I want you to architect that with Fable"):** Fable authors the
  upswing-drama + relationship-driven-material-flows design (relief caravans, ally credit,
  trade-as-diplomacy, reconstruction/boom arcs). BUILD comes after the fix program.
- **2026-07-14 — THE AI SECOND CONTROL SURFACE ("Surveyor") — owner delivered a full 41-section
  vision to consider + architect:** AI as interface/interpreter/planner/analyst/editorial layer
  over the deterministic engine, never the world engine itself. Trust model: AI proposes →
  simulator validates+resolves → DM authorizes. One operation layer for manual AND AI. Surveyor
  $19.99 tier + managed credits + BYOK; provider-neutral adapters; consented intent→operation
  training corpus separate from analytics; dev sequence: read-only analyst → briefs → post-session
  interpretation → custom content → settlement construction → realm construction → advanced
  autonomy. Fable architecture doc required; BUILD after the fix program.
- **2026-07-14 — SEQUENCING (owner, verbatim intent): "All of this of course, after fixing
  everything and adding all the uncompleted work."** The Track N/G fix program + unplugged-work
  completion runs FIRST; the two architecture docs are authored now (design is not build); their
  implementation queues behind program completion.
- **2026-07-14 — FOUNDER CAP RESOLVED BY THE OWNER'S OWN SPEC (§25: "The Founder tier is limited
  to 30 lifetime seats")** — answers owner-ask #3: 30 is truth; FounderTile's 500 and the email
  template's "first 500" are the bugs (F4 fixes both). Founder×AI posture per §25: lifetime
  Premium + Surveyor core interface + BYOK, no unlimited funded inference.
- **2026-07-13 — PDF export monetization:** free tier pays $2.99 per dossier PDF; only premium
  gets unlimited export. The shipped free-unlimited-export gate is wrong; flip it to the existing
  single-dossier entitlement ladder. Pricing-page copy was already correct; align the other five
  tier-fact surfaces to it via one derived tier-facts module. (Review doc §6.2 updated in place.)

- **2026-07-14 — THE LOADED-DICE LAW:** wherever possible and appropriate, PRNG forks remain
  situation-weighted — seeded forks on stable keys sampling distributions the situation loads
  (EV/pressure/character), flat only where the fiction is indifferent, weights receipted.
  Binding on E1/W-PEACE/W-DOCTRINE/SM briefs. Canonical text: DESIGN_COHESION_WEAVE §H.

- **2026-07-14 — CORRUPTION WEB + SETTLEMENT POLITICS (owner-ratified, designs pending recon):**
  (1) Corruption generalizes the LEASH (foreign court/faction/criminal-org + the cutout) while
  local influence-and-effect mechanics stay byte-identical; weight-tampering under the loaded-dice
  law; blowback triple incl. casus-belli-class exposure; SCARCITY AS LAW (rare/expensive/slow,
  E0-classed, capped concurrent assets). (2) Intra-settlement COALITIONS: scale-free reuse of the
  peace engine's coalition machinery (blocs, concessions, differential strain, defection windows,
  fracture on succession); ruling bloc loads the settlement's decision dice (same kernel as
  corruption, opposite legitimacy); conspiracies = covert coalitions; depth cap + hysteresis as
  law; VOCABULARY SPLIT: "concessions" = overt glue, "compromise" stays corruption-only.
  (3) NPC DIMENSION (owner addendum, verbatim intent: "take into account the NPCs within
  coalitions for the fragmentation, formation, direction, movement of said coalitions, how strong
  or how fragile, to what end"): leader ties ease/block formation; NPC goals color the bloc's END;
  personal-loyalty glue = strong-but-succession-fragile (people-held) vs concession glue =
  transactional-but-durable (seat-held); secondaryAffiliation NPCs are the natural bridge/defection
  points; all under §G law — bounded modulators + receipts, never engine-resolved fates.
  Both docs FROZEN 2026-07-14: DESIGN_CORRUPTION_WEB.md +
  DESIGN_SETTLEMENT_POLITICS.md (grounded on the 3-slice corruption recon — key findings:
  foreignPatron ships write-only awaiting its reads; the leash seam is name-string resolution in
  ≥4 sites → resolver chokepoint; the exposure fallback mis-attributes foreign conspirators to
  the innocent local guild → deliberate attribution; one PLAUSIBLE covert-impairment-text leak
  through toPublicSafe flagged for the build wave's visibilityAudit pin). Build home W-DOCTRINE.
  THE DESIGN CORPUS CLOSED at the scope freeze; REOPENED ONCE by owner directive (2026-07-14
  late) for DESIGN_EVENT_COMPOSER_V2 (every capability forceable, bounded-by-construction, live
  dial previews; recon found + design closes the PHANTOM-EVENT hole and retires the stale-preview
  bypass; W-COMPOSER-1 parallel-safe with E1, W-COMPOSER-2 rides the proposal applier; the
  COUNTERPART CRITERION is now a standing playbook law). Corpus closed again behind it.

- **2026-07-14 — SCOPE FREEZE (owner: "for the first time in a minute... i think i am done adding
  things"):** the design corpus is CLOSED as of this ruling. Final scope = everything above +
  the frozen docs. From here the program is EXECUTION ONLY: pending designs write from the
  corruption recon (corruption web + settlement politics w/ NPC dimension), then builds proceed
  down the master sequence. New scope requires a fresh owner directive.

- **2026-07-14 — FULL-PROGRAM DELEGATION (owner, verbatim: "i leave it to you to get every
  remaining phase and wave done!"):** standing authority to execute every remaining wave and
  phase autonomously — E1a-d, W-PEACE, W-DOCTRINE, SM-3, W-COMPOSER-1/2, Surveyor S1-S7, SM-4,
  the final re-grade, soak+tuning, and the master merge per MASTER_MERGE_PLAN.md — using the
  standing model split (Fable architect/manager/checker; Opus implementer/verifier) and
  worktree-isolated parallel agents where lanes permit. OWNER-GATED ITEMS SURVIVE THE
  DELEGATION (never self-ruled): any git push / deploy / supabase db push; E0 + preset LIGHTING
  and any golden-shifting event (owner-signed regen only); budget raises; new schema/persistence
  envelope surfaces; paid-surface behavior changes beyond frozen designs; the standing one-line
  vetoables (exercisable anytime). JUDGMENTs continue to be recorded vetoably; deferrals
  documented; every wave gated green before commit.

- **THE SOAK CHARTER (owner-delegated study items, 2026-07-14/15 — decided IN the soak phase):**
  (1) **CENTURY PROBES** (owner: "rethink sub-century, determined by the soak"): alongside the
  30-year runs, 100- and 300-year soaks with certification criteria — mover-activity
  distributions healthy across the span (no stasis onset, no cacophony), neighbor-seed
  divergence still GROWING at year 200, state growth bounded, no attractor lock, succession
  turnover clean at volume, chronicle-at-year-300 legibility. If certified: sub-century converts
  from constitutional limit to conservative promise (advertised horizon = certified horizon).
  If attractors found: report which loop flattened + weights-vs-missing-mover verdict (missing
  movers = owner decision). (2) **THE SETTLEMENT CAP STUDY** (owner: "consider if we should put
  a cap in the number of settlements in a campaign for the world pulse... I'll leave that up to
  you"): measure tick-cost curves vs realm size (10/20/50/100 members) on the worker path;
  define the minimum performance threshold (advance + catch-up latency budgets on mid-range
  hardware); find the knee; JUDGMENT-set a uniform CANONIZE-TIME cap at the knee with headroom
  (creation-time constraint, never runtime degradation — same-seed byte-identity requires N
  settlements always fully simulated; no LOD). Surface the cap honestly at canonize ("realms up
  to N run at full fidelity"). NOTE: any TIER-DIFFERENTIATED cap is paid-surface = owner-gated;
  the uniform engineering cap is within the standing delegation.

- **2026-07-15 (night) — TOTAL DELEGATION (owner, verbatim: "continue all the way to the very end
  of all the commits, phases and waves. I officially delegate all decisions to you should they
  appear"):** every remaining judgment call is mine to make and record vetoably. THE
  CONSTITUTIONAL GATES STILL HOLD (they are structural, not discretionary): no push, no deploy,
  no db-push; no golden-shifting commit (the E0/preset LIGHTING regen batch will be PREPARED and
  parked for the owner's morning signature — note the soak does NOT need it: soaks run gate-ON in
  harnesses, dormancy keeps user-facing goldens intact); no budget raises; no new save-envelope
  surfaces. The master merge (a local merge, not a push) is within delegation per the standing
  handoff plan and executes per MASTER_MERGE_PLAN.md with gates between steps. Everything else
  runs to completion: E1c/E1d, W-PEACE ×3, W-DOCTRINE ×4, SM-3, W-COMPOSER-2, Surveyor S1-S7,
  SM-4, the re-grade, the soak (incl. the charter studies), the merge.

- **2026-07-15 — THE GUIDANCE LAYER commissioned (owner: onboarding/instruction UX as the final
  scope item) + THE IMMERSION LAW (owner, verbatim intent: "make sure that it is coherent and
  cohesive with the UX, it has to seamlessly integrate with it and provide immersion rather
  than dissociation"):** the guidance system consolidates all instructional fragments (pills,
  what's-next popups, about/HowToUse, empty states) into ONE registry + hard concurrency budget
  + walker (no hint may exist outside the registry); triggers = FIRSTS not time; audience lanes
  inferred never asked; the Surveyor's-notes persona (scripted, deterministic, zero-AI — the
  free ghost of the paid voice); the generated glossary (registry-derived, drift-proofed);
  empty-states-as-invitations; whisper effectiveness measured via the analytics seam. THE
  IMMERSION LAW binds every hint: same theme tokens/typography as the study (never generic
  tooltip chrome), margin-note placement (never floating over content, never dimming/coach-marks),
  rest-point timing (never mid-action), the two-register voice law, zero-new-chrome delivery
  preferred (teach through existing organs: empty states, veto prose, receipts, digest,
  compendium), and THE DISSOCIATION TEST as per-hint acceptance: "could this be screenshotted
  and mistaken for the world's own furniture?" DESIGN_GUIDANCE_LAYER.md FROZEN 2026-07-15 (recon-grounded:
  ~40-fragment census + ~340 title= layer + the dormant firsts substrate discovered; five
  violator dispositions decided vetoably under the delegation incl. PipelineReveal
  theater-once; ActionRail deleted — zero consumers). THE CORPUS IS CLOSED — FINALLY AND
  COMPLETELY. Builds as W-GUIDE-1/2 in the display lane; S1 voice-alignment pass; the
  criterion gains its final clause (every mechanism ships its registered whisper).

- **2026-07-15 — W-INTERVENTION commissioned (owner, two-message spec; the engine reopens by one
  coupling wave):** foreign armies may join a settlement's INTERNAL contest (coup/rebellion/bloc
  showdown) on either side — empire-retention (grip/vassal treaties → prop the incumbent),
  regime-change (hostile edge + challenger affinity or a corruption leash on the challenger →
  back the rebels), protect-investment (debtor/trade/compelled-alliance obligations), kinship
  (§G ties), and DENIAL (counter-intervention). OWNER ADDENDUM (verbatim intent): "a different
  army for an opposite purpose can join the scene to help or be a counterforce — the ending
  results in the same as though a battle happened and the loser retreats." → Opposing
  intervention forces resolve through the EXISTING collision/battle machinery VERBATIM (loser
  RETREATS via the standing transit semantics), THEN the surviving side's bounded support term
  tilts the coup/contest verdict. Design recommendations (vetoable at freeze): proxy stays proxy
  — a sponsors' clash mints typed casus/grievance between the sponsors but never auto-declares
  war (the reasons machinery decides escalation); invited-vs-uninvited legitimacy asymmetry;
  collateral grievance from the contested town against whoever made its square a battlefield;
  installed regimes OWE (E1 gratitude/obligation mint — the client-state drift the corruption
  web reads); overstay transitions to the occupation machinery; non-intervention clauses join
  the W-PEACE term catalog; E0-classed rarity; state-never-fate (powers installed, persons
  never resolved). Builds as W-INTERVENTION before W-COMPOSER-2 (its verbs join the realm
  manifest lift). DESIGN_CONVERGENCE.md FROZEN @ c88e0129 (the multi-sided law, intervention,
  reactive war). NAVAL ADDENDA (owner): navies convoy own/allied armies on water routes; two
  hostile navies meeting = a sea battle with LAND-PARITY semantics (loser retreats to port; an
  army at sea shares its convoy's fate); and **"A BLOCKADE IS THE SAME AS A SIEGE"** (owner law,
  verbatim) — a naval blockade of a port MINTS A SIEGE through the existing machinery: the
  interdiction term resolveSiegeVerdict already carries is the hook, water supply lines cut feed
  the same starvation/capitulation reads, blockade-running rides the M7 smuggle machinery by
  sea, a relief fleet lifts the blockade via the convergence law (sea battle, loser retreats),
  land-siege + blockade = combined arms under one aim-group, and blockade feeds the
  economic_strangulation peace reason. DESIGN_NAVY.md freezes on the naval recon's return with
  this as its spine. Covert-leak chip session ENDED — harvest queued.

- **2026-07-15 (morning) — W-UPSWING COMMISSIONED + THE UPSWING CONSTITUTION (owner, "do the
  upswing" + a full design ruling, verbatim intent):** (1) **THE UNIFICATION LAW — "upswings and
  downswings are not two different things, they operate on the same variables and dimensions."**
  W-UPSWING is NOT a new system; it completes the SIGN of the existing one (the engine's write
  traffic has been mostly downward — the stasis finding). No separate boom machinery: booms and
  golden ages are emergent labels over the same variables running up. (2) **CONSERVATION — "it is
  not new capital and growth from nothing":** every upswing has a typed SOURCE (new allies' aid,
  a new population source, stronger trade + investment, conquest extraction) and the source is
  DEBITED — receipts name source and limit. (3) **LIMITS ARE FIRST-CLASS:** an upswing is bounded
  by (a) natural resources (the digest's endowment — the hard carrying capacity), (b) an ally's
  aid = INTENT × CAPACITY ("the generosity or limitations of an allied partner's aid both in
  intent and capacity" — generosityEV already computes both), (c) an empire's EXTRACTION ceiling
  + its ability to convert extraction into citizen benefit ("the limits of that empire's ability
  to extract and give its citizens benefits" — the corruption web is the leak in that pipeline),
  (d) absorption (growth conditions must exist locally). (4) **SCOPE — regional or local:** an
  upswing can be one settlement or an entire region; regional character emerges from SHARED
  SOURCES (a trade artery, a peace dividend), not a new scope object. (5) **MOTIVE INTEGRATION:
  "an empire seeks to conquer to improve their upswings; an ally invests and that grants an
  upswing"** — conquest EV gains the extraction-upswing term; E1 generosity instruments are the
  investment verbs whose upside loop this wave closes.
- **2026-07-15 (morning) — CALAMITY IS A BUCKET (owner ruling, verbatim intent): "Calamity should
  be a catch-all term... it could be a beast wave, it could be a literal hand of god, a fire,
  drought, flood, earthquake, tarrasque — the flavor is for the DM; the effects we are going to
  bucket into one."** The deity doctrine (alignment-not-domain) applied to disasters: the engine
  models CONSEQUENCE (one severity-banded effect pipeline + the emergent tail), the DM owns CAUSE.
  Geography/season keep loading the dice as generic EXPOSURE (§H stands) but receipts never name
  a disaster type; flavor is cosmetic freetext under the composer law. Known one-time cost: if
  M11b prose says "flood," neutralizing it shifts news goldens once (documented, owner-ruling-
  caused). Counterpart criterion: FORCE_CALAMITY (severity dial + cosmetic flavor) required.
  Unification rides INSIDE W-UPSWING as its first stage (calamity down-stroke / upswing up-stroke,
  one cycle).
- **2026-07-15 (morning) — PIRACY AT EXACT BANDIT PARITY (owner ruling): "treat them the same as
  bandits in embattled regions/roads."** Sea piracy inherits PRECISELY the land embattlement/
  danger inputs — same scoring, same counterplay shape; nothing pirate-specific added or omitted
  (DESIGN_NAVY §5's extra pirate-haven criminal-density coupling is TRIMMED to parity unless land
  bandits already carry the same coupling). RESOLVED same day by the parity recon: parity ALREADY
  HOLDS BY CONSTRUCTION (node-keyed, modality-blind seams; pinned since M8) — behavior change set
  EMPTY; scope = the missing sea-arrival banditry-loss pin + a shared-seam parity guard +
  display-only naming. DESIGN_NAVY §5 amended @ a9f58844.
- **2026-07-15 (morning) — RESOURCE DISCOVERY COMMISSIONED (owner, verbatim: "The following is
  one of my intents to change things dynamically, so design and build!" — un-parking the
  discovery-of-new-resources boundary the architect had flagged):** the world's resource
  endowment becomes DYNAMIC. Design direction (Fable, at commission): the frozen digest is NOT
  mutated and NO version-axis event is needed — discoveries live in a sparse spatialLedgers
  overlay (the armyTransit/embattlement pattern) read through an effective-endowment CHOKEPOINT
  (frozen base + overlay deltas, clamped ≥0); the digest stays byte-frozen and dormancy holds
  (absent ledger ⇒ prior bytes). Conservation: discovery converts a bounded, terrain-weighted
  LATENT pool into accessible endowment (no infinite mines; §H loaded dice — mountains hide ore,
  prospecting effort + scarcity pressure load the draw). THE UNIFICATION LAW applies: the same
  ledger carries both signs — discovery (up) and depletion/exhaustion (down, "the mine runs
  dry"), one lifecycle. Physical manifestation rides the EXISTING institution founding lane (a
  discovery can found the mine/quarry). Counterpart criterion: FORCE_DISCOVERY verb (bounded
  resource-kind + magnitude dials, cosmetic flavor). CRUX RISK (the owner's most-bitten class):
  the endowment CONSUMER CENSUS — every read site must go through the chokepoint or discoveries
  ghost on unswept paths; census-with-denominator recon dispatched at commission. Generation-side
  reads stay frozen-digest-only (law 3: generation never reads tick state). THE PATTERN
  GENERALIZES (named for the future, scoped to discovery now): the overlay-chokepoint is the
  sanctioned way any frozen-digest fact becomes dynamic later (new roads, new ports) — each such
  extension is its own owner commission. Builds as W-DISCOVERY, sequenced with W-UPSWING
  (discovery is a new upswing SOURCE type). OWNER ADDENDUM (same morning, verbatim: "as is the
  complete removal of resources as well!"): the down-stroke is FIRST-CLASS AND UNRESTRICTED —
  any resource, discovered OR canonize-time base endowment, may decline to COMPLETE REMOVAL
  (negative overlay deltas; the chokepoint clamps effective endowment at 0; the frozen digest
  still never mutates). Removal causes: natural exhaustion lifecycle, calamity coupling (the
  bucket can strip a resource), and the DM verb — the counterpart ships BOTH directions
  (FORCE_DISCOVERY + FORCE_DEPLETION with a to-zero magnitude rung). Unification in action:
  removal is a BUST source exactly as discovery is a boom source (B2's severance reads it; the
  town the silver built hollows out when the vein dies). Implementer hazard named at capture:
  zero-resource edge cases — every consumer must tolerate a settlement whose resource list
  goes EMPTY (economy-tier derivation, supply-chain sources, display) — the census flags any
  non-empty assumption. OWNER LIFECYCLE RULINGS (same morning, verbatim): (1) "removal should
  happen after extended periods of depleted state of a nonrenewable resource" — removal is
  never sudden; it is the END STATE of a dwelled lifecycle, and ONLY for NONRENEWABLES. The
  renewable/nonrenewable axis becomes a first-class resource fact: nonrenewables (ore veins,
  quarries, gem seams) run productive → declining → DEPLETED (dwell) → REMOVED after extended
  depletion; RENEWABLES (fisheries, timber, game) deplete under pressure but RECOVER when
  pressure eases — they are never naturally removed (calamity/DM force may still strip them).
  (2) "discovery has to organically be tied to the terrain or forced" — exactly two mint
  paths: ORGANIC (the terrain-weighted latent pool; a draw inconsistent with local geography
  is impossible, not merely rare) or FORCED (the DM verb). No third path; analytics/receipts
  name which path minted every deposit.

- **2026-07-15 (midday) — THE RESIDUALS RULINGS (owner, closing the gap-audit list):**
  (1) DYNAMIC INFRASTRUCTURE STAYS PARKED (owner: "infrastructure i think will only change with
  map-level biome/heightmap changes. I think that is automatic. The other thing is that ports
  and the likes are tied to settlements… I'm inclined to keep it where it is at.") — the
  owner's model is correct: routes/cost fields derive from the heightmap/biome at canonize and
  re-derive automatically on any re-canonize; ports derive from settlement geography +
  institutions. One recorded caveat: BOTH re-derive only on the re-canonize axis (a maritime
  institution founded mid-campaign does not mint sea edges until re-canonize) — accepted, not
  a gap. (2) PILGRIMAGE stays deferred where it is (B4, faith review). (3) SATELLITE
  GRADUATION THRESHOLD RULED (owner: "takes effect when they get to the village level which
  more or less makes them seem self-sufficient") — VILLAGE attainment IS the graduation
  trigger; V1 (no graduation machinery) holds a village-scale satellite in an explicit
  CHARTER-PENDING state (visible, chronicle-noted, deferral-visible) rather than a silent cap;
  the V2 machinery executes pending charters when commissioned. DESIGN_SETTLEMENT_LIFECYCLE
  amended. (4) THE MERCENARY CLAUSE (owner, verbatim: "Mercenary related institutions can help
  strengthen or reinforce a deployed army or military unit, but that is it in terms of the war
  system.") — mercenary institutions are a BOUNDED reinforcement modifier on deployed forces,
  never independent actors, never a new entity class; facet-law compliant (declared
  'mercenary' facet ?? inferred); affordability-scaled; receipted. Lands in W-CONVERGENCE's
  strength-aggregation seam (design amended; addendum threaded to the in-flight build).

- **2026-07-15 (midday) — RE-GRADE SCOPE + THE MERGE/PUSH AUTHORIZATION (owner, verbatim):**
  (1) "For [the PART-9 re-grade]: Limit it to just the dimensions for now. I'll do a full
  review at another time." — the re-grade shrinks to a DIMENSIONS-ONLY scoring pass (the
  dimension sweeps of the original methodology, scored against the finished product; NO
  subsystem-by-subsystem review, NO new fix program minted from it — findings are recorded
  for the owner's later full review). (2) "Then I want you to first master merge and deploy
  to git before the soak." — STANDING AUTHORIZATION, in sequence: when the wave stack
  completes, execute the MASTER MERGE per MASTER_MERGE_PLAN.md (fresh re-survey first,
  gates between steps) and then PUSH TO GIT — both now pre-authorized to run BEFORE the
  soak, which remains the successor's charter. Scope note at capture: this authorizes the
  git push; the remaining owner-batch items (supabase db-push, the covert-leak gallery
  scrub decision, preset-lighting signature, support-email confirmation) are still
  presented as the short decision list at that moment unless separately pre-authorized.

- **2026-07-15 (afternoon) — W-MOMENTUM COMMISSIONED (belief/decision momentum; the owner's
  war-despite-the-drawbacks scenario + two rulings):** beliefs and the decisions stemming from
  them gain MOMENTUM: a COMMITMENT STOCK per actor-and-course, deposited by PUBLIC acts (the
  rumor machinery already knows what is loud); a DYNAMIC RECONSIDERATION THRESHOLD — below it
  reconsideration is safe and cheap, beyond it the actor DOUBLES DOWN (a bounded,
  course-scoped counter-evidence discount — never global belief corruption); reinforcing
  information deepens commitment, countering information accumulates pressure until the
  threshold CRACKS. **THE LIMIT CLAUSE (owner refinement, same day, verbatim intent:
  "momentum should have limits, not that they continue with certainty, but the cliff to
  redirect decisions becomes an order of magnitude harder"):** past the threshold the course
  is NEVER certain — the cliff is a MULTIPLIER on the evidence bar (~10×, soak-tunable),
  never a wall: counter-pressure still accumulates past it (at heavily discounted
  effectiveness), loud events (a lost battle, a cracked coalition, succession) still punch
  through, and the crack remains reachable from every state. WEIGHTS, NEVER WALLS — no
  absorbing states, no designed attractor lock (the anti-stasis constitution applies to
  psychology exactly as to economics) — and the climb-down is a priced, receipted event (legitimacy +
  credibility spent; face-saving off-ramps via the existing peace-term catalog). Thresholds
  are ENTITY-APPROPRIATE (fragile legitimacy doubles down hardest; consolidated autocratic
  courts lack the voices to force reconsideration; coalition blocs can crack it from inside).
  THE UNIFICATION LAW APPLIES: momentum is course-stability physics, both signs — a
  celebrated peace is as hard to abandon as a declared war. OWNER EXTENSION (verbatim): "and
  not just for rulers but for all entities that use beliefs to make decisions. but at the NPC
  level, this threshold has to correlate with temperment and flaws appropriately." — the
  momentum law binds EVERY belief-consuming decision seam (settlement strategy, blocs/
  coalitions, faction courses), and at the NPC grain the threshold DERIVES from the person's
  generated temperament + flaws (proud/wrathful ⇒ high double-down threshold; humble/
  pragmatic ⇒ cheap reconsideration), under §G law: NPCs modulate their bloc's/settlement's
  momentum and their own modulator streams — never engine-resolved fates. Facet law: custom
  NPCs declare temperament facets and COUNT. Emergent consequence noted at capture:
  succession changes the crown's temperament ⇒ course momentum shifts on succession — the
  new-ruler peace falls out for free. Counterpart: FORCE_RECONSIDERATION. PLACEMENT: the
  true final engine wave, after W-LIFECYCLE, before the W-COMPOSER-2 lift. Design freezes on
  the momentum recon's return.

- **2026-07-15 (afternoon) — THE FINAL SCOPE CLOSE (owner, verbatim: "I think this is my last
  addition to the simulation (completing the underlying psychology of everything) before the
  soak/tuning."):** W-MOMENTUM is the LAST simulation addition. The design corpus is closed
  for the third and FINAL time — this close differs from the prior two in kind: every
  residual has been individually adjudicated (built / building / queued / parked-with-
  rationale / consciously-rejected), the psychology layer completes the belief→decision→
  consequence chain, and the owner has named it terminal. From here: EXECUTION ONLY down the
  fixed sequence (navy+discovery merges → lifecycle → momentum → guide-2 → composer-2 lift →
  SM-4 → Surveyor S1-S7 → dimensions-only re-grade → master merge + git push (both
  pre-authorized) → the owner decision list → the successor's soak). New simulation scope
  after this line requires the owner to explicitly reopen — and the reopening should be
  noted as post-soak material by default.

- **2026-07-15 (afternoon) — THE MERGE MOVES UP (owner, verbatim: "I want you to merge
  everything after SM-4 then continue with 7 to the rest"):** the MASTER MERGE executes
  immediately after SM-4 completes — BEFORE the Surveyor build — then the sequence continues:
  Surveyor S1–S7 → dimensions-only re-grade → lighting batch (owner-signed) → the owner
  decision list → the successor's soak. PUSH RULING (owner, same day, verbatim: "git push as
  well and do it by pull request when the time comes"): the PUSH COUPLES TO THE MERGE — at
  the post-SM-4 merge point, execute the master merge locally per MASTER_MERGE_PLAN.md,
  PUSH the reconciliation branch, and OPEN A PULL REQUEST (gh CLI) carrying the full
  step-by-step reconciliation summary, the gate receipts, and the deferral/decision ledger.
  Architect's reading (vetoable): the PR's merge button is the owner's — the PR is the
  review surface for the highest-risk step of the program; say the word to pre-authorize
  merging it too. CONSEQUENCE OF
  RECORD: every post-merge wave (Surveyor, re-grade) builds on the UNIFIED lineage — the
  dual-lineage era ends at the merge, and the wrong-lineage worktree trap class dies with
  it. MASTER_MERGE_PLAN.md's fresh re-survey therefore covers the tree as of SM-4
  completion (engine + surfaces + composer lift all in), and the Surveyor lands on prod
  truth rather than being ported through a later reconciliation.

- **2026-07-15 (evening) — THE MERGE MOVES UP AGAIN (owner, verbatim: "okay, move merge and
  deploy up up to after both of those land and before SM-2" — "both of those" = the in-flight
  W-COMPOSER-2 + FP-G7; architect's reading, vetoable: "SM-2" = SM-4, the only remaining map
  wave):** the MASTER MERGE + PUSH-BY-PR execute IMMEDIATELY after the composer-lift window
  closes green — BEFORE SM-4/GUIDE-2b. Final sequence: W-COMPOSER-2 + FP-G7 merge + window
  close → fresh re-survey → MASTER MERGE per MASTER_MERGE_PLAN.md (gates between steps) →
  push the reconciliation branch → OPEN THE PULL REQUEST (full reconciliation dossier; the
  merge button stays the owner's per the standing vetoable reading) → SM-4 + GUIDE-2b +
  Surveyor S1–S7 + the dimensions-only re-grade ALL build post-merge on the UNIFIED lineage
  → lighting batch (owner-signed) → the owner decision list → the successor's soak. The
  dual-lineage era now ends one window sooner.

## Owner-parked aspiration (recorded 2026-07-14 — do NOT build without a fresh owner directive)
- **THE LIVING SETTLEMENT MAP**: a settlement-layer map procedurally DETERMINED BY the dossier and
  EVOLVING WITH it — the "map as first-class engine surface" thesis one level down from the realm
  map (a calamity's ruined quarter, a boom's new district, reconstruction visibly raising beams).
  Owner: "the last thing that I would want to build (but I'm telling you not to for right now)…
  that would be the last thing if usage of Fable is enough." Sequenced BEHIND: the fix program →
  upswing/relationship flows → Surveyor stages. The end-goal framing, verbatim intent: "be good at
  everything, excel at the most important, and take over from all my other competitors."
- **SETTLEMENT BIRTH & DEATH — THE SATELLITE-THORP DESIGN — ⚡ UN-PARKED SAME DAY (owner,
  verbatim: "design it and place it where appropriate to be built!") → DESIGN_SETTLEMENT_LIFECYCLE.md
  FROZEN; builds as W-LIFECYCLE, last in the engine lane (after W-DISCOVERY, before
  W-COMPOSER-2), inside the soak's certification scope. Resettlement commissioned with it.
  Only the V2 graduation seam (satellite → first-class digest member) remains parked.
  (Original park record kept below for provenance; design captured 2026-07-15, owner's
  thoughts verbatim-intent):** birth and death both happen
  at the tier ladder's bottom rung — "Birth and death (aligning with our promotion and demotion
  of settlements) start and end at the same level, thorp/thorpes." Any significant settlement
  (town or higher — threshold delegated to the architect, recommendation: town+) "will naturally
  begin to produce satellite thorpes surrounding it. These come with potentially new resources
  and dynamics!" Thorps are single-family dwellings, "extremely precarious without economic
  backing and physical support and in-flow of people moving in (conservation!)" — they either
  quickly grow (thorp → hamlet → village) or "quickly die and be destroyed forever";
  alternatively "many in close proximity can converge into a hamlet." ARCHITECT'S ASSESSMENT AT
  CAPTURE (Fable, agreed by owner to park): the design collapses the build's weight class —
  satellites orbit a PARENT (position = within the parent's territory; routing = via-parent +
  a fixed local hop), so V1 needs NO digest membership, NO re-canonize, NO version-axis event:
  a `satellites` conditional ledger keyed by parent, lightweight sub-settlement tick (birth /
  growth / death / convergence + resource contribution), NOT full pulse members (cap study
  intact). Conservation native: seeded by parent population outflow (the migration ledger
  conserves), starved without in-flow. The W-DISCOVERY coupling is the natural birth trigger
  (a resource strike spawns the mining camp). Death leaves a RUIN (history beat + map marker,
  not a live entity); people conserved (migration out), only the entity dies. NPCs: none until
  hamlet (names begin where community begins). THE ONE V2 SEAM: graduation past
  village-in-orbit to first-class digest membership IS the version-axis event — V1 caps
  satellites in-orbit; graduation is its own later commission. OWNER REFINEMENT (2026-07-15,
  verbatim): "cities or higher that have declined to the point where they are a thorpe and
  perished are the only things eligible to become relic ruins" — THE RELIC-RUIN SCARCITY LAW:
  a dead satellite thorp leaves at most a minor trace (an abandoned-steading history note); a
  RELIC RUIN is EARNED by a full civilizational arc (peak tier ≥ city → the long decline to
  thorp → death). Mechanical note at capture: requires a monotone `peakTier` stamp (one cheap
  field); under the sub-century horizon the endogenous path is near-impossible inside one
  campaign (a full city→thorp→death arc outlasts 30 years) — so relic ruins are naturally
  GENERATION-SEEDED ancient features first (matching the fiction: ruins are old), with the
  engine lifecycle as the rare live path in long soaks. Architect's offered twin (undecided,
  owner's call at re-commission): RESETTLEMENT — a relic ruin as a privileged birth site (a
  new thorp on ancient foundations), giving ruins a future as well as a past. DO NOT BUILD
  until the soak completes and the owner re-commissions.

## Phase plan (checkboxes are the resume pointer)
- [x] **Phase S — SURVEY** (Fable): 20/28 landed (208 findings); 8 limit-killed slices
      re-dispatched via resume of `wf_c21bb055-cb9`; their reports append to the register on landing.
- [x] **Phase A — ASSESSMENT** (Fable main loop): committed as
      `docs/COMPREHENSIVE_REVIEW_2026-07-13.md` (holistic assessment + 208-finding register).
- [x] **Phase V — VERIFY**: 150 findings verified (~14.4M Opus tokens): 112 CONFIRMED, 18 PARTIAL,
      5 REFUTED, 4 adjudicated, 11 manager-verified, 2 dispositioned. Verdicts in the review doc.
- [x] **Phase P — WAVE PLAN** (Fable architect, 2026-07-14). TWO TRACKS, forced by the verified
      blast radii (50 confirmed fixes legitimately shift same-seed goldens):

      **TRACK N — no golden shift; lands directly on review-fixes-2026-07-08; full gate + byte-identical
      goldens per wave:**
      - **F1 LIFECYCLE-TRUST** (first — the paying DM's state integrity): store-1/state-lifecycle-1
        (persist the M10b cursor after advance), worldpulse-core-1 (pause-window mutation guards +
        panel gating), store-2 (advance guards for queueSettlementEvent/regional), state-lifecycle-2
        (revertToSnapshot re-derives systemState + persists campaignState), state-lifecycle-3 +
        store-5 + components-dossier-5 (ONE resetSettlementIdentity chokepoint), state-lifecycle-4
        (regenSection persists + respects locks), store-6 (persist version/migrate), store-3
        (requestDailyLife sync-prefix), store-4 (gallery cultDeitySnapshots strip). Fence: store/**
        + guard-reads. New pins: persisted-surface round-trips (the class the in-memory tests miss).
      - **F2 CLIENT-SEAM INTENT** (user intent never silently drops; client-only): components-dossier-1
        (MapOverlay prop contract), components-commerce-2 (shareMap sends all 12 params), lib-infra-1
        (exportThumb — implement or fail-visible), components-commerce-5 (BuyThisDossier signed-in rung).
      - **F3 SURFACES/LEGIBILITY** (lazy display, byte-inert — the engine reaches the eye):
        content-immersion-1 (rumor what-token vocabulary + register-guard pin), content-immersion-2
        (crier: pestilence/calamity/migration categories), content-immersion-5 (news-card diegetic
        register), domain-readmodels-1/2/3 (chronicle id poisoning, publicSafe note fix, pillar
        leadership), domain-readmodels-4 (pestilence read-model sibling), experience-product-fit-1
        (catch-up trigger widened to every campaign-open path + while-you-were-away digest),
        experience-product-fit-2 (belief UI: the divergence band on the war/status read, DM-gated),
        experience-product-fit-3 (mount RegionWakeReplay), components-dossier-2 (World-Laws dialog
        truth), components-dossier-4 (catch-up visibility + failure surface), components-dossier-7/8
        (advancing indicator; causal-diff supplier), pdf-1-narrowed (rumors/beliefs/flow-drift into
        campaign_state variant via the whitelist seam + parity-audit lane), pdf-2/3/4/5, lib-infra-7
        (campaign PDF live-world), spatial legibility trio (calamity stamps, umbilical fog note,
        temple pulse) via the newsVoice/inspector pattern.
      - **F4 COMMERCE-TRUST**: derived tier-facts module + the OWNER-RULED $2.99 gate flip (free =
        per-dossier entitlement via the existing single-dossier ladder; premium unlimited) + all six
        surfaces aligned (components-commerce-1/3), backend-1 (anon checkout rate limiter, the
        house fail-closed pattern), backend-3 (pg_temp pin restore + migration-lint walker),
        code-quality-1 (entity-ref: port master's renderer trio 6d95adc7 + producer⇒consumer
        contract test). OWNER-ASK: founder cap truth (30 vs 500) before the FounderTile fix.
      - **F5 PERF YEAR-TWO** (pending straggler verdicts): freeze+share conditional ledgers (kill the
        11×/tick digest deep-clone), queuedImpacts prune, digest identity stability (restore
        distanceRead memos), catch-up through the interval orchestrator (one commit, not 26),
        pulseRecord rollExplanations cap, applyWorldPulse serialization diet, tick-cost trend gate.
      - **F6 GATE-HONESTY**: VERIFY_DIST hard-fail (port the master-lineage guard), self-minting
        golden fix, pglite existence asserts, check-domain-strict sentinel, workers purity lint,
        pipeline.property house timeout, M10b living-mode + WorldPulsePanel trigger tests,
        cross-family mover-composition smoke, sf-bridge test harness, config-seam contract walker,
        metronome-cooldown lint, stress-type registration manifest.
      - **F7 CODE-HEALTH**: kernel clamp01 primitive + adoption (byte-proof per module), slugify
        unification behind identity-preserving tests, curated barrels, domain size ratchet
        (grandfathered), dead-code removal (OWNER-ASK: deletion list), orphan read-model
        disposition (mount-or-delete list to owner).

      **TRACK G — golden-shifting; implemented on child branch `claude/review-fix-golden-track` off
      review-fixes; ONE batched owner-signed UPDATE_GOLDEN regen at the end, then merge:**
      - **G1 THE WORLD OBEYS ITS OWN DECISIONS** (the substance crown): worldpulse-war-2 (faction
        proposals apply for real), war-3 (sue-for-peace grips the physical war — one peace ends both
        representations), war-4 (recall executes + de-dup), war-5 (M9a levers act), war-6 (pacific
        reactions get payloads), war-8 (defenders bank wins), war-9 (occupation constrains the
        occupied), war-1 (posture≠engagement rust fix), war-7 (deployment lifecycle on removed
        settlements), spatial-engine-3 (retreat lives), spatial-engine-4 (umbilical read),
        spatial-engine-2 (plague couplings per the M11a SPEC: army hazard/contraction/vector, route
        hazard, trade refusal, temple pulse), spatial-engine-5/6, worldpulse-core-2 (remove_npc real
        via the ouster path), worldpulse-core-3/4/6, religion-trade-1 (+peacelike key) /2/3/4/5/8,
        domain-events-region-1 (DM relationship events reach the conflict layer via the existing
        party-impact kinds), -2 (REMOVED_THREAT suppression record), -3 (PLAGUE mints its twin),
        -4/-5/-6/-9, region recovery propagation (-7).
      - **G2 GENERATION COHERENCE**: generators-pipeline-1/2/3/6/7 (byte-proof first — corpus may
        not exercise the broken paths; any that prove byte-identical fold back to Track N),
        generators-domain-1..7 (stress-type integration, placeholder NPC dedup, section-regen
        enrichment, dual food model, magic-agri sentinel, timeline variety, faction category),
        domain-top-1 (role-assign preserves the sheet), domain-top-3 (institution→faction links),
        data-tables-1/2/3/5/6 (id-first joins for services/terrain/chains + naming decontamination
        [content-immersion-4] + catalog batch-run corrections), pdf-6.
      - **G3 SUBSTANCE COUNTERPARTS (spec-first, OWNER-ASK before build):** relationship-driven
        material flows — relief caravans (M2 shipment + relationship-gated dispatch, no toll), ally
        credit (bounded prosperity transfer on the conquestProsperity fold), trade-as-diplomacy;
        upswing drama arcs (reconstruction boom after calamity clear). New capability, not repair —
        needs the owner nod; peace-with-terms stays Wave-8 backlog with a design note.

      **THE OWNER-ASK BATCH** (one message when Track G is implemented + evidenced): (1) UPDATE_GOLDEN
      sign-off with the per-fix shift evidence; (2) preset lights — disastersEnabled (+20B, fits),
      dramatic_campaign depth, commodityFlow posture, infoMode defaults; (3) founder cap truth 30 vs
      500; (4) G3 new-capability nod; (5) political-autonomy ruling (post-apply movers under dm_only);
      (6) dead-code deletion list; (7) lifecycle-email activation.

      Sequencing: F1 → F2+F3 (disjoint fences, parallel implementers) → F4 → F6 → F5 → F7 on the main
      branch, with G1/G2 building concurrently on the child branch once F-waves are underway. Every
      wave: Opus implementers (model:'opus'), fenced, work left unstaged → Fable §0.3 review (independent
      gate re-run, sensitive-diff reads, constitution check) → exact-stage commit → ledger row +
      Progress line. Full gate per wave; goldens byte-identical on Track N; Track G proves its shifts
      are exactly the intended semantic changes (before/after diff of the shifted fixture fields).
- [x] **Phase F — FIX WAVES**: COMPLETE 2026-07-14. Main: W-DOCS-1, F1+trim, F2, F3a/b, F4, F5,
      F5b, F6+amendment, F7, Lane-2, GATE-FIX (final gate 8,572/8,572 green). Golden: G1a-d, G2,
      G2R + harness + census (implementation complete; regen awaits the owner). ~110 verified
      findings closed; ~390 new pins across both branches; every wave §0.3-reviewed and ledgered.
- [x] **Phase E — END**: final full gate GREEN @ 4de2f8db; ledger rows current; memory updated;
      the final report delivered 2026-07-14. REMAINING = the owner batch, then the golden merge.

## OVERNIGHT DELEGATION (2026-07-14, owner: "continue with all of this work independently making
## your own judgement calls. I'll return in the morning.")
Autonomous execution of the master sequence under the standing constitution. Judgment calls are
made and recorded vetoably (JUDGMENT entries in commit messages + Progress lines). REMAINS
OWNER-GATED OVERNIGHT regardless of delegation: the UPDATE_GOLDEN regen (Track G implements and
evidences, does NOT regen), preset lights, any push/deploy, migrations/schema shape, data
deletion, paid-surface changes beyond the already-ruled $2.99 flip. THE MORNING QUEUE for the
owner: golden sign-off (if Track G is evidenced by then), preset lights, autonomy ruling,
deletion list, emails, deploy, CSP flip. Session-window cuts are expected (~5-hour cadence);
recovery = the resume protocol above; every wave banks before the next dispatches.

## IN-FLIGHT (overnight 2026-07-14 — for a successor finding unstaged work)
- MAIN TREE: ✅ **F1+trim COMMITTED** (see Progress). F2 dispatching next.
- GOLDEN WORKTREE (/Users/cstokes/Desktop/settlement-engine-golden @ claude/review-fix-golden-track):
  ✅ **G1a COMMITTED @ 7e1886dd** — 5 fixes, 16 pins, ZERO goldens shifted (ledgered why), any-cast
  burned +31→+0 (2252 exact, no re-baseline), independent battery 21 files/108 green. G1b (war
  mechanics: posture≠engagement rust fix, retreat lives, umbilical read, defenders bank wins,
  occupation constrains, removed-settlement deployment lifecycle) DISPATCHED on top.
  MAIN TREE: ✅ **F2 SHIPPED @ e99e69f9** (4 seams, negative-controlled pins, bridge-surface walker).
  **F3 surfaces/legibility RUNNING** (17 items, stop-and-report licensed). Follow-up chip spawned:
  mapThumb overlay-svg attribute.
  GOLDEN: ✅ G1b @ 0b499818 · ✅ **G1c @ 9bdfa8fa** (16 fixes, 27 pins — REMOVED_THREAT stays dead
  through regen, PLAGUE mints its twin, remove_npc real, DM-visible expiry, temper read + peacelike
  key + scan guard, aggressor-keyed disposition, depleted exports recover, belief-prune fog fix,
  calamity dedup; golden FIXTURES still byte-identical — only 2 behavior pins updated+ledgered;
  3 verdict-backed deferrals: bornTick→owner regen batch, M11a autonomy→owner note, stance-half→
  formalized deferral). **G1d RUNNING** (the 4 new-lane couplings: DM relationship events→conflict
  layer, relief propagation, re-emitter cooldowns, pantheon tier→conversion). MAIN: ✅ **F3a @
  0e56baa5** (9 items: rumor/crier/newsBody fiction, settlementPestilence read-model, truthful
  World-Laws axes; publicSafe note = coupled client+SQL, deferred-with-proof to owner batch).
  **F3b RUNNING** (catch-up lift+digest, causal supplier, belief UI, RegionWakeReplay, PDF group).
> - 2026-07-14 ~02:00: **F1 LIFECYCLE-TRUST SHIPPED** (9 fixes, 24 pins) — with the ratchet story
>   the constitution wrote itself: the wave was HELD at +805B over budget, the §0.8-1 trim landed
>   in-wave (catch-up body lazified + pulseFingerprint off first paint), closure now **1,251,094**
>   (4,891B margin — funds W5+W2 comfortably; ratchet-down queued for the owner batch). JUDGMENT:
>   trim folded into F1 rather than reverting eager fixes — veto to flip. Gates: suite 8,372/8,372;
>   independent re-run 361/361 + verify:dist 108/108; goldens byte-identical; any-cast 2252.

## OVERNIGHT SCOREBOARD (2026-07-14, rolling)
SHIPPED: F1 @ 75cdf8b1 · F2 @ e99e69f9 · F3a @ 0e56baa5 · F3b @ b25d3c1a (F3 COMPLETE) ·
F4 @ 433641f8 (commerce-trust: $2.99 flip w/ the ungated-path catch, tierFacts, founder=30,
entity-token leak dead via §6 degrade path — full link-layer port re-scoped to master merge) on
main; G1a @ 7e1886dd · G1b @ 0b499818 · G1c @ 9bdfa8fa · G1d @ f5fbc41f (G1 COMPLETE) ·
**G2 @ ec69513e** (18 coherence fixes; THE SHIFT MAP complete: 134/~190 configs attributed per-fix,
manifest reverted; ⚠️ owner-veto flag on the data-tables-6 governance edit) on golden.
~62 fixes, ~145 pins. Constitution: golden fixtures byte-identical everywhere EXCEPT the one
ledgered, isolation-confirmed G1d red (faith-pact metronome, sp-a|4|one_week, faith_pact_formed
8→2) — the owner sign-off evidence; any-cast 2252 exact throughout; closure 1,251,487 (margin
4,498). ALSO SHIPPED (late night): F5 @ da5a1dee (perf: 20x route cost, freeze+share, growth bounded,
tick-cost gate; #4 catch-up-orchestrator STOP — owner fork; stash INCIDENT recovered+ledgered) ·
F6 @ 1977f27f (gate honesty: VERIFY_DIST hard-fail, blind-harness fix, fail-not-skip suites,
self-mint ends, workers purity, living-mode pins, mover-composition smoke, sf-bridge harness,
2 structural walkers) + F6-amendment @ 65e79547 (harness fix moved to golden — Track N always-
green) · F7 @ 9b9f7a28 (kernel clamp/slugify + parity proofs, curated barrels, domain size
ratchet, DEAD_CODE_DISPOSITION.md — no deletions, autonomy ruling doc; any-cast RATCHETED DOWN
2252→2248) · F5b @ fcdc319e (deepFreeze isDraft guard — the Immer regression F7 caught, dead) ·
G2R @ daa0988d + harness adoption @ 868eb560 (**GOLDEN TRACK IMPLEMENTATION COMPLETE**: resolver
on real seats, food models cannot disagree, timelines deepen, 5 stress types whole + registration
walker; cumulative shift 187/187 mapped). ✅ Lane-2 @ 9dd8d0cb (DM non-party
verbs land + survive the tick + undo honestly; refuter round closed 1 CONFIRMED pre-commit) ·
✅ GATE-FIX @ 4de2f8db (the final gate's 2 reds: house deepClone; the LIVING flake root-caused to
a FIXTURE wall-clock stamp — product path proven clean).
> **THE FINAL FULL GATE IS GREEN: 8,572/8,572 (763 files) + verify:dist 109/109, exit 0, clean
> tree @ 4de2f8db (2026-07-14).** Baseline was 8,348 → +224 net pins on main; the golden branch
> (9 commits, its own 8,511/8,517 with the six enumerated regen surfaces) awaits the owner batch.
> Closure 1,254,716 ≤ 1,255,985; any-cast 2248 (ratcheted DOWN from 2252).
> **IMPLEMENTATION PHASE COMPLETE — the program now waits ONLY on the owner batch** (golden
> sign-off → regen → merge; preset lights; the catch-up fork; vetoes; dockets). After the merge:
> regen the edge bundle (build:edge-shared), then the master sequence resumes (W5/W2/telemetry →
> expansions).
>
> **OWNER BATCH EXECUTED (2026-07-14, owner-authorized in chat):** ✅ W5 reconciled cherry-pick ·
> ✅ W2 re-dispatch (feed retention, injection-echo incident survived) · ✅ docket migrations 130+131
> WRITTEN (deploy stays the owner's `db push`) · ✅ PRESETS LIT per ruling (28c9482a-family; two pins
> updated) · ✅ THE ONE REGEN: all six surfaces, generator manifest 187/187 — exactly the shift map's
> prediction · ✅ GOLDEN MERGED HOME @ 6d3e5ca2 · ✅ FP-G1 reclaim (the merge-gate red proven
> pre-existing G-track dist debt; stressorsCore leaf split −51,655B → closure 1,216,273) ·
> ✅ **UNIFIED FINAL GATE: 8,785/8,785 (792 files) + verify:dist 109/109, exit 0** ·
> ✅ BUDGET RATCHET-DOWN 1,255,985 → 1,216,350 @ d33c8ff8 (§0.2-5 monotone; history in the const).
> REMAINING FROM THE BATCH: catch-up collapse wave (Opus dispatched, in flight) · dead-code
> deletion wave (per DEAD_CODE_DISPOSITION.md ruling) · then the master sequence (A-wave telemetry
> merge → numeric prices → Track K → E0/E1 → Surveyor).
QUEUED AFTER: Lane-2 store ripple (G1d stop-report) · F5 perf · F6 gate-honesty · F7 code-health ·
then the G-track merge decision + owner batch. Deferral ledger grows in the wave rows (publicSafe
note, bornTick, M11a autonomy, stance-half, belief truthOf divergence join).

## THE MASTER SEQUENCE (consolidated 2026-07-14 — fixes → owed work → expansions → endgame)
RUNNING: F1 (main tree) + G1a (golden worktree). THEN: F2→F3→F4→F5 (delivers the §0.8-1 M10b
trim)→F6→F7 on review-fixes; G1b→G1c→G2→shift-ledger→OWNER GOLDEN SIGN-OFF→regen→merge on the
golden branch. OWED WORK: W5 cherry-pick + ratchet-down (post-F5 headroom) → W2 feed retention →
usage-telemetry merge (owner) → numeric prices + wallClockNow cleanup → TRACK K COMPLETION (the
bridge: owed work AND Surveyor's foundation). EXPANSIONS (owner-sequenced after fixes), TWO
PARALLEL LANES after the owed work: ENGINE LANE — E0 pacing governor → E1 generosity engine
(relief→credit→reconstruction→boom/bust→purchase→overture→flourishing) → W-PEACE (~3 waves) →
W-DOCTRINE (+DESIGN_INFORMATION_STATECRAFT verbs/credibility — frozen 2026-07-14; named-tie hooks per DESIGN_COHESION_WEAVE §G ship piecewise inside E1/W-PEACE/W-DOCTRINE) ∥ DISPLAY LANE — SM-1→SM-3 THE SETTLEMENT MAP (owner-commissioned 2026-07-14, design
frozen: DESIGN_SETTLEMENT_MAP.md — library-only [Dossier|Map] toggle, deterministic dossier
projection, hover=institution, cosmetic edits in settlement.mapEdits; pre-build gates: world-pulse
blob-preservation trace + chunk-mint budget measurement). Both lanes before E2 Surveyor
(Track-K→analyst→briefs→session-interpretation→custom content→settlement→realm→autonomy;
tier/credits/BYOK alongside stages 1-2). SM-4 (PDF plate, card thumb, gallery opt-in) with endgame
polish. PARKED LAST (owner, standing): the DEEP living map — persistent scarring history.
ENDGAME: final gate + PART-9 re-grade → master merge (entity-ref + migration-renumbering hazards
pre-mapped) → owner push/deploy + migration chain → checkpoint soaks/tuning (next AI) → launch.
Owner-ask batch: golden sign-off, preset lights, autonomy ruling, deletion list, emails, deploy,
CSP flip. Resolved: $2.99/PDF, founder=30, G3 approved, sequencing, settlement-map V1 un-parked.

## Resume protocol (for a successor session — START HERE)
1. `git status` + `git log --oneline -15` — trust the tree, not any digest. Foreign WIP is preserved,
   never touched.
2. Read playbook §0.0 (state ledger) + this doc's Progress blockquote + phase checkboxes.
3. If `docs/COMPREHENSIVE_REVIEW_2026-07-13.md` EXISTS and is committed: the survey is banked —
   resume at the first unchecked phase using its findings register (each finding has id/severity/
   file/evidence/verdict columns; unfixed = no wave row yet).
4. If it does NOT exist: the survey died in flight. Check the workflow journal (Artifacts below) for
   partial agent reports — salvage what parsed, re-dispatch only the missing slices (the slice list
   is in the workflow script, same path). Do not re-run completed slices blind.
5. Baseline gate truth: the pre-program `npm run check` result is recorded in the Progress
   blockquote once known. Any red found there is PRE-EXISTING (verify against base before blaming a
   wave). Known env flake: `pipeline.property` seed-sensitivity can time out at 20s under machine
   load (documented in round-21 plan, confirmed on untouched base).
6. Model split (owner standing): Fable = survey/architecture/management/checking; Opus 4.8
   (`model:'opus'`) = EVERY verifier + implementer agent. If the session model is Opus, run Phase
   V/P/F mechanically per this doc + playbook §0.3; queue re-grades for Fable.
7. Deferral ledgers (do NOT re-find as bugs): playbook §0.0.2 + §0.6 + §0.8; round-21 plan
   (Progress/Deferred/owner-decision queue); the review doc's own deferral section once written.

## Artifacts (this machine, session-scoped paths — informational, not required for resume)
- Survey workflow run `wf_c21bb055-cb9`; journal:
  `~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/049d4c82-58c0-4be1-956a-d47c628ee704/subagents/workflows/wf_c21bb055-cb9/journal.jsonl`
- Baseline gate log:
  `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/049d4c82-58c0-4be1-956a-d47c628ee704/scratchpad/baseline-gate.log`
- Memory pointer: `memory/comprehensive-review-fix-program.md` in the Claude memory dir mirrors this
  doc's state at each milestone (in-repo doc is authoritative).

---

# ROUND 2 (opened 2026-07-15 late eve — the owner's second full-review commission)

## OWNER RULING (2026-07-16, verbatim: "feel free to preset lighting.") — THE WAVE-LIGHTING
## RULING, delegated to the architect. The decided lighting (JUDGMENT, each line vetoable):
- **ALL NINE dark wave gates light in the three world-alive presets** — `dramatic_campaign`,
  `living_realm`, `full_simulation` each gain: momentumEnabled, navalEnabled,
  interventionEnabled, settlementLifecycleEnabled, peaceEngineEnabled, supplyWebWarfareEnabled,
  upswingArcsEnabled, resourceDynamicsEnabled, constructiveFlowsEnabled. Rationale:
  full_simulation is everything-on by name (the composition smoke + checkpoint soak then cover
  the full stack automatically); dramatic_campaign follows the 2026-07-14 "gains real depth"
  precedent and the owner's registered boom_flourishing drama class; living_realm's distinction
  is approval posture, not engine depth — a "living realm" without the living-engine waves
  would lie. JUDGMENT: full parity across the three rather than a graduated ladder — say
  "veto" per preset/flag to prune.
- **quiet_local / static_campaign / narrative_campaign: UNCHANGED.** commodityFlowEnabled
  stays opt-in everywhere (standing owner ruling, untouched). Existing campaigns unchanged
  (stored rules; virtual flags absent ⇒ prior bytes); re-applying a preset mid-campaign rides
  the existing receipted rules-change flow.
- **UI**: SimulationRulesDialog gains an Engine Waves section exposing the nine toggles
  individually; realmManifest refusal prose updated to name the preset + the dialog path
  (closing sim-cohesion-4's misleading-prose half).
- **SEQUENCING (architect, vetoable)**: implemented POST-MERGE as wave **W-R2-LIGHT**, strictly
  AFTER W-R2-SEAMS — the newly-lit engine must not expose the known composition bugs (upswing
  same-tick clobber, naval never-retire, remnant non-skip, blockade-blind peace) as the DM's
  first experience. NOT implemented on RF mid-merge: MASTER_MERGE_PLAN §4.3 uses byte-identical
  goldens as its Stage-1 resolution arbiter — moving goldens under the in-flight merge would
  sabotage the merge session's verification instrument.
- **Golden protocol**: predict-the-shift-first, then the regen with the full shift map;
  preset-stability/identity pins updated in the same commit; shifts documented as
  owner-ruling-caused (this ruling). §6 owner-urgent item (4) is RESOLVED by this ruling.

The owner re-issued the comprehensive-review directive verbatim (review the ENTIRE code, holistic
thoughts, then Opus-4.8-ultracode fixes for every finding, Fable architect/manager/checker,
bold-over-safe escalation). Round 1's "I'll do a full review at another time" ruling — this is
that time. The codebase under review has grown by the full post-close wave stack since round 1:
E1a–d generosity, W-PEACE ×3, W-DOCTRINE ×4, W-CONVERGENCE, W-UPSWING, W-DISCOVERY, W-LIFECYCLE,
W-MOMENTUM, W-NAVY, W-GUIDE-1/2, W-COMPOSER-1/2 (the realm lift) — "THE ENGINE IS COMPLETE"
@ 52cc0240.

> **Progress — ROUND 2** (append after every phase/wave)
> - 2026-07-15 ~22:50: Round 2 OPENED on `review-fixes-2026-07-08` @ 91a0c409 (clean main tree).
>   ⚠️ CONTEXT: the MASTER MERGE is IN FLIGHT in a parallel session — `claude/master-merge-r1`
>   worktree already carries W1 (merge commit, 568 conflicts resolved) + W2 (fence sweep) +
>   W3a (behavior ports) @ c89a5372 with live uncommitted WIP (file mtimes minutes old).
>   SEQUENCING JUDGMENT (vetoable): Phase S/A/V run READ-ONLY against the RF tip NOW (no
>   collision; RF-wins is the merge default so ~all substance survives); Phase F fix waves land
>   AFTER the master merge completes, on the unified lineage — landing them on RF mid-merge would
>   strand them behind the merge cut. NO baseline gate run at open (deliberate deviation from
>   round-1 protocol: the merge session owns the machine's gate capacity; survey is read-only and
>   needs no gate truth; Phase F re-baselines on its actual landing lineage).
>   Phase S DISPATCHED: workflow `wf_d69567dc-f0d` — 33 Fable agents (22 subsystem readers +
>   11 dimension reviewers incl. two new dimensions round 1 lacked: sim-cohesion-counterparts
>   across the 15-wave stack, and ambition-fit vs the vision docs). Briefs carry: constitution
>   §0.2, product boundaries, deferral-ledger awareness (playbook §0.0.2/§0.6/§0.8, round-1
>   register, DEAD_CODE_DISPOSITION, in-file seams), read-only discipline (no test/build runs —
>   the merge session shares the machine), NUL-grep hazard, injection-refusal preamble.
> - 2026-07-16 ~00:10: **Phase S LANDED 23/33** (8.7M survey tokens, 1,915 tool uses, ~64 min):
>   ALL 22 subsystem readers + dim:determinism-constitution returned — the full tree is READ.
>   **191 findings: 0 critical / 14 high / 68 medium / 109 low; 169 confirmed / 22 plausible.**
>   Grades: A (spatial-engine, lib-infra-copy, backend-functions, scripts-build-ci,
>   tests-estate), A- (most), B+ (components-shell-commerce, data-tables). The 10 OTHER
>   dimension reviewers died on the session limit (resets 3:30am ET) — re-dispatch them
>   post-reset from docs/briefs/REVIEW_R2_SURVEY_WORKFLOW.workflow.txt pruned to the missing
>   list (recorded in RAW_SURVEY_RESULTS.json .result.missingSlices). RAW RESULTS BANKED
>   @ 3cc2dfbe as docs/review-r2/RAW_SURVEY_RESULTS.json (.result holds the data — never
>   re-survey the 23 landed slices). Phase A synthesis begins on the landed 23; the register
>   doc marks the 10 pending dimensions explicitly.

## OWNER COMMISSION (2026-07-16, verbatim: "for the three abstractions, implement them" +
## "regarding the hunt: I like number one" + the long-lived-races consideration on number two)
THE CORPUS REOPENS (fourth reopening) for exactly five designs, FROZEN 2026-07-16 as
**docs/DESIGN_SIM_DEPTH_R2.md**, closing again behind them: D1 distance-priced news (refines
the perfect_delayed infoMode seam; virtual flag; hop-delay off the frozen digest), D2 tempo
scaling (sublinear realm-size budget + quiet-time §H starvation weighting), D3 doctrine courses
(momentum's missing religion binding; FORCE_RECONSIDERATION generalizes — no new verbs), D4 the
hegemony read + fear_of_dominance reason (the balance-of-power gap — §F.3b's read built + the
Blainey term; balances-never-bandwagons v1), D5 lifespan-scaled memory (the cohort clock made
fantasy-true via the facet law: fleeting/generational/long/undying bands; default byte-identical;
NPCs untouched — state-never-fate stands; JUDGMENT: built-with-the-wave, vetoable). Builds as
**W-R2-DEPTH**, post-merge, after W-R2-SEAMS + W-R2-LIGHT. All five consume existing machinery;
expected eager ≈ two key literals against the 85 B margin (measure-first law applies).

## Phase plan — ROUND 2 (checkboxes are the resume pointer)
- [x] **Phase S — SURVEY: COMPLETE 33/33** (2026-07-16 ~00:45; 11.1M total survey tokens).
      Full-fleet census: **269 findings — 0C / 22H / 99M / 148L.** Full results re-banked
      @ 84a093d8 (supersedes 3cc2dfbe). Dimensions addendum committed @ a3acb3bc — headline
      adds: THE UNLIT SWITCHBOARD (all 15 waves dark, no preset/UI lights the 9 gates — owner
      ruling required), the hollow pause-verdict gate (product-fit high), regressed fiction
      classes (hand-list guards vs walkers), DEPLOY.md rot on the pre-authorized deploy path.
- [x] **Phase A — ASSESSMENT** (Fable main loop): `docs/COMPREHENSIVE_REVIEW_2026-07-15.md`
      COMMITTED — verdict (0C/14H/68M/109L; defect mass migrated to cross-wave seams +
      built-but-unwired class), full 191-finding register with per-slice coverage, owner-urgent
      list (§6), fix-program shape (§7), dimension re-dispatch queue (§8).
- [ ] **Phase V — VERIFY** (Opus, model:'opus'): DISPATCHED 2026-07-16 ~00:12 as workflow
      `wf_475bdd2a-7b5` — 96 Opus agents (14 highs × 2 lenses refute+re-derive, 68 mediums × 1
      refuter; agents self-extract finding details from the banked RAW_SURVEY_RESULTS.json);
      lows defer to implementation-time verification (recorded, not dropped). The 10-dim
      survey remainder re-dispatched simultaneously (resume of `wf_d69567dc-f0d`, 23 slices
      cached). Both launched when capacity returned (owner: "do it now").
- [x] **Phase P — WAVE PLAN (final, 2026-07-16 ~01:30).** LANDING BASE RE-RULED: the merge
      session STALLED at W3a (no commits since 22:12; WIP idle 3+ hrs — session dead). Per the
      owner's charter order (fix THEN merge), Phase F lands on **review-fixes** now; the merge
      fold-in (Phase M, mine) carries the fixes — nothing strands. Golden-shifting work stays
      off RF until the regen moment (the merge plan's Stage-1 golden-arbiter survives).
      **THE WAVES** (fenced; every wave: Opus implementer in an isolated worktree off a verified
      base hash, full gate, Fable §0.3 review, exact-stage merge):
      - **BATCH 1 (parallel, disjoint fences):** W-R2-DOCS (docs + freshness pins — must
        precede Phase O) · W-R2-INTENT (store/hooks/composer intent-trust: refusal surfacing,
        editSeed round-trip, autosave key, rename column, outbox keying, pause guards, docket
        ids, eviction receipts) · W-R2-SEAMS (dark-kernel engine seams, byte-neutral by
        dormancy: naval retire [role-aware per verdict], upswing freshSettlement, movers-skip-
        remnants, generosity triage + double-decay, boom cooling, satellite stranding,
        convergence one-army, casus decay, settlementPolitics inputs, momentum ENTRY_ONLY +
        crack window, terminal-death eventConditions).
      - **BATCH 2 (after batch 1):** W-R2-TRUST (AuthModal, saveId stamp, purchase copy +
        tierFacts walk, pricing moment, analytics privacy ×2 + source scan, clawback posture,
        CORS tightening, grant revoke) · W-R2-GUARDS (kernel fence, dist-read gating, SCC,
        dormancy oracle, spatialUsage walker, impactKind walkers, size ceilings, transitive
        spine, seeded properties, soak-to-CI, compendium pin, hard-deny walker) · W-R2-DATA
        (registry ingest, goods shapes, fish keeper, NPC_ROLES disposition) · W-R2-SURFACE
        (pause-verdict cards, 5 read-models, navalStrength, warCausalBrief, hegemony display
        half, forecast candidate UI, FORCE_RECONSIDERATION dial, whisper wiring, palettes,
        snapshot naming, boom voice + rumor phrases, significance sweep, PDF trio).
      - **RF-side also:** TRACK-G2 IMPLEMENTED + evidenced, regen PARKED for the owner-signed
        moment (folds with the lighting shifts).
      - **POST-MERGE (recorded sequencing):** Phase M fold-in → W-R2-LIGHT → W-R2-DEPTH →
        the G2+lighting regen moment.
      REFUTED findings (6) are EXCLUDED from all briefs; PARTIAL corrections BIND the fix
      shapes (verdict records in docs/review-r2/VERIFY_*.json are part of each brief).
- [ ] **Phase F — FIX WAVES** (Opus implementers, Fable §0.3 review per wave, full gate per
      wave): **OPEN. Baseline gate GREEN @ 853bc923-era tree: 9,896/9,897 (882 files) +
      verify:dist 119/119, exit 0** (log: scratchpad/baseline-gate-r2.log; any later red is
      wave-caused). BATCH 1 DISPATCHED 2026-07-16 ~01:40 as workflow `wf_40d34edf-230` —
      3 Opus implementers in isolated worktrees off base 853bc923: W-R2-SEAMS
      (claude/w-r2-seams) ∥ W-R2-INTENT (claude/w-r2-intent) ∥ W-R2-DOCS (claude/w-r2-docs).
      Briefs committed in docs/briefs/ (W_R2_COMMON_PROTOCOL + per-wave). On return: Fable
      §0.3 review per wave → exact-stage merge to RF → batch 2 (TRUST/GUARDS/DATA/SURFACE).
      **✅ W-R2-DOCS MERGED @ bbb1cadc** (2026-07-16 ~05:17): 6/6 findings fixed, 14 freshness
      pins (§0.3 review: zero product source ✓, zero ledger rows touched ✓, all 11 tests/docs
      files 63/63 green independently re-run on the merged tree ✓; agent's full gate green
      modulo the 2 documented load-flakes, 15/15 isolated; wrong-lineage worktree trap
      self-corrected per protocol — 4th recurrence, brief guard worked). 3 vetoable JUDGMENTs
      recorded in the wave report (head-naming pin strictness; deploy.sh mirroring; the 2252
      ceiling kept — the finding misread it, verdict-corrected). SEAMS + INTENT limit-killed at
      dispatch 1; RE-DISPATCHED post-reset ~05:17 (same run resumed, DOCS cached).
      **OWNER FULL DELEGATION (2026-07-16 ~02:00, verbatim: "I formally give full permission
      to delegate anything to you should a decision need to be made as long as it is set with
      the standard that I set at the beginning! Continue all the way until everything is
      done!")** — standing constitution + owner-gated classes survive as always.
- [ ] **Phase E — END**: final gate + ledger rows + memory + owner report.

**PHASE M TAKEOVER DOSSIER (read-only prep, 2026-07-16 ~05:30):** merge branch at c89a5372
(W1+W2+W3a committed). The dead session's worktree (.claude/worktrees/agent-a04d3f325c72e62dd)
holds coherent mid-wave WIP: STAGED = component adaptations (theme-constant replacements,
master-only surface slimming — AccountMenu, EntityPicker, AccountProfileSection −282,
GalleryCard, home/*; shape = W6 test-estate adaptation or W3b continuation); UNSTAGED = domain
additions (npcs +46, simulationSpine +45, factionResponses +38, counterfactual, propagate,
historyBeats, resolveConfig — shape = adapting RF code to master's imported tests). TAKEOVER
PROTOCOL (decided, binding): (1) snapshot the WIP exactly as-is to a rescue branch (staged +
unstaged committed with a WIP marker) BEFORE anything else — the preserve-foreign-WIP law;
(2) identify the wave against MASTER_MERGE_PLAN §7; (3) finish-or-redo per the plan with the
rescue as reference; (4) fold the advanced RF tip into master-merge-r1 before W7's
constitutional gate. Remaining per plan: W3b?/W4 (F24 + controlBytes pin), W5 (guard-port +
entity-link wiring), W6 (test estate ~350), W7 (full gate), W8 (owner gate: push + PR — the
push is PRE-AUTHORIZED per the 2026-07-15 rulings; the PR merge button stays the owner's).
**BATCH 2a DISPATCHED ~05:35 as `wf_f55e896e-435`** (TRUST/GUARDS/DATA off d05ffad2, fences
disjoint from the running SEAMS/INTENT — five implementers in flight). W-R2-SURFACE queues
behind INTENT+GUARDS merges (composer-file + walker-allowlist overlaps).
**✅ FOUR WAVES MERGED (2026-07-16 morning):** SEAMS @ 46c10028 (17/19 fixed + 2 honest
design-level deferrals: boom-cooled state + conscience-door channel = new-capability
owner-gated, recorded in-file; branch gate 9,945/0; all 5 dormancy goldens + both lit soaks
green) · TRUST @ 23b41a6c (10 fixed incl. the structural privacy guard that surfaced a THIRD
raw-id call site; migration 135 WRITTEN-not-applied; budget respected via the minimal
saveId-stamp JUDGMENT — the instant library echo deferred vetoably) · GUARDS @ 5463c60d
(15/16; zero eager; 7 whispers recorded UNWIRED pending SURFACE; ⚠️ MIGRATION COLLISION
caught at merge: TRUST + GUARDS both minted 135_*.sql in parallel — GUARDS' renumbered to
136_world_snapshot_deny_census_lift.sql, DEPLOY.md conflict resolved to head 136, chain
validated contiguous, freshness pin green) · DATA @ merge after 5463c60d (4/4; generator
golden BYTE-IDENTICAL; slave-trade export enable recorded owner-gated golden-shifting →
G2 candidate). Combined-tree full gate RUNNING (merged-4wave-gate.log). **INTENT HELD at
its branch (a06f2c56, 15/16 + 65 tests): the sole red = +2,711 B eager over the ratchet —
implementer correctly did NOT raise (owner-gated); TRIM AGENT dispatched on
claude/w-r2-intent-trim (the store lazy-body pattern, target ≤ +50 B; reclaim-first law) —
merge follows the trim.**
**MERGE RECONCILIATION LOG (2026-07-16 morning):** the 4-wave merged gate surfaced three
cross-wave artifacts, all reconciled: (1) size-ratchet baselines re-minted at merged-tree
truth @ 84eee881 (3 files sibling waves grew; type-honestly-at-merge precedent, JUDGMENT
vetoable); (2) SEAMS' new blockade_lifted impactKind phrased + classified @ 81fbf3e9 —
GUARDS' walker caught it, working as designed; ARCHITECTURE count → 136. (3) Gate now:
**main suite FULLY GREEN 900/900 files, 9,966/9,976** — sole red = first-paint budget
+39 B (four waves' individually-green margins summed over). Per the reclaim-first law:
**FP-G8 micro-reclaim agent dispatched** (target ≥250 B off 81fbf3e9) — the budget is never
raised. INTENT-trim agent still in flight. SURFACE + G2 + DEPTH dispatch after INTENT merges.
**INTENT-TRIM VERDICT (STOP, honest):** the +2,711 B is IRREDUCIBLE — per-chunk closure diff
proves the entire delta is synchronous test-pinned store control flow (sync-prefix guards
alone ≈ 700 B; async-hiding would break the wave's own pins). No code changed; branch parked
at a06f2c56. FP-G8's target RAISED to ≥2,750 B (comfort 3,100) via SendMessage — the store
chunk is the well to drill (canon-via-aiSlice light-consumer candidate + a fresh
ENGINE_SHARED_DOMAIN over-inclusion census). If G8 lands ≥2,750: merge reclaim + INTENT,
gate green. If dry: INTENT parks for the owner's reclaim-or-raise decision (its 8 fixes are
safe on the branch) and the program continues past it. **BATCH 2b DISPATCHED
(wf_e3517745-b86) off 163601a4:** W-R2-SURFACE (amendments: builds hegemonyRead + display;
surgical EventComposer diffs for the later INTENT merge; empties GUARDS' whisper allowlist)
∥ TRACK-G2 (red-by-design branch + THE SHIFT MAP + the Underways catalog half). W-R2-DEPTH
holds for its recorded post-merge post-LIGHT slot.

## OWNER CHARTER EXTENSION (2026-07-15 late night, verbatim: "after you do all of the surveying
## and fixing, i want you to continue where the merge was and the rest of the operations that follow")
THIS session's full charter, in order: (1) Phase S/A/V/P/F — the round-2 review + fix program.
(2) THEN take over the MASTER MERGE wherever it stands and carry it to completion per
MASTER_MERGE_PLAN.md (at charter time a parallel session held W1+W2+W3a @ c89a5372 with live
WIP — TAKEOVER PROTOCOL: never touch the merge worktree/branch while the other session is
actively writing; verify inactivity via fresh WIP mtimes + `git log` before assuming control;
re-survey per the plan's §0 rule — if topology facts moved, re-pin dispositions first; foreign
WIP is preserved, never reset). (3) THEN the operations that follow per the standing sequence:
push the reconciliation branch + OPEN THE PR (both pre-authorized by the 2026-07-15 rulings;
the PR merge button stays the owner's per the standing vetoable reading) → SM-4 → GUIDE-2b →
Surveyor S1–S7 → the dimensions-only re-grade → lighting batch PREPARED for owner signature →
the owner decision list (db-push sequencing, covert-leak scrub, support email, applied-head
vs prod) → the successor's soak.
SEQUENCING CONSEQUENCE (recorded, vetoable): the owner's order puts fixing BEFORE merge
continuation. If the parallel session finishes the merge before Phase F opens, fixes land on
the unified lineage (no tension). If not, Phase F lands on RF post-cut and the merge
continuation gains an explicit FOLD-IN step (merge the advanced RF tip into master-merge-r1
before its W7 full gate) so no fix is stranded behind the merge cut. Decided fresh at Phase P
from live git state.

## Round-2 resume protocol (successor session) — HARDENED FOR WINDOW CUTS
The owner expects the usage window may cut before the charter completes (stated 2026-07-15 late
night: "a very real chance that I will run out of window space... prepare accordingly"). Standing
rule: **EVERY phase banks its artifact to the repo the moment it lands — commit before continuing.**

Per-phase resume (find the current phase from the checkboxes + fresh git log):
- **Died during Phase S (survey):** the fleet's structured outputs stream into
  `~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/7115c211-9732-4751-8d73-170ba6bbcf31/subagents/workflows/wf_d69567dc-f0d/journal.jsonl`
  — salvage every completed slice from there (each journal record carries the agent's full
  structured return). The COMPLETE workflow script (all 22 subsystem scopes + 11 dimension
  charges + the schema + the preamble) is COMMITTED at
  `docs/briefs/REVIEW_R2_SURVEY_WORKFLOW.workflow.txt` (copy to .js at dispatch time — eslint
  pre-commit rejects the workflow dialect as a module) — re-dispatch ONLY the missing slices by
  pruning SUBSYSTEMS/DIMENSIONS to the gap list (workflow resume-from-run-id is
  same-session-only; a new session re-dispatches).
- **Died between S and A:** raw results are banked as `docs/review-r2/RAW_SURVEY_RESULTS.json`
  (the landing session commits this FIRST, before synthesis — if it exists, never re-survey).
- **Died during A/V/P:** the partial assessment/verdicts live in
  `docs/COMPREHENSIVE_REVIEW_2026-07-15.md` (committed incrementally); Phase V re-dispatches
  only findings without verdict columns.
- **Died during F:** wave rows in the ledger + Progress lines say what shipped; unstaged
  worktree WIP belongs to the wave named in the last Progress line — finish or re-dispatch
  that ONE wave, never re-plan from scratch.
- **Died during M (merge takeover) / O (post-merge ops):** MASTER_MERGE_PLAN.md §7 wave list +
  `git log claude/master-merge-r1` say exactly where it stopped; the takeover protocol in the
  charter extension above applies to the successor identically.
Also: (1) check `git log claude/master-merge-r1` before landing fixes anywhere (if the merge
landed, Phase F targets the unified lineage). (2) The charter extension binds the successor:
review+fix → merge continuation → post-merge operations. (3) Memory mirror:
`memory/comprehensive-review-fix-program.md` (this doc is authoritative).
