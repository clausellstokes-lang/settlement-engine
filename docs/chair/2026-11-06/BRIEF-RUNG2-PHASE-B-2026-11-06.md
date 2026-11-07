# BRIEF — RUNG-2 LANDING, PHASE B: THE DECLARATION REGISTERS AND THE TWO INLAND SCOPE PHRASES (lane RUNG2-B, 2026-11-06)

Seat: Opus 5.5, builder. Chair: Fable 5.1, cloud session `01FE9mEvGxnFx6WTBkEC6ie9`, under the owner's full delegation. You send no messages; your report is the hand-back.

## 0. Where you work and the rules

- Worktree `/home/user/se-rung2`, branch `lane/rung2-landing-2026-11-06` (phase A, the strict-type holes, is already on it — read its commit first). `node_modules` is a symlink; never `npm install`; never edit `package.json`/`package-lock.json`.
- 4 cores shared with a running gate, a sibling lane and a 10,000-settlement soak: targeted vitest only; corpus loops at `--workers 2`; never `npm test`, never `npm run check`.
- Never read a gate through a pipe (redirect to a file under `/tmp/claude-0/-home-user-settlement-engine/91098d1e-536b-53ea-a385-88e9fe415a85/scratchpad/` and read the exit code there). No dumps. Read WHOLE every file you change.
- Commit by explicit paths, receipts in the body, ending with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01FE9mEvGxnFx6WTBkEC6ie9`
- Push as transport after each unit (`git push -u origin lane/rung2-landing-2026-11-06`); never another branch; never a pull request. Stop at about 300k tokens of your own context, committed and pushed.
- Read first, whole: `docs/census/COMPOSE_2026-11-06.md` (the compose's record; its §5 queue and §6 questions), `docs/census/CHAIR_RULINGS_2026-11-05.md` blocks 10:0x and 10:3x, and `docs/OPERATING_STANDARD.md` §1, §4, §5.

## 1. Unit 1 — the declaration registers' own re-take (R-T, the compose's Q4)

`tests/lint/declarationRegisters.test.js` has two titles red at the tip because the registers lag the declarations the census lanes made. Read the test whole: it names its door (`RETAKE_DECLARATION_REGISTERS=1`). Run the re-take through that door exactly as the test prescribes, redirected to a file; then the test green from its own run; say which registers moved and by how many rows (grep the diff's count lines; never print a register). Commit the registers with the test's receipt. If the door writes anything the test does not own, STOP and report.

## 2. Unit 2 — the two inland scope phrases (the chair's ruling of 10:0x, confirmed 2026-11-06)

The Norse and the Slavic culture scope phrases are mute on an inland birth (38 of 98 Norse births, 30 of 82 Slavic births at the compose's count): the pool's lines all presume the sea. Write ONE inland scope phrase for each culture, in the house voice (knowing, dry, concrete, cause-first; read `docs/POOL_WRITING_PROCEDURE.md` whole and three neighbouring lines of each pool for the register), declared through the census's own channel exactly as the pool's other lines are (the line declares the facts it presumes — an inland one presumes NO water; use `docs/census/VOCABULARY_RULINGS_2026-11-04.md` for the atom names), so the draw admits it where the sea lines are refused. Red-first: a test that an inland Norse birth and an inland Slavic birth print a scope phrase (red at the parent: mute); the prose generator's `--check` and the wiring census's `--dry` (re-take through its door if rows move; say "rows: N"); count on the 1,000: mute Norse 38 / 98 → N, Slavic 30 / 82 → N. Goldens: count the rows that move with a scratch hasher (the line prints into the record where the slot was mute); re-record nothing. LIST THE TWO LINES VERBATIM in your record — they are the owner's veto class, exactly as rung 1's three authored inland texts were.

## 3. The hand-back

- A section appended to `docs/census/COMPOSE_2026-11-06.md` ("RUNG-2 LANDING, PHASE B") with both units' receipts, the two lines verbatim, the registers moved, the goldens moved.
- Your final message: at most 250 words plus ONE table — outcome first; what the chair must rule; one CONFIRMED-vs-PLAUSIBLE sentence; the tip sha and whether it is pushed.
