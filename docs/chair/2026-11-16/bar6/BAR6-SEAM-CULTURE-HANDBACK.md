# BAR6-SEAM-CULTURE · HAND-BACK (the culture, history and general desks: what the culture seat left)

Base `cfc2b680a` (the joined line `lane/join-2026-11-14`, the tip named). Branch `lane/bar6-seam-culture-2026-11-17`.
Assignment: `BRIEF-BAR6-SEAM.md` §SEAM-CULTURE, items 1 to 6. Every count is the section's runners (`runC.mjs`, `runF.mjs`)
over PAGE-COPY renders (`census3.sh … --count-only`) of the 150 wide-read towns and the census's 720, at the base and at
my tip, in scratch trees outside every tree. The doors: `node scripts/presumption-classes-door.mjs --check` and
`node scripts/presumed-things-door.mjs --check`. The B4 stock: auditor G's `law5w-inventory-g.mjs`, my six files.

## MY ITEMS

| item | what | BEFORE 150 · 720 | AFTER 150 · 720 | how | guard |
|---|---|---|---|---|---|
| 1 · the sovereign | the lines of my files that name a lord: the stock's sovereign rows are 96, 124, 137, 138, 145 | 5 rows reasoned | 124 declared; 96 and 145 hold by their own words; **137, 138 LEFT** | `historyData.js`: "Lord/Lady of the Manor" `needs: ['sovereign']` | `bar6CultureLines` item 1 (the leaf reads a person who holds it; over the 720, every town that seats it reads `sovereign`) |
| 2 · the entrepôt line | DS-GEN-13 ENTREPOT v1 under a famine (7c-plenty) | 1 (bar0-village-famine-rand-37) · 3 (r2s-famine-city-3, r2s-famine-town-0, r2s-famine-town-1) | 0 · 0 | v1 `no crisis: hunger · tier: ≥ town`; v4 (twin, `tier: ≤ village`, no "the town"); v5 (twin, `crisis: hunger · no crisis: under_siege`: "was built to handle far more than its people could ever use; with food short, it cannot now feed them.") | item 2 (positive control: the base marks admit a famine village; the cured line is refused there; the pool keeps three there); the 720 sweep (never under the hunger family; three lines wherever the base had three) |
| 3 · v4's noun | DS-GEN-16 LEGACY-RECOVERED v4 "the town that came through it" | unbanded | "the place that came through it" | the annex | items 3 and 6 (no "the town" in the pool under no town band) |
| 4 · the table | 167 reviewed reasons, every row read against the source | 167 | **161 held**; 6 did not (below) | 4 cured and out; 2 out and LEFT | item 4 (no row of the table is one that did not hold) |
| 5 · the door's fresh line | `cultureProfiles.js` "Maize and other grain from intensive plots, terraces, and raised fields …" (class `resource`) | fresh 1 of mine (door: `hits 1805 · banked 1938 · fresh 4 · stale 137`) | fresh 0 of mine (door: `hits 1798 · banked 1938 · fresh 3 · stale 143`) | reworded: "Maize and other grain, grown intensively and redistributed through tribute, support dense populations." (no atom answers it where the line is chosen: below) | item 5 (the door's lexicon reads no class in it; positive control: the old line was a `resource` hit; it still names its grain) |
| 6 · the legacy's answer | DS-GEN-16 LEGACY-RECOVERED v1 after a blow that destroyed nothing (10g-legacy-answer, apart) | 2 (bar0-town-calm-rand-28, bar0-town-calm-rand-40) · 4 | 0 · 0 | v1 `legacy ruin`, "what it built in answer" (no "the town"); v5 (twin, `no legacy ruin`): "{settlement} came through the {calamity} without losing what it had built, a legacy that is {timeband_age}." The no-ruin side keeps three (v3, v4, v5) | items 3 and 6 (positive control: v1 as it stood printed after the economic divide; refused now; three lines there); the 720 sweep (every rebuilding line refused where nothing was destroyed; three no-ruin lines there) |

Item 2, measured before: of my changes to DS-GEN-13, the hungry twin first admitted a siege and `tests/domain/corpusCureGuards.test.js`
("DS-GEN-13::ENTREPOT … 32ab37da: the siege Overview's road lines off a siege") read the pool speaking where it is mute by design:
the twin now stands off a siege, and that file is green at my tip.

### Item 4: the six rows that did not hold

