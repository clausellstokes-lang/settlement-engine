# BAR5-AUDIT-A · hand-back (seat A: LAW 1 and LAW 4)

**The tree read.** `lane/join-2026-11-14` at `9867b4b17` (the tip as named). It was rendered in a scratch worktree with its own `npm ci`, through PAGE-COPY's `census3.sh … --count-only`. Every render exited 0:

- the sixty read towns;
- the census's 720;
- the fresh 300.

**What counts as the page.** Only the DOSSIER tabs (Summary, Systems, World, Notes). The Tonight sheet, the PDF and the Journal print the same records again and are not counted.

**Nothing is cured.** No line under `src/` changed, and no test file was added.

**The files:**

- the detectors: `tests/helpers/pageLaws/page.mjs`, `law1.mjs`, `law4.mjs` (pure, `{ record, tabs, town }` → instances);
- the runner: `run-a.mjs`;
- the controls: `controls-a.mjs`;
- the tables: `tables-a.mjs`, which writes [`TABLES-A.md`](TABLES-A.md) (the full tables);
- the precision draws: [`PRECISION-A.seed516.md`](PRECISION-A.seed516.md) and [`PRECISION-A.seed517.md`](PRECISION-A.seed517.md) (`sample-a.mjs`).

To run it again: render with PAGE-COPY, then `node run-a.mjs <render-dir> <out.json> [final72.json final75.json]`.

## 1. The controls: both laws are counted

On the sixty, as finally narrowed, every STANDS control of LAW 1 and LAW 4 is found and no EXPLAINED control is. The table is in TABLES-A.md § controls.

| law | STANDS found | EXPLAINED found | WEAK (reported apart) |
|---|---|---|---|
| 1a magic | 5 / 5 (C17061 C29831 C9617 C33713 C43125) | 0 / 2 (C31972 C40444) | — |
| 1b food | 1 / 1 (C40276) | 0 / 1 (C33652) | — |
| 1c power and force | 5 / 5 (C33631 C35627 C39734 C43925 C38889) | — | — |
| 1d prosperity and stability | 1 / 1 (C32519) | 0 / 1 (C16520) | — |
| 4 things the town lacks | 7 / 7 (C44306 C42840 C15951 C30295 C22786 C2000 C39999) | — | C42731 and C31115: found only by 4r, the register pass. C31780 ("civilian courts") and C37631 ("several quarters"): not found, because the register's court words are "courthouse / court of law" and its quarter words need a qualifier. |

**The read before's STANDS of these kinds (final75), which the round since cured.** At this tree, 12 of 15 no longer print in their towns. Three still print:

- **C24951** ("marked the temple district", World/History, `bar0-metropolis-calm-rand-21`). It still prints, twice, beside "The affected district is slowly spreading". **This is a finding:** the cure did not reach it.
- **C31074** (magic "help beyond ordinary work", `bar0-metropolis-calm-rand-23`). It still prints, but the page's word there is Relied upon, so it is no LAW 1 fault. Its fault is the fished-out fishery, which is LAW 3's (seat B).
- **C7336** (the "well paid" guard). It still prints, but its other end, the unpaid-guard hook C6022, no longer prints, so the pair is cured.

## 2. The counts

Full tables, the thirty commonest distinct lines per law, and the writer files are in TABLES-A.md.

