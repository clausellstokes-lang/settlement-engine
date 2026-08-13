# Corpus Coverage / AO-5 — the other four durable prose-family denominators

- **Status:** READY
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `972066affb82b002f197de7ce40ba3441dcd3220`
- **Last revalidated:** 2026-08-13 at terminal AO-4 record
  `972066affb82b002f197de7ce40ba3441dcd3220`.
- **Depends on:** AO-0 schema-8 genesis
  `e71beb84355666fe5508f61c0f9acdc516a97b79`, AO-2+3 zero bank
  `f0c272e894f3f4d4edbd7fd1dac4c65580f87e52`, AO-4 implementation
  `09e39ee65f8bfeccb1eb9684c15c5d06fa308ccb`, its terminal record
  `972066affb82b002f197de7ce40ba3441dcd3220`, and CR-AO-1/4/9/10 plus the
  AO-4 -> AO-5 -> AO-6 order in the owner ledger.
- **Collision group:** the estate-wide lighting census. AO-5 is the sole holder.
- **Commit authority:** the coding agent edits only the eight manifest paths, leaves all
  changes unstaged and uncommitted, and does not promote. The coordinator constructs,
  proves, and old-value-CAS lands one green implementation commit, then records terminal
  packet state separately.
- **Baseline posture:** exact in both directions. All 63 family/path/field identities and
  their distinct-value and occurrence counts are frozen without slack. New, grown, shrunk,
  vanished, renamed, malformed, duplicate, or reordered rows fail until a separately
  governed bank records earned movement.
- **Declared behavior shift:** **NONE.** This is a read-only corpus contract. No producer,
  persisted record, rendered prose, ID, timestamp, order, flag, tuning value, golden, or
  product output changes.
- **Census reservation:** one new credited test file with exactly eight literal `it` titles
  and one literal `describe` title predicts
  `2411/365/2046/19976/5637 -> 2412/365/2047/19984/5638`. Re-derive the whole tuple;
  never forward-add if execution differs.

## 1. Reconciled authority and the ambiguity closed

CR-AO-1 makes AO-0's executed opt-in scalar stream the instrument. CR-AO-4 requires exact
identity and count movement in both directions. CR-AO-9 limits each family to one shipped
authoritative seam: the deterministic post-pulse `prepareAuthoritativeCanonEvent` result;
the already-produced `pulseResult.regionalGraph.eventLog`; final
`worldState.pulseHistory`; and the pure `createChronicleEntry` -> `appendChronicleEntry`
road shaped as `aiData.chronicle[]`. CR-AO-10 keeps this a second consumer only: no
`foldCorpus`, default observed-shape artifact, or baseline participation, and no volatile
ID/time projection.

The charter's phrase *"the other four families ... narrativeSummary, regionalGraph,
pulseHistory, chronicles"* is resolved as follows:

1. **timeline** — the authoritative settlement timeline entry, whose prose leaf is
   `narrativeSummary`;
2. **pulseHistory** — the twelve durable world-pulse records;
3. **regionalLog** — the 109 typed regional audit rows already emitted by the pulse;
4. **chronicle** — the one pure AI Chronicle create-and-append row.

`narrativeSummary` is a field in timeline, not a fifth family. Flat flavor-event rows and
`campaign.chronicles[]` remain explicitly deferred by CR-AO-9. The latter still requires
caller-supplied AI prose, wall clock, persistence, analytics, and store state. AO-5 neither
simulates nor mirrors those roads.

The charter's historical `narrativeSummary` authoring census (`11` sites / `7` files) is
reconnaissance, not a denominator. A live literal scan at this base finds `11` text matches
across `8` files, two of which are type/JSDoc lines. CR-AO-9 supersedes that source scan by
selecting the single authoritative canon seam above; neither the historical nor live source
match count may be substituted for the canonical timeline rows.

AO-4 is terminal. Its headline rewrite liveness excludes `consequenceOutcomes` because that
compatibility window overlaps its occurrence-disjoint public and state-only receipt lanes.
AO-5 has a different denominator: it inventories every selected scalar address physically
present in `pulseHistory`, so it includes `consequenceOutcomes` as a path-local coverage row
without calling it a third liveness lane.

At the verified base, three fresh executions reproduced the same AO-0 substrate; the last
execution immediately before promotion measured:

```text
scalar rows                              26,076
canon nextEventLog entries                    1
Wizard News final / accumulated / unique 240 / 1,567 / 272
pulseHistory records                         12
regional event rows / unique IDs         109 / 109
AI Chronicle rows                              1
```

One corpus build feeds two pure AO-5 reconstructions, and those reconstructions must be
byte-identical.

## 2. Outcome and explicit non-goals

AO-5 creates one finite, read-only contract over the four remaining AO-0 families:

1. select only their exact authoritative typed paths from AO-0 scalar rows;
2. normalize array positions only after validating the original typed addresses;
3. freeze every observed `(family, normalized path, selected field)` identity and both
   exact counts;
4. make regional-log zero-prose a positive structural fact rather than a vacuous omission;
5. extend the existing `HZ-CROSSHOME` pre-mortem substrate mechanically without making
   the Wizard-News helper own these families; and
6. reconcile mutation rationale and the one moved lighting census.

Explicitly out:

- any producer cure, prose rewrite, voice/modal classifier, AI/model judgment, fuzzy grammar,
  tone/quality/repetition policy, or source-authoring census;
- AO-6's standing mutant battery;
- flat settlement flavor events, rename/destroy/table rows, `campaign.chronicles[]`, another
  regional producer, or any fifth family;
- treating path-local aliases as unique authored prose or treating `consequenceOutcomes` as
  AO-4 liveness;
- any `src/**` edit, persisted shape/key, UI, public/DM projection, golden, flag, tuning value,
  dependency, global timeout, floor, ceiling, OSR scanner/artifact/baseline, test-ratchet
  baseline, mutation sweep, hazard status/count/floor, or ninth implementation path.

Adjacent observations are receipt-only unless they disprove a premise, which is a STOP.

## 3. Exact selector, normalization, and count law

Create `scripts/lib/prose-family-contract.mjs` as pure infrastructure. It imports no product
producer, reads or writes no file, and exports exactly the following public surface:

```js
export const PROSE_FAMILY_PROTECTED_SUBSTRATE
export function deriveProseFamilyContract(scalarRows, scalarMeta)
export function proseFamilyRowsSha256(rows)
export function validateProseFamilyBaseline(value)
export function compareProseFamilyRows(liveRows, frozenRows)
```

`deriveProseFamilyContract` returns exactly:

```js
{
  corpus,
  familyTotals,
  rows,
  rowsSha256,
  totals,
}
```

### 3.1 Input and family selection

Require `scalarRows` to be a nonempty array. Every selected row must have exactly
`root`, `rootOrdinal`, `path`, and `value`; `root` is nonblank, `rootOrdinal` is a
nonnegative safe integer, `path` is a nonempty typed-segment array, and `value` is either
exact `null` or a nonblank string. A field segment is exactly
`{ kind:'field', value:nonblank string }`; an
index segment is exactly `{ kind:'index', value:nonnegative safe integer }`. Extra keys,
malformed segments, sparse/impossible selector-owned record axes, blank strings, numbers, booleans, arrays,
objects, `undefined`, or duplicate exact addresses fail. The live 5,885-row denominator
contains exactly 188 lawful null scalar occurrences: 148 at
`impactDigest[].channelType`, 30 at `mechanicalRumorSeeds[].channelType`, five at
`consequenceOutcomes[].type`, four at `mechanicalOutcomes[].type`, and one at
`selectedOutcomes[].type`. Null is data, not absence, and remains one exact distinct value
in each affected identity.

The full AO-0 root order is part of the executed instrument: `pulseResult` ordinals are
exactly `0..11`, `worldState` is ordinal `12`, `wizardNews` is ordinal `13`,
`canonEventResult` is ordinal `14`, and `aiChronicle` is ordinal `15`. Select only:

| Family | Exact selector | Required record reach |
|---|---|---:|
| `timeline` | root `canonEventResult`; first segment field `nextEventLog` | exact entry index `0` |
| `pulseHistory` | root `worldState`; first segment field `pulseHistory` | exact record indexes `0..11` |
| `regionalLog` | root `pulseResult`; first two fields `regionalGraph`, `eventLog` | 109 `(rootOrdinal,eventIndex)` rows, corroborated by 109 unique IDs in scalar meta |
| `chronicle` | root `aiChronicle` | exact entry index `0` |

Wizard News rows may prove root topology but never enter an AO-5 family. Any selected row
containing a volatile field from AO-0's `VOLATILE_SCALAR_KEYS` fails. Every family must be
nonempty, and the only family names are the four displayed above.

The scalar projection intentionally omits array elements that carry no selected vocabulary.
Contiguity is therefore enforceable only on the selector-owned record axes named in the table:
timeline entry zero, pulse-history records `0..11`, Chronicle entry zero, and regional
109/109 record reach. Do not infer contiguity for nested arrays such as
`rollExplanations[]`; a missing projected nested index does not prove a sparse producer array.

### 3.2 Normalized identity and scalar-occurrence caveat

After validating the original address, replace every index segment with literal `[]` and
render fields in dot/bracket notation. Field spellings containing `.`, `[` or `]` are
rejected so structure cannot collide with authored text. Examples:

```text
[{field:nextEventLog},{index:0},{field:narrativeSummary}]
  -> nextEventLog[].narrativeSummary

[{index:0},{field:aiDailyLife},{field:summary}]
  -> [].aiDailyLife.summary
```

`field` is the last field segment, scanning backward, whose spelling belongs to
`OBSERVED_SCALAR_FIELDS`. Absence is malformed. Row identity is the collision-proof internal
tuple `family + NUL + path + NUL + field`. For each identity, `distinctValues` is the size of
the collision-safe exact scalar set keyed by `JSON.stringify(value)`; exact null is therefore
distinct from every admitted string. `occurrences` retains every selected AO-0 scalar row.
Emit exact objects, in this insertion order:

```js
{ family, path, field, distinctValues, occurrences }
```

Sort rows by codepoint order of the internal identity. Do not use locale sort, object spread,
or an object keyed by identity; the latter erases duplicates during JSON parsing.

**Occurrence is an address count, not an authorship claim.** The same producer value can be
persisted at `selectedOutcomes`, its overlapping `consequenceOutcomes` compatibility view,
and an `impactDigest`; each is a distinct durable scalar address and each occurrence remains.
Do not deduplicate values across paths or sum these rows as unique events/prose. In particular,
5,885 is the selected path-local scalar volume, not 5,885 unique narrative records.

### 3.3 Canonical bytes and exact baseline envelope

Canonical row serialization is UTF-8 `JSON.stringify(rows)` with no whitespace or final
newline and the displayed row key order. At this base it is exactly **8,280 bytes** with
SHA-256:

```text
8f83fa6ca2fc1411376220e55235ea392e76d98596f1bfd8c3eb52480b8469ae
```

The baseline has exactly these keys and no update mode or writer:

```json
{
  "schemaVersion": 1,
  "corpus": {
    "scalarRows": 26076,
    "canonEventLogEntries": 1,
    "wizardNewsFinalEntries": 240,
    "wizardNewsAccumulatedEntries": 1567,
    "wizardNewsUnique": 272,
    "pulseHistory": 12,
    "regionalEventLog": 109,
    "regionalEventLogUnique": 109,
    "aiChronicle": 1
  },
  "familyTotals": [
    { "family": "chronicle", "identities": 7, "distinctValues": 7, "occurrences": 7 },
    { "family": "pulseHistory", "identities": 50, "distinctValues": 1286, "occurrences": 5665 },
    { "family": "regionalLog", "identities": 2, "distinctValues": 7, "occurrences": 201 },
    { "family": "timeline", "identities": 4, "distinctValues": 8, "occurrences": 12 }
  ],
  "rows": "the exact 63-row array in section 4",
  "rowsSha256": "8f83fa6ca2fc1411376220e55235ea392e76d98596f1bfd8c3eb52480b8469ae",
  "totals": { "families": 4, "identities": 63, "distinctValues": 1308, "occurrences": 5885 }
}
```

The real JSON stores the array, not the explanatory string above. Validation requires exact
envelope and row keys, schema 1, codepoint order, unique identities, positive safe counts,
`occurrences >= distinctValues`, exact corpus/family/overall totals, and a recomputed digest.
`compareProseFamilyRows` compares live and frozen maps in both directions and throws a message
naming live and frozen values for every new, vanished, grown, or shrunk identity. It returns
`true` only on exact equality. Digest agreement corroborates but never replaces row validation
and comparison.

## 4. Exact 63-row denominator

