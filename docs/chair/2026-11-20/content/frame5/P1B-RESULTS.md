# FRAME-5 · P1B — the infiltration's outside hand, reached (render only, owner only): results

Builder P1B of FRAME-5, in the worktree `wt-p1b` on branch `frame5-p1b`, cut at `8991b83b2` (U0 and C1 merged), from the
brief `docs/chair/2026-11-20/content/frame4/FRAME4-BRIEFS-U0-P1B-P4A.md` (the common section and "U1 = P1b"), B7 §P1b
(`docs/chair/2026-11-20/content/frame2/B7-CF10-PROPOSAL-RESULTS.md`) and the chair's rulings in my prompt (owner only,
behind U0's argument; the hand never named; the infiltrator power's face not used). Measured and built 2026-11-20
12:10–12:40 UTC (`date -u`). Every run is a file under the scratchpad folder `P1B/`; gates were read through
`sh scripts/gate-tail.sh` or a file and its own exit code, never a pipe.

## Measure first (taken before any edit to `src/`; nothing refuted the section)

1. **Where the absent instigator's line is composed and rendered.** Composed ONCE: `src/domain/crisis/crisisPage.js ::
   composeCrisisPage`, each section's `absent` rows (`{ role, roleLabel, reason }`, the reason through the tier-noun
   `speak`). Rendered by ONE surface: `src/components/new/tabs/CrisisTab.jsx` (`data-testid="crisis-cast-absent"`,
   `{roleLabel}: {reason}`, and only where `!section.edited`). The PDF chapter (`src/pdf/sections/CrisisSections.jsx`,
   with `src/pdf/lib/crisisPrint.js`) and the Foundry journal (`src/foundry/journalPages.js :: crisisJournalPage`) print
   the cast rows, stakes and levers but NO absence row; the session sheet (`tonightSheet.js`) and the crisis hooks
   (`crisisHooks.js`) read the stored cast's roles, never `absent`; no other reader of `cast.absent` exists in `src/`
   (grep of `.absent`, `CAST_ABSENCES`, `outsideHand`). So the line is built once, in the composition, by adding the
   clause to the absence row's `reason`: **no renderer changes**, and today the words reach the Crisis tab only.
2. **Who sees a crisis page's absence rows today** (for the security reader; as U0 measured, re-read at `8991b83b2`):
   the owner's own surfaces (the live editor and the owner's saved view) mount the Crisis tab with `audience 'owner'`
   (`OutputContainer.jsx` line 715). The gallery page (default and DM content shared) and the party link (Reveal DM off
   and on) mount NO Crisis tab (`hasCrisisTab = !playerView && !publicDossier && …`, line 534, the security lane's gate,
   untouched), so no crisis page, and no absence row, is composed there for anyone. The PDF and Foundry exports pass
   `'owner'` and print no absence row. By the chair's ruling the words are drawn for `'owner'` only.
3. **The reach** (`run.mjs` below at the base; B7's `gen.mjs` and `goldens.mjs` extracted verbatim, pointed at this
   worktree, for the seeds and rows):
   - **B7's pool** (360 forced towns, 24 a kind): infiltrated towns with the instigator absent as "an outside hand,
     unnamed": **14 of 24**; of those, with a free lodging keeper by the standing trouble's rule: **5 of 14** (B7
     measured 5 of 14; B7's own `lodger` form gives the same 5): `b7-infiltrated-hamlet-1`, `-town-0`, `-town-1`,
     `-town-2`, `-town-3`. The nine others are the four thorps, three hamlets and two villages, with no lodging house.
   - **The 525-row golden master**: 480 infiltrated rows; **288** with the absence (B7: 288); of those **120** would
     show the new words (thorp 0 of 72, hamlet 12 of 72, village 12 of 48, town 96 of 96). B7's narrower `lodger` form
     (a `house`-kind institution and title/role/key only) gives 108: the 12 "Ale house" keepers are found by the rule's
     own `family` word, which troubleCast's `tradeWordsOf` reads and B7's form does not. The brief binds troubleCast's
     rule, so 120.
   - **The natural pool** (B7's `natural.mjs` seeds, 60 a tier, 360 births): 2 absences with the hand, 1 with a keeper
     (`b7-natural-town-42`).
4. **A DM-edited cast** (`section.edited`): `crisisCast.js :: effectiveCastOf` returns `absent: []` for an edited
   cast, and the tab prints absence rows only where `!section.edited`; the clause rides the absence row, so it follows
   the edit state exactly (pinned: `crisisOutsideHand.test.js`, "a DM-edited cast shows no absence row").

## What was built (one file of `src/`)

`src/domain/crisis/crisisPage.js`:
- `CRISIS_ABSENCE_REACH` (exported, frozen): the closed set, ONE sentence,
  `'{keeper} keeps the {house} where its people come and go'` (the brief's example's words).
- `lodgingKeeperOf(s)` (private): the standing trouble's outsider rule (`troubleCast.js :: castTroubleFrame`, the
  `outsider` rung): the live roster (no temporary person, nobody ousted, no office stand-in), nobody an active crisis's
  stored cast holds (troubleCast's `crisisHeld`), strongest first then roster order, the first whose role, title or
  house (key, family) passes `LODGING_HOUSE` (imported from `tension/sideArchetypes.js`, the one copy) and whose house
  the record names; the house in the record's own wording (its key less a trailing parenthesis, lower case). Rate 1,
  no hash, no new number. Written here, not imported: the veil test's walker "one door: only the sheet's composer
  imports the trouble cast" forbids importing `troubleCast.js`, and its helpers are private (`src/domain/tension/` is
  the CF12 builder's; not edited).
- In `composeCrisisPage`: `reachOf(a)` adds `; <the sentence filled>` to an absence row's reason ONLY where
  `forOwner` (U0's `crisisPageForOwner`), the role is `instigator`, the stored reason is exactly
  `CAST_ABSENCES.outsideHand`, and a keeper stands; else `''`. The keeper is read once a page, lazily. The stored
  reason stays first and unchanged; nothing is stored.

**The line, before and after (the owner's Crisis tab):**
- `b7-infiltrated-hamlet-1`: "instigator: an outside hand, unnamed" → "instigator: an outside hand, unnamed; Chae Yang
  keeps the alehouse where its people come and go"
- `b7-infiltrated-town-0`: "instigator: an outside hand, unnamed" → "instigator: an outside hand, unnamed; Peppo
  Schubert keeps the taverns where its people come and go"
- `b7-infiltrated-town-1`: "…; Pitao Ucan keeps the inn where its people come and go"
- `b7-infiltrated-thorp-0` (no lodging house): unchanged.
- The golden's 120 lines use three houses: inn 96, caravanserai 12, ale house 12.

## (a) Byte-identity (`run.mjs` at the base, before the edit, and at the tip; `compare.mjs`)

Every town's STORED record digested, and its composed crisis page digested for ten readers (no argument, `undefined`,
`null`, `{}`, `{ audience: undefined }`, `'owner'`, `'player'`, `'gallery'`, `'Owner'`, the bare string `'owner'`);
every tip page compared with the BASE page composed with no options (today's page).

| pool | towns | stored identical | pages compared | non-owner pages identical | owner pages that moved (predicted by measure 3) | unexpected |
|---|---|---|---|---|---|---|
| B7's crisis pool (15 kinds) | 360 | 360 | 3,600 | 3,240 of 3,240 | 5 of 5 (owner identical in the other 355) | 0 |
| natural pool (calm and natural crises) | 360 | 360 | 3,600 | 3,240 of 3,240 | 1 of 1 (owner identical in the other 359) | 0 |
| 525-row golden master | 525 | 525 | 5,250 | 4,725 of 4,725 | 120 of 120 (owner identical in the other 405) | 0 |

- **Stored**: 1,245 of 1,245 identical (no file under `src/generators/` changes; no generator imports `crisisPage.js`).
- **Composed, every reader who is not the owner**: 11,205 of 11,205 identical to today's page.
- **The owner's page**: identical in 1,119 towns (every town of every other kind, every infiltrated town with no
  keeper or no such absence, every calm town); it differs in exactly the 126 towns measure 3 named, each by exactly the
  clause on the instigator's absence row (every other absence row identical; `compare.mjs` checks both).

## (b) Red first, then green

- **RED** (`red.txt`: the new arms with `crisisPage.js` at the base, my copy set aside and restored after, `-t P1B`):
  `Test Files 2 failed (2)`, `Tests 4 failed | 5 passed | 7 skipped (16)`. Failing titles:
  - `crisisOutsideHand.test.js > … > the closed set: one fixed sentence, frozen, …` (`CRISIS_ABSENCE_REACH` undefined);
  - `… > the owner's page gains the words on B7's drafted towns (3); the stored absence stays` (3 of 3 towns: the
    owner's line was "an outside hand, unnamed");
  - `… > the keeper is FREE: …` (no keeper named);
  - `frameShareVeil.test.jsx > P1B: the outside hand's keeper is drawn for the owner only > the owner's Crisis tab
    reaches the hand; no shared page and no other reader does (2 born towns)` (2 of 2: the owner's line).
  - Green at the base, as designed (the strangers' side): "a reader who is not the owner gets today's page byte for
    byte", "where no lodging keeper stands…", "every other kind, and a calm town…", "the hand itself is never named…",
    "a DM-edited cast…"; and inside the veil arm every shared-page and stranger assertion (it failed only at the
    owner's line).
- **GREEN** (`green-new.txt`): `Test Files 2 passed (2)`, `Tests 9 passed | 7 skipped (16)`.

## Gates

- `tests/domain/crisis` whole + `tests/domain/tension` whole + `tests/security/frameShareVeil.test.jsx`
  (`gate-lane2.txt`): `Test Files 28 passed (28)`, `Tests 217 passed (217)`. (The first run, `gate-lane.txt`, was red
  on the one pin below, before its amendment.)
- Every other test file that imports `crisisPage.js`, `crisisCast.js`, `CrisisTab`, `CrisisSections` or
  `journalPages`, plus the lint walkers whose registers name `src/domain/crisis` (style law, domain-any, presumed
  things, presumption classes, fact layers, ruin filter, status unions, the lighting census) (`gate-importers.txt`,
  79 files): `Tests 1 failed | 835 passed | 1 expected fail (837)`.
  - **The one red is mine and is left for the integrator's door**:
    `tests/lint/sovereigntyLightingContract.walker.test.js > the sovereignty lighting condition — a marker is EVIDENCE
    only in a live title > THE CENSUS IS AN ASSERTION, NOT A SENTENCE — every stated figure is executed`: "the
    estate's file count moved — re-measure, do not re-word: expected 3715 to be 3714". My new test file is the 3715th.
    `tests/lint/.lighting-census-baseline.json` is outside my manifest and is re-taken by its door at the merges (as
    `8991b83b2` did for U0 and C1; CF12 moves it too).
- `npm run typecheck:ratchet`: 167 errors, ceiling 167 (OK). `npm run typecheck:domain:strict`: 1113, ceiling 1113 (OK).
  `npm run lint`: 0 errors (38 warnings, none in a touched file: `eslint` on the four touched code files prints
  nothing).

### The 79 importer and walker files (JSON reporter)

- `tests/components/bar3ServicesRows.test.jsx`: 8 passed, 0 failed
- `tests/components/crisisTab.test.jsx`: 7 passed, 0 failed
- `tests/components/houseLabelEverySurface.test.jsx`: 5 passed, 0 failed
- `tests/components/phoneChromeFloor.census.test.js`: 9 passed, 0 failed
- `tests/components/tailCrisisK26.test.jsx`: 1 passed, 0 failed
- `tests/components/tensionSeverityOneWord.test.jsx`: 16 passed, 0 failed
- `tests/components/tonightSeatSecret.test.jsx`: 3 passed, 0 failed
- `tests/components/tonightSheetOnce.test.jsx`: 4 passed, 0 failed
- `tests/copy/voiceMechanics.test.js`: 30 passed, 0 failed
- `tests/data/w2FixData12Rows.test.js`: 5 passed, 0 failed
- `tests/domain/crisisCast.test.js`: 31 passed, 0 failed
- `tests/domain/crisisCastDefenceHome.test.js`: 5 passed, 0 failed
- `tests/domain/crisisCastEdit.test.js`: 6 passed, 0 failed
- `tests/domain/crisisCastFindings.test.js`: 5 passed, 0 failed
- `tests/domain/crisisCastReaderRows.test.js`: 7 passed, 0 failed
- `tests/domain/crisisCastSeatAndAccess.test.js`: 7 passed, 0 failed
- `tests/domain/crisisHooks.test.js`: 24 passed, 0 failed
- `tests/domain/crisisLeverNotBrunt.test.js`: 1 passed, 0 failed
- `tests/domain/crisisPage.test.js`: 9 passed, 0 failed
- `tests/domain/crisisPageTierNoun.test.js`: 3 passed, 0 failed
- `tests/domain/crisisStandInWords.test.js`: 5 passed, 0 failed
- `tests/domain/deityTemperConsumerCensus.walker.test.js`: 24 passed, 0 failed
- `tests/domain/dmEditKeysFollowRename.test.js`: 10 passed, 0 failed
- `tests/domain/facts/census2dTables.test.js`: 11 passed, 0 failed
- `tests/domain/facts/crisisKind.test.js`: 6 passed, 0 failed
- `tests/domain/frame2NamesRule.test.js`: 15 passed, 0 failed
- `tests/domain/npc/characterDrift.test.js`: 45 passed, 0 failed
- `tests/domain/people/dualHatReaders.test.js`: 5 passed, 0 failed
- `tests/domain/tailCrisisBatch4.test.js`: 2 passed, 0 failed
- `tests/domain/tailCrisisBatch7.test.js`: 5 passed, 0 failed
- `tests/domain/tailCrisisBatch8.test.js`: 58 passed, 0 failed
- `tests/domain/tonightSheetCast.test.js`: 4 passed, 0 failed
- `tests/foundry/foundryFaithGate.test.js`: 10 passed, 0 failed
- `tests/foundry/foundryManifest.test.js`: 15 passed, 0 failed
- `tests/foundry/journalChainStateIsTheCards.test.js`: 3 passed, 0 failed
- `tests/foundry/journalForcesNoProvenance.test.js`: 1 passed, 0 failed
- `tests/foundry/journalMarksCrisisRows.test.js`: 16 passed, 0 failed
- `tests/foundry/journalPrintsTheTabsLeaf.test.js`: 6 passed, 0 failed
- `tests/foundry/markdownEscapeSingleWriter.test.js`: 9 passed, 0 failed
- `tests/generators/bar2Places2Rows.test.js`: 5 passed, 0 failed
- `tests/generators/bar4HousesPresumptions.test.js`: 6 passed, 0 failed
- `tests/generators/defenceTwinLines.test.js`: 7 passed, 0 failed
- `tests/generators/foodwaysOneLine.test.jsx`: 6 passed, 0 failed
- `tests/generators/foundryExportsFishTrade.test.js`: 7 passed, 0 failed
- `tests/generators/people/castDerived.test.js`: 6 passed, 0 failed
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
- `tests/lint/sovereigntyLightingContract.walker.test.js`: 33 passed, 1 failed
- `tests/lint/statusUnionTotality.walker.test.js`: 4 passed, 0 failed
- `tests/lint/styleLaw.walker.test.js`: 20 passed, 0 failed
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
## (c) The fixtures and the pins

- `tests/fixtures/`: no file names `outside hand`, `outsideHand`, `crisisPage` or `composeCrisisPage`; the generator
  golden master stores records, which are byte-identical (above). Re-recorded: **nothing**.
- Tests naming the hand (`outside hand` / `outsideHand`): `tests/domain/crisisCast.test.js`,
  `tests/generators/resolveCrisisCast.test.js` (the stored reason, unchanged, green), `tests/lint/presumedThings
  .widened.register.json` (an unrelated history line), the veil test and my test.
- **ONE PIN MOVES**, by design: `tests/domain/crisis/crisisPageAudience.test.js > U0: the crisis page is composed for an
  explicit reader > the seam changes no page: every reader gets today's page, on every crisis kind and on the calm pool`.
  Its owner arm held the owner's page equal to today's (true only while the seam drew nothing); it reds on
  `b7-infiltrated-town-0` (`{ audience: 'owner' }`). Amended minimally: every stranger arm is unchanged; the owner arm
  now holds the owner's page equal to today's with the one owner-only clause cut (`withoutOwnerReach`, which cuts only
  an instigator row reading `an outside hand, unnamed; …`).
