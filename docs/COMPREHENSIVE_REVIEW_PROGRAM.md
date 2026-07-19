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

## OWNER RE-SEQUENCING RULING (2026-07-16, verbatim: "okay. do that. hold off the push and
## deploy to the very end.") — THE BINDING ORDER OF OPERATIONS:
1. W6 → fold-in → **W7 full constitutional gate (LOCAL ONLY — no push)**.
2. W-R2-LIGHT → W-R2-DEPTH back-to-back (the last engine-touching waves).
3. **THE SOAK ENTERS THIS PROGRAM** (pulled forward from the successor's charter, per this
   ruling): 30-yr certifications + the 100/300-yr century probes + the settlement-cap study
   launch as background compute (gate-on harnesses; no regen or preset lighting needed)
   the moment DEPTH merges — longest probes first.
4. SM-4 ∥ GUIDE-2b → Surveyor S1–S7 build CONCURRENT with the running soak (display/AI
   lanes cannot invalidate it).
5. Soak verdicts → **THE TUNING WINDOW: weight tuning + W-R2-D7 THE REFRAME LAYER build**
   (owner-commissioned 2026-07-16, designed + frozen in DESIGN_SIM_DEPTH_R2 D7 — motive
   attribution as belief; builds HERE so soak verdicts calibrate its dice and its lit-path
   shifts batch) → targeted re-certs → **THE ONE REGEN** (owner-signed, batching: lighting
   shifts + G2 shifts + the Underground Network catalog + soak-driven tuning shifts + D7
   shifts — a single golden event; JUDGMENT: D7-in-the-tuning-window over post-deploy,
   preserving one-regen — say veto to move D7 post-deploy instead).
6. Dimensions-only re-grade → Phase E close.
7. **THE VERY END: push + PR + the owner deploy batch** — this MODIFIES the 2026-07-15
   "push couples to the merge" ruling: the push/PR now HOLD until everything above is done.
   Consequence: the deploy is SOAKED-BY-DEFAULT (the un-soaked posture retires unless the
   soak is still running at deploy time). Nothing leaves this machine until step 7.

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
- [x] **Phase F — COMPLETE (2026-07-16): ✅ SURFACE-2 MERGED @ f6986be3** — all 14 remaining
      items (whispers wired + walker fully strict at ceiling 0; palette single-source + hex
      scan; deity names from snapshots via one shared resolver; naval legibility — sea
      blockades standing in LiveWarStatus; politics + credibility read-models in RealmIntrigue;
      the PDF quartet incl. the war-room treaty table; forecast fingerprint world-revision
      fold; lapseOf real-ctx). Agent gate CHECK EXIT 0: 919 files / 10,122 tests; zero eager;
      wrong-lineage trap self-corrected (5th recurrence — the protocol holds). Closing gate
      running. **PHASE F TOTALS: 8 waves + FP-G8 merged (~90 findings closed incl. all
      verified highs), suite 9,896 → 10,122+ (+226 pins), first paint −55.5 KB, RATCHET #10,
      3 owner-gated deferrals recorded, G2 parked red-by-design awaiting the regen moment.**
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
**✅ THE RECLAIM GUSHER + INTENT HOME + RATCHET #10 (2026-07-16):** FP-G8 reclaimed
**−60,906 B** (two engine-core over-inclusion trims: the stale generator-spine eager pin —
its sole first-paint consumer went lazy waves ago — + the settlement.schema leaf;
vite.config.js only, goldens byte-identical) → merged @ 2e72ede5; **INTENT merged @ c7715f3a**
(its irreducible +2,796 B funded ~22× over); settlementSlice ceiling reconciled 1300→1333
(reconciliation #3, same class). **FULL GATE GREEN exit 0: 906 files / 10,038 passed +
verify:dist 119/119.** RATCHET #10 @ 5a560d4b: 1,121,903 → **1,066,400** (measured 1,063,832
+ ~2,568 funded headroom; NET −55,503 vs pre-G8). SATELLITE QUEUE SETTLED with zero landings:
persist-gap 151a8ee3 + W2 4cf84a40 both ALREADY ancestors (stale blocked-notes corrected);
round-21 W5 312a5025 OBSOLETE (raw-color half absorbed at 1427 in-file; budget-raise half dead
under #10) — the standing W5-cherry-pick rule is CLOSED. Six of seven waves + reclaim merged;
~65 findings closed; suite 9,896 → 10,038 (+142). REMAINING IN PHASE F: SURFACE + G2
(batch 2b in flight).
**✅ SURFACE MERGED @ 090b952e + G2 PARKED + PHASE M OPENS (2026-07-16):** SURFACE landed its
8 headline items — THE PAUSE-VERDICT SURFACE (keep/dismiss cards per major; Resume submits
verdicts; the authority gate closes), the FORCE_RECONSIDERATION composite course dial (the
last dead verb lives), hegemonyRead + dashboard mount, warCausalBrief mounted (the vision's
flagship line reaches the eye), library advance refusal honesty, prosperity tolerant read —
at net −3 eager B; 17 lower items honestly deferred at session budget → **SURFACE-2
dispatched** (whisper wiring + allowlist emptying, read-model residue per verdicts, palettes,
snapshot naming, PDF trio, forecast fingerprint). **TRACK-G2 PARKED red-by-design @ aec57981**
(claude/w-r2-g2): 3 byte-neutral fixes + 5 golden-shifting stops incl. THE UNDERGROUND NETWORK
(catalog name per the register JUDGMENT; +1,312 B eager fits the funded headroom at its merge);
THE SHIFT MAP on the branch; slave-trade enable recorded owner-gated; generators-domain-1
verdict correction honored (defense already coupled — food scoping only). **PHASE M OPEN:**
rescue snapshot b89e2f56 (claude/master-merge-wip-rescue — the dead session's 17 files
preserved; merge branch restored clean @ c89a5372); **W4–W6 continuation agent DISPATCHED**
(byte-integrity → guard-port/entity-link → test-estate; stops before the fold-in, which waits
for SURFACE-2's RF merge).
**PHASE M W4+W5 COMPLETE, W6 PARTIAL→RESUMED (2026-07-16):** W4 @ 76c28e45 (F24 whole-tree:
NotesTab both-sides-together + a FRESH generosityKernel:485 NUL golden-proven + the
controlBytes pin landed w/ the supplyCompleteness owner-call allowlist; W1-resolution
correction restored RF's lost NotesTab disclosure copy). W5 @ 30ff6b6a (ab1c30ba pin green,
data-map-overlay-svg auto-returned as predicted; ccd0d670 docstring DROPPED-superseded — the
hover IS wired on this tree; **the entity-link consumer layer wired end-to-end** incl.
porting master's transient focusedEntity architecture the plan under-scoped — JUDGMENT).
W6 @ f79d5cf1 PARTIAL: build blocker fixed (7 north-star components → RF-wins, matching the
rescue), 28 test-resolution errors reverted (374 tests green), 18 fenced drops; rescue
domain hand-merges DISCARDED as owner-gated golden-shifters (correct). **Agent RESUMED for
the 151 remaining dispositions (security-first), the 8 hand-merges, honest rebaselines.**
OWNER-GATED QUEUE GROWS: (a) the merge branch's +4,723 budget bust = the recorded
golden-lineage overage — EXPECTED CURED at fold-in by RATCHET #10 + FP-G8's config (verify
then); (b) EXEMPT_CEILING 66→69 (3 legitimate transient actions); (c) **THE DAILY-LIFE
FOLDING FORK (W6 aiSlice verdict, 2026-07-16):** master folds daily-life prose into ONE
narrative credit spend + persists switched-away runs' ai_data; RF keeps TWO separate paid
actions + discard-on-switch. Credit economics + persisted-shape + edge-contract = owner's
call: ADOPT master's one-spend model (rewires requestDailyLife's 4 live call sites + the
server contract) or KEEP RF's two-spend semantics (tests adapt/drop accordingly). The four
NON-gated aiSlice fixes (cross-identity chronicle/rename/revert/hydrate bleeds + the
setNestedPath proto-pollution guard) port regardless — ratified to W6.
**W6 STRETCH 2 RATIFIED (2026-07-16, six commits c9231292..50f3298d):** tests/security FULLY
GREEN 70 files / 774 tests — two REAL RF gaps fixed (gallery merge-patch/sanitize-on-write
family; the money-path e2e stub replaced with master's LIVE journey, secrets-gated); avatar-XSS
fixed; ai.js transport hardened (proto-guard, deadline, malformed-done fatal); backdrop URL
guard live; docs rebuilt to merged reality + a broken pre-push hook found+fixed; honest
rebaselines (rawButton DOWN 33→32; title= 471→502 all master-carried); aiSlice safe-ports
landed goldens-identical. Lib family 115 files / 1,060 green. Agent RESUMED self-ratifying
(established patterns) for the final store cluster + comp tail; stops before fold-in. OWNER
QUEUE ADDITIONS from W6: auth resilience family, token skew-grace, anti-enumeration,
commit-vs-discard, StrictMode adoption, withTimeout wave, free-export check.
**⬛ OWNER RULING #6 (2026-07-17: "after these land simply stop"):** the manager FOLDS the
five in-flight lanes as they report, then HALTS — no further dispatches this session
(S4-S6, generation-time content, TOWN LAYOUT v2, the composite, ROUND 3 all HOLD). The
successor resumes from the dossier's DISPATCH ORDER section. All pre-signed authorities
(RULING #5, THE ONE REGEN) remain standing for the resume.
**⬛ FOLD 1/5 — GALLERY-2 PHASE 2 (2026-07-17):** folded into claude/w7-prep @ d17bc07f
(merge of claude/gallery-p2 tip 126c95f6, 6 commits off c1d3f6eb; conflict-free — zero
file overlap with the provenance/growth advance). All five signed deliverables: six-phrase
reactions (votes-posture table, 120/h shared velocity, 3-way vocab parity), aliveness
ranking (0.7·depth/80 + 0.3·ageBand, snapshot-at-publish both paths, null-when-unknown) +
most_alive sort, Campaigns third tab (CampaignStatePanel mounted), gallery_title (one
coalesce chokepoint), 15 facet hubs + sitemap default-ON (31 URLs, anon-render pinned).
MIGRATIONS RENUMBERED AT FOLD 146-149→145-148 (145 freed by the BYOK renumber; validator:
148 files contiguous — the lane's isolation-only 145-gap red DISSOLVED). Lane pins 301
green on the merged tree; the one full-set red was the pglite load-flake, 41/41 in
isolation. Lane full gate (pre-fold): 11,691 pass, 46 load-flaked files all green isolated,
tsc 0, dist 145/145 fresh, +804 B eager (margin 7,164 under RATCHET #11). JUDGMENTs
(vetoable, in the lane report): formula weights, +10 relevance cap, 120/h ceiling, top-3
card chips, curated-in-hubs, sitemap creds-keyed default-ON. Seams: no aliveness backfill
(re-share stamps, at_war precedent); maps/campaigns have no title lane (signed wording);
code-ahead-of-schema window now 118→148, closes at the very-end deploy. NOTE: the lane's
spawn-chip for the saves.js gallery_importable data-loss is ALREADY FIXED on
claude/fix-gallery-list-importable @ e0d0c29c (unfolded; dossier resume item — NOT one of
the five). ⚠️ SUCCESSOR: surveyor-s3's migrations 145/146 COLLIDE with the folded
145-148 — renumber to 149/150 at S3's fold with internal-ref updates.
**⬛ FOLD 2/5 — SURVEYOR S3 (2026-07-17):** folded into claude/w7-prep @ 9ade8e08 (merge
of claude/surveyor-s3 tip 03b5e2b4, 5 commits off e6f14414). The three charges: A THE
INTENT COMPILER (interpret-session; label taxonomy w/ uncertain-default, THE SCHEMA WALL
= op registry as tool schema, protected-consent barrier structurally inert without
consented:true, §9 correction typology LIVE via SURVEYOR_CLASSES, S1 money path verbatim
+ kill-switch gate) · C THE PARLEY (parley; epistemic fidelity structural twice — own-
knowledge slicer + edge citation law w/ LEAK downgrade; total-grounding parity = 4 bank
facets + 8 §2d legs, client≡edge no-drift; musings-only strips any op) · B THE SHELL
(visible context anchor follows the page; zero-cost suggested questions, imports nothing).
MIGRATIONS RENUMBERED AT FOLD 145/146→149/150 (the forecast collision with gallery's
145-148; validator: 150 contiguous; full-sequence pglite green). Conflicts resolved:
ARCHITECTURE.md count→150, DEPLOY.md head→150_surveyor_stage_kill_switch; pricing.js
auto-merge VERIFIED (599 kept + interpret=5/parley=3). Lane pins 202 green on the merged
tree (25 files). Lane gate (pre-fold): strict 0/0, lint 0, dist 143/143 fresh ×2, ~150 B
eager (event-name strings only), EXEMPT_CEILING red was pre-signature-base only — clears
here (mainline = signed 69). SIGN-OFF ASKS (ride the RULING #5 blanket; vetoable):
interpret=5/parley=3 pricing · kill-switch semantics (absent-key⇒enabled, edge fail-
closed, operator pauses via direct config edit, no self-service RPC) · S1-machinery-by-
direct-import over _shared refactor · uncertain-default + protected-graze-inert. SEAMS:
fuller §2c UI polish (docked panel, ambient glyphs, Cmd+K, first-open whisper + early-
access copy) deferred as least-verifiable headless; accept→mint wiring from
reviewInterpretation into applyWorldPulseProposal/recordPartyImpact = the designed next
slice (both ends exist); personaSlicer degrades to muted facets on dormant worldState.
**⬛ FOLD 3/5 — MAP EXPORTS (2026-07-17):** folded into claude/w7-prep @ 7ff194aa (merge
of claude/map-exports tip 017a921c, 2 commits off c1d3f6eb; conflict-free). The matrix:
settlement SVG (byte-pinned per (settlement,lens,resolution)) · PNG/JPEG/WebP @ 1200/2400/
4800 (shared SVG→canvas idiom; bytes deliberately unpinned — browser-native encoders) ·
VTT token PNG (the recorded seam CLOSED) · single-map PDF (shared renderTownMapOp — no
plate drift) · realm composite PNG (PLAUSIBLE: statically verified against the proven
captureCampaignThumb idiom; one browser click settles it). WYSIWYG law: exports honor
cosmetic mapEdits + the ACTIVE lens (override > persisted styleLens). THE $2.99 EXPORT
BUNDLE (owner ruling executed): every format gates through the EXACT single-dossier lane
(resolveExportAccess + dossierEntitlements + BuyThisDossier as the unlock rung) — one flag
= dossier PDF + Foundry + all map exports; premium/founder/elevated free; NO new gate
class, NO schema change; copy renamed to the bundle (2 tests updated, owner-directed).
Zero eager bytes (closure 1,032,077 of 1,040,000 on ITS base); dist 143/143. Lane pins 59
green on the merged tree post-fold. SEAMS in-file (MAP-EXPORTS-2): UVTT/Foundry pre-walled
scene (full .uvtt shape + wall-derivation + 1:1 fixture pin SPECIFIED; stock Foundry needs
a community importer — honest caveat) · realm with/without-settlements toggle (overlay-
skip flag + terrain-bytes-identical pin specified) · bridging the fork's native getMapURL
exporters (would lift realm export past 1024px + add realm SVG) · anon/gallery export
affordance (none in v1 — owner decision). JUDGMENTs (vetoable): src/utils home for the PDF
builder (tsc-graph isolation, ~650 latent JSDoc errors proven avoided) · main-thread
single-map PDF (tiny vector doc; F41 worker stays dossier-only) · two-commit shape (work
preservation over per-deliverable commits — two session kills mid-lane).
**⬛ FOLD 4/5 — THE URBAN FABRIC LAYER (2026-07-17):** folded into claude/w7-prep @
72be500f (merge of claude/urban-fabric tip 0b9107d1, 3 commits off 9b9e525a; conflict-
free). The map's memory, all five commissioned mechanisms: per-district prominence stocks
(12-class integrators, interval-invariant over elapsedWeeks, no rng, categories pinned-
not-imported to keep districtProfile out of the engine graph) · regime lingering = decay+
deposit (two-regime fixture: 6mo dominant, ~2y overtake, ONE turn beat) · alignment-drift
grain toward 1−lawfulness01 · typed stressor scars w/ per-kind masonry half-lives (78–260
wk) · catastrophe fast-path (toll≥100 resets struck classes, ≥400 town-wide; REBIRTH_CAP
6). Storage: sidecar spatialLedgers.urbanFabric (drop-when-empty) + compact settlement
mirror (acquiredTraits idiom); measured 844 B/record, <2KB worst-case pinned. Virtual
urbanFabricEnabled + COMMITTED dormancy golden (wired-dormant byte-identical, 1,195 pre-
existing files green); #38 READ API fabricRead.js (empty-when-dark; drift null ≠ 0.5 —
absence isn't neutrality). Zero eager bytes (closure 1,032,709 before AND after);
pulseKernel name-swap only, ceiling 1387 green. Lane pins 28 green on the merged tree.
JUDGMENT TABLES (signed under the RULING #5 blanket, vetoable): time constants (stock
half-life 260wk, drift 104wk, scar map), deposit map (rates/week × signal01), caps/
hysteresis (LEAD_FLOOR 1.0, TURN_MARGIN 1.15, STOCK_MAX 10). RECOVERY NOTE: the lane's
worktree died with the rate-limit kill; remediated to .claude/worktrees/urban-fabric on
the pre-authorized base — main tree never mutated. SEAMS: #38 layout engine consumes
fabricRead when commissioned (hasFabric-branch + fallback); dossier/AI surfacing not
wired (mirror available, grounding untouched); lighting rides the pre-signed regen batch.
**⬛ FOLD 5/5 — THE MISC-SIGNED WAVE (2026-07-17):** folded into claude/w7-prep @
07d3a1d2 (merge of claude/misc-signed tip dfd0d4ec, 2 commits off 9b9e525a; conflict-
free; the manager's containment commits b0837797/2173e93d were soft-reset + reshaped by
the lane as granted, content verified verbatim-preserved). ITEM 1 membership id
normalization: String() model at campaignSettlements + getCampaignForSettlement (the in-
code OWNER-GATED deferral retired) + four same-seam writer siblings (addToCampaign prune/
dedupe, removeFromCampaign filter + crash-guard, SettlementsPanel listing). ⚠️ ONE-TIME
BEHAVIOR SHIFT (signed intent, in the commit body verbatim): campaigns holding number/
string-mismatched member ids REGAIN those members into world-pulse advances — previously
silently dropped. Zero golden shifts (audited: no golden carries settlementIds). Red-then-
green advance pin: string + number members BOTH advance. ITEM 2 mapChains enforcement
(closes the mapchains-gate-unenforced memory): the ccd0d670 cherry-pick was adjudicated
STALE (documents, doesn't enforce; QuickInspector claim outdated) — implemented fresh at
ALL THREE affordances (MapOverlay ChainEdges render, LayersPanel row, RoutesToolbar
toggle); locked = visible + Lock glyph + map_realm_teaser moment (reuse JUDGMENT);
derivation tier-blind (ChainEdges/supplyChains ZERO diff, source-scan pinned); stored
layers.chains never rewritten (upgrade restores). Lane gate: eager closure 951,955 B
(88,045 margin — its base predates later folds), dist 143/143, 2 pre-existing name-
identical env flakes vs base named. Fold receipt: lane pins 23 + census walker green;
composite receipt AFTER ALL FIVE FOLDS: migration head 150 contiguous + docs suite 93/93.
SEAM: SettlementsPanel:748 still lacks || [] on campaign.settlementIds (pre-existing
crash exposure, out of scope, recorded).

**⬛⬛ THE STOP (2026-07-17): OWNER RULING #6 EXECUTED.** All five in-flight lanes are
FOLDED into claude/w7-prep @ 07d3a1d2 (gallery d17bc07f → S3 9ade8e08 → map-exports
7ff194aa → urban-fabric 72be500f → misc-signed 07d3a1d2). Migration chain 001–150
contiguous; docs gates green on the composite; every fold verified by lane pins on the
merged tree. NOTHING PUSHED. The session halts here per the ruling. SUCCESSOR: start at
THE WEEKLY-LIMIT RESUME DOSSIER below — the DISPATCH ORDER section is the resume point;
all RULING #5 pre-signed authorities (incl. THE ONE REGEN) remain standing. Un-dispatched
per the stop: S4-S6, generation-time content, TOWN LAYOUT v2 (#38), the composite full
gate, ROUND 3, the soak. Unfolded side branches on deck: claude/fix-gallery-list-
importable @ e0d0c29c (sharer-edit data-loss fix), claude/fix-resource-taxonomy-
boundaries @ 48719d7a (owner-gated), claude/map-styles @ ac5318a1, claude/instant-world
@ f472a350, claude/surveyor-s1b @ 30781a7a, claude/w-r2-g2 @ aec57981 (regen batch).
**⬛ FOLD: THE DOMAIN-STRICT BURN-DOWN (2026-07-17) → w7-prep @ 9150b464** (the
task_be620e27 chip session; branch claude/domain-strict-burndown, rebased onto 2c980e4e;
folded hard-gated from the chip — clean tree + no MERGE_HEAD + tip-unmoved verified in
the w7-prep worktree immediately pre-merge; ff-only). THE V2-FOLD STRICT DEBT IS DEAD:
112 errors across the six townMap files (townLayoutV2 86 · asymmetrySources 10 ·
townPanorama 8 · lynchRubric 6 · siteGenesis 1 · townMapModel 1) → 0 by JSDoc annotation
ONLY (+155/−48 lines; 17 inline paren-cast sites, semantics identical, each documenting a
proven invariant; zero new `any` — domain-any 2230 unchanged; no new import statements;
F24 python scan clean ×2). GOVERNANCE: burn-down over re-baseline —
scripts/.domain-strict-baseline.json UNTOUCHED at total:0, the only-shrinks intent holds.
Scope truth: the reported ~550 was the whole tsc surface; the ratchet counts src/domain
only (112). changeView.js (SM-5's new domain file) VERIFIED strict-clean at the tip.
RECEIPTS (re-earned on the rebased tree, exit codes read bare per the hardened
discipline): node scripts/check-domain-strict.mjs exit 0 — "0 errors, ceiling 0" — from
BOTH the chip and w7-prep worktrees · vitest battery 544 files / 6,521 passed (lint +
architecture + build + domain + townMap v1/v2/style goldens byte-identical ⇒ zero
behavior shift) · tsc full exit 0 · dist 146/146 · eslint 0 errors. JUDGMENTs (vetoable):
TownV2Settlement `|null`→optional collapse on config/spatialLayout/economicState/
defenseProfile (the as-consumed truth; every read null-guarded; goldens prove) · its
`tier` nullability under-declaration recorded as an in-file seam (guarded at
townLayoutV2.js:202) · the full ~12k suite NOT re-run for a comment-only diff — the
battery + goldens + dist stand as the receipt; the composite full gate covers it.
**⬛ PRE-RECONCILIATION AMENDMENT (owner challenge 2026-07-18: "can't you pre-reconcile
the unevenness?"):** ACCEPTED — the predicted first-pass unevenness is not inevitable;
it followed from a binary exemption valve. The census gains the MATERIALS-ONLY bridge
tier (token/CSS-level materials swap, zero structural/behavioral change — the phase-1
ink ramp's 1:1 mapping to shipped colors was built for exactly this), plus JOURNEY-
CLUSTER ordering (no user flow crosses an old/new chrome seam mid-journey) and a phase-5
SEAM CHECK. Residual unevenness after the bridge = structural grammar only, which reads
as room-to-room variety. INSTRUMENT-EXEMPT retired as a visual state. Relayed mid-flight.
**⬛ THE FUNCTIONALITY RETENTION LAW (owner, 2026-07-18: "even with the website
overhaul, retain all the functionality!"):** written into the craft brief as a binding
law for every phase — recomposition never rewrite; functional parity per surface; the
existing behavioral tests stay green UNTOUCHED (rewriting a pin to match reduced behavior
= violation); INSTRUMENT-EXEMPT is the pressure valve; on any conflict FUNCTIONALITY WINS
and the conflict is reported. Relayed mid-flight to the running lane.
**⬛ OWNER RULING (2026-07-19) — THE ROADS WAVE GROWS TWO SURFACES (relayed to the
running architect mid-design):** (A) THE TRAVELERS OVERLAY — a realm-map TOGGLE LAYER
(recon-confirmed absent today: transit data exists, no renderer) drawing in-transit
armies (position from progress-fraction along trade edges, direction, banner, ETA),
road-borne migrant masses (only when road-borne), and traveling named NPCs along the
roads; follows the existing map-layer toggle precedent; purely derived read-only
rendering, lazy, zero eager; the NPC sub-layer renders only when the roads flag lights
(dormancy-trivial), the army/migration sub-layers read live systems as plain UI — the
wave's only not-flag-gated deliverable. (B) THE ROAD SCENE — party-travel staging for
the DM: origin→destination picked from the map, a DETERMINISTIC scene brief composed
from truth-state along the route (armies + allegiance + direction · migrant columns
WITH their causal reason · traveling NPCs + purpose + escort · embattled/bandit/monster
conditions · destination siege/occupation/festival + guest-right timing), in the
eventProse/brief-composer idioms, optional AI dressing through the EXISTING metered
surfaces (sessionGate applies); the party is NEVER simulated — a lens + composer, no
sim write. Both join the slice plan with their own commits/gates.
**⬛⭐ ROADS RECON COMPLETE — THE PREMISE IS REFUTED; THE WAVE IS GREENFIELD
(2026-07-19, 5-lens workflow, 5/5 agents, receipts in the run journal).** MANAGER
CORRECTION, owned: the manager told the owner NPC travel exists ("the mover") from
program memory — WRONG. Traditions T-2's "mover" is a per-settlement CULTURE kernel
(traditionsKernel.js:53 — "AGGREGATE culture motion… never a named soul's fate");
migrationKernel moves population COUNTS ("NAMED-NPC-SAFE", :18); armies march as force
tokens (warDeployment); rumors travel hop-by-hop over trade edges (rumorNetwork:5);
NPCs have NO location field at all (npcProfile / settlement.schema:195 — nested under
their owning settlement); no travel layer, no travel flag, no travel rng stream exists.
NAMED-NPC TRAVEL IS ABSENT — the Roads Wave builds it from scratch. WHAT THE SUBSTRATE
OFFERS (rich): the trade-edge graph + hopWeeks timing, the occupation 5-rung ladder +
war fronts + embattlement layer (threat classes), rumorNetwork/infoMode (the KNOWN
picture for intel-based routing — exactly the design's knowledge-vs-truth seam), the
corruption web's FOREIGN-PATRON precedent (cross-settlement NPC linkage — the
conversion mechanism's template), ladder goals (purpose vocabulary to extend with
location-bearing missions). BOUNDARY RECONCILIATION REQUIRED: two kernel headers carve
named-NPC protection as design law — the roads design must define itself as the SOLE
sanctioned named-NPC motion layer under the owner's explicit "build it all!" ruling,
amend those boundary comments in place, and preserve the deeper law via the carved
NO-DEATH rule (travel suspends fates, never resolves them). FABLE ROADS ARCHITECT
DISPATCHED with the full journal receipts → docs/DESIGN_THE_ROADS.md.
**⬛ OWNER RULING (2026-07-19) — THE FALLBACK ORDER: Supabase Pro + Stripe Connect
both BUILD-WITH-FALLBACKS; launch blocks on neither.** DESIGN_MONEY_WAVE amended in
place: (1) THE PAYOUT ELECTION — outgoing holders (transfers AND buybacks) elect
'connect_cash' or 'account_credits' ($49.50 of AI credits via system_grant_credits,
'seat_payout' delivery key, same due-runner claim-once); with Connect absent at launch
the credits form is the immediate option and cash parks at 'held' (re-electable) —
transfers can FULLY LIGHT on legal sign-off alone, which stays the un-fallback-able hard
gate; credits form has zero money-transmission surface. (2) PRE-PRO POSTURE — M-9's
session gate was already plan-independent (nothing degrades user-visibly); the runbook
gains the pre-Pro checklist: custom SMTP for auth mail (free-tier sender rate limits —
no Pro needed), manual backup cadence, uptime-probe-as-pause-keepalive. §12 terms payout
line rewritten to the elected-form language for the legal consult.
**⬛⭐ OWNER RULING (2026-07-19, "build it all!") — THE ROADS WAVE IS ORDERED.** The
full journeys-with-stakes design builds, pre-loop, as a dark engine wave: mission-purposed
NPC travel drawing purposes from EXISTING calendars/ledgers (traditions observances ·
trade agreements · diplomatic repair · LADDER rank missions — travel as a ladder move
with a location requirement) · traveler selection ladder-inverse (envoys from the middle
ranks; the great travel only for tradition-critical/personal missions) · routing reads
the faction's KNOWN intel picture while outcomes roll against TRUTH (information
statecraft becomes materially consequential) · FOUR threat classes: occupation/army >
siege-during-stay > embattled roads (bandits/monsters) > HOSTILE-RECEPTION arrival (the
owner's mid-design addition: stale-intel dispatch into a hostile court, or mid-visit
relations souring; host detention itself costs the detainer legitimacy — self-balancing;
optional GUEST-RIGHT tradition coupling lowers detention odds during observances) ·
capture = threat-strength × exposure ÷ protection(importance), armies partially bypass
protection · HOSTAGE = stasis via ONE participation-gate chokepoint (ladder, faction
contribution, tradition roles, seats all consult one predicate) · ransom paid over time
commensurate with ladder-derived influence, debiting existing power/legitimacy machinery;
party intervention via the existing edit dispatcher (COMMITTABLE_EDIT_KINDS rule) ·
low personality-weighted COVERT compromised conversion via the existing corruption system
(beneficiary = captor) · cadence/range governed (per-NPC yearly caps, neighbor radius,
~1-week stays, return-home default; siege/all-roads-hostile extend) · CARVED LAW: NO
death outcomes EVER — captivity always ends in release/rescue/conversion (the owner's
never-resolve-a-named-fate scope boundary) · dark virtual flag + byte-identical dormancy
goldens + own rng streams + catch-up-collapse stamping compliance + full persistence
lifecycle trace on hostage state. SEQUENCE: the 5-lens recon workflow (running) → Fable
architect → docs/DESIGN_THE_ROADS.md (Money-Wave treatment: frozen laws, slices, gates,
receipts) → Opus implementation lanes → adversarial dormancy verify → fold. ⛔OWNER-
QUEUED (not self-ruled): whether the roads flag JOINS the pre-signed ONE REGEN lit set —
default built-dark with the lighting decision separate.
**⬛⭐ WAVE E — LAUNCH OPS COMPLETE (2026-07-19, claude/wave-e-launch-ops @ f61f80a9,
9 lettered commits atop aad6265e — manager-verified merge-base).** The brief proved ~70%
STALE (error pipeline, sitemap/og machinery, refund policy page all pre-existed); the
lane trusted the repo and GAP-FILLED: client error dedup+sampling · migration 156
(grouped error-report reads + 8/hr alert threshold) · AdminClientErrorsPanel with
always-on alert banner · new `health` edge fn + uptime probe script · provider-neutral
mailAdapter (Resend default/Postmark, inert) + ops_error_alert template (authed-only) ·
og-craft.png JS-default alignment · PurchaseModal policy links (+18 B eager, DECLARED,
absorbed by the de-eager reclaim at fold) · 3 ops runbooks. All local gates 0; suite reds
= the 4 parked goldens + load-flaky pglite (proven pass in isolation) + the PRE-EXISTING
budget red (base proven over at 1,040,996 — note a 2 B measurement discrepancy vs WA1's
1,040,998; immaterial under the 18,036 B reclaim; reconcile at fold). ⚠ FOLD HAZARDS
REGISTERED: (1) MIGRATION 156 IS DOUBLE-MINTED — wave-e 156 AND perimeter ~156, with
money-wave designed at 157-161: fold batch 3 renumbers contiguously (pure file renames —
no code references numbers; RPC names are the interface); (2) config.toml +
send-email/log-client-error additive edits overlap perimeter-owned files — reconcile at
fold. OWNER/LEGAL QUEUE +1: accountFaq.refundWindow (en.js ~1402) asserts an UNENFORCED
"7 days if not downloaded" refund rule contradicting actual clawback behavior — surfaced,
not changed (paid-surface policy text). DE-EAGER CONFIRMED SHIPPED @ 2c4d599b (closure
1,022,962; Fable adversarial verify owed at fold 3). FREED LANE → WAVE B REMAINDER +
DOWNGRADE-AUDIT FIXES dispatched (claude/wave-b-remainder off aad6265e, Opus): the
non-money Wave B items (Class-A ×11 · HowToUse restore · Surveyor-gate comment · #15
door discriminator) + the audit's ordered fixes (P0 purge-spares-entitlements ·
retention email ramp · pause handling; BYOK server gate stays money-wave M-4's).
**⬛⭐ WA1 — THE DOSSIER TABS COMPLETE (2026-07-19, claude/wave-a-tabs @ 8fdd4b95,
10 lettered commits atop aad6265e — manager-verified merge-base = composite tip).** The
entire src/components/new/ dossier-tab family converted to the flat rule-framed
deep-craft idiom: 29 files / 325 offender lines censused, 28 converted; kill-list counts
driven strictly BELOW ceilings (borderRadius 906→646 · boxShadow 98→93 · rgba 234→209 ·
tinted 214→188) — a DECLARED tolerance-0 red until the fold re-pins ceilings to measured.
9 deferrals documented in-commit (5 cal-prim-gated Button suppressors · 2 magicSupplyBlue
pinned tints · 2 design.js palette-source lines). Receipts: tsc 0 · domain:strict 0 ·
build green · eager delta ZERO proven byte-identical vs base (1,040,998 both — the budget
red stays sibling-owned) · full suite 11F/13,599P = 4 kill-list declared + 4 parked
goldens (confirmed-at-base) + 3 flakes (proven pass in isolation). Judgments recorded
vetoable: squared timeline dots (outline-ring technique, kill-list-neutral) · RumorsTab
gold wash→border · badge ink stamps. New durable gotchas surfaced: rawColorLiteral
counts whole-string hex only; swatch hex keys are UPPERCASE. FOLD BATCH 3 QUEUE GROWS:
wave-a-tabs joins caliber ×3 + de-eager + perimeter(+finisher) + wave-e as they land.
THE FREED LANE → MONEY WAVE IMPLEMENTATION DISPATCHED: claude/money-wave off aad6265e,
Opus, slices M-1→M-4 (spine · ledger UI · auto-reload · surveyor limb) per
DESIGN_MONEY_WAVE; M-5..M-10 follow on manager checkpoint.
**⬛ OWNER RULING (2026-07-19, "do that!") — THE STEWARDSHIP RULING: the founder
dormancy question is CLOSED against inactivity forfeiture.** The lifetime promise stays
whole; reclamation is voluntary-first, abandonment-last: (1) STANDING BUYBACK $49.50 any
time via the account page (seat returns to the pool, resellable at $99 — same net as a
transfer, zero taking); (2) DORMANCY NUDGE at 18 months of no sign-in (both exits offered;
last-activity read from M-9's session table — free); (3) ABANDONMENT only at 5 years
unreachable + 90-day notice sequence any sign-in aborts → escheat + $49.50 held as
CLAIMABLE CREDIT (never fired at a dead card; no unclaimed-property exposure). The
owner's 2-year-forfeiture proposal was recommended against (breaks the "lifetime"
positioning, collides with the estate amendment, refund rail structurally unreliable at
2+ years) and the owner adopted the recommendation. DESIGN_MONEY_WAVE.md amended in
place: §6.8 + slice M-10 + fraud probe 10 (buyback abuse) + §12 terms (buyback +
abandonment clauses; license NEVER revoked for mere non-use) + §13 Q1 narrowed to
deleted-account orphans only. Committed this commit.
**⬛⭐ THE MONEY WAVE DESIGN IS FROZEN (2026-07-19) — docs/DESIGN_MONEY_WAVE.md
committed (this commit).** The Fable architect lane delivered the full wave design per the
two owner rulings (@ 15ba006c transfers-pre-launch + @ 4fd9a927 single session): NINE
slices M-1..M-9 — money spine (money_events, 157) · purchase ledger UI · auto-reload
reload-to-target (158) · Surveyor provisioning + the allowance price-id gate (159) · seat
register (137 REWRITTEN IN PLACE — never applied, prod head 117; the ruling is its
sign-off) · transfer choreography (160, five-state case machine, emailed challenge codes,
recovery lockout, email abort tokens) · finalize/due-runner/clawback interplay · Connect
payout limb (key-inert) · single session (161, last-login-wins, plan-independent gate,
the eviction-preserves-work lifecycle pin). MANAGER SPOT-CHECK CONFIRMED the doc's
load-bearing new hazard at the composite tip: grantMonthlyAllowanceIfNeeded
(stripe-webhook index.ts:223-227) gates on billing_reason ONLY — a Surveyor subscription
invoice WOULD mint the 30-credit Cartographer allowance; the M-4 price-id gate is a
load-bearing new pin. HONEST NOTE bound into the design: no TOTP exists — "2FA" in the
owner's model = password reauth + emailed challenge codes (067 idiom), TOTP adoption is
§13 Q4. Top risks recorded: post-payout slow disputes = accepted $49.50 residual
(owner/legal); Wave E mail seam + perimeter ~156 numbering are parallel-lane fold
coordination points. Implementation lane (claude/money-wave off the composite, Opus)
dispatches when a running lane frees. OPEN OWNER DECISION: the founder-promise dormancy
question — 2-year inactivity forfeiture (owner-proposed) vs the recommended keep-lifetime
+ 5-year unreachable-abandonment clause + $49.50 standing buyback + dormancy nudge;
§12/§13 amend on the ruling. Fraud-pass charter (§10) is MANDATORY before ROUND 3.
**⬛ OWNER RULING (2026-07-19) — THE SOAK LADDER · THE COMBINATORIAL MANDATE · THE
RESEQUENCING** (verbatim intent: "soak should have three levels: subcentury, century, and
300 century"; "we need to tune things in every conceivable toggle turned on and off in
combination with everything else… Everything on is very different compared with everything
on vs one thing off and any combination beneath"; "the push and deploy comes before the
soak because I will need to run that on a different computer"). Operationalized in
SOAK_PLAN_R2 §5 (committed this date): three levels = CERT-30 / CENTURY-100 / CENTURY-300,
all PASS criteria at every level · combinatorial matrix over every tick-path toggle (the
eight regen flags + nine wave gates + tempo band; enumeration generated at harness build,
never hand-typed) — FULL FACTORIAL at L1 where it fits the measured cost budget,
ALL-ON + LEAVE-ONE-OUT + ONLY-ONE-ON + ALL-OFF at L2, ALL-ON + flagged combos at L3 ·
display-only flags leave the factorial ONLY via executed same-seed byte-identity proof ·
single-flag same-seed deltas = marginal-effect reads; super-additive anomalies = named
tuning items · the soak executes on a SEPARATE machine cloned from the pushed branches,
certs bound to a recorded SOAK-BASE SHA. MANAGER RECOMMENDATION (vetoable, recorded): the
soak needs only THE PUSH; if the deploy also moves early it ships DARK (eight flags unlit,
the dormancy-proven configuration) with ONE REGEN + the lit deploy as batch 2; the §8
carve-outs (⛔legal · ⛔support-email MX) still gate whichever deploy goes PUBLIC first.
THE_REMAINING_ARCHITECTURE §5/§8 annotated same date.
**⬛⭐⭐ WAVE D — THE PERIMETER COMPLETE (2026-07-19, claude/wave-d-perimeter @
4b65ab82, 7 commits) + THE FINISHER ORDERED.** WD-a crawler governance (the
major AI-training/assistant crawler set blocked; funnel crawlers + unfurl bots
deliberately preserved — the og-image botGuard trap AVOIDED; noai persisted
through SPA mount via seo.js; X-Robots-Tag noai + TDM-Reservation headers) ·
WD-b ⭐ A REAL DEFECT FIXED: mapBridge parent-inbound source check was
FAIL-OPEN when contentWindow was momentarily null — now fail-closed both
directions; vendored fork untouched · WD-c the ToS anti-automation draft ·
WD-d bot-wave telemetry (_vband additive prop, no new names, zero eager,
band-only privacy; ingest-side velocity windows) · WD-e the rate-limit audit
TABLE + the clean gap hardened (customer-portal per-user 20/hr + per-IP 60/hr
fail-closed) · WD-f the wall census (an earlier claim CORRECTED —
verify-checkout WAS pinned; real-but-unpinned backfill list delivered:
save-limit trigger · claim_ai_request · limiter RPCs · deny-all RLS · the
CHECK class; the load-bearing ingest_check_rate pin ADDED 5/5) · WD-g the
Turnstile seam + PERIMETER_RUNBOOK (honest-limits verbatim-in-spirit). Eager
+3 B net (signed). Suite 13,610 / the 4 parked + sibling budget red + 2
isolation-cleared. ⬛ MANAGER VETO on its JUDGMENT #3: the seam stopped short
of CODE-COMPLETE wiring (render sites + verifyTurnstile call-sites left as
documented steps) — under build-completeness, activation = keys + dashboard
ONLY. THE PERIMETER FINISHER DISPATCHES: (1) wire Turnstile render
(AuthPanel/PurchaseModal) + server verify call-sites (create-checkout /
verify-single-dossier) + CSP allowance, flag-gated, key-inert, pinned; (2)
the AI limiter goes FAIL-CLOSED + gains the IP dimension (cost-exposure
hardening inside the commission — the token-bucket migration WRITTEN-not-
deployed); (3) the census pin backfill list.
**⬛⭐⭐ THE CALIBER SWEEP COMPLETE (2026-07-19) — all five owner-ordered
conversions landed at sample-true form.** The closer, caliber-primitives @
41c2702f: CP-a Segmented → THE DIVIDER-STRIP (sample cited to the line —
docs/samples .oc-segmented; gold btn-border hairline + dividers; active =
FILL + WEIGHT 800/600 two-channel BY CONSTRUCTION, grayscale-legible; ARIA
byte-identical; 14 importers censused — the brief's 12 was stale — 61 tests
green; foundationPrimitives needed ZERO retargets, no shape pin existed) ·
CP-b Card DE-SHADOW + THE FLAT PIN (cardElevation retargeted from the pre-law
ELEV[1] to boxShadow==='' + the hairline edge, jsdom serialization
probe-verified BEFORE writing assertions; 4 Card importers censused, none
relied on lift). Eager +0 EXACT both commits. Fold-3 ceiling deltas: radii
906→905 · shadows 98→96 (+ map's tinted 214→208 · rgba 234→232). 4 JUDGMENTs
vetoable (gold vs parchment border · 800/600 vs the sample's constant 700 ·
no Card overflow clip · transparent inactive cells). Full suite triaged to
EXACTLY: 2 declared drops + the 4 parked + load flakes + the sibling budget
red. THE SWEEP'S FIVE: strip ✓ · flat Card ✓ · stamp chips ✓ · token scrims ✓
· the perf harness ✓ — every "safe" call from the compromise audit now stands
at the objectively best form.
**⬛⭐ CALIBER MAP LANE COMPLETE (2026-07-19, claude/caliber-map @ e2b00102, 2
commits).** CM-a AdvanceReport source-stamp re-tone: the three tinted chip
washes → rule-framed stamps on the ChronicleTab three-tone register (thread
gold · decree oxblood+Landmark · crosslink sepia+GitBranch — word+glyph+tone
tellability; all tones pre-pinned AA; SLATE fully retired from the surface);
H2 slip + fire-once + receipts + handlers grep-verified byte-identical. CM-b
scrim tokenization WITH a correct doomed-literal divergence: the brief's
warmdim/ink-mix suggestion would have INVERTED the ground under dark-on-light
copy — the scrims re-grounded byte-exact on the parchment token via color-mix
instead (vetoable toward PARCH_100 alignment); the C2L unfurl seam + drag
inset untouched. Deltas for FOLD 3: tinted 214→208 · rgba 234→232; zero eager
(byte-identical verify:dist across both commits). Full suite: the 4 parked +
declared reds only after isolation-clearing a 3-sibling contention storm.
**⬛⭐ THE WELCOME SCRUB: PLAUSIBLE → CONFIRMED (2026-07-19, manager-executed
on the composite @ aad6265e).** Playwright drove a real Chromium through the
full served journey (the preview-pane scroll-hang bypassed via the perf lane's
driver): ALL SIX LEGS load in sequence · currentTime ADVANCES with scroll
within every leg (leg-1 0→0.55→3.26s · leg-3 0→1.58→4.28 · leg-6 2.55→4.99) ·
each boundary mounts the next leg at 0 · STOPS show video opacity 0 over the
crisp still (the stills-floor law live) with EDGE FADES mid-transition (op
0.13/0.61 sampled) · the journey ends FROZEN at the metropolis still. Three
screenshots delivered to the owner. The mechanics claim is now CONFIRMED;
only the human-hand FEEL (pacing taste) remains the walk's.
**⬛⭐ THE PERF HARNESS BUILT + BASELINED (2026-07-19, claude/caliber-perf @
f5e142e8, 2 commits) — the program's most-deferred item retired.** ZERO new
dependencies (JUDGMENT: reused the e2e suite's existing Playwright + Chromium
over the pre-authorized puppeteer add — the shared node_modules untouched with
six lanes live). CDP 4× CPU throttle + cache-disabled cold loads; 6 journeys ×
3 cold samples + 1 warm, median+spread; `npm run perf:throttled`; baseline
committed at scripts/perf/baselines/ (gitCommit aad6265e, chromium 148).
FIRST REAL NUMBERS (throttled): pricing LCP 676ms · create 648 · home 904 ·
library 1248 · realm 1760 · THE DOSSIER JOURNEY Ready ≈10s (generation is
CPU-bound, barely cache-movable — the empirical justification for THEATER MODE,
and a named loop-survey target for the perf dimension). FINDING (intake): no
URL-addressable deterministic demo-dossier route exists (the lf-033 fixture is
inline-only) — a ?demo= hook is the enabler if wanted, flagged not built.
Smoke rot-guard 8 tests; eslint/build green. WAVE A CLUSTER 1 (the dossier
tabs — the residual sweep's biggest block, ~190 offenders) DISPATCHES into the
freed capacity — seven lanes territory now: six live + cal-prim's suite closing.
**⬛ OWNER RULINGS ×2 (2026-07-19, "with the standard I have set, do your
recommendation for Class C"):** (1) ⭐ HOWTOUSE RESOLVED — the About/Compendium
pivot STRUCTURE stands; master's lost Philosophy + Under-the-Hood content is
RESTORED INTO it (census #1 closes; becomes Wave B item #12 — a content
re-graft into the current architecture, register-matched, nothing invented).
(2) ⭐ THE SURVEYOR GATE IS FINAL — premium-as-Surveyor is the launch
semantics; the isSurveyorTier chokepoint stands as built; the C13 finding
CLOSES (Wave B adds the one-line comment finalization: the chokepoint header's
"awaiting owner clarification" becomes "OWNER-RATIFIED FINAL 2026-07-19"); a
distinct Surveyor tier constant is post-launch work if ever. Both leave the §9
owner queue. Class C is now PURE TASTE (film set · treatment · default lens ·
glyphs · prose register — complete code in every position, awaiting the walk).
**⬛⭐⭐⭐ THE COMPOSITE IS ASSEMBLED (2026-07-19, claude/the-composite @
aad6265e — the deep-wave fold COMPLETE).** Fold 3 illustrated-town @ 857c5274:
3 conflicts resolved as pre-studied (SettlementDetail selectors moved INTO the
extracted SettlementDossierHero beside their consumer — vetoable; SettlementCard
worldState prop re-expressed in the ledger row; contrast.test pure union); one
union red (the IT3-c season select's rounded corner) cured at aad6265e per the
C5-a select precedent. THE FRESHNESS CURE @ 7009db36: edge-shared regenerated
(aiGrounding 48 inputs hash 72ab2db8…; declared cause; green RE-EARNED on the
committed bytes after the hook's fix pass) — freshness LEAVES the expected set
after weeks. THE CLOSE, QUOTED: "Test Files 4 failed | 1353 passed · Tests 4
failed | 13,606 passed | 13 skipped" — EXACTLY the 4 parked golden families,
ZERO flakes; verify:dist 153/154 (sole red = the owner-ruled budget breach,
curing in the de-eager lane); closure 1,040,998 byte-identical through folds
3–5 (the no-deepening condition held exactly). ⭐ FOUR PARALLEL LANES
DISPATCHED off aad6265e per the owner's parallel order: DE-EAGERING (Fable —
the ordered architecture; every persisted path dispositioned with round-trip
pins; acceptance = verify:dist green UNDER the untouched 1,040,000) · CALIBER-
PRIMITIVES (Segmented divider-strip + Card de-shadow/pin retarget) · CALIBER-
MAP (AdvanceReport stamp re-tone + scrim tokens; H2 fenced) · CALIBER-PERF
(the throttled-vitals harness BUILT + baseline recorded; devDep pre-authorized
dev-only). Kill-list law for the batch: no lane touches it; declared reds with
exact deltas; FOLD BATCH 3 sets ceilings to measured. Then: fold batch 3 →
budget re-tighten → THE ROUND 3 LOOP opens (standard audit first) → THE PUSH
at convergence.
**⬛ THE SECOND COMPROMISE SWEEP (2026-07-19, owner-prompted: "were there any
other compromises?").** Full-program deferral audit, three classes: ⭐ CLASS A
(scope-law refusals, orderable — now COMMITTED MANDATORY CYCLE-1 INTAKE, fixed
regardless of survey findings): the 13 unauthored lastingEffects event types ·
traditions genesis declared-over-derived consumption · the traditions manual
authoring UI · the PDF counterseal structured-path refactor (de-listed from
post-launch) · C13's deterministic-violet re-tone list (AutoSaveChip/
VersionsTab/MagicTab/RealmStrip faith/Pantheon tiers/AdminTrends/QuickInspector)
· the master "Viability →" button adjudication · WhatChangedPanel wire-or-
remove · the ?cat= compendium deep-link · folder sub-table thead a11y · the
journey_stop analytics enrichment · vendorManifestExactSet try/finally
hardening. CLASS B (stage-blocked, ceilings named in the loop's grade tables):
§16 lit-dependent traditions seams · game-feel (needs players) · soak-dependent
tuning. CLASS C (owner-owned, untouched): the taste queue · HowToUse ·
surveyor-tier semantics · the parked teaching tranche · the owner-authored
post-launch list. Meta: every item was findable because NONE was silent — the
deferral discipline held program-wide.
**⬛ OWNER ORDER (2026-07-19) — THE CALIBER SWEEP: "go back and do all of those
decisions to the objectively best architecture, quality and caliber."** The
audit's five conversions execute NOW, not at cycle 1: (1) Segmented → the
design sample's divider-strip recomposition (a11y two-channel active state
preserved by construction, not by pill); (2) Card de-shadow per "print has no
z-axis" WITH the cardElevation pin deliberately retargeted (named, justified —
the pin pinned the pre-law state); (3) AdvanceReport tinted chips → source-
stamp re-tone; (4) THE THROTTLED-PERF HARNESS BUILT (CPU-throttled TTI/INP
measurement, scripted + recorded — no longer deferrable); (5) WorldMapStage
scrims tokenized. Of the defended three: the rename is complete (nothing owed);
H3 stays spec-compliant; the zero×4 residual sweep remains loop cycle-1 work
(venue, not deferral). EXECUTION: a side-branch lane off the composite tip,
parallel with the de-eagering lane (disjoint files), both folding back before
the loop opens.
**⬛ OWNER CLARIFICATION + THE COMPROMISE AUDIT (2026-07-19):** "undelayable"
meant only that the push is NOT deferred until after the resurvey loop — never
that it outranks better architecture (the manager's over-reading produced the
re-pin recommendation, vetoed). Owner asked: were other such compromises made?
AUDIT ANSWER — five same-shape calls found, ALL recorded-not-silent, now
CONVERTED from deferrals to COMMITTED LOOP INTAKE: Segmented pill→divider-strip
recomposition · Card de-shadow + cardElevation pin retarget · AdvanceReport
tinted-chip re-tone · the throttled TTI/INP perf harness BUILD (no longer a
named deferral) · WorldMapStage scrim tokenization. Defended as correct (veto
with context): zero×4→loop (venue routing, not declination) · the partial
rename (fold-correctness, COMPLETED at fold 2) · H3 session-scoped fire-once
(the H-spec itself barred new persisted state). PRECEDENT NOTED: "safe reclaim
exhausted"-class labels are re-examined by the loop's standard audit — gated-
but-better lanes are orderable, per the de-eager ruling.
**⬛⭐⭐ OWNER RULING (2026-07-19) — "then de-eager": THE DE-EAGERING LANE IS
ORDERED; the 998-byte breach cures by ARCHITECTURE, not by re-pin.** The owner
chose the objectively-better path over the manager's bridge recommendation
(recommendation recorded, vetoed — the system working as designed) and thereby
waived the push-first sequencing: the push now fires AFTER the de-eagering
lands and verify:dist goes green UNDER the untouched 1,040,000 budget. THE
LANE (Fable, escalation clause — persistence blast radius): convert the
custom-content registry/schema out of the eager closure (sync→async persisted-
path conversion, ~41KB reclaim per the gated memory); EVERY read path
dispositioned — slice add/update dispatch · AI accept→mint · store hydration
from persisted saves · canonize · import/export · the server twin's
vocab.buckets wall (must not desync) · gen:compendium-data · the
TRADITION_*_KEYS drift-guard architecture (survives or re-homes, never
silently dropped); dormancy goldens byte-identical; generation same-seed
untouched (validation is write-side — verify, don't assume). AFTER LANDING:
the manager RE-TIGHTENS the budget to the new measured floor (deliberate
shrink, declared). Dispatch waits on the assembly's fold-3+cure completion
(same worktree). Sequence: assembly close → de-eager lane → re-tighten →
THE PUSH → walk → THE LOOP.
**⬛⭐⭐ THE COMPOSITE ASSEMBLY — folds 1–2 VERIFIED, STOPPED-BY-CONSTITUTION at
b4e0f017 (2026-07-19); ⛔ THE 998-BYTE BUDGET DECISION QUEUED (blocks the
push).** Step 0: R2-i swept into deep-craft @ 7fe77a85 (NUL-clean incl.
escape-spelling scan; the parked generator golden's key set proven UNCHANGED by
temp-worktree basecheck — 187/187 drifted before AND after; content extension
rides inside, not re-recorded). Fold 1 deep-craft @ f8593514: ancestor merge,
zero conflicts, 287 files; suite EXACTLY the expected 5, zero flakes. Fold 2
traditions @ 6f5d29ae + b4e0f017: 3 conflicts resolved both-intents (the
designed tab seam WIRED — NPC-first order kept, single entry, seam comment
updated · RealmStrip SLATE_DEEP + almanac · SettlementPDF both consts + 07B
chapter); 2 union reds cured (TraditionsTab → flat plates, kill-list 906/214;
walker census 486→485, the motif stamp's redundant tooltip struck); suite at
the stop-point 13,476 green / EXACTLY the expected 5, zero flakes. ⛔ THE
BREACH: 1,040,998 vs 1,040,000 — probe forensics DISPROVED the lazy-leak
hypothesis (TraditionsTab/almanac/pulseKernel/prose all 0-byte innocent); the
998 = honest registration (schema+keys ≈793 engine-core; slice/vocab/
registration ≈375 index); each lane green alone, the sum breaches; the only
reduction = the OWNER-GATED de-eagering. Budget test UNTOUCHED; memory
composite-budget-breach-998b.md. QUEUED §9 with the manager recommendation:
re-pin AT the measured 1,040,998 (zero-slack raise). MEANWHILE fold 3 +
freshness cure PROCEED (zero-eager proven, independent of the budget) so the
composite is one owner signature from push.
**⬛⭐⭐ FOLD BATCH 2 COMPLETE (2026-07-19, deep-craft @ 76cccbf2 — Fable, six
folds + the rename completion).** Per-fold NUL-clean; conflicts = only the two
pre-identified (CustomContent leaf: the branch's consolidation TAKEN with
HEAD's C13-b slate hex carried into the leaf — a silent violet resurrection
prevented; CampaignFolder PROSE_MAX: union via the sibling UnassignedLedger
idiom). Ceiling reconciliations measured per fold: FINAL FOUR = radii 906 ·
shadows 98 · rgba 234 · tinted 214; rawColor 1403 (adversarially exact-pinned).
THE RENAME COMPLETION (76cccbf2, 45 files): theme/tokens exports
VIOLET*→SLATE* with NO aliases; retired swatch keys → honest slate hex across
ALL 19 call sites (the brief's parenthetical undercounted — 14 files);
tintedCallouts pattern drops VIOLET_BG, count law intact at 214; TINT_VIOLET
stat-tile pair correctly excluded (genuinely violet, different register).
EAGER TO THE BYTE: 1,039,830 / 1,040,000 (c16's +199 exact; rename −6;
headroom 170 B). Final suite: 13,326 green / EXACTLY the 5 parked. ⚠ CAUGHT:
the owner's chip session landed R2-i @ 27eae9e9 (noble→government bucket,
census #22 follow-up, declared golden extension 155/187) on restoration-chrome
AFTER the fold took aaeec163 — R2-i rides the composite assembly.
**⬛ JUDGMENT (manager, vetoable) — PHASE D DISPOSITION:** items 2/6/8 CLOSED
(census · eager report byte-exact · restoration ledger zero-PENDING); item 1's
literal ZERO×4 TRANSFERS INTO THE ROUND 3 LOOP (the burn-down proved the
residual is a ~250-file multi-wave program; the loop's A+ convergence + the
shrink-only ratchets carry it; the owner's loop ruling supersedes the original
sequencing); items 3/4/5 (contrast walk · seam walk · throttled perf) ride the
loop's cycle-1 survey + the owner walk; the perf e2e harness stays a named
deferral. Say "veto" to force the residual sweep BEFORE the composite instead.
⭐ THE COMPOSITE ASSEMBLY DISPATCHES (Fable): R2-i → deep-craft, then
deep-craft + traditions @ 80b8ad71 + illustrated-town @ d16d348e →
claude/the-composite, WITH the aiGrounding freshness CURE (build:edge-shared,
declared) — expected end-state suite: EXACTLY THE 4 PARKED GOLDEN FAMILIES.
Then THE PUSH (hard, undelayable) → the walk → THE LOOP.
**⬛⭐⭐ OWNER RULING (2026-07-19 morning) — THE ROUND 3 LOOP (supersedes the
single-pass ROUND 3):** verbatim intent recorded in THE_REMAINING_ARCHITECTURE
§4 (rewritten this date). The shape: after THE COMPOSITE assembles, run
complete-resurvey → adversarially-verified fixes in REPEATED CYCLES until
materially no fixes remain and every achievable dimension grades A+ — never
stopping to wait for a push; the owner walk runs alongside non-blocking; owner
gates survive every cycle; unreachable-at-this-stage A+ ceilings are named,
never silently regraded. MANAGER'S RECORDED ASSUMPTIONS (each vetoable): (1)
taste/owner-queue items stay OUT of the loop's fix authority (they await the
walk); (2) A+ grading uses the established standards (A_PLUS_ROADMAP + the
depth standard's five columns + THE EIGHT CROWNS); (3) the loop works within
dormancy discipline — golden regens remain pre-signed at THE ONE REGEN only.
Convergence = one clean cycle + one confirming cycle, both zero must-fix and
zero achievable grade gaps.
**⬛⭐ THE BURN-DOWN COMPLETE (2026-07-19, deep-craft @ 78f51611, 7 commits).**
THE FINAL FOUR: borderRadius 1043→982 · boxShadow 112→108 · rgba 264→260 ·
tinted 235→232 (every drop same-commit, tolerance-0) + rawColor BUDGET locked
at the 1443 measured floor (zero slack — fold-2 re-triages if incoming
branches add literals). C5-a complete across all six realm surfaces (rail/
inspector/layers/pulse/report/stage → flat plates + ClerkNotes; H2 beats
PRESERVED with grep evidence — PlacementsLayer never touched) · C3-e chips
flat · residual demo (InstitutionalGrid −14). THE RENAME: partial by PROOF —
9 local-const leaf files renamed (kill-list pattern gained SLATE_BG, count
preserved); the remainder (6 off-limits files · theme/tokens exports · swatch
keys · pattern cleanup) is BLOCKED by unfolded branches and lands as FOLD
BATCH 2's closing sweep (recipe ledgered in the lane report); rename eager
delta 0 BY CONSTRUCTION (PLAUSIBLE — confirmed at the fold's measurement).
REMAINING-OFFENDER MAP delivered: 857 clear radii across ~250 files (top
targets named — EconomicsTab 35, LandingBelowFold, SummaryTab 27…) + 41
off-limits files quarantined for their folds — the residual walk to literal
0×4 is a MULTI-WAVE program handed to Phase D sequencing, not a residual
pass. Full suite EXACTLY the 5, zero timeouts. ⭐ FOLD BATCH 2 DISPATCHES
(Fable): six branches in order pages → resto2 → resto3 → c14c15 → c16 →
resto1, ceilings set to measured counts per fold, pre-ruled reconciliations
(TableView=lamp tones · CampaignFolder=union · App.jsx regions), the rename
COMPLETION as the batch's final commit, eager re-measured (+199 c16 signed).
**⬛⭐ RESTORATION SWEEP 3 COMPLETE (2026-07-19, claude/restoration-compendium @
f9b07930, 8 commits) — WITH THIS, 22 OF THE CENSUS'S 23 OWED ROWS ARE CLOSED
(#1 HowToUse = the owner's direction call).** #9 CompendiumPanel identity +
ARIA tablist + mobile paths · #10 GalleryPage shared identity (GalleryList's
duplicate header removed — the lift's other half, JUDGMENT) · #11 CatalogTabs
hierarchy + dead-first-click + honest guards + gold-as-text AA · #12
CustomContent authoring affordances (org only, colors untouched; the two
orphaned W-C4 leaves REVIVED to fit the 600 ratchet) · #13 GalleryDetail
deferral + forge CTA — realmArcSummary VERDICT: RELOCATED to the Campaigns tab
(producer chain alive), correctly NOT restored · #14 GallerySidebar BottomSheet
+ chip a11y · #8 criminal_network restored + palette re-pointed at relColor
(the false removal-comment corrected; war_front deliberately kept #b91c1c —
the regional-agreement pin requires it) · #17 CampaignFolder minors,
FOLD-FLAGGED vs C3's edits (independent JSX regions, manual union expected
clean). 7 new pin files/suites. Kill-list DECREASED to 980/103/239/217
(declared red, counts only down). 5 non-lane reds proven pre-existing at base
via temp worktree. Deferrals: peak-end forge CTA · ?cat= deep-link · #17
bespoke pin — all reasoned. FOLD-READY. Only THE BURN-DOWN remains before
FOLD BATCH 2 (actively progressing: partial rename on leaf files landed).
**⬛⭐ RESTORATION SWEEP 2 COMPLETE (2026-07-19, claude/restoration-chrome @
aaeec163, 8 commits).** All of census #4–7, #15–16, #22–23 restored, grafted
onto the pages materials (never wholesale-reverted). WIP VERDICT: the dead
agent's PrivacySettings diff was COHERENT-PARTIAL — COMPLETED per its own note
(consent default untouched, owner policy). Highlights: #16 THE ANON BUY-WALL
BUG FIXED with the mandatory routing pin (gold signup ⇒ setAuthModalOpen,
NEVER the purchase modal) — required the store-lift + operationRegistry
registration + EXEMPT_CEILING 69→70 + the compendium-data regen (⭐ NEW HAZARD
memory'd: store actions have a DERIVED lifecycle path through the public
Compendium artifact; compendiumDataFreshness catches skips) · #15 seat meter +
checkout retry (square-cut, rgba-neutral via GOLD_WASH DRY) · #7 the way back
(wordmark home link, Page frame, 44px, BORDER_STRONG) · #6 the free-tier
upgrade CTA + P8 two-primary demotion · #22 lastingEffects to master's 16
templates — DECLARED same-seed generator shift (all four parked goldens
confirmed red at base, none re-recorded) · #23 all SIX cross-tier splits
normalized (census said 4; the ported true-zero guard requires 6) + master's
guard test live again. Kill-list held 981/103/243/217 (declared branch red,
counts only down). Deferrals: the noble-bucket restructure (chip task_7308e7ad)
· 13 current-authored event types have no master lastingEffects (content
invention ≠ restoration). Full suite 13,219 / EXACTLY the 7 expected on this
lineage. FOLD-READY. Burn-down nudged (rename + final-four still owed).
**⬛⭐ RESTORATION SWEEP 1 COMPLETE (2026-07-19, claude/restoration-pdf @
2e4f3282, 4 commits).** All of census §1 #18–21 restored: R1-a #20 causal-detail
threading (inherited, re-verified) · cd4b7f40 R1-b #21 viewModel (entity-anchor
ids · lineage · magicProfile · the shared collectPlotHooks aggregator; every
program addition kept — pdf-3 byDesignContradictions untouched) · 29d60afd R1-c
#18+#19 (RULE & SUCCESSION + OCCUPIED banner + PartyRef anchors; MAGIC LEGALITY
gated liveWorld&&exists) · 2e4f3282 R1-d control-byte corruption fix (the F24
class, caught by controlBytes.test + byte-scan). WIP VERDICT: the dead agent's
inline WIP breached the viewModel ceiling by 24 lines — REVERTED that one file,
REDONE cleanly. ⭐ THE CEILING OUTCOME BEAT THE PLAN: no leaf needed — the
collectPlotHooks restoration is a net reduction; viewModel lands at 1002
effective (master's own structure ≈1000) and the size baseline RATCHETS DOWN
1043→1002. TWO CENSUS CLAIMS CORRECTED on inspection: relationshipsHeadline
never existed (the real work = neighbour anchor ids); the goldenViewModel
diff is NOT extended (it snapshots the canon deriveDossierViewModel, not
buildViewModel) — nothing re-recorded, the parked diff stays defense 63→65 +
institutions 54→55. 14 new element-tree pins. Full suite EXACTLY the 5 after
isolation-clearing 7 contention flakes. Zero deferrals. FOLD-READY.
**⚠ SESSION-LIMIT STRIKE + RELAUNCH (2026-07-19 ~04:50 EDT).** All four running
lanes (burn-down · resto1 · resto2 · resto3) terminated early on the API session
limit (reset 04:50). Damage: burn-down + resto3 died CLEAN (no commits/WIP lost);
resto1 had landed R1-a (#20 causal-detail @ 8c387e30) with uncommitted viewModel
WIP (mid-#21 magicProfile); resto2 had landed R2-a (#2+#3 admin chrome @
e7234e93) with uncommitted PrivacySettings WIP (mid-#4 bare-prop). RECOVERY per
the hazard protocol: four FRESH agents relaunched into the SAME worktrees at
05:02 — dirty-file law: read the full diff, complete-if-coherent else revert
that one file and redo; never stash, discard nothing else. A surviving recon
subagent's idiom map (clerk-note/plate/rubric-token/rename-mechanism digest)
was forwarded into the burn-down relaunch to skip re-recon. Four queued
heartbeats coalesced into the relaunch action.
**⬛⭐ C14+C15 COMPLETE (2026-07-19, claude/deep-craft-c14c15 @ 7748d49a, 3
commits, NOT folded).** 68434851 THE LANTERN TABLE: four lamp tones on umber
(moss 6.29 · gold 7.05 · slate 6.28 · ember 5.12 — all AA on the panel AND the
darker desk; 4 pins + a negative control documenting the retired amber's
failure) in a NEW lazy token module lampTones.js (single source; TableView now
DECOUPLED from the shared violet/slate tokens — fold rule: TableView's accent
block resolves to the lamp tones over c13's line) · wake-lock untouched
(effects outside every edit range, pins green) · 5eea9a3d THE DISPATCH DESK
(parcel rows, ONE gold dispatch, quiet toggles) · 7748d49a H3 (seal meets
medallion at the dossier foot; fire-once via CSS animation-fill 'both'
once-per-mount JUDGMENT — no persisted state; HouseColophon `ceremony` prop
default FALSE = byte-identical elsewhere; counterseal seam intact). ⚠ SPEC
CORRECTION ledgered: the playbook's `.oc-m-seal-impress`/`.oc-m-medallion-pulse`
NEVER EXISTED — the closed vocabulary spells them oc-m-impress/oc-m-inkpulse;
doc fixed. Ratchet-neutral by choice (one available rgba win handed to the
seat-holder via fold-2 notes). Full suite 13,198 / the 5 + pre-C3-e fixture red
(base predates the cure) + 2 isolation-cleared flakes; eager 0. RESTORATION
SWEEP 3 dispatches (compendium/gallery cluster, sibling of sweep 2 on the pages
lineage — disjoint files; CampaignFolder edits fold-flagged vs C3's).
**⬛⭐⭐ FOLD BATCH 1 COMPLETE (2026-07-19, deep-craft @ aa55836a — the FABLE
reconciler, flawless).** Three folds, ZERO conflicts, every pre-ruled
reconciliation held EMPIRICALLY: 3430815c FOLD c2 (the whole journey-legs film
system incl. c2l; 18 blobs NUL-clean; organicSamples verified GREEN post-fold —
no reintroduced drift; 9 non-golden reds all isolation-cleared at machine load
634) · 12c3120f FOLD c13 (slate chokepoint + door; tokens/theme = c13 wholesale
by clean auto-merge; StaleNarrativeModal gold survives; en.js 20 new keys, no
collisions; index.css both appends verified against both parents) · aa55836a
FOLD c5 (H2 beats; zero overlap). EAGER BYTE-EXACT: pre-fold 1,038,886 → c2 +0
→ c13 +49 (EXACTLY as pre-signed, all in the index chunk) → c5 +0 = 1,038,935;
margin 1,065 B. Suites: fold-2 and fold-3 + the final confirmation each closed
at EXACTLY the 5 parked goldens (13,279 green; totals grew fold-over-fold as
branch tests registered). Folded branches ancestor-verified and cleaned up
(worktrees + branches removed). THE BURN-DOWN LANE dispatches into the freed
worktree with the ceiling seat + the now-unblocked identifier rename.
**⬛⭐ C16 THE SHELL COMPLETE (2026-07-19, claude/deep-craft-c16 @ 41ae4a1e, 4
commits, NOT folded).** Modals→plates over warm-dim (machinery byte-identical) ·
toasts→desk-edge slips (centering moved off transform to free it for the slip —
position unchanged) · nav→small-cap stations (App.jsx NET-ZERO at its 732
ceiling — one value-swap line) · chassis→the oc instrument base face
(consumer census: Button 189 files · IconButton 49 · Segmented 12 · Card 3;
count-neutral value-swap technique; contrast pinned; mobileTapFloor green).
MANAGER SIGN-OFF (vetoable): +199 B eager measured per-commit (+5 nav string,
+194 primitive className/token strings — unavoidable in eager primitives;
headroom ~989 B). JUDGMENTs vetoable: primary/aiSolid shadows flattened
("print has no z-axis") · secondary/default faces white→parchment instrument
(the highest-blast-radius call) · Segmented pill kept (strip = recomposition,
deferred). Deferrals: Card de-shadow (blocked by the cardElevation ELEV[1]
pin — burn-down + pin-owner) · kill-list would-be deletions (Dialog −2 radii
−1 shadow, Toast −1 shadow) · raw-color BUDGET lowering. NEW GOTCHA re-proven:
the kill-list greps COMMENT text (a comment containing "boxShadow" tripped the
ceiling — reworded inline). Full suite 13,210 / the 5 + the pre-C3-e-base
fixture red (cured at fold); final committed-HEAD gate 124/124.
**⬛⭐⭐ THE PHASE-D CENSUS COMPLETE (2026-07-19, committed
docs/PHASE_D_RESTORATION_CENSUS_2026-07-19.md @ b6320795).** ALL 150 PENDING
restoration rows dispositioned, ZERO unclassified: 23 GENUINELY-OWED (the
census §1 list — PDF cluster #18–21 the heaviest, CustomContent #12, pricing
conversion affordances #15–16 incl. the anon-sign-in-lands-in-buy-wall
regression) · 4 OWNER FLAGS (§2: backend-gated profile RPCs + visibility
defaults · research-consent posture · AdminPanel user table = SECURITY FIX
KEEP) · 11 deletions adjudicated (§3; CausalNarrativeTable M→D mislabel
found) · ~123 safely closable (superseded/program-ruled/matches-master).
Topology confirmed: ZERO PENDING rows were restored by slices (the slices'
restoration work was the already-RESTORED create-page rows). Passing
correctness flags → ROUND 3 pre-stock. DISPATCHED: the ledger TRANSCRIPTION
agent (main tree, single-writer window) + RESTORATION SWEEP lane 1 (the PDF
cluster #18–21 off 97aa4f3d; viewModel at its 1043 ceiling — leaf/net-zero
law; shifts declared at the parked golden).
**⬛⭐ C6–C12 THE PAGES COMPLETE (2026-07-19, claude/deep-craft-pages @ 55e4a69c,
7 lettered commits P-a..P-g, NOT folded).** Pricing bench (differentiated
top-rules, daggers, gold stamp) · Compendium lexicon (shared Tag/Card engine
de-round, hairline plates) · Gallery specimen drawers (inkdarken hover, clerk's
report form) · Founders CHARTER (rule-framed; the struck-tally board DECLINED —
the page is a deliberate NAMED lineage "portal of proof", JUDGMENT) · Auth
restraint (ruled slips, rubric notes, same strings/flows) · Checkout receipt
artifact + colophon · Account danger zone rubric-ruled (typed-confirmation
delete byte-identical, pins green). C9 PAID-SURFACE PROOF: FoundersPage owns no
checkout/seat-write; FounderTile untouched entirely; 66 founder tests green.
121 OFFENDERS REMOVED (−71 radii/−10 shadows/−22 rgba/−18 tinted; branch counts
983/103/243/217). ⚠ MANAGER'S BRIEF CONTRADICTION OWNED: "remove offenders but
don't move ceilings" under tolerance-0 = the 4 kill-list sub-reds the branch
now carries BY DESIGN — RESOLUTION PRE-RULED: fold batch 2 sets each ceiling to
the measured post-merge count in the fold operation (shrink-only, deliberate);
the branch's organicSamples red is the pre-C3-e base state, cured at fold. 2
contrast JUDGMENTs (white-on-gold → ink-on-gold 7.6:1, vetoable). C13-overlap
discipline held (AI-violet left untouched on shared files; deferral list
ledgered). Deferrals: account sections beyond the danger zone · gallery
detail/tabs/hubs · compendium write register + dropcap host — all legal Phase-D
census reason-rows. Full suite 13,205 / expected-5 + the 4 by-design + the
pre-base fixture + 1 isolation-cleared flake. THE PHASE-D CENSUS AGENT
dispatches into the freed slot (read-only disposition sweep of the restoration
ledger's PENDING rows — de-serializing the Phase-D gate's biggest grind).
**⬛⭐ C3 THE LIBRARY LEDGER COMPLETE (2026-07-19, deep-craft @ 97aa4f3d, 5
commits incl. both addenda).** d06f4a89 the list becomes a REAL semantic table
(SettlementCard → <tr>, one renderer — JUDGMENT over a div idiom; both call
sites wrapped; UnassignedLedger extracted as a leaf because SettlementsPanel
sits at its 600 ceiling) · 680d3138 memo-lines (the OutputContainer stressor
derivation, read-only) + interpunct + margin tallies (same checkbox, same
handlers) · a6255918 THE OWED WIRING: allowRename live via the canonical
renameSettlement store writer (NOT the live-editor queueEdit — reconciliation
reasoned) + the LIFECYCLE TRAP traced and closed: renameDetailSettlement pure
helper syncs the detail view (name would ghost until re-open otherwise;
7-case unit pin) · ecfe0d1a addendum 1: the config-panel de-round (9 pills,
ceiling 1052→1043 by the test's own counter) · 97aa4f3d addendum 2: the
organicSamples fixture regen — cause confirmed C4c-g, diff verified +180/-0
all `.oc-dropcap-prose` surface; THE LINEAGE RED IS CURED. Protected-behavior
census 52/52 green across 6 suites. Kill-list now radius 1043 · shadow 112 ·
rgba 264 · tinted 235. Full suite 13,217 / EXACTLY the expected 5 + 1
isolation-cleared flake. 6 JUDGMENTs vetoable (incl. allowRename gated on
readOnly&&saveId any-owner — replaces the old free-tier Edit-Names path).
Deferrals: retained sub-content chips' radii (burn-down's) · folder sub-table
thead a11y trade. ⭐ THE FOLD BATCH 1 DISPATCHES (Fable, escalation clause):
c2 (contains c2l) → c13 → c5 fold into deep-craft @ 97aa4f3d — per-fold NUL
scan, --no-ff, bare gates, FULL suite, reconciliation rules pre-stated
(tokens.js = c13's chokepoint wins · StaleNarrativeModal = the gold re-tone
wins · css/copy appends union). THE BURN-DOWN lane follows on the merged tip
with the seat + the now-unblocked identifier rename.
**⬛⭐ C5 THE REALM LANDED (2026-07-19, claude/deep-craft-c5 @ 329bde0b, 3
commits, NOT folded) — H2 + the re-home shipped; the materials pass DEFERRED
with the ceiling-seat reason.** 5ca47081 InstantWorldEntry RE-HOMED (the
UNREACHABLE premium composer now mounts lazy in SettlementPalette's desktop
empty state — subordinate placement JUDGMENT over map-overlay/CampaignEmptyState
alternatives; reachability proven by emitted lazy chunk + binding + host pins;
zero eager). · 4cb025ba + 329bde0b H2 THE FIRST ADVANCE: three beats (medallion
ink-pulse touched-set stagger ≤8 · almanac page-turn · report slip), fire-once
read-side off the EXISTING pulseHistory counter — no new persisted state;
`.oc-m-*` only; reduced-motion collapses; regression guard 3/3. Fence census
clean: desktop-gate title untouched · title ratchet 485 green · SM-5 pins live
in townMap not realm chrome · WorldMapStage untouched (C2L moot). Known
limitation documented: catch-up in living worlds may claim the first pulse
("the map marks the first change of the session" — acceptable). C5-a chrome
materials DEFERRED (JUDGMENT, vetoable): exact-equality kill-list + the C3
single-writer seat make any de-round land red from this lane; the rail's core
intent (ADVANCE = the one gold) already holds; per-file offender table recorded
(41 radii · 5 shadows · 7 rgba · 13 tinted across 6 realm files). ⚠ FINDING:
organicSamples.test.js red on the whole lineage — dossier-desk.html fixture
stale vs C4c-g's .oc-dropcap-prose (the focused-gates blind spot, again) —
HANDED to C3 as addendum #2 (deliberate regen, declared cause). ⭐ MANAGER PLAN:
after C3 lands, THE BURN-DOWN LANE dispatches on the deep-craft branch holding
the ceiling seat — C5-a realm materials + the accumulated would-be wins + the
C13 identifier rename + the walk toward Phase D's kill-list ZERO×4. Full suite
13,207 / expected-5 + 2 isolation-cleared flakes + the handed-off fixture red.
**⬛ C1-FIN REMAINDER: STALE-BRIEF STOP (2026-07-19) — the manager's brief was
WRONG and the lane caught it.** Items 1/2/4 (create consolidation + unfold leaf ·
wizard tint trio · evolution backdrops) were ALREADY SHIPPED on this lineage as
C1r-c1 5e7cbdf4 / C1r-c2 4075b499 / C1r-c3 01ad3a8f + C1r-d 88348274 — the
manager scoped from a stale memory line instead of the lineage git log; the lane
STOP-AND-REPORTED with receipts, wrote zero code, left the tree clean (the
VERIFY-FIRST discipline working exactly as designed; memory
c1fin-remainder-brief-stale.md records it). The ONE genuine remainder — the
config-panel de-round (TradeDynamics −5 pills · ServicesToggle −4 ·
LayeredConfigurationPanel net-neutral plate chrome) — is blocked by the
kill-list single-writer seat and is HANDED TO C3 as a scope addendum (ceiling
drop ~1054→1045 in the same commit, lane-verified count). The empty
c1fin worktree/branch removed (zero commits, rev-parse-verified). SLICE C1-FIN
IS THEREBY COMPLETE except the addendum riding C3. C14+C15 dispatch.
**⬛⭐ C2 THE WELCOME FILM COMPLETE (2026-07-19, claude/deep-craft-c2 @ 34f4e554,
3 commits stacked on the C2L tip, NOT folded).** 3d82a444 C2-a scroll conductor:
shared-core EXTRACTION (projectLegFrame consumed by BOTH the clock and scroll
drivers — extended, never forked; dependency-free rAF, redundant-frame 0.008
guards; library rejection recorded). · 46ef7167 C2-b sections re-vehicled: 7
current sections → 6 stops (commons shares the city stop), retention pin
homeLanding.test.jsx GREEN UNTOUCHED; analytics = exactly 2 pre-existing
LANDING_FUNNEL_USED firings, preserved by name, zero new eager names. ·
34f4e554 C2-c floor proofs + zero-eager ratchet. LAWS: stills floor CONFIRMED at
test level AND live (flag-off ⇒ videoCount 0, zero mp4 fetches; fixed-backdrop
stacking risk cleared); eager delta 0 B (fingerprint absent from the entry
closure, verify:dist 154); per-leg prefetch inherited; desktop-fine-pointer +
taste-gate welcomeJourneyFilm (+ shared set toggle). JUDGMENT (vetoable at the
walk): LEG-SPACER architecture — sections keep their painted backgrounds, the
film shows through transparent travel legs (retention-maximal); the full-bleed
glass-sections alternative is the recorded veto direction. Deferrals →
walk/queue: section-background harmonization (§04 city art vs town stop) ·
journey_stop analytics enrichment · the visual scrub is PLAUSIBLE pending the
owner's manual walk (recipe in the lane report; the browser pane hangs on
programmatic scroll of this app — environment limit, reproduced on unmodified
base). Full suite 13,245 / EXACTLY the 5 + 1 isolation-cleared flake (its
isolated runtime 31.6s exceeds the 20s cap under 3-lane load). C1-FIN REMAINDER
dispatches.
**⬛⭐⭐ C13 THE ONE DOOR COMPLETE (2026-07-19, claude/deep-craft-c13 @ 4ccb2766,
FABLE lane, 3 commits, NOT folded).** 7a2e0c14 the door+router: entry census
found exactly 2 non-carve-out entries (analyst launcher, workshop compass) —
both RETIRED into the single left-edge slate tab; promptless register links keep
open-without-a-prompt; Polish/Narrate carve-out verified untouched. Router =
pure zero-cost client fore-stage of the S3 compiler (domain/intent/doorRouter;
context-first as the default ring; rejected alternatives ledgered: edge
round-trip routing = credits for routing; door slice = breaks the floating-widget
idiom; panel merge = machinery churn). · c2289e10 THE SLATE CONVERSION by
VALUE-REPOINT at the tokens chokepoint (the kill-list pins the VIOLET_BG line
count, making a rename gate-illegal from that lane — identifier rename DEFERRED
to the kill-list burn-down, mechanism documented in tokens.js): 34 consumer
files atomically slate; contrast math executed (5.27/6.40/4.84 AA); 3 pinning
suites pass UNMODIFIED; adjacent purple families (deity/magic/swatch.ai/print)
correctly NOT swept; the StaleNarrativeModal exclusion honored. · 4ccb2766
slips/stamps/correspondence: "PROPOSED — the engine writes canon" verbatim on
all 5 proposal surfaces; canon-writing accepts = gold STAMP, spend stays slate
(JUDGMENT: spending is the AI act, stamping the canon act). ⚠⭐ OWNER FINDING
(queued §9): NO Surveyor tier constant exists in the ladder — TIER_GATE is
anon|free|premium and pricingDisplay says Surveyor "is NOT a subscription
tier"; the door gates on the isSurveyorTier(tier)==='premium' chokepoint
(one-line flip when the owner clarifies "surveyor premium"); recorded tension:
free users lose all in-app AI entry per the no-lock-tease ruling. MANAGER
SIGN-OFF (vetoable): +49 B eager measured (door anchor + slate pair; headroom
now 1,176 B — the 1,412 figure was stale; lineage closure 1,038,824/1,040,000).
2 pin retargets named (lazy-chain strengthened; launcher-click → controlled
open). NEW HAZARD memory'd: the kill-list counts raw line matches INCLUDING
COMMENTS. Full suite 13,185 / EXACTLY the 5. Deferrals: identifier rename ·
per-surface deterministic-violet re-toning (C14 owns KIND_ACCENT.TWIST) ·
browser walk at the fold. C6–C12 pages lane dispatches.
**⬛⭐⭐ THE TRADITIONS LANE COMPLETE (2026-07-19, claude/traditions @ 80b8ad71) —
T-1..T-5 ALL LANDED, DARK.** T-5's four commits: 396f500f register glyphs (corpus
`glyph` display-only — mint byte-identical) + mutationLog provenance line + the
self-hiding realm almanac (no engine import) · fddb8423 prose pools (own FNV
picker — keeps eventProse's ~560 lines OUT of dossier/PDF chunks, vetoable dup) +
tension-category tradition hooks (source:'Traditions'; dedicated category needs a
token path — vetoable) + PDF 07B mirror-only section (BYTE-IDENTICAL while dark;
goldenViewModel's only diff verified base-red institutions 54→55; NO golden
re-recorded; becomes additive at the regen — declared) · 2db3f8b7 custom_content
'traditions' bucket + validator + AI seam + MIGRATION 155 WRITTEN-NOT-DEPLOYED
(049 template; head gate green, PENDING non-fatal) · 80b8a71→80b8ad71 lane-end
ratchet reconciliation. Full suite 13,143 / EXACTLY the expected 5; ~16 pglite
setup-timeout flakes isolation-cleared. TASTE VETOABLES: the 16 motif glyphs +
the prose register (walk samples); PDF uses text motif labels (react-pdf fonts
lack the dingbats — tofu). OPEN SEAMS recorded (memory
traditions-lane-complete.md): genesis declared-over-derived consumption · manual
authoring UI for the bucket · faction.power routing at the folds. Shared-file
fold flags: ARCHITECTURE.md + DEPLOY.md migration-head lines. THE LANE IS
FOLD-READY; traditionsEnabled joins the regen's eight flags. C5 dispatches.
**⬛⭐ SLICE C4 COMPLETE (2026-07-19, deep-craft @ b6c91dbe) — the dossier is
DONE: base (panels A–D) + craft (6 registers) + grammar + tint pins.** 6040919d
C4c-g manuscript grammar: 2-line illuminated initials via new `.oc-dropcap-prose`
(root-ink-ramp, initial-letter + float fallback, ≤520px degrade) on the Overview
arrival band (light gold on umber) + the DM Summary lede (dark on parchment);
Plot Hooks DECLINED — it is a data register, the law bars grammar there;
MARGINALIA DECLINED on all three (no re-vehiclable annotation exists without
inventing chrome — drop caps alone satisfy the grammar). · b6c91dbe C4c-h
ServicesTab state tints re-grounded to warm parchment (rose/amber/gold-parchment
+ warm healthy; the one cool-mint off-palette tone eliminated) with 5 NEW
per-state contrast pins (8.3/7.3/5.6/5.9:1, color never the sole channel).
JUDGMENTs vetoable: 2-line initial size · two ground tones · state-leaning
washes kept for scanning. Kill-list unchanged 1054/113/265/235 (tolerance-0
re-proven at tip); eager 0 (36 CSS lines on organic.css). Focused gates green
both commits; full suite deliberately not re-run (surfaces-bounded per brief;
next full pass at the fold). Slice C4 deferral set CLOSED-with-reasons; the
config-side panels remain the C1-fin remainder's. C3 DISPATCHES into the freed
worktree (incl. the Panel-A allowRename CALLER WIRING owed to C3).
**⬛⭐ C2L THE LOADING JOURNEYS LANDED (2026-07-19, claude/deep-craft-c2l @
a8b5d313, 3 commits, NOT folded).** eedb67bf generation film = PipelineReveal's
z0 backdrop (THEATER-ONCE stands; store-key pins untouched; reveal timing
untouched) · fbfa3c0b realm/FMG reality-mode unfurl in WorldMapStage (WorldMap
is a 600-cap hot file — mount JUDGMENT) · a8b5d313 shared-clamp ratchet fix.
ONE conductor (useJourneyConductor: pure computeJourneyFrame + the arrival
gate); THE UNIFYING LAW unit-tested ("CANNOT finish no matter how much
wall-clock passes"). JUDGMENTs (vetoable): generation arrived=!!settlement
(pure theater — the artifact exists at mount; reality machinery ships on the
realm surface where it's native, holdBoundary 0.9) · taste-gate loadingJourneyFilm
default OFF (stills-floor ships; the walk flips ?flag.loadingJourneyFilm=true;
loadingJourneySetBg toggles bg↔journey sets live). Media: BOTH sets copied to
public/media/journey-legs/ (bg 43 MB · journey 11 MB; losing set DELETED at the
walk — recorded owner call). Stills floor proven (film-absent + video-error
renders); per-leg prefetch (hidden preload of leg N+1); eager delta 0 B
EMPIRICALLY (new loadingJourneyLazy fingerprint test, non-vacuous). Full suite
13,187 / expected-5 + 2 isolation-cleared flakes (49/49). ⚠ FINDING: NO realm
scroll-unfurl master EXISTS in the archive (the playbook's assumption was
wrong) — C2L-b ships the machine + parchment floor + a documented <video>
drop-in seam (public/media/realm-unfurl/); producing/choosing the unfurl film
JOINS THE OWNER QUEUE (walk item). MEMORY.md near its read cap (~20.3 KB) —
consolidation pass queued for a quiet moment. C2 dispatches STACKED on the C2L
tip (claude/deep-craft-c2 off a8b5d313) to REUSE the conductor + media.
**⬛⭐ C4 CRAFT STEP-3 MAIN PASS LANDED (2026-07-19, deep-craft @ 409a326f, 6
commits).** Six dossier panels → their registers, each a lettered commit with
gates green + ceilings lowered in lockstep: C4c-a ChronicleTab=ANNALS · C4c-b
DeityAssignmentPanel=VOTIVE (violet accent → RUBRIC gold, vetoable) · C4c-c
CascadePreviewPanel=PREVIEW PLATE (five tints → two-tone rubric, vetoable) ·
C4c-d WhatChangedPanel=ERRATUM SLIP · C4c-e ServicesTab=POSTED BILL (radii −14)
· C4c-f StaleNarrativeModal=INSTRUMENT PLATE (regenerate primary re-toned gold —
deterministic regen, not AI authorship; C13 lane instructed to EXCLUDE it from
the slate sweep; fold reconciles). Cumulative burn: radii 1077→1054 · shadows
115→113 · rgba 270→265 · tinted 246→235 (tolerance-0 held). Zero eager; zero
new contrast pins needed (pinned ink/rubric tones on parchment grounds only).
Full suite 13,188 / expected-5 + 3 isolation-cleared flakes (39/39). MANAGER
RULINGS on the lane's asks: (1) Trade/Config/ServicesToggle panels (all inside
LayeredConfigurationPanel) → DEFERRED to a C1-FIN REMAINDER slice (C1 territory;
queued, not grazed); (2) ServicesTab state-tint re-tone + its per-state contrast
pins → rides C4c-g; (3) manuscript grammar (prose surfaces) = the C4 spec's
remaining half → C4c-g DISPATCHES NOW (Opus; deep-craft worktree freed); (4)
WhatChangedPanel has NO live importer (tested, mounted nowhere) → filed to
ROUND 3 pre-stock (wire-or-remove adjudication). Durable gotcha ledgered: the
no-raw-color rule counts bare hex ONLY in color/background/fill/stroke/border*Color
props — border shorthand strings, rgba(), and token refs are exempt.
**⬛ OWNER CORRECTION (2026-07-19) — THE DEADLINE IS 11:59:59 PM PT **JULY 19**
(= 02:59:59 EDT July 20), not tonight: ~25.5 hours of runway from issuance, all
of it inside the free-Fable window.** Strategy adjusted: Fable escalations are
affordable throughout (folds reconciliation + verification pre-planned on Fable);
sustained 4-lane saturation targets the full pre-resurvey build (remaining §2
slices → Phase D → the folds → the push) inside the window; the continuity order
now governs TOMORROW night's boundary. Heartbeat re-armed with the corrected
boundary text.
**⬛ OWNER NIGHT ORDERS (2026-07-19 ~22:20 PT) — LANE SATURATION + THE FABLE
DEADLINE:** "there should never be an empty lane, check every 15 minutes to see
if a lane has stalled. I need to complete this by the end of 11:59:59 PM PT
because that is when Fable free for users ends." Operationalized: 15-minute
lane-keeper heartbeat armed (session cron; liveness by fresh commits/processes;
stalled lanes resumed with corrective orders; freed worktrees refilled from the
§2 queue). FOUR lanes saturated: C4 craft (deep-craft) · C2L (side-branch) · T-5
(traditions) · ⭐ C13 THE ONE DOOR dispatched on a FABLE implementer (escalation
clause spent deliberately inside the free-Fable window; side-branch
claude/deep-craft-c13 off 67586c86; architecture-before-sweep build order;
all-or-none violet→slate with fold-reconciliation file list). At the boundary
(~03:00 EDT) THE CONTINUITY ORDER governs: the Opus ultracode successor
continues the heartbeat + queue with full standing authority (START_HERE §6b);
the ledger stays the source of truth commit-by-commit.
**⬛ OWNER RE-RATIFICATION (2026-07-19, night) — the overnight delegation + the
bold-over-safe law, verbatim intent:** "yes keep continuing. If there comes
decisions to be made, I delegate them to you according to the standards that we
have set… if you ever have to choose between maximal safety and something that is
objectively better but introduces risk, you will choose the latter every single
time and fix the consequences. I'm trying to get my code to work to its utmost
perfect best. in which case no compromises." Standing synthesis unchanged and
re-affirmed: boldness applies WITHIN the constitution — the owner's own gates
(byte-identity/dormancy proofs, pins, ratchets, ⛔ classes) are what "fix the
consequences" is proven WITH, not obstacles to it. Judgments continue to be
recorded vetoably; owner-gated classes still never self-ruled.
**⬛ OWNER AMENDMENT (2026-07-19) — table-reporting cadence refined: the
remaining-work table updates on each COMPLETED LIST ITEM (slice/wave/phase/gate),
not on every commit.**
**⬛ OWNER AMENDMENT (2026-07-19, same day) — THE ESCALATION CLAUSE COVERS
VERIFICATION TOO:** "that also goes to verification." Fable verifiers allowed
case-by-case for difficult verifications, never default; same criteria and
reversion rule. Verification candidates: adversarial verification where a
plausible-but-wrong finding could survive standard review · byte-identity/
dormancy adjudication at the folds · soak metric verdicts.
**⬛ OWNER RULING (2026-07-19) — THE ESCALATION CLAUSE (staffing amendment):**
"where you deem it necessary, but not the default, implementation for difficult
tasks can upgrade to fable before going back to opus. Judge on each case by case."
Opus 4.8 stays the standing implementer/verifier tier; the manager may staff a
FABLE implementer for a specific difficult task, case-by-case, reason recorded,
reverting to Opus after. Manager's criteria (recorded): judgment density + blast
radius + architectural ambiguity — pre-identified candidates: fold conflict
reconciliation · the master merge execution · ROUND 3 adversarial verification of
subtle engine findings · C13 ONE DOOR consolidation · the soak combinatorial
harness design. Mechanical/spec-clear slices never escalate. Also 2026-07-19,
standing reporting order: every commit report carries the updated remaining-work
table (memory: owner-reporting-table-preference).
**⬛⭐ T-4 RELATIONS LANDED (2026-07-19, claude/traditions @ dbd3eb2f, 2 commits) —
CULTURES NOW INTERACT, DARK.** 70d12d40 T4-a: §8 imposition/suppression/restoration
in a new pure leaf src/domain/traditions/relations.js — occupation ledger sole
trigger (vassalized, rung 4), overlord's highest-scale rite imposed as a SECOND
record (adoptedFrom + overlord expression, scale capped to vassal tier band), local
rite suppressedBy{overlordId,sinceYear,traded} never deleted, index-0 founding core
immutable; liberation clears suppression, removes the copy, stamps 'restoration';
suppressed rites don't resolve outcomes · dbd3eb2f T4-b: §9 adoption (rolling
3-yr influxLog on the founding core, 12% threshold, tier-cap replacement of the
lowest non-founding, 'displaced' recorded) + aspatial dormancy PROVEN byte-identical
(teleport path: JSON.stringify(ledger)===input). ⭐ THE PRE-DRAIN DIVERGENCE
(judgment-ledger §6, prominently recorded): the design's literal "read due columns
pre-drain in the last-running mover" is STRUCTURALLY IMPOSSIBLE — release drains at
pulseKernel:688 discarding originId, the mover runs post-drain at :2342, and
pulseKernel sits at its EXACT 1387-line ceiling (cannot reorder). Shipped: read
in-transit columns at each column's last-visible-before-drain tick
(tick === max(departTick, arrivalTick−1)) — fires exactly once per column,
observationally equivalent for the 3-yr/12% detection, and more robust than a
cross-pass stash. VETO reverts to a name-swap capture at the release site.
Dials (soak-tunable, vetoable): IMPOSE_CHANCE 0.3/vassalized-yr ·
ADOPTION_THRESHOLD 0.12 · INFLUX_WINDOW 3yr; 10 JUDGMENTs in the lane report incl.
'imposition' logged as a mutation kind on both records. DECLARED for THE ONE REGEN:
influxLog is new lit-only state (materializes when traditionsEnabled lights on
spatial campaigns). Deferrals stand: faction.power routing (interim full-weight,
§16) · culture-vector affinity (highest-scale proxy). Gates: 19+83 focused green ·
strict/tsc/build/eager all clean · FULL SUITE 13,281 green / 7 reds = the expected
5 + the flatqueue vendor-test damage (REPAIRED from .bak in-lane, tree clean) + 1
isolation-cleared timeout flake. T-5 SURFACES dispatches (the lane's final slice).
**⬛⭐ C4 PANEL D LANDED (2026-07-19, deep-craft @ 67586c86) — THE DOSSIER BASE
COMPLETE (all four panels).** PostGenCoach revived as HOST of the wizard-postgen
whisper exactly per the ledgered recipe (registry component swap; WizardNextSteps
deleted → LEGACY; the one-whisper-per-surface budget pin enforced unweakened).
Repo contradiction resolved by trusting the repo: nextSteps.js is master's pure
builder, byte-identical at the tip — KEPT (the brief's "remove nextSteps.js
wiring" read wrong). Functionality census: 7 behaviors retained · "Generate
another" DEFERRED-with-reason (master's coach never rendered the builder's
detached footer — base-of-record) · a11y wrapper follows master (role=dialog).
ONE pin retarget named: tierFacts.contract SURFACES → nextSteps.js (host file
deleted; guard unweakened; Panel-A precedent). JUDGMENTs (vetoable): deep-craft
materials over master's dark card (tolerance-0 kill-list bars the rgba raise) ·
forward-moves only, no duplicate teaching · co-located lazy mount with App.jsx
net-zero at its EXACT 732 max-lines ceiling · DECLARED behavior shift: the coach
is app-level on any route while undismissed (master's placement) vs the old
in-page create-only card. Gates: focused all green · verify:dist 150/150 · full
suite 13,092 green / expected-5 + 13 pglite isolation-cleared load flakes.
RESTORATION-LEDGER: PostGenCoach row → RESTORED @ 67586c86; App.jsx → PARTIAL
(C16 shell/nav remains). ⚠ NEW HAZARDS (memory'd): App.jsx sits at its exact
732 ceiling; a JSX {/* */} comment COUNTS as a code line under max-lines.
**⬛⭐ THE ILLUSTRATED TOWN WAVE COMPLETE (2026-07-19, claude/illustrated-town @
d16d348e).** IT-5 verified retroactively COMPLETE (the prior agent died
pre-gates; every gate now executed green; the IT5-b re-mint proven
DECLARED-ADDITIVE — only the illustrated per-lens row moved, +2,586 ops, all
five base-lens hashes byte-identical). IT-6 THE FACE shipped as two TEST-ONLY
commits: 9cb2ece2 census guard (done-when #9 as executed proof — every existing
map affordance reachable in illustrated mode) · d16d348e free-face invariant pin
(illustrated FREE locked cross-module; LENS_COUNT=5 untouched — altering the
advertised paid count is an owner-gated paid-surface claim). §8 DONE-WHEN walked
9/9 with executed evidence; full suite 13,193 green / EXACTLY the expected-5 +
isolation-cleared contention flakes. Default lens NOT flipped (⛔owner taste
call at the walk; the one-click picker is the decision surface). Deferrals
stand: 08C conversion at the regen · curated-pack gate at the 2nd pack · the
§10 register. Wave PARKED fold-ready; completion memory
illustrated-town-it5-it6-shipped.md.
**⚠ FLATQUEUE ROOT-CAUSED (2026-07-19) — the manager's earlier "git lstat
artifact" diagnosis is RETRACTED.** tests/build/vendorManifestExactSet.test.js
proves its walker by NON-ATOMICALLY mv-ing public/map/libs/flatqueue.js aside
during suite runs; crashed/contended mid-mv it strands the file deleted with a
.bak — currently TRUE in the traditions worktree (repair queued for after its
running suite: restore from .bak). The IT worktree's transient D was the same
mv window observed mid-flight. FILED to ROUND 3 pre-stock: make the test
crash-safe (try/finally restoration).
**⬛ OWNER RULING (2026-07-19) — THE MASTER FORK: "bg and journey" — BOTH.** The C2
leg derivation encodes BOTH candidate masters for comparison at the taste walk:
bg.mp4 (marketing/website/public/bg.mp4, 76.3 MB, 30.25s ⇒ 5.042s legs — the film
the microsite plays, already all-keyframe per the BRAND-landing doctrine) AND
settlementforge-journey-scrub.mp4 (Desktop archive, 20.7 MB, 15.042s ⇒ 2.507s
legs — the playbook's named master). Output sets land in derived-legs/bg/ and
derived-legs/journey/ (separate subdirs, no collision); the walk picks which set
C2 ships. ffmpeg unblocked same day: owner installed Homebrew 6.0.11 (their
password step); manager runs brew install ffmpeg + both encodes + verification.
**⬛⭐ THE LADDER FACTION-KEY BUG RETIRED (2026-07-19, claude/the-ladder @ 14e8a2fa).**
The ROUND 3 pre-stocked item, pulled forward to an idle worktree and CONFIRMED on
genuine generator data: all six real factions keyed `fac.unknown` and — worse than
the recorded hypothesis — `advanceNpcLadder` produced ZERO ladders on real data
(npcInFaction blind too). Fix: `factionName` accessor chokepoint
(`.faction||.name||.label`, id precedence kept) in npcLadderState consumed by
ladderFactionKey + npcInFaction, PLUS the read-side mirror `factionKeyOf`
(townMap/ladderRead.js:176) — live on the coup path via rulingPowerCoup ⇒ fixing
only the write side would have desynced write/read keys (the lockstep test guards
the pair). Denominator: 3 identity sites fixed; classification consumers
(clashOf/faithRuptured/mintGoal) N/A — already correct via factionArchetype; no
out-of-lane sites (the idiom pre-existed, the lane's fresh code had omitted it).
Real-shape pin npcLadderFactionKey.test.js: 5 fail pre-fix / 9 pass post-fix,
proven by patch-revert (no stash; the foreign analytics stash untouched). Gates:
ladder suite 7 files/65 tests green incl. dormancy golden · coup consumers 43
tests green (dark-path factor 1.0 byte-identity) · eslint/tsc clean. Full suite
deliberately at fold (parked branch). npcLadderEnabled is now SAFE to light at the
regen; the traditions faction.power seam (§16) waits only on the folds. Manager
checker pass verified commit/tree/files against the report. No
ffmpeg/ffprobe/equivalent exists on this machine (exhaustively probed; Homebrew absent;
installs forbidden to agents). Delivered to ~/Desktop/settlementforge-marketing-masters/
derived-legs/: MANIFEST.md (source analysis, both boundary tables, asset inventory) +
encode-legs.sh (parse-checked; applies the C2 all-keyframe law, 720p, CRF-escalates to
≤8 MB/leg, cuts the 7 stop stills, prints all-keyframe proof) — one command once ffmpeg
exists (or run on the soak machine). ⛔OWNER FORK SURFACED, not self-ruled: the brief's
master journey-scrub (1920×1080, 15.042s ⇒ 2.507s legs) vs the film the microsite
ACTUALLY plays, bg.mp4 (1600×900, 30.25s ⇒ 5.042s legs; the existing six masters are a
prior full-res cut of it; conductor boundary law = duration/6). Manager recommendation:
bg.mp4 — the owner approved the microsite's played film by pointing at it; flip if
journey-scrub is the intended newer edit. marketing/assets/videos/ no longer exists in
the repo (masters archived out 2026-07-18) — the Desktop archive is the only copy.
**⬛⭐ T-3 POLITICS LANDED (2026-07-18, claude/traditions @ b79ea3d7, 2 commits).**
0b7f410a ownership at mint (motif-fit; seat/faction/institution; keys on the REAL
.faction shape via nameOf — the §17 hazard dodged) + owner-targeted legitimacy
(seat full-weight, faction/institution HALF + news names them; the instability
term self-lit) · b79ea3d7 reassignment checkpoints (seat-follow · ascendant claim
0.35 · orphan→seat) + §7 mutations (rededication/scale-up/reanchor/drift; 8yr
hysteresis on slow kinds; structural kinds fire on-event) — every mutation appends
mutationLog {year,kind,cause}. LIT WALKTHROUGH REAL: a coup re-anchored the
Founding Feast to The Iron Compact with a named log row; growth stepped scaleBand
3→4; core motif + NAME IMMUTABLE (JUDGMENT: grandeur rides trappings, never a
rename — stable dossier identity). Suite 13,263 / expected-5 + 1 isolation-cleared
flake; dark golden byte-identical; zero eager. T-4 INTERFACE (binding): assign
ownership to NEW records only (assignOwnership clobbers if re-run whole-set);
index 0 = the founding core = the tier/fabric SENSOR — imposition suppresses,
adoption replaces lowest non-founding, index 0 never moves; new mutationLog kinds
restoration/adoption are STRUCTURAL (on-event). Dials soak-tunable. REMAINING:
T-4 · T-5 · IT-6 · C4 Panel D (recipe ledgered) + craft · C2/C2L film · C3/C5-C16
· Phase D — all briefs derivable from the frozen designs + these rows per
START_HERE §5.
**⬛⭐ C4 PANELS A-C LANDED (2026-07-18, deep-craft @ 2abed50e) — THE DOSSIER BASE
IS SET.** 507662c0 Panel A DossierHeaderRow (header reroll REMOVED — stays in tab
bodies; HEADER_FACT #D8C8A8 high-contrast; allowRename REVIVED at the component —
caller wiring = C3 scope; emblem + formatCount kept [display-determinism JUDGMENT])
· 50f2ba14 Panel B TAB_GROUPS World NPC-FIRST restored (npcs·relationships·rumors·
daily_life·traditions·history·neighbours; traditions = INERT data-seam until the
lane folds) · 2abed50e Panel C OverviewTab (actionable "Full relationship web →"
onNavigateTab Button + Spatial Layout own top-level Section; radii 1078→1077
locked). Step-2 PLUG-IN verified complete; step-3 CRAFT deferred (base-first per
the owner). Full suite 13,195 / 11 reds = expected-5 + 6 isolation-cleared load
flakes. ONE legal pin retarget, named: renameConsolidation case 1 (the composite
had pinned allowRename-as-INERT — the exact regression being reversed).
RESTORATION-LEDGER: 6 S1 rows → RESTORED (transcribe from this row); WizardNextSteps/
PostGenCoach row stays PENDING. ⛔ PANEL D (PostGenCoach revival) DELIBERATELY
STOPPED — it collides with the guidance-registry walker (W-GUIDE-1 retired
PostGenCoach; budget pin = one whisper/surface). SUCCESSOR RECIPE RECORDED in the
C4 report + here in brief: revive master's PostGenCoach as the HOST of the
wizard-postgen whisper (registry component swap), remove in-page WizardNextSteps
(→ LEGACY ledger), update walker census/budget pins, reconcile 6 named test files,
FULL suite (App-mount + walker = blind-spot risk). Deferral recorded: master's
"Viability →" button (not map-flagged; follow-up candidate, not smuggled).
**⬛⭐ THE CONTINUITY ORDER (owner, 2026-07-18): "if i run out of fable,
automatically switch and continue all the work with opus 4.8 ultracode fast.
don't wait on me."** — Recorded in START_HERE §6b: an Opus 4.8 successor (fast,
ultracode) inherits full standing authority at the model boundary with NO pause;
resumes per START_HERE §5; delegation + vetoable-record duty + ⛔owner gates all
carry verbatim. The program never stops at a quota line.
**⬛⭐⭐ T-2 + IT-4 LANDED (2026-07-18) — culture OCCURS and skins are WEARABLE.**
T-2 (claude/traditions @ 63c37358, 3 commits): the tick-time mover DARK behind
traditionsEnabled — first-lit mint proven byte-identical to the T-1 preview;
occurrence/skip/outcome engine live; pulseKernel name-swap at UNCHANGED effective
lines (1387); dormancy golden 7/7 (dark pulse = same refs); a REAL 3-year lit
walkthrough (5 founding traditions, outcome draws per year, prosperity
Comfortable→Wealthy, legitimacy 55→76 — the upward-drift note is a §13 soak dial,
not a defect). Vetoable: no foundedYear rebase (preserves mint==preview) · local
applicator reimplementation · conservation-preserving faith transfer · skip
thresholds · TRAD_TUNING dials. Interim: legitimacy routes to the seat until T-3
owners land. Honest receipt caveat recorded: full suite exceeded the 10-min tool
ceiling under load — first-run (9 reds: 2 self-caught walker regs FIXED + the
expected 5) + base-verified parked set + isolation-cleared pglite flake stand as
the evidence. IT-4 (claude/illustrated-town @ d7685332, 2 commits): THE DEAD SEAM
CLOSED — saved AI skins SELECT + WEAR on pane/image-export/PDF/thumbnail in
lockstep and flip back; wall extended (glyphSet/dress/seasonBias, bounded);
townGlyphs = a registration manifest (the GENRE DOOR is now a registerGlyphSet
call); ⚠ react-pdf renderToBuffer NON-deterministic — walk the element tree, never
compare PDF bytes (recorded hazard); all town-map goldens byte-identical, zero
eager. REMAINING per the docs: T-3..T-5 · IT-5..IT-6 · the deep-craft chain (C4
next) — briefs derivable from the frozen designs + these reports.
**⬛ THE LOADING JOURNEYS COMMISSIONED (owner, 2026-07-18):** generation loading =
the journey film desk→target-tier, PROGRESS-SCRUBBED off the real pipeline steps
(manager insight ratified into the spec: scrub beats timing — the film always lands
with the dossier); realm loading = the scroll-unfurl film while FMG boots. New
slice C2L in the architecture doc; six film laws inherited; thorp-speed = walk
taste call.
**⬛⭐ THE LIVING BACKDROP LANDED (2026-07-18, deep-craft @ a7afc9cc, 3 commits).**
d308c579 fail-silent localStorage leaf (sf.lastMapView.<saveId> {view,lens}; the
mapEdits blob NEVER touched; net-ZERO pane growth — statement-merge absorbed the
import at the exact 600-line ceiling) · a2b30a1d the lazy wash leaf mounted in
SettlementDossierHero (inline data-URI SVG, object-fit cover, pointerEvents none,
zIndex under content) · a7afc9cc contrast pin + round-trip tests. PROOFS: eager
closure BYTE-IDENTICAL base-vs-tip (1,038,624 B / 7 files, delta 0; town-map
fingerprint absent from entry closure) · WASH_INK_OPACITY 0.10 contrast-pinned
(heading 13.5:1, body 8.0:1 — AA clear; the pin imports the constant so retuning
re-proves) · full suite 13,204 passed / EXACTLY the expected 5, no flakes · live
negative path verified on 5199 + real-Chromium stacking probe (jsdom can't prove
paint order — the probe did). Vetoable: opacity 0.10 · read-mode-only ·
data-URI-img render. Recorded seam: bespoke lens ids wash as parchment (writer only
ever writes base ids — matches the thumbnail). Transient local draft "Pantevrysi"
created during live verification — discardable. THE OWNER'S BACKDROP RULING IS
BUILT END-TO-END; upgrades to the illustrated/seasonal portrait automatically at
the IT fold.
**⬛⭐ ILLUSTRATED TOWN IT-3 LANDED (2026-07-18, claude/illustrated-town @
5324c246, 4 commits).** Season dress as parameter swaps on groundDressOps (winter
snow/bare trees/muted furrows · autumn stubble · drought crack · severity deepens);
state dress (siege ring — trig-free, rides wall/road geometry · scar grain ·
rebirth scaffold), all read-only + dormant-absent; seasonOverride mapEdits key in
the exact styleLens shape (naming-trap green, drop-when-default). PROOFS:
seasonless byte-identity AT GOLDEN STRENGTH (base illustrated golden = EMPTY git
diff, not re-minted); blob byte-identity; accessible lens zero-dress asserted; ops
88 seasonless / 153 full-stack vs cap 160. Seasonal golden ADDITIVE (104 configs).
JUDGMENT (sound, recorded): threaded worldState not bare calendar (severity needs
rngSeed); scar dress whole-fabric (no per-district ids exist). Suite: 5 expected +
1 confirmed load flake + 1 self-caught any-cast regression fixed in-lane.
⚠ PROCESS RATCHET: domainAnyCastBaseline caught BOTH T-1 and IT-3 only at lane end
— it now joins the PER-COMMIT gate list for any lane touching src/domain (T-2's
brief already carries it; standing rule for all future briefs). IT-4 (the registry
— the dead-seam closure) dispatches.
**⬛⭐ TRADITIONS T-1 LANDED (2026-07-18, claude/traditions @ 686d2cb9, 3 commits).**
cfe352b1 genesis leaf (400-line pure domain) + corpus data leaf + 51 tests ·
1d649950 the World-group TraditionsTab (lazy; data-only registration; drafts get the
view-time founding preview; the engine-mirror branch pre-wired so T-2 lights the
surface with zero tab changes) · 686d2cb9 the 3 any-holes typed away (ratchet 9/9,
baseline never widened). PROOFS: mint-time ruling CONFIRMED (drift capture base-vs-
lane byte-IDENTICAL, 187/187 both — genesis provably never touches generation) ·
determinism 220 configs/0 mismatches, frozen-input untouched · ZERO eager bytes
(engine-core chunk hash identical) · tier bands empirical thorp{1,2}→capital{6,8}.
BONUS: pre-existing engineChunkLazy regex fragility found + fixed (hash-order-
dependent matcher → identity lookahead). Six vetoable JUDGMENTs (16-motif
vocabulary · 5-template name grammar · Seedtime/Highsun/Harvest/Deepwinter labels ·
capital band 6-8 · grand-act two-week windows). foundedYear is SETTLEMENT-RELATIVE
(T-2 may rebase at mint — recorded). T-2 (the mover) dispatches.
**⬛⭐ C1r-d + SURFACE 2 LANDED (2026-07-18, deep-craft @ a8d9fff0, 4 commits).**
88348274 C1r-d = THE OWNER'S WALK FIXES LIVE (Instant World card removed; "instant
generation" folded into the hero line; proof-pair top-aligned + new pin) ·
eba0be75 S2r-a/b = master's TWO-COLUMN dossierHero RESTORED with NextActionRail +
ActionRail REVIVED from the merge's deletions (guidance-collision superseded,
recorded; only adaptation = retired strings.js COPY → t() templates; hero extracted
to SettlementDossierHero.jsx per the max-lines extraction doctrine;
suppressNarrativeCta revived so the rail owns paid CTAs while the free raw/narrated
toggle survives) · 41757691 + a8d9fff0 = materials (flat, tokenized; kill-list
ROUND-TRIPPED to frozen base 1078/115/270/246; raw-color budget net 0). Final full
suite: 13,191 passed / 5 failed = EXACTLY the expected set, NO flakes. Protected-
behavior census: all preserved, ZERO test retargets. Eager +10 B (restructure).
8 restoration-ledger rows transcribed. TWO RECORDED DEFERRALS: (1) ⚠ InstantWorldEntry
is now UNREACHABLE in the app (card removed per the owner; inline doorway crossed the
brief's thresholds) — MANAGER RULING (vetoable): re-home it in THE REALM's empty
state at slice C5 (it composes a realm; that is its natural host) — C5 brief amended;
(2) THE LIVING BACKDROP decomposed by the agent → dispatched as its own focused
session (device-local tuple + lazy wash leaf + contrast pins).
**⬛⭐ ILLUSTRATED TOWN IT-2 LANDED (2026-07-18) — the ground dress, three commits
on claude/illustrated-town @ 7f3664eb.** db62302c groundDressOps (pure domain
module; furrows/tree-stipple/ripples/meadow-dots/hedge-ticks; v1 COVERAGE LAW
proven — every golden config dressed, min 19 ops on the sparsest) · f40ed162 the
ONE NW LIGHT extracted (SHADOW_DIR; wall shadows + mountain-flank relief;
extraction proven byte-identical before depth added) · 7f3664eb contrast pins +
DRESS_CAP op-budget guard. Op counts: parchment 92 UNCHANGED; illustrated 277→360
on the largest metropolis (ceiling 2200, no raise). All five re-skin lenses + the
accessible lens byte-identical (dormancy: no dress field ⇒ []); illustratedTownGolden
re-minted twice, additively, causes declared. Slice seal 101/101; verify:dist
150/150; zero eager bytes; domain:strict 0. Lane-end full suite triaged under
MACHINE LOAD 130-225 (concurrent sessions): every non-expected red = 20s-timeout
LOAD FLAKE (fourth confirmation tonight); lane provably cannot reach any failing
test (diff-scope + import proof). Vetoable JUDGMENTs recorded: dress densities ·
all-ink marks (no tinted water ripples) · SE-only wall shadows · offsets. Foreign
stash (analytics-intelligence-layer) preserved untouched. IT-3 (THE SEASONS)
dispatches next with IT-2's interface contract (parameter-swaps on groundDressOps ·
SHADOW_DIR canonical · dormancy-gate mirror for worldCalendar · season folded into
the geometry-digest seed · DRESS_CAP 160).
**⬛⬛ THE DOSSIER CONTENT MODEL IS CLOSED (owner, 2026-07-18: "with this the
dossiers are done. i was missing culture and this added that in for me"):** with
Traditions placed in the World group, the owner declares the dossier CONTENT-
COMPLETE — the tab inventory is FINAL: Summary (overview · summary · plot hooks ·
DM compass) / Systems (services · economics · power · defense · resources ·
viability · substrate · magic · war&faith) / World (NPCs-first · relationships ·
rumors · daily life · TRADITIONS · history · neighbours) / Notes (DM notes · AI
notes · chronicle · versions). This is SCOPE CLOSURE for the dossier: C4 restores
+ polishes toward a now-fixed target; ROUND 3 reviews against a closed model; any
future tab addition is a new owner ruling by definition. The settlement record now
spans economy, power, arms, faith, people, bonds, days, culture, memory, and
neighbors — the complete anthropology the product promised.
**⬛⬛⭐ THE TRADITIONS COMMISSIONED — ENGINE LIFT #4 (owner, 2026-07-18: "lets bring
in culture" → "yes do it"):** per-settlement traditions (holidays · festivals ·
events · fairs) as the culture layer. Owner spec ratified: seeded genesis from the
settlement's ORIGIN · immutable CORE MOTIF with slow, checkpoint-gated expression
mutations (tier crossing / ownership change / deity change / imposition / migration
threshold / generational drift — hysteresis + caps, reframe-class discipline) ·
calendar-timebound (season+month mechanics, fictional week in prose) · weighted-PRNG
outcome TIERS (triumph→failure, plus CANCELLED≠FAILED — manager's determination per
owner delegation) with weights from prosperity band, stressors, owner-power health,
seasonal severity, scale-vs-means mismatch · POWER OWNERSHIP with legitimacy stakes
and state-driven re-assignment · vassal IMPOSITION with the suppressed-core
return-on-liberation emergent · migration ADOPTION via mover origins · count scales
by tier (thorp 1-2 → metropolis many). Effects = READ-MANY, WRITE-BOUNDED pulses
through existing channels (trade, legitimacy, faith standing, news, chronicle,
hooks) — never new write paths into other kernels. Surfaces: dossier Traditions
tab REGISTERED IN THE WORLD GROUP (owner placement, same day: "the tab should exist
in the world tab of the dossier" — a data-only TAB_GROUPS/TABS registration per the
reconciled-base plug-in pattern; world group stays NPC-first per master's ordering
law; manager judgment, vetoable: Traditions slots beside daily_life — culture next
to daily life) · almanac · chronicle · map festival dress (IT-3 coupling) ·
exports · facet-law custom kind (S4; AI proposals Surveyor-gated). Backfill for existing
settlements at flag-light (veteran-backfill pattern). traditionsEnabled = THE
EIGHTH FLAG in the pre-signed ONE REGEN; genesis content parks red on generator
goldens (generation-time precedent); ROUND 3 reviews; SOAK certifies occurrence
cadence + mutation rarity as named metrics. Recon workflow dispatched (time/calendar
+ catch-up-collapse hazard · powers/legitimacy · movement/relations incl. mover
origins + vassal state · event/content machinery); DESIGN_TRADITIONS.md freezes on
its receipts. Task #37.
**⬛ ONE DOOR VISIBILITY CLARIFIED (owner, 2026-07-18: "the floating AI button
should only show for the surveyor premium"):** the left-edge marker renders ONLY
for Surveyor-tier users — no lock-tease, no placeholder; the margin stays empty
for everyone else. SUPERSEDES the manager's lock-glyph-tease default in the One
Door row below. AI-tier discovery = Pricing page + tierFacts surfaces, never
in-app chrome. Polish/Narrate (own credit track) unaffected. C13 spec amended.
**⬛ WALK FEEDBACK #1 (owner, 2026-07-18, the cluster-1 walk's first verdicts):**
(1) REMOVE the Instant World premium card from the create page ENTIRELY; (2) fold
"instant generation" into the line "Pick a size. Roll a settlement. Every size from
thorp to metropolis." (manager judgment, vetoable: the phrase doubles as the
entitlement-gated entry to the instant flow so the capability keeps a doorway —
plain-copy + recorded deferral if wiring is awkward); (3) the two demo miniature
boxes must START AT THE SAME HEIGHT (top-align the exhibit pair). Lands as C1r-d in
the deep-craft lane; then the lane proceeds to SURFACE 2 (library settlement view)
restoration per the reconciliation-map S2 spec + THE LIVING BACKDROP ruling.
**⬛ DELEGATION #2 EXECUTED (owner: "use your best judgement for #2… support@
settlementforge.com is suppose to redirect to settlementforge@gmail.com",
2026-07-18):** (1) MARKETING MASTERS MOVED per the recorded default — ~381MB
archived to ~/Desktop/settlementforge-marketing-masters/ (file-count parity
verified), git rm'd @ ced265b8 w/ README pointer; art-direction MANIFEST restored
to git @ b0c74a4d (doctrine text, not a master); microsite bg.mp4 (73MB, under
GitHub's 100MB hard limit) deliberately retained so the prototype stays runnable.
Tracked marketing weight 474MB → 92MB — THE PUSH-SIZE BLOCKER IS CLEARED.
(2) SUPPORT EMAIL: owner intent = branded address forwarding to the gmail; MX
probe EMPTY (no mail routing exists yet) ⇒ FAIL-SAFE SEQUENCING ruled: code
default stays settlementforge@gmail.com until the owner configures DNS email
routing + a test mail round-trips, THEN the one-line flip to the branded address
rides the deploy batch (§8 carve-out rewritten; memory reopened). Never flip
before the test.
**⬛ MINIATURES CHIP FOLDED (2026-07-18): claude/deep-craft-miniatures @ 332fdf56
(owner-started session task_2bb0e68e, signed off there) merged → deep-craft @
9906d793 (NUL-clean, geometry verified, focused gates + build + verify:dist all
exit 0). The demo panels are half-scale FLAT exhibits via an opt-in `compact` prop;
⚠ THE 44px LAW recorded in its memory (shrink chrome, never hit-targets). THE
CREATE PAGE IS NOW WHOLE INCLUDING THE MINIATURES — the owner walk at 5199 shows
everything.
**⬛⭐ ILLUSTRATED TOWN IT-1 LANDED (2026-07-18) — the glyph spine, four commits on
claude/illustrated-town @ e2d1f0de (base 78a04afc, NOT folded).** 490cf93a THE
GLYPHS (glyphAssign + medieval library + compiler emitting ONLY the existing 5 op
kinds) · 6ef45afd THE ILLUSTRATED LENS (sibling-registry id; five existing lenses
byte-identical) · e8646987 THE PANE UNDERLAY + LOD + op-budget guard (the
two-render-paths divergence class CLOSED for illustrated mode) · e2d1f0de
illustratedTownGolden family MINTED. FULL SUITE 13,201 passed / 6 failed —
TRIAGED: 4 parked golden families (expected) + advancePauseResume 20s timeout
(LOAD FLAKE, 9/9 green in isolation — second confirmation of the concurrent-lane
flake class same evening) + aiGroundingBundle.freshness. FRESHNESS FORENSIC:
PROVEN PRE-EXISTING at the composite base — the recorded bundle's 48 inputs
intersect IT-1's diff at ZERO files. ⚠ HONESTY FLAG: the composite assembly row
listed "freshness regen" among its 10 dispositioned reds, yet the red exists at
78a04afc — the regen either didn't land or re-drifted at assembly; CURE QUEUED at
the deep-wave fold (npm run build:edge-shared, declared cause, mechanical re-pin).
Expected-red set on the composite lineage is 4 parked + freshness until that cure.
IT-2 (ground dress) next in the same worktree.
**⬛⭐ C1 COMPLETE — THE COMMISSIONING DESK IS WHOLE (2026-07-18, deep-craft tip
01ad3a8f).** C1r-c landed in three commits: 5e7cbdf4 THE LEAF (one commissioning
plate; Advanced entirely behind .oc-m-unfold; InstantWorldEntry RE-HOMED below the
fold — the recorded deferral PAID, mounted in WizardEmptyState) · 4075b499 THE TINT
TRIO (wizard banners → clerk's notes; ceilings lowered in-commit) · 01ad3a8f THE
STAGE BACKDROP (six evolution stills as gauge backdrops — optimized jpgs 133-150 KB
each under public/evolution/, static media ZERO eager JS, new pin
homeHeroStageBackdrop.test.jsx). Gates: verify:dist 150/150 · FULL SUITE 13,148
passed / 5 failed = EXACTLY the expected five (4 parked golden families +
aiGrounding freshness). ⚠ FLAKE CLASS RECORDED: the first full-suite run showed 5
EXTRA reds — all tests/security/*.pglite.test.js, all "Hook timed out in 10000ms" —
under concurrent-lane machine load; isolation re-run 51/51 green in 5.6s. Protocol
note for every future fold: pglite hook-timeout reds under load are retriaged by
ISOLATION RE-RUN before any diagnosis. Also confirmed in passing: the FMG fork's
supply-chain gate (validate-map-fork VENDOR-MANIFEST checks) EXISTS and is
test-exercised — partially answers the ROUND 3 intake item. THE CREATE PAGE IS THE
FIRST SURFACE THROUGH ALL THREE STEPS (base → functionality → craft): master's
skeleton, every control, the consolidation ruling, the evolution echo. OWNER WALK
READY at localhost:5199 (vite serves the worktree live).
**⬛ THE LIVING BACKDROP + EDIT-GATE RATIFICATION (owner, 2026-07-18):** (1) the
library settlement view's BACKGROUND = that settlement's last-viewed map — persisted
as the state tuple {view: plan|panorama, lens/skin}, re-rendered deterministically as
a low-opacity ink wash under the dossier plates (never a raster; always current with
world state; contrast pins extended over it; no blur — wash only). Never-viewed ⇒
default plan lens (no settlement page is bare). JUDGMENT (vetoable): persistence
starts DEVICE-LOCAL (localStorage keyed by settlement) — the mapEdits blob would
churn saves on mere viewing and is an owner-gated persistence surface; cross-device
promotion = owner call. Lands with the C3/C4 library-view restoration; upgrades
automatically to the illustrated/seasonal portrait when THE ILLUSTRATED TOWN folds.
(2) "settlement map edits are gated by premium" RATIFIES the standing entitlement
ladder verbatim (2026-07-17: FREE = view/hover/5 lenses/panorama; CARTOGRAPHER =
editing/pins/change-view depth/fog/interiors/v2-redraw; SURVEYOR = AI) — no change
needed; if the owner meant stricter-than-Cartographer, amend on their word.
**⬛ THE ONE DOOR RULING (owner, 2026-07-18: "on the left hand side of the page only…
a floating marker for AI or an 'ask me anything'. it is the only access to AI in the
document besides the polish for dossiers. all prompts go through it and it should be
smart enough to work with what its got first defaulting to thinking that every
request is on the page it is on before moving outward"):** AI front-of-house
consolidates to ONE left-edge floating marker (slate tab, marginalia position, no
text until hover; "Ask the Surveyor" wording vetoable). Carve-outs, named and
closed: dossier Polish/Narrate + proposal-slip stamps (results, not entries). The S3
intent compiler becomes the router; S1/S4/S5/S6/style/S7 panels become destinations,
never entry points. CONTEXT-FIRST LAW: grounding envelope = current surface → 
settlement → world → product, escalating only on classifier verdict — the
token-efficiency doctrine in UX form. Schema wall / kill-switches / early-access
labels survive verbatim. Lands at deep-wave slice C13 (architecture doc amended);
guide whispers unaffected (deterministic registry, not AI).
**⬛⭐ C1r BASE RESTORATION LANDED (2026-07-18) — the create page wears master's
skeleton again.** claude/deep-craft fb5e8031 → C1r-a @ c722c99b (config stage =
master's single LayeredConfigurationPanel; wizardStep stepping DELETED per ruling;
StepIndicator/WizardCommitBand removed [importers checked; WizardChipRow retained —
ChangeModeBar imports it]; TradeDynamicsPanel double-disclosure flattened) → C1r-b @
2a12cc9c (theme.js LANDING_MAX surfaced; WizardEmptyState + HomeHero = master's
remediated composition; ANON GAUGE LAW ENFORCED + new absence pin
homeHeroAnonGauge.test.jsx — the law violation no e2e caught is closed). Receipts:
all gates bare-green per commit; FULL SUITE 13,185/12 skipped/5 failed = the 4
parked golden families + aiGroundingBundle.freshness (pre-existing at base — diff
touches zero generator/aiGrounding inputs; generatorGoldenMaster UNSHIFTED =
generation-neutral proven). Census: all 63 KEEP controls verified reachable; only
the 3 step-nav controls deleted (ruled). Ratchets 1090/117/273/248 →
1082/115/270/247 (ceilings lowered in-commit). Eager 1,038,588 → 1,038,614 B
(+26 B, the LANDING_MAX export; headroom 1,386 B). TEN JUDGMENT rows recorded
vetoably in the lane report + memory c1fin-base-recut-shipped.md — load-bearing:
setEntryPath-not-in-store (brief contradiction caught by VERIFY-FIRST; live exit
machinery kept), tierFacts.contract requires the config import (master's hardcoded
$2.99 would fail it), master's STRUCTURE + deep-craft MATERIAL (flat plates/
ClerkNote over master's rounded+shadowed — tolerance-0 kill-list), InstantWorldEntry
temporarily UNMOUNTED (re-home below the fold = C1r-c's recorded deferral, must
land). REMAINING: C1r-c craft consolidation (one commissioning plate · Advanced
behind the .oc-m-unfold leaf · demo miniatures · tint trio · evolution backdrops
measured · InstantWorldEntry re-home) — fresh implementer, same worktree. The
restored create page is SERVABLE from the worktree for the owner walk.
**⬛⬛⭐ THE EIGHT CROWNS RATIFIED (owner, 2026-07-18: "work hard and get me the best
website! With this, we would have one of if not the best:"):** the benchmark expands
from four crowns to EIGHT — 1 settlement map generators · 2 world map generators ·
3 settlement substance generators · 4 casual game engines · 5 prose & hooks
generators · 6 setting & world builder · 7 world simulator for TTRPGs · 8 AI usages
for TTRPG creation and framing. Manager scorecard recorded honestly: WON on 3
(substance — the deepest moat), 7 (simulator — category of one; the soak is the only
opponent), 8 (the schema-wall trust architecture no competitor can tell); WINNABLE
IN-PROGRAM on 1 (ILLUSTRATED TOWN closes Watabou's beauty axis), 5 (grounded prose;
ROUND 3 content dimension), 6 (generative-not-wiki redefinition); CROWN 2 RE-SCORED
(⬛ ERRATUM + owner correction, same day: "our FMG fork is literally azgaar's
system" — VERIFIED in-tree: public/map/ = 636-file vendored fork of Azgaar's FMG
(MIT, LICENSE-FMG.txt carried), iframe + typed postMessage RPC via
public/map/sf-bridge.js (~1,136 lines), 4 inline main.js patches, upgrade runbook
docs/fmg-fork.md, setup docs/azgaar-bridge.md — "the map provides geography…your
settlements provide depth." The manager's earlier "world map gap vs Azgaar" scoring
and the proposed import bridge were written WITHOUT checking the tree — the bridge
already IS the architecture, and FMG's native .map load means bring-your-own-Azgaar-
world is largely inherent. CROWN 2 THEREFORE STANDS FAR STRONGER THAN SCORED:
Azgaar-class world generation by construction + the living layer no FMG install
has. Remaining crown-2 work re-scoped: (a) house coherence of the realm surface
(deep-craft C5 chrome — already specced); (b) OPTIONAL: a house FMG style preset so
the world map wears the parchment-and-ink hand (FMG's own style system; small,
vetoable) — THE ILLUSTRATED REALM as a from-scratch build is SUPERSEDED by this;
(c) ROUND 3 intake ADDS: sf-bridge postMessage RPC security/origin audit + the
public/map gate-coverage question (the fork sits outside eslint/tsc/vitest by
design — verify what its only gates actually cover) + FMG-upgrade currency check.
MIT attribution rides the existing ⛔OWNER legal-consult carve-out) and 4 (the casual-game reframe: the loop
exists — verbs/Forecast/Docket/SessionMode/tempo — but game-feel was never surveyed
as a discipline → GAME-FEEL added as a named ROUND 3 dimension). ROUND 3's
experience charge re-aimed at the eight (architecture doc §4 amended). The strategic
through-line recorded: seven crowns rest on one moat — meaning under everything —
and the eighth is the website the deep wave is building.
**⬛⭐ THE ILLUSTRATED TOWN COMMISSIONED (owner, 2026-07-18: "do it!" + the reskin
note):** the owner's map critique ratified as a wave — the settlement map lacks
terrain/season art, reads as a flat bird's-eye diagram of blocks, and needs the
cartographer's-illustration treatment: the BIRD'S-FLIGHT idiom (planimetric streets,
buildings drawn as oblique miniatures — church w/ spire, mill w/ wheel), ground dress
(fields/woods/water/relief hachures extending the landforms mark vocabulary), season
+ live-state dress (winter/harvest/siege/scars from sim reads), paper-depth effects
(one light source, ink-hatched shadows) — NO literal WebGL 3D (rejected: breaks house
style, wrong cost). Ships as a NEW LENS; the plan view SURVIVES as the orthographic
source of truth for UVTT/exports; own additive golden family; existing map goldens
untouched. FIRST-CLASS (owner directive, same message): THE SKIN REGISTRY — glyph
sets/palettes/dress rules as DATA per the facet law, so the AI surfaces (S4 custom
content / StyleOverhaul accept→mint) can mint RESKINS and GENRE skins (the genre-pack
door made concrete at the map layer); manual picks persist via mapEdits/bespokeStyles.
Vetoable placements (recorded): illustrated lens FREE as the default presentation
face; curated alternate skin packs CARTOGRAPHER; AI-minted skins SURVEYOR. Task #36;
recon workflow dispatched (render architecture · AI style seam · live-state reads ·
export constraints); design doc DESIGN_ILLUSTRATED_TOWN.md next, then the lane.
**⬛ THE WELCOME FILM RULING (owner, 2026-07-18: "i want the microsite animation for
my welcome page… after each settlement tier it shows the different sections of the
current welcome page before moving to the next. isn't that the 10,000 or million
dollar website landing page?"):** the app Welcome gets the REAL scroll-scrubbed
growth film — the microsite's travel-and-stop mechanic with the existing Welcome
sections presenting at the frozen stops. REVERSES the manager's stills-only ruling
(honesty note recorded: the eager budget guards the JS closure; streamed media never
touched it — the true cost was network weight, now engineered instead of avoided).
Slice C2 re-specced in THE_REMAINING_ARCHITECTURE.md with six engineering laws:
stills-as-floor always (network-blocked walk proves the page whole without one video
byte) · zero eager JS · six chapter-split all-keyframe legs ≤ ~8 MB each with
idle-fetch + prefetch-ahead · desktop fine-pointer only (touch/reduced-motion = the
stills journey) · taste-gate toggle for the walk · derivatives-only in git. Annex
Welcome entry rewritten; the SVG map-journey design demoted to RECORDED ALTERNATIVE.
**⬛⬛⭐ THE BASE RECONCILIATION MAP + MERGE FORENSICS LANDED (2026-07-18) — the owner's
alternative-tree diagnosis CONFIRMED with one culprit.** docs/THE_BASE_RECONCILIATION_MAP.md
committed: per-surface master(d024286e)-vs-composite(78a04afc) diff, classified, with a
RECONCILED BASE spec per page. Three surfaces regressed (S1 dossier: header reroll
reintroduced · world group no longer NPC-first · relationship-web jump downgraded to
static text · Spatial Layout demoted · floating PostGenCoach lost; S2 library: the
two-column NextActionRail right rail REMOVED; S3 create: master's single
LayeredConfigurationPanel replaced by the old stepped wizard — the very thing the
owner's "too many pieces" veto names); S4 nav ALREADY ALIGNED. FORENSICS: the entire
regression class traces to ONE commit — merge `0168e287` "MASTER MERGE W1"
(2026-07-15, 568 conflicts), which resolved ~147 contested UI files to the program
("ours") side and discarded master's parallel P7–P12 organization (master was the
SECOND parent; its refinements never entered the lineage; the 886 later commits built
on the regressed skeleton, no later restoration — tip==merge on every probe). The
owner's mechanism ("worked continuously on an alternative tree; structure lost after
the remerge") is exactly right. Restoration recipe recorded in the map + §1b of
THE_REMAINING_ARCHITECTURE.md: per path, `git diff 0168e287^2 0168e287 -- <path>`
shows what was discarded; master's version lives intact at `d024286e:<path>`;
~138 collateral files beyond the nine surveyed (pricing, library toolbar, settlements
cards, how-to, primitives, copy, theme) get the same master-first walk by their owning
slices. C1-fin re-cut to build from master's WizardEmptyState/HomeHero/
LayeredConfigurationPanel. Next: the deep-craft lane resumes under the three-step
order (SET THE BASE → PLUG IN → CRAFT).
**⬛⬛ THE BASE RULING (owner clarification ×2, 2026-07-18) — SUPERSEDES the same-day
dossier-model row's "preserve-and-polish only" framing:** the GITHUB SITE (origin/master
@ d024286e) is THE UI BASE OF RECORD — its page organization, button placement, and
layout discipline. The current local lineage's pages are a REGRESSED STARTING POINT,
not the endpoint. TWOFOLD GOAL, no order: (1) absorb into that base ALL functionality
built since (guide · AI · maps · exports · entitlements · seal · everything); (2) run
the craft overhaul FROM that base — HEAVIER TREATMENT WELCOME once the base is set
properly. EMPIRICAL DISCOVERY: master is a STRICT ANCESTOR of the composite (0 vs 887
commits; merge-base = master's tip) — no cross-lineage merge exists at the UI level;
the regression lives somewhere in the 887 and is repaired by per-page structural
restoration, not by merging. THE BASE RECONCILIATION MAP survey dispatched (read-only:
master vs composite per surface, differences classified ORGANIZATION-REGRESSION vs
FUNCTIONALITY-ADDITION vs NEUTRAL-RESTYLE → the reconciled base spec per page). The
deep wave's slices now run: SET THE BASE → plug in the new functionality → craft
treatment on top. The anon gauge veto (hamlet→town) and create-consolidation rulings
stand unchanged.
**⬛ THE DOSSIER MODEL RULING + TWO VETOES (owner, 2026-07-18, four screenshots):**
(1) THE DOSSIER LAYOUT MODEL = the screenshots' information architecture (identity band ·
crisis banner+hook · Systems Health status-cards-over-meters · collapsible
Origin/Geography/Layout · institutions chip-row · the Draft→Saved→Canon→Realm→Shared
stepper · persistent header actions · right-rail Narrate/Export/Edit · anon footer
save+buy pair · DARK PROSE BANDS as the two-register solution). C4 REFRAMED: preserve-
and-polish that IA — craft applies as MATERIALS+TYPE only (plates/rules/serif/oxblood/
medallion/colophon); manuscript grammar scoped to PROSE surfaces (Overview, DM Summary);
ADD the wave functionality the layout predates (provenance hover · map-stack entries ·
annals · slate AI + stamp · entitlement gates · config figures). (2) VETO of deep-wave
JUDGMENT #3: the anonymous gauge shows HAMLET→TOWN ONLY — capped tiers out of anon
sight. (3) CREATE CONSOLIDATION: pre-generation = ONE commissioning plate (headline +
gauge + one gold Forge + one honesty line); Advanced entirely behind the leaf; clerk's
notes ≤1 visible; demo artifacts below the fold as exhibits.
**⬛⭐ THE REMAINING ARCHITECTURE COMMITTED (owner order, 2026-07-18: "architect what
must be done out exhaustively... I may run out of fable").** docs/
THE_REMAINING_ARCHITECTURE.md is now THE SUCCESSOR DOCUMENT for everything left:
successor protocol + state + every deep-wave slice (C1-fin…C16 with per-slice laws,
protected behaviors, done-whens) + phase D + the fold + the push completion (w/ the
LFS/move decision) + ROUND 3 staffing & pre-stocked intake + soak + tuning + THE ONE
REGEN steps + THE VERY END + the owner decision queue + post-launch owed + the hazard
compendium (every trap that has fired). Any session — Fable or not — executes FROM
that doc. The ledger remains the record of what then happened.
**⬛⬛ DEEP WAVE 0b→1c LANDED (2026-07-18) @ 78431763 — THE OWNER WALK OPENS.** Seven
commits: 0b MATERIAL (FNV-seeded byte-stable grain tiles 3.1/2.9 kB, ink-bite frames,
feTurbulence-ban pin) · 0c MOTION (the closed twelve, ≤700ms, reduced-motion collapse
pinned, keyframes transform/opacity-only) · 0d HERO SPECS in-tree · 0e PLATES (six
replaced w/ .orig preserved, ten added, webp twins < budget, consumers intact) ·
1a THE GAUGE (six stations from TIER_ORDER, figures from POPULATION_RANGES at render,
E2E locator + walker contracts preserved) · 1b THE ARRIVAL (token-computed ≤2s law,
content in DOM at t=0, reduced-motion instant) · 1c CLERK'S NOTES (one primitive, five
callouts converted, role=alert kept). RATCHETS MOVED: radii 1097→1090 · shadows 118→117 ·
rgba 275→273 · callouts 251→248. EAGER DELTA 0 B (closure 1,038,588 at base and tip).
SIX JUDGMENTs vetoable (16:9 plates uncropped · ARRIVAL replays on remount · gauge shows
capped tiers to anons as pitch · ink-darken color-transition sanction · progression webp
twin · annex/survey naming discrepancy recorded). CLUSTER 1 PARTIAL by name: advanced
second leaf · slate slips (deferred to the AI cluster) · demo miniatures · Wizard tint
trio · evolution-still gauge backdrops (own measured slice) all NOT built. Hard stop
honored; the walk runs on 78431763; the completion slice dispatches AFTER owner feedback.
**⬛ DEEP WAVE PHASE 0a LANDED (2026-07-18) @ c335c355 on claude/deep-craft.** THE
KILL-LIST RATCHETS committed shrink-only-exact (title-census idiom), THE FOUR STARTING
COUNTS frozen at the composite base: borderRadius 1,097 · boxShadow 118 · rgba() washes
275 · tinted callout tokens 251. Receipts: 4/4 ratchet tests green, eslint clean,
hard-gated commit, post-commit survival clean. The lane then STOPPED HONESTLY at the
commit boundary on context exhaustion (JUDGMENT ratified: verified-resumable over
half-built). Handoff facts banked: eager headroom ~3,000 B · Welcome = stills+CSS only ·
the pre-existing reds are CURED on this base (only the four parked golden families red).
FRESH-CONTEXT LANE dispatched for phase 0b→cluster 1: works IN the standing worktree
(the branch is checked out there; a new worktree cannot hold it), self-contained brief,
commit-at-boundaries discipline, hard stop after cluster 1 for the owner walk.
**⬛ THE DEEP WAVE RESUMES (owner, 2026-07-18: "continue with the deep wave according to
everything that we have now").** The two open plate regenerations CLOSED first
(settlements-mappa: saints/halos/crosses out, sun-face + vines + sea-serpent kept, quiet
center-right · about-fireside: ordinary travelers around the storyteller, zero fantasy
costume). The lane re-dispatched with THE ACCUMULATED LAW SET: the original deep-wave
order (phase-0 ratchets/material/motion/heroes → commissioning-desk cluster → OWNER STOP
→ remaining clusters) + THE INSTRUMENT PRINCIPLE + the reference library as BINDING art
direction (MANIFEST translation notes; alive-world people ruling) + THE PLATE INTEGRATION
CHARGE (improved plates through the optimize pipeline into public/backgrounds, replacing
the audited originals; evolution stills = the tier/journey backdrops) + THE WELCOME =
the Survey of One Settlement in its app form (stills + CSS travel-and-stop per the annex;
the microsite at marketing/website is the working reference implementation; the 76MB film
NEVER enters the app — stills only; eager budget guarded).
**⬛⬛ THE SURVEY OF ONE SETTLEMENT — THE MICROSITE BUILT (2026-07-18).** The owner's
travel-and-stop design executed end to end: SIX CHAINED FILM LEGS generated (Seedance
start/end-frame anchoring — desk-dive + five growth legs, each landing ON the approved
evolution plate; 270 credits), concatenated to a 30.25s all-keyframe scrub film (900p
CRF24, 76MB prototype-grade); the microsite REBUILT as travel-and-stop: legs drive film
chapters, stops freeze the film and crossfade to the crisp stage stills (no ScrollTrigger
pins anywhere — content height can never desync the film), stills-as-floor layering
covers unbuffered seeks, touch/reduced-motion get the stills-only journey. Six stops =
Forge@thorp · Brief@hamlet · Voice@village · LivingWorld@town ("you have just watched
this town grow — that is the engine, working") · Artifacts+audience@city ·
Ledger+Door@metropolis. CONFIRMED by DOM receipts: conductor maps mid-leg-2 → t=12.6/30.25
w/ film visible; stop-4 → film hidden, frozen at the town landing frame (t=20.12),
still-4 crossfading in. Build green (vite). ⚠️ pane screenshots unreliable after scripted
scrolls (stale-frame defect) — logic receipts stand; the visual walk is the owner's.
Preview: cd marketing/website && npm run dev → http://localhost:5301. The app's Welcome
inherits this design per the annex (stills + CSS travel, film optional).
**⬛ BATCH-2 PLATE AUDITS (2026-07-18):** settlements.jpg = REGENERATE (mappa-mundi
concept KEPT for the Library; strip the enthroned saint + haloed figure + crosses
[invented-faith only], illegible-only text, house palette, quiet zones; sun-face + vine
borders + sea-serpent KEPT as period cartographic furniture — vetoable ruling) ·
about.jpg = REGENERATE (fireside-storytelling concept KEPT; the elf/dwarf/starred-wizard/
goggled-gnome party = the generic-fantasy tell — recast as ordinary travelers around the
teller; fire, dusk road, listeners stay). Journey prototype film rendering (Seedance job
d81b0186; deliver on completion). Remaining audits: pricing, account, progression, landing/.
**⬛ THE JOURNEY MECHANIC COMMISSIONED (owner, 2026-07-18):** the home page becomes a
scroll-driven cartographic journey — the traveling line along a road on a real engine-
rendered map, waypoints unfurling the existing sections as paper plates. RULING: built
as SVG + DOM bound to scroll progress (synced-to-content, cheap, accessible, dissociation-
safe), NEVER scrubbed video; video reserved for the optional hero intro + ambient loop
(taste-gated). Annex's Welcome entry rewritten (supersedes THE ROAD tune). Prototype
map-travel film generated via Seedance for eyes-on comparison at checkpoint 1. The
reference-library session also delivered: THE EVOLUTION SERIES (six chained ages of one
settlement, landmark lineage held), the alive-world people ruling (staffage welcomed;
crier + scriptorium rehabilitated), and the ~250MB raw-masters note (LFS/move before push).
**⬛ THE INSTRUMENT PRINCIPLE + THE REFERENCE LIBRARY (owner, 2026-07-18):** the wave
paused at "wait stop" gains its art direction first. Owner reframe, now law: THE WEBSITE
IS THE PRODUCT, not an advertisement for one — it must be simultaneously navigable,
aesthetic WITHOUT being busy, immersive, intuitive: self-advertisement + database +
simulator + generator + gallery in one working instrument. Commission: generate AS MANY
reference images as needed (Higgsfield MCP, premium tier, best photoreal model by
exploration) as THE ART-DIRECTION LIBRARY for the deep wave — organized by register
recipe (environment/materials/artifact/ledger/lexicon/charter/write-desk/map-kit/
specimen-drawer/dispatch/dim-lantern/hero moments), each with a TRANSLATION NOTE (what
the UI takes: grammar/hierarchy/texture; what it never takes: period density/clutter).
Real product assets (the seal, a real map export) feed generations as reference
elements. References only — nothing ships without the taste veto; the canonical mark
is always our vector, never a model's approximation. Library → marketing/assets/
references/ + manifest; the deep-craft lane receives it as binding art direction.
**⬛ OWNER GO (2026-07-18): THE DEEP CRAFT WAVE DISPATCHES — "let's rework the website
first. keep everything that you developed and lets develop from there."** The wave runs
BEFORE ROUND 3 (inside the standing preview-pause). Governing spec =
docs/DESIGN_DEEP_CRAFT_PAGES.md (the per-page annex: foundation additions — material
layer, 12-behavior motion grammar, 4 hero moments — five register recipes across every
route, kill-list ratchets to zero, functionality pins untouched). Base = THE COMPOSITE
@ 78a04afc on new branch claude/deep-craft (everything built is kept and developed FROM
— nothing reverts). Execution: the warm craft lane, sequential clusters, phase 0 first
w/ ratchets committed before any surface moves; OWNER CHECKPOINT after cluster 1 +
THE ARRIVAL (hard stop for the live walk); manager by-exception review at every boundary;
full suite at the fold. ROUND 3 stays held until the wave folds + the owner's finished-
site walk. THE PUSH (#23) executes in parallel per the stated plan (probe → measured →
backgrounded → per-branch verified).
**⬛⬛ THE COMPOSITE ASSEMBLED + GATED (2026-07-18) @ 78a04afc on claude/the-composite.**
Merges: w-r2-g2 @ aec57981 (2 conflicts: npcProfile resolved by SUBSUMPTION — the incoming
normalizeNpcRank provably contains the ported master fix; grounding bundle REGENERATED,
never hand-merged) + content-gt-final @ 23c77444 (clean; generation-time-content confirmed
already inside — the recorded supersession) . STATIC GATES first-pass green: build 0 ·
dist 150/150 · tsc 0 · strict 0/0 · lint 0. FULL SUITE 13,149 passed; the 10 reds
dispositioned BY NAME: (1) npcProfile ×2 = REAL cross-branch semantic collision — g2's
rank-vocabulary rename (subordinate→secondary) half-landed; COMPLETED at assembly (9 tier
keys + the pre-rename test migrated, tier content asserted unchanged — declared shift,
label only) · (2) sizeBaseline ×2 = narrativeGenerator SHRANK 905→730 (the content wave's
win) — left the baseline · (3) compendiumDataFreshness = regen on the merged tree ·
(4) dossierContent = G2's DECLARED "Underways catalog half (RED by design)" content debt —
PAID: Underground network desc variants AUTHORED at three tiers in the corpus register
(the coverage contract caught a cross-branch IOU exactly as built to) · (5-8) the FOUR
PARKED GOLDEN FAMILIES (generatorGoldenMaster · beliefMapGolden · worldpulseDeityGolden ·
pdf goldenViewModel) — verified pure output diffs, re-mint at THE ONE REGEN, the standing
plan's expected red set. TASK #5 CLOSES. THE PUSH (#23) executes next; ROUND 3 remains
HELD at the owner's preview-pause gate (+ the open owner decision: THE DEEP COMPOSITION
WAVE recommendation, answer pending).
**⬛ OWNER GATE INSERTED (2026-07-18): PREVIEW-PAUSE BEFORE ROUND 3.** Owner order:
"before the resurvey, pause and show me a preview." ROUND 3 (task #6) does NOT
auto-dispatch at the push. Sequence amended: composite suite → red audit → ledger →
PUSH (#23, standing order) → SERVE THE COMPOSITE LIVE (vite from the composite branch,
lineage-probed) → OWNER WALK-THROUGH → ROUND 3 dispatches only on the owner's word.
**⬛⬛ FOLD: THE ORGANIC CRAFT WAVE → w7-prep @ 8a5b10a1 (2026-07-18) — AND THE FIRST
ALL-GREEN FULL SUITE.** Merge 9124110b (no-ff, zero conflicts, NUL scan clean, 89 files)
+ two triage commits. THE SEVEN FULL-SUITE REDS CURED, not baselined: mutedBg → hex-key
swatch entry (-2 raw literals) · npcLadder EXEMPT classification (LADDER-FOLD ESCAPE —
the focused-gates protocol's known blind spot, now proven: globals only run at manager
folds) · crisisTripleSync +3 sanctioned S7 refs · relationshipCompatibility +1
(signalRegistry vocabulary read) · raw-button baseline swap (doc-wave restructure; debt
flat) · THREE slugify inliners MIGRATED to the kernel primitive (growth ceiling refused
the baseline path — correctly; parity-proven byte-identical incl. ladder join keys; new
parity cases committed; ladderRead gains its first import — kernel, consistent with the
zero-ENGINE-import law) · raw-color BUDGET 1427→1450 LOUD EXCEPTION (23 literals shipped
across six focused-gated folds; ROUND 3 carries the named tokenize-down task) ·
SettlementMapPane 601→600 (import collapse; also cured sizeBaseline). RECEIPTS: tsc 0 ·
strict 0/0 · lint 0 errors · build 0 · verify:dist 150/150 · CERTIFYING FULL SUITE
1297/1297 files, 12,972 passed / 0 failed / 12 skipped, EXIT 0 — no tolerated reds
remain. ERRATum owned: my review parenthetical "there is no Wanderer" was WRONG (it is
TIER_NAMES.free); the lane enforced the principle, not my name ban. Wrong-lineage trap
fired once mid-triage (11th; read-only; zero damage). Lane JUDGMENTs standing vetoable:
dim-ink header device · PDF counterseal deferred (react-pdf seam) · gate title kept
under the functionality law · TableView dim deferred at the legibility floor. TASK #32
CLOSES. NEXT: THE COMPOSITE (task #5) — w7-prep + w-r2-g2 @ aec57981 + content-gt-final
@ 23c77444 + generation-time-content @ f9720b5a on claude/the-composite.
**⬛ THE SEAL APPROVED — IMPLEMENT + PLACE (owner, 2026-07-18: "i like the seal;logo
impliment it also place it appropriately"):** the simplified device is the APPROVED house
mark (favicon A stands). Placement register relayed to the running lane — core (already
dispatched): tab favicon set · header wordmark lockup on every page · About seal moment
w/ motto caption · export colophon w/ settlement-medallion counterseal. ADDENDUM
placements (manager judgment under "appropriately", vetoable): site-footer colophon
(small device, the printer's-mark position) · the loading emblem (the device as the
diegetic app-loading mark) · error/404 clerk's-slip stamp (small device on the slip —
the fiction holds even when lost) · OG/social share image (device on parchment for link
unfurls; static asset, zero eager). Rule held everywhere: the mark never carries text;
the name is always adjacent type.
**⬛ TASTE VETO PASSED + PHASES 3-5 DISPATCHED (2026-07-18, owner: "run: 1. Craft
phases 3-5... 2. The craft fold... 3. THE COMPOSITE"):** the five-sample direction is
APPROVED by the owner's build order; the STOP releases. Dispatched to the standing craft
lane (context intact): the census-enforced app-wide sweep → mobile/tablet companions →
verification ratchet, carrying the four review revisions, the guidance checkpoints, the
depth standard, and THE FINAL LOGO (the simplified device: ring/roofline/triangle/seal-
point; hand-inked vectors; wordmark lockup; motto-as-caption ceremonial only; FAVICON A
adopted per manager recommendation VETOABLE — one device everywhere, SVG+prefers-color-
scheme with the Safari PNG dark fallback, maskable safe zone, ICO+apple-touch; header
mark; export colophon = house device + the settlement's seeded medallion counterseal;
the About seal moment). Gates: focused-only in-lane; the full suite runs at MY fold,
where the pre-existing base reds (SettlementMapPane 601>600 + 7 suite failures at clean
base) get name-identity triage. Then THE COMPOSITE (task #5) → PUSH (#23) → ROUND 3 (#6)
per the standing sequence.
**⬛ OWNER SIMPLIFICATION RULING (2026-07-18, "simplify it — too many elements"):** the
mark reduces to its IRREDUCIBLE DEVICE — ring broken by the roofline, station triangle,
red seal-point. STRUCK: rim legend, motto, field pellets, double ring, the SF from the
primary mark. The name + motto move OUT of the device into the wordmark lockup (type
beside the mark) and ceremonial captions (export colophon sets the motto as a line under
the device, not inside it). Favicon = OWNER CHOICE PENDING: (A) the same device redrawn
heavier — RECOMMENDED, one mark everywhere · (B) the SF signet surviving only in the tab.
The accretion was the process's fault, not the owner's — each element entered justified;
Rand's reduction discipline is the answer, and the struck elements remain available to
ceremonial contexts by typography, never inside the mark.
**⬛ OWNER SEAL AMENDMENT (2026-07-18):** the Colophon drops the SF monogram — the
STATION (triangle + red dot) enlarges as the sole central device between rim legend and
skyline; the name lives entirely in the legend + motto (pure sigillographic composition:
device signals the class, legend individuates). The SIGNET keeps the monogram (period-
correct: signets carried initials; a clean division of labor between registers). Manager
additions under "fix anything else": device stroke raised to rule-family weight (no
hairlines), interpunct anchors flanking the legend, two subordinate field pellets
(worked-field discipline; VETOABLE — say the word and they go), triangle optically
centered in the field. Final drawn vectors ride the phases-3-5 dispatch.
**⬛ MANAGER PREVIEW REVIEW: PASS WITH REVISIONS (2026-07-18) + THE LOGO RECONCILIATION.**
Review ran from the LANE worktree via a scratchpad static server (main-tree preview hazard
honored; lineage curl-probed). VERDICT: the composition system reads authored at desk,
field, and dim — the library ledger (memo-line italics, phase-glyph standing, CANON small
caps) is the strongest instrument proof; pricing's differentiated bench + dagger markers
kill the uniform-cards tell; the field/dim dossier (gold-on-umber lamplight) is the best
single screen of the set. FOUR REVISIONS for phases 3-5 (none veto-blocking): (1) desk-width
cartouche crowds its frame — title touches the right inner edge, tower device straddles the
border (field-width composes correctly ⇒ width-dependent bug; optical padding pass owed);
(2) field stack renders an ORPHANED duplicate tower glyph below the cartouche; (3) fixture
typo "Dcovey Ash"; (4) sample-fiction values (tier name "Wanderer", hand-typed $5.99/30-
credit figures) must bind config + copy registries at live wiring — never leak from samples.
OWNER TASTE VETO NOW OPEN (server left running: http://127.0.0.1:8642/docs/samples/
organic-craft/index.html). LOGO RESEARCH LANDED (4 lenses, ~40 sourced principles).
RECONCILIATION RULINGS (vetoable): two-register system VINDICATED by both canons (great-
seal→signet register descent; UNC/NASA/Wisconsin redraw-don't-shrink; names stay Colophon/
Signet) · the Colophon gains the LEGEND (sigillography: the legend, not the device, is the
load-bearing identifier) — name on the rim + the house MOTTO "STATE · NEVER · FATE" (the
Aldus/Plantin emblem+motto formula, drawn from the covenant line already shipped) · the
Signet stays text-light (SF only); letterless ring+skyline+dot fallback PRE-AUTHORIZED if
SF aliases at true 16px (Starbucks-siren precedent; the red station dot is the wayfinding
accent) · stroke floor at signet scale (Material 2dp-equivalent; redraw never shrink) ·
Safari ignores SVG-favicon prefers-color-scheme ⇒ PNG dark fallback REQUIRED at wiring ·
maskable safe zone (central 80%) for touch icons · SEAL+COUNTERSEAL INSIGHT: exports carry
the house Signet beside the settlement's own seeded cartouche medallion — authentication
layering straight from sigillography, zero new machinery (the craft wave's 96-slot
medallion IS the counterseal) · register-governance table (which mark where, who
authorizes) = a phase-3 law-doc section. Round seal = civic/secular register: correct.
Rand caution BANKED: the mark's meaning arrives by association, not decoding — "logos are
never love at first sight."
**⬛ CRAFT WAVE PHASES 1-2 COMPLETE — STOP HONORED (2026-07-18):** claude/organic-craft
@ b94f13c8 (base 019d1a2e, 6 commits, clean). Foundation (ink ramp · rubric · fluid scale ·
three-posture usePosture · rule family · instruments · seeded-ornament library w/ byte-stable
golden family) + 5-screen sample set as self-contained drift-guarded HTML
(docs/samples/organic-craft/) + the census scaffold (30 routes + modals, all PENDING).
Receipts: ~115 lane tests green · tsc 0 · strict 0 · lint-on-touched 0 · build 0 ·
verify:dist 150/150 · EAGER DELTA 0 B (organic layer fully tree-shaken). Contrast AA
CONFIRMED per state at the letterform. 8 JUDGMENTs recorded w/ rejected alternatives
(depth-standard compliant; shadows-retirement + IM-Fell display binary = named deferrals).
⚠️ CRITICAL PRE-EXISTING FINDING: base tip 019d1a2e itself reds — SettlementMapPane.jsx
601>600 lint ceiling (not in .size-baseline.json) + 7 full-suite failures REPRODUCED at a
clean base checkout (relationshipCompatibility · crisisTripleSync · rawButtonBaseline ·
rawColorLiteral · sizeBaseline · slugifyIdiomBaseline · swatchResolves; some possibly
worktree-environmental — VENDOR-MANIFEST empty in that run). NOT this lane's; TRIAGE OWED
AT THE COMPOSITE (name-identity vs base discipline). NEXT: manager preview legibility
review (desk/field/dim from the LANE worktree — never the main-tree preview) → owner
taste veto → phases 3-5 dispatch.
**⬛ GUIDANCE-COHERENCE CHECKPOINTS PINNED (2026-07-18, owner coherence question):** four
binding checkpoints added to the craft brief for phases 3-5 (whispers→marginalia w/ registry
intact · title census monotone down w/ the false-positive caveat · Handbook + WorldMapToolbar
deferrals re-flagged not absorbed · dissociation test × artifact test compose). The two
waves are one philosophy at two layers; the sweep lands them as one system.
**⬛ OWNER RESCISSION (2026-07-18, minutes later): LOCALIZATION STOPPED.** On hearing
the scope boundary (UI chrome localizes; engine prose = per-language corpora + goldens,
a content-layer rewrite per language), the owner stopped the wave: "then stop the
localization." The recon workflow was killed mid-flight (no results consumed); NO brief
will be written (docs/briefs/W_LOCALIZATION_WAVE.md does not exist); NO build lane
dispatches; NO extraction law rides the craft phases-3-5 sweep. Standing disposition
restored: localization = post-launch roadmap BY NAME (depth-standard gap-5 re-corrected);
the copy registries keep the door structurally open; English-first at launch. The
override row above stands as history.
**⬛ OWNER OVERRIDE (2026-07-18): LOCALIZATION MOVES PRE-ROUND-3.** The depth
standard's gap-5 disposition ("post-launch roadmap by name") is superseded the same day it
was written: the owner rules localization is built BEFORE the resurvey so ROUND 3
validates it. Recon fan-out dispatched over the w7-prep lineage (copy architecture ·
hard-coded-string prevalence · formatting/plural sites · engine-prose boundary ·
budget/persistence). Wave brief = docs/briefs/W_LOCALIZATION_WAVE.md. Build sequencing:
L1 infrastructure lane dispatches at the craft phases-1-2 fold (both waves rewrite
src/copy — never in parallel); the extraction law rides the craft phases-3-5 census sweep
(one app-wide pass, two laws).
**⬛ THE DEPTH STANDARD RATIFIED (owner, 2026-07-17: the $10k-vs-$1M framework + "I
want the absolute best that Fable can do"):** the standing check on all website work —
the bar is DEPTH/CONSISTENCY/VALIDATION/WHOLE-EXPERIENCE EXECUTION, never screenshot
beauty. Five columns added to the craft-wave fold gates (whole-experience coherence via
the census · system-not-instances · evidence-not-vibes incl. rejected-alternatives
recording · content-is-design · the honest gaps named). MAPPING BANKED: the program
already fills the framework's expensive columns structurally (six research corpora =
the documented research · the census = the past-the-front-door law · the law doc +
golden-disciplined ornament = the design system · drift contracts + the JUDGMENT ledger
= testing-and-evidence incl. why-rejected · the lane structure = the multidisciplinary
team). THE TWO HONEST GAPS: real-user task validation = POST-LAUNCH OWED (all surfaces
ship instrumented; ROUND 3's product-fit = the internal proxy) · LOCALIZATION = absent,
now a NAMED post-launch roadmap item (copy registries keep the door open). ROUND 3's
claims/product audit inherits the five columns. Relayed to the live craft lane.
**⬛⬛ FOLD: THE LADDER @ e160177f (2026-07-17) — ENGINE LIFT #3 LANDS; THE ENGINE'S
CONSTRUCTION ENDS FOR THE THIRD AND FINAL TIME.** 7 commits (17 files NUL-clean; ~1,790
engine lines in lazy leaves; pulseKernel net-zero): the standing integrator · dynamic
goals over the REUSED S7 registry w/ the attribution rule + honest lapsed · the
challenge engine (windows, non-short-circuiting receipts, seeded resolution, the
three-body single-pass, conservation swap/drop, four brakes, the stigma tax, D5
grudges) · §8's standing loop closing BOTH ways single-writer (leadership quality
consumed in coupContenders — a well-led faction RESISTS coups, turmoil INVITES them;
dark-safe factor===1) · coup truncation · the faith-rupture permanent window · the
npc_ladder beat. ALL NAMED FIXTURES PINNED: three-body, both-succeed-greater-deed,
stigma-halved, multi-claimant attribution, sustained-margin-spike-never-wins, the
ANTI-STASIS CENTURY BAND both bounds. All 19 prior dormancy goldens green + its own;
fold receipts 65/65 + tsc 0 + strict 0/0 + dist 150/150. **npcLadderEnabled JOINS THE
ONE REGEN (seven flags).** Tuning tables documented as soak dials (CHALLENGE_RATE 0.05,
COOLDOWN 104wk, STIGMA_TAX 0.5, half-life 156wk…). SEAMS → ROUND-3/owner stock:
pantheon rising-lift + war-god methods · explicit alignment modulation · the growth-
trait entrenchment deposit (needs a growth-kernel signal input — single-writer
preserved) · chained vacancy succession · provenance edges · display stock (NPC-card
rung/goal, Power-tab read) · the open-bottom amendment STILL OWNER-PENDING. **ONE LANE
REMAINS: THE CRAFT WAVE (phases 1-2). Construction is otherwise OVER.**
**⬛⬛ FOLD: THE DOCUMENTATION WAVE 2/2 @ 08486264 (+ reconciliation 019d1a2e) — THE
DOCUMENTATION WAVE COMPLETES, ALL FOUR PAGES SHIPPED.** ABOUT = the six-band trust page
(the whole-loop schematic in the engraving register · the philosophy ladder w/ the DM
prose surviving · THE COVENANT w/ six VERIFIED receipts — state-never-fate quoted from
source, retention pinned to migration 023, the AI no-write-path proven over all 164 ops ·
the tick diagram before its text · the concession-first AI section · the audit close;
UnderTheHoodTab reaped). COMPENDIUM = THE REGISTRY-RENDER LAW real (one generated
artifact + the freshness contract — divergence FAILS CI; the op registry PUBLIC in its
real shape, 164 ops walker-pinned; hubs: Operations/Deities/Lenses/Facets/Calamity/the
REAL 16 Living-World systems w/ preset truth from configs; tier bands CORRECTED from
source — a disclosed on-screen fix; the A-Z crawlable index). THE CONTRACT'S IN-TREE
CATCHES: the '14' stale comment (flagged, engine file ladder-fenced) · the wrong Thorp
band (fixed) · brief premises honestly refined (archetypes AUTHORED-labeled — no engine
source exists; calamity = the one bucket; the 9 PRESSURE_KINDS real but the old
parenthetical wrong). **THE THIRD CROSS-LANE CATCH AT FOLD:** the doc-count contracts
red (24 vs 25 edge functions — S7 crossed the branch point); reconciled @ 019d1a2e.
JUDGMENTs incl. THE MAKER'S-NAME WITHHOLD (publishing the owner's real name on the
public About = owner-gated; the one-builder framing + /founders link used — **OWNER
QUEUE: name/face publication**) + the demo world = the sanctioned lf-033 fixture seed.
SEAMS: custom-mode↔S4 vocabulary reconciliation deferred-with-reason · the preset
war-gate nuance labeled. Receipts on the merged tree: 101/104→green after
reconciliation (19/19 doc contracts) · tsc 0 · dist 150/150.
**⬛⬛ THE ORGANIC CRAFT WAVE DISPATCHED (phases 1-2 + MANDATORY STOP at the taste
veto)** — claude/organic-craft off 019d1a2e: the foundation (ink ramp · the rule family ·
rubrication · fluid scales · the three-posture model · subset fonts · the seeded-ornament
library v1 + its NEW golden family) + the five-screen sample set → STOP for the manager's
preview legibility review + the owner's veto; phases 3-5 (the census-enforced app-wide
sweep + the mobile/tablet companions + the verification ratchet) await the go. **THE
PROGRAM'S FINAL BUILD DISPATCH. Live: THE LADDER + THE CRAFT WAVE — everything else is
folded, parked, or proof.**
**⬛ THE SURFACE CENSUS (owner confirmation: the craft wave covers "every single page"):**
the wave brief gains a required enumeration deliverable — every route/view/panel/modal
dispositioned (recomposed / instrument-exempt-with-reason / deferred-with-reason); the
phases close at zero undispositioned entries; the preview review walks the census.
Coverage = every page + every empty state/error/loader under the one-fiction pass, three
postures each; the artifact/instrument split governs WITHIN pages, never exempts one.
**⬛ FOLD: NON-WATER LANDFORMS (2026-07-17) → w7-prep @ d01a85ab** (5cb92caa off the fog
tip; 12 files NUL-clean; clean merge across the gate-wiring pane edits). THE SITE IS
VISIBLE: marsh/dunes/mountain-flank render across the flat map, all five lenses
(pattern-never-colour), the panorama (per-kind pseudo-elevation — the flank stands
proud), and every export through the ONE geometry source. THE WALL held (two numeric
roles); provenance hover explains each kind for free; the v2 golden re-minted
DECLARED-ADDITIVE w/ the 12/20-byte-identical-first proof; the style golden proven
untouched-correct (v1 models carry no landform — the reasoned divergence from the SM-5
precedent). Fold receipts: 37/37 (landform pins + BOTH goldens + panorama + gate
cross-check) · tsc 0 · dist 150/150. Aesthetics join the standing v2 TASTE-VETO posture
(samples on request). JUDGMENTs ×3 vetoable (mark vocabularies/densities · ink weights ·
panorama lifts). **THE LAST TWO BUILDS: THE LADDER · DOC-WAVE-2.**
**⬛ PARK: CONTENT-GT-FINAL @ 23c77444 (2026-07-17) — THE CONTENT PROGRAM COMPLETES.**
9 commits stacked on 577179fb (spot-checked: 19 files, NUL-clean; the stall cure's 7th
save mid-finale). ALL SIX CHARGES: history events 29 types ×3 (the 58 banked variants
recovered + token-parity-verified) · institutions EXHAUSTIVE 301/301 ×3 (the 56
taste-approved originals byte-identical; the walker now an exhaustiveness ratchet) · NPC
pools grown w/ lockstep mirrors (neg/neutral split honorably deferred) · vignettes
(probes made pool-robust FIRST) · AMENDMENT A: the clunker class STRUCTURALLY IMPOSSIBLE
(descriptor-swap-first w/ dedup-only pool; proof realm 21/21 distinct 0 clunkers) ·
AMENDMENT B: the casing pass at the TRUE 13 sites (not the estimated 9 — the enumeration
rule found 4 more; a declared one-time shift, legal in the parked lineage). THE PROOF:
base-vs-tree structural diff over the 187-grid = PASS, only prose paths moved (18
display paths, zero structural/numeric); the golden-red set = EXACTLY ONE FILE
(generatorGoldenMaster — the parents' parked red; the ONE REGEN owns it). Gates on the
final tree all green; dist 145/145 zero-eager on its lineage. JUDGMENTs ×6 vetoable
(13-not-9 · prefix-not-suffix disambiguation · unweighted new traits — owner-gated
follow-on · goals deferred · batch commit shape · the timeout disposition). **THE
COMPOSITE now takes 23c77444 as the content stack's single tip.** Remaining live: THE
LADDER · DOC-WAVE-2 · LANDFORMS — the program's last three builds.
**⬛ FOLD: THE MAP-SURFACE GATE WIRING (2026-07-17) → w7-prep @ 9d1c9702** (772877f5 off
the fog tip; 5 files NUL-clean; receipts 17/17 gate pins + tsc 0 + dist 150/150; 0 eager
by construction, pane 597/600). THE LADDER RULING'S MAP CONSUMERS LANDED: DM pins gated
(locked-visible padlock on saved maps; stored annotations untouched; viewing free;
anon/gallery unaffected) · change-view depth gated (free = the newest change per band —
the honest teaser floor; premium = full depth; the derivation tier-blind, pinned). TWO
HONEST STOP-AND-REPORTS ACCEPTED: interiors have NO consumer yet (the enter-from-map
hook = the recorded unbuilt seam; the pure most-prominent-institution free-sample rule
RECOMMENDED for when it lands) · the v1→v2 redraw affordance is PREMATURE until the
owner's taste veto. ROUND-3 STOCK GAINED: the built-but-unwired interior hook · the
invisibly-gated map-edit chrome (hidden, no teaser — "lock-glyph-teaser everywhere"
wants one) · interior-export monetization intent superseded by the ladder (owner
surface). REMAINING LIVE: the ladder · doc-wave-2 · landforms · big content. The
entitlement ladder is now FULLY WIRED at every existing affordance.
**⬛ THE CHALLENGE ROUND (owner: "feel free to challenge me" — four challenges
delivered):** (1) **OPEN-BOTTOM AMENDMENT proposed, OWNER-PENDING** — the closed
displacement ladder over a fixed cast reaches equilibrium (person-scale stasis, the
program's oldest disease); recommendation: conservation holds above the floor, the
bottom rung opens to population/REASSIGN entrants; contradicts the owner's literal rule
⇒ theirs to decide. (2) **THE ATTRIBUTION RULE — RULED (delegated, vetoable), relayed**:
shared-signal goals credit by DOMAIN + OFFICE w/ fractional out-of-domain pay + honest
receipts; the multi-claimant free-riding fixture mandated. (3) **THE ANTI-STASIS BOUND —
RULED, relayed**: the cadence dial carries BOTH bounds; the soak certifies
successions-per-faction-century within a band (never zero, never churn). (4) **THE SCOPE
LINE, stated to the owner**: the ladder = the recommended LAST new pre-launch mechanism
(fourth engine reopening); further ideas → the post-launch corpus with honors unless
fixes — "the best thing to add now is a launch date."
**⬛ THE LADDER §11 THE LONG GAME (owner, 2026-07-17: "a promotion isn't supposed to
happen every other week… goals should span weeks to years… a cumulation of impact where
failure takes it away… a three-way rise"):** STANDING = an integrator STOCK (fabric
prominence idiom; deposits/withdrawals/decay; challenges draw the stock, never a streak)
· FOUR PACING BRAKES (sustained margin — spikes never fire · windows · years-scale
post-succession cooldown = the interregnum · the E0 realm cap); cadence = a per-faction
succession every few sim-years, A DIAL for the tuning window · GOAL HORIZONS mint with
stakes (weeks→years; partial progress deposits; LAPSED vs failed honest-null resolution
on situation shifts) · THE THREE-BODY LADDER (one stock defends below and challenges
above; MOUNTING A CHALLENGE WEAKENS YOUR OWN DEFENSE — the bottom's best moment is the
middle's boldest; chain-capped vacancy cascades; adjacent rungs only, always). Frozen +
relayed w/ the three-body fixture mandated. The design is now 11 sections + matrix —
the most owner-refined mechanism of the program (5 refinement rounds, matching v2's map
record).
**⬛ THE LADDER §10 THE STIGMA MARK (owner, 2026-07-17: "if they are exposed for
corruption, it becomes twice as hard for them to get promoted for a long time"):**
exposure now cuts BOTH ways — the widest window against a defender AND a challengeScore
×0.5 stigma on any climber for a lifespan-scaled duration (D5 bands; decaying;
refresh-on-reexposure; receipted by name in challenge receipts; deposits toward cynical).
The evil/leverage path survives but crime costs years. Frozen §10 + relayed to the live
lane w/ the exposed-climber-halved fixture mandated.
**⬛ THE LADDER §8+§9 (owner refinements, relayed mid-flight):** THE STANDING LOOP —
ladder→faction feedback closes the circuit (leadership quality lifts effective power ·
churn priced as decaying instability · legitimacy reads the HOW of succession, public
legitimacy taxed on norm-breaking governing usurpations · ENTRENCHMENT: long tenure
deposits rigidity which raises clash as the world drifts — success plants the fall,
dynasties rot mechanically) + WEIGHTED DEEDS — stakes priced at goal-mint (state-distance
× scope × adversity × domain), settled at outcome; **the greater deed beats the smaller
even when both succeed** (the owner's rule verbatim, fixture-pinned); flaws = risk
appetite; anti-farming by weight-averaged windows; deed-acquired growth as evidence.
Single-writer preserved (sidecar modifiers; reads consume when lit; absent ⇒ 1.0 ⇒
dark byte-identity holds). Frozen in the corpus; relayed to the live lane w/ the named
pin set incl. the both-succeed fixture.
**⬛⬛ THE LADDER COMMISSIONED (owner: "build it… cohesive completely with the NPC's
entire description and the settlement's entire state and shape") — ENGINE LIFT #3.**
Design FROZEN w/ the full coherence matrix: docs/DESIGN_THE_LADDER.md @ w7-prep —
displacement-only conservation (every promotion has a named loser) · window-gated
challenges w/ structural defender's advantage + the challenger's stake · the three
determinants (faction power trajectory · DYNAMIC GOALS as derived reads REUSING the S7
registry/evaluator, flaws biasing selection, goals reminting on rung/state change · the
growth layer's opposition metric as the clash price) · the §4 coherence mandate per the
owner's comprehensiveness order (alignment methods: lawful-through-windows/chaotic-
discounted/good-on-service/evil-on-leverage · patron-deity faith coherence + the
pantheon lift + the faith-rupture permanent window · compromised leverage/time-bomb ·
traits both directions through the existing deposit map · D5 grudge-hardening · reframe
via existing act classes only · STATE-NEVER-FATE: ranks move, people remain) · dormant
npcLadderEnabled + mandatory dormancy golden + sidecar/mirror storage + the name-swap
kernel chain + zero migrations. Lane dispatched (claude/the-ladder off a4e73651).
**⬛ FOLD: THE DOCUMENTATION WAVE 1/2 @ a585a891 (+ the reconciliation a4e73651):**
WELCOME + PRICING born-complete (live-browser verified by the lane): the map waypoint w/
drift-gated frozen lens plates of the fixture's own town · the schema-wall disclosure ·
Surveyor RENDERED (walled violet, task-priced, BYOK) · THE FOUNDER CHARTER (live meter,
derived arithmetic, never-reopens ON-PAGE) · the one-time lane + THE TASK MENU (11→12
tasks, ≈$ anchor, worked months, labeled estimates) · **THE FAILURE POLICY VERIFIED AT
BOTH REFUND EDGES BEFORE WRITTEN** (partial-polish nuance in the FAQ, not dropped) ·
THE ENTITLEMENT LADDER rendered w/ per-row enforcement markers (ruled-vs-derived visible
to ROUND 3's claims audit) · the 8-pin drift contract + copy-source guard. +680 B raw
eager SIGNED (~45 B semantic; minifier layout churn attributed; the composite arbitrates).
**THE DRIFT CONTRACT'S FIRST CATCH AT FOLD:** S7's autonomy task entered config after the
lane branched — the task-menu walker FAILED the fold until the copy gained its entry
(reconciliation a4e73651; 8/8 green) — cross-lane doc-drift caught by machinery, not
eyes. About+Compendium = DOC-WAVE-2 DISPATCHED (claude/doc-wave-2) w/ the two banked
contradictions RULED: the op-registry page grounds in the REAL shape (klass/scope/
receipt — no invented schema enum; the read/propose/write story = S-stage architecture)
· all counts render from source (the "nine pressures" claim dies). PLAUSIBLE banked for
ROUND 3: credits-never-expire is enforcement-by-absence. Tasks #21/#22 CLOSED; #19/#20
ride doc-wave-2; the craft wave (#32) dispatches at ITS fold.
**⬛ FOLD ×2: THE RULINGS WIRING @ 14c504a4 + SURVEYOR S7 @ e1631619 (2026-07-17).**
**RULINGS WIRING (charges 1+2; charge 3 = an honored stop-and-report):** v2 DEFAULT-MINT
live at the three create chokepoints + the anon→signup arm (THE ONE DIAL
NEW_SETTLEMENT_LAYOUT_LAW_VERSION=2 — a taste veto reverts in one line; BEHAVIOR SHIFT
ruled+recorded: new saves render v2) · BESPOKE-STYLE PERSISTENCE (mapEdits.bespokeStyles;
fail-closed reads; drop-when-empty; applyMapEdit chokepoint; deleted-never-strands
pinned) · **CHARGE 3 QUEUED TO THE OWNER**: no sanctioned client path to the audit spine
exists — every route violates a standing fence (service-role-only RPC · no edge action ·
the Track-K no-new-shape clause); the record renders in ReceiptLine by design; THREE
OPTIONS on the owner queue (edge apply-log endpoint [manager rec] · signed 155+ RPC ·
blob key). Receipts on merged tree: 72/72 + tsc + dist 150/150; +38 B.
**S7 — THE TRUST LADDER IS COMPLETE S1→S7:** the signal registry v1 (47 proven reads,
additive-only w/ meaning-drift refusal — the tuning window mints INTO it) · StopConditions
behind the wall (determinism pinned through the REAL kernel: same seed ⇒ same stop tick,
receipts JSON-identical) · nudges CONSUME injectCampaignStressor (recon: no new primitive
needed; ceiling lockstep w/ realm severe) · standing instructions (suffix-only — the
static prefix byte-identical with/without, pinned; fence-breakout stripped) · the edge on
the S4-S6 spine + kill-switch 'autonomy' · the panel as the workshop's 5th stage
(picker-only; THE STOP RECEIPT w/ seed+engine version) · migrations 153/154 (head 154
contiguous) · +173 B. Receipts on merged tree: S7 battery 66/66 + strict 0/0 + dist
150/150. LANE CORRECTIONS BANKED: no Compendium op-page generator exists yet (my
dispatch overclaimed — it is the DOC WAVE's charge, flagged not invented) · S3-S6
compile-suffix adoption of standing instructions = a small follow-up seam (ROUND-3
stock) · DEPLOY.md posture prose was pre-existing stale ('eleven true' at fifteen) —
corrected+disclosed · ⚠️ NEW HAZARD MEMORIZED by the lane (preview-tool-serves-main-tree
— wrong-lineage recurrence #10 via a new vector; probe recipe inside). JUDGMENTs ×8
vetoable in the report (47-seed set · no-NOT combinators · cap=CATCH_UP_CAP_WEEKS
imported · 4cr provisional · shared analytics events). REMAINING LIVE: doc wave · big
content (parks) · landforms · gate wiring — then the craft wave at the doc fold →
COMPOSITE → PUSH → ROUND 3.
**⬛ FOLD: DOOR 2 — THE TABLE LAYER (fog v1) (2026-07-17) → w7-prep @ 08613d1b** (merge
of claude/fog-table-layer tip 9f41b75f, 6 commits off d0857995; 21 files NUL-clean; the
lane survived one limit strike + two stall cures). THE LAST MAP WAVE IS HOME: fogSessions
sidecar (interiorEdits idiom; denylist-safe pinned; dormancy byte-identical; reveals
keyed on stable model ids — a reroll never loses a reveal; bounded 12 sessions/400 ids) ·
semantic-snap brush along real edges (version-agnostic street synthesis) · SVG mask union
(overlap-correct; townMapDraw untouched) · the fogged handout through the WHOLE export
matrix (absent ⇒ byte-identical, toBe-pinned) · TWO AUDIENCES ONE PROJECTION (the live
player view renders EXACTLY the handout export — equality by construction) · fail-closed
(fogSessions ∉ PUBLIC_TOPLEVEL_KEYS, pinned) · THE PREMIUM GATE per the ladder ruling
(locked-VISIBLE drawn padlock + purchase moment; stored sessions never rewritten locked) ·
SM-5 analytics inherited (3 features, zero new names). Lane: 112/112 pins, +209 B eager
measured vs base (under the line), strict-clean own files. FOLD RECEIPTS on the merged
tree: fog pins subset 22/22 · tsc 0 · build ✓ · dist 150/150; **the clean full suite =
the composite gate by design** (the lane's full-suite runs were owner-parallel-load
flakes — every red green isolated + base-proven; both its real reds were its own and
fixed with proof). JUDGMENTs ×5 vetoable in the lane report (sidecar-over-mapEdits ·
mask-over-drawops · trampoline+lazy-body · purchase-modal-not-new-moment ·
handout-in-panel). SEAMS: §6 gallery full-mode strip rides the owner-gated gallery
opt-in · PDF/VTT fogged variants absent by design v1 · panorama shows no fog (a
presentation view). **ALL SEVEN MAP WAVES ARE NOW FOLDED.** LANDFORMS + GATE-WIRING
DISPATCH at this fold per the standing queue. THE SECOND LIMIT STRIKE (4 lanes killed
late-stage) recovered clean: doc-wave 4 commits + checkpoint · S7 six · rulings-wiring
two (one red file from done) · content-gt-final ELEVEN — the commit-early armor held
everywhere; all four resumed with focused-gate instructions.
**⬛ ERRATUM: THE W2 RE-DISPATCH WAS STALE (2026-07-17, the lane's stop-and-report —
verify-first catching the MANAGER's error at 17-tool-call cost):** W2 feed-retention was
ALREADY FOLDED 2026-07-16 via cherry-pick 4cf84a40 (patch-id identical to the parked
2f4f7b58; ancestor of the tip; retention 7/7 + the 0.45 anti-monoculture gate 3/3 green
on the current base; its bytes already inside the measured 1,034,683 closure). The
ledger's own 2026-07-16 satellite-queue row recorded exactly this ("W2 4cf84a40 already
ancestors — stale blocked-notes corrected") — the FP-G11 fold row's "W2 UNLOCKED"
dispatch reasoned from the stale round-21 memory without cross-checking that correction.
Task #33 closed ALREADY-DONE; the empty lane branch deletion BLOCKED by its worktree
checkout — left pinned like every other lane worktree (the lane's keep-judgment stands
after all; this row is the record either way). THE PROCESS LESSON, now standing: **a "parked/blocked" note is dead the moment
any ledger row resolves it — before dispatching ANY satellite, grep the ledger for its
LATEST mention, not its memory entry**; the round-21 memory is trued to match.
**⬛ FOLD: FP-G11 (2026-07-17) → w7-prep @ b745c20c** (one config-only commit; spot-checked
vite.config.js alone; build ✓ + dist 150/150 on the merged tree). RECLAIM: formatNumber
excised from eager engine-core (**−341 B**; resolves the FP-G7 deferral; no first-paint
importer existed). Closure **1,034,683**, margin **5,317**; RATCHET **HELD at 1,040,000**
(ratified — final tightening at the composite, the FP-G10 precedent). THE HEADLINE
CORRECTED + BANKED TO MEMORY (customregistry-deeagering-gated): ~41KB is real but the
whale tables do NOT drop and the blocker is a sync→async conversion on persisted-event-
writing deity actions — an owner-gated lane if ever needed, never a byte-wave rider; the
safe-reclaim space is now EXHAUSTED (every remaining eager table has a genuine first-paint
consumer). Spatial-slimmer deferral ratified (sub-350B real vs a dormancy-golden seam).
**W2 UNLOCKED: the five-day "re-apply when byte-free" precondition is MET** (+363 B
affordable) — the re-apply lane DISPATCHED per the standing rule (claude/w2-feed-retention
off b745c20c; re-express the change never merge the ancient branch; revalidate
feedDistribution 0.45 + goldens + true delta on THIS tree; the first lane briefed under
the new focused-gate protocol). Task #33; the composite waits.
**⬛ FOLD: CONTENT-VT-2 (2026-07-17) → w7-prep @ 1c22428c** (merge of claude/content-vt-2
tip 39a56a1d, 4 commits off a4343044; spot-checked: exactly 8 files, fence held, NUL
clean). The view-time-thin surfaces CONTENT-VT deferred-with-reason are GROWN: newsBody
1→4/cell · rumor headline frames 1→4/band (seeded on eventRef — the same event frames
identically at every settlement that hears it) · chronicle quiet-advance framing 1→4/span
· the market crier 1→4/tag. Every mechanism CANONICAL-AT-ZERO (all legacy/id-less callers
byte-identical); facts ride every frame unchanged; **0 eager bytes grep-proven** (all 14
new strings in lazy chunks only); **zero golden/snapshot movement** (the rumor golden
hashes structured ledger records, never headlines). Charge-4 sweep dispositioned every
other 1-variant view-time surface (surveyor's notes/whispers/S2 titles correctly
deferred w/ survey-grounded reasons). Lane ran the FULL gate green pre-protocol-change
(suite exit 0, strict 0/0, dist 150/150); fold receipts on the merged tree: pins 61/61 ·
tsc 0 · build ✓ · dist 150/150. JUDGMENTs ×4 vetoable (local fnv copies per the
chunk-isolation idiom · the market-crier exact-frame assertion evolved to a fact-pin —
a unit-assertion update, NOT a golden re-record · chronicle populated-branch untouched ·
eventRef seeding). One honest view-time note recorded: WHICH equally-valid variant
renders differs for id-bearing entries — the intended variety, nothing persisted moves.
**⬛ THE GATE PROTOCOL CHANGE (2026-07-17, owner: "if we switched gates to fable will it
be faster?" — answered + adopted, vetoable):** model-switching would NOT speed gates
(vitest wall-clock is machine-bound; Fable-as-implementer would also invert the standing
model split). THE REAL SPEEDUP ADOPTED: **lanes run FOCUSED gates only** (own tests +
tsc + strict + lint + build + dist + closure); **the FULL suite runs ONCE PER FOLD, by
the manager, in the fold tree, foreground.** Three wins: full-suite runs drop from
per-lane to per-fold · the stall class's trigger (babysitting long suites) mostly
disappears · contention flakes fade (the 18s-alone/77s-under-load advancePauseResume
receipt). Honest cost: cross-suite regressions surface at fold, not in-lane — same
checker, hours later, still pre-merge. Applies to all future briefs; the two in-flight
gate-stage lanes keep their current instructions.
**⬛ SWEEP #6 BANKED + LAW §10b (2026-07-17):** the tablet research corrected the law
before anyone built from it — **TABLET GRIP INVERTS THE PHONE** (thumbs at the side
edges/corners; bottom bars ergonomically hostile on a held tablet — the FIELD bottom-
third law does NOT port to THE SPREAD) · landscape = the SYNTHETIC SPREAD (paired
recto/verso compositions, never portrait-but-wider) · the Van de Graaf/Tschichold canon
as COMPUTABLE text-block geometry (manuscript grammar by construction, not padding) ·
Flipboard-class FOLIO TEMPLATES for generated content (bespoke-looking output from
procedural input — the exact match for a generator product) · one signature handleable-
artifact interaction, maintained. §10b committed on w7-prep. ALL SIX RESEARCH SWEEPS
NOW BANKED (30 agents, 0 errors). **DECREE-PROVENANCE TIMING (owner asked "does any of
this need to be fixed?"):** the one real fix from the refutation (approved proposals
apply without provenance recording) STAYS IN ROUND 3's pre-approved stock — vetoable
JUDGMENT: the fix touches the world-pulse apply path contested by two live lanes
(FP-G11's slice hook + rulings-wiring's audit-spine); the flag is dark until the regen
so no user-visible window exists; ROUND 3's fix waves verify it adversarially. Pulls
forward on the owner's word once those lanes fold. Fog re-stalled (5th instance) +
re-cured by demand #2; its code committed @ 3234076b before the stall — zero risk.
**⬛⬛ THE THREADING REFUTATION (2026-07-17) — ENGINE LIFT #2 CLOSES AS
INVESTIGATED-AND-REFUTED, the stop-and-report doctrine at its best.** The lane made ZERO
edits and disproved the commission's premise with EXECUTED PROBES on lit runs: (1) all
50 recorded edges in real advances are same-tick news→outcome — causedBy is 100%
unthreaded exactly as the seam said; (2) the engine's true causality is CROSS-ADVANCE
and ENTITY-KEYED (coups resolve from stressor.id; returns from deployment ledger keys —
entity keys, never durable receipt ids; the parent receipt lives in a PRIOR advance);
(3) the chronicle reader scopes recorded cones to SAME-ADVANCE co-minted node pairs —
so kernel-threaded edges would be stored and never surfaced. The only true-edge paths:
persist parent-receipt ids onto world-state entities (VIOLATES THE SHAPE LAW) or a
cross-advance chronicle reader (a DISPLAY capability, out of fence, the brief's named
design-smell). THE COMPLETE MINT-SITE CENSUS is dispositioned in the lane report
(cross-advance/entity-keyed ×9 families · root-cause ×6 · no-mint ×16; the one
same-advance candidate found and rejected as sibling-not-parent). CONTINGENCY HAZARD
BANKED: worldState.proposals clones outcomes (applyWorldPulse:1000) — any future
causedBy context leaks there; scrub + whole-worldState residue pin required. VERDICT:
freely-given ruling #8 VINDICATED on grounds unknown when the owner overrode it; the
sanction closes honorably (the owner approved a premise the probes then refuted — the
refutation IS the deliverable). THE REAL UNLOCK named + owner-queued post-launch: **the
cross-advance recorded-cone chronicle reader** (display lift; the ledger already stores
cross-advance edges it would consume). ROUND 3 inherits the census + probes as
causality-review instruments. Decree-effects finding for ROUND 3 stock: approved
proposals apply WITHOUT provenance recording (applyWorldPulseProposal path) — a genuine
recorded-causality gap worth a fix wave.
**⬛ THE TABLET COMPANION MANDATE (owner, 2026-07-17: "we need a tablet companion… This
one can include the realm. do all the fixings"):** the THIRD POSTURE joins the law —
DESK / FIELD / **THE SPREAD** (tablet: the open book + the shared table surface;
**REALM-CAPABLE by owner ruling** — the desktop gate becomes desk+spread). Law §10
committed on w7-prep; brief phase 4b added; sweep #6 dispatched (wf_3c80f28a: premium
tablet craft · the tablet at the TTRPG table (GM-screen + the flat player-facing shared
surface — the fog layer's true home under the visibility split) · touch-first complex
tools (drag-placement precision) · the posture-model breakpoint problem + the FMG-touch
critic). The preview review gains the tablet viewport, both orientations.
**⬛ THE SUBSTANCE SWEEP BANKED (wf_c143a10f, 5/5):** the external substance bar for
ROUND 3 — headline principles: THE PLAYER-MODEL PRINCIPLE (Sylvester: unperceived depth
is noise; grade every kernel by its perceivable surface — the Ultima Online unnoticed-
ecology cautionary tale) · STORY GENERATOR NOT SKILL TEST (disproportionate pushback +
recovery arcs; loss transforms, never merely terminates) · APOPHENIA AS THE CONVERSION
ENGINE (abstracted feedback + long-term relevance; under-specify interior states,
over-specify identity + consequence — a receipt that states feelings leaves nothing to
author) · ANTI-NUMERIC CONSEQUENCE (Adams: "lost an eye" retells, "-12 HP" doesn't;
scars/grudges/heirlooms over modifier-soup) · **WRITE THE TARGET STORIES FIRST** (the
DF method: golden narratives as acceptance tests — if no mechanism could produce the
story, backlog; if it can't be PERCEIVED producing it, bug) · THE PLAYER-AS-ACTOR
(receipts should regularly say "because you…"; spectator chronicles get retold by
nobody). ROUND 3's substance graders hold the composite to these; the golden-narrative
corpus is recommended as a standing ROUND 3 instrument.
**⬛ THE ORGANIC CRAFT LAW FROZEN + THE WAVE BRIEF COMMITTED (2026-07-17):** both craft
sweeps banked (10/10 agents) → docs/DESIGN_ORGANIC_CRAFT.md frozen on w7-prep (the one
fiction = THE SURVEYOR'S WORKING DESK; the artifact/instrument split; manuscript grammar
— scale/ink/position/rubrication replace containers; typography tiers w/ faux-small-caps
ban; seeded ornament UNDER GOLDEN DISCIPLINE; the legibility floor; the mobile field
companion §7 w/ the realm desktop-gate; the performance law §8) +
docs/briefs/W_ORGANIC_CRAFT_WAVE.md (5 phases w/ the taste veto BETWEEN sample-set and
app-wide sweep; inherited rulings incl. **OFFLINE SCOPED OUT** — the service-worker/
iOS-eviction/snapshot-vs-migration-staleness complex is owner-queued as its own charge,
no offline promise in copy (the worse-than-nothing precedent); the /map/ webmanifest
partial-scope install trap recorded). The critics' repo-verified catches ruled in:
mid-range-device budgets join tests/build as a ratchet; fonts subset w/ byte budget;
turbulence/blend-mode bans; the existing isMobile layer extended never greenfielded.
The wave is successor-dispatchable from the brief at the doc-wave fold.
**⬛ THE SUBSTANCE BENCHMARK SWEEP DISPATCHED (2026-07-17, owner interjection: "what
about the substance?" — the form/substance symmetry closed):** the design waves got four
external-excellence sweeps; the substance had only ever been benchmarked against ITSELF
(its constitution, its own rounds). Sweep #5 (wf_c143a10f) builds the missing external
bar: the emergent-narrative canon (Tarn Adams / Sylvester's story-generator doctrine /
CK3 drama design; the anecdote-factory principle + the stat-soup failure mode) · TTRPG
TABLE-substance (the GM-craft canon: what world-detail generates SESSIONS vs shelf-weight
— the lonely-lore problem; fronts/clocks) · living history (what makes generated history
FEEL like history, not a log — the history-soup fix) · THE DEPTH-PERCEPTION GAP (the
Nemesis-system solved case: what makes players CORRECTLY believe a world is deep — this
product's own recorded risk, twice graded product-below-code). The critic adds the
determinism-as-story-value + DM-as-audience angles. OUTPUT FEEDS ROUND 3: the substance
graders hold the product to these five principles alongside the four crowns; the gap
register inherits any misses. Substance census of the live machine at dispatch: 5 of 8
build lanes are substance (content ×2, provenance threading, S7, rulings wiring); the
entire tail (ROUND 3 → soak → tuning) is substance-verification by design.
**⬛ RESEARCH SWEEP #3 BANKED (wf_cd021516, 5/5 agents, 0 errors — the organic craft
corpus):** headline first principles for the law: **AUTHORSHIP VISIBLE** (the handmade
read = evidence a person decided — signed/dated elements, one voice, structures only
this product could have; the CMS-slot smell is the tell) · **CONTENT-FIRST ASSEMBLAGE**
(Chimero's grain: layout emerges from what it holds; no scroll-jacking slickness) ·
**BREAK THE CONTAINER HABIT** (Müller: containers-in-containers IS the sameness; compose
spreads, not stacks — the hero/three-cards/feature-rows skeleton is the template tell
whatever skin it wears) · **BESPOKE FORM PER SURFACE** (The Pudding: dossier ≠ gallery ≠
settings in composition; one type/color system, different forms) · **CRAFT LIVES IN
TYPOGRAPHIC MICRO-DECISIONS** (Tufte/Butterick: measure, sidenotes, true small caps,
body-colored underlined links) · **DENSITY WITH THE ICEBERG** (Gwern: dropcaps, collapse,
near-monochrome discipline + the design-graveyard removal discipline) · **DRAWN-FOR-
PURPOSE MARKS** (Appleton: icon-library glyphs at display level = a named AI-slop tell) ·
**ONE FICTION, TOTAL COMMITMENT** (Poolsuite: the surveyor's working desk lives in every
empty state and error message; thin theming over standard components reads as a skin) ·
**WHIMSY UNREPEATED** (a quirk repeated becomes a system). Full results + journal paths
in DOSSIER v2's recovery block (wf_cd021516-430). Sweep #4 (mobile) still running; the
corpus law + reconciliation brief write when both are banked; the wave builds at the
doc-wave fold.
**⬛ THE MOBILE COMPANION MANDATE + REALM DESKTOP-ONLY (owner, 2026-07-17: "make sure
there is a 10,000 mobile companion piece as well… make sure realm is desktop only"):**
the mobile experience carries the SAME $10k bar — a crafted FIELD COMPANION, never a
collapsed desktop. Research sweep #4 DISPATCHED (wf_65e6aacd: premium mobile craft ·
document-layout collapse · THE AT-TABLE COMPANION use-case (the DM's phone at the game
table — glanceability, one hand, dim rooms, interruption-resilient; DM Summary/Daily
Life are the vehicle) · graceful desktop-gating patterns + critic). PRODUCT RULING
RECORDED: **THE REALM (world map + canonize + advance controls) IS DESKTOP-ONLY** —
mobile meets a confident built-for-the-bigger-canvas gate with continuity (never
apologetic error-speak); town maps/interiors/dossiers stay mobile (pending the sweep's
verdict on map-viewing ergonomics). The organic craft wave (#32) absorbs the mobile
companion charge; the preview legibility review now runs BOTH viewports incl. a
dim-environment pass. The doc wave received the mobile addendum live (authored
single-column collapse, mobile-tuned type, realm framed desktop-confident).
**⬛ THE QUALITY BAR (owner, 2026-07-17, verbatim: "make it look like a $10,000 website
with all of these functions and principles. thank you so much!"):** the organic craft
wave + the documentation wave build to BESPOKE-AGENCY STANDARD — every choice authored,
never defaulted; optical alignment, tuned small-caps tracking, held baseline rhythm; ONE
hand across every page (the house rules/rose/rubrication family); RESTRAINT AS LUXURY
(the $10k look is impeccable typography/spacing/hierarchy, not ornament volume). Relayed
to the live doc wave; binds the organic wave's brief; the preview legibility review
judges against THIS bar.
**⬛⬛ THE ORGANIC CRAFT LAW RATIFIED (2026-07-17, owner: "Do it! But before you do, look
online at the best examples… identify first principles… then reconcile… and build
everything appropriately" + the preview legibility mandate):** the UI redesigns under the
product's own map laws — asymmetry with provenance (SEEDED ornament via the FNV idiom,
never jitter) · period craft never age damage (engraved rules in 2-3 ink weights,
rubrication over callout boxes, manuscript grouping — rules/marginalia/initials — over
card grids, ink-tone elevation, NO drop shadows) · THE ARTIFACT/INSTRUMENT SPLIT (display
surfaces organic; interaction targets geometric, quiet, accessible — the surveyor's field
kit: hand-drawn world, machined instruments) · product-output-as-art · boxes rare and
meaningful (seal/plate/charter only). MOTIVE on record: the owner rejects the
platform/AI-made subconscious read; immersion maximized WITH digestibility. SEQUENCE (the
owner's ordered method): research sweep #3 DISPATCHED (wf_cd021516: handcrafted-web
first principles · print-craft chrome · diegetic game UI · legibility-on-craft w/ the
audit checklist + critic) → the manager writes the corpus law + reconciliation brief →
THE ORGANIC CRAFT WAVE builds AT THE DOC-WAVE FOLD (single-writer on tokens/primitives;
task #32) → **THE PREVIEW LEGIBILITY REVIEW gates the fold** (owner-mandated: the manager
drives the app in the browser preview — every surface readable against its background,
navigable; the research's audit checklist is the instrument) → owner taste veto on a
sample screen set before the app-wide sweep. The doc wave received the direction as a
mid-flight addendum (rules-over-boxes · ink-tone elevation · the split · seeded ornament ·
legibility floor) so the four pages are BORN under the law. Presentation only — zero
logic, zero goldens.
**⬛ ENGINE LIFT #2 SANCTIONED (2026-07-17, owner: "i also approve this" — the
provenance causedBy threading; OVERRIDES freely-given ruling #8):** the owner personally
sanctions the second engine-frozen lift. Lane claude/provenance-threading off a4343044,
EIGHT lanes live. THE SHAPE LAW (the safety that makes this sane at max concurrency):
causality flows as CALL-CONTEXT to the provenance writer — outcome objects never gain
fields; world state byte-identical dark AND lit except the provenance sidecar; ALL
dormancy goldens must stay green untouched. Deliverables: kernels thread cause-references
at their mint sites (additive optional params, ceiling-safe lazy leaves) · THE THREADING
CENSUS (every mint site dispositioned threaded/no-known-cause/deferred — committed doc,
walker-pinned, no silent partial coverage) · flags-on multi-hop cone proof (decree →
outcome → downstream RECORDED) · zero chronicle changes (the recorded/inferred labels
get truer for free — a needed chronicle change = design smell, stop-and-report) ·
edge-rate/eviction verified vs the 750 KB ceiling. ROUND 3 reviews it with everything.
**⬛⬛ THE FREELY-GIVEN RULINGS (2026-07-17, owner: "i give my decision freely where
appropriate for this!" — the Class B/D decisions made by the manager under explicit
grant; EVERY ITEM VETOABLE):** (1) **PROSE TASTE: APPROVED** — the sample holds the
register (fact + complication, dry, specific; "The theology was settled quickly. The
estate is where the fighting is."); TWO REQUIRED AMENDMENTS: the faction de-clunk rule
(descriptor-swap-first, banned-stack guard — "The Commercial Circle Inner Circle" class
dies) + the govFaction casing pass (all 9, deliberate shift in the parked lineage). THE
BIG CONTENT WAVE DISPATCHED (claude/content-gt-final stacked on 577179fb; parks;
supersedes both content parents in the composite). (2) **V2 MAP TASTE: PROVISIONAL
PASS** — engineering criteria conclusive (Lynch ≥0.66 across 20 configs, determinism,
morphology coverage); the aesthetic veto STAYS OPEN until the regen (revert = one
config line); default-mint wiring dispatched. (3) **ATLAS SAMPLES: PROVISIONAL PASS**
(same logic; display-only, instantly revertible). (4) **THE ENTITLEMENT LADDER: RULED
as recommended** — FREE: map view · provenance hover · five lenses · panorama · gallery
view. CARTOGRAPHER: map editing · DM pins · change-view depth · fog · interiors (ONE
free sample per settlement) · v1→v2 redraw. Bundle $2.99 unchanged. SURVEYOR: AI.
Engine NEVER tier-gated (constitutional). Lock-glyph-teaser everywhere. Relayed
mid-flight to fog + the doc wave; SM-5-pins/interiors wiring at the fog fold (#30).
(5) **BESPOKE-STYLE STORAGE: mapEdits.bespokeStyles** (blob-resident, zero migration;
per-account library = post-launch stock). (6) **AUDIT-SPINE: build additively** (155+
only if unavoidable; server-surface gaps stop-and-report). Both in the RULINGS-WIRING
lane (claude/rulings-wiring). (7) **ANON/GALLERY EXPORT: NO for v1** (caps-on-actions-
never-render; sign-in is the conversion step). (8) **PROVENANCE causedBy THREADING:
STAYS POST-LAUNCH** — decided on merits (kernel-wide ceiling-file edits at max
concurrency vs a payoff that matters only lit-and-launched). SEVEN LANES NOW LIVE (fog ·
doc wave · S7 · content-vt-2 · fp-g11 · content-gt-final · rulings-wiring).
**⬛ THE PULL-FORWARD SWEEP (2026-07-17, owner: "is there anything waiting post-resurvey
or post-soak that we can build now for the resurvey to validate?"):** the deferred stock
audited into three classes. **CLASS A — DISPATCHED NOW:** CONTENT-VT-2 (the view-time
selection mechanisms CONTENT-VT deferred-with-reason; lands free, claude/content-vt-2)
· FP-G11 (the byte reclaim pulled ahead of the composite; headline candidate = the
customRegistry de-eagering −46KB ceiling; claude/fp-g11; W2 feed-retention viability
verdict included) · NON-WATER LANDFORM RENDERING (the v2 fenced follow-up — marsh/dunes/
flank become VISIBLE; queued at the fog fold, shared map surface). FIVE LANES now live.
**CLASS B — BLOCKED ON THE OWNER, NOT THE SOAK (deciding these tonight puts all of it in
front of ROUND 3):** the v2 map taste veto (→ default-mint wiring) · the prose taste
sample (→ THE BIG CONTENT WAVE: ~245 institution descs, NPC pools, history-event wiring)
· the entitlement ladder (→ gate wiring across SM-5 pins/interiors/fog/pricing cards) ·
the bespoke-style storage ruling (→ persistence builds) · the AI-op audit-spine ruling ·
the anon/gallery export affordance decision. **CLASS C — GENUINELY IMMOVABLE:** dial
values, knob entries, tuning counsel, re-certs (all soak-OUTPUT-dependent by definition)
· S4+ content-plane knobs (owner-gated on LIVE post-launch acceptance metrics) · fog
realtime v2 (scope discipline, recommend keeping post-launch). **CLASS D — OWNER-CHOICE
ENGINE ITEM (flagged, not taken):** provenance causedBy kernel threading (dark ⇒
byte-identical; would deepen ROUND 3's causality review; needs another engine-frozen
lift — the owner's call, not the manager's).
**⬛ THE LIMIT STRIKE + TRIPLE RESUME (2026-07-17 evening): the session limit killed all
three live lanes mid-work (fog · doc wave · S7); the dossier's law held — limits kill
reasoning, not disk.** Survived state, verified before resuming: fog banked commit
59dde1ea (engine core: reveal sidecar + snap geometry + fogged export) + 4 WIP files ·
doc wave 2 WIP files, ZERO commits (⚠️ the near-loss case — its resume instruction
escalates commit cadence to per-page minimum) · S7 clean-tree exploration, findings safe
in-transcript (key: injectCampaignStressor IS the existing nudge op to consume; no
existing registry/StopCondition machinery — build both). ALL THREE RESUMED from
transcripts with checkpoint-first instructions. PROCESS LESSON for every future brief:
the commit-early rule is limit-armor, not tidiness — a lane with zero commits is one
limit away from losing everything but its transcript.
**⬛ S7 RE-SLOTTED PRE-ROUND-3 + DISPATCHED (2026-07-17, owner: "I want it built now for
the resurvey to check for any bugs" — THE MACHINERY-NOW/VOCABULARY-GROWS COMPROMISE):**
the tuning-window slot held S7 only because StopConditions wanted the knob vocabulary;
the compromise splits them — S7's MACHINERY builds NOW (typed StopCondition evaluator
behind a schema wall referencing only REGISTERED signals · acceleration ops as pressure
nudges through existing dial/op vocabulary, never state-jumps · standing campaign
instructions as compile-suffix injection, never engine state · the panel w/ kill-switch +
early-access + money moments) while THE SIGNAL REGISTRY v1 seeds from the proven stable
set (the 16 causal variables, 9 pressures, war/peace states, bands, ticks — golden-pinned
for months) and grows ADDITIVE-ONLY: the tuning window mints knob entries into the SAME
registry as DATA (the A3 empty-registry-rails + facet-law precedents; zero machinery
rework by design). ROUND 3 now reviews real autonomy code — the owner's goal. Lane:
claude/surveyor-s7 off a4343044, migrations 153+, fence-disjoint from BOTH live siblings
(fog: townMap; doc wave: pages — S7's op-registry additions surface on the Compendium's
generated page automatically). THREE LANES NOW LIVE; the composite waits for all; task
#9 (tuning) keeps knob-minting + registry EXTENSION + counsel.
**⬛ THE DOCUMENTATION WAVE DISPATCHED (2026-07-17, owner: "can you run this now?" —
early dispatch owner-ordered, ahead of the fog fold):** ONE Opus lane, claude/doc-wave
off a4343044, executing docs/briefs/W_DOCUMENTATION_WAVE.md as law + both banked research
sweeps as inputs. CONCURRENCY SAFETY (checked at dispatch): zero file overlap with the
live fog lane (pages/copy vs map internals; the wave consumes map modules READ-ONLY for
fixtures/catalogs; townMap components explicitly fenced OUT of the wave). Notable
brief-plus additions in the dispatch: the failure-policy sentence ("never charged for a
failed task") must be VERIFIED against actual edge behavior before it may be written —
stop-and-report if the edge does not refund (a marketing claim is a claim); the demo-world
seed = one config constant (the owner picks the final seed); the two source ratchets that
bit the panels lane (inline slugify, native title=) pre-warned. Tasks #19-#22 in flight
together. The fog-fold blocker on the wave is OWNER-OVERRIDDEN; the composite still waits
for BOTH.
**⬛ FOLD: THE AI SURFACE PANELS (2026-07-17) → w7-prep @ a4343044** (merge of
claude/ai-panels tip a221c40c, 4 commits off eb958f4b; spot-checked — FENCE HELD (zero
townMap-component/engine/edge-function edits), 15 files NUL-clean; recovered from the
stall class by the status demand — the cure is 4-for-4). The write stages are CLICK-ABLE:
custom content w/ per-field Mechanical/Flavor/Unsupported badges + the honest
no-rule-for-that list · style overhaul w/ LIVE map preview through the pure renderer +
flip-back to the permanent base lenses, decline-persists-nothing · construction w/ the
config wall, the real comparator's deviations in plain speech, bounded DELTA-ONLY revise
("sends only the N deviations — no re-grounding"), settlement-lands-as-draft +
realm-canonizes-nothing surfaced honestly · accept→mint w/ the explicit consent barrier,
unroutable-surfaced-never-dropped, and the reproducibility receipt rendered (engine ver ·
seed · N applied). One Surveyor's-workshop launcher (right-dock, JUDGMENT #1); S1 money
moments verbatim; kill-switch refusals cordial + "nothing was charged"; early-access
badges fail-honest (absent ⇒ shown). Lane gates foreground: suite 12,519/2 (both =
the recorded advancePauseResume load-flake, green isolated) · +184 B eager CONFIRMED
vs a temp-worktree base build (under the line) · lazy-membership contract + anti-vacuity.
FOLD RECEIPTS on the merged tree: lane pins 26/26+1skip · tsc 0 · **domain:strict RUN
EXPLICITLY: 0/0 ceiling** (the chip burn-down HOLDS with panels merged) · build ✓ · dist
150/150. JUDGMENTs ×5 vetoable (launcher shape · the townMapStyleWall annotation touch —
ACCEPTED, it kept tsc green · session-held style collection pending the owner's storage
ruling · draft-save commit path · transport shape-tolerance w/ client-side re-validation).
SEAMS: edge round-trips PLAUSIBLE-by-pattern (one browser click per stage at the soak) ·
panel analytics events exist but unfired (small follow-up — ROUND-3/doc-wave stock) ·
edge body field-name alignment checked at ROUND 3. **ONLY FOG REMAINS** — then the
documentation wave → composite → PUSH → ROUND 3.
**⬛ RULING #7 THIRD AMENDMENT (2026-07-17, owner: "do the push after the composite"):**
the chain is now: fog + panels fold → THE DOCUMENTATION WAVE → **THE COMPOSITE (full
gate)** → **THE PUSH (the backed-up state = the gate-verified whole; the composite
branch joins the push list)** → ROUND 3 → the tail unchanged. Task #12 deleted/recreated
as #23 to avoid a dependency cycle (composite no longer waits on the push; the push
waits on the composite; ROUND 3 waits on the push). The single-machine window now runs
through the composite gate — the owner's accepted trade, restated once. ALSO: the panels
lane stalled in the identical background-wait class (4th instance) — status demand
issued (the cure's record now 3-for-3 pending its result); the fog lane's brief already
carried the foreground warning; future briefs escalate the wording from warning to the
hard rule with the sibling stall count.
**⬛ RULING #7 RE-AMENDED (2026-07-17, owner: "do it before the push"): THE
DOCUMENTATION WAVE BUILDS BEFORE THE FIRST PUSH.** The prior push-before-doc-wave
judgment is OWNER-VETOED; the chain is now: fog + panels fold → THE DOCUMENTATION WAVE
(#19-#22, the committed brief) → THE PUSH (everything built, everything backed up) →
composite (+ FP-G11 if demanded) → ROUND 3 → the tail unchanged. Recorded without
re-litigation: the single-machine window extends through the doc wave — the owner's
accepted trade, consistent with the literal "after everything is built" ruling. ALSO
RATIFIED INTO THE LEDGER: the owner-side chip session FOLDED the domain-strict burn-down
directly onto w7-prep @ 9150b464 (six v2 files annotated strict-clean, 112→0, ceiling
stays 0 — burn-down over re-baseline, the better fix); the SM-5 spurious-gate finding is
CLOSED; the piped-exit-masking hazard has its own memory.
**⬛ FOLD: DOOR 1 — THE SPATIAL CONSEQUENCE LAYER (2026-07-17) → w7-prep @ 2c980e4e**
(merge of claude/spatial-consequence 3fee34ee off 66eda8e8; spot-checked, 17 files NUL-
clean; recovered from the stall class by the status demand — the cure is 3-for-3). THE
ENGINE'S SANCTIONED REOPENING IS BUILT AND DARK: the sidecar substrate derived at
canonize from buildTownMapModel's OWN OUTPUT (coherence by construction — the
commissioned JUDGMENT, ratified), structural-signature reuse, flag-gated dynamic import
keeping townMap out of the engine graph; three consumers behind virtual
spatialConsequenceEnabled — calamity WHERE-not-HOW-MUCH (toll totals untouched BY
CONSTRUCTION: the reader kernel cannot return a worldState; bucket-neutral quarter
beats, regex-pinned) · deterministic siege breach ({wallSegmentId, districtId} into
siege_lifted; fabric scar gains seg/did strictly-additively; approach = stable FNV pair
hash, aspatial-safe) · covert diffusion along real district adjacency, leash-bounded,
magnitudes untouched. DORMANCY GOLDEN COMMITTED (dark byte-identical over real pulse
ticks + contract + lit anti-vacuity). Lane gates all FOREGROUND: 12,125 tests / 0 fail
(3 chunks) · +34 tests · tsc 0 · four validators · dist 145-green on its base · F24 scan
15/15. FOLD RECEIPTS on the merged tree: lane pins + fabric dormancy cross-check 43/43 ·
tsc 0 · build ✓ · dist 146/146. **MANAGER SIGN-OFF EXECUTED (vetoable): the +652 B eager
delta SIGNED as-built** (the flag-gated canonize hook in the eager slice; the lane
stop-and-reported per the brief; re-shaping a verified store seam for ~350 B was judged
worse than the bytes — the slimmer-hook option is recorded FP-G11 stock; margin ≈5,249).
JUDGMENTs ×9 vetoable in the lane report (flammability/adjacency/strength tables; ONE
new recorded dial family CALAMITY_LEASH .55 / COVERT_LEASH .5 / DIFFUSION_HOPS 2 =
tuning-window stock). SEAMS: fabricRead render-side breach surfacing = map-UI stock ·
conquest-ended sieges scar-less (unchanged) · the 112-error townMap strict debt
CONFIRMED pre-existing at pristine base (the chip session owns it). REMAINING LANES:
fog + panels — then THE PUSH.
**⬛ FOLD: SM-5 THE MAP LEGIBILITY WAVE (2026-07-17) → w7-prep @ d0857995** (merge of
claude/sm-5-legibility tip f2e3d755, 8 commits off 66eda8e8; spot-checked, 32 files NUL-
clean). ALL SEVEN delivered: provenance hover + the surveyor's-read drawer (self-gates on
v1) · the change view (mirror-not-rederive; dark-fabric whisper; NO fabricated deltas —
prominence has no baseline, honestly omitted) · edge annotations as honest wayfinding
signs (VERIFIED no distance data exists ⇒ no invented numbers; real-weeks digest = a
recorded seam) · the 5th ACCESSIBLE lens (Okabe-Ito; the four existing lenses proven
byte-identical BEFORE the additive re-mint) · the DM pin layer (denylist-safe
mapEdits.annotations, audience fail-closed, export appends — the draw-list golden never
perturbed) · atlas-identity craft samples (docs/samples/atlas/ — TASTE VETO #3 QUEUED;
realm-lens unification = an owner-gated seam, FMG-bound) · MAP-LAYER ANALYTICS (ONE
feature-discriminated town_map_layer_used, EVENTS_REV 10, +43 B = the only eager byte
cost; fog/interiors inherit the helper). FOLD RECEIPTS on the merged tree: 123 tests /
12 files (pins + style/edits goldens + interior cross-checks) · tsc 0 · build ✓ · dist
146/146. Closure 1,034,099 (margin 5,901). ⚠️ LANE FINDING (pre-existing, NOT SM-5's):
**the v2 fold's domain:strict gate passed spuriously — the baseline is stale (~550
noImplicitAny in the six townLayoutV2-family files, byte-identical to base)**; the
owner-side chip session (task_be620e27) is fixing exactly this; fold-receipt discipline
gains "run domain:strict explicitly, never via tail-pipe". Also confirmed pre-existing:
the advancePauseResume 20s-timeout flake (passes at 90s). JUDGMENTs ×4 vetoable in the
lane report (palette-not-pattern a11y · baseLenses stays 4 for AI composition ·
glyph-only export markers · pins ride the existing editing gate pending the ladder).
**FOG (DOOR 2) DISPATCHED off d0857995** — the last map wave; then panels remain.
**⬛ THE DOCUMENTATION WAVE BRIEF COMMITTED (2026-07-17):
docs/briefs/W_DOCUMENTATION_WAVE.md** — both sweeps banked (10/10 agents) and RECONCILED;
the critics' contradictions ADJUDICATED (8 rulings, each vetoable): About = pure trust
page (no ladder) · "credits" survives as wallet unit, pages lead with named-task
dollar-anchored menus + the failure policy · badge Cartographer, WALL Surveyor, founder
= charter-seal object · the AI claim lives in About+op-registry, never hero/pricing ·
the data-longevity covenant assembled · receipts generated-never-hand-typed w/ the
publishable list OWNER-GATED · Compendium seeds from a canonical demo world (seed =
owner call) · no third sweep. Page skeletons fixed (About 6-band manifesto arc w/ the
tick diagram + same-seed demo · Compendium hub-and-spoke w/ per-entry pages + A-Z index ·
Pricing 5-band w/ the $2.99 bundle LEADING the one-time lane + Cartographer-as-service
framing · Welcome additive). ART LAW: period craft never age damage; one house rose;
the product's own output is the art; no stock, no AI illustration. The wave is now
successor-dispatchable from the brief alone.
**⬛ WELCOME PAGE ASSESSED + COMMISSIONED (2026-07-17; task #22 — THE DOCUMENTATION
WAVE's fourth member): RECONCILE, DON'T REBUILD.** The best-aligned page of the four
(~75% on-purpose): the salt-road narrative, the REAL-ENGINE-OUTPUT fixture w/ the
"Forge this exact town / Same seed, same town, every time" determinism proof, real
gallery cards w/ zero-shift fallback, the honest AI disclosure, hero-only-eager perf —
ALL PROTECTED. The wave adds: (1) THE MAP WAYPOINT (the missing crown on the road — v2
map + lens flip + provenance tease via the fixture idiom); (2) the Voice section's "the
only AI feature" line EVOLVES before it becomes false at launch (keep the disclosure
instinct; move to the schema-wall promise); (3) the closer's tier strip gains Surveyor +
config-sourced facts (VERIFY the anon "completely randomized" line vs tierFacts); (4)
landing-funnel analytics reconciled w/ the map-layer pattern. JUDGMENT (vetoable): no
third research sweep — sweeps 1+2 cover landing patterns.
**⬛ RESEARCH SWEEP 1 BANKED (wf_7ada24b2-812, 5/5 agents, 0 errors):** manifesto/
medieval-art/market/digestibility + critic — full results at the task output file +
journal.jsonl (paths in DOSSIER v2). Headline patterns for the brief: the Obsidian
covenant (immutable one-sentence promises + the maker's face) · Ink &amp; Switch numbered
ideals + honest comparison matrix · Ghost live-receipts (verifiable artifacts over
claims) · the Ciechanowski dependency-order explainer (one annotated tick diagram) ·
Anthropic's pre-emptive concession for the AI section · Tarsnap threat-model disclosure.
Sweep 2 (wf_01b77ea7) still running. ⚠️ THE SPATIAL LANE STALLED in the recorded
phantom-monitor class ("wait for the monitor's notification") — the SendMessage status
demand issued (the cure is 2-for-2 across the program).
**⬛⬛ THE RESUME DOSSIER v2 (2026-07-17 evening — the owner expects the 5-hour window
cut; A SUCCESSOR STARTS HERE).**
**STATE:** code truth = `claude/w7-prep` @ **eb958f4b** (worktree
.claude/worktrees/agent-a04d3f325c72e62dd). Main tree = LEDGER-ONLY (the wrong-lineage
trap is at 9 recurrences; THE HARD GATE: `[ "$(git branch --show-current)" = "<expected>" ]
|| exit 1` as the FIRST clause of every state-mutating compound; python replace() with an
absent anchor no-ops silently — assert anchors). Folded this session: gallery-fix
469db96a → S4-S6 9d86991e (migrations 151/152, head 152 contiguous) → layout-v2 66eda8e8
→ interiors eb958f4b. PARKED for the composite: claude/generation-time-content-dossier @
577179fb (SUPERSEDES claude/generation-time-content — take the dossier branch) ·
claude/w-r2-g2 @ aec57981. Budget margin ≈5,944 B (FP-G11 reclaim likely at the
composite). EXEMPT_CEILING signed 69. All RULING #5/#8 authorities standing; THE ONE
REGEN pre-signed (six flags incl. spatialConsequenceEnabled).
**THREE LANES LIVE (worktrees/commits survive limits):** 1. claude/sm-5-legibility (off
66eda8e8; agent-a6f40f33f3d58a4ef): six legibility deliverables + map-layer analytics
(7th, relayed). 2. claude/spatial-consequence (off 66eda8e8; agent-aca12ee96c53c8ba6):
the sanctioned engine reopening — sidecar substrate, dormancy golden MANDATORY,
WHERE-not-HOW-MUCH. 3. claude/ai-panels (off eb958f4b; agent-ad2c6c73ecd19e0da): the
write-stage interfaces. Charges in full in the task-board descriptions + the ledger rows
above. ALSO RUNNING owner-side: the domain-strict-baseline chip (task_be620e27) — DONE
(2026-07-17): folded → w7-prep @ 9150b464 (ledger row above). FOLD PROTOCOL: spot-check (show --stat + python NUL count vs claimed
scope) → merge in the w7-prep WORKTREE (hard-gate every command) → lane pins on merged
tree → ledger row HERE → task update.
**QUEUED:** fog (door 2) dispatches at the SM-5 fold (charge = task #16) · THE
DOCUMENTATION WAVE (#19 About / #20 Compendium / #21 Pricing / #22 Welcome — one lane,
post-folds pre-ROUND-3) needs the two research sweeps' syntheses: run transcripts at
~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/4e5bd424-21ab-4307-ba41-bd048bb9061e/subagents/workflows/
wf_7ada24b2-812 + wf_01b77ea7-fb1 (read journal.jsonl for banked results; scripts saved
alongside — RE-RUN if unreadable; a new session cannot resume the runs).
**THE ORDER (JUDGMENT, vetoable): PUSH (RULING #7 as amended) fires when the map waves +
panels + fog fold — BEFORE the documentation wave (backup sooner; the wave rides the
standing re-push)** → doc wave → THE COMPOSITE (w7-prep + w-r2-g2 + the DOSSIER content
branch; full gate; audit BYOK's claimed base reds; final ratchet call) → ROUND 3 (#6: the
commission verbatim + THE FOUR CROWNS rubric + ai-cost-efficiency dim; pre-approved
stock: W6 delta · SettlementsPanel:748 guard · S1-S3 token retrofit · doc-wave claims
audit) → gap register → THE SOAK (SOAK_PLAN_R2; CENTURY-300 first; flags-on incl.
spatial) → tuning window (dials + knob registry + S7 #35) → re-certs → THE ONE REGEN
(pre-signed, no pause) → final gate → THE VERY END (PR + deploy batch; ~35 migrations;
carve-outs: LEGAL CONSULT + SUPPORT EMAIL; merge button + db-push = the owner's hands).
**OWNER QUEUE (open, none blocking lanes):** taste vetoes ×3 (v2 samples
docs/samples/town-map-v2/ · prose docs/CONTENT_GT_DOSSIER_TASTE_SAMPLE.md · atlas
identity at the SM-5 fold) · THE ENTITLEMENT-LADDER ruling (SM-5 pins + interiors export
+ pricing cards all render it) · bespoke-style storage surface · AI-op audit-spine
persistence · provisional AI prices 6/3/6/8 · new-mint-v2 default (rides taste veto).
Hazards: memory/MEMORY.md. The stall cure: a SendMessage status demand recovers silent
agents (3h precedent).
**⬛ THE SECOND DESIGN-RESEARCH SWEEP (2026-07-17, owner: "look for the best examples
both design and layout, online to emulate and then reconcile"):** wf_01b77ea7 dispatched
for the documentation wave's other two members — pricing-page design excellence ·
hobby/TTRPG market pricing norms (subscription-fatigue framing) · credit/usage-economy
honest presentation (outcomes-not-tokens menus, BYOK framing) · reference/codex design
(Civilopedia-class enumeration delight, docs-as-SEO) + completeness critic. BOTH sweeps
(this + wf_7ada24b2 for About) reconcile into ONE documentation-wave brief when banked;
the brief is the manager's synthesis artifact; the lane executes it at the wave's slot.
**⬛ OWNER COMMISSION: THE PRICING PAGE OVERHAUL (2026-07-17, "do the same for the
pricing page"; task #21 — THE DOCUMENTATION WAVE's third member, one lane w/ #19+#20):**
assessment finding: the best-ENGINEERED page of the three (config-sourced law real,
one-primary discipline, honest states, live founder meter w/ safe fallback) with a
two-generation-old product shape. GAINS: (1) **THE SURVEYOR TIER RENDERED** — the $19.99
AI tier has NO purchase surface today (the launch-whole ruling makes this a launch
requirement); BYOK named on the card; prices stay owner-ruled config. (2) **THE
TASK-PRICE MENU** — "users buy outcomes, not tokens" enforced: per-task credit costs
rendered from operator config under the wave's drift contract; the stale
one-settlement-prose credit gloss dies. (3) Export-bundle visibility row (vetoable
revisit of the in-context-only judgment — the bundle is now dossier+maps+VTT per
settlement; Cartographer includes it). (4) Feature lists + BOTH A/B variants rewritten
to the finished product in mechanism terms; the tier cards render THE ENTITLEMENT-LADDER
RULING when the owner makes it (current truth if still pending at build). (5) A "free
forever" section — honesty as conversion. NO price changes ever from this lane. Same
slot: post-folds, pre-ROUND-3; ROUND 3 audits. The three pages are ONE ARGUMENT
(About=why trust → Compendium=proof → Pricing=convert) and build as one wave.
**⬛ OWNER COMMISSION: THE COMPENDIUM OVERHAUL (2026-07-17, "do that as well"; task
#20 — joins #19 as THE DOCUMENTATION WAVE, one lane, post-folds pre-ROUND-3):** the law
library, generated-not-copied. THE REGISTRY-RENDER LAW (structural, the headline): every
enumerable + number renders from the engine's own constants via the analytics-dictionary
+ drift-contract pattern — a tuned threshold diverging from the page FAILS CI; "cannot
lie" becomes an enforced invariant before the tuning window can mint doc-lies. DIES: the
hand-copied Economy/Arcane thresholds · the inline Tiers arrays · catalogData.js as a
copy-module (re-sourced) · the Stress tab's silent hand-written fallback (fail-visible).
REGENERATED: the Living World tab from the actual system registries — the full endgame
engine + the preset-lighting truth (the off-by-default copy is stale post-ruling). NEW
CATALOGS: deities/pantheon bank · composer verbs · THE OP REGISTRY RENDERED PUBLIC (the
schema wall as a trust artifact — "every operation the AI is allowed to perform,
enumerated") · lenses/styles · facet vocabularies · calamity buckets · the knob registry
when minted. Custom mode reconciled with S4 (shared facet/injection-point vocabulary).
KEPT: per-tab SEO metadata (extended) · anchor deep-links (the HelpPopover lifeline law) ·
global search (index regenerates from the new sources). ROUND 3 audits the page's claims
with everything else.
**⬛ OWNER COMMISSION: THE ABOUT PAGE OVERHAUL (2026-07-17, in-session; task #19):**
purpose ratified in-session — "the place where the invisible becomes believable": the
constitution translated for civilians (promises-as-guarantees: determinism · receipts ·
state-never-fate · the schema wall · truth-projection; LIMITS stated proudly; the ladder
in mechanism terms; the maker's face; philosophy retained + whole-system appreciation).
Owner direction: digestible; medieval-century art/artistic schematics where appropriate;
EMULATE THE BEST ONLINE EXAMPLES (research sweep wf_7ada24b2 dispatched: manifesto pages ·
medieval art direction + public-domain sources · TTRPG market pages · digestible-depth
patterns · completeness critic) then reconcile with what exists. SURVIVES the overhaul:
the How-To inversion · the DM Philosophy tab · Compendium delegation (becomes the
governing doc-pattern) · the Living World claim+coherence+reversible shape. DIES: the two
hardcoded Cartographer price title= strings (config-sourced facts law) · the mangled
punctuation · the pre-Surveyor AI framing · the 3-rung ladder. ART LAW: the product's own
output is the art (v2 craft samples, panorama) + period-style schematics; public-domain
vocabulary only. BUILD SLOT: post-folds (describe the FINISHED product), pre-ROUND-3 —
ROUND 3 audits every About claim against the real product (receipts culture applied to
marketing). Manual weight sheds into the guidance layer/Compendium per the purpose ruling.
**⬛ THE 100% AUDIT + THE PANELS LANE (2026-07-17, triggered by the owner's "its going
to be 100% by the end of this correct?"):** the completeness audit found ONE unslotted
launch-required item — the AI write-stage PANELS (S4/S5/S6 + accept→mint interfaces;
pure halves built+pinned, interfaces seamed with no build slot; Ruling #4 launch-whole
requires them). CLOSED: claude/ai-panels DISPATCHED off eb958f4b (fence-disjoint from
both running lanes: AI components only) — custom-content labels flow · style-overhaul
live-preview accept/decline · construction config-draft + comparator-deviations + delta
revise · accept→mint surfaced w/ receipts; all lazy, kill-switch-aware, early-access
labeled, S1 money moments. Task #18; the push + composite wait for it (it is part of
"everything built"). THE 100% DEFINITION recorded for honesty: 100% = the LAUNCH-WHOLE
scope. Deliberately OUTSIDE it (recorded, unbuilt-by-design): fog's hosted realtime v2 ·
S4+ knobs/packs (gated on live acceptance metrics, post-launch by design) · seat-transfer
mechanism (concierge, month 12) · gallery comments · radar-driven future lenses · deeper
provenance kernel threading · CONTENT-VT-2 view-time stock. HUMAN-GATED (cannot be 100%
without the owner): the taste vetoes (v2 maps · prose sample · atlas identity) · the
entitlement-ladder ruling · counsel (drafts not-in-force) · support email · merge button
+ db push. Content-depth deferrals (institution descs, NPC pools, history-event wiring)
ride the taste approvals into a post-taste content wave before the regen.
**⬛ FOLD: DOOR 3 — THE KEYED SCALE (2026-07-17) → w7-prep @ eb958f4b** (merge of
claude/interiors tip a4bc218a off 66eda8e8; spot-checked: fence HELD — zero townMap
edits, all new files). Seeded semantic interiors: `${_seed}::interior:v1:<id>` fork,
integer-only geometry (quarter-turn rotations, cross-machine stable) · facet-law grammar
(NATURE kind via cohesionWeave.facetOf, declared ?? inferred ?? generic; FUNCTION variant
rooms: heals⇒infirmary, judges⇒chamber) · THE ENVELOPE LAW vs the ACTIVE layout model
(v2 else v1; entrance on the district-facing edge — the v1 16×16-landmark footprint rule
= JUDGMENT #1) · prosperity-scaled furnishing · **corruption semantics: REVEALED ⇒
visible evidence room; COVERT ⇒ a concealed chamber that never alters public geometry —
fail-closed scrub pinned (publicSafe never derives it; both public paths byte-identical;
covert walls never reach UVTT line-of-sight)** · UVTT pre-walled by construction ·
scoped interiorEdits sidecar · all four lenses, zero new colors · store-free lazy
InteriorView. NEW ADDITIVE GOLDEN FAMILY: 48-entry seed×tier×kind sha matrix (v1 town
goldens untouched). Lane gate: full suite 12,495/0 · tsc 0 · strict 0 · validators green ·
eager delta 0 B. FOLD RECEIPTS on merged tree: interior pins 49/49 · tsc 0 · build ✓ ·
verify:dist 146/146 (the interiorLazy contract joins). SEAMS: enter-from-map hook =
manager wires at the SM-5 fold (fence-forced, correct) · pricing = interiorExportGateReady
predicate riding resolveExportAccess (OWNER LADDER PENDING). JUDGMENTs ×3 vetoable in the
lane report. Lane memory written by the lane. ONE MAP WAVE DOWN, TWO BUILDING (SM-5 ·
spatial-consequence); fog dispatches at the SM-5 fold.
**⬛ OWNER COMMISSION: MAP-LAYER ANALYTICS (2026-07-17, in-session: "make sure the
analytics also capture the data regarding settlement map layer generation as well"):**
the map layer joins the telemetry seam. RELAYED to the live SM-5 lane (it owns the map
surface): capture the v2 GENERATION PROFILE at map render (layoutVersion, siteKind,
morphology, responseMode, Lynch-score band, retryCount, hasFabric, panorama use) ·
legibility-feature engagement (SM-5's own deliverables born instrumented: hover-provenance
opens, change-view use, pin creation, a11y lens selection) · v1→v2 redraw opt-ins ·
lens/style selection where not already covered by the style radar. DISCIPLINE (the seam
architecture + the S4 precedent): ENRICH existing events with properties over minting
names; where a name is unavoidable, the shared feature-discriminated pattern (the
ai_stage_answer two-event precedent); EVENTS_REV + dictionary + drift contract updated;
event-name strings are EAGER — counted against the 5,944 B margin. PRIVACY: enums/bands/
counts only — never map content, prose, or coordinates; consent tiers via the seam as
everywhere. BOUNDARIES: the engine emits nothing (Door 1's substrate stays
analytics-free — constitutional); doors 2/3 INHERIT the SM-5 instrumentation pattern at
their folds (fog session starts/reveals; interior opens/exports — same enrich-first law).
ROUND 3's survey checks map-analytics coverage against this row.
**⬛ LANE PARKED: CONTENT-GT-DOSSIER (2026-07-17, the owner-started session) — the
DOSSIER+NAMING half of task #27 PARKED @ 577179fb on claude/generation-time-content-dossier
(4 commits STACKED on the sibling generation-time branch @ f9720b5a — spot-checked; ⚠️ THE
COMPOSITE TAKES THIS BRANCH, it supersedes the sibling).** THE LOAD-BEARING LAW: per-step
PRNG forks + one-_roll()-per-pick ⇒ in-place pool growth is DRAW-COUNT INVARIANT; 0-draw
surfaces use a pure fnv leaf (kernel/proseHash.js, canonical-at-zero). VERIFICATION BAR:
base-vs-tree STRUCTURAL DIFF over the 187-row generator-golden grid — ONLY prose paths
moved, zero structural/numeric fields (stronger than goldens-green). Grown: pressure
sentences (the survey's CRITICAL) · POLITICAL_FLAVOR · arrival scenes · 56-institution
desc sample · WORLD-SCOPED FACTION DEDUP (the survey's worst surface; pure rng-free
post-pass in composeInstantWorld; ⚠️ rename by IDENTITY not name-match — the
two-same-named-factions collapse bug found+pinned). Gate: 12,446 pass / 1 PARK RED =
generatorGoldenMaster only (regen at THE ONE REGEN; never re-record early) · dist 145/145.
DEFERRED-WITH-REASON in-branch (history-event wiring, ~245 institution descs, NPC pools,
vignettes); OWNER-GATED untouched (displayName schema, deity growth). **OWNER TASTE GATE
QUEUED: docs/CONTENT_GT_DOSSIER_TASTE_SAMPLE.md** (+ the faction-rename strategy call +
the 9-instance sentence-casing quirk noted). The content stack now parks TWO deep for the
composite; the ONE REGEN batch grows accordingly.
**⬛ THE FOUR CROWNS (owner, 2026-07-17, verbatim goals — THE AMBITION RUBRIC):** "i am
trying to go for technologically and potentially: 1. best map generator 2. best settlement
generator 3. best campaign simulator 4. best TTRPG use of AI — those are my goals that I
feel with my coherency engine I can beat before anyone else." BINDING ON ROUND 3: the
resurvey's ambition-fit dimension grades against THESE FOUR explicitly (per-crown: where
the build stands vs best-in-class, what blocks the crown, fix stock derived per crown).
The manager's standing read (recorded for the graders): the four compound — the coherency
engine makes each defensible BECAUSE the others exist (maps that mean things require the
settlement engine; safe AI requires the simulator's op layer) — so competitors must beat
all four at once to durably beat any one. Contested axes per crown: (1) aesthetics vs the
hand-painted ceiling; (2) first-session legibility of already-won depth; (3) soak
certification of century-scale aliveness; (4) panel UX + acceptance metrics + a fresh
market scan (training-vintage competitor knowledge, pre-launch check recommended).
**⬛ FOLD: TOWN LAYOUT v2 + PANORAMA (2026-07-17) → w7-prep** (merge of
claude/town-layout-v2 tip cbbf04c5 off 07d3a1d2; spot-checked incl. the python NUL
byte-count — 19 src/tests files CLEAN; conflict-free). ALL FIVE owner refinements built
in: the staged pipeline (SITE genesis w/ realm-coherence law + exploit/endure/fortify
response modes recorded as provenance → economic field w/ sourced asymmetry + NO uniform
jitter, source-less towns provably seed-independent-formal → core nucleates ON the field
→ roads/districts → Lynch bounded-retry composition w/ plan-response wall) · per-element
provenance retained (cause-less deformation impossible by construction) · latent
advantage map + THE RECONCILIATION LAW (lawful-fortify HOLDS doctrine — reconcile-hold
pinned; chaotic encroaches; dark fabric ⇒ founding form persists) · panorama (oblique
2.5D, composes w/ every lens, Plan/Panorama toggle). VERSIONING: v1 BYTE-IDENTICAL
(default fork untouched), v2 opt-in via mapEdits.layoutLawVersion, v2 goldens EXTEND
(20-config corpus, min Lynch 0.66 vs floor 0.5, all 5 morphologies + both fabric
branches) — the lane LANDED FREE. FOLD RECEIPTS on the merged tree: lane pins 83/83 ·
full property/golden suite 195/195 (v1+v2+style goldens together) · tsc 0 · build ✓ ·
dist 145/145. ⚠️ F24 RECURRENCE: NUL bytes had crept into 6 template-literal separators
in-lane — caught and cleaned by the lane, verified clean at fold by the byte-count
recipe. JUDGMENTs (vetoable, in-file): LYNCH_ACCEPT_FLOOR 0.5 (golden-affecting to
change) · MAX_RETRIES 6 · attractor/landform tables · reconciliation magnitudes 14/30 ·
wall-embrace 45th percentile. SEAMS: **new-settlements-mint-v2 NOT auto-wired** (built +
pinned; the 3 create chokepoints named; OWNER-GATED + rides the TASTE VETO — 9 craft
samples at docs/samples/town-map-v2/ PENDING) · non-water landforms are model-data +
placement influence only (bespoke draw-ops = fenced follow-up) · one pre-existing
advancePauseResume flake noted, not lane-caused. **THE BUILD-OUT LANES ARE BOTH FOLDED —
the three map waves (SM-5 ∥ DOOR 1 ∥ DOOR 3) DISPATCH NOW off the double-folded tip.**
**⬛ FOLD: SURVEYOR S4-S6 (2026-07-17) → w7-prep @ 9d86991e** (merge of
claude/surveyor-s4-s6 tip b486f9ff, 6 commits off 07d3a1d2; spot-checked; CONFLICT-FREE).
The AI control surface completes construction: ACCEPT→MINT (typed ApplyIntents through
store verbs, per-item, reproducibility receipts; unroutable ops surfaced never dropped) ·
S4 CUSTOM CONTENT (two-layer schema wall: registered-bucket landing + per-field
MECHANICAL/FLAVOR/UNSUPPORTED labels — hallucinated mechanics structurally dead) · AI
STYLE OVERHAUL (validateBespokeStyle resolves onto parchment keeping only known-role
visual fields; truth-projection by construction; additive saves, base lenses permanent;
cross-lens edit pin EXTENDS to bespoke, proven) · S5/S6 CONSTRUCTION (config-vocabulary-
is-the-op w/ config-seam walker pin; DETERMINISTIC delta-only comparator, zero AI,
generalizes to realm; canonizes-nothing-until-commit pinned at composeInstantWorld) ·
BORN-EFFICIENT TOKEN LAYER (static-first prompts pinned byte-identical per task class;
routing/max_tokens/slice+token budgets = operator config aiTaskConfig.js; canonicalJson +
visible truncation, never silent grounding cuts; anomaly flags stamped+logged). Each
stage: S1 money path verbatim + own kill-switch + early-access register. MIGRATIONS
151/152 (credit costs + stage switches; head 152 contiguous, validator-confirmed).
FOLD RECEIPTS on the merged tree: lane pins 107/107 · tsc 0 · build ✓ · verify:dist
145/145 (closure ratchet green — lane-measured 1,034,056 B, margin 5,944) · four
validators green. JUDGMENTs ×5 (vetoable, in the lane report): prices 6/3/6/8 provisional-
per-the-blanket · two shared events (EVENTS_REV 9) · fast/balanced routing defaults ·
apply-log rides existing surfaces (audit-spine persistence = OWNER-GATED follow-up) ·
bespoke-style STORAGE SURFACE = owner-gated schema (flagged, mapEdits pins untouched).
SEAMS: React panels (S3's least-verifiable-headless precedent) · style viewer-surface
wiring (~6 surfaces → resolveActiveStyle) · edge shells PLAUSIBLE-by-pattern (CI deno
check). Lane full suite pre-fold: 12,378/1 (the pglite load-flake class, green isolated).
**⬛ RULING #7 AMENDED (2026-07-17, owner: "move git push to after everything is built"):
THE PUSH MOVES TO POST-BUILD-OUT.** The first push now fires when the ENTIRE build-out is
folded — both running lanes, all three map-wave dispatches (SM-5 ∥ door 1 ∥ door 3, then
door 2), and the owner-side dossier-prose session — instead of at the original three-lane
point. The chain becomes: build-out complete → PUSH (branches-as-backup; no PR/merge/
deploy) → THE COMPOSITE → ROUND 3 → soak → tuning → re-certs → ONE REGEN → THE VERY END
(PR + deploy). Standing re-push-at-milestones unchanged after the first push. Recorded
without re-litigation: the single-machine exposure window now extends through the full
build-out — the owner's accepted trade.
**⬛ THE RECONCILIATION LAW (2026-07-17, owner-delegated "i let you decide how that
works" — architect's mechanism, vetoable): how optimality relates to lawful↔chaos OVER
TIME.** The FOUNDING response mode (exploit/endure/fortify; optimal or suboptimal) is the
starting point and stays character-derived. Over time the town reconciles with its site,
and ALIGNMENT GOVERNS THE STYLE OF RECONCILIATION, not its morality: **LAWFUL = planned
coherence toward the CHOSEN doctrine's optimum** — discrete, engineered, legible
corrections (the drained quarter, the built quay, the aligned extension toward the
harbor); a lawful fortress town MAINTAINS its fortified suboptimum deliberately (lawful
= ordered execution of the doctrine, not trade-optimality worship). **CHAOTIC = greedy
local opportunism** — continuous encroachment toward whatever advantage is locally
available now (riverbank grabs, sprawl toward the trade gate), gaining fast and
accumulating disorder (congestion grain, palimpsest over the old bones). Both signs are
even-handed (state-never-fate; no alignment moralizing). MECHANISM (zero engine change —
the fabric layer is folded and already carries the signals): the v2 engine computes and
RETAINS **THE LATENT ADVANTAGE MAP** at generation (the site's unexploited attractors —
the declined harbor, the unused ford — a natural byproduct of stages 0-1); the v2
hasFabric branch INTERPRETS the existing fabric signals (alignment-drift grain toward
1−lawfulness01 + prominence stocks) as reconciliation: direction from the latent map,
style+coordination from lawfulness, magnitude+timing from fabric stocks. Dark fabric ⇒
founding form persists (correct: no history yet). SM-5's change view narrates
reconciliation turns for free. Lands wholly in the #38 lane (relay #5); latent-map
retention joins the provenance annotations; pins: lawful-vs-chaotic reconciliation
fixtures on the same site + same founding mode.
**⬛ OWNER DESIGN REFINEMENT: SITE GENESIS — STAGE 0 (2026-07-17, in-session, folded
into #38): "randomly generate a river or a mountain or a side of a mountain or sand dunes
or a marsh or whatever makes sense from the combination of nearby resources, trade route
and terrain. only then apply the principles of urban design... appropriately to take
advantage OR NOT of the surroundings."** The pipeline gains its true first stage: (0)
**THE SITE** — the physical canvas itself is GENERATED from the dossier's regional
context: realm-map terrain/biome at the settlement's location (REALM-COHERENCE LAW: the
town site is a zoom-in of its realm position and may not contradict it), nearby resources
implying landforms (mines⇒slopes/rock faces, fisheries⇒shore/river, peat⇒marsh,
salt⇒flats/dunes), trade routes implying physical carriers (a river trade lane means the
river physically enters/exits along its bearings; overland routes shape passes/gaps).
SUBSTANCE-FROM-DOSSIER / EXPRESSION-FROM-SEED extends to the site: WHETHER the river
exists = substance; its meander, which mountain flank, the dune extent = seeded
expression. Standalone settlements (no realm context) derive the site from resources +
trade alone, neutral default. **THE "OR NOT" CLAUSE (owner nuance, made law):** the
response mode to the site — EXPLOIT / ENDURE / FORTIFY — derives from the settlement's
character and history (a fortress-origin town takes the defensible flank over the
trade-optimal bank; the marsh town endures on stilts); deliberate suboptimality where the
fiction justifies it. TEMPORAL ARC CONFIRMED AS-BUILT: growth-era change rides the urban
fabric layer at stone's pace (owner: "as we currently designed"); the site itself is
immutable short of catastrophe (fabric's rebirth path). RELAYED to the v2 lane (relay #4).
**⬛ OWNER DESIGN REFINEMENT: ECONOMY-FIRST GENESIS (2026-07-17, in-session, folded into
#38): "depending on the resources and terrain and everything else, procedurally and
randomly generate that economic shape first onto the settlement map and only then apply
all the other principles."** The v2 pipeline ORDER is now explicit: (0) terrain/water →
(1) **THE ECONOMIC FIELD, FIRST** — attractor points + gradients derived from the
dossier's ACTUAL economy (income sources, resource sites, trade-route bearings, fertile/
navigable terrain) laid onto the map with seeded organic variation → (2) the genesis core
NUCLEATES ON the field (the market where routes converge, the core at the ford) → (3)
roads-before-buildings FOLLOW the economic gradients → (4) districts/growth rings/semantic
placement pull toward their attractors → (5) the composition pass (Lynch rubric,
historical form vocabulary, plan-response, wall-obeys-town, tier grammar) applies LAST.
TWO LAWS ATTACHED (architect, vetoable): **EXPRESSION-NOT-SUBSTANCE** — seeded variation
moves the economic field's expression (which bank, which bearing, offsets), never its
substance (the dossier decides WHAT exists; truth-projection law) · **"randomly" = SEEDED**
(the v2 fork; determinism constitutional). SYNERGY: the economic field IS the primary
sourced-asymmetry layer — stage-1 attractors become the provenance sourceRefs, making
asymmetry-with-provenance automatic-by-construction. RELAYED mid-flight to the v2 lane.
ALSO: the deferred CONTENT-GT-DOSSIER taste-sample lane (task_56fe7e02) was STARTED BY
THE OWNER in a separate session — tracked on the board; the composite waits for its
outcome like any lane.
**⬛ LANE PARKED: GENERATION-TIME CONTENT (2026-07-17) — task #27's remaining half
BUILT + PARKED on claude/generation-time-content @ f9720b5a (3 commits off 07d3a1d2;
spot-checked: files/base/shift-map match the report; UNFOLDED by design — joins the
composite).** The three headliners grown via one pure mechanism (src/domain/worldPulse/
eventProse.js, FNV-1a pickLine, CANONICAL-AT-ZERO — falsy seed ⇒ index 0 ⇒ the exact old
string; no rng consumed, structural fields provably unmovable): calamity title/summary/
reason pools BUCKET-NEUTRAL (law guard green) · all 22 war/peace/hegemony receipts seeded
on the directed pair key (stable per pair, varies across pairs) · kernel news framing
variety (upswing 4 / resource 2 / lifecycle 5) with every semantic token threaded
unchanged. Lane gates: FULL SUITE 12,408/0 · tsc+domain-strict+lint 0 · dist 145/145 ·
eager Δ≈0 (prose lives in lazy chunks only). +129 guard tests (register laws, 57-pool
full reachability, determinism). **HONEST FINDING (refines the parks-RED expectation):
the observable golden-red set is EMPTY** — the slice is golden-BINDING (varied prose
persists into wizardNews/calamityHistory/reason ledgers and will populate regenerated
goldens at THE ONE REGEN) but the current suite exact-pins almost none of it; the one
predicted red resolved green by hash coincidence (verified by direct eval). DEFERRED-
WITH-REASON (queued stock, lane-spawned follow-up): the dossier/naming generation-time
surfaces (pressure sentence, faction names ⇒ needs a world-scoped dedupe registry,
institution displayName ⇒ owner-gated schema field, persona/history/founding prose) =
the taste-sample class — a sibling lane with owner samples, NOT blind bulk into the
permanent regen; realm order/refusal prose untouched (code-matched realmVetoProse is
load-bearing). JUDGMENTs ×2 recorded vetoably in the lane report (fence-at-event-prose;
stampTitle stays canonical). Lane memory written by the lane.
**⬛ RULING #8 SEQUENCING CONFIRMED BY THE OWNER (2026-07-17, "this should all sequence
before the resurvey and soak"):** the doors + SM-5 build-out completes IN FULL before
ROUND 3 and the soak — now an explicit owner statement, not a manager judgment. The
binding chain: three running lanes fold → PUSH (RULING #7) → SM-5 ∥ door1 ∥ door3 (at the
v2 fold) → door2 (at the SM-5 fold) → THE COMPOSITE (all folds in) → ROUND 3 resurveys
THE WHOLE incl. every door → gap register → THE SOAK (engine certified WITH
spatialConsequenceEnabled flags-on) → tuning → re-certs → ONE REGEN → THE VERY END.
**⬛ OWNER RULING #8 (2026-07-17, "no include them before launch"): THE DOORS MOVE
PRE-LAUNCH.** Supersedes the same-day post-launch placement. Corpus re-slotted @ w7-prep
aca1a132 (doc renamed docs/DESIGN_MAP_DOORS.md). THE SHAPE: door 1 SPATIAL CONSEQUENCE =
the named wave for which the engine-frozen rule lifts (its commission IS the corpus
reopening); builds dormant w/ committed dormancy golden; **spatialConsequenceEnabled JOINS
THE ONE REGEN lighting list** (commission-signed under this ruling, vetoable). Doors 2-3
(TABLE LAYER v1 zero-server · KEYED SCALE interiors) ship at launch under the launch-whole
precedent — instrumented, ROUND 3 reviews them; fog's hosted realtime v2 REMAINS
post-launch gated (recorded in-doc). DISPATCH TOPOLOGY (manager, vetoable): at the
town-layout-v2 fold → SM-5 ∥ DOOR 1 ∥ DOOR 3 (fences: SM-5 owns existing map UI · door 1
engine-side + canonize substrate · door 3 new interior files, entry-hook seamed at fold);
at the SM-5 fold → DOOR 2. Composite waits for all doors; ROUND 3 reviews the whole.
HONEST COST NOTE (recorded, not re-litigated): the pre-launch tail grows by three lanes
incl. one engine wave — launch moves later; the soak now certifies the engine WITH
spatial consequence flags-on (charter unchanged: harness is flags-on by design).
**⬛ THE DOORS' CORPUS CITIZENSHIP (2026-07-17, owner clarification: "i meant to include
all of these" — quoting the three doors WITH their post-launch placement):** the doors are
now FULL corpus entries @ w7-prep 5bd601ea — docs/DESIGN_MAP_POST_LAUNCH_DOORS.md holds
frozen designs + coherence matrices + build gates for THE SPATIAL CONSEQUENCE LAYER
(map→engine via a derived sidecar spatial substrate; fields-not-entities; the
WHERE-not-HOW-MUCH calamity law; virtual spatialConsequenceEnabled w/ dormancy golden;
lights only in an owner-signed regen), THE TABLE LAYER (semantic-snap fog over the v2
graph; zero-server v1 / realtime v2 separately gated; VTT-complement positioning), and
THE KEYED SCALE (facet-law interiors under the envelope law; pre-walled UVTT by
construction; institution-interiors-only charter clause). Map doc §14 reduced to a
pointer. BUILD SLOT unchanged: post-launch roadmap, by the owner's own quoted placement;
recommended order (vetoable) interiors → spatial consequence → fog, demand-checked via
the radar pattern. The doors-vs-docs assumption from the prior row is RESOLVED: docs.
**⬛ THE CORPUS AMENDMENT (2026-07-17, owner: "that includes the corpus"): the session's
commissions are FROZEN INTO THE DESIGN CORPUS on the code lineage @ w7-prep 41d09959** —
DESIGN_SETTLEMENT_MAP.md §12 (sourced asymmetry: provenance-annotated deformations,
plan-response law, no-uniform-jitter) + §13 (SM-5 legibility wave w/ compact coherence
matrix per the standing designs-freeze-with-matrices practice) + §14 (the three post-launch
doors recorded as designed-intent, deliberately unbuilt) and DESIGN_AI_CONTROL_SURFACE.md
§7 (the token-efficiency doctrine: 7 levers, quality bar, commercial frame). The §11 recon
staleness is annotated resolved in-doc. ASSUMPTION STATED VETOABLY: "includes the corpus"
read as freeze-the-designs-into-the-corpus, NOT as build-the-three-doors-now — if the owner
meant the doors, the corpus entries just written are their design prerequisite and lanes
dispatch on the word.
**⬛ OWNER COMMISSION: THE MAP LEGIBILITY WAVE (SM-5) (2026-07-17, in-session: "do it all
appropriately!" — the manager's map-layer proposal commissioned in full, sequencing
delegated).** SIX DELIVERABLES, one Opus lane, SERIALIZED BEHIND the town-layout-v2 fold
(same map-UI file surface — single-writer; dispatch at the v2 fold): (1) THE MAP EXPLAINS
ITSELF — hover provenance for deformed/placed elements rendered from the v2 model's
provenance annotations (the retention directive relayed to the v2 lane THIS SESSION: per-
element {sourceFamily, sourceRef, effect}, presence-pinned as the no-uniform-jitter
enforcement); InstitutionCard-hover precedent; Surveyor's-notes register. (2) THE CHANGE
VIEW — a "what changed" mode over fabricRead (prominence shifts, new scars, rebuilt
blocks since last visit / over N advances) + calamityHistory; graceful empty-state while
fabric is dark pre-regen (whisper explains); the chronicle's spatial twin. (3) EDGE
ANNOTATIONS — roads exiting the map labeled to named neighbors w/ travel time derived
from existing neighbour_links/route distance data (verify source in-repo). (4) THE ATLAS
IDENTITY — unified lens treatment across realm+town exports (one-atlas feeling; craft
samples, owner taste veto). (5) DM PIN/ANNOTATION LAYER — DM-only vs player-visible
markers riding the existing handout/reference export split; VERIFY-FIRST what mapEdits
already covers before building; pins live in mapEdits keys (must dodge PRIVATE_KEY_RE
substrings); no new gate class, no schema change. (6) COLORBLIND-SAFE/PATTERN-FILL lens
variant via the style schema (one more bounded lens). SEQUENCING JUDGMENTS (vetoable):
the first push (RULING #7) is NOT delayed — it fires when the original three lanes land;
SM-5 folds after v2 and rides the standing re-push; ROUND 3 reviews SM-5 with everything
else. **POST-LAUNCH ROADMAP STOCK (recorded so the doors are never lost, deliberately NOT
built in this tail):** map→engine coupling at town scale (fire along adjacent buildings,
siege damage by wall segment — new engine capability, corpus-closed) · in-app fog-of-war/
session mode (the UVTT meet-VTTs-where-they-are strategy holds for launch) · building
interiors (a new scale). Zero eager bytes expected across all six (map surface is lazy).
**⬛ OWNER DESIGN REFINEMENT: SOURCED ASYMMETRY (2026-07-17, in-session, folded into #38):
"nothing should be perfectly organic. there will always be slight or minor organic
asymmetry from the region, resources, people's habits, etc. The best that we as people can
do is to plan around it or use them to our natural advantage."** The refinement sharpens
the v2 commission's "seeded irregularity within constraints" from cosmetic jitter to
ASYMMETRY WITH PROVENANCE — every deformation has a named cause from the dossier: (1)
REGION — terrain/water/slope already first-class (water-first morphologies); (2) RESOURCES
— the settlement's actual income sources and resource sites pull districts, roads, and
work-quarters toward them (the tannery-downstream exemplar generalized); (3) PEOPLE'S
HABITS — desire paths cutting formal grids, market accretion at the gates facing the
farmland/trade routes, habitual routes worn permanent (derived from institution adjacency
+ trade-route bearings + high-traffic pairs — an inference layer, shapes vetoable). THE
PLAN-RESPONSE LAW (the owner's second clause): the planned elements READ AS RESPONSES to
the asymmetries — walls kink to include what matters, grids deform where the stream cuts,
the square sits where the desire paths converge — plan-around or exploit, never suppress.
DISCIPLINE: no uniform jitter (global noise reads as noise, not history); irregularity is
applied PER-CAUSE, deterministic from the seed fork + dossier only. COMPOSES with Lynch:
imageability *needs* distinctive irregularity — sourced asymmetry should raise rubric
scores, not fight them. All other #38 principles stand unchanged. RELAYED mid-flight to
the town-layout-v2 lane.
**⬛ OWNER COMMISSION: AI TOKEN EFFICIENCY (2026-07-17, in-session): "where you believe it
is possible without giving up quality, please optimize how AI is used to reasonably reduce
any unnecessary spending of tokens. Because that could detract users from using it."**
The architect's doctrine (Fable, this session — each lever vetoable): (1) RETRIEVAL SLICING
BUDGETS — per-task slice budgets in the slicer registry; send only the slices the task
class needs; compact canonical encodings of read-model slices over raw dumps; measure real
prompt sizes per task and record them via the existing usage meter. (2) PROMPT-CACHE
DISCIPLINE — static-first prompt assembly (system prompt, op-registry tool schema, design
corpus, lens definitions FIRST; per-request slices LAST) so provider prompt caching prices
the schema wall once, not per call. (3) ROUTING CLASSES ENFORCED — fast/balanced/deep per
task type (§3 design) becomes enforced config, not convention: musings/suggested-questions
fast-class; interpret balanced; construction compiles deep only where the comparator
demands. (4) OPS-NOT-ESSAYS OUTPUT BOUNDING — structured op output with bounded max_tokens
per task class; the compiler emits ops, never prose padding. (5) DELTA REVISE LOOPS —
S5/S6 revise passes send DEVIATIONS ONLY, never full re-context. (6) ZERO-AI-WHERE-
DETERMINISTIC — brief bundles/read-models stay pure code with AI prose only on top;
suggested questions stay zero-cost (the Shell precedent). (7) PER-TASK TOKEN BUDGETS +
ANOMALY FLAGS at the edge meter (a task blowing past its class budget is flagged to the
operator; estimates stay labeled estimates). THE QUALITY BAR (non-negotiable): the
grounding-parity + citation-law pins stay green — slicing may NEVER trim grounding below
what the epistemic-fidelity law needs; acceptance metrics (§5) are the regression check.
COMMERCIAL FRAME: task-priced credits mean efficiency = house margin on managed + visible
cost relief for BYOK — the owner's adoption concern lands hardest on BYOK visible spend.
EXECUTION: born-efficient directives RELAYED to the in-flight surveyor-s4-s6 lane (the
map-exports mid-flight-relay precedent); the S1–S3 retrofit joins ROUND 3's fix stock as
a named charge with an efficiency dimension in the survey.
**⬛ OWNER RULING #7 (2026-07-17, in-session, verbatim: "after all of this lands, i first
want you to push to github, then continue with the resurvey round 3 and onwards and so
forth"): THE EARLY PUSH.** The push moves from THE VERY END to POST-FOLD / PRE-ROUND-3:
when the three build-out lanes land, push to origin
(github.com/clausellstokes-lang/settlement-engine) claude/w7-prep + the
review-fixes-2026-07-08 ledger + every parked lane branch (claude/w-r2-g2,
claude/generation-time-content) — BRANCHES AS BACKUP ONLY: no PR yet, no merge, no
deploy; the merge button + db-push remain physically the owner's; the PR + deploy batch
stay at THE VERY END. Motivation on record: the single-machine extinction risk named in
the manager's assessment this session. STANDING PRACTICE from then on (manager JUDGMENT,
vetoable): re-push at each subsequent milestone (post-ROUND-3 waves, post-soak,
post-regen) so the remote never trails by more than one phase. The tail is otherwise
unchanged: push → composite → ROUND 3 → gap register → soak → tuning → re-certs → ONE
REGEN → final gate → THE VERY END (PR + deploy batch; the two carve-outs stand).
**⬛⬛ THE RESUME (2026-07-17, successor session): DISPATCH ORDER EXECUTED.** Task board
rebuilt (11 tasks mirroring the tail). THREE LANES DISPATCHED off w7-prep @ 07d3a1d2
(Opus implementers, isolated worktrees, STEP -1 location guards + verify-first preambles):
claude/surveyor-s4-s6 (the accept→mint seam + S4 custom content + AI style overhaul
#28-p2 + S5 settlement construction + S6 realm construction; migrations 151+; launch-whole
instrumentation + per-stage kill-switches per RULING #4) · claude/generation-time-content
(calamity prose variety kept type-blind, war/peace reason receipts ×22, kernel news
variants; predict-first shift map committed in-branch; PARKS RED, joins the composite) ·
claude/town-layout-v2 (#38 semantic urban planning, Lynch five-element self-scoring rubric,
town-map:v2 fork w/ versioning-law pins, fabricRead consumption w/ dark fallback, THE
PANORAMA projection; v2 goldens EXTEND — lands free). **GALLERY OPT-IN FIX FOLDED @
469db96a** (merge e0d0c29c; the SELECT-string conflict vs gallery-p2's gallery_title
resolved by UNION in both list projections + both row mappings; receipts on the merged
tree: lane pins 8/8, saves/gallery collision suites 20 files / 134 tests green, tsc 0 —
the dossier resume item is CLOSED). SIDE-BRANCH AUDIT (git truth over stale memory):
map-styles, instant-world, surveyor-s1b, fix-resource-taxonomy-boundaries are ALL already
ancestors of w7-prep — the only genuinely unmerged side branches were w-r2-g2 (parks for
the composite, by design) and the now-folded gallery fix; memory notes corrected. ROUND-3
NOTE: the owner re-issued the original commission verbatim this session (Fable
survey/dimensions + holistic code/product/fit assessment → Opus Ultracode verify+fix,
bold-over-safe, substantive sim-logic cohesion in scope) — it executes at its slot (task
#6, on the composite) per RULING #3; nothing about the re-issue changes the sequencing.
**⬛⬛ THE WEEKLY-LIMIT RESUME DOSSIER (2026-07-17) — A SUCCESSOR STARTS HERE.**
**STATE:** code truth = `claude/w7-prep` (worktree .claude/worktrees/agent-a04d3f325c72e62dd)
@ 9b9e525a; this main tree is LEDGER-ONLY — never build here. Budget 1,040,000 (RATCHET
#11). EXEMPT_CEILING signed 69 (gates fully green). ALL sign-offs granted (RULING #5; THE
ONE REGEN PRE-SIGNED; carve-outs: legal consult + support email).
**FIVE LANES IN FLIGHT — worktrees/commits survive limits (limits kill reasoning, not disk):**
1. claude/surveyor-s3 (agent-ae9ac861328f9e062, →53eaf814): compiler+Shell+Parley; mig 145+.
2. claude/map-exports (agent-aed2165ea573f9147): exports + $2.99 bundle + UVTT Foundry +
   realm toggle — possibly UNCOMMITTED (16 files): commit first at fold.
3. claude/gallery-p2 (agent-a6db22641bc1c2dd3, 4/5 →179f7e17): five signed deliverables;
   mig 146+.
4. claude/urban-fabric (agent-ab9c0863330e9ab28, off 9b9e525a): the last engine brick.
5. claude/misc-signed @ b0837797+WIP2 (agent-a828509d4ac41f3e0): membership norm + mapChains
   — ⚠️ ITS CHECKOUT FELL BACK TO THE MAIN TREE (contained: WIP committed on its branch by
   the manager, main tree restored, agent relocated to its worktree).
ALSO: the owner's separate-session sharer-edit gallery-flags fix ended — locate + fold.
**FOLD PROTOCOL:** spot-check (show --stat vs claimed scope) → merge into w7-prep IN ITS
WORKTREE (cd + verify branch EVERY call — the cwd resets and lands in ACTIVE trees) → lane
pins on merged tree → ledger row HERE (cd main; verify branch = review-fixes-2026-07-08) →
task update. Migration collisions renumber at fold (143/144 precedent).
**DISPATCH ORDER:** S4+S5+S6 after S3 · generation-time content after urban-fabric (PARKS
RED, G2 pattern) · TOWN LAYOUT v2 (#38) + panorama after map-exports · seams as reported.
Briefs: pwd + base-hash guards, FOREGROUND-BLOCKING gates (no background waits — phantom-
monitor stalls ×5; SendMessage resume cures; a status demand recovered a 3h-silent agent).
**THE TAIL (pre-signed; pauses only at counsel + the merge button):** THE COMPOSITE (w7-prep
+ claude/w-r2-g2 @ aec57981 + the parked generation-time branch; local) → ROUND 3 (#25: the
original commission VERBATIM + the two censuses) → gap register (#24) → THE SOAK
(docs/SOAK_PLAN_R2.md; CENTURY-300 first; instant-world composer+canonize = harness; LOCAL
COMPUTE — under token scarcity run as long-lived background bash banking to files) → tuning
window (dials; knob registry mints; #35 builds) → re-certs → **THE ONE REGEN (PRE-SIGNED —
no pause): light distancePricedNewsEnabled + reframeEnabled + provenanceLedgerEnabled +
urbanFabricEnabled + npcGrowthEnabled in the three world-alive presets; merge G2 +
generation-time; regen goldens ONCE** → final gate → **THE VERY END (#22): push + PR
(pre-authorized; MERGE BUTTON = owner's) + deploy batch (~27 migrations 118→head; envs
byok_secret + SURVEYOR_CANARY_SECRET; covert-scrub SQL twin; sitemap; applied-head; SUPPORT
EMAIL verification; LEGAL CONSULT — drafts NOT-IN-FORCE until counsel).** Hazards:
memory/MEMORY.md.
**✅ THE GROWTH LAYER RATIFIED + FOLDED (2026-07-17; clean merge — no conflict with
provenance; both engine finales' pins 57/57 together on the merged tree) — **THE ENGINE'S
CONSTRUCTION ERA IS OVER.** People learn: acquiredTraits w/ provenance/intensity/decay ·
the npcGrowthKernel mover (D3 courses at person scale, POST-apply reads, no rng) · THE
DISTANCE-FROM-CORE METRIC VERIFIED (bold→cautious 0.15 opposition — the owner's case —
vs cruel-from-compassionate 0.86, near-unmintable) · overlays never core mutation (pinned) ·
narratable npc_growth chronicle beats · sidecar storage (spatialLedgers.npcGrowth + mirror —
defeats the ghost-write class). JUDGMENT TABLES SIGNED under Ruling #5's blanket (the
recommended shapes): mintable set {cautious, proud, cynical, tenacious} · the 8-signal
deposit map · the 2-vector opposition metric · sidecar+mirror storage. BONUS RATCHET: the
mover-apply extraction LOWERED pulseKernel's ceiling 1410→1387 (a shrink locked on the
engine's hottest file). CENSUS-HONEST SEAMS: political kinship reads a deliberately separate
axis (premise refuted, deferred) · npcAgency reached transitively (no edit needed) ·
clergyTraitPlane inert-extendable. Recovery note: this wave went silent 3h and was recovered
by a status demand to full delivery — the stall class remains procedural, never fatal.
**THE THREE WAITING WAVES NOW UNBLOCKED AND DISPATCHING: URBAN FABRIC (#39) ·
GENERATION-TIME CONTENT (parks red) · THE MISC-SIGNED WAVE (membership normalization +
mapChains).**
**✅ THE PROVENANCE LEDGER RATIFIED + FOLDED (2026-07-17; merged; pins green on the merged
tree) — ENGINE FINALE #1: RECORDED CAUSALITY IS REAL.** One writer (provenanceKernel lazy
leaf at the appendPulseHistory chokepoint, net-zero pulseKernel wiring, 'provenance' in
EXEMPT_LEDGER_KEYS); virtual provenanceLedgerEnabled (dark now; PRE-SIGNED to light at the
regen); the chronicle upgraded — decree cones = EXACT recorded transitive descendants where
edges exist, inference elsewhere, labels honest end-to-end. STORAGE SIGNED under Ruling #5's
blanket (the recommended shape): in-blob at spatialLedgers.provenance, ~184 B/edge, ~18
edges/advance, ~250 KB/80-advance window, MAX_PROVENANCE_EDGES=4096 (~750 KB ceiling,
lowest-tick eviction). Dormancy PROVEN (golden + contract + additive-only; all 153 existing
goldens green with the writer wired). JUDGMENTs ratified ×4 (in-blob · 4096 · one-hop
news→outcome edges recorded — they light the recorded path in real advances · leaf
re-export wiring). SEAM: the causedBy cross-outcome edge is unthreaded by kernels today —
deeper recorded cones await kernel threading (post-launch stock; the machinery is ready).
**⬛ REALM EXPORT LAYER CHOICE (owner, 2026-07-17; relayed in-flight):** realm map exports
offer WITH-SETTLEMENTS vs TERRAIN-ONLY (the placements layer is an inclusion flag — it
already composites separately); pin: same realm, same settings, the two variants differ
ONLY by the placements layer. Named use-cases: player handouts (unexplored world) vs the
DM's annotated reference.
**⬛ FOUNDRY EXPORT UPGRADED (owner, 2026-07-17; relayed in-flight to map-exports):** beyond
the token raster — a UNIVERSAL VTT scene export (.dd2vtt-class interchange): image + grid
config + LINE-OF-SIGHT WALLS derived from the draw-list's real geometry (footprints/walls →
vision-blocking segments; gates → portals) — Foundry imports arrive PRE-WALLED for dynamic
lighting (no generator offers this; our geometry is semantic). Same $2.99/premium export
bundle gate. 1:1 wall-geometry pin mandated; module-requirement honesty required in the
report; seam as MAP-EXPORTS-2 if the wave is already gating.
**⬛ OWNER COMMISSION: THE URBAN FABRIC LAYER (2026-07-17, task #39) + LAYOUT v2 TEMPORAL
EXTENSION.** The map gains MEMORY: a pure projection of current state cannot show gradual
history ("buildings and city designs are resistant to rapid change except in the case of
catastrophe and rebirth") — so THE FABRIC LAYER = the growth layer for stone: district
prominence integrators (deposits from ruling power / faith dominance / income sources /
trade volume / population / food disparity; SLOW decay — the merchant quarter's prosperity
lingers after the guild falls, gradually replaced) · ALIGNMENT = the drift rate of NEW
fabric (lawful rubric-faithful; chaotic encroachment over the old planned bones — the
palimpsest) · STRESSOR SCARS as decaying entries · CATASTROPHE the one fast path
(calamityHistory → district rebirth). Map = projection(dossier + fabric); maps confirmed
dynamic-with-the-dossier, now dynamic-with-history at stone's pace. Flag-gated engine
integrator (mover pattern, consumer-census inputs), dark ⇒ byte-identical; #38 consumes
when lit. Dispatches when the Growth Layer folds. The chronicle narrates fabric turns.
**⬛ LAYOUT v2 REFINED (owner, 2026-07-17): MEDIEVAL FORM, MODERN COMPOSITION.** Form
vocabulary from ACTUAL historical settlements (Carcassonne-concentric, Lübeck harbor-fan,
Durham river-spine, bastide grids where fiction justifies; lot grain, growth scars,
wall+faubourg rhythm) composed under highest-order modern principles: **Lynch's five
imageability elements as the engine's SELF-SCORING RUBRIC** (a layout must rate on
paths/edges/districts/nodes/landmarks inside the bounded-retry loop before acceptance) ·
Jacobs mixed-use/short-blocks · Alexander positive outdoor space · Gehl plaza enclosure ·
sight-line axes, figure-ground, density gradients. "Shaped like history built it; reads
like a master planner checked it." Folded into task #38.
**⬛ OWNER COMMISSION: TOWN LAYOUT v2 (2026-07-17, task #38) — semantic urban planning.**
First-draft maps follow real urban-morphology principles ("look and feel like it makes
sense and be dynamic"): genesis cores + growth rings · water/terrain-first morphologies ·
roads-before-buildings with convergence squares · SEMANTIC placement from the dossier (the
actual tannery downstream — the advantage no generic generator has: a simulation-grade town
behind the map) · wall-obeys-town · tier scale grammar · seeded irregularity within
constraints. VERSIONING LAW: the town-map:v2 fork — new settlements v2, existing v1
untouched, opt-in non-destructive redraw (edits survive, pinned), v2 goldens EXTEND (v1
stands). Lenses/exports inherit automatically. Craft samples return for owner veto.
Dispatches when MAP EXPORTS folds (same lane).
**✅ CONTENT-VT RATIFIED + FOLDED (2026-07-17; commit 222806be merged; pins 34/34 on the
merged tree incl. the SIGNED ceiling).** The news voice 129 → 342 lines (≥7/cell floor,
9→10 categories): **THE REFRAME VOICE EXISTS** (both lanes — gifts curdling AND debts
forgiven), portable-specificity held (catalog generics only; calamity kept bucket-neutral
per the constitution), all existing lines preserved verbatim, zero eager (the lazy panel
chunk), register guards + 200-id full-reachability green. DURABLE FINDING (vetoable
judgment, ratified): the reframe voice is DORMANT-FORWARD-LOOKING — the reframe kernel
mints no news beat today (newsEntries:[] on every path); the routing reserves the token so
a future beat inherits its crier; no existing impactKind was hijacked. HONEST BEHAVIOR NOTE
(recorded): pool growth changes which variant an existing entry id renders (the FNV divisor)
— view-time, byte-inert, the intended variety effect. SCOPE JUDGMENT ratified: the OTHER
view-time-thin surfaces (newsBody single-variants, rumor frames, chronicle copy) deferred-
with-reason — each needs a NEW selection mechanism, not pool growth; queued as CONTENT-VT-2
stock (or ROUND-3 fodder). Task #27's remaining half = the GENERATION-TIME park wave
(post-engine-finales, rides the regen).
**⬛ EXPORT PRICING RULED (owner, 2026-07-17, overrides the manager's free-images rec):**
free tier pays the SAME $2.99 — the existing single-dossier entitlement UPGRADES into a
per-settlement EXPORT BUNDLE: one purchase unlocks dossier PDF + VTT/Foundry raster + ALL
map image formats for that settlement; premium = everything everywhere. Same lane, no new
gate class, one pricing moment on every export affordance. Relayed to the in-flight
map-exports implementer (fold-in ordered).
**⬛ OWNER COMMISSION: MAP EXPORTS (2026-07-17, task #37, DISPATCHED).** Settlement + realm
maps export in SVG (native draw-list) / PNG / JPEG / WebP (rasterizer idiom, selectable
resolutions) / single-map PDF (the plate precedent) — EXPORTS HONOR THE CURRENT LENS incl.
bespoke styles (pinned); the VTT token-raster download button (the recorded map-styles seam)
closes in-wave; realm map via the FMG bridge's surveyed export surface (browser-bound ⇒
PLAUSIBLE-class, stated honestly). PRICING (manager rec, vetoable): image exports FREE to
the account owner; single-map PDF rides the existing PDF entitlement lane; anon/gallery
export = a recorded seam for an owner decision. SIX lanes now live: S3 · provenance ·
growth · content-vt · gallery-p2 · map-exports.
**⬛ OWNER RULING #5 (2026-07-17: "i give all remaining signoffs ahead of schedule") — THE
BLANKET GRANT, executed with two carve-outs.** EXECUTED IMMEDIATELY: EXEMPT_CEILING 66→69
signed at its source (operationRegistry.js @ c1a36002 — **THE PROGRAM'S LAST STANDING RED
CLEARS; gates are fully green** modulo isolation-proven flakes) · Cartographer priceCents
600→599 (reconciled to the DISPLAYED $5.99, customer-facing prevails; pin honestly
rebaselined @ c1d3f6eb) · **GALLERY PHASE 2 DISPATCHED** with all five signed (aliveness
as designed · the six reaction lines VERBATIM · the Campaigns third tab · gallery_title ·
facet hubs + sitemap fan-out ON; migrations 146+). PRE-SIGNED FOR THEIR MOMENTS: the three
lighting questions (D1 news + reframeEnabled + provenanceLedgerEnabled light in the
world-alive presets at the regen) · **THE ONE REGEN ITSELF** (executes at its post-soak slot
without a further pause) · all migration shapes 137–144 + incoming per recommendations
(founder ×4 asks per the manager's recommendations) · the four lenses + craft furniture
(taste veto satisfied) · THE PANORAMA (build approved; queued behind S3 for the AI-file
collision) · pgcrypto-as-built · provisional AI pricing · membership normalization +
mapChains enforcement (a signed-misc wave queued behind the engine finales) · the W6 delta
(pre-approved ROUND-3 fix stock). DEFAULTED VETOABLY (a two-option fork with no recorded
recommendation): the daily-life fork stays TWO-SPEND as built. **THE TWO CARVE-OUTS a
blanket grant cannot reach:** the LEGAL PACKAGE (ToS/privacy ship only through the
professional consult — drafts stay not-in-force) and the SUPPORT-EMAIL verification (a
factual check, stays on the deploy checklist). The push/PR remains pre-authorized as before;
the merge button + db-push remain physically the owner's.
**✅ TRIPLE FOLD + RATCHET #11 (2026-07-17 ~07:30; tips 1709e333/15b0fc6e/addd4011/e6f14414).**
**BYOK SURFACE folded**: verify-by-test-call (never stored-healthy-unverified), provider-error
classes → §3d refusals w/ switch-to-managed doors + persisted key health, the usage meter +
user governors enforced at the edge door; migrations RENUMBERED at fold into the 143 gap
(143_byok_health, 144_usage_governors + internal refs; chain contiguous head=144); the three
shared docs reconciled (18 functions, 144 migrations, surveyor-byok in the deploy block).
OWNER QUEUE: does BYOK skip the managed analysis-credit debit? (S1 behavior double-charges by
design today — pricing call) · surveyor-byok joins the deploy list · envs at deploy:
app.settings.byok_secret + SURVEYOR_CANARY_SECRET · price-estimates = operator config · its
4 claimed "pre-existing base reds" CONTRADICT the gallery agent's clean gate on the same base
— audited at the composite gate. **FP-G10 folded**: −33,803 B (SUPPLY_CHAIN_NEEDS' sole eager
importer severed; byte-identity proven, slug-form guard pinned); FUTURE CANDIDATE RECORDED:
full customRegistry de-eagering (−46KB ceiling, needs async deity-resolver refactor).
**MAP STYLES folded**: the style layer (bounded data-only definitions in src/design; THE WALL
pinned ×4; geometry-untouched proven), FOUR LENSES (parchment byte-identical to pre-refactor;
watercolor; dark fantasy; VTT w/ grid+scale+token-raster export), the (seed,style) GOLDEN
(18×4 sha-pinned), cross-lens edit pin, craft pass (corner washes/cartouche/compass — TASTE
VETO PENDING at the published artifact), style schema → DESIGN_CONTENT_PLANE §7. JUDGMENTs
ratified ×4 (mapEdits.styleLens over a new container · screen-adaptive parchment · plate
inherits skin only · pane split for the ceiling). SEAMS: VTT download affordance · anon-
gallery lens honor waits on the owner-gated §6 mapEdits opt-in · OG share image never renders
the town map (pre-existing). **RATCHET #11 (manager's call at fold): 1,066,400 → 1,040,000**
(−26.4KB banked; ~8.8KB headroom retained for S3–S6/gallery-2/content registrations; FINAL
tightening at the composite gate). verify:dist 143/143 on a fresh build. S3 DISPATCHING.
**✅ GALLERY-2 (PHASE 1) RATIFIED + FOLDED (2026-07-17 ~05:00; merge ad9f3067) — THE
COVERT-CORRUPTION SCRUB IS BUILT + CERTIFIED.** The recorded leak (covert corruption
impairments NAMING the corrupted NPC riding institutions[] through get_gallery_dossier to
the anon gallery) is CLOSED: value-level covert-object drop in publicSafe.js + the SQL twin
(migration 142), **field-for-field twin parity proven in real Postgres**; fail-closed pin
(the naming description appears NOWHERE in the projection); the adversarial check joins the
owner-facing visibility audit. Branch gate 11,856/1 (sole red EXEMPT_CEILING, NO flakes).
Eager ≈ +34 B honest. Deploy of 142 rides the very-end batch. **THE VERIFY-FIRST FINDING:
~70-80% of the GALLERY-2 brief ALREADY EXISTS** (gallery_votes w/ rate-limit · 12+ facet
filters from canonical modules · relevance_score ranking w/ 9 sort keys · share_kind
map-vs-campaign distinction · sharer editing minus title · OG/JSON-LD/sitemap-fan-out SEO ·
the anon-cap trap SOLVED as caps-on-actions-never-render; residual: client-rendered body =
the one open crawlability item) — the agent correctly refused to duplicate live
infrastructure. JUDGMENTs ratified ×3 (scrub takes 142, contiguity-forced — **BYOK's 144/145
renumber to 143/144 at its fold** · full-mode-keeps-covert (DM-publish is explicit) ·
inherited doc-drift fixed+disclosed). **OWNER SIGN-OFF LIST (gallery phase 2 — the genuinely
net-new): (1) ALIVENESS ranking** — formula weighting + snapshotted-column shape (design
ready, the 063→071→076 drop-recreate precedent); **(2) REACTIONS** — the 6-item drafted
fiction-register vocabulary awaits taste veto + green-light (engagement schema); **(3) the
Campaigns third tab** — or does map_with_campaign already satisfy campaign-share?;
**(4) gallery_title column**; **(5) facet hubs + the sitemap gallery fan-out flag** (depends
on 1/3). Comments stay deferred post-launch per the standing ruling.
**⬛ OWNER COMMISSION: THE GROWTH LAYER (2026-07-17, task #36) — acquired/temporary NPC
traits.** Owner verbatim: core traits/flaws are "their constitutional core as people... they
can also have learned or temporary traits... bold by nature being more cautious after losing
several battles... traits or flaws further from their core personality should need more
frequent or more severe events... they should all reflect in that NPC's decision making,
stances, and goals." DESIGN (the D7 pattern at person scale — core frozen, growth derived):
acquiredTraits[] from the SAME bank vocabulary w/ provenance+intensity+decay · acquisition
via the D3 course machinery (weighted deposits, rare sticky hysteresis transitions, capped,
both signs) · THE DISTANCE-FROM-CORE deposit-resistance rule · effects as derived
effective-personality OVERLAYS entering the existing consumer reads (never core mutation —
state-never-fate holds: the engine weathers a person, never rewrites them) · couplings ×D5
(lifespan-scaled decay) ×D7 (growth shifts interpretation) ×chronicle (receipted beats)
×decree-tracker ×no-dead-facet. Virtual flag, dark ⇒ byte-identical, lazy kernel leaf.
ENGINE WORK ⇒ the pre-soak slot beside the Provenance Ledger — the engine's final two builds
ride together; the soak certifies worlds where people learn.
**✅ THE NPC LIFECYCLE RATIFIED + FOLDED (2026-07-17 ~04:00; merge f33e295b + bundle regen
6dff8493).** NPCs are residents: THE BANK (consolidated vocabularies zero-drift-pinned + the
22-goal TRANSITION-TYPED catalog with onAchieve/onFail — the survey CONFIRMED the owner's
achieve-transitions exist (npcGoalCulmination 0.8 threshold) and found NO declarative
successor table + NO symmetric fail transition before this wave) · THE OPS through the
covenant (EDIT_NPC bank-bounded; REASSIGN with people-held-travels/seat-held-stays; STASIS
typed+reversible with memory flowing + dormancy pass-through pinned; decree-tracker cones
asserted) · INSTANT NPC (seeded, tier-blind, counterpart-pinned) · THE FACET-CONSUMER WALKER
(EXEMPT_FACETS ceiling 0 — the no-dead-facet law enforced). 53 pins; honest +267 B eager
(trimmed from +690 after the mid-flight budget warning — THE WARNING WORKED); margin ~1.36KB.
JUDGMENTs ratified ×4 (delegated-helper dispatch — settlementSlice AT its 1345 ceiling ·
temperament+goal propagate LIVE while alignment/role stay display+future — the npcAgency
ceiling seam, documented · covenant-trusting thin dispatcher · self-contained seeded
generator). **REAL PRE-EXISTING FINDING → ROUND 3: createNpc DROPS user-supplied
flaw/temperament/goal/secret** (the ADD_NPC path claims verbatim landing and silently
discards — domain/entities/npcs.js:113). SEAMS: npcState adoption of alignment/role edits
(npcAgency headroom) · instant-NPC button host · REASSIGN target-picker UI · the op whisper.
Freshness drift cleared at fold (bundle regen). NEW CEILING HAZARD memorialized:
settlementSlice.js AT 1345 — store actions via delegated (get,set) helpers only.
**⬛ RULING #4 RATIONALE (owner, verbatim): "because the AI still costs tokens and money,
the audience would want the full capabilities and not feel cheated at launch rather than
rollout."** The task-priced model makes this rigorous: breadth is free to non-users and
fairly priced to users — staging under pay-per-task pricing reads as withheld inventory,
not prudence. Early-access labels + kill-switches keep what staging actually protected.
**⬛ OWNER RULING #4 (2026-07-17: "I want all the ai capabilities at launch") — THE
LAUNCH-WHOLE AMENDMENT (§2b @ c12b1a95 on w7-prep).** ALL Surveyor stages ship at launch.
What survives: SAFETY (the schema wall — never the ladder — carries it; worst case stays a
refused draft). What converts: the trust ladder becomes a MONITORING framework — every stage
instrumented from day one, PER-STAGE KILL-SWITCHES at the entitlement layer, honest
early-access labels on write stages until live metrics mature. PREREQUISITE-DRIVEN BUILD:
S3 intent compiler + S4 custom content + S5/S6 construction (the instant-world composer =
the compile target) build NOW alongside ROUND 3/soak (edge/display, engine-frozen-safe);
S7 autonomy + tuning counsel + S4+ knobs/packs build in the post-soak tuning window (their
prerequisites — the knob registry + the world-health library — are born there). Everything
lands before THE VERY END = at launch. Tasks #33/#34/#35 boarded (~5 more waves; days at
current velocity). ROUND 3 reviews the S3–S6 builds; the post-window builds get a targeted
review before the regen.
**✅ ToS DRAFTS FOLDED + CONTENT SURVEY BANKED (2026-07-17 ~03:30).** docs/legal/
TERMS_OF_USE_DRAFT.md + PRIVACY_POLICY_DRAFT.md merged (headed DRAFT—NOT IN FORCE; live pages
untouched by design; every claim source-mapped; the 4-question legal-consult list in-draft).
TWO REAL FINDINGS → OWNER QUEUE: (1) Cartographer PRICING DISCREPANCY — the pricing page
shows $5.99/mo while config/pricing.js sets $6.00 (600¢): reconcile to one canonical figure;
(2) the live PrivacyPage names only 3 of 4 consent purposes — the market plane / Aggregate
Interest Atlas missing (the draft closes it; the live page updates in the pre-launch batch,
REQUIRED before collection starts per §4b purpose-limitation). Its gate also surfaced a
mainline docs-freshness drift (ARCHITECTURE.md "~880 test files" vs 1,174 real) — FIXED at
fold @ 6d2ce3be (8/8). **THE CONTENT THINNESS SURVEY (6 agents, banked @
docs/review-r2/CONTENT_THINNESS_SURVEY_RAW.txt):** headline verdicts — CALAMITY prose
CRITICAL (one constitutionally type-blind template stamped PERMANENTLY into
settlement.calamityHistory + the golden wizardNews surface; variety work must vary phrasing,
never assert disaster kinds) · war/peace REASON RECEIPTS THIN (1 fixed sentence per type ×22
types, persisted per settlement-pair — the same casus reads identically on every pair) ·
newsVoice ADEQUATE (125 authored lines, the one multi-variant surface; the reframe drama
class has NO voice category — a gap to fill) · kernel news templates 1-per-event-kind.
Generation-time surfaces confirmed golden-bound ⇒ their volume waves PARK for the regen;
view-time (newsVoice etc.) lands free. The generation-wave dispatch derives from this map.
**⬛ THE FULL-BATCH DISPATCH (owner: "why don't you run these?", 2026-07-17 ~03:10):** all
five staged waves + one funding lane launched concurrently off c765a032, disjoint fences,
pre-assigned migrations (gallery 142+143 · BYOK 144+), STEP -1 location guards everywhere:
MAP STYLES (#28) · BYOK SURFACE (#29) · ToS DRAFT (#30, docs/legal only, draft-not-in-force)
· GALLERY-2 (#31 — **the covert-corruption scrub builds FIRST inside it**, JUDGMENT: the
owner's gallery commission + recorded precondition authorize the BUILD; the SQL twin still
DEPLOYS only in the very-end batch) · the CONTENT THINNESS SURVEY fleet (#27, 6 read-only
agents: variant counts + view-time/generation-time classification per surface) ·
**FP-G10** (reclaim ≥1.5KB from the closure interior, fenced away from all sibling files —
the batch funds its own registration costs; ratchet-down decision stays the manager's at
fold). Seven lanes live incl. the NPC wave. ROUND 3 opens when all of it + the provenance
ledger (#32, serialized after NPC) have folded.
**⬛ THE PROVENANCE LEDGER COMMISSIONED (owner, 2026-07-17: "commission"; task #32).**
Recorded-not-reconstructed causality: a durable per-campaign receipt ledger with true
cause-edges. ARCHITECT RULINGS (vetoable): flag-gated virtual writer (dark ⇒ byte-identical;
joins the lighting/regen queue; the chronicle reads RECORDED edges where present, inferred
elsewhere — the labels already distinguish) · size-model-before-shape (tiny prose-free
entries; storage home proposed WITH NUMBERS — in-blob+compaction vs table — presented for
signature). SEQUENCING: serializes AFTER the NPC wave (dispatcher-chokepoint collision) and
BEFORE the soak (engine freeze) — the last engine-adjacent build of the program.
**✅ THE CHRONICLE RATIFIED + FOLDED (2026-07-17 ~02:40; merged into w7-prep).** The advance
report is real: the zoom pyramid (week⇒events … year⇒full pyramid, full descent always),
thread extraction typed by the 8 drama classes, season chapters, delta-first, the deputy's
diary, THE DECREE TRACKER with §5b entanglement clustering (two-decree conflict → ONE cluster
naming the conflict, pin-executed; honest nulls as findings; every decree exactly once).
40 new pins green; ZERO eager (lands in the lazy RealmInspector chunk — closure-BFS-verified);
zero engine changes; durable-sourcing STRUCTURAL (source-scan: never reads wizardNews).
JUDGMENTs ratified ×3 (pinned taxonomy dup over engine import · no doc-dup of §5b · guidance
inline w/ map-pane registration deferred to the map pass). **⚠️ THE LOAD-BEARING SURVEY
FINDING — THE PROVENANCE-DAG GAP (OWNER DECISION QUEUED):** the world's receipts do NOT form
a durable parent→child causal DAG — derive-on-read Receipt edges name entities, not parent
receipt ids; applied ops persist no stable causal id; the durable substrate is
pulseHistory (CAPPED 80 advances, collapsed per-advance) + chronicles (24). Consequently
decree CONES and thread CHAINS are ENTITY-INFERRED (shared keys + typed reasons + temporal
order), honestly labelled `inferred` throughout the UI. THE DECISION: (a) accept inferred
cones as shipped, or (b) commission THE PROVENANCE LEDGER — a durable per-campaign decree/
receipt ledger with cause-edges (engine-adjacent writer + schema, owner-gated shape) giving
EXACT cones, cross-advance thread stitching, and a stronger receipts thesis product-wide;
if commissioned it must land BEFORE the soak (engine freeze). Also seamed: per-advance
collapse loses interior-week placement; D7 decree-reception irony (named future).
**⬛ TWO OWNER COMMISSIONS (2026-07-17, tasks #30/#31): TERMS OF USE + GALLERY-2.**
(#30) ToS comprehensive redraft — tiers/credits/founder covenant/Surveyor conduct/BYOK +
Forgetting-Law promises-never-exceeding-contracts/§3f rider disclosure/custom-content
ownership (display license only)/§3c(7) extraction prohibition/moderation — drafted complete,
SHIPS ONLY through the consolidated pre-launch LEGAL CONSULT. (#31) GALLERY-2, "the native
marketer... has to be perfect": three tabs = three artifact classes (Settlements · Maps ·
Campaigns; the realm's MAP-share vs CAMPAIGN-share newly modeled — distinct flags, schema
presented for signature) · facets from the existing controlled vocabularies (one taxonomy:
analytics+Surveyor+discovery) · ranking incl. the ALIVENESS signal (deep-history worlds rank
up) · authed receipted votes at launch, structured fiction-register reactions, full
commentary POST-launch (the comment surface = the largest attack class) · sharer editing ·
SEO (per-item OG/schema.org, dynamic sitemap, programmatic facet hubs; the anon-cap-vs-
crawlability trap solved deliberately) · **PRECONDITION: the owner-gated covert-corruption
anon-gallery scrub lands BEFORE amplification** (joins this wave's batch). ROUND 3's
product-dimension centerpiece. Build-out queue: 2 running + 5 staged.
**✅ INSTANT WORLD RATIFIED + FOLDED (2026-07-17 ~02:00; merged into w7-prep).** The
one-click premium realm: the COMPOSER (conductor over existing generators — zero
generator/engine/wizard changes; tier-blind, source-scan-pinned) → tier-mixed canon members
placed on a deterministic FMG map → discovered regionalGraph → tone preset applied to a
worldState PROVEN spatially UN-canonized (the owner's places-everything-canonizes-nothing
law, pin-executed). THE CAMPAIGN ANSWER: the survey confirmed reading (a) — a realm IS a
campaign; presence inherent, asserted in the equivalence pin. Pins 19/19 on the merged tree;
composition-equivalence = the manual pre-canonize state. JUDGMENTs ratified ×4 (N-mapping
5/9/14 tier pyramids · map-kind = the curated FMG template set · tone = Quiet/Realistic/
Dramatic · composer homed in src/lib per the domain-ratchet rationale). SEAMS: the soak
harness = composer+canonize (client #2, API ready); analytics event deferred (eager string
vs thin margin — recorded); map materialization browser-bound ⇒ PLAUSIBLE (FMG iframe cannot
run headless; the staged tableau is fully usable without it). ⚠️ EAGER HONESTY (manager
measurement): the wave's TRUE delta ≈ +687 B (mode-picker entry + macro registration +
WorldMap line — existing eager files growing; its own chunks confirmed absent from the
closure). Budget contract 26/26 green on the merged build; **estimated margin now ~1.4KB —
TIGHT**: both running lanes warned (strict-lazy discipline, stop-and-report above ~300 B);
the remedy if a future fold busts = an FP-G10 reclaim wave (reclaim-first law, never raise).
**⬛ OWNER COMMISSION: THE BYOK MANAGEMENT SURFACE (2026-07-17, task #29).** Provider pick →
verify-by-test-call (never prefix-guess) → dynamic model dropdown from the key's ACTUAL
list-models ∩ adapter-supported, per-task defaults + override, §3e retention class shown in
the picker · failure classification → §3d graceful refusals (out-of-credit names the top-up
door + switch-to-managed) + persistent key-health status · HONEST BOUNDARY: no provider
exposes balance APIs — reactive detection; "our meter is your trend, your console is your
truth" said in-UI · USAGE DASHBOARD (edge-metered token counts by day/task/model, estimated
costs labeled estimates) + USER GOVERNORS (caps, warn-at-threshold, pause) enforced at the
single edge door. The receipts culture applied to the user's own wallet.
**⬛ MAP STYLES: NON-DESTRUCTIVE GUARANTEE (owner confirmation, 2026-07-17, folded into
#28):** bespoke AI styles are ADDITIVE saved definitions — named, kept (credits bought an
artifact, not a render), re-selectable; the four base lenses remain permanently available;
flip-back instant/free/non-destructive (derived view). The cross-lens edit pin EXTENDS to
bespoke definitions (one semantic edit renders correctly under every style incl. custom).
No path exists by which styling can lose edits, damage the map, or lock the user in.
**⬛ MAP TRUTH-PROJECTION LAW + THE PANORAMA QUESTION (owner example, 2026-07-17):** the
owner's worked example (underground lava-ringed cyberpunk custom settlement, parchment×
cyberpunk blend, slanted side-view) confirms + sharpens the design: (1) THE MAP DEPICTS WHAT
THE WORLD IS — setting substance comes from the (custom) settlement's dossier; a style may
never paint what the data doesn't hold (the honest path for mismatches: offer the world-edit,
then the map follows). (2) Bespoke definitions are COMPOSITIONAL (parchment ground ×
cyberpunk glyph vocabulary = legal, intended). (3) ⚠️ SIDE-VIEW/OBLIQUE = a PROJECTION, not
a style: needs pseudo-elevations (derivable deterministically from tier/institution/wall
data) + a transform — real new capability; **OWNER-QUEUED DECISION: fold the PANORAMA
PROJECTION into task #28 or park as map-v2** (once built it composes with every lens). The
example is also the lens roadmap radar's first demand-proven entry (oov capture working as
designed).
**⬛ AI STYLE OVERHAUL REFINED (owner, 2026-07-17):** the compile context is THREE layers —
the settlement DOSSIER (what it is) + the user's INPUT PROMPT (what they want) + THE DESIGN
CORPUS itself (the four lens definitions + style schema as grounding — the AI composes
WITHIN the house design language, never from nothing). ANALYTICS CAPTURE EXPLICIT (§3f/§4b
apply as everywhere): style-overhaul riders carry style-domain vocabulary (base lens,
palette family, motif class, oov flag) → aggregated style intent = THE LENS ROADMAP RADAR
(demand-proven next lenses/genre packs from what users ask for that the vocabulary can't
yet express). Folded into task #28.
**⬛ MAP LENSES + AI OVERHAUL (owner extension, 2026-07-17, task #28 re-scoped):** FOUR
NAMED LENSES at launch — parchment / watercolor / dark fantasy / VTT ("different lenses of
the same settlement upon first generation"); switching instant+free forever (derived view);
VTT = a FUNCTIONAL lens (grid/scale/contrast/token-res export — the style schema gains
functional attributes); CROSS-LENS EDIT PIN (semantic mapEdits render correctly under every
lens, fixture-proven). AI STYLE OVERHAUL (phase 2): credits-priced task — the AI composes a
bespoke bounded style definition FROM the settlement's dossier → preview → accept/decline;
TRUST-LADDER PLACEMENT (design ruling, vetoable): the rung between S2 and S3 — the AI's
FIRST compile target, where failure is purely cosmetic (the schema wall guarantees
ugly-never-unsafe); provisional pricing joins the owner queue.
**⬛ OWNER COMMISSION: MAP BEAUTIFICATION + GENRE CARTOGRAPHY (2026-07-17, task #28).**
Beautify the settlement maps; genre styles (cyberpunk/sci-fi/noir) for Content-Plane
settlements. DESIGN: the semantic-draw-ops/renderer split (built for determinism) IS the
theming architecture — (1) THE STYLE LAYER (all visual decisions read from a bounded style
definition; geometry untouched; viewer/plate/thumbnail inherit one pass; determinism
re-minted (seed,style)→bytes; mapEdits semantic ⇒ survive re-skins) · (2) THE FANTASY CRAFT
PASS (owner taste-sample) · (3) THE STYLE SCHEMA into DESIGN_CONTENT_PLANE — a map style =
rung-3 pack display content (market district stays a market district; the skin is the
genre); THE WALL: styles select from fixed renderer capabilities, never arbitrary SVG/code
(worst case ugly, never unsafe). Genre styles land with packs at S4+. Display lane;
dispatches when a build-out lane frees.
**✅ SURVEYOR-S1b RATIFIED + FOLDED (2026-07-17 ~00:55; merge 114b0c7c + rollback-note fix
bf10b52f) — THE AI CONSTITUTION IS FULLY IN CODE.** One mid-wave stall (agent parked on a
monitor event that never fires — the known pattern; SendMessage resume worked, zero loss).
All four seamed items shipped + pinned: §3b TWO-VOICES (claims[]/musings[] structural,
sanitizeMusings strips smuggled actionable fields, registerPurity deterministic eval, the
panel's "Surveyor muses" register) · §3c(4) CANARY (derived salted tracer, logged, PINNED
never-in-output) · §3c(5) META-PROBE (migration 141: canary + meta_probe columns, writer
DROP+recreated at 17 params; full throttle detector a documented seam) · §3f RIDER (frozen
controlled vocab, id-free ai_analyst_rider event on BOTH managed and BYOK paths pinned by
source scan, EVENTS_REV 7→8, CONFLICTED-WITNESS PINNED: a flattering rider beside bad claims
still scores honestly). Branch gate 11,800/2 (EXEMPT_CEILING + the 137 rollback-note miss —
**a REAL pre-existing find: the founder lane's focused gate never ran the discipline test;
FIXED at fold @ bf10b52f**, discipline 4/4 + founder pins 11/11 green on the merged tree).
+36 B eager (the event name — the S1 precedent class); margin 2,054. JUDGMENTs ratified ×6
(direct service-role analytics insert · derived-not-stored canary · deterministic purity
regex · EVENTS_REV bump · musings-only = a charged valid turn · starter taxonomy w/ oov
growth seam). OWNER QUEUE: migration 141 sign-off (verbatim in the agent report) ·
SURVEYOR_CANARY_SECRET env at deploy. Chain head = 141 contiguous.
**⬛ SURFACING CONFIRMATION (owner, 2026-07-17: does all the hidden machinery have its
appropriate visible place for dossiers/realm, navigable and intuitive?).** DESIGN ANSWER:
yes by architecture (machinery→read-model→surface; the scope hierarchy dossier/realm-
dashboard/pulse/briefs/map/compendium + the chronicle as the incoming default doorway + the
Surveyor as the universal where-do-I-look escape hatch; invisibility deliberate for decay
rates/pacing/plumbing). KNOWN RECORDED GAPS (the census's first work list): calamityLedger
live surface (W-UPSWING deferral) · doctrine commitment-stocks read · interventions-ledger
direct view · D7 whisper/glossary seam. STRUCTURAL ADOPTION: ROUND 3 gains **EVERY LEDGER
SHIPS ITS READ** — an executable census walker: every durable store maps to ≥1 registered
display consumer OR an explicit INVISIBLE_BY_DESIGN ruling with reason; unsurfaced = build
failure. Cross-scope navigation intuitiveness = a named ROUND-3 product-dimension re-read.
**⬛ NPC WAVE: THE NO-DEAD-FACET LAW (owner, 2026-07-17: "every facet of an NPC's generation
and their agent movement is coherent with the surrounding world every facet. nothing is
useless").** Two directions, walker-enforced: (1) GENERATION READS THE WORLD — no facet
rolled in a vacuum: minting reads settlement conditions / institution type / local faith and
alignment climate / naming culture / active drama; goal chains seed from the settlement's
actual condition; instant NPCs identical (constraints narrow context, never replace it).
(2) THE WORLD READS EVERY FACET — every bank facet has ≥1 registered consumer (agency read,
politics/corruption/reframe input, or display surface); agent movement traces to facets and
every facet can move the agent. ENFORCEMENT: a FACET-CONSUMER WALKER (the operation-registry/
whisper-census pattern) — a facet without a context source or a consumer fails the build.
Folded into task #26.
**⬛ NPC WAVE EXTENDED ×4 (owner, 2026-07-17, same night):** (1) OWNER CORRECTION FOLDED:
goal EVOLUTION already exists (achieve/fail transitions) — the gap was added-NPC citizenship;
the goal catalog becomes TRANSITION-TYPED (on-achieve successors / on-fail fallbacks,
bounded), added NPCs declare or inherit-by-role a goal CHAIN and ride the same machinery
(counterpart criterion). Only personality/alignment DRIFT remains the parked
future question. (2) REASSIGN_NPC: moves between institutions/settlements — coherence
answered by the EXISTING bloc-glue typology (people-held ties TRAVEL, seat-held ties STAY;
vacancy → existing role-fill). (3) STASIS: revocable typed state (journey/imprisoned/
missing/sequestered) — participation excluded, seat vacates, MEMORY KEEPS FLOWING per D5
(the reunion inherits what the interim did); return receipted; a shelf not a grave. (4)
INSTANT NPC: seeded, bank-valid, optionally constrained, counterpart-pinned; premium per
the instant-settlement precedent (flagged). Task #26 re-scoped accordingly.
**⬛ TWO OWNER COMMISSIONS (2026-07-17, "extremely important"): CONTENT VOLUME + NPC
EDITABILITY (tasks #27/#26).** (1) CONTENT: more volume/variety/specificity everywhere thin,
under PORTABLE SPECIFICITY (catalog-anchored, never canon proper nouns — "just enough generic
so that it can be put into any campaign"); AI-bulk + register-guard validation + owner
taste-sample; ⚠️ THE DETERMINISM CATCH recorded: growing seeded corpora shifts same-seed picks
⇒ every corpus classifies VIEW-TIME (lands free) vs GENERATION-TIME (parks red, batches into
THE ONE REGEN). Survey fleet maps thin spots first. (2) NPC BANK + EDIT_NPC: the facet law
applied to NPCs — typed EDIT_NPC ops through the covenant (auto-integrates with the Decree
Tracker), THE BANK (consolidated axes/temperaments/roles + the new TYPED GOAL CATALOG,
bounded selection never free-text), EDITS CHANGE THE FUTURE NEVER THE PAST (receipted event;
propagation via existing chokepointed reads), state-never-fate CLARIFIED (binds the engine;
DM sovereignty is whom it protects), added NPCs become FULL CITIZENS via the counterpart
criterion. Named future question (owner's, not smuggled): organic personality drift = new
engine capability. Both queue behind the three running build-out lanes.
**⬛ CHRONICLE AMENDMENT §5b (2026-07-17, @ 4b2f675b on w7-prep): ENTANGLEMENT
CONSOLIDATION.** Owner: queued decrees "directly entangle with each other. so that is an
area to consolidate." Entangled decree cones (chained / shared / conflicting / synergistic,
detected over the receipts graph) render as ONE cluster — joint story, per-decree standings
within, shared descendants attributed once, SELF-CONFLICT a first-class named finding, and
honest-nulls extended ("absorbed by your own decree Y" ≠ "absorbed"). Two-decree conflict
fixture pin mandatory. Relayed to the in-flight chronicle implementer (early, survey phase).
**⬛ OWNER COMMISSION: THE CHRONICLE (2026-07-17, advance legibility) — DESIGN FROZEN @
09130996 (docs/DESIGN_CHRONICLE_LEGIBILITY.md), WAVE DISPATCHED.** The world-pulse/wizard-news/
autoresolver surfaces must be "perfect and readible and digestible and navigable and workable"
across advance spans (week→month→season→year), and DM-queued changes applied across a long
advance get a dedicated reflection surface ("it should be noted for the user because that was
their choice"). THE DESIGN: the zoom law (hierarchical never-truncating pyramid:
headline→chapters→threads→events, scaffolding scaled by span) · threads-over-timeline
(causal-chain extraction typed by the 8 drama classes; the tempo governor's boundedness IS the
tractability guarantee) · delta-first framing · the deputy's diary (auto-verdicts as beats in
threads + rulings-in-your-absence w/ reversibility; accept-by-thread) · **THE DECREE TRACKER**
(per applied DM op: landing week, direct receipt, the CAUSAL CONE of downstream descendants,
span-end standing held/absorbed/contested/undone, HONEST NULLS reported as findings; always
present, never top-forced, never lost) · durable-store sourcing rule (never read capped
feeds) · pure read-models, deterministic, zero eager, zero engine. Diagnosis recorded: data
layer A, presentation layer B- — the whole gap is display work. D7 decree-reception irony =
named seam. Build-out at THREE concurrent waves: SURVEYOR-S1b · INSTANT WORLD · THE CHRONICLE.
**⚠️ INCIDENT (contained, zero damage): the chronicle agent's base-guard checkout executed in
the MAIN TREE** (the agent-cwd-fallback hazard — the wrong-lineage class's 8th firing, first
of the fallback-hits-main-tree variant tonight): the main tree briefly sat on claude/chronicle;
caught clean within minutes (no commits, no writes — the manager's own ledger insert no-op'd
harmlessly on the wrong lineage's doc), main tree restored to review-fixes, the agent
redirected to its own worktree with pwd-verification orders. RULE: dispatch prompts must add
"verify pwd is inside your worktree path before STEP 0" — adopted for all future briefs.
**✅ SURVEYOR S1+S2 RATIFIED + FOLDED (2026-07-17 ~00:30; merge a17d71b0) — THE FIRST AI
SHIP.** 4 commits off 4052fc9c: the 7 PURE brief composers (player-safe settlement section
asserted byte-for-byte ≡ toPublicSafe) · S1 core (state-slicers, citation law — hallucinated
citations downgrade to "the engine does not record this", credit reserve→spend→refund
round-trip) · the ai-analyst edge fn (JWT → surveyor entitlement interface-gate fail-closed →
creditFlow → BYOK-or-server key never-logged → Anthropic adapter claude-opus-4-8 → citation
enforcement → audit write) · lazy client panel (audience toggle = the structural rule's
visible face; App.jsx ceiling respected via a 0-net-line wrapper). All 5 mandatory pins
vitest-executed; branch gate 11,707 passed / sole real red EXEMPT_CEILING (+2 load-flakes
proven 33/33 isolated); verify:dist 143/143; zero eager beyond 2 event names + the cost map.
AMENDMENTS: §3c/§3d/§3e FOLDED + PINNED (retentionClass REQUIRED on the adapter contract —
Anthropic declared 'bounded' conservatively w/ re-verify-at-deploy note; graceful refusals w/
refusal-quality eval; naming hygiene) · §3b/§3f/canary/meta_probe SEAMED = **SURVEYOR-S1b**
(dispatching). MERGE JUDGMENT executed: the agent's 137_surveyor_reserved placeholder DELETED
in the merge commit (founder's real 137 keeps the slot; chain contiguous at head 140;
migrationSequence 8/8; merged-tree pins 64/64). **OWNER SIGN-OFF QUEUE ADDITIONS (deploy
batch):** migration 138 audit-spine shape · 139 entitlement + BYOK vault (pgcrypto+GUC
fail-closed — VETOABLE if Supabase Vault/pgsodium preferred) · 140 provisional pricing
analysis=3/brief=4 (final Surveyor pricing owner-queued) · BYOK requires app.settings.
byok_secret at deploy (DEPLOY.md). Pending-deploy window now 23 migrations (118–140).
**⬛ INSTANT WORLD SHAPE AMENDED (owner, mid-flight):** config gains a MAP-KIND knob (which
world-map type to design in), and the instant world **PLACES EVERYTHING, CANONIZES NOTHING**
— a fully-staged tableau amendable at t=0; canonization stays the user's deliberate act.
Spec sharpened accordingly: INSTANT WORLD ≡ the state a completed manual wizard session
reaches pre-canonize (composition-equivalence pin); the soak harness client = composer +
canonize; the button = composer only.
**⬛ OWNER COMMISSION: INSTANT WORLD GENERATION (2026-07-16 late night, "before the soak") —
PREMIUM-GATED per owner correction.** One-click coherent dynamic realm: basic config (3 knobs:
realm size / tone→existing presets / surprise-me within curated bounds; the advanced wizard
stays as the alternative), map + appropriate tier-mixed settlement count + auto-canonize with
a DETERMINISTIC bounded validation-retry loop + the organic relationship/connection machinery.
ARCHITECTURE: a COMPOSER (conductor over existing generators — zero generator changes, zero
engine contact, new orchestration leaf) with THREE CLIENTS: the product's Instant World button
(PREMIUM-GATED — the gate wraps the interface entry only; tier NEVER reaches the composer,
pin-asserted) · THE SOAK HARNESS (the run families build worlds through the same composer —
the century soak certifies the exact artifact class the button mints) · later Surveyor S5's
compile target. Owner VETOED the manager's free-tier recommendation → instantness = the paid
convenience, manual = the free road (instant-settlement precedent). Pins: same-seed
fingerprint, output coherence invariants, appropriate-N mapping (presented vetoably),
zero-eager, interface-only gate. SEQUENCE: dispatches when the Surveyor folds; ROUND 3
reviews it; the soak runs through it.
**✅ W-R2-D7 RATIFIED + FOLDED (2026-07-16 ~23:45; merge 7d11428e) — THE REFRAME LAYER
LANDS, and better than planned: ZERO golden shifts** (reframeEnabled purely virtual — dark
even on peace-lit presets; the whole golden suite green on its branch), so D7 folds to the
MAINLINE instead of parking — **THE COMPOSITE SIMPLIFIES TO mainline + G2 ONLY.** 7 commits
788b5aa6→5a20b4d7: the reframeKernel lazy leaf (interpretationOf over the immutable
obligations ledger — frozen-facts pin proves no interp path writes a transfer ledger) · both
signs incl. the BRIGHT lane (enemies→allies via misreading, debtForgiven01 fuels the peace
mirror) · consumer 1: ingratitude_debt + dependency_by_design casus with MINTED mirrors
debt_forgiven + bonds_of_commerce (bijection walker 11/side, strict) · restitution term
(economic family — peaceTerms at 788/800 ceiling) · corruption-leash bounded input · THE
LEDGER OF GIFTS AND DEBTS irony read (DM sees true≠believed; player sees only their reading)
· the 8th drama class. Branch gate 11,704/1 (sole red EXEMPT_CEILING) · verify:dist 143/143 ·
zero eager (1,063,701) · merged-tree pins 70/70. JUDGMENTs ratified ×4 (deterministic
transitions over rng — reads-not-rolls; advanceReframe folded atop advanceWarReasons with
its own gate — pulseKernel ceiling respected; the minted mirrors; economic-family
restitution). SEAMS: act-class v2 transition enumeration (intelligence/mediation/religion/
kinship vocab-complete) · consumer-6 whisper/glossary (needs a UI host — display pass) ·
generosityEV stale comment (ROUND-3 fodder). OWNER QUEUE: the reframeEnabled LIGHTING
question joins D1's. Hazard recurred + caught: NUL-as-Set-key (controlBytes pin worked).
**⬛ CONTROL-SURFACE AMENDMENT §3f (2026-07-16 ~23:30, @ 4e2dbc37 on w7-prep): THE
ENRICHMENT RIDER.** Owner: capture the data before the provider forgets it + the rented AI
deciphers its own traffic + "enforceable even if the user is providing their own API...
part of the contract of using our services." Adopted with guardrails: controlled-vocabulary
self-tagging rider in the answer contract · TWO capture layers (id-free category-grade =
condition-of-service on managed AND BYOK — the id-free design is what makes the framing
defensible, flagged to the consolidated pre-launch LEGAL CONSULT; content-grade corpus
capture stays separately consent-gated) · BYOK enforceability is STRUCTURAL (keys server-side
only ⇒ one edge path ⇒ no bypass; the ToS discloses what architecture guarantees; <~1% token
overhead disclosed) · THE CONFLICTED-WITNESS RULE (quality metrics never self-reported —
independent scoring gates the trust ladder) · honest boundary recorded (binds OUR surface;
exported-data-in-outside-tools is beyond any contract). Fourth + final addendum sent to the
in-flight Surveyor implementer; all four may seam as SURVEYOR-S1b if it is already gating.
THE AI-LAYER CONSTITUTION CLOSES AT §3f (3b two-voices · 3c extraction defense · 3d
action-readiness · 3e forgetting · 3f enrichment rider).
**⬛ CONTROL-SURFACE AMENDMENT §3e (2026-07-16 ~23:15, @ f4bf8da9 on w7-prep): THE
FORGETTING LAW.** Owner ("any AI using this from my website has to delete their information
after use") adopted on the manager's shape after discussion: enforced at the three REAL
layers — statelessness by construction · contractual no-training + bounded/zero retention
floor (verify provider terms at implementation, never from memory) · retentionClass as a
REQUIRED walker-pinned adapter property with routing floors ('training'-class unroutable for
world data; BYOK posture surfaced honestly). LOUD-NOT-HIDDEN (the commitment goes in the
privacy policy; only the plumbing is invisible — the owner's "hidden" framing amended with
consent). Prompt-based deletion claims PROHIBITED as retention theater. Promises never
exceed contracts. Third addendum sent to the in-flight Surveyor implementer (adapter
retentionClass + pin ship with S1).
**⬛ CONTROL-SURFACE AMENDMENT §3d (2026-07-16 ~23:00, @ 3c69b34c on w7-prep): THE
ACTION-READINESS LAW.** Owner: the AI accesses creation + realm management + post-creation
edits, "always ready to take action where necessary and cordial and clear where it cannot."
Scope CONFIRMED (the AI drives the same doors the human has — composer verbs/forecast/docket,
S3 interpretation, S4/S4+ content, S5 construction — trust-ladder order, standing ops lane).
BIAS-TO-THE-FORM (actionable intent ⇒ a drafted, previewed proposal one approval away; never
action without approval) + THE GRACEFUL REFUSAL CONTRACT (every no names the boundary + the
nearest door; extends the W-R2-LIGHT refusal-prose culture to the AI; refusal QUALITY joins
the evals). Second addendum sent to the in-flight Surveyor implementer (S1 refusal contract).
**⬛ CONTROL-SURFACE AMENDMENTS §3b+§3c (2026-07-16 ~22:45, @ 73cd69ff on w7-prep).**
Owner: the Surveyor CONVERSES (ideas/expansions/clarifications) → §3b THE TWO-VOICES LAW
(report register citation-bound / musings register clearly marked; the split is STRUCTURAL in
the answer contract — client renders them differently by construction; register-purity joins
the evals). Owner: protect the architecture from AI-assisted extraction → §3c EXTRACTION
DEFENSE (foundation: the provider model NEVER sees the engine — derived slices only; honest
floor recorded: observable behavior is inferable, the moat is execution depth; the stack:
nothing-secret packets · disclosure hygiene · naming hygiene · per-account canaries ·
audit-spine probe detection · economic deterrence · ToS clause). Scope addendum SENT to the
in-flight Surveyor S1 implementer (fold-if-in-flight / seam-if-gating).
**✅ FOUNDER LANE RATIFIED + FOLDED (2026-07-16 ~22:30; FF @ c733e5f4).** Three commits:
c733e5f4 terms (#terms-founder: transferable lifetime individual license, cap-never-grows,
Founder reserved for the 30, transfer-right reservation, no investment framing) · cc57835f
the public /founders SEAT-LINEAGE page (lazy route, fail-closed 1..30 skeleton, all-Open
pre-launch state, opted-approved names only, sitemap→16 URLs, Pricing-page nav — App.jsx AT
its 732 ceiling so no footer link, JUDGMENT ratified) · af5757b1 DRAFT migration
**137_founder_seats WRITTEN-NOT-APPLIED** (applied-head NOT bumped; 11 shape pins incl.
fail-closed definer projection + pg_temp + append-only transfer ledger). EAGER HONESTY:
+366 B real route-registration cost (closure 1,064,067, margin 2,333) — the same cost every
public route pays; NOT rounded to zero. Pins 42/42 on the merged tree. JUDGMENTs ratified ×5.
**OWNER SIGN-OFF QUEUE (schema shape = owner-gated; presented, manager recommendations
recorded):** (1) twin-log transfer table — RECOMMEND YES (append-only receipts culture);
(2) gallery_author_slug beyond the brief's field list — RECOMMEND KEEP (the portal-of-proof
link IS the page's strategic point per the owner's stated strategy); (3) definer projection
RPC over bare SELECT policy — RECOMMEND YES (fail-closed column subset, established pattern);
(4) transfer figures in Terms framed "currently" — RECOMMEND KEEP (terms are the contract;
F22's numbers convention governed marketing surfaces). Deploy of 137 stays in the VERY-END
db-push batch regardless. Seams: stripe-webhook claim hook proposed-not-wired (concierge v1);
prior-holder scrub-right noted.
**⬛ W8 GREEN LOCAL — THE MAINLINE FREEZES (2026-07-16 ~21:50, tip 5aa11dec + brief 4052fc9c).**
The full constitutional gate on the unified tip carrying ALL of Phase O's folds (LIGHT ·
GUIDE-2b · SM-4 · title tranche · DEPTH D1–D6 complete · 3 design amendments): **11,680
passed / 11 skipped / 1 failed — the sole red is EXEMPT_CEILING 69>66 (owner-gated,
exactly the enumerated set)** · verify:dist 143/143 exit 0 · build clean. NO PUSH.
**THE BUILD-OUT FLEET IS DISPATCHED (3 Opus implementers, disjoint fences, all off
4052fc9c):** W-R2-D7 the reframe layer (engine; parks dormant; reframeEnabled lighting =
owner question) · SURVEYOR S1+S2 (edge/AI lane; migrations 138+; audience rule structural;
BYOK never-logged) · THE FOUNDER LANE (display/schema; migration 137 DRAFT presented for
signature). Migration numbers pre-assigned to prevent the 135-collision class. On their
folds: THE COMPOSITE assembles (mainline+G2+D7) → ROUND 3 opens (task #25).
**⬛ OWNER RULING #3 (2026-07-16 night, verbatim: "rather than regrade, i meant that I wanted
to change the regrade into a complete resurvey similar to the orignal prompt... after
building out everything, then the soak is last after that which then leads to tuning, and
the very end."): ROUND 3 REPLACES THE RE-GRADE.** The dimensions-only re-grade is superseded
by a COMPLETE round-3 review+fix program under the original commission verbatim (full
exhaustive survey → objective holistic assessment → Opus-ultracode fixes for every finding,
BOLD-OVER-SAFE — "objectively better with risk... every time" — Fable as architect/manager/
checker after each fix). THE FINAL BINDING ORDER: W8 gate → BUILD-OUT (D7 parks-red ∥
Surveyor S1+S2 ∥ founder lane) → THE COMPOSITE (mainline+G2+D7; local; never pushed) →
**ROUND 3 on the composite** (the survey must see the COMPLETE shipping code; golden-shifting
fixes batch with the regen — MANAGER JUDGMENT, vetoable: composite-as-substrate preserves
the ONE-REGEN law; the alternative, an early signed regen + mainline round 3, costs a second
golden event) → A+ gap register (task #24 — round 3 IS the deferred "final review") →
**THE SOAK LAST** on the post-fix composite (the same certifies-the-shipping-engine logic as
ruling #2, applied to the review as well: survey nothing twice, soak nothing stale) →
verdicts → tuning + knob-registry enumeration → targeted re-certs → **THE ONE REGEN** (owner-
signed: G2+Underways+D7+round-3 shifts+tuning) → composite merges home, mainline gate green →
**THE VERY END** (push + PR + deploy batch). Tasks re-boarded: #25 ROUND 3 created; #24 + #7
re-scoped. Timeline honesty recorded: round 2 ran ~2 days at full intensity; round 3
comparable, likely faster on a twice-hardened tree.
**✅ W-R2-DEPTH-2 RATIFIED + FOLDED (2026-07-16 ~21:20; merge 5aa11dec) — THE DEPTH WAVE IS
COMPLETE (D1–D6 all landed).** Branch gate 11,677/1 (sole red EXEMPT_CEILING), verify:dist
143/143, zero eager (closure 1,063,701, margin 2,699), 0 any-holes. **D1** distance-priced
news (1971526b): flag PURELY VIRTUAL (not in WAVES/presets — dark everywhere until the owner
lights it); belief recency-fold hop delay additive on rumor-relay latency; player rumor
freshness distance-priced, DM truth NEVER delayed; the believed-need coupling reads
ground-truth need × belief confidence (BeliefRecord unchanged per ruling 1). **D4** hegemony
+ fear_of_dominance (71aa6493): computation in worldPulse/hegemony.js with display as thin
re-export (ruling 3 — its 9 tests pass verbatim); fear_of_dominance + DISTINCT mirror
balance_restored (ruling 2 — bijection walker strict); belief-side sphere read (fogged land
+ public naval, the matrix's naval coupling); DENIAL counter-intervention amplifier in
convergence. **D3** doctrine courses (3041387c): 'doctrine' COURSE_KINDS + imposed-cult
deposits gated SEPARATELY on faithSpreadEnabled (momentum golden byte-identical); reversal
priced once via the course-generic crack + synod off-ramp. JUDGMENTs ratified ×4 (provenance
scalar origin; unknown⇒0 believed-need; fear formula NAVAL_STRENGTH_NORM=100; soak-tunable
constants NEWS_SPEED_FACTOR/LOUD_IMPOSITION/DENIAL_HEGEMON_FEAR_W — these three JOIN THE
TUNING WINDOW'S dial list). SEAMS recorded in-file (all golden-shifting-when-lit, belonging
to the tuning/regen batch): D4 treaty-term weighting (defensive/mutual_defense don't exist
yet), D3 pin-2b patron-contest bias, D3 bloc-glue pairInterest threading, D3 organic
doctrine-crack detection. **OWNER QUEUE ADDITION: the D1 lighting question** — does
distancePricedNewsEnabled join the three world-alive presets? (Shipped dark; lighting =
owner call; if lit, it rides the regen batch.) The wrong-lineage trap fired a 7TH time; the
brief guard corrected it. **W8 FULL GATE now running on the unified tip 5aa11dec** — on
green, the mainline freezes and D7 + Surveyor S1+S2 dispatch per RE-SEQUENCING RULING #2.
**⬛ OWNER RE-SEQUENCING RULING #2 (2026-07-16 evening: "should we move the soak until after
the regrade? because if there are bugs that block certain pathways and we fix that after the
soak, then what is the point?") — THE SOAK CERTIFIES THE SHIPPING ENGINE.** The soak moves
AFTER all engine content exists (not after the re-grade — the re-grade consumes soak
evidence; tuning must still follow a soak because tuning targets ARE soak measurements).
THE REVISED BINDING ORDER: DEPTH-2 fold → W8 full gate (mainline freezes green) → **D7
BUILDS NOW** (parks red-by-design like G2 — its tuning-window slot existed only for shift
batching, which the regen batch preserves) → **THE SOAK TIP composes**: a LOCAL integration
branch = mainline + G2 + D7 (goldens red there by design; the soak harness builds worlds
programmatically flags-on and never reads golden files; branch never pushes) → **THE SOAK
runs on the composite** — organic underways, reframes, catalog fixes all exercised; any
pathway-blocking bug fixes land on the composite and affected families re-run → verdicts →
tuning (+ knob-registry enumeration mints) → NOW-genuinely-targeted re-certs → **THE ONE
REGEN stays ONE** (G2+Underways+D7+tuning sign together; composite merges home; mainline
gate green) → re-grade → gap register → THE VERY END. Cost: soak starts one D7-build later
(Surveyor S1+S2 + founder lane run in parallel during it). Benefit: certification is of the
final bytes; the re-cert step shrinks from a hidden second soak to an honest small one.
**✅ MAP TITLE TRANCHE RATIFIED + FOLDED (2026-07-16 ~20:20; fd16993d merged).** WorldMap-
Toolbar's 16 native title= surveyed: 13 → the new MapControlsHelp "?" panel (role=note, the
GUIDE-2b house pattern; visible labels stay the accessible names) · 1 → aria-label (Inspector
— its dynamic unreviewed-count was the only spoken channel, preserved not lost) · 1 dropped
(ResumeChip, dormant + duplicate aria-label) · 1 KEPT native with reason (Undo Advance —
dynamic interval copy pinned by advanceMultiTickToolbar). **Title census 500 → 485.** Zero
eager (closure unchanged 1,063,603); pins 32/32 on the MERGED tree. JUDGMENTs ratified ×3
(comprehensive panel; text-glyph "?" to differentiate from the lucide tour button; the three
per-title dispositions). ⚠️ NEW HAZARD (agent-surfaced): with multiple worktrees on different
lineages, MAIN-TREE ABSOLUTE PATHS silently read the ledger lineage's file (Read/grep against
/Users/.../settlement-engine/src/... returned baseline-471 content while the worktree held
485) — always path into the worktree and `git rev-parse HEAD` before trusting file content.
**⬛ W-R2-DEPTH: 3 OF 6 SHIPPED + FOLDED (2026-07-16 ~20:00; true merge f69fd96b) — the
agent stopped disciplined rather than rush a fourth build; D1/D3/D4 hand off with complete
recon.** SHIPPED (each byte-identical-dormant BY PROOF, pinned, zero eager, branch gate
11,623/1 sole-red EXEMPT_CEILING, verify:dist 143/143): **D5** lifespan-scaled memory
(memoryHorizon facet, 4 bands via facetOf, both signs scale, undying erodes only via
reconciliation; 6811b41a) · **D6 engine couplings** (new lazy clandestineFacet leaf —
smuggle boost, siege land-leg food trickle, conspiracy ease, escape receipts,
detectInstitutionGaps hook that no-ops until G2's catalog merges — custom-facet parity
proven; 78045726) · **D2 THE SCALING LAW** (realmScaling leaf: √N sublinear tempo classMax +
rollCandidates maxAuto/maxProposals; BASE_REALM=24 above every golden/soak N ⇒ dormancy by
arithmetic; D2b VERIFIED supplyShipments top-k is per-destination local — correctly
unchanged, pinned; 365036c2) + gate reconciliation (any-cast ratchet + aiGrounding bundle
regen — cohesionWeave became a transitive input; de5031cb). Freshness re-verified on the
MERGED tree (34/34). DEFERRALS-WITH-SEAMS ratified (all recorded in-file): D5 incident
half-life scaling · D6 naval-interdiction leg (warDeployment AT ceiling) + exposure-discount
leg (npcAgency AT ceiling; corruption.js is EAGER — a covertShelter param measured +23 B and
was correctly reverted) · D2 proposal-ring/retention threading (their receipted-eviction
prerequisite verified already landed via tick-core-2). The wrong-lineage trap hit a 6th time
(worktree on d024286e master lineage) — the base-guard recipe corrected it again.
**⚠️ HAZARD MEMORIALIZED: five hot engine files sit AT their max-lines ceilings**
(pulseKernel, npcAgency, warDeployment among them; ceilings unraisable) — future engine
waves must put logic in NEW LAZY LEAVES reached via re-exports (the D2 narrativeTempo
re-export pattern), never add imports/lines to the capped files directly.
**ARCHITECT RULINGS for the D1/D3/D4 remainder (recorded vetoably; dispatching W-R2-DEPTH-2):**
(1) **D1 believed-need channel:** BeliefRecord gains NO new field (a persisted-shape change —
owner-gated class); believed need is DERIVED AT READ TIME from the observer's delayed
belief/rumor picture — facts frozen, meaning derived, byte-identical when the flag is dark.
(2) **D4 peace mirror:** the war↔peace bijection walker stays STRICT — fear_of_dominance
gets its own distinct mirror **balance_restored** (Blainey-consistent: the war-reason dies
when the believed imbalance does), which FEEDS spheres_understanding rather than reusing
foreign_clash's mirror. (3) **D4 layering:** the hegemony COMPUTATION belongs domain-side
(worldPulse lazy leaf); display/hegemonyRead becomes a thin wrapper — display reads domain,
never the reverse; warReasons imports the domain leaf.
**✅ SM-4 RATIFIED + MERGED (2026-07-16 ~19:45; true merge 335d7856, zero conflicts).** The
settlement-map endgame: the deterministic DRAW projection substrate (townMapDraw pure
draw-ops + fixed export palette in src/design) → the PDF town-map PLATE (chapter 08C, first
vector Svg in the PDF tree, in draft/canon variants, FaithWar-shaped self-gate) → the
library-card THUMBNAIL (lazy IntersectionObserver + FNV-keyed in-memory cache, cap 200) →
GALLERY OPT-IN (rides gallery_share_dm, fail-closed, renders the sanitized PUBLIC projection
— mapEdits-stripped base layout). All four required pins present (plate render-leaf, thumb
contract, opt-in default-off, same-seed→identical-plate-bytes). ZERO eager (closure 1,063,603,
margin 2,797); branch gate 11,633/1 (sole red EXEMPT_CEILING); cross-ratchet interaction with
GUIDE-2b verified on the merged tree (guidance walker 23/23; raw-color + SM-4 pins 47/47);
FULL gate deferred to the post-DEPTH unified tip. JUDGMENTs ratified ×4 (existing-flag reuse
over a new migration; base-layout plate; in-memory cache; palette homed in src/design).
DEFERRALS recorded in-file: the design-§6 coupled step (cosmetic mapEdits in gallery +
dedicated share flag + SQL-twin) and persisted thumbnail storage — both owner-gated. DURABLE
FACTS: viewModel.js sits AT its 1043 max-lines ceiling (new PDF derivations go in
SettlementPDF.jsx or another home); the title= census regex counts component props AND
comment text (never write the literal token); pure export palettes belong in src/design (the
raw-color sanctioned zone).
**QUICKINSPECTOR MAP-HOVER: ALREADY LANDED (verified 2026-07-16).** The owner-commissioned
wiring (4d669b32, 2026-07-14) is an ancestor of the unified lineage; PlacementsLayer pointer
handlers + touch guard live; guard test 4/4 green. The commission is CLOSED — nothing to
build. The map-coordinated pass therefore shrinks to ONE item: the WorldMapToolbar
teaching-title tranche (GUIDE-2b's writer-boundary deferral) — dispatching off 335d7856.
**A+ GAP REGISTER: STOPPED per owner ("wait stop. do that after the final review")** — the
five-reader sweep runs AFTER the dimensions-only re-grade (task #24; script preserved).
**TUNING-WINDOW SCOPE ADDITION (owner-confirmed intent, 2026-07-16 evening):** when the
post-soak tuning window opens, the tunable-constants enumeration is MINTED IN THE
KNOB-REGISTRY SHAPE (DESIGN_CONTENT_PLANE §6's build-early artifact — "one enumeration
serves both"): the tuning pass and Surveyor S4+ rung 2 share one registry, so the Content
Plane inherits the enumeration instead of re-deriving it. Owner also confirmed the full
updated AI/custom-content design (core + §1b extension tiers + §4b analytical coupling) is
IN the shipping corpus; pre-launch builds = S1+S2, the soak evaluators (Coupling 2's raw
material), the knob-registry enumeration; S3+/knobs/packs/streaming-health/closed-loop stay
gated on the trust ladder's LIVE acceptance metrics (post-launch by construction).
**✅ GUIDE-2b RATIFIED + FOLDED (2026-07-16 ~20:10; FF @ 457f2caa).** Two commits: 3a6f82f9
(the Keeper's Handbook Reference tab stops re-describing the catalog and DELEGATES — eight
/compendium deep-links + the custom-mode link, drift-prone duplicate prose deleted) ·
457f2caa (deep title tranche: LivingWorldGates' two native title= tooltips → an in-theme "?"
help panel; **title census RATCHET-DOWN 502→500**). Whisper-host item CONFIRMED
already-satisfied (UNWIRED_WHISPERS ceiling 0; every post-SURFACE-2 host renders via the
strict walker). Zero eager delta (closure byte-identical 1,063,596); gate green (11,598
passed; 3 load-flakes 18/18 isolated; sole red EXEMPT_CEILING). JUDGMENT ratified: the FULL
Handbook narrative rewrite + /how-to route rename stays DEFERRED as owner-voice/SEO-surface
work (the W-GUIDE-2 deferral's own "rather than rushed" caution) — landed the enforceable
delegation subset; HowToUse stays on the guidance legacy ledger as a partial disposition.
DEFERRAL RECORDED: the WorldMapToolbar teaching-title tranche waits for a MAP-COORDINATED
pass (SM-4 owns that lane concurrently — writer boundary respected). CENSUS MECHANISM FACT
(for future tranche waves): the title-census regex counts React component props
(<Insight title=> etc.) as native tooltips — the baseline is inflated with false positives
(HowToUse alone contributes 22); the design's "~340 native tooltips" ≠ the census number,
and removing component props also ratchets it down.
**✅ W-R2-LIGHT RATIFIED + FOLDED (2026-07-16 ~19:00) — the engine is reachable.** The lighting
wave landed in 4 commits (0b28f032 presets via the shared frozen WAVES object + stability/
coverage pins · 84af8c3a the dialog Engine Waves section · f3169cab dark-gate refusal prose
names the preset + dialog path, closing sim-cohesion-counterparts-4 · db07979b the shift map)
and was FAST-FORWARDED into claude/w7-prep @ db07979b — MERGE JUDGMENT (vetoable): the brief's
park-red-like-G2 disposition existed only for predicted golden shifts, and **the tree refuted
the prediction: THE GOLDEN-SHIFT SET IS EMPTY** (every committed golden driver hand-writes its
simulationRules object; none reads SIMULATION_RULE_PRESETS.*.rules), so the branch gated green
(11,604 passed / sole red EXEMPT_CEILING; verify:dist 143/143) and parking served nothing.
CONSEQUENCE FOR THE REGEN MOMENT: **THE ONE REGEN batch is now G2 + Underways + tuning + D7
only — LIGHT contributes zero shifts.** Eager truth: +252 B measured (the preset catalog rides
the eager closure via campaignWorldPulseSlice→presetIdForRules — the brief's "zero eager" was
wrong); closure 1,063,596 ≤ 1,066,400, margin 2,804 B. Implementer JUDGMENTs ratified ×4, chief
among them: **living_realm lights the nine but keeps warLayerEnabled inherited-false** (the
three war-AND-gated waves stay dormant there — a living realm moves but does not start wars;
veto = also light War on living_realm). **W-R2-DEPTH DISPATCHED** off db07979b (D1–D5 + D6
engine-couplings half, dormancy-gated by construction, zero-shift law binding).
**⬛ W7 GREEN LOCAL — push held per owner ruling (2026-07-16 ~17:40).** The full constitutional
gate on the reconciled tree, branch `claude/w7-prep` tip b1e6aa24: validate:data /
migration-head / edge / map ALL green · typecheck (full + domain:strict) exit 0 · lint 0 errors
(15 pre-existing warnings in untouched files) · suite **11,599 passed / 11 skipped / 1 failed —
the SOLE red is EXEMPT_CEILING 69>66 (owner-gated, exactly the runbook's enumerated set)** ·
verify:dist 143/143 on a fresh build (closure ≤ 1,066,400 — RATCHET #10 holds) · goldens
byte-identical in-suite. THE +3 EXEMPT ENUMERATED for the owner: focusEntity /
clearFocusedEntity / hydrateServicesToggles (master-lineage ephemeral view-state, same class as
the 66) — sign the ceiling at 69 OR commission adopting the three into the operation surface.
**W7-PREP BURN-DOWN RATIFIED (agent-delivered, checker-verified diffs-match-scope):**
41f6eaca (typecheck exit 2→0; viewModel 1041→1043 + aiSlice 941→961 re-mints, 5th
type-honestly-at-merge instance) · fc6cb5cd (useMapAutosave = the TRUE union: RF's shared
fingerprint + master's flush-on-leave data-loss guard PORTED — an edit inside the 3.5s debounce
window no longer dies on unmount/pagehide; lazy chunk, zero eager) · df2ba8f1 (4 UI tails:
dead accountDataPrivacy shell removed · authMobileReflow isMobile prop threaded ·
advanceMultiTickToolbar aria copy adapted to RF's fix-wave truth · SuccessorPrompt focus trap
WIRED — a real aria-modal defect fixed) · batchCartAdvanceGuard test REMOVED (advanceBusy was
dead-unwired even in master; RF's refusalNotice supersedes; content sits in 18949a38 per the
incident row below). All four agent JUDGMENTs ratified incl. the branch identity: the brief's
`claude/master-merge-r1` name was STALE (still @ 22bec368); the agent verified-first and cut
`claude/w7-prep` off the true expected content b1bf0346 (fold-in + FP-G9 + Surveyor docs) —
**claude/w7-prep is now the program's working lineage; LIGHT cuts from b1e6aa24.**
**THE ANALYTICAL-COUPLING AMENDMENT TRULY LANDS @ ca6c4ec7** (§4b in DESIGN_CONTENT_PLANE.md:
intent end-to-end · the world-health metric suite — one evaluator library, two clients ·
the closed tuning loop that wakes the inert §10 rails; endogeneity-extends-to-telemetry enters
the law set; matrix rows ×ANALYTICS SEAM + ×SOAK PLAN). Edge bundles regenerated @ b1e6aa24
(aiGrounding freshness restored; analyticsEvents picks up ANON_CAP_UNLOCK_CLICKED). Housekeeping:
the abandoned 100-line draft docs/AI_AND_CUSTOM_CONTENT.md (truncated mid-write, superseded by
THE_CONTENT_PLANE.md @ 023da30b) relocated to the session scratchpad, not deleted.
**INCIDENT (2026-07-16 ~17:05, manager-caused, contained):** while the W7-prep agent worked
in the merge worktree, the manager committed docs there and SWEPT the agent's staged deletion
(tests/ui/batchCartAdvanceGuard.test.jsx) into 18949a38 under an unrelated docs message — the
FP-G3 concurrent-writer class, this time the manager's own violation of the one-writer rule.
Contained: agent notified with both disposition paths; manager writes to the worktree FROZEN
until the agent's final report; the analytical-coupling design amendment QUEUED (scratchpad)
for post-agent application. Ledger truth: 18949a38's content = the AGENT's disposition, not
docs. RULE REAFFIRMED: one writer per worktree — the manager queues, never co-writes.
**⬛ THE FOLD-IN IS COMMITTED @ 22bec368 (2026-07-16 ~16:20) — THE DUAL-LINEAGE ERA IS OVER.**
One tree: master's two years + the spatial engine + 15 waves + the full round-2 fix program.
Conflicts: 11 total, all reconciled (layerBoundaries = RF's SCC machinery + W6's ratchet-down,
test-arbitrated 3/3; wizardNextSteps = RF's version, component exists; 6 both-sides-fixed
components → RF fix-wave versions; the doc trio = THE UNION — RF base + W6's ungated-edge
hazard set + the extended 057–136 MUST-APPLY security block — ALL 16 doc pin files 93/93
green; settlementSlice ceiling → 1345 fold-in-union truth, reconciliation #4).
**PREDICTION RESULTS: goldens BYTE-IDENTICAL 147/147 ✓ (the engine survived the fold-in).
Budget MOSTLY cured: +4,723-over-old-budget → +3,472 over RATCHET #10's far tighter 1,066,400**
(provenance: master's adopted entity-link + focus features RF's budget never funded) →
**FP-G9 dispatched** (target ≥3,600 B; candidates: the canon-via-aiSlice split the trim census
named, the entity-link chunk, a fresh merged-tree over-inclusion census). W7 runs after G9.
**✅ W6 COMPLETE (2026-07-16 ~15:55, closing confirmation @ 830e2b23):** final suite
5 failed / 11,367 passed — the red set EXACTLY the enumerated five (budget fold-in-cured ·
EXEMPT_CEILING owner · 2× edge-bundle W7 · the documented flake 5/5 isolated). 220→5. One
golden-shifting port (narrativeArrival tail-pick) correctly reverted to the signed-regen
cluster rather than forced. Agent stood down; worktree is the manager's. THE FOLD-IN EXECUTES.
**THE FINAL W6 LEDGER (2026-07-16 ~15:30, agent-delivered, ratified):** 220 failed files /
485 failed tests at W6 open → **11 files / 21 tests**, classified: 2 owner-gated (budget
fold-in-cured + EXEMPT_CEILING), 2 W7-scoped (edge-bundle freshness — the build-edge-shared
regen), 1 confirmed load-flake (5/5 isolated ×2), 6 hand-merge remainders (the agent's honest
tracking-miss surfacing — CLOSING NOW under the established patterns). DISPOSITION TOTALS:
107 dropped-with-reason (resurrectable from d024286e) · 60 adapted · 50 fixed-file ports ·
13 blocked-on-owner. Security haul: gallery sanitize-on-write, the LIVE money-journey e2e
restored, backdrop-URL guard, avatar-XSS, 3 proto-pollution guards, domain-strict false-green
hole, tier fail-closed pair, §5.1 transform-threading. Goldens byte-identical throughout
(27/27 at f9fa72f8). **THE OWNER-QUEUE DELTA: 18 new items** (full list in the agent ledger,
tasks/a659911124265fa66.output + per-commit bodies) — presented at the batch moment.
(d) **MEMBERSHIP ID NORMALIZATION (W6 misc verdict):** RF's campaignSettlements /
getCampaignForSettlement do exact-match id compares — string/number-mismatched members are
silently DROPPED from advances today; normalizing (master's String() model, matching RF's own
isSettlementClockBound) would ADD those members back = sim-membership change on existing
campaigns. Repair-shaped but engine-input-touching → owner's call. The crash-guard sub-part
lands now. Also ratified to W6: the tier-gate sentinel pair (allowlist + re-gate, 'capital'
vocabulary kept), the **isSafeBackdropUrl security fix** (javascript:/data: backdrops persist
today), the live-list merge salvage; DROPs recorded for master's warFront-seed bridge + the
atomic-RPC hybrid model (RF's lanes supersede).
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
