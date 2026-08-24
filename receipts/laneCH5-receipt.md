# TE-CH-5 RECEIPT — SHAPE F (alchemy out of ARCANE_INST_TAGS)

STATUS: **IN PROGRESS** 2026-08-24
Slot base: `510c51b766a4ef329a697d61f3006e23d4fb2325` (58 cars, packets 177, census 2525/366/2159/21017/5847,
ratchet 11 of 29,044). ⚠ LANE-LAW.md header was STALE (named 79b78881c); chair corrected it.
My worktree was created directly at `510c51b76` and `git log -1` confirmed the subject line — NOT affected.
Worktree: `<scratchpad>/laneCH5-tree` — own `npm ci`, **468 pkgs**, `.husky/_` PRESENT (pre-commit WILL run).

## DONE
1. Worktree at slot, own node_modules (468). Disk 12.4 GB free.
2. Three read-only snapshots at THIS slot: `ch5b-base`, `ch5b-fi` (F-i), `ch5b-f` (F).
3. **TOTALITY CONTROL RE-EARNED AT THIS SLOT**: harness regenerates all **525** committed
   `tests/fixtures/generator-golden-master.json` hashes — missing 0, extra 0, **MISMATCHES 0**.
4. Source edits made in worktree:
   - `src/domain/arcaneInstitutionVocabulary.js` — `ARCANE_INST_TAGS = ['arcane','planar','enchanting']`,
     new `TRADE_INST_TAGS = ['alchemy']`, + a header stating which question each list answers.
   - `src/domain/npcProfile.js` — `POWER_DOMAIN_TAGS.arcane` now `[...ARCANE_INST_TAGS, ...TRADE_INST_TAGS]`
     (the hand-typed duplicate). Order-independent: consumer is `tags.includes(t)` at `institutionsForPower`.
   - `src/data/institutionalCatalog.js` — the three `none`-licensed rows drop `arcane`:
     Alchemist shop `['alchemy']`, Alchemist quarter `['alchemy']`, Warden's Lodge `['military']`.

## RESUME POINT
- RUNNING (bg): F-i/F 525-corpora + all three 5-case sweeps (2,555 each).
- NEXT: diff base vs fi vs f (hashes + rosters + path templates), compare to expected 187/525 & 409/2555.
- NEXT CMD: `cd <scratchpad>/ch5b-f && node magicsweep.mjs ...` (see tasks/b85tvitpz.output)

---
## MEASUREMENT COMPLETE (2026-08-24, re-derived at slot 510c51b76)

### Blast radius — MATCHES THE EXPECTED FIGURES EXACTLY
TOTALITY CONTROL at this slot: 525/525 committed golden hashes reproduced, **0 mismatches**.

| | golden 525 hashes / rosters | sweep 2,555 hashes / rosters |
|---|---|---|
| **F-i alone** | **0 / 0** | **0 / 0** (0 in all five magic cases) |
| **F (F-i + F-ii)** | **187 / 0** | **409 / 0** |

Sweep by case: `magicExists:false` **0** · pm0 **0** · pm20 **0** · pm50 **174** · pm80 **235**.
Path-template census at pm80 (511 rows, 235 moved, **key-ORDER moves 0**): 10 templates, all four
classes are the tag string leaving plus the one trace effect it drove —
`$.institutions[*].tags` (192/163), `$.defenseProfile.institutions.magicDef[*].tags` (150/150),
`$.simulationTrace[*].downstreamEffects{.target,.effect}` removed (264/235, the
`magicCapacity/reinforced` heuristic), `.target` changed `tag.arcane` -> `tag.military` (10/10).
No capacity, economy, magic-profile, roster or rng number moves anywhere.

### Catalog verdicts, base -> F
- `ARCANE_INST_TAGS` carriers 21 -> 18; magicForms ARCANE GATE population 20 -> 17.
- **All six `magicLicense: 'none'` names now FAIL the ARCANE GATE** (was: 3 passed).
- TAG-vs-LICENCE divergences **4 -> 1**; the survivor is `Healer (divine, 1st level)` = CH-6's car.

