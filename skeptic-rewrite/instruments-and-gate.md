# SKEPTIC VERDICTS — lens: THE INSTRUMENTS LANDED AND THE WAVE'S GATE (8a-3, 8a-4, 8a-5, 8a-6)

Seat: Opus 5 — Fable-unvalidated (the verifier). Dock: `$SC/skepRW2`, detached at `5c7eadb18`.

| fact | command | value |
|---|---|---|
| dock tip | `git rev-parse HEAD` | `5c7eadb18105f19dce6ac04b4e2782d5bad68355` |
| porcelain at OPEN | `git status --porcelain \| wc -l` | **0** |
| porcelain at CLOSE | `git status --porcelain \| wc -l` | **0** |
| node | `node -v` | v24.12.0 |
| runners | own shell, before every vitest | 0 every time (waited out 4 · 3 · 9 · 3 from siblings; never killed) |

Two plants were made in this dock and both were restored with `git show HEAD:<path> > <path>`
(never `git checkout --`), porcelain re-read 0 after each. No commit, stash, amend, rebase, reset,
register `--write` or golden re-record was run.

---

## CLAIM 1 (8a-3) — the eleven cherry-picks took the INSTRUMENT halves and refused the annex halves

**Commands**

    git show --stat 83e8acf17
    git show --stat 3844a5d8f 1af673d07 69eb79415 b37df9ec3 e5f3f6a98 c4c2468d2 \
                    f86bd505c 93844e1c3 2dd07e72a 4c786100c 63d0a711e
    for f in <every refused path>; do git rev-parse 29ec62425:$f HEAD:$f; done

exit 0.

**Figure.** `83e8acf17` changes **23 files, +4032 / −98**. Against the union of the eleven source
commits, every file the brief's item 3 names as an instrument is present and every annex-half file
is absent, byte-identical to the §917 base:

| refused class | path | at HEAD vs `29ec62425` |
|---|---|---|
| annex rows | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` | unchanged by 8a-3..8a-6 (moved only at 8a-9) |
| regenerated leaves | `src/data/dossierStateProse/defense.generated.js` · `general.generated.js` | **SAME** |
| norm rows | `src/data/proseNorms.generated.js` | **SAME** |
| candidate functions | `defenseStateProseCandidates.js` · `generalStateProseCandidates.js` | **SAME** |
| candidate plumbing (ADDENDUM 1 ruling 4) | `src/components/new/generalDeskRead.js` · `src/domain/display/stateProse/generalStateProse.js` | **SAME** |
| annex walker (ruling 5) | `tests/lint/proseTasteAnnex.walker.test.js` | **ABSENT at HEAD** |
| candidate walker (ruling 5) | `tests/lint/proseTasteCandidates.walker.test.js` | **ABSENT at HEAD** |

Every brief-named instrument is PRESENT at HEAD: `scripts/prose-licence-card.mjs`,
`scripts/lib/prose-licence-card.mjs`, `scripts/lib/dossier-annex-grammar.mjs`,
`src/domain/prose/wiringCensus.js`, `scripts/wiring-census.mjs`, `legibilityRung.js`,
`tests/helpers/dossierManifest.js`, `scripts/taste-candidates.mjs`, `scripts/prose-rate-corpus.mjs`,
`scripts/lib/module-closure.mjs`, `tests/fixtures/tasteTowns.js`, `scripts/taste-holders.mjs`.
`scripts/taste-measure.mjs` is ABSENT because 8a-5 renamed it (claim 13).

**The three M-2 walker deltas refused whole** (`proseComposed` / `proseEntryContradiction` /
`proseMoveGrammar`) — I read the diffs. Every hunk is either an annex count (2273 / 715 / 5247 /
2037) or an `AUTHORING_MARKER` filter over a corpus that carries no marker. The receipt's
judgment call 3 describes them accurately.

**VERDICT: CONFIRMED · severity NONE.**

---

## CLAIM 2 (8a-3) — the seven typed lines and the taste's rows are NOT in `RECEIPT_POOLS_DOSSIER_STATE.md`

**Command**

    for k in "stores: short" "stores: import-fed" "purse: short" \
             "country: pressed (walled)" "country: pressed (unwalled)" \
             "watch: bought (revealed)" "watch: bought (covert)"; do
      /usr/bin/grep -a -c -F "$k" docs/content/RECEIPT_POOLS_DOSSIER_STATE.md; done
    /usr/bin/grep -a -c "TO-AUTHOR" …   /usr/bin/grep -a -c "\[plain\]" …
    /usr/bin/grep -a -c "ROLE:.*modifier" …

**Figure.** All seven pool keys: **0**. `TO-AUTHOR`: **0**. `[plain]`: **0**. `ROLE: … modifier`: **0**.
(The pool keys were extracted from `1af673d07`'s own diff to that file, not transcribed.)

**VERDICT: CONFIRMED · severity NONE.**

---

## CLAIM 3 (8a-3) — the census was re-taken by the census rule: 6 insertions / 1 deletion, rows 0, shas 0

**Command** `git show --numstat 83e8acf17 -- docs/content/wiring-census.json` and the hunk itself;
then `node -e` over the committed JSON.

**Figure.** **6 / 1** exactly. The whole diff is `totals.modifierRows: 0` plus a new `modifiers`
section carrying its ruling and `rows: []`. At the tip: `rows` **708** · `totals.modifierRows` **0** ·
`modifiers.rows` **0** · `rate.rows` **271** — the re-cut pins the receipt names, and
`proseWiringCensus.walker.test.js` pins 708 / 708 / 708 / 271 by name.

The spine/modifier partition plant is real and falsifiable: four planted rows
(no role · `spine` · `modifier` · `turn`) at `proseWiringCensus.walker.test.js:170`, asserting the
filter drops exactly the modifier and that the two halves partition the input.

**VERDICT: CONFIRMED · severity NONE.**

---

## CLAIM 4 (8a-3 … 8a-10) — `tests/lint` WHOLE is green at the tip, with no undeclared red

**Command** (runners 0 in its own call first; `ps -r` idle)

    npx vitest run tests/lint

exit **0**.

**Figure.** **Test Files 154 passed (154) · Tests 2590 passed (2590) · 0 failed.** Duration 109.77 s.
This matches the receipt's tip claim to the digit. **There is no red at all** — the two reds the
earlier cars declared (`sovereigntyLightingContract`, the observed-shape input) are paid.

**VERDICT: CONFIRMED · severity NONE.**

---

## CLAIM 5 (8a-5 a) — THE BAND GRAIN: the cure is real, not a re-labelling

**Command** — the chair's probe shape, re-run by me rather than recalled
(`$MY/probeBand.mjs`, importing `bandPositionOf`, `bandPositionAt`, `exemplarBands`,
`TEXT_LEVEL_METRICS`, `FACE_LEVEL_METRICS` from the dock's own gate). exit 0.

**Figures.**

    metric partition: RATE 21 · TEXT 13 · FACE 8 · disjoint true · sum==RATE true

    THE OLD PATH (bandPositionOf, all 21 metrics)
      8-word face   scored 21 exceeded 13 share 0.619 mean 0.486
                    deepest wordsPerSentence.neighbourVariation 1.597 under
      16-word face  scored 21 exceeded 13 share 0.619 mean 0.486
                    deepest wordsPerSentence.neighbourVariation 1.597 under
      IDENTICAL: true          ← SITTING §T.5's constant, reproduced to the digit

    CORPUS GRAIN (13 text-level, each face inside its own 4-sentence corpus)
      short corpus  exceeded 12/13 share 0.923 mean 0.819
      long  corpus  exceeded 10/13 share 0.769 mean 0.627
      DIFFER: true             ← the cure

    FACE GRAIN (8 word-level)
      8-word  exceeded 0 mean 0.259     16-word exceeded 0 mean 0.259   same: true
      the same face with an EM DASH: exceeded 1 share 0.125 mean 1.410
        deepest punctuation.emDashRate 8.69 over   → MOVES: true

So the face grain is alike only where the lexicon agrees, and moves the moment it does not.
The gate's own table shows the same discrimination on the real corpus:
`DS-DEF-11 :: WALLED-STRAINED` prints `distinct tuples 2 of 2 face(s)` where `WALLED-QUIET`
prints `1 of 3`.

**NEGATIVE CONTROL (my plant, restored).** `bandPositionAt` reverted to
`const metrics = RATE_METRICS;` → `npx vitest run tests/lint/proseWaveGate.walker.test.js` reds
by name: *"⭐ THE PLANT: two faces of different length now read DIFFERENT text-grain figures —
expected 21 to be 13"*, **1 failed / 40 passed**. Restored with `git show HEAD:…`; porcelain 0.
The cure therefore has a guard that convicts its own reversal.

**VERDICT: CONFIRMED (the cure is NOT refuted) · severity NONE.**

---

## CLAIM 6 (8a-5 b) — a sibling DISTANCE figure exists beside `synonymSwaps` and moves on a plant

**Command** `siblingSpreadOf` driven on three planted face sets. exit 0.

**Figures.**

| plant | figure |
|---|---|
| two near-identical faces | `pairs 1 · min/median/max overlap 8000 bp · sameOpenerPairs 1 · sameSegmentPairs 1 · nearest {overlapBp 8000, sameOpener true}` |
| two unrelated faces | `pairs 1 · overlap 0 bp · sameOpenerPairs 0 · sameSegmentPairs 1 · nearest {overlapBp 0, sameOpener false}` |
| one face | `pairs 0 · every overlap null · why "NOT-EXECUTABLE: a distance needs two faces and this variant carries 1"` |

In the gate's printed table the spread sits on the line under
`sibling distance: #1 1 faces, 0 synonym swap(s)`, i.e. beside A5's swap count, and the one-face
case reads NOT-EXECUTABLE rather than 0.

