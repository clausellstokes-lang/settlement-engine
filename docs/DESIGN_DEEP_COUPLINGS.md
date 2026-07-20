# DESIGN — DEEP COUPLINGS (the eight commissioned pieces: belief axes · per-NPC credibility · the intel lane · contested goals · third-party ransom · sea roads · the memory weave)
### FROZEN 2026-07-19 · owner ruling "build them all, highest caliber, pre-loop"
### (COHERENCE_MATRIX_R3.md "DEFERRED FEATURES → NOW COMMISSIONED" + the same-day
### CONTESTED-GOALS addendum). Code base of record: claude/the-composite @ aad6265e.
### Roads pieces recon'd on UNFOLDED claude/the-roads — tip moved 1e962d01 → 99084183
### (R-8 embassy landed) DURING this design: every roads line-anchor below is cited
### against that survey and MUST be re-grepped at fold time (anchors drift, shapes
### don't). The-ladder branch residue: ONE unfolded fix (14e8a2fa, the faction-key
### read) — a D-4 gate. Recon receipts: six-lens fan-out (beliefs/rumor/migration/
### traditions · credibility/ladder/stigma · generosity/corruption · roads branch ·
### constitution idioms · ladder goals inline) — every anchor re-verified against the
### tips named; the workflow journal cited by the matrix is GONE (path 404) — this
### doc carries the rationale inline so nothing depends on it.
### ⛔ DESIGN CLOSED 2026-07-19 (owner scope freeze): sealed after absorbing, in
### order — the contested-goals class · tunnel vision · the relationship-memory
### cohesion · the positive-bond symmetry ruling (D-7c commissioned+symmetric,
### D-7e, D-4f, the D-5 friendship channel) · the elite-bleed clause (D-7f).
### Further ideas are vNext by the freeze (§15's closing note) — never absorbed
### silently into this doc.

## §0 THE COMMISSION (the eight pieces → the slice map)
These are the MISSING_NO_FOUNDATION pairs (each needs a new subsystem/attribute on at
least one side) plus the owner's same-day additions (the contested-goals class
and the relationship-memory cohesion). Slice map:
| # | piece | slice | fold gate |
|---|---|---|---|
| 1 | beliefs×migration — DEMOGRAPHIC belief axis | D-1 (feeder A) + prerequisite D-0 | pre-fold |
| 2 | beliefs×traditions — CULTURAL belief axis | D-1 (feeder B) | pre-fold |
| 3 | informationStatecraft×ladder — PER-NPC CREDIBILITY + lie-stigma | D-2 | pre-fold |
| 4 | generosity×roads — THIRD-PARTY RANSOM (+ two owner refinements) | D-5 | POST-ROADS-FOLD |
| 5 | generosity×intel — the SELL/GIFT lane | D-3 | pre-fold |
| 6 | naval×roads — MARITIME journeys | D-6 | POST-ROADS-FOLD |
| 7 | CONTESTED GOALS (addendum) — head-to-head NPC goal contests | D-4 (cluster a-e) | pre-fold (after the-ladder residue folds) |
| 8 | RELATIONSHIP-MEMORY COHESION (addendum, completed by the positive-bond + elite-bleed rulings) — the organic plane reused, ghosts wired, SYMMETRIC bond memory (grudge AND bond, person and faction), linked/supportive goals, bonds flowing into contests/ransom/generosity, and the cross-settlement ELITE BLEED (personal elite relations become interstate relations, influence-weighted, double-counting-guarded) | D-7 (a-f) + D-4f + the D-5 matrix wiring | pre-fold machinery (D-7c commissioned 2026-07-19, shape owner-visible; D-7f's formation vectors live post-fold) |
Pieces 1+2 are ONE belief-axis machinery with two feeders (designed together, D-1).
Piece 7 is designed IN FULL here (not interface-stubbed): recon showed the resolution
spine already exists (the challenge engine's pair-keyed deterministic contest), so the
new surface is genesis + awareness + resolution consequences — tractable at full
caliber. Its deeper extensions are recorded deferred seams (§15), not silent cuts.

## §0.5 BOUNDARY AMENDMENTS (amend in place; the deeper law is PRESERVED — the roads §0.5 pattern)
Two standing boundary declarations are grazed by this wave and MUST be amended in
place (scope notes only), not silently crossed:
- `DESIGN_INFORMATION_STATECRAFT.md` §6 + the matching module-header posture
  (informationStatecraft.js): "a named NPC may be CITED as a channel in prose (via §G
  ties) but is never burned, turned, or executed by the engine." AMEND the scope note
  to: "…never burned, turned, or executed by the engine. (PER-NPC CREDIBILITY is the
  deep-couplings layer's sanctioned province — DESIGN_DEEP_COUPLINGS D-2, owner
  ruling 2026-07-19: a personal credibility stock and a lie-stigma standing hit are
  REPUTATION costs, not fate resolutions; no exposure removes, kills, or disappears
  the NPC — fates remain unresolvable everywhere.)"
- The ladder's stigma vocabulary (npcLadderKernel.js header, the §8 single-writer
  law): the contested-goals LOSER takes a standing sting + a grudge + a vulnerability
  window — through the ladder's OWN writer, never a fate. The header's write-list
  gains the contests sub-key (D-4); the no-death posture is restated there verbatim.
The deeper carve stands everywhere: nothing in this wave removes, kills, or
permanently disappears a named character. Refusal, debt, compromise, stigma, and
defeat are all CONTINUATIONS of a life, never resolutions of one.

## §1 FROZEN LAWS (violating any of these is a design defect)
1. DARK VIRTUAL FLAGS, one per system, each ABSENT from DEFAULT_SIMULATION_RULES
   (simulationRules.js:36) — the idiom read is
   `!!(rules && typeof rules === 'object' && rules.<flag> === true)`
   (npcLadderKernel.js:135 / traditionsKernel.js:162 / upswingKernel.js:93 precedent).
   THE EIGHT FLAGS: `migrationRumorsEnabled` (D-0) · `beliefAxesEnabled` (D-1) ·
   `npcCredibilityEnabled` (D-2) · `intelTradeEnabled` (D-3) ·
   `contestedGoalsEnabled` (D-4) · `thirdPartyRansomEnabled` (D-5) ·
   `seaRoadsEnabled` (D-6) · `memoryWeaveEnabled` (ALL of D-7: the ghost wirings
   AND-ed with each host's own flag, the symmetric person/faction bonds, the
   generosity bond loop; D-4f linked goals gate on contestedGoalsEnabled ∧
   memoryWeaveEnabled; D-5's friendship channel and bond-biased outcome read
   bonds only when memoryWeaveEnabled — dark ⇒ the §9.1 matrix degrades to its
   bond-free rows, stated there). Interplay gates (each null-safe): D-1 requires
   beliefsActive; D-2 requires infoStatecraftEnabled ∧ beliefsActive ∧ (ladder hook
   only when npcLadderEnabled); D-3 requires infoStatecraftEnabled ∧ (gift lane:
   constructiveFlowsEnabled); D-4 requires npcLadderEnabled; D-5 requires
   roadsEnabled (∧ constructiveFlowsEnabled for the debt outcome ∧ corruptionWebActive
   for the compromised outcome — dark web ⇒ debt, the roads §10 gating-coherence
   precedent); D-6 requires roadsEnabled ∧ navalEnabled ∧ a lit seaLanes digest slot.
   Absent ⇒ immediate no-op: zero derivation, zero ledger key, zero news.
   ⚠ Adding any flag to DEFAULT_SIMULATION_RULES serializes it and moves goldens
   (the traditions §12 warning) — lit ONLY at THE ONE REGEN (owner-queued, §14 Q1).
2. DORMANCY GOLDENS, byte-identical, per flag — the citable idiom
   (tests/property/traditionsDormancyGolden.test.js:117-176): (a) an N-tick real
   advance with the flag absent, projected to a MECHANICAL summary,
   sha256(JSON.stringify(normalizeForDormancy(projection))) vs a committed fixture
   manifest; (b) the dormancy CONTRACT (no ledger key, no mirror field, no news
   kind); (c) the LIT-PATH ANTI-VACUITY describe block in the SAME file (:178-223 —
   ledger populates, mirror mirrors exactly, two lit runs hash-equal). Note the
   term "lit walkthrough" (roads §19) names the longer executed lit-run proof; the
   in-test idiom is the anti-vacuity block — this charter (§13) uses both.
3. BELIEFS-NEVER-TRUTH (statecraft §3, binding on D-0/D-1/D-2/D-3): every new
   mechanism manipulates BELIEFS, never ground truth. The new axes are believed
   states; the intel lane transfers beliefs with lineage; nothing here writes a
   causal signal, a population count, or a tradition record's truth (D-1's one
   traditions-side edit is a NEWS BEAT, which is licensed output, not truth).
4. THE ANTI-HUM LAW (statecraft §8, binding on D-3 and D-4's bluff): information
   acts land at story tempo — event-triggered + loaded-dice rare + per-pair
   cooldowns + hard caps; NO autonomous per-tick scanner/spammer exists in any
   slice. The SELL primitives get callers, not a market bot (the in-code parking
   note at informationStatecraft.js:1178-1183 is honored, not overridden: it
   explicitly reserves the primitives "to future wiring / the DM-verb path,
   mirroring how E1a registered `warning` LIVE without an autonomous spammer" —
   D-3 is that future wiring, still spammerless).
5. SINGLE-WRITER + WRITE-BOUNDED, per system, with an explicit file-header
   write-list ending in NOTHING ELSE (traditionsKernel.js:20-28 /
   npcLadderKernel.js:44-47 shape) — the review greps each lane's diff against its
   §11 write-list. THE DEPOSIT-AND-CONSUME LAW (this wave's load-bearing
   architecture, generalizing roads §10): when system A's outcome must move system
   B's state, A writes a RECORD into A's OWN ledger and B's own pass CONSUMES it
   through B's own gates on a later tick — A never touches B's keys. Every
   cross-system effect in this doc names its deposit record and its consumer.
6. RNG DISCIPLINE: every draw forks the pulse confluence via rng.fork(label)
   (prng.js:65); labels are LOAD-BEARING (the pulseKernel.js:898-906 INVARIANT —
   a rename shifts every campaign and trips the golden masters); tick-invariant
   world-seed forks for cadence draws (collapsed catch-up must not shift who acts —
   the roads law-9 / seasonalSeverityFor pattern). Labels are enumerated per slice.
7. KERNEL-STATE + CATCH-UP: ALL new state rides the kernel's returned worldState /
   settlementUpdates ⇒ survives BOTH commit paths (campaignAdvanceSession.js:312
   advance re-stamp AND :511 resume re-stamp) for free; no store-side cursors, no
   Date, no Math.random, tolerant of collapsed multi-week catch-up. No new commit
   path is created, so lastLivingAdvanceAt needs no new stamp — asserted, not
   assumed, in each lane report.
8. HOT-FILE CEILINGS (measured 2026-07-19, eslint max-lines 800 EFFECTIVE lines —
   skipBlankLines+skipComments, eslint.config.js:513-518; frozen baselines in
   scripts/.size-baseline.json): pulseKernel.js FROZEN at 1387 · npcAgency.js
   FROZEN at 833 — name-swap + injection seams only, zero new logic. Headroom:
   beliefMap.js 661/800 (139) · informationStatecraft.js 605/800 (195) ·
   generosityKernel.js 800/800 — ⚠ ZERO HEADROOM: every generosity-side addition
   lands in a sibling leaf or rides the existing instrument-catalog data path;
   any generosityKernel edit must be NET-ZERO effective lines · navalKernel.js
   343 · corruption.js 277. New engine logic = NEW LAZY LEAVES (the
   reframeKernel.js:52-55 / traditionsKernel.js:44-45 lazy-leaf discipline).
9. THE NO-DEATH LAW (absolute): refusal, debt, compromise, stigma, contest defeat,
   storm delay, and sea capture never resolve a named character's fate. The D-5
   and D-6 fixture suites carry the roads roster-conservation assert; D-4 carries
   the ladder's conservation-as-permutation assert. §0.5 amendments apply.
10. ZERO EAGER BYTES (CLOSURE_BUDGET_BYTES = 1,040,000, vendorPdfLazy.test.js:412,
    monotone-down; the de-eager lane holds ≈17KB headroom): all new domain leaves
    lazy; the ONLY declared eager bytes in this wave are D-4e's edit-kind string +
    operationRegistry entry (≤ ~300 B, quoted at the slice gate). The sim never
    reads entitlements (TIER-BLIND doc convention — worldPlan.js:15 /
    spatialCost.js:27; NOTE: no automated ratchet exists for this today, §14 Q8).
    New src/domain files import no store/React (layerBoundaries.test.js:60-76).
11. EDIT KINDS: D-4e's `champion-npc` (the wave's only new kind) joins EDIT_KINDS +
    COMMITTABLE_EDIT_KINDS in lockstep with its live dispatcher arm
    (pendingEdits.js:69-72 + the no-silent-drop pins), registers in
    operationRegistry + `npm run gen:compendium-data` regen (+ EXEMPT_CEILING only
    shrinks) + the analytics edge-shared rebuild (`npm run build:edge-shared`).
