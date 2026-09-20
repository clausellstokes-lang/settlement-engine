# EM-B1f — RECEIPT, BATCHES 1–3 EXECUTED. Tree clean, awaiting CURE-J.

Stamped `Sun Sep 20 09:05:26 EDT 2026`. Branch `fixes-2026-09-18-consist` @ **`6a3e8089f`**.
Blocker 1 cleared by the chair (`6a3e8089f`, `retiredSymbols` withdrawn); re-verified in this
lane's tree at ceiling 6: `[implementation-packets] valid: 194 packets (1 READY)` **EXIT 0**.

---

## ⛔⛔ ONE DEVIATION FROM §6 VERBATIM — NAMED FOR THE CHAIR'S VETO

**§6's exact contract does not typecheck.** `NPC_UNAVAILABLE_STATUSES` is declared
`@type {readonly NpcStatus[]}`, so `OFF_STAGE_STATUSES.filter(...)` is `readonly NpcStatus[]` and
§6's `OFF_STAGE_STATUSES.includes(String(o.status || '').toLowerCase())` is a type error on
**both** sealed typecheck configs (checks 2 and 3):

```
src/domain/roads/state.js(169,40): error TS2345: Argument of type 'string' is not assignable to
  parameter of type '"active" | "removed" | "exiled" | "jailed" | "missing" | "retired"'.
[typecheck-ratchet] TYPE REGRESSIONS … src/domain/roads/state.js: 1 error(s) (baseline 0) — +1
[domain-strict]     … src/domain/roads/state.js: 1 strict errors (baseline 0) — +1
```

**Cure applied — the file's OWN existing idiom, the HAYSTACK widened, never the needle:**

```js
  if (o && /** @type {readonly string[]} */ (OFF_STAGE_STATUSES).includes(String(o.status || '').toLowerCase())) return true;
```

⭐ **Why the haystack and not the needle:** the needle is an UNTRUSTED runtime value and the
question is exactly whether it is a member, so casting it INTO `NpcStatus` would assert the thing
being asked. The line above it already uses this JSDoc-cast idiom
(`/** @type {Parameters<typeof isInStasis>[0]} */ (npc)`).

**NOTHING MEASURED MOVED** (re-measured after the cure):

| figure | before cure | after cure | §7 budget |
|---|---|---|---|
| effective lines | 293 (+5) | **293 (+5)** | ≤6 ✓ |
| minified bytes | 7,911 B (+184) | **7,911 B (+184)** | ≤370 B ✓ |
| declaration line | byte-identical | **byte-identical** | pinned ✓ |
| raw lines | 607 | 610 (+3 comment lines) | not budgeted |

**After:** `[typecheck-ratchet] OK — no type regressions (167 error(s), ceiling 167).` ·
`[domain-strict] ✓ no strict-type regressions (1113 errors, ceiling 1113).` · `eslint EXIT=0`.

⚠ **Decided in-scope and recorded vetoably:** 0 effective lines, 0 bytes, inside §7's named region,
the pinned invariant preserved. Without it the packet fails two of its own sealed checks and cannot
land at all. **The chair may veto the spelling at the flip; §6's text needs the same correction.**

---

## BATCH 1 — THE RED-FIRST PROOF (`exit=1`)

Production edit withdrawn (`git checkout --` on my own file only); tree proved pre-cure
(`grep -c OFF_STAGE_STATUSES` → **0**, `grep -c NPC_UNAVAILABLE_STATUSES` → **0**).

```
Test Files  3 failed (3)
     Tests  4 failed | 44 passed (48)
```

⭐ **Exactly the four new titles red; all 44 pre-existing titles green.**

```
FAIL tests/domain/roadsParticipation.test.js > … > EM-B1f A4 — a JAILED NPC is off-stage for participation while the SAVE still holds them by id
FAIL tests/domain/roadsParticipation.test.js > … > EM-B1f A7 — the union walker carries the chokepoint as its ninth row, spelled `derived`, with the machinery that makes the kind real
FAIL tests/domain/roadsState.test.js       > … > EM-B1f — status-based absence: the arm is DERIVED and exact, and a REVERSIBLE absence keeps the place
FAIL tests/domain/warSeatBooks.test.js     > … > EM-B1f — never lets a JAILED roster holder keep the seat (design §15: a jailed or exiled holder cannot keep a seat)
```

A2's red: `expected undefined to deeply equal [ 'exiled', 'jailed', 'removed' ]`.
A1's red: received `interestKind:'seat'`, `seatWeight01:0.3744`, `securityBand:'holding'`,
`settlementWeight01:0.6256` — **the jailed mayor who still governs, reproduced.**
Cure restored byte-identically (`761e0adaa692…c5cd` both sides).

