# ARMS: the stored belt at every door, unit 5's plants, class (ii), and the run-4 catalogue (VEIL-51, units 4 and 5)

Written by VEIL-51 on 2026-11-25 (08:4x UTC), under RULINGS V20, V25, V27 and V28, and VEIL-55's terms (a) and (b) as corrected
at 08:12. You are ONE builder. TEST-ONLY:
- You write ONE new file, `tests/security/galleryVeilStoredBelt.pglite.test.js`.
- You may add rows to the run-4 catalogue test named in D below, and one registration row in
  `scripts/mutation-coverage-manifest.json`.
- You never touch `src/`, `supabase/`, any other script, a baseline, an allowlist or another test.
- You commit locally, ONCE, with a plain `git commit`. You do not push, you open no pull request, you never use `--no-verify`.
- Trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## YOUR TREE
`/home/user/wt/arms`, on branch `lane/veil-51-2026-11-24-arms-wip`. HEAD must be the commit VEIL-51 names in your prompt: STOP if
it is not. `node_modules` is linked.
- Never run a command with GIT_DIR, GIT_WORK_TREE or GIT_INDEX_FILE in its environment.
- Run every vitest through the mutex: `env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE GATE_MUTEX_MAX_POLLS=1000000 sh scripts/gate-mutex.sh --run -- npx vitest run <file> [-t '<title>'] > <log> 2>&1; echo rc=$? >> <log>`
- Logs go under `/var/tmp/v51/out/arms/`. Read a result from the log's `rc=` line, never through a pipe.
- A mutex give-up is exit 3: report it, do not loop on it.
- Any run longer than 2 minutes goes in the background (timeout 7200000), with its rc appended.

## READ (whole, and no wider)
- `tests/security/galleryVeilDesc.pglite.test.js`, lines 300-420. They hold the harness you reuse: `bootChain`, `store`,
  `gallery`, `imported`, the link read, `twinOf`, `settingsOf`, `asSaved`, and the hand hides.
- `tests/security/veilChain.shared.mjs`.
- `src/domain/display/galleryRosterChoices.js`: `storedDocs`, `storedPowerSearch`, `withholdStoredNamedDescs`,
  `withholdPersonStrings`, and the call site in `applyRosterChoices`.
- `src/domain/display/galleryVeil.js :: projectShareVeil` (its `opts.stored`).
- `supabase/migrations/212_share_veil_later_cures.sql`:
  - header items (38) (its "THE STORED BELT" paragraph) and (39);
  - `_gallery_veil_stored_docs`, `_gallery_veil_person_named`;
  - the stored block in `_gallery_veil_roster_choices`;
  - the 5-argument `_gallery_veil` and its wrapper;
  - the doors `get_gallery_dossier`, `get_unlisted_dossier`, `import_gallery_dossier`.
- `docs/chair/2026-11-24/tenth/veil/v51/u5/plant5.mjs`, which plants the seven unit-5 paths.

## WHAT YOU BUILD (each arm red first, as said)
### A. THE STORED BELT AT EVERY DOOR (V27 (1); term (a): a plant at each door)
On the stored today-born record `r3m-city-none-0-37`, with its density host Craft Guilds hand-hidden (`hidden: true`): the
rival The Trade Compact's desc, a copy of the host's base, names "Craft guilds". At Reveal off it must be WITHHELD WHOLE (no
`desc` key) at:
- the server's gallery read, link read and import;
- the twin, `projectShareVeil(payload, ov, { stored: [live] })`.
Its control: at Reveal DM the host is served stamped and the desc is SERVED. The map door is out of reach until unit 3 merges:
assert nothing there; name it in your hand-back.
RED FIRST: the twin with NO stored row serves the desc. Assert that inside the arm: it is what V27 cures.

### B. THE SNAPSHOT PLANT (VEIL-55's corrected term (b))
A share in SNAPSHOT mode whose frozen copy is stored ALREADY PROJECTED (`galleryPayloadFor(live, { shareDm: false })`, as
master's client stores it). The live row hand-hides Craft Guilds. The copy lacks the host's row, while the copied Trade
Compact desc names it. The desc must be WITHHELD at the server's gallery read and its import. Store the copy as
`gallery_member_overrides -> '$veil' -> 'snapshot'`: read 212's `src` lateral for the shape. RED FIRST, in the twin: with
`stored: copy` alone it is served; with `[live, copy]` it is withheld. Assert both.

### C. UNIT 5's ARMS (V20 (b)-(e); V27 (2))
- C1, THE SEVEN PATH PLANTS: one string a path, `plant5.mjs`'s seven on the master-born `r3m-town-none-0-23` (build them in
  the test from the stored record, never a file write). Each is ABSENT (the key omitted, the person kept) at every door (the
  server's gallery, link where Reveal is off, import, and the twin with `stored: [doc]`) and at both Reveals. A planted
  string's control: the owner's own document keeps it.
- C2, V27 (2)'s PLANT: a hand-hidden non-governing power named in `npcs[2].role` at Reveal off. Without the belt the
  projection masks it ("an unseen interest Courier ..."). The key must be omitted at every door.
- C3, "LOSES NOTHING", ASSERTED (V20 (c)): over the stored pools named by `ARMS_POOLS=<today>:<master>` (skipped without it,
  said so in the title), at both Reveals and with the default and opened veils, every read whose served document names EVERY
  stored power must have 0 leaves differ between the server's gallery read and the twin without the belt. Compare with person
  ids aside, since they re-key per read.
- C4, THE TELL, COUNTED for phase 2 (V20 (d)): under ARMS_POOLS, the cards served without a `role` on HIDING reads, by door
  and Reveal, written with `appendFileSync` to `ARMS_MEASURES`. Not asserted.

### D. THE RUN-4 CATALOGUE (term (b)'s last sentence)
Find the test that catalogues 212's functions and grants after the apply and after the rollback: start at
`tests/ops/migrationRehearsal.test.js` and `tests/security/galleryVeilCures.pglite.test.js`. Make it show:
- after the apply, the four new forms exist and none is executable by public, anon or authenticated (section 7's loop):
  - `_gallery_veil(jsonb, jsonb, boolean, boolean, jsonb)`;
  - `_gallery_veil_roster_choices(jsonb, jsonb, jsonb)`;
  - `_gallery_veil_stored_docs(jsonb)`;
  - `_gallery_veil_person_named(jsonb, jsonb)`.
- after the rollback, all four are gone, and 211's 4-argument `_gallery_veil` remains.
Add rows only where the catalogue keeps them. Change nothing else there.

### E. CLASS (ii)'s ARM (V27 (4))
Over the stored pools under ARMS_POOLS, at both Reveals, with each non-governing power hand-hidden in turn, in the twin with
the stored row: wherever a served desc's BASE names the governing power by the lane's fold, that power is on the served
roster. Also on the plant where the SEAT itself is hand-hidden: there the desc must be withheld (by A's rule).

## WHAT YOU HAND BACK (at most 250 words)
- the commit;
- each arm's red-first and green, with counts;
- C3's and C4's figures;
- E's figure;
- the catalogue rows added;
- anything you could not follow.
Run the new file whole ONCE with ARMS_POOLS set (`/var/tmp/v51/out/p1/stored-today:/var/tmp/v51/out/p1/stored-master`), and
once without (the gate's run). `npx eslint` on your files must give 0 errors. No `process.cwd()` at module scope.
