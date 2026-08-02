# DESIGN — THE WAR RULINGS ARCHITECTURE (amendments A–R compiled for build)

## Fable 5 architecture, 2026-08-01. Compiled from the 29 owner rulings recorded in
## DESIGN_REALM_DIRECTIVES.md (amendments A through R + the three-causes ruling) into
## implementation-grade wave specs. IMPLEMENTATION IS ASSIGNED TO THE EXTERNAL
## IMPLEMENTER (owner order 2026-08-01: architecture and validation by Fable; all
## heavy coding by the external implementer). This document is self-contained: an
## implementer with zero session context and this document can build every wave.

**Status: ARCHITECTURE. Nothing here is scheduled until the owner sequences it against
the standing pipeline (soak redo + tuning are owner-held; see §9). The amendments this
compiles are OWNER RULINGS — binding design law. The judgment blocks in §6 are the
manager's rulings under delegation — vetoable here.**

**Reading order for the implementer:** this document top to bottom → the amendment texts
in DESIGN_REALM_DIRECTIVES.md Progress (the law behind every spec; where this document
and an amendment disagree, the amendment wins and the disagreement is a bug to report) →
DESIGN_PEACE_ENGINE.md (the negotiation substrate §WR-7 layers over) →
docs/GENERATION_CONTRACTS.md + the gate discipline in §10.

---

## §1 THE LAWS THAT BIND EVERY WAVE

### 1a Constitutional (the engine's standing laws — non-negotiable)
1. **Same-seed byte identity.** Same seed and inputs ⇒ byte-identical output, forever.
2. **Dormancy.** Every wave ships DARK behind a virtual flag (absent from
   DEFAULT_SIMULATION_RULES); dark ⇒ byte-identical by object identity where the house
   pattern applies, golden-pinned before wiring (capture the fence FIRST — the J1
   precedent).
3. **Seeded purity.** No Date.now, no Math.random, no locale reads, no Object-key
   iteration order on user data without codepoint sort, no Math.pow/exp/log in engine
   paths (the transcendental ratchet — `w * u` not `u ** (1/w)`; multiplication is
   correctly rounded, pow is not).
4. **Monotone ratchets.** Size baselines, any-cast baselines, first-paint budget
   (1,020,590 B) only shrink. New engine code is a lazy leaf. Zero new any-casts.
5. **Receipts carry enforcement.** Every news entry carries `id` (the id-less drop
   class silently voids entries at BOTH normalizeEntry and the audit sink), a full
   address chain, typed action, affected settlements BY NAME, and the recorded reason.
6. **Premium isolation + audience projection.** Free/anonymous surfaces never see DM
   truth; every new projection rides includeCovert/includeGroundTruth.
7. **Finite semantics.** Every vocabulary introduced here is CLOSED and banded; no
   float leaks to a surface; the AI (if ever adjacent) is a bucketing clerk.

### 1b Amendment-specific laws (each is an owner ruling; violations are design defects)
- **K3 — NOBODY IS EVER CURRENT:** no negotiation path (terms, vote, interceptor
  judgment, close-vote comparison, feasibility) may read true world state. Every read
  routes through belief machinery. STRUCTURAL ENFORCEMENT REQUIRED, not convention:
  the P4 no-hidden-governor pattern is the house idiom — pin the negotiation modules'
  import lists, scan their sources for true-state read tokens, and prove the same scan
  FINDS those tokens in a module that legitimately reads truth (guard-the-guard).
- **M — THE SPEED FLOOR:** no named person moves faster than ONE WEEK per route leg,
  ever, on any path (envoy, wanderer, exile, ransom demand bearer, DM-assigned NPC in
  transit). Mid-route positions are real places. STRUCTURAL ENFORCEMENT: one transit
  kernel is the single writer for named-person movement; a walker test asserts every
  movement site routes through it.
- **E3 — DISPOSITION IS A THRESHOLD, NEVER A SELECTOR:** no disposition read may pick
  a target, manufacture a grievance, or override a relationship. No ally exemption
  anywhere — the relationship IS the bar.
- **I — PAIRWISE ONLY:** no N-party treaty table, no congress, no multilateral
  negotiation object. The multi-party war is a graph of bilateral edges.
- **L — NO TIMERS, NO CLAMPS:** no war-length cap, no forced peace, no arbitration
  timer, no round limit. Convergence is endogenous or it is a tuning failure the soak
  must catch.
- **N — THE OVERWHELMING GATE / R — THE EXTREMITY GATE:** conquest and razing are RARE
  endings; their negative cases (clearly-winning-but-not-overwhelming must negotiate;
  victorious-but-not-extreme must not raze) pin hardest.
- **C2's foreign-file law:** `src/domain/worldPulse/momentum.js` is FOREIGN. Read it,
  consume its published exports, never edit it. Its export surface (verified
  2026-08-01) is sufficient: `commitmentStockOf`, `commitmentCoursesOf`,
  `cliffStockFor`, `pastCliff`, `abandonFloorScale`, `reconsiderationMultiplier`,
  `temperamentMomentumOf`, `faceSavingReliefOf`, `climbDownConsequence`. No new export
  is needed for the four-term read. If an implementer believes one is, STOP and report.

### 1c Recorded hazards that WILL bite these waves (each has bitten this program)
- **JSON-alias trap:** `factions[].members[]` ARE the `npcs[]` objects in memory; only
  serialization splits them. Every envoy/ransom/roster mutation test JSON-round-trips.
- **Writer/reader payload-spelling drift:** a writer wrote `settlement`, a reader read
  `snapshot` — undefined for the feature's whole life. Every new ledger gets a pin
  that boots the REAL writer and reads through the REAL reader.
- **Stream theft:** per-tick keyed rng forks hide theft; keys are per-entity
  (`envoy:<errandId>`, `disposition:<settlementId>`), draw-accounted per the wave-E
  instrument.
- **Vacuous absence pins:** a `toHaveLength(0)` against a harness that defaults the
  producing state to empty proves nothing — seed non-empty state first.
- **Unreachable predicate conjunctions:** every gate composed of ANDed predicates gets
  a reachability pin proving the TRUE branch fires in real generated corpora.
- **Authored NUL bytes:** use template literals in generated strings; controlBytes
  scans run per commit.
- **Id-less news drop:** every `newsEntries.push` site carries `id` — the walker
  exists; new kinds register in WHAT_PHRASES and heraldRouting or the totality walker
  reds.

---

## §2 SUBSTRATE CENSUS (verified against the tree 2026-08-01 by the Fable chair;
## re-verify anything you build on — live code outranks this table)

