# DAILY-3 · B3 E1 DISPATCH — the owner-only slot `commoner_resentments_dm` and its gate

YOUR BRIEF is `briefs/B3-THE-OTHER-FIVE-AND-DM.md`, unit **E1 ONLY**, read with this file's substitutions (DAILY-3's
word, 2026-11-22; this file governs where it differs). Paths are under `docs/chair/2026-11-20/content/daily/` unless rooted.

## Where you work
- Worktree `/home/user/wt-daily3-e1`, branch `lane/daily-3-2026-11-22-e1-wip`, cut from f5295e425 (the working line's
  tip; it carries DAILY-2's B1 and B2 as point 90). `node_modules` is a symlink to the main checkout's.
- Wherever a brief says DAILY-1 or DAILY-2, read DAILY-3. Trailer (B-BUILD-COMMON item 9):
  `Claude-Session: https://claude.ai/code/session_01ACmDYYZpEdm9Ag2ikDGTf9`. You commit; you do NOT push or merge.
- B3's read 3: no `measures/B2/REPORT.md` exists; B2's report is the commit message of 888227143.
- B-BUILD-COMMON item 2 does not bind (ruling 11). Item 5: the hand list IS on this base (section "The sameness door").

## E1's scope, exactly (a ruling of DAILY-3 on B3's split: the dm pool file is E1's, not E2's)
1. `deriveDailyLife(record, { audience } = {})`: the key `commoner_resentments_dm` is derived ONLY when
   `audience === 'owner'`; on every other read (no options, no audience, any other value) the key is ABSENT (not '').
   The eight public slots are byte-equal whatever the audience (an arm on the 900).
2. The crime clauses leave the PUBLIC `commoner_resentments` (today's criminal_opportunity >= 55 / >= 70 part of
   `deriveCommonerResentments`) and become the dm slot, from its own pool `src/data/dailyLife/commonerResentmentsDm.js`:
   LINES-2's dm wordings as ruled (ruling 14: "dm crime55 4-5 replaced by three"; the chair's message is the source
   where a rewording is not in `lines/L2/pools.2.mjs`; LINES-2b's changes govern). A "smugglers" line needs smuggling in
   the record (find its home; if none answers, the line is not eligible and you say so). Keyed pick
   `<record.name>::dailyLife.commoner_resentments_dm::<branch>`; a place with no crime clause: the dm slot is ''
   (for the owner), absent (for anyone else). The REST of the public slot stays as it is today (E2 rebuilds it).
3. RED FIRST, in a new test file whose basename avoids the mutation-manifest pattern list (B3 E1 names it): on M1's
   900 births (`measures/M1/measure.m1.mjs`'s recipe, seeds `hxd-<size>-0..149`), the key is NOT PRESENT on a
   no-audience read, on a read of `toPublicSafe(record)`, on an `{ audience: 'reader' }` read, and on every
   `toPublicSafe` document itself; `deriveRegenerationDelta` and `buildAiGroundingPayload` never carry it (their call
   sites named in the test). The public slot is chosen by no crime fact. If 900 births make the file too slow for
   `tests/domain`, say the time and propose the cut (the 900 stay in the measure).
4. THE COUNT (DAILY-3's prompt, unit 2): show by an executed arm that the PUBLIC derivation of a shared read's document
   reads NO person's `secret`, `plotHooks` or `goal` (e.g. a getter trap on `toPublicSafe(record).npcs[]` counting
   reads; the count over 900 documents goes in the commit message).
5. THE SAMENESS DOOR: the new pool table goes on `tests/lint/samenessHideable.handPools.json` (one row a table, the
   form of the rows already there: copy f5295e425's and 2482e40e3's rows for DAILY-2's tables); `HAND_CEILING` in
   `tests/lint/samenessHideable.walker.test.js` rises by EXACTLY the rows you add, its comment extended in the same
   form; `DM_BY_CONSTRUCTION` gains the table's row `{ gatedBy: 'src/domain/dailyLife.js :: deriveDailyLife',
   provedBy: '<your test path> :: <the absent-on-toPublicSafe title>' }` (the walker's `byConstructionFaults` checks
   both are found); the house readings re-taken from the walker's own reading the way 2482e40e3 did (find it), the
   counts by table and by house in the commit message.
6. Registers by their own doors (B-BUILD-COMMON item 6); `tests/domain/dailyLife*.test.js` pins re-read, never loosened.
7. GREEN at your commit (B-BUILD-COMMON item 8), every heavy run through `sh scripts/gate-mutex.sh --run -- <cmd>`, to a
   file, read via `sh scripts/gate-tail.sh`: your test file; `tests/domain/dailyLife*.test.js`; every test file anywhere
   under `tests/` that imports `dailyLife.js`, `regenerationDelta.js` or `aiGrounding.js` (grep); the sameness walker;
   `tests/lint/domainAnyCastBaseline*`; the presumption walkers; eslint on touched files; both typechecks. Not
   `tests/lint` whole (DAILY-3 runs it at the merge). `aiGroundingBundle.freshness` stays red by design (ruling 4).
8. MEASURE after the commit (into `measures/B3/E1/`, a copy of `measures/B2/measure.b2.mjs`'s shape over the BUILT
   code, its re-run line at the top of its out file): on the 900, for the dm slot as the owner reads it and for the
   public `commoner_resentments`: top sentence share by size, EMPTY by size, false lines 0 by M1's tests, no hideable
   house, no "town" for a smaller place. Commit it with the unit or as a second commit.

## Files you may touch (stop on anything else and say so)
`src/domain/dailyLife.js`; NEW `src/data/dailyLife/commonerResentmentsDm.js`; your NEW test file; `tests/domain/dailyLife*.test.js`;
`tests/lint/samenessHideable.handPools.json`; `tests/lint/samenessHideable.walker.test.js` (`DM_BY_CONSTRUCTION`,
`HAND_CEILING` and its comment only); the presumption registers by their doors; `measures/B3/E1/`. Nothing under
`src/components/`, `src/pdf/`, `supabase/`, `tests/security/`, `src/generators/`; no vocabulary or class-table row (a
need with no atom: STOP and report it, one line).

Final message: B-BUILD-COMMON item 11, plus the houses the dm wordings need (for the security reader).
