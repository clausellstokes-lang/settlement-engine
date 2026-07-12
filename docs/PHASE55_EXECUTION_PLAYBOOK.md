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

## 0.4 THE DISPATCH ORDER (the ladder — sequential chain, ONE optional chip ahead)
CURRENT (as of this writing): FP-1 in flight (budget-exclusive) · W5 chip in its worktree ·
Session/Foundry branch awaiting merge review (§7.2).
1. FP-1 lands → commit → note the NEW budget number.
2. Dispatch SEASONS-A (brief: SEASONS_A_BRIEF.md) in the main session.
   SIMULTANEOUSLY (optional, if lanes allow): chip 5.5-K (KEYSTONE_BRIEF.md) in a worktree —
   the ONE safe parallel wave (disjoint fence, no entry bytes, longest critical path).
   Also: run the §7.2 Session/Foundry merge review.
3. SEASONS-A lands → commit. Keystone lands → merge per §7.1 + commit.
4. Dispatch 5.5-M (MODULATION_BRIEF.md — verify the committed digest shape first).
5. 5.5-M lands → commit → dispatch STEP 3.5 (the full spec is §3 of this playbook).
6. 3.5 lands → commit → dispatch WAVE A (the full spec is §4 of this playbook).
7. Wave A lands → commit → THE LIVING REALM CHECKPOINT (§5) → Phase 6 (§6).
CONCURRENCY LAW: never more than TWO heavy lanes total (incl. chips); the budget-touching lane
runs exclusive; never chip a wave whose upstream interface is uncommitted.

## 0.5 Session-limit recovery (proven twice)
On an agent death at a limit boundary: (1) verify tree state (`git status` + mtimes — what did it
write?); (2) SendMessage to the SAME agent id (resumes from transcript, context intact) with a
state briefing: what exists unstaged, what remains, any tree changes since dispatch, "do not
rewrite what exists"; (3) if the tree went quiet 15+ min with no completion, ping the same way.

## 0.6 The parking lot (append here; do not act without a ruling)
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

# PART 5 — THE LIVING REALM CHECKPOINT (definition of done)

The shippable milestone. It is REACHED when all of the following are committed and green:
1. The ladder through Wave A (FP-1, SEASONS-A, Keystone, Modulation, 3.5, Wave A) + the W5 and
   Session/Foundry merges (§7).
2. The LIVING REALM PRESET delivers, on a premium canonized realm: mapped geography (digest),
   seasons (food year), distance-weighted trade/faith, perfect-but-delayed news (or unreliable if
   the DM dials it), routine autonomy with major-approval, belief-sourced war posture with legible
   misjudgments, ruleset receipts. Free/anon/legacy campaigns: byte-identical to today.
3. THE CHECKPOINT SOAK: whole-world-soak extended to run the living_realm preset on a canonized
   spatial fixture — 30 years, byte-identical re-run, bounded populations (⚠️ OWNER: review the
   population-attractor tuning finding from the W0 soak BEFORE this preset inherits war depth),
   stressors non-frozen post-seasons (the stasis fix evidenced), rumor/belief ledgers bounded.
4. A FULL manager validation pass (the §0.3 checklist over the combined tree + an adversarial
   premium/faith-seam sweep — the wf_59bcd3b3 pattern).
5. 🔱 FABLE-ON-RETURN: the checkpoint grade-check (mini re-review of affected dimensions) — if
   Fable is unavailable, Phase 6 may START but not SHIP without it.

# PART 6 — PHASE 6: LAUNCH READINESS (runs at the checkpoint)

Sequenced program (each its own fenced wave, same protocol):
1. DATA LIFECYCLE — pre-launch: schema/migration audit (the head/net-current ledger, fusion specs
   per memory/wave0-migration-audit.md), storage quotas, export/delete completeness (GDPR-shaped),
   anon→free→premium upgrade paths carry all state. At-launch: seeding, onboarding fixtures,
   the landing fixture regen (memory: phase5-engine-companion-complete NEXT item). Post-launch:
   backup/restore discipline, migration-forward policy (the CL-0 ruleset + cost-law receipts are
   the versioning pattern), telemetry review (EVENTS.* audit — no PII, no deity leaks).