12. PERSISTENCE IS ADDITIVE: every new ledger is a `spatialLedgers.<name>` key or a
    nested sub-key, absent-⇒-empty-default, undefined-tolerant reads, NO
    WORLD_STATE_MIGRATIONS entry (worldState.js:167-171 states the precedent;
    the chain is for breaking shapes only). Additive optional FIELDS on existing
    records (BeliefRecord, RansomRec, MissionRec, DisinfoRecord) follow the same
    rule. Each slice ships the full lifecycle trace (create/read/persist/regen/
    undo/clone/migrate) in its section; the common spine: create = mover-only in
    kernel results; persist/clone = the spatialLedgers ride (object-keyed at every
    level, drop-when-empty); regenerate = none (tick-time state; generator goldens
    untouched by construction); undo = undoLastPulse restores worldState+saves from
    one snapshot ⇒ atomic revert; import/migrate = worldState carried wholesale.
13. WEEKS ARE CANONICAL (4-4-5, 52-week year); prosperity via band-step applicator
    idiom only; legitimacy via applyLegitimacyHits idiom only (momentum.js:1094,
    legacy bare-number guarded); RELATIONSHIP STATE moves ONLY through
    applyRelationshipPatch (relationshipEvolution.js:283 — the plane's ONE
    writer; a typed-incident patch call from another kernel is the SANCTIONED
    applicator idiom, exactly like applyLegitimacyHits; hand-editing
    relationshipStates or recentIncidents anywhere else is a defect); faction
    key = `.faction` never `.name`; faction.power is DERIVATION OUTPUT — never
    written; news via the movers' newsEntries[] fold; prose pools = new src/data
    leaves via the eventProse registry (canonical-at-zero, no calamity
    substrings, the F24 byte-count check).
14. READ-LAST/WRITE-NEXT HONESTY: cross-mover deposits are consumed on the NEXT
    tick (the tick-order lag is a feature — news travels behind the column, a
    warning takes a week, a freed captive walks home before the web reaches him).
    Every deposit-and-consume pair in this doc states its lag explicitly; no slice
    may reorder the pulse chain to fake same-tick coupling.

## §2 THE LANDSCAPE (what exists — recon receipts, all verified against aad6265e unless marked)
- BELIEFS: BeliefRecord = {readiness, strengthBand, allianceLabel, faithLabel,
  confidence01, lastUpdateTick} (beliefMap.js:226-234, verified verbatim) — two
  numeric axes, two categorical, NO demographic or cultural slot. belief() selector
  (:250 region) resolves truth/unknown/belief. The single writer is
  advanceBeliefMaps (beliefMap.js:1073-1203, called pulseKernel.js:1837);
  reconciliation threads aggregateReports→reconcileBelief→reconcileSlot, and the
  W-DOCTRINE-2 `credibilityOf` injection (+ optional BeliefReport.sourceId) is the
  PROVEN pattern for threading a new per-source weight through that chain without
  touching the writer's ownership. A faith-carrier seam is PRE-RESERVED at
  beliefMap.js:91-92 ("no faith carrier is lit yet") — the cultural axis is the
  commissioning of that reserved shape's sibling.
- RUMORS: ArrivalRecord lineage+fidelity ledgers (rumorNetwork.js:5-9);
  army and smuggle columns ALREADY relay rumors along their paths — the carrier
  idiom (RUMOR_CARRIER_* + pathNeighbourMap + the relayVia fold) at
  rumorNetwork.js:708-709, carrier params assembled at pulseKernel.js:1774-1791.
  advanceRumorLedgers runs at pulseKernel.js:1792; MIGRATION DISPATCHES AT :2068 —
  AFTER the rumor pass ⇒ a column seeds rumors on the NEXT tick (law 14's lag,
  already honest). RUMOR_NOTABLE_SCORE_FLOOR = 60; traditionBeat scores today are
  42/58 ⇒ NO tradition beat ever enters the rumor net (the cultural-axis famine).
- MIGRATION: ledger records {originId, destId, arrivalTick} with reason vocabulary;
  populationHistory per settlement (capped ring) with reason strings; the ONLY
  migration→information path today is origin-side population_emigration news —
  destinations and the road between hear NOTHING (the matrix's "migration is the
  only silent mover", GATED-IN candidate #1).
- TRADITIONS: TraditionRec minted at genesis (traditions/genesis.js:92-109);
  re-dedication on deity change writes mutationLog ONLY — NO news beat
  (traditions/politics.js:360-368) — a rival's fog cannot even in principle learn
  of a rededication today; imposition/suppression/restoration (§8 of its design)
  and adoption (§9) likewise mutate quietly below the rumor floor. Single writer:
  the traditions mover (traditionsKernel, write-list :20-28).
- CREDIBILITY (settlement-scoped, W-DOCTRINE-2): spatialLedgers.credibility[sid] =
  {score centered 1.0, lastUpdateTick, holder:'people_held'}; CREDIBILITY_TUNING
  (informationStatecraft.js:104-133): slow-rise/sharp-fall asymmetry + generational
  half-life toward neutral. The LIE lifecycle processLies (:496-624) with
  DisinfoRecord (:469-477); exposure fires the deception delta + grievance + news.
  THE PARKED SELL LANE, verbatim (informationStatecraft.js:1178-1183): "A fully
  autonomous per-tick seller mover is deliberately NOT wired — the design §8 soak
  warns against a 'constant whisper-war hum'; the SELL primitives are available to
  future wiring / the DM-verb path, mirroring how E1a registered `warning` LIVE
  without an autonomous spammer." THE ORPHANED FORMULAS (exported, zero live
  callers): intelSalePrice (generosityEV.js:892), intelSaleCredibilityDeltas
  (informationStatecraft.js:994), warningSacrifice (generosityEV.js:867).
- THE LADDER: LadderStanding = {stock, since, week, goal, stigma, grudges,
  lastExposed, wasOusted} at spatialLedgers.npcLadder[sid].npcs[npcId]; npcId =
  npcId(saveId, npc, index) (npcAgency.js:191-193); the STIGMA shape {sev, week,
  tick} + STIGMA_CHALLENGE_TAX (halves a challenge score) + openWindows reason
  'revealed_corruption'; maintainMarks (npcLadderState.js:186-223) is the
  fresh-exposure DIFF chokepoint the lie-stigma mirrors. Challenges resolve as
  DETERMINISTIC seeded pair contests: challengeScore vs defenseScore (enumerated
  non-short-circuiting inputs), windows-gated, sustained-margin, challengeDraw(
  seed, tick, fkey, cNid, dNid) (npcLadderChallenge.js:107-166,212-289),
  conservation = the post-contest rung list is a PERMUTATION. Single-writer law at
  npcLadderKernel.js:44-47. GOALS (npcLadderGoals.js, read in full): a goal is a
  DERIVED StopCondition over causal SYSTEM_VARIABLES scores — {condition, stakes,
  horizonWeeks, mintedWeek, mintedRung, startScore, progress, basis} (:163-172);
  minted by lens (faction domain FACTION_DOMAIN :56-70 + risk appetite from
  traits, HIGH_RISK/LOW_RISK/SUPPRESSIVE :80-82); progress deposits pay through
  attributionWeight = OFFICE × DOMAIN (:223-229) at the ONE standing-write
  chokepoint applyGoalLifecycle (npcLadderKernel.js:155-177, called :346-348
  inside the per-faction rungs.forEach at :328-349); evaluateGoal (:208-215) is
  pure and rng-free — goal resolution is a DETERMINISTIC signal read, NOT a
  contest; the challenge engine is the only seeded head-to-head resolver and the
  challenge kernel applies its writes PLAN-THEN-APPLY (collected mints/withdraws
  applied in one block after resolution, npcLadderKernel.js:374-381). NOTHING
  detects two NPCs holding colliding goals — goals resolve solo today.
  The-ladder branch residue beyond the composite: ONE fix (14e8a2fa —
  ladderFactionKey/npcInFaction read the canonical `.faction` field) + its test.
  ⚠ CONFIRMED LIVE BUG in the composite (recon, grep-verified): without that fix,
  every real powerStructure faction (name lives in `.faction`, not `.name`/`.id`)
  slugifies to `fac.unknown` — the kernel's first-wins loop merges ALL of a
  settlement's factions into one ladder and membership matching goes empty. The
  fix must fold REGARDLESS of this wave; D-4 additionally gates on it.
- GENEROSITY: ObligationRecord = {from(debtor), to(creditor), kind, magnitude 0..1,
  mintTick, lastTick, predatory?} keyed one-active-per(debtor,creditor,kind)
  (generosityReactions.js:158-170, verified verbatim); the ONE mint chokepoint is
  the mover's mints array → foldObligations (generosityKernel.js:747-761, write
  :994-1002); advanceGenerosity runs at pulseKernel.js:2210 behind
  constructiveFlowsActive. The instrument catalog holds `warning` LIVE (the E1a
  precedent) + intel_sale REGISTERED-DEFERRED. ⚠ generosityKernel.js is at exactly
  800/800 effective lines (law 8).
- CORRUPTION / THE FOREIGN PATRON: CORRUPTIBLE_FLAWS = keys of FLAW_VECTOR
  (corruption.js:32-52, verified: greedy/corrupt/self-serving/ruthless/callous/
  cold-blooded/ambitious/calculating/opportunistic/vain/cowardly/suspicious/
  paranoid/deceitful/manipulative/mendacious/cynical — 17); the foreignFields
  patron-endpoint shape {foreign:true, patronId, patronKind, patronFactionName,
  importance} (npcAgency.js:815-817, verified); the web mints through its OWN
  creation gates (scarcity-as-law, one live asset per patron-target pair); covert
  ⇒ no news (the seedBetrayalTraitor template). Trait vocabulary confirmed real in
  the NPC data: proud/loyal/pragmatic/ambitious/zealous/principled/pious etc.
- THE ROADS (UNFOLDED claude/the-roads, surveyed at 99084183 — re-grep at fold):
  MissionRec/RansomRec per DESIGN_THE_ROADS §3 (RansomRec state.js:80-92, minted
  roadsKernel.js:574-583; NO payer field); ransom is priced in TIME not currency
  (termWeeksFor, state.js:312) — "payment" = the home faction waiting out the
  term; term-end release PASS 4 (roadsKernel.js:673-707) with the ONE home-debit
  write `bumpLegit(homeId, RANSOM_PAID_HOME_LEGIT)` at :692 and the release
  branch at :670-671; the conversion trait read conversionFlawFactor(npc,
  CORRUPTIBLE_FLAWS) at state.js:317-333 (the SAME read D-5 reuses); the
  party-op precedent for a non-home actor initiating release = the
  `whereabouts.partyRelease` marker (roads/ops.js) consumed by the mover;
  currentHopOf at roadsKernel.js:153-168 is MODALITY-BLIND; hazards = PASS 3
  (:483-645), classes T1-T4 per roads §7.