⭐ **Written-contract arms proved by COUNTERFORCE, not red-first** (§P6): A5 (dormancy — the same
settlement reference) and A3 (the four existing `it`s) hold at the base. Their counterforce is the
44-green control above plus `roadsDormancyGolden` in batch 3.

## BATCH 2 — THE FOCUSED GREEN AND THE WALKER

| step | result |
|---|---|
| `npx eslint` (six files, sealed check 0) | **EXIT 0** |
| `npm run typecheck:ratchet` (`tsconfig.full.json`) | **OK — no type regressions (167 error(s), ceiling 167)** |
| `npm run typecheck:domain:strict` (`tsconfig.domain-strict.json`) | **✓ no strict-type regressions (1113 errors, ceiling 1113)** |
| roadsState + roadsParticipation + warSeatBooks + warSeatTermination | `Test Files 4 passed (4)` · **`Tests 52 passed (52)`** · exit 0 |
| `statusUnionTotality.walker.test.js` | `Test Files 1 passed (1)` · **`Tests 4 passed (4)`** · exit 0 |

### §8 step 4 — THE DELETION PROOF, under §P6 mutant hygiene

Pre-mutant SHA-256 `3535cbb431310740e760a33d26d78daf5ee05402351c9ecb477abced13d496e1`.
Bytes really changed: **34,234 → 33,493 (−741)**; `symbol: 'isOffStage'` count **0**.

```
Tests  1 failed | 3 passed (4)      exit=1
FAIL … > A3 — T2: the trigger is DERIVED, the flagged set is SET-EQUAL both directions …
AssertionError: a file under src/ spells a discriminating NpcStatus word and is on neither the
consumer roster nor the exemption register…: expected [ …(7) ] to deeply equal [ …(6) ]
  [ "src/domain/density/factionLifecycle.js", "src/domain/entities/npcs.js",
+   "src/domain/roads/state.js",
    "src/domain/worldPulse/magicFormsPractitioner.js", "…npcLadderKernel.js",
    "…npcLadderState.js", "…warSeatBooks.js" ]
```

⭐ **Convicted BY NAME, one title, the named acceptance arm** — no ambiguous mutant.
⭐ **STOP 7 CLEAR, proved by this same diff: `FLAGGED` gains ONLY `src/domain/roads/state.js`**
(6 → 7; the other six unchanged). `TRIGGER` still `['dead','exiled','retired']` (A3 green above).
Restored to the exact pre-mutant SHA-256; re-run green inside `tests/lint` whole (batch 3).

ⓘ **Confirms receipt item 2, previously PLAUSIBLE:** `FLAGGED` is **six** files at the base, so the
walker's `:402` message *"all eight flagged files"* conflates roster ROWS with flagged FILES. Now
**CONFIRMED** and still untouched — pre-existing, not this packet's.

## BATCH 3 — GOLDENS, THE R18 FAMILY, AND THE INSTRUMENTS

| step | result |
|---|---|
| `irreversibleRawRoster.contract` + `advanceWorkerByteIdentity` | `Test Files 2 passed (2)` · **`Tests 13 passed (13)`** · exit 0 |
| goldens + `roadsDormancyGolden` + `npcs.property` | `Test Files 1 failed \| 3 passed (4)` · **`Tests 1 failed \| 28 passed (29)`** · exit 1 — **the NAMED PRE-EXISTING red only** |
| `tests/generators/densityLaw.test.js` | `Test Files 1 passed (1)` · **`Tests 151 passed (151)`** · exit 0 |
| ⭐ `tests/lint` WHOLE (instrument) | `Test Files 1 failed \| 173 passed (174)` · **`Tests 1 failed \| 2790 passed (2791)`** · exit 1 — **lighting census ONLY** |
| lighting walker, run ONCE separately | `Test Files 1 failed (1)` · **`Tests 1 failed \| 33 passed (34)`** · exit 1 — by design |