### ⛔ TWO DISAGREEMENTS WITH THE BRIEF — reported, not papered over
1. **MF-CH2B has NO manifest entry and NO INDEX row.** It is an ORPHAN packet file at DRAFT.
   `validate:packets` is green at 177 (0 READY) and never sees it. The "three-place flip" is
   therefore not available; see the judgment section.
2. **The magicForms STOP arm is ALREADY GREEN at the slot, before my car** — and green
   non-vacuously (24 dark rows, denominator satisfied; anchor 77 high-magic rows hold forms).
   Measured at THREE bases with the arm's own seeds: 79b78881c, 86794b5d2 and 510c51b76 all show
   `dark=24, darkWithForms=0, dark rows holding one of the three names = 0`.
   All four of CH2B's own declared reds pass at the clean slot: **4 files / 62 tests passed**.

### NEW FINDING the prep brief did not price
Shape F **does** move the forms ladder over a real corpus: high-magic settlements holding at
least one form go **77 -> 69 of 120**. Zero shipped bytes (magicForms is unwired), but it is a
real semantic delta and belongs in the record.

## RESUME POINT
- NEXT: targeted test bill (magicLicenceCensus walker, arcaneIdentity, arcaneClassifierCensus,
  golden master), then the declared re-record + SHIFT RECORD + GOLDEN_SHIFT_LEDGER, then full gate.

---
## BUILD COMPLETE — edits, re-record, mutants (2026-08-24)

### Files edited (7)
| file | what |
|---|---|
| `src/domain/arcaneInstitutionVocabulary.js` | `ARCANE_INST_TAGS = ['arcane','planar','enchanting']`; new `TRADE_INST_TAGS = ['alchemy']`; header states which question each list answers and the rule for a NEW member |
| `src/domain/npcProfile.js` | `POWER_DOMAIN_TAGS.arcane` = `[...ARCANE_INST_TAGS, ...TRADE_INST_TAGS]` — the hand-typed duplicate is now derived |
| `src/data/institutionalCatalog.js` | the three `none`-licensed rows drop `arcane` |
| `tests/lint/magicLicenceCensus.walker.test.js` | A5 divergence roster 4 -> 1; A8's three names -> MUNDANE **plus a new ANCHOR** (Enchanter's shop / Planar embassy still ARCANE) that tells "data changed" apart from "reader re-routed" |
| `tests/lint/arcaneClassifierCensus.walker.test.js` | address rot: `npcProfile.js:333 -> :334`, `:374 -> :375` (my one import line), same form as the recorded 57 -> 58 re-point |
| `tests/domain/institutionsForPower.test.js` | NEW PIN for the union (no new `it()`), with both rows deliberately outside the arcane NAME hint so only the TAG path can reach them |
| `tests/property/generatorGoldenMaster.test.js` + `tests/fixtures/generator-golden-master.json` | SHIFT RECORD row + the declared re-record |

