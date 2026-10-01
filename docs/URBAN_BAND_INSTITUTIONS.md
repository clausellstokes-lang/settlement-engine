# The urban band — the institution survey and registry rebuild (2026-09-30)

> **Progress**
> - Branch `feat/urban-band-institutions-2026-09-30`, cut from local `fp/integration-2026-09-23` @ `5d699cc68` (the newest line: 3 commits ahead of GitHub's `85c170e8e`; every one of GitHub's 111 branch tips already existed locally). **Not pushed. Not merged.** The push, the merge and the golden signature stay the owner's, confirmed in the chat that does them.
> - MF-CH2B (the magic-licence gates) was built in parallel on `feat/mf-ch2b-2026-09-30` and picked here, so the estate's seeds move once.
> - 2026-10-01: THE WINDOW IS CLOSED ON THE BRANCH. Registry `6efa6be61` · MF-CH2B `94e40b900`, `fd9845dc5` · buy-back `4fccffd60` · cure J19–J24 `df9ff1a36`…`c9bf28ca8` · the one verifier seat's two FIX rows `e5b1bdb38` · re-pins `475ecfd27` · all SEVEN goldens through the signed door (`917834e22` … `d1c29768c`, record `docs/shift-records/2026-09-30-urban-band-institutions.json`, one superseding herald record) · the measurement seats' commits · the landing re-ground (J27) · the worker ceiling by the owner's word (`96f5544fd`). The owner's later words in the same chat, "I defer all judgment to you" and "like i said, i defer all judgement to you", delegated every judgment call below; push, merge and deploy stay the owner's.

## 1 · The owner's words (session 93391427, in chat)

- The ask: *"can you comprehensively survey all of the institutions and make sure that they are categorized correctly AND have appropriate tier guard rails? for example, beast trainer should intuitively be available for towns, cities, and metropolis, but that is not the case in the website. Second, merchant warehouse and warehouse districts are not considered in the same category."*
- The model: *"i think of towns as simply small cities intuitively rather than a slightly larger village. it is where society and civizliation actually start to coalesce"* and *"make sure this also remains true from hamlet to village in terms of cumulative"*.
- Where: *"before you make any changes can you confirm whether the local or the github files are the most up to date adn do the edits wherever the most up to date is?"*
- The rulings, through the question tool: **"Urban-band rebuild (Recommended)"** and **"Approve + fold in MF-CH2B (Recommended)"**. The second overrides, for this change, ODQ §764.3's sentence naming TE-TRANS-1 the last same-seed-moving wave, and lifts MF-CH2B's hold on its 1,182-roster shift so both ride one window.

## 2 · What the survey measured (all CONFIRMED by execution at `5d699cc68`, 200 settlements per tier unless stated)

| finding | receipt |
|---|---|
| A city was a different kind of place, not a bigger town | town and city blocks shared **10** of 85 and 90 names; generated cities averaged **47.3** institutions against towns' **54.9** |
| Beast trainers existed at town only | cities got it **36%** of the time only through the supply-chain second chance, metropolises **never** (0/200); the picker showed it "auto-excluded" at city while the generator added it |
| One function filed on two shelves | Merchant warehouses (Adventuring) → Warehouse district (Economy); craft guilds, courts, walls, mints, cartographers, the charter hall and more changed shelf between tiers; 51 rows moved in all (appendix A) |
| The Magic shelf deleted mundane rows | Great library, alchemists, Druid Circle, Elder Grove Council, Warden's Lodge and the hamlet/village charter halls — all licensed `none` — never appeared in a magic-free world (0/200) because the shelf, not the licence, decided |
| Rows that could never roll | Massive walls (metropolis, 0/200: the inherited required City walls held the group), Citizen militia (town, 0/200), Wayside shrine (hamlet, 0/200), Carriers' hiring hall (town, 0/200), Royal seat / Democratic assembly / City-state government (city, 0/200) |
| Exclusive groups went to the first-listed member | 'City administration' at 0.92 governed **2** of 200 cities; 'Village elder' at 0.95 governed 12 of 200 villages |
| The metropolis contradicted itself | 'Parish churches (10-30)' beside '(50-100+)' in **191/200**; 'Housing (1000-5000 structures)' in **200/200**; Garrison + Multiple garrisons 187/200; both burial rungs 200/200 |
| Cascade duplicates at two scales | Mill + Access to external mill in 86/200 villages; Mills (2-5) + Mill in 87/200 towns; Inn (multiple) + Travelers' inn 86/200; Major annual fairs + Annual fair 87/200 cities |
| Labels promised guards nothing enforced | 'Cathedral (10,000+ only)' in 14 of 58 cathedral cities under 10,000; 'Gates (if walled)' without walls in 46 of 123 towns; 'Post relay station' ("requires coaching inn") without one in 37 of 79 |
| Big places lost their trades and their chains | 26 supply chains had no processing institution at some tier ≥ their minimum; in 100 metropolises none of 13 core chains (grain, leather, textiles, brewing…) was ever active; 7 chain entries named institutions that do not exist ('Village brewhouse', 'Leatherworkers', …) |
| The coherence pass deleted rolled rows | 63 unsupported-institution deletions per 500 settlements at base (city Multiple monasteries 40/100) |
| Absolute prices in in-world text | six descriptions and their variants ("10 in gold", "250-10,000 in gold") against the price-heuristics law (ODQ §776) |

## 3 · The construction

**One definition per institution.** `src/data/institutionalCatalog.js` is now a registry of 179 *families* — one function at every tier it exists, on ONE shelf — and `institutionalCatalog[tier][shelf][name]` is DERIVED from it in the exact shape its 36 readers already take. The builder throws on an unknown field and on a name listed twice at one tier.

