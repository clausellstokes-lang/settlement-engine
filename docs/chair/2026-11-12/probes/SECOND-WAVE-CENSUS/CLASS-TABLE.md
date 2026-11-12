# THE CLASS TABLE AND THE HABITAT — the 25 patterns as three classes

**Seat.** SECOND-WAVE-CENSUS, read-only, 2026-11-12, on the census lane, at 8866a0ddd's source.
- The rows are the 25 patterns of `SECOND-WAVE-CENSUS-2026-11-12.md`. Pattern 15 is out (retired).
- The habitat counts were EXECUTED over the source with the scripts named in each section. Each count names its test.
- A count marked *regex* is an estimate of the shape, not a census of printed lines.

## 1. Per pattern: the fact, its home, the mechanism, the door

**Mechanisms:**
- **A:** the fact is derived a second time somewhere that prints.
- **B:** a sentence, title or panel states or presumes a thing, a state, a size or a count it does not read.
- **C:** internal or wrongly typed text reaches the page.

**Doors:**
- **picker:** a pool draw. DS pools are chosen by a pool key; generator pools by `pick` / `pickVariant`.
- **composer:** a template or string built in code.
- **component:** a JSX surface or its display helper.

**The chair's reading, checked.** It stands for 22 of the 25. Three are corrected:
- **6 is A, not B.** The imports are derived twice: the record's `primaryImports` against the composition the tab prints. The gap reader reads the first, the page shows the second.
- **8 is B, with an A half.** The income sentence presumes a house (B). The flow card's first-word presence test is a second derivation of "is the house here" (A), which pattern 18 shares.
- **20 rides with 2.** It is B by mechanism, but it is the same sentence and the same function, so it is cured with 2.

The confirmed classes:
- **A = 2, 3, 5a, 5b, 6, 7a, 9, 16b, NEW-1 (9)**
- **B = 1a, 1b, 4, 7b, 8, 10, 11, F4, 14, 16a, 20, NEW-2 (12)**
- **C = 13, 17, 18, 19 (4)**

