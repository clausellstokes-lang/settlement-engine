# F4 CRIME-SIGNAL — A-06 by writer (lane RUNG1B-F4, 2026-11-04)

Base `f9ce225c5` (lane/window-rung1-2026-11-04). Instrument: `scripts/audit/soak-review/checks.mjs`
A-06 fires when the screen holds "No criminal infrastructure" AND one of
`criminal network | thieves' guild | crime boss | kingpin`.

## 1. MEASURE (unit 1)

`node scripts/audit/soak-review.mjs --count 1000 --workers 4 --out artifacts/f4-base`:
A-06 = **16** — soak1k-42 62 129 134 248 276 325 373 393 531 565 579 630 830 842 930.
Record scan: `node scripts/audit/crime-signal-writers.mjs <from> <to> <out>` (birth only).
"Signal" below = a `category: 'criminal'` faction on the FINAL roster, or a house
`corruption.js :: isCriminalInstitution` names (it agrees with
`roleCategory.js :: institutionCategoryFlags(...).hasCriminal` on all 1,000 places).

| writer of the "organised" phrase (or of the false "none") | of the 16 | corpus, record | brief's cause |
|---|---|---|---|
| `safetyProfile.js :: generateSafetyProfile` "debt evasion" (indebted stress) — "using criminal networks to avoid collection" with no signal | **9** (42 62 129 276 325 373 565 630 930) | 38 places | not named in the brief |
| `historyGenerator.js :: buildHistoricalEvent` `crime_wave` tension filled from the pool with no signal ("the criminal network", "A guard captain is on the payroll of the criminal network") | **3** (134 830 842) | 8 places | not named |
| `npcData.js` Guard Captain goal "Identify which of their officers is on the thieves' guild payroll" with no signal (Tonight tab) | **2** (531 579) | 15 NPCs | (ii) CONFIRMED |
| safety survival line "No criminal infrastructure" born at the economy step, beside a roster Thieves' Guild | **2** (248 393) | 4 places | (iii) CONFIRMED |
| `powerStructure.factionRelationships` naming a criminal faction off the roster | **0** | 69 places carry a row for a TRIMMED criminal faction; 782 carry a row for some trimmed faction | (i) cause CONFIRMED on the record, REFUTED as a screen cause of any of the 16 (the Power tab prints only roster pairs) |

Record-only falsehoods behind the same signal (no screen hit at this base):
`npcGenerator.js :: mergeNPCLists` writes `secondaryAffiliation` "criminal network" (471 NPCs) or
"Thieves' Guild" (17) where no criminal faction or house exists; the secret "On the payroll of the
thieves' guild as a silent informant" survives in 17 no-signal places because the existing
sanitiser's `/thieves guild/` misses the apostrophe; 6 places hold an NPC `secondaryAffiliation`
naming a faction the density law trimmed.

Causes, in code:
- (i) CONFIRMED: `applyDensityLaw.js :: resizeSeats` returns `{ ...powerStructure, factions }`, so
  every `factionRelationships` row (and its narrative and dmNote) written by
  `rulingStructure.js` before the trim outlives it. soak1k-248 keeps Merchant Guilds, Religious
  Authorities and Craft Guilds rows on a two-seat roster.
- (iii) CONFIRMED: pipeline order is generateEconomy → generatePower → … → generateNarratives →
  assembleSettlement; the FINAL roster exists only after `resizePoliticalRoster` inside
  assembleSettlement. The safety profile is written at generateEconomy.
- The NPC goal is drawn at generatePopulation (`npcGenerator.js` role goals); `mergeNPCLists` runs
  in the coherence tail AFTER the trim, on the final roster and estate. The history tension is
  drawn at generateNarratives, on the pre-trim roster (a trim only removes a criminal faction,
  never adds one, so "no signal before the trim" implies "no signal after").

## 2. The count at the tip (unit 5)

`node scripts/audit/soak-review.mjs --count 1000 --workers 4 --out artifacts/f4-tip`, at the lane tip
(units 2, 3, 3b, 4, 4b): **A-06 16 → 0.** 1,000 of 1,000 born, 0 errors.

| unit | writer | A-06 seeds cured | records moved (1,000 births) | golden rows moved (of 525) |
|---|---|---|---|---|
| 2 | `applyDensityLaw.js :: pruneToRoster` (rows naming a trimmed seat) | 0 | 782 (exactly the places with such a row; 54 no-trim controls identical) | 0 |
| 3 | `mergeNPCLists` affiliation, secret, goal read `crimeSignal.js` | 531 579 | 309 (exactly the no-signal NPC-writer places) | 99 |
| 3b | history fill sets `crime_wave` aside without the signal | 134 830 842 | 8 | 1 (also among unit 3's 99) |
| 4 | `safetyProfile.js :: settleCrimeLinesToSignal` survival line, at assembly | 248 393 | 4 | 0 |
| 4b | the same, debt-evasion line | 42 62 129 276 325 373 565 630 930 | 38 | 0 |

Soak records moved base → tip: 873. Golden master base → tip: 99 rows (list:
`artifacts/f4-golden-rows-moved.txt`, not committed); NOT re-recorded. One row,
`town|germanic|mountain|random_trade|civilized|gm-seed-a`, carries TWO causes (units 3 and 3b).

Other classes that moved (both down on net; every place but one through unit 2's pruned narratives):
- `coh:defense-words` 534 → 518: 16 places, every one moved by unit 2 (e.g. soak1k-244's pruned
  Merchant-Guilds/Religious row "Merchants fund churches, endow hospitals ..." on a roster without
  either; read as "hospital without a hospital").
- `info:battery-would-not-vouch` 808 → 803: 6 gone (unit 2), 1 new — soak1k-830, whose crime wave
  (unit 3b) was redrawn as a tension carrying "The merchant quarter and the labourers' quarter remain
  walled apart", which the battery reads as walls without walls (F1 DEFENCE-WORDS' instrument area).
Every other class unchanged.

Owed by this lane, not recorded by it:
- `tests/lint/heldKeyWriterCensus.walker.test.js` A3: DISCOVERY_EXEMPT row
  `{ symbol: 'settleCrimeLinesToSignal', reason: 'rewrites the safety profile crime-line descs inside
  economicState from the final crime signal; economicState is not a held key.' }` (unit 4).
- `tests/fixtures/generator-golden-master.json`: 99 rows (units 3 and 3b).
- `tests/fixtures/x46-npc-band-dark-digests.json` (`tests/generators/x46NpcBand.test.js`, "sixty seeds
  (ten a tier) generate byte-identically to the dark digests"): 19 of 60 seeds moved by the lane's
  composed units (v2 worlds, so units 2 and 3 can both reach them; per-unit split NOT measured).

Governing suites at the tip (109 files naming a changed writer): every title red at the base
f9ce225c5 is red here; new reds are exactly the two rows above (census A3, the X-46 dark digests).

Residue (record only, no screen hit at the tip): 6 places keep the generic "Thieves' Guild"
`secondaryAffiliation` where only a criminal HOUSE exists; `powerStructure.criminalCaptureState`
survives the trim of the criminal faction it describes; the signal counts a RUINED criminal house
(as `deriveCriminalStructure` did before this lane).
