# Foreign Policy / GR-3B — peacetime term producers

- **Status:** `LANDED`
- **Landed:** `40afbdd6` (2026-08-10; 8/8, 13/14 mutants killed + one found-and-fixed, coupling identity = base, 0-of-52 introduced, the declared shared-threat pair shift measured and controlled)
- **Promotion (chair, 2026-08-10):** GR-3B-ORIENT LANDED at `d56d944c` — the
  sequencing dependency is DISCHARGED and this packet goes READY at CR-FP-ORDER
  position 3, the chain's last link. Original block note follows:
- **Blocked on (historical):** `GR-3B-ORIENT`'s **landing SHA**, which is still unassigned. Every
  *decision* this packet needed is now closed: CR-GR3B-1/2/4 supply the ladders, the
  selection function and the composable pair, and **CR-GR3B-3-R1 supplies the obligation
  direction** (§6.7). The block is purely a **sequencing** dependency on an unlanded
  packet, not an unmade decision.
- **Packet version:** `3` (version 2 restamped against CR-GR3B-3-R1 and re-verified at
  a new base; the §6 direction contradiction version 2 escalated is **resolved**)
- **Verified base:** `claude/composite-r4` at `0f78d9c8402b177d0786b7da6e9ead533d7af42d`
- **Base note:** restamped at promotion; the commits since `820ed989` (ORIENT `d56d944c`, IN-0c `29e2dc3c` + records) touch NO GR-3B target — pactFormation.js, pactAmendment.js and the three test homes are byte-unchanged since authoring (verify at preflight)
- **Last revalidated:** `2026-08-10` at `820ed989`
- **Depends on:** `GR-3B-ORIENT` at `d56d944c56b6b52f945e8d84f4beb46f7cec636f` (LANDED); landed GR-2
  `a18fdcfae46836f1d41294d6712cc11f3349d64c`, GR-2 repair
  `91075d457859601ae32f5e5bf989f70d7fcfd28a`, GR-3a
  `0be4800dbf9fe70d1291c0cf1619394e6945853d`, strict repair
  `2a05ce5fecfcbe8c9e5b66e5ab6a520432bc6b2d`
- **Collision group:** `NONE`. ⚠ **This changed with CR-GR3B-3-R1.** Version 2 shared
  `pactFormation.js` with `GR-3B-ORIENT` because that packet was going to write a
  persisted proposer field there. R1 needs **no persisted field**, so ORIENT's targets
  are now `treatyOrientation.js`, a new `treatyTermRoles.js` leaf and
  `peaceTerms.js` — **none of which this packet touches**. The **sequencing** dependency
  stands (§1); the file collision is gone. `peaceTermsGrantTerms.test.js` is this
  packet's edit target and ORIENT's **run-only** target — still an ordering constraint,
  not a shared edit, and **not** a `validate:packets` change-path collision, because a
  run-only test never enters a `changeManifest`. (`GR-3B-ORIENT` and `IN-0C` *do* collide
  there, over `peaceTerms.js`; this packet does not participate — see
  `gb-IN-0C.md` §7a.)
- **Commit authority:** `NONE — implementation prohibited while BLOCKED`
- **Baseline posture:** version 1 recorded focused GR suites at `4 files / 89 tests`,
  exit `0`, measured at `2c810d16`. **That figure is NOT inherited** — it was measured
  at a different base and this compile did not re-run it. The implementer captures its
  own baseline at step 1. Full gate, typecheck ratchets, goldens and bundle were not
  run at this compile.

> **⚠ BASE DRIFT DURING AUTHORSHIP, DECLARED — AND IT IS A SOURCE DELTA THIS TIME.**
> Version 2 was stamped `e1f4c654`. The shared tree then advanced twice: `5066c34b`
> ("TC-3a: the wards get their names…") landed **12 source and test files**, and
> `820ed989` ("TC-3a → LANDED…") followed. `e1f4c654` is an ancestor of `820ed989`, and
> `git diff --name-only e1f4c654..820ed989 -- src tests` returns 12 paths, **all
> `townCartography` / `townScene`** — **not one foreign-policy file.** Every measurement
> below was **re-executed at `820ed989`**: the size census (`pactFormation.js` 385,
> `pactAmendment.js` 113 — unchanged), the target-clean preflight, and the catalog
> table. **The working tree is now CLEAN — zero dirty paths.**

## 1. Dispatch verdict and reconciled authority

**Do not dispatch. One dependency is unmet: `GR-3B-ORIENT` has not landed.**

The block has changed **twice** and is now at its narrowest. Version 1 was blocked on
four unmade decisions. Version 2 was blocked transitively on an **owner** park, because
CR-GR3B-3's derivational premise failed its verify-at-compile. **CR-GR3B-3-R1 dissolved
that park**: the obligation axis is the per-term `beneficiary` the record already
carries, so no persisted field is needed and the chair could rule it.

**What remains is sequencing, not decision.** `GR-3B-ORIENT` must land first because it
is what makes a drafted transfer term *execute*: until PASS 2 resolves the per-term
obligor, a negotiated `resource_share`, `temple_restitution` or `settlement_provision`
resolves to empty payer and payee ids and moves **nothing**. Drafting the two transfer
terms before that is drafting dead clauses, which is exactly what F-S1-E3's ban exists
to prevent.

Authority, in order:

1. Live code at `820ed989` — re-verified row by row in §5; every row HOLDS.
2. `PACKET_STANDARD.md` — selection, ordering, lifecycle and ownership must be exact.
3. CR-GR3B-1, CR-GR3B-2, CR-GR3B-4 and **CR-GR3B-3-R1** (F-SURVEY-1 row,
   `docs/FABLE_VALIDATION_QUEUE.md`) — candidate sets, selection function, composable
   pair, and the obligation direction. All four are transcribed into §6 as operative
   data.
4. F-S1-E3 — the transfer-term drafting ban is SUSTAINED **until `GR-3B-ORIENT` lands**,
   and that packet is this recompile's HARD dependency.
5. F-S1-E2 — `reparations` becomes an explicit seam row on the **J-GR-14a war-end
   appraisal lens** wave. **That is not this packet.** The `CHAIR` row in
   `PRODUCER_OWED` stays exactly as it is here.

Resolved contradictions:

- Version 1 §3 B1 ("candidate membership and rung selection are unset") → **CLOSED**
  by CR-GR3B-1/2, §6.1–6.2.
- Version 1 §3 B3 ("composability is named but not executable") → **CLOSED** by
  CR-GR3B-4, §6.4.
- Version 1 §3 B2 ("negotiated transfer terms lack an obligation axis") → **CLOSED** by
  CR-GR3B-3-R1, §6.7. The axis is the per-term `beneficiary`. Implementing it is
  `GR-3B-ORIENT`'s job, not this packet's.
- **Version 2 §6's escalated contradiction — CR-GR3B-3's `obligor = proposer` against
  the shipped receipt's opposite direction — is RESOLVED in favour of live code.**
  CR-GR3B-3-R1 rules **obligor = the counterparty**, which is what
  `draftPactSheet`'s receipt template has always written
  (`` `${beneficiary === fromId ? toId : fromId} promises … to ${beneficiary}` ``,
  `pactFormation.js:269`). The two authorities agree; the packet no longer withholds
  anything on that account.
- Version 1 §4's "the owner may not avoid item 3 by omitting the two transfer terms
  or redefining GR-3B as a smaller slice" → **REAFFIRMED**. See §3.

## 2. Outcome

**Observable result:** a peacetime crossing drafts the clause its evidence has earned
— a faint occasion writes the lightest term in its family, a strong one writes the
heavy term — and a strong shared-threat crossing writes the non-aggression /
mutual-defense pair onto one instrument.

**Definition of done:** all nine GR-3b rows of `PRODUCER_OWED` are deleted, the
register keeps its one `CHAIR` row, and no catalog row is homeless.

In scope:

1. one primary behavior — per-trigger rung ladders and the score→rung selection;
2. one required integration — the drafted set is ordered through `orderTermsByAsk`,
   and the composable-pair exception at the amend door;
3. one prevention guard — the `PRODUCER_OWED` discharge is proved by the live walker,
   not by a restated list.

Explicit non-goals:

- GR-4, GR-5 (`renewal` stays an empty ladder), later grammar waves;
- tuning or soaking any band, including the six new rung bounds;
- the `reparations` seam declaration (F-S1-E2, rides J-GR-14a);
- widening `treatyOrientationOf`, `TREATY_ORIENTATION_KINDS`, or any persisted shape;
- the war door's `draftTerms` / `CLASS_TERM` producer;
- lighting `pactFormationEnabled` anywhere it is not already lit.

Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Why the nine-row denominator may not be split

A measured temptation, named here so it is refused explicitly rather than
rediscovered mid-implementation:

`temple_restitution` and `settlement_provision` are the **only two** of the nine owed
rows with `executor: 'transfer'`. The other seven are `executor: 'grant'`, and
`treatyEnforcement.js:grantTermFor` resolves a grant by reading the term's own
`beneficiary` — it consults `treatyOrientationOf` **only** when `beneficiary` is
absent, which never happens on a negotiated term (`:233`). So seven of the nine would
work today with no orientation at all.

⚠ **And that read is now recognisable as CR-GR3B-3-R1's axis, already shipped.**
`grantTermFor` has always treated the per-term `beneficiary` as who-holds-the-right
(`beneficiary === 'both' || beneficiary === grantee`), and `pactAmendment.js`'s
`stackingCellOf` has always keyed identity on `` `${family}|${beneficiary}` ``. R1 does
not invent an axis; it **rules that the axis the enforcement layer already uses is the
obligation axis**, and `GR-3B-ORIENT` makes PASS 2 agree with the enforcement layer
rather than the reverse. That is why the ruling needs no persisted field — and it is a
second, independent reason the nine-row denominator is one wave: the grant half and the
transfer half read the **same** datum.

**They are still not splittable.** Version 1 §4 states it directly: *"The owner may
not avoid item 3 by omitting the two transfer terms or redefining GR-3B as a smaller
slice. The nine-row denominator remains whole."* F-S1-E3 SUSTAINED the ban on the
same two terms. A seven-row GR-3B would leave two catalog rows homeless and two
`PRODUCER_OWED` rows undischarged, which is the exact accounting this wave exists to
close.

The split is recorded as **available and refused**, not as unnoticed.

## 4. Hard scope budget

