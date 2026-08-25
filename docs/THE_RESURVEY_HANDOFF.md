# THE RESURVEY HANDOFF — the Round 3 loop execution brief

> Written 2026-07-20 by the managing session at the owner's order (the AI-HANDOFF ruling,
> 2026-07-19). This document is SELF-CONTAINED and PLATFORM-AGNOSTIC: any capable AI — or
> a human engineer — can execute the Round 3 review loop from this brief alone, with zero
> external context, no proprietary tooling, and no prior conversation. It supersedes
> docs/START_HERE.md §6 for the loop executor. Where this brief and the code disagree,
> THE CODE IS AUTHORITATIVE — re-verify every claim.

## 1. WHERE THE CODE IS, AND HOW TO BUILD AND TEST IT

- Repository root: `/Users/cstokes/Desktop/settlement-engine` (a git repository).
- THE LOOP'S SUBSTRATE is the branch `claude/composite-r4`, checked out in the worktree
  `.claude/worktrees/minifold`. DO NOT trust any hash written in any document, including
  this one: run `git -C <worktree> rev-parse HEAD` and `git branch --show-current` FIRST,
  and re-verify after any pause. Expected at writing: tip = ca244100 (build-completeness PASSED at this tip — ~104 slices, zero missing). If the tip has
  advanced, a parallel session moved it — re-derive state from `git log`, never from a brief.
- The branch `claude/the-composite` (worktree `agent-a04d3f325c72e62dd`) is the SHARED
  staging composite — LEAVE IT UNTOUCHED. Promotion of composite-r4 onto it is owner-gated.
- The MAIN tree (repo root) holds the ledger branch `review-fixes-2026-07-08` — the program
  ledger `docs/COMPREHENSIVE_REVIEW_PROGRAM.md` (prepend-newest) lives there. Every loop
  cycle appends a ledger row there. Never check out a different branch in the main tree.
- The worktree has its own `node_modules`. Run everything FROM the worktree root. If tests
  behave impossibly, verify you are not resolving a parent directory's `node_modules`.

Concrete commands (from `package.json` — no proprietary tools required):
- Build: `npm run build` (ALWAYS build before `verify:dist` — dist contracts read stale
  output otherwise).
- Eager-budget gate: `npm run verify:dist` — first-paint closure must be ≤ 1,040,000 bytes.
  Measured at writing: 1,024,511 B.
- Strict domain types: `npm run typecheck:domain:strict` (= `node scripts/check-domain-strict.mjs`)
  — ceiling is 0 errors. Run it BARE and read ITS exit code — never through a pipe or `tail`
  (pipes mask exit codes).
- Full typecheck: `npm run typecheck` · Lint: `npm run lint`.
- Test suite: `npx vitest run` — the full suite is ~13,700 tests and exceeds a 10-minute
  window; run it in TWO SHARDS: `npx vitest run --shard=1/2` and `--shard=2/2`.
- Contract/data gates: `npm run check` (validate:data, migration-head, edge, map, …) and
  `npm run check:full`.

## 2. THE LOOP DEFINITION (what you are executing)

The owner's commission, verbatim (ledger 2026-07-08): "comprehensively and exhaustively
read, review, and analyze the entire code and codebase… verify findings and implement
fixes… choose objectively better with risk every time… mature my code to absolute
perfection… cohesive, complete, immersive… not just in code but in experience."

The Round 3 ruling, verbatim intent (2026-07-19): "a complete and utter resurvey followed
by fixes… everything fixed exhaustively and comprehensively… objectively better and not
just maximally safe… absolutely perfect, A+ grade throughout where possible at this stage…
create a loop cycle of complete exhaustive review cycle to fixes until there is materially
no more fixes to be made and every dimension that can be made into A+ is made into an A+,
rinse and repeat."

