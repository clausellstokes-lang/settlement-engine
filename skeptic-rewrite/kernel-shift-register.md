# SKEPTIC VERDICTS — LENS: THE KERNEL AND THE SHIFT REGISTER (8a-1, 8a-2, 8a-7)

Seat: Opus 5 — Fable-unvalidated (the verifier). Dock `$SC/skepRW1`, detached at
`5c7eadb18105f19dce6ac04b4e2782d5bad68355`, symlinked node_modules.

    git status --porcelain | wc -l   ->  0   (AT OPEN)
    git status --porcelain | wc -l   ->  0   (AT CLOSE)
    git rev-parse HEAD               ->  5c7eadb18105f19dce6ac04b4e2782d5bad68355

Every plant was restored with `git show HEAD:<path> > <path>`. No commit, stash, amend, rebase,
reset, `--write` register act or golden re-record was run. The runner count was taken in its own
one-line shell before every vitest and was 0 every time (twice it read 9/10/4/3 — a sibling
skeptic — and I waited rather than starting).

---

## (a-1) `stateProseKernel.js` draws the ARGMAX of `hashKey(seed::block::pool::v<vid>)` over the eligible set, `vid >= 0`

**Command / evidence**

    git diff 29ec62425 HEAD -- src/domain/display/stateProse/stateProseKernel.js
    # the WHOLE product diff of this file across car 8a is: stableVid() + the argmax loop.
    # drawFace is not touched; `if (!seed) return eligible[0]` is not touched.

    node h/vids.mjs                                                            exit 0
      pools 708 variants 2266
      vid histogram {"0":7,"1":708,"2":708,"3":675,"4":121,"5":32,"6":15}
      pools with a vid 0: 7   (each vids 0,1,2,3 · angle@0 canonical · faces 1,1,1,1)
      pools whose vids are not contiguous from the first row: 0

**Figure** — the receipt's histogram `0:7 1:708 2:708 3:675 4:121 5:32 6:15` and its
"non-contiguous: 0 of 708" reproduce to the digit on my own loop.

**VERDICT: CONFIRMED · severity NONE**

---

## (a-2) THE `> 0` PLANT — exactly the seven canonical-led pools split onto the modulus

**Command**

    perl -0pi -e 's/\|\| vid < 0\) return null;/|| vid <= 0) return null;/' \
      src/domain/display/stateProse/stateProseKernel.js
    node h/draws.mjs   (708 pools x 200 seeds, before and after)                exit 0
    git show HEAD:src/domain/display/stateProse/stateProseKernel.js > <path>     (restored, porcelain 0)

**Figure**

    pools whose 200-seed draw sequence CHANGED under the > 0 guard: 7 of 708
       DS-ECO-3 :: SHORTAGE × trade-dependent · DS-ECO-3 :: ADEQUATE
       DS-ECO-3 :: SURPLUS × trade-dependent · DS-ECO-6 :: TIER: significant off-book activity (≥15)
       DS-ECO-6 :: TIER: minor shadow activity (≥3) · DS-ECO-7 :: TALLIES · DS-ECO-7 :: CATALOG

Exactly the seven, and only the seven. The receipt's central finding is real.

**VERDICT: CONFIRMED · severity NONE** — but see NEW-1: *nothing greenly guards it*.

---

## (a-3) The seedless case stays index 0; the face draw keeps its `::w` key and its modulus

**Command:** `node h/law4.mjs` — exit 0

    seedless reads that were NOT index 0, over 708 pools x 3 spellings ('' / undefined / null): 0
    A4 repeat-call drift over 14,160 calls: 0
    shipped face draws that were not face 0 (every shipped variant is single-faced): 0
    4-face synthetic over 4,000 seeds: 953 / 1019 / 1047 / 981
    ::w key check: drawFace(v4,'B','P','w-1') = 0 === hashKey('w-1::B::P::w') % 4 = 0

**VERDICT: CONFIRMED · severity NONE**

---

## (a-4) The fallback is the causal register's, and it moved no read there

**Command:** `node h/causal.mjs` — exit 0

    causal pools 78 · variants 468 · carrying a vid 0
    draws 3,900 that DISAGREE with the pre-cure modulus: 0

