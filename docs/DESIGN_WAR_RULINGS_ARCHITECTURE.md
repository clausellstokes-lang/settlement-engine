# DESIGN — THE WAR RULINGS ARCHITECTURE (amendments A–S compiled for build)

## Fable 5 architecture, 2026-08-01; census-corrected 2026-08-02 (self-audit).
## Compiled from the 31 owner rulings recorded in
## DESIGN_REALM_DIRECTIVES.md (amendments A through S — R2 and S included — plus the
## three-causes ruling) into
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
- **B — ABSOLUTE COHERENCE (standing law; CORRECTED 2026-08-02 (self-audit) — the
  first issue compiled B nowhere: no law slot, no wave item, no pin):** every new
  scorer/evaluator this program introduces — WR-1's four-term read, WR-2's threshold
  factor, WR-3's lineage claim, WR-4's trajectory, WR-8's feasibility + intent,
  WR-10's appraisal — carries a RECEIPT FIELD naming the state that produced its
  score, and a walker asserts the field across the whole scorer family (incoherence
  is visible, never silent). Clause (iv)'s mechanic is SUPPRESSION: a casus
  contradicted by a live read returns 0 with a receipt naming the contradicting
  state — suppress-the-score, never refuse-the-mint (the reasons layer's decay
  idiom). History binds the same way: the chronicle and the relationship record must
  agree with a claim — you do not sack the satellite you spent a decade provisioning
  (pinned in WR-3; the peaceable-culture sibling pins in WR-2).
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
| Casus taxonomy: 13 war reasons + 13 peace mirrors (CORRECTED 2026-08-02 (self-audit): 13, not 14 — bijection means 13↔13; verified by enumeration, PEACE ends at `common_rite`), walker-enforced totality+bijection | `warReasons.js` (WAR_REASON_TYPES / PEACE_REASON_TYPES / REASON_MIRRORS) | BUILT incl. `opportunism` (predation) + `sacred_claim` (holy war) at HEAD 99e2d54f |
| Reasons are state-derived, decay-inherent, zero-RNG, per-pair directed ledger | `spatialLedgers.warReasons`, key `${from}>${to}` | BUILT — dissolution (amendment C) is structurally half-present already |
| Peace terms: budget/appraisal/draft/compliance/fraying, believed-advantage evaluator with injectable belief (`truthFor`) | `peaceTerms.js` (TERM_CATALOG, believedAdvantage, appraiseLoserPortfolio, draftTerms, advanceTreaties…) plus the dependency-light `treatyClock.js` duration/clock leaf | BUILT — the terms MATH the envoy program transports; ⚠️ TIME-BASE FLAG (2026-08-02, self-audit): prices a "year" at 12 ticks while the engine tick is one week — WR-0c item (4) rules it before any WR duration work builds on it [STATUS CORRECTED 2026-08-02: item (4) LANDED — new treaties use the canonical 52-week year; persisted treaties retain their historical cadence through an explicit marker; see the item-(4) receipt below]; ⚠️ the `truthFor` seam is ONE closure for BOTH parties and advanceTreaties exposes no seam at all — see §3 THE SEAM MECHANICS |
| Treaty enforcement: readiness cap, war block, occupation hold; tribute/reparations/restitution move real grain | `treatyEnforcement.js`, `treatyTransfer.js`, `warIntent.js` | BUILT + GATED (wave W1; landed in the WR-0 W1 commit) |
| Momentum: commitment stock, cliffs, face-saving exits, climb-downs | `momentum.js` | BUILT, FOREIGN (read-only law above) |
| NPC durable identity, facets, circulation, belief, transit, verdicts (jailed = the corruption-exposure path ONLY — the sole writer is applyNpcVerdict, which requires a local roster npc + an exposure record; the FOREIGN-GUEST HOLD is NEW WORK, WR-7b) [CORRECTED 2026-08-02 (self-audit)], Wanderers register + DM verbs | H1–H4: `npcLedger*`, `npcCirculation*`, `npcVerdict*` | BUILT |
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

**Verified ABSENT 2026-08-02 (self-audit) — NEW WORK, each homed in a wave; never
build on these as if they existed:** the E3 alliance-web risk read (WR-6's join
decision) · the foreign-guest hold writer (WR-7b) · the atrocity-coalition casus pair
(WR-8; J-WR-14) · `negotiationPictures.js`, the two-picture wrapper (§3 seam
mechanics; WR-7 slice work) · the opportunism patron arm (WR-1's dissolution slice —
`opportunism.js` carries no patron token; the substrate is regionalGraph's existing
`patron` relationship label) · the per-party belief seam at the pulse entry
(`advanceTreaties` builds a live-snapshot truthFor internally today — WR-7 slice
work).

---

## §3 THE FLAG FAMILY + THE ONE SEAM RULING

Seven new virtual flags — six program flags plus the one casus sub-flag,
`lineageClaimEnabled` (count CORRECTED 2026-08-02 (self-audit): amendment S added the
seventh row and the old header still said five-plus-one). All absent from
DEFAULT_SIMULATION_RULES; lit only in full_simulation at the owner-signed soak redo:

| Flag | Gates | Wave |
|---|---|---|
| `warTerminationEnabled` | the four-term termination read (cause/continue/stop/momentum) + dissolution re-reads + cost-to-sue | WR-1 |
| `dispositionChannelsEnabled` (CORRECTED 2026-08-02 (self-audit) — the WR-2 census-correction name; never `dispositionEnabled`, one word from the live `warDispositionEnabled`) | the disposition channels, their learner, their threshold reads, deity war-pressure | WR-2 |
| `lineageClaimEnabled` | the lineage_claim casus + kinship_bond mirror | WR-3 |
| `coalitionLedgerEnabled` | expenditure derivation, separate peace, coalition settlement + apportionment | WR-6 |
| `envoyDiplomacyEnabled` | the whole envoy program (errands, interception, ratification, ransom, compromised envoy) | WR-7 |
| `conquestDoctrineEnabled` | feasibility belief, intent gate, conquest end-state, the razing | WR-8 |
| `sovereigntyTradeEnabled` | the settlement market (amendment S): sale/swap/cession-for-peace of satellites and vassals | WR-10 |

**THE FLAG-DEPENDENCY RULING (added 2026-08-02, self-audit — the first issue declared
seven independent flags and no lighting contract):** the WR flags are INDEPENDENT
DARK SWITCHES — any one may stay dark forever without breaking another's dormancy
fence — but lighting is ORDERED. WR-3, WR-8, and WR-10 declare `demographicsEnabled`
a LIT-PRECONDITION (WR-3's overflow-founding graduation path, WR-8's conserved sack
arithmetic through §3 demographics, WR-10's demographic-trajectory appraisal all read
wave-P machinery), plus the flags of their §9 predecessors: WR-3 ⇒ WR-1/WR-2's flags;
WR-8 ⇒ WR-1/WR-2/WR-6/WR-7's flags; WR-10 ⇒ WR-7's flag. THE LIGHTING ORDER IS THE §9
BUILD ORDER; a flag lit out of order is an invalid config the WR-9 certification
walker reds. A degraded dark-predecessor read exists only where a wave names one
explicitly (WR-1's sunk-cost fallback); silence means the precondition is hard.

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

**THE SEAM MECHANICS (J-WR-1 refinement, added 2026-08-02, self-audit — the seam as
first stated does not exist in the tree as claimed):** verified: `truthFor` is ONE
id→strength closure and `resolveVictor(a, b, worldState, truthFor)` passes the SAME
closure for BOTH parties; `advanceTreaties` accepts no `truthFor` at all — it builds
a live-snapshot closure internally, so the pulse entry point is a true-state reader
with no seam. The lit-path contract is therefore the TWO-PICTURE CONTRACT: a NEW pure
wrapper module `negotiationPictures.js` (WR-7 work; no state, no writer) invokes the
EXISTING leaf evaluators (`believedAdvantage` / `appraiseLoserPortfolio` /
`draftTerms`) once PER PARTY under that party's own truthFor, and acceptance compares
each party's OWN-PICTURE valuation of the sheet on the table. No evaluator is forked,
no merged estimate exists anywhere (K4), and `peaceTerms.js` stays the single terms
writer. The pulse injection point is `advanceTreaties`' CALL SITE — named WR-7 slice
work: when `envoyDiplomacyEnabled` is lit, the willingness crossing at that site
mints the errand and advanceTreaties' internal willingness→rounds path is suppressed
at the call site; dark, it stands byte-identical. K3's structural pin set, module by
module: `envoyErrand.js`, `negotiationPictures.js`, WR-8's feasibility composite,
WR-10's `appraiseSettlementAsset`. `peaceTerms.js` sits OUTSIDE the pin set (its
dark-path transport legitimately builds truth internally — the two-picture wrapper is
what keeps the LIT path belief-sourced), and the guard-the-guard positive control
points at a truth-reading module outside the negotiation set (warDeployment.js or
peer) — never at peaceTerms.js, which cannot sit on both sides of its own guard.

---

## §4 CANONICAL MODEL — new state, and it is deliberately small

Everything below is conditionally materialized (drop-when-empty at every level, zero
eager bytes, absent ⇒ byte-identical) and has exactly ONE writer module.

