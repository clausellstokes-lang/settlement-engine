# SK / SK-2B — checkpoints, capsules, and the `sk-a` census re-record (member 4 of `sk-a`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `0cbb0177b177717873804200e908a27d42363ed4`
- **Train:** `sk-a`, family **SK**, member **4** of 4 — last in the train.
- **Depends on:** SK-0, SK-1, SK-2A.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§141.2** · **§143.5** · **§149.3** ·
  §42/§43 · §102.3 · the census law · the banked-failure identity law.
- **Compile of record:** `laneTC28-SK-PLAN.md` §3.4, annex rows `SK.U1`, `SK.M9`.

---

## §1 ⛔⛔ SK.U1 SETTLED AS A REAL DEFECT — AND THE FORK'S PREMISE IS REFUTED

The family's single largest unknown was whether a year-boundary JSON round trip is
byte-faithful. **Executed at this base: it is not.** A year-2 realm carries 146
`undefined`-valued keys across twelve distinct paths — `activeChains[].entrepot`,
`institutionalServices[].icon`, `foodBalance.magicFoodNote`, `stress.icon`,
`institutions[].removedByWorldPulseOutcomeId` and their siblings — and `JSON.stringify`
drops every one. **The composite hash cannot see it**, because the hash is itself
stringify-based; a restore proof that compared hashes would have been green and meaningless.

⭐ **The compile's signed fork (SK-2B′) assumed the cure needed an ENGINE-SIDE
serialization seam, which would have flipped the family's no-`src/` classification and sent
the restore half back to chair dark. That premise is refuted by measurement**: the census
already knows the exact paths, so the WRITER records them and the READER re-plants them.
The thing is made true; the instrument is not made blind. That distinction is the whole
difference between this and the self-referential pin class — normalizing BOTH sides through
a lossy round trip so the comparison passes. The census still runs at full strength AFTER
the replant, and the pin's counterfactual reds if the replant becomes a no-op.

⚠ **THE FIRST INSTRUMENT WAS WRONG, AND THE ERROR IS WORTH THE RECORD.** A census with one
global `seen` set is ALIAS-SENSITIVE: a live realm is a DAG, its round-tripped copy is a
TREE, so every shared reference reported as a difference — 121 artifacts around 12 real
findings on the first run. The cycle detector is now the ANCESTOR STACK, with a
`(node, path)` memo so DAG re-walking stays bounded. An instrument that drowns twelve true
findings in a hundred artifacts is worse than no instrument.

## §2 · THE CADENCE IS A BAND WITH A HOME, AND AN ARGUMENT RATHER THAN A CONSTANT

`--checkpoint-every` has no default: absent means no checkpointing, which is the
pre-harness behaviour exactly. `[1, 10] default 5` for the 100-year class and
`[5, 25] default 10` for CENTURY-300, **derived**: §141.2's stated intent is "reproduce
from tick 3,900 instead of from zero", i.e. at most ONE YEAR of replay, and at 52
ticks/year the ≤52-tick replay serves it. The lower bound is the per-checkpoint write
cost, a figure the receipt already carries as `finalRealmBytes`.

## §3 ⛔ A RESTORED RUN CANNOT ASK FOR A VERDICT, TWICE OVER

Checkpoint replay serves the FIX LOOP only. `--case-id` is absent from a restore
invocation BY CONSTRUCTION, and the soak script refuses the combination independently —
two guards, because this is the rule a hurried fix lane would most like to break.

## §4 · CAPSULES REFUSE TO INVENT A HOME, AND REFUSE THE WRONG CLASS

A capsule written inside the run archive dies with the archive teardown, and the finding it
documented has to be re-earned at full century cost. This module takes the durable home as
an argument and REFUSES when none is supplied — a home guessed here would be a second
spelling of a location that must have exactly one (SK-6 owns it). It also refuses a
host-observability firing: a capsule that replays green forever teaches a fix lane to
distrust capsules. The capsule id IS the census key — tripwire + full cell identity + tick
band, never the bare seed.

Replay re-executes against a fresh `git archive` of the recorded tip with that archive's
OWN lockfile install, and **REFUSES on a node-major mismatch**: same-engine byte identity
is guaranteed, cross-engine identity is not, because implementation-approximated `Math` can
fork same-seed worlds across engines while every same-engine golden stays green. A hash
mismatch under a mismatched engine is **ENGINE_VARIANCE**, never a finding.

## §5 · THE `sk-a` CENSUS RE-RECORD

ONE member per train declares the lighting census; this is it, last in the train. The tuple
is RE-DERIVED from this train's own executed run and the delta attributed ONE TEST FILE AT
A TIME with a one-title CREDITED stub. ⚠ The compile predicted +31 titles and the measured
delta is **+22** — exactly the shape the parked-file hazard wears — so it was run down
rather than accepted: four probes account for every title, `parked` is unmoved, and
`credited` moved by the full +4.

## §6 · SCOPE AND BOUNDARY

Nothing under `src/`. No flag. **Same-seed: NEUTRAL.**

## §7 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the round trip IS lossy and the composite hash is byte-identical across the loss |
| A2 | the replant cures the census exactly, and a no-op replant still reds |
| A3 | the cadence band refuses an out-of-band ask, and a restore invocation carries no `--case-id` |
| A4 | a capsule refuses an invented home and refuses a host-observability firing, by their own causes |
| A5 | the replay refuses a node-major mismatch and classifies a cross-engine mismatch as ENGINE_VARIANCE |
| A6 | the lighting census tuple is re-derived from an executed run and its delta attributed by measurement |

## §8 · CHECKS

```
npx vitest run tests/soak-harness/checkpointRestoreParity.test.js tests/lint/sovereigntyLightingContract.walker.test.js tests/lint/mutationCoverageManifest.test.js
```

## §9 · MUTANTS AND HAZARDS

- ⚠ **§102.3: `checkpointRestoreParity.test.js` contains `parity`, so it MATCHES
  `NAME_PATTERN` and OWES its mutation-coverage row.** The row is minted here, which is
  also why this member — not SK-1 — declares the manifest. The name is kept deliberately:
  the row is cheap and `parity` is the honest description.
- ⚠ **The manifest is edited by SURGICAL TEXT INSERT, never re-serialized.** A
  `JSON.stringify` round trip rewrites the file's `—` escapes as literal em dashes and
  produces a 95-line diff for a 5-line addition. Measured here, reverted, redone.
- ⚠ The EXECUTED two-year restore probe is quoted in the lane receipt, not run inside a
  test suite — §145.2 forbids a soak in a test.
- ⚠ Census: one new test file, five titles, one suite title.