**VERDICT: CONFIRMED · severity NONE**

---

## (b-1) UNIFORMITY, re-derived on the shipped corpus with my own loop

**Command:** `node h/unif.mjs` and `node h/unif2.mjs` (six seed families, my own tally by annex
slot, my own chi-square) — exit 0

| seed family | pooled shares % | chi² df2 | deepest per-pool SE (1,641 shares) |
|---|---|---|---|
| `uniformity-seed-` (the lane's) | 33.312 · 33.375 · 33.313 | **4.201** | **3.43** DS-ECO-11 :: TERRAIN: Forest |
| `sk-unif-` (mine) | 33.329 · 33.310 · 33.360 | 2.086 | **4.42** DS-WAR-1 :: statusLabel: At war… |
| `fam-b-` | 33.330 · 33.325 · 33.344 | 0.330 | 3.85 |
| `fam-c-` | 33.349 · 33.332 · 33.319 | 0.754 | 3.57 |
| `fam-d-` | 33.351 · 33.349 · 33.300 | 2.783 | 3.57 |
| `fam-e-` | 33.340 · 33.334 · 33.326 | 0.180 | 3.27 |

547 three-variant pools × 10,000 seeds = 5,470,000 reads, every family. The lane's own row
(33.312 / 33.375 / 33.313 · chi² 4.201 · 3.43 SE at DS-ECO-11 :: TERRAIN: Forest) reproduces
**to the digit** in my independent loop. The chair's accepted repair (chi² at the .001 critical
value 13.816; 0.15 pp absolute tolerance; 4.5 SE per-pool ceiling) holds on all six families.

