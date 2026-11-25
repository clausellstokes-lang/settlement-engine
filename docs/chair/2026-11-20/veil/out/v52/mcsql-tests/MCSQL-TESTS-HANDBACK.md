# MCSQL-TESTS hand-back (VEIL-52's builder, unit (2)), 2026-11-25

Brief: `docs/chair/2026-11-24/tenth/veil/v52/briefs/MCSQL-TESTS-BRIEF.md` (1fb47a9f2 on `lane/veil-52-2026-11-24`).
Worktree `/home/user/wt/mcsql`, branch `lane/veil-52-2026-11-24-mcsql-wip`, cut at 75a410f1b. Not pushed; no pull request.

## STOPS

1. **(1) `galleryMapMemberCount.pglite.test.js` is still red (3 of 11), on a SECOND cause the brief's cure does not reach.**
   With the column the brief names added (committed), the file's three tests now fail with
   `function public._gallery_apply_member_overrides(jsonb, jsonb, jsonb, boolean, boolean, boolean) does not exist`:
   212's restated get_gallery_map calls it, and the file's hand-built database never loads it. The brief says
   "NOTHING ELSE in that file", so I stopped there. MEASURED, not committed: adding one line after the helper loop,
   `await db.exec(netCurrentFn('_gallery_apply_member_overrides'));`, made the file whole green (11/11) in the tooth
   run (its dependencies, `_gallery_veil_*` and `_gallery_npc_key`, are already loaded; `_gallery_sanitize_public_json`
   is the file's stub). That one line needs the chair's word. CONFIRMED.
2. No STOP on (2): condition (a) held (below).

## The commit

`f1da68754`: `tests/security/galleryServerVeil.pglite.test.js` and `tests/security/galleryMapMemberCount.pglite.test.js`
only, by explicit paths, normal hooks. This hand-back is the next commit (docs only).

## What changed

- **galleryMapMemberCount**: `gallery_importable boolean not null default false` on the hand-written `public.settlements`
  (072's type and default; 047's on settlements is the same), with a one-line comment naming 212's restated
  get_gallery_map, item (36). Nothing else.
- **galleryServerVeil**, the arm after `fetchGalleryMap(`map-${n}`)`:
  - the member is held **equal by value** to the party link's page of the same row and marker. That page is
    `now.lPage`, which the file already reads through `gallery.fetchPublicDossier(link)` on the row's own
    `unlisted_slug` (`lnk-${n}`, `visibility 'unlisted'`, as the file inserts it). It runs at every marker the arm
    reads (unmarked, default, all, opened, mixed; live; no Reveal DM). The fault label is
    `map member is not the party link's page (N84 (a); 212 (36))`; it lists paths the member lacks, extra paths and
    changed values, or `(order)`. The comment cites N84 (a) and 212 (36).
  - The listing comparison `map member lacks what the listing shows` is **dropped**, not loosened.
  - `MEMBER_CANNOT_PROVE` is **gone**: the equal-by-value arm is green without it (the link's page, unmarked, takes the
    default veil, so it does not re-derive `blackMarketCapture` either).
  - Person ids: **not re-keyed**. Member and link page are equal as they stand on all 40 reads, so there is no
    bijection to apply.
  - Kept as they were: `map member shows what the listing hides` (readable), `map member carries a role its card
    withholds`, and the import's three listing comparisons. The header's law (2) parenthetical is restated to match.
    No other assertion was touched.

## Steps (each through the mutex, from `/home/user/settlement-engine`:
`GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- sh -c "cd /home/user/wt/mcsql && sh scripts/gate-tail.sh npx vitest run <files>"`, output to the log, exit appended)

| step | files | log (full log beside it, `*.full.log`) | result |
|---|---|---|---|
| (i) RED FIRST, at 75a410f1b before any edit | both | `/var/tmp/v52/builder/red.log` | 11 failed / 18 passed (29): MemberCount 3 (`column s.gallery_importable does not exist`), ServerVeil 8 (`unmarked/live map member lacks what the listing shows`: `availableServices.criminal`, `coherenceNotes`, `economicState.safetyProfile.crimeTypes`). Matches MCSQL-B-REDS.txt. CONFIRMED |
| (a) CONDITION PROBE (temporary instrumentation, never committed) | ServerVeil | `/var/tmp/v52/builder/probe.log`, `/var/tmp/v52/builder/probe.jsonl` | 40 (town, marker) map reads. The member lacked 1324 listing paths in all, every one at `unmarked/live`. The **link's page carries 0 of them**. Member deep-equals the link page on **40/40**. No door inequality. CONFIRMED |
| (ii) GREEN | both | `/var/tmp/v52/builder/green.log` | ServerVeil **18/18 green** (8 of 8 towns). MemberCount **3 red** (the STOP above). 3 failed / 26 passed (29). CONFIRMED |
| (iii) TOOTH (in-test plant, restored after) | both | `/var/tmp/v52/builder/tooth.log` | The listing's `availableServices.criminal` was planted into the unmarked member's page. ServerVeil **8 of 8 towns red** with `unmarked/live map member is not the party link's page (N84 (a); 212 (36)): +availableServices.criminal[...]`. The same run carried the MemberCount measurement line; that file was 11/11 green. Restored: the committed ServerVeil file is byte-identical to the green run's. CONFIRMED |
| (iv) tests/lint WHOLE, at f1da68754, ledger ref fetched first (`review-fixes-2026-07-08` -> 235efce1a) | `tests/lint` | `/var/tmp/v52/builder/lint2.log` (the first try, `lint.log`, died in the 01:14 UTC container restart) | **17 failed files / 48 failed tests** (208 files and 3256 tests passed). CONFIRMED |

### (iv) beside the base

VEIL-44's record gives the base at 6c7bf0b97 as "48 failing files". This run has 17 failing files holding 48 failing
tests. The base's 48 is likely a count of tests, not files (PLAUSIBLE). I have no base list by title, so I cannot
compare titles. No failure here names either file this commit touches (grep of the full log). The failing files
(tests failed):

chainPrintSites.walker (1), domainAnyCastBaseline (4), factLayers.walker (1), moduleScopeCwdRatchet (1),
negativeAssertionAnchor.walker (1: criminalVeilSwitch, veilCopySites.walker, galleryRosterChoices,
galleryVeilSignalCopies; none mine), noLegacyFactionReaders.walker (2), observedShapeReaders.walker (2),
presumedThings.walker (1), presumptionClasses.walker (1), proseDrawnAnchors.walker (1), proseWiringCensus.walker (2),
rosterChoiceComposedHosts.walker (26), seedLoopTotality.walker (1), slugifyIdiomBaseline (1),
sovereigntyLightingContract.walker (1), styleLaw.walker (1), writerReach.walker (1). All are under `tests/lint/`.

## CONFIRMED vs PLAUSIBLE

- CONFIRMED (executed): every count and result in the table, the 40/40 equality, the 0-of-1324 condition, the tooth,
  the MemberCount measurement, the lint counts, and that none of the lint failures names my files.
- PLAUSIBLE (read): that the base's "48 failing files" means 48 failing tests; that the unmarked link page's lack of
  `blackMarketCapture` comes from the default veil marking (`unveiled: false`) in `sanitizeDossier`.
