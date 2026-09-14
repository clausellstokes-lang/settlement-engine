# THE SEAM FOLD — the skeptic pass over the SEAM train, ruled

**CONFIRMED 35 · REFUTED 5 · PARTLY 9 · UNTESTED 6** (55 verdicts over the three lenses' claims,
plus two of my own refutations of a lens). Dock `$SC/skepSEAM` pinned at
`b573bb5f4f748e07600b348b80156a8419aae98b` over the §915 product tip `3b22b5c56`.

| lens | file | porcelain before → after |
|---|---|---|
| the composer and the seam (cars 3a · 3b–3g · 3h) | `skeptic-seam/seam.md` | **0 → 0** (HEAD unchanged) |
| the schema, the leaves and the SHIFT REGISTER (car 4) + car 5b | `skeptic-seam/schema.md` | **0 → 0** (⚠ the dock read porcelain **1** at 18:07 from a SIBLING lens's plant on `stressorsStateProse.js`, restored by 18:09 — see cure c-9) |
| the new arms, the fences and the receipt (car 5 and the consist) | `skeptic-seam/arms-fences.md` | **0 → 0** |
| **this fold** (re-derivation) | `skeptic-seam/FOLD.md` | **0 → 0** (`git -C $SK status --porcelain` = 0; HEAD `b573bb5f4f748e07600b348b80156a8419aae98b`) |

**THE TRAIN'S CENTRAL CLAIM HOLDS, AND I RE-PROVED IT MYSELF.** Twenty-four commits, fifty-seven
paths, ~18,000 lines of leaf schema, a new composer, a new gate, two new island modules and a
holder census — and **not one byte of reader-facing prose moved**. I confirmed this two ways
independently of every lens: the manifest golden fixture is byte-identical
(`4191775aed6e2608…`, 145,375 B) at **all 24 shas** in the span, last touched by `3e2a644ec`
*before the train opened*; and a base↔tip string-pair diff of all six leaves finds **0
only-in-base pairs** with the `"text":` counts equal on every leaf (383 · 329 · 634 · 256 · 246 ·
418 = 2,266). **THE PROMISE IS INTACT ACROSS THE WHOLE TRAIN.**

What does not hold is a layer of the *accounting*: a frozen register was re-taken on a sentence
that does not reproduce, a standing gate red is filed to the wrong owner, two consist span
integers are wrong, one receipt figure is in the wrong unit — and one lens filed a gap that is
already closed.

---

## 2 · EVERY REFUTED AND PARTLY VERDICT

| # | claim | figure | severity | lens |
|---|---|---|---|---|
| **R1** | §5.4: the PROVENANCE vocabulary is "the holder table's KINDS … and nothing wider — a bare `record` or `count` is a common noun" | **REFUTED. 11 of the 18 citations rest on the generic reporting-verb limb**; kind-only 7 · generic-only 11 · both 0. Two literally read `the record has` / `the record holds`. Regex also admits `customs`/`tithe` (not kinds) and omits `census`/`office`/`tradition` (all kinds). **I reproduced the 7/11 split row for row.** | **HIGH** — a frozen register (`da080313d`, 15 rows' grammars, THIN 483→482, COVERED 225→226) was ruled on this ground | arms-fences F1 |
| **R2** | §5.9 / §5b.10: "the voice E2 red is car 3a's two banked files at the counts car 3a measured" | **REFUTED — the red is INHERITED from `3b22b5c56`.** `labelBands.js` blob **identical** base↔tip (`be47ad29a4cb…`) and touched by **0** of the 24 commits; the baseline blob identical and untouched; `generalStateProse.js` touched by car **3g** (not 3a) with its count unmoved. Espree counts: general BASE `{em:3,bang:0}` TIP `{em:3,bang:0}`; labelBands BASE `{em:5}` TIP `{em:5}`. **All re-measured by me.** | **MEDIUM-HIGH** — a red under a wrong owner never gets cured | arms-fences F2 |
| **R3** | §4.2's SHIFT REGISTER: `comparator-and-band-rule` pins the comparator **and the band** | **REFUTED (partly). The band RULE is unpinned.** The row's only pin is `kind:"source"` over the salience draw key + the tie-break. `bandOf` (`composeStateProse.js:454-458`, `departureBit + tension + change`) appears in **0** pins; register-wide `bandOf` 0, `departureBit` 0, PIN-ONLY `band` 0. **Precision on the lens:** `norm-bit` *does* pin the departure signal's DATA (271 / 72 / 1000 bp / digest) — what is unpinned is the **combining rule**. A car adding a fourth signal ships with the register green. | **HIGH (forward)** — mitigated only because every candidate leaf still ships `const fired = [];`, so no rung has two candidates today | schema d2 |
| **R4** | seam.md (j): "⛔ THE GAP: no arm asserts `fillSites()` has zero unresolved sites … the honest cure is one line in the walker" | **REFUTED BY ME — the arm already exists and is live.** `tests/lint/proseEntryContradiction.walker.test.js:328-333`, "resolves every readStateProse call site with nothing left unread": a non-vacuity floor (`sites.length > 30`), the exact assertion (`sites.filter(s => s.unresolved.length).map(s => \`${s.file}:${s.line} …\`)` → `[]`), **and** the parameterised limb. Live figure: 96 sites · 0 unresolved · 0 parameterised. The lens ran only `proseWiringCensus.walker.test.js`; its plant would have redded this arm by name. | **MEDIUM** — a false gap would have bought a cure already paid | *mine, vs seam.md* |
| **R5** | arms-fences B: "23 commits … 59 paths" | **REFUTED BY ME: 24 commits, 57 paths** (18 A / 39 M; 38,211 insertions, 3,787 deletions). Verified in four count-forms (`..`, `..HEAD`, `--first-parent`, `--name-only`) and against `--stat`'s own trailer. | **MEDIUM** — the §916 predict is written from these integers | *mine, vs arms-fences* |
| **P1** | §4.2: "the ten steps … in order" | **PARTLY.** Purity CONFIRMED (sole import is the kernel; no clock/RNG/locale/settlement; both bans plant-convicted). **Steps 5 and 6 are implemented 6-then-5**: connective drawn at `:745`, `if (phrase === null) continue` at `:748`, piece draw at `:749`. Harmless (content-addressed keys) and unreachable today. | LOW | seam c |
| **P2** | §4.2 step 2 names "the pool RESOLVED" as a metadata filter | **PARTLY.** `admissibleCandidates` implements audience, `role`, `attach` and block-membership and has **no resolved check**; `PoolMeta` carries no such key. Unreachable today (0 modifier pools). | LOW | seam c |
| **P3** | the clause seat is gated by the relation table | **PARTLY — true and TRIPLE-locked, but not by the named mechanism.** After car 4d the composer **does not read the relation table**; the licence arrives as `poolMeta.seat` (`:539-546`). Locks: 0 modifier pools · 0 `seat:'clause'` · `consequence.clause []`. The join is nonetheless 0 (confirmed: `strictBoth 0 · leafBoth 0`). | LOW (wording) | seam e |
| **P4** | §4.2's register table: "14 mechanisms, **3** named NOT mechanisms" | **PARTLY — at the SEAM tip it is 4.** Car 4d added `seat`. **I confirmed 14 / 4 / 21 pins (4 source, 17 recomputable), every mechanism carrying ≥ 1 pin.** The receipt discloses 4d's row; the §4.2 table predates it. | LOW | schema d1 |
| **P5** | the 68 STATE-KEY "transcriptions" | **PARTLY — nothing is transcribed anywhere.** The 16 agreeing tokens agree *because* the census already carries them, so the transcription is a no-op by construction (the arm's own comment says so). Second: the assertions are FLOORS (`agreeing >= 16`, `total >= 110`) and the last line (`dark + other === total - agreeing`) **is arithmetic that cannot fail**. Measurement reproduces: 68 · 46 · 110 · 16 AGREE · 23 DARK-BLOCK · 71 READS-OTHER. | MEDIUM (instrument) | schema h |
| **P6** | §5b: the three withdrawn rows' evidence | **PARTLY.** `granary` exact (2 writers, both named). `ledger` right if a writer is a file (15 citations / 7 files). **`church`: the receipt names two; the live index finds 6 citations across 3 files** — it misses `pestilence.js` ×4 entirely. The withdrawal stands harder; the evidence line understates its own instrument. | LOW | schema 5b |
| **P7** | §5b: the interested-fact ZERO and its three grounds | **PARTLY — the FIGURE is exact, GROUND 1 is REFUTED as stated.** INTERESTED 0 at every tier reproduces byte-identically (78/5/640/6497/2741/3284 over 87,552 pairs; per-kind line character for character). Grounds 2 and 3 are facts of the engine. **Ground 1 is false: every town carries `powerStructure.criminalCaptureState` at birth** (`power/rulingStructure.js:797` — the very line the holder table maps to `watch`), on `standingOf`'s own five-rung ladder, reading none 495 · adversarial 194 · equilibrium 64 · corrupted 15 over 768; 79 towns carry a non-`none` faction `captureState`. The car reported the fact ABSENT rather than asking whether it licenses a per-institution standing. | **HIGH** — the chair's ruling 2 on car 5b rests on this ground, and car 6 is briefed from it | schema 5b |
| **P8** | arm A13 is a live arm | **PARTLY.** A13's FAIL limb is **structurally unreachable on any real input**: the gate asserts the standing vocabulary is the closed set `{LICENSED, OFFICE, SOURCE-UNRESOLVED}` (114/3/591 over 708 — I confirmed), and every one `continue`s before FAIL. The plant supplies a synthetic `INTERESTED`. Disclosed, but reads as a corpus measurement when it is structural for the register and measured-zero only for the town path. | MEDIUM | arms-fences F4a |
| **P9** | "no reader-facing byte moved" | **PARTLY — the bound belongs in the sentence.** The manifest records **42 of 56** registered mounts; the other 14 carry a re-measured reason (their blocks fire on no RATE town). Disclosed in the instrument, not in the receipt's summary line. | LOW | arms-fences B.2 |

**Also refuted, and in the lane's favour:** the null-settlement hazard the eight `useMemo` lifts
invite — `generalDeskLines(null|undefined|{}, …)` returns all seven desks without throwing and
`populationTrendBand(undefined|null|[]|{})` returns `{band:0,net:0,window:0}`. **REFUTED as a
hazard** (arms-fences B.3).

**Three receipt figures that are wrong or over-pinned, below the PARTLY line:**

* ⚠ **The receipt's census "bytes" are JS String.length, not bytes.** §3a.8's `committed 1806768`,
  §3b-0's `fresh 1807516` and the 3b–3g stage table are UTF-16 code units; the files on disk are
  **1,808,325 / 1,809,073**. **I confirmed the 1,557 delta at four shas — and found the lens's
  "constant" is not constant: at HEAD the delta is 1,597** (2,050,453 units vs 2,052,050 bytes).
  Worse than "two units under one word": they are **two instruments** — the walker's `stale-bytes`
  arm reads String.length, while `wiring-census --dry` reads TRUE bytes (`2052050/2052050`,
  delta 0). §3h's `1,809,073 → 1,832,119` are real bytes.
* ⚠ **The walk COST is printed as a constant and is not one.** Receipt "52 ms · 260 µs/unit ·
  589 ms"; the re-run reads "45 ms · 225 µs/unit · 510 ms". The sha and the verdict counts are the
  reproducible part. **Car 6 must not pin 260 µs.**
* ⚠ **The chair's register-car verification says "sections that moved: factIndex, tiers";** the
  actual set is `stamp · totals · rows · factIndex · tiers`. Cosmetic — §5.5 prints the stamp and
  totals two lines above.
* ⚠ **`drawFace`'s uniformity triple is fixture-local.** The receipt's `2448/2533/2500/2519`
  (worst 1.201 SE) is not reproducible from the receipt alone — it depends on a `blockId`/`poolKey`
  the receipt does not name. The lens's own keys give 2486/2460/2482/2572, worst **1.663 SE**. Both
  inside the 2 SE band; the claim holds, the figure is not a constant.

---

## 3 · THE CURES OWED BEFORE §916

### (a) CODE — six, each a change to a named file with the arm that proves it

1. **`src/domain/prose/moveGrammar.js:203-212` — the PROVENANCE detector (R1).** Either **(i)**
   narrow the regex to the twelve holder kinds — drop the generic
   `the (rolls|registers?|ledgers?|books?|records?) (say|…|has)` limb, drop `customs` and `tithe`,
   add `census`/`office`/`tradition` — and re-take the wiring census; or **(ii)** keep the limb and
   correct the **shipped docblock**, which today asserts the opposite in the product source, not
   merely in the receipt. **Arm:** `tests/lint/proseMoveGrammar.walker.test.js` prints and asserts
   the split as integers (`kind-only`, `generic-only`, `both`) beside the total of 18, so the
   sitting budgets on a figure it understands. Under (i) the count falls **18 → 7** and the 15-row
   register move shrinks. ⚠ **This is a register door — ruling c-1 gates which branch is taken.**
2. **`src/domain/prose/composedWalker.js:1010` — `reWalkBlock` drops its options (R-adjacent, F4b).**
   `reWalkBlock(units, ground, options = {})` calls `walkComposed(unit, ground)` with **no third
   argument**, so `armA3` reads `options.siblingKeys || []` (`:530`) as `[]` and its next branch
   FAILs 'no sibling names the alternative'. Any block carrying a contrast shape reports FAILs
   manufactured by the driver. `armA2` and `armA13` are degraded the same way (both answer
   NOT-EXECUTABLE, which is at least honest). **Cure:** pass `options` through, or refuse a block
   carrying a contrast shape when no `siblingKeys` were supplied. **Arm:** a block re-walk fixture
   whose units carry a contrast shape asserts A3 does **not** FAIL, and a plant removing the
   pass-through reds it by name. Latent today only because DS-DEF-11 has no contrast shape.
3. **`docs/content/prose-shift-register.json` — pin the BAND RULE (R3).** Add to
   `comparator-and-band-rule` a pin over `bandOf` itself: a `source` pin containing
   `departureBit(norms, blockId, row.key) + tension + row.change`, or a digest over the three
   signals. **Arm:** the register contract's existing recompute loop (which already carries the
   honest `nothing recomputes it — the pin is a promise` guard) must cover the new pin, drift `[]`.
4. **`docs/content/prose-shift-register.json` — give `seat` a recomputable pin.** It is the one
   register entry carried by argument rather than by a pin, so nothing reds if a later car starts
   emitting `seat` on a spine. One line: `{kind:'integer', over:'pools carrying a seat key',
   value:0}`. **Arm:** the same recompute loop.
5. **`src/domain/display/stateProse/composeStateProse.js:99-100` (or the register) — name
   `seatReason` / `seatRow` RESERVED.** They are emitted by `scripts/lib/dossier-annex-grammar.mjs:519-520`
   on a modifier only, ship on 0 pools, and are read by **no module** — the one gap in the chair's
   "a reader or named reserved" rule (12 mentions estate-wide, all typedef, emitter or fixture).
   **Arm:** the projection contract's stray-key arm reads the reserved list.
6. **`tests/lint/proseWiringCensus.walker.test.js` — pin the holder census headline counts.**
   114 / 3 / 591 and 191 / 5 / 415 are `console.log`'d beside an assertion on
   `kindsWithNoInstitution` only. The byte interlock stops them moving in a green tree, but they
   can move *through* a register door with no arm naming the move. **The idiom already exists** —
   DS-DEF-2's 13 / 13 / 66 ARE pinned; it was simply not applied to the corpus totals. **Arm:** the
   same file, integers asserted.

### (b) RECEIPT — nine corrections, all to `$SC/receipt-seam.md`

7. **§3a.8 · §3b-0 · the 3b–3g stage table:** relabel `1806768` / `1807516` as **JS String.length
   (UTF-16 code units)**, or re-print as true bytes **1,808,325 / 1,809,073**; and record that the
   walker's `stale-bytes` arm and `wiring-census --dry` **read in different units** (the delta is
   1,557 at four shas and **1,597 at HEAD**). §3h's figures are already true bytes.
8. **§4.2:** steps 5 and 6 are implemented 6-then-5 (`:745` / `:748` / `:749`) — correct the order
   or record the transposition as declared-and-harmless; and step 2's "the pool RESOLVED" filter
   does not exist in `admissibleCandidates`.
9. **§4.2's register table:** 3 named NOT mechanisms → **4** (`seat`, added by car 4d).
10. **§5.4:** replace the vocabulary sentence — it does not reproduce. Print the **7 kind / 11
    generic / 0 both** split beside the 18.
11. **§5.9 · §5b.10:** the voice E2 red is **INHERITED from the §915 tip `3b22b5c56`**; SEAM adds
    nothing to it and moves neither count. (A stronger claim for the lane, and a true one.)
12. **§5b:** the `church` withdrawal names two writers; the live index finds **6 citations across 3
    files** (`historyEventStrands.js:176`, `pestilence.js` ×4, `religionLegitimacy.js:181`).
13. **§5b.5:** restate ground 1. The zero stands on grounds 2 and 3; "the engine holds no captured
    institution at birth" is **false** — it holds a typed capture fact at birth, on the reader's own
    ladder, on the field the holder table itself maps to the watch.
14. **The consist span:** **24 commits · 57 paths** (not 23 · 59) — the §916 predict is written from
    these integers.
15. **§5.3** — do not pin the walk cost; **§5.5** — the sections that moved are `stamp · totals ·
    rows · factIndex · tiers`; **§3a** — `drawFace`'s uniformity triple is fixture-local, name the
    `blockId`/`poolKey` or drop the digits. **And withdraw seam.md's ⛔ `fillSites` gap** from
    whatever the fold hands forward: the arm exists at
    `tests/lint/proseEntryContradiction.walker.test.js:328-333` and the cure is already paid.

### (c) RULINGS FOR THE CHAIR — eight

16. **R1's branch (owner-gated in effect): narrow the regex and re-take the register, or keep the
    limb and amend §5.4 plus the product docblock.** **My recommendation: narrow and re-take.** The
    frozen register at `da080313d` was ruled *"a declared INSTRUMENT shift of the classifier's
    vocabulary, pre-ruled by SITTING §Q"*, and SITTING §Q.2 defines PROVENANCE as *a count from an
    interested party, a record whose holder is a power* — not any sentence in which a book reports
    something. The arithmetic is correct for the detector as written; the **ground** does not
    reproduce, and A13's REPORT count (18), the sitting's budget input and the 15 tier-input rows
    are majority-driven by a limb resolving to **no holder kind at all**.
17. **The §916 OSR door must NAME `src/domain/prose/composedWalker.js` and
    `src/domain/prose/holderTable.js`** rather than let the next `--write` absorb them in a diff.
    **I confirmed the staleness exactly:** recorded `scanTree` **2194** vs live scan set **2196**,
    recorded `sourceTree` **2211** vs live **2213** — the delta is precisely those two files, added
    as SCANNED product modules by cars 5 and 5b after the last re-freeze (`318c05a86`). The ratchet
    is **not** holed (both yield zero findings; the scan walks the live tree, so a new reader would
    enter as an ADDED identity), but the seal is stale and the gate cannot see it: the provenance
    gate fires on `detectorDigest` / `unscannedInputDigest`, and a new *scanned* file moves neither.
    **Cheap close:** one line in the re-freeze's printed diff — "N scanned paths added: …".
18. **The voice E2 red's ownership and disposition** — does §916 carry it as a known-**inherited**
    red with a named cure car, or is it cured first? It cannot stay filed to car 3a.
19. **Whether the holder census headline counts become pinned integers before the sitting budgets
    on them** (cure 6). Recommend yes; it is shrink-only and the idiom exists.
20. **Whether `seatReason`/`seatRow` are named RESERVED now or at the WAVE** (cure 5). The `seat`
    register entry already anticipates the promotion, so the register is the natural home.
21. **The A0b polarity-triple car.** A0b needs (1) the FIELD SET through `tableFieldsOf` — available
    today at zero cost, since car 5b's `source.fields` already resolves DS-DEF-2 to
    `{walls: muster, garrison: muster, militia: muster}` (66 field-pairs over 12 names, 0 containing
    `(via `) — and (2) the one thing still missing, **the table row's own polarity triple**. The
    census carries only the row LABEL, so `heldFalse()` has nothing to read and the
    implicit-negation limb stays blind. **22 rows wide.** Schedule it or record the deferral.
22. **The interested-fact ground-1 correction must be taken BEFORE car 6 is briefed** (cure 13).
    Chair ruling 2 on car 5b rests on it. *The lens is right that the correction is narrow:*
    `criminalCaptureState` is SETTLEMENT-wide while `standingOf` asks about ONE institution, so
    feeding it directly would mark every holder in a corrupted town interested — its own error. The
    question the car should have asked, and the chair should now answer, is whether a birth-time
    capture fact licenses a **per-institution** standing.
23. **One name for the relations "exactly one endpoint" figure.** Three are in play: the census's
    `strictEither` **0**, its `leafEither` **2**, and the lens's alias-applied **10** (which the
    contract test also uses as its non-vacuity control). The load-bearing figure — **join both = 0** —
    is confirmed three ways and is not in doubt; the sitting needs one name for the other.

