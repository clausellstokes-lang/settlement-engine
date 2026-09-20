# FIX-P1 — LANE RESUME NOTE (clean pause for the account transfer, 2026-09-20 ~13:5x EDT)

`LANE  = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-fix-p1`
`SCR   = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-fix-p1-scratch`
`SLOT  = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/slot-2`

---

# ⭐ COMPOSED — 2026-09-20 ~14:4x EDT (successor chair, session 4a1823e2). LANE DONE.

**BOTH ASSIGNMENTS ARE COMPOSED AND PROVEN. THE SLOT AND THE GATE ARE RELEASED.**
Full receipt: `$SCR/FIX-P1.receipt-composition.md` (every count line verbatim).

Slot tip `20d460375` -> **`da5310f30`**, branch `fixes-2026-09-18-consist`, tree CLEAN.

| # | composed sha | what |
|---|---|---|
| 1 | **`ee204c827`** | assignment 1 — `61c5f1722` cherry-picked **CLEAN, no conflict**; blob `cd646ddfe…` **BYTE-EQUAL** to the original; same file set, same stat |
| 2 | **`da5310f30`** | assignment 2 — the CURE-J archival roster, `tree` 16 -> 17 (2 files, +11 −3) |

**THE PURPOSE WAS MET.** `tests/lint` WHOLE at the composed tip:
`Test Files  1 failed | 176 passed (177)` · `Tests  1 failed | 2846 passed (2847)` · 227 s ·
exit 1 — and the ONE red is the **lighting walker at `files`**,
`expected 2665 to be 2664`, whose +1 is FIX-D9's and EM-R0a's (2 test files added, 1
deleted since the register's `measuredAtSha d279d13eb`). **My delta is ZERO.**
⚠ The walker stops at the FIRST miss, so `parked`/`credited`/`titles`/`suiteTitles` were
NEVER EVALUATED — the chair re-measures all five at the eighth refreeze.

All three previously-red titles are GREEN: the two `observedShapeReaders` arms (cured by
`ee204c827`) and `the archival exclusion is still the set this walker documents` (cured by
`da5310f30`).

Other proofs, all exit 0: `tests/scripts` `9 passed (9)` / `125 passed (125)` 48 s ·
`tests/build` `59 passed (59)` / `478 passed | 65 skipped (543)` 22 s (dist/ was present,
no build needed) · `tests/lib` `174 passed (174)` / `1800 passed (1800)` 31 s ·
`check-observed-shape-readers.mjs` exit 0, `1964 finding(s), exactly matching the frozen
inventory`, zero `anonForkSalt` rows · `npx eslint` BARE exit 0 · goldens `7177cd6e…8f1e`
/ `88983938…4084` UNMOVED before and after.

**NOTHING REMAINS FOR THIS LANE.** The three things noticed and NOT touched (the citation
baseline's self-contradicting `frozenAt.burnedDownBy`, the lighting walker's ordered
assertion hiding four figures, the `docs.live` 482 -> 484 drift) are written up in the
receipt's closing section for the chair to slot.

---

## (HISTORICAL — the state at the account-switch pause, superseded by the section above)

**STATE: STOPPED CLEAN.** Lane branch `fix-fork-salt-2026-09-20`, `git status --short`
EMPTY, nothing running, the slot untouched since the FIX-P1c composition.

## LANE BRANCH — four commits, all committed, tree clean

| sha | what |
|---|---|
| `e0b03b63a` | FIX-P1 — per-visitor fork salt; account id no longer truncated |
| `92e959285` | FIX-P1b — signed-in suffix is a 48-bit two-round digest (12 hex) |
| `5fbe2d82c` | FIX-P1c — `SeedField` `maxLength`; determinism proven by execution |
| **`61c5f1722`** | **FIX-P1d — THE OSR CURE (assignment 1). Green on this branch.** |

## ALREADY COMPOSED INTO THE SLOT (do not redo)

| lane sha | composed sha | note |
|---|---|---|
| `e0b03b63a` | `326dc232f` | conflict in `FoundingWorlds.jsx` resolved, both hunks kept |
| `92e959285` | `75ea6d0e4` | clean |
| `5fbe2d82c` | `5dd5e8e68` | conflict in `LayeredConfigurationPanel.jsx` resolved, both hunks kept |

`61c5f1722` is **NOT** composed yet.

---

## ⛔ THE TWO ASSIGNMENTS WAITING ON "THE SLOT IS YOURS"

### 1. Compose the OSR cure `61c5f1722`
Cherry-pick onto the then-tip. It touches ONE file, `src/lib/anonForkSalt.js`, and
should apply clean (no other lane is in that file). If it conflicts, keep both sides
and diff against both parents as before.

### 2. SECOND commit at the composition — the CURE-J archival roster (assigned, not scope creep)
FIX-D9 attributed the third composed-tip red: `sourceCitationIntegrity`'s
archival-exclusion arm reds `tree: 16 → 17` because
`docs/shift-records/2026-09-20-cure-j-provenance.json` (CURE-J's record, `0d0598a75`,
an ancestor of the tip) is a NEW document in an archival tree the walker documents as
a fixed set. Add that record to the walker's documented archival set — the one line —
with subject exactly:

```
CURE-J follow-up (by FIX-P1's lane at the composition): the citation walker's archival roster gains the 2026-09-20 shift record (16 → 17)
```

Purpose: `tests/lint` WHOLE at the composed tip then reds on the **lighting walker ONLY**.

Then re-prove `tests/lint` WHOLE at the composed tip and report its count line.

---

## THE COMPOSED-TIP `tests/lint` RUN, WITH ATTRIBUTION (taken at `5dd5e8e68`)

`Test Files 3 failed | 173 passed (176)` · `Tests 4 failed | 2825 passed (2829)`

**Three files, four titles:**

| # | Title | File | Whose |
|---|---|---|---|
| 1 | `THE CENSUS IS AN ASSERTION, NOT A SENTENCE — every stated figure is executed` — `expected 2665 to be 2664` | `sovereigntyLightingContract.walker.test.js` | ⛔ **EM-R0a's**, not mine. PROVEN: the seventh refreeze register (`measuredAtSha d279d13eb`) already banks FIX-P1 (+1) by name in its own note, and `git log --diff-filter=A d279d13eb..HEAD -- "tests/**/*.test.js"` names exactly ONE added file, `tests/lint/recordRegisterTotality.walker.test.js`, from `26f22d394` (EM-R0a). My FIX-P1c adds NO test file. |
| 2 | `SHRINK-ONLY: no file exceeds its frozen ceiling, and no row has vanished` — `expected { violations: 1, stale: +0 }` | `observedShapeReaders.walker.test.js` | ⛔⛔ **MINE (FIX-P1c)** — cured by `61c5f1722` |
| 3 | `A1/A7: schema-7 filters narrow ordinary noise while explained writers stay banked live` — `expected { reads: 1965, identities: 1391 } to deeply equal { reads: 1964, identities: 1390 }` | `observedShapeReaders.walker.test.js` | ⛔⛔ **MINE (FIX-P1c)**, same cause (+1 read, +1 identity) — cured by `61c5f1722` |
| 4 | `the archival exclusion is still the set this walker documents` — `the archival roster moved` | `sourceCitationIntegrity` suite | **OTHER HANDS** — CURE-J's `0d0598a75` shift record, `tree 16 → 17`. My FIX-P1c touched NO doc (its four files are 2 src + 2 tests). This is assignment 2. |

**The convicting message, verbatim, for the two that were mine:**

```
src/lib/anonForkSalt.js: read(s) of a key no writer produces, outside the frozen inventory:
    NEW      seed on config — 1 read(s); this file has no frozen row for it (ceiling 0)
```

The instrument was RIGHT: `seed` is not a key of the generator's config (`forkConfigFor`
deletes it; a `seed` left in a persisted config once broke every later generation in that
browser), so a module outside the data table must not read one. `src/data/sampleSettlements.js`
holds the only frozen row (ceiling 1, spent by `forkSeedFor`'s guard), so "read it elsewhere"
was not available either. The cure measures the ceiling by RUNNING `forkSeedFor` at the
widest suffix it can be handed — no shape read at all, and the ceiling can no longer drift
from the seed's actual format.

## COUNT LINES I HAVE

**At the composed tip `5dd5e8e68` (slot):**
- `tests/components` WHOLE — `Test Files 297 passed (297)` · `Tests 2105 passed (2105)` ⭐ P3's SeedField pins and my two new arms green together; +2 over the pre-P1c tip, exactly my two arms
- `tests/ui` WHOLE — `Test Files 162 passed (162)` · `Tests 1076 passed (1076)`
- `tests/lib` WHOLE — `Test Files 174 passed (174)` · `Tests 1800 passed (1800)`
- `tests/lint` WHOLE — `Test Files 3 failed | 173 passed (176)` · `Tests 4 failed | 2825 passed (2829)` (table above)
- Goldens at the tip, before and after, both unmoved:
  `7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e` generator /
  `88983938ddcf28341031e186d855fef950e6b299ec4b8fc87f170ece1b994084` prose manifest (CURE-J's re-record)

**On this branch, for the cure `61c5f1722`:**
- `node scripts/check-observed-shape-readers.mjs` — **EXIT=0**, the `anonForkSalt.js` NEW row gone (was EXIT=1)
- `tests/lint/observedShapeReaders.walker.test.js` — `Tests 46 passed (46)`
- `tests/lib` WHOLE — `Test Files 174 passed (174)` · `Tests 1800 passed (1800)`
- `tests/components` WHOLE — `Test Files 292 passed (292)` · `Tests 2055 passed (2055)`
- `tests/lint` WHOLE — `Test Files 1 failed | 171 passed (172)` · `Tests 1 failed | 2775 passed (2776)`; the ONE red is the lighting walker, `expected 2652 to be 2650` — this branch's register is my base's and predates both refreezes, so it is not ownable here
- `npx eslint src/lib/anonForkSalt.js` — exit 0
- `FORK_SEED_MAX` unchanged at **26**; independent cross-check `longest card (13) + 1 + FORK_SUFFIX_MAX (12) = 26` agrees

## RUNS STILL OWED

1. `tests/lint` WHOLE at the composed tip AFTER both assignments land — expected red on the
   lighting walker ONLY.
2. Goldens hashed before/after at the composition (expect `7177cd6e…` / `88983938…`).
3. `git show --stat HEAD` naming exactly the composed files; `git status --short` empty.

## THE EXACT NEXT COMMAND (when "the slot is yours")

```sh
cd "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/slot-2"
git status --short   # MUST be empty; note the tip sha
git cherry-pick 61c5f1722
```

Then assignment 2 (the archival roster line + its own commit), then:

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint
```

⛔ Two exports inline on every vitest line; ONE directory per invocation; default reporter;
eslint BARE; a line with no printed count DID NOT RUN; never refreeze the lighting register;
never touch the foreign stash (`stash@{0}: On analytics-intelligence-layer`).

## ⛔ NOTICED, STILL UNOWNED

- **No instrument catches a raw NUL / binary-classified source file.** FIX-P1b embedded one
  (`git diff --numstat` read `-  -` for `anonForkSalt.js`) and it was caught by eye, twice —
  the same trap then rejected the commit message. A walker asserting no tracked text file
  contains a NUL would close the class.
- **My "clean apply" prediction for FIX-P1c was wrong** and the chair had to probe it. Both
  composition conflicts were the same shape: an import block two lanes both widened. A lane
  predicting a clean apply should dry-run the pick rather than reason from the hunks.
- **`ANON_SALT_HEX` and `ACCOUNT_DIGEST_HEX` are both 12 by different provenance** (random
  UUID slice vs two-round digest). Recorded so nobody collapses them into one derivation.
