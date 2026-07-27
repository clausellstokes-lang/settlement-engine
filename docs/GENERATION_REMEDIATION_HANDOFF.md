# Generation remediation handoff

**Audience:** the next human or AI engineer continuing this exact task  
**Worktree:** `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold`  
**Branch:** `claude/composite-r4`  
**Starting HEAD observed by this task:** `8033ddbe`  
**Handoff state:** implementation substantially complete; golden review and the
full repository gate remain

## Read this first

The owner asked for the two attached generation audits to be fixed
comprehensively, with the best architecture rather than the smallest patch:

- `/Users/cstokes/.codex/attachments/c961a1cb-1db6-493e-b359-aed622435de0/pasted-text.txt`
- `/Users/cstokes/.codex/attachments/e51bda45-26c7-46bd-902f-bf53dbbae192/pasted-text.txt`

The worktree was already extremely dirty and contains several concurrent
product programs. Do **not** use `git reset`, `git checkout`, `git clean`,
`git stash`, broad mechanical rewrites, or any command that could discard
unrelated work. Do not stage or commit unless the owner explicitly requests it.

The governing architecture is documented in
[`GENERATION_CONTRACTS.md`](GENERATION_CONTRACTS.md). Treat that document and
the code as a paired contract.

## Owner intent

The goal is not merely a shippable patch. The owner wants the highest-fidelity
and most maintainable design available, is willing to accept migration risk for
an objectively better result, and does not want major features removed unless
there is a better replacement. New code must match the existing Fable/Claude
style: de-minified, explicit, commented where reasoning is load-bearing, and
readable by a second human or AI engineer.

## Architectural decisions already made

1. **One transient world law.** `GenerationContext` captures resolved facts;
   immutable `GenerationWorldLaw` owns magic, route, institution, role,
   service, secret, history, and generated-content eligibility. Functions are
   never serialized.
2. **One persisted resource authority.** Native/custom membership and depletion
   live in `settlement.config.nearbyResources*`. Resource analysis, active
   chains, production, imports, exports, food, prose, and World Pulse are
   projections of that authority.
3. **Culture is an honest, bounded tradition layer.** Eleven complete profiles
   materialize seed-stable names and a structured local design grammar covering
   built form, civic pattern, exchange, foodways, sacred life, defense, social
   texture, and architecture. Small institution odds provide mechanical
   texture without pretending to simulate an entire historical society.
   `mediterranean` maps to `latin`; unknown authored values resolve to `mixed`.
4. **Generated themes are explicit policy.** `heroic`, `grounded` (default),
   `grim`, and `custom` profiles govern content introduced by the generator.
   They do not rewrite player-authored/custom prose.
5. **Isolation is a support model, not a teleport rule.** Local foodshed,
   hinterland, reserves, seasonal access, and patronage are legitimate.
   Magical transit is a last substitution for a real gap in functional
   high-magic settings.
6. **Random hard contradictions are repaired deterministically.** The
   post-institution repair pass consumes no RNG, protects authored requirements
   and exclusions, records every action, and repairs threatened defenses,
   impossible access, and hard dependencies before downstream readers run.
7. **Certification is separate from repair.** Final assembly emits an immutable
   `generationCoherenceReceipt`. It audits templates, grammar, world law,
   content boundaries, resource truth, structure, food verdicts, NPC identity,
   and isolation support without mutating the dossier.

## Implemented work

### World law and generated-content policy

Primary files:

- `src/generators/generationContext.js`
- `src/generators/steps/buildGenerationContext.js`
- `src/domain/generationContentProfile.js`
- `src/generators/generationCoherence.js`
- world-law wiring across institution, cascade, service, NPC, faction, history,
  economic-chain, regeneration, and assembly producers

Important behavior:

- `magicExists:false` and resolved magic priority `0` both prohibit functional
  magic.
- Riverside `port` means a river port; it does not grant maritime-only
  institutions such as `Major port` or `Navy (if coastal)`.
- Custom presentation labels are opaque unless metadata grants mechanics.
- Generated-content filters keep an exclusion receipt and compose with every
  world-law predicate.

### Canonical resource condition

Primary files:

- `src/domain/resourceSemantics.js`
- `src/generators/steps/resolveResources.js`
- `src/generators/computeActiveChains.js`
- `src/generators/economy/nativeEconomicInputs.js`
- `src/domain/worldPulse/resourceTaxonomy.js`
- `src/domain/worldPulse/tierResourceDynamics.js`
- `src/domain/worldPulse/resourceDynamicsKernel.js`

