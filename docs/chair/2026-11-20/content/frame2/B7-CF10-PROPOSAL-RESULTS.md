# FRAME-2 · B7 — CF10 results: the crisis casts measured, and counterparts proposed

Builder B7 of FRAME-2, on `lane/frame-2-2026-11-20`, from the brief `B7-CF10-PROPOSAL.md` (HEAD `70381e96a`). Measured 2026-11-20 06:03–06:14 UTC; written 06:15–06:16 UTC (`date -u`). **A measurement and a proposal: no file under `src/` or `tests/` was changed.** Every figure below was produced by the scripts at the end, which read the working tree. The tree held another builder's uncommitted edits during the run (`src/components/{OutputContainer,TableView}.jsx`, `src/components/session/SessionMode.jsx`, `src/domain/summary/tonightSheet.js`, `src/foundry/journalPages.js`, `src/pdf/sections/TonightAtTheTable.jsx`, three tests). No file under `src/generators`, `src/domain/crisis`, `src/domain/tension` or `src/domain/dossier` imports any of them, so the generation path I measured is HEAD's.

## The pool, and how it was born

- **The kinds**: the 15 keys of `STRESS_TYPE_MAP` (`src/data/stressTypes.js`), which are exactly the keys of `CRISIS_NATURE` (`crisisCast.js`).
- **The birth**: I used the generator's own forced-stress option, `config.stressType` (`stressGenerator.js :: generateStress`, "Mode 1: Forced single"), called as `generateSettlementPipeline({ settType: tier, stressType: kind }, null, { seed, customContent: {} })`. Forced mode skips the tier gate, so I applied the probabilistic mode's gate myself: `slave_revolt` (`requiresTier: "town"`) was born at town, city and metropolis only.
- **The size**: **24 towns a kind, 360 in all**: 4 seeds a tier across the six tiers, and 8 a tier for `slave_revolt`. Seeds are `b7-<kind>-<tier>-<i>`. Every birth carried its kind (0 misses), and each carries ONE crisis, because forced mode returns one entry. So the two-crisis rules (contradictory pairs across crises, the per-town caps, the links) are **not exercised** by this pool.
- **What is read**: the cast exactly as generation stored it (`stress[].cast`, written by `generators/steps/resolveCrisisCast.js`), plus a slim copy of the roster, the powers, the ties and the seat (`rulingChainOf`).
- **Two extra counts, for the cost section**:
  - The 525-row generator golden master, regenerated from its manifest keys (`scripts/lib/golden-corpus-key.mjs :: manifestRows`) exactly as `tests/property/generatorGoldenMaster.test.js` does.
  - A natural pool (no forcing; 60 seeds a tier, 360 births), to show how often each kind is born.

## The face classes, and the thresholds (both declared in the script before any figure was read)

**The class of a cast row** (the first rule that matches wins):
1. the stand-in (a minted temporary person)
2. the seat-holder (`rulingChainOf(s).npc`)
3. the appointee: the title says "the lord's appointee" or "the occupying governor", an appointed face sent from outside
4. a force's commander: garrison commander, watch commander, captain or sergeant, castellan, militia, company or blade captain, marshal, or rank 1 in a military power that is not an outside power
5. the criminal power or its head: a member of a power `crimeSignalOf` seats
6. an outsider: a member of an outside power (Occupation Authority, the creditor, the infiltrator)
7. a guild's head: rank 1 in a non-criminal power named "guild"
8. a power's head: rank 1 in any other power
9. a trade's master: the face of a house
10. a member with no office

Rows that are not a person are classed as a power (house), the criminal power (house), an outside power (house), or an institution.

**A person by a tie** never occurs. That is by construction: no rule in `crisisCast.js` reads `relationships`.

**The owner's "usual three"** are flagged on every named-person row, independently of the class above, so a seat-holder who is also a guild's head counts. The three:
- the appointee, or a minted stand-in;
- a guild's head (rank 1 in a guild power, or a title "guild master");
- a garrison or watch commander (class 4's test).

**A kind is THIN when any of these holds:**
- **T1**: a required role is absent in at least **1/3** of the kind's towns.
- **T2**: the usual three hold at least **1/2** of the kind's named-person rows.
- **T3**: one office (the holder's title) holds a required role in at least **60%** of the kind's towns.

## The measure

### The summary (every kind)

| kind | towns | required role absent | usual three / named persons | commonest office per required role | verdict |
|---|---|---|---|---|---|
| under_siege | 24 | defender 29%, treater 0% | 30/44 (68%) | defender: the watch commander 33%; treater: the senior guild master 33% | THIN |
| famine | 24 | brunt 0%, lever 0% | 17/59 (29%) | brunt: the head shepherd 21%; lever: (minted stand-in) 33% | — |
| occupied | 24 | face 0% | 35/40 (88%) | face: the occupying governor 100% | THIN |
| politically_fractured | 24 | instigator 0%, target 0% | 17/58 (29%) | instigator: the bloc's speaker 21%; target: the head shepherd 25% | — |
| indebted | 24 | treater 0% | 14/31 (45%) | treater: the exchange master 17% | — |
| recently_betrayed | 24 | instigator 50%, target 0% | 19/45 (42%) | instigator: the priest 13%; target: the senior guild master 25% | THIN |
| infiltrated | 24 | instigator 58% | 9/17 (53%) | instigator: the innkeeper 8% | THIN |
| plague_onset | 24 | brunt 25%, lever 0% | 11/40 (28%) | brunt: the midwife 25%; lever: the apothecary 46% | — |
| succession_void | 24 | instigator 0%, target 0% | 4/35 (11%) | instigator: the lady 25%; target: (faction) 100% | — |
| monster_pressure | 24 | brunt 0%, lever 0% | 31/40 (78%) | brunt: (faction) 42%; lever: (minted stand-in) 46% | THIN |
| insurgency | 24 | instigator 33%, target 0% | 12/45 (27%) | instigator: (faction) 33%; target: the head shepherd 17% | THIN |
| religious_conversion | 24 | instigator 58%, target 0% | 17/40 (43%) | instigator: (faction) 8%; target: the senior guild master 25% | THIN |
| slave_revolt | 24 | instigator 0%, target 0% | 57/67 (85%) | instigator: the garrison commander 58%; target: the senior guild master 25% | THIN |
| wartime | 24 | defender 17% | 17/18 (94%) | defender: the watch commander 29% | THIN |
| mass_migration | 24 | brunt 21%, lever 0% | 10/39 (26%) | brunt: (faction) 25%; lever: the innkeeper 54% | — |

### under_siege (24 towns; required: defender, treater; occasional: profiteer)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| defender (req.) | 17/24 | a force's commander: 16; an institution (no person): 1 | the watch commander 8/24 (33%) | "no military, garrison or watch stands": 7 | 0 |
| treater (req.) | 24/24 | the seat-holder: 21; a guild's head: 3 | the senior guild master 8/24 (33%) | — | 0 |
| profiteer | 4/24 | a power's head: 2; a trade's master (a house's face): 2 | the priest 1/24 (4%) | "no one is named for it": 2 | 18 |

Named persons in the cast: 44; the usual three: 30 (68%) — garrison/watch commander 16, guild's head 14. **THIN: T2 usual three 30/44**

### famine (24 towns; required: brunt, lever; occasional: exploiter, scapegoat)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| brunt (req.) | 24/24 | a trade's master (a house's face): 13; the seat-holder: 8; a force's commander: 2; a power (house, no person): 1 | the head shepherd 5/24 (21%) | — | 0 |
| lever (req.) | 24/24 | a trade's master (a house's face): 13; the stand-in (minted): 8; the seat-holder: 3 | (minted stand-in) 8/24 (33%) | — | 0 |
| exploiter | 4/24 | a power's head: 2; a force's commander: 1; the criminal power or its head: 1 | the priest 1/24 (4%) | "no power gains": 3; "everyone who could already holds a role that contradicts this one": 1 | 16 |
| scapegoat | 8/24 | the seat-holder: 8 | the senior guild master 4/24 (17%) | — | 16 |

Named persons in the cast: 59; the usual three: 17 (29%) — appointee/stand-in 8, garrison/watch commander 3, guild's head 6. **not thin**

### occupied (24 towns; required: face; occasional: profiteer, collaborator)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| face (req.) | 24/24 | the appointee (lord's or occupier's): 24 | the occupying governor 24/24 (100%) | — | 0 |
| profiteer | 8/24 | the appointee (lord's or occupier's): 6; a force's commander: 2 | the occupying governor 6/24 (25%) | — | 16 |
| collaborator | 8/24 | a trade's master (a house's face): 3; a power's head: 2; a guild's head: 2; a force's commander: 1 | the priest 1/24 (4%) | "no one is named: no local power gains": 4; "no power gains": 2 | 10 |

Named persons in the cast: 40; the usual three: 35 (88%) — appointee/stand-in 30, guild's head 2, garrison/watch commander 3. **THIN: T3 face: the occupying governor 24/24; T2 usual three 35/40**

### politically_fractured (24 towns; required: instigator, target; occasional: waverer, scapegoat)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| instigator (req.) | 24/24 | a power's head: 17; a power (house, no person): 3; a guild's head: 2; a trade's master (a house's face): 1; a force's commander: 1 | the bloc's speaker 5/24 (21%) | — | 0 |
| target (req.) | 24/24 | the seat-holder: 24 | the head shepherd 6/24 (25%) | — | 0 |
| waverer | 8/24 | a power's head: 5; a force's commander: 2; a guild's head: 1 | the neutrals' broker 3/24 (13%) | — | 16 |
| scapegoat | 5/24 | the seat-holder: 5 | the head shepherd 2/24 (8%) | "legitimacy is not contested": 2 | 17 |

Named persons in the cast: 58; the usual three: 17 (29%) — guild's head 14, garrison/watch commander 3. **not thin**

### indebted (24 towns; required: treater; occasional: profiteer)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| treater (req.) | 24/24 | the seat-holder: 23; a guild's head: 1 | the exchange master 4/24 (17%) | — | 0 |
| profiteer | 7/24 | a power's head: 4; a force's commander: 2; a trade's master (a house's face): 1 | the master of the hunt 2/24 (8%) | "no one is named for it": 6 | 11 |

Named persons in the cast: 31; the usual three: 14 (45%) — garrison/watch commander 3, guild's head 11. **not thin**

### recently_betrayed (24 towns; required: instigator, target; occasional: waverer, scapegoat)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| instigator (req.) | 12/24 | a power's head: 7; a power (house, no person): 2; a guild's head: 1; a force's commander: 1; a trade's master (a house's face): 1 | the priest 3/24 (13%) | "no power gains": 12 | 0 |
| target (req.) | 24/24 | the seat-holder: 24 | the senior guild master 6/24 (25%) | — | 0 |
| waverer | 8/24 | a power's head: 4; a guild's head: 3; the seat-holder: 1 | the investigator 3/24 (13%) | "no power could go either way": 1 | 15 |
| scapegoat | 3/24 | the seat-holder: 3 | the head shepherd 2/24 (8%) | "legitimacy is not contested": 3 | 18 |

Named persons in the cast: 45; the usual three: 19 (42%) — guild's head 17, garrison/watch commander 2. **THIN: T1 instigator absent 12/24**