| Limit | Packet budget | Basis |
|---|---:|---|
| Behavior families | `1` | rung selection at the draft |
| New persisted record families | `0` | ladders are authored constants |
| Named state writers | `0` | no new writer; `signPactProposal` unchanged |
| Feature flags | `0` | rides the existing `pactFormationEnabled` |
| User-facing surfaces | `0` | receipts only, existing vocabulary |
| Direct consumers | `1` | `advancePeacetimePacts` |
| New logic-bearing production leaves | `0` | |
| Existing logic-bearing production files modified | `2` | version 1 §5 envelope |
| Additional registration-only files | `0` | |
| Handwritten files total | `5` | 2 production + 3 test |
| New/changed effective production lines | `<=85` | re-derived in §7; envelope allowed 180 |
| Delta in a shared/hot file | `n/a` | neither target is baselined or hot — §5 |
| Acceptance cases | `8` | §9 |

Overrides approved before dispatch: `NONE`.

## 5. Verified tree contract

Re-verified at `820ed989`; all rows HOLD, no drift. Navigate by symbol.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Gate | `src/domain/worldPulse/pactProposals.js` | `pactFormationActive` | Strict `rules.pactFormationEnabled === true`; the only by-name read in the tree | Reuse; no new flag |
| Trigger DTO | `src/domain/worldPulse/pactTriggers.js` | `PactTriggerCrossing` | **JSDoc typedef, not a runtime export**; members exactly `trigger`, `score01`, `crossed`, `receipt`, `subject` | Read `score01` from the crossing |
| Trigger vocabulary | same file | `PACT_TRIGGERS` | `['faith_communion','migration_pressure','renewal','shared_threat','trade_demand']` | Ladder table must be total over it |
| Crossing order | `src/domain/worldPulse/pactFormation.js` | `crossingsFor` | `.sort((a,b) => (b.score01 - a.score01) \|\| codepoint(a.trigger,b.trigger))` | Unchanged |
| Current choice | same file | `advancePeacetimePacts` | Uses `crossings[0]`; calls `draftPactSheet({trigger,fromId,toId,reciprocal,tick})` — **passes no score** | Add `score01` only |
| Producer | same file | `PACT_DRAFT_LENS`, `draftPactSheet` | Lens maps each trigger to ONE string; faith/migration/renewal rows are `''` | Replace per §6 |
| Ask order | `src/domain/worldPulse/peaceTermsCatalog.js` | `orderTermsByAsk` | Drops unknown types, dedupes via `Set`, sorts `weight` then codepoint; **zero production consumers** — grep over `src/` returns only its own definition and docstring | **Become its consumer** |
| Catalog | same file | `TERM_CATALOG` | All nine owed rows present; weights/executors in §6.5 | Read; never edit |
| Stacking | `src/domain/worldPulse/pactAmendment.js` | `stackingCellOf`, `amendPactInstrument` | Cell is `` `${family}\|${beneficiary}` ``; every second occupied cell refused; **no composable exception** | Extend per §6.4 |
| Orientation | `src/domain/worldPulse/treatyOrientation.js` | `treatyOrientationOf`, `TREATY_ORIENTATION_KINDS` | `['unknown','wartime','sale']`, **pinned exactly** by `treatyOrientationWr10g.test.js:237-238` together with `TREATY_ROLE_WORDS`' key set. A negotiated pact resolves `unknown` with empty ids. ⚠ **`TREATY_ORIENTATION_KINDS` does NOT gain `negotiated`** — under CR-GR3B-3-R1 the per-term reader carries its own closed vocabulary | **Do not touch** — ORIENT owns it |
| Per-term axis | same file | `termObligationOf`, `TERM_OBLIGATION_KINDS` | **DOES NOT EXIST YET** — `GR-3B-ORIENT` creates it. Obligee = the term's `beneficiary`; obligor = the counterparty; `'both'` = mutual | **Do not touch, do not anticipate** — this packet drafts terms, it does not read obligation |
| Grant reader | `src/domain/worldPulse/treatyEnforcement.js` | `grantTermFor` | `beneficiary === 'both' \|\| beneficiary === grantee` wins; orientation consulted only when `beneficiary` is absent (:233) | Why the 7 grants need no orientation (§3), and the shipped precedent R1 generalizes |
| Treaty mover | `src/domain/worldPulse/peaceTerms.js` | `advanceTreaties` PASS 2 | Reads `orientation.obligeeId`/`obligorId` (:631-632); writes `treaty.defaultedBy = loserId` (:733) | **Do not touch** — `GR-3B-ORIENT` rewires this and its 10-line headroom is already spoken for |
| Debt guard | `tests/domain/peaceTermsGrantTerms.test.js` | `PRODUCER_OWED`, `producedTypes` | **10 rows total**: 9 `owingWave:'GR-3b'` + 1 `owingWave:'CHAIR'` (`reparations`). `producedTypes()` reads `Object.values(PACT_DRAFT_LENS).map(String).filter(Boolean)` | Discharge 9; **must adapt to the new lens shape** — §7 |
| Ask-order pin | same file | section E | Pins `orderTermsByAsk` as intentionally unconsumed; reds "the day GR-3b wires it" | Retire in the same commit |
| Test precedent | `tests/domain/pactFormation.test.js` | `'THE DRAFT LENS — and the tombstone tripwire under it'` | 24 tests / 12 describes; the tripwire block asserts the three empty rows and is a self-declared instruction to widen | Copy this proof shape |
| Test precedent | `tests/domain/pactAmendment.test.js` | `'THE STACKING CELL — and the war door is measurably unchanged'` | 24 tests / 7 describes | Copy this proof shape |
| Dormancy | `tests/property/pactFormationDormancyFence.test.js` | four fences + lit-mutant control | Reference identity, trace hash across absent/false/truthy, call-count spy, gate-polarity census | **Run; must stay green unmodified** |

