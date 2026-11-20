# PLACE-1 MEASURE — `economicState.activeChains[].entrepotNote` (the chain cards' entrepôt note)

Measured 2026-11-20 at d4e30cfec by a MEASURE builder for PLACE-1, under `BRIEF-MEASURE-COMMON.md` and
`BRIEF-MEASURE-entrepotNote.md`. No file under `src/` or `tests/` was changed.

Every figure below is re-runnable from `docs/chair/2026-11-20/content/place/tools/entrepotNote/`. Run each from that directory, except where a command says the repository root.

| script | what it makes | output (committed) |
|---|---|---|
| `find-seeds.mjs <repo>` (repo root) | section 0, step 1: which calm r2 towns and cities hold a note the tab's gate would print | `out/find-seeds.txt` |
| `prove-prints.mjs <repo> <views>` (after the two renders of section 0) | section 0: each held note, and every rendered surface that carries it, DM and player | `out/prove-prints.dm.txt`, `out/prove-prints.player.txt` |
| `measure.mjs <repo> 100 plain` and `measure.mjs <repo> 100 capture` (repo root) | the 600 births. The chair's census birth line and mask are copied verbatim, as `../situationDesc/measure.mjs` copies them. `capture` adds what the writer had in scope (`capture-hooks.mjs` wraps `computeActiveChains` in memory) and the chains after each economy step. | JSON to scratch (1 MB and 2.8 MB, not committed) |
| `analyze.mjs <rows-plain> <rows-capture>` | sections A and C | `out/analyze.txt` |
| `project.mjs <repo> <rows-plain> [carrier]` | section E: the candidate composer (`composer.mjs`, section D's rows exactly) on the same births. `carrier` drops the rows that need the proposed atom. | `out/project.txt`, `out/project-nocarrier.txt` |
| `pins.mjs <repo>` | section F: what the composer would store in the pinned test town and in section 0's towns | `out/pins.txt` |

The instrument moves nothing. All 600 births are identical, chain by chain (note, gate, status, outputs), with and without the capture hook (`out/analyze.txt`, INSTRUMENT). The held figures also reproduce the chair's before line exactly (`tools/census/fields-before-100.txt`: hamlet 8/12, village 13/22, town 31/47, city 81/89, metropolis 76/86). The census lists no thorp row because it holds fewer than 5 holders.

---

## 0. THE FIELD PRINTS (the chair's rule of 16:25 UTC)

**Yes. It prints on the Systems group › Economics tab, in the "Economic Flows" chain cards (`EconomicsTab.jsx :: EconomicFlowsSection`). The note is the italic line under a card, in BOTH the DM view and the player view. It prints only where the card's own gate passes: `chain.entrepot && chain.entrepotNote && !chain.dependency`.**

Commands, from the repository root. The places are born fresh by the census's own `configOf`, rendered through the real `OutputContainer`, and walked by the page census's `walkDossier`:

    node docs/chair/2026-11-20/content/tools/confinement/run.mjs <repo> <dm> render --workers=2 --seeds=r2r-town-3,r2r-city-2
    node docs/chair/2026-11-20/content/place/tools/safetyDesc/render-player.mjs <repo> <pl> r2r-town-3,r2r-city-2
    (cd docs/chair/2026-11-20/content/place/tools/entrepotNote && node prove-prints.mjs <repo> <dm>/views > out/prove-prints.dm.txt && node prove-prints.mjs <repo> <pl>/views > out/prove-prints.player.txt)

The two towns were chosen by `find-seeds.mjs`: the first calm town and city whose cards pass the gate on more than one chain.

- **r2r-town-3 (river).** `salt` and `spices_dyes` are held and gated through. Both whole notes print on `Systems/Economics` and on no other surface, in both views. The DM view walked 23 surfaces and the player view walked 20.
- **r2r-city-2 (port).** It holds six notes. `salt`, `magical_goods` and `furs_north` print on `Systems/Economics` in both views. `luxury_goods`, `spices_dyes` and `silk_luxury_textiles` carry a `dependency`, and they print on **NONE** of the walked surfaces in either view.

So the gate is the print, and HELD and PRINTED differ. On the tab, a held note on a dependency chain never prints. The chair's top city sentence ("Luxury goods are the primary cargo…", 81 of 100 cities) is held in 81 cities but printed on the tab in only 38 (section A).

**A second printer the page walk does not reach: the PDF.** `src/pdf/sections/Services.jsx :: ChainCard` prints `chain.externalMillNote || chain.entrepotNote` under every chain card, with NO entrepôt or dependency gate. In the PDF, every HELD note prints, the luxury note in 81 cities among them. So this measure keeps both readings, HELD (the census's and the PDF's) and PRINTED (the tab's), and the bar is applied to both.

---

## A. THE BRANCHES

**The writer.** The text is one fixed literal per chain, in `src/data/supplyChainData.js :: SUPPLY_CHAIN_NEEDS` (re-exported by `src/data/goods/chains.js`). `src/generators/computeActiveChains.js :: computeActiveChains` copies it onto every chain it pushes (`entrepotNote: chain.entrepotNote || null`). It has no `resolveSibling` twin and no branch inside a chain.

**The branches.** A "branch" is a chain, and its condition is the chain running at all: the tier gate, a processing house matched, and the chain's resource present or substituted, or an entrepôt route. An entrepôt-only chain (`entrepot && !resource`) runs only on a crossroads, port or river route, or for an arcane chain through magical transit. Eleven chains carry a note:

| chain (need) | when it holds the note | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|---|
| `furs_north` (trade_entrepot; hunting grounds) | its processor stands, and the hunting grounds are its own or the route is an entrepôt route; hamlet and up | 0/0 | 8/8 | 5/5 | 12/12 | 54/54 | **76/76** |
| `luxury_goods` (manufacturing; precious metal veins) | its processor stands; city and up | 0/0 | 0/0 | 0/0 | 0/0 | **81**/38 | 69/17 |
| `magical_goods` (arcane_magical; ley line node) | its processor stands, and it has its node or magical transit; town and up | 0/0 | 0/0 | 0/0 | 3/0 | 46/25 | 50/2 |
| `salt` (food_security; salt flats) | its processor stands, and it has its own flats or an entrepôt route; hamlet and up | 0/0 | 3/3 | 13/13 | 17/17 | 30/30 | 22/22 |
| `silk_luxury_textiles` (trade_entrepot; none) | entrepôt route and processor; city and up | 0/0 | 0/0 | 0/0 | 0/0 | 64/32 | 48/1 |
| `smuggling` (criminal_economy; none) | entrepôt route and a smuggling house; thorp and up | 3/3 | 2/2 | 1/1 | 4/4 | 39/39 | 44/44 |
| `spices_dyes` (trade_entrepot; none) | entrepôt route and processor; town and up | 0/0 | 0/0 | 0/0 | **31/31** | 64/32 | 48/6 |
| `transit_finance` (trade_entrepot; none) | entrepôt route and processor; town and up | 0/0 | 0/0 | 0/0 | 1/0 | 47/0 | 48/0 |
| `warehouse_logistics` (trade_entrepot; none) | entrepôt route and processor; town and up | 0/0 | 0/0 | 0/0 | 11/11 | 36/15 | 27/27 |
| `wine_spirits` (trade_entrepot; none) | entrepôt route and processor; village and up | 0/0 | 0/0 | 5/5 | 11/11 | 44/44 | 48/48 |
| `planar` (none; metropolis) | never born in the 600 | 0 | 0 | 0 | 0 | 0 | 0 |

Each cell is places of 100 that HOLD / PRINT the chain's note (`out/analyze.txt`, PER CHAIN). A held note goes unprinted only because of a `dependency`, never because `entrepot` is false. The unprinted notes of the 600 births are: transit_finance 96 (every one), luxury_goods 95, silk 79, spices 74, magical 72, warehouse 21.

**Top sentence by size (`out/analyze.txt`, BEFORE).** A place holds 5.7 notes in a city and 5.6 in a metropolis, and prints 3.6 and 3.0.

| size | HELD: top / 100 (of holders) | the top note | PRINTED: top / 100 (of printers) | the top printed note |
|---|---|---|---|---|
| thorp | 3 (3) | smuggling | 3 (3) | smuggling |
| hamlet | 8 (12) | furs | 8 (12) | furs |
| village | 13 (22) | salt | 13 (22) | salt |
| town | 31 (47) | spices | 31 (47) | spices |
| city | **81** (89) | luxury | **54** (87) | furs |
| metropolis | **76** (86) | furs | **76** (81) | furs |

Town, city and metropolis are far over the bar on both readings. Village is near it (13).

---

## B. THE READERS

**(i) Who PRINTS it.**
- `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` prints the note under the gate `chain.entrepot && chain.entrepotNote && !chain.dependency`. It also reads its truthiness for one margin (`marginBottom: needLine||chain.entrepotNote||…`). It reads the field, not the words, so any non-empty text prints as the old one did. The cards are built through `chainStateShown.js :: chainAsShown` and `chainCardUnderSiege`; neither writes the note. Section 0 found the gate equal to the rendered surface on all 8 held notes.
- `src/pdf/sections/Services.jsx :: ChainCard` prints `chain.externalMillNote || chain.entrepotNote` ungated. It also reads the field, not the words.
- Nothing else in `src/` prints it: no summary, no dossier line, no quick guide (`grep entrepotNote src`).

**(ii) Who MATCHES ITS WORDS.**
- `tests/generators/bar3PlacesRows.test.js`, row `C14378 no northern furs` on `r2r-city-0`, asserts `/Furs travel from the hunting grounds through trading posts/` against the whole record (`textOfRecord`). **This pin moves**: under the candidate composer r2r-city-0's furs note becomes `furs-own` (`out/pins.txt`). It is the only test file that pins a literal of the field.
- `tests/lint/presumedThings.widened.register.json` banks two canonical literals under `src/data/supplyChainData.js`: smuggling's and furs'. They stay where they are, because `supplyChainData.js` keeps its canonical notes (section F). The new rows live in a new file and declare their needs, so they add no register row.
- No regex, coherence arm, band table or state prose in `src/` reads the note's words. I searched for each canonical note's distinctive words ("markup", "redistribution", "trading posts", "long-distance trade", "run in the dark", "vineyard regions", "magical nodes", "onward transport"); the only hits are the data file itself and unrelated uses of "markup".
- `src/data/dossierStateProse/economy.generated.js` (DS-ECO-5) names the field in a section title only. Its "ENTREPÔT" pool composes from slots (`{settlement}`, `{good}`), not from the note.
- `docs/DESIGN_POOL_CENSUS.md` row 58 counts `SUPPLY_CHAIN_NEEDS (desc/label/entrepotNote)` as a GEN table (a doc, not a gate).

**(iii) Who COMPOSES FROM IT, or rewrites it.**
- Nothing quotes the note into another string. `src/domain/facts/supplyStory.js` cites the furs note in a comment only.
- **A world-pulse writer that would undo a variant:** `src/domain/worldPulse/resourceDynamicsKernel.js` recomputes `computeActiveChains` on a resource transition. It merges each surviving chain as `{ ...chain, ...recomputed }`, which overwrites a stored `entrepotNote` with the recomputed canonical. A born variant would then turn back into the canonical note on that town's first resource transition (section F, item 4; G2). `calamityKernel.js` only filters chains, and `institutionLifecycle.js :: deriveLifecycleChains` derives chains for decisions and stores none, so neither touches the text.
- Baselines that name the field's shape, not its words: `scripts/.observed-shape-readers-baseline.json` ("entrepotNote on chains": 1) and `scripts/.writer-reach-baseline.json` ("entrepotNote on activeChains": "dossier-pdf=N web-display=N"). A new writer of the field may move the writer-reach walker (`tests/lint/writerReach.walker.test.js`). A builder runs it.

---

## C. THE FACTS AT HAND

All the facts below are read off the FINAL record, and each is compared with what the proposed call site would see (`out/analyze.txt`, WRITER, STEPS, AT).

| fact | home | reads the final record | in scope at the writer `computeActiveChains` | at `economyReconcilePass` = final |
|---|---|---|---|---|
| the place's route (port / river / crossroads / road) | `facts/terrain.js :: tradeRouteOf` (atom `route: <kind>`) | yes | yes: it is handed `tradeRoute`, equal to the final in 600 of 600 | 600 of 600 |
| the chain's carrier: own ground or carried through | `facts/chainCarrier.js :: chainCarrierOf(chain, record)` | yes (it reads the chain and `config.nearbyResources`) | the chain only; the writer has no `config` | 600 of 600 (every noted chain) |
| a market | `facts/market.js` through `factsOf` (atom `market`) | yes | no | 600 of 600 |
| a tavern or a bank | `factsOf(record).hasInstitution` (atom `institution: tavern` / `bank`) | yes | the roster, not as a fact | 600 of 600 |
| the chain's own outputs and subject | the chain record (`outputs`, `label`) | yes | yes: equal in 600 of 600 | 600 of 600 |
| goods passing through | `economicState.transit` | yes | no | non-empty in only 81 of the 252 places that print a note; not used |
| the chain's good on the export list | `facts/goodExported.js` (atom `exported: <key>`; keys cloth, flour, hides, ale, arms only) | yes | no | a chain output is on the export list for 140 of 678 printed notes; not used (G4) |

**Carrier, by chain, over all 600 births (held notes).** furs own 48 / transit 107. salt own 26 / transit 59. luxury own 23 / transit 127. magical own 10 / transit 89. Every chain with no resource reads `none`: its goods are carried through by its definition (`isEntrepotOnly`). So "the place's own ground" and "carried through" are both facts the record holds for the four resource chains, and the bar needs them in the metropolis (section E).

**Does a later pass move the chains?**
- `computeActiveChains` runs once in 499 births and twice in 101; the second call is `economyReconcilePass` re-deriving the economy on the final roster.
- The last call's noted chains (id, note, outputs, gate) equal the final record in 600 of 600.
- After `generateEconomy` they equal it in 590; after `economyReconcilePass`, `generateNarratives` and `assembleSettlement`, in 600 of 600.
- No later pass appends or drops a noted chain, or changes a dependency.

**The seed.**
- `computeActiveChains` is handed no config and no seed (0 of 600). Its four callers are `economicState.js`, `institutionLifecycle.js`, and `resourceDynamicsKernel.js` twice.
- `config._seed` is absent at `generateEconomicState`: 0 of 600, the situationDesc measure's finding.
- `ctx._seed` is a non-empty string in the `generateEconomy` and `economyReconcilePass` steps (600 of 600). `economyReconcilePass` already hands it on (`generateAvailableServices(…, { prosperity, seed: ctx._seed })`).

**The key form `pickVariant` callers use:**
- `narrativeGenerator.js :: generateSettlementReason` uses `` `${seed}::settlement-tier-line::${tier}` ``.
- `settlementQuickGuide.js :: cultureScopeLine` uses `` `${seed}::culture-scope-line` ``.
- `steps/assembleInstitutions.js :: shipFreeDesc` uses `` `${seed}:${inst.name}` ``.

The proposal's key is **`` `${seed}::entrepotNote::${chainId}` ``**: one draw a chain, so two chains of one place draw independently.

---

## D. THE CANDIDATE WORDINGS (every chain: town, city and metropolis are over the bar, and one chain's note is one branch)

These are the house idioms followed:
- Declared rows `{ id, text, needs }`, the shape `drawDeclared.js` reads.
- One draw door, `drawDeclared(pool, { facts, draw: (p) => pickVariant(p, key), key, poolId, … })`. It adds no roll. A refused draw resolves by the house's argmax over `hashKey(key::lineId)`, and the key carries the seed, so the resolution spreads too.
- Atoms from `factVocabulary.js :: FACT_DIMENSIONS` only: `route: <kind>`, `market` and `institution: tavern|bank`. There is one exception, the proposed chain-scoped `carrier: own|transit` (G1).

**Row 0 of every pool is the chain's canonical note.** It is read from the chain record at compose time, so it is never duplicated, and it has no needs. This follows CANONICAL-AT-ZERO (`kernel/proseHash.js`): a falsy seed keeps the canonical note.

The register is the canonical note's: one or two plain sentences of about 60 to 120 characters, an economic remark and nothing more. No row names a trouble, a person the record lacks, a season or a count. The subject (salt, furs, wine and so on) is the chain's own, as the canonical note names it and as the card's title already does. A row that names the route declares it. A row that says the ground is (or is not) the place's own declares `carrier`.

The full table, exactly as the projection runs it (`tools/entrepotNote/composer.mjs :: ENTREPOT_NOTES`):

**salt** (row 0: the canonical note, no needs)

- `salt-port` [route: port]: Salt comes in by sea and goes on inland from here, and the place keeps a share of every load.
- `salt-river` [route: river]: Salt moves up and down the river, and some of every load is sold off here.
- `salt-crossroads` [route: crossroads]: Salt comes in on one road and leaves on another, and the place takes its cut between.
- `salt-road` [route: road]: Salt comes in by road and is sold on from here to the places further along.
- `salt-own` [carrier: own]: Much of the salt sold here is its own, taken from the salt flats nearby.
- `salt-own-keep` [carrier: own]: The salt flats nearby supply the salt, and most of it goes into preserving food.
- `salt-transit` [carrier: transit]: No salt is taken here; it is brought in, and sold on or used to preserve food.
- `salt-wanted` [—]: Salt is wanted everywhere, and a share of the trade in it passes through here.
- `salt-bought` [—]: Salt is bought and sold here in quantity, for preserving food and for selling on.

**furs_north** (row 0: the canonical note, no needs)

- `furs-port` [route: port]: Furs are gathered here from inland and shipped on by sea.
- `furs-river` [route: river]: Furs come down the river in bales and change hands here before going on.
- `furs-crossroads` [route: crossroads]: Furs from several directions meet here, where the roads cross, and are sold on.
- `furs-road` [route: road]: Furs come in along the road and change hands here before going on.
- `furs-own` [carrier: own]: Many of the furs sold here are taken on its own hunting grounds.
- `furs-own-rest` [carrier: own]: Furs and pelts come off the hunting grounds nearby, and what is not used here is traded on.
- `furs-transit` [carrier: transit]: None of these furs are taken here; they come from the hunting grounds and are traded on.
- `furs-through` [carrier: transit]: Furs pass through here on their way to buyers elsewhere, and the place takes a share of the trade.
- `furs-steady` [—]: The fur trade is steady here, in pelts and the leather made from them.
- `furs-regular` [—]: Furs and pelts are a regular part of the trade here.

**luxury_goods** (row 0: the canonical note, no needs)

- `lux-port` [route: port]: Fine goods arrive by sea, and are sold here and inland at a good markup.
- `lux-river` [route: river]: Fine goods come up the river to be sold here, and the markup on them is high.
- `lux-crossroads` [route: crossroads]: Fine goods from several directions meet here where the roads cross, and are sold on at a markup.
- `lux-road` [route: road]: Fine goods come in by road from far away, and are sold here at a good markup.
- `lux-own` [carrier: own]: The precious metal of the veins nearby is worked here into jewellery and fine metalwork.
- `lux-transit` [carrier: transit]: Little of the luxury trade here starts here: fine goods are brought in and sold on at a markup.
- `lux-value` [—]: Fine goods are a small trade by weight but a large one by value, and some of it passes through here.
- `lux-far` [—]: Luxury goods are carried far, and part of what they earn on the way is earned here.
- `lux-kinds` [—]: The luxury trade here is in fine metalwork, jewellery and other costly goods.
- `lux-price` [—]: Costly goods travel long distances, and every place they pass through adds to the price.
- `lux-market` [market]: Costly goods, jewellery and fine metalwork among them, are sold in the market here.

**spices_dyes** (row 0: the canonical note, no needs)

- `spice-port` [route: port]: Spices and dyes come in by sea from distant lands, and are sold on inland from here.
- `spice-river` [route: river]: Spices and dyes come up the river from distant lands, and are sold on from here at a markup.
- `spice-crossroads` [route: crossroads]: Spices and dyes from distant lands reach the crossing roads here and are sold on in every direction.
- `spice-road` [route: road]: Spices and dyes come in along the road from far away and are sold on at a markup.
- `spice-far` [—]: Nothing in this trade is grown here: the spices and dyes come from far away and pass on at a profit.
- `spice-light` [—]: Spices and dyes are light, costly and carried far, and part of their price is added here.
- `spice-others` [—]: The spice and dye trade here is a trade in other places' goods, bought in and sold on.
- `spice-bulk` [—]: Spices and dyes are a small trade here by bulk, and a profitable one.
- `spice-market` [market]: Spices and dyes from far away are sold in the market here, and some are carried on.

**silk_luxury_textiles** (row 0: the canonical note, no needs)

- `silk-port` [route: port]: Silk arrives by sea, and from here it is carried inland to be sold.
- `silk-river` [route: river]: Silk comes up the river to be sold here, or carried further on.
- `silk-crossroads` [route: crossroads]: Silk reaches the crossing roads here and is sent on inland in several directions.
- `silk-road` [route: road]: Silk comes in by road from far away, and is sold here or carried on.
- `silk-none` [—]: No silk is made here; it is brought from far away, and fine cloth is sold on from here.
- `silk-long` [—]: Silk is carried a long way to reach this place, and it is sold on at a good price.
- `silk-trade` [—]: The silk trade here is a trade in fine cloth bought from far away and sold on.
- `silk-market` [market]: Silk and other fine cloth from far away are sold in the market here.
- `silk-steady` [—]: Fine cloth from far away is a steady trade here, most of it silk.
- `silk-bales` [—]: Bales of silk are bought here from those who have carried them far, and sold on.

**wine_spirits** (row 0: the canonical note, no needs)

- `wine-port` [route: port]: Wine comes in by sea in casks, and is sold here or carried on inland.
- `wine-river` [route: river]: Wine comes down the river in casks, and is sold here and further on.
- `wine-crossroads` [route: crossroads]: Wine from more than one region meets here where the roads cross, and is sold on.
- `wine-road` [route: road]: Wine comes in by road from far away, and is sold here and further on.
- `wine-cask` [—]: Wine is bought in by the cask here, and much of it is sold on.
- `wine-through` [—]: The wine trade passes through here; casks are bought in, stored and sold on.
- `wine-few` [—]: Wine is drunk everywhere and made in few places, and some of the trade between them runs through here.
- `wine-tavern` [institution: tavern]: Some of the wine coming through is drunk in the taverns here; the rest is sold on.

**smuggling** (row 0: the canonical note, no needs)

- `smug-port` [route: port]: Some cargo comes ashore here without being declared, and is sold on quietly.
- `smug-river` [route: river]: Some goods come and go on the river without being declared, and are sold quietly here.
- `smug-crossroads` [route: crossroads]: Some goods pass through the crossing roads here undeclared and untaxed.
- `smug-road` [route: road]: Some goods come in by road undeclared, and are sold on quietly.
- `smug-loads` [—]: Not every load that passes through here is declared, and some goods are sold where no tax is paid.
- `smug-quiet` [—]: Alongside the honest trade runs a quieter one, in goods that pay no tax.
- `smug-duty` [—]: Some of the trade here is smuggled: goods that pay no duty, moved by people who keep quiet about it.

**magical_goods** (row 0: the canonical note, no needs)

- `magic-port` [route: port]: Enchanted goods come in by sea and are sold here at a high price.
- `magic-river` [route: river]: Enchanted goods come up the river and are sold here at a high price.
- `magic-crossroads` [route: crossroads]: Enchanted goods from several directions meet here where the roads cross, and fetch a high price.
- `magic-road` [route: road]: Enchanted goods come in by road and are sold here at a high price.
- `magic-own` [carrier: own]: Enchanted goods are made here near the ley line node, and sold on to buyers elsewhere.
- `magic-transit` [carrier: transit]: Most enchanted goods sold here are brought in from elsewhere, at a high price.
- `magic-weight` [—]: Enchanted goods are worth a great deal for their weight, and some of that trade is done here.
- `magic-small` [—]: The trade in enchanted goods is small but valuable, and buyers come here for it.
- `magic-hands` [—]: Enchanted goods change hands here at high prices.

**transit_finance** (row 0: the canonical note, no needs)

- `fin-port` [route: port]: Merchants landing cargo here settle their accounts and borrow against it before moving on.
- `fin-river` [route: river]: River traders settle their accounts here and borrow against their cargo.
- `fin-crossroads` [route: crossroads]: Traders meeting at the crossing roads here settle accounts and borrow against their loads.
- `fin-road` [route: road]: Traders on the road settle their accounts here and borrow against their loads.
- `fin-bank` [institution: bank]: The bank here lends to traders and changes their money, and earns from trade it does not carry.
- `fin-lend` [—]: Lending and money-changing here earn from the trade that passes through.
- `fin-credit` [—]: Large loads need credit, and the lending here grows with the trade passing through.
- `fin-settle` [—]: Traders passing through borrow, settle and change money here, and that business pays.

**warehouse_logistics** (row 0: the canonical note, no needs)

- `store-port` [route: port]: Cargo landed from the sea is stored here and sent on, for a fee.
- `store-river` [route: river]: Cargo is unloaded from the river here, stored and sent on, and the place is paid for the handling.
- `store-crossroads` [route: crossroads]: Loads coming in on one road are stored here and sent out on another, for a fee.
- `store-road` [route: road]: Loads are stored here and sent on along the road, for a fee.
- `store-others` [—]: Much of the work here is storing other people's goods and loading them for the next leg.
- `store-handling` [—]: Goods are stored, loaded and sent on from here; the earnings are in the handling.
- `store-little` [—]: The place makes little of what it handles; it is paid to store and move it.

`planar` takes no pool: it was born in none of the 600 places, so it keeps its canonical note.

Four rows were reworded before the final projection so that no row names a ground it does not declare (`furs-road`, `furs-crossroads`, `lux-road`, `wine-road`). They no longer say "from the hunting grounds", "distant workshops" or "vineyard country"; each now says "from far away" or "from several directions".

---

## E. THE PROJECTION

The candidate composer runs on the same 600 births, masked as the census masks. No stored note and no candidate row holds a name or a digit, so the mask changes nothing.

The draw is simulated exactly as the house does it: `fnv1a32(key) % pool.length` over the whole pool, then the `hashKey(key::id)` argmax over the admitted rows (`out/project.txt`: 708 drawn, 407 resolved by argmax).

**Top share by size: places of 100 holding the commonest note, before -> after.**

| size | HELD (census and PDF) | PRINTED (the tab) |
|---|---|---|
| thorp | 3 -> 1 | 3 -> 1 |
| hamlet | 8 -> 3 | 8 -> 3 |
| village | 13 -> 4 | 13 -> 4 |
| town | 31 -> 7 | 31 -> 7 |
| city | 81 -> 12 | 54 -> 11 |
| metropolis | 76 -> 13 | 76 -> 13 |

**The ten commonest after-sentences in the worst size (HELD, metropolis, 13 of 100):**

    13  The fur trade is steady here, in pelts and the leather made from them.
    11  None of these furs are taken here; they come from the hunting grounds and are traded on.
    11  Most enchanted goods sold here are brought in from elsewhere, at a high price.
    11  Furs and pelts are a regular part of the trade here.
    11  Large loads need credit, and the lending here grows with the trade passing through.
    11  Luxury goods are carried far, and part of what they earn on the way is earned here.
    11  The trade in enchanted goods is small but valuable, and buyers come here for it.
    11  Smuggling is the entrepôt trade run in the dark. Goods that cannot be taxed or declared flow through criminal networks.
    11  Wine is bought in by the cask here, and much of it is sold on.
    11  Wine is produced in specific vineyard regions and consumed everywhere. Port and river settlements profit from redistribution.

**No size stays above the bar, but only WITH the `carrier` atom.** Without it (`out/project-nocarrier.txt`, the rows that need `carrier` dropped):
- The metropolis stays at **24** held and 24 printed. "Furs and pelts are a regular part of the trade here." is the commonest note.
- The city reaches 18 held and 15 printed.

The metropolis holds furs in 76 of 100, and only the route rows split them. Without the own-ground and carried-through rows, a refused route row falls back on the three rows every place admits.

What would lower it without the atom: three or four more fur rows that need nothing. The facts are thin there, since a wording that needs nothing can say little about this place.

**The print gate is unchanged.** The composer rewrites only the text; it neither reads nor writes `entrepot`, `dependency` or `status`. The PRINTED column therefore uses the same gate the tab uses.

---

## F. WHERE THE CHANGE WOULD LIVE

1. **`supplyChainData.js` keeps the canonical notes unchanged.** Each stays index 0 by being read from the chain at compose time. Seedless callers then keep it: `computeActiveChains` itself, the world-pulse kernels, and any unit test that passes no seed. The two widened-register rows also stay valid.
2. **A new data file, `src/data/entrepotNotes.js`.** It holds:
   - `ENTREPOT_NOTES`, keyed by chain id (D's rows), the pool census's preference: a pool in its own file, keyed as the catalogue is keyed.
   - `entrepotNotesOf(chains, record, seed)`. It returns `chains` untouched when the seed is falsy. Otherwise, for each chain with an `entrepotNote` and a pool, it draws through `drawDeclared` with `pickVariant(p, `${seed}::entrepotNote::${chain.chainId}`)` over `factsOf(record)` (plus the chain for `carrier`), and writes the text back. It writes nothing else.
   - It imports `domain/facts/drawDeclared.js`, `domain/facts/factsOf.js`, `domain/facts/chainCarrier.js` and `kernel/proseHash.js`.
3. **The one call line: in `src/generators/steps/economyReconcilePass.js`, not in `computeActiveChains.js`.** It goes immediately before `emitChainTraces(ctx, economicState, tier);`:
   `economicState.activeChains = entrepotNotesOf(economicState.activeChains, { config: effectiveConfig, economicState, institutions, tier }, ctx._seed);`
   - Why not at the writer: `computeActiveChains` has no seed (0 of 600). It is also called seedless by `institutionLifecycle.js` and `resourceDynamicsKernel.js`, and those callers must keep returning the canonical note. A pick there would also run twice in 101 births.
   - At this line, the chains, the route, the market, the houses and every carrier equal the final record in 600 of 600 (section C).
   - The step already declares `provides: ['economicState', …]` and returns it, and `tier`, `institutions` and `effectiveConfig` are already destructured from `ctx`, so no metadata changes. `economyReconcilePass.js` is none of the files the common brief forbids.
   - `computeActiveChains.js` and `prosperity.js` take zero lines.
4. **A follower the change owes: `src/domain/worldPulse/resourceDynamicsKernel.js`.** Its merge `{ ...chain, ...recomputed }` restores the canonical note over a stored variant on a resource transition. It should keep the stored note, for example `{ ...chain, ...recomputed, entrepotNote: chain.entrepotNote ?? recomputed.entrepotNote }`, or the cure decays in play (G2). The file is under `src/domain/worldPulse/`, and the common brief does not forbid it.
5. **Registration.** Add a `TABLE_POOLS` row in `scripts/lib/table-pools.mjs` (`drawKind: 'H'`, drawSite `economyReconcilePass.js → entrepotNotesOf (pickVariant over the declared rows)`). The walkers that count it move: `tests/lint/census5dTablePools.test.js` and `tests/lint/wiringCensusDeclared.walker.test.js`. The presumption walkers go green by the rows' `needs`, plus G1's atom if granted.
6. **The proofs owed:**
   - A red-first test, for example `tests/generators/entrepotNotes.test.js`. It asserts four things on census seeds:
     - (a) A seeded birth stores a non-canonical note where the composer draws one.
     - (b) A seedless call returns the canonical note.
     - (c) Every stored row's `needs` hold on the record.
     - (d) The gate fields (`entrepot`, `dependency`, `status`) are byte-identical before and after.
   - The confinement run: `docs/chair/2026-11-20/content/tools/confinement/trees.mjs <before> <after> <workdir>` must read 0 non-string differences. The composer adds no draw, so nothing else moves.
   - The pinned test that moves: `tests/generators/bar3PlacesRows.test.js`, row `C14378 no northern furs` (r2r-city-0). Its `instead` regex reads the canonical furs note, and r2r-city-0 would store `furs-own`, "Many of the furs sold here are taken on its own hunting grounds." (`out/pins.txt`). The row's `gone` regex (no northern furs) stays true.
   - The writer-reach walker may need its baseline re-banked for the new writer of `entrepotNote on activeChains`.

---

## G. OPEN QUESTIONS for the chair

1. **ATOM** `carrier: own|transit` : `src/domain/facts/chainCarrier.js :: chainCarrierOf` : "Many of the furs sold here are taken on its own hunting grounds." It is a chain-scoped atom (a `needsContext: 'chain'` reader, like `npc` and `pair`). Without it the metropolis stays at 24 of 100 (section E).
2. Should `resourceDynamicsKernel.js`'s merge keep a stored `entrepotNote`, as F4 proposes? Otherwise a born variant turns back into the canonical note on the place's first resource transition.
3. Should the canonical note stay drawable (row 0, no needs), or be the seedless fallback only? It claims things some places contradict: salt's "Port and crossroads settlements profit" is printed in 39 river places, and luxury's "Entrepôt cities profit enormously" in 27 places on a plain road. Making it the fallback only would lower every share further.
4. A chain's good on the export list (140 of 678 printed notes) could back a "and sends it on" wording. `exported: <key>` has no key for salt, wine, spices or luxury goods, and the wordings above need none.
5. Should `transit_finance` take a pool at all? It prints on the tab nowhere (dependency in 96 of 96) and only in the PDF.
