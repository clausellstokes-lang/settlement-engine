# SKEPTIC PASS — LENS: THE B-GRAMMAR WALKER (car 2, `d63f80207`, read at tip `74a1aa0e8`)
Seat: Opus 5 — Fable-unvalidated (the verifier). Dock read-only: `$SC/skepINSTR`.
Porcelain BEFORE 0 · AFTER 0. Writes confined to `$SC/skeptic-instr/`.

## COMMANDS EXECUTED (every figure below comes from one of these)
```
git -C $SC/skepINSTR status --porcelain | wc -l                       -> 0   (before and after)
git -C $SC/skepINSTR log --oneline -1                                 -> 74a1aa0e8
ls $SC/HOLD-VITEST                                                    -> absent
V=vit; V2=est; pgrep -fl "$V$V2" | grep -v gate-mutex | wc -l         -> 0    (before each run)
cd $SC/skepINSTR && npx vitest run tests/lint/proseMoveGrammar.walker.test.js
                                                                      -> Test Files 1 passed · Tests 42 passed
   (re-run with --disable-console-intercept to capture the walker's own prints)
node per-paragraph-skep.mjs        (the receipt's per-paragraph.mjs, import repointed to skepINSTR)
node probe-fp-parity-skep.mjs <3 raw texts>   (the receipt's probe-fp-parity.mjs, likewise)
node reading-sequence-skep.mjs 3   /  reading-lines-skep.mjs 3   (the receipt's reading-sequence.mjs, likewise,
                                    the second variant dumping block/pool instead of only orders)
```

## VERDICTS

### (a) THE CEILINGS — CONFIRMED
`ceilingFor(n, shape)` returns `null` for `n <= 2` and `Math.min(1/n + shape.slack, shape.ratioCap/n)`
otherwise; `CHAIR_CEILINGS` supplies `slack 0.10`, `ratioCap 1.5`. The gate asserts 0.4333 / 0.35 /
0.30 / 0.25 / 0.1875 at n = 3,4,5,6,8 and `ceiling(n)/(1/n) <= 1.6` at n in {3,4,5,6,8,12,20}; all 42
assertions green in my own run. Arm B1's ceiling is `1/n + max(2 SE, runFloor)` with the two
dominance cases asserted (n=4 at 40 samples > 0.30; at 100000 ~ 0.30). The numbers live in the
fixture, not the module — a caller with no shape gets NOT-EXECUTABLE, never a pass. As claimed.

### (b) "THE CLASSIFIER REPORTS AND DOES NOT GATE" — PARTLY
True of arm A as the shipped caller uses it (the corpus walk passes no `ceilings`, so armA returns a
NOT-EXECUTABLE row). Three qualifications the receipt does not carry:
1. `classifyMoves` output feeds a FAIL channel through arm F: F1 (cause before state) and F3 (an
   ABSENCE opening / adjacent) are computed from the move sequence, and both appear in the corpus
   walk's own printed `fails by arm` line. The 0.75–0.83 precision therefore already reaches findings.
2. `walkGrammar` gates arm A on classifier-derived orders the moment ANY caller supplies `ceilings`;
   there is no tagged/untagged split in the code, so SITTING K.2's later rule (arm A reads the TAG on
   tagged pools, the classifier only reports) is NOT implemented, and that path is untested.
3. Three assertions turn on classifier output: the `ARM_CONTROLS` F-arm loop, `exact > baseline` in
   the hand-tag test, and `fails.length > 0 && < corpus.length` in the corpus walk.
Reproduced exactly: 20/24 exact, 18/24 conservative, 22/24 first move.

### (b2) §2.8's ARM LIST INCLUDES AN ARM-A FAIL — REFUTED
Receipt §2.8: `fails by arm: A, D, F1, F2, F3, F6, G/FEELING, G/FIGURE, G/FORECAST, G/MEANING`.
My run of the same test at the tip prints:
`fails by arm: D, F1, F2, F3, F6, G/FEELING, G/FIGURE, G/FORECAST, G/MEANING` — no A.
The A row is a stale pre-car-7 print (car 7 removed the baked ceiling). It is the one arm the receipt
declares non-gating, and the receipt's own walk line reports it failing.