THE CYCLE (repeat until convergence):
1. FULL RESURVEY — review the codebase across EVERY dimension, in parallel if your
   platform allows. THE AMENDED 13-DIMENSION STANDARD (the cycle-1 standard audit's
   output, recorded 2026-07-20; amendments only ever raise the bar): 1 correctness ·
   2 engine cohesion/counterparts · 3 experience/immersion (vs THE EIGHT CROWNS, §2b) ·
   4 substance benchmarks (docs/DESIGN_SIM_DEPTH_R2.md) · 5 performance/eager bytes ·
   6 security/abuse · 7 AI cost-efficiency · 8 content/voice · 9 accessibility ·
   10 game-feel (crown 4's lens) · 11 DETERMINISM/REPRODUCIBILITY (the product's
   constitutional claim: same-seed byte-stability, cross-machine stability, rng-stream
   isolation — graded on its own, no longer implicit in correctness) · 12
   STATE-LIFECYCLE INTEGRITY (create/read/persist/regen/undo/clone/migrate/import
   round-trips for every persisted shape, graded by EXECUTED round-trip probes) ·
   13 CLAIMS-VS-ENFORCEMENT PARITY (every doc/marketing/comment claim maps to an
   enforcing gate; the measured gap IS the grade). Each dimension receives an A+
   GRADE or the gap NAMED.
2. ADVERSARIAL VERIFICATION — every finding is attacked by independent skeptical
   reviews (2-of-3 refuters standard) BEFORE it reaches the fix list. A finding without
   a concrete failure scenario and file:line anchor is a vibe, not a finding.
3. FIX WAVES — one commit per finding-cluster; bold-over-safe WITHIN the constitution
   (§4); the full gate (§1 commands) runs at every wave end; commit messages carry a
   verbatim gate trailer with real numbers.
4. CYCLE LEDGER ROW — append the cycle's row (grades, findings, fixes, deferrals) to
   `docs/COMPREHENSIVE_REVIEW_PROGRAM.md` on the ledger branch.

CYCLE 1 OPENS WITH A STANDARD AUDIT: the A+ rubric itself (docs/A_PLUS_ROADMAP.md · the
depth standard's five columns · THE EIGHT CROWNS) is reviewed for under-expression and
AMENDED UPWARD where it is softer than the best conceivable expression of the dimension.
Amendments are recorded vetoably in the ledger and become the loop's grading law. The
standard only ratchets UP; a dimension passing the old rubric but failing the amended one
is a FINDING, not grandfathered.

THE COHERENCE MANDATE: every system must be coherent with the intended/logical/intuitive
nature of every other system. Cycle 1 re-verifies the pre-computed pair matrix (§3) against
the CURRENT tree. A MISSING-WITH-FOUNDATION candidate BUILDS during the loop only if it
passes THE FOUR GATES: (a) uses existing machinery on both sides (no new subsystems);
(b) obeys the dark/dormancy constitution; (c) has a soak-bandable effect; (d) is not
owner-parked scope. Gate failures → deferred seams or the owner queue, NEVER silent.

CONVERGENCE = a cycle yielding ZERO verified must-fix findings AND zero gate-passing
coherence gaps unbuilt AND zero achievable grade improvements. That triggers ONE
confirming cycle; if the confirming cycle is also clean, the loop CLOSES with a completion
row. Dimensions whose A+ is structurally unreachable pre-launch (needs real users, the
soak, or launch) carry their ceiling NAMED in the grade table, never silently regraded.

## 2b. THE EIGHT CROWNS (the experience standard)

1 settlement map generators · 2 world map generators · 3 settlement substance generators ·
4 casual game engines (game-feel: pacing, session rhythm, return-pull) · 5 prose & hooks
generators · 6 setting & world builder · 7 world simulator for TTRPGs · 8 AI usages for
TTRPG creation and framing. NOTE crown 2: the world map IS Azgaar's Fantasy Map Generator,
a vendored MIT fork at `public/map/` (iframe + sf-bridge.js postMessage RPC;
docs/fmg-fork.md is the runbook) — never score crown 2 against Azgaar; the fork sits
OUTSIDE all code gates by design (its only real gates are named in docs/fmg-fork.md).

## 3. THE PRE-STOCKED INTAKE (cycle 1 must disposition every item)

a) `docs/COHERENCE_MATRIX_R3.md` — the 105-pair coherence matrix, computed 2026-07-19
   against an OLDER base (aad6265e). MANY ROWS HAVE SINCE LANDED (the ruin-filter class
   was fixed structurally; migration×rumor was built as D-0; the roads seams folded;
   beliefs×roads landed as roads purpose 7). Cycle 1 RE-VERIFIES every defect and
   candidate against the current tree before acting: for each, confirm
   FIXED (cite the code) / STILL-OPEN (fix or build it) / DEFERRED (record why).
