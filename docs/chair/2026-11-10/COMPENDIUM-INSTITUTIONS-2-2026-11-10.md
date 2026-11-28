# COMPENDIUM-INSTITUTIONS-2 — the Institutions page, finished, 2026-11-10

Seat COMPENDIUM-2, a UI seat and child of the chair session session_01FbPLbejcfwX5nii12VM673. Branch
`lane/compendium-institutions-2-2026-11-10` cut from the closed phase-2 tip 13fdafa47 (237c6917c plus the merge of
the predecessor's landing trim d854ad4bb). It was first cut from 237c6917c by mistake, then rebased onto 13fdafa47
before any push, on the chair's correction.

**The owner's words for the page (verbatim):** "the institution page should show ALL institutions with their
native power backing and services and flows into other institutions. The search bar simply ends up as a filter."

## (a) Looked at first

`vite --mode e2e`, Chromium, 1440x900 and the iPhone 13 profile. Pictures are under
`docs/chair/2026-11-10/compendium-institutions/`:

| | desktop 1440 | iPhone 13 |
|---|---|---|
| the top | `desktop-top.webp`: Back, h1, the "Search..." bar, the lead, "282 institutions", five columns of cards | `iphone13-top.webp`: one column |
| a card with every line (Subsistence farming: Size, Priority slider, Backing, Services, Flows into) | `desktop-card.webp`: the first card, already on the top screen | `iphone13-card.webp` |
| the filter typed "inn" | `desktop-inn.webp` | `iphone13-inn.webp` |
| the foot | `desktop-foot.webp` | `iphone13-foot.webp`: the last card (Speaking Stones network), then the footer |

No horizontal scroll at either width (1440 = 1440; 390 = 390).

**What reads badly, in three sentences.** With "inn" typed, the filter breaks cards apart: a card whose title
does not contain "inn" shows only its description (and "Inner fortress" matches on "Inner"), while cards whose
title matches lose their description and every fact line. The cause is the page's in-place filter
(CompendiumPanel.jsx, H8): it narrows inside any element with five or more children, and since H7 added the
fact lines, an institution card has five or more children, so the filter now narrows inside the card and hides
its parts. On desktop the fact lines (12 px since (c)) are a point larger than the card's description, which
inverts the card's emphasis a little; on the phone the description is the larger of the two.

### (a)1 The filter splits cards — fixed, d86ca1860 (the chair ruled: build it)

Measured first, over every section page (jsdom): which elements the filter narrows inside that are ENTRIES
rather than lists.
- Split before the fix: the 282 institution cards, and the band ladders (Economy 5, Stress 6, Magic & Religion
  3). With "poor", Prosperity's "Poor" row showed without its title.
- Tiers and Neighbours do not narrow at all.
- Every other narrowed element is a true list: `#archetypes`, `#calamity`, `#operations`, `#living-world`, `#az`.

The cure: an element marked `data-filter-entry` is never narrowed inside, so it is shown whole or hidden whole.
The institution card and `BandLadder` carry the marker.

**Matching is unchanged.** The page's in-place filter matches a case-insensitive substring against the entry's
WHOLE text. Underneath it, the Institutions tab keeps its own filter over the name, the shown name, the
description, the category and the tags. "Inner fortress" (Citadel) matches "inn"; it is a substring.

Red first, two pins in `tests/ui/compendiumPanel.smoke.test.jsx`:
- Institutions with "inn": every card shown contains the string and has no hidden part; every hidden card lacks
  it; clearing restores all 282.
- Economy with "poor": the Prosperity ladder is shown whole with its title.

Both failed before the cure. The lighting census was re-frozen by its door (9250f02ad): titles 28990 → 28992.
After: `desktop-inn-after.webp` and `iphone13-inn-after.webp`, ten whole cards.

### (a)2 The inverted emphasis — fixed, 91cd87405 (the chair's default form)

The description asks `proseFontSize` for `FS.sm`. It renders 12 px on desktop (it was 11), and 14 px on a phone
as before. The fact lines are 12 px everywhere, told apart by their bold label ink.

The phone floor census: `/compendium` floored 206 → 205, a fall, said in the row's note. No phone size changed.

Pin (red first, inside the existing page test): the Mill's description is at least its first fact line's size.
Before and after, the Shepherd card at 1440x900 (left) and iPhone 13 (right): `card-before.webp`,
`card-after.webp`.

## (b) The facts module moves — 01ef2db68

`src/components/compendium/institutionFacts.js` → `src/domain/compendium/institutionFacts.js`. Its `../../data/`
imports are the same depth, so they are unchanged, and no layer rule refuses them (the domain already reads
`src/data`). Re-pointed: CatalogTabs.jsx, the page's test, and the goods migration roster row in
`src/domain/goods.schema.js`. A new domain file must be strict-clean, so three annotation-only edits went in
(OUTPUTS_BY_NAME typed, the get-or-set without the non-null gap, the services index cast). The
institutionLabelSeam census's allowance for the old path leaves: 5 → 4, a shrink, through its own line.

**Proof, the same bytes:** a jsdom render of the Institutions page gives these values at 237c6917c, at 13fdafa47
and at 01ef2db68 (after the move):
- textContent sha256 `c772c754…e697` (84,919 chars)
- innerHTML sha256 `aa0a740a…b6da`
- 1,260 fact lines

The page's own tests are green.

## (c) The phone floor returns to 206 — 24e12de95

Red first: with the figure at 206, the census fails on "/compendium floored 206 -> 207". The counted element
was FactLine's `proseFontSize(FS.xs, mobile)`. It now takes `FS.sm`, an existing token at or above the floor,
so it needs no floor call. The census reads 206 again.

## (d) The flows join, H7-F — measured; RULED: build nothing

The chair's ruling: option (ii). A chain lists every house that touches it, makers and users alike, so even the
filtered join prints false rows beside true ones, and the page cannot tell them apart. "Flows into" keeps the
GOODS a house's chains output, which the registries do hold. Nothing was built. The measure follows whole,
because it is the brief for the data work that would make the owner's request true.

**The join as measured.** House A processes chain X; an output G of X is a `rawInputs` entry of chain Y; house B
processes Y; A ≠ B and X ≠ Y. A shared chain is not a flow.

**Fields.**

| registry | chains | input | output | houses |
|---|---|---|---|---|
| `SUPPLY_CHAIN_NEEDS` (`src/data/supplyChainData.js`) | 74 | `rawInputs[]`, plus `resource` (a single terrain resource) | `outputs[]` (`intermediateGoods[]` left out) | `processingInstitutions[]` |
| `RESOURCE_CHAINS` (`src/data/resourceChains.js`, re-exported by `src/data/goods/chains.js`) | 23 | `rawResource`, plus `dependsOn[]` | `finalProducts[]` | `processingInstitutions[]` |
| `src/data/supplyChainResourceIndex.js` | — | resource → chain-id indices only (`RESOURCE_TO_CHAINS`, `RETIRED_CHAIN_ALIASES` for chain ids, `REAGENT_CHAIN_SPINE`); no goods vocabulary | — | — |

**Vocabulary.** Matching is by EXACT name. Case-insensitive matching adds 0 edges (3 more self-loops), and adding
`resource` adds 0 edges. No goods alias table exists in the data. `RESOURCE_CHAINS` uses its own lower-case
words ('clothing', 'cloth', 'sails'), which match nothing in the other vocabulary, so it contributes 0 edges.

**Raw join.**
- 364 directed edges, carried by 24 goods.
- Of the 282 institutions: 59 have an outgoing edge, 74 have an incoming edge, 45 have both.

**Nonsense, three kinds.**
1. **Pass-through goods.** 29 (chain, good) pairs where the good is both an input and an output of one chain,
   across 18 chains. They carry 220 of the 364 edges:
   - grain: "Grain surplus", "Agricultural surplus"
   - forage: "Honey and beeswax", "Foraged goods"
   - fishing: "Freshwater catch"
   - river_fishing: "River fish", "Freshwater catch"
   - hunting: "Game meat", "Furs and pelts", "Hunting trophies"
   - animal_husbandry: "Working animals"
   - stone: "Quarried stone", "Building materials"
   - fuel: "Coal", "Peat fuel"
   - clay: "Pottery and ceramics"
   - reed_marsh: "Reeds and thatch", "Peat fuel", "Waterfowl"
   - precious_metals_mining: "Precious metals"
   - petty_mining: "Quarried stone", "Iron ore", "Coal"
   - beekeeping_wax: "Wild honey"
   - silk_luxury_textiles: "Fine textiles"
   - furs_north: "Furs and pelts"
   - magical_goods: "Extraplanar goods"
   - planar: "Extraplanar goods"
   - smuggling: "Contraband goods"
2. **Self-loops.** 155, e.g. Mill → Mill via "Grain surplus" (grain → grain).
3. **Two-cycles.** 63 pairs, mostly through fishing ↔ river_fishing, which feed each other "Freshwater catch"
   and "River fish". Examples: Fisher's landing ↔ Fishmonger / Weekly market / Merchant guilds (3-8).

**Filtered** (pass-through goods dropped): 144 edges; 30 houses with an outgoing edge, 37 with an incoming edge,
13 with both. Five two-cycles remain: Carpenter (part-time)↔Sawmill, Fuller↔Tailor's guild, Dyer↔Fuller,
Dyer↔Tailor's guild, Brickmaker↔Potter.

**Ten samples from the filtered join, read by me:**

| row | reading |
|---|---|
| Sawmill → Barge and river transport company :: Milled lumber | plausible |
| Blacksmith → Town watch :: Quality tools and weapons, Advanced weapons and armor | plausible |
| Mine (open cast) → Town walls :: Building materials | plausible |
| Charcoal burner → Carpenter (part-time) :: Charcoal | false (the timber chain lists charcoal among its raw inputs; a carpenter does not take it) |
| Weavers/Textile workers → Tailor :: Processed textiles | plausible |
| Tailor's guild → Specialized metalworkers :: Fine textiles | false |
| Shepherd → Merchant guilds (15-40) :: Fine textiles | false (the shepherd sits in the textiles chain's house set but makes no fine textile) |
| Hedge wizard → Apothecary :: Alchemical reagents | plausible |
| Fence (word of mouth) → Smuggling waypoint :: Contraband goods | plausible |
| Mill → River boatyard :: Milled lumber | false (the grain "Mill" is in river_milling's house set) |

**25 processing names that are not among the 282:** Boatyard, Adventurers' guild, Cathedral, Monastery, Major
monasteries, Message Network, Alchemist, Theater, Arena, Weavers' guild, Dyers' guild, Fulling mill, Linen
workshop, Vintners' guild, Butcher, Blacksmiths' guild, Coppersmiths' guild, Goldsmiths' guild, Carpenters'
guild, Stonemasons' guild, Leatherworkers' guild, Salters' guild, Jewelers' guild, Artisan workshop, Leather
tanner. Most of them are `RESOURCE_CHAINS`' guild names.

**What the data would need for a truthful join (a finding, not a design).** Every chain records its houses as
one unordered set, `processingInstitutions`, so a chain cannot say which of its houses MAKE an output and which
merely USE or SELL it. Mill, Maltster and the external mill sit beside each other the same way the Shepherd
sits beside the weavers. A truthful house-to-house flow needs, for each chain, the houses that PRODUCE each
output and the houses that CONSUME each input: a stage order (raw → intermediate → output, each stage with its
houses), not a set. It also needs the two goods vocabularies (`SUPPLY_CHAIN_NEEDS`' capitalised goods and
`RESOURCE_CHAINS`' lower-case products) joined by a table that lives in the data, and the 25 processing names
above reconciled with the catalogue. Until then, the only flow the registries state is house → goods.

## (e) The landing trim

No commit. 13fdafa47, the tip the chair named for the `--no-ff` merge, is this lane's base, so it is already in the history and a merge would be a no-op. The trim was done by the predecessor: `lane/compendium-landing-trim-2026-11-10` at d854ad4bb, merged into the
phase-2 branch at 13fdafa47, which is this lane's base. This seat's duplicate trim,
`lane/compendium-landing-trim-2-2026-11-10` at e3bdb24f8, is NOT merged, by the chair's ruling; it is left as it
is. It independently confirms the predecessor's figures: red-first count 4, and the first tile row at 388 px on
the phone and 442 px at 1440. Its two pictures are copied here as the landing's before and after, since the
predecessor's record has none: `docs/chair/2026-11-10/compendium-institutions/landing-before.webp` and
`landing-after.webp` (desktop left, iPhone 13 right).

## (f) Render cost, phone profile

iPhone 13 emulation, `vite --mode e2e`, warm. Measured from the tile's click to all 282 cards in the DOM, nine
runs each, median of runs 2–9, two rounds alternating with the phase-2 tip in the same container:

| | CPU ×1 | CPU ×4 |
|---|---|---|
| phase-2 tip 237c6917c | 179 / 193 ms | 915 / 1,069 ms |
| after (b)+(c) | 190 / 236 ms | 1,077 / 991 ms |

The spread within a round is wider than the gap between the tips (×4 runs range 821–1,382 ms). (b) and (c)
change no rendered byte apart from the fact line's size. Phase 2's own record has 239 / 906 ms.

## (g) H11, the first-run coach — corrected from the phase-2 record

The phase-2 record (`COMPENDIUM-INSTITUTIONS-2026-11-10.md`, left unedited) describes H11 as a STOP with three
options. That is superseded: the chair WITHDREW H11. The corner card is the owner's own word of 2026-10-30 ("a
relatively small floating and movable pop-up … at the corner of the window", in `PostGenCoach.jsx`). Nothing
was built, and the folded-open option is offered to the owner.

## Commits and gates

Seven commits on 13fdafa47:
- 01ef2db68 (b)
- 24e12de95 (c)
- d86ca1860 (a)1
- 9250f02ad, the lighting register
- 91cd87405 (a)2
- 23398b82c, the wiring census's stamp: `producerIndexFiles` 1316 → 1317, from the move into src/domain. The
  census's own writer re-took it; 0 rows and 0 bytes of rows moved; `--check` verifies.
- this record, with the roster `dated` 218 → 219 through the Edit tool

| gate | result |
|---|---|
| the sweep `tests/lint tests/scripts tests/components tests/ui` | 759 files. One lane red was cured (proseWiringCensus, by 23398b82c). Every remaining red is red at the base 13fdafa47, run in a base worktree: publicProseEquality 2, proseFamilyContract 3, newsHeadlineContract 2, dossierPhoneFloorAllViews 2, readerValidationOnPage 1, domainAnyCastBaseline 1, heraldForecast 1, ledgerCitationIntegrity and provenanceMap (0-test load errors). observedShapeReaders reads 4 here against 5 at the base: the move shrinks the UI cohort, as intended. |
| Chromium `e2e/arrow-header`, `e2e/pinned-footer`, `e2e/phone-horizontal-overflow` (`--trace off`, the repo's config through a scratch wrapper that changes only `executablePath`) | 90 passed, 4 skipped. The WebKit project has no build here, so it was not run. |
| `npm run typecheck:ratchet` | `src/lib/compendiumSections.js` +1, the same at the base; it is cured on the integration line and left for the merge, as ruled |
| `npm run typecheck:domain:strict` | 24 rows, the same as the base; the moved file has none |
| eslint over every changed source file | 0 |

## CONFIRMED against PLAUSIBLE

- CONFIRMED (executed): the byte equality in (b) on both bases; the join's counts in (d), from a script over the
  registries; the census red then green in (c); the filter's card-splitting
  in (a), seen in the screenshots and read from the filter's own code.
- PLAUSIBLE: the plausible/false reading of the ten samples is mine, from the names. The render figures are a wash. This is read from overlapping noise bands, not from a significance
  test.

## What stays

- `typecheck:ratchet` reads `src/lib/compendiumSections.js` +1 at this lane's base 13fdafa47. That is the
  phase-1 row the integration line has already cured; it is left for the merge, as the chair ruled.
- The data work in (d)'s last paragraph, if the owner wants house-to-house flows.
