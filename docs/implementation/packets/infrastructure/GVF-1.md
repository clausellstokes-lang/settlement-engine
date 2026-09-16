# GVF / GVF-1 — rawColorLiteral: re-record EXACT, and see the template form (member 1 of `gvf`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `ec7443301ec74325cd051890d0e99ed452bd8ad5`
  (the `gv` terminal; the micro-batch's third train base)
- **Train:** `gvf`, family **GVF**, member **1** of 3. All three members are path-disjoint
  (TTS S2/S6), so all three promote together.
- **Preamble:** none — GVF is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§116.3** · **§75** (the mutant-control idiom) ·
  **§137** · **§142**.
- **Compile of record:** `laneTC23-MICRO-PLAN.md` §3.2, annex rows `MB.M6`, `MB.M7`; forks
  `J-TC23-5` (the executor records ITS OWN number) and `J-TC23-6` (one population per number).

---

## §1 · THE DEFECT

Two defects in one ratchet, and the second is why the first went unnoticed for four landings.

**(1) THE UNBANKED SHRINK.** `BUDGET` is asserted with `≤`, so a shrink is invisible. The `da`
and `dom` landings retired 53 raw literals and no one lowered the ceiling. At this base the
corpus holds **1335** raw color literals against a committed **1405** — seventy literals of
silent headroom, into which net-new raw color ships green. A monotone-down ratchet that cannot
see its own descent is not monotone; it is a high-water mark nobody re-reads.

**(2) THE TEMPLATE BLIND SPOT.** The counter walks `Literal` nodes only, so a hex written as
`` `#abc123` `` was invisible to every ceiling this file ever recorded. It is not hypothetical:
`src/components/ConfigurationPanel.jsx:200` carries `` color:`#8a6020` `` in a style object
today, and no budget has ever counted it.

## §2 · THE CURE

Both numbers are re-recorded as **EXACT equality**, and the template population gets its **own
constant on its own line** rather than being folded into the literal total, so a future movement
stays attributable to the population that moved (`J-TC23-6`).

Both figures are MEASURED at this commit's base by re-executing the counter, never inherited —
the compile's own 1335 is explicitly non-authoritative (`J-TC23-5`), and 1388 and 1405 are
forbidden. The counting core is lifted into `countColorsInSource(src)` so the control arms can
execute it on a fixture: a budget guard whose counter can only be run over the whole repository
can never demonstrate that it counts the thing it claims to count.

⚠ The RuleTester half (`:38-54`) is NOT touched — GV-1 hand-reclassified it as genuinely proven.

## §3 · THE CONTROL ARMS (§75, MANDATORY)

1. **CORPUS NON-EMPTY.** A broken walk would report 0 and 0, and both budget arms would be
   satisfied by having scanned nothing. The scanned-file count is asserted first.
2. **LITERAL POSITIVE + the swatch exemption**, on fixtures.
3. **THE LOAD-BEARING ARM.** A pure-hex TEMPLATE element is counted AND the literal side still
   reports zero for it — or the second budget is measuring nothing the first did not.
4. **NEGATIVE.** A hex inside a longer chunk (`` `1px solid #c8a84a` ``) is not counted, so the
   new dimension is not a false-positive machine.
5. **FAIL-CLOSED.** An unparseable source reports `parsed:false`, never a clean count.

## §4 · SCOPE AND BOUNDARY

This fixes the unbanked-shrink and template blind spots in THIS ratchet. It does not tokenize
the one live template hex (that is design work, and the number records the debt honestly), does
not touch the eslint rule itself, and does not change what counts as a raw color.

## §5 · ACCEPTANCE

| id | case |
|---|---|
| A1 | both budgets are EXACT equality, and both numbers were measured at this base |
| A2 | the template population has its own constant and its own assertion |
| A3 | a planted literal hex in a REAL src file reds the literal arm |
| A4 | a planted template hex in a REAL src file reds the template arm ALONE |
| A5 | the template counter sees a form the literal counter cannot |
| A6 | a hex inside a longer template chunk is not counted |
| A7 | an unparseable source reports parsed:false rather than a clean count |

## §6 · CHECKS

```
npx vitest run tests/lint/rawColorLiteral.test.js
```

## §7 · MUTANTS AND HAZARDS

- **Estate plant M1** — the live template hex re-quoted as a literal moves one occurrence
  between populations and reds BOTH arms, proving the two numbers are genuinely separate.
- **Estate plant M2** — a non-hex template chunk made pure reds the TEMPLATE arm alone, which
  is the dimension half (b) adds. Under the pre-cure guard this plant was invisible.
- Both restored byte-exact, verified by `cmp` and `shasum -c`.
- ⚠ **Same-seed: NEUTRAL.** A test file, in no generation import closure.
- ⚠ **Census:** no test FILE is created or deleted, so `files`, `parked` and `credited` cannot
  move. `titles` moves by the control arms this member adds.
- ⚠ **EXACT equality is deliberately strict**: any later raw-color change reds until re-recorded
  by measurement. That is the point, and the re-record ritual is written into the file.
