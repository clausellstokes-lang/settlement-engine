# SKEPTIC PASS — LANE SEAM, LENS: THE NEW ARMS, THE FENCES AND THE RECEIPT (car 5 and the consist)

Seat: Opus 5 — Fable-unvalidated (the verifier). Dock: `$SC/skepSEAM`, HEAD `b573bb5f4`, pinned read-only.
**Porcelain BEFORE 0 · Porcelain AFTER 0.** No edit, no commit, no checkout, no `--write` on any register,
no golden re-record, no build, never the whole suite. Every focused vitest run was preceded by its own
one-line runner count (0 at the moment of each run; one run was DEFERRED because another agent held
`proseWiringCensus.walker.test.js`). Two mutation plants were driven on `cp` backups and restored with
`cmp` + `md5` both matching and porcelain 0 after.

---

## A · THE HEADLINE

The consist is **sound on its central claim and honest in most of its accounting**. Everything I could
execute reproduced: the corpus readings, the sample sha, the block re-walk, the arm plants, the register
row move, the seat licence, the byte ratchets, the strict and typecheck ceilings, the OSR inventory,
and — the strongest single fact in the train — **zero reader-facing drift across twenty-three commits**,
proved not by argument but by the manifest fixture that has not moved since MEASURE car 3 (`3e2a644ec`)
and by the drift arm passing against it at the tip.

**Four findings survive.** One is HIGH (a frozen register turned on a receipt claim that does not
reproduce), one is MEDIUM-HIGH (a red the receipt mis-attributes to this lane), and two are MEDIUM
(instrument staleness the gate cannot see; a mis-driven arm in the block re-walk).

---

## B · THE FENCES OVER THE WHOLE CONSIST (b) — EXECUTED

```
$ git -C $SK log --oneline 3b22b5c56..b573bb5f4 | wc -l      => 23 commits
$ git -C $SK diff --name-status 3b22b5c56..b573bb5f4         => 59 paths
```

### B.1 ⭐⭐ NO POOL LEAF TEXT MOVED — the strongest form, executed