### infiltrated (24 towns; required: instigator; occasional: collaborator)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| instigator (req.) | 10/24 | a trade's master (a house's face): 4; a guild's head: 3; the criminal power or its head: 2; a power (house, no person): 1 | the innkeeper 2/24 (8%) | "an outside hand, unnamed": 14 | 0 |
| collaborator | 8/24 | the seat-holder: 2; a guild's head: 2; a trade's master (a house's face): 2; a power's head: 1; a force's commander: 1 | the innkeeper 2/24 (8%) | "no power gains": 7 | 9 |

Named persons in the cast: 17; the usual three: 9 (53%) — guild's head 8, garrison/watch commander 1. **THIN: T1 instigator absent 14/24; T2 usual three 9/17**

### plague_onset (24 towns; required: brunt, lever; occasional: exploiter, scapegoat)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| brunt (req.) | 18/24 | a trade's master (a house's face): 12; a power (house, no person): 5; a power's head: 1 | the midwife 6/24 (25%) | "no house's base is hit": 6 | 0 |
| lever (req.) | 24/24 | a trade's master (a house's face): 10; the stand-in (minted): 6; a power's head: 6; an institution (no person): 2 | the apothecary 11/24 (46%) | — | 0 |
| exploiter | 5/24 | a force's commander: 5 | the watch captain 3/24 (13%) | "no power gains": 4 | 15 |
| scapegoat | 0/24 | — | — | "neither the seat's house nor the lever's loses by it": 7; "legitimacy is not contested": 1 | 16 |

Named persons in the cast: 40; the usual three: 11 (28%) — appointee/stand-in 6, garrison/watch commander 5. **not thin**

### succession_void (24 towns; required: instigator, target; occasional: waverer, scapegoat)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| instigator (req.) | 24/24 | a power's head: 19; a power (house, no person): 3; a guild's head: 2 | the lady 6/24 (25%) | — | 0 |
| target (req.) | 24/24 | a power (house, no person): 24 | (faction) 24/24 (100%) | — | 0 |
| waverer | 14/24 | a power's head: 12; a guild's head: 2 | the lord 4/24 (17%) | — | 10 |
| scapegoat | 0/24 | — | — | "neither the seat's house nor the lever's loses by it": 3; "legitimacy is not contested": 3 | 18 |

Named persons in the cast: 35; the usual three: 4 (11%) — guild's head 4. **not thin**

### monster_pressure (24 towns; required: brunt, lever; occasional: exploiter, scapegoat)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| brunt (req.) | 24/24 | a power (house, no person): 10; a trade's master (a house's face): 7; a force's commander: 6; the seat-holder: 1 | (faction) 10/24 (42%) | — | 0 |
| lever (req.) | 24/24 | a force's commander: 12; the stand-in (minted): 11; an institution (no person): 1 | (minted stand-in) 11/24 (46%) | — | 0 |
| exploiter | 2/24 | a trade's master (a house's face): 1; a power's head: 1 | the midwife 1/24 (4%) | "no power gains": 5 | 17 |
| scapegoat | 1/24 | the seat-holder: 1 | the warehouse factor 1/24 (4%) | "neither the seat's house nor the lever's loses by it": 4 | 19 |

Named persons in the cast: 40; the usual three: 31 (78%) — appointee/stand-in 11, garrison/watch commander 19, guild's head 1. **THIN: T2 usual three 31/40**

### insurgency (24 towns; required: instigator, target; occasional: waverer, scapegoat)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| instigator (req.) | 16/24 | a power (house, no person): 8; a power's head: 5; a trade's master (a house's face): 2; the criminal power or its head: 1 | (faction) 8/24 (33%) | "no power gains": 8 | 0 |
| target (req.) | 24/24 | the seat-holder: 24 | the head shepherd 4/24 (17%) | — | 0 |
| waverer | 10/24 | the seat-holder: 5; a power's head: 4; a force's commander: 1 | the governor 3/24 (13%) | "no power could go either way": 3 | 11 |
| scapegoat | 3/24 | the seat-holder: 3 | the head shepherd 1/24 (4%) | "legitimacy is not contested": 1 | 20 |

Named persons in the cast: 45; the usual three: 12 (27%) — garrison/watch commander 1, guild's head 11. **THIN: T1 instigator absent 8/24**

### religious_conversion (24 towns; required: instigator, target; occasional: waverer, scapegoat)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| instigator (req.) | 10/24 | a power (house, no person): 2; a trade's master (a house's face): 2; a power's head: 2; a guild's head: 2; a force's commander: 1; the criminal power or its head: 1 | (faction) 2/24 (8%) | "no power gains": 14 | 0 |
| target (req.) | 24/24 | the seat-holder: 24 | the senior guild master 6/24 (25%) | — | 0 |
| waverer | 6/24 | a power's head: 3; the seat-holder: 3 | the lady 2/24 (8%) | "no power could go either way": 2 | 16 |
| scapegoat | 2/24 | the seat-holder: 2 | the peat-reeve 1/24 (4%) | "legitimacy is not contested": 2 | 20 |

Named persons in the cast: 40; the usual three: 17 (43%) — garrison/watch commander 1, guild's head 15, appointee/stand-in 1. **THIN: T1 instigator absent 14/24**

### slave_revolt (24 towns; required: instigator, target; occasional: waverer, scapegoat)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| instigator (req.) | 24/24 | a force's commander: 21; a power's head: 3 | the garrison commander 14/24 (58%) | — | 0 |
| target (req.) | 24/24 | the seat-holder: 24 | the senior guild master 6/24 (25%) | — | 0 |
| waverer | 11/24 | a force's commander: 10; a power's head: 1 | the garrison commander 7/24 (29%) | — | 13 |
| scapegoat | 8/24 | the seat-holder: 8 | the senior guild master 2/24 (8%) | — | 16 |

Named persons in the cast: 67; the usual three: 57 (85%) — garrison/watch commander 31, appointee/stand-in 3, guild's head 23. **THIN: T2 usual three 57/67**

### wartime (24 towns; required: defender; occasional: profiteer)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| defender (req.) | 20/24 | a force's commander: 17; an institution (no person): 3 | the watch commander 7/24 (29%) | "no military, garrison or watch stands": 4 | 0 |
| profiteer | 1/24 | a power's head: 1 | the dean 1/24 (4%) | "no one is named for it": 3 | 20 |

Named persons in the cast: 18; the usual three: 17 (94%) — garrison/watch commander 17. **THIN: T2 usual three 17/18**

### mass_migration (24 towns; required: brunt, lever; occasional: exploiter, scapegoat)

| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |
|---|---|---|---|---|---|
| brunt (req.) | 19/24 | a trade's master (a house's face): 10; a power (house, no person): 6; a power's head: 3 | (faction) 6/24 (25%) | "no house's base is hit": 5 | 0 |
| lever (req.) | 24/24 | a trade's master (a house's face): 12; the stand-in (minted): 8; a power's head: 3; a guild's head: 1 | the innkeeper 13/24 (54%) | — | 0 |
| exploiter | 2/24 | a force's commander: 1; the criminal power or its head: 1 | the charter master 1/24 (4%) | "no power gains": 5 | 17 |
| scapegoat | 0/24 | — | — | "neither the seat's house nor the lever's loses by it": 3; "legitimacy is not contested": 3 | 18 |

Named persons in the cast: 39; the usual three: 10 (26%) — appointee/stand-in 8, garrison/watch commander 1, guild's head 1. **not thin**


### indebted: the creditor (the raw line; read in §3 below)

Creditor power: {"Creditor's Representative (power 54)":3,"Creditor's Representative (power 47)":1,"Creditor's Representative (power 41)":2,"Creditor's Representative (power 28)":3,"Creditor's Representative (power 22)":2,"Creditor's Representative (power 17)":1,"Creditor's Representative (power 13)":2,"Creditor's Representative (power 12)":1,"Creditor's Representative (power 11)":1,"Creditor's Representative (power 10)":2,"Creditor's Representative (power 9)":6}. Its face: {"the creditor's agent":24}. Creditor in the cast as a row: 0/24. A criminal power seated: 8/24 {"town":1,"city":3,"metropolis":4}; at power ≥ 5: 8/24 {"town":1,"city":3,"metropolis":4}.
Across the pool, a criminal power at ≥ 5, by tier: thorp 0/56, hamlet 0/56, village 0/56, town 20/64, city 58/64, metropolis 60/64.

### The counterparts' reach (towns of the kind holding the fact; a person a cast role already holds is not counted)

| kind | outsider: a lodging keeper free | criminal power ≥ 5 (its head free) | trade's master the crisis touches, free | a tie of the matter | the crisis's own raised power has a face |
|---|---|---|---|---|---|
| under_siege | 13/24 | 10/24 | 14/24 | — | 0/24 |
| famine | 12/24 | 12/24 | — | — | 0/24 |
| occupied | 14/24 | 0/24 | 11/24 | — | 24/24 |
| politically_fractured | 11/24 | 8/24 | 7/24 | — | 0/24 |
| indebted | 17/24 | 8/24 | 11/24 | 21/24 | 24/24 |
| recently_betrayed | 12/24 | 8/24 | 8/24 | 10/24 | 24/24 |
| infiltrated | 13/24 | 6/24 | 13/24 | 11/24 | 24/24 |
| plague_onset | 14/24 | 9/24 | — | — | 0/24 |
| succession_void | 13/24 | 8/24 | — | — | 0/24 |
| monster_pressure | 16/24 | 8/24 | — | — | 0/24 |
| insurgency | 13/24 | 9/24 | 7/24 | — | 8/24 |
| religious_conversion | 14/24 | 7/24 | 13/24 | — | 10/24 |
| slave_revolt | 24/24 | 19/24 | 15/24 | — | 24/24 |
| wartime | 16/24 | 11/24 | 14/24 | — | 0/24 |
| mass_migration | 10/24 | 10/24 | — | — | 0/24 |

### Each proposal's reach on the towns it would touch, and the record of the drafted towns

| proposal: the towns it touches | towns | each rung's fact holds in | any rung |
|---|---|---|---|
| P1 occupied: the face (every town) | 24 | outsider (a lodging keeper) 14; records trade's master 11; criminal ≥5 0 | 16 |
| P1b infiltrated: instigator absent ("an outside hand") | 14 | outsider (a lodging keeper) 5; crooked tie 3; criminal ≥5 0 | 5 |
| P2 treater held by the seat (siege, indebted) | 44 | money/market trade's master, no power's head 17; debt tie (indebted) 20 | 26 |
| P3a slave revolt: instigator a force's commander | 24 | the revolt's leader 24; the abolitionist 24 | 24 |
| P3b defender absent (siege, wartime) | 11 | armourer/smith/fletcher trade's master 1; outsider (sellswords via a lodging keeper) 3 | 4 |
| P3c monster pressure: lever a minted stand-in | 11 | a hunter's trade (hunt, ranger, charter, bowyer) 1; outsider (a hunter via a lodging keeper) 3 | 4 |
| P4 indebted: the creditor (every town) | 24 | the creditor's agent (outsider's face) 24; criminal ≥5 8; Outstanding Debt tie 21 | 24 |
| P5 recently betrayed: instigator absent | 12 | crooked tie 8; criminal ≥5 8; outsider (a lodging keeper) 8 | 9 |
| P5 religious conversion: instigator absent | 14 | the new faith's own face 8; outsider (a preacher via a lodging keeper) 10 | 10 |
| P5 insurgency: instigator absent | 8 | the rising's own face 7; criminal ≥5 8; outsider (a lodging keeper) 8 | 8 |
| P6 profiteer absent "no one is named" (siege, wartime, indebted) | 11 | criminal ≥5 4 | 4 |

At the starting rates (castHash(seed, kind, "role:rung") < rate): P1 outsider 1/3 → 7/24, then records trade 1/4 of the rest → 1/24; P4 criminal 1/2 (FRAME_TUNING.rates.creditor.criminal) → 2/24; P2 trade 1/3 → 9/44 (the treater held by the seat).

