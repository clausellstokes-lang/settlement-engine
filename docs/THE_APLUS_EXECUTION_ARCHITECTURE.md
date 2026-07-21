# THE A+ EXECUTION ARCHITECTURE — the buildable spec per tranche (Fable, 2026-07-21)

Companion to THE_APLUS_CONVERGENCE_BLUEPRINT.md (which says WHICH bar each step moves).
This says HOW: each work package = {build, where, enforcer contract, pin, closes, owner?}.
Tranches 1-3 are MINE (provable, no owner/soak). Tranche 4-6 = the OWNER MANIFEST at the end.
Sequencing law throughout: correctness-asserting enforcers land LAST over honest data
(never enshrine a lie); shrink-only ratchets may land over still-imperfect substrate.

═══════════════════════════════════════════════════════════════════════════
## TRANCHE 2 — THE ENFORCER BUILD (mine; the real A+ lift; dispatch after fix-to-zero folds)
═══════════════════════════════════════════════════════════════════════════
Each is a STANDING remover that converts "defect absent" into "defect-class has no habitat."
Parallelizable: all are tests/walkers (~0 eager), file-disjoint by target. 7 packages.

### E-A · MUTATION-SWEEP TOTALITY  → closes bar 1 (CORRECTNESS)
BUILD: extend scripts/mutation-sweep.sh from 12 planted regressions to cover EVERY
correctness-asserting invariant in the suite (each ratchet/walker/golden family gets a
planted mutation proving it reddens). WHERE: scripts/mutation-sweep.sh + a coverage-manifest
listing invariant→mutation. CONTRACT: every invariant either has a planted mutation that the
gate catches, or a documented rationale for why it can't be mutation-tested. PIN: a
meta-test asserting the manifest covers the enumerated invariant set (shrink-only on the
"uncovered" list, drive to 0). CLOSES: bar 1 to A+ (every found class has a proven remover).

### E-B · CANDIDATETYPE EXHAUSTIVENESS WALKER  → closes bar 2 (COHESION, provable half)
BUILD: a walker that enumerates every `candidateType: '<literal>'` minted across worldPulse
kernels and asserts each binds to an apply-arm in applyWorldPulse OR is tagged news-only.
WHERE: tests/domain/candidateTypeExhaustiveness.test.js. CONTRACT: no candidateType can emit
news yet mutate no state without an explicit news-only tag (kills "a force citing no law").
PIN: the walker itself; baseline shrink-only if any current gap, drive to 0. CLOSES: the
"every force is intended-and-typed or impossible" half of bar 2 (the RECORDED-law half is
tranche 4/ONE REGEN).

### E-C · LIFECYCLE ROUND-TRIP WALKER  → closes bar 12 (STATE-LIFECYCLE)
BUILD: a test that, for every persisted state family, round-trips it through create→persist→
regen→undo→clone→migrate→import and asserts byte-exact survival (extends the save-museum idiom
to ALL families, not sampled). WHERE: tests/store/lifecycleRoundTrip.test.js. CONTRACT: no
write orphaned by any path. PIN: the walker; a registry of state families it must cover +
a completeness assert (new family unregistered → red). CLOSES: bar 12 to A+.

### E-D · PER-AI-SURFACE SOURCE-SCAN + NO-LOAD-BEARING-AI PROOF  → closes bar 19 (AI STRUCTURE)
BUILD: (1) generalize the import-wall source-scan into a walker that, for EVERY AI surface
(census the 9), asserts no model output writes a mechanical/typed field (the finite-semantics
wall, proven per-surface not just at the one wall). (2) a test that the product renders every
AI-surface's deterministic FALLBACK with AI disabled (no load-bearing AI). WHERE:
tests/security/aiSurfaceSourceScan.test.js + tests/domain/aiFallbackTotality.test.js. CONTRACT:
AI is dressing on typed truth everywhere; product fully functional AI-off. PIN: both walkers +
the 9-surface census that fails when a 10th surface appears unscanned. CLOSES: bar 19 to A+.

