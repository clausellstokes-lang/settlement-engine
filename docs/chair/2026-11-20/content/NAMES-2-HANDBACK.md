# NAMES-2 hand-back

Written 2026-11-20 08:19 UTC by NAMES-2, the finisher of NAMES-1's list. Branch `lane/names-2-2026-11-20`, cut from
`origin/lane/names-2026-11-20` at `b34c3115f` (code `d0549419b`), read back at the start: clean tree.
Assignment: `docs/chair/2026-11-20/seventh/prompts/NAMES-2.txt` on `origin/lane/chair-2026-11-08`.

**State at writing.** The chair's messages of 06:10 and 06:28 UTC reached this session at 07:30, after its first
hand-back (`37b90e66b`). They withdrew item 1's merge (the chair merges at the landing), ordered item 5 BUILT, and set
item 7 at this tree only. This file is brought current to them. Commits on the branch: `a45752d7b` (item 2),
`f24870a8f` (item 4's own cure), `37b90e66b` (the first hand-back), `e174f2d47` (a NAMES-1 red it did not list:
`bar3People2Rows` re-pinned), `9157373d0` (item 5, built), and this file's commit.

## 1. The merge of the line; the three gates and the walker at the tip

NOT MADE, by the chair's withdrawal (06:10): `git merge --no-ff origin/lane/join-2026-11-14` was refused by this
session's own permission check, reported at once and not routed round; the chair merges this branch into the line at
the landing. What the merge brings is measured: the line's commits since the names work's base (`85fccf898..7e0c77ae2`,
14 commits) touch **no file under `src/`** (`.github/workflows/ci.yml`, `.husky/pre-push`, `vite.config.js`,
`tests/lint/.lighting-census-baseline.json`, eleven test and helper files, two docs), no file is touched by both
sides, and the diff applies to this branch with no conflict (`git apply` on an archive: clean). So every generation
and render measure below, taken between `85fccf898` and this branch, is the same measure between `7e0c77ae2` and the
merged tip.

The three gates at this branch's tip (`9157373d0`), EXECUTED: `npm run typecheck:ratchet` 167/167 (ceiling 167);
`npm run typecheck:domain:strict` 1113/1113; `npm run lint` 0 errors (38 warnings, none in a file this lane touched).
The walker `tests/lint/namesInSentences.walker.test.js`: 13/13 green.

## 2. The two presumption reds, by their cause

Both walkers bank a source line by the hash of its literal text (`presumptionClasses.shared.mjs :: scanSource`,
`hitKey`). NAMES-1 rewrote three literals, so four hits read as new and four rows as stale.

| | red before (d0549419b) | green after |
|---|---|---|
| `tests/lint/presumedThings.walker.test.js` | 2 failed (ARM 1 "every source literal…", "no stale row…") | green |
| `tests/lint/presumptionClasses.walker.test.js` | 2 failed ("no NEW undeclared line", "no stale row") | green |
| the two files together | 4 failed, 55 passed | **59 passed** |

The cure, per line, the first preference each time (the literal restored byte-identical, the article moved into
the value). No row added, no declaration made, no walker or register touched.

- `src/data/people/dmPowerLines.js :: CAPTURE_LINES` (equilibrium, third line, "still works the streets"): the
  literal is the base's again (`${f.ruler} still rules, and ${criminalsOf(f)} …`); the line is an inner arrow
  filled with `{ ...f, ruler: the(f.ruler, true) }`, so the ruler opens the line as "The Elder Council".
- `src/generators/power/settlementNarrative.js :: genSuccessionNarr` (occupation legacy): the literal is the
  base's again (`… the same streets, the same market, the same ${ctx.govFaction || 'council'}. …`); its value
  is `rule under <the power with its article>`. Read by a direct call in both trees (the line is reached by
  neither corpus): base "the same Elder Council", "the same Military/Guard", "the same the village elders";
  now "the same rule under the Elder Council", "… under the Guard", "… under the village elders"; no power:
  "the same council", as before. ("the same Elder Council" would have kept the article's meaning, but the
  names walker reads "same Elder Council" as bare, and widening it is not mine.)
