# BAR7-LINES · HAND-BACK · seven single writers, each cured in its own words

Seat BAR7-LINES, 2026-11-17. BASE: the joined line at `5e81f06225e3c380d98bf3ca2faabc4d43972abe` (the tip my prompt named; no
later tip). BRANCH: `lane/bar7-lines-2026-11-17`. Nothing merged. Every run was read to a file through `scripts/gate-tail.sh`.
The measures are BAR7-AUDIT-I's runner (`docs/chair/2026-11-17/bar7/AUDIT/runI.mjs`) over PAGE-COPY renders of the base and the
tip (the thirty `bar0-<shape>-rand-42..44`, the 150 `rand-27..41`, the census's 720 `seeds.txt`). The base render lost 79 dumps
to an out-of-memory kill of one worker. I re-rendered those 79 seeds at the same base and merged them in: 900 of 900 at both ends.

Two items are LEFT BY NAME (1 and 6), because their cure needs a file that is not mine. The other six are cured.

## 1 · THE RULES (towns / instances, the thirty · the 150 · the 720; `apart` in brackets, never counted)

| rule | base | tip | the guard |
|---|---|---|---|
| 9a.order (item 1) | 1/1 · 7/7 · 0 | 1/1 · 7/7 · 0 (**LEFT**) | — |
| 10i.pair (item 2) | 1/1 · 4/4 · 27/29 | 0 · 0 · 0 | `bar7Lines` "10i" |
| 10i.pair-respect / -family (apart) | – · (3) · (7)/(8) | – · 0 · 0/(8) | kin and grudging/genuine respect kept |
| 6e.no-higher (item 3) | 1/1 · 2/2 · 8/8 | 0 · 0 · 0 | "6e" |
| 6e.crown (item 3) | 0 · 1/1 · 7/7 | 0 · 0 · 0 | "6e" |
| 6e.war-apart (apart, SV1) | – · – · (11/24) | – · – · (10/20) | the war's own crowns stay |
| low.agree (item 4) | (3) · (13) · (42) | 0 · 0 · 0 | "low.agree" |
| low.generation (item 5) | (9) · (19) · (100) | 0 · 0 · 0 | "low.generation" |
| low.hook-party (items 6, 7) | (1) · (7) · (19) | 0 · (5) · (12): the reformers 7 → 0; **the old families 12 LEFT** | "history" |
| design.outside (item 8; counted apart) | (6/13) · (22/36) · (86/116) | (2/4) · (6/11) · (25/43) | "design" |

What the design line's 43 are: the runner matches the OLD words. What remains is the non-siege famine and harvest lines ("bought from
outside", "afford to import": 37 grain-importing towns and 6 food-but-no-grain towns), which the auditor read as true and the
brief keeps. No siege town prints the old words in any population.

THE GUARD: `tests/generators/bar7Lines.test.js` (new; 7 cases). It is RED AT THE BASE in 6 of 7 cases (the 7th is the detector's
own planted control) and GREEN AT THE TIP. It reads the auditor's `WARM`/`COLD` kinds on the record and plain patterns of the printed
words, never the table the cure changed. Its seeds are the controls' towns, plus two towns where the base printed "Weak defences keeps".

THE DOORS (R9): `presumption-classes-door --check`: base `hits 1795 · banked 1938 · fresh 0 · stale 143`; tip `hits 1789 ·
banked 1938 · fresh 0 · stale 149`. `presumed-things-door --check`: base `fresh 39 · stale 72 · first-register stale 6`; tip
`fresh 39 · stale 72 · first-register stale 7`. NO FRESH LINE OF MINE. A first draft did add three: the iron dispute's two forms
(class `resource`, the word "deposits") and the war goal's note (class `war`, "Since the war began"). I reworded all three so no
class word stands. The new stale rows are the close's; I ran no `--shrink` and no `--bank`.

## 2 · THE CONTROLS

- **C19351** (10i, bar0-hamlet-calm-rand-44): GONE. The runner reads `MISS`. The tab prints "All (2) · Rivals (2)": the ally's
  second tie beside the rival's first is now a Professional Rivalry at its rung.
- **C16768** (6e, bar0-city-wartime-rand-44): GONE (`MISS`). The card reads "Wants Satisfy the army's requisition order without
  stripping the settlement to the bone".
- **C5430** (9a.order, bar0-city-under_siege+famine-rand-43): **STILL STANDS**, LEFT BY NAME (item 1 below).
- The EXPLAINED negatives C0350, C0351, C7307, C7309, C33342 and C45848 print clean in their towns, CHANGED. Under the siege:
  "The settlement must decide what it can still afford to bring in by the teleportation circle, …". The importer:
  "One importer now holds all the grain that comes in from outside and has quadrupled its price; …".
- The war's crowns in war towns (SV1) still print, apart (20 instances in 10 towns of the 720). "The rest of the realm" is not
  touched (258 towns, as before).

## 3 · THE LINES A READER NOW SEES (each with three towns of the tip's 720 where it prints)

1. 10i: a pair's second tie, in the first one's sense. Beside a warm first tie (an ally, a devoted teacher, a deep respect), an
   enemy's or a rival's kind is a **Genuine Respect** (grudging, genuine, genuine by rung). Beside a cold first tie (a rival, an
   enemy), an ally's kind is a **Professional Rivalry** (professional, personal, bitter by rung). The World/Relationships tab moves
   in 38 towns of the 720 (r2r-city-31, r2r-city-38, r2r-city-51; and in the thirty's bar0-hamlet-calm-rand-44, C19351's town).
2. 6e: "Satisfy the army's requisition order without stripping the settlement to the bone" (r2r-metropolis-4, r2r-thorp-11,
   r2r-thorp-55). Its note: "Every decision here now comes back to the army's requisition order, which asks for what the
   settlement itself needs to live."
3. 6e: the town crier, "Proclaim laws, decrees and official notices to the public." (r2r-city-1, r2r-city-11, r2r-city-13; 157 towns.)
4. low.agree: "Weak defences are the reason." and "Weak defences keep …" (r2r-hamlet-1, r2r-hamlet-12, r2r-hamlet-13; 40 towns).
   "Strong defences" and "full stores" agree the same way (`PLURAL_CAUSE_WORDS`).
5. low.generation: from FORTY years, the generation band says "two generations" (the predicate "two generations old", the span
   "two generations", the adverb "two generations on", the attributive "two generations'"). The band keeps its id `a_generation`.
   Prints in r2r-city-38, r2r-city-42 and r2r-city-46 ("… that legacy is two generations old."); 119 towns.
6. History, the culture seat's rows 137 and 138: "Rights to the iron in the local ground became the subject of a prolonged dispute
   between the settlement and a rival claimant. The outcome shaped who controls extraction / who holds those rights to this day."
   (r2r-city-0, r2r-city-23, r2r-city-59; 46 towns). No town of the 720 or the 150 prints the iron dispute's "rival lord". The 34
   towns with "rival lord" left are `stressTypes.js`'s monster hook ("whether a rival lord, a beast …"), which is not mine and
   flagged by nobody.
7. History, item 7's hook: "The corruption goes higher than anyone yet suspects; those pressing to expose it are being used"
   (r2r-city-18, r2r-city-33, r2r-hamlet-34; 56 towns).
8. The food hooks: under a siege, the channel is named. "The settlement must decide what it can still afford to bring in by the
   teleportation circle, …" (r2s-under_siege-city-0, r2s-under_siege-metropolis-3, r2s-under_siege-town-2: the 3 siege towns of
   the 720). The famine form says "what food the {channel} still brings in costs more every week"; it prints in 2 towns of the
   thirty. The importer: "One importer now holds all the grain that comes in from outside and has quadrupled its price; …"
   (r2r-city-12, r2r-city-16, r2r-city-19; 70 towns of the 720). The channel's words come from the balance's own
   `importChannelLabel` (`foodBalance.js :: hookChannelOf`: a route bare, "port trade"; any other channel with its article, its
   parenthesis dropped, and the verb agreeing).

