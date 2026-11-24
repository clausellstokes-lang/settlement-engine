# CHAIN-1-LISTS: phase 1 of chain one (A1, A2), read only. Send to the chair.

Read whole: `CURES-COMMON.md`, `CHAIN-1.md`, RULING-R24 (`origin/lane/chair-2026-11-08`), READ-24. The source read is
`/home/user/wt/a1` at d447ee31e (the BEFORE tree; `wt/a1`, `wt/a2`, `wt/b1ii`, `wt/lit` all had an empty `git status`
before and after). No file under `src/` or `tests/` was changed. Nothing was committed. No heavy run was made: every count
below joins READ-24's own records (`scratchpad/READ-24/records*.jsonl`) to its own `--text` renders (C: `render/text`,
V: `render-visitor/text`). The scripts and outputs are in `close-7/chain-1/`. They take paths relative to the scratchpad and
import the catalogue from `/home/user/wt/a1/src`. The ruling and the common law do not differ on anything this phase touches.

## TWO PREMISES THE CHAIR SHOULD SEE FIRST

1. **A1: the pattern is wider than the five names (the premise holds, but the count differs).** READ-24 counted H7 beside
   resident sick care: 3 (C) and 2 (V). The pattern the ruling asks for ("a no-healer line beside resident sick care")
   covers all five lines (H2, H3, H7, H8, H9). With the list as it stands after the strikes, its count before the cure is
   **13 (C) and 26 (V)**. The ruling's five names are among them. Seeds: `chain-1/a1-pattern-before-{C,V}.tsv`.
   CONFIRMED (join of record and page). All five named births still have sick care after "Birth assistance" is struck.
2. **A2: one premise is false, and the cure as worded would empty a slot.**
   (a) "whose own ledger reads Secure" is not what the page prints for two of the three named births. **dp-metropolis-57**
   is stored as `foodSecurity.label "Secure"`, with deficitPct 1. Its page prints "Food Security · Pressured" and
   "Short: 464 lbs/day" (render line 27 and line 1180). CONFIRMED. The page's word comes from
   `facts/foodBandShown.js :: foodBandShownKey`, which lowers a secure band with `gapPct > 0` to "pressured".
   **dm24-hamlet-1** has deficitPct 5, so by the same rule it prints Pressured. That is PLAUSIBLE: the twin's record was
   measured but no page was rendered. Only **dp-city-83** (deficit 0) prints Secure. So "the fact the page prints"
   (the existing atom `food`, which reads `shownBand`) and "the ledger reads Secure" (`foodRecord.band`, raw) give
   different answers. If the cure reads the printed word, two of the three red-first births stay red. **The chair rules
   which reading** (part (c), "What the SHORTAGE lines would read").
   (b) The food pool's `strained`, `critical` and `collapsed` branches hold **only SHORTAGE lines** (23 of 23). Where the
   band is strained or worse and the ledger reads Secure, no line would remain eligible, and the slot would print the EMPTY
   string (ruling 3). The places this reaches, by record: **C: 197** (159 strained and 38 critical, printed Secure) and
   **V: 168** (136 and 32). On the raw ledger reading the counts are **C: 209** and **V: 255**
   (`chain-1/a2-band-vs-ledger.txt`). The record counts are CONFIRMED. That each such page prints a food line today is
   PLAUSIBLE: a line can be withheld where the condition is stated already. Before the build, the chair must say what such
   a place's food slot says (options in part (c)).

## (a) A1: THE SERVICES THAT TEND THE SICK, AS THE FLAG WOULD STAND

Every row is in `src/data/institutionServices.js :: INSTITUTION_SERVICES` (the one table: `data/tradeGoodsData.js`
re-exports the same object, checked `===`). "Line" is the row's line in that file. "Houses" are the catalogue houses
(`institutionalCatalog`, every tier) whose name resolves to that row through the generator's own resolver,
`generators/services/institutionServices.js :: resolveServiceCatalogKey`. "Sick house already" means the house is already
a `sick house` by its name (hospital, healer, infirmary, monastery or friary), so the flag adds nothing there. "Off" marks
`on: false`, a row drawn only when the owner toggles it on. "Dormant" means no catalogue house resolves to the row.

