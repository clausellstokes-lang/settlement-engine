# INFRA / RN-C — the orphan dispositions, and the habitat that let them accumulate

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `d8236665b1e5e6a4c97a74401724823f94509c6e`
  (RN-A1's implementation commit)
- **Train:** `rn-1`, member **3 of 4**
- **Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` @ SHA-256
  `c691af9fe6ade05097857699829771062058b289e55e0445aba2eee9498e64fa`
- **Predecessor:** `RN-A1`, landed at `d8236665`. **`RN-C dependsOn RN-A0`** — they share the
  change path `conquestDoctrineStage.js`, and this packet's instruction text cites the
  POST-A0 symbol name `COALITION_FRIENDLY_LABELS`. It is premise- and path-disjoint from A1.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§64.6** (the §38.4 orphan dispositions
  RATIFIED as graded, including the `cordial` negative-control preservation and the
  `defensive_pact` CHARTERED-ORPHAN pin marked EXPECTED-DEAD-UNTIL `mutual_defense`; the
  reachability-per-spelling habitat pin adopted for the whole admission-set family on the WC
  O-9 precedent) · **§67.4** (the conquest coalition set is RE-DERIVED from the produced
  `allianceLabel` corpus — the ask-the-corpus law — its four dead synonym members leave via
  this arm, and the `trade_partner`/`patron`/`client` exclusion STANDS as deliberate with
  the intent RECORDED AT THE SITE) · **§101.2** (**DOOR 1 OPENED — the wider scope budget
  RECORDED for arm C at SIX files**) · **§95.2**.
- **Compile of record:** `laneTC18-RN1-PLAN.md` §4.3, §5.3.

---

## §0 · ⛔ THE HOT-FILE HEADROOM MEASUREMENT, EXECUTED FIRST

PACKET_STANDARD requires a packet whose manifest names a hot file to OPEN with an executed
headroom measurement at its verified base, with eslint's own `Linter` under `max-lines`
`{ skipBlankLines: true, skipComments: true }` — never `wc -l`, never an inherited figure,
**including the 798 the standing list quotes.**

```
 EFF	 RAW	PATH
 798	1414	src/domain/worldPulse/convergence.js
```

**`convergence.js` = 798 effective lines, ceiling 800, HEADROOM 2.** Measured by this lane,
not inherited. The three hot-file rules bind in full:

1. the measurement above, executed;
2. the edit is **shaped to net zero effective lines** — removing two tokens from a one-line
   `new Set([…])` literal is net zero **by construction**, and the disposition rationale
   goes in COMMENTS, which `skipComments` excludes;
3. **no size-baseline entry is added and no ceiling is raised.** `convergence.js` has no
   `scripts/.size-baseline.json` entry and must not acquire one.

⚠ The compile notes the cure never priced this file as hot, because `convergence.js` joined
the standing list on 2026-08-14 — after the cure was written.

## §1 · ⭐⭐ THE CORPUS WAS ASKED, AND IT ANSWERED CLEANLY (§67.4)

§67.4 rules the conquest set is re-derived **from the produced corpus**, not from reading.
Executed at this base over all of `src/`, for every token this arm removes — a write into
any of `relationshipType|relType|allianceLabel|toType|fromType|proposedRelationshipType`:

| token | regional fold | state fold | producers | verdict |
|---|---|---|---:|---|
| `alliance` | → `allied` | → `allied` | **0** | DEAD |
| `ally` | → `allied` | → `allied` | **0** | DEAD |
| `suzerain` | → `vassal` | passes | **0** | DEAD |
| `friendly` | passes | passes | **0** | DEAD |
| `kinship` | passes | passes | **0** | DEAD |
| `cordial` | passes | passes | **0** | DEAD |
| `tributary` | passes | → `vassal` | **0** | DEAD |
| `protectorate` | passes | passes | **0** | DEAD |

**Zero producers for all eight**, and **none appears in `RELATIONSHIP_SELECTIONS`**, the
authoring vocabulary — so no author can mint one either. The three mentions outside the
admission sets themselves are **different vocabularies**, checked individually and rejected
as producers: `settlementLifecycleKernel.js:1115` `kind:'tributary'` is a lifecycle RECEIPT
kind; `convergence.js:195,344` `'kinship'` is an intervention MOTIVE; `personaSlicer.js:197`
`'kinship'` is an act class.

**And the survivors are reachable**, which is what stops this from being a set that reds
tomorrow: `allied`, `trade_partner`, `rival` by the authoring vocabulary; `vassal` (3),
`hostile` (6), `patron` (2), `client` (1), `cold_war` (1) by named producers. The one
exception is `defensive_pact`, and it is the chartered orphan (§3).

## §2 · ⛔⛔ A LIVE DEFECT FOUND BY THIS MEASUREMENT — RECORDED, DELIBERATELY NOT CURED

`convergence.js`'s `FRIENDLY_REL` is `['ally', 'trade_partner', 'vassal', 'tributary',
'protectorate']`. Its read at `:907` is `FRIENDLY_REL.has(relType)` where `relType` comes
from `:822` — `String(e?.relationshipType ?? e?.relType ?? '')`, **read RAW off a
regional-graph edge**. Regional-graph edges carry CANONICAL labels, and
`canonicalRelationshipLabel('ally')` is `'allied'`.

⇒ **the set admits `ally`, which can never appear, and MISSES `allied`, which is the live
canonical value.** An allied neighbour is not read as friendly by the intervention-motive
scorer today.

⛔ **THIS ARM DOES NOT CURE IT, AND THE REASON IS A RULE, NOT TIMIDITY.** Adding `allied`
would make allied neighbours newly count as friendly in intervention scoring — **a change to
generated output**. Arm C is output-neutral by construction (it removes members nothing can
produce); this would not be. It is not arm B1's class either — B1 is the persisted-SPELLING
read class. It is a new cure and therefore a **chair surface**.

⛔ **AND `ally` IS NOT SILENTLY SWEPT OUT EITHER**, even though removing it would be
output-neutral and would fit this arm's shape. Removing it would leave `{trade_partner,
vassal}` — a set that LOOKS consistent and in which nobody would ever notice `allied` is
missing. That is the recorded *never delete the instrument pointing at the outage* lesson
(EST-C §1). **`ally` STAYS, declared EXPECTED-DEAD with this defect as its written reason**,
so the habitat pin carries the finding at the site a reader will hit it. Docketed
`CR-TE18-CONVERGENCEALLIED`.

⭐ **The defect is single-site.** Every other set in the family carries `allied` alongside
`ally`, so removing `ally` from those five is genuinely a dead-synonym removal.

## §3 · ⛔ WHAT IS KEPT, AND WHY

- **`defensive_pact` IS KEPT IN ALL FOUR READERS.** It is a **CHARTERED ORPHAN**:
  `peaceTermsCatalog.js` names `mutual_defense` as the writer-in-waiting, and its own comment
  records that `defensive_pact` edges have had *five reader families and no writer*. Its
  reachability pin is marked **EXPECTED-DEAD-UNTIL `mutual_defense`**, so the pin cannot go
  vacuous and the day it becomes live is a green diff. ⚠ Re-verified at THIS base:
  `peaceTermsCatalog.js` moved in the `4f2d37d1 → cf12c976` window (+34 lines) and
  `mutual_defense` landed as a TERM row — the premise is **strengthened, not dead**, and the
  producer census still returns **0**, so the pin stays EXPECTED-DEAD.
- **`cordial` IS SCOPED TO `ALLY_LIKE` ONLY.** The token is load-bearing as a **deliberate
  non-admitted NEGATIVE CONTROL** in `razingExecutionWr8.test.js` — 10 live sites — and in
  `warDeployment.test.js`. **Sweeping the token from those fixtures would delete the control
  that proves the admission works.** This arm touches `src/` only; no fixture is edited.
- **The coalition census's exclusion of `trade_partner`/`patron`/`client` STANDS** as
  deliberate (J-RNC-6's asymmetry ruling), and §67.4 requires the intent be **RECORDED AT THE
  SITE**. `RN-A0` already wrote that record into the rename comment; this arm re-states it
  beside the re-derivation so the two halves are not separated.

## §4 · The change manifest (7 rows)

| # | Action | Path | Change |
|---:|---|---|---|
| 1 | `MODIFY` | `src/domain/roads/thirdPartyRansom.js` | `ALLY_LIKE` − `kinship`, `friendly`, `cordial` |
| 2 | `MODIFY` | `src/domain/worldPulse/convergence.js` | `FRIENDLY_REL` − `tributary`, `protectorate` ⛔ **HOT, net-zero** |
| 3 | `MODIFY` | `src/domain/worldPulse/conquestDoctrineStage.js` | `COALITION_FRIENDLY_LABELS` − `friendly`, `alliance`, `suzerain`, `ally` |
| 4 | `MODIFY` | `src/domain/worldPulse/warCapacityReads.js` | `ALLY_SUPPORT_TYPES` − `ally` |
| 5 | `MODIFY` | `src/domain/worldPulse/warHomeCosts.js` | `LEVY_SUPPORT_TYPES` − `ally` |
| 6 | `MODIFY` | `src/domain/worldPulse/warAllianceRisk.js` | the inline `responseWeight` literal − `ally` |
| 7 | `TEST` | `tests/lint/vocabularyTotality.walker.test.js` | the reachability-per-spelling habitat pin |

### 4.1 ⛔ THE SCOPE BUDGET — SIX FILES, ON §101.2's RECORDED DOOR 1

**6 existing logic-bearing production files modified, against a default hard budget of
three.** This is **not** an overrun taken on momentum: §101.2 **RECORDS THE WIDER BUDGET**
for exactly this arm, because the width is one-token deletions across a frozen vocabulary
family rather than new behaviour, the §64.7 arm ladder forecloses splitting, and RN's
un-stamped cap of four is not negotiable without a round. **The budget is priced here, in
the packet, never inherited silently.** Every individual edit is a token deletion from a
frozen `Set` literal; every one is net-negative or net-zero in effective lines.

### 4.2 Prices measured NOT INCURRED
§92.2 certification, §49/§50 flags, §85.4 registry mint (all six production files scanned:
**0 hits** each), §95.2 census burn (arm C removes **vocabulary members**, never census
rows), §102.3 (`vocabularyTotality.walker.test.js` already carries its manifest row under
the `self-proving-meta` rationale, whose guard-the-guard property covers an arm built the
same way; **no new `tests/lint/` file is created**).

## §5 · THE HABITAT PIN, EXACTLY

For each admission set in the family, every member is either **(a)** demonstrated reachable
by a **named** producer, or **(b)** declared **EXPECTED-DEAD with its written reason**. A set
that acquires an undeclared member **reds**. This is the WC ruling O-9 precedent, and
`vocabularyTotality.walker.test.js`'s charter already names the class verbatim: *"a
per-consumer derivation that hand-rolls the set of values a producer emits, hidden by a
SILENT default… A display map carries a tier no producer emits"*, with the rule *"no consumer
entry without a producer that emits it (no dead arm)."*

⚠ **THE HOST CARRIES A FROZEN `negativeAssertionAnchor` ROW OF 1** (live 1, at `:151`). The
obligation is two-directional — a new bare negative makes it 2 and reds; anchoring the
existing one makes it 0 and also reds. **This arm writes NO bare negative**
(`not.toContain|toMatch|toHaveProperty`), so the row is untouched at 1. ⚠ The compile stated
the re-point hosts carry 0 frozen and 0 live; that is **corrected by measurement** here.

## §6 · Declared terminals

| Figure | Expectation | Why |
|---|---|---|
| Same-seed goldens | **UNMOVED** | every removed token has ZERO producers (§1); no reachable input changes bucket |
| `convergence.js` effective lines | **≤ 798, never above** | hot file, headroom 2; measured before and after |
| Size baseline | **no entry added, no ceiling raised** | hot-file rule 3 |
| Both typecheck ratchets | **UNMOVED at 173/173, 1134/1134** | exact floors |
| `negativeAssertionAnchor` | **UNMOVED** (host frozen at 1, live 1) | no bare negative written |
| Lighting census | `titles` +N only | new `it()` blocks in an already-CREDITED file |

## §7 · ⛔ MANDATORY STOPS

1. **`convergence.js` effective lines exceed 798** → STOP. Never add a size-baseline entry,
   never raise the ceiling, never decompose it to make room.
2. **Adding `allied` to `FRIENDLY_REL`** → STOP. That is `CR-TE18-CONVERGENCEALLIED`, a
   generated-output change and a chair surface (§2).
3. **Removing `ally` from `FRIENDLY_REL`** → STOP. It is the instrument pointing at that
   defect and it stays, declared expected-dead (§2).
4. **Removing `defensive_pact` from any of its four readers** → STOP. Chartered orphan (§3).
5. **Touching `cordial` anywhere but `ALLY_LIKE`** → STOP; the fixtures are a negative
   control and this arm edits no fixture.
6. **Any membership ADDITION to any set** → STOP. This arm only removes.
7. **A new OSR finding, or either ratchet moving** → STOP.

## §8 · Acceptance cases

| id | case |
|---|---|
| A1 | `convergence.js` measures **≤ 798** effective lines after the edit, with eslint's own `Linter` |
| A2 | the habitat pin passes: every member of all six sets is reachable-by-named-producer or declared EXPECTED-DEAD |
| A3 | `defensive_pact` is still present in all four readers and pinned EXPECTED-DEAD-UNTIL `mutual_defense` |
| A4 | `ally` is still present in `FRIENDLY_REL` and pinned expected-dead with the `CR-TE18-CONVERGENCEALLIED` reason |
| A5 | `tests/domain/thirdPartyRansom.test.js`, `thirdPartyRansomLit`, `convergence`, `warAllianceRisk` pass unchanged |
| A6 | `tests/domain/conquestExecutionWr8.test.js` and `razingExecutionWr8.test.js` pass — the `cordial` negative control still holds |
| A7 | `tests/lint/vocabularyTotality.walker.test.js` passes whole, its frozen anchor row unmoved at 1 |
| A8 | `tests/lint/sizeBaseline.test.js` passes and gains no entry |

## §9 · Checks

```
npx vitest run tests/domain/thirdPartyRansom.test.js tests/domain/thirdPartyRansomLit.test.js
npx vitest run tests/domain/convergence.test.js tests/domain/warAllianceRisk.test.js
npx vitest run tests/domain/conquestExecutionWr8.test.js tests/domain/espionageDoctrine.test.js
npx vitest run tests/lint/vocabularyTotality.walker.test.js tests/lint/sizeBaseline.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
```
