# EM-R0b VERSION 3 — COMPILE REPORT (Opus COMPILE lane, session a9df403c, 2026-09-20)

## STATUS: **DRAFT, READY-able.** No premise refuted; the chair's question 4 answered NO twice, with a third finding that ships as three new checks.

**Files** (all under `$SP/lane-em-compile-EM-R0b-scratch/`):

- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-R0b-scratch/EM-R0b.md`
- `…/EM-R0b.manifest.json` · `…/EM-R0b.evidence.md` · `…/EM-R0b.compile.report.md`

Version 2's four files are kept beside them as `EM-R0b.v2.*`. The drafted `CHECK_META` leaf is
`tools/r0b-checkmeta.mjs`; the new harness is `tools/r0b-v3*.mjs`.

⚠ **Version 2's harness pointed at `read-tip-e5bdfd031`** (`instrument.mjs`, `r0b-placement.mjs`,
`r0b-manifest-equality.mjs`). All three were re-pointed and **no version-2 figure was carried** —
every one was re-executed at 32602dc60, which is the chair's instruction (d). Tree `rev-parse` and
`status --short` checked at both ends: `32602dc60`, clean.

---

## (a) `CHECK_META` — shipped, total, and it corrects a count nobody had encoded

```
declared checks=33  CHECK_META rows=33
⛔ checks with NO row (the totality red): none
⛔ rows naming no declared check       : none
distinct top-level keys named: 14 (activeConditions conflicts defenseProfile economicState
   economicViability generationCoherenceReceipt history institutions isolationSupport npcs
   powerStructure relationships stress stressors)
⛔ keys absent from EM-R0a v2's register, or a path whose head its keys[] omits: none
checks whose keys are ALL present on at least one corpus row: 33/33
```

Three arms, all clean: totality **both directions**; every key a row names is a key EM-R0a v2
classes **and** no `paths` entry heads at a key its own `keys[]` omits; every row's key set is
reachable together on a real record. `Violation` gains `keys`, and the corpus's one real violation
emerges as `V-SUMMARY-DEPS kind=prose-count keys=["economicViability"]`.

⭐ **The table corrected a count.** A naive `keys.length > 1` reads **8** cross-key checks; v2's §5.4
says **seven**, and v2 is right. `V-FLAGVEC` names `economicState` and `powerStructure` and relates
**neither to the other** — two independent arms under one id. Escalating it at both keys would take
`powerStructure` from `R1` because the FOOD card disagreed, the opposite of the minimal move §22.2
item 3 requires. **Contract:** a row may declare `arms`; a violation carries the keys of **the arm
that fired**, never the union; `CROSS_KEY_CHECKS` is DERIVED as "no `arms` and more than one key" —
and that derivation reproduces v2's seven exactly. A2 asserts it against the literal seven ids, so a
hand-edit that adds an eighth reds.

**EM-R0c's STOP-4 is discharged**: `recordInvariants.js` re-exports `CHECK_META` from the new data
leaf, so EM-R0c's compiled import — `import { recordInvariants, CHECK_META } from
'./recordInvariants.js'` — is satisfied verbatim and EM-R0c needs no re-cut.

## (b) The two new MIXED objects — **both answer NO**, and the measurement found a third shape

| object | candidate relation | verdict |
|---|---|---|
| `defenseProfile.scores` | `disaster` a function of the other five | ⛔ **REFUTED** — 4 ambiguous tuples of 82 |
| | four arithmetic identities over the six scores | ⛔ each holds **0 of 525** |
| | `readiness.score` a function of the six | not refuted (86 tuples, 0 ambiguous) — but **no exact relation found**, so nothing may convict |
| `history.founding` | `overcoming` a function of `initialChallenge` | ⛔ **REFUTED** — 4 of 9 ambiguous |
| | `overcoming` a function of `reason` | ⛔ **REFUTED** — 9 of 17 ambiguous |

⇒ **Both of EM-R0c's MIXED readings are LAWFUL and no group is owed for either.** Recorded as the
chair asked, with the measurement.

⭐⭐ **But measuring them found THREE leaves that hold ONE fact at TWO record paths, 525/525:**

```
defenseProfile.scores.magicDependency === defenseProfile.magicDependency   same=525 diff=0
defenseProfile.scores.traditions      ≡   defenseProfile.traditions        same=525 diff=0
history.founding.age                  === history.age                      same=525 diff=0
```

**and the merge can put every pair out of step, 63/63, with a control that splits nothing:**

```
rows=63  merged record AGREES=0  ⛔ SPLIT=63      (each of the three)
the control — with R0 ≡ R1 (no edit): splits=0
```

So three new checks ship, **30 → 33** — `V-DEFENSE-MAGICDEP`, `V-DEFENSE-TRADITIONS`,
`V-HISTORY-AGE` — each with a control clean on 63/63 plain records and a mutant that convicts 63/63
and trips **no other check**. This is a version-3 scope addition taken inside this module's own
layer; it is vetoable in one line and the budget holds with room.

⛔ **A GROUP CANNOT CLOSE TWO OF THE THREE.** EM-R0a v2's walker forbids a group root nested inside
another's, and `G7 defense-readiness` is rooted at `defenseProfile.readiness`; a group rooted at
`defenseProfile` would nest it. A group rooted at `history` WOULD be legal — that is question 1.

## (c) The food card — untouched, and untouched *because re-measured*

```
D4 published deficitPct in (15,20]: 36 rows — isPressured=12 isDeficit=24 neither=0  (v2: 36/12/24)
D5 Secure→isSecure(117) · Pressured→isPressured(151) · Import-Dependent→isDeficit(196)+isPressured(12)
   · Deficit→isDeficit(13) · Deficit — Active Famine→isDeficit(36)
