# PAGE-1's hand-back (the display half of THE PAGE AS THE DM READS IT)

First written 12:49 UTC 2026-11-20 by `date -u`; kept current until the hand-over to PAGE-4. A successor needs this
file and the briefs only. The seat's prompt: `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/PAGE-1.txt`.

## Where it stands

- BRANCH `lane/page-1-2026-11-20`, cut at the working line `lane/join-2026-11-14` tip `0c9069489`. Pushed at `373eac144`.
- NOTHING OF `src/` IS MERGED YET. Four builders are out (below); none has committed at 12:49.

## The rulings in force (one list)

1. The owner (2026-11-20): "A calm town should be as it currently is… Don't invent drama… We are not creating the
   campaign." Then, shown the fixes: "Do all of these, every last one predeploy".
2. The chair, 11:15: PAGE-1 owns the DISPLAY half (`src/components/`, `src/domain/display/`, `src/pdf/`,
   `src/foundry/`). Each unit: render only; no stored field of a born town moves (born documents hashed at base and
   tip, equal); one builder, one commit, red first; the page census and pinned renders re-recorded by their own doors
   with the cause.
3. The chair, 11:15 and 11:24: NOT PAGE-1's: tension wordings (S6, L1), stored sides (S7/S8 as stored), secrets (S9,
   L4), the arrival pools (L2), the `influence` keyword fault (L3): all PAGE-2's (`lane/page-2-2026-11-20`), measured by
   PAGE-1's measures A, B, C. Never edit `src/data/historyData.js`, `src/generators/historyGenerator.js`,
   `src/data/npcData.js`, the secrets' pools, `npcGenerator.js`. Want against secret (L7, 170 of 9,012 cards): the goals seat.
4. The chair, 11:24, APPROVED S1 to S5:
   - S1: no "marginal" and no dot from the misread band; the first-of fact and that power's weight here.
   - S2: the "Called by" header in plain words for a tie another person holds toward this one.
   - S3: no grade out of 100; the share of its own dial the town makes and the largest drag by name.
   - S4: Safety on the DM's page carries Law & order wherever the two stand two or more steps apart, IN BOTH
     DIRECTIONS; the hall in criminal hands is one case. ONE reader, audience-taking, FAILS CLOSED. Public, player and
     shared Safety stay byte for byte as today; no veil file is touched; the proof goes to the security reader.
   - S5: the capability named for what it measures; the Magic headline says it is the world's measure.
5. The chair, 11:24 and 12:48: the authored words of S1 to S5 (every label and sentence a DM reads, beside what each
   replaces) go to the chair in ONE file under `docs/chair/2026-11-20/content/page/words/`, with its commit, BEFORE
   the first of them merges.
6. The chair, 11:24: L5 (the thin pages) is not ordered by the owner: brief written, nothing built. L6 (the Safety floors;
   Criminal opportunity's edge at 50) is NOT before the deploy unless the owner says so: stored bands.
7. The chair, 11:58 and 12:48: "THE SIDES AS SHOWN" (render-time side words on PAGE-2's data file) is PAGE-4's, NOT
   dispatched by PAGE-1. Brief written: `briefs/SIDES.md`.
8. The chair, 12:48: hand-over to PAGE-4 when S1 to S5 are merged and their words are with the chair, or at 250,000 used
   tokens by the record, whichever comes first. After it, PAGE-1 only relays ("<unit> returned: <branch> at <commit>, UNREAD").

## The units

| Unit | Brief | Builder's worktree and branch | State at 12:49 |
|---|---|---|---|
| CARD (S1, S2) | `briefs/BUILD.md` §CARD | `.claude/worktrees/agent-a14e0a85d3b9f8873`, `worktree-agent-a14e0a85d3b9f8873` | OUT, no commit |
| OUTPUT (S3) | `briefs/BUILD.md` §OUTPUT | `.claude/worktrees/agent-a30251bfb579f8154`, `page1-output-2026-11-20` | OUT, no commit |
| SAFETY (S4) | `briefs/BUILD.md` §SAFETY plus the both-directions widening (sent to it 11:2x; ruling 4 above) | `.claude/worktrees/agent-a1dcf6cf52e96eb72`, `page-1-safety-2026-11-20` | OUT, no commit |
| MAGIC (S5) | `briefs/BUILD.md` §MAGIC | `.claude/worktrees/agent-acd084ff9ab06f12b`, `worktree-agent-acd084ff9ab06f12b` | OUT, no commit |
| THE SIDES AS SHOWN | `briefs/SIDES.md` | none: PAGE-4's | waiting on PAGE-2's data file |
| L5 THIN PAGES | `briefs/THIN.md` | none | waiting on the owner |

The worktrees are local to PAGE-1's container (one repository object store): a builder's commit is merged onto the lane
by `git merge --no-ff <branch>` (or cherry-picked) from the main checkout. They are not pushed.

## Merging a returned unit (what PAGE-1 does, or PAGE-4 after the hand-over)

1. Read the builder's report and its diff whole; confirm the hash proof (born documents equal) from its output file
   under `docs/chair/2026-11-20/content/page/build/<UNIT>/`.
2. Its authored words go into the words file and to the chair; merge only after the chair has read them.
3. At each merge: the lighting census and the wiring census by their own doors (CONTRIBUTING.md, "The lighting
   census tuple"; `tests/lint/wiringCensusDeclared.walker.test.js`, `tests/lint/proseWiringCensus.walker.test.js`);
   `tests/lint` whole; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`: each to a file
   via `sh scripts/gate-tail.sh <command>`. Never the whole suite. Known reds on the line that are not ours: stored
   fingerprints of generated towns, server bundles' freshness, five size ceilings.
4. Plain push with the hooks (a push runs the gates: allow 10 to 20 minutes while builders run). Never a pull request.

## The measures (each re-runnable by one command, from the repository root)

- A (F1, F2): `node docs/chair/2026-11-20/content/page/measures/A/measureA.mjs "$PWD" > docs/chair/2026-11-20/content/page/measures/A/measureA.out.txt 2>&1`;
  `node docs/chair/2026-11-20/content/page/measures/A/simulateA.mjs "$PWD" > docs/chair/2026-11-20/content/page/measures/A/simulateA.out.txt 2>&1`;
  rendered: `node docs/chair/2026-11-20/content/page/measures/A/runRenderA.mjs "$PWD" 5 > docs/chair/2026-11-20/content/page/measures/A/renderA.out.txt 2>&1`.
- B (F3, F6): `node docs/chair/2026-11-20/content/page/measures/B/f3.b.mjs`; `node docs/chair/2026-11-20/content/page/measures/B/run-render.b.mjs 10` then
  `node docs/chair/2026-11-20/content/page/measures/B/f6.b.mjs` (each script's header gives its output redirection).
- C (F4, F5): `f4.mjs`, `f5.mjs`, `readers.mjs`, `patchBand.mjs`, `render.mjs` under `measures/C/` (each header gives
  its one command).
- The proposal and its corrections of the chair's leads: `PAGE-1-PROPOSAL.md`.