### E-E · VOICE WALKER → JSX EXTENSION  → advances bar 8 (CONTENT/VOICE) + 18 (IMMERSION)
BUILD: extend E2 voiceMechanics + E1 proseLeak to scan JSX component string literals (the
recorded gap — E2 scans registries + data, not components). WHERE: extend tests/copy/
voiceMechanics.test.js + proseLeak. CONTRACT: em-dash/'!'/engine-token bans hold in COMPONENTS
too. PIN: the extended walkers, shrink-only baseline over current JSX offenders → drive down.
CLOSES: the repo-provable half of 8 (golden-bound prose + the ONE-REGEN letter wiring remain
tranche 4); feeds bar 18's census burn-down (tranche 3).

### E-F · DETERMINISTIC TICK OP-COUNT BUDGET  → advances bar 5 (PERFORMANCE)
BUILD: a machine-independent op-count budget on the tick pipeline (the townMapOpBudget idiom
generalized to the advance loop — count kernel ops, generous ceiling), catching constant-factor
regressions the wall-time trend can't. WHERE: tests/perf/tickOpBudget.test.js. CONTRACT: a
constant-factor blow-up in the tick reddens deterministically (no flaky ms threshold — owner
rejected those). PIN: the budget test. CLOSES: the repo-provable half of bar 5 (the TTI/INP
prod ratification + soak sign the rest — tranche 4/6).

### E-G · NARRATIVE-PARITY WALKER  → advances bar 20 (THE STORY) + 2 (COHESION)
BUILD: THE capstone enforcer — a test that composes the SAME seeded decade through letter,
chronicle, timelapse, world-book, and cause-walk and asserts they narrate ONE story from ONE
substrate: no surface names a beat the others don't, no surface embellishes beyond the ledgers
(claims-parity applied to NARRATIVE). WHERE: tests/simulation/narrativeParity.test.js (pairs
with the arc-soak already built). CONTRACT: every reader surface is a projection of one
narrative truth; a surface inventing a beat reddens. PIN: the walker. CLOSES: the "one story,
all surfaces" half of bar 20 (the recorded-DEPTH enhancement + LIVED sign the rest — tranche 5/6).

═══════════════════════════════════════════════════════════════════════════
## TRANCHE 3 — RATCHET BURN-DOWN (mine, except owner-taste entries)  → bars 17, 18, 8
═══════════════════════════════════════════════════════════════════════════
Drive the shrink-only ratchets to their ZERO targets where the work is mechanical, not taste:
- SPELL-BREAK CENSUS → 0 for the NON-golden-bound breaks (the letter tickSpeak / chronicle
  rawId that are golden-bound pass to tranche 4). WHERE: the census baseline. (bar 18)
- ERROR-COPY register → 0 (register every raw error literal to t()). (bar 8/18)
- DEEPCRAFT KILL-LIST → drive the NON-taste entries down; the ~510 de-round styling lines are
  an OWNER TASTE call (tranche 5), NOT mine to force. Land what's mechanical; flag the taste
  remainder. (bar 17)
- TITLE census, rawColor, mapPalette, anyCast → hold at their frozen targets (already there).
RULE: each burn-down step declares the goldens it touches; golden-bound remainder → tranche 4.

═══════════════════════════════════════════════════════════════════════════
## THE OWNER MANIFEST — TRANCHES 4-6 (NOT mine; each item = {act, unlocks, my-recommendation})
═══════════════════════════════════════════════════════════════════════════
Everything above gets the product to: Group-1 bars A+, Group-2 at "A+ pending ONE act below",
Group-3 at "A+ pending soak/lived." These acts finish it. Ordered by leverage.

### TRANCHE 4 — THE ONE REGEN (single owner-signed batch; the highest-leverage act)
1. LIGHT THE PROVENANCE LEDGER in a preset (provenanceLedgerEnabled on in full_simulation).
   UNLOCKS: the RECORDED-law half of bars 2, 4, and 20 AT ONCE (cause-walk renders, chronicle
   records instead of infers, arcs trace). REC: do it — it's the single act that most moves the
   capstone; the instruments (arc-soak) already prove it produces real structure when lit.
