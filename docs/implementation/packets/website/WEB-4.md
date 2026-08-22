# Website / WEB-4 — the sim_address_chain registry row (member 4 of `W-A`)

- **Status:** READY
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `19b799ce718d52e36a3b14a85fa9cfd5051ccf26`
- **Last revalidated:** 2026-08-22 at `19b799ce718d52e36a3b14a85fa9cfd5051ccf26`
- **Train:** `W-A` (telemetry and privacy), family **website/product-surface** —
  un-stamped, so any train carrying it holds the four-member cap.
- **Owner authority:** `OWNER_DECISION_QUEUE.md` **§359.9** ("GO as queued") over
  **J-TE28-3 / §182.3** (the four priced obligations, recorded and not dropped).
  Compile of record: the website train's charter §4, whose reconstruction of the four
  obligations by footprint census the chair accepted at §402 C4.
- **Depends on:** **SK-0 LANDED** — it carries `measureAddressChain` and the
  `addressChain` block on every yearly observation. Without it this member has no
  source and the registry's own arity arm would refuse the row, which is the outcome
  the registry header predicted in writing.
- **Collision group:** none. `scripts/telemetry/**` is disjoint from WEB-1
  (`src/lib/consent.js`), WEB-2 (migrations and cron functions) and WEB-3
  (`analyticsEvents.js` and its call sites); WEB-1's non-goals name this directory as
  untouched from the other side.
- **Behavior posture:** ADDITIVE OBSERVATION-SIDE. No engine byte, no client byte, no
  seed motion, no golden re-record. Same-seed: **NEUTRAL** — nothing here runs inside
  a simulation.

---

## §1 · THE RULING, AND WHAT IT COSTS AT THIS BASE

§359.9 discharges J-TE28-3 as one rider: the registry row and its arity obligation,
the emitter and aggregate arms, the regenerated dictionary, and the census re-record.

The car is small for a reason worth stating, because it is the reason it was queued
rather than refused. §180.3(a)'s price — a receipt field edits
`scripts/audit/behavioral-observation.mjs`, which is inside
`REALM_SCALE_SOURCE_PATHS`, and moving it moves the certification aggregate's source
fingerprint — **was already paid by SK-0**, which carried the instrument on the one
declared fingerprint move it was making anyway. This member therefore reaches nothing
under `scripts/audit`, and paying that price a second time to get there would move the
fingerprint for nothing.

## §2 ⭐ THE MEASURED SHAPE REFUTES THE PREDICTED ONE

The compile allowed for two branches and told the executor to take the measured one.

`addressChain` does **not** arrive as its own receipt key. `observeBehavioralYear`
returns it INSIDE each yearly observation, exactly as it returns `phraseRepetition`,
`succession` and `motion`. `RECEIPT_FIELD_ARITY` names top-level receipt fields plus
the one dotted year-series path, and no sub-field of a year entry has ever had a row
in it — `phraseRepetition`, the direct sibling reading the very same news rows, has
none either.

⇒ The row declares `source: ['behavioral.yearly']`, its epoch is `year` because that
is the epoch its source already has, and **`RECEIPT_FIELD_ARITY` is byte-unchanged**.

The reading is written down as an assertion rather than as a comment, so a later
member that hoists the block to the receipt root reds instead of drifting. This is the
same discipline `SIM_METRIC_EPOCHS` already carries one screen above: the compile
predicted a `decade` epoch, the measurement refused it, and the refusal is in the file.

## §3 ⛔ THE EMITTER COPIES AND NEVER COMPUTES

SK-0 publishes the rates as **integer milli** already — the `sim_narration_tempo`
idiom, adopted so no float can fork between the Node face and the SQL face — so the
transform passes them through verbatim. `narrationRows`, directly above it, multiplies
a float rate by 1000 because ITS instrument publishes floats; doing the same
arithmetic here would be resampling a value the receipt had already decided, which the
charter forbids in the same sentence that gives the emitter its licence.

⛔ **A YEAR WITHOUT THE INSTRUMENT EMITS NOTHING, NOT ZEROES.** `measureAddressChain`'s
header states the law for its own field: a receipt without the key is an instrument
gap, not a zero. `obj()` is deliberately not applied to this block — it would turn a
missing instrument into a floor of zeroes indistinguishable from a world whose
narration carries no addresses at all, and a curve band frozen over invented zeroes is
worse than an absent curve because a later reader cannot tell it from a measurement.

⛔ An `addressChain.schemaVersion` this transform does not know is **REFUSED** rather
than parsed best-effort, in the emitter's own declared idiom: a later instrument may
keep these field names and mean something else by them.

## §4 · SHAPE OF THE ROW

`sim_address_chain` · class `simulation` · epoch `year` · dims `measure` · unit
`news_rows` · source `behavioral.yearly`.