No pool lost a line: every cure rewords a line or changes which kind is resolved. Nothing was struck.

## 4 · DECLARED MOVES (R5): the 525 reference configurations, every top-level field hashed, base against tip

213 of the 525 move:
- `relationships` 57 (item 2). In the same 57 configurations: `npcs` 54 (only `goal`: a person's goal reads the tie's kind,
  e.g. "settle_rivalry" → "protect_ally", and its words follow), `conflicts` 29, `powerStructure` 29 and
  `generationCoherenceReceipt` 29 (a conflict rides on a rival tie between two powers' heads). No tie DRAW moves (`inTemperOf`
  re-reads the drawn kind after the draw, as TI1's did). No name, person or house moves.
- `history` 92: `historicalEvents` 54 (the iron dispute, the corruption hook), `currentTensions` 38 (the same hook).
- `availableServices` 66 (the crier's line).
- `economicViability` 25 (the food hooks' words).
- The war goal moves no configuration of the 525 (no wartime row); it moves `npcs[].goal` in the war towns of the census.
No new field on the saved record. Nothing in `assembleSettlement.js`, `vite.config.js` or `package.json`.

## 5 · THE BOOKS MY CURES MOVE (stored figures: the close's, R10)

- The goldens and their derived files: `tests/fixtures/generator-golden-master.json` and every byte-identity census over the
  golden corpus (the moves above).
- `tests/domain/mergeLadderHeldKeys.test.js` A3: "trials whose conflict citations the post-pass rebuilt" reads 62 against the
  stored 61, because the ties re-deal one trial's conflicts. GREEN AT THE BASE, RED AT THE TIP, by a measured figure: the close's to re-take.
- The two doors' stale rows (above).

## 6 · TESTS RE-KEYED BY IDENTITY (R8, each with a dated note beside it)

- `tests/generators/w2FixDataHistoryItems.test.js` (item 7): the mine village keeps the mine's own words ("controls extraction",
  the fortified sites, the mining contract), held with `toEqual` on the event as it now prints. One more assertion was added: no
  form names a lord.
- `tests/domain/bar4PeopleKinds.test.js` C18833 (bar0-hamlet-calm-rand-23): the same town and the same refused enemy line; what
  its place prints is now the grudging respect's line (was the rival's "trained together and have competed ever since").
- `tests/generators/grainMonopolyHookNoGuild.test.js`, `importerHookNoTrade.test.js` and `supplyHooksReadTheRecord.test.js`: the
  importer's hook in its new words, with the same towns and the same claims.

## 7 · MY NET (R11), each gate alone, through gate-tail

| gate | base | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | 0 | 0 |
| `npm run typecheck:ratchet` | 0 | 0 |
| `npx eslint` (my changed sources and tests) | 0 | 0 |
| `npx vitest run tests/architecture` | 0 (21 files, 347 tests) | 0 |
| bar5*/bar6* guards | 1 red: `tests/domain/bar6ScenesGoods.test.js` "each good reads the page's own lists …" | the same 1, same message (named, not chased) |
| my guard `tests/generators/bar7Lines.test.js` | 6 of 7 red | green |

No file under `src/domain/facts/` was touched, so no build was run (R11).

A wider sweep (`tests/generators tests/domain tests/components tests/pdf`) was stopped by the 30-minute background limit before it
ended, so not every file in those folders was reached. Of the 38 files it found red at the tip, 37 are red at the base too, with
the same failure counts. That includes `tests/domain/corpusSlotAgreement.test.js` (DS-GEN-16 LEGACY-RECOVERED v1/v4/v5) and the
two PDF files that BAR7-CARDS holds. The one new red is the stored figure in §5.

## 8 · LEFT BY NAME

1. **9a.order, the siege's "The garrison keeps order, and more harshly as the food runs down" (C5430; 7 towns of the 150, 1 of
   the thirty).** The brief's premise is false in code. The siege branch of `safetyProfile.js` is drawn at the economy step,
   before the powers, the defence ledger and the conditions exist. `src/domain/facts/lawBand.js` says so in its own header:
   "the generator cannot know the band its guard line will print beside". So the clause cannot read the band where it is drawn.
   The only reading of the band is at print: `src/domain/display/guardLineUnderTheLaw.js :: safetyLineAsPrinted`, called by
   `defenseDisplay.js` for `safetyProfile.safetyDesc`. Neither file is mine. THE CURE, for a seat that holds `guardLineUnderTheLaw.js`:
   a declared set keyed by the clause, `law: > collapsed`, read by `safetyLineAsPrinted` as `GUARD_LAW_SIBLINGS` is read for the
   guard line. Its twin, beside `SIEGE_NO_FORCE_ORDER`: "The garrison holds the walls, but order in the streets has gone, and it
   frays further as the food runs down" (the same for "Those holding the place" and "The military command"). I wrote no
   half-cure (no unread twin constant).
