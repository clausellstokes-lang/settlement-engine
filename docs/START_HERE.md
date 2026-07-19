# START HERE — successor bootstrap (any AI, any account, zero context)
### Written 2026-07-18 by the outgoing manager session (Claude Fable). If you are
### reading this, the owner's prior session ended (usage limit / model switch).
### This file assumes you know NOTHING. Read it fully before touching anything.

## 1. WHAT THIS IS
SettlementForge — a deterministic D&D settlement/world simulator (~430k LOC,
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
- **Expected suite reds on the composite lineage — EXACTLY 5**: the 4 parked
  golden families (generatorGoldenMaster, beliefMapGolden, worldpulseDeityGolden,
  pdf goldenViewModel) + aiGroundingBundle.freshness (cure queued at the deep-wave
  fold: `npm run build:edge-shared`, declared). ANY other red: triage by name vs
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

## 7. STAFFING NOTE (owner's standing preference, brand-agnostic)
One MANAGER context holds the ledger and dispatches; IMPLEMENTER agents/sessions
do every code change in the correct worktree with VERIFY-FIRST briefs (state the
expected branch+tip; the implementer stops on any mismatch). If your platform has
no subagents, work serially as your own implementer — the protocol is identical.
The owner's model split (strongest model = manager/architect; capable model =
implementers) translates to whatever tiers you have.