`unit` is `news_rows` rather than `milli` because the row carries BOTH counts and
integer-milli rates under one `measure` dim — exactly as its sibling does, over
exactly these rows. The containment-ladder histogram folds into `measure`
(`depth_0`…`depth_4`) rather than minting a second dimension that would be blank on
every other row and would then need declaring for the emitted-side dimension scan.

## §5 · SCOPE AND BOUNDARY (the non-goals, affirmatively)

- **ZERO** edits under `scripts/audit/` — the certification fingerprint stays where
  SK-0 left it.
- **ZERO** client bytes. `scripts/telemetry/` is in none of `REALM_SCALE_SOURCE_PATHS`,
  so the exclusion is structural rather than promised.
- **No migration.** Migration 196's EAV rollup enumerates no metric name at all, so it
  admits any registered name; its DDL is untouched and its own pin re-runs green.
- **No new observation.** The emitter transforms what the receipt already holds.
- No copy, no deploy surface, no owner-gated remainder.

## §6 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the row passes the registry's own totality and arity pins, with the epoch its measured source already has |
| A2 | name disjointness from `Object.values(EVENTS)` holds in both directions over the widened set |
| A3 | a fixture year carrying the instrument emits the row's measures; a year without the key emits nothing and errors nothing |
| A4 | emitted values equal the receipt's own milli fields verbatim, proved against a block whose rates disagree with its counts |
| A5 | no dim on the new row names an actor, session, user, consent or country — the wall walker's schema arm re-run over it |
| A6 | the generated dictionary renders the row in its simulation section and the freshness pin is green |
| A7 | the curve-band family set contains the row, and the estate census is re-recorded with the delta attributed to it |

## §7 · CHECKS

```
npx vitest run tests/lib/simMetricRegistry.test.js tests/lib/simMetricEmitter.test.js \
  tests/lib/simMetricAggregate.test.js tests/soak-harness/curveBandFreeze.test.js \
  tests/lint/engineTelemetryWall.walker.test.js tests/docs/analyticsDictionaryFreshness.test.js \
  tests/security/worldSimMetrics.pglite.test.js
npx vitest run tests/lint tests/build
npm run check:observed-shape-readers
npm run validate:packets
npm run check:tail
```

## §8 · DECLARED FIGURE MOVES

| figure | from | to | cause |
|---|---|---|---|
| `SIM_METRIC_NAMES.length` (registry pin) | 12 | 13 | the row |
| `SIM_METRIC_NAMES.length` (wall walker ARM E) | 12 | 13 | the row, over the closed set the ingest path refuses |
| estate census `titles` | 20,719 | 20,721 | two `it` arms in `tests/lib/simMetricEmitter.test.js` |

`files`, `parked`, `credited` and `suiteTitles` do not move: no test file is minted and
no `describe` is opened. The census delta was attributed BY ISOLATION at this base —
reverting that one file with the whole rest of the member applied convicts the before
figure green — and never by arithmetic.

## §9 · MUTANTS, AND WHY THE SECOND ONE NEEDED A NEW PROBE

| id | plant | conviction |
|---|---|---|
| M1 | the row's declared source changed to a name absent from `RECEIPT_FIELD_ARITY` | A1 reds with the registry's own sentence, which is the conviction the registry header predicted in writing for exactly this row |
| M2 | the emitter re-derives a rate instead of copying it | A4 reds |
| M3 | a PII dim planted on the row | A5 reds in the registry pin and in the wall walker's schema arm |

⚠ **M2 IS THE ONE WORTH READING.** The fixture's rates are internally consistent —
each is `round(count/rows*1000)` — so a transform that divided the counts itself would
produce byte-identical output and every value equality would still pass. A consistent
fixture cannot tell copying from recomputing. The arm therefore hands the transform a
synthetic block whose rates disagree with its counts and asserts that the RECEIPT
wins: the emitter is a transform, not an auditor. Without that probe M2 would have been
a mutant nothing convicts, and the value-identity arm would have been decorative.

## §10 · HAZARDS AND NOTES

- ⚠ The registry header's row count read **"Eleven typed rows"** against a frozen array
  of twelve, from the §151.3 rider's landing until this member. A comment that
  miscounts its own array is the §320 class one level down: nothing reds and every
  later reader inherits it. Corrected here as a declared comment-only edit — and
  comment-only edits still fire ratchets, so it is priced, not free. The prose now
  names the arm it has to agree with.
- ⚠ The same §151.3 note's standing refusal to add address-chain rates is **superseded
  in place rather than deleted**: the gap it reported to the chair is the gap this row
  closes, and its reasoning is the record of why the closure needed a fingerprint move
  that had to be paid elsewhere.
- ⚠ A soak receipt whose years carry no `addressChain` yields no series for this
  family, and `freeze()` refuses to freeze a band family with no observed series. That
  refusal is correct and is stated here so it is not later read as a defect: a receipt
  that never ran the instrument may not freeze a band for it.
- ⚠ §102.3: none of this member's paths matches a `NAME_PATTERN` token, so no row is
  owed.
- ⚠ Census: no new test file, two titles, zero suite titles.