| # | the fact | its home (file :: function) | mech. | the door |
|---|---|---|---|---|
| 1a | how the town is fed | `foodBalance.js :: deriveFoodRecord` (the food record) | B | picker: DS-ECO-9 keyed on the label alone (`economyStateProse.js :: foodSecurityPoolKey`) |
| 1b | how much is bought in | same | B | picker: the same key |
| 2 | how long the stores last | `storesMonths.js :: storesMonthsOf` | A | composer: `defenseDisplay.js :: foodEnduranceLine` derives a siege figure, printed as the answer |
| 3 | does anyone here work magic | `magicReliance.js :: magicPractitioners` | A | component: the Magic tab reads `deriveMagicReliance` (dependents) and `magicProfile` (the dial) beside Defense's census |
| 4 | who leads, by how much | none: the record's `powerStructure.factions[].power` | B | composer: `power/factionStanding.js` (the rank-2 branch never reads the leader) |
| 5a | is the hall in criminal hands | `hallCapture.js :: writeHallCapture` (`criminalCaptureState`) | A | picker: `powerStateProse.js :: capturePoolKey` falls through to the legitimacy breakdown |
| 5b | how crime is organised | `crimeSignal.js :: crimeSignalOf` | A | component: `defenseDisplay.js :: deriveCriminalStructure`'s name ladder outranks the signal |
| 6 | what the town imports | none: the printed list is composed inline in `EconomicsTab.jsx` | A | composer: `validationOnPage.js :: resourceGapLines` reads `primaryImports` only |
| 7a | who founded the town | none: the record field `history.founding.foundedBy` | A | picker: `narrativeGenerator.js`'s `reason` pool names founders of its own |
| 7b | is there a wharf | the world law's `portKind` (read by `settlementOriginProse.js`) | B | picker: `narrativeData.js`'s port reasons assert a harbour |
| 8 | is there a church | `faithReading.js` (`churches` / `accessOnly`) | B (+A) | picker: `incomeWeightPoolKey` (influence ≥ 60); component: `SupplyChainsPanel.jsx :: chainFlowFacts` presence by first word |
| 9 | is the defence against beasts adequate | none: threat (config family) and readiness (score) are two homes | A | picker: `defenseStateProse.js :: beastsRowPoolKey` beside the readiness grade |
| 10 | are there gates | `defenseFacts.js :: defenseFactsOf` (`hasWalls`) | B | picker: `institutionDescDraw.js :: drawInstitutionDesc`, undeclared variants |
| 11 | what carries the chain | none: the chain's `resourceActive` / `substituteActive` flags, unread | B | component: `chainFlowFacts` prints `chain.resource` |
| F4 | is the resource worked here | none: the roster + `activeChains` | B | composer: `economicState.js :: generateEconomicState` income blocks |
| 13 | — (an authored slip) | — | C | picker: DS-DEF-9 `magicDependency false`, vid 3 |
| 14 | how big the place is | `populationBand.js` | B | picker: the foodways rows unwrapped by `.map(textOf)`; composer: the history disaster tokens |
| 16a | how many sit at the head | the patronage view's seat list (its length) | B | component: `WhoRunsThisTownPanel.jsx`, a fixed title |
| 16b | which powers there are | none: contenders and roster are two lists | A | component: `power/PowerStrata.jsx`, one title over both |
| 17 | what is produced | `tradeListDeclarations.js :: NOT_A_GOOD` + `displayTradeList` | C | component: `EconomicsTab.jsx` prints `localProduction` raw |
| 18 | what the house is called, is it here | `institutionDisplayName.js :: institutionDisplayName` (leaks on fallthrough); the roster | C | component: flow cards, the NPC card's house label |
| 19 | — (a diagnostic) | — | C | composer: `economy/viability.js` (the trade-dependency issue template) |
| 20 | is the town besieged | `foodSecurity.hasSiege` | B | composer: `foodEnduranceLine` (reads it for its opening, prints the rest in the indicative) |
| NEW-1 | how well defended | `defenseProfile.readiness` (`defenseGenerator.js`) | A | composer: `power/governanceNarrative.js :: deriveBaselineStability` reads `militaryEffective` |
| NEW-2 | does anyone here work magic | `magicReliance.js :: magicPractitioners` | B | picker: `incomeWeightPoolKey` (magic branch) |

**By door:** pickers 11, composers 8, components 8 (8 and 14 have two doors).
- The pickers are where class B lives.
- The components are where A and C meet: a component that tests presence or prints a name itself.

## 2. The habitat, counted in source

### Class B: words that state or presume what they do not read (EXECUTED: `habitat.mjs`)

**Test.** Every string or template fragment or JSX text of three words or more, not an object key. "Names a thing" is the presumed-things walker's own `thingsNamedIn`, over its registered things: walls, garrison, militia, watch, mercenary, docks, granary, mill, market, temple, prison, court, bank, guildhall, war, law. "Undeclared" is the walker's own `scanSource` (literal × thing pairs). The size, state and count words are *regex*:
- **size:** urban, dense populations, districts, quarters, metropolitan;
- **state:** under siege, besieged, famine, plague, occupied, blockade, starving, wartime;
- **count:** the two/three/four, three powers.

"Declared" for those means the literal sits in an object carrying `needs`, `excludes`, `tags`, `marks`, `cast`, `poolDeclares` or `requires`.

| root | literals | name a registered thing | thing pairs undeclared | size (declared) | state (declared) | count (declared) |
|---|---|---|---|---|---|---|
| `src/data` (walker root) | 12,606 | 937 | 637 | 145 (47) | 96 (48) | 55 (18) |
| `src/generators` (walker root) | 3,643 | 319 | 242 | 45 (7) | 31 (3) | 17 (2) |
| `src/domain` (**no walker**) | 18,209 | 1,366 | 1,388 | 69 (0) | 306 (5) | 226 (9) |
| `src/components` (**no walker**) | 4,930 | 87 | 69 | 2 (0) | 32 (0) | 11 (0) |

