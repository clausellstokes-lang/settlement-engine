# Foreign Policy / GR-4e — the fracture charge reaches the next pulse

- **Status:** LANDED
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `5a49d187f4445d33bc80d3bb2c2098bab23f92eb`
- **Last revalidated:** 2026-08-13 at implementation commit
  `c5ef5c19daac462827e10b466932c284818cf737`.
- **Landed:** 2026-08-13 — implementation
  `c5ef5c19daac462827e10b466932c284818cf737`; do not redispatch.
- **Authority history:** READY promotion
  `3339188bb13ce46acd2a31e1f293327f64f56879`, dispatch seal
  `b995d8c9a3b41619dcda3a56466892f398b62a7ff62db7a19e6522600b85b3fd`,
  and capsule
  `a31af4e2ce0eea9f1b22acdceebdd6435db34fb3a197ccf7f114adab68ffbf8a`.
- **Compiled:** 2026-08-13 from the clean terminal AO-6 tree.
- **Depends on:** the W-PEACE-3 fracture writers; the W-DOCTRINE-2 credibility
  reader and writer; GR-4c's measured dead-window finding and named `GR-4e`
  deferral at `cd2ab894`.
- **Collision group:** `information-statecraft-hot-file`. Serialize against every
  lane touching `informationStatecraft.js`.
- **Commit authority:** the coding agent edits only the five manifest paths,
  leaves changes unstaged and uncommitted, and does not promote. The coordinator
  proves and old-value-CAS lands one immutable implementation commit, then records
  terminal packet state separately.
- **Declared behavior shift:** with information statecraft lit, a coalition
  fracture stamped in treaty tick `T` contributes its recorded credibility charge
  at the information-statecraft fold in tick `T + 1`, exactly once. Tick `0`, the
  mint tick, later ticks, missing ticks, and non-finite ticks contribute nothing.
- **Census posture:** exactly one existing test title is renamed and no title is
  created or deleted. Registration counts and the estate-wide census remain
  `2412/365/2047/19984/5638`; this packet takes no census reservation.
- **Compile correction:** the proposed seven-file wider battery was executed at
  this base and measured **94**, not 99, tests. Adding the directly relevant
  six-test `peaceCausalDormancyGolden.test.js` makes the honest closed battery
  **100/100**. The stale 99 prediction is rejected rather than preserved by
  selecting an unrelated five-test suite.

## 1. Why this packet exists

`fractureCredibilityDeltas` currently asks for `fracture.tick === now`. The only
two treaty-fracture writers run later in the same `simulateCampaignWorldPulse`
call: information statecraft is mounted through `advanceInformationStatecraft`
near the earlier stage, while treaty minting is mounted through
`advanceTreatiesWithDisposition` later. A fracture cannot exist when the tick-`T`
reader runs. On tick `T + 1`, the durable record still says `T`, while the current
predicate asks for `T + 1`. The direct unit fixture mirrors that predicate and
therefore does not prove production reachability.

GR-4e repairs the window at its reader rather than adding a second credibility
fold after treaty minting. The prior-tick read is the smallest coherent shape:
the existing one-per-pulse information-statecraft fold remains the sole stage,
the treaty writers and persisted record do not move, no consume marker is needed,
and re-evaluating the same world at the same tick remains deterministic.

This does not move GR-4c's act-local breach charge. Coalition fracture and oath
breach are different behavior families with different gates. GR-4c correctly
charges a repudiation at the act; GR-4e makes the separately recorded coalition
fracture visible to the already-existing next-pulse fold.

## 2. Exact implementation contract

### 2.1 The one logic edit

In `fractureCredibilityDeltas` replace the same-tick predicate with exactly:

```js
if (now < 1 || Math.floor(finiteNumber(fracture.tick, Number.NaN)) !== now - 1) continue;
```

The three parts are binding:

1. `now < 1` makes the genesis boundary explicit; no negative tick can be read as
   a predecessor of tick zero.
2. `Number.NaN` is the invalid/missing fallback, so an absent stamp cannot collide
   with an authored numeric sentinel.
3. strict equality to `now - 1` gives one deterministic eligibility tick. There is
   no age window and no replay marker.

Update the adjacent JSDoc and the credibility-fold comment from same-tick/mint-tick
language to prior-tick/next-pulse language. Do not add a second fold, reorder pulse
stages, change the `CredibilityDelta` shape, or touch any tuning value.

