# REVIEW-R2-CODE-A · 2026-11-14 · round two's first code lane, 0d3972d8f → f63b5d762

The seat: REVIEW-R2-CODE-A (session_01ACmDYYowHxrkJSzxsVoQxD), the chair's brief `docs/chair/2026-11-14/briefs/BRIEF-REVIEW-R2-CODE-A.md` on `lane/chair-2026-11-08`. Read: `lane/r2-code-a-2026-11-13` at **f63b5d762** (origin read back: unmoved at the first act). The stage's own change: the lane's 74 first-parent commits after 0d3972d8f and the merge of the line `16e5184bf` (its remerge diff: one code file). Instruments under `probes/REVIEW-R2-CODE-A/`; nothing here was run in a tree a suite was running in; refs and the local config were compared before and after every suite and push (unchanged).

THE VERDICT: (at the end of the file)

## Step 1 — every new or reworded line, read where it prints

`REVIEW-R2-CODE-A-LINES-READ.md` (pushed 5dab49b61 before any claim was read): 49 lines; 274 readings in 222 rendered towns, plus every printing town by script over 3,048 births at tip and base. **The stage's own: 0 HIGH, 1 MEDIUM (L46), 12 LOW. Carried HIGH/MEDIUM: 11 rows.** The last reader's two medium lines: both CURED ("still at sea" only where the water is maritime, 30 of 30; the famine merchants only with a market, 141 of 141, the twin "whoever brings the food in" in the 85 with none).

## Step 3 — the laws (field diff, the stage's own, the census's 720)

