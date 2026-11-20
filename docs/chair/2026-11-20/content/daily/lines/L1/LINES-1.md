# DAILY-1 · L1 — LINES-1: `dawn_work`, `gathering_places`, `child_warnings` (for the chair's read; written 2026-11-20T18:29Z by `date -u`)

Probe `probe.1.mjs` (900 fresh births, M1's recipe; exit 0; `probe.1.out.txt`). Cells: top single text share, % of 150 (TODAY's from M1 in brackets).

| row | thorp | hamlet | village | town | city | metropolis |
|---|---:|---:|---:|---:|---:|---:|
| dawn_work top % | 14 (94) | 13 (81) | 13 (81) | 7 (42) | 9 (77) | 9 (80) |
| gathering_places top % | 11 (81) | 7 (65) | 12 (53) | 8 (45) | 8 (70) | 9 (96) |
| child_warnings top % | 3 (36) | 3 (32) | 3 (29) | 5 (35) | 12 (61) | 13 (63) |
| distinct texts dawn / gather / child | 16/17/85 | 25/34/96 | 25/25/105 | 39/26/99 | 26/32/29 | 20/24/30 |
| false lines, M1's every test (today: places with any false clause, dawn/gather/child) | 0 (130/122/128) | 0 (136/97/133) | 0 (144/80/111) | 0 (108/0/4) | 0 (27/0/26) | 0 (12/0/25) |
| branch cells below reach/0.15 eligible wordings | 0 | 0 | 0 | 0 | 0 | 0 |
| hideable house named / "town" / a bracket printed | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 |
| my own word tests failing (section 4 of the out file) | 0 | 0 | 0 | 0 | 1 | 3 |

The bar holds in every cell (highest: metropolis child 13, thorp dawn 14). The only word-test hits are today's siege text `"the bells ring three times"` (a count, rule 7), kept by rule 1: see THE CHAIR'S CALLS, 1.

## HOW THE POOLS ARE APPLIED (rules 1, 2, 4, 6)
- A slot takes its branch. The pool is filtered to the ELIGIBLE wordings, those whose every need holds on the record. Then `src/kernel/proseHash.js :: pickVariantMixed(eligible, \`${record.name}::dailyLife.<slot>::<branch>\`)` picks one. There is no new draw.
- A house a wording names (`{x}` below) is the first LIVE row of its kind (`institutions/institutionRoster.js :: liveInstitutions`), in roster order. It is never hideable (`people/cardVeil.js :: isHideableHouse`) and never access-only (`facts/liveInstitutionNames.js :: ACCESS_ONLY`). The sacred house is chosen by preference: cathedral, then temple/church/abbey/chapel, then shrine, then monastery. No house is drawn.
- THE HELPER (rule 4): `src/domain/display/institutionSentenceNoun.js :: institutionSentenceNoun`. It goes through the label seam (`institutionDisplayName`), strikes the bracket, drops a leading "multiple"/"massive", takes the first of a slashed pair and lowers the first letter. The sentence adds the article: `the ${institutionSentenceNoun(row.name)}`. `display/validationOnPage.js :: houseWords` does both steps, but it is private and is not reused.
- Examples as printed: "Inn (multiple)" → "the inn"; "Parish churches (2-5)" → "the houses of worship"; "Great cathedral" → "the great cathedral"; "Docks/port facilities" → "the docks"; "Multiple market squares" → "the market squares". Every named row and its count is in section 6 of the out file.
- Needs are this file's keys. Each resolves to the home named in `probe.1.mjs :: NEED_DOC`: `defenceOf(r).walls/.gate/.militia`, `factsOf(r).guardPresence/.sacredHouse/.guild/.foodSources/.timberAtHand/.populationBand/.appointedPost/.prosperity`, `hasInstitution(r, 'granary'|'smith'|'mill'|'tavern'|'bathhouse'|'docks'|'temple')`, `marketOf`, `waterOf(r).navigable`, `tradeRouteOf`, `rulerKindOf`, a `monster_pressure` threat, and M1's no-home name tests (see ATOM-WANTED).