| Substrate | Where | State |
|---|---|---|
| Casus taxonomy: 13 war reasons + 14 peace mirrors, walker-enforced totality+bijection | `warReasons.js` (WAR_REASON_TYPES / PEACE_REASON_TYPES / REASON_MIRRORS) | BUILT incl. `opportunism` (predation) + `sacred_claim` (holy war) at HEAD 99e2d54f |
| Reasons are state-derived, decay-inherent, zero-RNG, per-pair directed ledger | `spatialLedgers.warReasons`, key `${from}>${to}` | BUILT — dissolution (amendment C) is structurally half-present already |
| Peace terms: budget/appraisal/draft/compliance/fraying, believed-advantage evaluator with injectable belief (`truthFor`) | `peaceTerms.js` (1,501 lines; TERM_CATALOG, believedAdvantage, appraiseLoserPortfolio, draftTerms, advanceTreaties…) | BUILT — the terms MATH the envoy program transports |
| Treaty enforcement: readiness cap, war block, occupation hold; tribute/reparations/restitution move real grain | `treatyEnforcement.js`, `treatyTransfer.js`, `warIntent.js` | BUILT + GATED (wave W1; landed in the WR-0 W1 commit) |
| Momentum: commitment stock, cliffs, face-saving exits, climb-downs | `momentum.js` | BUILT, FOREIGN (read-only law above) |
| NPC durable identity, facets, circulation, belief, transit, verdicts (jailed applies to any named soul), Wanderers register + DM verbs | H1–H4: `npcLedger*`, `npcCirculation*`, `npcVerdict*` | BUILT |
| Credibility ladder (confirmed/corroborated/reported/tavern_talk), fidelity, plant/contradict/expose triple, patronage | I1–I4: `brokerage*` | BUILT |
| Route ledger + genesis, three-class flows (goods/population/military), charter/decay/danger/bypass, hidden-path remnants, reputation race pinned | J1–J4: `routeNetwork*`, `armyTransit*` | BUILT |
| Institution status (operational/impaired/shell, cause-bound), magic regimes, disaster buffer, substitution | K1–K4 | BUILT |
| Demographics: rates, K_food, migration homeostat, plans, viability ladder, capability floor | P1–P4: `demographics*`, `populationDynamics.js` | BUILT (cure measured, soak-proof owner-held) |
| Sack arithmetic: conserved captured-vs-dead split, skeleton floor | `warDeployment.js` (SACK/FORAGE, flag warForageEnabled) | BUILT — amendment R's arithmetic seed |
| Satellite founding lineage (parent→child edges) | wave E | BUILT — amendment #2's substrate ("no dynasty system is invented") |
| Coalition reads: co-besiegers, coalition mode, fracture/abandonment | `peaceTerms.js` + war layer | BUILT (partial — WR-6 extends) |
| Belief maps, distance-priced news, rumor network | Wave A + spatial | BUILT |

