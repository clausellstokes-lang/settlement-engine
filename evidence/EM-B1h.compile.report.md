# EM-B1h — COMPILE LANE REPORT, VERSION 2

**Verdict: DRAFT, READY-able.** Compiled under the chair's rulings (ODQ §934.47 addendum 28) at
the same tip, `ad7ddf2c9`, `git status --short` **EMPTY** before and after.

**Files** — version 2 at the working names, version 1 preserved beside it:

```
EM-B1h.md · EM-B1h.manifest.json · EM-B1h.evidence.md · EM-B1h.compile.report.md
EM-B1h.v1.md · EM-B1h.v1.manifest.json · EM-B1h.v1.evidence.md · EM-B1h.v1.compile.report.md
```
all under `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-B1h-scratch/`.

---

## 1. What changed from v1

| # | change | why |
|---|---|---|
| 1 | **Q2 applied** — the home is the zero-import leaf `src/domain/worldPulse/worldPulseFates.js` | the chair's ruling on the 327-vs-1 closure measurement |
| 2 | **Q3 applied** — `null` is the CLEAR sentinel; the four clear sites are declared `clear` roster rows | the chair's ruling |
| 3 | ⭐ **Q4 applied, and it came out THREE kinds, not two** | measured (§2) |
| 4 | ⭐ **A FIFTH CHANGE-MANIFEST ROW — the register v1 missed**: `tests/lint/couplingInclusion.walker.test.js` | measured (§5) |
| 5 | ⭐ **The guard moved into the leaf** (`assertWorldPulseFate`) | 98 B / +2 lines against 204 B / +4 (§6) |
| 6 | ⭐ **The vocabulary's shape**: the kind map is the single authored source, the flat list derived | 910 B against 1,248 B, and "a member with no kind" becomes unrepresentable (§4) |
| 7 | **A7 added** — the leaf's `status:`-freedom is an acceptance arm, not only a coding note | the chair asked for it |
| 8 | **A6 strengthened** — a source scan proves **no `src/` file imports `WORLD_PULSE_FATE_KIND`** | golden-neutrality becomes machinery, not a promise |
| 9 | **M5 and M6 added** to the mutants (a re-kinding; a planted reader of the kind) | each new claim gets a conviction |
| 10 | §13 added — the second vocabulary tabulated member by member | the chair's N2/R4 |
| 11 | requiredSymbols **15 → 18**, and ⭐ **one candidate row REFUSED by the post-edit simulation** | §7 |
| 12 | acceptance cases **6 → 7**; handwritten files **4 → 5**; bytes **739 B → ≤1,008 B** | the above |

---

## 2. The eighteen members, their writers, what the writer DOES, and the kind

Classified by the **sibling keys of each write site's own record literal** (evidence §16), never
by the fate's English. The rule is total:
**`closure`** = the writer sets `_worldPulseInactive: true` **and** a non-`active` status ·
**`standing`** = no status change and no flag — diminished but standing, active, in place ·
**`rise`** = raised or founded and active.

