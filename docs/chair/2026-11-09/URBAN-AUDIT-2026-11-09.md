# URBAN-AUDIT — why cities and metropolises draw more referee findings, by writer (2026-11-09)

**Seat:** URBAN-AUDIT, a read-only audit seat, child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`). **Base:** `origin/lane/integration-2026-11-07` at `edf53f249` (the STYLE-2-MERGE / TIER-PARITY-FIX merge point). **Why:** the owner's word of 2026-11-09 18:5x, "Do it before deploy", on the chair's urban measurement. This record is the brief for the FIX lane the chair will cut from the merged tip. **No product byte changed:** the only writes are this file and its roster bump. Every cure below is a PROPOSAL for the chair's ruling.

**Method.** (1) The referee at the base: `node scripts/audit/soak-review.mjs --count 1000 --workers 4 --out <scratch>/soak`, exit 0. (2) A probe (scratch, not committed) re-births each of the 1,000 by index (`soak-review/corpus.mjs :: birth`), walks every stored string with its record path, and runs `tierNounFindings` and `foodWordsFindings` on each string. It also records the tensions with their template-matched events, and every crisis cast row with the NPC's role, power, first-rank house and rank. The probe's receipt (`recordBatteryFindings`) matched the per-string findings on all 1,000 settlements (0 mismatches). It also matched the referee's `info:battery-would-not-vouch` counts at city and metropolis (120 and 153).

**Labels.** CONFIRMED means re-driven or counted by execution on this base. PLAUSIBLE means read from source but not driven.

## 1. (A) The referee at the base — the baseline for the fix lane

The run has 1,000 settlements: 166 or 167 per tier, not 100. Figures are per 100.

| tier | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| findings per 100 (rows ÷ settlements) | 59 | 61 | 49 | 66 | **92** | **107** |
| `battery.tier-noun` (% of settlements) | 0 | 0 | 0 | 0 | **72** | **92** |
| `battery.food-words` | 19 | 14 | 17 | 15 | 16 | **26** |
| `reader:tension-memory` | 4 | 1 | 4 | 2 | **14** | **12** |
| `battery.defense-words` | 43 | 53 | 30 | 57 | 0 | 0 |
| `A-09:behaviour-line-share` | 0 | 1 | 2 | 0 | 0 | 0 |
| `reader:hook-pools` | 0 | 0 | 2 | 0 | 0 | 0 |

CONFIRMED. The chair's run at `28997691b` (100 per tier) read city 96 and metropolis 109. At this base, tier-noun has risen to 72 and 92, from the chair's 67 and 68.

## 2. (B) Tier-noun at city and metropolis — every flagged sentence, its writer, its class

**How the battery keeps its evidence.**
- The check is `src/domain/coherence/tierNounFindings.js :: tierNounFindings`. It reports a singular "town"/"town's" outside a kept span (`stateProseKernel.js :: TIER_NOUN_KEPT`, `tierNounKeptSpans`).
- `recordBattery.js :: recordBattery` maps each finding to `{quote: context, detail: '"town" for a <tier>'}`.
- The receipt (`src/generators/recordBatteryFindings.js :: recordBatteryFindings`) keeps a 160-character `evidence` quote.
- The soak's `info:battery-would-not-vouch` keeps only the paths, so the sentences were recovered by the probe.
- **The battery reads the STORED record, not the page:** every string with a space, except under `config`, `generationCoherenceReceipt` and `simulationTrace`.

**Result (CONFIRMED): all 273 urban flags come from ONE string.**

| # | flagged settlements | record path | sentence | writer | class |
|---|---|---|---|---|---|
| B-1 | 120 city · 153 metropolis | `spatialLayout.quarters[].location` | "Old town or slums" | `src/generators/spatialGenerator.js` — the "Shadows District" quarter (the underworld-district branch of the quarters builder; `has('Thieves') \|\| has('criminal') \|\| has('Black market')`) | **LEGITIMATE English.** "Old Town" names a district of a larger place, the same reading the chair's ruling 4 (TIER-NOUN-POOLS) gave "lower town". It does not name this settlement. |
| B-2 | 0 in the receipt (3 hamlet · 1 village · 2 city on the final record) | `stress[].cast.absent[].reason` | "the town already has one" | `src/domain/crisis/crisisCast.js :: CAST_ABSENCES.townCap` | **Already spoken on the page.** `crisisPage.js` passes `absent[].reason` through `speak(...)`, the tier-noun door, so the Crisis tab reads "the hamlet already has one". The stored receipt never sees this string: it is computed before `resolveCrisisCast` writes the cast (CONFIRMED on soak1k-85, -199, -331, -530: receipt `pass` or food-words only). |

**Precision of the battery at city and metropolis: 0 true mismatches in 273.** CONFIRMED.

**B-1 never reaches a reader.**
- The only component that renders `quarter.location` is `src/components/new/SummaryTab.jsx`, and it is unmounted (`dossierLazyTabs.js` records SummaryTab and SummaryTabV2 as left in place, with nothing in src mounting them).
- `townLayoutV2.js :: locationBias` parses the string for placement and matches none of its words, so placement is neutral.
- `districtProfile.js` carries it as `origin`, and nothing renders that.
- `aiLayer.js` grounds quarters by name only.
- CONFIRMED on the samples and the referee: none of the 60 sample dossiers contains it, and `coh:tier-noun` on the rendered surfaces is 0.

**The reader-visible effect is the receipt, not the sentence.**
- B-1 alone makes `record_coherence_battery` read `needs_review` on 103 of 166 cities and 114 of 166 metropolises that have no other finding.
- With C-1 (§3) also cured, **every** city and metropolis receipt passes: 129/129 and 157/157 flagged today, and nothing else remains (CONFIRMED by the probe).
- The receipt's status selects the page's self-vouching line (`recordBatteryJudgment`: "selected only on a 'pass'"). So the cure moves rendered text on about 286 urban settlements in the 1,000 (PLAUSIBLE: the line's surfaces were not rendered before and after).

**The rendered page at city and metropolis (CONFIRMED, from the 20 urban samples).**
- Every singular "town" sits in a kept phrase: "the town they started in" ×12, "crown or town" ×15, "Town crier" ×51, "lower town in the valley" ×4, "a nearby town" ×3, "in town" ×10.
- The chair's 32 "town" in the city samples are all LEGITIMATE.

**"city" on a metropolis is outside the battery.**
- `SINGULAR_TOWN` matches only "town", and `speakTierNoun` rewrites only "the/this/a town".
- In the 10 metropolis samples there are 810 "city": 404 are compounds (city watch, city hall, city-wide, city-scale, city administration), 46 name other places or structures (underground city, inner city), and **348 are self-references** ("the city", "a city's size").
- The self-references come from the institution catalogue. Writers (CONFIRMED by grep of the quoted sentence):

| frame (as rendered) | writer |
|---|---|
| "The city's primary military asset" · "across the entire city" · "activities in the city" · "anywhere in the city" | `src/data/institutionServices.js` |
| "beneath the city, wide enough" · "moves across the city" · "the city's health depends" · "every part of the city" · "power the city tolerates" · "hundred people in the city" · "built for a city's size" | `src/data/institutionDescVariants.js` and its byte copy `src/data/institutionDescColour.js` |
| "The city's maps are the most accurate" · "Employed by the city or a guild" | `src/data/institutionalCatalog.js` (the second also in `institutionDescVariants.js`) |

- **Class: for the chair to rule.** A metropolis is a city in plain English. The tier-noun law has so far ruled only "town on a non-town".

**The existing door.**
- `src/domain/display/stateProse/weaveBlock.js :: tierNounFor(tier)` returns the settlement's tier token, or null for an unknown tier.
- `src/domain/display/stateProse/stateProseKernel.js :: speakTierNoun(line, noun)` speaks a line in that noun, honouring `TIER_NOUN_KEPT` (licensed rows carry `tiers`).
- Writers already route through it: historyGenerator (`speakRecord`), assembleInstitutions (`inst.desc`), economicState (tolls), arrivalScene, `weaveBlock`, every desk read, and crisisPage's `speak`.
- `src/domain/facts/factVocabulary.js` holds no tier noun. A fix uses the door above, never a new helper.

**THE CHAIR'S RULINGS ON (B)** (message of 2026-11-09 19:0x UTC, recorded verbatim in substance):

1. **"Old town or slums" is the INSTRUMENT's false positive, not the text's fault.** "Old Town" is a district name, licensed English like "lower town".
   - The cure is B-P1: one `TIER_NOUN_KEPT` row, `'old town'` at city and metropolis, by identity (the phrase, not the line).
   - It needs a red-first arm: red at the current battery on a planted city, green with the row.
   - The receipt flip is measured as the UNSIGNED register moves it causes, each named to this one cause in the fix lane's record.
   - **No writer changes for tier nouns.** B-P2 and B-P3 are withdrawn.
2. **"city" on a metropolis is NOT a mismatch and needs no cure.**
   - A metropolis is a city in plain English, and the compounds (city watch, city hall) are the only natural words.
   - The common self-references ("across the entire city") read better than the tier word would; "across the entire metropolis" is the machinery showing.
   - The tier word belongs where the tier itself is named: the identity line and the tier slots.
   - The four writers named below (`institutionServices.js`, `institutionDescVariants.js` with its byte copy `institutionDescColour.js`, `institutionalCatalog.js`) stay as they are. `speakTierNoun` stays untouched. B-R is closed.

So the fix lane's tier-noun work is one licence row and its arm.

**Proposals (B)** (as written before the rulings; B-P1 RULED, B-P2/B-P3 withdrawn, B-R closed (a)):

| id | proposal | files | moves | census-law check |
|---|---|---|---|---|
| **B-P1 (recommended)** | One licensed row: `{ phrase: 'old town', tiers: ['city','metropolis'], why: 'a district of a larger place, the Shadows District quarter in generators/spatialGenerator.js; the twin of "lower town" (chair ruling 4)' }`. "town" is the corpus's own noun, so no rewrite runs there. | `stateProseKernel.js :: TIER_NOUN_KEPT` (one row) | no prose text changes, but the stored receipt (a record field) loses its finding, so the golden master moves on all 168 urban rows (§6a; CORRECTED from "no generated byte", which was wrong). The receipt flips, so the self-vouching line moves where B-1 was the only finding → prose manifest (and the fence and herald if they print it), as UNSIGNED cause commits. The kept-list pin tests that enumerate `TIER_NOUN_KEPT` move too. | writes no prose |
| B-P2 | Reword the quarter's location to name no noun: "The oldest streets, or the slums". Keep it free of `locationBias`'s words (central, edge, dock, hill…) so placement does not move. | `src/generators/spatialGenerator.js` (the Shadows District row) | the record's bytes on every place with the quarter (golden master); the receipt flip as B-P1 | the writer holds only the quarter kind; the line states no fact beyond it |
| B-P3 | Run the receipt after `resolveCrisisCast`, or have the receipt speak `cast.absent` through `speak`, so the receipt and the page read the same text. | `recordBatteryFindings.js` or the pipeline order | receipt only | n/a |
| B-R (ruling) | "city" on a metropolis: (a) ruled legitimate, no change (default); or (b) the institution catalogue speaks its self-references through `speakTierNoun` extended to "city" → "metropolis" at metropolis, with compounds licensed. (b) is new capability in the door, so it is the chair's call. | the four data files above and `stateProseKernel.js` | catalogue text at metropolis (prose /1,050, gm, fence) | — |

## 3. (C) Food-words at city and metropolis — the writer and what the battery objects to

**Result (CONFIRMED): one writer, one code.** Every food-words finding on the 1,000, at every tier, is `source_not_held` on `culturalIdentity.foodways`.

Settlements flagged — thorp 31 · hamlet 23 · village 28 · town 25 · city 26 · metropolis 43. Most-flagged sentences at town, city and metropolis:

| n | sentence | detail |
|---|---|---|
| 32 | "Flatbreads, grains, pulses, dates or orchard fruits, dairy, spices, and irrigated garden produce anchor meals." | no grain or livestock source |
| 22 | "Grain, orchard produce, preserved meat, dairy, and ale anchor the local table." | same |
| 21 | "Rye or barley breads, pottage, smoked foods, and seasonal livestock products dominate ordinary meals." | same |
| 19 | "Oats or barley, dairy, cattle products, woodland foods, fish, and seasonal preserves shape the table." | same; some also lack fish |

**What the battery objects to.**
- A table sentence ("meals", "the table") names grain or livestock (`foodways.js :: SOURCE_WORDS`), and the food record's `foodSources` holds neither.
- **From town up, no settlement in the 1,000 holds grain or livestock as a source of its own.** `foodSources` there is only `[]`, `['fish']`, `['mill']` or `['fish','mill']` (CONFIRMED). The place eats bought food, so every culture line that names a staple is flagged.
- Metropolis runs higher (26 against 15–16). PLAUSIBLE: the `mixed` culture joins two lines, so it has two chances to name a staple. Not driven.

**Writer.**
- `src/data/cultureProfiles.js :: materializeCulturalIdentity` (`materializeOne`: `foodways: choose(source.foodways, rng)`) draws the culture's raw line. It reads only the culture key and a stream: **no tier, no food record, no imports.**
- The page never prints it. The one home of the foodways sentence is the food record's line (`foodways.js :: composeFoodwaysLine`, read by `foodwaysLineOf`). That line already keeps a culture sentence only when it names no source the place lacks.
- The PDF prints `culture.foodways` only for a save older than the record (`IdentityDailyLife.jsx :: CultureRows`).
- No sample dossier contains any culture foodways line (CONFIRMED). The finding is again receipt-only.

**Proposals (C), each for the chair's ruling, none applied:**

| id | proposal | files | census-law check |
|---|---|---|---|
| **C-1 (recommended)** | ONE HOME: where the food record exists, the stored `culturalIdentity.foodways` takes the record's composed line, so the stored and printed sentences are one. Fallback: the receipt skips the superseded field. The skip must key on the PATH; the key name `foodways` alone would also skip the record's own line. | the assembly step that holds both (`src/generators/steps/assembleSettlement.js`), or `recordBatteryFindings.js :: recordTextSurfaces` for the fallback | adds no wording; the line is `composeFoodwaysLine`'s, which reads the place's sources |
| C-2 | A wording at scale for the culture pool, used only where the place holds no staple source of its own. The model, in the chair's words: "{Culture staples} come in by cart and barge; the place's appetite outruns its fields." | `src/data/cultureProfiles.js` (the foodways pools), routed through `composeFoodwaysLine`'s no-source branch | **STRUCK as written for the culture writer:** it holds no record, so "come in by cart" states an import it does not hold. Licensed only inside `composeFoodwaysLine`, which reads the sources, and only if the import share is read there (`foodRecord.normalImportPct`, which `readerBattery` already consults). The existing claimless fallback ("Meals follow the season and what the household has put by.") already serves. |

C-1 moves record bytes (golden master), not rendered text, plus the receipt flip of §2.

## 4. (D) Tension memory

**The rule.**
- `src/domain/coherence/readerBattery.js :: tensionMemoryFindings` takes a Current Tension printed on the History page. Its "source event" is the first historical event whose `templateType` equals the tension's `type`.
- The event's band is read off the page: `HistoryTab.jsx :: recencyLabel` — ≤10 Recent, ≤30 Living memory, ≤80 Last century, ≤200 Ancient, otherwise Deep history.
- It fires when the band is Ancient or Deep history AND the tension's words name living participants (`LIVING`: "former", "survivors", "old loyalists", "collaborators and resisters continued", …).

**What it draws (CONFIRMED, the 61 findings).**

| event | living words | n |
|---|---|---|
| The Occupation (`occupation_legacy`) | "collaborators and resisters continued" | 59 |
| The Great Fire (`great_fire`) | "Survivors" (faction label) | 1 |
| The Tyranny (`tyranny`) | "Old loyalists" (faction label) | 1 |

Ages: 81–531 years.

| tier | ancient (81–200 y) | deep history (>200 y) |
|---|---|---|
| city | 16 | 7 |
| metropolis | 10 | 10 |
| village | 7 | 0 |
| thorp | 5 | 1 |
| town | 4 | 0 |
| hamlet | 1 | 0 |

**Why cities trip it (CONFIRMED by the probe).**
- The tension writer (`src/generators/historyGenerator.js :: buildHistoricalEvent`) never reads the timeline. Tensions and events are drawn independently from the same `HISTORICAL_EVENTS_DATA`, so the "source" is a coincidence of template.
- Cities have more of everything:

| tier | median age (y) | events per settlement | tensions per settlement |
|---|---|---|---|
| town | 174 | 4.7 | 1.73 |
| city | 309 | 7.2 | 2.50 |
| metropolis | 516 | 10.5 | 2.60 |

- `occupation_legacy` is drawn as a tension at about the same rate on every tier (23–29 per 167). But a matching Occupation is on the timeline for 26/29 city and 23/27 metropolis tensions, against 7/24 town. At city 23 of 29 sit in the Ancient or Deep bands; at metropolis 18 of 27.
- **Noticed, not this lane's question (intake to the fix lane's INBOX):** at small tiers most `occupation_legacy` tensions have NO Occupation event at all — 18/27 thorp, 19/23 hamlet, 15/27 village, 17/24 town. The tension says "A previous occupation ended" with nothing behind it on the page. No check counts this.

**Options (each a PROPOSAL; effect on the 1,000 computed from the 61-finding set, PLAUSIBLE, not re-driven):**

| id | option | effect on the 61 | files | moves |
|---|---|---|---|---|
| **D-1 (recommended)** | **Dated phrasing.** Pass the timeline (already built before the tensions in `generateHistory`) into `buildHistoricalEvent`. Where the tension's own-template event is older than 80 years, the template takes a dated variant. `occupation_legacy`: description "The occupation ended long ago, but the families who collaborated and the families who resisted still keep apart"; factions "Collaborator families", "Resistance families", "Those who want it forgotten". `tyranny`: "Loyalist families". `great_fire`: "Families still seeking someone to blame". | 61 → 0 (59 → 0 with occupation alone) | `src/generators/historyGenerator.js` (`buildHistoricalEvent`, the `generateHistory` call); `src/data/historyData.js` (a `descriptionByAge`-style variant on the three templates, beside the existing `descriptionByDirection` idiom) | no draw: the stream does not move; the History tab, PDF and Foundry text of the matched tensions → prose manifest, golden master, fence; no numeral, so the prose-numerics baseline is untouched |
| D-2 | **A memory horizon dial.** A tension whose own-template event is older than N years (N = 80, the page's Ancient boundary) is set aside and the fill draws again. | 61 → 0 on the flagged set, but the redraws are new and unmeasured | `historyGenerator.js` (the fill loop) plus a tuning constant (tuning register) | rng: every later draw in the history step moves → the golden master moves broadly |
| D-3 | **Age-decayed weight.** In the fill, weight a candidate by `exp(-age/τ)` of its own-template event. | probabilistic (not measured) | `historyGenerator.js` and a tuning constant | rng, broadly, as D-2 |

**Census-law check on D-1.**
- "long ago" is licensed by the age the writer would then read.
- "still keep apart" is the template's own lasting effect ("Collaborator and resistance families still keep to separate quarters").
- "families" is held: the effect names families.
- No "former" and no living participant, so the LIVING words go.
- Under 80 years the original text stays.

**One-writer note.** `historyData.js` is touched by SW-8 RENAME-POWERS on other rows: `religious_tension` factions, a diplomatic hook, an effects line, and `great_fire`'s first plot hook. D-1 touches the `great_fire` FACTIONS row, which is adjacent but a different line.

## 5. (E) The cast's scale at city and metropolis

**The cast.** It is stored on `stress[].cast.roles`, written by `src/generators/steps/resolveCrisisCast.js` from `src/domain/crisis/crisisCast.js :: deriveCrisisCast`.

**Instigator rule.** `crisisCast.js :: instigatorCandidates`:
- The houses are the outranking rival (`outrankingRivalOf`), then the houses that gain.
- Within a house, its members are taken BY RANK (`membersOf` → `people/membership.js :: membersByRank`).
- A member whose first-rank house holds the seat is skipped (RUNG2-F13). The house row comes after its members.

**Ranks.** `src/generators/people/castPowers.js :: rankPowers`:
- FLOOR 1: the seat first.
- FLOOR 2: a non-governing power's first is "the highest-weight member house whose LARGEST share lands on the power".
- Then a weighted roll. R-P5 (the owner's people law): "no borrowing, no padding, no fabricated citizen".

**Measure (CONFIRMED). Instigators by role:**

| tiers | casts | instigator rows | by role |
|---|---|---|---|
| town | 180 | 74 (all people) | dean 25 · senior guild master 10 · gang boss 6 · garrison commander 5 · watch captain 5 · smuggler 3 · master smith 3 · castellan 3 · apothecary 2 · others 1 each |
| city + metropolis | 353 | 123 (all people) | dean 34 · network's head 29 · garrison commander 20 · senior guild master 15 · watch commander 9 · **miller 7 · impresario 3 · vintner 1 · theatre manager 1** · gang boss 1 · exchange master 1 · college master 1 · senior craft-guild master 1 |

**A small-scale role instigates 12 of the 123 urban casts (9.8%).** One is a gang boss for a Thieves' Guild that gains from an `infiltrated` crisis, which is legitimate. **The other 11 are all the first-ranked member the noble power can field:**

| seed | tier | population | crisis | NPC (house, rank context) |
|---|---|---|---|---|
| soak1k-304 | city | 11,126 | politically_fractured | the miller — Noble Families' #2 behind the governor, who acts for the seat (the chair's anecdote) |
| soak1k-352 | city | 13,638 | insurgency | the miller — the noble power's #1, above the monarch at #2 |
| soak1k-724 | city | 5,431 | politically_fractured, religious_conversion | the miller (#1) |
| soak1k-916 | city | 4,265 | succession_void | the miller |
| soak1k-677 | metropolis | 19,171 | succession_void | the miller |
| soak1k-851 | metropolis | 19,447 | politically_fractured | the miller |
| soak1k-358 | city | 13,814 | recently_betrayed | the theatre manager |
| soak1k-533 | metropolis | 31,299 | succession_void | the impresario |
| soak1k-539 | metropolis | 45,508 | succession_void | the impresario |
| soak1k-905 | metropolis | 194,584 | succession_void | the impresario |
| soak1k-173 | metropolis | 258,626 | politically_fractured | the vintner |

Every one of the 11 instigates with the reason "outranks the seat while it weakens". Card power is 1–3 ("low").

**The mechanism (CONFIRMED on 304, 352, 724, 533, 173).**
- At city and metropolis the noble power holds no noble household of its own among the faced houses. Its ranked faces are the houses whose backing lands on it: `src/data/institutionBacking.js` maps 'Mills (2-5)' to noble 1.0, Opera house 0.6, Vintner 0.5, and Theaters.
- FLOOR 2 therefore makes the mill (weight 1, its whole share noble) the noble power's landmark.
- The monarch's or governor's largest share lands on the governing power, so they rank below the miller in the noble house, or are skipped as acting for the seat.

**Role × card power across all urban cast rows (CONFIRMED; `npc.power` 1–3 low, 4–7 moderate, 8–10 high):**

| role | town (low / mod / high) | city + metropolis (low / mod / high) |
|---|---|---|
| target | 0 / 0 / 62 | 1 / 0 / 107 |
| instigator | 39 / 25 / 10 | 69 / 34 / 20 |
| defender | 2 / 0 / 23 | **40 / 0 / 7** |
| lever | 29 / 7 / 10 | 97 / 2 / 0 |
| brunt | 29 / 7 / 8 | 80 / 2 / 7 |
| treater | 4 / 0 / 18 | 4 / 0 / 39 |
| waverer | 10 / 13 / 8 | 38 / 25 / 15 |

The urban defender skews low; this was noticed only, not investigated. PLAUSIBLE: it is the same rank-reads-the-faces effect.

**Options (no verdict — the owner may find a noble-backed miller exactly right; R-P5 is the owner's law):**

| id | option | files | moves |
|---|---|---|---|
| E-1 | The instigator prefers a member of standing: at city and metropolis, a member whose card influence is `low` yields to the house row ("the Noble Families"). The candidates already carry `factionRow` after the members. | `src/domain/crisis/crisisCast.js :: instigatorCandidates` | casts on about 11 urban settlements in the 1,000; the crisis surfaces' text (prose manifest, gm) |
| E-2 | The backing catalogue at scale: the urban mill is a guild or merchant concern, so 'Mills (2-5)' shares become noble 0.5 / craft 0.5 at city and metropolis (the `at:` idiom keys rows by institution, not tier, so a tier key is new shape). | `src/data/institutionBacking.js` (+ `castPowers.js` if keyed by tier) | memberships and ranks broadly → people goldens; the tuning register |
| E-3 | Keep the cast; the page says why. The reason line names the backing ("the noble houses' man at the mills") through the cast's reason table. | `crisisCast.js :: CAST_REASONS` | text only — and that table is SW-8's and SW-6's (§6) |
| E-0 | No change (R-P5 read as written). | — | — |

## 6. (F) The manifest — files a fix lane would touch, with one-writer conflicts and registers

Open lanes diffed at their merge-base with this base: `bd07005b9` for SW-8 RENAME-POWERS (`65a21239f`) and STYLE-2-PROJECTION (`4d340d060`). All thirteen open `lane/style-2-*` lanes were diffed against these files. Brief §3's SW-9b list was read.

| file (by symbol) | for | open-lane / SW-9b conflict | registers it moves |
|---|---|---|---|
| `src/domain/display/stateProse/stateProseKernel.js :: TIER_NOUN_KEPT` | B-P1 | none (no open lane touches it) | the receipt flip → self-vouching line: prose manifest, gm, fence, herald; kept-list pins |
| `src/generators/spatialGenerator.js` (the Shadows District quarter) | B-P2 | none | gm (record bytes) |
| `src/generators/recordBatteryFindings.js :: recordTextSurfaces` / `RECORD_TEXT_SKIPPED_KEYS` | B-P3, C-1 fallback | **SW-8** edits `PLACEHOLDER_FACTION` in this file (a different symbol) → sequence after SW-8 | receipt only |
| `src/generators/steps/assembleSettlement.js` | C-1 | none | gm |
| `src/data/cultureProfiles.js` (foodways pools) | C-2 (struck) | **SW-7 POWER-SIDE** (`be1f2d6b3`) edits two builtForm/socialTexture lines; foodways untouched | gm, prose /1,050 |
| `src/generators/historyGenerator.js :: buildHistoricalEvent`, `generateHistory` | D-1/2/3 | none open; brief §2 SW-B5 (merged) named "the fallback" | gm; for D-2/D-3 the whole history stream |
| `src/data/historyData.js` (`occupation_legacy`, `tyranny`, `great_fire` rows) | D-1 | **SW-8** edits four other lines (one is `great_fire`'s plot hook, adjacent to D-1's factions row) → after SW-8 | prose manifest, gm, fence (History tab, PDF, Foundry) |
| `src/domain/crisis/crisisCast.js :: instigatorCandidates` / `CAST_REASONS` | E-1 / E-3 | **SW-6 CRISIS-SURFACES** (`828ade53f`) rewrites ten `CAST_REASONS`, including `instigatorRival`; **SW-8** rewrites seven more; **SW-9b** owns "crisisCast's remaining selector reasons" (brief §3) → E-3 is THEIRS by row; E-1 (logic, not text) lands after SW-9b | casts; crisis surfaces (prose, gm) |
| `src/data/institutionBacking.js` | E-2 | none | ranks and memberships broadly (people goldens), tuning register |
| `src/generators/people/castPowers.js :: rankPowers` | E-2 if tier-keyed | none | as E-2 |
| `src/data/institutionServices.js`, `institutionDescVariants.js` + byte copy `institutionDescColour.js`, `institutionalCatalog.js` | B-R (b) only | `institutionalCatalog.js` also edited by **SW-7 POWER-SIDE**'s rows (its tip `be1f2d6b3` is not an ancestor of this base) | prose /1,050, gm, fence at metropolis |
| `src/domain/coherence/readerBattery.js`, `tierNounFindings.js` | none — instruments stay as they are | — | — |

### 6a. The licence row's doors (the chair's (F) ask, ruling 1)

**The battery's file.** `src/domain/coherence/tierNounFindings.js :: tierNounFindings` reads the kept list through `tierNounKeptSpans(text, tier)` (`src/domain/display/stateProse/stateProseKernel.js`). The row lands in `TIER_NOUN_KEPT` in that file. It is the one list both readers share: the battery and `speakTierNoun`. On "town" `speakTierNoun` is the identity, so the row changes no rewrite anywhere.

**Its tests.**
- `tests/domain/display/stateProse/tierNounKeptRulings.test.js` is the home of the licensed rows. Ruling 4's "lower town" describe is the template: the writer names it, it is kept at city and metropolis, and it counts at the four smaller tiers with an anchored invented line.
- The red-first arm is a planted city running `tierNounFindings({ tier: 'city' }, 'Old town or slums')`: one finding at the base, none with the row. The thorp-to-town control stays at one finding.
- Also read: `tests/domain/display/stateProse/tierNounSelfReference.test.js`, `tests/domain/coherenceBattery.test.js`, `tests/components/smallPlaceTierNoun.test.jsx`, `tests/generators/tierNounPoolDraws.test.js`. A test enumerating the list's length or members moves with the row, re-keyed by identity.
- `tests/lint/.tuning-inventory.json` names `TIER_NOUN_KEPT`; read its row before adding one.

**The receipt and the self-vouching line.**
- The receipt is `src/generators/recordBatteryFindings.js :: recordBatteryJudgment` (`record_coherence_battery`), stored at `generationCoherenceReceipt`.
- The line is DS-GEN-11 on the Viability tab, mount `viability.verdict` (`generalStateProse.js :: criticalIssuePoolKey(count, recordClean)`). `recordClean` comes from `generalDeskRead.js :: recordCleanOf`. A receipt that passes with a zero count takes the "criticalIssueCount zero" pool, which vouches. A receipt that does not pass takes the contradiction pool.

**The registers the row moves:**

| register | moves? | figure |
|---|---|---|
| the referee's findings on the 1,000 | YES | city 92 → **30**, metropolis 107 → **38** per 100. `battery.tier-noun` 72/92 → 0; `info:battery-would-not-vouch` rows 129 → 26 at city, 157 → 43 at metropolis. Smaller tiers unchanged. CONFIRMED by recomputation from the base run's findings; the fix lane re-drives it. |
| the generator golden master (`tests/fixtures/generator-golden-master.json`) | **YES** | It hashes `JSON.stringify(settlement)` whole (`pipelinePinnedMode.test.js :: hashFor`, "spelled exactly as generatorGoldenMaster.test.js spells it"), and the receipt is a field of the record. **168 of 525 rows carry the finding: every city and metropolis row (84 + 84).** Each one's receipt loses a finding, so 168 hashes move. 143 of those flip to `pass`; 25 stay `needs_review` with one finding fewer. CONFIRMED by generating the 525 at this base (ensureLaws loaded, `customContent: {}`); the hash delta is counted by the fix lane at its parent. |
| the composed-prose manifest (`tests/fixtures/dossier-prose-manifest-golden.json`, `tests/property/dossierProseManifest.test.js`) | **YES** | It composes the gm's 525 configurations through the six desks at both audiences, the general desk's DS-GEN-11 included. PLAUSIBLE: the 143 flipping configurations × 2 audiences, where the drawn pool changes from contradiction to zero. Its note at SELF-VOUCH records the same door moving 978 of 1,050. |
| the fence (`tests/lint/composeStateProseFence.test.js`), the herald, the witness, the PDF snapshot | measure at the parent | PLAUSIBLE: each moves only if its corpus prints DS-GEN-11 over an urban record. Not driven here. |
| the prose-numerics baseline, the lighting census | no | the zero pool's lines carry no numeral (to be confirmed at the door), and no file is added |

All of these are ONE cause, the licence row, as unsigned cause commits for STYLE-2-MERGE's signing per brief §0 point 3.

The lighting census's file count moves with any added or removed source file; none is proposed. Plan each cause commit's register deltas at its parent in a clean worktree, as the brief's §0 point 3 requires.

## 7. CONFIRMED against PLAUSIBLE

**CONFIRMED (re-driven on this base):**
- the referee table;
- B-1 as the sole urban tier-noun writer, and its absence from every page and the samples;
- the receipt flip counts (B alone; B + C);
- C's single writer and code, and the sources table;
- D's 61 findings by event, band and tier, the coincidence of template, and the occupation-event rates;
- E's instigator roles, the 11 noble-power faces, and the FLOOR 2 mechanism on five seeds;
- the open-lane diffs.

**PLAUSIBLE (read, not driven):**
- the self-vouching line's rendered delta;
- the metropolis food rate's cause (the `mixed` culture);
- every proposal's effect beyond arithmetic on the finding set (D-1, E-1);
- the urban defender skew's cause.

## 8. Noticed (intake: the fix lane's INBOX)

1. `occupation_legacy` tensions without an Occupation event: 69 of 101 below city. The tension states a past that the page does not hold.
2. The receipt runs before `resolveCrisisCast`, so it reads no cast text (B-2).
3. Urban crisis defenders are mostly low-power cards (§5).