---

## 4 · THE FIGURES THE LEDGER WILL CARRY

**⭐ = re-derived by me in this fold, independently of every lens.**

### The manifest drift, at every stage
`525 towns × 2 audiences = 73,284 cells`; the drift arm **14 passed** at every one of the seven
3b–3g tips and at the SEAM tip, its three lists (`rows added` / `removed` / `moved`) all `[]`.
Printed figures, byte-equal at every stage: **cells whose audible-pool recomputation would draw
differently 5,966 of 73,284 · audience-divergent positions 345 of 36,660 · DM-only 36 · player-only
0 · covert pools 4 · DM cells drawn from one 0 · player cells 0 · seedless cells 1,087 · 217 · 18.**
⭐ **The golden fixture `tests/fixtures/dossier-prose-manifest-golden.json` is byte-identical —
sha256 `4191775aed6e2608a76fa7909da2d689cc1c7054e9358a8ccf8f2cb000f57add`, 145,375 B — at ALL 24
shas** `3b22b5c56..b573bb5f4`; last touched by `3e2a644ec` (MEASURE car 3), *before the train
opened*. ⭐ Zero corpus bytes through cars 3a–3h (`git diff --stat 3b22b5c56 c45a46a78 -- src/data/`
prints nothing); no `src/data/` byte has moved since `802589718` (car 4c), so cars 4d, 5 and 5b are
the zero-corpus cars they claim to be. **CORRECTED:** the claim is bounded to **42 of 56** registered
mounts, the other 14 proven silent.