| # | service (row's spelling) | line, row | desc | houses that offer it | status |
|---|---|---|---|---|---|
| 1 | Healing | L1232, Priest (resident) (needs magic) | Divine healing magic for the sick and injured. | Priest (resident) [village] | KEPT, new reach |
| 2 | Healing (nature) | L513, Druid Circle (off; magic) | Wounds closed and sickness lifted by magic. Slower than divine. | Druid Circle [village] | KEPT, new reach |
| 3 | Higher healing | L1555, Major monasteries (5-10) (off; magic) | More advanced divine healing from senior clerics. | Major monasteries (5-10) [metropolis] | KEPT (sick house already) |
| 4 | Basic wound care | L437, Midwife | Clean wounds, set minor fractures, reduce fever. | Midwife [village, town, city, metropolis] | KEPT, new reach |
| 5 | Medical care (basic) | L104, Church/Temple | Herbalism, prayer healing | none (dormant) | KEPT |
| 6 | Medical treatment | L136, Hospital | Care for sick and injured | none (dormant) | KEPT |
| 7 | Medical consultation | L734, Apothecary district (off) | Multiple qualified apothecaries offering second opinions and specialist advice. | Apothecary district [city, metropolis] | KEPT, new reach |
| 8 | Surgery | L137, Hospital | Basic surgical procedures | none (dormant) | KEPT |
| 9 | Surgical procedures | L1095, Major hospital | Operations for injuries, tumours, and structural problems. Survival rates variable. | Major hospital [city] | KEPT (sick house already) |
| 10 | Herbal remedies | L438, Midwife | Tinctures and poultices for common ailments. | Midwife [village to metropolis] | KEPT, new reach |
| 10 | Herbal remedies | L726, Apothecary (established) | Tinctures, poultices, and dried herbs for common ailments. | Apothecary (established) [town] | KEPT, new reach |
| 10 | Herbal remedies | L732, Apothecary district | Wholesale and retail herbs, tinctures, and prepared medicines. | Apothecary district [city, metropolis] | KEPT, new reach |
| 10 | Herbal remedies | L1433, Apothecary | Dried herbs, tinctures, and simple remedies for common ailments. | Apothecary [village] | KEPT, new reach |
| 11 | Healing herbs | L1547, Monastery | Herbal remedies from the monastic garden for common ailments. | none (dormant) | KEPT |
| 12 | Herbal medicines | L506, Grove Shrine | Remedies from the grove's plants. | none (dormant) | KEPT |
| 13 | Herbalism and healing | L1139, Monastery or friary (off) | Monastic herb gardens and healing knowledge serve the local population. | Monastery or friary [town] | KEPT (sick house already) |
| 14 | Fever and illness | L1285, Small hospital | Treat common diseases and fevers with the knowledge available. | Small hospital [town] | KEPT (sick house already) |
| 15 | Remove minor disease | L1619, Healer (divine, 1st level) (off) | Treat common illnesses through divine intervention. | Healer (divine, 1st level) [village] | KEPT (sick house already) |
| 16 | Emergency treatment | L1040, Hospital network | Rapid response to injuries, accidents, and sudden illness. | Hospital network [metropolis] | KEPT (sick house already) |
| 17 | Wound closing | L1617, Healer (divine, 1st level) | Basic divine healing. Closes cuts, reduces fever, eases pain. | Healer (divine, 1st level) [village] | KEPT (sick house already) |
| 18 | Wound treatment | L1284, Small hospital | Clean, stitch, and dress wounds. Prevent infection where possible. | Small hospital [town] | KEPT (sick house already) |
| 19 | Specialist care | L1041, Hospital network | Referral to physicians with expertise in specific conditions. | Hospital network [metropolis] | KEPT (sick house already) |
| 20 | Specialist physicians | L1096, Major hospital | Physicians specialised in specific conditions, diseases, and treatments. | Major hospital [city] | KEPT (sick house already) |
| 21 | Recovery wards | L1097, Major hospital | Long-term wards for patients recovering from illness or surgery. | Major hospital [city] | KEPT (sick house already) |
| 22 | Long-term recovery | L1042, Hospital network (off) | Extended wards for patients requiring prolonged treatment. | Hospital network [metropolis] | KEPT (sick house already) |
| 23 | Quarantine | L138, Hospital | Isolate contagious diseases | none (dormant) | KEPT (question Q2) |
| 24 | Antitoxins | L1648, Dungeon delving supply district (off) | Prepared antidotes for common dungeon poisons. | Dungeon delving supply district [city, metropolis] | KEPT, new reach (question Q3) |
| 25 | Poison antidotes | L729, Apothecary (established) (off) | Prepared antidotes for known poisons. Kept discreetly. | Apothecary (established) [town] | KEPT (question Q3) |
| 26 | Compound medicines | L1434, Apothecary | Prepared medicines for fever, pain, and infection. | Apothecary [village] | KEPT, new reach |
| 27 | Medicines and compounds | L727, Apothecary (established) | Prepared medicines for fever, pain, infection, and chronic conditions. | Apothecary (established) [town] | KEPT, new reach |
| 28 | Specialist compounds | L733, Apothecary district | Rare medications and treatments available through district-wide sourcing. | Apothecary district [city, metropolis] | KEPT, new reach |
| 29 | Birth assistance | L436, Midwife | Experienced midwifery. Available day and night. | Midwife [village to metropolis] | **EXCLUDED**: the chair's strike, "Birth assistance alone does not make a healer" |
| 30 | Midwifery | L1286, Small hospital | Assist with difficult births and postnatal complications. | Small hospital [town] | **EXCLUDED (my reading of the same strike, Q1)**: births alone. No effect: a Small hospital is a sick house by name |