- **Inside the walker's roots:** 879 undeclared pairs are held by the register's 870 grandfathered rows. The walker is green, so it stops only *new* ones.
- **Outside its roots** (`src/domain`, `src/components`): 1,453 literals name a thing, 1,457 pairs are undeclared, and nothing reads them. Patterns 10's static line, 16a, 20 and 2 were born there.
- **Sizes, states and counts are not registered things at all.** Of 711 literals carrying one, 139 sit beside any declaration.
- **The DS prose corpus:** 2,779 variants in 856 pools across 69 blocks. **0** of them carry a `needs` declaration. A variant is chosen by its pool key alone (151 exported `…PoolKey` functions in `src/domain/display/stateProse`). 1a, 1b, 5a, 8, 9, 13 and NEW-2 came through this door: a key that reads fewer facts than its sentences assert.
- **Pickers that enforce a declaration:** `drawDeclared` 30 call sites, `filterDeclared` 8, `drawAdmitted` 6, `agreeingLine` 2. **46 in all.**
- **Bare pickers:** `pick(` 121, `pickRandom` 56, `.pick(` 54, `pickVariant` 12, `[offset % …]` 4. **247.** Not every one draws a declared pool; this is the habitat's upper bound.
- **Pickers that drop a declaration:** 12 strip-shaped sites (`.map(textOf)` 7, `.map(lineText)` 1, `map(l => l.text)` 4). Read one by one, **3 strip a declared pool before a draw**:
  - `foodGenerator.js` (the foodways rows: pattern 14);
  - `spatialGenerator.js` ×2: `{ text: "Dyer's Bridge", needs: ['river'] }` and `{ text: "The Rat's Nest (tavern)", needs: ['institution: tavern'] }`, landmarks drawn with their declarations removed. **A member not yet named.** Its printed rate was not measured.

  The other 9 are dedupe or joins, not draws. The charter's "pressure sentence, sixteen declaring lines" and "twenty-six culture lines" draw by other shapes, and this regex does not see them.

### Class A: page facts with more than one printed derivation

**The facts and their sites (from the census, each EXECUTED there):**

| fact | derivation 1 | derivation 2 (and 3) |
|---|---|---|
| fed / bought in | `foodSecurity.label` → `foodSecurityPoolKey` | the food record → `EconomicsTab.jsx :: foodSentence` |
| stores months | `storesMonthsOf` → `foodStoresWords` | `foodEnduranceOf` → `foodEnduranceLine` |
| magic here | `magicPractitioners` (Defense) | `magicDependents` (Magic reliance); `magicProfile` (dial availability) |
| criminal capture | `writeHallCapture` (the hall card) | `capturePoolKey` (the crime desk) |
| criminal structure | `crimeSignalOf` | `deriveCriminalStructure`'s name ladder |
| imports | `economicState.primaryImports` (gap reader) | `EconomicsTab.jsx`'s inline composition (+ `resourceAnalysis.imports.critical`) |
| founder | `founding.foundedBy` | `founding.reason` |
| beasts readiness | the readiness score (grade) | `beastsRowPoolKey`'s situation |
| the powers | `ThePowers` (contenders) | the roster section |
| defence posture | `defenseProfile.readiness` | `deriveBaselineStability` (`militaryEffective`) |
| a house is here | the roster | `chainFlowFacts`' first-word test (8's flow half, 18) |

**11 facts.** For 5 of them (imports, founder, beasts readiness, the powers, presence on a card) no leaf exists that both derivations could read.

