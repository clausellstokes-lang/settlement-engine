# FRAME-6 · P4A — the creditor named on the debt crisis's page (render only, owner only): results

Builder P4A of FRAME-6, in the worktree `wt-p4a` on branch `frame6-p4a`, cut at `9f24bdbc6` (U0, C1, P1B, P1B-F and C2
merged), from the brief `docs/chair/2026-11-20/content/frame4/FRAME4-BRIEFS-U0-P1B-P4A.md` (the common section and "U2 =
P4a"), B7 §P4a (`frame2/B7-CF10-PROPOSAL-RESULTS.md`) and the chair's rulings in my prompt (owner only, behind U0's
argument; the dealer's reason never said to the DM). Measured and built 2026-11-20 15:45–16:35 UTC (`date -u`). Every run
is a file in the scratchpad folder `P4A/`; gates were read through `sh scripts/gate-tail.sh` or a file and its own exit
code, never a pipe; every test ran under `sh scripts/gate-mutex.sh --run --`.

The code and tests are commit `8c9d71522`; this file is its own commit after it.

## Measure first (taken before any edit to `src/`; nothing refuted the section)

1. **Where the debt crisis's page is composed and rendered.** Composed ONCE: `src/domain/crisis/crisisPage.js ::
   composeCrisisPage`. Its readers: the Crisis tab (`src/components/new/tabs/CrisisTab.jsx`, `audience` threaded from
   `OutputContainer.jsx` line 715), the PDF chapter (`src/pdf/sections/CrisisSections.jsx` line 30, `'owner'`) and the
   Foundry journal (`src/foundry/journalPages.js :: crisisJournalPage`, line 188, `'owner'`). The PDF and the journal print
   named fields only (`line`, `summary`, `cast`, `stakes`, `levers`, `seeFirst`, `ifNothingIsDone`; read whole), so a new
   section field reaches neither without an edit there. The line is composed once, as a new optional section field
   `creditor`, and rendered by the Crisis tab only (the smallest set; see the judgment calls).
2. **What a shared page shows of the crisis section today** (for the security reader; re-read at `9f24bdbc6`): the
   owner's own surfaces (the live editor and the owner's saved view) mount the Crisis tab with `audience 'owner'`
   (`OutputContainer.jsx` line 715). The gallery page (default and DM content shared) and the party link (Reveal DM off and
   on) mount NO Crisis tab (`hasCrisisTab = !playerView && !publicDossier && …`, line 534, the security lane's gate,
   untouched), so no crisis page is composed there for anyone. The PDF and Foundry exports pass `'owner'` and will not
   print the line. By the chair's ruling the line is drawn for `'owner'` only.
3. **The stored fields that prove the creditor and its face.** The integrator's reading is CONFIRMED, with one correction
   (the Crown Creditors' arm, below):
   - **The marker**: the `indebted` entry's stored stake row (`stress[].cast.stakes[]`, its `factionId`) whose power in
     `powerStructure.factions` has a `desc` opening with an `indebted` `opens` text of `crisisCast.js :: RAISED_BY_CRISIS`.
     Two rows exist: `'Resident agent of the external creditor'` → `creditorAgent` ("Creditor's Representative") and
     `"A coalition of noble houses that hold the crown's debt."` → `holdsDebt` ("Crown Creditors (Noble Coalition)").
     The stored stake reason agrees in every town measured (`split`, "it speaks for the creditor the town owes").
   - **The face**: the roster person (`npcs[]`) holding rank 1 in that power (`memberships`): the minted "the creditor's
     agent" (`mintTitles.js :: OTHER_MINT_ROWS`), one member, never a cast row (0 of 24), never the seat-holder (0 of 24).
   - **The tie**: `relationships[]` with `typeName 'Outstanding Debt'` and the face at `from` or `to`; `from` is the debtor
     (the tie's own prose: "Aarav Deshpande owes Deepa Mishra for an old kindness", `npcData.js :: old_debt`, "debtor first").
   - **B7's indebted pool, re-born** (24 towns, `b7-indebted-<tier>-<i>`): the creditor power **Creditor's
     Representative in 24 of 24** (arm `creditorAgent`; Crown Creditors 0 of 24); its face present **24 of 24**; an
     Outstanding Debt tie touching the face **10 of 24** (B7: 10 of 24): the face owes 8 (thorp-1, village-0, village-3,
     town-0, town-1, town-3, metropolis-2, metropolis-3), the face is owed 2 (thorp-3, city-1). **Towns where no face
     stands: 0.** Same gender at the tie's two ends: 3 of 10.
   - **The natural pool** (B7's `b7-natural-<tier>-<i>`, 360 births): 9 indebted, all `creditorAgent`, face 9 of 9, tie 4
     (the face owes, all 4).
   - **A Crown Creditors search** (`p4a-crown-<tier>-<i>`, 200 forced indebted births, village to metropolis, 50 a tier):
     `holdsDebt` in **1 of 200** (`p4a-crown-metropolis-44`, governing Royal Authority with a noble house), its face
     "the lady" (a noble house's face); `creditorAgent` 199, face 199 of 199, tie 101 (the face owes 87, is owed 14).
   - **The 525-row golden master**: 0 indebted rows (B7: 0).
   - **The correction**: in the Crown Creditors' arm the record says the noble houses HOLD the crown's debt; the brief's
     sentence ("The town owes an outside lender, never named") would contradict it (CF9). The closed set therefore keys
     its sentence by the marker's stake reason, and holds one for `creditorAgent` only; `holdsDebt` draws nothing (today's
     page, pinned). A sentence for it, and P4b's criminal creditor, are each one more row of the same table.
4. **A DM-edited cast**: the line does NOT follow the edit state, by design. It reads the stored stakes, the powers, the
   roster and the ties; the DM's edit (`effectiveCastOf`) replaces only the cast's roles and keeps the engine's stakes,
   which the page still prints under an edit. So the line stands beside the stakes it explains (pinned: "a DM-edited cast
   keeps the line…"). It is not a cast row and names no role.

## What was built (two files of `src/`)

`src/domain/crisis/crisisPage.js`:
- `CRISIS_PAGE_COPY` untouched. New `CRISIS_CREDITOR_LINE` (exported, frozen), the closed set:
  - `line.creditorAgent`: `'The town owes an outside lender, never named; {face}, {title}, speaks for them{tie}.'`
  - `tie.owedToFace`: `', and {other} owes {face} besides'`; `tie.faceOwes`: `', and {face} owes {other} besides'`.
- `creditorOf(s, entry)` (private): the first stored stake row of the entry whose power's `desc` opens with that kind's
  `opens` text in `RAISED_BY_CRISIS` AND whose reason has a sentence in `CRISIS_CREDITOR_LINE.line`; its face (first
  roster card, rank 1 in the power, with a name and a title); the first Outstanding Debt tie touching the face whose
  other end is a named roster person. Rate 1, no hash, no new number; never the power's display name.
- `creditorLineOf(s, entry, speak)` (private): the sentence spoken with the place's own noun BEFORE the names fill it
  ("The village owes…"); `{face}` once in full with the record's title; the tie's other end as "{title} {name}"; the
  face's second mention by the names rule: her/him (object) or she/he (subject) where the other end is not of the face's
  gender, else the face's title ("the creditor's agent"). No pronoun "them" is used for the face (it is the lender's).
- In `composeCrisisPage`: `section.creditor` is set ONLY where `forOwner` and a line is drawn; the key is absent on every
  other section and every other reader's page. The typedef gains `@property {string} [creditor]`.

`src/components/new/tabs/CrisisTab.jsx`: after the stake rows, `<p data-testid="crisis-creditor">{section.creditor}</p>`
where present; the Stakes heading shows where stakes or the line stand (no change on any page today: the creditor's own
stake row is always shown).

**The line, before and after (the owner's Crisis tab; before: no line, the stake row "The Creditor's Representative split
· it speaks for the creditor the city owes")**:
- `b7-indebted-city-1`: "The city owes an outside lender, never named; Deepa Mishra, the creditor's agent, speaks for
  them, and the innkeeper Aarav Deshpande owes her besides."
- `b7-indebted-town-2`: "The town owes an outside lender, never named; Naoise Kennedy, the creditor's agent, speaks for them."
- `b7-indebted-village-0`: "…; Hlíf Sigmundsson, the creditor's agent, speaks for them, and she owes the master of the hunt
  Palnatoke Ketilsson besides."
- `b7-indebted-thorp-1` (both women): "…; Sigrid Bauer, the creditor's agent, speaks for them, and the creditor's agent owes
  the head shepherd Sophia Becker besides."
- `b7-indebted-town-3` (the face owes the seat): "…; Bakab May, the creditor's agent, speaks for them, and the creditor's
  agent owes the lord's appointee Snake Ku besides."
- `p4a-crown-metropolis-44` (Crown Creditors): unchanged.

## (a) Byte-identity (`run.mjs` at the base, before the edit, and at the tip; `compare.mjs`)

Every town's STORED record digested, and its composed crisis page digested for ten readers (no argument, `undefined`,
`null`, `{}`, `{ audience: undefined }`, `'owner'`, `'player'`, `'gallery'`, `'Owner'`, the bare string `'owner'`).
Every stranger's tip page compared with the BASE page composed with no options (today's page); the owner's tip page with
the BASE owner's page (which already carries P1B's clause), except where measure 3 predicts the line: there the tip
owner's page less `creditor` must equal today's page and the line must equal the one `compare.mjs` writes independently
from the base's facts.

| pool | towns | stored identical | stranger pages identical | owner pages moved (predicted) | owner identical | unexpected |
|---|---|---|---|---|---|---|
| B7's crisis pool (15 kinds, 24 a kind) | 360 | 360 | 3,240 of 3,240 | 24 of 24 | 336 | 0 |
| natural pool (calm and natural crises) | 360 | 360 | 3,240 of 3,240 | 9 of 9 | 351 | 0 |
| Crown search (forced indebted) | 200 | 200 | 1,800 of 1,800 | 199 of 199 | 1 (the Crown arm) | 0 |
| 525-row golden master | 525 | 525 | 4,725 of 4,725 | 0 of 0 | 525 | 0 |

- **Stored**: 1,445 of 1,445 identical (no file under `src/generators/` changes).
- **Composed, every reader who is not the owner**: 13,005 of 13,005 identical to today's page.
- **The owner's page**: identical in 1,213 towns (every town of every other kind, every calm town, the Crown arm); it
  differs in exactly the 232 towns measure 3 named, each by the `creditor` key alone, each line as predicted.

## (b) Red first, then green

- **RED** (`red.txt`, `red2.txt`: the new test file and the veil's P4A arm, `src/` at the base): `crisisCreditorLine.test.js`
  **6 failed | 3 passed**; `frameShareVeil.test.jsx -t P4A` **1 failed**. Failing titles:
  - `crisisCreditorLine.test.js > P4A: … > the closed set: fixed sentences, frozen, …` (`CRISIS_CREDITOR_LINE` undefined);
  - `… > the owner's page gains the line on B7's indebted towns (6); nothing is stored`;
  - `… > a reader who is not the owner gets today's page byte for byte; the owner's differs only by the line`;
  - `… > the creditor is read by the record's marker, not by its display name`;
  - `… > a debt tie that does not touch the face is not used; the clause follows the face's own tie alone`;
  - `… > a DM-edited cast keeps the line (…); strangers get today's page`;
  - `frameShareVeil.test.jsx > P4A: the creditor's face is drawn for the owner only > the owner's Crisis tab names the
    creditor's face; no shared page and no other reader does (2 born towns)` (2 of 2: "the owner's line: expected undefined").
  - Green at the base, as designed (the strangers' side): "where no face stands, or no power carries the creditor's
    marker…", "the Crown Creditors' arm…", "every other kind, and a calm town…".
  - (A first red run, `red.txt`, also redded "every other kind…" on `b7-infiltrated-hamlet-1`: that arm compared the
    owner's page whole and met P1B's clause; the arm now cuts P1B's clause from both sides and holds P4a's line alone.)
- **GREEN** (`green-new.txt`): `Test Files 2 passed (2)`, `Tests 10 passed | 9 skipped (19)`.

## Gates

- `tests/domain/crisis` whole + `tests/domain/tension` whole + `tests/security/frameShareVeil.test.jsx` whole
  (`gate-lane.txt`): **`Test Files 30 passed (30)`, `Tests 235 passed (235)`**. (The first run of `tests/domain/crisis`,
  `gate-crisis1.txt`, was red on the two pins below before their amendment: 2 failed | 188 passed.)
- Every other test file that imports `crisisPage.js` or `CrisisTab.jsx`, every importer of `CrisisSections` or
  `foundry/journalPages`, and the lint walkers whose registers name `crisisPage.js` or `CrisisTab.jsx` or read
  `src/domain/crisis` (`gate-importers.txt`, JSON `importers.json`, 66 files): **732 passed, 1 failed**.
  - **The one red is not mine**: `tests/lint/tuningRegister.walker.test.js > tuning register — the inventory is frozen and
    honest > the measured tree matches the committed inventory exactly`, on exactly the three rows FRAME-6's hand-back
    names as the line's ("FRAME_TUNING: measured, not in the inventory"; "CRISIS_CAST_TUNING: dependents moved";
    "WANT_MAX_WORDS: dependents moved"; `tuning.txt`). `crisisPage.js` was already a dependent of `CRISIS_CAST_TUNING`;
    I added no import of a new module and no numeric constant.
  - The lighting census and the wiring census were NOT run (the integrator's). My new test file is one more file for the
    lighting census's file count.
- `npm run typecheck:ratchet`: 167 errors, ceiling 167 (OK). `npm run typecheck:domain:strict`: 1113, ceiling 1113 (OK).
  `npm run lint`: **0 errors** (38 warnings, as at the base; `eslint` on the six touched files prints nothing).

### The 66 importer and walker files (JSON reporter)

- `tests/components/bar3ServicesRows.test.jsx`: 8 passed, 0 failed
- `tests/components/crisisStakeAgreement.test.jsx`: 3 passed, 0 failed
- `tests/components/crisisTab.test.jsx`: 7 passed, 0 failed
- `tests/components/houseLabelEverySurface.test.jsx`: 5 passed, 0 failed
- `tests/components/phoneChromeFloor.census.test.js`: 9 passed, 0 failed
- `tests/components/tailCrisisK26.test.jsx`: 1 passed, 0 failed
- `tests/components/tensionSeverityOneWord.test.jsx`: 16 passed, 0 failed
- `tests/components/tonightSeatSecret.test.jsx`: 3 passed, 0 failed
- `tests/components/tonightSheetOnce.test.jsx`: 4 passed, 0 failed
- `tests/data/w2FixData12Rows.test.js`: 5 passed, 0 failed
- `tests/domain/crisisPage.test.js`: 9 passed, 0 failed
- `tests/domain/crisisPageTierNoun.test.js`: 3 passed, 0 failed
- `tests/domain/deityTemperConsumerCensus.walker.test.js`: 24 passed, 0 failed
- `tests/domain/dmEditKeysFollowRename.test.js`: 10 passed, 0 failed
- `tests/domain/tailCrisisBatch4.test.js`: 2 passed, 0 failed
- `tests/domain/tailCrisisBatch8.test.js`: 58 passed, 0 failed
- `tests/domain/tonightSheetCast.test.js`: 4 passed, 0 failed
- `tests/foundry/foundryFaithGate.test.js`: 10 passed, 0 failed
- `tests/foundry/foundryManifest.test.js`: 15 passed, 0 failed
- `tests/foundry/journalChainStateIsTheCards.test.js`: 3 passed, 0 failed
- `tests/foundry/journalForcesNoProvenance.test.js`: 1 passed, 0 failed
- `tests/foundry/journalMarksCrisisRows.test.js`: 16 passed, 0 failed
- `tests/foundry/journalPrintsTheTabsLeaf.test.js`: 6 passed, 0 failed
- `tests/foundry/markdownEscapeSingleWriter.test.js`: 9 passed, 0 failed
- `tests/generators/foodwaysOneLine.test.jsx`: 6 passed, 0 failed
- `tests/generators/foundryExportsFishTrade.test.js`: 7 passed, 0 failed
- `tests/generators/r3cRekeyedLinesTrue.test.js`: 3 passed, 0 failed
- `tests/generators/resolveCrisisCast.test.js`: 10 passed, 0 failed
- `tests/lint/chainPrintSites.walker.test.js`: 6 passed, 0 failed
- `tests/lint/domainAnyCastBaseline.test.js`: 19 passed, 0 failed
- `tests/lint/factLayers.walker.test.js`: 15 passed, 0 failed
- `tests/lint/institutionLabelSeam.census.test.js`: 31 passed, 0 failed
- `tests/lint/nameListColumns.walker.test.js`: 6 passed, 0 failed
- `tests/lint/presumedThings.walker.test.js`: 43 passed, 0 failed
- `tests/lint/presumptionClasses.walker.test.js`: 16 passed, 0 failed
- `tests/lint/resourceLabelSeam.census.test.js`: 18 passed, 0 failed
- `tests/lint/ruinFilterRoster.walker.test.js`: 12 passed, 0 failed
- `tests/lint/sourceCitationIntegrity.walker.test.js`: 18 passed, 0 failed
- `tests/lint/statusUnionTotality.walker.test.js`: 4 passed, 0 failed
- `tests/lint/styleLaw.walker.test.js`: 20 passed, 0 failed
- `tests/lint/tuningRegister.walker.test.js`: 75 passed, 1 failed
- `tests/pdf/chainStateThreeSurfaces.test.jsx`: 6 passed, 0 failed
- `tests/pdf/cultureBlockTwoSurfaces.test.jsx`: 4 passed, 0 failed
- `tests/pdf/foodFiguresEverySurface.test.jsx`: 3 passed, 0 failed
- `tests/pdf/foodWordEverySurface.test.jsx`: 3 passed, 0 failed
- `tests/pdf/journalChainNames.test.js`: 4 passed, 0 failed
- `tests/pdf/journalForceNoProvenance.test.js`: 1 passed, 0 failed
- `tests/pdf/journalMemberOfPower.test.js`: 1 passed, 0 failed
- `tests/pdf/leftPdfReadsTheTabs.test.jsx`: 6 passed, 0 failed
- `tests/pdf/npcNoLookVoiceTell.test.jsx`: 2 passed, 0 failed
- `tests/pdf/pdf2ReadsTheTabs.test.jsx`: 9 passed, 0 failed
- `tests/pdf/pdfParityFixes.test.js`: 18 passed, 0 failed
- `tests/pdf/quartersNotPrinted.test.jsx`: 4 passed, 0 failed
- `tests/pdf/resourceChainsLikeTheTab.test.jsx`: 7 passed, 0 failed
- `tests/pdf/restoredSubsections.test.js`: 31 passed, 0 failed
- `tests/pdf/seamPdfReadsTheTabs.test.jsx`: 4 passed, 0 failed
- `tests/pdf/tailDisplayCivic3V2.test.jsx`: 2 passed, 0 failed
- `tests/pdf/tailDisplayCivic4V11.test.jsx`: 3 passed, 0 failed
- `tests/pdf/tailExportsPdf3Batch3.test.jsx`: 4 passed, 0 failed
- `tests/pdf/tradeListsThreeSurfaces.test.jsx`: 5 passed, 0 failed
- `tests/pdf/tradePillWordEverySurface.test.jsx`: 2 passed, 0 failed
- `tests/ui/prosperityInCrisisSurfaces.test.jsx`: 11 passed, 0 failed
- `tests/domain/facts/crisisKind.test.js`: 6 passed, 0 failed
- `tests/domain/npc/characterDrift.test.js`: 45 passed, 0 failed
- `tests/domain/summary/tonightSheetAudience.test.js`: 1 passed, 0 failed
- `tests/domain/tension/troubleWeight.test.js`: 10 passed, 0 failed

## (c) The fixtures and the pins

- `tests/fixtures/`: no file names `composeCrisisPage`, `crisis-creditor` or `CRISIS_CREDITOR`; the one that names
  "creditor" (`legacy-saves/people-car-v1-2026-11-07.json`) is a stored record, untouched. The golden master holds no
  indebted row. Re-recorded: **nothing**.
- Tests naming `indebted`, `stressType`, `creditor`: the generator tests read the stored record (byte-identical, above);
  the crisis-page readers are in the gates above, green.
- **TWO PINS MOVE**, by design, each amended minimally (every stranger arm unchanged):
  - `tests/domain/crisis/crisisPageAudience.test.js > U0: the crisis page is composed for an explicit reader > the seam
    changes no page: every reader gets today's page, on every crisis kind and on the calm pool`: its owner arm redded on
    `b7-indebted-city-0`, `b7-indebted-hamlet-0`, `b7-natural-hamlet-0`, `b7-natural-metropolis-1` (4 of 42); `withoutOwnerReach` now also
    cuts the section's `creditor` key.
  - `tests/domain/crisis/crisisOutsideHand.test.js > P1B: … > every other kind, and a calm town: the owner's page is
    today's`: redded on `b7-indebted-village-0`; the owner's page there is compared less its `creditor` key (`lessP4a`).
- The veil test: one new `describe('P4A: …')` block appended at the END of the file; nothing above it touched.

## (d) For the security reader

- **New line**: on the OWNER's crisis page only, a debt crisis's section gains `creditor`: "The town owes an outside
  lender, never named; {face}, {title}, speaks for them[, and {other} owes {face2} besides | , and {face2} owes {other}
  besides]." It names (1) the creditor power's face, a roster PERSON (rank 1 in "Creditor's Representative", the minted
  "the creditor's agent") with the record's title; (2) where an Outstanding Debt tie touches the face, the tie's other end
  (a roster person, by title and name) and WHO OWES WHOM: a relationship fact, said in a sentence for the first time on
  this page. It never names the lender, the creditor power, any outsider, or the dealer's reason.
- **Composed in** `crisisPage.js :: composeCrisisPage` (`creditorOf`, `creditorLineOf`, `CRISIS_CREDITOR_LINE`); printed
  by `CrisisTab.jsx` (`data-testid="crisis-creditor"`). Nothing is stored, so no shared read (gallery, DM-full gallery,
  party link, import, world export) can carry it.
- **Who could meet it**: only a caller of `composeCrisisPage` with `{ audience: 'owner' }`: the Crisis tab on the owner's
  live editor or saved view; the PDF chapter and the Foundry journal compose with `'owner'` but print no `creditor` field.
  The gallery page and the party link (Reveal DM off and on) mount no Crisis tab; every non-owner reader composes today's
  page (pinned in the veil test's P4A block on the shared records and on the owner's own).
- **The lock is the audience alone**, as P1B's: rate 1, no `_seed` needed, so a shared record composed with `'owner'`
  WOULD draw it. What I would test, theirs to own: that `hasCrisisTab` stays false on `publicDossier` and `playerView`;
  that no shared surface ever passes `'owner'` to `composeCrisisPage`; that if the PDF or the journal ever print
  `creditor`, they stay owner-only exports; and that the debt tie's direction and its other end, which this line puts in
  a sentence, are veiled on shared pages wherever `relationships` are.

## Judgment calls (each vetoable)

- **The Crown Creditors' arm draws nothing** (measure 3's correction): the sentence is the external creditor's; the houses
  holding the crown's debt are not "an outside lender, never named". 1 of 200 forced births.