| member | writer / deriver | what that writer does to the institution | kind |
|---|---|---|---|
| `destroyed_by_disaster` | `ruinInstitution` ← `calamityKernel:317/:321` | `status:'ruined'`, `_worldPulseInactive`, `_worldPulseEconomyClosed` | `closure` |
| `ruined_by_decree` | ⭐ **none — declared, unproducible until EM-B1a** | (the same writer, when EM-B1a calls it) | `closure` |
| `shuttered` · `bankrupt` · `closed_for_want_of_custom` | `closureFateForInstitution:651` → `institutionLifecycle:1019` | `status:'remnant'`, `_worldPulseInactive`, `_worldPulseEconomyClosed` | `closure` ×3 |
| `bankrupt` · `closed_for_want_of_custom` (again) | `magicClosureFate:129` → `magicRegimeLifecycle:357` | the same three keys | `closure` |
| `abolished` · `disbanded` | `moralInstitutionPressure:348` → `institutionLifecycle:1061` | `status:'remnant'`, `_worldPulseInactive`, `_worldPulseMorallyAbolished` | `closure` ×2 |
| `abandoned_with_the_settlement` | `settlementLifecycleFirstClass:601` | `status:'removed'`, `_worldPulseInactive` | `closure` |
| `reduced_to_watch_post` · `abandoned` · `privatized` · `survives_as_remnant` · `downsized` · `captured_by_local_powers` · `hollowed_out` | `demotionFateForInstitution:138` → `deactivateForDemotion:158` | ⛔ **`status: fate.status` (`remnant` ×6, `removed` ×1 — never `active`) AND `_worldPulseInactive: true` for ALL SEVEN** | `closure` ×7 |
| ⭐ `demoted_by_disaster` | `calamityKernel:309` (the demote branch, `:304-311`) | ⭐ **renamed in place; NO status change, NO flag.** Its selection requires `status === 'active'`; its own comment: *"rename in place, keeping the slot standing"* | ⭐ **`standing`** |
| `upgraded_by_reconstruction` | `upswingKernel:516` | promoted in place; no status change, no flag | `rise` |
| `founded_by_flourishing` | `upswingKernel:763` | pushes a **new** `status: 'active'` record | `rise` |

⇒ ⭐ **`closure` 15 · `standing` 1 · `rise` 2 = 18.**

⛔ **The chair's six suspected "diminished but standing" names are all `closure`.** Their single
writer deactivates for all seven demotion fates, however gentle the word — the prose says
"survives as remnant", the record says `_worldPulseInactive: true`. ⛔ **The member that needed
the third kind is `demoted_by_disaster`**, which was not on the list.

⇒ ⛔ **R10 — EM-B1i's defect population is THREE, not two.** A demoted wizard's tower, a
reconstructed guild and a flourishing academy all read as *destroyed* at
`causeLifecycle.institutionDestroyed` today and all three sever a criminal leash. **EM-B1i's
charter row and its golden measurement need widening.**

---

## 3. The `LIFECYCLE_CLOSE_FATES` / `institutionHistory[].fate` tables (N2 / R4)

**Is `LIFECYCLE_CLOSE_FATES` exactly the `closure` kind?** ⛔ **No — a STRICT SUBSET, 3 of 15.**

| in `LIFECYCLE_CLOSE_FATES` | `closure` members NOT in it (12) |
|---|---|
| `shuttered` · `bankrupt` · `closed_for_want_of_custom` | `abandoned`, `abandoned_with_the_settlement`, `abolished`, `captured_by_local_powers`, `destroyed_by_disaster`, `disbanded`, `downsized`, `hollowed_out`, `privatized`, `reduced_to_watch_post`, `ruined_by_decree`, `survives_as_remnant` |

Reverse: **3 of 3** are `closure` members. `LIFECYCLE_BUILD_FATES` (`built`, `reopened`): **0 of 2**
are fates at all.

