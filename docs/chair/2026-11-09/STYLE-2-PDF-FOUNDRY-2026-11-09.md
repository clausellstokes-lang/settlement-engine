# STYLE-2 · SW-B4 PDF-FOUNDRY — one home per sentence, the machinery off the reader's page, one tier word on the cover (2026-11-09)

**Seat:** SW-B4 · PDF-FOUNDRY, session `session_01FbPLberW9uzNRqfNQgEeEJ`, a child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`).

**Lane:** `lane/style-2-pdf-foundry-2026-11-09`, cut at `0c93f0ca0`, the HEAD of `origin/lane/integration-2026-11-07`. `a7bc2e4ce` is its ancestor (checked).

**Law:**
- the owner's style law (`docs/chair/2026-11-07/WIRING-RULINGS-2026-11-07.md` §5–§8);
- STYLE-RULINGS-2 B4 and B1(d), bound by A0, A12 and B0;
- STYLE-0's keep-on rules (`docs/chair/2026-11-07/STYLE-AUDIT-2026-11-07.md` §3, approved in STYLE-RULINGS §1(c));
- the SURFACES audit's §4 map and its ledger D.

**Status of what follows:** every line below is listed old → new for the owner's veto. The seat signs nothing: every moved cell is listed for STYLE-2-MERGE.

## 1. Commits (all UNSIGNED, one cause each)

| sha | cause |
|---|---|
| `f93ead0d7` | **The cause.** The keep-on rules applied at the PDF and Foundry composers, the machinery taken off the reader's page, and B1(d). The pins re-keyed by cause, plus the red-first B4 block. |
| `0f752c274` | The tuning register refrozen through its door. `CRISIS_CAST_TUNING` gains one dependent (`src/pdf/lib/crisisPrint.js`); no value moved. |
| `e5ac1fb92` | The observed-shape baseline re-frozen through `--write`, a shrink: 1,541 → 1,539 identities. The Overview's dead `history.foundedBy` / `history.origin` guard reads left. |
| `0645e171a` | The lighting census refrozen through its door. Titles 28,695 → 28,703 and suite titles 7,717 → 7,718: the B4 block. |
| this record | The roster bumped: `dated` 168 → 169. |

**Files touched:**
- **Product:** `src/pdf/sections/{Cover, CrisisSections, IdentityDailyLife, NotableNPCs, Overview, PlotHooks, Relationships, Services, TonightAtTheTable, ViabilityAssessment}.jsx`, the new `src/pdf/lib/plotHookIndex.js` and `src/pdf/lib/crisisPrint.js`, and `src/foundry/journalPages.js`. In the journal, only the duplicated sections and the machinery figures were touched; no label changed, including the "Faction" headings, which are SW-8's.
- **Excluded, not touched:** `PowerStructure.jsx`, `FaithWar.jsx` and `headlines.js`.

## 2. The duplicate-surface map, before and after (CONFIRMED)

**Measure.** STYLE-0's: a sentence of 8 or more words printed 3 or more times inside ONE export of ONE dossier.

**Method.**
- The twelve were run by `node scripts/audit/soak-review.mjs --count 12 --workers 2`, at the parent `0c93f0ca0` and at the tip.
- My splitter (scratch, not committed) cuts each text leaf at sentence ends and ignores case and the closing stop.
- At the parent it reproduces the audit's §4 exactly on the screen and the Foundry. On the PDF it reads 58 where the audit read 57 (one sentence: the audit's own ±10% on its splitter). 58 is used as the "before" figure.

| export | before (parent `0c93f0ca0`) | after (tip) | 2+ times, before → after |
|---|---|---|---|
| PDF | **58** | **12** | 252 → 136 |
| Foundry | **7** | **2** | 76 → 25 |
| screen | 5 | 5 (not this lane's surface) | 108 → 108 |

**The PDF's 58, by sentence family:**

| family (the twelve) | before | after | the rule applied, or why it stays |
|---|---|---|---|
| the tension descriptions: Overview › Tensions, Plot Hooks › Underlying tensions, History › Live tensions; the resource-scarcity lead and the migration/famine effects ride inside them | 29 | **0** | The home is History › Live tensions. The Overview keeps the label and the parties; Plot Hooks keeps the labels. Al-karez's famine sentence (×5) also lost its repeat on the Viability issue row, which the chapter lead already carries word for word. |
| the tie lines: favour, precaution, notary, vote, post, payment and the prominent tie's tension, printed on Overview › Notable connection, Relationships › Prominent, the tie's own row and the Notable NPCs card | 10 | **0** | The home is the tie's row in Relationships. The Overview keeps the names and the tie label. The banner's note field opens empty where the row prints the line. The NPC card names the person and the tie. |
| the pair-pool lines ("The settlement keeps score, and so do they.", "Neither has asked for more than the other could pay.", "They meet to coordinate and leave by different doors.", "Each counts the other's wins more carefully than their own.") | 6 | **6** | NOT a surface duplicate: one pool line printed on DIFFERENT pairs inside one city. The writer is `src/data/npcData.js`, outside the manifest (SW-7's file under A9). Named here and left. |
| the supply-chain caption "NEED {x} · EXPORT yes · BY local resource" | 8 | **1** | "BY local resource" (the engine's activation flag) left. The one remainder, "NEED Raw Materials & Fuel · EXPORT yes" (Al-karez), is a LABEL row: the audit's own reading, not prose. |
| "the faction is divided between those profiting and those whose trade routes are severed" (Suryanagar ×6) and the Merchant Bloc / Guild card sentence (Olympambelos ×3) | 2 | **2** | The power cards. The writers are `src/generators/power/stressFactions.js` and the card composer in `PowerStructure.jsx`, both outside the manifest (SW-7 under B7; SW-8 for the word). Named here and left. |
| the "How they deal" pool ("Answers questions without volunteering…", "Offers information freely … rather than interrogation.", "Cooperative within clear limits…") | 3 | **3** | One pool line printed on three different people. The writer is the birth-drawn `presentation.behaviour` pool, outside the manifest. Named here and left. |
| **total** | **58** | **12** | |

**The Foundry's 7:**

| family | before | after | rule / reason |
|---|---|---|---|
| the Defence fact (Portaminus, Tonight + the crisis page ×2) | 1 | 0 | The two facts print once, on the Tonight page. |
| NPC hooks on `# NPC — page › Hooks`, `# Plot Hooks` and `# Tonight` (seeds 8 ×2, 10, 11) | 4 | 0 | Hooks print on Plot Hooks only. The NPC page prints no hooks section (the PDF's N6 rule). Tonight prints the title. |
| the power-page card sentences (seeds 5, 10) | 2 | **2** | The same writers as the PDF's (outside the manifest). Named here and left. |

