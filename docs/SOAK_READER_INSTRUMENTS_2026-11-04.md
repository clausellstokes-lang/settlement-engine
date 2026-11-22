# Soak reader instruments: the plausibility observations, counted (2026-11-04)

> A dated lane record (lane READER-INSTRUMENTS). Base `lane/window-rung1-2026-11-04`. The brief named `3be939ac5`; the checkout was newer, at `64aeda87` (rung 1C's docs commit on top), and the lane proceeded from there. The owner, 2026-11-04 ~15:25 UTC: "Add these kinds of observations to your 1000+ runs as well". **Instruments only: nothing here cures anything.** The cures are the READER WINDOW.

> **Updated the same day with the chair's rulings** (§7): check 10 is counted as one line per settlement (Q4), "Quality textiles" is luxury-class (Q2), and strength-no-house is a column only (Q3). Relation-types has the exempted rule as its line and the strict reading as a column (Q1). The first counts are kept in §4, beside the new ones in §7.

## 1. What was added

- **`src/domain/coherence/readerBattery.js :: readerBattery`** holds ten checks. They use the battery's finding shape `{ check, surface, quote, detail }` and `recordBattery.js :: str, collect`. A sub-case is the detail's leading `[tag]`.
- **Every check reads rendered text** (`renderHarness.mjs :: renderSurfaces`: the twenty tabs, Tonight, the PDF, Foundry). It consults the record only for what is true of the place: the roster, institutions, terrain, route, and a tension's source event.
- **The soak's review:** `checks.mjs :: reviewSettlement` runs the reader checks **last**, under the `reader:` family. `KIND_OF` gains one kind, **9 (reader)**. Nothing existing is renumbered.
- **Counted apart:** `aggregate.mjs` writes reader findings to `aggregates/reader-observations.json`, never to `finding-classes.json`. They are not read by the stop rule or `CHAIR_READINGS`, and they do not feed the chain facts (`chain.findingCount`).
- **The table:** `tables.mjs` renders a separate table, "Reader observations (outside the stop rule until the READER WINDOW lands)".
- **Unchanged-classes receipt:** `finding-classes.json` is byte-identical before and after.
  - 60 at `64aeda87` (`artifacts/reader-base`) against 60 at `61f1b72b` (`artifacts/reader-60`).
  - 1,000 at `64aeda87` against 1,000 at `61f1b72b` (`artifacts/reader-1000b`); see §5.
  - `run.json` verdict, reasons, findings (115 at 60; 1,898 at 1,000) and dependence pairs are equal.

## 2. The ten definitions (the chair's; refinements marked ✎)

1. **`validation-on-page`** — the generator's validators printed as facts.
   - Sub-cases:
     - `[structural]`: `/requires? [a-z ]+ access/` or `/is not compatible with/`, on any surface.
     - `[requires-on-water]`: a "requires <river|coast|lake> access" where the terrain IS that water.
     - `[gaps]`: `/exists but lacks access to/`. A-05 is kept as it is; the overlap is reported.
     - `[viability-count]`: "N critical issue(s) prevent" ≠ "Critical Issues (M)". M is 0 when that heading is absent: the Viability page then lists only "Structural Crises (k)".
2. **`scale-lists`** — two findings and one distribution.
   - (a) `[luxury-imports]`: a thorp or hamlet whose Imports line (Economy tab) holds luxury goods, fine textiles, camel herds, spices, silk, exotic goods or gems. Since Q2 it also holds quality textiles, fine cloth and dyed cloth. **This is the line.**
   - (b) `[~strength-no-house]` (since Q3 a **column only**, informational, never in the line): an Economic strength (Resources tab) naming a resource trade with no house behind it. The map is `STRENGTH_HOUSES`, and every pattern is held against `institutionalCatalog.js`'s names by a unit test.
     - ✎ Strengths that name no single house are not read: Agriculture, Grain production, Livestock, Hunting, Trade hub, Central trade hub, Maritime trade, River trade, Exotic goods.
   - (c) The Exports item count by tier, as a distribution (`readerDistributions`; one item per `primaryExports` pill).
3. **`relation-types`** — the Relationships tab's two-line rows.
   - Mentor and Successor, or Professional Rivalry, between roles that share no trade or office (`shareTradeOrOffice`).
   - Jurisdictional Tension where neither role holds an office (`HOLDS_OFFICE`: an office or noble class, a command, a senior see, a guild's head).
   - ✎ Classes share an office or trade by family: office + noble form governance; merchant + trade form commerce, where two named trades must match, though a generic craft role such as Guild Warden or Master Craftsman sits beside any trade.
   - ✎ `other` roles are not judged.
   - **Since Q1** this is the strict reading, the `~strict` column. The line is the exempted rule (§7).
4. **`tension-memory`** — a Current Tension whose source event (`historicalEvents[].templateType === tension.type`) is printed on the History tab in the Ancient or Deep history band, worded with living participants (`LIVING`: former…, those who suffered…, collaborators and resisters continued, …).
   - ✎ A tension with no source event is not judged. Innissike's Tyranny ("Those who suffered under the regime") has none.
5. **`hook-pools`** — two sub-cases.
   - `[guard]`: the Plot Hooks tab names a guard, guard captain, garrison, the watch or soldiers, where no house is an enforcement body and no person holds a guard-like role.
   - `[sea]`: ship, dock or harbour words where there is no navigable water (the soak's `hasWater` reading).
   - ✎ The whole tab is read, not only its tension, outlook and history sections: the NPC section carries the same pools (Amarthal's "talking to the guard").
6. **`traditions-water`** — a tradition keyed on Tide, Landfall, Landing, Sea, Harbour or Fleet, where the route has no water and the terrain is not coastal, riverside or lake.
   - ✎ The corpus's routes are road, crossroads, mountain_pass, isolated, port and river; it has no literal "overland". So "no water" means any route but port or river.
7. **`tonight-wants`** — "Wants to" followed by a capitalised word on the Tonight sheet.
   - ✎ Any capital counts. A want's verb is lower-case, so "Knows", "Authorised", "Diverted", "Helped" and "Noticed" count beside the chair's list.
8. **`rule-text`** — the chair's six patterns, one finding per surface.
9. **`possessive-slip`** — `/\b[A-Za-z][\w-]*['’]s['’](?![a-z])/`, one finding per surface.
10. **`daily-life-placeholder`** — the Daily Life line "dawn, the market, the tavern, the watch" where the Institutions tab lacks a market or a watch.
    - `[no-market]`: no market by `viability.js :: hasMarketInstitution` (the chair's ruling: a Periodic market is a market).
    - `[no-watch]`: no house named watch, guard or garrison.
    - The line itself is printed on 60 of 60 pages.
    - **Since Q4** there is one finding per settlement, when the line renders AND a sub-case holds. The detail names the sub-case(s), e.g. `[no-market][no-watch] no market, no watch`. The pages carrying the line at all are a distribution (`readerDistributions :: dailyLifeLine`).

## 3. The role→class map (check 3)

**How the map is built** (`ROLE_CLASS`):
- The source is `historyData.js :: POWER_ROLES_BY_CATEGORY`, mapped by category:
  - government → office, except that its `factionRoleCatalog.js :: NOBLE_ROLES` → noble;
  - religious → clergy;
  - crafts → trade;
  - military → military;
  - economy → merchant;
  - criminal → criminal;
  - magic → arcane.
- The `other` category is classed role by role.
- The faction-pool titles (`factionRoles.js :: FACTION_ROLES`) are added.
- An unknown role is `other`.

**The resulting map:**
- **office** (23): Mayor, Lord, Governor, Duke/Viceroy, Grand Chancellor, Master of Coin, Spymaster, Foreign Ambassador, Council Member, Tax Collector, Chief Magistrate, City Clerk, Harbor Master, Reeve, Herald/Town Crier, Notary/Scrivener, Customs Inspector, Prison Warden, Royal Envoy, Alderman, Elder, Disgraced Official, Lord Mayor
- **noble** (10): Lord/Lady of the Manor, Baron/Baroness, Court Advisor, House Steward, Noble Heir, Land Agent, Knight/Dame, Duke/Duchess, Royal Chamberlain, Debt-Ridden Noble
- **clergy** (18): High Priest, Abbot/Abbess, Inquisitor, Archbishop/Patriarch, Temple Guard Commander, Priest, Monastery Archivist, Shrine Keeper, Wandering Monk, Temple Healer, Under-Chaplain, Chaplain, Prophet/Seer, Head of the Faithful, Exorcist, Village Priest, Street Preacher, High Priestess
- **trade** (28): Master Blacksmith, Master Carpenter, Master Weaver, Master Tanner, Head Brewer, Guild Warden, Journeyman Overseer, Craft Guild Representative, Master Potter, Master Glassblower, Master Craftsman, Master Shipwright, Tavern Owner, Healer, Master Builder, Miller, Innkeeper, Shepherd, Woodcutter, Blacksmith, Widowed Farmer, Midwife, Apothecary, Cartographer, Rat Catcher, Gravedigger, Fisherman, Dockworker/Stevedore
- **military** (16): Guard Captain, Garrison Commander, City Watch Chief, Mercenary Captain, Master of Arms, Military Quartermaster, Scout/Ranger, Siege Engineer, Border Warden, Veteran Soldier, Cavalry Commander, Armourer, Naval Commander, Wounded Soldier, Mercenary-for-Hire, Watch Captain
- **merchant** (16): Wealthiest Merchant, Guild Master, Moneylender, Market Overseer, Trade Factor, Traveling Merchant, Ship Captain, Warehouse Master, Grain Factor, Auctioneer, Caravan Master, Banking Agent, Wandering Peddler, Debt Collector, Guildmaster, Senior Trader
- **criminal** (18): Local Fence, Bandit Contact, Smuggler, Thieves' Guild Master, Black Market Fence, Smuggler Chief, Crime Lord, Shadow Council Leader, Assassin Guildmaster, Corrupt Official, Cutpurse/Pickpocket, Racketeer, Spy/Informant, Counterfeiter, Gang Leader, Underground Broker, Kingpin, Lieutenant
- **arcane** (17): Tower Wizard, Guild Archmage, Grand Magister, Court Sorcerer, Alchemist, Hedge Wizard, Arcane Archivist, Diviner/Seer, Runesmith, Enchanter, Conjurer, Druid Elder, Warlock/Bargain-Sworn, Artificer, Apprentice Mage, Hedge Witch, Archmagister
- **other** (5, not judged): Sage/Scholar, Bard/Chronicler, Retired Adventurer, Travelling Performer, Escaped Slave/Serf

## 4. The counts (first measure, at `61f1b72b`; superseded for checks 2, 3 and 10 by §7)

**The runs:** 60 is `artifacts/reader-60`; 1,000 is `artifacts/reader-1000b`, at `61f1b72b`, in 166 s. Every settlement was rendered, and there were 0 errors. By tier, thorp → metropolis; the 1,000 pools are 167/167/167/167/166/166.

| check | chair's grep (60) | ours (60) | ours (1,000) | 1,000 by tier | 1,000 sub-cases |
|---|---|---|---|---|---|
| validation-on-page | 59 | **60** | **985** | 160/162/165/167/165/166 | gaps 977 · viability-count 173 · structural 117 · requires-on-water 23 |
| scale-lists | 12/20 small | (a) **10/20** · any **48** | (a) **105/334** · any **779** | 165/167/156/124/89/78 | strength-no-house 768 · luxury-imports 105 (40/65 thorp/hamlet) |
| relation-types | — | **48** | **759** | 27/85/153/165/166/163 | mentor-and-successor 647 · professional-rivalry 583 · jurisdictional 0 |
| tension-memory | 4 | **4** | **60** | 6/1/7/4/22/20 | ancient 42 · deep-history 18 |
| hook-pools | — | **9** | **113** | 7/12/36/3/24/31 | sea 66 · guard 50 |
| traditions-water | 8/20 landlocked | **11/31** | **150** | 18/12/20/28/34/38 | — |
| tonight-wants | 15 | **24** | **337** | 56/43/75/61/57/45 | — |
| rule-text | — | **9** | **148** | 0/0/0/19/87/42 | — |
| possessive-slip | 1 | **2** | **93** | 0/0/0/21/39/33 | — |
| daily-life-placeholder | — | **30** | **495** | 167/167/161/0/0/0 | no-watch 487 · no-market 434 |

**Check 1's overlap with A-05 at 1,000:**
- 977 settlements carry both a `[gaps]` finding and an A-05 finding.
- 0 carry A-05 only.
- 8 fire on check 1 without any gaps line.

**Check 2c, the Exports item count** (median [p10–p90] min–max, at 1,000):

| tier | median | p10–p90 | min–max |
|---|---|---|---|
| thorp | 3 | 0–6 | 0–10 |
| hamlet | 4 | 0–9 | 0–12 |
| village | 5 | 0–10 | 0–12 |
| town | 9 | 3–13 | 0–17 |
| city | 15 | 9–19 | 2–21 |
| metropolis | 18 | 11–21 | 6–23 |

**Example seeds and controls:** every example seed fires its checks.
- soak1k-3 fires 1, 3 and 2c.
- soak1k-13 fires 2a, 5 and 7.
- soak1k-28 fires 1, 3, 4, 5, 6 and 9.

The real-seed negative control for each check:
- check 1: soak1k-838 (city), one of 15 silent settlements in the 1,000; no settlement of the 60 is silent;
- check 2: soak1k-28;
- check 3: soak1k-0;
- checks 4, 5, 7, 9 and 10: soak1k-3;
- check 6: soak1k-1;
- check 8: soak1k-13.

**Red-first:** each check's commit ran its new tests against the previous stage's module first. Every stage went red (module or function missing) and then green, through the gate mutex. The receipts are in the commit bodies.

## 5. Deltas from the chair's grep-counts (60) and their reasons

- **validation-on-page, 60 against 59.** One settlement has no Gaps line but fires on `[viability-count]` or `[structural]`. The chair's 12/60 Viability mismatch is reproduced exactly (12), and so is the 3/60 riverside sub-case (3).
- **scale-lists (a), 10/20 against 12/20.** The chair's list does not include "Quality textiles", which is in soak1k-12 and soak1k-30 (and soak1k-7 has "Quality textiles and cloth"). That is the probable source of the 2. The list was kept as given; adding the item is a one-word change if the chair rules it luxury.
- **traditions-water, 11/31 against 8/20.** The chair's landlocked pool used road, overland, isolated and none. In the corpus, crossroads and mountain_pass are overland routes too, so the pool is 31 rather than 20. On road and isolated alone, the count is 5 of 17.
- **tonight-wants, 24 against 15.** The chair's grep listed start words; any capitalised start is not a want. The 9 extra settlements start "Has" (9 of the 24 lines in total), "Knows", "Authorised", "Diverted", "Helped", "Made" or "Noticed".
- **possessive-slip, 2 against 1.** soak1k-21 also carries "Gonghuizhang of Cobbler's'". The chair's grep likely read only "Guildmaster of …".
- **tension-memory, 4 against 4.** Equal; all four come from the Occupation Legacy.
- **The chair gave no figure** for relation-types, hook-pools, rule-text or daily-life (rule-text's shapes grep to 9 of 60, equal to ours).

## 6. Open questions for the chair (first report; ruled, §7)

- **relation-types at 76%:** most of it is office↔military rivalry and office↔clergy or merchant "Mentor and Successor". Is a Guild Master mentoring a Mayor (a guild-council polity) a mismatch?
- **"Quality textiles":** is it luxury-class for check 2a?
- **strength-no-house at 77%:** the strengths are the terrain's static list (`geographyData.js :: economicStrengths`). Is the cure to filter the list, or to keep it as "terrain potential"?
- **daily-life:** the placeholder prints on every page. Should the instrument count the line itself rather than its two sub-cases?

## 7. The chair's rulings applied (unit 11) and the re-measure

**The rulings:**
- **Q1, relation-types, verbatim:** "two roles share a class when they are in the same class of your map, OR when both are members of the same faction (the faction that holds or contests the seat counts as one office), OR when one holds the seat and the other sits in the body that holds it. Clergy↔clergy, arcane↔arcane, military↔military, criminal↔criminal, merchant↔merchant, noble↔office share. Professional Rivalry needs a shared trade or a shared market (two merchants, two craft masters), else fires. Jurisdictional Tension needs two office-holders (any two offices), else fires." The exempted figure is the line; the strict one is a sub-case column.
- **Q2:** "Quality textiles" (and "fine cloth", "dyed cloth and quality textiles") is luxury-class in a thorp or hamlet.
- **Q3:** scale-lists has two sub-cases. (a) luxury imports in a thorp or hamlet is the line. (b) strength-no-house is informational, its own column, not folded into (a)'s rate.
- **Q4:** check 10 counts the line once per settlement when a sub-case holds, with the sub-case counts as columns. The pages with the line are a distribution.

**How Q1 is read** (`readerBattery.js :: exemptedVerdict`, `seatFactions`):
- A person's faction is `npc.factionAffiliation`, looked up by the name on the Relationships row.
- The seat's factions are the governing one (`powerStructure.governingName` / `isGoverning`) and every faction whose `contestsNiche` names it. Members of any two of them count as one office.
- The seat's holder is the tier's head role (`npcGenerator.js :: TIER_MANDATORY_ROLES`: Elder, Mayor, Governor) or a Lord Mayor. They share with any member of the seat's factions.
- The faction and seat exemptions apply to Mentor and Successor.
- Professional Rivalry passes only for two merchants or two trade roles.
- Jurisdictional Tension passes only when both roles hold an office (`HOLDS_OFFICE`).
- `other` roles stay unjudged for both Mentor and Successor and Professional Rivalry.

**The mechanism:** a sub-case tag written `[~tag]` is a **column only**. A finding whose every tag is one counts in its column and never in the class's line (`aggregate.mjs :: readerFinding`). A row that the strict reading alone flags says which exemption spared it.

**Receipts:**
- Red-first: the new tests against the previous module were 9 failed | 24 passed. Green: the governing suites, 9 files, 79 passed.
- eslint is clean, and the strict domain tsc shows no error in the file.
- `finding-classes.json` is byte-identical to the base `64aeda87` without the reader checks, at 60 (`artifacts/reader-base` against `artifacts/reader-60u11`) and at 1,000 (the base worktree run against `artifacts/reader-1000u11`).

**The counts, old beside new** (1,000 by tier, thorp → metropolis):

| check | 60 (first) | 60 (now) | 1,000 (first) | 1,000 (now) | 1,000 by tier (now) |
|---|---|---|---|---|---|
| relation-types, the line (exempted) | — | **44** | — | **705** | 23/46/139/165/166/166 |
| · ~strict (column) | 48 | 48 | 759 | 759 | 27/85/153/165/166/163 |
| · mentor-and-successor (exempted) | 42 | 35 | 647 | 552 | 3/15/116/144/151/123 |
| · professional-rivalry (exempted) | 36 | 39 | 583 | 611 | 20/34/90/137/164/166 |
| · jurisdictional-tension (exempted) | 0 | 9 | 0 | 82 | 0/0/7/8/26/41 |
| scale-lists, the line: (a) luxury imports | 10 | **13** | 105 | **156** | 61/95/0/0/0/0 |
| · (b) ~strength-no-house (column) | 46 | 46 | 768 | 768 | 156/165/156/124/89/78 |
| daily-life-placeholder, the line | 30 | 30 | 495 | 495 | 167/167/161/0/0/0 |
| · no market / no watch (columns) | 30 / 28 | 30 / 28 | 434 / 487 | 434 / 487 | — |
| · pages with the line at all (distribution) | 60/60 | 60/60 | 1000/1000 | 1000/1000 | 167/167/167/167/166/166 |
| validation-on-page | 60 | 60 | 985 | 985 | 160/162/165/167/165/166 |
| tension-memory | 4 | 4 | 60 | 60 | 6/1/7/4/22/20 |
| hook-pools | 9 | 9 | 113 | 113 | 7/12/36/3/24/31 |
| traditions-water | 11 | 11 | 150 | 150 | 18/12/20/28/34/38 |
| tonight-wants | 24 | 24 | 337 | 337 | 56/43/75/61/57/45 |
| rule-text | 9 | 9 | 148 | 148 | 0/0/0/19/87/42 |
| possessive-slip | 2 | 2 | 93 | 93 | 0/0/0/21/39/33 |

(The "first" sub-case figures for relation-types are the strict rule's.)

**What the exempted rule does:**
- The exemptions lower Mentor and Successor (647 → 552).
- The rule's own Professional Rivalry and Jurisdictional Tension clauses are TIGHTER than strict: PR 583 → 611 and JT 0 → 82. So the line falls only from 759 to 705.
- The exempted PR's largest class pairs at 1,000 are military/office (234 settlements), office/office (183) and noble/office (162): two councillors, or a mayor and a baron, are a rivalry with no shared trade or market under the ruling's text.

**Open, for the chair:**
- Should Professional Rivalry pass between two office-holders, or between noble and office, as Mentor and Successor's "noble↔office share" does?
- Should the faction and seat exemptions apply to Professional Rivalry too? Applied as written, the line stays at 70%.

## 8. Unit 12: the chair's ruling on Professional Rivalry, and the re-measure

**The ruling, verbatim:** "(1) Professional Rivalry PASSES between two office-holders, between noble and office, and between noble and noble (two councillors, a mayor and a baron, are rivals for standing); it also passes within one class (military/military, clergy/clergy, arcane/arcane, criminal/criminal, merchant/merchant, same trade, shared market). It FIRES only across unrelated classes (gravedigger/baron, armourer/high priest, cartographer/gravedigger). (2) Yes — the faction and seat exemptions apply to Professional Rivalry too (a rivalry inside one faction is the most plausible kind). Jurisdictional Tension stays as it is (two offices)."

**How it is read** (`readerBattery.js :: exemptedVerdict`):
- Professional Rivalry passes for one class; for any two of office and noble; and for merchant with trade. Merchant with trade is my own reading of "shared market".
- Otherwise it falls to the same faction and seat exemptions as Mentor and Successor.
- `other` roles stay unjudged.
- Jurisdictional Tension is unchanged.
- This supersedes §7's "How Q1 is read" for Professional Rivalry.

**Receipts:**
- Red-first: the new fixtures against the previous module were 2 failed | 32 passed: Mayor/Baron PR silent, Baron/Knight PR silent, Armourer/High Priest PR fires, and two members of one faction (Gravedigger/Baron) PR silent.
- Green: the governing suites, 9 files, 80 passed. eslint is clean, and the strict domain tsc shows no error in the file.
- Artifacts: `artifacts/reader-60u12` and `artifacts/reader-1000u12` (168 s, 0 errors).
- `finding-classes.json` is byte-identical to the base `64aeda87` without the reader checks, at 60 and 1,000.

**The counts** (1,000 by tier, thorp → metropolis):

| relation-types | 60, unit 11 | 60, unit 12 | 1,000, unit 11 | 1,000, unit 12 | 1,000 by tier (unit 12) |
|---|---|---|---|---|---|
| exempted (the line) | 44 | **40** | 705 | **647** | 8/24/127/162/165/161 |
| ~strict (column) | 48 | 48 | 759 | 759 | 27/85/153/165/166/163 |
| professional-rivalry | 39 | **29** | 611 | **486** | 5/10/54/109/149/159 |
| mentor-and-successor | 35 | 35 | 552 | 552 | 3/15/116/144/151/123 |
| jurisdictional-tension | 9 | 9 | 82 | 82 | 0/0/7/8/26/41 |

Every other class is unchanged from §7.

**What is left in the exempted line:** the largest class pairs at 1,000 are, in settlements:

| kind | class pair | settlements |
|---|---|---|
| Mentor and Successor | clergy/office | 213 |
| Professional Rivalry | military/office | 198 |
| Mentor and Successor | merchant/office | 148 |
| Professional Rivalry | clergy/office | 125 |
| Mentor and Successor | office/trade | 119 |
| Professional Rivalry | merchant/office | 107 |
