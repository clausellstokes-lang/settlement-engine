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

## (b) A plural power's stored `loses` reason takes the plural possessive, at birth. Commit C2Bb (STORED).

**The writer:**
- `src/domain/crisis/crisisCast.js :: deriveStakes`, rule 11, is the one writer of `stress[].cast.stakes[].reason`.
- `deriveCrisisCast` calls it, and only the pipeline step `generators/steps/resolveCrisisCast.js` (birth) calls that.
- No read path re-derives a stake.

**What changed:**
- The `loses` row's reason is now `fillAgreement('{power|its|their}' + STAKE_REASONS.loses after its "its", { power: name })`.
  - `fillAgreement` is the names lane's own helper (`data/people/powerSentenceName.js`, through `domain/display/powerSentenceName.js`), and `powerVerb`/`pluralPowerName` choose the number. No second rule stands beside it.
  - A plural power is born with "their own people feel the crisis first".
  - A singular power is born with `STAKE_REASONS.loses`, byte for byte.
- The form is built from the one literal. There is no second copy of the sentence, and no new export.
  - `crisisCast.js` stands at its size ceiling, 800 effective lines (`max-lines`; the size baseline only shrinks). The change is therefore one line plus the import, which is joined onto an existing import line. A first draft with a `STAKE_REASON_FORMS` table reached 804 and reddened `lint` with 1 error. That draft was not committed.
- **Only the `loses` reason moves.** The chair's ruling names it and C2's count (150) is its count.
- A saved town keeps its own string. The page reads the record and there is no read-time rewrite (tested).

**Measured and not built (other stake reasons held by a plural power on B7's pool, at the base):**
- Possessives in the `RAISED_BY_CRISIS` `adds` reasons:
  - "the revolt has cut into its labour and its trade" 48;
  - "newcomers … threaten its hold on the trades" 28;
  - "some of its families have made private terms …" 8;
  - "every claimant needs its backing" 4.
  - That is 88 rows.
- Pronouns:
  - "trade disruption and requisitions are costing it" 29;
  - "it holds what is left of the food stores" 24;
  - "both sides are courting it, for a price" 23;
  - "the call-up and the grieving have made it indispensable" 8.
  - That is 84 rows.
- "gains and loses by it at once" (81) and "a rival claim to govern gains by it" (19) are not about the power: there "it" is the crisis.
- These need the chair's word. They are the same law over more reasons; `tailCrisisBatch8` pins each raised reason to its `STAKE_REASONS` literal.

**Is the (b) two-crisis proof needed? No, and checked:**
- No cast role reads the `loses` reason. The brunt's losers read `k.stake === 'loses'`, or a `split` whose reason is `STAKE_REASONS.split`.
- `crisisHooks.js` reads a loser's reason to compose the hook at render, with its own `its`→`their` for a plural loser. Its output is unchanged, and no hook is stored: born-a holds 0 "their own people…" strings.
- The measure agrees. On 405 + 525 + 720 documents there are 0 non-string differences, and every differing string is this one reason.

**Proof (a): byte-identity on B7's pool and the calm pools** (tip C2Bb against C2Ba; C2Ba is render-only, so the record base is `a170832e5`'s):

| What | Towns | Identical |
|---|---|---|
| Crisis towns, stored record (whole) | 360 | 260 |
| Calm towns (C2's 45): record and pages | 45 | 45 |
| B2's calm pool (`pool.mjs 55`: `frame-calm-<tier>-<i>`, tried 484), record and composed pages (owner, non-owner) | 330 | 330 |

- The 100 crisis towns that differ are exactly the 100 that hold a plural `loses` row. Every town with no such row is byte-identical: 260 of 260.
- In the 100, the only differing leaves are `.stress.cast.stakes[].reason` 150 and its alias `.stressors.cast.stakes[].reason` 150. Each one is "its own people feel the crisis first" → "their own people feel the crisis first". There are 0 non-string differences.
- Rows changed by (b), out of 2,300 stored stake rows and 1,818 shown: **150 stored reasons; 150 tab/PDF rows; 150 journal rows.** All are plural `loses`; no other row moves.
- The composed page outside the Stakes rows is identical in 360 of 360 towns. The owner's and the non-owner's whole pages are identical in 260 of 360 (the 100 differ only in those rows).
- Examples, as printed:
  - `b7-under_siege-hamlet-1`: "The Merchant Guilds lose · its own people feel the crisis first" → "The Merchant Guilds lose · their own people feel the crisis first";
  - `b7-politically_fractured-town-2`: "The Religious Authorities lose · its …" → "… their own people feel the crisis first";
  - `b7-monster_pressure-town-1`: "The Monster Hunters lose · its …" → "… their …";
  - journal: "- **The Craft Guilds** lose: their own people feel the crisis first."

**Proof (c): confinement on two trees** (the shared tool, `run.mjs` born and `confine.mjs`, `--words=number`):
- The trees:
  - `git archive a2fcb7629` (C2Ba);
  - the same with C2Bb's `crisisCast.js` (byte-identical to this worktree's `src/`).