## THE BRANCHES
- `dawn_work`: dailyLife.js's six branches are KEPT, meaning unchanged: food critical, defence critical, craft ≥25, merchant ≥30 under a siege, merchant ≥30, default. Every wording in them is need-gated. A defence-critical thorp with no walls and no watch draws from W5 to W14: its doors, its fields, its water, people going out together. It never gets walls or a watch it lacks.
- `gathering_places`: RE-CUT. `named` means the record holds a live, non-hideable sacred house, market or inn/tavern; `plain` means it holds none. Today's cut matched the WHOLE roster by name. A ruined row and a hideable "Black market"/"Whisper market" could count, and a "Parish church" did not, because the religious pattern lacks "church". Each frame names at most three houses.
- `child_warnings`: the threats are taken by severity, each kind said once, and now the first TWO kinds (today: the kinds among the first three threats). Each kind keys its own pick. The text reads "Children are warned about A, and about B." With no threat, the `none` branch gives a whole sentence. `default` (a kind with no pool) replaces today's printed machine label.

## THE POOLS (index 0 of a branch = TODAY's text with its needs declared; "names" = the houses the wording prints)

### dawn_work

**food**
F0. "Dawn work is the search for food. Foragers leave before light, and the granary queue forms before the ovens are warm." — needs: [granary]
F1. "Dawn work is the search for food: people are out before light to see what can be found." — needs: []
F2. "Those who fish are out before light, and what they bring back decides what is eaten that day." — needs: [fishSource]
F3. "Hunters are out before light, and the rest of the day waits on what they bring home." — needs: [gameSource]
F4. "People are at {market} before light, waiting to see what food comes in and what it will cost." — needs: [market]; names: market
F5. "The beasts are seen to before light, and nothing they give is wasted." — needs: [livestockSource]
F6. "Every hand that can be spared is in the fields at first light, looking for anything left to gather." — needs: [farming]

**defence**
W0. "The walls claim the first hours: the watch musters thin at first light, and ordinary work waits until the rounds are walked." — needs: [walls, guard]
W1. "Before any other work, someone walks the length of the walls at first light and looks for gaps." — needs: [walls]
W2. "Those who keep guard are out at first light, and the rest wait for their word before going out to work." — needs: [guard]
W3. "Those sworn to turn out in danger meet briefly at first light before going to their own work." — needs: [militia]
W4. "The gates stay shut until it is fully light, and the day's work waits on them." — needs: [gate]
W5. "Before anyone goes out to work, each household looks to its own door and sees that all is as it was left." — needs: [dwellings]
W6. "The first light goes to walking the edges of the fields; the ordinary work begins once that is done." — needs: [farming]
W7. "Water is fetched at first light in company, never alone, and the day's work starts after." — needs: [water]
W8. "People go out to their work together at dawn, and no one strays far from the houses alone." — needs: [dwellings]
W9. "The first hour is spent seeing that nothing was disturbed in the night; only then does the ordinary work begin." — needs: []
W10. "Everyone keeps within call of the houses in the first hours, and the farther work waits until later in the day." — needs: [dwellings]
W11. "The elder is asked at first light whether all is well before anyone goes out to work." — needs: [elder]
W12. "With danger about in the country, no one sets out at first light until others are ready to go too." — needs: [monster]
W13. "The beasts are let out at first light and kept close to the houses through the day." — needs: [livestockSource]
W14. "Doors are opened late and with care, and the day's work starts a little after first light." — needs: [dwellings]

**craft**
C0. "Smithy fires light before sunrise; guild-callers move from shop to shop, and apprentices haul water before the bell." — needs: [smith, guild]
C1. "The forges are lit before sunrise, and the first hammering is heard as it grows light." — needs: [smith]
C2. "The workshops open before sunrise, and the day's making is well under way by first light." — needs: []

**merchant_siege**
S0. "The merchants count their stock before light, and the porters wait for loads that do not come; dawn brings the smell of woodsmoke and grain." — needs: []
S1. "The merchants are up before light, counting what is left and waiting for goods that cannot reach them." — needs: []

**merchant**
M0. "Merchant caravans roll before light; porters and apprentices queue at the warehouses, and dawn brings the smell of woodsmoke and grain." — needs: [route, warehouse]
M1. "Traders are setting out their goods at {market} before light, and the first buyers come as it grows light." — needs: [market]; names: market
M2. "Before light, goods are carried out of the warehouses to where they will be sold." — needs: [warehouse]
M3. "Loads are made ready before light for the journey out, and the merchants see them off themselves." — needs: [route]
M4. "Boats are loaded and unloaded at {docks} from first light, and the merchants are there to watch." — needs: [docks]; names: docks
M5. "The merchants are at their stalls before first light, and the first bargains of the day are struck early." — needs: [market]
M6. "The merchants are up before anyone else, and their business is under way by first light." — needs: []

