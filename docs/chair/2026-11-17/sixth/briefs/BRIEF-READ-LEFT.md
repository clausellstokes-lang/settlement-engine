# BRIEF-READ-LEFT: the second reader on one seat of the leftovers round, before it lands

You are a SECOND READER for the sixth chair (session_01FbPLbcLDSJzZFzb5B7EjxR). Your prompt names ONE SEAT of the round
(LEFT-PDF, LEFT-CHAIN, LEFT-LINES or LEFT-MARKS), ITS BRANCH, ITS TIP and ITS BASE. YOU CHANGE NO FILE OF THE PRODUCT AND
PUSH NOTHING. You read the seat's whole diff cold against what the chair asked, you PROVE what you find by running it,
and you send ONE message. This file and your prompt are your whole assignment. Your reader is the chair: findings first.

## What you read first, and no more (your context is your budget: stop and send what you have at 300,000 of your count)

1. `docs/chair/2026-11-17/sixth/briefs/BRIEF-LEFT.md` on the chair's lane (`git fetch origin lane/chair-2026-11-08`;
   read it with `git show origin/lane/chair-2026-11-08:<path>`): "The rules" and THE ONE SECTION OF YOUR SEAT (with its
   amendments), and the seats' table (the seat's file list).
2. The worklist rows the section names (`docs/chair/2026-11-17/sixth/LEFTOVERS-WORKLIST.md` on the chair's lane; print
   each with `grep -n "^| L<n> "`), and in `docs/chair/2026-11-17/bar7/RULINGS.md` (the chair's lane) and section 6 of
   `docs/chair/2026-11-17/sixth/CHAIR-HANDOFF-SIXTH.md` only the rulings the section names (BR10, BR11 are in the latter).
3. On the seat's branch: `docs/chair/2026-11-17/left/LEFT-<SEAT>-HANDBACK.md`.
4. THE DIFF: `git diff <base>..<tip> -- src tests` (and `--stat` over everything first).

## Your tree

`git worktree add --detach /home/user/T <tip>`; `npm ci` there (or `cp -al` of a built `node_modules`, then
`rm -rf node_modules/.vite`). A second worktree at the base (`/home/user/B`) for before-and-after. The page as printed:
`docs/chair/2026-11-16/probes/PAGE-COPY/README.md` on the chair's lane (one command renders any list of seeds at a
tree). Populations: the seat's own (its hand-back names them); the 150 are
`docs/chair/2026-11-17/birth/birth3/seeds.w150.txt` at the checkout; the census's 720 are PAGE-COPY's `seeds.txt`.
Every gate is read through `sh scripts/gate-tail.sh <command...>`, never through a pipe.

## Part 1: each row built as asked, with a run

For every row and amendment item of the seat's section: is it built as the brief asks, and does a run of yours show
it (the page before and after on the row's own towns, by PAGE-COPY or the seat's guard)? A row the seat says was cured
at the base already: run it at the base and say so. A row the seat dropped or narrowed: say whether its reason holds.
Is every changed file inside the seat's list in the table (name any that is not)? Is every commit signed with one
parent (`git log --format='%h %G? %p' <base>..<tip>`; the chair's machine cannot verify the key: report what you see)?

## Part 2: every modified test read for weakening

`git diff --stat <base>..<tip> -- tests`. THE RULE (R8): a guard is never narrowed; a test the cure makes untrue is
re-keyed BY IDENTITY (the same claim, another anchor, a dated note). For each changed assertion: is the claim the
same; can the new form still fail (its anchor is not empty; a seed loop collects every failure; a negative stands
beside a positive)? Name any assertion dropped or loosened. THEN A MUTATION SPOT-CHECK in scratch at T (restore after
each): revert ONE src hunk at a time, the four that carry the most (your choice; say which), and say which named test
goes red. A hunk no test catches is a finding.

## Part 3: what a cure can break beside itself

- THE SHARED PAGE (rule N4): if the diff adds or moves a mark or a line the players see, render thirty towns of the
  seat's population through `toPublicSafe` and the share veil (the form is in `tests/domain/supplyStoryLaw.test.js`
  and `tests/components/publicProseEquality.test.jsx`) and say whether the owner's page and the shared page print it alike.
- THE OTHER VIEWS: a line the cure changes in one view (the tab) and not in another (the PDF, the Foundry journal, the
  chain card, the dossier) that prints the same fact: name the pair with one town.
- THE STORED RECORD: any new field on the saved town, any reading that needs the seed or the DM's hooks at view time:
  name it (the saved record gains no field without the owner).
- THE NET: `npx vitest run tests/lint --reporter=json --outputFile=<file>` at B and at T,
  `node <chair's lane>/docs/chair/2026-11-17/tools/failnames.mjs <file>`, `comm` the two lists: a test red at T and not
  at B is a finding. The seat's guard and every test it modified, each alone, at T. Both type gates
  (`npm run typecheck:ratchet`, `npm run typecheck:domain:strict`) and `npx eslint` on the changed sources at T.

## Your one message to the chair

`send_message` to session_01FbPLbcLDSJzZFzb5B7EjxR, findings first, each with its proof (the command and what it
printed, a town and the line): HIGH (a false sentence added, a guard weakened, a gate red, a file outside the list) ·
MED (a row not cured as asked, a view left behind, a hunk no test catches) · LOW (a comment, a name). Then one line a
part ("Part 1: ... Part 2: ... Part 3: ..."), then "LAND" or "DO NOT LAND YET: <the one reason>". No praise, no
summary of the diff. NEVER a pull request, a push, `--no-verify`, master, a deploy.