The six state leaves are MODIFIED across the consist (car 4's schema). I compared every quoted
`"key": "value"` pair in each leaf, base against tip:

| leaf | only-in-base | only-in-tip | `"text":` base / tip |
|---|---|---|---|
| defense | **0** | 126 | 383 / 383 |
| economy | **0** | 105 | 329 / 329 |
| general | **0** | 193 | 634 / 634 |
| power | **0** | 79 | 256 / 256 |
| stressors | **0** | 67 | 246 / 246 |
| warFaith | **0** | 138 | 418 / 418 |

**Not one string value was removed or changed anywhere.** The only REMOVED lines in the whole
`src/data/dossierStateProse/` diff are 505 `"slots": []` and 1,761 `]` — punctuation re-emitted with a
comma. Added keys, counted: `vid` 2266 · `vids` 708 · `variantCount` 708 · `role` 708 · `faceCounts` 708
· `attach` 708 · `readsCount` 340 · `poolMeta` 68. **Exactly car 4's declared schema and nothing else.**

### B.2 ⭐⭐ THE MANIFEST — byte-identical to the MEASURE tip, and the drift arm green

```
$ git diff --stat 3b22b5c56..b573bb5f4 -- tests/fixtures/dossier-prose-manifest-golden.json
(no output — the fixture has not moved)
$ git log --oneline -1 3b22b5c56 -- <that fixture>
3e2a644ec MEASURE car 3 …
$ npx vitest run tests/property/dossierProseManifest.test.js          ; exit=0
[dossier-prose-manifest] 525 towns x 2 audiences = 73284 cells in 9 s
      Tests  14 passed (14)
```
The drift arm's three lists are empty AND its `sha256(text) === sha256(manifestBytes(live))` arm passes,
so this is byte-equality against a recording taken BEFORE the SEAM train opened. **CORRECTION, disclosed
in the instrument and not in the receipt's summary line:** the manifest records **42 of 56** registered
mounts; the other 14 carry a re-measured reason (their blocks fire on no RATE town), so "no reader-facing
byte moved" is bounded to 42 mounts with the remaining 14 proven silent.

### B.3 No persisted shape, no seed input, no product surface reaches the island

- No save / schema / migration / store path appears in the 59-file diff.
- `tests/lint/composeStateProseFence.test.js` — **9 passed**, the composer fenced.
- The island fence stands at **THIRTEEN** modules, each with a per-module positive control
  (`proseWiringCensus.walker.test.js:440`); `composedWalker` is reached from nowhere (asserted),
  `holderTable` from exactly `composedWalker` + `wiringCensus` (asserted), `wiringCensus` from itself.
- The eight `src/components/new/tabs/*.jsx` edits are `useMemo` lifts above the early return. I probed
  the regression that shape invites: **`generalDeskLines(null|undefined|{}, …)` returns all seven desks
  without throwing**, and `populationTrendBand(undefined|null|[]|{})` returns `{band:0,net:0,window:0}`.
  No null-settlement crash was introduced. REFUTED as a hazard.

### B.4 The gates, re-run at the tip by me

```
node scripts/check-domain-strict.mjs        exit=0  1120 errors, ceiling 1120   (EXACTLY on the ceiling)
node scripts/check-full-typecheck.mjs       exit=0  173 errors, ceiling 173
node scripts/check-observed-shape-readers   exit=0  1972 finding(s), exactly matching the frozen inventory
node scripts/wiring-census.mjs --check      exit=0  708 pools / 2266 variants / 165 relation rows / 7 stamped files
node scripts/wiring-census.mjs --dry        exit=0  CURRENT · bytes 2052050/2052050 · sections (none) · ROWS 0
node scripts/generate-dossier-state-prose.mjs --check  exit=0  708 sentence / 0 clause · 68 blocks / 2266 variants
node $SC/prose-numerics-rekey.mjs $SK       exit=0  baseline=225 live=225 · exact=225 · FELL=0 NEW=0
npx vitest run tests/lint/proseCorpusBytes.test.js     exit=0  18 passed
npx vitest run tests/lint/proseComposed.walker.test.js exit=0  66 passed
npx vitest run tests/lint/composeStateProseFence.test.js exit=0 9 passed
npx vitest run tests/property/dossierProseManifest.test.js exit=0 14 passed
npx vitest run tests/copy/voiceMechanics.test.js       exit=1  1 failed | 18 passed   (see FINDING 2)
```
`scripts/.prose-byte-baseline.json`: **no state-leaf `ceilingRaw` was raised** (488168 / 393810 / 796761 /
357097 / 258858 / 505306 unchanged); the three new leaves take ARCH §10's own 77,000 apportioned; the six
growth rows are DECLARED with their reasons.

**UNTESTED (fence):** the receipt's `tests/lint` = 149 files / 2,479 assertions green. I may run one
focused file at a time, so I did not run the directory. Every individual file I ran matched the receipt.

---

## C · CAR 5's CORPUS READINGS (a0) — ALL FIVE REPRODUCE

Re-run at the tip, `--reporter=verbose`:

```
A0b   variants 2266 · over-claims 55 · under-claims 1282 · implicit negations 13
      NOT-EXECUTABLE reads 1530 · pools carrying a finding 240
A5    sibling pairs 2645 over 708 pools · same opener 95 · same sentence count 1898
      overlap bp buckets 2449 / 172 / 17 / 5 / 2
A13   citing variants 18 of 2266 · the same 13-block breakdown
      EXECUTABLE VERDICTS (car 5b): LICENSED 6 · WITHHELD 12
      by standing: LICENSED <- LICENSED 6 · WITHHELD <- SOURCE-UNRESOLVED 12
composedOrderIdOf   outside LEVEL1 ∪ LEVEL2: 544 (2401 bp) · V1 1490 · V5 63 · V3|V8 54 · V2 39 · V7 35 · V4 34 · V6 7
BLOCK RE-WALK DS-DEF-11   units 12 · FAIL 0 · WITHHELD 8 · PASS 4
SAMPLED WALK  N 200 of 2266 · sha f7666ef6b9958ada467679a2c9cda02e1c628acbf9239076dfae364c01df6a9c
              FAIL 40 · WITHHELD 75 · PASS 85
```
**Every count and the sha are exact.** The A0b readings are held `toBeLessThanOrEqual` with non-vacuity
guards (`under-claim > 0`, `implicit-negation > 0`) beside them — shrink-only as claimed.

⚠ **One figure is not a constant and the receipt prints it as one:** the walk's cost. Receipt: "52 ms …
260 µs/unit … 589 ms". My run: "45 ms … 225 µs/unit … 510 ms". A timing measurement, correctly variable;
the sha and the verdict counts are the reproducible part. Cosmetic, recorded so car 6 does not pin 260 µs.

### A0b NOT-EXECUTABLE on DS-DEF-2 — CONFIRMED, and what the arm would need

The shipped census row for `DS-DEF-2 :: Invasion & War: walls with citizen militia` reads exactly one
entry, `invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js)`,
and `SYNTHETIC_READ_RE` (`composedWalker.js:217`) short-circuits the arm by name. The gate asserts the
shipped row has length 1 rather than fabricating it — a real, driven limb.

**What the arm would need, precisely — and half of it now exists.** Car 5b's `tableFieldsOf` already
resolves that label to real fields: the same census row now carries
`source.fields = {walls: muster, garrison: muster, militia: muster}`, and across DS-DEF-2 the column
yields **66 (field, row) pairs over 12 distinct names, none containing `(via `** (executed). So A0b needs
**(1)** to read the FIELD SET through the same `tableFieldsOf` path the `source` column uses — available
today at zero cost — and **(2)** the one thing that is still missing: the table row's own **polarity
triple**. The census carries only the row LABEL (`predicate[0].value === "walls, citizen militia"`), not
`{walls: true, garrison: false, militia: true}`, so `heldFalse()` has nothing to read and the
implicit-negation limb — ARCH §4.4's own worked example — stays blind even after (1). A car wanting A0b
executable on DS-DEF-2 must carry the per-row value triple beside the label; 22 rows wide, as the receipt
says.

### The chair's register car at car 5 — diffed against the parent, nothing else moved

```
$ node <structural row-by-row compare, ba99d979e vs da080313d>
rows moved: 15    row fields other than grammars/count: []     ← nothing else, at all
stamp.files identical: true       candidateLeaves identical: true
tiers {MISSING 34, THIN 483, COVERED 225, MISSING-AT-TIER 45}
   -> {MISSING 34, THIN 482, COVERED 226, MISSING-AT-TIER 45}
sections moved: stamp · totals · rows · factIndex · tiers      (producerIndexFiles 1152 -> 1153)
$ git diff ba99d979e..da080313d | grep -c '^[+-]'   => 74 (72 content lines + the 2 headers)
```
The chair's "72 lines · 15 rows' grammars · no stamped sha" is **CONFIRMED to the row**. The fifteen
named rows are exactly the fifteen the receipt lists. The register car touched one file only.

### `check-pair.mjs` exits non-zero — PROVED

```
$ node $SC/prose-research/check-pair.mjs $SK <S12A controls> > kit.out      ; exit=0
$ node $SK/scripts/check-pair.mjs        $SK <same>          > landed.out   ; exit=1
$ diff kit.out landed.out                                                  => IDENTICAL
corpus loaded: 2734 variants in 1020 pools; 6 pass mechanically, 1 WITHHELD (R4-BAND …), 1 fail
```
Byte-identical output, exit 0 → 1. Exactly as claimed.

### Mutation plant #97 — reproduced

```
md5 before  230218bf4d9baeb759269459533a4ed0
planted     30c433c82757ef161664d7be48c77f28
  × ⭐ THE SHIPPED STATE: every joint over the committed leaf is WITHHELD, not failed
      Tests  1 failed | 65 passed (66)          ← exactly one red, by name
restored    cmp identical · md5 230218bf4d9baeb759269459533a4ed0 · porcelain 0
```
(The manifest records md5 `b40a9dc4…` from car 5; car 5b amended the A13 docblock, which §5b.11 item 5
declares. Not a discrepancy.)

---

## D · THE ARM TABLE (a) — every arm walked, plant and clean control

`COMPOSED_ARMS` = A0b · A1 · A2 · A3 · A5 · A6 · A9 · A11 · A13 · C7 (10); A0a, A4, A8, A12 land at the
projector or as desk tests, as the receipt says. 66 arms, all green, each with the limbs claimed:

| arm | plant | clean | NOT-EXECUTABLE | verdict |
|---|---|---|---|---|
| A0a | READS outside the census tests → throws by name | READS inside | n/a | CONFIRMED |
| A0b over/under/implicit-negation | three, each asserted by subject AND value | exact-claim text | **two, each named** (no reading · synthetic table label, driven on the SHIPPED row) | CONFIRMED |
| A1 restatement / conflict | both, on one banded noun | two different nouns | bare spine | CONFIRMED |
| A2 no-row / direction / unestablished | all three, and #97 convicts the collapse | forward row | **three** (no joint · no leaf · no primary field) | CONFIRMED |
| A3 wall 5 | contrast in a sibling-less block | no contrast shape | no contrast shape | CONFIRMED |
| A4 determinism | 6 seeds × repeat × shuffled candidates, byte-identical | — | n/a | CONFIRMED |
| A4 locale ban | three live positive controls through the SAME scanner; a comment naming all three scores 0 | the composer reads `[]` | n/a | CONFIRMED — the scanner cannot go vacuous |
| A5 | a family of four that is one wording ×4 | a family that moves opener/length/words | one-face variant | CONFIRMED |
| A6 LONGER switch + byte-equality | `longer:true` reds a longer AFTER; a face naming another slot; a face with other marks | both clean halves | n/a | CONFIRMED |
| A8 registry | `EXPLAINS: weather:rain` throws; a turn with no EXPLAINS throws; tier-2 `cause:famine` refused by name | `condition:plague` | n/a | CONFIRMED |
| A9 fragment ×4 / sentence ×3 | comma · clause word · capital · terminal stop; proper slot · lower-case · no stop | one clean per form | no FORM | CONFIRMED |
| A11 echo / spines | one fact at two mounts; a modifier on a spining fact | one fact one mount | shipped census declares no modifier | CONFIRMED |
| A12 position budget | `limit: 4` makes four rungs bear → the TWO is the budget, not the data | four rungs, two bear | n/a | CONFIRMED — a real plant |
| A13 | see FINDING 4 | LICENSED holder; `dm-only` mark | column absent, named | **PARTLY** |
| C7 | true cross-block conflict; an innocent pair | — | fewer than two blocks | CONFIRMED |
| `composedOrderIdOf` | LEVEL1-first tie asserted (E5 ≡ V5); derived from PIECES not the arranged string | — | — | CONFIRMED |
| composed anti-vacuity | two innocent halves each clean; the COMPOSITION reds `C2/exemption on a null column` through the REAL composer | — | empty re-walk is NOT-EXECUTABLE | CONFIRMED — the sharpest arm in the file |

**None of these arms is vacuous**, and the two most likely to be — A4's locale scanner and the
anti-vacuity control — are the two most carefully driven.

---

## E · THE FOUR FINDINGS

### ⛔ FINDING 1 (HIGH) — THE PROVENANCE DETECTOR IS WIDER THAN THE RECEIPT SAYS, AND A FROZEN REGISTER TURNED ON THE CLAIM

Receipt §5.4, verbatim on the point: *"The vocabulary is the holder table's KINDS as the owner named them
and nothing wider — a bare `record` or `count` is a common noun, and reading one as a citation would
manufacture a habit the corpus does not have."* The shipped regex
(`moveGrammar.js` `CLAUSE_DETECTORS`, the PROVENANCE row) carries a **third alternative**:

`the (rolls|registers?|ledgers?|books?|records?) (say|says|show|shows|hold|holds|carry|carries|name|names|record|records|have|has)`

which is precisely "a bare record" plus a reporting verb. I split the 18 shipped citations by limb:

```
$ node <classifyMoves over the six leaves, each citation matched against the two limbs>
citing variants: 18
KIND    DS-DEF-1 readiness STRONG            from the road
KIND    DS-DEF-7 band collapsed              the muster books
GENERIC DS-DEF-11 UNWALLED-LARGE             the books say
GENERIC DS-ECO-5 MAGICALLY SUSTAINED         The books show
KIND    DS-ECO-9 BLOCKADED                   from the road
GENERIC DS-ECO-12 INCOME MIX                 the books show
KIND    DS-POP-1 QUANTITY: many hundreds     from the road
GENERIC DS-POP-1 HERALD KIND: hungry_gap     the rolls carry
KIND    DS-POP-1 RECEIPT: births exceed …    from the road
GENERIC DS-POP-1 BELIEVED TREND …            the rolls say
GENERIC DS-POP-2 WINDOW under two readings   the record has      ← "a bare record"
GENERIC DS-GEN-1 economic_disparity          the rolls show
KIND    DS-GEN-3 scores.military: STRONG     The muster roll
GENERIC DS-GEN-10 PRINT-NATIVE CHAPTER …     the books have
KIND    DS-GEN-11 viable: true …             from the road
GENERIC DS-GEN-11 criticalIssueCount zero    the record holds   ← "a bare record"
GENERIC DS-POW-1 Contested                   the rolls show
GENERIC DS-POW-1 governanceFractured true    the records show
kind-only 7 · generic-only 11 · both 0
```

**REFUTED: 11 of the 18 counted citations — the majority — rest on the limb the receipt says was
excluded, and two of them literally read `the record has` / `the record holds`.** Two further departures
from the closed twelve: the regex admits `customs` and `tithe` (neither is a holder-table kind, neither
fires today), and omits `census`, `office` and `tradition` (all three are kinds).

**Why HIGH.** The chair re-took a frozen register on this classifier (`da080313d`, 15 rows' `grammars`,
THIN 483→482, COVERED 225→226) and ruled it *"a declared INSTRUMENT shift of the classifier's vocabulary,
pre-ruled by SITTING §Q"*. SITTING §Q.2 defines PROVENANCE as a MOVE the clerk makes — *"a count that
comes from an interested party, a record whose holder is a power"* — not as any sentence in which a book
reports something. The register move is arithmetically correct for the detector as written; what does not
reproduce is the ground the chair was given for it. And the downstream consequence is live: A13's REPORT
count (18), the sitting's budget input, and the 15 tier-input rows are majority-driven by a limb that
resolves to **no holder kind at all**.

**Cure shape (chair's, not a lane's):** either narrow the regex to the twelve kinds and re-take the
register (the count falls to 7 and the row move shrinks), or keep the limb and amend §5.4's sentence plus
the detector docblock to say the vocabulary is *the kinds PLUS a generic reporting-verb limb*, with the
7/11 split printed beside the 18 so the sitting budgets on a figure it understands.

### ⛔ FINDING 2 (MEDIUM-HIGH) — THE VOICE E2 RED IS NOT THIS LANE'S, AND THE RECEIPT SAYS IT IS

Receipt §5.9 and §5b.10: *"The voice E2 red is car 3a's two banked files at the counts car 3a measured."*
Executed, using the test's own espree string-literal counter on the same two files at the §915 BASE and at
the tip:

```
generalStateProse  BASE {"em":3,"bang":0}   TIP {"em":3,"bang":0}
labelBands         BASE {"em":5,"bang":0}   TIP {"em":5,"bang":0}
$ git log --oneline 3b22b5c56..b573bb5f4 -- src/domain/display/labelBands.js
(empty — no SEAM commit touches this file at all)
$ git log --oneline 3b22b5c56..b573bb5f4 -- tests/copy/.voice-mechanics-baseline.json
(empty — the baseline was not touched either)
```

**REFUTED.** Neither file's literal em-dash count moved anywhere in the consist; `labelBands.js` was never
opened by any SEAM commit; the baseline has no row for either file. With the two counts and the baseline
all identical at base and tip, `tests/copy/voiceMechanics.test.js` **fails identically at `3b22b5c56`**.
The red is inherited from the §915 product tip, not created by car 3a. (Car 3a did not even touch
`generalStateProse.js` — car 3g did, and without moving its count.)

**Why it matters.** A standing gate red carried forward under a wrong owner never gets cured, because
every later car reads "car 3a's banked files" and stops. The estate's own hazard row —
*"a MAGNITUDE CEILING HELD line at the ratchet is a gate red in waiting"* — is this shape one step
further on. The correct statement is: *the voice E2 red is INHERITED from the §915 tip; SEAM adds nothing
to it and moves neither count.* That is a stronger claim for the lane and a true one.

### ⚠ FINDING 3 (MEDIUM) — THE OSR's FROZEN MANIFESTS ARE STALE AND NO GATE SAYS SO

The OSR reads exit 0 at the tip with "1972 finding(s), exactly matching the frozen inventory". Its frozen
input manifests do not describe the tree it read:

```
$ node <M.sourceFiles/subjectFiles vs the baseline's recorded manifests>
live scan set 2196   recorded scanTree 2194
live but NOT recorded (scan): [ src/domain/prose/composedWalker.js, src/domain/prose/holderTable.js ]
live subject 2213    recorded sourceTree 2211      (the same two)
recorded but NOT live: []
```

Cars 5 and 5b added two **SCANNED** product modules after the last re-freeze (`318c05a86`, car 4c). The
provenance gate fires only on `detectorDigest` or `unscannedInputDigest`, and a new scanned file moves
neither (it is in the scan set, so it is excluded from "unscanned"). `assertAuthoritativeSnapshot` — the
one check that would compare the live manifests against committed HEAD — runs **only** for `scan-only`
and `--write`, never for a plain gate read.

The SAFETY property still holds: the scan walks the live tree, so a new reader in either file would enter
as an ADDED identity and red the ratchet. Both files yield **zero** findings (verified: neither is in the
inventory, which is 386 files / 1972 findings unchanged). So this is not a hole in the ratchet — it is a
**stale seal that the next `--write` will silently absorb**, and the §916 register door should name the
two files rather than discovering them in a diff.

⚠ **One flake worth recording.** On my first sequence the OSR threw
`observed-shape inputs or HEAD changed while the scan was running` at `assertStableSnapshot`. It was not
reproducible (four subsequent runs, sequential and concurrent-with-strict, all exit 0 at 1972). The guard
is sensitive to ambient tree activity, so a lane's single green read is a snapshot, not a stability proof.

### ⚠ FINDING 4 (MEDIUM) — TWO ARMS THAT CANNOT DO WHAT THE TABLE SAYS

**4a · A13's FAIL limb is unreachable on any real input, and the receipt's framing understates why.**
`armA13`'s FAIL requires `held.standing !== 'LICENSED'` after the branches for `SOURCE-UNRESOLVED`,
`OFFICE` and `holder === null` have all `continue`d. The gate itself asserts the register's standing
vocabulary is the **closed set** `{LICENSED, OFFICE, SOURCE-UNRESOLVED}` (verified against the committed
JSON: 114 / 3 / 591 over 708 rows). So no census row can ever reach the FAIL limb; the plant supplies a
synthetic `INTERESTED`. The town-resolved path (`sourceOfForTown`) can mint `INTERESTED`, and car 5b
measured it at **0 of 768 RATE towns** with three grounds. The receipt does say "No FAIL: no holder in the
register is INTERESTED" — so it is disclosed — but it reads as a corpus measurement when it is
**structural for the register** and measured-zero only for the town path. Say both, or the sitting will
read a live arm where there is a dormant one. The chair's ruling (5b, item 2) that interested facts are a
WORLD-RUN feature is the right disposition; this is the arms-side wording.

**4b · `reWalkBlock` cannot pass its options through, so A3 mis-fires on any block with a contrast.**
`reWalkBlock(units, ground, {landing})` calls `walkComposed(unit, ground)` with **no options**
(`composedWalker.js:1010`). `armA3` then reads `options.siblingKeys` as `[]`, and its very next branch is
`if (!siblings.length) → FAIL 'no sibling names the alternative'`. A block re-walk of any block whose
units carry a contrast shape therefore reports FAILs manufactured by the driver, not by the corpus.
DS-DEF-11 has no contrast shape (FAIL 0), which is why this is latent rather than visible. It is the same
class as the receipt's own recorded finding §5.8 item 2 (a driver that drops `slots` measures its own
harness) — one step further on, and inside the product module rather than the test. `armA2` and `armA13`
are silently degraded the same way (both answer NOT-EXECUTABLE, which is at least honest).
**Cure:** give `reWalkBlock` an options pass-through, or make it refuse a block carrying a contrast shape
when no `siblingKeys` were supplied.

