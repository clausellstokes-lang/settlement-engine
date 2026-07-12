# THE PHASE 5.5 → LAUNCH EXECUTION PLAYBOOK
## The complete architecture + management protocol for everything remaining
### Fable 5, 2026-07-12 — written as the succession document: EITHER Fable or Opus executes this end-to-end

This document is the single source of truth for the remaining program. It assumes Fable may be
unavailable for long stretches. Everything is pre-decided to the depth an Opus implementer/manager
can execute WITHOUT architectural guessing. Where a decision genuinely cannot be pre-made, it is
marked ⚠️ OWNER or 🔱 FABLE-ON-RETURN — there are deliberately few of these.

BINDING COMPANIONS (do not duplicate, reference): docs/PHASE55_SPATIAL_ENGINE_DESIGN.md (PARTS I-VII
— the design + six grounding verdicts), the committed briefs in docs/briefs/ (KEYSTONE_BRIEF,
MODULATION_BRIEF, SEASONS_A_BRIEF, FP1_FIRSTPAINT_BRIEF), memory/owner-fix-philosophy.md (the
standing loop: Fable surveys → Opus verifies+implements at full fidelity → bold-over-safe within
the constitution → check after each fix).

---

# PART 0 — THE OPERATING PROTOCOL (read first, every session)

## 0.0 THE STATE LEDGER (the portable truth — a successor AI starts HERE)
This ledger is maintained BY LAW (§0.3 step 7): every commit appends/updates a row. It is the
in-repo replacement for any assistant's private memory. Companion state that does NOT transfer to
a new AI: the Claude memory dir + session task lists — everything needed is HERE + the design doc
+ docs/briefs/ + git history. Amendment history for the docs themselves is in `git log --follow`.