- The tool's copy is this checkout's, a superset of `d1d8ffff8`'s: `--fails`, `--seeds` and `--pronouns` were added, and `born.census.js` is identical.

| Corpus | Documents | Identical | Non-string differences | Differing strings | Pass the number check | Other |
|---|---|---|---|---|---|---|
| Golden 525 | 525 | 298 | **0** | 454 (`stress.cast.stakes[].reason` 227, its `stressors` alias 227) | 454 | 0 |
| Census 720 | 720 | 658 | **0** | 156 (`stress.…reason` 76 in 61 towns, `stress[].…` 2 in 1, and their aliases) | 156 | 0 |

- The differing strings equal exactly the new "their own people feel the crisis first" strings counted in the after births: golden 0 → 454, census 0 → 156. So ONLY that string moves.
- Births were redone after the one-line restructure. The golden and census files are byte-identical to the first tip births, and B7's measure is identical.
- The births (about 420 MB) are deleted.

**The stored figures moved, before → after, signed by nobody (nothing re-recorded):**
- The generator golden master (`tests/property/generatorGoldenMaster.test.js`):
  - it is red on 521 of 525 at both ends;
  - 227 row hashes move;
  - the 4 matching rows hold (4 → 4).
- `espionageDormancyFence`, FENCE 1 "THE DRIVEN GOLDEN": the driven hash goes `9bcbfbef…` → `9dc8b4dd…` (committed `9829e655…`). It is red at both ends.
- `generationForkCensus` A1's control row (golden control key) goes `26932f67…` → `f1a55652…` (committed `71ea4d5f…`). It is red at both ends.
- These are red at both ends with the same figure:
  - `dmLayerGoldenIsolation` A7 (521);
  - `worldFactRederive` A7 (7);
  - `pipelinePinnedMode` A1, A2 and A5;
  - `pipelinePinnedChoosers` A1;
  - `institutionBudgetPromise` "sixty seeds" (50);
  - `dossierProseManifest` DRIFT arm (1,050).
  - Each of these was run at C2Ba's tree and at the tip, with the same 11 failing titles.
- `tuningRegister`: no new table, and the `CRISIS_CAST_TUNING` span is untouched.
- **The pin moved:** `tests/domain/crisisCast.test.js`, "rule 11: every faction gets exactly one stake and one reason". The closed reason set now admits the `loses` reason in the stake's own power's number.

**Red first:**
- `crisisStakeFollowups.test.jsx` C2B (b) failed 1 on the base: "b7-under_siege-town-1: the Merchant Guilds and the Craft Guilds lose by "their own people"; the singular loser keeps "its"". The failure was the liveness anchor: the stored reason was "its own people feel the crisis first".
- The saved-town guard ("a saved town keeps its own string") is green on both sides.
- Green: 4 of 4 in the file.

**For the security reader:**
- No new holder, no new name and no new fact. A pronoun in a stored reason takes its power's number.
- The Stakes rows are shown only on the owner's surfaces: the Crisis tab is not mounted on the gallery page or the party link (U0's results, 4), and the PDF and journal are the owner's.
- The shared record still holds the crisis cast's stakes (`publicSafe.js` filters hidden powers' rows), so it now holds "their" where it held "its" for a plural power.
- A DM rename of a plural power to a singular name keeps the birth's "their": a stored string, like every other.

**Gates at C2Bb:**
- The new test, every test importing `crisisCast.js`, the stake/cast tests (44 files), `tests/domain/crisis`, `tests/domain/tension` and `frameShareVeil`: 56 files, 524 passed and 1 expected fail, 0 failed.
- `typecheck:ratchet` 167/167; `typecheck:domain:strict` 1,113/1,113; `lint` 0 errors (38 warnings).
- Walkers (`writerReach`, `proseNumerics`, `namesInSentences`, `seedLoopTotality`, `sizeBaseline`) are green. `tuningRegister` is red on the same 3 rows as at C2Ba; they are not C2B's.
