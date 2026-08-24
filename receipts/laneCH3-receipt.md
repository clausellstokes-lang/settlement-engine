# TE-CH-3 receipt — "CH-3 — the data slips"

STARTED 2026-08-24T07:32Z — worktree at .../scratchpad/laneCH3-tree, base 79b78881ca86612ec312602c2e3dc6d06aa34df8, node_modules linked, disk 17.6 GB free.

## RESUME POINT
DONE: worktree created.
NEXT: read charter §3 (git show 029268fe5:charters/draft-CATALOG-HYGIENE-PLAN.md, lines 540-end) + charters/draft-CH-SKEPTIC-REPORT.md.

## MEASUREMENTS BANKED (2026-08-24T07:45Z)
- Harness: `CH3-corpus.mjs` (lifted verbatim from the skeptic lane's `SKEP-corpus.mjs`), 420 settlements, ~7.4s/run.
- **RETROVALIDATION at the charter's own tip `00e7af612`:** base digest reproduces
  `1a4a8d3f85e6424a427167ddc44a5e3d7a0e63a9316dab2894632883cf9c9c84` EXACTLY; religiousCenter-only
  variant reproduces `6127eae762dc8b4c4ef41b6ea1006d527c238cd679e45020fe9c3b776b600c18` EXACTLY,
  ROSTER_CHANGED 81, PER_SETTLEMENT_DIGESTS_MOVED 113, SETTLEMENT_NAME_CHANGED 0,
  `Monastery or friary +26` (the skeptic's undeclared injection, confirmed). Tree restored clean.
- ⚠⚠ **THE CHAIR'S TARGET DIGEST CANNOT LAND AT MY BASE.** `MF-CH1` (b2a3b463d) and `MF-CH2A`
  (17fe89763) BOTH LANDED between the charter tip and slot `79b78881c`. Base corpus digest at the
  slot is `1cb39d7d9086dd875df32bb37e2d2965774b1d89b65967f47fd3250c1c65d25f`, not `1a4a8d3f…`.
  I did NOT re-record to match: I proved the chair's figure at the base it was measured on and will
  declare the true figure at mine.
- minTier audit at slot re-derived: ROWS 311 / WITH_MINTIER 36 / REDUNDANT 26 / ABOVE 10 / BELOW 0.
  All ten ABOVE rows: UI true on all three readers, generator eligible FALSE.

## RESUME POINT
DONE: charter+skeptic read; harness validated; retrovalidation of 6127eae7 CONFIRMED at 00e7af612; minTier audit re-derived.
NEXT: C1 = lookups.js reader filter + new walker + metropolisCatalogReachable RATCHET amendment.

## C1 COMMITTED dd731e3f3 (J-CH-3-1, the reader fix)
- Digest at C1 tip = `1cb39d7d9086dd875df32bb37e2d2965774b1d89b65967f47fd3250c1c65d25f` = BASE. Zero shift.
- New walker `tests/lint/catalogTierGateParity.walker.test.js` (8 arms) + RATCHET amendment + 2 new arms.
- 8 mutants driven, every arm convicted, all restored cmp-exact. Control 2 files / 15 tests / TRUE_EXIT=0.
- ⚠⚠ **H12 REFUTED BY EXECUTION** (compile AND skeptic both carried it): the two FORCED-toggle
  loops never consult `minTier`; all ten gated rows appear 70/70 when force-required. Positive
  control live (ungated row 43→70; metropolis-only row 0→70 with outOfTier).
- ⚠ the corpus digest is a CANNOT-FAIL instrument for a lookups.js change; A5's import census is
  the load-bearing evidence.

## RESUME POINT
NEXT: C2 = §3.3 five priorityCategory rows + §3.6 two `facets` keys, then measure digest.

## COMMITS (2026-08-24T08:25Z) — declared digests, each measured at this base
Base corpus digest: `1cb39d7d9086dd875df32bb37e2d2965774b1d89b65967f47fd3250c1c65d25f`
| # | sha | item | digest AFTER | rosters/420 | records |
|---|---|---|---|---|---|
| C1 | dd731e3f3 | J-CH-3-1 reader fix + walker + ratchet amendment | `1cb39d7d…` (UNMOVED) | 0 | 0 |
| C2 | 916ede2d7 | §3.3 five priorityCategory + §3.6 two facets | `ad3eb015bc798ed47b6491eebb1e845faa211ade8ab0f99a61077c3eb65b5ba9` | 0 | 133 |
| C3 | c6e3eda51 | §3.4/§3.5/§3.7 prose sweep, ELEVEN strings | `85132b1976e4a1af98eb1519888d0960cbd5df42ed9f18c0167757cafe9a0e83` | 0 | 59 |
| C4 | c4d71b4ea | the 26 redundant minTier | `bc5079e823b34075196733da5e827a128dcd20fdfcc2221830902e49915b8995` | 0 | 133 |
| C5 | 1d1e8fc86 | §3.2 religiousCenter (J-CH-3-2) | `036f620a9d09d55bd8d787526a53404a9acb059c922e2ace33b7b022152d5227` | **81** | 113 |

## RESUME POINT
DONE: C1-C5. All five digests measured; retrovalidation of 6127eae7 CONFIRMED at 00e7af612.
NEXT: (a) census re-walk + mutation-manifest entry for the new walker; (b) build:edge-shared;
(c) full sweep battery + full gate; (d) mint the CH-3 packet LAST and ALONE.
Background sweep of the 24-file CH-3 list is queued on the gate mutex (/tmp/ch3-c2.log).

## ⛔ ENVIRONMENT RE-BASE (chair directive, 2026-08-24T~08:45Z)
The shared `/Users/cstokes/Desktop/settlement-engine/node_modules` is the MAIN worktree's
(36 deps) and the slot declares 40 — confirmed by measurement here. All pre-reinstall gate
results are VOID. `npm ci` run in BOTH `laneCH3-tree` and `ch3-goldbase`.
RE-MEASURE OWED: all five corpus digests + the golden path-template census + the full gate.
Commits C1-C6 (code) are unaffected.

## POST-REINSTALL RE-MEASUREMENT (all figures reproduce)
- All five corpus digests re-derived AT THEIR COMMITTED SHAS after `npm ci`: BASE/C1 `1cb39d7d…`,
  C2 `ad3eb015…`, C3 `85132b19…`, C4 `bc5079e8…`, C5/C6 `036f620a…`. ALL IDENTICAL to pre-reinstall.
- Retrovalidation re-run at `00e7af612`: `1a4a8d3f…` and `6127eae7…` both EXACT.
- Husky shim now present; probed INERT for this car — `eslint` exits 0 over all 8 touched files
  and `--fix` rewrites NONE of them, so no hook edit can diverge a committed digest.
- Golden: TOTALITY proven (base regen reproduces the committed manifest, 525 rows, 0 mismatches).
  Path-template census base→C4 = SEVEN templates, 0 array-length moves, 0 key-order moves,
  exactly the four declared classes. C4→tip = 144 rows / 314 templates (the declared re-roll).
  272 of 525 golden rows move overall.

## RESUME POINT
DONE: C1-C6; packet MF-CH3.md written; mutation-manifest entry added; SHIFT RECORD row written;
undercityStrataExistence A8 amended; CH3-mint.mjs ready.
NEXT: (1) golden re-record (queued, /tmp/ch3-regold2.log — gate heavily contended by siblings);
(2) commit the re-record group; (3) walk the census DELTA and DEFER the row (§417 precedent);
(4) `node $SP/CH3-mint.mjs` + INDEX row + packet commit, LAST and ALONE; (5) full gate;
(6) pin refs/preserve/holding-ch3.

## COMMITS COMPLETE (8) — tip c3383264f
dd731e3f3 C1 reader fix · 916ede2d7 C2 data slips · c6e3eda51 C3 prose sweep ·
c4d71b4ea C4 26 redundant minTier · 1d1e8fc86 C5 religiousCenter · 2a8e7f26a C6 edge bundles ·
0d2669ac9 C7 golden re-record + SHIFT RECORD + A8 amendment + mutation manifest ·
c3383264f C8 packet MF-CH3 (LAST, ALONE; validate:packets 176 packets / 0 READY / exit 0)

## CENSUS (walked; ROW DEFERRED to the landing act per §417)
slot 2523/366/2157/20982/5840 -> tip 2524/366/2158/20992/5841 = **+1/+0/+1/+10/+1**
Per-file, executed at BOTH ends: new walker 8 titles/1 suite; metropolisCatalogReachable 5->7;
undercityStrataExistence 8->8; generatorGoldenMaster PARKED 0->0.
Method: classifier LIFTED out of vitest (walker 485-1400, vitest import struck). Positive
control: at the slot the lift reproduces LANE-LAW's published tuple EXACTLY.

## HOOK REGIME
Husky live from the reinstall. C7 and C8 both ran pre-commit; `git status` and `git diff HEAD`
both EMPTY after each, so no hook rewrite. `eslint` exits 0 over all touched files and `--fix`
rewrites none. Corpus digest RE-DERIVED at the committed tip after C7: `036f620a…` unchanged.
⚠ `stash@{0}` "On analytics-intelligence-layer: generation-tuning fixes" is PRE-EXISTING owner
WIP, not lint-staged's (which cleaned up its own). NOT TOUCHED.

## RESUME POINT
NEXT: full gate running at tip c3383264f -> /tmp/ch3-GATE.log. Then pin refs/preserve/holding-ch3.

## GATE RUN 1 (tip c3383264f) — RED, and it was MY regression
`[typecheck-ratchet] TYPE REGRESSIONS ... src/store/selectors.js: 1 error(s) (baseline 0) — +1`
`src/store/selectors.js(87,40): error TS2345: Argument of type '{}' is not assignable to
parameter of type 'Record<string, Record<string, { tags?: unknown[]; }>>'.`
CAUSE: three helpers in lookups.js build from a bare `const x = {}`; the tier filter removed
the directly-indexed `institutionalCatalog[tier]` that had been carrying the type.
FIX: commit 6ef434822 — CatalogRow/CatalogShape typedefs + three annotations. TYPES ONLY;
corpus digest at the tip re-derived `036f620a…`, byte-identical, so no declared digest moved.
typecheck:ratchet OK (173/173) · typecheck:domain:strict OK (1134/1134) · eslint exit 0.

## RESUME POINT
NEXT: gate run 2 at 6ef434822 -> /tmp/ch3-GATE2.log. Then pin refs/preserve/holding-ch3.

## ⛔⛔ GATE RUN 2 (tip 6ef434822) — RED. A THIRD FROZEN BASELINE, CAUSED SOLELY BY C5.
Verbatim:
  [test-ratchet] SCOPE SENTINEL: the gate is no longer running what it was frozen to run —
    a pass here would be VACUOUS:
    2 suite(s) FAILED WITHOUT A MEASURABLE TEST ...
      tests/lint/newsHeadlineContract.walker.test.js
      tests/lint/newsVoiceContract.walker.test.js
    skipped tests grew: 17 > ceiling 1
  [gate-tail] exit: 1 (the gate's own status, not a pipe's)
  TRUE_EXIT=1
Underlying: `Error: Wizard News introductions drifted: expected 272, got 270` thrown in
`beforeAll`, which SKIPS all 16 tests (hence the skip-ceiling arm).

⚠ NOT pre-existing — the differential refutes that: the two suites are
**2 passed / 16 tests passed / EXIT 0 at the slot base 79b78881c** and RED at my tip.
ATTRIBUTED: at C4 (pre-religiousCenter) the figures are still 272/32. **Only C5 moves them.**
ROOT CAUSE: `scripts/lib/observed-shape-corpus.mjs` `buildObservedCorpus` runs
`generateSettlementPipeline` + the world pulse LIVE, so the 81/420 roster re-roll reaches it.

MEASURED DELTA (all five figures):
  introductions 272 -> 270 · retirements 32 -> 30
  pulseRoots 12, finalEntries 240, homes 53 ALL UNMOVED; conservation holds (270-30=240).
  So the FINAL news state is identical; two items introduced-and-retired inside the window
  are no longer raised. Churn left, not content.
FULL REMEDY (enumerated, NOT applied):
  1. `CORPUS` in scripts/lib/news-voice-contract.mjs -> 270/30 (drafted + declared, then REVERTED)
  2. tests/lint/.news-headline-contract-baseline.json + .news-voice-baseline.json:
     corpus.introductions -> 270; SIX address rows move —
       applied|npc_contest  headline+summary  8 -> 10
       applied|npc_exploit  headline+summary  3 -> 4
       applied|npc_mobilize headline+summary  5 -> 6
     plus the 106-row address canonical digest.
  3. `KNOWN_INERT_HEADLINE_REWRITES`: activeRules 15 -> 14, inertRules 10 -> 11. One headline
     rewrite rule lost its last occurrence and needs a WRITTEN SCOPED REASON — authored prose
     in a PROTECTED SUBSTRATE, deliberately not mechanically regenerable (no UPDATE_* env, no
     regen script). **THIS IS THE BLOCKER AND IS WHY I STOPPED.**

TREE LEFT CLEAN at 6ef434822. PINNED refs/preserve/holding-ch3 = 6ef434822 (NOT a green pin —
pinned to preserve nine commits, per do-not-lose-work; chair to decide).

## ═══ CHAIR REVISION (§538.5 revised) — VARIANT TAKEN, REBASED TO SLOT 86794b5d2 ═══
REBASE: 9 commits `git rebase --onto 86794b5d2 79b78881c`, ZERO conflicts. `src/**` is
byte-identical across the slot move (TE-AIP-1 = scripts+1 test; MF-CH2B = packet-only), so
base digest `1cb39d7d…` and my tip digest both reproduced unchanged post-rebase.

§3.2 REVISED (commit 501122493): `exclusiveGroupCoexists: true` on the two city rows; the
engine keeps the row IN its group but stops it BLOCKING, and draws its chance from
`rng.fork('exclusiveCoexist::<tier>::<category>::<name>')`.
  digest bc5079e8… -> **39ac163506859b2144b744d18f4a5d585ae8748cfa2e6fba85f75344db1172be**
  **ROSTER_CHANGED 30/420** (was 81) · records 87 (was 113) · new name strings 123 (was 376)
  · settlement names 0 · golden half B **22 of 525** (was 144), 65 templates (was 314)
  Cathedral 26->26 / 29->29 UNMOVED · Multiple monasteries 0->12 / 32->50
  **Monastery or friary 0->0 at BOTH tiers — injection GONE**
  ⭐ **NEWS BILL DISSOLVED**: both news walkers **2 files / 16 tests / EXIT 0**.
  ⚠ COST NAMED: `exclusiveGroupCoexists` is a NEW catalog affordance + engine branch (the
  panel's form hard-coded the group name and was not shippable). General value: it is how a
  row can be un-suppressed WITHOUT re-rolling every seed.
  ⚠ The car is now FIVE production files, not four — assembleInstitutions.js joined with the
  revision. Covered by the chair's waiver, and stated in the packet.

GOLDEN re-recorded (b49e15769): totality re-proved at 86794b5d2 (525 rows, 0 mismatches);
272/525 move, 0 added, 0 removed. `tests/property` 101 files / 643 tests / EXIT 0.
CENSUS re-walked at the NEW slot: 2524/366/2158/21002/5845 -> 2525/366/2159/21012/5846,
DELTA carried unchanged **+1/+0/+1/+10/+1**. Row still DEFERRED to the landing act.
PACKET re-stamped (7d1c2187e): verifiedBase in BOTH places (the validator reds on
disagreement — it caught mine), +1 change path, four calls rewritten as rulings.
validate:packets exit 0, 176 packets / 0 READY.

⭐ THE CONTROL SAVED A FINDING A THIRD TIME (chair asked this be kept in these words):
the H12 refutation — the two forced-toggle loops never consult `minTier`, so all ten gated
rows appear 70/70 when force-required — was carried by BOTH the compile and the panel, and
**my first probe of it was vacuous until a control caught it**.

## RESUME POINT
Gate 3 running at 7d1c2187e -> /tmp/ch3-GATE3.log. Then re-pin refs/preserve/holding-ch3.

## ═══ FINAL: GREEN-BUT-THE-DEFERRED-CENSUS · tip da2c7085c · pinned refs/preserve/holding-ch3 ═══
16 commits on slot 86794b5d2. GATE 5 verbatim terminal state:
  validate:hazard-registry OK · validate:premortem OK · validate:packets valid 176 (0 READY) ·
  validate:data/custom-content/migration-head/edge/map/tuning-bands/foundry/mcp all OK ·
  [typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173) ·
  [domain-strict] OK — no strict-type regressions (1134 errors, ceiling 1134) ·
  lint ✖ 29 problems (0 errors, 29 warnings) [pre-existing, tree-wide]
  [test-ratchet] TEST REGRESSIONS: **1 failing test NOT in the frozen census**
    tests/lint/sovereigntyLightingContract.walker.test.js :: THE CENSUS IS AN ASSERTION…
    msg: AssertionError: the estate's file count moved — re-measure, do not re-word:
         expected 2525 to be 2524
  [gate-tail] exit: 1 (the gate's own status, not a pipe's) · TRUE_EXIT=1
=> The ONLY red is the DEFERRED census row (§417, MF-CG1/MF-CH1 precedent). Everything the
   member owns is green.

## THE FOUR BILLS THE GATE FOUND AFTER THE REVISION (none predicted)
1. **structuralValidator called the ordinary case a contradiction** — `exclusivity_conflict`,
   "a deliberate override — expect political tension". Fixed: skip `exclusiveGroupCoexists`.
   That repair ALSO returned observedShapeReaders to baseline EXACTLY (1300/8607/14586, 0
   shapes added/removed) — the two added shapes had been `structuralViolations` +
   `authoredTensions`, i.e. the bug itself. A baseline nearly re-recorded around a defect.
2. **prngForkLabelDelimiter** — `exclusiveCoexist` is the 4th `::`-embedding family; registered
   after the chain check (token appears at exactly ONE `.fork(` site in src).
3. **facetInferenceHonesty A7** 3 -> 5 (MF-CH1 wrote it "ready for CH-3a's first declaration").
4. **negativeAssertionAnchor caught MY OWN un-anchored negative** — now
   `expectAbsentWithAnchor(village,'Smuggling network','Underground network',…)`.
Plus: carto calibration re-record — **the W2 SAMPLE said 6 rows; the re-record moved 100 of
504** (25 gain an institution, 75 byte-only; all city/metropolis, ZERO at the four lower tiers).
Soak prior: 19 of 95 cells, ±0.01, n unchanged.
⚠ **J-TECH3-D REVERSED**: "nothing enforces generatedAt" was FALSE — CR-EB-2(b) enforces a
600s build window across the five. All five sidecars now commit as a set; `intentAtlasBundle.js`
had real content in it too (the distillate is one of its inputs).
⚠ 87 records move but only 30 rosters: all 57 of the difference carry the two declared rows and
now carry `exclusiveGroupCoexists` — a KEY ADDITION spread onto the record, NOT an rng leak
(`fork` derives from the seed string and consumes no parent state).