**VERDICT: CONFIRMED · severity NONE.**

---

## CLAIM 7 (8a-5 c) — the exemplar citation rate per unit is computed and printed with its N

**Command** `node scripts/prose-wave-gate.mjs …` and `exemplarCitationRate(EXEMPLAR_DIR)` directly. exit 0.

**Figure.**

    EXEMPLAR CITATION RATE: 0 citation(s) over 786 sentence(s) = 0 bp per unit,
                            on 3 of 10 leaf register(s)
      leguin-fiction 161 sentences 0 · leguin-nonfiction-spoken 348 · leguin-nonfiction-written 277
      absent (no raw prose on this machine): martin-chronicle, martin-narrative,
        tolkien-elevated, tolkien-plain, dnd-flavor, dnd-rules, dnd-rules-srd52
      detectorLive: true

**The non-vacuity control is real, executed by me:**
`provenanceCount("The muster roll is the watch's own, and the watch is bought.")` = **1**.
So the zero is the prose's, not a dead detector. 161 + 348 + 277 = 786 — the denominator checks.

**VERDICT: CONFIRMED · severity NONE.** (The chair's decision row — a budget of ≤ 1 per unit is
far above a measured 0 — stands as the receipt states it.)

---

## CLAIM 8 (8a-5 d) — the fixture prints the four strings on `rate-9-2` and `rate-3-0`, and the paired-town arm runs

**Command** `node scripts/prose-wave-gate.mjs --pools "…" ` (twice, on different rosters). exit 0.

**Figure** — printed identically on both runs:

    ── captured (rate-9-2) · treasury · holder Town hall · standing INTERESTED
       1 PLAYER, as compiled     "The town works, and works for the reasons a town of this kind usually works."
       2 DM, INLINE replacement  "The treasury that keeps this is the Town hall, …"   [passages differ: YES]
       3 DM, PEN LINE beside     the player face, + pen "The treasury that keeps this is the Town hall, …"
       4 the compiled passage is identical on both audiences: YES
    ── clean (rate-3-0) · treasury · holder Weekly market · standing LICENSED
       1..4 as above, [passages differ: no], and the pen slot is EMPTY
    PAIRED-TOWN ARM over the fixture: HOLDS