**default**
B0. "Bakers light their ovens first, then the smiths; the watch changes as the gates open." — needs: [bakery, smith, guard, gate]
B1. "The bakers have their ovens lit before first light, and the first bread is out as people wake." — needs: [bakery]
B2. "The forge is lit early, and its hammering is the first sound of most mornings." — needs: [smith]
B3. "The first grain of the day is carried to {mill} at first light." — needs: [mill]; names: mill
B4. "Stalls go up at {market} at first light, and the first buyers come soon after." — needs: [market]; names: market
B5. "Those who kept guard through the night hand over at first light and go home to sleep." — needs: [guard]
B6. "The gates are opened at first light, and the first of the day's comings and goings begin." — needs: [gate]
B7. "Water is drawn early, and the day's work begins once the households have what they need." — needs: [water]
B8. "Those who fish are out before first light and back with the catch by mid-morning." — needs: [fishSource]
B9. "The beasts are seen to first, and the milking is done before the rest of the day begins." — needs: [livestockSource]
B10. "Most people are in the fields by first light; the rest of the work fits around them." — needs: [farming]
B11. "The workshops open their doors early, and work is under way at the benches by first light." — needs: [craftGuild]
B12. "At {inn}, breakfast is already being served to those who mean to set out early." — needs: [inn, route]; names: inn
B13. "At first light the beasts are driven out to graze on the common." — needs: [common]
B14. "The first boats are being unloaded at {docks} as it grows light." — needs: [docks]; names: docks
B15. "The granary doors are opened at first light, and the first grain goes out to be ground." — needs: [granary, mill]
B16. "The fires under {bathhouse} are lit before dawn, so the water is hot when the first bathers come." — needs: [bathhouse]; names: bathhouse
B17. "The night's guard comes down off the walls at first light, and the day's guard goes up." — needs: [walls, guard]

### gathering_places

**named**
N0. "By midday people are gathered at the steps of {church}, {market}, {inn}: talking, trading, and watching." — needs: [church, market, inn]; names: church, market, inn
N1. "Most days people stop to talk by {sacred} on their way to and from their work." — needs: [sacred]; names: sacred
N2. "People meet where the water is drawn and again by {sacred}, and most news passes between them." — needs: [sacred, water]; names: sacred
N3. "In the evenings people gather at {inn}, where the day's news is passed around." — needs: [inn]; names: inn
N4. "People gather at {market} as much to talk as to buy." — needs: [market]; names: market
N5. "People meet at {market} by day and at {inn} once the work is done." — needs: [market, inn]; names: market, inn
N6. "Between {sacred} and {inn}, most people cross paths at some point in the day." — needs: [sacred, inn]; names: sacred, inn
N7. "People gather in {square} at midday to talk, to trade a little, and to watch the day go by." — needs: [square]; names: square
N8. "Many go to {bathhouse} as much for the talk as for the water." — needs: [bathhouse]; names: bathhouse
N9. "People meet while they wait their turn at {mill}, and again by {sacred}." — needs: [mill, sacred]; names: mill, sacred
N10. "People stop to talk on {bridge} and at {market}, where most comings and goings pass." — needs: [bridge, market]; names: bridge, market
N11. "When the boats come in, people gather at {docks} to see what has been landed." — needs: [docks]; names: docks
N12. "In the evenings people gather at {theater}, and the talk carries on afterwards at {inn}." — needs: [theater, inn]; names: theater, inn
N13. "People gather on the steps of {cathedral}, where there is always someone to talk to." — needs: [cathedral]; names: cathedral
N14. "In the evenings people gather at {inn} or out on the common." — needs: [common, inn]; names: inn
N15. "People meet on the common and by {sacred}, where most of the talk of the place goes on." — needs: [common, sacred]; names: sacred
N16. "After a service people linger on the steps of {church}; on other days they meet where the water is drawn." — needs: [church, water]; names: church
N17. "People talk in the fields while they work, and gather by {sacred} when the work is done." — needs: [sacred, farming]; names: sacred
N18. "Of an evening people sit out at their doors, and by day they meet by {sacred}." — needs: [sacred, dwellings]; names: sacred
N19. "People meet while they wait their turn at {mill}, and again where the water is drawn." — needs: [mill, water]; names: mill
N20. "People meet at {mill} and at {market}, and the talk at each is of prices and of one another." — needs: [mill, market]; names: mill, market
N21. "People cross {square} on their way to {sacred}, and many stop to talk on the way." — needs: [square, sacred]; names: square, sacred
N22. "People meet where the water is drawn by day, and at {inn} in the evening." — needs: [inn, water]; names: inn
N23. "After the day in the fields, people gather at {inn} to talk it over." — needs: [inn, farming]; names: inn
N24. "People meet at {market} and where the water is drawn, and between them most news gets about." — needs: [market, water]; names: market
N25. "People meet at {market} and out on the common, where there is always someone about." — needs: [market, common]; names: market
N26. "People meet at {wellMark} and by {sacred}, and most of the news of the place passes there." — needs: [wellMark, sacred]; names: wellMark, sacred
N27. "People meet at {wellMark} by day and at {inn} in the evening." — needs: [wellMark, inn]; names: wellMark, inn
N28. "Of an evening people drift from their doors to {inn} to talk the day over." — needs: [inn, dwellings]; names: inn

