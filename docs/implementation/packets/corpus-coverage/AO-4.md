# Corpus Coverage / AO-4 — complete news-address totality and rewrite liveness

- **Status:** READY
- **Packet version:** `4`
- **Verified base:** `claude/composite-r4` at `ba6a2913c3a01242d94a0f1eb6c2cc8cf858c423`
- **Last revalidated:** 2026-08-13 at `ba6a2913c3a01242d94a0f1eb6c2cc8cf858c423`
- **Depends on:** AO-0 schema-8 genesis `e71beb84355666fe5508f61c0f9acdc516a97b79`,
  AO-2+3 zero-bank `f0c272e894f3f4d4edbd7fd1dac4c65580f87e52`, and terminal
  record `ba6a2913c3a01242d94a0f1eb6c2cc8cf858c423`; CR-AO-1/4 and the
  §18/§21 order in the ledger.
- **Collision group:** the estate-wide lighting census; AO-4 is its sole current holder.
- **Commit authority:** the coding agent edits only the eight manifest paths and does not
  stage or commit. The coordinator constructs, proves, and old-value-CAS lands the one
  implementation commit, then records terminal packet state separately.
- **Baseline posture:** exact in both directions. All 106 observed address-field identities,
  all 26 rewrite identities and counts, and all nine written inert reasons are frozen without
  slack. New, grown, shrunk, vanished, class-changed, blank, or mixed rows fail until an
  explicit governed bank records the earned movement.
- **Declared behavior shift:** a naked or legacy applied
  `faction_government_challenge` outcome lacking its producer-authored `appliedHeadline`
  falls back from `may press a challenge to the government` to
  `presses a challenge to the government`. The current producer already supplies that exact
  applied twin, so its queued and applied output is byte-identical.

## 1. Reconciled authority and corrected measurement

CR-AO-1 makes AO-0's executed scalar corpus the instrument. CR-AO-4 requires exact identities
and counts in both directions, so an earned liveness change must be banked rather than absorbed.
The §18/§21 order puts AO-4 after AO-2+3. AO-2+3's terminal packet explicitly reserved rather
than implemented AO-4's complete headline/summary address totality, inert-rewrite quarantine,
and uncovered faction-challenge headline.

Packet v1 and v2 are superseded by this packet text. V1 incorrectly treated the final curated
queued feed as rewrite liveness. V2 corrected to raw outcomes but counted only the public
`selectedOutcomes` lane, falsely quarantining a live state-only `may fall` family. The rewrite
registry runs before curation for both public and state-only outcomes. Its lawful liveness
denominator is therefore the occurrence-disjoint persisted union of
`worldState.pulseHistory[].selectedOutcomes[].headline` and
`worldState.pulseHistory[].mechanicalOutcomes[].headline`. The final curated introductions
remain the distinct authority for cross-home address totality. The two denominators are
complementary and may not be collapsed.

The union is production-derived rather than chosen for coverage. `pulseKernel.js` persists
public receipts as `publicSelectedOutcomes.slice(0, 24)` in `selectedOutcomes`.
`mechanicalPulseRecordFields` persists applied state-only receipts as
`mechanical.slice(0, MAX_MECHANICAL_OUTCOMES_PER_PULSE)`, where the cap is eight, in
`mechanicalOutcomes`. `isPublicOutcome` excludes state-only and suppression-only rows;
`mechanical` contains only state-only rows. The two occurrence lanes are therefore disjoint by
construction. `consequenceOutcomes` is deliberately excluded: when the split exists it is the
overlapping compatibility/mechanics window `selectedForApply.slice(0, 24)`, not a third receipt
lane. Counting it would double-count public and mechanical outcomes.

CR-AO-7/11's deliberate-red train belonged only to the AO-2 contract and AO-3 cure. That train
is terminal. AO-4 is an ordinary one-commit micro-wave: capture the exact pre-cure gap as
ephemeral evidence, then land one green contract+cure commit. No red commit or genesis is
authorized.