There is an explicit 33-key semantics registry. Positional/infrastructure
resources do not randomly deplete. Renewable, exhaustible, and magical stocks
have explicit recovery rules. Depletion/recovery updates chain condition,
production, shortage imports, and exports together. Hunting, clay, camel,
alpine, coastal-timber, quarry, coal, gemstone, and mill-site semantic
contradictions were corrected.

### Culture, themes, and isolation

Primary files:

- `src/data/cultureProfiles.js`
- `src/domain/cultureProfiles.js`
- `src/generators/isolationSupport.js`
- `src/components/ConfigurationPanel.jsx`
- `src/components/generate/WizardCloseout.jsx`

The UI now calls culture a **Cultural tradition**, explains its mechanical
scope, exposes generated-theme profiles including custom topic boundaries, and
allows explicit isolation without silently rewriting it.

### Structural, food, identity, and prose correction

Primary files:

- `src/generators/steps/coherenceRepairPass.js`
- `src/generators/economy/foodBalance.js`
- `src/generators/economy/viability.js`
- `src/generators/npcDisplayNames.js`
- `src/generators/historyTemplate.js`
- `src/generators/narrativeGenerator.js`
- `src/generators/power/governanceNarrative.js`
- `src/generators/safetyProfile.js`

Notable corrections:

- Plagued settlements receive tier-plausible perimeter and defending force.
- An isolated mountain settlement cannot randomly retain a Fishmonger.
- A food deficit above the hard threshold cannot be summarized as
  self-sufficient.
- Duplicate notable NPC names receive deterministic role-qualified display
  names.
- Current-tension tokens use the same total renderer as timeline events.
- Port/river language, city/metropolis scale, town/city watch language,
  subject agreement, doubled articles, terminal punctuation, and lower-case
  sentence joins are covered.
- High magic/religion settings are either visibly realized or explicitly
  explained when settlement scale constrains formal infrastructure.

### Persistence, owner surfaces, and documentation

Primary files:

- `src/domain/settlement.schema.js`
- `src/pdf/lib/generationContracts.js`
- `docs/GENERATION_CONTRACTS.md`
- `src/components/new/tabs/ViabilityTab.jsx`

The structured culture identity and coherence receipt persist and appear in
owner-facing dossier/PDF projections. Function-bearing world law remains
transient. AI overlay selection cannot erase canonical contract facts.

## Permanent certification

`tests/generators/generationCertificationCorpus.test.js` is the whole-dossier
gate created from the audit methodology:

- 55 specimens: eleven deliberately different profiles × five stable seeds;
- all six tiers, all eleven cultures, every route family, mundane/high magic,
  heroic/grounded/grim themes, and threatened/isolated cases;
- ten exact population boundary cases;
- one byte-for-byte replay per profile;
- finite-number, tier-range, receipt, priority-realization, and diversity
  assertions.

Do not weaken this corpus to accommodate a failing seed. Inspect the receipt,
fix the owning producer, and keep the seed as regression evidence.

## Validation checkpoint

Confirmed green before this handoff was written:

- resource lane: 17 focused files / 285 tests;
- world-law lane: 20 focused files / 106 tests, plus 6 files / 32 integration
  tests;
- persistence/PDF lane: 12 files / 115 tests;
- latest narrative + contract + 65-settlement certification group:
  4 files / 57 tests;
- `npm run typecheck`;
- `npm run typecheck:domain:strict` at 0 errors;
- targeted ESLint for each lane;
- repository ESLint with 0 errors and 25 pre-existing warnings;
- size-ratchet tests for the extracted generator modules;
- scoped `git diff --check`.

The repository-wide gate has **not** yet been completed after the intentional
generator behavior changes.

## Exact continuation sequence

1. Run the focused merged suite covering all new generation contracts.
2. Run `npm run typecheck`, `npm run typecheck:domain:strict`, `npm run lint`,
   and `npx vitest run tests/lint/sizeBaseline.test.js`.
3. Run `npx vitest run tests/property/generatorGoldenMaster.test.js`.
4. Review every golden family that moved. These changes are intentionally
   output-changing, so do not “fix” correct behavior back to stale snapshots.
5. If and only if drift is explained by the contracts above, use the golden
   test’s documented update path and add a precise entry to
   `docs/GOLDEN_SHIFT_LEDGER.md`.
