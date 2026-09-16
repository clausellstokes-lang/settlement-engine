---
name: ""
metadata: 
  node_type: memory
  title: THE LADDER (ENGINE LIFT
  created: 2026-07-18
  updated: 2026-07-18
  status: in-progress
  branch: claude/the-ladder (base a4e73651 = w7-prep tip at brief time)
  authority: docs/DESIGN_THE_LADDER.md (198 lines on claude/w7-prep; §1-§11 + 5 refinements)
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
  modified: 2026-07-19T04:18:24.046Z
---

# THE LADDER — intra-faction rank dynamics (owner commission, ENGINE LIFT #3)

**2026-07-19 UPDATE — tip is now 14e8a2fa (8th commit): THE FACTION-KEY BUG FIXED.**
Confirmed on real generatePowerStructure data: pre-fix, all factions keyed
`fac.unknown` and the ladder produced ZERO ladders on real data (fixture-shape blind
spot — fixtures used .name, real records carry .faction only). Fix = factionName
accessor (`.faction||.name||.label`) in npcLadderState + the read-side mirror
factionKeyOf in townMap/ladderRead.js (coup path); real-shape pin
tests/domain/npcLadderFactionKey.test.js revert-proven. npcLadderEnabled is now
SAFE to light at the regen. Full suite deliberately deferred to fold.

⭐ THE RESUME POINTER for this lane. Code truth = branch `claude/the-ladder`. Manager folds
(do NOT merge; do NOT light the flag — it's DARK, joins THE ONE REGEN). Base a4e73651.

## Why this exists
The missing MIDDLE rung between the growth layer (person-change) and coups (regime-change):
every faction carries a persistent, contested rank ladder; NPCs rise ONLY by displacing the
rung above and fall when displaced. Converts the roster from a cast into a court. DARK behind
virtual `npcLadderEnabled` (absent from DEFAULT_SIMULATION_RULES).

## Design law (docs/DESIGN_THE_LADDER.md — READ IT; §1-§11)
- §1 CONSERVATION: promotion = DISPLACEMENT (swap rungs); failed challenger DROPS one rung.
  Ladder length 3-5 rungs from institutional tier/base. Seats = seat-held-glue; people-held
  ties travel with the person.
- §2 WINDOWS gate challenges: incumbent goal-failure band · faction power FALLING · revealed
  corruption (widest) · faith-coherence rupture · vacancy succession. Defender's advantage
  structural (seat weight = rung height + power rising).
- §3 DETERMINANTS: (1) faction power trajectory; (2) DYNAMIC GOALS = typed conditions over
  registered S7 signals (REUSE signalRegistry+StopCondition evaluator, never fork); (3)
  personality-institution clash via the growth layer's oppositionOf 2-vector.
- §4 COHERENCE: alignment methods · patron deity/pantheon · compromised leverage · traits+
  growth deposits · D5 marks · reframe (existing classes only) · STATE-NEVER-FATE · chronicle+
  provenance (same-advance edges only) · spatial (light).
- §8 STANDING LOOP: ladder→faction feedback. (a) leadership-quality power modifier; (b) churn
  instability tax; (c) legitimacy reads the HOW (window cheap; norm-break/leverage taxes
  faction + PUBLIC legitimacy via governance ledger when governing faction is the stage);
  (d) ENTRENCHMENT (long-winning defender → entrenched/rigid → raises own clash). SINGLE-
  WRITER: ladder writes ONLY its sidecar; power/legit READS consume the mirror modifiers when
  lit (absent ⇒ 1.0 ⇒ byte-identical dark).
- §9 WEIGHTED DEEDS: goals carry STAKES (state-distance × signal scope × adversity × domain
  relevance) priced at mint, settled at outcome. Greater-deed challenger beats smaller-deed
  defender EVEN WHEN BOTH SUCCEEDED (owner's rule). Flaws = risk appetite. Anti-farming:
  window averages by WEIGHT not count.
- §10 STIGMA MARK: exposed-for-corruption ⇒ challengeScore ×0.5 for a lifespan-scaled term
  (D5 band idiom, decaying, refresh-on-reexposure). Widest window AND halving tax. In the
  ladder sidecar; cited in receipts; deposits toward cynical.
- §11 LONG GAME: STANDING = INTEGRATOR STOCK (fabric prominence idiom — deposits/withdrawals/
  decay-to-baseline, interval-invariant; challenges draw the STOCK not a window). PACING =
  4 brakes: sustained-margin (LEAD_FLOOR/TURN_MARGIN), windows, per-faction YEARS-scale
  post-succession cooldown, E0 realm cap. Cadence = a succession/faction/few-years, a DIAL.
  GOAL HORIZONS (weeks→years); partial progress deposits; premise-died-by-outside-forces =
  LAPSED (no reward/penalty, receipted) vs own-domain-collapse = failure. THREE-BODY: every
  holder defends-below AND challenges-above on ONE stock; MOUNTING A CHALLENGE WEAKENS YOUR
  OWN DEFENSE; a displacement opens ONE chained vacancy succession, then cooldown seals.
  Adjacent rungs only.
- Manager refinements (vetoable): ATTRIBUTION RULE — achievement deposits weight by DOMAIN
  (faction's actual domain over the signal) + OFFICE (seat responsible); out-of-domain pays
  a fraction; receipt names the basis. Multi-claimant pin (3 NPCs, one recovered signal, no
  full-credit free-riding). ANTI-STASIS BOUND — pacing dial has floor AND ceiling; a lit
  long-run assert that successions/faction/century fall in a band. (Open-bottom-rung amendment
  is with owner — do NOT build unless it arrives.)

## The consumed-systems read-API map (hard-won recon — call these, do not fork)
- SIDECAR: getSpatialLedger/setSpatialLedger/dropSpatialLedger from domain/spatial/distanceRead.js.
- PULSE SEAM: pulseKernel line ~2319 name-swapped to advanceNpcGrowthWithFabricAndConsequenceAndLadder
  (npcLadderKernel.js). Ladder runs LAST. snapshot = postTimeSnapshot (a buildWorldSnapshot
  output: .byId/.causal/.worldState/.regionalGraph). Effective-line ceiling = eslint max-lines
  skipComments+skipBlankLines (comments are free; sizeBaseline test freezes pulseKernel count).
- GOALS = StopCondition (domain/autonomy/stopConditions.js: evaluateStopCondition(cond,frame)
  → {fired,evaluations,errors}; non-short-circuit receipt = the S7 idiom). Frame = {snapshot,
  pressures:pressureIndex(deriveSettlementPressures(snapshot)),tick}. Registered signals
  (signalRegistry.js seed): causal.<16vars>.{score,band}, pressure.<9>, settlement.prosperity.
  band, settlement.legitimacy.score, settlement.atWar, pair.relationship, world.tick/season.
  v1 use SETTLEMENT-scoped causal/pressure/prosperity/legitimacy (freshness-safe, memoized on
  settlement identity). registerSignal is additive-only; v1 mints NONE.
- GROWTH LAYER (npcGrowthKernel.js): oppositionOf(trait,npc) EXPORTED (2-vector clash on
  TRAIT_ALIGNMENT/TRAIT_AGGRESSION). acquiredTraitsOf(worldState,nid) reads minted traits from
  the ledger (source of truth). GROWTH_DEPOSIT_MAP = the 8 signals (calamity/bust/besieged/
  siege_survived/reconstruction/betrayal/boom/flourishing → cautious/tenacious/cynical/proud).
  §4d deposits ride THIS map additively; no new mintable traits without matrix check.
- FACTION/NPC (recon 1): npcId(saveId,npc,index) EXPORTED (npcAgency.js). worldState.npcStates
  [npcId] = {factionId,factionSeat,dotRank,roleArchetype,corruption,ousted,timesExposed,...} —
  reconciled BEFORE my mover. worldState.factionStates[fid] = {internalSeats:{leader_champion,
  lieutenant_operator,agent_protege each {npcId,name,dotRank}}, memberNpcIds:[]} — THE rung
  source; iterate factionStates by settlementId + match stablePart(name) (factionId builder is
  private). governingFactionOf(settlement) = dominant. NO power-trajectory read exists — STASH
  last-seen faction power in my sidecar and diff (deterministic). rulingPowerCoup.coupContenders
  = coercion-adjusted power ranking (read-only).
- COUP TRUNCATION: settlement.activeConditions archetype 'government_overthrown'/'coup_suppressed'
  with triggeredAt.tick===currentTick (settlement-scoped freshness). Or worldState.pulseHistory
  [last] selectedOutcomes candidateType coup_succeeded/coup_suppressed.
- DEITY/FAITH (recon 2): settlement.config.faithProfile = {patron,deities[],contested,
  patronSecurity} (projected, tick-start-safe). NO per-NPC deity field — link via
  npc.linkedFactionIds → religious faction → clergyTraitPlane.npcTraitPlane(npc) vs patron axis
  (targetedFootholds/rulerLens pattern). Faction head = highest-orgPower linked NPC (orgPower:
  minor0/notable0.4/key0.7/pillar1.0). Pantheon rising/falling: worldState.pantheon[deityIdOf
  (snapshot)]={wins,losses,seats,tier,tierHeld}; compose via qualifyingTier(seats,tier) vs tier
  + PANTHEON_TUNING.TIER_RANK (no ready verdict). Conduct: deityTemper(deity) warlike/peacelike/
  neutral, evil01/chaos01 (deityAxes.js). Import DEITY_RANK_AUTHORITY from domain/deityConstants.js
  DIRECTLY, never display/deityEffects.js. Safe engine leaves: religionState, religionLegitimacy,
  pantheon, deityAxes, deityStance, clergyTraitPlane, deityConstants.
- CORRUPTION (recon 3): npc.corrupt===true && !ousted = covert-compromised (leverage). LOCAL
  exposure has NO durable tick-stamped ledger (only foreign via exposedCorruption). Detect fresh
  exposure by STASHING last-seen timesExposed/ousted per npcId in my sidecar and diffing (also
  drives §10 stigma refresh). settlement.npcs mirrors corrupt/ousted/timesExposed. Conspiracies:
  settlementBlocs(worldState,cid).filter(b=>b.covert) (dormant-safe []).
- D5 (recon 3): memoryHorizonMultiplierOf(settlement) from relationshipEvolution.js (generational
  1, undying Infinity). Scale my grudge/stigma half-life by it × my constant (npcGrowth decayedStock
  idiom). Do NOT confuse with relationshipMemory.js (separate, not band-scaled).
- REFRAME (recon 3): 8 FROZEN act classes (REFRAME_VOCAB/REFRAME_ACT_CLASSES). Do NOT add a 9th.
  v1 does NOT wire a usurpation reframe (that needs a new FACT SOURCE in advanceReframe = reframe-
  kernel change) — DEFERRED SEAM (matrix check pending).
- PROVENANCE (recon 3): outcome/news carries causedBy:string|string[]; recorded at
  appendPulseHistoryWithProvenance for durableIds only (selectedOutcomes ∪ impactDigest). causedBy
  is an UNUSED forward seam. Same-advance scoping: child minted this tick, parent id exists this
  tick. v1: set causedBy on co-minted ladder beats (displacement→chained succession); note if news
  ids aren't in durableIds it's a recorded seam.
- E0 (recon 3): NO shared helper — hand-roll cap/hysteresis/cooldown in my kernel (foldReframes +
  corruptionWeb INITIATE_BASE idiom). "E0-classed" is NOT a news field. DRAMA_CLASS_REGISTRY entry
  optional (not gated) — SKIP (touches shared decisionTier.js).
- CHRONICLE impactKind 'npc_ladder': REQUIRED registration (tests/domain/impactKindWalkers.test.js)
  — add npc_ladder to src/domain/display/settlementRumors.js WHAT_PHRASES + npc_ladder:null (unvoiced)
  to the test's EXPECTED_VOICE. Add in the beat-emitting commit. News-entry shape = fabricNews/
  spatialBeat contract (id/tick/impactKind/channelType/settlementIds/sourceEventId/tags/reasons).

## Fence (my files) / do-not-touch
NEW: src/domain/worldPulse/npcLadderKernel.js (+ sibling leaves if >800 effective lines),
src/domain/townMap/ladderRead.js, tests. pulseKernel name-swap (net-zero). Read-side §8
consumption is in scope but flag-gated + dark-byte-identical. Registration: settlementRumors.js
WHAT_PHRASES + impactKindWalkers test manifest. Do NOT touch: page/copy, map renderers, SM-5/
interior gates, content prose, other panels, edge functions, migrations (need NONE).

## Progress — CORE COMPLETE (7 commits on claude/the-ladder, NOT merged; manager folds)
- ✅ commit 1 @ 00fdf275 — dormant skeleton + dormancy golden (WIRED-BUT-DORMANT byte-identical).
- ✅ commit 2 @ f62b3d7a — storage + first-lit derivation (from settlement roster structural
  indicators importance/dots/structuralRank) + the standing integrator (seed-by-height, decay-to-
  baseline, interval-invariant).
- ✅ commit 3 @ b7f27369 — dynamic goals (S7 StopCondition over causal signals, REUSED) + §9
  weighted deeds + THE ATTRIBUTION RULE (office×domain) + §11.3 progress deposits/lapsed.
- ✅ commit 4 @ 795f542a — THE CHALLENGE ENGINE: windows · challengeScore/defenseScore (§3/§4
  inputs, receipts) · seeded (hash01) resolution · §11.4 three-body (single top-down pass) ·
  §1 conservation (swap/drop) · §11.2 four brakes · §10 stigma tax · §4e D5 grudges · npc_ladder
  beat (registered in settlementRumors WHAT_PHRASES + impactKindWalkers EXPECTED_VOICE=null).
- ✅ commit 5 @ e58bd942 — §8 standing loop (leadership-quality power modifier · churn instability ·
  legitimacy-of-the-how) written to the mirror (single-writer) + §7 COUP TRUNCATION.
- ✅ commit 6 @ 0a4a66c3 — §8 READ-SIDE: ladderEffectivePowerFactor consumed in coupContenders
  (dark-safe by mirror-presence + factor===1 guard; dark byte-identical proven vs coup soak).
- ✅ commit 7 @ db6b505e — §4b PATRON DEITY: the faith-coherence rupture window (npcTraitPlane vs
  patron deity axes; religious head against his god = permanent window).
- FILES: src/domain/worldPulse/npcLadder{Kernel,State,Goals,Challenge,Coherence}.js (all lazy
  leaves < 800 effective) · src/domain/townMap/ladderRead.js · pulseKernel name-swap ·
  rulingPowerCoup + settlementRumors + impactKindWalkers touched. Tests: 5 ladder test files +
  the dormancy golden. GATE GREEN: 174 ladder+dormancy+coup tests · tsc 0 · domain:strict 0 ·
  lint 0 err (my files 0 warn) · build+verify:dist 150 · control-bytes 0 · eager ~0 (lazy leaf).
- DEFERRED SEAMS (documented, not dropped): §4b deity RISING/FALLING pantheon lift + war-god
  martial methods · §4a alignment-methods explicit modulation (service/leverage LARGELY covered
  by standing+leverage already) · §8d cross-layer growth-TRAIT entrenchment deposit (realized
  internally via standing decay; the growth-ledger deposit needs a growth-kernel signal input —
  single-writer preserved) · the chained vacancy succession (partially realized via three-body/
  failed-drop) · §4h provenance same-advance edges · §4f reframe usurpation act (8 FROZEN classes
  — do NOT add a 9th; matrix check) · the broader faction-competition effective-power read (no
  engine-wide chokepoint exists — a separate refactor). Display stock (NPC-card rung/goal, Power-
  tab) recorded, not built (owner ROUND 3).
- Verify method: main-tree vitest /Users/cstokes/Desktop/settlement-engine/node_modules/.bin/
  vitest run <files> (worktree has no local node_modules). Golden capture UPDATE_GOLDEN=1.