**Measured size posture (effective lines, eslint `max-lines` semantics, counter
calibrated against pulseKernel's frozen 1580):**

| File | Effective | Ceiling | Headroom |
|---|---:|---:|---:|
| `src/domain/worldPulse/pactFormation.js` | 385 | 800 (layer) | 415 |
| `src/domain/worldPulse/pactAmendment.js` | 113 | 800 (layer) | 687 |

Neither file appears in `scripts/.size-baseline.json`. **No ratchet, budget or
ceiling may be raised by this packet.**

Forbidden alternatives:

- no second graph, ledger, classifier, time source, PRNG stream, or writer;
- no new top-level `worldState` key and no new `spatialLedgers` sub-ledger;
- **no orientation derived from party sort order, ledger-key order, `sworn` key order,
  proposer order, `receipts` text or `lineage` order.** ⚠ Version 1 §6 listed
  **beneficiary** alongside these; CR-GR3B-3-R1 **lifted that one clause and only that
  one** (§6.7). The rest stand, and party sort order in particular is measurably
  useless — the mint codepoint-sorts the pair, so it carries no direction at all;
- no edits to `peaceTerms.js`, `treatyOrientation.js`, `peaceTermsCatalog.js`,
  `treatyEnforcement.js`, `pactProposals.js`, `pactTriggers.js`, any flag, golden,
  baseline, migration, design doc, or registry;
- no files outside §7.

## 6. Exact contracts

### 6.1 The rung ladders — CR-GR3B-1, frozen data

`PACT_DRAFT_LENS` becomes a per-trigger ladder. Each rung is `{ min, terms }`; `min`
is an **inclusive** lower bound on the clamped score; `terms` is the exact term-token
list that rung drafts. **Non-cumulative:** a rung's list is the whole output, not an
addition to lower rungs. Every produced ladder starts at `min: 0`, which preserves
today's always-draft behavior for a crossed trigger.

```js
export const PACT_DRAFT_LENS = Object.freeze({
  faith_communion: Object.freeze([
    Object.freeze({ min: 0,    terms: Object.freeze(['shared_rite']) }),
    Object.freeze({ min: 0.45, terms: Object.freeze(['pilgrimage_right', 'tolerance_guarantee']) }),
    Object.freeze({ min: 0.7,  terms: Object.freeze(['missionary_access']) }),
    Object.freeze({ min: 0.9,  terms: Object.freeze(['temple_restitution']) }),
  ]),
  migration_pressure: Object.freeze([
    Object.freeze({ min: 0,    terms: Object.freeze(['migration_right']) }),
    Object.freeze({ min: 0.6,  terms: Object.freeze(['labor_compact']) }),
    Object.freeze({ min: 0.85, terms: Object.freeze(['settlement_provision']) }),
  ]),
  shared_threat: Object.freeze([
    Object.freeze({ min: 0,    terms: Object.freeze(['non_aggression']) }),
    Object.freeze({ min: 0.75, terms: Object.freeze(['non_aggression', 'mutual_defense']) }),
  ]),
  trade_demand: Object.freeze([
    Object.freeze({ min: 0,    terms: Object.freeze(['resource_share']) }),
  ]),
  renewal: Object.freeze([]),
});
```

Bounds are **AUTHORED LITERALS**. They are not derived from catalog weights and no
code may compute them from `TERM_CATALOG` — version 1 §6 forbids weight-as-threshold
and that prohibition survives verbatim.

⚠ These six bounds (`0.45`, `0.6`, `0.7`, `0.75`, `0.85`, `0.9`) are **UNSOAKED**,
exactly like every band in `PACT_FORMATION_TUNING`. §7 of the design owns them and
the owner signs them at the soak redo under THE PROMISE. This packet does not tune.

### 6.2 The selection function — CR-GR3B-2, exact

```js
/**
 * @param {string} trigger  a PACT_TRIGGERS member
 * @param {unknown} score01 the crossing's own score
 * @returns {ReadonlyArray<string>} the rung's term list, ask-ordered; [] when none
 */
```

1. `const s = clamp01(Number(score01))`. `clamp01`'s existing policy is
   `Number.isFinite(x) ? … : 0`, so **non-finite → 0** falls out of the existing
   primitive. Do not write a second clamp.
2. `const ladder = PACT_DRAFT_LENS[trigger] || []`. An unknown trigger yields `[]`.
3. Select the **highest** rung whose `min <= s`. Bounds are **inclusive at `min`**.
4. Ties are impossible — every `min` in a ladder is a distinct literal. No tie-break
   rule is authored, because authoring one would be unreachable code.
5. Output cardinality is **exactly** the selected rung's `terms.length`. Never a
   union of lower rungs.
6. The selected list is returned through `orderTermsByAsk(rung.terms)` — see §6.3.
7. An empty ladder (`renewal`) or an empty selection yields `[]`, and
   `draftPactSheet` returns `{ terms: [], refusal: 'no_draftable_family' }` exactly as
   it does today. **The refusal is preserved, not removed.**

Boundary table (the exact values the acceptance matrix pins):

| Trigger | `s` | Selected terms |
|---|---:|---|
| `faith_communion` | `0` | `['shared_rite']` |
| `faith_communion` | `0.44999` | `['shared_rite']` |
| `faith_communion` | `0.45` | `['pilgrimage_right','tolerance_guarantee']` |
| `faith_communion` | `0.7` | `['missionary_access']` |
| `faith_communion` | `0.9` | `['temple_restitution']` |
| `faith_communion` | `1` | `['temple_restitution']` |
| `migration_pressure` | `0.6` | `['labor_compact']` |
| `migration_pressure` | `0.85` | `['settlement_provision']` |
| `shared_threat` | `0.74999` | `['non_aggression']` |
| `shared_threat` | `0.75` | `['non_aggression','mutual_defense']` |
| `trade_demand` | any | `['resource_share']` |
| `renewal` | any | `[]` → `no_draftable_family` |
| any | `NaN` / `Infinity` / `undefined` / `'x'` | as `s = 0` |
| any | `-5` / `5` | as `s = 0` / `s = 1` |

### 6.3 Naming the consumption of `orderTermsByAsk`

CR-GR3B-1: *"The drafted set feeds `orderTermsByAsk` (GR-3a's shipped, deliberately
unconsumed ladder primitive — this is its intended consumer)."*

