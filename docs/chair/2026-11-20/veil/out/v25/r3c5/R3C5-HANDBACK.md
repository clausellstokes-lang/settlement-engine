# R3-CURE-5 HAND-BACK (VEIL-25's builder, relayed to VEIL-26; worktree `/home/user/wt/r3c4`, branch `v25-r3c4`, on c5786c5ce)

## STOPS AND FIRST LINES
1. **STOP (unit 3 (iii), R3-CURE-4's rule): THE CONTROL GAP DOES NOT CLOSE INSIDE THE CRIME-DIAL STRATA.** Served Defense key,
   hidden-house pool against the control (towns with no hideable house), inside each stratum of the rolled `priorityCriminal`
   (low 5-34, mid 35-65, high 66-95), identical in both engines and both Reveal settings (`unit3-gate-table.txt`): low:
   semi-organized pool 20/24 (83%) vs control 6/24 (25%), no key 17% vs 63%; mid: 74% vs 7%, 26% vs 79%; high: organized
   27% vs 10%, diffuse 0% vs 60%. In every stratum the pool tracks ITS OWN counterfactual (low 83/83%, mid 74/70%, high
   54/49%) and the counterfactual sits as far from the control as the pool: the gap is between towns born with a hideable
   house and towns born without one, not one the veil opens (PLAUSIBLE reading; CONFIRMED numbers). To the chair at once.
2. **THE TELL COLUMN (ruling 41 (2)): NO, for all 13 LOWER towns, both Reveal settings (26 of 26 town-reads), under the three
   switch settings tried** (the open read, the default veil, the criminal switch OFF). MEASURE ONLY. The differing fields
   (twin; `unit3-gate-table.txt`, every setting printed):
   - under the switch OFF / default (the closest setting for 10 towns): the served page carries an EMPTY operations list
     (`safetyProfile.criminalInstitutions: []`) where a house-free page with the criminal parts hidden carries no such field;
     and (8 towns) crisis crime types (`["black market food", "desperation theft"]`, `["conscription fraud", ...]`) where it
     carries none; and (5 towns) criminal services (1 to 7) where it carries none;
   - under the open read (the closest for the 3 power.entry towns): no criminal income row, no "Thieves' Guild", no goals or
     memberships aiming at it (5-9 goals, 4 memberships on B), a lower key and the covert rung off, where B serves them all.
   So the combination is: an OPEN-shaped page (its ops list and crime types served) with the criminal income row, the covert
   services and the criminal power absent. Not tried: settings opening some criminal groupings and shutting others.
3. **UNIT 2 REFUTES THE PREMISE IN PART (measure only):** `powerStructure.factions[].contestsNiche` is withheld on EVERY served
   page by R2's always-rule (`galleryWithholdAlways.js` "registry: power.contestsNiche"; 212 `_gallery_veil_each_minus_at ...
   contestsNiche`): served on 0 of every power of 280 nothing-hidden pages, so its absence is no tell. The born engine writes NO
   affiliation key on any person (0 of 6,678 stored people, every size), so a person without one is the only shape there is.
   The born pool has NO key-level cut by R3 (0 people; the top-level `factions[]` of master's shape: 0); the husk arm's
   key-level entries are the hand rows (Fishers' and Ropers' `contestsNiche: "Thieves' Guild"`, Ada's `factionAffiliation`).
   The chair's (c) does not trigger (the engine does not nearly always write either key). Table below.
4. **Two counts differ from PART 26's words:** VR42 by my definition (a governing power power.entry would take, kept by VR42) is
   met by 12 of 140 born towns ("Corrupt Council" / "Corrupt City Council"), not 0 (PART 26's 0 counts a governing power a
   hidden house RAISED: a different question); and income.criminalRow takes 8 LOWER towns (4 alone, 4 with the covert rule),
   not the chair's "seven".
5. **A JOIN HAZARD (PLAUSIBLE, not in this tree):** the goal rule finds a person's pre-sweep goal by the person's id; R4's
   per-load re-key of person ids (VR10, `galleryVeilPeople.js`, absent here) must run AFTER the copy pass, or the goal is
   judged on no counterpart (it would still leave where it names a withheld power now, but a husk would not).

## Unit 1 — THE HUSK CLASS, CURED (commit dbff7eeb3)
- FIRST ACT: the worktree's diff EQUALS `out/v25/r3c4/UNCOMMITTED-cure-units-1-2.patch` byte for byte (cmp); so BOTH hold the
  `recAt` twin fix (`recAt(pub, 'powerStructure')?.factionRelationships`).
- WHICH KIND (the chair, 12:21): the FIRST kind, kept: the copy pass sees each row as `pub` held it before the sweep emptied it
  (a goal by the person's id; a membership, a conflict in either list, a tension and a relation pair where a naming pre-sweep
  element of the same list holds the served row, `@>` / `heldBy`). Why not the second kind (the sweep removes the row): the
  sweep (`gallerySecondHomes.js :: sweepHiddenNames`, 212 `_gallery_veil_name_sweep`) runs on HIDDEN HOUSE names before
  power.entry decides which POWERS are withheld; teaching it the withheld powers would move power.entry's decision into
  the house pass in both engines. The first kind needs no new order of passes.
- WHY IT CANNOT LEAVE A COPY OF A WITHHELD ONE (read, both engines): the sweep only DELETES (a string from an array, a key from
  an object, a sub-object whole: `sweepHiddenNames` lines 673-697; it never rewrites a string), so every remnant is contained
  in what it was cut from, key by key and element by element: exactly `@>`'s test (212) and `heldBy`'s (twin; the same
  definition below the top level). Each served row is tested twice: on itself (`_gallery_veil_copy_names` / `conflictNames`,
  `tensionNames`, `memberNames`, `goalNames`) and on every `pub` row of the same list that names a withheld power and holds it.
  A goal is judged on the same person's pre-sweep goal by id, not by containment. A row some OTHER pass rewrote between the
  projection and the copy pass would escape the containment: none is known; the born arm finds 0 structured husks outside the
  key level over 240 documents and 174,125 objects compared (`born-green-measures.txt`) - CONFIRMED on the pool, PLAUSIBLE beyond.
- WHY IT CANNOT WITHHOLD A COPY OF A SHOWN POWER: the pre-sweep row must NAME a withheld power and HOLD the served row (every key
  of the served row present with an equal value). A copy naming a shown power P holds P's name in some field; a naming
  pre-sweep row holds it too only if it is the same row with a withheld name beside P's (a conflict P vs W: the husk itself).
  THE EXEMPTION: the search that decides "names" is built with the served powers' names as its open names (twin
  `withholdPowerCopies :: buildNameSearch(out, servedNames)`; 212 `_gallery_veil_name_search(wn, names)`), so a row naming
  "Old Thieves' Guild Watch" names no withheld power, before or after the sweep, and nothing holds it. A row whose every key
  equals a naming row's by coincidence (two identical conflicts but for one party) would leave: toward withholding.
- THE MEMBERSHIP "HUSK" ON hand-raised (Reveal DM on, both engines): NOT A SERVED HUSK, the instrument's pairing. Traced (twin,
  `measure/` scratch probe): Ada's `{power: "Thieves' Guild", role: "member"}` leaves whole and `{power: "Fishers", role:
  "member"}` is served; `husksOf` skipped the key `power` in its containment (meant for the re-derived NUMBER shares), so it
  paired the served Fishers membership with the withheld guild's and read it as a husk. Fixed in the test: a skipped key is
  skipped only where its value is a number. The server serves the same (born arm's twin-vs-server parity, green).
- THE TWO TEST-SIDE FIXES: `searchHits` takes the served powers' and houses' names as OPEN names and the exemption is POSITIVE
  (a string the bare search hits and the open search does not is exempt only where cutting the containing SERVED name out leaves
  nothing to hit; the containing name is reported: 24 strings, all "Old Thieves' Guild Watch"); the hand-forms arm dedupes the
  containing name (master's shape serves the Watch in both lists).
- RED: R3-CURE-4's a9e2de44a (3 failed of 39) and `run1-born.txt` (the cure before the test fixes: 4 red, exactly those three
  causes). GREEN: `run1-serverveil-handrows.txt` (galleryServerVeil + galleryVeilHandRows 43/43; a9e2de44a's three titles
  among them), `run2-born.txt` and `born-green.txt` (22/22, the husk arm included).

## Unit 2 — THE KEY-LEVEL HUSKS, MEASURED (twin; `measure/keylevel.probe.jsx`, `keylevel-an.mjs`; tables `unit2-keylevel-table.txt` (lane shape), `unit2-keylevel-table-master.txt` (master's))
140 births (48 control, 92 with a hideable house, 92 counterfactuals); nothing-hidden pages = control + counterfactual (140 per Reveal setting).
| holder / key | engine writes it (stored) | nothing-hidden served pages: holders WITHOUT the key | R3 cuts on the born pool |
|---|---|---|---|
| power, `powerStructure.factions[].contestsNiche` | city 22.6%, metropolis 18.6%, town 0%, village 0% | 100% of every kind and size (R2's always-rule) | 0 by R3 (every absence is the always-rule's) |
| power, top-level `factions[].contestsNiche` (master's shape; served with Reveal DM on only) | the same rates | city 67-100%, metropolis 70-88%, town and village 100% (by kind) | 0 |
| person, `factionAffiliation` / `faction` / `affiliation` / `factionId` | 0 of 6,678 | 100% (every size, members and not) | 0 |
(b) the possible-world test: the key's absence is the ordinary shape (67-100%) for every holder kind and size; no born cut exists
to test further. (c) not triggered; the counts asked anyway: withhold the holder = 0 born holders (hand rows: 1 power, 1 person
per plant); re-derive = 0 born holders. A served field pointing to a cut value: none on the pool (no R3 cut); the hand rows'
copies are searched by the born arm (0 hits outside R5's list). CONFIRMED (twin, executed); the server: PLAUSIBLE (the twin
equals the server on every R3 path, the born arm's parity test).

## Unit 3 — THE GATE AS AN INSTRUMENT, AND THE TELL COLUMN
- ONE COMMAND: `sh docs/chair/2026-11-20/veil/out/v25/r3c5/measure/gate.sh <worktree> <outdir> <template> 2` (template: x211 + the
  tree's 212); four shards of `gate.probe.jsx` (R3-CURE-2's keys.probe with the dial and the tell column), then `gate-an.mjs`
  writes the table and EXITS 1 on any HIGHER, any "Magical crime" above the counterfactual, or a throw.
- AT dbff7eeb3: EXIT 0. HIGHER 0, EQUAL 79, LOWER 13 of 92, "Magical crime" above 0, server = twin, Reveal off = on
  (`unit3-gate-table.txt`). Labels gated: the Defense key and "Magical crime"; the tell column also compares the operations
  labels, crime types, income row, criminal powers, covert services, the covert rung (`covertCrimeHeld`). No other derived label
  was searched for (not reached).
- (i) INDEPENDENCE, read: `gate.probe.jsx :: birth` calls `generateSettlementPipeline` (onStep cutting every hideable house from
  `ctx.institutions` and `ctx.settlement.institutions` at every step), `birthConfig`, `composePublicProse`/`withPublicProse`, and
  `isHideableHouse` (`src/domain/people/cardVeil.js`). Their imports: cardVeil.js (informationBrokerageTuning, contentFingerprint,
  rulingPower, cohesionWeave, cardPowers), publicProse.js (none), publicProseCompose.js (desk reads, publicSafe, trendLens,
  phantoms, flags), densityCreateBoundary.js (the law modules); `src/generators` imports none of galleryVeil.js,
  galleryRosterChoices.js, gallerySecondHomes.js, pageRederive.js (grep: those names appear only in two comments); 212 is read
  only by the server reads. CONFIRMED (by reading the import lines, one level, and grepping the generators).
- (ii) SHOWN ABLE TO FAIL: a SCRATCH copy (never committed; `unit3-gate-scratch-red.txt` carries its diff) with the re-derivation
  of `safetyProfile.criminalInstitutions` and the covert-service withholding OFF in both engines: EXIT 1, HIGHER 5 on exactly the
  five towns (city-none-0-37, city-wartime-0-49, city-none-0-31, town-indebted-0-16, town-wartime-0-19), both engines, both Reveal.
- (iii) THE CONTROL by crime-dial stratum: STOP 1. (The dial is the ROLLED `priorityCriminal`, read off the pipeline's own
  `ctx.effectiveConfig`; a first run read `ctx.config`, the UI's 50, for every town: corrected.)
- THE LOWER TOWNS BY RULE, of 92 (the field whose swap alone to the counterfactual's closes the gap; every town assigned):
  income.criminalRow alone 4 (city-none-0-31, town-insurgency-1-94, town-under_siege-0-18, town-under_siege-1-88);
  income.criminalRow and the covert rule together 4 (city-under_siege-1-118, town-under_siege-0-28, town-under_siege-1-98,
  town-wartime-0-29); the covert rule alone 2 (town-none-0-17, town-none-1-91); power.entry's reach 3
  (metropolis-insurgency-1-124, metropolis-wartime-0-59, town-none-0-23). Unassigned 0. The same 13 as R3-CURE-3's D1.
- THE TELL COLUMN: STOP 2.

## Unit 4 — THE RENAMED HOUSE (`measure/unit45.probe.jsx`, `unit45-counts.txt`; twin, Reveal off)
Of 92 born towns with a criminal house hidden, 76 hold another criminal house to show and rename (one plant each: shown by its
card and eyes, renamed "The Quiet Lantern"); the renamed house is served on 76 of 76; its operations-list line is LOST on 74 of
76: every plant whose house HAD a line (the two others are a "Whisper market", which carries no operations label to lose; the
list is rebuilt from catalogue names). Toward withholding. CONFIRMED (twin); server PLAUSIBLE.

## Unit 5 — THE OWNER'S COUNTS (`unit45-counts.txt`, `unit3-gate-table.txt`)
(a) power.entry's REACH: of 140 born pages (92 with a house hidden), 9 lose a criminal power's row ("Thieves' Guild") that no
hidden house raised (the counterfactual still holds it), Reveal off and on alike. (b) VR42: 12 of 140 born towns have a governing
criminal power whose row VR42 keeps (FIRST LINES 4). (c) LOWER by rule, of 92: above.

## GREEN AT dbff7eeb3 (the last commit adds documents only)
- The six veil guards: `guards-security-1` (gallerySecondHomes, galleryVeilCures) EXIT 0; `guards-security-2` (gallerySanitizer,
  galleryMapMemberCount, VR17's galleryVeilSignalCopies, R2's galleryWithholdAlways) EXIT 0.
- The two harnesses and V10-2's third (shareRenderTwice, rosterChoiceInversion, criminalSwitchHandReach): `guards-harnesses` EXIT 0.
- `guards-twin` (16 files: the walkers veilCopySites, rosterChoiceRegistry, rosterChoicePools, mutationCoverageManifest,
  observedShapeReaders; criminalVeilSwitch whole; curateModeCriminalSwitch; publicPayloadVeilTotality; publicSafe; publicSafeVeil;
  the two publicProse veil tests; gallery, partyLinkClient, the two galleryImport tests): EXIT 1, 15 of 16 files green; the one
  red is the KNOWN `observedShapeReaders.walker` ({reads 2222, identities 1556} against its frozen {2214, 1552}; R3-CURE-4 read
  2222 with the same cure; +8 against the frozen: PLAUSIBLY the cure's new reads, `pub.npcs`, `q.memberships`; not attributed).
- KNOWN REDS, unchanged and untouched: `known-reds` EXIT 1, exactly the four named (phoneChromeFloor.census, presumedThings,
  presumptionClasses, writerReach), 4 failed of 120.
- THE COST LAW (`cost-big-town.txt`, `measure/big-cost.mjs`, x211 against x212 as the acceptance run built it at this 212, box
  quiet, load 0.9): the Reveal-DM gallery read of the largest born town 589.3 ms against twice 211's Reveal-OFF read
  (2 x 446.8 = 893.6): WITHIN. Gallery off 745.1 vs 446.8 (1.67x); link 559.7 vs 310.6 (1.80x). The v8245 rows (`cost.sh`, chains
  r3c2_*): NOT RUN (the chains are not built here).
- R3's born test whole, the husk arm included: `born-green.txt` (+ `born-green-measures.txt`) EXIT 0, 22 of 22.
- galleryServerVeil whole (leak check and tooth) + galleryVeilHandRows: `green-serverveil-handrows.txt` EXIT 0.
- THE ACCEPTANCE RUN: `acceptance-run.txt` EXIT 0 (40 PASS, 0 FAIL; bytes 212 70c6eb45..., 211 eface6d0... at dbff7eeb3).
- `rosterChoiceRegistry.mjs --check` EXIT 0; typecheck:domain:strict EXIT 0; typecheck:ratchet EXIT 0; eslint on the touched
  files EXIT 0 (`eslint.txt`).
- 212 `70c6eb4582b4a9282d7ec1221c4214ae4143e514ad208f3e838eaa301220a124`, rollback
  `8cbd7d1c7a6d60f609b7473b14b7fe2b2ca8a3b6f3081151c2ae49d82cded5b0`; 211 `eface6d0...0b01` and rollback `ce8474ff...712f`
  unchanged (`sha256.txt`). VR27: the two new helpers revoked from anon and authenticated, dropped by the rollback
  (`vr27-revokes.txt`).

CONFIRMED: the patch equality; the cure green in both engines on the born pool and the hand rows; the membership pairing (twin
trace); the gate's tallies, its scratch red and the dial strata; the tell column's differences (twin); unit 2's rates (twin);
the renamed-house and reach counts (twin). PLAUSIBLE: the server's equality on the twin-only measures; the control gap's reading;
"no rewrite between projection and copy pass" beyond the pool.

Last line: commits dbff7eeb3 (units 1-2 cure: galleryRosterChoices.js, 212, its rollback, galleryRosterChoices.pglite.test.js,
run outputs), c4e2b1ab2 (units 2-5 measures: out/v25/r3c5/measure/*, unit2-*, unit3-*, unit45-counts.txt, vr27-revokes.txt), and
101fae14d (WIP: this file and the first GREEN outputs) and the final hand-back commit (this file, the guard and cost outputs); 212 sha256 70c6eb4582b4a9282d7ec1221c4214ae4143e514ad208f3e838eaa301220a124.

## ADDENDUM — THE ID GAP (the chair's ruling of 14:21 UTC, relayed from the lane owner's read of dbff7eeb3)
- THE GAP, TOWARD SENDING (CONFIRMED by red): both engines matched a person's pre-sweep goal and memberships by id only
  where the id was a STRING (twin `typeof o.id === 'string'`; 212 `jsonb_typeof(n -> 'id') = 'string'`), and so did the
  husk arm's `husksOf`. A person with a number id or no id kept a swept goal or membership as a husk.
- RED, COMMITTED (dc6227ead; `ids-red.txt`, 2 failed of 23): plant `HAND_IDS` ("Tollhaven"). Its hidden house "Thieves'
  guild (powerful)" folds bare to the guild's name, as on metropolis-7. Two people, one with id 41 and one with no id, each
  hold a goal aimed at and naming the guild and a membership of it. Faults: 24 in the new arm (both people, goal and
  membership, gallery, import and twin, both shapes, Reveal DM on) and 24 in the husk arm, which now matches people by id as
  text (`idKey`).
- THE CURE (both engines): a person is matched by its id AS TEXT for any scalar id (twin `idKeyOf`: a non-empty string
  itself, a finite number or a boolean by String(); 212: `->>` of a string, number or boolean id, written inline, so no new
  helper and no new revoke). A person with NO id (the empty string included) is judged against EVERY person of `pub`: its
  goal leaves where a naming pre-sweep goal holds it (`@>` / `heldBy`); a membership leaves where a naming pre-sweep
  membership of any person holds it. This fails toward withholding: a no-id person's remnant held by another person's naming
  row also leaves.
- GREEN: born test 23 of 23 (`ids-green-born.txt`: 12 people-reads judged; husk arm: 264 documents, 174,407 objects, no
  structured husk outside the key level); galleryServerVeil + hand rows 43 of 43; eslint 0. 212 sha256 is now
  `6260803d1c4dddc13831f0e72c7e3ee0c88e4853e74c56e1c384b4251efb0218`; its rollback and 211 are unchanged (`ids-sha256.txt`).
- NOT RE-RUN AFTER THIS CURE: the six guards, the harnesses, the twin batch, the acceptance run and the cost law. They were
  green at dbff7eeb3 (above). The change touches only the people branch of the copy pass.