At the verified base, one fresh
`buildObservedCorpus({ scalarFields: OBSERVED_SCALAR_FIELDS })` run feeds both measurements.
Two pure reconstructions over the same frozen scalar rows are byte-identical.

### 1.1 Final curated address denominator

`reconstructWizardNewsIntroductions` yields exactly 12 roots, 272 introductions, 32
retirements, 240 final entries, and 53 homes. Every home contributes both `headline` and
`summary`, giving exactly **106 address-field identities**, **400 distinct values**, and
**544 occurrences**. There are zero blank values and zero mixed-class identities. Exactly
14 identities are prospective and 92 are indicative.

All 14 prospective identities are queued:

- headline at `faction_government_challenge`, `food_pressure`, `neutral_to_rival`,
  `npc_exploit`, `npc_mobilize`, `npc_reform`, `npc_sabotage`, `npc_seek_promotion`, and
  `trade_pressure`;
- summary at queued `npc_exploit`, `npc_mobilize`, `npc_reform`, `npc_sabotage`, and
  `npc_seek_promotion`.

Every other address-field identity is indicative. The exact 106 rows are generated without
judgment by §3.1 and bound by their canonical digest; no row is hand-authored.

### 1.2 Raw rewrite-liveness denominator

Select scalar rows by the exact two-lane typed path law in §3.2. Across 12 pulse records the
persisted union yields **228 headline occurrences / 83 distinct values**. Token-bounded `may`
marks **168 occurrences / 69 distinct values** prospective; the remaining 60 occurrences / 14
values are indicative. The exact lane decomposition is:

| Persisted field | Cap per pulse | Occurrences | Distinct | Prospective occurrences | Prospective distinct | Indicative occurrences | Indicative distinct |
|---|---:|---:|---:|---:|---:|---:|---:|
| `mechanicalOutcomes` | 8 | 77 | 24 | 73 | 23 | 4 | 1 |
| `selectedOutcomes` | 24 | 151 | 80 | 95 | 66 | 56 | 14 |

Occurrences add because the persisted lanes are disjoint. Distinct values deliberately do not:
an exact headline string may be authored in both public and state-only families.

The current 25-rule registry has 16 active rules and nine inert rules. It covers 167 prospective
occurrences / 68 values exactly once and has zero overlaps. Its sole uncovered live witness is:

```text
worldState.pulseHistory[2].selectedOutcomes[0].headline
Military/Guard may press a challenge to the government
```

That raw outcome also carries `type: faction`, `proposalPayload.kind: government_change`, and
summary `Military/Guard sees an opening to press military order interests.` The witness is live
producer output, not a fixture or source inference.

Add the exact rule:

```js
[/\bmay press a challenge to the government\b/,
  'presses a challenge to the government']
```

The resulting 26 rules are **17 active / 9 inert**, cover all **168 occurrences / 69 values**
exactly once, and leave zero uncovered or overlapping prospective rows. Exact active rows,
sorted by `(source, flags, replacement)`, are:

| RegExp source | Replacement | Distinct | Occurrences |
|---|---|---:|---:|
| `\\bmay bargain\\b` | `bargains` | 5 | 11 |
| `\\bmay be depleted\\b` | `depleted` | 1 | 1 |
| `\\bmay become\\b` | `becomes` | 1 | 2 |
| `\\bmay emerge\\b` | `emerges` | 3 | 4 |
| `\\bmay exploit\\b` | `exploits` | 3 | 4 |
| `\\bmay expose\\b` | `exposes` | 1 | 1 |
| `\\bmay fall\\b` | `falls` | 3 | 36 |
| `\\bmay intensify\\b` | `intensifies` | 2 | 4 |
| `\\bmay mobilize\\b` | `mobilizes` | 5 | 11 |
| `\\bmay press a challenge to the government\\b` | `presses a challenge to the government` | 1 | 1 |
| `\\bmay protect\\b` | `protects` | 8 | 14 |
| `\\bmay reform\\b` | `reforms` | 23 | 45 |
| `\\bmay sabotage\\b` | `sabotages` | 1 | 1 |
| `\\bmay seek promotion\\b` | `seeks promotion` | 1 | 1 |
| `\\bmay shift\\b` | `shifts` | 1 | 4 |
| `\\bmay suppress\\b` | `suppresses` | 5 | 11 |
| `\\bmay take hold\\b` | `takes hold` | 5 | 17 |

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome and explicit non-goals

