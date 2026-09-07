# PARTIAL — lane DEADREAD, 2 of 3 sites cured, 1 REFUSED AND REFERRED TO THE CHAIR

**The gate is still RED (`check-observed-shape-readers` exit 1), deliberately.** One of the
three sites is not a defect, and the only two dispositions available for it are above my
line. I did not cure it, and I did not hand-edit or `--write` the baseline.

- Dock `$SC/laneINTEG-tree`, HEAD **`940d161ca`**, **23 cars** over product `90702c3e9`
  (21 inherited + 2 mine), porcelain **0**, `node_modules` **435 symlinks** (never touched).
- Commits: `fbb62b04e` (site 3), `940d161ca` (site 1). No rebase, no push, no ref writes.

## ⭐⭐ THE HEADLINE: THE BRIEF'S PREMISE IS WRONG ON TWO OF THE THREE SITES

The brief states *"These are not register debt. They are dead arms."* **Measurement refutes
that for two of the three.** Only one arm was actually dead. The instrument is not reporting
"nobody writes this key" — it reports "the GENERATION CORPUS never observed it", and the
corpus is four seeds × four configs. Two of these three rows are corpus **coverage gaps**,
not dead arms, and one of those two the instrument itself already classifies as an
explained-writer row.

| site | brief's claim | MEASURED | disposition |
|---|---|---|---|
| `generalStateProse.js:538` `need` on `foodBalance` | dead arm | **DEAD — 0/540 worlds** | ✅ deleted |
| `defenseStateProse.js:1011` `magicExists` on `config` | dead arm | **LIVE — the lens correctly silences a real dead-magic world** | ✅ re-pointed, behaviour-identical |
| `economyStateProse.js:328` `isCriminal` on `incomeSources` | dead arm | **LIVE — fires on 324/540 worlds** | ⛔ REFUSED — chair's act |

---

## SITE 3 — `need` on `foodBalance` — DELETED (the one genuine dead arm)

`foodDeficitDimension` read `num(dailyNeed) || num(need)`, mirroring the producer's own
`generateSettlementReason` line `foodBalance?.dailyNeed ?? foodBalance?.need ?? 0`.

**The `need` half is dead on both sides.** The single writer of this record —
`deriveFoodBalanceAnalysis`, `src/generators/economy/foodBalance.js:457` — returns a CLOSED
object literal (`dailyNeed, dailyProduction, deficit, deficitPercent, surplus,
agricultureModifier, stressModifier, importCoverage, rawDeficit, importChannel,
magicFoodOffset`). There is no `need` key and no writer of one. `pdf/lib/viewModelPrimitives.js:59`
says so in the estate's own words: *"The engine emits dailyProduction/dailyNeed; the old
.production/.need reads…"*.

**EXECUTED RECEIPT.** 540 settlements through `generateSettlementPipeline`, across the whole
settType × route × terrain × seed spread:

```
{"worlds": 540, "fbSeen": 540, "fbDailyNeed": 540, "fbNeed": 0}
```

