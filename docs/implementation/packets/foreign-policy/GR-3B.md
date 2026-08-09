# Foreign Policy / GR-3B — peacetime term producers

- **Status:** `BLOCKED`
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `2c810d167d016302e641fc9cfe74fff57475b14e`
- **Last revalidated:** `2026-08-09`
- **Landed dependencies:** GR-2 `a18fdcfae46836f1d41294d6712cc11f3349d64c`,
  GR-2 repair `91075d457859601ae32f5e5bf989f70d7fcfd28a`, GR-3a
  `0be4800dbf9fe70d1291c0cf1619394e6945853d`, strict repair
  `2a05ce5fecfcbe8c9e5b66e5ab6a520432bc6b2d`
- **Commit authority:** `NONE — implementation prohibited while BLOCKED`
- **Baseline:** focused GR suites pass `4 files / 89 tests`; focused ESLint exits
  `0`. Full gate, typecheck ratchets, goldens, and bundle were not run.

## 1. Dispatch verdict and reconciled authority

Do not dispatch this packet. It intentionally withholds coding instructions.

Authority, in order:

1. Live code at the verified base defines what exists.
2. `PACKET_STANDARD.md` requires selection, ordering, lifecycle, and ownership
   choices to be exact before READY.
3. `DESIGN_FP_ARCH_GR.md` says GR-3a landed and GR-3B is owed/BLOCKED.
4. `FABLE_VALIDATION_QUEUE.md` says candidate membership is a design choice and
   forbids GR-3B from drafting `settlement_provision` or
   `temple_restitution` before negotiated orientation is ruled.
5. `DESIGN_FP_GRAMMAR.md` supplies family intent, not a score-to-rung formula.

Reconciled facts:

- GR-3a already landed the catalog rows, executors, and `orderTermsByAsk`.
- `orderTermsByAsk` orders a supplied set; it does not choose membership or a
  rung.
- The frozen composable security pair states intent but not output cardinality
  or the executable collision exception.
- `PRODUCER_OWED` records nine GR-3B debts. The independent chair-owned
  `reparations` debt must remain.
- No prose source resolves the missing choices below. A coding agent may not.

## 2. Verified live tree contract

| Role | Exact file and symbol | Verified fact |
|---|---|---|
| Gate | `src/domain/worldPulse/pactProposals.js:pactFormationActive` | Strict `pactFormationEnabled === true`; no new flag |
| Trigger DTO | `src/domain/worldPulse/pactTriggers.js:PactTriggerCrossing` | Carries `trigger`, `score01`, `crossed`, `receipt`, `subject` |
| Crossing order | `src/domain/worldPulse/pactFormation.js:crossingsFor` | Score descending, then trigger codepoint |
| Current choice | same file, `advancePeacetimePacts` | Uses `crossings[0]`; passes no score to drafting |
| Producer | same file, `PACT_DRAFT_LENS`, `draftPactSheet` | Trigger maps to one string; faith/population are empty |
| Ask order | `src/domain/worldPulse/peaceTermsCatalog.js:orderTermsByAsk` | Dedupes known terms; sorts by weight then codepoint; no source consumer |
| Catalog | same file, `TERM_CATALOG` | Contains all nine owed faith/population/security rows |
| Stacking | `src/domain/worldPulse/pactAmendment.js:stackingCellOf`, `amendPactInstrument` | One live `family|beneficiary` cell; no composable exception |
| Orientation | `src/domain/worldPulse/treatyOrientation.js:treatyOrientationOf` | Negotiated pact shape resolves unknown with empty ids |
| Treaty mover | `src/domain/worldPulse/peaceTerms.js:advanceTreaties` PASS 2 | Obligor/obligee drive compliance, streams, and default |
| Debt guard | `tests/domain/peaceTermsGrantTerms.test.js:PRODUCER_OWED`, section E | Nine GR-3B rows; ask-order helper intentionally unconsumed |
| Test precedents | `tests/domain/pactFormation.test.js`, `tests/domain/pactAmendment.test.js` | Current lens/refusal and stacking behavior |
| Dormancy | `tests/property/pactFormationDormancyFence.test.js` | Existing flag-dark identity proof |

## 3. Exact blockers

### B1 — candidate membership and rung selection are unset

`PACT_DRAFT_LENS` is currently:

```js
{
  faith_communion: '',
  migration_pressure: '',
  renewal: '',
  shared_threat: 'non_aggression',
  trade_demand: 'resource_share',
}
```

