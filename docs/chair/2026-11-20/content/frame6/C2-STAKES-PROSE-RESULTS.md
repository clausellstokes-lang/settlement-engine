# FRAME-6 · C2 results: a power in the crisis page's Stakes stands in prose, with its verb in agreement (RENDER only)

Written 2026-11-20T15:24Z (`date -u`) by the C2 builder on `frame6-c2` (base `da8b5958f`), for FRAME-6. Brief:
`docs/chair/2026-11-20/content/frame5/C2-STAKES-PROSE.md` (the chair's ruling 23 of 2026-11-20, vetoable by the owner).

## Measure first: did the line already do C2's work? No.

The names work (point 82) gave the helpers (`powerNameWithArticle`, `powerVerb`, `fillAgreement`, `withPowerVerb`) and
`tests/data/powerNumberAgreement.test.js` covers stored stakes. The crisis page's Stakes rows did not use them. At the
base, the tab and the PDF opened each row on `powerSentenceName(factionId)` and printed `CRISIS_PAGE_COPY.stake[stake]`,
which is singular for `gains`, `loses` and `split`.

**The pool:** B7's births (`gen.mjs`: `generateSettlementPipeline({ settType, stressType: kind }, …)`, seeds
`b7-<kind>-<tier>-<i>`, 24 per kind). 360 towns, 0 misses, 1,818 Stakes rows, and every town has at least one. The calm
pool is 45 towns: seeds `c2-calm-<tier>-<0..11>` with no stress (of 72 born).

**The rows at the base, by number (`pluralPowerName`) and stake:**

| | gains | loses | split | at odds | answers | total |
|---|---|---|---|---|---|---|
| plural | 151 | 150 | 253 | 153 (`atOddsMany`) | 0 | 707 |
| singular | 183 | 394 | 378 | 88 | 68 | 1,111 |

