# CAUSES-DATA: the causes' data file, its predicates and the one sentence function. PAGE-7's brief, 15:13 UTC 2026-11-20

Read first, whole: `briefs/BUILDER-RULES.md`; `CONTRIBUTING.md`; `docs/DESIGN_POOL_CENSUS.md` §1 (the facts
directory's rule: ONE FACT, ONE HOME); `PAGE-5-HANDBACK.md` §4-5 (origin/lane/page-5-2026-11-20: the ruled tables,
verbatim from `measures/page-5/sim.mjs`). The lines, as the chair ruled them, are the ONLY source of every wording:
`lines/CAUSES-LINES-A.md` and `lines/CAUSES-LINES-B.md` (this branch, f8ee0ed50) and crime_wave + guild_conflict's
file as the chair rules it (PAGE-7 gives you its commit; until then build the six kinds and leave those two for last).

## THE CHAIR'S SHAPE (15:10 UTC, ruled; quoted in substance)
1. `src/data/tensionCauses.js`: DATA ONLY, no function, no regex. `TENSION_CAUSES[kind] = { causes: [{ id, rank: 1|2,
   holds: '<predicate key>', hideable: bool, wordings: string[] }], plain: string[] }`, eight kinds, the causes in the
   ruled order. Its header states the hideable rule: a cause holds only where the document in hand shows it; one rule
   for every audience; `hideable` is a LIST for the security reader, not a branch.
2. THE PREDICATES: one module, `src/domain/display/tensionCauseHolds.js`, one pure function per key over
   `(record, facts)` with `facts = factsOf(record)`. A fact with a home in `src/domain/facts/` is read from its home;
   a house test (sim.mjs's `inst` regexes) or a power test with no home gets one THERE by §1's rule, registered as that
   directory requires, never a second reader beside an existing home and never a pattern in the data file.
3. `src/domain/display/tensionCause.js :: tensionCauseSentenceOf(record, tension)`: returns the sentence, or null where
   the kind has no table. The WHOLE pick as measured: the rank-1 causes that hold, picked by keyed hash
   (`src/kernel/proseHash.js :: pickVariant`); only if none, the same among rank 2; else plain; then the wording by
   keyed hash. The display seat (PAGE-4) only calls it.
4. THE KEY (a security rule): the measure keyed on `seed`. Find whether EVERY shared/served document carries the
   town's seed (`src/data/faceHonorifics.js`'s helper met the same question: read how it keyed). If not, or not
   provably, key on the town's NAME and the trouble's KIND (e.g. `<name>::cause::<kind>` and `<name>::held::<kind>`).
   RED FIRST: the same document with `seed` deleted prints the same sentences.
5. `hideable: true` on every cause whose predicate reads a criminal or covert house, a criminal power, the roster of
   powers at all (so rival_power, guilds_rule, merchants_rule, outranked too), the law band or the order force; in doubt,
   true.
6. `{power}`: filled INSIDE tensionCauseSentenceOf by the SIDES TABLE'S OWN FILL (unit 1, c5da1cfb3: find the one
   function that fills `{power}` from the roster by kind, and its reader's test, exactly one power of that kind in the
   document in hand); never a second fill. A cause whose wordings hold `{power}` does not hold where that test fails.
7. ARMS (tests, red first, `tests/helpers/drawnProse.js`'s way: compute, never quote a pool's sentence):
   - totality: eight kinds; every cause's `holds` key exists in the predicates module and every predicate key is used;
     wordings 3 for the ruled WORDS causes, 2 otherwise; plain 3 (great_flood 4); no function or RegExp in the data file;
     every wording pinned (count + a content digest per kind, so a changed wording reds);
   - no wording holds "the place" twice; `{power}` appears only on causes ruled to carry it;
   - the key: seed deleted, same sentences; null for a kind with no table; {power} cause dropped where the test fails.
8. MEASURES (scripts under `docs/chair/2026-11-20/content/page/measures/page-7/`, each run to a file, read by count
   lines): (a) PARITY: on sim.mjs's 900 towns (`hxd-<size>-0..149`) the built predicates hold exactly where sim.mjs's
   do: 0 disagreements, or each disagreement named and reported (a home that differs from sim's regex is the finding,
   not to be bent); then re-point sim.mjs's table at the built module (one source). (b) PROJECTION THROUGH THE BUILT
   FUNCTION with the built key: mixed sizes under 10%, three cities in a row under 25%; (c) THE CAP: no wording above
   about 15% of its kind's towns. Commit each output file.

