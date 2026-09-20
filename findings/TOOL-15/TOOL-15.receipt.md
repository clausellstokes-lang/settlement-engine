# TOOL-15 — RECEIPT (draft; the gated slots are marked PENDING THE GATE)

**Outcome.** The unpoliced figure-in-a-symbol shape is measured across the whole estate, the one row
that actually traps is re-spelled figure-free, and a walker under `tests/lint` now refuses the shape
in every governed symbol row with a measured threshold, a measured direction rule, an in-suite
counterforce and a frozen roster of the numeric manifest keys.

**Worktree** `$SP/lane-tool-15`, branch `tool-15-figure-in-symbol-2026-09-20`, base `c127cdfb2`.
**Commit 1 (landed, ungated):** `1c33181d6`. **Commit 2:** PENDING THE GATE.
Full measurement, written before the first edit: `$SP/lane-tool-15-scratch/TOOL-15.evidence.md`.

## 1. The population table — every figure-in-a-symbol row in the estate

194 packets (LANDED 191, SUPERSEDED 2, READY 1). **2,544 `requiredSymbols` + 51 `retiredSymbols`
= 2,595 symbol rows.** Four carry a name-bound numeric value, and the four are exactly the class.

| # | packet | status | kind | path | symbol | figure | register mirrored | lawful to move? | disposition |
|---|---|---|---|---|---|---|---|---|---|
| 1 | EM-B1k2 | LANDED | requiredSymbols | `scripts/mutation-coverage-manifest.json` | `"uncoveredBaseline": 186` | 186 | that file, key `.uncoveredBaseline` | **YES**, shrink-only | ⭐ **RE-SPELLED** → `"uncoveredBaseline"` |
| 2 | DOM-3 | LANDED | retiredSymbols | `supabase/functions/create-checkout/index.ts` | `const FOUNDER_SEAT_LIMIT = 30;` | 30 | none, a source constant | n/a (removed) | **KEPT** (direction rule) |
| 3 | GVF-1 | LANDED | retiredSymbols | `tests/lint/rawColorLiteral.test.js` | `const BUDGET = 1405;` | 1405 | in-file shrink-only ratchet, **live at 1303** | YES | **KEPT** — re-spelling REDS it |
| 4 | GV-4 | LANDED | retiredSymbols | `tests/lint/sovereigntyLightingContract.walker.test.js` | `titles: 20276, suiteTitles: 5688,` | 20276 / 5688 | `tests/lint/.lighting-census-baseline.json` | YES | **KEPT** — re-spelling REDS it |

Two earlier instances were cured by the chair before dispatch (`fff247009`, `6a3e8089f`).
**Six instances total: three cured, three admitted by measurement.**

## 2. The re-spelling, with its `grep -cF` proof — CONFIRMED

`"uncoveredBaseline": 186` → `"uncoveredBaseline"` in EM-B1k2's `requiredSymbols`.

```
occurrences of "\"uncoveredBaseline\"" in scripts/mutation-coverage-manifest.json = 1
grep -cF '"uncoveredBaseline"'  scripts/mutation-coverage-manifest.json -> 1
```

Re-measured AFTER the register gained its new row, so the insert did not create a second match.
The figure-free spelling was already the estate's idiom: `"symbol": "\"uncoveredBaseline\""`
occurred 6 times in the manifest before this change and 7 after.

**Why the row was a trap, executed both directions** against the validator's own
`source.includes(row.symbol)` arm, with the register burned 186 → 185 in memory:

```
source.includes("\"uncoveredBaseline\": 186")  before burn = true   after burn = false
source.includes("\"uncoveredBaseline\"")       before burn = true   after burn = true
```

and end to end:

```
after a lawful burn of the baseline, validate ok = false
    EM-B1k2.requiredSymbols[20].symbol is missing from
    scripts/mutation-coverage-manifest.json: "uncoveredBaseline": 185
```

## 3. ⭐ THE FINDING — the law is DIRECTION-DEPENDENT

`requiredSymbols` asserts PRESENCE at every status; a NON-TERMINAL `retiredSymbols` row asserts
presence too (the rule that deadlocked EM-B1f); a TERMINAL `retiredSymbols` row asserts ABSENCE.
A figure NARROWS the claim in every case, and narrowing has opposite consequences. Measured:

```
tests/lint/rawColorLiteral.test.js
    `const BUDGET = 1405;`               survives=false -> LANDED retirement green
    `const BUDGET`                       survives=true  -> LANDED retirement RED
tests/lint/sovereigntyLightingContract.walker.test.js
    `titles: 20276, suiteTitles: 5688,`  survives=false -> green
    `titles:`                            survives=true  -> RED
    `suiteTitles:`                       survives=true  -> RED
supabase/functions/create-checkout/index.ts
    `const FOUNDER_SEAT_LIMIT = 30;`     survives=false -> green
    `const FOUNDER_SEAT_LIMIT`           survives=false -> green
```

`tests/lint/rawColorLiteral.test.js` carries `const BUDGET = 1303;` today: the figure genuinely
burned 1405 → 1313 → 1303, and what GVF-1 retired was the VALUE. DOM-3 alone could be re-spelled
without reddening today and is still kept, because broadening a landed absence claim from "this
value was removed" to "this declaration may never exist" adds trap surface the law exists to remove.
**To reverse:** strip the figures from rows 2–4 and expect GVF-1 and GV-4 to red at once.

## 4. The threshold census — CONFIRMED, every wider spelling refused

| candidate arm | convictions | of which the class | verdict |
|---|---:|---:|---|
| **name-bound value, \|v\| ≥ 2** | **4** | **4** | ⭐ CHOSEN |
| name-bound value, \|v\| ≥ 1 | 10 | 4 | refused (convicts 6 `yearBase: 1` rows) |
| name-bound value, \|v\| ≥ 0 | 12 | 4 | refused (adds 2 `yearBase: 0` rows) |
| bare standalone integer ≥ 2 | 27 | 4 | refused |
| bare standalone integer ≥ 100 | 8 | 4 | refused |
| a bare integer a REGISTER also holds | 25 | 1 | refused |
| numeric comparison, unbound | 1 | 0 | refused (its one hit is a false positive) |

Ladder for the bare-integer arm: `≥0: 41 · ≥1: 38 · ≥2: 27 · ≥3: 23 · ≥4: 23 · ≥5: 21 · ≥8: 15 ·
≥10: 15 · ≥20: 14 · ≥50: 11 · ≥100: 8`. What it convicts that is NOT the class:
`## §2 · TRAIN LANDINGS`, `OWNER_DECISION_QUEUE §118`, `THE §74 CAP`, `interval '90 days'`,
`Phase 14`, `at tick 7`, `Object.freeze([4, 5])`, `SQL 123 allowlist`, `the ODQ 310.3(7) source scan`,
`prose-leak-allowance: week 4`, `+ 17 (WC) + 6 (EP) = **108**`, `CONTROL: arms 2, 3 and 4 are not
redundant` — honest anchors, every one.

The brief's third limb (a bare number a register also holds) is **refuted by execution**: the 40
baseline registers hold **2,777 distinct numeric values**, including every small integer, because
`scripts/.domain-strict-baseline.json` stores a per-file count. It convicts `at tick 7` and `## §2`.

Bare `<` and `>` are deliberately not binding operators: `WEB-7 :: public/third-party-notices.html ::
"<h3>3.3 The two production-dependency elections</h3>"` is a live row and `h3>3` satisfies a
name-bound `>` perfectly. The 0/1 admission has a live subject: 8 EP-3B rows quote `yearBase: 0/1`.

## 5. The numeric manifest rows — measured, NOT gate-reachable, none rewritten

28 distinct numeric keys inside packet entries, all owned by EM-P2 [LANDED] except `packetVersion`
(EM-P2, EM-B1f). Executed proof that none is gate-reachable — four mutated to nonsense in a
throwaway (`titles: 999999`, `rowsAtTip: -7`, `ceiling: 1`, `effectiveLines: 0`):

```
mutated-numeric-rows validate ok = true  errors = 0
live                 validate ok = true  errors = 0
```

`validatePacketManifest` reads only `schemaVersion`, `indexPath` and, per packet, `id`/`status`/
`packetPath`/`verifiedBase`/`changeManifest`/`requiredSymbols`/`retiredSymbols`/`acceptanceCases`/
`checks`. A stale numeric manifest row cannot red a sibling's window; the gate hazard lives entirely
in `symbol`. Every EM-P2 numeric row is either the packet's own declared delta (`rowsAdded`) or a
measurement already pinned by a sha (`measuredAtSha`, `liveAtAd7ddf2c9`, `baselinePath` named beside
it) — the cure the brief prescribes, already applied by EM-P2 v4's own R11 discipline, which its own
`law` field records. Rewriting a landed packet's sha-stamped measurement would destroy evidence
rather than staleness. **The walker freezes the admitted key set instead**, each key with a written
reason, so a new numeric row is a deliberate act.