⛔ **THE NAMED PRE-EXISTING RED, quoted** (the chair's CURE-J; **NOT** this lane's):
```
FAIL tests/property/dossierProseManifest.test.js > the composed-prose manifest — the DRIFT corpus,
     both audiences > ⭐ THE PROVENANCE REFUSES A FIXTURE ITS RECORDER DID NOT WRITE
AssertionError: a fixture whose recorder has moved since it was written is REFUSED: re-record with
`node scripts/prose-manifest-cells.mjs --record`
-   "scripts/prose-rate-corpus.mjs": "d97c391207c0ac8c9671c908c372ecb29577e366516ce04a5bfbaee203c24d7c",
+   "scripts/prose-rate-corpus.mjs": "0f0efb35cc4357cd01f0c7d4f7be48efdb6069546746d3575b6430b54dc62864",
```
⭐ The moved recorder is `scripts/prose-rate-corpus.mjs` — **not one of this packet's thirteen
paths.** Nothing was re-recorded; `UPDATE_GOLDEN` / `GOLDEN_SHIFT_SIGNED` never set. Both golden
fixtures byte-identical after the run: `7177cd6e…8f1e` / `921c51cf…db41`.
⭐ `generatorGoldenMaster`, `roadsDormancyGolden` (A5's corpus half) and `npcs.property` (the
widened seven-member arm) are all GREEN. **STOP 4 clear on everything this packet touches.**

ⓘ `tests/lint` whole ran **174** files; sealed check 10 excludes the lighting walker → **173**,
matching §P7's stated figure exactly. No prose-numerics red, no `pulseKernelLineAddress` red, no
`negativeAssertionAnchor` red, no `mutationCoverageManifest` red.

### ⭐ THE LIGHTING CENSUS — TUPLE AND DELTA

Register frozen at **`2656 · 383 · 2273 · 25074 · 6684`** (`measuredAtSha f4c395e2d`), untouched
and **NEVER REFROZEN** (`tests/lint/.lighting-census-baseline.json` sha
`30966fa497b81380042f655ab405fcc4493e1a5400f0fd1dfd471d46dfa9a067`, absent from `git status`).

| figure | register | measured | delta | evidence |
|---|---:|---:|---:|---|
| files | 2656 | 2656 | **+0** | CONFIRMED — assertion passed before the failing one |
| parked | 383 | 383 | **+0** | CONFIRMED — same |
| credited | 2273 | 2273 | **+0** | CONFIRMED — same |
| **titles** | 25074 | **25078** | ⭐ **+4** | CONFIRMED — `expected 25078 to be 25074` |
| suiteTitles | 6684 | — | **+0** | ⚠ assertion NOT REACHED (it follows `titles`); measured from the diff instead: **0 `describe(` lines added or removed, 0 new/untracked files** |

⇒ **`+0 files / +0 parked / +0 credited / +4 titles / +0 suiteTitles` — EXACTLY the packet's
predicted delta** (A1 warSeatBooks ×1, A2 roadsState ×1, A4/A7 roadsParticipation ×2; 4 added
`it(` lines, 0 added `describe(`). ⛔ Refreeze is the chair's terminal act, not this lane's.

---

## PATCH-AND-RESEAL — STEPS 1 AND 2 DONE

`$SP/lane-em-b1f-scratch/EM-B1f.packet.patch` — **24,692 bytes, 6 `diff --git` headers**.
`git apply --check` → **OK**. `git status --short` → **EMPTY**. HEAD `6a3e8089f`.
Foreign `stash@{0}: On analytics-intelligence-layer` preserved untouched.

**The six SHA-256s to prove after `git apply --index`** (`EM-B1f.six-shas.txt`):

```
9f692f6ce844110f5c0c8a66e34e99a1cd8b719a923a216a6695c55b1da78b7f  src/domain/roads/state.js
3535cbb431310740e760a33d26d78daf5ee05402351c9ecb477abced13d496e1  tests/lint/statusUnionTotality.walker.test.js
81a4ae8d4e58f7b9b10f9367621942a110127d6ffff9e9d7164c4448ca5482a1  tests/domain/roadsState.test.js
64665503ef9beeaef9d5e9e0f2e7018e98d3329bb4a0841669657142e62a52c5  tests/domain/warSeatBooks.test.js
31ecce8ae9458aaca09b7fb975eee64f6db52f6588a5f300cc32be43aa200609  tests/domain/roadsParticipation.test.js
e246ddff6bda27d770973a58c760e42bc6f81b45d36922cb091aec8a46531977  tests/property/npcs.property.test.js
```

## STILL OWED AT BATCH 4 (after re-seal at the CURE-J tip)

`check-observed-shape-readers` · `check-writer-reach` · `validate` · **`build:edge-shared` LAST**
(exactly SEVEN `_shared` paths, both `sourceHash` transitions recorded) · `check:packet` ·
`implementation:resume` · the commit by explicit pathspec, trailer
`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
⛔ The chair runs `npm run build` + `verify:dist` at the landing; this lane did not build the app
and did not run the `skipIf(!requireDistRead)` dist-read arm — a skipped byte arm is not a pass.