**plain**
P0. "People gather where they can: the well, the bridge, the open square." — needs: [well, bridge, square]
P1. "People meet where the water is drawn, and most of the day's news is passed on there." — needs: [water]
P2. "Morning and evening, people stop to talk where the water is drawn." — needs: [water]
P3. "People talk where the water is drawn and over one another's doorsteps, morning and evening." — needs: [water, dwellings]
P4. "People gather at one another's doors in the evening, and by day where the water is drawn." — needs: [water, dwellings]
P5. "Most talk happens in the fields while the work goes on, and again where the water is drawn." — needs: [water, farming]
P6. "Where the water is drawn is where people meet and pass on their news." — needs: [water]
P7. "Of an evening people sit out by their doors and talk across to their neighbours." — needs: [dwellings]
P8. "People meet at the field edges at midday, when the work stops for a while." — needs: [farming]
P9. "People see most of one another where the water is drawn, and the talk there is of the work and of each other." — needs: [water]
P10. "When the boats are drawn up, people gather at the landing to sort the catch and talk." — needs: [landing]
P11. "People meet on the common, where the beasts graze and there is always someone about." — needs: [common]
P12. "People gather at {wellMark} morning and evening, and most of the news of the place passes there." — needs: [wellMark]; names: wellMark
P13. "Matters of any weight are talked over at the elder's door, where people gather of an evening." — needs: [elder]
P14. "People meet at the communal root cellar, where the stores are kept and the news is passed along." — needs: [rootCellar]
P15. "When the flocks are brought in, people gather to help and to talk." — needs: [shepherd]

### child_warnings

**unrest**
U0. "crowds that gather quickly" — needs: [notSmall]
U1. "getting mixed up in the grown-ups' quarrels" — needs: []
U2. "repeating what they hear said at home about those in charge" — needs: []
U3. "hanging about {market} when tempers are short" — needs: [market]; names: market
U4. "loitering by {inn} when voices are raised" — needs: [inn]; names: inn
U5. "taking sides in arguments that are not theirs" — needs: []
U6. "carrying tales from one household to another" — needs: []
U7. "getting caught up when people gather in the streets" — needs: [notSmall]
U8. "joining in when the grown-ups' talk turns angry" — needs: []
U9. "wandering into other households while feelings are running high" — needs: [dwellings]
U10. "picking quarrels of their own while their elders have quarrels enough" — needs: []

**economic_collapse**
E0. "the empty stalls in the trade quarter" — needs: [market, tradeQuarter]
E1. "asking for what the household cannot spare" — needs: []
E2. "wasting anything that could still be mended or used again" — needs: []
E3. "losing anything, however small, that the household paid for" — needs: []
E4. "handling goods at {market} that there is no coin to buy" — needs: [market]; names: market
E5. "begging favours from neighbours who have little enough themselves" — needs: []
E6. "breaking or spoiling what cannot easily be replaced" — needs: []
E7. "giving anything away without asking first" — needs: []
E8. "grumbling about going without" — needs: [poor]

**monster_pressure**
P0. "the road past sundown" — needs: [route]
P1. "straying out of sight of the houses once the light starts to go" — needs: [dwellings, small]
P2. "the woods once the light goes" — needs: [timber]
P3. "the far edges of the fields after dark" — needs: [farming]
P4. "going anywhere alone after dark" — needs: []
P5. "going out to look for whatever is heard in the night" — needs: []
P6. "following the beasts out beyond calling distance" — needs: [livestockSource]
P7. "going down for water alone after dark" — needs: [water]
P8. "being outside the walls once the gates are shut" — needs: [walls, gate]
P9. "wandering beyond the last streets after dark" — needs: [notSmall]