⚠ ⇒ the damping counter `priorLifecycleCounts` counts **only the three economic closures** — an
abolition, a tier demotion, a disaster ruin and a settlement death each leave a history entry it
does **not** count as a close. ⛔ **Deriving it from the kind is refused here for two reasons**
(R6): it would make `institutionLifecycle.js` a READER of the kind (this packet has none, which is
the chair's own golden-neutrality condition), **and it would change behaviour** — 3 counted words
becoming 15 would begin damping rebuild odds where nothing damps them today. **A lived-behaviour
change; docket to EM-B1i or a follow-on.**

**Is `institutionHistory[].fate` the same vocabulary under a second key?** ⛔ **No — a DIFFERENT,
OVERLAPPING one**, measured over all ten of its write sites:

| | count | members |
|---|---:|---|
| `institutionHistory[].fate` values | **17** | — |
| SHARED with `WORLD_PULSE_FATES` | **12** | the three closure fates, the two abolition fates, and all seven demotion fates |
| ONLY `institutionHistory[].fate` | **5** | `built`, `reopened`, `founded`, `reactivated`, `added` |
| ONLY `WORLD_PULSE_FATES` | **6** | `abandoned_with_the_settlement`, `demoted_by_disaster`, `destroyed_by_disaster`, `founded_by_flourishing`, `ruined_by_decree`, `upgraded_by_reconstruction` |

⇒ **the walker's roster does NOT cover those write sites and must not pretend to.** R4's hazard is
now exact: at `institutionLifecycle:1019`+`:1031`, `:1061`+`:1073` and `tierOutcomeApply:162`+`:290`
**one variable is written to both keys in the same statement**, so a word added to one silently
joins the other. **That vocabulary owes its own closure, in its own behaviour family.**

---

## 4. The shape (Q4) — the kind map as the single authored source

| shape | minified | "a member with no kind" | the walker's totality arm |
|---|---:|---|---|
| a frozen list **beside** a frozen kind map (the chair's first option) | 1,248 B | *detected* by a set-equality between two literals three lines apart | can only catch a typo made in the same edit |
| ⭐ **the kind map as source, `WORLD_PULSE_FATES = Object.freeze(Object.keys(KIND))`** | ⭐ **910 B** | ⭐ **UNREPRESENTABLE** | three **live** arms: every kind ∈ the declared three, the keys in codepoint order, the populations exactly 15/1/2 |

⇒ **338 B cheaper, the eighteen strings spelled once, and the structural guarantee the estate's
own doctrine prefers to a detected one.** The guard's membership test is identical in both (one
`new Set` at load). It is a hybrid of the chair's two options, chosen on measurement — **if the
chair prefers the two-literal form, only §6.2 and one walker arm change.**

---

## 5. ⭐ The fifth row — the register version 1 missed

`tests/lint/couplingInclusion.walker.test.js` is a census **TOTAL over
`src/domain/{worldPulse,spatial}`** (`CENSUS_SCOPE_RE`, `:1054`) whose own arm is titled *"a NEW
unlayered module REDS — it must get a family, an argument, or the baseline."* Three doors; the
baseline is *"only for pre-program debt"* and *"only shrinks"*, so the leaf takes the **argument**:

- one `ARGUED_UNLAYERED` row, `kind: 'substrate'`, a `reason` of >20 chars, and
  **`reads: Object.freeze([])` — exact, because the leaf has zero imports** (the walker asserts the
  declared `reads` against the live scan). Precedent: the `bandFamilies.js` row (`:473`).
- **`ARGUED_ROSTER_CEILING` 28 → 29 in the same diff.** Measured: the roster holds exactly 28 keys
  today (20 `substrate` with `reads: []`) and the ceiling reads 28. It is an **EXACT** equality by
  design — *"a number that only has to be not exceeded is not a ratchet, it is a budget"* — so the
  row without the bump, or the bump without the row, reds.

⭐ **And no cross-layer pair is minted, so neither coupling baseline JSON moves**:
`scanCrossLayerPairs` iterates layered modules and skips unlayered deps, and `calamityKernel.js`
— the leaf's one importer — is **itself unlayered** (no `LAYER_PATTERNS` match; line 36 of the
179-entry `.coupling-unlayered-baseline.json`). **Free of contention: ten packets name the walker,
all LANDED.**

**Every other register swept and NOT OWED** (evidence §16.4): there is no dead-export walker and
no unused-export lint rule; `vocabularyTotality.walker.test.js` is a *producer→consumer* register
and this vocabulary has no enumerating consumer — ⭐ **EM-B1i is exactly when a row becomes owed
there**; `engineTelemetryWall` uses per-root floors; `entropyRootCensus` counts PRNG sites;
`domainStrictBaseline` / `domainAnyCastBaseline` give a new file an allowance of 0, so the leaf
must simply be clean; and `src/domain/worldPulse/index.js` is not a barrel a new leaf must join.

---

## 6. Bytes re-priced for the final shape

| piece | minified | note |
|---|---:|---|
| the leaf (kind map + derived list + `isWorldPulseFate` + `assertWorldPulseFate`) | **910 B** | shape (c) |
| the kernel's guard fragment (`import` + one call) | ⭐ **98 B** | against **204 B** inline |
| ⭐ **total, upper bound** | ⭐ **≤1,008 B** | v1 was 739 B; **+269 B is the KIND data** |