### 0.0.1 ACCOMPLISHED (chronological, with commit hashes — verify any claim via `git show <hash>`)
| Wave / act | Commit(s) | What + notable deviations |
|---|---|---|
| Reunification W4a-W4e (Library/Realm/Gallery/Account/Dossier) | pre-24858b5d history | product surfaces onto OUR floor; W4e held the FaithSection constitutional gate |
| W4f Generate/PDF/Compendium | 24858b5d | draft export, save recovery, sealed Faith&War PDF chapter (three-fold gate, test-pinned) |
| W4g Admin | 1af43b01 | THE PII FIX: raw profiles.select gone, audited edge only; SimTuning stop-reported |
| W4h domain-display read-models | 56ca62ad | armyStrength/tradePressure/visibilityAudit verbatim (lineages had converged); budget→1,441,000 |
| RP-1 regressions | 508713fb | 7 real defects incl. AutoSaveChip integrity + SimRules write-guard; item 5 completed by manager |
| W4f last-mile | 2674802f | premium Faith&War chapter now REACHES premium exports (was dead-pathed); nameById plain-map law |
| W2 conjunction content | d7cc13df | 1,662 lines / all 2,016 conjunctions above floor; display sidecar + 4-rung ladder; goldens untouched |
| Chip fixes | 85bb8c51, a6f2a5bb | generator fails closed on options-in-neighbour-slot (killed the trace flake); copy-pin re-point |
| CL-0 control layer | 0359d243 | profile enums (virtual, absent=legacy-byte-exact), authorityFor, FROZEN mode, presets 3→5, rulesetLog receipts, dialog v2; REAL BUG fixed (LivingWorldGates faith toggle was droppable); worldState ledgers consolidated data-driven |
| 5.5-W0 foundations | dd4f522c | computeLawfulness/computeMalice + settlementAlignment (substrate, no consumers); temporal audit ZERO violations + gate extended; maintained 30y soak (FINDINGS: stasis on record; population→~390-470 attractor under war depth ⚠️ owner-parked); trade-primitive tests (premise corrected: suites existed); A3 full_simulation war sub-flags lit (+192B) |
| FP-1 first-paint | 4edc5bf8 (+a0145671 parking) | −186,998B (−13%): segmented copy, registry-prose split, exportPosture leaf, DERIVED data-chunk graph, graph-derived icons; budget 1,441,000→1,256,000 RATCHETED; store-slices STOP→parked §0.6 |
| SEASONS-A food year | b17b89db | granary rhythm term-for-term-zero at swing=0 (byte-identity by construction); hungry gap emergent; seeded year variance; seasonsEnabled default OFF, living_realm+full_simulation lit; regenerated CL-0 pin STRUCTURALLY verified. Noted: pre-existing living_realm saves re-infer realistic_regional (accepted display-only drift) |
| 5.5-K KEYSTONE (merged from claude/sad-poitras-1d587b) | f4d1aeef (+9f3c48d6 parking) | frozen integer digest (multi-source Dijkstra, territory/gates/tiers/distances/receipts, 3 version axes, 4 reserved null slots); digest sizes 47/61/87KB; DEVIATION: pack.cells capture was an INJECTED seam → wired later in 5.5-M; worldState auto-merge with SEASONS-A verified |
| Session mode + Foundry (merged from claude/peaceful-volhard-0ad3f1) | df217415 (5 commits) | Foundry VTT export + Session Mode; faithEventFilter default-closed (manager-read, 50/50 tests); zero conflicts |
| 5.5-M MODULATION + live capture | 18fc15f2 | trade/faith × distanceWeight (floor .35, modulated EXACTLY once), propagation ARRIVAL LATENCY (spatialArrivals ledger, news dated at arrival), hopWeeks calibration receipt (1wk/median-primary-hop); live read-only getSpatialPack bridge + capture registry; freeze-first-capture encoded; +17B (ledger key literal, keystone precedent) |
| any-cast restoration | b6959c9a | the parallel-worktree tax typed honestly: 13 holes→0 across keystone/worldState/faithEventFilter; ratchet EXACTLY 2252; esbuild-proven comments-only |
| Playbook + re-scope + ledger | 53943214, 2ebe1fd6, 759de2de | this document; OWNER RE-SCOPE (movers=launch); the STATE LEDGER (0.0) |
| STEP 3.5 RUMORS & NEWS + Perfect-but-Delayed | 884b5011 | rumorNetwork.js (packet + per-settlement top-K ledger, hop-by-hop trade carrier, lineageIds day-one, independence-weighted corroboration, organic degradation tailed distribution, tick-age expiry); settlementRumors.js read-model (DM truth vs player WHITELIST — enumerated, deity-name fails CLOSED, latentPantheon excluded — manager-verified constitutional); infoMode omniscient/perfect_delayed/unreliable (living_realm→delayed, full_sim→unreliable, prospective floor); RumorsTab lazy. wizardNews schema UNTOUCHED. +243B eager (spec-mandated §3.2-7) → closure 1,255,937/1,256,000 |
| WAVE A THE BELIEF MAP | a4e04ad5 | beliefMap.js — the belief() selector w/ IDENTITY FALLBACK (dormant/self ⇒ the ORIGINAL ground-truth fn verbatim, zero forks — manager-read); advanceBeliefMaps modeled node-for-node on advanceInstitutionTolerance (independence-weighted reconciliation, silence-decay, contradiction-widens, cold-start=ground-truth-at-canonize); the 3 settlementStrategy reads re-plumbed; misjudgment-as-cause (W-C5-shaped + news) when belief diverges >2 bands; scoringObjective.js default descriptor (byte-identical); settlementBeliefs.js DM read-model (truth/belief/divergence). Gate = spatialCanonVersion+infoMode NEVER settlementStrategyEnabled (pinned). +13B eager (the beliefMaps ledger key) → closure 1,255,950/1,256,000 = **50B HEADROOM**. CL-0 rogue-family war pins replay identical; suite 7819/7819 |
| M1 EMBATTLEMENT ROUTING (mover ladder #1) | (this commit) | embattlement.js — embattlement as a first-class CONTINUOUS region scalar (0..1 `level`), NOT a boolean: a conditionally-materialized ledger `{id → {level, phase, sinceTick, lastTick}}` advanced at tick-time from the ramp (siege+occupation acute drivers, war_exhaustion+high-crime sustain, bounded security counterforce capped so a garrison can't lift a live siege). HYSTERESIS = the co-built brake (enter 0.55 / exit 0.30 deadband + 6-tick exit dwell; `phase` is an INTERNAL latch, zero consumers — manager-grepped: the only `.phase==='embattled'` read in the tree is embattlement.js:204). Routing = RE-SCORE k cached candidate routes (candidateRoutes DERIVED from the frozen digest gates/distanceMatrix, WeakMap-memoized, NEVER re-pathfound — no keystone amendment needed) weighted by W0 risk-tolerance (lawful reads danger true); the scalar feeds a CONTINUOUS danger cost (affine, proven), never a gate. Seeded/sporadic/bounded banditry on channel strength (real shipments ride it in M2). +15B eager (the one `'embattlement'` ledger literal) → closure 1,255,965/1,256,000 = **35B HEADROOM**. Gates (manager re-verified): M1 23/23; any-cast 2252; goldens 72/72 byte-identical (dormant on aspatial AND peaceful-spatial fixtures — crime/exhaustion alone never cross 0.55); build+verify:dist 108/108 |
| M2 CARAVANS / SUPPLY-STARVATION (mover ladder #2) | (this commit) | supplyShipments.js (pure engine) + supplyKernel.js (adapter) — the map makes trade TRAVEL. Per-consuming-institution supply links pre-rank K cheapest REACHABLE producers from the frozen digest (rankSupplySources); FAILOVER = O(K) list-walk (pickSource), NEVER a re-solve. AGGREGATE in-transit shipment ledger keyed `${settlement}:${institution}:${input}` — ONE record per active link, NEVER per-wagon (cardinality manager-verified); rides M1 hopWeeks; real shipments ride M1 banditryLoss on the delivered fraction. GENERALIZED supply-starvation: new `supply_starved` impairment KIND in status.js (JSDoc-only, 0 runtime) generalizing blockadeTransport's 'access' — DISJOINT cause namespace `supply-starved:` (never re-triggers 'stressor-blockade:'); triggers ONLY on extended TOTAL cut (all K severed AND buffer empty AND not fragile-braked); TEMPORARY (lifts on arrival); mandatory causal receipt; foodStockpile stays food (no double-count). CO-BUILT BRAKE: <2 independent sources ⇒ FLAG fragile, don't starve. M2b (AUGMENT): resolveSiegeVerdict gains supplyPush = STRENGTH·clamp01(interdiction) folded into logOdds — interdiction 0 (aspatial/fed) ⇒ +0 ⇒ BYTE-IDENTICAL (all 6 siege pins manager-re-verified). Wired BEFORE the war layer (this-tick starvation feeds M2b). +18B eager (the one `supplyShipments` key) → closure 1,255,983/1,256,000 = **17B HEADROOM**. Gates (manager re-verified): M2 34/34; any-cast 2252; goldens+6 siege pins 108/108 byte-identical; build+verify:dist 108/108; full suite 7867/7867 |
| M3 SEASONS-B / WINTER ROADS (mover ladder #3) | (this commit) | distanceRead.js (read-time seasonal engine) + spatialCost.js (buildSeasonalOverlay cost law). The digest's reserved seasonalOverlay slot LIGHTS: per-season × per-terrain cost multipliers, MULTIPLICATIVE, applied at READ time — pathCost reads the FROZEN distanceMatrix scalar then × the season×terrain factor (matrix NEVER re-baked; manager-verified grep = zero digest writes). SLOW-NOT-SEVER: every factor finite ∈ [1, SLOW_NOT_SEVER_MAX=6], blend is a cost-weighted avg ⇒ bounded, hopWeeks ≤ 52, never Infinity/cut (a snowed-in town is rescuable by spring). OPT-IN dormancy: buildSpatialDigest lights the overlay ONLY on seasonalRoads:true; default → overlayVersion 1 + null → every byte-frozen golden BYTE-IDENTICAL (digest hash proven identical); read gate activeSeasonalOverlay returns null when absent ⇒ multiplier 1.0. NEW live canon opts in (overlayVersion 2, §V.1 receipted re-canonize); existing SAVED canons keep frozen v1, read dormant. Consequences EMERGE: winter lengthens M2 shipment + 3.5 rumor arrivals (info runs cold), SPRING-THAW news burst (season_marker score 70) seeds the rumor ledger on the winter→spring crossing (gated on activeSeasonalOverlay, NOT seasonsEnabled), route CHOICE reroutes a winter mountain pass to a plains detour by cost. Storm hooks pre-wired for M8. BUDGET-FREE: rides the existing spatialDigest slot, season derived free from seasonForTick → closure 1,255,983 UNCHANGED (a chunk-graph +49B artifact was diagnosed + fixed by keeping the blend inside distanceRead). ONE existing test updated (campaignWorldPulseSpatialCanon: a live-canonize BEHAVIOR assertion, not a byte-golden — new granular assertions for the intended overlayVersion-2 behavior; manager-verified legit, not a masked regen). Gates (manager re-verified): seasonalRoads 17/17 + new seasonalOverlay golden 3/3; any-cast 2252; goldens byte-identical; build+verify:dist 108/108; full suite 7887/7887 |
| M4 MIGRATION-WITH-MORTALITY (mover ladder #4) | (this commit) | migration.js (pure engine) + cultureDistance.js (the §II.5-2 5-term composite, LIVE read) + migrationKernel.js (adapter). Population is a SPATIAL FLOW: a shed pool → a refugee column that travels a route, loses people to TWO mortality sinks (origin τ-scaled + road embattlement×season, both BOUNDED — "rescuable not annihilated"), and arrives fewer+later at a 4-axis destination (closeness/culture/safety/richness) with congestion pushback + scatter-floor. THE CONSERVATION INVARIANT holds BY CONSTRUCTION (departures == originDeaths + roadDeaths + Σarrivals, exact integers; asserted per dispatch + on a 60-tick soak, ledger fully drains). Origin-loss-proxy RECONCILED: aspatial abs*0.45 path runs verbatim when dormant (spatialActive default falsy → byte-identical); spatial sheds the same abs (byte-parity origin trajectory), the abs*0.45 BECOMES the origin-mortality stage (never both). RELEASE (pre-apply arrivals credit) / DISPATCH (post-apply shed→columns) two-phase. cultureDistance reads only live state (proven never-frozen). MORTALITY IS AGGREGATE-ONLY — no npc id touched (product boundary; test: named NPC survives max-mortality tick). OWNER-DELEGATED ATTRACTOR TUNING (retunable constants documented): 6y war+famine 8-settlement soak → hub 3.16× mean (congestion caps it, NO megacity), min 493 (NO annihilation), 83.7% survival, total 84% of start (war-sink not collapse), NO A→B→C chain-collapse. BUDGET-FREE (nests under spatialLedgers via setSpatialLedger) → closure 1,255,921 UNCHANGED. Gates (manager re-verified): M4 29/29; any-cast 2252; goldens byte-identical; build+verify:dist 108/108; full suite 7916/7916 |
| Design doc (companion) | many (98e2aed8…d5672d31 range) | 20 owner rounds + PARTS I-VII (6 grounding passes); §11 control layer; II.5 + VI.4 decisions settled |

### 0.0.2 STANDING AMENDMENTS + RULINGS (things a successor must not re-litigate)
- BUDGETS: first-paint CLOSURE_BUDGET_BYTES = 1,256,000 (FP-1 ratchet; never raise without owner);
  any-cast ceiling 2252 EXACT (fix types, never widen); domain-strict 0/0.
  ⚠️ HEADROOM CRITICAL as of 3.5: only **63 BYTES** free (closure 1,255,937). Wave A MUST stay fully
  lazy (its belief-ledger key ≈ one CONDITIONAL_LEDGER_KEYS literal ~17-25B fits; the selector +
  reconciliation + DM read-model are all LAZY worldPulse/display — no eager cost). Any wave that
  needs eager bytes beyond ~40B STOPs → triggers FP-2 (the parked store-slice split, ⚠️ owner-gated)
  OR a design tweak to keep it lazy. The store-slice reclaim (§0.6) is the release valve if pressed.
- OWNER RE-SCOPE (2026-07-12): the M1-M10 mover ladder is LAUNCH content; Phase 6 after M10;
  checkpoint = validation milestone only.
- SETTLED DESIGN DECISIONS: design doc §II.5 (cost→weeks 1wk/primary-hop; culture = derived
  behavioral composite; imported maps aspatial v1; one-shot extraction) + §VI.4 (coalition = seat
  in v1; centrality ceiling as soak-guard; archetype = the faction key) + belief cold-start =
  ground-truth-at-canonize + envelope 5-30 settlements + round-18 (no party vantage; NPC excursions
  protected) + round-19 seasons + round-20 ports.
- ACCEPTED DRIFT CLASS: preset re-inference on newly-lit keys (A3, SEASONS-A) — display-only.
- KNOWN OPEN FINDINGS: population attractor (owner-parked, gates M4); legibility-at-density
  (feed 240-cap, backlog); analytics dual-import build warnings (pre-existing); 15 lint advisories.
- INCIDENT PATTERNS (proven recoveries): session-limit agent deaths → §0.5; worktree-lane
  baseline collisions → type honestly at merge (b6959c9a); mis-cut worktree base → verify
  merge-base before work (the W5 re-merge self-correction).

### 0.0.3 IN-FLIGHT / ON THE DESK (update on every dispatch + landing)
- STEP 3.5 RUMORS & NEWS: COMMITTED 884b5011 — manager-reviewed under the Opus handoff.
- WAVE A THE BELIEF MAP: COMMITTED a4e04ad5 — the belief/decision layer complete; the fog of
  war is real.
- M1 EMBATTLEMENT ROUTING: COMMITTED 4f76f1ee — mover ladder #1; embattlement is now a
  first-class continuous region scalar with a hysteresis brake, cheap-vs-safe routing re-scores
  the frozen digest's derived candidate routes.
- M2 CARAVANS / SUPPLY-STARVATION: COMMITTED 67a94661 — mover ladder #2; trade now travels,
  a cut road starves a smithy, a starved besieged town's hold weakens. Headroom is now 17B (down
  from 35). CHIPPABILITY VERDICT (grounded 2026-07-12, wf_b465a1ff): the ladder is a SERIAL
  pipeline — chip nothing; M2-M8 all share distanceRead's re-score + pulseKernel's tick + a single
  budget slot; the ONE future fork is M9 (political lane, budget-free, disjoint surface) but only
  AFTER M5. NEXT: M3 (winter roads) is budget-free (rides the spatialDigest reserved slot) → fits
  the 17B. THEN M4 = THE OWNER GATE (population-attractor review + the budget-reclaim decision:
  RECOMMEND nesting the spatial mover ledgers under one namespace key to reclaim the per-mover
  eager cost, over the store-slice FP-2/W5 path). The new-key movers M4/M5/M6 do NOT fit 17B.
- FP-R SPATIAL LEDGER CONSOLIDATION: COMMITTED (this commit) — the budget reclaim gating M4/M5/M6.
  The 5 spatial mover ledgers (spatialArrivals/rumorLedgers/beliefMaps/embattlement/supplyShipments)
  now nest under ONE conditional key `spatialLedgers` (accessors homed in the lazy distanceRead.js —
  a fresh module leaked a chunk-manifest entry, so it was folded in). Eager array 5 literals → 1;
  closure 1,255,983 → 1,255,921 (−62B); budget RATCHETED DOWN 1,256,000 → 1,255,985 (64B reserved
  margin). A NEW mover ledger (M4 migration) now costs ZERO eager bytes (setSpatialLedger + generic
  ensureWorldState). Goldens byte-identical (0 fixtures touched, all 5 dormant); deep-clone-no-alias
  contract preserved at the relocated path; any-cast 2252; full suite 7887/7887. THE BUDGET WALL IS
  CLEARED — M4/M5/M6 are now budget-free.
- M4 MIGRATION-WITH-MORTALITY: COMMITTED (this commit) — mover ladder #4; population is now a spatial
  flow with two bounded mortality sinks + a by-construction conservation invariant. Owner-delegated
  attractor tuning landed HEALTHY (hub 3.16× mean — no megacity; min 493 — no annihilation; no chain-
  collapse); mortality is aggregate-only (named NPCs never touched — product boundary held). Budget-
  free (nests under spatialLedgers). NEXT: M5 army/field combat (unblocks the M11a plague-vector term).
- M3 SEASONS-B / WINTER ROADS: COMMITTED ce949b8f — mover ladder #3; the digest's reserved
  seasonalOverlay slot lit (read-time per-season × terrain cost, frozen matrix untouched, slow-not-
  sever). BUDGET-FREE (closure UNCHANGED 1,255,983 / 17B headroom). OWNER DELEGATION (2026-07-12,
  "continue M3 to M4"): the owner handed me the M4 gate — I take the population-attractor tuning +
  the budget-reclaim approach on best judgment, conservative + retunable constants, DOCUMENTED here
  for later owner review. NEXT: the budget reclaim (ledger-namespace consolidation) must land BEFORE
  M4/M5/M6 — 17B does not fit a new migration ledger key. Then M4 migration-with-mortality.
- W5 RE-MERGE: BLOCKED on ⚠️ OWNER headroom decision (see §0.6 — +1,000 budget raise vs FP-2).
  NOT merged; deferred (cosmetic, non-blocking). Branch 312a5025 preserved in worktree amazing-thompson.
- MODEL: main loop switched to OPUS 4.8 (2026-07-12) — running the playbook as manager per §0.1;
  Fable-reserved items (checkpoint + final grade-checks, round-21+ design, batched parking-lot
  adjudication) queue for a Fable session; do NOT self-rule on §0.6 items.
- NEXT: W5 merge review → Wave A (PART 4) → merges (PART 6) → M1..M10 movers (PART 7) → the Living
  Realm checkpoint (PART 5, the final everything-on validation) → Phase 6 launch-readiness (PART 8) → launch.
- OWNER DECISION QUEUE: population-attractor review (gates M4); M10 expiry policy + Living-World
  catch-up; Phase-6 backlog triage; golden-regen sign-off if ever needed.
- FABLE-ON-RETURN QUEUE: checkpoint grade-check (PART 5.5); the final comprehensive grade-check
  (PART 9); interim grade on record: A overall (A+ bones / B+ experiential voice — the sidecar
  backlog is the named fix).

## 0.1 The roles, and what changes when Fable is absent
- FABLE (when available): architecture rulings, wave sequencing changes, brief authorship for
  UNSPECCED work, the per-wave review judgment calls, the final grade-check.
- OPUS-AS-MANAGER (when Fable is out): executes THIS playbook mechanically — dispatches the next
  wave per §0.4, runs the §0.3 review checklist on its return, commits with exact staging, moves on.
  Opus does NOT: re-sequence waves, override a ⚠️/🔱 marker, regenerate goldens without the
  documented protocol, widen a fence mid-wave, or invent architecture not in this playbook or the
  design doc. If a wave's implementer STOP-AND-REPORTs something this playbook doesn't answer:
  park that item, commit what's clean, continue the ladder, log it in §0.6.
- IMPLEMENTERS: always Opus 4.8, always `model:'opus'` on spawned agents, always fenced, always
  leave work UNSTAGED, always report per the wave's contract.

## 0.2 The constitutional laws (every wave, no exceptions)
1. SAME-SEED BYTE-IDENTITY — goldens byte-identical (generator, worldpulse, pdf) or STOP.
2. DORMANCY/ADDITIVITY — every new layer gated (spatialCanonVersion / a domain-module flag /
   default-off); ABSENT ⇒ prior bytes, VIRTUAL (no write-on-load).
3. PREMIUM — tier never touches generation; free/anon never see live deity names or DM truth;
   the includeCovert/includeGroundTruth selector convention is the reveal seam.
4. ENDOGENEITY — the party observes; it never feeds fit math.
5. FIRST-PAINT RATCHET — verify:dist green at the CURRENT budget (check
   tests/build/vendorPdfLazy.test.js CLOSURE_BUDGET_BYTES — FP-1 will have lowered it); any wave
   that moves the entry closure without explicit budget in its spec STOPs.
6. BOLD-OVER-SAFE WITHIN THE ABOVE — prefer the real architecture over the minimal patch whenever
   both satisfy the gates; overhaul + prove the bytes (the CL-0 worldState consolidation is the exemplar).

## 0.3 THE MANAGER'S REVIEW CHECKLIST (run on every implementer return — mechanical)
1. `git status --short` — the diff matches the report's file list EXACTLY; foreign files excluded.
2. Re-run INDEPENDENTLY (never trust the report): the wave's NEW test files; the three golden
   masters; `npm run build`; `npm run verify:dist`. On a contended machine run files individually.
3. Read the diff of every file the wave's fence marked sensitive (each wave chapter names them).
4. Check the wave's constitutional law specifically (each chapter names its law + its proof).
5. Commit with EXACT staging (list every file; never `git add -A` — parallel sessions leave
   foreign unstaged work), `--no-verify`, a message following the house style: what + why +
   the laws held + gate numbers (closure bytes, test counts).
6. Update the task list; dispatch the next wave per §0.4.
7. **UPDATE THE STATE LEDGER (§0.0) — BY LAW.** Append the wave's row to 0.0.1 (hash, what,
   deviations), record any new ruling/amendment in 0.0.2, and refresh 0.0.3 (in-flight/desk/
   queues). The ledger update rides the SAME commit as the wave (or the very next one). A wave
   is not "done" until its ledger row exists — this document is the successor's memory.

## 0.4 THE DISPATCH ORDER (the ladder — sequential chain, ONE optional chip ahead)
CURRENT (as of this writing): FP-1 in flight (budget-exclusive) · W5 chip in its worktree ·
Session/Foundry branch awaiting merge review (§6.2).
1. FP-1 lands → commit → note the NEW budget number.
2. Dispatch SEASONS-A (brief: SEASONS_A_BRIEF.md) in the main session.
   SIMULTANEOUSLY (optional, if lanes allow): chip 5.5-K (KEYSTONE_BRIEF.md) in a worktree —
   the ONE safe parallel wave (disjoint fence, no entry bytes, longest critical path).
   Also: run the §6.2 Session/Foundry merge review.
3. SEASONS-A lands → commit. Keystone lands → merge per §6.1 + commit.
4. Dispatch 5.5-M (MODULATION_BRIEF.md — verify the committed digest shape first).
5. 5.5-M lands → commit → dispatch STEP 3.5 (the full spec is §3 of this playbook).
6. 3.5 lands → commit → dispatch WAVE A (the full spec is §4 of this playbook).
7. Wave A lands → commit → merges (PART 6) → the M1-M10 mover ladder (PART 7, each its own wave) →
   THE LIVING REALM CHECKPOINT (PART 5, the everything-on validation) → Phase 6 (PART 8) → launch.
CONCURRENCY LAW: never more than TWO heavy lanes total (incl. chips); the budget-touching lane
runs exclusive; never chip a wave whose upstream interface is uncommitted.

## 0.5 Session-limit recovery (proven twice)
On an agent death at a limit boundary: (1) verify tree state (`git status` + mtimes — what did it
write?); (2) SendMessage to the SAME agent id (resumes from transcript, context intact) with a
state briefing: what exists unstaged, what remains, any tree changes since dispatch, "do not
rewrite what exists"; (3) if the tree went quiet 15+ min with no completion, ping the same way.

## 0.6 The parking lot (append here; do not act without a ruling)
- (W5, 2026-07-12) ⚠️ OWNER DECISION — W5 RE-MERGE IS BLOCKED ON HEADROOM. The W5 cosmetic sweep
  (branch 312a5025, worktree amazing-thompson; 68 files, gate-green on base df217415, ONLY
  OutputContainer.jsx conflicts with current HEAD) adds ~+1,000 eager first-paint bytes (two eager
  configSlice store-slice feature fields — the monolithic-store issue). It self-raised the budget
  1,256,000→1,257,000 "OWNER-RATIFICATION PENDING". Current headroom is 63B, so it does NOT fit.
  Opus-manager will NOT self-authorize a budget raise (§0.2/§0.0.2). OWNER PICKS: (a) ratify the
  +1,000 raise (cosmetic-worth-it call), OR (b) run FP-2 (the parked store-slice split) first to
  reclaim headroom, then merge W5 at 1,256,000. W5 is cosmetic + non-critical-path — deferring it
  blocks nothing. Merge protocol when unblocked: resolve OutputContainer (3.5 extracted
  dossierLazyTabs; W5 has dossier polish — keep both), full battery, §6.1.
- (5.5-K, 2026-07-12) LIVE PACK.CELLS CAPTURE: the keystone proved its digest against INJECTED pack
  fixtures; the real FMG-iframe read-only capture seam (extract pack.cells H/biome/r/c once at
  canonize) is UNWIRED — it belongs to 5.5-M (MODULATION), the first CONSUMER. MODULATION's dispatch
  MUST wire the live read-only capture behind the entitled canonize action + answer the extraction-
  determinism question against a REAL map (the freeze-first-capture ruling stands if two captures differ).
- (FP-1, 2026-07-12) EAGER STORE SLICES: the monolithic 15-slice create() has no lazy-registration
  pattern; the remaining entry weight is the slices themselves (settlementSlice 88K, aiSlice 58K,
  campaign trio ~89K unmin). Needs ⚠️ OWNER-approved dynamic-slice-injection architecture
  (preserving persist/devtools/subscribeWithSelector semantics) as its own wave — FP-2 if wanted.
  NOT blocking: post-FP-1 headroom is ample (budget 1,256,000, ~2KB margin at measured).

---

# PART 1 — 5.5-K: THE KEYSTONE (brief committed: docs/briefs/KEYSTONE_BRIEF.md)

The hardest wave. The brief is complete and binding; this chapter adds the MANAGER's protocol.

## 1.1 What it is (one paragraph)
An entitled, explicit opt-in at canonize stamps `worldState.spatialCanonVersion` and runs a
ONE-SHOT extraction: pack.cells captured from the FMG iframe once, then a PURE domain module
(src/domain/spatial/**) quantizes the cost field to integers and runs ONE multi-source Dijkstra
→ territory, gates, neighbour tiers, distance matrix, route receipts — persisted as an immutable,
conditionally-materialized digest with THREE version axes (spatialGeometryVersion, costLawVersion,
overlayVersion) and FOUR reserved null slots (seaLanes, airField, teleportEdges, seasonalOverlay).
LAND FIELD + SCHEMA ONLY — no consumers, no sea/air/seasonal materialization (scope-frozen).

## 1.2 Manager review — the sensitive reads
- The DORMANT proof: a canonized-but-not-opted-in fixture advances byte-identically (the test
  must exist and pass); the golden corpus untouched.
- The EXTRACTION-DETERMINISM finding: the report MUST answer whether two iframe captures of the
  same map are byte-identical. If NOT: the ruling is already made — FREEZE THE FIRST CAPTURE as
  canon (never recompute), and the digest golden pins it. Do not let the implementer soften this.
- The DIGEST SIZE numbers (5/15/30-settlement maps). Over ~200KB at 30 ⇒ the compaction options
  come back as a report, not a shipped save-bloater.
- Tie-break tests concrete (an equal-cost fixture asserting the deterministic choice).
- The entitlement read is AT THE STORE CALL SITE; the domain stays tier-blind. Grep the diff for
  any tier/auth read under src/domain/spatial/ — must be zero.
- The reserved slots are null-present in the schema AND the digest golden (so materializing waves
  can't schema-break).
## 1.3 Failure modes to expect
- Iframe capture nondeterminism (answered above — freeze-first).
- A* iteration blowups on big maps → the multi-source Dijkstra is the prescribed algorithm;
  all-pairs A* in the diff is grounds to bounce the wave.
- Scope creep toward consumers ("just wire one read to prove it") — bounce; Modulation is the
  consumer wave.

---

# PART 2 — 5.5-M: MODULATION (brief committed: docs/briefs/MODULATION_BRIEF.md)

## 2.1 What it is
Three seams read the digest under the marker: trade channel weights × distanceWeight, faith-spread
reach × distanceWeight, and regional-impact propagation gains ARRIVAL DELAY via a conditionally-
materialized arrival queue (news dated at arrival). hopWeeks derives its weeks-per-cost constant
from the digest's distance distribution (median primary hop ≈ 1-2wk, diameter ≈ one season) and
RECORDS it in the digest receipts. NO new movers/rumors/carriers.

## 2.2 Manager review — the sensitive reads
- VERIFY-FIRST evidence: the report must cite the committed digest field names it read (not the
  brief's guesses).
- The dormant branch: the aspatial code path is UNTOUCHED (prefer parallel gated reads over edits
  to aspatial expressions) — read the diff of tradeSalience/religiousContest/propagation for any
  un-gated behavior change.
- The arrival queue: object-keyed, conditionally materialized, applied in codepoint-sorted order
  at tick start; expiry/limits documented.
- The weight FLOOR (an established channel never zeroes) — the constant + its rationale in the report.
- Spatial-on golden fixture: deterministic across two runs; committed.
## 2.3 Failure modes
- Latency applied to LOCAL (same-settlement) effects — arrival delay is for CROSS-settlement
  propagation only.
- Double-modulation (weight applied at two seams of the same chain) — the report must show each
  chain modulated exactly once.

---

# PART 3 — STEP 3.5: RUMORS & NEWS (trade-carrier) + PERFECT-BUT-DELAYED — THE FULL SPEC
## (this section IS the implementer brief — copy it into the dispatch prompt)

DEPENDS ON: 5.5-M committed (the arrival queue + hopWeeks exist). BINDING: design doc §4f (the
info-quality vector, round-13 PRNG organic degradation), PART III (§III.1 wizardNews substrate
facts, §III.2 the five determinism disciplines, §III.3 the crown-ships-early correction), PART VI
§VI.2-1 (LINEAGE AT 3.5, NON-DEFERRABLE), §11 (the info-mode control).

### 3.1 Scope law
TRADE CARRIER ONLY. No armies/refugees/faith/courier/criminal/magic carriers (they ship WITH their
movers, post-checkpoint). Two info modes ship: PERFECT-BUT-DELAYED (build FIRST — §11's sleeper)
and UNRELIABLE-NEWS (the fidelity vector + organic degradation). OMNISCIENT = the dormant default.
FULL-INFO-SIM does NOT ship here (needs factional beliefs, Wave A+).

### 3.2 The architecture (pre-decided)
1. THE RUMOR PACKET + PER-SETTLEMENT LEDGER — a NEW conditionally-materialized worldState key
   (NOT a WizardNewsEntry schema change — PART III §III.2-3 is binding: campaign.wizardNews is
   written for every campaign; touching its schema breaks dormancy). Shape:
   `worldState.rumorLedgers = { [settlementId]: { [eventKey]: arrivalRecord } }`, top-K bounded
   (K=24 initial; tune in soak), tick-age expiry (NEVER createdAt).
2. THE ARRIVAL RECORD carries: eventRef (the wizardNews sourceEventId — the canonical event id,
   verified existing at propagation.js:1067), `lineageIds[]` (THE NON-DEFERRABLE FIELD — roots at
   the canonical id; every relay appends its telling), arrivalTick, hopCount, carrier ('trade'),
   and the CONTENT+TRUST vector fields per §4f: completeness01, accuracy01 (a DERIVED summary of
   field mutations, not stored prose), framing tags, provenance (source settlement + relay chain),
   corroboration count (INDEPENDENCE-WEIGHTED: reports sharing lineage roots corroborate ~0 —
   PART V §V.3 is binding; count independent lineages, not arrivals).
3. PROPAGATION — hop-by-hop over the TRADE edges only, riding 5.5-M's arrival queue (a rumor IS a
   delayed arrival with a payload). Continuation guard per-(event,carrier); recording
   per-(event,settlement,carrier) (PART III §III.2-6). Significance gate: reuse
   significanceForImpact/score — only `major`+high-`notable` events enter the network; score
   modulates max hop distance (constants documented, tuned in soak).
4. DEGRADATION (Unreliable mode only) — per-hop SEEDED roll forked
   `rumor-organic:${eventId}:${carrierId}:${edgeId}:${hop}` off the pulse rng confluence
   (pulseKernel.js:230) — a DISTRIBUTION with tails (rare perfect preservation, rare severe
   garble; round 13). Completeness decay drops low-salience FIELDS; accuracy mutation is BOUNDED
   (magnitude bands, name-swaps only to real in-world names). Perfect-but-Delayed mode: NO rolls,
   NO vector decay — latency only (timeliness is deterministic arithmetic).
5. THE READ-MODEL — pure `settlementRumors({worldState, settlementId, includeGroundTruth=false})`
   following the mobilizationStatus.js includeCovert convention (PART IV §IV.2): player projection
   = a WHITELISTED field set, value-scrubbed (deity names only if resolving to an ACTIVATED public
   snapshot; causeClass/covert dropped — PART III §III.2-4 binding). DM projection adds ground
   truth + provenance + divergence. The share-to-gallery pipeline strips DM truth at the EXISTING
   publicSafe seam (round 18 ruling — ONE seam, no new party state).
6. THE SURFACE — a "Rumors & News" section in the settlement dossier's World area (lazy), built
   on the WizardNewsPanel partition idiom (mine/elsewhere per settlementIds); arc-threading reused
   where applicable. Fiction-not-internals copy. FIRST-PAINT: zero entry bytes (lazy only).
7. THE CONTROL — `infoMode` in the CL-0 profile stops being locked: 'omniscient' (default,
   dormant) / 'perfect_delayed' / 'unreliable'. Preset wiring: living_realm → perfect_delayed;
   full_simulation → unreliable. Ruleset receipts on change; PROSPECTIVE application (historical
   reports don't gain lineage — PART V/§11 binding).
### 3.3 The tests (the wave's proof)
Dormant byte-identity (omniscient/no-marker ⇒ zero new keys); Perfect-but-Delayed determinism
(two runs byte-identical); Unreliable same-seed identity + different-seed divergence; the
FALSE-CORROBORATION pin (5 relays of 1 origin ⇒ independence count 1; 2 independent lineages ⇒ 2);
lineage threading (every arrival's lineageIds roots at the canonical event); expiry by tick-age;
the whitelist scrub (a free/anon projection NEVER contains a latent deity name, covert tag, or
ground-truth field — adversarial fixture with a deity-carrying event); top-K bounding; a
rumor-ledger golden fixture.
### 3.4 Manager review — sensitive reads
The whitelist function (read it line-by-line against PART III §III.2-4); the fork keys (per
event+carrier+edge+hop, never per settlement — §III.2-5); wizardNews schema UNTOUCHED (empty diff
on wizardNews.js normalizeEntry/schemaVersion); the CL preset wiring (receipts fire).

---

# PART 4 — WAVE A: THE BELIEF MAP — THE FULL SPEC
## (this section IS the implementer brief)

DEPENDS ON: 3.5 committed. BINDING: design doc §4g (rounds 10/13/14/15), PART IV (the verified
seams + IV.3 disciplines + IV.4 corrections + IV.5 order), PART V §V.4 (the reconciliation rule),
PART VI (VI.3 Wave-A amendment + VI.4 rulings).

### 4.1 Scope law
ZERO NEW MOVERS. This wave makes the EXISTING war chooser belief-sourced and misjudgment legible.
No preemptive strikes/ally-defense marches (Wave B, needs army-transit). The war domain's
DM-Driven state stays deferred (the initiate/resolve split is Wave B).

### 4.2 The architecture (pre-decided)
1. THE BELIEF LEDGER — `worldState.beliefMaps = { [observerId]: { [factionId]: { [subjectId]:
   { readiness, strengthBand, allianceLabel, faithLabel, confidence01, lastUpdateTick } } } }`
   — conditionally materialized under spatialCanonVersion + infoMode != omniscient. THE FACTION
   KEY IS PRESENT FROM DAY ONE, defaulting to THE GOVERNING SEAT (round-14/VI.4-1 ruling: v1 =
   the single isGoverning seat's operational belief; coalition derivation is Wave B). An
   (observer,subject) entry materializes ONLY when a rumor actually reached the observer
   (PART IV §IV.3-1 — never pre-populate; the sparse graph is the cardinality cap).
2. COLD-START (VI.4/round ruling, owner-delegated, now BINDING): at spatial opt-in, beliefs
   INITIALIZE TO GROUND TRUTH AS-OF-CANONIZE (confidence 1.0, lastUpdateTick = canonize tick).
   The fog ACCUMULATES from there. (This also makes the dormant→active transition non-paranoid.)
3. THE UPDATE RULE (V.4, the consumption point of rounds 12/13/15) — a pure
   `advanceBeliefMaps({snapshot, priorLedger, incomingReports, tick})` modeled NODE-FOR-NODE on
   advanceInstitutionTolerance (institutionTolerance.js:172 — PART IV verified precedent).
   Per-(observer,subject,attribute): weighted reconciliation of decayed-prior + reports, weights =
   provenance(source reliability) × recency(tick-delta) × INDEPENDENCE (3.5's lineage signal) ×
   prior-confidence. CONTRADICTION widens uncertainty (confidence drops — a contested belief).
   CONFIDENCE DECAYS with silence: pure arithmetic on (tick − lastUpdateTick), NO rng (round 13 /
   PART IV §IV.3-4). Total-order fold: packets sorted (tick desc, score desc, fidelity desc,
   codepoint packetId) BEFORE folding; observers+subjects codepoint-sorted (§III.2-5/IV.3-2).
4. THE THREE RE-PLUMBED READS (PART IV §IV.1 — the whole attachment): settlementStrategy.js
   buildStrengthLookup (:111), contextFor relationship labels (:164), isBesieged/warFronts (:101)
   route through ONE pure selector `belief(observer, subject, worldState)` with IDENTITY FALLBACK:
   marker absent OR omniscient ⇒ ground truth verbatim, NO rng forked (the fidelityNoise
   neutrality-theorem discipline — byte-exact today, gated orthogonally to settlementStrategyEnabled
   per PART IV §IV.4). Marker present + no belief record ⇒ MAX-UNCERTAINTY read (absence-as-
   information at the seam, §IV.3-5). SELF-reads stay ground truth (the self/other carve-out §IV.4).
5. MISJUDGMENT-AS-CAUSE — when the chooser acts on a belief whose divergence from ground truth
   exceeds a band, stamp a `misjudgment` record (the W-C5 cause-lifecycle shape: what was believed,
   what was true, which report misled) → a wizardNews entry in the house voice + a legible receipt.
   This is the fog of war made DM-visible.
6. THE DM VIEW — extend the 3.5 read-model: truth vs belief vs divergence per settlement
   (includeGroundTruth convention). The dossier war/status read gains a "what they believe" band
   (premium/DM only; player projection unchanged).
7. SCORER DOWN-PAYMENT ONLY (VI.3): lift enumerateMoves' four inlined formulas into a DEFAULT
   ScoringObjective descriptor, golden-pinned byte-identical. NO objective parameterization beyond
   the default (Wave B).
### 4.3 The tests
Byte-identity: marker-absent + omniscient fixtures advance byte-identically (the constitutional
pins, per-flag); cold-start init (beliefs == truth at opt-in); reconciliation properties
(deterministic, order-independent after sort, contradiction widens, silence decays, independence
weights beat echo-chambers); the three reads' identity-fallback (no marker ⇒ bytes equal HEAD);
misjudgment fires on a constructed stale-belief war fixture and produces the receipt; the DM/player
projection scrub (adversarial); cardinality (no entry without an arrival; a 30-settlement fixture's
ledger stays sparse); a belief-ledger golden.
### 4.4 Manager review — sensitive reads
The identity-fallback function (line-by-line: absent ⇒ verbatim ground truth, zero forks); the
gate is spatialCanonVersion+infoMode, NEVER settlementStrategyEnabled; the fold's sort keys; the
misjudgment band constants (documented, soak-tunable); goldens + the war-behavior pins (the CL-0
rogue-family fixture must still replay identically under legacy defaults).

---

# PART 6 — MERGES + IN-FLIGHT (the near-term desk)

## 6.1 Merging worktree branches (W5, Session/Foundry, keystone-if-chipped)
Protocol per branch: (1) read ITS report/commits; (2) rebase onto current HEAD (or merge if rebase
is noisy — prefer rebase for linear history); (3) resolve conflicts PREFERRING HEAD's constitutional
seams (budget test, simulationRules, worldState) and the branch's own feature files; (4) run the
FULL battery on the merged tree (this is where parallel lanes pay their serialization tax — budget
for it); (5) the faith/premium adversarial check on any branch adding surfaces (Session/Foundry's
faithEventFilter seam gets the FaithSection-equivalence test treatment: free/anon fixture, no
deity names, gate load-bearing); (6) exact-stage commit.
## 6.2 Session/Foundry branch (claude/peaceful-volhard-0ad3f1, 5 commits) — review AFTER FP-1
lands (it adds UI surfaces against a budget FP-1 is rewriting). The faithEventFilter seam is the
sensitive read. W5 (worktree amazing-euclid) merges when its session ends, same protocol.

# PART 7 — THE MOVER LADDER (⚠️ OWNER RE-SCOPE 2026-07-12: LAUNCH CONTENT, no longer post-launch)
## Dispatch-ready specs, PART-3 depth. Order BINDING. Each wave = mover + CO-BUILT brake + OWN soak.
## Execution order (owner 2026-07-12): this ladder runs BEFORE the Living Realm checkpoint (PART 5) —
## the checkpoint is the FINAL everything-on validation of the mover-COMPLETE engine, then Phase 6
## (PART 8), then launch. Each mover has its OWN incremental soak; the checkpoint's soak is the single
## holistic pass over all movers at the end. Universal laws for every M-wave: dormant (no marker /
## flag off) ⇒ byte-identical; conditionally-materialized ledgers (object-keyed); seeded forks from
## stable composite keys; codepoint-sorted mutation order; tick-time only; carriers ship WITH their
## movers (round 9); every wave re-runs the prior soaks green; any-cast 0-hole; the manager checklist §0.3.

### M1 — EMBATTLEMENT ROUTING (depends: 5.5-M)
Embattlement = a first-class CONTINUOUS region scalar in a new conditional ledger: ramp inputs =
occupation, active siege, pyrrhic war aftermath (war_exhaustion), high crime; counterforce = security
institutions + falling crime (the W-C3 machinery). HYSTERESIS is the co-built brake (PART II §II.3-3):
enter >X, exit <Y<X, minimum dwell ticks — routing reads the SCALAR (graded cost), never a boolean.
Cheap-vs-safe = RE-SCORING the k cached candidate routes per mover risk tolerance (k-shortest cached
at canonize per §II.4 — NEVER re-pathfind per tick); risk tolerance from settlementAlignment (W0) via
the rust/fidelity read (lawful/seasoned reads danger true). Trade through embattled routes: seeded
sporadic banditry loss — bounded, non-catastrophic (fork `banditry:${shipmentId}:${tick}`; v1 applies
to channel strength, real shipments arrive with M2). Fence: src/domain/spatial/embattlement.js +
distanceRead re-score + the ramp-input reads. Soak: threshold-jitter fixture NEVER flip-flops; 10y
embattled-border run bounded. Sensitive reads: the hysteresis constants; the scalar never gates a
boolean anywhere.

### M2 — CARAVANS / SUPPLY-STARVATION (depends: M1)
Per-CONSUMING-INSTITUTION supply links: at trade-establishment, pre-rank the K cheapest reachable
producers per (institution, input) from the digest (§II.4 — failover is O(K) list-walk, never a
re-solve). In-transit SHIPMENT ledger: ONE record per active link {institutionId, input, sourceId,
arrivalTick} riding hopWeeks — aggregate, bounded, conditionally materialized. NEW impairment kind
SUPPLY-STARVED in entities/status.js, GENERALIZING blockadeTransport's access impairment (one
starvation ledger — §II.3-4-g; foodStockpile REMAINS the food-specific buffer, no double-count);
per-input stockpile buffers generalize the foodStockpile pattern (iron etc.); triggers ONLY on
extended total cut (all K sources severed AND buffer empty); TEMPORARY (lifts on arrival); the causal
receipt is mandatory ("the smithy starves: the iron road is cut under the siege of X; no shipment in
N weeks"); resolution rides W-C5. Basic interception: a hostile-to-destination gate on the route cuts
the shipment (full smuggle counterplay = M7). M2b (same wave, AUGMENT not replace): resolveSiegeVerdict
gains a supply-interdiction TERM (a supply-starved besieged settlement's hold weakens) — the full
siege-as-starvation replacement completes in M5. CO-BUILT BRAKE: assert ≥2 independent source paths
for critical inputs at establishment (else flag, don't starve — §II.3-3). Soak: siege-starvation
cascade depth/rate capped; 10y supply-web run. Sensitive: ledger cardinality (records = active links,
never per-wagon); the generalized impairment does not re-trigger blockadeTransport's.

### M3 — SEASONS-B: WINTER ROADS (depends: M2; small)
The seasonalOverlay reserved slot materializes: per-season cost multipliers, MULTIPLICATIVE with
terrain (mountains → near-impassable, plains merely slow — round 19 slow-not-sever), versioned under
costLawVersion/overlayVersion (a cost-law change = receipted re-canonize per §V.1). Consequences
emerge, not authored: winter arrival ticks lengthen (info runs cold), the SPRING THAW news burst
appears in the rumor ledger, campaign season emerges by cost. Storm-season hooks pre-wired for M8's
sea lanes. Soak: the annual route-rhythm visible in arrival distributions; hungry-gap × slow-roads
composition bounded (a snowed-in famine town must be rescuable by spring, not annihilated — tune with
the SEASONS-A constants).

### M4 — MIGRATION-WITH-MORTALITY (depends: M3; HIGH-RISK — owner reviews the population-attractor
### finding BEFORE dispatch ⚠️)
The §4c full model: context-dependent carrying-capacity tolerance (prosperity + connectivity +
granary raise it); excess migrates along routes; TWO mortality sinks (origin + road, road deaths
scale with M1 embattlement + M3 season — refugees through a winter war zone die more) — both EVENTS
with receipts; destination = the 4-axis weighted choice (closest / least cultureDistance / least
hostile / richest) with a PRNG scatter fraction. cultureDistance(a,b) is BUILT HERE: the pure
composite selector (faith proximity via deity axes + alignment proximity via W0's settlementAlignment
+ economy/ways-of-life + trade ties + governance drift via factionArchetype 3-axis — rounds 6/7,
§II.5-2). Arrival feedback: same-faith influx reinforces, different-faith shifts (bounded).
CO-BUILT BRAKES (all mandatory, §II.3-3): congestion pushback (hub pull DECAYS as it fills —
per-capita saturation + crowding deficit + size-scaled crime), scatter-floor (the 'concentrated'
distribution mode FORBIDDEN under spatial), transport lag (the arrival queue), reconcile the
abs*0.45 origin-loss proxy (it BECOMES the origin-mortality stage — never both), and THE
CONSERVATION-LEDGER SOAK: Σarrivals + Σmodeled-deaths == Σdepartures, exact, asserted. Soak: the
multi-year war+famine regional run — no chain-collapse (A→B→C), no megacity, the W0 population-
attractor retune validated here. Sensitive: the conservation assertion; the scatter floor constant;
cultureDistance is a LIVE read (never frozen).

### M5 — ARMY-TRANSIT + FIELD COMBAT (depends: M4; the war convergence)
Armies gain position-along-path ledgers (travel weeks via hopWeeks × army speed; readiness/terrain
modulate); CROSSING-PATH COLLISION → field battle: the §5 bounded resolver — win probability = a
sigmoid over effective strength (readiness × supplyQuality × size × funding × defender's-ground ×
travel-fatigue), CLAMPED so P(upset)→0 past threshold (no-hand-of-miracle; fork
`battle:${[a,b].sort().join(':')}:${tick}`); retreat = per-mover embattlement (§6). REINFORCEMENTS =
armies-in-transit on the same ledger; the COURIER UMBILICAL (round 12): an army's belief-staleness
grows when its route home is cut (reads the Wave-A belief machinery — an info-starved army
mis-assesses; blinding the enemy's couriers becomes a real tactic). SIEGE-AS-STARVATION completes:
the capacity-roll core is REPLACED by the supply mechanic (M2's interdiction term + time + relief),
keeping the feasibility gate + outcome bands. The army/frontline carrier lights in the rumor network.
BRAKES: the clamp + the exhaustion homeostasis (already built + soak-verified). Soak: the
war-distribution certification RE-RUN (frequencies/outcomes/exhaustion curves within envelopes) +
a 30y two-power border war that ENDS endogenously. Sensitive: the sigmoid constants; collision
detection is O(armies²) per tick — armies are few, assert a bound; the old capacity-roll path must
be cleanly gone (no dual siege math).

### M6 — ENTREPÔT / TOLLS (depends: M2)
Intermediary-frequency metric derived from digest gate-crossings of ACTIVE M2 shipment routes (not
raw geometry — earned centrality); frequent intermediaries accrue toll/gate-tax prosperity + unlock
transshipment institutions on the W-C3 founding lane (warehouse, customs house, carriers' guild).
Toll term joins the M1 route re-score: greedy tolls divert shipments (the self-balancing reroute).
CO-BUILT BRAKES (V.6 + VI.1 — NO trade damping exists in-tree; build all of it here): congestion
(throughput ceiling per gate), infrastructure maintenance cost (toll income has upkeep), wartime
targeting (an entrepôt is a fat siege target — feeds M5 threat), rent extraction bounded. Soak: the
megacity loop — 30y, no runaway hub (Gini-style bound on prosperity concentration asserted).
Sensitive: the metric reads SHIPMENTS not geometry; the brake constants.

### M7 — CONTRABAND / SMUGGLE (depends: M6 + M4's cultureDistance)
Gates gain POLICY: prohibit/confiscate goods categories violating law/culture/alignment (contraband
is RELATIONAL — cultureDistance + the governing archetype decide; slaves the flagship, data-driven
category table). The smuggle network: strength from criminal opportunity + thieves-guild (the
EXISTING saturation cap re-validated as the brake); smuggle attempts are RISK-TOLERANCE-gated
(alignment fidelity — bold/chaotic runs what cautious/lawful won't). THE PER-GATE PIPELINE ORDER IS
LAW (§II.3-4-e): smuggle roll → (if detected ∧ hostile) interception seizure → (elif contraband)
confiscation → else toll. Smuggle = ONE per-shipment roll vs the route's WORST gate (§II.3-4-f — the
besieged trickle survives); corruption is the hinge (a corrupt gate leaks); conscience gates every
seizure's take (W-C2). The criminal/underground rumor carrier lights. Soak: the siege-trickle
envelope (a besieged settlement with smugglers starves SLOWER, never not-at-all); guild strength
stays bounded. Sensitive: the pipeline order in code matches the law; the worst-gate rule.

### M8 — SEA LANES MATERIALIZED (depends: M5; §4j verbatim)
The seaLanes reserved slot lights: PORT ELIGIBILITY = geography ∧ institutions (coastal/river cell +
dock/harbor/shipwright from the catalog — derived at digest, RE-DERIVED on founding events via the
receipted re-canonize path); sea/river edge set connects eligible ports (cheap + high-capacity — the
historical order-of-magnitude, constants documented); the ISOLATION INVERSION lands (island + port =
hub); NAVAL BLOCKADE = holding the water gate (M5 siege interdiction needs land ∧ sea for ports);
PIRACY = the M1 danger term on lanes; STORM SEASON = M3's hooks; the SHIP-CREW carrier lights
(fast port-to-port rumors — ports become info brokers); refugee sea passage (funded sail, desperate
walk) joins M4's destination choice. NO fleet combat (sea-interdiction abstraction only). Soak:
island-hub economics; blockade-starvation parity with land sieges. Sensitive: port derivation purity;
the re-derive-on-founding receipt.

### M9 — WAVE B: THE POLITICAL DEPTH (depends: M5 + Wave A; the largest M-wave — consider splitting
### at dispatch into M9a scorer/factions + M9b intel/moral if the implementer reports scope strain)
(1) FACTION BELIEF MAPS: the belief ledger's factionId dimension activates — per-faction beliefs fed
by their round-9 carrier organs (merchants←trade, military←couriers/armies, clergy←faith when lit,
criminal←smuggle, public←ambient); the governing COALITION derives (seat + relationship-allied
factions — VI.4-1's deferred half); dissent = belief divergence as an internal stressor
(council_schism); faction LEAKAGE via the compromise system. (2) OBJECTIVE-PARAMETERIZED SCORING:
enumerateMoves' default descriptor (Wave A's down-payment) gains per-archetype objective sets +
the NEW non-war move levers (merchant: reroute/embargo/credit; church: missionize/legitimacy;
warlord: prestige/opportunity) — VI.1's two-step completes. (3) MORAL DRIFT: unjust instigation
(acting on false belief against a non-threat) drifts settlementAlignment — sharpest for lawful-good,
scaled by victim innocence + past relations; wired to W-C2 conscience + W-C5 (the unjust war is a
CAUSE with a reckoning arc). (4) ALLY-INTEL/BETRAYAL: the deliberate high-confidence sharing channel
(couriers/circles, preserved fidelity, confidence-gated); alignment styles the handling (round 15A —
lawful faithful-but-brittle, evil accurate-inward/deceptive-outward); the COMPROMISED-ALLY LEAK
(shares route to the real enemy — belief-map alliance accuracy becomes load-bearing). (5) TELEPORT
BLOCS: the teleportEdges slot lights (authored premium edges, magic-gated); zero-hop hi-fi intel +
bounded trade; the bloc = clique-of-the-willing; node-starvation economics (round 11). (6) THE WAR
INITIATE/RESOLVE SPLIT: evaluateWarLayer's initiation routes through the candidate/proposal
machinery → war's DM-Driven tri-state unlocks (the CL-0 deferral closes). Soak: full-info 30y; an
evil-manipulation arc OCCURS and stays bounded; coalition dissent → coup pathway exercised.
Sensitive: the initiate/resolve split preserves the war-behavior pins under legacy flags; faction
belief cardinality (observer×faction×subject — the sparse-arrival law extends per-faction).

### M10 — CL-3: FULL AUTONOMY CONTROLS (depends: M9)
The approval queue EXTENDS to actor-initiated majors (M9's autonomous declarations/coups route
through it under 'routine'): pending-actions ledger + realm UI; HOLD-THEN-EXPIRE semantics — the
proposing actor holds a defensive posture N weeks then the proposal EXPIRES TO DECLINE (⚠️ OWNER
may override the expiry policy; never block the advance). Recommendations mode gains the rationale
surface (candidates' reasons[] rendered). LIVING/AUTONOMOUS progression ships: capped deterministic
advance-on-open catch-up (calendar-delta → N ticks, receipted; ⚠️ OWNER: confirm wanted + the cap).
infoMode completes: 'full' (factional beliefs + reconciliation) joins the ladder; presets re-audited
(Full Simulation = everything, honestly). Soak: a catch-up of 26 weeks == 26 manual ticks,
byte-identical. Sensitive: catch-up determinism (the pin-now discipline); expiry never deadlocks.

### M11 — WORLD-AS-ACTOR SHOCKS (owner round 21, 2026-07-12; depends: M4; army coupling: M5)
Two fenced sub-waves. The world's non-political forces finally ACT: pestilence that travels, calamity
that strikes. Both: AGGREGATE-population only (product boundary — the sim NEVER kills a named NPC;
at-risk/displaced flags are DM hooks); receipts mandatory; every rate a frozen, documented, owner-
retunable constant; PRNG = seeded forks from stable composite keys, codepoint-sorted mutation.

**M11a — PESTILENCE (the traveling plague).** ONE PLAGUE TRUTH: no second plague system — the
epidemic ledger (nested under spatialLedgers, marker-gated, ZERO eager bytes post-FP-R) MATERIALIZES
the EXISTING plague stressor at each settlement it reaches (reconcile like M4's origin-loss rule);
aspatial worlds keep today's plague byte-identically — the marker gates only the TRAVEL. Propagation:
plague travels AS INFORMATION TRAVELS — hop-by-hop along ACTIVE trade channels + M2 shipment arrivals
(+ M5 army movements once they exist) at hopWeeks latency, seeded per-edge forks
(`plague:spread:${edgeId}:${tick}`); import pressure scales with inbound volume (ports run hotter).
Onset: seeded draw scaled by density/tier + trade volume MINUS the care counterforce. THE CARE
COUNTERFORCE reads the INSTITUTION ROSTER, never the magic toggle (a no-magic world simply lacks
druids/alchemists): churches + church-derivatives, hospitals/healing houses, druidic institutions,
alchemists each add care capacity with DIMINISHING stacking returns, CAPPED (the SECURITY_MAX_RELIEF
pattern — a temple city resists, is never immune); care suppresses EMERGENCE and raises RECOVERY
(shortens survival). Density-vs-care tension is the texture: cities burn hot-and-short, care-poor
villages smolder. ARMIES: plague level joins the mover hazard read as a GRADED SCALAR in route +
engagement scoring (M1 discipline, never a boolean) weighted by W0 risk tolerance — a lawful
commander waits out the pestilence; an army interacting with a plagued settlement rolls seeded
contraction (`plague:army:${armyId}:${settlementId}:${tick}`), a contracted army takes an
effective-strength impairment AND becomes a VECTOR to its next stop. RELIGIOUS INFLUENCE (both
directions): while active, religious authorities gain a TEMPORARY standing/influence modifier +
piety pulse (formalizing the existing plague→temple-relief seam), REVERTING on clearance; clears-
fast-under-care = the temple's triumph, rages-unchecked feeds the existing piety-crisis/abandonment
seam. The QUARANTINE DILEMMA emerges free: movers re-route around plagued hubs (the hazard term) →
isolation → M2 supply risk. CO-BUILT BRAKES: recovery floor (NO perma-plague — every record clears),
the counterforce cap, per-tick spread bounded (cascade-depth cap). Soak: 20y port-seeded two-region
run — the front walks the network at hopWeeks-consistent arrival ticks; care-rich clears faster than
care-poor; armies avoid + contract + carry; influence pulses and reverts; every record eventually
clears; dormant byte-identity. Sensitive: ONE plague truth (grep: no parallel system); the cap; the
army term is a scalar; the roster-read (no toggle read).

**M11b — CALAMITY (natural disaster).** A VERY RARE instantaneous shock with a LONG, fully EMERGENT
economic tail. Frequency: realm-expected once per 10-20 years → per-settlement-year hazard
`1/(HAZARD_YEARS × N)`, ONE seeded annual draw (`disaster:${settlementId}:${year}`); cooldown WITHOUT
new state — the minted permanent history stamp IS the cooldown record (no re-strike within
COOLDOWN_YEARS of a prior stamp). Terrain-keyed type table (flood/riverside, fire/dense-timber,
quake/mountain, storm/coastal — the riverside town's flood-year is legible destiny). THE STRIKE
(bounded): seeded selection of K non-required institutions (K tier-capped 1..4, candidates codepoint-
sorted); SUBSUMPTION FIRST — an UPGRADE_CHAINS member DEMOTES down its chain, a multi-instance
category COLLAPSES to one survivor ("the lodging district is one lodge now"), singletons are
DESTROYED (hand-of-god); `required` institutions NEVER selected (the hard bound). Aggregate
population death: a seeded, BOUNDED, tier-scaled fraction (significant but survivable — the exodus
is the real depopulator, and it is recoverable drama). THE TAIL IS EMERGENT, ZERO NEW MECHANISM:
destroyed producers sever M2 supply links (downstream starvation risk); broken activeChains
re-reconcile the economy; lost livelihoods enter M4 AS DEPARTURES with the disaster receipt (the
mass exodus — and M4's conservation ledger MUST still balance through it, asserted); population loss
demotes the tier EMERGENTLY via popToTier (never forced); the legitimacy hit + a W-C5 'disaster
response' cause puts the ruler under coup-readable pressure. Mint the NAMED permanent stamp ("The
Great Fire of Thornwood, year 12"). GATE: a CL rules flag, preset-gated (ON in dramatic/full-sim
presets, default OFF → byte-identical); the spatial tails ride the marker; aspatial fallback = the
existing population-flight term. Soak: 50y realm run — frequency lands in the 10-20y band; NO
annihilation (bounds + the M4/M2 brakes hold — no chain-collapse); the tail composes end-to-end
(strike → starvation-risk → exodus → legitimacy → pressure) with every step receipted; cooldown-via-
stamp works; byte-identical with the flag off. Sensitive: required-never-selected; the death-fraction
bound; M4 conservation through the exodus; the frequency + cooldown constants.

## 7.2 The round-21+ backlog (frozen out of v1; triage at Phase 6 ⚠️ OWNER)
W2-style voice sidecars for war/faith/trade news (the pillar-inventory prescription — cheap, high
value, candidates for EARLY post-launch or even Phase-6 punch-list graduation); numeric prices;
miracles/divine-agency + lived-practice faith content (rituals, holy days, named clergy); peace
treaties/negotiated terms; ruins-as-artifacts (destroyed settlements become preserved dossiers +
adventure sites); map-as-legibility-surface (fronts/embattlement/trade-flow rendered on the realm
map); warding-vs-scrying info-defense; feed retention (non-recency major-arc pinning, the 240-cap
scale fix); the two temporal structural notes (mergeStressorUpsert bornTick; dead wallClockNow
pre-stamps); dramatic_campaign preset depth review; population-attractor retune (from the W0 soak).

# PART 5 — THE LIVING REALM CHECKPOINT (definition of done — runs AFTER the PART-7 mover ladder)
# (owner order 2026-07-12: the checkpoint is the FINAL validation of the COMPLETE, mover-finished
# engine, immediately before Phase 6 launch-readiness. Execution/reading flow: Wave A → merges
# (PART 6) → M1-M10 movers (PART 7) → THIS checkpoint (PART 5) → Phase 6 (PART 8) → launch. Numbers
# read 6,7,5,8,9 by owner directive; the SEQUENCE is what governs, per §0.4.)

The shippable milestone. It is REACHED when all of the following are committed and green:
1. The FULL ladder committed + green: Wave A, ALL merges (§6.1 — W5/Session-Foundry), and the ENTIRE
   mover ladder M1-M11 (PART 7, each with its own soak; M11 added by owner round 21, 2026-07-12 —
   the checkpoint validates THROUGH M11).
2. The LIVING REALM PRESET delivers, on a premium canonized realm: mapped geography (digest),
   seasons (food year), distance-weighted trade/faith, perfect-but-delayed news (or unreliable if
   the DM dials it), routine autonomy with major-approval, belief-sourced war posture with legible
   misjudgments, ruleset receipts, + the mover layers (embattlement, caravans, migration, field
   combat, entrepôts, smuggle, sea lanes, the political depth). Free/anon/legacy: byte-identical.
3. THE CHECKPOINT SOAK: whole-world-soak on the living_realm preset + a canonized spatial fixture —
   30 years, byte-identical re-run, bounded populations (⚠️ OWNER: the population-attractor tuning
   finding gates M4 long before this), stressors non-frozen (the stasis fix evidenced), all ledgers
   (rumor/belief/shipment/arrival/embattlement) bounded. This is the everything-on validation.
4. A FULL manager validation pass (the §0.3 checklist over the combined tree + an adversarial
   premium/faith-seam sweep — the wf_59bcd3b3 pattern).
5. 🔱 FABLE-ON-RETURN: the checkpoint grade-check (mini re-review of affected dimensions) — if
   Fable is unavailable, Phase 6 may START but not SHIP without it.

# PART 8 — PHASE 6: LAUNCH READINESS (runs AFTER the PART-5 checkpoint)

Sequenced program (each its own fenced wave, same protocol):
1. DATA LIFECYCLE — pre-launch: schema/migration audit (the head/net-current ledger, fusion specs
   per memory/wave0-migration-audit.md), storage quotas, export/delete completeness (GDPR-shaped),
   anon→free→premium upgrade paths carry all state. At-launch: seeding, onboarding fixtures,
   the landing fixture regen (memory: phase5-engine-companion-complete NEXT item). Post-launch:
   backup/restore discipline, migration-forward policy (the CL-0 ruleset + cost-law receipts are
   the versioning pattern), telemetry review (EVENTS.* audit — no PII, no deity leaks).
2. THE PUNCH LIST — sweep the parking lot (§0.6), the round-21+ backlog triage (§7.2 — what
   graduates into launch, owner call ⚠️), the deferred small items (aiPricing slice, EventComposer
   leftovers if W5 didn't land them, the dead-simulation-case cleanup).
3. THE EVERYTHING-ON SOAK — ONE soak, the full_simulation preset on a spatial fixture (covers
   spatial once, not twice): 30y determinism + the war-distribution certification (the W-C1..C5
   distributions against their design envelopes — war frequency, siege outcomes, exhaustion
   curves, occupation ladders; the soak asserts ENVELOPES, documents drift).
4. SECURITY/ABUSE PASS — the admin edge actions audit (rate limits, authz on every admin-actions
   verb), share/gallery scrub adversarial sweep, RLS review on new tables/keys.
5. LAUNCH GATE — all ratchets green at their POST-FP-1 values; the golden corpus regenerated ONCE
   with a reviewed UPDATE_GOLDEN protocol IF (and only if) any approved behavior change requires
   it (owner sign-off ⚠️); CI green end-to-end.

# PART 9 — STANDING ITEMS + THE FINAL GRADE-CHECK

- FP-1 (in flight): on landing, note the new budget in §0.2-5 and PROPAGATE it mentally to every
  queued wave's gate expectations. If FP-1 under-delivers (<10KB), SEASONS-A still fits (its cost
  ≈ tens of bytes of preset keys) but the Session/Foundry + W5 merges may not — in that case park
  the merges behind a second FP pass (write FP-2 from FP-1's ledger leftovers).
- THE ONE COMPREHENSIVE FABLE GRADE-CHECK 🔱 (the standing mandate, after ALL phases end): a full
  wf_65950203-pattern survey — every dimension re-graded against the A+ standard, the spatial
  engine's soak evidence reviewed, the constitutional seams adversarially re-swept, the launch
  gate co-signed. Until it runs, the A+ MAINTENANCE INVARIANT (memory/owner-fix-philosophy.md)
  governs every wave: born at A+, gate-green, own enforcement pins, no ratchet regressions.

— END. The next action, always: §0.4.