| law (as narrowed) | sixty: towns · instances · distinct | 720 | fresh 300 |
|---|---|---|---|
| LAW 1, all | 16 · 20 · 11 | 79 · 90 · 40 | 29 · 33 · 18 |
| 1a-depends/None | 5 · 7 · 4 | 23 · 24 · 23 | 9 · 10 · 9 |
| 1b-reassures/Pressured | 1 · 1 · 1 | 3 · 3 · 3 | 1 · 1 · 1 |
| 1c-npc/marginal | 6 · 6 · 1 | 41 · 41 · 1 | 15 · 15 · 1 |
| 1c-weight/Suppressed | 2 · 2 · 1 | 10 · 12 · 6 | 3 · 3 · 3 |
| 1c-force/roster | 2 · 2 · 2 | 9 · 9 · 6 | 3 · 3 · 3 |
| 1c-norival (outranked, occupied) | 1 · 1 · 1 | 1 · 1 · 1 | 1 · 1 · 1 |
| 1d-up/underfunded | 1 · 1 · 1 | 0 | 0 |
| LAW 4 (4n), all | 11 · 13 · 10 | 76 · 80 · 53 | 41 · 42 · 27 |
| 4n-notary | 3 · 4 · 4 | 46 · 49 · 47 | 22 · 23 · 23 |
| 4n-founding ("Founded roadside") | 2 · 2 · 1 | 23 · 23 · 1 | 9 · 9 · 1 |
| 4n-weeks | 2 · 2 · 1 | 1 · 1 · 1 | 7 · 7 · 1 |
| 4n-lord | 2 · 2 · 1 | 4 · 4 · 1 | 2 · 2 · 1 |
| 4n-clay | 1 · 1 · 1 | 2 · 2 · 2 | 0 |
| 4n-oldnew | 1 · 1 · 1 | 1 · 1 · 1 | 1 · 1 · 1 |
| 4n-patron | 1 · 1 · 1 | 0 | 0 |
| either law | 23 · 33 · 21 | 144 · 170 · 93 | 68 · 75 · 45 |

**Each LAW 4 thing on the 720** (towns that name it · distinct lines naming it · towns that print one without the thing; the 300 is in TABLES-A.md):

| thing | towns naming · lines · towns without |
|---|---|
| notary | 332 · 352 · 46 |
| lord | 156 · 186 · 4 |
| fired clay | 254 · 14 · 2 |
| a count of weeks | 302 · 42 · 1 |
| "Founded roadside" | 67 · 1 · 23 |
| old buildings | 45 · 45 · 1 |
| patron's post | 106 · 1 · 0 |

**The two-facts splits, the brief's 1b count** (TABLES-A.md § splits):

- **Food.** The stored label reads Secure while the page prints Pressured in **10 of the sixty, 146 of the 720 (20%) and 59 of the 300**.
  - The stored Import-Dependent prints as Deficit in 2, 5 and 6.
  - The Import-dependent towns the page prints as such (9 of 720) are now read too (the word pattern was mended for the case).
- **Magic.** The record reads relied-upon (or integral) while the page prints a lower word:
  - **None:** 3 of the sixty, 22 of the 720, 8 of the 300;
  - **Present:** 4 of the 720;
  - **Relied upon over a recorded integral:** 2, 50 and 10.

## 3. Precision (the 720, seeded, judged against the page by the second check's rules)

**The first draw (seed 516), on the first cut:**

- **LAW 1: 16 STANDS · 2 WEAK · 2 EXPLAINED, so it was narrowed.**
  - 1-14 and 1-19 (EXPLAINED): a reassurance "a poor year in one does not empty the tables" in towns with 16 and 9 months in a granary.
  - 1-12 (WEAK): "nobody is going without bread" in a town a little short.
  - 1-11 (WEAK): Present beside "Infrastructure role: integral", where the role line supports the sentence.
- **LAW 4n: 12 STANDS · 3 WEAK · 5 EXPLAINED, so it was narrowed.**
  - 1, 10, 15, 16, 19 (EXPLAINED): "A share goes to the lord **or** municipality", a hedge.
  - 6, 7, 8 (WEAK): "The road was here first. The settlement grew along its verge" beside a healer's, a stronghold's or a disbanded unit's founding. It describes growth along a road, not a founding for it.

**The narrowings.** Each is marked `PRECISION (720 draw, seed 516)` in the source:

- 1b is not read where six months or more are put by, and "without bread" is dropped.
- 1a under Present is not read where a role prints integral or common.
- 4n-lord spares "the lord or" and "no overlord", and a person on the roster whose role is a lord.
- 4n-founding reads "Founded roadside" only.
- 4n-clay leaves the chains' rungs (`→`) to LAW 3.

The controls were re-run after the narrowing: every STANDS row found, no EXPLAINED row.

**The second draw (seed 517), on the narrowed cut:**

| law | STANDS | WEAK | EXPLAINED | stands |
|---|---|---|---|---|
| LAW 1 (20 of 90) | 20 | 0 | 0 | **20 / 20** |
| LAW 4n (20 of 80) | 19 | 1 | 0 | **19 / 20** |
| 4r, the register's vocabulary on the page (apart) | 0 | 2 | 18 | **0 / 20** |

- **LAW 1.** 13 of the 20 are the ONE person-card line (1c-npc). The others are 3 of 1a, 3 of 1c-force and 1 of 1c-weight.
- **LAW 4n.** The WEAK one is 4-19: "Founded roadside" beside a defensive stronghold at a trade-route checkpoint.
- **4r.** It names headings ("Disasters & Famine"), past events ("The Occupation · Political"), worked-out resources the page itself marks, and catalogue lines. This confirms the register's own `PAGE_WITHDRAWN`. 4r is reported, never counted.

**What the draws do not cover.** 1d (one instance in all three populations: C32519 itself), 1c-norival (one in each population, each the C38889 shape) and 4n-weeks, oldnew and patron are too rare to be drawn. Each instance of them is the control's own shape and is listed in TABLES-A.md.

## 4. The cure's form, proposed, not made (files by owner)

### LAW 1

**1a MAGIC: ONE FACT CURES THE SHARE ON THE MAGIC TAB.**

- *Where the two facts are written.*
  - The record's reading is `src/domain/magicReliance.js :: deriveMagicReliance`. `src/generators/defenseGenerator.js :: generateDefenseProfile` stores it as `defenseProfile.magicDependency` (and `scores.magicDependency`).
  - The page's word is `src/domain/display/dossierViewModel.js :: deriveMagicRelianceView`, which lowers it through `src/domain/display/magicProvisionShown.js :: relianceReadingShown` (BAR2-LABELS LB1).
- *Which lines read which.*
  - The role lines and the word read the shown reading.
  - The DS-DEF-9 desk sentence (`src/domain/display/stateProse/defenseStateProse.js :: defenseMagicDependencyProse` → `reliesOnMagic`) re-derives `deriveMagicReliance` itself, the record's reading. It ignores the shown reading that `magicRelianceDeskSettlement` (`src/components/new/magicDeskRead.js`) writes into `defenseProfile.magicDependency` for it.
  - The stored flag is also read by `src/components/new/dailyLifeLogic.js` (`dp.magicDependency`) and `src/domain/worldPulse/stressorGates.js`.
