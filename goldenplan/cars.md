# cars.md — the seven TE-GOLDEN-1 cars, with supersession verdicts

Ref: `refs/preserve/golden-build-2026-09-02` = `ba08939d7`
Merge base with `claude/composite-r4`: **`8b07ce45f179b583c6a152412a23777cb1a15a38`**
Divergence: golden is **7 commits ahead**, **197 commits behind**. (CONFIRMED — `git rev-list --count`.)

Consist surface: **50 files**, `2588 insertions(+), 88 deletions(-)`.
⭐ **ZERO `src/` files. ZERO `package.json`.** Entirely `tests/` + one `scripts/` + one `docs/` dir.
(CONFIRMED — `git diff --name-only … | grep -E '^(src/|package)'` returned nothing.)

---

## Build order (parent chain, oldest first)

The commits are NOT in car-number order. The chain is 1 → 3 → 6 → 4 → 7 → 5 → 2, and that
order is **load-bearing** (see landing-plan.md §Order).

| # | sha | car | what it does | files |
|---|-----|-----|--------------|-------|
| 1 | `635dc0f70` | car 1 | The freeze register, UNFROZEN — the roster inventory, no record cut. 48 surfaces, `frozenAt`/`frozenAtSha`/`genesis` all `null` by design. | A `tests/fixtures/.golden-freeze-register.json` (+798) |
| 2 | `98627d11f` | car 3 | The signed door — one writer, five refusals, the porcelain dirty-check written FRESH (not ported; ODQ §874.7's first-line mis-slice). | A `tests/helpers/goldenRecordDoor.js` (+331) |
| 3 | `fdb2ea62f` | car 6 | The door migration — 43 capture arms move from their own `writeFileSync` to `recordGolden`. | M 43 files (+129 −86) |
| 4 | `cc625eb24` | car 4 | The dormancy oracle gains its bit arm — `rawBitFormOf` / `stableBitFormOf`, §713.2 made an instrument. | M `tests/helpers/dormancyOracle.js` (+62 −2) |
| 5 | `4a0ba7933` | car 7 | `docs/shift-records/` — the home the door reads its authorizations from. | A `README.md`, `_TEMPLATE.json` (+135) |
| 6 | `3e8238282` | car 5 | `scripts/dormancy-bit-compare.mjs` — the lane ritual, committed. | A (+240) |
| 7 | `ba08939d7` | car 2 | The roster-complete walker — 84 arms, 12 describes, 5 plants proven able to red. **TIP.** | A `tests/lint/goldenFreeze.walker.test.js` (+893) |

Car 6's 43 files: `tests/domain/routeNetworkDormancy.test.js`,
`tests/domain/townCartographyCalibration.test.js`, and 41 `tests/property/*Golden*.test.js`.

---

## Supersession verdicts — **7 of 7 STILL NEEDED, 0 SUPERSEDED**

### Method
Two independent probes, each with a **positive control** so a null result cannot be a broken probe.

**Probe A — path existence.** `git cat-file -e claude/composite-r4:<path>` for all six added paths.

```
ABSENT   tests/fixtures/.golden-freeze-register.json
ABSENT   tests/lint/goldenFreeze.walker.test.js
ABSENT   tests/helpers/goldenRecordDoor.js
ABSENT   scripts/dormancy-bit-compare.mjs
ABSENT   docs/shift-records/README.md
ABSENT   docs/shift-records/_TEMPLATE.json
```

**Probe B — symbol census, both tips (the control).**

```
product tip: 'recordGolden'          -> 0 file(s)      golden tip: 45 file(s)
product tip: 'goldenRecordDoor'      -> 0 file(s)      golden tip: 48 file(s)
product tip: 'dormancy-bit-compare'  -> 0 file(s)      golden tip:  1 file(s)
product tip: 'shift-records'         -> 2 file(s)      golden tip:  4 file(s)
product tip: 'golden-freeze-register'-> 1 file(s)      golden tip:  4 file(s)
```

The golden-tip column proves the probe can see. The product-tip zeros are therefore real.

**Probe C — same-road-by-another-name.** `git ls-tree -r --name-only claude/composite-r4`
filtered for `goldenfreeze|golden-freeze|recorddoor|record-door|shift-record|freeze-register|dormancy-bit`
returned **nothing**. No equivalent arrived under a different name.

### Per-car

| car | verdict | evidence |
|-----|---------|----------|
| 1 register | **STILL NEEDED** | path ABSENT; no equivalent register in tree |
| 3 door | **STILL NEEDED** | path ABSENT; `recordGolden` 0 hits on product vs 45 on golden |
| 6 migration | **STILL NEEDED** | `recordGolden` 0 hits on product ⇒ all 43 arms still write their own fixtures |
| 4 oracle bit arm | **STILL NEEDED** | `tests/helpers/dormancyOracle.js` product blob `116e410b7…` is **byte-identical to the merge base**; `rawBitFormOf`/`stableBitFormOf` 0 hits |
| 7 shift-records | **STILL NEEDED** | both paths ABSENT — and the product *already references the directory* (see below) |
| 5 bit-compare script | **STILL NEEDED** | path ABSENT; 0 hits |
| 2 walker | **STILL NEEDED** | path ABSENT; 0 hits |

### ⭐ The product is already WAITING for two of these cars

`claude/composite-r4` carries **dangling forward references** to artifacts only this consist supplies:

```
docs/tuning-signatures/README.md:6:        It is not `docs/shift-records/`. That directory belongs to the GOLDEN freeze door…
tests/lint/tuningRegister.walker.test.js:909:  …'docs/shift-records/'
tests/lint/tuningRegister.walker.test.js:1067: // `docs/shift-records/` home all live in the GOLDEN lane and land with it…
tests/lint/tuningRegister.walker.test.js:1072: const recordsDir = join(ROOT, 'docs/shift-records');
tests/lint/tuningRegister.walker.test.js:1084: if (signature.goldenShiftRecord !== `docs/shift-records/${entry}`) {
tests/lint/tuningRegister.walker.test.js:931:  const registerPath = join(ROOT, 'tests/fixtures/.golden-freeze-register.json');
```

This is the **opposite** of supersession: the intervening 197 commits built *against* this consist
rather than around it. Landing is convergent, not additive.

⭐ **AND THOSE ARMS ARE LAND-SAFE — verified by READING the source, not by running it.**
`tests/lint/tuningRegister.walker.test.js` was deliberately written to absorb this landing with
no edit. All three touching arms were traced:

- **line 1065**, `no golden shift record claims a tuning version the register never signed`:
  guarded by `if (existsSync(recordsDir))`, and inside it
  `if (!entry.endsWith('.json') || entry.startsWith('_')) continue;`.
  Car 7 ships exactly `README.md` (not `.json`) and `_TEMPLATE.json` (leading `_`).
  **Both are skipped ⇒ zero records iterate ⇒ `problems` stays `[]` ⇒ GREEN.**
- **line 930**, `no signature may name a golden shift record while the golden register is unfrozen`:
  `existsSync(registerPath) ? JSON.parse(…).frozenAt : null`, asserted `toBeFalsy()`.
  Car 1's register lands with `frozenAt: null`. **`null` is falsy ⇒ GREEN.**
  Its own message anticipates this exactly: *"or, at this tip, not yet in the tree at all — the
  door lands with its own lane. Either way the fail-closed answer is the same and this arm starts
  reading real records the day it arrives, with no edit here."*
- **line 904**, `the signing record home exists…`: reads `docs/tuning-signatures/README.md` and
  asserts it *contains the string* `'docs/shift-records/'`. It asserts about a **different**
  README's prose. Unaffected by the landing.

**Verdict: CONFIRMED land-safe.** No edit to `tuningRegister.walker.test.js` is owed by this
landing. This is a read-of-source claim, not an executed one — but the branch conditions are
literal and the shipped filenames are known, so the derivation is complete rather than probable.