| row | text | reason as written | what the source shows | done |
|---|---|---|---|---|
| 40 | DS-WAR-2 `economic · strained` v1 "The tribute out of {settlement} is paid and paid grudgingly …" | office: "the pool's key is the occupation" | the pool is an ECONOMIC treaty term, not an occupation; the hit was "is paid" (the tribute) | reworded "is handed over, and handed over grudgingly" (no class hit; display only) |
| 120 | steppe architectural detail "storehouses and caravan yards mark the boundary …" | outside: built form | a bare string with no gate (the chair's finding stands) | declares `excludes: ['route: isolated']` (read at print by `architecturalDetailRefused`: the arrival's sight beat and the PDF's Architecture row; the draw reads only the tier, so no birth moves) |
| 124 | "Lord/Lady of the Manor" | sovereign: "drawn for the governing category that holds a manor" | no manor gate: `upgradeOpportunities.js` reads a minimum tier and the category only | declares `needs: ['sovereign']` (item 1) |
| 137, 138 | the Iron Dispute: "… between the settlement and a rival lord …" (both forms) | sovereign, resource: a resource event behind the deposit gate | the deposit gate holds (`historyGenerator.js :: generateRelationshipEvent`, `iron_deposits`/`iron_mine`); it answers the resource, not the lord | **LEFT BY NAME** (below) |
| 141 | ARRIVAL_SCENES.guild "… the reek of the dye-vats …" | goods: "the scene's key is the guild roster" | no route reaches the `guild` scene (`arrivalScene.js :: ROUTE_TO_SCENE`: crossroads → market, port, river, isolated/mountain_pass → smoke, else ordinary); the dyer was declared by nothing | reworded "the bite of fresh shavings"; its ease now `excludes` the whole family (`crisis: threat`, `crisis: hunger`) so the door reads no fresh line |

The 161 that held, by kind of reason, each read against the source: the six raw culture rows print only at a town or larger
(`pdf/lib/cultureOnPage.js` ruling (ii) `SMALL_TIERS`; the Daily Life context field `cultureCtx` prints on no surface), each of
the 27 rows found in one of the six fields; the raw `scope` prints nowhere (`settlementQuickGuide.js :: cultureScopeLine`
reads its own `SCOPE_PHRASE`); the foodways rows are kept by `foodways.js :: composeFoodwaysLine` only where every source
they name feeds the place (`SOURCE_WORDS`); the timeline's resource events and their hooks are behind
`generateRelationshipEvent`'s deposit gates (`stone_quarry`; `iron_deposits`/`iron_mine`); the plot hooks are their own
event's (trade_collapse, plague_years `byMemory`, pilgrimage_surge and its `byMemory`); the founding rows are
`TERRAIN_NARRATIVE_HOOKS`, told in the past tense; the STRESS_DESCS / STRESS_NOTES rows are drawn only under their own stress;
the annex rows' pool keys (the occupation and the war layer's occupation pools, the territorial treaty term, the pilgrim
season, the minor creed, the stressor's origin, a bank and a merchant guild, the loss of thousands: `QUANTITY_BANDS` above
1,200, beyond any village's 400); the lexical false hits read in their own words ("books" as ledgers, "each quarter" of the
year, "hides" as a verb, magical wards, "to spare", "kept up", feast days of the calendar, the tithe "paid up"); row 96 names
its lord only as a condition ("only where a lord can keep one"); row 145's founding names its lord in the past, and the
leaf reads the founding (SV1); rows 164 to 166 (DS-GEN-6, the origin) stand where a declaration would mute a partition the
contract test forbids (`dossierStateProseProjection.contract.test.js`, "reads NOTHING from a partitioned pool …").

### B4, my files (auditor G's inventory)