So **28 names (31 rows) are KEPT and 2 are EXCLUDED.** None of the thirty is a burial, rite, alms, bathing or counsel
row, so the chair's "never" strikes nothing on this list. Every one of the thirty is filed `healing` by
`classifyService`. Each name sits on exactly one row, except Herbal remedies, which sits on four, and every one of those
four tends the sick. READ-24's records confirm which flagged rows are actually drawn on C and V: Healing @ Priest
(resident), Basic wound care / Herbal remedies @ Midwife, the three apothecary houses' rows, and the hospital and
divine-healer rows. No sick-care row is drawn on an "Access to" house in either corpus.

**The strike's one effect on the pattern:** V dp-city-98 (H9 beside Birth assistance @ Midwife, its only sick-care service)
leaves the pattern. With Birth assistance counted, V would be 27. CONFIRMED.

**Questions for the chair (mine; the chair strikes or keeps):**
- Q1. Midwifery (Small hospital): the same reason as Birth assistance. I marked it EXCLUDED. It has no effect either way.
- Q2. Quarantine: isolation, not treatment. The row is dormant, and a Hospital is a sick house anyway.
- Q3. Antitoxins (Dungeon delving supply district) and Poison antidotes (Apothecary (established)): goods sold, not care
  given? Both are off by default. Antitoxins is the only one of the two that gives a house new reach.
- Q4. Rows OUTSIDE the thirty that a reader might call care, so the chair can say yes or no. I recommend none of them
  without the chair's word:
  - Hedge medicine, Hedge wizard, off: "herbal knowledge and minor magic for common ailments". Filed `magic`.
  - Consultation, Apothecary (established), off: "Diagnosis and treatment advice". Filed `information`.
  - Potions and elixirs (Alchemist) and Potion brewing (Alchemist shop): "Healing potions, antidotes". Filed `magic`.
  - Poor relief, Almshouse: "basic care for the destitute poor and aged". This is alms, which the chair says never.
  - Massage, Public bathhouse: bathing, which the chair says never.
  - Veterinary care, Beast trainers: animals.
  - Discreet services, Midwife, off: "Treatments she does not discuss publicly".

**Where the flag would live.** A field on the row itself, written once on each of the 31 kept rows. I propose
`tendsSick: true`, beside `on`, `p`, `desc` and `needs`. The name is free in `src/` and `tests/`. The catalogue's
`...rowDef` carries the field onto the drawn row (as it carries `needs`). `projectAvailableService` does not persist it.
The stored service keeps only `{ name, desc, institution }`, so the fact reads the flag back from the catalogue. No list
is written in a script. Before the build, CLOSE-7 should know: `institutionServices.js` is not on the golden-freeze
register (`tests/fixtures/.golden-freeze-register.json`, grep). Twenty-eight test files import `INSTITUTION_SERVICES`.
In phase 2 they are greped for a shape walker that would refuse an unknown row field.