### The key identity figures (car 3h)
`exhaustive 4,743 · RATE towns 768 (threw 0) · DRIFT rows 1,050 (threw 0)`, five digests reproduced
exactly: **exhaustive `3cf2fb9e70894a3c` · RATE keys `a518931aeea73060` · DRIFT keys
`e357988905aeeea9` · RATE desk-output `cde82d7f1dc9ef03` · DRIFT desk-output `c873e0194673affc`**.
Row by row: **0 of 4,743 · 0 of 768 · 0 of 1,050** key tuples differ; **0 of 768 · 0 of 1,050**
desk-output digests differ. Independently of the lane's snapshot, against the pre-SEAM product base
`laneB6` (`3b1c0eaa5`): **`laneB6 4743 | skepSEAM 4743 | differing 0`**, reaching the **26 of 26**
distinct keys. CONFIRMED.

### The census's RESOLVED integer after 3h
⭐ **RESOLVED 318 → 340**, unresolved 390 → **368**, read from the committed
`docs/content/wiring-census.json` at HEAD. With it: **keyTables 29 → 33 · syntheticTableFields 78 →
100 · factIndex rows 59 → 63 · branch/function cannotAttach 22/26 → 21/25 · `DS-DEF-2 ∈ dark`
true → false.** DS-DEF-2 at 3h: **26 rows, rungs {table 22, literal 4}, k {2:22, 1:4}** (with
`internalRowPoolKey` left on rung 1 — accepted). Row diff `6d94a41ad → c45a46a78`: **22 rows moved ·
0 outside DS-DEF-2 · 0 added · 0 removed.** Attach coverage `{spines 4, facts 2, spinesReachedBp 0,
meanReachBp 0}` → `{spines 26, facts 6, spinesReachedBp 10000, meanReachBp 8077}`. ⭐ Tiers at HEAD
**MISSING 34 · THIN 482 · COVERED 226 · MISSING-AT-TIER 45**; totals **pools 708 · blocks 68 ·
variants 2,266 · covertRows 4 · objectClassed 99 · absent {measured 370, default 3, not-produced 60,
method-call 18}**. ⭐ The producer index is the **same object at all five shas** (3a, 3g, the register
car, 3h, HEAD) — no row reclassified by any of the nine routing commits. CONFIRMED.

