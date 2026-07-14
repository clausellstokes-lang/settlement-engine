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
  Both docs write grounded on the corruption recon (wf_8c9fcc07-932); build home W-DOCTRINE.

- **2026-07-14 — SCOPE FREEZE (owner: "for the first time in a minute... i think i am done adding
  things"):** the design corpus is CLOSED as of this ruling. Final scope = everything above +
  the frozen docs. From here the program is EXECUTION ONLY: pending designs write from the
  corruption recon (corruption web + settlement politics w/ NPC dimension), then builds proceed
  down the master sequence. New scope requires a fresh owner directive.

## Owner-parked aspiration (recorded 2026-07-14 — do NOT build without a fresh owner directive)
- **THE LIVING SETTLEMENT MAP**: a settlement-layer map procedurally DETERMINED BY the dossier and
  EVOLVING WITH it — the "map as first-class engine surface" thesis one level down from the realm
  map (a calamity's ruined quarter, a boom's new district, reconstruction visibly raising beams).
  Owner: "the last thing that I would want to build (but I'm telling you not to for right now)…
  that would be the last thing if usage of Fable is enough." Sequenced BEHIND: the fix program →
  upswing/relationship flows → Surveyor stages. The end-goal framing, verbatim intent: "be good at
  everything, excel at the most important, and take over from all my other competitors."

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
