# CS / CS-B2 — the demographic named floor stops minting people (member 3 of `cs-b`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `eab6eba053e09732f12acbfe563874db02f056ce`
  (the `cs-a` train's dispatch base; authored on top of cs-b's `6d19d5e7`)
- **Train:** `cs-b`, family **CS** (un-stamped, cap 4), member **3**. Change paths disjoint
  from every other member of this train.
- **Preamble:** none — CS is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§72.1** (cs-4 confirmed: "the demographic
  named floor mints population against the receipt — `max(named, …)` vs the module's own
  law 1") · **§72.3** (the trajectory pin is mandatory) · **§111.3**.
- **Compile of record:** `laneTC20-CSGEN-PLAN.md` §4.5.

---

## §1 · THE DEFECT, AND WHY IT LOOKS LIKE A SAFETY RAIL

`src/domain/worldPulse/demographicsKernel.js:297`:

```js
const after = Math.max(named, before + births - deaths);
```

It reads as the H3 cast protection — "never let the head count fall below the named
residents". **But H3 is already structural, two lines above.** The death draw is taken
against the ANONYMOUS POOL:

```js
const pool = Math.max(0, before - named);
const deaths = Math.min(pool, integerize(pool * rates.death01, draw()));
```

so `deaths <= before - named`, and therefore `before + births - deaths >= named` holds
identically **whenever `named <= before`** — which is every ordinary settlement. The `max`
can only ever BIND in the one case where binding is wrong: `named > before`. And there it
does not protect anybody, because there is nobody at risk; it **invents people**.

⛔ **It breaks the module's own header law 1 ("no growth term that is not a birth") and
makes the receipt line false in the same breath.** Measured at this base, a 2,000-head town
carrying a 2,600-name roster:

| tick | base — the defect | this cure |
|---:|---|---|
| 1 | `before 2000 → after 2600`; births **2**, deaths 0. The history row records `delta: 600` under the reason *"2 born and 0 buried."*, and the herald line reads *"counts 2,600 souls this week, 2 born and 0 buried"* | `before 2000 → after 2002` |
| 2-10 | `+2/+3` a tick — indistinguishable from health | `+1/+2` a tick |
| **Σ** | Δ **620** against **22** births ⇒ **closure residual 598** | Δ 18, 18 births ⇒ **residual 0** |

**598 souls out of nothing, in one tick, and then the evidence hides.**

## §2 · WHAT REPLACES IT

The floor **without** the mint:

```js
const after = Math.max(Math.min(named, before), before + births - deaths);
```

Where `named <= before`, `Math.min(named, before) === named` and the expression is the base
expression character for character — every ordinary settlement is byte-identical. Where
`named > before` (a DM population edit, or a terminal-decline town reduced toward its cast)
the head count now moves by `births - deaths` alone.

⚠ **AN HONEST MEASUREMENT, RECORDED RATHER THAN GLOSSED.** Deleting the floor entirely
(`Math.max(0, before + births - deaths)`) passes the whole 47-test file. The retained
`Math.min(named, before)` term is therefore **provably inert** — the pool clamp already
does the protecting. It is kept because §72.1 rules cs-4 as the mint repair, not as a
removal of the cast-protection statement, and the narrower edit is the one that was ruled.
The pin asserts the CONSEQUENCE (no mint, closure closes), never the presence of the term.

## §3 · THE TRAJECTORY PIN (§72.3)

`tests/domain/demographicsMigration.test.js` gains one suite of three arms, driving ten
ticks with no roads so that no column can move anybody and births and deaths are the only
terms in the closure:

1. **The trajectory** — per tick the head count is asserted to move by exactly
   `births - deaths`; the **cumulative closure** `Δtotal - (births - deaths)` is asserted
   to be **0** across the whole run (at base this is 598); and the cast is shown protected
   *without* the mint, since the anonymous pool is empty so `deaths === 0` every tick.
2. **The receipt line is true** — every `populationHistory` row's `reason` string is
   re-derived from the same two integers the row records, its `delta` is asserted to BE
   `births - deaths`, and the herald line is asserted to quote the head count actually
   written.
3. **The negative control** — an ordinary town (roster far below head count) reproduces the
   exact base ten-tick sequence `[2001,2002,2003,2004,2005,2005,2006,2006,2006,2006]` with
   the death branch live (`[1,1,1,1,1,2,1,1,2,1]`), which the first run cannot exercise.

⛔ **Why a single-tick fixture cannot do this.** The mint is a ONE-TICK event that then
hides behind nine healthy-looking ticks. A single-tick assertion of "population did not
fall below the cast" PASSES on the defect. Only the accumulated closure convicts it.

⚠ **THE COMPILE'S OWN FIXTURE CANNOT SEE THIS DEFECT, and the correction is measured.**
`laneTC20-CSGEN-PLAN.md` §4.5 specifies "a village with population 10 and 50 named
residents". Executed here: a village of 10 has an expected birth count of
`10 × 0.00088 = 0.0088`, so `births` is 0 on every tick, `if (births === 0 && deaths === 0)
continue` skips the block entirely, and base and cure produce IDENTICAL ten-tick runs —
population 10 forever, with no receipt at all. The fixture is scaled to a town whose
expected births clear 1 (`2000 × 0.00085 = 1.7`). Recorded as **J-TE21-1**.

**Mutants, both executed:** reverting to `Math.max(named, …)` reds arms 1 and 2 with
`expected 600 to be 2`; a `Math.min(named, …)` typo-cure reds arm 3 **and only arm 3**
among this member's arms, which is the receipt that the negative control is load-bearing
rather than decorative.

## §4 · SIZE AND MANIFEST

`src/domain/worldPulse/demographicsKernel.js`: **191 → 191** effective lines (eslint's own
`Linter`), against the domain layer's 800 ceiling — **exactly line-neutral**, and no size
pressure at all on this file.

| # | action | path |
|---|---|---|
| 1 | MODIFY | `src/domain/worldPulse/demographicsKernel.js` |
| 2 | MODIFY | `tests/domain/demographicsMigration.test.js` |

Handwritten files: **2**. New production leaves: **0**. Flags: **0**. Persisted record
families: **0**. `retiredSymbols`: **NONE**. **+3 test titles, +1 suite title** — the
lighting census re-record for this train is carried by CS-B3.

## §5 · STOP CONDITIONS

1. Any same-seed golden moves. Every ordinary settlement — the whole generated corpus — is
   expected to be byte-identical, because `named <= population` there.
2. The head count is ever observed BELOW the anonymous-pool floor, which would mean the
   structural H3 protection had been damaged rather than left alone.
3. `demographicsKernel.js` grows by even one effective line.