**Substrate items the design-corpus review is verifying (block the dependent wave until
confirmed, per each amendment's own warning):** war history records OUTCOMES not merely
occurrences (blocks the disposition learner, amendment E); deity UNSEATING exists as a
real transition (blocks sacred_claim's dissolution condition, amendment C); settlement
alignment axes readable where amendment B weights motive; relationship-state extreme
bands (blocks R's gate). Each has a named fallback in its wave spec.

---

## §3 THE FLAG FAMILY + THE ONE SEAM RULING

Five new virtual flags (absent from DEFAULT_SIMULATION_RULES; lit only in
full_simulation at the owner-signed soak redo), plus one casus sub-flag:

| Flag | Gates | Wave |
|---|---|---|
| `warTerminationEnabled` | the four-term termination read (cause/continue/stop/momentum) + dissolution re-reads + cost-to-sue | WR-1 |
| `dispositionEnabled` | the disposition profile, its learner, its threshold reads, deity war-pressure | WR-2 |
| `lineageClaimEnabled` | the lineage_claim casus + kinship_bond mirror | WR-3 |
| `coalitionLedgerEnabled` | expenditure derivation, separate peace, coalition settlement + apportionment | WR-6 |
| `envoyDiplomacyEnabled` | the whole envoy program (errands, interception, ratification, ransom, compromised envoy) | WR-7 |
| `conquestDoctrineEnabled` | feasibility belief, intent gate, conquest end-state, the razing | WR-8 |
| `sovereigntyTradeEnabled` | the settlement market (amendment S): sale/swap/cession-for-peace of satellites and vassals | WR-10 |

**THE SEAM RULING (binding; the largest architectural decision in this document):**
the envoy program does NOT fork the peace engine — it replaces its TRANSPORT, never its
MATH. `peaceTerms.js` remains the single writer for offer/acceptance/budget/appraisal/
compliance. When `envoyDiplomacyEnabled` is DARK, the peace engine's abstract
negotiation (willingness crossing → bounded seeded rounds) stands exactly as built.
When LIT: a willingness crossing mints an ENVOY ERRAND instead of an instant round;
the SAME evaluators run at the moment of PARLAY, with each side's inputs sourced from
its OWN decayed picture (the envoy's mutated snapshot; the interceptor's
per-battle-updated view; the court's stale reports) through the `truthFor` injection
seam `believedAdvantage` already exposes. One evaluator, two transports. A second
terms evaluator anywhere is a design defect.

---

## §4 CANONICAL MODEL — new state, and it is deliberately small

Everything below is conditionally materialized (drop-when-empty at every level, zero
eager bytes, absent ⇒ byte-identical) and has exactly ONE writer module.

```
worldState.spatialLedgers.warIntents        — EXISTS after WR-0 (W1's ledger)

worldState.dispositions                     — WR-2, writer dispositionProfile.js
  { [settlementId]: { martial, mercantile, diplomatic, insular:
      { stock01: number, band: word } ,     // banded projection is what consumers read
    updatedTick } }
  // Learned from OUTCOME EVENTS only (war won/lost, treaty held/broke, trade
  // enriched, venture failed), decayed toward neutral on a generational
  // half-life band. Persisted because re-deriving from full history per tick is
  // O(history) — the ONE exception to never-store-a-derivable, disclosed here.

warRecord extensions (the existing war object) — WR-1/WR-6/WR-8, writers unchanged
  foundingCauses: [ { type, receipt, atTick } ]   // pinned at open, never rewritten
  terminationRead: receipt-only per pulse (NOT stored beyond the pulse record)
  joinLedger: [ { partyId, joinedTick, cause } ]  // WR-6: per-edge join anchors —
                                                  // the expenditure read derives
                                                  // FROM these anchors + existing
                                                  // engine records; no expenditure
                                                  // ledger is stored (I2's law:
                                                  // "no new accounting is invented")

worldState.envoyErrands                     — WR-7, writer envoyErrand.js
  [ { id, npcId,                            // durable H1 id; the person is real
      from, to, purpose,                    // sue | parlay | compromise | ransom_demand | return
      snapshot: { … banded excerpt … },     // §WR-7a — CLOSED shape, finite semantics
      termSheet: null | { … },              // acquired at parlay; per-envoy (K4)
      legs, positionRef,                    // armyTransit mid-route pattern
      departedTick, expectedReturnTick,     // K.7's inference window
      state } ]                             // travelling | intercepted | parlaying |
                                            // returning | held | lost | home
  // Cap: MAX_CONCURRENT_ENVOYS per settlement (band, default 2) — K4's scope bound.

ransom claims                               — WR-7d: ride the I2 reparations-claim
                                            // shape with a PERSON subject; no new
                                            // claim vocabulary.

feasibility, comparative costs, home front  — NEVER STORED. Pure belief-side
                                            // evaluators (WR-4/WR-8); receipts only.
```

**What is deliberately NOT modeled:** no treaty congress object, no negotiation
session state beyond the errand itself, no stored expenditure totals, no
"war momentum" duplicate (momentum.js owns it), no second demotion writer (R rides
popToTier), no new relationship vocabulary (R's gate reads existing axes).

---

## §5 THE WAVES (dependency order; each: one commit, focused gates per slice, full
## gate at wave end, ledger row; every wave DARK per §3)

### WR-0 — LAND THE DIRTY TREE (wave W1 + cartography TC-0/1/2)
**Scope:** commit the two frozen uncommitted programs, separated BY PATH (never
`git add -A`; explicit files only; the shared-index discipline: pathspec commits,
verify every staged hunk).
- **Commit 1 — cartography TC-0/1/2** (all 11 test files green, 154 tests, verified
  2026-08-01): the file list in HANDOFF_2026-08-01_PAUSE.md §2B. Before commit:
  regenerate compendium data if operationRegistry moved (`npm run gen:compendium-data`
  — diff must be exactly the new operations), and confirm the TC dormancy golden +
  mapTabShellLazy pins run green in isolation.
- **Commit 2 — wave W1 war joins** (file list in the handoff §2A). Pre-commit steps:
  (a) lock in the any-cast ratchet-DOWN: `node scripts/count-domain-any.mjs --update`
  (warDeployment.js 54→53 — debt SHRANK; the baseline must follow it down);
  (b) execute the golden adjudication ruling recorded in the Fable validation queue
  (see §WR-0b below); (c) full gate via `sh scripts/gate-tail.sh npm run check` —
  NEVER a bare pipe.
- **WR-0b THE GOLDEN ADJUDICATION — RULED 2026-08-01 (recorded in
  FABLE_VALIDATION_QUEUE.md):** the three drifts are a LEGITIMATE lit-path W1
  behavior shift; the re-record is AUTHORIZED. Evidence (executed, isolation
  worktree): the drifting configs run war+strategy LIT; momentum's own fenced layer
  remained a perfect no-op; the 99e2d54f base reproduces ALL SIX committed manifest
  hashes byte-exactly; every moved field traces to a declared W1 join and no
  undeclared field moved. Implementer executes: UPDATE_GOLDEN=1 per each test
  header (gate-absent capture for momentum), the field-level diff quoted in the
  header, same commit as W1. Also carried as a disclosed same-seed shift: a
  conquest no longer recalls a marching co-besieger (declared + pinned in W1).
**Acceptance:** both commits landed, gate exit 0, ledger rows written, the tree clean.

> **Progress — WR-0 complete, 2026-08-01.** Cartography TC-0/1/2 landed in
> `6e96e259`, followed by its strict-contract/generated-artifact repair in `0dcc3b9d`.
> W1 lands in this commit with the authorized belief-map and momentum re-records and the
> any-cast ratchet-down. Focused W1/certification/golden battery: 13 files, 172 passed.
> Final `sh scripts/gate-tail.sh npm run check`: exit 0 — 2,110 Vitest files,
> 22,361 tests passed, 54 skipped; production build green; dist verification 47 files,
> 364 tests passed. The only full-corpus timeout observed on the preceding attempt
> (`magicBufferIntegration` conjunction reachability) passed in isolation in 10.20s;
> the deterministic reds from that attempt were repaired before this green run.

### WR-0c — OPENER HARDENING (from the verified review register,
docs/COMPREHENSIVE_REVIEW_2026-08-01.md; all three CONFIRMED with executed proof;
all three PRE-EXISTING defects, not W1 regressions — W1 strictly improved this seam)
Own commit, after WR-0; changes lit-path behavior ⇒ disclosed shift discipline applies.
- **(1) The treaty war-block reaches the ONE opener:** evaluateWarLayer never
  consults treatyBlocksWar — a live honored non-aggression pact does not stop a war
  (no breach, no cost; every negotiated NAP is structurally worthless). Fix per the
  register sketch: drop pact-bound pairs at hostileTargetsOf (warIntent.js is a
  dependency-free leaf the opener already imports), and make deliberate breach a
  FIRST-CLASS receipted path (id-carrying beat, complianceState→defaulted,
  treaty_default casus against the breaker) — "breakable at cost," never silently
  ignored. Also: the chooser-side deploy weight must actually collapse at
  warReasonFactor=0 (a zero-scored pact-violating march is currently still
  softmax-samplable).
- **(2) The scored target IS the ordered target:** emitMove independently picks
  its deploy target (first out-muscled in codepoint order) while the score was
  computed against bestTargetId — the deposited order then waives the margin gate
  for a target the deliberation never evaluated. Unify (return bestTargetId from
  enumerateMoves; emit THAT), and pin the 3-hostile divergence case.
- **(3) The trade-war escalation routes through the one opener:** tradeWar.js
  mints a confirmed war_front directly — a costless, ageless siege with no
  deployment, no drain, no exhaustion, no SIEGE_MAX_AGE, one-army law bypassed.
  Fix: the escalation deposits a war INTENT (the W1 ledger — this is exactly what
  it is for) instead of minting a front; the opener then opens it with a real
  deployment, or refuses it through the same gates every war faces.
  ⚠️ CORRECTED 2026-08-01 (self-audit, before build): the deposited intent must
  NOT carry the CONQUEST_MARGIN waiver. That waiver exists because a REAL
  DELIBERATION superseded the heuristic pre-filter (warIntent.js's own
  rationale); a trade-war escalation is a grievance reflex, not a deliberation,
  so its intent orders WHOM only — targeting priority without gate relief — and
  every hard AND soft gate runs exactly as for an unordered candidate. Pin the
  negative: an escalation intent against a target failing CONQUEST_MARGIN does
  not open.

> **Progress — WR-0c complete, 2026-08-01.** The chooser and opener now share one
> treaty-eligibility read; a zero war factor removes deploy from the move space;
> deliberate repudiation is an exact-pair, approval-routed realm act that ends every
> live term, retains the broken treaty only through its original horizon, and feeds
> the existing treaty-default casus. The scored deploy target is the emitted and
> ordered target. Trade escalation now writes a canonical hostile relationship plus
> a directed intent, never a live front; reciprocal same-tick escalations cannot fork
> the relationship identity, and applied news addresses both courts. Focused WR-0c
> and adjacent-contract matrix: 23 files, 367 tests passed; domain-strict remains zero.
> The whole corpus cleared every deterministic check: 2,111 files passed, one skipped,
> 22,364 tests passed, 54 skipped. Its only two reds were unrelated 20-second load
> timeouts; `townScene3dLazy` passed alone (20 passed, 3 skipped) and
> `magicBufferIntegration` passed alone (8 passed). Production build is green (3,638
> modules; 311 static route documents). Dist verification cleared 45/47 files and
> 362/364 tests in parallel; its two town-scene timeouts passed under `VERIFY_DIST=1`
> alone (23/23 and 2/2). No golden was re-recorded, no flag was lit, and no soak ran.

### WR-1 — THE TERMINATION READ (amendments C, C2; flag `warTerminationEnabled`)
**Scope:** the four-term read — live cause vs cost-to-continue vs cost-to-stop,
all against momentum — plus per-cause dissolution.
- **New module `warTermination.js`** (pure; zero RNG — reads, not rolls; the
  warReasons discipline). Per active war edge per pulse, emits ONE receipt naming
  the four terms' bands and WHICH TERM IS DECIDING — the Herald's "why is this war
  still going?" answer (amendment C2's legibility demand).
- **Dissolution:** the reasons layer is already state-derived (decay inherent), so
  dissolution's substrate exists. NEW: (a) `foundingCauses` pinned on the war record
  at open (never rewritten); (b) the re-read compares founding causes against the
  live per-pair reasons — every founding cause absent from the live fold ⇒ the war
  is CAUSE-DISSOLVED, a named peace force feeding the existing willingness read
  through the cause's own mirror; (c) each of the three named dissolutions from
  amendment C is a pin: sacred_claim dies on patron unseating (SUBSTRATE CHECK:
  if deity unseating is not a real transition, the pin documents the dormant arm
  and the dissolution ships structurally ready — never invent a pantheon coup here);
  lineage_claim dies on satellite destruction/edge severance (lands with WR-3);
  opportunism dies when the victim stops being believed-weak or gains a patron.
- **Cost-to-stop (C2's third quantity, NEW):** concession price from the peace
  engine's own ladder (what the believed ratio says peace costs) + face (the
  climb-down consequence momentum.js already exports) + sunk cost (the WR-6
  expenditure read where lit; a banded settlement-local read where not).
- **Momentum as the fourth term:** consumed via `commitmentStockOf`/`cliffStockFor`/
  `pastCliff` — READ ONLY (§1b). The term resists change in BOTH directions.
- **Pins:** the four-way disagreement space reachable (dissolved cause + cost too
  high to stop ⇒ war outlives its reason; live cause + unbearable cost ⇒ suing with
  the reason standing) — both arms on real fixtures; dissolution totality (every
  WAR_REASON_TYPE names its dissolution read or is explicitly perpetual-until-resolved,
  a walker over the taxonomy); dormancy golden.
**Bands:** term weights, the deciding-term margin, sunk-cost fallback band.

### WR-2 — DISPOSITION (amendments E, E2, E3; flag `dispositionChannelsEnabled`)
**⚠️ CENSUS CORRECTION (2026-08-01, the review caught this volume's own gap): the
tree ALREADY carries a single-channel disposition substrate, LIT in
full_simulation — `disposition.js` (computeAggressiveness blending govBaseline +
NPC personality + win/loss history + deityTemper into war appetite),
`dispositionLedger.js` (`worldState.dispositionStats`: per-settlement
aggressiveness memory, wins/losses/signed score saturating ±12, fed by
warDeployment win/loss deltas via pulseKernel), flag `warDispositionEnabled`.
WR-2 therefore EXTENDS, never duplicates (J-WR-11):**
- **Extend `dispositionStats` into the four-channel shape** — ONE ledger, ONE
  writer (`dispositionLedger.js` stays the writer), migrating the existing
  single-channel aggressiveness score into the martial channel's history. Four
  closed channels {martial, mercantile, diplomatic, insular}; stock + banded
  projection; learned ONLY from outcome events (war won/lost, treaty held/broke,
  trade enriched, venture failed), decayed toward neutral on a generational
  half-life band. THE REVERSAL PIN is mandatory (no ratchet — amendment E's law).
- **Subordinate the legacy consumer:** when `dispositionChannelsEnabled` is lit,
  `disposition.js` consumes the martial channel and RETIRES its own win/loss
  history term (one honest read, never double-counted — if both ran, war appetite
  would double-count history: existing multiplier × new threshold factor). Dark,
  the legacy path is byte-identical. The flag is named
  `dispositionChannelsEnabled` precisely to avoid the `warDispositionEnabled`
  collision.
- **SUBSTRATE GATE — ANSWERED AFFIRMATIVELY:** amendment E's warning ("verify war
  history records outcomes, not merely occurrences") is satisfied by this exact
  machinery — dispositionStats already records wins and losses. The martial
  channel builds on it directly.
- **Application (E3's law):** dispositions modulate BARS — the strategy chooser's
  thresholds, the termination read's sue/decline appetite, the trade/mediation
  propensities. STRUCTURAL ENFORCEMENT: dispositionProfile exports only
  `thresholdFactorOf(settlement, channel)`-shaped reads; it never exposes a target
  list, never reads the relationship graph, and its import list is pinned (the P4
  no-hidden-governor pattern) so it CANNOT name a victim.
- **War-culture + deity pressure (amendment E), THE COMPILATION RULING (J-WR-2,
  vetoable):** E provisionally called war-culture "a fourteenth cause"; E3's later
  law ("never manufactures a grievance") outranks that framing. War-culture is
  built as the martial channel's threshold effect + an END TERM in WR-1's read
  (slow to sue / early to sue) — NOT as a per-pair casus record, so the
  walker's totality/bijection is untouched and no filler mirror is invented
  (exactly E2's "the bijection satisfied naturally"). Deity pressure is a separate
  additive threshold term reading the local pantheon's domains (war god ⇒ lower
  bar against ANYONE; harvest god ⇒ higher), same enforcement shape.
- **Pins:** two identical-config realms diverge over a century under different
  outcome histories (E2's payoff, the program's best property test); the reversal;
  the ally-bar law (a lowered threshold does not clear a strong friendly tie —
  ordinary case allies passed over, pressured case betrayal reachable and
  proportionally priced, BOTH arms); threshold-never-selector (the import pin).
**Bands:** per-channel learn rates, decay half-life, threshold factor caps (a
disposition COLOURS, never drowns — banded and capped per law 6).

### WR-3 — THE LINEAGE CLAIM (owner cause #2; flag `lineageClaimEnabled`)
**⚠️ SUBSTRATE GATE (2026-08-01 review finding, verified): wave E's satellites are
NOT digest-addressable war-capable settlements — they orbit a parent cosmetically,
die back to the parent, or converge into a hamlet; warReasons pairs key over digest
settlement ids. As-is, NO lineage edge joins two war-capable settlements and the
casus would be a vocabulary entry whose TRUE branch never fires (the
unreachable-predicate hazard class). THEREFORE WR-3 FIRST BUILDS THE SEAM: every
graduation of a satellite-lineage site into a real settlement (satellite→hamlet
convergence, wave-P plan-driven overflow foundings, remnant resettlement of a
satellite site) records a durable `parentRef` lineage edge on the CAMPAIGN-MEMBER
settlement. The casus reads THAT edge. An executed corpus probe proving the pair
reachable is part of the wave's acceptance, not an afterthought.**
- **New casus `lineage_claim` + mirror `kinship_bond`** in the taxonomy (the walker
  forces the pair). Reads wave E's parent→child founding lineage BOTH directions
  (parent reclaims what it seeded; the outgrown child claims the seat), scored by
  the lineage edge × the tier/population INVERSION (no inversion, no claim — a
  thriving parent has no quarrel with its modest steading). The mirror reads the
  SAME edge as bond (amendment A: one honest read, two signs — the opportunism↔
  hopelessness idiom exactly).
- **Dissolution (plugs into WR-1):** satellite destroyed or lineage edge severed.
- **Pins:** claim requires inversion (negative case: no claim between healthy
  parent/satellite pairs — the reachability discipline); bijection walker green
  without exemptions; dormancy.
**Bands:** inversion threshold, claim weight cap.

### WR-4 — COMPARATIVE COSTS + THE HOME FRONT (amendment F; rides
`warTerminationEnabled` — same flag, second slice)
- **New pure evaluator `warCosts.js`:** BELIEVED trajectory (three-way:
  losing/winning/even) from the belief-ratio TREND the peace engine already
  computes; forward-looking comparison (end-now vs end-later under the trajectory);
  the EVEN case returns a null comparison so every other force decides (F's stated
  feature — pin it: even ⇒ the deciding-term receipt never names trajectory).
- **The home front is a THIRD STREAM, READ never invented (F's critical rule):
  derived entirely from existing degradation — route decay (J), stores drawdown
  (foodStockpile), population/named-cast cost (P1/P1a), regime demotions +
  institution shells (K1/K2), trade partners lost. NO new war-tax parameter
  anywhere.** The stream must ACCELERATE with duration (amendment L force #1) —
  measured at the soak, not asserted.
- **Pins:** winning-abroad-losing-at-home reachable and receipted (F's explicit
  demand); mistaken-court reachable (believed trajectory wrong vs truth, and the
  receipt can say so post hoc); the even-case silence.
**Bands:** trajectory margin bands, home-front acceleration curve.

### WR-5 — THE TWO BOOKS + THE POLITICAL LOOP (amendments G, G2, H, D; rides
`warTerminationEnabled` — third slice, completes the flag's surface)
- **The ruler's books:** every WR-1/WR-4 read is performed BY the seat: a weighted
  combination of settlement-position and ruler-position objectives, the WEIGHT
  derived from the ruler's security/legitimacy/facets/alignment (amendment B).
  Both divergence shapes pinned: ruinous war continued for the seat; winning war
  ended against a rival's triumph. A compromised ruler optimizes the patron's
  books through the EXISTING covert seam (G's third-party books — no new state;
  the corruption web already knows the patron).
- **Declining has a price (G2):** refusal mints a grievance fact (hardens the
  other side through the existing reasons layer), extends the home-front drain
  by choice, and costs legitimacy + ally patience — all existing ledgers. A
  declined peace is a first-class news event with the address chain naming who
  offered, who refused, and whose books the refusal served where the receipt
  honestly knows. The two-yeses-one-no asymmetry needs NO code — it is the
  structure of bilateral acceptance — but the deadlock-dissolving refusal costs
  are pinned as genuinely accruing (no free refusals).
- **The coalition inside the walls (H):** a refused-or-signed peace against the
  powers' wishes feeds the EXISTING coup/faction-capture lane as an organizing
  grievance with the war decision named on the receipt. Both polarities pinned
  (war party overturns peacemaker; peace party overturns warmonger). A
  faction-installed successor INHERITS THE DECISION: the installing faction's
  demand rides the succession record so D's re-read must honour it (or the coup
  was pointless — the pin).
- **The re-read (D):** on ANY legitimate-power change (succession, coup, faction
  capture, H2 verdict removal, DM KILL/ASSIGN), the war's four terms re-read
  under the NEW ruler's character. THE MOMENTUM BREAK: the re-read applies a
  ruler-change discount to the momentum TERM in warTermination's read (momentum.js
  is never touched — the term is discounted at consumption, the sanctioned
  momentum-breaking event, receipted as such). Bidirectional pin: a successor
  repudiates OR escalates from the same state under different character.
- **The composition pin (amendment D's chain, the program's signature test):**
  corruption_exposed opens a war → H2 verdict removes the exposed officeholder →
  the successor holds no quarrel → the war dissolves. One fixture, five
  subsystems, all existing.
**Bands:** books-weight derivation bands, refusal-cost bands, re-read discount.

### WR-6 — THE COALITION GRAPH (amendments I, I2, I3, J; flag `coalitionLedgerEnabled`)
- **The load-bearing insight is already true:** the reasons layer is per-pair, so a
  multi-party war IS a graph of bilateral edges. This wave makes joining, spending,
  exiting, and settling first-class ON that graph — no war object gains a member
  list; membership is derived from the edges + alliance ties.
- **Joining:** an ally entering under alliance mints its OWN war edge whose
  foundingCauses = the alliance obligation (a casus record with its own mirror per
  the walker — J-WR-6 rules the pair `alliance_obligation` ↔ `obligation_discharged`,
  names vetoable) and its own dissolution: the originator's cause dissolved OR the
  alliance broken. The joinLedger anchor {partyId, joinedTick, cause} lands on the
  war record — the ONLY stored addition.
- **The expenditure read (I2):** pure derivation per party per war — stores drawn
  since joinTick (foodStockpile deltas), population + named cast spent (P1/P1a
  accounting), territory transferred, home-front degradation (WR-4's stream summed
  since join). NO STORED TOTALS (I2's own law: the bill is what the other engines
  already recorded). Feeds: the momentum term (sunk cost through the side door) and
  the REPARATIONS CLAIM — a demand with TWO possible debtors (the enemy, through
  that edge's peace terms; or the ally who called them, when the enemy cannot or
  will not pay).
- **The unpaid claim IS ingratitude_debt** (reason #10, already wired with its
  debt_forgiven mirror): war participation feeds the existing reframe substrate —
  a coalition that wins and does not settle up mints its own next war. The
  counterforce is settling honestly (debt_forgiven — a bond instead of a grudge).
  Both outcomes pinned, Herald names which ("they paid what they owed" / "they
  never paid").
- **The open ally decision (I3, the prohibition verbatim):** NO hard-wired rule in
  either direction — no "expenditure above X ⇒ continue", no "cause dissolved ⇒
  exit". The standing ally resolves through WR-1's four-term read under WR-2's
  temperament and WR-5's books. THE TEMPERAMENT-IS-LOAD-BEARING PIN: same
  expenditure, same dissolved cause, two tempers ⇒ two outcomes, or disposition is
  decoration.
- **Separate peace (I):** any member runs G/G2 on its own books and exits pairwise;
  the exit is a first-class Herald event feeding the relationship record as the
  grievance it is (or the prudence — the abandoned allies' read is THEIR character).
  The existing peel machinery (peaceTerms' fracturesAbandoning + the peace engine's
  §7 exit pricing) is the substrate — WR-6 wires it to the graph, never re-invents.
- **The coalition settlement (J):** collective liability, pairwise settlement —
  ONE aggregate the winners take, ONE apportionment among losers (capacity,
  culpability, field-loss, who-called-the-alliance — authored weights, banded),
  paid along ordinary pairwise edges via existing transfer physics. Winners divide
  spoils (bled/led/late — same shape). THE VERDICT ON EVERY ALLIANCE: got-vs-spent
  per member (the expenditure read) ⇒ ingratitude_debt or debt_forgiven — all four
  outcomes reachable (bound victors, tomorrow's war between winners, strengthened
  losers, shattered losers), all four pinned, apportionment written PERMANENTLY to
  relationship record + chronicle (J's compounding-history demand), and it feeds
  the WR-2 channels (a war that paid teaches; a war whose spoils were stolen
  teaches something else).
**Bands:** apportionment weights, adequacy-of-payment band, exit-cost weighting.
**Scope fence (I, verbatim law):** peace is negotiated PAIRWISE along edges. No
congress, no multilateral table, ever.

### WR-7 — THE ENVOY PROGRAM (amendments K, K2, K3, K4, M, O, Q; flag
`envoyDiplomacyEnabled`; four slices, each its own commit)

**WR-7a — THE ERRAND.** New module `envoyErrand.js` (ONE writer for
`worldState.envoyErrands`).
- A willingness crossing (the peace engine's existing trigger) mints an ERRAND: a
  named NPC (durable H1 id; chosen by the seat — see vetting in WR-7d) departs on
  the lived route network under the armyTransit mid-route pattern, ONE WEEK PER LEG
  MINIMUM (law M), grade-priced longer (J4 leg costs).
- **The snapshot (K.2):** a CLOSED banded excerpt frozen at departure — stores band,
  strength band, morale/exhaustion band, the founding-causes status, believed
  ratios at departure. From that moment it only MUTATES: slowly against rumors the
  envoy's position exposes them to (the existing distance-priced news machinery
  pointed at a moving position), never refreshed from truth (K3 structural
  enforcement: envoyErrand.js's import pin excludes every true-state module; the
  token scan proves it; the guard-the-guard arm proves the scan bites elsewhere).
- **Non-return (K.7):** `expectedReturnTick` from the leg plan; silence past the
  window mints the HOSTILITY INFERENCE as a belief write, receipted AS an inference
  ("no word has come from the mountain road; the court fears the worst") — and the
  pin: an envoy alive and travelling while home mourns them, war escalating on a
  false read. The jewel, pinned explicitly.
- **The return leg is mandatory (K.5):** terms bind NOTHING until carried home and
  told; the return is equally interceptable and a terms-bearing envoy is the richer
  target (interception weights band).
- **Speed-floor walker (law M):** lands in this slice — every named-person movement
  site (envoys, wanderers, exiles, ransom bearers, DM transit) routes through the
  one transit kernel; the walker asserts totality; the reputation-race pin extends:
  news still outruns people.

**WR-7b — INTERCEPTION + THE PARLAY.**
- Four interceptor kinds (K.3), all riding position co-location per tick: (a) the
  target's army ⇒ field parlay; (b) a third party wanting the war continued;
  (c) a coalition member of the target — who may PARLAY THEMSELVES if their own
  edge carries no live cause (peace entering through the unexpected door);
  (d) anyone with private goals: plant (I4's verb aimed at the snapshot), imprison
  (H2's jailed verdict on a foreign guest), or terms-shopping.
- **The interceptor's dilemma (K2.1):** carry-the-terms-home (abandon position —
  a real military cost through WR-4's comparative read + the commander's books)
  vs hold-the-mission. An occupied enemy settlement is a legal venue (the irony is
  allowed).
- **The parlay runs the peace engine's evaluators** (the §3 seam ruling): offer =
  believed-fair terms through `draftTerms`/`appraiseLoserPortfolio` with the
  parties' OWN pictures injected via `truthFor`; the interceptor's picture mutates
  per battle and per hall (K.4) — sourced from its column's own belief exposure,
  never truth.
- **Pins:** the field parlay's two differently-stale pictures produce terms neither
  court would have drafted (reachable, receipted); the K3 absurdity law — terms CAN
  be agreed for a town already fallen, a road already cut (NO sanity-check against
  reality anywhere; the pin proves an absurd term signs and the world discovers the
  mismatch as the next grievance).

**WR-7c — RATIFICATION + THE COMPROMISE ROUND.**
- **Two-level authority (K.6):** majority vote of the coalition's legitimate
  powers, AND the coalition may veto a member's own ruler (the ruler overruled
  from above as well as below — extends G and H outward). Each member votes on
  ITS OWN PICTURE (K4's law: no merged estimate anywhere; the prohibition is
  structural — no code path may average two envoy accounts).
- **Envoy testimony rides the credibility ladder (K4):** two agreeing envoys are
  corroborated; a lone account is reported; each envoy is a source with their own
  I2 credibility. THE RULER CHOOSES WHOM TO BELIEVE and the choice is character
  (G arriving unplanned): belief-selection receipted as a political act.
- **THE UNANIMOUS-IN-JUDGMENT, SPLIT-IN-FACT PIN (K4's best consequence):** every
  member wanting the same outcome and voting differently because each heard from
  its own envoy — one fixture, pinned explicitly.
- **The compromise round (K2.4):** a CLOSE vote (band) sends BOTH sides' envoys out
  simultaneously, war continuing throughout (no ceasefire exists in this model,
  anywhere); each failed round WIDENS both parties' acceptance bands (amendment L
  force #4 — the convergence guarantee, landing here, measured in WR-9). No round
  limit (law L) — the widening plus the home-front drain IS the terminator.
- **Per-envoy term-sheets (K4):** divergent sheets from different counterparties
  are competing offers before the vote; failure to choose IS the close-vote case.

**WR-7d — RANSOM + THE COMPROMISED ENVOY (O, Q).**
- **Captivity → ransom (O):** dwell-gated (band); the claim rides the I2
  reparations shape with a PERSON subject; demand and answer both TRAVEL (law M);
  the three K.7 shapes pinned (silence misread / demand corrects the false
  inference / demand intercepted so the misreading stands). Captor's choice
  (hold/ransom/release) and home's choice (pay/refuse/abandon) both run through
  character + books; an abandoned soul returns carrying the grievance PERSONALLY
  (H1 facets) — and may become the coalition that overturns the seat (H).
- **The ransomed soul returns carrying what captors let them believe** — the
  longest plant exposure in the model (I4 pointed at a held envoy), and the
  returning envoy is a TRUSTED source (K4). Pinned: a realm buys back its man and
  the lie that loses it the war.
- **The compromised envoy (Q):** a corruption-web-compromised NPC may VOLUNTEER
  for the errand. Two betrayals: terms favouring the true patron; the TRUE
  snapshot handed over (the one honest channel in the world — K.2 gives the envoy
  truth, K3 forbids everyone else from having it, so treachery transmits what
  loyalty cannot). Vetting is a seat decision (careful seats read loyalty/facets/
  associations; hurried seats take the volunteer — both pinned); SEND-TWO is
  counter-intelligence (divergent accounts of one parlay are the traitor's
  signature, caught by the corroboration ladder); exposure runs the covert→
  revealed seam ⇒ treason verdict (H2), terms-repudiation question (its own casus
  against a knowing buyer), G's third-party books applied to an envoy.
**Bands (WR-7 family):** MAX_CONCURRENT_ENVOYS (default 2), snapshot mutation rate,
interception base weights per kind, close-vote band, per-round widening step,
ransom dwell + price bands, vetting-quality derivation.

### WR-8 — CONQUEST + THE RAZING (amendments N, N2, N3, R, R2; flag
`conquestDoctrineEnabled`)
- **Feasibility (N2):** a pure BELIEF composite — believed relative strength,
  believed coalition reach, believed home-front reserves — never a truth read
  (K3 governs; same structural enforcement). Feeds four consumers: motive,
  movement (armies march on settlements when conquest is believed in reach — a
  campaign-shape change the receipts name), terms (the bargaining range: what I
  could take by force vs what I must give to survive — both ends beliefs, ranges
  may not overlap, and non-overlap IS the grind receipted), and the K.6 vote.
  ASYMMETRY BAND: believing you may BE conquered moves behaviour more than
  believing you might conquer (existential vs attractive).
- **Intent (N3):** capability never implies intent. The conquest-wanted read:
  disposition (WR-2 martial), own history, alignment, patron deity's nature, and
  the enemy's BELIEVED nature (the moral discriminator — a good realm presses
  conquest against believed evil, refuses it against the decent, and can be
  DECEIVED into the righteous atrocity via I4; pinned with the receipt naming
  what was believed and why). Mercy is a characterful receipt ("they could have
  taken everything and did not").
- **Conquest execution (N):** the OVERWHELMING gate (negative case pins hardest:
  clearly-winning-but-not-overwhelming still negotiates); physical and slow (law
  M — armies reach every settlement one leg at a time); occupation is NOT
  annexation (K1 siege_occupation, garrison cost, unrest, revolt standing);
  THE INHERITANCE COUNTERFORCE: the victor's K_food sums over what it now holds,
  the loser's ruined roads/unrest/enemies transfer — "a realm that conquers a
  dying neighbour has annexed a famine," derived entirely from existing engines.
- **The razing (R + R2, the full law in DESIGN_REALM_DIRECTIVES):** the third
  intent (PUNISH), evil-exclusive at initiation (hard alignment gate — the one
  place alignment is a boundary, not a weight); double gate (relationship extreme
  + won siege); deaths-not-departures (conserved `sack` cause class through §3
  demographics; small banded escape share as refugees; named cast disperses
  roaming — never engine-killed); tier demotion RIDES popToTier reading the new
  truth (never a second writer); institutions to damage-impairment/shell; the
  victor LEAVES (no occupation record — the departure is the receipt).
  THE VENGEANCE LICENSE (R2): minted to victim-adequate relationships on the
  razing, ONE per coalition, consumed once, mints no counter-license (the closed
  loop), COUPLED only when the holder's own relationship with the razer also
  reaches the extreme; the just razing is sanctioned-not-free (banded-down
  consequences, never zero for good actors — mercy stays a real choice).
  THE WORLD JUDGES on the observer's axis (monumental/lesser/recognition by
  observer alignment, settlements and deities both); deterrence priced BEFORE
  the act through the believed retaliation web; terror-works and terror-backfires
  both reachable per-neighbour.
- **Pins:** the overwhelming negative case; the extremity negative case
  (victorious-but-not-extreme cannot raze); the initiation gate (non-evil
  initiation structurally unreachable — walk the intent table); license coupling
  (license without own-extreme ⇒ no razing); the closed loop (vengeance mints no
  license); conservation through the sack arithmetic; demotion-follows-truth;
  dormancy goldens.
**Bands:** overwhelming threshold, extremity band, sack severity → 1-vs-2-tier
derivation, escape share, license adequacy band, license expiry (generational),
consequence bands by observer alignment, vengeance discount bands.

### WR-9 — CONVERGENCE INSTRUMENTATION (amendment L; no flag — this wave is
measurement, envelopes, and certification rows)
- **The war-duration distribution envelope:** tail and no infinity — most wars
  short, some long, a few generational, NONE alive at the soak's full horizon
  (a single year-300 war reds exactly as the trillion-person settlement did).
- **The endings mix:** {terms, exhaustion, ruler_change, fragmentation,
  annihilation, conquest, punitive_sack(initiation), punitive_sack(vengeance)}
  — each with a share envelope; one path carrying nearly all endings means the
  others are decoration (L's own criterion). Conquest share polices N's gate;
  sack shares police R's gate and R2's license economy (initiation-vs-vengeance
  ratio is a health metric).
- **The six forces audited:** home-front acceleration measured (force 1);
  capability collapse reachable (force 2, P4's floor); ruler-change frequency
  rising with war duration (force 3 — the self-accelerating loop, measured);
  round-over-round band widening monotone (force 4); fragmentation producing
  pairwise peaces (force 5); terminal resolution rare but present (force 6).
- Certification rows for every WR flag (the subsystem registry's Growth-lane
  discipline); v5 receipt fields for the termination read's deciding-term
  histogram (the Herald's "which force decided" at soak scale).
**This wave is the acceptance harness for the whole program: the program is DONE
when these envelopes hold on the owner-ordered soak redo, and not before.**

### WR-10 — THE SOVEREIGNTY MARKET (amendment S; flag `sovereigntyTradeEnabled`;
builds after WR-7 — cession-for-peace rides the envoy term-sheet)
- **The instrument:** a settlement trade IS a treaty. New term family
  `sovereignty_transfer` joins TERM_CATALOG (peaceTerms.js stays the single terms
  writer — the seam ruling extends here verbatim): the asset (a satellite or
  vassal edge) on one side, ANY composition of existing term families on the
  other — streams/stores (tribute physics reversed), trade rights (exclusivity /
  market access / toll exemption), allyship (alliance terms), another settlement
  (the swap), or peace itself (the cession rider carried proactively in an envoy
  term-sheet). One artifact, one compliance machinery, one document.
- **Eligibility:** only satellite edges (wave E lineage) and vassal edges (the
  occupation→vassalized ladder) are tradeable; sovereignty of a free settlement
  is not a commodity (it can only be lost through the war machinery). User-placed
  settlements obey the sovereign-hand law absolutely.
- **Valuation (K3 governs):** `appraiseSettlementAsset(assetId, appraiserId)` —
  a belief-side composite over the appraiser's OWN picture: believed tier +
  resources + route position + the DEMOGRAPHIC TRAJECTORY as the future
  projection (banded growth/decline read). The trade clears on believed-valuation
  OVERLAP (reserve under ceiling — the belief-convergence evaluator family).
  Structural K3 enforcement identical to the envoy modules (import pin + token
  scan + guard-the-guard).
- **The bundle (owner law):** consideration is a COMPOSED BUNDLE — the budget-and-
  stacking machinery run in reverse: the asset's believed value is the price to be
  met; the buyer stacks term families (a settlement + allyship + streams) until
  the seller's believed valuation of the bundle clears its reserve. Each side
  values each component through ITS OWN needs (the §15.1 prize-ranking lens, both
  directions) — appropriateness is EMERGENT from need-weighted valuation, never a
  rule table. Pin: the value-matching example (a higher-value settlement clears
  only against settlement+allyship, never against the lone settlement) on one
  fixture with both appraisals receipted; and the inappropriate-component case (a
  component the seller's needs value at ~zero contributes ~zero to clearing).
- **The geographic bound:** buyer must HOLD what it buys — lived-route
  reachability AND reinforcement reach within an army-transit leg band AND
  existing trade-flow connection. All three read from J4/spatial substrate;
  fail any ⇒ the trade is not offered (receipted absence is unnecessary — the
  bound shapes the candidate set, plan-lane style).
- **Transfer semantics:** the edge REWRITES (parent/overlord becomes the buyer);
  people do not move; the LINEAGE EDGE SURVIVES AS HISTORY (feeding WR-3's
  claim in both directions — reclaim and independence); the sold settlement
  mints a grievance + the new overlord starts low-legitimacy with revolt
  standing (puppet-seat fragility machinery); streams re-route on the existing
  caravan physics.
- **Character + judgment:** seller/buyer intent reads through WR-2 dispositions +
  amendment B coherence (kinship_bond opposes the sale; mercantile reaches for
  it); G's books divergence reachable (selling the family silver to save the
  seat, receipted as whose books); the world judges on the observer's axis
  (selling to a known razer is damnable); wartime firesales legal, discounted
  through the buyer's belief of the seller's trajectory.
- **Trigger discipline:** plan-lane only (band-crossing pressure episodes),
  headline-class Herald events, full address chains.
- **Pins:** clearing requires overlap (non-overlap ⇒ no trade, receipted only in
  the plan's failure); the emergent-cost arms (a parent that sold its satellite
  hits its overflow ceiling with no valve — the §5 machinery must actually
  produce the squeeze on a real fixture); the lineage-edge survival
  (seller's-remorse claim mintable post-sale; independence claim mintable by the
  outgrown asset); the sold settlement's grievance + legitimacy state; the
  geographic bound's negative case (an unreachable buyer never appears in the
  candidate set); swap symmetry; JSON-round-trip + regen/undo lifecycle on the
  rewritten edges (the alias + lifecycle hazards); dormancy golden.
**Bands:** adequacy of the three geographic reads, trajectory-band weights in the
appraisal, reserve/ceiling derivation, firesale discount, grievance magnitude,
legitimacy start, plan-trigger thresholds.

---

## §6 JUDGMENT BLOCKS (the Fable chair's rulings under delegation — vetoable here;
## an implementer NEVER re-rules these silently)

- **J-WR-1 (the seam ruling, §3):** the envoy program transports the peace engine's
  math; peaceTerms.js stays the single terms writer. VETO forks a negotiation
  evaluator into the envoy layer.
- **J-WR-2 (war-culture compilation):** amendment E's "fourteenth cause" is built as
  WR-2's threshold channel + WR-1 end term, never a per-pair casus record — E3's
  later law outranks E's provisional framing, and the walker's bijection stays
  honest instead of gaining a filler mirror. VETO mints a `war_culture` casus with
  an invented mirror.
- **J-WR-3 (dispositions persist):** the disposition profile is persisted banded
  stock, the one disclosed exception to never-store-a-derivable (re-deriving from
  full history per tick is O(history)). VETO derives per-tick from the chronicle.
- **J-WR-4 (alliance_obligation pair):** the ally's war edge carries casus
  `alliance_obligation` mirrored by `obligation_discharged`. Names vetoable; the
  structural need (walker totality) is not.
- **J-WR-5 (expenditure is derived):** no stored expenditure totals; the joinLedger
  anchor is the only persisted addition. VETO orders a running ledger.
- **J-WR-6 (the ruler-change momentum discount):** amendment D's momentum break is a
  consumption-side discount in warTermination's read; momentum.js is never touched.
  VETO requires a momentum.js export (owner coordinates the foreign file).
- **J-WR-7 (license mints on the public fact):** R2's vengeance license mints on the
  razing event (a razing is loud); courts ACT on their belief of it arriving at news
  speed. The false-license deception (a PLANTED razing that never happened arming a
  deceived avenger) is explicitly reachable machinery-wise and explicitly DEFERRED
  (recorded, not built in v1 — it needs its own owner ruling on how far a lie can
  arm a license). VETO in either direction: mint-on-belief (full epistemic) or
  defer-nothing.
- **J-WR-8 (the just razing is sanctioned, not free):** banded-down consequences,
  never zero for good actors — mercy stays a real choice. VETO zeroes the just
  razing's price.
- **J-WR-9 (license persistence):** persists until used, generational expiry band
  (an heir may collect; a century-old license is a legend, not a law). VETO makes
  it eternal or ties it to the victim settlement's survival.
- **J-WR-10 (R's extremity read):** existing relationship-state axes at their
  authored extreme + live grievance magnitude; no new relationship vocabulary.
  VETO mints an `extreme` band name into the relationship vocabulary.
- **J-WR-11 (disposition extends, never duplicates — added 2026-08-01 after the
  review caught the census gap):** WR-2 extends the EXISTING dispositionStats
  ledger into four channels with one writer, migrating the single-channel score
  and subordinating disposition.js's own history term when lit. VETO builds the
  parallel dispositionProfile.js and accepts the double-count risk consciously.
- **J-WR-12 (lineage substrate before lineage casus):** WR-3 builds the
  campaign-member parentRef seam first and proves pair-reachability by corpus
  probe. VETO ships the casus against the satellite ledger as-is (and accepts a
  structurally-unreachable cause).
- **J-WR-13 (census corrections stand in the register):** the §2 substrate table's
  two verified overstatements — "jailed applies to any named soul" (no
  non-corruption jailing path exists today; the envoy program NAMES that seam as
  new work in WR-7b) and the disposition row above — are corrected per
  docs/COMPREHENSIVE_REVIEW_2026-08-01.md; any implementer finding a third census
  overstatement STOPS and reports rather than building on it.

## §7 THE TUNING SURFACE (owner-signed at the soak redo, per THE PROMISE)
Every band named in §5, gathered: WR-1 term weights + deciding margin · WR-2
learn/decay/threshold-cap bands · WR-3 inversion + claim cap · WR-4 trajectory
margins + home-front acceleration · WR-5 books weights + refusal costs + re-read
discount · WR-6 apportionment weights + adequacy + exit costs · WR-7 envoy caps +
mutation + interception + close-vote + widening + ransom + vetting · WR-8
overwhelming + extremity + severity→tiers + escape + license bands + observer-
alignment consequences · WR-9 envelope shapes. Every one banded, none a bare float
on a surface, all in one tuning table per wave (the house idiom).

## §8 HERALD + LEGIBILITY CONTRACT (the sentences this program must be able to say)
The legibility law is an acceptance criterion, not decoration. Each wave's receipts
must be able to produce, in the house voice, at minimum:
- "why is this war still going?" answered by the deciding term (WR-1)
- "the war outlived its reason — men still dying for a god nobody worships" (WR-1)
- "the Margrave sued for peace" vs "the realm sued for peace" (WR-5)
- "they went home" / "they stayed" — the ally's temperament (WR-6)
- "they paid what they owed" / "they never paid" (WR-6)
- "the terms were agreed and the envoy never reached them" (WR-7)
- "the terms were signed for a town that had already fallen" (WR-7)
- "no word has come from the mountain road; the court fears the worst" (WR-7)
- "they could have taken everything and did not" (WR-8)
- "They burned Thornwall and rode home" (WR-8)
- "Thornwall held the right of vengeance, and let it rest" (WR-8)
Every one carries id + full address chain + typed action + named settlements +
recorded reason (law 1a-5).

## §9 SEQUENCING AGAINST THE STANDING PIPELINE (owner-held items unchanged)
1. WR-0 lands FIRST (it settles the tree; nothing builds over a dirty tree).
2. WR-1 → WR-2 → WR-3 → WR-4 → WR-5 in order (each consumes the last).
3. WR-6 after WR-5; WR-7 after WR-6 (votes need books; ransom needs errands).
4. WR-8 after WR-7 (feasibility feeds the vote; the razing reads WR-2 + licenses
   interact with WR-6's coalitions). WR-10 after WR-7 (cession-for-peace rides the
   envoy term-sheet; the bundle rides the terms budget). WR-9 lands its envelopes
   alongside WR-8/WR-10 and closes the program.
5. THE OWNER-HELD BOUNDARY IS UNCHANGED: the release soak grid, the 300y rerun,
   the subsystem-certification sweep over new receipts, and the tuning pass wait
   on the owner. These waves BUILD dark; nothing here lights a flag, runs a soak,
   or ratifies a band. TC-3..TC-8 remain sequenced by the owner separately (they
   do not change the simulation).
6. Cartography TC-3..8 and the wave-3 programs are ORTHOGONAL to this program by
   path; they may interleave by owner order without contract collisions.

## §10 IMPLEMENTER PROTOCOL (binding on the external implementer, Sol 5.6)
1. **Worktree + branch:** all work in the minifold worktree
   (`.claude/worktrees/minifold`, branch `claude/composite-r4`). Hard-gate every
   state-mutating compound: `[ "$(git branch --show-current)" = "claude/composite-r4" ] || exit 1`.
   NEVER `git add -A/-u/.` — explicit files only. `git stash` is FORBIDDEN. Never
   touch `momentum.js`. Never edit another program's dirty files.
2. **Gates:** never read a gate through a pipe — `npm run check:tail` or
   `sh scripts/gate-tail.sh <cmd>`; full suite exceeds a 10-minute cap (run
   detached); gate only when `lsof`/`ps` shows zero other vitest workers;
   timeout-shaped reds under load are flakes — isolation re-run before diagnosis.
3. **One wave = one commit** (WR-7 = four commits, one per slice) + focused gates
   per slice + full gate at wave end + a ledger row in
   docs/COMPREHENSIVE_REVIEW_PROGRAM.md (ledger branch) or the program's Progress
   blockquote per the house convention.
4. **Goldens:** capture every dormancy fence BEFORE wiring (the J1 precedent). A
   golden that moves unexpectedly is a STOP-and-report, never a re-record. Golden
   re-records happen only against a ruling recorded in FABLE_VALIDATION_QUEUE.md
   or by the owner.
5. **New tests in generation trees** MUST use tests/helpers/{anchoredNegatives,
   seedFailures}.js (walkers red otherwise). Every envelope carries a mutant
   negative control. Every new news kind registers in WHAT_PHRASES + heraldRouting
   (totality walkers red otherwise). Every new store action registers in
   operationRegistry + regenerated compendium data.
6. **Report, don't rule:** any conflict between this document, an amendment, or
   the tree is a STOP-and-report to the validation chair. Deviations an
   implementer believes necessary are proposed in the report, never taken.
7. **Every claim in the completion report is CONFIRMED (executed, output quoted)
   or PLAUSIBLE (labeled).** "Should work" is not a state of the world.