- *The cure.* `reliesOnMagic` reads the shown reading (or the `defenseProfile.magicDependency` the desk view hands it). Then the DS-DEF-9 lines (22 of the 23 distinct 1a lines on the 720; `defense.generated.js` DS-DEF-9 › "magicDependency true, with a NAMED dependent chain" v1–v3), follow the word.
- *Left line by line.* `src/generators/narrativeText.js` `magical_heavy` "The settlement relies on arcane workings it does not entirely trust" (`needs: ['magic']`, which reads magic's presence) needs a reliance atom (relied-upon or integral). The same applies to its sibling "more dependent on arcane resources".
- *Owner.* The magic and defence state-prose lane.

**1b FOOD: TWO FACTS FOR ONE THING.**

- *Where they are written.* The page's word is `src/domain/display/foodWordShown.js` → `src/domain/summary/tonightSheet.js :: foodBandOf` (band secure with `gapPct` > 0 → Pressured; Import-Dependent with no imports → Deficit). It is printed on the Overview, Foundations, Daily Life, Tonight and PDF. The stored word is `economicState.foodSecurity.label`.
- *Which pools read which.*
  - DS-ECO-9's security rung keys on the STORED label (`src/domain/display/stateProse/economyStateProse.js :: foodSecurityPoolKey(eco.foodSecurity.label)`).
  - DS-ECO-9's food-sources lens (`foodSourcesPoolKey`) keys on the number of sources alone. It writes the reassurances "a poor year in one does not empty the … tables" and "can take a bad season in one source without going hungry" (C40276) whatever the gap.
- *The cure.*
  - ONE fact: the generator writes the label from `foodBandOf`, or the rung key reads `foodWordShown`.
  - The reassuring variants of the food-sources lens declare `gapPct` 0, or stores that cover a poor year.
- *Owner.* The economy state-prose lane.

**1c POWER AND FORCE: THE STOCK DESCRIPTIONS ARE WRITTEN BEFORE THE STANDING.**

- **The weight claims** (1c-weight, 12 on the 720).
  - They come from `src/generators/power/rulingStructure.js :: generatePowerStructure`: the religious branch at l.610 ("meaningful civic influence") and the military "Significant military presence … political influence disproportionate".
  - The description is chosen from the RAW power at generation. The standing word is assigned afterwards from the final power (`src/generators/factionDynamics.js` l.744 `powerLabelOf`, `src/generators/power/economyReconciliation.js` l.321).
  - The cure: draw the description from the final label, or re-draw it where reconciliation moves the label below Significant.
- **The force claims** (1c-force, 9).
  - The same file's military description is keyed on `priorities.military` and the tier ("Armed patrol of able-bodied residents" in a thorp, hamlet or village; "Town watch; …"; "Significant military force for this scale"), never on the roster.
  - The fact it should read is `defenseProfile.institutions` / `src/domain/facts/defence.js` (militia, watch, garrison).
  - The cure: key the branch on the roster.
- **The person's card** (1c-npc, 41 of 720, ONE line).
  - `src/generators/npcStructure.js` l.310, `reg(cat,'stable')` CALM_ONLY: "Heads the leading house in the trade in quiet times; its hold is secure and its say is real". It is keyed on the town's condition and the house rank.
  - The same card's "Standing marginal" reads the person's influence (`src/domain/display/npcInteriorityRead.js` `INFLUENCE_WORD`, low → marginal).
  - The cure, ONE line: the position reads the influence band (or a twin for low influence). This is the commonest single LAW 1 line.
- **"No rival yet outweighs"** (1c-norival).
  - `power.generated.js` DS-POW-4 › "riskLabel: Holding" v3 (`src/domain/display/stateProse/powerStateProse.js`) keys on the risk label alone.
  - The cure: declare "no rival above" (no power with a higher standing word) and "not occupied".
- *Owner.* The power lane.

**1d PROSPERITY AND STABILITY.**

- DS-ECO-8 › MODERATE ("pays its own way and has a little in hand") keys on prosperity. The stability word "Tense (militarised, chronically underfunded)" is the stability writer's.
- It occurs once in 1,080 towns, the control itself. Line by line: the "underfunded" stability variant should read the same purse that DS-ECO-8 reads.
- *Owner.* The power lane (stability) and the economy lane.

### LAW 4

**The register's vocabulary to widen.** The cure the register already enforces at source (the walker's ARM 1 asks an undeclared line to declare an atom), given new things:

- **notary** (`\bnotar(y|ies)\b`).
  - Absent where no notary, scribe, court or legal house or service stands; the vocabulary has `court` and needs a legal-house atom.
  - ONE line, `src/data/npcData.js:2182` (the mutual-leverage tension "… left a copy with a notary.", `colour: true`), prints in **46 of the 720 and 22 of the 300 towns without one**. It is the commonest LAW 4 line.
  - Cure: declare the atom, or a twin ("left a copy with someone they trust").