**How the one fact would be declared.**
- **The atom:** `'sick care'`. Its shape is presence, its home is `sickCare`, and its reader is
  `(f) => bool(f.sickCare)`. The name is free. It sits beside `'sick house'`, `hospital` and `healer` in
  `domain/facts/factVocabulary.js`. It is listed here as new vocabulary: **one atom, for a fact the record already holds.**
- **The getter:** `factsOf(record).sickCare`, beside `courtSits`, its exact precedent (a house by name OR a live house
  that drew a court service, `facts/defence.js :: courtHoldersOf`). It is answered by a new
  `facts/defence.js :: sickCareHoldersOf(record)` built on `courtHoldersOf`'s shape.
- **The fields the reader reads:**
  1. The `sick house` arm, unchanged: `defenceOf(record).hospital || defenceOf(record).healer`, which reads
     `record.institutions` through `defenseFactsOf`.
  2. The service arm: every entry of `record.availableServices`, over all buckets as `courtHoldersOf` reads them. An entry
     counts where `entry.institution` is on the live roster (`liveInstitutions(record)`, which leaves ruined houses out),
     is NOT an "Access to" row (`facts/liveInstitutionNames.js :: ACCESS_ONLY`), and the catalogue row it came from
     carries `tendsSick`.
- **One design point for CLOSE-7: how the reader finds "the row it came from".** The record does not keep the catalogue
  key. There are two honest ways:
  - (i) Resolve `entry.institution` through `resolveServiceCatalogKey` and read `INSTITUTION_SERVICES[key][entry.name]`.
    This is exact, but `domain/facts` imports nothing from `generators/` today. (Four other `domain/` files do.)
  - (ii) The data file exports the SET of service names whose rows carry the flag, DERIVED from the rows
    (`Object.values(INSTITUTION_SERVICES)` filtered on `tendsSick`), and the reader tests the name. This is exact only
    while every row of a flagged name is flagged, which is true of the thirty today. A lint arm would hold it.
  - I recommend (ii) with that arm. Either way the 31 rows are the only authority.
- **Not in this unit** (for the hand-back, as ruled): `capacityModel/healingLedger.healerCount`, which counts an
  apothecary but not a priest or a midwife.

## (b) A1: EVERY LINE THAT SAYS NO HEALER STANDS HERE

**The five of `src/data/dailyLife/outsiderImpressions.js :: OUTSIDER_IMPRESSIONS['services.healing']`** (each is
`needs: [], excludes: ['sick house']` today; the cure adds `'sick care'` to each `excludes`):

| id | line | words |
|---|---|---|
| H2 | L164 | There is no healer here, and the sick are nursed at home. |
| H3 | L165 | Nobody here heals by trade, and a visitor who falls ill must make do. |
| H7 | L169 | Anyone who falls ill here is nursed by family, for there is no healer to send for. |
| H8 | L170 | A visitor who falls sick here will find no healer to call on. |
| H9 | L171 | Sickness is something people here deal with at home, as best they can. |

**The others my grep of `src/data` found that say it.** I searched "no healer", "nobody to treat/tend", "tended at home",
"nursed by/at home", "no house of healing", "nothing against disease", "whoever is nearest" and "make do", then read
every sick, heal or medic line that carries a negation. Each was checked for whether it can print beside sick care:

| file, key | words | reads | beside resident sick care? |
|---|---|---|---|
| `dossierStateProse/economy.generated.js` DS-ECO, `THE HEALING GAP` v1 (L7868) | {settlement} keeps no house of healing at a size where one is assumed; what is done for the badly hurt here is done by whoever is nearest. | `economyStateProse.js :: serviceCatalogPoolKey`: `deriveNotableAbsences` holds `healing`, i.e. the healing BUCKET is EMPTY | **cannot**: an empty bucket holds no service. Printed 0 times on C and V |
| same, v2 (L7876) | The sick in this town are tended at home, and everybody knows how far the nearest better answer is. | same | same (and it says "town") |
| same, v3 (L7882) | {settlement} can set a bone or bind a cut, but has nothing for a serious wound or illness. | same | same (it also does not deny care) |
| `dossierStateProse/defense.generated.js` DS-DEF-2 `Disasters & Famine: granary, NO medical provision` (L2203: v1 "…has nothing at all against disease…", v2 "Nothing here will carry it through a plague…", v3 "…have no answer to a sick one…") | as quoted | `defenseStateProse.js :: disasterRowPoolKey` (granary × hospital × church) | **silent**: the desk sets `disaster: null` (the owner's 2026-11-03 word). Not drawn. CONFIRMED by read |
| same, `NO reserves, NO medical provision` (L2253) v1 | {settlement} has no granary and nobody to treat the sick; … | same (no church arm in this branch) | silent, as above |
| same, DS-DEF-6 `Medical Readiness: None` (L6809) v1 to v3 | "{settlement} has no dedicated healers. …" / "{settlement} has nobody who could slow an outbreak; …" / "The sick at {settlement} are tended by whoever is related to them, and that is the whole of the arrangement." | `DEF6_C3_BLOCKED_POOLS` | **blocked**: listed in `defenseStateProse.js` DEF6_C3_BLOCKED_POOLS, not drawn. CONFIRMED by read |
| `domain/display/defenseDisplay.js` L390, the Medical Readiness note (not `src/data`; a literal, named because it prints) | No healer is kept here; the sick are tended by their own families. | `hasHospital`, `hasHealer`, `clergyHere`, `sickTendedByOne` (the roster's people) | **0 of 295 (C) and 0 of 296 (V)** beside sick care. CONFIRMED (join). It could stand beside a midwife or an apothecary where no clergy live; it has not on either corpus |

So the cure has five lines to change: H2, H3, H7, H8 and H9. Their pool is the only one that prints beside resident
sick care today.

**Where the healing lens is strained AND sick care is at hand: what stays eligible and true.**
`dailyLife.js :: outsiderParts` draws `services.healing` through `filterDeclared`. After the cure, in the 13 (C) and 26 (V)
places, `sick house` is false and `sick care` is true. There:
- H0 and H1 need `sick house`, so they stay out.
- H2, H3, H7, H8 and H9 now exclude `sick care`, so they are out.
- **H4, H5 and H6 remain eligible** (no needs):
  - H4: "Care for the sick is short here, and people know better than to fall ill." **TRUE**: care is here and short.
  - H5: "The sick are not well provided for here, and a visitor notices it." **TRUE** under a strained lens.
  - H6: "Those who fall ill here cannot count on much care." **TRUE**: "not much", which is not "none".

So the pool still holds three true lines and the slot never goes empty. The truth of each is my reading (PLAUSIBLE).
By the ruling's own condition ("if it holds none") no candidates are needed. The chair may still find that H4 to H6 say
"short", not "here and stretched", so **three candidates are offered for the chair's ruling, only if wanted**. Each
needs `'sick care'` (beside the lens strained, which is the branch's own condition). Each names no house, says no
"town", uses no "a stranger", "rather than", "plenty" or "to spare", and does not say "healer". A priest who heals or an
apothecary is not necessarily "a healer", and the chair may prefer the kind left unnamed.
- K1: "There are those here who tend the sick, but too few for all who need them."
- K2: "Someone here will see to a visitor who falls ill, though it may be a long wait."
- K3: "Care for the sick is to be had here, but it is stretched thin."

A second option, not proposed: H0 ("Anyone who falls ill here waits a long while to be seen.") is true wherever care is
at hand and stretched. Re-declaring it on `sick care` in place of `sick house` would add a fourth true line with no new
words. It would move its keyed pick only where it is newly admitted, so it is the chair's to rule.

## (c) A2: THE TWO LISTS

**What each line reads now.**
- `foodCulture.js`: the branch is the food CAPACITY band (`capacityModel :: deriveFoodProduction`,
  `capacities.food_production.band`, production against need, NOT imports), plus the famine and siege threat for
  `surplus.wanting`, plus each line's declared atoms.
- `commonerResentments.js` `food`: the branch fires on the same band at strained, critical or collapsed, plus each line's
  atoms.

The classes, as the ruling defines them:
- **SHORTAGE**: people go short (small portions, thin stew, less to go round, eat less, hunger), whatever else the line
  names.
- **SOURCE**: says where the food comes from (grown, hunted, herded, bought in) and says no shortage.
- Many lines are neither: they say "enough" or "plenty", or name the plain diet. I mark them **NEITHER** rather than force
  them into a class. Under the cure they keep their reading, as SOURCE lines do. The chair may re-class them.

**`src/data/dailyLife/foodCulture.js :: FOOD_CULTURE`** (56 lines):

| branch (band) | id | words | needs now | class |
|---|---|---|---|---|
| surplus.wanting | W0 | The stores still hold: bread and broth reach most tables, and the households count what is left. | grain, stores: > 0 | NEITHER |
| surplus.wanting | W1 | There is still enough in store for now, but every household is careful with what it has. | stores: > 0 | NEITHER |
| surplus.wanting | W2 | The place still eats from what was put by, and nobody wastes a crumb of it. | stores: > 0 | NEITHER |
| surplus.wanting | W3 | Food is not short yet, but people eat as if it soon might be. | — | NEITHER |
| surplus.wanting | W4 | Most households still eat their fill, though talk always turns to how long that will last. | — | NEITHER |
| surplus | S0 | Bread and broth are plentiful; few households go to bed hungry. | grain | NEITHER |
| surplus | S1 | There is more than enough to eat, and nobody here goes to bed hungry. | — | NEITHER |
| surplus | S2 | Food is plentiful, and a guest is fed without anyone counting the cost. | excl. famine | NEITHER |
| surplus | S3 | Plain food is plentiful here, and second helpings are not begrudged. | excl. famine | NEITHER |
| surplus | S4 | Most households eat well, and what is left over is shared or put by. | — | NEITHER |
| surplus | S5 | The place grows more than it eats, and it shows in every household. | food surplus | **SOURCE** |
| surplus | S6 | Fish is eaten fresh most days, and there is plenty of it. | fish | NEITHER |
| surplus | S7 | There is fresh bread every day, and plenty of it to go round. | grain | NEITHER |
| surplus | S8 | Meat is common fare here, and there is no shortage of it. | livestock | NEITHER |
| surplus | S9 | The hunters bring in more than enough, and game is often in the pot. | game | **SOURCE** |
| surplus | S11 | The place eats well and can afford to; even an ordinary supper has something extra in it. | prosperity: ≥ comfortable | NEITHER |
| surplus | S12 | Money is not plentiful here, but food is, and nobody goes short. | prosperity: ≤ poor | NEITHER |
| adequate | A0 | Hearty grain bread and turnip-and-onion stews dominate the table; meat appears at festivals and on the wealthier streets. | grain, livestock, tier: ≥ village | NEITHER |
| adequate | A1 | There is enough to eat, if nobody asks for much more than the day needs. | — | NEITHER |
| adequate | A2 | Meals are plain and filling, and little goes to waste. | — | NEITHER |
| adequate | A3 | Most households eat simply, and they eat enough. | — | NEITHER |
| adequate | A4 | Food is steady here, if not generous, and every household has enough with little left over. | — | NEITHER |
| adequate | A5 | The everyday fare is a simple stew and whatever else the day provides. | — | NEITHER |
| adequate | A6 | A pot of stew over the fire is the usual supper, and there is usually enough to go round. | — | NEITHER |
| adequate | A7 | Nobody here goes hungry, though few eat richly. | prosperity: < comfortable | NEITHER |
| adequate | A8 | Fish, fresh or dried, is the mainstay of most meals. | fish | NEITHER |
| adequate | A9 | Bread is the mainstay of the table, with whatever else the household can add to it. | grain | NEITHER |
| adequate | A10 | What the hunters bring home goes into the common pot, and it stretches a long way. | game | **SOURCE** |
| adequate | A11 | What the herds give fills out plain meals. | livestock | **SOURCE** |
| adequate | A12 | The grain is bought in, not grown here, so bread is never wasted. | grain imported | **SOURCE** |
| adequate | A14 | The better-off eat well, and the rest eat plainly but enough. | tier: ≥ village | NEITHER |
| adequate | A15 | Ordinary suppers here have a little more in them than plain fare elsewhere. | prosperity: ≥ comfortable | NEITHER |
| adequate | A16 | Money is short, so meals are plain, but nobody goes without. | prosperity: ≤ poor | NEITHER |
| strained | T1 | Food is tighter than it should be, and households stretch what they have. | — | **SHORTAGE** |
| strained | T2 | There is less to eat than people would like, and nothing is thrown away. | — | **SHORTAGE** |
| strained | T3 | Portions are small, and the stew is often thinner than anyone would like. | — | **SHORTAGE** (READ-24's line) |
| strained | T4 | Most households get by, but few have anything to spare at the end of the day. | excl. famine | **SHORTAGE** (mild; the chair may class it NEITHER) |
| strained | T5 | People make do with plain stew and whatever can be found to put in it. | — | **SHORTAGE** |
| strained | T6 | There is enough to keep going, but not enough to feel easy. | — | **SHORTAGE** |
| strained | T7 | Food costs more than most people can comfortably pay, so they buy less of it. | market | **SHORTAGE** |
| strained | T8 | The catch does not go as far as it needs to, and fish is eaten sparingly. | fish | **SHORTAGE** |
| strained | T9 | Bread is eaten carefully, and not even the heel of the loaf is wasted. | grain | **SHORTAGE** |
| strained | T10 | Even in comfortable households, the cooks count what goes into the pot. | prosperity: ≥ comfortable | **SHORTAGE** |
| strained | T11 | Families here have little money, and they eat less than they would like. | prosperity: ≤ poor | **SHORTAGE** |
| critical | C0 | Rations are tight, and the poor eat watered stew. | — | **SHORTAGE** |
| critical | C1 | Food is short, and many households go to bed hungry. | — | **SHORTAGE** |
| critical | C2 | Every meal is measured out, and the poorest eat least. | — | **SHORTAGE** |
| critical | C3 | There is not enough food to go round, and everyone knows it. | — | **SHORTAGE** |
| critical | C4 | Most households eat less than they need, and the children are fed first. | — | **SHORTAGE** |
| critical | C5 | The stew is thin and the bread is thinner. | grain | **SHORTAGE** |
| critical | C6 | Food is short, and what can be bought costs more than most can pay. | market | **SHORTAGE** |
| critical | C7 | The catch is too small to feed everyone, and fish is shared out carefully. | fish | **SHORTAGE** |
| collapsed | X0 | Hunger is everywhere. People queue at temple kitchens; rumors fly about caravans that never arrived. | sacredHouse, church, route open | **SHORTAGE** |
| collapsed | X1 | Hunger is everywhere, and every household is looking for its next meal. | — | **SHORTAGE** |
| collapsed | X2 | There is almost nothing left to eat, and the whole place is hungry. | — | **SHORTAGE** |
| collapsed | X3 | Food has all but run out, and people eat whatever they can find. | — | **SHORTAGE** |

foodCulture: **SHORTAGE 23, SOURCE 5, NEITHER 28.**

**`src/data/dailyLife/commonerResentments.js :: COMMONER_RESENTMENTS.food`** (14 lines; the branch fires on the food
band strained, critical or collapsed):

| id | words | needs now | class |
|---|---|---|---|
| F0 | Commoners resent rising bread prices and merchants who claim they cannot help it. | grain, market | NEITHER (PRICE: food dearer, nobody said to go short; the chair may class it SHORTAGE) |
| F1 | People grumble that there is less food to go round than there ought to be. | — | **SHORTAGE** (READ-24's line) |
| F2 | Many feel that those in charge should be doing more to see everyone fed. | — | **SHORTAGE** |
| F3 | Households that go short look hard at the ones that do not. | — | **SHORTAGE** |
| F4 | Thin meals and short portions are the grievance nearly everyone shares. | — | **SHORTAGE** |
| F5 | Nobody likes to see the pot so thin, and everyone has someone to blame for it. | — | **SHORTAGE** |
| F6 | The price of food is the first complaint on everyone's lips. | market | NEITHER (PRICE) |
| F7 | People resent paying more for less, and they say so at the stalls. | market | **SHORTAGE** ("for less") |
| F8 | People ask why {gov} cannot do more about the price of food. | government named, market | NEITHER (PRICE) |
| F9 | Short rations are the talk of every household, and patience is wearing thin. | — | **SHORTAGE** |
| F10 | There is grumbling in every kitchen about how little there is to put on the table. | — | **SHORTAGE** |
| F11 | People complain that a day's work does not buy a day's food. | market | **SHORTAGE** |
| F12 | Going short at table is the complaint heard most often here. | — | **SHORTAGE** |
| F13 | Many households are eating less than they would like, and they say so. | — | **SHORTAGE** |

commonerResentments food: **SHORTAGE 11, SOURCE 0, NEITHER (price) 3.** **Both lists: SHORTAGE 34, SOURCE 5,
NEITHER 31.**

Named for the chair, NOT in the two lists the brief gives: `outsiderImpressions.js ['services.food_production']`. Its
lines read the same capacity band. F2 is SHORTAGE: "Visitors find food dear here, and portions smaller than they
expected." F1 is mildly SHORTAGE: "A visitor notices that food is counted carefully here." F0 is NEITHER. The same fault
class applies; the chair says whether A2 takes them.

**What the SHORTAGE lines would read instead.** The ledger is `economicState.foodSecurity.foodRecord`, written once by
`generators/economy/foodBalance.js :: deriveFoodRecord`.
- Its `band` is cut by `gapPct`, the share of need left unmet AFTER the place's own production, its imports and magic
  (`data/bandLadders.js :: foodSecurityBandKeyOf`): over 40 `deficit`, over 15 `importDependent`, over 5 `pressured`,
  surplus over 40 `surplus`, else `secure`. A famine stress gives `famine`.
- The page prints that band through `facts/foodBandShown.js :: foodBandShownKey`: secure or surplus with `gapPct > 0`
  prints `pressured`; importDependent with no import prints `deficit`.
- **An atom already reads the printed band:** `food`. Its shape is band, its home is `famine`, its order is
  famine < deficit < importDependent < pressured < secure < surplus, and its reader is `famineOf(r).shownBand`.

"Short" would be **`food: ≤ pressured`**, i.e. the printed Food Security word is Pressured, Import-Dependent, Deficit or
Active Famine. Each SHORTAGE line would declare that need, with **no new atom**. "Not short" is Secure or Surplus. The
chair rules one point before the build (premise 2a):
- **(i) The printed word** (`food: ≤ pressured`, existing atom). dp-city-83 goes green. dp-metropolis-57 (prints
  Pressured, Short 464 lbs/day) and dm24-hamlet-1 (gap 5, prints Pressured by rule) keep their shortage line, as true
  beside "Pressured".
- **(ii) The raw ledger band** (`foodRecord.band ≤ pressured`). This needs a new atom, since no atom reads the raw band
  today; `famineOf().band` holds it. All three go green. A page that prints "Pressured" over a stored Secure would then
  never carry a shortage line, which is not false, only quieter.

**And the second ruling needed (premise 2b): what a strained-or-worse place whose ledger reads not-short says in its food
slot.** All 23 lines of those three branches are SHORTAGE, so the slot would be empty in C 197 / V 168 places (reading i)
or C 209 / V 255 (reading ii). Options, for the chair:
- (1) Accept the empty slot (ruling 3).
- (2) Such a place takes the `adequate` branch. The branch then reads the ledger, and its SOURCE line A12, "The grain is
  bought in, …", is the very fact.
- (3) New SOURCE lines in the strained branch, with the chair's words ("bought in, and enough").

In commonerResentments the food branch would keep only F0, F6 and F8 where a market (and grain) stands, else say nothing.
That is lawful: no grievance, so no line. **HOW MANY PAGES' FOOD LINES CHANGE** is phase 3's measure. The counts above
are its upper bound by record (PLAUSIBLE until rendered).

## CONFIRMED vs PLAUSIBLE
CONFIRMED by read and run:
- the 30 rows, their lines, descs and resolving houses;
- the pattern counts, 13 (C) and 26 (V), and dp-city-98's dependence on Birth assistance;
- the no-healer lines and why the others cannot print beside care;
- dp-metropolis-57 printing Pressured;
- the band × ledger counts.

PLAUSIBLE:
- my classing of lines (SHORTAGE, SOURCE, NEITHER) and of Q1 to Q4;
- the truth of H4 to H6;
- dm24-hamlet-1's printed word (by rule, not rendered);
- the count of pages whose food line changes (records, not renders).