| Family | Normalized path | Field | Distinct | Occurrences |
|---|---|---|---:|---:|
| `chronicle` | `[].aiDailyLife.summary` | `summary` | 1 | 1 |
| `chronicle` | `[].aiSettlement.thesis` | `thesis` | 1 | 1 |
| `chronicle` | `[].mode` | `mode` | 1 | 1 |
| `chronicle` | `[].reason` | `reason` | 1 | 1 |
| `chronicle` | `[].summaryText` | `summaryText` | 1 | 1 |
| `chronicle` | `[].thesis` | `thesis` | 1 | 1 |
| `chronicle` | `[].triggeredBy` | `triggeredBy` | 1 | 1 |
| `pulseHistory` | `pulseHistory[].consequenceOutcomes[].headline` | `headline` | 81 | 240 |
| `pulseHistory` | `pulseHistory[].consequenceOutcomes[].metadata.pressureEvidence.kind` | `kind` | 1 | 4 |
| `pulseHistory` | `pulseHistory[].consequenceOutcomes[].metadata.resourceTaxonomy.kind` | `kind` | 1 | 1 |
| `pulseHistory` | `pulseHistory[].consequenceOutcomes[].metadata.resourceTaxonomy.type` | `type` | 1 | 1 |
| `pulseHistory` | `pulseHistory[].consequenceOutcomes[].populationDeltas[].reason` | `reason` | 2 | 41 |
| `pulseHistory` | `pulseHistory[].consequenceOutcomes[].proposalPayload.kind` | `kind` | 3 | 11 |
| `pulseHistory` | `pulseHistory[].consequenceOutcomes[].proposalPayload.reason` | `reason` | 3 | 4 |
| `pulseHistory` | `pulseHistory[].consequenceOutcomes[].reasons[]` | `reasons` | 133 | 542 |
| `pulseHistory` | `pulseHistory[].consequenceOutcomes[].stressor.type` | `type` | 3 | 8 |
| `pulseHistory` | `pulseHistory[].consequenceOutcomes[].summary` | `summary` | 94 | 240 |
| `pulseHistory` | `pulseHistory[].consequenceOutcomes[].type` | `type` | 9 | 240 |
| `pulseHistory` | `pulseHistory[].corruptionEvents[].kind` | `kind` | 1 | 3 |
| `pulseHistory` | `pulseHistory[].impactDigest[].channelType` | `channelType` | 1 | 148 |
| `pulseHistory` | `pulseHistory[].impactDigest[].headline` | `headline` | 84 | 148 |
| `pulseHistory` | `pulseHistory[].impactDigest[].impactKind` | `impactKind` | 31 | 148 |
| `pulseHistory` | `pulseHistory[].impactDigest[].kind` | `kind` | 2 | 148 |
| `pulseHistory` | `pulseHistory[].impactDigest[].reasons[]` | `reasons` | 126 | 310 |
| `pulseHistory` | `pulseHistory[].impactDigest[].scope` | `scope` | 2 | 148 |
| `pulseHistory` | `pulseHistory[].impactDigest[].summary` | `summary` | 89 | 148 |
| `pulseHistory` | `pulseHistory[].impactDigest[].tags[]` | `tags` | 40 | 591 |
| `pulseHistory` | `pulseHistory[].mechanicalOutcomes[].headline` | `headline` | 24 | 77 |
| `pulseHistory` | `pulseHistory[].mechanicalOutcomes[].populationDeltas[].reason` | `reason` | 2 | 40 |
| `pulseHistory` | `pulseHistory[].mechanicalOutcomes[].reasons[]` | `reasons` | 44 | 183 |
| `pulseHistory` | `pulseHistory[].mechanicalOutcomes[].summary` | `summary` | 31 | 77 |
| `pulseHistory` | `pulseHistory[].mechanicalOutcomes[].type` | `type` | 3 | 77 |
| `pulseHistory` | `pulseHistory[].mechanicalRumorSeeds[].channelType` | `channelType` | 1 | 30 |
| `pulseHistory` | `pulseHistory[].mechanicalRumorSeeds[].headline` | `headline` | 21 | 30 |
| `pulseHistory` | `pulseHistory[].mechanicalRumorSeeds[].impactKind` | `impactKind` | 6 | 30 |
| `pulseHistory` | `pulseHistory[].mechanicalRumorSeeds[].kind` | `kind` | 1 | 30 |
| `pulseHistory` | `pulseHistory[].mechanicalRumorSeeds[].reasons[]` | `reasons` | 42 | 79 |
| `pulseHistory` | `pulseHistory[].mechanicalRumorSeeds[].scope` | `scope` | 1 | 30 |
| `pulseHistory` | `pulseHistory[].mechanicalRumorSeeds[].summary` | `summary` | 26 | 30 |
| `pulseHistory` | `pulseHistory[].mechanicalRumorSeeds[].tags[]` | `tags` | 10 | 120 |
| `pulseHistory` | `pulseHistory[].resolvedStressors[].type` | `type` | 1 | 1 |
| `pulseHistory` | `pulseHistory[].rollExplanations[].proposalPayload.kind` | `kind` | 3 | 24 |
| `pulseHistory` | `pulseHistory[].rollExplanations[].proposalPayload.reason` | `reason` | 3 | 7 |
| `pulseHistory` | `pulseHistory[].selectedOutcomes[].headline` | `headline` | 80 | 151 |
| `pulseHistory` | `pulseHistory[].selectedOutcomes[].metadata.pressureEvidence.kind` | `kind` | 1 | 4 |
| `pulseHistory` | `pulseHistory[].selectedOutcomes[].metadata.resourceTaxonomy.kind` | `kind` | 1 | 1 |
| `pulseHistory` | `pulseHistory[].selectedOutcomes[].metadata.resourceTaxonomy.type` | `type` | 1 | 1 |
| `pulseHistory` | `pulseHistory[].selectedOutcomes[].populationDeltas[].reason` | `reason` | 1 | 1 |
| `pulseHistory` | `pulseHistory[].selectedOutcomes[].proposalPayload.kind` | `kind` | 3 | 11 |
| `pulseHistory` | `pulseHistory[].selectedOutcomes[].proposalPayload.reason` | `reason` | 3 | 4 |
| `pulseHistory` | `pulseHistory[].selectedOutcomes[].reasons[]` | `reasons` | 126 | 319 |
| `pulseHistory` | `pulseHistory[].selectedOutcomes[].stressor.type` | `type` | 3 | 8 |
| `pulseHistory` | `pulseHistory[].selectedOutcomes[].summary` | `summary` | 88 | 151 |
| `pulseHistory` | `pulseHistory[].selectedOutcomes[].type` | `type` | 8 | 151 |
| `pulseHistory` | `pulseHistory[].timeTicks[].summary[]` | `summary` | 42 | 864 |
| `pulseHistory` | `pulseHistory[].warTerminationReads[].kind` | `kind` | 1 | 5 |
| `pulseHistory` | `pulseHistory[].warTerminationReads[].reason` | `reason` | 2 | 5 |
| `regionalLog` | `regionalGraph.eventLog[].changes[].kind` | `kind` | 6 | 92 |
| `regionalLog` | `regionalGraph.eventLog[].sourceEvent.type` | `type` | 1 | 109 |
| `timeline` | `nextEventLog[].event.cause` | `cause` | 1 | 1 |
| `timeline` | `nextEventLog[].event.type` | `type` | 1 | 1 |
| `timeline` | `nextEventLog[].factionRelationshipDeltas[].reason` | `reason` | 5 | 9 |
| `timeline` | `nextEventLog[].narrativeSummary` | `narrativeSummary` | 1 | 1 |
| **TOTAL** |  |  | **1,308** | **5,885** |