- **Both tie directions** are used ("touches that face"): the face owed (B7's example, 2 of 24) and the face owing (8 of
  24), each in its own fixed clause; the alternative (the face owed only, the face's own debt as private as the seat's) is
  one row of `CRISIS_CREDITOR_LINE.tie` to delete.
- **The face's second mention** is its pronoun or, where the tie's other end shares its gender, its record title ("the
  creditor's agent", not B7's "the agent", which is no record's word). "them" stays the lender's.
- **The other end is "{title} {name}"** (B7's "the innkeeper Aarav Deshpande"): every title measured is a "the …" form.
- **The tab only** prints the line (the smallest set): the PDF and the journal are owner-only exports that could carry it
  by one line each; not built.
- **Placement**: after the stake rows (it explains the creditor's own stake row and, like the stakes, stands under a DM's
  cast edit), not in "Who it touches" (it is no cast row).
- **The face needs a title** on the record (the sentence's appositive); a titleless face draws nothing (never measured).

## The scripts (run from the scratchpad folder `P4A/`: `node measure.mjs <worktree> indebted|natural` before the edit;
`node run.mjs <worktree> <pool> base-<pool>.json` for `crisis`, `natural`, `crown`, `golden` before the edit, the same to
`tip-<pool>.json` after; then `node compare.mjs base-<pool>.json tip-<pool>.json`. `run.mjs` is FRAME-5 · P1B's, adapted;
the seeds are B7's `gen.mjs`/`natural.mjs` and the golden rows `goldens.mjs`'s, as P1B's scripts carry them)

### `measure.mjs`

```js
// FRAME-6 · P4A — MEASURE FIRST: on B7's indebted pool (b7-indebted-<tier>-<i>, 4 a tier) and the natural pool's indebted
// births, the stored fields that prove the creditor and its face, and the Outstanding Debt ties touching the face.
// argv: worktree root, pool (indebted | natural)
const ROOT = process.argv[2].replace(/\/?$/, '/');
const POOL = process.argv[3];
const { generateSettlementPipeline } = await import(ROOT + 'src/generators/generateSettlementPipeline.js');
const { RAISED_BY_CRISIS, STAKE_REASONS } = await import(ROOT + 'src/domain/crisis/crisisCast.js');
const { rulingChainOf } = await import(ROOT + 'src/domain/dossier/powerStrata.js');
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const arr = (v) => (Array.isArray(v) ? v : []);
const list = [];
if (POOL === 'indebted') for (const t of TIERS) for (let i = 0; i < 4; i++) list.push({ seed: `b7-indebted-${t}-${i}`, cfg: { settType: t, stressType: 'indebted' } });
else for (const t of TIERS) for (let i = 0; i < 60; i++) list.push({ seed: `b7-natural-${t}-${i}`, cfg: { settType: t } });
const OPENS = RAISED_BY_CRISIS.filter(([k, , , how]) => k === 'indebted' && how === 'opens');
const out = [];
for (const { seed, cfg } of list) {
  const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
  const st = [s.stress].flat().filter(Boolean);
  const e = st.find((x) => x.type === 'indebted');
  if (!e) continue;
  const factions = arr(s.powerStructure?.factions);
  const byDesc = factions.filter((f) => OPENS.some(([, text]) => String(f.desc || '').startsWith(text)));
  const stakes = arr(e.cast?.stakes);
  const byStakeReason = stakes.filter((k) => k.reason === STAKE_REASONS.creditorAgent || k.reason === STAKE_REASONS.holdsDebt);
  const credName = byDesc[0] ? (byDesc[0].faction || byDesc[0].name) : null;
  const stakeRow = stakes.find((k) => k.factionId === credName) || null;
  const heads = arr(s.npcs).filter((n) => arr(n.memberships).some((m) => m?.power === credName && m?.rank === 1));
  const members = arr(s.npcs).filter((n) => arr(n.memberships).some((m) => m?.power === credName));
  const face = heads[0] || null;
  const fid = face ? (face.id || face.name) : null;
  const ties = arr(s.relationships).filter((t) => t.typeName === 'Outstanding Debt' && fid && (t.from === fid || t.to === fid || t.from === face.name || t.to === face.name));
  const byId = new Map(arr(s.npcs).map((n) => [n.id || n.name, n]));
  const seat = rulingChainOf(s).npc;
  out.push({
    seed, tier: s.tier, kinds: st.map((x) => x.type),
    creditorsByDesc: byDesc.map((f) => ({ name: f.faction || f.name, power: f.power, isGoverning: !!f.isGoverning, desc: String(f.desc).slice(0, 50) })),
    stakeReasonMarks: byStakeReason.map((k) => `${k.factionId}|${k.stake}|${k.reason}`),
    stakeRow, inCastRoles: arr(e.cast?.roles).filter((r) => r.id === fid || r.id === credName).map((r) => r.role),
    heads: heads.map((n) => ({ id: n.id, name: n.name, title: n.title, role: n.role, gender: n.gender, temporary: !!n.temporary, ousted: !!n.ousted })),
    members: members.length,
    faceIsSeat: !!(seat && face && (seat.id || seat.name) === fid),
    ties: ties.map((t) => {
      const other = byId.get(t.from === fid || t.from === face.name ? t.to : t.from);
      return { faceIs: (t.from === fid || t.from === face.name) ? 'from (debtor)' : 'to (creditor)', other: other ? { name: other.name, title: other.title, role: other.role, gender: other.gender, temporary: !!other.temporary, ousted: !!other.ousted } : `missing ${t.from}/${t.to}`, keys: Object.keys(t) };
    }),
    edited: !!e._userEdits,
  });
}
console.log(JSON.stringify(out, null, 1));
```

### `run.mjs`

```js
// FRAME-6 · P4A — every town of a pool: the stored record's digest, the composed crisis page's digest for every reader, and
// the P4a facts mirrored here (measured BEFORE any edit): the creditor power by the record's marker (the indebted entry's
// stored stake row whose power's `desc` opens with an indebted `opens` text of RAISED_BY_CRISIS), its face (rank 1 in that
// power), and the first Outstanding Debt tie touching the face (`from` is the debtor). Adapted from FRAME-5 · P1B's run.mjs.
// argv: worktree root, pool (crisis | natural | golden), output path.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const ROOT = process.argv[2].replace(/\/?$/, '/');
const POOL = process.argv[3];
const out = process.argv[4];
const { generateSettlementPipeline } = await import(ROOT + 'src/generators/generateSettlementPipeline.js');
const { STRESS_TYPE_MAP } = await import(ROOT + 'src/data/stressTypes.js');
const { composeCrisisPage } = await import(ROOT + 'src/domain/crisis/crisisPage.js');
const { RAISED_BY_CRISIS } = await import(ROOT + 'src/domain/crisis/crisisCast.js');
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const TIER_AT = (t) => TIERS.indexOf(t);
const digest = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 16);
const READERS = [
  ['none', []], ['undefined', [undefined]], ['null', [null]], ['{}', [{}]], ['audience:undefined', [{ audience: undefined }]],
  ['owner', [{ audience: 'owner' }]], ['player', [{ audience: 'player' }]], ['gallery', [{ audience: 'gallery' }]],
  ['bogus', [{ audience: 'Owner' }]], ['string', ['owner']],
];
const str = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');
const arr = (v) => (Array.isArray(v) ? v : []);
const entriesOf = (s) => (Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : [])).filter(Boolean);
const OPENS = RAISED_BY_CRISIS.filter(([k, , , how]) => k === 'indebted' && how === 'opens');
function creditorFacts(s) {
  const e = entriesOf(s).find((x) => x.type === 'indebted');
  if (!e) return null;
  const powers = arr(s.powerStructure?.factions);
  for (const k of arr(e.cast?.stakes)) {
    const f = powers.find((p) => str(p.faction || p.name) === k.factionId);
    const row = f && OPENS.find(([, text]) => String(f.desc || '').startsWith(text));
    if (!row) continue;
    const face = arr(s.npcs).find((n) => n && arr(n.memberships).some((m) => m?.power === k.factionId && m?.rank === 1) && str(n.name));
    const fid = face ? (str(face.id) || str(face.name)) : '';
    const byId = new Map(arr(s.npcs).filter(Boolean).map((n) => [str(n.id) || str(n.name), n]));
    const t = face ? arr(s.relationships).find((r) => str(r?.typeName) === 'Outstanding Debt' && (str(r.from) === fid || str(r.to) === fid) && str(byId.get(str(r.from) === fid ? str(r.to) : str(r.from))?.name)) : null;
    const other = t ? byId.get(str(t.from) === fid ? str(t.to) : str(t.from)) : null;
    return {
      power: k.factionId, marker: row[2], face: face ? { name: str(face.name), title: str(face.title), gender: str(face.gender).toLowerCase() } : null,
      tie: t ? { faceOwes: str(t.from) === fid, other: { name: str(other.name), title: str(other.title), gender: str(other.gender).toLowerCase() } } : null,
    };
  }
  return { power: null };
}
function seeds() {
  const list = [];
  if (POOL === 'crisis') {
    for (const kind of Object.keys(STRESS_TYPE_MAP)) {
      const gate = STRESS_TYPE_MAP[kind].requiresTier;
      const tiers = TIERS.filter((t) => !gate || TIER_AT(t) >= TIER_AT(gate));
      const per = Math.ceil(24 / tiers.length);
      for (const tier of tiers) for (let i = 0; i < per; i++) list.push({ seed: `b7-${kind}-${tier}-${i}`, cfg: { settType: tier, stressType: kind } });
    }
  } else if (POOL === 'natural') {
    for (const tier of TIERS) for (let i = 0; i < 60; i++) list.push({ seed: `b7-natural-${tier}-${i}`, cfg: { settType: tier } });
  } else if (POOL === 'crown') {
    for (const tier of ['village', 'town', 'city', 'metropolis']) for (let i = 0; i < 50; i++) list.push({ seed: `p4a-crown-${tier}-${i}`, cfg: { settType: tier, stressType: 'indebted' } });
  } else {
    return null;
  }
  return list;
}
let list = seeds();
if (!list) {
  const { manifestRows } = await import(ROOT + 'scripts/lib/golden-corpus-key.mjs');
  const rows = manifestRows(JSON.parse(fs.readFileSync(ROOT + 'tests/fixtures/generator-golden-master.json', 'utf8')));
  list = rows.map((config, at) => { const { _seed, ...cfg } = config; return { seed: _seed, cfg, at }; });
}
const rows = [];
for (const { seed, cfg, at } of list) {
  const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
  const st = entriesOf(s);
  const pages = Object.fromEntries(READERS.map(([k, args]) => [k, composeCrisisPage(s, ...args)]));
  const owner = pages.owner;
  rows.push({
    pool: POOL, seed, at: at ?? null, tier: cfg.settType || s.tier, kind: st.map((e) => e.type).join('+') || 'calm',
    stored: digest(s), sections: owner.length,
    page: Object.fromEntries(Object.entries(pages).map(([k, v]) => [k, digest(v)])),
    // the owner's page with any `creditor` key cut: what must equal today's page
    ownerCut: digest(owner.map((x) => { const { creditor, ...rest } = x; return rest; })),
    ownerCreditor: owner.map((x) => x.creditor).filter((v) => v !== undefined),
    tier2: s.tier,
    facts: creditorFacts(s),
  });
}
fs.writeFileSync(out, JSON.stringify(rows));
const d = rows.filter((r) => r.facts);
console.log(JSON.stringify({ pool: POOL, towns: rows.length, indebted: d.length, creditor: d.filter((r) => r.facts.power).length, face: d.filter((r) => r.facts.face).length, tie: d.filter((r) => r.facts.tie).length, everyReaderSame: rows.filter((r) => new Set(Object.values(r.page)).size === 1).length }));
```

### `compare.mjs`

```js
// FRAME-6 · P4A — base vs tip, one pool: the stored record; every stranger's composed crisis page against the BASE page with
// no options (today's page); the owner's page against the BASE owner's page (which already carries P1B's clause), except
// where measure 3 predicts the creditor line: there the tip owner's page less the `creditor` key must equal today's page,
// and the line must be the one predicted from the base's facts (written here independently). argv: base.json tip.json
import fs from 'node:fs';
const [a, b] = process.argv.slice(2).map((p) => JSON.parse(fs.readFileSync(p, 'utf8')));
const key = (r) => `${r.seed}|${r.at}|${r.tier}`;
const byB = new Map(b.map((r) => [key(r), r]));
const NOUN = { thorp: 'thorp', hamlet: 'hamlet', village: 'village', town: 'town', city: 'city', metropolis: 'metropolis' };
function predicted(r) {
  const f = r.facts;
  if (!f || f.marker !== 'creditorAgent' || !f.face || !f.face.title) return null;
  let tie = '';
  if (f.tie) {
    const o = f.tie.other;
    const other = o.title ? `${o.title} ${o.name}` : o.name;
    const g = f.face.gender;
    const pro = g === 'female' ? (f.tie.faceOwes ? 'she' : 'her') : g === 'male' ? (f.tie.faceOwes ? 'he' : 'him') : '';
    const again = pro && o.gender !== g ? pro : f.face.title;
    tie = f.tie.faceOwes ? `, and ${again} owes ${other} besides` : `, and ${other} owes ${again} besides`;
  }
  return `The ${NOUN[r.tier2]} owes an outside lender, never named; ${f.face.name}, ${f.face.title}, speaks for them${tie}.`;
}
let stored = 0, storedSame = 0, strangerPages = 0, strangerSame = 0, ownerSame = 0, ownerExpected = 0, ownerMoved = 0;
const bad = []; const lines = [];
for (const r of a) {
  const t = byB.get(key(r));
  if (!t) { bad.push([key(r), 'missing']); continue; }
  stored++; if (t.stored === r.stored) storedSame++; else bad.push([key(r), 'stored moved']);
  for (const k of Object.keys(r.page)) {
    if (k === 'owner') continue;
    strangerPages++; if (t.page[k] === r.page.none) strangerSame++; else bad.push([key(r), `${k} moved`]);
  }
  const line = predicted(r);
  if (line) {
    ownerExpected++;
    if (t.ownerCut === r.page.none && JSON.stringify(t.ownerCreditor) === JSON.stringify([line]) && r.ownerCreditor.length === 0) { ownerMoved++; lines.push([r.seed, line]); }
    else bad.push([key(r), 'owner line wrong', t.ownerCreditor, line, t.ownerCut === r.page.none]);
  } else if (t.page.owner === r.page.owner && t.ownerCreditor.length === 0) ownerSame++;
  else bad.push([key(r), 'owner moved unexpectedly', t.ownerCreditor]);
}
console.log(JSON.stringify({ towns: a.length, stored, storedSame, strangerPages, strangerSame, ownerSame, ownerExpected, ownerMoved, bad: bad.length, badRows: bad.slice(0, 10), sample: lines.slice(0, 40) }, null, 1));
```
