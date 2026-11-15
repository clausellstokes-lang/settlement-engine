# TAIL-TIES-10 hand-back (2026-11-15): ruling T29, finishing the key-only leaf cut of the last layer cycle

Seat: TAIL-TIES-10, a CLOSE seat, successor of TAIL-TIES-9. Branch: `lane/close-layer-cycle-attempt-2026-11-15`, from its tip
`82dc208be` (the T28 cut, on the merge `b805b1de` of the joined line at `2f8ffcaa`). All work ran in a scratch worktree
outside the main checkout, with its own `npm ci`. The "before" tree is a second scratch worktree at `b805b1de`.

## What was ruled (T29, the chair's; vetoable by the owner)

1. The lazy edge: pin the leaf lazy with the lazy module it imports, and measure beside the pin.
2. The READERS arm: the leaf becomes the crime family's home in `FAMILIES`. The one market row is re-keyed by identity in the register,
   as the last commit, alone, after a merge of the joined line's tip.
3. The proofs not yet run.

## Part (1): the lazy edge. DONE

`vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN` gains one row, `/src/domain/facts/criminalStructureKey.js`, with its comment in
the neighbours' form. The routing was probed by executing the shipped `manualChunks`: the leaf moved `engine-core` -> `coherence-lazy`.
`corruption.js` stays in `engine-core`. `defenseDisplay.js` already imported it from there, so no new chunk edge.

THE MEASURE (`npm run build`, then `VERIFY_DIST=1 vitest run tests/build/vendorPdfLazy.test.js`, before = `b805b1de`):

| | before `b805b1de` | after (the pin) |
|---|---:|---:|
| first paint, raw | 1,164,962 | 1,164,956 (-6) |
| first paint, gzip | 371,025 | 371,019 (-6) |
| first paint, Brotli | 310,890 | 311,052 (+162) |
| engine-core | 277,921 | 277,915 |
| the engine chunk | 860,445 | 860,445 |

THE BROTLI +162 IS NAMED, NOT HIDDEN. It is the minifier's renaming, not code:
- The entry chunk's raw bytes are identical (489,087). Normalised for chunk hashes, it differs by one mangled import binding (`Z as gp` ->
  `P as gp`) and two reordered preload indices.
- engine-core keeps the same 425 exports. The key's strings (`multiple criminal`, `thieves guild`, `criminal_economy`) occur
  there the same number of times before and after, and the leaf's own copies are in `coherence-lazy`.
- No code entered first paint. The raw and gzip closures fell. The chair rules whether a Brotli wobble counts as a rise.
- The budgets (raw 1,121,260; gzip 357,225; Brotli 299,985; the engine-chunk ceiling 726,454) were already over at the merge point.
  They are the owner's question, and none was touched.

The tests on the pinned tree: `engineCoreLazyEdge` plain AND flagged green (3/3). `engineChunkLazy` and `cultureProfilesLazy` are green
pre-build. Their VERIFY_DIST arms are run in part (3). eslint `vite.config.js`: 0.

## Part (2): the READERS arm

**(2a) The leaf is the crime family's home.** DONE.
- `tests/lint/factLayers.shared.mjs :: FAMILIES`: crime's homes gain `src/domain/facts/criminalStructureKey.js`. The line's comment names
  T29 and the register row it follows (`factLayers.js :: LEAVES`, the crime row). Nothing else of that file changed.
- The 6 crime rows that rose under the leaf fell. Five of them were banked under `defenseDisplay.js`: `hasGuild`, `hasSyndicate`,
  `hasSemiOrg`, `hasDiffuse` and the running-chain `.filter`. The sixth, `oneOrganisationRules`'s `seats.some(… 'criminal' …)`, was an
  UNBANKED rise of the line's own at the merge point.

**MY CALL (vetoable), named.** Those five rows stayed banked under `defenseDisplay.js`, and they read nowhere there now. The walker
holds the tree EQUAL to the register (`readerArm()` toEqual the banked lines), so they were STALE. The receipt says "no row
your cut moved is left fresh or stale", so they are removed in the same commit.
- They were removed by the door's own fall rule, restricted to the moved rows: a banked row the tree no longer reads in its file
  AND whose line the arm reads in the leaf. The scratch script imports `factLayers.shared.mjs`'s `readerArm`, `readsFamily`,
  `outsideHomeCalls` and `lineKey`. The register round-trips byte-identically before the write. The door's own `--shrink` refuses while
  the joined line's 30 rises stand.
