# TAIL-CLOSE-SRC-3 — hand-back (kept current with each push)

Branch `lane/tail-close-src-2026-11-15`, from TAIL-CLOSE-SRC-2's tip `74fb74668` (origin had no later commit); first act
`dbb3e5b5b`, ONE merge of the joined line at `29b9795e4`. Scratch clone outside the main checkout, its own `npm ci`.
Births: CENSUS-3's `births.mjs` over its 720 seeds through RECORD-MEASURE-1's `births-only.sh` (both `git archive`d from
`lane/census-3-2026-11-14` and `lane/record-measure-2026-11-14` into my scratchpad), the decompressed corpus sha256
(first 16): base `991c330f7e97730d` at `dbb3e5b5b` (the predecessor's swept figure); `01c3bf6a773cb6bb` after the one
declared move (`a1568930c`), and after every later commit.

MOVING CHECK: three-dot `join...branch` over every `lane/tail-*` branch for each listed file: NONE moving on another seat
(only this branch's own earlier commits differ, on `crimeSignal.js` and `governanceNarrative.js`). `defenseDisplay.js` and
`castPowers.js` are still, but NOT REACHED (below).

THE READERS ARM (my probe: `readerArm()` against `bankedReaderLines(register.readers)`, the walker's own functions; the door
NOT run): at the merge **101 files / 487 lines read, 97 / 477 banked, 27 rising lines**; at this push **98 / 477, 19 rising
lines**. (A line count equal to the bank's is not green: the defenceGenerator falls are still unbanked; the close's door banks them.)

| file | family | state | commit |
|---|---|---|---|
| `steps/generateNarratives.js` | tavern | ROUTED, no town moved: the home's `hasInstitution` was already asked, through an object literal the arm cannot read as the home's call; the record named once (`estate`) | `63ad9deb8` |
| `domain/crimeSignal.js` | guild | ROUTED, no town moved: `/thie\|criminal guild/` -> `/thie/ \|\| namesCriminalGuild(...)` (the home's own reader; the union is the old test exactly) | `1c67b60bd` |
| `power/governanceNarrative.js` | faith | ROUTED, no town moved: `hasOwnChurch` reads the vocabulary's `church` atom (`factsOf(...).faith.hasChurch`). Measured first through the institutions home's `temple ∪ monastery`: that moved ONE hamlet (r2r-hamlet-21, a wayside shrine only) and was dropped for the faith reading, the fact's own home. 2589e9157 folds a comment back under F31's 800-line ceiling | `ca94f3f17`, `2589e9157` |
| `power/rulingStructure.js` | faith (swap) | **DECLARED MOVE, 6 towns**: "all ecclesiastical" reads the `church` atom; the old `includes('monastery')` missed every "Multiple monasteries" row. One field family, `powerStructure.factions[].desc` of the religious powers ("Church holds substantial temporal power; tithes fund civic works …" -> "Church institutions hold direct temporal power; tithes, land, and courts are all ecclesiastical."): r2r-city-20 (2 powers), r2r-city-38, r2r-city-44 (2 powers), r2s-politically_fractured-city-3, r2s-recently_betrayed-city-0, r2s-recently_betrayed-city-1. Readers read: `claimStanding.js` (both sentences in its table), `presumedThings` registers (both presume `temple`), the shown desc. **FOR THE OWNER'S VETO LIST** | `a1568930c` |
| `safetyLineTruth.js` | crime (3) | TWO ROUTED, no town moved: `GANG_HOUSES_OF` and `governs` move verbatim into the crime home (`crimeSignal.js :: gangHousesOf`, `:: criminalSeatGoverns`). ONE NAMED: `entry?.type === 'Criminal governance' && … desc.endsWith(VACUUM)` matches the arm by an entry's TYPE LABEL, no fact's name test; no reader cures a label: the chair's | `1301d5c4d` |
| `priorityHelpers.js` | crime (swap) | ROUTED, no town moved: `hasGangInfra` = `gangHousesOf(names) > 0` (the reader its comment already named) | `fd5c98010` |
| `economy/economicState.js` | guild, magic, crime (swap) | ROUTED, no town moved: the arcane-industry houses move into the magic home (`facts/magic.js :: ARCANE_GUILD_HOUSES`, `arcaneGuildHouseStands`); the smuggling-house test into the crime home (`crimeSignal.js :: namesSmugglingHouse`). The file reads only its banked lines | `e28552112`, `9fec33d30` |
| `narrativeText.js` | market, faith, magic (swap) | NAMED, not cured: the three lines are POOL PROSE whose `needs: ['market']` / `needs: ['church']` already declare the vocabulary's atoms; the arm reads the `needs` literal (and the prose word "magic") beside a `.filter((s) => s.type === …)` call. No name test to route: the chair's (a walker reading, or the register's) | — |
| `power/factionStanding.js` | magic | NAMED: `/arcane orders/i.test(rival.faction) ? 'The arcane orders have'` is the verb's agreement with a power's NAME, not "is there magic"; no reader answers a name's grammar: the chair's | — |
| `power/stressFactions.js` | crime | NOT IN MY LIST (a rise the predecessor did not list): `he.faction.toLowerCase().includes('thieves')`, from d99bce57a (TAIL-POWERS-B-4 batch 8, P31). NOT REACHED | — |
| `npcGenerator.js` (guild, crime), `settlementQuickGuide.js` (market; guild swap), `computeActiveChains.js` (mill), `foodBalance.js` (mill), `viability.js` (smith, guild; bank, magic swaps) | | NOT REACHED (budget) | — |
| `defenseDisplay.js` (crime ×2; and the DEFENCE-FACT READERS walker's four court-bench reads, ~:883 and :905–907, d5839e51) | | NOT STARTED, by the chair's word (07:32): the crime reads leave the arm with TAIL-TIES-10's cut (T29, `facts/criminalStructureKey.js` declared a crime home); the four court-bench reads go through the defence home ONLY after the chair's "THE CUT IS ON THE LINE AT <tip>": FOR A SUCCESSOR | — |
| `people/castPowers.js` | crime | still (no seat moving it), NOT REACHED | — |

PROOF CARRIED BY EACH COMMIT: the 720 births after every commit (byte-identical but the one declared move, counted);
the readers' probe after each; eslint on the touched files, 0; `tsconfig.full.json` 167 and `tsconfig.domain-strict.json`
1900 after the first batch and again at the push's head (the merge's own counts; 0 introduced). Test files naming the first
batch's files (66): 9 files red at HEAD; the same 9 at the base: the failing set equal but for ONE red of mine
(F31 `governanceNarrative.js: 801 lines`), cured by `2589e9157`; the architecture battery's one red (the dependency-cycle
set: defenseDisplay | governanceAccount | faithReading | factsOf) is the base's. The second batch's named files (36 more:
safetyLineTruth, priorityHelpers, facts/magic, economy/economicState): 3 red at HEAD, the same 3 at the base.

B (7c, 7d, 7e): NOT REACHED. 7c's next step stands as the predecessor wrote it (bisect inside 69b53decd's and
ea788e17c's lanes, `UPDATE_SITE_COHERENCE_BASELINE=1`, print-only); 7d's door is a re-recorded block in
`scripts/lib/news-voice-contract.mjs` once the cause is bisected; 7e is the owner's door once the landing is named.
