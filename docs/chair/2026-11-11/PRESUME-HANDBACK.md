# COHERENCE-PRESUME — the hand-back, by file (2026-11-11)

Lane `lane/coherence-presume-2026-11-11`, base `99bcc6944` (= `lane/integration-2026-11-07` tip at the cut).
I'm handing back BY FILE because my context is close to the 450k line the chair set (ruling C, 22:29) and the chair's later rulings (A: denials; B: time; the standing order withdrawing the culture bank) added work. A second seat should finish §3 below. Everything in §1 and §2 is committed and pushed.

## 1. The guard (before any cure)

- `tests/lint/presumedThings.shared.mjs`: the rule book. It holds 15 things, each with its words and the vocabulary atoms that answer for it. It also holds both arms, the negation reader, the NOT_PRINTED list (only the birth receipt's findings) and the LICENSED rule (chair ruling 2). The LICENSED rule says service rows are answered by their own institution, and it is checked by `unlicensedServiceRows`.
- `tests/lint/presumedThings.walker.test.js`: 12 tests, planted controls executed in the body. Arm 1 reads every literal of three words or more under `src/data` and `src/generators`, including text-keyed declarations across files. Arm 2 runs over the charter corpus (360 births, `presume-<tier>-<i>`, the browser's dials).
- `tests/lint/presumedThings.register.json` is shrink-only. Every row carries a named reason.
  - Arm 1 at the tip: 805 rows `after-release` (only arm 1 lists them) and 80 rows `other-lane`.
  - Arm 2 at the tip: 33 `premium-export-only` (**now WITHDRAWN by the owner's standing order: these must be cured; see §3**), 15 `hedge`, 12 `figure`, 11 `past`, 15 `other-lane`, 2 `ruling-3`, 1 `negation`, 1 `reported`.
- `tests/domain/presumeCorpusSeeds.test.js`: 19 corpus-seed proofs, one row per cured line. Each row was run red in the tree before its cure.

## 2. Cured (one cause per commit, each red first)

| commit | line(s) | base printings → tip |
|---|---|---|
| f6b6eaff9 | "Town watch and militia" → the watch alone (R-C overridden; R-Q forbids declaring militia at the power step) | 91 → 0 |
| 12e94a139 | the town bowyers' "town militias", catalog + 2 variants (and a stale `needs: militia` declaration) | 84 → 0 |
| 39bc8c4a7 | the dairy farmer's "weekly market" and the wildfowler's "the market" (the canonical lines became the twins) | 11 → 0 |
| e244f9ae4 | the ropemaker's "docks", the castellan's "garrison", the mint master's "money-changer" | 43 → 0 |
| 45464045e | "Emergency granary reserves" and "every purse in the market" | 10 → 0 |
| 115af5a76 | the dmNote "garrison commander" and "the watch rota" | 5 → 0 |
| d9c6d522e | `bank` added to `INSTITUTION_KIND_PATTERNS` / `INSTITUTION_WORDS` (chair ruling 5) | — |
| 0c47a8680 | the arrival's money changer and the indebted counting house now declare `institution: bank` | 7 → 0 |
| 1bf819954 | the market quarter's "money changers" and the hill village's "market cross" | 163 → 0 |
| 9e4e0402a | the Watch Captain placeholder → 'Veteran Soldier' where no watch stands; the id is kept | 13 villages → 0 |
| 4b79caac6 | "preferential market positions" and "the market quarter" (also `historyTemplate.js` and `history/historyRouteContext.js`, the line's own sources) | 4 → 0 |
| 9b03741ca | "Temple granaries blessed" → "Blessed stores" | 6 → 0 |
| 215dbfb20 | the trade-dispute variant | arm 1 only |
| 382a30d62 | six culture lines that reach the WEB (foodways on Economics; social texture on daily life) | 17 → 0 |

On the same seeds, the class's rows printed 481 times on the base corpus and 0 at the tip. That 481 includes 59 printings of "Armed escort & mercenary hire", which left by the licensing rule, not by a cure.

## 3. NOT DONE — for the second seat (the chair's rulings of 22:29 and 22:51)

1. **The culture lines, PDF Identity section (27 distinct sentences, 33 arm-2 rows), all in `src/data/cultureProfiles.js`.** Reword them so they presume nothing (DEFENSE-2's manner), or give them a water twin where the harbour is the point. Every row is listed under reason `premium-export-only` in the register. Relabelling them in the register was my act, and the withdrawn allowance makes it void. They print in `src/pdf/sections/IdentityDailyLife.jsx` only; the CULTURE_PROFILES_DAILY / ledger census files follow each change.
2. **A. Denials.** Arm 2 must also list a sentence that DENIES a thing the town has. Extend `printedAbsent` to the present side: a negated thing whose `absent()` is false. A denial must declare `excludes`. Member to cure: the services table's "No law, bring coin … (lawless)" (20 of 360 towns with a watch and a hall, court or council). The rule book's `negates()` is the reader to reuse.
3. **B. Time.** (1) "the people who lived through it are still here" and "as if it were last year" on events more than 60 years old. (2) A current tension sharing its sentence verbatim with a past event in the same town. (3) "a decade old" beside "23y ago" in the page's history lens. Sources are the history writers and their display lens.
4. **The one `reported` row**: `src/generators/narrativeText.js`'s declared `needs: market` mass-migration line printed in 1 town where the market fact is false at the end (a late write). The file is given to no lane.

## 4. Other lanes' lines (exact text and file)

- COHERENCE-AGREE: "A mercenary company provides enforcement: …" and "The merchant guilds maintain their own mercenary companies: …" and "A court exists, though the prison system is limited." (`src/generators/safetyProfile.js`). "War has taken the iron: …" (`src/generators/economy/foodBalance.js`). "markets meet infrequently …", "The market still opens, …" and "The market is shut …" (`src/generators/economy/prosperity.js`).
- COHERENCE-QUARREL: the issues "Control of the market licensing process" and "A mercenary contract being disputed by both parties" (`src/generators/power/conflicts.js`).

## 5. Red at the tip, the merge seat's act (no golden door run on the lane)

- **Goldens:** generatorGoldenMaster (408 configs), espionageDormancyFence's driven golden, generationForkCensus A1's control row.
- **Null-change pins that read the recorded goldens:** worldFactRederive A7, nameHeldThroughAssembly A1, pipelinePinnedChoosers A1, rosterFinalUnderHeldRoster A1.
- **writerReach (chair's ruling: the merge seat re-banks):** three rows — the frozen shapes digest, the frozen surfaceReach, and the lit-dial byte identity. It is green at e244f9ae4 and red from 9e4e0402a, the only commit that moves the executed corpus's shapes. It re-titles a role, which re-deals the ties and goals that read the role.
- **Draft shift record:** `docs/chair/2026-11-11/PRESUME-shift-record.DRAFT.json`.
- **Lighting census:** refrozen on the lane through its door (e70b8b5fc). The cause is the lane's own two new test files.
- **Edge bundles:** re-emitted at 7f0c49348, alone.

## 6. Class V (measured, nothing built)

The Overview's Systems Health row prints Prosperity, Safety, Viability and Defense as bare tags (`src/components/new/tabs/OverviewTab.jsx`, StatusTag). No reason sits beside them; only the section's help pill explains, and only in general. The Defense tab prints the readiness label next to a "Guard assessment" paragraph, the posture lines and five readiness rows (`DefenseTab.jsx`), so the defence label has its reasons on its own tab. The food band and the prosperity reasons beyond the Overview were not traced.

## 7. The equal-failing-set statement (the six directories, base 99bcc6944 vs the tip measured at 7f0c49348)

The base had 1 failing title (timelineVariety "within-category variety", which is green at the tip) plus the file-level failure of tests/lint/ledgerCitationIntegrity.test.js (it reads the read-only ledger branch; that failure is the same at both). At 7f0c49348 there were 30 failing titles. I cured three test sets after that run:

- **negativeAssertionAnchor ×2:** my two unanchored negatives, fixed at 077dad264.
- **proseWiringCensus ×2:** the census re-take at 6749d7784.
- The lighting census was already refrozen.

The rows that stay red at the tip are moved by the lane's text and named as the merge seat's act. This is PLAUSIBLE: each reads a frozen corpus or the recorded golden, and I bisected only writerReach.

- **The goldens:** generatorGoldenMaster; espionageDormancyFence's driven golden; generationForkCensus A1.
- **The golden-corpus null-change pins:**
  - pipelinePinnedMode A1, A2 and A5
  - pipelinePinnedChoosers A1
  - dmLayerGolden A7
  - worldFactRederive A7
  - editWorldFactResources A2 and A6
  - rosterFinalUnderHeldRoster A1
  - powerEconomyFreshness A4
  - nameHeldThroughAssembly A1
- **The frozen-digest corpora:**
  - institutionBudgetPromise (X-46 car 3 and car 4)
  - proseFamilyContract A1, A3 and A5
  - editCorpusRatchet A3 and A7
  - writerReach ×3 (red from 9e4e0402a, per the chair's ruling)
  - the Wizard News homes count (newsHeadlineContract and newsVoiceContract fail at load with "homes drifted: expected 44, got 43")
- **landingFixtureFreshness ×2:** the landing fixture is derived from the engine; FOUNDING-WORLDS re-runs it.

---

# ADDENDUM — the second seat (COHERENCE-PRESUME-2, 2026-11-12): §3 finished

Built on 081928512. Every cure below has a pin that was red before it; one cause per commit. The corpus is the charter's 360 (`presume-<tier>-<i>`, the browser's dials). "Base" means measured at 081928512, or for the arms I built, the first commit that carries the arm, whose generator text is still the base's for that class.

## A1. What was cured (base → tip, same seeds)

| commit | class | base | tip |
|---|---|---|---|
| 091054897 | §3.1 the 27 culture sentences, PDF Identity section (`src/data/cultureProfiles.js`): each is reworded so it presumes nothing; the defence lines say what the tradition does as a place grows. `needs` go where the thing goes. Ledgers CULTURE_PROFILES_DAILY / CULTURE_ARCHITECTURAL_DETAILS follow; the quick guide's scope digest is re-recorded with its reason | 35 arm-2 rows, 82 towns | 0 |
| eef26d522 | §3.2 GUARD: arm 2's denial side, `deniesExistence` (matches "no / without / lacks X", not "not a prison", "no single barracks", "the watch cannot", "would not call the law", "no market dues" or "no law permits"). Adds the thing `law`, read only where it is denied, and reads the licensed service rows for denials | — | — |
| aac5e798d | §3.2 "No law, bring coin / There is no official recourse here." → "Weak law, bring coin / The law here is slow and easily outbid." One row reworded, no twin: a second name would be a 79th classifier registration against the walker's shrink-only ceiling of 78 | 22 towns (every one with a watch) | 0 |
| 531953458 | §3.2 the stability label "Fragile (private security, no public law)" → "(private security above the public law)" where a court system stands (`src/generators/power/governanceNarrative.js:246`, THE ONE LINE I changed in that file, by the chair's ruling). Its readers key on the first word only. On the 10 towns, the whole record diffed before and after: one leaf moves in each, `.powerStructure.stability`. The compendium gloss is changed at `scripts/generate-compendium-data.mjs` and regenerated through `npm run gen:compendium-data` | 10 towns | 0 |
| 948be8279 | §3.3 GUARD: the time reading. The fact vocabulary has no atom for time, so a line cannot declare it. `printedOutOfTime` answers from the record's own dates and the estate's ladder (`heraldCausalGrammar.js :: TIME_BANDS`: past 60 years an event is "older than its bearers"). 'witness' = a living-witness phrase on such an event; 'echo' = a current tension in a past event's words. No register: every row is cured | — | — |
| 597778a53 | §3.3 the echo prefix "Families who lived through it tell it this way" on hooks of events over 60 years → its twin "Family accounts passed down from that time tell it this way" (same roll; plotHooks.js dedupe copy and the ledger follow) | 40 hooks, 38 towns | 0 |
| 521e96675 | §3.3 three POLITICAL_FLAVOR lines (`narrativeText.js`): "the people who lived through it are still here", "those who lived through it speak of it as if it were last year", "within living memory" → twins chosen by the picked event's age, draw-free | 19 lines, 19 towns | 0 |
| 5b1e3232d | §3.3 a current tension word for word its own past event → the template's first authored variant whose words differ | 38 tensions, 37 towns | 0 |
| cc5e649b3 | §3.3 the page's "a decade old" beside "23y ago": the history lens (`generalStateProse.js :: yearBand`) calls no span over 15 years "a decade" (it becomes "a generation"); the herald's ladder is untouched. Wiring census stamp re-taken through its door | pin: 16–25 years read "a decade old" | 0 |
| d327a6e52 | §3.3 the siege line's "still present in living memory" now only for an event within 60 years (latent on the 360; pinned) | pin | 0 |
| ecf46d458 | §3.4 the mass-migration pressure line: "share the streets and the market" → "share the same streets". Not a late write: the town has no market house at all, and the pressure draw (`narrativeGenerator.js :: generatePressureSentence`) never refuses a declaration | 1 town | 0 |
| 8f4aeb828 | the chair's court correction: the rule book's court admits a house whose OWN catalogued service tries disputes (Town hall, City hall, Town council, City administration, Courthouse, Multiple court buildings, Mayor and council, City-state government), not mediation and not guild or church courts. No register row leaves: the register holds no court row, and "A court exists, though the prison system is limited." stands under `prison` (AGREE's) | — | — |
| 43e0a7916 | the lighting census refrozen through its door (the new test file) | — | — |

## A2. The register by reason, at the tip

Arm 2: `hedge` 15, `figure` 12, `past` 11, `other-lane` 15, `ruling-3` 2, `negation` 1. `premium-export-only` and `reported` are gone (34 rows left by cure; the reason `premium-export-only` is deleted). Arm 1: 9 culture rows left by cure; the rest stand as the first seat left them (`after-release`, `other-lane`). The time reading and the denial side keep no rows. The walker is green at the tip.

## A3. Measured, not built; not mine (reported)

- **Arm 1's denial side** (a literal that denies a thing and declares no `excludes`) would list 35 literals across the tree: the dossier state prose's generated pools (granary, court and gaol, market, temple), the institution catalogue's "No mill of its own" and "no garrison stands", `economy/foodBalance.js` and `economy/viability.js` (AGREE's), `safetyProfile.js` "There is effectively no law enforcement." (AGREE's), `structuralValidator.js`, `settlementOriginProse.js` "no wharf". Not built: most of these are other lanes' files, and the chair asked for the arm-2 side.
- **The pressure draw** (`narrativeGenerator.js :: generatePressureSentence`, no lane's) unwraps declarations with `textOf` and never refuses one. Of its 16 declaring lines, none printed false on the 360 apart from the one cured above.
- **26 more culture lines** name a market, temple, harbour or militia. They are drawn in resolveConfig before any institution exists, so their declarations cannot refuse them. None printed false on the 360.

## A4. The equal-failing-set statement (the six directories at 8f4aeb828 + 43e0a7916's census)

One run at 8f4aeb828: 24,814 tests, 37 failing titles, plus the file-level failure of `ledgerCitationIntegrity` (it reads the read-only ledger branch; same at the base). Against the first seat's §7 list:
- **The same rows, the merge seat's:** generatorGoldenMaster; espionageDormancyFence's driven golden; generationForkCensus A1; pipelinePinnedMode A1, A2, A5; pipelinePinnedChoosers A1; dmLayerGolden A7; worldFactRederive A7; editWorldFactResources A2, A6; rosterFinalUnderHeldRoster A1; powerEconomyFreshness A4; nameHeldThroughAssembly A1; institutionBudgetPromise X-46 car 3 and car 4 (x46NpcBand); proseFamilyContract A1, A3, A5; editCorpusRatchet A3, A7; writerReach ×3; landingFixtureFreshness ×2.
- **NEW and named, the merge seat's:** dossierProseManifest's DRIFT arm (174 composed-prose rows move by this seat's text; a golden fixture with its own shift records), and observedShapeReaders' live-estate input-drift row (the regenerated compendium file; the chair's condition 3: re-minted at the merge). Both are in the draft shift record.
- **NEW and cured on the lane:** sovereigntyLightingContract's file count (43e0a7916). The engine bundle rows (engineBundleReplay ×4, engineServiceCore, engineServiceStoreParity ×3) were red only because the committed bundle trails the source; they clear with the edge commit that follows this addendum.
- **File-level, the same as the first seat's:** newsHeadlineContract and newsVoiceContract still fail at load with "Wizard News homes drifted: expected 44, got 43".

## A5. Golden surfaces and the record

`docs/chair/2026-11-11/PRESUME-shift-record.DRAFT.json` now lists the second seat's components and the two new surfaces. No golden door was run on the lane.