**The cumulative laws.** Hamlet → village and town → city → metropolis are cumulative: a family present at the lower tier is present at the higher, at that tier's scale and chance, unless it declares `ceiling: { tier, reason }` (and, where its function passes to another row, `successor`). Village → town is the one change of kind; thorp keeps its own list. Every tier block is complete, so the three "metropolis = city + metropolis" merges (assembleInstitutions, the picker lookups, viability) are retired.

**Row guards.** `minPopulation` (a floor the row's own text states) and `requiresAny` (an institution it cannot stand without), honoured by all three adding passes (assemble, cascade, faction correlation) through one predicate, `institutionRowGuardsPass`.

**Weighted exclusive groups.** A group resolves once, at its first member: it fills with probability 1 − Π(1 − pᵢ) and seats a member in proportion to pᵢ, one draw. A group a required or toggle-forced member claims never rolls. Coexisting members keep their independent roll.

**The derived ladder.** `UPGRADE_CHAINS` = the hand-authored cross-family pairs ∪ every family's consecutive scale names and declared successor, so a scale rung can never be missing from the ladder again.

**The count labels.** Trades carried from town to metropolis keep ONE identity key (every table joins on the key; ODQ §934.13 ruled "a display seam, not a schema split") and the display seam prints the trade without the town's count: Bakers, Butchers, Carpenters, Blacksmiths, Mills. One identity name is new: 'Housing (5000+ structures)' (metropolis), threaded into the two name-keyed tables that list its siblings.

**The gate table and the chains** were brought into agreement with the tiers the registry rolls at (Citadel accepts Town walls; Printing house accepts Craft guilds (5-15) and floors at town; Theaters and Mages' guild floor at town; Colosseum accepts a Gladiatorial school), and every supply-chain processor now names a real institution with one at every tier from the chain's minimum.

**The prevention.** `tests/lint/institutionRegistry.walker.test.js` holds the two cumulative laws, one shelf per function (and per ladder pair), the gate-table agreement, the chains, picker = generator, and "no count label outlives its tier". `tests/generators/urbanBandInstitutions.test.js` holds the weighted group, the row guards, the cumulative laws and the zero-deletion result at generation over fixed seeds.

## 4 · Judgments (delegated by the owner's two rulings; each vetoable — the veto line says what reverts)

> - **J1 · Primary production is filed on Economy, not Crafts.** Mining, quarrying, salt, charcoal, peat, herding, dairying, fishing, fowling, hunting, bee-keeping and stabling (21 hamlet/village rows) moved from Crafts to Economy, beside the thorp's own primary rows and in agreement with their own `priorityCategory: 'economy'`. Crafts keeps the trades that transform goods. *Veto reverts the `shelf` of those families in the registry.*
> - **J2 · Trades that make things are filed on Crafts.** Craft guilds (all three scales), cartographers, jewellers, vintners, the apothecary district and the alchemists (ALCHEMY IS A TRADE, ODQ §541). *Veto reverts those families' shelf.*
> - **J3 · The miscategorised rows.** Beast trainers → Economy (the animal-trade ladder in supplyChainData names it the town rung after Stable yard and Stable master); Merchant warehouses → Economy (its city rung's shelf); Charlatan fortune tellers → Entertainment; Hired blades → Adventuring; Mercenary quarter → Defense (with its town rung, Free company hall); Village musician → Entertainment (its `religious` tag and `religion` faction role dropped — it is a performer); Town crier → Government; Druid Circle and Elder Grove Council → Religious (FAITH IS NOT MAGIC, TE-CH-6); Warden's Lodge → Defense; Great library → Infrastructure; Palace/government complex and Multiple court buildings → Infrastructure (with Town hall, City hall and the courthouses); the hamlet/village Adventurers' charter hall → Adventuring (its town rung's shelf); Palisade and Household levy → Defense. *Veto reverts the named family's shelf.*
> - **J4 · The faction-role axis (`priorityCategory`) is left as authored** except the village musician. The axis diverges from the shelf by design and the plausibility test calls that divergence owner-settled; a lord's steward reading `military` is a ruled reading, not a slip.
> - **J5 · One identity key per trade from town up; the display seam drops the count.** No new identity names except 'Housing (5000+ structures)'. *Veto: mint per-tier names instead, threading each through the dozen name-keyed tables.*
> - **J6 · Per-tier chances for every continuation are the chair's**, typically the town chance × 1.1–1.5 at city and a little more at metropolis; near-universal trades (bakers, butchers, carpenters, smiths) sit at 0.85–0.95. Result: mean rosters town 61.3 / city 72.9 / metropolis 79.9 (were 54.9 / 47.3 / 55.8). *Veto: any single `baseChance` in the registry.*
> - **J7 · A metropolis rung is required where its city rung was**: parish churches, granary, water, walls, garrisons, courts, district markets, craft guilds, warehouses — a metropolis never loses a function its city rung guaranteed.
> - **J8 · Thorp keeps its own list** (the owner named hamlet → village). Thorp rows still continue where a hamlet form exists; the woodcutter's camp was carried from thorp into forest hamlets and villages.
> - **J9 · City rows a prosperous town may now hold, at low odds**: Harbour master's office, Barge company, Auction house, Printing house, Workhouse, Foundling home, Theaters, Fighting pits, Citadel, Mages' guild (2,000+ people), Scroll scribe, Merchant oligarchy. **Village trades carried into towns and up**: Potter, Cooper, Brickmaker, Fuller, Dyer, Woodcarver, Midwife, Fish market, River ferry, River boatyard, Toll bridge, Mine, Stone quarry, Salt works, Charcoal burner, Pawnbroker, Veteran's lodge, Caravanserai (desert); Hunter's lodge and the fence to town. *Veto removes a tier entry.*
> - **J10 · The population floors are the rows' own stated ones**: Cathedral, Bardic college, Thieves' guild chapter 10,000; Enchanter's shop 5,000; Money changers 3,000; Mages' guild (town) 2,000; Wizard's tower (town) 1,000. Prerequisites: Gates → Town walls; Post relay station → Coaching inn.
> - **J11 · Ladder repairs.** Pawnbroker left the banking absorptions (pledge-lending serves those the banks turn away); the wayside shrine left the religiousCenter group and its upgrade pair (a complement to the parish, not its lesser form); the bowyers' guild no longer "upgrades" into the delving supply district. **Retired rows**: town Citizen militia (dead), village Smuggling network (dead), metropolis Daily markets (a zero-chance suppressor); town Carriers' hiring hall moved to village, where it is the lesser form.
> - **J12 · Prices became relative** in the six rows the price law convicts (and their variants): the healer, the alchemist, the scroll scribe, the hireling hall, the fortune tellers, the message network.
> - **J13 · Eight identity sentences** that said "town" for trades now present in cities were neutralised ("the settlement's", "civic", "urban").
> - **J14 · The gate table follows the registry.** `spatialData.js`'s GATE_FEATURES may not floor a row above the lowest tier the registry rolls it at, and a hard `requires` must be satisfiable at every tier it rolls: Citadel accepts 'Town walls'; Printing house floors at town and accepts 'Craft guilds (5-15)'; Theaters and Mages' guild floor at town; Colosseum/arena accepts a 'Gladiatorial school'. Without this the coherence pass deleted every town citadel and printing house it was handed. *Veto reverts those five gate rows (and the rows then die as unsupported again).*
> - **J15 · Custom names stop at the provenance boundary in the gate checks.** `structuralValidator.js`'s GATE_FEATURES block now reads native names only (`nativeSemanticNames`), as `coherenceRepairPass` already does: a custom institution that carries a catalog name ('Mages' guild') neither triggers a native row's gate nor stands as a native prerequisite. Exposed, not caused, by this change (towns gained the scroll scribe) — `customContentPresentationClaims` caught a native Wizard's tower going missing because a custom 'Mages' guild' satisfied its scroll scribe. *Veto reverts two lines.*
> - **J16 · Faction names are the faction ledger's.** `factions[].powerFactionName` and `factions[].members[].factionAffiliation` now hold a catalog name ('Democratic assembly' — a government form that never generated before the weighted seat) and are declared NON-CASCADED in `institutionRename.js`: renaming the institution must not silently rename a faction the DM may have renamed on its own. *Veto: cascade them instead (a design call in the rename ledger).*
> - **J17 · Row guards live in the registry, never on the row.** `minPopulation` and `requiresAny` are looked up by (tier, name) at the roll (`institutionRowGuardsPass(tier, name, …)`); a guard written on the row rode onto every settlement record, and `requiresAny` names institutions — the rename walker caught the stored path. No persisted shape gains a key.
> - **J18 · The walls-excluded specimen excludes every wall rung.** `effectReachability`'s "a citadel loses its only hard dependency AND every substitute" specimen now force-excludes 'Town walls' as well as 'City walls and gates', because J14 made Town walls a lawful substitute; the effect it pins (a dependent removed when nothing can support it) is unchanged.

## 5 · Measured at generation (200 settlements per tier, default settings, seeds `audit-<tier>-<i>`, routes cycling; before = `5d699cc68`, after = the window's final source)

| measure | before | after |
|---|---:|---:|
| mean institutions — town / city / metropolis | 54.9 / 47.3 / 55.8 | 61.5 / 73.1 / 77.8 |
| Beast trainers — town / city / metropolis | 91 / 73 / **0** | 122 / 145 / 148 |
| Bakers in cities / metropolises | 0 / 0 | 199 / 200 |
| Massive walls in metropolises | **0** | 200 |
| 'City administration' / 'Royal seat' governing cities | 2 / **0** | 49 / 13 |
| 'Village elder' governing villages | 12 | 67 |
| coherence-pass deletions of rolled rows (375 urban settlements) | 63 per 500 | **0** |
| mean active supply chains — town / city / metropolis | 19.8 / 23.1 / 22.6 | 22.0 / 28.6 / 30.0 |
| magic-free villages holding a Druid Circle / charter hall | 0 / 0 | 40 / 136 |
| magic-free settlements failing their own `world_law_magic` check | 0 | **0** (25 of 40 cities on the combined tip, cured by J20/J21) |
| generation worker bundle | 1,391,256 B | 1,423,431 B (the owner's word; 1,475,470 before the buy-back) |

## 6 · Open items, each with its slot (THE OWNER'S LAW: nothing emergent without a slot)

| # | item | slot |
|---|---|---|
| O1 | The subsumption rules still fold an alchemist shop/quarter into a mages' guild or district, which contradicts ALCHEMY IS A TRADE (at high magic, 0 of 200 metropolises keep an alchemist quarter). | **Owner decision point** — recommend removing the alchemists from those two absorptions. |
| O2 | An isolated high-magic city is given a village-scale 'Hedge wizard' as its forced arcane maintainer, because the tower and the guild forbid isolated routes (40 of 200 at `priorityMagic` 100, before and after). | **Owner decision point** — recommend letting the maintainer be the tier's own tower when isolation is magic-bridged. |
| O3 | The catalog holds no cultural, non-magical divine healer for a magic-free world (the doctrine gap the Healer row's own comment records). | **Owner decision point** (new content) — recommend a 'Healer (faith)' row licensed `none`. |
| O4 | The institution grid has no colour for the Exotic shelf (falls back to the default swatch). | **Unfreeze queue** (cosmetic). |
| O5 | Saved wizard toggles keyed on a row's OLD shelf (e.g. `town::Adventuring::Beast trainers`) no longer match that row. No preserved data exists before launch (rule 38), so no migration is written; the forced cross-tier path already falls back by name. | **Closed with reason** (launch-shape persistence). |
| O7 | A World Pulse PROMOTION adds the new tier's required rows but does not retire the lesser scale rungs (`tierOutcomeApply.js` records the release as "a separate, un-asked ruling"). Town → city already left 'Town granary' beside 'City granaries'; now that the metropolis block is complete, city → metropolis likewise adds 'Massive walls', 'State granary complex', etc. beside their city rungs (before, it added only 'Cemetery network'). | **Owner decision point** — recommend releasing a lesser rung on promotion when the derived ladder names its greater (the same `institutionLadderEvicts` law generation uses). |
| O8 | The town-map multiplicity resolver reads the count in a row's NAME, so a city's 'Bakers (5-15)' (one identity key from town up, J5) draws a town-sized 5-15 bakeries. | **The map-module slot** (the settlement-layer map module is the owner's one post-launch disposition, §764.5): a per-tier count table for the resolver when that module is taken up. |
| O6 | The faction-role axis anomalies (noble governments `military`, Elder Grove Council `military`, Beast trainers `adventuring`) are left as authored (J4). | **Closed with reason** (owner-settled axis). |


## 4b · MF-CH2B, picked into this window (built by a separate seat on `feat/mf-ch2b-2026-09-30`, base `5d699cc68`; picked as `94e40b900` and `fd9845dc5`)

The magic gates now read a row's DECLARED licence (`magicLicense`), never its shelf: the probability gate (P1), the high-magic boost list (P2, down to 8 names), the non-magic exotics list (P3, deleted), the world law's own magic check (P5) and the UI grid. `tests/lint/magicShelfGateCensus.walker.test.js` holds it (ten mutants driven, each red its arm). Its builder's departures and the rulings it asked for, each now taken by the chair under the owner's "Approve + fold in MF-CH2B" (each vetoable):

> - **M1 · The sixth surface is ported** (`generationContext.js`'s bare-token exemption in `allowsMagicClaim`): packet §1 said it landed at `72545d322`, which is not an ancestor of the base. Without it a magic-free realm's own `world_law_magic` receipt fails on the shelf names of the rows it now keeps. *Veto reverts that block (and the realm's receipt goes red).*
> - **M2 · `magicFilter.js` imports the licence ladder** from `src/data/constants.js` (packet §1.1 allows it): one new lazy → eager chunk edge, `engine-core-lazy → data`, which cannot form a cycle; every lazy-boundary guard passes. The alternative re-types the four licence tokens, a second spelling. *Veto: re-type them.*
> - **M3 · The druid route boost stays inside the magic branch, as the packet built it.** The druid family is licensed `none` (FAITH IS NOT MAGIC, TE-CH-6), and the boost it loses fed the supply chains' MAGIC substitution, which is a magical function. Druid circles in isolated high-magic towns fall from 38/40 to 12/40 and druidic chain substitution from 12/40 to 0/40: that is the doctrine's consequence, not a regression. *Veto hoists the boost out of the branch (measured: substitution back to 3/40).*
> - **M4 · The espionage fence is re-recorded through the door**, not treated as a breach: its own history records six earlier movements, each "a signed re-record under tests/helpers/goldenRecordDoor.js rather than a spend of the one window this file's STOP still names", and MF-CH2B is named in that file as a constituent of the one remaining window. The shift record cites §934.86.


## 4c · The cure day — what the combined tip exposed, and the judgments taken (the owner, 2026-09-30 ~22:13, in chat: "I defer all judgment to you"; each vetoable)

The combined tip (`fd9845dc5`) failed 64 files that pass at base. Most were the declared shift moving measured instruments. Each one that moved generated output for a reason other than the shift was traced to a latent defect, and each such defect existed before the rebuild: the urban band and MF-CH2B only made it reachable.

> - **J19 · A change of government never re-spells the outgoing seat** (`src/domain/rulingPower.js` `resolveGovernmentLabel`). A noble house that took a 'Royal Authority' metropolis came out as 'Royal Authority'. The case was latent until 'Royal seat' could govern, and `warSeatBooksFactionAddress` PIN-3 caught it. The seat now falls to the archetype's alternate ('Noble Regency'), the path the surviving-incumbent guard already took. A repeat coup by one merchant faction now ends 'Merchant oligarchy' rather than a second 'Grand Merchant Senate'. *Veto reverts the `outgoing` clause.*
> - **The name ledgers** (no judgment, repair): goal.short ("Position themselves before {faction} moves first") joins the faction-rename cascade, on the 2026-08-01 precedent of role and factionGoal. Five faction-ledger paths that hold 'Democratic assembly' (the power layer names that governing faction after its body) are declared non-cascaded in the institution ledger, for J16's reason.
> - **J20 · The druid-family texts assert no working magic.** Elder Grove Council is "found in cities that have made their peace with the wild" (was "with nature magic"), in its desc and two variants. Warden's Lodge is "a ranger station, or a waypost kept by druids" (was "druid waypost"), in its desc, its variant and its identity sentence. *Veto restores the four phrases. Magic-free worlds then fail their own world-law check again.*
> - **J21 · The world law's receipt does not convict a row it admitted.** `allowsMagicClaim` treats a text that is exactly a catalog name licensed `none` as no claim: P5 admits that row by its licence, so its receipt may not convict it for its name. This has the same shape as MF-CH2B's bare shelf-token exemption beside it. Before J20/J21, 25 of 40 magic-free cities and 19 of 40 magic-free villages failed `world_law_magic` (0 of 40 at base, where the Magic shelf struck those rows). G5 pins every tier. *Veto reverts one line.*
> - **J22 · The envelopes follow the world the owner approved.** Two registered bounds and one authored floor are re-derived with the helper's own `envelopeBound` at the registered alpha, recorded rather than silent:
>   - Tier inertia under ACUTE pressure (realm directive 6, measured at N=400): town 97.5% → 88.5%, city 95.5% → 72.0% demoting. Calm is unmoved; matched barely moved. Complete urban blocks keep the structural-failure support above 0.25 more often.
>   - The "acute spread at most 10" arm is restated structurally on the registered bounds.
>   - The ordinary-village clean floor is now a registered envelope (392/400). The hamlet's 'Smuggling waypoint' reached villages by the cumulative law, and hamlets with it read dirty at the same rate (11/400).
>   *Veto restores the old bounds, and the arms red until O11 is decided.*
> - **J23 · Every seated government form names its own faction** (`src/generators/power/rulingStructure.js`). Three forms the table never named fell to the priority fallback and governed under a label their own institution contradicts, measured over 100 settlements per tier:
>   - 'Town council' became 'Town Mayor' in 26 towns. It now maps to 'Town Council', tier-banded and priority-retyped exactly like 'mayor and council'.
>   - A thorp's 'Lord's reeve' became 'Elder Council' in 20. It now maps to 'Feudal Stewardship'.
>   - A 'Village headman' became 'Elder Council' in 46 hamlets and 18 villages. It now maps to "Headman's Authority".
>   *Veto removes the three keys.*
> - **The phone floor** (repair): two lines crossed the walk's 45 characters once towns seated mercenary companies. The "Via:" provider line reads through `proseFontSize`; the force tally is marked chrome.
> - **The founding seeds** (the registry's own rule, "re-verified or the seed re-chosen"):
>   - 'The Crown That Will Not Hold' moves to besi-872, where every receipt holds. Its synopsis now says the siege is seven years past (was twelve) and a merchant council governs (was a mayor).
>   - 'The Mill That Outlived Its Wars' keeps besi-1. Only its founding draw moved, so its founding clause now reads "grew from a single logging operation whose owner refused to leave".
> - **MF-CH2B's rulings** (taken by the chair): M3 (the druid route boost stays in the magic branch) and M4 (the espionage fence is re-recorded through the door) are in §4b. MF-CH2B's R1 worker-bundle question is the owner's word of 22:13, taken: the ceiling rises to the final measured figure, cause §934.86, after the buy-back below.

**The byte buy-back** (`4fccffd60`, no output moved). Repeated desc and tags text is hoisted to a family's `shared`, and each description-variant pair is spelled once. Every derived structure fingerprints identically. The generation worker went 1,475,470 → 1,422,127 B. The remainder over the 1,391,256 B ceiling is the new content itself (215 tier entries, 28 descriptions and their variants).

> - **The verifier seat's two FIX rows** (`e5b1bdb38`; one seat, frozen worktree, no STOP). (1) The cascade and the dependency repair reached the tier BELOW, seating ceiling-bound families and lesser rungs (Warden's Lodge in 26 of 200 cities, a city's Black market in 56 of 200 metropolises, a town charter hall beside a city's guilds); both now read the settlement's own tier block, the repair accepting a row that implies a missing requirement (SPATIAL_FEATURES), as the registry walker's L4 proves possible for every gate. (2) Five generator sentences printed the raw identity key past the display seam ("Bakers (5-15) exists but lacks access to grain" in a city); they now print through `institutionDisplayName`. *Veto reverts either half.*
> - **J24 · A druid is a priest** (the owner, 2026-09-30: "like i said, i defer all judgement to you"; `c9bf28ca8`). `druid` leaves `MAGIC_ASSERTION_PATTERN` and `MAGIC_ROLE_PATTERN`, as TE-CH-6 ruled: the celtic PRIEST's title is 'Druid', and a magic-free world had been stripping every celtic priest of it. A druid said to cast spells still asserts through `spells` and `magic`. *Veto restores the token in both patterns.*
> - **J25 · O9 closed: the magic dial does not need a government form.** Measured at magic 95: 21 of 60 cities and 18 of 60 metropolises arcane-governed (the council retype), the 'arcane-advised' modifier on every other form; the old 28 of 40 rested on the first-listed-member defect. *Veto opens the arcane government form as content.*
> - **J26 · O11 closed: directive 6 holds in substance.** Under the full acute load a city still demotes 15× more often than under matched pressure (72% against 4.75%); inertia is a resistance, never an immunity; the re-derived floors guard further erosion. No tuning moves. *Veto opens the tuning-band work (owner-signed).*
> - **The cartography calibration ground** (`3a4cb3d7b`): `CARTOGRAPHY_CALIBRATION.MAX_INSTITUTIONS` is a MEASURED reading, re-read off the regenerated corpus (village 41→42, town 63→69, city 56→83, metropolis 65→86) in the 2026-08-30 burial ladder's order, and the corpus drawn again against it.
> - **The door's one refusal**: the herald desk's act was refused (PREDICTION_MISS, 367 predicted, 400 produced); a superseding record (`docs/shift-records/2026-10-01-urban-band-herald-rows.json`) carries the corrected prediction under the same signature.

> - **J27 · The landing tells the truth about its town** (`7ce30abed`). The shift left lf-033 (Cnocby) without a faction conflict, so its market receipt and conflict hook vanished. The town is kept (re-seeding would rename it across four surfaces) and the copy re-grounded: §01 names "which inn takes the travellers", §02 "the inn it seated for travellers … the same three facts"; the fixture script shows a second figure's goal when a town has no conflict. *Veto: re-seed the landing town and re-ground the four surfaces that name it.*
> - **J28 · The mill's governance re-verified** (`2010a4833`): besi-1 now reads 'Tolerated'; the synopsis says "a hand its people tolerate". *Veto: re-choose the seed.*
> - **J29 · The worker ceiling rises by the owner's word** (`96f5544fd`) to the final measured 1,423,431 B, after the buy-back. *Veto: restore 1,391,256 B and drop content.*

| # | open item | slot |
|---|---|---|
| O9 | (closed — J25) | — |
| O10 | (taken — J24) | — |
| O11 | (closed — J26) | — |

## Appendix — the registry ledger (every moved, added, retired and changed row)

### A. Shelf moves (51)
- thorp|Communal root cellar — Infrastructure -> Economy
- hamlet|Fisher's landing — Crafts -> Economy
- village|Fishmonger — Crafts -> Economy
- hamlet|Shepherd — Crafts -> Economy
- hamlet|Dairy farmer — Crafts -> Economy
- village|Dairy farmer — Crafts -> Economy
- village|Beekeeper — Crafts -> Economy
- village|Wildfowler — Crafts -> Economy
- hamlet|Charcoal burner — Crafts -> Economy
- village|Charcoal burner — Crafts -> Economy
- hamlet|Peat cutter — Crafts -> Economy
- hamlet|Mine (open cast) — Crafts -> Economy
- village|Mine — Crafts -> Economy
- hamlet|Stone quarry — Crafts -> Economy
- village|Stone quarry — Crafts -> Economy
- hamlet|Salt works — Crafts -> Economy
- village|Salt works — Crafts -> Economy
- hamlet|Hunter's lodge — Crafts -> Economy
- village|Hunter's lodge — Crafts -> Economy
- hamlet|Pack animal trader — Crafts -> Economy
- hamlet|Stable yard — Crafts -> Economy
- village|Stable master — Crafts -> Economy
- town|Beast trainers — Adventuring -> Economy
- town|Merchant warehouses — Adventuring -> Economy
- town|Mint — Crafts -> Economy
- thorp|Access to external mill — Economy -> Crafts
- hamlet|Access to external mill — Economy -> Crafts
- town|Jeweller — Economy -> Crafts
- city|Apothecary district — Economy -> Crafts
- town|Vintner — Economy -> Crafts
- town|Cartographer's workshop — Economy -> Crafts
- city|Cartographer's guild — Economy -> Crafts
- town|Craft guilds (5-15) — Economy -> Crafts
- city|Craft guilds (30-80) — Economy -> Crafts
- town|Alchemist shop — Magic -> Crafts
- city|Alchemist quarter — Magic -> Crafts
- village|Druid Circle — Magic -> Religious
- town|Elder Grove Council — Magic -> Religious
- town|Town crier — Crafts -> Government
- metropolis|Palace/government complex — Government -> Infrastructure
- metropolis|Multiple court buildings — Government -> Infrastructure
- metropolis|Great library — Magic -> Infrastructure
- thorp|Palisade — Infrastructure -> Defense
- thorp|Household levy — Infrastructure -> Defense
- city|Mercenary quarter — Adventuring -> Defense
- town|Warden's Lodge — Magic -> Defense
- hamlet|Adventurers' charter hall — Magic -> Adventuring
- village|Adventurers' charter hall — Magic -> Adventuring
- town|Hired blades — Entertainment -> Adventuring
- village|Village musician — Religious -> Entertainment
- town|Charlatan fortune tellers — Adventuring -> Entertainment

### B. Tier entries added (215)
**village** (14): Economy / Common grazing land (from hamlet · Economy / Fisher's landing (from hamlet · Economy / Shepherd (from hamlet · Economy / Woodcutter's camp (new) · Economy / Peat cutter (from hamlet · Economy / Pawnbroker (from hamlet · Economy / Carriers' hiring hall (from town · Economy / Pack animal trader (from hamlet · Crafts / Maltster (from hamlet · Religious / Wayside shrine (from hamlet · Government / Informal elder consensus (from hamlet · Government / Village headman (from hamlet · Criminal / Bandit affiliate (from hamlet · Criminal / Smuggling waypoint (from hamlet

**town** (32): Economy / Fish market (from village · Economy / Charcoal burner (from village · Economy / Mine (from village · Economy / Stone quarry (from village · Economy / Salt works (from village · Economy / Hunter's lodge (from village · Economy / Pawnbroker (from hamlet · Economy / Caravanserai (from village · Economy / River ferry (from village · Economy / River boatyard (from village · Economy / Barge and river transport company (from city · Economy / Harbour master's office (from city · Economy / Toll bridge (from village · Economy / Auction house (from city · Crafts / Cooper (from village · Crafts / Fuller (from village · Crafts / Dyer (from village · Crafts / Potter (from village · Crafts / Brickmaker (from village · Crafts / Midwife (from village · Crafts / Woodcarver (from village · Crafts / Printing house (from city · Religious / Foundling home (from city · Government / Merchant oligarchy (from city · Infrastructure / Workhouse (from city · Defense / Citadel (from city · Defense / Veteran's lodge (from village · Magic / Mages' guild (from city · Magic / Scroll scribe (from city · Criminal / Fence (word of mouth) (from village · Entertainment / Theaters (from city · Entertainment / Fighting pits (from city

**city** (49): Economy / Fish market (from village · Economy / Charcoal burner (from village · Economy / Mine (from village · Economy / Stone quarry (from village · Economy / Salt works (from village · Economy / Pawnbroker (from hamlet · Economy / Coaching inn (from town · Economy / Caravanserai (from village · Economy / Stable district (from town · Economy / Beast trainers (from town · Economy / Post relay station (from town · Economy / River ferry (from village · Economy / River boatyard (from village · Economy / Toll bridge (from village · Economy / Customs house (from town · Economy / Public bathhouse (from town · Economy / Assay office (from town · Crafts / Mills (2-5) (from town · Crafts / Blacksmiths (3-10) (from town · Crafts / Carpenters (5-15) (from town · Crafts / Cooper (from village · Crafts / Bowyers & fletchers (guild) (from town · Crafts / Sawmill (commercial) (from town · Crafts / Brewery (from town · Crafts / Vintner (from town · Crafts / Tanners (from town · Crafts / Tanner (established) (from town · Crafts / Fuller (from village · Crafts / Dyer (from village · Crafts / Weavers/Textile workers (from town · Crafts / Potter (from village · Crafts / Brickmaker (from village · Crafts / Cobbler's guild (from town · Crafts / Tailor's guild (from town · Crafts / Butchers (3-8) (from town · Crafts / Bakers (5-15) (from town · Crafts / Smelter (from town · Crafts / Chandler (from town · Crafts / Ropemaker (from town · Crafts / Midwife (from village · Crafts / Woodcarver (from village · Religious / Almshouse (from town · Religious / Elder Grove Council (from town · Government / Town crier (from town · Defense / Veteran's lodge (from village · Adventuring / Hireling hall (from town · Adventuring / Hired blades (from town · Entertainment / Gladiatorial school (from town · Entertainment / Charlatan fortune tellers (from town

**metropolis** (119): Economy / Fish market (from village · Economy / Charcoal burner (from village · Economy / Mine (from village · Economy / Stone quarry (from village · Economy / Salt works (from village · Economy / Furrier's district (from city · Economy / Multiple market squares (from city · Economy / Major annual fairs (from city · Economy / Pawnbroker (from hamlet · Economy / Inns and taverns (district) (from city · Economy / Coaching inn (from town · Economy / Caravanserai (from village · Economy / Caravan masters' exchange (from city · Economy / Stable district (from town · Economy / Beast trainers (from town · Economy / Post relay station (from town · Economy / River ferry (from village · Economy / River boatyard (from village · Economy / Shipyard (from city · Economy / Barge and river transport company (from city · Economy / Docks/port facilities (from city · Economy / Harbour master's office (from city · Economy / Toll bridge (from village · Economy / Customs house (from town · Economy / Warehouse district (from city · Economy / Public bathhouse (from town · Economy / Slave market (from city · Economy / Slave market district (from city · Economy / Auction house (from city · Economy / Assay office (from town · Economy / Mint (official) (from city · Economy / Listening post (from city · Economy / Chroniclers' exchange (from city · Crafts / Mills (2-5) (from town · Crafts / Blacksmiths (3-10) (from town · Crafts / Specialized metalworkers (from city · Crafts / Luxury goods quarter (from city · Crafts / Carpenters (5-15) (from town · Crafts / Cooper (from village · Crafts / Apothecary district (from city · Crafts / Bowyers & fletchers (guild) (from town · Crafts / Sawmill (commercial) (from town · Crafts / Brewery (from town · Crafts / Vintner (from town · Crafts / Tanners (from town · Crafts / Tanner (established) (from town · Crafts / Fuller (from village · Crafts / Dyer (from village · Crafts / Weavers/Textile workers (from town · Crafts / Potter (from village · Crafts / Brickmaker (from village · Crafts / Cobbler's guild (from town · Crafts / Tailor's guild (from town · Crafts / Butchers (3-8) (from town · Crafts / Bakers (5-15) (from town · Crafts / Smelter (from town · Crafts / Chandler (from town · Crafts / Glassmakers (from city · Crafts / Ropemaker (from town · Crafts / Midwife (from village · Crafts / Woodcarver (from village · Crafts / Printing house (from city · Crafts / Cartographer's guild (from city · Crafts / Alchemist quarter (from city · Religious / Almshouse (from town · Religious / Foundling home (from city · Religious / Elder Grove Council (from town · Government / Noble governor (from city · Government / City administration (from city · Government / Mayor and council (from city · Government / Guild consortium (from city · Government / Merchant oligarchy (from city · Government / City-state government (from city · Government / Democratic assembly (from city · Government / Royal seat (from city · Government / Town crier (from town · Infrastructure / Housing (5000+ structures) (new) · Infrastructure / City hall (from city · Infrastructure / Workhouse (from city · Infrastructure / Sewage system (from city · Defense / Professional city watch (from city · Defense / Citadel (from city · Defense / Mercenary quarter (from city · Defense / Veteran's lodge (from village · Magic / Wizard's tower (from city · Magic / Enchanter's shop (from city · Magic / Scroll scribe (from city · Magic / Teleportation circle (from city · Adventuring / Multiple adventurers' guilds (from city · Adventuring / Hireling hall (from town · Adventuring / Hired blades (from town · Adventuring / Dungeon delving supply district (from city · Adventuring / Sage's quarter (from city · Criminal / Smuggling network (from city · Criminal / Multiple criminal factions (from city · Criminal / Front businesses (from city · Criminal / Underground network (from city · Criminal / Rookery (from city · Criminal / Whisper market (from city · Criminal / Contract killer (from city · Criminal / Kidnapping ring (from city · Criminal / Human trafficking network (from city · Entertainment / Multiple theaters (from city · Entertainment / Opera house (from city · Entertainment / Bardic college (from city · Entertainment / Gambling district (from city · Entertainment / Brothel (red light district) (from city · Entertainment / Red light district (from city · Entertainment / Fighting pits (from city · Entertainment / Gladiatorial school (from town · Entertainment / Colosseum/arena (from city · Entertainment / Charlatan fortune tellers (from town · Exotic / Planar traders (from city · Exotic / Dragon resident (from city · Exotic / Golem workforce (from city · Exotic / Undead labor (from city · Exotic / Dream parlors (high magic) (from city · Exotic / Airship docking (high magic) (from city · Exotic / Message network (high magic) (from city

**hamlet** (1): Economy / Woodcutter's camp (new)

### C. Rows retired (4)
- `town|Citizen militia` — dead row: blocked by the required Town watch in civilianDefense (0 of 200 towns); the militia is the hamlet/village rung
- `town|Carriers' hiring hall` — moved to village: the lesser form never survived beside the carriers' guild (0 of 200 towns)
- `village|Smuggling network` — dead row: gated to city by minTier, so it never rolled at village; the village rung is the smuggling waypoint
- `metropolis|Daily markets` — zero-chance suppressor row, redundant once the metropolis market rung is its own required row

### D. Field changes on existing rows (42)
- metropolis|District markets (5-10): required: false -> true; baseChance: 0.8 -> 1
- metropolis|Merchant guilds (50-100+): baseChance: 0.7 -> 0.95
- town|Money changers: minPopulation: undefined -> 3000
- metropolis|Banking district: baseChance: 0.65 -> 0.8
- town|Inn (multiple): baseChance: undefined -> 1
- city|Inns and taverns (district): baseChance: undefined -> 1
- town|Taverns (5-20): baseChance: undefined -> 1
- town|Post relay station: desc: "Maintains a team of horses for rapid message relay. Letters and small packages travel far faster than foot traffic. Requires coaching inn." -> "Maintains; requiresAny: undefined -> ["Coaching inn"]
- metropolis|State granary complex: required: false -> true; baseChance: 0.7 -> 1
- city|Warehouse district: baseChance: undefined -> 1
- city|Craft guilds (30-80): required: false -> true; baseChance: 0.98 -> 1
- metropolis|Craft guilds (100-150+): required: false -> true; baseChance: 0.7 -> 1
- town|Alchemist shop: desc: "Potions, alchemical items. Basic healing potions (50 in gold)." -> "Potions and alchemical wares. A basic healing draught costs about what a labourer ear
- thorp|Wayside shrine: exclusiveGroup: "religiousCenter" -> undefined
- hamlet|Wayside shrine: exclusiveGroup: "religiousCenter" -> undefined
- hamlet|Access to parish church: exclusiveGroup: "religiousCenter" -> undefined
- metropolis|Parish churches (50-100+): required: false -> true; baseChance: 0.8 -> 1
- metropolis|Major monasteries (5-10): baseChance: 0.55 -> 0.6; exclusiveGroup: undefined -> "religiousCenter"; exclusiveGroupCoexists: undefined -> true
- city|Cathedral (10,000+ only): minPopulation: undefined -> 10000
- metropolis|Great cathedral: exclusiveGroup: undefined -> "religiousCenter"; exclusiveGroupCoexists: undefined -> true
- metropolis|Hospital network: baseChance: 0.55 -> 0.6
- metropolis|Advanced water infrastructure: required: false -> true; baseChance: 0.6 -> 1; exclusiveGroup: undefined -> "waterSupply"
- metropolis|Multiple court buildings: required: false -> true; baseChance: 0.65 -> 1
- metropolis|Massive prison: baseChance: 0.5 -> 0.7
- thorp|Palisade: exclusiveGroup: undefined -> "defenseLevel"
- city|City walls and gates: baseChance: 0.9 -> 1
- metropolis|Massive walls and fortifications: required: false -> true; baseChance: 0.5 -> 1
- town|Gates (if walled): requiresAny: undefined -> ["Town walls"]
- city|Professional city watch: baseChance: 0.9 -> 1
- city|Garrison: baseChance: undefined -> 1
- metropolis|Multiple garrisons: required: false -> true; baseChance: 0.75 -> 1
- town|Wizard's tower: minPopulation: undefined -> 1000
- metropolis|Mages' district: baseChance: 0.45 -> 0.5
- city|Enchanter's shop: minPopulation: undefined -> 5000
- city|Scroll scribe: desc: "Spell scrolls for sale. 25 in gold for the smallest charm, 500 and up for a greater working." -> "Spell scrolls for sale. The smallest charm costs what a
- village|Healer (divine, 1st level): desc: "Basic healing spells. A closed wound costs 10 in gold." -> "Basic healing spells. A closed wound costs more than most households see in a month."
- town|Hireling hall: desc: "Job board for torchbearers (1 in gold a session), porters (5 in gold a session)." -> "Job board for torchbearers and porters, hired by the session at a d
- city|Thieves' guild chapter: minPopulation: undefined -> 10000
- metropolis|Black market bazaar: baseChance: 0.45 -> 0.5
- village|Village musician: tags: ["religious"] -> []; priorityCategory: "religion" -> "entertainment"
- city|Bardic college: minPopulation: undefined -> 10000
- town|Charlatan fortune tellers: desc: "Non-magical 'divination' using Deception. 1-5 in gold." -> "Non-magical 'divination' worked by Deception, for a few coins a reading."