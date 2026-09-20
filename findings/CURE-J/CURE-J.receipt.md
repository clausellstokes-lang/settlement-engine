# CURE-J receipt — run 21's one red

**Lane** CURE-J (Opus 5) · **base** `c33446830` · **branch** `cure-j-2026-09-20` ·
**worktree** `$SP/lane-cure-j` · stamps from `date` in the same call (08:49 → 09:05 EDT, 2026-09-20).

## OUTCOME, FIRST — ⭐ CLOSED GREEN (updated 2026-09-20 12:33 EDT)

**Both commits are landed and proved. Run 21's one red is CURED.**

| | sha | |
|---|---|---|
| commit 1 | `9ee0be7e9bb7b51c7b6152ee2a56de297ff12c05` | the recorder identity becomes the CODE |
| record | `4416e8f9d68fd06a380bd84715681b6e69829ff9` | cherry-pick of the owner-signed shift record |
| commit 2a | `efc4ecf4995b7990705c579fe7fc42df0ec9e070` | `MANIFEST_PROVENANCE` amended |
| commit 2b | `b077f6e79d64ea7401a6190f7a3a7c6f8675aa9c` | the re-record, through the signed door |

`tests/property/dossierProseManifest.test.js` + `generatorGoldenMaster.test.js`:
**`Test Files 2 passed (2)` · `Tests 20 passed (20)`.**

**The owner signed by a standing grant** (2026-09-20, ODQ §934.71; the grant recorded as §934.47
addendum 98 and vetoable there). The chair cut and committed
`docs/shift-records/2026-09-20-cure-j-provenance.json`; this lane verified its content, cherry-picked
it, and ran the door. **The door refused nothing.** §5 below is retained as the record of why the
lane stopped before the signature arrived — the reasoning stands and is why the act is lawful now.

⚠ **Why commit 2 needed THREE commits, not one.** `recordGolden` refuses a tree dirty beyond
`[register, fixture, record]`, and `scripts/prose-manifest-cells.mjs` is none of those three — so the
provenance amendment had to be committed BEFORE the door could run. See §10.

## 1. THE MOVED RECORDER FILE, CLASSIFIED — and one correction to the brief

`git diff --numstat 141a1d775 c33446830` over the three `MANIFEST_RECORDER_FILES`:

```
1	1	scripts/prose-rate-corpus.mjs
```

⚠ **The brief says "3 changed lines"; the tree says ONE.** The premise is untouched; only the
figure was wrong. The changed line, in the JSDoc block attached to `export function
economyDeskOptions`:

```
- * ⚠ `flowDrift` IS NULL BY MEASUREMENT AND NOT BY OMISSION. `EconomicsTab.jsx:251-257` derives
+ * ⚠ `flowDrift` IS NULL BY MEASUREMENT AND NOT BY OMISSION. `EconomicsTab.jsx:272` derives
```

**CONFIRMED: every changed character is block-comment text. Not one token of code.** The other two
recorder files are proved unmoved by the stored map itself — the committed `_provenance.recorder`
carries `5ee87f0b…b2bc` / `7f09210e…6d5d`, which are exactly their raw shas at this tip; only
`prose-rate-corpus.mjs` differs (`0f0efb35…2864` stored, `d97c3912…4d7c` live).

## 2. THE STRIPPER'S EXACT RULE, AND ITS FIXTURE PROOF

Comments removed; **string, template and regex literals copied byte-for-byte**; every run of
whitespace outside a literal collapsed to a single space, never to nothing (`return x` can never
become `returnx`); the result trimmed.

It is a **scanner, not a third regex pair**. The estate's two existing spellings
(`tests/domain/contributionLedgerShape.test.js:43` `codeOnly`,
`tests/config/pageBackgrounds.test.js:90`) cannot see a string literal and blank the contents of any
string holding a comment marker — FIX-P3's finding. On a recorder file full of such strings that
would make the identity blind to a real code edit, which is the exact failure the pin exists to
refuse.

Inline fixture, every shape, executed (throwaway then re-driven as a committed arm):

