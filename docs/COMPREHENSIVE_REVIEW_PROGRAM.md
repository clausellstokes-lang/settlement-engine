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
