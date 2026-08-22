# draft-OSR9-MINT — charter for the OWED schema-9 re-freeze mint of the OSR instrument

**Lane:** TC-OSR9 (COMPILE/CHARTER, chair-tier per ODQ §343.1(c)). **Wrote nothing in the
repository, moved no ref.** All reads pinned to `refs/heads/claude/composite-r4` @
**`27c250f94bb7c5c799693a62985c5ddecd4b6c7c`** ("feat(MF-T2D): the boundary noder") except
where a second SHA is named. ODQ rows read from the ledger branch `review-fixes-2026-07-08` @
`0ab3d655` (§338 at :14316, §346 at :14537).

**Authority carried:** ODQ §346.2 (the mint is OWED; the M9 four ride it; minKeys does NOT;
'stresses on institutions' joins the triage list) · §346.1 (minKeys REFUSED; the 22 are
RECORDED-EXPLAINED; no fit-motivated exemptions) · §338.1 (the Ruling-B precedent the M9
banking stands on). §338.3: OSR rulings execute at the BUILD tip only.

**Figure convention:** every numeral in this charter is a point-in-time measurement at
`27c250f9` or from the committed schema-8 baseline. **Each one is marked
`STOP: RE-DERIVE AT BASE` where the executor must re-measure**; none may be transcribed into
code, pins, or the review ledger from this document.

---

## 1. WHAT THE MINT IS — AND IS NOT

The chartered contents, from §346.2, exactly four items:

**(a) The re-freeze itself.** Schema 8 → 9; the baseline re-records the post-EP-1 truth:
new `detectorTree` digest, new `unscannedInputDigest` (see §2.4 — a third drift cause this
lane measured that §346.2 does not name), new `corpusMeta`/`sentinel`, same inventory
(expected byte-identical; verified through the review ledger, §5 S4). Via the instrument's
own governed migration bundle — nothing else can lawfully move the digest (§2.1).

**(b) M9 banking of exactly FOUR identities on eventLog:** `appliedAt`, `deltas`, `event`,
`narrativeSummary` — writer `src/domain/events/applyEvent.js:52-66` (STOP: RE-DERIVE the
line span), the store/command-layer writer the generation corpus never executes; gate 0's
own write-shape probe admits exactly these four and refuses all 22 others (laneMEAS §7,
corroborating §346.1). Banking = four new `EXPLAINED_WRITER_EXEMPTIONS` entries (§3). The
other 22 identities are RECORDED-EXPLAINED non-defects and get **NO tag, NO entry, NO
mention in code** — §346.1 forbids naming a writer that does not write them.

**(c) Triage of `stresses on institutions`** — chartered as a bounded procedure with a
routing table (§4), not a pre-decided outcome.

