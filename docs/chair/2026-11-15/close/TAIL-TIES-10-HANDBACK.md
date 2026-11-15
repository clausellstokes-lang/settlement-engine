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

**(2b) The market row re-keyed by identity.** After `git fetch` and a merge of `lane/join-2026-11-14`'s tip. See below.

## Part (3): the proofs. In progress

## Named, not mine
- The four court-bench reads of the facts in `defenseDisplay.js` (the src close seat's).
- Every budget (above).
