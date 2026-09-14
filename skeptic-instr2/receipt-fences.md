# SKEPTIC FOLD 2 — LENS: THE RECEIPT CORRECTIONS, THE U ROWS, THE FENCES AND THE REGISTER

Seat: Opus 5 — Fable-unvalidated (the verifier). Dock read: `$SC/skepINSTR2` @ `454d478a1` over
`3b1c0eaa5`, pinned, read-only except one plant applied and restored under the protocol.
`git -C $SC/skepINSTR2 status --porcelain | wc -l` = **0 before, 0 after**.

**CONFIRMED 21 · REFUTED 2 · PARTLY 6 · UNTESTED 2.** Nothing in the census or the fences moved.
The two refutations are (1) the Part B §18 edit, which is not the minimal string replacement the
brief licensed and whose OWED row names a phrase the file does not contain, and (2) the meaning
of the K.2 figure that went into that spec — **V1 is the classifier's FALLBACK class, and
composing before classifying destroys the slot half of its evidence**, so 0.8650 is a
rendered-line figure, not a statement about the prose's grammar.

---

## A · THE 42 RECEIPT ROWS (items 19–60 of FOLD §3b, plus 32b)

**Coverage — CONFIRMED.** 43 rows are written; the numbers present are 19…60 with no gap, plus a
supplementary `32b`. Every one of the fold's items 19–60 has a row. (Command: the corrections
table at `receipt-instr-912.md:1414–1469`, row ids extracted and counted = 43.)

**Arithmetic — PARTLY (LOW).** §9.8 says *the fold's sixty cures are discharged: 18 code · 42
receipt · 12 spec*. Those three sum to **72**, not 60. The error is inherited: FOLD §3b's own
heading says "RECEIPT CORRECTIONS (30)" while its items run 19–60 (42 items), and the fold's
headline arithmetic (18+30+12=60) is the wrong half. The car-9 brief already carried the right
number ("must be 42: 19–60"). The receipt should say **72 cures (18 · 42 · 12)** and note the
fold's heading was the miscount.

**Form — PARTLY (LOW).** The brief asked for "the superseded sentence **quoted**". **14 of the 43
rows describe the superseded material instead of quoting it**: 22, 23, 25, 31, 38, 40, 41, 43,
47, 53, 54, 57, 59, 60. Seven of those point at a LIST or TABLE (a refusal list, an OWED table,
a six-figure census) that no single sentence can carry, so the substitution is reasonable; the
receipt's own preamble says "strikes its sentence **by reference**", which is the honest
description and differs from the brief's word. Five (25, 31, 40, 41, 57) paraphrase where a quote
was available.

**Measured column — PARTLY (LOW).** Two rows carry neither a figure nor a command: **39**
(names the seed `census-hamlet` and the duty it found — adequate) and **41** (quotes the regex —
a code fact). Both are fold items that asked for a DECLARATION, not a measurement, so nothing is
owed. Rows 22, 33, 35, 37, 47, 50, 53 carry a named code symbol or a spelled-out number rather
than a digit; all are "declare/withdraw" items. **No row states a measurement it did not take.**

### Rows re-executed at the pinned tip

| row | claim | verdict |
|---|---|---|
| **20** | roster 35 → 249; candidates called absent 25 → 12; census row 3 → 0 | **CONFIRMED to the unit** (§C below) |
| **25** | the walk prints ten arms and no `A` | **CONFIRMED verbatim** — `fails by arm: D, F1, F10, F2, F3, F6, G/FEELING, G/FIGURE, G/FORECAST, G/MEANING` |
| **29** | gap (a) per pool: register total 103 · 89 of 132 · more than one 14 · max 2 | **CONFIRMED verbatim** from the walker's own print |
| **28** | arm E FAILS at 298/708 and 407/708 against 0.30 / 0.40 | **CONFIRMED** — two `RED` lines printed by the arm |
| **36** | 1,678 rows · 1,655 live-or-none · 32 duty-kind · `settlement.services` 0 | **CONFIRMED to the unit** (§B, U2) |
| **43** | 23 rows over 30 settlements, 0 duty-kind, the five institution labels | **CONFIRMED** — 23, and the five labels reproduce exactly |
| **56** | manifest `invariants` unchanged at 667, `meta` 12 → 15 | **CONFIRMED** — 667/667 and 12/15 measured across `0b05e3a7a` → `8c53ddef1` |
| **59** | the C3 class reports zero over 3,132 entries | **CONFIRMED** — the corpus the census walks is 3,132 entries |
| **32b / U3** | 374 lines all distinct, 397 sentences all distinct | **CONFIRMED to the unit** (§B, U3) |