Family closures are exact:

| Family | Identities | Distinct | Occurrences |
|---|---:|---:|---:|
| `timeline` | 4 | 8 | 12 |
| `pulseHistory` | 50 | 1,286 | 5,665 |
| `regionalLog` | 2 | 7 | 201 |
| `chronicle` | 7 | 7 | 7 |
| **All** | **63** | **1,308** | **5,885** |

## 5. Family-specific laws and authoritative seams

### 5.1 Timeline

The sole observed road is AO-0's post-pulse `prepareAuthoritativeCanonEvent` call with fixed
`CUT_TRADE_ROUTE`, target `Observed North Road`, cause `player_action`, fixed `now`, canon
phase, and empty input log. Require `ok === true`, one `nextEventLog[0]`, exact event type and
cause, one nonblank `narrativeSummary`, and the 4/8/12 table above. The nine
`factionRelationshipDeltas[].reason` occurrences with five values remain occurrences; do not
collapse them into one event-level reason. Flat destroy, rename, table, pending-edit, or flavor
rows are absent by CR-AO-9 and may not be introduced here.

### 5.2 Pulse history

The sole observed state is final `worldState.pulseHistory`, exactly indexes `0..11`. Its live
writer chain is `pulseKernel` -> `appendPulseHistoryWithProvenance` -> `appendPulseHistory`,
with `collapseIntervalHistory` and `warTermination` as the two explicit alternate homes that
must remain in the protected substrate. Close at 50/1,286/5,665.

The three headline aliases are coverage facts:

```text
consequenceOutcomes  240 occurrences / 81 distinct
mechanicalOutcomes    77 occurrences / 24 distinct
selectedOutcomes     151 occurrences / 80 distinct
```

These figures do not amend AO-4's 228-occurrence disjoint liveness union. The consequence row
is an overlapping compatibility view and never a third rewrite lane.

### 5.3 Regional log structural zero

The regional family is reached, not empty: twelve pulse roots yield 109 audit records with
109 unique IDs. IDs and times remain excluded. Its entire selected scalar shape is two rows:
92 `changes[].kind` occurrences across six values and 109 `sourceEvent.type` occurrences at
one value, totaling 2/7/201.

The observed regional family has exactly **zero** rows whose selected field is any of:

```text
headline narrativeSummary reason reasons summary summaryText thesis triggeredBy
```

That zero is a structural assertion beside the positive 109/109 reach, not a prose judgment
and not vacuity. AO-5 must not invent a regional narrative. A later regional prose leaf is a
new identity and reds until separately governed.

### 5.4 Pure AI Chronicle

The only road is one pure `createChronicleEntry` followed by `appendChronicleEntry([], entry)`.
Require entry index zero and exactly seven identities/values/occurrences:
`aiDailyLife.summary`, `aiSettlement.thesis`, `mode`, `reason`, `summaryText`, `thesis`, and
`triggeredBy`. Pin the deterministic inputs and derived values: mode `full`, reason
`progression`, thesis and summaryText `Observed settlement thesis`, daily-life summary
`Observed daily life summary`, and trigger `observed-shape-corpus`. `id` and `createdAt` are
absent. `campaign.chronicles[]` is rejected as out of scope.