---

## F · THE OSR INPUT-SET QUESTION FOR THE CHAIR (f) — ANSWERED WITH AN EXECUTED PROBE

**What the input hash protects.** `executionInputFiles = subjectFiles ∪ scannerToolFiles`
(`:1474`), where `isObservedShapeSubjectPath = /\.(js|jsx|json)$/` under `src/`. The gate compares the
recorded `detectorDigest` and `unscannedInputDigest`, and `unscannedInputDigest` is BY CONSTRUCTION
*subject minus scan* — which, since `isObservedShapeScanPath` excludes `*.generated.js`, is almost exactly
"every generated artifact and every data JSON under `src/`". So the hash is a **provenance seal**: it
asserts that these 1,972 findings were produced by THIS detector over THESE data bytes. Its whole purpose
is the classifier at `provenanceDriftOf` — a moved DETECTOR SOURCE still demands a governed migration
(frozen numbers taken under one detector do not mean the same under another), while a moved INPUT is
absorbable by the shrink-only `--write`, which "cannot add an identity, raise a ceiling, or add a file".

**Can a generated leaf carry an observed-shape READER at all? NO — and it is not a policy, it is the
scanner's own path filter.**
```
:209  export const isObservedShapeScanPath = (path) => (
:210    /\.(js|jsx)$/.test(path) && !path.endsWith('.generated.js')
:211  );
```
Verified against the frozen artifact: **0 inventory files end in `.generated.js`**; 15 generated leaves sit
in `sourceTree` and **0** in `scanTree`. No finding can ever be attributed to a generated leaf.