**plague**
L0. "the sick-house and unfamiliar coughs" — needs: [sickHouse]
L1. "going near any house where someone has fallen sick" — needs: []
L2. "sharing cups and spoons with anyone outside the household" — needs: []
L3. "unfamiliar coughs, and anyone who has one" — needs: []

**siege**
S0. "staying close when the bells ring three times" — needs: [sacred]
S1. "climbing up to look out over the walls" — needs: [walls]
S2. "straying far from home while there is danger outside" — needs: []

**famine**
A0. "wandering off: bread is short" — needs: []
A1. "eating anything they find without asking first" — needs: []
A2. "wasting so much as a crust" — needs: []

**bandit_raids**
R0. "strangers who linger at the gates" — needs: [gate]
R1. "riders they do not know" — needs: []
R2. "going out along the road alone" — needs: [route]

**rival_neighbor**
N0. "anything bearing the colors of the neighbour" — needs: [neighbour]
N1. "trusting anyone who comes from the neighbouring place" — needs: [neighbour]
N2. "strangers who ask questions about the place" — needs: []

**corruption**
K0. "talking to officials they don't know" — needs: [appointedPost]
K1. "taking gifts from grown-ups they do not know" — needs: []

**cult**
Q0. "masked strangers offering sweets" — needs: []
Q1. "following strangers who promise them something" — needs: []

**arcane_instability**
Z0. "shimmering air and unfamiliar lights" — needs: []
Z1. "touching anything that glows, hums or moves on its own" — needs: []

**default**
D0. "straying far from home on their own" — needs: []

**none**
X0. "Children are warned about the usual things: the deep well, the strangers' road, the woods at twilight." — needs: [well, route, timber]
X1. "Children are warned about the usual things: getting lost among the stalls at {market}, and keeping close in a crowd." — needs: [market, notSmall]; names: market
X2. "Children are warned about the usual things: the forge and its sparks, and straying too far from home." — needs: [smith]
X3. "Children are warned about the usual things: playing too near the water, and straying too far from home." — needs: [navigable]
X4. "Children are warned to keep away from the edge of {docks}, and to be home before dark." — needs: [docks]; names: docks
X5. "Children are warned not to climb about on {bridge}, and to be home before dark." — needs: [bridge]; names: bridge
X6. "Children are warned about the usual things: straying too far from home, and talking to strangers." — needs: []
X7. "Children are warned to keep clear of the turning stones at {mill}, and to be home before dark." — needs: [mill]; names: mill

TODAY's texts not kept, with the reason:
- `gathering_places` today's named frame is kept as N0, but only where all three of its houses stand, and with the article and the bracket fixed. Before: "the inn (multiple)". After: "the inn".
- Today's fallback P0 ("the well, the bridge, the open square") is kept with its needs. It is true at 0 of 900, so it never prints.
- `child_warnings` today's default (`threat.label.toLowerCase()`, a machine label) is replaced by D0.
- Today's other texts stay at index 0 and print only where true. Places of 900: W0 7, B0 13, M0 5, E0 2, X0 4, F0 12, U0 21, P0 61. Today's printed them on far more.

## THE HOUSES EACH SLOT NEEDS (rule 6: for the security reader at the join; none is hideable, none is a crime fact)
- `dawn_work` NAMES: market (a `marketOf` row named /markets?/, not a square), docks, inn/tavern, mill, bathhouse. It also NEEDS: granary, smithy, craft guild (`/craft guild/`), bakery, warehouse, walls, gate, a militia row, a guard force, dwellings, farmland, a water source, common grazing.
- `gathering_places` NAMES: the sacred house (cathedral > temple/church/abbey/chapel > shrine > monastery kinds), the church (the same without the shrine), the cathedral, market, market square, inn/tavern, mill, bathhouse, bridge (`/bridge/` row), docks, theatre (`/theater|theatre|opera house/` row), a quarter landmark `/well/`. It also NEEDS: water source, dwellings, farmland, common grazing, a fishing landing row, a root cellar row, a shepherd row.
- `child_warnings` NAMES: market, inn/tavern, docks, bridge, mill. It also NEEDS: walls, gate, hospital or healer, sacred house, smithy, dwellings, farmland, water source.
- `corruption` and `cult` (0 places in M1 and here) are kept. Their wordings need no crime fact (K0 needs only `factsOf(r).appointedPost`). Taking the branch still reads a crime-shaped fact (the `corruption_exposed` condition); see THE CHAIR'S CALLS, 3.