### (c) THE 200-TOWN READING SEQUENCE — REFUTED
`reading-sequence.mjs` harvests only objects carrying `{blockId, poolKey, text}` or
`{sentence, provenance.blockId}`. `generalDeskLines` returns bare sentence STRINGS — its `line()`
helper is `drawnAtMount(mount, rung)?.sentence ?? null` — so NOTHING from the general desk can be
harvested. Executed (3 towns, the same script): 29 lines, 29 of 29 from `powerStateProse`
(DS-POW-1 ×2, DS-POW-2 ×2, DS-POW-4 ×2, DS-POW-5, DS-POW-6, DS-POW-7 per town), 0 from the general
desk, `composer throws 0`. So the "composed dossier reading … through the SHIPPED composers" is ONE
composer and seven blocks of sixty-eight. The headline V1 78.4% / run 0.618 is a POWER-DESK figure,
not a dossier one — and SITTING K.2 carries it as the wave's case.

### (c2) THE ABSENCE-POOL HAZARD IS NOT FULLY AVOIDED — CONFIRMED (a real, undeclared instance)
The probe passes three of the four readings `PowerTab.jsx` passes; `politics` is omitted.
`politicsPresencePoolKey(null, …)` does not return null — it returns
`'layer DORMANT (no ledger materialized)'`. Measured: DS-POW-7 draws from that pool in 3 of 3 towns,
one line per town (~10% of the sequence), the SAME pool key on every seed. `gen-probe2.mjs`'s own
comment ("DS-POW-7 goes silent") is wrong, and the receipt inherits it. The general desk is likewise
called with `{seed, audience}` only, so `stresses`, `populationTrend`, `neighbours`, `steadings`,
`ancientRuin`, `lifecycleStatus` and `crossEngagements` — all caller-supplied in the shipped tabs —
are absent. None of these three limits is stated in §2.5.

### (d) THE THREE NUMBERS — figures CONFIRMED, "reproduces the sitting exactly" PARTLY
Reproduced from `per-paragraph.mjs`:
```
REGISTER LEVEL: exceeded per record min 1 · median 4 · max 7 of 21 · records at ZERO 0 of 10
                max depth: median 0.52, max 1.68
PER PARAGRAPH (113 paragraphs, 3 of 10 registers, all Le Guin):
                exceeded share median 57% · p90 67% ; depth median 0.25 · p90 1.75 ; 0 of 113 at zero
```
Every number in §2.6 reproduces. The word "exactly" does not: SITTING §I reports median **3.5**, the
script prints 4 (`ns[floor(n/2)]`, an upper median); and the sitting's 0.52 is the **p90 of the pooled
exceedance depths** while the script's 0.52 is the **median of the per-record MAX depths** — the same
number reached by a different statistic. The ten records carry 40 exceedances in my run; the sitting
says 41.

### (e) FINGERPRINT PARITY — CONFIRMED, and the lens's premise corrected
`s12-sitting/verify/fp.mjs` computes no fingerprint: it reads the precomputed `*.fingerprint.json`
and prints bands, so there is nothing to compare against. The receipt's parity is against
`$K/fingerprint.mjs`, and it holds — I ran it on THREE texts, not the receipt's two:
```
leguin_fiction            sentences 162 = 162 | paragraphs 16 = 16 | PARITY: all 21 identical
leguin_nonfiction_spoken  sentences 351 = 351 | paragraphs 72 = 72 | PARITY: all 21 identical
leguin_nonfiction_written sentences 281 = 281 | paragraphs 81 = 81 | PARITY: all 21 identical
```

### (f) EVERY ARM CARRIES A CONTROL THAT CAN FAIL — REFUTED in four places
1. **Arm E has no fail channel at all.** `armE` emits only notes; the uniform-grammar,
   repeated-opener and uniform-segment shares are computed into `figures.spread` and compared to
   nothing. MOVE-GRAMMAR §4.4 control 4 requires today's R1 leaves to RED on arm E; the test instead
   measures 407/708 and 79/708 directly through `segmentCount`/`openerOf`, bypassing armE. Not
   declared in §2.9.