- The veil test: one new `describe('P1B: …')` block appended at the END of the file; nothing above it touched.

## (d) For the security reader

- **New line**: on the OWNER's crisis page only, the infiltration's absent instigator row reads "an outside hand,
  unnamed; {keeper} keeps the {house} where its people come and go". It names a roster PERSON (a lodging keeper, a
  public person of the record) and the record's own house word; it never names the infiltrating power, its members or
  its face, nor any outsider. Composed in `crisisPage.js :: composeCrisisPage` (`reachOf`, `CRISIS_ABSENCE_REACH`);
  nothing is stored, so no shared read (gallery, DM-full gallery, party link, import, world export) can carry it.
- **Who could meet it**: only a caller of `composeCrisisPage` with `{ audience: 'owner' }`: the Crisis tab mounted on
  the owner's live editor or saved view, and the PDF chapter and the Foundry journal (which print no absence row, so
  not there today). The gallery page and the party link (Reveal DM off and on) mount no Crisis tab; every non-owner
  reader composes today's page (pinned in the veil test's P1B block on the shared records and on the owner's own).
- **The lock is the audience alone**: unlike the trouble frame (CF3), the keeper needs no `_seed` (rate 1, no hash), so a
  shared record composed with `'owner'` WOULD draw it. I added no second lock (not asked; it would change no owner's
  page). What I would test, theirs to own: that `hasCrisisTab` stays false on `publicDossier` and `playerView`; that no
  shared surface ever passes `'owner'` to `composeCrisisPage`; that the PDF and Foundry exports stay off every shared
  surface; and, if the PDF or the journal ever print absence rows, that they remain owner-only exports.