```
const a = 1; const s = 'a string containing // and /* and */ inside'; const t = `a template containing /* and // and ${a + 1} inside`; const r = /a regex containing \/\/ and [/] inside/g; const d = a / 2;
  OK  the line comment is gone            OK  the STRING survives byte-for-byte
  OK  the block comment is gone           OK  the TEMPLATE survives byte-for-byte
  OK  the block comment body is gone      OK  the REGEX survives byte-for-byte
  OK  the DIVISION comment is gone        OK  the DIVISION survives as code
```

Real-file controls: `templateMatches`'s two regex literals — including
`/[.*+?^${}()|[\]\\]/g`, which holds `${`, a character class and escaped backslashes — survive
byte-for-byte; the docblock prose does not; stripping is a fixed point on all three files.

## 3. THE COUNTERFORCE, BOTH DIRECTIONS, ON THE THREE REAL RECORDER FILES

```
tests/helpers/dossierManifest.js      raw 18576 b -> code  6311 b
tests/helpers/goldenMasterCorpus.js   raw  7019 b -> code  1964 b
scripts/prose-rate-corpus.mjs         raw 40018 b -> code 20814 b
  (a) a comment APPENDED at end of file   : UNMOVED  (correct)  [all three]
  (b) a comment EDITED IN PLACE           : UNMOVED  (correct)  [all three]   ← FIX-C2's own shape
  (c) a ONE-TOKEN CODE edit (const->let)  : MOVED    (correct)  [all three]
```

⭐ **Every mutation is made IN MEMORY.** The arm never writes to the tree, and `recorderShas()` is
re-measured at the end as the control that says so. Chosen over the brief's write-then-restore,
which can fail and leave a recorder file edited — a hazard with no upside here.

## 4. THE RE-RECORD, MEASURED WITHOUT WRITING IT (`predict-rerecord.mjs`)

This is the answer the owner needs before signing. Read-only against the tree; the candidate bytes
went to `$SP/lane-cure-j-scratch/candidate-fixture.json`, never to `tests/`.

```
rows byte-identical    : YES          rows moved 0 · added 0 · removed 0   (1050 -> 1050)
committed rowsSha      : e972c0d0c177256a5db45ee502bd65f580426289093edfa9ae320d76f6832559
candidate rowsSha      : e972c0d0c177256a5db45ee502bd65f580426289093edfa9ae320d76f6832559   UNCHANGED

provenance keys:  held  shift · ruling · car · rows · rowsSha
                  MOVED recordedOverSha · note · recorder      ← exactly the three the brief prescribes

whole-file sha   committed 921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41
                 candidate 0f64dbd81c69adb5e5961babd3a268cba3d5e52646a06277d9549fe95b89879a
door predictedRows (rowsIn = TOP-LEVEL keys, not 1050): 2 -> 2
```

**No row moves. This is an instrument re-record with zero prose movement**, and `shift: 'PROSE'` /
`ruling` stay untouched because they still name the last owner-signed PROSE shift, which is still
the truth of the rows.

## 5. ⛔ THE FREEZE REGISTER, ITS LAW, AND WHY THIS IS AN OWNER DOOR

`tests/fixtures/.golden-freeze-register.json` **pins the golden FILE's sha**, and is **FROZEN**:

```
frozenAt = "2026-09-16T13:55:10Z"   frozenAtSha = "d22ceff01fe3d55c4d4ad0e4cd414dcdbdadb6b8"
row `dossier-prose-manifest`: sha256 921c51cf…db41 · rows 2 · ownerRow "§933" · proofForm null
shasum of the fixture on disk:      921c51cf…db41      ← the pin is LIVE and exact
```

`tests/lint/goldenFreeze.walker.test.js:421-433` (`every frozen row byte-hashes to its register
sha256`) re-measures `sha256(readFileSync(s.path))` against `s.sha256` and reds on drift. `FROZEN`
is true and `s.sha256` is non-null, so the arm is live on this surface. A re-record moves the
fixture to `0f64dbd8…879a` and reds it unless the register row moves in the same act.

The register row may move only through `recordGolden`, which:

1. refuses without `GOLDEN_SHIFT_SIGNED` naming a signed record file — **forbidden to this lane**
   (`LANE-PARALLEL.md` §6);
2. requires `action: 're-record'`, and `goldenRecordDoor.js:49-53`
   (`ACTIONS = { 're-record': 'owner', retire: 'owner', enroll: 'chair' }`) makes that verb
   **the OWNER's**;
3. requires non-blank `ownerWords`, `ownerDate`, `odqRow`, `cause`, `seat`;
4. requires the commit to carry an `Owner-Signed: §NNN` trailer (`commitTrailerRefusal`).

**Why the existing record must NOT be reused.**
`docs/shift-records/2026-09-17-dossier-contradictions.json` names this surface with
`action: re-record`, `predictedRows: 2`, and `proofForm: derived-artefact` — and because the
register row's own `proofForm` is `null`, the door's mismatch check is skipped, so it **would pass
mechanically**. It must not be used. Its `cause` is THE DOSSIER CONTRADICTIONS and it names the very
bytes it authorized ("Measured fixture sha256 921c51cf…db41 — the door writes it; this figure is the
prediction held"), which are the bytes on disk now: **its authorization is spent.** The door's own
law is "A record authorizes the surfaces it lists and no others — one cause per record is the law",
and its docblock names the failure mode: "a forged authorization". CURE-J's cause is an instrument
change on 2026-09-20, not the 09-17 contradictions.

### PROPOSAL for the owner (reported, never built — no file was written to `docs/shift-records/`)

A new record, one cause, whose surface entry is
`{ surface: 'dossier-prose-manifest', action: 're-record', predictedRows: 2, proofForm: 'derived-artefact' }`,
with `odqRow` naming the CURE-J row, `ownerDate: '2026-09-20'`, the owner's own words, and a `cause`
that can state the measured facts above: **zero rows moved, `rowsSha` unchanged at `e972c0d0…2559`,
`921c51cf…db41 -> 0f64dbd8…879a`, provenance-only.** Commit 2 would then amend
`scripts/prose-manifest-cells.mjs`'s `MANIFEST_PROVENANCE` (`recordedOverSha` -> `c33446830`, one
sentence appended to `note`, `shift`/`ruling` untouched), run `--record`, and carry an
`Owner-Signed:` trailer. The door writes the fixture and the register row in one act and throws by
design; the receipt is the plain re-run.

## 6. EVERY COUNT LINE (mutex SHARED tier, exports inline, default reporter, one directory each)

| gate | result |
|---|---|
| RED-FIRST at base (tree confirmed clean, cure text confirmed absent first) | `Tests 1 failed \| 14 passed (15)` — the one title; diff named exactly `prose-rate-corpus.mjs` |
| after the cure: `dossierProseManifest` + `generatorGoldenMaster` (control) | `Test Files 1 failed \| 1 passed (2)` · `Tests 1 failed \| 19 passed (20)` — control GREEN, both new arms GREEN, same one title red |
| `tests/data/dossierStateProseProjection.contract.test.js` | `Tests 79 passed (79)` |
| `tests/domain/composeStateProse.test.js` | `Tests 51 passed (51)` |
| `tests/lint/` goldenFreeze + negativeAssertionAnchor + mutationCoverageManifest | `Test Files 3 passed (3)` · `Tests 109 passed (109)` |
| `tests/copy/voiceMechanics.test.js` | `Tests 30 passed (30)` |
| `npx eslint` on both touched files | **EXIT 0** |
| lighting walker, run ONCE separately | `Tests 1 failed \| 33 passed (34)` — EXPECTED |

The helper-importer set was **measured**, not assumed: `git grep -l "helpers/dossierManifest" -- tests`
returns exactly `tests/data/dossierStateProseProjection.contract.test.js`,
`tests/domain/composeStateProse.test.js` and `tests/property/dossierProseManifest.test.js`.

**GOLDENS, before the first edit and after the last — byte-identical:**
`generator-golden-master.json 7177cd6e…8f1e` · `dossier-prose-manifest-golden.json 921c51cf…db41`.
`.golden-freeze-register.json` and `.lighting-census-baseline.json` untouched.

**LIGHTING** frozen at `2656·383·2273·25074·6684`. Measured: **titles 25074 -> 25076, DELTA +2**
(two titles into an existing file and an existing describe); files, parked, credited and suiteTitles
all held. ⛔ NOT REFROZEN — the refreeze is the train's terminal act and the chair's.

## 7. ⛔ NOTICED AND NOT TOUCHED

1. **43 test files carry their own local `stripComments` spelling** (`git grep -lE "function
   stripComments|const stripComments" -- tests | wc -l` = 43), and most are the unsafe
   `String.replace` pair that blanks string contents. Two files carry **two copies each**:
   `tests/architecture/layerBoundaries.test.js:92` and `:199`;
   `tests/domain/espionageProducts.test.js:221` and `:1290`. CURE-J's is the estate's first
   scanner-grade one and now sits in `tests/helpers/dossierManifest.js`. **Slot:** a TOOL item to
   hoist it into a shared `tests/helpers/` module, converge the 43, and add a walker forbidding a
   new local spelling — the single-writer pattern the estate already uses elsewhere.
2. **47 of 50 frozen register rows carry `proofForm: null`, which makes the door's
   `PROOF_FORM_MISMATCH` refusal structurally unreachable on all of them.**
   `recordGolden` passes `row.proofForm ?? null` and `verifyShiftRecord` guards the check with
   `if (proofForm != null …)`. ODQ §555.8's stated protection — "a map-family surface may not prove
   with a settlement-record hash" — is therefore inert on `town-map-golden`, `town-map-v2-golden`,
   `belief-map-golden`, `sea-lanes-golden`, `generator-golden-master` and 42 more, i.e. on exactly
   the map-family surfaces that rule was written for. **Slot:** a FIX item to back-fill `proofForm`
   on the 47 frozen rows (a register edit, owner-gated), or to make a null `proofForm` a refusal
   rather than a skip. Not this lane's to decide.
3. **The `dossier-prose-manifest` register row's `note` is stale prose inside a frozen row.** It
   still reads "this register is UNFROZEN, and two of its own arms refuse both acts" and "When the
   freeze act arms this register, its re-record path becomes the door like every other" — but
   `frozenAt` has been set since 2026-09-16. **Slot:** the note would naturally be corrected in the
   same owner-signed act that re-records this surface.
4. The brief's "3 changed lines" figure was **1** (§1 above). Reported, not adjudicated.
5. `MANIFEST_PROVENANCE.note` still describes the 09-17 cell counts ("73,284 cells become 72,240");
   the live run prints `72240 cells`, so it is accurate and was left alone.

## 8. JUDGMENT CALLS

1. **The whitespace rule.** The brief asked for "whitespace otherwise untouched" AND "a comment
   appended does NOT move `recorderShas()`" in the same sentence; these cannot both hold, because
   removing a comment leaves its surrounding whitespace behind. *Decision:* collapse whitespace
   outside literals, making the stated counterforce true. *Rejected:* preserve whitespace, which
   leaves the cure not curing. *Consequence, declared in the docblock:* the identity is insensitive
   to reformatting as well as to comments — both non-behavioural. *Reverse:* restore the raw digest
   in `recorderShas` and re-record.
2. **Template literals are opaque**, so a comment inside a `${}` interpolation still moves the
   digest. Deliberately over-sensitive: an extra re-record, never a missed behaviour change. No
   recorder file carries one today.
3. **Counterforce in memory rather than write-then-restore** (§3). Removes a hazard class from the
   arm itself.
4. **Commit 1 taken, commit 2 stopped.** The brief attaches its STOP to the register update inside
   commit 2 ("STOP if that needs an owner door"), and commit 1 moves no golden, touches no `src/`
   byte and is independently provable. Landing it is what turns the owner's signature into a
   ONE-TIME act instead of one per citation re-address. *Reverse:* `git revert 9ee0be7e9`.

## 9. COMMITS

- **`9ee0be7e9bb7b51c7b6152ee2a56de297ff12c05`** — CURE-J commit 1, the comment-insensitive recorder
  identity. `git show --stat HEAD` names exactly `tests/helpers/dossierManifest.js` and
  `tests/property/dossierProseManifest.test.js`; `git status --short` empty; trailer
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`; the pre-commit hook rewrote nothing.
- **`4416e8f9d68fd06a380bd84715681b6e69829ff9`** — cherry-pick of the chair's signed record.
- **`efc4ecf4995b7990705c579fe7fc42df0ec9e070`** — the `MANIFEST_PROVENANCE` amendment.
- **`b077f6e79d64ea7401a6190f7a3a7c6f8675aa9c`** — the re-record (fixture + register), carrying
  `Owner-Signed: §934.71`, which `commitTrailerRefusal` was driven against and returned `null`.

## 10. THE SIGNED RE-RECORD, EXECUTED

**The command, the door's exact verb (`goldenRecordDoor.js:46`, `SIGNATURE_ENV`):**

```
GOLDEN_SHIFT_SIGNED=docs/shift-records/2026-09-20-cure-j-provenance.json \
  node scripts/prose-manifest-cells.mjs --record
```

The door verified the record's content, refused nothing, wrote fixture and register in one act, and
**threw by design (EXIT 1)**:

> golden RE-RECORDED through the signed door: surface 'dossier-prose-manifest', action 're-record',
> … row §934.71. sha256 `921c51cf…db41` -> `88983938…4084`; rows 2 -> 2.

**The load-bearing claim, re-verified on the WRITTEN bytes against HEAD:**
`rows byte-identical YES` · `rowsSha e972c0d0…2559 UNCHANGED` · `1050 -> 1050` ·
`moved 0 · added 0 · removed 0` · provenance `shift`/`ruling`/`car`/`rows`/`rowsSha` **held**,
`recordedOverSha`/`note`/`recorder` **moved** — exactly the three owed.

**The register row, moved BY THE DOOR alone:**
`sha256 921c51cf…db41 -> 88983938…4084` (the fixture's new bytes exactly) ·
`ownerRow §933 -> §934.71` · `rows 2 -> 2` (unmoved). No hand edit. The door stamped no status line
on the record, so that file is unchanged.

⚠ **THE PREDICTED WHOLE-FILE SHA AND THE ACTUAL DIFFER, AND THE CAUSE IS THIS LANE'S OWN AMENDMENT.**
The dry measurement predicted `0f64dbd8…879a`; the door wrote `88983938…4084`. Between the two runs
the PROVENANCE TEXT changed: `recordedOverSha` went from the dry run's abbreviated `c33446830` to the
full committed tip `4416e8f9d68…29ff9`, and the appended `note` sentence gained the record's path.
Both are provenance bytes, so the whole-file digest moved with them. The signed record anticipated
this (`wholeFileShaAfterPredicted`: "the lane's dry measurement; re-measured at the door write"), and
the MACHINE-CHECKED prediction — the door's `predictedRows` — held at 2 -> 2. The rows, which is what
a prediction on this surface is for, were predicted byte-identical and **are** byte-identical.

**Post-re-record gates**, all through the mutex SHARED tier with counts:
`Test Files 2 passed (2) · Tests 20 passed (20)` (the suite + the control — **the provenance red is
cured**) · `Tests 109 passed (109)` (goldenFreeze + the two standing walkers) ·
`Tests 79 passed (79)` · `Tests 51 passed (51)` · `Tests 30 passed (30)` · eslint **EXIT 0**.
Control golden `generator-golden-master.json 7177cd6e…8f1e` byte-identical throughout.
Lighting `titles 25076`, **DELTA +2 unchanged from commit 1** (commit 2 adds no title and no test
file); not refrozen.