#### The record of three towns a kind (for the drafts)

**occupied**
- `b7-occupied-hamlet-2` (hamlet) · face: Nonia Bassus, the occupying governor — "leads the occupying power" · FACTS: lodging keeper Flaccus Aurelius, the brewster of Alehouse; trade Jovianus Rufus, the steward
- `b7-occupied-hamlet-3` (hamlet) · face: Sona Acharya, the occupying governor — "leads the occupying power" · profiteer: Sona Acharya, the occupying governor — "the strongest figure in a power that gains" · FACTS: lodging keeper Varun Banerjee, the brewster of Alehouse; no trade
- `b7-occupied-village-0` (village) · face: Manlia Aurelius, the occupying governor — "leads the occupying power" · FACTS: no lodging keeper; trade Incitatus Maximus, the scribe
**infiltrated**
- `b7-infiltrated-hamlet-1` (hamlet) · no roles · absent: instigator ("an outside hand, unnamed") · FACTS: lodging keeper Chae Yang, the alewife of Alehouse; no tie; The Independent Bloc's face Ruihua Guo, the bloc's speaker
- `b7-infiltrated-town-0` (town) · no roles · absent: instigator ("an outside hand, unnamed") · FACTS: lodging keeper Peppo Schubert, the tavern keeper of Taverns (5-20); tie "Silent Partnership" Eberhard Ritter (the garrison commander) → Notburga Becker (the smuggler); The Independent Bloc's face Notker Gruber, the bloc's speaker
- `b7-infiltrated-town-1` (town) · no roles · absent: instigator ("an outside hand, unnamed") · FACTS: lodging keeper Pitao Ucan, the innkeeper of Inn (multiple); tie "The Patron No One Names" Zaachila Koh (the midwife) → Tecpatl Chuc (the front man); The Independent Bloc's face Malinalxochitl Puc, the bloc's speaker
- `b7-infiltrated-thorp-0` (thorp) · no roles · absent: instigator ("an outside hand, unnamed"), collaborator ("no power gains") · FACTS: no lodging keeper; no tie; The Independent Bloc's face Ludmila Volkov, the bloc's speaker
**under_siege**
- `b7-under_siege-hamlet-0` (hamlet) · treater: Uglješa Ivanov, the master of the hunt — "holds the seat" · absent: defender ("no military, garrison or watch stands") · FACTS: no trade; lodging keeper Aneta Petrov, the alewife of Alehouse; no trade; no criminal ≥5
- `b7-under_siege-village-1` (village) · treater: Nalayani Choudhry, the master fishmonger — "a member of the merchants' power, with the seat itself in dispute" · absent: defender ("no military, garrison or watch stands") · FACTS: trade Yashodha Gupta, the bowyer; no lodging keeper; no trade; no criminal ≥5
- `b7-under_siege-thorp-0` (thorp) · treater: Farid ibn Rashid, the reeve — "holds the seat" · absent: defender ("no military, garrison or watch stands") · FACTS: no trade; no lodging keeper; no trade; no criminal ≥5
**wartime**
- `b7-wartime-hamlet-0` (hamlet) · no roles · absent: defender ("no military, garrison or watch stands") · FACTS: no trade; lodging keeper Ehecatl Balam, the brewster of Alehouse; no criminal ≥5
- `b7-wartime-village-0` (village) · no roles · absent: defender ("no military, garrison or watch stands") · FACTS: no trade; lodging keeper Lavinia Severus, the innkeeper of Travelers' inn; no criminal ≥5
**indebted**
- `b7-indebted-town-2` (town) · treater: Fódla Thornton, the warehouse factor — "a member of the merchants' power, with the seat itself in dispute" · profiteer: Credhe O'Leary, the dean — "corrupt, with ties to the underworld" · FACTS: Creditor's Representative's face Naoise Kennedy, the creditor's agent; criminal Thieves' Guild (power 15), head Deirdre O'Sullivan, the gang boss; tie "Outstanding Debt" Fódla Thornton (the warehouse factor) → Declan O'Flaherty (the charter master); trade Fionnuala Jordan, the senior guild master
- `b7-indebted-city-1` (city) · treater: Ganesh Balan, the senior guild master — "holds the seat" · FACTS: Creditor's Representative's face Deepa Mishra, the creditor's agent; criminal Thieves' Guild (power 9), head Nirmala Mukherjee, the network's head; tie "Outstanding Debt" Aarav Deshpande (the innkeeper) → Deepa Mishra (the creditor's agent); trade Udayan Iyer, the warehouse factor
- `b7-indebted-city-2` (city) · treater: Tepeu Dzunum, the senior guild master — "holds the seat" · absent: profiteer ("no one is named for it") · FACTS: Creditor's Representative's face Acamapichtli Bacab, the creditor's agent; criminal Thieves' Guild (power 10), head Cuauhtemoc Kakupacal, the network's head; tie "Outstanding Debt" Balam Uc (the garrison commander) → Yellow Corn Cohuoh (the innkeeper); trade Yaotl Xoc, the whisper broker
**slave_revolt**
- `b7-slave_revolt-town-0` (town) · instigator: Svetlana Lazarev, the castellan — "already carries more weight than whoever holds the seat, and gains as the seat weakens" · target: Yordan Sidorov, the lord's appointee — "holds the seat, and the right to it is already in dispute" · waverer: Svetlana Lazarev, the castellan — "its power could go either way" · FACTS: Revolt Leadership's face Goran Pavlov, the revolt's leader; Abolitionist Network's face Ilya Semyonov, the abolitionist
- `b7-slave_revolt-town-1` (town) · instigator: Evgeny Titov, the castellan — "already carries more weight than whoever holds the seat, and gains as the seat weakens" · target: Galina Lebedev, the senior craft-guild master — "holds the seat, and the right to it is already in dispute" · FACTS: Revolt Leadership's face Ilya Korolev, the revolt's leader; Abolitionist Network's face Nedko Nikitin, the abolitionist
- `b7-slave_revolt-town-2` (town) · instigator: Gisli Ulfsson, the watch captain — "already carries more weight than whoever holds the seat, and gains as the seat weakens" · target: Leidolf Halfdarson, the senior craft-guild master — "holds the seat, and the right to it is already in dispute" · waverer: Gisli Ulfsson, the watch captain — "its power could go either way" · scapegoat: Leidolf Halfdarson, the senior craft-guild master — "holds the seat, and takes the blame while the right to it is in dispute" · FACTS: Revolt Leadership's face Skuld Rognvaldsson, the revolt's leader; Abolitionist Network's face Eindride Yngvarsson, the abolitionist
**monster_pressure**
- `b7-monster_pressure-hamlet-2` (hamlet) · brunt: Military Party (faction) — "its people stand guard" · lever: Nero Brutus, Rallies the neighbours — "nobody here could, so this one stepped in for the crisis" · FACTS: no trade; lodging keeper Prima Flavius, the alewife of Alehouse
- `b7-monster_pressure-village-0` (village) · brunt: Military Party (faction) — "its people stand guard" · lever: Banan al-Malik, Rallies the neighbours — "nobody here could, so this one stepped in for the crisis" · exploiter: Riyad al-Dimashqi, the midwife — "grasping by nature, in a power that gains" · FACTS: no trade; lodging keeper Said al-Hassan, the innkeeper of Travelers' inn
- `b7-monster_pressure-village-1` (village) · brunt: Flint Ahau, the master of the hunt — "the only one named here of a power that loses by the crisis" · lever: Metztli Dzul, Rallies the neighbours — "nobody here could, so this one stepped in for the crisis" · absent: scapegoat ("neither the seat's house nor the lever's loses by it") · FACTS: no trade; lodging keeper Dzizib Batab, the innkeeper of Travelers' inn
- `b7-monster_pressure-thorp-0` (thorp) · brunt: Monster Hunters / Adventurers (faction) — "its people stand guard" · lever: Hassan al-Hassan, Rallies the neighbours — "nobody here could, so this one stepped in for the crisis" · FACTS: no trade; no lodging keeper
**recently_betrayed**
- `b7-recently_betrayed-town-0` (town) · target: Yesüi Yorqin, the mine captain — "holds the seat" · absent: instigator ("no power gains"), scapegoat ("legitimacy is not contested") · FACTS: no tie; no criminal ≥5; lodging keeper Rashid Tayichi'ud, the tavern keeper of Taverns (5-20)
- `b7-recently_betrayed-city-0` (city) · target: Abaqa Tanghud, the senior guild master — "holds the seat" · absent: instigator ("no power gains") · FACTS: tie "Silent Partnership" Burilgi Jirgin (the senior craft-guild master) → Bochak Ongirad (the keeper of the houses); criminal Thieves' Guild (power 9), head Erdenebayar Noyakin, the black marketeer; lodging keeper Bochak Mangghud, the innkeeper of Inns and taverns (district)
- `b7-recently_betrayed-city-1` (city) · target: Leonhard Neumann, the senior guild master — "holds the seat" · waverer: Oskar Schneider, the innkeeper — "its power could go either way" · absent: instigator ("no power gains") · FACTS: tie "Silent Partnership" Benedikt Dietrich (the mint master) → Yohan Lehmann (the house boss); criminal Thieves' Guild (power 7), head Gisela Meyer, the network's head; lodging keeper Benedikt Müller, the coaching-inn keeper of Coaching inn
- `b7-recently_betrayed-thorp-0` (thorp) · target: Bertha Fischer, the head shepherd — "holds the seat, and the right to it is already in dispute" · waverer: Gregor Schulz, the investigator — "its power could go either way" · absent: instigator ("no power gains") · FACTS: no tie; no criminal ≥5; no lodging keeper
**religious_conversion**
- `b7-religious_conversion-town-3` (town) · target: Dalibor Orlov, the senior guild master — "holds the seat, and the right to it is already in dispute" · waverer: Dalibor Orlov, the senior guild master — "its power could go either way" · absent: instigator ("no power gains") · FACTS: New Faith Community's face Vladimir Kuznetsov, the midwife; lodging keeper Kaloyan Sidorov, the tavern keeper of Taverns (5-20)
- `b7-religious_conversion-city-0` (city) · target: Viktor Brandt, the senior guild master — "holds the seat" · absent: instigator ("no power gains") · FACTS: New Faith Community's face Waltrada Schneider, the senior abbess; lodging keeper Hinrik Jäger, the innkeeper of Inns and taverns (district)
- `b7-religious_conversion-city-1` (city) · target: Taghrid ibn Rushd, the governor — "holds the seat" · waverer: Taghrid ibn Rushd, the governor — "its power could go either way" · absent: instigator ("no power gains") · FACTS: New Faith Community's face Ruqayya al-Din, the senior abbess; lodging keeper Hicham al-Libi, the innkeeper of Inns and taverns (district)
- `b7-religious_conversion-thorp-0` (thorp) · target: Hypatia Angelos, the head shepherd — "holds the seat, and the right to it is already in dispute" · absent: instigator ("no power gains") · FACTS: no face; no lodging keeper
**insurgency**
- `b7-insurgency-city-0` (city) · target: Gordanka Pavlov, the monarch — "holds the seat" · absent: instigator ("no power gains") · FACTS: Commons' Reform Assembly's face Angela Solovyov, the toll-keeper; criminal Thieves' Guild (power 11), head Nikolai Ilyin, the network's head; lodging keeper Havel Solovyov, the coaching-inn keeper of Coaching inn
- `b7-insurgency-city-1` (city) · target: Sakura Matsumoto, the governor — "holds the seat" · waverer: Sakura Matsumoto, the governor — "its power could go either way" · absent: instigator ("no power gains") · FACTS: People's Council's face Xiao Ma, the customs collector; criminal Thieves' Guild (power 11), head Cheol Ma, the network's head; lodging keeper Kenji Yamamoto, the coaching-inn keeper of Coaching inn
- `b7-insurgency-city-2` (city) · target: Huana Holpop, the senior guild master — "holds the seat" · absent: instigator ("no power gains") · FACTS: People's Council's face Malinalxochitl Koh, the chief magistrate; criminal Thieves' Guild (power 12), head Miyahuaxochitl Holpop, the network's head; lodging keeper Dzizib Ixim, the coaching-inn keeper of Coaching inn

