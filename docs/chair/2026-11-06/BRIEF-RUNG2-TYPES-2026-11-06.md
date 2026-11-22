# BRIEF — RUNG-2 LANDING, PHASE A: THE STRICT-TYPE HOLES (lane RUNG2-TYPES, 2026-11-06)

Seat: Opus 5.5, builder. Chair: Fable 5.1, cloud session `01FE9mEvGxnFx6WTBkEC6ie9`, under the owner's full delegation. You send no messages; your report is the hand-back. A SMALL lane: types only, no runtime change.

## 0. Where you work and the rules

- Worktree `/home/user/se-rung2`, branch `lane/rung2-landing-2026-11-06`, cut from the census compose's tip `30824a418`. `node_modules` is a symlink; never `npm install`; never edit `package.json`/`package-lock.json`.
- 4 cores shared with a running gate, a sibling lane and (soon) a 10,000-settlement soak: run only `npm run typecheck:domain:strict`, `npm run typecheck:ratchet`, bare `npx eslint <files>` and targeted `npx vitest run <files>`; never `npm test`, never `npm run check`.
- Never read a gate through a pipe (redirect to a file under `/tmp/claude-0/-home-user-settlement-engine/91098d1e-536b-53ea-a385-88e9fe415a85/scratchpad/` and read the exit code there). No dumps into your context. Read WHOLE every file you change.
- Commit by explicit paths, receipts in the body, ending with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01FE9mEvGxnFx6WTBkEC6ie9`
- Push as transport when done (`git push -u origin lane/rung2-landing-2026-11-06`); never another branch; never a pull request.

## 1. The unit

`npm run typecheck:domain:strict` is red at the tip (`/tmp/claude-0/-home-user-settlement-engine/91098d1e-536b-53ea-a385-88e9fe415a85/scratchpad/strict-rung2-before.log` holds the run): new strict errors in `src/domain/display/stateProse/composeStateProse.js` (+2, baseline 0) and `src/domain/coherence/crisisFactFindings.js` or its neighbour (+4; read the log for the exact file). The ceiling is 1,113 and a new or worsened file must be strict-clean. Cure them the way the rung-1 landing cured its own (commit `3d8a74e4b` on `origin/lane/landing-rung1-2026-11-04`, read its message and diff first): real JSDoc types for the values the code reads (typedefs with `unknown` fields where the shape is open), never an `any` cast, never a runtime change — the emitted JavaScript behaviour must be byte-identical (prove it: `node -e` that imports each changed module and hashes the exported functions' `toString()` before and after is enough, or a targeted vitest run of the modules' own tests plus a diff of the built output of the two files if a build step exists; say which). Receipt in the commit: `typecheck:domain:strict` exit 0 with its count line; `typecheck:ratchet` exit 0 (167 against 167); eslint 0 on the touched files; the targeted tests green; and whether `docs/content/wiring-census.json` stamps either file's sha (as it did for `defenseStateProse.js` in rung 1 — if a stamp moves, re-take it through `node scripts/wiring-census.mjs` and say "sections that would move: stamp, rows: 0" from its `--dry` first). Also run `node scripts/count-domain-any.mjs --update` ONLY if the domain any-cast baseline test (`tests/lint/domainAnyCastBaseline.test.js`) names your files; the baseline may only shrink.

## 2. The hand-back

- A short record section appended to `docs/census/COMPOSE_2026-11-06.md` ("RUNG-2 LANDING, PHASE A: the strict-type holes") with the before → after counts and the receipts.
- Your final message: at most 200 words plus ONE table — outcome first; one CONFIRMED-vs-PLAUSIBLE sentence; the tip sha and whether it is pushed.
