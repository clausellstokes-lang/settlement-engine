# R5D-PAGE-A hand-back (VEIL-37, R5-DESC's page half, builder A: items 0, 1, 2, 3, 4, 6, 7, 8)

Brief: `docs/chair/2026-11-20/veil/briefs/R5D-PAGE-BRIEF.md` (read at a48c8b9a1, the seat's branch). Worktree `/home/user/wt/r5dpage`,
branch `lane/veil-37-2026-11-23-r5dpage-wip`, cut at eeda6a126. NOT PUSHED. Scratch `/tmp/claude-0/r5dpage-a/`.

## 1. Commits, files, runs, `tests/lint` whole, what is not run

**Commits**
- `bd030f275` the page half (src + tests + manifest rows).
- `9bba26536` merge of `3ef7fb325` (`lane/veil-37-2026-11-23-r5desc-wip`: R5D-SQL-2 ab6ade69a / a1e395ae2 and the lane's tip
  2d7ed483f), as the seat directed. No conflict.
- the commit after it: the two pins R5D-SQL moved, re-stated by cause (seat's find at 3ef7fb325), and this hand-back.

**Files** (src: two; nothing in 212, the registry, `standingForms.*` or `galleryWithholdAlways.js`)
- `src/domain/veil/pageRederive.js`: `servedRosterOf` (powerStructure.factions with every row the read hides OUT: `hidden: true`
  or `faction`/`name` the mask); `rederiveStanding(doc, {authoritative})` (reader S: `standingRosterOf` + `annotateFactionStanding`
  over the served roster, `standingForceOf(served houses)`, the served seat's legitimacy; appended to the served desc as the twin's
  `standingBase` cuts it, so idempotent and never doubled by a server that still sends the tail; authoritative drops a cut row's
  desc); wired in `rederiveForPage`; `rederiveCrimeTypes` seats read the served roster; `rederiveRecentConflict` draws its
  writer's sentence only where it names no cut power by the lane's fold (`holdsOverServed`: cut = the writer's rows the served
  roster does not carry + the served stamped/masked rows).
- `src/domain/veil/importRederive.js`: step 12, `rederiveStanding(s, {authoritative: true})`, also on a config-less document.
- tests (new): `tests/security/galleryVeilDesc.pglite.test.js`, `tests/lint/standingReaders.walker.test.js`,
  `tests/lint/governmentLabelFromKindTable.walker.test.js`. Changed: `tests/security/galleryVeilRecent.pglite.test.js` (item 0 (a)
  arm), `tests/lint/rosterChoiceComposedHosts.walker.test.js` (item 6 + the chair's 00:56 ruling), and, on the seat's find,
  `tests/security/galleryWithholdAlways.pglite.test.js` (MAIN judges `power.desc` and `history.tension.maskedParty` by their rule:
  no served desc still ends in a standing the table's own cut finds, no hidden or masked row carries a desc; no tension party
  equals the mask; VEIL-33's 96c777381 precedent) and `tests/security/galleryVeilHandRows.pglite.test.js` (V8-4's `want`: the
  `{power: 3, hidden: true}` entry arrives with no desc, E115 (2)). `scripts/mutation-coverage-manifest.json`: three rows.
- Instruments taken into the branch: NONE. Act T (jp6-city-8) and the pool are re-made in the tests by their recipes
  (litsurf.probe.jsx's scenario T; tell-common.mjs :: pool, seeds `r3m-<size>-<crisis>-<k>-<idx>`), read by `git show` from
  `origin/lane/veil-34-2026-11-22-r5desc-wip`. This tree has no `seatCircumstances.js`: act T is `transferRulingPower(hid, A,
  {cause: 'coup'})`.

**Runs** (all local, pglite chains; vitest under `scripts/gate-mutex.sh --run`, read by `gate-tail.sh`; no git repository
variables; the seat's pool chain waited out to its END 01:35:01)
| run | tree | exit |
|---|---|---|
| walkers red first (`standingReaders`, `governmentLabel`) | eeda6a126 + the new tests | 1 (standingReaders 3 red: census stale, no reader / not wired, no cut) |
| the four walkers + recentConflictReaders | mine | 1 (only the 23 `prose.*` composed rows) |
| galleryVeilDesc + galleryVeilRecent, RED FIRST | eeda6a126 + the new tests | 1: TEETH, FIDELITY, plant (e), the born mask arm |
| the same, GREEN | bd030f275's tree | 1: only plant (e) and the born mask arm (E136 (a), expected) |
| galleryVeilDesc, galleryVeilRecent, galleryWithholdAlways, galleryVeilHandRows | 9bba26536 + the two pins | **0 (58 of 58)** |
| `node scripts/check-full-typecheck.mjs` | mine | 0 (167, ceiling 167) |
| eslint, the 9 touched files | merged | 0 |
| `npm run build`, VERIFY_DIST vendorPdfLazy + generationWorkerLazy | 3ef7fb325 and mine | 1 and 1, the SAME four reds |

**Red first, green after, by test title** (galleryVeilDesc unless named)
- TEETH (a read that hides nothing: page desc = stored): red 464 faults -> 0.
- THE FIDELITY ARM: red 88 of 168 page rows equal -> 168 of 168.
- PLANT (e) and THE MASK IN A STANDING ON THE BORN HAND HIDES: red on both trees before the merge (120 and 10 faults; E136 (a)),
  GREEN after merging R5D-SQL-2 (0 and 0). Not cured any other way.
- standingReaders.walker: 3 red -> green. Plants (a)-(d2), (f), (g), the differential and the arm were green before the page change
  (212 already cuts; the page drew base alone, equally on both reads).
- galleryVeilRecent THE HAND HIDES (item 0 (a)): GREEN ON BOTH TREES. **Item 0 (a) does not red**: B re-creates the hidden power
  in its own roster on 44 of 44 hiding reads, yet its sentence names none of them and equals the never-there page's (176 of 176).
- galleryWithholdAlways MAIN, galleryVeilHandRows V8-4: green on the merged tree after the re-statement.

**Figures** (standing slices)
- Fidelity: 24 births (R5DESC-MEASURE's pool at N=1, every 3rd), 48 nothing-hidden engine-door pages, 168 of 168 rows equal;
  the seat-contest class LISTED: 0 on this slice (none occur); descs no row cuts (served as base): 56. R5-RECENT's fidelity
  unmoved: 168 of 176, the listed hamlet-8 only.
- Differential: 39 hiding records (house hides, act T, 22 hand hides), 78 reads, 312 engine-door reads, 276 equal, **36 LISTED
  (the share class, below)**, 0 faults; the masked tension party: 0 reads exercised it on born towns (no hidden power is a
  tension party there); plant (g) holds it on the served side.
- Arm: 352 engine-door reads, 2,872 reader-written strings, 0 names, 0 mask; power.label 1,860 served, 0 hits.
- `tests/lint` whole on the merged tree: **45 failed in 17 files** = the lane's 22 (16 files: chainPrintSites 1,
  domainAnyCastBaseline 4, factLayers 1, moduleScopeCwdRatchet 1, negativeAssertionAnchor 1, noLegacyFactionReaders 2,
  observedShapeReaders 2, presumedThings 1, presumptionClasses 1, proseDrawnAnchors 1, proseWiringCensus 2, seedLoopTotality 1,
  slugifyIdiomBaseline 1, sovereigntyLightingContract 1, styleLaw 1, writerReach 1; the same names as the base tree's,
  compared file by file; none names a file of mine) + the 23 composed rows on R5's planned host, CHAIN C's: prose.conditionSeverity,
  prose.incomeMix, prose.legacyLines.a, prose.legacyLines.b, prose.legitimacyBanner, prose.legitimacyLens, prose.posture.posture,
  prose.posture.prize, prose.posture.terrain, prose.prosperity.sentence, prose.prosperityHeader.detail, prose.shadowEconomy,
  prose.stabilityHeader, prose.state.firstSurvey, prose.state.publicOrder.beside, prose.state.publicOrder.field,
  prose.state.publicOrder.rung.glance, prose.state.publicOrder.rung.sentence, prose.structureFlag, prose.successionRisk,
  prose.templeFraud, prose.threat.economic, prose.wall.rationale. Nothing else.
- Build, first paint: raw static closure **1,175,552 B on both** (+0); gzip 374,013 -> 374,017 (+4 B: a lazy chunk's hash in
  the entry, same bytes); the lazy engine chunk 910,255 -> 910,279 (+24). The four VERIFY_DIST reds (worker ceiling, engine
  chunk, raw and gzip budgets) are red on 3ef7fb325 alike. The reader is a STATIC import, not a lazy one: pageRederive.js is
  outside vite's eager graph (gallery.js is reached only lazily), rosterText.js the one new module there (its imports were
  already in that graph). A deviation from "(a lazy import)" in letter; +0 raw in fact.

**Not run**: the full pools (`R5DP_POOL=full`, `R5C6_POOL=full`); item 5, 5b, 5c (builder B's). `galleryVeilHandRows.pglite`
was not read whole (200 KB): its header, the V8 section and V8-4 only (budget); its change is one `want` row.

## 2. What needs a ruling (each a stop rather than an invention)

1. **THE SHARE CLASS (item 4, LISTED, 36 engine-door reads on 9 hand-hide records, all on the DM door)**: a row the owner hid is
   SERVED stamped on Reveal DM, so the served shares (registry power.share, re-derived to 100 over the served rows) carry it; the
   never-there place's do not. S takes the stamped row out (E128) but reads the served figures, so its gap-based lines differ.
   Witnessed: the kept rows' served figures differ between the two reads. S cannot be as-if-never-there exactly from served data
   (re-sharing the served figures by largest remainder is off by one against the raw ones). The player view is equal on all.
2. **E128 (b)'s KIND half for reader B**: the writer reads its roster for a noble power, a religious power of weight, the seat and
   its kind, and a merchant's settled row. Cutting those reads by every row the served roster lacks withheld the sentence on 7 of
   the 21 nothing-hidden births of R5C2's slice (the density law trims powers after the power step; no page tells a trim from a
   dropped owner-hidden row). Built instead: the name belt (no sentence naming a cut power by the fold) and the differential
   (equal to never-there on every hiding read, hand hides included). Vetoable: the full cut is a short change in `holdsOverServed`.
3. **A SERVED BASE naming a hidden host past the mask (counted, not judged)**: on the player view 8 served bases on 2 places name
   the power the read hides: a density rival's desc copied from its hidden host in sentence case ("Noble families with
   hereditary land rights...", The Highborn Circle, jp6-city-8 act T; "Craft guilds regulating production...", The Trade Compact,
   r3m-city-none-0-37 with Craft Guilds hidden). The case-sensitive mask misses it; the belt holds house hides only. Item 5b's
   class (rivalDescOf); 212's, not mine.
4. **Item 7**: the strata's and contenders' OWN strings: **0** names, 0 mask (176 name hits and 0 mask after the merge are all
   served rows handed back: the stamped row's name on the DM door and item 3's bases).

## 3. Item by item
- 0 (a) built (galleryVeilRecent THE HAND HIDES: plant (b) r5-owner, act T jp6-city-8, density hosts and noble powers hidden by
  hand on R5C2's births); does not red. (b) every page reader reads `servedRosterOf`. (c) the arm in galleryVeilDesc.
- 1 `rederiveStanding`, wired at both doors. 2 plants (a)-(g) and the teeth. 3 the fidelity arm. 4 the differential.
- 6 standingReaders walker (census of the standing's writer and cut, the one reader, both doors, both always-hosts, power.desc's
  row, the recent-conflict reader's cut); E94 (c) `governmentLabelFromKindTable.walker` (4 writers registered with their tables;
  planSeatAscension gaining a caller reds); composed-hosts walker: power.desc, power.relation.dmNote and power.label walked by
  name, its header re-stated to the fact (three rows left with R5-DESC; the 23 `prose.*` CHAIN C's, E134 (2)), the pins re-taken
  by cause (23 planned of 26 composed, all `prose.*`); manifest rows `{rationale, pglite-executed}` and two walker rationales.
- 7 above. 8 above.
