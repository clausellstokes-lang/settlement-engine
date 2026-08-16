# GV / GV-4 — spatialLedgerCoverage binds TRACKED to a live mover (member 4 of `gv`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `69758820aac972a528f9dd330cb25807106b8979`
- **Train:** `gv`, family **GV**, member **4** of 4. Path-disjoint from its siblings, and the
  train's CENSUS HOLDER — it is the only member naming the lighting walker.
- **Preamble:** none — GV is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§116.3** · **§75** · **§137**; the standing
  `spatial-ledger-manifest-classification-law` hazard.
- **Compile of record:** `laneTC23-MICRO-PLAN.md` §3.1, annex row `MB.M5`.

---

## §1 · THE DEFECT

The walker pins `written === TRACKED ∪ EXEMPT` — every ledger key a kernel writes is classified.
It does NOT check that a TRACKED key actually reaches an emission. `TRACKED` asserts "surfaced
as a mover", and nothing in the estate binds it to a live `MOVER_PRESENCE` row.

So the mover row can be deleted and every arm stays green while the telemetry emits nothing for
that key. That is the recorded fails-open hazard, and it has an executed receipt: deleting a
mover row leaves this walker and two sibling suites 28/28 green.

## §2 · THE CURE

A TOTAL mapping from `TRACKED_LEDGER_KEYS` onto live mover rows, asserted in both directions
plus a stale-row check.

⚠ **SOURCE-SCANNED, NOT EXPORTED.** `MOVER_PRESENCE` is a local const inside
`extractSpatialUsage`. Exporting it would widen `spatialUsage.js`'s public type surface for a
test's convenience — the recorded size-ratchet lesson — so the scan reads the array's own rows.
The member therefore opens ONE path, not two, and `src/lib/spatialUsage.js` is not touched at
all.

⚠ **THE KEY-TRANSLATION TABLE IS THE MEMBER'S REAL CONTENT (fork `GV-4'`).** Mover rows are
keyed by the DERIVED signal name (`caravans`, `field_combat`, `trade_flow`), not by the ledger
key that feeds them, so a bare set comparison would be meaningless. The table is explicit and
every row names the ledger key it maps. Two mover rows carry no tracked key of their own —
`smuggle` (a second reading of `supplyShipments`) and `approval_queue` (counted off
`worldState.proposals`, not a ledger at all) — and both are recorded with their reason, so a
NEW unexplained mover reds instead of drifting in.

## §3 · THE CONTROL ARMS (§75, MANDATORY)

⚠ **On FIXTURES, never by mutating the real module mid-run** — the fork requires it.

- **CONTROL:** the intact fixture reports no orphan.
- **MUTANT:** deleting a mover row from the fixture orphans its TRACKED key BY NAME.
- **MUTANT:** a TRACKED key with no translation row is named, not silently skipped.
- **FAIL-CLOSED:** the scan throws when its anchor moves, rather than reading as clean.
- **EXACTNESS:** the scan reads a fixture array exactly, comments and all.
- **NON-VACUITY:** the live scan must find more than 20 rows and no duplicate name.

## §4 · SCOPE AND BOUNDARY

This binds TRACKED to emission. It does not re-classify a single key, does not touch
`EXEMPT_LEDGER_KEYS`, and does not open `src/`.

## §5 · THE CENSUS THIS MEMBER HOLDS

The train's four cures add +10 titles and +1 suite title; `files`, `parked` and `credited` are
UNMOVED, which was the train's signed contract. This member holds the reservation on
`tests/lint/sovereigntyLightingContract.walker.test.js` — at most one packet may, and the
re-record states its cause and attributes the delta per file, including the two files whose
new pins the census structurally cannot see because they register from a loop.

## §6 · ACCEPTANCE

| id | case |
|---|---|
| A1 | every TRACKED key reaches a live mover row |
| A2 | no translation row names a key that is no longer TRACKED |
| A3 | every mover row is a TRACKED key's target or a recorded exception |
| A4 | deleting a mover row in a FIXTURE orphans its key by name |
| A5 | the scan fails closed when its anchor moves |
| A6 | deleting the REAL `habit_conditioning` row reds the walker; restored byte-exact |
| A7 | the census re-records to its measured five-tuple with `files`/`parked`/`credited` unmoved |

## §7 · CHECKS

```
npx vitest run tests/lib/spatialLedgerCoverage.walker.test.js tests/lib/spatialUsage.test.js \
  tests/property/espionageCareerCreditDormancy.test.js
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
```

## §8 · MUTANTS AND HAZARDS

- **The estate plant.** Deleting the real `['habit_conditioning', counts.habit_actors]` row reds
  exactly the new arm, naming the orphaned key; restored byte-exact, verified by `cmp`.
- ⚠ **Same-seed: NEUTRAL** — a test file only.