**Where a fact is re-derived from house names outside its home (*regex*).** The test: `.includes|startsWith|indexOf('<house stem>')` or `/<house stem>/.test(`, over 44 catalogue stems (smith, quarr, sawmill, church, temple, market, wall, gate, watch, garrison, court, guild, thieves, fence, gang, wizard, mage, healer, dock, wharf, tavern, …), outside `src/domain/facts/` and `src/domain/defense/`:
- `src/generators`: **194 lines in 26 files**
- `src/domain`: **56 lines in 24 files**
- `src/components`: **2 lines in 1 file**
- plus **66** `hasInst…('…')` helper calls in 6 files
- against **1** such line inside the homes

**The homes that exist:** 24 leaves in `src/domain/facts/` (market, magic, defence, famine, populationBand, storesMonths, water, …).
- The defence-reader walker guards one family: 27 registered private readers.
- **Every other fact family has no walker.**

### Class C: catalogue or record strings printed through no display leaf (*regex*, `src/components`)

**The display leaves:** `institutionDisplayName.js`, `resourceDisplayName.js`, `labelCase.js`, `tradeListDisplay.js` (4 files).
- `institutionDisplayName(` is called from 13 component sites.
- The leaf itself passes any name its table lacks raw, so the leaf leaks (pattern 18).

**Direct prints** of a record field in JSX (`{x.name}`, `{x.label}`, `{x.title}`, `{x.role}`, `{x.source}`, `{x.faction}`, `{x.resource}`): **537 in 192 files**. By field: name 246, label 224, title 28, role 17, source 12, faction 8, resource 2. An upper bound: many `label`s are the interface's own words, not record strings.

**Record arrays mapped straight to the page:** 4 sites; 1 through a leaf, **3 raw**:
- `EconomicsTab.jsx` `localProduction` (pattern 17);
- `EconomicsTab.jsx` chain `outputs`;
- `neighbourComponents.jsx` `tradeGoods`.

**Authored or internal text:** the style walker holds struck phrases at zero, but nothing reads a DS variant for a repeated clause (13) or a generator issue template for a diagnostic shape (19).

## 3. The class cures: one structural change each

### Class A — ONE FACT, ONE LEAF

**The change.** Generalise the defence-reader walker (`tests/lint/defenceFactReaders.*`) into a **fact-reader walker** over every homed fact in `src/domain/facts/`:
- A test of house names, or a second derivation of a homed fact outside its leaf, reds in the lane that writes it.
- The register is shrink-only and banks the habitat (~250 lines, 66 helper calls).

It comes with **the five leaves that do not exist yet:** imports-as-printed, the founder, beasts readiness against threat, the list of powers, and presence on a card. A homed reading is printed through its leaf or not at all.

**What it does to the named patterns:**
- **Closes outright** (the cure *is* reading the leaf): 5b, 6, 16b, NEW-1, and 8's and 18's presence half.
- **Still needs a hand cure:** 2 (two true quantities; the wording), 3 (where the magic comes from), 5a (the desk keyed on the stored state), 7a (the founder twin) and 9 (authored text for settled-and-weak).

### Class B — DECLARE OR DO NOT PRINT

**The change.** Extend the presumed-things walker four ways:
- **(i) Roots:** `src/domain` and `src/components`. 1,457 pairs banked, new ones red.
- **(ii) Vocabularies:** states, sizes and counts become registered things beside the sixteen houses.
- **(iii) Strips:** a ban on unwrapping a declared pool before a draw. Only `drawDeclared` / `filterDeclared` may select from a pool that carries declarations. 3 strip sites today.
- **(iv) A pool-key arm:** a DS variant declares the facts its sentence asserts, and its key must read them. 2,779 variants, 0 declared today.

New members then red at source. The existing ones are banked and cured by hand.

**What it does to the named patterns:**
- **Red at source once (ii) and (iii) land, so a re-take cannot regress:** 14 (foodways), 10, 20, 16a, 7b.
- **Still need hand cures and authored text:** 1a, 1b, 8 (income half), NEW-2, 4, 11 and F4. Their claims are about numbers and record flags, not registered things.

