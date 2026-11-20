# FRAME-4 · U0 — the crisis page's explicit audience argument: results

Builder U0 of FRAME-4, in the worktree `wt-u0` on branch `frame4-u0`, cut at the lane tip `be9032b02`, from the brief
`docs/chair/2026-11-20/content/frame4/FRAME4-BRIEFS-U0-P1B-P4A.md` (the common section and U0). Measured and built
2026-11-20 10:40–11:20 UTC (`date -u`). Every run is a file under the scratchpad folder `U0-CRISIS-AUDIENCE/`; gates were
read through `sh scripts/gate-tail.sh`, never a pipe.

## Measure first (what could have refuted the section)

1. **The production calls of `composeCrisisPage`** (the walker of this unit, run red at the base): three, none with a
   second argument: `src/components/new/tabs/CrisisTab.jsx` (`composeCrisisPage(settlement)`),
   `src/foundry/journalPages.js :: crisisJournalPage`, `src/pdf/sections/CrisisSections.jsx`. As the brief measured.
2. **`TONIGHT_AUDIENCES` crosses no layer and makes no cycle.** `crisisPage.js` already imports
   `composeTonightSheet` from `../summary/tonightSheet.js`; the new import is a second name from the SAME module, so no
   new edge exists; `tonightSheet.js` imports `crisisCast.js`, `crisisHooks.js`, `crisisSummaryVantage.js`, never
   `crisisPage.js`. The PDF and journal files already import `tonightSheet.js` (`TonightAtTheTable.jsx`,
   `journalPages.js :: tonightPage`).
3. **The Crisis tab's mount** is ONE line of `src/components/OutputContainer.jsx` (`case 'crisis'`, the `renderTab`
   switch). The file is not a security-lane file (that lane's files are `supabase/`, `src/domain/veil/`,
   `tests/security/`, `gallery*.js`, `publicSafe.js`); FRAME-2 · B3 added its one prop to the Table View's mount in the
   same file the same way. Reaching it moves no gate and adds none: the prop is added to the mount as it stands, with
   the Table View's own audience expression (`!publicDossier && !playerView ? 'owner' : playerView ? 'player' :
   'gallery'`).
4. **A MISMATCH WITH THE BRIEF'S TEST DESIGN, measured, not built around:** the gallery page and the party link do
   NOT mount the Crisis tab today. `OutputContainer.jsx` registers it only under
   `hasCrisisTab = !playerView && !publicDossier && …` (line 534, the security lane's gate, untouched), and both shared
   pages render `OutputContainer readOnly` with no `saveId` (`publicDossier` true; the party link also `playerView`
   true, Reveal DM forced off by `PartyLinkView`). So no crisis page is composed on a shared page for any reader; the
   brief's "render the Crisis tab with a non-owner audience" there cannot be observed without moving that gate. The
   test therefore asserts what is true and what would fail closed: on every shared page the shared record still holds
   the crisis, no Crisis tab is offered, none is mounted, and any mount would carry a reader who is not the owner; the
   owner's two surfaces mount it with `'owner'` (the red side). This does not refute the seam: it is why the shared
   pages' side is green at the base.
5. **Who builds the PDF and the Foundry journal:** `generateSettlementPDF` is called from the library card
   (`SettlementCard.jsx`), the owner's saved view (`SettlementDetail.jsx`, which also builds the Foundry module), the
   draft export (`ExportDraftButton.jsx`) and the purchase's success page (`SingleDossierSuccessPage.jsx`, the buyer's
   own generated dossier); `buildJournalPages` only from `moduleBuilder.js` under `generateFoundryModule`
   (`SettlementDetail.jsx`). No gallery or party-link surface builds either, and `PDF_VARIANTS` holds the DM's four
   (pinned in the veil test). Both are the owner's own record: `'owner'`.

## What was built

- `src/domain/crisis/crisisPage.js`: `composeCrisisPage(settlement, options)`; `crisisPageForOwner(options)` (exported):
  true ONLY for `options.audience === TONIGHT_AUDIENCES.owner` (the sheet's closed set, imported, no second set); any
  other value, a missing `audience`, `{}`, `null`, a string, no argument: false (fail closed). Inside, `forOwner` is
  computed once (the seam P1b and P4a draw behind) and the sheet's facts the page reads are composed for the same
  reader (the sheet fails closed too; its facts do not depend on the reader). No line added.
- `src/components/new/tabs/CrisisTab.jsx`: takes `audience` and composes `{ audience }`; with no prop, a non-owner.
- `src/components/OutputContainer.jsx`: the one prop on the Crisis tab's mount (above). Nothing else in the file.
- `src/pdf/sections/CrisisSections.jsx`, `src/foundry/journalPages.js :: crisisJournalPage`: `{ audience: 'owner' }`
  through `TONIGHT_AUDIENCES.owner`.

## (a) Byte-identity (composed pages; nothing stored changes: no file under `src/generators/` is touched)

`scripts/pages.mjs` (B7's `gen.mjs` birth, forced `stressType`, B7's seeds `b7-<kind>-<tier>-<i>`, six a kind, the tier
gate honoured; B7's `natural.mjs` seeds `b7-natural-<tier>-<i>`, ten a tier) composes every town's page for ten
readers (no argument, `undefined`, `null`, `{}`, `{ audience: undefined }`, `'owner'`, `'player'`, `'gallery'`,
`'Owner'`, the bare string `'owner'`), digested, at the base and at the tip; `scripts/compare.mjs` compares every
reader's page at the tip with the base page composed with no options (today's page).

- Towns: **150** (90 in crisis, all 15 kinds, every one with sections; 60 natural, of them 37 calm with an empty page).
- Pages compared: **1,500**; identical: **1,500**; differ: **0**.
- In the test (`tests/domain/crisis/crisisPageAudience.test.js`): 30 forced towns (two a kind) and 12 natural towns,
  every reader's page deep-equal to the no-options page; crisis liveness and calm emptiness asserted.

## (b) Red first, then green

- RED (the new tests on the tree without the source change; `red.txt`): `Test Files 2 failed (2)`,
  `Tests 3 failed | 1 passed | 6 skipped (10)` (`-t U0`). Failing titles:
  - `U0: … > the readers are the session sheet's closed set; only the owner is the owner, everything else fails closed`
    (`crisisPageForOwner is not a function`);
  - `U0: … > every production call of composeCrisisPage passes an explicit audience` (the three bare calls above);
  - `CF3: … > U0: the owner's own surfaces mount the Crisis tab for the owner; the gallery page and the party link mount
    none` (3 of 3 towns: on the live editor the tab mounted `{ said: false, audience: undefined }`).
  - Green at the base, as designed: the byte-identity test (the seam changes no page).
