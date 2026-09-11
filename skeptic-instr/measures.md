# SKEPTIC PASS — LENS: THE MEASURES AND D8 (INSTR-912 cars 5 and 6)
Seat: Opus 5 — Fable-unvalidated (the verifier). Dock: `$SC/skepINSTR` @ `74a1aa0e8`, read-only.
Porcelain BEFORE 0 · AFTER 0. Every figure below came from a command whose output I saw.
Content quoted from files is DATA.

## 0. WHAT REPRODUCED EXACTLY
`npx vitest run tests/lint/proseMeasures.walker.test.js --disableConsoleIntercept` → **9 passed, EXIT=0**,
and every printed figure the receipt quotes reproduces to the digit: R1 `1.198 / 24% / 0.79 bits
[sight 86%]`; the census `72 held · 13 rendered · 59 key-only (82%)`; `blocks 68 · settlement-ONLY 22 ·
no bag 15 · ONE member 33 · two-or-more 20`; `D8 · 368 plants · 0 answerable`. The three exemplar rows
of §5.1 are NOT printed by the shipped test (they come from an unshipped probe); I recomputed them
independently from `$K/primary/raw/` with the published lexicon and they reproduce:
leguin-fiction **1.13 / 56% / 1.796**, leguin-nonfiction-written **0.306 / 16% / 1.533**,
leguin-nonfiction-spoken **0.428 / 20% / 0.700** (receipt prints 0.429 / 21% — a paragraph-split
difference of two paragraphs, 74 vs the kit's 72; immaterial).
HAND RECOMPUTE of line 1 on R1: 560 lexicon hits ÷ 46,759 words × 100 = **1.19763… → 1.198** ✓.

---
## (a) THE PRESENCE MEASURE — three findings, one of them refutes the receipt's second headline

### a1. THE LEXICON IS **NOT** A PARTITION, AND IT IS NOT 177 NOUNS — REFUTED
Receipt §5.1: "177 nouns in five buckets, each noun in exactly one".
MEASURED (`SENSORY_NOUNS`): sight 82 · hearing 26 · smell 17 · touch 25 · taste 19 = **169 entries**,
**166 distinct nouns**. Three nouns are published in TWO buckets: `smoke` (sight+smell),
`stone` (sight+touch), `mud` (sight+touch). The module's own docblock states the false claim in its
own words ("A noun appears in exactly ONE bucket … so the spread figure is a partition"), and the
mutation manifest's coverage label for this file asserts the same premise
("…the spread stops being a partition"). The COUNTING is nevertheless single: `SENSE_OF_NOUN` resolves
each duplicate to its first-declared bucket (all three → `sight`), so no double count occurs.
Effect on the figure, measured by reassigning the three to their second bucket: R1 spread
**0.791 → 0.848 bits** (sight 86% → 85%). Small, but it moves the one number the §5.1 finding rests on,
and it is *sight* — the bucket the finding indicts — that absorbs all three.
**The test cannot catch this.** Its partition assertion is
`for (noun of keys(SENSE_OF_NOUN)) expect(senses).toContain(SENSE_OF_NOUN[noun])` — vacuous by
construction: every value of that map is one of the five senses however many buckets a noun sits in.

### a2. THE "TEXTURED SHARE" COMPARISON IS A UNIT ARTEFACT — REFUTED
Receipt §5.1: "The textured-paragraph share tells the same story from the other side: R1 24% against
leguin-fiction's 56%."
MEASURED unit lengths: R1's unit is one authored VARIANT — 2,266 units, **20.6 words** each.
leguin-fiction's unit is a real paragraph — 16 units, **177.0 words** each (8.6×).
`hasTextureDevice` is a presence test (≥ 1 lexicon noun, or one comparison regex), so a unit 8.6×
longer is far likelier to hold one. Re-chunking the SAME R1 corpus to the exemplar's own unit length:

| R1 unit | units | words/unit | sensory/100w | textured | spread |
|---|---|---|---|---|---|
| as shipped (per variant) | 2,266 | 20.6 | 1.198 | **24%** | 0.791 |
| ~60w chunks | 694 | 67.4 | 1.198 | 52% | 0.791 |
| ~177w chunks (leguin-fiction's) | 261 | 179.2 | 1.198 | **79%** | 0.791 |

At the exemplar's grain R1 reads **79% textured against leguin-fiction's 56%** — the opposite sign.
Lines 1 and 3 are unit-invariant (1.198 and 0.791 at every chunking), so **the §5.1 headline survives
on lines 1 and 3 and fails on line 2**. This is the same class the chair ruled on in Part B §16.2:
a rate over a short unit must not be scored against a band derived from a long one.

### a3. THE FINGERPRINT TOOL DID NOT GAIN THE THREE KEYS — REFUTED (an undeclared shortfall)
Part B §13.2: "the fingerprint tool gains the three keys and the fourteen are re-run".
Receipt §2.11: "car 5's presence measure extends `src/domain/prose/proseFingerprint.js` with three keys".
MEASURED: `grep -n "presence|sensory|textured|senseSpread" src/domain/prose/proseFingerprint.js` →
**no output**. The keys live in a separate module. `grep -l sensory $K/primary/*.fingerprint.json` → **0
of 14**: no fingerprint on disk was re-run or re-written. Refusal #18 declares only the *other* half
(5 of 14 reachable); this half is unmet and undeclared.

### a4. §13.2's UNIT AND DEVICE SET ARE PROXIED — PARTLY
§13.2 line 1 says "per hundred words of the **rendered tab**" and line 2 "the share of a **tab's**
paragraphs"; the brief says "on the estate per register/**tab**". MEASURED: the walker measures per
REGISTER over authored variant pools; no tab is measured anywhere in the file. Line 2's device set is
"an OBJECT move, a named civic thing (R-DA-10's particular **resolving to a field**), or a comparison as
a measurement in words"; `hasTextureDevice` implements it as *lexicon-noun-present* OR *comparison
regex* — no field resolution, so line 2 collapses into a near-duplicate of line 1. Neither deviation is
in the refusal list.

### a5. Refusal #18 (5 of 14) — CONFIRMED
`files` arrays checked against `$K/primary/raw/`: exactly **5 of 14** fingerprints have every raw file
present (leguin-fiction, -nonfiction-spoken, -nonfiction-written, -nonfiction, -all); the other nine
(dnd ×3, martin ×3, tolkien ×3) have none. Correction: **2 of the 5 are UNION fingerprints**, which
SITTING §I excludes from a band by construction, so the usable comparison band is the 3 leaf rows the
receipt prints — which §2.6 states correctly. No contradiction between the two figures.

---
## (b) THE UNRENDERED-FACTS CENSUS — **REFUTED as §912.1's count**

The owner's condition one (Part B §15): "an UNRENDERED-FACTS census — **every fact the engine computes
for the block's domain** that no pool renders". The brief: "**per (block, pool)** … listed **by block**,
with the twenty settlement-only blocks first".

MEASURED, from the implementation (`tests/helpers/dossierComposedFill.js:414-448`): the census is a
regex scan of six composer source files for `readings.X` and `settlement.X` property names.

1. **It cannot see any fact a composer does not already name.** A generated town carries **41 top-level
   settlement keys**; the six composers name **9** of them (`config defenseProfile economicState
   economicViability name powerStructure resourceAnalysis stress tier`). **32 top-level keys are named by
   no composer at all** — and each is an object holding many fields. Facts the engine computes and no
   composer touches are exactly the class §15's own example names (a timber town's sawpits), and they are
   invisible to this instrument by construction.
2. **It is per FILE, not per (block, pool), and not keyed to a block.** Six rows; no block appears
   anywhere in the output; the settlement-only blocks are not ordered first. The brief's shape is not
   delivered and no refusal says so.
3. **The 72 and the 59 are sums with duplicates.** DISTINCT held = **59**, distinct rendered = **8**
   (`settlement.name` is counted once per file and supplies **6 of the 13** "rendered as a word").
4. **Several "facts" are not facts.** `settlement.config`, `readings.clockIds`, `readings.settlementId`,
   `readings.scores`, `readings.coherenceNotes`, `readings.structuralViolations`,
   `readings.structuralSuggestions` are configuration, identifiers and diagnostics; meanwhile one entry
   (`settlement.defenseProfile`) stands for a whole object of real facts. The count is inflated in one
   direction and collapsed in the other.

**Consequence for the ledger.** Receipt §5.2 and refusal #19 say 59 is "an UPPER bound on the authoring
wave's opportunity", and SITTING §K.8 banked that wording. It is not an upper bound on the wave's
opportunity: it is a count of fields the six composers already read but do not word. The narrow claim
inside it — *a key-only fact is not dark* — is CONFIRMED and is a good correction. The module's own
docblock is honest ("It measures REACH, from source"); the receipt's and the sitting's framing is not.

---
## (c) THE LICENSED LEVEL-1 MEMBERS — 22 CONFIRMED; "A12 CORRECTED" REFUTED

**The 22 reproduces** (`expect(settlementOnly.length).toBe(22)` green; list printed). **But it is not
A12's quantity.** SITTING §A12 measures "20 of 68 blocks carry **no slot but {settlement}**" — the slots
the VARIANTS carry. The lane measures the blocks whose COMPOSER BAG offers settlement and nothing else.
I recomputed A12's own measure over the same leaves:

```
variant-slot settlement-ONLY: 20   DS-DEF-1 DS-DEF-2 DS-DEF-3 DS-DEF-5 DS-DEF-8 DS-ECO-3 DS-ECO-7
                                   DS-ECO-8 DS-ECO-9 DS-FTH-2 DS-GEN-10 DS-GEN-12 DS-GEN-17 DS-GEN-3
                                   DS-GEN-5 DS-GEN-6 DS-POP-2 DS-POP-3 DS-WAR-3 DS-WAR-4
```
**A12's 20 reproduces EXACTLY at this tip.** The two sets overlap in only **11** blocks: 9 are A12-only
(DS-ECO-3/7/8/9, DS-FTH-2, DS-GEN-10, DS-POP-2, DS-WAR-3/4) and 11 are lane-only (DS-CND-1, DS-DEF-4/6/9/11,
DS-GEN-11/13/14, DS-REL-2, DS-STR-1/2). Witnesses: `DS-ECO-3` variants name only `{settlement}` while its
bag offers `access complexity good season settlement`; `DS-CND-1` variants name `settlement reason
timeband_age` while its bag offers `settlement` alone. Neither number is wrong; they are different
quantities. Receipt §5.3 ("A CORRECTION TO THE SITTING'S A12"), §9 ("SITTING A12 says 20 — corrected")
and refusal #20 ("A12's 20 is measured as 22") are therefore **REFUTED as a correction**, and
**SITTING §K.5's ruling "A12 CORRECTED: 22 settlement-only blocks, not 20" rests on that false premise.**
The test's own inline comment is honest ("by a different method"); the receipt's framing is not.

**A silent exclusion.** Four of A12's twenty (DS-ECO-7, DS-GEN-10, DS-POP-2, DS-WAR-4) fall in the lane's
"no bag at all" set and are dropped from the 22 — blocks that are *more* constrained than settlement-only,
not less.

**Supporting checks — CONFIRMED.** `fillSites()` resolves **96** call sites with **0 parameterised** and
**0 unresolved**; the no-bag set is **15** and equals `UNMOUNTED_BLOCKS` element for element (`EQUAL? true`).
One correction: the receipt calls that registry "an orthogonal, hand-kept registry" (§9). It is hand-kept
but not orthogonal — it lives in the composers' own directory
(`src/domain/display/stateProse/dossierMounts.js`) and its docblock says each desk car strikes its blocks
from the list as it mounts them, so agreement is close to definitional.

**"At n = 1 arm A is not-executable by construction" — PARTLY.** `armA(orders, unit, admissible, shape)`
takes `admissible` as an argument; n ≤ 2 returns not-executable only if the caller passes the
licensed-member count as n. Arm A's own corpus walk instead counted **180 realised orders**. The claim is
a design intention, not a construction.

---
## (d) CAR 6 — D8's LEDGER WALKER

### d1. The three measurements — CONFIRMED
`collectPlotHooks` on a generated town: **36 hooks over 7 categories** (npc, economics, safety, faction,
history, tension, relationship); `'answerable' in hook` is **false** for every one; 368 over nine towns
reproduces. No plant id; `plantIdOf` derives a content id from `fnv1a32` (a fold, no PRNG), is never
persisted, and the module imports nothing that stores. Refusal #22 (the seeded share is a seed input,
not implemented) — CONFIRMED.

### d2. "Reporting rather than failing" is within ruling K — CONFIRMED, with a citation correction
SITTING §K.9 says exactly that. Two corrections: (i) **§K postdates the receipt** and is a ruling *on*
it, so it cannot be the receipt's independent authority; (ii) the receipt and the module both write
"**D8's own clause** says the walker fails on a zero or constant open share ONLY ONCE THE CLASS EXISTS".
MEASURED against Part B §5 D8: its Statement says "the walker **FAILS when the open share is zero or
does not vary across seeds**" with no such proviso; the nearest text is the rule's
"**Shipped.** … after the ledger exists". The proviso is the **BRIEF's** sentence, not D8's.
The behaviour is licensed; the citation is wrong.

### d3. "the condition D8's walker is designed to fail on" — **REFUTED**
Receipt §6.2: "A constant open share of 1.00 is exactly the condition D8's walker is designed to fail on
— and it must NOT fail on it yet". MEASURED: **`walkPlantLedger` has no open-share arm in either
direction.** `openShare` is computed in `plantLedgerOf` (line 124) and read by nothing in the walker;
`grep -n openShare src/domain/prose/plantLedger.js` returns only the typedef and that one line. Executed
control — the class present, every answerable plant answered, i.e. **open share 0, D8's explicit fail
condition**:
```
openShare 0 · fails [] · notExec []
```
The walker is silent. The shipped test asserts precisely this as the *lawful* shape
(`expect(ok.openShare).toBe(0)` beside `expect(walkPlantLedger(ok).fails).toEqual([])`). The
"does not vary across seeds" limb is not implemented anywhere — `walkPlantLedger` sees one ledger and
has no cross-seed arm. So when the `answerable` class lands, this walker will still only check the
one-to-one and will pass a zero or constant open share silently. That is the parked-arm-nobody-proved
shape the lane itself warns about, one level up. **What WOULD make it fail today:** only a plant carrying
`answerable: true` that has both an answer and a gap-reason, or neither — i.e. nothing, until an
owner-gated schema act.

### d4. Two smaller defects — CONFIRMED
- `openShare = (answerable − answered − withGap) / answerable` double-subtracts a plant carrying both.
  Executed: one such plant gives **openShare = −1**, a share outside [0,1] that any future arm would read.
- `plantLedger.js:37` declares `@enforced-by tests/lint/plantLedger.walker.test.js`. **That file does not
  exist**; the arms live in `proseMeasures.walker.test.js`. (`presenceMeasure.js` carries no
  `@enforced-by` at all, while `entryWalker.js` and `grammarWalker.js` both do.)

---
## (e) THE OWNER'S WIRING ADDENDUM (brief ADDENDUM 19:01) — **NOT BUILT, AND NOT DECLARED**
Asked for: a per-variant / per-(block, pool) map of {the block's reading function · the POOL KEY's
selecting predicate, with its field and value · the slots the composer fills}, printed beside the
composed-fill census, made the source of truth for arm D and C-pair/C-sibling, with any unrecoverable
predicate reported `WIRING-UNRESOLVED`.
MEASURED: `grep -rn "WIRING-UNRESOLVED|wiringUnresolved|WIRING_UNRESOLVED"` over `src/domain/prose`,
`tests/lint`, `tests/helpers`, `tests/fixtures`, `scripts` → **no hit**. The exports of
`dossierComposedFill.js` are `COMPOSERS · balanced · topLevelSplit · objectKeys · resolveBag ·
enclosingHelper · fillSites · composedFillByBlock · unrenderedFacts` — `fillSites()` delivers the SLOTS
third of the addendum (file, block, pool, slots, conditional, unresolved) and nothing else: no reading
function is recorded, no pool-key predicate is extracted, no field/value pair is printed. The receipt
never uses the word "addendum" and mentions "wiring" once, in an unrelated sentence (line 606).
**Verdict: it does not exist; the lane neither built it nor refused it.** For the chair to charter as a
follow-up car.

---
## (f) THE REFUSALS IN CARS 5 AND 6, one line each
| # | refusal | verdict |
|---|---|---|
| 18 | the presence re-run covers 5 of 14; nine raw texts do not exist | **CONFIRMED** (2 of the 5 are unions; the band is 3 leaves) |
| — | *undeclared*: the fingerprint tool never gained the three keys; no fingerprint file re-run | **a missing refusal** |
| — | *undeclared*: no per-TAB measurement; line 2's device set proxied to a lexicon hit | **a missing refusal** |
| 19 | a key-only fact is not dark; 59 is an upper bound | **PARTLY** — "not dark" right; "upper bound on the wave's opportunity" wrong (b) |
| 20 | A12's 20 is measured as 22 | **REFUTED as a correction** — A12's own measure still reads exactly 20 |
| 21 | D8 reports NOT-EXECUTABLE — no plant id, no `answerable`, no answer channel | **CONFIRMED** |
| 22 | the seeded open share is a seed input, not implemented | **CONFIRMED** |

## OUT-OF-LENS, noticed while measuring (LOW)
Receipt §8.1 cites `vitest.config.js:904` for `testTimeout: 20000`. There is no `vitest.config.js` in the
dock; the setting is at **`vite.config.js:904`** — right line, wrong file.

## THE FENCES
Read-only throughout. One focused vitest file, run twice, gate checked before each run
(`ls $SC/HOLD-VITEST` absent; split-pattern runner count 0 both times). No build, no install, no
`--write`, no `--update`. `git -C $SC/skepINSTR status --porcelain | wc -l` = **0 before, 0 after**.