The packet closes one behavior family: every final Wizard News home has a total headline and
summary voice classification, while every pre-curation prospective headline has exactly one
deterministic applied fallback and every inert fallback has a written, identity-bound reason.

In scope:

1. Create one pure helper and one executed walker over both AO-0 scalar views.
2. Export the existing rewrite registry and add the one exact producer-agreeing fallback.
3. Freeze the complete 106-row address table, 26-row liveness table, and nine-row written inert
   quarantine; extend `HZ-CROSSHOME`, its derived substrate, mutation rationale, and the whole
   lighting census to cover this instrument.

Explicitly out:

- any summary or `reasons` rewrite, producer wording change, `FACTION_VERB_PHRASES` edit,
  generic `may` removal, fuzzy grammar, AI/model classifier, or unobserved fallback;
- changing current queued/applied producer output, adding outcomes to the corpus, or modifying
  outcome/proposal/persisted shape, order, IDs, or any non-headline feed field;
- AO-5's timeline, pulse-history, regional-log, chronicle, or `narrativeSummary` families;
- AO-6's standing source-mutant battery;
- a second corpus build, golden re-record, flag, tuning value, dependency, timeout, floor,
  ceiling, observed-shape scanner/baseline, test-ratchet baseline, mutation sweep, hazard
  floor/status/count, global JSON reserialization, or ninth implementation path.

## 3. Exact contract

### 3.1 Complete address totality

Create `scripts/lib/news-headline-contract.mjs` as pure infrastructure, at most 250 effective
lines, importing no product producer. Given the introductions from
`reconstructWizardNewsIntroductions`, derive the address table exactly:

1. Reject a non-array or empty introductions list.
2. For each entry require nonblank string `kind`, `headline`, and `summary`, plus an own
   `impactKind` value that is either exact `null` or a nonblank string. Define
   `impactToken = impactKind === null ? 'null' : impactKind`. Reject missing or `undefined`
   impact kind, blank strings, numbers, booleans, arrays, objects, embedded `|` in `kind` or
   `impactToken`, and the non-null string `"null"`, which would collide with the canonical
   null sentinel. The shipped Wizard News contract expressly permits exact null.
3. Define `home = kind + '|' + impactToken`. Codepoint-sort the distinct homes. Exact null
   therefore preserves the legacy `webwar_campaign_minted|null` and
   `webwar_campaign_complete|null` identities; string `"null"` is never accepted.
4. For each home and each field in the fixed order `headline`, `summary`, collect every exact
   string value, retaining duplicates.
5. Classify a headline `prospective` iff `/\bmay\b/` matches. Classify a summary
   `prospective` iff `/\bcan advance through\b/` matches. Otherwise the nonblank value is
   `indicative`.
6. More than one class inside one `(home, field)` is a mixed-class failure, never two rows.
7. Emit exactly `{ home, field, voiceClass, distinctValues, occurrences }`, where distinct is
   over exact strings and occurrences retains duplicates.
8. Sort rows by codepoint identity `home|field|voiceClass`. Duplicate identities fail.

Construct every emitted object explicitly in the displayed insertion order; object spread
from an intermediate count bucket is forbidden because it can serialize `occurrences` before
`distinctValues` and counterfeit the canonical digest.