## 6. The walker

`tests/lint/packetSymbolFigureCensus.walker.test.js` (new, 447 lines, 1 `describe` + 6 `it`).
Scope: a `requiredSymbols` row at any status, and a `retiredSymbols` row on a NON-TERMINAL packet.
Terminal retirees are admitted BY SHAPE, and the admission is re-derived from disk per member on
every run rather than held in an allowlist of names.

**RED-FIRST — CONFIRMED.** Driven against the UNCURED tip `c127cdfb2`, exactly one arm reds:

```
✗ TE-26: no governed symbol row in the live estate quotes a figure
  EM-B1k2 [LANDED] requiredSymbols[20] scripts/mutation-coverage-manifest.json :: "uncoveredBaseline": 186
ARMS=6 FAILURES=1
```

Against this branch: `ARMS=6 FAILURES=0`.

**THE COUNTERFORCE (arm 4), in-suite and executed on every run:** the EM-B1k2 shape planted in a
LANDED `requiredSymbols` row and the EM-B1f shape in a NON-TERMINAL `retiredSymbols` row are each
convicted and each names its packet and its row; the SAME row on a terminal retiree is admitted; the
prescribed figure-free re-spelling passes; and the manifest's SHA-256 on disk is re-read after every
plant, so the restore is executed rather than promised. The arm measures a conviction **delta**, not
a total, so a real estate conviction cannot red the detector's own proof.

**THE MUTANT BATTERY — seven mutants, each restored, the walker's bytes re-hashed identical
(`d7288571…`), the repo file never moved:**

| mutant | arms reddened |
|---|---|
| `FIGURE_FLOOR` 2 → 1 | 3 |
| the direction rule deleted (everything governed) | 2 |
| the direction rule inverted (nothing governed) | 2 |
| a bare `>` admitted as a binding operator | 2 |
| `packetVersion` struck from the admitted numeric keys | 1 |
| the conviction predicate gutted | 1 |
| the detector gutted | 4 |

⚠ **Honest scope of that battery:** it was driven under a SUBSTITUTED HARNESS — `node` with a
six-matcher vitest shim, the walker otherwise byte-identical — so it could run without holding the
shared gate. The walker's real predicates ran; vitest's harness did not. The gated batch runs the
file under vitest for real.

## 7. Where the walker lives, and the two homes refused — JUDGMENT

`git grep -l 'PACKET_MANIFEST' -- tests/lint` returns only the frozen lighting walker, whose single
hit is a **comment**. There is no manifest walker under `tests/lint`.

`JUDGMENT: chose a new file under tests/lint over an arm in tests/scripts/implementationPackets.test.js
because tests/scripts is not an ENFORCER_DIR and that basename matches no NAME_PATTERN token, so the
arm would have been invisible to enumerateInvariants — a guard nobody guards, which is the exact
defect that module's own header records. Say "veto" to flip it.`

The validator (`scripts/implementation-packets.mjs`, where the HK-3 and HK-5 siblings live) was
refused outright and is the stronger prevention: `validate:packets` is **check index 11 of EM-B1f's
live seal** and runs in `npm run check` and the pre-commit hook, so changing its refusal set mid-train
changes a sealed packet's check behaviour. **Proposal for the chair, not built:** once EM-B1f lands,
the same predicate belongs in the validator beside HK-3 and HK-5, where it would fail the gate and
the hook rather than one test file. The measured population is already zero, so it would land green.

## 8. Gated receipts — PENDING THE GATE

Batch written out in `$SP/lane-tool-15-scratch/TOOL-15.lane-resume.md`.

- [ ] `npx eslint tests/lint/packetSymbolFigureCensus.walker.test.js` (BARE)
- [ ] `tests/lint` WHOLE — count line; only permitted red is the lighting census
- [ ] `tests/scripts/implementationPackets.test.js` — count line
- [ ] `tests/copy/voiceMechanics.test.js` — count line
- [ ] the lighting tuple as EVALUATED (short-circuits on `files`), with the delta below