## 6. HZ-CROSSHOME, protected union, mutation, and census

`PROSE_FAMILY_PROTECTED_SUBSTRATE` is a codepoint-sorted frozen array containing exactly the
AO-0 scalar seam, this helper and baseline, and the authoritative writer/normalizer homes:

```text
scripts/lib/observed-shape-corpus.mjs
scripts/lib/prose-family-contract.mjs
src/domain/events/applyEvent.js
src/domain/events/eventPipeline.js
src/domain/events/prepareCanonEvent.js
src/domain/events/registry.js
src/domain/region/graph.js
src/domain/region/propagation.js
src/domain/worldPulse/advanceInterval.js
src/domain/worldPulse/provenanceKernel.js
src/domain/worldPulse/pulseKernel.js
src/domain/worldPulse/warTermination.js
src/domain/worldPulse/worldState.js
src/lib/chronicle.js
tests/lint/.prose-family-contract-baseline.json
```

Do **not** edit `NEWS_VOICE_PROTECTED_SUBSTRATE`. Generalize the existing parser in
`premortem-triggers.mjs` so `cross-home-voice-substrate-touched` derives a codepoint-sorted,
duplicate-free union of the existing News export and the new prose-family export. Its
`sources`, population label, `what`, warning, evidence, and synthetic case must truthfully name
both contracts. The warning instructs a rerun of AO-0 and comparison of both governed
baselines; it must not keep saying every item is Wizard News or only seven applied summaries.

`HZ-CROSSHOME` remains the same ten-key class with status `MACHINERY`,
`acceptedReason: null`, `inChain: true`, and `instances: 53`. Add only the AO-5 walker,
helper, and baseline to enforcers, and generalize note/triggers. The regional 109 rows are not
54 new historical prose defects. Hazard class count, status floors, and predicate count do not
move.

AO-4's existing `newsHeadlineContract.walker.test.js` A7 compatibility case currently pins
both that predicate population to the News-only array and the pre-AO-5 census tuple. Amend
those two assertions in place—without a title, file, or additional census change—to import
`PROSE_FAMILY_PROTECTED_SUBSTRATE`, require the same codepoint-sorted duplicate-free union,
and require the exact AO-5 tuple `2412/365/2047/19984/5638`. These are compatibility pins for
already-required AO-5 movement, not a ninth acceptance case.

Add one `kind:"rationale"` mutation-manifest entry for the eight ordinary AO-5 controls.
AO-6 owns standing source mutants; do not touch `mutation-sweep.sh` or `uncoveredBaseline`.

The new walker contains exactly one literal `describe` and eight literal `it` registrations,
all straight-line and credited. No existing title changes. Re-derive the whole lighting census;
the sole authorized movement is:

```text
files / parked / credited / titles / suiteTitles
2411 / 365 / 2046 / 19976 / 5637
2412 / 365 / 2047 / 19984 / 5638
```

The tolerant test-ratchet scope needs no baseline movement. Any different tuple is a STOP.

## 7. Hard scope and exact eight-path manifest

| Limit | AO-5 budget |
|---|---:|
| Behavior families | 1 — exact totality for AO-5's four chartered corpus families |
| Handwritten paths | exactly 8 |
| Product or persisted files modified | 0 |
| New logic-bearing leaves | 1 pure helper, at most 250 effective lines |
| New test walker | 1, at most 250 effective lines |
| Existing logic-bearing files modified | 1 — pre-mortem union only |
| `premortem-triggers.mjs` delta | at most 15 effective lines |
| Additional registration-only files | 3 — hazard, mutation, census |
| New test files / registrations | exactly 1 / exactly 1 `describe` + 8 `it` |
| Persisted families, flags, surfaces, consumers | 0 |
| Acceptance cases | exactly 8 |