Canonical address serialization is UTF-8 `JSON.stringify(rows)` with no whitespace or final
newline and object keys in the displayed insertion order. At this base it is 12,242 bytes and
SHA-256 `82ed15a85e457d8595dcb2798f53f699210e77758a7bfa06638722d10abab694`.
The baseline stores both all 106 rows and that digest. The helper recomputes the digest and
requires exact totals: 53 homes, two fields, 106 identities, 14 prospective, 92 indicative,
400 distinct values, and 544 occurrences. The digest is corroboration, not a substitute for
row validation and bidirectional comparison.

The live nullable census is pinned inside A4 without a ninth title: exactly 8 of 272
introductions use exact null across exactly two of 53 homes — four
`webwar_campaign_minted|null` and four `webwar_campaign_complete|null` occurrences. A fixture
proves exact null and an ordinary string are accepted, then rejects every malformed/collision
class named in step 2. These rows were already present when the canonical 106-row digest was
derived, so no denominator or digest changes.

### 3.2 Raw rewrite liveness

From the same AO-0 scalar array, select only rows satisfying all of:

```text
root === 'worldState'
path.length === 5
path[0] === { kind: 'field', value: 'pulseHistory' }
path[1] === { kind: 'index', value: nonnegative safe integer }
path[2] === { kind: 'field', value: 'selectedOutcomes' | 'mechanicalOutcomes' }
path[3] === { kind: 'index', value: nonnegative safe integer }
path[4] === { kind: 'field', value: 'headline' }
```

Do not hardcode the global `rootOrdinal`. Require one selected root ordinal; pulse indexes
exactly `0..11` across the union; only the two exact field names; indexes contiguous from zero
within each present `(pulse, field)` lane; no index at or above 24 for `selectedOutcomes`; no
index at or above eight for `mechanicalOutcomes`; and nonblank string values. Typed address
identity is `(root ordinal, pulse index, persisted field, outcome index)`, and duplicates fail.
Stable order is `(pulse index, persisted field, outcome index, exact headline)`, with field
comparison by codepoint. Preserve duplicate headline values at distinct addresses.
Use that one numeric comparator for selection and validation; never re-sort by a stringified
identity, which would place pulse 10 before pulse 2.

The walker separately executes the production partition law with public, state-only, and
suppression-only controls: public rows may enter `selectedOutcomes` but not mechanical;
state-only rows may enter mechanical but not public; suppression-only rows enter neither; the
mechanical cap is eight and the public persisted cap is 24. `consequenceOutcomes` may overlap
both and is rejected as a liveness input. A third field, a cross-lane occurrence, a cap breach,
or source-law drift fails before counts are compared.

Validate the registry as exactly `[RegExp, nonblank string]` rows. RegExp flags must be empty;
stateful/global rules are forbidden. Identity is `(pattern.source, pattern.flags, replacement)`.
Duplicate identity, repeated source+flags with conflicting replacement, blank replacement,
non-RegExp pattern, or malformed headline fails closed. A raw headline is prospective iff
token-bounded `may` matches. Every prospective headline must match exactly one rule; zero or
multiple matches fail with its pulse/field/outcome address. No indicative headline may match a rule.

Emit canonical sorted rows with exactly:

```text
{ source, flags, replacement, distinctValues, occurrences }
```

Counts measure exact raw headline values across both disjoint persisted lanes. Active means both
counts are positive; inert means both are zero; a split zero/nonzero row is malformed. The final
totals are 26 rules, 17 active, 9 inert, 69 distinct values, and 168 occurrences. The active
table is §1.2. The inert table and
its reasons are §3.3.
Construct rewrite rows explicitly in the displayed insertion order. The live walker derives
and compares every selected, mechanical, and union indicative count as well as prospective
counts; validating frozen constants without deriving them is vacuous and forbidden.

### 3.3 Exact written inert quarantine

