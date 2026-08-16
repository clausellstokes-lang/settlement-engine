# SK / SK-2A — the two-class tripwire registry (member 3 of `sk-a`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `0cbb0177b177717873804200e908a27d42363ed4`
- **Train:** `sk-a`, family **SK**, member **3** of 4.
- **Depends on:** SK-1.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§141.2** · **§42/§43** · **§131** ·
  the finite-semantics law · the hazard-registry law.
- **Compile of record:** `laneTC28-SK-PLAN.md` §3.3.

---

## §1 ⛔⛔ THE SPLIT IS LOAD-BEARING FOR SK-1, NOT TIDINESS

Eight pooled workers sharing memory bandwidth fire duration and memory tripwires that a
solo run does not. An UNSPLIT registry therefore breaks the in-pool ≡ solo determinism
proof **by construction** — the harness would convict a cell of non-determinism for the
crime of having been run beside seven siblings.

- **DETERMINISTIC** — state-derived, fires identically in-pool and solo. Five rows: a
  failed assertion, a non-finite ledger figure, population collapse, a negative stock,
  unbounded growth. **Only this class mints findings and capsules.**
- **HOST-OBSERVABILITY** — wall-clock and RSS. Two rows. Recorded as metadata, excluded
  from every determinism comparison, never a finding by itself; cost findings ride the
  perf lane.

The partition is asserted TOTAL and DISJOINT, and the boundary is enforced by
**source-scanning each deterministic row's own detector** for `Date.now`,
`performance.now` or `memoryUsage` — machinery, not a naming convention. The scan carries
a planted row that does read a clock, so the arm cannot pass on an empty registry.

## §2 ⚠ THE REMNANT LAW OR THE ROW IS A FALSE-FINDING FACTORY

A properly-died settlement legitimately holds zero (the 2026-07-31 law that
`whole-world-soak.mjs:559` already honours). Without the died-flag exception, the
population-collapse row reports every lawful death as a finding — and a registry that
cries wolf on correct behaviour is worse than an absent one. The flags were computed by
the soak and then discarded; SK-0 puts them on the receipt so this row can be honest, and
both sides are pinned: a zero WITH the flag is silent, a zero WITHOUT it fires.

## §3 ⭐ TWO ENVELOPES INHERITED VERBATIM, NEVER RE-MINTED

`900_000 × settlements` comes from `whole-world-soak.mjs:578-582` with its in-code
rationale ("~900KB/settlement is a wide envelope over the measured ~150KB/settlement at
6y"). The wall-time trend `q4 <= q1 × 8 + 50` comes from `:590` — machine-tolerant by
design, which is exactly why it is host-observability here. **A second spelling of one
envelope is the five-homes defect this estate refuses everywhere else.**

## §4 · SCOPE AND BOUNDARY

One registry module, one test. Nothing under `src/`. No flag. **Same-seed: NEUTRAL.**

## §5 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the registry is closed and typed, every threshold carries a derivation home, and the classes partition it |
| A2 | no deterministic row reads a clock or the heap, and a planted row that does is convicted |
| A3 | a clean receipt fires nothing, and a remnant zero fires nothing |
| A4 | each deterministic row fires on its own defect and only on its own |
| A5 | a pool-pressured receipt fires BOTH observability rows and ZERO findings, while a real defect in the same receipt is still convicted |

## §6 · CHECKS

```
npx vitest run tests/soak-harness/tripwireRegistry.test.js
```

## §7 · MUTANTS AND HAZARDS

- ⚠ Every detector must be TOTAL: an empty or malformed receipt yields an array, never a
  throw. A registry that crashes on a truncated receipt disables itself exactly when a run
  went wrong.
- ⚠ New classes are added by REGISTRY ROW, never by inline check — the recorded
  hazard-registry lesson, which this estate has already paid for once.
- ⚠ §102.3: `tripwireRegistry.test.js` matches no `NAME_PATTERN` token ⇒ **no
  mutation-coverage row owed**, deliberately named so.
- ⚠ Census: one new test file, six titles, one suite title.