### The re-record, cross-checked
`UPDATE_GOLDEN=1` in the lane worktree: rows 525 -> 525, **CHANGED 187, added 0, removed 0**,
**key order identical**. Cross-checked against an INDEPENDENTLY computed manifest (my own hashing
path, not vitest's): missing 0, **MISMATCHES 0**.

### Mutation battery — every pin proved live, each mutant verified APPLIED, all restored cmp-exact
| # | mutation | reds |
|---|---|---|
| CLEAN1 | — | 22 passed (22) |
| M1 | put `alchemy` back in `ARCANE_INST_TAGS` | A5 + A8 |
| M2 | put the `arcane` tag back on `Alchemist shop` | A5 + A8 |
| M3 | push `npcProfile.js` down one line | both arcaneClassifierCensus arms |
| M4 | drop the `TRADE_INST_TAGS` spread from `POWER_DOMAIN_TAGS.arcane` | the new union pin |
| CLEAN2 | — | 22 passed (22) |
The golden fixture's own pin was proved live by execution before the re-record: `every config
produces byte-identical output to the golden master` FAILED at Shape F and passes after.

## RESUME POINT
- NEXT: mutation-coverage-manifest check, eslint/typecheck, then full `npm run check:tail` BARE.

---
## COMMITTED + THE MINT BLOCKER (2026-08-24)

**Commit `ed96f0ebadc5976e83ad81b5fccb448d3782a11b`** on top of slot `510c51b76`.
8 files, +381 / -208. Pre-commit RAN (`.husky/_` present): lint-staged's `eslint --fix` executed
and re-staged. **RE-PROVED AT THE COMMITTED TIP** — the three logic-bearing src blobs at the tip
are byte-identical to the snapshots the 187/409 figures were measured from, so those figures
describe the committed bytes. Working tree clean; the one `git stash` entry present is
pre-existing and foreign (`On analytics-intelligence-layer`), untouched.

Pre-gate: `npm run lint` 0 errors (29 warnings, all pre-existing) · `typecheck:ratchet`
173/173 · `typecheck:domain:strict` 1134/1134 · `validate:packets` valid at 177 (0 READY).

### ⛔ THE MINT IS BLOCKED BY MF-CH3, PROVED WITH THE REAL VALIDATOR
`TERMINAL_PACKET_STATUSES = {LANDED, SUPERSEDED}` — a DRAFT packet reserves its change paths.
MF-CH3 is DRAFT and reserves three paths this car must change. `validatePacketManifest` run
against the live manifest with an MF-CH5 entry appended, verbatim:

```
BASELINE ok: true | errors: 0
WITH MF-CH5 AT DRAFT ok: false | errors: 4
    MF-CH5.packetPath does not exist: docs/implementation/packets/catalog-hygiene/MF-CH5.md
    duplicate change path across packets: src/data/institutionalCatalog.js (MF-CH3, MF-CH5)
    duplicate change path across packets: tests/fixtures/generator-golden-master.json (MF-CH3, MF-CH5)
    duplicate change path across packets: tests/property/generatorGoldenMaster.test.js (MF-CH3, MF-CH5)
WITH MF-CH5 AT LANDED ok: false | errors: 1
    MF-CH5.packetPath does not exist: ...
```

So a DRAFT mint reds `validate:packets` and therefore the whole gate; a LANDED mint validates but
would stamp a landing that has not happened. **Resolution: commit the packet FILE unregistered**,
which is exactly the state MF-CH2B is in at this base and is proved to red nothing. The mint is a
two-line act the chair can take at the CAS (at LANDED) or after MF-CH3 leaves DRAFT (at DRAFT);
the ready-to-paste entry is at `<scratchpad>/laneCH5-manifest-entry.json`.

## RESUME POINT
- RUNNING: full `npm run check:tail` BARE, log `${TMPDIR}/gate-tail.21932.log` (found by MY PID).
- NEXT: read the gate verdict; commit the packet file; walk the census delta; pin
  `refs/preserve/holding-ch5`.

---
## GATE 1 WAS RED — SEVEN REGRESSIONS, BOTH CLASSES PAID (2026-08-24)

`npm run check:tail` BARE at `ed96f0eba`: **`[gate-tail] exit: 1`, TRUE_EXIT=1**.
`[test-ratchet] TEST REGRESSIONS ... 7 failing test(s) NOT in the frozen census` (frozen 11).
⭐ The census walker `sovereigntyLightingContract` did NOT red, so the CENSUS DELTA IS
**0/0/0/0/0** — the tuple 2525/366/2159/21017/5847 is unmoved, proved by execution.
`magicLicenceCensus`, `arcaneClassifierCensus`, `institutionsForPower`, `generatorGoldenMaster`,
`arcaneIdentity`, `facetInferenceHonesty` and `magicForms` were all green in that run.

| class | tests | cause | cure |
|---|---|---|---|
| edge-bundle staleness | 3 freshness + 3 reproducibility | `institutionalCatalog.js` is an input to `aiCharter`, `aiGrounding` and `aiOutputSchema` | `npm run build:edge-shared` AT THE COMMITTED TREE, then commit **all five sidecars as a set** (CH-3 proved splitting them reds) |
| un-anchored negative | `negativeAssertionAnchor.walker` | the union pin's `not.toContain` took the file to 3 sites against a frozen ceiling of 2 | `// anchored:` — ⚠ it must be on the assertion line or the ONE line directly above; my first attempt put it at the head of a TWO-line comment and the walker still counted the site |

Commit **`18dc99d1c`** pays both. Re-run of the seven: **6 files / 103 tests passed, TRUE_EXIT=0**.
Commit **`7f40d4454`** adds the packet file alone.

### The mint, re-measured with the packet file present
At **DRAFT**: **nine** `duplicate change path across packets` errors, every one against MF-CH3
(the six `supabase/functions/_shared/ai*Bundle*` rows join the original three).
At **LANDED**: **zero** collisions — only the two ordinary flip-mechanics errors.
Ready-to-paste entry + INDEX row: `<scratchpad>/laneCH5-manifest-entry.json`.

## RESUME POINT
- RUNNING: final `npm run check:tail` BARE at `7f40d4454` -> `laneCH5-GATE2.log`.
- NEXT: read the verdict; pin `refs/preserve/holding-ch5`; report.

---
# ✅ LANE COMPLETE — GATE GREEN, PINNED

**Pin: `refs/preserve/holding-ch5` = `7f40d4454d0ec2fa79c3ca63a4521714849cad25`** (3 commits on
slot `510c51b76`): `ed96f0eba` (the car) · `18dc99d1c` (the two gate bills) · `7f40d4454` (the packet).

## The full gate, verbatim — `npm run check:tail` BARE, fresh shell, at the committed tip
```
[hazard-registry] OK — 29 class(es): MACHINERY 12, PARTIAL 11, DOCUMENT 6, ACCEPTED 0. DOCUMENT 6/6, OWED 17/18 (shrink-only), MACHINERY 12/9 (grow-only), floor 27.
[implementation-packets] valid: 177 packets (0 READY)
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).
✖ 29 problems (0 errors, 29 warnings)
[test-ratchet] OK — no test regressions (11 known failure(s) of 29044 tests, ceiling 11).
[test-ratchet] STRICT DIST OK — 53 discovered/reported file(s), 458 test(s), zero failed/non-run/uncollected/missing/extra/duplicate rows.
[gate-tail] exit: 0 (the gate's own status, not a pipe's)
TRUE_EXIT=0
```
GREEN on all three conditions: TRUE_EXIT=0, `[gate-tail] exit: 0`, free disk 17.9 GB.
Log found by MY OWN PID (`gate-tail.66599.log`), never by mtime.

**CENSUS DELTA: `0 / 0 / 0 / 0 / 0`.** `sovereigntyLightingContract.walker` hard-asserts
`files: 2525, parked: 366, credited: 2159, titles: 21017, suiteTitles: 5847` and is green at the
tip — no new test file, no new `it()`, only title TEXT and added `expect`s.

## EXTRA PROOF the gate does not run — the chunk-cycle guard
`npm run smoke:boot` (the `@guarded-by` the vocabulary leaf names in its own docstring, and NOT
part of `npm run check`): `stage 1: 6565 static chunk edges` · `stage 2: 524/524 chunks
initialised` · **`boot-smoke: PASS — the built bundle boots.`** The new
`npcProfile.js -> arcaneInstitutionVocabulary.js` edge introduces no chunk-level cycle, which is
exactly the class that leaf was carved out to prevent (lane BT, 2026-08-03).

## FOR CH-7, reported not fixed (chair's instruction)
The two bare `den` sites in `npcProfile.js` are **byte-identical and untouched**; my one import
line moved them `332 -> 333` and `373 -> 374`. Both read
`criminal:   /tavern|den|gang|black\s+market/i,`. The whole diff to that file is the import plus
the `POWER_DOMAIN_TAGS.arcane` row. ⚠ The SAME two tables also carry a **seventh** arcane
spelling — `/mage|wizard|college|alchemist|library|laboratory|tower|sanctum/i`, two byte-identical
copies, both already recorded UNCONVERTED in `arcaneClassifierCensus`. This car re-pointed their
recorded addresses and changed nothing else about them.