## FILES (the manifest; stop on any other)
NEW `src/data/tensionCauses.js`, `src/domain/display/tensionCauseHolds.js`, `src/domain/display/tensionCause.js`,
their tests under `tests/` (a basename that avoids the mutation manifest's name pattern); any new home in
`src/domain/facts/` with its registration as §1 requires (name it in your reply); the measures dir; a manifest row if the
repo's implementation manifest demands one for a new src file (say so). Nothing in `historyGenerator.js`,
`historyData.js`, `src/components/`, `src/domain/tension/`, the sides table's file.

## GREEN AT YOUR LAST COMMIT (run each to a file, `sh scripts/gate-tail.sh <cmd>`, never through a pipe)
Your tests red first; every test file of a module you changed; `tests/lint` whole; `npm run typecheck:ratchet`,
`npm run typecheck:domain:strict`, `npm run lint`. Never the whole suite; no census (PAGE-7's). No GIT_* variable in
any test run's environment.

## HOW YOU WORK
Your own worktree and branch `lane/page-7-2026-11-20-causes`, cut from PAGE-7's commit given at dispatch. Commit by
explicit paths with the receipts (red titles, green counts) in the message; author Claude <noreply@anthropic.com>. Never
push, never merge. Reply at most 250 words: commits, red and green count lines, the measures' count lines, the key
chosen and why, new fact homes, every disagreement.

## ADDENDUM, 15:19 UTC (the chair, 15:18; binds where it differs from the above)
- DISPATCHED NOW. Scope is NEW FILES ONLY: the data file, `tensionCauseHolds.js`, `tensionCause.js`, new fact homes AND
  their naming lines in `src/domain/facts/factsOf.js` (that file's one permitted edit), their tests, the measures. No
  other existing file: not `historyGenerator.js`, not the sides table's file (READ its fill and call it), not sim.mjs
  on PAGE-5's lane (re-point a COPY under measures/page-7/).
- crime_wave + guild_conflict: build from `lines/CAUSES-crime_wave-guild_conflict.md` at 19e7f7932 (this branch: the
  chair's six rewordings applied). That file numbers wordings from 1; the data file's arrays keep its order.
- THE LIVE ROSTER: every house predicate reads `institutionRoster.js :: liveInstitutions`, not the raw roster (a ruined,
  removed or remnant house is no cause). A parity disagreement with sim.mjs that is ONLY this is LISTED with its town,
  not cured.
- A CUSTOM HOUSE IS NEVER MATCHED BY ITS NAME: a house test answers for the catalogue's houses by the home's own identity
  test; where a home can only read names, a DM's own house is left out (the line falls toward plain). RED FIRST: a custom
  house named "Black Market Tavern" does not print the black market's line.
- HIDEABLE, crime/guild: the file's nine AND law_thin, no_force, force_unpaid_or_cut, guilds_rule, rival_power; the other
  kinds by rule 5 above (every rival_power, merchants_rule, outranked: true).

## ADDENDUM 2, 15:37 UTC (the chair, 15:35): THE PAGE NEVER PRINTS A GUILD THE RECORD LACKS
In `tensionCauseSentenceOf`, where the kind is `guild_conflict` and the guild's home (`src/domain/facts/guild.js ::
guildOf`, factsOf's `guild`) answers no on the document in hand, NO cause and NO plain line is used: the sentence is
exactly "Traders here are fighting over who may sell what, and over a say in how the place is run." It lives in the data
file as the kind's `withoutItsHouse` wording (`TENSION_CAUSES.guild_conflict.withoutItsHouse`), read BEFORE the ranks;
the totality arm covers it. RED FIRST on hxd-hamlet-29's record (the one guildless guild quarrel of 900: measure
1f7a6446a). The generator is not touched; the sides of that trouble are left as they are.

## ADDENDUM 3, 16:32 UTC (the chair, 16:30): THE STOP RULED; ROUND 2 ON `lane/page-7-2026-11-20-causes`
Accepted: the built projection, parity 0, the key on the place's name. NOW:
1. DECLARED DRAW: every wording (and plain line, and withoutItsHouse) declares its `needs` atoms (implied by its cause's
   predicate; true wherever it holds); `tensionCauseSentenceOf` draws through `src/domain/facts/drawDeclared.js` (read
   only; call it), keyed as now. NO register row. presumedThings and presumptionClasses green.
2. TWO ATOMS ALLOWED: `house:thieves_guild` and `house:smuggling`, answered by `facts/causeHouses.js`, APPENDED at the
   end of their list in `factVocabulary.js`, nothing else in that file touched.
3. THE HOME IS NAMED IN `factsOf` AND TAKES ITS `factLayers.js` ROW, in the layer of the houses it reads (hideable where it
   reads a criminal or covert house); append the row. Quote the row and the two atom lines in your reply.
4. THE {power} FILL: build ONE pure helper beside the sides table (new file; name it): exactly one power of the kind in the
   document in hand gives its name as prose takes it (use the names lane's helper for prose naming: find it); else null.
   tensionCauseSentenceOf uses it; merchants_rule then holds where it should. Red first: two economy powers → no hold.
5. Re-run parity and the projection THROUGH THE BUILT FUNCTION; give mixed, three cities, and merchants_rule's rate.
6. GREEN: tests/lint green but for ledgerCitationIntegrity (red at base) and the two censuses (PAGE-7's refreezes).
(The cap's five third wordings come later as lines; leave the arrays as they are.)

## ADDENDUM 4, 17:33 UTC (the chair, 17:32): ROUND 3, THE LAST BEFORE THE MERGE
1. LEAVE: append `house:thieves_guild` and `house:smuggling` to the house family's `atoms` in
   `src/domain/facts/registeredWords.js`; nothing else in that file.
2. ATOMS GRANTED: `house:caravans` (causeHouses.js; a catalogue house) and `entrepot` (NEW home `src/domain/facts/entrepot.js`
   over `economicState.isEntrepot`, named in factsOf), each with its `factLayers.js` row and its registeredWords wiring as the
   walkers require; presumedThings and presumptionClasses green BY DECLARATION.
3. LAYER 1 for causeHouses stands if the layers walker is green. "Hideable" is not a layer: the criminal houses are hideable
   by `src/domain/people/cardVeil.js :: isHideableHouse`; the cause data's `hideable` list carries it.
4. MERCHANTS_RULE: `solePowerNameOf` takes the GOVERNING power for merchants_rule; the exactly-one test stays for every
   other fill. Red first. Print the sentence on the 13 debt towns that trade governs, one line each (seed: sentence), to
   `measures/page-7/merchants13.out.txt`.
5. The cap is accepted as is (no sixth plain). tests/lint green but for ledgerCitationIntegrity and the two censuses.
