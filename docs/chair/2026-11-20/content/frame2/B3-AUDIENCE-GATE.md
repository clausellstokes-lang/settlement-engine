# FRAME-2 · brief B3 — the explicit audience gate (CF3 sharpened)

Written by FRAME-2 (the integrating seat) on `lane/frame-2-2026-11-20`. You are a builder of FRAME-2: one unit, one commit, red first. Read whole, before you edit: `CLAUDE.md`; `src/domain/summary/tonightSheet.js`; `src/domain/tension/troubleCast.js`; `src/components/TableView.jsx`; `src/components/TonightSheet.jsx`; `src/components/session/SessionMode.jsx`; `src/pdf/sections/TonightAtTheTable.jsx`; `src/foundry/journalPages.js` (the function `tonightPage` and its callers); `src/components/OutputContainer.jsx` (only where it mounts `TableView` and computes `readOnly`, `saveId`, `playerView`, `publicDossier`); `src/components/PublicDossierView.jsx`; `src/components/PartyLinkView.jsx`; `tests/security/frameShareVeil.test.jsx`.

## The ruling you build (the chair's, final form)

"`composeTonightSheet(settlement, { audience })`: a reader who is not the owner gets today's sheet, never the frame; the missing seed stays a second lock, never the first. THE BORN TEST OPENS THE SHEET ON THE GALLERY PAGE AND ON THE PARTY LINK (the session sheet opens there today, a gap of the security lane's, already reported to it: you do not cure that gap; you prove the frame never rides it)."

"The frame" is everything `castTroubleFrame` composes: `sheet.frame`, the trouble's opening line in place of the pressure sentence, the sides' people and the frame's hook order. A reader who is not the owner gets exactly the sheet a town with no frame gets today.

## What to build

1. `composeTonightSheet(settlement, options)` takes a second argument `{ audience }`. The frame is composed ONLY when `audience === 'owner'` (a closed value; export the allowed audiences as a frozen constant from `tonightSheet.js`). ANY other value, a missing argument, or a missing `audience` composes no frame: FAIL CLOSED. The seed gate inside `castTroubleFrame` stays as it is (the second lock).
2. Every caller passes its audience EXPLICITLY:
   - The DM's own exports (`TonightAtTheTable.jsx`, `journalPages.js :: tonightPage`): `'owner'` (they are built only from the owner's own record; confirm by reading who calls them, and say so in your commit body).
   - `SessionMode.jsx`: find where it is mounted and from what; pass `'owner'` only if it can only be mounted on the owner's own record; else thread the audience as the Table View's is threaded.
   - `TableView.jsx`: takes an `audience` prop and passes it through; with no prop it composes as a non-owner (fail closed).
   - `OutputContainer.jsx`: at the ONE place it mounts `<TableView>`, pass `audience` = `'owner'` only on the owner's own surfaces (the live editor, and the owner's own saved view: read how the file already tells those apart from the public gallery dossier and the player view: `publicDossier`, `playerView`, `readOnly`, `saveId`), else a non-owner value. Change NOTHING else in that file: the mount itself, the "Open Tonight" button and every other gate are the security lane's (do not add or move a gate on the mount). This one prop is the ONLY edit to `OutputContainer.jsx`.
   - `crisisPage.js` and `crisisFactFindings.js` read only `.facts` or a town in crisis: leave them untouched (with no audience they compose no frame, which changes nothing they read; prove that by their existing tests staying green).
3. The born test: extend `tests/security/frameShareVeil.test.jsx` (it is the frame's own veil test; no other file under `tests/security/`). Add a test that RENDERS the real pages a stranger opens and OPENS THE SHEET ON THEM: `PublicDossierView` (the gallery page) and the party link's page, each fed a born town's shared read through the existing mocks, then opens the Tonight sheet the way a viewer does on that page (find the button or the persisted preference that opens it: the hand-back `docs/chair/2026-11-20/content/FRAME-1-HANDBACK.md` names both), and asserts the sheet DREW (liveness: `[data-tonight-sheet]` present) and that none of the frame's lines are in the page. AND a test that the gate is the FIRST lock: hand `composeTonightSheet` the OWNER'S record WITH its seed and a non-owner audience (each of: no options, `{}`, `{ audience: 'player' }`, `{ audience: 'gallery' }`, `{ audience: undefined }`) and assert no frame and a sheet deep-equal to the no-frame sheet; and `{ audience: 'owner' }` on a town whose record casts a frame does cast it (liveness). Keep every existing assertion of the file.
   NOTE: a sibling unit may by then have narrowed which calm towns carry a frame (a trouble of weight). If a town the test lists casts no frame on the owner's record, choose your liveness towns by measuring which born towns DO cast one; never weaken an assertion to pass.
4. RED FIRST: before your change to `tonightSheet.js`, run your new tests and record that the first-lock test is red (the owner's seeded record with no audience casts a frame today). Then build, then green. Keep the red run's count line for your commit body.

## Gates (every run to a file; read the count lines; never through a pipe: `sh scripts/gate-tail.sh <command>`)

- `npx vitest run tests/security/frameShareVeil.test.jsx tests/domain/tension` and every existing test file that imports `tonightSheet.js`, `TableView.jsx`, `TonightSheet.jsx`, `SessionMode.jsx`, `TonightAtTheTable.jsx` or `journalPages.js` (find them with grep; list them in your commit body with the pass counts).
- `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`.

## Commit

One commit on `lane/frame-2-2026-11-20`, staged by explicit paths (never `git add -A` or `.`); hooks on, never `--no-verify`; do NOT push; do not reset, stash or check out. Message `feat(FRAME-2 · B3): the explicit audience gate on the session sheet; the frame for the owner only`, with the red and green counts in the body, ending with:
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_019yED1SkacgZyeUgMMGhdL4`.
No environment variable GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in any command. Do not edit `package.json` or `package-lock.json`, anything under `supabase/`, `src/domain/veil/`, `src/domain/display/gallery*.js`, `src/domain/rulingPower*.js`.

Final message: at most 250 words: the sha, the red and green counts, how the party link's sheet was opened in the test, and anything you found that is not yours.
