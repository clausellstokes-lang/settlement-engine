# R-INST-5 — MAGICAL AND FANTASY INSTITUTIONS (DW program P1b, tranche 5: the fiction-and-lore leg)

**MARK: [OPUS-RUN · FABLE-VALIDATION OWED]** (owner directive ODQ §484). Written by lane
TC-R-INST-5 running SOLO on `claude-opus-5[1m]` from 2026-08-23T15:32:59Z; the program's
lane cap is TWO and a sub-lane counts, so this dossier used NO Agent, Workflow or
sub-agent call of any kind — every search, fetch and figure below was issued by the one
lane and is logged in the APPENDIX. **Owner taste-gates this dossier (the CT-0 pattern);
nothing here is grammar yet.** The status map at §0.3 is the truth of what is at depth and
§L is the numbered ledger of what is not.

**Lane.** Read-only on the repo; scratchpad-only deliverable; the receipt
`laneTCRINST5-receipt.md` holds the round-by-round log and the resume points. The dossier
is regenerated only by `RINST5-merge/assemble.sh` over `head.md` + `sec-*.md` — it is never
hand-edited (the R-INST-4 method). Charter: `docs/DESIGN_DWELLINGS_PROGRAM.md` §2 (the nine
laws), §3 (the thirteen-system weave), §4 S6 (circulation classes ODQ §452; storage and
service classes ODQ §453), §5 (data contracts), §8 (the corpus program — R-INST-5 is named
there as "MAGICAL/fantasy institutions (the fiction-and-lore leg)"), §13 (anti-scope), §15
P1a–P1d; ODQ §435–§438, §452, §453, §456, §462, §482, §484, §485. Sibling dossiers read for
boundaries and hand-offs: `draft-R-INST-1-CIVIC-DEFENSE.md`,
`draft-R-INST-2-TRADE-CRAFTS.md`, `draft-R-INST-3-FAITH-LEARNING.md`,
`draft-R-INST-4-HOSPITALITY-POVERTY-UTILITY.md` (the style and depth template) and
`draft-R-INST-CIRC-ADDENDUM.md`.

**THE THREE DISCIPLINES THAT BIND THIS TRANCHE (charter §8, verbatim in force).**
(1) **Conventions, never expression.** Genre tropes and functional expectations are
research; no protected text, name, creature or cosmology is copied. Where a game or a novel
is cited it is cited as ONE convention among several, by title and author, with no text
reproduced beyond a short attributed phrase.
(2) **The deity doctrine, extended to magic.** `deity-doctrine-no-premade-pool.md` rules
that faith is culture and never theology; the same law governs magic here. **MAGIC IS A
PRACTICE WITH A BUILDING PROGRAM, NEVER A METAPHYSICS.** This dossier describes rooms,
fixtures, hazards, circulation, storage, siting and live/work. It does not say what magic
is, how it works, where it comes from, or what it costs a caster. There is no spell system,
no school of magic, no named creature, no deity, no plane and no cosmology anywhere in it —
and the one place the catalog names a specific setting in its own prose (`Airship docking
(high magic)`: "Eberron-style") is reported as a CATALOG DEFECT under
`product-scope-boundaries.md`'s sixth boundary, not adopted.
(3) **Finite semantics.** Every finding lands as a closed enum the clerk composes from
(`finite-semantics-law.md`); the AI is a bucketing clerk and never a writer.

**Setting-agnostic law (product-scope-boundaries.md, the 6th boundary).** The product targets
ANY medieval-inspired campaign, including a world made entirely of clouds. Every parti below
must therefore survive a cosmology with no geology and no named pantheon. The acceptance test
applied per family: *does the room program survive if the magic is deleted and only the
practice remains?* Where the answer is no, the entry is marked as licensed BY the magic dial
and the dial is reported, never invented.

**Morphology and labelling.** Morphology is `EUROPEAN_FANTASY_BASE`: every cited building is
a BOUNDED POSSIBILITY or a COUNTEREXAMPLE, never a prevalence prior, and this dossier mints
NO probabilities. **CONFIRMED** = a source fetched by this lane this session (URL inline,
"fetched 2026-08-23"). **CONFIRMED-digest** = the claim came back in a search-engine digest
quoting the page; the page itself was never opened, so it is never quotable as primary.
**CONVENTION** = a genre expectation, reported as convention and NEVER as CONFIRMED, however
many sources repeat it — a trope's ubiquity is evidence about publishing, not about
buildings. **PLAUSIBLE** = this lane's synthesis or training knowledge, given as a range and
never as a bare precise figure. Dates are absolute. A Cloudflare interstitial (a ~5.8 KB
"Just a moment" page from Historic England, ADS or BHO-search) is NOT a fetch and is labelled
GATED wherever it happened.

**THE THREE-DIRECTION METHOD (this tranche has no historical instances).** No purpose-built
wizard's tower, teleport-circle house or golem barracks has ever been excavated, because
none was ever built. Every family is therefore answered from three directions, each
separately labelled and never blended:
1. **THE HISTORICAL ANALOGUE** — the real building the fantasy type is drawn from, with
   measured figures wherever a primary has them. This is the only direction that can carry
   a CONFIRMED label.
2. **THE GENRE CONVENTION** — what a reader or player expects the building to contain,
   sourced from genre-neutral description and cited as one convention among several. Always
   labelled CONVENTION.
3. **THE ENGINE'S OWN CONTRACT** — what the live code does with these entries TODAY. Read
   this session in the clean tree; see the recon block below.

**Catalog source of record.** `src/data/institutionalCatalog.js` in the clean read-only tree
`chair-baseproof-b10ed1a1` (2,526 lines; 311 entries; tier blocks thorp L6–154 · hamlet
L155–434 · village L435–890 · town L891–1538 · city L1539–2248 · metropolis L2249–2526). The
flat table `RINST2-catalog-flat.tsv` (311 rows) was read whole and every candidate row was
then re-read in the source file at its line number. Selection is by SHELF (the whole `Magic`
shelf, 21 rows; the whole `Exotic` shelf, 7 rows) plus the four `Adventuring` rows the
sibling tranches handed here, plus a 31-token name/desc keyword sweep over all eleven
shelves (magic, arcane, wizard, mage, alchem, enchant, sorcer, scry, divin, astrolog,
occult, witch, rune, scroll, golem, undead, planar, portal, teleport, airship, dream,
familiar, ward, grove, druid, oracle, seer, hermit, sage, observator, laborator). The sweep
returned no in-tranche row the shelf pass had missed; its extra hits are all substring false
positives ("ward" inside reeve/steward/administration, "sage" inside passage/message, "mage"
inside pilgrimage/image) and are listed at §0.1b. `priorityCategory` is the faction-role
axis and is ignored for selection (R-INST-1's rule): `Elder Grove Council`, whose faction
role is `military`, is a grove council.

**ENGINE RECON (read-only, this lane, CONFIRMED by reading the files at
`chair-baseproof-b10ed1a1`).** Five findings, each load-bearing for §Σ.

1. **The interior grammar.** `src/domain/interior/interiorTemplates.js` ("THE KEYED SCALE",
   DOOR 3) holds `INTERIOR_KINDS` = faith · security · trade · craft · learning · vice ·
   civic · generic; `ROOM_KINDS` (28 members: nave, sanctuary, vestry, muster, armory, cells,
   quarters, hall, counting, strongroom, stall, workfloor, store, kiln, reading, stacks,
   study, common, kitchen, cellar, lodging, chamber, records, dais, main, back, evidence,
   concealed); `FURNISHING_KINDS` (22 members: table, bench, pew, altar, brazier, shelf,
   lectern, desk, counter, strongbox, ledger, workbench, hearth, rack, crate, barrel, bar,
   bed, bunk, dais, cell, cauldron); and `FUNCTION_VARIANT_ROOM` with exactly four keys
   (heals → `quarters`, feeds → `store`, arms → `armory`, judges → `chamber`). **There is no
   arcane interior kind, no laboratory, furnace, tower-chamber, circle, vault, mews, stable,
   reagent-store, workroom, observatory or gallery room kind, and no alembic, still, athanor,
   furnace, circle, orrery, cage, perch, plinth or lectern-of-the-circle furnishing kind.**
   The whole tranche must therefore be typed as NO TYPED HOME except where noted per entry.
2. **The nature facet is inferred by unanchored regex over `name + type + category`**
   (`src/domain/spatial/cohesionWeave.js` `FACET_INFERENCE`, L258–276; the chokepoint
   `facetOf` at L315 is DECLARED ?? INFERRED ?? null). Simulated by this lane over the 32
   roster NAMES ONLY (`RINST5-facetsim.cjs`, executed with node; the live record's `type` and
   `category` fields were not exercised, so the result is PLAUSIBLE-by-simulation, not a
   claim about a live run): **21 of the 32 fall to `generic`**, and three fall to a WRONG
   template through an unanchored substring —
   `Warden's Lodge` → `vice` (the `/den/` alternative matches inside "War**den**"),
   `Dragon resident` → `vice` (inside "resi**den**t"),
   `Charlatan fortune tellers` → `security` (the `/fort/` alternative matches inside
   "**fort**une"). A ranger station and a fairground booth today draw the TAVERN and the
   BARRACKS room set respectively. The estate already learned this lesson once and fixed it
   in the sibling detector: `arcaneInstitutionIdentity.js` anchors every keyword at `\b`
   precisely because "mage" sits inside "PILGRIMAGE" (its own header says so). The anchoring
   was never carried across to `FACET_INFERENCE`. Flagged at §Σ as engine-gap G1.
   The eleven that DO infer: `Adventurers' charter hall` ×3 and `Elder Grove Council` →
   `civic`; `Mages' guild` and `Multiple adventurers' guilds` → `trade`; `Academy of magic`
   and `Great library` → `learning`; plus the three mis-inferences above and one function
   facet, `Healer (divine, 1st level)` → `heals`.
3. **The magic-off strip is BINARY and lives OFF the generation path.**
   `src/domain/magicFilter.js` `noMagicWorld()` fires only when `magicExists === false` or
   `priorityMagic === 0`; `isArcaneInst()` then strips a row when its SHELF is `magic` or
   `exotic`, or its tags intersect `ARCANE_INST_TAGS` = [arcane, planar, alchemy,
   enchanting], or its name contains one of the 38 `ARCANE_INST_KW` keywords. Simulated over
   the roster: **28 of the 32 vanish at magic=0** — the four survivors are the three
   `Adventuring`-shelf rows with no arcane keyword (`Adventurers' charter hall` town L1394,
   `Charlatan fortune tellers` L1401, `Beast trainers` L1408) and `Multiple adventurers'
   guilds` L2110. `filterCatalogForMagic` is called from exactly two places —
   `src/components/InstitutionalGrid.jsx:406` and `src/store/selectors.js:87` — and from
   NEITHER generation step, so it is a UI/selector strip, not a world law.
4. **The graded magic license is a keyword table in
   `src/generators/institutionProbability.js`.** Read this session: (a) a row whose SHELF
   contains `magic`, or whose NAME contains wizard|mage|alchemist|enchant|spell|arcane|
   teleportation|planar, is multiplied by `priorityMagic / 50` times a TIER PENALTY
   {thorp 0.15, hamlet 0.25, village 0.40, town 0.75, city 1.00, metropolis 1.00};
   (b) a DRUID row (name contains druid | grove shrine | warden's lodge | sacred grove |
   elder grove) gains a route boost {isolated 1.8, road 1.4, river 1.5, crossroads 0.9,
   port 0.8} and ×1.5 for a `magical_node` resource; (c) **a HARD ZERO below
   `priorityMagic` 66** for eleven keywords (airship, golem, undead labor, dream parlor,
   magical banking, message network, planar, teleportation, magic item consignment,
   enchanting quarter, high magic) — which zeroes nine of this tranche's rows; (d) ×1.8 at
   `priorityMagic` ≥ 66 and ×0.3 at ≤ 25 for the Magic and Exotic shelves, with
   `NON_MAGIC_EXOTICS` = [dragon resident, underground city] explicitly exempted as
   "geographical, not magical"; (e) an isolation escape hatch: an isolated town-or-larger at
   `priorityMagic` ≥ 70 gets ×4 on teleportation/planar/airship; (f) the
   `Adventurers' charter hall` monsterThreat gate ×5 plagued / ×3 frontier / ×0.3 otherwise;
   and (g) a direct final gate at L302 zeroing any `isArcaneInstitution` row when
   `magicExists === false`. **The 66 threshold is exactly `getMagicLevel`'s `high` band
   boundary** (`src/data/constants.js:37`: 0 → none, ≤25 → low, ≤65 → medium, else high), so
   the engine ALREADY has the four-band magic dial this dossier's licensing field needs — it
   simply is not exposed as a per-entry field.
5. **The catalog's own "(high magic)" rows are gated by `minTier`, not by magic.**
   `Dream parlors (high magic)`, `Airship docking (high magic)`, `Message network (high
   magic)` and `Dragon resident` all sit in the **city** block but carry
   `minTier: 'metropolis'`, so they can never fire at city tier. The name says magic; the
   record says population. Both gates exist, in different files, and neither is declared on
   the entry. Flagged at §Σ as engine-gap G2.

**Search-budget law.** Ceiling 45 WebSearch and 60 WebFetch for the whole lane; `curl -L -A
"Mozilla/5.0"` for PDFs that 403, then a pypdf extract to `RINST5-<fam>-<name>.txt`. A family
stops when two consecutive rounds add nothing. Exact counts are in §M and the APPENDIX.

---

## §0 · THE ENUMERATED ROSTER (printed before research; grep-complete over all six tier blocks)

### §0.1 IN-TRANCHE ENTRIES — 32 entries in 11 families

| # | Tier | Line | Entry | Shelf | tags | priorityCategory | baseChance / gate | Family | Catalog desc (verbatim, for the analogue test) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | hamlet | L303 | Traveling hedge wizard | Magic | arcane | magic | 0.20 | A | Occasional visits. 1st level spells only. |
| 2 | hamlet | L310 | Adventurers' charter hall | Magic | military, adventuring | military | 0.12 | I | A rough hall operating under a regional adventurers' charter. Posts bounties, shelters monster hunters, and coordinates local defense when the garrison cannot. Common on dangerous frontiers. |
| 3 | village | L804 | Hedge wizard | Magic | arcane | magic | 0.30 · excl. `magicalAuthority` | A | Low-level resident caster. 1st-3rd level spells. |
| 4 | village | L812 | Druid Circle | Magic | arcane, religious | magic | 0.20 | E | A circle of druids tied to the land. They regulate the seasons, mediate disputes with wild creatures, and know which streams run clean. More common in forested or isolated settlements, but they adapt. Some circles tend city gardens or hidden urban groves. |
| 5 | village | L819 | Adventurers' charter hall | Magic | military, adventuring | military | 0.20 | I | A licensed charter hall providing bounties, monster-hunting coordination, and emergency armed response for the surrounding territory. More common in frontier regions. |
| 6 | village | L826 | Healer (divine, 1st level) | Magic | divine, healing | religion | 0.40 | A | Basic healing spells. Cure Wounds (10 GP). |
| 7 | town | L1340 | Wizard's tower | Magic | arcane | magic | 0.20 · excl. `magicalAuthority` · forbids `isolated` | A | Individual wizard residence. 1,000+ population viable. |
| 8 | town | L1349 | Elder Grove Council | Magic | arcane, religious | military | 0.15 | E | A council of senior druids who govern their circle's relationship with the city. They may maintain a hidden grove beneath the streets, mediate between urban expansion and wild places, or serve as ecological advisors to the ruling authority. Found in cities that have made peace with nature magic. |
| 9 | town | L1356 | Alchemist shop | Magic | arcane, alchemy | magic | 0.40 · forbids `isolated` | B | Potions, alchemical items. Basic healing potions (50 GP). |
| 10 | town | L1364 | Warden's Lodge | Magic | arcane, military | magic | 0.20 | I | A ranger station or druid waypost. They monitor the surrounding wilderness, maintain trails, and keep tabs on beast migrations. In times of crisis they serve as emergency scouts and trackers. |
| 11 | town | L1371 | Teleportation circle | Magic | arcane, exotic | magic | 0.08 · ZEROED below `priorityMagic` 66 | F | Rare permanent circle. Extremely expensive to construct and maintain. Requires magical expertise beyond typical town resources. |
| 12 | town | L1394 | Adventurers' charter hall | Adventuring | military, adventuring | military | 0.30 | I | A chartered hall serving as the primary adventuring hub for the region. Posts contracts, grades monster threats, maintains gear, and coordinates large-scale operations that militia cannot handle. |
| 13 | town | L1401 | Charlatan fortune tellers | Adventuring | — | adventuring | 0.30 | H | Non-magical 'divination' using Deception. 1-5 GP. |
| 14 | town | L1408 | Beast trainers | Adventuring | — | adventuring | 0.30 | K | Common animals only. Horses, dogs, falcons. |
| 15 | city | L1882 | Wizard's tower | Magic | arcane | magic | 0.40 · excl. `magicalAuthority` | A | High-level spellcaster residence. Multiple towers possible. |
| 16 | city | L1891 | Mages' guild | Magic | arcane, guild | magic | 0.30 | C | Organization of magic users. 2,000-5,000 population for chapter. |
| 17 | city | L1899 | Alchemist quarter | Magic | arcane, alchemy | magic | 0.50 | B | Multiple alchemical workshops. Guild organization. |
| 18 | city | L1907 | Enchanter's shop | Magic | arcane, enchanting | magic | 0.40 | D | Magic item creation. 5,000+ population typically. |
| 19 | city | L1915 | Scroll scribe | Magic | arcane | magic | 0.50 | D | Spell scrolls for sale. 25 GP (cantrip) to 500+ GP (3rd level). |
| 20 | city | L1923 | Teleportation circle | Magic | arcane, exotic | magic | 0.15 · ZEROED below 66 | F | Permanent teleportation circle. Access is controlled and expensive to maintain. Transformative infrastructure for any settlement lucky enough to have one. |
| 21 | city | L2110 | Multiple adventurers' guilds | Adventuring | — | adventuring | 0.70 | I | Competing organizations. |
| 22 | city | L2141 | Planar traders | Exotic | planar, trade | exotic | 0.30 · ZEROED below 66 | J | Goods from other planes of existence. |
| 23 | city | L2149 | Dragon resident | Exotic | — | exotic | 0.10 · `minTier: metropolis` · exempt from the magic scale | K | Ancient wyrm living in city. |
| 24 | city | L2157 | Golem workforce | Exotic | arcane | exotic | 0.20 · ZEROED below 66 | G | Constructed servants if magic permits. |
| 25 | city | L2164 | Undead labor | Exotic | arcane | exotic | 0.10 · ZEROED below 66 | G | Animated corpses working. Controversial. |
| 26 | city | L2171 | Dream parlors (high magic) | Exotic | arcane, exotic | exotic | 0.20 · `minTier: metropolis` · ZEROED below 66 | H | 5th level Dream spell experiences. Lucid shared dreams, communication. |
| 27 | city | L2179 | Airship docking (high magic) | Exotic | arcane, exotic | exotic | 0.10 · `minTier: metropolis` · ZEROED below 66 | F | Mooring towers with magical weather protection. Eberron-style. |
| 28 | city | L2187 | Message network (high magic) | Exotic | arcane, exotic | exotic | 0.30 · `minTier: metropolis` · ZEROED below 66 | F | Sending Stones network or Speaking Stones. 250-10,000 GP per station. |
| 29 | metropolis | L2332 | Academy of magic | Magic | arcane, education | exotic | 0.40 | C | Formal institution of arcane learning. Full curriculum, research facilities, visiting scholars. |
| 30 | metropolis | L2340 | Mages' district | Magic | arcane | exotic | 0.45 | C | Quarter inhabited by arcane practitioners: towers, workshops, libraries, reagent merchants. |
| 31 | metropolis | L2348 | Great library | Magic | education, education (duplicated) | exotic | 0.40 | J (BOUNDARY — the library parti is R-INST-3 family M's) | Largest repository of knowledge in the region: thousands of volumes, map archives, historical records. |
| 32 | metropolis | L2356 | Planar embassy | Magic | arcane, planar, exotic | exotic | 0.15 · ZEROED below 66 | J | Formal diplomatic mission from a planar power. Trade, information, occasional intervention. |

Shelf arithmetic, stated so a successor can re-derive it: `Magic` shelf 21 rows, ALL 21
in-tranche (rows 1–11, 15–20, 29–32). `Exotic` shelf 7 rows, ALL 7 in-tranche (rows 22–28).
`Adventuring` shelf 9 rows, 4 in-tranche (rows 12, 13, 14, 21) and 5 excluded at §0.1b.
21 + 7 + 4 = 32. Hand-offs honoured: R-INST-4 §0.1b handed rows 13, 14, 21, 26; R-INST-3
§0.1 handed row 30 outright and the magical halves of rows 4, 6, 8, 29, 31; R-INST-1 §0
handed the druidic-waypost half of row 10 and excluded row 8 to here. No REQ row is
in-tranche: **not one of this tranche's 32 entries is required at any tier** — the whole
magical leg is optional content, which is itself a §Σ finding.

### §0.1b EXCLUDED WITH REASON — 14 rows checked in the file and not taken

| Tier | Line | Entry | Shelf | Reason |
|---|---|---|---|---|
| city | L2118 | Mercenary quarter | Adventuring | R-INST-1 families L/M (company quarters) — a sellsword company is not an arcane institution |
| city | L2125 | Dungeon delving supply district | Adventuring | R-INST-2 family B (the shop-house / retail district); its stock is magical, its BUILDING is a shop row |
| city | L2132 | Sage's quarter | Adventuring | R-INST-3 family N (the scholar's house: observatory + library + workshop). R-INST-3 pointed only "the oracle's RITE" here, and a rite is not a building — it is answered as a fixture note in §E(i) |
| town | L1387 | Hireling hall | Adventuring | R-INST-4 family D (hosted; the statute fair and the inn as labour exchange) |
| town | L1380 | Merchant warehouses | Adventuring | R-INST-2 (warehouse family) despite the Adventuring shelf |
| village | L567 | Apothecary | Crafts | R-INST-2 family B′ — the apothecary's shop-house is the ALCHEMIST SHOP's own analogue and is cited by pointer in §B rather than re-researched |
| city | L1656 | Apothecary district | Economy | R-INST-2 family B′ (same) |
| metropolis | L2348 | Great library | Magic | HELD by R-INST-3 family M for the library parti. Taken here ONLY as a boundary statement (§J) — this dossier adds the arcane-collection question and nothing about shelving, pitch, light or fire law, all of which are R-INST-3's and are cited, not restated |
| village | L731 | Woodcarver | Crafts | R-INST-2 — the keyword hit is "i**mage**s" in the catalog's own desc |
| metropolis | L2306 | Great cathedral | Religious | R-INST-3 — the keyword hit is "i**mage**s" |
| village | L508 · town | L1029 | Toll bridge · Post relay station | Economy | R-INST-1 / R-INST-4 — the keyword hit is "pas**sage**" / "mes**sage**" |
| village | L880 · town L1454 · city L2010 | Underground network · Rookery ×2 | Criminal | R-INST-6 — the keyword hit is "pas**sage**"/"mes**sage**" |
| thorp L24 · hamlet L259 · village L778 | Lord's reeve · Lord's steward ×2 | Government | R-INST-1 — the keyword hit is "ste**ward**" / "**ward**" |
| city | L1842 | City administration | Government | R-INST-1 — the keyword hit is "**ward**s" in the desc |

**Absent from the catalog** (searched for and genuinely not there; each is a §Σ note, not a
research family): observatory as its own row · laboratory as its own row (the Alchemist shop
is the nearest) · scriptorium as its own row (R-INST-3 holds the monastic one) · hermitage /
anchorhold · oracle or seer's house · astrologer · witch's cottage · a summoning or binding
house · a magical prison or warded gaol (R-INST-1's prison row carries no arcane variant) ·
a reagent farm or herb garden as an institution · a magical-node shrine · a portal gate in a
wall · a golem workshop distinct from the golem WORKFORCE · a necropolis or bone-yard serving
the undead-labour row · a familiar-breeder · an airship YARD distinct from the docking row ·
any magical entry below hamlet tier (the thorp block has NO Magic shelf at all — the arcane
world begins at hamlet).

### §0.2 THE FAMILIES (research units; per-tier distinctions inside each)

| Family | Members (tier) | The historical ANALOGUE researched | The GENRE CONVENTION tested |
|---|---|---|---|
| A the practitioner's house and the tower | Traveling hedge wizard (hamlet L303) · Hedge wizard (village L804) · Healer divine (village L826) · Wizard's tower (town L1340, city L1882) | the tower house and the solar tower (Tattershall; the Italian torri); the astronomer's purpose-built observatory (Uraniborg/Stjerneborg; Flamsteed House); the scholar's study-chamber; the cunning-woman's cottage | the tower with the study at the top, the library, the laboratory below, the vault beneath |
| B the laboratory and the alchemist | Alchemist shop (town L1356) · Alchemist quarter (city L1899) | the apothecary's shop-house (R-INST-2 B′, by pointer) and the early-modern chemical laboratory: furnace programs, the athanor, fume and fire hazard, water supply, the distillation bench | the bubbling shop front, the back workroom, the reagent store, the explosion |
| C the guild, the academy and the district | Mages' guild (city L1891) · Academy of magic (metropolis L2332) · Mages' district (metropolis L2340) | the university college and the Inns of Court (quad, hall, chapel, library, chambers-on-staircases) — R-INST-3 family L holds the collegiate parti and is cited, not restated; the guild hall (R-INST-1) | the academy campus; the quarter of towers and workshops |
| D the scriptorium, the scroll-shop and the enchanter's shop | Scroll scribe (city L1915) · Enchanter's shop (city L1907) | the stationer's and limner's shop; the chained library and the scriptorium (R-INST-3 M, by pointer); the mint and the assay office as the type of a small, secure, licensed, fire-and-metal workroom | the scroll rack; the enchanting bench and its cage |
| E the circle, the grove and the open-air site | Druid Circle (village L812) · Elder Grove Council (town L1349) | the stone circle and henge as a SITE with circulation (bank, ditch, avenue, entrance causeway); the sacred grove/temenos; the moot ring — as ground, never as theology | the ring of stones, the hidden urban grove, the council under the tree |
| F the infrastructure of high magic | Teleportation circle (town L1371, city L1923) · Airship docking (city L2179) · Message network (city L2187) | the semaphore/optical-telegraph station and the post relay; the airship shed and the mooring mast; the harbour quay and the customs point; the town gate as a controlled threshold | the glowing floor circle in its guarded chamber; the mooring tower; the sending-stone station |
| G the constructed and the undead workforce | Golem workforce (city L2157) · Undead labor (city L2164) | treated CLINICALLY: the barrack block, the stable range, the tool house and the mortuary/charnel — the three real building programs a non-eating, non-sleeping workforce would collapse into | the golem hall; the corpse-gang and the town's disgust |
| H the parlour and the booth (hosted) | Charlatan fortune tellers (town L1401) · Dream parlors (city L2171) | the fairground booth and the mountebank's stage; the coffee house and the smoking room as the hosted-consumption parlour | the curtained booth; the dream couch |
| I the lodge and the charter hall | Warden's Lodge (town L1364) · Adventurers' charter hall (hamlet L310, village L819, town L1394) · Multiple adventurers' guilds (city L2110) | the forest lodge and the verderer's/woodward's house of the royal forest; the shooting-guild doelen (R-INST-1 family L holds the hall itself and is cited, not restated) | the guild hall with the bounty board, the trophy wall and the training yard |
| J the planar seam and the great library boundary | Planar embassy (metropolis L2356) · Planar traders (city L2141) · Great library (metropolis L2348, BOUNDARY ONLY) | the resident embassy and the ambassador's house; the fondaco/steelyard as the foreign nation's walled compound with its own gate, chapel, warehouse and lodging | the embassy of an impossible country; the library that holds what should not be read |
| K the beast-keeper and the resident wyrm | Beast trainers (town L1408) · Dragon resident (city L2149) | the mews (falconry), the kennel, the stable range, and the royal menagerie (the Tower of London's Lion Tower) | the monster stable; the wyrm that occupies a quarter of the city |

### §0.3 STATUS MAP (kept current; honest, not aspirational)

**ELEVEN of eleven families WRITTEN. Six at FULL depth; five AT DEPTH FOR ANALOGUE and PARTIAL
FOR MEASUREMENT, each with the owed item named in its own (b) and in §L.** Every family carries
the full briefed shape — (a) analogue · (b) measured · (c) contested and counterexamples with the
negation result · (d) circulation typology (ODQ §452) · (e) storage typology (ODQ §453) ·
(f) typed proposal with the BUILDING / HOSTED / NO_BUILDING verdict per tier and the HOME tags ·
(g) consequences for the grammar · (h) continental versus English · (i) the FANTASY NOTE, which in
this tranche carries BOTH the genre convention AND the engine contract read from live code. Also
complete: §1 (seven anchor findings), §15 (the continental and non-European register), §Σ (the map
over all nine laws, eight engine-gap flags, fourteen grammar requests and the 32-entry verdict
table), §L (54 numbered items, built by script over 69 marker sentences), §M (method with exact
counts and a correction to this lane's own earlier figure) and the APPENDIX (all 31 queries and
all 16 fetch acts, generated from the call log).

**What is NOT here, stated positively rather than padded.** Five families reached no measured
dimension and say so in their own (b). Roughly half the dossier's load-bearing claims are
CONFIRMED-digest rather than CONFIRMED — eight pages were opened all session — and §M.5 gives the
exact ratio and §L.3 lists the digest-only figures by name. Three families (C, F, H) had no
DEDICATED negation query and each says so in its own (c). And the FACET_INFERENCE mis-inferences
are PLAUSIBLE-BY-SIMULATION: the table was read from the file and run over the roster NAMES, and
the live record's `type` and `category` fields were not exercised (§L item 53 names the experiment
that would settle it).

| Family | Status | Note |
|---|---|---|
| A the practitioner's house and the tower | **FULL** (§2) | Uraniborg's 21 named cells and its precinct; Tattershall digest-only (both source pages blocked); the observatory-was-a-room negation landed; NO measured stair anywhere (L.1) |
| B the laboratory and the alchemist | **FULL** (§3) | the sixteen itemised furnaces, the niches, the ring table, the Winter-Room stair and the five migrated ovens, the through-window condensers, the excavated waste vault; Oberstockstall; Leiden's one chimney; Boerhaave's 24 × 24 × 37 cm furnace. Libavius's room list is the tranche's biggest blocked document (L.2) |
| C the guild, the academy and the district | AT DEPTH, **PARTIAL (measurement)** (§4) | the staircase-and-sets module and the New College programme; a correction-candidate to the charter's own §4 S6 corridor aside; NO measured collegiate figure (L.4) |
| D the scriptorium, the scroll-shop and the enchanter | AT DEPTH, **PARTIAL (measurement)** (§5) | the Paris book streets and Goldsmiths' Row (ten houses, fourteen shops); the assay circuit; the best HOME coverage in the tranche (7 of 9); no measured shop plan (L.5) |
| E the circle, the grove and the open-air site | **FULL** (§6) | Avebury measured and its bank height audited and reconciled; **the druid negation, the tranche's sharpest finding**; the conditional law-7 verdict for the hidden urban grove |
| F the infrastructure of high magic | **FULL** (§7) | Cardington audited across two dates; the 61 m mooring mast; Chappe's station in a chamber of a house; the only family that fails the setting-agnostic test outright |
| G the constructed and the undead workforce | AT DEPTH, **PARTIAL (measurement)** (§8) | the ergastulum (contested identification, reported as such); Rothwell 9 × 4 × 2.5 m for c. 2,500; the tranche's only corridor; no ergastulum cell size (L.7) |
| H the parlour and the booth | AT DEPTH, **PARTIAL (measurement)** (§9) | the canvas booth as the paying-audience mechanism and its one datum (41s 6d, 1614–15); the coffee house's long table and payment kiosk; no dimension of any kind (L.8) |
| I the lodge and the charter hall | **FULL** (§10) | Higham's 130 × 90 m platform and its asymmetric moat; Bradgate's three-bay base-cruck lodge; eminence-and-moat siting; **the charter hall's shelf artefact with two live behaviours** (§Σ G4) |
| J the planar seam and the great-library boundary | **FULL** (§11) | the Fondaco's 56 rooms, five-bay loggia, courtyard well and weapons ritual; the embassy-is-a-lent-palace negation; the Great library boundary stated and its shelf-versus-tag divergence traced (§Σ G5) |
| K the beast-keeper and the resident wyrm | AT DEPTH, **PARTIAL (measurement)** (§12) | the mews named for the moult and converted to stables in 1548; the 40 × 20 ft elephant house — the family's one measured cell; **the dragon's verdict is OCCUPATION, and the engine's own NON_MAGIC_EXOTICS already agrees** (L.10) |

(research sections follow — §1 the magical spine; §2–§12 the eleven families A–K; §15 the continental and non-European register; §Σ the nine-law map, the engine-gap flags and the 32-entry verdict table; §L the open-questions ledger; §M the method disclosure; the APPENDIX of searches and URLs)

---

## §1 · THE MAGICAL SPINE — the seven anchor findings this tranche stands on

Seven results, chosen because each is the best-sourced statement in its area, each changes what
the grammar should do, and each was reached by the three-direction method rather than assumed.
Every one is labelled and every one is elaborated in the family section named beside it.

**§1.1 · There is exactly ONE itemised magical-practice interior in the European record, and it
is a cellar under a parlour.** (Family B, and family A for the house round it.) Tycho Brahe's
laboratory at Uraniborg held "no less than 16 ovens", which Brahe listed himself — three
bath-heaters, one ash-digesting furnace, four large athanors, two small, two sand-or-ash
distillation furnaces, one worked by a two-pipe bellows, one fitted with lamps, and two
reverberatory furnaces, one direct and one spiral. "Each oven stood in its own niche" and "there
was a circular working table around the central column of the vaulted room". A spiral stair ran
directly down into it from the Winter Room, the family's daily living room — and after some
years five more ovens were set up IN THE WINTER ROOM ITSELF "to avoid too much running up and
down the staircase when an experiment had to be supervised". The condensers were "lead through
the windows out into the cool open air and back"; the laboratory adjoined the wine cellar; the
waste went to "a separate vaulted cellar … outside the palace proper" that excavation found full
of broken retorts, charcoal and sulphur. (CONFIRMED, Kjærgaard et al., *npj Heritage Science*
2024, curl-fetched 2026-08-23; the count 3+1+4+2+2+1+1+2 = 16 checks against its own total.)
**Why it is the spine's first entry: it is simultaneously a room list, a fixture list, a
circulation joint, a storage prohibition, a hazard profile and a live/work law, and it is the
only such document the tranche has.**

**§1.2 · The infrastructure of a new practice starts in somebody else's room — three independent
negations returned the same shape.** (Families A, F, J.) The observatory before Tycho was a top
room: Oxford's first Professor of Astronomy "was allowed to use the top room of the gate tower of
the newly-erected Schools Quadrangle rather than having a purpose-built observatory supplied by
the University", and telescopes were used "from balconies or windows" with "small platforms"
added (CONFIRMED-digest). Europe's first long-distance signalling network ran out of "one of the
chambers of ladite maison" with a clock and a telescope (CONFIRMED, johnhearfield.com). The
resident embassy, from its invention in 1455, occupied a lent house — the Palazzo Loredan
dell'Ambasciatore "was not purpose-built as an embassy but rather repurposed from an existing
private residence", offered by the Doge in 1752 "in exchange for 29 years of restorations"
(CONFIRMED, Wikipedia, fetched 2026-08-23). **Three families, three separate negation searches,
one answer. The grammar consequence is a LADDER whose bottom rung is always HOSTED**, and a
generator that gives every arcane institution its own building has skipped the rung the evidence
is most confident about.

**§1.3 · Druids did not build stone circles, and the correct relation is OCCUPATION.** (Family E,
and then families G, J, K.) The chronology is decisive — Stonehenge's principal phases "predate
the historical Druids by more than two thousand years" — and the classical testimony points
elsewhere: "Classical authors referred to ancient druids worshipping only in wooded groves —
there is no mention of any link between druids and stone monuments." The association is John
Aubrey's and William Stukeley's, and Stukeley's motive is recorded: he "failed to find a
publisher for his serious books on the henge monuments", "so he revved up the story, brought in
Druids" (CONFIRMED-digest). **The finding generalised is the tranche's largest structural
request.** Four families arrived at it independently: the circle occupies a ring it did not build;
an undead-labour institution should point at an existing charnel or churchyard rather than
generate one; a planar embassy occupies a lent palace; and a resident dragon — for which no
enclosing structure has ever been built at any scale — occupies a ruin, a cistern, an
amphitheatre or an undercity void. **DW needs an OCCUPATION relation distinct from construction:
an institution whose plan is another building's plan, plus a few added cells, a changed control,
and dated modifications that are law-5 fossils running forward.**

**§1.4 · The flue caps the process, and the wall of niches is the ceiling.** (Family B, then A, F,
G.) Boerhaave designed a portable furnace — "roughly 24 by 24 centimetres wide and 37 centimetres
tall", 16 kg, oak with a sheet-iron lining — precisely because his room "only had one chimney,
whereas he wanted to perform various chemical experiments simultaneously"; the university
laboratory of the period "usually consisted of no more than one or two rooms, filled with various
brick furnaces" (CONFIRMED, PMC7540335, fetched 2026-08-23). At the other end of the ladder,
Uraniborg's sixteen furnaces each had their own niche in the wall of one vaulted room.
**`flueCount` is therefore a first-class structural bucket with a checkable validator arm
(`furnaces ≤ flues + portableFurnaces`), and the furnace NICHE is a third term between fixture
and cell — a `RECESS`: a countable, dateable, losable subdivision of wall thickness that makes
the best fossil in the corpus.** A blocked niche is a process that stopped, on a date.

**§1.5 · The single controlled entrance, reached five times by five routes.** (Families C, F, I,
J, K.) The collegiate precinct has one gatehouse with a porter and the muniment over it; the
teleport chamber's whole plan is an outer holding space, a controlled threshold and an officer's
cell; the moated lodge is entered by one causeway across a ten-metre ditch; the fondaco has one
land gate where "Germans had to perform a ceremonial handover of their weapons to the Fontegher,
the Venetian authority in charge of room assignments" (CONFIRMED, Wikipedia, fetched 2026-08-23);
and the Tower's menagerie is built INTO the barbican. **Two consequences.** First, `compound
.entrances: 1` deserves to be a first-class parti attribute rather than an emergent accident.
Second, and larger: **DW law 6 (frontage from the parcel) INVERTS for a precinct.** Every range of
a collegiate court faces the court; a moated platform has no street frontage at all; the fondaco
shows the street a wall and one gate. The frontage reader must be able to take an internal court
or a causeway as the frontage surface, with the street reduced to a single typed joint.

**§1.6 · Most of what sits on the catalog's Magic shelf is not magic.** (Every family; §Σ.) Of
the 32 entries in this tranche, this dossier assigns `magicLicense: NONE` to **eleven rows
covering nine distinct institutions** (§Σ.3's tally, counted off the verdict table): the alchemist
shop and the alchemist quarter (a real chemical trade with a real building), the charlatan fortune
tellers (the catalog itself says "non-magical"), the Warden's Lodge (a park lodge), the
adventurers' charter hall at all three of its tiers together with the city's multiple adventurers'
guilds (a shooting-guild hall), the beast trainers ("common animals only"), the dragon resident
(which the engine's own code already exempts as "geographical, not magical"), and the Great
library, which R-INST-3 holds and whose authored tags say `education`. Only ONE family
genuinely fails the setting-agnostic test outright: family F's teleport circle, airship dock and
message network, whose institutions cannot exist without the dial even though their PLANS survive
it intact. **The estate's own code has already ruled on this exact question** —
`arcaneInstitutionIdentity.js`'s header states that an institution "is NOT arcane merely for
sitting in the `Magic` or `Exotic` display bucket … the tag is the authored semantics, the bucket
is a shelf" — and this dossier endorses the ruling and reports the three live code paths that
still read the shelf as a gate (§Σ, gaps G3, G4, G5).

**§1.7 · The engine already has a graded magic dial and a good one; what it lacks is the entry's
own declaration.** (§Σ; every family's (i).) Read this session in
`src/generators/institutionProbability.js`: an arcane row is multiplied by `priorityMagic / 50`
times a TIER PENALTY of {thorp 0.15, hamlet 0.25, village 0.40, town 0.75, city 1.00, metropolis
1.00}; druidic rows take a route boost of {isolated 1.8, road 1.4, river 1.5, crossroads 0.9,
port 0.8} and ×1.5 for a `magical_node` resource; eleven high-magic keywords are HARD-ZEROED
below `priorityMagic` 66 — which is exactly `getMagicLevel`'s `high` band boundary
(`constants.js:37`: 0 none, ≤25 low, ≤65 medium, else high) — and an isolated town-or-larger at
`priorityMagic` ≥ 70 gets ×4 on teleport, planar and airship rows so that isolation can be solved
by magical transport. **Three of those eleven hard-zero keywords match no catalog row at all**
(`magical banking`, `magic item consignment`, `enchanting quarter` — proved this session by awk
over all 311 rows), and one of them is a member of `magicFilter`'s ARCANE_GOODS list, so a goods
vocabulary has leaked into an institution gate. **The recommendation is small and it follows from
the whole tranche: give each catalog entry a declared `magicLicense: NONE | LOW | MEDIUM | HIGH`
in the four tokens the engine already emits, and let the keyword tables become a fallback rather
than the law** — the same shape of cure the estate applied when it made the authored tag outrank
the keyword for arcane identity.


---

## §2 · FAMILY A — the practitioner's house and the tower: Traveling hedge wizard (hamlet L303 "Occasional visits. 1st level spells only.") · Hedge wizard (village L804 "Low-level resident caster. 1st-3rd level spells.") · Healer (divine, 1st level) (village L826 "Basic healing spells. Cure Wounds (10 GP).") · Wizard's tower (town L1340 "Individual wizard residence. 1,000+ population viable."; city L1882 "High-level spellcaster residence. Multiple towers possible.")

**(a) Analogue.** This family's four entries are ONE type at four rungs, and the historical
analogue splits them at exactly the place the catalog does: the practitioner below tower
grade has NO BUILDING OF HIS OWN, and the tower is what wealth buys.

**The floor is a visit, not a place.** `Traveling hedge wizard` is defined by the catalog as
"occasional visits", which is a SERVICE ARRIVING, not an institution standing. Its historical
counterpart is the itinerant specialist of the medieval and early-modern countryside — the
travelling barber-surgeon, the pedlar-apothecary, the circuit-riding notary, the
horse-leech — none of whom owned premises in the settlements they served. R-INST-4's family
D established the same verdict for the travelling performer and this tranche does not
re-derive it: the itinerant occupies the ground of the market, the churchyard or the inn's
common room and leaves. The `Hedge wizard` at village tier is the RESIDENT version, and the
resident version of a low-status specialist practice in the European register is a
DWELLING WITH A WORK CORNER, not a shop and not a hall. The cunning-folk of the English
countryside — a real, documented occupation from at least the sixteenth to the nineteenth
century — practised in their own cottages; the analogue building is DWR1A's cottage plus
R-INST-2's shop-house's front-room retail rung, and the arcane element is a FIXTURE SET
inside a dwelling, not a room programme. This lane makes no claim about the cunning-folk
literature beyond the pointer, because it did not fetch that literature (see §L).

**The healer is hosted, and the host is already written.** `Healer (divine, 1st level)`
carries `tags: ['divine','healing']` and sits on the Magic shelf. R-INST-3's family J holds
the faith half of this entry and gives it a HOSTED verdict in the church or the priest's
house; R-INST-4's family J holds the hospital. This dossier adds only what those two do not
cover: the SERVICE-COUNTER problem. A healer who charges a stated fee (the catalog says
10 GP) is doing retail, and retail wants a threshold a stranger can cross without entering a
household — the shop-house's front room, the church porch, the almshouse gate. The single
architectural consequence is a THRESHOLD CELL, not a building.

**The tower is the one rung with a real building — and the real building is a STATUS tower,
not a scholar's tower.** The catalog's two `Wizard's tower` rows say "residence" in both
descriptions, and that is historically exactly right: the type they draw on is the late-
medieval TOWER HOUSE, whose whole point is that a residence is stacked vertically for status
and defence. The best-documented English specimen is Tattershall Castle, Lincolnshire, built
c. 1440 for Ralph Cromwell, Lord High Treasurer — "one of the first domestic buildings in
England to make extensive use of brick", of red brick in English bond with darker lattice
lozenge decoration to the upper parts, ashlar dressings and leaded roofs; "5 storeys with an
undercroft", an irregular three-bay front with plinth, chamfered ashlar string course and an
embattled parapet on a machicolated base; a rectangular plan with facetted angle towers and
"originally with attached hall to courtyard side"; the undercroft carrying "a wide brick
segmental tunnel vault with chambers off" (CONFIRMED-digest, 2026-08-23, of the Historic
England list entry 1215317 and its britishlistedbuildings mirror — **both were BLOCKED to
this lane**: historicengland.org.uk returned a 5,582-byte Cloudflare "Just a moment"
interstitial, which is GATED and not a fetch, and britishlistedbuildings.co.uk returned 403,
so every Tattershall figure below is digest-grade and none of it is quotable as primary).
The three structural facts that matter to a grammar are: ONE PRINCIPAL ROOM PER FLOOR, a
stair inside the wall thickness, and an ATTACHED HALL that the tower does not replace — the
tower is the private end of a hall house set upright, which is why "residence" is the honest
word for it and "laboratory" is not.

**The vertical circulation is the type's defining fact.** Fieldwork on English castles finds
spiral stairs "predominantly in English castles, especially in towers of three or more
storeys", where they function as "vertical boundary markers, controlling access between
public and private spaces" from the eleventh century onward, and in the tower house proper
"inside there is a spiral staircase that connects each floor", sometimes as a square-plan
stair or in a rounded addition to the building (CONFIRMED-digest, 2026-08-23, of Ryan Lavelle
/ the University of Chester repository item "The spiral stair or vice: its origins, role and
meaning in medieval stone castles", https://chesterrep.openrepository.com/handle/10034/239772
— the repository record was NOT opened). The two-storey solar block, the tower's smaller
cousin, likewise puts its "spiral stairs within the wall thickness and large south-facing
windows to maximize natural light" (CONFIRMED-digest, same round). **Depth-of-climb IS the
access grade**: in a one-room-per-floor tower, the number of storeys you must pass is the
only privacy mechanism the plan has, and every room above the first is a through-room for
everything above it unless the stair is in the wall.

**The purpose-built practitioner's house exists exactly once, and it is the model for
everything the genre later drew.** Uraniborg on Ven, built 1576–1580 for Tycho Brahe by the
Danish court architect Hans van Steenwinckel to Brahe's own programme, is an astronomical
observatory AND an alchemical laboratory AND a dwelling AND a printing house in one precinct,
and its room list is the closest thing this tranche has to a source-of-record. The main
building "was square, about 15 meters on a side, and built mostly of red brick", with
semi-circular extensions north and south making the overall footprint rectangular; the GROUND
FLOOR "consisted of four rooms, one of which was occupied by Brahe and his family, the other
three for visiting astronomers"; the SECOND FLOOR held three rooms, "two of equal size and
one larger", the larger "reserved for visiting royalty"; the THIRD was "a loft, subdivided
into eight smaller rooms for students"; the towers reached only to the third-floor level and
"a single additional tower extended above the loft in the middle of the building, similar to
a widow's walk, accessed via a spiral staircase"; the NORTHERN rotunda held the kitchens, the
SOUTHERN rotunda "the library housing Brahe's study"; the BASEMENT held the "alchemical
laboratory at one end, and storage for food, salt and fuel at the other", together with "a
small prison room, in order to deal with disorderly tenants or guests"; balconies "supported
on wooden posts" carried the instruments, and at that level "the towers housed the primary
astronomical instruments, accessed from outside the building or from doors on this floor"
(CONFIRMED, [Wikipedia: Uraniborg](https://en.wikipedia.org/wiki/Uraniborg), fetched
2026-08-23). The 2024 npj Heritage Science study of the laboratory glass adds the plan
logic in one sentence: "The extension to the north contained kitchen and storerooms while the
south extension was totally reserved for scientific purposes. It had a library and 'museum'
on the ground floor and an alchemical laboratory in the basement" (CONFIRMED, Kjærgaard et
al., *npj Heritage Science* 2024,
[s40494-024-01301-6](https://www.nature.com/articles/s40494-024-01301-6), curl-fetched
2026-08-23 after WebFetch received a 303 to an authentication host; saved locally as
`RINST5-A-uraniborg-lab.txt`). **The precinct, not the house, is the type**: a planned wall
"75 meters on a side and 5.5 meters high" was designed but never built and an earth mound was
raised instead, with "extensive parterre garden between the mound walls and the building" and
"aquaculture ponds, whose overflow powered a paper mill". The second observatory,
Stjerneborg, founded 1584 eighty metres to the south, put its instruments UNDERGROUND in pits
"covered by opening shutters or a rotating dome in buildings built over the instrument pits",
which Brahe himself called "crypts".

**Live/work is not merely present, it is the type's governing fact.** Brahe and his family
lived on the ground floor of the building whose cellar was a sixteen-furnace laboratory, and
the paper's most useful sentence for a grammar is this: "A spiral staircase led directly from
the 'Winter Room', which was the daily living room of Tycho Brahe and his family, down into
the laboratory, and after some years a further five chemical ovens were even set up inside
the Winter Room itself to avoid too much running up and down the staircase when an experiment
had to be supervised" (CONFIRMED, the npj paper, fetched 2026-08-23). **The process invaded
the parlour because the process needed watching.** That is the single most transferable fact
in this dossier: a practice that must be supervised continuously drags its fixtures into the
living cell, and the plan records the invasion.

**Siting and anchor law.** Uraniborg is on an ISLAND, deliberately: the precinct is an
enclosure with a rampart and a garden, sited for sight-lines to the sky and for separation.
Tattershall is a lordly caput inside a moated enclosure. The tower house's siting rule is
prominence — it exists to be seen from a distance and to see. The catalog's own gate agrees
for the wrong reason: town-tier `Wizard's tower` carries `forbiddenTradeRoutes: ['isolated']`
(a population-and-supply gate), while the historical tower and the historical observatory
both WANT isolation. Flagged in (g).

**Prosperity and wear grades.** Floor = a visit (no cell). Rung 1 = a work corner in a
dwelling (fixtures only). Rung 2 = the hosted top room of somebody else's tower — Oxford's
first Professor of Astronomy, John Bainbridge, "was allowed to use the top room of the gate
tower of the newly-erected Schools Quadrangle rather than having a purpose-built observatory
supplied by the University" (CONFIRMED-digest, 2026-08-23; see (c)). Rung 3 = the tower house
proper, one room per floor over a vaulted undercroft. Rung 4 = the tower with an attached
hall (Tattershall's "attached hall to courtyard side"). Ceiling = the PRECINCT: house +
instrument galleries + laboratory cellar + library + student loft + garden + rampart +
outbuildings (Uraniborg). Decline sheds, in order: the outbuildings and the printing house;
the instrument galleries (they are timber on posts); the student loft; the laboratory (fuel
cost — see family B); and last the tower itself, which becomes a store or a dovecote and
stands for centuries after the practice ends.

**(b) Measured.**
- Tattershall Castle, c. 1440: five storeys plus undercroft; "approximately 33.5 meters (110
  feet)" high; base "about 17.5 meters by 23.7 meters"; walls "up to 4.15 meters thick at the
  basement level"; undercroft with a wide brick segmental tunnel vault and chambers off
  (ALL CONFIRMED-digest — the two source pages were GATED/403; no internal room dimension was
  obtained, and the internal clear span is NOT derivable from the external footprint because
  the facetted angle turrets are included in it. Number audit: 110 ft = 33.53 m, so the two
  figures are one figure, not two independent ones).
- Uraniborg, 1576–1580: main block "about 15 meters on a side" (CONFIRMED, Wikipedia) —
  **contested**: the round-1 search digest gave "16m x 16m, with a 19m tower and two small
  round towers to the north and south of 6m diameter (with cone shaped roof), surrounded by
  galleries for the instruments" (CONFIRMED-digest). One metre of disagreement on the square
  and a tower height and rotunda diameter that Wikipedia does not carry: report the RANGE
  15–16 m, and treat 19 m and 6 m as digest-grade.
- Uraniborg room counts (CONFIRMED, Wikipedia): ground floor 4 rooms; second floor 3 rooms;
  third floor a loft of 8 student rooms — **15 rooms on the three floors** — plus the kitchen
  (north rotunda), the library-and-study (south rotunda), the basement laboratory, the basement
  bulk store of food, salt and fuel, the small prison room, and the widow's-walk tower over the
  loft. **21 named cells**, counted this way and shown so a reader can re-count it; note that the
  laboratory sits in the southern rotunda's basement, so "rotunda" and "laboratory" are one
  vertical stack rather than two separate volumes.
- Uraniborg precinct: planned wall 75 m on a side, 5.5 m high (built as an earth mound);
  Stjerneborg 80 m to the south; the triangular sextant of 1582 "around 3.2 meters in
  diameter" — an INSTRUMENT dimension, which matters because the instrument sets the room
  (CONFIRMED, Wikipedia).
- Spiral stair: NO measured diameter or tread dimension was obtained this session. Searched
  ("medieval tower house solar chamber storeys spiral stair vice measured Vernacular
  Architecture"); the two best hits (the Chester repository thesis and an academia.edu paper
  "Internal Stairs in Domestic English Vernacular Buildings 1200–1650") were not opened. This
  is ledger item L.1 — the tranche's VERTICAL specimen has no measured stair.
- NOT FOUND, searched: any measured plan of a cunning-folk or hedge-practitioner cottage
  distinguishable from an ordinary cottage; any measured internal room of Tattershall; any
  purpose-built pre-Tycho observatory (see (c) — the null IS the finding).

**(c) Contested and counterexamples — the negation searches.**
(i) **"The observatory was a room, not a building."** Run as a dedicated negation search and
CONFIRMED-digest: "The first Professor of Astronomy at Oxford, John Bainbridge, was allowed
to use the top room of the gate tower of the newly-erected Schools Quadrangle rather than
having a purpose-built observatory supplied by the University"; when the telescope arrived in
the early seventeenth century "it allowed its use from balconies or windows due to its small
size, and observatories were built at this point with very simple structures, or small
platforms were added to place the new instrument"; and "the first major purpose-built
observatory was the idea of the Danish astronomer Tycho Brahe (1546-1601). Before this
development, observatories were more improvisational arrangements rather than dedicated
buildings" (CONFIRMED-digest, 2026-08-23, of
[worldhistory.org: Observatories in the Scientific Revolution](https://www.worldhistory.org/article/2309/observatories-in-the-scientific-revolution/)
and connectionsbyfinsa; NEITHER page was opened). **This is the family's decisive finding.**
The purpose-built practitioner's tower is a SIXTEENTH-CENTURY LUXURY with essentially one
European exemplar before 1600; everything earlier is a top room, a balcony, a leads, or a
platform. A world where every town of 1,000 has a wizard's tower is not a medieval world with
magic added — it is a world where the arcane practice is richer than the church, and the
grammar should be able to SAY that rather than assume it.
(ii) **Tattershall is a treasurer's status tower, not a scholar's.** Its programme is
lodging, display and defence; nothing in the list description is a work room. Using it as the
wizard's-tower analogue imports its VERTICAL DISCIPLINE (one room per floor, stair in the
wall, vaulted undercroft) and nothing else. The counterexample the genre actually needs — a
tower whose upper room is a WORK room — is Uraniborg's widow's-walk tower and Stjerneborg's
sunken crypts, both of which are OBSERVING platforms, and neither of which is habitable.
(iii) **The instrument, not the astronomer, sizes the room.** Stjerneborg exists because
Uraniborg's timber galleries shook: the instruments went underground "well protected against
the wind" (CONFIRMED-digest, round 1). A grammar that sizes an observing cell from the
practitioner's status rather than from the instrument's diameter will produce rooms that
could not have held the work.
(iv) **The catalog's `1,000+ population viable` is a claim this dossier cannot support or
refute.** It is a game-balance figure, not a historical one; the honest report is that the
one European purpose-built exemplar was royally funded on an island with about forty tenant
farms, so the constraint that actually bit was PATRONAGE, not population. Recorded as an
open question, not corrected.
(v) **Counter-counterexample, stated so the negation is not overread.** Non-European
purpose-built observatories predate Tycho by centuries — Maragheh (1259), Samarkand (1420s),
the Jantar Mantar series (1720s) — and are treated in §15. The negation is about the EUROPEAN
register only, and the setting-agnostic law makes that a CULTURE dial, not a fact about
worlds.

**(d) CIRCULATION typology (ODQ §452) — the tranche's VERTICAL specimen.**
The wizard's tower is the DW corpus's clearest case of a parti whose circulation IS its plan.
- `STAIR_HALL{VERTICAL}` — in the tower house the vice sits in the wall thickness or in a
  facetted angle turret (Tattershall) or in "a rounded addition to the building"
  (CONFIRMED-digest). Stair grammar by rung: LADDER (the cottage work corner's loft) → WINDER
  (the two-storey solar block) → SPIRAL/VICE (three storeys or more — the fieldwork threshold
  above) → GRAND (never, in this family; a grand stair is a hall-house fixture and its
  presence in a "wizard's tower" is a prosperity error the validator should be able to catch).
- `THROUGH_ROOM` — where the stair is NOT in the wall, every floor is a through-room for
  every floor above it. This is the licensing rule: **a tower without a wall-stair cannot
  have a private upper chamber**, and the plan must either put the stair in the wall or admit
  the loss of privacy. A first-class DW grammar rule falls straight out of it.
- `GALLERY` — Uraniborg's instrument balconies "supported on wooden posts" are an EXTERIOR
  gallery class: a walkway that is a room's worth of programme but has no roof and no walls,
  reached "from outside the building or from doors on this floor". The CIRC addendum's
  `EXTERIOR_WALK` gets its arcane member here, and it carries an exterior consequence in DW
  law 9's sense (a timber gallery is visible on the silhouette and is the first thing decline
  removes).
- `LOBBY / VESTIBULE` — absent in the tower house (the tower's door opens into the undercroft
  or straight onto the stair foot). Present at Uraniborg as the two entrance towers east and
  west, each carrying a sculpture over the door.
- `CORRIDOR` — **absent everywhere in this family**, and its absence is licensed by date
  (pre-seventeenth-century domestic) and by parti (one room per floor cannot have a corridor).
  Uraniborg's eight student rooms in a loft are the one place a corridor would be expected in
  a later building and the source does not describe one.
- The **VERTICAL JOINT** that matters most: Uraniborg's spiral stair from the ground-floor
  Winter Room DOWN into the basement laboratory. That is a §311.9-style typed joint between a
  dwelling cell and a process cell, and it is the reason five furnaces later migrated upstairs.
- Width buckets proposed (all DERIVED, none measured this session): vice 1.0–1.5 m external
  diameter; exterior instrument gallery 1.2–2.0 m; the tower's principal room 5–8 m across.
  Every one of these is PLAUSIBLE and is flagged in §L.

**(e) STORAGE typology (ODQ §453).**
- `CELLAR / UNDERCROFT` — the type's defining store. Tattershall's undercroft is "a wide brick
  segmental tunnel vault with chambers off" (CONFIRMED-digest): a vaulted main volume with
  SUBSIDIARY CELLS opening off it, which is a different shape from a single cellar room and
  should be its own size/shape bucket. `lightReq: NONE`. Uraniborg's basement holds "storage
  for food, salt and fuel at the other" end from the laboratory — one bulk store, three named
  commodities, and the fuel store is the one that grows (family B).
- `STORE{LIBRARY}` — Uraniborg's south rotunda held "a library and 'museum' on the ground
  floor" directly ABOVE the laboratory. A collection is a load and a fire risk; R-INST-3's
  family M owns the library's own light, pitch and fire law and this dossier does not restate
  it. The transferable fact is the STACKING: library over laboratory, with the practitioner's
  study in the library and a stair down.
- `CELLS{PRISON}` — "a small prison room, in order to deal with disorderly tenants or guests"
  (CONFIRMED, Wikipedia). A private jurisdiction's lock-up inside a private house is a real
  cell class and `ROOM_KINDS.cells` already exists for it.
- `GARRET_STORE` — the loft at Uraniborg is subdivided into eight student rooms, i.e. the
  garret is INHABITED rather than stored in; the shedding order should therefore run
  garret-rooms → garret-store → empty, not the reverse.
- Fixture-scale, not cells: the instrument itself (a 3.2 m sextant is a fixture that sizes its
  cell), the press or aumbry in the study, the niche.
- PROHIBITION inherited from family B and stated here because the two families share a
  building: **no internal door from the fuel store to the furnace room.** At Uraniborg the
  bulk store and the laboratory are at OPPOSITE ENDS of the same basement.

**(f) Typed proposal.**
`parti: PRACTITIONER_CORNER` — no cell of its own; a fixture set inside a dwelling's hall or
front room. Verdict NO_BUILDING at hamlet, and at village tier only if prosperity is at the
floor.
`parti: HOSTED_TOP_ROOM` — the practitioner's cell is the highest room of another
institution's building (a gate tower, a church tower, an inn's garret). `host` is a required
field; the cell inherits the host's circulation and adds one `STAIR_HALL{VERTICAL}` segment.
`parti: TOWER_ONE_ROOM_PER_FLOOR` — vaulted undercroft + N storeys of one principal room each
+ a vice in the wall or an angle turret + a roof platform. `storeys: 3..5`;
`verticalGrammar: ONE_CELL_PER_STOREY`; `stairGrammar: VICE_IN_WALL | VICE_IN_TURRET |
THROUGH_ROOM_LADDER(poverty)`; `exteriorConsequences: [ANGLE_TURRETS, PARAPET, ROOF_PLATFORM]`.
`parti: TOWER_WITH_ATTACHED_HALL` — the same tower with a hall range on one side (Tattershall);
the public function moves to the hall and the tower becomes purely private.
`parti: OBSERVATORY_PRECINCT` — the ceiling: a square block of 15–16 m with two rotundas, an
inhabited loft, a basement process range, exterior instrument galleries, a rampart or wall, a
formal garden and detached outbuildings (printing house, paper mill, tenant farm). This is a
COMPOUND, and DW's parcel model must be able to hold a precinct as one institution.
`functions[]`: floor = `sleep`, `work_corner`, `hearth`. Ladder rungs, in order: + `study`
(the private book-and-desk cell) → + `store{undercroft}` → + `chamber` per storey → +
`roof_platform` → + `library` → + `laboratory` (hands off to family B) → + `student_lodging`
→ + `guest_chamber` → + `instrument_gallery` → + `prison_cell` → + `garden` → +
`detached_workshop`.
`fixtures[]` with grades: `DESK`, `SHELF`, `PRESS`, `LECTERN`, `HEARTH`, `BRAZIER`,
`INSTRUMENT{diameter}` (sizes its own cell — a first-class new fixture idea),
`ROOF_PLATFORM_RAIL`, `SHUTTERED_APERTURE` (Stjerneborg's opening shutters), `ROTATING_DOME`
(ceiling only), `WINDOW{south}` (the solar block's rule), `STAIR_TURRET`.
Structural buckets: `verticalStack` (the new one this family demands), `wallThickness`
(4.15 m at Tattershall's base is a structural bucket, not decoration), `vaultedUndercroft`,
`roofLoad` (an instrument platform is a live load), `sightLine{sky}` and `sightLine{country}`
(a siting pull, not a room), `openAperture` (the shutter that must open to the weather).
Licensing fields: `tier ≥ town` for the tower (the catalog is right, though for the wrong
reason — see (c)(iv)); `prosperity ≥ high` for the tower, `≥ any` for the corner;
`era: TOWER_HOUSE 1200–1600 · OBSERVATORY_PRECINCT 1576+ in the European register, any era in
the Islamic and Indian registers (§15)`; `siting: PROMINENCE | ISLAND | PRECINCT_EDGE`;
`culture: any`; and **`magicLicense: NONE | LOW | MEDIUM | HIGH`** — a closed enum whose four
tokens are exactly the bands `getMagicLevel` already emits (`src/data/constants.js:37`), so
the field costs the engine no new vocabulary. Proposed values: `HOSTED_TOP_ROOM ≥ LOW`,
`TOWER_ONE_ROOM_PER_FLOOR ≥ MEDIUM`, `OBSERVATORY_PRECINCT ≥ HIGH`.
**VERDICT per tier.** hamlet `Traveling hedge wizard`: **NO_BUILDING** (a visiting service;
the fixture set travels in a pack). village `Hedge wizard`: **HOSTED** in the practitioner's
own dwelling — a `PRACTITIONER_CORNER`, escalating to a two-cell cottage at high prosperity.
village `Healer (divine, 1st level)`: **HOSTED** (host = the church, the priest's house, or
the practitioner's own cottage; R-INST-3 family J and R-INST-4 family J own the two
institutional hosts). town `Wizard's tower`: **BUILDING** (`TOWER_ONE_ROOM_PER_FLOOR`). city
`Wizard's tower`: **BUILDING**, and the catalog's "Multiple towers possible" is a COUNT on
one parti, not a new parti — the correct expression is `duplicate(n)` with each instance on
its own parcel.
**HOME tags.** `study` → HOME: `ROOM_KINDS.study`. `chamber` → HOME: `ROOM_KINDS.chamber`.
`store{undercroft}` → HOME: `ROOM_KINDS.cellar`. `prison_cell` → HOME: `ROOM_KINDS.cells`.
`library` → HOME: `ROOM_KINDS.stacks` + `ROOM_KINDS.reading`. `student_lodging` → HOME:
`ROOM_KINDS.lodging`. **NO TYPED HOME**: `work_corner`, `roof_platform`,
`instrument_gallery`, `laboratory`, `guest_chamber` (distinct from `chamber` only by
licensing, so arguably foldable). **NO TYPED HOME** for every fixture this family needs
except desk, shelf, hearth, brazier and lectern: `INSTRUMENT`, `PRESS`, `ROOF_PLATFORM_RAIL`,
`SHUTTERED_APERTURE`, `ROTATING_DOME`, `STAIR_TURRET` are all outside `FURNISHING_KINDS`.

**(g) Consequences for the grammar.**
1. **DW law 9 (vertical honesty) gets its hardest test here and its cleanest rule.** A tower
   is a parti in which the vertical partition is not a division of a height envelope but the
   ORGANISING FORM: `ONE_CELL_PER_STOREY`. The generator needs a vertical parti class whose
   cell count is the storey count, and law 2's massing clamp must be able to express "tall and
   narrow" rather than only "big".
2. **Access-by-depth-of-climb is a privacy mechanism the current model cannot express.** In a
   wall-stair tower, privacy is a function of HOW MANY STOREYS UP a cell sits. That is a
   per-cell `privacyDepth` derived from the stair grammar, and it is the tower's substitute
   for the corridor.
3. **A stair inside the wall thickness is a WALL fact, not a room fact.** The 4.15 m basement
   wall at Tattershall is where the vice, the garderobes and the mural passages live. The
   geometry core (DW-2) must let a wall carry cells, or every tower it draws will be wrong.
4. **The INSTRUMENT sizes the cell.** A fixture with a declared diameter that imposes a
   minimum room dimension is a new fixture capability (`fixture.sizesCell`), and it recurs in
   family B (the athanor), family F (the circle) and family K (the cage).
5. **A PRECINCT is one institution occupying several buildings on one parcel.** Uraniborg is
   house + galleries + rampart + garden + paper mill. The DW record shape assumes one building
   per institution; the metropolis-tier entries in families C and J need the same thing. This
   is the tranche's largest structural request and it is repeated in §Σ.
6. **The process migrates toward the supervisor.** Brahe's five extra ovens in the Winter Room
   is a general law: an institution whose process needs continuous attendance grows fixtures
   INTO its living cell. As a generator rule: when `process.attendance == CONTINUOUS` and the
   process cell is not adjacent to the living cell, place a duplicate fixture subset in the
   living cell and record it as a dated renovation (DW law 5's fossils, running forward).
7. **`forbiddenTradeRoutes: ['isolated']` on the town tower contradicts the analogue.** The
   observatory and the tower house both WANT isolation; what they need is PATRONAGE. If the
   gate is meant to be an economic one it should read prosperity, and if it is meant to be a
   supply one it should read the reagent chain (family B). Reported, not corrected — a catalog
   edit is owner-gated.

**(h) Continental versus English.** England is the parochial register for this family in the
one way that matters: it has the tower house in quantity and the purpose-built observatory not
at all before 1675. Denmark supplies the type (Uraniborg 1576–80, Stjerneborg 1584); Prague
under Rudolf II supplies the court version (workshops and cabinets inside a palace rather than
a free-standing house — NOT researched this session, see §L); Italy supplies the urban
tower en masse, where the tower is a FAMILY's status object in a street of towers rather than
a lord's caput in a park (PLAUSIBLE — the San Gimignano and Bologna torri were not researched
this session). The consequence for a settlement generator is that "wizard's tower" resolves to
three different SITINGS by culture: the isolated precinct (Nordic/lordly), the urban tower in
a row (Italian), and the top room of a public building (the university register). §15 carries
the Islamic and Indian observatory as the type's real ceiling.

**(i) FANTASY NOTE — the genre CONVENTION and the ENGINE CONTRACT.**
**CONVENTION** (labelled as convention throughout; never CONFIRMED). Across a wide and
un-unified body of fantasy fiction and tabletop material, the wizard's tower is expected to
contain, from the bottom up: a guarded or warded entrance; a store or vault below ground; a
service and living floor; a laboratory or workroom; a library; a study; and an observing or
summoning chamber at the top, with the stair running the whole height. The convention is
strikingly close to Uraniborg's ACTUAL stack — store below, kitchens and living in the middle,
library and study in the rotunda, observing platform on top — which is why this dossier's
recommendation is that the grammar compose the fantasy tower ENTIRELY from sourced cells and
mint nothing. Every cell the convention asks for has a CONFIRMED analogue above: vault ←
Tattershall's vaulted undercroft with chambers off; living floor ← the tower house's principal
room per storey; laboratory ← Uraniborg's basement (family B); library and study ← Uraniborg's
south rotunda; observing chamber ← the widow's-walk tower and the instrument galleries; the
warded door ← the tower house's single defended entrance. The two conventions with NO
analogue, and which must therefore be marked as pure convention if they are ever admitted, are
(1) a tower that is TALLER than its masonry could stand, and (2) a tower with no other
building attached — the historical tower always has a hall, a yard or a precinct beside it,
and a lone tower in a townscape is a genre image, not a building type.
**The setting-agnostic test** applied: delete the magic and the parti survives intact as an
astronomer-alchemist's house. This family therefore passes cleanly and needs no magic-specific
room class at all. What the magic buys is LICENSE (who can afford the tower) and SITING (an
isolated precinct in a world where the practitioner needs no market), not a new room.
**ENGINE CONTRACT (read this session, CONFIRMED).** Today: `Wizard's tower` at both tiers
infers `institutionNature` = **`generic`** — no keyword in `FACET_INFERENCE` matches "wizard"
or "tower" — so the town and city wizard's towers currently draw the two-cell generic template
(`main` front + `back` at tier index ≥ 2) with furnishings table/bench/shelf/crate. The
`learning` template (reading + stacks + study) would be the better default and the record does
not reach it. `Hedge wizard` and `Traveling hedge wizard` also infer `generic`. `Healer
(divine, 1st level)` infers nature `generic` but DOES fire the function facet **`heals`**
(`/healer/` in `FACET_INFERENCE.institutionFunction`), appending `quarters` (bed/shelf/
cauldron) to the generic set — which is a defensible result for a healer and the one entry in
this family the engine gets approximately right. Probability: all four rows are magic-scaled
(`priorityMagic/50` × the tier penalty, so ×0.25 at hamlet and ×0.40 at village — the engine
already encodes "the arcane is thin in small places"); `Wizard's tower` shares the
`magicalAuthority` exclusive group with `Hedge wizard`, so a settlement gets ONE arcane
authority, which is a good law and should be stated in the dossier's own terms: **the arcane
authority is exclusive per settlement, the way the government seat is.** At `magicExists ===
false` all four are struck by `institutionProbability`'s L302 gate and by the UI strip.


---

## §3 · FAMILY B — the laboratory and the alchemist: Alchemist shop (town L1356 "Potions, alchemical items. Basic healing potions (50 GP).") · Alchemist quarter (city L1899 "Multiple alchemical workshops. Guild organization.")

**(a) Analogue.** Two entries, two different buildings. The `Alchemist shop` is a SHOP-HOUSE
with a process cell behind or below it; the `Alchemist quarter` is a ZONING of many such
shop-houses and is not a building at all. The process cell is the interesting half, and it
has three well-documented forms.

**Form 1 — the cellar laboratory, and the one itemised furnace list in the literature.**
Uraniborg's basement laboratory is the single best-recorded pre-1600 European chemical
workroom, because Brahe listed its plant himself: it contained "no less than 16 ovens", namely
"Three bath-heaters, one digesting furnace with ashes, four large athanors, two small ones,
two furnaces for distillation in sand or ashes, one for [use with] a large bellows that is
connected with it by two pipes. Another special furnace was fitted with lamps. There were two
reverberatory furnaces, one of which reflected the heat directly, the other reflected it along
a spiral path, freely and yet indirectly" (CONFIRMED, quoted in Kjærgaard et al., *npj Heritage
Science* 2024, [s40494-024-01301-6](https://www.nature.com/articles/s40494-024-01301-6),
curl-fetched 2026-08-23; the paper cites Christianson for the Brahe passage). **Number audit,
performed:** 3 + 1 + 4 + 2 + 2 + 1 + 1 + 2 = 16. The list is internally consistent with its own
total, which is a small but real reason to trust it as a transcription rather than a
flourish. The paper then gives the ROOM: "Depictions of the palace show that each oven stood
in its own niche and that there was a circular working table around the central column of the
vaulted room". So the plan is a VAULTED CIRCULAR CELL, a central column, a ring table round the
column, and SIXTEEN NICHES in the wall each holding one furnace. Two visitor descriptions
supply the fittings and the fume problem. Johan David Wunderer, 1589: the underground room
contained "many unusual furnaces and apparatus, various large flasks of thirty measures, many
amazing kettles, alembics, cucurbits, and similar strange utensils, which all had been
procured at great cost". Martin Zeiller: "Downstairs next to the wine cellar is a large vault
in which Tycho's stills and furnaces are, upon which stand a large quantity of distillation
flasks. A lot of them are curved at the top, made of copper, going out through some windows
and in through others, in which unusual things are distilled" — and the paper's own gloss:
"Some of the condensers fitted to the distillation vessels were apparently lead through the
windows out into the cool open air and back" (all CONFIRMED, the same paper, fetched
2026-08-23). Three grammar-grade facts fall out: the laboratory ADJOINS the wine cellar (a
process cell next to a bulk store, in the same undercroft); the condensers USE THE OUTSIDE AIR
AS THE COOLANT and therefore require a window wall on a cold aspect; and the whole thing is
under the family's parlour with a spiral stair between them (family A(a)).

**Form 2 — the laboratory as a room of somebody else's building, which is the norm.** The
richest Renaissance laboratory assemblage ever recovered comes from Oberstockstall, Kirchberg
am Wagram, Lower Austria: "a dump beneath the sacristy of the church adjoining a manor house",
probably buried after an earthquake, "dated to the second half of the 16th century AD",
comprising "fragments of eight hundred artefacts" including 300 triangular crucibles, about 40
scorifiers, about 60 bone-ash cupels, alembics, aludels, cucurbits, adopters and receivers in
ceramic and glass, metal and slag remains, FURNACE BRICKS, and objects of leather, textile and
bone (CONFIRMED, Martinón-Torres and Rehren, Antiquity project gallery,
[antiquity.ac.uk/projgall/martinon298_](https://www.antiquity.ac.uk/projgall/martinon298_),
fetched 2026-08-23; the page gives NO dimension for the room, the dump or the furnaces —
"the scale bar shown in the bottom right corner is approx. 15cm" is an artefact scale). What
the site tells a grammar is negative and important: the laboratory was attached to a MANOR
HOUSE and its refuse went under a CHURCH SACRISTY. It was a room in an existing complex, and
it left no building.
The university laboratory of the later seventeenth century is the same shape institutionalised.
Leiden's chemistry laboratory, "established in 1669", was "primarily a research lab, equipped
with elaborate devices", and the type "usually consisted of no more than one or two rooms,
filled with various brick furnaces" designed "to create high temperatures" (CONFIRMED,
[Boerhaave's Furnace, PMC7540335](https://pmc.ncbi.nlm.nih.gov/articles/PMC7540335/), fetched
2026-08-23). **One or two rooms. That is the type's real size**, and the catalog's
"Multiple alchemical workshops" at city tier is therefore a count of shop-houses, not a campus.

**Form 3 — the ideal purpose-built chemical house, which was DESIGNED and never built.**
Andreas Libavius published architectural plans for a `domus chymici` in the enlarged *Alchymia*
of 1606, a folio "with more than 200 designs and pictures of various sorts of chemical
glassware, vessels, apparatuses, and furnaces, as well as architectural plans for the building
of a chemical laboratory"; "the plan unfolds around the central hall, and the privacy of the
overall layout gradually increases from east to west"; and — the point that matters for
siting — "in contrast to what Libavius saw as the aristocratic seclusion of Uraniborg, he
viewed his Chemical House as being incorporated into the town and, thus, the public realm"
(CONFIRMED-digest, 2026-08-23; the two full accounts, William R. Newman's chapter "Alchemical
Symbolism and Concealment: The Chemical House of Libavius" on fulcrum.org and the Oxford
*cabinet* catalogue entry, were BLOCKED — 403 and a host that does not resolve; a third,
Schmidgen's open-access "Laboratory" article in the *Encyclopedia of the History of Science*,
[ethos.lps.library.cmu.edu/article/id/450](https://ethos.lps.library.cmu.edu/article/id/450/),
WAS fetched 2026-08-23 but carries only "depictions of the chemists' house of Andreas Libavius
(1555–1616) show spacious accommodations in which the instruments are place[d] in an orderly
fashion"). **This dossier therefore does NOT have Libavius's room list**, which is the single
most valuable missing document for this family; it is ledger item L.2 and a P1c work order.
What IS in hand and usable is the two-word design principle — a CENTRAL HALL with privacy
GRADED along one axis — which is a circulation law, and the town-versus-precinct siting
argument, which is a licensing law.

**The court laboratory, for the fixture set.** Paul van der Doort's 1609 engraving of Count
Wolfgang II von Hohenlohe's laboratory at Weikersheim shows "a fireplace with a vent" and
"test tubes and other vessels neatly on ledges, shelves and window-sills", with the alchemist
"facing the books in a respectful pose" (CONFIRMED, the Schmidgen article, fetched
2026-08-23). Ledges, shelves and WINDOW-SILLS as working surfaces; a vented fireplace; and
books IN the workroom.

**The chimney is the constraint, and the portable furnace is the workaround.** Boerhaave's
room at Leiden "only had one chimney, whereas he wanted to perform various chemical
experiments simultaneously", which is why he designed a portable furnace of "roughly 24 by 24
centimetres wide and 37 centimetres tall", weighing "16 kilograms" empty, oak-bodied with a
sheet-iron lining in the lower compartment, two iron handles, taking a glass flask or retort
over "glowing Dutch coal" or peat (CONFIRMED, PMC7540335, fetched 2026-08-23). **The number of
flues caps the number of simultaneous processes.** That is the cleanest quantitative law this
family produces and it applies to every furnace building in the corpus.

**Structural imperatives.** FIRE (a masonry furnace on a masonry floor, in a vault, with a
flue); FUME (the vent, the window, the outside-air condenser loop); WATER (for the bath-heater
— three of Brahe's sixteen were *balnea* — and for quenching); FUEL (charcoal, coal, peat,
wood: a store that is the largest single volume the practice needs, and a store that must not
open into the fire room); WEIGHT (crucible furnaces and their fuel on a vaulted floor, which
is why the cellar and not the loft); LIGHT (the working table wants it, the ledges and
window-sills ARE it); and SMELL, which is a siting fact — sulphur, arsenic, acid fume — and
puts the practice downwind or below ground.

**Siting and anchor law.** Uraniborg = below the dwelling, on an island. Oberstockstall = beside
a manor house, next to a church. Libavius = deliberately IN THE TOWN. The catalog's own gate
for `Alchemist shop` is `forbiddenTradeRoutes: ['isolated']`, and for once the engine and the
analogue agree exactly: an alchemist needs REAGENTS, reagents come by road, and Libavius's
argument for a town site is a supply argument dressed as a civic one.

**Prosperity and wear grades.** Floor = a brazier and a still in the back room of an apothecary
(R-INST-2 family B′ owns the apothecary shop-house and this dossier does not restate it).
Rung 1 = one dedicated process room with ONE flue. Rung 2 = two rooms (the Leiden ceiling) —
a furnace room and a preparation room. Rung 3 = a vaulted cellar with multiple niched furnaces
and a bulk fuel store. Rung 4 = the sixteen-furnace cellar with a ring table, a window-wall
condenser run, an adjoining wine cellar, and a separate waste vault. Ceiling = Libavius's
un-built chemical house with a graded-privacy plan around a central hall. Decline sheds the
furnaces one at a time — each is a fixture in a niche, so the niche survives as a FOSSIL — then
the fuel store, then the practice, leaving a cellar with blocked niches and a chimney that
serves nothing.

**(b) Measured.**
- Uraniborg laboratory: **16 furnaces**, itemised as above; each in its OWN NICHE; a circular
  working table round the central column of a vaulted room; adjoins the wine cellar; condensers
  run out through windows and back; **five further ovens** later installed in the ground-floor
  Winter Room (CONFIRMED, npj 2024). NO room dimension is given by any source this lane
  reached — the cellar of a block "about 15 metres on a side" bounds it, and the southern
  rotunda that housed it is given in one digest as 6 m in diameter (CONFIRMED-digest only).
- Uraniborg waste: "to the laboratory area, but outside the palace proper, a separate vaulted
  cellar was excavated. Besides some architectural fragments of plaster and stone it contained
  broken retorts of glass and stone, as well as charcoal and sulphur, which was interpreted as
  waste from Tycho Brahe's alchemical experiments"; further excavations 1988–90 covered "the
  garden and the surrounding earth constructions and smaller buildings" (CONFIRMED, npj 2024).
- Oberstockstall: 800 artefact fragments; c. 300 triangular crucibles; c. 40 scorifiers; c. 60
  bone-ash cupels; furnace bricks present; second half of the sixteenth century (CONFIRMED,
  Antiquity). No room, dump or furnace dimension published on that page.
- Leiden 1669 and the type: "no more than one or two rooms"; ONE chimney in Boerhaave's room
  (CONFIRMED, PMC7540335).
- Boerhaave's portable furnace: 24 × 24 cm × 37 cm tall; 16 kg empty; oak with sheet-iron
  lining; two iron handles (CONFIRMED, PMC7540335).
- Libavius 1606: more than 200 plates of glassware, vessels, apparatus and furnaces; plan
  organised round a central hall with privacy graded east to west (CONFIRMED-digest).
- **NOT FOUND, searched.** No measured plan or dimension of ANY European alchemical laboratory
  was obtained this session: no room size, no furnace footprint, no flue bore, no bench height,
  no fuel-store volume. Searches issued: "Libavius Alchymia 1606 ideal chemical house laboratory
  plan rooms description"; "Libavius chemical house domus chymici rooms laboratorium apotheca
  coctio andron garden Newman description"; "Oberstockstall excavated alchemical laboratory
  16th century cellar furnaces Austria dimensions"; "'no purpose-built' alchemical laboratory
  survives archaeology excavated furnace early modern". The single measured artefact in the
  whole family is Boerhaave's PORTABLE furnace, which is a piece of movable equipment. Every
  size bucket in (f) is therefore DERIVED and says so.

**(c) Contested and counterexamples — the negation search.**
(i) **The negation was run and it returned a strong null in the useful direction.** The query
"'no purpose-built' alchemical laboratory survives archaeology excavated furnace early modern"
found no source asserting that sentence — and found, instead, that every laboratory the
archaeological literature studies is a room or a deposit inside something else: Oberstockstall
is a dump beneath a sacristy beside a manor; Uraniborg's is a palace cellar; the Old Ashmolean
in Oxford (17th–18th century) is a basement under a museum; Jamestown 1607–1610 is a colonial
site (CONFIRMED-digest of the result set, 2026-08-23; the Old Ashmolean and Jamestown papers
were NOT opened and nothing from them is asserted here beyond their existence). **Reported as a
finding, in the form the evidence supports: this lane found no standing purpose-built European
alchemical laboratory building, and the recovered laboratories are all rooms of other
buildings.** That is absence-after-search, not proof of absence, and it is ledger item L.3.
(ii) **The catalog's "Potions" and "healing potions (50 GP)" describe an APOTHECARY, not an
alchemist.** Historically the two trades are adjacent and the shop is the same shop: R-INST-2's
family B′ holds the apothecary shop-house with its counter, its drug jars and its back
workroom. The distinction this dossier draws is by PROCESS, not by product: an apothecary
compounds and dispenses (mortar, press, still, jars) and an alchemist ASSAYS AND TRANSMUTES
(crucible, cupel, scorifier, reverberatory furnace). Oberstockstall's assemblage — 300
crucibles, 60 bone-ash cupels, 40 scorifiers — is an ASSAY assemblage, i.e. metallurgical
testing, which is also what R-INST-1's mint and assay office does. The honest grammar
consequence is that `Alchemist shop` sits between two existing families and should inherit the
apothecary's FRONT and the assay office's BACK.
(iii) **Libavius against Brahe is a real, dated argument about SITING, and both sides are
attested.** Seclusion (island, precinct, cellar, secrecy — Brahe "never precisely described any
results from his alchemical studies" and wrote that making such things generally known "serves
no useful purpose") versus publicity (a chemical house incorporated into the town). A world
generator should be able to express both, and the axis is not prosperity but DISPOSITION.
(iv) **A caution on the sixteen furnaces.** Brahe's list is a royal favourite's inventory of a
uniquely funded installation. It is a CEILING, not a norm, and this dossier mints no
probability from it. The norm, from the same evidence base, is one or two rooms and however
many furnaces one chimney will carry.
(v) **The "alchemist quarter" has no direct analogue and its nearest one is a NEGATIVE.** No
European city is known to this lane to have had a quarter of alchemists. The quarters that
existed are quarters of the ADJACENT trades — apothecaries, goldsmiths, dyers, potters — all of
which are R-INST-2's, and all of which cluster for the same three reasons: fuel, water and
smell. Reported as such; the entry is a zoning verdict, not a building.

**(d) CIRCULATION typology (ODQ §452).**
- `THROUGH_ROOM` — the type's default. Shop front → back workroom → yard, or parlour → stair →
  cellar. There is no corridor anywhere in this family at any era grade.
- `STAIR_HALL{VERTICAL}` — the spiral stair from the Winter Room down into the laboratory
  (CONFIRMED). This is a TYPED JOINT between a dwelling cell and a hazardous process cell, and
  it should carry an attribute the CIRC addendum can express: `joint.hazard = FUME|FIRE`,
  because the whole reason the five extra ovens went upstairs is that this joint was too slow.
- **`joint.refused`** — the fuel store must have NO internal door to the furnace room. At
  Uraniborg the bulk store of "food, salt and fuel" is at the OPPOSITE END of the basement from
  the laboratory (CONFIRMED). This dossier adopts R-INST-4 family E's prohibition unchanged and
  supplies a second instance of it.
- **The window wall as circulation for a PROCESS, not for people.** The copper condenser heads
  "going out through some windows and in through others" (CONFIRMED) means an aperture pair on
  the cold aspect is a functional requirement of the cell, like a light requirement but for
  heat. Proposed as a new cell attribute `apertureUse: LIGHT | VENT | PROCESS_LOOP`.
- `LOBBY / VESTIBULE` — the shop's threshold. R-INST-2's shop-house owns it.
- `GALLERY` — absent.
- Libavius's "central hall" with privacy graded along one axis is the only CORRIDOR-ADJACENT
  idea in the family, and it is a designed ideal from 1606, not a surviving building; it is
  reported as such and licenses nothing.
- Width buckets, all DERIVED and flagged: furnace niche 0.8–1.2 m wide (from the requirement
  that a person tend a furnace standing in it — no measured source); the ring table's working
  ring 0.9–1.2 m clear (no measured source); the shop front's counter line, R-INST-2's.

**(e) STORAGE typology (ODQ §453).**
- `STORE{FUEL}` — sizeBucket LARGE, `lightReq: NONE`, `REQUIRED_NEAR(furnace)`,
  **`FORBIDDEN_DOOR(furnace room)`**. Charcoal, coal, peat or wood. This is the family's
  biggest cell after the laboratory itself and the first thing an economy shortage bites
  (family A's decline order).
- `STORE{REAGENT}` — the shelved store of materials. `lightReq: NONE | NORTH` (heat and light
  spoil), sizeBucket SMALL to MEDIUM, fixtures shelves, jars, boxes and a lockable press —
  reagents are valuable and toxic, so this store is the one that gets a LOCK. Adjacency:
  next to the preparation room, NOT the furnace room.
- `CELLAR / UNDERCROFT` — where the whole process cell lives at rung 3 and above, and where the
  wine cellar sits beside it (CONFIRMED). A vaulted floor is a structural requirement, not a
  style: masonry furnaces are point loads.
- `STORE{WASTE}` — **new, and CONFIRMED by excavation**: "a separate vaulted cellar … outside
  the palace proper" holding broken retorts, charcoal and sulphur. Alchemical waste is
  hazardous, bulky and worth hiding, and it got its own vault OUTSIDE the building. Proposed as
  a first-class storage class `STORE{HAZARD_WASTE}` with `outsideBuilding: true`. Oberstockstall
  says the same thing in a different key: the assemblage IS a dump.
- `STORE{GLASS}` — the flasks, alembics, cucurbits, aludels, adopters and receivers. Fragile,
  numerous ("a large quantity of distillation flasks"), and stored on the ledges, shelves and
  window-sills of the workroom itself (Weikersheim, CONFIRMED). At small scale this is a
  FIXTURE (shelving), not a cell — exactly the §453 fixture-versus-cell rule.
- `PANTRY / BUTTERY / LARDER` — not applicable; this family's stores are the fuel, the reagent,
  the glass and the waste, and naming them as pantry-kin would be a category error.

**(f) Typed proposal.**
`parti: SHOPHOUSE_WITH_BACK_PROCESS` — R-INST-2's shop-house parti with one process cell added
at the rear or below, plus a fuel store off the yard. The town `Alchemist shop`'s home.
`parti: CELLAR_LABORATORY` — a vaulted undercroft cell with niched furnaces round the wall, a
central column and a ring table, an aperture pair on the cold aspect, a fuel store at the far
end of the same undercroft with no connecting door, and a stair up to a dwelling cell.
`parti: TWO_ROOM_LABORATORY` — the Leiden ceiling: a furnace room (one flue) plus a preparation
room. The institutional rung.
`parti: CHEMICAL_HOUSE_GRADED` — Libavius's designed ideal, marked **DESIGNED, NEVER BUILT** in
its own record so no reader mistakes it for evidence: a central hall with privacy graded along
one axis, sited in the town.
`zoning: CRAFT_QUARTER{alchemy}` — the city `Alchemist quarter`. Not a building.
`functions[]`: floor = `counter`, `still`, `hearth`. Rungs: + `back_workroom` → +
`store{reagent}` → + `store{fuel}` → + `furnace_room{flues:1}` → + `cellar` → +
`furnace_room{flues:n}` → + `store{waste}` → + `preparation_room` → + `study/books` → +
`assay_bench`.
`fixtures[]`: `ATHANOR` (the slow-burning digestion furnace — Brahe had six),
`REVERBERATORY_FURNACE`, `BALNEUM{bath-heater}`, `SAND_BATH`, `ASH_BATH`, `BELLOWS{two-pipe}`,
`LAMP_FURNACE`, `PORTABLE_FURNACE` (24 × 24 × 37 cm, 16 kg — the one measured fixture in the
family, and the one that DEFEATS the flue constraint), `NICHE` (the furnace's own cell-sized
recess), `RING_TABLE`, `LEDGE`, `WINDOW_SILL_BENCH`, `CONDENSER_LOOP{through-window}`,
`CRUCIBLE_RACK`, `CUPEL_TRAY`, `ALEMBIC`, `CUCURBIT`, `ALUDEL`, `RECEIVER`, `DRUG_JAR`
(R-INST-2's), `LOCKED_PRESS`.
Structural buckets: `furnace{grade: EXTREME}`, `flueCount` (**the capping bucket** — the number
of flues bounds the number of simultaneous processes), `vault` (point loads), `wetFloor`,
`fumeVent`, `coldAperture` (the condenser loop's requirement), `fuelHunger`, `hazardWaste`.
Licensing: `tier ≥ town`; `prosperity ≥ middling`; `era: any` in the sense that the practice is
continuous from antiquity, with the ITEMISED sixteen-furnace cellar a 1570–1620 court
phenomenon; `siting: TOWN_STREET (Libavius) | PRECINCT (Brahe) | DOWNWIND_EDGE (smell)`;
`tradeRoute != isolated` (the catalog's own gate, endorsed);
**`magicLicense: NONE`** — and this is the family's most consequential licensing finding.
**The alchemist's shop needs NO magic at all.** Delete the magic from this world and the
building, the furnaces, the reagent store, the waste vault and the trade all remain, because
they all existed. The catalog's `tags: ['arcane','alchemy']` therefore make a REAL TRADE
vanish in a `magicExists: false` world (see (i)), which is a product-scope defect, not a
grammar one.
**VERDICT per tier.** town `Alchemist shop`: **BUILDING** (`SHOPHOUSE_WITH_BACK_PROCESS`),
degrading to **HOSTED** inside an apothecary's shop at low prosperity. city `Alchemist
quarter`: **NO_BUILDING — a zoning**; it resolves to N instances of the town parti plus, at
high prosperity, one `CELLAR_LABORATORY` and one guild hall borrowed from R-INST-1.
**HOME tags.** `back_workroom` → HOME: `ROOM_KINDS.workfloor`. `store{reagent}` /
`store{fuel}` → HOME: `ROOM_KINDS.store`. `cellar` → HOME: `ROOM_KINDS.cellar`. `counter` →
HOME: `ROOM_KINDS.stall` or `ROOM_KINDS.counting`. `furnace_room` → **NO TYPED HOME** (the
nearest, `ROOM_KINDS.kiln`, is the craft template's pottery kiln and carries `hearth`/`brazier`
only — an athanor is not a brazier). `preparation_room`, `assay_bench`, `store{waste}` → **NO
TYPED HOME**. Of the twenty-one fixtures listed above, `FURNISHING_KINDS` can express
`shelf`, `rack`, `crate`, `barrel`, `hearth`, `brazier`, `cauldron`, `workbench`, `counter`,
`strongbox` and `desk` — and CANNOT express the athanor, the reverberatory furnace, the
niche, the ring table, the condenser loop, the alembic, the cupel tray or the drug jar.

**(g) Consequences for the grammar.**
1. **`flueCount` as a first-class structural bucket.** One chimney means one process at a time
   (CONFIRMED at Leiden). This single number governs the furnace families across the whole
   corpus — R-INST-2's smithy and pottery, R-INST-4's bathhouse, this laboratory — and it gives
   the validator a check it can actually run: `furnaces ≤ flues + portableFurnaces`.
2. **A cell may require an APERTURE PAIR on a stated aspect, for a process rather than for
   light.** The through-window condenser loop is the evidence. `apertureUse: PROCESS_LOOP`.
3. **A furnace is a cell-shaped fixture: the NICHE.** Sixteen niches in a wall is neither
   sixteen rooms nor one room — it is a room whose wall is subdivided into fixture-cells. The
   fixture-versus-cell boundary of ODQ §453 needs a third term for it, proposed as
   `RECESS` (a fixture that occupies wall thickness and is individually countable, dateable and
   losable). Recesses make the best fossils in the corpus: a blocked furnace niche is a visible,
   dateable record of a process that stopped.
4. **`STORE{HAZARD_WASTE}` outside the building envelope.** Excavated at Uraniborg; implied at
   Oberstockstall. A store that must be outside the building is a new adjacency law
   (`outsideBuilding: true`), and it is a parcel fact as well as a plan fact.
5. **The trade must survive a dead-magic world.** See (i) and §Σ engine-gap G3.
6. **A quarter is a count of shop-houses plus shared infrastructure, and the corpus now has
   four of them** (this one, R-INST-2's craft quarters, family C's mages' district, family
   H/F's districts). The DW record shape needs `zoning` as a first-class institution kind that
   generates N buildings, rather than one building with a big footprint.

**(h) Continental versus English.** England is thin here and the dossier says so rather than
inventing an English exemplar: the standing evidence is Danish (Uraniborg), Austrian
(Oberstockstall), German (Libavius at Coburg/Rothenburg; Weikersheim), and Dutch (Leiden), and
the English contribution this lane touched is the Old Ashmolean's basement laboratory of the
late seventeenth century, which was NOT fetched and is asserted here only as a search hit. The
continental mechanism the English register lacks is the COURT laboratory — a prince's
installation inside a palace or castle, funded as a research establishment (Brahe under
Frederick II; Hohenlohe at Weikersheim; Rudolfine Prague, not researched) — and it is exactly
the rung a fantasy setting reaches for when it imagines a royal wizard. §15 carries the Chinese
and Islamic analogues.

**(i) FANTASY NOTE — the genre CONVENTION and the ENGINE CONTRACT.**
**CONVENTION.** The genre alchemist's shop is expected to have: a public front with jars and a
counter; a back or below workroom of bubbling apparatus; a reagent store with dangerous
contents; a risk of explosion; and a proprietor who lives above. Every one of those has a
CONFIRMED analogue above, and the explosion has one too — the fire and fume hazards are real
and were managed by vaulting, venting and separating the fuel. **This family is the tranche's
strongest case that the fantasy building can be composed entirely from sourced parts, and this
dossier proposes exactly that.** The two conventions with NO analogue are (1) the laboratory
that is BIGGER than the shop — historically the process cell is the small end of a one-or-two
room type, and (2) glassware suspended in mid-air or apparatus with no heat source, which the
grammar cannot express anyway. One convention is worth adopting BECAUSE it is sourced rather
than despite it: the alchemist's practice is SECRETIVE (Brahe's own words), which licenses the
`concealed` room kind the engine already has.
**The setting-agnostic test:** delete the magic and everything survives. Family B passes more
completely than any other in the tranche.
**ENGINE CONTRACT (read this session, CONFIRMED).** `Alchemist shop` and `Alchemist quarter`
both infer `institutionNature` = **`generic`** (`FACET_INFERENCE` has `/forge|smith|workshop|
foundry|mill|tannery|atelier/i` for `craft`, and "alchemist" matches none of them), so both
draw the two-cell generic template. The `craft` template — `workfloor` (workbench/hearth/rack)
+ `store` (crate/shelf) + `kiln` (hearth/brazier) — is a near-perfect fit and is one keyword
away. Probability: both rows are magic-scaled by name (`alchemist` is in the multiplier's
keyword list) AND by shelf, so the multiplier applies twice through one branch; the town row
is additionally gated by `forbiddenTradeRoutes: ['isolated']`. Neither row is in the
`priorityMagic < 66` hard-zero list, which is correct. **The defect worth reporting: at
`magicExists === false` both rows are struck** — by `institutionProbability`'s L302 gate
(their `tags` include `arcane` and `alchemy`, both in `ARCANE_INST_TAGS`) and by the UI strip
(the `magic` shelf plus the `alchemist` keyword) — so a world without functioning magic has no
apothecary-adjacent chemical trade at all, even though the trade is entirely mundane. The
apothecary itself survives, because R-INST-2's rows are on the Crafts and Economy shelves.
Flagged at §Σ as G3.


---

## §4 · FAMILY C — the guild, the academy and the district: Mages' guild (city L1891 "Organization of magic users. 2,000-5,000 population for chapter.") · Academy of magic (metropolis L2332 "Formal institution of arcane learning. Full curriculum, research facilities, visiting scholars.") · Mages' district (metropolis L2340 "Quarter inhabited by arcane practitioners: towers, workshops, libraries, reagent merchants.")

**BOUNDARY, STATED FIRST.** R-INST-3 family L holds the COLLEGIATE PARTI (SCHOOLS_QUAD,
COLLEGIATE_COURT, THEATRE, plus its family M library and family N observatory) and researched
`Academy of magic` there as a LEARNING institution; R-INST-1 holds the GUILD HALL. This
section does not restate either; it cites them by pointer and researches the three things they
do not cover: (1) the CHAMBERS-ON-STAIRCASES module, because it is the corpus's most important
circulation counterexample and it is a §452 question rather than a learning question; (2) the
QUARTER as a settlement object, which the `Mages' district` entry demands and no sibling holds;
and (3) the magical-conventions half of all three rows, which is this tranche's charter.
R-INST-3's §0.1 handed `Mages' district` here outright and noted that its "libraries" are the
mages' own.

**(a) Analogue.** The collegiate court is the analogue the genre already uses without naming
it, and its defining feature is a circulation module rather than a room list. In the
traditional Oxford and Cambridge plan "the rooms are arranged in sets on either side of central
wooden staircases", and "a staircase, in the more traditionally designed colleges, is a group
of students' rooms, with a ground-floor entrance leading off a quadrangle" — an arrangement of
"sets of rooms with no internal corridors" (CONFIRMED-digest, 2026-08-23, of the Wikipedia
Quadrangle (architecture) and Brasenose/New College pages, none of which was opened). The
founding programme is likewise attested in one sentence: William of Wykeham's "vision for the
College was of an integrated complex: Chapel, Hall, Muniment Tower, Library and rooms for
tutors and students to live and work in, all built around a quadrangle" at New College, Oxford
(CONFIRMED-digest, same round), with Merton's Mob Quad and Corpus Christi Cambridge's Old Court
each claiming to be the oldest surviving example of the type. The Inns of Court repeat the
plan for a professional rather than a scholarly body: four Inns, each with "a great hall,
chapel, library, gatehouses, courts and sets of chambers arranged around quadrangles", and
chambers still "named after their staircase number, like 1 Hare Court" (CONFIRMED-digest,
2026-08-23). **A professional body that trains, examines, licenses, disciplines, feeds, houses
and buries its own members is exactly what a mages' guild is, and the Inns of Court are the
European instance of it that is neither a monastery nor a craft guild.** That is the single
most useful analogue this family has, and it is a better one than the university because a
guild's members are practitioners, not students.

**The quarter is a STREET OF SHOP-HOUSES, and the medieval book trade is the measured case.**
The `Mages' district` entry ("towers, workshops, libraries, reagent merchants") describes a
clustering of dependent specialist trades, and Paris's book quarter is precisely that: "the
earliest professional booksellers had their shops from around 1200, together with
parchment-sellers, illuminators, scribes and book-binders" on the rue Neuve Notre-Dame, where
the bookmen "lived and worked"; the rue de la Parcheminerie "housed many medieval scribes and
illuminators"; the rue Erembourg de Brie was renamed rue des Enlumineurs for the illuminators
who worked there; and the whole system depended on the fact that "booksellers (stationers) in
Rue Neuve Notre Dame and in other such 'book streets' in European cities depended on the
professional scribes, illuminators and binders that lived in their vicinity"
(CONFIRMED-digest, 2026-08-23, of the medievalartresearch.com and finebooksmagazine accounts of
the de Hamel/Hindman book-trade walking tour; neither page was opened). **The mechanism is
inter-trade dependency at walking distance, and it produces a NAMED STREET, not a compound.**
The same mechanism produced R-INST-2's craft quarters and this dossier's family B alchemist
quarter; the district is one settlement-scale object with three catalog instances.

**Structural imperatives.** The collegiate court's imperatives are the hall's span (R-INST-1's
and R-INST-3's), the chapel's orientation (R-INST-3's, and this dossier adds nothing
theological to it), the library's light and fire law (R-INST-3 family M), the MUNIMENT tower's
security (R-INST-1's muniment room, cited), and the kitchen's fire and water. The quarter's
imperatives are not structural at all: they are ADJACENCY and SUPPLY.

**Siting and anchor law.** The collegiate court wants a walled precinct with ONE gate — the
gatehouse is the type's control point, and the muniment tower is usually over or beside it. The
quarter wants a street with the right neighbours and, for this tranche, the right services
(fuel, water, and the reagent trade of family B).

**Prosperity and wear grades.** Floor = a chapter that MEETS but does not own: a hired room in
an inn or a guildhall (R-INST-1's hall as host). Rung 1 = one hall with a chamber over. Rung 2 =
hall + chapel + chambers on one staircase. Rung 3 = the closed quadrangle: hall, chapel,
library, muniment tower, kitchen range, N staircases. Rung 4 = a second court. Ceiling = the
precinct of courts plus detached research buildings (which is the metropolis `Academy of
magic`, and which is family A's PRECINCT problem again). Decline sheds: the second court is let
out; the chapel is closed; the library is sold; the staircases are subdivided into tenements —
a documented fate of collegiate buildings and a good spatial expression of institutional
decline.

**(b) Measured.** **This family reached NO measured figure this session and is marked PARTIAL
for that reason.** What is owed, precisely: the quadrangle's plan dimensions (Mob Quad is the
standard datum), the chamber-set's room sizes, the number of sets per staircase, the staircase's
own width, the hall's span, and the gatehouse's passage width. R-INST-3 family L may already
carry some of these for the collegiate parti and the assembler cross-references it rather than
duplicating a search. Searches issued for this family and their outcome: "Inns of Court chambers
staircase plan no corridor Middle Temple Gray's Inn sets of chambers" (digest returned the
programme and the naming convention, no dimensions); "Oxford Cambridge college staircase plan
sets of rooms chambers no corridor quadrangle origin" (digest returned the module and the New
College programme, no dimensions). Two rounds, nothing measured; by the stopping rule the
family stops here and the gap is ledger item L.4.

**(c) Contested and counterexamples — the negation search.**
(i) **The negation that matters: does a body of LEARNED PRACTITIONERS build a hall of its own?**
Yes, and the Inns of Court are the proof — but they are late, English, metropolitan and few
(four), and they are lawyers' inns, which began as LODGINGS and only later became institutions.
The generalisation a generator must resist is that a mages' guild automatically owns a
quadrangle: the historical sequence runs hired room → hall → hall with chambers → court, over
generations, and the catalog's "2,000-5,000 population for chapter" is a chapter, i.e. the
FIRST rung, not the court.
(ii) **The college is a religious foundation in origin and the academy is not.** Stripping the
chapel out of the collegiate parti is not a neutral edit: the chapel is where the founder is
prayed for, and the whole endowment logic rests on it. A magical academy with no chapel needs
some other answer to "who paid, and what do they get" — a founder's tomb, a hall of benefactors,
a memorial. This dossier does not invent one; it flags that the parti has a HOLE where the
chapel was, and that R-INST-3's faith machinery, not this tranche, owns anything that fills it.
(iii) **A quarter is not a bigger building, and the catalog's own wording proves it.**
`Mages' district` lists "towers, workshops, libraries, reagent merchants" — four DIFFERENT
building types. The correct expression is N buildings of four partis on adjacent parcels, and
any generator that draws one big magical building for this row has mis-read the entry.
(iv) **The staircase module is a genuine counterexample to the corridor's inevitability.** ODQ
§452 notes that colleges license the corridor early "by their own program"; the English
collegiate evidence this lane found says the opposite for the CHAMBERS — the sets have "no
internal corridors" and are reached from a stair off the quad. The corridor's early
institutional licences are the barrack, the hospital ward range and the monastic dorter, not
the college chamber. Reported as a correction-candidate to the charter's own §4 S6 note, for
the owner to rule at CT-0.

**(d) CIRCULATION typology (ODQ §452) — the corpus's cleanest NO-CORRIDOR module.**
- **`STAIR_HALL{COLLEGIATE_SET}`** — the family's headline class. A ground-floor entrance off
  the quadrangle, one wooden stair, and two sets of rooms per landing, floor after floor, with
  NO horizontal circulation at all. It is a vertical distribution module that competes directly
  with the corridor and beat it in England for four hundred years. Every set is a dead end,
  which is precisely why it is private.
- `GALLERY{CLOISTER_WALK}` — the covered walk round the quadrangle is the HORIZONTAL
  circulation, and it is outdoors. R-INST-3 owns the cloister; this dossier notes only that
  the collegiate court's circulation is a ring of exterior walk plus N vertical dead ends, i.e.
  `EXTERIOR_WALK` + `STAIR_HALL`, and that this is a complete circulation solution with zero
  interior corridor.
- `CROSS_PASSAGE / SCREENS_PASSAGE` — in the hall, inherited from R-INST-1's hall.
- `LOBBY{GATEHOUSE}` — the single controlled entrance. The gate passage is the precinct's only
  joint with the street and it carries a porter, a lodge and often the muniment room above.
- `CORRIDOR` — **absent in the chamber ranges** (see (c)(iv)); licensed only in a later
  purpose-built research range, which is post-1700 and outside this corpus's register.
- The QUARTER's circulation is the STREET. A district's "circulation typology" is a street
  hierarchy plus the shop-house's own frontage rule (DW law 6), and this dossier records that
  as the honest answer rather than inventing an internal one.
- Width buckets: none measured (see (b)). PARTIAL.

**(e) STORAGE typology (ODQ §453).**
- `STORE{MUNIMENT}` — the tower or chamber holding the foundation's charters, seals and
  accounts. R-INST-1's family researched the muniment room and this dossier cites it; the
  transferable law is that it is HIGH (over the gate), SMALL, `lightReq: NONE`, and the most
  strongly secured cell in the precinct.
- `STACKS` + `READING` — R-INST-3 family M's library, cited entire.
- `PANTRY` / `BUTTERY` / `KITCHEN` / `CELLAR` — the collegiate hall's service end, R-INST-1's
  and R-INST-4's, unchanged. A body that dines together has a service range whatever it studies.
- `STORE{REAGENT}` — family B's, imported: an academy with "research facilities" needs the
  reagent store and its lock, and it is the one storage class the collegiate parti does not
  already have.
- `CLOSET{STUDY}` — the set of rooms is historically a chamber with a small study closet off
  it, which is the §453 `CLOSET` class in its scholarly form. This lane did not verify the
  study-closet detail from a primary this session and marks it PLAUSIBLE.

**(f) Typed proposal.**
`parti: COLLEGIATE_COURT` — R-INST-3's, reused without modification. Named here so the verdict
table can point at it.
`parti: CHAPTER_HALL` — the first rung: one hall, one chamber over, a locked chest. The `Mages'
guild`'s home at the catalog's own "2,000-5,000 population for chapter".
`parti: ACADEMY_PRECINCT` — COLLEGIATE_COURT + a detached research range (family B's
`TWO_ROOM_LABORATORY` or `CELLAR_LABORATORY`) + an observing platform (family A) + guest
chambers for "visiting scholars". A PRECINCT, i.e. the same multi-building record shape family
A needs.
`zoning: SPECIALIST_QUARTER{arcane}` — the `Mages' district`. Generates N buildings drawn from
{family A's tower, family B's shop-house-with-back-process, family D's scroll shop, R-INST-2's
shop-house} on adjacent parcels of one or two named streets, plus at most one COLLEGIATE_COURT.
`functions[]`: floor = `meeting`. Rungs: + `hall` → + `chest/muniment` → + `chamber_set` → +
`kitchen+buttery+pantry` → + `library` → + `gatehouse+lodge` → + `chapel-or-founder's-memorial`
→ + `laboratory` → + `guest_chamber` → + `second_court`.
`fixtures[]`: `LONG_TABLE`, `DAIS`, `BENCH`, `SCREEN`, `CHEST{muniment}`, `LECTERN`, `SHELF`,
`STAIR{wooden, collegiate}`, `PORTER'S_HATCH`, `BOARD{notices}`, `ARMS{founder's}`.
Structural buckets: `openSpan` (the hall), `precinct` (the wall and the single gate),
`quadFrontage` (every range faces the court, which INVERTS DW law 6's street-frontage rule —
see (g)), `secureCell` (muniment), `fuelHunger` (kitchen + laboratory).
Licensing: `Mages' guild` `tier ≥ city`; `Academy` and `district` `tier = metropolis`;
`prosperity ≥ high` for the court, `≥ middling` for the chapter hall; `era: 1264+ in the
English collegiate register (Merton), any era for a guild renting a hall`;
`magicLicense: MEDIUM` for the chapter hall, `HIGH` for the academy and the district.
**VERDICT per tier.** city `Mages' guild`: **BUILDING** — `CHAPTER_HALL` at the catalog's own
lower bound, `COLLEGIATE_COURT` at high prosperity; **HOSTED** in a guildhall or an inn at low
prosperity, which is the honest floor. metropolis `Academy of magic`: **BUILDING (PRECINCT)** —
`ACADEMY_PRECINCT`. metropolis `Mages' district`: **NO_BUILDING — a zoning.**
**HOME tags.** `hall` → HOME: `ROOM_KINDS.hall`. `chamber_set` → HOME: `ROOM_KINDS.chamber` +
`ROOM_KINDS.study`. `library` → HOME: `ROOM_KINDS.stacks` + `ROOM_KINDS.reading`. `muniment` →
HOME: `ROOM_KINDS.records` (and `ROOM_KINDS.strongroom` at the secure grade). `kitchen` → HOME:
`ROOM_KINDS.kitchen`. `guest_chamber` → HOME: `ROOM_KINDS.lodging`. **NO TYPED HOME**:
`gatehouse/lodge`, `quadrangle` (an outdoor cell the plan must hold), `cloister walk`,
`laboratory`, `founder's memorial`.

**(g) Consequences for the grammar.**
1. **A vertical distribution module that is not a corridor.** `STAIR_HALL{COLLEGIATE_SET}` —
   N sets per landing, no horizontal circulation, every set a dead end — must be expressible,
   or the generator will insert a corridor into a building type that provably had none.
2. **DW law 6 (frontage from the parcel) INVERTS for a precinct.** Every range of a collegiate
   court faces the COURT, and the street sees a blank wall with one gate. The frontage reader
   must be able to take an internal court as the frontage surface, with the street reduced to a
   single gate joint. This is the law-6 exception the corpus has been missing and it recurs at
   family J (the fondaco) and family I (the moated lodge).
3. **A `zoning` institution kind.** Three rows in this tranche alone (`Alchemist quarter`,
   `Mages' district`, and — see family H and J — the district-shaped entries) plus R-INST-2's
   and R-INST-4's. A zoning generates N buildings on adjacent parcels; it is not a building
   with a large footprint, and drawing it as one is the single most visible error the DW
   generator could make on this tranche.
4. **The hole where the chapel was.** A `founderMemorial` function, licensed when an
   institution has an endowment but no faith tenure, keeps the endowment logic legible without
   any theology. Proposed, flagged as a design idea rather than a finding.
5. **Institutional decline is SUBDIVISION.** A shed court becomes tenements; a shed staircase
   becomes lodgings. The shedding order for a precinct is a LETTING order, which is a different
   mechanism from a house's shedding and worth its own rule.

**(h) Continental versus English.** The staircase-and-sets module is specifically English; the
continental college and the continental university put students in a corridor-served
*collegium* or in lodgings across the town, and the German university of this period is a set
of hired rooms rather than a precinct at all (PLAUSIBLE — not researched this session, and
flagged in §L). The Italian and Spanish *collegio* with its arcaded courtyard is the same
court-facing idea with a loggia rather than a cloister. R-INST-3 family L carries whatever
continental collegiate evidence the program holds; this dossier does not duplicate it.

**(i) FANTASY NOTE — the genre CONVENTION and the ENGINE CONTRACT.**
**CONVENTION.** The genre magical academy is expected to have: a gate with a porter; a great
hall for dining and assembly; a library, usually restricted; lecture or practice rooms;
dormitories or chambers for students; laboratories; a tower or observatory; a restricted or
forbidden section; and a governing body with a chamber of its own. Nine expectations, and the
collegiate court supplies eight of them from CONFIRMED analogues — gate ← the gatehouse; hall
← the hall; library ← R-INST-3 family M; chambers ← the staircase sets; laboratories ← family
B; tower ← family A; council chamber ← the guild's chamber (R-INST-1); dining and service ←
the collegiate kitchen range. The ninth, the RESTRICTED SECTION, also has a sourced answer that
this dossier prefers to any invention: the CHAINED LIBRARY and the MUNIMENT ROOM are both real
restricted-access collections with real hardware (chains, a locked chest, a tower over a gate),
and `ROOM_KINDS.concealed` and `ROOM_KINDS.strongroom` already exist to express them. **The
grammar can therefore build the magical academy without minting a single new magical room.**
The convention with no analogue, and which must be marked as such: the academy of enormous
scale — the genre's academies commonly hold hundreds of students in one complex, where the
medieval English college held a few dozen and the whole university was a town of lodgings.
**The setting-agnostic test:** delete the magic and the academy is a college, the guild is an
Inn of Court, and the district is a book quarter. Family C passes, and the deletion changes
only the CURRICULUM, which the plan never sees.
**ENGINE CONTRACT (read this session, CONFIRMED).** `Academy of magic` infers
`institutionNature` = **`learning`** (`/academy/` matches) and so already draws the reading +
stacks + study template — the best result any row in this tranche gets. `Mages' guild` infers
**`trade`** (`/guild/` matches before any other row can), drawing hall + counting + strongroom:
wrong in nature but, by accident, three cells a chapter hall genuinely wants — the hall, the
clerk's counting room and the strongroom for the muniments. `Mages' district` infers
**`generic`**. Probability: all three are magic-scaled (shelf `Magic`, and `mage`/`academy of
magic` in the keyword list) at the metropolis tier penalty of 1.00, with the ×1.8 boost above
`priorityMagic` 66 and ×0.3 at or below 25; none is in the hard-zero list. `Academy of magic`
and `Mages' district` carry `minTier: 'metropolis'` — correct for once, since both entries sit
in the metropolis block anyway. At `magicExists === false` all three are struck.


---

## §5 · FAMILY D — the scriptorium, the scroll-shop and the enchanter's shop: Scroll scribe (city L1915 "Spell scrolls for sale. 25 GP (cantrip) to 500+ GP (3rd level).") · Enchanter's shop (city L1907 "Magic item creation. 5,000+ population typically.")

**BOUNDARY, STATED FIRST.** R-INST-3 family M holds the LIBRARY and the SCRIPTORIUM (shelving,
pitch, light, fire law, the chained desk) and R-INST-2 family B holds the SHOP-HOUSE; R-INST-1
holds the MINT and the ASSAY OFFICE and left the magical variant here by an explicit note in
its own fantasy section. This dossier researches the two things none of them covers: the
COMMERCIAL scribe's premises as distinct from the monastic scriptorium, and the high-value
secure workshop whose product is small, portable and worth more than the building.

**(a) Analogue.** Both entries are SHOP-HOUSES whose distinctive requirement is not process but
LIGHT and SECURITY, in opposite proportions.

**The scroll scribe is a commercial stationer, and the commercial stationer's premises are a
street.** The professional book trade of Paris put its booksellers "from around 1200, together
with parchment-sellers, illuminators, scribes and book-binders" on the rue Neuve Notre-Dame,
where the men of the trade "lived and worked"; the rue de la Parcheminerie was the scribes' and
illuminators' street; the rue Erembourg de Brie was renamed rue des Enlumineurs for its
illuminators, among them Honoré (active 1289–1312), Jean Pucelle (d. 1334) and Jean le Noir
(d. c. 1380); and the trade's structure was co-location — "booksellers (stationers) in Rue
Neuve Notre Dame and in other such 'book streets' in European cities depended on the
professional scribes, illuminators and binders that lived in their vicinity" (CONFIRMED-digest,
2026-08-23, of the medievalartresearch.com / finebooksmagazine accounts of the de Hamel and
Hindman book-trade walking tour; neither page was opened). Two of the named practitioners are a
married couple — "the husband and wife team of Richard and Jeanne de Montbaston who illuminated
romances in the fourteenth century" — which is a live/work datum: the workshop is a HOUSEHOLD.
**The commercial scribe's building is therefore a narrow shop-house on a named trade street,
with the writing done in the household and the selling done at the front.** The monastic
scriptorium is a DIFFERENT institution with a different plan and it is R-INST-3's; conflating
them would give a city scroll-shop a cloister it never had.

**The enchanter's shop is a goldsmith's shop, and the goldsmith's shop is documented street by
street.** Goldsmiths' Row on the south side of Cheapside, between Bread Street and Friday
Street, is the London instance: the goldsmiths "not only sold their rings, necklaces and
jewellery but worked in their shops and lived on the upper floors of the houses, and often had
craftsmen working for them on the premises"; the buildings were "three, four, and even five
stories tall, whose shopfronts were open to the light and set out with attractive displays of
luxury commodities"; and Stow counted "ten houses and fourteen shops in Goldsmith's Row"
(CONFIRMED-digest, 2026-08-23, of the Map of Early Modern London entry
[mapoflondon.uvic.ca/GOLD6.htm](https://mapoflondon.uvic.ca/GOLD6.htm) and the Fordham
*Medieval London* Cheapside exhibit; neither page was opened). **Four facts a grammar can use:**
the shopfront is OPEN TO THE LIGHT and is a display surface, not a wall; sell, make and live are
all one address; the house is TALL AND NARROW (three to five storeys on a burgage plot); and the
ratio of shops to houses is greater than one — fourteen shops in ten houses — so a shop is a
UNIT SMALLER than a building, which is exactly R-INST-2's shop-house finding arriving from
another direction.

**The regulatory layer is a VISIT, not a room.** The London Assay Office has operated from
Goldsmiths' Hall since 1478, and "the four wardens of the Goldsmiths' Company were tasked with
visiting workshops in the City of London to assay silver articles" (CONFIRMED-digest,
2026-08-23). The quality guarantee on a high-value portable product was enforced by INSPECTORS
WALKING THE STREET, with the hall as their base. That is the correct shape for any licensing of
magic-item manufacture a world might have: a hall (family C) plus a circuit, not a checkpoint.

**Structural imperatives.** LIGHT above all — a scribe, a limner and a goldsmith all need it,
and the medieval answer is a shop front open to the street and a workbench at a window.
SECURITY second: the product is small, portable and valuable, so the cell that matters is the
locked one. FIRE only for the goldsmith (a small hearth, a crucible, a blowpipe — R-INST-2's
craft grade, well below family B's furnace grade). WEIGHT and DAMP for the scribe's stock:
parchment and paper want dry, and R-INST-3's library fire-and-damp law covers it. NOISE:
essentially none, which is why these trades sit on the best street in town rather than the
edge.

**Siting and anchor law.** The best commercial frontage the settlement has — Cheapside, the rue
Neuve Notre-Dame — beside the institution that generates the demand (the cathedral and the
university for the book trade; the court and the great church for the goldsmith). This is the
opposite pull from family B's downwind edge, and the two magical trades therefore land in
DIFFERENT districts, which is a finding the `Mages' district` row (family C) should not
flatten.

**Prosperity and wear grades.** Floor = a stall or a board at a market, with the writing done at
home (R-INST-2's stall). Rung 1 = the shop-house's front room with a bench at the window and a
chest. Rung 2 = front shop + back workroom + the household above. Rung 3 = the tall narrow house
with a shop, a workshop, a store, a strongroom and lodging for journeymen on the premises. Rung
4 = several shops in one house, let separately (the fourteen-in-ten ratio). Ceiling = the trade
STREET with its hall (families C and R-INST-1). Decline sheds the strongroom's contents first,
then the journeymen, then the workroom, leaving a shop that only retails what others make — and
the catalog's `Scroll scribe` (sells) and `Enchanter's shop` (makes) are exactly those two
states of one building.

**(b) Measured.** Goldsmiths' Row: "ten houses and fourteen shops" (Stow, via CONFIRMED-digest);
buildings of three, four and five storeys (CONFIRMED-digest). **No linear dimension was obtained
for any building in this family this session.** Not found, searched: an excavated or measured
medieval goldsmith's workshop plan (query "medieval goldsmith workshop plan shop front
strongroom furnace assay London excavated" — the digest returned the institutional history and
explicitly no plan); a measured stationer's or limner's shop (query "medieval stationer scribe
shop premises Paris rue Neuve Notre-Dame bookshop stall limner workshop" — the digest returned
streets, names and dates and no premises dimensions). Two rounds, nothing measured. **This
family is marked PARTIAL for measurement** and inherits R-INST-2's burgage-plot and shop-house
dimensions by pointer rather than inventing its own; what is owed is one measured
goldsmith's-house plan (Schofield's *London Houses* is the named target) and one measured
stationer's premises. Ledger item L.5.

**(c) Contested and counterexamples — the negation search.**
(i) **The negation run for this family was the goldsmith-workshop plan search, and it returned a
clean null**: the archaeological literature on London metalworking exists (the *Historical
Metallurgy* paper "Some Archaeological Evidence for Metalworking in London c.1050–c.1700 AD"
appeared in the result set and was NOT opened), but no excavated workshop PLAN with a shop
front, a strongroom and a furnace came back. The honest statement is that this dossier types
the enchanter's shop from documentary evidence about a street, not from a measured building.
(ii) **"Scroll" is a form the medieval European book trade had largely abandoned.** The
commercial trade of the rue Neuve Notre-Dame produced CODICES. The roll survived for
administrative records, indentures, genealogies and liturgical rolls, not for the general
book. A `Scroll scribe` is therefore a genre object with a real trade behind it; the building
consequence is nil (a scribe writes on a sloping desk either way) but the STORAGE consequence
is real and is treated in (e) — rolls store in pigeonholes and boxes, codices on shelves, and
the fixture differs.
(iii) **The trade street is a counterexample to the "one shop, one building" assumption.**
Fourteen shops in ten houses means a shop can be a sub-cell of a house, a booth in a frontage,
or a lock-up under a jetty. R-INST-2 established this and this dossier confirms it from a second
source.
(iv) **A caution on Stow.** John Stow's *Survey of London* (1598) is a near-contemporary
topographer, not a surveyor, and "easily the most beautiful in London" is an opinion in the same
sentence as the count. The count is reported as Stow's, at digest remove, and is not treated as
a measurement.

**(d) CIRCULATION typology (ODQ §452).**
- `THROUGH_ROOM` — the shop-house's whole circulation at rungs 1–2: street → shop → workroom →
  yard, one room deep at a time.
- `STAIR_HALL{VERTICAL}` — a tall narrow house of three to five storeys needs a stair, and on a
  burgage plot it is a winder or a straight flight against a party wall. R-INST-2 owns the
  measured version; this dossier notes only that the household lives ABOVE the trade, so the
  stair is the joint between the public and the private halves, and the shop is a dead end off
  the street rather than a route to anywhere.
- `LOBBY / VESTIBULE` — **absent, and its absence is the type's defining feature.** The
  shopfront is "open to the light": the customer does not enter a lobby, the customer stands at
  a threshold and the counter is the boundary. The correct cell attribute is an OPEN FRONTAGE
  rather than a door, which the corpus should type as `frontage: OPEN_SHOPFRONT | DOOR |
  GATE_PASSAGE`.
- `CORRIDOR` — absent at every era grade in this family.
- `GALLERY` — absent; the jetty-side pentice over a shop row is R-INST-2's and is an exterior
  weather cover, not circulation.
- The trade STREET is the district-scale circulation, as in family C.
- Width buckets: none measured; the burgage frontage bucket is R-INST-2's and is used by
  pointer.

**(e) STORAGE typology (ODQ §453) — this family's real contribution.**
- **`STRONGROOM` / `STORE{HIGH_VALUE}`** — the enchanter's shop's defining cell. `lightReq:
  NONE`, sizeBucket SMALL, fixtures a strongbox, an iron-bound chest, a wall press with a lock,
  and at the ceiling a vaulted cell in the undercroft. Adjacency law: adjacent to the workroom,
  NOT to an external wall, and reached only through an occupied room. `ROOM_KINDS.strongroom`
  already exists and this is the tranche's cleanest HOME hit.
- **`STORE{ROLLS}` versus `STORE{CODEX}` — a fixture distinction the corpus should carry.**
  Rolls store horizontally in pigeonholes, boxes or a chest; codices store on shelves, flat or
  upright, and at the secure grade on a chained desk (R-INST-3 family M). A `Scroll scribe`'s
  stock is the FIRST kind, and a pigeonhole rack is a fixture the vocabulary lacks. Proposed:
  `PIGEONHOLE_RACK`.
- `STORE{MATERIALS}` — parchment, vellum, paper, pigment, gold leaf, gum, ink. Dry, dark, and
  for the pigments and the leaf, LOCKED: a limner's ultramarine and gold are as valuable per
  ounce as the goldsmith's silver. `lightReq: NONE`, sizeBucket SMALL, adjacency to the
  workroom.
- `CLOSET{COUNTING}` — the small cell where the money and the accounts sit, between the shop and
  the strongroom. `ROOM_KINDS.counting` exists.
- `CELLAR / UNDERCROFT` — the burgage plot's cellar, R-INST-2's, used here for bulk and for the
  strongroom at the ceiling grade.
- Fixture-not-cell, explicitly: the wall press, the aumbry, the chained desk, the pigeonhole
  rack, the window bench. All of them are too small to be cells and all of them are how this
  family actually stores things at rungs 0–2.
- PROHIBITION: the strongroom must not share an external wall (the party-wall and cellar-breach
  problem R-INST-1's treasury noted), and the materials store must not adjoin the hearth.

**(f) Typed proposal.**
`parti: SHOPHOUSE_OPEN_FRONT` — R-INST-2's shop-house with `frontage: OPEN_SHOPFRONT`, a bench
at the light, the household above, and a locked cell behind. The home of both entries.
`parti: SHOPHOUSE_SECURE` — the same with a `strongroom` promoted from fixture to cell and a
counting closet between it and the shop. The `Enchanter's shop` at high prosperity.
`parti: STALL_OR_BOARD` — the floor: R-INST-2's market stall, no building.
`functions[]`: floor = `stall`. Rungs: + `shop{open front}` → + `bench{at light}` → +
`store{materials, locked}` → + `workroom` → + `lodging{above}` → + `counting` → + `strongroom`
→ + `journeyman lodging` → + `cellar`.
`fixtures[]`: `SLOPING_DESK`, `WINDOW_BENCH`, `PIGEONHOLE_RACK`, `SHELF`, `PRESS{locked}`,
`AUMBRY`, `CHEST{iron-bound}`, `STRONGBOX`, `COUNTER`, `DISPLAY_BOARD` (the open shopfront's
selling surface — Cheapside's windows "stocked with standing cups and other plate"),
`SHUTTER{fall-down counter}`, `SMALL_HEARTH`, `CRUCIBLE`, `BLOWPIPE`, `BALANCE{assay}`,
`TOUCHSTONE`, `PUNCH{mark}` (the hallmark, i.e. the licensing fixture — R-INST-1's).
Structural buckets: `openFrontage`, `lightDemand{HIGH}`, `secureCell`, `narrowDeepPlot`,
`verticalStack{3..5}`, `smallHearth` (craft grade, NOT family B's furnace grade).
Licensing: `tier ≥ city` per the catalog (and the catalog's "5,000+ population typically" for
the enchanter is a plausible threshold for a luxury trade, though this dossier can neither
confirm nor refute it); `prosperity ≥ middling`, `≥ high` for the secure parti;
`era: 1200+ for the commercial book trade, any era for the goldsmith`;
`siting: PRIME_FRONTAGE` — and this is a positive siting requirement, not merely an absence of
one; `culture: any`; `magicLicense: MEDIUM` for the scroll scribe, `HIGH` for the enchanter
(the catalog's own gate puts `enchanting quarter` — though not `Enchanter's shop` — in the
hard-zero list below `priorityMagic` 66; see (i)).
**VERDICT per tier.** city `Scroll scribe`: **BUILDING** (`SHOPHOUSE_OPEN_FRONT`), degrading to
**HOSTED** (a bench in a stationer's or a limner's shop) at low prosperity and to
**NO_BUILDING** (a market board) at the floor. city `Enchanter's shop`: **BUILDING**
(`SHOPHOUSE_SECURE`); **HOSTED** inside a goldsmith's premises at middling prosperity.
**HOME tags.** `shop` → HOME: `ROOM_KINDS.stall`. `workroom` → HOME: `ROOM_KINDS.workfloor`.
`store{materials}` → HOME: `ROOM_KINDS.store`. `counting` → HOME: `ROOM_KINDS.counting`.
`strongroom` → HOME: `ROOM_KINDS.strongroom`. `lodging` → HOME: `ROOM_KINDS.lodging`. `cellar`
→ HOME: `ROOM_KINDS.cellar`. **This is the best-served family in the tranche** — seven of nine
functions have a typed home, because the engine's `trade` and `craft` templates were built for
exactly this shape. **NO TYPED HOME**: `bench{at light}` as a distinct cell (it is a fixture in
the shop, which is the right answer), and every one of `SLOPING_DESK`, `PIGEONHOLE_RACK`,
`AUMBRY`, `DISPLAY_BOARD`, `SHUTTER`, `CRUCIBLE`, `BALANCE`, `TOUCHSTONE`, `PUNCH` in
`FURNISHING_KINDS`.

**(g) Consequences for the grammar.**
1. **`frontage: OPEN_SHOPFRONT` as a typed value.** A shop whose front is a display surface
   rather than a wall with a door changes DW law 6 from "which edge does the door face" to
   "which edge IS the shop". The fall-down shutter that becomes the counter is the fixture that
   makes it work and it belongs in the vocabulary.
2. **A LIGHT DEMAND that competes for the same edge as the frontage.** Scribes, limners and
   goldsmiths all want the bench at the window AND the display at the street, and on a narrow
   burgage plot those are the same wall. The placement stage (S5) needs to resolve that
   competition rather than treating light as a per-room boolean.
3. **Storage format is a fixture question, not a size question.** Rolls, codices, ingots,
   pigments and reagents all "store", and all want different furniture. `STORE` needs a
   `format` attribute the fixture table reads.
4. **A shop is a sub-building unit.** Fourteen shops in ten houses. The parcel model must allow
   more than one commercial tenancy per building envelope, or every trade street will be drawn
   one-institution-per-house.
5. **Licensing by circuit, not by checkpoint.** The assay wardens walked to the workshops. Any
   "who is allowed to make this" rule in a world should be expressible as an inspection
   relationship between a hall and N shops, which is a settlement-graph fact rather than a plan
   fact — noted for DW's news/address layer rather than for the geometry core.

**(h) Continental versus English.** England and France give the same answer from two
directions: London's Goldsmiths' Row and Paris's book streets are both NAMED TRADE STREETS of
tall narrow shop-houses where the trade lives over the shop. The continental mechanism the
English register is thinner on is the university stationer — the Paris *libraire juré* was
sworn to the university and worked under its price control, which gives the book trade an
institutional patron the London goldsmith's trade does not have (PLAUSIBLE, not verified this
session). Italian and German high-value trades add the strongroom under the shop as a vaulted
undercroft rather than a chest in the back room (PLAUSIBLE, not researched). §15 carries the
non-European book and metal trades.

**(i) FANTASY NOTE — the genre CONVENTION and the ENGINE CONTRACT.**
**CONVENTION.** The genre magic shop is expected to have: a display front with visibly valuable
goods; a proprietor at a counter; a locked back or below cell holding the dangerous stock; a
workbench where items are made; and some form of protection on the door. All five have
CONFIRMED analogues above — the open shopfront with plate in the window, the counter, the
strongroom, the goldsmith's bench, and the shutter-and-lock. The two conventions that must be
marked as conventions are (1) the shop that is bigger inside than its frontage, which DW law 2
forbids by construction and which the grammar therefore refutes automatically, and (2) the
enchanting apparatus as a room-sized machine — historically the high-value making trade's
plant is BENCH-SIZED, and a room-sized apparatus belongs to family B's furnace grade, not here.
This dossier's recommendation is that the engine express "enchanting" as a `workroom` with a
`secureCell` and a bench, and let the fixtures carry whatever the world's practice is; nothing
about the plan changes.
**The setting-agnostic test:** delete the magic and the scroll scribe is a stationer and the
enchanter is a goldsmith. Family D passes completely, and it is the family where the FANTASY
LAYER IS PUREST FLAVOUR — the plan is unchanged in every particular.
**ENGINE CONTRACT (read this session, CONFIRMED).** `Scroll scribe` and `Enchanter's shop` both
infer `institutionNature` = **`generic`**: `FACET_INFERENCE`'s `trade` row is
`/market|guild|exchange|bank|counting|merchant|bazaar/i` and its `craft` row is
`/forge|smith|workshop|foundry|mill|tannery|atelier/i`, and neither "scribe" nor "enchanter"
nor "shop" appears in either. Both rows therefore draw the two-cell generic template, when
`trade` (hall + counting + strongroom) is an almost exact fit for the enchanter and `craft`
(workfloor + store + kiln) is close for the scribe. Probability: both are magic-scaled by shelf
and, for the enchanter, by the `enchant` keyword; the city tier penalty is 1.00. Neither is in
the `priorityMagic < 66` hard-zero list — but note the near-miss: that list contains
`'enchanting quarter'`, so a row named "Enchanting quarter" would be hard-zeroed while
"Enchanter's shop" and "Alchemist quarter" are not. That is a keyword list carrying an entry
for a catalog row that does not exist under that name, which is worth an owner's eye. At
`magicExists === false` both rows are struck (tags `arcane` and `enchanting`, plus the name
keywords `scroll scribe`, `scroll` and `enchanter`).


---

## §6 · FAMILY E — the circle, the grove and the open-air site: Druid Circle (village L812 "A circle of druids tied to the land… Some circles tend city gardens or hidden urban groves.") · Elder Grove Council (town L1349 "A council of senior druids… They may maintain a hidden grove beneath the streets…")

**BOUNDARY, STATED FIRST.** R-INST-3 family I holds the FAITH half of both rows — the open-air
sanctuary, the sacred grove, the temenos as a `NO_BUILDING` faith parti, with the enclosure, the
ring, the avenue, the altar-outside, the tree-and-spring and the suppression history — and
R-INST-1 family A holds the MOOT, i.e. the council's assembly as a hosted function on the
ground. Both explicitly pointed the magical conventions here. This section therefore researches
the SITE AS A THING WITH CIRCULATION AND STORAGE, which is a §452/§453 question neither sibling
answered, and it obeys the deity doctrine strictly: **nothing below says what the circle
believes, what it does, or what any of it means. It describes ground, banks, entrances, spacing
and thresholds.**

**(a) Analogue.** The catalog gives the family two entries and, without meaning to, two
different site types: a rural CIRCLE at village tier and an urban HIDDEN GROVE at town tier.
The rural site's measurable analogue is the henge; the urban one's is a walled garden with a
concealed entrance, and its most interesting property is that the catalog itself puts it
BELOW GROUND ("a hidden grove beneath the streets"), which makes it a DW law 7 object rather
than a DW law 8 one.

**The henge as a designed circulation object.** Avebury is the measured case and it is a piece
of access control at landscape scale. Its ditch was cut inside the bank, so the bank is not a
defence but a SCREEN: it hides the interior from outside and makes an amphitheatre of the
inside. The enclosure covers "28.5 acres (11.5 hectares)" and is entered by "four causewayed
entrances", each about 20 m wide, aligned north-north-west, south-south-east, east-south-east
and west-south-west; the entrances carried "timber entrances" that "possibly [restricted]
access to the circles to only a few people at a time"; the outer circle held "between 98 and
105 stones arranged around the perimeter edge" set "about 36 feet (11 metres) apart"; the
southern inner circle centred on the Great Obelisk of "21 feet (6.4 metres)" with 29 stones
round it and a rectangular sarsen setting called the "Z" feature; the northern inner circle
"probably consisted of 27 stones" round a Cove of three stones; and "a double avenue of stones"
runs from the southern entrance toward the Sanctuary "about a mile to the south-east"
(all CONFIRMED, [English Heritage: Description of Avebury Henge and Stone Circles](https://www.english-heritage.org.uk/visit/places/avebury/history/description/),
fetched 2026-08-23). **A twenty-metre causeway narrowed by a timber gate to a few people at a
time is a THRESHOLD, and a threshold is the one architectural element an open-air site
certainly has.**

**The number audit on the bank, performed and reconciled.** English Heritage gives the bank's
present height as "14–18 feet (4.2–5.4 metres)" and its original height as "nearly 55 feet
(17 metres)", with the ditch originally "30-foot (9-metre)" deep; the round-1 search digest
instead gave "a huge outer bank reaching originally to a height of as much as 6 meters", an
outer bank "between 22m and 30m wide at its base", and a ditch variously "21 metres wide and
11 metres deep", "up to 9m deep and 20m wide" and "10 to 14 meters deep". Six figures, three
apparently in conflict. They reconcile if the 17 m is measured BANK CREST TO DITCH FLOOR and
the 6 m is bank crest above the old ground surface: 6 m of bank plus 9 m of ditch is 15 m, and
"nearly 55 feet" over a ditch cut a little deeper than 9 m closes the remainder. On that
reading the honest set is: **ditch 9–11 m deep and 20–21 m wide; bank c. 6 m above ground and
22–30 m wide at base; c. 15–17 m from ditch floor to bank crest; present bank 4.2–5.4 m.** The
reconciliation is PLAUSIBLE (this lane's arithmetic, not a source's statement) and every
individual figure keeps its own label. The "10 to 14 meters deep" variant is not reconcilable
with the others and is set aside as probably a bank-crest-to-ditch-floor figure quoted as a
ditch depth. Ledger item L.6.
The avenue's two spacings likewise need scoping: EH's "about 36 feet (11 metres) apart" is
given for the stones "throughout the monument", while the digest's West Kennet Avenue figures
are "stones 80 feet (25 metres) apart, arranged in pairs that faced each other across the
50-foot (15-metre) width of the avenue". Read as **circle spacing c. 11 m, avenue pair spacing
c. 25 m along the route and c. 15 m across it** the two are compatible, and this dossier
reports them scoped rather than averaging them.

**Structural imperatives — there are almost none, and that is the finding.** An open-air site
has no span, no roof, no hearth, no chimney and no light requirement. What it has is EARTHWORK
(a bank is a volume of spoil that came out of a ditch, so bank and ditch are one construction
fact), STONE HAULAGE (a 6.4 m obelisk arrives by a route, which is an exterior consequence on
the parcel), DRAINAGE (a ditch fills), and THRESHOLD CONTROL. The urban hidden grove adds two
more: an ENCLOSING WALL, and — if the catalog's "beneath the streets" is taken at its word —
a below-grade chamber with light and ventilation problems that no grove has ever had.

**Live/work.** Nobody lives in a henge. The `Druid Circle` and the `Elder Grove Council` are
institutions whose members live somewhere else — which makes this family the corpus's clearest
case of an institution that HAS a place but has no dwelling, and therefore has no interior at
all in the DW sense. What it needs from the grammar is a SITE record, not a floor plan.

**Prosperity and wear grades.** Floor = ground with a marker on it: a tree, a spring, a single
stone. Rung 1 = a defined enclosure (a hedge, a ditch, a wall) with one entrance. Rung 2 = an
enclosure with a threshold structure at the entrance and a keeper's shelter outside it. Rung 3 =
the enclosure with an approach avenue and internal settings. Ceiling = Avebury's landscape
complex. In the URBAN direction the ladder is different: floor = a corner of a churchyard or a
garden; rung 1 = a walled garden with a locked gate; rung 2 = a walled garden with a garden
house; ceiling = the concealed below-grade chamber the catalog names. Decline is peculiar to
this family: an open-air site does not fall down, it is PLOUGHED, ROBBED FOR STONE, or BUILT
OVER, and a settlement generator should express those as three distinct fates with different
spatial residues.

**(b) Measured.** Avebury (CONFIRMED, English Heritage, fetched 2026-08-23, unless marked):
enclosure 11.5 ha / 28.5 acres; overall diameter c. 350 m (CONFIRMED-digest); ditch originally
9 m deep, 20–21 m wide (CONFIRMED / CONFIRMED-digest); bank 22–30 m wide at base
(CONFIRMED-digest), present height 4.2–5.4 m, original c. 17 m to the ditch floor; four
causewayed entrances each c. 20 m wide (CONFIRMED-digest); outer circle 98–105 stones at c. 11 m
spacing; southern inner circle 29 stones round a 6.4 m obelisk; northern inner circle c. 27
stones round a three-stone Cove; West Kennet Avenue pairs c. 25 m apart along the route across a
c. 15 m width (CONFIRMED-digest), running c. 1 mile (1.6 km) to the Sanctuary. NOT FOUND,
searched: any measurement of a HISTORIC-period sacred grove or of an urban walled sacred garden
(R-INST-3 family I may carry the grove's own evidence); any excavated example of a below-ground
urban grove, which is unsurprising since the concept is the catalog's own invention.

**(c) Contested and counterexamples — the negation search, which returned this dossier's
sharpest single finding.**
(i) **Druids did not build stone circles, and the association is a documented modern
invention.** "During the seventeenth and eighteenth centuries, influential antiquarians such as
John Aubrey and later William Stukeley proposed strong links between Stonehenge and the
Druids. However, this connection lacks historical evidence." The chronology alone settles it:
"Stonehenge was constructed between roughly 4,000 and 5,000 years ago, while the earliest
surviving written record of the druids dates back about 2,400 years", so "Stonehenge's principal
construction phases predate the historical Druids by more than two thousand years". And the
classical testimony points the other way entirely: "Classical authors referred to ancient druids
worshipping only in wooded groves — there is no mention of any link between druids and stone
monuments." Stukeley's own motive is on the record: he "failed to find a publisher for his
serious books on the henge monuments", "so he revved up the story, brought in Druids"
(CONFIRMED-digest, 2026-08-23, of Live Science's "Did druids build Stonehenge?", The
Conversation's "Britannia, Druids and the surprisingly modern origins of myths" and the Garden
History Blog's Stukeley piece; NONE of the three was opened, so every sentence here is
digest-grade and none is quotable as primary). **The grammar consequence is precise and it is
not a matter of taste.** If the engine ever places a stone ring because a settlement has a
`Druid Circle`, it will have built a causal link that the historical record specifically
refutes, and it will have done so by importing an eighteenth-century publishing decision. The
correct model is the opposite direction: **a stone ring is a FOSSIL of the landscape that a
later institution may OCCUPY**, exactly as the undercity train's sealed arches are fossils. The
circle's own place, on the classical evidence, is a GROVE.
(ii) **The counter-consideration, stated so the negation is not overread.** This is a
setting-agnostic fantasy product, and a world may perfectly well contain an order that did
build its rings. The finding is not "forbid stone circles"; it is "do not make the association
automatic, and never generate the ring as a product of the institution". A ring should be a
TERRAIN or HISTORY fact that the institution's siting reads, which is the same architecture the
engine already uses for a `magical_node` resource (family E's own probability boost — see (i)).
(iii) **The bank is inside-out for a defence, which is the henge's other counterexample.** The
ditch is on the INSIDE at Avebury. Anything the grammar infers about enclosures from castle
practice — ditch outside, bank inside, defence outward — is wrong here, and a site whose screen
faces inward is a distinct enclosure type.
(iv) **"Beneath the streets" has no historical analogue at all** and this dossier says so
plainly rather than manufacturing one. The nearest real things are the mithraeum, the crypt, the
undercroft and the ice house, all of which are R-INST-3's or the undercity train's. What the
catalog is describing is a concealed below-grade CHAMBER, and DW law 7 already rules that a
below-grade room exists if and only if the undercity graph anchors it. That is the honest
verdict and it costs the engine nothing new.

**(d) CIRCULATION typology (ODQ §452) — an all-exterior case, which the class set can just
about express.**
- **`THRESHOLD` (proposed as a new class, or `LOBBY` used outdoors).** The causeway narrowed by
  a timber gate "to only a few people at a time" is a circulation cell in the open air: a
  20 m gap in a bank, reduced by structure to a person-wide passage. The corpus has no class for
  an outdoor entrance cell and this family needs one; `LOBBY{EXTERIOR}` is the minimal
  expression.
- **`EXTERIOR_WALK{AVENUE}`** — the CIRC addendum's exterior-walk class at its largest: a
  1.6 km double stone avenue c. 15 m wide is a corridor by any functional definition, and it is
  the only "long hallway chamber" in the corpus that is also a mile long. It has a DIRECTION
  (from the southern entrance outward) and a TERMINUS (the Sanctuary), which are exactly the
  attributes the addendum gives a gallery.
- `THROUGH_ROOM` — the enclosure interior, with the inner circles as cells reached through the
  outer space. There is no route; there is a sequence of enclosures.
- `CORRIDOR`, `STAIR_HALL`, `SCREENS_PASSAGE`, `GALLERY{interior}` — all absent, all licensed
  absent by the type having no roof.
- The URBAN row adds, at most, one `STAIR_HALL{VERTICAL}` down to the concealed chamber and one
  `LOBBY` at the garden gate; both are undercity joints and both belong to law 7.
- Width buckets, CONFIRMED: entrance causeway c. 20 m; avenue width c. 15 m; circle stone
  spacing c. 11 m. These are the only measured circulation widths in the tranche that came from
  an opened primary-adjacent page rather than a digest.

**(e) STORAGE typology (ODQ §453).** **None, and the absence is a finding rather than a gap.**
An open-air site stores nothing: it has no roof, no lock and no dry cell. Anything the
institution owns is stored at its members' houses, in a keeper's shelter outside the enclosure,
or — the urban case — behind the garden wall in a garden house. The one storage class this
family can license is therefore `STORE{GARDEN_TOOL}` at fixture scale, and the honest
recommendation is that the DW validator be able to certify a plan with ZERO storage cells rather
than treating storage as universal. R-INST-4's water-supply family reached the same conclusion
from the other end of the corpus and the two together make it a rule.

**(f) Typed proposal.**
`parti: OPEN_ENCLOSURE` — a bounded ground with an enclosing element (bank+ditch, hedge, wall,
tree line), N entrances, at most one threshold structure per entrance, and no roofed cell.
`enclosureScreen: INWARD | OUTWARD` (the henge's inside-out ditch is the reason this attribute
must exist). `entranceCount: 1..4`.
`parti: WALLED_GARDEN_CONCEALED` — the urban row: a walled plot inside a block, one gated
entrance off a lane or through a building, an optional garden house, and — only if the
undercity graph anchors it — one below-grade chamber reached by a stair.
`parti: SITE_WITH_APPROACH` — `OPEN_ENCLOSURE` plus an `EXTERIOR_WALK{AVENUE}` with a stated
terminus. The ceiling.
`functions[]`: floor = `ground{marked}`. Rungs: + `enclosure` → + `threshold` → +
`internal setting` → + `approach` → + `keeper's shelter (outside)` → + `garden house` → +
`concealed chamber (law 7 only)`.
`fixtures[]`: `STANDING_STONE{height}` (a fixture that sizes nothing but is a haulage fact),
`MARKER_TREE`, `SPRING_HEAD`, `TIMBER_GATE`, `BANK`, `DITCH`, `HEDGE`, `WALL{garden}`,
`BENCH{outdoor}`. Every one of these is outside `FURNISHING_KINDS`.
Structural buckets: `earthwork{spoilBalance}` (bank volume equals ditch volume — a check the
validator can actually run), `haulageRoute` (a 6.4 m stone came from somewhere), `noRoof`,
`drainage`, `thresholdControl`.
Licensing: `Druid Circle` `tier ≥ village`, `Elder Grove Council` `tier ≥ town` per the
catalog; `prosperity: ANY` — this is the one family in the tranche a poor settlement can have
in full, because ground is free; `era: any`; `siting: OUTSIDE_THE_BUILT_EDGE | ENCLOSED_BLOCK
(urban) | EXISTING_FOSSIL_RING (occupation, never construction)`; `culture: any`;
`magicLicense: LOW` — the lowest in the tranche, since a grove needs no infrastructure at all.
**VERDICT per tier.** village `Druid Circle`: **NO_BUILDING** — a SITE, with an optional
keeper's shelter that is a cottage (family A's `PRACTITIONER_CORNER`) and not part of the site.
town `Elder Grove Council`: **NO_BUILDING** for the grove itself; the COUNCIL's meeting is
**HOSTED** (R-INST-1's moot, in a hall or on the ground); the "hidden grove beneath the
streets" is **BUILDING (below-grade)** if and only if the undercity graph anchors it at that
parcel, and **NO_BUILDING** otherwise. That conditional verdict is the correct DW-law-7 answer
and it is the first time in the corpus a verdict has depended on another train's data.
**HOME tags.** **NO TYPED HOME for the entire family.** `ROOM_KINDS` has no site, ground,
enclosure, threshold, avenue, garden or open-air cell of any kind, and `FURNISHING_KINDS` has no
stone, tree, spring, gate, bank or ditch. This is not an oversight in the engine — the interior
grammar was built for interiors — but it means the DW plan surface cannot currently represent an
institution that HAS no interior, and the validator must be able to certify that as lawful
rather than failing it.

**(g) Consequences for the grammar.**
1. **A `SITE` record beside the `FloorPlan` record.** An institution with no roofed cell still
   has a parcel, an enclosure, entrances, thresholds and an approach. DW's data contract (§5)
   should admit `Site { enclosure, entrances[], thresholds[], settings[], approach }` as a
   sibling of `FloorPlan`, and S9's lawfulness walker must certify a site with zero cells as
   VALID rather than as a floor violation. Without this the generator will invent a hut.
2. **`enclosureScreen: INWARD` as a typed attribute.** The henge's inside-out ditch.
3. **The fossil rule, generalised above ground.** DW law 7 makes basements a projection of a
   canonical graph. This family argues for the same discipline for LANDSCAPE fossils: a stone
   ring, a barrow, an old bank, a ruined wall are facts of the parcel that an institution may
   OCCUPY, and no institution should ever generate one. That is a one-line addition to law 5's
   fossil machinery and it forecloses the druid error permanently.
4. **`spoilBalance` is a free validator arm.** Bank volume should approximate ditch volume. It
   is cheap, it is checkable, and it will catch any generated earthwork that is physically
   impossible.
5. **Zero-storage plans must be lawful.** See (e).

**(h) Continental versus English.** England supplies the measured henge; the type is
north-west European and the Breton alignments, the Iberian and Alpine circles and the Nordic
ship settings are its siblings (PLAUSIBLE, not researched this session). The MEDITERRANEAN
analogue is a different thing and is R-INST-3's: the temenos, an enclosed precinct with a
boundary, a gate and an altar OUTSIDE the building, which is the same threshold logic with a
temple added. The Germanic and Baltic sacred grove — the type the classical sources actually
attribute to druids — is documentary and archaeologically near-invisible, which is precisely
why the eighteenth century reached for the stones instead. §15 carries the non-European
open-air sites.

**(i) FANTASY NOTE — the genre CONVENTION and the ENGINE CONTRACT.**
**CONVENTION.** The genre druid circle is expected to be: a ring of standing stones, in or
beside a wood, away from settlement, with a central feature, entered on an axis, and not
built by anybody in living memory. Four of those five are CONFIRMED features of a henge; the
fifth — that the druids built it — is the one the historical record specifically refutes
(see (c)(i)), and it is also the one the genre most insists on. **This dossier's recommendation
is to keep the image and invert the causation**: the ring is old, the order is new, the order
uses the ring. That is both truer and better drama, and it costs the engine nothing because the
fossil machinery already exists. The urban "hidden grove" convention has no analogue and should
be licensed by the undercity graph, which turns a genre flourish into a fact the world can
already prove.
**The setting-agnostic test:** delete the magic and the circle is a monument with an order of
land-stewards attached — foresters, well-keepers, commoners' representatives. The family passes,
and note that R-INST-1's Warden's Lodge (family I) is exactly that mundane residue.
**ENGINE CONTRACT (read this session, CONFIRMED).** `Druid Circle` infers `institutionNature` =
**`generic`** — and note the near-miss: `magicLedger.ARCANE_INSTITUTION_PATTERN`
(`/(tower|sanctum|college|conclave|circle|guild.*mage|enclave|atheneum|library.*arcane)/i`)
DOES match "Druid Circle" on `circle`, so the magic-census counts it as arcane infrastructure
while the interior grammar sees nothing. `Elder Grove Council` infers **`civic`** (`/council/`),
drawing hall + chamber + records — a building, for an institution this dossier verdicts as
`NO_BUILDING`. That is the tranche's clearest case of the inference table manufacturing an
interior for something that has none. Probability: both rows are magic-scaled by shelf, and both
additionally hit the DRUID ROUTE BOOST in `institutionProbability` (`/druid|grove shrine|
warden's lodge|sacred grove|elder grove/`), which multiplies by {isolated 1.8, road 1.4, river
1.5, crossroads 0.9, port 0.8} and by 1.5 again if the settlement has a `magical_node`
resource. **That boost is a genuinely good piece of engine design and this dossier endorses it
on the evidence**: it makes the order a function of the LAND rather than of the town, which is
what the classical grove testimony supports. `Elder Grove Council` carries
`priorityCategory: 'military'`, a faction-role artefact that R-INST-1 already flagged and that
selection ignores. At `magicExists === false` both rows are struck.


---

## §7 · FAMILY F — the infrastructure of high magic: Teleportation circle (town L1371 "Rare permanent circle. Extremely expensive to construct and maintain…"; city L1923 "Permanent teleportation circle. Access is controlled and expensive to maintain. Transformative infrastructure…") · Airship docking (high magic) (city L2179 "Mooring towers with magical weather protection. Eberron-style.") · Message network (high magic) (city L2187 "Sending Stones network or Speaking Stones. 250-10,000 GP per station.")

**A CATALOG DEFECT, REPORTED FIRST.** `Airship docking (high magic)`'s description ends
"Eberron-style" — a direct reference to one publisher's proprietary campaign setting. Under
`product-scope-boundaries.md`'s sixth boundary (SETTING-AGNOSTIC: the product targets any
medieval-inspired campaign, up to and including a world made entirely of clouds) and under the
charter's §8 discipline (1) "conventions, never expression", that phrase does not belong in the
catalog's shipped prose. This dossier records it as a defect for the owner and adopts nothing
from it; every finding below is derived from real airship infrastructure and from generic
mooring practice. A catalog edit is owner-gated and is not proposed here.

**(a) Analogue.** Three entries, three genuinely different building problems, united by one
property: each is a NETWORK NODE. A node's plan is governed not by what happens inside it but by
what arrives at it, and the analogues that matter are therefore the historical types whose whole
job was to receive something from far away under control.

**The teleportation circle's analogue is the CONTROLLED THRESHOLD, and the corpus already holds
three of them.** No historical building teleported anything, so the honest method is to take the
entry's own functional description — "rare", "permanent", "extremely expensive to construct and
maintain", "access is controlled" — and find the real building programme that matches it. That
programme is the guarded arrival point: the town gate with its gatehouse, portcullis and porter
(R-INST-1); the customs point at a quay (R-INST-2); and, best of all, the fondaco's single land
gate where the arriving foreigner surrendered his weapons to a resident official who then
assigned him a room (family J, CONFIRMED). All three share a four-part plan: an OUTER holding
space, a THRESHOLD that one party controls, an OFFICER'S CELL beside it, and a RECORD. Add the
one physical requirement the catalog itself states — a permanent, expensive, maintained FLOOR —
and the cell is fully specified without inventing anything: a level, durable, precisely laid
floor in a guarded chamber with a control point and a record. The nearest historical floor of
that description is a mosaic or an inlaid pavement, and the nearest historical "expensive to
maintain and access-controlled room reached through a guard post" is a treasury (R-INST-1).

**The airship dock's analogue is real and enormous.** Rigid-airship infrastructure existed and
was measured. Cardington Shed No. 1, built 1917, was "213.4m long", with "a clear width of 55.3m
and a clear height at its centre of 37.2m"; between October 1924 and March 1926 "the shed's roof
was raised by 10.7 m (35 ft) and its length was increased to 247 m (812 ft)"; the imperial set
quoted for the finished shed is "812 feet long, 158 feet high and 180 feet wide"
(CONFIRMED-digest, 2026-08-23, of the Airship Heritage Trust, engineering-timelines and
Wikipedia Cardington entries; none was opened). **Number audit, performed:** 812 ft = 247.5 m,
which matches the post-1926 length, so the imperial trio is the LATER shed, not the 1917 one;
180 ft = 54.9 m, which matches the 55.3 m clear width within rounding; and 158 ft = 48.2 m
against a 1917 clear centre height of 37.2 m plus a 10.7 m roof raise = 47.9 m, which closes.
The two sets are one building at two dates and they are internally consistent — a good sign for
the figures and a caution against quoting them as two independent measurements. The mooring
mast, completed 1926, was "an eight-sided steel girder structure, 200 feet (61 m) high, tapering
from 70 feet (21 m) diameter at ground level to 26 feet 6 inches (8.1 m) at the passenger
platform, 170 feet (52 m) from the ground" (CONFIRMED-digest, same round). **The mast is the
finding that matters most**, because it is the CHEAP option and it is the one a fantasy town can
plausibly have: a tapering tower, a platform near the top, a passenger transfer at 52 m, and no
enclosure at all. The shed is the ceiling; the mast is the rung.

**The message network's analogue was fetched and is unexpectedly modest.** The Chappe optical
telegraph, the first working long-distance signalling network in Europe, ran its early stations
out of ORDINARY ROOMS: at Parcé the operators worked in "one of the chambers of ladite maison"
(a chamber of the said house) with "un pendule et un télescope" (a clock and a telescope)
sighted on the station at Brulon "quatre lieues" — "four leagues (about 15km)" — away; the
Castelnaudary station, "originally built in about 1800", is described as "a very small barn with
oddly shaped antennas on the roof"; the apparatus itself was a central regulator arm "4.6m long,
with 3 pivots" carrying indicator arms "1.3m long, and counterbalanced by weights", each
rotatable into one of seven positions (CONFIRMED,
[johnhearfield.com/Radar/Chappe.htm](https://www.johnhearfield.com/Radar/Chappe.htm), fetched
2026-08-23). **A station is a room with a clock, a telescope, a sight-line and a roof-mounted
apparatus.** That is the entire plan, and it is the answer to the catalog's "250-10,000 GP per
station" — the cheap station is a hired room, the dear one is a purpose-built tower on a hill.

**Structural imperatives.** For the circle: a LEVEL, DURABLE, PRECISE FLOOR (the only physical
requirement the entry states), plus security. For the dock: CLEAR SPAN and CLEAR HEIGHT at the
shed grade — 55 m wide and 37 m high is beyond any pre-industrial construction and is therefore
a magic-licensed structural bucket, not a masonry one — and at the mast grade, HEIGHT, a
FOUNDATION for an eight-sided tower, and VERTICAL PASSENGER TRANSFER at 52 m, which means a
stair or a lift inside the mast. For the network node: SIGHT-LINE, which is a siting constraint
of a kind the corpus has only met once before (family A's observing platform), and a ROOF MOUNT
that must be reachable, adjustable and visible from a distance.

**Siting and anchor law.** Sight-line siting is the family's distinctive rule and it works
backwards from the network: a station goes where it can SEE the next station, so the settlement
does not choose the site, the chain does. The Chappe chain's 15 km leg is the measured spacing.
The airship mast wants open ground and a clear approach with no obstruction — the opposite of a
dense frontage. The teleport circle wants the most defensible interior in the settlement, which
in practice means inside another institution's compound.

**Prosperity and wear grades.** Circle: floor = a marked pavement in an existing chamber
(HOSTED); rung 1 = a dedicated locked chamber; rung 2 = chamber + guard cell + record room; rung
3 = a walled compound with the chamber at its centre. Dock: floor = a mooring RING on an
existing tower or gate; rung 1 = a purpose-built mast with a stair; rung 2 = mast + a ground
handling yard + a store; ceiling = the shed. Network: floor = a hired chamber with a roof
mount; rung 1 = a purpose-built station house; rung 2 = a station tower on an eminence with a
keeper's dwelling. Decline is brutal and specific: a network node is worthless the moment its
NEIGHBOUR fails, so this family sheds in CHAINS rather than in cells — the correct decline model
is that the whole route goes dark and every station on it becomes a room with a strange floor
or a tower with nothing on top.

**(b) Measured.**
- Cardington Shed No. 1: 1917 — 213.4 m long, 55.3 m clear width, 37.2 m clear centre height;
  1924–26 — roof raised 10.7 m, length extended to 247 m (812 ft), overall 158 ft (48.2 m) high,
  180 ft (54.9 m) wide (CONFIRMED-digest; audited above).
- Cardington mooring mast, 1926: 61 m (200 ft) high; 21 m (70 ft) diameter at ground; 8.1 m
  (26 ft 6 in) at the passenger platform; platform 52 m (170 ft) above ground; eight-sided steel
  girder (CONFIRMED-digest).
- Chappe: station spacing Brulon–Parcé about 15 km (four leagues); regulator arm 4.6 m with
  three pivots; indicator arms 1.3 m, counterbalanced, seven positions each; the station itself
  a chamber of a house, or "a very small barn" with the apparatus on the roof (CONFIRMED).
- **NOT FOUND, searched.** No dimension for a Chappe station BUILDING (tower height, room size,
  window sizes, sight-line aperture) — the page explicitly lacks tower height, operator counts,
  sight-line specifications and section drawings. No historical analogue of any kind for a
  teleportation circle, which is the expected null and is reported as such. The teleport
  chamber's size bucket in (f) is therefore DERIVED from the guarded-treasury and gatehouse
  types, and says so.

**(c) Contested and counterexamples — the negation searches.**
(i) **"The signalling station was a room, not a building" — CONFIRMED, and it is the family's
best finding.** The first European long-distance network ran out of a chamber of a private
house. A world's message network should therefore default to HOSTED and buy its own building
only at the top of the ladder. This exactly parallels family A's observatory negation, and the
two together are the tranche's structural theme: **the infrastructure of a new practice starts
in somebody else's room.**
(ii) **The airship shed is not a medieval building and cannot be pretended into one.** A 55 m
clear span with a 37 m clear height is a twentieth-century steel structure. In a
`EUROPEAN_FANTASY_BASE` morphology the shed is available ONLY as a magic-licensed structure, and
the honest way to type that is a structural bucket (`clearSpan: EXTREME`) with a stated
licensing dependency, so that a world with a low magic dial gets the MAST and not the shed. The
largest genuinely pre-industrial clear spans in the corpus are R-INST-4's Roman and R-INST-1's
hall spans, and they are an order of magnitude smaller.
(iii) **"Mooring towers with magical weather protection" contains its own counterexample.** The
reason Cardington needed a 213 m shed is WEATHER: an airship at a mast is at the mercy of it.
If the world's magic removes the weather problem, the shed is unnecessary and the mast is
sufficient — so the catalog's own phrase, read carefully, argues for the cheap parti rather than
the expensive one. That is a rare case of the catalog's flavour text carrying a correct
structural inference, and this dossier adopts it.
(iv) **The teleport circle's real risk is not structural but URBAN.** A permanent arrival point
that bypasses the gate destroys the wall's purpose, and every historical settlement with a
controlled perimeter treated uncontrolled arrival as the thing to prevent. The building
consequence is that the circle belongs INSIDE a compound with its own guard, which is what the
catalog's "access is controlled" already says; the settlement consequence is R-INST-1's and the
defence engine's, not this dossier's.
(v) **A number audit caution on the Chappe leg.** "Four leagues (about 15km)" makes a league
3.75 km, which is a plausible pre-metric French *lieue de poste* (about 3.9 km). The figure is
internally consistent. But 15 km is the ONE measured leg quoted on the page and the network's
legs varied with terrain; it is a specimen, not a network constant.

**(d) CIRCULATION typology (ODQ §452).**
- **`LOBBY / VESTIBULE` as a CONTROL cell** — the teleport circle's defining circulation. An
  outer holding space, a controlled threshold, an officer's cell beside it. The class exists;
  what this family adds is the attribute `controlledBy` (which institution's officer holds the
  threshold) and the observation that the control is on the INSIDE — the danger arrives, it does
  not leave.
- **`STAIR_HALL{VERTICAL}` to a platform at 52 m** — the mooring mast. This is the corpus's
  tallest single vertical run and it has no rooms at all: a stair or lift in a tapering
  eight-sided tower serving one platform. `verticalGrammar: SINGLE_DESTINATION`.
- **`THROUGH_ROOM`** — the station house: enter, one room, roof access. Trivially.
- **`EXTERIOR_WALK{ROOF}`** — the apparatus on the roof must be reachable and adjustable, so a
  roof walk or a hatch-and-platform is a functional requirement of a signalling station. New
  member of the exterior-walk class.
- **`CROSS_PASSAGE` at carriage scale, inverted** — the airship shed's doors. A shed that admits
  a 200 m airship has a door the width of the building, i.e. the whole end wall opens. That is
  the extreme case of R-INST-4's carriage-passage class and it deserves the same treatment: a
  `gateWidth` bucket whose top rung is "the entire gable".
- `CORRIDOR` — absent. `GALLERY` — absent except as the roof walk. `SCREENS_PASSAGE` — absent.
- Width buckets: airship shed clear width 55.3 m and clear height 37.2 m (CONFIRMED-digest, and
  flagged as magic-licensed); mast platform diameter 8.1 m (CONFIRMED-digest); teleport chamber
  DERIVED at 4–8 m across (the circle must be walked around, and a guarded chamber in a compound
  is not large) — PLAUSIBLE and flagged.

**(e) STORAGE typology (ODQ §453).**
- `STORE{RECORD}` — every controlled threshold in the corpus keeps a book. The fondaco assigned
  rooms and recorded them; the customs point recorded goods; a teleport circle with controlled
  access records arrivals. `ROOM_KINDS.records` exists. This is the family's most confident
  storage claim and it comes from the analogue, not from the fiction.
- `STORE{GEAR}` at the mast: mooring lines, ballast, ground-handling tackle. A yard-side store,
  `lightReq: NONE`, sizeBucket MEDIUM, adjacency to the open ground rather than to the tower.
- `STORE{INSTRUMENT}` at the station: the telescope and the clock are the plant, and they live
  in the working chamber rather than in a store (Chappe, CONFIRMED). Fixture, not cell.
- `STRONGROOM` — the teleport circle's compound at the ceiling grade, because whatever arrives
  by an expensive controlled route is worth locking up.
- **No fuel store, no water, no larder anywhere in this family** — and that absence is
  diagnostic. These are the corpus's first buildings with a process and no CONSUMPTION, which is
  precisely what makes them read as magical infrastructure rather than as craft.

**(f) Typed proposal.**
`parti: CONTROLLED_CHAMBER` — an outer holding space, a threshold with an officer's cell, an
inner chamber with a special floor, and a record cell. The teleport circle at both tiers.
`parti: MOORING_MAST` — a tapering tower with one vertical run and one platform; no habitable
cell; a ground yard and a gear store beside it. `heightBucket` and `platformHeight` are its only
real parameters.
`parti: GREAT_SHED` — a single clear volume with an opening gable. Marked
**MAGIC-LICENSED STRUCTURE** in its own record, with `clearSpan: EXTREME` and an explicit note
that no pre-industrial construction achieves it.
`parti: STATION_ROOM_WITH_MOUNT` — one chamber, a roof mount, a sight-line, an optional
keeper's dwelling. HOSTED at the floor.
`functions[]`: floor = `mount` (network) / `mooring_ring` (dock) / `marked_floor` (circle).
Rungs: + `working chamber` → + `threshold/guard cell` → + `records` → + `store{gear}` → +
`keeper's dwelling` → + `holding space` → + `yard` → + `compound wall` → + `shed`.
`fixtures[]`: `SIGNAL_MOUNT{arm 4.6 m, indicators 1.3 m}`, `TELESCOPE`, `CLOCK`, `ROOF_HATCH`,
`MOORING_RING`, `MAST_PLATFORM`, `WINCH`, `BALLAST_BIN`, `INLAID_FLOOR` (the circle's own
fixture — a floor that IS the apparatus, which the vocabulary has no way to say), `GATE{guard}`,
`REGISTER{book}`.
Structural buckets: `sightLine{terrestrial}` (new — family A had `sightLine{sky}`),
`clearSpan{EXTREME}`, `heightBucket{TOWER}`, `precisionFloor` (new — a floor whose flatness and
durability are the point), `openGable`, `groundYard`.
Licensing: `Teleportation circle` `tier ≥ town`, `Airship docking` and `Message network`
`tier = metropolis` by their own `minTier` (see (i)); `prosperity ≥ high`;
`era: N/A — these are magic-licensed types with no era grade in the European register`;
`siting: SIGHT_LINE_CHAIN (network) | OPEN_APPROACH (dock) | INSIDE_A_COMPOUND (circle)`;
**`magicLicense: HIGH`** for all three, which for once matches the engine exactly — all three
sit in `institutionProbability`'s hard-zero list below `priorityMagic` 66, i.e. the engine
already requires the `high` band. This family is the reason the `magicLicense` enum is worth
having: it is the only family whose parti genuinely CANNOT exist without the dial.
**VERDICT per tier.** town `Teleportation circle`: **HOSTED** — inside another institution's
compound (the keep, the guild hall, the temple precinct), because a town cannot afford a
dedicated guarded building for one room. city `Teleportation circle`: **BUILDING**
(`CONTROLLED_CHAMBER` in its own walled compound). city `Airship docking`: **BUILDING**
(`MOORING_MAST`), rising to `GREAT_SHED` only at the ceiling; the mast is a STRUCTURE with no
interior, so its "floor plan" is a section, which is a real product question flagged in (g).
city `Message network`: **NO_BUILDING as a network** and **HOSTED per station** at the floor;
`STATION_ROOM_WITH_MOUNT` as a BUILDING only at the top rung. The catalog's own "250-10,000 GP
per station" is a forty-fold range and it maps cleanly onto hired-room versus purpose-built.
**HOME tags.** `working chamber` → HOME: `ROOM_KINDS.chamber`. `records` → HOME:
`ROOM_KINDS.records`. `store{gear}` → HOME: `ROOM_KINDS.store`. `guard cell` → HOME:
`ROOM_KINDS.muster` (the security template's front room) or `ROOM_KINDS.cells`. `keeper's
dwelling` → HOME: `ROOM_KINDS.lodging`. **NO TYPED HOME**: `marked_floor` / the circle itself,
`mount`, `mast platform`, `yard`, `holding space`, `shed volume`. **NO TYPED HOME** for every
fixture in the list above without exception.

**(g) Consequences for the grammar.**
1. **A STRUCTURE with no interior needs a record.** A mooring mast, a signal mount and a
   standing stone are all institution-owned constructions with no cells. Together with family
   E's site, this makes a strong case for a third record shape beside `FloorPlan` and `Site`:
   `Structure { form, height, platforms[], noCells: true }`. The DW pane must be able to show a
   SECTION where there is no plan.
2. **`sightLine{terrestrial}` is a siting constraint that reaches ACROSS settlements.** A
   station's site depends on the next settlement's station. That is a regional-graph fact, and
   DW's inputs table (§3) currently reads only the local settlement. Flagged as a cross-system
   note for DW-0.
3. **A chain fails as a chain.** Decline for network infrastructure is not per-building
   shedding; it is route death. `institutionStatus: DARK_ROUTE` would let a settlement carry a
   station whose network is gone, which is a far better world-fact than deleting the building.
4. **`precisionFloor` — a floor that is the apparatus.** The corpus has floors that are
   surfaces; this is the first that is plant. It generalises usefully: a threshing floor, a
   malting floor, a dance floor and a mosaic all belong in the same bucket, and R-INST-2 will
   recognise the first two.
5. **`clearSpan: EXTREME` as an explicitly magic-licensed bucket** is the cleanest mechanism the
   tranche has found for letting a high-magic world look different WITHOUT inventing magical
   rooms: the rooms stay the same and the SPANS change. That is a much better lever than a
   magical room vocabulary and it is recommended as the tranche's general answer.
6. **The `(high magic)` rows' `minTier: 'metropolis'` while sitting in the CITY block** is an
   authoring artefact with a real consequence: the rows can never fire at their own tier. See
   §Σ engine-gap G2.

**(h) Continental versus English.** Not applicable in the usual sense: none of the three types
existed in any European register. The signalling analogue is FRENCH (Chappe, 1794 onward) with
British and Prussian imitators; the airship infrastructure is British, German and American and
twentieth-century; the controlled-threshold analogue is Venetian and universal. The one
genuinely continental mechanism worth carrying is the RELAY, which R-INST-4 family C researched
as the post: a chain of stations at a day's or a sight's distance, each holding the means to
pass the load on. §15 carries the non-European relay systems.

**(i) FANTASY NOTE — the genre CONVENTION and the ENGINE CONTRACT.**
**CONVENTION.** The genre teleport circle is expected to be a permanent inlaid figure on a floor
in a secured chamber, attended, recorded and expensive; the airship dock a tower with a platform
and a gangway; the message station a small room with a keeper and an apparatus. All three
conventions are, remarkably, MORE modest than the historical analogues in every respect except
the shed — and that is the finding. **The genre under-builds this family and the history
over-builds it**, so the grammar should trust the analogue: a controlled threshold is a
four-part plan, a mast is 61 m tall, and a signalling station is one room. The conventions
that must be marked as conventions are (1) the circle glowing (a fixture state, not a plan
fact), (2) the dock as a wharf in the sky with shops and crowds — a crowd needs egress, and an
8.1 m platform 52 m up cannot hold one, which is a constraint the grammar can enforce — and
(3) the instantaneous network with no keepers, when every real network node was a person in a
room with a clock.
**The setting-agnostic test:** this is the ONE family that FAILS it. Delete the magic and the
teleport circle, the airship and the sending stones all cease to exist. That is why all three
carry `magicLicense: HIGH`, and why the tranche's licensing enum has to be real rather than
decorative. What survives the deletion is the PLAN — the controlled threshold, the tower with a
platform, the room with a sight-line — which is exactly the outcome the three-direction method
was designed to produce.
**ENGINE CONTRACT (read this session, CONFIRMED).** All four rows (two circles, dock, network)
infer `institutionNature` = **`generic`**. `Teleportation circle` additionally matches
`magicLedger.ARCANE_INSTITUTION_PATTERN` on `circle`, so the magic census counts it. Probability:
`Teleportation circle` is magic-scaled by shelf AND by the `teleportation` name keyword;
`Airship docking` and `Message network` are NOT magic-scaled by the multiplier branch (neither
`airship` nor `message network` is in that keyword list and their shelf is `Exotic`, which
`cat.includes('magic')` does not match) — but all four are in the HARD-ZERO list below
`priorityMagic` 66 (`teleportation`, `planar`, `airship`, `message network`, `dream parlor`,
`high magic`), so all four are simply absent from any world below the `high` magic band. All
four also receive the ×1.8 boost at 66 or above and the ×0.3 penalty at 25 or below through the
`cat === 'exotic'` / `cat.includes('magic')` branch. And there is a fifth gate that only this
family triggers: an ISOLATED town-or-larger settlement at `priorityMagic` ≥ 70 gets
`chance = min(1, chance * 4)` on any row whose name contains `teleportation`, `planar` or
`airship` — an explicit escape hatch letting isolation be solved by magical transport, with the
code's own comment saying the viability violation check will then downgrade from critical to
warning. **That is a genuinely elegant piece of world-law design and this dossier endorses it**;
it is also the only place in the engine where a magical institution SOLVES a settlement problem
rather than decorating it, and DW should make the solved problem visible in the plan — an
isolated town whose only road is a teleport chamber should show a compound, a guard and a
record room, not a decorative floor.


---

## §8 · FAMILY G — the constructed and the undead workforce: Golem workforce (city L2157 "Constructed servants if magic permits.") · Undead labor (city L2164 "Animated corpses working. Controversial.")

**HOW THIS SECTION IS WRITTEN.** Both entries describe a labour force that is not a population,
and the historical analogues for housing coerced or non-consenting labour are the ergastulum,
the barrack and the slave quarter. Those are treated **clinically and structurally** — as
building programmes with measurable properties — exactly as R-INST-4 treated the regulated stew.
Nothing here endorses, aestheticises or moralises; the deity-doctrine principle that governs the
whole tranche applies with particular force, since "controversial" in the catalog's own prose is
a SOCIAL fact the engine's existing stressor and faction machinery already knows how to
metabolise, and this dossier confines itself to the rooms.

**(a) Analogue.** A workforce that does not eat, sleep, sicken, marry or leave collapses the
housing programme to almost nothing, and the interesting question is what is left. Three
historical programmes bound the answer.

**The ergastulum — coerced labour housed as a security problem.** An ergastulum was "a private
prison attached to large Roman farms or estates, designed to confine slaves — particularly
those considered dangerous, untrustworthy, or refractory — in chains while compelling them to
perform agricultural labor"; the type was "typically underground structures with narrow windows
positioned high to thwart escape", housing "groups of chained workers overnight and during
punishment, overseen by a trusted slave called an ergastularius". The archaeological instance is
the Villa of Rufio at Giano dell'Umbria, where excavations of 2003–2006 "revealed a basement
structure in the pars rustica interpreted as a confinement facility for slaves", Augustan in
date, on a site "covering approximately 9000 m²", with "earthen walls and a layout facilitating
limited access and oversight, consistent with descriptions of ergastula in Roman texts"
(CONFIRMED-digest, 2026-08-23; the Grokipedia and Wikipedia pages returned in that round were
not opened, and this is a contested archaeological identification — see (c)). **Three
transferable properties: BELOW GRADE, HIGH NARROW APERTURES, and a SINGLE SUPERVISED ACCESS.**
Note carefully what the type does NOT have: hearths, a kitchen, sanitation, partitions, or any
of the cells a dwelling has. It is a container with a door.

**The barrack — labour housed as an organisational problem.** R-INST-1's defence families
researched the barrack block and this dossier cites rather than restates it. The one property it
imports is the MODULE: a barrack is N identical cells served by a repeated stair-and-landing or
by a single corridor, and ODQ §452 already names the barracks as an early corridor licensee. A
constructed workforce that must be COUNTED, INSPECTED and TURNED OUT in order is a barrack
problem, and the barrack's answer is the repeated identical cell.

**The stable range — non-human bodies housed as a servicing problem.** R-INST-2 family M holds
the stable and this dossier cites it. Its imported properties are the ones a golem shares with a
horse and not with a person: a wide door, a hard washable floor, a drain, a standing bay of
fixed dimension per body, and a service passage in front of the bays. **The stable is the best
single analogue for the `Golem workforce`**, because it is the historical building type designed
around bodies that are large, heavy, valuable, unable to open doors and requiring nothing but
space, water and inspection.

**The tool house — labour housed as PROPERTY.** The limit case, and the one the entry's own
wording ("constructed servants") pushes toward: a thing that is switched off is stock. A tool
house or implement store is a single unheated volume with a wide door, a hard floor, wall racks
and no windows. If a constructed workforce is inert when idle, this — and not the barrack — is
its building, and the whole institution collapses to one large `STORE`.

**The charnel — the undead workforce's SOURCE, which is the half with real measurements.** The
`Undead labor` entry's supply problem is bodies, and medieval Europe's building type for storing
large numbers of human remains is the charnel chapel. Rothwell, Northamptonshire is one of only
two medieval English ossuaries surviving in situ: the crypt "measures 9m x 4m x 2.5m, with an
extremely uneven tamped clay floor"; "most of the bones are arranged into two substantial stacks
located centrally within the room, with long bones stacked in clear layers"; "a large number of
crania have been arranged separately on shelving running along the two long walls of the
chapel"; and the remains of "around 2,500 people lie in the underground chapel". The comparator
at St Leonard's, Hythe, Kent is "larger and partially underground with illuminated windows", and
the type was built "from the early 13th century to the Reformation in the mid-16th century" with
its peak in the 1300s (CONFIRMED-digest, 2026-08-23, of Current Archaeology's Rothwell feature
and the University of Sheffield Rothwell Charnel Chapel Project pages; neither was opened).
**Ninety square metres and two and a half metres high holds two and a half thousand people's
bones, stacked centrally with the skulls on wall shelving.** That is a real, checkable density
figure and it is the only quantitative handle this family has: roughly 28 individuals per square
metre of floor when stacked to 2.5 m.

**Structural imperatives.** HARD FLOOR (wash-down, weight, no boarding); DRAINAGE for anything
organic; WIDE DOOR sized to the body; NO HEARTH (the type's most diagnostic absence — a
workforce that does not feel cold does not get a fire, and a building with no chimney reads
instantly as not-a-dwelling from outside); MINIMAL FENESTRATION, high where present; SINGLE
SUPERVISED ACCESS; and, for the undead half, the SMELL and PUBLIC-HEALTH problem, which is what
puts a charnel below ground and downwind and which is a siting law rather than a room.

**Siting and anchor law.** Coerced-labour housing sits INSIDE the establishment it serves — the
ergastulum in the *pars rustica* of the villa, the barrack in the compound, the stable in the
yard. The charnel sits in or beside the churchyard, below ground. A `Golem workforce` or
`Undead labor` institution is therefore almost certainly NOT a free-standing building on its own
parcel: it is a range of somebody else's compound, which is the same HOSTED-WITHIN-A-COMPOUND
answer family F reached for the town teleport circle.

**Prosperity and wear grades.** Floor = no cell at all — the workforce stands in the yard.
Rung 1 = a lean-to or a shed range against a compound wall. Rung 2 = a purpose-built range with
a hard floor, a drain and a wide door. Rung 3 = the range plus a supervisor's cell and a
lockable store for the workforce's gear or its means of control. Ceiling = a below-grade
secured range with high apertures and a single access. Decline sheds the supervision first (the
cheapest thing to stop paying for), then the maintenance, and leaves a shed or a blocked cellar
— and for the undead half the decline residue is a charnel that is still full, which is a
world-fact with obvious narrative weight and no new geometry.

**(b) Measured.**
- Rothwell charnel crypt: 9 m × 4 m × 2.5 m; c. 2,500 individuals; two central stacks; crania on
  shelving along both long walls; uneven tamped clay floor; one of two in-situ medieval English
  ossuaries; Hythe larger, partially below ground, with windows; type built early 13th century
  to mid-16th, peak 1300s (CONFIRMED-digest).
- Villa of Rufio: site c. 9,000 m²; a *pars rustica* basement identified as a confinement
  facility; excavated 2003–2006; Augustan (CONFIRMED-digest).
- **NOT FOUND, searched.** No cell dimension for any ergastulum; no barrack-cell dimension in
  this lane's own searches (R-INST-1 may hold one); no measurement of any kind for a stable bay
  in this lane's searches (R-INST-2 holds them). Query issued: "Roman villa slave quarters
  ergastulum barrack block cell size excavated dimensions workforce housing" — one round,
  returning the type description and one site, and no cell measurement. **This family is marked
  PARTIAL for measurement**, and what is owed is precise: one ergastulum or slave-quarter cell
  size, and the stable-bay and barrack-cell buckets imported from the sibling dossiers rather
  than re-searched. Ledger item L.7.

**(c) Contested and counterexamples — the negation search.**
(i) **The ergastulum identification is itself contested and the dossier says so.** The Roman
literary sources describe the type; the archaeological identification of a basement as a
confinement facility rests on interpretation of layout and access, and the digest's own wording
("interpreted as", "consistent with descriptions … in Roman texts") preserves that. A single
interpreted basement is not a building type, and this dossier treats the ergastulum as
DOCUMENTARY with one candidate excavation, not as an excavated type.
(ii) **The strongest counterexample is that most coerced labour was NOT specially housed.**
Roman estate slaves and medieval famuli mostly lived in the ordinary service ranges, the loft
over the byre, or the household itself; the ergastulum is the punitive and high-security
exception. Generalising it would give every settlement with a constructed workforce a prison,
which is both historically wrong and — given the catalog's "Controversial" — dramatically
lazier than the truth. **The default should be the SHED RANGE and the ergastulum should be the
high-suspicion variant**, keyed to the settlement's own attitude, which the engine's faction and
stressor machinery can already supply.
(iii) **A workforce with no needs has no building, and that is the honest floor verdict.** Every
cell in a dwelling exists to meet a need: hearth for cold, kitchen for food, privy for waste,
chamber for sleep, store for possessions. Remove all five needs and what remains is a place to
STAND when not in use. A grammar that gives a golem workforce a barrack with beds has failed to
notice that it is drawing a dwelling for something that does not dwell.
(iv) **The charnel is evidence about STORAGE OF THE DEAD, not about labour.** It is used here
only as the density and fabric analogue for a building that holds many human remains, and the
inference from "a charnel holds 2,500 bodies in 36 m²" to "an undead labour force needs a
building of size X" is this lane's, not a source's — PLAUSIBLE, and flagged.
(v) **The one thing the sources agree on that the genre gets wrong.** Every historical building
for a controlled non-consenting population is defined by its ACCESS CONTROL and its ABSENCES,
not by its fittings. The genre imagines a golem hall as a chamber of standing figures in niches;
the historical shape is a plain range with a wide door, a hard floor, a drain, no chimney and
one way in. The plain version is better, and it is sourced.

**(d) CIRCULATION typology (ODQ §452).**
- **`THROUGH_ROOM` with a SERVICE PASSAGE** — the stable's arrangement: a line of standing bays
  with a passage in front, so every body is reached without passing another. This is the family's
  correct default and it is imported from R-INST-2.
- **`CORRIDOR`** — licensed here, early, by the barrack's own programme (ODQ §452 names barracks
  as an early licensee and this family is the arcane instance of it). A range of N identical
  cells that must each be reached independently is the one situation where the corridor beats
  the enfilade, and this is the only family in the tranche that licenses one at any era grade.
- **`LOBBY` as a control point** — the single supervised access. `controlledBy` again, as in
  family F.
- **`STAIR_HALL{VERTICAL}` down** — the ergastulum's and the charnel's below-grade access. A DW
  law 7 joint: the below-grade range exists if and only if the undercity graph anchors it.
- `GALLERY`, `SCREENS_PASSAGE`, `STAIR_HALL{grand}` — absent, and the absences are diagnostic.
- **`gateWidth` sized to the BODY, not the person.** A door for a constructed body of unstated
  size is the corpus's first aperture whose bucket comes from the occupant rather than from a
  cart or a person. Proposed: `apertureFor: PERSON | CART | HORSE | OVERSIZE_BODY`.
- Width buckets: charnel cell 4 m across and 2.5 m high (CONFIRMED-digest); service passage and
  bay widths imported from R-INST-2 rather than invented; corridor width DERIVED.

**(e) STORAGE typology (ODQ §453) — this family IS storage, which is the finding.**
- **`STORE{BODIES}`** — the honest name for what both entries need at the inert grade. The
  charnel gives the fabric and the density: a below-grade vaulted or clay-floored cell, central
  stacks, wall shelving, no light requirement, 2.5 m high. `lightReq: NONE`; `sizeBucket` scaled
  by count; `outsideDwelling: true`; and an adjacency law that puts it away from food, water and
  the living cells for reasons the corpus already understands from R-INST-4's larder and sewer
  rules.
- `STORE{GEAR}` — whatever the workforce carries or is controlled by. Locked. Small.
- `STORE{TOOL}` — the tool-house limit case: if the workforce is inert when idle, the workforce
  IS the store's contents and the institution has exactly one cell.
- `CELLAR / UNDERCROFT` — the ergastulum's and the charnel's home.
- **No pantry, buttery, larder, still room, dairy or scullery**, because nothing here eats. The
  §453 class list is designed for households and this family uses three of its eleven classes,
  which is a useful demonstration that the list is a MENU rather than a checklist.
- PROHIBITION: no internal door between a `STORE{BODIES}` and any food, water or living cell —
  the same shape of rule as family B's fuel-store prohibition, arrived at independently.

**(f) Typed proposal.**
`parti: SHED_RANGE` — a single-aspect range against a compound wall: hard floor, wide door,
service passage, no hearth, no windows or high ones only. The default at every prosperity.
`parti: BAY_RANGE` — the stable arrangement: N standing bays off a service passage, one body per
bay, a drain along the passage. The `Golem workforce`'s home at rung 2.
`parti: SECURED_UNDERCROFT` — below grade, high narrow apertures, one supervised access, an
overseer's cell at the head of the stair. The ergastulum, and the high-suspicion variant.
`parti: CHARNEL_CELL` — 9 × 4 × 2.5 m below grade with central stacks and wall shelving. The
`Undead labor` entry's SOURCE cell, and a building the settlement may well already have from
R-INST-3's churchyard.
`HOSTED{host: any compound}` — the floor verdict at both tiers.
`functions[]`: floor = `standing_ground`. Rungs: + `shed range` → + `hard floor + drain` → +
`service passage` → + `bay division` → + `overseer's cell` → + `store{gear, locked}` → +
`secured access` → + `below-grade range`.
`fixtures[]`: `HARD_FLOOR`, `DRAIN{channel}`, `WIDE_DOOR`, `HIGH_APERTURE`, `RING{tether}`,
`RACK{tool}`, `SHELF{cranial}` (the charnel's own fixture, CONFIRMED), `STACK{bone}`,
`LOCK{single access}`, `TALLY_BOARD` (a workforce that is counted needs the count written down —
the same `REGISTER` idea family F reached).
Structural buckets: `hardFloor`, `drainage`, `noHearth` (**a negative structural bucket, which
the corpus has not needed before and which is strongly diagnostic from outside the building**),
`singleAccess`, `belowGrade`, `apertureFor{OVERSIZE_BODY}`.
Licensing: both `tier ≥ city` per the catalog; `prosperity ≥ high`;
`era: N/A`; `siting: INSIDE_A_COMPOUND | SERVICE_RANGE | BELOW_GRADE`;
`magicLicense: HIGH` (both are in the engine's own hard-zero list below `priorityMagic` 66);
and a further licensing field this family needs and no other does: `socialTolerance`, because
the catalog itself says "Controversial" and because whether the range is a shed or a secured
undercroft is a function of how the settlement feels about it. The engine already carries the
inputs — faction alignment, stressors, the moral-lean machinery in
`src/domain/worldPulse/moralMartialLean.js` — and this dossier proposes reading them rather than
minting a new dial.
**VERDICT per tier.** city `Golem workforce`: **HOSTED** at the floor (the yard and the shed of
whichever institution employs it), **BUILDING** (`BAY_RANGE`) at high prosperity. city `Undead
labor`: **HOSTED** at the floor; **BUILDING** (`SHED_RANGE` or `SECURED_UNDERCROFT`) where
tolerance is low and control is wanted; and in BOTH cases the institution should be able to
point at an existing `CHARNEL_CELL` or churchyard as its source rather than generating a new
one — the same occupation-not-construction rule family E argued for the stone ring.
**HOME tags.** `shed range` / `bay range` → HOME: `ROOM_KINDS.workfloor` at a stretch, or
`ROOM_KINDS.store`. `store{gear}` → HOME: `ROOM_KINDS.store`. `overseer's cell` → HOME:
`ROOM_KINDS.quarters`. `below-grade range` → HOME: `ROOM_KINDS.cellar`. `secured cells` → HOME:
`ROOM_KINDS.cells`. **NO TYPED HOME**: `standing_ground`, `service passage`, `charnel`,
`store{bodies}`. Of the fixtures, `FURNISHING_KINDS` has `rack`, `shelf`, `cell` and `bunk`, and
lacks the hard floor, the drain, the wide door, the high aperture, the tether ring, the bone
stack and the tally board.

**(g) Consequences for the grammar.**
1. **A NEGATIVE structural bucket: `noHearth`.** The corpus has treated fixtures as things a
   building HAS. This family is defined by what it lacks, and the lack is visible from the
   street (no chimney), which makes it an exterior consequence in DW law 9's sense. Proposed as a
   first-class parti attribute, because "the building with no chimney" is exactly the kind of
   fact that makes a generated town read as true.
2. **`apertureFor` sized by the occupant.** A door bucket derived from the body that must pass
   it. Recurs at family K (the cage and the beast door) and, at the extreme, at family F (the
   airship shed's opening gable).
3. **A workforce is a population the demography engine does not count.** DW's §3 input table
   reads demography for "who sleeps where". A constructed or animated workforce sleeps nowhere
   and eats nothing, so it must NOT enter the household-size calculation — and it must still
   affect the WORKFLOOR count. Flagged as a cross-system note: the plan needs a labour figure
   that is not a population figure.
4. **A `STORE{BODIES}` class with a measured density.** 2,500 individuals in 9 × 4 × 2.5 m
   (CONFIRMED-digest) is the only capacity figure the tranche produced, and capacity-per-volume
   is exactly the kind of bucket the DW instruments (P1c) are meant to measure.
5. **The corridor's arcane licensee.** This is the tranche's only corridor, and it is licensed
   by the barrack's programme rather than by era. Worth recording because it means the tranche
   as a whole is an ENFILADE tranche, which is a useful global statement for the grammar's
   weighting.

**(h) Continental versus English.** The ergastulum is Roman and Italian; the charnel is English,
French and German (the Sedlec and Kutná Hora ossuaries are the continental extreme, not
researched this session); the barrack is early-modern and continental before it is English
(R-INST-1 holds the evidence). England's distinctive contribution is the CHARNEL CHAPEL as a
parish building with a chapel over the crypt — Rothwell's chapel is beneath Holy Trinity — which
gives the type a liturgical upper storey and a secular lower one. R-INST-3 owns anything above
the vault; this dossier owns only the vault. §15 carries the non-European practices.

**(i) FANTASY NOTE — the genre CONVENTION and the ENGINE CONTRACT.**
**CONVENTION.** The genre expects a golem workforce to be housed in a hall of standing figures,
often in niches, often ceremonially lit; and an undead workforce to be housed in or beside a
graveyard, hidden, resented, and controlled from a single point. The second convention is very
close to the sourced answer; the first is not. **The sourced answer for both is plainer and
better: a service range with a hard floor, a drain, a wide door, no chimney and one guarded
way in.** The niche is worth keeping for one reason only, and it is a sourced one — family B's
sixteen furnace niches show that a wall subdivided into countable recesses is a real medieval
arrangement, so a `RECESS`-per-body range is the same idea applied to a different content, and
it lets the plan express "how many" as a countable, losable, dateable fact.
**The setting-agnostic test:** this family half-fails, deliberately. Delete the magic and the
workforce vanishes — but the BUILDING remains, in every particular, as a stable range, a shed,
a tool house or a secured undercroft, all of which a mundane settlement has anyway. So the
grammar needs no new parti for this family at all: it needs a LICENCE to point an existing
service-range parti at an unusual occupant. That is the cheapest structural answer in the whole
tranche and it is recommended.
**ENGINE CONTRACT (read this session, CONFIRMED).** `Golem workforce` and `Undead labor` both
infer `institutionNature` = **`generic`** and no function facet, so both draw the two-cell
generic template — main room and back room, with table, bench, shelf, crate. Probability: neither
is magic-scaled by the multiplier branch (the shelf is `Exotic`, which `cat.includes('magic')`
does not match, and neither `golem` nor `undead` is in that keyword list), but both are in the
**hard-zero list below `priorityMagic` 66** (`golem`, `undead labor`) and both take the ×1.8 /
×0.3 exotic-shelf adjustment, so both exist only in a `high`-magic world. Both carry `tags:
['arcane']`, so both are struck at `magicExists === false` by the L302 gate. Two further
observations for §Σ. First, `Undead labor`'s catalog `baseChance` is 0.10, the joint-lowest of
the tranche with `Airship docking` and `Dragon resident` — the catalog already treats it as the
rarest thing in a magical city, which is a taste judgement this dossier endorses. Second, the
word "Controversial" in the description is the only place in the whole 32-entry roster where the
catalog states a SOCIAL consequence, and the engine has no field to carry it: it is prose, and
the finite-semantics law says a typed bucket should carry it instead. Proposed as
`socialTolerance: WELCOMED | TOLERATED | CONTESTED | ABHORRED`, read by the existing faction and
stressor machinery rather than by any new system.


---

## §9 · FAMILY H — the parlour and the booth (hosted consumption): Charlatan fortune tellers (town L1401 "Non-magical 'divination' using Deception. 1-5 GP.") · Dream parlors (high magic) (city L2171 "5th level Dream spell experiences. Lucid shared dreams, communication.")

**BOUNDARY, STATED FIRST.** R-INST-4 family D holds the FAIR and the hosted performer, family G
the gaming house, family E the bathhouse, and family B the inn's common room; every one of those
is a potential HOST for these two entries and this dossier does not re-research any of them. The
question this section answers is narrower and it is the right one: **what is the smallest
enclosure that lets a practitioner charge for a private experience, and what does it cost?**

**(a) Analogue.** Both entries sell an EXPERIENCE to one customer or a small group, briefly, for
money, and the whole architectural problem is enclosure: an audience that can see the show for
free will not pay for it. The historical solution is the BOOTH.

**The booth is canvas, and the canvas is the business model.** At Bartholomew Fair — "a vast
market and carnival, a temporary town of booths and boards extending into the streets beyond
Smithfield", with "players, jugglers, conjurers, ballad singers, acrobats, puppet shows and
travelling entertainers, as well as mountebanks among the crowd" — the booths "were initially
light wooden buildings but gradually acquired a degree of semi-permanence and might house some
hundreds of spectators seated in a parterre and boxes or galleries", and, decisively, "unlike
the open-air trestle stage, booths made it possible to have a paying audience" (CONFIRMED-digest,
2026-08-23, of the World Encyclopedia of Puppetry Arts entries "Booth" and "Fairs and Fairground
Performers"; neither was opened). The only price this lane found for the fabric is from a court
account of 1614–15: "Canvas for the booths and other necessaries for a play called Bartholomew
Fair, forty-one shillings sixpence" (CONFIRMED-digest, the Cambridge *Works of Ben Jonson* stage
history). **A booth is therefore: a light timber frame, a canvas skin, a controlled entrance, and
— at the developed grade — a parterre with boxes or galleries inside it.** The `Charlatan
fortune tellers` entry sits at the bottom of that ladder and needs only the frame, the skin and
the entrance; there is no rung at which it becomes a permanent building.

**The parlour is a room of a house, with a bar at one end.** For `Dream parlors` the nearest
real programme is the seventeenth-century coffee house, whose interior "layout was communal with
central long tables and seating either side", with "at one end of the room ... the kiosk where
the proprietor sat taking payments"; the earliest depiction, a 1674 woodcut, shows five men round
a large table with coffee cups and a servant bringing another (CONFIRMED-digest, 2026-08-23, of
the Lafayette College *Global Stimulants* exhibit and the Wikimedia record of the woodcut;
neither was opened). One room, one long table, benches, a payment kiosk. The catalog's "lucid
SHARED dreams" makes the communal table the right analogue rather than a cubicle: the shared
experience wants a shared room, and the payment point at the end of it is exactly where the
coffee house put it. The bathhouse's changing hall and the gaming room are the two nearest
siblings and both are R-INST-4's.

**Structural imperatives.** Almost none, which is the point. A booth needs a frame that two
people can raise and strike in a day and a skin that keeps out sight rather than weather. A
parlour needs a room, a fire, seats, a payment point and a door that shuts. What both need and
neither obviously has is **PRIVACY AT THE THRESHOLD** — the customer must be seen to enter and
not seen inside — which is a door-and-curtain problem, not a construction problem.

**Siting and anchor law.** Both are FOOTFALL institutions. The booth follows the fair, which is
R-INST-4's calendar object, and its site is the market place, the churchyard edge or the street
outside the gate; it is present for days and absent for the rest of the year, which is a
temporal siting rule the corpus has not needed before. The parlour wants a frontage in a busy
street, like family D and unlike family B.

**Prosperity and wear grades.** Booth: floor = a mat and a stool with no enclosure at all
(no payment possible, so this rung barely exists as a business); rung 1 = a curtain hung between
two posts; rung 2 = the canvas booth with a controlled entrance; rung 3 = the semi-permanent
timber booth with a parterre and boxes — which is R-INST-4's playhouse ancestor and hands off
there. Parlour: floor = a hired back room in an inn or an alehouse (HOSTED); rung 1 = a room of
a shop-house with its own street door; rung 2 = the room plus a service cell and a store; rung
3 = several rooms, graded from public to private, which is Libavius's east-to-west gradient
(family B) arriving in a completely different building. Decline for the booth is instant and
total — a canvas structure that stops paying is struck and gone, leaving nothing on the parcel,
which is the most complete `NO_BUILDING` case in the tranche. Decline for the parlour is
R-INST-2's shop-house decline.

**(b) Measured.** **This family reached ONE quantitative datum and it is a price, not a
dimension: 41 shillings 6 pence for the canvas of the Bartholomew Fair booths, 1614–15**
(CONFIRMED-digest). Also CONFIRMED-digest: a developed fair booth "might house some hundreds of
spectators". **No dimension of any kind was obtained for a booth, a fortune-teller's stall or a
consumption parlour.** Searches issued: "mountebank stage fairground booth Bartholomew Fair
construction dimensions temporary theatre booth" (returned the construction sequence and the
canvas account, explicitly no dimensions); "17th century London coffee house interior room long
table boxes description Rugge premises" (returned the layout and the kiosk, no dimensions). Two
rounds, nothing measured. **FAMILY H IS MARKED PARTIAL.** What is owed, precisely: one measured
fair-booth footprint (the Southwark and Smithfield fair records and the Restoration booth-theatre
literature are the named targets), and one measured coffee-house room. R-INST-4's family G may
already carry the gaming room's dimensions and family H its playhouse dimensions, either of which
would bound this family from above. Ledger item L.8.

**(c) Contested and counterexamples — the negation search.**
(i) **The negation is answered by the catalog itself and confirmed by the analogue: the
fortune-teller has no building.** The entry's own description — "Non-magical 'divination' using
Deception. 1-5 GP." — is a service at a price of one to five gold, which is the cheapest thing in
the entire 32-entry roster. Nothing at that price supports a building, and the fair evidence
agrees: the mountebanks were "among the crowd", not in premises. `NO_BUILDING` is not a
concession here, it is the finding.
(ii) **The counterexample that matters is the SEMI-PERMANENT booth.** The sources are explicit
that booths "gradually acquired a degree of semi-permanence" and grew galleries and boxes. So the
type does have an upper rung, and the upper rung is a playhouse — which is R-INST-4's family H
and is where this ladder must hand off rather than inventing a "great fortune-telling hall".
(iii) **"Non-magical" is doing something unusual in this catalog and it is worth flagging.**
`Charlatan fortune tellers` is the ONLY row in the 32 whose description asserts that the practice
does NOT work. That makes it the tranche's one entry that is magical by ASSOCIATION rather than
by function, and it is the reason the row survives a `magicExists: false` world in the engine
(see (i)) — correctly, and by accident.
(iv) **The dream parlour's nearest real sibling is a drug house, and this dossier declines to
research it.** The opium den and the tavern back room are the obvious analogues for a paid
altered-experience room; R-INST-4 flagged the opium-den comparison when it handed this row over
and R-INST-6 owns anything criminal. This dossier uses the coffee house instead — a legal,
documented, communal consumption room with a payment point — because it supplies the same plan
without importing a moral frame the catalog does not ask for. Recorded as a deliberate scope
choice, not an omission.

**(d) CIRCULATION typology (ODQ §452).**
- **`THRESHOLD{PAYING}` — the family's whole contribution to the class set.** A controlled
  entrance whose function is to collect money and to break the sight-line. It is not a `LOBBY`
  (there is no room), not a `GATE_PASSAGE` (nothing passes but people), and not a door. Proposed
  as an attribute rather than a class: `entrance: { controlled: true, sightBreak: true, toll:
  true }` on whatever cell carries it. The booth's flap and the parlour's curtain are the same
  device at two scales.
- `THROUGH_ROOM` — the parlour: street door, one room, service cell behind. Nothing else.
- `GALLERY` — only at the semi-permanent booth's top rung, where it hands off to R-INST-4's
  playhouse galleries.
- `CORRIDOR`, `STAIR_HALL`, `SCREENS_PASSAGE`, `CROSS_PASSAGE` — absent at every grade.
- Width buckets: none measured (see (b)). PARTIAL.

**(e) STORAGE typology (ODQ §453).**
- **`STORE{STRUCK}` — the corpus's first PORTABLE store, and a genuinely new idea.** A booth is
  put up and taken down; its canvas, poles, ropes, boards and properties are stored somewhere for
  fifty-one weeks of the year, and that somewhere is not on the site. The `STORE` class needs an
  `offSite: true` variant, and the fair's own storage — a town's fair furniture kept in a civic
  building between fairs — is R-INST-1's and R-INST-4's problem to place. This is the same shape
  of finding as family B's off-site waste vault: **a store that is not in the building.**
- `CLOSET{TAKINGS}` — the payment point's locked box. Fixture, not cell.
- `STORE{SERVICE}` at the parlour: cups, fuel, whatever is consumed. R-INST-4's vice-template
  cellar and kitchen cover it and this dossier adds nothing.
- No pantry, larder, buttery or dairy; no fuel store beyond a domestic hearth's.

**(f) Typed proposal.**
`parti: BOOTH_TEMPORARY` — a light frame with a fabric skin, one controlled entrance, no
foundation, no hearth, present only during a fair. `permanence: TEMPORARY`; `footprint` from
R-INST-4's fair-stall bucket by pointer.
`parti: BOOTH_SEMIPERMANENT` — the same in timber, with a parterre and galleries. Hands off to
R-INST-4 family H's playhouse.
`parti: PARLOUR_ROOM` — one room off the street with a payment kiosk at the far end, a long
table or couches, a hearth, and a service cell behind. The `Dream parlors` entry's home.
`HOSTED{host: INN | ALEHOUSE | BATHHOUSE | GAMING_HOUSE | FAIR}` — the floor for both entries.
`functions[]`: floor = `pitch` (a place to stand). Rungs: + `enclosure` → + `paying threshold` →
+ `seating` → + `service cell` → + `store{struck, off-site}` → + `private cell` → + `gallery`.
`fixtures[]`: `CANVAS_SKIN`, `POLE_FRAME`, `FLAP{entrance}`, `CURTAIN`, `LONG_TABLE`, `BENCH`,
`COUCH`, `KIOSK{payment}`, `TAKINGS_BOX`, `HEARTH`, `SIGN{painted}`.
Structural buckets: `temporary` (**a new one: a structure with no foundation and a stated
lifespan in days**), `sightBreak`, `lightDemand{LOW}` — this is the only family in the tranche
that wants LESS light, which is a real and useful inversion.
Licensing: `Charlatan fortune tellers` `tier ≥ town`, `Dream parlors` `tier = metropolis` by its
own `minTier`; `prosperity: ANY` for the booth, `≥ middling` for the parlour;
`era: any`; `siting: FAIR_GROUND | MARKET_EDGE | BUSY_FRONTAGE`; `magicLicense: NONE` for the
charlatan — **the only `NONE` in the tranche and the catalog says so itself** — and `HIGH` for
the dream parlour (the engine's own hard-zero list contains `dream parlor`).
**VERDICT per tier.** town `Charlatan fortune tellers`: **NO_BUILDING** — a booth on the ground
during a fair, or HOSTED in an inn's corner otherwise. There is no rung at which this entry owns
a building, and a generator that gives it one has mis-read a 1–5 GP service. city `Dream
parlors`: **HOSTED** at the floor (a room of an inn, a bathhouse or a gaming house);
**BUILDING** (`PARLOUR_ROOM` in a shop-house) at middling prosperity and above.
**HOME tags.** `parlour room` → HOME: `ROOM_KINDS.common` (the vice template's front room:
table, bar, hearth, bench — a very good fit, and the engine's `vice` template as a whole is the
right template for the dream parlour). `service cell` → HOME: `ROOM_KINDS.kitchen` or
`ROOM_KINDS.cellar`. `private cell` → HOME: `ROOM_KINDS.chamber`. **NO TYPED HOME**: `pitch`,
`enclosure`, `paying threshold`, `gallery`, `store{struck}`.

**(g) Consequences for the grammar.**
1. **`permanence: PERMANENT | SEMIPERMANENT | TEMPORARY` on a parti.** A structure that is
   erected and struck is a real institution with a real footprint for part of the year, and DW
   law 4's derive-don't-store discipline handles it beautifully — the plan simply is not derived
   outside the fair's dates. This also gives the corpus its cleanest expression of R-INST-4's
   fair.
2. **An `offSite` store.** Two families now need one (B's hazard waste, H's struck booth), which
   makes it a class attribute rather than a special case.
3. **A paying, sight-breaking threshold.** The economic reason enclosures exist. Worth typing,
   because it explains WHY a booth has walls and therefore lets the grammar decide when it does
   not.
4. **`lightDemand{LOW}` is as real a constraint as `lightDemand{HIGH}`.** Family D wants the
   window; this family wants the curtain. The light model must be able to say "less".
5. **A verdict of NO_BUILDING at every rung is a legitimate outcome and the validator must
   accept it** — the third family in this tranche to say so (E, F's network, H), and together
   they make the case that the DW lawfulness walker needs a first-class "this institution has no
   plan, and here is why" certificate.

**(h) Continental versus English.** The fair booth is pan-European and its best-documented
theatrical form is French and Italian rather than English — the *théâtre de la foire* and the
commedia troupe's booth stage are the continental instances, and the puppet booth is the type's
smallest permanent survivor (PLAUSIBLE, not researched this session). The consumption parlour is
Ottoman and then Italian before it is English: the coffee house arrives in Europe from Istanbul
by way of Venice, which makes the type's ancestor the same building §15 treats under the
hammam's külliye. R-INST-4's families E and G hold whatever the program has on both.

**(i) FANTASY NOTE — the genre CONVENTION and the ENGINE CONTRACT.**
**CONVENTION.** The genre fortune-teller is expected to occupy a curtained booth or a small dim
room with a table, a cloth, a light and no windows; the genre dream or vision parlour a dim room
of couches with an attendant. Both conventions are ALREADY the sourced answer — the booth is
canvas with a flap, the parlour is a room with a long table and a payment kiosk — and the only
correction the evidence makes is to the LIGHT: the genre imagines candlelit gloom, and the
historical booth's darkness is a by-product of canvas walls, not a design intention. Keep the
gloom, source it to the skin. The convention with no analogue is the parlour of individual
private cells; the catalog's own "SHARED dreams" points at the communal room instead, and the
communal room is what the coffee house supplies.
**The setting-agnostic test:** the charlatan passes trivially (the catalog says the practice is
fake, so there is nothing to delete). The dream parlour half-fails — delete the magic and the
service goes — but the ROOM survives intact as a coffee house or a tavern parlour, so again no
new parti is needed, only a licence to point an existing one at an unusual service.
**ENGINE CONTRACT (read this session, CONFIRMED).** `Charlatan fortune tellers` infers
`institutionNature` = **`security`**, because `FACET_INFERENCE`'s security row
`/barrack|garrison|watch|guard|militia|fort|citadel/i` matches `/fort/` inside "**fort**une". The
row therefore draws the BARRACKS template — muster with table, rack and bench, plus armory,
cells and quarters as the tier rises. A fairground booth is currently generated as a guardhouse
with a weapons rack. This is the second of the three unanchored-substring mis-inferences this
tranche found (the others are "War**den**'s Lodge" and "resi**den**t"), and it is engine-gap G1.
`Dream parlors (high magic)` infers **`generic`**, when the `vice` template — common room with
bar, table, hearth and bench, plus kitchen, cellar and lodging — is very close to the sourced
plan; one keyword would fix it. Probability: `Charlatan fortune tellers` is on the `Adventuring`
shelf with no arcane tag and no arcane keyword, so it is **NOT magic-scaled, NOT hard-zeroed, and
NOT struck at `magicExists === false`** — it is one of only four rows in the tranche that
survives a dead-magic world, and given that the catalog calls it "non-magical", that is exactly
right. `Dream parlors` is hard-zeroed below `priorityMagic` 66 and struck at `magicExists ===
false`, and carries `minTier: 'metropolis'` while sitting in the city block (engine-gap G2).


---

## §10 · FAMILY I — the lodge and the charter hall: Warden's Lodge (town L1364 "A ranger station or druid waypost. They monitor the surrounding wilderness, maintain trails, and keep tabs on beast migrations…") · Adventurers' charter hall (hamlet L310 · village L819 · town L1394) · Multiple adventurers' guilds (city L2110 "Competing organizations.")

**BOUNDARY, STATED FIRST.** R-INST-1 family L researched the `Adventurers' charter hall` at all
three of its tiers as a SOLDIERS' HALL, alongside the veteran's lodge, the free company hall and
the hired blades, and its own fantasy note already establishes the key result: the genre
adventurers' guild hall — "a public hall with a job/bounty board, a clerk's counter that grades
contracts, a tavern, lodging, a trophy display, a training yard, and sometimes a vault" —
composes ENTIRELY from sourced fixtures, each of which R-INST-1 traced (board ← the proclamation
and toll board; counter ← the Long Room and the *condotta* office; tavern and lodging ← the
Netherlandish *doelen*; trophies ← the Speech House antlers; yard ← the shooting range; vault ←
the muniment cell). **This dossier accepts that finding entire and does not re-research it.**
R-INST-1 also cross-referred the `Warden's Lodge` here with its ranger-station analogue held
there and its druidic-waypost half left to this tranche. What this section adds is therefore
three things and only three: the FOREST LODGE as a measured building type, which no sibling
holds; the `Multiple adventurers' guilds` row, which R-INST-4 handed here and R-INST-1 did not
take; and the engine contract for all five rows.

**(a) Analogue.** The `Warden's Lodge` is, word for word, the medieval park and forest LODGE:
"a ranger station or druid waypost" that monitors wilderness, maintains trails and tracks
beasts. That is the parker's job description almost exactly, and the parker's building is well
attested.

**The lodge is sited to SEE, and moated to be safe.** "Lodges were usually sited on an eminence
from which the parker and huntsmen could survey as much of the park as possible, and they were
often surrounded by a moat for added security against poaching gangs" (CONFIRMED-digest,
2026-08-23, from the West Sussex Archaeology and Historic England scheduling material returned
in the round; none of the pages was opened). Two siting laws in one sentence, and both are
unusual in this corpus: **a PROSPECT requirement** (the building's site is chosen for what can
be seen FROM it, which the corpus has previously met only as family A's sight-line to the sky
and family F's sight-line to the next station) and **a THREAT-DRIVEN enclosure whose threat is
not war but organised poaching** — the moat is against a gang, not an army, which is a
distinct defensive grade the corpus should be able to express between "undefended" and
"fortified".

**The lodge's plan is a hall house, small.** The excavated moated site at Bradgate Park,
Leicestershire, inside the boundary of a medieval deer park, held "a timber-framed building
offset to the west within the center of a levelled platform", of "a three-bay hall of base cruck
construction, with a service bay and a chamber"; the material culture supports construction in
the mid-thirteenth century and abandonment "by the end of the fourteenth century or early in the
fifteenth"; and the interpretation is "a periodically occupied hunting lodge, although it may
have served a secondary function as a park-keeper's residence" (CONFIRMED-digest, 2026-08-23, of
the ResearchGate record for "A medieval hunting lodge at Bradgate Park, Leicestershire"; the PDF
was NOT opened). **Three bays, a service bay, a chamber, timber, base cruck — this is DWR1A's
hall house at its smaller end, dropped on a levelled platform inside a moat.** Nothing about it
is institutional except its position. The word "periodically occupied" is the second important
one: **the lodge is used in season and stands empty the rest of the year**, which makes it the
corpus's second temporal-occupancy institution after family H's booth.

**The lodge's enclosure is measured.** At Higham, "a moat lies just inside and near the entrance
to Higham medieval deer park and is the site of the keepers lodge known as Great Lodge. The ditch
was some 10m wide and up to 2m deep from the outside, though only 1m deep from the interior. The
rectangular area is defined as 130m x 90m, surrounded on three sides by a ditch 8m wide x 2m
deep" (CONFIRMED-digest, same round). A 130 × 90 m platform — 1.17 hectares — is a compound, not
a house plot, and the asymmetric ditch (2 m from outside, 1 m from inside) is a real construction
detail: the spoil went inward, so the platform is raised, which is both the eminence and the
drainage.

**The upper rung is a court, and it is R-INST-1's.** The Speech House in the Forest of Dean was
"originally built as a hunting lodge for King Charles II in 1669" and its principal room is the
Verderer's Court, "the most historic room in The Speech House where judgements took place over
300 years ago"; the New Forest's Verderers' Hall at Lyndhurst descends from "a building in which
the New Forest courts could meet", constructed in 1388 "within or beside Lyndhurst's old manor
house, the building which later became King's House" (CONFIRMED-digest, 2026-08-23). **The
warden's institution graduates into a COURT, and the court is HOSTED inside the lodge or the
manor house rather than owning a building.** R-INST-1's family A holds the moot and the court
room and this dossier hands the rung there.

**Structural imperatives.** Nothing heavy. A timber hall, a hearth, a chamber, a service bay; a
moat and a levelled platform; a stable or a shelter for horses and dogs (family K); and — the
one thing the entry's own description implies that a hall house does not have — a place to keep
and dry gear that has been out in the weather. The `Adventurers' charter hall` adds R-INST-1's
board, counter, trophies, lodging and yard, all sourced there.

**Prosperity and wear grades.** Floor = a marked tree, a boundary stone and a man who lives in
the village (`NO_BUILDING`). Rung 1 = a one-cell shelter or waypost hut on the boundary. Rung 2 =
the three-bay lodge with a service bay and a chamber. Rung 3 = the lodge on a moated, levelled
platform with a yard, a stable and a kennel. Rung 4 = the lodge that also holds a court, i.e.
one room becomes public. Ceiling = a compound of 1.17 ha with ranges round a yard. Decline is
distinctive and documented: **the lodge is ABANDONED rather than subdivided** (Bradgate is
abandoned within about 150 years of building), because it depends on an institution — the park —
that can simply cease. The residue is a moated platform with nothing on it, which is exactly
what the archaeology finds, and it is a superb DW law 5 fossil: a moat with no building inside
it.

**(b) Measured.**
- Higham Great Lodge: platform 130 × 90 m; moat ditch c. 10 m wide, up to 2 m deep from outside
  and 1 m deep from inside; a second ditch on three sides 8 m wide × 2 m deep (CONFIRMED-digest).
- Bradgate Park lodge: a THREE-BAY hall, base cruck, plus a service bay and a chamber; timber
  framed; offset to the west of the centre of a levelled platform within a moat; mid-13th
  century, abandoned by c. 1400–1425 (CONFIRMED-digest). No bay dimension is given; DWR1A's
  measured bay range is the correct source for it and is used by pointer rather than guessed.
- Verderers' Hall, Lyndhurst: a court building of 1388 on the site of the present hall
  (CONFIRMED-digest). Speech House: 1669 (CONFIRMED-digest).
- NOT FOUND, searched: any measured plan of an `Adventurers' charter hall` analogue beyond what
  R-INST-1 already holds; any bay dimension for Bradgate. Query issued: "medieval deer park lodge
  keeper's lodge plan excavated dimensions standing hunting lodge" (one round, returning the two
  sites above); "verderer's lodge royal forest woodward house Lyndhurst Speech House plan rooms
  forest court" (one round, returning the institutional history and no plan).

**(c) Contested and counterexamples — the negation search.**
(i) **"The lodge was periodically occupied" is itself the negation, and it landed.** The
excavator's own reading of Bradgate is a lodge used in season, possibly doubling as the keeper's
house. So the honest verdict for a `Warden's Lodge` is not "a building with staff" but "a
building with a season", and the corpus should be able to say that a plan is derived for an
institution that is empty for months.
(ii) **The moat is not a fortification and reading it as one is the trap.** Ten metres wide and
two metres deep against "poaching gangs" is a barrier to people on foot with dogs, not to a
siege. Any grammar that upgrades a moated lodge toward R-INST-1's defensive partis has
misread the threat model.
(iii) **The charter hall's genre reading was already tested by R-INST-1 and survived**, which is
worth restating because it is a rare positive: every fixture the genre expects has a sourced
ancestor, so the fantasy hall is the tranche's second family (with B) that can be composed
without minting anything. This dossier adds one caution R-INST-1 did not need: the hamlet-tier
row (L310) describes "a rough hall" in a settlement of a few dozen people, and at that tier the
honest verdict is HOSTED — the hall is the alehouse or the largest barn — because a hamlet does
not build a public hall. R-INST-4's family A holds the alehouse.
(iv) **`Multiple adventurers' guilds` is a COUNT, and its interesting content is the word
"Competing".** Competition between two chartered bodies in one city is a faction fact, not a plan
fact; spatially it produces two halls in DIFFERENT quarters, which is a siting rule
(mutual repulsion) the parcel assignment stage could actually honour. No new parti.

**(d) CIRCULATION typology (ODQ §452).**
- `CROSS_PASSAGE / SCREENS_PASSAGE` — the three-bay hall's own, with the service bay on one side
  and the chamber on the other. DWR1A and R-INST-1 own the measured version.
- `THROUGH_ROOM` — everything else in the lodge.
- **`GATE_PASSAGE` over a moat: the CAUSEWAY.** A moated platform is entered at one point, over a
  bridge or a causeway, and that single crossing is the compound's only joint with the world. It
  is the same one-controlled-entrance law as family C's gatehouse, family J's fondaco and family
  F's teleport compound, arrived at for a fourth time by a fourth route — which makes it the
  tranche's most repeated circulation finding and a strong candidate for a first-class attribute
  (`compound.entrances: 1`).
- `GALLERY`, `CORRIDOR`, `STAIR_HALL{grand}` — absent from the lodge; the charter hall's are
  R-INST-1's.
- **DW law 6 inverts again.** A moated platform has no street frontage at all: the "frontage" is
  the causeway, and the building is oriented to the yard and the prospect. Third instance in this
  tranche (families C, I, J).
- Width buckets: the causeway is not measured in the sources this lane reached; the moat is
  8–10 m wide, which bounds the bridge span. PARTIAL.

**(e) STORAGE typology (ODQ §453).**
- `PANTRY` / `BUTTERY` — the three-bay hall's service bay, unchanged from DWR1A. This is the one
  family in the tranche that uses the §453 household classes as written, because the lodge is a
  house.
- `STORE{GEAR}` — the warden's own contribution: nets, ropes, traps, bows, tools, and wet
  clothing. `lightReq: NONE`, dry, and — a real requirement — **VENTILATED**, because gear that
  comes in wet and is shut in a cold store rots. Proposed attribute `store.drying: true`, which
  the corpus has not needed before and which recurs anywhere fishing, hunting or field work is
  stored.
- `STORE{TROPHY}` — R-INST-1's, cited (the Speech House antlers). A display store, i.e. a store
  whose light requirement is HIGH because its purpose is to be seen; the inversion is worth
  noting.
- `STRONGROOM` / muniment — the charter hall's vault, R-INST-1's.
- `CELLAR` — absent from a timber lodge on a raised platform (the platform is made of the moat's
  spoil, so digging into it is digging into fill). A small but real negative finding: **a moated
  platform argues against a cellar**, which is a DW law 7 interaction — the undercity graph should
  not anchor a cellar under a made platform.

**(f) Typed proposal.**
`parti: WAYPOST_CELL` — one cell on a boundary, no hearth or a simple one, no service. The floor.
`parti: LODGE_THREE_BAY` — the sourced core: a three-bay hall with a service bay and a chamber,
timber, one hearth. Sited for PROSPECT.
`parti: MOATED_PLATFORM_COMPOUND` — `LODGE_THREE_BAY` on a levelled platform inside a wet or dry
moat, entered by ONE causeway, with a yard and outbuildings (stable, kennel — family K).
`compound.area` bucket from Higham's 130 × 90 m at the top.
`parti: CHARTER_HALL` — R-INST-1's, cited entire; `HOSTED` at hamlet tier.
`zoning/count: N_HALLS_REPELLING` — the city row: N instances of `CHARTER_HALL` with a mutual
siting repulsion, not one bigger building.
`functions[]`: floor = `waypost`. Rungs: + `hall` → + `service bay` → + `chamber` → +
`store{gear, drying}` → + `yard` → + `stable/kennel` → + `moat + causeway` → + `court room` →
+ `board + counter` → + `lodging` → + `trophy display` → + `vault`.
`fixtures[]`: `HEARTH`, `BENCH`, `TABLE`, `SCREEN`, `RACK{gear}`, `HOOK{drying}`, `HORN`,
`TROPHY{antler}`, `BOARD{bounty}`, `COUNTER`, `MAP_OR_PERAMBULATION` (the forest's own record —
the boundary description a warden keeps; R-INST-1's muniment fixture at a smaller scale),
`BOUNDARY_STONE`, `CAUSEWAY`, `BRIDGE{timber}`.
Structural buckets: `prospect` (**new: the site is chosen for the view OUT**), `moat{width,
depthOut, depthIn}`, `raisedPlatform`, `singleCauseway`, `seasonalOccupancy`, `timberFrame`.
Licensing: `Warden's Lodge` `tier ≥ town` per the catalog, though the analogue would license it
at village tier wherever a park or forest exists — reported, not corrected; `Adventurers' charter
hall` hamlet upward per the catalog; `prosperity ≥ low` for the waypost, `≥ middling` for the
lodge, `≥ high` for the moated compound; `era: 1200+ for the park lodge`;
`siting: EMINENCE | PARK_EDGE | FOREST_BOUNDARY | (charter hall) MARKET_OR_GATE`;
`magicLicense: NONE` for the lodge and the charter hall — **the second `NONE` in the tranche.**
A ranger station is a ranger station; the druidic-waypost reading is a CULTURE dial on the same
building, exactly as the catalog's own "ranger station OR druid waypost" implies.
**VERDICT per tier.** town `Warden's Lodge`: **BUILDING** (`LODGE_THREE_BAY`, rising to
`MOATED_PLATFORM_COMPOUND`), with the honest caveat that it is periodically occupied. hamlet
`Adventurers' charter hall` (L310): **HOSTED** (the alehouse or the largest barn) — this dossier
differs from R-INST-1 only in pushing the hamlet rung down to hosted, and flags the difference
rather than overwriting it. village (L819) and town (L1394): **BUILDING**, R-INST-1's
`CHARTER_HALL`. city `Multiple adventurers' guilds`: **BUILDING ×N** with mutual repulsion.
**HOME tags.** `hall` → HOME: `ROOM_KINDS.hall`. `chamber` → HOME: `ROOM_KINDS.chamber`.
`service bay` → HOME: `ROOM_KINDS.store` (or R-INST-4's pantry/buttery once those exist).
`store{gear}` → HOME: `ROOM_KINDS.store`. `court room` → HOME: `ROOM_KINDS.hall` +
`ROOM_KINDS.dais`. `lodging` → HOME: `ROOM_KINDS.lodging`. `vault` → HOME:
`ROOM_KINDS.strongroom`. `muster/yard` → HOME: `ROOM_KINDS.muster` for the covered part only.
**NO TYPED HOME**: `waypost`, `yard`, `moat`, `causeway`, `trophy display`, `stable`, `kennel`.

**(g) Consequences for the grammar.**
1. **`prospect` as a siting bucket.** Three families now want a sight-line (A to the sky, F to
   the next station, I over the park) and the corpus has no way to say "this building's site is
   chosen for what it can see". It is a parcel-selection input, not a plan input, and it belongs
   in DW's S1 circumstances snapshot.
2. **A defensive grade BETWEEN undefended and fortified.** The anti-poaching moat. R-INST-1 owns
   the fortified end; this is a real intermediate and it produces a compound rather than a wall.
3. **`seasonalOccupancy`.** With family H's `permanence: TEMPORARY` this makes two distinct
   temporal properties. DW law 4 handles both for free (derive on demand), but the PANE must be
   able to say "empty this month", which is a projection question for DW-6.
4. **A made platform forecloses a cellar.** A one-line interaction between the parcel's
   construction history and DW law 7's undercity anchoring.
5. **`store.drying`** — a ventilated store. New, small, and recurs across every outdoor trade.
6. **Mutual repulsion between instances of one institution.** "Competing organizations" is a
   siting rule the parcel assignment stage can honour and it costs nothing; it recurs wherever
   the catalog says "multiple" of a rivalrous type.

**(h) Continental versus English.** The park lodge is strongly English and its density is a
consequence of English forest law and the sheer number of imparked deer parks; the continental
equivalent is the hunting *Jagdschloss* and the French *rendez-vous de chasse*, which are larger,
later and courtly rather than functional (PLAUSIBLE, not researched this session). The
adventurers' hall's continental ancestor is the Netherlandish *doelen* — the shooting guild's
hall with its range, its lodging and its feast — which R-INST-1 researched and which is the
better analogue than anything English. §15 does not extend this family, and the reason is worth
stating: **a forest lodge is a function of forest LAW, and forest law is a culture dial, so the
setting-agnostic answer is that this building exists wherever a polity reserves land, whatever
the cosmology.**

**(i) FANTASY NOTE — the genre CONVENTION and the ENGINE CONTRACT.**
**CONVENTION.** R-INST-1 already established the charter hall's conventions and traced every one
to a sourced fixture. This dossier adds the WARDEN'S conventions: the genre ranger station is
expected to be a remote cabin or lodge, with maps, gear, trophies, a beacon or signal, and a
keeper who is often alone. Four of those five are CONFIRMED features of a park lodge; the fifth,
the beacon, is R-INST-1's (the watch and the fire beacon) and is a legitimate borrow. The druidic
variant the catalog names differs in FIXTURES only — the perambulation record becomes a knowledge
of the land rather than a parchment — and the plan does not change at all, which is the
setting-agnostic answer this family should give.
**The setting-agnostic test:** passes completely. Delete the magic and the Warden's Lodge is a
park lodge and the charter hall is a *doelen*. Neither entry needs the magic dial at all, which
is why both get `magicLicense: NONE` — and which makes the engine's treatment of them (below) the
tranche's most consequential mismatch.
**ENGINE CONTRACT (read this session, CONFIRMED).** Two findings, both material.
**First, the mis-inference.** `Warden's Lodge` infers `institutionNature` = **`vice`**, because
`FACET_INFERENCE`'s vice row `/tavern|brothel|den|gambling|smuggl/i` matches `/den/` inside
"War**den**'s". A ranger station therefore currently draws the TAVERN template: a common room
with a bar, a kitchen, a cellar, and lodging at tier ≥ 3. This is the first of the tranche's
three unanchored-substring mis-inferences (with "resi**den**t" and "**fort**une") and is
engine-gap G1. The correct nature is arguably `security` or `civic`; the sourced plan is a hall
house, which the `civic` template (hall + chamber + records) fits well.
`Adventurers' charter hall` at all three tiers infers **`civic`** (`/\bhall\b/`) — correct, and
the civic template's hall + chamber + records is a good match for R-INST-1's parti. `Multiple
adventurers' guilds` infers **`trade`** (`/guild/`), drawing hall + counting + strongroom, which
is also defensible (the counter and the vault).
**Second, the shelf artefact, and it is the most consequential single engine finding in this
dossier.** `Adventurers' charter hall` sits on the **Magic** shelf at hamlet (L310) and village
(L819) and on the **Adventuring** shelf at town (L1394). The consequences are two, and both are
live. (1) At `magicExists === false` or `priorityMagic === 0`, `filterCatalogForMagic` strips any
row whose shelf is `magic` or `exotic` — so **the hamlet and village charter halls VANISH from a
dead-magic world while the town one survives**. (2) In `institutionProbability`, the magic
multiplier fires when `cat.includes('magic')` — so **the hamlet and village rows are multiplied
by `priorityMagic/50` and by the tier penalty (0.25 and 0.40), while the town row is not
multiplied at all.** A frontier hamlet in a low-magic world is therefore markedly less likely to
have a bounty hall than the same hamlet in a high-magic world, for no reason anybody authored:
the cause is a SHELF, and the shelf is a display bucket. All three rows also carry the
monsterThreat gate (×5 plagued, ×3 frontier, ×0.3 otherwise), which is the intended and
well-designed driver and which the shelf artefact partially masks. Flagged at §Σ as engine-gap
G4, and it is a two-line catalog move rather than a code change — but a catalog move is
owner-gated and is reported, not proposed as done.


---

## §11 · FAMILY J — the planar seam and the great-library boundary: Planar embassy (metropolis L2356 "Formal diplomatic mission from a planar power. Trade, information, occasional intervention.") · Planar traders (city L2141 "Goods from other planes of existence.") · Great library (metropolis L2348 — BOUNDARY ONLY)

**THE GREAT LIBRARY BOUNDARY, STATED FIRST AND IN FULL.** `Great library` sits on the catalog's
**Magic** shelf and carries `tags: ['education','education']` (the tag is duplicated in the
source, which is a small authoring defect worth an owner's eye). **R-INST-3 family M holds this
entry and researched the library parti there** — the building, the fittings, the shelving pitch,
the light requirement and the fire law — and its own note records the reason: "Magic shelf by the
catalog; primarily learning → here". This dossier therefore claims NOTHING about the library as a
building and adds exactly two things R-INST-3 could not: the SHELF's mechanical consequences in
the live engine (below, in (i)), and the one arcane question the entry raises — whether a
collection can contain something that changes the ROOM. The answer this dossier gives is no, and
gives it deliberately: a restricted collection is a real, sourced thing with real, sourced
hardware — the chained library, the locked press, the muniment tower over a gate (family C, and
R-INST-3 family M) — and `ROOM_KINDS` already carries `stacks`, `records`, `strongroom` and
`concealed` to express every grade of it. **No magical room class is needed for a dangerous
book, and this dossier recommends minting none.**

**(a) Analogue.** The two planar entries are one institution at two scales, and the analogue is
the best-documented building type in the whole tranche: the **fondaco**, the walled compound in
which a host state houses, supplies, taxes, watches and contains a resident foreign nation.

**The Fondaco dei Tedeschi is a measured instance and it answers almost every question the
`Planar embassy` entry raises.** First built beside the Rialto in 1228 and rebuilt 1505–08 after
a fire, it is "a practical four-floor building that encircled a large inner courtyard"; "the
ground floor was designed for storage and canal access, the middle levels handled administration
and trade, and the upper areas housed a large number of merchant rooms under rules that limited
movement and managed taxation"; the first floor "contained offices and some living accommodation
was at the top"; and "the courtyard acted as a neutral ground for negotiations between Venetian
hosts and Germanic guests" (CONFIRMED-digest, 2026-08-23, of the Grokipedia and italythisway
accounts returned in the round). The Wikipedia article, WHICH WAS OPENED, supplies the counts:
"fifty-six rooms and many additional rooms for storage", housing "over one hundred merchants, and
an equal number of servants, as well as many additional administrative officials"; a "five-bay
loggia" on the canal side for merchant disembarkation; a single central courtyard after the 1505
rebuild, with one medieval well still visible in it; and a large wall clock "installed in 1571"
(CONFIRMED, [Wikipedia: Fondaco dei Tedeschi](https://en.wikipedia.org/wiki/Fondaco_dei_Tedeschi),
fetched 2026-08-23). And the threshold ritual, which is the finding: "Germans had to perform a
ceremonial handover of their weapons to the Fontegher, the Venetian authority in charge of room
assignments" (CONFIRMED, same page).

**Read that as a plan and it is a complete brief for an embassy of an impossible country.**
A walled block with ONE controlled land entrance and one water frontage; an officer of the HOST
state at the door who takes the arrivals' weapons and assigns their rooms; a courtyard that
belongs to neither party and where business is done; storage at the bottom; administration in the
middle; lodging at the top, under movement rules; a well inside so the compound need not go out
for water; and a clock, because a compound with rules needs hours. Every one of those is a cell
or an attribute, and not one of them required a fantasy premise.

**The resident embassy proper is LATER and it is always a RE-USED HOUSE.** "The earliest
documented permanent diplomatic missions appeared among Italian city-states in the mid-15th
century", the first dated to 1455 when Milan accredited a resident envoy to Genoa; Venice
maintained permanent *baili* in Constantinople (CONFIRMED-digest, 2026-08-23). And the building
follows the same rule the observatory and the signalling station follow: the Palazzo Loredan
dell'Ambasciatore in Venice "was not purpose-built as an embassy but rather repurposed from an
existing private residence" — in 1752 Doge Francesco Loredan "offered the palazzo to serve this
diplomatic function ... in exchange for 29 years of restorations", and Count Philip Joseph
Orsini-Rosenberg was "the first Imperial Ambassador to live there" (CONFIRMED,
[Wikipedia: Palazzo Loredan dell'Ambasciatore](https://en.wikipedia.org/wiki/Palazzo_Loredan_dell%27Ambasciatore),
fetched 2026-08-23). **The embassy is a palace the host lends, on terms, in exchange for its
upkeep** — which is a beautifully concrete relationship and one a settlement generator can carry
as a fact rather than as flavour.

**`Planar traders` is the fondaco's other half without the diplomacy.** "Goods from other planes
of existence" is a foreign merchant colony: R-INST-2's warehouse and shop-house families own the
mundane building, and what this tranche adds is the CONTAINMENT — the foreign trade that is
allowed in but not allowed to disperse. The Venetian rule that the German merchants had to lodge,
store, trade and be taxed IN ONE BUILDING is the mechanism, and it is the reason the fondaco
exists as a type at all.

**Structural imperatives.** A perimeter that is defensible against no army but proof against
walking out; ONE land gate; a water or road frontage for goods; a courtyard large enough to be
neutral; storage at ground level with direct access to the transport frontage; a well; and
lodging above with a route to it that passes the officer. No span, no furnace, no water beyond
the well, and no hazard — the fondaco's structural problem is entirely a SOCIAL problem expressed
in masonry.

**Siting and anchor law.** Beside the transport interchange and beside the market — the Fondaco
dei Tedeschi is at the Rialto, i.e. at the bridge, the market and the canal at once. The host
state puts the foreign nation where it can be reached and watched, not where it would choose.

**Prosperity and wear grades.** Floor = a foreign merchant lodging in an ordinary inn under a
rule about where he may sleep (HOSTED — R-INST-4 family B). Rung 1 = one house assigned to the
nation. Rung 2 = a house with its own store and gate. Rung 3 = the courtyard compound with
storage below and lodging above. Ceiling = the Fondaco: 56 rooms, 200-plus residents, a resident
host official, a loggia, a well and a clock. Decline: the nation leaves and the compound is
re-let — the Fondaco itself became a customs house and then a post office, which is the type's
characteristic afterlife and is a good `reclassedTo` chain.

**(b) Measured.** Fondaco dei Tedeschi (CONFIRMED, Wikipedia, fetched 2026-08-23): four floors;
one central courtyard; **56 rooms plus many additional storage rooms**; over 100 merchants plus
an equal number of servants plus administrative officials; a five-bay canal loggia; one medieval
well; a wall clock of 1571; built 1228, rebuilt 1505–08 after the 1505 fire. **No linear
dimension of the building or the courtyard was obtained** — the Wikipedia article "lacks
comprehensive spatial measurements" and no other page was opened. Palazzo Loredan
dell'Ambasciatore: assigned 1752 in exchange for 29 years of restorations (CONFIRMED). Resident
embassies from 1455 (CONFIRMED-digest). **NOT FOUND, searched**: any courtyard or room dimension
for the Fondaco or any other fondaco/han/steelyard (the han and caravanserai figures — including
Sultanhanı and Koza Han — are R-INST-2 family N's and are used by pointer rather than
re-fetched); any dimension for an early resident embassy. This family therefore has room COUNTS
but no room SIZES, and its size buckets in (f) are inherited from R-INST-2's han and warehouse
work. Ledger item L.9.

**(c) Contested and counterexamples — the negation search.**
(i) **The negation was run and it returned the finding: the embassy is not a building type.**
Query: "first permanent resident embassy ambassador rented house not purpose-built building 15th
century Venice Rome". The result set contained no purpose-built early embassy and one explicit
counter-instance (the Palazzo Loredan, re-used and formally so). **A purpose-built embassy is a
nineteenth- and twentieth-century thing; before that, an embassy is a HOUSE WITH A STATUS.** This
is the third time in this tranche that the negation has returned the same shape of answer — the
observatory was a room (family A), the signalling station was a chamber of a house (family F),
the embassy is a lent palace — and the repetition is itself the tranche's central structural
result.
(ii) **The fondaco is a containment, not a courtesy, and the distinction changes the plan.** A
compound with one gate, an officer who takes your weapons and assigns your bed, and rules that
limit your movement is a building designed to keep a foreign body IN. A generator that draws a
`Planar embassy` as a grand open palace has drawn the nineteenth-century version.
(iii) **The `Great library`'s tag says `education` and its shelf says `Magic`, and the estate's
own code has already ruled on which wins.** `src/domain/arcaneInstitutionIdentity.js` states the
ruling in its header: an institution is arcane when the author TAGGED it so, and "It is NOT
arcane merely for sitting in the `Magic` or `Exotic` display bucket: 'Great library' is filed
under Magic and authored `tags: ['education']`, and a repository of books is not a spellbook.
That asymmetry IS the ruling: the tag is the authored semantics, the bucket is a shelf"
(CONFIRMED by reading the file this session). **This dossier endorses that ruling and applies it
to the whole tranche**: the shelf is a display bucket and must never be a semantic gate. The
places where it currently IS one are §Σ's engine gaps G3, G4 and G5.
(iv) **A caution about the fondaco's counts.** "Fifty-six rooms" and "over one hundred merchants"
are Wikipedia's, not a surveyor's, and 100+ merchants plus 100+ servants in 56 rooms means roughly
four people per room, which is a plausible but unverified density. Number audit performed and the
result reported rather than smoothed: **the counts are consistent with each other at about four
occupants per room, which is a crowded but ordinary early-modern lodging density.**

**(d) CIRCULATION typology (ODQ §452) — the courtyard compound at its purest.**
- **`GATE_PASSAGE{SINGLE, CONTROLLED}`** — the one land entrance with the host's officer in it.
  Fourth instance in this tranche (C's gatehouse, F's teleport threshold, I's causeway, J's gate),
  and the strongest: this one has a documented RITUAL attached (weapons surrendered, room
  assigned), which is the clearest possible statement that a threshold is a cell with a procedure.
- **`GALLERY{COURTYARD_RING}`** — a four-storey building round a courtyard distributes by
  galleries or by external stairs off the court; the corpus's `GALLERY` class covers it and
  R-INST-4's inn gallery over the yard is its direct sibling. This dossier could not confirm from
  an opened source whether the Fondaco's ranges were gallery-served or stair-served and marks the
  point OPEN (ledger L.9).
- **`LOGGIA{FIVE_BAY}`** — the canal-side arcade "for merchant disembarkation": an exterior
  covered threshold between transport and building. `EXTERIOR_WALK` with a transport joint, and
  the corpus's cleanest example of a building whose SERVICE frontage and CEREMONIAL frontage are
  the same edge.
- **`THROUGH_ROOM`** vertically stratified by function: storage at the bottom, administration in
  the middle, lodging at the top. **That is a VERTICAL FUNCTION GRADIENT** — the corpus has seen
  live-over-work (families A, B, D) but this is the first three-band stratification, and it is
  driven by the transport frontage at the bottom rather than by status.
- `CORRIDOR` — not attested; the room count (56) would license one in a later building and the
  sources do not say. OPEN.
- `LOBBY` — the courtyard itself performs the neutral-ground function a lobby would.
- Width buckets: none measured; R-INST-2's han and warehouse buckets are used by pointer.

**(e) STORAGE typology (ODQ §453).**
- **`STORE{BONDED}`** — the family's contribution, and a real class the corpus lacks. The
  fondaco's ground floor is not a warehouse the merchant controls; it is a warehouse the HOST
  controls, where goods sit under seal until they are taxed. `lightReq: NONE`, sizeBucket LARGE,
  ground level, direct access to the transport frontage, `controlledBy: HOST_STATE`, and a
  `REGISTER` fixture. R-INST-2's customs and warehouse families own the mundane version and this
  dossier flags the CONTROL attribute as the addition.
- `STORE{ARMS, surrendered}` — small, locked, beside the gate. A direct consequence of the
  weapons ritual, and a lovely concrete cell: **the room where the visitors' weapons are kept**.
  `ROOM_KINDS.armory` is a near-miss home (it is the security template's own room and carries
  `rack` and `strongbox`, which is exactly right).
- `RECORDS` — the room assignments, the tax ledgers. `ROOM_KINDS.records` exists.
- `WELL` — a fixture, in the courtyard, and a strategic one: a compound with its own water need
  not open its gate.
- `CELLAR` — Venetian ground conditions forbid it; elsewhere the bonded store would be an
  undercroft. A culture/terrain gate on a storage class, which the corpus should be able to
  express.
- For the `Great library`: R-INST-3 family M, entire. Nothing added.

**(f) Typed proposal.**
`parti: FONDACO_COMPOUND` — a courtyard block with ONE controlled land gate, a transport-frontage
loggia, a bonded store at ground level, administration on the first floor, lodging above, a well
in the court, and a resident host officer at the gate. `storeys: 3..4`;
`verticalGradient: [STORE, ADMIN, LODGING]`; `entrances: { land: 1, transport: 1 }`.
`parti: ASSIGNED_PALACE` — an existing high-status house lent to a foreign mission on terms. Its
plan is whatever the house was; what the institution adds is a `GATE{controlled}`, a `RECORDS`
cell and an `ARMS{surrendered}` closet. **The correct default for `Planar embassy` at anything
below the ceiling**, and the one the negation search supports.
`HOSTED{host: INN | WAREHOUSE_ROW}` — `Planar traders` at the floor.
`zoning: FOREIGN_QUARTER` — the ceiling for `Planar traders`, and R-INST-2's to draw.
`functions[]`: floor = `lodging{under rule}`. Rungs: + `store{bonded}` → + `gate{controlled}` →
+ `records` → + `arms{surrendered}` → + `courtyard` → + `well` → + `loggia` → + `offices` → +
`chapel-or-rite-room of the guest nation` → + `clock`.
`fixtures[]`: `GATE{barred}`, `WICKET`, `PORTER'S_HATCH`, `REGISTER{room assignments}`,
`SEAL{bonded goods}`, `RACK{surrendered arms}`, `WELL{courtyard}`, `CLOCK{wall}`, `LOGGIA_ARCADE`,
`CRANE_OR_HOIST` (a four-storey store on a water frontage needs one — PLAUSIBLE, not sourced for
this building, and flagged), `ARMS{of the guest nation}` over the gate.
Structural buckets: `courtyardBlock`, `singleGate`, `transportFrontage`, `verticalGradient`,
`selfWater`, `bondedVolume`.
Licensing: `Planar embassy` `tier = metropolis`, `Planar traders` `tier ≥ city` per the catalog;
`prosperity ≥ high`; `era: 1228+ for the fondaco, 1455+ for the resident mission`;
`siting: AT_THE_INTERCHANGE` (bridge, gate, quay, market — never the quiet quarter);
`magicLicense: HIGH` for both planar rows (both are in the engine's hard-zero list below
`priorityMagic` 66 via the `planar` keyword) and **`NONE` for the `Great library`**, which is
R-INST-3's entry and whose only magical property is a shelf.
**VERDICT per tier.** metropolis `Planar embassy`: **BUILDING** — `ASSIGNED_PALACE` by default,
`FONDACO_COMPOUND` at the ceiling. The default matters: the negation says a purpose-built embassy
is an anachronism, so a generator should re-use a high-status parcel and MARK it as assigned,
which is a far better world-fact than a new building. city `Planar traders`: **HOSTED** at the
floor (lodged in an inn under a rule); **BUILDING** (`FONDACO_COMPOUND`, or R-INST-2's warehouse
with a controlled gate) at high prosperity; **zoning** at the ceiling. metropolis `Great library`:
**BUILDING**, and the parti is R-INST-3 family M's — cited, not restated.
**HOME tags.** `store{bonded}` → HOME: `ROOM_KINDS.store`. `records` → HOME:
`ROOM_KINDS.records`. `arms{surrendered}` → HOME: `ROOM_KINDS.armory`. `offices` → HOME:
`ROOM_KINDS.counting`. `lodging` → HOME: `ROOM_KINDS.lodging`. `chapel-or-rite-room` → HOME:
`ROOM_KINDS.sanctuary` (R-INST-3's, and used here strictly as a cell shape with no theology
attached). **NO TYPED HOME**: `courtyard`, `loggia`, `gate/porter's lodge`, `well`.

**(g) Consequences for the grammar.**
1. **`ASSIGNED_PALACE`: an institution that OCCUPIES an existing building rather than generating
   one.** Three families now demand this — E's stone ring, G's charnel, J's embassy — and it is
   the same mechanism each time: the institution's plan is somebody else's plan plus a few added
   cells and a changed control. This is the tranche's single most valuable structural
   recommendation and it is stated once, here, and repeated in §Σ: **DW needs an OCCUPATION
   relation, distinct from construction.**
2. **`verticalGradient` driven by transport rather than by status.** Store at the quay level,
   administration above, lodging at the top. DW law 9's vertical partition currently reads status
   (the piano nobile); this is a second, orthogonal driver.
3. **`STORE{BONDED}` with `controlledBy`.** A store inside your building that you do not control.
4. **A threshold with a PROCEDURE.** The weapons ritual is the corpus's proof that a gate cell can
   carry a typed sequence of actions, which is exactly what a `CirculationCell.joints[]` entry
   could hold, and which makes the difference between a doorway and an institution.
5. **`selfWater`: a well inside the perimeter.** A compound that need not open its gate. It is a
   siege property, a plague property and a control property, and R-INST-4 family L owns the well
   itself.
6. **The shelf must never be a semantic gate.** The estate's own R-BLD-5 ruling already says so
   for one detector; three others still read the shelf. See §Σ.

**(h) Continental versus English.** England's instance of the type is the STEELYARD, the Hanseatic
merchants' walled compound on the Thames — the same containment logic, and R-INST-2's warehouse
family is its nearest researched relative (the Steelyard itself was NOT researched this session
and is ledger item L.9). The type is Mediterranean and Levantine in origin: the Venetian and
Genoese *fondaci* in Constantinople and Alexandria, the Ottoman *han*, and the Arabic *funduq*
from which the word descends are one continuous institution, and R-INST-2 family N holds the han
and caravanserai with measured figures. **The English register is the parochial one here and the
mechanism travels from the Mediterranean, which is the mirror image of families A and I.** §15
carries the funduq and the han.

**(i) FANTASY NOTE — the genre CONVENTION and the ENGINE CONTRACT.**
**CONVENTION.** The genre planar embassy is expected to be: extraterritorial, strange in its
interior, guarded at the threshold, and a place where the rules of the host city stop. Every one
of those four is a CONFIRMED property of a fondaco — extraterritoriality is precisely what the
compound negotiates, the threshold is guarded and ritualised, and the courtyard is explicitly
"neutral ground". **The genre expectation and the historical institution are the same
institution**, which makes this family, with B and I, the third case where the fantasy building
needs nothing minted. The convention worth resisting is the embassy as a display palace on a
boulevard; the sourced answer is a walled block at the market with one gate, and it is both truer
and more interesting. On the interior's strangeness: the honest grammar answer is that the guest
nation furnishes ITS OWN cells to its own taste and the host's shell stays a Venetian block —
which is a fixture-level statement, not a room-level one, and it is exactly how the deity
doctrine's cultural-not-theological rule works for temples.
**The setting-agnostic test:** the plan passes completely (a fondaco is a fondaco); the
INSTITUTION fails (delete the magic and there is no other plane to have a mission from). Hence
`magicLicense: HIGH` on the institution and `NONE` on its building — a distinction the licensing
model should be able to make, because it is the difference between "this world has no such
embassy" and "this world has no such building type".
**ENGINE CONTRACT (read this session, CONFIRMED).** `Planar embassy`, `Planar traders` and
`Great library`: the first two infer `institutionNature` = **`generic`**; `Great library` infers
**`learning`** (`/librar/`) and draws reading + stacks + study, which is correct and is one of the
two best inference results in the tranche. Probability: `Planar embassy` and `Planar traders` are
magic-scaled by the `planar` name keyword AND (for the embassy) by the `Magic` shelf, and both are
in the **hard-zero list below `priorityMagic` 66** via `planar`, so both exist only in a
`high`-magic world; both also take the ×1.8 / ×0.3 shelf adjustment. `Planar traders` additionally
qualifies for the isolated-town ×4 escape hatch at `priorityMagic` ≥ 70 (its name contains
`planar`), which is a slightly odd fit — a trader is not transport — and is worth an owner's eye.
**The `Great library` is the tranche's clearest case of shelf-versus-tag divergence and the code
knows it.** Its authored tags are `['education','education']`, so
`institutionCatalogArcaneTag('great library')` returns MUNDANE and
`institutionProbability`'s L302 `magicExists === false` gate does NOT strike it — but
`magicFilter.isArcaneInst` strips it at magic=0 twice over, once for the `magic` shelf and once
for the literal keyword `'great library'` in `ARCANE_INST_KW`, and `institutionProbability`'s
magic MULTIPLIER fires on `cat.includes('magic')`, so **the region's largest repository of
knowledge is currently rarer in a low-magic metropolis and hidden from the institutional grid in a
dead-magic one.** `arcaneIdentity.js`'s header records the divergence and calls it "unobservable
in the live pipeline (filterCatalogForMagic runs upstream of every consumer of this module)" —
which is true of the ARCANE-IDENTITY consumers, and this dossier notes without contradicting it
that the multiplier in `institutionProbability` is a separate path that the strip does not cover,
because the generation step reads `institutionalCatalog[tier]` raw. Reported as engine-gap G5,
with the observation that it is a two-character catalog change (move the row to a learning shelf)
and therefore owner-gated, not proposed.


---

## §12 · FAMILY K — the beast-keeper and the resident wyrm: Beast trainers (town L1408 "Common animals only. Horses, dogs, falcons.") · Dragon resident (city L2149 "Ancient wyrm living in city." — `minTier: metropolis`)

**WHY THESE TWO SIT TOGETHER.** They are the tranche's only entries about housing a non-human
BODY, and the historical building programme for that is one programme at three scales: the mews,
the kennel and the stable at the small end; the menagerie in the middle; and, at the large end,
nothing at all — which is itself the answer for the dragon. `Beast trainers` reached this tranche
by hand-off: R-INST-2 pointed it at R-INST-4/5, and R-INST-4 §0.1b passed it here with the note
that the bear-garden and menagerie analogue was a sibling of its arena family. **This dossier
takes it, notes that the entry's own text ("Common animals only. Horses, dogs, falcons") is
entirely MUNDANE, and researches the analogue rather than the fantasy.** `Dragon resident` is
handled with the same discipline and produces the tranche's most surprising verdict.

**(a) Analogue.**

**The mews is named for the moult and it is a purpose-built animal house.** The word derives from
the French *muer*, "to moult", because the building's function was "to confine a hawk to a mews
while it moulted"; "from 1377 onwards the king's falconry birds were kept in the King's Mews at
Charing Cross", formalised by Richard II "as a dedicated complex for housing royal hawks during
molting"; the type's range is explicitly wide — "a mews may vary in size from a small kennel-like
room (or a single building with several such enclosures), to a huge multistory barn with lots of
free-flying space for the lone animal inhabitant" — and the type CONVERTED: "the first recorded
use of mews to mean stables is dated 1548, after the royal stables were built at Charing Cross,
on the site of the royal hawk mews", the hawks "having been given alternative accommodation"
(CONFIRMED-digest, 2026-08-23, of the Wikipedia *Mews* and *Royal Mews* articles and the
falconry-practice pages returned in that round; none was opened). **Three transferable facts: the
building is named after a BIOLOGICAL PROCESS it exists to shelter; its size scales with whether
the animal must FLY inside it; and it converts to a stable, which is the same building with a
different body in it.**

**The menagerie is a gatehouse with dens in it, and its one measured cell is an elephant house.**
Edward I "constructed a semi-circular barbican in 1277, which was named the Lion Tower after the
beasts kept inside", at "the western entrance to the Tower"; the collection descends from Henry
III's from 1235, with the menagerie "officially created" in 1330 by one account; and the single
measured structure is Henry III's elephant of 1255, which "had a brand new 40-foot by 20-foot
elephant house and a dedicated keeper" (CONFIRMED-digest, 2026-08-23). Excavation of the dried
moat in 1936–37 recovered animal bone including "leopards, dogs and lions"; two lion skulls from
those digs have been radiocarbon dated to AD 1280–1385 and AD 1420–1480 and identified
genetically as north African Barbary lions, "the earliest confirmed lion remains in the British
Isles since the extinction of the Pleistocene cave lion"; the menagerie closed in the 1830s
(CONFIRMED-digest, same round). **Two facts that matter to a plan: the menagerie occupies the
GATEHOUSE — it is built into the entrance works of an existing fortress rather than given a site
of its own — and its purpose-built cell is 40 × 20 feet (12.2 × 6.1 m) for ONE animal with ONE
keeper.**

**Structural imperatives.** STRENGTH sized to the occupant (a den is a strongroom whose contents
push outward); a HARD, DRAINED, WASHABLE floor; a WIDE DOOR sized to the body, with a second
smaller door for the keeper — the two-door rule is the whole safety mechanism of an animal house
and it is the same `apertureFor` idea family G reached; FEED and BEDDING storage, which is bulky
and is the largest volume in the establishment; MUCK removal, which is a route and a smell and
therefore a siting fact; WATER; and, for the mews specifically, DARKNESS AND QUIET during the
moult and FLYING SPACE in the largest version. The falcon's requirement is the interesting one
because it is the opposite of every other building in this dossier: **a mews wants low light,
low noise and volume without floor area.**

**Siting and anchor law.** The mews and the kennel sit inside the establishment they serve — a
yard range, exactly as family G's workforce range does. The menagerie sits AT THE GATE, which is
a display decision as much as a security one: the beasts are the first thing an arrival meets.
Muck and noise push the whole family to the yard side and downwind, in tension with the gate's
display pull, and that tension is a real siting problem a generator can express.

**Prosperity and wear grades.** Floor = a perch in the hall and a dog by the fire — no cell at
all, and for a town-tier `Beast trainers` this is a real possibility. Rung 1 = a lean-to or a
shed range in the yard: a kennel, a hawk house, two or three stalls. Rung 2 = a purpose-built
range with a hard floor, a drain, a feed store and a keeper's cell. Rung 3 = a court of ranges
with a training yard, a farrier's or a falconer's workroom, and a muck route out of the back.
Ceiling = the royal mews or the menagerie: a complex with its own staff, its own gate and, at the
Tower, its own tower. Decline: the animals go first and the building survives, becoming a stable,
a store or a dwelling — the Charing Cross conversion of 1548 is the documented instance and it is
a perfect `reclassedTo` chain.

**(b) Measured.**
- Elephant house, Tower of London, 1255: **40 × 20 feet (12.2 × 6.1 m)**, with a dedicated
  keeper (CONFIRMED-digest). This is the tranche's only measured animal cell and it is the
  measured bound for any "large beast" enclosure in the corpus.
- Lion Tower: a semi-circular barbican of 1277 at the Tower's western entrance
  (CONFIRMED-digest). No plan dimension obtained; a search targeting the 1936–37 excavation
  returned the ANIMAL REMAINS rather than the architecture, and said so explicitly.
- King's Mews, Charing Cross: royal hawks from 1377, formalised by Richard II; converted to
  stables 1548 (CONFIRMED-digest).
- Menagerie dates: collection from 1235 (Henry III), Lion Tower 1277, "officially created" 1330
  by one account, closed 1830s (CONFIRMED-digest — the 1330 date conflicts with the 1235 origin
  and the two are reconciled by reading 1330 as a formal constitution of an existing collection;
  that reconciliation is this lane's, PLAUSIBLE, and the conflict is reported rather than
  resolved).
- **NOT FOUND, searched.** No dimension for the Lion Tower's dens, for a mews, for a kennel range
  or for a stable bay in this lane's own searches. Queries: "Tower of London Lion Tower royal
  menagerie plan dimensions dens 1330 elephant house"; "medieval mews falconry building plan hawk
  house dimensions royal mews Charing Cross kennel"; "Lion Tower excavation 1936 dens Tower of
  London menagerie archaeology semicircular barbican plan". Three rounds, one measurement. The
  stable bay is R-INST-2 family M's and is used by pointer. **FAMILY K IS AT DEPTH FOR ANALOGUE
  AND PARTIAL FOR MEASUREMENT**; ledger item L.10.

**(c) Contested and counterexamples — the negation search.**
(i) **The negation for `Beast trainers`: does animal training license a building at town tier?**
The evidence says no. Every purpose-built animal house this lane found is ROYAL — the King's
Mews, the Tower menagerie, the royal stables — and the ordinary town's horses, dogs and hawks
lived in the yard ranges of the houses that owned them. The catalog's own text agrees: "Common
animals only. Horses, dogs, falcons" is a SERVICE offered by a person, and R-INST-2 family M
already holds the stable and the stable master as the town's actual animal building. **Verdict:
`Beast trainers` is HOSTED at the stable or NO_BUILDING, and the dossier says so rather than
inventing a training school.**
(ii) **The negation for `Dragon resident`, and it is the tranche's most useful null.** No
building was ever constructed to house a very large animal in medieval Europe except the 12.2 ×
6.1 m elephant house, which held an animal perhaps 3 m tall. There is no analogue at all for a
structure enclosing something an order of magnitude larger, and the honest architectural
conclusion is the one the entry's own wording already offers: **an ancient wyrm "living in city"
does not get a purpose-built building. It OCCUPIES something** — a ruin, a cistern, an
amphitheatre, a quarry, a tower, a cathedral shell, an undercity void — exactly as families E, G
and J concluded for their own entries by three other routes. This is the tranche's fourth
independent arrival at the OCCUPATION relation and it is the strongest, because here construction
is not merely unattested but physically implausible in the register.
(iii) **The engine already agrees, and its reasoning is on the record.** `Dragon resident` is
listed in `institutionProbability`'s `NON_MAGIC_EXOTICS` alongside `underground city`, with the
comment "Dragon resident and Underground city are geographical, not magical" (CONFIRMED by
reading the file). A dragon is a creature and a place, not a spell — which is exactly the
occupation reading, arrived at independently by whoever wrote that line.
(iv) **The mews-to-stable conversion is a counterexample to type stability.** One building, two
species, ninety years apart, same name. Any grammar that binds a parti to an occupant will get
this wrong; the parti should bind to the REQUIREMENTS (stall, floor, drain, door, feed) and the
occupant should be a licensing input.
(v) **A caution on the elephant house figure.** "40-foot by 20-foot" is a round number from a
secondary account of a thirteenth-century royal works entry, at digest remove. It is reported as
the one measured cell in the family and is explicitly not treated as a survey.

**(d) CIRCULATION typology (ODQ §452).**
- **`THROUGH_ROOM` with a SERVICE PASSAGE**, as family G: bays or dens off a passage so each is
  reached without passing another. The corpus's animal-house default, R-INST-2's to measure.
- **The TWO-DOOR RULE, and it is the family's own contribution to the class set.** An animal cell
  has a large door for the body and a small door or hatch for the keeper, and the two are never
  the same opening. Proposed as `cell.apertures: [ { for: OCCUPANT, size }, { for: KEEPER,
  size } ]`, which generalises immediately to family G's workforce range and family F's airship
  shed (the great gable and the man-door beside it).
- **`GATE_PASSAGE` occupied.** The Lion Tower puts the menagerie IN the barbican, so the
  settlement's most controlled circulation cell doubles as an animal house. That is a fifth
  instance of this tranche's single-controlled-entrance theme and the only one where the gate has
  a second use.
- `EXTERIOR_WALK` — the training yard's perimeter and the muck route, both outdoors.
- `CORRIDOR` — absent; the service passage is a passage in a range, not a corridor in a building.
- Width buckets: the elephant house at 6.1 m wide is the family's one measured span; the door
  bucket must be derived FROM THE OCCUPANT, which is the point.

**(e) STORAGE typology (ODQ §453).**
- **`STORE{FEED}` — the family's largest cell, and larger than any animal's.** Hay, oats, straw,
  meat. Bulk, dry, ventilated, vermin-resistant, `lightReq: NONE`, and — crucially — reachable
  from the yard without passing the animals. R-INST-2's stable family owns the measured version;
  this dossier records the ADJACENCY law and the prohibition: **no internal door from a feed
  store to a den** (the same shape of prohibition as family B's fuel store and family G's body
  store, arrived at a third time, which makes it a general rule: **a store whose contents the
  occupant would consume, spoil or escape through gets no internal door**).
- `STORE{BEDDING}` and the MUCK HEAP — the muck heap is an outdoor fixture with a route to it and
  a siting consequence (downwind, back lane, cartable). R-INST-2 owns it.
- `STORE{GEAR}` — hoods, jesses, leashes, collars, tack, nets. Small, dry, locked at the valuable
  grade (a hawk's furniture and a good saddle are worth stealing). Fixture-to-cell as prosperity
  rises.
- **`STORE{DARK}` — the mews's own class.** A moulting hawk wants darkness and quiet; a cell
  whose light requirement is NONE not for the contents' sake but for the OCCUPANT'S is new to the
  corpus, and it is a nice inversion of family D's light demand.
- `CELLAR` — not attested; an animal range is a ground-level building.

**(f) Typed proposal.**
`parti: YARD_RANGE_ANIMAL` — a single-aspect range in a yard: N bays or dens off a service
passage, hard drained floor, two-door apertures, a feed store at one end, a keeper's cell at the
other. The family's workhorse parti and, as family G noted, the same building that houses a
constructed workforce.
`parti: MEWS_DARK` — the same range with `lightReq: NONE` on the cells, quiet siting away from
the street, and at the ceiling a tall volume for free flight (the "huge multistory barn"
variant).
`parti: DEN_IN_THE_GATE` — dens built into an existing barbican or gatehouse. Not a new building:
an OCCUPATION of R-INST-1's gate works.
`parti: GREAT_BEAST_CELL` — one cell of the elephant-house grade: 12.2 × 6.1 m, one occupant, one
keeper, a wide door and a small one. The measured ceiling for a purpose-built animal cell in this
register.
`OCCUPATION{host: RUIN | AMPHITHEATRE | CISTERN | QUARRY | UNDERCITY_VOID | TOWER}` — the
`Dragon resident`'s only honest verdict.
`functions[]`: floor = `perch/stall in an existing building`. Rungs: + `shed range` → +
`hard floor + drain` → + `feed store` → + `gear store` → + `keeper's cell` → + `training yard` →
+ `dark cells` → + `flight volume` → + `great cell`.
`fixtures[]`: `PERCH`, `BLOCK{falconry}`, `BOW_PERCH`, `TETHER_RING`, `MANGER`, `HAY_RACK`,
`WATER_TROUGH`, `DRAIN{channel}`, `WIDE_DOOR`, `KEEPER_HATCH`, `BARRED_GRILLE`, `STALL_DIVISION`,
`KENNEL_BENCH`, `MUCK_CART`. Of these, `FURNISHING_KINDS` can express `rack` and `cell` and
nothing else.
Structural buckets: `apertureFor{OCCUPANT}` (the sizing driver), `strengthFor{OCCUPANT}`,
`hardFloor`, `drainage`, `bulkFeed`, `darkQuiet` (the mews), `flightVolume` (the ceiling),
`muckRoute`.
Licensing: `Beast trainers` `tier ≥ town`, `Dragon resident` `minTier: metropolis` per the record
(although the row sits in the CITY block — engine-gap G2 again); `prosperity ≥ middling` for a
purpose-built range, ROYAL for the menagerie grade; `era: any`;
`siting: YARD_RANGE | AT_THE_GATE | DOWNWIND`; **`magicLicense: NONE` for `Beast trainers`** (the
catalog says "common animals only") **and `NONE` for `Dragon resident` too** — which is not a
slip: the engine's own `NON_MAGIC_EXOTICS` list already exempts it, and a creature is not a
practice. This makes family K the third and fourth `NONE` in the tranche, and the tranche's
strongest evidence that a "magic" shelf and a magic LICENSE are different things.
**VERDICT per tier.** town `Beast trainers`: **HOSTED** (R-INST-2's stable, or the yard range of
whoever owns the animals) at the floor; **BUILDING** (`YARD_RANGE_ANIMAL`) only at high
prosperity. metropolis `Dragon resident` (record's `minTier`; the row is in the city block):
**NO_BUILDING — an OCCUPATION.** The institution's "plan" is a reference to an existing structure
plus a statement of what the occupant has done to it (a blocked door, a broken roof, a widened
opening — DW law 5 fossils running forward, which is a lovely and entirely lawful use of the
existing machinery).
**HOME tags.** `range/bays` → HOME: `ROOM_KINDS.cells` (the security template's, and a good
shape-fit) or `ROOM_KINDS.store`. `feed store` / `gear store` → HOME: `ROOM_KINDS.store`.
`keeper's cell` → HOME: `ROOM_KINDS.quarters`. **NO TYPED HOME**: `mews`, `stall`, `den`,
`training yard`, `flight volume`, `muck heap`, and every fixture except `rack` and `cell`.

**(g) Consequences for the grammar.**
1. **`apertureFor` and `strengthFor` keyed to the OCCUPANT.** The single most reusable idea in
   this section: a cell whose door size and wall strength are functions of what is inside it.
   Families F, G and K all need it.
2. **The two-door rule.** An occupant aperture and a keeper aperture, never the same. It is a
   safety mechanism, it is visible in the elevation, and it is a one-line cell attribute.
3. **`lightReq: NONE` FOR THE OCCUPANT'S SAKE.** The corpus's light model has been about work and
   perishables; the mews adds a third reason and the model should record WHY a cell is dark,
   because the reason drives what happens when prosperity rises (a dark larder stays dark; a dark
   mews gets bigger, not brighter).
4. **A parti binds to REQUIREMENTS, not to occupants.** The mews became a stable in 1548 without
   changing. This argues for the institution-to-parti mapping to run through a requirement
   roster (DW law 1 already says exactly this) and it is a nice external confirmation of the
   charter's first law.
5. **OCCUPATION, for the fourth time.** Families E, G, J and now K. See §Σ.
6. **`Dragon resident` is the corpus's proof that an institution can be a PLACE-CLAIM.** Some
   institutions do not build, do not host and do not stand on empty ground: they take something
   that exists. The DW record needs to express that, and when it can, it gets the ruined
   amphitheatre with a wyrm in it for free — which is a far better image than any building the
   generator could have drawn.

**(h) Continental versus English.** The menagerie is a princely institution across Europe and
England's is neither the earliest nor the largest; the continental instances (the Florentine and
Milanese ducal menageries, the Habsburg and later the Schönbrunn establishments) are later and
more architecturally ambitious, and none was researched this session. The mews as a purpose-built
hawk house is a north-west European aristocratic type; the Islamic and Central Asian falconry
traditions and their buildings were not researched. **The one mechanism worth naming as
continental is the STUD** — the great horse-breeding establishment with ranges round a court —
which is R-INST-2 family M's Stuttgart Marstall pointer and is explicitly listed in R-INST-2's
own deliberately-not-covered ledger. §15 notes the non-European animal houses as unresearched.

**(i) FANTASY NOTE — the genre CONVENTION and the ENGINE CONTRACT.**
**CONVENTION.** The genre beast-keeper is expected to have a yard of pens, a feed store, a
training ring and exotic occupants; the genre resident dragon is expected to occupy a ruin, a
cavern, a tower or a quarter of the city, and to have modified it. **Both conventions match the
sourced answer almost exactly, and the dragon's convention matches it perfectly** — which is the
tranche's neatest result, because the genre's instinct that a dragon TAKES a place rather than
being given one is precisely what the architectural evidence forces. The convention worth
resisting is the purpose-built "monster stable" with vast doors: the historical ceiling for a
purpose-built animal cell in this register is 12.2 × 6.1 m, and anything larger is a
magic-licensed structure in exactly the sense family F established for the airship shed.
**The setting-agnostic test:** `Beast trainers` passes completely (it is mundane by its own text).
`Dragon resident` passes in an unexpected way — delete the magic and you still have a creature,
because the engine itself classes it as geographical rather than magical. Family K therefore ends
the tranche with the observation it opened with: **most of what sits on the Magic shelf is not
magic.**
**ENGINE CONTRACT (read this session, CONFIRMED).** `Beast trainers` infers `institutionNature` =
**`generic`**. `Dragon resident` infers **`vice`**, because the vice row's `/den/` alternative
matches inside "resi**den**t" — the third and last of the tranche's unanchored-substring
mis-inferences (with "War**den**'s Lodge" and "**fort**une tellers"), and the funniest: an
ancient wyrm currently draws a tavern with a bar, a kitchen, a cellar and lodging. Engine-gap G1.
Probability: `Beast trainers` is on the `Adventuring` shelf with no arcane tag or keyword, so it
is not magic-scaled, not hard-zeroed, and **not struck at `magicExists === false`** — one of the
four survivors, and correctly so. `Dragon resident` is on the `Exotic` shelf and is therefore
STRIPPED by `filterCatalogForMagic` at magic=0 (the shelf test `c === 'exotic'`) — but it is NOT
struck by `institutionProbability`'s L302 gate, because its authored `tags` are empty, so
`institutionCatalogArcaneTag('dragon resident')` returns MUNDANE and the name-keyword fallback is
never reached. **The consequence, stated plainly and labelled: a dead-magic metropolis can still
GENERATE a Dragon resident, while the institutional grid and the store selector will not show the
row to a user configuring that world.** That is a divergence between the generation gate and the
UI gate, it follows directly from the code as read, and this dossier reports it as an
observation rather than a defect — because `NON_MAGIC_EXOTICS` says the exemption is deliberate,
and a dragon surviving a dead-magic world is arguably the correct world-fact. The UI half is the
part that looks wrong. Recorded at §Σ as G6 for the owner.


---

## §15 · THE CONTINENTAL AND NON-EUROPEAN REGISTER — where the European base is parochial, and the setting-agnostic law that governs the borrowing

**THE LAW, STATED BEFORE THE EVIDENCE.** The product is SETTING-AGNOSTIC (owner boundary 6,
`product-scope-boundaries.md`): it targets any medieval-inspired campaign, up to and including a
world with no geology. The morphology this dossier researched is `EUROPEAN_FANTASY_BASE`, which
means the European material is a BASE and not a norm. Everything below is therefore an ANALOGUE
— a bounded possibility offered to a culture dial — and never a prevalence prior; this dossier
mints no probability from any of it, and it describes buildings and never beliefs, exactly as it
does for the European material. The deity doctrine applies with full force here: a hermitage is a
siting decision and a room, and this section says nothing about what anyone in it thought.

**§15.1 · The observatory: the European register is the LATE one, and by a wide margin.** Family
A established that before Tycho the European observatory was a top room, a balcony or a leads.
The Islamic and Indian registers had purpose-built observatories for three hundred years before
Uraniborg and built them at a scale Europe never matched. **The Ulugh Beg observatory at
Samarkand (from 1420s)**: "the circular main building had a diameter of about 46m and three
stories reaching a height of approximately 30m above ground level, making it one of the largest
observatories in the pre-modern era"; its main instrument, the Fakhrī sextant, had "a radius of
40.04 meters, which made it the largest astronomical instrument in the world of that type",
"embedded in a trench about two metres wide, and dug into a hill in the plane of the meridian" —
with a second account giving "a trench 8 ft (2.5 m) wide and 36 ft (11 m) deep at its lowest
point"; on the arc, "divisions of 70.2 cm represented one degree, while marks separated by
11.7 mm corresponded to one minute and marks only 1mm apart represented five seconds"; and the
design "closely followed that of the Maragha observatory (built in 1259) in Tabriz"
(CONFIRMED-digest, 2026-08-23, of the Wikipedia, UNESCO astronomical-heritage and Perth
Observatory pages returned in that round; none was opened).
**Number audit, performed, and it is the strongest internal check in this dossier.** A sextant
of radius 40.04 m has an arc of 40.04 × π/180 = 0.6988 m per degree, i.e. **69.9 cm against the
stated 70.2 cm**; one minute is 69.9/60 = 1.165 cm against the stated **11.7 mm**; five seconds
is 1.165/12 = 0.97 mm against the stated **1 mm**. Three figures derived from one radius, all
three matching to within half a percent. The figures are internally consistent and almost
certainly transcribed from a real instrument rather than repeated loosely. The one conflict — a
trench "about two metres wide" against "8 ft (2.5 m) wide" — is reported unreconciled.
**The Jantar Mantar at Jaipur (1728–1734, Sawai Jai Singh II)** is the same idea a further three
centuries on and it is the type's purest expression: "a collection of 19 astronomical
instruments", of which the Samrat Yantra is "27.4 m in height" with a gnomon rising to "22.6
meters (74 feet)", "oriented due north at an angle corresponding to Jaipur's latitude", the
shadow moving "1mm per second (6 cm per min)" and the instrument reading "to the precision of two
seconds" (CONFIRMED-digest, 2026-08-23; the jantarmantar.org, Wikipedia and Architectuul pages
were not opened).
**What travels, and what does not.** The MECHANISM travels and the style does not (DWR1A's
mechanisms-travel law): **an observatory's plan is a function of its instrument's radius, and
above a certain radius the instrument stops being furniture and becomes MASONRY.** Uraniborg's
3.2 m sextant is a fixture in a room; Ulugh Beg's 40 m sextant is a trench in a hill with a
building wrapped round it; the Samrat Yantra is a building that IS an instrument, with no
interior at all. That is a three-rung ladder the DW grammar can hold with the machinery families
A and F already asked for (`fixture.sizesCell`, `Structure` with no cells), and it means a
high-magic or high-learning world in a non-European culture register should get the TRENCH and
the MASONRY INSTRUMENT rather than a bigger version of the European tower.

**§15.2 · The madrasa and the college.** R-INST-3 family L owns the collegiate parti and its
continental and Islamic comparanda; this dossier does not duplicate that research and did not
search for it. What family C's evidence adds by pointer is the CIRCULATION contrast, which is
worth stating as a hypothesis for R-INST-3 or P1c to test rather than as a finding: the English
college distributes by vertical staircase-and-sets with no corridor (CONFIRMED-digest, family C),
while the courtyard madrasa distributes by an ARCADED COURT to cells opening directly off it —
horizontal, single-storey or two-storey, and entirely exterior. If that holds, the two are
opposite solutions to one problem and the culture dial between them is a genuine grammar fork.
**Marked PLAUSIBLE and OWED, not asserted** (ledger L.11).

**§15.3 · The alchemical laboratory: two settings, and both are sited rather than designed.**
Chinese external alchemy (*waidan*) was practised "in diverse settings, ranging from
state-sponsored imperial workshops to secluded private hermitages, with imperial facilities in
the capital Chang'an supporting court-sponsored alchemy during the Tang dynasty"; the private
hermitages were "often situated in remote mountains for isolation and access to natural
ingredients", the named instance being Maoshan, where Tao Hongjing worked "in a sponsored
hermitage" (CONFIRMED-digest, 2026-08-23, of the Grokipedia/Wikipedia *Waidan* pages and the
Encyclopedia MDPI Chinese-alchemy entry; none was opened). The materials — cinnabar, realgar,
mercury, sulphur, arsenic — are the same hazard class family B typed for Europe, and they imply
the same fume, fire and waste requirements.
**The structural finding is the SITING FORK, and it is exactly Libavius against Brahe in another
hemisphere.** Two settings, both attested: the STATE WORKSHOP in the capital, and the REMOTE
MOUNTAIN HERMITAGE chosen for isolation AND for ingredient supply. Family B found the same fork
in Europe — Libavius's chemical house "incorporated into the town" against what he called the
"aristocratic seclusion of Uraniborg" — which means **the town-versus-seclusion axis for the
alchemical laboratory is attested independently in two unconnected traditions, and is therefore a
much better candidate for a real generator axis than anything this dossier could have inferred
from one register.** Recorded as the section's headline transfer.

**§15.4 · The hammam, the coffee house and the parlour.** R-INST-4 family E researched the
hammam in full (the camekan / soğukluk / hararet sequence, the külhan behind the hot wall, the
double hammam for gender, Pristina's c. 800 m²) and this dossier borrows nothing from it except
one line of descent that family H needs: **the consumption parlour arrives in Europe from
Istanbul by way of Venice.** The coffee house whose long table and payment kiosk family H used as
the `Dream parlors` analogue is an Ottoman institution naturalised in the seventeenth century, so
the "parlour" type's ancestor is the same building culture that produced the hammam's camekan —
a large, low, communal room off a controlled entrance. That is a pointer, not a finding, and it
is PLAUSIBLE.

**§15.5 · The funduq, the han and the fondaco.** Family J's fondaco is the WESTERN end of a
continuous institution whose Arabic name (*funduq*) gave it the European one and whose Ottoman
form (*han*) R-INST-2 family N researched with measured figures (Sultanhanı, Koza Han). **The
English register is the parochial one for this family and the mechanism travels from the
Mediterranean and the Levant westward**, which is the mirror image of families A and I, where the
English material is rich and the mechanism travels the other way. The transferable law is the
one family J stated: a host state houses a foreign nation in ONE controlled compound with one
gate, a courtyard, bonded storage below and lodging above, and an officer of the host at the
threshold. It is attested from Alexandria to Venice to the Thames, and a settlement generator can
apply it to any foreign body a world has, planar or otherwise.

**§15.6 · The animal house and the beast.** Not researched outside Europe this session, and the
gap is named rather than filled: the Islamic and Central Asian falconry traditions, the Indian
elephant stable (*pilkhana*), the Chinese imperial parks, and the Mesoamerican menageries are all
building programmes this dossier did not touch. Family K's one measured cell (12.2 × 6.1 m) is
therefore a EUROPEAN bound only, and a culture register with a working elephant tradition would
push it. Ledger L.12.

**§15.7 · Two general statements this section is confident enough to make.**
First: **in every one of the tranche's practice families, the non-European register is EARLIER
and LARGER than the European one, and the European register's distinguishing feature is that it
IMPROVISED.** The observatory was a top room in Oxford and a 46 m building in Samarkand; the
laboratory was a palace cellar in Denmark and a state workshop in Chang'an; the foreign-merchant
compound was a Venetian import from Alexandria. That is a strong argument for the culture dial to
be a real generator input for this tranche rather than a cosmetic one, and it is an argument the
setting-agnostic law already anticipated.
Second, and it is the constraint on the first: **none of this licenses a "culture pack" of
alternative rooms.** The rooms are the same rooms — a working chamber, a store, a threshold, a
court, a stair. What changes across every one of these registers is SCALE, SITING and
CIRCULATION, which are three parameters the grammar already needs for other reasons. The
correct expression of the culture dial for this tranche is therefore a weighting over EXISTING
partis and buckets, and not a second vocabulary. That is the setting-agnostic law arriving as an
engineering recommendation rather than as a prohibition.


---

## §Σ · FINDING → DW-LAW MAP over all NINE founding laws, the ENGINE-GAP FLAGS, and the 32-ENTRY VERDICT TABLE

### §Σ.1 · The law map (charter §2's nine laws, each with the entries that ground it and the entries that stress it)

**LAW 1 — FUNCTIONS, NOT ROOMS.** *Grounded by:* family K's mews, which became a stable in 1548
with no change to the building — one requirement roster (stall, hard floor, drain, two doors,
feed store), two occupants, ninety years apart. That is law 1 confirmed by an external
counterexample rather than by assertion, and it is the tranche's cleanest endorsement of the
charter. *Stressed by:* family G, where a workforce with no needs strips the roster to a place to
stand — the floor function set can be ONE function, and law 3 must accept that. *Consequence:* the
institution→parti mapping should run through the roster, never through the occupant's name;
family K's conversion is the pin that would catch a violation.

**LAW 2 — THE THREE-CLAMP CEILING.** *Grounded by:* family A's ladder, where the ceiling is a
royally funded island precinct and the floor is a work corner in a cottage — the same institution
at both ends, clamped by patronage. *Stressed by:* family F's airship shed, whose 55.3 m clear
width and 37.2 m clear height are beyond any pre-industrial construction; the parcel clamp and
the economy clamp cannot bound it because the INSTITUTION's ceiling is not the constraint,
STRUCTURE is. *Consequence:* a fourth clamp is implied and it is already half-present in the
engine — `magicLicense`. A `clearSpan: EXTREME` bucket that is licensed by the magic dial is the
tranche's recommended mechanism for letting a high-magic world look different WITHOUT a magical
room vocabulary: **the rooms stay the same and the spans change.**

**LAW 3 — THE FLOOR IS EXISTENCE.** *Grounded by:* families E, F(network), H and K, four
institutions whose honest floor is NO CELL AT ALL — a marked ground, a hired chamber, a canvas
booth, a perch in somebody's hall. *Stressed by:* the same four. *Consequence, and it is a
validator requirement rather than a nicety:* **S9's lawfulness walker must be able to certify a
plan with zero cells, and a plan with zero STORAGE cells, as LAWFUL** — with a stated reason —
rather than failing them. Otherwise the generator will invent a hut for a stone circle and a
pantry for a golem shed. R-INST-4's water family reached the zero-storage half of this
independently.

**LAW 4 — DERIVE, DON'T STORE.** *Grounded by:* family H's `permanence: TEMPORARY` booth and
family I's `seasonalOccupancy` lodge, both of which law 4 handles for free — a plan that is
simply not derived outside its season needs no new machinery. *Consequence:* the PROJECTION layer
(DW-6) needs to be able to say "empty this month", which is a pane question, not a geometry one.

**LAW 5 — STABLE ANCHORS.** *Grounded by:* family B's furnace NICHE, the best fossil the corpus
has found — a countable, dateable subdivision of wall thickness whose blocking records the year a
process stopped; and family A's Uraniborg, where five ovens MIGRATED from the cellar into the
parlour and the migration is dated. *Consequence:* two new fossil kinds — the blocked recess, and
the fixture that moved. And one new generator rule the evidence supports directly: **when a
process requires continuous attendance and its cell is not adjacent to the living cell, place a
duplicate fixture subset in the living cell and record it as a dated renovation.** Also from
family K: an OCCUPIED structure's modifications (a widened opening, a broken roof) are law-5
fossils running forward, which is how a resident dragon gets a plan without a building.

**LAW 6 — FRONTAGE FROM THE PARCEL.** *STRESSED HARDEST OF ALL NINE, by four families.* The
collegiate court faces its quadrangle and shows the street a wall with one gate (C); the moated
lodge has no street frontage and is entered by a causeway (I); the fondaco shows the street one
gate and takes its goods off a canal loggia (J); the henge's "frontage" is a 20 m causeway
through a bank (E). *Consequence:* the frontage reader must accept an INTERNAL COURT, a CAUSEWAY
or a TRANSPORT EDGE as the frontage surface, with the street reduced to a single typed joint. And
family J adds an orthogonal driver law 6 does not have: a VERTICAL FUNCTION GRADIENT set by the
transport frontage rather than by status — store at quay level, administration above, lodging at
the top.

**LAW 7 — BASEMENTS ARE THE UNDERCITY'S PROJECTION.** *Grounded by:* family E's "hidden grove
beneath the streets", whose verdict this dossier makes CONDITIONAL on the undercity graph
anchoring it — the first verdict in the corpus that depends on another train's data, and exactly
what law 7 was written for. Also family B's cellar laboratory and its OUTSIDE-THE-BUILDING waste
vault; family G's below-grade ergastulum and charnel; family A's vaulted undercroft with chambers
off. *Stressed by:* family I's made platform, where the moat's spoil forms the ground — **a raised
platform argues against a cellar, and the undercity graph should not anchor one under made
ground.** A small, concrete, checkable interaction between parcel history and law 7.

**LAW 8 — THE PARTI DRAW.** *Grounded by:* the tranche's fourteen proposed partis, every one of
which is a historical form rather than an arcane invention. *Stressed by:* three entries that are
ZONINGS rather than buildings (`Alchemist quarter`, `Mages' district`, and the district-shaped
reading of `Planar traders`) and by two that are PRECINCTS — several buildings, one institution,
one parcel (`Academy of magic`, and Uraniborg as family A's ceiling). *Consequence:* the parti
draw needs two record shapes beside the building: a `zoning` that generates N buildings on
adjacent parcels, and a `precinct` that holds several buildings as one institution. **Drawing a
zoning as one large building is the single most visible error the DW generator could make on this
tranche.**

**LAW 9 — VERTICAL HONESTY.** *Grounded by, and this tranche is its main supplier:* family A's
`ONE_CELL_PER_STOREY` tower, where the vertical partition is not a division of a height envelope
but the organising FORM; the stair in the 4.15 m wall thickness (so a WALL can carry cells);
ACCESS-BY-DEPTH-OF-CLIMB as the tower's substitute for a corridor; family D's three-to-five-storey
burgage shop-house with the household over the trade; family J's three-band vertical gradient;
and family F's 61 m mooring mast with one platform and no rooms at all. *Consequence:* a vertical
parti class whose cell count IS the storey count; a `privacyDepth` per cell derived from the stair
grammar; and a `Structure` record for a construction that has a section but no plan.

### §Σ.2 · ENGINE-GAP FLAGS — six DEFECTS proved by reading the live code this session, then the grammar requests

**Each defect below was established by reading the named file in the clean tree
`chair-baseproof-b10ed1a1` and, where stated, by executing a simulation over the roster. None is
proposed as a fix: catalog edits and behaviour changes are owner-gated.**

**G1 — THREE UNANCHORED-SUBSTRING MIS-INFERENCES, all three in this tranche.**
`src/domain/spatial/cohesionWeave.js` `FACET_INFERENCE` (L258–276) matches its keywords with bare,
unanchored regex alternatives over `name + type + category`. Consequence, executed this session
over the 32 roster NAMES (`RINST5-facetsim.cjs`, node):
`Warden's Lodge` → `vice` (the `/den/` alternative inside "War**den**'s") — a ranger station draws
the TAVERN template;
`Dragon resident` → `vice` (inside "resi**den**t") — an ancient wyrm draws a tavern with a bar, a
kitchen, a cellar and lodging;
`Charlatan fortune tellers` → `security` (the `/fort/` alternative inside "**fort**une") — a
fairground booth draws the BARRACKS template with a weapons rack.
**The estate has already fixed this exact class in the sibling detector and recorded why**:
`arcaneInstitutionIdentity.js` anchors every keyword at `\b` because "mage" sits inside
"PILGRIMAGE", and its header says the census caught it live. The anchoring was never carried
across to `FACET_INFERENCE`. Families I, K, H.

**G2 — FOUR ROWS CARRY `minTier: 'metropolis'` WHILE SITTING IN THE `city` BLOCK.**
`Dream parlors (high magic)`, `Airship docking (high magic)`, `Message network (high magic)` and
`Dragon resident` are all authored inside `institutionalCatalog.city.Exotic` and all four carry
`minTier: 'metropolis'`; `assembleInstitutions.js:256` skips any row whose `minTier` outranks the
tier index. The metropolis catalog merges the city block (`mergeCatalogs(city, metropolis)`), so
the rows DO fire at metropolis — but they can never fire at their own tier, which makes their
presence in the city block a no-op and their `baseChance` values misleading to a reader. Note
also that the name says magic and the record says POPULATION: neither gate is declared on the
entry. Families F, H, K.

**G3 — A MUNDANE CHEMICAL TRADE IS DELETED BY A DEAD-MAGIC WORLD.** `Alchemist shop` (town) and
`Alchemist quarter` (city) carry `tags: ['arcane','alchemy']`, both of which are in
`ARCANE_INST_TAGS`. At `magicExists === false` they are struck by `institutionProbability`'s L302
gate and by `magicFilter`'s UI strip. Family B's evidence is that the alchemist's shop is a real
building housing a real trade — furnaces, reagents, assay, waste — that needs no magic whatever,
and R-INST-2's apothecary survives because it sits on the Crafts and Economy shelves. A
dead-magic world therefore loses its chemical trade and keeps its apothecary, which is an
authoring accident rather than a design. Family B.

**G4 — THE ADVENTURERS' CHARTER HALL'S SHELF ARTEFACT, and it has TWO live behaviours.** The row
sits on the **Magic** shelf at hamlet (L310) and village (L819) and on the **Adventuring** shelf
at town (L1394). (1) `filterCatalogForMagic` strips a row whose shelf is `magic` or `exotic`, so
at `magicExists === false` or `priorityMagic === 0` **the hamlet and village halls vanish and the
town hall survives**. (2) `institutionProbability`'s magic multiplier fires on
`cat.includes('magic')`, so **the hamlet and village rows are multiplied by `priorityMagic/50`
and by the tier penalty (0.25 and 0.40) and the town row is not multiplied at all** — a frontier
hamlet is markedly less likely to have a bounty hall in a low-magic world than in a high-magic
one, for a reason nobody authored. The intended driver, the monsterThreat gate (×5 plagued, ×3
frontier, ×0.3 otherwise), is partially masked by it. Family I.

**G5 — THE GREAT LIBRARY'S SHELF REACHES THE GENERATION MULTIPLIER.** Authored `tags:
['education','education']` (duplicated in source), shelf `Magic`. `institutionCatalogArcaneTag`
returns MUNDANE, so L302's `magicExists === false` gate does NOT strike it — but
`magicFilter.isArcaneInst` strips it at magic=0 twice (shelf, and the literal `'great library'`
in `ARCANE_INST_KW`), and `institutionProbability`'s multiplier fires on `cat.includes('magic')`.
**The region's largest repository of knowledge is therefore rarer in a low-magic metropolis and
hidden from the institutional grid in a dead-magic one.** `arcaneIdentity.js`'s header records the
tag-versus-keyword divergence and calls it unobservable because the strip runs upstream of every
consumer of THAT module; this dossier notes without contradicting it that the generation step
reads `institutionalCatalog[tier]` raw, so the multiplier is a path the strip does not cover.
Family J.

**G6 — DRAGON RESIDENT DIVERGES BETWEEN THE GENERATION GATE AND THE UI GATE.** Authored `tags: []`,
shelf `Exotic`, and explicitly exempted from the magic scaling by
`NON_MAGIC_EXOTICS = ['dragon resident','underground city']` with the code comment "geographical,
not magical". Consequence: a dead-magic metropolis can still GENERATE the row (the L302 gate does
not fire, because the catalog index reads it MUNDANE), while `filterCatalogForMagic` hides it from
the institutional grid and the store selector (shelf `exotic`). The generation half is arguably
the correct world-fact and this dossier does not call it a bug; the UI half is the part that looks
wrong. Family K.

**G7 — THREE OF THE ELEVEN HARD-ZERO KEYWORDS MATCH NO CATALOG ROW.** `institutionProbability`'s
`hiMagicInsts` list contains `'magical banking'`, `'magic item consignment'` and
`'enchanting quarter'`; an awk pass over all 311 rows of the flat table, executed this session,
returns ZERO name matches for each. `'Magic item consignment'` is a member of `magicFilter`'s
`ARCANE_GOODS` array, so a GOODS vocabulary has leaked into an INSTITUTION gate. Harmless today
and a trap tomorrow: a future row named "Enchanting quarter" would be hard-zeroed below
`priorityMagic` 66 while "Alchemist quarter" and "Enchanter's shop" are not. Families B, D.

**G8 — THE INTERIOR VOCABULARY CANNOT EXPRESS THIS TRANCHE.** `interiorTemplates.js` has eight
`INTERIOR_KINDS`, 28 `ROOM_KINDS` and 22 `FURNISHING_KINDS`, and none of them is arcane — which is
correct and should stay so. But the tranche's SOURCED, MUNDANE cells are also missing: there is no
room kind for a furnace room (the nearest, `kiln`, carries only `hearth` and `brazier`), a
laboratory, a preparation room, a yard, a courtyard, a gallery, a gatehouse or porter's lodge, a
stable, a mews, a den, a service passage, a charnel, an observing platform or a site of any kind;
and no furnishing kind for an athanor, a reverberatory furnace, a niche, a ring table, a
condenser loop, an alembic, a cupel tray, a sloping desk, a pigeonhole rack, a display board, a
shutter-counter, a perch, a manger, a trough, a drain, a wide door, a tether ring, a bone stack, a
standing stone, a gate, a well, a signal mount, a telescope or a mooring ring. Across the eleven
families this dossier records HOME hits for roughly a third of its proposed functions and NO
TYPED HOME for the rest; family D is the best served (seven of nine) and family E the worst (zero
of seven, because the interior grammar has no concept of a building-less institution). Every
family's (f).

**Grammar requests, consolidated — fourteen things the DW machinery must be able to express, each
with the families that demand it.**
R1 **OCCUPATION**, an institution whose plan is another building's plan plus added cells and a
changed control (E, G, J, K — four independent arrivals; the tranche's largest request).
R2 **`zoning`** as an institution kind generating N buildings on adjacent parcels (B, C, F, J).
R3 **`precinct`**, several buildings as one institution on one parcel (A, C).
R4 **`Site`** and **`Structure`** records beside `FloorPlan`, and a walker that certifies a
zero-cell plan as lawful (E, F, H, K).
R5 **`flueCount`** with the arm `furnaces ≤ flues + portableFurnaces` (B, and every furnace family
in the corpus).
R6 **`RECESS`**, a countable fixture occupying wall thickness — the corpus's best fossil (B, G).
R7 **`apertureFor` and `strengthFor` keyed to the OCCUPANT**, plus the TWO-DOOR rule (F, G, K).
R8 **`frontage: OPEN_SHOPFRONT | DOOR | GATE_PASSAGE | COURT | CAUSEWAY | TRANSPORT_EDGE`**, and
law 6's inversion for a precinct (C, D, I, J).
R9 **`joint.refused` and the general store prohibition**: a store whose contents the occupant
would consume, burn, spoil or escape through gets NO internal door (B fuel, G bodies, K feed —
three independent arrivals).
R10 **`apertureUse: LIGHT | VENT | PROCESS_LOOP`**, and `lightDemand` that can say LESS as well as
more, with a recorded REASON (B, D, H, K).
R11 **`sightLine{sky|terrestrial}` and `prospect`** as parcel-selection inputs in S1 (A, F, I).
R12 **`permanence` and `seasonalOccupancy`** as temporal parti properties (H, I).
R13 **`magicLicense: NONE | LOW | MEDIUM | HIGH`** declared per entry, in the four tokens
`getMagicLevel` already emits, with `clearSpan: EXTREME` as its structural consequence (all
families; §1.6, §1.7).
R14 **`socialTolerance`** read from the existing faction and stressor machinery, so "Controversial"
stops being prose (G; the finite-semantics law's own requirement).

### §Σ.3 · THE VERDICT TABLE — all 32 entries

`B` = BUILDING (its own parti) · `H` = HOSTED (named host) · `N` = NO_BUILDING · `Z` = zoning ·
`O` = occupation of an existing structure. Where two appear, the first is the floor and the second
the rung wealth buys.

| # | Tier | Line | Entry | Fam | Verdict | Parti | magicLicense | HOME |
|---|---|---|---|---|---|---|---|---|
| 1 | hamlet | L303 | Traveling hedge wizard | A | **N** | none (a travelling fixture set) | LOW | — |
| 2 | hamlet | L310 | Adventurers' charter hall | I | **H** (alehouse / largest barn) | R-INST-1 CHARTER_HALL at higher tiers | NONE | hall |
| 3 | village | L804 | Hedge wizard | A | **H** (own dwelling) | PRACTITIONER_CORNER | LOW | — |
| 4 | village | L812 | Druid Circle | E | **N** (a SITE) | OPEN_ENCLOSURE | LOW | none in ROOM_KINDS |
| 5 | village | L819 | Adventurers' charter hall | I | **B** | R-INST-1 CHARTER_HALL | NONE | hall / chamber / records |
| 6 | village | L826 | Healer (divine, 1st level) | A | **H** (church, priest's house, own cottage) | threshold cell only | LOW | quarters (via `heals`) |
| 7 | town | L1340 | Wizard's tower | A | **B** | TOWER_ONE_ROOM_PER_FLOOR | MEDIUM | study / chamber / cellar |
| 8 | town | L1349 | Elder Grove Council | E | **N** grove + **H** council; **B** below-grade IFF the undercity graph anchors it | WALLED_GARDEN_CONCEALED | LOW | none |
| 9 | town | L1356 | Alchemist shop | B | **H** → **B** | SHOPHOUSE_WITH_BACK_PROCESS | **NONE** | workfloor / store / cellar |
| 10 | town | L1364 | Warden's Lodge | I | **B** (periodically occupied) | LODGE_THREE_BAY → MOATED_PLATFORM_COMPOUND | **NONE** | hall / chamber / store |
| 11 | town | L1371 | Teleportation circle | F | **H** (inside another compound) | CONTROLLED_CHAMBER | HIGH | chamber / records |
| 12 | town | L1394 | Adventurers' charter hall | I | **B** | R-INST-1 CHARTER_HALL | NONE | hall / chamber / records |
| 13 | town | L1401 | Charlatan fortune tellers | H | **N** (booth on the ground) | BOOTH_TEMPORARY | **NONE** (the catalog says so) | — |
| 14 | town | L1408 | Beast trainers | K | **H** (R-INST-2's stable) → **B** | YARD_RANGE_ANIMAL | **NONE** | cells / store / quarters |
| 15 | city | L1882 | Wizard's tower | A | **B** ×N (a count, not a new parti) | TOWER_ONE_ROOM_PER_FLOOR | MEDIUM | study / chamber / cellar |
| 16 | city | L1891 | Mages' guild | C | **H** → **B** | CHAPTER_HALL → COLLEGIATE_COURT | MEDIUM | hall / chamber / records |
| 17 | city | L1899 | Alchemist quarter | B | **Z** | N × SHOPHOUSE_WITH_BACK_PROCESS | **NONE** | (per building) |
| 18 | city | L1907 | Enchanter's shop | D | **H** → **B** | SHOPHOUSE_SECURE | HIGH | stall / workfloor / counting / strongroom |
| 19 | city | L1915 | Scroll scribe | D | **N** → **H** → **B** | STALL_OR_BOARD → SHOPHOUSE_OPEN_FRONT | MEDIUM | stall / workfloor / store |
| 20 | city | L1923 | Teleportation circle | F | **B** | CONTROLLED_CHAMBER in a walled compound | HIGH | chamber / records / muster |
| 21 | city | L2110 | Multiple adventurers' guilds | I | **B ×N** with mutual repulsion | R-INST-1 CHARTER_HALL | NONE | hall / counting / strongroom |
| 22 | city | L2141 | Planar traders | J | **H** → **B** → **Z** | FONDACO_COMPOUND | HIGH | store / records / lodging |
| 23 | city | L2149 | Dragon resident | K | **O** (ruin, cistern, amphitheatre, quarry, undercity void) | none — a place-claim | **NONE** (engine agrees: NON_MAGIC_EXOTICS) | — |
| 24 | city | L2157 | Golem workforce | G | **H** → **B** | YARD_RANGE_ANIMAL / BAY_RANGE | HIGH | store / workfloor / quarters |
| 25 | city | L2164 | Undead labor | G | **H** → **B**, + **O** of an existing charnel | SHED_RANGE / SECURED_UNDERCROFT | HIGH | cellar / store / cells |
| 26 | city | L2171 | Dream parlors (high magic) | H | **H** → **B** | PARLOUR_ROOM | HIGH | common / kitchen / cellar |
| 27 | city | L2179 | Airship docking (high magic) | F | **B** (a STRUCTURE, no interior) | MOORING_MAST → GREAT_SHED | HIGH | store only |
| 28 | city | L2187 | Message network (high magic) | F | **N** as a network; **H** per station → **B** | STATION_ROOM_WITH_MOUNT | HIGH | chamber / lodging |
| 29 | metro | L2332 | Academy of magic | C | **B (PRECINCT)** | ACADEMY_PRECINCT | HIGH | hall / stacks / reading / study / chamber / kitchen |
| 30 | metro | L2340 | Mages' district | C | **Z** | SPECIALIST_QUARTER{arcane} | HIGH | (per building) |
| 31 | metro | L2348 | Great library | J (boundary) | **B** — parti is **R-INST-3 family M's** | (R-INST-3) | **NONE** (authored `education`) | reading / stacks / study |
| 32 | metro | L2356 | Planar embassy | J | **B** — ASSIGNED_PALACE by default | ASSIGNED_PALACE → FONDACO_COMPOUND | HIGH | store / records / armory / counting / lodging |

**Tally, counted off the table above rather than from memory.** BUILDING as the top rung: **21**
(rows 5, 7, 9, 10, 12, 14, 15, 16, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 31, 32), plus row 8
conditionally. NO_BUILDING at every rung: **3** (rows 1, 4, 13), plus the grove half of row 8.
HOSTED as the floor or as the only verdict: **14** (rows 2, 3, 6, 9, 11, 14, 16, 18, 19, 22, 24,
25, 26, 28). ZONING: **2 outright** (17, 30) plus row 22 at its ceiling. OCCUPATION: **1 outright**
(row 23) plus **2 partial** (rows 8, 25).
`magicLicense` distribution: **NONE 11** (rows 2, 5, 9, 10, 12, 13, 14, 17, 21, 23, 31) ·
**LOW 5** (1, 3, 4, 6, 8) · **MEDIUM 4** (7, 15, 16, 19) · **HIGH 12** (11, 18, 20, 22, 24, 25, 26,
27, 28, 29, 30, 32). 11 + 5 + 4 + 12 = 32, which checks.
**Not one of the 32 is a REQUIRED row at any tier**: the whole magical leg is optional content,
which is itself a finding — the arcane is a settlement's discretionary spend, and the engine's
tier penalty already says so.

---

## §L · THE OPEN-QUESTIONS LEDGER — 54 numbered items, built by script over this dossier's own marker sentences

**Construction, so the count can be audited.** A python pass over `sec-1`, `sec-A`…`sec-K`,
`sec-15` and `sec-sigma` extracted every sentence carrying one of eight markers — NOT FOUND,
PARTIAL, a `ledger item L.n` reference, OPEN, a blocked-source token (GATED / 403 / 303 /
ENOTFOUND), "number audit", "contested"/"conflict", and the DERIVED-and-flagged bucket
statements — and wrote them to `RINST5-merge/ledger-extract.txt`. **The extract holds 69 marker
sentences.** The buckets below are composed over that extract and over the call log
`RINST5-merge/calls.tsv`, not from memory, which is what makes the ledger complete by
construction rather than by recollection. The twelve inline `L.n` pointers planted in the family
sections map to items 1–12 below.

### §L.1 · Grammar-load-bearing figures that stayed OPEN (items 1–5)

1. **No measured spiral stair anywhere in the tranche** (family A, inline L.1). The wizard's tower
   is the corpus's VERTICAL specimen and this dossier has no stair diameter, tread dimension,
   riser height or headroom for a vice at any status. The bucket in A(f) (1.0–1.5 m external
   diameter) is DERIVED. Targets: the Chester repository thesis on the vice, and the academia.edu
   paper "Internal Stairs in Domestic English Vernacular Buildings (1200–1650)"; neither opened.
2. **Libavius's room list for the `domus chymici` of 1606** (family B, inline L.2). The one
   designed purpose-built laboratory building in the European record, and this dossier has only
   its organising principle (a central hall with privacy graded along one axis) and its siting
   argument. Every room name is missing. Targets: Newman's chapter (403), the Oxford *cabinet*
   entry (host unresolvable), and *Alchymia* 1606 itself.
3. **No measured European alchemical laboratory of any kind** (family B). No room size, furnace
   footprint, flue bore, bench height or fuel-store volume. The niche and ring-table buckets in
   B(f) are DERIVED.
4. **No measured collegiate figure** (family C, inline L.4). Quadrangle plan dimensions, chamber-
   set room sizes, sets per staircase, staircase width, hall span, gatehouse passage width — all
   absent. R-INST-3 family L may already hold some; the cross-check was not run.
5. **No measured shop plan for the scroll scribe or the enchanter** (family D, inline L.5). The
   family inherits R-INST-2's burgage and shop-house buckets by pointer. Target: Schofield,
   *Medieval London Houses*.

### §L.2 · Discrepancies carried with BOTH sides (items 6–11)

6. **Uraniborg's footprint: 15 m or 16 m.** Wikipedia (opened) says "about 15 meters on a side";
   the round-1 digest says "16m x 16m, with a 19m tower and two small round towers … of 6m
   diameter". Reported as a RANGE of 15–16 m, with the tower height and rotunda diameter
   digest-grade only.
7. **Avebury's bank: 17 m or 6 m.** English Heritage (opened) gives an original height of "nearly
   55 feet (17 metres)" and a present height of 4.2–5.4 m; the digest gives "as much as 6 meters".
   Reconciled by this lane as 17 m measured BANK CREST TO DITCH FLOOR versus 6 m above the old
   ground surface — arithmetic shown in E(a), the reconciliation labelled PLAUSIBLE, and the
   variant "10 to 14 meters deep" for the ditch set aside as unreconcilable.
8. **Avebury's stone spacing: 11 m or 25 m.** Scoped rather than averaged — c. 11 m within the
   circles (English Heritage), c. 25 m along the West Kennet Avenue with c. 15 m across it
   (digest).
9. **Cardington's two dimension sets.** 1917 metric (213.4 × 55.3 × 37.2 m) against post-1926
   imperial (812 × 180 × 158 ft). Audited in F(a) and shown to be ONE building at TWO dates; both
   sets are retained with their dates attached.
10. **The Ulugh Beg trench: 2 m or 2.5 m wide.** Two digests disagree; reported unreconciled
    (§15.1).
11. **The Tower menagerie's founding: 1235 or 1330.** Reconciled by this lane as a formal
    constitution of an existing collection; the reconciliation is PLAUSIBLE and the conflict is
    reported rather than resolved (K(b)).

### §L.3 · Figures resting on a search digest only — never opened, never quotable as primary (items 12–24)

12. Every Tattershall Castle figure — five storeys plus undercroft, 33.5 m high, 17.5 × 23.7 m
    base, 4.15 m basement walls, the vaulted undercroft with chambers off. **Both source pages
    were blocked to this lane** (see items 35–36).
13. The spiral-stair fieldwork finding (vices predominate in towers of three or more storeys; the
    vice as a vertical boundary marker).
14. The observatory-was-a-room negation, including the Bainbridge sentence — the family A
    negation's entire evidentiary base is digest-grade.
15. Libavius's central-hall plan principle and the town-versus-seclusion argument.
16. The collegiate staircase-and-sets module and William of Wykeham's New College programme.
17. The Paris book-trade streets and every name and date in them.
18. Goldsmiths' Row: Stow's ten houses and fourteen shops; three-to-five storeys; shopfronts open
    to the light.
19. The druid negation in full — the chronology, the classical-groves statement and Stukeley's
    publishing motive. **The tranche's sharpest single finding rests entirely on digests.**
20. Every Cardington and mooring-mast figure.
21. The ergastulum type description and the Villa of Rufio.
22. The Rothwell charnel's 9 × 4 × 2.5 m and its 2,500 individuals.
23. The Higham and Bradgate lodge figures, and the eminence-and-moat siting law.
24. Every §15 figure: Ulugh Beg, Maragha, the Jantar Mantar, and the waidan settings.

### §L.4 · Searched and genuinely absent — absence-after-search, each a finding (items 25–36)

25. No measured cunning-folk or hedge-practitioner cottage distinguishable from an ordinary
    cottage (family A).
26. No internal room dimension for Tattershall; the external footprint does NOT yield one,
    because the facetted angle turrets are inside it (family A).
27. No standing purpose-built European alchemical laboratory building; every studied laboratory is
    a room, a cellar or a refuse deposit inside something else (family B, inline L.3).
28. No excavated medieval goldsmith's workshop plan with a shop front, a strongroom and a furnace
    (family D).
29. No measurement of a historic-period sacred grove or an urban walled sacred garden (family E).
30. No excavated below-ground urban grove — expected, since the concept is the catalog's own
    (family E).
31. No dimension for a Chappe station BUILDING; the opened page explicitly lacks tower height,
    operator counts, sight-line specifications and section drawings (family F).
32. No historical analogue of any kind for a teleportation circle — the expected null, reported as
    one (family F).
33. No ergastulum cell size; no barrack-cell or stable-bay dimension in this lane's own searches
    (family G, inline L.7).
34. No dimension for a fair booth, a fortune-teller's stall or a consumption parlour; the family's
    one quantitative datum is a price (family H, inline L.8).
35. No courtyard or room dimension for the Fondaco or for any fondaco, han or steelyard; the
    Wikipedia article "lacks comprehensive spatial measurements" (family J, inline L.9).
36. No dimension for the Lion Tower's dens, a mews, a kennel range or a stable bay; a search
    aimed at the 1936–37 excavation returned the ANIMAL REMAINS and said so (family K, inline
    L.10).

### §L.5 · Sources blocked, gated or redirected — a P1c work list, not an absence (items 37–43)

37. **historicengland.org.uk list entry 1215317 (Tattershall) — GATED.** A 5,582-byte Cloudflare
    "Just a moment" interstitial. Per the brief this is NOT a fetch and is labelled accordingly.
38. **britishlistedbuildings.co.uk (the HE mirror) — 403 Forbidden.**
39. **hrp.org.uk (Tower of London menagerie) — 403 Forbidden.**
40. **fulcrum.org (Newman, "The Chemical House of Libavius") — 403 Forbidden.** The single most
    valuable blocked document in the tranche.
41. **cabinet.ox.ac.uk (the Libavius drawing) — ENOTFOUND; the host does not resolve.**
42. **nature.com — 303 to an authentication host.** RECOVERED by `curl -L -A "Mozilla/5.0"`,
    saved as `RINST5-A-uraniborg-lab.html` / `.txt`, and it became the dossier's single best
    source. The recovery route works and is recorded for successors.
43. **link.springer.com (the *Alchemical Laboratories* reference-work entry) — 303 to an
    authentication host.** Not recovered; no curl attempt was made, and one is owed.

### §L.6 · Deliberately not covered, with the reason (items 44–49)

44. **The library as a building** — R-INST-3 family M holds it; this dossier states the boundary
    (family J) and adds only the shelf's mechanical consequences and the restricted-collection
    question.
45. **The collegiate parti, the sacred grove's faith half, the healer's faith half, the moot, the
    charter hall's building, the mint and assay office, the apothecary shop-house, the market
    stall, the stable, the barrack, the fair, the inn, the gaming room, the playhouse, the han and
    caravanserai** — all held by R-INST-1, R-INST-2, R-INST-3, R-INST-4 or DWR1A and cited by
    pointer rather than re-researched. Re-searching a sibling's ground would have spent budget the
    unresearched families needed.
46. **The opium den** as the `Dream parlors` analogue — declined on scope grounds in favour of the
    coffee house, which supplies the same plan without importing a moral frame the catalog does
    not ask for. R-INST-6 owns anything criminal (family H(c)(iv)).
47. **Rudolfine Prague's court workshops, the Italian urban torri, the German university's hired
    rooms, the Sedlec ossuary, the continental menageries, the Stuttgart Marstall, the Steelyard,
    the Islamic and Indian animal houses** — all named as unresearched at the point of use rather
    than glossed over.
48. **The madrasa's circulation** — stated as a hypothesis for R-INST-3 or P1c to test, explicitly
    PLAUSIBLE (§15.2, inline L.11).
49. **The whole below-grade graph** — the hidden urban grove, the ergastulum, the charnel, the
    dragon's undercity void — is the UNDERCITY train's under DW law 7. This dossier types only the
    SURFACE joints and the conditional verdicts.

### §L.7 · What would most change a conclusion (items 50–52)

50. **Libavius's room list (item 2).** If the `domus chymici` turns out to have a corridor, a
    graded suite of named process rooms, or a laboratory larger than its house, family B's
    "one or two rooms" ceiling moves and the whole tranche's most confident size statement moves
    with it.
51. **A measured collegiate plan (item 4).** The staircase-and-sets module is this dossier's
    proposed correction to the charter's own §4 S6 aside about colleges licensing the corridor
    early. A measured plan showing corridors in English collegiate chamber ranges would refute the
    correction, and the correction is currently digest-grade.
52. **Any excavated purpose-built practitioner's building earlier than Uraniborg.** §1.2's
    "the infrastructure of a new practice starts in somebody else's room" is the tranche's central
    structural result and it is built on three negations, all digest-grade. One counterexample
    would not destroy it, but a pattern of them would.

### §L.8 · Weakest links in what IS asserted (items 53–54)

53. **The FACET_INFERENCE mis-inferences are PLAUSIBLE-BY-SIMULATION, not observed live.** The
    regex table was read from the file and simulated over the roster NAMES ONLY
    (`RINST5-facetsim.cjs`, executed). A live institution record also carries `type` and
    `category`, which `inferFacet` concatenates into the haystack; those fields were NOT
    exercised. The `/den/`-in-"Warden" and `/fort/`-in-"fortune" matches cannot be undone by extra
    text — the regexes have no anchors and the alternation is unordered — so the mis-inference
    stands on reading alone; but the exact resolved facet for a LIVE record is one experiment
    away and this dossier has not run it. **The experiment that would settle it: generate a
    settlement containing these three institutions and read `facetOf(inst,'institutionNature')`
    off the live records.**
54. **The charnel density inference.** "A charnel holds 2,500 individuals in 9 × 4 × 2.5 m,
    therefore an undead-labour institution needs a building of size X" is this lane's inference,
    not any source's, and it is the one place in the dossier where a measured figure is used to
    size something the source never measured. Labelled PLAUSIBLE in G(c)(iv) and repeated here so
    it is not lost.


---

## §M · METHOD DISCLOSURE — what actually ran, counted from the call log, not from memory

### §M.1 · Web acts, exact

Counted by `awk` over `RINST5-merge/calls.tsv`, which was written as the lane went and which has
48 rows.

| Act | Count | Budget | Notes |
|---|---|---|---|
| WebSearch | **31** | 45 | 14 unspent |
| WebFetch | **14** | 60 | of which 8 returned 200 |
| `curl -L -A "Mozilla/5.0"` | **2** | (within the fetch budget) | 1 recovered a 303-blocked paper; 1 hit a Cloudflare interstitial |
| Total fetch acts | **16** | 60 | 44 unspent |
| Local executed proofs | **1 logged + 3 unlogged** | — | see §M.3 |

**A CORRECTION, flagged as an event rather than silently fixed.** Two of this lane's RESUME
POINTs recorded "36 WebSearch"; the call log's own tally is **31**. The receipt's earlier figure
was an incremental estimate and the log is the receipt of record. The fetch figures in the resume
points (14 WebFetch, 2 curl) were correct throughout.

**WebFetch outcomes, all fourteen.**
200 OK (8): `en.wikipedia.org/wiki/Uraniborg` · `pmc.ncbi.nlm.nih.gov/articles/PMC7540335/` ·
`ethos.lps.library.cmu.edu/article/id/450/` · `antiquity.ac.uk/projgall/martinon298_` ·
`english-heritage.org.uk/visit/places/avebury/history/description/` ·
`johnhearfield.com/Radar/Chappe.htm` · `en.wikipedia.org/wiki/Fondaco_dei_Tedeschi` ·
`en.wikipedia.org/wiki/Palazzo_Loredan_dell'Ambasciatore`.
403 Forbidden (3): `fulcrum.org` (Newman on Libavius) · `hrp.org.uk` (Tower menagerie) ·
`britishlistedbuildings.co.uk` (the Historic England mirror for Tattershall).
303 to an authentication host, not followed (2): `nature.com` · `link.springer.com`.
Host does not resolve (1): `cabinet.ox.ac.uk`.

**curl outcomes, both.**
`nature.com/articles/s40494-024-01301-6` → HTTP 200, 347,464 bytes, extracted to 53,556
characters of text at `RINST5-A-uraniborg-lab.txt`. **This recovery produced the single
best-sourced passage in the dossier** (the sixteen furnaces, the niches, the ring table, the
spiral stair from the Winter Room, the five migrated ovens, the through-window condensers, the
waste vault) and the route — curl with a browser user-agent after a WebFetch 303 — is recorded
for successors.
`historicengland.org.uk/listing/the-list/list-entry/1215317` → HTTP 403, **5,582 bytes of
Cloudflare "Just a moment" interstitial**. Per the brief this is **GATED and NOT a fetch**, and
every Tattershall figure in the dossier is labelled digest-grade because of it. The byte count is
given so a successor can recognise the same page by size.

### §M.2 · Search discipline actually applied

Multiple angles rather than multiple phrasings: the tower was searched as a building (Tattershall),
as a stair (the vice), and as an observatory (Uraniborg, then the pre-Tycho negation); the
laboratory as a design (Libavius), as an excavation (Oberstockstall), as an institution (Leiden),
and as a null ("no purpose-built…"). **A dedicated NEGATION or counterexample search was issued
for eight of the eleven families** — A (the observatory was a room), B (no purpose-built
laboratory), D (no excavated goldsmith's plan), E (druids did not build stone circles), G (the
ergastulum's contestedness, reached through the type search), I (the lodge was periodically
occupied, reached through the type search), J (the embassy was a rented house), K (the Lion Tower
architecture, which returned animal remains instead). The three families without a dedicated
negation query are **C, F and H**, and each is stated plainly in its own (c): C's negation is
answered from the Inns-of-Court evidence itself, F's from the Chappe page's own "one of the
chambers of ladite maison", and H's from the catalog's own "non-magical" and the fair-booth
sources. That is a real shortfall against the brief's per-family rule and it is recorded here
rather than glossed.
**Stopping rule.** Every family stopped when two consecutive rounds added nothing, and the family
sections say which rung each stopped at. Families C, D, G, H and K stopped at the MEASUREMENT
question with the owed item named, and are marked PARTIAL for measurement in §0.3 and in §L.

### §M.3 · Local executed proofs (no network, all re-runnable)

1. **`RINST5-facetsim.cjs`** (node, 6,084 B, written and executed this session). Transcribes
   `FACET_INFERENCE`'s two tables, `magicFilter`'s `ARCANE_INST_TAGS`/`ARCANE_INST_KW`,
   `institutionProbability`'s `hiMagicInsts`, `MAGSCALE`, `DRUID` and `NON_MAGIC_EXOTICS`, and
   `magicLedger.ARCANE_INSTITUTION_PATTERN`, and runs them over the 32 roster names. Output: the
   nature/function facet per row, the three mis-inferences, 21 of 32 → `generic`, 28 of 32 hidden
   at magic=0, and the nine rows hard-zeroed below `priorityMagic` 66. **Labelled
   PLAUSIBLE-BY-SIMULATION throughout, because the live record's `type` and `category` fields were
   not exercised** (§L item 53).
2. **The `hiMagicInsts` coverage pass** (awk over the 311-row flat table). Result: three of the
   eleven keywords match no catalog row. Logged as call-log row 43.
3. **The roster verification pass** (`sed -n "${L}p"` over `institutionalCatalog.js` for all 32
   line numbers). Every entry confirmed at its stated line.
4. **The ledger extractor** (python, over the fifteen authored section files) producing
   `RINST5-merge/ledger-extract.txt`, 69 marker sentences, which is what makes §L complete by
   construction.

### §M.4 · Engine recon, read-only, at `chair-baseproof-b10ed1a1`

Files read this session, in full or in the relevant scope, with nothing written anywhere in the
repo or the clean tree: `src/data/institutionalCatalog.js` (roster verification and the entry
records) · `src/domain/interior/interiorTemplates.js` (whole file, 219 lines) ·
`src/domain/spatial/cohesionWeave.js` L258–331 · `src/domain/magicFilter.js` (whole) ·
`src/domain/arcaneInstitutionVocabulary.js` (whole) · `src/domain/arcaneInstitutionIdentity.js`
(whole, 175 lines) · `src/domain/arcaneIdentity.js` L40–120 · `src/domain/magicLedger.js` L1–70 ·
`src/generators/institutionProbability.js` L1–230 and L285–315 ·
`src/generators/steps/assembleInstitutions.js` L240–345 · `src/data/constants.js:37` (grep) ·
plus consumer greps for `filterCatalogForMagic`, `magicLevel` and `priorityCategory`.

### §M.5 · Claim tally at close

Counted by a python pass over `head.md`, `sec-1.md`, `sec-A`…`sec-K`, `sec-15.md` and
`sec-sigma.md` — the ledger, this method section and the appendix are EXCLUDED, since their
labels are bookkeeping rather than claims. Counted at 2026-08-23, after the last edit to those
files.

| Label | Count |
|---|---|
| CONFIRMED (bare — fetched or curl-recovered by this lane this session) | **71** |
| CONFIRMED-digest (search digest quoting a page never opened) | **73** |
| PLAUSIBLE | **19** |
| CONVENTION (genre expectations, never CONFIRMED) | **26** |
| GATED (a Cloudflare interstitial, explicitly not a fetch) | **3** |
| `HOME:` tags (a proposed cell with an existing `ROOM_KINDS` home) | **53** |
| `NO TYPED HOME` statements | **14** |

**Read that first row honestly.** A bare-CONFIRMED-to-digest ratio of 71 : 73 means **roughly
half of this dossier's load-bearing claims rest on search digests of pages that were never
opened**, and the digests cluster in exactly the places a reader would most want primary
evidence: every Tattershall figure, the whole druid negation, every Cardington figure, the
collegiate module, the Rothwell charnel, and all of §15. Eight pages were opened. That is the
honest shape of this lane's evidence and it is why §L.3 lists the digest-only figures by name.
The bare-CONFIRMED count is also concentrated: `sec-B` alone carries 20 of the 71, almost all of
them from the one curl-recovered paper.

### §M.6 · Doctrine compliance, stated so it can be checked

**Lane cap.** SOLO. **No Agent, Workflow or sub-agent call of any kind was issued.** Every search,
fetch, script and section is this one lane's.
**Read-only.** No git command, no test, no build and no edit was run against
`/Users/cstokes/Desktop/settlement-engine` or against the clean tree. All writes are under
`.../6298872d-…/scratchpad/` and are prefixed `RINST5-` or are the two named deliverables.
**The assembler.** `draft-R-INST-5-MAGICAL.md` is regenerated only by
`RINST5-merge/assemble.sh` over `head.md` + `sec-*.md`. It has never been hand-edited.
**The deity doctrine, extended to magic.** No section says what magic is, how it works, where it
comes from, or what it costs. Family E describes a henge's bank, ditch and causeways and says
nothing about what anyone did in it; §15.3 describes waidan's two SETTINGS and says nothing about
its ideas; family J's guest nation "furnishes its own cells to its own taste" and the dossier
declines to say to what taste.
**Conventions, never expression.** No protected text, name, creature, spell, plane or cosmology
appears. Where the catalog itself names one ("Eberron-style" in the `Airship docking` desc), the
dossier reports it as a scope defect and adopts nothing from it.
**Finite semantics.** Every proposal in every (f) is a closed enum or a typed bucket.
**No probabilities minted.** The morphology is `EUROPEAN_FANTASY_BASE` and every cited building is
a bounded possibility or a counterexample. The only frequency-shaped statements in the dossier are
the engine's OWN multipliers, quoted from the code.
**Absolute dates throughout. No emojis. C0 clean** — `LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-
\x1f]'` returned 0 on every authored file at every RESUME POINT and at close.

### §M.7 · What this lane did NOT do

It did not open a paywalled or Cloudflare-gated source (four were blocked and one 303 was
recovered by curl; one 303 was not). It did not run any code in the repo. It did not verify the
FACET_INFERENCE mis-inferences against a live generated settlement (§L item 53 names the
experiment). It did not re-research any sibling tranche's ground, and it did not cross-check
R-INST-3's collegiate or library figures against family C's and family J's gaps. It did not
propose any catalog edit as done — all six engine gaps and the "Eberron-style" defect are reported
for the owner, because catalog and behaviour changes are owner-gated.


---

## APPENDIX · THE CALL LOG — every search issued, every URL touched with its outcome, and every file on disk

Reproduced verbatim from `RINST5-merge/calls.tsv`, which was written as the lane went. 48 rows: 31 WebSearch, 14 WebFetch, 2 curl, 1 logged local proof. The `fam` column names the family the act served.

### A.1 · WebSearch — all 31 query strings, verbatim, in the order issued

| # | query string (verbatim) | outcome | fam |
|---|---|---|---|
| 1 | `Tattershall Castle tower house measured plan storey heights brick 1440` | digest OK | A |
| 2 | `Uraniborg Stjerneborg Tycho Brahe observatory plan dimensions alchemical laboratory basement` | digest OK | A/B |
| 3 | `Libavius Alchymia 1606 ideal chemical house laboratory plan rooms description` | digest OK | B |
| 4 | `"no purpose-built" alchemical laboratory survives archaeology excavated furnace early modern` | digest OK (negation) | B |
| 5 | `Libavius chemical house domus chymici rooms laboratorium apotheca coctio andron garden Newman` | digest OK | B |
| 6 | `Oberstockstall excavated alchemical laboratory 16th century cellar furnaces Austria dimensions` | digest OK | B |
| 7 | `medieval tower house solar chamber storeys spiral stair vice measured Vernacular Architecture` | digest OK | A |
| 8 | `Tower of London Lion Tower royal menagerie plan dimensions dens 1330 elephant house` | digest OK | K |
| 9 | `Avebury Stonehenge bank ditch avenue dimensions entrance causeway metres excavation report` | digest OK | E |
| 10 | `optical telegraph semaphore station building plan dimensions Chappe tower operator room 1794` | digest OK | F |
| 11 | `verderer's lodge royal forest woodward house Lyndhurst Speech House plan rooms forest court` | digest OK | I |
| 12 | `airship shed hangar dimensions Cardington 1917 length width height mooring mast` | digest OK | F |
| 13 | `Fondaco dei Tedeschi Venice plan courtyard warehouse rooms merchants lodging dimensions` | digest OK | J |
| 14 | `medieval mews falconry building plan hawk house dimensions royal mews Charing Cross kennel` | digest OK | K |
| 15 | `medieval deer park lodge keeper's lodge plan excavated dimensions standing hunting lodge` | digest OK | I |
| 16 | `medieval goldsmith workshop plan shop front strongroom furnace assay London excavated` | digest OK (null for a plan) | D |
| 17 | `charnel house ossuary crypt medieval England Rothwell Hythe dimensions bone stacks plan` | digest OK | G |
| 18 | `druids did not build stone circles antiquarian myth Stukeley Iron Age Neolithic gap evidence` | digest OK (NEGATION, positive result) | E |
| 19 | `early observatory was a room not a building astronomer's chamber rooftop before purpose-built observatories` | digest OK (NEGATION, positive result) | A |
| 20 | `Inns of Court chambers staircase plan no corridor Middle Temple Gray's Inn sets of chambers` | digest OK | C |
| 21 | `first permanent resident embassy ambassador rented house not purpose-built 15th century Venice Rome` | digest OK (NEGATION) | J |
| 22 | `17th century London coffee house interior room long table boxes description Rugge premises` | digest OK | H |
| 23 | `Oxford Cambridge college staircase plan sets of rooms chambers no corridor quadrangle origin` | digest OK | C |
| 24 | `medieval stationer scribe shop premises Paris rue Neuve Notre-Dame bookshop stall limner workshop` | digest OK | D |
| 25 | `Cheapside goldsmiths row shop front window bench workshop behind medieval London Schofield building` | digest OK | D |
| 26 | `Roman villa slave quarters ergastulum barrack block cell size excavated dimensions workforce housing` | digest OK | G |
| 27 | `mountebank stage fairground booth Bartholomew Fair construction dimensions temporary theatre booth` | digest OK | H |
| 28 | `Lion Tower excavation 1936 dens Tower of London menagerie archaeology semicircular barbican plan` | digest OK (architecture null) | K |
| 29 | `Ulugh Beg observatory Samarkand dimensions sextant trench Maragheh observatory plan measured` | digest OK | 15 |
| 30 | `Jantar Mantar Jaipur instruments dimensions Samrat Yantra height masonry observatory` | digest OK | 15 |
| 31 | `Chinese alchemy furnace laboratory Daoist temple hermitage building waidan elixir chamber archaeology` | digest OK | 15 |

### A.2 · WebFetch and curl — all 16 acts with outcome

| # | act | URL | outcome | fam |
|---|---|---|---|---|
| 1 | FETCH | https://en.wikipedia.org/wiki/Uraniborg | 200 OK | A |
| 2 | FETCH | https://www.nature.com/articles/s40494-024-01301-6 | 303 redirect to idp.nature.com (not followed) | B |
| 3 | CURL | https://www.nature.com/articles/s40494-024-01301-6 | 200, 347464 B -> RINST5-A-uraniborg-lab.html/.txt (53556 chars) | B |
| 4 | FETCH | https://www.cabinet.ox.ac.uk/drawing-alchemical-house-libavius-1606 | ENOTFOUND (host does not resolve) | B |
| 5 | FETCH | https://pmc.ncbi.nlm.nih.gov/articles/PMC7540335/ | 200 OK | B |
| 6 | FETCH | https://www.fulcrum.org/epubs_download_interval/0g354j00z?chapter_index=6 | 403 Forbidden | B |
| 7 | FETCH | https://ethos.lps.library.cmu.edu/article/id/450/ | 200 OK | B |
| 8 | FETCH | https://link.springer.com/rwe/10.1007/978-3-319-20791-9_233-1 | 303 redirect to idp.springer.com (not followed) | B |
| 9 | FETCH | https://www.antiquity.ac.uk/projgall/martinon298_ | 200 OK | B |
| 10 | CURL | https://historicengland.org.uk/listing/the-list/list-entry/1215317 | 403, 5582 B Cloudflare "Just a moment" -> GATED, NOT a fetch | A |
| 11 | FETCH | https://www.hrp.org.uk/tower-of-london/history-and-stories/the-tower-of-london-menagerie/ | 403 Forbidden | K |
| 12 | FETCH | https://www.english-heritage.org.uk/visit/places/avebury/history/description/ | 200 OK | E |
| 13 | FETCH | https://www.johnhearfield.com/Radar/Chappe.htm | 200 OK | F |
| 14 | FETCH | https://en.wikipedia.org/wiki/Fondaco_dei_Tedeschi | 200 OK | J |
| 15 | FETCH | https://britishlistedbuildings.co.uk/101215317-tattershall-castle-tattershall | 403 Forbidden | A |
| 16 | FETCH | https://en.wikipedia.org/wiki/Palazzo_Loredan_dell%27Ambasciatore | 200 OK | J |

### A.3 · Local proofs

| # | act | what | outcome | fam |
|---|---|---|---|---|
| 1 | LOCAL | awk over RINST2-catalog-flat.tsv: hiMagicInsts keyword coverage | 3 of 11 keywords match NO catalog row | Sigma |
| 2 | LOCAL | node RINST5-facetsim.cjs over the 32 roster names | 21/32 generic; 3 substring mis-inferences; 28/32 hidden at magic=0; 9 hard-zeroed below priorityMagic 66 | all |
| 3 | LOCAL | sed -n over institutionalCatalog.js for all 32 line numbers | every entry confirmed at its stated line | §0 |
| 4 | LOCAL | python marker extractor over the 15 authored section files | 69 marker sentences -> ledger-extract.txt | §L |

### A.4 · Files this lane wrote (all under the lane's scratchpad; nothing in the repo)

| file | bytes | what |
|---|---|---|
| `laneTCRINST5-receipt.md` | 11,585 | the lane receipt: STARTED stamp, RESUME POINTs, the FINAL block |
| `draft-R-INST-5-MAGICAL.md` | 282,584 | THE DELIVERABLE, regenerated only by the assembler |
| `RINST5-facetsim.cjs` | 6,084 | the FACET_INFERENCE / magicFilter / institutionProbability simulation (node) |
| `RINST5-A-uraniborg-lab.html` | 347,464 | curl recovery of the npj Heritage Science 2024 Uraniborg paper |
| `RINST5-A-uraniborg-lab.txt` | 54,001 | its text extract (53,556 chars) - the dossier's best source |
| `RINST5-A-he-tattershall.html` | 5,582 | the Historic England Cloudflare interstitial, kept as evidence of the GATE |
| `RINST5-merge/assemble.sh` | 1,122 | the assembler; the dossier is never hand-edited |
| `RINST5-merge/calls.tsv` | 5,290 | the call log this appendix is generated from |
| `RINST5-merge/ledger-extract.txt` | 13,410 | 69 marker sentences; the construction of §L |
| `RINST5-merge/head.md` | 28,227 | banner + §0 roster, exclusions, families, status map |
| `RINST5-merge/sec-1.md` | 9,765 |  |
| `RINST5-merge/sec-A.md` | 32,994 |  |
| `RINST5-merge/sec-B.md` | 28,822 |  |
| `RINST5-merge/sec-C.md` | 19,668 |  |
| `RINST5-merge/sec-D.md` | 20,379 |  |
| `RINST5-merge/sec-E.md` | 21,236 |  |
| `RINST5-merge/sec-F.md` | 24,254 |  |
| `RINST5-merge/sec-G.md` | 22,693 |  |
| `RINST5-merge/sec-H.md` | 17,426 |  |
| `RINST5-merge/sec-I.md` | 21,421 |  |
| `RINST5-merge/sec-J.md` | 23,443 |  |
| `RINST5-merge/sec-K.md` | 21,641 |  |
| `RINST5-merge/sec-15.md` | 10,295 |  |
| `RINST5-merge/sec-sigma.md` | 21,994 |  |
| `RINST5-merge/sec-ledger.md` | 12,850 |  |
| `RINST5-merge/sec-method.md` | 10,282 |  |

---

