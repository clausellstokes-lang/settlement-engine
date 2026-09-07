# Website / WEB-4 — the sim_address_chain registry row (member 4 of `W-A`)

- **Status:** LANDED
- **Implementation:** built by lane TE-WEB4 on 2026-08-22 at base `19b799ce` as
  `c558e2a3a3dde28a6604a532830315be678f8eb3`, rebased at the landing slot onto
  `4060f690` (WEB-1, the 27th landing) as `8a345910ca3bc5908970132454ec2e9fcb46c250`; the
  chair CASes the landing. Do not redispatch. ⚠ If the landing rebases, the census tuple in
  `tests/lint/sovereigntyLightingContract.walker.test.js` and this sha must be
  re-derived from the hash AFTER the last edit — never carried across a rebase.
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `4060f690036c79e1c6190cb052bdb221bde93cde`
- **Last revalidated:** 2026-08-22 at `4060f690036c79e1c6190cb052bdb221bde93cde` (the landing slot; authored and
  first validated at `19b799ce718d52e36a3b14a85fa9cfd5051ccf26`)
- **Landing note:** rebased by lane TE-WEB4-LANDING onto `4060f690`, four commits
  carried. The census tuple below and the walker's were RE-DERIVED at the slot by
  execution (slot `2,500/365/2,135/20,730/5,787` + this member's delta `+0/+0/+0/+2/+0`),
  never carried; the negative control with the slot's own tuple reds at `titles` with
  "expected 20732 to be 20730". See §12.
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
| estate census `titles` | 20,730 (slot) | 20,732 | two `it` arms in `tests/lib/simMetricEmitter.test.js`; authored as 20,719 → 20,721 at base `19b799ce`, the delta `+2` re-derived at the slot by execution |

`files`, `parked`, `credited` and `suiteTitles` do not move: no test file is minted and
no `describe` is opened. The census delta was attributed BY ISOLATION at the authoring base —
reverting that one file with the whole rest of the member applied convicts the before
figure green — and never by arithmetic. At the slot the delta, not the tuple, crossed the
rebase: H8B, MF-T2H and WEB-1 had re-recorded the walker under this member.

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

## §11 · GATE EVIDENCE (lane TE-WEB4, 2026-08-22)

**S0, two-part, both ends (at the BUILD base `19b799ce`; the slot reading is in §12).** At that base: exit `0`, printed
`observed-shape readers: 1996 finding(s), exactly matching the frozen inventory` —
WHOLE. At this member's HEAD: exit `0`, the identical line. The envelope neither
inherited a break nor made one; no generated prose leaf and none of the unscanned
files is in this member's change surface.

**The terminal — ONE full bare gate**, `npm run check:tail`, log identified by its
printed path and its pid lineage rather than by recency. Steps, in the `&&` chain's
own order:

| step | verdict |
|---|---|
| the eleven `validate:*` scripts | pass; `validate:packets` reported `145 packets (1 READY)` inside the gate |
| `typecheck:ratchet` | `OK — no type regressions (173 error(s), ceiling 173)` |
| `typecheck:domain:strict` | `no strict-type regressions (1134 errors, ceiling 1134)` |
| `lint` | pass (warnings only; the chain continued) |
| `test:ratchet` | `OK — no test regressions (11 known failure(s) of 28738 tests, ceiling 11)` — the banked ELEVEN sits at its ceiling and does not move |
| `build` + `postbuild` | built in 42.30s; 314 static route documents prerendered |
| `verify:dist` | ⚠ the mutex GAVE UP after 40 polls, held by another lane |

⚠ **THE GATE'S OWN EXIT WAS `3`, AND `3` IS THE MUTEX GIVING UP, NOT A RED.** Four
lanes were contending and the load average stood at 64 when `verify:dist` asked for
the lock. Every step before it had already passed, so the terminal was closed by
running that one step alone: `npm run verify:dist`, exit `0`, `STRICT DIST OK — 52
discovered/reported file(s), 433 test(s), zero failed/non-run/uncollected/missing/extra/
duplicate rows`. The distinction is recorded rather than smoothed over, because an
exit read as a red here would have cost a whole re-run of a green gate.

**Tail agreement.** The tail the wrapper printed and the full log body agree: the
give-up lines are the last thing in both, and the ratchet's OK line is present in the
body at the step the tail no longer reached.

**Pre-existing reds, looked up rather than assumed.** `npx vitest run tests/lint
tests/build` is red at this member AND at a clean base worktree of the same commit
with its own install. Five failures are stable at both trees — `clampPrimitiveBaseline`
(1), `warCostKindPools` (3), `warRulingKindPools` (1). The remainder VARY BY RUN at
both trees and in disjoint sets: the base's full sweep produced two `townScene3dLazy`
failures this lane never saw, and the lane's produced `postureNameCollision` and
`townSceneLocalMatrixAudit` failures the base did not. That is the recorded
varying-cast contamination whose hunt is already chartered, reproduced here at BASE
and therefore not this member's. No file in any red set is one this member touches,
and the estate ratchet — the instrument the gate actually runs — sits at its ceiling.
`tests/docs/enforcement-claims.test.js` is red identically at both trees, on the same
six banked rows in files this member does not touch; its own documents carry zero
claim-vocabulary hits, measured with the pattern lifted from the test.

**Mutants, each convicting a branch and each restored digest-exact** (`shasum -a 256`
before and after, identical): M1 → `sim_address_chain: source addressChain is not a
measured receipt field`; M2 → `expected 500 to be 999`; M3 →
`sim_address_chain: dim actor_id is PII-bearing`, in the registry pin and in the wall
walker's schema arm.

## §12 · THE LANDING SLOT (lane TE-WEB4-LANDING, 2026-08-22, slot `4060f690`)

**The rebase.** `git rebase --onto 4060f690 19b799ce`, detached, four commits carried
(implementation `8a345910ca3bc5908970132454ec2e9fcb46c250`, then DRAFT, READY, LANDED). Carry-proof at
BLOB level first: of the fourteen delivered paths exactly three had moved under the
member — the census walker (H8B, MF-T2H and WEB-1 re-recorded it), `PACKET_MANIFEST.json`
(150 rows at the slot) and `INDEX.md` (RR-2 at this row's anchor). Every other path is
the same blob at base and slot; `packets/website/` exists at the slot because WEB-1
founded it, so this packet is the family's second file, not its first.

**The surgery.** Walker: the slot's file byte-for-byte with this member's block appended
below WEB-1's. Manifest: the slot's bytes plus this row by string surgery, never
re-serialized; deep-compare 150 → 151, added `["WEB-4"]`, removed `[]`, drifted `[]`,
prefix and suffix byte-identical, the row differing from its authored form in exactly
`verifiedBase`. INDEX: the slot's file plus this row after RR-2's (the infrastructure
table's append order), one line added and none removed.

**The census, re-derived by execution, never carried.** Slot tuple read from the file,
`2,500/365/2,135/20,730/5,787`; this member's delta `+0/+0/+0/+2/+0`; the walker pinned at
`20,732` is green (33/33) under the shared gate mutex, and the negative control — the
slot's own tuple put back — reds at `titles` with "expected 20732 to be 20730", the
delta exactly, then the file restored byte-identical.

**S0 at the slot, two-part.** Part 1: `node scripts/check-observed-shape-readers.mjs`
exits `1` at the rebased tip with "observed-shape detector or unscanned execution input
changed since the schema-10 instrument was governed; an ordinary gate/write cannot
migrate the instrument" — and the SAME line, byte-identical (one sha256 across all
three logs), at the chair's clean baseproof `b10ed1a1` and at a throwaway worktree at
the exact slot `4060f690`. Pre-existing from the landed stack, mint-class, recorded not
cured; the §11 reading above was taken BEFORE the envelope broke. Part 2: the baseline
`scripts/.observed-shape-readers-baseline.json` is the same blob at slot and tip
(`frozenAtSha 4f42be70`), and this member cannot move the predicate: none of its fourteen
files is in the detector tree (11 files) or among the 24 unscanned execution inputs, and
none appears in the reader inventory at all.