- `src/generators/power/governanceNarrative.js :: buildStressNarratives` (occupied): **the walker's scanner is out
  of step in this file**: the literal it banks for this line (`c90c77d163e06ef2`) is the span from the template's
  CLOSING backtick to the next one (`" +\n      ' filed a formal protest. …',\n    // OWNER-WORDS-DOSSIER …"`),
  not the template. NAMES-1's trailing comment sat in that span. The cure restores that span byte-identical
  and carries the article inside the `${…}` (`powerNameWithArticle(governingFactionName, true) || …`, with its
  note as a block comment there), which the scanner reads as code. NOTICED, NOT MINE: the scanner's desync in
  this file means the presumption walkers read this file's literals shifted by one; the row text in the register
  is a fragment of code. For the walker's owner (BAR6-GUARD's door), not cured here.

The governing suites of the three files (every test file naming any of them, 36 files, and the names walker):
482 passed, 1 failed: `tests/property/espionageDormancyFence.test.js` FENCE 1 "THE DRIVEN GOLDEN" (a stored
figure the names work moves; NAMED below, not signed).

## 3. The confinement check (the chair's)

**THE CLAIM HOLDS. EXECUTED.** Between the base (`85fccf898`, an archive) and this tree (an archive of
`b34c3115f` plus this lane's diff), each born in its own tree by the same script (the golden master's
`goldenCorpus()` through `generateSettlementPipeline(cfg, null, { seed, customContent: {} })`; the census's
`censusPlan('r2')` through `configOf(row, DEFAULT_CONFIG, birthConfig)` after `loadGenerationLawPayloads()`, as
the names walker births), every stored document diffed key by key:

| | documents | identical | non-string differences | differing string leaves | of them, names/articles/pronouns/roles only |
|---|---|---|---|---|---|
| the golden master's 525 | 525 | 4 | **0** | 21,309 | **21,309** |
| the census's 720 | 720 | 76 | **0** | 25,429 | **25,429** |

"Non-string" counts every number, boolean, null, a type change, a key added or removed, a key order changed and
an array's length: **none moved**. No name, id or key string is among the differing fields (the fields are below).
The second check reads each changed string as words (an LCS diff): the words gone or added must each be "the", a
pronoun, or a word of the town's own power names, person names or person roles. A planted control (each document
against its neighbour's) flags 11,582 of 11,770: the check discriminates.