---

## B · THE U ROWS

### U1 — plant #77 ⇒ 4 red of 17, `cmp` restore — **CONFIRMED, EXECUTED**
Applied the sweep's own perl to the pinned dock under the protocol (backup first, `cmp` after).
The perl target matches the shipped bytes and occurs **exactly once**.
```
Tests  4 failed | 13 passed (17)
  × `whoIsCounted` is OPEN on every tier, and holds a BAND rather than a roll
  × derives every `closed` flag from the source roster …
  × holds the three partially-filled columns OPEN …
  × gives the `whoIsExempt` arm a WORLD …
```
Restored: `cmp` byte-identical, `md5` back to `12401cb8bae0a859204ec67910182925`, porcelain 0,
and the file re-runs **17 passed (17)**.

⚠ **PARTLY (LOW) on the receipt's md5.** §9.4 gives one md5 for all four plants,
`a1670cfbb22b894e2e051d60992ff2aa`. The committed file's md5 at `8c53ddef1`/`454d478a1` is
`12401cb8bae0a859204ec67910182925`. The receipt's value is of an intermediate working copy —
car 9's own anti-vacuity cure (`institutionTable.js:207`) landed after the plants ran — so the
quoted md5 **cannot serve a successor as the restore check it looks like**. The porcelain-0
evidence is sound; the md5 should be re-taken on the committed bytes or labelled as in-flight.

### U2 — 30 named seeds ⇒ 1,678 / 1,655 / 32 / 0 — **CONFIRMED to the unit**
Reproduced independently against the pinned dock (`estate-<tier>-0…4` over six tiers, culture
`germanic`, terrain `grassland`, road access), using the module's OWN `DUTY_SERVICE_KINDS`:
```
settlements 30 · rows 1678 · live-or-none 1655 · nonLive 23 · duty 32 · settlement.services 0
nonLive institutions: (lawless) · (informal) · (street gang) · (arcane underground) · (smuggling)
```
The 23 non-live rows and their five labels are exactly row 43's, so U2 and row 43 corroborate.

### U3 — 374 lines all distinct — **CONFIRMED to the unit, reproduced**
`loadCrierVoice()` at the tip: **374 rows · 374 distinct · 397 sentences · 397 distinct · 0
duplicate lines.** Nothing to deduplicate on either unit, so the receipt is right that
PROBE_ALL's 373 does not follow from this corpus by dedup, and right to carry the real cause
UNRESOLVED.

### U4 — PROBE_ALL's 50 excludes the three bare strings and names a fourth file — **CONFIRMED**
`PROBE_ALL.md:261` prints R4b n = 50 over
`display/{heraldIntegrity,heraldCausalVoice,causeWalk,causeLifecycleVocabulary}.js` — **four**
files, and `heraldCausalVoice.js` is one the loader never reads. The loader at the tip reads
**53 = heraldIntegrity 18 + causeLifecycleVocabulary 32 + causeWalk 3**, and the three causeWalk
rows are exactly `NO_DEEPER_MEMORY`, `LEDGER_DARK_LINE`, `REDACTED_HOP`. None of their texts
appears anywhere in PROBE_ALL. The two 50s were an agreement between different rosters, as the
receipt says; the one-time shift is correctly declared.

### U5 — the tagged/untagged split — **CONFIRMED (artefact present, arm green)**
`tests/fixtures/grammarControls.js:322` exports `TAGGED_POOL`; the move walker consumes it at
`:340` and separately classifies the same texts at `:356` so the test can tell which half the arm
read. The file runs **49 passed (49)**.

