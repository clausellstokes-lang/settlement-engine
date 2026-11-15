# RECORD-MEASURE-2 · the record's next classes measured, their cures shown before any is built

Base: the joined line at `48fedbe98` (lane/join-2026-11-14). **BEFORE** = that tip with RECORD-MEASURE-1's four granted
patches applied as they stand (`c1a c2a fa da`; C1-A's gate NOT yet widened to the houses that work a good: where that
bears on a count it is said). One census of BEFORE (`census3.sh`, exit 0, 720 dumps) is the page side; every record count
and field diff is `births-only.sh` over the same 720 seeds. Nothing under `src/` or `tests/` is committed: each cure is a
patch under `probes/RECORD-MEASURE-2/` that applies at BEFORE (`git apply`, checked). The instruments are RECORD-MEASURE-1's
(`classes.mjs`, `fielddiff.mjs`, `pageprint.mjs`, `births-only.sh`), re-used unchanged; four small probes are new
(`c1members.mjs` c1 by member and list, `c1source.mjs` the export's writer, `c1print.mjs` c1 printed by member,
`npcdiff.mjs` which card fields a title cure moves).

BEFORE, by RECORD-MEASURE-1's predicates (record / printed): c1 468 / 403 · k 267 / 245 · g 60 / 60 · d 123 / 123 ·
h 167 / 167 · f 24 / 24 · b1 16 / 16 · b2 12 / 12. (k's 267 holds 6 false hits: "the lord's appointee" names the lord,
not its holder.)