### 2.2 Historical comments that must stop describing the repaired defect as open

In `peaceTermsCatalog.js`, change only the `CREDIBILITY_HIT` comment: the fracture
records the hit and `fractureCredibilityDeltas` consumes it on the next tick. The
constant and its value remain byte-identical.

In `treatyBreachCredibility.js`, replace only the anchored GR-4c historical note
that calls the window dead and GR-4e future. Preserve why GR-4c did not copy the
old same-tick idiom; add the dated completion: GR-4e now reads a treaty fracture
from `T` at the existing fold in `T + 1`, while GR-4c's oath-breach charge remains
act-local. Do not change an import, export, executable token, or tuning value.

### 2.3 The two test edits, with one title rename total

In `informationStatecraftPins.test.js` rename only this existing title:

```text
reads a this-tick fracture record and charges the deserter (the recorded-not-enforced seam)
```

to exactly:

```text
reads the prior-tick fracture record and charges the deserter exactly once
```

Inside that existing case, keep a fracture stamped `5` and prove it contributes at
tick `6`, not at tick `5` or `7`; also prove a tick-zero fixture cannot consume a
negative or missing stamp. In the existing, title-unchanged case
`a charged fracture debits the deserter's credibility stock`, advance the real
information-statecraft stage at tick `6` over a fracture stamped `5`, then read the
negative credibility stock at tick `6`. This case binds the production call, not
just the pure predicate.

In the existing `peaceTermsWave3.test.js` title
`SEPARATE EXIT: a worn, weak-tied member peels — a lighter solo peace, betrayal priced, a fracture record typed`,
add no new `it` or `describe`. Extend its existing assertions to prove that the
writer stamps `tick: 5`, that `fractureCredibilityDeltas(out.worldState, 5)` is
empty, and that `fractureCredibilityDeltas(out.worldState, 6)` returns exactly:

```js
[{ id: 'iron', kind: 'fracture', magnitude01: PEACE_TERMS_TUNING.CREDIBILITY_HIT }]
```

Then prove `fractureCredibilityDeltas(out.worldState, 7)` is empty again. The
same real writer-returned world therefore binds the whole `T / T + 1 / T + 2`
handoff, not merely a hand-built pure fixture.

Import the deriver directly from `informationStatecraft.js`. This is the concrete
writer-to-reader bridge; the stage-level case above separately proves the deriver
still participates in `advanceInformationStatecraft`.

## 3. Exact change manifest and budgets

| Action | Path | Exact region | Budget / instruction |
|---|---|---|---|
| `MODIFY` | `src/domain/worldPulse/informationStatecraft.js` | `fractureCredibilityDeltas` JSDoc, predicate, and fold comment | executable edit is one line for one line; effective count remains exactly **780 of 800** |
| `MODIFY` | `src/domain/worldPulse/peaceTermsCatalog.js` | `CREDIBILITY_HIT` comment | comments only; no token/value motion |
| `MODIFY` | `src/domain/worldPulse/treatyBreachCredibility.js` | anchored CR-GR4C-1 / GR-4e history | comments only; no token/value motion |
| `TEST` | `tests/domain/informationStatecraftPins.test.js` | two existing fracture-consumption cases | exactly one title rename; no title addition/deletion |
| `TEST` | `tests/domain/peaceTermsWave3.test.js` | existing SEPARATE EXIT case + one import | no title addition/deletion |

`informationStatecraft.js` is a hot file at **780 effective lines of a hard 800**,
measured at the verified base with eslint's own `Linter` and the live
`max-lines(skipBlankLines, skipComments)` options. The edit must be net-zero in
effective lines. A new executable line, extraction, baseline entry, or ceiling
change is outside authority.

Named do-not-touch: both fracture-writer blocks in `peaceTerms.js`;
`pulseKernel.js`; `dispositionChannels.js`; `advanceCredibility`; all ledgers and
persisted shapes; every flag, tuning value, golden, baseline, registry, census,
hazard and pre-mortem file; every path outside the five-row table. Generated
artifacts: none.

## 4. Required behavior and counterforces

### A1 — predecessor boundary

A fracture stamped `5` yields one exact delta at tick `6` and none at ticks `5`
or `7`. Tick `0`, a negative stamp, a missing stamp, and a non-finite stamp yield
none. Sorting and multi-treaty behavior remain unchanged.