**Executed proof that a leaf byte reds the dry read** (mutation plant on a `cp` backup, restored):
```
$ md5 -q src/data/dossierStateProse/defense.generated.js   ba9c04c13ad11d151a801bb5200c37bc
$ printf '\n// skeptic probe line\n' >> <that leaf>        fc6d3238e2c06dea05055f4b9f8b6355
$ node scripts/check-observed-shape-readers.mjs
observed-shape execution INPUT changed since the last re-freeze (1 path(s):
  src/data/dossierStateProse/defense.generated.js). These are generated/data inputs, not
  detector sources, so the shrink-only --write re-freeze may absorb them; the instrument
  is NOT darkened by them.
$ cp <backup> <leaf> ; cmp => identical ; md5 => ba9c04c1… ; porcelain => 0
```

**The chair's re-freeze at `318c05a86` was shrink-only in the strongest sense** — verified by comparing
the two baselines:
```
findings before 1972  after 1972 · files before 386 after 386
added files [] · removed files [] · identities added 0 · removed 0
top keys moved: digests, frozen, frozenAtSha, manifests, scanStats, scannerProvenance, sentinel
```
Nothing but provenance moved.

**What excluding generated leaves from the input set would cost.** It would delete the input half of the
seal outright: `unscannedInputDigest` IS the generated-and-data half, so removing it collapses
`provenanceDriftOf` to a detector-only classifier and the estate loses the record of WHICH data the
frozen inventory was taken over. The exact-resolution leg EXECUTES producers to build its shape corpus,
and generated leaves feed those producers — so an excluded leaf could move an observed shape with every
scanned file untouched and the ratchet still reading "exactly matching". The module's own header records
the opposite failure twice (refusing input drift darkened the instrument at schema 8→9 and again at
schema 10); excluding them goes the other way and makes the seal blind. **The middle already exists and
is the right answer:** the drift is REPORTED by named path and absorbed by a shrink-only `--write` whose
laws (no added identity, no raised ceiling, no added file) are what make absorption safe. The real cost
per corpus car is **one chair door**, and the chair has paid it once at zero inventory movement.