Overrides approved before dispatch: the one behavior contract intentionally contains the four
families the adopted AO-5 charter names together. It creates no four product behaviors, writers,
or surfaces. No other default budget is widened.

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| CREATE | `scripts/lib/prose-family-contract.mjs` | protected substrate, selector, derivation, digest, validation, comparator | 250 effective | Implement sections 3–6 purely; no product import or file write. |
| CREATE | `tests/lint/.prose-family-contract-baseline.json` | exact schema-1 envelope | one baseline | Store the exact 63 rows, totals, corpus meta, byte count law, and digest; no update mode. |
| CREATE | `tests/lint/proseFamilyContract.walker.test.js` | one `describe`, eight `it`, one corpus `beforeAll` | 250 effective / 8 tests | Build AO-0 once with a local `900_000 ms` hook budget; reconstruct twice; execute A1–A8. |
| MODIFY | `scripts/hazard-registry.json` | `HZ-CROSSHOME` only | one class | Add three enforcers and generalized exact wording; preserve keys/status/reason/instances/floors/class count. |
| MODIFY | `scripts/lib/premortem-triggers.mjs` | protected-substrate parser and existing predicate only | 15 effective | Derive the exact two-export union and make population/warning/evidence/synthetic accurate; no new predicate. |
| MODIFY | `scripts/mutation-coverage-manifest.json` | AO-5 walker invariant | one row | Add one rationale; do not reserialize or move `uncoveredBaseline`. |
| TEST | `tests/lint/sovereigntyLightingContract.walker.test.js` | `CENSUS` plus dated cause | five values | Re-derive whole; record only the exact movement execution returns. |
| TEST | `tests/lint/newsHeadlineContract.walker.test.js` | existing A7 pre-mortem population and census assertions only | zero titles | Replace the News-only equality with the exact codepoint-sorted two-export union and restamp its census literal to `2412/365/2047/19984/5638`; no other case or assertion moves. |

Generated artifacts: **NONE**. No other file may be edited. A ninth implementation path or
ninth test case is a STOP and split.

## 8. Ordered coding sequence

1. Dispatch and seal at the clean promotion descendant; prove 30 packets / 1 READY, exact
   target cleanliness, three CREATE targets absent, and census base
   `2411/365/2046/19976/5637`.
2. Run one AO-0 scalar build and reproduce section 1, all 63 rows, 8,280 bytes, the digest,
   family totals, structural-zero regional law, and root ordinals before editing.
3. Create the pure helper and exact baseline; create the eight-case walker with one expensive
   `beforeAll`, one corpus build, and two pure reconstructions.
4. Extend `HZ-CROSSHOME`; generalize the existing pre-mortem parser/predicate to the union;
   amend AO-4's existing A7 population assertion to that exact union and its census assertion
   to the re-derived AO-5 tuple; add the mutation rationale; re-derive and record the whole census.
5. Run all focused checks and leave exactly eight paths unstaged and uncommitted for the
   coordinator. Do not create an authored red commit.

No cure or genesis follows. The pre-edit tree is already green and the finished eight-path
contract is one ordinary green implementation commit.

## 9. Closed acceptance denominator

| ID | Required observation |
|---|---|
| A1 | One AO-0 scalar build feeds two byte-identical pure reconstructions; exact root ordinals, 26,076 rows, and scalar meta `1 / 240 / 1,567 / 272 / 12 / 109 / 109 / 1` close with no Wizard News row entering an AO-5 family and no volatile field entering selection. |
| A2 | Exact typed selectors partition only timeline, pulseHistory, regionalLog, and chronicle; exact null is accepted and retained as a distinct scalar value, while malformed/extra segment keys, unsafe selector-axis indexes, duplicate exact addresses, delimiter collisions, blank strings, non-null non-string selected values, absent families, and a fifth family fail before normalization; omitted nested scalar indexes are not misclassified as sparse producer arrays. |
| A3 | The exact 63-row table closes at 1,308 distinct / 5,885 occurrences, canonical serialization is 8,280 bytes with SHA-256 `8f83fa6ca2fc1411376220e55235ea392e76d98596f1bfd8c3eb52480b8469ae`, and validation/comparison reject new, grown, shrunk, vanished, renamed, malformed, duplicate, reordered, or digest-counterfeit rows. |
| A4 | Timeline is the one deterministic authoritative `CUT_TRADE_ROUTE` event with `player_action`, one `nextEventLog` row, nonblank `narrativeSummary`, and exact 4/8/12 counts; flat flavor/rename/destroy/table roads are absent. |
| A5 | Pulse history is exactly records `0..11` and 50/1,286/5,665; selected headlines are 151/80, mechanical 77/24, and consequence 240/81, with consequence explicitly pinned as a path-local compatibility alias rather than a third AO-4 liveness lane. |
| A6 | Regional log reaches 12 pulse roots and 109/109 audit rows, closes at 2/7/201, pins 92/6 changes kinds plus 109/1 source types, and has exactly zero selected prose-field identities without inventing prose. |
| A7 | Chronicle is exactly one pure create-and-append row and 7/7/7 with fixed mode/reason/thesis/summary/trigger values; ID/time are absent and `campaign.chronicles[]` is not selected. |
| A8 | Baseline fail-closed polarities, unchanged HZ-CROSSHOME identity/count/status, two-export pre-mortem union plus both amended AO-4 A7 compatibility assertions and synthetic fire, mutation rationale, exact census, exact eight paths, focused checks, both typechecks, observed-shape guard, and bare full gate all reconcile at one clean immutable implementation commit. |

No ninth case is investigated. An adjacent finding is reported without repair unless it
invalidates A1–A8, in which case stop.

## 10. Verification commands