- **lord** (`the lord('s)`, `liege`, `overlord`, in lower case).
  - Absent where no lord, noble, crown or appointee power, house, person or neighbour stands.
  - `src/data/institutionServices.js` l.47 "Tithe and dues" ("Collects the lord's dues and the tithe", `needs: ["institution: temple"]` only).
- **fired clay.** `src/data/arrivalProse.js` l.256 "Kiln smoke hangs over …, and the dust of fired clay is on everything" declares `needs: ['trade at work: kilns']`. A charcoal burner's kilns answer that atom: **two things for one word**. Split the atom (clay kilns, charcoal kilns). The two 720 instances are `src/data/cultureProfiles.js` (architectural details) and `src/data/narrativeData.js` STRESS_DESCS.plague_onset.

**Facts the line should read:**

- **The founding** (23 of 720, 9 of 300, ONE row).
  - `src/generators/narrative/settlementOriginProse.js` l.100 `ORIGIN_POOLS` "Founded roadside, where the day is measured in traffic …" is drawn from the route.
  - The file's own note (l.97) says the rung is drawn before the History. The fact is `history.founding.reason`.
  - The cure: draw the rung after the founding, or keep the founding claim out of the road row (the "Sited on" and "Established along" rows assert no founding).
- **The weeks** (1 of 720, **7 of 300**).
  - `src/data/stressInstitutionEffects.js` l.35, the secret "… to someone in the besieging camp three weeks ago".
  - The siege's own age is `pressureSentence` ("The siege has entered its second week").
  - The cure: the secret's count is a slot from that age, or it carries no count.
- **The old buildings** (1 · 1 · 1). `economy.generated.js` DS-ECO-8 › POOR v3 against the History's "looks recently built" (the town's age). The POOR variant should declare an age.
- **The patron** (1 in the sixty). `src/domain/hookThemes.js` AUTHORED_HOOK_THEMES "They owe their post to a patron …" against the household elder's card "Nobody named them to it". The hook should not draw for a holder of no appointment.

**Left line by line.** The WEAK rows (C31780 "civilian courts" where no courthouse stands; C37631 "Several quarters" for a town of 329; C42731 "at market"; C31115 "the outer wall"). The register's own words reach two of them; the other two need its court and quarters words widened, and they stay WEAK by the second check.

## 5. LAW 5's inventory

LAW 5 is seat B's; this seat does not build it.

## 6. FOR THE OWNER, IN PLAIN WORDS

**How deep the stock is.** Of 1,080 towns rendered fresh at today's tree, about one in five (144 of the 720 and 68 of the 300) prints at least one sentence that contradicts its own page under these two laws. When a sample of 20 from each law was checked by hand, nearly all of them stood (20 of 20 and 19 of 20).

**It is not many different sentences.** It is a handful of lines, each printed in many towns:

| line | towns |
|---|---|
| a debt "left with a notary" in a place with no notary | 46 of 720 |
| a merchant card saying "its hold is secure" above "Standing marginal" | 41 |
| "part of the town's work holds up only with help beyond ordinary labour" under "Reliance on magic: None" | 22 |
| "Founded roadside" in a town the History founds elsewhere | 23 |

About forty distinct LAW 1 lines and fifty-three distinct LAW 4 lines cover the whole 720. Most of the fifty-three are the same notary sentence with different names.

**Where one fix cures many.** Five of them would remove most of the stock:

- the magic sentence reading the word the page prints;
- the food rung reading the printed food word, not the stored one;
- the power descriptions drawn after the standing is set;
- the notary and lord words added to the presumed-things register;
- the founding row drawn after the History.

**What stays the owner's.** Which reading is the true one (the record's or the page's) is a ruling, not a cure. That covers magic (22 towns print None over a record that says relied-upon) and food (146 of 720 print Pressured over a stored Secure).