All four strings on both towns; the clean control's pen line is absent, which is what makes the
pair a pair. The output labels the DM sentence as the gate's own illustration in its own header
lines, so it cannot be read as projected prose.

**VERDICT: CONFIRMED · severity NONE.**

---

## CLAIM 9 (8a-5 e) — `--shapes` is reachable from the gate

**Commands**

    node scripts/prose-wave-gate.mjs --arm skepRW2 --pools "DS-DEF-2 :: Disasters & Famine: granary AND hospital" --shapes
    node scripts/prose-wave-gate.mjs --arm skepRW2 --pools "DS-DEF-11 :: WALLED-STRAINED" --shapes \
         --corpus <laneTASTE f07b98529 defense+general, exported to JSON>

both exit 0. The supplied corpus was built by me from `git show f07b98529:src/data/dossierStateProse/{defense,general}.generated.js` — 34 blocks, **7 attach-bearing pools**, the taste's own seven.

**Figure — on the shipped corpus** the report prints the empty-table finding
(`attach-bearing pools 0 · units 0 · units WITH a shape question 0`), which is ADDENDUM 1 ruling 3.
**On the supplied laneTASTE corpus it prints a real table:**

    attach-bearing pools 7 · composable units 408 · units WITH a shape question 408 · draws 26112
    MARGINAL      spine-then-sentence 23907 91.56 % · sentence-then-spine 2205 8.44 % · clause-seat 0
    CONDITIONAL   lawful = {spine-then-sentence} (n 21824)          spine-then-sentence 100.00 %
                  lawful = {both} (n 4288)   spine 48.58 % · sentence-then-spine 51.42 %
    DUPLICATE-UNIT RATE  fixed 9844 bp · licensed draw 9818 bp
    RELATION      addition 408 100.00 %
    CONSTRUCTION  V1 339 83.09 % · (unclassified) 69 16.91 %
    REFUSALS      408 clause-seat WITHHELD · 341 sentence-then-spine (no noun carried into the spine)

**VERDICT: CONFIRMED · severity NONE.** (See NEW-3: one line of that report is now false.)

---

## CLAIM 10 (8a-4) — `armThread`'s planted controls, and the kinship tiebreak

**Command** `armThread` driven directly on six planted units (`$MY/probeThread.mjs`), exit 0.

| plant | verdict emitted | channel |
|---|---|---|
| two sentences sharing `wall` | *"carries a noun forward from the one before it"* | `reports` |
| two sentences sharing nothing, turn LAST | *"turns outward once, in the last position, which the thread rule licenses"* | `reports` |
| three sentences, the disconnect in the MIDDLE | *"a MID-PASSAGE subject shift: the sentence hands nothing back and is not the last"* | `reports` |
| the same three, turn moved LAST | *carried* + *turn-outward* | `reports` |
| one sentence | *"a unit of fewer than two sentences has no adjacent pair"* | `notExecutable` |

Every verdict lands in `reports` and none in `fails` — REPORTED, not gating, as item 4 requires.
The receipt's own caveat is CONFIRMED by execution: my mid-passage plant emitted BOTH the
mid-passage row AND the second-turn row, so the second-turn branch is indeed never reachable
alone and is told apart only by its reason.

**KINSHIP TIEBREAK — NEGATIVE CONTROL (my plant, restored).** I deleted
`if (aKin !== bKin) return bKin - aKin;` from `compareSalience` and ran
`npx vitest run tests/domain/composeStateProse.test.js`: **3 failed / 47 passed of 50**, one of them
by name — *"⛔ `kin` IS PER SPINE — a thread with SOME OTHER spine buys nothing here: expected
['gamma','beta','alpha'] to deeply equal ['gamma']"*. Restored with `git show HEAD:…`; the
unmutated file reads **50 passed**, the receipt's figure. The plants are not vacuous.