- 301 rows have a plural power with a singular verb ("Religious Authorities gains", "Merchant Guilds loses").
- 308 rows already agreed: they open on a form that carries its own article ("The Guard", "The Neutrals", "The Independent
  Bloc"), and their verb agrees. These rows do not change.
- The plural powers on the pool: Religious Authorities 260, Craft Guilds 167, Merchant Guilds 163, Grain Holders 24,
  Monster Hunters / Adventurers 24, Third Bloc (Neutrals) 23, Noble Houses 18, Noble Families 17, Arcane Orders 11.

**`stakeShown` (read, not changed):**
- `untouched`/`untouchedMany` print no row (K25 (c)).
- `atOdds`/`atOddsMany` carry the number in the label ("is"/"are already at odds") and in the reason ("its"/"their own
  quarrel").
- `answers` prints "must answer for it", which has the same form in both numbers. Its reason is "it governs here" or
  "they govern here", chosen by `pluralPowerName`, the rule `powerVerb` uses. **The row and its reason agree.** On the
  pool all 68 `answers` rows are singular. No plural governing power occurs.

## What was built (one composition, read by both renderers)

- `src/domain/crisis/crisisPage.js`
  - Adds **`stakeOpening(k)`**, which returns `{ subject, verb }`.
  - `subject = powerNameInProse(factionId, true)`.
  - `verb = powerVerb(factionId, one, many)` for `gains`/`gain`, `loses`/`lose` and `split`; `stakeShown`'s own stakes
    keep their word.
  - `CRISIS_PAGE_COPY.stake` gains the closed pair `gainsMany: 'gain'`, `losesMany: 'lose'`.
  - The composed page itself is unchanged: no new field and no new row.
- `src/pdf/lib/crisisPrint.js :: stakeLines`: each row carries `stakeOpening`'s `subject` and `verb`.
  `src/pdf/sections/CrisisSections.jsx` prints `${k.subject} ${k.verb} · ${k.reason}`.
- `src/components/new/tabs/CrisisTab.jsx`
  - The `EntityLink` keeps `id={k.doorId}` and `type="faction"`, so the door still opens the power (tested by a click
    to the Power tab).
  - Its visible text is the subject (`verbatim`).
  - The verb span prints `said.verb`.
- The field is named `subject`, not `power`: `power` is a `FLOAT_TOKEN` of `tests/helpers/proseNumericsWalk.js`, and
  `${k.power}` read as a new prose numeric.
- No stored string changes. No file under `src/generators/` is touched.

## The rows after (the same 1,818)

- 1,510 rows change and 308 do not.

  | | gains | loses | split | at odds | answers |
  |---|---|---|---|---|---|
  | plural, changed | 151 | 150 | 230 | 153 | 0 |
  | singular, changed | 145 | 332 | 231 | 50 | 68 |

- All 301 number disagreements are cured.
- 91 distinct openings change.
- Five rows, before → after, exactly as printed (the PDF line; the tab prints the same words around its door):
  1. `b7-under_siege-hamlet-1`
     - Before: `Religious Authorities gains · the church gains while the seat struggles`
     - After: `The Religious Authorities gain · the church gains while the seat struggles`
  2. `b7-monster_pressure-metropolis-0`
     - Before: `Merchant Guilds loses · its own people feel the crisis first`
     - After: `The Merchant Guilds lose · its own people feel the crisis first`
  3. `b7-under_siege-thorp-0`
     - Before: `Feudal Stewardship loses · its own people feel the crisis first`
     - After: `The Feudal Stewardship loses · its own people feel the crisis first`
  4. `b7-under_siege-hamlet-0`
     - Before: `Military Party split · gains and loses by it at once`
     - After: `The Military Party split · gains and loses by it at once`
  5. `b7-under_siege-village-3`
     - Before: `Manor Household is already at odds · in its own quarrel with Elder Council`
     - After: `The Manor Household is already at odds · in its own quarrel with Elder Council`

## Proofs

**(a) Byte-identity** (`measure.mjs` at the base and the tip, `tally.mjs`):

| What | Towns | Identical |
|---|---|---|
| Stored record (sha256) | 360 | 360 |
| Composed crisis page, whole, Stakes rows included (`stakeOpening` is called by the renderers, not the composer) | 360 | 360 |
| Composed page outside the Stakes rows | 360 | 360 |
| Calm towns: record and composed page (`[]` in all 45) | 45 | 45 |

The tip measure was run twice, before and after the field's rename, with identical tallies.

**(b) Red first:**
- Red: `tests/components/crisisStakeAgreement.test.jsx` failed 3 of 3 on the tree without the source change. The source
  diff was saved and reverse-applied for the run, then re-applied. Each failure was the missing anchor:
  - "the Crisis tab: "The Religious Authorities gain", "The Elder Council gains", never "Religious Authorities gains"";
  - "the PDF: one Line per row, the same sentence";
  - "b7-famine-town-0: the plural power's row reads with its article and its plural verb, and its link opens the power".
- Green: 3 of 3.

**(c) The pins this moves, by file and title** (the assertions are moved; nothing is re-recorded and no fixture is
touched):
- `tests/components/tailCrisisK26.test.jsx`, "each census town: the re-formed label prints as the leaf says, never raw;
  a power already named prints its own name".
  - It was red on C2, 7 of 7 seeds: "Elder Council loses", "Monster Hunters loses", "Crown Creditors split", …
  - On the tab and the PDF it now expects `stakeOpening`'s subject and verb. Its KEEP half expects "The <name>". The
    journal half is unchanged.
- `tests/lint/proseNumerics.test.js` was red with the field named `power`, on three titles:
  - "path + line + category + snippet debt exactly matches the committed baseline";
  - "the reviewed post-sweep total and per-category ceilings can only move down";
  - "a regenerated exact baseline cannot make an executed +1 leak green".

  The field was renamed to `subject` and all three are green with the baseline untouched. No pin moved here.
- Not moved, green:
  - `tests/components/crisisTab.test.jsx` (it reads reasons);
  - `tests/pdf/restoredSubsections.test.js` (`stakeLines` rows by `factionId`);
  - `tests/domain/tailCrisisBatch4.test.js`. Its `page()` helper mirrors the PDF line with the bare id ("as the PDF
    prints them"), so it is now a mirror, not the PDF's text. Its claims, on stake words and reasons, still hold.
- No crisis-tab snapshot exists: grep of `tests/` for `.snap` with Stakes found none. `tests/fixtures/` carries no
  printed stake row.

**(d) For the security reader:**
- No new holder and no new line. The same row, the same door and the same reason are shown to the same readers.
- The name now carries "The"/"the" before it. `powerNameWithArticle`'s CN3 (i) note says the share veil's search folds
  "the" + the name to the name.
- `tests/security/frameShareVeil.test.jsx` is green.

## Gates

- Test files (50 files, 484 tests, 0 failed):
  - the new test;
  - every importer of a changed file: `crisisTab`, `tailCrisisK26`, `crisisPage`, `crisisPageTierNoun`,
    `facts/crisisKind`, `summary/tonightSheetAudience`, `tailCrisisBatch4`, `tailCrisisBatch8`, `tonightSheetCast`,
    `generators/resolveCrisisCast`, `pdf/restoredSubsections`, `security/frameShareVeil`;
  - `tests/domain/crisis` whole and `tests/domain/tension` whole;
  - `dmEditKeysFollowRename`, `lint/proseNumerics`, `components/phoneChromeFloor.census`,
    `lint/nameListColumns.walker`, `foundry/journalMarksCrisisRows`, `pdf/fullPdf.render`,
    `components/tonightSheetOnce`, `components/houseLabelEverySurface`, `ui/prosperityInCrisisSurfaces`,
    `data/powerNumberAgreement`, `domain/powerSentenceName`.
- `typecheck:ratchet`: 167 errors, ceiling 167.
- `typecheck:domain:strict`: 1,113 errors, ceiling 1,113.
- `lint`: 0 errors and 38 warnings, none in a C2 file.
- Not run, as the brief says: the lighting census refreeze and the wiring census.

**The phone floor census:**
- The tab's change touches no font-size site. The two spans and the link keep their styles, and no `chromeFontSize` or
  `proseFontSize` site is added or removed.
- No census row is touched, and `tests/components/phoneChromeFloor.census.test.js` is green.

## Found, not built (outside C2's scope; for FRAME-6)

1. **The Foundry journal's crisis page is a third renderer the brief does not name.** It reads `stakeLines` but prints
   its own opening, `- **${powerSentenceName(k.factionId)}** ${CRISIS_PAGE_COPY.stake[k.stake]}: …`. It still prints
   "**Religious Authorities** gains". The rows now carry `subject`/`verb`, so the fix is one line in
   `src/foundry/journalPages.js`; K26's journal half pins today's text.
2. **Stored reasons that do not agree with a plural power:**
   - 150 plural `loses` rows read "The Merchant Guilds lose · **its** own people feel the crisis first"
     (`STAKE_REASONS.loses`).
   - "The Grain Holders split · **it** holds what is left of the food stores".
   - "The Neutrals split · both sides are courting **it**".

   These are stored strings (`crisisCast.js`). Changing them is a generation unit or a render map, not C2.
3. **The quarrel names in the `atOdds` reasons** (241 rows) print the bare leaf mid-sentence: "in its own quarrel with
   Elder Council", "… with The Guard". This is `crisisPage.js :: quarrelsOf` (`powerSentenceName`), not
   `powerNameInProse`.

## The scripts (scratch: `/tmp/claude-0/-home-user-settlement-engine/a474dbf6-e28f-5af7-9e9c-a8c4a943c31d/scratchpad/C2/`)

- `measure.mjs <worktree> <out.json>` births B7's pool and the calm pool and dumps each town's record sha, composed-page
  sha, outside-Stakes sha and Stakes lines. At the base it reads the base template; once `stakeOpening` exists it reads
  `stakeOpening`.
- `tally.mjs <before.json> [<after.json> <openings.txt>]` prints the tables above.
