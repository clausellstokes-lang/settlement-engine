# EPISTEMIC PREVENTION PROGRAM — test-truthfulness machinery + exhaustive sweeps

**Owner authorization:** "do it all" (2026-07-27), in response to the three standing
epistemic hazards named after the generation-lane close. **Worktree:**
`.claude/worktrees/minifold`, branch `claude/composite-r4` (tip 1af6cd0c at program
start; the tree is LIVE with concurrent sessions — 179 dirty/untracked files at start,
**zero overlap with this program's 99 target files**, verified 2026-07-27).
**Manager:** Fable session (architecture, verification, integration, commits).
**Implementers:** Opus agents per the owner's standing model split.

## The three hazard classes being closed

1. **Seeded tests report lower bounds.** A multi-seed `for` loop inside one `it()`
   stops at the first failing seed (the 30/100 failure vitest reported as 1), and a
   sampled corpus cannot prove a predicate branch is reachable at all (the
   mutually-exclusive `!isProtected(x) && matches(x)` conjunction).
2. **Drift-neutered negative assertions.** `not.toContain` against a subject that
   drifted out of the collection entirely goes vacuously green (the `re-rt-1`
   roster case, found and fixed once — the class is unenforced).
3. **Coarse distribution instruments.** Hand-picked integer bounds at small N can
   pass with exactly zero margin (the capture bound: 4 against 4 at N=40).

Exhaustive here means: every discovered mechanism becomes standing machine
enforcement, and every existing instance is swept. It does not claim the absence
of undiscovered epistemic failure modes; the mutation sweep remains the general
detector for tests-that-don't-test.

## Program laws (every agent, every wave)

- **VERIFY FIRST:** before any edit, `git -C <worktree> branch --show-current` must
  print `claude/composite-r4`, and `git status --porcelain -- <file>` must be EMPTY
  for every file you are about to edit. A dirty target = SKIP it and report; a
  wrong branch = STOP.
- **NO git mutations:** no stage, no commit, no stash (FORBIDDEN), no reset/checkout/
  clean/restore. The manager does all staging/committing, surgically.
- **Test-side only:** this program edits `tests/**` and `docs/` and creates
  `tests/fixtures/distribution-envelopes.manifest.json`. NO `src/**` edits. Any src
  defect an anchor or probe reveals is a FINDING to report, never a thing to patch.
- **Never loosen a bound.** A derived bound looser than the current one keeps the
  current bound in effect and is reported for the owner queue.
- **Never weaken or delete an assertion to get green.** A precondition that fails
  is a finding (possible real dead code — the cart-shed precedent), not an obstacle.
- **NUL hazard:** never write a quoted single-character separator via Edit; use
  template literals (`authored-nul-byte` incident, 2026-07-27).
- **Never name an inline fixture `NNN_*.sql`** (migrationRefIntegrity trap).
- **Shared files are manager-owned:** `scripts/mutation-coverage-manifest.json`
  (foreign-dirty right now) and walker allowlists are edited ONLY by the manager at
  integration. Agents report what entries/shrinks are owed.
- Match house test style: rich JSDoc header stating the law and the idiom, explicit
  frozen manifests, `fs` walks like `tests/lib/spatialLedgerCoverage.walker.test.js`,
  helper conventions like `tests/helpers/dormancyOracle.js`.

## Wave EP-1 — machinery (helpers + walkers)

New files, all currently non-existent (verified):

**`tests/helpers/anchoredNegatives.js`**
- `expectPresentThenAbsent(before, after, member, context?)` — asserts `before`
  contains `member` (the liveness anchor), then asserts `after` does not. Arrays
  and strings, `toContain` semantics.
- `expectAbsentWithAnchor(collection, member, anchor, context?)` — asserts `anchor`
  IS in `collection` (proving the collection is live and correctly shaped), then
  asserts `member` is not.
- Escape hatch for structurally-anchored sites: the inline annotation
  `// anchored: <why this negative cannot go vacuous>` on the assertion line.

**`tests/helpers/seedFailures.js`**
- `collectSeedFailures(items, fn)` — runs `fn(item, index)` for EVERY item,
  catching per-item; returns `[{ item, index, message }]`.
- `expectNoSeedFailures(failures, label)` — asserts empty with a message carrying
  the full count and list (the truthful-totality report).
- File-level exemption marker for loops that are already truthful:
  `// seed-loop: collected` (with justification) — `it.each` loops are exempt by shape.

**`tests/helpers/distributionEnvelope.js`**
- Exact binomial tails in log space: `binomialTailAtLeast(n, p, k)`,
  `binomialTailAtMost(n, p, k)` (no dependencies; log-gamma via Lanczos or
  summation — implementer's choice, property-tested against known values).
- `envelopeBound({ n, baseRate, direction, alpha = 1e-4 })` → smallest bound with
  tail probability ≤ alpha; returns `{ bound, expected, sigma, margin }` where
  `margin = |bound − expected| / sigma`.
- `readEnvelope(manifest, id)` — tests read their bound from the manifest entry
  (one canonical truth; no hardcoded bound drift).

**`tests/lint/negativeAssertionAnchor.walker.test.js`** — scans
`tests/generators|joins|simulation|property` for bare
`not.toContain|not.toMatch|not.toHaveProperty` not on a helper call line and not
carrying the `// anchored:` annotation. Frozen per-file allowlist (exact counts,
shrink-only, netCurrentExtractorAnchor idiom), initialized to the current scan
(55 files / ~115 sites), regenerable via `UPDATE_EPISTEMIC_ALLOWLIST=1` which
PRINTS the fresh map (never auto-writes).

**`tests/lint/seedLoopTotality.walker.test.js`** — scans the same trees for `for`
loops over seed-like iterables containing bare `expect(` in the loop body inside a
single test callback; exempts `collectSeedFailures` users, `it.each`, and the
marker. Frozen allowlist (33 files), shrink-only, same regen path.

**`tests/lint/distributionEnvelopePower.test.js`** — loads
`tests/fixtures/distribution-envelopes.manifest.json`; for every entry recomputes
`envelopeBound` and asserts (a) the registered bound matches the derivation,
(b) `margin ≥ 2` and never zero, (c) provenance fields present (`baseMeasuredAt`,
`baseMeasurementN ≥ 400`, `measurementContext`); totality: a frozen list of
distribution-shaped test files must each either import the helper or carry a
registered rationale.

Manifest entry schema:
```json
{ "id": "capture.city.rate", "file": "tests/simulation/…", "n": 400,
  "baseRate": 0.0675, "baseMeasuredAt": "2026-07-27", "baseMeasurementN": 400,
  "direction": "upper", "alpha": 0.0001, "bound": 42, "margin": 2.9,
  "measurementContext": "minifold composite-r4 1af6cd0c + live-tree dirt",
  "loosenPending": false, "notes": "…" }
```

## Wave EP-2 — the sweeps (parallel, disjoint partitions)

- **Agent A:** anchor all bare negatives in `tests/generators` (37 files). Prefer
  the helpers; use the annotation only where the anchor is genuinely structural.
- **Agent B:** anchor `tests/joins` + `tests/simulation` negatives (19 files), and
  convert the 12 `tests/joins` seed loops to `collectSeedFailures`.
- **Agent C:** convert the 18 `tests/generators` + 3 `tests/property` seed loops.
  `tests/property/generatorGoldenMaster.test.js` is precious: minimal diff,
  IDENTICAL semantics, goldens must stay byte-identical (test-file-only change).
- **Agent D:** distribution instruments. First classify the 11 candidate files
  (which are actually rate/count-bound instruments); measure each base rate at
  N ≥ 400 with deterministic probe scripts (scratchpad); migrate each instrument
  to `readEnvelope` + manifest entries; loosenings → `loosenPending: true`, current
  bound stays live; tightenings adopt the derived bound only when the fresh
  measurement passes it with margin. Every edited file's focused suite must run
  green (or the red is a reported finding with the probe evidence).

## Wave EP-3 — effect reachability (parallel with EP-2)

**`tests/generators/effectReachability.coverage.test.js`** ("coverage" token is
deliberate — it opts the file into the E-A enumeration rule). A registered
EFFECT_MANIFEST of authored pipeline effects, each with a receipt/dossier-level
detector, asserted to fire ≥ 1 time across a deterministic corpus (reuse the
certification-corpus config builder; add targeted configs per effect, each with a
comment explaining the targeting; keep total runtime ≤ ~10 s). Initial roster:
standard subsumption absorption · custom-target subsumption absorption · cascade
seat addition · isolation magical-transit substitution · each coherence-repair
action kind · chain magic substitution reaching `substituted` · faction-pulled
institution present AND economically reconciled · cascade-borrowed seat carrying
`required: false`. Failure message names the effect and says the authored stratum
may be unreachable (the dead-strata class this kills).

## Wave EP-4 — integration (manager only)

E-A manifest entries for the four new enumerated tests (surgical staging around
the foreign-dirty manifest via patch-apply to the index); allowlist shrinks
regenerated once from a fresh scan; focused walkers green; full suite bare with
per-name triage against the lane-close baseline; two commits
(1: machinery + reachability, 2: sweeps + shrunk allowlists); doctrine addendum in
`docs/GENERATION_CONTRACTS.md`; ledger row + owner-queue items on the ledger
branch; memory; backup-push decision recorded vetoably.

## Progress

> **2026-07-27 (program start):** Plan written. Targets measured: 55 negative-assertion
> files (~115 sites), 33 seed-loop files, 11 distribution candidates; zero overlap
> with the live tree's 179 dirty files. EP-1 + EP-3 dispatched.

> **2026-07-27 (waves complete, integration):** EP-1 froze the true habitat at 55
> files / 181 sites and 19 files / 32 loops. EP-2 swept it: negatives 181 → 2 (both
> deliberate honest-bare findings: `tuningBatchE2` VS16-over-empty-icons,
> `subsumption` unreachable tanner-rule guard), loops 32 → 0 (21 converted, 3
> justified declines). EP-3 registered 10 reachable effects and recorded THREE
> UNREACHABLE repair strata with evidence. EP-2D registered 5 powered envelopes
> (2 tightened, 1 loosenPending), reclassified 7 roster files as non-stochastic,
> found a second unrescuable zero-margin bound and the corpus-specific base-rate
> law. Manager rulings, all vetoable: single atomic commit (the planned two-commit
> split fails per-commit HEAD-greenness — allowlists, roster and E-A entries are
> mutually referential); A1's stronger-pin deviation on two legitimately-empty
> collections ACCEPTED; eleven explicit corpus-test timeouts added (house 60_000
> precedent; raw costs measured 27–66 s vs the 20 s default); the
> `envelopeBound(direction:'lower')` O(answer·n) search cured with an ascending
> incremental pass settled against the canonical tail (EP-2D finding 5), pinned at
> calamity scale. The E-A entries for this program's four tests were authored by a
> CONCURRENT session (with fold-coupling kindNotes); the claimed coupling of
> `effectReachability` to uncommitted src was probed in a detached worktree at HEAD
> 20c195e7 and REFUTED — the gate is HEAD-green standalone.
>
> **Post-fold obligations (deliberately deferred, not dropped):** standing sweep
> plants for the three new walkers + effectReachability become E-A-eligible once
> tracked (each kindNote says "add the standing plant when the wave folds");
> calamity.test.js migration is measured-and-ready (upper 169 tightening, lower 100
> stays) now that the helper completes at n=15,053; the seed-loop walker's widening
> (body-mentions-seed: 29 files / 54 sites; `.forEach`/`.map` unscanned; five more
> early-exit loops in ordering.test.js) is a deliberate re-freeze decision;
> `distributionEnvelopes.test.js` awaits the owner's N=50→400 runtime call;
> follow-up migration candidates: ancientRuinsGeneration, roadsMissions,
> ordering.test.js:231/236 (a real two-sided rate instrument).
>
> **Fold gate (executed 2026-07-27, full `npx vitest run`, complete capture):**
> 19,724 passed / 12 failed / 35 skipped across 1,961 files, 747 s. ZERO failures
> in this program's files; all five program gates green inside the suite. The 9
> failing files are name-attributed foreign: advancePauseResume (red AT HEAD
> 355d9eb0 — pre-exists all uncommitted work) · mechanismLitCoverage (red only
> in-tree: foreign untracked rosterProvenance.test.js gave tierOutcomeApply lit
> coverage; that lane owes the registry strike) · townScene3dLazy (3D lane /
> stale-dist class) · voiceMechanics (voice-budget lane, bang budget at zero
> headroom) · deepCraftKillList · guidanceRegistry.walker ·
> domainAnyCastBaseline · migrationRehearsal (mig 191 landed same day by the
> AI-ladder lane) · pipeline.property (the ledger's documented known flake).

> **2026-07-27 (EP-5, the unclaimed tail — owner "continue"):** all three EP-2D
> follow-up instruments CLOSED and rostered (roster 12 → 15, baseline unchanged
> at 3): ordering's two-sided siege pair (the relative-ratio assertion KEPT
> beside the absolute envelope — they red on different worlds), ancientRuins'
> two-sided mint pair (N=40 proven unable to carry a two-sided instrument at
> 2σ — corpus doubled to 80 for 135 ms, vetoable), roadsMissions' cadence pair
> (EP-2D's variable-denominator concern dissolved: 12 NPCs × 3 years = 36 fixed
> Bernoulli trials, guarded). Six envelope entries registered; no corpus/family
> divergence anywhere (the envelope-${'{'}i{'}'} corner did not repeat). Eight more
> loops converted to truthful totality; one pure accumulator declined with the
> marker; negative control executed (a planted break reported the TRUE 11-of-80
> count). One more explicit timeout (siege test, fake-red verified via ps at
> load 90). NEW SRC FINDING for the owner queue: the roads ≤1-journey-per-
> NPC-year law is VIOLATED on 5 of 16 seeds (dominion/embassy/observance/
> diplomacy at a city seat) — the original test was green over a corpus of one.
> NEW OWNER PICK: ordering.siegeSuppression.unwalledFloor loosenPending (live
> 10 vs derived 6).

> **2026-07-27/28 (EP-6, src-side repair — owner "continue" on EP-g + EP-l):**
> Four parallel investigations, then two implementation waves; every fix
> measured before shipped. VERDICTS: `access_compatibility` was NEVER
> unreachable — EP-3's evidence missed the forbidden-list/inclusion-list
> polarity gap on the `mountain_pass` route; promoted to EFFECT_MANIFEST with a
> specimen, and the new zero-occurrence EXCLUSION RATCHET now holds the two
> remaining strata honest. `mutual_exclusion`: blockedBy was never authored in
> the project's entire history; the working mechanism is exclusiveGroup (0/400
> coexistence); authoring data measured HARMFUL; retirement (0/400 output)
> queued EP-g1. `hard_dependency`: real bug, but the audit's literal fix is a
> MEASURED REGRESSION (17 of 65 self-satisfying gates are legitimately vacuous
> via the roster ladders); the correct ladder-aware fix moves 41% of golden
> keys → parked for the T4 ONE REGEN batch (EP-g2). EP-l WITHDRAWN as an
> instrument artefact (release legs double-counted; genesis violations 0/17;
> the charter test had it right from birth) — its real yield was SELF-CAPTURE:
> a court taking its own envoy hostage, fixed in all four land arms of the dark
> roads kernel (genesis counts byte-identical; sea-piracy sibling chip-filed,
> EP-p). SHIPPED with zero golden movement (A/B-proven against the concurrent
> deity-lane's in-tree drift): §14 custom-subsumption trace (receipt parity),
> the generic skip-with-receipt for unrepairable violations (trace lane, never
> the user-visible repairs count; step-scoped dedupe proven load-bearing), the
> furrier→tannery producer-eating rule DELETED (confirmed severing leather on
> 46/46 firings when DM-forced; protectedProducers ratchet has teeth both
> directions), and the subsumption tanner-guard rewritten live — the anchored-
> negatives habitat is now 1 file / 1 site (EP-e only). Law text amended on the
> ledger branch (DESIGN_THE_ROADS §4/§19: cadence governs GENESIS; release
> legs resume). New owner picks: EP-n (roads floor 4 vs derived 3), EP-o
> (mission-id reuse persistence shape), EP-p (seaRoads S3 guard + gauntlet
> pins, chips filed). Durable facts to memory: cascade tier-window, plagued
> military floor, step-vs-call dedupe scope, list-polarity gap.