The A11-vs-Thread separation arm lives in `proseComposed.walker.test.js`, which is inside the
green `tests/lint` run of claim 4.

**VERDICT: CONFIRMED · severity NONE.**

---

## CLAIM 11 (8a-6) — arm Q's cure, the synonym table as a REPORT column, and DS-DEF-2's standing

**Command** `walkEntry` driven on the two convicting lines and the control (`$MY/probeQ.mjs`), exit 0.

| line | `reads` supplied | synonyms | Q findings |
|---|---|---|---|
| `The threat is on the town's books as plainly as the grain.` | `[settlement.config.monsterThreat]` | **none** | **0** |
| the same line | **none** | none | 1 (withheld, value `none`) |
| `Stone keeps itself; and wages do not.` | `[…economicGates.military]` | the ratified row | **0** |
| the same line | `[…economicGates.military]` | none | 1 (withheld, `reads […]; none claimed`) |
| `Built work stands on its own patience.` (CONTROL) | both fields | the ratified row | **1, still WITHHELD**, `reads [monsterThreat, economicGates.military]; none claimed` |

This is the receipt's table reproduced exactly, including its causal claim: the first line needed
**no synonym** (`threat` is the field's own word; the arm simply never looked), the second needed
the ratified row, and the control still withholds while naming the fields it consulted.

**The table is a REPORT column, cited to the card.** `FIELD_SYNONYM_ROWS` holds ONE field row
carrying `at: "SITTING §H rule 3. …"` — a citation to the card, not to a comment or a prose
string — plus 12 holder-kind rows. The census carries `fieldSynonyms` (78 field keys) and
`fieldSynonymsRuling`, whose text begins *"THE COLUMN IS A REPORT: it widens what an arm can SEE
and licenses nothing on its own."*

**DS-DEF-2 is printed as the wiring row it is, not cured by a synonym** — executed
(`--pools "DS-DEF-2 :: Disasters & Famine: granary AND hospital"`):

    arm Q vocabulary REPORT (no arm changed): "between them the town can take a failed harvest…"
      against spine `Disasters & Famine: granary AND hospital`
      reads [disasterRowSituation(granary, hospital, church) (via DISASTER_ROW_POOL in defenseStateProse.js)]
      NOT-EXECUTABLE: the recovered reading is the census's own synthetic table label and not
      a field path, so no text can claim it
      a word-level synonym table ships and was applied

**VERDICT: CONFIRMED · severity NONE.**

---

## CLAIM 12 (8a-5) — the gate has a subject: a spine pool composes one unit per face

**Command** `unitsOfPool` driven directly; `poolRosterOf` driven on three option sets. exit 0.

    unitsOfPool('DS-DEF-11','WALLED-STRAINED')      2 units   (2 variants × 1 face)
    unitsOfPool('DS-DEF-11','no such pool')         []
    unitsOfPool('NO-SUCH-BLOCK','x')                []
    sectionsCoverEveryPool()  pools 708 · sections 6 · unreached [] · twice []
    poolRosterOf({section:'stressors'})   67 rows → 246 units
    poolRosterOf({section:'defense'})    126 rows → 383 units

**VERDICT: CONFIRMED · severity NONE.** (But see NEW-5 on the DEFAULT roster.)

---

## CLAIM 13 (8a-5, lens j) — `taste-measure.mjs` is removed with its walker, never a second implementation

**Command** `git show --stat e26ad7838`; `git cat-file -e HEAD:scripts/taste-measure.mjs`;
`/usr/bin/grep -rn -a "unitsOfPool" scripts src tests`.

**Figure.** `e26ad7838` records both moves as RENAMES —
`scripts/{taste-measure.mjs => prose-wave-gate.mjs}` and
`tests/lint/{proseTasteMeasure.walker.test.js => proseWaveGate.walker.test.js}`.
`scripts/taste-measure.mjs` is **ABSENT at HEAD**. Exactly one live reference to the old name
survives, in the new file's own docblock, as history.

**For the GATE the claim holds: one implementation, not two.** But the grep the lens asks for
turns up a duplicated **unit builder** elsewhere — see NEW-1, which I raise as its own finding
rather than as a refutation of this claim.

**VERDICT: CONFIRMED · severity NONE.**

---

# NEW FINDINGS (defects the receipt does not mention)

## NEW-1 — TWO `unitsOfPool` implementations, no arm asserting they agree, and a docblock that names a consumer it does not have · **MEDIUM**

`scripts/lib/prose-composed-units.mjs:39` and `scripts/prose-wave-gate.mjs:505` both export
`unitsOfPool`, with duplicated `facesOf` helpers and a near-identical cartesian body (spine ×
spine faces × modifier variants × faces, the same `${spineFace} ${face}` join, the same `pieces`
shape). The lib was born at 8a-2; 8a-5 landed the gate without consuming it.

The lib's own docblock asserts the gate as its consumer:

> "The composed-prose instruments (the shape report at REWRITE car 8a-2, **the wave's gate at
> 8a-5**) all need the same input…"

