# CURE-J — the measurements, before the gates

Lane: CURE-J (Opus 5). Base `c33446830`. Branch `cure-j-2026-09-20`. Worktree `$SP/lane-cure-j`.
Stamp: `Sun Sep 20 08:55:49 EDT 2026` (from `date`, same call as the log line).

## 1. THE MOVED RECORDER FILE, CLASSIFIED — the brief's premise, and one correction

`git diff --numstat 141a1d775 c33446830 -- <the three MANIFEST_RECORDER_FILES>`:

```
 scripts/prose-rate-corpus.mjs | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

⚠ THE BRIEF SAYS "3 changed lines"; THE TREE SAYS **1**. `--numstat` prints `1  1
scripts/prose-rate-corpus.mjs`. The premise is unaffected — the correction is to the figure only.

The one changed line, and its enclosing scope (`sed -n '178,212p'`):

```
- * ⚠ `flowDrift` IS NULL BY MEASUREMENT AND NOT BY OMISSION. `EconomicsTab.jsx:251-257` derives
+ * ⚠ `flowDrift` IS NULL BY MEASUREMENT AND NOT BY OMISSION. `EconomicsTab.jsx:272` derives
```

It sits inside the JSDoc block attached to `export function economyDeskOptions`. **CONFIRMED: every
changed character is block-comment text — a source-citation re-address. Not one token of code.**

The other two recorder files did not move, and the stored map proves it independently:

| file | stored `_provenance.recorder` (09-17) | raw sha at c33446830 | |
|---|---|---|---|
| `tests/helpers/dossierManifest.js` | `5ee87f0b…b2bc` | `5ee87f0b…b2bc` | MATCH |
| `tests/helpers/goldenMasterCorpus.js` | `7f09210e…6d5d` | `7f09210e…6d5d` | MATCH |
| `scripts/prose-rate-corpus.mjs` | `0f0efb35…2864` | `d97c3912…4d7c` | **MOVED** |

Exactly one of three moved, by exactly one comment line. The refusal is the IDENTITY, not the corpus.

## 2. THE STRIPPER, PROVED IN A THROWAWAY BEFORE THE TREE WAS TOUCHED

`node ../lane-cure-j-scratch/strip-prototype.mjs` — inline fixture, every shape the brief names:

```
=== FIXTURE, STRIPPED ===
const a = 1; const s = 'a string containing // and /* and */ inside'; const t = `a template containing /* and // and ${a + 1} inside`; const r = /a regex containing \/\/ and [/] inside/g; const d = a / 2;
  OK   the line comment is gone
  OK   the block comment is gone
  OK   the block comment body is gone
  OK   the DIVISION comment is gone
  OK   the STRING survives byte-for-byte
  OK   the TEMPLATE survives byte-for-byte
  OK   the REGEX survives byte-for-byte
  OK   the DIVISION survives as code
```

Counterforce on the three REAL recorder files, both directions:

```
  tests/helpers/dossierManifest.js      raw 18576 b -> stripped  6311 b
    comment APPENDED : UNMOVED (correct) · EDITED : UNMOVED (correct) · ONE-TOKEN CODE : MOVED (correct)
  tests/helpers/goldenMasterCorpus.js   raw  7019 b -> stripped  1964 b
    comment APPENDED : UNMOVED (correct) · EDITED : UNMOVED (correct) · ONE-TOKEN CODE : MOVED (correct)
  scripts/prose-rate-corpus.mjs         raw 40018 b -> stripped 20814 b
    comment APPENDED : UNMOVED (correct) · EDITED : UNMOVED (correct) · ONE-TOKEN CODE : MOVED (correct)
```

Real-file literal preservation and idempotence, all OK (the two regex literals of `templateMatches`,
including `/[.*+?^${}()|[\]\\]/g`, survive byte-for-byte; stripping is a fixed point on all three).

## 3. ⚠ A CONTRADICTION INSIDE THE BRIEF, RESOLVED AND DECLARED

The brief asks for "whitespace otherwise untouched" AND, in the same sentence, for "a comment
appended to a recorder file does NOT move `recorderShas()`". **These cannot both hold.** Removing a
comment leaves its surrounding whitespace behind: appending `\n// note\n` at end of file leaves a
newline the original did not have, and reflowing a docblock from three lines to two changes the line
count. A whitespace-preserving stripper therefore still moves the sha on the very edit the cure
exists to absorb.

Resolved toward making the STATED COUNTERFORCE TRUE: rule 3 collapses every run of whitespace
outside a literal to a single space, and trims. Never to nothing, so `return x` can never become
`returnx`. The identity is thereby insensitive to reformatting as well as to comments; both are
non-behavioural, so the widening costs the pin nothing it was protecting. Declared in the helper's
docblock rather than left to be discovered.

## 4. ⛔ THE OWNER DOOR — commit 2 cannot be taken by this lane

`tests/fixtures/.golden-freeze-register.json` **pins the golden FILE's sha**, and the register is
**FROZEN**:

```
frozenAt    = "2026-09-16T13:55:10Z"
frozenAtSha = "d22ceff01fe3d55c4d4ad0e4cd414dcdbdadb6b8"
row `dossier-prose-manifest`: sha256 = 921c51cf…db41, rows = 2, ownerRow = "§933", proofForm = null
shasum -a 256 tests/fixtures/dossier-prose-manifest-golden.json
  921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41   ← the pin is LIVE and exact
```

`tests/lint/goldenFreeze.walker.test.js:421` — `every frozen row byte-hashes to its register sha256
(gated on frozenAt)` — re-measures `sha256(readFileSync(s.path))` against `s.sha256` (`:429-430`) and
reds on drift. `FROZEN === true`, `s.sha256 !== null`, so the arm is live on this surface.

Therefore any re-record moves the fixture's whole-file sha and reds that arm unless the register row
moves in the same act. The register row may only move through `recordGolden`, which:

1. REFUSES without `GOLDEN_SHIFT_SIGNED` naming a signed shift-record FILE — and `GOLDEN_SHIFT_SIGNED`
   is FORBIDDEN to this lane by `LANE-PARALLEL.md` §6;
2. requires that record's surface entry to carry `action: 're-record'`, and
   `goldenRecordDoor.js:49-53` — `ACTIONS = { 're-record': 'owner', retire: 'owner', enroll: 'chair' }`
   — makes that verb **the owner's**;
3. requires non-blank `ownerWords`, `ownerDate`, `odqRow`, `cause`, `seat`;
4. requires the commit to carry an `Owner-Signed: §NNN` trailer (`commitTrailerRefusal`).

**Could an existing record be reused?** `docs/shift-records/2026-09-17-dossier-contradictions.json`
does name this surface with `action: re-record`, `predictedRows: 2`, and would pass the door
MECHANICALLY. It must not be used. Its `cause` is THE DOSSIER CONTRADICTIONS and it names the exact
bytes it authorized — "Measured fixture sha256 921c51cf…db41 (the door writes it; this figure is the
prediction held)" — which are the bytes on disk now. Its authorization is SPENT. The door's own law
is explicit: "A record authorizes the surfaces it lists and no others — **one cause per record is the
law**, not one record per sitting"; and its docblock names the failure mode by name, "a forged
authorization". CURE-J's cause is an instrument change on 2026-09-20, not the 09-17 contradictions.

⛔ **STOP on commit 2. It is the owner's.** Commit 1 moves no golden and is taken.