**(d) NOTHING ELSE.** `SHAPE_FAMILY_FILTER` stays `{theta: 0.8, minKeys: 8}` byte-for-byte
(refused §346.1; the boundary pin at `tests/lint/observedShapeSentinel.test.js:610` test /
`:629` assertion **must stay green untouched**). No acceptance-set widening, no M11/M12
vocabulary change, no `CLASS_A_PROTECTED_IDENTITIES` change, no inventory hand-edit, no
`SCAN_CONFIG` change, no new test files (the test census sits AT its pinned ceiling), no
`docs/**.md` writes (per-claim naked-claim debt; the ODQ/ledger entries are the chair's).

---

## 2. THE SCHEMA-BUMP MECHANICS, DETERMINED FROM THE INSTRUMENT'S CODE

All citations are to the pinned tip. The §346 memo's two mechanical claims are both
**CONFIRMED against source**: `BASELINE_SCHEMA` is 8 (`scripts/lib/observed-shape-baseline.mjs:102`),
and ordinary `--write` throws on a digest move (`check-observed-shape-readers.mjs:2161-2168`,
"an ordinary gate/write cannot migrate the instrument"). Additionally
`--migrate-schema=8` is refused while the baseline is already schema 8 (`:2128-2130`), and
the flag literal itself is `--migrate-schema=${BASELINE_SCHEMA}` (`:2013`) — so **the lawful
path requires a committed code change first**, then the governed bundle, then the migration
write, then a second commit. Two commits minimum; amending is forbidden (§5 S7 ⛔).

### 2.1 The code change (lands as commit C1) — enumerated, CH-1 … CH-6

- **CH-1** `scripts/lib/observed-shape-baseline.mjs` — `BASELINE_SCHEMA` 8→9; new retired
  constant for 8 (naming per the file's pattern, e.g. `RETIRED_CORPUS_COVERAGE_BASELINE_SCHEMA = 8`);
  `validateSchema8Baseline` retargeted to the retired constant with `{tagged: true}` and kept
  executable (the committed schema-8 genesis must stay verifiable — the file's own law for
  schemas 3–7); new `validateSchema9Baseline` bound to `BASELINE_SCHEMA`; header prose rows
  extended one rung.
- **CH-2** `scripts/check-observed-shape-readers.mjs` — the four M9 entries appended to
  `EXPLAINED_WRITER_EXEMPTIONS` (§3); imports/`runtime.validateBaseline`/
  `assertExplainedWriterRowTags` rewired from `validateSchema8Baseline` to
  `validateSchema9Baseline` (three sites: `:93`, `:1135`, `:2089`); the schema-lineage
  comment `:121-130` and the `_doc` array inside `baselineOf` (`:1898-1917`) gain the
  schema-9 rung ("SCHEMA 9 = schema 8's topology and tag law; the corpus holds
  `advanceEpochEnabled` dark (EP-1) and the M9 bank grows by the four §346.1 eventLog
  identities" — executor's exact prose; never transcribe naked-claim matcher text).
- **CH-3** ⚠⚠ **`rowTagsOf` (`check-observed-shape-readers.mjs:1864-1883`) — REQUIRED FIX,
  discovered by this lane.** Its genesis condition is
  `predecessorBaseline?.schema === RETIRED_SURFACE_FILTERED_LEAF_BASELINE_SCHEMA` (schema-6
  predecessor only). Under the 8→9 migration write, a NEWLY declared identity takes the
  `count > priorCount` arm and gets `reason = raiseReason = null` (`--raise-explained-writer`
  is illegal with `--migrate-schema`, `:2056-2058`) — and a null reason **reds twice**: the
  tag grammar requires a 1-240-char string (`observed-shape-baseline.mjs:696-702`), and the
  genesis check requires `tag.reason === declaration.ruling`
  (`check-observed-shape-readers.mjs:1149-1151`, genesis = frozenAtSha === subjectSha, true
  for the fresh mint). **The mint cannot produce a valid baseline without this fix.**
  Chartered fix (J3, vetoable): `const genesis = predecessorBaseline?.schema !== BASELINE_SCHEMA;`
  — behavior-preserving for all committed history (the 6→7 and 7→8 genesis baselines already
  satisfy reason === ruling, which is what the A5 pin at `observedShapeSentinel.test.js:1294-1298`
  enforces) and correct for every future mint that adds declarations.
- **CH-4** `scripts/migrate-observed-shape-readers.mjs` — register target 9: a new target
  constant (executor names it; suggest `EPOCH_DARK_CORPUS_TARGET_SCHEMA = 9`); add it to the
  `run()` valid-target list (`:1451-1459` — note the error text enumerating valid targets
  changes, which flips a migration-test pin, §6 row P7); `LEAF_MIGRATION_PREDECESSOR[9] = 8`
  (`:159-165`; the `LEAF_PREDECESSOR_VALIDATOR` rung for predecessor 8 already exists at
  `:179` and, after CH-1, still validates schema-8 envelopes); a schema-9 delta-paths
  constant (§2.3) + policy string `'schema-8-to-9-exact-scanner-transition-v1'` +
  `SCANNER_TRANSITION_BY_TARGET` entry (`:491-502`).
- **CH-5** ⚠⚠ **`governedScannerTransitionOf` — the hard-coded `unchangedPaths.length !== 7`
  (`migrate-observed-shape-readers.mjs:557-559`) must be generalized** to
  `transition.inputPaths.length - transition.deltaPaths.length` (identical arithmetic for
  targets 7 and 8: 11 − 4 = 7; for target 9 the delta is five paths, §2.3, so the retained
  count is 6). A latent defect of the transition law itself: it silently assumed every future
  mint changes exactly four files.
- **CH-6** ⚠⚠ **The unscanned-input rule needs a target-9 answer (J1, vetoable — the one
  genuine law change).** `governedScannerTransitionOf:561-566` REFUSES a moved
  `unscannedInputDigest` with no review path — and it HAS moved (§2.4). Chartered shape:
  for target 9 (per-target, never retroactive for 7/8), a moved unscanned digest is
  RECORDED in the transition record — predecessor digest, current digest, and the exact
  changed unscanned paths (derived by comparing the two manifests, so the review is over
  named files) — and flows into the scanner-transition review row for an accepted, noted
  decision, instead of throwing. Equality remains the checked default for targets 7/8.
  ALTERNATIVE (rejected, stated so it is vetoable the other way): block the mint and ask the
  owner to rule on the unscanned law separately — rejected because the movement is a single
  landed build-era re-record (§2.4) and the whole point of §346.2 is re-governing the
  instrument to the landed truth; a review-with-named-files is the same honesty with less
  standing darkness.

Pin re-records forced by CH-1…CH-6 ride **C1** (code-bound pins) and **C2** (live-baseline-
bound pins) per the table in §6.

### 2.2 What does NOT change

The byte-frozen detector `scripts/lib/legacy-reader-shape-scan.mjs` (blob-pinned; untouched).
`scripts/lib/observed-shape-corpus.mjs` and `package.json` — **already changed** (they are
the drift, §2.4); the mint re-governs them as-is, it does not edit them further. `SCAN_CONFIG`
(`{corpusGraphSchema: 2, minRows: 40, originMinRows: 8}`) — the transition law separately
refuses a scan-config change (`:567-569`), and none is chartered. θ/minKeys per §1(d).
`package-lock.json` — unchanged since genesis (measured, §2.4); if it has moved by execution
time that is a NEW mint-trigger fact: STOP-RAISE to the chair before proceeding.

### 2.3 The delta-path set (STOP: RE-DERIVE AT BASE — freeze the constant to the measured diff)

Measured `git diff 3df85a3a..27c250f9` over the 11-path governed detector universe: exactly
2 paths moved — `package.json` (+2 lines: `soak:rolling`, `soak:restore` scripts; not a
dependency change; the lock is untouched) and `scripts/lib/observed-shape-corpus.mjs`
(+23 lines: EP-1's `simulationRules.advanceEpochEnabled = false` and its comment). With
CH-1/CH-2+CH-3/CH-4+CH-5+CH-6 the mint's delta constant is **five paths, in the manifest's
sorted order**:

```
package.json
scripts/check-observed-shape-readers.mjs
scripts/lib/observed-shape-baseline.mjs
scripts/lib/observed-shape-corpus.mjs
scripts/migrate-observed-shape-readers.mjs
```

⚠ The transition also requires every delta path to differ in content AND the remaining six
to be byte-identical to the schema-8 genesis (`:544-559`). The executor re-runs the diff at
C1 and freezes the constant to what it measures THEN — if a sixth path has moved by then, it
joins the constant with its own review note; if a listed path has NOT moved, the constant
shrinks. Never transcribe this list without re-measuring.

### 2.4 ⚠⚠ THE THIRD DRIFT CAUSE — measured by this lane; §346.2's cause list is incomplete

§346.2 (and laneMEAS §8.1) name two causes: EP-1's corpus change and the two package.json
scripts. **This lane measured a third:** `src/data/dossierStateProse/warFaith.generated.js`
changed between the schema-8 genesis `3df85a3a` and the tip `27c250f9`
(`git diff --name-only … -- src/` filtered to `.json`/`.generated.js`: exactly this one
file; 175 src files changed overall). `.generated.js` files are subject inputs but excluded
from the scan (`isObservedShapeScanPath` `:194-198`), so they live in the UNSCANNED manifest
— therefore the committed `unscannedInputDigest`
(`3d85bdee459303acb1201b2c4bd887da1a907c38f23ef5368416affc8ac9ccdc`) no longer reproduces at
the tip. Consequences, both handled above: the gate's exit-1 has two triggering clauses
(`:2161-2163` checks BOTH digests), and CH-6 exists because the transition law refuses the
movement outright. **This does not change the §346.2 ruling — the mint is still owed — it
enlarges the reviewed transition surface by one named file.** STOP: RE-DERIVE the unscanned
delta at C1; more `.generated.js`/`.json` landings may have joined it.

### 2.5 The predecessor is admissible — verified

The transition demands the immutable schema-8 migration genesis as predecessor (`:517-519`),
and the check-side write demands the bundle's predecessor byte-match the on-disk baseline
(`:2133-2137`). Both are satisfiable by the same file: the committed baseline **is** its own
genesis — `frozenAtSha == migrationReview.subjectSha == 3df85a3a`, schema 8, 1998 findings /
1412 identities / 387 files (read from the committed JSON). No maintenance write has moved
it. ⚠ If ANY maintenance `--write` lands between dispatch and execution, the two demands
diverge and the mint is blocked: STOP-RAISE. (No shrink re-freeze can land anyway while the
digest drift stands — ordinary `--write` throws — so the practical risk is zero; stated for
completeness.)

---

## 3. THE FOUR M9 ENTRIES — exact shape

Appended as a block after the existing four (the declaration array is order-pinned by the
sentinel test; the assertion demands only well-formedness and no repeats, so append-order is
free — J4 chooses alphabetical by key). Every field below satisfies
`assertExplainedWriterExemptions` (`:1053-1090`): canonical field set
`identity,mechanism,ruling,why,writer`; mechanism from the closed vocabulary; writer a
repository-relative `src/` `.js`; `why` ≥ 40 chars; `ruling` a 1-240-char single line; none
of the four is class-(a) (verified against the 20-entry `CLASS_A_PROTECTED_IDENTITIES` list
— no eventLog row exists there).

| field | value (all four) |
|---|---|
| `identity` | `'appliedAt on eventLog'` · `'deltas on eventLog'` · `'event on eventLog'` · `'narrativeSummary on eventLog'` |
| `mechanism` | `'save-time-writer'` — the applyEvent write reaches a real campaign record only through the store/command layer, which the generation corpus never runs; same class as `worldPulse on campaignState`, one lifecycle step out (the Ruling-B precedent §338.1/§346.1 rests on) |
| `writer` | `'src/domain/events/applyEvent.js'` |
| `ruling` | executor drafts one line naming §346.1 and M9 (e.g. `'ODQ §346.1 / M9 — Ruling-B precedent'`). ⚠ CHOOSE ONCE: at genesis this exact string is stamped into every tagged row's `reason`, and a tag reason can thereafter change only with numeric growth (`assertExplainedWriterTagTransition`) |
| `why` | executor's prose, ≥ 40 chars, single-entry-specific; must say who writes it and why the corpus never runs that writer |

**Gate-0 standing evidence** (re-proven mechanically on every scan by
`assertExplainedWriterEvidence`): `event` [shorthand], `deltas` [property],
`narrativeSummary` [property], `appliedAt` [shorthand] — laneMEAS §7 ran the instrument's own
probe; the executor need not trust it, the scan reds if it rots.

**The mechanical consequence to state out loud (not scope creep):** tagging is
per-IDENTITY, everywhere the identity appears — the filter's own declared granularity ("it
clears an IDENTITY everywhere or nowhere"). At the pinned tip the four identities occupy
**9 inventory addresses / 16 reads** (STOP: RE-DERIVE from the fresh inventory at C2):
`event` in mutate.js(3), chronicleFeed.js(3), NarrativeArchivePanel.jsx(2),
campaignCanonRelationshipSession.js(1); `deltas` in mutate.js(2); `narrativeSummary` in
mutate.js(2), chronicleFeed.js(1), NarrativeArchivePanel.jsx(1); `appliedAt` in
chronicleFeed.js(1). **Three of the nine addresses sit in chronicleFeed.js** — the rows stay
visible under their ceilings with the M9 reason, exactly the bank-by-rule shape; the 22
OTHER chronicleFeed identities stay untagged. This is the ruling's arithmetic, not a
widening.

**No entries beyond these four.** `type on eventLog` and `targetId on eventLog` are reads of
the inner Event (wrong home; gate 0 refuses them) — explicitly NOT banked.

---

## 4. CHARTER ITEM (c) — `stresses on institutions` triage

**Standing (verified at the pinned tip):** one untagged inventory row,
`src/pdf/lib/viewModelBodySlices.js` / `stresses on institutions` : 1. The read at `:221`
is `pressures: inst?.pressures || inst?.stresses || []` — and ⚠ **`pressures on
institutions` is ALSO a banked untagged row in the same file**, i.e. as far as the corpus
can see, NEITHER arm of that OR-chain is ever written on the institution record. Advisory
greps at the tip found no `stresses:`/`pressures:` writer on institution records and no
FIELD_ALIASES-style declaration for institutions (the settlement-side `stresses` M8 entry is
a different shape and does not cover this — already ruled in laneMEAS §8.3 / §346.2).

**Chartered procedure (executor runs, before C1, ~30 min):**
1. Gate 0: `writeShapesIn` over the candidate institution writers (the generator that mints
   institution records; `institutionLifecycle.js`; any normalizer) for both `stresses` and
   `pressures`.
2. Gate 3: search for a closed admission list naming either key on institutions
   (schema/aliases/editable-fields machinery).
3. Gate 1 (refusal only): `authoredInputHistoryCommits('stresses')` — zero commits closes
   the M8 hypothesis.

**Routing table (decision procedure fixed here; outcome is the evidence's):**
- A closed admission list names the key on institutions → an M8 entry rides the mint
  (same block as §3, mechanism `'admission-list'`), with its evidence quoted in the ODQ
  collection note.
- A real out-of-corpus writer is found → M9 entry rides the mint, same shape as §3.
- Neither (the advisory evidence points here) → **the row is a REAL untriaged debt**: it
  stays untagged in the inventory exactly as it is (the mint changes nothing about it), the
  verdict is recorded in the executor's report for the chair's ODQ entry as
  "triaged: reader-side defect candidate — deliberately deferred, documented, not a bug to
  re-find", and the read repair (deleting or re-pointing the dead arm at `:221`) is chartered
  as a follow-up REPAIR lane, **never smuggled into this mint** (§1(d)).

---

## 5. EXECUTOR STEP ORDER — S0 … S12

The mint executes on the BUILD branch (`claude/composite-r4`) in a **fresh dedicated
worktree** (the shared main worktree is dirty with sibling lanes and matches no branch; the
write demands `src/` + tools + baseline fully clean). Provision the worktree's OWN
`node_modules` (lane law; a shared symlink exposes the run to a sibling's `pkill -f`).
Capture every exit as `; echo TRUE_EXIT=$?` in a self-named log — trust no exit you did not
capture.

- **S0 — pin and survey.** Record the branch tip SHA at start (BASE). Re-verify: baseline
  schema 8 and genesis-coincident (§2.5); the 11-path diff BASE vs `3df85a3a` (§2.3); the
  unscanned delta (§2.4); `package-lock.json` unmoved; the standalone gate at BASE exits 1
  with the digest message (the reproduce-the-drift control). Any surprise → STOP-RAISE.
- **S1 — the triage** (§4). Its outcome fixes whether C1 carries 4 or 5 entries.
- **S2 — write CH-1…CH-6 + the C1 pin re-records** (§6 rows P1-P8). Sweep
  `npx vitest run tests/lint` and the OSR suite BEFORE any commit (the five full-gate-only
  ratchets bite at terminals; a comment-only edit can fire §104.4). Expected at this point:
  everything green EXCEPT `observedShapeReaders.walker.test.js` (red by design until C2 —
  its schema pin compares the live baseline to the bumped constant; §6 rows P9-P11) and the
  standalone OSR gate (dark by design until C2).
- **S3 — commit C1** (code + C1 pins; explicit paths staged, never `-A`; pre-commit is
  lint-staged only — measured — so nothing blocks). C1's message declares the landed-dark
  window: gate and walker red until C2, by design.
- **S4 — produce the governed artifact** on the clean committed C1 tree:
  `node scripts/check-observed-shape-readers.mjs --scan-only --scan-mode=legacy-leaf --json=<outside-repo>/OSR9-artifact.json`
  (executes the corpus fresh; binds subject=scanner=C1). Then the report + template:
  `node scripts/migrate-observed-shape-readers.mjs --predecessor=scripts/.observed-shape-readers-baseline.json --legacy=<artifact> --target-schema=9 --json=<report> --review-template=<template>`.
  **Check the report's reconciliation summary FIRST**: expected all-'same' (measured at
  `27c250f9`: the chain reproduces the committed inventory address-for-address, 1412/1412/0/0/0
  — laneMEAS §2.2; STOP: RE-DERIVE, the executor's tip is later). Any 'new'/'increased' row
  must be attributable to a named intervening landed commit — attribute or STOP-RAISE;
  never bulk-accept growth.
- **S5 — complete the review ledger.** Every decision `accept` + nonempty note (the ledger
  fails closed on pending/missing rows). Bulk-scripted notes are lawful for 'same'
  predecessor rows (established mint practice — the schema-4 ledger carried 2,326 rows);
  the scanner-transition row and every non-'same' row get individually reasoned notes
  naming §346.2, EP-1, the two package.json scripts, warFaith.generated.js, and CH-1…CH-6.
- **S6 — bundle:** re-run the migrate script with `--review=<completed> --bundle=<bundle>`.
- **S7 — the migration write**, same clean committed C1 tree:
  `node scripts/check-observed-shape-readers.mjs --write --migrate-schema=9 --migration-review=<bundle>`
  → validates the bundle against the on-disk baseline bytes, re-executes the scan, demands
  the fresh artifact byte-match the bundled one, writes the schema-9 baseline atomically.
  Console line `froze N finding(s) / I identit(ies) across F file(s)` — expected N/I/F equal
  to the schema-8 figures (1998/1412/387 at the pinned tip; STOP: RE-DERIVE).
  ⛔ **NEVER `--amend` C1** and never rebase across the mint: `migrationReview.subjectSha`
  = C1 must remain a committed ancestor forever, or `validateBaselineHistory` reds the gate
  permanently.
- **S8 — the C2 pin re-records** (§6 rows P9-P11: the walker's live-file figures) — legal to
  edit while the baseline is dirty (tests/ is outside the write's clean-check pathspec).
- **S9 — commit C2** (baseline + walker pins). The genesis descendant is now committed.
- **S10 — the in-tree proof at C2:** `npm run check:observed-shape-readers; echo TRUE_EXIT=$?`
  → expect exit 0, "exactly matching the frozen inventory", the M6 notice unchanged at
  theta=0.8/>=8 keys, and the M8/M9 notice now declaring 8 (or 9, per S1) identities. Then
  `npx vitest run tests/lint` full — the walker must now be green, the minKeys boundary pin
  still green.
- **S11 — the DETACHED proof (the OSR law: never weaken the arm).** Fresh worktree at the
  C2 SHA, own node_modules: run the standalone gate → TRUE_EXIT=0. **Plus the memo's
  reproduction pattern as the re-freeze verification:** `git archive <C2-sha> | tar -x` to a
  scratch extraction; recompute the detectorTree manifest digest over the extraction's 11
  paths and compare to the new baseline's `scannerProvenance.detectorDigest`; recompute the
  unscanned digest likewise. Byte-equality here is what "the freeze is restored" MEANS —
  the same method that proved the drift (laneMEAS §8.1) now proves its cure.
- **S12 — the full gate + report.** Full `npm run check` per lane law (bare, fresh shell,
  never wrapped in gate-mutex), the remaining-arc table for the chair, and the ledger/memory
  updates through the chair's collection. Deferred items (§4 routing-3 repair, §8 RAISED)
  written down where they will be found.

**The declared red window:** between S3 and S9 the branch tip carries one red test file and
a dark standalone gate, both by design and both named in C1's message. Execute S3→S9 in one
uninterrupted lane turn; OUTLAST every gate you start.

---

## 6. BOUNDARY-PIN INTERACTIONS — the complete table

**Re-records ride C1** (code-bound; authorization = §346.1/.2 via this charter):

| # | pin | what happens |
|---|---|---|
| P1 | `observedShapeSentinel.test.js:1015-1029` — exemption identity/mechanism/writer exact arrays | +4 (or +5 per S1) rows; keep declaration order |
| P2 | `observedShapeSentinel.test.js:1079-1086` — gate-0 evidence identity/key arrays | same growth |
| P3 | `observedShapeSentinel.test.js:1245` and `:1360` — `expect(BASELINE_SCHEMA).toBe(8)` | → 9; A5 gains a retired-8 rung mirroring the :1275 schema-7 pattern |
| P4 | `observedShapeBaseline.test.js:252` + the validator-table rungs (:554-559) | → 9; retired-8 validator rung added |
| P5 | `observedShapeMigration.test.js:1083-1084` — ⚠ THE INVERSE PIN: `--target-schema=9` is currently pinned TO THROW `/--target-schema must be 8/` | flips: 9 becomes valid; the error-text enumeration pin re-records |
| P6 | `observedShapeMigration.test.js` transition-law fixtures | new target-9 case: 5 delta paths, retained-count 6 (the CH-5 generalization), CH-6's reviewable unscanned movement — extend existing tests, never new files |
| P7 | `observedShapeMigration.test.js:1110` `CORPUS_COVERAGE_TARGET_SCHEMA).toBe(8)` | stays 8 — the retired constant keeps its value; do not touch |
| P8 | sentinel/migration fixtures deriving from `BASELINE_SCHEMA` templates (`:1407`, `:1558-1617`) | derive — re-run, expect green without edits |

**Re-records ride C2** (bound to the live baseline file):

| # | pin | what happens |
|---|---|---|
| P9 | `observedShapeReaders.walker.test.js:252-258` — live baseline schema vs `BASELINE_SCHEMA` | derives; red in the C1→C2 window, green at C2 with no byte change |
| P10 | walker `:268` `{reads: 44, addresses: 31}` and `:269-275` per-identity map | STOP: RE-DERIVE at C2 (arithmetic from §3's address table predicts 60/40 at the pinned tip — never transcribe; read the new baseline) |
| P11 | walker `:594` `banked).toBe(44)` and `:669` `{reads:1998, identities:1412, files:387, bankedReads:44, taggedRows:31}` | inventory triple expected UNCHANGED; banked figures re-derive as P10 |

**Must stay green, untouched — the negative controls:**

| pin | why it proves the mint stayed in scope |
|---|---|
| `observedShapeSentinel.test.js:610` (assertion `:629`) — the minKeys boundary pin, both sides | minKeys stayed 8 (§346.1's refusal held) |
| M11/M12 vocabulary + class-(a) erosion pins (`:687`, `:738`, `:764-978`) | no filter was widened |
| `legacyReaderShapeScan.test.js` — the byte-frozen detector blob pin | the detector was not touched |
| A3/A4 (`:1175`) — banked growth stays red ordinarily | the bank did not become a hole |
| the entire `tests/lint` census at its pinned ceiling, zero new files, zero retitles | the census cannot silently move (a parked file swallows its titles; a rename is a swap — avoid both) |

---

## 7. ROLLBACK

- **Before C2 lands:** the write touched exactly one file —
  `git checkout -- scripts/.observed-shape-readers-baseline.json` restores the schema-8
  genesis bytes (they are committed at C1). Abandoning the mint entirely = revert C1
  (ordinary `git revert`); the estate returns to the status quo ante: gate dark at the tip,
  nothing blocked, mint still owed.
- **After C2, if the detached proof reds:** do NOT hand-edit the baseline and do NOT amend.
  Revert C2 then C1 in order (two ordinary revert commits — history stays intact, so
  `validateBaselineHistory` on any future retry still walks truthfully). Diagnose from the
  captured logs; the bundle, report, and ledger in the scratchpad are the forensic record.
- The mint is not "landed" until S11's detached TRUE_EXIT=0 and digest reproduction are
  captured. A green in-tree run alone is NOT the done bar (a green shared tree can hide a
  red HEAD; the worktree discipline plus the detached proof is the cure).

---

## 8. RAISED / REFUTED / STALE — for the chair before dispatch

1. **⛔ §346.2's cause list is incomplete (new measurement):** `warFaith.generated.js`
   moved the `unscannedInputDigest` (§2.4). The mint remains owed and unchanged in intent;
   the transition surface gains one reviewed file and the CH-6 law change. The chair may
   want the ODQ row annotated at collection.
2. **Two latent defects of the instrument's own migration law, fixed by this mint:** the
   `rowTagsOf` null-reason trap (CH-3 — any declaration-adding mint was impossible as
   written) and the hard-coded 4-path delta assumption (CH-5). Both are in-scope: the mint
   cannot execute without them, and both are behavior-preserving for committed history.
3. **CH-6 is the one genuine governance-shape change** (unscanned movement reviewable for
   target 9). JUDGMENT J1, explicitly vetoable — the alternative (block and escalate) is
   §2.1 CH-6's rejected branch.
4. **No same-only inventory invariant for target 9** (JUDGMENT J2, vetoable): unlike target
   8's `assertCorpusCoverageInventoryInvariant`, target 9 lets non-'same' rows reconcile
   through individually reviewed, accepted, noted decisions — because the executor runs at a
   later tip than the measurement and legitimate landings may move rows. Unattributable
   growth is still a STOP-RAISE (S4), never a bulk-accept.
5. **Stale-premise watch for the executor:** every figure here re-derives (the tip moves
   daily); the §2.5 blocker (a maintenance write moving the baseline off genesis) is
   theoretical but checked at S0; a `package-lock.json` move before execution is a NEW mint
   trigger requiring re-measurement of the delta set.
6. **`test on test` stays deliberately deferred** (documented in the instrument — not a bug
   to re-find). The 22 RECORDED-EXPLAINED identities get no machinery by §346.1 — a future
   production re-binding of chronicleFeed's four feed sources is chartered as an OPTION
   elsewhere, not here.

**JUDGMENT ledger (all vetoable):** J1 unscanned-movement-reviewable over block-and-escalate
(§2.1 CH-6) · J2 review-reconciled inventory over a hard same-only invariant (§8.4) ·
J3 `!== BASELINE_SCHEMA` genesis condition over a special-cased 8→9 branch (CH-3) ·
J4 four entries appended alphabetically, mechanism `save-time-writer`, writer
`applyEvent.js` (§3) · J5 pin split C1/C2 with a declared one-file red window over a
single-commit impossibility (§5) · J6 stresses-triage chartered as procedure + routing, not
pre-decided (§4).

*The chair rules; queue slot 4's executor dispatches from this charter after that review.*