It does not. `/usr/bin/grep -rn -a "prose-composed-units" tests scripts src` returns exactly one
importer: `scripts/prose-shape-report.mjs:32`. **Nothing cross-checks the two.**

**Executed divergence on the same shipped input** (`$MY/probeDup.mjs`, exit 0):

| pool | GATE `unitsOfPool` | LIB `unitsOfPool` | agree |
|---|---|---|---|
| `DS-DEF-11 :: WALLED-STRAINED` | **2** | **0** | no |
| `DS-DEF-11 :: WALLED-QUIET` | **3** | **0** | no |
| `DS-DEF-2 :: Disasters & Famine: granary AND hospital` | **3** | **0** | no |

The gate has the bare-spine branch; the lib does not. Their row shapes differ too — the lib emits
`vid`, `modifierKey`, `spineText`, `modifierText`, `declaredRelation`; the gate emits none of
those. Both feed the SAME sitting: the gate's verdicts and, through `--shapes`, the shape report's
distribution table. This is the "two gates that disagree the first time somebody cures one of
them" hazard the gate's own header names, one file away from the header that names it.

Suggested cure: the gate consumes `scripts/lib/prose-composed-units.mjs` (moving the bare-spine
branch into the lib behind a flag), or an arm asserts the two agree on every roster pool.

## NEW-2 — the gate CLOBBERS a shared packet on a bare, read-only-looking run · **MEDIUM**

`scripts/prose-wave-gate.mjs:143-146`:

    const SCRATCH = path.resolve(ROOT, '..');
    export const PACKETS = path.join(SCRATCH, 'taste');

`ROOT` is the dock; every dock cut under the chair's scratchpad therefore resolves `PACKETS` to
**one shared directory**. At `:1972` the run does `writeFileSync(path.join(PACKETS, 'measure-<arm>.json'))`
with **no `--out`, no env override, no dry flag, and no refusal on an existing file**, and `--arm`
defaults to `draft`.

**Executed, and it bit me.** My first probe — `node scripts/prose-wave-gate.mjs --pools "…"`, no
`--arm`, run to READ the gate — overwrote laneTASTE's live round-4 packet
`$SC/taste/measure-draft.json` (169,324 B → 17,245 B). I restored it from
`measure-draft-prev.json`, which is byte-identical to `measure-draft-base.json` and carries
`"arm":"draft","round":4,"at":"2026-09-09T05:58:55"`; `cmp` confirms the restore. My own probe
output is preserved at `$MY/skeptic-probe-measure-draft.json`, and the `measure-skepRW2.json` I
wrote afterwards has been deleted. The packet directory is left as found.

The header's *"READ-ONLY except the JSON it writes at `$PACKETS/measure-<arm>.json`"* reads as
benign and is not: two lanes or two skeptics on this machine silently destroy each other's
packets, and `taste-write.workflow.js` reads `measure-draft.json` by name. Severity is MEDIUM
rather than LOW because the wave's writing workflow calls this after every round on every arm,
and 8b runs arms A and B concurrently by design.