The arm could not fail: with `dailyNeed` always present the `||` never reached `need`, and on
a record carrying neither, both sides answer 0. **Behaviour is identical on every record this
engine can build.** The doc comment the brief flagged (*"NO foodBalance ⇒ `no deficit` is NOT
the answer — `null` is"*) is about the `null` guard and is untouched and still correct; the
`@param` typedef that declared `need?: unknown` was a typedef, not evidence, and is gone.

The producer's own `?? need` and the two `pdf/` legacy reads are **frozen rows** and stay as
they are — changing a producer is out of this lane's scope, and is recorded below.

## SITE 1 — `magicExists` on `config` — RE-POINTED (live read, behaviour-identical)

**This was not a dead arm.** The corpus never observes `magicExists` on `config` because
**none of its four `CONFIGS` sets it** (`scripts/lib/observed-shape-corpus.mjs:67-72`) — not
because nothing writes it. Driven through the real pipeline, a config carrying
`magicExists:false` arrives on `settlement.config` intact and the lens goes correctly silent:

```
--- dead-magic (as the writers spell it)   config.magicExists = false  hasOwn: true
    ledger = {"present":true,"magicExists":false}   CURRENT arcane rung = null
--- dead-magic, flag ONLY (no dial)        config.priorityMagic = 0  magicLevel = "none"
    ledger = {"present":true,"magicExists":false}   CURRENT arcane rung = null
--- live magic                             CURRENT arcane rung = "arcane defense PRESENT"
--- no magic axis at all                   CURRENT arcane rung = "arcane defense PRESENT"
```

Deleting it would have deleted a working feature — a dead-magic world would start printing
"arcane defense ABSENT", which is precisely the machine improvising a lack out of a setting
that the docblock warns against.

**The cure is the estate's own precedent, not my invention.** `faithField.magicGate01`
carries a docblock written for this exact ratchet on this exact key:

> *"An earlier cut of this function re-read `config.magicExists` … which
> `check-observed-shape-readers` refused as NEW rows against a new file's ceiling of 0.
> Calling the ledger whole keeps those reads in `magicLedger.js`, where the estate's frozen
> rows for them already live, and leaves exactly one module in the tree that knows how a
> magic dial is spelled."*

So `defenseForcesProse` now asks `magicWorksAt({ settlement })`. This is **not** evading the
instrument: it removes a raw reader of the axis rather than hiding one, and 13 files already
hold frozen rows for this identity — including `src/generators/defenseGenerator.js` (2 reads),
the very producer whose readiness call this desk mirrors.

`magicWorksAt` additionally supplies the guard the raw read never had (`present === true &&`),
so a record that has said **nothing** about magic can no longer be mistaken for one that has
said magic is dead. *Dormant is a true statement, not a fallback.* All four real worlds above
agree before and after; the pipeline itself fills `priorityMagic:0` / `magicLevel:'none'`
(`steps/resolveConfig.js:79`), so `ledger.present` is true on every generated world.

`arcaneDefensePoolKey`'s second parameter is renamed `magicExists` → `magicWorks` because that
is now what arrives. Positional signature unchanged ⇒ the desk suite is untouched.

### ⛔ A HAZARD I HIT AND CURED, WORTH RECORDING

Passing the **bare** settlement is correct at runtime but **re-grounds `magicWorksAt`'s own
`item?.settlement` read onto the settlement record**, minting a NEW ceiling-0 row in
`src/domain/worldPulse/magicWorksAt.js` — a file this desk does not own and did not change.
Measured both directions on this branch:

| call shape | instrument |
|---|---|
| `magicWorksAt(settlement)` | `magicWorksAt.js:50 settlement on settlement` **NEW** |
| `magicWorksAt({ settlement })` | clean |

The shape-family, DOM-global, language-surface and bank filters were **byte-identical across
both runs** (124 / 11 / 0 / 9 / 50), so this was a genuine re-grounding, not filter noise.
**A cure that plants a red in a shared module is not a cure.** The rationale is written at the
call site so a later reader does not "simplify" it back.

## ⛔ SITE 2 — `isCriminal` on `incomeSources` — REFUSED. THIS IS YOURS.

**I made no code change here, and I am confident that is the right call.**

**The arm is not dead. It fires on 324 of 540 generated worlds.**

```
{"worlds": 540, "crimWorlds": 324, "crimRows": 324,
 "flagAndLabel": 324, "flagOnly": 0, "labelOnly": 0}
```

There is exactly ONE writer of criminal income in the estate,
`src/generators/economy/economicState.js:349`:

```js
incomeBuild.push({ source: label, percentage: bmc, desc, isCriminal: true });
```

The label and the flag are written **in the same object literal**. Therefore on every
generated world `row.isCriminal === true` ⟺ `CRIMINAL_INCOME_LABELS.includes(row.source)` —
proved above, `flagOnly: 0` and `labelOnly: 0`. The corpus's four configs simply never reach
`safetyProfile.blackMarketCapture > 10`; a crime-favouring config reaches it 60% of the time.

**Both available cures are wrong, and the brief's own rule says so:**

1. **Delete the arm** — destroys a live lens (DS-ECO-12 lens B) that fires on 60% of worlds,
   and reds the pool-coverage arms at `economyStateProseDesk.test.js:491` and `:588`.
2. **Re-point at the label set** (`isCriminalIncome` from `treasury.js`) — the brief's rule is
   *"a deleted dead arm is a better outcome than a re-pointed one that still cannot fire"*,
   and the inverse holds here: this re-point **adds no life whatsoever**, because the two
   detectors are co-extensive by construction on every generated world. It would only change
   behaviour on **authored/custom content**, and it would require overturning a documented
   design ruling (`economyStateProse.js:313-317`) and its pinned test
   (`economyStateProseDesk.test.js:565`, *"keys the criminal line on the RECORD flag, never on
   the generator label"*). That is a call to surface, not to take unilaterally.

**The instrument itself agrees with me.** `EXPLAINED_WRITER_EXEMPTIONS` already carries
`identity: 'isCriminal on incomeSources'`, `mechanism: 'conditional-generator-branch'`,
`ruling: 'ODQ 771.2 — the fifth class, granted on W-COIN-1b measurement'`. The read is
**bank-tagged by rule** on every scan. The two red walker arms are the arithmetic of that:

- `violations: 1` — the file has no frozen ceiling row yet.
- `expect(live.explainedWriters.banked).toBe(64)` receives **65** — the bank counted this
  read into its own total.

`--write` cannot absorb either: its rule is *"never raise a number, never add a file, never
add an identity"*, and this needs a file row **and** a raised pin. **This is a governed
set-growing mint of exactly the shape H26 was** — your act, not mine.

### One coherence defect I found while measuring, offered as a finding, not a fix

`economyStateProse.criminalIncomePoolKey` and `treasury.isCriminalIncome` are two consumers of
"is this income row the racket" that **disagree on authored rows**: a custom row labelled
`Black Market Revenue` with no flag is excluded from tax by the treasury but reads as lawful
income to the desk. Co-extensive on generated worlds, divergent on custom content. Worth an
ODQ row; I did not act on it.

## RECEIPTS — every exit captured in-shell, none read from a task notification

| gate | command | exit | result |
|---|---|---|---|
| desks (all three) | `npx vitest run tests/domain/{general,defense,economy}StateProseDesk.test.js` | **0** | **136/136** (31 + 65 + 40) ✅ |
| strict typecheck | `npm run typecheck:domain:strict` | **0** | `1121 errors, ceiling 1121` ✅ |
| OSR gate | `node scripts/check-observed-shape-readers.mjs` | **1** | 3 NEW rows → **1** |
| lint suite | `npx vitest run tests/lint/` | **1** | 3 failed / **2128 passed** (138 files) |

I ran the **real** typecheck script, not `domainStrictBaseline.test.js`, per the brief.

### `tests/lint/` failing arms — all three accounted for, none new

1. `clampPrimitiveBaseline.test.js` — `expected [62] to deeply equal [78]`. **Not mine**, the
   declared separate four-wave program. (Vitest prints Received then Expected: the source
   carries 78 and the baseline pins 62 — the tree has accrued 16 new hand-rolled clamps.)
2. `observedShapeReaders.walker.test.js` › SHRINK-ONLY — `violations: 1`.
3. `observedShapeReaders.walker.test.js` › A1/A7 — `expected 65 to be 64`.

**Arms 2 and 3 both predate this lane and both are the single refused site.** Proved against
the report I captured **before touching anything**:

```
PRE-lane   banked and enforced 65 read(s) across 9 of them   |  NEW rows: 3
POST-cure  banked and enforced 65 read(s) across 9 of them   |  NEW rows: 1
```

The banked count never moved. My work took violations 3 → 1 and touched nothing else.

## WHAT I DID NOT DO

- No `--write`, no hand-edit of `.observed-shape-readers-baseline.json`, no added rows.
- No producer changed to satisfy a reader. No key invented.
- No `git stash`, no `git checkout --`, no `git show HEAD:<path> > <path>`, no rebase, no
  push, no ref writes. Staged explicit paths only; both commits read back from `HEAD` after
  the pre-commit hook to prove it did not rewrite them. Porcelain 0 throughout.
- `node_modules` never materialised (435 symlinks, unchanged).

## DEFERRED — DOCUMENTED, NOT A BUG TO RE-FIND

1. **`narrativeGenerator.js:761`'s own `?? foodBalance?.need`** is the same dead arm on the
   producer side, plus `pdf/lib/viewModelPrimitives.js:62` and `pdf/sections/EconomicsTrade.jsx:575`.
   All three are **frozen rows**, so they are accepted debt, not new. Curing them is a
   producer change and out of this lane's scope. Deliberately deferred.
2. **The desk↔treasury criminal-income divergence** on authored rows (above). Deliberately
   deferred to an ODQ row.

---

## RETROVALIDATION ROW

| field | value |
|---|---|
| **Lane** | DEADREAD |
| **Seat** | Opus 5 — **Fable-unvalidated** |
| **Date** | 2026-09-05 |
| **Dock** | `$SC/laneINTEG-tree`, detached `940d161ca`, 23 cars over `90702c3e9`, porcelain 0 |
| **Commits** | `fbb62b04e` site 3 · `940d161ca` site 1 |
| **Assigned** | 3 dead arms |
| **Delivered** | 1 deletion, 1 re-point, **1 refusal** |
| **CONFIRMED (executed)** | `need` dead 0/540 · `isCriminal` live 324/540 · `magicExists` live, lens silences a real dead-magic world · desks 136/136 exit 0 · typecheck exit 0 at 1121/1121 · OSR 3→1 · bank count 65 pre- and post-lane |
| **PLAUSIBLE (reasoned only)** | The precise mechanism by which a bare-settlement argument re-grounds `magicWorksAt`'s receiver. The **effect** is CONFIRMED both directions; the internal rule is inferred from `singleHome` and was not read end-to-end. |
| **Behaviour shift** | **NONE.** Both cures are behaviour-identical on every world the engine can build; proved on 540 worlds (site 3) and 4 targeted real worlds (site 1). |
| **Gate left RED** | Yes, knowingly. `check-observed-shape-readers` exit 1 on `economyStateProse.js isCriminal`. |
| **⛔ OWNER/CHAIR ACT REQUIRED** | A governed **set-growing mint** (H26-shaped) admitting `economyStateProse.js` to the `isCriminal on incomeSources` bank and raising the A1/A7 pin 64 → 65. `--write` **cannot** express it. |
| **Contradicts the brief** | Yes, on evidence: 2 of 3 sites were **not** dead arms. Stated plainly rather than cured to fit. |