P1's dial (towns of 24 whose face moves off the governor): outsider 0.33 / trade 0.25 → 8; outsider 0.50 / trade 0.33 → 10; outsider 0.50 / trade 0.50 → 12; outsider 0.67 / trade 0.50 → 13.
P3a at the abolitionist's 1/3: the abolitionist instigates in 11/24, the revolt's leader in 13/24.

### The golden master and the natural pool (raw)

```
{"rows":525,"withAny":516,"by":{"infiltrated":480,"famine":36},"cells":{"infiltrated":{"absent":{"instigator":288,"collaborator":299},"roles":0},"famine":{"absent":{"exploiter":24},"roles":0}}}
{"n":360,"crisis":114,"by":{"infiltrated":5,"famine":4,"under_siege":12,"indebted":9,"succession_void":6,"recently_betrayed":11,"religious_conversion":2,"wartime":14,"occupied":6,"insurgency":8,"plague_onset":10,"monster_pressure":10,"politically_fractured":9,"mass_migration":8}}
```

## What the figures say

**Across the pool, the usual three hold 300 of the 618 named-person rows (49%).**

### The thin kinds (9 of 15)

| kind | which threshold | the figure | what makes it thin |
|---|---|---|---|
| **occupied** | T3, T2 | face = the occupying governor in **24/24**; usual three 35/40 (88%) | One office in every town: the governor minted for the Occupation Authority (`mintTitles.js`). He is also the profiteer in 6. |
| **slave_revolt** | T2 | usual three 57/67 (85%); instigator = a force's commander in **21/24** (the garrison commander 14, the watch captain 4, the castellan 2, the company captain 1) | Rule 3 takes the outranking rival (`outrankingRivalOf`), here the guard, whatever its stake. The revolt's own leader and the abolitionist (faces in 24/24) carry a `split` stake (K22/K24's `leadsRevolt`, `aidsRevolt`), so they are never cast. A guild's head 23: the seat, as target or scapegoat. |
| **wartime** | T2 | usual three 17/18 (94%); defender absent 4/24 | The defender is the one person role, and it is a commander wherever a force stands. |
| **monster_pressure** | T2 | usual three 31/40 (78%) | Lever = the watch commander or captain in 12, a minted stand-in in 11. Brunt = a force's commander in 6. |
| **under_siege** | T2 | usual three 30/44 (68%); defender absent **7/24** | The defender is a commander in 16. The treater is the seat in 21, and the treater is the senior guild master in 8/24 (in 6 of them as the seat). |
| **infiltrated** | T1, T2 | instigator absent **14/24** ("an outside hand, unnamed"); usual three 9/17 (53%) | The infiltrator's own face (the bloc's speaker, 24/24) is never cast, because its stake is not `gains`. |
| **religious_conversion** | T1 | instigator absent **14/24** ("no power gains") | The new faith's power, which the crisis raises, has a person as its face in 10/24, but its stake is `split`. |
| **recently_betrayed** | T1 | instigator absent **12/24** ("no power gains") | No rule names the betrayer. |
| **insurgency** | T1 | instigator absent **8/24** ("no power gains"); a further 8 cast a power with no person | The rising's own power, which the crisis raises, has a face in 8/24, but its stake is `split`. |

**Not thin (6).** Famine, plague_onset and mass_migration have varied levers and brunts, with trades' masters in about half. Politically_fractured and succession_void have many claimants. **Indebted is not thin by the three thresholds** (usual three 14/31, 45%). But its cast **never names the creditor**: 0/24 rows, see §3. Its one required role is the treater, which is the seat in 23/24.

**Where a counterpart is NOT proposed.** The **target** of every social kind is the seat in 24/24 (succession_void: the governing power in 24/24). That is the design's rule 4: a social crisis is aimed at the seat. The guild's head the owner sees there is the seat itself, because the seat-holder is the senior guild master in **77 of the 360 towns (21%)**. That is the variety of governance, not of the cast, so it is not changed here. The **defender** stays the commander wherever one stands. Only its absence is filled (P3b).

## §3 — indebted: who the creditor is on the record today

- **The creditor power** is `stressFactions.js`'s push under `indebted`, lines 122–131. It is **"Creditor's Representative" in 24/24**, with power from 9 to 54 and the description "Resident agent of the external creditor; formally an observer, in practice a veto on fiscal decisions."
  - The other arm, "Crown Creditors (Noble Coalition)", needs Royal Authority to govern (and `S`). It occurs in **0/24**.
- **Its face** is **the creditor's agent in 24/24**. That face is minted (`mintTitles.js`: "the creditor's agent", Moneylender), because `stressPowerFaces.js` has a row only for the Crown Creditors.
- **The cast names the creditor nowhere**:
  - 0/24 as a row.
  - Its stake is `split` with "it speaks for the creditor the town owes" (`RAISED_BY_CRISIS`).
  - The crisis's one person line is the treater, and the treater is the seat.
- **A criminal power the record could make the lender** (seated by `crimeSignalOf`, at `FRAME_TUNING.criminalMinPower` = 5 or more):
  - **8/24** indebted towns: town 1/4, city 3/4, metropolis 4/4, and **0 below town**.
  - Across the whole pool: thorp 0/56, hamlet 0/56, village 0/56, town 20/64, city 58/64, metropolis 60/64.
  - Every seated criminal power in the indebted pool stands at 5 or more.
- **The ties**:
  - An Outstanding Debt tie touches the seat-holder in 20/24.
  - The seat-holder is the debtor in 13/24. Their creditors are: the miller 3, the stable keeper 2, the creditor's agent 1, the banker 1, **the house boss 1** (in that town the record already makes a criminal the seat's creditor), and others 1 each.
  - The creditor's agent is party to such a tie in 10/24.

## The proposals, ranked: the owner's examples first, in his order

**One frozen table.** Every rate below is one entry of a single table I propose, `CRISIS_COUNTERPART_TUNING`, kept beside `CRISIS_CAST_TUNING` in `crisisCast.js`. Each rung is chosen by `castHash(seed, kind, "<role>:<rung>")` against its rate, so it takes **no draw** and moves no other stream.

**How the rungs are built.** Every rung is built on the chair's word and the FRAME-1 ladder (`sideArchetypes.js`):
- **an outsider** is never named. They are reached through the keeper of a house where strangers lodge (`LODGING_HOUSE`).
- **a trade's master** is the strongest free person whose title, role or house the crisis's trade pattern matches (`TROUBLE_MATTER`).
- **a person by a tie** stands on a tie whose kind speaks of the matter.
- **the criminal power** is a power `crimeSignalOf` seats, at `criminalMinPower` or more, and its head.

**Every new reason is a proposal for the chair.** Each would be one fixed sentence in `CAST_REASONS`, never free prose. The before/after lines are **drafted by hand from the stored record of the named seed, not executed**. "Before" is the stored cast. "After" is what the rule would write *if its hash falls under the rate*.

### P1 — "the lord's appointee is not always the one … some other foreigner": the occupier's local face (occupied)

**Rule.**
- The `face` rung order is: office (today's rule: the occupying power's leading member) → **outsider** → **trade**.
- The **outsider** rung takes the keeper of a lodging house. The face row is that keeper, and the clause already reads "the occupier's orders come through {holder}". The new reason is: "keeps the house where an officer of the occupation lodges; the officer is never named".
- The **trade** rung takes a records trade's master (`RECORDS_TRADE`: steward, scribe, clerk, notary). Its reason is: "keeps the rolls the occupier taxes by".
- **No criminal rung.** No occupied town in the pool seats a criminal power (0/24).

**Reach.** A lodging keeper in 14/24, a records trade in 11/24, either in 16/24.

**Rate.** Outsider 1/2, then trade 1/3. That moves **10/24** off the governor, which takes T3 to 14/24 (58%), under the line. At 1/3 and 1/4 only 8/24 move (67% stays over T3). The sweep is in the reach output.

**Drafted.**
- `b7-occupied-hamlet-2`:
  - Before: "In the occupation, the occupier's orders come through Nonia Bassus of the Occupation Authority."
  - After: "In the occupation, the occupier's orders come through Flaccus Aurelius, who keeps the alehouse where an officer of the occupation lodges."
- `b7-occupied-hamlet-3`:
  - Before: "… come through Sona Acharya of the Occupation Authority."
  - After: "… come through Varun Banerjee, who keeps the alehouse where an officer of the occupation lodges."
  - The governor stays the profiteer.
- `b7-occupied-village-0` (no lodging house):
  - Before: "… come through Manlia Aurelius of the Occupation Authority."
  - After: "… come through Incitatus Maximus, the scribe, who keeps the rolls the occupier taxes by."

**Cost: STORED.**
- The `face` row is the cast's record, and the DM edits it there, so it must change in `deriveCrisisCast` (`faceCandidates`).
- It moves the stored cast of the occupied towns where it fires: about **10 in 24**.
- **0 of the 525** golden-master rows carry `occupied`. Natural births carry it in 6/360 (1.7%).
- The governor stays on the roster and stays the Occupation Authority's face. Only the crisis's face row moves.

### P1b — the same "other foreigner": the infiltration's outside hand, reached (infiltrated)

**Rule.**
- Where the instigator is absent with "an outside hand, unnamed", the absence **stays**.
- The page adds who reaches the hand: the lodging keeper, as the troubleCast outsider does ("reached through {keeper}, who keeps the {house} where its people come and go").
- A second rung, a crooked tie (`CROOKED_TIES`), was considered. It reaches only 3/14, so I do not propose it.
- The infiltrator's own face (the bloc's speaker, 24/24) could be named instead. I do **not** propose that: the design keeps the engineered hand unnamed where no power gains, and the record says "its presence is not known to the settlement".

**Reach.** 5 of the 14 absences. The thorps and most hamlets have no lodging house.

**Rate.** 1, since it is a fact filling an absence.

**Drafted.**
- `b7-infiltrated-hamlet-1`:
  - Before: "instigator — an outside hand, unnamed."
  - After: "an outside hand, unnamed; Chae Yang keeps the alehouse where its people come and go."
- `b7-infiltrated-town-0`:
  - After: "… Peppo Schubert keeps the tavern where its people come and go."
- `b7-infiltrated-thorp-0` (no lodging house): unchanged.

**Cost: RENDER.** Nothing is stored. The stored absence and its reason are unchanged, as in the standing trouble's cast (CF2).
- 0 golden rows move.
- A STORED variant would touch the infiltrated golden rows that have the instigator absent and a lodging keeper. The golden holds `infiltrated` in **480/525** rows, with the instigator absent in **288**.

### P2 — "same with the guild leader": the one who would treat (under_siege, indebted)