b) The remaining small seams from the build (task-#40 list): shared-war-coalition arm ·
   champion covenant UI (needs an npcLadderState mirror exposing nids past the secrets
   seam) · unbonded-conscience altruist payer channel (D-5) · third-party news pool.
   Each: build if it passes the four gates, else record as deferred-seam/owner-queue.
c) The §4 pre-stocked survey items (THE_REMAINING_ARCHITECTURE.md §4 "PRE-STOCKED
   ITEMS") — disposition each: many are already retired (the ladder faction-key bug is
   RETIRED, fixed and folded; check the ledger before re-investigating any).
d) The faction-key/record-shape structural sweep is FOLDED (source-scan ratchet
   `tests/lint/factionNamePrecedenceScan.test.js` + 14 pins) — cycle 1 verifies the
   ratchet is green and WIDENS the regex to the `.desc`/`.description` pair if the
   owner-gated addFaction call has been ruled.
e) Deferred-with-recipe items recorded in the ledger's lane-completion rows (search
   `docs/COMPREHENSIVE_REVIEW_PROGRAM.md` for "DEFERRED" in the 2026-07-19/20 rows).
f) Fresh from the mini-fold + completeness audit (2026-07-20): the D-7e clause-(i)
   generosityEV bond READ term is CONFIRMED ABSENT (strongestBond's only consumer is
   the D-4f contest pick — missing-with-foundation, both sides exist) · the
   refuge-gratitude seat-bond (deliberately excluded from the gratitude lane —
   candidate) · WB-g deterministic-violet re-tones closed-as-misconceived (vetoable) ·
   WB-k PDF counterseal refactor = post-launch owed (§10), not a loop debt.
g) EXPECTED BASELINE at loop entry (verified 2026-07-20 @ ca244100): two-shard suite
   14,460 passed / 4 failed = exactly the parked goldens · closure 1,024,511 ·
   strict 0 · tsc 0 · `npm run check` fully green. Any deviation from this baseline
   at your first run is a regression to triage BEFORE surveying.

## 4. THE CONSTITUTION (violating any of these fails the wave)

- EAGER BUDGET RATCHET: first-paint closure ≤ 1,040,000 bytes (`npm run build` then
  `npm run verify:dist`). Everything new lazy-loads. Raising the budget is ⛔OWNER.
- DOMAIN-STRICT CEILING 0: `npm run typecheck:domain:strict`, bare, exit code read
  directly. New/worsened files must be strict-clean; never widen a baseline.
- THE 4 PARKED GOLDEN REDS are the ONLY tolerated suite failures: generatorGoldenMaster ·
  beliefMapGolden · worldpulseDeityGolden · pdf goldenViewModel. They re-mint at THE ONE
  REGEN (owner-executed, pre-signed — NEVER re-record them yourself). ANY other red is a
  regression: triage by name against the base commit before proceeding.
- DORMANCY / DARK-FLAG DISCIPLINE: dark flags ⇒ BYTE-IDENTICAL worldState through the
  affected passes (the dormancy-golden test families prove it). New engine behavior ships
  dark behind its flag; flags light only at THE ONE REGEN.
- SINGLE-WRITER: each persisted ledger/sidecar has exactly one writing system; readers
  never mutate. The spatialLedgerCoverage walker enforces registration — it matches ONLY
  string-literal `setSpatialLedger` keys, so new keys must be literals + walker-listed.
- RATCHETS ONLY SHRINK: kill-list counts, domainAnyCast, size-baselines, raw-color counts
  — a ratchet test failing means your change grew an inventory; shrink it, never re-pin
  upward (re-pins to measured are a FOLD operation, recorded, not a loop workaround).