The differing fields, by count (the 720; the 525's fields are a subset, plus `generationCoherenceReceipt
.judgments[].findings[].evidence`, 40, a finding's quotation of the prose):

| field | strings | towns |
|---|---|---|
| `npcs[].goal.short` | 5,965 | 527 |
| `npcs[].goal.long` | 5,946 | 519 |
| `relationships[].tension` | 4,925 | 542 |
| `relationships[].description` | 4,712 | 541 |
| `powerStructure.factionRelationships[].narrative` | 1,284 | 486 |
| `powerStructure.conflicts[].desc` / `conflicts[].desc` | 563 / 563 | 336 |
| `powerStructure.factions[].desc` | 426 | 316 |
| `pressureSentence` | 261 | 261 |
| `powerStructure.recentConflict` | 210 | 210 |
| `npcs[].secret.stakes` / `.what` | 163 / 66 | 151 / 66 |
| `prominentRelationship.phrasing` / `.tension` / `.full` | 81 / 81 / 78 | |
| `powerStructure.factionRelationships[].dmNote` | 74 | 74 |
| `powerStructure.conflicts[].plotHooks[]` / `conflicts[].plotHooks[]` | 14 / 14 | 13 |
| `coherenceNotes[].note` | 3 | 3 |

**The page, the same way (EXECUTED):** all 720 rendered in each tree through the real `OutputContainer`, every
group, sub-tab and disclosure walked (the page census's own `walkDossier`), from each tree's own stored towns:
2,160 views differ in 720 towns; **no view's line count moved**; 19,614 lines changed, 19,609 by names, articles,
pronouns and roles only. The other five are the same lines too: three where the underworld's label "Fence (word of
mouth)" now prints in its prose form "the Fence" (the qualifier struck by `powerSentenceName`), two an icon glyph
the word splitter joins to "Thieves'" / "The".

**The hall line NAMES-1 left unmeasured. Cause found; no pick moved.** No pick that draws a line the page shows is
keyed on text: the state-prose draws (`stateProseKernel.js :: drawVariant`) key on `seed::block::pool::v<vid>`, the
connective and the face on the same key; the hall's line (`domain/people/patronage.js :: hallOf`) picks its variant
from the stored rung, the agents' presence, the ranks of the ruling three and `factsOf(s).crime`, never from a
name. Measured on the 720: no rendered line is another variant. What does change shape on the Power tab's hall is
the "Living with the criminals" rung (`CAPTURE_LINES.equilibrium`) in three towns (r2r-hamlet-19, r2r-village-10,
r2s-slave_revolt-hamlet-3): "The second of Feudal Stewardship answers to Fence (word of mouth), but the head does
not. Fence (word of mouth) has a voice in Feudal Stewardship, not the last word." became "… answers to the Fence,
but the head does not. The Fence has a voice in the Feudal Stewardship, not the last word." Same variant, same
fill admission; the label's qualifier is struck by the article form. CONFIRMED that this is the only shape change
on the hall at this tree; PLAUSIBLE that it is what NAMES-1 saw (its observation was not recorded with a town).
Proposal: accept (the qualifier is the roster's, the prose form strikes it everywhere else; CN3's fold keeps
"Fence" findable).

## 4. `tests/lint` whole, the page census, the pool-dominance registers

**`tests/lint` WHOLE (EXECUTED, this branch before the merge, with `review-fixes-2026-07-08` fetched as told):
220 files, 3 failed / 3,268 passed of 3,271.** Each red by its cause:

| red | cause | whose | outcome |
|---|---|---|---|
| `contractTestAntiVacuity` Rule 2 | convicts `namesInSentences` CN3i: an "every…" title; the rule reads `const born = []` (filled in `beforeAll` by the generator) as a pinned literal | this lane's (NAMES-1's walker) | CURED in `f24870a8f`: the title in its siblings' negative form, claim and assertions unchanged (its pool is born; the arm asserts `hideable` > 0); green with the names walker and the manifest (38 passed). No walker or allowlist touched |
| `negativeAssertionAnchor` | `tests/build/ensurePlaywrightBrowsers.test.js` line 67 (CI-FIT's file, point 75) | the line's | cured on the line by `ddaf1e1af` (inside point 76); clears with the merge |
| `sovereigntyLightingContract` "THE CENSUS IS AN ASSERTION" | files 3,703 against the register's 3,701 | NAMES-1's two new test files (`tests/domain/personMention.test.js`, `tests/lint/namesInSentences.walker.test.js`) | item 7: the count re-taken by its door |

**`tests/lint` WHOLE on the scratch merged tree** (this branch at `f24870a8f` plus the line's diff; EXECUTED): 220
files, 2 failed / 3,259 passed. The anchor red is gone (the line's cure). The lighting count is red, as item 7
says (3,704 against the line's 3,702). Two more files red there are the scratch repository's, not the tree's:
`domainAnyCastBaseline` ("introducedAt d7ea69a4… resolves to NO commit") and `ledgerCitationIntegrity`. The scratch
repository has one commit and no ledger branch; both are green in the real checkout's run above. So after the
merge the one red left in `tests/lint` is the lighting register, which is frozen at the landing.

**The page census (`node scripts/census/page-census.mjs --workers=4`, EXECUTED in this tree and in the base's):
the names work moves NO figure.** Every row reads the same in both trees. Both read one ROSE, P3source 0 → 3
(r2s-under_siege-hamlet-2, -thorp-1, -thorp-2: the Magic tab's "Reliance on magic: Relied upon · for food
(magical provision)", a line byte-identical in both trees; not this lane's), and four falls against the banked
column (P8any 118 → 115, P14 2 → 0, P19 7 → 2, NEW2 6 → 5), the same in the base: they belong to the lanes
between the register's banking and `85fccf898`, for the register's door (`--shrink`), not mine to bank.

**The pool-dominance register (`node scripts/census/pool-dominance.mjs`, EXECUTED):** corpus `quarrel`, 960 pools,
0 over, 0 unregistered, 0 stale, 0 loose, 2 notes (two noise readings that do not repeat on confirm). It does
not move.

## 5. Verb agreement: measured, then BUILT on the chair's word (06:28)

A power as the SUBJECT of its clause (the article form at a sentence's or clause's head, or after "what", "that",
"than", "while" and their like; compound subjects, objects and prepositions skipped), its verb's number against the
name's (`pluralPowerName`: the head noun ends in a single s). Taken on the census's 720 by my subject parser, which
misses compound subjects and the clauses it skips, so each count is a floor:

| the 720 | subject readings | plural power + singular verb, before (`a45752d7b`) | after (`9157373d0`) | singular power + plural verb |
|---|---|---|---|---|
| stored prose | 1,724 | 5 (5 towns) | **0** | 0 → 0 |
| rendered pages (every view) | 2,705 | 139 (135 towns) | **0** | 0 → 0 |

The templates, every one predating the names work (each had the same verb with the bare label, "what Merchant
Guilds wants"; the article made it audible), and the cure of each (`9157373d0`):

| before | where | now |
|---|---|---|
| 128 | `data/people/dmPowerLines.js :: askerLine`: "so what the Merchant Guilds wants from …" | `powerVerb(f.power, 'wants', 'want')` |
| 6 | `dmPowerLines.js :: PATRONAGE_LINES.open[2]`: "… counts for more here than its own members would make it" | verb and both pronouns by `powerVerb`: "the Merchant Guilds count for more here than their own members would make them" |
| 3 | `data/stressInstitutionEffects.js` secret: "(information that {faction} considers proprietary)" | `npcGenerator.js`: the filled text through `withPowerVerb`, in the drawn text and in its held key alike, so the held refusal compares like with like |
| 2 | `generators/narrativeText.js` fractured row: "… controls one district …" | `narrativeGenerator.js :: generatePressureSentence`: the DRAWN sentence through `withPowerVerb`, after the draw |

The mechanism. `pluralPowerName`'s body moves verbatim to the data leaf `data/people/powerSentenceName.js` (as
NAMES-1 moved `powerNameWithArticle`): `dmPowerLines.js` is a data file and may not import `domain/`.
`domain/display/pluralPowerName.js :: pluralPowerName` keeps its name and home and returns it, and no value moves (the
new test pins the two equal on eight names). Two leaf functions beside it: `powerVerb(name, one, many)`, and
`withPowerVerb(text, name, one, many)` for a sentence whose literal is held (only the verb DIRECTLY after that power's
article form, only for a plural power). The fractured row could not be cured in its own text without moving what reads
it: the presumption walkers bank the literal (`presumedThings.widened`), a wrapper on the row was refused by
`census2dTables`/`census2eTables` (they read `text:` only as a literal: "every other shape stays unread, so it stays
loud"), and a map over the rows by `presumedThings` ARM 3 (the strip ban). None of those was touched; the cure moved to
after the draw.

Red first (EXECUTED): `tests/generators/powerVerbAgreement.test.js` (6 arms, singular and plural pinned in each, so a
cure that only flips the verb cannot pass) is red 6/6 at `a45752d7b` (a scratch tree) and green 6/6 here. Its
mutation-manifest row is the admitted generators tree's (`mutationCoverageManifest` 10/10). The governing suites of
every changed module (134 files) and the walkers: green but for the named stored figures.

The confinement check RE-RUN after it (EXECUTED): against `85fccf898`, 0 non-string differences on the 525 and the
720, and of the 46,738 changed strings 5 now carry a word beyond names, articles, pronouns and roles: the five verbs.
Against `a45752d7b` exactly 5 stored strings move (3 `npcs[].secret.what`, 2 `pressureSentence`) and none of the
golden 525. Rendered (720, every view): 139 changed lines, each the verb.

Left, measured and not built (the chair asked for the verbs): pronouns for a plural power in templates the count did
not convict (hand-read): `goalFamilies.js` "the people who lead it" (203 sentences), "its errands" (200), "run it the
way" (45), "Build {power} up until it is …", "Leave {power} stronger than they found it"; `dmPowerLines.js` "brings its
requests", "has its own voice", "weight it would not have on its own", "is stronger than it looks". The same helper
cures them: about 2 files, 9 lines, and the golden moves again by prose alone.

## 6. For the owner

- `NAMES-2-TEN-SENTENCES.txt`: ten sentences before and after, one per kind of change (from r2r-town-0,
  r2s-occupied-city-1, r2r-village-8).
- `NAMES-2-PAGE-BEFORE.txt` and `NAMES-2-PAGE-AFTER.txt`: r2r-town-0's whole page, every tab and disclosure in
  reading order (926 lines each; 18 lines differ).

## 7. The lighting census

Re-taken BY ITS OWN DOOR (`LIGHTING_CENSUS_REFREEZE=… LIGHTING_CENSUS_NOTE=… npx vitest run
tests/lint/sovereigntyLightingContract.walker.test.js`) at THIS branch's tree (`9157373d0`), on a scratch copy committed
in its own repository so the door's clean-tree and sha checks run. A COUNT, not a signature: no register here is written.

| | files | parked | credited | titles | suite titles |
|---|---|---|---|---|---|
| the register at this branch's base (CI-FIT, `b27d5f171`) | 3,701 | 472 | 3,229 | 31,162 | 8,627 |
| this branch (NAMES-2) | **3,704** | 472 | **3,232** | **31,189** | **8,634** |

The +3 files are NAMES-1's two (`tests/domain/personMention.test.js`, `tests/lint/namesInSentences.walker.test.js`)
and item 5's (`tests/generators/powerVerbAgreement.test.js`). The chair re-takes it at the merged tree (its register
there is GIT-DOOR's 3,702 / 472 / 3,230 / 31,171 / 8,628, one file of the line's own).

## Every stored figure that moves (NAMED, none signed; before → after)

Read at this branch's tip (`9157373d0`), EXECUTED; before is the committed fixture or constant.

| stored figure | before | after | why the names work moves it |
|---|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` "every config produces byte-identical output" | 0 of 525 drifting | **521 of 525** | every town that names a power or repeats a person in its prose changes those strings; 4 configs name none |
| `tests/generators/generationForkCensus.test.js` A1, the control row | `71ea4d5f28843f3a…` | **`adbd469a91750bcd…`** | the control row's town carries changed prose |
| `tests/generators/pipelinePinnedChoosers.test.js` A1 (golden-corpus rows) | 0 | **40** | its rows are golden-master hashes of towns whose prose moved |
| `tests/generators/rosterFinalUnderHeldRoster.test.js` A1 | 0 | **40** | the same rows |
| `tests/generators/powerEconomyFreshness.test.js` A4 | 0 | **40** | the same rows |
| `tests/domain/worldFactRederive.test.js` A7 (stride of the golden) | 0 misses | **7 of 7** | the same hashes |
| `tests/property/espionageDormancyFence.test.js` FENCE 1, the driven golden (**not named by NAMES-1**) | `9829e655d0ac9d9f…` | **`cb36943bbfd11ebb…`** (`dba9ff26…` before item 5) | 360 driven towns' whole-record hash includes their prose |
| `tests/lint/.lighting-census-baseline.json` | 3,701 / 472 / 3,229 / 31,162 / 8,627 | 3,704 / 472 / 3,232 / 31,189 / 8,634 (this tree) | three new test files (item 7) |
| the page census register | (as banked) | **no move** (base and tip read alike) | |
| the pool-dominance register | | **no move** | |

A test pin NAMES-1 moved and did not list, now re-pinned (`e174f2d47`): `tests/generators/bar3People2Rows.test.js`,
two pins of the famine secret ("decisions taken by The Guard", "decisions taken by Elder Council" → "the Guard", "the
Elder Council"); green at the base (13/13), red at `b34c3115f` (2), re-pinned with the refused text unchanged: 13/13.

The confinement check (item 3) is the evidence that each hash moves by prose strings alone: re-recording any of
them records a prose change and nothing else.

## Told apart

- **CONFIRMED by execution:** item 2's walkers (4 red → 59 green); the confinement table and its re-run after item 5
  (0 non-string differences on 1,245 documents; every changed string names-only but the five verbs, with a planted
  control); the rendered 720 (no pick moved); the hall line's cause; the agreement counts before and after (a floor, by
  my subject parser); item 5 red 6 → green 6; `tests/lint` whole and its reds' causes; the page census in both trees;
  the pool-dominance run; the named figures; the lighting count at this tree; the three gates.
- **A FLAKE OF MY RENDER INSTRUMENT, CONFIRMED:** the Power tab's "Patron deity" upsell block renders on some walks and
  not on others, for the same town and the same tree (five towns re-rendered alone: it flips between runs, tree for
  tree), always on a town near the start of a render worker. So "no view's line count moved" (item 3) is read with
  that block set aside; it moved no other line. The walk's timing is the PLAUSIBLE cause; the page census's own walk
  shares `walkDossier`, so its owner may want it.
- **PLAUSIBLE:** that the hall line NAMES-1 saw move is the "Fence (word of mouth)" rung (its observation named no
  town); the pronoun counts (hand-classified from a noisy heuristic).
- **NOT DONE:** the merge (withdrawn; the chair's at the landing); the lighting register's freeze (the chair's, at the
  merged sha); the plural pronouns (measured, listed in item 5); the scanner desync in `governanceNarrative.js` (the
  presumption walkers' owner's).