- This is a pure shrink (crime 9 -> 4 for `defenseDisplay.js`). These are not the "two rows named", and the chair may veto it.

The door (`node scripts/fact-layers-door.mjs`), each run to a file:

| | rises | falls |
|---|---:|---:|
| the merge point `b805b1de` | 31 | 19 |
| after (2a) | 30 | 20 |

The difference against the merge point is the market pair only: `defenseDisplay.js` market FALL and `criminalStructureKey.js`
market RISE, the `hasSemiOrg` line, which (2b) re-keys. The `leaves crime: npcs` rise and the `seats.some` rise fell. Every other row is the
joined line's own, unchanged.

**The merge.** `git fetch` and then a merge commit of `lane/join-2026-11-14` at `d5d1208ee`, giving `161c8938`. It was clean. The join brought
`crimeSignal.js`'s new `seated` field, which the key does not read, and two `factLayers.js` rows (`keep`, `magicSource`). It did not change the
readers register. Door at the merged tip: 29 rises and 20 falls. Mine are the market pair alone.

**(2b) The market row re-keyed by identity.** This is the LAST commit, ALONE, after the proofs below and a re-fetch of the join. The row moves from
`readers["src/domain/display/defenseDisplay.js"].market` to `readers["src/domain/facts/criminalStructureKey.js"].market`, by path only. Its `line`
and `reason` are unchanged, the `readers` keys stay sorted, and the JSON form is the door's own (`JSON.stringify(…, null, 1)`, round-trip
checked). The register carries no hash or count the door computes. Its total is unchanged and `FIRST.readers` is not touched. It is
expected to read 28 rises and 19 falls, with no row naming `criminalStructureKey.js`. The receipt line gives the figure as measured.

## Part (3): the proofs (at the merged tip `161c8938`, plus the two cures below). Each run went to a file in the scratch tree

- **Type check:** `typecheck:ratchet` exit 0 and `typecheck:domain:strict` exit 0 (`sh scripts/gate-tail.sh`).
- **eslint:** 0 on every touched file: `vite.config.js`, `factLayers.shared.mjs`, the T28 four, and the two walkers below.
- **The build, plain and flagged:** both exit 0. Boot smoke `scripts/boot-smoke.mjs`: plain PASS (602/602 chunks initialised), FLAGGED PASS
  (599/599).
- **Guards** (`VERIFY_DIST=1 VERIFY_ENGINE_REMOTE_DIST=1`): `engineCoreLazyEdge` 3/3, `layerBoundaries` 8/8, `bootSmoke` 11/11,
  `cultureProfilesLazy` 5/5, `engineChunkLazy` 19/19 and `sourceCitationIntegrity.walker` 18/18 are GREEN. No citation broke, so there was
  nothing to re-address.