## Judgment calls (each vetoable)

- The sentence is the brief's example, "{keeper} keeps the {house} where its people come and go" ("its" is the hand).
  Against CF9 ("it says no more than the record holds") the standing trouble's own outsider words ("where strangers
  lodge, and would know of them") are the more modest alternative; one string in `CRISIS_ABSENCE_REACH` to change.
- The house word is the record's (troubleCast's `houseOf`): "Taverns (5-20)" prints "the taverns", "Ale house" "the ale
  house". "keeps the taverns" reads a little oddly; it is how the standing trouble's frame already prints the same key.
- The "free" test is troubleCast's: nobody ANY active crisis's stored cast holds (B7's form read only this crisis's).
- The clause is joined to the stored reason with "; " in the row's `reason`, so the one renderer prints it unchanged.

## The scripts (run from the scratchpad folder `P1B/`: `node run.mjs <worktree> <pool> base-<pool>.json` for `crisis`, `natural`, `golden` before the edit, the same to `tip-<pool>.json` after, then `node compare.mjs base-<pool>.json tip-<pool>.json`; B7's `gen.mjs` and `goldens.mjs` are extracted verbatim from B7's results with the root pointed at the worktree)

### `run.mjs`

```js
// FRAME-5 · P1B — every town of a pool: the stored record's digest, the composed crisis page's digest for every reader,
// and the P1b facts (the instigator absent with "an outside hand", the free lodging keeper by the standing trouble's
// outsider rule, mirrored here so it is measured BEFORE any edit; and B7's own reach.mjs form beside it).
// argv: worktree root, pool (crisis | natural | golden), output path.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const ROOT = process.argv[2].replace(/\/?$/, '/');
const POOL = process.argv[3];
const out = process.argv[4];
const { generateSettlementPipeline } = await import(ROOT + 'src/generators/generateSettlementPipeline.js');
const { STRESS_TYPE_MAP } = await import(ROOT + 'src/data/stressTypes.js');
const { composeCrisisPage } = await import(ROOT + 'src/domain/crisis/crisisPage.js');
const { CAST_ABSENCES } = await import(ROOT + 'src/domain/crisis/crisisCast.js');
const { LODGING_HOUSE } = await import(ROOT + 'src/domain/tension/sideArchetypes.js');
const { isOfficeStandIn } = await import(ROOT + 'src/domain/dossier/seatHolder.js');
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
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const idOf = (n) => str(n.id) || str(n.name);
const entriesOf = (s) => (Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : [])).filter(Boolean);
// troubleCast.js's own outsider rule, mirrored: the live roster, nobody a crisis cast holds, strongest first, a keeper
// whose trade words name a lodging house and whose house the record names.
const tradeWordsOf = (n) => { const i = n.institution && typeof n.institution === 'object' ? n.institution : {}; return [str(n.role), str(n.title), str(i.key), str(i.family)].join(' | '); };
const houseOf = (n) => { const i = n.institution && typeof n.institution === 'object' ? n.institution : {}; return str(i.key).replace(/\s*\([^)]*\)\s*$/, '').toLowerCase(); };
function keeperOf(s) {
  const held = new Set(entriesOf(s).flatMap((e) => arr(e?.cast?.roles)).filter((r) => r?.kind === 'npc').map((r) => str(r.id)));
  const roster = arr(s.npcs).filter((n) => !!n && typeof n === 'object' && !n.temporary && !n.ousted && !!str(n.name) && !isOfficeStandIn(n));
  const strongest = roster.map((n, i) => ({ n, i })).sort((a, b) => (num(b.n.power) - num(a.n.power)) || (a.i - b.i)).map(({ n }) => n);
  const k = strongest.find((n) => !held.has(idOf(n)) && LODGING_HOUSE.test(tradeWordsOf(n)) && houseOf(n));
  return k ? { name: str(k.name), house: houseOf(k), key: str(k.institution?.key), kind: k.institution?.kind || null, power: num(k.power) } : null;
}
// B7's reach.mjs `lodger`, verbatim in substance (title, role, house key; a house; this crisis's cast only)
function b7LodgerOf(s, e) {
  const held = new Set(arr(e?.cast?.roles).filter((r) => r.kind === 'npc').map((r) => r.id));
  const free = arr(s.npcs).filter((n) => !n.temporary && !isOfficeStandIn(n) && !held.has(n.id || n.name));
  const words = (n) => `${n.title} ${n.role} ${n.institution?.key || ''}`;
  const k = [...free].sort((a, b) => (b.power || 0) - (a.power || 0)).find((n) => LODGING_HOUSE.test(words(n)) && n.institution?.kind === 'house');
  return k ? str(k.name) : null;
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
  const page = Object.fromEntries(READERS.map(([k, args]) => [k, digest(composeCrisisPage(s, ...args))]));
  const owner = composeCrisisPage(s, { audience: 'owner' });
  const hand = st.some((e) => arr(e?.cast?.absent).some((a) => a.role === 'instigator' && a.reason === CAST_ABSENCES.outsideHand));
  const infil = st.find((e) => e.type === 'infiltrated');
  rows.push({
    pool: POOL, seed, at: at ?? null, tier: cfg.settType || s.tier, kind: st.map((e) => e.type).join('+') || 'calm',
    stored: digest(s), sections: owner.length, page,
    hand, keeper: hand ? keeperOf(s) : null, b7lodger: hand && infil ? b7LodgerOf(s, infil) : null,
    ownerAbsent: owner.flatMap((x) => x.absent.filter((a) => a.role === 'instigator').map((a) => `${x.type}: ${a.reason}`)),
  });
}
fs.writeFileSync(out, JSON.stringify(rows));
const h = rows.filter((r) => r.hand);
console.log(JSON.stringify({ pool: POOL, towns: rows.length, hand: h.length, keeper: h.filter((r) => r.keeper).length, b7lodger: h.filter((r) => r.b7lodger).length, everyReaderSame: rows.filter((r) => new Set(Object.values(r.page)).size === 1).length }));
```