Before: 167 in the stock, all 167 in my table, 0 left. After: **164** in the stock (40, 120, 141 left it), **161** in my
table, **3 left**: "Lord/Lady of the Manor" (declared on `sovereign`, a named new atom auditor G's `CLASS_DIMS.sovereign`
does not hold: counted apart, ruling CD1; the build guard's door reads it declared) and the two Iron Dispute rows (LEFT).

## THE LINES A READER CAN SEE (new or changed; towns of my tip's renders)

Each line with the towns it prints in at my tip (150 = the wide read; 720 = the census), and its count of towns over the 720.

| line | where | towns (count over the 720) |
|---|---|---|
| DS-GEN-13 ENTREPOT v1 "… handles more than the town could ever use; the difference is the town's living." (now `no crisis: hunger · tier: ≥ town`) | Overview | r2r-town-13, r2r-town-14, r2r-town-23 (10); bar0-town-calm-rand-40, bar0-town-occupied-rand-27 of the 150 |
| NEW v4 "{settlement}'s market handles more than its own people could ever use; the difference is their living." | Overview | r2r-hamlet-15, r2r-hamlet-51, r2r-village-31 (5) |
| NEW v5 "{settlement}'s market was built to handle far more than its people could ever use; with food short, it cannot now feed them." | Overview | r2s-famine-city-3, r2s-famine-town-0, r2s-famine-town-1 (3: the base's three 7c-plenty towns); bar0-village-famine-rand-37 of the 150 |
| DS-GEN-16 LEGACY-RECOVERED v1 "… and what it built in answer still stands …" (now `legacy ruin`) | History | r2r-city-14, r2r-city-26, r2r-city-37 (34) |
| v4 "… the place that came through it is the one that stands …" | History | r2r-city-31, r2r-city-36, r2r-hamlet-59 (15); bar0-town-calm-rand-28 of the 150 |
| NEW v5 "{settlement} came through the {calamity} without losing what it had built, a legacy that is {timeband_age}." | History | r2r-city-23, r2r-city-30, r2r-city-55 (19) |
| the Maize foodways line, "Maize and other grain, grown intensively and redistributed through tribute, support dense populations." | Economics (foodways), PDF | r2s-indebted-city-0, r2s-infiltrated-metropolis-1, r2s-insurgency-town-1 (4; the old text printed in 4 at the base) |
| the steppe detail "storehouses and caravan yards mark the boundary …" (now `no route: isolated`) | arrival sight, PDF Architecture | r2r-city-15, r2r-city-17, r2r-city-27 (27; 30 at the base: the three it leaves are isolated) |
| "Lord/Lady of the Manor" (`needs: ['sovereign']`) | a person's role | prints in none of the 720 (nor at the base) |
| DS-WAR-2 `economic · strained` v1 "The tribute out of {settlement} is handed over, and handed over grudgingly …" | War & Faith | none of the 720 (the old text: none at the base) |
| ARRIVAL_SCENES.guild "… the whine of a lathe, the bite of fresh shavings …" | arrival | none: no route reaches the scene |

THE RUNNERS AT MY TIP. runC over the 150: 7c-plenty 1 → 0 (6b-denied 5, 6a-w 16, 7w-tone 8: unchanged, not mine). runC over the
720: 7c-plenty 3 → 0 (6b-denied 19, 6b-w 4, 6a-w 103, 7w-tone 8, 6c-arms 3: unchanged). runF over the 150: 10g-legacy-answer
2 → 0; over the 720: 4 → 0 (10e-temper-manner 5 · 14 and 10f-backs-wide 37 · 195: unchanged, SEAM-DESKS's and the chair's).

## THE BOOKS MY CURES MOVE (named, not re-taken: the close's)

- A DECLARED MOVE (B5): the Maize line's reword moves `economicState.foodSecurity.foodRecord.foodwaysLine` and
  `culturalIdentity.foodways` in **4 of the 525** reference configurations, and nothing else on any of the 525 (every
  record hashed with those two fields out: 0 moved). The golden master's snapshot of those four is the close's.
- The wiring census (`docs/content/wiring-census.json`): re-taken in scratch only (AX1), never committed. At my tip
  `tests/lint/wiringCensusDeclared.walker.test.js` reads 72 rows unlike a fresh annex reading (71 at the base: mine add
  `DS-GEN-13 :: ENTREPOT`); `proseWiringCensus.walker.test.js` "the VARIANT column closes" reads 3,005 variants against its
  pin of 2,977 (3,002 at the base: my three new variants); `dossierStateProseProjection.contract.test.js`'s shift register
  (variant-count, face-count, vids pins) the same 3,002 → 3,005. Every other failure of those three files reads the same
  message at the base and at my tip (the stale census, red at the base: AX1).
- `src/data/proseNorms.generated.js`: moved by the generator's run (859 → 861 pools in its header): not committed.
- The build guard's register (`tests/lint/presumptionClasses.register.json`): my cures make its rows for the old Maize,
  dye-vats and tribute texts stale (stale 137 → 143 over the whole tree); no `--shrink`, no `--bank`.
- `docs/census/declarations/CULTURE_PROFILES_DAILY.json` holds the old Maize text (a census ledger).

## THE NET (at my tip `ad5b4c119`; each alone, to a file through `sh scripts/gate-tail.sh`)

| gate | at my tip | at the base |
|---|---|---|
| `npm run typecheck:domain:strict` | green (1113, ceiling 1113) | green |
| `npm run typecheck:ratchet` | green (167, ceiling 167) | green |
| `npx eslint` on my six changed sources and my guard | green | |
| `npx vitest run tests/architecture` | green, 347 | |
| `npm run build` + the two build tests | not run: I touched no file under `src/domain/facts/` and no import in one (S7) | |
| my guard `tests/domain/bar6CultureLines.test.js` | green, 10 (the 720 sweep included) | |
| the two rounds' guards (`tests/domain/bar5*`, `tests/generators/bar5*`, `tests/domain/bar6*`, `tests/generators/bar6*`: 19 files) | 18 green; `bar6ScenesGoods.test.js` "each good reads the page's own lists …" red | red, the same message (`expected false to be true`): SEAM-SCENES item 4, named |
| `node scripts/presumption-classes-door.mjs --check` | `hits 1798 · banked 1938 · fresh 3 · stale 143 · ceiling 1938`: the three fresh are SEAM-DESKS's (the power desk's travellers line, `safetyProfile.js`'s two); **none of mine** | `hits 1805 · banked 1938 · fresh 4 · stale 137 · ceiling 1938` (the fourth was my Maize line) |
| `node scripts/presumed-things-door.mjs --check` | `fresh 39 · stale 72 · first-register stale 6 · banked 4688 · strips fresh 0 stale 0 banked 107`: the same 39 fresh as at the base, line for line; **my cures add none** | the same |

Also read, the files my lines touch (at my tip against the base, same message unless named): `tests/domain/corpusCureGuards.test.js`
green (it was red at an earlier tip of mine: the siege, above); `generalStateProseDesk`, `entrepots`, `corpusEcoTailGuards`,
`heraldCausalVoice`, `w2FixDataHistoryItems`, `historyTab` green; `dossierStateProseProjection.contract`, `proseWiringCensus.walker`,
`wiringCensusDeclared.walker`, `factLayers.walker`, `crisisBlindDossierProse`, `textOf` (227 against 224: SEAM-SCENES item 7),
`foodwaysCultureLineHolds` red at the base and at my tip with the same messages, except the three census counts named in the
books above.

## WHAT IS LEFT, BY NAME

1. **The Iron Dispute's "rival lord" (rows 137, 138; item 1).** The cure is a `sovereign` declaration on the two lines of
   `historyData.js :: HISTORY_DESC_SIBLINGS` with twins that name none ("a rival claimant"). It is resolved at the birth
   (`sizedResourceEvent`), where the leaf knows only the houses and the crisis, so most iron towns would take the twin, and
   `tests/generators/w2FixDataHistoryItems.test.js` ("each text resolves to its twin…": `sizedResourceEvent(iron,
   village(['Mine (shaft)']))` equals the event unchanged) would turn red. That file is not on my list, and the text is
   written by `historyGenerator.js :: generateRelationshipEvent` (not mine). Wants: a seat holding both, a re-key of that
   case by identity, and a declared move of `history.historicalEvents[].description` (B5).
2. DS-GEN-17 ADMINISTERED v4 "{settlement} keeps a gaol of its own, though no court sits here to try anyone." (the culture
   seat's twin, my desk) is a FRESH hit of the presumed-things door at the base and at my tip (`prison`): it declares
   `no court sits` and no prison. Seen, not chased: a `prison` mark leaves the state (the key true, no court, no gaol) with
   no line, and the pool's floor is not mine to re-cut here.
3. DS-GEN-13 ENTREPOT v2 ("… and the town lives off their passing") says "the town" under no size band, as v1 did; item 2
   named v1 only. Under a plague the pool admits two lines (v2, v3), at the base as at my tip.
4. The 6a-w, 7w-tone and the other seats' rows runC and runF still count over the 150 are not mine (named in SEAM-LIST).

## FOR THE OWNER, IN PLAIN WORDS

A trading town's "more than the town could ever use" no longer prints in a town that is going hungry; a hungry town is told
its market cannot now feed it, and a village gets its own wording. The "what the town built in answer still stands" line
prints only after a blow that destroyed something, and the lines that do print say "it" or "the place", true at every size.
The manor's lord declares the sovereign it names. Of the culture seat's 167 reasons for leaving a line alone, 161 hold
against the code; the six that did not are cured, except the rival lord of the iron dispute, which needs another seat's test.
VETOABLE wording (the owner's): every new and changed line above.