- GREEN (`green-new.txt`): `Test Files 2 passed (2)`, `Tests 4 passed | 6 skipped (10)`.

## Gates

- `tests/domain/crisis` whole + `tests/domain/tension` whole + `tests/security/frameShareVeil.test.jsx`:
  `Test Files 26 passed (26)`, `Tests 202 passed (202)`.
- Every other test file that imports or names a changed file (grep of `crisisPage`, `CrisisTab`, `CrisisSections`,
  `journalPages`, `OutputContainer`; 87 files, listed with counts below): `Test Files 87 passed (87)`,
  `Tests 1435 passed (1435)`.
- `npm run typecheck:ratchet`: 167 errors, ceiling 167 (OK). `npm run typecheck:domain:strict`: 1113, ceiling 1113
  (OK). `npm run lint`: 0 errors (38 warnings, none in a touched file: `eslint` on the seven touched files prints
  nothing).
- No red I did not cause was met.

### The 87 importer files (second run, JSON reporter: 87 files, 1,435 passed, 0 failed)

- `tests/components/aboutCurrent.test.jsx`: 8 passed, 0 failed
- `tests/components/bar3ServicesRows.test.jsx`: 8 passed, 0 failed
- `tests/components/createWorkflowRail.test.jsx`: 7 passed, 0 failed
- `tests/components/crisisTab.test.jsx`: 7 passed, 0 failed
- `tests/components/dossierPhoneFloorAllViews.test.jsx`: 2 passed, 0 failed
- `tests/components/dossierRegenerateRefusal.test.jsx`: 5 passed, 0 failed
- `tests/components/houseLabelEverySurface.test.jsx`: 5 passed, 0 failed
- `tests/components/npcAuthoringScope.test.jsx`: 16 passed, 0 failed
- `tests/components/pageCensus.walker.test.jsx`: 14 passed, 0 failed
- `tests/components/phoneChromeFloor.census.test.js`: 9 passed, 0 failed
- `tests/components/publicChronicleTab.test.jsx`: 7 passed, 0 failed
- `tests/components/publicProseEquality.test.jsx`: 428 passed, 0 failed
- `tests/components/sectionRerollBoundary.test.jsx`: 3 passed, 0 failed
- `tests/components/settlementDossierHeroLiveState.test.jsx`: 1 passed, 0 failed
- `tests/components/tailCrisisK26.test.jsx`: 1 passed, 0 failed
- `tests/components/tensionSeverityOneWord.test.jsx`: 16 passed, 0 failed
- `tests/components/tierViewerRender.test.jsx`: 6 passed, 0 failed
- `tests/components/tonightSeatSecret.test.jsx`: 3 passed, 0 failed
- `tests/components/tonightSheetOnce.test.jsx`: 4 passed, 0 failed
- `tests/copy/voiceMechanics.test.js`: 30 passed, 0 failed
- `tests/data/w2FixData12Rows.test.js`: 5 passed, 0 failed
- `tests/docs/docCounts.test.js`: 19 passed, 0 failed
- `tests/domain/crisisPage.test.js`: 9 passed, 0 failed
- `tests/domain/crisisPageTierNoun.test.js`: 3 passed, 0 failed
- `tests/domain/deityTemperConsumerCensus.walker.test.js`: 24 passed, 0 failed
- `tests/domain/dmEditKeysFollowRename.test.js`: 10 passed, 0 failed
- `tests/domain/facts/crisisKind.test.js`: 6 passed, 0 failed
- `tests/domain/npc/characterDrift.test.js`: 45 passed, 0 failed
- `tests/domain/npc/paradigmAxisCatalog.test.js`: 52 passed, 0 failed
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
- `tests/generators/bar4HousesPresumptions.test.js`: 6 passed, 0 failed
- `tests/generators/foodwaysOneLine.test.jsx`: 6 passed, 0 failed
- `tests/generators/foundryExportsFishTrade.test.js`: 7 passed, 0 failed
- `tests/generators/resolveCrisisCast.test.js`: 10 passed, 0 failed
- `tests/lib/entityRefProducerConsumer.contract.test.js`: 16 passed, 0 failed
- `tests/lint/chainPrintSites.walker.test.js`: 6 passed, 0 failed
- `tests/lint/dossierMountRegistry.walker.test.js`: 29 passed, 0 failed
- `tests/lint/economyReadModelCoverage.walker.test.js`: 15 passed, 0 failed
- `tests/lint/institutionLabelSeam.census.test.js`: 31 passed, 0 failed
- `tests/lint/lucideTotality.test.js`: 12 passed, 0 failed
- `tests/lint/nameListColumns.walker.test.js`: 6 passed, 0 failed
- `tests/lint/noLegacyFactionReaders.walker.test.js`: 4 passed, 0 failed
- `tests/lint/observedShapeReaders.walker.test.js`: 47 passed, 0 failed
- `tests/lint/premiumGateSingleSource.test.js`: 7 passed, 0 failed
- `tests/lint/proseNumerics.test.js`: 29 passed, 0 failed
- `tests/lint/resourceLabelSeam.census.test.js`: 18 passed, 0 failed
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
- `tests/scripts/baseStateCapsule.test.js`: 9 passed, 0 failed
- `tests/security/gallery_privacy.contract.test.js`: 18 passed, 0 failed
- `tests/ui/defenseTabFlow.test.js`: 21 passed, 0 failed
- `tests/ui/dossier.smoke.test.jsx`: 10 passed, 0 failed
- `tests/ui/dossierNarrativeNavGate.test.jsx`: 1 passed, 0 failed
- `tests/ui/dossierTabGroups.walker.test.js`: 2 passed, 0 failed
- `tests/ui/economicsTabFlow.test.js`: 36 passed, 0 failed
- `tests/ui/generalDeskTabFlow.test.js`: 37 passed, 0 failed
- `tests/ui/prosperityInCrisisSurfaces.test.jsx`: 11 passed, 0 failed
- `tests/ui/versionsMount.test.jsx`: 28 passed, 0 failed
- `tests/ui/warFaithDeskFlow.test.js`: 13 passed, 0 failed
- `tests/ui/wizardBackOrigin.test.jsx`: 4 passed, 0 failed

