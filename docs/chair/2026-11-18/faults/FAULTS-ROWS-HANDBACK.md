# FAULTS-ROWS hand-back

Seat FAULTS-ROWS of the round FAULTS (BRIEF-FAULTS, rulings FR3 and FR4). Base d75011e68 (FAULTS-NEED's atom at the
rehearsal base 4288049ba); branch `lane/faults-rows-2026-11-18`. One file of the seat's row touched:
`src/data/institutionDescVariants.js`. Guard: `tests/generators/faultsRows.test.js`. One older test re-keyed:
`tests/generators/houseDescLateReRead.test.js` (count 30 → 32, dated note).

## 1. The items

### Item 1 · THE FAIR (FR3) — CURED

`DESC_LATE_SIBLINGS` (the late re-read, `assembleSettlement.js :: readHouseDescsLate`, after the last roster write; no
draw moves) gains two sets, each keyed by the fair's line, each in its siege twin's form:

| the line (original) | its ONE twin |
|---|---|
| "Regional merchants. Luxury goods available." | "A yearly fair for regional merchants. The luxuries the town wants do not reach it." |
| "Merchants from across the region, and luxuries to be had." | "A yearly gathering of the region's merchants, though the luxuries the town wants do not come with them." |

Each original declares `excludes: ['crisis: under_siege', 'need not brought in: luxury']`; each twin `needs: ['need not
brought in: luxury'], excludes: ['crisis: under_siege']`. The key `luxury` is in FAULTS-NEED's atom (no key missing).

THE ORDER OF THE TWO DECLARATIONS. The siege is the draw's (`DESC_VARIANT_SIBLINGS`, resolved at the draw on the birth's
facts): a town under siege at the draw stores the siege twin, which is no key of the late table, so the late re-read never
reaches it (r2s-under_siege-town-2: the siege twin stands beside "Needed, and not brought in: Quality textiles"). Each
late member also declares the siege off, so a siege settled after the draw never takes the need twin's "held": both
members refused, the original is kept as at the base and noted for the birth check (no such town in the three
populations). The need list is the resource analysis's (layer 4, after the draw): the late re-read is the line's place.