The baseline stores `knownInert` as canonical sorted rows with exactly
`{ source, flags, replacement, reason }`. All strings equal their trim; `flags` is exactly the
empty string. The identity set must deep-equal the zero-count rewrite identity set in both
directions. Every reason is exact and nonblank:

| RegExp source | Replacement | Written reason |
|---|---|---|
| `\\bmay close its doors\\b` | `closes its doors` | `institutionLifecycle.js::evaluateInstitutionLifecycle is the live institution-closure authoring seam; the executed AO-0 12-record persisted public+mechanical union contains no closure headline.` |
| `\\bmay defect\\b` | `defects` | `npcAgency.js::deriveNpcCandidates exposes NPC_ACTION_FAMILIES.defect through candidateForAction; the executed AO-0 12-record persisted public+mechanical union contains no defect headline.` |
| `\\bmay grow\\b` | `grows` | `populationDynamics.js::populationCandidate is the live growth authoring seam; the executed AO-0 12-record persisted public+mechanical union contains no growth headline.` |
| `\\bmay hoard\\b` | `hoards` | `npcAgency.js::deriveNpcCandidates exposes NPC_ACTION_FAMILIES.hoard through candidateForAction; the executed AO-0 12-record persisted public+mechanical union contains no hoard headline.` |
| `\\bmay raise a\\b` | `raises a` | `institutionLifecycle.js::evaluateInstitutionLifecycle is the live institution-build authoring seam; the executed AO-0 12-record persisted public+mechanical union contains no build headline.` |
| `\\bmay recover\\b` | `recovering` | `tierResourceDynamics.js::evaluateTierResourceDynamics is the live resource-recovery authoring seam; the executed AO-0 12-record persisted public+mechanical union contains no recovery headline.` |
| `\\bmay rise\\b` | `rises` | `tierResourceDynamics.js::tierCandidate and relationshipRulesCore.js's vassal-rebellion candidate are live rise authoring seams; the executed AO-0 12-record persisted public+mechanical union contains no rise headline.` |
| `\\bmay spread\\b` | `spreads` | `stressors.js::evaluateStressorRules is the live stressor-spread authoring seam; the executed AO-0 12-record persisted public+mechanical union contains births and escalations but no spread headline.` |
| `\\bmay undermine\\b` | `undermines` | `npcAgency.js::deriveNpcCandidates exposes TARGETED_ACTION_PHRASING.undermine_rival through candidateForAction; the executed AO-0 12-record persisted public+mechanical union contains no undermine headline.` |

A new inert rule, a missing row, an active rule retained as inert, a zero-count rule without its
exact reason, or a reason edit fails. No count is permitted in `knownInert`; liveness owns counts.

### 3.4 Exact baseline envelope and comparator

Create `tests/lint/.news-headline-contract-baseline.json` with exactly:

```text
schemaVersion: 1
corpus: {
  pulseRoots: 12, introductions: 272, retirements: 32,
  finalEntries: 240, homes: 53
}
addressTotality: {
  rows: <all 106 canonical rows>,
  rowsSha256: <§3.1 digest>,
  totals: { homes: 53, fields: 2, identities: 106,
            prospectiveIdentities: 14, indicativeIdentities: 92,
            distinctValues: 400, occurrences: 544 }
}
rewriteLiveness: {
  raw: {
    pulseRecords: 12,
    lanes: [
      { field: "mechanicalOutcomes", capPerPulse: 8,
        headlineOccurrences: 77, distinctValues: 24,
        prospectiveOccurrences: 73, prospectiveDistinctValues: 23,
        indicativeOccurrences: 4, indicativeDistinctValues: 1 },
      { field: "selectedOutcomes", capPerPulse: 24,
        headlineOccurrences: 151, distinctValues: 80,
        prospectiveOccurrences: 95, prospectiveDistinctValues: 66,
        indicativeOccurrences: 56, indicativeDistinctValues: 14 }
    ],
    union: { headlineOccurrences: 228, distinctValues: 83,
             prospectiveOccurrences: 168, prospectiveDistinctValues: 69,
             indicativeOccurrences: 60, indicativeDistinctValues: 14 }
  },
  rows: <all 26 canonical rows>,
  totals: { rules: 26, activeRules: 17, inertRules: 9,
            distinctValues: 69, occurrences: 168 },
  knownInert: <the exact nine §3.3 rows>
}
```

