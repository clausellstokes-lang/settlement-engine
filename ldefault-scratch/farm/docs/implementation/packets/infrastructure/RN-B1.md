# INFRA / RN-B1 — the SIGNED legacy-live content cure (the train's LAST member)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `196b256a44dd6032e2684ed330aba437553bc91c`
  (RN-C's implementation commit)
- **Landed:** `9c8fe6cd` — chain: promotion `946dbd5b` → content `9c8fe6cd`, the train's
  terminal content commit. Battery green (8 files / 122 tests, exit 0 after the last edit);
  the SAME-SEED GOLDEN SUITE byte-identical at 87 files / 623 tests, exit 0; the first-paint
  budget re-verified against a real build with all three guards RUN (28/28); both typecheck
  ratchets at their exact floors 173/173 and 1134/1134; OSR, eslint and the anchor walker
  exit 0. Census re-derived WHOLE: `2438/364/2074/20206/5672`, `files` unmoved.
- **Train:** `rn-1`, member **4 of 4** — ⛔ **THE TRAIN'S LAST MEMBER, AND NEVER ITS GREEN
  PREFIX** (§64.2, the est-1 ordering law). It is ordered last precisely so that its
  owner-gated content can never strand the structural members in front of it.
- **Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` @ SHA-256
  `c691af9fe6ade05097857699829771062058b289e55e0445aba2eee9498e64fa`
- **Predecessor:** `RN-A1`, landed at `d8236665` — a **genuine dependency**, not chain order:
  A1 is what turns B1 from cross-module surgery into a table edit. It also shares two change
  paths with A1 (`canonicalRelationship.js`, `regionalNeighbourSeam.test.js`).
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§48.4** (the persisted-world read class is
  owner-gated) · **§64.2** (⛔ **ARM B1 IS SIGNED**, exercised under the §24/§37 delegation
  and recorded on the veto surface; B1 is the train's LAST member and never its green
  prefix; the standing pre-feature-golden method binds before the landing claim) ·
  **§64.3** (arm B2 REFUSED — the nine speculative spellings are not merged) · **§66.2 as
  corrected by §101.3** (G2/G3 join B1 and route through the canonical table; G2's
  population is FIVE spellings; G3 cures by ROUTING ALONE with `enemy` expected-dead) ·
  **§101.2** (door 1 — the wider budget recorded for B1 at four files).
- **Compile of record:** `laneTC18-RN1-PLAN.md` §4.4.

---

## §1 · BEHAVIOR, AND THE CLASS

A legacy persisted edge stops receiving `neutral`'s numbers under its own wrong label, and
starts receiving the numbers the label always claimed.

**This is the persisted-world read class.** A saved campaign's relationship numbers change on
next load. That is the deliverable, and §64.2 signed it on exactly this reasoning: *"a legacy
`trade_partners` edge today reads `neutral`'s numbers under a `trade_partners` label —
leaving that preserves a MISREADING, not lived history."* **THE PROMISE is not touched**: no
same-seed generation cell moves, because nothing in `src/` can PRODUCE any of these
spellings; they arrive only from a world that already exists.

## §2 · ⭐⭐ THE SAME-SEED PROOF — EXECUTED, NOT ASSERTED

§64.2's *"measured unmoved"* is a compile-time prediction. The standing pre-feature-golden
method is what makes it a landing claim, and it was run:

```
npx vitest run tests/generation.test.js tests/property/
  Test Files  87 passed (87)
  Tests      623 passed (623)          TRUE_EXIT=0
```

**Every same-seed golden is byte-identical after the shift.** Run once when the cure landed
and again after the last edit in this member, so the green binds to the committed tree.

⛔ **IF THE GOLDEN HAD MOVED, THAT WAS A STOP, NOT A FORK** — motion would have refuted the
signed premise that every divergent spelling is producer-less, which is the ground §64.2's
signature rests on. No conditional fork was offered for `RNS-26`, deliberately.

## §3 · THE DECLARED SHIFT — SIX ROWS, NAMED

The identity pin RN-A1 installed is what MEASURES this member. Six of its forty rows move,
all on the state plane; **the regional column does not move at all**:

| input | canonical (unchanged) | state BEFORE | state AFTER |
|---|---|---|---|
| `trade_partners` | `trade_partner` | `trade_partners` | **`trade_partner`** |
| `Trade_Partners` | `trade_partner` | `trade_partners` | **`trade_partner`** |
| `overlord` | `vassal` | `overlord` | **`vassal`** |
| `smuggling` | `smuggling_partner` | `smuggling` | **`criminal_network`** |
| `smuggling_partner` | `smuggling_partner` | `smuggling_partner` | **`criminal_network`** |
| `Hostile rival` | `Hostile rival` | `hostile rival` | **`hostile`** |

Divergence count **17 → 15**: three inputs converge, and `smuggling_partner` newly diverges.
⭐ **That new divergence is correct and deliberate** — the REGIONAL plane keeps
`smuggling_partner` as a first-class structural type while the state plane collapses the
smuggling family onto the defaults row it has always meant, exactly as
`canonicalPropagationLabel` already does. `regionRelationshipB06Fixes.test.js:46-53` already
pins that asymmetry from the regional side and stays green untouched.

### 3.1 ⚠ `tense` IS NOT MERGED — AND THE ABSENCE IS A DECISION

`tense` is the fifth LEGACY-LIVE spelling the cure names. **No ruling determines which
defaults row it should claim.** `rival`, `cold_war` and `hostile` are all defensible and
carry materially different trust/resentment/fear numbers, so choosing one here would be
**inventing owner-gated content rather than executing it**. It stays unmapped — the same
neutral numbers it reads today — is pinned so the gap cannot be mistaken for an oversight,
and is raised as an open chair question. Adding it later is a one-row diff with a signed
target.

## §4 · THE THREE ROUTINGS, EACH WITH ITS MEASURED BEFORE-STATE

Every before-state below was measured against a `git archive` of `196b256a`, never recalled.

### 4.1 G2 — `normalizeBondKind`, measured WIDER than §66.2 named
The gate folded exactly ONE spelling by hand, so a persisted edge carrying any other legacy
spelling of a qualifying kind was read as NON-qualifying and the generosity question was
never even asked. §66.2 named three; the measured population is **FIVE** — `ally`, `allies`,
`trade`, `liege`, `overlord`. **Routing cures all five with ZERO content widening.**

⛔ **AND IT DOES NOT BREACH THE FIRST-PAINT LAW.** `generosityGate.js` declares itself
import-free and cites `vendorPdfLazy.test.js` as its enforcer. It is EAGER — genuinely in
the first-paint closure — so the rule is real. **It is honoured, not waived**: measured in
the built `dist/`, `canonicalRelationship.js` and `generosityGate.js` already live in the
SAME entry chunk, so the edge costs **zero** first-paint bytes. Re-verified after the change
against a real build — raw, gzip and Brotli budgets all pass, 28/28, and the three budget
guards RAN rather than skipping. The file's law is restated precisely (never add a dependency
that is not already eager; never raise the budget to fit one) rather than deleted.

### 4.2 G3 — `adversarialRank`, and the downgrade it was causing
```
MEASURED at 196b256a:  persisted 'coldwar'  + a rival infiltration  →  'rival'   ⛔ DOWNGRADED
MEASURED after B1:     persisted 'coldwar'  + a rival infiltration  →  'coldwar' ✔ untouched
```
The rank read took the persisted label raw, ranked `coldwar` at 0, and the no-downgrade guard
"escalated" a cold war into a rivalry — the exact motion the guard exists to forbid. Routing
cures it with **zero content widening**; the canonical table already maps both spellings.
⚠ **`enemy` is EXPECTED-DEAD, not cured** (§101.3): curing it needs a SPECULATIVE spelling
merged, which §64.3 refuses. It ranked 0 before and ranks 0 now, pinned.

### 4.3 `relationBetween` — the EIGHTH read policy (J-RNC-8)
```
MEASURED at 196b256a:  a 'trade_partners' link → 0 dependency candidates
MEASURED after B1:     a 'trade_partners' link → the SAME candidate set as 'trade_partner'
```
The reader returned the persisted label RAW, so a legacy plural was invisible to dependency
discovery. The `|| null` contract is preserved exactly.

## §5 · The change manifest (7 rows)

| # | Action | Path |
|---:|---|---|
| 1 | `MODIFY` | `src/domain/relationships/canonicalRelationship.js` — the LEGACY-LIVE merge into the plane table |
| 2 | `MODIFY` | `src/domain/spatial/generosityGate.js` — G2 routing |
| 3 | `MODIFY` | `src/domain/events/mutateWorld.js` — G3 routing |
| 4 | `MODIFY` | `src/domain/region/discoverDependencyCandidates.js` — `relationBetween` routing |
| 5 | `TEST` | `tests/domain/regionalNeighbourSeam.test.js` — the declared shift + the moved-read pins |
| 6 | `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` — the census re-derived WHOLE |
| 7 | `MODIFY` | `docs/implementation/INDEX.md` / packet docs — status only (P/T commits) |

**4 existing logic-bearing production files**, on §101.2's recorded door-1 budget, priced
here rather than inherited silently.

### 5.1 ⚠ THE ANCHOR TRAP WAS PRICED AND MEASURED **NOT** SPRUNG
`regionRelationshipB06Fixes.test.js` carries a frozen `negativeAssertionAnchor` row of **2**
(live 2), and the obligation is two-directional — a new bare negative reds at 3, anchoring an
existing one reds at 1. **This member does not edit that file at all.** The compile expected
its two divergence pins to need re-authoring; measured, they do not, because they pin the
**regional** plane and B1 moves only the **state** plane. The trap is recorded as priced and
not incurred rather than silently unmentioned.

### 5.2 Prices measured NOT INCURRED
§92.2 certification, §49/§50 flags, §85.4 registry mint (all four production files scanned:
**0 hits**), §95.2 census burn, §102.3 (no new `tests/lint/` file).

## §6 · Declared terminals

| Figure | Expectation |
|---|---|
| **Same-seed goldens** | ⭐ **UNMOVED — 87 files / 623 tests, exit 0** (§2) |
| The identity pin | **six rows move, all declared** (§3); divergence **17 → 15** |
| Lighting census | **`2438/364/2074/20206/5672`** — `files`/`parked`/`credited` UNMOVED; only evidence figures move |
| First-paint budget | **PASSES**, re-verified against a real build after the G2 import |
| Both typecheck ratchets | **UNMOVED at 173/173 and 1134/1134** |
| `negativeAssertionAnchor` | **UNMOVED** — no bare negative written, the frozen-2 file untouched |
| Effective lines | `canonicalRelationship` 184→189 · `generosityGate` 14→**14** · `mutateWorld` 771→772 · `discoverDependencyCandidates` 357→358 |

## §7 · ⛔ MANDATORY STOPS

1. **A same-seed golden moves** → STOP, not a fork. It refutes the signed premise (§2).
2. **Merging any arm-B2 SPECULATIVE spelling** (`allies`, `suzerain`, `liege`, `coldwar`,
   `cold-war`, `war`, `enemy`, `subject`, `tributary`) → STOP; §64.3 refuses.
3. **Choosing a target for `tense`** → STOP; owner-gated and undetermined (§3.1).
4. **The first-paint budget reds, or is RAISED to fit the import** → STOP; raises are
   owner-signed and never incidental.
5. **Any per-plane Axis-2/Axis-3 policy unified** → STOP; both are load-bearing on
   `region/graph.js` and unifying either moves generated output.
6. **Either typecheck ratchet moves, or a new OSR finding** → STOP.
7. **The census `files` figure moves** → STOP; it would mean a new test file.

## §8 · Acceptance cases

| id | case |
|---|---|
| A1 | the same-seed golden suite is byte-identical — 87 files / 623 tests, exit 0 |
| A2 | the identity pin passes with exactly the six declared rows moved and divergence at 15 |
| A3 | G2: all five legacy bond spellings now resolve to a qualifying kind, and the KINDS are not widened |
| A4 | G3: a persisted `coldwar` edge survives a rival infiltration untouched, while `neutral` still escalates |
| A5 | G3: `enemy` still ranks 0 — expected-dead, pinned |
| A6 | `relationBetween`: a legacy plural yields the same candidate set as the canonical singular, and an unknown label still yields none |
| A7 | the lighting census reads `2438/364/2074/20206/5672`, `files` unmoved |
| A8 | `vendorPdfLazy` passes under `VERIFY_DIST=1` with the three budget guards RUN, not skipped |

## §9 · Checks

```
npx vitest run tests/generation.test.js tests/property/
npx vitest run tests/domain/regionalNeighbourSeam.test.js tests/domain/regionRelationshipB06Fixes.test.js
npx vitest run tests/domain/events/generosityVerbs.test.js tests/domain/resourceDynamicsApply.test.js
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js tests/lint/negativeAssertionAnchor.walker.test.js
npm run build && VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
```