2. REGEN THE GOLDEN-BOUND PROSE: the deferred eventProse/roads/tradition em-dash sweep + the
   letter-humanizer wiring (tickCalendarLabel/humanizeFlagKey into letterToPlainText). UNLOCKS:
   bars 8 + 18 golden-bound remainder. REC: batch with #1.
3. THE TUNING: idx21 (tier/population narration), idx19 (durable-memory turning points), and
   SS2's obligations-decay architecture gap (F6+F19 — add one unconditional per-tick decay pass).
   REC: the obligations-decay is the one real architectural fix here — worth doing; the other two
   are narration polish.
4. RE-RECORD the 4 parked golden families ONCE (generatorGoldenMaster/beliefMap/deity/pdf
   viewModel) — after 1-3 land, so the regen captures every legitimate shift together.
   REC: this is THE moment the suite goes fully green; declare the one-time shift, never re-mint
   piecemeal. Sign the tuning manifest.

### TRANCHE 5 — OWNER POSTURE ACTS (independent; each closes a bar tail)
5. CSP Report-Only → ENFORCE flip (vercel.json). UNLOCKS: bar 6 A+ (containment real, not just
   sinks closed). REC: do it post-soak-of-the-map — the connect-src already excludes the LLM
   hosts; low risk, high bar-6 value.
6. COGS/MARGIN admin readout deploy (the report_ai_cogs fn + migration). UNLOCKS: bar 7 A+
   (owner reads unit economics). REC: build-to-edge is mine; the migration+deploy is yours.
7. DR RUNBOOK REHEARSAL (the tooling exists, unrehearsed). UNLOCKS: bar 15 A+. REC: one dry run.
8. KERNEL outcome→outcome causedBy ADOPTION for STORY DEPTH. UNLOCKS: bar 20's recorded-DEPTH
   (today one-hop-to-root; deepChains metric is wired, dark). REC: a scoped enhancement lane —
   have 2-3 high-value kernels (ladder contests, generosity→gratitude) mint outcome→outcome
   edges; ties to the contests-openedTick schema add. Not required for A+-provable, but it's what
   makes the cause-walk trace literal multi-hop chains — the deepest version of the capstone.
9. DE-ROUND TASTE CALL (kill-list → 0). UNLOCKS: bar 17 full A+. REC: yours by constitution
   (taste); I flag the ~510 lines, you decide de-round vs keep.
10. AI-GENERATOR re-enable decision (FMG BYOK). REC: leave disabled unless you want the feature;
    it's a product call, orthogonal to the bars.

### TRANCHE 6 — CERTIFICATION RUNS (reality-gated; the CERTIFIED + LIVED tiers)
11. THE SOAK — signs the RATES/boundedness: bar 4 (arc rates), bar 5 (time at scale), bar 20
    (pacing bands). Pre-declared bands in the tuning manifest; your run. Converts "instrumented"
    → "CERTIFIED" for those bars.
12. THE LIVED TIER — real DMs/tables sign: bar 10 (joy), bar 3 (felt-in-ten-minutes), bar 9
    (screen-reader parity), bar 20 (does the story MOVE someone). No repo act substitutes; the
    census/instruments sign everything the repo controls, humans sign the rest.

## THE FINAL STATE (honest)
After tranches 1-3: every PROVABLE bar at A+, the rest at "A+ pending a named owner/soak/lived act."
After tranche 4-5: Groups 1+2 fully A+. After tranche 6: A+ ACROSS THE BOARD in the only sense
the standard permits — everything provable PROVEN, everything certifiable SIGNED, nothing on hope.
The word "everything to A+" is TRUE only with 4-6, and 4-6 are owner/reality-gated BY DESIGN
(THE PROMISE + the three-tier doctrine). I execute 1-3 and build-to-edge 4-6; you sign 4-6.