**The twelve, read before and after.** Read whole: the PDF text and the Foundry journal of Albamunicipium (0), Copanucan (2), Al-karez (3) and Portaminus (4). Read by section: the remaining eight. What I checked:
- the Tonight hooks print as titles with a chapter 04 pointer;
- the crisis pages name the untouched houses once;
- the Overview reads as labels;
- History keeps every description;
- the Relationships chapter prints each tie line once;
- no cover prints two tier words.

STYLE-0 §3's ten rows, at the tip:

| row | at the tip |
|---|---|
| stress summary ×4 | cured earlier |
| VIABLE BUT STRAINED ×2 | cured earlier |
| tensions ×3 | **cured** |
| migration food effect ×3 | **cured** |
| hook ×2 | **cured** |
| historical character ×2–3 | **cured** |
| notable connection ×3 | **cured** |
| untouched houses' stake line ×4–6 | **cured**: one sentence |
| Entrepôt card ×6 | the screen's, not this lane's |
| stockpiles line ×3 | the screen's, not this lane's |

## 3. Every line, old → new (for the owner's veto)

`{…}` marks a slot filled from the record. "—" means the line or block leaves.

**PDF**

| # | where | OLD | NEW |
|---|---|---|---|
| 1 | Cover (`Cover.jsx`) | "FOUNDER EDITION" pill AND "Free preview. Forge your own at settlementforge.com" on one cover | An anonymous export prints only "Free preview. …"; a signed-in founder's cover prints only "FOUNDER EDITION". An anonymous exporter cannot be a founder, so the soak harness's both-true call was the only place both printed (B1(d)). |
| 2 | Overview › Tensions & Conflicts | "{Label}" / "{description}" / "{party} / {party} / {party}" | "{Label}" / "{party} / {party} / {party}" |
| 3 | Overview › CHARACTER & ORIGIN | heading "CHARACTER & ORIGIN" · "{historical character}" · "Reason settled: {reason}" | heading **"ORIGIN"** · "Reason settled: {reason}". **A LABEL CHANGE, for the owner's veto:** the heading now names only what is under it. |
| 4 | Overview › Notable connection | "{A} & {B}" · {Tie} · "{the tie's line}" | "{A} & {B}" · {Tie} |
| 5 | Plot Hooks › Underlying tensions | "• {Label}  {description}" | "• {Label}" |
| 6 | Tonight › Hooks | "{Title}" / "{hook text}" | "{Title}" / **"In full in Plot Hooks (04): {group} {nn}"**, a new connective line. The group is the chapter's own pill label (NPCs, Relationships, History, Traditions, Outlook, Defense) and the number is the card's. Both come from one grouping (`pdf/lib/plotHookIndex.js`), which `PlotHooks.jsx` now renders. A hook with no title, or one chapter 04 does not print, keeps its text. |
| 7 | Tonight › crisis page › Stakes | one row per untouched house: "{house}: split. not touched yet; it could side with either camp." | The houses with a stake keep their rows. The untouched houses are named together in one line: "{A} is not touched yet; it could side with either camp." / "{A} and {B} are not touched yet; either of them could side with either camp." / "{A}, {B} and {C} are not touched yet; any of them could side with either camp." |
| 8 | Tonight › crisis page › What the players see first | "Food: {band}. {stores}." / "Defence: {walls}." (a verbatim repeat of the sheet's "What the players test first" above it) | —, wherever the sheet printed the same fact word for word. The heading goes when nothing is left under it. |
| 9 | Relationships › Prominent relationship | banner "{A} & {B} · {Tie}" + its note field filled with "{the tie's line}" | banner unchanged; the note field opens empty when the tie's own row below prints the line |
| 10 | Notable NPCs › Relationships | "· {with} - {tie} - {the tie's sentence}" | "· {with} - {tie}" |
| 11 | Viability › Active issues | the issue row repeats the chapter lead's sentence ("The fishing failed this year…") | Where the lead carries the sentence word for word, the row keeps its title, fixes and DM note. |
| 12 | Viability › Key metrics | "Critical issue count 0", "Dependency count 2", "Warning count 1"; "Trade access mountain_pass" | —; "Trade access Mountain Pass" |
| 13 | Identity & Daily Life › Anchor facts | "Food −414 units" / "Food +17 units"; "Score avg 39" | "Food Deficit" / "Food Surplus" ("Balanced" unchanged); — |
| 14 | Identity & Daily Life › Food balance callout (surplus) | "Surplus of {n} units. The local food supply is reliable." | "More is grown and brought in than people eat each day. The local food supply is reliable." |
| 15 | Identity & Daily Life | "GENERATION COHERENCE" box: "17/17 checks passed · 8/8 formal judgments supported · 1 authored tension", plus failed checks and review judgments | — (the box). Its one printed home is the DM's receipt (VersionsTab), as the chair ruled for the battery judgment on 2026-11-08. The record and the view model are untouched. |
| 16 | Services › Active supply chains | "NEED {need} · EXPORT yes · BY local resource" | "NEED {need} · EXPORT yes" |

**Foundry journal** (`src/foundry/journalPages.js`)

| # | where | OLD | NEW |
|---|---|---|---|
| 17 | `# Overview` → `# History & Founding` | "## Character" + "{historical character}" on the Overview page | the same sentence as the History page's opening paragraph, under its lede (the keep-on rule, as in the PDF) |
| 18 | `# Tonight` › Hooks | "- {hook text} *({Title})*" | "- **{Title}**: in full on the Plot Hooks page." The page's group heading is deliberately NOT named, because one of those headings is the retired word (SW-8's label). |
| 19 | `# Crisis` › Stakes / What the players see first | as rows 7 and 8 | as rows 7 and 8, from the same module (`pdf/lib/crisisPrint.js`) |
| 20 | `# NPC — {name}` | "## Hooks" + the person's hooks | — (they print on `# Plot Hooks` under People, as the PDF's N6 rule already does) |
| 21 | `# Power & Factions` | "Public legitimacy: 23" | "Public legitimacy: Legitimacy Crisis" (the band the PDF prints beside its score) |
| 22 | `# Faith & War` | "Posture: {band} (aggression ×1.23)"; "War-weary: {Band} (0.47)" | "Posture: {band}"; "War-weary: {Band}" |