JSON objects and arrays have exactly the displayed keys. Counts are non-negative safe integers;
corpus conservation is mandatory. Arrays are strictly codepoint-sorted and duplicate-free.
Totals derive from rows and equal them exactly. Both address and rewrite comparators are exact
in both directions: new, grown, shrunk, vanished, voice-class-changed, or identity-changed rows
all fail with live and frozen values. There is no update flag or automatic writer. A later wave
banks an earned change by an explicit baseline edit in the same governed change.

### 3.5 Production fallback and immutability

In `worldPulseFeedCuration.js`, export `APPLIED_HEADLINE_REWRITES` without reordering or changing
its 25 existing rows or loop. Add only the exact §1.2 rule. `appliedHeadlineFor` keeps existing
precedence: `outcome.appliedHeadline` wins before the registry. Therefore:

- the live queued faction challenge stays prospective;
- the live producer's explicit applied twin stays byte-identical;
- a naked/legacy applied challenge gets the same twin through the fallback;
- unrelated/nonmatching headlines pass through; and
- summary, reasons, outcome input, keys, order, IDs, tags, score, scope, significance,
  settlements, and every non-headline field remain byte-identical.

The replacement must equal
`FACTION_VERB_PHRASES.faction_government_challenge.did` byte-for-byte. A generic rewrite or
producer edit is forbidden.

## 4. Hard scope and exact eight-path manifest

| Limit | AO-4 budget |
|---|---:|
| Behavior families | 1 — news-address voice totality and fallback liveness |
| Handwritten paths | exactly 8 |
| New logic-bearing leaves | 1 pure helper, at most 250 effective lines |
| Existing production logic files modified | exactly 1 |
| `worldPulseFeedCuration.js` delta | at most 3 effective lines |
| Other existing logic delta | protected-substrate array only, at most 2 effective lines |
| New test files / registrations | exactly 1 / exactly 1 `describe` + 8 `it` |
| Persisted record families or keys | 0 |
| Acceptance cases | exactly 8 |

| Action | Path | Symbol / region | Max delta | Instruction |
|---|---|---|---:|---|
| MODIFY | `scripts/lib/news-voice-contract.mjs` | `NEWS_VOICE_PROTECTED_SUBSTRATE` | 2 effective | Add only the AO-4 helper and baseline paths; preserve codepoint order and every existing item. |
| CREATE | `scripts/lib/news-headline-contract.mjs` | address totality, raw liveness, envelope, comparator exports | 250 effective | Implement §3 purely; no product import or file write. |
| CREATE | `tests/lint/newsHeadlineContract.walker.test.js` | one `describe`, eight `it`, one corpus `beforeAll` | 8 tests | Build once; reconstruct twice; execute A1–A8. |
| CREATE | `tests/lint/.news-headline-contract-baseline.json` | exact schema-1 freeze | one baseline | Store all 106+26 rows, digest, totals, and nine reasons; no update mode. |
| MODIFY | `src/domain/worldPulse/worldPulseFeedCuration.js` | `APPLIED_HEADLINE_REWRITES` | 3 effective | Export registry and add only the exact challenge fallback. |
| MODIFY | `scripts/hazard-registry.json` | `HZ-CROSSHOME` | one class | Add walker/helper/baseline enforcers and totality/liveness wording; keep status, acceptedReason, instances, floors, and class count unchanged. |
| MODIFY | `scripts/mutation-coverage-manifest.json` | `newsHeadlineContract.walker.test.js` | one row | Add one surgical rationale; do not reserialize or move `uncoveredBaseline`. |
| TEST | `tests/lint/sovereigntyLightingContract.walker.test.js` | `CENSUS` + dated cause | five values | Re-derive whole; never forward-add if execution differs. |

