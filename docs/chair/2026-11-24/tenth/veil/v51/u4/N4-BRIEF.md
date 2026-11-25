# N4: galleryVeilDesc's page arms re-cut to RULING V15, and V25's standing arms (VEIL-51, unit 4 item 2, N4)

Written by VEIL-51 on 2026-11-25 (07:2x UTC). You are ONE builder. TEST-ONLY: you edit ONE file,
`tests/security/galleryVeilDesc.pglite.test.js`. You never touch `src/`, `supabase/`, `scripts/`, a baseline, an allowlist, a
manifest or another test. You commit locally, ONCE, with a plain `git commit` (the hooks run). You do NOT push. You open no
pull request. You never use `--no-verify`.
Trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## YOUR TREE
`/home/user/wt/n4`, on branch `lane/veil-51-2026-11-24-n4-wip`. Its HEAD must be 802578955. Read `git log -1` and STOP if it is
not. `node_modules` is linked.
- Never run a command with GIT_DIR, GIT_WORK_TREE or GIT_INDEX_FILE in its environment.
- Run every vitest through the gate mutex, from the tree:
  `env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE GATE_MUTEX_MAX_POLLS=1000000 sh scripts/gate-mutex.sh --run -- npx vitest run tests/security/galleryVeilDesc.pglite.test.js -t '<arm title words>' > <log> 2>&1; echo rc=$? >> <log>`
- Other runs hold the lock for long stretches: wait. Never route round the lock, never kill a process. A mutex give-up is exit 3:
  report it, do not loop on it.
- Logs go under `/var/tmp/v51/out/n4/`. Never read a result through a pipe; read the log's `rc=` line.
- The whole file runs about 42 minutes. Run it whole at most ONCE, at the end, in the background with its rc appended. Before
  that, run arm by arm with `-t`.

## READ (whole, and no wider)
- The test file itself.
- `src/domain/veil/pageRederive.js :: rederiveStanding` and its header block "THE STANDING".
- `src/domain/display/galleryWithholdAlways.js`: `standingBase`, the STANDING_ROWS comment, and `withholdAlways`'s
  `registry: power.desc` block.
- `src/domain/display/galleryRosterChoices.js`: the belt (the last loop of `withholdPowerCopies`) and `withheldPowerNamer`.
- `supabase/migrations/212_share_veil_later_cures.sql`: header item (38).
- `docs/chair/2026-11-24/tenth/veil/v51/u4/PLAN-V15.md` (on the documents branch; read it with
  `git show origin/lane/veil-51-2026-11-24:docs/chair/2026-11-24/tenth/veil/v51/u4/PLAN-V15.md`).

## WHAT CHANGED IN src SINCE THE FILE WAS WRITTEN (the reason for your work)
- RULING V15: phase 1 is THE CUT ALONE. The shared page prints NO standing. Reader S is not built: `rederiveStanding` keeps its
  name and both doors' calls, but WRITES NOTHING. It sets each served desc to `standingBase(desc)` (a no-op on a desc the veil
  already cut), and at the import's save it drops a cut row's desc.
- RULING V25 (1): a desc no row matches is SERVED as it stands.
- RULING V25 (2): after the cut, a served desc may not name a power the read withholds; where one would, it is withheld whole.
  This is R5D's belt.
- The table's label slot now takes a lower-case bracket ("Merchant Guilds (dominant)").
- Registry row power.desc: page 'not drawn'.

## WHAT YOU DO
### A. RE-CUT THE ARMS THAT ASSERT READER S
The arms are TEETH, THE FIDELITY ARM, THE STORED HALF OF THE FIDELITY ARM, THE DIFFERENTIAL, THE SHARE CLASS, THE MASK IN A
STANDING ON THE BORN HAND HIDES, THE STORED HALF OF THE DIFFERENTIAL..., and THE ARM (item 0 (c)) with ITEM 7's COUNT. Each must
now assert V15's page, by these rules:
- On every non-owner read, door and Reveal, both engines, both stored shapes, the page's desc EQUALS THE SERVED desc. It is the
  stored desc's CUT BASE (the file's reference cut over the table): byte-equal where the read hides nothing, or the key absent
  where the belt or the hidden/masked-row rule withholds it.
- NO STANDING IS PRINTED: no page desc ends in a sentence a table row matches. Also, no page desc contains a row's literal
  opening (its template up to the first `{`, 14 characters or more) anywhere.
- The FIDELITY "seat-contest class" and the SHARE CLASS listings fall away with S. Assert each lists 0, and keep its count line.
- THE ARM's inventory of strings a page reader writes loses "the standing by S". Assert that the page desc is never longer
  than the served desc.
- Keep READER B's DIFFERENTIAL, the plants (a)-(g) and THE publicProse COUNT as they are. Re-word an arm's title only where it
  names S.

### B. RULING V25's THREE STANDING ARMS (new `it`s, after PLANT (e))
Build them on the file's own plant machinery. Use a power withheld BY RULE (as PLANT (a) withholds one) and an OWNER-HIDDEN
power (as PLANT (b)). Cover every non-owner door the file reads, both Reveals and both engines.
1. AN UNKNOWN-FORM TAIL NAMING A HIDDEN POWER is WITHHELD WHOLE (the served row has no `desc` key). The tail is a sentence no
   row matches, appended to a shown power's stored base, e.g. "Their quarrel with <NAME> is older than the walls." Its control:
   the owner's own read keeps it.
2. THE SAME TAIL NAMING NO HIDDEN POWER (a served power's name, or none) is SERVED byte-equal.
3. A NO-TAIL DESC (the base alone) is SERVED byte-equal.
DO NOT TUNE. Where arm 1 does not hold, KEEP THE RED and list every case. One case is expected: on the owner-hidden power at
Reveal off, the projection drops the row from what the veil reads, and masks the exact-case name. Report what is served there.

### C. LEAVE "107 (3), the chair's" EXACTLY AS IT IS
That is the `chair` list in THE STORED HALF OF THE PLANT. It waits on the chair's ruling.

## RED FIRST, AND WHAT YOU HAND BACK
- Re-cut arms: run each once at 802578955 BEFORE your edit, and record which pass. Then run them after the edit. A re-cut arm's
  red-first is its standing check reading a document whose desc carries the stored tail (the owner's own read): it must red.
- New arms: each arm's control bites (the owner's read), and each arm's assertion runs.
- Then the whole file ONCE, in the background, rc appended.
- `npx eslint <the file>`: 0 errors. No `process.cwd()` at module scope.
- HAND BACK in at most 250 words:
  - the commit;
  - each arm, before and after (pass/fail and its counts);
  - the three V25 arms' results, with every red case;
  - the whole file's rc;
  - anything you could not follow.