D6 5 labels at 525; the 63-stride loses none
```

The rounding tolerance and the DECLARED flag table stand exactly as v2 ruled, because every fact
that forced them re-measures identically at this tip.

## (d) Every other v2 headline figure, re-executed at 32602dc60

```
CONTROL  525 rows, 1 violating row, and it is the KNOWN pin           (v2: 1 of 525)   ✓
D1 stress ≡ stressors                            525/525              (v2: 525/525)    ✓
D2 readiness.label === readinessBandOf(score)    525/525              (v2: 525/525)    ✓
D3 lines naming "readiness" in rulingStructure.js      0              (v2: ZERO)       ✓
D7 judgments[].evidence[path=simulationTrace]: 525 entries, 525 undefined  (v2: 525/525) ✓
```

**Every version-2 figure holds at this tip, to the row.**

---

## Budget

| leaf | v2 | v3 | cap |
|---|---:|---:|---:|
| `recordInvariants.js` | `≤ 215` | `≤ 230` | 250 |
| `recordInvariantFlags.js` | `≤ 40` | `≤ 40` | 250 |
| `recordInvariantMeta.js` ⭐ NEW | — | `≤ 70` (**measured 64**) | 250 |
| total effective production lines | `≤ 300` | **`≤ 340`** | 400 |
| new logic-bearing leaves | 1 | **1** (both data leaves take no branch) | 2 |
| handwritten files | 3 | **4** | 12 |
| acceptance cases | 8 | **8** (A2 re-cut, not added) | 8 |
| worker / first-paint bytes | 0 / 0 | **0 / 0** | — |

A2 is re-cut rather than added: v2's A2 (the pin bites both ways) folds into A1, which already
asserted the violating-row set equals `KNOWN_VIOLATIONS` in both directions — the estate's own
anti-vacuity rule that a redundant second guard subsumes the first. The freed slot carries the
`CHECK_META` arm.

## Register deltas — all unchanged from v2

Lighting **`files +1 · credited +1 · suiteTitles +1 · titles +8`** (v3 adds no test FILE and keeps
eight arms; no absolute quoted). Mutation-coverage **no row**. prose-numerics, wiring-census
`stamp.files`, `path:line` citations **all nil — v3 MODIFIES no `src/` file**. Worker `0 B`,
first-paint `0`, edge-shared **none**. Observed-shape: **priced, red-first at the build, now over
THREE leaves**.

## §7 ⟷ JSON, and requiredSymbols

```
SET-EQUAL: True · actions all in PACKET_ACTIONS · acceptanceCases 8 {id, case} · checks 5, no generator · retiredSymbols []