Focused Vitest runs only through the mutex:

```sh
npm run validate:packets
npm run validate:hazard-registry
npm run validate:premortem
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/proseFamilyContract.walker.test.js \
  tests/lint/newsHeadlineContract.walker.test.js \
  tests/lint/newsVoiceContract.walker.test.js \
  tests/lint/observedShapeCorpus.graph.test.js \
  tests/lint/observedShapeReaders.walker.test.js \
  tests/domain/prepareCanonEvent.test.js \
  tests/domain/worldPulseRecordModes.test.js \
  tests/domain/worldPulseChronicleCuration.test.js \
  tests/domain/regionalGraph.test.js \
  tests/domain/regionalPropagationDedupe.test.js \
  tests/domain/regionalEventLogBounds.test.js \
  tests/lib/chronicle.test.js \
  tests/lint/hazardRegistryFailClosed.test.js \
  tests/lint/mutationCoverageManifest.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js
npx eslint \
  scripts/lib/prose-family-contract.mjs \
  scripts/lib/premortem-triggers.mjs \
  tests/lint/proseFamilyContract.walker.test.js \
  tests/lint/newsHeadlineContract.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run check:observed-shape-readers
npm run check:tail
```

`npm run check:tail` is bare, never mutex-wrapped or piped. The final landing authority is the
full 17-step gate at the coordinator-created immutable commit, not a focused subset or a sealed
receipt heartbeat.

## 11. Ordinary one-commit lifecycle

1. The coordinator commits this packet, index row, and manifest row as one three-document
   READY promotion from clean terminal AO-4.
2. Dispatch seals that clean promotion descendant after the exact preflight in section 8.
3. The coding agent edits exactly eight paths and leaves them unstaged/uncommitted.
4. The coordinator audits scope and effective lines, then uses a private index to construct one
   direct green child of the sealed promotion without moving the shared ref.
5. A fresh detached worktree proves focused checks and the bare full gate. Only then does one
   old-value CAS expose the green implementation. A CAS mismatch discards the commit and
   recompiles against the actual parent.
6. A separate coordinator three-document commit records packet/index/manifest LANDED state,
   validates 30 packets / 0 READY, and releases the census row.

Implementation and terminal record are not squashed. No red commit, generated baseline genesis,
staging by the coding agent, merge, checkout/reset, stash, or partial promotion is authorized.

## 12. Mandatory STOP conditions

STOP and report the smallest measured contradiction if:

- HEAD is not a clean admissible descendant of terminal AO-4, the manifest is not 30/1 at
  dispatch, any target is foreign-dirty, or a CREATE target exists;
- any scalar-meta value, root ordinal, 63-row identity/count, family total, 8,280-byte length,
  digest, timeline/pulse/regional/Chronicle premise, 109/109 reach, or regional structural zero
  differs;
- an authoritative seam needs a product/source edit, a second AO-0 build inside the walker, a
  fifth family, flat flavor rows, `campaign.chronicles[]`, or another regional producer;
- `consequenceOutcomes` must become a third distinct AO-4 liveness lane, or cross-path aliases
  must be deduplicated to make a claim close;
- a generic modal/voice/AI classifier, prose quality judgment, source scan, volatile ID/time,
  malformed tolerance, automatic baseline writer, or update flag is needed;
- any `src/**` product output, persisted shape/key/order, golden, flag, tuning, dependency,
  timeout, floor, ceiling, OSR artifact/baseline, test-ratchet baseline, hazard class/status/
  instances/floor, pre-mortem predicate count, mutation uncovered count, or global JSON
  serialization moves;
- the helper or walker exceeds 250 effective lines, pre-mortem delta exceeds 15, a ninth
  implementation path or ninth case is needed, or census differs from
  `2412/365/2047/19984/5638`;
- any required symbol/substrate drifts, any A1–A8 or gate check is nonzero, the shared ref moves,
  or old-value CAS fails.

Do not repair the contradiction, edit the packet, widen scope, or continue to AO-6. The STOP
report names the exact observed and expected values and proposes the smallest split.

## 13. Completion receipt

Report sealed parent and final SHA; exact eight paths and effective-line deltas; one-build/two-
reconstruction receipt; root ordinals and scalar meta; exact 63/1,308/5,885 totals, family
totals, 8,280 bytes and digest; timeline/pulse/regional/Chronicle closures; regional zero-prose;
scalar-alias caveat; A1–A8; every command/exit/count; both typechecks; observed-shape guard;
bare full-gate true exit; census; unchanged hazard identity/count/status; pre-mortem union and
synthetic; mutation rationale; generated artifacts `NONE`; product/persisted/golden/flag/tuning/
dependency/baseline movement `NONE`; deviations and judgment calls `NONE`; and adjacent
observations without investigation.