⚠ **The gap the chair should close instead** is FINDING 3: the `--write` re-freeze is what re-records
`scanTree`/`sourceTree`, so the next one will absorb `composedWalker.js` and `holderTable.js` into the
manifests with no line naming them. A one-line addition to the re-freeze's printed diff ("N scanned paths
added: …") closes it.

---

## G · CAR 4d (g) — EVERY ITEM CHECKED

**`poolMeta.seat` projected at the census.** `seatOf` (`dossier-annex-grammar.mjs:474`) resolves the
licence where the census, the 165 relation rows and the three ratified aliases are visible; `seatMeta`
emits the key **on a modifier only**, so no shipped pool carries it (verified: the six leaves ship exactly
`role` 708 · `variantCount` 708 · `faceCounts` 708 · `vids` 708 · `attach` 708 · `readsCount` 340, and no
`seat`). The generator prints `708 sentence / 0 clause · not-a-modifier 708`.

**`seatFor` reads nothing else — CONFIRMED by reading it whole:**
```js
function seatFor(meta) {
  const declared = meta.relation || 'addition';
  if (meta.seat === CLAUSE_SEAT) return { seat: CLAUSE_SEAT, relation: 'consequence' };
  return { seat: SENTENCE_SEAT, relation: declared === 'consequence' ? 'addition' : declared };
}
```
`meta.seat` and `meta.relation`, and nothing more. The 4d diff shows `edgesFrom` and the `reads[0]` read
DELETED from the composer.