- THE SEA (composite, all live): digest.reserved.seaLanes (ports + water edges,
  BYTE-FROZEN slot — seaLanes.js scope pin); sea distance ALREADY folds into
  hopWeeks/chooseRoute at read time when the slot is lit (no new distance
  primitive needed — the naval recon's headline); storms are PRICED not rolled
  (stormSeasonCost: spring 1.3 / summer 1.0 / autumn 1.5 / winter 2.5 — "a storm
  never severs, only prices up"); PIRACY = BANDITRY BY CONSTRUCTION (scoreRoute /
  banditryLoss are node-keyed and modality-blind over port nodes; the only
  piracy-specific code anywhere is the display relabel banditryModalityLabel(
  {overSea}) — DESIGN_NAVY §5's certified parity); blockades live in
  spatialLedgers.navalTransit with the read accessors activeBlockadeTargets(
  worldState) and blockadeStrangulationOf (navalLayer.js/navalKernel.js), behind
  `navalEnabled`; a blockade IS a siege (the navy design's law).
- RELATIONSHIP MEMORY (the organic plane — verified 2026-07-19; REUSE, never
  rebuild): worldState.relationshipStates per graph-edge holds the RUNG over
  CONTINUOUS scalars (trust/resentment/fear/…) plus persisted decaying incident
  memory (recentIncidents, capped ×8) and history; the ONE writer is
  applyRelationshipPatch (relationshipEvolution.js:283 — everything routes
  through it, verified); three tuned decay mechanisms including the D5 lifespan
  bands. THE READ TEMPLATES this wave clones: warReasons.scoreGrievance
  (warReasons.js:425) and scoreRevanchism (:443 — the "decade clock" walking
  typed recentIncidents), consumed at :718-719 — scoring from resentment +
  memoryScore + typed incidents, NOT the coarse 10-value rung. THE GHOSTS
  (verified): spatialConsequenceKernel.js contains ZERO relationshipStates
  writes (a route seizure leaves no grievance); traditions/relations.js writes
  worldState.occupations and NEVER relationshipStates (an imposed rite leaves
  no mark on the pair). THE RECORDED DEFERRAL (relationshipMemory.js:13-22,
  verified verbatim): the incident-memory HALF-LIFE is not yet D5-band-scaled —
  an `undying` town's resentment persists but its derived memoryScore still
  decays on the 4-tick human half-life; relationshipMemoryWeight already
  accepts the scaled options, "the wiring point is ready." NPC PAIRWISE MEMORY
  IS NEGATIVE-ONLY (verified, npcLadderKernel.js:100-119): LadderStanding
  carries `grudges: Record<string, LadderGrudge>` keyed by the other npcId,
  LadderGrudge = {sev, week} — no positive twin exists anywhere. COALITION
  MECHANICS (the D-7c recon-first set, anchors verified): coalition betrayal
  ALREADY mints a typed settlement-plane incident — peaceTerms.js:1188-1206,
  "deserter — resentment bump, typed 'coalition_betrayal' (the /betray/
  revanchism …)", metadata {incidentType:'coalition_betrayal'} at :1206;
  governingCoalition(item) at beliefMap.js:747; war-coalition formation lives
  in the convergence layer (convergence.js — the implementer completes this
  census at build time per the owner's recon-first order).
- CONSTITUTION MACHINERY: dormancy-golden suite tests/property/*DormancyGolden
  .test.js (19 precedents); prng fork (prng.js:65); both commit-path stamps
  (campaignAdvanceSession.js:312/:511); COMMITTABLE_EDIT_KINDS (pendingEdits.js
  :69-72); closure gate (vendorPdfLazy.test.js:412); the store-import ratchet
  (tests/architecture/layerBoundaries.test.js:60-76); additive-ledger no-migration
  precedent (worldState.js:167-171).

## §3 THE DEPENDENCY GRAPH + BUILD ORDER (commission-mandated section)
```
PRE-FOLD (all build off claude/the-composite @ aad6265e, dark lanes):
  D-0 migration→rumor carrier        (no deps; ALSO the loop's cycle-1 build #1 — §3.1)
  D-1 belief axes                    (demographic feeder NEEDS D-0; cultural feeder needs only traditions)
  D-2 per-NPC credibility            (no deps on D-0/D-1; ladder hook needs npcLadderEnabled worlds only at test time)
  D-3 the intel lane                 (AFTER D-2 — the sale's self-policing wants per-NPC attribution live)
  D-4 contested goals                (AFTER D-2 — the bluff/credibility coupling; GATE: the-ladder residue
                                      14e8a2fa folds or is absorbed first)
  D-7 the memory weave               (a+b free-order pre-fold — D-7a before D-4b sharpens tunnel vision;
                                      D-7b's contest-loss incident needs D-4c; D-7c/e commissioned, pre-fold;
                                      D-7e before D-4f — support goals read bonds; D-7f MACHINERY pre-fold
                                      but its formation vectors are roads contacts ⇒ it idles vacuously
                                      until D-5/D-6 land, and its lit walkthrough runs on the post-fold lane)
POST-ROADS-FOLD (design final now; build the instant claude/the-roads folds; RE-SURVEY anchors first —
the branch moved during this design and will move again):
  D-5 third-party ransom             (roads + generosity + corruption-web substrates)
  D-6 the sea roads                  (roads + naval + seaLanes substrates)
ORDER: D-0 → D-1 → D-2 → D-3 → D-4 (D-1 and D-2 may run in parallel lanes; D-3/D-4 serialize after D-2).
D-5 and D-6 block ONLY on the roads fold, not on D-0..D-4, and not on each other; build D-5 first
(it closes an owner refinement) then D-6. NOTHING in this wave blocks the roads fold itself.
```
§3.1 THE D-0 SEQUENCING RULE (the matrix collision, resolved explicitly): the
coherence loop's cycle-1 queue ALSO holds migration×rumor as its #1 build. ONE
implementation must exist. Rule: whichever lane reaches it first builds it under the
flag name `migrationRumorsEnabled` and the recipe in §4; the other lane VERIFIES
(adopts the landed flag + runs the D-0 gates as checks). The ledger entry for
whichever lands first must say so, so the second lane re-derives done-state from git,
never from this doc alone.
§3.2 THE EXECUTION BOUNDARY: this design freezes under Fable; the slices execute
under the Opus successor (the model split doctrine). Every slice below is therefore
written to be executable with ZERO additional context: scope, file plan, lettered
commits, gates, done-whens, flag, fork labels, write-list, lifecycle trace. An
implementer who reads only §1, §2, their slice section, §13, and §16 has everything.

## §4 D-0 — THE MIGRATION RUMOR CARRIER (flag: `migrationRumorsEnabled`)
The prerequisite loop-build, specified here so D-1 never waits on an unwritten
recipe. Refugee columns join armies and smuggle runs as the third rumor carrier —
migration stops being the world's only silent mover.
- SCOPE: (a) in-flight migration columns RELAY existing rumors along their
  origin→destination path exactly as army columns do (the carrier idiom,
  rumorNetwork.js:708-709 — a new RUMOR_CARRIER_MIGRATION constant + the column's
  path fed into the pathNeighbourMap fold); (b) the column ITSELF becomes a rumor
  EVENT: eventKey `migration.${originId}.${destId}.${departTick}`, payload
  {kind:'migration_flight', originId, magnitudeBand (BANDED small/notable/exodus —
  never the exact count; rumor physics), reasonClass (the ledger's existing reason
  vocabulary, classed)} seeded into the ledgers of settlements along the route with
  standard lineage/fidelity/decay.
- FILE PLAN: carrier params assembled where the army/smuggle params already are
  (pulseKernel.js:1774-1791 — an injection-shaped extension; pulseKernel is FROZEN
  at 1387 effective ⇒ the assembly lives in a new lazy leaf
  `src/domain/spatial/migrationRumors.js` and the kernel call NAME-SWAPS an
  existing params-builder line, net-zero); rumorNetwork.js gains the carrier
  constant + one fold arm (it has headroom; verify at build).
- WRITES ⇒ ONLY: rumorLedgers entries via advanceRumorLedgers' OWN pass — the
  carrier params are INPUTS to the existing single writer; D-0 adds zero writers.
- LAG (law 14): migration dispatches at pulseKernel.js:2068, AFTER the rumor pass
  (:1792) ⇒ a column's first relay/event lands the NEXT tick. Deliberate: news
  travels behind the column. Pinned.
- RNG: relay/distortion rides the rumor net's EXISTING noise forks; the one new
  draw (event seeding jitter, if the existing seeding path requires one) forks
  `migration-rumor:${originId}:${tick}`.
- LIFECYCLE: no new persisted shape at all — rumor ledger entries are the existing
  ArrivalRecord shape; dormant ⇒ zero new events (byte-identical); undo/clone/
  migrate ride the existing rumor ledger paths untouched.
- COMMITS: D-0a carrier constant + params leaf + relay fold + unit tests ·
  D-0b the flight-event seeding + banded payload + dormancy golden
  (migrationRumorsDormancy — template law 2) + lit anti-vacuity (a war-flight
  column measurably seeds ledgers along its path).
- GATES: focused vitest + the dormancy golden + the existing rumor/belief golden
  set untouched. DONE-WHEN: dark full-advance hash byte-identical (executed); lit
  run shows a flight event arriving at an en-route settlement with degraded
  fidelity at distance; closure delta 0 quoted.

## §5 D-1 — THE BELIEF AXES (demographic + cultural; flag: `beliefAxesEnabled`)
ONE machinery extension, TWO feeders. BeliefRecord gains two OPTIONAL fields —
present only in worlds where the flag is lit (dormancy by absence, law 12):
```
BeliefRecord += {
  populationTrendBand?,   // DEMOGRAPHIC: believed −2..+2 (emptying…swelling), numeric-axis
  observanceLabel?,       // CULTURAL: believed dominant rite — `${motif}:${patronOrNull}`,
                          //   categorical-axis (the faithLabel twin)
}
```
- THE MACHINERY (D-1a): a new lazy sibling leaf `src/domain/worldPulse/
  beliefAxes.js` holding the fold/reconcile logic for both axes; beliefMap.js
  (139 effective-line headroom) gains ONLY injection-point threading — the PROVEN
  credibilityOf pattern through aggregateReports→reconcileBelief→reconcileSlot —
  plus the two @property lines on the typedef. The numeric axis reconciles like
  readiness (weighted fold, confidence-scaled, decay toward 0/unknown); the
  categorical axis adopts like faithLabel (the CAT_ADOPT_ACCURACY semantics).
  Ground-truth refresh (omniscient/proximate reads): populationTrendBand derives
  from the settlement's populationHistory ring (sign of the recent net delta,
  banded); observanceLabel derives from the traditions mirror (largest-scale
  tradition's motif + patron). advanceBeliefMaps remains the ONLY writer.
- FEEDER A — DEMOGRAPHIC (D-1b, requires D-0): rumor ingestion maps
  `migration_flight` events to populationTrendBand evidence: origin trends
  negative (scaled by magnitudeBand + fidelity), destination positive. TRANSITIVE
  by construction: migration → (D-0) rumor → (D-1) belief; an observer three hops
  away comes to believe — rightly or, with degraded fidelity and stale arrivals,
  WRONGLY — that "City X is emptying out."
- FEEDER B — CULTURAL (D-1c): traditions mutation beats become rumor-visible.
  TWO traditions-side edits, both inside its licensed write-list (newsEntries is
  already in the traditionsKernel.js:20-28 list): (i) the re-dedication write
  (traditions/politics.js:360-368) additionally mints a news beat (today it is
  mutationLog-only — silent); (ii) mutation-class beats (re-dedication /
  imposition / restoration / adoption) score ≥ RUMOR_NOTABLE_SCORE_FLOOR (60) so
  they ENTER the rumor net (ordinary festival outcomes stay below the floor —
  no beat-spam). JUDGMENT (vetoable): both edits are GATED on beliefAxesEnabled —
  a lit-traditions world without the axes keeps today's exact news volume, so
  every existing lit campaign and golden is byte-identical; the coupling lights
  as one system. Rumor arrival then adopts observanceLabel with fidelity-scaled
  accuracy. THE STALENESS IS THE FEATURE: a rival that heard nothing still
  believes the OLD rite persists after politics rededicated it — fog-of-war about
  culture, spoofable via the existing LIE machinery (a falsified observance
  payload rides the same lane; no new code).
- CONSUMERS: read-side only in this wave — belief() surfaces both fields; the
  dramatic-irony/display briefs render them free ("Thornwall believes the Vigil
  of Embers still burns in Dulwich — it was rededicated two winters ago").
  ACTING consumers (war/migration/dispatch decisions reading believed decline or
  believed rites) are the OWNER-GATED step 2, exactly the beliefs×upswing
  precedent (matrix candidate #8) — recorded §14 Q3, never wired silently.
- WRITES ⇒ ONLY: beliefMaps records via advanceBeliefMaps (existing writer;
  beliefAxes.js is pure) · the two traditions-side beat edits above (traditions'
  own writer, its own list) · NOTHING ELSE.
- RNG: categorical adoption noise forks `belief-axes:${observerId}:${tick}` if a
  draw is needed (the existing axis-noise idiom; else zero new forks).
- LIFECYCLE: fields are additive-optional on records inside the existing
  beliefMaps state — absent dark (contract-asserted), present lit; undo/clone/
  persist ride beliefMaps untouched; no migration (law 12); regen n/a.
- COMMITS: D-1a machinery leaf + threading + typedef + unit tests · D-1b
  demographic feeder + transitivity test (migration→rumor→belief across 3 hops,
  wrong-belief case included) · D-1c cultural feeder + the two gated traditions
  edits + the staleness pin (rededicate; assert a silent observer's belief stays
  OLD until a beat arrives) + dormancy golden (beliefAxesDormancy) + anti-vacuity.
- GATES: focused + dormancy golden + the FULL existing belief/rumor/traditions
  golden set untouched. DONE-WHEN: dark byte-identical (executed); the 3-hop
  transitivity and staleness pins green; a LIE carrying a false observance payload
  propagates and dies on contradiction (the spoof pin); closure delta 0.

## §6 D-2 — PER-NPC CREDIBILITY + THE LIE-STIGMA (flag: `npcCredibilityEnabled`)
Character-level reputation: the proven-liar discount, personally.
- STATE: NEW sub-ledger `spatialLedgers.npcCredibility = { [npcId]: { score,
  lastUpdateTick } }` — the settlement stock's shape at NPC grain (centered 1.0,
  slow-rise/sharp-fall, generational half-life toward neutral — the
  CREDIBILITY_TUNING constants reused with an NPC-scale override table). npcId =
  the npcId(saveId, npc, index) idiom. Entries prune on the roster scan when the
  NPC vanishes (the roads cadence-prune precedent). Writer: the informationStatecraft
  mover (extended write-list), with the core logic in a NEW lazy leaf
  `src/domain/worldPulse/npcCredibility.js` (informationStatecraft.js keeps its
  195-line headroom for threading only).
- ATTRIBUTION (the genuinely new machinery): statecraft today knows only
  settlements. D-2 stamps a SPOKESPERSON on information acts:
  (a) LIE: at seed time the lying court picks a mouthpiece — a seeded,
  importance-weighted draw over the settlement's government/notable roster, fork
  `npc-cred:lie:${sid}:${tick}` — stamped DisinfoRecord.spokespersonNpcId
  (additive optional field); (b) D-3's warnings and sales stamp the carrier the
  same way at their own seed points. No autonomous attribution scan exists —
  attribution happens only where an act is already being minted (law 4).
- THE PERSONAL CHARGE: on lie EXPOSURE (the existing processLies contradiction
  path), the settlement takes today's deception delta unchanged AND the
  spokesperson takes a personal deception delta (sharper: personal trust dies
  faster than a court's — the asymmetry constant steepened one notch). On a
  proven-true warning/sale (D-3's proof-out path), a small personal proven_true
  rise. Consumption: the credibilityOf injection extends to weight NPC-attributed
  reports by settlementCred × npcCred, clamped [0.25, 1.5]; intelSalePrice reads
  the seller-NPC's stock (D-3); the Blainey read stays settlement-level
  (unchanged — recorded).
- THE LADDER HOOK (deposit-and-consume, law 5): the ladder's maintainMarks pass
  (npcLadderState.js:186-223) — which already diff-detects fresh corruption
  exposure — gains a SECOND consumed source: exposed DisinfoRecords bearing a
  spokespersonNpcId. Fresh lie-exposure mints the SAME stigma shape {sev, week,
  tick} (sev scaled by the lie's magnitude band), pays the SAME
  STIGMA_CHALLENGE_TAX, and opens the openWindows reason `exposed_liar`
  (sibling of 'revealed_corruption'). The LADDER writes all of it through its own
  kernel; statecraft only deposits the exposure record it already owns. Lag: the
  stigma lands the tick after exposure (law 14 — the scandal takes a week to
  reach the court). Gated: ladder dark ⇒ no hook, credibility still runs.
- BOUNDARY: §0.5 amendment applies — a credibility charge + stigma is reputation,
  never a fate; the NPC lives, schemes, and may claw back to neutral on the
  generational clock.
- WRITES ⇒ ONLY: spatialLedgers.npcCredibility (own ledger) ·
  DisinfoRecord.spokespersonNpcId at its own seed site · newsEntries (exposure
  news already exists; the personal naming joins the existing beat's prose) ·
  NOTHING ELSE. (The stigma write belongs to the LADDER's list, via consumption.)
- RNG: `npc-cred:lie:${sid}:${tick}` (mouthpiece draw). No cadence draw exists —
  the system is purely reactive to acts other systems mint (law 4 by shape).
- LIFECYCLE: additive sub-ledger (law 12 spine verbatim); dark ⇒ no key
  (contract-asserted); undo atomic; prune pinned (DM remove_npc leaves no
  dangling npcCredibility key — the roster-scan pin).
- COMMITS: D-2a the leaf + ledger + tuning + prune + unit tests · D-2b spokesperson
  stamping + the personal charge on the exposure path + credibilityOf extension +
  pins (repeat-liar discount measurably compounds; the boy-who-cried-wolf pin) ·
  D-2c the maintainMarks consumption arm + `exposed_liar` window + stigma pins +
  dormancy golden (npcCredibilityDormancy) + anti-vacuity + the ladder-dark
  gating pin.
- GATES: focused + dormancy + the informationStatecraft and ladder golden sets
  untouched. DONE-WHEN: an exposed lie's mouthpiece is personally discounted on
  his NEXT attributed report (executed pin); the stigma appears in the ladder
  ledger with the tax applied and the window open; ladder-dark twin run leaves
  ladder state byte-identical; closure delta 0.

## §7 D-3 — THE INTEL LANE (gift + sell; flag: `intelTradeEnabled`)
The parked SELL verb gets its bounded callers; the live `warning` act gets its
missing genesis. HIGHEST CALIBER HERE = the anti-hum law made structural.
- INITIATION (the whole lane's tempo, law 4): NO per-tick scanner. A transfer is
  evaluated ONLY when ALL of: (a) a TRIGGER EVENT lands in the would-be seller's
  FRESH beliefs this tick — the enumerated trigger set: a believed army movement
  toward / calamity in / blockade of a settlement the candidate receiver holds a
  bond or obligation with (reads the receiver's stakes, never scans the world);
  (b) the pair QUALIFIES — GIFT: qualifiesForGenerosity(giver, receiver) (the
  existing gate); SELL: confirmed trade partners (tradeNeighbours) not at war;
  (c) the per-pair COOLDOWN (INTEL_PAIR_COOLDOWN_WEEKS = 26) is clear; (d) the
  YEARLY loaded-dice cadence draw fires — tick-invariant world-seed fork
  `intel-trade:${sellerId}:${receiverId}:${year}` (the roads cadence pattern;
  collapsed catch-up never shifts who trades); (e) the per-settlement cap
  (INTEL_ACTS_PER_YEAR_CAP = 2) has room. Expected outcome: a realm of 12
  settlements produces a handful of transfers a year — events, not a hum
  (§13 soak band).
- THE GIFT (rides generosity, D-3a): the trigger scan deposits an
  intel-opportunity into the generosity mover's OWN evaluation (the act is
  already in its catalog as `warning` LIVE): generosityEV weighs it with
  warningSacrifice (generosityEV.js:867 — the orphan gets its caller: the price
  of telling, not the value of hearing — exposing your knowledge, sometimes your
  eyes); gratitude via the widow's-mite math; the obligation mint (kind
  `warning`) through foldObligations' existing chokepoint. ⚠ generosityKernel is
  at 800/800: the wiring rides the CATALOG DATA PATH (the act is registered;
  D-3a lights its evaluation via the catalog entry + logic in generosityEV.js /
  a sibling leaf — implementer measures generosityEV headroom first; overflow ⇒
  new leaf `src/domain/spatial/intelActs.js`), NET-ZERO in the kernel itself.
- THE SALE (rides statecraft, D-3b): price = intelSalePrice (generosityEV.js:892
  — credibility-discounted by the seller settlement's stock × the seller
  spokesperson's D-2 stock). CONSIDERATION (JUDGMENT, vetoable): the favor
  economy is the currency — a sale CLEARS/REDUCES an existing obligation the
  seller owes the buyer (information as repayment), or mints a REVERSE obligation
  (kind `intel_sale`, buyer indebted) when no debt exists; NO coin ledger is
  invented (numeric-coin pricing = deferred seam §15, rides the NUMERIC_PRICES
  read-model when that matures).
- THE TRANSFER MECHANIC (both lanes): SHARE transfers the seller's BELIEF with
  the seller's lineage at the seller's fidelity (statecraft §2.4/§3) — implemented
  as the gated belief-injection twin of the LIE path (the W-DOCTRINE-2 judgment-3
  precedent: injection, not pre-rumor seeding — keeps every rumor/belief golden
  byte-identical), sourceId = seller settlement + spokespersonNpcId. SELF-POLICING
  CLOSES: if the sold/gifted read later CONTRADICTS (the existing contradiction
  event), intelSaleCredibilityDeltas (informationStatecraft.js:994 — the second
  orphan gets its caller) charges the seller's stock and (D-2) the spokesperson's;
  if it PROVES OUT, the proven_true rise pays. The boy who sold true wolf-sightings
  gets rich in trust; the one who sold rumors goes broke in it.
- CROSS-MOVER CHOREOGRAPHY (law 14): the generosity pass evaluates + deposits the
  transfer record into ITS ledger (the mints array); the statecraft pass CONSUMES
  it next tick to perform the belief-injection + stamp the sale receipt. One week
  of courier time, by construction. Each mover's write-list unchanged in kind.
- DM-VERB PATH: deliberately DEFERRED (§15) — the statecraft design promises a
  manual twin for every verb, but a world-scoped intel op does not fit the
  npc-scoped pendingEdits queue shape; forcing it would invent a new op surface
  in an engine lane. Recorded, not silent.
- WRITES ⇒ ONLY: generosity's own ledger/mints (gift + consideration) ·
  statecraft's own ledgers (the injection, an `intelTrades` receipt sub-ledger,
  credibility deltas) · newsEntries (a gift-warning that proves out is NOTABLE
  news at the receiver — "riders from Thornwall brought word of the column three
  days before it crested the pass") · NOTHING ELSE.
- RNG: the cadence fork above + `intel-trade:pick:${sellerId}:${tick}` (target
  choice among simultaneous qualifying triggers).
- LIFECYCLE: intelTrades is an additive sub-ledger (law 12 spine); obligations
  ride the existing ledger; dark ⇒ no key, no acts (contract).
- COMMITS: D-3a triggers + gift wiring + warningSacrifice caller + obligation
  pins · D-3b sale + consideration + injection + self-policing loop closed
  (contradiction → charge; proof-out → rise; both pinned) · D-3c cooldowns/caps +
  dormancy golden (intelTradeDormancy) + anti-vacuity + the TEMPO PIN (a 10-year
  lit run stays inside the acts-per-year band — the anti-hum law, executed).
- GATES: focused + dormancy + generosity/statecraft golden sets untouched.
  DONE-WHEN: the closed loop executes both directions (charged seller, enriched
  seller) in a lit walkthrough; tempo band held over 10 lit years; dark
  byte-identical; closure delta 0.

## §8 D-4 — THE CONTESTED GOALS CLASS (flag: `contestedGoalsEnabled`; cluster D-4a..D-4f)
Two named NPCs discover they are pursuing the SAME ambition — or opposing ones —
and the resolution is head-to-head. The addendum's commission, designed in full.
V1 SCOPE CUT (recorded): goals are conditions over settlement-scoped causal
signals, so colliding goals are SAME-SETTLEMENT by construction; cross-settlement
contest GENESIS is a vNext seam (§15) — but its outcome CHANNEL already exists:
any future cross-border contest marks the NPC pair and reaches the settlement
pair through D-7f's elite bleed, never a separate pathway (the channel contract,
§10.5).
- GENESIS (D-4a): inside the ladder pass (per settlement, npcLadderEnabled ∧
  contestedGoalsEnabled), after goal minting: scan active goals of DISTINCT NPCs
  for COLLISIONS on the same signalVar (goalSignalVar, npcLadderGoals.js:232):
  * CONVERGENT — both verbs `raise` toward thresholds within CONTEST_BAND (8
    points): a race for the same deed and the same attribution.
  * OPPOSED — one `raise`, one `hold` whose holder's threshold sits BELOW the
    raiser's target: the status quo's defender vs the reformer. (Natural-opposite
    var pairs — law_order vs criminal_opportunity — are a deferred seam pending
    causal cross-term recon; v1 is strictly same-var.)
  At most ONE contest per signalVar per settlement (the earliest-minted pair
  wins the slot; codepoint tiebreak); at most CONTESTS_PER_SETTLEMENT_CAP = 2
  live contests per settlement. THE FOUR DETERMINISM DISCIPLINES (recon-derived,
  binding): (i) genesis is a SEPARATE settlement-wide pass AFTER the per-faction
  goal-mint loops complete (after npcLadderKernel.js:328-349) — never inside
  applyGoalLifecycle, or NPC A mints "vs B" while B mints "vs A" (the double-mint
  race); the settlement-wide pass is also what gives CROSS-FACTION pairs
  visibility (the per-faction loop cannot see them — a deliberate, recorded
  structural addition); (ii) every pair-keyed fork label CANONICALIZES the two
  npcIds by codepoint sort before building the label, so the same draw results
  regardless of processing order; (iii) all standing writes from a resolution
  are PLAN-THEN-APPLY (collected, applied in one block after the resolution
  pass — the npcLadderKernel.js:374-381 precedent) so no outcome feeds back
  into a same-tick score; (iv) contests iterate in codepoint-sorted contestId
  order. ContestRec is a THIRD top-level key in the ladder record (beside
  factions/npcs), which means D-4a extends the three existing state chokepoints
  — normalizeRecord (npcLadderState.js:286-297), sortedRecord (:326-352), and
  mirrorOf (:362-395) — all still inside the single-writer module; the contest
  logic lives in a NEW lazy sibling leaf
  `src/domain/worldPulse/npcLadderContest.js` (the npcLadderGoals/Challenge
  precedent exactly):
  ```
  spatialLedgers.npcLadder[sid].contests = { [contestId]: {
    id,                      // `contest.${sid}.${signalVar}.${mintWeek}`
    signalVar, kind,         // 'convergent' | 'opposed'
    a: { nid, awareSince,    // null until discovery
         heardProgress, heardWeek },   // the STALE snapshot of the rival (below)
    b: { … same … },
    openedWeek, backedBy,    // null | 'a' | 'b' (D-4e party marker)
    resolvedWeek, outcome    // null while live
  } }
  ```
- AWARENESS — KNOWING vs UNKNOWING (D-4b): both sides start UNKNOWING. Per tick
  per unaware side, a discovery draw (fork
  `ladder-contest:aware:${contestId}:${nid}:${tick}`): p = DISCOVER_BASE (0.04)
  × sameFaction? 3.0 : 1.0 (court gossip) × rivalMovedThisTick? 2.0 : 1.0 (deeds
  are visible) × (1 + newsHeat) — bounded ≤ 0.35/tick. On discovery: awareSince
  stamped; heardProgress snapshots the rival's TRUE progress AT THAT MOMENT and
  goes STALE until a later re-hear (re-draws continue at lower rate) — the
  contestant acts on old intelligence, exactly the fog texture the belief axes
  bring to settlements, at personal grain. DELIBERATE SCOPE CUT (recorded): this
  per-contest fog is NOT the beliefMap (NPC-grain belief ledgers would be a new
  universe); the D-1 axes and this field are siblings in spirit, separate in
  machinery. THE BLUFF (D-2 coupling): a contestant with flaw ∈ {deceitful,
  manipulative, mendacious} distorts what rivals hear (heardProgress ±
  BLUFF_SKEW, seeded) — and at resolution, a bluff CONTRADICTED by the outcome
  deposits a deception exposure the D-2 pass consumes (personal credibility
  charge + possible `exposed_liar` stigma). One distortion per hear-event, no
  per-tick lying (law 4).
- TUNNEL VISION (owner refinement 2026-07-19, folded in at freeze — character-
  driven irrationality; the contestant is a PERSON, not an optimizer): a
  personality-AND-history-gated fixation modifier, computed per contestant per
  rival from EXISTING state only (no new memory machinery):
  ```
  fixation01 = clamp01( 0.5 × grudgeWeight(against THAT rival)   // LadderStanding.grudges — the
                                                                 //   ladder's own rivalry memory,
                                                                 //   typed+decaying after D-4c
              + 0.3 × grievanceLean(the pair's edge)             // the SUBSTRATE read (memory-weave
                                                                 //   law): a clone of warReasons.
                                                                 //   scoreGrievance (:425) +
                                                                 //   scoreRevanchism (:443, the
                                                                 //   decade clock over typed
                                                                 //   recentIncidents) scoring
                                                                 //   resentment + memoryScore +
                                                                 //   incidents — NEVER the coarse
                                                                 //   rung; applies when the
                                                                 //   contestants' factions/homes
                                                                 //   have an edge (cross-faction
                                                                 //   with the D-7c ledger; else 0)
              + 0.4 × hasFixatingTrait                           // dominant/flaw ∈
                                                                 //   {proud, vengeful, zealous,
                                                                 //    arrogant, ruthless}
              − 0.5 × hasRationalTrait )                         // ∈ {pragmatic, cautious,
                                                                 //    prudent, patient}
  ```
  A pragmatic soul with no history stays at 0 — fully rational. Fixation biases
  THREE existing draws, never a new write path: (a) ENTRY — the discovery rate
  vs THAT rival scales ×(1 + fixation01) (the obsessed watch their enemy), and
  where engagement is optional (the `contested_goal` challenge window below) the
  attempt RATE scales ×(1 + FIXATION_RATE_GAIN × fixation01) with the SCORE
  unchanged — the fixated attempt at odds a rational rival would decline, and
  lose more; (b) ODDS — a fixated contestant DISCOUNTS heardProgress by
  ×(1 − 0.3 × fixation01) (he underrates the man he despises — overconfidence as
  stale intelligence's twin); (c) AFTERMATH — THE LOSS WRITES MEMORY (the
  memory-weave loop closure): every contest loss mints a TYPED grudge entry on
  the loser toward the winner — the ladder-grudge structure EXTENDED
  (npcLadderKernel.js:109 shape gains {kind: 'contest_loss'|
  'contest_forestalled', week, sev} with ADDITIVE stacking and, where warranted,
  positive-bond entries for a backer — the DESIGN_SIM_DEPTH_R2.md:170
  state-never-fate doctrine: NEVER a parallel NPC-pair graph, and the deliberate
  succession reset is PRESERVED); a fixated loser's entry lands one step deeper
  (bounded by the grudge cap + decay half-life, so loss→grudge→fixation→loss
  CONVERGES, stated and pinned — no runaway). When the contestants belong to
  DIFFERENT factions AND the D-7c faction-pair ledger is owner-signed and lit,
  the loss ALSO deposits a typed faction-pair incident there (its own decay,
  §10.5). The no-death law and single-writer law are untouched: fixation reads
  grudges/the-pair's-edge/personality, modulates draws inside the ladder
  kernel's own pass, and the only new writes are the ladder's own typed grudges
  (+ the gated D-7c deposit).
- DYNAMICS (deliberately minimal, recorded): awareness changes NO per-tick writes
  in v1 — the contested state's live effects are (a) the discovery receipts,
  (b) for INTRA-FACTION contests between ladder-adjacent rivals, the contest
  opens the `contested_goal` challenge window on BOTH (the ladder's own window
  vocabulary widens by one reason — rivalry over the same prize is exactly what
  the challenge engine models; its own gates/margins unchanged except the
  tunnel-vision rate bias above), and (c) the fixation modulation. No spoiler
  term writes any causal signal — contested goals NEVER touch ground truth
  (law 3's sim-truth twin: causal state belongs to the world, not the race).
- RESOLUTION (D-4c): fires when either goal FIRES (evaluateGoal.fired) or both
  horizons expire.
  * CONVERGENT, one fires first: the finisher takes the standard goal settlement
    (existing machinery, untouched); the rival's same-signal goal resolves
    FORESTALLED — banked partial-progress deposits KEEP (real work paid as it
    advanced, npcLadderGoals §11.3), the terminal deposit × FORESTALLED_MULT
    (0.25), a standing STING (−STING_STAND, small, through the ladder's own
    deposit writer), and a GRUDGE entry against the winner (the LadderStanding
    grudges field — reused, not invented). Both-fire-same-tick tie: the
    challengeDraw idiom breaks it — hash01 pair-keyed fork
    `ladder-contest:resolve:${contestId}` with margin from the challenge engine's
    enumerated inputs (rung seat weight, stakes, attributionWeight) — cite
    npcLadderChallenge.js:107-166; deterministic, receipted.
  * OPPOSED, raiser fires: the holder LOSES — sting + grudge + the
    `contested_goal` window opens ON THE LOSER for WINDOW_SEASON_WEEKS (13): a
    public defeat invites challengers. Horizons expire un-fired: the holder HELD —
    the hold-verb settlement pays normally; the raiser takes the ordinary
    goal-failure path.
  * backedBy (D-4e): the backed side adds BACKED_MARGIN (0.15) to its tie-break /
    contest margin, and the resolution receipt names the party's hand.
  NO-DEATH: every cell of every outcome is a standing/grudge/window consequence —
  conservation = the rung roster remains a permutation (asserted); §0.5 applies.
- PLAYER SIDING (D-4e): NEW edit kind `champion-npc` (name vetoable §14 Q5) —
  EDIT_KINDS + COMMITTABLE_EDIT_KINDS in lockstep with its dispatcher arm (law
  11); the op body (lazy ops leaf, the npcOps pattern) stamps backedBy on the
  live contest via a MARKER the mover consumes (the roads whereabouts.partyRelease
  marker precedent — the op never writes the ladder ledger directly; the kernel
  folds the marker on its next pass). operationRegistry + gen:compendium-data +
  build:edge-shared; guidance whisper ships with the op (the lifecycle-doc
  covenant). Undo pin: champion → advance → undo leaves no marker and no backedBy.
- LINKED / SUPPORTIVE GOALS (D-4f — the positive-bond ruling; gates
  contestedGoalsEnabled ∧ memoryWeaveEnabled; the POSITIVE MIRROR of
  tunnel-vision's rival-fixation): at goal genesis, an NPC holding a strong
  positive bond (D-7e, sev ≥ SUPPORT_BOND_FLOOR) toward a rung-holder with an
  active primary goal may mint a SUPPORT goal INSTEAD of a primary that year
  (seeded draw, fork `ladder-support:${sid}:${nid}:${year}` tick-invariant;
  ≤1 supporter per patron goal, codepoint tiebreak): LadderGoal gains optional
  {supportOf: patronNid} — its condition IS the patron's condition (a derived
  reference, re-resolved each tick against the patron's live goal; the patron
  goal vanishing ⇒ the support goal LAPSES honestly). MECHANICS: progress =
  the patron goal's progress (pure read); deposits = attributionWeight ×
  SUPPORT_SHARE (0.4) as the patron's goal advances (office/domain rules apply
  to the SUPPORTER's own seat — a highly-placed backer is worth more). THE
  CASCADE (the owner's verbatim rule): the patron's primary FAILS — horizon
  expiry, forestalled, or lapsed — ⇒ the support goal FAILS THE SAME WAY, SAME
  TICK (the dependency edge; receipted "his cause fell with his patron's");
  patron SUCCEEDS ⇒ the supporter books the support settlement AND the bond
  deepens BOTH directions (a D-7e cooperation event — victory forges
  friendship). CONTEST JOINING (bonds bias the contest): a live supporter — or
  any bonded peer above JOIN_BOND_FLOOR — JOINS the patron's side of a contest
  over that goal: the side gains BOND_JOIN_MARGIN (0.10) per joiner (cap 2 per
  side) on resolution margins and tie-breaks (the backedBy precedent
  generalized); losing-side joiners take no sting (the cascade, if linked, IS
  their cost); winning-side joiners book a bond deepen with the winner.
  NO-DEATH: a cascaded support goal is a goal failure — standing physics only;
  the supporter's next year mints fresh.
- NEWS/PROSE: discovery-when-both-aware (NOTABLE — "two hands reach for the same
  prize"), resolution (NOTABLE; MAJOR when a pillar contests), pools in
  `src/data/contestProse.js` via the eventProse registry (law 13).
- WRITES ⇒ ONLY (the ladder kernel's amended header list): its own
  spatialLedgers.npcLadder sidecar INCLUDING the new contests sub-key + the
  existing mirror · standing deposits/stings/grudges/windows through its own
  existing writers · newsEntries · the bluff-exposure deposit record (consumed by
  D-2's pass) · NOTHING ELSE.
- RNG: `ladder-contest:aware:…` (discovery) · `ladder-contest:resolve:…`
  (tie-break) · `ladder-contest:bluff:${contestId}:${nid}:${week}` (skew). All
  pulse-confluence forks (event draws, not cadence).
- LIFECYCLE: contests nest in the existing ladder ledger (law 12 spine); dark ⇒
  no contests key (contract); prune on roster scan (a removed contestant voids
  the contest, receipted 'lapsed'); undo atomic; DM stasis/remove collisions
  pinned (any phase, no orphan).
- GATE (sequencing): the-ladder residue 14e8a2fa (canonical `.faction` read)
  folds or is cherry-absorbed BEFORE D-4a — not merely because the contest keys
  touch that surface: the bug is LIVE in the composite (§2 — real factions
  collapse to `fac.unknown`, ladders merge/empty), so contested goals built atop
  the unfixed key would be tested against a silently broken substrate.
- COMMITS: D-4a genesis (the settlement-wide pass) + ContestRec + the three
  state-chokepoint extensions + caps + unit tests · D-4b awareness + staleness +
  bluff + TUNNEL VISION (fixation read + the three biases + the convergence
  bound pin) · D-4c resolution matrix + tie-break + window widening +
  conservation assert + plan-then-apply · D-4d news/prose + dormancy golden
  (contestedGoalsDormancy) + anti-vacuity · D-4e champion-npc op + registry +
  regen + undo pin + eager delta quoted (≤300 B, the wave's only eager bytes) ·
  D-4f support goals + the cascade + contest joining + the both-flag gating
  pin (contests lit, memoryWeave dark ⇒ zero support goals, zero join terms —
  byte-identical to D-4e's world).
- GATES: focused + dormancy + ladder golden set untouched + the operationRegistry
  walker + compendiumDataFreshness (D-4e). DONE-WHEN: a lit walkthrough (§13)
  shows an unknowing convergent race discovered, bluffed, resolved, grudged, and
  a challenge fired through the contested_goal window; both-dark and
  ladder-lit-contests-dark twins byte-identical; roster permutation asserted
  every tick.

## §9 D-5 — THIRD-PARTY RANSOM [POST-ROADS-FOLD] (flag: `thirdPartyRansomEnabled`)
The generosity design's own parked v2 seam ("RANSOM/TRIBUTE-RELIEF … three-party,
design later" + "pride-refusal", DESIGN_GENEROSITY_ENGINE §4/§8) — commissioned,
with the roads ransom as substrate and BOTH owner refinements binding.
⚠ RE-SURVEY FIRST: all anchors below surveyed at claude/the-roads 99084183.
- THE SHAPE: RansomRec (state.js:80-92) gains OPTIONAL {payerId: null, payerMotive:
  null, thirdPartyResolved?: bool} — additive, absent on legacy records.
- PAYER GENESIS (once per ransom, bounded): at the HALF-TERM checkpoint
  (remainingWeeks crosses termWeeks/2), a single payer scan (fork
  `roads-ransom3p:${ransomId}` — ransomId-seeded, tick-invariant ⇒ catch-up
  safe): candidates = settlements ≠ homeId with EITHER (a) ALLY/CREDITOR
  standing toward home — qualifiesForGenerosity(payer, home) or a live obligation
  home→payer (a debtor's captive is a chance to collect in gratitude) — motive
  'succor'; OR (b) a PREDATORY seat — the generosity §2.1 leverage read (ambitious/
  evil-leaning governing archetype) with relationship home↔payer ∈ rival/cold_war
  — motive 'leverage' (buying a rival's notable IS the favor-economy weapon the
  owner commissioned); OR (c) — when memoryWeaveEnabled — A FRIEND (the
  positive-bond ruling): a settlement whose notable NPCs hold a D-7e positive
  bond toward the captive (sev ≥ FRIEND_PAYER_FLOOR) — motive 'friendship',
  ranked ahead of the other channels (a friend moves first). Highest-EV
  candidate only; no auction (deferred §15). Captor gate: a payer at open war
  with the CAPTOR cannot deal (atOpenWar read). On release by a friend-payer,
  the captive's gratitude bond toward the payer's ruling-seat NPC deepens (a
  D-7e formation event — being ransomed by a friend is how friendships become
  legends).
- THE REFUSAL (owner refinement ii — the pride-refusal seam made law): evaluated
  BEFORE any release logic (ahead of the :670-671 branch), fork
  `roads-ransom3p:refuse:${ransomId}`:
  ```
  refuseP = clamp( BASE(motive,relation)            // 'friendship' (a friend's coin): 0.02
                                                    // 'succor' from an ally of home: 0.05
                                                    // 'succor' from an unbonded neutral: 0.25
                                                    // 'leverage' (a rival's coin): 0.55
            + 0.30 × hasRefusingTrait               // dominant/flaw/modifier ∈
                                                    //   {proud, loyal, principled, zealous, pious}
                                                    //   (traitsOf read — the npcLadderGoals idiom)
            − 0.25 × hasAcceptingTrait              // ∈ {pragmatic, ambitious, opportunistic}
                                                    //   OR flaw ∈ CORRUPTIBLE_FLAWS
            − 0.10 × servedFraction                 // long chains humble the proudest neck
            , 0.05, 0.95 )
  ```
  REFUSAL = the record stamps thirdPartyResolved:true and NOTHING ELSE CHANGES:
  the term keeps running, home keeps paying, rescue/party/amnesty paths stay
  live — refusal never resolves a fate (law 9, restated because this is the cell
  where a lazy implementation would invent one). Receipt: NOTABLE news — "he
  would not be bought by Dulwich's coin."
- THE ACCEPTANCE → release NOW, with the :673-707 write schedule REDIRECTED:
  home seat SKIPS the final `bumpLegit(homeId, …)` at :692 (the payer's coin
  covered the shame); the captor books its prosperity credit unchanged; the
  PAYER pays −1 prosperity band-step for key/pillar captives (the upswing
  applicator idiom — mercy priced); NOTABLE news names the payer. The freed
  captive takes the ordinary returning leg home.
- THE OUTCOME FORK (owner refinement i): EXACTLY ONE of DEBT or COMPROMISED, one
  roll at release (fork `roads-ransom3p:outcome:${ransomId}`):
  ```
  pCompromised = clamp( 0.18
                 × conversionFlawFactor(npc, CORRUPTIBLE_FLAWS)   // state.js:317-333 —
                                                                  // the SAME read roads
                                                                  // conversion uses; ZERO
                                                                  // new trait machinery
                 × motiveMult   ('leverage' 1.6 · 'succor'-unbonded 1.0 · 'succor'-ally 0.6
                                 · 'friendship' 0.3 — a friend's ransom binds by GRATITUDE,
                                   not leverage: the bond-biased outcome the owner ruled)
                 × acceptBias   (captive accepted VIA an accepting trait ? 1.4 : 1.0)
                 , 0, 0.5 )
  ```
  PRECEDENCE: if the roads captor-conversion already latched (RansomRec
  .willConvert, rolled at capture) the CAPTOR's leash wins — first-latched, one
  leash per soul (the web's scarcity-as-law) — and the payer outcome is FORCED
  to DEBT. COMPROMISED: the mover emits the returned-captive CHANNEL record
  (roads §10's fourth-channel shape VERBATIM) with beneficiary = THE PAYER;
  the corruption web mints through its OWN gates on its own pass; web dark ⇒
  fall through to DEBT (gating coherence); COVERT ⇒ no news of the leash, ever.
  DEBT: the mover deposits a ransomSettlements record in ITS OWN ledger;
  advanceGenerosity consumes it NEXT tick (law 14 — the freed man walks home
  before the ledger knows his price) and mints through foldObligations:
  {from: homeId, to: payerId, kind:'ransom_relief',
   magnitude: obligation-scale × importanceWeight, predatory: motive==='leverage'}.
  Roads NEVER writes the obligations ledger; generosity NEVER writes RansomRec.
- §9.1 THE THREE-BODY MATRIX (payer motive × captive personality × H↔P relation —
  the commissioned table; probabilities from the two formulas above, representative
  cells, every cell fixture-exercised per §13):
  | payer motive | captive personality | H↔P relation | refuse | accept→debt | accept→compromised |
  |---|---|---|---|---|---|
  | succor (ally of home) | loyal/proud (refusing) | ally | 0.35 | ~0.62 | ~0.03 (0.6 mult, flaw-neutral) |
  | succor (ally) | neutral traits | ally | 0.05 | ~0.87 | ~0.08 |
  | succor (ally) | corruptible flaw (greedy…) | ally | 0.05* | ~0.71 | ~0.24 (flaw 1.6 × accept 1.4) |
  | succor (unbonded conscience) | proud/zealous | none | 0.55 | ~0.41 | ~0.04 |
  | succor (unbonded) | pragmatic | none | 0.05* | ~0.75 | ~0.20 |
  | leverage (rival coin) | proud/loyal/principled | rival | 0.85 | ~0.13 | ~0.02 |
  | leverage | neutral | rival | 0.55 | ~0.32 | ~0.13 |
  | leverage | ambitious + corruptible flaw | rival | 0.30* | ~0.28 | ~0.42 (1.6 × 1.6 × 1.4, clamp 0.5) |
  | friendship (bonded payer) | any refusing traits | any | 0.02-0.32 | ~dominant | ≤0.15 even for the flawed (0.3 mult — gratitude, not leverage) |
  | any, willConvert already latched | any | any | per row | remainder → DEBT (forced) | 0 (captor precedence) |
  | any, memoryWeaveEnabled dark | (friendship rows unreachable) | — | bond-free rows only | per row | per row |
  (*accepting-trait −0.25 applied; servedFraction erosion moves every row's
  refuse column down as the term ages — the matrix is evaluated at half-term.)
  READ THE SHAPE: a rival's coin is usually refused by the honorable, usually
  pocketed with a ledger entry by the pragmatic, and — for the flawed and
  ambitious — is the single most likely doorway to a covert leash in the whole
  engine. Exactly the owner's favor-economy weapon.
- WRITES ⇒ ONLY (roads law-6 list AMENDED, one new clause): …existing (a)-(g) ·
  (h) the ransomSettlements deposit records + the payer-beneficiary
  returned-captive channel record in its OWN ledger · the redirected legitimacy/
  prosperity writes are the EXISTING applicator idioms re-aimed · NOTHING ELSE.
- LIFECYCLE: additive RansomRec fields (law 12); refusal path leaves zero new
  state beyond the stamp; undo atomic; the DM ransom-npc/rescue-npc ops WIN over
  a pending third-party checkpoint (DM sovereignty — the op resolves first, the
  scan finds no live ransom; pinned).
- COMMITS: D-5a payer scan + motive/EV + captor gate + RansomRec fields + unit
  tests · D-5b the refusal roll + matrix fixtures (EVERY §9.1 cell exercised,
  executed) + no-death/roster-conservation asserts · D-5c acceptance redirection
  + the outcome fork + both deposit-and-consume arms + precedence pin + web-dark
  pin + dormancy golden (thirdPartyRansomDormancy: flag absent ⇒ roads behaves
  EXACTLY as folded — byte-identical against the roads-only baseline) +
  anti-vacuity + prose/news.
- GATES: focused + the roads golden set (re-based post-fold) + generosity/web
  goldens untouched. DONE-WHEN: a lit walkthrough shows all three terminal
  outcomes (refused / debt / compromised) + the captor-precedence case; the
  obligation appears via generosity's own pass one tick after release; the leash
  appears only web-lit and only via the web's own gates; dark twin byte-identical.

## §10 D-6 — THE SEA ROADS [POST-ROADS-FOLD] (flag: `seaRoadsEnabled`)
Envoys, embassies, and captives travel by sea — the roads §21 deferred seam
closed. CHEAPER THAN COMMISSIONED (recon receipts §2): distance is already
sea-aware, piracy parity already holds, storms are already priced. The build is
THREE coordinated points plus hazards.
⚠ RE-SURVEY FIRST (the D-5 caveat verbatim).
- (1) MODALITY ON THE RECORD: MissionRec gains OPTIONAL `legModes: []` — per-hop
  'land'|'sea' classified AT DISPATCH from the digest's sea-edge adjacency
  (seaEdgesOfPath over the frozen path; absent field ⇒ all-land, legacy-tolerant).
  IMPORTANT STATUS-QUO HONESTY: because route choice already folds sea edges when
  the digest is lit, a folded-roads world MAY already route missions over water
  silently; `seaRoadsEnabled` therefore gates the NEW machinery (modality
  awareness + sea hazards + prose), NOT the existing routing — dark = today's
  exact behavior, byte-identical, pinned against the folded-roads baseline.
- (2) SEA-AWARE currentHopOf: currentLegMode(mission, tick) beside currentHopOf
  (roadsKernel.js:153-168 surveyed) — pure derivation from legModes + position01.
- (3) SEA HAZARDS (the PASS-3 branch, per-hop modality dispatch — land hops keep
  T1-T4 verbatim; sea hops swap in, commission-bounded: pirates/storms/blockades,
  NOT patrolling armies):
  | # | class | trigger (TRUTH read) | shape |
  |---|---|---|---|
  | S1 | BLOCKADE | either endpoint port of the current sea hop ∈ activeBlockadeTargets(worldState) AND the blockader hostile to home | capture roll, base 0.30, α 0.25 (a fleet respects an escort even less than an army — the T1 partial-bypass law at sea); captor = the blockading power; HOSTAGE → the EXISTING ransom machinery unchanged |
  | S2 | STORM | autumn/winter sea hop (the stormSeasonCost seasons) | NEVER capture: DELAY only — legArrivalTick + 1-2 weeks (fork `roads-sea:storm:${missionId}:${tick}`), texture news. Dispatch already prices storm season via hopWeeks ⇒ the refusal logic (roads §5) deters winter crossings for free — priced AND rolled compose without double-counting because the roll only delays |
  | S3 | PIRACY | current sea hop's port-node embattlement phase 'embattled' (level ≥ 0.35) | the T3 twin VERBATIM — base 0.12 × level, same math, same captive-market captor rule (the embattled port's seat); the ONLY piracy-specific code is the display relabel (banditryModalityLabel({overSea}) — the navy §5 parity law: "piracy" lives in prose, never in the danger math) |
  T4 hostile reception applies at arrival regardless of modality (unchanged).
  NO army-collision checks on sea hops (armies do not hold sea edges); a
  navalTransit convoy-interception hazard is a DEFERRED SEAM (§15) pending navy
  hostility semantics — recorded, not smuggled in.
- KNOWN-VIEW COHERENCE: the roads known-world overlay is node-keyed ⇒ believed
  embattlement over port nodes (S3's input) works UNCHANGED. Believed BLOCKADES:
  v1 reads blockades from TRUTH in hazard evaluation (all hazard rolls read truth
  — roads law 4 already says so) and from the KNOWN view only if blockade news
  already rides the rumor net (implementer verifies at re-survey; if not, the
  believed-blockade routing read is a recorded seam §15 — a poorly-informed court
  sails into a blockade it didn't know about, which is the KNOWN-vs-TRUE law
  working as intended, not a gap).
- NO new purposes, no new cadence, no new selection: sea legs EMERGE from route
  choice; a maritime realm's envoys sail because the graph says the sea is the
  road. The commission's "opens roads to maritime realms" is delivered by
  modality-honest hazards, not by a parallel mission system.
- WRITES ⇒ ONLY: the roads ledger (legModes at mint; delay stamps; the same
  ransom/mission writes as land) · newsEntries (sea-flavored pools —
  `src/data/seaRoadsProse.js`: "taken off the Gullwater by the blockade of…",
  storm-delay texture) · NOTHING ELSE. (No naval state is ever written — roads
  READ blockades, never mint them.)
- RNG: `roads-sea:storm:${missionId}:${tick}` · S1/S3 ride the existing
  `roads-hazard:${missionId}:${tick}` fork (one hazard resolution per mission
  per tick — the no-double-jeopardy law holds across modalities).
- LIFECYCLE: additive MissionRec field (law 12); legacy in-flight missions
  (pre-D-6 saves) read all-land and finish untouched (pinned); undo atomic.
- COMMITS: D-6a legModes + classification + currentLegMode + legacy-tolerance
  pin · D-6b S1-S3 branch + matrix fixtures (every sea cell exercised, forced
  fixtures for the rare ones) + roster-conservation + no-double-jeopardy pin ·
  D-6c prose/news + the status-quo dormancy golden (seaRoadsDormancy vs the
  folded-roads baseline) + anti-vacuity (a maritime fixture realm shows sea
  journeys of ≥2 purposes, ≥1 sea capture, ≥1 storm delay, byte-dark twin).
- GATES: focused + roads goldens (re-based) + naval goldens untouched.
  DONE-WHEN: the lit maritime walkthrough executes; dark twin byte-identical
  against folded-roads; navalEnabled-dark ⇒ S1 unreachable, S2/S3 still live
  (blockades need the navy; weather and pirates do not — gating pinned).

## §10.5 D-7 — THE MEMORY WEAVE (relationship-memory cohesion + the positive-bond symmetry + the elite bleed; pre-fold machinery; flag: `memoryWeaveEnabled`)
The organic plane (§2's relationship-memory receipts) is ALREADY cohesive —
one writer, typed decaying incidents, tuned decay, D5 bands. This slice does
NOT rebuild anything; it closes the four bounded gaps the recon verified, so
the contested-goals/tunnel-vision substrate is "cohesive like everything else."
- D-7a READ-THE-SUBSTRATE (highest value, lowest risk; before D-4b): a shared
  pure read leaf `src/domain/worldPulse/grievanceRead.js` cloning the
  warReasons.scoreGrievance (:425) + scoreRevanchism (:443) template — scoring
  a pair's edge from `resentment` + `memoryScore` + typed `recentIncidents`
  (the decade clock), NEVER the coarse 10-value rung. Consumers: D-4's
  fixation grievanceLean term + contest-salience weighting. Zero writes; zero
  flag (a pure read is dormancy-neutral); unit-tested against fixture edges.
- D-7b WIRE THE GHOST EVENTS (through the ONE writer — law 13's applicator
  clause; both writes are typed incidents that DECAY, reusing recentIncidents +
  revanchism typing; additive, deterministic):
  * ROUTE CAPTURE: spatialConsequenceKernel.js (today: zero relationship
    writes) calls applyRelationshipPatch with a typed `route_seized` incident
    (seizer ↔ victim edge) at its existing capture-consequence site — a seizure
    finally leaves a decaying grievance mark.
  * RITE IMPOSITION: the traditions imposition pass (traditions/relations.js
    today writes worldState.occupations, never relationshipStates) adds the
    twin `rite_imposed` incident (overlord ↔ imposed-upon edge).
  * CONTEST LOSS: D-4c's typed-incident write (§8 aftermath) — specified there,
    listed here for the loop-closure ledger: loss → grievance → future fixation.
  GATING HONESTY: each ghost wiring changes LIT behavior of its host system
  (new incidents on lit-spatial-consequence / lit-traditions worlds) — each is
  therefore gated on ITS host's flag PLUS `contestedGoalsEnabled`-independent
  own gate `memoryWeaveEnabled` (virtual, the eighth flag), so existing lit
  campaigns stay byte-identical until the owner lights it (the D-1c
  coupling-gating judgment, applied identically). Dormancy golden:
  memoryWeaveDormancy (lit-spatial + lit-traditions fixture, flag absent ⇒
  byte-identical).
- D-7c THE FACTION-PAIR LEDGER — SYMMETRIC (OWNER-COMMISSIONED 2026-07-19, the
  positive-bond ruling; the shape remains owner-VISIBLE, §14 Q10 records the
  sign-off): a pairwise sub-record carrying BOTH signs — resentment AND
  alliance/trust — plus typed incidents (≤8, decaying), as a SIBLING of the
  settlement plane nested under the existing factionStates surface, reusing the
  relaxFactionStates / D5-band decay machinery (factionCompetition.js:280) so
  the decay physics are inherited for both signs, not invented. THE COALITION
  COUPLING (recon-first — the §2 anchor set; the implementer completes the
  census before writing): (i) FED BY — coalition betrayal/desertion (the
  EXISTING typed 'coalition_betrayal' event, peaceTerms.js:1188-1206) DAMAGES
  the pair's trust and feeds its resentment (consume the same event the
  settlement plane already consumes — one event, two planes, each through its
  own writer); standing together in a war coalition (the convergence layer's
  formation/membership state) BUILDS trust on a slow accrual per shared-war
  year; (ii) FEEDS — alliance FORMATION and DURABILITY reads bias on the
  pair's trust (the coalition-formation seam consumes the ledger through its
  own gates — deposit-and-consume, never a D-7 write into war state).
  Consumers: cross-faction contest salience + fixation and the D-4 join/support
  weights (§8), alliance formation/durability, future faction-politics reads.
- D-7d (recorded rider, not a build): the incident half-life D5-band scaling
  deferral (relationshipMemory.js:13-22) — if ANY D-7 work touches
  relationshipMemoryWeight's call sites, thread the ready {halfLifeTicks,
  maxLookbackTicks} options per the file's own note; otherwise leave the
  deferral recorded as-is. Never silently re-find it.
- D-7e PERSON-BOND SYMMETRY (the positive-bond ruling's person half): the
  ladder-grudge structure gains its TWIN — LadderStanding gains
  `bonds: Record<string, LadderBond>` keyed by the other npcId, LadderBond =
  {sev, week, kind} with kind ∈ {loyalty, gratitude, friendship} — SAME
  build/decay mechanics as grudges (D5-band half-life; additive stacking;
  bounded cap), same single writer (the ladder kernel), same DELIBERATE
  SUCCESSION RESET (a bond dies with the standing record — the
  DESIGN_SIM_DEPTH_R2.md:170 state-never-fate doctrine; NEVER a parallel
  NPC-pair graph). FORMATION EVENTS (each a deposit the ladder pass consumes,
  or a write inside its own pass): sustained cooperation (same
  bloc/governingCoalition membership across ≥2 consecutive years — the
  beliefMap.js:747 read) · shared cause (same war-coalition side, per shared
  year) · being RESCUED or RANSOMED by someone (the D-5 friendship/succor
  payer and the roads rescue/ransom party ops deposit a gratitude event toward
  the payer settlement's ruling-seat NPC) · being SUPPORTED in a contest (a
  D-4 joiner/backer or a completed D-4f support goal — both directions).
  THE GENEROSITY LOOP (the "flow into everything" clause, both directions):
  (i) READ — generosityEV gains a bounded BOND term on the give side (the
  courts' seated notables' bonds + the D-7c pair trust), biasing WHO receives
  mercy; (ii) WRITE — a completed generosity act deposits a cooperation/
  gratitude event (consumed by the ladder pass into bonds, beside the
  obligations ledger entry the act already mints — obligation is the DEBT,
  the bond is the FRIENDSHIP; they decay on different clocks and that
  difference is the drama). ⚠ generosityKernel 800/800: the bond term rides
  generosityEV/leaf per D-3's net-zero discipline.
- D-7f THE ELITE BLEED (the final owner clause, 2026-07-19 — cross-settlement
  NPC relationships ↔ settlement diplomacy, bidirectional, influence-weighted;
  after this the design is CLOSED): NPC-level competition, goals, and
  relationships EXTEND BETWEEN SETTLEMENTS, flavored by and shaping the
  settlement↔settlement relationship, weighted by WHO the NPCs are.
  * CROSS-BORDER MARKS: the D-7e bonds map and the grudges map MAY carry
    FOREIGN counterpart keys — each mark gains optional {foreignSid} (each
    side's ladder kernel writes only its OWN NPC's record on its own pass,
    both consuming the same shared contact event — symmetric by construction,
    no cross-writer). Prune tolerates foreign counterparts (the roster scan
    consults foreignSid). FORMATION VECTORS are the roads contact events —
    embassies, ransoms (a D-5 friend-payer's gratitude), visits, verification
    journeys, cross-border contest outcomes — so PRE-FOLD worlds hold zero
    cross-border marks and this machinery idles vacuously; it LIVES when the
    post-fold slices land (sequencing stated in §3).
  * DOWNWARD (flavor): the settlement-pair rung/scalars BIAS cross-border pair
    disposition — a dispositionOf read (the grievanceRead leaf extended)
    multiplies formation events: hostile pairs dampen bond formation and
    amplify grudge formation (suspicion), trade-partner pairs ease merchant
    bonds; contest-entry/discovery draws for cross-border rivals read the same
    bias.
  * UPWARD (shape — the bleed): personal elite relations BECOME interstate
    relations, weighted:
    `weight = importanceWeight(npc) × factionPowerStanding01 × politicsRank01`
    (the governing faction's pillar ≫ a marginal faction's notable; BOTH NPCs
    must be ≥ notable AND weight ≥ ELITE_BLEED_FLOOR or the pair contributes
    NOTHING — two feuding nobodies are noise by law). The bleed is computed
    INSIDE the relationship plane's OWN pass (relationshipEvolution — the
    plane's writer reads the ladder ledgers read-only and applies its own
    bounded term; ZERO new writers anywhere): a slow scalar nudge from the
    pair's CURRENT accumulated bond/grudge standing, capped per settlement
    pair per tick (ELITE_BLEED_CAP), decaying like everything else; a typed
    incident (elite_feud / elite_amity) mints ONLY on significance-threshold
    CROSSINGS (a state transition is an event; a persisting state is not).
  * ⚠ THE DOUBLE-COUNTING GUARD (law-shaped, pinned): EVENTS mark the plane
    they occur on, exactly as today — an embassy detention marks the
    settlement pair directly (roads' existing write) and the NPC pair via its
    contact mark, ONCE EACH; the BLEED carries only accumulated NPC-pair
    STANDING and never re-counts events. One event, one mark per plane; the
    bleed is state-driven, not event-driven. Fixture-pinned: a single
    detention produces exactly one settlement-plane incident and one NPC mark,
    and the subsequent bleed delta is bounded by the standing term alone.
  * CROSS-SETTLEMENT CONTESTS INHERIT THE CHANNEL: contest GENESIS across
    borders stays a vNext seam (§15 — the collision physics are
    settlement-scoped), but any future cross-border contest's outcome marks
    the NPC pair and bleeds through THIS channel — no separate pathway will
    ever be built (recorded as the channel's contract).
- WRITES ⇒ ONLY: typed incidents via applyRelationshipPatch (the applicator —
  the plane's own writer does the writing) · the D-7c symmetric sub-records
  via the factionStates surface's own relax pass · person bonds via the
  LADDER's own writer (the bonds map — its list already amended in §8) ·
  generosity's own deposit records · NOTHING ELSE.
- COMMITS: D-7a read leaf + tests · D-7b the two ghost wirings + typed-incident
  vocabulary + dormancy golden + lit anti-vacuity (a seizure/imposition leaves
  a mark that DECAYS on the decade clock, executed) · D-7c symmetric schema +
  decay reuse + the coalition census + betrayal-damages / standing-together-
  builds / formation-bias wirings + pins · D-7e the bonds map + formation
  events + the generosity loop (read term + deposit) + succession-reset pin +
  its dormancy variant · D-7f the foreignSid marks + dispositionOf bias + the
  bleed term in the plane's own pass + the threshold/cap/crossing-incident
  machinery + the double-counting pin (machinery pre-fold; its lit walkthrough
  runs on the POST-FOLD lane when roads contacts exist — stated, not slipped).
  GATES: focused + the relationship-plane golden set untouched + dormancy.
  DONE-WHEN: a lit run shows route_seized/rite_imposed incidents minted through
  the one writer, decaying, and READ by revanchism/fixation; a coalition
  betrayal decays the faction-pair bond (executed); a generosity act mints
  obligation AND bond on their separate clocks; the D-7f guard pin green (one
  event, one mark per plane); dark twin byte-identical; memoryWeave-dark ⇒
  zero bonds keys anywhere (contract).

## §11 COHERENCE MATRIX (reads → / writes ⇒, per slice — the review greps each lane's diff against its row)
| slice | READS | WRITES ⇒ ONLY |
|---|---|---|
| D-0 | migration ledger (due + in-flight columns, pre-drain — the traditions §9 read precedent) · trade graph paths | rumorLedgers via advanceRumorLedgers' own pass (carrier inputs only) |
| D-1 | populationHistory · traditions mirror · rumor arrivals · beliefMaps | beliefMaps via advanceBeliefMaps (axis fields) · traditions newsEntries (the two D-1c beat edits, traditions' own writer, beliefAxes-gated) |
| D-2 | DisinfoRecords · roster (mouthpiece draw, prune) · exposure events | spatialLedgers.npcCredibility · DisinfoRecord.spokespersonNpcId (own seed site) · newsEntries; (ladder stigma = the LADDER's write, via consumption) |
| D-3 | beliefs (triggers) · bonds/obligations · trade edges · credibility stocks | generosity mints/ledger (gift, consideration) · statecraft ledgers (injection, intelTrades, credibility deltas) · newsEntries |
| D-4 | goals · causal frame (read-only) · roster · faction keys (canonical .faction — post-14e8a2fa) · LadderStanding.grudges + relationshipMemory grievance/warmth + personality (the tunnel-vision reads) | spatialLedgers.npcLadder incl. contests (the ladder kernel, own list amended) · standing/stings/grudges/windows via its own writers · bluff-exposure deposit (consumed by D-2) · newsEntries |
| D-5 | RansomRec · relationships/war state · generosity qualification + obligations (read) · CORRUPTIBLE_FLAWS via conversionFlawFactor · seat archetypes | roads ledger (RansomRec fields, ransomSettlements deposits, payer-beneficiary channel record) · legitimacy/prosperity via existing applicators (redirected) · newsEntries |
| D-6 | seaLanes digest slot · activeBlockadeTargets · embattlement (port nodes) · season | roads ledger (legModes, delays, standard mission/ransom writes) · newsEntries |
| D-7 | relationshipStates edges (resentment/memoryScore/recentIncidents + rung/scalars for dispositionOf — the grievanceRead leaf) · capture/imposition events in their host passes · coalition state (peaceTerms betrayal events, convergence membership, governingCoalition) · ladder bond/grudge maps READ-ONLY for the bleed (inside the plane's own pass) | typed incidents via applyRelationshipPatch ONLY (the applicator) · D-7c symmetric faction-pair sub-records via the factionStates relax surface · D-7e person bonds via the LADDER's own writer · the D-7f bleed term + crossing incidents inside relationshipEvolution's OWN pass (zero new writers) |
NOTHING ELSE, in any row. Cross-system state moves ONLY by deposit-and-consume
(law 5): D-2→ladder (stigma) · D-3 generosity↔statecraft (transfer record) ·
D-4→D-2 (bluff exposure) · D-5→generosity (obligation) · D-5→web (channel).

## §12 SLICES — LANES, COMMITS, GATES (consolidated; per-slice detail in §4-§10)
Lanes: pre-fold slices ride ONE lane `claude/deep-couplings` off the composite
(D-0 → D-1 → D-2 → D-3 → D-4 with D-7a/b woven per §3's order, lettered commits
as specified per slice; D-7c only on the Q10 sign-off); post-fold
slices ride `claude/deep-couplings-roads` off the post-fold tip (D-5 → D-6).
Opus implementer; every JUDGMENT labeled vetoable in slice reports; git: stage
explicit files only, `git stash` FORBIDDEN in agent lanes; focused gates per
commit + the FULL suite at each lane end (the focused-gates blind spot is proven —
owner memory; resto2-style flake isolation: diff isolation runs, never raw
failing sets). Every slice gate quotes: the closure number (budget 1,040,000 —
context: the composite breach memo; this wave adds ≤300 B eager, D-4e only),
the dormancy hash result, and the effective-line count of every touched
ceiling-adjacent file (beliefMap / informationStatecraft / generosityKernel /
generosityEV / rumorNetwork — measured, not assumed).

## §13 VERIFICATION CHARTER
- DORMANCY, EIGHT TIMES: one golden per flag (law 2's three-block shape), each on
  a fixture world shaped to tempt it (war-shaped spatial for D-0/D-5/D-6;
  lit-traditions for D-1; lit-ladder for D-2/D-4; multi-ally famine for D-3;
  lit-spatial-consequence + lit-traditions for D-7b). Interplay variants pinned:
  D-2 ladder-dark · D-5 web-dark · D-6 naval-dark · D-1 without D-0 (cultural
  feeder alone) · D-4 with D-7c absent (graceful degradation).
- THE LIT WALKTHROUGHS (the roads §19 executed-run pattern; one per
  behavior-shifting piece, quoted output, mandatory before each lane closes):
  * D-0/D-1: a 6-year lit spatial run — a war-flight column relays + seeds; a
    3-hop observer forms a WRONG demographic belief from stale arrivals; a
    rededication propagates and a silent rival stays stale until the beat lands.
  * D-2/D-3: a 10-year lit run — a seeded lie's mouthpiece exposed → personal
    discount + stigma + window; a warning-gift proves out (obligation + gratitude
    + credibility rise); a bad sale charges the seller; acts-per-year stays in
    the anti-hum band (INTEL_ACTS_PER_YEAR_CAP respected, zero acts in any tick
    without a trigger event — the spammerless proof).
  * D-4: a 12-year lit-ladder run — an unknowing convergent race, a discovery, a
    bluff, a forestalled loser with grudge, an opposed contest lost with the
    window opening and a challenge firing through it; rung conservation asserted
    every tick. THE TUNNEL-VISION A/B: a vengeful-with-grudge contestant and a
    pragmatic no-history twin against the same rival at the same odds — the
    fixated one attempts through the window at odds the pragmatic one declines,
    loses more often, and deepens the grudge WITHIN its cap (the convergence
    pin, executed).
  * D-5: capture → half-term scan → all three terminal outcomes across fixtures
    (refused/debt/compromised) + captor-precedence; the obligation lands via
    generosity's own next-tick pass.
  * D-7 (the memory-weave cells, owner-named): a patron falls → his client's
    linked support goal cascades to failure the same tick; a coalition betrayal
    decays the faction-pair bond; a friend ransoms a friend → DEBT not
    compromise, and the gratitude bond forms toward the payer's seat. THE
    ELITE-BLEED A/B (post-fold lane): a high-influence cross-border feud
    (governing-faction pillar vs the neighbor's chancellor) measurably cools
    the two settlements' relations; a low-influence feud leaves NO settlement
    mark (the threshold pin); an elite bond formed by a friend's ransom
    measurably warms them; the double-counting pin (one detention ⇒ exactly
    one mark per plane) green.
  * D-6: the maritime fixture walkthrough (D-6c) + a mixed land-sea mission
    hitting a land hazard on a land hop and a sea hazard on a sea hop in one
    journey (the modality-dispatch proof).
- CATCH-UP EQUIVALENCE: a 26-week collapsed catch-up ≡ 26 serial advances (state
  hash equality) for each lit system — the cadence draws (D-3 yearly, D-5
  half-term) are tick-invariant by construction; proven, not assumed.
- THE NO-DEATH ADVERSARIAL PASS (a dedicated skeptic pass per lane; findings are
  defects): source-scan for removal/termination branches reachable from any new
  path; the roster-conservation assert across every D-4/D-5/D-6 fixture; the
  refusal cell explicitly re-entered (refused captive later ransomed home
  normally); the D-2/D-4 stigma paths shown to leave the NPC alive, seated or
  unseated but never gone.
- DETERMINISM: two identical lit runs hash-equal per system (the anti-vacuity
  block's second half); fork-label list per slice frozen in the lane report
  (renames are golden-breaking — law 6).
- SOAK BANDS (certification, not assumption): intel acts ≤ cap and > 0 across a
  30-year everything-on soak (story tempo, no hum) · contests 0.2-1.5 per
  settlement-decade, ≥60% discovered before resolution · third-party offers on
  10-40% of ransoms with refusal/debt/compromised in plausible proportion to the
  §9.1 matrix · sea-hazard incidence ordering S1 > S3 > (S2 delays) on blockaded
  vs embattled vs stormy fixtures · belief-axis divergence: believed trend/rite
  wrong in 10-40% of observer-pairs under 'unreliable' infoMode (fog is real),
  ~0% under omniscient.
- THE SECRETS SEAM: no new share surface is created; new DM-facing texture
  (contest awareness, credibility stocks, payer motives) rides existing dossier/
  brief laws; the publicSafe allowlists are NOT extended (fail-closed — nothing
  new ships to shared payloads; asserted by the existing contract tests staying
  green with zero allowlist additions).

## §14 OPEN QUESTIONS (owner-gated; each ships with a recommendation and a safe default that requires no answer to build)
1. THE ONE REGEN membership for all eight flags. REC: the pre-fold six join the
   lit-flag batch with the other engine lifts; D-5/D-6 join whenever roads'
   own flag does. DEFAULT BUILT: all dark.
2. ⚠ OWNER-VISIBLE — the additive record fields (BeliefRecord +2, RansomRec +3,
   MissionRec +1, DisinfoRecord +1, LadderStanding.contests nest). All additive,
   no migration (law 12), but they are persistence-shape changes. REC: as
   specified. DEFAULT: as specified; renaming before each lane closes is free,
   after is a migration.
3. Belief-axis ACTING consumers (war/migration/dispatch reading believed decline
   or believed rites — the step that makes fog change history). REC: commission
   as a follow-on after a soak of the read-side (the beliefs×upswing precedent).
   DEFAULT: read-side only.
4. D-3 sale consideration = favor-economy only (obligations moved, no coin).
   REC: ratify; revisit when NUMERIC_PRICES matures. DEFAULT: as designed.
5. Edit-kind name `champion-npc` (D-4e). REC: as named. DEFAULT: as named.
6. D-4 tuning (FORESTALLED_MULT 0.25 · STING_STAND · WINDOW_SEASON_WEEKS 13 ·
   BACKED_MARGIN 0.15 · the tunnel-vision weights and FIXATION_RATE_GAIN) and
   D-5 matrix constants (§9.1). REC: as specified, soak-certified. DEFAULT: as
   specified.
7. D-1c's coupling-gated traditions beats (news volume changes only when
   beliefAxesEnabled lights). REC: ratify the gating judgment. DEFAULT: gated.
8. The TIER-BLIND convention has NO automated ratchet (recon finding §1 law 10).
   REC: commission a one-line structural test (grep src/domain for entitlement/
   tier reads) as a free-slot hardening — outside this wave's scope. DEFAULT:
   convention only, unchanged.
9. D-5 payer-scan reach (any qualifying settlement vs trade-graph ≤2 hops of the
   captor). REC: relationship-qualified with no distance cap (favor economies
   span realms; the EV already prices attention). DEFAULT: no distance cap.
10. D-7c THE FACTION-PAIR LEDGER — RESOLVED: OWNER-COMMISSIONED 2026-07-19 (the
   positive-bond ruling un-gated it and made it SYMMETRIC — resentment AND
   alliance/trust). Recorded here because it remains the wave's one genuinely
   new persistence SHAPE (owner-VISIBLE per law; everything else is additive
   fields/sub-ledgers under law 12): pairwise sub-records under the
   factionStates surface, D5-band decay reused from factionCompetition.js:280.
   Reshaping before the lane closes is free; after, a migration.

## §15 DEFERRED SEAMS (recorded, never silent)
The DM intel verb (world-scoped op surface — the statecraft §6 manual-twin
promise) · numeric-coin intel pricing (NUMERIC_PRICES) · belief-axis acting
consumers (Q3) · NPC-grain belief ledgers (contest fog stays per-contest) ·
cross-settlement contested goals · natural-opposite signal pairs (law_order ↔
criminal_opportunity, pending causal cross-term recon) · contest chains (the
grudge feeding the next contest's genesis weight) · multi-payer ransom auctions ·
believed-blockade routing (if blockade news is absent from the rumor net at
re-survey) · navalTransit convoy-interception as a sea hazard · sea-leg rendering
on the Travelers Overlay (roads §13's sub-layer learns legModes) · a credibility
line on the NPC dossier card (display lane) · the incident-memory half-life
D5-band scaling (relationshipMemory.js:13-22 — "the wiring point is ready";
D-7d's rider governs) · cross-settlement contest GENESIS (vNext by the freeze —
the outcome channel is D-7f's and is already contracted; only the collision
physics remain) · bond kinds beyond {loyalty, gratitude, friendship} (extension
of the typed map only — never a parallel graph). THE FREEZE: the owner closed
this design 2026-07-19 after the elite-bleed clause — further ideas go to
vNext, recorded here, never absorbed silently.

## §16 RECON HAZARDS BOUND INTO THE BRIEFS (fire = defect)
Roads/ladder anchors surveyed on MOVING branches (99084183 / 14e8a2fa) — re-grep
every cited line at fold, trust shapes not numbers · effective-line ceilings are
skipBlank+skipComments (a comment is free, code is not); generosityKernel 800/800
(NET-ZERO or leaf), pulseKernel/npcAgency FROZEN baselines (name-swap only) ·
adding any flag to DEFAULT_SIMULATION_RULES serializes it and moves goldens ·
fork-label renames break goldens (prng.js:65; the pulseKernel :898-906 INVARIANT) ·
additive spatialLedgers keys need NO migration (worldState.js:167-171) — do not
add one · new local clamp/clamp01 defs trip clampPrimitiveBaseline — import from
src/kernel/math.js · never name the relationship-compatibility module in comments
(the bare-string consumer guard greps JSDoc too) · eventProse canonical-at-zero +
no calamity substrings (F24: python byte-count check for NUL evasion) · migration
ledger due columns read PRE-DRAIN (the traditions §9 ordering) · faction key =
`.faction` never `.name` (the-ladder fix 14e8a2fa is the D-4 gate) ·
traditionBeat scores sit BELOW the rumor floor (60) — D-1c's carve is deliberate
and gated · worktrees silently test against MAIN node_modules (npm ci EUSAGE
walk-up) · never read a gate through `| tail` — run bare, check ITS exit code ·
`npm run build` before dist contracts · new src/domain files must not import the
store (FOUR ratchets) · the composite's ladder faction-key bug is LIVE (real
factions collapse to `fac.unknown` until 14e8a2fa folds — §2/§8; fold it first,
and never test contested goals against the unfixed key) · shared-record
determinism: settlement-wide genesis pass, canonical pair-ordered fork labels,
plan-then-apply writes (§8's four disciplines) · relationshipStates move ONLY
through applyRelationshipPatch (relationshipEvolution.js:283) — and beware the
name trap: traditions/relations.js writes OCCUPATIONS, not relationships, and
spatialConsequenceKernel.js writes no relationship state at all until D-7b ·
score pair history from resentment/memoryScore/typed incidents (the
scoreGrievance/scoreRevanchism clones), never the coarse rung · THE
DOUBLE-COUNTING GUARD (D-7f): events mark the plane they occur on ONCE; the
elite bleed carries accumulated STANDING only — any implementation that
re-counts an event into the settlement pair via the NPC bleed is a defect
(the one-event-one-mark-per-plane pin is mandatory) ·
resto2-style full-suite flake isolation at lane ends ·
stage explicit files only; `git stash` FORBIDDEN in agent lanes · the composite
closure budget is breached by 998 B pending the de-eager fold — quote the closure
number at every slice gate and never let this wave's ≤300 B become the excuse.
