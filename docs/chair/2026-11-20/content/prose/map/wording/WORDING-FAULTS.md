# WORDING-FAULTS: three wording faults, measured by the sentence

Measure-only (PROSE-2 helper, brief `MEASURE-WORDING`, 2026-11-20). No source or test was changed. The run used commit b9ab84760 on branch `lane/prose-2-2026-11-20-wording`. The seeds are `hxd-<size>-0..49` across six sizes, so 300 places. Each place was born as `../gen11-fields/gen11-fields.census.mjs` births it (no compose), and the census walks each record the same way that one does.

This census differs from GEN11-FIELDS in one way. It reads **every** place, not only the `needs_review` places. So it finds each sentence wherever it is stored, and the `flagged` column says how many of those places the battery convicts. The walk's joined text equals `recordTextSurfaces`' own at all 300 places (`walkMatches 300`). In every quoted sentence, `#` stands for the place's own name.

## Fault 1: the size noun "town" at a place that is not a town

The census mapped every `tier-noun` finding (over the receipt's own joined `town` text) to its field. That gives 16 findings at 16 places, from **2 distinct sentences**.

| field path | sentence | places | flagged | sizes |
|---|---|---:|---:|---|
| `culturalIdentity.defensePattern` | "Civic musters come first; paid guards are added only when a threat lasts and the town can pay." | 14 | 14 | hamlet 5, thorp 3, village 3, metropolis 2, city 1 |
| `stress.cast.stakes[].reason` | "it speaks for the creditor the town owes" | 2 | 2 by the check; **0 in the receipt** | metropolis 1, village 1 |

**The receipt never sees the second sentence.** The receipt holds 14 tier-noun findings, and they are the 14 `defensePattern` places. The two places that carry the `stakes` sentence (`hxd-village-32` and `hxd-metropolis-19`) are both receipt status `pass`. The cause is the order of writing. `assembleSettlement` writes the receipt, and `resolveCrisisCast` writes the cast afterwards. The receipt is written again only when a temporary person is minted (the `resolveCrisisCast.js` docblock says so). So the battery convicts this sentence on the final record, but the receipt does not carry the finding.

**WRITER**
- Sentence 1:
  - It is composed by `src/data/cultureProfiles.js :: materializeCulturalIdentity` (through `materializeOne`, `defensePattern: choose(source.defensePattern, …)`), which is called from `src/generators/steps/resolveConfig.js`.
  - The data row is `src/data/cultureProfiles.js :: CULTURE_PROFILES.greek.defensePattern`, the row "Civic musters come first; paid guards are added only when a threat lasts and the town can pay." It is a plain string with no `needs`.
  - The file's own docblock says that a `defensePattern` line is drawn before any institution exists.
- Sentence 2:
  - It is composed by `src/generators/steps/resolveCrisisCast.js` (step `resolveCrisisCast`), over `src/domain/crisis/crisisCast.js :: deriveCrisisCast`.
  - The data row is `src/domain/crisis/crisisCast.js :: STAKE_REASONS.creditorAgent`. It is reached through the `RAISED_BY_CRISIS` row `['indebted', 'Resident agent of the external creditor', 'creditorAgent', 'opens']`.

**PRINTED**
- Sentence 1:
  - Web dossier: none found.
  - PDF: `src/pdf/lib/cultureOnPage.js :: RAW_CULTURE_ROWS`, the "Defense" row. It prints only at town tier or larger (`SMALL_TIERS` thorp, hamlet and village print no raw row).
  - So of the 14 places, the 3 at city and metropolis print "the town can pay" in the PDF, and the 11 at thorp, hamlet and village print it nowhere.
  - Foundry: none found.
- Sentence 2:
  - Web: `src/components/new/tabs/CrisisTab.jsx`, the Stakes rows (`k.reason`), composed by `src/domain/crisis/crisisPage.js :: composeCrisisPage` (`stakes … reason: speak(shown.reason)`).
  - PDF: `src/pdf/sections/CrisisSections.jsx` (the Stakes lines).
  - Foundry: `src/foundry/journalPages.js`, through `composeCrisisPage`.

**WHO HOLDS THE FILE.** These are the `origin/lane/*` branches whose diff from their merge-base with HEAD touches the file.
- `src/data/cultureProfiles.js` is held by four branches:
  - `rung2-shadow-2026-11-07`, last commit "docs(census): the R2-SHADOW phase 1 record — merge, the 1,000 …"
  - `join-rehearsal-2026-11-14`, last commit "docs(JOIN-REHEARSAL): the census's eight kinds at the joined tree …"
  - `review-bar-0-2026-11-14`, last commit "docs(REVIEW-BAR-0): parts C and D, the writers and their lanes, and the report"
  - `measure-2026-11-17`, last commit "measure-1: second measure, L 99ca9ad51 vs M 7e8fd4cc1"

  None of the four is from 2026-11-20. Three of them have 2 changed lines that mention `defensePattern`; whether those lines are this row was not read.
- `src/domain/crisis/crisisCast.js` is held by those same four branches and by 13 FRAME branches of 2026-11-20:
  - `frame-2-2026-11-20-b10`, "fix(FRAME-2 · B10): a person in the crisis cast is never "it" …"
  - `frame-3-2026-11-20-b11`
  - `frame-4-2026-11-20`
  - `frame-5-2026-11-20`
  - `frame-5-base-2026-11-20`
  - `frame-6-2026-11-20`, last commit "docs(FRAME-6): brief F5R …"
  - `frame-6-2026-11-20-c2`, "fix(FRAME-6 · C2): a Stakes row stands in prose …"
  - `frame-6-2026-11-20-f-wip`
  - `frame-6-2026-11-20-f5-wip`
  - `frame-6-2026-11-20-lint1`
  - `frame-6-2026-11-20-p1bf`
  - `frame-6-2026-11-20-p4a`
  - `frame-6-2026-11-20-six`

  **No FRAME branch's changed lines name `creditorAgent` or "the town owes"** (0 matching lines in each). FRAME-6 · C2 rewrites how a Stakes row is spoken, so it sits next to this sentence.
- `src/generators/steps/resolveCrisisCast.js` is held only by `measure-2026-11-17`.

## Fault 2: "May operate hospital/school." where no hospital stands

The census took every stored string that carries "hospital" (1,859 strings at 154 places). It then kept those that the defense-words check convicts as "hospital without a hospital". That leaves **7 places and 2 distinct sentences, all of them in `institutions[].desc` and all at town tier**. This matches the receipts' 7, and GEN11-FIELDS' 7.

| field path | sentence | institution | places | flagged | sizes | hasHospital at those places |
|---|---|---|---:|---:|---|---|
| `institutions[].desc` | "Religious community. May operate hospital/school." | Monastery or friary (Religious) | 4 | 4 | town 4 | false at all 4 |
| `institutions[].desc` | "An order living in common. It may keep a hospital or a school." | Monastery or friary (Religious) | 3 | 3 | town 3 | false at all 3 |

The draw has a third member that no place drew: "A community of the religious. Sometimes runs a hospital or school." It also names a hospital.

**WRITER**
- The text is composed by `src/generators/steps/assembleInstitutions.js` in its draw-free description loop: `inst.desc = speakTierNoun(… drawInstitutionDesc(pool, …))`.
- That loop draws through `src/generators/steps/institutionDescDraw.js :: drawInstitutionDesc`, over the pool `[catalog desc, ...INSTITUTION_DESC_VARIANTS["town|Religious|Monastery or friary"]]`.
- The data rows:
  - `src/data/institutionalCatalog.js`: the religious-centre entry `shared: { face: 'the abbot', exclusiveGroup: 'religiousCenter', … }`, `at.town` `{ name: 'Monastery or friary', baseChance: 0.4, desc: 'Religious community. May operate hospital/school.' }`.
  - `src/data/institutionDescVariants.js :: INSTITUTION_DESC_VARIANTS["town|Religious|Monastery or friary"]`, which is the `PAIRS` entry beginning "A community of the religious. Sometimes runs a hospital or school." and its partner "An order living in common. It may keep a hospital or a school."

**PRINTED**
- Web: `src/components/new/tabs/InstitutionsTab.jsx :: institutionDescription`.
- PDF: `src/pdf/sections/Institutions.jsx`, from `src/pdf/lib/viewModelBodySlices.js` (`description: inst?.desc || …`).
- Foundry: `src/foundry/journalPages.js :: institutionsPage` (`descOf(i)`).

**DOES THE INSTITUTION THAT SAYS IT EXIST?** Yes. The line is the description of a Monastery or friary that stands on the live roster.
- Only one institution kind carries the line in this sample: the town-tier "Monastery or friary". Its city and metropolis rows ("Different religious orders.", "Five to ten major monastic houses …") name no hospital.
- `defenseFactsOf` (`src/domain/defense/defenseFacts.js`) reads the same record and the same roster row:
  - It counts the row as a **healer**. `HEALER_RE` is the healer pattern joined with `INSTITUTION_KIND_PATTERNS.monastery`, so at all 7 places it gives `hasHealer = true` and `healerName = 'Monastery or friary'`.
  - It does not count the row as a hospital. `hasHospital` reads `INSTITUTION_KIND_PATTERNS.hospital` (`/\bhospital/i`) over institution **names**, so it is false at all 7 places.
- No town in the sample stored the line beside a real hospital. Of the 82 places with a hospital, the 8 towns have a "Small hospital" and no monastery line.

**WHO HOLDS THE FILE.** All four files are held only by the four older branches named under fault 1, none of them from 2026-11-20:
- `src/generators/steps/assembleInstitutions.js`
- `src/generators/steps/institutionDescDraw.js`
- `src/data/institutionalCatalog.js`
- `src/data/institutionDescVariants.js`

No changed line in those four branches names the monastery row or "hospital/school" (0 matching lines).

## Fault 3: "…remain walled apart"

This is the **one sentence "The merchant quarter and the labourers' quarter remain walled apart"**. It is stored at **45 places**, in three fields, and only at town, city and metropolis. No thorp, hamlet or village stores it: its small-place twin "The merchant families and the labouring families still keep apart" takes over there.

| field path | sentence | places | flagged | sizes | hasWalls |
|---|---|---:|---:|---|---|
| `history.historicalEvents[].lastingEffects[]` | "The merchant quarter and the labourers' quarter remain walled apart" | 38 | 5 | metropolis 15, city 13, town 10 | true 33, false 5 |
| `history.currentTensions[].lastingEffects[]` | the same | 7 | 3 | town 5, city 1, metropolis 1 | true 4, false 3 |
| `history.legacyAnnotations[].annotation` | "As of the founding survey, the Economic Divide (N years ago) hit the settlement hard, and it has since recovered: the trade that keeps the settlement prosperous today was rebuilt, piece by piece, after it. What it left behind (the merchant quarter and the labourers' quarter remain walled apart) is still part of the place." | 16 | 4 | city 7, town 5, metropolis 4 | true 12, false 4 |
| `history.legacyAnnotations[].annotation` | the same clause after "… set up ways of doing things that have since changed: the merchants lost the place they held then, and have never won it back." | 2 | 0 | city 1, metropolis 1 | true 2 |
| `history.legacyAnnotations[].annotation` | the same clause after "… left trouble that has never been put right: the present money troubles began then, in what the settlement came to depend on." | 2 | 0 | town 2 | true 2 |
| `history.legacyAnnotations[].annotation` | the same clause after "… set up ways of doing things that have since changed: the merchants have mattered here ever since, and their power today was built up slowly over the years." | 1 | 0 | metropolis 1 | true 1 |

**Every place without walls is convicted, and every place with walls passes.** The battery reads the sentence as a claim that the town is fortified.

**WRITER**
- `historicalEvents[].lastingEffects[]` is composed by `src/generators/historyGenerator.js :: generateEventNarrative`, as `lastingEffects: sizedLastingEffects(selectedEffects, hookFacts)`. The sizing is done by `src/generators/history/sizedLastingEffects.js :: sizedLastingEffects`, which resolves the row over `HISTORY_DESC_SIBLINGS`.
- `currentTensions[].lastingEffects[]` is composed by `src/generators/historyGenerator.js :: buildHistoricalEvent` (the tension map, `lastingEffects: sizedLastingEffects(tension.lastingEffects, hookFacts)`).
- `legacyAnnotations[].annotation` is composed by `src/generators/legacyGenerator.js :: deriveLegacyAnnotations`, through `buildAnnotation` and `annotationBody`. That writer takes the event's **first** lasting effect into "What it left behind (…) is still part of the place."
- The data rows:
  - `src/data/historyData.js :: HISTORICAL_EVENTS_DATA`, in the entry `type: 'economic_disparity'` ("The merchants are getting richer and the labourers are not …"), at `lastingEffects[1]`, "The merchant quarter and the labourers' quarter remain walled apart".
  - `src/data/historyData.js :: HISTORY_DESC_SIBLINGS["The merchant quarter and the labourers' quarter remain walled apart"]`. It has the town form (`needs: ['tier: ≥ town']`) and the twin "The merchant families and the labouring families still keep apart" (`needs: ['tier: ≤ village']`).

**PRINTED**
- `historicalEvents[].lastingEffects[]`:
  - Web: `src/components/new/tabs/HistoryTab.jsx`, the expanded event card (`evt.lastingEffects.join(' · ')`).
  - PDF: `src/pdf/sections/HistoryFounding.jsx` (`ev.lastingEffects`), from `src/pdf/lib/viewModel.js`.
- `currentTensions[].lastingEffects[]`: **none found**.
  - On the web, `HistoryTab.jsx :: TensionRow` does not print it.
  - The PDF's `viewModel.js` tensions map drops it.
- `legacyAnnotations[].annotation`:
  - Web dossier: none. `generalStateProse.js :: legacyPoolKey` reads it and does not print it.
  - The table view prints the top annotation only: `src/components/TableView.jsx`, through `src/domain/summary/tonightAtTheTable.js` (the Twist, `annotations[0]`).

**WALLS FOR DEFENCE, OR WALLS INSIDE?** Walls inside. The sentence speaks of two quarters kept apart from each other, not of a wall around the place. Its own event is "The Economic Divide" (`type: economic`, `templateType: economic_disparity`). Its stored descriptions at these places are:
- "The merchants are getting richer and the labourers are not, and the labourers have noticed"
- "A widening gulf between the well-off and the working poor breeds lasting resentment"
- "The merchant class prospers while common laborers fall behind, and the bitterness spreads"

Its sibling lasting effect is "Wage disputes settled by a standing arbitration council since founded". Nothing in the event concerns a siege or a defence. The battery reads "walled" as a fortification claim (it is in the `walls|walled` term of `defenseWordsFindings.js`), so at a walled place the line passes, but for the wrong reason.

## The cures I would propose (MY PROPOSAL; the wording is VETOABLE, the owner's)

1. **Fault 1.** Reword the data row `CULTURE_PROFILES.greek.defensePattern` to say no size, for example: "…paid guards are added only when a threat lasts and there is coin to pay them." Reword `STAKE_REASONS.creditorAgent` the same way, for example "it speaks for the creditor the place owes". The receipt timing (the cast is written after the receipt) is a separate finding. It is not a wording cure.
2. **Fault 2.** Reword the catalog row and both variants of the town `Monastery or friary` so they claim no hospital, only what `defenseFactsOf` already grants the house (a healer). For example: "Religious community. Its members nurse the sick and teach letters." A gate on the writer is not needed, because the monastery always stands where the line is stored.
3. **Fault 3.** Reword the data row (in `HISTORICAL_EVENTS_DATA` and in its `HISTORY_DESC_SIBLINGS` key together, since the key is the text) to drop the physical wall. For example: "The merchant quarter and the labourers' quarter still keep to their own streets". The sentence is not a lie about defence. It is a wall the record holds nowhere, read by a check for town walls. If the owner keeps the wording, the other cure is "nothing; the battery misreads internal walls". That would be a matter for the check, not for this lane.

## EXECUTED vs INFERRED

**EXECUTED**
- **The census.** `wording.census.mjs` ran as six vitest processes, one per size, and each exited with 0 and wrote 50 rows (300 in all, `walkMatches 300`).
- **The tally.** `tally-wording.mjs` produced every count in the tables: the sentences, places, flagged, sizes, `hasHospital`, `hasHealer` and `hasWalls`. It also produced the reconciliation lines:
  - tier-noun: 16 by the check, 14 in the receipts
  - hospital: 7 flagged, 7 in the receipts
  - walls: 5 + 3 + 4 flagged, equal to GEN11-FIELDS' rows
- **Which places carry the second fault-1 sentence.** That those two places are receipt `pass` comes from the census rows (`status`, `receiptTierNoun 0`).
- **The holders.** `holders.sh` ran after `git fetch -q origin '+refs/heads/lane/*:refs/remotes/origin/lane/*'` and `git fetch --unshallow` (the clone was shallow, so 821 branches had no merge-base before the unshallow). It covered 1,061 branches and found 54 holds.
- **Whether a holder's changed lines name a fault row.** This is a grep of each held diff's +/- lines for the row words. A grep is not a reading of the lines.

**INFERRED (code reading, not run)**
- **The writers and data rows.** These come from searches for each sentence and reading the enclosing functions.
- **Why the receipt misses the cast sentence.** This comes from the `resolveCrisisCast.js` docblock and `assembleSettlement.js` l.476. The order was not traced at run time.
- **"Printed".** This is a containment search for each field's key plus reading the matched lines. No page was rendered, and the PDF's town-or-larger gate was read, not evaluated.
- **Whether the three older lanes' `defensePattern` lines are this row.** Not read.

## Files

Committed beside this report:
- `wording.census.mjs` (the census)
- `vitest.wording.config.mjs` (`vitest.gen11f.config.mjs` copied, rooted at `WORD_ROOT`)
- `tally-wording.mjs` (the tally)
- `holders.sh` (the holder scan)

Run, from the worktree root `$W`:

```
for s in thorp hamlet village town city metropolis; do ( WORD_ROOT=$W \
  WORD_FILE=$W/docs/chair/2026-11-20/content/prose/map/wording/wording.census.mjs \
  WORD_SIZES=$s WORD_N=50 WORD_OUT=$SCR/rows.$s.jsonl \
  npx vitest run --config $W/docs/chair/2026-11-20/content/prose/map/wording/vitest.wording.config.mjs > $SCR/log.$s.txt 2>&1 ) & done; wait
node docs/chair/2026-11-20/content/prose/map/wording/tally-wording.mjs $SCR
sh docs/chair/2026-11-20/content/prose/map/wording/holders.sh $W <files…>
```

The rows stay local, in the helper's scratchpad `wording/` folder:

| file | size (bytes) |
|---|---:|
| `rows.thorp.jsonl` | 26132 |
| `rows.hamlet.jsonl` | 28017 |
| `rows.village.jsonl` | 32884 |
| `rows.town.jsonl` | 58454 |
| `rows.city.jsonl` | 96952 |
| `rows.metropolis.jsonl` | 167327 |