**The plant restoring the `reads[0]` read reds — CONFIRMED, and it is a strong one.** The fixture hands
the composer everything the old reader wanted (a spine whose `reads` names `walls`, a modifier whose
`reads` names `muster`, the licensing row in BOTH spellings, the clause list) and NO projected `seat`; the
shipped composer seats the SENTENCE. The paired control freezes the seat on and it takes the clause. A
second arm composes every fixture twice — empty table vs a table licensing every joint — over the whole
seed sweep and asserts byte-equality, so a re-added read reds on 3 cases × the sweep.

**Every shipped pool seat sentence with a reason** — `708 sentence / 0 clause`, `not-a-modifier 708`,
printed by `--check` (executed, exit 0). **The fixture clause proof** — with the seat frozen to CLAUSE and
one authored joint the unit composes to `The walls stand, so the muster is thin.`; with the shipped empty
`consequence.clause` list the licensed pool is WITHHELD (1 piece, the candidate dropped), which is the
withheld path and not a silent empty joint.

**The two recorded findings — BOTH CONFIRMED as real and as unreachable today.**
1. `edgesFrom` (`generate-dossier-state-prose.mjs:898-904`) already filters forward-key rows to `a->b`
   and reverse-key rows to `b->a`; `assertPoolDeclaration:323` then re-checks
   `edge.direction === 'a→b' || 'a->b'`, which would REFUSE a mirrored row `edgesFrom` lawfully returned.
   Unreachable today, executed: `relation rows 165 · directions { 'a->b': 165 }` in the census and
   `165 × "a→b"` in the leaf. Real, latent, correctly recorded.