### A2 — real stage call

`advanceInformationStatecraft` at tick `6` over a lit world carrying the tick-`5`
fracture writes a negative credibility score for the deserter at tick `6`. This
must fail if the `fractureCredibilityDeltas(state, tick)` spread is removed while
the pure function remains correct.

### A3 — writer-to-reader reachability

The existing W-PEACE-3 separate-exit fixture mints a fracture at tick `5`; the
unchanged product writer's exact returned world yields no delta at tick `5`, the
exact recorded `CREDIBILITY_HIT` at tick `6`, and no replay at tick `7`. Both live
writer functions remain present and continue stamping their supplied treaty tick.

### A4 — dark and unrelated behavior

The information-statecraft, NPC-credibility, intel-trade and peace-causal dormancy
goldens, and the oath-holder dormancy fence remain unchanged. No output moves when
information statecraft is dark, and GR-4c's doubly-lit oath-breach behavior remains
unchanged.

### A5 — count-neutral governance and hot-file budget

Exactly five paths move. Exactly one existing title is renamed, so registration
and census counts do not move. `informationStatecraft.js` remains 780 effective
lines; all baselines, ceilings, flags, tunings, hazard rows and pre-mortem triggers
remain byte-identical.

### A6 — two disposable mutants

Run both against the immutable candidate in a disposable proof worktree and
restore byte-identically after each:

1. **Old-window mutant:** change the exact predicate back to the old same-tick
   comparison (`fracture.tick === now`). The 67-test focused battery must be red
   at the renamed predecessor case.
2. **Detached-deriver mutant:** remove only the
   `...fractureCredibilityDeltas(state, tick),` spread from the credibility fold.
   The pure predecessor case must remain green while the existing
   `a charged fracture debits the deserter's credibility stock` case is red.

For each mutant record the nonzero exit and the named failing title, restore the
candidate bytes, rerun the battery green, and prove the five target paths match
the immutable candidate. A mutant run in the shared worktree is a stop.

### A7 — closed verification

The immutable five-path candidate passes the 67-test direct battery and the
100-test direct-plus-dormancy battery, eslint, both typechecks, observed-shape
validation, packet/hazard/pre-mortem validation, and the bare full gate. No
unrelated path or generated artifact may remain.

## 5. Verification commands

```sh
# Direct behavior battery: exact expected total 67/67.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/informationStatecraftPins.test.js \
  tests/domain/peaceTermsWave3.test.js \
  tests/domain/treatyBreachCredibility.test.js \
  --no-file-parallelism

# Direct + dormancy battery: exact expected total 100/100.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/informationStatecraftPins.test.js \
  tests/domain/peaceTermsWave3.test.js \
  tests/domain/treatyBreachCredibility.test.js \
  tests/property/informationStatecraftDormancyGolden.test.js \
  tests/property/npcCredibilityDormancyGolden.test.js \
  tests/property/intelTradeDormancyGolden.test.js \
  tests/property/oathHolderDormancyFence.test.js \
  tests/property/peaceCausalDormancyGolden.test.js \
  --no-file-parallelism

npx eslint \
  src/domain/worldPulse/informationStatecraft.js \
  src/domain/worldPulse/peaceTermsCatalog.js \
  src/domain/worldPulse/treatyBreachCredibility.js \
  tests/domain/informationStatecraftPins.test.js \
  tests/domain/peaceTermsWave3.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run check:observed-shape-readers
npm run validate:hazard-registry
npm run validate:premortem
npm run check:tail
```

Run focused Vitest commands through the mutex. Run `npm run check:tail` bare from
a clean immutable candidate; do not wrap it in the mutex and do not read it
through a pipe.

## 6. Ordered coding sequence

1. Reconfirm clean HEAD `5a49d187`, all five target blobs, both writer functions,
   the earlier/later pulse stage order, 780 effective lines, and 67/67 plus 100/100
   at base.
2. Make only the five manifest-path edits in §3. Do not stage or commit.
3. Run the direct 67-test battery, the 100-test battery, eslint, both typechecks and
   observed-shape validation.
4. The coordinator constructs one immutable five-path candidate, checks exact
   scope and budget, and runs both §4 A6 mutants in a disposable proof worktree.
5. From restored candidate bytes, rerun 67/67 and 100/100, then run the bare full
   gate. Stop on any foreign path, count movement, baseline movement, or residue.