No generated artifact is committed. Exceeding a limit is a STOP and split.

## 5. Hazard, mutation, census, and runtime

`HZ-CROSSHOME` remains a ten-key `MACHINERY` class with `acceptedReason: null`, `inChain: true`,
and `instances: 53`. Extend only its enforcer paths/note/triggers with the AO-4 walker, helper,
baseline, complete address totality, and disjoint persisted-union liveness. The challenge gap is a coverage finding,
not a 54th historical applied-summary defect. Do not move status/count/floors or add a class.

The existing pre-mortem predicate derives its population by parsing
`NEWS_VOICE_PROTECTED_SUBSTRATE`; add the new helper and baseline there rather than editing
`premortem-triggers.mjs`. Its population remains nonempty and synthetic fires.

Add one `kind: "rationale"` mutation-manifest row for the eight ordinary controls. AO-6 owns
standing source mutants. Do not touch `mutation-sweep.sh` or `uncoveredBaseline`.

One new credited test file with exactly eight literal `it` and one literal `describe` moves the
whole census only:

```text
2410/365/2045/19968/5636 -> 2411/365/2046/19976/5637
```

AO-4 solely holds the row while READY; a different executed tuple is a STOP. Terminal flip
releases it. The single expensive `beforeAll` may use an explicit `900_000 ms` local hook budget.
No second corpus build or global timeout/config edit is authorized.

## 6. Closed acceptance denominator

| ID | Case |
|---|---|
| A1 | One AO-0 scalar build feeds two byte-identical reconstructions closing at 12/272/32/240/53; the product partition proves public/state-only/suppression disjointness, exact 24/8 persisted caps, and why `consequenceOutcomes` is excluded. |
| A2 | Complete final address totality yields exactly 106 rows, 400 distinct values, 544 occurrences, 14 prospective and 92 indicative, with zero blank or mixed identities and the exact canonical digest. |
| A3 | Exact selected/mechanical raw selection yields 151/80/95/66 and 77/24/73/23, whose occurrence-disjoint union is 228/83/168/69; the final 26-rule table is exactly 17 active / 9 inert, every prospective matches once, no indicative matches, and active counts equal §1.2. |
| A4 | Exact envelope and bidirectional comparators reject malformed, duplicate, empty, new, grown, shrunk, vanished, class-changed, mixed, uncovered, and overlapping inputs; exact null impact kind is accepted at the two frozen sentinel homes while missing/undefined, blank, other types, embedded delimiters, and string `"null"` fail. |
| A5 | The zero-count identity set equals the nine written inert rows exactly; each carries its exact scoped nonblank §3.3 reason, and no active rule or reasonless inert row enters quarantine. |
| A6 | Pre-cure has exactly one live raw challenge witness and zero overlap; post-cure has zero gaps, while naked fallback equals the producer `did` twin and queued/explicit-twin paths stay byte-identical. |
| A7 | Unrelated headlines, all summaries/reasons, outcome input, and every non-headline `newsEntryForOutcome` field stay byte-identical; HZ-CROSSHOME, derived pre-mortem, mutation rationale, and census reconcile. |
| A8 | The exact eight-path implementation passes all focused checks, both typechecks, observed-shape guard, and bare full gate at a clean immutable commit with no unrelated movement. |

No ninth case is investigated. An adjacent observation is reported without repair unless it
disproves a premise, which is a STOP.

## 7. Preflight, order, and checks

Before editing, prove branch/HEAD and sealed ancestry; exact target cleanliness; three CREATE
targets absent; 29 packets / 1 READY; census `2410/365/2045/19968/5636`; one corpus execution
reproduces §1; current rules equal 25 = 16 active + 9 exact inert with the sole challenge gap;
and the producer `did` twin equals the authorized replacement.