- **`factLayers.walker`:** LEAVES GREEN (it is red at the join's own tip, 3 reds there). READERS red only on the line's own rows plus the market
  pair, which (2b) cures.
- **`vendorPdfLazy`:** 4 reds, the budget arms, all red at the merge point too and the owner's. At the merged tip: raw 1,164,956, gzip 371,027,
  Brotli 310,860. Brotli is now UNDER the before figure 310,890, which confirms part (1)'s +162 was renaming noise. The engine chunk is
  860,404 (the join's).
- **The 155 test files that name `defenseDisplay` or `factsOf`** (one grep to `named.txt`, one vitest run to `named.json`): 1,652 tests, 18 failed,
  in 8 files. Each red file was run again at the joined line's own tip `d5d1208ee` (`eight-join.json`):
  - NOT MINE, red identically at the join's tip (named): `presumedThings.walker` (4), `proseWiringCensus.walker` (5),
    `defenceFactReaders.walker` (1), `r3c10FoodLinesTrue` (2), and `generationWorkerLazy` (1). The worker bundle is 2,302,081 B against the
    ceiling 2,008,268; the join's tree read 2,304,638.
  - ENVIRONMENTAL: `chainPrintSites` "the roots are every top-level directory of code" names `dist`, the scratch build output (as TAIL-TIES-6
    found).
  - `factLayers.walker` READERS: the market pair, see (2b).
  - MINE, CURED in the part (3) commit (my call, vetoable; each is a shrink or a conscious classing, never a behaviour change):
    - `chainPrintSites.walker` "a stale exemption". `defenseDisplay.js` no longer touches chains, because `runningCriminalChains` moved to the
      leaf. Its EXEMPT row is DELETED with a note. The leaf is not enrolled.
    - `ruinFilterRoster.walker` (2 reds). The leaf is a NEW `.institutions` reader. Before the cut, the same reads sat in `defenseDisplay.js`,
      which the file-granular scan reads as COMPLIANT only because it imports `liveInstitutions` for its Legal row. Routing the key through
      `liveInstitutions` would change the births, so the leaf is classed EXEMPT (`penalty-side/name-lookup`, beside `corruption.js`). The
      count goes 110 -> 111, measured by the file's own scan.
    - NAMED FOR THE OWNER: the key reads ruined rows exactly as the display did. Whether a ruined criminal house should key the structure is
      a behaviour question, not this move's.
- **The 720 births** (RECORD-MEASURE-1 `births-only.sh` over CENSUS-3's `seeds.txt`, sha256 of the uncompressed corpus): at the merged tip
  `6e0c045288704cd716d782684cbb900b6f38a2c02d2d260b80249c893b58d75f`, 720 rows, 0 errors. That is BYTE-IDENTICAL to TAIL-TIES-9's, and the
  join's own tip `d5d1208ee` reads the same. The later commits touch no `src/` file. The receipt line gives the births at the final tip.

## The second merge, and the proofs again at the final tree

Before (2b), `git fetch` showed that the join had moved to `dc4bae117`. It carried JOIN-10 points 17 and 18: TAIL-CLOSE-POOLS-3, and T26's first-paint trim of
16 riders in `vite.config.js`. It was merged as a merge commit (`3d86b706`), clean. It did not touch the readers register. (2b) after it touches
only `tests/lint/factLayers.register.json`, so `3d86b706`'s `src/`, build and births ARE the final tip's. Everything was run again there:

- **Type check:** `typecheck:ratchet` 0, `typecheck:domain:strict` 0.
- **Build, plain and flagged:** both exit 0. Boot smoke: plain PASS (602/602), FLAGGED PASS (600/600).
- **Guards:** green for `engineCoreLazyEdge` 3/3 (plain and flagged), `layerBoundaries` 8/8, `bootSmoke` 11/11, `cultureProfilesLazy` 5/5,
  `engineChunkLazy` 19/19 and `sourceCitationIntegrity` 18/18. `factLayers.walker` LEAVES is green. READERS is the market pair plus the line's
  own rows. `vendorPdfLazy` has the owner's 4 budget arms.
- **THE FIRST PAINT AGAINST THE JOINED LINE'S OWN TIP** (`dc4bae117` built alone in the second scratch tree), like for like:

  | | the join `dc4bae117` | the final tree |
  |---|---:|---:|
  | raw | 1,130,147 | 1,130,147 |
  | gzip | 359,998 | 360,038 |
  | Brotli | 302,173 | 302,189 |
  | engine chunk | 867,375 | 867,375 |

  - Per eager chunk the raw bytes are identical: `content-identity`, `data`, `kernel`, `vendor-icons` and `vendor-react` are identical even
    after hash normalisation.
  - `engine-core` (265,802) and `index` (489,079) are equal in size and differ only by the minifier's names. The cut adds nothing to the
    first paint.
- **The 155 named test files:** 1,652 tests, 13 red in 6 files. All 6 are named above as the line's own or environmental:
  `generationWorkerLazy`, `defenceFactReaders`, `presumedThings`, `proseWiringCensus`, the `dist` root of `chainPrintSites`, and the market pair of
  `factLayers.walker`. `r3c10FoodLinesTrue` is green at this tip, because the join's TAIL-CLOSE-POOLS-3 re-keyed it. `ruinFilterRoster` and the
  stale exemption of `chainPrintSites` are green, which proves the cures.
- **The 720 births:** `533ac4a0aa447e5d609850764505310e879c10ea050eb2d2132ea2b594bb154d`, 720 rows, 0 errors. That is BYTE-IDENTICAL to the joined
  line's own tip `dc4bae117`, run beside it. The difference from `6e0c0452…d75f` is the join's alone (points 17–18 changed
  `src/data/institutionDescVariants.js` and `institutionalCatalog.js`). Nothing of this lane moves a birth.
- **The door before (2b):** 29 rises, 20 falls. The market pair is the only row naming `criminalStructureKey.js`.

## The third merge, (2b) as the last commit, and the proofs at the FINAL TIP `cb17872e`

When (2b) was first committed, `git fetch` showed that the join had moved again, to `061db1367` (JOIN-11 points 1–2: TAIL-CLOSE-SRC-3 and
TAIL-CLOSE-PRESUMED-1). That commit was unpushed. It was dropped in the scratch tree, and the join was merged (`21de669e`, clean; it touched
`crimeSignal.js` and the generators, NOT the readers register). Then (2b) was made again on top as `cb17872e`, alone: the register file only.
This docs commit follows it and touches no code or register.

- **The door at `cb17872e`:** 18 rises, 19 falls (19 and 20 before (2b)). NO row names `criminalStructureKey.js`, and no row my cut moved is fresh or
  stale. The one remaining `defenseDisplay.js` crime rise is the joined line's own.
- **The arm's count across the lane:**

  | | rises | falls |
  |---|---:|---:|
  | the merge point `b805b1de` | 31 | 19 |
  | after (2a) | 30 | 20 |
  | after the `d5d1208ee` merge | 29 | 20 |
  | after the `061db1367` merge | 19 | 20 |
  | after (2b), FINAL | 18 | 19 |

  Every step not mine is the join's.
- **Type check:** `typecheck:ratchet` 0, `typecheck:domain:strict` 0.
- **Build, plain and flagged:** exit 0. Boot smoke: plain PASS (602/602), FLAGGED PASS (600/600).
- **Guards:** green for `engineCoreLazyEdge` 3/3, `layerBoundaries` 8/8, `bootSmoke` 11/11, `cultureProfilesLazy` 5/5, `engineChunkLazy` 19/19,
  `sourceCitationIntegrity` 18/18 and `factLayers.walker` LEAVES. `factLayers.walker` READERS is red on the join's own rows only (it is red at
  `061db1367` too). `vendorPdfLazy` has the owner's 4 budget arms.
- **First paint, like for like against `061db1367` built alone:**

  | | the join `061db1367` | the final tip |
  |---|---:|---:|
  | raw | 1,130,147 | 1,130,147 |
  | gzip | 360,013 | 360,050 |
  | Brotli | 302,220 | 302,022 |
  | engine chunk | 866,934 | 866,934 |

  Per eager chunk the raw bytes are identical. The compression figures move both ways with the minifier's names. The cut adds nothing to the first paint.
- **The 155 named test files:** 1,652 tests, 11 red in 6 files. Each of the 6 was run again at `061db1367` and is red there IDENTICALLY:
  `generationWorkerLazy` 1, `chainPrintSites` 1 (the `dist` root), `defenceFactReaders` 1, `presumedThings` 2, `proseWiringCensus` 5, and
  `factLayers.walker` READERS (the join reds 3 there, mine 1). None is mine.
- **The 720 births at the final tree:** `9ff21fee7bd6a6de7277cfd4464d59a0dc91ee2e1b9fe60a86bc2e4a682b43f3`, 720 rows, 0 errors. That is
  BYTE-IDENTICAL to the joined line's own tip `061db1367`, run beside it. The move from `533ac4a0…` and `6e0c0452…` is the join's
  (TAIL-CLOSE-SRC-3's generator reads, and the data of JOIN-10 points 17–18). Nothing of this lane moves a birth.
- The scratch worktrees (`wt`, `before`) remain registered under the main checkout's `.git/worktrees`. The main checkout was not touched.

## Named, not mine
- The four court-bench reads of the facts in `defenseDisplay.js` (the src close seat's).
- Every budget (above).