2. **Arm B2's only control asserts SILENCE.** Its condition is
   `runRate > 2*(1/n) && runRate <= runCeiling`, and `runCeiling = 1/n + max(2 SE, runFloor)`, so it
   is unreachable unless `1/n <= max(2 SE, runFloor)` — with the chair's `runFloor` 0.05 that means
   n > 20, or a sample small enough for 2 SE to exceed 1/n. No control fires it.
3. **BUDGET is never asserted to fail.** The test titled "BUDGET fails a unit exceeding more than a
   third…" asserts only `scored > 10` and `exceeded.length > 0`. SPREAD's test asserts only
   `Array.isArray(figures.spread)` — an empty array passes.
4. **Arm F implements 4 of the 10 declared walls.** `WALLS` carries ten and the test pins the
   scoping roster `[4,5,6,8,9,10]`, but `armF` detects walls 1, 2, 3 and 6 only. Walls 4, 5, 7, 8, 9
   and 10 have no detector, no control and no NOT-EXECUTABLE row — including wall 10 (the
   settlement-token opener, dossier-scoped), whose raw material the same run counts at 103 of 400
   variants. Not declared in §2.9.

### (f2) WHICH ARMS ARE SILENT ON THE SHIPPED CORPUS — CONFIRMED (executed)
Firing: D · F1 · F2 · F3 · F6 · G/FORECAST · G/MEANING · G/FEELING · G/FIGURE.
Silent or not-executable: A (no ceiling shape) · B1/B2/B3 (no sequence) · C-sibling (zero fails) ·
E (notes only, by construction) · G/VERDICT · G/SAYING · I (always) · J (notes) ·
BUDGET/DEPTH/PERFECTION/SPREAD (no bands). Reproduced level-1 figures exactly:
`n = 180; V1 60.6% · GEOGRAPHY→PRESENT 4.9% · V5 2.5% · V3|V8 2.2%`; index-0 `V1 455`;
`untagged 2734 of 2734`; `pools 786 — uniform grammar 37.9%, uniform segments 56.9%, repeated
opener 12.6%`; and the gap census line for the first 400 R1 variants, byte-for-byte as §2.8 prints it.

### (f3) GAP (e) — "keyed on (block, pool)" — REFUTED
`walkGrammar`'s comment says "ARM D — the licence, keyed on (block, pool) as gap (e) requires", and
the code reads `input.composedFill.get(String(entry.block))` — block only; the test builds the map
with `composedFillByBlock(fillSites())`. Gap (a) is likewise a register total
(`figures.gaps.settlementOpeners`), not the per-POOL count SITTING §J asked for.

### (g) THE REFUSALS §2.9 — 6 of 7 CONFIRMED
2 (three numbers reported, not applied) · 3 (no exemplar band or exemplar name appears in any file
this lane changed — grepped over the whole diff) · 4 (`grammar` absent from all 2,734 R1+R2 variants,
asserted) · 5 (arm I always NOT-EXECUTABLE) · 6 (arm J notes only) · 7 (`orderIdOf(['PRESENT',
'ABSENCE']) === 'V3|V8'`, asserted) all hold. Refusal 1 (arm A does not gate) is PARTLY — see (b).

### THE PROMISE (car 2) — CONFIRMED
Outside the two modules themselves, `moveGrammar`/`grammarWalker` are referenced only by
`tests/lint/proseMoveGrammar.walker.test.js` and `scripts/mutation-sweep.sh`. Nothing under `src/`
imports either; nothing runs at the draw.

## TWO SMALL CORRECTIONS (documentation, low)
- `moveGrammar.js`'s header points the hand-tagged sample at `tests/fixtures/grammarHandTagged.js`;
  the file is `tests/fixtures/grammarControls.js` and no such path exists in the dock.
- §8.1 cites `vitest.config.js:904` for `testTimeout: 20000`. The dock has no `vitest.config.js`;
  the setting is `vite.config.js:904`. (Car 7, outside this lens; recorded because the line number
  is right and the filename is not.)
