# SEAT-1 train 1 — what every builder reads first (the seventh chair; SEAT-1 integrates, you build)

**Read whole before your own brief:** `CLAUDE.md`, `CONTRIBUTING.md`, `docs/OPERATING_STANDARD.md`; the chair's rulings in `docs/chair/2026-11-20/content/seat/SEAT-1-PROPOSAL.md` (and the chair's answer to it, where your brief cites one); the measure `SEAT-COUNT.md`, `SEAT-MAP.md`, `SEAT-KIN.md`, `SEAT-GATE.md` beside it. Every source file you change, you read WHOLE, once.

**The owner's words this train serves (2026-11-20, verbatim):** "Every power group should be able to compete for leadership or the seat given the right circumstances." · "Shouldn't a guild council represent the seat that is led by the power of a merchant guild or craft guild? … the government type could be an autocracy but it is the merchant guilds who installed a king of their own on the thrown". · "A calm town should be as it currently is … Don't invent drama capitalize on what's already there if it's there." And the dual-hat law of 2026-11-11 (`src/generators/people/representatives.js :: dualHatHouseOf`).

**The model:** the FORM of government (`powerStructure.government`), the HOLDER (the power that holds the seat), the PERSON in it. Three things, correlated, never one.

## The laws of the train (they bind you whatever your brief says)

1. **The gate.** Every behaviour you add runs only for a settlement whose `config._seatLawVersion` (or `_config`) reads the new law, through the one reader U1 lands (`src/domain/seat/seatLaw.js`). Absent or old law: byte-identical to today, proven by a test that runs the old path on the same fixture. No stored town, no golden row, no live campaign's next verdict moves.
2. **No new stored key.** Nothing new under `powerStructure`, on `npcs`, or anywhere in the stored town (the one exception is U1's law key in `config`). The office keeps its own power figure: no share is re-dealt.
3. **Nothing invented.** No circumstance, power, contender or history is minted to make a contest. A town whose record holds none keeps today's contest; a town with no contender stays one.
4. **The security lane's files are not yours:** nothing under `supabase/`, `src/domain/veil/`, `tests/security/`, no `src/domain/display/gallery*.js`, not `src/domain/display/publicSafe.js`. A string you move still NAMES every power it speaks of in the same string (a pronoun or "its own council" is never the only reference).
5. **Neighbours in flight:** FRAME-1 owns `src/domain/summary/tonightSheet.js`, `src/domain/crisis/`, `src/domain/tension/`; NAMES-1 owns the prose composers. Touch neither unless your brief names the file.
6. **Constants:** no new top-level named numeric constant outside a registered tuning table (`tests/lint/.tuning-register.json`; read `tests/lint/tuningRegister.walker.test.js`). A new walker owes its row in `scripts/mutation-coverage-manifest.json`.
7. **Prose:** a line a reader sees follows `docs/content/SOP_POOLS_AND_CONDITIONS.md`; a power in a sentence takes its prose form through `src/domain/display/governanceAccount.js :: powerNameInProse`.
8. **Cite by symbol** (`path :: symbol`), never by line.

## How you work

- Your worktree is your own branch `lane/seat-2026-11-20-u<N>`, cut from the commit your brief names. Commit there by explicit paths (never `git add -A`), one commit per unit or per declared step, with the receipts in the message and the trailers:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_019yED1PyQxQZi2zHJeLhhLu`. Do NOT push; SEAT-1 reads your diff and pushes.
- **Red first.** Write the arms your brief lists, run them, and record the failing titles BEFORE the code. Record the red count and the green count in your commit message.
- **Gate reading.** Never read a gate through a pipe. Every run to a file, read by its count lines: `sh scripts/gate-tail.sh <command…> > <log> 2>&1`. Targeted Vitest only, through the mutex: `GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 <files>`. Never the whole suite. No test run with any of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX set.
- **Green before you hand back:** your arms; every test file of every module you changed (find them with `grep -rl <module basename> tests`); `tests/lint` WHOLE if you added or changed any test file; `tests/lint/densityCreateBoundary.walker.test.js`; `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint` (each through `scripts/gate-tail.sh`).
- **Stop and report** on a mismatch with your brief, a red you did not cause, a register you would have to widen, or a ruling you lack. Never invent behaviour to get past it.
- **Hand-back:** at most 300 words: the commit(s), red → green counts per arm, every register/pin/figure that moved (before → after, by file and title), what you did NOT do, CONFIRMED vs PLAUSIBLE.