6. Run `npm run check`; then `npm run check:edge-behavior`.
7. Run `git diff --check`.
8. Inspect the relevant diff for readability, stale comments, accidental
   minification, and unrelated overlap. Update this handoff with final evidence.

## Known non-blocking context

- Repository ESLint currently reports 25 warnings in pre-existing concurrent
  UI/domain work; it exits successfully. Do not conflate those warnings with
  this generation lane.
- Dynamic-import/build warnings may exist elsewhere in the integration branch;
  judge them against the repository’s existing budgets and intended lazy-load
  boundaries.
- A full generator golden shift is expected because world law, resource truth,
  culture, theme defaults, isolation, repairs, and prose all intentionally
  change serialized output. Golden masters prove reviewed change, not semantic
  correctness; the new semantic/corpus tests are the correctness oracle.

---

# Session addendum — 2026-07-26: the repository-wide gate was run

The gate the previous section left open has now been executed end to end. This
addendum records what it found. It supersedes the "Validation checkpoint"
optimism above: **the lane is not at the finishing-touches stage — 20 tests are
red, and every one of them is caused by the uncommitted work in this tree.**

## Gate results (executed, with exact numbers)

| Gate | Command | Result |
| --- | --- | --- |
| Types | `npm run typecheck` | **exit 0** |
| Domain strict | `npm run typecheck:domain:strict` | **0 errors, ceiling 0** |
| Lint | `npm run lint` | **exit 0** — 0 errors, 25 warnings (matches the pre-existing count recorded above) |
| Size ratchet | `npx vitest run tests/lint/sizeBaseline.test.js` | **3/3 pass** |
| Generator goldens | `npx vitest run tests/property/generatorGoldenMaster.test.js` | **3/3 pass at the time of this table — SUPERSEDED, see "⚠️ GOLDEN RE-CAPTURE OWED" below**: later same-day concurrent generator edits (24 city keys) plus the owner-ratified depletion tuning (60 city keys) drifted 84 of 523 keys; the manifest is deliberately NOT re-captured mid-flight |
| Validators (×8) | `validate:data`, `custom-content-manifest`, `migration-head`, `edge`, `map`, `tuning-bands`, `foundry-module`, `mcp-server` | **all 8 PASS** |
| Whitespace | `git diff --check` | **clean** |
| **Full suite** | `npx vitest run` | **13 files / 20 tests FAILED**, 18387 passed, 32 skipped, 636s |

## Attribution is CONFIRMED, not assumed

A detached worktree was created at the committed base `8033ddbe` (with
`node_modules` symlinked, because a worktree under `/private/tmp` has no parent
`node_modules` to walk up to). **All 11 failing test files pass there: 159/159.**
No red in this tree is pre-existing. Every one belongs to the uncommitted work.

## The 20 reds, triaged by cause

### A. Seed-probe drift — was "11 reds, ONE cause"; the truth split in two. ALL 11 FIXED (2026-07-26, agent wave)

**A1 — genuine seed-probe drift, 7 reds, FIXED by re-pinning:**
`tests/joins/resourceEdits.test.js` (5),
`tests/joins/resourceDynamicsLifecycle.test.js` (1),
`tests/joins/undoLastEvent.test.js` (1). The join semantics were CONFIRMED
intact first by executed probes against every structurally valid target
(deplete/recover/remove/undo all survive regeneration), then the pins were
moved to the probed truth for the unchanged seeds (`re-rt-1` roster is now
`[marshlands, ancient_grove, coal_deposits, hunting_grounds]`, rolled depletion
`[ancient_grove]`). Bonus finding: one test in this family had gone VACUOUSLY
green (`removing a rolled-DEPLETED node` asserted `not.toContain` against a key
that had left the roster entirely) — re-anchored with a precondition. Hazard
for auditors: seed drift silently neuters `not.toContain` assertions; the
suite cannot flag those.

**A2 — misattributed; actually a REAL logic defect, 4 reds, FIXED in the
producer:** `tests/joins/ports.test.js` (4). This section previously called
them seed drift — wrong. The lane's world-law gate in
`src/generators/economy/economicState.js` built its law with
`resolveGenerationWorldLaw(null, config)`, discarding the function's own
positional `tradeRoute`, so every DIRECT caller (the tests call
`generateEconomicState` directly; production non-pipeline callers too) lost
route-gated economy (no Port Duties on a port). In-pipeline it was masked
because `resolveConfig` writes `effectiveConfig.tradeRouteAccess`. Fix:
`resolveGenerationWorldLaw` accepts a third `resolved` argument (additive,
fallback-construction path only) and `economicState` passes `{ tradeRoute }`.
Zero golden shift PROVEN: a 32-settlement pipeline dump is byte-identical
before/after. No test was edited — the tests asserted the ratified contract
correctly (coastal port → Port Duties; riverside port → River Tolls, a river
port is not a seaport).

