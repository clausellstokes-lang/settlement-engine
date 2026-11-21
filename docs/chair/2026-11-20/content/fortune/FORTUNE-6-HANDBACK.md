# FORTUNE-6 hand-back (kept current at every push; last written 2026-11-21 23:47:33 UTC by `date -u`)

For a successor: this file, `FORTUNE-5-HANDBACK.md` (its section 0 is the rulings in force; its section 2 the join
and the security reader), `FORTUNE-4-HANDBACK.md` sections 2, 3 and 5, `LIGHTING-WORKLIST.md`, and the open briefs
named below. The chair is the EIGHTH chair, session_01ACmDYY29VRchM87v1yhL9Q (send_message, Claude Code Remote MCP
server). Branch `lane/fortune-6-2026-11-21`, seated 2026-11-21 23:19 UTC on 321081ea9 (FORTUNE-5's saved tip).

## 1. WHERE THE LANE STANDS

| branch | tip | state |
|---|---|---|
| `lane/fortune-6-2026-11-21` | bce6e9eaa (pushed) | this lane |

| unit | state | commits |
|---|---|---|
| CURE-2 unit 1 (OSR rung 45 -> 46, `merits on breakdown`) | MERGED, read whole once. RED-FIRST re-run at 3ca68ffa1: the walker's two titles ("SHRINK-ONLY…", "A1/A7…") red, 45/47. GREEN at a4ffa59fa and at the merge: the door `check-observed-shape-readers` exit 0; `tests/lint/observedShape*` 5 files 175/175. The rung survives the line's merge (the line touched no OSR file). `tests/lint` whole at bce6e9eaa: 220/220 files, 3271/3271 tests (EXECUTED 23:47 UTC) | merge bce6e9eaa (of a4ffa59fa) |
| CURE-2 unit 2 (the legacy-config helper) | BUILDER seated 23:3x UTC on bce6e9eaa, local branch `lane/fortune-6-2026-11-21-cure2u2` (worktree `.claude/worktrees/u2`) | — |
| U5b | NOT STARTED: one builder on `briefs/U5b-BUILD.md` after unit 2 | — |
| lit re-measure | NOT STARTED | — |
| the line again + landing check | NOT STARTED | — |

NEXT STEP: read and merge unit 2 when its builder reports; then seat U5b.

## 2. Rulings in force (FORTUNE-5's section 0 items 1 to 7 stand; added since)

1. (the eighth chair, 2026-11-21) Open no pull request for any branch of this lane (COMMON-RULES 11).

## 3. For the join and the security reader

- The OSR rung 45 -> 46 is this lane's (merged at bce6e9eaa): another lane taking 46 conflicts at the join.
- U5b's served fields: FORTUNE-5-HANDBACK section 2 (to be confirmed at the build).

## 4. Hazards

- The container carries GIT_CONFIG_* / GIT_ASKPASS / GIT_EDITOR variables: every test runs through
  `scratchpad/clean.sh` (unsets every GIT_*), then `scripts/gate-mutex.sh --run`.
- Push only when HEAD differs from `git ls-remote`.