### `compare.mjs`

```js
// FRAME-5 · P1B — base vs tip, one pool: the stored record; every reader's composed crisis page against the BASE page
// with no options (today's page); the owner's page differs ONLY where measure 3 says the words fall. argv: base.json tip.json
import fs from 'node:fs';
const [a, b] = process.argv.slice(2).map((p) => JSON.parse(fs.readFileSync(p, 'utf8')));
const key = (r) => `${r.seed}|${r.at}|${r.tier}`;
const byB = new Map(b.map((r) => [key(r), r]));
let stored = 0, storedSame = 0, pages = 0, same = 0, ownerMoved = 0, ownerExpected = 0, strangerPages = 0, strangerSame = 0;
const bad = [];
for (const r of a) {
  const t = byB.get(key(r));
  if (!t) { bad.push([key(r), 'missing']); continue; }
  stored++; if (t.stored === r.stored) storedSame++; else bad.push([key(r), 'stored moved']);
  const expectWords = r.hand && !!r.keeper;
  if (expectWords) ownerExpected++;
  for (const k of Object.keys(r.page)) {
    pages++;
    const ok = t.page[k] === r.page.none;
    if (k === 'owner') {
      if (expectWords) {
        const line = `infiltrated: an outside hand, unnamed; ${r.keeper.name} keeps the ${r.keeper.house} where its people come and go`;
        if (!ok && t.ownerAbsent.includes(line) && !r.ownerAbsent.includes(line)) ownerMoved++; else bad.push([key(r), 'owner words wrong', t.ownerAbsent]);
        // the owner's page differs from today's only by the clause: every other absent line the same
        const rest = (x) => x.ownerAbsent.map((l) => l.split('; ')[0]);
        if (JSON.stringify(rest(t)) !== JSON.stringify(rest(r))) bad.push([key(r), 'owner absent rows moved']);
        continue;
      }
      if (ok) same++; else bad.push([key(r), 'owner moved unexpectedly']);
    } else {
      strangerPages++; if (ok) { same++; strangerSame++; } else bad.push([key(r), `${k} moved`]);
    }
  }
}
console.log(JSON.stringify({ towns: a.length, stored, storedSame, pages, identical: same, ownerExpected, ownerMoved, strangerPages, strangerSame, bad: bad.length, badRows: bad.slice(0, 10) }));
```
