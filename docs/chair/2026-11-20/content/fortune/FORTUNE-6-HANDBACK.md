# FORTUNE-6 hand-back (kept current at every push; last written 2026-11-22 00:14:28 UTC by `date -u`)

For a successor: this file, `FORTUNE-5-HANDBACK.md` (its section 0 is the rulings in force; its section 2 the join
and the security reader), `FORTUNE-4-HANDBACK.md` sections 2, 3 and 5, `LIGHTING-WORKLIST.md`, and the open briefs
named below. The chair is the EIGHTH chair, session_01ACmDYY29VRchM87v1yhL9Q (send_message, Claude Code Remote MCP
server). Branch `lane/fortune-6-2026-11-21`, seated 2026-11-21 23:19 UTC on 321081ea9 (FORTUNE-5's saved tip).

## 1. WHERE THE LANE STANDS

| branch | tip | state |
|---|---|---|
| `lane/fortune-6-2026-11-21` | a2e4b0e40 + this hand-back (pushed) | this lane |
| `lane/fortune-6-2026-11-21-cure2u2` | 7ff3feecc (local only, merged) | unit 2's builder branch |

| unit | state | commits |
|---|---|---|
| CURE-2 unit 1 (OSR rung 45 -> 46, `merits on breakdown`) | MERGED, read whole once. RED-FIRST re-run at 3ca68ffa1: the walker's two titles ("SHRINK-ONLY…", "A1/A7…") red, 45/47. GREEN at a4ffa59fa and at the merge: the door `check-observed-shape-readers` exit 0; `tests/lint/observedShape*` 5 files 175/175. The rung survives the line's merge (the line touched no OSR file). `tests/lint` whole at bce6e9eaa: 220/220 files, 3271/3271 tests (EXECUTED 23:47 UTC) | merge bce6e9eaa (of a4ffa59fa) |
| CURE-2 unit 2 (the legacy-config helper) | MERGED, read whole once: NEW `tests/helpers/fortuneLegacyConfig.js :: legacyConfig` (`birthConfig` with `FORTUNE_LAW_CONFIG_KEY` deleted) in the ABSENT arm only of Standing (c), Safety (e), Fortune (d), Merits (a); forced arms and `fortuneLawWiring.test.js` untouched; every no-law caller checked to be a dark arm. RE-RUN BY ME at a2e4b0e40, the lane's 13 files: dark 202 passed / 1 failed / 11 skipped (the one red `engineChunkLazy` › "the law is out of vite's own eager first-paint derivation", needs a fresh dist, red in both trees); FLIPPED (only `NEW_SETTLEMENT_FORTUNE_LAW_VERSION = SIZE_RELATIVE_FORTUNE_LAW_VERSION`, verified by `diff -r`): 199 / 4 / 11, the 4 = that build title + wiring's "the vocabulary: one key, two versions, the dial at the default", "1. CREATE (dark)…", "2. CREATE (THE CLAMP)…" (FORTUNE-5's flipped run was 38). The builder's gates at 7ff3feecc: tests/lint 220/220 · 3271/3271; typecheck:ratchet 167/167; domain strict 1113/1113; lint 0 errors | 7ff3feecc, merge a2e4b0e40 |
| U5b | NOT STARTED: one builder on `briefs/U5b-BUILD.md` after unit 2 | — |
| lit re-measure | NOT STARTED | — |
| the line again + landing check | NOT STARTED | — |

NEXT STEP: seat the U5b builder on `briefs/U5b-BUILD.md` from a2e4b0e40.

## 2. Rulings in force (FORTUNE-5's section 0 items 1 to 7 stand; added since)

1. (the eighth chair, 2026-11-21) Open no pull request for any branch of this lane (COMMON-RULES 11).

## 3. For the join and the security reader

- The OSR rung 45 -> 46 is this lane's (merged at bce6e9eaa): another lane taking 46 conflicts at the join.
- U5b's served fields: FORTUNE-5-HANDBACK section 2 (to be confirmed at the build).

## 4. Hazards

- The container carries GIT_CONFIG_* / GIT_ASKPASS / GIT_EDITOR variables: every test runs through
  `scratchpad/clean.sh` (unsets every GIT_*), then `scripts/gate-mutex.sh --run`.
- Push only when HEAD differs from `git ls-remote`.
