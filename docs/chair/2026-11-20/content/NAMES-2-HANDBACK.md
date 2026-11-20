# NAMES-2 hand-back

Written 2026-11-20 07:14 UTC by NAMES-2, the finisher of NAMES-1's list. Branch `lane/names-2-2026-11-20`, cut from
`origin/lane/names-2026-11-20` at `b34c3115f` (code `d0549419b`), read back at the start: clean tree.
Assignment: `docs/chair/2026-11-20/seventh/prompts/NAMES-2.txt` on `origin/lane/chair-2026-11-08`.

**State at writing.** Item 1's merge is NOT made: `git merge --no-ff origin/lane/join-2026-11-14` was refused by
this session's own permission check (the auto-mode classifier), reported to the chair at once and not routed
round. Items 2 to 7 are done on the branch without it; every figure below that the merge could move was taken
on a scratch tree holding exactly this branch plus the line's diff (`85fccf898..7e0c77ae2`), and says so.
Commits: `a45752d7b` (item 2), `f24870a8f` (item 4's own cure), this file's commit (the hand-back and the owner's
files).

## 1. The merge of the line

NOT MADE: refused by the permission check (above). What it would bring is measured: the line's diff applies to
this branch with no conflict (`git apply` on an archive of the branch tip: clean), and the gates it moves are read
on that scratch merged tree (items 4 and 7).

The line's commits since the names work's base (`85fccf898..7e0c77ae2`, 14 commits) touch **no file under `src/`**:
`.github/workflows/ci.yml`, `.husky/pre-push`, `vite.config.js`, `tests/lint/.lighting-census-baseline.json`,
eleven test and helper files and two docs. No file is touched by both sides. So every generation and render
measure below, taken between `85fccf898` and this tree, is the same measure between `7e0c77ae2` and the merged tip
(EXECUTED: `git diff --name-only 85fccf898 origin/lane/join-2026-11-14`).

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

## 5. Verb agreement: measured and proposed, not built

A power as the SUBJECT of its clause (the article form, at a sentence's or clause's head, or after "what",
"that", "than", "while" and their like; compound subjects, objects and prepositions skipped), its verb's number
against the name's (`domain/display/pluralPowerName.js :: pluralPowerName`, the head noun ending in a single s):

| at this tree, the 720 | subject readings | plural power, singular verb | singular power, plural verb |
|---|---|---|---|
| stored prose | 1,724 | 5 (5 towns) | 0 |
| rendered pages (every view) | 2,705 | 139 (135 towns) | 0 |

The templates (all of them; the rendered count includes the stored lines the page prints):

| count | where | template |
|---|---|---|
| 128 | `src/data/people/dmPowerLines.js :: askerLine` (rank 1) | "…, so what ${the(f.power)} wants from ${the(f.ruler)} goes straight to the top." |
| 6 | `dmPowerLines.js :: PATRONAGE_LINES.open[2]` | "While … holds both places, ${the(f.power)} counts for more here than its own members would make it." |
| 3 | `src/data/stressInstitutionEffects.js` (a secret) | "(information that {faction} considers proprietary)" |
| 2 | `src/generators/narrativeText.js` (politically fractured) | "${r.topFaction} controls one district and …" |

The same slip in its pronouns, by template (hand-read; the heuristic count, 1,226 sentences, is mostly "it" for
another noun): `src/data/people/goalFamilies.js` "Do one thing for {power} this season that the people who lead
it cannot ignore." (203), "Be given the secrets of {power} to keep, as well as its errands to run." (200), "Reach
the head of {power} and run it the way {above} never would." (45), "Build {power} up until it is beyond the reach
of {rival}.", "Leave {power} stronger than they found it, …"; `dmPowerLines.js` "brings its requests", "has its own
voice", "lends … weight it would not have on its own", "is stronger than it looks".

None was made by the names work: each template had the same verb before it, with the bare label ("what Merchant
Guilds wants"). The article makes it audible.

**Proposal (the smallest cure).** The helper exists and two files already use it: `pluralPowerName`, as
`factionDynamics.js`'s `verb(f, one, many)` and `factionStanding.js` do. (a) The four verb templates fill their
verb through it: `dmPowerLines.js` two lines (a one-line `verbOf(power, one, many)` beside `the`), the secret's
pool (`{faction}` + a `{considers}` slot, or the line's verb filled where `npcGenerator.js` already fills
`{faction}`), `narrativeText.js` one line. (b) The pronouns: `goalFamilies.js` five templates and `dmPowerLines.js`
four lines take "it/its" or "they/them/their" through the same helper (a `{powerIt}`/`{powerIts}` slot in
`goals.js :: cellCandidates`). Cost: about 6 source files, about 15 lines; the presumption walkers bank these
literals (the slot cures must keep each literal byte-identical, as item 2 did, or move the verb into the value);
the golden master, the census goldens and the page census move again (prose only, the confinement check above
re-run); 2 to 3 hours with its tests. Not built: the chair's word.

## 6. For the owner

- `NAMES-2-TEN-SENTENCES.txt`: ten sentences before and after, one per kind of change (from r2r-town-0,
  r2s-occupied-city-1, r2r-village-8).
- `NAMES-2-PAGE-BEFORE.txt` and `NAMES-2-PAGE-AFTER.txt`: r2r-town-0's whole page, every tab and disclosure in
  reading order (926 lines each; 18 lines differ).

## 7. The lighting census

Re-taken BY ITS OWN DOOR (`LIGHTING_CENSUS_REFREEZE=… LIGHTING_CENSUS_NOTE=… npx vitest run
tests/lint/sovereigntyLightingContract.walker.test.js`) on the scratch merged tree (this branch at `f24870a8f`
plus the line's diff, committed in a scratch repository so the door's clean-tree and sha checks run): a COUNT,
not a signature; the register in this branch is not written.

| | files | parked | credited | titles | suite titles |
|---|---|---|---|---|---|
| the line's register (GIT-DOOR, `46ec7c398`) | 3,702 | 472 | 3,230 | 31,171 | 8,628 |
| the merged tree (NAMES-2) | **3,704** | 472 | **3,232** | **31,192** | **8,631** |

The +2 files are NAMES-1's two test files (`tests/domain/personMention.test.js`, `tests/lint/namesInSentences
.walker.test.js`); +21 titles and +3 suite titles are theirs. The figure is the chair's to freeze at the landing
(the merge commit's own sha), since this branch's tip is not the merged tree.

## Every stored figure that moves (NAMED, none signed; before → after)

Read at this branch's tip (`f24870a8f`), EXECUTED; before is the committed fixture or constant.

| stored figure | before | after | why the names work moves it |
|---|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` "every config produces byte-identical output" | 0 of 525 drifting | **521 of 525** | every town that names a power or repeats a person in its prose changes those strings; 4 configs name none |
| `tests/generators/generationForkCensus.test.js` A1, the control row | `71ea4d5f28843f3a…` | **`adbd469a91750bcd…`** | the control row's town carries changed prose |
| `tests/generators/pipelinePinnedChoosers.test.js` A1 (golden-corpus rows) | 0 | **40** | its rows are golden-master hashes of towns whose prose moved |
| `tests/generators/rosterFinalUnderHeldRoster.test.js` A1 | 0 | **40** | the same rows |
| `tests/generators/powerEconomyFreshness.test.js` A4 | 0 | **40** | the same rows |
| `tests/domain/worldFactRederive.test.js` A7 (stride of the golden) | 0 misses | **7 of 7** | the same hashes |
| `tests/property/espionageDormancyFence.test.js` FENCE 1, the driven golden (**not named by NAMES-1**) | `9829e655d0ac9d9f…` | **`dba9ff26f3e04794…`** | 360 driven towns' whole-record hash includes their prose |
| `tests/lint/.lighting-census-baseline.json` | 3,702 / 472 / 3,230 / 31,171 / 8,628 | 3,704 / 472 / 3,232 / 31,192 / 8,631 (merged tree) | NAMES-1's two test files |
| the page census register | (as banked) | **no move** (base and tip read alike) | |
| the pool-dominance register | | **no move** | |

The confinement check (item 3) is the evidence that each hash moves by prose strings alone: re-recording any of
them records a prose change and nothing else.

## Told apart

- **CONFIRMED by execution:** item 2's walkers (4 red → 59 green); the confinement table (0 non-string
  differences on 1,245 documents; every changed string names-only, with a planted control); the rendered 720 (no
  view's line count moved, no pick moved); the hall line's cause; the agreement counts (by my heuristic subject
  parser: its misses are compound subjects and clauses it skips, so the counts are a floor); `tests/lint` whole
  and its three reds' causes; the page census in both trees; the pool-dominance run; the named figures; the
  lighting count on the scratch merged tree; typecheck ratchet 167/167, strict domain 1113/1113, lint 0 errors.
- **PLAUSIBLE:** that the hall line NAMES-1 saw move is the "Fence (word of mouth)" rung (its observation named no
  town); the pronoun counts (hand-classified from a noisy heuristic).
- **NOT DONE:** the merge (refused); the lighting register's freeze (the chair's, at the merged sha); verb
  agreement's cure (the chair's word); the scanner desync in `governanceNarrative.js` (the presumption walkers'
  owner's).
