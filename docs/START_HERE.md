# START HERE — successor bootstrap (any AI, any account, zero context)
### Written 2026-07-18 by the outgoing manager session (Claude Fable). If you are
### reading this, the owner's prior session ended (usage limit / model switch).
### This file assumes you know NOTHING. Read it fully before touching anything.

## 1. WHAT THIS IS
SettlementForge — a deterministic D&D settlement/world simulator (~612k LOC,
React/Zustand/Supabase), solo owner **Clausell Stokes**. A long audit-driven
program is mid-flight toward launch. The owner delegates heavily ("do what you
think is best") but every judgment is recorded VETOABLY in the ledger; certain
classes are owner-only (push→already authorized as backup; PR-merge, deploys,
`supabase db push`, golden-shifting flag lighting, budget raises, legal).

## 2. THE THREE DOCUMENTS THAT RUN THE PROGRAM (all in docs/, this branch)
1. **THE_REMAINING_ARCHITECTURE.md** — THE PLAYBOOK: every remaining slice/phase
   to launch with laws + done-whens (§1b base ruling; §2 slices; Phase D; folds;
   §4 ROUND 3; soak; ONE REGEN; THE VERY END). Execute FROM this.
2. **COMPREHENSIVE_REVIEW_PROGRAM.md** — THE LEDGER: reverse-chronological rows
   of every ruling and landing. The newest rows tell you exactly where things
   stopped. Append a row (+ commit) for everything you land. Never rewrite rows.
3. **Design docs** you will need: DESIGN_TRADITIONS.md (frozen; slices T-1..T-5),
   DESIGN_ILLUSTRATED_TOWN.md (slices IT-1..IT-6), THE_BASE_RECONCILIATION_MAP.md
   + THE_BASE_RESTORATION_LEDGER.md (Phase-D gate: zero PENDING rows),
   DESIGN_DEEP_CRAFT_PAGES.md, C1FIN_CONTROL_CENSUS.md (briefs/).

## 3d. ⭐⭐ SNAPSHOT REFRESH 2026-08-04 (~00:45 EDT — THE BUILD ERA HANDOFF; supersedes §3c/§3b/§3; git wins)
Written for an ACCOUNT SWITCH: the owner may resume from a different Anthropic
account. Same machine ⇒ the memory dir in §6 survives and its index is current;
different machine ⇒ THIS FILE + the two queue docs are sufficient alone.
- **WHERE THE BUILD LIVES**: minifold worktree
  (.claude/worktrees/minifold, branch claude/composite-r4, ~260 commits ahead
  of origin, NOTHING PUSHED — pushes are owner-confirmed, terminal phase).
  The ledger (this branch) takes "Ledger:" rows only.
- **THE ERA**: Fable chaired cycles 6-37 (2026-08-03→04) under total
  delegation: Opus implements+verifies, chair rules vetoably into
  docs/FABLE_VALIDATION_QUEUE.md (the CR-*/R-BLD-* registry lives there).
  Zero reverts. Every landing adversarially verified.
- **STATE AT WRITE TIME (verify with git log first — lanes may have landed
  after this line was written):** WR-1..7 COMPLETE+WIRED. WR-8: slices 1-6
  built+verified; the razing WIRED at the warDeployment mouth; the license
  SPREAD LANDED net-zero (WZ-3 @ b43986b5 — CR-PK-1's premise was FALSE,
  disproven by espree, the safe restructure taken; a multi-razing
  accumulator leak found+fixed in the same commit); the WD E-H debt closed
  (35→30); CR-WR8-H answered (believed razings = news ledger + hop-delay
  arrival, NO new persisted surface). Lane WZ-4 (wf_f902672d) was IN FLIGHT
  on the last three quarters: observer-axis hits, deterrence consuming
  readAllianceWebRisk (census: exactly ONE consumer today, must become
  exactly TWO), the casus wired. Its verifier says "WR-8 IS CLOSED" only if
  everything holds — read its queue row. THEN: WR-9 (instrumentation) → WR-10 (certification) →
  the war-file strict burn-down → Herald mint-index → FP engine waves.
- **THE RIBBON/IDENTITY PROGRAM**: docs/DESIGN_RIBBON_V4_SPEC.md (minifold)
  is THE LAW — the war-arrow header (cedar shaft, gilded wordmark on a bole
  bed, seal-o carrying the site device on a size ladder, four mirrored
  parallel feather slashes, quill-line indicator, texture-complete-at-part-2).
  Lane V4 (wf_80bd2b67) was IN FLIGHT executing it; V4.1 (task #105,
  OWNER-APPROVED counsel integrations incl. the nock build-and-show)
  dispatches when V4 lands. The bottom underline is RETIRED, not duplicated.
- **IN-FLIGHT LANES AT WRITE TIME** (if dead on resume: SURVEY PARTIAL EDITS
  FIRST — killed agents leave partial work; never sweep, never stash):
  wf_7fb11f8c (WZ-3, worldPulse), wf_80bd2b67 (V4, nav/brand/theme).
- **OWNER-GATED, PARKED (never silently build)**: K1 severity carry, seat
  ransom decisions, ransom persistence, compromise counterpart re-mint,
  razing-as-MINOR (J-WZ2-1, vetoable), the gilded-seal treatment (vetoable,
  rosette fallback), the nock (build-and-show, owner's glance decides),
  XW-7 scorched earth, K-cap signing, all §6b picks.
- **LAWS LEARNED THIS ERA (each bit; all in memory + queue rows)**: the
  STAGED-SET law (verify git diff --cached before EVERY commit; commit with
  pathspec); NUL bytes 5× (python byte-scan every write; grep/tail blind);
  per-file tsc --strict is VACUOUS; shared ratchets need git-diff-before-
  staging; the edge bundles are BUILT ARTIFACTS (freshness reds are never
  "inherited"; rebuild = repair, deploy = owner); lint-staged lints only
  staged files; parallel-load test reds are fake (ps aux first); the
  registration walkers in tests/domain are part of every decomposition gate;
  substring pins cannot see grammar; hand-keyed line addresses rot.

## 3c. ⭐⭐ SNAPSHOT REFRESH 2026-07-26 (~17:00 EDT — supersedes §3b and §3; git wins)
- **THE BANKING FOLD**: claude/composite-r4 @ 7a6603de now carries EVERYTHING the
  2026-07-20→26 era built — 12 lane commits (b503fe05..7a6603de, ~175k insertions):
  migrations contiguous to 188, the T5 launch surface (obligation webhook, cron
  workers, 4 ops runbooks, release identity, CSP enforce-flip pending owner
  ratification), the application-command spine, import reconciliation, the
  custom-content platform, TownScene 3D (opt-in), and the game-grade proof slices
  (all flags dark). Pushed to origin as backup under standing authorization —
  verify with `git ls-remote origin claude/composite-r4`.
- **GOVERNANCE**: decisions live in ONE surface now — docs/OWNER_DECISION_QUEUE.md
  (this branch). The 2026-07-26 ledger rows carry four rulings: 07-24 pivot
  ratified-by-banking (PRODUCT_COMPLETION_ARCHITECTURE's 10-step order = the
  governing frame; ⛔ tail acts unchanged) · golden-regen adjudicated (in-tree
  regens = documented corrections; THE ONE REGEN still owed, singular) · WAVE 8
  CONFIRMED NEVER RUN (money-code items missing; respec migs from 189; issue NO
  partial refunds until the webhook train deploys) · queue consolidated.
- **LIVE LANE**: a capability-remediation session (CAPABILITY_REMEDIATION_PLAN.md,
  waves R-0..R-5, minifold) was actively writing through the fold — fresh dirty
  state in minifold is ITS work; never clean/reset; its reds (mutation-manifest
  totality, distribution depth measurements) are expected until it closes.
- **Successor chain**: this file → COMPREHENSIVE_REVIEW_PROGRAM.md newest rows →
  OWNER_DECISION_QUEUE.md → minifold docs/CURRENT_STATE.md +
  PRODUCT_COMPLETION_ARCHITECTURE.md → lane docs.

## 3b. ⭐ SNAPSHOT REFRESH 2026-07-19 (~05:45 EDT — supersedes §3 below; git wins)
- The NIGHT RUN landed the ENTIRE deep-craft build: C1–C16 all complete;
  traditions lane complete (T-1..T-5, tip 80b8ad71); illustrated-town complete
  (d16d348e); FOLD BATCH 1 folded c2(+c2l)/c13/c5 into claude/deep-craft
  (tip aa55836a+burn-down commits, main deep-craft worktree agent-a39bc...).
- UNFOLDED branches awaiting FOLD BATCH 2 (ceilings set to measured counts at
  the fold): deep-craft-c14c15 @ 7748d49a · deep-craft-c16 @ 41ae4a1e ·
  deep-craft-pages @ 55e4a69c (carries a DECLARED kill-list red by design) ·
  restoration-pdf @ 2e4f3282 · restoration-chrome (running) ·
  restoration-compendium (running) · the burn-down commits on deep-craft itself.
- Phase-D: census COMPLETE (docs/PHASE_D_RESTORATION_CENSUS_2026-07-19.md);
  restoration ledger at ZERO PENDING (23 RESTORATION-OWED being worked by the
  sweeps). Expected reds NOW: the 4 parked goldens (aiGrounding freshness was
  CURED at the deep-wave fold — no longer expected);
  organicSamples was CURED at C3-e (a red there = new drift); pages-lineage
  branches carry the declared kill-list red until fold 2.
- The 15-min lane-keeper heartbeat + the ledger rows (newest-first around line
  ~1137) are the live state. THE FABLE BOUNDARY: 23:59:59 PT Jul 19 — the
  continuity order (§6b) hands this loop to the Opus successor unchanged.

## 3. STATE SNAPSHOT AT WRITE TIME (verify with git — never trust this over git)
- **Main tree** (/Users/cstokes/Desktop/settlement-engine) = branch
  `review-fixes-2026-07-08` — LEDGER ONLY. Never check out code branches here.
- **Worktrees** (.claude/worktrees/): `agent-a04d3f325c72e62dd` =
  claude/the-composite @ 78a04afc (the code base of record) ·
  `agent-a39bc277a620ae767` = claude/deep-craft (create page COMPLETE + library
  restored + Living Backdrop; last known a7afc9cc) · `illustrated-town` =
  claude/illustrated-town (IT-1..IT-3 landed @ 5324c246; IT-4 was RUNNING —
  check `git -C <wt> log/status`: clean tree = last commit is truth; dirty tree
  = an agent died mid-work, DISCARD nothing, read the diff first) ·
  `traditions` = claude/traditions (T-1 @ 686d2cb9; T-2 was RUNNING — same check).
- **GitHub backup** (origin): review-fixes @ b95bf331 + w7-prep + the-composite +
  deep-craft@9906d793 pushed/verified. The lane branches were NOT yet pushed
  (pre-push hook rejected under machine load — retry when quiet; hook runs the
  full suite, ~7 min; NEVER --no-verify).
- **Expected suite reds on the composite lineage — EXACTLY 4**: the 4 parked
  golden families (generatorGoldenMaster, beliefMapGolden, worldpulseDeityGolden,
  pdf goldenViewModel). aiGroundingBundle.freshness was CURED at the deep-wave
  fold (`npm run build:edge-shared`) and is no longer a red. THE_RESURVEY_HANDOFF
  §3g carries the live baseline. ANY other red: triage by name vs
  the base tip; timeout-shaped reds under machine load are FLAKES — isolation
  re-run before diagnosis (proven ~6× on 2026-07-18).

## 4. THE NON-NEGOTIABLE PROTOCOL (each has bitten this program; all are load-bearing)
- Hard gate EVERY state-mutating compound: `[ "$(git branch --show-current)" =
  "<expected>" ] || exit 1` — cwd resets between shell calls silently.
- `git stash` FORBIDDEN. A foreign stash (analytics-intelligence-layer) exists —
  never touch it. Never `git add -A/-u/.` — explicit files only.
- Gates run BARE, each exit code checked — a pipe (`| tail`) masks failures.
- `npm run build` BEFORE verify:dist. Worktrees resolve the MAIN tree's
  node_modules (works; triage reds by name-identity vs base).
- NUL-scan diffs with python before merges (grep silently lies on NUL bytes).
- Eager first-paint budget 1,040,000 B (ratchet-tested); everything new lazy.
- Kill-list ratchets (tests/design/deepCraftKillList.test.js) are tolerance-0
  shrink-only. domainAnyCastBaseline runs PER-COMMIT on any domain-touching lane.
- New engine systems ship DARK behind VIRTUAL flags (absent from
  DEFAULT_SIMULATION_RULES) with byte-identical dormancy goldens.
- Full suite at every fold (focused gates have a proven blind spot).
- Behavioral test pins stay green UNTOUCHED; a rewritten pin is a violation.

## 5. HOW TO RESUME (in order)
1. `git -C <each worktree> branch --show-current && git log --oneline -3 &&
   git status --porcelain` — build the real state picture. Reconcile against the
   ledger's newest rows.
2. Finish any half-done slice per its design doc's slice spec (the briefs' shape:
   lettered commits, focused gates per commit, full suite at lane end).
3. Then follow THE_REMAINING_ARCHITECTURE.md top to bottom. The remaining arc:
   T-3..T-5 · IT-5..IT-6 · deep-craft slices C4 (dossier — the owner's CLOSED
   content model), C2 (the Welcome FILM — spec in §2, six chapter legs from the
   master at ~/Desktop/settlementforge-marketing-masters/), C3/C5/C6-C16 ·
   Phase D (ratchets 0×4 + restoration ledger zero PENDING) · the folds ·
   ⛔owner finished-site walk · push completion · ROUND 3 (vs THE EIGHT CROWNS,
   §4, intake pre-stocked) · soak · tuning · THE ONE REGEN (pre-signed; light
   the EIGHT flags incl. traditionsEnabled) · THE VERY END (⛔owner: legal,
   support-email flip after MX verified, merge button, db push).
4. Ledger row + commit after every landing. The owner walks; their eye overrides
   any green suite — treat their one-line corrections as rulings and record them.

## 6. IF YOU ARE CLAUDE (same machine/user): persistent memory lives at
~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/memory/ (MEMORY.md is
the index — hazards, rulings, gotchas). If you are NOT Claude: everything
load-bearing from memory has been mirrored into the docs above; trust the repo.

## 6b-2. ⭐⭐ CONTINUITY ORDER UPDATED (owner, 2026-07-31 — supersedes 6b's model):
"If i run out of fable, i want you to seemlessley switch to opus 5." An OPUS 5
successor inherits FULL standing authority the moment the prior session ends — same
laws as 6b (judgments vetoable, owner-gated classes never self-ruled, ultracode on,
manager+implementer both chairs). NEW OBLIGATION: every Fable-chair judgment
(acceptance, architecture deviation, golden adjudication, soak interpretation, tuning
ratification) made under Opus is recorded as a row in the code branch's
docs/FABLE_VALIDATION_QUEUE.md; a later Fable-capable account re-validates oldest-first
(CONFIRM/ADJUST-forward/ESCALATE) and readjusts instructions on systematic lean. The
LIVE program surface is minifold docs/DESIGN_REALM_DIRECTIVES.md (Progress blockquote).

## 6b. ⭐ STANDING CONTINUITY ORDER (owner, 2026-07-18, verbatim intent):
"if i run out of fable, automatically switch and continue all the work with opus
4.8 ultracode fast. don't wait on me." — A successor session on OPUS 4.8 (fast
mode, ULTRACODE ON) inherits FULL standing authority the moment the prior session
ends: DO NOT wait for the owner, do not re-ask for the delegation — resume per §5
immediately. Same laws: judgments recorded vetoably in the ledger; owner-gated
classes (⛔ items) still never self-ruled; the owner's walk feedback = rulings.
Ultracode standing: orchestrate with workflows/parallel implementer agents by
default; adversarially verify findings; the manager/implementer split continues
with Opus in both chairs.

## 7. STAFFING NOTE (owner's standing preference, brand-agnostic)
One MANAGER context holds the ledger and dispatches; IMPLEMENTER agents/sessions
do every code change in the correct worktree with VERIFY-FIRST briefs (state the
expected branch+tip; the implementer stops on any mismatch). If your platform has
no subagents, work serially as your own implementer — the protocol is identical.
The owner's model split (strongest model = manager/architect; capable model =
implementers) translates to whatever tiers you have.