Implementation order:

1. Create helper and eight-case walker. Against the current 25 rules, capture exactly the one
   live challenge gap; never commit red.
2. Export the registry and add the exact fallback. Prove 26 = 17+9, 168/69, no gap/overlap,
   and producer-twin behavior.
3. Create the exact baseline, then add mutation rationale, hazard enforcers/wording, protected
   substrate paths, and whole census re-record.
4. Run all checks and leave exactly eight paths unstaged/uncommitted for the coordinator.

Focused Vitest runs only through the mutex:

```sh
npm run validate:packets
npm run validate:hazard-registry
npm run validate:premortem
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/newsHeadlineContract.walker.test.js \
  tests/lint/newsVoiceContract.walker.test.js \
  tests/domain/worldPulseNewsCuration.test.js \
  tests/domain/worldPulseRecordModes.test.js \
  tests/domain/worldPulseChronicleCuration.test.js \
  tests/domain/reasonHeadlineRegister.test.js \
  tests/lint/hazardRegistryFailClosed.test.js \
  tests/lint/mutationCoverageManifest.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js
npx eslint \
  scripts/lib/news-voice-contract.mjs \
  scripts/lib/news-headline-contract.mjs \
  src/domain/worldPulse/worldPulseFeedCuration.js \
  tests/lint/newsHeadlineContract.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run check:observed-shape-readers
npm run check:tail
```

`npm run check:tail` is bare, never mutex-wrapped. The final landing authority is the full
17-step gate on the coordinator-created immutable commit.

## 8. Ordinary one-commit lifecycle

1. Dispatch/seal at a clean green admissible descendant with unchanged substrate.
2. Agent edits exactly eight paths, captures the ephemeral one-gap red, reaches green, and
   leaves changes unstaged/uncommitted.
3. Coordinator audits scope/budgets, builds one private-index implementation commit, and proves
   focused checks plus bare full gate in a detached worktree.
4. Only then old-value CAS shared ref from sealed parent to the green commit. CAS mismatch
   discards and recompiles.
5. Separate coordinator docs commit records terminal packet/index/manifest state, validates
   29 packets / 0 READY, and releases the census row.

Implementation and terminal record are never squashed. No red commit becomes a shared tip.

## 9. Mandatory STOP conditions

STOP without widening if the exact-null census or sentinel law differs; if any denominator, digest, row, production partition/cap, class, active count, inert identity,
written reason, witness, or census figure differs; if any blank/mixed address, second gap,
overlap, indicative match, or replacement disagreement appears; if current producer output or
any non-headline field moves; if the two durable lanes cease to be occurrence-disjoint, if
`consequenceOutcomes` is needed as a third denominator, or if a generic/fuzzy rewrite, producer edit, second corpus build,
ninth path/case, extra consumer, or helper over 250 effective lines is needed; if a baseline,
floor, ceiling, timeout, golden, flag, tuning, dependency, observed-shape artifact, hazard
status/count, mutation uncovered count, or global JSON serialization must move; if a target
drifts, failure lies outside A1–A8, or CAS fails.

The STOP report names the smallest measured contradiction and proposes a split without repair.

## 10. Completion receipt

Report parent/final SHA; exact eight paths and line deltas; pre-cure one-gap receipt; final
106/400/544/14/92 address receipt and digest; raw lane receipts 151/80/95/66 and
77/24/73/23, union 228/83/168/69, plus 26/17/9 receipt; exact inert
reasons; A1–A8; all commands/exits/counts; both typechecks; observed-shape; bare full-gate true
exit; census; hazard/pre-mortem/mutation; generated artifacts `NONE`; persisted/golden/flag/
tuning/dependency movement `NONE`; deviations and judgment calls `NONE`.