2. `S2_SIGNED = false` while SITTING §N.1 SIGNED S2. **Proved inert by execution** — I flipped the
   constant on a `cp` backup and re-ran the projector:
   ```
   export const S2_SIGNED = true;
   [dossier-prose] seats: 708 sentence / 0 clause over 708 state pools (not-a-modifier 708)  exit=0
   restored: cmp identical · md5 05b23e1ab3c4de87efc8c38031f6413b before and after · porcelain 0
   ```
   Byte-identical projection. **CORRECTION to the framing:** `S2_SIGNED` has TWO readers, not one — the
   seat path (`seatOf:476`) and the FORM guard (`:186`, `FORM fragment` refused while S2 is unsigned).
   Both are inert today (the seat path returns `no-row` before the S2 test because the join is 0 of 165;
   the FORM path because no shipped pool declares a FORM), so "flipping it moves nothing at join 0" is
   TRUE — but it is true for two independent reasons and only one is the join. The receipt's stated
   ground ("until the `consequence.clause` floor is met") matches §N.1's own guards, which require
   ≥ 3 joints per relation against a shipped list of 0. Correct as ruled.

### Every `poolMeta` key and its reader

| key | shipped on | product reader | gate reader | verdict |
|---|---|---|---|---|
| `role` | 708 | `composeStateProse.js:383` (turn), `:424` (modifier) | contract `:897`, `:1016` | READ |
| `attach` | 708 | `composeStateProse.js:425` | contract `:899`, `:1012` | READ |
| `readsCount` | 340 | **`composeStateProse.js:609`** — the fact budget spends it | contract `:920` (joined against the census, with a MUTANT arm) | READ — car 4d wired it, as claimed |
| `variantCount` | 708 | — | contract `:840`; SHIFT REGISTER pin (sum 2266 + digest) | READ (gate + register) |
| `faceCounts` | 708 | — | contract `:841/:845`; pin (sum 2266, max 1, digest) | READ (gate + register) |
| `vids` | 708 | — | contract `:842/:846/:886`; pin (digest); ordering agreement with the manifest recorder | READ (gate + register) |
| `seat` | **0** | `composeStateProse.js:541` | `composeStateProse.test.js` (3 seat cases + the plant) | READ, emitted nowhere — absent ≡ sentence, asserted |
| `seatReason` / `seatRow` | 0 | none | none | **NO READER, NOT NAMED RESERVED** ⚠ |
| `relation` | 0 | `:455` (salience), `:540` (seatFor) | contract `:899` stray-key arm | READ |
| `spines` / `covers` | 0 | `:384`, `:388` | contract stray-key arm | READ |
| `form` / `move` / `explains` | 0 | none in `composeStateProse` | `assertPoolDeclaration` (A8/A9 at projection); contract stray-key arm | READ at the projector |

⚠ **`seatReason` and `seatRow` are the one gap in the chair's "a reader or named reserved" rule.** They
are emitted only on a modifier that resolved to the sentence / the clause respectively, so neither ships
today; neither is read by any module and neither is on a reserved list. They are diagnostics for the WAVE.
Naming them RESERVED in the register (or in the `PoolMeta` typedef) closes the rule cheaply — and the
register entry for `seat` already anticipates the promotion, so it is the natural home.

