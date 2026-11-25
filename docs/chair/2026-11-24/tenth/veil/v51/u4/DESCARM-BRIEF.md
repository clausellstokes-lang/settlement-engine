# DESCARM: the red-first arm for "a shown power's description names a withheld power" (VEIL-51, unit 4, R5-DESC narrowed)

Written by VEIL-51 (a seat of the tenth chair) on 2026-11-24, under the chair's order of 23:49 UTC: "(2) the red-first instrument,
committed red on a -wip of your own above d7764e67a". TEST-ONLY. You are ONE builder; you write ONE new test file (and, only if a
walker demands it, the one registration row named below). You commit locally; you do NOT push, open no pull request, never use
`--no-verify`, never touch `src/`, `supabase/`, a baseline, an allowlist or a walker.

## YOUR TREE
`git -C /home/user/settlement-engine worktree add -b lane/veil-51-2026-11-24-descarm-wip /home/user/wt/descarm d7764e67a`, then
`ln -s /home/user/settlement-engine/node_modules /home/user/wt/descarm/node_modules`. Work only there. Never run a command with
GIT_DIR, GIT_WORK_TREE or GIT_INDEX_FILE in its environment. Every vitest run goes through the gate mutex, from the tree:
`env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- npx vitest run <file> > <log> 2>&1; echo rc=$? >> <log>`
(exit 3 = gave up waiting: run it again; other runs of this seat hold the lock for long stretches: wait, never route round it).
Logs under `/var/tmp/v51/out/descarm/`. Never read a test's result through a pipe; read the log file.

## THE CLASS (measured by the lane; the facts you build on)
On the tip's engine, the gate's 140 births (seeds `r3m-<size>-<crisis>-<k>-<idx>`), a SHOWN power's `powerStructure.factions[].desc`
ends in a STANDING written over the whole stored roster by `src/generators/power/factionStanding.js :: annotateFactionStanding`, e.g.
on `r3m-town-none-0-17`: the Religious Authorities' desc "... Close enough to the two above that their support is worth buying; they
play Thieves' Guild and Arcane Council against each other when they can. The criminal network is stronger than they are. ..."
Where a read WITHHOLDS the Thieves' Guild (its house hidden: the rule `power.entry`), the server (212) and the twin serve that desc
unchanged, so the served text names a power the read withholds: 20 reads per door and Reveal on 2 places (`r3m-town-none-0-17`,
`r3m-city-none-1-117`), at the gallery, the party link, the import and the campaign map's member, Reveal off and DM (VEIL-50's wd;
the twin's count equals the server's, so "server = twin" never caught it).

## THE ARM: `tests/security/galleryVeilDescNames.pglite.test.js` (new)
Model it on `tests/security/galleryVeilRecent.pglite.test.js` (the harness: `veilChain.shared.mjs :: bootChain`, `storeShare`,
`BIRTH_DIALS`, `OWNER`; the twin `projectShareVeil` over `galleryPayloadFor`; the server's doors) and take THE JUDGMENT from it LINE
FOR LINE, unchanged: `listsOf`, `withheldOf`, `servedNamesOf`, `namesWithheld` (the lane's fold, `gallerySecondHomes.js ::
buildNameSearch`). Do not write a judgment of your own.
1. THE PLACES: (i) the two births by the gate's recipe, `generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS,
   settType }), null, { seed, customContent: {} })` (crisis 'none' adds NO stress keys: `BIRTH_DIALS` as it is) for `r3m-town-none-0-17` (settType town)
   and `r3m-city-none-1-117` (city) (the same recipe as aa54a6791's `tests/security/galleryVeilDesc.pglite.test.js` :: poolOf, lines
   494-512: read it there with `git show aa54a6791:<path>`; check your births carry the standing named above, and fail loudly if a
   birth does not: a recipe drift is not a pass); (ii) ONE HAND PLANT: a small town (hand-made, as galleryVeilRecent's plants are)
   with a hideable criminal house and its criminal power, and a second, shown power whose desc ends in a sentence naming the
   criminal power (write that desc with `annotateFactionStanding` if it serves, else by hand, and say which).
2. THE READS: both engines; BOTH STORED SHAPES (the new one; master's, the powers also in the top-level `factions[]`, as
   galleryVeilRecent's SHAPES); every setting of the owner's switch the harness offers (own, the mixed g:<bits>, allOpen, off) and the
   hand hide of the criminal house; Reveal DM off and on; the doors gallery, link, import, map member (as galleryVeilRecent reads
   them). A HIDING read = `withheldOf(stored, served)` non-empty.
3. THE ASSERTION (ONE `it` for the class, plus a positive): on every hiding read, no served `powerStructure.factions[].desc` and no
   master `factions[].desc` names a withheld power by `namesWithheld`. Collect every fault as
   `<place>|<shape>|<engine>|<door>|dm=<bool>|<setting>|<path>: <80 chars of the desc>` and `expect(faults).toEqual([])` with the
   count in the message. THE POSITIVE (its own `it`): the instrument bites: on at least one read of each place the stored desc
   names a power the read withholds (else the arm proves nothing): assert that count > 0 per place.
4. COUNTS to a file when `DESCARM_MEASURES` is set (appendFileSync, as galleryVeilRecent's `note`): reads, hiding reads, faults per
   engine, door and Reveal, places hit.
5. Keep it under 300 lines; a timeout guard as galleryVeilRecent's; no `process.cwd()` at module scope.

## RED FIRST, AND WHAT YOU HAND BACK
- Run the arm ONCE (through the mutex). EXPECTED: the positive GREEN; the class arm RED with faults on both births and the plant,
  both engines, every door, both Reveals (on the births about 20 reads per door and Reveal, VEIL-50's count). If the class arm is
  GREEN, or the positive is RED: STOP and say so; do not tune the arm to red.
- Run `npx eslint <your file>` (0 errors) and the walkers that judge a new test file: `tests/lint/proseDrawnAnchors.walker.test.js`,
  `tests/lint/negativeAssertionAnchor.walker.test.js`, `tests/lint/mutationCoverageManifest.test.js`, `tests/lint/moduleScopeCwdRatchet.test.js`
  (each through the mutex, one run). Each must be no worse than at d7764e67a (where the last two are among the tree's standing 24
  reds: compare by title). If the manifest walker asks for a row for a new pglite file, add exactly that row; nothing else.
- Commit ONCE on `lane/veil-51-2026-11-24-descarm-wip` (plain `git commit`, the hooks run; message: what the arm judges, "RED BY
  DESIGN until R5-DESC's cure", the red's counts and the log paths). Trailers: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- HAND BACK (your final message, at most 250 words): the commit; the red's counts by engine, door and Reveal; the positive's counts;
  the walkers' and eslint's results; anything you could not follow.