THE TOWNS, read one by one at the base (the stored record, the page's need list `importsAsPrinted().needed`):

| side | the thirty | the 150 | the 720 |
|---|---|---|---|
| FALSE at the base, the twin at the tip | bar0-town-calm-rand-45 (C32296: "luxury goods") | none | r2r-town-10, r2r-town-56 ("Quality textiles"), r2r-town-57, r2s-recently_betrayed-town-0, r2s-monster_pressure-town-3, r2s-wartime-town-2 |
| the line stands (no luxury in the need list) | bar0-town-occupied-rand-45 | bar0-town-calm-rand-27, -28, -38, bar0-town-occupied-rand-37 | r2r-town-23, -24, -28, -31 (salt), -32, -40, -41, -48 (salt), -49 (gold/silver ore), -51, -54 (livestock), r2s-recently_betrayed-town-1, r2s-plague_onset-town-0, r2s-monster_pressure-town-2, r2s-insurgency-town-0, r2s-slave_revolt-town-0 (gold/silver ore) |
| the siege twin, as at the base | | | r2s-under_siege-town-0, r2s-under_siege-town-2 (a luxury unmet: the siege twin stands) |

Auditor J's count was 5 in the 720; the atom reads six there: r2r-town-56's "Quality textiles" is of the page's own luxury
class (`tradeListDeclarations.js :: LUXURY_CLASS`), so its fair takes the twin too (true there: the page says the town
wants a luxury it does not get). R7: the twin takes its original's place at the late re-read; the draw pool
(`town|Economy|Annual fair`: the catalogue line and two variants, three lines) keeps its three lines in every town.

### Item 2 · THE QUARTER (FR3) — LEFT BY NAME (a file not on my row)

THE CURE NEEDS `src/data/institutionDescColour.js`, NOT ON MY ROW. "The trade in silk, spice, and precious things." is
marked a colour line there (line 368, `{ colour: true }`: "read; presumes nothing"), and a colour line declares nothing
else: `tests/data/colourMarks4h.test.js` and `tests/generators/houseDescLateReRead.test.js` ("none is a colour line") both
refuse a late key that is a colour line. Declaring the line on the atom means striking that one mark first (it is false:
the line presumes the goods it names). The draw's own declaration cannot carry it either: the need list is layer 4, after
the draw. Nothing written. THE BUILD, MEASURED IN SCRATCH ONLY (not committed): a late set keyed by the line, the original
`excludes: ['need not brought in: spice', 'need not brought in: silk']`, one twin.

THE TOWNS, read one by one (the line prints in 1 of the thirty, 7 of the 150, 63 of the 720):

- FALSE (the need list names a good the line names: "spices"; no town of the three needs silk): the 150:
  bar0-city-wartime-rand-28, bar0-metropolis-calm-rand-34; the 720 (seven, auditor J's seven): r2r-city-29, r2r-city-48,
  r2r-city-50, r2r-metropolis-4, r2s-politically_fractured-metropolis-1, r2s-monster_pressure-metropolis-2,
  r2s-wartime-city-0. The thirty: none.
- STANDS (another good unmet): copper ore (most), stone, clay, salt, charcoal and fuel, timber, preserved provisions,
  and GOLD/SILVER ORE (the atom's `precious` key: bar0-city-under_siege+famine-rand-36; r2r-city-30, -36, r2r-metropolis-0,
  -1, -17, r2s-under_siege-city-0, r2s-famine-metropolis-1, r2s-occupied-metropolis-0, r2s-mass_migration-metropolis-3).
  MY READING, VETOABLE: the ore is the mint's and the smith's want, not the quarter's wares ("precious things" are
  finished goods), so the line stands there; auditor J's seven are the spice towns, none of the ore towns.
- The quarter's other line, "Silks, spices, and other precious goods." (also a colour line, line 367), prints beside
  "spices" in 1 of the 150 and 13 of the 720 (r2r-city-17, -33, -47, -49, -57, r2r-metropolis-18, -26, -37, -51, -53,
  r2s-indebted-city-3, r2s-insurgency-metropolis-0, -2, r2s-mass_migration-city-0, -2, r2s-mass_migration-metropolis-1).
  Not named by FR3: left.

### Item 3 · THE FISH MARKET'S CARD (FR4) — LEFT BY NAME (no atom states the swap's fact)

THE FACT IS NOT IN THE VOCABULARY. The card is drawn at the description draw (`DESC_VARIANT_DECLARATIONS`: `needs:
['navigable']`), before the birth writes its imports, so only the late re-read could read the swap's story, and the late
re-read reads atoms only. FISH-ROWS's condition (`generateNarratives.js :: boughtFishRowsInPlace`: `usedGroundOf(record,
'fish')` and `importsHold(record, resourceShortageImport(ground))`) is no atom: `need not brought in` has no fish key and
cannot have one (in a bought town the fish IS brought in); `trade at work: fish taken here` is false in the bought towns
AND in the idle ones, and the idle towns must keep the card; the conjunction that equals the swap (`trade at work: fish`
and not `fish taken here`: measured equal to the swap on every fish-market town of the 900 at the base: 36 swapped, 303
not, 4 idle) is a disjunction on the original's side, which a declaration cannot state, and it is a second condition,
which FR4 forbids. AN ATOM IS NEEDED (one reading of `usedGroundOf` and `importsHold`, the swap's own fact; it would serve
the card and the service row alike, as BAR8-J-ROWS section 5 (1) said), and the vocabulary is FAULTS-NEED's (R6). Nothing
written.

WHERE IT PRINTS (base): the card prints in 1 town of the thirty and 1 of the 720. bar0-village-calm-rand-47 (the thirty):
the market's row "Preserved fish", the card false (auditor J's 11b.fish, the card's one instance). r2r-village-2 (the
720): "Fresh fish retail", a live fishery, the card true. I find no third: the brief's "3 in the 720" may count the
village pool's other catch lines ("An open-air stall or small covered market where the day's catch is sold", r2r-village-11
beside "Preserved fish"), which are not this line. The 18 idle fish towns: none prints this card; every card and mark of
the 900 is byte-equal to the base (section 4).

## 2. The rules, before and after

Auditor J's runner (`docs/chair/2026-11-17/bar8/AUDIT/runJ.mjs`, LAW 11; `--controls` on the thirty) and K's
(`runK.mjs`, LAWS 12 to 15), over PAGE-COPY renders of the thirty, the 150 and the 720 at the base and at the tip
(census3.sh, `--count-only`; one render of the 900 seeds, split by population).

| rule | the thirty | the 150 | the 720 |
|---|---|---|---|
| 11e.offer, luxury (the fair) | 1 → **0** | 0 → 0 | 5 → **0** |
| 11e.offer, spices (the quarter: left) | 0 → 0 | 2 → 2 | 7 → 7 |
| 11e.offer, all | 1 → 0 | 3 → 3 | 16 → 11 |
| 11b.fish, the card (left) | 1 → 1 | 0 → 0 | 0 → 0 |
| LAW 11, all | 14 → 13 instances | 27 → 27 | 128 → 123 |
| LAWS 12 to 15 (runK) | 9 → 9 | 75 → 75 | 247 → 247 (byte-equal outputs) |

No rule of either runner rises. THE CONTROL C32296 (bar0-town-calm-rand-45, "Luxury goods available."): FOUND at the base,
CLEAR at the tip (the twin prints in its place). The controls run exits 3 at the base and at the tip alike (other seats'
STANDS controls; "controls off" 14 → 15 is C32296 leaving).

## 3. Every new line, with three towns it prints in (the owner's veto list)

| the new line | three towns it prints in |
|---|---|
| "A yearly fair for regional merchants. The luxuries the town wants do not reach it." | bar0-town-calm-rand-45, r2r-town-56, r2r-town-57 (and r2s-recently_betrayed-town-0) |
| "A yearly gathering of the region's merchants, though the luxuries the town wants do not come with them." | r2r-town-10, r2s-monster_pressure-town-3, r2s-wartime-town-2 |

Each prints on three surfaces of its town (the Institutions tab, the house's card, the PDF), as its original did. The
shared page prints the owner's card (N4: the guard's `toPublicSafe` arm over its twelve towns). Neither door shows a
fresh line of mine (R9, section 6). No new atom; no new field.

## 4. Declared moves (R5) · field family `institutions[].desc`

THE FIELD: `institutions[].desc` of the Annual fair, and nothing else.

- THE STORED RECORDS OF THE 900 (the thirty, the 150, the 720; births at the base and at the tip): 893 byte-equal; 7 move,
  each in the Annual fair's `desc` only (every other byte of the record equal): the thirty 1 (bar0-town-calm-rand-45), the
  150 0, the 720 6 (r2r-town-10, r2r-town-56, r2r-town-57, r2s-recently_betrayed-town-0, r2s-monster_pressure-town-3,
  r2s-wartime-town-2).
- THE PRINTED PAGE (PAGE-COPY dumps, all tabs, the Tonight sheet, the PDF, the journal): the same 7 towns differ, each by
  the fair's three printed lines (the Institutions tab, the house's card, the PDF), nothing else. EVERY HOUSE'S
  DESCRIPTION OUTSIDE THOSE SEVEN TOWNS IS BYTE-EQUAL; every fish card and its mark byte-equal (no fish change).
- THE 525 (hashed by the golden's own procedure, `sha256(JSON.stringify(settlement))`, base and tip, in scratch; the
  manifest not written): **0 of 525 move** (no reference configuration prints either fair line).
- No draw moves (the late re-read is draw-free; the same roll, the same variant index everywhere). No new field on the
  saved record; nothing reaches `settlementMigrations.js` or `mutateEntities.js`.

## 5. Stored figures my work moves (the close's; I re-take none)

- `tests/generators/houseDescLateReRead.test.js`: the late table's count 30 → 32 (re-keyed in my commit, dated note: the
  claim is the same, the count is the table's).
- `tests/lint/poolDominance.register.json` (the close's, NOT touched): the pool `ledger:institutionDescVariants:DESC_LATE_SIBLINGS`,
  red at the base and at the tip: top1 0.8107 over 2002 draws in 1154 towns → 0.8028 over 2165 draws in 1180 towns (the
  fair's keys join the pool; its ceiling 0.6364 is unmoved). The pools I touch: `DESC_LATE_SIBLINGS` only.
- `tests/lint/sovereigntyLightingContract.walker.test.js` (red at both): the estate's file count 3691 → 3692 (my guard file).
- `tests/lint/readerShapeResolver.test.js` (red at both): `maxReadTokenLength` 263 → 262 (against its ceiling 256).
- `scripts/mutation-coverage-manifest.json` (the totality test, red at both): my guard `tests/generators/faultsRows.test.js`
  joins the list of invariant files with no entry (beside faultsNeed and the bar8 guards). Not my file: the close's.
- The golden master (`tests/fixtures/generator-golden-master.json`): red at both with 499 rows drifted; my move is in
  section 4.

## 6. The net, base and tip, each gate alone (`sh scripts/gate-tail.sh`)

Base d75011e68 and tip (92bf8283a for the whole net; the guard and the anchor walker again at 4a4fb286b after the
anchor fix), each in a clean clone of its commit, each gate alone through `scripts/gate-tail.sh`.

| gate | base | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | green | green |
| `npm run typecheck:ratchet` | green | green |
| `npx eslint` (my three files) | green | green |
| `npx vitest run tests/architecture` | green | green |
| ALL of `tests/lint` (JSON) | 26 files, 45 tests red; 48 names | the SAME 48 names; messages equal save four (below) |
| `npx vitest run tests/joins` | green | green |
| N3 `pipelineContract`, `isolatedTrade`, `publicProseEquality` | green | green |
| N3 `pipelinePinnedMode` | red (A1, A2, A5: golden rows moved) | the same, same messages |
| N3 `generationForkCensus` | red (A1, A4, A6: the control row's hash) | the same, same messages |
| `bar8Rows`, `bar8FishRows`, `census5dTablePools` | green | green |
| `poolDominance.walker` | red (3 tests) | the same three; one figure moved (section 5) |
| `presumedThings.walker` | red ("every source literal that names a thing declares it") | the same, same message |
| door `presumption-classes-door --check` | `hits 1793 · banked 1938 · fresh 8 · stale 153 · ceiling 1938` | the SAME last line |
| door `presumed-things-door --check` | `fresh 38 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107` | the SAME last line |
| my guard `tests/generators/faultsRows.test.js` | RED: 2 of 5 (UNMET 7 of 7 collected; THE TABLE absent) | green 5 of 5 |
| the older tests naming what I changed (25 files: `grep -rlE` over `tests` for `institutionDescVariants`, `DESC_LATE_SIBLINGS`, `DESC_VARIANT_SIBLINGS`, the three lines, `readHouseDescsLate`) | 24 green; `generatorGoldenMaster` red (499 rows) | 24 green (`houseDescLateReRead` re-keyed); `generatorGoldenMaster` the same 499 |

THE FOUR LINT MESSAGES THAT MOVE (each red at both, by the same test): `mutationCoverageManifest` (my guard joins its
list), `negativeAssertionAnchor.walker` (my first guard's bare `not.toMatch`: ANCHORED at 4a4fb286b, the walker's base
message restored: only `faultsNeed.test.js`), `readerShapeResolver` (263 → 262), `sovereigntyLightingContract` (3691 →
3692). The clone artefact `ledgerCitationIntegrity` (no ledger branch in a clone) is red at both alike.

N5, THE SCRATCH MERGE: `lane/join-2026-11-14` is at 70e557d5b, already in my base: "Already up to date", clean. N4: the
guard's shared-page arm (`toPublicSafe`) prints the owner's card in all twelve of its towns.

## 7. Left by name

1. THE QUARTER (item 2): needs `src/data/institutionDescColour.js` line 368's colour mark struck (not on my row). The
   seven towns and the build are in item 2.
2. THE FISH MARKET'S CARD (item 3): needs an atom for FISH-ROWS's swap (the vocabulary is FAULTS-NEED's). One instance in
   the three populations (bar0-village-calm-rand-47).
3. THE FAIR'S THIRD LINE, "A yearly draw for regional traders, with fine goods on offer." (`town|Economy|Annual fair`#1;
   its siege set is the draw's): prints beside an unmet luxury in 3 of the thirty (bar0-town-calm-rand-46,
   bar0-town-occupied-rand-46, -47), 1 of the 150 (bar0-town-occupied-rand-35) and 4 of the 720 (r2r-town-47, r2r-town-50,
   r2s-famine-town-1, r2s-indebted-town-1). FR3 names two lines: not widened. The same form would cure it.
4. The quarter's sibling "Silks, spices, and other precious goods." (item 2, 13 in the 720).
5. Not raised: nothing.