Kernel effective lines: **+2** (option B) against **+4** (option A). Lands only in
`advanceInterval.worker`, which has **no ceiling today**; with EM-B1e's +437 B that is **≈1.45 KB of
TOOL-3's declared 4 KB per-train headroom**, and EM-B1i will add a third figure (**R2**).

Every other budget unchanged and re-confirmed: generation worker (zero slack) **NOT REACHABLE**;
lazy engine **NO**; first paint **NO**; edge-shared **0 of 307 inputs ⇒ NOT OWED**.

**Scope:** 1 new leaf · **1** production file modified · 1 new test leaf · **2** registration files ·
**5 handwritten files** (≤12) · ≈57 eff production lines (cap ≤75) · **7** acceptance cases (≤8).
No override.

**Register DELTAS:** lighting census **`+1 files / +0 parked / +1 credited / +4 titles / +1
suiteTitles`** — row 5 edits an existing test file and adds **no title**; mutation-coverage
**705 → 706** (contended with EM-B1d[READY], anchored at the TAIL); coupling-inclusion
**28 → 29**; observed-shape and writer-reach **not owed, motion is a STOP**.

---

## 7. requiredSymbols — 18 rows, each `grep -cF` → 1, with the post-edit simulation

Seventeen rows sit on files the packet does not edit, or outside the edited region ⇒ **PRESENT**.
The eighteenth, `export function ruinInstitution`, is on the one MODIFIED file: the packet inserts
**one call** inside the body and extends the import clause, never re-spelling the signature ⇒
**PRESENT**. ⇒ ⭐ **`retiredSymbols`: NONE** — the packet removes, renames and moves no symbol.

⭐ **THE SIMULATION CUT A ROW BEFORE IT WAS WRITTEN.** `const ARGUED_ROSTER_CEILING = 28` resolves
once and looked like an obvious row — but **row 5 re-spells that line (28 → 29)**, and
`requiredSymbols` is asserted verbatim at every status, so `check:packet`'s first step would red
the moment the cure was made. That is the EM-P3 lesson and precisely the row the chair cut from
EM-B1d version 5. It is not a `retiredSymbols` row either: the symbol survives, only its value
changes. **The stable prefix `const ARGUED_ROSTER_CEILING` is named instead**, proved present once.

New in v2: the `standing` write site (`worldPulseFate: 'demoted_by_disaster'`),
`const LIFECYCLE_CLOSE_FATES` (§3's subject), and the two `couplingInclusion` rows.

**§7's Markdown table and the JSON `changeManifest` are SET-EQUAL both directions (5 = 5,
executed); every action is in `PACKET_ACTIONS`; each `checks` array names one test directory.**

---

## 8. Noticed and NOT touched — nothing is deferred, each item slotted