- NUL-SCAN before every commit batch: check changed files for NUL bytes with a python
  byte-count scan (`python3 -c "import sys;d=open(sys.argv[1],'rb').read();print(d.count(b'\x00'))" <file>`)
  — grep silently lies on NUL-bearing files.
- GIT DISCIPLINE (a shared tree — parallel sessions exist): NEVER `git stash` (it has
  destroyed work in this repo). NEVER `git add -A` / `-u` / `.` — stage explicit paths and
  verify every staged hunk is yours. Never `git prune` (live worktrees). A pre-commit hook
  runs eslint --fix on staged files — re-check `git status` after each commit. Begin every
  state-mutating command block with
  `cd <abs-worktree> && [ "$(git branch --show-current)" = "claude/composite-r4" ] || exit 1`.
- FIVE CANONICAL ACCESSORS, never hand-rolled reads: `nameOf` (faction display name) ·
  `governingFactionOf` · `factionArchetype` · `npcInFaction` · the institution roster
  filter (`isLiveInstitution`/`liveInstitutions`). Records mint `.faction`, NOT `.name` —
  the source-scan ratchet enforces the precedence.
- NO DEATH OUTCOMES: the simulation never resolves a named character's fate (owner scope
  law). No new death paths, ever.
- HOT FILES AT CEILING: several engine files sit at max-lines ceilings (size-baseline
  ratchet). New logic goes in a lazy leaf + re-export, never inline growth.
- REPORTING HONESTY: every claim labeled CONFIRMED (executed evidence quoted) or
  PLAUSIBLE (reasoning only). Failures reported verbatim. A legitimate behavior shift is
  DECLARED with its cause, never silent.

## 5. THE OWNER-GATED BOUNDARIES (never cross; queue instead)

⛔ `git push` of any kind (interim backup pushes included — hold everything for the owner) ·
⛔ deploys of any surface · ⛔ `supabase db push` / running migrations (migrations are
WRITTEN-not-deployed) · ⛔ golden re-minting / THE ONE REGEN (pre-signed, owner-executed) ·
⛔ eager-budget raises · ⛔ paid-surface behavior changes beyond the frozen designs ·
⛔ legal/ToS content · ⛔ promotion of composite-r4 onto claude/the-composite ·
⛔ the parked owner-decision queue (THE_REMAINING_ARCHITECTURE.md §9) — includes taste
vetoes (v2 maps, prose samples, atlas identity), support-email flip, HowToUse direction,
research-consent posture, budget re-pin · ⛔ new feature scope (THE SCOPE FREEZE,
2026-07-19: loop-found defects are fixes, not scope; everything else → the vNEXT ledger).
When a fix GRAZES a gated item, stop and queue it with a recommendation — momentum is
not authorization.

## 6. THE TAIL YOU HAND BACK (owner-executed; your job ends at convergence)

Declare convergence with the completion ledger row, then hand the owner this exact
sequence (do not start any of it): promote composite-r4 → PUSH #1 (dark, soak-ready,
backup/transfer — not the deploy) → THE SOAK on machine 2 (SOAK_PLAN_R2.md: CERT-30 /
CENTURY-100 / CENTURY-300 + the combinatorial toggle matrix) → THE TUNING WINDOW
(same-seed honesty rows per tune) → THE ONE REGEN (light the flags in
DEFAULT_SIMULATION_RULES, regen ALL goldens once, 100%-green full gate, declared-shift
ledger row) → THE WALK (owner walks the fully-lit world; fixes are render-layer) →
PUSH #2 (the lit, re-minted, walk-corrected state) → THE VERY END (master PR per
MASTER_MERGE_PLAN.md — re-survey it first; migrations in numeric order; carve-outs:
legal consult, support-email flip only after MX verify) → PUSH #3 (activation pushes as
external gates clear: MX/legal/Stripe-Connect). The program closes only when every
owner-gated activation surface is live or a recorded deliberate deferral.