**Rule.**
- This applies only where the treater falls to the **seat** (rule 8's second arm). When the seat is contested, the merchant arm stands.
- The **trade** rung takes a master of the trade the crisis cuts who is **no power's head and no criminal's member**. Without that exclusion, the merchants' senior guild master comes straight back.
  - The siege uses `MARKET_TRADE`; the debt uses `MONEY_TRADE`.
  - Reason: "whose trade the crisis cuts, and who would carry the terms".
- A **tie** rung (indebted, a debt tie on the seat-holder, 20/44) is noted but not proposed. The seat's private debt is not the town's.

**Reach.** 17 of the 44 seat-held treaters.

**Rate.** 1/3, which moves **9/44**.

**Drafted** (three sieges, each a senior guild master today):
- `b7-under_siege-city-0`:
  - Before: "In the siege, Konstantinos Kamytzes, who holds the seat, is the one who would come to terms."
  - After: "In the siege, Romanos Kantakouzenos, the luxury merchant, is the one who would come to terms: whose trade the crisis cuts, and who would carry the terms."
- `b7-under_siege-city-2`:
  - Before: "… Xochicueitl Batab, who holds the seat …"
  - After: "… Utzil Chuc, the luxury merchant …"
- `b7-under_siege-city-3`:
  - Before: "… Ioannes Komnenos, who holds the seat …"
  - After: "… Stephanos Kantakouzenos, the exchange's steward …"

**Cost: STORED** (`treaterCandidates`).
- About 9 in 44 siege or debt towns move.
- **0** golden rows: neither kind is in the 525.
- Natural births: siege 12/360, indebted 9/360.
- The siege hook's slot ("Someone in the leadership" → `{holder}`, `crisisHooks.js`) names the new holder at render without change.

### P3 — "same with … the garrison commander"

**P3a, the revolt's instigator (slave_revolt). The strongest single finding.**

**Rule.**
- The power the crisis raised to lead the revolt (`RAISED_TO_LEAD.slave_revolt`, "Revolt Leadership") comes first under rule 3, by its face. Reason: "leads the revolt the crisis raised".
- The abolitionist's face takes it at a rate. Its reason is the stored stake's own words: "has been aiding the revolt in secret".
- The outranking rival (the guard) is passed over as instigator. It keeps the waverer it already holds in 10/11.

**Reach.** The revolt's leader 24/24; the abolitionist 24/24.

**Rate.** Abolitionist 1/3, which gives **the abolitionist 11/24 and the revolt's leader 13/24**. The commander drops from 21/24 to 0, and the usual three from 85% to an estimated 36/67 (54%). The remainder is the seat (the target), by design.

**Drafted.**
- `b7-slave_revolt-town-0`:
  - Before: "In the revolt, Svetlana Lazarev, the castellan, whose power already carries more weight than whoever holds the seat, is stirring it."
  - After: "In the revolt, Goran Pavlov, the revolt's leader, is stirring it: leads the revolt the crisis raised."
- `b7-slave_revolt-town-1`:
  - Before: "… Evgeny Titov, the castellan …"
  - After: "… Nedko Nikitin, the abolitionist, is stirring it: has been aiding the revolt in secret."
  - Or Ilya Korolev, the revolt's leader, if the hash falls the other way.
- `b7-slave_revolt-town-2`:
  - Before: "… Gisli Ulfsson, the watch captain …"
  - After: "… Skuld Rognvaldsson, the revolt's leader …"

**Cost: STORED** (`instigatorCandidates`).
- **Every** slave revolt moves.
- 0 golden rows. Natural births 0/360: a rare, town-and-larger kind.
- This rule is the fact of the record (K22 already says the Revolt Leadership "leads the revolt"). It is the one proposal here that is closer to a repair than a dial.

**P3b, a defence where no force stands (under_siege, wartime). It fills an absence; it never displaces a commander.**

**Rule.** Where the defender is absent with "no military, garrison or watch stands":
- the **trade** rung takes an arming trade's master (smith, armourer, fletcher, bowyer, master of the hunt; the stable keeper of `external_threat`'s list is left out). Reason: "arms what defence the place has".
- else the **outsider** rung takes sellswords, never named, reached through a lodging keeper. Reason: "keeps the house where sellswords lodge, and can send for them".

**Reach.** 4 of the 11 absences. Most are thorps and hamlets with neither fact.

**Rate.** 1 (a fill).

**Drafted.**
- `b7-under_siege-village-1`:
  - Before: "defends — no military, garrison or watch stands."
  - After: "In the siege, Yashodha Gupta, the bowyer, leads the defence: arms what defence the place has."
- `b7-wartime-hamlet-0`:
  - After: "In the war, Ehecatl Balam leads the defence: keeps the alehouse where sellswords lodge, and can send for them."
- `b7-under_siege-thorp-0`: unchanged; no fact.

**Cost: STORED.** This is a named row. It could be RENDER only if the page's "defends" line reads an overlay. 0 golden rows.

**P3c, the raids' lever where today a stand-in is minted (monster_pressure).**

**Rule.** Before minting, try:
- a hunter's trade (hunt, ranger, charter, forester, bowyer). Reason: "knows the ground the raiders come by".
- then the outsider, hunters reached through a lodging keeper. Reason: "keeps the house where hunters lodge, and can send for them".

**Reach.** 4 of the 11 mints.

**Rate.** 1.

**Drafted.**
- `b7-monster_pressure-hamlet-2`:
  - Before: "In the raids, Nero Brutus holds the key to it: nobody here could, so this one stepped in for the crisis."
  - After: "In the raids, Prima Flavius holds the key to it: keeps the house where hunters lodge, and can send for them."
- `b7-monster_pressure-village-0`: after: "… Said al-Hassan …"
- `b7-monster_pressure-thorp-0`: unchanged; the mint stays.

**Cost: STORED, and the roster.** A town where it fires **does not mint** its temporary person.
- The roster loses one card.
- The step's own forked name draw is not taken; no other stream moves.
- About 4 in 11 minting towns move. 0 golden rows.

### P4 — "Maybe the creditor is the criminal faction in some parts?" (indebted)

**P4a, the creditor named on the crisis page (RENDER).**

**Rule.**
- Add a derived "the one owed" line to the debt crisis, outside the stored role vocabulary.
- It uses the chair's own **creditor ladder and rates** from FRAME-1 (`ARCHETYPE_LADDER.creditor`: outsider → criminal → tie; `FRAME_TUNING.rates.creditor`: 0.6 / 0.5 / 0.8).
- The **outsider** rung: the lender is never named and is reached through **the creditor's agent**, who is on the record in 24/24.
- The **tie** rung: an Outstanding Debt tie that touches the creditor's agent (10/24), or that makes the seat-holder a debtor (13/24).

**Drafted.**
- `b7-indebted-city-1`:
  - Before: no creditor line. The stakes say "Creditor's Representative · it speaks for the creditor the town owes."
  - After: "The town owes an outside lender, never named; Deepa Mishra, the creditor's agent, speaks for them, and the innkeeper Aarav Deshpande owes the agent besides."
- `b7-indebted-town-2`:
  - After: "… Naoise Kennedy, the creditor's agent, speaks for them."

**Cost.** 0 stored, 0 golden rows. A DM cast edit cannot reach a render-derived line. The standing trouble's cast has the same posture.