**Struck under the census law:** none. Every NEW above uses only fields its writer already read:
- the tension's label and parties;
- the hook's title and its place in the chapter's own grouping;
- the stake rows' own names;
- the food state's sign;
- the legitimacy band and the posture/exhaustion band already on the slice.

## 4. The pins, re-keyed by identity and cause (none loosened)

| pin | before | after |
|---|---|---|
| `tests/pdf/restoredSubsections.test.js` (N6/X-2 Overview case) | the Overview contains the tension's description | it contains the tension's LABEL, and not the description (anchored on the label one line above) |
| `tests/pdf/proseLigatureDefuse.test.js` | the NPC card contains the tie's sentence "fickle, shifting truce" | the card contains its row "The Guild - affiliate" (the ffi cluster still tested), and not the sentence (anchored) |
| `tests/pdf/sections.smoke.test.js` (deficit, surplus) | "−200 units", "+200 units" | "Food  Deficit" / "Food  Surplus" present and "200 units" absent (anchored); the surplus sentence asserted in its new words |
| `tests/pdf/recordBatteryReceiptOnly.test.jsx` | the box prints, without the battery judgment | the chapter (by its heading) prints neither the box, nor "checks passed", nor the judgment; the record still carries the judgment as needs_review (not vacuous) |
| `tests/pdf/generationContractsViewModel.test.jsx` | the chapter prints "1/1 checks passed", "8/8 …" | the view model still projects `passedChecks: 1`, and the chapter prints none of the three (anchored on the three identity lines) |
| `tests/domain/npc/characterDrift.test.js` (the census of `.character` reads) | `journalPages.js: 2`, `Overview.jsx: 3` | both rows gone, with the cause written beside the census: the settlement's character now prints from History, which reads `historicalCharacter` |