**HAND-BACK STATE (this seat's count).** Rows 1–3 and M3 are measured with candidates, the page (one AFTER census) and the
tests. Rows 4–7 are traced, and only F was tried. Its page and tests were not run, nor were M-S/M-V's. The open next
candidate is K-C (below).

## THE TABLE

| class | the predicate (as RECORD-MEASURE-1 wrote it) | towns /720 (record · printed) | the maker | candidates (measured) | recommendation · what it loses |
|---|---|---|---|---|---|
| **c1 export side** | a good of `primaryExports` matching a MAKER row while no house matches the row's house | export side **316** (208 w/o coal/peat) of c1 468; printed exports 282 | `computeActiveChains.js :: deriveExportsFromChains`: step 1 a resource's `tradeGoods` behind no gate (salt flats, hot springs, crossroads, defended pass, glass sand, marshes, coal); step 2 a chain's first two outputs with no good-level gate (a thatcher's timber chain exports barrels; a mine's iron chain exports advanced arms); step 3 the entrepôt's "Toll income (transit)" | **C1-E** one table `EXPORT_GOOD_HOUSES` (good → the houses that work it), read by all three steps; coal and peat left ungated by design; the defended pass's Toll revenue KEPT (the chair, 2026-11-15: the pass is its house) → export side **193** (**57** w/o coal/peat), c1 **406** (281). Moves `primaryExports` 166 towns, `economicState.economicComplexity` 7, `arrivalScene` 8; NO income, prosperity, import, chain or trace field. Printed: c1 403 → **336**, the printed exports 282 → **185** (census at the first C1-E, which also took the pass's toll: that toll is display-filtered as NOT_A_GOOD) | **C1-E.** The 57 left: jewelry by metalworkers 34, hardwood beams/pine planks by a carpenter 12, the pass's toll 11 (ruled made), a wizard's tower's books 2: each worked on the table's reading. Loses: one anchor of `economicsGoodsPillsBorneOut.test.jsx` (below) |
| **k** gendered title vs holder | an NPC `female` whose title holds -man/lord/king/brother/father, or `male` whose title holds woman/mistress/lady/queen/sister/mother | **267** (true 261) · 245 | the face (`institutionalCatalog.js`), the seat mint and the `other` mint (`people/mintTitles.js`), the claimant (`stressPowerFaces.js :: CLAIMANT_FACE`): `card.title = card.role = face`, no gender read | **K-A** the leaf sets title AND role → k 6, but the role-keyed readers move goals (16 towns), structural rows (19), the plague's brunt (4): REJECTED. **K-B** one leaf `data/holderTitleForms.js :: titleForHolder`, read at both mints after the hook draw, the title only; `styledTitleOf` reads it; `isMintedLord` reads the face → k **6** (the false hits). Moves `npcs[].title` 359 towns, `npcs[].structuralPosition` 57, `relationships[].npc1Role/npc2Role` 269: EVERY moved string is the title word (back-substitution: 57/57, 767/767 + 6 double moves) | **K-B, the table below as the owner's veto list.** Loses nothing measured off the titles. The role keeps the face (the readers' key) |
| **M3** a house whose input the record denies (the chair's new row) | a house of a `data/resourceChains.js` chain whose `resourceAnalysis.gaps` hold `{ chain, institution, kind: 'missing' }` ("<house> exists but lacks access to <raw>"; the page: "No grapes reach the vintner.") | Smelter/copper **238/238**, Vintner/grapes **184/184** (printed 184), Glassblower/sand **13/13**; then dairy 36/42, alchemist/hot springs 14/17, caravanserai 17/21, tannery 7/10, potter 172/269, brickmaker 132/228 | `resourceGenerator.js :: evaluateInstitutionChain` + `supplyOfInput` | **M-S** a house in several chains is short only where none of its inputs reaches it; `supplyOfInput` reads the terrain synonyms ('copper ore' = 'copper') → Smelter 238 → **4**; moves `resourceAnalysis.gaps` 255 towns, `priorityNotes` 22 (a "processing incomplete" note goes). **M-V** (on M-S) grapes and glass sand reach a town on any route → Vintner 184 → **5** (isolated), Glassblower 13 → **1**; moves `gaps` 191 only | **M-S and M-V.** M-V loses: "runs on imported grapes" with no grapes on the import list (the house's own desc says it imports must) |
| **g** a word against its neighbours | two Dominant (34); "Stable" beside Legitimacy Crisis (9); a theocracy's word under no religious seat (8); a council house under a theocratic government (8); "strong military presence" with no garrison (3) | **60** · 60 | `factionDynamics.js` (the bands, per power, no roster read); `governanceNarrative.js :: deriveBaselineStability` (synthesis flags read no seat; the military word reads no force); `rulingStructure.js` (stability written before legitimacy) | **G1** one Dominant (the top; a tie → both Strong), on the final roster → 34→**0**, `factions[].powerLabel` 34 towns only. **G2** a bare "Stable" beside a Legitimacy Crisis reads "Tense (the seat has lost the people's trust)" → 9→**0**, `stability` 9 only. **G3** the two theocracy words need a religious seat or a religious power ≥25 · **G5** "strong military presence" needs `defenseFacts.hasGarrison` → 11→**0**, `stability` 11 only. G4 not tried | **G1, G2, G3, G5**: each moves its label only. g 60 → **8** (G4's eight). G2's phrase is NEW WORDING inside the Tense rung (the SOP's registered word): the chair's |
| **d** the members DA did not take | Military/Guard·Military Party Significant+ with no garrison or watch (32); a criminal/arcane power Significant+ with no house (10); "Thieves' guild (powerful)" beside a Minor/Suppressed thieves' power (15) | 32 · 10 · 15 | the power step (`rulingStructure.js` pushes a military power from the priority, an Arcane Council seat from the config); the metropolis roster's "(powerful)" row | none tried (see the paragraph) | d1: 24 of 32 are Military/Guard with a Citizen militia, the other 8 a Military PARTY: the predicate's own reach, on my reading. d2 arcane (6): an Arcane Council GOVERNS with no arcane house, DA's shape. d3: the row's name says what the power denies |
| **h** the strict set | desert: fish market/fisher/peat cutter/woodcutter/fishing community/marsh; mountain: fish market | **38** | the catalog rows; the Peat cutter row reads `config.nearbyResources` | none tried | 37 are Fish markets (mountain 20, desert 17): DESIGNED (the salted barrels). ONE cannot be: a desert hamlet's Peat cutter (`r2r-hamlet-49`) whose config holds marshlands the resource analysis drops for desert. No fisher, fishing community or woodcutter is dry |
| **f** "Lightly Defended" with every line empty | readiness label above Vulnerable while walls, garrison, militia, watch, mercenary are empty | **24** · 24 | `bandLadders.js :: readinessBandOf` (UPKEEP-12 floors a held roster; nothing caps an empty one) | **F** an empty roster reads at most Vulnerable (the same five buckets as `DEFENCE_HOLDING_BUCKETS`) → **0**. Moves the label (and its three colours) 24 towns, AND `publicLegitimacy.score/breakdown.defense` 7, `stability` 1, `simulationTrace/receipt` 7 | **F, as a declared move**: NOT label-only. Legitimacy reads the readiness label (`rulingStructure.js`, `legitimacyDefenseLabel`) |
| **b** water where none is | water home none and docks/harbour master (b1); a waterborne good (b2) | b1 **16**, b2 12 | `steps/cascadePass.js` the AIRSHIP OVERRIDE: 16/16 hold Airship docking, and "maritime institutions are permitted regardless of trade route" | none tried | **b1 DESIGNED by that override** (its own comment). b2: 11 of 12 are the Docks' "Waterborne freight services (cargo, pilotage)" in those airship cities (`computeActiveChains.js:974`): the service's word, not the house, is false; 1 is Sea salt in a dry village (C1-E keeps it: a salt works stands) |