**P4b, the criminal power AS the creditor (the owner's words exactly). GENERATION.**

**Why it cannot be render-only.** The stored power says the creditor is *external* ("Resident agent of the external creditor"). A page that called the local criminal power the creditor would contradict its own record.

**Rule.**
- In `stressFactions.js`'s `indebted` arm, where a criminal power at `criminalMinPower` or more is seated and `castHash(seed, 'indebted', 'creditor:criminal') < 0.5`, the creditor power is that criminal power.
- Its description takes the debt sentence.
- No "Creditor's Representative" is pushed, so no agent is minted.
- `RAISED_BY_CRISIS` gains a row for the new text.

**Reach.** 8/24, and only at town size or larger.

**Rate.** 0.5 (the chair's), which fires in **2/24**.

**Drafted.**
- `b7-indebted-city-2`:
  - Before: "Creditor's Representative · it speaks for the creditor the town owes"; face Acamapichtli Bacab, the creditor's agent.
  - After: "Thieves' Guild · it holds the town's debt"; "The town's debt is owed to the Thieves' Guild; Cuauhtemoc Kakupacal, the network's head, calls it in."
- `b7-indebted-town-2`:
  - After: "… owed to the Thieves' Guild; Deirdre O'Sullivan, the gang boss, calls it in."
- `b7-indebted-city-1`:
  - After: "… owed to the Thieves' Guild; Nirmala Mukherjee, the network's head, calls it in."

**Cost.**
- It moves the powers, the minted face, the stakes and the cast's stakes of the indebted towns where it fires: about 2 in 24, and 0 below town.
- 0 golden rows.
- **Unverified precondition:** the criminal power must already be on the roster when `applyStressEventFactions` runs. I did not trace the order.

### P5 — the other social kinds whose instigator is mostly absent

**Rule.** These fill the absence "no power gains". Each is STORED, and none moves a golden row.
- **religious_conversion**, the new faith's own face:
  - The power the crisis raised, by its face (Reform Congregation, New Faith Community or Conversion Enforcement Office), reaching 8/14.
  - Else a preacher, never named, reached through a lodging keeper, reaching 10/14.
- **insurgency**, the rising's own face:
  - The power the crisis raised (People's Council, Commons' Reform Assembly), reaching 7/8.
  - Else the criminal power, reaching 8/8.
- **recently_betrayed**, the betrayer:
  - By a crooked tie (Corrupt Arrangement, Held Over Them, Silent Partnership, the Patron No One Names), reaching 8/12.
  - Else the criminal power, 8/12.
  - Else the outsider through a lodging keeper, 8/12.

**Rate.** The raised power's face at 1, since it is the record's own party. Tie 0.7, criminal 0.4 and outsider 0.7, which are FRAME-1's rates for a challenger's tie, a profiteer's criminal and an outsider's outsider.

**Drafted.**
- `b7-religious_conversion-city-0`: "instigator — no power gains" → "In the conversion, Waltrada Schneider, the senior abbess, is stirring it: speaks for the faith the crisis raised."
- `b7-insurgency-city-1`: → "In the insurgency, Xiao Ma, the customs collector, is stirring it: speaks for the council the rising raised."
- `b7-recently_betrayed-city-1`: → "In the betrayal, Gisela Meyer, the network's head, is stirring it: the criminal power the betrayal served."
  - That reason is my weakest. The record does not say the guild was served. **I would start the betrayal at the tie rung only.**

**A record oddity to name.** Several raised powers are faced by borrowed office-holders: the midwife for a New Faith Community, the customs collector or the chief magistrate for a People's Council (`stressPowerFaces.js`'s house rule). P5 would put those borrowed faces in the instigator's line. That is the faces seat's to rule first.

### P6 — the profiteer nobody is named for (under_siege, wartime, indebted)

**Rule.** Where the profiteer is drawn but absent with "no one is named for it", take the criminal power's head. Reason: "runs what the crisis has made scarce".
- **Reach.** 4/11.
- **Rate.** 0.4, the FRAME-1 profiteer criminal rate.
- **Drafted.** `b7-wartime-city-2`: "profits — no one is named for it" → "Bertha Huber, the gang boss of the Thieves' Guild: runs what the crisis has made scarce."
- **Cost.** STORED, 0 golden rows.

## What each costs, at a glance

| proposal | where it lives | what moves | golden-master rows (of 525) | natural births carrying the kind (of 360) |
|---|---|---|---|---|
| P1 occupied face | stored (`faceCandidates`) | the face row, ~10/24 occupied towns | 0 | 6 |
| P1b infiltration's hand | **render** | nothing stored | 0 (stored variant: up to 288 eligible) | 5 |
| P2 treater | stored (`treaterCandidates`) | ~9/44 siege and debt towns | 0 | 12 + 9 |
| P3a revolt's instigator | stored (`instigatorCandidates`) | every slave revolt | 0 | 0 |
| P3b defence fill | stored (or render) | 4/11 absent defences | 0 | 12 + 14 |
| P3c raids' lever | stored + roster (no mint) | 4/11 minting towns | 0 | 10 |
| P4a creditor line | **render** | nothing stored | 0 | 9 |
| P4b criminal creditor | **generation** (`stressFactions.js`) | powers, face, stakes: ~2/24 | 0 | 9 |
| P5 social instigators | stored | fills of 27 absences (reach) | 0 | 11 + 2 + 8 |
| P6 profiteer | stored | 4/11 | 0 | — |

**The 525-row generator golden master** carries only two kinds: `infiltrated` in 480 rows (most rows share the seed `golden-master-v3`) and `famine` in 36. So **no stored proposal above moves it**, except a stored variant of P1b.

**Not checked:** the other fixtures (the composed-prose manifest, the people aggregates). Every stored proposal is a signed generation change of its own. It would get its shift record, with "the same cast, a counterpart where the rate fires" as its cause.

**Not measured:** two-crisis towns. The per-town caps and the contradictory pairs would need a second pool of forced pairs (`config.stressTypes`).

## The scripts (run from the scratchpad folder, in this order)

1. `node gen.mjs pool.json` births the pool (about 1 minute).
2. `node measure.mjs pool.json` prints the measure above.
3. `node reach.mjs pool.json` prints the reach and the drafts' records.
4. `node goldens.mjs` gives the golden kinds.
5. `node natural.mjs` gives the natural shares.

### `gen.mjs`

```js
// FRAME-2 · B7 — the crisis pool: births towns IN CRISIS by the generator's own forced-stress option
// (config.stressType, stressGenerator.js :: generateStress Mode 1), 24 a kind, and caches a slim copy of each record
// (the cast as stored, the roster's people, the powers, the ties, the seat) for the measure. argv: output path.
import fs from 'node:fs';
const R = '/home/user/settlement-engine/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { STRESS_TYPE_MAP } = await import(R + 'data/stressTypes.js');
const { rulingChainOf } = await import(R + 'domain/dossier/powerStrata.js');
const { factionArchetype } = await import(R + 'domain/factionArchetypes.js');
const { crimeSignalOf } = await import(R + 'domain/crimeSignal.js');
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const TIER_AT = (t) => TIERS.indexOf(t);
const PER_KIND = 24;
const out = process.argv[2];
const towns = []; const misses = [];
for (const kind of Object.keys(STRESS_TYPE_MAP)) {
  const gate = STRESS_TYPE_MAP[kind].requiresTier; // the probabilistic mode's tier gate, honoured here too
  const tiers = TIERS.filter((t) => !gate || TIER_AT(t) >= TIER_AT(gate));
  const per = Math.ceil(PER_KIND / tiers.length);
  for (const tier of tiers) for (let i = 0; i < per; i++) {
    const seed = `b7-${kind}-${tier}-${i}`;
    const s = generateSettlementPipeline({ settType: tier, stressType: kind }, null, { seed, customContent: {} });
    const st = (Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : [])).filter(Boolean);
    const e = st.find((x) => x.type === kind);
    if (!e) { misses.push(seed); continue; }
    const powers = (s.powerStructure?.factions || []).map((f) => ({ name: f.faction || f.name, category: f.category, power: f.power, isGoverning: !!f.isGoverning, desc: f.desc || '', arch: factionArchetype(f) }));
    const criminal = crimeSignalOf({ seats: s.powerStructure?.factions || [], estate: [] }).powerNames;
    towns.push({
      seed, tier, kind, kinds: st.map((x) => x.type),
      cast: e.cast, crisisHook: e.crisisHook || '',
      seat: rulingChainOf(s).npc?.name || null,
      legit: s.powerStructure?.publicLegitimacy ? { c: !!s.powerStructure.publicLegitimacy.isContested, x: !!s.powerStructure.publicLegitimacy.isLegitimacyCrisis } : null,
      criminalCapture: s.powerStructure?.criminalCaptureState || null,
      powers, criminal,
      npcs: (s.npcs || []).map((n) => ({ id: n.id, name: n.name, role: n.role, title: n.title, power: n.power, category: n.category, temporary: !!n.temporary, institution: n.institution || null, memberships: n.memberships || [], hooks: n.plotHooks || [], secret: n.secret || null })),
      ties: (s.relationships || []).map((t) => ({ from: t.from, to: t.to, typeName: t.typeName })),
    });
  }
}
fs.writeFileSync(out, JSON.stringify({ towns, misses }));
console.log('born', towns.length, 'misses', misses.length);
```

### `measure.mjs`

```js
// FRAME-2 · B7 — CF10's measure over the cached crisis pool (gen.mjs). Reads only; prints markdown.
// argv: the cached pool. Every class and threshold is declared here, before any figure is read.
import fs from 'node:fs';
const R = '/home/user/settlement-engine/src/';
const { requiredRolesOf, occasionalRolesOf } = await import(R + 'domain/crisis/crisisCast.js');
const { FRAME_TUNING, LODGING_HOUSE, TROUBLE_MATTER } = await import(R + 'domain/tension/sideArchetypes.js');
const { isOfficeStandIn } = await import(R + 'domain/dossier/seatHolder.js'); // an office's name is no person (the cast's roster filter)
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const KINDS = [...new Set(towns.map((t) => t.kind))];
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '–');
const inc = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };

// ── The face classes (the brief's list; first match wins) ──
const APPOINTEE = /\b(?:lord's appointee|occupying governor)\b/i; // an appointed face sent from outside (mintTitles.js `appointed`)
const FORCE = /\b(?:garrison commander|watch (?:commander|captain|sergeant)|castellan|militia captain|company captain|blade captain|marshal)\b/i;
const OUTSIDE_POWER = (p) => /^(?:Occupation Authority|Creditor's Representative|Crown Creditors)/.test(p.name) || /^An external interest/.test(p.desc);
function facts(t) {
  const crim = new Set(t.criminal);
  const outside = new Set(t.powers.filter(OUTSIDE_POWER).map((p) => p.name));
  const military = new Set(t.powers.filter((p) => p.arch === 'military' && !outside.has(p.name)).map((p) => p.name));
  const guild = new Set(t.powers.filter((p) => /guild/i.test(p.name) && !crim.has(p.name)).map((p) => p.name));
  return { crim, outside, military, guild };
}
const rank1 = (n, set) => n.memberships.some((m) => m.rank === 1 && set.has(m.power));
const anyOf = (n, set) => n.memberships.some((m) => set.has(m.power));
function classOf(t, r, F) {
  if (r.kind === 'institution') return 'an institution (no person)';
  if (r.kind === 'faction') return F.crim.has(r.id) ? 'the criminal power (house)' : F.outside.has(r.id) ? 'an outside power (house)' : 'a power (house, no person)';
  const n = t.npcs.find((x) => (x.id || x.name) === r.id);
  if (!n) return '?';
  if (n.temporary) return 'the stand-in (minted)';
  if (n.name === t.seat) return 'the seat-holder';
  if (APPOINTEE.test(`${n.title} ${n.role}`)) return "the appointee (lord's or occupier's)";
  if (FORCE.test(`${n.title} ${n.role}`) || rank1(n, F.military)) return "a force's commander";
  if (anyOf(n, F.crim)) return 'the criminal power or its head';
  if (anyOf(n, F.outside)) return 'an outsider (an outside power\'s face)';
  if (rank1(n, F.guild)) return "a guild's head";
  if (n.memberships.some((m) => m.rank === 1)) return "a power's head";
  if (n.institution?.kind === 'house') return "a trade's master (a house's face)";
  return 'a member (no office)';
}
// ── The owner's "usual three", flagged independently of the class (a seat-holder who is a guild's head counts) ──
function usualOf(t, r, F) {
  if (r.kind !== 'npc') return null;
  const n = t.npcs.find((x) => (x.id || x.name) === r.id);
  if (!n) return null;
  const words = `${n.title} ${n.role}`;
  if (n.temporary || APPOINTEE.test(words)) return 'appointee/stand-in';
  if (rank1(n, F.guild) || /\bguild ?master\b/i.test(words)) return "guild's head";
  if (FORCE.test(words) || rank1(n, F.military)) return 'garrison/watch commander';
  return null;
}
// ── The thresholds (declared before reading): a kind is THIN where any holds ──
const T1 = 1 / 3; // a required role absent in at least a third of the kind's towns
const T2 = 1 / 2; // the usual three hold at least half the kind's named-person rows
const T3 = 0.6;   // one office (the holder's title) holds a required role in at least 60% of the kind's towns

const out = [];
const summary = [];
for (const kind of KINDS) {
  const pool = towns.filter((t) => t.kind === kind);
  const N = pool.length;
  const req = requiredRolesOf(kind);
  const occ = occasionalRolesOf(kind);
  const roles = {};
  let persons = 0, usual = 0; const usualBy = {};
  for (const t of pool) {
    const F = facts(t);
    for (const role of [...req, ...occ]) {
      const R0 = roles[role] ||= { filled: 0, cls: {}, title: {}, absent: {}, notDrawn: 0 };
      const row = t.cast.roles.find((x) => x.role === role);
      const ab = t.cast.absent.find((x) => x.role === role);
      if (row) {
        R0.filled++; inc(R0.cls, classOf(t, row, F));
        const n = row.kind === 'npc' ? t.npcs.find((x) => (x.id || x.name) === row.id) : null;
        inc(R0.title, n ? (n.temporary ? '(minted stand-in)' : n.title) : `(${row.kind})`);
        if (row.kind === 'npc') { persons++; const u = usualOf(t, row, F); if (u) { usual++; inc(usualBy, u); } }
      } else if (ab) inc(R0.absent, ab.reason);
      else R0.notDrawn++;
    }
  }
  let thin = [];
  out.push(`### ${kind} (${N} towns; required: ${req.join(', ') || '—'}; occasional: ${occ.join(', ')})\n`);
  out.push('| role | filled | by whom (class: towns) | the commonest office | absent (stored reason: towns) | not drawn (rate) |');
  out.push('|---|---|---|---|---|---|');
  for (const [role, R0] of Object.entries(roles)) {
    const cls = Object.entries(R0.cls).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join('; ');
    const top = Object.entries(R0.title).sort((a, b) => b[1] - a[1])[0];
    const ab = Object.entries(R0.absent).sort((a, b) => b[1] - a[1]).map(([k, v]) => `"${k}": ${v}`).join('; ');
    const abN = Object.values(R0.absent).reduce((a, b) => a + b, 0);
    out.push(`| ${role}${req.includes(role) ? ' (req.)' : ''} | ${R0.filled}/${N} | ${cls || '—'} | ${top ? `${top[0]} ${top[1]}/${N} (${pct(top[1], N)})` : '—'} | ${ab || '—'} | ${R0.notDrawn} |`);
    if (req.includes(role)) {
      if (abN / N >= T1) thin.push(`T1 ${role} absent ${abN}/${N}`);
      if (top && !/^\(/.test(top[0]) && top[1] / N >= T3) thin.push(`T3 ${role}: ${top[0]} ${top[1]}/${N}`);
    }
  }
  if (persons && usual / persons >= T2) thin.push(`T2 usual three ${usual}/${persons}`);
  out.push(`\nNamed persons in the cast: ${persons}; the usual three: ${usual} (${pct(usual, persons)}) — ${Object.entries(usualBy).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}. **${thin.length ? `THIN: ${thin.join('; ')}` : 'not thin'}**\n`);
  summary.push(`| ${kind} | ${N} | ${req.map((r) => { const R0 = roles[r]; const abN = Object.values(R0.absent).reduce((a, b) => a + b, 0); return `${r} ${pct(abN, N)}`; }).join(', ')} | ${usual}/${persons} (${pct(usual, persons)}) | ${req.map((r) => { const top = Object.entries(roles[r].title).sort((a, b) => b[1] - a[1])[0]; return top ? `${r}: ${top[0]} ${pct(top[1], N)}` : `${r}: —`; }).join('; ')} | ${thin.length ? 'THIN' : '—'} |`);
}
console.log('| kind | towns | required role absent | usual three / named persons | commonest office per required role | verdict |');
console.log('|---|---|---|---|---|---|');
console.log(summary.join('\n'));
console.log('\n' + out.join('\n'));

// ── Item 3: the creditor, and the criminal power strong enough to be the lender ──
const ind = towns.filter((t) => t.kind === 'indebted');
const cred = {}, face = {}, crimOK = {}, crimAny = {}; let ok = 0, any = 0;
for (const t of ind) {
  const c = t.powers.find((p) => /creditor/i.test(p.name));
  inc(cred, c ? `${c.name} (power ${c.power})` : 'none');
  const f = c ? t.npcs.filter((n) => n.memberships.some((m) => m.power === c.name && m.rank === 1)).map((n) => n.title).join('+') : '';
  inc(face, f || 'no face');
  const crooks = t.powers.filter((p) => t.criminal.includes(p.name));
  if (crooks.length) { any++; inc(crimAny, t.tier); }
  if (crooks.some((p) => (p.power || 0) >= FRAME_TUNING.criminalMinPower)) { ok++; inc(crimOK, t.tier); }
}
console.log(`\n### indebted: the creditor\n\nCreditor power: ${JSON.stringify(cred)}. Its face: ${JSON.stringify(face)}. Creditor in the cast as a row: ${ind.filter((t) => t.cast.roles.some((r) => /creditor/i.test(r.id))).length}/${ind.length}. A criminal power seated: ${any}/${ind.length} ${JSON.stringify(crimAny)}; at power ≥ ${FRAME_TUNING.criminalMinPower}: ${ok}/${ind.length} ${JSON.stringify(crimOK)}.`);
// the same reach across the whole pool, by tier (what the criminal rung could reach in any kind)
const byTier = {}; for (const t of towns) { const b = byTier[t.tier] ||= { n: 0, ok: 0 }; b.n++; if (t.powers.some((p) => t.criminal.includes(p.name) && (p.power || 0) >= FRAME_TUNING.criminalMinPower)) b.ok++; }
console.log(`Across the pool, a criminal power at ≥ ${FRAME_TUNING.criminalMinPower}, by tier: ${Object.entries(byTier).map(([k, v]) => `${k} ${v.ok}/${v.n}`).join(', ')}.`);

// ── The counterparts' reach: in each kind, how many towns hold each rung's fact ──
const TRADE = {
  occupied: TROUBLE_MATTER.occupation_legacy.trade, indebted: TROUBLE_MATTER.outside_debt.trade,
  under_siege: TROUBLE_MATTER.external_threat.trade, wartime: TROUBLE_MATTER.external_threat.trade,
  infiltrated: TROUBLE_MATTER.infiltration_fear.trade, slave_revolt: /\b(?:mine|quarr\w*|plantation|overseer|slave\w*|pit boss)\b/i,
  religious_conversion: TROUBLE_MATTER.religious_tension.trade, insurgency: TROUBLE_MATTER.popular_uprising.trade,
  recently_betrayed: TROUBLE_MATTER.corruption_scandal.trade, politically_fractured: TROUBLE_MATTER.legitimacy_crisis.trade,
};
const TIES = { indebted: TROUBLE_MATTER.outside_debt.ties, infiltrated: TROUBLE_MATTER.infiltration_fear.ties, recently_betrayed: TROUBLE_MATTER.corruption_scandal.ties };
console.log('\n### The counterparts\' reach (towns of the kind holding the fact; a person a cast role already holds is not counted)\n');
console.log('| kind | outsider: a lodging keeper free | criminal power ≥ 5 (its head free) | trade\'s master the crisis touches, free | a tie of the matter | the crisis\'s own raised power has a face |');
console.log('|---|---|---|---|---|---|');
for (const kind of KINDS) {
  const pool = towns.filter((t) => t.kind === kind);
  let lodge = 0, crook = 0, trade = 0, tie = 0, raised = 0;
  for (const t of pool) {
    const held = new Set(t.cast.roles.filter((r) => r.kind === 'npc').map((r) => r.id));
    const free = t.npcs.filter((n) => !n.temporary && !isOfficeStandIn(n) && !held.has(n.id || n.name));
    const words = (n) => `${n.title} ${n.role} ${n.institution?.key || ''}`;
    if (free.some((n) => LODGING_HOUSE.test(words(n)) && n.institution?.kind === 'house')) lodge++;
    const crooks = t.powers.filter((p) => t.criminal.includes(p.name) && (p.power || 0) >= FRAME_TUNING.criminalMinPower);
    if (crooks.some((p) => free.some((n) => n.memberships.some((m) => m.power === p.name && m.rank === 1)))) crook++;
    if (TRADE[kind] && free.some((n) => TRADE[kind].test(words(n)))) trade++;
    if (TIES[kind] && t.ties.some((x) => TIES[kind].includes(x.typeName))) tie++;
    const own = t.powers.filter((p) => /^(?:Revolt Leadership|Abolitionist Network|Resistance Network|People's Council|Commons' Reform Assembly|Reform Congregation|New Faith Community|Underground Old Faith|The Inquiry|Creditor's Representative|Occupation Authority)$/.test(p.name) || /^An external interest/.test(p.desc));
    if (own.some((p) => t.npcs.some((n) => !isOfficeStandIn(n) && n.memberships.some((m) => m.power === p.name && m.rank === 1)))) raised++;
  }
  console.log(`| ${kind} | ${lodge}/${pool.length} | ${crook}/${pool.length} | ${TRADE[kind] ? `${trade}/${pool.length}` : '—'} | ${TIES[kind] ? `${tie}/${pool.length}` : '—'} | ${raised}/${pool.length} |`);
}
```

### `reach.mjs`

```js
// FRAME-2 · B7 — each proposal's reach on the exact towns it would touch, and the record of three towns a kind for the
// drafted before/after. argv: the cached pool. Reads only.
import fs from 'node:fs';
const R = '/home/user/settlement-engine/src/';
const { FRAME_TUNING, LODGING_HOUSE, TROUBLE_MATTER } = await import(R + 'domain/tension/sideArchetypes.js');
const { castHash } = await import(R + 'domain/crisis/crisisCast.js');
const { isOfficeStandIn } = await import(R + 'domain/dossier/seatHolder.js'); // "The High Priestess" names an office, not a person (the cast's own roster filter)
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const words = (n) => `${n.title} ${n.role} ${n.institution?.key || ''}`;
const heldIds = (t) => new Set(t.cast.roles.filter((r) => r.kind === 'npc').map((r) => r.id));
const free = (t) => { const h = heldIds(t); return t.npcs.filter((n) => !n.temporary && !isOfficeStandIn(n) && !h.has(n.id || n.name)); };
const strongest = (l) => [...l].sort((a, b) => (b.power || 0) - (a.power || 0));
const lodger = (t) => strongest(free(t)).find((n) => LODGING_HOUSE.test(words(n)) && n.institution?.kind === 'house') || null;
const crook = (t) => { for (const p of [...t.powers].filter((p) => t.criminal.includes(p.name) && (p.power || 0) >= FRAME_TUNING.criminalMinPower).sort((a, b) => b.power - a.power)) { const h = free(t).find((n) => n.memberships.some((m) => m.power === p.name && m.rank === 1)); if (h) return { p, h }; } return null; };
const trade = (t, re) => strongest(free(t)).find((n) => re.test(words(n))) || null;
// the treater's trade rung: a master of the trade who is no power's head and no criminal power's member (else a guild's head comes back)
const tradeNotHead = (t, re) => strongest(free(t)).find((n) => re.test(words(n)) && !n.memberships.some((m) => m.rank === 1 || t.criminal.includes(m.power))) || null;
const faceOf = (t, re) => { const p = t.powers.find((x) => re.test(x.name) || re.test(x.desc)); const h = p && t.npcs.find((n) => !isOfficeStandIn(n) && n.memberships.some((m) => m.power === p.name && m.rank === 1)); return h ? { p, h } : null; };
const role = (t, r) => t.cast.roles.find((x) => x.role === r) || null;
const absent = (t, r) => t.cast.absent.find((x) => x.role === r) || null;
const who = (t, r) => { if (!r) return '—'; if (r.kind !== 'npc') return `${r.name} (${r.kind})`; const n = t.npcs.find((x) => (x.id || x.name) === r.id); return `${r.name}, ${n?.temporary ? n.role : n?.title}`; };
const DEFENCE_TRADE = /\b(?:smith\w*|armou?r\w*|fletcher\w*|bowyer\w*|master of the hunt)\b/i; // the arming trades (external_threat's list less the stable: a stable keeper leads no defence)
const HUNT_TRADE = /\b(?:hunt\w*|ranger\w*|charter\w*|forester\w*|trapper\w*|bowyer\w*|fletcher\w*|wildfowler)\b/i;
const MONEY = TROUBLE_MATTER.outside_debt.trade;
const RECORDS = TROUBLE_MATTER.occupation_legacy.trade;
const CROOKED = TROUBLE_MATTER.corruption_scandal.ties;
const tieOf = (t, types) => { const byId = new Map(t.npcs.map((n) => [n.id, n])); const x = t.ties.find((y) => types.includes(y.typeName) && byId.get(y.from) && byId.get(y.to)); return x ? { ...x, from: byId.get(x.from), to: byId.get(x.to) } : null; };
const P = [];
const line = (s) => P.push(s);
const reachRow = (label, pool, tests) => { const c = tests.map(([, f]) => pool.filter(f).length); line(`| ${label} | ${pool.length} | ${tests.map(([n], i) => `${n} ${c[i]}`).join('; ')} | ${pool.filter((t) => tests.some(([, f]) => f(t))).length} |`); };
line('| proposal: the towns it touches | towns | each rung\'s fact holds in | any rung |');
line('|---|---|---|---|');
const K = (k) => towns.filter((t) => t.kind === k);
reachRow('P1 occupied: the face (every town)', K('occupied'), [['outsider (a lodging keeper)', lodger], ["records trade's master", (t) => trade(t, RECORDS)], ['criminal ≥5', crook]]);
reachRow('P1b infiltrated: instigator absent ("an outside hand")', K('infiltrated').filter((t) => absent(t, 'instigator')), [['outsider (a lodging keeper)', lodger], ['crooked tie', (t) => tieOf(t, CROOKED)], ['criminal ≥5', crook]]);
reachRow('P2 treater held by the seat (siege, indebted)', [...K('under_siege'), ...K('indebted')].filter((t) => { const r = role(t, 'treater'); const n = r && t.npcs.find((x) => (x.id || x.name) === r.id); return n && n.name === t.seat; }), [["money/market trade's master, no power's head", (t) => tradeNotHead(t, t.kind === 'indebted' ? MONEY : TROUBLE_MATTER.trade_collapse.trade)], ['debt tie (indebted)', (t) => t.kind === 'indebted' && tieOf(t, ['Outstanding Debt', 'Financial Dependence'])]]);
reachRow("P3a slave revolt: instigator a force's commander", K('slave_revolt'), [["the revolt's leader", (t) => faceOf(t, /^Revolt Leadership$/)], ['the abolitionist', (t) => faceOf(t, /^Abolitionist Network$/)]]);
reachRow('P3b defender absent (siege, wartime)', [...K('under_siege'), ...K('wartime')].filter((t) => absent(t, 'defender')), [["armourer/smith/fletcher trade's master", (t) => trade(t, DEFENCE_TRADE)], ['outsider (sellswords via a lodging keeper)', lodger]]);
reachRow('P3c monster pressure: lever a minted stand-in', K('monster_pressure').filter((t) => role(t, 'lever')?.temporary), [["a hunter's trade (hunt, ranger, charter, bowyer)", (t) => trade(t, HUNT_TRADE)], ['outsider (a hunter via a lodging keeper)', lodger]]);
reachRow('P4 indebted: the creditor (every town)', K('indebted'), [["the creditor's agent (outsider's face)", (t) => faceOf(t, /^Creditor's Representative$/)], ['criminal ≥5', crook], ['Outstanding Debt tie', (t) => tieOf(t, ['Outstanding Debt'])]]);
reachRow('P5 recently betrayed: instigator absent', K('recently_betrayed').filter((t) => absent(t, 'instigator')), [['crooked tie', (t) => tieOf(t, CROOKED)], ['criminal ≥5', crook], ['outsider (a lodging keeper)', lodger]]);
reachRow('P5 religious conversion: instigator absent', K('religious_conversion').filter((t) => absent(t, 'instigator')), [["the new faith's own face", (t) => faceOf(t, /^(?:Reform Congregation|New Faith Community|Conversion Enforcement Office)$/)], ['outsider (a preacher via a lodging keeper)', lodger]]);
reachRow('P5 insurgency: instigator absent', K('insurgency').filter((t) => absent(t, 'instigator')), [["the rising's own face", (t) => faceOf(t, /^(?:People's Council|Commons' Reform Assembly|Reform Stewards' Coalition)$/)], ['criminal ≥5', crook], ['outsider (a lodging keeper)', lodger]]);
reachRow('P6 profiteer absent "no one is named" (siege, wartime, indebted)', [...K('under_siege'), ...K('wartime'), ...K('indebted')].filter((t) => absent(t, 'profiteer')), [['criminal ≥5', crook]]);
// the hash at a starting rate: how many of the reachable towns a dial of 1/3 or 1/2 would take (castHash over seed|kind|role:rung)
const at = (pool, roleRung, rate, f) => pool.filter((t) => f(t) && castHash(t.seed, t.kind, roleRung) < rate).length;
line('');
line(`At the starting rates (castHash(seed, kind, "role:rung") < rate): P1 outsider 1/3 → ${at(K('occupied'), 'face:outsider', 1 / 3, lodger)}/24, then records trade 1/4 of the rest → ${at(K('occupied').filter((t) => !(lodger(t) && castHash(t.seed, t.kind, 'face:outsider') < 1 / 3)), 'face:trade', 1 / 4, (t) => trade(t, RECORDS))}/24; P4 criminal 1/2 (FRAME_TUNING.rates.creditor.criminal) → ${at(K('indebted'), 'creditor:criminal', 0.5, crook)}/24; P2 trade 1/3 → ${at([...K('under_siege'), ...K('indebted')], 'treater:trade', 1 / 3, (t) => { const r = role(t, 'treater'); const n = r && t.npcs.find((x) => (x.id || x.name) === r.id); return n && n.name === t.seat && tradeNotHead(t, t.kind === 'indebted' ? MONEY : TROUBLE_MATTER.trade_collapse.trade); })}/44 (the treater held by the seat).`);
// three towns a kind, the record for the drafts
line('\n#### The record of three towns a kind (for the drafts)\n');
const pick = (k, f = () => true) => K(k).filter(f).slice(0, 3);
const show = (t, extra) => line(`- \`${t.seed}\` (${t.tier}) · ${t.cast.roles.map((r) => `${r.role}: ${who(t, r)} — "${r.reason}"`).join(' · ') || 'no roles'}${t.cast.absent.length ? ` · absent: ${t.cast.absent.map((a) => `${a.role} ("${a.reason}")`).join(', ')}` : ''} · FACTS: ${extra(t)}`);
const L = (t) => { const n = lodger(t); return n ? `lodging keeper ${n.name}, ${n.title} of ${n.institution.key}` : 'no lodging keeper'; };
const C = (t) => { const c = crook(t); return c ? `criminal ${c.p.name} (power ${c.p.power}), head ${c.h.name}, ${c.h.title}` : 'no criminal ≥5'; };
const T = (re) => (t) => { const n = trade(t, re); return n ? `trade ${n.name}, ${n.title}` : 'no trade'; };
const F = (re) => (t) => { const f = faceOf(t, re); return f ? `${f.p.name}'s face ${f.h.name}, ${f.h.title}` : 'no face'; };
const TI = (types) => (t) => { const x = tieOf(t, types); return x ? `tie "${x.typeName}" ${x.from.name} (${x.from.title}) → ${x.to.name} (${x.to.title})` : 'no tie'; };
line('**occupied**'); for (const t of [...pick('occupied', lodger).slice(0, 2), ...pick('occupied', (t) => trade(t, RECORDS) && !lodger(t)).slice(0, 1)]) show(t, (t) => `${L(t)}; ${T(RECORDS)(t)}`);
line('**infiltrated**'); for (const t of [...pick('infiltrated', (t) => absent(t, 'instigator') && lodger(t)), ...pick('infiltrated', (t) => absent(t, 'instigator')).slice(0, 1)]) show(t, (t) => `${L(t)}; ${TI(CROOKED)(t)}; ${F(/^An external interest/)(t)}`);
line('**under_siege**'); for (const t of [...pick('under_siege', (t) => absent(t, 'defender') && (trade(t, DEFENCE_TRADE) || lodger(t))), ...pick('under_siege', (t) => absent(t, 'defender')).slice(0, 1)]) show(t, (t) => `${T(DEFENCE_TRADE)(t)}; ${L(t)}; ${T(TROUBLE_MATTER.trade_collapse.trade)(t)}; ${C(t)}`);
line('**wartime**'); for (const t of pick('wartime', (t) => absent(t, 'defender') && (trade(t, DEFENCE_TRADE) || lodger(t)))) show(t, (t) => `${T(DEFENCE_TRADE)(t)}; ${L(t)}; ${C(t)}`);
line('**indebted**'); for (const t of pick('indebted', crook)) show(t, (t) => `${F(/^Creditor's Representative$/)(t)}; ${C(t)}; ${TI(['Outstanding Debt'])(t)}; ${T(MONEY)(t)}`);
line('**slave_revolt**'); for (const t of pick('slave_revolt')) show(t, (t) => `${F(/^Revolt Leadership$/)(t)}; ${F(/^Abolitionist Network$/)(t)}`);
line('**monster_pressure**'); for (const t of [...pick('monster_pressure', (t) => role(t, 'lever')?.temporary && (trade(t, HUNT_TRADE) || lodger(t))), ...pick('monster_pressure', (t) => role(t, 'lever')?.temporary).slice(0, 1)]) show(t, (t) => `${T(HUNT_TRADE)(t)}; ${L(t)}`);
line('**recently_betrayed**'); for (const t of [...pick('recently_betrayed', (t) => absent(t, 'instigator') && (tieOf(t, CROOKED) || crook(t) || lodger(t))), ...pick('recently_betrayed', (t) => absent(t, 'instigator')).slice(0, 1)]) show(t, (t) => `${TI(CROOKED)(t)}; ${C(t)}; ${L(t)}`);
line('**religious_conversion**'); for (const t of [...pick('religious_conversion', (t) => absent(t, 'instigator') && faceOf(t, /^(?:Reform Congregation|New Faith Community|Conversion Enforcement Office)$/)), ...pick('religious_conversion', (t) => absent(t, 'instigator') && !faceOf(t, /^(?:Reform Congregation|New Faith Community|Conversion Enforcement Office)$/)).slice(0, 1)]) show(t, (t) => `${F(/^(?:Reform Congregation|New Faith Community|Conversion Enforcement Office)$/)(t)}; ${L(t)}`);
line('**insurgency**'); for (const t of pick('insurgency', (t) => absent(t, 'instigator'))) show(t, (t) => `${F(/^(?:People's Council|Commons' Reform Assembly|Reform Stewards' Coalition)$/)(t)}; ${C(t)}; ${L(t)}`);
// P1's dial: how many occupied towns move off the governor at a few starting rates (outsider first, then the records trade)
const sweep = (o, tr) => K('occupied').filter((t) => (lodger(t) && castHash(t.seed, t.kind, 'face:outsider') < o) || (trade(t, RECORDS) && castHash(t.seed, t.kind, 'face:trade') < tr)).length;
line('');
line(`P1's dial (towns of 24 whose face moves off the governor): ${[[1 / 3, 1 / 4], [1 / 2, 1 / 3], [1 / 2, 1 / 2], [2 / 3, 1 / 2]].map(([o, tr]) => `outsider ${o.toFixed(2)} / trade ${tr.toFixed(2)} → ${sweep(o, tr)}`).join('; ')}.`);
const slaveMoves = K('slave_revolt').filter((t) => castHash(t.seed, t.kind, 'instigator:abetter') < 1 / 3).length;
line(`P3a at the abolitionist's 1/3: the abolitionist instigates in ${slaveMoves}/24, the revolt's leader in ${24 - slaveMoves}/24.`);
console.log(P.join('\n'));
```

### `goldens.mjs`

```js
// FRAME-2 · B7 — which of the 525 golden-master rows carry each crisis kind (so a stored change's reach is counted).
// The rows come from the manifest's keys (scripts/lib/golden-corpus-key.mjs, the one home), generated as the golden test does.
import fs from 'node:fs';
const ROOT = '/home/user/settlement-engine/';
const { manifestRows } = await import(ROOT + 'scripts/lib/golden-corpus-key.mjs');
const { generateSettlementPipeline } = await import(ROOT + 'src/generators/generateSettlementPipeline.js');
const rows = manifestRows(JSON.parse(fs.readFileSync(ROOT + 'tests/fixtures/generator-golden-master.json', 'utf8')));
const by = {}; let withAny = 0;
const cells = {};
for (const config of rows) {
  const { _seed, ...cfg } = config;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  const st = (Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : [])).filter(Boolean);
  if (st.length) withAny++;
  for (const e of st) {
    by[e.type] = (by[e.type] || 0) + 1;
    const c = cells[e.type] ||= { absent: {}, roles: 0 };
    for (const a of e.cast?.absent || []) c.absent[a.role] = (c.absent[a.role] || 0) + 1;
  }
}
console.log(JSON.stringify({ rows: rows.length, withAny, by, cells }));
```

### `natural.mjs`

```js
// FRAME-2 · B7 — the natural share of each crisis kind at birth (no forced stress), 60 seeds a tier.
const R = '/home/user/settlement-engine/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const by = {}; let n = 0, crisis = 0;
for (const tier of TIERS) for (let i = 0; i < 60; i++) {
  const s = generateSettlementPipeline({ settType: tier }, null, { seed: `b7-natural-${tier}-${i}`, customContent: {} });
  const st = (Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : [])).filter(Boolean);
  n++; if (st.length) crisis++;
  for (const e of st) by[e.type] = (by[e.type] || 0) + 1;
}
console.log(JSON.stringify({ n, crisis, by }));
```