2. THE PUNCH LIST — sweep the parking lot (§0.6), the round-21+ backlog triage (§8.2 — what
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

# PART 7 — MERGES + IN-FLIGHT (the near-term desk)

## 7.1 Merging worktree branches (W5, Session/Foundry, keystone-if-chipped)
Protocol per branch: (1) read ITS report/commits; (2) rebase onto current HEAD (or merge if rebase
is noisy — prefer rebase for linear history); (3) resolve conflicts PREFERRING HEAD's constitutional
seams (budget test, simulationRules, worldState) and the branch's own feature files; (4) run the
FULL battery on the merged tree (this is where parallel lanes pay their serialization tax — budget
for it); (5) the faith/premium adversarial check on any branch adding surfaces (Session/Foundry's
faithEventFilter seam gets the FaithSection-equivalence test treatment: free/anon fixture, no
deity names, gate load-bearing); (6) exact-stage commit.
## 7.2 Session/Foundry branch (claude/peaceful-volhard-0ad3f1, 5 commits) — review AFTER FP-1
lands (it adds UI surfaces against a budget FP-1 is rewriting). The faithEventFilter seam is the
sensitive read. W5 (worktree amazing-euclid) merges when its session ends, same protocol.

# PART 8 — POST-LAUNCH TERRITORY (designed, deliberately deferred — DO NOT BUILD PRE-LAUNCH)

## 8.1 The heavy-mover ladder (each = mover + its CO-BUILT BRAKE + its OWN soak; order binding)
1. EMBATTLEMENT ROUTING — the ramp + security counterforce + hysteresis band (PART II §II.3-3);
   brake: min-dwell + continuous scalar. Unlocks cheap-vs-safe routing.
2. CARAVANS/SUPPLY-STARVATION — per-institution links, in-transit ledgers, the SUPPLY-STARVED
   impairment generalizing blockadeTransport (PART III trade grounding); brake: multi-source
   allocation ≥2 paths asserted for critical inputs (PART II §II.3-3-fix). Siege-as-interdiction
   replaces the capacity-roll core AFTER this lands (war pillar thin-spot #2).
3. SEASONS-B — winter travel multipliers on the cost field (the §4i spatial half; the seasonal
   overlay slot materializes; versioned under costLawVersion).
4. MIGRATION-WITH-MORTALITY — §4c full model; brakes: congestion pushback, scatter-floor (forbid
   'concentrated' under spatial), the conservation-ledger soak (Σarrivals+Σdeaths==Σdepartures);
   reconcile the 0.45 origin-loss proxy (PART II §II.3-3).
5. ARMY-TRANSIT + FIELD COMBAT — position-along-path ledgers, collision→field battle, travel
   fatigue, the bounded sigmoid resolver (§5); war pillar thin-spot #1 closes; reinforcements as
   armies-in-transit (round 12); brake: the no-hand-of-miracle clamp + exhaustion homeostasis
   (already built).
6. ENTREPÔT/TOLLS — intermediary-frequency growth + toll economics; brake: toll-greed reroute +
   congestion + maintenance (V.6 — NO trade-side damping exists yet; co-build, the VI.1 correction).
7. CONTRABAND/SMUGGLE — gate policy + risk-tolerance smuggling (rounds 4/6); the per-gate pipeline
   order: smuggle→intercept→confiscate→toll (PART II §II.3-4-e); brake: conscience + detection.
8. SEA LANES MATERIALIZED — the §4j reserved slot lights up: port eligibility (geography ∧
   institutions), naval blockade, piracy, storm season, ship-crew carrier. Ports re-derive on
   founding events.
9. WAVE B — faction belief maps (carriers=organs, round 14), objective-parameterized scoring with
   the NEW non-war move levers (VI.3), moral drift (alignment consumers light up), ally-intel/
   betrayal (round 11), teleport blocs, the war INITIATE/RESOLVE SPLIT (unlocks war DM-Driven).
10. CL-3 — approval-queue extensions (thresholds, hold-then-expire ⚠️ OWNER: expiry policy),
    Living/Autonomous progression (⚠️ OWNER: advance-on-open catch-up wanted?), Recommendations
    rationale surface.
Each mover wave ALSO lights its carrier in the rumor network (round 9: the carrier ships WITH its
mover) and re-runs the checkpoint soak with the new layer on.

## 8.2 The round-21+ backlog (frozen out of v1; triage at Phase 6 ⚠️ OWNER)
W2-style voice sidecars for war/faith/trade news (the pillar-inventory prescription — cheap, high
value, candidates for EARLY post-launch or even Phase-6 punch-list graduation); numeric prices;
miracles/divine-agency + lived-practice faith content (rituals, holy days, named clergy); peace
treaties/negotiated terms; ruins-as-artifacts (destroyed settlements become preserved dossiers +
adventure sites); map-as-legibility-surface (fronts/embattlement/trade-flow rendered on the realm
map); warding-vs-scrying info-defense; feed retention (non-recency major-arc pinning, the 240-cap
scale fix); the two temporal structural notes (mergeStressorUpsert bornTick; dead wallClockNow
pre-stamps); dramatic_campaign preset depth review; population-attractor retune (from the W0 soak).

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