**Defect-class note — one sibling claim REFUTED by a second agent (keep both
halves).** The suspected same-shape site in
`src/generators/power/rulingStructure.js:87` is NOT a sibling: that function's
third positional is a neighbour *relationship object* `{ neighborName,
relationshipType }` (or null) that is merely MISNAMED `tradeRoute` — its sole
consumer reads `.relationshipType`/`.neighborName`, and the generator holds no
resolved route of its own (config.tradeRouteAccess IS the resolved one there).
The original "executed proof" was API misuse — passing `'port'` into the
relationship slot (tell: "Ongoing tensions with undefined"). Applying the
economicState-style cure was tried, measured, and REVERTED: it stringifies the
relationship into the route slot and a non-coastal seaport with a hostile
neighbour silently loses maritime standing (2 of 13 pipeline hashes shifted).
Comment guards now sit on the parameter and the world-law call so nobody
"repairs" it again. Probe hazard recorded there too: a port route auto-derives
coastal terrain, so route-driven maritime behavior is only testable with an
explicit non-coastal `terrainOverride`. RENAME SHIPPED 2026-07-26 (owner
ordered): the parameter, `intent.tradeRoute`, `buildGovernanceLabels`' key and
the `tradeRouteArg` local are all `neighbourRelationship` now, and the guard
comments were rewritten to explain the shape instead of the misnomer (the
do-not-repair warning stands). The snapshot was PROVEN transient first — no
schema, store, persistence path, fixture, golden, or edge bundle carries it;
the only reference outside the three generator modules is the freshness suite
asserting `settlement.powerIntent` is undefined — so `POWER_INTENT_VERSION` was
bumped 1 → 2 as a pure stale-object guard (`assertIntent` is its only reader).
Behaviour-zero proven: 48 pipeline power-structure hashes (16 configs × 3
seeds, incl. hostile/rival/cold_war neighbours and non-coastal seaports)
byte-identical before/after, generator golden master green. The cosmetic instance
in `src/generators/economy/prosperity.js:37` remains flagged and deferred
(unverified at the same depth). The class rule stands for producers that truly
hold a resolved route positionally (economicState was one; it is currently the
third argument's ONLY legitimate consumer): shape-check the positional before
assuming a route.

### B. Distribution shifts — 4 reds (owner ruling required)

- `captureBirthScale.test.js` — criminal-capture rate. Fully measured and
  written up in `docs/GOLDEN_SHIFT_LEDGER.md` under
  "2026-07-26 — criminal-capture distribution shift (OWNER RULING REQUIRED)",
  including the base-vs-now table at N=40/100/200/400 and two costed options.
  Headline: the engine still satisfies its own claim at large N (6.75% < the 10%
  bound); the N=40 instrument is too coarse to show it, and the base passed with
  *exactly zero margin* (4 against a bound of 4).
- `tests/simulation/distributionEnvelopes.test.js` — plot-hook repetition.
- `tests/domain/distribution.test.js` — "at least half of chains are stable".
- `tests/joins/ordering.test.js` — walled-vs-unwalled siege suppression.

The last three are not yet measured at depth. Treat them the same way capture
was: measure base vs now at large N *before* touching any bound.

### C. Narrative — 1 red (FIXED)

`tests/data/foundingSeeds.probe.test.js` — "THE MILL THAT OUTLIVED ITS WARS".

**FIXED 2026-07-26 — re-pinned, not a logic failure.** Same shape as cluster A,
but the cause is worth recording because it looks like narrative drift and is
not. Seed `besi-1` forges *byte-identically* to the committed base — name,
population, every historical event, `foundedBy`, `initialChallenge`,
`overcoming`, legitimacy — with exactly one field moved: `history.founding
.reason`. The chain, measured against a detached base tree:

- The economy now reads `availableNativeResourceKeys(config)` (the
  condition-filtered native roster, per "Resource truth" in
  `docs/GENERATION_CONTRACTS.md`) instead of the full display roster.
- This seed's `river_clay` seam is depleted (`nearbyResources` carries it;
  `availableNativeResourceKeys` does not), so "Pottery and ceramics" no longer
  leads `primaryExports`. "River fish" does.