`draftPactSheet({ trigger, fromId, toId, reciprocal, tick })` receives no
`score01`. No live rule maps crossing reach to a candidate index, defines
boundaries, or says whether shared threat emits one or both security terms.
The queue explicitly leaves candidate membership to design.

### B2 — negotiated transfer terms lack an obligation axis

`signPactProposal` mints negotiated instruments with parties/provenance/lineage,
but no war or sale orientation fields. `treatyOrientationOf` therefore returns
empty obligor/obligee ids. PASS 2 uses those ids for capacity, monitoring,
conserved payer/payee movement, and `defaultedBy`.

Producing `temple_restitution` or `settlement_provision` now could mint a live-
looking transfer that silently moves nothing. Orientation is a lit-path design
decision and is not GR-3B's incidental repair.

### B3 — composability is named but not executable

`amendPactInstrument` refuses every second occupied `family|beneficiary` cell.
It has no closed exception for `{non_aggression, mutual_defense}` and no rule for
duplicate or third-security-term behavior.

## 4. Minimum owner decision required

One owner ruling must answer all four items exactly:

1. **Candidate sets:** canonical term-token membership for
   `faith_communion`, `migration_pressure`, and `shared_threat`; also confirm
   whether `trade_demand` and `renewal` remain unchanged.
2. **Selection function:** exact numeric input; every inclusive/exclusive
   boundary; below/above behavior; clamping/rounding; output cardinality;
   deterministic ties; and whether beneficiary expansion occurs before or
   after rung selection.
3. **Negotiated direction:** obligor, obligee, transfer payer/payee, compliance
   capacity subject, monitor, and `defaultedBy` party for beneficiary-bearing
   terms. If code must change, land a separate orientation prerequisite first.
4. **Composable pair:** behavior when both pair members arrive together, when
   one is already live, and when a duplicate or third security term arrives.
   The exception must remain limited to the frozen pair.

The owner may not avoid item 3 by omitting the two transfer terms or redefining
GR-3B as a smaller slice. The nine-row denominator remains whole.

## 5. Scope and manifest while blocked

**Authorized behavior/files/lines/tests:** `0 / 0 / 0 / 0`

**Exact coding manifest:** `NONE`

After the decisions and any orientation prerequisite, a new READY revision must
remain one behavior family, use no new state or flag, touch at most two existing
logic files and seven handwritten files, change at most 180 effective production
lines, and contain at most eight acceptance cases. Exceeding that is a split.

## 6. Forbidden implementation

Do not change source or tests. Specifically, do not:

- convert the lens to arrays/sets or pass `score01` into drafting;
- divide score space by candidate count or treat catalog weights as thresholds;
- emit all terms below a score or emit the security pair unconditionally;
- add a general stacking exception;
- derive orientation from party sort order, proposer order, or beneficiary;
- omit either transfer row or delete any GR-3B owed row; or
- edit `peaceTerms.js`, `treatyOrientation.js`, catalogs, flags, goldens,
  baselines, migrations, design docs, or registries under this packet.

These are forbidden premature choices, not suggested solutions.

## 7. Read-only preflight and evidence

After the owner ruling, a coordinator may run only this preflight before
recompiling the packet:

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor \
  2c810d167d016302e641fc9cfe74fff57475b14e HEAD
rg -n 'PACT_DRAFT_LENS|draftPactSheet|crossingsFor|advancePeacetimePacts' \
  src/domain/worldPulse/pactFormation.js
rg -n 'stackingCellOf|amendPactInstrument' src/domain/worldPulse/pactAmendment.js
rg -n 'orderTermsByAsk|temple_restitution|settlement_provision|mutual_defense' \
  src/domain/worldPulse/peaceTermsCatalog.js
rg -n 'PRODUCER_OWED|GR-3b|orderTermsByAsk' \
  tests/domain/peaceTermsGrantTerms.test.js
```

Measured focused baseline at the verified base:

```sh
sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh -n 120 \
  npx vitest run tests/domain/pactFormation.test.js \
  tests/domain/pactAmendment.test.js \
  tests/domain/peaceTermsGrantTerms.test.js \
  tests/property/pactFormationDormancyFence.test.js
```

Result: exit `0`, `4 files / 89 tests`.

Any changed symbol, target dirt, unresolved decision, needed extra writer/state/
flag, scope overrun, unexpected golden movement, or non-READY status is a STOP.
Recompile this packet; do not adapt while coding.
