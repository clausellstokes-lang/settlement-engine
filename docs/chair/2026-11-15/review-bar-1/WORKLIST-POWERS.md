# READ-ALL worklist · POWERS · the powers: standing, claims, governance, the people's power lines

7 flagged sentences (HIGH 0), read at the joined line e5b421802 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-POWERS.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/data/faceHonorifics.js`
- `src/data/people/handlerTieLines.js`
- `src/data/stressPowerFaces.js`
- `src/domain/factionProfile.js`
- `src/data/people/titleSecretsPresentations.js`
- `src/data/people/dmPowerLines.js`
- `src/generators/power/*`
- `src/domain/dossier/powerStrata.js`
- `src/domain/display/governanceAccount.js`
- `src/generators/factionDynamics.js`

## By file (flagged sentences · towns printing, summed)

- `src/generators/power/claimStanding.js` · 1 · 98
- `src/data/people/titleSecretsPresentations.js` · 1 · 85
- `src/generators/factionDynamics.js` · 1 · 77
- `src/generators/power/governanceNarrative.js` · 1 · 57
- `src/generators/power/governingStressVignettes.js` · 1 · 27
- `src/generators/power/rulingStructure.js` · 1 · 12
- `src/generators/power/stressFactions.js` · 1 · 6

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/generators/power/claimStanding.js :: CLERGY_AT_MARGINS · 1 · 98
- src/data/people/titleSecretsPresentations.js :: ROWS · 1 · 85
- src/generators/factionDynamics.js :: MERCHANT_CRAFT_VOTE · 1 · 77
- src/generators/power/governanceNarrative.js :: deriveBaselineConflict · 1 · 57
- src/generators/power/governingStressVignettes.js :: buildWartimeNarrative · 1 · 27
- src/generators/power/rulingStructure.js :: generatePowerStructure · 1 · 12
- src/generators/power/stressFactions.js :: applyStressEventFactions · 1 · 6

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 98 | C1599 | Systems/Power | bar0-city-under_siege+famine-rand-2 | Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited. | Religious Authorities (strength 17, strongest power, contends for the seat) said to have limited political leverage at the margins; decisions are made by it | src/generators/power/claimStanding.js (line 45 at e5b421802) CLERGY_AT_MARGINS |
| MED | 85 | C2256 | World/NPCs | bar0-city-under_siege+famine-rand-2 | Secret: Has been digging clay from land that belongs to someone else and paying nothing for it | potter digs clay locally; LAND gaps say Potter lacks access to clay and the Gaps list says no clay reaches the potter | src/data/people/titleSecretsPresentations.js (line 192 at e5b421802) ROWS |
| MED | 77 | C9371 | Systems/Power | bar0-town-calm-rand-2 | Merchant Guilds and Craft Guilds vote together whenever trade is at stake, then fight over who keeps the profit. | Merchant and Craft Guilds vote together whenever trade is at stake; elsewhere merchants consistently outvote craft masters, and the relation is tense | src/generators/factionDynamics.js (line 354 at e5b421802) MERCHANT_CRAFT_VOTE |
| MED | 57 | C5005 | Summary/Overview | bar0-hamlet-calm-rand-2 | A dispute over grazing rights and water access has run for two seasons, and the families on each side no longer speak to one another. | a grazing/water dispute not in QUARRELS (none), TENSIONS (succession only), CRISIS or PAST; and 'no longer speak' contradicts Stable | src/generators/power/governanceNarrative.js (line 509 at e5b421802) deriveBaselineConflict |
| MED | 27 | C3856 | Systems/Power | bar0-city-wartime-rand-2 | A crown officer came last week and left with a list of what will be taken next month, and those in charge signed it because they saw no other choice. | says a crown officer came last week and those in charge already signed; Crisis hook says officer has arrived and the governing power must still decide | src/generators/power/governingStressVignettes.js (line 50 at e5b421802) buildWartimeNarrative |
| MED | 12 | C7216 | Systems/Power | bar0-metropolis-calm-rand-2 | Artisan guilds maintaining standards in a thin economy; not politically weak by choice, but by circumstance. | 'in a thin economy'; STATE says Prosperous, Economic Resilience Strong, diversified economic base with nine income sources | src/generators/power/rulingStructure.js (line 631 at e5b421802) generatePowerStructure |
| MED | 6 | C3893 | Systems/Power | bar0-city-wartime-rand-2 | Trade disruption and requisition are hurting the bottom line. | says Thieves' Guild is hurt by trade disruption; the crisis stakes say crime gains from the disorder | src/generators/power/stressFactions.js (line 325 at e5b421802) applyStressEventFactions |