```
worldState.spatialLedgers.warIntents        — EXISTS after WR-0 (W1's ledger)

worldState.dispositionStats                 — EXISTS today (single-channel, lit via
  // warDispositionEnabled); WR-2 EXTENDS IT IN PLACE — same ledger, same ONE
  // writer: dispositionLedger.js.
  { [settlementId]: { …existing single-channel fields…,
      channels: { martial | mercantile | diplomatic | insular:
        { stock01: number, band: word } },  // banded projection is what consumers read
      updatedTick } }
  // [CORRECTED 2026-08-02 (self-audit): the first issue specced a NEW
  // worldState.dispositions with writer dispositionProfile.js — which is exactly
  // J-WR-11's VETO position and the double-count it names. dispositionProfile.js
  // survives ONLY as a pure read-side module (no state, no writer) exporting
  // thresholdFactorOf-shaped reads.]
  // Learned from OUTCOME EVENTS only (war won/lost, treaty held/broke, trade
  // enriched, venture failed), decayed toward neutral on a generational
  // half-life band. Persisted because re-deriving from full history per tick is
  // O(history) — the ONE exception to never-store-a-derivable, disclosed here.

warRecord extensions (the existing war object) — WR-1/WR-6/WR-8, writers unchanged
  deployment.casusReasons: [ { type, score, receipt, atTick } ] // pinned at open, never rewritten
  deployment.attackerPatronRef / defenderPatronRef               // sacred-casus anchors, immutable
  pulseRecord.warTerminationReads: pulse evidence (may persist only inside bounded worldState.pulseHistory)
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

worldState.spatialLedgers.foreignGuestHolds — WR-7b (NEW WORK, named 2026-08-02,
  [ { npcId, captorId, heldSinceTick,       // self-audit), writer foreignGuestHold.js
      cause } ]                             // — ONE writer. The captor-side record
                                            // H2's verdicts cannot express (jailed is
                                            // the corruption-exposure path only).
                                            // WR-7d's ransom dwell gate reads
                                            // heldSinceTick; release/escape/death all
                                            // close the record through the writer.

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
- **(4) THE PEACE-TERMS TIME-BASE (ADDED 2026-08-02, self-audit — ~~OUTSTANDING~~
  STATUS CORRECTED 2026-08-02: LANDED; the
  Progress note below covers items 1–3 only; this lands as its own follow-up
  commit):** `peaceTerms.js` prices a "year" at `TICKS_PER_YEAR: 12` (and
  `treatyEnforcement.js` duplicates `INSTALLMENTS_PER_YEAR: 12` behind a no-drift
  pin) while the engine tick is ONE WEEK (`INTERVAL_WEEKS.one_year: 52`;
  advanceInterval: "a one_year advance is 52 synchronous one-week ticks"). Every
  calendar-literal duration the peace engine names — "3–5y modest victory, 10–15y
  crushing" — therefore expires ~4.3× early, while the transit half of this same
  program is week-true (`planWanderLeg` adds `hopWeeks` straight to the tick
  counter). RE-DERIVE the duration constants against the weekly tick — a disclosed
  same-seed shift on every treaty golden plus a re-tune of the BUDGET/duration
  bands — or, as the fallback arm, document the 12-tick "month-year" as deliberate
  and forbid the Herald from ever printing it as a calendar year; taking the
  fallback arm instead of the re-derivation is a STOP-and-report to the validation
  chair, not an implementer pick. Either arm lands WITH A PIN tying the chosen
  constant to `INTERVAL_WEEKS` so the two clocks can never silently drift again.
  WR-9's duration envelopes are BLOCKED on this item (they must state which
  constant defines a year before they are authored). [STATUS CORRECTED 2026-08-02:
  the condition is now satisfied by the 52-week current clock + explicit legacy-12
  provenance rule; WR-9 is unblocked.]

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

> **Progress — WR-0c item (4) landed, 2026-08-02.** The re-derivation arm was
> taken. New treaties persist
> `treatyTicksPerYear: 52`, and that current cadence is identity-pinned to the
> dependency-free `INTERVAL_WEEKS.one_year` source. The schema remains v2: its
> same-schema nested migration stamps every persisted unmarked/invalid treaty as
> legacy `12` WITHOUT rescaling authored expiry horizons, breach/repudiation
> horizons, due dates, or counters. Duration displays, installment draws, and the
> annual strain rate all resolve the treaty's own marker; current treaties therefore
> pay and accrue across 52 weekly ticks while old saves continue on the twelve-tick
> contracts they actually lived. The warranty is deliberately bounded: the promoted
> multi-tick `one_year` path is 52 synchronous one-week ticks and is weekly-correct;
> the retained `advanceMultiTick=false` coarse kill-switch remains a legacy
> compatibility route and is NOT warranted as weekly-correct. Drafted duration now
> uses `0.5 + margin + margin²`, multiplied by alignment press, then hard-capped and
> shortened to the longest affordable whole-year term. Thus a product-fed term stays
> monotone across the `.99 → 1` margin boundary instead of disappearing when its
> authored ask outruns budget. The reachability proof covers only rows the present
> appraisal can feed; it makes no claim for the still-unfed `reparations` and
> `non_intervention` rows. WR-1 and WR-9 are UNBLOCKED by this item. The complete
> gate passed 2,114 files with one skipped and 22,410 tests with 54 skipped;
> production build, 311-route prerender, and dist 364/364 are green. No flag was
> lit, no golden or snapshot was re-recorded, and no soak ran.

### WR-1 — THE TERMINATION READ (amendments C, C2; flag `warTerminationEnabled`)
**Scope:** the four-term read — live cause vs cost-to-continue vs cost-to-stop,
all against momentum — plus per-cause dissolution.
- **New module `warTermination.js`** (pure; zero RNG — reads, not rolls; the
  warReasons discipline). Per valid surviving deployment per pulse, emits ONE receipt naming
  the four terms' bands and WHICH TERM IS DECIDING — the Herald's "why is this war
  still going?" answer (amendment C2's legibility demand).
- **Dissolution:** the reasons layer is already state-derived (decay inherent), so
  dissolution's substrate exists. NEW: (a) `deployment.casusReasons` pinned on the war record
  at open (never rewritten); (b) the re-read compares those pinned casus entries
  against the live per-pair reasons — every pinned casus absent from the live fold ⇒ the war
  is CAUSE-DISSOLVED, a named `causeExit01` peace force feeding the existing
  willingness read directly; its ordinary peace mirror is filtered from that choice
  so the same dissolution cannot be counted twice; (c) each of the three named dissolutions from
  amendment C is a pin: sacred_claim dies on patron unseating (SUBSTRATE CHECK:
  if deity unseating is not a real transition, the pin documents the dormant arm
  and the dissolution ships structurally ready — never invent a pantheon coup here);
  lineage_claim dies on satellite destruction/edge severance (lands with WR-3);
  opportunism dies when the victim stops being believed-weak or gains a patron
  [CORRECTED 2026-08-02 (self-audit): the patron arm is NEW WORK in this slice —
  `opportunism.js` today reads a single vulnerability gradient plus own capability
  and carries no patron token; the substrate is regionalGraph's existing `patron`
  relationship label, and the SAME read serves amendment A's counterforce below].
- **Amendment A's counterforces, homed (added 2026-08-02, self-audit — A binds each
  of the three causes to a counterforce "pinned as able to WIN, never a stub", and
  the first issue homed only lineage's):** predation's counterforce lands HERE —
  the victim's PATRONS (the new patron read above: a patron raises the aggressor's
  believed price and dissolves the casus) and the aggressor's own RESTRAINT via
  §1b-B suppression (an opportunism score contradicted by the live strength read
  returns 0 with a receipt naming the read). The faith war's counterforce (shared
  rite + polar opposition being rare) lives in the sacred_claim scorer's notes:
  `common_rite` is the mirror that carries the shared-rite arm, and rarity is a
  scored fact of pantheon composition, never a band. Lineage's counterforce
  (kinship) is WR-3's kinship_bond mirror — verified present in WR-3's spec.
  Pin per A: each counterforce WINS on at least one real fixture (the war predation
  would have opened does not open).
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
**Lifecycle paths (added 2026-08-02):** `deployment.casusReasons` persists on the war record —
serialize + JSON-round-trip pinned, a regen that rebuilds a war re-pins them at open,
undo restores them with the record, import validates each type against the taxonomy;
the receipts are recorded only on `pulseRecord`; they may persist inside bounded
`worldState.pulseHistory`, but are never copied into a dedicated top-level state key
or the deployment ledger.
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
  propensities. STRUCTURAL ENFORCEMENT: dispositionProfile (a PURE READ-SIDE
  module — no state, no writer; the ledger stays dispositionLedger.js per J-WR-11 —
  clarified 2026-08-02, self-audit) exports only
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
  proportionally priced, BOTH arms); threshold-never-selector (the import pin); the
incoherence-unreachable negative (amendment E's peaceable-culture clause, homed
2026-08-02 per §1b-B): a peaceable culture with a harvest god and a history of
losses CANNOT raise war-culture pressure — the configuration scores 0 with a
§1b-B suppression receipt naming the contradicting state, and the pin proves it.
**Lifecycle paths (added 2026-08-02):** `dispositionStats` already persists in saves
and is LIT in full_simulation, so the four-channel extension is a SHAPE MIGRATION on
a live path — an old-shape world folds its legacy aggressiveness score into the
martial channel deterministically at load/import, undo round-trips the extended
shape, a mid-world `dispositionChannelsEnabled` flip reads the migrated ledger and
never re-derives, and the JSON-round-trip pin covers both shapes.
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
  without exemptions; the incoherence-unreachable negative (§1b-B's own clause,
  homed 2026-08-02): you do not sack the satellite you spent a decade
  provisioning — a lineage_claim whose pair's chronicle + relationship record show
  sustained provisioning is SUPPRESSED to 0 with a receipt naming the record that
  contradicts it; dormancy.
**Lifecycle paths (added 2026-08-02):** `parentRef` lineage edges persist on the
campaign-member settlement record — JSON-round-trip pinned, a regen that re-runs a
graduation re-records the edge and one that does not preserves it, undo and import
round-trip it with the settlement.
**Bands:** inversion threshold, claim weight cap.

### WR-4 — COMPARATIVE COSTS + THE HOME FRONT (amendment F; rides
`warTerminationEnabled` — same flag, second slice)
- **New pure evaluator `warCosts.js`:** BELIEVED trajectory (three-way:
  losing/winning/even) from consecutive closed believed-advantage bands carried by
  the EXISTING `pulseHistory[].warTerminationReads` receipt lane. The live peace
  engine computes only a point-in-time believed margin; it does **not** retain the
  temporal ratio trend the first architecture draft claimed. WR-4 therefore closes
  each current actor-side margin into a receipt-safe band and compares it with the
  newest prior receipt for the same attacker/target. First observation, missing
  history, or an unchanged band is EVEN. The forward-looking comparison remains
  end-now vs end-later under that real temporal movement; EVEN returns a null
  comparison so every other force decides (F's stated feature — pin it: even ⇒ the
  deciding-term receipt never names trajectory). A parallel truth band rides the
  same private pulse receipt only for a post-hoc DM diagnostic and is structurally
  absent from the behavioral evaluator.
- **The home front is a THIRD STREAM, READ never invented (F's critical rule):
  derived entirely from existing degradation — downward route grade steps since
  the deployment began (J), current deployed granary strain (foodStockpile), the
  attacker's own conscript share of the conserved aggregate deployment bank
  (`deployedPopulation` minus `leviedPopulationBySource`), shell records formed during
  the war (K1/K2 where that optional ledger exists), and lost trade ties/markets.
  There is NO named-NPC deployment or casualty ledger in P1/P1a; P1a is the
  demographic decline-floor repair. Accordingly the `{npc}` home-front family is
  ineligible until a later truthful named-person source exists, never filled by a
  roster guess. J and K remain sparse until their own lifecycle wiring exists, and
  absence contributes zero rather than fabricated degradation. NO new war-tax
  parameter anywhere.** The stream must ACCELERATE with duration (amendment L
  force #1), but duration multiplies only degradation actually read and can never
  create cost by itself — measured at the soak, not asserted.
- **Pins:** winning-abroad-losing-at-home reachable and receipted (F's explicit
  demand), but its public victory clause requires the parallel true trajectory to
  be winning too — a mistaken court may emit the private misread, never a
  fabricated public victory; mistaken-court reachable (believed trajectory wrong
  vs truth, and the receipt can say so post hoc); the even-case silence.
**Lifecycle paths (added 2026-08-02; corrected after the live census):** this wave
adds NO dedicated persisted state — `warCosts.js` is a pure evaluator and its
trajectory anchors are qualitative fields on the already-permitted termination
pulse receipts, bounded to the current deployment's `sinceTick`. The existing
`tradeWarState` prize row gains a conditional, codepoint-ordered
`lostSupplierSinceTick` map so each actually displaced holder remains attributable
until it regains the prize; each supplier keeps its own loss clock so a later
third-party flip cannot re-date an older loss into a new war. Generic world-state
clone/import already preserves that nested row. There is no deployment twin,
standalone ledger, regen path, or separate undo verb.
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
**Lifecycle paths (added 2026-08-02):** the installing faction's demand rides the
EXISTING succession record — it serializes, regens, and undoes with that record's
own pins; no other state is added (refusal costs and grievances land on existing
ledgers).
**Bands:** books-weight derivation bands, refusal-cost bands, re-read discount.

### WR-6 — THE COALITION GRAPH (amendments I, I2, I3, J; flag `coalitionLedgerEnabled`)
- **The load-bearing insight is already true:** the reasons layer is per-pair, so a
  multi-party war IS a graph of bilateral edges. This wave makes joining, spending,
  exiting, and settling first-class ON that graph — no war object gains a member
  list; membership is derived from the edges + alliance ties.
- **THE JOIN DECISION (added 2026-08-02, self-audit — the first issue specced the
  ally's edge and never the decision that mints it):** an ally's entry is a SCORED
  DECISION with a receipt, never an automatic consequence of the tie. The candidate
  runs the E3 ALLIANCE-WEB RISK READ — NEW WORK, homed here (verified ABSENT from
  the tree 2026-08-02; the §2 register lists it): a pure belief-side read of who
  would come to the target's aid and who would come to THEIRS — the second order
  matters — raising the believed price of entry with no pacifism term existing
  anywhere; plus its OWN books (G) under WR-2's temperament, against the alliance
  obligation. A REFUSAL is a REMEMBERED FACT: a first-class receipted entry feeding
  the relationship record (amendment I verbatim — an ally's ally "may refuse and be
  remembered for refusing"), and the caller's reading of the refusal is the
  caller's character. Both arms pinned — join under one temper, refusal under
  another, from the same state (the I3 temperament-is-load-bearing discipline
  applies at the door exactly as at the exit). WR-8's deterrence clause consumes
  THIS read pointed at the aftermath.
- **Joining:** an ally entering under alliance mints its OWN war edge whose
  deployment.casusReasons = the alliance obligation (a casus record with its own mirror per
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
**Lifecycle paths (added 2026-08-02):** joinLedger anchors and refusal facts persist
on EXISTING records (the war record, the relationship record) and round-trip, regen,
and undo with them; no expenditure totals are ever stored (J-WR-5).
**Bands:** apportionment weights, adequacy-of-payment band, exit-cost weighting,
join-bar + refusal-cost bands (added 2026-08-02).
**Scope fence (I, verbatim law):** peace is negotiated PAIRWISE along edges. No
congress, no multilateral table, ever.

### WR-7 — THE ENVOY PROGRAM (amendments K, K2, K3, K4, M, O, Q; flag
`envoyDiplomacyEnabled`; four slices, each its own commit)

**WR-7a — THE ERRAND.** New module `envoyErrand.js` (ONE writer for
`worldState.envoyErrands`).
- A willingness crossing (the peace engine's existing trigger) mints an ERRAND: a
  named NPC (durable H1 id; chosen by the seat — see vetting in WR-7d) departs on
  the lived route network under the armyTransit mid-route pattern, ONE WEEK PER LEG
  MINIMUM (law M), grade-priced longer (J4 leg costs). The mint happens at
  `advanceTreaties`' CALL SITE (§3 THE SEAM MECHANICS — added 2026-08-02): lit, the
  crossing mints the errand and the internal willingness→rounds path is suppressed
  at that site; dark, byte-identical. That suppression is slice work HERE.
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
  [CORRECTED 2026-08-02 (self-audit — one kernel, two cost specs): J-D11(b) in
  DESIGN_REALM_DIRECTIVES names this SAME kernel as the enforcement seam for its
  mode-speed calibration table (km/week per mode) under `portOpportunityEnabled`.
  Ruling for this seam: WR-7a BUILDS the kernel + walker FIRST; J-D11(b) EXTENDS
  it. The kernel's denomination is km/week per mode with route grade as a
  multiplier (the superset); until the mode table lands, legs price at grade
  alone, and law M's one-week floor binds in EVERY denomination. The map's km
  scale constant does not exist in the tree yet — an owner-signed tuning call,
  carried in §7.]

**WR-7b — INTERCEPTION + THE PARLAY.**
- Four interceptor kinds (K.3), all riding position co-location per tick: (a) the
  target's army ⇒ field parlay; (b) a third party wanting the war continued;
  (c) a coalition member of the target — who may PARLAY THEMSELVES if their own
  edge carries no live cause (peace entering through the unexpected door);
  (d) anyone with private goals: plant (I4's verb aimed at the snapshot), imprison
  (the FOREIGN-GUEST HOLD below — NOT H2's jailed verdict, which cannot reach a
  foreign guest), or terms-shopping.
- **THE FOREIGN-GUEST HOLD (NEW WORK, named 2026-08-02, self-audit — the first
  issue presented this as existing wiring; the tree's only jail writer is
  applyNpcVerdict, which requires a local roster npc plus a corruption exposure
  record, so no path today can hold a travelling foreign envoy):** a
  spatialLedgers-family record `{ npcId, captorId, heldSinceTick, cause }` with ONE
  writer, `foreignGuestHold.js` (§4). WR-7d's ransom gate consumes the dwell read
  (`heldSinceTick`). Release, escape, and death paths all close the record through
  the same writer — no second mutation site. Pins: JSON-round-trip (the alias
  trap — a held npc IS a roster object in memory), regen/undo round-trip, and the
  writer/reader payload-spelling pin booting the REAL writer.
- **The interceptor's dilemma (K2.1):** carry-the-terms-home (abandon position —
  a real military cost through WR-4's comparative read + the commander's books)
  vs hold-the-mission. An occupied enemy settlement is a legal venue (the irony is
  allowed).
- **The parlay runs the peace engine's evaluators** (the §3 seam ruling, through
  `negotiationPictures.js` — corrected 2026-08-02, self-audit; `truthFor` is one
  closure and cannot carry two pictures): offer = believed-fair terms through
  `draftTerms`/`appraiseLoserPortfolio` invoked once PER PARTY under that party's
  own truthFor, acceptance compared on each party's own-picture valuation (§3 THE
  SEAM MECHANICS); the interceptor's picture mutates
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
- **Captivity → ransom (O):** dwell-gated (band; the dwell read is WR-7b's hold
  ledger `heldSinceTick` — corrected 2026-08-02); the claim rides the I2
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
**Lifecycle paths (WR-7 family, added 2026-08-02):** `envoyErrands` and
`foreignGuestHolds` persist — JSON-round-trip (the alias trap), regen/undo/import
round-trip both ledgers with any term-sheet in transit riding the errand record; a
DM KILL mid-errand closes the errand `lost` through the one writer, so K.7's
inference machinery runs on the honest silence (deletion would ghost the return
path and void an open ransom claim — the lifecycle bug class this program is most
bitten by); an open hold on a dead npc closes through the death path.
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
  what was believed and why). THE I4 DECEPTION ROAD REACHES CONQUEST INTENT ONLY
  (scoping added 2026-08-02, self-audit): R2 closes it for razing initiation — the
  punitive intent stays unreachable for non-evil settlements, no pressure, no
  deception, no dice sequence. Mercy is a characterful receipt ("they could have
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
  the act through the believed retaliation web (that web IS WR-6's alliance-web
  risk read pointed at the aftermath — built THERE, consumed here; pointer added
  2026-08-02); terror-works and terror-backfires both reachable per-neighbour.
- **THE ATROCITY-COALITION CASUS (NEW WORK, named 2026-08-02, self-audit —
  amendment R claims "every piece of that ledger already exists" and this piece
  does NOT: the 13 WAR_REASON_TYPES carry no atrocity or moral-outrage entry, and
  the taxonomy is walker-enforced for totality + bijection, so it cannot land
  without an authored mirror):** a walker-satisfying reason pair —
  `atrocity_answer` ↔ `atrocity_atoned` (names vetoable; J-WR-14) — minted from
  BELIEVED razings (belief arriving at news speed, per J-WR-7's
  mint-on-the-public-fact discipline), state-derived and decay-inherent like every
  casus, feeding R2's license machinery: "someone must stop them" builds alliances
  among future victims, and the JUST razing mints none against the avenger (that
  WAS the atrocity's answer — both R2 polarities now switch a real cause).
  Registers in WHAT_PHRASES + heraldRouting or the totality walkers red.
  moralDrift.js is real substrate; this casus was not — the spec stops claiming
  otherwise.
- **⚠️ SUBSTRATE GATE — THE LICENSE COUPLING'S REACHABILITY (added 2026-08-02,
  self-audit; three verified facts, three open chair rulings):** (1) relationship
  states exist per regional-graph NEIGHBOUR edge only — a license holder who is
  not the razer's neighbour has NO relationship object to drive to an extreme, and
  R's razer burns and rides home, typically from elsewhere; (2) axes mean-revert
  toward the type baseline at RELATIONSHIP_RELAX 0.12/tick (~6-tick half-life)
  while the license persists a generational band — the emotion decays two orders
  of magnitude faster than the license unless the razing flips the edge TYPE,
  which R2 never says; (3) no type baseline exceeds hostile's resentment 0.78, so
  "the axes at their authored extreme" resolves to either nearly-unreachable or
  ubiquitous unless the band is named. The license slice DOES NOT BUILD past this
  gate until the validation chair rules: whether a razing MINTS an edge to
  non-neighbour holders (or the license is restricted to existing-edge holders);
  whether the atrocity flips the edge TYPE (durable) or only the axes (decaying);
  and which authored band "extreme" names — J-WR-10 constrains all three (no new
  relationship vocabulary). STOP-and-report if reached unruled.
- **Pins:** the overwhelming negative case; the extremity negative case
  (victorious-but-not-extreme cannot raze); the initiation gate (non-evil
  initiation structurally unreachable — walk the intent table); license coupling
  (license without own-extreme ⇒ no razing); the closed loop (vengeance mints no
  license); conservation through the sack arithmetic; demotion-follows-truth;
  dormancy goldens. Added 2026-08-02 (self-audit): the MISTAKEN-FEASIBILITY pin,
  BOTH directions, receipted (N2's explicitly requested pin) — a court that
  believed conquest in reach and was wrong, and a court that believed itself
  doomed and was not, each with the receipt honest enough to say so post hoc; the
  BOOKS-COLLAPSE fixture (N2: existential threat collapses G's two books — ruler
  and settlement choose alike from a state where they otherwise diverge;
  desperation makes courts honest); the feasibility-asymmetry DIRECTIONAL pin
  (being-conquered moves behaviour more than conquering, proven on one state pair,
  or the band is a number nobody checked); the license POSITIVE-REACHABILITY pin
  (in a generated corpus, some holder reaches the coupled extreme with the razer
  and prosecutes — negative gates alone would let the license economy be
  decoration; blocked on the substrate gate above); the material self-limit pins
  (R's own brake: ash pays no tribute — plunder-vs-streams compared on a real
  fixture; razing the same remnant twice yields NOTHING).
**Lifecycle paths (added 2026-08-02):** vengeance licenses and atrocity-casus
records persist (spatialLedgers family) — JSON-round-trip, regen and undo carry the
license with the record (never re-derived from the chronicle), import validates it,
and expiry is a read against heldSince ticks, not a stored countdown.
**Bands:** overwhelming threshold, extremity band, sack severity → 1-vs-2-tier
derivation, escape share, license adequacy band, license expiry (generational),
consequence bands by observer alignment, vengeance discount bands, atrocity-casus
decay band (added 2026-08-02).

### WR-9 — CONVERGENCE INSTRUMENTATION (amendment L; no flag — this wave is
measurement, envelopes, and certification rows)
- **The war-duration distribution envelope:** tail and no infinity — most wars
  short, some long, a few generational, NONE alive at the soak's full horizon
  (a single year-300 war reds exactly as the trillion-person settlement did).
  ~~BLOCKED on WR-0c item (4) (added 2026-08-02, self-audit): the duration envelopes
  must state which constant defines a year — the engine's 52-week year or
  peaceTerms' 12-tick one — before they are authored.~~ **UNBLOCKED 2026-08-02:**
  current treaty and WR-9 calendar envelopes use the canonical 52-week year;
  persisted legacy treaties retain their explicit twelve-tick provenance marker and
  are evaluated on that historical cadence rather than silently rescaled.
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
**Lifecycle paths (added 2026-08-02):** this wave adds NO persisted world state —
envelopes, certification rows, and receipt fields only.
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
  [CORRECTED 2026-08-02 (fp-audit) — cross-program twin of FP-TRADE §3's note:
  the trade-rights components (exclusivity / market access / toll exemption) do
  not exist in the tree and land only at FP-TRADE's TR-5; until TR-5 lands,
  the bundle composes streams/stores/allyship/settlements/peace only — graceful
  degradation, declared in both programs (DESIGN_FP_TRADE.md §3 Seam One).]
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
  the seller's believed valuation of the bundle clears its reserve OR the buyer's
  OWN believed ceiling is reached — whichever comes FIRST. [CORRECTED 2026-08-02
  (self-audit): amendment S states the clearing rule twice — the OVERLAP
  definition ("seller's reserve under buyer's ceiling") is the binding one, and
  the stacking sentence is the search procedure INSIDE it; read literally,
  seller-reserve-only would make every offered trade clear and overpayment the
  guaranteed outcome instead of the characterful one. Ceiling-reached-before-
  reserve-met is a NAMED no-trade outcome carrying a receipt — the whitePeace
  precedent: the machinery ran and produced nothing. Amendment S's RECONCILED
  note states the SAME rule as a two-sided conjunction — (i) seller's own-lens
  bundle value ≥ reserve AND (ii) buyer's own-lens asset value ≥ bundle cost;
  "ceiling reached before reserve met" is (ii) failing. One rule, stated in
  both docs; verified identical 2026-08-02 (self-audit).] Each side
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
  evaluator into the envoy layer. REFINED 2026-08-02 (self-audit): the tree exposes
  no per-party seam, so the ruling's mechanics are the TWO-PICTURE CONTRACT +
  the advanceTreaties call-site injection — §3 THE SEAM MECHANICS is part of this
  ruling.
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
- **J-WR-13 (the census STOP rule — REWRITTEN 2026-08-02, self-audit; the first
  issue claimed the §2 rows were already corrected while the table stood
  unamended, and undercounted the corrections):** SIX census overstatements are
  KNOWN and now corrected in place or by a pre-build ruling: (1) "jailed applies to any named soul" —
  false; jailed is the corruption-exposure path only, and the foreign-guest hold
  is named NEW WORK in WR-7b; (2) the disposition row — the tree already carries
  the single-channel dispositionStats substrate, so WR-2 extends, never duplicates
  (J-WR-11); (3) "14 peace mirrors" — 13, verified by enumeration; (4) WR-3's
  three named satellite paths did not mint campaign members, corrected by its
  owner-delegated graduation ruling; (5) WR-4's claimed existing temporal
  belief-ratio trend does not exist, corrected to consecutive qualitative pulse
  receipts; (6) P1/P1a does not account named people spent by war, so WR-4 reads
  only the attacker's own conscript share of the conserved aggregate deployment
  bank (net of allied/vassal source levies) and skips `{npc}` prose. STANDING
  RULE: any implementer finding another census overstatement STOPS and reports
  before correcting or building on it.
- **J-WR-14 (the atrocity pair, added 2026-08-02):** the atrocity-coalition casus
  lands as `atrocity_answer` ↔ `atrocity_atoned`, minted from BELIEVED razings per
  J-WR-7's news-speed discipline. Names vetoable; the structural need (walker
  totality + bijection, and R2's both-polarity switch) is not. VETO rides moral
  outrage on `grievance` at extreme magnitude with no new casus — and records why
  the taxonomy is not extended.

## §7 THE TUNING SURFACE (owner-signed at the soak redo, per THE PROMISE)
Every band named in §5, gathered: WR-1 term weights + deciding margin · WR-2
learn/decay/threshold-cap bands · WR-3 inversion + claim cap · WR-4 trajectory
margins + home-front acceleration · WR-5 books weights + refusal costs + re-read
discount · WR-6 apportionment weights + adequacy + exit costs · WR-7 envoy caps +
mutation + interception + close-vote + widening + ransom + vetting · WR-8
overwhelming + extremity + severity→tiers + escape + license bands + observer-
alignment consequences · WR-9 envelope shapes. Every one banded, none a bare float
on a surface, all in one tuning table per wave (the house idiom).
Added 2026-08-02 (self-audit): WR-6 join-bar + refusal-cost bands · WR-8
atrocity-casus decay + the feasibility-asymmetry DIRECTION (a signed band, pinned) ·
the peace-terms TIME-BASE constant (WR-0c item 4 — [RULING LANDED 2026-08-02:
current `52 == INTERVAL_WEEKS.one_year`, persisted legacy `12`, selected per treaty;
the original "whichever arm" fork is closed]) · the map km-scale for the transit kernel's mode
table (J-D11(b); does not exist in the tree — owner-signed when the mode table
lands).

## §8 HERALD + LEGIBILITY CONTRACT (the sentences this program must be able to say)
The legibility law is an acceptance criterion, not decoration. Each wave's receipts
must be able to produce, in the house voice, at minimum:
- "why is this war still going?" answered by the deciding term (WR-1)
- "the war outlived its reason — men still dying for a god nobody worships" (WR-1)
- "the Margrave sued for peace" vs "the realm sued for peace" (WR-5)
- "they went home" / "they stayed" — the ally's temperament (WR-6)
- "they were called, and would not come" — the remembered refusal (WR-6)
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

**THE STANDING PRE-SOAK ORDER (prepended 2026-08-02, self-audit — the owner's queue
ruling, recorded in DESIGN_REALM_DIRECTIVES.md Progress 2026-08-01 and carried in
docs/FABLE_VALIDATION_QUEUE.md, was issued the same day as this volume and the
volume never carried it):** WR-0 (landed) → P5 (landed @ 47b4ed9d) → WR-0c (items
1–3 landed; item 4, the time-base ruling, ~~OUTSTANDING~~ LANDED 2026-08-02) →
THE LIGHTING BATCH
(including `demographicsEnabled`) → the release grid + 300y rerun → tuning. The
WR-1..WR-10 waves BUILD DARK and may proceed after WR-0c per the build order below;
their flags are NOT in the standing lighting batch — they light at the owner-signed
soak redo, in build order, after `demographicsEnabled` is lit (§3's flag-dependency
ruling).

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