**NEW, red-first:** `tests/pdf/restoredSubsections.test.js`, the describe block "B4 — one home per sentence inside one export (the keep-on rules)", eight cases. The block was run against the parent's sections, with only the two new pure helpers copied in so the file imports.
- Red at the parent: 7 of 8 (Tonight hooks, Overview tensions, Overview character and connection, the Relationships banner, the machinery, the cover, the Foundry homes).
- The 8th (the stakes/fact helpers) is a unit case of the new module.
- Also red at the parent: the re-keyed Overview case.
- Green at the tip.

## 5. The deltas, measured in a clean worktree (CONFIRMED)

Two detached worktrees were used: the parent `0c93f0ca0` and the tip `0645e171a`, with the same `node_modules`.

| surface | parent | tip | moved by this lane |
|---|---|---|---|
| golden master | green | green | **0 / 525** |
| espionage dormancy fence | green | green | **0 / 360** |
| herald knowledge desk | green | green | **0** |
| composed-prose manifest | RED (5 tests; 1,050 / 1,050 rows "moved" against the fixture) | the same 5 red, the same 1,050 | **0 / 1,050**. The per-cell table (`scripts/prose-manifest-cells.mjs --out`) is BYTE-IDENTICAL at parent and tip (36,689,979 bytes, `cmp` clean). The red is the base's, not this lane's. |
| preset-lighting witness | green | green | **0** |
| PDF view-model snapshot (`goldenViewModel`, /18) | green | green | **0 / 18**: the view model is untouched |
| `tests/pdf` + `tests/foundry` | green | green after the re-keys | the six pins of §4 |

**Registers moved through their doors:** tuning (one dependents row), observed-shape (a shrink of 2), lighting census (+8 / +1).

