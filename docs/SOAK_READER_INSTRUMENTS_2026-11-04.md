# Soak reader instruments: the plausibility observations, counted (2026-11-04)

> A dated lane record (lane READER-INSTRUMENTS). Base `lane/window-rung1-2026-11-04`. The brief named `3be939ac5`; the checkout was newer, at `64aeda87` (rung 1C's docs commit on top), and the lane proceeded from there. The owner, 2026-11-04 ~15:25 UTC: "Add these kinds of observations to your 1000+ runs as well". **Instruments only: nothing here cures anything.** The cures are the READER WINDOW.

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
   - (a) `[luxury-imports]`: a thorp or hamlet whose Imports line (Economy tab) holds luxury goods, fine textiles, camel herds, spices, silk, exotic goods or gems.
   - (b) `[strength-no-house]`: an Economic strength (Resources tab) naming a resource trade with no house behind it. The map is `STRENGTH_HOUSES`, and every pattern is held against `institutionalCatalog.js`'s names by a unit test.
     - ✎ Strengths that name no single house are not read: Agriculture, Grain production, Livestock, Hunting, Trade hub, Central trade hub, Maritime trade, River trade, Exotic goods.
   - (c) The Exports item count by tier, as a distribution (`readerDistributions`; one item per `primaryExports` pill).
3. **`relation-types`** — the Relationships tab's two-line rows.
   - Mentor and Successor, or Professional Rivalry, between roles that share no trade or office (`shareTradeOrOffice`).
   - Jurisdictional Tension where neither role holds an office (`HOLDS_OFFICE`: an office or noble class, a command, a senior see, a guild's head).
   - ✎ Classes share an office or trade by family: office + noble form governance; merchant + trade form commerce, where two named trades must match, though a generic craft role such as Guild Warden or Master Craftsman sits beside any trade.
   - ✎ `other` roles are not judged.
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

## 4. The counts

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

## 6. Open questions for the chair

- **relation-types at 76%:** most of it is office↔military rivalry and office↔clergy or merchant "Mentor and Successor". Is a Guild Master mentoring a Mayor (a guild-council polity) a mismatch?
- **"Quality textiles":** is it luxury-class for check 2a?
- **strength-no-house at 77%:** the strengths are the terrain's static list (`geographyData.js :: economicStrengths`). Is the cure to filter the list, or to keep it as "terrain potential"?
- **daily-life:** the placeholder prints on every page. Should the instrument count the line itself rather than its two sub-cases?