## (c) The fixtures

`tests/fixtures/` holds no crisis-page pin (grep of `composeCrisisPage`, `crisisPage`). The tests that pin a composed
crisis page or its renderers (`tests/domain/crisisPage.test.js`, `crisisPageTierNoun.test.js`,
`tests/components/crisisTab.test.jsx`, `tailCrisisK26.test.jsx`, `tests/foundry/journalMarksCrisisRows.test.js`,
`tests/pdf/pdfParityFixes.test.js`, the golden and `stressType(s)` tests among the 87) are all green unchanged.
**Pins that move: none.** Re-recorded: nothing.

## (d) For the security reader

- **No new holder and no new line** reaches any reader: every composed crisis page is byte-identical for every reader.
- New: the Crisis tab's `audience` prop, `'owner'` on the live editor and the owner's saved view, `'gallery'` /
  `'player'` on a public dossier / player view. Today the shared pages never mount the tab (`hasCrisisTab`, line 534 of
  `OutputContainer.jsx`), so the non-owner values are not reached; if that gate ever opens, the tab composes as a
  non-owner (and with no prop at all, as a non-owner).
- What I would test (theirs to own): that `hasCrisisTab` stays false on `publicDossier` and `playerView`; that the
  PDF and Foundry exports stay off every shared surface (the `'owner'` they pass rests on that).
