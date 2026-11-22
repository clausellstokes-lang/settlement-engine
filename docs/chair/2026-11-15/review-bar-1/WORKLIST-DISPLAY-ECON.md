# READ-ALL worklist · DISPLAY-ECON · rows the display composes on the Economics, Resources, Magic and Outlook tabs (no fixed run to trace: find the writer first), and those tabs' own leaves

7 flagged sentences (HIGH 0), read at the joined line e5b421802 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-DISPLAY-ECON.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/components/new/tabs/EconomicsTab.jsx`
- `src/components/new/tabs/ResourcesTab.jsx`
- `src/components/new/tabs/MagicTab.jsx`
- `src/components/new/tabs/OutlookTab.jsx`
- `src/domain/facts/magicSource.js`
- `src/domain/facts/chainWorking.js`
- `src/domain/display/magicProvisionShown.js`
- `src/domain/display/chainNeedShown.js`
- `src/domain/display/foodBalanceBar.js`
- `src/domain/display/tradeListDisplay.js`

## By file (flagged sentences · towns printing, summed)

- `(untraced)` · 4 · 741
- `src/components/new/tabs/EconomicsTab.jsx` · 1 · 183
- `src/components/new/tabs/MagicTab.jsx` · 1 · 122
- `src/domain/display/magicProvisionShown.js` · 1 · 7

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- (untraced) ::  · 4 · 741
- src/components/new/tabs/EconomicsTab.jsx :: shortWords · 1 · 183
- src/components/new/tabs/MagicTab.jsx :: MagicTab · 1 · 122
- src/domain/display/magicProvisionShown.js :: NOT_FOOD_NOTES · 1 · 7

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 338 | C11638 | Systems/Magic | bar0-village-calm-rand-2 | Economic role: occasional | magic roles economic/military/infrastructure 'occasional', medical 'common' under 'Reliance on magic: None'; elsewhere no arcane practitioners, no wards, magic 0% of food | (untraced) (line  at e5b421802)  |
| MED | 183 | C9234 | Systems/Economics | bar0-town-calm-rand-2 | A few households still go short, and a bad season would leave more of them hungry. | says households go short and a bad season would hurt; FOOD gap 0%, deficit 0%, Secure, six months in a granary | src/components/new/tabs/EconomicsTab.jsx (line 768 at e5b421802) shortWords |
| MED | 138 | C3694 | Systems/Economics | bar0-city-wartime-rand-2 | Production: 6,176 lbs/day+ 4,426 imported | prints 4,426 imported and C3696 short 1,120; header says imports cover 4374 and deficit 10% (1,172 of 11,722) | (untraced) (line  at e5b421802)  |
| MED | 138 | C6977 | Systems/Economics | bar0-metropolis-calm-rand-2 | Production: 20,625 lbs/day+ 25,101 imported | prints 25,101 lbs/day imported and short 1,204; header FOOD ledger says imports cover 24,897 and the gap is 3% (about 1,408) | (untraced) (line  at e5b421802)  |
| MED | 127 | C12198 | Systems/Resources | bar0-village-famine-rand-2 | ✓ Fully exploitedFishmedium value | Fish 'Fully exploited' while FOOD says the fish failed (failed source fish, famine cut 65%) and the fishing chain stands impaired | (untraced) (line  at e5b421802)  |
| MED | 122 | C8625 | Systems/Magic | bar0-thorp-calm-rand-2 | Nothing structural at Beishan depends on arcane work. | says nothing depends on arcane work; FOOD shows 1% made by magic and the food text says some food came by spell | src/components/new/tabs/MagicTab.jsx (line 102 at e5b421802) MagicTab |
| MED | 7 | C1750 | Systems/Magic | bar0-city-under_siege+famine-rand-2 | Fuel & Heating: Arcane fabrication and stone-shaping partially offset depleted extraction | Fuel & Heating row says stone-shaping offsets 'depleted extraction'; the fuel chain draws on coal/peat, not stone (copied from the stone row) | src/domain/display/magicProvisionShown.js (line 54 at e5b421802) NOT_FOOD_NOTES |