- `deriveTradeCommodity(economicState)` therefore returns `'fish'` where it
  returned `null` at the base.
- A resolved commodity makes `genArrivalDetail` append the commodity founding
  hooks, widening the reason pool from 6 to 8. `pick` is
  `arr[floor(roll * arr.length)]`, so the SAME draw lands on a different hook —
  which is why nothing downstream moved.

The new reason is the truer one: the base's lead export was derived from an
exhausted seam. Re-pinned in `src/data/foundingSeeds.js` following the
convention this lane already used for `the-contested-crown` — the receipt and
synopsis were rewritten to what the forged world now proves. A fifth receipt
(the settlement's mills, proven from the institution roster) was added so the
seed's title and synopsis keep a proven anchor now that the founding clause no
longer carries one, per the claims-parity law. **Owner-vetoable:** the editorial
prose changed, though the registry is unrendered (see the header note in
`src/components/generate/FoundingWorlds.jsx`).

### D. Registration ratchets — 3 reds (2 FIXED here, 1 open)

- **FIXED** — `tests/joins/crisisTripleSync.test.js`, "the stressorEdits record
  vocabulary is closed over the frozen file set". The new
  `src/generators/generationReceiptJudgments.js` reads
  `config.stressorEdits` in `intendedStressTypes()` to reconstruct authored
  stress intent. Verified read-only (no assignment or property-literal form in
  the file), so it was added to `STRESSOR_EDITS_FILES` with its role recorded,
  exactly as that test's own comment instructs for a genuine new seam.
- **OPEN** — `tests/lint/mutationCoverageManifest.test.js`, "TOTALITY". Three new
  test files owe `scripts/mutation-coverage-manifest.json` entries:
  `tests/application/commands/commandRegistry.walker.test.js`,
  `tests/generators/governanceNarrative.test.js`,
  `tests/generators/powerEconomyFreshness.test.js`.
  Per the test: plant a regression in `scripts/mutation-sweep.sh` (preferred) or
  add a `{"kind":"rationale","rationale":"…"}` entry. Do **not** add them as
  `uncovered` — that list only shrinks.
- **OPEN** — `tests/edgeFunctions/aiGroundingBundle.freshness.test.js`, "the
  current source tree matches the recorded hash". Fix is mechanical:
  `npm run build:edge-shared`. Left alone because it regenerates edge-shared
  artifacts while a concurrent session is editing this tree.

### E. Also fixed this session (by a concurrent session, verified here)

`tests/generators/customContentReferencePack.matrix.test.js` was failing on
**30 of 100 seeds** (vitest reports only the first, seed 5, so the true scale was
invisible). Root cause: the §14 custom-subsumption branch in
`assembleInstitutions.js` was **unreachable dead code**. Its filter required
`!isProtectedGenerationEntity(candidate) && matchesSubsumptionTarget(...)`, but
`AUTHORED_SOURCES` contains `'custom'` and `isAuthoredGenerationEntity` also
fires on `customDefinitionId` — so every materialized custom institution was
protected, while the custom branch of `matchesSubsumptionTarget` *requires*
`isMaterializedCustomContent`. The two predicates were mutually exclusive.
Proven by execution: 130 of 130 materialized custom institutions were protected;
the conjunction was reachable on zero of them.

A concurrent session landed the fix mid-investigation
(`isProtectedFromCustomSubsumption(entity, { exactTarget })` in
`generationOwnership.js`, wired with `exactTarget: Boolean(target.refId)`).
Re-verified independently here: **cart shed on roster 30/100 → 0/100**, and the
test passes 10/10. The module docstring was corrected to name the new predicate.

## What was ruled out by measurement (so nobody re-investigates it)

For the criminal-capture shift specifically:

- Faction power inputs are effectively unchanged (`govP` 38.59→39.01,
  `crimP` 23.96→23.91, `milP` 1.51→1.53 at N=400).
- `safetyRatio`'s inputs are *identical* for the criminal sweeps
  (`militaryEffective` 10.8/13.6, `criminalEffective` 100.0 in both trees).
- Legitimacy multipliers are **not** applied twice.
  `projectPowerGenerationIntent` deep-clones its frozen intent and replays a
  named RNG stream, so the second projection is a clean recomputation.

The actual mechanism is the intended one: power is now scored against the FINAL
economy and the real defense label rather than a provisional economy, so
`computePublicLegitimacy` sees the settlement's true prosperity/safety/food.

## ⚠ The tree is live — read this before planning work

A concurrent session is editing this worktree **right now**. This is not
speculation:

- An `Edit` to `src/domain/generationOwnership.js` was rejected mid-session with
  "the file had been modified on disk since you last read it".
- `isProtectedFromCustomSubsumption` and its `assembleInstitutions.js` wiring
  appeared between two reads minutes apart (mtimes 04:43:04 / 04:42:36).
- ~32 files changed in a 25-minute window during this session, including
  `src/store/settlementSlice.js`, `src/generators/generateSettlementPipeline.js`,
  `src/domain/regenerationPreservation.js`, `src/domain/userEdits.js`, and
  `tests/generators/regenPreservesUserCanon.test.js`.

That last cluster is **the same subject area as the cluster-A reds**, so that
session is plausibly already fixing them. Do not start on cluster A without
checking with them first — and note that the 636s full-suite result above is
bound to a snapshot that no longer exists.

## Revised continuation sequence

1. Confirm with the concurrent session who owns cluster A (resource/regen seed
   pins). Do not re-probe until the tree is quiet.
2. Get the owner's one-word ruling on the capture shift (ledger has both options).
3. Measure the other three distribution reds at large N, base vs now, before
   touching any bound.
4. Close the two open registration ratchets (mutation manifest, edge-shared hash).
5. Investigate the founding-seeds narrative red.
6. Re-run the full suite from a quiet tree, then `npm run check:edge-behavior`
   and `npm run build` + `npm run verify:dist` (not yet run — the suite failure
   short-circuits `npm run check` before them).

---

# ⚠️ GOLDEN RE-CAPTURE OWED — one pass, from a quiet tree, by whoever closes the lane

As of 2026-07-26 evening, `tests/property/generatorGoldenMaster.test.js` is RED
with exactly **84 drifted keys, all `city|…`**, attributed by read-only probe
(no fixture write):

Three overlapping legitimate causes (each measured independently; the per-key
split overlaps and is not exactly recoverable from a moving tree — what
matters is that every cause is known and ledgered):

- **The owner-ratified `DEPLETION_PROB.city` 0.55 → 0.35 tuning** — measured
  alone at 60 city keys (ledger entry "2026-07-26 — city resource-depletion
  tuning" has the candidate table; the flat town↔city step at 0.35 is the
  recorded owner-veto surface: "go lower" = city 0.30 + town 0.25).
- **The cascade borrowed-`required` invariant fix** (`hasOwnRequiredContract`
  in `generationOwnership.js`) — measured alone at 84 city keys, exactly the
  corpus configs whose old goldens encode rosters that VIOLATE the
  no-chain-pair invariant (83 violations per 600 settlements before; 0 after).
  Those goldens were pinning a bug.
- **Concurrent sessions' generator edits** after the manifest's 04:23 capture
  (`historyGenerator.js`, `narrative/historyCoherence.js`,
  `src/data/foundingSeeds.js`, `generationContext.js`).

`UPDATE_GOLDEN=1` was deliberately NOT run: capturing mid-flight would bank the
foreign 24 under this lane's name and silently green another lane's gate — the
certifier-silencing hazard class. The 60 owned keys cannot be captured
separately (hashes are whole-tree). The re-capture is ONE pass at lane close,
from a quiet tree, using only the documented mechanisms
(`UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js`;
the PDF snapshot needs nothing — its fixed seed is a town, verified green
before and after the city-only tuning), followed by the frozen double-run
proof and a ledger note attributing the foreign 24 to their own commits.

## 2026-07-26 evening fix-wave scoreboard (all independently re-verified by the manager)

| Red (of the 17 at wave start) | Resolution |
| --- | --- |
| resource seed cluster (7) | re-pinned; join semantics CONFIRMED intact; one VACUOUS green found+fixed |
| ports (4) | REAL producer defect fixed (world law + positional route); zero-golden-shift proven |
| captureBirthScale (1) | owner "recalibrate": N=400, proportional bounds |
| founding-seeds (1) | economy-lane cause; pin updated per file convention |
| edge-shared hash (1) | regenerated |
| plot hooks (1) | mis-specified max → exceedance-count (manager authority; base failed it too) |
| chain stability (1) | owner "tune depletion down": DEPLETION_PROB.city 0.55→0.35; test green with margin |
| cascade pair (1) | REAL invariant breach (83/600 settlements): cascade-borrowed `required` read as protection, freezing ladder collapse; authority scoped via hasOwnRequiredContract; producer-side alternative measured (187 vs 84 golden keys + envelope trip) and rejected — "veto" flips it |
| verify:dist vendorPdfLazy | owner "pins + 673,000": engine 694,344→670,707, importers 68→46; tests/build 285/285 |

Remaining red at write time: generatorGoldenMaster (84 keys, above) — by design
until lane close. A claimed rulingStructure "sibling" of the ports defect was
REFUTED by execution (see the defect-class note in section A above).

## Owner-decision queue left open by the fix wave (recorded, not blocking)

1. ~~Cascade-borrowed `required` beyond the roster~~ — **RULED 2026-07-26
   evening: "fix producer now"** — cascade seats carry `required: false`;
   implemented same evening (see the ledger entry "cascade seats carry
   required:false"); hasOwnRequiredContract kept as defense-in-depth for
   persisted pre-fix settlements.
2. ~~Flat town↔city depletion step~~ — **RULED 2026-07-26 evening: "keep
   flat step"** (city 0.35 stands; pressure plateaus at city scale).
3. **Founding-seeds receipt prose** — the-enduring-mill synopsis/receipt edits
   (registry has no src importer; tests only).
4. ~~`tradeRoute` → `neighbourRelationship` rename~~ — **RULED + SHIPPED
   2026-07-26 (owner ordered)**: the intent snapshot was proven transient, so
   the rename crossed nothing persisted; POWER_INTENT_VERSION bumped 1 → 2 and
   48 pipeline hashes stayed identical. See the defect-class note above.
5. **`isProtectedFromCustomSubsumption` exact-target branch** still reads bare
   `required === true` (conservative; a custom `subsumes` cannot absorb a
   cascade-borrowed institution) — harmless asymmetry, align or leave.

---

# LANE CLOSED — 2026-07-26 ~23:40 (every gate green)

Final state, each item independently re-verified by the managing session:

| Gate | State |
| --- | --- |
| Generator goldens | **GREEN** — one-pass re-capture done: 187/523 keys re-hashed (city 84, village 84, town 19 — exactly as ledgered), frozen double-run + a third green bracketing concurrent writes; fixture diff 187↔187; ledger entry "THE ONE-PASS GOLDEN RE-CAPTURE (generation lane close)" |
| PDF golden | **GREEN as-was** (seed `parity-town-2026` not among the 19 moved town rows; no snapshot rewritten) |
| Convergence (all 16 ever-red files) | **GREEN** (the transient mutation-manifest reds were live concurrent sessions racing their own new tests' entries — both self-resolved; check the MISSING list before acting on a TOTALITY red) |
| `npm run check:edge-behavior` | **GREEN, EXIT=0 — first time ever in this lane**: 32 functions typecheck, 546 behavioral tests, 0 failed. Unblocked by two fixes to PRE-EXISTING committed defects: `customContentCore.ts` `AUTHORABLE_BUCKETS` widened to `ReadonlySet<string>` (type-only; the set exists to test untrusted strings) and `deno.lock` +2 workspace entries (pg, three — drift from integration commit a88be4f1). ⚠️ `deno install --frozen=false` is NOT lockfile-only in this repo — it rewrote node_modules off the npm pins (repaired via `npm ci`, pins verified); refresh the lock with `deno check --frozen=false` instead. Owner-vetoable judgment: the 3,971-line npm resolution graph deno wanted to add to deno.lock was rejected in favor of the 2-line fix. |

Owner rulings taken this session (all implemented + ledgered): capture
"recalibrate" · chain stability "tune depletion down" (city 0.35) · chunk
"pins + 673,000" · borrowed-required "fix producer now" · ladder "keep flat
step". Still open for the owner (recorded, non-blocking): queue items 3-5
above (founding-seeds prose · subsumption asymmetry — item 4, the tradeRoute
rename, was ordered and shipped 2026-07-26), the
name-keyed closure backstop (reader-side ruling), and the persisted pre-fix
borrowed-flag migration. Nothing was staged or committed by this program's
sessions; a concurrent banking session is folding the tree (HEAD moved
2e037f62 → 478e8e13 during close-out).
