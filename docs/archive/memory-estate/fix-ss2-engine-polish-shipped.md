---
name: fix-ss2-engine-polish-shipped
description: "SS2 engine-kernel-polish cluster shipped @ 525e0979 on claude/ss2-engine-polish (NOT folded/pushed); 17 of 33 findings fixed w/ pins, 16 deferred (owner-gated arch / out-of-cluster src|store|components|generators|lib / plausibly-intentional). No green golden reddened; the 4 parked families unchanged."
metadata:
  node_type: memory
  type: project
  modified: 2026-07-21T03:21:47.369Z
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
---

**SS2 — ENGINE-KERNEL POLISH shipped 2026-07-20** (dedicated agent, worktree vision-i).

- **claude/ss2-engine-polish @ `525e0979`** (base e457d923). 20 files (14 src/domain, 6 tests), +250/-45. NOT folded/pushed. Gate: domain-strict 0 (ceiling 0) · full tsc 0 · eslint 0 on all touched · 4 new pins + touched dormancy/property goldens all GREEN (34-file final sweep, 317 tests) · python NUL scan CLEAN · the 4 parked families (generatorGoldenMaster, beliefMapGolden, worldpulseDeityGolden, pdf goldenViewModel) still the ONLY reds. **worldpulseDeityGolden drift set UNCHANGED (same 2 keys gm-pulse-a|3, gm-pulse-b|5)** despite lit-path engine shifts — no new drift, no green-golden revert needed.