**The exact consumption site:** inside `draftPactSheet`, immediately after rung
selection and **before** beneficiary expansion, the selected `terms` array is passed
through `orderTermsByAsk(...)` and the frozen result drives the `beneficiaries.map`
emission order. This makes `pactFormation.js` the **first and only** production
consumer of that export, and requires a new import of `orderTermsByAsk` from
`peaceTermsCatalog.js` — a module `pactFormation.js` already imports
(`PEACE_TERMS_TUNING, TERM_CATALOG, termLabel`), so the named import is added to the
**existing** import statement and opens no new edge.

Only one rung emits more than one term per family, so the observable effect is small
and must still be pinned by driving the real primitive rather than restating its
order (the recorded derive-don't-restate class). Ask order at the two multi-term
rungs, by catalog weight:

- `faith_communion` @ `0.45` → `pilgrimage_right` (0.5) then `tolerance_guarantee` (0.6);
- `shared_threat` @ `0.75` → `non_aggression` (0.4) then `mutual_defense` (1.0).

### 6.4 The composable pair exception — CR-GR3B-4, closed

```js
/** The ONE composable security pair. Frozen, exactly two members, and the only
 *  exception `amendPactInstrument` grants. Never a general stacking rule. */
export const COMPOSABLE_SECURITY_PAIR = Object.freeze(['mutual_defense', 'non_aggression']);
```

`amendPactInstrument`'s collision check gains exactly one exception: a term whose
`stackingCellOf` is already occupied is nonetheless **admitted** when

- the incoming term's `type` is a `COMPOSABLE_SECURITY_PAIR` member, **and**
- every term already occupying that exact cell — whether pre-existing on the
  instrument or admitted earlier in this same call — is the **other** pair member,
  **and**
- no term of the incoming term's own `type` already occupies that cell.

Behavior, closed:

| Arrival | Result |
|---|---|
| `non_aggression` live, `mutual_defense` arrives | **admitted** |
| `mutual_defense` live, `non_aggression` arrives | **admitted** (both orders) |
| both arrive in one draft, cell empty | **both admitted** — the second is not refused against its own sibling |
| `non_aggression` live, `non_aggression` arrives | **refused** — existing duplicate law, unchanged |
| `mutual_defense` live, `mutual_defense` arrives | **refused** |
| a third security term (e.g. `demilitarization`) arrives on an occupied security cell | **refused** — no general rule |
| any non-security family collision | **refused** — untouched |
| a war-end term (no `beneficiary`, cell `` `security\|` ``) | **untouched** — the war door's behavior is byte-identical |

⚠ **MEASURED ASYMMETRY, DECLARED, NOT REPAIRED HERE.** `signPactProposal`'s **mint**
branch does not call `amendPactInstrument` — it writes `terms` directly — so a fresh
mint carrying both pair members never reaches a stacking check at all. The exception
therefore makes the **amend** door agree with the **mint** door rather than
loosening it. The "third security term is refused" law is guaranteed on the draft
side by construction, because the ladders in §6.1 are frozen data that never emit a
third security term. Do not add a stacking check to the mint branch under this
packet; record it in the receipt if it matters to a later wave.

### 6.5 Catalog rows consumed (read-only; re-verified at `820ed989`)

| Token | family | weight | baseMag | baseYears | stream | executor |
|---|---|---:|---:|---:|---|---|
| `shared_rite` | faith | 0.4 | 1.0 | 6 | false | grant |
| `pilgrimage_right` | faith | 0.5 | 1.0 | 5 | false | grant |
| `tolerance_guarantee` | faith | 0.6 | 1.0 | 8 | false | grant |
| `missionary_access` | faith | 0.8 | 1.0 | 4 | false | grant |
| `temple_restitution` | faith | 0.9 | 0.35 | 3 | **true** | **transfer** |
| `migration_right` | population | 0.6 | 1.0 | 5 | false | grant |
| `labor_compact` | population | 0.8 | 1.0 | 4 | false | grant |
| `settlement_provision` | population | 1.0 | 0.3 | 3 | **true** | **transfer** |
| `non_aggression` | security | 0.4 | 1.0 | 8 | false | war_block |
| `mutual_defense` | security | 1.0 | 1.0 | 8 | false | grant |
| `resource_share` | economic | 1.0 | 0.5 | 4 | **true** | transfer |

### 6.6 Beneficiary expansion — AFTER selection

CR-GR3B-2: *"beneficiary expansion AFTER rung selection (per-term at mint)."*

`draftPactSheet` currently computes `symmetric` once from a single `type`. It must
compute it **per term**: `symmetric = TERM_CATALOG[type].family === 'security'`, then

- symmetric → `beneficiaries = ['both']`;
- otherwise → `reciprocal ? [fromId, toId] : [fromId]`.

Every other per-term field (`magnitude`, `mintedTick`, `expiresTick`, `weightSpent`,
`complianceState`, `trueState`, `burden01`, `beneficiary`, `receipt`, the
`stream` pair, the `seam` flag) is emitted by the **existing** code path unchanged.
`magnitude` remains `round4(spec.baseMag * F.PEACETIME_MAGNITUDE01)`.

### 6.7 What the drafted `beneficiary` MEANS — CR-GR3B-3-R1

**No code in this packet reads obligation.** This section exists because §6.6 writes the
field that *is* the obligation axis, and an implementer who does not know that can
"tidy" the beneficiary expansion into something that quietly inverts every negotiated
clause in the world. The direction, ruled:

> obligee = the term's beneficiary; obligor = the counterparty; payer = obligor, payee =
> beneficiary; capacity subject = obligor; monitor = obligee; defaultedBy = obligor.
> Symmetric beneficiaries ('both' / reciprocal) = MUTUAL obligation, no transfer
> direction.

In this packet's own vocabulary:

- **The proposer is the BENEFICIARY of what it asks for, and therefore the OBLIGEE — the
  party that is OWED. The counterparty GRANTS, and is therefore the OBLIGOR — the party
  that pays, is watched, and is named if the clause defaults.** A court that asks for
  restitution **receives** it.
- The already-shipped receipt says exactly this, in words, and it is the sentence
  `termLabel` writes today:
  `` `${beneficiary === fromId ? toId : fromId} promises ${termLabel(type)} to ${beneficiary}` ``
  (`pactFormation.js:269`) — executed output, alpha proposing to bravo:
  *"bravo_court promises resource share to alpha_court for 4 years."*
- **Symmetric ≠ reciprocal, and the difference is load-bearing.** `beneficiary: 'both'`
  is emitted **only** when `spec.family === 'security'` (§6.6) and means MUTUAL — both
  courts hold it, nothing is handed over. A **reciprocal** ask is not symmetric: it
  emits **two one-sided terms**, one per party, which resolve independently in mirrored
  directions. Never collapse the two.
- **The ladders never draft a transfer term symmetric.** The two `executor: 'transfer'`
  rows are `temple_restitution` (`faith`) and `settlement_provision` (`population`);
  neither is `security`, so neither can ever reach the `'both'` branch. The mutual case
  therefore never has a transfer direction to lose — which is what makes R1 total over
  everything §6.1's frozen ladders can emit.

⚠ **Version 1 §6's "never derive orientation from … beneficiary" is LIFTED for this axis
and only for this axis** — CR-GR3B-3-R1: that prohibition *"guarded an UNRULED choice;
this ruling DEFINES the axis, which is a different act."* Its two companions —
**never derive from party sort order, never from proposer order** — **stand unchanged**
and are re-imposed in §5's forbidden alternatives. Party sort order in particular is
measurably useless here: `signPactProposal` codepoint-sorts the pair at the mint, so the
ledger key, `parties` and `receipts` are byte-identical under swapping the proposer
(`gb-GR-3B-ORIENT.md` §3.5). The **terms** are not, and that is the whole point.

### 6.8 Flag, dormancy, lifecycle, receipts

- Flag: `pactFormationEnabled` — existing, virtual, read once by name in
  `pactProposals.js:pactFormationActive`. **No new flag.**
- Absent / `false` / any truthy-but-not-`true` spelling: byte-identical no-op, same
  worldState and settlementUpdates references. Unchanged by this packet.
- `true`: rung ladders are live. **This is an intended lit-path behavior change** —
  `faith_communion` and `migration_pressure` crossings that today receipt
  `pact_not_drafted` / `no_draftable_family` will now draft. That is the wave.
- Golden posture: **UNCHANGED.** No golden may move. `pactFormationEnabled` is
  virtual and unlit in every preset, so no same-seed campaign shifts. **Unexpected
  golden motion is a STOP**, never a regeneration.
- Persisted shape: **no change.** Terms carry the same keys they carry today.
- Lifecycle: the drafted sheet rides the existing proposal → sign → prune path with
  no new state. No migration, no import change, no undo interaction.
- Receipts: **zero new kinds.** `pact_proposed`, `pact_not_drafted`, `pact_signed`,
  `pact_refused`, `pact_no_overlap`, `pact_expired`, `pact_broken_by_war` and
  `term_refused_stacking` are the existing closed set and none is added or removed.
  The per-term `receipt` sentence is produced by the existing `termLabel` path.
- Alignment: `DECLARED EMPTY` — a drafted clause is engine evidence, not a moral act.
- Edit story: the existing `PROPOSE_PACT` verb path in `pactProposals.js` supplies
  its own sheet and **does not call `draftPactSheet`** (censused: `draftPactSheet` has
  exactly one production caller). DM parity is unaffected and that file is untouched.

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/worldPulse/pactFormation.js` | `PACT_DRAFT_LENS` | `+30 eff` | Replace the five string rows with the frozen rung ladders in §6.1 verbatim; rewrite the docblock's tombstone paragraph to describe the ladder, keeping the `@enforced-by` lines |
| `MODIFY` | same file | `draftPactSheet` | `+30 eff` | Accept `score01`; select per §6.2; pass the rung list through `orderTermsByAsk`; expand beneficiaries per term per §6.6; preserve the `no_draftable_family` refusal exactly |
| `MODIFY` | same file | import statement from `./peaceTermsCatalog.js` | `+0 eff` | Add `orderTermsByAsk` to the **existing** named-import list; do not add a new import line |
| `MODIFY` | same file | `advancePeacetimePacts` draft call | `+1 eff` | Pass `score01: best.score01` into `draftPactSheet`; change nothing else in the stage |
| `MODIFY` | `src/domain/worldPulse/pactAmendment.js` | `COMPOSABLE_SECURITY_PAIR` (new export) | `+4 eff` | Add the frozen two-member constant of §6.4 |
| `MODIFY` | same file | `amendPactInstrument` | `+16 eff` | Add exactly the one closed exception of §6.4; leave `stackingCellOf`, `closeTermsBrokenByWar` and `absorbWarEndIntoStandingPact` untouched |
| `TEST` | `tests/domain/pactFormation.test.js` | `'THE DRAFT LENS — and the tombstone tripwire under it'` | n/a | Replace the tripwire block per its own written instruction; add A1/A2/A4/A6/A7 |
| `TEST` | `tests/domain/pactAmendment.test.js` | `'THE STACKING CELL …'` | n/a | Add A5's eight-row closed table; assert the war-door cell is unchanged |
| `TEST` | `tests/domain/peaceTermsGrantTerms.test.js` | `producedTypes`, `PRODUCER_OWED`, section E | n/a | See the two required edits below |

**Total production delta: `<=81` effective lines** (30+30+0+1 on `pactFormation.js`
= 61 against 415 headroom; 4+16 on `pactAmendment.js` = 20 against 687 headroom).
Version 1's envelope allowed 180; this compile does not need it.

**Two required edits to `peaceTermsGrantTerms.test.js`, both non-optional:**

1. `producedTypes()` currently reads
   `...Object.values(PACT_DRAFT_LENS).map(String).filter(Boolean)`. Against the new
   shape that stringifies each ladder array and yields garbage tokens, silently
   breaking the census. It must become a flatten over the ladders' `terms`, e.g.
   `...Object.values(PACT_DRAFT_LENS).flatMap((ladder) => ladder.flatMap((rung) => rung.terms)).map(String)`.
   **This is the walker staying honest, not a convenience.**
2. Delete the **nine** `owingWave: 'GR-3b'` rows. **Keep the `owingWave: 'CHAIR'`
   `reparations` row and its entire comment block verbatim.** Update the length
   assertion from `10` to `1`. Retire section E's "intentionally unconsumed" pin —
   it is written to red the day GR-3b wires the primitive, and this is that day.

Generated artifacts: `NONE`.

No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch (§10).
1. Capture the baseline: run the §11 focused suite at the verified base and record
   its own file/test counts. Do not inherit version 1's `4 files / 89 tests`.
2. Add the failing tests for A1, A2 and A5 first — these are the three that can only
   be written against behavior that does not exist yet.
3. Implement the ladder data (§6.1) and the pure selection (§6.2) in
   `pactFormation.js`.
4. Wire `orderTermsByAsk` at the site named in §6.3.
5. Convert beneficiary expansion to per-term (§6.6); pass `score01` at the one call
   site.
6. Add `COMPOSABLE_SECURITY_PAIR` and the closed exception in `pactAmendment.js`.
7. Discharge the register and repair `producedTypes()` (§7) — **last**, so no guard
   is disabled before the behavior it guards exists (the recorded
   remove-the-census-row-LAST law).
8. Run focused verification (§11), then the wave-end gate, then the receipt.

The agent must not start by changing a golden, baseline, budget, or persisted shape.

## 9. Acceptance matrix — closed at 8

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main reachable behavior | each of the four produced triggers at `score01: 0` | rung-0 term drafts; a crossed trigger always drafts, as today | `pactFormation.test.js` |
| A2 | Boundary exactness | the full §6.2 boundary table | every listed `s` selects exactly the listed terms; `0.44999`/`0.74999` stay on the lower rung | `pactFormation.test.js` |
| A3 | Absent/dormant | flag absent, `false`, and a truthy-non-`true` spelling | the four dormancy fences stay green **unmodified**; same references, identical trace hash | `pactFormationDormancyFence.test.js` (run only) |
| A4 | Malformed-but-supported | `score01` = `NaN`, `Infinity`, `undefined`, `'x'`, `-5`, `5` | non-finite → rung 0; out-of-range clamps to `[0,1]`; never throws | `pactFormation.test.js` |
| A5 | Counterforce / duplicate | the eight-row closed table of §6.4 | each row's exact admit/refuse verdict; a refused row still receipts `term_refused_stacking` with its cell named | `pactAmendment.test.js` |
| A6 | Beneficiary expansion after selection — **and the direction it sets** | `faith_communion` @ `0.45` reciprocal and non-reciprocal; `shared_threat` @ `0.75`; the two `executor: 'transfer'` rungs (`faith_communion` @ `0.9`, `migration_pressure` @ `0.85`) | non-security → `[fromId,toId]` or `[fromId]` per term; security → `'both'`; term ids unique per `family\|beneficiary`. **Plus the §6.7 direction, asserted on the emitted rows: the drafted `receipt` names the NON-beneficiary as the promiser, and NEITHER transfer term is ever emitted with `beneficiary: 'both'`** — read off the real emitted terms, never restated from §6.7 | `pactFormation.test.js` |
| A7 | Real writer-to-reader integration | drive `orderTermsByAsk` itself over the two multi-term rungs | drafted order equals the primitive's own output — **derived, never restated** | `pactFormation.test.js` |
| A8 | Named historical regression | the `PRODUCER_OWED` census | nine GR-3b rows gone; the `CHAIR` `reparations` row **present**; `producedTypes()` non-vacuous and homeless set empty | `peaceTermsGrantTerms.test.js` |

This table is the entire edge-case budget. Do not add a cross-product.

## 10. Read-only preflight

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor <GR-3B-ORIENT landing SHA> HEAD

# Targets must be clean. Expect EMPTY.
git status --porcelain -- \
  src/domain/worldPulse/pactFormation.js \
  src/domain/worldPulse/pactAmendment.js \
  tests/domain/pactFormation.test.js \
  tests/domain/pactAmendment.test.js \
  tests/domain/peaceTermsGrantTerms.test.js \
  tests/property/pactFormationDormancyFence.test.js

rg -n 'PACT_DRAFT_LENS|draftPactSheet|crossingsFor|advancePeacetimePacts' \
  src/domain/worldPulse/pactFormation.js
rg -n 'stackingCellOf|amendPactInstrument' src/domain/worldPulse/pactAmendment.js
rg -n 'orderTermsByAsk|temple_restitution|settlement_provision|mutual_defense' \
  src/domain/worldPulse/peaceTermsCatalog.js
rg -n 'PRODUCER_OWED|GR-3b|orderTermsByAsk|producedTypes' \
  tests/domain/peaceTermsGrantTerms.test.js
# ⚠ THE ORIENT PREREQUISITE — check the per-term reader, NOT the instrument vocabulary.
# `TREATY_ORIENTATION_KINDS` must still read exactly ['unknown','wartime','sale']:
# it is pinned by treatyOrientationWr10g.test.js:237-238 and CR-GR3B-3-R1 does NOT
# widen it. What must EXIST after ORIENT lands is the per-term reader:
rg -n "export const TERM_OBLIGATION_KINDS|export function termObligationOf" \
  src/domain/worldPulse/treatyOrientation.js         # must now be PRESENT
rg -n "export const TREATY_ORIENTATION_KINDS" \
  src/domain/worldPulse/treatyOrientation.js         # must still lack 'negotiated'
```

**Reserved foreign dirt at this compile: NONE — `git status --porcelain` returned
EMPTY.**

⚠ **The 12-path town-cartography set reserved by versions 1 and 2 has LANDED**
(`5066c34b`, then `820ed989`), and the working tree is clean for the first time in this
packet's history. That does **not** retire the rule: the list was always a **snapshot,
not permission to ignore new dirt**. Re-run `git status` at dispatch and reserve
whatever is foreign then.

No packet in this set may touch, stage, restore, or attribute foreign files.

## 11. Verification commands

```sh
# Focused static checks
npx eslint src/domain/worldPulse/pactFormation.js \
  src/domain/worldPulse/pactAmendment.js \
  tests/domain/pactFormation.test.js \
  tests/domain/pactAmendment.test.js \
  tests/domain/peaceTermsGrantTerms.test.js
npm run typecheck:ratchet          # tsconfig.full.json
npm run typecheck:domain:strict    # tsconfig.domain-strict.json

# Focused tests — hold the slot for the WHOLE process, never a preflight then a run
sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh -n 120 \
  npx vitest run tests/domain/pactFormation.test.js \
  tests/domain/pactAmendment.test.js \
  tests/domain/peaceTermsGrantTerms.test.js \
  tests/property/pactFormationDormancyFence.test.js

# Sealed receipt and handoff; neither is landing authority
npm run check:packet -- GR-3B
npm run implementation:resume -- GR-3B

# Wave-end. NEVER pipe a gate.
npm run check:tail
```

Expected: every command exits `0`. Report **actual** counts; do not copy version 1's
`4 files / 89 tests`, which was measured at a different base and is not inherited.
`npm run check` is a 17-step `&&` chain — the receipt must name which steps ran.

## 12. Mandatory STOP conditions

Beyond `PACKET_STANDARD.md`, stop if:

- `GR-3B-ORIENT` has not landed, or `termObligationOf` / `TERM_OBLIGATION_KINDS` are
  absent from `src/domain/worldPulse/treatyOrientation.js` at HEAD;
- `TREATY_ORIENTATION_KINDS` **has** gained `negotiated`, or `TREATY_ROLE_WORDS` has
  gained a key — under CR-GR3B-3-R1 neither may move, and either would mean ORIENT
  landed a shape this packet was not compiled against;
- the owner **vetoes EP-s** (CR-GR3B-3-R1's active-with-veto status): the obligation
  direction reopens, `GR-3B-ORIENT` reverts to owner-blocked, and this packet is
  blocked behind it again;
- §6.7's direction disagrees with what `draftPactSheet`'s receipt template writes at
  HEAD — the two must always say the same thing;
- any target file is dirty or changed concurrently;
- `producedTypes()` or `PRODUCER_OWED` differs from §5's measured shape;
- the drafted magnitude, expiry, or any persisted term key would change;
- a golden, dormancy fence, ratchet or baseline moves — **never regenerate one**;
- the work would need a third production file, a new flag, a new writer, or more
  than 85 effective production lines;
- a third security term, or any non-pair composability, appears necessary.

The STOP report contains the smallest measured contradiction, its evidence, and a
proposed split. It contains no speculative repair.

Recompile this packet; do not adapt while coding.
