# FRAME-6 · C2B results: the Stakes rows' three loose ends

The C2B builder wrote this on `frame6-c2b`, base `a170832e5`, for FRAME-6. It was first written on 2026-11-20 (`date -u`) and is updated at each commit.

- **Brief:** `docs/chair/2026-11-20/content/frame6/C2B-STAKES-FOLLOWUPS.md`. These are the chair's rulings of 15:58 UTC, each vetoable by the owner.
- **The pool:**
  - B7's births: `gen.mjs`, `generateSettlementPipeline({ settType, stressType: kind }, …)`, seeds `b7-<kind>-<tier>-<i>`, 24 per kind. That gives 360 towns, 0 misses, 1,818 shown Stakes rows and 2,300 stored stake rows.
  - C2's calm pool: seeds `c2-calm-<tier>-<0..11>` with no stress, 45 towns.
- **Each measure:**
  - The base tree is `git archive a170832e5`. The tip tree is this worktree. Both are measured by `C2B/measure.mjs` and compared by `C2B/compare.mjs` (scratch, below).
  - The measure keeps each town's stored record whole, the composed crisis page for the owner and for a non-owner, the Stakes rows as the tab and the PDF print them (`stakeOpening`), and the journal's Stakes rows.

## (a) The Foundry journal reads `stakeOpening`. Commit C2Ba.

**What the journal printed at the base:**
- `src/foundry/journalPages.js :: crisisJournalPage` composed its own opening: `- **${powerSentenceName(k.factionId)}** ${CRISIS_PAGE_COPY.stake[k.stake]}: ${reason}.`
- That gave the bare leaf with a singular verb, e.g. "- **Religious Authorities** gains: …".
- It was the third renderer C2 found (C2 § found, 1).

**What it prints now:**
- The journal reads the row's `subject` and `verb`. `pdf/lib/crisisPrint.js :: stakeLines` carries both from `crisisPage.js :: stakeOpening` on every row.
- The journal keeps its own frame: the subject in bold, then the verb, a colon and the reason.
- Exactly: `- **${esc(k.subject)}** ${k.verb}: ${esc(k.reason)}.`, e.g. "- **The Religious Authorities** gain: the church gains while the seat struggles."
- No third renderer composes an opening now.
- The `powerSentenceName` import (K26's) is gone from `journalPages.js`; it had no other reader there.

**The rows on B7's pool (base to tip):**
- 1,510 of the 1,818 journal Stakes rows change. These are the same 1,510 C2 changed on the tab and the PDF.

  | | gains | loses | split | at odds | answers |
  |---|---|---|---|---|---|
  | plural | 151 | 150 | 230 | 153 | 0 |
  | singular | 145 | 332 | 231 | 50 | 68 |

- The other 308 rows already opened on a form with its own article ("The Guard", "The Neutrals").
- After the change, every one of the 1,818 journal rows (unescaped) reads `- **<subject>** <verb>: <reason>.` with the subject, verb and reason the tab and the PDF print: 1,818 of 1,818, 0 mismatches.
- Examples, before and after:
  - `- **War Council** split: gains and loses by it at once.` → `- **The War Council** split: gains and loses by it at once.`
  - `- **Feudal Stewardship** loses: its own people feel the crisis first.` → `- **The Feudal Stewardship** loses: …`

**Byte-identity:**

| What | Towns | Identical |
|---|---|---|
| Stored record | 405 | 405 |
| Owner's composed page | 360 | 360 |
| Non-owner's composed page | 360 | 360 |
| Tab/PDF Stakes rows | 1,818 rows | 0 changed |
| Calm: record and pages | 45 | 45 |

**Red first:**
- `tests/components/crisisStakeFollowups.test.jsx` (C2B (a)) failed 2 of 2 on the base:
  - "b7-famine-town-0: "- **The Religious Authorities** gain: …", never "- **Religious Authorities** gains: …"" failed on the liveness anchor (the plural row is printed the old way);
  - "… every Stakes row the page composes prints in the journal as "- **<subject>** <verb>: <reason>."" failed on "Religious Authorities gains".
- Green: 2 of 2.

**The pin moved (named; nothing re-recorded):**
- `tests/components/tailCrisisK26.test.jsx`, "each census town: the re-formed label prints as the leaf says, never raw; a power already named prints its own name".
- Its journal half now expects `- **<stakeOpening subject>** <verb>: <reason>.`, both the re-formed anchor and the KEEP line. The old raw form stays the absent side.

**For the security reader:**
- Only the owner gets the journal. `crisisJournalPage` composes with `TONIGHT_AUDIENCES.owner`, and `buildJournalPages` is reached only from `generateFoundryModule` on the owner's saved view (U0's results, 5).
- No new line and no new holder.

**Gates at C2Ba:**
- The new test, and every test file that imports `journalPages.js` (tests/lint excluded): 45 files, 367 tests, 0 failed. K26, `foundry/journalMarksCrisisRows`, `foundry/*`, `pdf/journal*` and `components/tonightSheetOnce` are among them.
- `tests/domain/crisis`, `tests/domain/tension` and `tests/security/frameShareVeil.test.jsx`: 31 files, 244 tests, 0 failed.
- `typecheck:ratchet`: 167 errors, ceiling 167.
- `typecheck:domain:strict`: 1,113 errors, ceiling 1,113.
- `lint`: 0 errors, 38 warnings.
- The lint walkers that read the touched files: `writerReach.walker`, `proseNumerics`, `namesInSentences.walker` and `seedLoopTotality.walker` are green. One is red:
  - `tuningRegister.walker`, "the measured tree matches the committed inventory exactly", on 3 rows:
    - `sideArchetypes.js#FRAME_TUNING: measured, not in the inventory`;
    - `crisisCast.js#CRISIS_CAST_TUNING: dependents moved`;
    - `tonightSheet.js#WANT_MAX_WORDS: dependents moved`.
  - It is not C2B's. The inventory's dependents for `CRISIS_CAST_TUNING` lack the importers the lane added before this base (`tension/troubleCast.js`, `data/stressPowerFaces.js`, …), and C2Ba changes no import of either module.
  - It is not re-recorded: the integrator does that.