### The pins of the SHIFT REGISTER
⭐ **14 mechanisms · 4 notMechanisms · 21 pins (4 `source`, 17 recomputable) · every mechanism
carries at least one pin · drift `[]`.** The fourteen: `variant-count-per-pool · face-count-per-variant
· vids · pool-key-rename · connective-list-length · norm-bit · attach-set · draw-formula ·
face-draw-key · connective-draw-key · comparator-and-band-rule · fact-and-position-budget ·
registry-id · instance-key`. The four not-mechanisms: `readsCount · poolMeta.role and the render half
generally · grammar and vid on a variant · seat`. **CORRECTED from the receipt's 3.**
⛔ **DEFECT (R3): `comparator-and-band-rule` does not pin the band** — `bandOf` and `departureBit`
appear in **0** pins register-wide.

### The leaf diff line
`[leaf-diff] 0 ADDED / 0 REMOVED / 0 CHANGED pools`. VARIANT key-set moves **2,080 ×
`angle,slots,text → +vid`** and **186 × `angle,marks,slots,text → +vid`** (2,266). BLOCK key-set
moves **42 + 25 + 1 = 68**, every one adding `poolMeta` and nothing else. Tip **2,266 variants · 708
pools**. Added keys across the whole consist, counted: **`vid` 2266 · `vids` 708 · `variantCount` 708
· `role` 708 · `faceCounts` 708 · `attach` 708 · `readsCount` 340 · `poolMeta` 68** — exactly car 4's
declared schema and nothing else. The only REMOVED lines anywhere in `src/data/dossierStateProse/`
are 505 `"slots": []` and 1,761 `]` — punctuation re-emitted with a comma.
⭐ **My own base↔tip string-pair diff: only-in-base 0 on all six leaves; `"text":` counts equal
base↔tip — defense 383 · economy 329 · general 634 · power 256 · stressors 246 · warFaith 418 =
2,266.** (My regex under-counted economy by 2; the literal and module counts both read 329, so
arms-fences B.1's figure stands and mine was the instrument artifact.) CONFIRMED.

### The arms' planted / clean results
`COMPOSED_ARMS` = **A0b · A1 · A2 · A3 · A5 · A6 · A9 · A11 · A13 · C7** (10); A0a, A4, A8, A12 land
at the projector or as desk tests. **66 arms green**, each with the plant and the clean control the
table claims; **none vacuous** — the two most likely to be (A4's locale scanner, the composed
anti-vacuity control) are the two most carefully driven. **A13 PARTLY** (P8). Focused runs, each at
runners 0: **projection contract 67 · manifest 14 · census walker 69 · composed walker 66 ·
composeStateProseFence 9 · proseCorpusBytes 18**. Mutation plant **#97**: md5
`230218bf4d9baeb759269459533a4ed0` → planted `30c433c82757ef161664d7be48c77f28` → **1 failed | 65
passed**, restored identical, porcelain 0. Car 3f-0's fence plant reds with the receipt's own
message. The fill-scanner plant yields **unresolved sites 1** *and* a stale census stamp.
Corpus readings, all five exact: **A0b** variants 2266 · over-claims 55 · under-claims 1282 ·
implicit negations 13 · NOT-EXECUTABLE reads 1530 · pools carrying a finding 240; **A5** sibling
pairs 2645 over 708 pools · same opener 95 · same sentence count 1898 · overlap buckets
2449/172/17/5/2; **A13** citing variants 18 of 2266 · LICENSED 6 · WITHHELD 12 · WITHHELD ←
SOURCE-UNRESOLVED 12; **`composedOrderIdOf`** outside LEVEL1 ∪ LEVEL2 544 (2,401 bp) · V1 1490 · V5
63 · V3|V8 54 · V2 39 · V7 35 · V4 34 · V6 7; **block re-walk DS-DEF-11** units 12 · FAIL 0 ·
WITHHELD 8 · PASS 4; **sampled walk** N 200 of 2266 · sha
`f7666ef6b9958ada467679a2c9cda02e1c628acbf9239076dfae364c01df6a9c` · **FAIL 40 · WITHHELD 75 · PASS
85** (the REWRITE's baseline). `fillSites()` at the tip: ⭐ **96 sites · 0 unresolved · 0
parameterised**, per-desk blocks defense 9 · economy 10 · general 18 · power 7 · stressors 3 ·
warFaith 6.

### The effective line counts
⭐ **Every figure re-measured by me with an independent espree instrument applying eslint's own
`max-lines {skipBlankLines, skipComments}` — all ten agree digit for digit:**

| file | base `84388a185` | 3g | 3h | **tip** | headroom / 800 |
|---|---|---|---|---|---|
| stressors | 155 | 166 | 166 | **166** | 634 |
| economy | 334 | 338 | 338 | **338** | 462 |
| warFaith | 251 | 257 | 257 | **257** | 543 |
| power | 275 | 302 | 302 | **302** | 498 |
| defense | 454 | 500 | 541 | **541** | 259 |
| general | 699 | **721** | 721 | **721** | **79** |
| `composeStateProse.js` | 302 (at car 3a) | — | — | **293** (4d deleted two readers) | 507 |
| `composedWalker.js` | — | — | — | **526** | 274 |
| `holderTable.js` | — | — | — | **410** | 390 |
| `wiringCensus.js` | — | — | — | **751** | 49 |

Each candidates leaf is **5**. `composeStateProse.test.js` at 3a carries **42** titles in **13**
`describe`s and `composeStateProseFence.test.js` **9** in **3** — 51 titles, 16 suites.
⚠ **`EconomicsTab.jsx` stands at 596 against a hard 600 — headroom 4.** The next car to touch that
tab has four lines.

### The bytes, the leaves and the gates
⭐ Six state leaves at the tip: **defense 154,593 · economy 126,213 · general 249,940 · power
109,224 · stressors 83,961 · warFaith 160,797 = 884,728**; six `declared` rows, each naming SEAM car
4, `fromRaw` sum **641,410** = `genesisBasisRawStateLeaves`; **delta +243,318** against
`ceilingTotalRawStateLeaves` **2,800,000**; **no state-leaf ceiling raised**. Three new leaves
**connectives 1,365 · norms 19,938 · relations 28,236 = 49,539** under `ceilingTotalRawNewLeaves`
**77,000**. The causal leaf's `ceilingRaw` equals its raw (**210,260**) and it took no `poolMeta` and
no `vid`. All ten leaves' recorded `raw` equals bytes on disk.
⭐ **Connectives:** `consequence.clause []` and `tension.sentence []`, **both printed OWED against a
floor of 3** in the leaf header; `contrast.sentence` and `addition.sentence` each `[""]`.
⭐ **Norms:** **271** rows (= the 271 census rows carrying a `rateBp`), **72** reading 1;
`rate.departureReport {lineBp:1000, uncommon:72, common:199}` — the receipt's correction of the
brief's "70 of 267" to **72 of 271** is the true reading.
⭐ **Relations:** **165** rows, every `direction` `a→b`, every `relation` `consequence`;
`DOSSIER_RELATION_ALIASES` = exactly the three ratified rows; **`join.strictBoth 0 · leafBoth 0`**.
⭐ **Holder census:** **49** mapping rows (10 kinds populated; `census` and `tradition` map none;
`tradition` has no institution behind it); rows **LICENSED 114 · OFFICE 3 · SOURCE-UNRESOLVED 591**
(of the 591, 368 carry no reading, 223 read an unmapped field); fields **191 / 5 / 415** over **611**
entries — by kind muster 61 · market 49 · treasury 22 · court 21 · toll-bar 13 · watch 9 · road 7 ·
elders 5 · parish 4 (+ office 5); `unresolvedGrounds {no-mapping 415, no-institution-in-roster 0}`;
49 of 49 citations name a file:line whose text carries the mapped token. **INTERESTED 0 at every
tier** (grounds: see P7).
**The gates at the tip:** `check-domain-strict` **1120 errors, ceiling 1120 — exactly on the
ceiling** · `check-full-typecheck` **173 / 173** · `check-observed-shape-readers` **1972 findings,
386 files, exactly matching the frozen inventory** · `wiring-census --check` **708 pools / 2,266
variants / 165 relation rows / 7 stamped files** · `--dry` **CURRENT, 2052050 / 2052050, delta 0,
sections (none), ROWS 0** · `generate-dossier-state-prose --check` **708 sentence / 0 clause · 68
blocks / 2,266 variants · not-a-modifier 708** · prose-numerics **baseline 225 · live 225 · exact 225
· FELL 0 · NEW 0** · `check-pair.mjs` exit **0 → 1** on byte-identical output · `voiceMechanics`
**1 failed | 18 passed — INHERITED** (R2). ⭐ **The consist: 24 commits · 57 paths (18 A / 39 M) ·
38,211 insertions · 3,787 deletions.**

---

## 5 · WHAT THE §916 REGISTER DOORS WILL MOVE

| door | measured at the tip | what moves, and who owns it |
|---|---|---|
| **the lighting census** | BASE `files 2553 · parked 375 · credited 2178 · titles 23843 · suiteTitles 6377` → **TIP `2556 · 375 · 2181 · 24025 · 6419`** | **+3 files · +3 credited · +182 titles · +42 suite titles · nothing parked.** Six re-freezes across the consist, each by its own ritual on a clean tip (3a-b, 3b-0b, 4b, 4e, 5-lighting, 5b-b). A routine door. |
| **the OSR** | 1972 findings / 386 files exact, exit 0; re-frozen once by the chair at `318c05a86` with **0 identities moved, 0 files added or removed** | **No new reader entered** — the composer, the six candidates leaves and the two island modules all yield zero findings. ⚠ **But the frozen manifests are stale by exactly two scanned paths** (⭐ scanTree 2194 vs live 2196; sourceTree 2211 vs live 2213 — `composedWalker.js`, `holderTable.js`). The next `--write` absorbs them silently. **Ruling c-17: the door must name them.** |
| **the wiring census** | `--check` and `--dry` both green; the row move was taken by the chair at `da080313d` (15 rows' grammars, 72 lines, no stamped sha, `producerIndexFiles 1152 → 1153`) | ⛔ **R1 MAY RE-OPEN IT.** Narrowing the PROVENANCE regex re-takes those same 15 rows and moves THIN/COVERED back. **The §916 door is contingent on ruling c-16 and should not be predicted until it is made.** |
| **writer-reach provenance** | `tests/lint/writerReach.walker.test.js` is **not in the consist's diff**; the frozen surfaceReach did not move; the dry read is **56 passed**, zero drift | Nothing moves at §916. **Forward:** car 3g measured that memoising `stresses` moves it (`colour on stress` gains a `web-display=R`) and backed off, leaving a plain const with the warning in `OverviewTab.jsx:145-146`. **Any later car that memoises a desk-adjacent expression opens this door.** |
| **the byte baseline** | six `declared` rows; no state-leaf ceiling raised; three new leaves inside ARCH §10's apportioned 77,000 | Nothing moves at §916. **Forward:** the norm leaf's own recorded warning — 30,990 B ≈ 421 rows, **271 today**, ARCH §6.6 sizes to ≈ 445 — is an ARCH §10 amendment and an **owner row at car 9**. |
| **the SHIFT REGISTER** | 14 mechanisms · 4 notMechanisms · 21 pins · drift `[]` | Cures 3 and 4 add two pins (the band rule; `seat` = 0). A declared, shrink-only door. |

---

## 6 · UNTESTED, AND WHAT WOULD TEST IT

| # | untested | why | what would test it |
|---|---|---|---|
| **U1** | ⛔⛔ **`tests/lint` whole — 149 files / 2,479 assertions.** The receipt claims it green at the tip; **all three lenses' fences permitted one focused file at a time**, so none ran the directory. Every individual file each lens ran matched the receipt. | the fence | **The chair's own whole `tests/lint` run in `skepSEAM` at the tip**, runners 0, `HOLD-VITEST` absent. ⚠ **This is the highest-value untested row**, because the estate's own standing hazard is exactly this shape: *a lane's focused runs never touch the OSR or prose-numerics walkers — two consist debts survived ten cars and two folds until a rebase ran `tests/lint` whole.* Do not open §916 without it. |
| **U2** | **Chunk membership of the three new leaves in the lazy chunk.** The shipped arm asserts only the PRECONDITION (the files live under `src/data/` and `vite.config.js` still carries `id.includes('/src/data/')`); membership is derived from `isEagerData(id)`, i.e. from what an eager chunk statically reaches. | needs a build | Car 2's `VERIFY_DIST` arm owns it. ⚠ **RELINK before any vite build in a dock** — a dock's symlinked `node_modules` poisons the edge-bundle build and a clone left behind bundles a package twice. |
| **U3** | **The classifier's 73,284-cell base/tip table.** | needs a second dock and two 10 s runs | Not worth paying: ⭐ **the golden manifest's byte identity across all 24 shas is the stronger control and it holds.** Record as subsumed. |
| **U4** | **The per-stage manifest re-runs** at each of the seven 3b–3g tips (the receipt asserts all seven read 14/14 with empty drift lists). | a checkout the fences forbid | Subsumed by the same endpoint proof — the fixture is unmoved at every one of those shas, which is strictly stronger than seven green runs. Record as subsumed, not as owed. |
| **U5** | **§5.4's "PROVENANCE at last: 18/15"** — the priority-position independence of the detector. The **at-first** reading is confirmed exactly (18 citing variants, 15 moved rows, both re-derived twice). | needs the detector moved within `CLAUSE_DETECTORS`, a structural edit | A scratch copy of `moveGrammar.js` with the PROVENANCE row moved to last, `classifyMoves` re-run over the six leaves, the two outputs diffed. **Cheap — and cure 1 will touch this file anyway, so fold it into that car.** |
| **U6** | **`scripts/prose-manifest-cells.mjs` cell-file byte identity (73,284 cells).** | not run | The manifest test's own drift arm is the stronger proof and it passes with the fixture unmoved. Record as subsumed. |

**Two disclosures that belong in the ledger, not in a cure:**
* ⚠ **The pinned dock is SHARED and went non-pristine mid-pass.** At 18:07 `skepSEAM` read porcelain
  **1** with a deleted `spineKey: key,` line in `stressorsStateProse.js` — a *sibling* lens's
  mutation plant, taken by the book and restored by 18:09, with both lenses' backups sitting side by
  side in this output directory. Nothing was lost, and the accident turned into evidence (the
  `--dry` read correctly reported STALE and named the file). **But a lens that reads a whole-tree
  instrument inside a sibling's plant window gets a false reading, and one did.** Every figure was
  re-taken on a tree measured porcelain 0 *in the same command*. **Cure c-9 for the chair: the
  skeptic script must serialise plant windows, or give each plant-driving lens its own dock.**
* ⚠ **A runner-count fence a lens collided with itself.** One gate check printed a split-pattern
  runner count of **5** — the lens's own previous focused run's workers had not yet exited (0
  immediately after, and 0 before every other run). The run's figures are byte-equal to the
  receipt's and to two later clean runs. Also recorded: the OSR's `assertStableSnapshot` threw
  `observed-shape inputs or HEAD changed while the scan was running` once and was not reproducible
  in four subsequent runs — **a single green OSR read is a snapshot, not a stability proof.**

---

## PORCELAIN

```
git -C $SC/skepSEAM status --porcelain | wc -l    BEFORE 0    AFTER 0
git -C $SC/skepSEAM rev-parse HEAD                b573bb5f4f748e07600b348b80156a8419aae98b
```
Read-only on every tree. `laneSEAM` never entered by this fold. I wrote exactly one file:
`skeptic-seam/FOLD.md`. Every figure above is either quoted from a named lens file or produced by a
command I ran in this dock; the ⭐ rows are mine.