**The SHIFT REGISTER pin on `seat` — NOT LOOSE, but the argument is what carries it, not a pin.** 4d adds
`seat` to the register's NOT-A-MECHANISM list with the ground that the licence resolves to `sentence` on
all 708 with reason `not-a-modifier`, so no value reaches a draw. I verified all three legs: no `seat` key
in any leaf; `seatFor` reads only `seat`/`relation`; `drawVariant` never reads a pool's fields. The row
also names its own promotion trigger ("it becomes shift-class the day the first `consequence` row is
licensed"). **This is the correct disposition and I could not refute it** — but note it is the ONE
register entry with no recomputable `pin`, so nothing reds if a later car starts emitting `seat` on a
spine. A pin of the form `integer: the count of pools carrying a seat key = 0` would cost one line and
make the row self-enforcing like the other six.

---

## H · WHAT THE §916 REGISTER DOORS WILL MOVE (e)

| door | measured at the tip | what moves next |
|---|---|---|
| **the lighting census** (by titles) | BASE `files 2553 · parked 375 · credited 2178 · titles 23843 · suiteTitles 6377` → TIP `2556 · 375 · 2181 · 24025 · 6419` | three new test files, +182 titles, +42 suite titles. Six refreezes across the consist, each by its own ritual on a clean tip. Nothing parked. |
| **writer-reach provenance** | `tests/lint/writerReach.walker.test.js` is **NOT** in the consist's diff — the frozen surfaceReach did not move | Car 3g measured that memoising `stresses` moves it (`colour on stress` gains a `web-display=R`) and backed off, leaving a plain const. **Any later car that memoises a desk-adjacent expression will move that register** — the OverviewTab comment is the warning; the door is the chair's when it comes. |
| **the OSR** | 1972 / 386 exact, exit 0; re-frozen once by the chair at `318c05a86` with 0 identities moved | **No new reader entered.** Car 3a's `composeStateProse.js` and the six candidates leaves, and cars 5/5b's two island modules, all yield **zero** findings — none is in the inventory. But see FINDING 3: two of them are in the live scan set and NOT in the frozen manifests, and the next `--write` absorbs them silently. |
| **the wiring census** | `--check` and `--dry` both green at the tip; the row move was taken by the chair at `da080313d` | FINDING 1 may re-open it: narrowing the PROVENANCE regex re-takes the same 15 rows. |
| **the byte baseline** | no state-leaf ceiling raised; three new leaves at ARCH §10's apportioned 77,000 | the norm leaf's own recorded warning (30,990 B ≈ 421 rows, 271 today, ARCH §6.6 sizes to ≈ 445) is an ARCH §10 amendment and an owner row at car 9. |

---

## I · TWO SMALL COMPLETENESS GAPS IN THE RECEIPT (neither a defect)

1. **ARCH §8.4's "new or extended" column carries three items car 5's table does not mention and §5.7/§5.8
   do not refuse with a measurement:** the `whenA` arm (T-F3), "the ATTACH site's bag for a reservoir
   pool" (arm D), and "joints-per-unit printed".
   - The **T-F3 property IS gated** — but at **car 4**, in `assertPoolDeclaration` ("ATTACH spans N value
     classes … on a relation-bearing pool"), keyed on the census's `objectClasses` rather than on a
     `whenA` field, with three plants in the projection contract (same class, spanning classes, and the
     lawful `addition` control). ARCH §8.4 still names `whenA`; the amendment is the chair's.
   - **Reservoir bag** and **joints-per-unit**: absent from the tree (`grep` finds neither). The reservoir
     act is explicitly wave two's, so the absence is lawful — but it should be a refusal line, not a
     silence, per the brief's "anything refused with its measurement".
2. **The chair's register-car verification says "sections that moved: factIndex, tiers"** while the actual
   set is `stamp · totals · rows · factIndex · tiers`. The receipt's §5.5 block prints the stamp and
   totals movements explicitly two lines above, so nothing is hidden; the one-line summary is just
   narrower than the diff. Cosmetic.

---

## J · WHAT I COULD NOT TEST

- **`tests/lint` whole (149 files / 2,479 assertions).** My fence permits one focused file at a time. Every
  individual file I ran matched the receipt exactly.
- **§5.4's "PROVENANCE at last: 18/15" (the priority-position independence).** Reproducing it needs the
  detector moved within `CLAUSE_DETECTORS`, which is a structural edit I did not make. The **at-first**
  reading is CONFIRMED exactly (18 citing variants, 15 moved rows, both re-derived independently).
- **`scripts/prose-manifest-cells.mjs` cell-file byte identity (73,284 cells).** The manifest test's own
  drift arm is the stronger proof and it passes with the fixture unmoved since MEASURE car 3.
- **`proseWiringCensus.walker.test.js` (69 arms) as a run.** Another agent held it during my window; I
  verified its two subjects — the island fence at THIRTEEN and every 5b count — by reading the file and by
  re-deriving all of them from the committed register.

---

## K · POSITION

The train's product claim holds: **twenty-three commits, ~18,000 lines of leaf schema, a new composer, a
new gate, a new island module, a holder census — and not one byte of reader-facing prose moved**, proved
against a fixture recorded before the train opened. The arms are real, the plants convict, the
NOT-EXECUTABLE channel is used where it should be, and the two ratchets that would catch a quiet
regression sit exactly on their ceilings.

What I would put to the chair, in order: **FINDING 1** (a frozen register turned on a sentence that does
not reproduce — 11 of 18), **FINDING 2** (a standing gate red misfiled to this lane, which is how a red
becomes permanent), then **FINDING 3** and **4b** as cheap cures, and the `seatReason`/`seatRow` reserved
naming plus a `seat` pin as one-line hardening.

```
git -C $SK status --porcelain | wc -l    BEFORE 0    AFTER 0
git -C $SK rev-parse HEAD                b573bb5f4f748e07600b348b80156a8419aae98b
runners at every focused run             0
```
