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
