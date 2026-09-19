---
name: phase55-review-and-fix-r1
description: The Phase 5.5 mover-ladder adversarial review verdict (constitutionally sound) + the R1 fix commit + the deferral ledger the next fix round should pull from.
metadata: 
  node_type: memory
  type: project
  originSessionId: 41dcdeb4-4192-454f-abb4-9671f7b637b9
---

Independent adversarial code review of the committed Phase 5.5 mover ladder (branch
`review-fixes-2026-07-08`, 19 source commits W0→CL-0→M1..M7; M8 skipped, docs-only Round21/22
skipped), run 2026-07-12 via an 8-angle find→adversarial-verify workflow (38 find-lens agents +
per-finding refuters).

**Verdict — the ladder is constitutionally SOUND.** 68 candidates → 58 CONFIRMED + 1 PLAUSIBLE
surviving, and **0 constitutional-invariant violations** (byte-identity, dormancy, frozen
distanceMatrix, codepoint-sort, budgets 2252 / 1,255,985 all intact). Engine source is clean of raw
`Date.now`/`Math.random` (only the two documented seed-entry points). The bare-`.sort()` codepoint
concern is REFUTED as defensive-only: node ids are UUIDs (ASCII), so code-unit == codepoint order.
The 59 surviving findings are 13 med + 46 low — correctness defects + dead code / stale docs / dup
helpers / redundant recompute. This soundness is load-bearing for the master-merge go decision.

**R1 fix round (this session, budget-limited "one round"):** commit `0ed18d77` on branch
`claude/phase55-review-fixes-r1`, worktree `/Users/cstokes/Desktop/settlement-engine-p55fix`, based on
M8 `618dba59`. NOT pushed, NOT merged (owner-gated). Fixed 5 clear localized correctness defects that
do NOT re-bake the frozen digest, each byte-identical on the tested path, each with a regression test
PROVEN to fail on pre-fix source: M2 phantom-arrival-sentinel + M2 unit-mismatch (supplyShipments.js),
STEP3.5 rumor arrival-regression (rumorNetwork.js), M7 smuggle dropped-field (commodityFlow.js),
SEASONS-A sentinel-conflation (seasons.js + pulseKernel.js). Verified: full domain suite 348 files /
4396 tests green, lint clean, typecheck:domain:strict 0 errors.

**R1 + M4 FOLDED IN 2026-07-13** — commit `5ea117ec` on `review-fixes-2026-07-08` (on top of M10a
`a9e08af8`). The R1 5-fix set re-landed here (was on the abandoned worktree branch) AND the M4
conservation-leak CLOSED. Full gates green (8256/8256, any-cast 2252, closure unchanged, verify:dist
108/108). The R1 branch `claude/phase55-review-fixes-r1` is now SUPERSEDED — do NOT also merge it.

**Deferral ledger (the next fix round's queue), highest value first:**
- **M4 conservation-leak — DONE (5ea117ec).** Fix = `collectRealizedEmigrationEvents` (new, migrationKernel.js):
  the dispatch drops proposal-mode outcomes (applyWorldPulse.js `applyMode==='proposal'` `continue`s
  BEFORE the origin debit; majorChangesRequireProposal is the trigger via populationDynamics.js:367).
  Auto-mode byte-identical. 5 regression tests, 3 proven-fail-pre-fix.
  - **NEW SYMMETRIC ITEM (found during the fix, NOT yet fixed):** an APPROVED proposal-emigration is
    debited by `applyWorldPulseProposal` but that path does NOT run the tick migration dispatch ⇒
    survivors never travel ⇒ population LOST (not minted). Pre-existing, smaller drama; Fable's pass.
- **M11a PESTILENCE army-vector coupling — FENCED (deferred sub-wave).** M11a (traveling plague over
  the existing disease_outbreak stressor) shipped with the army READ primitives built+tested
  (pestilenceLevel, armyPlagueHazard = graded scalar × W0 risk tolerance, armyContraction seeded roll)
  but the MUTATION wiring into armyTransitKernel (contraction impairment + vector-carry to next stop)
  DEFERRED — it touches the byte-sensitive war convergence (6 siege pins, field-battle determinism,
  certification envelopes). Land it as its own pass with the primitives ready. Also round-22.1 TRADE
  REFUSAL (turn away caravans from a source BELIEVED plagued) is OUT — a separate later wave.
- **5.5-K frozen-digest pair** (spatialDigest.js:439 cost-misattribution → negative/wrong terrain
  costs frozen in route receipts; :182 falsy-zero → null cellId seeded at cell 0). Both touch the
  FROZEN distanceMatrix ⇒ a fix re-bakes the digest and needs a checkpoint soak — the next AI's domain.
- **CL-0 reset-merge-leak** (SimulationRulesDialog.jsx:310) — Reset→Save can't clear a materialized
  profile axis; UI-only, workaround = axis chips; fix needs normalizer/dormancy reasoning.
- 13 med total (see also M1 pulseKernel hot-path-quadratic, M5 half-wired courier/retreat, M6d
  duplicate port-detection, WAVE-A beliefMap hot-path JSON.stringify) + 46 low cleanup findings.

**Master-merge surface (refines [[third-lineage-mystifying-ride]]):** review-fixes is 308 ahead / 242
behind master; 847 files collide, incl. 69 in `src/domain/worldPulse/` (the spatial engine is woven
into the tick engine, NOT purely additive). BUT migrations are largely RECONCILED — chains identical
through 112, review-fixes adds 113–129 (additive), only `101_drop_privileged_email_backdoor.sql`
diverges and review-fixes is the PII-scrubbed superset (keep it). So the real master-merge hazard is
the 69-file worldPulse semantic 3-way reconciliation, not the migration numbering the memory feared.

**Shared-tree fact:** M8 ("SEA LANES MATERIALIZED", `618dba59`) was committed onto review-fixes by a
parallel session DURING this session (branch moved c328c305 → 618dba59). Expect review-fixes to keep
advancing; the R1 branch will need owner reconciliation at merge.