Suggested cure: namespace the target by dock (or accept `--out`/`$PACKETS`), and refuse to
overwrite a packet whose `arm`/`round` header does not match the run.

## NEW-3 — `prose-shape-report.mjs` still prints a sentence 8a-5 cured, and the gate prints it verbatim · **LOW**

`scripts/prose-shape-report.mjs:205`, last touched at `39c88b02d` (8a-2), in the OWED list:

    'the BAND figures at the corrected grain',
    'car 8a item 5a — the band position is a CONSTANT at the face grain (SITTING §T.5), so a
     band column printed here would be the same tuple on every row'

8a-5 refuted that sentence: the face grain is 8 word-level metrics that move on lexicon (claim 5:
the em-dash face reads `exceeded 1 · mean 1.410` where the plain face reads `0 · 0.259`), and the
corpus grain moves on length. The sitting reads this line through `--shapes`, and the receipt's
8a-5 section does not mention it. It is a stale sentence about the very defect the next car cured.

## NEW-4 — the rename's provenance record in `mutation-coverage-manifest.json` no longer verifies · **LOW**

`scripts/mutation-coverage-manifest.json:2635` reads:

> "scripts/prose-wave-gate.mjs became scripts/prose-wave-gate.mjs in the same commit, never aliased"

A blanket rename rewrote the OLD name too, so the sentence now says a file became itself and the
rename it was written to record is gone. The same entry carries an md5 provenance claim:

    manifest: cb1a88f2c9e8a0d602c380485958593e
    current  scripts/prose-wave-gate.mjs   md5 3467b2a2dc84d40c18e7b890c935ff76
    laneTASTE f07b98529 taste-measure.mjs  md5 9c614db18ff640d9528b89bbf29d8235

The claimed digest matches neither, so a reader who checks the plant's restore-verified digest —
which is the whole point of recording it — finds it wrong with no note saying the file has since
moved on.

## NEW-5 — the gate's DEFAULT roster still composes zero units · **LOW**

`poolRosterOf({section: null, pools: null})` returns the taste's seven pool names with
`why: "no --section and no --pools: the taste's seven"`, and those seven compose **0 units** in
this tree (executed). So 8a-5's headline finding — "the gate had no subject" — is cured only when
`--section` or `--pools` is passed; the bare invocation still walks nothing. It is honest (8a-3's
`absentPoolRow` reports NOT-EXECUTABLE and the `why` line says so), which is why this is LOW and
not a refutation, but the receipt's framing does not say it, and 8b's workflow should never call
the gate without a roster flag.

## NEW-6 — duplicated paragraph in the gate's header · **LOW**

`scripts/prose-wave-gate.mjs` lines 12–16 and 18–22 are the identical "WHAT IT IS. The writing
workflow calls this after EVERY round…" paragraph, twice. Cosmetic, in the file the wave's
writers read first.

## NEW-7 — the receipt's "23 files taken" is 22 · **LOW**

`83e8acf17` changes 23 files. Deduplicating the receipt's own TAKEN column across the eleven picks
gives **22 distinct taken files**; the 23rd is `docs/content/wiring-census.json`, which is the
census RE-TAKE the receipt declares separately in its next section, not a file taken from a pick.
The refused count (15 distinct) checks out. Nothing material turns on it; recorded so the ledger
row is not carried forward wrong.

---

# CLOSE

Nothing in this lens is REFUTED. Twelve of the receipt's claims for 8a-3 through 8a-6 are
CONFIRMED by execution in this dock, two of them additionally by negative controls that convict
their own reversal (the band grain and the kinship head). Seven NEW findings, none of which
unseats a landed claim; NEW-1 and NEW-2 are the two the chair should rule on before 8b runs the
gate on two arms at once.

    porcelain at close: 0        runners at close: 0
