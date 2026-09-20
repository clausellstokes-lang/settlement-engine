# EM-P2 — STOP (build lane, Opus, 2026-09-20 07:44 EDT)

**The packet is BUILT and GREEN. Nothing is committed.** One register moves that §7 does not
name, and its cure is a write to a path outside the change manifest. That is the STOP, and it
is the only one.

---

## The smallest measured contradiction

`docs/content/wiring-census.json` goes stale the moment this packet's leaf exists, and the
staleness is a FILE COUNT and nothing else.

```
$ node -e "… buildCensus() vs the committed census …"           # in the slot, at 141a1d775 + this packet
dry.ok                    = false
rowsMoved                 = 0
sections                  = ["stamp"]
stampFilesMoved           = []
candidateLeavesMoved      = false
committed producerIndexFiles = 1171   fresh = 1172
censusCheck reason        = "stale-bytes"
censusCheck detail        = docs/content/wiring-census.json is stale; run `node scripts/wiring-census.mjs`.
```

Two arms of `tests/lint/proseWiringCensus.walker.test.js` red on it:

```
FAIL tests/lint/proseWiringCensus.walker.test.js > SEAM car 5b … > ⭐ THE DRY READ
AssertionError: the committed register is current at this tip: expected false to be true
FAIL tests/lint/proseWiringCensus.walker.test.js > car 0 … > the committed census is byte-identical …
AssertionError: the committed file is current: expected 'stale-bytes' to be ''
```

**It is STRUCTURAL, not content.** `scripts/wiring-census.mjs#producerCitations` (:218) walks
every `.js` under `src/generators` and `src/domain` and stamps `producerIndexFiles` with the
COUNT:

```js
const files = [
  ...jsFilesUnder(join(ROOT, 'src/generators')),
  ...jsFilesUnder(join(ROOT, 'src/domain')),
];
```

So **any** new leaf under either tree moves the stamp by one, whatever it contains. This leaf
cites nothing the census reads — `rowsMoved = 0`, no section but `stamp` moved, no composer
sha moved — and it still stales the file.

**ATTRIBUTION, EXECUTED, NOT REASONED.** The four CREATEs were moved out of the worktree and
the five convicting walkers re-run:

```
$ … vitest run tests/lint/entropyRootCensus.walker.test.js tests/lint/proseWiringCensus.walker.test.js \
      tests/lint/seedLoopTotality.walker.test.js tests/lint/settlementMapSurfaceAllowlist.walker.test.js \
      tests/lint/tuningRegister.walker.test.js
 Test Files  5 passed (5)
      Tests  198 passed (198)
```

The files were restored and re-hashed byte-identical before any further work.

---

## Why the lane did not cure it

`docs/content/wiring-census.json` is not a §7 path, and `node scripts/wiring-census.mjs` is a
declared command that WRITES it — `EM-PREAMBLE.md` §P2 row 12: *"Every path a declared command
WRITES is a change-manifest row."* Regenerating it here would land a generated artifact the
packet never priced, in a commit whose pathspec §7 fixes. The brief's rule is exact: an edit
needed outside §7 is a STOP, and `tests/lint` WHOLE has exactly two lawful reds — the lighting
census and the prose-numerics address arm. This is neither.

**It is also a gap in the preamble, not just in this packet.** `EM-PREAMBLE.md` §P2 prices the
lighting census (row 1), the mutation-coverage row (row 2), the observed-shape door (row 3),
writer-reach (row 4), the chooser/mechanism rows (row 5), prose-numerics (row 7), edge-shared
(rows 10/12) and the byte budgets (row 11). **It does not price the prose-wiring census, which
every `src/domain/**` or `src/generators/**` CREATE moves by construction.** EM-P2's §7.2 table
inherited that gap and lists five registers, none of them this one.

---

## What the chair can rule (the lane implements either in one turn)

1. **Terminal re-take, like the lighting census.** Leave the two arms red as a named INTERIOR
   RED, land EM-P2 as built, and re-derive `docs/content/wiring-census.json` whole at the
   train's terminal beside the lighting refreeze. Precedent is in the walker's own header: the
   census was last re-taken on 2026-09-18 under owner §934.9 (producer index 1158 → 1159), and
   that re-take "cured two of the three standing proseWiringCensus reds". Cost: the terminal
   carries one more regeneration; the branch holds a red for the rest of the train.
2. **Amend §7 with a GENERATED row** for `docs/content/wiring-census.json` and let this lane run
   `node scripts/wiring-census.mjs` and commit the regenerated file with the rest. Cost: one
   more path in this commit; the arms go green immediately. ⚠ The regeneration must be checked
   to move ONLY `stamp.producerIndexFiles` (measured above: `rowsMoved 0`, `sections ["stamp"]`).
3. **Neither, and add the row to `EM-PREAMBLE.md` §P2** so every later member prices it. That is
   a preamble edit, which re-stamps every EM member's SHA-256 and is the chair's act, not a
   lane's. This is the durable half of whichever of (1) or (2) is taken.

The lane recommends **(2) for this landing and (3) for the family**: the measurement shows the
regeneration is a one-integer move with no row and no section behind it, which is the cheapest
thing in the estate to verify, and leaving the arm red for the rest of the train is how a
terminal ends up banking a number nobody derived.

---

## Everything else is green, and the tree is ready to commit the moment this is ruled

| check | status |
|---|---|
| `npm run implementation:dispatch -- EM-P2` | exit 0 |
| preflight §4, all seven | all hold (below) |
| `npx eslint` on all four files | exit 0 |
| `npm run typecheck:domain:strict` | exit 0 — `✓ no strict-type regressions (1113 errors, ceiling 1113)` |
| `tests/lint/generationForkRegistry.contract.test.js` | `Tests 3 passed (3)` |
| `tests/generators/generationForkCensus.test.js` | `Tests 7 passed (7)` |
| golden posture (`generatorGoldenMaster` + `dossierProseManifest`) | `Tests 18 passed (18)` |
| `tests/copy/voiceMechanics.test.js` | `Tests 30 passed (30)` |
| anchor + mutation-manifest + contract-anti-vacuity | `Tests 34 passed (34)` |
| `tests/generators` WHOLE | `Test Files 113 passed (113)` · `Tests 1042 passed (1042)` |
| `tests/lint` WHOLE | `Test Files 2 failed \| 171 passed (173)` · `Tests 3 failed \| 2776 passed (2779)` — the 3 are the 2 wiring arms above and the lighting census |
| lighting walker, alone | `files: expected 2655 to be 2653` — **+2, this packet's declared delta**; NOT refrozen |
| goldens before / after | identical: `7177cd6e…8f1e`, `921c51cf…db41` |
| `npm run check:packet -- EM-P2` | **exit 0**, all eight steps exit 0 |
| `npm run implementation:resume -- EM-P2` | **exit 0**, all eight steps exit 0 |
| `git status --short` | exactly §7's five paths, nothing else |

Preflight: HEAD `141a1d7752e8d9199c0bf347ea99808121733b0b` (descends from the verified base
`e5f53ae95`); tree clean at handover; preamble SHA-256
`16dfb96fa79320abc7dcfbdd8f5152b6aa66998c269287a951079df6c8223195` equals the header's;
`ls src/domain/generation` exit 1; `git grep generationForkRegistry` printed nothing;
`prng.js:84` reads ``    fork: (label) => createPRNG(`${seed}::${label}`),``;
`steps=22 providesKeys=57 mutatesKeys=18 pairs=75`.

The full receipt, with every executed figure, is in `EM-P2.receipt.md` beside this file.