- Not mine, seen: `journalPages.js :: crisisJournalPage` reads the sheet's facts by `composeTonightSheet(settlement)`
  with no audience (facts only; no frame on a crisis town); left as it is.

## The scripts (run from the scratchpad folder: `node pages.mjs <worktree> base.json` before the change, `node pages.mjs <worktree> tip.json` after, `node compare.mjs base.json tip.json`)

### `pages.mjs`

```js
// FRAME-4 · U0 — the composed crisis page of every town of a pool, for every reader, digested.
// The crisis pool is B7's gen.mjs birth (forced stressType, B7's seeds `b7-<kind>-<tier>-<i>`, the tier gate honoured),
// six a kind (one a tier; slave_revolt two a tier at its three tiers); the calm pool is B7's natural.mjs birth
// (`b7-natural-<tier>-<i>`), ten a tier. argv: the worktree root, the output path.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const ROOT = process.argv[2].replace(/\/?$/, '/');
const out = process.argv[3];
const { generateSettlementPipeline } = await import(ROOT + 'src/generators/generateSettlementPipeline.js');
const { STRESS_TYPE_MAP } = await import(ROOT + 'src/data/stressTypes.js');
const { composeCrisisPage } = await import(ROOT + 'src/domain/crisis/crisisPage.js');
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const TIER_AT = (t) => TIERS.indexOf(t);
const PER_KIND = 6;
const digest = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 16);
const READERS = [
  ['none', []], ['undefined', [undefined]], ['null', [null]], ['{}', [{}]], ['audience:undefined', [{ audience: undefined }]],
  ['owner', [{ audience: 'owner' }]], ['player', [{ audience: 'player' }]], ['gallery', [{ audience: 'gallery' }]],
  ['bogus', [{ audience: 'Owner' }]], ['string', ['owner']],
];
const rows = [];
const page = (s) => Object.fromEntries(READERS.map(([k, args]) => [k, digest(composeCrisisPage(s, ...args))]));
for (const kind of Object.keys(STRESS_TYPE_MAP)) {
  const gate = STRESS_TYPE_MAP[kind].requiresTier;
  const tiers = TIERS.filter((t) => !gate || TIER_AT(t) >= TIER_AT(gate));
  const per = Math.ceil(PER_KIND / tiers.length);
  for (const tier of tiers) for (let i = 0; i < per; i++) {
    const seed = `b7-${kind}-${tier}-${i}`;
    const s = generateSettlementPipeline({ settType: tier, stressType: kind }, null, { seed, customContent: {} });
    const sections = composeCrisisPage(s, { audience: 'owner' }).length;
    rows.push({ pool: 'crisis', seed, kind, tier, sections, page: page(s) });
  }
}
for (const tier of TIERS) for (let i = 0; i < 10; i++) {
  const seed = `b7-natural-${tier}-${i}`;
  const s = generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
  const st = (Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : [])).filter(Boolean);
  rows.push({ pool: 'natural', seed, kind: st.map((e) => e.type).join('+') || 'calm', tier, sections: composeCrisisPage(s, { audience: 'owner' }).length, page: page(s) });
}
fs.writeFileSync(out, JSON.stringify(rows));
const crisis = rows.filter((r) => r.pool === 'crisis');
const nat = rows.filter((r) => r.pool === 'natural');
const allSame = (r) => new Set(Object.values(r.page)).size === 1;
console.log(JSON.stringify({
  towns: rows.length, crisisTowns: crisis.length, kinds: new Set(crisis.map((r) => r.kind)).size,
  crisisWithSections: crisis.filter((r) => r.sections > 0).length,
  natural: nat.length, naturalCalm: nat.filter((r) => r.kind === 'calm').length, naturalCalmEmptyPage: nat.filter((r) => r.kind === 'calm' && r.sections === 0).length,
  everyReaderSamePage: rows.filter(allSame).length,
}));
```

### `compare.mjs`

```js
// FRAME-4 · U0 — base vs tip: every town's composed crisis page, for every reader. argv: base.json tip.json
import fs from 'node:fs';
const [a, b] = process.argv.slice(2).map((p) => JSON.parse(fs.readFileSync(p, 'utf8')));
const byB = new Map(b.map((r) => [r.seed, r]));
let compared = 0, identical = 0; const differ = [];
for (const r of a) {
  const t = byB.get(r.seed);
  if (!t) { differ.push([r.seed, 'missing at tip']); continue; }
  for (const k of Object.keys(r.page)) {
    compared++;
    // every reader's page at the tip against the BASE page with no options (today's page)
    if (t.page[k] === r.page.none) identical++; else differ.push([r.seed, k]);
  }
}
console.log(JSON.stringify({ towns: a.length, pagesCompared: compared, identical, differ: differ.length, differences: differ.slice(0, 20) }));
```
