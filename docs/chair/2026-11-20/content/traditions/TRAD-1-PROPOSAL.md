# TRAD-1 — A DESCRIPTION UNDER EACH TRADITION: THE PROPOSAL

Seat TRAD-1 of the seventh chair, 2026-11-20 (written 06:37 UTC by `date -u`). Branch `lane/trad-2026-11-20`, cut at
`7e0c77ae2` (the tip of `origin/lane/join-2026-11-14`, read back). **A proposal, not a build:** nothing under `src/` is
changed. Every figure below names the output file it came from (`out/`) and the script that wrote it (`tools/`).

**The owner's words (2026-11-20):** "Lastly for the traditions card can you give appropriate descriptions per tradition
that draws from coherently the history, power, economy, institutions, etc?" — and, the same day: "Don't invent drama …
Sometimes a calm place is precisely what's needed … We are not creating the campaign."

## 0. A surprise, told to the chair at once (executed)

**The shared page already shows a different set of traditions than the owner's page.** `genesis.js ::
deriveFoundingTraditions` seeds from `settlement._seed ?? id ?? identity.seed`. `publicSafe.js :: toPublicSafe` strips
`_seed` in every mode (the seed posture, 099/121) and `traditions` (the lit mirror) is not in `PUBLIC_TOPLEVEL_KEYS`. So a
gallery page or a party link (OutputContainer shows the Traditions tab under `playerView`, no gate) re-derives the set from
`id`, a different seed. Measured: **owner set == shared set in 1 of 432 pool towns** (`out/shared.txt`), and in 0 of 20 on
the first probe (`out/probe2-shared-set.txt`, `tools/probe2.mjs`). Not this seat's to fix (the seed posture is the security
lane's; `genesis.js` is not to be edited). The house's own precedent fits: migration 210's `publicProse` ("drawn owner-side
… the seed never travels, only the drawn sentences do") — the owner side would draw the founding set and its descriptions
into the served document as text. That is the security lane's call and, for its SQL twin, the owner's.

Two corrections to the brief: there is no `src/domain/veil/`; the veil lives in `src/domain/display/galleryVeil.js` and
`src/domain/people/cardVeil.js` (`isHideableHouse`, `isVeiledPower`). This seat reads both and edits neither.

## The pool

`tools/trad-pool.mjs <outDir>`: every tier (thorp → metropolis) × every culture (the twelve the golden corpus uses) × six
seeds, random terrain and route, monster threat `civilized`: **432 towns, 72 a tier**. The pool file (77 MB) is not
committed; the script rebuilds it byte for byte. A "printed tradition" is one the Traditions tab prints today: genesis's set
through the tab's own admissibility filter (`TraditionsTab.jsx :: motifNeeds` + `filterDeclared`), spelled again in
`tools/measure.mjs`. **1,232 printed traditions.**

## The measure (CTR8): before and after

**BEFORE** (today's card, `TraditionsTab.jsx :: TraditionRow`): a name, the element chip, "Kept in …". **1,232 of 1,232
carry no keeper, no origin, no payer or president: every one is the short form** (there is no description line at all).

**AFTER** (the prototype, `tools/describe.mjs`; `out/measure-owner.txt`), owner's page:

| | n | keeper: a house (or in play, the owner) | keeper: a power | origin: a cause the record carries | payer: the economy | SHORT FORM (what is done only) |
|---|---|---|---|---|---|---|
| ALL | 1232 | 633 (51.4%) | 489 (39.7%) | 432 (35.1%) | 346 (28.1%) | 92 (7.5%) |
| thorp | 81 | 7 (8.6%) | 56 (69.1%) | 54 (66.7%) | 11 (13.6%) | 10 (12.3%) |
| hamlet | 78 | 4 (5.1%) | 61 (78.2%) | 60 (76.9%) | 5 (6.4%) | 8 (10.3%) |
| village | 112 | 31 (27.7%) | 65 (58.0%) | 60 (53.6%) | 11 (9.8%) | 13 (11.6%) |
| town | 203 | 95 (46.8%) | 90 (44.3%) | 75 (36.9%) | 55 (27.1%) | 17 (8.4%) |
| city | 315 | 195 (61.9%) | 105 (33.3%) | 83 (26.3%) | 122 (38.7%) | 14 (4.4%) |
| metropolis | 443 | 301 (67.9%) | 112 (25.3%) | 100 (22.6%) | 142 (32.1%) | 30 (6.8%) |

Per element (same file): founding 229 (power 100%, cause 96.1%, short 0) · first-landing 148 (power 100%, cause 64.2%) ·
charter 97 (power 100%, cause 74.2%) · hearth 33 (house 57.6%, **short 33.3%**) · harvest 74 (house 89.2%, economy 45.9%) ·
river 42 (house 85.7%, short 9.5%) · stone 62 (house 69.4%, **short 27.4%**) · the-dead 63 (house 100%, cause 71.4%) ·
field 62 (house 67.7%, short 16.1%) · forge 61 (house 100%) · market 82 (house 100%, economy 98.8%) · hunt 49 (house
87.8%, short 12.2%) · long-sun 40 (house 57.5%, **short 32.5%**) · tide 41 (house 100%, economy 97.6%) · greening 86 (house
64.0%, **short 31.4%**) · stars 63 (house 93.7%, short 6.3%). Where an element has no house of its own (hearth, stone,
long-sun, field), the house it names comes from the ACT (an offering's church, a fair's market).

**Sameness.** Distinct whole descriptions: 1,170 of 1,232. The ten most repeated whole descriptions are all short forms;
the most repeated stands 7 times in 432 towns (1.6 in a hundred): "A feast eaten in common that welcomes the year's new
growth." With the town's name masked, the most repeated SHAPE stands 10 times (2.3 in a hundred): "A fair of stalls and
trading that celebrates the market. It is kept at the market squares and falls to the Merchant Guilds. Market taxes are
{town}'s chief income." That is at the edge of "a few in a hundred": **I name it and propose** a third act frame for the fair
and the feast and a third economy frame (both cheap, both inside the closed set), measured again at the build.

## (1) What the record offers, by count on the pool

`out/offers.txt` (`tools/offers.mjs`); counts are TOWNS of 432. Fields read: `institutions[].name`;
`history.founding.{age, foundedBy}`; `history.historicalEvents[].{templateType, name, yearsAgo}`;
`powerStructure.factions[]` and `rulingPower.js :: governingFactionOf`; `economicState.incomeSources[0..2].source`; the
card's `npcs[].institution.{key, title, veiled}` and `npcs[].name`.

| element | a fitting house | a history/founding fact that may carry a cause | a fitting power | a fitting trade (top-3 income) |
|---|---|---|---|---|
| founding | 0 | 432 | 432 (the seat) | 0 |
| first-landing | 0 (the seat keeps it; no house) | 432 | 432 (the seat) | 62 |
| charter | 0 | 432 | 432 (the seat) | 0 |
| hearth | 0 | 0 | 0 | 0 |
| harvest | 305 | 0 | 0 | 216 |
| river | 95 | 0 | 0 | 19 |
| stone | 0 (see §8) | 0 | 0 | 0 |
| the-dead | 432 | 228 (siege, fire, flood or plague) | 316 (religious) | 0 |
| field | 0 (see §8) | 0 | 0 | 216 |
| forge | 192 | 0 | 0 | 52 |
| market | 234 | 0 | 256 (merchant or craft) | 231 |
| hunt | 147 | 0 | 0 | 0 |
| long-sun | 0 | 0 | 0 | 0 |
| tide | 145 | 0 | 0 | 90 |
| greening | 82 | 0 | 0 | 0 |
| stars | 316 | 0 | 316 (religious) | 0 |

(Taken with the final table. The first draft counted a house for stone (the quarry, 105 towns), field (land and grazing,
216) and tide (the fish market and docks, 264); those rows fell on reading their sentences, §8. The founding facts stand in
every town; `foundedBy` is one of 26 authored phrases. The act rows (offering/vigil, fair, contest) are not in this table.)

## (2) The table of what fits what (closed, authored; every row in `tools/describe.mjs`)

**WHAT IS DONE** — the element's gloss (true by the element's own meaning) after the act's lead:
founding "marks the founding" · first-landing "marks the first landing" · charter "honours the charter" · hearth "honours
hearth and household" · harvest "gives thanks for the harvest" · river "honours the river" · stone "honours the standing
stones" · the-dead "remembers the dead" · field "blesses the fields" · forge "honours the forge" · market "celebrates the
market" · hunt "honours the hunt" · long-sun "marks the long days of high summer" · tide "honours the tide" · greening
"welcomes the year's new growth" · stars "is kept under the stars".

**WHO KEEPS IT** — in play, **the record's own owner** (`ownerKind`, `ownerLabel`) and nothing else; in the preview, a house
of a kind that fits, by element first, then by act. A house is a BODY (keeps it) or a PLACE (holds it):
- the-dead: the cathedral, the monasteries, the parish church(es), the resident priest (bodies); a wayside shrine, a burial
  ground, graveyard, cemetery or charnel house (places)
- stars, and the acts offering and vigil: the same religious houses
- greening: the Elder Grove Council, a druid circle (bodies)
- harvest: a granary, a communal root cellar, the mills (places)
- river: the river ferry, a barge company (bodies); the river boatyard (place)
- tide: the harbour master's office, the fishing community (bodies); the fisher's landing (place)
- forge: the blacksmiths, a resident smith, the specialised metalworkers (bodies)
- market, and the act fair: the weekly market, the market square(s), the daily, district or periodic markets (places)
- hunt: the hunter's lodge, a wildfowler (bodies); the furrier's district (place)
- the act contest: the arena (place), a gladiatorial school (body)
- founding, first-landing, charter, and every town's founding core: **no house; the seat** (below)
- hearth, stone, long-sun, field: no house of their own

**The table holds no hideable kind** (criminal, clandestine, subterranean or illegal brokerage: `cardVeil.js ::
isHideableHouse`). No rite is given to a thieves' guild or a smuggling ring: that would be drama the record does not hold.

**WHO PRESIDES** — the person on that house's own card, with the card's own title, read as it stands
(`npcs[].institution.{key, title}`; no title is composed). For a PLACE with no person, a power of the fitting archetype.

**A POWER** — the engine's own owner table (`politics.js :: desiredArchetype`, §6), so a preview and a lit mirror agree in
kind: the founding core and the founding elements → **the seat** (`governingFactionOf`); a devotional act or element, or a
`deityRef` → the strongest religious power; a fair or the market → the strongest merchant or craft power ("its cost is met
by"); a contest → the town's Guard or watch only (never a war party or an armed movement). Every other rite names no power:
politics' fallback (the seat) is not a fit, so it is not drawn. A `hidden` power is never named; a criminal power never on a
reader's page (`isVeiledPower`). The name passes `governanceAccount.js :: powerNameInProse`.

**WHERE IT COMES FROM — the only pairings that may assert a cause:**
1. **The founding core** (the record's index 0, `foundedYear` 1: genesis's singular origin, always founding, first-landing
   or charter) **and the founding the record holds** (`history.founding.age`, `foundedBy`): "It has been kept since X was
   founded by …, N years ago." Why: the core IS the founding rite by genesis's own construction; the age and founders are
   the record's. A founding-kind rite that is NOT the core carries no cause (the record holds no later charter).
2. **A rite of the dead and the most recent siege, fire, flood or plague the record holds** (`templateType` external_threat,
   great_fire, great_flood, plague_years): "It is kept in memory of the Siege, 258 years ago." Why: the chair's own marked
   pairing. The sentence names the event and its year, never who won or what it cost (the record's name does not say).

No other element carries a cause. No history event is set beside a rite it does not cause.

**WHO PAYS — the economy the town lives on** (only where no cause stood): the element's (or the act's) income source, when
it is among the town's three largest (`incomeSources` is sorted by share): harvest and field → the harvest, grain sales,
farm rents; river → river tolls; tide → fish and maritime/preserved produce, port duties; first-landing → port duties, river
tolls; forge → iron and metalwork, coal sales; market and fair → market taxes. "Market taxes are Ormsund's second income." /
"The harvest is Eleftpolis's only income." It states a rank the record holds; it does not say the rite pays or earns it.

## (3) The sentence frames, by act (the closed set the walker will hold)

S1, WHAT IS DONE, "{lead} that {gloss}.": feast "A common feast" / "A feast eaten in common" · procession "A procession" /
"A walking procession" · vigil "A vigil" / "A night's vigil" · contest "A day of contests" / "Contests" · fair "A fair" / "A
fair of stalls and trading" · offering "Offerings" / "A day of offerings". S2, WHO KEEPS IT: "It is kept by {house}[, and
{person}, {title}, presides]." / "Its keeping falls to {house}[; …]." · "It is held at / kept at {place}[, where {person},
{title}, presides | , in the keeping of {power}]." · "It is overseen by / It falls to / It is in the keeping of {power}." ·
"Its cost is met by / It is paid for by {power}." · in play: "It is kept now by / Its keeping falls now to {owner}." S3, a
cause or the economy (above). Each pick is `kernel/proseHash.js :: pickVariant` keyed on the record's id: no draw, no clock.
At most three sentences. The town is named by its own name (never "the town" in a thorp).

## (4) Twenty-four descriptions, as plain text, for the owner

Not chosen by hand: per tier, the printed rites ordered by `fnv1a32(seed|record id)`, the first four (`tools/samples.mjs`,
`out/samples24.txt`). Ten cultures. **One short form of 24** — the pool's 7.5% predicts 1.8: this draw shows one, as drawn.

1. **Baimen** (thorp, east_asian, coastal) — *The Great Offering*: A day of offerings that honours the tide. Its keeping falls to the fishing community; Xia Chen, the boat-headman, presides. Fish and maritime produce is Baimen's second income.
   — house: Fishing community; person: Xia Chen (the boat-headman); incomeSources[1]: Fish & Maritime Produce (11%)
2. **Xingang** (thorp, east_asian, hills) — *The Feast of the Charter*: A feast eaten in common that honours the charter. It is overseen by the Elder Council. Xingang has kept it since its founding by a discharged soldier who liked the view and had nowhere better to be, 129 years ago.
   — founding core; seat: Elder Council; history.founding: age 129, foundedBy
3. **Eleftpolis** (thorp, greek, forest) — *The Harvest Feast*: A feast eaten in common that gives thanks for the harvest. The harvest is Eleftpolis's only income.
   — incomeSources[0]: Harvest (100%)
4. **Eleftpolis** (thorp, greek, forest) — *The Common Vigil*: A vigil that marks the founding. It falls to the Elder Council. It has been kept since Eleftpolis was founded by a discharged soldier who liked the view and had nowhere better to be, 50 years ago.
   — founding core; seat: Elder Council; history.founding: age 50, foundedBy
5. **Collefundus** (hamlet, latin, hills) — *The Procession of the Charter*: A walking procession that honours the charter. It is overseen by the Headman's Authority. Collefundus has kept it since its founding by a household that settled first and found others following it in, 100 years ago.
   — founding core; seat: Headman's Authority; history.founding: age 100, foundedBy
6. **Yekebaliq** (hamlet, steppe, riverside) — *The Great Charter Feast*: A feast eaten in common that honours the charter. It is overseen by the Free Elder Council. Yekebaliq has kept it since its founding by a household that settled first and found others following it in, 62 years ago.
   — founding core; seat: Free Elder Council; history.founding: age 62, foundedBy
7. **Ripaporta** (hamlet, latin, desert) — *The Elder Feast*: A common feast that blesses the fields. The harvest is Ripaporta's only income.
   — incomeSources[0]: Harvest (100%)
8. **Ripaporta** (hamlet, latin, desert) — *The Great Founding Procession*: A walking procession that marks the founding. It is overseen by the Elder Council. Ripaporta has kept it since its founding by a household that settled first and found others following it in, 88 years ago.
   — founding core; seat: Elder Council; history.founding: age 88, foundedBy
9. **Shattmela** (village, arabic, plains) — *The Silk Feast*: A common feast that marks the founding. It falls to the Elder Council. It has been kept since Shattmela was founded by escaped serfs seeking a place beyond the reach of their former masters, 64 years ago.
   — founding core; seat: Elder Council; history.founding: age 64, foundedBy
10. **Neudorf** (village, germanic, plains) — *The Old Hunt Feast*: A common feast that honours the hunt. It is kept by the hunter's lodge, and Radbot Köhler, the master of the hunt, presides.
   — house: Hunter's lodge; person: Radbot Köhler (the master of the hunt)
11. **Neudorf** (village, germanic, plains) — *The Feast of the Founding*: A feast eaten in common that marks the founding. It is overseen by the Elected Reeve. Neudorf has kept it since its founding by a group of settlers seeking new opportunities, 40 years ago.
   — founding core; seat: Elected Reeve; history.founding: age 40, foundedBy
12. **Izamco** (village, mesoamerican, plains) — *The Fair of the Dead*: A fair of stalls and trading that remembers the dead. Its keeping falls to the house of worship; Yaotl Kanil, the priest, presides.
   — house: Parish church (label "House of worship"); person: Yaotl Kanil (the priest). The record holds no siege, fire, flood or plague: no cause.
13. **Ormsund** (town, norse, coastal) — *The Iron Offering*: Offerings that mark the first landing. It falls to the Guild Council. Port duties are the chief of Ormsund's incomes.
   — seat: Guild Council; incomeSources[0]: Port Duties (37%). Not the core: no founding cause.
14. **Bergbrekka** (town, norse, forest) — *The Common Forge Contest*: A day of contests that honours the forge. It is kept by the blacksmiths, and Bodvar Finsson, the master smith, presides.
   — house: Blacksmiths (3-10); person: Bodvar Finsson (the master smith)
15. **Ormsund** (town, norse, coastal) — *The Bright Harvest Fair*: A fair of stalls and trading that gives thanks for the harvest. It is kept at the town granary, where Ranveig Hrafnsson, the granary reeve, presides. Market taxes are Ormsund's second income.
   — house: Town granary (place); person: Ranveig Hrafnsson (the granary reeve); incomeSources[1]: Market Taxes (24%)
16. **Bergbrekka** (town, norse, forest) — *The Great Fair*: A fair of stalls and trading that honours the forge. Its keeping falls to the blacksmiths; Bodvar Finsson, the master smith, presides. Market taxes are Bergbrekka's chief income.
   — house: Blacksmiths (3-10); person: Bodvar Finsson; incomeSources[0]: Market Taxes (36%)
17. **Víkgarde** (city, norse, mountain) — *The Offering of the Stars*: Offerings that are made under the stars. It is kept by the monasteries, and Gorm Illugason, the senior abbot, presides.
   — house: Multiple monasteries; person: Gorm Illugason (the senior abbot)
18. **Saraihiid** (city, steppe, riverside) — *The Old Founding Fair*: A fair that marks the founding. It falls to the Noble Governorship. It has been kept since Saraihiid was founded by a merchant coalition that grew too large for the town they started in, 204 years ago.
   — founding core; seat: Noble Governorship; history.founding: age 204, foundedBy
19. **Ringthwaite** (city, celtic, hills) — *The Green Feast*: A feast eaten in common that celebrates the market. It is kept at the market squares and falls to the Merchant Guild Council. Market taxes are Ringthwaite's chief income.
   — house: Multiple market squares (place); merchantry: Merchant Guild Council; incomeSources[0]: Market Taxes (22%)
20. **Víkgarde** (city, norse, mountain) — *The Vigil of the Forge*: A night's vigil that honours the forge. Its keeping falls to the blacksmiths; Inga Egilsson, the master smith, presides.
   — house: Blacksmiths (3-10); person: Inga Egilsson (the master smith)
21. **Bergstrand** (metropolis, norse, riverside) — *The Common Offering*: A day of offerings that remembers the dead. Its keeping falls to the great cathedral; Þorbjörg Andersson, the bishop, presides. Bergstrand keeps it in memory of the Siege, 258 years ago.
   — house: Great cathedral; person: Þorbjörg Andersson (the bishop); history event: The Siege (external_threat, 258 years ago)
22. **Rajipeth** (metropolis, south_asian, plains) — *The Vigil of the Harvest*: A vigil that gives thanks for the harvest. It is held at the state granary complex, where Kailash Sinha, the master of granaries, presides.
   — house: State granary complex (place); person: Kailash Sinha (the master of granaries)
23. **Bergstrand** (metropolis, norse, riverside) — *The Iron Feast* **[SHORT FORM]**: A common feast that marks the long days of high summer.
   — the motif alone (long-sun · feast): no house, cause or trade fits
24. **Kashipuram** (metropolis, south_asian, hills) — *The Hunt Offering*: A day of offerings that honours the hunt. It is kept at the furrier's district, where Suresh Hazra, the master furrier, presides.
   — house: Furrier's district (place); person: Suresh Hazra (the master furrier)

## (5) What a shared page shows, for three of them

`out/shared3.txt` (`tools/shared3.mjs`). The served document is the party link's own composition:
`projectShareVeil(toPublicSafe(record), writeShareVeil(null, []))` (the default veil; `lib/gallery.js :: sanitizeDossier`).

- **#21 Bergstrand, The Common Offering.** Owner: as above. Composed from the served document: **identical** (the cathedral
  and the bishop's card are public: `institution.veiled === false`; the Siege is in the public `history`). **But today the
  party link does not show this rite at all**: it derives seven others from `id` (The Common Procession, The Procession of
  the Charter, The Bright Stars Fair, …) and would describe those.
- **#15 Ormsund, The Bright Harvest Fair.** Served-document text identical to the owner's; the party link today shows The
  Wolf Feast, The Feast of the Standing Stones and The Charter Offering instead.
- **#2 Xingang, The Feast of the Charter.** Served-document text identical; the party link today shows "The Fair of the
  Charter" (same core element, another act and name).

On the whole pool (`out/shared.txt`): **1,333 descriptions composed for the reader from the served document name nothing
the served document lacks (0)**; the reader audience over the owner's unprojected record (the owner's page in player view)
names nothing the served document lacks either (0 of 1,353). Nothing is dropped between the owner's page and the served
document (keeper 0, person 0), because the table names no hideable house and no veiled card. **The born proof CTR5 asks
("a hideable house that would keep a rite") cannot be born from this table: no hideable house keeps a rite.** I propose the
proof in two arms instead (§7): a PLANTED table row naming a hideable house (red first: the reader drops it, the owner names
it), and a lit mirror whose owner is a criminal seat (a coup, in play: the reader drops it).

## (6) The surfaces that list traditions, and the files I would change

Surfaces found (by symbol): the card `TraditionsTab.jsx :: TraditionRow` (dossier tab, preview and lit); the dossier
search's result card `DossierSearchResults.jsx` (renders `TraditionRow`); the search index `dossierSearch.js` (the
tradition's searchable text); the printed export `pdf/sections/Traditions.jsx` (mirror only, self-gating); the realm strip's
almanac `RealmStrip.jsx` / `almanac.js` (a name and a week only: **no description**, it lists festivals, not rites).
OutputContainer is the only door that knows the audience (`publicDossier = readOnly && !saveId`, `playerView`).

Files (the manifest I would build to, on "BUILD"):
- NEW `src/data/traditionDescriptionTable.js` — the frozen tables and frames (data holds fields; the corpus/genesis split).
- NEW `src/domain/traditions/traditionDescription.js` — `describeTradition(rec, settlement, { audience })`, pure, total.
- `src/components/new/tabs/TraditionsTab.jsx` — one prose line under the calendar line; the tab takes `audience`.
- `src/components/OutputContainer.jsx` — one prop at the traditions case: `audience={publicDossier || playerView ? 'reader' : 'owner'}`.
- `src/components/dossier/DossierSearchResults.jsx` — passes the same audience to `TraditionRow`.
- `src/domain/dossier/dossierSearch.js` — the description joins the tradition's searchable text, composed with the view's audience.
- `src/pdf/sections/Traditions.jsx` — one prose line (the owner's export: `audience: 'owner'`).
- NEW tests: `tests/domain/traditionDescription.test.js` (red-first arms), `tests/lint/traditionDescriptionFrames.walker.test.js`
  (the closed frame set; level words), `tests/security/traditionDescriptionSharedPage.test.js` (my own born test; the only
  file under `tests/security/`); a row in `scripts/mutation-coverage-manifest.json`.
- NOT touched: `genesis.js`, `traditionCorpus.js`, `politics.js`, anything under `supabase/`, `galleryVeil.js`,
  `publicSafe.js`, `cardVeil.js`, `publicProse.js`. No new key on the town; nothing stored.

## (7) What a security reader should attack

1. **The reader audience's two walls.** Wall one is the input (the served document); wall two is the leaf's own fail-closed
   filters (`isHideableHouse`, `isVeiledPower`, a card's `institution.veiled !== false`). Attack wall two with the owner's
   unprojected record under `audience: 'reader'` (the owner's page in player view): does anything slip?
2. **The lit mirror's `ownerLabel`.** It is free text the T-3 politics writes. It travels on a full-mode share (deepClone keeps
   `traditions`). The leaf names it only when the served document's powers or houses hold that exact name and the power is
   not veiled; attack with a coup that makes a criminal power the seat.
3. **Audience wiring.** One wrong prop (the tab defaulting to 'owner') would print the owner's composition on a gallery
   page. The leaf's default must be `'reader'` (fail-closed); the born test renders the tab through PublicDossierView.
4. **The search index.** A description composed for the owner and indexed into a public search would be a second door.
5. **The set divergence (§0)** means the shared page describes rites the owner never saw. Not a leak, but a reader may
   conclude the descriptions are wrong.

## (8) What I would rule differently, and why

1. **Carry the founding set across the share (the §0 fix), before or with this.** Otherwise CTR3 is false at the share
   boundary and the descriptions on a shared page describe rites the owner never chose. Security lane + owner.
2. **Two table rows fell on reading their sentences**, and I'd keep them out: the stone element (the Standing Stones) with
   the stone QUARRY ("It is kept at the stone quarry" joins two things the record never joins: a quarry is not a standing
   stone), and the field element with land and grazing "houses" ("It is kept by the subsistence farming"). Those rites are
   now short where nothing else fits (stone 27.4%, field 16.1%). Also struck on reading: an invented office ("the
   fair-wardens of the annual fairs") and the docks as a keeper.
3. **Trappings stay out.** The record's `expression.trappings` ("tithes carried up the temple steps", "lantern-boats set
   adrift on the water", "the guild ovens working through the night") presume a temple, water and guilds the town may not
   hold; genesis draws them with no declaration. Using them would import unfiltered presumptions. A later lane could
   declare them.
4. **The engine's own owner table vs. the house table.** In play the owner can be a different power than the preview's
   keeper (politics picks among equals by seed; the preview takes the strongest). The description follows the record's
   owner once the mirror exists. Acceptable; it is the record changing, not the description.
5. **CTR5's proof shape** (§5): proposed as a planted row plus a lit coup, since the honest table has nothing to drop.
6. **"Ten most repeated whole descriptions"** are short forms by nature (no town name); the measure that bites is the
   shape with the name masked (2.3 in a hundred at worst): the extra frames in "Sameness" are proposed for that.