**VERDICT: CONFIRMED · severity NONE** (see NEW-4 for the ceiling's headroom)

---

## (b-2) APPEND-SAFETY, re-derived with my own loop and my own spelling of the modulus

**Command:** `node h/append.mjs` — 547 three-variant pools × 2,000 seeds = 1,094,000 reads,
a planted fourth variant taking the NEXT annex row per pool, both draws in one loop — exit 0

| draw | reads moved | to the NEW vid | between two OLD |
|---|---|---|---|
| **law 6 (argmax)** | 273,629 = **25.01 %** | 273,629 = **100.00 % of moved** | **0** |
| shipped `% length` | 820,425 = **74.99 %** | 273,218 = 33.30 % of moved | **547,207** |

The receipt's 25.01 / 100.00 / 0 against 74.99 % reproduces exactly on a different seed family;
the PROPERTY (not one read moves between two old wordings) holds.

**VERDICT: CONFIRMED · severity NONE**

---

## (c) THE FACT FENCE — the eligible SET is unchanged, asserted by BYTES on 525 + 768 towns

Not the drawn member: I planted a recorder inside `drawVariant` that pushes
`` `${parent}|` + eligible.map(v => v.text).join('\0') `` for **every call**, plus a
`__SKEPTIC_MODULUS` toggle that restores the pre-cure draw, then ran each corpus under both
draws and compared the sorted multisets byte for byte.

    # 525-town DRIFT corpus (scripts/prose-manifest-cells.mjs)
    argmax   ELIGIBLE-SET CALLS 146568 · sha256 b0173012342776267610fb203790a49bf9f71dcf57387847662f4cf300b18f39
    modulus  ELIGIBLE-SET CALLS 146568 · sha256 b0173012342776267610fb203790a49bf9f71dcf57387847662f4cf300b18f39
    cmp elig.tip.txt elig.base.txt        -> byte-identical

    # 768-town RATE corpus (scripts/prose-rate-corpus.mjs)
    argmax   ELIGIBLE-SET CALLS 146537 · sha256 8e3af868d7c3837568818c267be56d13bc03ea56f5b2d07ece9a383cbb7b8563
    modulus  ELIGIBLE-SET CALLS 146537 · sha256 8e3af868d7c3837568818c267be56d13bc03ea56f5b2d07ece9a383cbb7b8563
    cmp elig768.tip.txt elig768.base.txt  -> byte-identical

Independent corroboration from the cell table: over the 73,284 DRIFT cells, **cells whose POOL
changed: 0** (my own map-join over `cells.base.json` / `cells.tip.json`).

**VERDICT: CONFIRMED · severity NONE**

---

## (d-1) The RE-INDEXED declaration equals the classifier's count when I re-run it myself

The base side was produced without moving the sha — the `__SKEPTIC_MODULUS` plant restores the
pre-cure draw exactly, corroborated by the recorder's own independent footprint figure
(`drawAgrees` **5,966** on the plant = the receipt's base figure; **3,914** unplanted = the
receipt's tip figure).

    node scripts/prose-manifest-cells.mjs --out cells.tip.json      exit 0  (73,284 cells)
    SKEPTIC_MODULUS=1 … --out cells.base.json                       exit 0  (73,284 cells)
    node scripts/prose-manifest-diff.mjs cells.base.json cells.tip.json     exit 0

      REPLACED 0 · RE-INDEXED 43685 (towns 525) · ADDITIVE 0 · WORDING-ONLY 0
      UNCHANGED 29599 · ADDED 0 · REMOVED 0 · indexOnly 0

    my own by-audience join:  dm 21994 of 36660 · player 21691 of 36624 · total 43685
                              cells whose POOL changed 0 · blocks touched 40 of 40

The register's declared `draw-formula.reIndexed` block reads **exactly** these values
(cells 73284 · RE-INDEXED 43685 · REPLACED/WORDING-ONLY/ADDITIVE/ADDED/REMOVED 0 · UNCHANGED
29599 · indexOnly 0 · dm 21994/36660 · player 21691/36624 · blocksTouched 40 · blocksUntouched 0).

**VERDICT: CONFIRMED · severity NONE**

---

## (d-2) "the contract test RECOMPUTES it (plant a wrong count: the test reds by name)"

**Plant 1 — an INCONSISTENT wrong count** (`"RE-INDEXED": 43685` -> `43686`):

    npx vitest run tests/data/dossierStateProseProjection.contract.test.js
      × ⭐ PRINTS THE ONE-TIME RE-INDEX — the owner's veto surface for Shift 1's draw half
      AssertionError: the classes must partition the cells: expected 73285 to be 73284
      1 failed | 76 passed

**Plant 2 — a CONSISTENT wrong count** (RE-INDEXED 40000 · UNCHANGED 33284 · dm 20000 · player 20000):

    npx vitest run tests/data/dossierStateProseProjection.contract.test.js
      RE-INDEXED    40000  54.58 %   <- the one-time cost
      dm 20000 of 36660 · player 20000 of 36624
      Test Files 1 passed · Tests 77 passed (77)

The arm does **not** recompute the count. It prints it and holds it to its own internal
arithmetic (classes partition the cells; audiences partition; audience halves sum to `moved`;
`0 < moved < cells`; `blocksUntouched === 0`). A self-consistent falsification is printed to the
owner as the veto surface and passes 77/77. The RECEIPT does not overclaim — it says
"declared rather than pinned … no arm here can recompute it" — so this refutes the LENS's
wording, not the lane's. The declared figure is correct today; it is simply unguarded.

**VERDICT: PARTLY (the declaration is right; the recomputation does not exist) · severity LOW**
(recorded as NEW-3 below.)

---

## (e-1) The lawful shape set is DERIVED and never rescued; the plant is never selected

**Command:** `node h/shapes.mjs` — exit 0

    NO CARRY (plant): applicable true  lawful [spine-then-sentence]
       refused sentence-then-spine: the added face carries no noun into the spine, so the thread
                                    would break at the join
       refused clause-seat: WITHHELD: the connectives leaf carries no consequence.clause joint at all…
       4000 draws: {"spine-then-sentence":4000}          <- the unlawful shape is NEVER selected
    CARRY (control): lawful [spine-then-sentence, sentence-then-spine]
       4000 draws: {"sentence-then-spine":2005,"spine-then-sentence":1995}
    clause-seated unit: lawful ['clause-seat']  (both sentence shapes refused, each with its why)
    FOURTH SHAPE REFUSED: passageShapes: "invented-shape" is not one of the closed set …

Structurally, `drawPassageShape` is handed only `lawfulPassageShapes().lawful`, so an unlawful
shape is unreachable by construction, and the closed set throws on a fourth.

**E-A mutation control re-run** (`carries: shared.length > 0` -> `>= 0`):

    npx vitest run tests/lint/prosePassageShapes.walker.test.js
      × ⭐ SHAPE 2 NEEDS THE NOUN CARRY — one fact apart, and the verdict flips
      EXACTLY 1 failed | 10 passed        (clean tree: 11 passed)

**VERDICT: CONFIRMED · severity NONE**

---

## (e-2) The clause shape prints WITHHELD; a refused shape prints as refused; the register pin is recomputed

The WITHHELD string is emitted by `lawfulPassageShapes` and printed by the report (408 units on
the taste corpus, see (f)). Both `passage-shape` source pins and all three `draw-formula` source
pins are PRESENT in the files they name (my own substring check), and the contract test's
"⭐ recomputes every pin from the leaves themselves" arm re-reads every `kind: 'source'` pin from
disk (`tests/data/dossierStateProseProjection.contract.test.js:1174-1179`), so a pin is a
measurement here and not a promise.

**VERDICT: CONFIRMED · severity NONE**
⚠ but the WITHHELD *reason string* became false during this same car — see **NEW-2**.

---

## (e-3) The shipped draw is still shape 1 — asserted by bytes on the manifest

    /usr/bin/grep -rn "passageShapes" src/   ->  the module itself + ONE comment in composedWalker.js.
                                                 No src file imports it.
    my own scan of cells.tip.json (73,284 shipped cells):
      piece roles: {"spine": 73284}
      cells with more than one piece (a unit with a shape question): 0

Zero modifiers on the shipped corpus means zero units with a shape question, so no second shape
can have shipped.

**VERDICT: CONFIRMED · severity NONE**

---

## (f) `prose-shape-report.mjs` on laneTASTE reproduces the table; on the product it prints the finding

**On the product:**

    node scripts/prose-shape-report.mjs                                        exit 0
      attach-bearing pools 0 · composable units 0 · units WITH a shape question 0 · draws 0
      ⛔ THE TABLE IS EMPTY, AND THE EMPTINESS IS THE MEASUREMENT. … [the finding, then the four
      OWED columns each named with the car that owes it]

**On laneTASTE @ `f07b98529` (read-only; I exported its six leaves to JSON and drove the product
script over them):**

    node scripts/prose-shape-report.mjs --corpus taste-corpus.json             exit 0
      attach-bearing pools 7 · composable units 408 · units WITH a shape question 408 · draws 26112
      MARGINAL      spine-then-sentence 23907  91.56 %  · sentence-then-spine 2205  8.44 % · clause-seat 0
      CONDITIONAL   lawful={1}    n 21824  100.00 %
                    lawful={1,2} n  4288  48.58 % / 51.42 %  (2083 / 2205)
      DUPLICATE-UNIT RATE  fixed 9844 bp · licensed draw 9818 bp
      RELATION addition 408 100.00 %  ·  CONSTRUCTION V1 339 83.09 % / empty 69 16.91 %
      REFUSALS  408 clause-seat :: WITHHELD…  ·  341 sentence-then-spine :: no noun carried…

Every figure of the receipt's table and of the register's `passage-shape.measured` block
reproduces **exactly**, not merely within rounding.

**VERDICT: CONFIRMED · severity NONE**

---

## (g-1) The face-count ratchet: a dropped FACE reds by name

**Plant:** `defense.generated.js` poolMeta `readiness STRONG` `faceCounts[0]` 1 -> 0.

    npx vitest run tests/data/dossierStateProseProjection.contract.test.js
      × ⭐⭐ never shrinks: the FACE inventory is a ratchet too (C′; Part B §22 d)
        AssertionError: the face inventory only ever rises: expected 2265 to be >= 2266
      × counts what is there: variantCount, faceCounts and vids agree with the pool itself
      × ⭐ recomputes every pin from the leaves themselves
      × is not stale against the two authored annexes
      4 failed | 73 passed          (clean: 77 passed)

**VERDICT: CONFIRMED · severity NONE**

## (g-2) The face-count ratchet: a dropped VARIANT reds by name

**Plant:** the fourth variant of `readiness STRONG` deleted from the pool AND its poolMeta made
consistent (variantCount 4->3, faceCounts [1,1,1], vids [1,2,3]) — a real trim, not a lying record.

    npx vitest run tests/data/dossierStateProseProjection.contract.test.js
      × never shrinks: the variant inventory is a ratchet          (expected 2265 to be >= 2266)
      × ⭐⭐ never shrinks: the FACE inventory is a ratchet too (C′) (the face inventory only ever
                                                                     rises: expected 2265 >= 2266)
      × ⭐ recomputes every pin from the leaves themselves
      × MUTANT: a mechanism that moves without its row moving reds naming the mechanism
      × states no duration its pool key does not license · × is not stale against the annexes
      6 failed | 71 passed

**VERDICT: CONFIRMED · severity NONE**

## (g-3) The estate-wide floor and the register's face pin are the measured corpus

**Command:** `node h/facepin.mjs` (my own walk of the six leaves, my own sha256 over the
register's stated digest material) — exit 0

    rows 708 · faceTotal 2266 · max 1
    digest 0fa317c13a7610e23ae250994e5dea69ef29be857417b5b2aca7a70936bda366

The register's `face-count-per-variant` pin is `[2266, 1, 0fa317c1…bda366]` and `floors: {}` —
all three recomputed identically by me. The digest is the real guard on a future grow-then-trim
(the literal `>= 2266` floor is not: it is a hand-re-pinned constant).

**VERDICT: CONFIRMED · severity NONE**

## (g-4) The seven single-faced canonical rows are the ones ARCH §16 item 5 names

ARCH-COMPOSED-PROSE-v2.md §16 item 5: *"the seven `canonical` variants, each `canon 1 of 4`
(DS-ECO-3 ×3, DS-ECO-6 ×2, DS-ECO-7 ×2)"*. My own derivation (the pools whose vid list contains 0)
returns exactly three DS-ECO-3, two DS-ECO-6, two DS-ECO-7 rows, each 4 variants with the
`canonical` row leading at vid 0 and `faceCounts` `1,1,1,1`. Identical to the receipt's table and
to the contract test's hard-coded `CANONICAL` array, which the test itself cross-derives.

**VERDICT: CONFIRMED · severity NONE**

---

# NEW FINDINGS (defects the receipt does not mention)

## NEW-1 — THE `> 0` REGRESSION IS GREEN ON BOTH NAMED ACCEPTANCES · MEDIUM

With `vid <= 0` planted in `stableVid` (the exact defect car 8a-1 was written to stop):

    npx vitest run tests/domain/stateProseKernel.test.js                    37 passed (37)
    npx vitest run tests/data/dossierStateProseProjection.contract.test.js  77 passed (77)

…while seven pools silently revert to the modulus draw (measured above). The kernel's own comment
says *"the failure this comment is here to stop somebody re-introducing. Driven: the sweep in the
kernel's test names all seven by block and pool"*, and the receipt says *"the seven are named in
the test so the zero cannot be tidied away"*. The sweep
(`tests/domain/stateProseKernel.test.js`, arm *"⭐ THE SHIPPED STATE CORPUS NEVER REACHES THE
MODULUS FALLBACK"*) **re-derives the id-less predicate independently** —
`!Number.isInteger(row.vid) || row.vid < 0` — over the leaves. It pins the CORPUS's vids; it never
calls `stableVid` and is insensitive to the kernel's guard.

The only instrument that does move is `tests/property/dossierProseManifest.test.js`
(1,050 rows moved under the plant) — but that file is **already red on the clean tree at this tip**
in the same two arms with the same 1,050 rows (CHARTERED: the manifest fixture is deliberately not
re-recorded until the REWRITE's last car). It is saturated and cannot discriminate the plant from
the charter. So between now and the freeze act there is **no green instrument** standing over the
guard.

Cheap cure: have the sweep call the kernel's own predicate (export `stableVid`, or assert
`drawVariant` on a synthetic `vid: 0` pool differs from the modulus draw).

## NEW-2 — THE CONNECTIVE LISTS HAVE TWO HOMES, AND THEY NOW DISAGREE · MEDIUM

8a-9 grew the DATA leaf to its floors:

    src/data/dossierConnectives.generated.js  ->  consequence.clause 3 · tension.sentence 3
                                                  contrast.sentence 3 · addition.sentence 3

but `src/domain/display/stateProse/composeStateProse.js`'s `CONNECTIVES` constant — the object the
composer and `scripts/prose-shape-report.mjs` actually read — is untouched:

    node -e "import('./src/domain/display/stateProse/composeStateProse.js')…"
      addition.sentence 1 [""] · contrast.sentence 1 [""] · tension.sentence 0 [] · consequence.clause 0 []

Consequences, executed:

1. `node scripts/prose-shape-report.mjs` prints **"consequence.clause joints exist: NO — shape 3
   is WITHHELD"** at the car's final tip, and on the taste corpus prints the refusal
   *"WITHHELD: the connectives leaf carries no consequence.clause joint at all, so no world can
   seat one (8a item 9 drafts the list to its floor of three)"* **408 times**. That sentence names
   the LEAF and became false about the leaf inside the same car that wrote it. The parenthetical
   even names 8a item 9 as the future cure for a condition 8a item 9 has already ended.
2. The same false sentence is the source comment in `src/domain/prose/passageShapes.js`
   (*"`composeStateProse.js` authors `consequence.clause` as `[]`"* — true of the constant, false
   of the leaf) and is what the sitting will read when it rules on shape 3.

The register's `connective-list-length` pin is correctly scoped (`over: the length of each list in
src/data/dossierConnectives.generated.js`) and is not wrong; the defect is that the shipped
composer does not read the leaf yet (SEAM car 4 is the wiring car), and no instrument says the two
homes disagree. Nothing rendered moves — the composer draws no joint on any town — so this is a
FALSE-SENTENCE / two-homes finding, not a prose movement.

Cheap cures: (i) have `passageShapes`/the report say *"the composer's connective list carries no
consequence.clause joint"*, naming the constant rather than the leaf; (ii) add an arm asserting
`CONNECTIVES` and `DOSSIER_CONNECTIVES` agree, or declaring the divergence with the car that closes it.

## NEW-3 — THE OWNER'S VETO SURFACE IS AN UNGUARDED HAND-TYPED NUMBER · LOW

A self-consistent falsification of `draw-formula.reIndexed` (RE-INDEXED 40000 · UNCHANGED 33284 ·
dm 20000 · player 20000) passes the contract test 77/77 and is printed to the owner as
`RE-INDEXED 40000 54.58 % <- the one-time cost`. The declared figure is CORRECT today (I re-derived
43,685 from two runs of the classifier), and the receipt is honest that nothing recomputes it — but
the record §N.2 makes the owner's veto stand on has no machine standing over it. A cheap cure is
a committed digest of the two cell files, or the diff's own JSON checked in beside the row.

## NEW-4 — THE ACCEPTED 4.5 SE PER-POOL CEILING HAS THIN HEADROOM · LOW

The chair's ADDENDUM 1 ruling 2 accepted a 4.5 SE per-pool ceiling on the strength of a measured
3.43 SE. Over six seed families I measured the deepest per-pool deviation at **3.27 · 3.43 · 3.57 ·
3.57 · 3.85 · 4.42 SE**. It is not flaky today (the arm's 10,000 seeds are fixed literals), but the
margin on the pinned family is 1.07 SE and one of six alternative families came within 0.08 SE of
the ceiling. Any car that re-seeds that arm should expect it to fire; the ceiling is a
one-in-roughly-sixty event per re-seeding, not a comfortable bound.

---

## Instruments I wrote (all outside the dock, none committed)

`$OWN/h/lib.mjs` · `vids.mjs` · `draws.mjs` · `unif.mjs` · `unif2.mjs` · `append.mjs` ·
`law4.mjs` · `causal.mjs` · `facepin.mjs` · `shapes.mjs` · `runcells.mjs` · `fence525.mjs` ·
`fence768.mjs` · `tastecorpus.mjs`, under
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/67af10e4-7386-48d4-8cd3-b2985d4885c2/scratchpad/h/`.