6. Old-value-CAS land only the proved candidate. Record terminal packet state in
   a separate coordinator documentation commit.

## 7. Mandatory stop conditions

Stop and report without widening scope if any of these is true:

- either writer no longer stamps the treaty tick, or stage order no longer has
  information statecraft before treaty advancement;
- the exact predicate in §2.1 is not the final executable predicate;
- `informationStatecraft.js` does not remain at 780 effective lines or needs a
  ceiling/baseline edit;
- a second fold, pulse reorder, consume marker, persisted-shape change, new flag,
  tuning change, golden move, registration change, or census move appears;
- more or fewer than five paths move, more than one title is renamed, or any test
  title is added/deleted;
- either disposable mutant does not fail by the named counterforce, restored
  bytes differ, either battery misses 67/67 or 100/100, or the bare full gate is red.

## 8. Executed landing receipt — 2026-08-13

- **Authority and immutable landing:** READY promotion
  `3339188bb13ce46acd2a31e1f293327f64f56879` produced seal
  `b995d8c9a3b41619dcda3a56466892f398b62a7ff62db7a19e6522600b85b3fd`
  and capsule
  `a31af4e2ce0eea9f1b22acdceebdd6435db34fb3a197ccf7f114adab68ffbf8a`.
  The direct green child is implementation
  `c5ef5c19daac462827e10b466932c284818cf737`; its sole parent is the promotion,
  and one old-value CAS exposed it.
- **Exact implementation scope:** the five manifest paths and raw line deltas are
  `src/domain/worldPulse/informationStatecraft.js` **+7/-7**,
  `src/domain/worldPulse/peaceTermsCatalog.js` **+1/-1**,
  `src/domain/worldPulse/treatyBreachCredibility.js` **+6/-5**,
  `tests/domain/informationStatecraftPins.test.js` **+15/-7**, and
  `tests/domain/peaceTermsWave3.test.js` **+7/-0**: **+36/-20** total.
  `informationStatecraft.js` remains exactly **780 effective lines**. Exactly one
  existing title was renamed; no title was added or deleted, so registration and
  census cardinalities did not move. Generated artifacts: **NONE**.
- **Disposable counterforces:** the old-window mutant exited `1` at
  **64 passed / 3 failed**, including the exact renamed predecessor title
  `reads the prior-tick fracture record and charges the deserter exactly once`;
  log SHA-256
  `1b5356594042b3c7dc9503aae73d05b6e3384bc97baf84b9a182a2eb1c1dd43b`.
  The detached-deriver mutant exited `1` at **66 passed / 1 failed**: the pure
  predecessor case remained green while
  `a charged fracture debits the deserter's credibility stock` failed; log SHA-256
  `b6208ee2ea2ad74afedfc586be362668a3f707a34dd9b23ab5d48b11a49c43ca`.
  Each mutation restored byte-identically with no residue.
- **Focused and static closure:** the restored direct battery passed **67/67**
  (log SHA-256
  `854c3049751801421d4b081c5f06e1565ceb76715e77f48534f82ca5889c42f8`)
  and the direct-plus-dormancy battery passed **100/100** (log SHA-256
  `d10ddf379113c189bf69c520ac8931fff4ab0f02074a3b983e9ab21d8d44ed71`).
  Packet validation, hazard validation, pre-mortem self-check and eslint passed;
  typecheck ratchet held **173/173**, strict domain typecheck held
  **1,134/1,134**, and observed-shape validation remained exact at **1,998**.
- **Full landing gate:** bare `npm run check:tail` exited `0`; strict dist
  discovered **50 files** and passed **403/403** tests. The full-gate log SHA-256
  is `d5771a94b64d17630561805e26cae429f9b164e0424dec73e849d6c88216f7a8`.
  The immutable implementation tree was clean and carried no proof residue.
- **No-motion and boundary receipt:** no second fold, pulse reorder, treaty-writer
  edit, consume marker, persisted-shape change, flag, tuning, golden, registry,
  baseline, ceiling, hazard, pre-mortem or census file moved. The whole census
  remains **2412/365/2047/19984/5638**, and its reservation is free. A1-A7 passed.
  No diagnostic-soak worktree was created and neither D-1 nor L0 was started.
  The next governed act is the live **CR-NEXT-1** census only.