The stage's base against its tip swamps in the line's own merge (3,044 of 3,048 towns move; 798 move `config.nearbyResources`: the line's), so the stage's own moves were read in its two own spans (`fielddiff.mjs`, the census's 720, `^r2[rs]-`):

- **0d3972d8f → 581d89dad (the 46 commits before the merge): 416 of 720 towns, leaf diffs 1,858.** Families: `.settlementReason[]` 148 · `.history` 148 (`founding.reason` 97, `founding.stressNote` 33, `founding.foundedBy` 28 (the hamlet founder), `currentTensions` 4 and `siegeNarrative` 1 (the plague note's quotes), `historicalCharacter` 1) · `.economicViability` 127 (`plotHooks[]` 109, `.hook` 71, `.category` 55, `.severity` 4, `summary` 84 (its hook count), `issues[]` 4 (the plague note)) · `.arrivalScene` 64 · `.npcs` 63 (`plotHooks[]` 62, `secret` 4) · `.pressureSentence` 31 · `.generationCoherenceReceipt` 2 (its findings quote the founding row: an echo of the founding cure, not declared that I found). **NEW/GONE KEY: 0.** No family outside the text the cures name (no roster, power, config, food figure or person moved): no draw moved upstream of the lines.
- **16e5184bf → f63b5d762 (after the merge): 35 of 720.** `.history.founding.reason` 22 (the pass-over, R2-CODE-A-9), `.pressureSentence` 10 (the famine line, R2-CODE-A-10), `.arrivalScene` 3 (the siege pool, R2-CODE-A-10). NEW KEY 0.
- The neutralised tip (step 1's method): the resolutions alone move `.history.founding.reason` 436, `.settlementReason[]` 230, `.npcs[].plotHooks[]` 274 of 3,048, and 3 coherence findings; nothing else.
- **Vocabulary:** `src/domain/facts/factVocabulary.js` is untouched by the stage (no new word). **The register** `tests/fixtures/.golden-freeze-register.json`: untouched by the stage. **THE DRAFT SHIFT RECORD: NOT WRITTEN at f63b5d762** (the statement, §18: "for THE DRAFT SHIFT RECORD (not yet written; signing is the merge seat's)": the 70 registered files ran 674 tests, 10 red, at c77bd5d57); I measured no declared-moved surface because none is declared.
- **A stored composed sentence naming a power:** the siege's pressure line now names `r.govFaction` (the governing power) in the stored `pressureSentence` where it named the first card; the pattern is the pool's own (other rows already print `govFaction`) and `domain/factionRename.js` rewrites `pressureSentence`; I did not test a HIDDEN power on it (NOT MEASURED). The underworld line now names no power (`'the local underworld'`): the cure of record 331, held (L44: 82 towns, every one with crime houses).
- **The page shows the machinery** (carried, not the stage's writer): `economicViability.summary` "… 2 operational dependencies … 1 plot hooks available." prints in 644 base towns and 640 tip towns; the stage's hook removals moved which towns (744 at 581d89dad).

## Step 4 — a plant of my own for each guard

The stage's 40 test files (`git log --name-only` over its commits) run at the tip: **326 of 326 green.** Plants in my scratch copy of the tip (`probes/…/neutralise.patch`, the plant lines in the probe log), each run against all 40 files:

| plant (the fault) | red | only on it? |
|---|---|---|
| the three resolutions off (`admittedRow`, `admittedIndex`, the religious refusal: `NEUT=1`) | 9: foundingRowsRead A2 A3 A5 ×2, originRowsRefused ×3, religiousHookLayHolder, foundingSeeds.probe (its receipt is a resolved row) | yes (31 other files green) |
| a siege line "gates stand open" | arrivalSiegeGatesShut ×2 + census2dTables (its ledger) | yes |
| the plague note at sea everywhere | plagueFishInland | yes |
| the famine hook's merchants with no market | famineHookMarket | yes |
| the indebted merchant district without its size | arrivalCrisisRoster + proseWiringCensus ×2 + census2dTables (registers) | yes |
| the quarantine secret without `market` | informantNoThievesGuild, stressSecretDeclared + proseWiringCensus ×2 | yes |
| the commerce line without `market` | pressureRowsRead ×2 + proseWiringCensus ×2 | yes |

**Every guard I planted reds on its fault and only there.** CURES OR LINES WITH NO GUARD: (1) **the siege pool's market** — `arrivalSiegeGatesShut` reads gates and carts only, so L46's "the noise of a market" under "Field work and trade have stopped" is guarded by nothing; (2) **the indebted merchant district's market** (carried L05): no guard asks the district for a market; (3) the reworded lines with no condition (L09, L11, L12, L13, L47, the `ground` arm's five) have no guard of their text beyond the registers' census (text greps: 0 test files name "holy symbols", "shuttered and scorched", "what the others eat", "Building has stopped").

## Step 6 — the gates and the reds, by my own run at the tip

- `npm run typecheck:domain:strict`: exit 0 (1113, ceiling 1113). `npm run typecheck:ratchet`: exit 0 (167, ceiling 167). `npx eslint` on the stage's 62 touched src/tests/scripts files present at the tip: exit 0. (All through `scripts/gate-tail.sh`.)
- The reds the statement names (§18, §19), run as FILES at the tip and at the base (19 files; the ledger ref fetched first):

| file | tip | base | the statement's class | agrees? |
|---|---|---|---|---|
| proseFamilyContract.walker | 5/8 red | 4/8 red | the line's (red at 976db5b19) | yes (the line's file; its own rise) |
| siteCoherenceRatchet | 1/9 | 0/9 | the line's | yes, as classed (not at the stage's base: arrived with the line) |
| newsHeadlineContract, newsVoiceContract | 0/8, 0/8 (load and pass) | 0/8, 0/8 | the line's, "fails to load" | green in my run with the ledger ref present |
| rosterFinalUnderHeldRoster | 1/7 | 1/7 | the lane's, before the stage | yes, CARRIED |
| worldFactRederive | 1/7 | 0/7 | the lane's (red at da4b904fc, green at the line) | yes: green at the stage's base, so a red the stage made, and named |
| factLayers.walker | 1/15 | (absent at base) | the lane's (the same 5 rises) | yes |
| mutationCoverageManifest TOTALITY | 1/10 | 1/10 | LEFT: 38 files with no entry | yes, grown by the stage's new guard files |
| negativeAssertionAnchor | 2/9 | 2/9 | LEFT: 30 bare negatives in 16 lane files | yes |
| presumedThings.walker | 1/43 | 0/17 | arm 1 red on 18 FOR THE DECLARATION PASS | yes |
| noLegacyFactionReaders | 0/4 | 1/4 | CURED (8a8776dfc) | yes |
| tuningRegister | 0/76 | 1/76 | CURED (8e6fd5e58) | yes |
| defenceFactReaders, missingLeaves, timberHookForestHeld, seedLoopTotality, writerReach, ledgerCitationIntegrity, domainAnyCastBaseline | all green | (green or absent) | CURED or green on re-run | yes |

13 red of 327 at the tip, every one named in the statement; none unnamed. The whole suite was NOT run (the brief: the named files, not the suite).