## ATOM-WANTED (facts the record already holds, read here by name tests because no home answers them)
- ATOM-WANTED waterSource : `facts/institutions.js :: INSTITUTION_KIND_PATTERNS` (row /water source(s)|well|aqueduct|water system|water infrastructure/; M1's nearest) : W7, B7, N2, N16, N19, N22, N24, P1-P6, P9, child P7
- ATOM-WANTED dwellings : same table (row /dwellings|housing/) : W5, W8, W10, W14, N18, N28, P3, P4, P7, child U9, child P1
- ATOM-WANTED farmland : same table (row /farmland|subsistence farming/) : F6, W6, B10, N17, N23, P5, P8, child P3
- ATOM-WANTED commonGrazing : same table (row /common grazing/) : B13, N14, N15, N25, P11
- ATOM-WANTED bridge, square, bakery, warehouse : as M1 found (no home) : N10, child X5, P0; N7, N21, P0; B0, B1; M0, M2
- ATOM-WANTED theatre : same table (row /theater|theatre|opera house/) : N12
- ATOM-WANTED fishingLanding : same table (row /fisher's landing|fishing community/) : P10
- ATOM-WANTED rootCellar, shepherd : same table : P14, P15
- ATOM-WANTED wellLandmark : `spatialLayout.quarters[].landmarks` /well/ (no reader) : N26, N27, P12
- ATOM-WANTED craftGuild : same table (row /craft guilds/) : B11

## THE CHAIR'S CALLS (my recommendation after each)
1. S0 (today's siege warning) says "three times", a count under rule 7. Rule 1 keeps today's text where it is true (a sacred house stands): 4 places. RECOMMEND: keep it as rule 1 says, or strike "three times" ("staying close when the bells ring"). The second is my preference.
2. Taking only the first TWO kinds (the brief's "up to two") moves the warnings' mix. A frontier monster threat (severity 0.45) now falls behind unrest and economic fragility at small places. `monster_pressure` is taken at thorp 23% (today 66% within the first three), hamlet 29% (59), village 32% (60). Town and above are unchanged. RECOMMEND: keep two, as the brief says. Three would make many sentences run past 30 words.
3. `corruption`/`cult` are kept, with no crime need in their wordings (0 places). RECOMMEND: keep. To shut the door entirely, `corruption` could fall to D0.
4. At small places, unrest and economic collapse come from RATINGS (`threatProfile.js` step 2: "Civic stability at risk", internal <50; "Economic fragility", economic <40), not from riots. Their wordings are therefore household-sized: "the grown-ups' quarrels", "what the household cannot spare". "Crowds" and "streets" need `populationBand !== 'small'`. RECOMMEND: as written.
5. The join reads "Children are warned about A, and about B." where today has "; ". RECOMMEND: the new join. It reads aloud.

## WHAT MOVES IF THIS IS BUILT (M1 section 4, READ only, not re-run)
- `tests/domain/dailyLife.test.js` regex pins (L113 `/(forager|granary queue|search for food)/`, L126 `/(walls|watch musters|rounds)/`). Of the new wordings, only F0 and F1 match the first, and only W0, W1 and B17 the second, so the pins need re-reading.
- `tests/lint/presumptionClasses.register.json` (L885-895) and `presumedThings.widened.register.json` text rows.
- The edge bundle's `Source hash` (`aiGroundingBundle.freshness.test.js`) moves on any `dailyLife.js` edit.
- No born record moves: the slots are derived at read (M1 table 4).

## UNUSED OR RARE (the chair may cut)
- P0, P12, F3, F5, C0-C2, S0-S1 (merchant-siege), and the famine, bandit, rival, corruption, cult and arcane pools print at 0 of 900.
- N26 prints at 1. P14 and P15 print at 2 each.
- Each is true where it would fire. They are kept so that a branch never empties.

CONFIRMED (executed, `probe.1.out.txt`): the shares, distinct counts, min-eligible counts and 0 false lines by M1's every test, on 900 fresh births; the 0 hideable houses named; 0 "town", 0 brackets; the word counts. The 900 fresh births gave the same numbers as a scratch dump of the same seeds. PLAUSIBLE (judgement, not executed): that each sentence reads well aloud; that the no-home name tests (ATOM-WANTED) are the right readings; that a defence-critical place's "doors", "fields" and "going out together" are what the brief means by "whatever the record can stand behind".