| # | item | fate |
|---|---|---|
| **N1 / R10** | ⛔ **EM-B1i's defect population is THREE, not two** — `demoted_by_disaster` joins the two upswing fates: its writer renames in place, changes no status and sets no flag, so a demoted institution reads as destroyed and severs a criminal leash. | **SLOT: amend EM-B1i's charter row now**; its before/after and golden measurement must cover all three `standing`/`rise` members. |
| **N2 / R6** | ⛔ **`LIFECYCLE_CLOSE_FATES` must not be derived here** — it would make `institutionLifecycle.js` a reader of the kind AND change behaviour (3 counted words → 15, damping rebuild odds where nothing damps them today). | **SLOT: EM-B1i** (already measuring that file's reader against the goldens) **or a named follow-on.** |
| **N3 / R4** | ⚠ **`institutionHistory[].fate` is a different, overlapping vocabulary** (17 values; 12 shared, 5 its own, 6 ours), and **one variable is written to both keys in the same statement** at three sites. | **SLOT: its own packet**, or a binding measurement of EM-B1a's pre-proof. |
| **N4 / R11** | ⚠ **No arm can prove a KIND *correct*** — only present, single and drawn from the three. A writer that later changes what it does to the record without changing its fate word leaves the kind stale with nothing red. Stated in the walker's `CANNOT-CATCH:` header. | **SLOT: EM-B1i's walker** — recommend it re-derive the kinds from the record literals and assert them against this packet's declaration. |
| **N5 / R9** | ⚠ **The `ARGUED_UNLAYERED` `reason` text enters a frozen register** and is the one piece of prose in this packet that does. | **SLOT: the chair confirms the wording at promotion.** |
| **N6 / R5** | ⚠ **The retired-spelling proof covers the repo, not production.** Harmless (the guard validates a WRITE, never a READ). | **SLOT: an owner decision point if the READ side is ever proposed** — it would need a migration. |
| **N7 / R2** | ⭐ **TOOL-3 sequencing**: EM-B1e's +437 B, this packet's ≤1,008 B and EM-B1i's figure all land in the uncapped `advanceInterval.worker`. | **SLOT: TOOL-3's first per-train attribution**, naming all three. |
| **N8 / R8** | ⚠ `scripts/mutation-coverage-manifest.json` reserved by **EM-B1d [READY]**. | **SLOT: this packet's own preflight** (§4, §11). |
| **N9** | ⓘ ⭐ **`vocabularyTotality.walker.test.js` will owe a row when the first consumer appears** — it is a producer→consumer register and this vocabulary has none today. | **SLOT: EM-B1i's compile**, which creates that consumer. |
| **N10** | ⓘ `scripts/audit/cause-lifecycle-soak.mjs:171` hand-builds a fate; it is a member and not a declared command. | **CLOSED — not work.** Could ride FIX-T1 if that lane touches the family. |
| **N11** | ⓘ **EM-B1e §7's "`ruined_by_decree` absent from `tests/`"** is superseded by its own landing. | **CLOSED — history.** Recorded so the absence is not re-assumed. |
| **N12** | ✅ R1, R3 (the hot-file row), R6-brief and R7 (design §15) were **closed by the chair** between versions. | **CLOSED.** |

---

## 9. Questions that remain

1. ⭐ **Confirm THREE kinds and the classification** — in particular that `demoted_by_disaster`
   alone is `standing`, and that the chair's six suspected names are `closure` on the measured
   reading (the record deactivates; only the prose is gentle). If the chair reads
   "survives as remnant" as a fourth kind, §6.1's rule and the populations change.
2. ⭐ **Confirm the SHAPE** — the kind map as the single authored source with the list derived
   (910 B, structurally total) rather than two literals side by side (1,248 B, totality asserted).
   A one-section change if the chair prefers the other.
3. ⭐ **Confirm the `ARGUED_UNLAYERED` `reason` wording** (R9) — the one piece of this packet's
   prose that enters a frozen register.
4. ⭐ **R10 — amend EM-B1i's charter row to three members**, and widen its golden measurement.
5. **R6 — give `LIFECYCLE_CLOSE_FATES`'s derivation its slot** (EM-B1i or a follow-on), noting it
   is a lived-behaviour change, not a refactor.
6. **R4 — give `institutionHistory[].fate` its own closure a slot.**
7. **R11 — should EM-B1i's walker re-derive the kinds from the record literals** and pin them
   against this declaration? That is what makes a stale kind catchable.
8. **R2 — name EM-B1e's +437 B, this packet's ≤1,008 B and EM-B1i's figure in TOOL-3's first
   per-train attribution.**
9. **R8 — confirm at placement that EM-B1d has LANDED** so the mutation-coverage path is free.

---

## 10. What this lane did NOT do

Implemented nothing. Ran no gate, no vitest, no eslint CLI, no npm script, no build (eslint's
`Linter` imported as a library; esbuild run on scratch files only). Edited, staged or committed
nothing anywhere; the read tree is unchanged at `ad7ddf2c9` with an empty `git status --short`.
Did not touch `$SP/consist`, `$SP/slot-2`, `$SP/lane-em-b3b`, `$SP/lane-tool-a`, `$SP/lane-fix-f`,
`$SP/lane-fix-g` or any other lane's directory; read the ledger only through `git -C
/Users/cstokes/Desktop/settlement-engine show review-fixes-2026-07-08:<path>`. Adjudicated
nothing: every correction is a measurement with its command, and every choice the chair reserved
is a question in §9.