### U7 — the named message reds twice; `failing > 4` does not — **CONFIRMED to the unit**
Reproduced **without touching the dock**, by mutating the anchor text in memory and re-walking:
```
corpus 3132
failing BEFORE the anchor cure: 251
failing AFTER  the anchor cure: 250      delta 1 · FAILING_FLOOR = 4 · 250 > 4 ⇒ no red
the anchor entry fails BEFORE: VOICE_LINES::war::onset#4 [a totality over an open column]
the anchor entry fails AFTER : (none)
```
The census bound does **not** red, exactly as the receipt corrects the fold's prediction. The
"named message" half is structurally confirmed too: the string
`the breach text is no longer in the corpus` occurs in **exactly 2** assertions of a file that
runs **24 passed (24)** — "2 red of 24".

### U8 — zero verdicts flip — **CONFIRMED**
Reproduced on my own construction: the shipped table at seed `census-town` reads
`whatItCounts=true whatItDoes=false whatItDoesNotDo=false` (cure 6's outcome), and the 3,132-entry
corpus walked through `settlementGround` with the three columns forced CLOSED and forced OPEN
gives **148 failing either way and 0 verdicts that flip**. The load-bearing claim — cure 6 changes
no corpus verdict — holds. The receipt's companion integer **159** does not reproduce under my
construction (148); the receipt never names the settlement its ground came from, so the two are
not comparable. **PARTLY (LOW): name the ground's seed beside the 159.**

### U6 — **UNTESTED, and correctly declared.** The whole `tests/lint` suite is forbidden here and
the fold prescribes it on the MERGED tree after H3's refreeze. Not run.

---

## C · THE K.6 RE-PUT — SEVEN → FOUR

**CONFIRMED, and by a stronger measurement than the receipt's.** I walked the whole corpus
(4,694 entries incl. the annex join) under **three** rosters, not two:

```
NARROW (35 roles, the pre-cure ground)   C2-office fails 3
   VOICE_LINES::authority::onset#3  · ::relief#3 · ::fade#3   (all three, the reeve lines)
ROLES-ONLY (188: the 35 ∪ POWER_ROLES_BY_CATEGORY, NO keyword table)   C2-office fails 0
WIDE (249, the shipped union)                                          C2-office fails 0
HIDDEN BY THE KEYWORD HALF (fail on roles-only, pass on wide):  (empty)
```

Three findings the chair should have:

1. **The three crier lines were the only three**, and they are genuine false positives. `reeve`
   is held by `POWER_ROLES_BY_CATEGORY` (`Reeve`) — a real role source two generators consume —
   **not** by the keyword table. The union is not what rescued them; the missing role list was.
2. **The keyword half hides nothing.** The set of entries that fail on a roles-only roster and
   pass on the wide one is **empty**. So the answer to "did the wider roster hide a real breach"
   is measured NO, not argued NO.
3. **The roster figures reproduce to the unit** with the arm's own predicate
   (`officeCol.values.some(v => lower(v).includes(noun))`): roster **35 → 249**; of 37 office-noun
   candidates, absent **25 → 12**. `bailiff` stays absent — the Brackwater lesson intact.

⚠ **One looseness worth banking, not a breach (LOW).** Three of the thirteen newly-held nouns —
`sheriff`, `constable`, `sergeant` — are held **only** by `ROLE_CATEGORY_KEYWORDS`, a
categorisation vocabulary, and by no instantiated role list. Today no corpus entry turns on them
(finding 2), but a wave car that authors a line naming a constable will pass C2 on a keyword
rather than on an office the world instantiates. The walker's docblock already declares the
fourth source unreachable; it should also declare that the keyword half licenses by VOCABULARY.

---

## D · THE FENCES

**The island — CONFIRMED, and it is the fold's three modified files, still.**
`git diff --name-status 3b1c0eaa5..454d478a1` = **25 files: 22 additions, 3 modifications**.
The three modifications are exactly `scripts/mutation-coverage-manifest.json`,
`scripts/mutation-sweep.sh`, `tests/lint/.lighting-census-baseline.json` — cars 8 and 9 added
**no new modification of a pre-existing file**. Additions: `src/domain/prose/*` (nine modules),
`src/domain/institutions/institutionTable.js`, four `tests/fixtures/*`, two `tests/helpers/*`,
six `tests/lint/*.walker.test.js`.
*(Correction to FOLD §4, which reported 20 files / 17 additions at `74a1aa0e8`: the measured
figure there is **21 / 18**. The fold undercounted the additions by one.)*

**Zero product bytes — CONFIRMED by two independent scans.**
For every one of the ten lane modules, `grep -rln <module> src/` outside
`src/domain/prose/` and `src/domain/institutions/institutionTable.js` returns **[]**. A repo-wide
scan (excluding `.git`, `node_modules`) finds the ten modules named **only** in
`src/domain/prose/*`, `institutionTable.js`, `tests/*` and `scripts/*`. Nothing under `api/`,
`supabase/`, `src/components/`, `src/pages/` reaches any of them.

**The byte fence — CONFIRMED and non-blind.** `tests/lint/proseWiringCensus.walker.test.js`'s
arm (e) is a genuine equality with its own non-blindness control:
`expect(hits).toEqual(['src/domain/prose/wiringCensus.js'])` plus `expect(hits.length).toBe(1)`.
It reproduces my own grep. ⚠ **The arm fences `wiringCensus` only** — the other nine modules have
no such arm. They are clean today (measured above); a wave car could wire one and no gate would
say so. **Owed (MED): generalise arm (e) to the island, or say in the receipt that it covers one
module.**

**The ONE Part B edit — REFUTED (MED).**
`RULES-V2-PART-B.md:645` (§18, bullet §16.2) now ends:
`… V1 share 0.8650 · run 0.7525 (measured by INSTR car 9 …)` — a **27-word** parenthetical
naming car 9's own sha. Two consequences:

1. The brief licensed *one exact string replacement of* `V1 share ____ · run ____`. The text
   actually written is that swap **plus** a new 27-word parenthetical, so the edit exceeds the
   licence. (It also names `8c53ddef1`, a sha the car could not know before committing — so this
   is a post-commit edit to a spec, made outside the car's own fence statement.)
2. §9.2 and §11 (f) say the trailing parenthetical *"(blank until measured — a blank is not a
   number)"* **is stale and is left untouched**. That phrase occurs **nowhere** in the file
   (`grep` over the whole of `RULES-V2-PART-B.md`: 0 hits) and nowhere else in the scratchpad.
   Either it was replaced (and "left untouched" is false) or it never existed. **The OWED row (f)
   as written points at nothing.** What IS stale in that sentence is the future-tense clause
   *"replace them here when car 9 lands"*, car 9 having landed. The OWED row should name that
   clause instead.

**The lane's other spec touches — CONFIRMED clean.** `CLERK-LAWS.md` and `MOVE-GRAMMAR.md`
both carry mtime `2026-09-07 23:31:29` (the chair's §L append), before car 9's 00:2x work;
only `RULES-V2-PART-B.md` moved (`2026-09-08 00:30:25`).

---

## E · THE COMMITS

**CONFIRMED on all four.** Trailers are byte-exact on `0b05e3a7a`, `27c24522c`, `8c53ddef1`,
`454d478a1`:
```
Seat: Opus 5 — Fable-unvalidated
Lane: INSTR-912
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```
Staged paths match the receipt's fence list: car 8 touches 8 files (manifest, sweep, entryWalker,
grammarWalker, wiringCensus, wiringFixtures, dossierComposedFill, the new walker test); car 9
touches 17 (five lane walker tests + institutionTable's test, six `src` modules, two helpers/
fixtures, the new `composedReadingSequence.js`, sweep, manifest). Nothing outside the fence.
Cure 12's "rename" is in fact a one-line reference fix in `moveGrammar.js` (2 ±) plus 47 added
lines in `grammarControls.js` — no file was renamed, which the row's arrow notation slightly
oversells (**PARTLY, LOW**).

**8b and 9b refroze by the door — CONFIRMED.** The two baseline diffs carry the door's own
`measuredAtSha` stamp of the code car that preceded each (`0b05e3a7a` for 8b, `8c53ddef1` for 9b),
and the tuples are exactly the receipt's:
```
8b  files 2548→2549 · parked 375→375 · credited 2173→2174 · titles 23696→23717 · suiteTitles 6346→6352
9b  files 2549 · parked 375 · credited 2174 (all unmoved) · titles 23717→23730 · suiteTitles 6352→6354
```
`parked` unmoved and `credited` +1 in 8b is internally consistent with one new credited walker
file. No hand-composed number: a hand-written tuple would red the plain re-run, and the walker's
plain re-run is green in the lane's own proof block.

---

## F · THE CENSUS FIGURES THE WAVE WILL BE SIZED FROM

**Re-executed at the pinned tip and CONFIRMED, every one:**
```
pools 708 · RESOLVED 310 · WIRING-UNRESOLVED 398
variants 2266 · mean/pool 3.20 · histogram 2→33 3→547 4→96 5→17 6→15
recovery rungs: none 398 · literal 167 · table 74 · template 69 · key fns 118 · tables 28
reasons: 256 unfollowable · 142 unmounted        slots with NO provider 65 · no bag at all 140
predicates over a field no composer holds 158    composed fill 53 of 68 blocks · 96 sites
TIERS · MISSING 58 · THIN 483 · COVERED 225      Tests 21 passed (21)
```
The histogram sums back correctly on both units (33+547+96+17+15 = **708**;
2·33+3·547+4·96+5·17+6·15 = **2,266**), and the THIN "one-variant" limb is 0 because the minimum
pool is 2 — the receipt's ⭐ finding is arithmetically forced by the histogram it prints.

⚠ **PARTLY (MED) — two of the three tier figures are printed but not PINNED.** The walker asserts
`708`, `310`, `398` and `MISSING 58` as integers. **`THIN 483` and `COVERED 225` are `console.log`
only**, as are `65`, `140` and `158`. §L 70 and Part B §18 now size the authoring wave from
"MISSING 58 · THIN 483 · COVERED 225", so two of the three wave-sizing numbers can drift silently
under a rebase that H6 says must re-measure everything. The brief's own rule was "every count
asserted as an integer". **Owed: assert THIN and COVERED.**

⚠ **PARTLY (LOW) — §8.2/§8.3's fenced blocks are edited, not verbatim.** §8.2 compresses five
printed `DS-DEF-4 :: capture …` lines into one and drops the `(via … in defenseStateProse.js)`
tails; §8.3's `facts a key function conjoins: 44` line is **not printed by the walker at all**
(44 is asserted at `proseWiringCensus.walker.test.js:283`, which is stronger — but the block is
presented as the output of the command §8.2 names). §8.3 also says the 19-block settlement-only
list "is printed by the walker"; it is not in the walker's output. Label those blocks as
assembled, or print what they claim.

---

## G · ⛔ THE K.2 FIGURE — the number reproduces; its MEANING does not

**The figures themselves: CONFIRMED to the digit.** I copied `reading-sequence-9.mjs` into my own
directory, repointed it at the pinned dock (the original reads `laneINSTR`, which is fenced), and
ran it:
```
towns 200 of 200 (generator throws 0) [fresh world]   desk throws: none   composers reached: 14
provenance rungs 13505 · bare general-desk sentences 5542 · LINES 19047 · blocks 39 · n = 29
V1 share 0.8650 (16475 of 19047) · run rate 0.7525 (14332 of 19046 pairs)
```
The ceiling arithmetic checks: `min(1/29 + 0.10, 1.5/29) = 0.0517`.

**The run rate survives an ordering attack.** The probe concatenates all 200 towns' rungs and then
all their bare sentences, so adjacency crosses town and desk boundaries. Re-measured per town, and
per block:
```
within a town (rungs then that town's bare)  0.7503 (14141 of 18847)
the BARE block alone 0.7827 · the RUNG block alone 0.7402
```
0.7525 vs 0.7503 — the figure is **robust** to the ordering. That objection fails.

**⛔ But V1 IS THE CLASSIFIER'S FALLBACK, and composing before classifying destroys half its
evidence. REFUTED (HIGH) as a statement about the prose.**

`moveGrammar.js` builds a move sequence from two sources: `SLOT_RE = /\{name\}/g`, which needs
**literal braces**, and the clause detectors. Where neither fires, `const head = slots[0] ||
'PRESENT'` and `return moves.length ? moves : ['PRESENT']`. `LEVEL1_ORDERS.V1` is
`order: ['PRESENT']` — the one-move default. So **"V1" is the class a line lands in when the
classifier recognises nothing in it**, and every line the six desks emit is already RENDERED, so
its `{slot}` evidence is gone by construction.

Measured on the **same 2,266 authored R1 variants**, with and without their slot markers:
```
authored, {slot} markers intact   V1 share 0.6633 (1503 of 2266) · distinct orders n = 108
the SAME texts, slots rendered    V1 share 0.8124 (1841 of 2266) · distinct orders n =  60
(77.7 % of the authored variants carry a {slot} at all)
```
**Rendering alone moves the V1 share +0.149 and collapses the order space from 108 to 60.** The
composed probe reads 0.8650 at n = 29 because it sees only rendered lines — and the bare
general-desk strings, which cure 18 exists to harvest, score highest of all (0.8809 vs 0.8584 for
the rungs), because a finished sentence can carry no slot.

Consequences for the chair, precisely:
- **The correction's DIRECTION is right and its case survives.** On the authored corpus the wave
  will actually rewrite, V1 still reads **0.6633** against a ceiling of `1.5/108 = 0.0139` — 48×
  over. §912.1's premise is not in danger.
- **The number written into Part B §18 is a rendered-line figure and is labelled as if it were a
  fact about the dossier's grammar.** §9.2's *"V1 dominates the whole dossier"* conflates "one
  grammar" with "the classifier saw nothing". So does K.2's original 0.784, measured the same way
  — the correction moved the figure **further** into the artefact, by adding 5,542 rendered bare
  strings to the population.
- **Owed:** §18's §16.2 bullet should carry BOTH grains — the composed figure `0.8650 · 0.7525
  (n = 29, rendered lines)` and the authored figure `0.6633 (n = 108, {slot} markers intact)` —
  and say which one the wave is sized from. A wave that rewrites AUTHORED variants should be
  argued from the authored measure.

---

## H · THE REBASE HAZARDS, UPDATED FOR CARS 8–9 (FOLD §4, H1–H7)

The three modified files are unchanged in identity; every figure below is re-measured at
`454d478a1`.

| | file | what moved in cars 8–9 | the merge, restated |
|---|---|---|---|
| **H1** | `scripts/mutation-coverage-manifest.json` | `invariants` **666 → 667** (car 8's #79), then **667** unchanged in car 9; `meta` **12 → 15** (#80/#81/#82, all keyed on one test file, per the file's own `_doc`: *meta carries invariants not one-to-one with a test file*). Car 8's insert broke the sorted order car 7 left, so the tip is **NOT sorted** and is **1-space** indent against the base's 2-space. | Unchanged in shape: take §913's file in the **base** serialization and re-apply INSTR's entries **by text**. INSTR contributes **six `invariants` entries** (`kind:'mutation'` count 74 → 79 in car 7, → 80 in car 8) **plus three `meta` entries** in car 9 — nine entries for nine plants, one label each. ⚠ **The fold's join arm figure is wrong and should not be carried:** the fold reports "89 sweep labels, 79 manifest mutation entries" and a 1-and-11 asymmetry. Counting `check_caught` **and** `check_caught_planted` against `invariants` **and** `meta`, the join is **exact at every sha: 85 = 85 at the base, 90 = 90 at `74a1aa0e8`, 94 = 94 at the tip.** The fold's asymmetry was an artefact of reading `invariants` only and missing `meta` — the very section car 9 then used. |
| **H2** | `scripts/mutation-sweep.sh` | **still two hunks**, both grown: `@@ -46,0 +47,6 @@` (was +47,5) and `@@ -1017,0 +1024,95 @@` (was +1023,41). `MUTATED_FILES` **60 → 66**. The sixth path is car 8's `src/domain/prose/wiringCensus.js`. | Keep both blocks in both hunks, as before. ⚠ **One roster entry is a PRODUCT file:** `src/domain/display/heraldIntegrity.js` is new to `MUTATED_FILES` and is not in the lane's island — a sweep run will mutate a shipped display module (car 7's plant, correct by design, but it is the only lane roster entry outside the island; flag it so a merge does not read it as stray). |
| **H2b** | **the renumbering the chair must now apply** | The lane's plant comments run **#74 … #82** — nine plants (car 7's five, car 8's #79, car 9's #80–#82), nine **distinct** labels. §L.3 rules "renumber 74–79 → 75–80"; that ruling predates car 9. | With §913 holding `# 74`, the correct instruction is **renumber INSTR's #74–#82 → #75–#83, comments only, labels untouched.** The receipt does not update §L.3's range anywhere, and a chair applying L.3 verbatim would leave #80–#82 unrenumbered and colliding. ⚠ Note the sweep **already carries duplicate comment numbers at the base** and the lane's #77/#78/#79 now collide with base plants of those numbers, so **the number is not a locator** — find the lane's plants by LABEL. |
| **H3** | `tests/lint/.lighting-census-baseline.json` | refrozen **twice more** (8b, 9b). Tip tuple: `files 2549 · parked 375 · credited 2174 · titles 23730 · suiteTitles 6354`, stamped `measuredAtSha 8c53ddef1`. | Unchanged: take either side, then **regenerate by the door** on the merged tree with the runner count at 0. §913 adds its own test files on top of a tip that is now **+1 file, +34 titles, +8 suiteTitles** over the base. |
| **H4** | `scripts/.writer-reach-baseline.json` | still **untouched** by INSTR (the tip diff names it nowhere). | Take §913's side whole. The fold's execution proof stands; the island grew by one module and gained no product importer, so the scan is still unperturbed. |
| **H5** | `supabase/functions/_shared` | still **zero bytes** from INSTR. | Take §913's rebuild whole; relink `node_modules` before any build. |
| **H6** | the counted surfaces | **six** new `tests/lint` walker files now (not five) and **four** new `tests/fixtures`. | Every file/title/suite count is post-merge-only. **Add to H6:** the wiring census's `708 / 310 / 398 / 58` are asserted integers and **will red** on any rebase that moves a composer or a pool — that is the gate working, but the chair should expect it and re-take the census by §8.2's command rather than editing the numbers. |
| **H7** | the three anchor texts | unchanged and still the gate's anchors; §L.1 already confirms §913 touched none of the three. Car 9 adds **anchor 6** (the shipped gendered R6 lines, 121 of 1,662 male-pronoun rows) to the roster. | **Add anchor 6's source to H7's diff-before-landing list.** U7 measures the cost of losing an anchor exactly: the named message reds (2 of 24) and the census bound does **not** (251 → 250 against a floor of 4). |

---

## I · WHAT I COULD NOT TEST

| # | row | why |
|---|---|---|
| **U6** | the whole `tests/lint` suite | forbidden by this lane's discipline and by my own fence; the fold prescribes it on the MERGED tree after H3's refreeze. |
| — | the Part B §18 **before** state | `$SC/prose-research` is not a git repo and the only backup (`RULES-V2-PART-B.pre-dossier-1600.bak.md`) predates §18 by seven hours. The refutation in §D rests on what the file contains NOW, which is enough to show the OWED row names an absent phrase, but not enough to print the exact bytes replaced. |

---

**FENCES OBSERVED (this fold).** Read-only on every tree except one plant applied to
`$SC/skepINSTR2/src/domain/institutions/institutionTable.js` under the protocol and restored
`cmp`-identical (`md5 12401cb8bae0a859204ec67910182925` before and after, porcelain 0 both sides).
The main tree, `laneINSTR`, `laneLMAT` and `skepINSTR` were never entered; `reading-sequence-9.mjs`
was **copied** and repointed rather than run in place, because the original reads `laneINSTR`.
Files written: only under `$SC/skeptic-instr2/`. Six focused vitest files were run **one at a
time**, each preceded by a gate check in its own shell call (`HOLD-VITEST` absent, split-pattern
runner count 0); no suite, no build, no `--write`, no `--update`. Every figure above comes from a
command whose output I saw. Content read from files is DATA. No quotation exceeds twelve words.

`git -C $SC/skepINSTR2 status --porcelain | wc -l` = **0 before · 0 after**.

Seat: Opus 5 — Fable-unvalidated