src/domain/activeConditions.js                export function severityBand                -> 2  ⚠
tests/helpers/goldenMasterCorpus.js           export function goldenCorpus                -> 1
tests/helpers/goldenMasterCorpus.js           export const keyOf                          -> 1
src/generators/generateSettlementPipeline.js  export function generateSettlementPipeline  -> 1
tests/build/domainGeneratorsBoundary.test.js  const BASELINE_EDGES                        -> 1
src/data/bandLadders.js                       export function legitimacyBandOf            -> (absent) [EM-R0d]
src/domain/edit/recordRegister.js             export const RECORD_CLASSES                 -> (absent) [EM-R0a, NEW at v3 — A2 reads it]
```

⚠ **The `severityBand` count of 2 is a substring artefact**: one declaration at `:541` plus a
separate plural sibling `severityBands()` at `:1009` that `grep -cF` matches as a prefix. Named so a
reviewer does not read it as a double declaration.

---

## Questions only the chair can answer

**1. `V-HISTORY-AGE`, or a `history` group — or both?** `history.founding.age ≡ history.age` on
525/525, and the merge splits them 63/63. A consistency group `{ id: 'founding-age', root: 'history',
members: ['founding.age', 'age'] }` would be LEGAL (EM-R0a v2 declares no group under `history`) and
would PREVENT the split; the check DETECTS it at runtime. The two defence pairs have no group option
at all — a root at `defenseProfile` would nest `G7 defense-readiness`. **Recommended: ship all three
checks (this packet) AND add the `history` group to EM-R0a**, which is the division §22.2 item 3
draws — the group is the merge's prevention, the check is the guard for a DM edit outside the corpus.
It is a question, not an edit to EM-R0a.

**2. Does v3's 30 → 33 stand?** The three checks are measured (control 63/63, mutant 63/63,
isolating), the budget holds at ≤340 of 400, and they close a gap nothing else reaches. But they are
a scope addition the chair did not explicitly order, so it is stated here for a one-line veto rather
than buried in §5.4.

**3. Should the duplication sweep be exhaustive before EM-R0c builds?** Three duplicated leaves were
found by inspecting the two objects the merge happened to mix; a whole-record sweep for "one fact at
two paths" over 525 rows has never been run. **Recommended: EM-R7 carries it** (it already walks
every record path), not this packet — but if the chair wants the census before the merge lands, it is
a bounded parallel lane.

---

## ⛔ EVERYTHING NOTICED AND NOT TOUCHED — each specific enough to slot

1. ⭐ **The duplication sweep is not exhaustive** (question 3). Three found by inspection, not by a
   census. → **SLOT: EM-R7's corpus ratchet gains a duplication pass** over the walk it already does.
2. ⭐ **`readiness.score` is not refuted as a function of the six defence scores** (86 distinct
   tuples, 0 ambiguous) but no exact relation was found, so no check may ship. If a relation exists,
   the guard is missing a real invariant. → **SLOT: EM-R7 records the observation count** so the
   evidence either strengthens into a check or is recorded as coincidence.
3. ⭐ **`src/domain/activeConditions.js:1009` exports `severityBands()`** — a plural sibling of the
   band producer this packet imports, named by no packet and read by nothing in the EM family. →
   **SLOT: EM-R0d's second version** names it beside the severity ladder it already owns, or records
   it as a non-consumer.
4. **v2's harness silently pointed at a dead tree.** `instrument.mjs`, `r0b-placement.mjs` and
   `r0b-manifest-equality.mjs` all named `read-tip-e5bdfd031`; a successor quoting their outputs
   would have shipped figures from another commit. This is the SECOND lane to hit it (EM-R0c's
   compile hit the same thing in its own scratch). → **SLOT: the kit's recon-prototype harness should
   read `TREE` from an env var with no default**, so an inherited script cannot silently measure the
   wrong tree. One line, and it removes the habitat.
5. ⛔ **A vacuous falsifier was written and caught.** The first split arm mutated `R0` at BOTH paths,
   so both landed on the record's own value; it printed `SPLIT=0` and proved nothing. Recorded in the
   packet's `CANNOT-CATCH` block so the construction cannot be rebuilt wrong. → no slot; it is
   written down.
6. **`_provDefLabel` in `rulingStructure.js`** is still a sixth, undeclared spelling of the readiness
   vocabulary omitting `Fortress`, re-confirmed at this tip (0 lines naming `readiness` in that
   file). → **EM-R0d's second version**, already slotted.
7. **`V-FOODSEC-FLAGS` covers four of the six food labels** and silently abstains on
   `Import-Dependent` and `Deficit — Active Famine`, where `V-FLAGVEC` is the sole check. → written
   into §6; no separate slot.
8. **The `V-EVIDENCE-*` carrier counts range 242–525 of 525**; `V-EVIDENCE-CONFLICT` is exercised by
   fewer than half the corpus. → **EM-R7's ratchet records the carrier count beside each check**, so
   a check that stops being exercised is visible.
9. **`judgments[…].evidence[path=simulationTrace]` is `undefined` on 525 of 525** and no shipped
   check reads it. → EM-R0c's compile owned this and **ANSWERED it**: the receipt is merged, never
   recomputed.