**Predicted lighting delta** against the frozen `2656 · 383 · 2273 · 25074 · 6684`:
`files +1 (2657) · parked +0 (383) · credited +1 (2274) · titles +6 (25080) · suiteTitles +1 (6685)`.
⚠ The walker asserts `files` FIRST and short-circuits, so only `files` will be EXECUTED; the other
four are DERIVED from the crediting proof (`from 'vitest';` = 1, `^describe(` = 1, `^  it(` = 6, no
other `it(`/`test(`). ⛔ Never refrozen.

## 9. Ungated receipts — CONFIRMED

```
node scripts/implementation-packets.mjs validate
  before commit 1 : [implementation-packets] valid: 194 packets (1 READY)  EXIT=0
  after  commit 1 : [implementation-packets] valid: 194 packets (1 READY)  EXIT=0
  after  the register insert : same, EXIT=0

goldens, before the first edit and now:
  7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
  921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json

mutation-coverage register, driven in plain node:
  enumerated: 713 (floor 686)
  TOTALITY missing: []      stale entries: []      thin rationales: []
  SHRINK-ONLY uncovered: 186  baseline: 186  EQUAL
  invariants 712 -> 713 · rationale 434 -> 435 · mutation 92 (unchanged) · uncovered 186 (unchanged)
  diff: 6 insertions, 0 deletions — a surgical text insert, never a re-serialisation
```

## 10. Registers this change will move when composed (DELTAS)

- `tests/lint/.lighting-census-baseline.json` — `files +1 · parked +0 · credited +1 · titles +6 ·
  suiteTitles +1`. **The chair's terminal refreeze, never this lane's.**
- `scripts/mutation-coverage-manifest.json` — `invariants +1` (713), `rationale +1` (435).
  **`uncoveredBaseline` moves by ZERO** and its line is not in the diff.
- No other register moves. No `src/` byte was touched. No golden moves.

## 11. ⛔ Noticed and NOT touched — each specific enough to slot

1. **`INFRA-M1-DOCS :: docs/DESIGN_FP_ARCHITECTURE.md :: "+ 17 (WC) + 6 (EP) = **108**"`** — a design
   doc's arithmetic total, lawfully movable when a volume is added, but NOT name-bound (`**` sits
   between the `=` and the digits) and mirrored by no register. It escapes the arm deliberately.
   Either re-spell it to a stable prose anchor, or widen the arm to markdown-bolded values and
   re-measure. Not done: widening on one specimen is how a threshold stops convicting only the class.
2. **`WEB-2 :: tests/security/retentionNumbers.pglite.test.js :: "A3 — the raw window shortens to
   90 days, and 89-day rows survive (both sides)"`** — a TEST TITLE carrying a retention policy
   figure. If the window ever moves off 90 days, the title moves and WEB-2's window reds. Not
   convicted (the figure is not name-bound) and not touched; the sibling row pins the same figure in
   `supabase/migrations/198_retention_numbers.sql`, which is immutable once landed.
3. **`GV-4`'s retiree pins the lighting census's `titles:`/`suiteTitles:` spelling.** If the lighting
   walker ever renames those keys, GV-4's LANDED retirement becomes unfalsifiable rather than red.
   Worth one sentence in that walker's header; not this lane's file to edit.
4. **The three admitted terminal retirees have no standing guard against the mirror trap** — that a
   LANDED retirement, broadened later by a well-meaning re-spelling, reds a packet it never touched.
   Arm 5 measures the evidence every run but refuses nothing. A refusal would need a rule about
   EDITS rather than about state, which this walker cannot see.
5. **`tests/scripts/implementationPackets.test.js` is invisible to the mutation-coverage
   guard-of-guards** (not an ENFORCER_DIR, basename matches no NAME_PATTERN token), although it holds
   the HK-3, HK-5 and §731.3 live-estate census arms. Either rename it into NAME_PATTERN range
   (`implementationPackets.contract.test.js`) or add `tests/scripts` to ENFORCER_DIRS. Both move the
   register, so both are the chair's.
6. **Collision to compose:** `scripts/mutation-coverage-manifest.json` is reserved in the notes of
   EM-B3c and EM-B1d. EM-B1f (the only READY packet) does NOT name it in its `changeManifest`, so the
   live seal is untouched; the collision is a composition ordering matter, not a validator one.