### Class C — THE PAGE PRINTS THROUGH A LEAF

**The change.** Add a **display-leaf walker** over `src/components`: a record string field or record array reaches JSX only through a display leaf (`institutionDisplayName`, `resourceDisplayName`, `displayTradeList`, `labelCase`), with a register banking the 537 / 3. Then give the leaves themselves a *total* pin over the catalogue: no count range, no `NOT_A_GOOD`, no engine token survives a leaf.

**What it does to the named patterns:**
- **Closes outright:** 17, 18.
- **Hand cures:** 13 and 19, one line each. The style walker holds the struck clause and the diagnostic's template at zero.

## 4. A re-cut of the second wave's page lanes by class

The four page lanes (W2-PAGE-ECONOMY, W2-PAGE-DESKS, W2-WORDS, W2-POWER) become **three class lanes**. **W2-POOLS stays as it is.** Every file has exactly one owner, and the nine NEW members (1a, 4, 5a, 5b, 7b, 8, 16a, 16b, NEW-2) go first inside each lane.

The shared files are split so that no two lanes hold one at once:
- **`EconomicsTab.jsx`, `SupplyChainsPanel.jsx`:** C's alone. A makes the imports leaf; C makes the tab print through it.
- **The corpus document and its generated files:** B's alone. A's 5a takes "say nothing at none", so A needs no new corpus text. 9's authored situation is B's to write.
- **`coherenceBattery.js` (the page battery's registration):** A's. B and C hand in findings files, and A registers them.

**Lane 1, W2-A-LEAVES: one fact, one leaf.** Display stage, seated now:
- NEW first: **5a, 5b**; then 6 (the leaf and the gap reader), 2 + 20, 3.
- After the powers and upkeep lanes merge: **16b**, NEW-1, 9.
- *Files:* `powerStateProse.js`, `defenseDisplay.js`, `validationOnPage.js`, `tradeListDisplay.js`, `MagicTab.jsx` + the view-model's reliance view, `coherenceBattery.js`, the rendered-dossier arm, and the new fact-reader walker with its register. Later: `PowerStrata.jsx`, `governanceNarrative.js`, `defenseStateProse.js`.

**Lane 2, W2-B-DECLARE: declare or do not print.** Display stage, seated now:
- NEW first: **8** (the income half) **+ NEW-2, 1a**; then 1b, 13 (the corpus holder).
- Generator stage after the agreement, upkeep and powers lanes merge: NEW first, **7b, 4, 16a**; then 7a (rides with 7b by file), 10, 14, F4, and the strip ban.
- *Files:* `economyStateProse.js`, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` and its generated files, `tests/lint/presumedThings.*`. Later: `narrativeGenerator.js`, `narrativeData.js`, `institutionDescVariants.js`, `institutionVocabulary.js`, `factionStanding.js`, `WhoRunsThisTownPanel.jsx`, `foodGenerator.js`, `cultureProfiles.js`, `historyTemplate.js`, `historyEventStrands.js`, `economicState.js`, `spatialGenerator.js`.

**Lane 3, W2-C-LEAVES: the page prints through a leaf.** Seated now:
- NEW first: **8's flow-card half** (an access row is access); then 18, 17, 11 (the chain-carrier leaf, which the card and the three PDF chain writers read), 19.
- *Files:* `SupplyChainsPanel.jsx`, `EconomicsTab.jsx`, `institutionDisplayName.js`, `tradeListDeclarations.js`, the new carrier leaf, the three PDF chain writers, `viability.js`, and the display-leaf walker with its register.
- *Ordering:* rebases once on Lane 1's imports-leaf commit.

**W2-POOLS:** unchanged.

**What I did not do.** I did not re-measure any rate here; the rates are the census's. The spatial landmarks member was found in source and its rate is unmeasured. Every *regex* count above is a shape count, not a census of printed lines.