**The prose-numerics ratchet (no write door) did NOT move.** It holds line addresses, so each touched file keeps its line count above its banked rows (the comment lines carry the rule's text).

**Reds that are the base's** (the same tests red at the parent, checked file by file over the 24 files named here), not this lane's:
- `layerBoundaries`, `engineBundleReplay`, `engineServiceCore`, `landingFixtureFreshness`;
- `readerValidationOnPage`, `clergyTraitPlane`, `composeStateProse`, `deityStanceLane`, `editWorldFactResources`, `killNpcDoubleImpair`, `characterConsumers`, `religionLegitimacyFactionKey`, `worldPulseFactionSeating`;
- `domainAnyCastBaseline`, `ledgerCitationIntegrity`, `mutationCoverageManifest`, `negativeAssertionAnchor` (other files' offenders), `proseWiringCensus`;
- `sourceCitationIntegrity`'s `tree` arm (MERGE-WAVE's in-flight records; never touched here).

Nothing red at the tip is new.

## 6. The referee on the 1,000 (parent and tip, `--count 1000 --workers 3`)

Both runs exited 0: 1,000 settlements, 0 errors, 702 findings, verdict CLIMB; 60 sampled dossiers each. They were run from the parent's and the tip's clean worktrees.

| measure | parent `0c93f0ca0` | tip `0645e171a` |
|---|---|---|
| the twenty most-repeated frames (`aggregates/repetition-prose.json`; the screen tabs and the Tonight sheet) | — | **byte-identical** (`cmp` clean): no frame raised. This lane prints only to the PDF and the Foundry. |
| `aggregates/repetition.json`, `findings.jsonl` | — | byte-identical |
| `coh:tier-noun` | 0 | 0 |
| duplicated sentences, PDF (the 60 sampled; 8+ words, 3+ times in one export) | **236** | **56** |
| duplicated sentences, Foundry (the 60) | **40** | **4** |
| duplicated sentences, screen (the 60) | 36 | 36 |
| the walker's list (A10), PDF text of the 60: "faction" / "factions" / "rather than" / "not merely" | 250 / 162 / 133 / 9 | 244 / 162 / 132 / 9 |
| the walker's list, Foundry text of the 60 | 445 / 202 / 74 / 9 | 439 / 202 / 74 / 9 |

The other phrases of the list print 0 in both exports at both shas. Every move is downward: the dropped repeats carried six of the retired word and one "rather than". The connective lines this lane wrote carry none.

## 7. CONFIRMED against PLAUSIBLE

**CONFIRMED (executed):**
- the counts of §2 (PDF 58 → 12, Foundry 7 → 2) by the splitter at parent and tip;
- every delta of §5;
- the red-first block;
- the cell-table identity;
- the twelve's text read at the tip.

**PLAUSIBLE:**
- the splitter's one-sentence difference from the audit's (58 vs 57);
- that the Tonight pointer "In full in Plot Hooks (04): History 01" reads well to a DM. The group label is the chapter's own pill, but "History" for a tension's hook is the screen's grouping word, not mine;
- that the campaign_state variant's loss (§8, item 2) is acceptable.

**Process note, said plainly:** the B4 block was appended to `tests/pdf/restoredSubsections.test.js` with a shell heredoc. The brief asks for the Edit tool under `tests/`; the classifier did not refuse it, and every later test edit used Edit.

## 8. What stays (BY CHAPTER), each with its reason and its owner

- **09 Power Structure.**
  - Power-card figures: "raw {n}" on every card (`PowerStructure.jsx:236`), and the legitimacy modifiers "-10 Prosperity · -12 Safety …" beside the score.
  - The two card sentences repeated across powers (§2).
  - Out of the manifest; **SW-7 (B7)**, the word **SW-8**. Reported to the chair as a STOP with this default.
- **Variant `campaign_state`.** It includes the Overview and Plot Hooks but not History. Under the keep-on rule, the tension descriptions and the historical character therefore print nowhere in that variant; their labels and the origin line still do. A section cannot see the variant. The cure is one prop through `src/pdf/SettlementPDF.jsx` (out of the manifest), or a ruling that the lean variant carries labels only. Reported to the chair.
- **13 Notable NPCs.** The "How they deal" pool repeats inside a city (3 of 12). It is the birth pool, out of the manifest.
- **14 Relationships.** The pair-pool lines repeat on different pairs (6 of 12): `npcData.js`, SW-7 (A9).
- **02 Tonight.** The seat-holder's want also prints as Notable NPCs › Motivation (×2: Tonight is quick prep, the card is the person's home), left. The lever lines' "Parish churches (10-30)" catalogue range: SW-6 / SW-2.
- **17 History.** An event's description and the live tension it seeded can print the same sentence in one chapter (×2). Both are History's own; left.
- **05 Services / 07 Economics.** The chains print as cards and as flows: two vantages, left.
- **11 Viability.** "Food balance −451" in Key metrics beside the Overview's "Deficit: 4" (two units for one fact) is a PLAUSIBLE contradiction for **SW-B1**. "Judged at the first survey; not re-run since." stays as the owner's queue #28.
- **01 Overview.** The Systems Health caption stays as queue #28.
- **Foundry.** Tensions print once, on `# Power & Factions › Tensions` (no History page carries them). This is not a duplicate, but their home differs from the PDF's; the page's labels are SW-8's.