## Fixed (17) — chokepoint + why it's golden-safe
- **F1** pulseKernel `candidateCount` (line ~1610) + returned `candidates` (~2517) now include `lifecycleCand`+`moralFounding` (were rolled/applied but under-reported). Byte-identical when those flags dark.
- **F2** `beliefMap.reconcileBelief` guard the 0/0 blend (null prior + zero-weight report → NaN band/readiness poisoning the pinned ledger). Degenerate-only; normal denom>0 byte-identical. PIN.
- **F3** `npcLadderChallenge` apply loop: DISJOINT adjacent swaps, WINS-first, count a succession per applied win — kills the >1-rung leapfrog AND the succession swallowed by a coincident fail-drop (which skipped cooldown+realm-cap). PIN (adjacency+succession, NEGATIVE-CONTROL confirmed: buggy loop yields a:1,a:4,a:2,a:3).
- **F4** `npcLadderKernel` orphan branch (~624): decay marks via `maintainMarks` (exposure-preserving stub) + write `goal:null` — records prune (were immortal on churn/remove_npc), mirror stops emitting a stale active goal. ⚠ `maintainMarks` result missing `goal` trips domain-strict (`LadderStanding` requires goal) — write goal:null explicitly.
- **F5** `assizeKernel` news id now `...just.<accusedKey>` (sanitized charge-map key) — same-direction verdicts in one settlement/tick no longer collapse to one id in the appendWizardNews Map fold.
- **F8** `generosityReactions.foldObligations`: repayments consume BEFORE mints + DROP drained records — a same-tick matured-credit full-repay {amount:1} no longer erases a fresh re-loan to the same (debtor,creditor,'credit') key. Byte-identical for disjoint keys. PIN.
- **F10** `roadsKernel` dominion branch reachable via `(inRange.length || dominionTargets.length)` (was nested under inRange.length); ladder arm carries its own `&& inRange.length` (needs inRange[0]).
- **F11** `pulseHelpers.compactOutcomeForHistory` preserves top-level + `stressor.covert` markers so `causeWalk.receiptIsCovert` redaction survives history compaction. Conditional ⇒ byte-identical for non-covert. PIN.
- **F18** `factionPairLedger` decay incident sev by `dw` (weeks since last pass) NOT `now - i.tick` — clock-agnostic, fixes ~interval× over-decay of pulse-tick-stamped incidents (ladder/assize stamp pulse-ticks; factionCompetition stamps weeks; decay uses weeks). `i.tick` LEFT untouched for the revanchism reader (`grievanceRead.scoreRevanchismLean` via `pairGrievance`, which passes pulse-tick `tick`). Byte-identical to every existing pin (all mint at tick===week). PIN.
- **F22** ladder adjacency + succession-count pins (the conservation pin only checked set-permutation).
- **F23** `commonsVoiceKernel` serialize-compare no-op guard (the npcLadder idiom) — a stable-rung layer no longer churns worldState + forces a spurious pulse `changed` each tick. Byte-identical ledger.
- **F26** `generosityKernel` buffer discipline ONCE per receiver per tick (was N× for N givers). Compressed to net-zero code lines (800-line ceiling).
- **F27** `supplyKernel.resolveConsumingInstitution` exact name match before substring (a processor name that is a sub/superstring of an unrelated institution can't stamp the wrong one).
- **F30** `roadsKernel` genesis: an unreachable-in-believed-view candidate SPENDS its cadence (like a refusal). Compressed to net-zero code lines.
- **F31** `thirdPartyRansom` remove dead `succor_ally` ternary (ALLY_LIKE handled above). Byte-neutral.
- **F32** `provenanceKernel` annotate the unreachable `dropSpatialLedger` branch. Byte-neutral.
- **F33** `pipeline.property.test` fuzz the 11 REAL cultures (was bogus 'mediterranean'→germanic; 8 never exercised). Passed — no latent non-determinism.

## ⚠ Hazards banked
- **800-line CODE-line lint ceiling** on generosityKernel + roadsKernel (eslint max-lines skipComments/skipBlankLines): adding logic there needs net-zero/compressed code. F26/F30 pushed to 801/803, compressed back.
- **F4 domain-strict**: `maintainMarks(...).st` lacks `goal`; `LadderStanding` requires it — write `goal:null` on the orphan record.
- **F18 dual-clock**: incident `.tick` is stamped in DIFFERENT clocks by producer (factionCompetition=weeks, ladder/assize=pulse-ticks) and read by two consumers (decay=weeks incremental now; revanchism reader=pulse-ticks). Never "unify the stamp" — decay is incremental, the reader keeps pulse-ticks.
- **lint-staged pre-commit** runs `eslint --fix` + a SELF backup stash (auto-restored); foreign stash@{0} ("generation-tuning fixes") survived untouched. Commit id from a shared worktree — parallel sessions.

## Deferred / struck (16) — with reason
- **F6 + F19 (obligations ledger no single decay owner)** — ⭐ARCHITECTURAL/owner-gated. assize (assizeKernel:383) + convergence (convergence:1191) mint relying on generosity to decay, but generosity is gated on constructiveFlows (a DIFFERENT flag). F19 also DOUBLE-decays (convergence uses DEFAULT decay on top of generosity). Minimal fix (convergence decayPerTick:0) trades double-decay for never-decay-when-generosity-dark — not clean. RECOMMEND one unconditional per-tick obligations-decay pass + all minters decayPerTick:0 (touches pulseKernel + persistence lifecycle = owner).
- **F7 traditions festivals fire only on tick-boundary weeks** (~65% never fire at one_month) — owner-gated cadence design; rides tradition ACTIVATION (ONE-REGEN). traditionsKernel:588,710 inWindow(weekOfYear) samples one week/pulse.
- **F9 toPublicSafe(full) ships npc.whereabouts + spatialLedgers** — security posture (server authoritative), owner-gated; cluster brief was "no security". publicSafe.js:219-279.
- **F12 spatialUsage EXEMPT reasons cite untracked flags** (src/lib telemetry) — out of cluster (src/lib not src/domain).
- **F13/F14/F15 edit-wall** (settlementRenameHelpers=src/store, TableLedgerPanel=src/components) — out of cluster. F14 (KIND_SPEC↔TABLE_AUTHORABLE drift pin absent) is a real structural gap for the edit-wall cluster.
- **F16/F17 generation-pipeline** (regenNPCs stale powerStructure.conflicts; neighbour rawPower raw-scale) — src/generators + src/store, out of cluster.
- **F20 pulse resource depletion ghosts on regen** — domain writer tierResourceDynamics:507 omits resourceEdits/_config dual-write; cure needs src/generators (resolveResources) + src/store — out of cluster.
- **F21 strong liar bluff unexposable by contradiction** (assertedBand saturates at 4) — design/tuning; the band genuinely can't exceed max. informationStatecraft:710.
- **F24 corruption.demoteImportance ladder dead** (real path demotes dotRank) — dead code, tested; not a defect to change.
- **F25 foreign ousted asset stamps two corruption_exposed conditions** — plausibly two distinct scandals (local rot + foreign patronage); dormant; hedged in the finding.
- **F28 recalled-outbound traveller mis-located for return-leg hazards** — complex roads polish (state.js:167 vs gauntlet recompute).
- **F29 roads/ops.js party/recall helpers dead** (live path re-implements inline in src/store) — dead code, tested; lockstep-divergence risk belongs with the src/store live path.

## Tail
Manager measures combined closure/goldens at fold. NEXT for owner/manager: fold this branch; re-record the 4 parked families (this branch's lit-path shifts ride into worldpulseDeityGolden's pending re-record — drift set unchanged). F6/F19 + F7 + F9 want owner decisions.