2. **low.hook-party "the old families" (12 towns of the 720, 5 of the 150).** 7 of the 12 are the law-collapse TWIN that
   `guardLineUnderTheLaw.js :: GUARD_LAW_SIBLINGS` writes ("The old families once kept the peace; …"). The other 5 are
   `safetyProfile.js :: NO_WATCH_SMALL`'s drawn line, whose text is that table's KEY. Rewording the drawn line would silently drop
   the twin, and `tests/domain/bar5SafetyLawBand.test.js` holds each key to its source. Also, "no power holds such a party" is a fact
   of the finished record (the powers are drawn after the safety profile). The cure is a reading at print in
   `guardLineUnderTheLaw.js`, not mine. ("Those who have always run things" is no better, as the brief says.)
3. The late ties (`people-ties-late` in `assembleSettlement.js`) draw on their own. None of them made a 10i instance at the tip
   in any population, so nothing is left there to cure.
4. "Kin who are rivals" stays possible (8 apart in the 720), and so does respect between rivals for a grudging or genuine respect
   or a formal teacher. A DEEP respect or a devoted teacher beside a rival is now one sense: the rival's kind becomes a respect.
   This is the one place where the cure narrows what can print, and it is the brief's own rule for warm against cold.

## 9 · NEW VOCABULARY FOR THE OWNER'S VETO LIST

None. No atom was added. `TIE_TEMPER` gained two rows (`rival: cold`, `ally: warm`) as the brief directs: data, not vocabulary.

## 10 · THE WALKERS (the chair's ask of 2026-11-17, about 07:00 UTC)

- `bar7Lines.test.js`'s three seed loops now collect every failure (`collectSeedFailures` / `expectNoSeedFailures`), and its four negatives (plus my one in `w2FixDataHistoryItems.test.js`) stand beside a positive anchor (`expectAbsentWithAnchor`). Both files are green at the tip (7 and 33 tests).
- `seedLoopTotality.walker` and `negativeAssertionAnchor.walker` at the tip each fail on others' files only: `tests/pdf/seamPdfReadsTheTabs.test.jsx`, `tests/domain/bar6SeamDesks.test.js`, `tests/domain/bar6SeamEcon.test.js` (the close's). Neither names a file of mine.
- `domainAnyCastBaseline` at the tip fails 4 cases, naming `dossierViewModel.js`, `economicsCrisisMarks.js`, `institutionProfile.js`, `mobilizationStatus.js`, `factionArchetypes.js`, `facts/factsOf.js`, `facts/seatMembers.js`, `facts/sovereign.js` and `foodLedger.js`: none of them mine (the close's).