## A PARAGRAPH A CLASS

**c1, the export side.** Traced to its writer (`c1source.mjs`), the 208 export-side towns outside coal and peat are:
`Toll revenue` from a crossroads (57 towns: t15 h20 v11 t11) or a defended pass (11), and "Toll income (transit)" from an
entrepôt chain (7); "Pilgrim hospitality" from hot springs with no inn, bath or hostel (26: thorp 13, hamlet 6, village 7);
"Sea salt" from salt flats with no salt works (21, every size); "Fine metalwork and jewelry" from the luxury chain (34,
cities and metropolises); "Barrels and containers" from a timber chain whose processor is a thatcher, carpenter or potter
(28); "Hardwood beams"/"Pine planks" (12); glass (11: a printing house's glassware 6, glass sand 5); bows (9, "Craft
guilds"); flour (7 hamlets: the river-milling chain matched "Mill" from "Access to external mill", the fuzzy matcher's
frozen false match RECORD-MEASURE-1 named); advanced arms and quality tools (7 hamlets/villages: the iron chain matched a
Mine); dyed cloth (5, a tailor); river craft (3); books (2); camel leather, fine textiles (1 each). C1-E's table names
each good and the houses that work it (an "Access to …" house works nothing here). What is left (48 w/o coal/peat) is,
on my reading, worked: the luxury chain's jewelry where Specialized metalworkers or a Luxury goods quarter stand (34;
RECORD-MEASURE-1's MAKER row for gems asks a mine, jeweller or assayer and so over-reaches), hardwood beams where the
export's own gate admits a carpenter (10), pine planks (2), a Wizard's tower's books (2). **What an export feeds:**
measured, an export moves the trade list (175), the complexity label (7 thorps/hamlets go "Subsistence with surplus" →
"Subsistence — survival economy") and the arrival scene's sensory line (8 towns take a different street line: "Nets hang
drying on poles", "Bolts of cloth hang drying"); it moves NO income row (`keepRowsThePageBearsOut` read the exports and
kept every row), no prosperity, no import, no chain, no trace. **The made side** (C1-A's) still holds 254 towns w/o
coal/peat (leather goods 55 with no tannery, barrels 44, flour 37, education 37, stone 23, gems 22, milled lumber 18, bows
17, textiles 16, dyed cloth 15): C1-E's table is the natural gate for the made list's chain outputs too, if the chair
widens C1-A that way; not tried here. **The made-whole twin** is honest only for the toll (a crossroads that takes tolls
has a toll-taker): it would seat a house, moving the roster's draws; not tried. Coal and peat (102 / 42 exported) are
ungated BY DESIGN (the gate table's comment); re-deciding them is the chair's.

**c1's kin, the chair's member M1 (i): an income weighted to magic with no practitioner.** Predicate: an
`economicState.incomeSources` row whose source names magic, arcane or spell, while no house of the town casts (mage,
wizard, academy of magic, enchanter, alchemist, sorcerer, witch, warlock; an "Access to …" house is another town's). **3
towns of 720** (`r2r-town-54`, `r2s-under_siege-town-2`, `r2s-politically_fractured-town-2`), all "Magical Trade
Revenue" 10–13% in an ISOLATED town whose one magic house is a Teleportation circle. Every Spellcasting Services and
Arcane Industry row stands beside a caster. The maker is NOT c1's: it is the income builder
(`economy/economicState.js` lines 83–109, `isolatedMagicTrade = isIsolated && hasTeleportationInfra(...)`), which renames
the market taxes of an isolated town that trades through its circle. What the generator intends, on its own words: the
circle is the town's road, and the revenue is the trade that crosses it, taxed at the market; no caster earns it. On that
reading the member is DESIGNED and the label is the fault at most ("Magical Trade Revenue" reads as magic sold). No
candidate: one would only rename the row.

**k, a gendered title.** THE TABLE (the owner's veto list): every face of the catalog and title of the mints whose
word names a sex, with the form K-B gives, and the cards it moved:

| face | holder | K-B's form | cards moved | kind |
|---|---|---|---|---|
| the front man | woman | the nominal owner | 96 | neutral |
| the senior abbot | woman | the senior abbess | 87 | pair |
| the lord (seat mint: Noble Houses/Families; the claimant) | woman | the lady | 81 | pair |
| the district madam | man | the district brothel keeper | 80 | neutral |
| the ferryman | woman | the ferry keeper | 61 | neutral |
| the boat-headman | woman | the boat-master | 56 | neutral |
| the madam | man | the brothel keeper | 52 | neutral |
| the alewife | man | the brewster | 31 | neutral (the honorific's ruled word, POWERS-9) |
| the foundling-mother | man | the foundling-keeper | 18 | neutral |
| the camp foreman | woman | the camp overseer | 17 | neutral |
| the abbot | woman | the abbess | 10 | pair |
| the headman (catalog; seat mint: Headman's Authority) | woman | the chief | 3 | neutral |
| the newcomers' spokesman | woman | the newcomers' speaker | 2 | neutral |
| the high priest | woman | the high priestess | 0 here (R2's `styledTitleOf` already) | pair |
| the midwife | man | KEPT: the word names the work today; the honorific already reads "Goodman" (POWERS-9) | (117 would move) | owner's veto |
| the priest, the elder priest | any | KEPT: the honorific pools hold the gendered forms (Father/Mother) | — | — |
| the monarch, the outlaw host, the lord's appointee, the journeymen's warden, every "… master" face (40) | any | KEPT: no sex in the word ("master" is the office's) | — | owner's veto |

The leaf is read after the hook draw, so no draw moves; the card's `institution.title` keeps the registry face, which the
honorific and hook tables key; the honorific pools of seven faces take `{ male, female }` forms (Ferry-Keeper, Boat-Master,
Chief, Overseer, Proprietor, Speaker; Keeper/Warden for a man's foundling home), display only. K-A (the role moved too) is
measured and refused: the role is a reader's key (the structural ladder's cut, the plague's brunt, the goal tables).

**K-B's files (for its builder):** `src/data/holderTitleForms.js` (NEW: the table and `titleForHolder`);
`src/generators/people/representatives.js` (the one call, after `drawCardHooks`); `src/generators/people/castPowers.js`
(the `other` mint and the claimant); `src/data/faceHonorifics.js` (`styledTitleOf` reads the leaf; seven honorific pools
take `{ male, female }`); `src/generators/npcStructure.js` (`isMintedLord` reads `institution.title`). The leader's OFFICE
titles (Lord Marshal, Lord Warden, Lord Mayor …) stay the office's (the chair, 2026-11-15).

**What K-B leaves: the ROLE.** Under K-B a card's `role` keeps its face, so 293 towns still hold a woman whose role
reads a man's word or the reverse (the faces above, plus the leader's OFFICE TITLES, `data/officeTitles.js`, written to
the dual-hat leader's `role`: Lord Mayor 7, Lord Protector of the Faith 8, Lord Marshal 6, Lord Warden 6, Lord
Burgomaster 2, Alderman 16, Headman 9, all women). The chair's note M1 says the readers met these most on the journal's
quick-reference rows and the PDF's NPC table; WHETHER THOSE SURFACES PRINT THE ROLE OR THE TITLE decides between K-B and a
K-C (the role takes the holder's form too, and the three role-keyed readers K-A moved read `institution.title` instead):
the AFTER census below measures it. Proposed office forms for a woman (veto list): the "Lord " falls away (Mayor,
Protector of the Faith, Marshal, Warden, Burgomaster); Alderman → Councillor; Headman → Chief.

**g, a word against its neighbours.** G1: of the 34, 30 are two-power rosters of 51/49 to 59/41 (a thorp's council
beside an occupier), where both read "Dominant". The label is set per power at three writers and never re-read after the
roster thins, so G1 runs once, on the final roster, in `generateSettlementPipeline.js` (a first try at the three writers
moved 18 towns more: a tie at an early pass stuck on a roster that later lost a power). G2: the 9 are calm thorps to towns
whose legitimacy is a Crisis (score 14–28); the stability is written before the legitimacy and never read again. G3: the
8 theocracy words stand on a synthesis flag (`crusaderSynthesis`, `theocraticEconomy`) that reads priorities and no seat;
gated, 6 fall to "Ordered (strong military presence)" (each with a garrison) and 2 to "Stable". G5: the 3 military words
read `militaryEffective` alone; gated on the defence facts' garrison (a name test missed 4 towns whose castle is the
garrison). **G4 (8 metropolises: "Mayor and council" under a High Theocratic or Ecclesiastical Council) is not tried:** its
cure moves the government's name (DA's shape), and a civic council under a clerical seat is a reading a page line could
carry; the chair's.

**d.** d1 (32): every Military/Guard (24, hamlets and villages) has a Citizen militia, 15 with walls; the 8 Military
Party have no force at all. A militia is a body, and a party is not a force: on my reading the predicate over-reaches for
all 32 unless a printed line says the power commands soldiers who are not there (the census's NPC and Power sections
print the power's card; a line-level check was not run). d2 (10): 6 towns are GOVERNED by an Arcane Council with no
arcane house (DA's shape: the made-whole twin seats a house, the not-made twin renames the seat; both move the
government's family), 4 hold a Thieves' Guild at Significant+ with no criminal house (towns, a village). d3 (15
metropolises): the row "Thieves' guild (powerful)" beside a thieves' power of 5–17: the row's name is a size word the power
denies; a cure is the row's name (a roster key, wide) or the power's floor (a share, wide). None tried: the count did not
allow it.

**h.** The strict set is 38 towns: 37 Fish markets (mountain 20, desert 17), DESIGNED by the chair's presumption, and one
desert hamlet's Peat cutter. No fisher or fishing community stands where no water is, and no woodcutter in desert. The
land test that would catch the one: the Peat cutter row asks `marshlands` in the resource analysis's available list (the
config's raw list keeps marshlands the analysis drops for desert). One town; not tried (it moves that roster's later draws).

**f.** F caps an empty roster at Vulnerable inside `readinessBandOf`, beside UPKEEP-12's floor, on the same five
buckets, so the record's invariant (`recordInvariants.js :: readinessBand`) agrees with no second edit. It is NOT
label-only: the legitimacy score reads the label (−defence in 7 towns), and one town's stability follows.

**b.** Every one of the 16 dry metropolises holds Airship docking, and `cascadePass.js` seats the Docks and the Harbour
master's office there by design ("Airship docking … so maritime institutions are permitted even without a port/river
trade route"). The path is found; its gate would re-decide that design. The false word is the Docks' service, "Waterborne
freight services (cargo, pilotage)", in 11 of them.

**j (not mine):** no printed line naming a person to a seat the record gives nobody was met in the counts above (not
searched for line by line).

## M3 · WHY, a line each (90% and above)

- **Smelter · copper ore (238/238):** the Smelter sits in three chains (iron ore, copper ore, gold/silver ore) and the gap is
  said per chain, so every smelter "lacks copper" even where it smelts iron; and `supplyOfInput` reads the record's
  `copper` token as no copper ore (the synonym table `RAW_RESOURCE_TERRAIN_SYNONYMS` is read by the terrain matcher only).
  A key that does not match, and a house judged by one input of many.
- **Vintner · grapes (184/184):** NO town of 720 holds grapes: the hills' terrain vocabulary lists "grapes", but no
  `RESOURCE_DATA` resource yields it, and no import list names grapes, must or wine. The house's own desc ("either from
  local grapes or imported must … a vintner in a non-wine region is an importer-blender") says the opposite of the gap.
  No terrain yields the resource, and an import that does not count as input.
- **Glassblower · glass sand (13/13):** no glassblower town holds glass sand (the 9 towns that do hold no glassblower), and
  no import list names sand. The catalog row seats the house with no sand test. No terrain yields it where the house stands.

## WHAT THE PAGE GAINS AND LOSES (the AFTER census: C1-E (first form) + K-B + G1 + G2/3/5 over BEFORE, exit 0)

`inventory_diff.py` BEFORE → AFTER (whole: `probes/RECORD-MEASURE-2/AFTER13.inventory_diff.txt`): sentences 29,813 →
29,872; 26 gone, 85 new, 90 in fewer towns, 38 in more, 4 moved. By class (`pageprint.mjs`): **c1 403 → 336; k 245 → 6;
g 60 → 8**; every other class unchanged (b2 12 → 11: the dry village's sea salt export goes).
- **k, where the old word still prints** (`kprint.mjs`: a dump line holding the holder's name and the old face): 359 → **27
  towns** (faces only; with the leader's office titles, which stay, 365 → 54). The PDF's NPC table and the journal's NPC
  Quick Reference print the TITLE (cured: the quick reference 359 → 4). What remains reads the ROLE: the journal's
  Tonight rows ("Tianmei Yang (the camp foreman · Secret)", 24 towns) and the seat line ("Indira Chatterjee, the headman,
  holds the seat …", Systems/Power and PDF/PowerStructure, 4). The honorifics read: "Proprietor", "Ferry-Keeper",
  "Boat-Master", "Overseer", "Keeper" arrive beside the women and men they fit.
- **Gained (K-B):** "the nominal owner" 96 towns, "the district brothel keeper" 80, "the ferry keeper" 61, "the boat-master"
  54, "the brothel keeper" 52, "the brewster" 25, "the foundling-keeper" 18. **Lost:** the same faces in half their towns
  (the men and women they fit keep them: "the front man" 189 → 95).
- **G:** "Rigid (militant theocracy)" leaves 7 towns; "Strong" arrives in 21 + 15 power cards where a second "Dominant" was;
  "The power Elder Council (strong)" 35 → 41.
- **C1-E:** the exports pills lose the unworked goods (sea salt, pilgrim hospitality, barrels, toll); the resource card
  reads "Unexploited" for glass sand in 5 towns that read "Partial" (the glass blanks export was its only working);
  "Salt for preservation" arrives in 17 towns' lists where the sea salt left.

## WHAT IT COSTS ELSEWHERE (focused files, BEFORE and each candidate tree; NAMED, nothing re-taken)

BEFORE ITSELF IS RED in 11 of the 761 tests run (RECORD-MEASURE-1's four cures and the base): `economicsProducedLocally` 2
(C1-A's anchors, as RECORD-MEASURE-1 said), `coherenceAgreeCures` 2 (red at the base), `powerCardOrderReads` P50 (DA's
re-decision), `rosterDuplicateDraws` 2, `proseWiringCensus.walker` 3 (the committed holder census is stale), and the
golden master (525 configs). The golden is the owner's door: every candidate moves it further; never re-taken here.
- **C1-E** (11 files, 110 tests): ONE new red, `tests/components/economicsGoodsPillsBorneOut.test.jsx` "books by Glassmakers
  alone are not exported" (rww-city-famine-1): its ANCHOR ("the record exports both") fails because the record no longer
  exports the books its display already refused. The test's claim holds; the anchor needs re-keying.
- **K-B** (20 files, 306 tests): FIVE new reds. `tests/generators/people/representatives.test.js` ×2, "role is the title
  (M-1b)": **K-B CONTRADICTS A PIN**: M-1b (the owner, 2026-11-07 07:1x UTC: a representative's role IS its institution's
  title) — K-B splits them. `styledTitleOnRows.test.js` (R2: "every row end reads its card's styled title", 2 of 7
  cases), `seatWordsOnce.test.jsx` N6 (1 case), `mintedLordKeepsLines.test.js` (1 case): the role, read as the person's
  word, now disagrees with the title. **These reds and the 27 towns above point to the same next candidate, K-C:** the role
  takes the holder's form WITH the title (M-1b kept), and the three readers K-A moved (the structural ladder's cut, already
  `isMintedLord` in K-B; the goal tables; the plague's brunt) read `institution.title`, the face. Not tried: my count.
- **G1/G2/G3/G5** (17 files, 351 tests): no new red (its five are BEFORE's own: P50, `proseWiringCensus` ×3, the golden).
  `proseWiringCensus.walker`'s committed register was already stale at BEFORE, so whether G2's new sentence needs a
  register row is not measured.
- **F, M-S/M-V:** not run (my count).

## HOW THE INSTRUMENTS ARE RE-MADE

1. As RECORD-MEASURE-1's steps 1–3, at `48fedbe98` + `c1a c2a fa da`. A candidate: `git apply probes/RECORD-MEASURE-2/<p>.patch`
   in a scratch worktree of BEFORE, `births-only.sh`, then `fielddiff.mjs` and `classes.mjs`.
2. `node c1members.mjs <corpus> <c1.json>` (c1 by member, list, size); `node c1source.mjs <tree> <corpus> <c1.json>` (the
   export's writer); `node c1print.mjs - <corpus> <dumps>` (c1 printed by member); `node npcdiff.mjs <before> <after>`
   (card and tie fields moved, title moves). Each sits beside RECORD-MEASURE-1's `classes.mjs` and `load.cjs` (copy them in).
3. `runtests.sh <tree> <out.json> <files…>`: vitest's JSON over the named files, the exit beside it.
4. Patches: `c1e kb g1 g235 f ms msmv` (msmv = M-S + M-V), each applying at BEFORE. `inputgap.mjs <tree> <corpus>`: M3's table. `kprint.mjs <before> <after> <dumps>` (NOOFFICE=1 for faces only). `failed.mjs <vitest json>`.
