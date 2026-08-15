# Foreign Policy / IN-1c-a — THE INFORMATION REGISTRY AND THE GOVERNED STANDING LINE (`secondOrderBeliefEnabled`, no new flag)

- **Status:** READY
- **Packet version:** `2` (v1 was TC13's compile at `fc8451c4`; v2 is this promotion, re-derived
  at the moved base — see the BASE-MOVE RE-DERIVATION block immediately below)
- **Verified base:** `claude/composite-r4` at `d5a6c0094a373d50f7d4870d44fb84f598164e85`
  — the branch's tip and the train's base are the same commit
  (`INT-3B T: flip LANDED, amend the M2 claim, regenerate the capsule, close the train`); the
  member is built on `refs/trains/in-1c-a` with **HEAD detached**, so no `refs/heads/*` moves.
- **Base-state capsule:** `docs/implementation/BASE_STATE.json` stamped `28d2824b`; the verified
  base is its **docs-only child** (`git diff --name-only 28d2824b d5a6c009` returns four paths, all
  under `docs/implementation/`), so the consumption law's second admissible base is satisfied.
  ⚠ **Its `validatePackets` row fails the byte-identity clause on its own subject** —
  `PACKET_MANIFEST.json` moved inside that window — so that one row is re-executed here (§5b B8)
  rather than cited, exactly as TC13 found at the previous base.
- **Train:** `refs/trains/in-1c-a` — **SOLE MEMBER.** Plan: `laneTC13-TRAIN-PLAN.md`
- **Preamble:** `docs/implementation/preambles/IN-PREAMBLE.md` @ SHA-256
  `e284353f17252a84fd3de4f581678cd86edd3370fea60ebfb29efd02068dc609` (computed over the LANDED
  bytes at this train's P1, not over the scratchpad draft) — §I1–§I13 in full: the design-law
  citations, the layer-map conviction, the registration cost, the K3 structural fence,
  durability-before-clocks, the coupling/OSR law, the hazard dispositions, mutant hygiene, the
  gate-reading law, the census law, the twenty-five STOP conditions, and §I12's value/flag law.
- **Compiled by:** Lane TC13 (read-only compile lane), 2026-08-15, Opus-era, at `fc8451c4`.
  **Nothing was staged, committed, edited or run as a gate by that lane.** Every figure it
  measured came from the **HEAD OBJECT** (`git show HEAD:…`, `git grep … HEAD`) rather than from
  the working tree, because the tree is shared and an executor may be live in it.
- **Promoted and executed by:** Lane TE13 at `d5a6c009`, under `OWNER_DECISION_QUEUE.md` §55
  (all five questions SIGNED, the split ratified) and §65.4 (the dispatch, which ORDERS that a
  moved base be re-derived rather than inherited).

---

## -2. ⭐⭐ THE BASE-MOVE RE-DERIVATION — EXECUTED BY THE PROMOTING LANE

TC13 compiled at `fc8451c4`. **INT-3B landed in between** (`fc8451c4 → 8401efbc → 28d2824b →
`d5a6c009`), touching eleven paths: `emigreErrand.js` (CREATE), `envoyErrandVocabulary.js`,
`emigreErrand.test.js` (CREATE), three lint walkers, and five `docs/implementation/` files.
⛔ **Every premise and every absolute figure below was RE-EXECUTED at `d5a6c009`, not inherited.**

| Premise | TC13 @ `fc8451c4` | **TE13 re-executed @ `d5a6c009`** | Verdict |
|---|---|---|---|
| Lighting census tuple | `2429/366/2063/20115/5654` | **`2430/366/2064/20123/5655`** | ⚠ **MOVED — by INT-3B's own +1/+0/+1/+8/+1, exactly the delta shape this member also carries.** Corrected throughout; the DELTA is unrefuted |
| Runtime tests | 28138 | **28146** (capsule, and the chair's own §65.1 terminal receipt) | ⚠ MOVED by INT-3B's eight titles; the +8 delta is unrefuted |
| `validate:packets` | 45 packets / 0 READY | **46 packets / 0 READY, ZERO non-terminal rows** | ⚠ MOVED by one row; **the structural finding survives — the manifest still reserves ZERO change paths, so all eleven are free and the census walker is FREE** |
| `couplingInclusion.walker.test.js` | INFO prefix arm at `:136`; `CENSUS_SCOPE_RE`; `UNLAYERED_BASELINE_CEILING` 179; `ARGUED_ROSTER_CEILING` 19 | **file MOVED (+16 lines) — and the move is an INTERIOR exact-path arm for `emigreErrand.js`. The INFO prefix arm still reads `…\|brokerage\|information\|disinfo\|…` at `:136`; `CENSUS_SCOPE_RE` `:575`; ceilings 179 `:606` and 19 `:572`; the unlayered baseline still holds EXACTLY 179 entries** | ✅ **§3.3's conviction and §3.4's zero bill both HOLD** |
| `.coupling-unlayered-baseline.json` | 179 entries / ceiling 179 | **179 / 179 — untouched by the move** | ✅ HOLDS |
| `kindPoolFloors` five literals | `REGISTRIES` 9 · 111 · 378 · `toBe(7)` · 274 | **file NOT touched by the move; re-read at `:77/:173/:157/:328/:147` — 9 · 111 · 378 · 7 · 274** | ✅ HOLDS |
| Four hot files | 599 / 798 / 797 / 780 | **599 / 798 / 797 / 780** — re-measured with eslint's own `Linter` under `max-lines {skipBlankLines, skipComments}` | ✅ **EXACT.** None is in this manifest |
| Test ratchet · size baseline · OSR baseline | 16/17 · 10 files · 387/1412 | **16/17 · 10 files · 387/1412** | ✅ HOLDS |
| The corpus grep (eight symbols) | ZERO non-doc files | **ZERO** — re-executed over `src/ tests/ scripts/ supabase/` | ✅ HOLDS |
| The three CREATE targets | absent | **absent** | ✅ HOLDS |
| `secondOrderBeliefEnabled` namers | 5 in `src/` | **5**, at the same four files and five lines | ✅ HOLDS |
| Substrate untouched since compile | — | `git log fc8451c4..d5a6c009` over all twelve named substrate paths returns **EMPTY** | ✅ **Not one file this packet reads or writes was touched by the move** |

⇒ **NO PREMISE IS REFUTED. Three absolute figures moved and are corrected in place; every
DELTA this packet predicts is unchanged.** The corrected terminal figures are in §3.5 and §9b.
- ⭐⭐ **THIS PACKET AUTHORS ZERO NUMBERS**, which is exactly why it can land **without a chair value
  signature** (§I12; the §47 O-6 posture GR-5A set). Nine variants are annex-verbatim; every numeral
  it moves is a census re-derived at build; the frequency floors are derived arithmetically by
  `tests/helpers/kindPoolWalker.js` from `SIGNIFICANCE_CLASSES` and are not re-typed here.
- ⛔⛔ **IT MINTS NO FLAG.** It rides `secondOrderBeliefEnabled`. ⇒ **NONE of §49/§50's three
  flag-mint obligations is incurred** — no `subsystemRowsVirtual.test.js` ordered-equality edit, no
  seven edge-shared bundle rebuild (`simulationRules.js` is not in the manifest), no lit-coverage
  literal. **Stated affirmatively because silence on those three has stopped two trains mid-chain.**

- **Depends on (verified by MODULE evidence at HEAD, never by commit subject):**

  | Predecessor | Evidence measured at `fc8451c4` | Verdict |
  |---|---|---|
  | **IN-1a** | `src/domain/worldPulse/secondOrderBelief.js` (**139 eff / 300 raw**) exports `MIRROR_BANDS`, `MIRROR_STALENESS_BANDS`, `MIRROR_PERCEPTION_BANNED`, `MIRROR_UNKNOWN`, `secondOrderBeliefActive`, `mirrorInputsAt`, `secondOrderMirrorOf` | **LANDED — CONFIRMED** (`5bf06481`) |
  | **IN-1b** | `src/domain/display/neighbourMirror.js` (**79 eff / 188 raw**) exports `NEIGHBOUR_MIRROR_HEADING`, `MIRROR_BAND_WORDS`, `MIRROR_STALENESS_WORDS`, `MIRROR_BASIS_WORDS`, `neighbourMirrorLines`; `tests/domain/neighbourMirror.test.js` (12 titles) and `tests/ui/neighbourMirrorLine.test.js` (8 titles) both present | **LANDED — CONFIRMED** (`af3d93c8`) |
  | **SP-B** | `src/domain/worldPulse/outboundImpression.js` (**52 eff / 176 raw**), zero-import contract pinned | **LANDED — CONFIRMED** (`4c0f2f38`) |
  | **SP-6a** | `bandFamilies.js` `SIGNIFICANCE_CLASSES`; `kindPoolWalker.js` derives `FREQUENCY_FLOORS` from its ranks | **LANDED — CONFIRMED** |

- **Collision group:** `information-second-order` — serialize against any lane touching
  `secondOrderBelief.js`, `neighbourMirror.js`, `receiptAnnex.js`, `kindPoolFloors.walker.test.js`,
  `subsystemRowsVirtual.js`, or the lighting-census walker.
- ⭐ **CENSUS-HOLDER RULE — THE WALKER IS FREE, RE-MEASURED BY EXECUTION.** `PACKET_MANIFEST.json`
  holds **46 rows** at `d5a6c009` (TC13 measured 45; INT-3B's landed row is the +1) and — measured
  by loading it through `scripts/implementation-packets.mjs` — **ZERO are non-terminal**
  (45 LANDED + 1 SUPERSEDED), so **zero change paths are reserved by
  anybody** and the census walker is named only by terminal packets. **IN-1c-a takes it.**
  ⛔ The moment a second non-terminal packet is promoted the chair MOVES the row.
- **Commit authority:** stated by the chair in the dispatch message. Absent explicit authority the
  agent leaves its changes unstaged and uncommitted.

---

## -1. THE COMPILABILITY VERDICT — **IN-1c IS REFUSED AS CHARTERED; THIS PACKET IS SLICE (a)**

IN-1c's charter (`DESIGN_FP_ARCH_IN.md` §IN-1 item 5, as CORRECTED at the IN-1a promotion) names
*"the hums with their kind registry, receipt-pool module, annex URL and interim-desk declaration"*.
**Three of those four are one coherent act with a consumer already rendering on screen. The hums
are a second behaviour family, and half of one of them is inexpressible at this base.** Full
argument and pricing in `laneTC13-TRAIN-PLAN.md` §1 and §3. The three findings, in brief:

### R1 — THE MIRROR IS NOT RE-DERIVABLE AT A PAST TICK, SO `mirror_shift`'s STRENGTH ARM IS INEXPRESSIBLE. CONFIRMED.

`mirrorInputsAt` collects plants with **no `seededTick <= tick` filter at all**, and filters
transfers **forward** (`(finite(row.depositTick) ?? -1) >= now`). ⇒ passing an earlier tick returns
the *present* strength wearing a past clock; a strength crossing can never be observed. The three
cures are each closed — a remembered band is a **new persisted family** (refused at CR-IN1-7, and
owner-gated); a collector filter is a **leaf code edit** re-opening four pinned arms and silently
changing a landed lit render; a re-derived staleness is a **second spelling** of a module-private
function. ⭐ The staleness arm **is** pure and free
(`secondOrderMirrorOf(Object.freeze({ ...input, tick: now - 1 }))`, the leaf's own derivation), and
it is the arm seven of the nine authored variants voice — **so `mirror_shift` is a HALVED wave, and
halving it is a chair act, not this packet's.**

### R2 — `mirror_confidence_degraded` HAS NO PRODUCER: THE COLLECTOR DISCARDS THE ARRIVAL TICK. CONFIRMED.

`evidence` is a frozen array of bare tokens; the collector reads `heard.lastUpdateTick`, tests it
for finiteness, and **throws it away**. Recovering it needs either a widened frozen input shape or a
second counterpart-keyed record read outside the gate-owning leaf — the exact class the K3
structural fence exists for. ⇒ **REFUSED with the measurement.**

### R3 — THE HUMS' THREE CERTIFICATION COSTS, PRICED SO THE CHAIR SITTING IS ONE SITTING.

A pulse producer gives the mirror an **engine** caller and three exact pins fall:
`secondOrderBeliefDormancyFence.test.js:198` `expect(importers).toEqual(['src/domain/display/neighbourMirror.js'])`;
`wizardNewsAuthoring.walker.test.js:105` `expect(byPath.get('src/domain/worldPulse/informationStatecraft.js')?.length).toBe(3)`;
and the mirror row's `aliveness.eventTypes: []` with `soakEvidence: 'unobserved'`, which together
make `UNOBSERVED_OVERRIDE_CEILING` live for this row for the first time. Each is a named, priced
edit — but **three certification-surface movements in one wave is a member, not a rider.**

### What IN-1c-a is NOT

| Excluded | Where it goes |
|---|---|
| `mirror_shift` (staleness arm), its pool, its producer, the interim-desk declaration | **IN-1c-b**, behind chair Q3/Q5 |
| `mirror_shift`'s strength arm; `mirror_confidence_degraded` | **REFUSED with measurement** (R1, R2) — a later wave takes the persistence question to the owner |
| Any `EXACT_SECTION` / `KIND_SECTION` / `WHAT_PHRASES` row | **not owed** — this packet registers a `section: null` kind (§I3) |
| Any edit to `heraldRouting.js`, `chroniclersLetter.js`, `settlementRumors.js` | **none** |
| Any edit to `informationStatecraft.js`, `pulseKernel.js`, `applyWorldPulse.js`, `simulationRules.js` | **none** — and that is why no hot file and no edge bundle is in scope |
| Any edit to `secondOrderBelief.js` or `outboundImpression.js` (code **or** header) | ⛔ **never** — pinned contracts, and a fence arm requires `outboundImpression.js`'s header to keep naming the flag |
| Repairing the nine forked seeded-pick sites | **STOP** — docketed as `CR-IN1C-DRIFT` (train plan Q4) |
| Supplying `{season}` to the corpus | **chair Q2** — two variants stay declared-unreachable here |
| A new feature flag, persisted key, ledger sub-key, tab id, writer, stage or tuning value | **0 of each** |
| IN-2..IN-6; soaks, tuning, deploys, pushes | later waves / owner |

---

## 0. Why this packet exists, and what it starts from

⭐ **IN-1b named this packet as the discharge, by name, in a chair ruling.** CR-IN1B-1:
*"The authored pool stays where it is, as a recorded deferral to **IN-1c**, which mints the
INFORMATION kind registry, the receipt-pool module and the annex URL that would make it reachable."*

**MEASURED AT HEAD.** `docs/content/RECEIPT_POOLS_INFORMATION.md` (917 lines) authors, at `:298`,
**nine** `mirror_standing_line` variants under *"town page — significance: routine (dossier line)"*,
slots `{counterpart}`, `{band}`, `{season}`. **That file has ZERO code consumers**
(`git grep -l RECEIPT_POOLS_INFORMATION HEAD -- src/ tests/ scripts/ supabase/` → **0 files**), and
`tests/helpers/receiptAnnex.js` (89 eff / 200 raw) exports `WAR_ANNEX_URL`, `GRAMMAR_ANNEX_URL`,
`TRADE_ANNEX_URL` and a legacy annex — **there is no `INFORMATION_ANNEX_URL`.** Meanwhile
`neighbourMirror.js` renders the line today from a hand-composed template:

```js
function standingSentence(counterpartName, band, staleness, sealed) {
  const shown = wordOf(MIRROR_BAND_WORDS, band);
  const when = wordOf(MIRROR_STALENESS_WORDS, staleness);
  return `${counterpartName} has been shown ${shown}, ${when}.`
    + (sealed ? ' Nothing has left our hand since.' : '');
}
```

**One sentence, forever, on every town page in every campaign.** SP-6's content-depth floor exists
precisely against that.

**Observable result of this packet:** on the same worlds that show the line today, each counterpart's
standing line becomes one of **nine authored sentences**, picked deterministically and stably per
counterpart. **Dark, nothing changes anywhere** — `neighbourMirrorLines` returns `[]` on
`MIRROR_UNKNOWN` by identity **before any composition runs**.

---

## 1. Reconciled authority

Reconciled per `PACKET_STANDARD.md` §"Authority order".

1. **Live git state at `fc8451c4` decides what exists.** Every §3 row was measured by executed
   `git show` / `git grep` / `node` against the HEAD object in this worktree. Where design prose and
   code disagree, **the code wins**, and §13 records every instance.
2. **Newest chair rulings bind:** CR-IN1C-1..5 (§12, **all chair-owed decisions closed — that is
   what would make this READY**), then CR-IN1B-1..9, then CR-IN1-1..7.
3. **The IN preamble** at its landed SHA-256 (all of §I1–§I13).
4. **Operating law** — `CONTRIBUTING.md`, `ARCHITECTURE.md`, the worktree `CLAUDE.md`,
   `PACKET_STANDARD.md`, `OWNER_DECISION_QUEUE.md` §28/§31/§38.4/§42–§45/§47/§49/§50.
5. **Design after reconciliation** — `DESIGN_FP_ARCH_IN.md` §IN-1 **with its dated `[CORRECTED
   2026-08-12]` block**; `DESIGN_FP_INFORMATION.md` §IN-1; `docs/content/RECEIPT_POOLS_INFORMATION.md`
   §IN-1 and its slot convention.
6. **Never authority** — `SOL_QUEUE.md`, `START_HERE`, `docs/briefs/`, and
   `DESIGN_FP_ARCHITECTURE.md`'s PROGRESS block.

---

## 2. Outcome and non-goals

### 2.1 What IN-1c-a builds — one behavior family

**One user-facing surface: the standing line, now spoken by the governed corpus.** Composed of

- the estate's **fifth phrased-kind registry family** — `INFORMATION_KIND_REGISTRY`, one row,
  `section: null`, on the SOVEREIGNTY/WR-10 template;
- its **receipt-pool module** carrying the nine annex-verbatim variants;
- `INFORMATION_ANNEX_URL`, so the annex has a reader and the corpus stops being decoration;
- the **read-model's sentence source moved** from a hand-composed template to `informationReceipt`;
- the family's **own kind-pool walker**, with the shared template's negative controls.

### 2.2 Explicit non-goals

As §-1's table. In addition, stated so nobody "helpfully" takes them:

| Excluded | Why |
|---|---|
| A ninth key on the `MirrorRecord`, a new `MIRROR_BANDS` member, a new `basis` token | each pinned by exact ordered equality, and one is coupling-manifest row 14's cross-program pre-pin |
| A second kind (`mirror_shift`, `mirror_confidence_degraded`) in the new registry | §-1 R1/R2 — a registry row without an honest producer is a chartered orphan, and GR-5A's compile found two of those already in this estate |
| A `WHAT_PHRASES` row for `mirror_standing_line` | ⛔ **FORBIDDEN for a `section: null` kind** (§I3) — and unnecessary: nothing routes it |
| Widening `HERALD_SECTIONS`, or any `EXACT_SECTION` row | IN-5's, and IN-1c-b's interim declaration — not this packet's |
| Repairing the nine FNV-forked pick sites | a cross-family refactor over four landed registries — STOP, docketed |
| A `{season}` supplier | chair Q2; two variants are declared unreachable **with a live anti-vacuity control**, not quietly dropped |
| Any change to the DM `<details>` expansion, the heading, the public-dossier suppression, or the premium seam | IN-1b's, landed and untouched |

---

## 3. Verified tree contract

Measured at `fc8451c4`. **Every line number is a hint; every symbol is the instruction.**

### 3.1 The corpus — LANDED, unread, and this packet's raw material

| Role | File | Required fact (measured) |
|---|---|---|
| The annex | `docs/content/RECEIPT_POOLS_INFORMATION.md` | 917 lines; IN-1 block `:265-311`; `### mirror_standing_line (IN-1; the dossier standing line under "WHAT THE NEIGHBOURS HAVE BEEN SHOWN") — town page — significance: routine (dossier line)` at `:298`; `SLOTS: {counterpart}, {band}, {season}`; `AUDIENCE: public`; **nine numbered variants** |
| Its consumers | — | ⛔ **ZERO.** `git grep -l 'RECEIPT_POOLS_INFORMATION' HEAD -- src/ tests/ scripts/ supabase/` → **0 files.** Every hit outside itself is a design document |
| The reader that would read it | `tests/helpers/receiptAnnex.js` | **89 eff / 200 raw.** Exports `WAR_ANNEX_URL`, `GRAMMAR_ANNEX_URL`, `TRADE_ANNEX_URL`, `anchoredOnce`, `receiptAnnexPool`. ⛔ **No `INFORMATION_ANNEX_URL`** — measured **0** occurrences tree-wide |
| The per-variant slot arities | derived from the annex text | v1 `[]` · v2 `[counterpart, band, season]` · v3 `[band]` · v4 `[counterpart]` · v5 `[band]` · v6 `[]` · v7 `[counterpart, season]` · v8 `[]` · v9 `[]` |

### 3.2 The registry family template — SOVEREIGNTY/WR-10 is the freshest full precedent

| Role | File | Measured |
|---|---|---|
| The registry + pick | `src/domain/worldPulse/sovereigntyNews.js` | 313 eff / 493 raw; 15 kinds |
| The pools | `src/domain/worldPulse/sovereigntyReceiptPools.js` | 125 eff / 162 raw; **zero imports** |
| The walker | `tests/lint/sovereigntyKindPools.walker.test.js` | 181 eff / 267 raw; ⭐ **exactly ONE `describe` and EIGHT straight-line `test(` calls** — the census shape this packet inherits |
| ⭐ **THE PICK TO COPY** | `src/domain/worldPulse/grammarNews.js:238` | `eligible[Math.floor(hash01(namespacedSeed) * eligible.length)]`, with the seed namespaced `` `${seed}#${row.kind}` ``, and the cure documented in its own comment |
| ⛔ **THE PICK NOT TO COPY** | `sovereigntyNews.js:330`, `commercialReasonsNews.js:197`, `eventProse.js:75/:95/:338/:433/:538/:654/:768` | `eligible[fnv1a32(namespacedSeed) % eligible.length]` — **NINE sites carrying the low-bit aliasing hazard `grammarNews.js` names and cures** |
| The row constructor's parameter order | `grammarNews.js:72` | `grammarKindRow(kind, significance, audience, section, requiredSlots, contexts)` — ⛔ a different order is a STOP |
| ⭐ The `section: null` precedent | `grammarNews.js:123` | `grammarKindRow('treaty_age_line', 'n/a', 'public', null, [ … ])` — the estate's landed flag-gated **dossier line**, consumed by `treatyDocument.js#treatyAgeLine`, rendered render-if-truthy |

### 3.3 ⛔⛔ THE LAYER MAP CONVICTS BOTH FILE NAMES — executed (§I2)

| Measurement | Value at `fc8451c4` |
|---|---|
| `CENSUS_SCOPE_RE` (`couplingInclusion.walker.test.js:559`) | `/^src\/domain\/(?:worldPulse\|spatial)\//` |
| The INFO prefix arm (`:136`) | `/^src\/domain\/worldPulse\/(?:beliefMap\|belief[A-Z]\|credibility\|brokerage\|**information**\|disinfo\|intel\|sightPosture\|outboundImpression)/` |
| The INFO second-order arm (`:165`) | `/^src\/domain\/worldPulse\/secondOrderBelief\.js$/` — an **EXACT PATH**, authored so *"a prefix would claim files nobody has designed and silently widen a frozen family"* |
| `UNLAYERED_BASELINE_CEILING` (`:590`) | **179** |
| `tests/lint/.coupling-unlayered-baseline.json` | **exactly 179 entries — ZERO HEADROOM** |
| `ARGUED_ROSTER_CEILING` (`:556`) | **19** |
| `LAYER_FLOORS.INFO` | **13** (shrink-guard; growth is free) |

⇒ **`informationNews.js` and `informationReceiptPools.js` are claimed by the `information` prefix on
the day they land and cost ZERO.** ⛔⛔ **THE NAMES ARE LOAD-BEARING AND A RENAME IS A STOP.**
`mirrorPools.js`, `humNews.js`, `secondOrderPools.js`, `standingLinePools.js` — each matches
**nothing**, lands in a baseline with zero headroom, and reds an exact equality.

### 3.4 The coupling bill is ZERO, and it is a measurement (§I6, CW-0w priced)

- `informationReceiptPools.js` imports **nothing** (the `grammarReceiptPools.js` precedent: measured
  zero import lines) ⇒ no edges at all.
- `informationNews.js` imports `hash01` from `src/domain/region/contestMath.js` — **`region/` is
  outside `CENSUS_SCOPE_RE`**, so it is not a layered target — and its own INFO sibling. ⇒ **no
  cross-layer pair.** This is `grammarNews.js`'s exact import shape (`contestMath.js` + its pools).
- `neighbourMirror.js` is `src/domain/display/` — **outside the census entirely** — so its new edge
  mints no layer claim, no pair and no row.
- ⇒ `src/domain/certification/couplingRegistryInfo.js` (**37 eff / 150 raw**) stays at its **two**
  rows (`IN0A_PLANT_HANDOFF_COUPLING`, `IN0C_DISCLOSURE_SIGNING_CREDIT_COUPLING`).
  **VERIFY-AT-BUILD: run `couplingInclusion.walker.test.js`. Any measured pair is a source-repair
  STOP — never a registry row invented at the keyboard, never a baseline line.**

### 3.5 The two census walkers this packet moves

| Walker | Live literal at `fc8451c4` | Required after |
|---|---|---|
| `kindPoolFloors.walker.test.js:77` `REGISTRIES` | a hand-listed frozen array of **9** — WAR_DISPOSITION, WAR_LINEAGE, WAR_COST, WAR_RULING, WAR_COALITION, ENVOY, COMMERCIAL, GRAMMAR, SOVEREIGNTY | **10**, INFORMATION appended |
| same, `:182` | `expect(REGISTRIES).toHaveLength(9)` | `toHaveLength(10)` |
| same, `:173` `REGISTERED_KIND_COUNT` | **111** | **112** |
| same, `:157` `ROUTED_TOKENS` | **378** | **378 — UNMOVED** |
| same, `:328` | `expect(REGISTERED_KIND_COUNT - routedAndRegistered.length).toBe(7)` | **`toBe(8)`** |
| same, `:167` `LEGACY_UNVOICED_TOKENS` | **274** | **274 — UNMOVED** |
| `sovereigntyLightingContract.walker.test.js` CENSUS row | ⚠ **RE-DERIVED AT `d5a6c009`: `files: 2430, parked: 366, credited: 2064, titles: 20123, suiteTitles: 5655`** — INT-3B moved the tuple and re-narrated the row, so the address is no longer `:4224`; **navigate by the `files:` symbol, never by the line number** | **`2431 / 366 / 2065 / 20131 / 5656`**, re-derived WHOLE |

⭐ **THE ROUTED-TOKEN IDENTITY, CHECKED INDEPENDENTLY.** Parsing `EXACT_SECTION` out of
`src/domain/realm/heraldRouting.js` at HEAD yields **378 unique keys**, matching the walker's frozen
`ROUTED_TOKENS = 378` exactly. So the *"registered without routing"* shape is real, and the
divergence check at `:328` is the only arm that moves.

⚠ **THE DIVERGENCE COMMENT IS PART OF THE CONTRACT.** `:162-172` narrates every prior mover by name
(`treaty_disclosure_opened`, `disavowed_by_succession`, `succession_question_opened`,
`succession_question_open`, `reaffirmed`). **Append one line naming `mirror_standing_line` and its
reason** — a no-desk dossier row — or the next reader meets a numeral with no story.

### 3.6 The mount point and the render — UNTOUCHED, and that is the design

| Fact | Measured |
|---|---|
| `src/components/new/tabs/RelationshipsTab.jsx` | **252 eff / 310 raw** against a 600 ceiling. ⛔ **NOT in this manifest** — the sentence changes inside the read-model, so no component moves |
| `src/components/OutputContainer.jsx` | **599 eff / 1054 raw** — **HOT FILE, one line of headroom.** ⛔ **NOT in this manifest** |
| `title=` census | 485, shrink-only, zero headroom. ⛔ No JSX moves ⇒ untouched |
| Deep-craft kill list | `85/69/167/163`. ⛔ No component moves ⇒ untouched |

### 3.7 Ceilings, baselines and censuses this packet lives inside — all executed

- **eslint size ratchets** (effective lines, `skipBlankLines` + `skipComments`):
  `src/domain/**/*.js` → **800**. **MEASURED: `scripts/.size-baseline.json` holds TEN file
  entries** (`App.jsx`, `explanation.js`, `applyWorldPulse.js`, `npcAgency.js`, `pulseKernel.js`,
  `roadsKernel.js`, `settlementStrategy.js`, `warTermination.js`, `npcGenerator.js`,
  `settlementSlice.js`) — **none of this packet's targets is baselined**, so the layer ceiling binds.
  `neighbourMirror.js` at **79 of 800** is roomy.
- **THE FOUR HOT FILES, RE-EXECUTED** with eslint's own `Linter`: `OutputContainer.jsx` **599**/600,
  `convergence.js` **798**/800, `peaceTerms.js` **797**/800, `informationStatecraft.js` **780**/800.
  **All four match the capsule exactly. This manifest names NONE of them**, so §I7's
  net-zero hot-file rule is satisfied vacuously and is stated only so the absence is deliberate.
- **Test ratchet:** `scripts/.test-ratchet-baseline.json` holds **16 entries** against
  `const CEILING = 17` (`testRatchet.test.js:179`). Land with **no** new baselined failure.
  ⚠ **THE PRE-EXISTING-RED LIST IS DERIVED FROM THAT FILE WHOLE, NEVER FROM MEMORY** — the IN family
  has already shipped one packet whose list named two and missed a third. Entry 5 is
  `tests/docs/enforcement-claims.test.js`; `tests/lint/proseNumerics.test.js` carries its own entry;
  `tests/copy/voiceMechanics.test.js` carries four.
- **Observed-shape ratchet:** `scripts/.observed-shape-readers-baseline.json` freezes a
  **387-file / 1,412-finding** inventory (`minRows: 40`). ⭐ **MEASURED AND IT IS THE ROW THAT
  MATTERS: `neighbourMirror.js`, `secondOrderBelief.js`, `grammarNews.js` and
  `grammarReceiptPools.js` are ALL ABSENT from that inventory** (`settlementRumors.js` is present, as
  a control that the scope really covers `src/domain/display/`). ⇒ this packet should mint **zero**
  new findings — **VERIFY-AT-BUILD, and a new finding is a STOP, never a `--write`.**
  ⚠ The gate's own OSR count is **1998** (capsule, citable: no measured path moved in the docs-only
  window) — a different measurer from the baseline inventory above; **report both by name.**
- **Anchored negatives:** a file in neither anchor ledger has a ceiling of **ZERO**. The new walker
  routes every negative through `tests/helpers/anchoredNegatives.js` **called by name on the same
  line**, or carries `// anchored:` immediately above. ⚠⚠ **THE WALKER SCANS COMMENT TEXT** —
  paraphrase the matcher names, never quote them.
- **Claim debt:** ⚠⚠ the IMPLEMENTATION half authors **no `docs/**.md`**, so no naked-claim key is
  minted at I1. ⛔ **But this packet document and the family preamble ARE `docs/**.md` and ARE
  in-corpus by construction** — the claim walker's corpus is every root-level and `docs/**` markdown
  minus a frozen exempt list, so a promotion is exactly as much of a claim-debt risk as a design
  edit. **EXECUTED AT PROMOTION: the claim vocabulary regex, applied line-by-line to both landed
  files, matched ZERO lines** — TC13's draft carried exactly one match (its own cautionary sentence,
  which quoted the vocabulary) and the promoting lane reworded it rather than minting a key.
  ⚠ **Read such a count LITERALLY and never by substring**: a problem-count line reading thirty
  contains the zero-count spelling inside it, so a `grep` for the zero spelling answers "clean" on a
  file with thirty problems. Match the whole line, count the matches, compare to zero.

---

## 4. Hard scope budget

| Limit | Budget | IN-1c-a | |
|---|---:|---|---|
| Behavior families | 1 | **1** — the standing line, spoken by the corpus | ✓ |
| New persisted record families | 1 | **0** | ✓ |
| Named writer per changed state | 1 | **0** — nothing is written | ✓ |
| Feature flags | 1 | **0 — rides `secondOrderBeliefEnabled`** | ✓ |
| User-facing surfaces | 1 | **1** — the existing standing-line block; **no new mount** | ✓ |
| Direct production consumers | 2 | **1** — `neighbourMirror.js` consumes the registry | ✓ |
| New logic-bearing production leaves | 2 | **1** — `informationNews.js` | ✓ |
| Existing logic-bearing production files modified | 3 | **1** — `neighbourMirror.js` | ✓ |
| Registration-only production files | 3 | **2** — `informationReceiptPools.js` (pure data, zero imports, on the `grammarReceiptPools.js` precedent) and `subsystemRowsVirtual.js` | ✓ |
| Test-helper files modified | — | **1** — `receiptAnnex.js` (one exported URL + its reason comment) | declared |
| Handwritten files total | 12 | **11** (§7) | ⚠ near cap |
| New/changed effective production lines | 400 | ~200 projected | ✓ |
| Each new leaf | 250 | `informationNews.js` ~120 · `informationReceiptPools.js` ~50 projected | ⚠ measure with eslint's own `Linter`, never `wc -l` |
| Shared/hot-file delta | 15 each | **no hot file is named** | ✓ |
| Acceptance cases | 8 | **7** (§9) | ✓ |
| Generated artifacts | — | **NONE** — `simulationRules.js` is not in the manifest, so no edge-shared rebuild is owed | declared |

⭐ **One row is near cap and none carries an override.** Adding `mirror_shift`'s pool and producer
(the rejected alternative) breaks handwritten files, adds a hot file, adds an authoring site, moves
three certification pins and opens the desk question. **Breaking any of those is a STOP, not a
renegotiation.**

---

## 5. Preflight

```sh
git status --short --branch
git rev-parse HEAD                                            # expect d5a6c0094a373d50f7d4870d44fb84f598164e85
git merge-base --is-ancestor d5a6c009 HEAD                     # this packet's verified base
git merge-base --is-ancestor fc8451c4 HEAD                     # TC13's COMPILE base — kept, because §-2's
                                                               # re-derivation table is stated across that window
git merge-base --is-ancestor af3d93c8 HEAD                     # IN-1b's landing
git merge-base --is-ancestor 5bf06481 HEAD                     # IN-1a's landing
git merge-base --is-ancestor 4c0f2f38 HEAD                     # SP-B

# ⛔ THE PORCELAIN CAN LIE HERE — prove the tree, do not read the letters.
git diff HEAD --stat                                           # expect EMPTY (working tree == HEAD)
git diff --cached --stat                                       # non-empty ⇒ stale index, RESERVED, never staged

# Substrate untouched since the verified base.
git log --oneline fc8451c4..HEAD -- \
  src/domain/worldPulse/secondOrderBelief.js \
  src/domain/display/neighbourMirror.js \
  src/domain/worldPulse/grammarNews.js \
  src/domain/worldPulse/grammarReceiptPools.js \
  src/domain/realm/heraldRouting.js \
  src/domain/certification/subsystemRowsVirtual.js \
  tests/helpers/receiptAnnex.js \
  tests/helpers/kindPoolWalker.js \
  tests/lint/kindPoolFloors.walker.test.js \
  tests/lint/couplingInclusion.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  docs/content/RECEIPT_POOLS_INFORMATION.md                    # expect EMPTY

# CREATE targets absent — RE-VERIFY; they were absent at compile.
test ! -e src/domain/worldPulse/informationNews.js
test ! -e src/domain/worldPulse/informationReceiptPools.js
test ! -e tests/lint/informationKindPools.walker.test.js

# Targets clean (path-scoped — foreign dirt elsewhere is RESERVED, never touched).
for f in src/domain/display/neighbourMirror.js tests/helpers/receiptAnnex.js \
         src/domain/certification/subsystemRowsVirtual.js \
         tests/lint/kindPoolFloors.walker.test.js tests/domain/neighbourMirror.test.js \
         tests/ui/neighbourMirrorLine.test.js \
         tests/property/secondOrderBeliefDormancyFence.test.js \
         tests/lint/sovereigntyLightingContract.walker.test.js; do
  git diff --quiet -- "$f" || echo "DIRTY TARGET: $f"
done

# Live symbols — by symbol, never by line number.
rg -n 'export function neighbourMirrorLines|export const MIRROR_BAND_WORDS|function standingSentence' \
   src/domain/display/neighbourMirror.js
rg -n 'export const WAR_ANNEX_URL|export const GRAMMAR_ANNEX_URL|export const TRADE_ANNEX_URL|export function receiptAnnexPool|export function anchoredOnce' \
   tests/helpers/receiptAnnex.js
rg -n 'function grammarKindRow|export function grammarReceipt|hash01\(namespacedSeed\)' \
   src/domain/worldPulse/grammarNews.js
rg -n 'const REGISTRIES = Object.freeze' tests/lint/kindPoolFloors.walker.test.js

# ⛔⛔ THE LAYER-MAP CONVICTION — §3.3. Run BEFORE naming a file.
rg -n 'CENSUS_SCOPE_RE|UNLAYERED_BASELINE_CEILING|ARGUED_ROSTER_CEILING' tests/lint/couplingInclusion.walker.test.js
node -e "console.log('unlayered baseline entries:', require('./tests/lint/.coupling-unlayered-baseline.json').length)"   # expect 179 vs ceiling 179 — ZERO headroom

# ⛔ COUNT, NEVER INHERIT — the seven figures this packet's pins are written against.
rg -n 'const ROUTED_TOKENS|const REGISTERED_KIND_COUNT|const LEGACY_UNVOICED_TOKENS|toHaveLength\(9\)|toBe\(7\)' tests/lint/kindPoolFloors.walker.test.js
rg -n 'files: 2430, parked: 366' tests/lint/sovereigntyLightingContract.walker.test.js   # re-derive from the FILE, never from this packet; navigate by SYMBOL — INT-3B moved this row's line number
node -e "console.log('ratchet entries:',Object.keys(require('./scripts/.test-ratchet-baseline.json').entries).length)"   # expect 16 / CEILING 17
node -e "const b=require('./scripts/.size-baseline.json');console.log('size-baseline files:',Object.keys(b).filter(k=>!k.startsWith('_')).length)"   # expect 10, none of ours
node -e "const b=require('./scripts/.observed-shape-readers-baseline.json');console.log('OSR files:',Object.keys(b.inventory).length,'findings:',Object.values(b.inventory).reduce((n,o)=>n+Object.keys(o).length,0))"   # expect 387 / 1412
node -e "const m=require('./docs/implementation/PACKET_MANIFEST.json');const p=m.packets||m;console.log('packets:',p.length,'non-terminal:',p.filter(x=>!['LANDED','SUPERSEDED'].includes(x.status)).map(x=>x.id))"

# ⛔⛔ THE CORPUS GREP — every symbol this packet mints must read ZERO first.
rg -n 'mirror_standing_line|INFORMATION_ANNEX_URL|INFORMATION_KIND_REGISTRY|informationReceipt|RECEIPT_POOLS_INFORMATION' \
   src/ tests/ scripts/ supabase/ --glob '!node_modules'
# EXPECTED: ZERO hits. ⛔ ANY HIT IS A PREMISE REFUTATION — report, do not work around it.

# ⛔ AND THE ONE THIS PACKET MUST NEVER SPELL.
rg -n 'secondOrderBeliefEnabled' src/ | wc -l    # expect 5, and 5 after — the new files never spell it
```

Any target collision or material symbol drift makes this packet `STALE`.

### 5b. Baselines

⚠ **Lane TC13 executed NO test, build, gate, lint or typecheck command.** Its rows below marked
**MEASURED BY READ / BY NODE** are receipts of *reads* against the HEAD object; every row marked
**UNMEASURED** is genuinely unmeasured and the implementer captures it.

| # | Premise | Exact command | Expected / recorded |
|---|---|---|---|
| B1 | The mirror's own suites green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/secondOrderBelief.test.js tests/property/secondOrderBeliefDormancyFence.test.js tests/domain/neighbourMirror.test.js tests/ui/neighbourMirrorLine.test.js` | **UNMEASURED** — exit 0. ⭐ **CAPTURE THE RENDERED OUTPUT OF THE UNMODIFIED TAB HERE — it is C4's dark golden and it cannot be captured after the edit** |
| B2 | Every kind-pool walker green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/kindPoolFloors.walker.test.js tests/lint/sovereigntyKindPools.walker.test.js tests/lint/grammarLifecycleKindPools.walker.test.js tests/helpers/kindPoolWalker.test.js tests/domain/impactKindWalkers.test.js` | **UNMEASURED** — exit 0. ⚠ Three WAR walkers carry ratcheted pre-existing reds; derive the list from the ratchet baseline WHOLE |
| B3 | The coupling walker green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/couplingInclusion.walker.test.js` | **UNMEASURED** — exit 0, so a post-edit pair is attributable |
| B4 | `REGISTRIES` length + the four literals | read the walker | **MEASURED BY READ: `toHaveLength(9)`; `REGISTERED_KIND_COUNT = 111`; `ROUTED_TOKENS = 378`; the divergence `toBe(7)`; `LEGACY_UNVOICED_TOKENS = 274`** |
| B5 | `EXACT_SECTION` really holds 378 | parse the HEAD object | **MEASURED BY NODE: 378 keys, 378 unique — the walker's literal and the source agree** |
| B6 | Lighting census row | read the walker | ⚠ **RE-READ AT `d5a6c009`: `2430 / 366 / 2064 / 20123 / 5655`** (TC13 read `2429 / 366 / 2063 / 20115 / 5654` at `:4224`; INT-3B moved both the tuple and the address). ⛔ Re-derive from the FILE at preflight, by symbol |
| B7 | Runtime denominator | capsule (stamped `28d2824b`, consumable at `d5a6c009` under the docs-only-window clause) + the chair's §65.1 terminal receipt | ⚠ **28146 tests / 16 frozen** — TC13 cited 28138 at its own base; ⛔ the implementer's own gate tail is the receipt either way |
| B8 | `validate:packets` | ⭐ **RE-EXECUTED by lane TE13** by loading the live manifest through `scripts/implementation-packets.mjs` | ⚠ **46 packets, 45 LANDED + 1 SUPERSEDED, 0 READY, ZERO non-terminal rows, ZERO reserved paths, ZERO collisions with these eleven.** TC13 measured 45/44/1 at `fc8451c4`; the +1 is INT-3B's landed row, and **the structural finding — zero reservations, so the census walker is FREE — is unchanged** |
| B9 | The unlayered baseline has zero headroom | `node -e …` | ⭐ **EXECUTED: 179 entries against `UNLAYERED_BASELINE_CEILING = 179`** |
| B10 | Effective-line receipts | eslint's own `Linter`, `max-lines {skipBlankLines, skipComments}`, against the HEAD object | ⭐⭐ **EXECUTED BY LANE TC13:** `neighbourMirror.js` **79**/188 · `receiptAnnex.js` **89**/200 · `secondOrderBelief.js` **139**/300 · `grammarNews.js` **118**/267 · `grammarReceiptPools.js` **112**/190 · `sovereigntyNews.js` **313**/493 · `sovereigntyReceiptPools.js` **125**/162 · `subsystemRowsVirtual.js` **603**/1102 · and the four hot files **599 / 798 / 797 / 780**, all four EXACT to the capsule |
| B11 | Typecheck posture | `npm run typecheck:ratchet` then `npm run typecheck:domain:strict` | **UNMEASURED** — exit 0 both, at exact floors (`173/173`, `1134/1134`). ⚠ **Both new domain files are in `tsconfig.domain-strict.json`'s inherited `src/domain/**/*.js` include and their error allowance is ZERO** — strict-clean or the packet stops |
| B12 | Observed-shape ratchet green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/observedShapeReaders.walker.test.js` | **UNMEASURED** — exit 0. ⚠ Budget the wall clock: its `beforeAll` is sized to 900 s. **MEASURED BY NODE: 387 files / 1412 findings, and none of this packet's four production targets is in the inventory** |
| B13 | Pre-existing gate reds | committed-base run, capturing `$?` yourself | **MEASURED BY NODE: the ratchet holds 16 entries** — derive the list from that file WHOLE, never from memory |
| B14 | The anchor walker green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js` | **UNMEASURED** — exit 0 before, and **the §31 preflight runs again BEFORE green is declared** |
| B15 | The three CREATE targets are absent | `git cat-file -e HEAD:<path>` | ⭐ **EXECUTED: all three ABSENT at `fc8451c4`** |

---

## 6. Exact contracts

### 6.1 `src/domain/worldPulse/informationReceiptPools.js` — CREATE

**Pure data. ZERO imports** (the `grammarReceiptPools.js` shape, measured). Exports
`INFORMATION_RECEIPTS`, a frozen map from kind to a frozen pool.

- **`mirror_standing_line`: exactly NINE variants, ANNEX-VERBATIM** in the annex's own order, each a
  string or an `(x) => …` template exactly as the annex's slot marks require.
  ⛔ **Not one word is edited, reordered, added or dropped.** A corpus defect is a chair annex act
  (§I1). ⛔ **Never pad a pool to clear a floor** — nine already clears the chronic floor of eight.
- ⛔ **NO DIGITS** anywhere (the annex's own law): counts speak in band words.
- ⛔ **NO PERCEPTION VERB** — `believe`, `believes`, `thinks`, `perceive`, `in their eyes`. The
  authored nine are already clean; **C5 drives this against rendered output rather than trusting it.**
- ⚠ The file must contain **no U+2014 em-dash and no `!`** (§I7 HZ-BANKEDVOICE — the estate-wide
  walker's arms are banked and will not catch a new one).
- ⛔ It must not contain the literal `secondOrderBeliefEnabled`, anywhere, including a comment.

### 6.2 `src/domain/worldPulse/informationNews.js` — CREATE

```js
INFORMATION_KIND_REGISTRY   // Object.freeze([ informationKindRow('mirror_standing_line', 'routine', 'public', null, REQUIRED_SLOTS) ])
INFORMATION_KINDS           // Object.freeze(registry.map(row => row.kind))
informationReceipt(kind, seed, interp = {})
  -> { kind, line, familyId, templateIndex, significance, audience, section } | null
```

- **Row constructor parameter order is `(kind, significance, audience, section, requiredSlots,
  contexts)`** — `grammarNews.js:72`'s exact order. ⛔ A different order is a STOP.
- **The one row is `('mirror_standing_line', 'routine', 'public', null, …)`** — CR-IN1C-1.
  `section: null` because it renders into the town page and files no desk (§I3).
- **`requiredSlots` is a NINE-ELEMENT array, one entry per variant**, exactly as §3.1's arity table
  measures them. ⛔ **`requiredSlots.length !== pool.length` mints the `slot-arity` reason in
  `registrationReasons` and reds the walker** — the arity is the pin, not a formality.
- ⭐⭐ **THE PICK IS `grammarNews.js`'s, VERBATIM, AND THE FILE SAYS WHY:**
  ```js
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed
    ? eligible[Math.min(eligible.length - 1, Math.floor(hash01(namespacedSeed) * eligible.length))]
    : eligible[0];
  ```
  with an in-file comment recording that **nine sibling call sites still use
  `fnv1a32(seed) % length`**, that the estate has already documented the low-bit aliasing hazard in
  that spelling, and that repairing them is `CR-IN1C-DRIFT`'s and not this file's.
- **Eligibility filtering is `grammarReceipt`'s**: a variant is eligible only when every one of its
  `requiredSlots` arrives as a non-empty trimmed string. **Zero eligible ⇒ return `null`.**
- **Sentence-casing at the render**, on `grammarNews.js`'s recorded reason: an authored family opens
  with a lower-case slot word, and the casing is the renderer's business rather than an annex edit.
- ⛔ It must not contain the literal `secondOrderBeliefEnabled`.

### 6.3 ⛔ THE SEASON SLOT — TWO VARIANTS ARE UNREACHABLE, AND THE PIN SAYS SO OUT LOUD (CR-IN1C-2)

`neighbourMirrorLines` has a `tick` and no calendar. Supplying `{season}` means importing
`seasonForTick` from `worldPulse/worldState.js` — **a new display→engine edge to the world-admission
module**, owing a separate `smoke:boot` — or authoring a **fifth** local season copy beside the four
the estate already keeps deliberately *so the display chunk never imports the engine chunk*
(`chronicleReadModel.js:106`, `humanizeEngineTokens.js:20`, `almanac.js:40`, `mapDress.js:86`).

⇒ **RULED: neither, in this packet.** `interp` supplies `{counterpart}` and `{band}` only.
**Variants 2 and 7 are UNREACHABLE at this base and are declared so.**

⛔⛔ **AND THE PIN THAT KEEPS THAT HONEST IS MANDATORY (C3).** It is not enough to assert that seven
are eligible — a filter that had stopped filtering would also yield a stable number. The pin asserts
**both directions in one test**: with `{counterpart, band}` the eligible set is **exactly seven and
excludes 2 and 7 by index**, and with a `{season}` added it is **exactly nine**. Without the second
arm this is the recorded stuck-filter vacuity.

### 6.4 `tests/helpers/receiptAnnex.js` — MODIFY

Add `export const INFORMATION_ANNEX_URL = new URL('../../docs/content/RECEIPT_POOLS_INFORMATION.md', import.meta.url);`
beside the three landed URLs, with the file's own convention of a short reason comment: the
extractor's two defects (the address lie, the first-match hole) are properties of the READER, so a
fourth volume takes the same reader rather than forking one.
⛔ **No other line of this helper moves.** Its legacy-forward road simply never runs for this volume,
and the walker asserts that positively (§6.5).

### 6.5 `tests/lint/informationKindPools.walker.test.js` — CREATE

**On `sovereigntyKindPools.walker.test.js`'s exact registered shape: ONE literal `describe` and
EIGHT straight-line `test(` calls.** ⛔ No `.each`, no loop registration, no nested describe, no
`skip`, no `todo` — each parks the WHOLE FILE and the census arithmetic still closes while
`credited` silently does not move (§I10).

| # | Title (straight-line) | What it asserts |
|---:|---|---|
| 1 | the one-kind census and every reader join are exact | the registry's kind list, significance, audience, `section: null`, and authored depth — pinned as VALUES, with `registrationReasons(row, …)` `toEqual([])` |
| 2 | the pool is the annex's, verbatim and in order | `receiptAnnexPool` against `INFORMATION_ANNEX_URL`; and — see **D6** — the arity table **derived from the annex text through a SENTINEL `interp`** pinned against the registry's parallel `requiredSlots`, the orthogonal witness that the filter picked the right rows in the right order. ⛔ Not the reader's `requiredSlots` return: that is `null` on any volume that is not a legacy forward |
| 3 | the annex address is the INFORMATION volume, not a legacy forward | `from === 'information'` asserted **positively** (the sovereignty walker's recorded reason: never leave it to be discovered when a future merge relocates a pool) |
| 4 | THE FIRST-MATCH LAW: every document anchor matches exactly once | `anchoredOnce` over each anchor this walker rides |
| 5 | MUTANT — a duplicated heading throws instead of retargeting the slice | the reader convicts rather than silently re-pointing |
| 6 | MUTANT — a rotted kind heading throws instead of returning an empty pool | an extractor that returns `[]` is the bug |
| 7 | the no-desk row files no desk and claims no phrase | `SECTION_OF` is not consulted for a `section: null` row; ⛔ `WHAT_PHRASES['mirror_standing_line']` is asserted **undefined** (§I3) |
| 8 | the eligible set is exactly seven without a season and exactly nine with one | §6.3's two-armed control |

⚠ **MUTATION-NAMING:** the basename **matches** the enforced nomenclature (`walker`), so unlike
IN-1b's acceptance files **this one IS a governed mutation invariant automatically** and lives under
`tests/lint/`. **That is correct and deliberate for a walker** — but it means
`scripts/mutation-coverage-manifest.json` must be checked at build. ⛔ **That file is NEVER
re-serialized** (recorded estate hazard). If a manifest row is genuinely owed, **STOP and report** —
do not rewrite the manifest.

### 6.6 `src/domain/display/neighbourMirror.js` — MODIFY

`standingSentence` is replaced by a call into the registry. Everything else in the file is untouched.

- **The seed is deterministic and campaign-stable**, composed from the ids and the durable date the
  row already holds — e.g. `` `${settlementId}:${counterpartId}:${lastShownTick ?? 'none'}` ``.
  ⛔ **No RNG, no clock read, no store read.** The layer contract is *pure; no store, no rng, no wall
  clock; INERT-NOT-CRASH; strict-clean, zero any-casts.*
- **`interp` is `{ counterpart: counterpartName, band: MIRROR_BAND_WORDS[band] }`** — the band word,
  not the raw rung. ⛔ `MIRROR_BAND_WORDS`, `MIRROR_STALENESS_WORDS` and `MIRROR_BASIS_WORDS` all
  **stay exported and in production use** — see **D8** for the corrected mechanism: the band map
  supplies `{band}`, the basis map drives the DM expansion, and **BOTH the band and staleness maps
  stay live through the total fallback**, which keeps `standingSentence` verbatim. **This packet
  replaces the sentence's SOURCE, not the vocabulary.**
- ⛔⛔ **THE STANDING-SILENCE CLAUSE IS THE COMPOSER'S AND IT STAYS (D7).** `mirror.sealed === true`
  still appends `' Nothing has left our hand since.'` after the governed variant, exactly as today.
  The corpus authors nine standing sentences and authors no silence clause; dropping it would delete
  a landed player-facing fact, and adding it to the pool would be an annex act.
- ⛔⛔ **THE SEED READS `mirror.lastShownTick`, NEVER THE ROW'S.** The row nulls that field for a
  player viewer, so seeding off the row would make the DM and player views draw DIFFERENT variants
  and red `tests/domain/neighbourMirror.test.js`'s *"the player-facing sentence is identical across
  the seam"* pin. The seam moves the EXPANSION and never the sentence.
- ⛔⛔ **`informationReceipt` RETURNING `null` IS A FALL-BACK TO THE LANDED SENTENCE, NOT AN EMPTY
  LINE.** The composer keeps the current template as its total answer, so a corpus regression can
  never render a blank standing line. ⚠ **AND THE FALL-BACK ARM IS DRIVEN BY C7** — an undriven
  fallback is exactly the dead arm the estate's pin-vacuity family names.
- ⛔ **THE ABSENCE RULE IS UNTOUCHED AND COMES FIRST.** `if (mirror === MIRROR_UNKNOWN) continue;`
  stays exactly where it is, **above** any composition, so the dark path never reaches the registry.
- ⛔ **THE FLAG IS NEVER SPELLED HERE** (or anywhere this packet writes) — FENCE 4's exact three-file
  `namers` census reds on a mention, including one inside a comment or a data string.
- ⛔ **BRITISH SPELLING** — `neighbour` throughout, matching the module, the heading and the mount.

### 6.7 `src/domain/certification/subsystemRowsVirtual.js` — REGISTER

The mirror row only:

- `module` gains `src/domain/worldPulse/informationNews.js` and
  `src/domain/worldPulse/informationReceiptPools.js` (the row's `module` paths are asserted to exist
  on disk).
- `aliveness.other` gains one sentence: the standing line's sentence now comes from the governed
  INFORMATION corpus through a registered no-desk kind, and **the subsystem still writes nothing**.
- ⛔ **`aliveness.{eventTypes, moverFamilies, stateKeys}` all STAY `Object.freeze([])`** and
  `soakEvidence` **stays `'unobserved'`**, so `UNOBSERVED_OVERRIDE_CEILING` is untouched — that
  ceiling counts only rows declaring `unobserved` **and** a non-empty channel.
- ⛔ **The invariant `dormancy_rests_on_the_gate_and_on_the_absence_rule` is NOT retired and NOT
  renamed.** IN-1b minted it and both its mechanisms still hold. **A rename here would be the ES-3
  failure in reverse.**

### 6.8 `tests/property/secondOrderBeliefDormancyFence.test.js` — TEST (comment + one arm's evidence)

⭐ **FENCE 3's one-caller claim SURVIVES UNCHANGED and is the reason this member is cheap.**
Measured at `:198`: `expect(importers).toEqual(['src/domain/display/neighbourMirror.js'])` — a scan
of the modules importing the **leaf**. This packet adds **no importer of the leaf**; the new registry
is imported by the read-model, not by the mirror. ⇒ **the array is still exactly one element.**

The only edit is evidentiary: the fence's narrative gains one clause recording that the one caller's
**sentence source** moved into the governed corpus while its **call path** did not. ⛔ **No assertion
is weakened, deleted, or renamed.**

---

## 7. Exact change manifest

| Action | File | Symbol / region | Max Δ | Instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/worldPulse/informationReceiptPools.js` | `INFORMATION_RECEIPTS` | `50` | §6.1. **Pure data, ZERO imports, annex-verbatim.** ⛔ No digits, no em-dash, no `!`, no `secondOrderBeliefEnabled`, no `.npcs`. |
| `CREATE` | `src/domain/worldPulse/informationNews.js` | `INFORMATION_KIND_REGISTRY`, `INFORMATION_KINDS`, `informationReceipt` | `120` | §6.2. ⛔⛔ **THE NAME IS LOAD-BEARING** (§3.3). Strict-clean. Copy `grammarNews.js`'s `hash01` pick, never the FNV one. |
| `MODIFY` | `src/domain/display/neighbourMirror.js` | `standingSentence` + the composer's `interp`/seed | `25` | §6.6. ⛔ The absence rule stays first; the three word maps stay exported; the `null` fallback is total. |
| `MODIFY` | `tests/helpers/receiptAnnex.js` | `INFORMATION_ANNEX_URL` only | `8` | §6.4. ⛔ No other line moves. |
| `REGISTER` | `src/domain/certification/subsystemRowsVirtual.js` | the mirror row's `module` + `aliveness.other` | `12` | §6.7. ⛔ Three channels stay `[]`; `soakEvidence` stays `'unobserved'`; the invariant name is untouched. |
| `CREATE` | `tests/lint/informationKindPools.walker.test.js` | C1–C8 walker arms | `n/a` | §6.5. ⛔⛔ **ONE `describe`, EIGHT straight-line `test(` — no `.each`, no loop registration, no nesting.** |
| `TEST` | `tests/lint/kindPoolFloors.walker.test.js` | the import, `REGISTRIES`, `REGISTERED_KIND_COUNT`, the divergence, and the narrative comment | `n/a` | §3.5. `9 → 10`, `111 → 112`, `toBe(7) → toBe(8)`; **`ROUTED_TOKENS` stays `378`**; append the named reason line. |
| `TEST` | `tests/domain/neighbourMirror.test.js` | the `line` assertions | `n/a` | Amend existing cases — **census-neutral, the census counts titles not text.** ⛔ Register no thirteenth title. |
| `TEST` | `tests/ui/neighbourMirrorLine.test.js` | C4's dark golden + C5's phrase scan | `n/a` | §9. ⛔ Register no ninth title. |
| `TEST` | `tests/property/secondOrderBeliefDormancyFence.test.js` | the FENCE 3 narrative clause only | `n/a` | §6.8. ⛔ **No assertion weakened, deleted or renamed.** |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` row + a dated comment | `n/a` | Re-derive all five WHOLE in ONE run and re-record whole, cause stated. ⛔ Subject to the foreign-title STOP. |

**These eleven handwritten paths are IN-1c-a's complete reserved change set. There are NO generated
artifacts.** `PACKET_MANIFEST.json` carries exactly them, spelled identically.
⚠⚠ **THE THREE `CREATE` SPELLINGS BECOME EXISTENCE-CHECKED AT THE LANDED FLIP** — proved live in
§6's validator simulation, which raised exactly those three errors when `LANDED` was simulated before
the files existed. **Reconcile all three against the landing commit's own `--diff-filter=A` list
BEFORE the flip; a rename during implementation moves the manifest row in the same change.**

**Named do-not-touch:** `src/domain/worldPulse/secondOrderBelief.js` (**code AND header**),
`src/domain/worldPulse/outboundImpression.js` (its header's flag mentions are REQUIRED by a fence
arm), `src/domain/worldPulse/informationStatecraft.js`, `pulseKernel.js`, `applyWorldPulse.js`,
`simulationRules.js`, `beliefMap.js`, `bandedStock.js`, `src/domain/realm/heraldRouting.js`,
`src/domain/display/chroniclersLetter.js`, `src/domain/display/settlementRumors.js`,
`src/domain/worldPulse/grammarNews.js`, `grammarReceiptPools.js`, `sovereigntyNews.js`,
`sovereigntyReceiptPools.js`, `commercialReasonsNews.js`, `eventProse.js`,
`src/components/**` (every file), `src/domain/certification/couplingRegistryInfo.js`,
`tests/lint/couplingInclusion.walker.test.js` and both its baselines,
`tests/helpers/kindPoolWalker.js`, `tests/domain/secondOrderBelief.test.js`,
`docs/content/RECEIPT_POOLS_INFORMATION.md` and every other content annex,
`scripts/.size-baseline.json`, `scripts/.test-ratchet-baseline.json`,
`scripts/mutation-coverage-manifest.json`, `scripts/.observed-shape-readers-baseline.json`,
`tests/fixtures/mechanism-lit-coverage-baseline.json`, `eslint.config.js`, `vite.config.js`,
and every file outside the table above.

### 7b. Reservations and pairwise disjointness — EXECUTED (§6 of the train plan)

| Reserver | Status | Overlap with IN-1c-a |
|---|---|---|
| **All 46 rows in `PACKET_MANIFEST.json`** at `d5a6c009` | **45 LANDED + 1 SUPERSEDED** | ✅ **NONE — a terminal packet reserves nothing.** Re-executed by the promoting lane by loading the manifest through `scripts/implementation-packets.mjs`: **ZERO non-terminal rows, ZERO reserved paths, ZERO collisions with these eleven, ZERO duplicate-change-path errors at READY, LANDED and DRAFT.** ⚠ TC13 measured 44+1 of 45 at `fc8451c4`; INT-3B's landed row is the only difference and it reserves nothing. |

⭐ **THE CENSUS WALKER IS FREE AND IN-1c-a TAKES IT.** It is named only by terminal packets.
⛔ **The moment a second non-terminal packet is promoted the chair MOVES the row.**

---

## 8. Landing discipline this manifest incurs — SIX obligations, all measured

1. ⚠⚠ **THE PARKED-SUITE TRAP TAKES THE WHOLE FILE.** A `test(`/`it(` registered inside a loop is
   `TEST_UNREGISTERED` and **the whole file parks**; a `describe` whose body is not straight-line
   parks the same way; `.each()` parks via `TEST_TABLE_UNPROVEN`. **This bit TC-5a — a file scored 0
   live titles against 34 real tests.** ⇒ register every case straight-line; loops go **inside** an
   `it`, never around one. **Verify `credited` moved to 2064, not just `files` to 2430.**
2. ⭐ **THE LIGHTING CENSUS.** Re-derive **all five figures in ONE run and re-record them WHOLE** —
   never patch `files` alone. ⚠ **The sequence hazard is live:** while any arm is red the census
   **stops measuring**, so later arms may read anything. ⭐ Probe with a temporary `console.log`
   **inside the existing census test, before its first assertion**, so it mints no title and cannot
   move what it measures. ⛔ **STOP** on a foreign lane holding uncommitted test titles, a census
   already red at pristine base from a foreign cause, or the chair not having confirmed the holder.
   **Never census a live shared tree.**
   ⭐ **SINGLE-MEMBER TRAIN ⇒ NO INTERIOR RED:** I1 creates the walker file **and** re-records the
   census in the same commit, so the walker is green at every commit of the chain (§31 ruling 3
   satisfied by there being no red to declare, and the plan says so BY FIGURE).
3. ⚠ **THE FOUR `kindPoolFloors` LITERALS MOVE TOGETHER, AND ONE DELIBERATELY DOES NOT.**
   `REGISTRIES` `9 → 10`, `toHaveLength(9) → (10)`, `REGISTERED_KIND_COUNT` `111 → 112`, the
   divergence `toBe(7) → toBe(8)` — and **`ROUTED_TOKENS` stays `378` because a `section: null` row
   registers without routing.** ⛔ **Any of the five moving in a direction this packet did not
   predict is a STOP**, not an adjustment.
4. ⚠ **ANCHORED NEGATIVES — AND THE WALKER READS COMMENTS.** The new walker file has a ceiling of
   **ZERO** unanchored negatives. Route every one through `tests/helpers/anchoredNegatives.js`,
   called by name on the same line, or `// anchored:` on the line immediately above.
   ⚠⚠ **Quoting a matcher name inside a comment registers a fresh violation.** Paraphrase; never
   quote. **The §31 preflight runs BEFORE green is declared**, not after.
5. ⚠ **THE MUTATION MANIFEST.** The new walker's basename matches the enforced nomenclature and it
   lives under `tests/lint/`, so it is a governed invariant automatically. ⛔ **Never re-serialize
   `scripts/mutation-coverage-manifest.json`** — if a row is genuinely owed, STOP and report.
6. ⚠ **WHAT IS NOT OWED, measured so nobody "helpfully" edits it:**
   `heraldRouting.js` (no desk, no `EXACT_SECTION` row); `chroniclersLetter.js` (`KIND_SECTION` not
   owed for a no-desk row); `settlementRumors.js` (`WHAT_PHRASES` **FORBIDDEN** for a `section: null`
   row); `impactKindWalkers.test.js` (its scan enrols `impactKind: '<literal>'` write sites and this
   packet mints none); `couplingInclusion.walker.test.js` and both baselines (§3.4);
   `couplingRegistryInfo.js` (no cross-layer pair ⇒ no row); `simulationRules.js` and every edge
   bundle (not in the manifest); `src/components/**` (nothing renders differently structurally);
   `tests/fixtures/mechanism-lit-coverage-baseline.json`;
   `scripts/.observed-shape-readers-baseline.json` (**VERIFY zero new findings; a new one is a STOP,
   never a `--write`**); every content annex.

---

## 9. Acceptance matrix — the closed denominator (7 of 8)

| ID | Case | Required observation |
|---|---|---|
| **C1** | **Main reachable behavior** | Lit; a campaign world where settlement `s` holds a `disinfo` row toward `o`. `neighbourMirrorLines({…})` returns one row whose `line` is **one of the nine annex variants with its slots filled** — asserted by membership in the pool rendered under the same `interp`, never by a hardcoded sentence. `band`, `staleness`, `basis` and `lastShownTick` are byte-identical to what the pre-change read-model returned for the same world. |
| **C2** | ⭐ **DETERMINISM AND STABILITY, the property a seeded pick must have** | Two calls with identical inputs yield **byte-identical** rows (`JSON.stringify` equality); the same counterpart in the same campaign picks the **same** variant across calls; and **two different counterparts in the same world are asserted to be capable of drawing different variants** — the anti-vacuity arm, because a pick that always returned index 0 would satisfy stability alone. |
| **C3** | ⭐⭐ **THE ELIGIBILITY CONTROL, IN BOTH DIRECTIONS (§6.3)** | With `{counterpart, band}` the eligible set is **exactly seven**, and variants 2 and 7 are excluded **by index**; with a `{season}` supplied it is **exactly nine**. ⛔ Without the second arm a stuck filter passes. |
| **C4** | ⭐⭐ **THE DARK GOLDEN — DRIVEN, over the RENDERED surface** | The tab is rendered three times over the same settlement and campaign: flag **absent**, flag **`false`**, and flag **lit with no outbound record**. All three outputs are **byte-identical to the B1 capture taken before the first edit**, and identical to each other. ⛔ **This is IN-1b's landed claim and this packet must not move it.** |
| **C5** | ⭐⭐ **THE RENDERED-SURFACE PHRASE SCAN, with its presence pin and its mutant** | Lit, on a real fixture: (a) the rendered text **CONTAINS** the heading and a phrase from the composed line, and its length exceeds a floor — **the presence pin every absence stands on**; (b) that same text, scanned against `MIRROR_PERCEPTION_BANNED` **imported from the leaf and asserted non-empty first**, yields **no** hit — word-split for the four single words, lowercase `includes` for the phrase; (c) **the mutant control:** the identical scanner applied to a string containing a banned word **DOES** flag it. ⛔ Without (a) and (c) this is the recorded second-vacuity class — and it now guards **nine** authored sentences instead of one. |
| **C6** | **Totality, unchanged** | A null/garbage `worldState`, a missing `settlementId`, a non-array `counterpartIds`, `counterpartId === settlementId`, a non-finite `tick` and a missing `nameFor` each answer `[]` **without throwing** — asserted on the post-change composer, because a new call in the loop is a new throw site. |
| **C7** | ⭐ **THE FALLBACK ARM IS DRIVEN, NOT DECLARED** | With the registry stubbed to return `null` for the kind, the composed `line` is **the landed hand-composed sentence, verbatim**, and is non-empty. ⛔ An undriven fallback is the dead-arm class; this is the case that makes §6.6's totality claim real. |

**C8 (a duplicate/idempotent write case) is OMITTED, not replaced** — IN-1c-a writes nothing.
⛔ **Do not add an eighth case or a speculative cross-product.**

### 9b. LIT-OUTPUT POSTURE — declared, not discovered

> ⚠⚠ **THIS PACKET CHANGES THE LIT RENDERED SENTENCE. THAT IS THE DELIVERABLE, AND IT IS SAID HERE
> RATHER THAN DISCOVERED IN A DIFF.** On a world that lights `secondOrderBeliefEnabled` and holds an
> outbound record, each counterpart's standing line becomes one of nine authored sentences instead of
> the single template. **Nothing else moves anywhere** — no ledger, no receipt, no news, no persisted
> byte, no engine path, no component structure.
>
> ⭐⭐ **AND THE SAME-SEED BLAST RADIUS IS ZERO, MACHINE-PINNED.** `secondOrderBeliefEnabled` occurs
> in exactly **five** `src/` locations across **four** files — the manifest key list
> (`simulationRules.js:264`), the one gate (`secondOrderBelief.js:133`), the certification row's
> `rule:` value (`subsystemRowsVirtual.js:308`), and two header comments in `outboundImpression.js`
> (`:27`, `:35`) that a fence arm **requires** to stay — and **none is a default or a preset**.
> ⭐ Comment-stripped this is the exact THREE `namers` FENCE 4 asserts, so the two figures reconcile. The estate already asserts this and this packet inherits the
> assertion rather than re-deriving it: `secondOrderBeliefDormancyFence.test.js:286`, *"the key is
> VIRTUAL: absent from the rules DEFAULTS and every preset"*. **No committed golden can move**, and a
> moving golden is therefore a premise refutation and a STOP, never a re-record.
>
> **In a world that never lights the key, NOTHING MOVES**, held by the three mechanisms IN-1b
> declared and all three untouched here: the gate at the collector; the identity absence rule; the
> render rule. ⭐ **And a fourth, new with this packet: the registry is never reached on a dark path
> at all**, because `mirror === MIRROR_UNKNOWN` short-circuits above it. **C4 DRIVES this.**
>
> ⚠ **Figures permitted to move, each re-recorded whole with the cause stated:** the five
> lighting-census numbers (`2430/366/2064/20123/5655` → `2431/366/2065/20131/5656`); `REGISTRIES`
> 9→10; `REGISTERED_KIND_COUNT` 111→112; the divergence 7→8;
> the runtime denominator **28146→28154**. ⛔ **Everything else moving is a STOP** — including
> `ROUTED_TOKENS` (378), `LEGACY_UNVOICED_TOKENS` (274), the flag manifest (20), `title=` (485), the
> kill list, all four hot files, both TypeScript ratchets, the OSR count, the unlayered baseline
> (179), the argued roster (19), and the frozen known-failure count (16).

---

## 10. Verification commands

```sh
# B1–B3, B12, B14 baselines — the test slot is acquired in the same chain, never observed and released.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/secondOrderBelief.test.js \
  tests/property/secondOrderBeliefDormancyFence.test.js \
  tests/domain/neighbourMirror.test.js \
  tests/ui/neighbourMirrorLine.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/kindPoolFloors.walker.test.js \
  tests/lint/sovereigntyKindPools.walker.test.js \
  tests/lint/grammarLifecycleKindPools.walker.test.js \
  tests/helpers/kindPoolWalker.test.js \
  tests/domain/impactKindWalkers.test.js \
  tests/lint/couplingInclusion.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js \
  tests/domain/subsystemRowsVirtual.test.js \
  tests/domain/subsystemCertificationCorpus.test.js

# ⚠ Long: its beforeAll is sized to 900 s. Run it ALONE, before and after.
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/observedShapeReaders.walker.test.js

# Focused behavior — C1..C7.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/informationKindPools.walker.test.js \
  tests/domain/neighbourMirror.test.js \
  tests/ui/neighbourMirrorLine.test.js \
  tests/lint/kindPoolFloors.walker.test.js

# ⛔ THE §31 ANCHOR PREFLIGHT — BEFORE GREEN IS DECLARED, bare, in-shell, never piped.
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?

# Effective-line receipts on the two new leaves (they must sit far under 800).
npx eslint --rule '{"max-lines":["error",{"max":1,"skipBlankLines":true,"skipComments":true}]}' \
  src/domain/worldPulse/informationNews.js src/domain/worldPulse/informationReceiptPools.js \
  src/domain/display/neighbourMirror.js

npx eslint src/domain/worldPulse/informationNews.js src/domain/worldPulse/informationReceiptPools.js \
  src/domain/display/neighbourMirror.js src/domain/certification/subsystemRowsVirtual.js

npm run typecheck:ratchet          # tsconfig.full.json          — exact floor 173/173
npm run typecheck:domain:strict    # tsconfig.domain-strict.json — exact floor 1134/1134; BOTH new leaves are in scope

# Census re-derivation (§8 item 2), then the landing gate at the terminal.
npm run check:tail                 # BARE, from a fresh shell, with `; echo TRUE_EXIT=$?`
```

⚠ **Never read a gate through a pipe** — a piped read reports the PIPE's status and has greenwashed
red gates twice. **Trust no exit status you did not capture yourself**, and ⚠⚠ **outlast the gate in
your own turn**: a backgrounded ratchet has reported the WRAPPER's exit 0 over a red gate.
⛔⛔ **Never wrap `npm run check*` in `gate-mutex.sh --run`** — `test:ratchet` re-acquires and
self-deadlocks; **exit 3 is the mutex giving up, not a red.**

---

## 11. Ordered coding sequence

0. Run §5 preflight, **including the corpus grep (expect ZERO) and the seven COUNT-NEVER-INHERIT
   figures**. Stop on any mismatch, and on any porcelain entry `git diff HEAD` does not show empty.
1. Capture **B1–B3, B9–B15 — before the first edit.** ⭐ **B1 includes the rendered output of the
   unmodified tab — C4's dark golden, and it cannot be captured afterwards.**
2. **Run the §3.3 layer-map conviction and write the two file names down.** ⛔ If either proposed
   name matches no `LAYER_PATTERNS` arm, **STOP** — the unlayered baseline has zero headroom.
3. Add the smallest failing focused test — **C3, the two-armed eligibility control** — before either
   new module exists.
4. Author `informationReceiptPools.js` (annex-verbatim), then `informationNews.js` (the `hash01`
   pick, the nine-element `requiredSlots`), then `INFORMATION_ANNEX_URL`.
5. Write `tests/lint/informationKindPools.walker.test.js` and make its eight arms green.
   ⛔ **Straight-line registration only. Verify `credited` moves, not just `files`.**
6. Move `kindPoolFloors`' four literals **and its narrative comment**; run it. ⛔ `ROUTED_TOKENS`
   must still read `378`.
7. Wire `neighbourMirror.js` (§6.6). Make **C1, C2, C6, C7** green — **C7 before C1**, so the
   fallback is proved while it is still easy to drive.
8. Make **C4** green against the B1 capture. ⛔ **Stop here if the rendered output moves in any dark
   state** — absent, `false`, or lit-with-no-record.
9. Make **C5** green — presence pin, then scan, then mutant control.
10. Take the `subsystemRowsVirtual.js` and dormancy-fence evidentiary edits (§6.7, §6.8).
11. Run §10's focused checks and every named walker — **especially
    `tests/lint/couplingInclusion.walker.test.js`** (any pair is a STOP) and
    `tests/lint/observedShapeReaders.walker.test.js` (any finding is a STOP).
12. Run the **§31 anchor preflight**. ⛔ Before any green is declared.
13. Re-derive and re-record the lighting census WHOLE (§8 item 2), or STOP per its conditions.
14. Reconcile the three `CREATE` spellings against `git diff --diff-filter=A` **before the flip.**
15. Run the terminal's bare gate and separate boot smoke, and produce the completion receipt: exact
    deltas, both typecheck windows named with their configs, which gate steps actually ran, the
    census row before/after attributed **in isolation against a named committed sha**, all five
    `kindPoolFloors` literals before/after, the OSR finding delta (expected **0**), the coupling
    pair delta (expected **0**), and `deviations: NONE` or a STOP.

⛔ **Do not start by changing a golden, baseline, budget or persisted shape.**

---

## 12. CHAIR RULINGS OWED — CR-IN1C-1..5. **This packet is DRAFT until these are ruled.**

**CR-IN1C-1 — THE SIGNIFICANCE CLASS IS `'routine'`, ANNEX-VERBATIM.** The annex says *"significance:
routine (dossier line)"*. The pool is **nine**, which clears the chronic floor of **eight**
outright, so the row needs **no floor exception at all** and `DECLARED_EXCEPTIONS` stays the
single-entry GR-0 map it is today. **REJECTED:** `'n/a'` on the `treaty_age_line` precedent — it buys
a weaker floor (notable, 6) this corpus does not need, and widening a declared-exception map is a
governance act taken for a reason, not for symmetry.

**CR-IN1C-2 — `{season}` IS NOT SUPPLIED, AND THE TWO UNREACHABLE VARIANTS ARE DECLARED WITH A
TWO-ARMED CONTROL.** Both supply roads cost more than the wave: importing `seasonForTick` from
`worldPulse/worldState.js` is a new display→engine edge to the world-admission module and owes a
separate `smoke:boot`; a fifth local season copy is a fifth spelling of a derivation the estate
already keeps four pinned copies of. ⇒ variants 2 and 7 stay unreachable, **pinned by index in both
directions (C3)**. ⛔ The pool is **not** trimmed and **not** re-authored — that would be an annex
act. **The season supply is queued as its own chair item.**

**CR-IN1C-3 — THE REGISTRY MINTS EXACTLY ONE ROW.** `mirror_shift` and `mirror_confidence_degraded`
stay out: §-1 R1 measures the strength crossing inexpressible and §-1 R2 measures the degradation
producer absent. **A registry row without an honest producer is a chartered orphan**, and GR-5A's
compile already found two of those in this estate. ⛔ **REJECTED:** minting all three rows now "since
the registry is being built anyway" — it would register two kinds whose pools can never render, and
the walker would green over them because a pool's depth is not its reachability.

**CR-IN1C-4 — THE PICK IS `grammarNews.js`'s, AND THE NINE FORKS ARE DOCKETED, NOT REPAIRED.**
`CR-IN1C-DRIFT` records that nine seeded-pick sites across four modules use
`fnv1a32(seed) % length` while the newest family cures the low-bit aliasing hazard by avalanching
before the multiply, and that nothing walks the divergence. ⛔ Repairing them is a cross-family
refactor over landed registries and is a STOP for this member.

**CR-IN1C-5 — THE FALLBACK IS TOTAL AND DRIVEN.** `informationReceipt` returning `null` falls back to
the landed hand-composed sentence rather than to an empty line, and **C7 drives that arm**. A dossier
line that can render blank on a corpus regression is worse than a line with one voice.

---

## 13. Recorded deviations from design prose (each vetoable)

| # | Design says | Live code says | Resolution |
|---|---|---|---|
| **D1** | IN-1c is *"the hums with their kind registry, receipt-pool module, annex URL and interim-desk declaration"* — one wave | the hums' strength arm is **inexpressible** (the collector does not tick-filter plants) and the degradation producer's **arrival tick is discarded** | **Code wins.** Split; this packet is the registry half, and the hums re-file behind three chair rulings — §-1 R1/R2/R3. |
| **D2** | the corpus files these beats at *"the Herald knowledge desk"* | `HERALD_SECTIONS` is the frozen six and `SECTION_OF` **silently falls back to the catch-all** | **Recorded, not repaired.** This packet registers `section: null` and touches routing not at all; the interim declaration is IN-1c-b's, and the fallback's silence is named so it stops being invisible. |
| **D3** | `mirror_standing_line`'s slots are `{counterpart}, {band}, {season}` | the read-model has a tick and no calendar; the estate keeps four deliberate local season copies expressly so display never imports the engine chunk | **Code wins.** CR-IN1C-2: two variants declared unreachable with a two-armed control; the supply is a chair item with a measured boot-smoke cost. |
| **D4** | *(implicit)* one seeded-pick engine | **nine sites in two spellings**, and the newest cures a hazard the other nine carry | **Code wins, and the newest code wins.** Copy the cured spelling; docket `CR-IN1C-DRIFT`. |
| **D5** | the substrate annex places `heraldRouting.js` under `worldPulse/` | it lives at `src/domain/realm/heraldRouting.js` | **Corrected in this packet.** Harmless here (the file is do-not-touch) but a member that greps the wrong path would conclude the desk machinery is absent. |
| **D6** *(promotion-time, TE13)* | §6.5 arm 2 says the walker pins *"the **parsed** `requiredSlots`"* returned by `receiptAnnexPool` against the registry's parallel array | ⛔ **`receiptAnnexPool` returns `requiredSlots: null` for every volume that is not a LEGACY forward.** The declaration is parsed only off `` `requiredSlots: [...]` `` tags, which exist solely on relocated legacy rows; the INFORMATION annex carries none, and `from` will read `'information'`. The arm as written could only ever compare `null` | **Code wins; the WITNESS is preserved and strengthened.** The walker derives each variant's slot set **from the annex text itself** by rendering the pool through the governed reader under a SENTINEL `interp` (each slot filled with a unique marker) and reading back which markers survived — then pins that annex-derived arity table against the registry's `requiredSlots`. That is the same orthogonal witness the arm was for (the corpus, not the registry, decides the arity) and it works on a non-legacy volume. ⛔ The reader is NOT forked and NOT edited. |
| **D7** *(promotion-time, TE13)* | §6.6 replaces `standingSentence` with the registry call, and §2.1 says the sentence source *"moves"* | the landed sentence has TWO parts: the band/staleness clause **and** a conditional standing-silence clause (`' Nothing has left our hand since.'`) that fires on `mirror.sealed`. The corpus authors the first and says nothing about the second; `tests/domain/neighbourMirror.test.js`'s DM-expansion case drives it | **The silence clause is RETAINED as the composer's own suffix**, exactly where it is today. Dropping it would delete a landed player-facing fact the packet never scoped, and re-authoring it into the pool would be an annex act (§I1). ⇒ the composed line is *one governed variant, plus the landed silence clause when sealed* — the same two-part shape as today, with only the first part's source moved. C1 pins pool membership on the UNSEALED row and prefix-membership plus the exact suffix on the sealed one. |
| **D8** *(promotion-time, TE13)* | §6.6 says the three word maps *"stay exported and in use — the staleness word still styles the row"* | ⛔ the mount (`RelationshipsTab.jsx`) renders `l.line` and `l.basis` and **reads neither `l.band` nor `l.staleness`**, so no word map was ever "styling" anything | **The claim is corrected, and the mechanism that keeps the map live is the one the packet already mandates.** `MIRROR_STALENESS_WORDS` and `MIRROR_BAND_WORDS` both stay in production use because CR-IN1C-5's **total fallback keeps `standingSentence` verbatim** as the answer when the registry returns `null`, and `MIRROR_BAND_WORDS` is additionally the source of the `{band}` interp value. ⇒ no map becomes a reader without a writer, and C7 drives the arm that proves it. |

---

## 14. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and IN-PREAMBLE §I11, stop — without expanding or repairing —
when:

- ⛔⛔ **Either new leaf's proposed path matches no `LAYER_PATTERNS` arm** (§3.3). The unlayered
  baseline holds 179 entries against a ceiling of 179 — **zero headroom**. ⛔ Never add a baseline
  line, never add an `ARGUED_UNLAYERED` entry: rename the file, or STOP.
- ⛔ **`couplingInclusion.walker.test.js` measures ANY new cross-layer pair.** Source-repair STOP —
  never a registry row invented at the keyboard.
- ⛔ **`ROUTED_TOKENS` moves off 378**, or `LEGACY_UNVOICED_TOKENS` off 274, or `REGISTRIES` past 10,
  or `REGISTERED_KIND_COUNT` past 112, or the divergence past 8 — **any numeral moving in a direction
  this packet did not predict.**
- ⛔ **`WHAT_PHRASES`, `EXACT_SECTION` or `KIND_SECTION` would need a row.** That means the kind
  acquired a desk, which is IN-5's and IN-1c-b's.
- ⛔ **Any file this packet writes would spell `secondOrderBeliefEnabled`**, anywhere, including a
  comment or a data string. FENCE 4's exact three-file `namers` census reds.
- ⛔ **`secondOrderBelief.js` or `outboundImpression.js` would need ANY edit** — code or header. The
  second's header must keep naming the flag; a fence arm requires it.
- ⛔ **`secondOrderBeliefDormancyFence.test.js:198`'s importer array would gain a second element.**
  That means something imported the leaf, which this packet must not do.
- ⛔ **The corpus grep at §5 returns a nonzero count** for any symbol this packet mints. That is a
  premise refutation — report, do not work around it.
- ⛔ **Any authored variant would be edited, reordered, added, dropped or padded.** A corpus defect
  is a chair annex act; **never pad a pool to clear a floor**.
- ⛔ **The eligible set is not exactly seven without a season and exactly nine with one** (C3). Either
  the arities are wrong or the filter is stuck; both are premise refutations.
- ⛔ **The C4 dark golden moves in ANY dark state** — absent, `false`, or lit-with-no-record. The
  absence rule is not holding, and a flag-state byte difference in a UI is the defect this family
  exists to prevent.
- ⛔ **C5's presence pin cannot be satisfied on a real fixture** — the surface never rendered, so the
  phrase scan is the recorded second-vacuity class.
- ⛔ **C7 cannot be driven** — the fallback arm is unreachable, which makes §6.6's totality claim a
  comment rather than a property.
- ⛔ **A hot file appears in the diff at all** — `OutputContainer.jsx` (599/600),
  `convergence.js` (798/800), `peaceTerms.js` (797/800), `informationStatecraft.js` (780/800). None
  is in this manifest and none may join it.
- ⛔ **`scripts/.observed-shape-readers-baseline.json` would need a row**, or the walker reports a new
  or stale finding. Report; **never `--write`**.
- ⛔ **`scripts/mutation-coverage-manifest.json` would need re-serializing.**
- ⛔ **A committed golden moves**, or `mechanism-lit-coverage-baseline.json` would need a hand edit.
- ⛔ **Any new persisted key, ledger sub-key, writer, stage, flag, tuning key, tab id, Herald kind,
  registry beyond the one, PRNG draw or clock read** becomes necessary.
- ⛔ **A ratchet, baseline, budget, timeout or ceiling would need raising.**
- ⛔ **A foreign lane holds uncommitted test titles at census re-record time**, or the chair has not
  confirmed this packet is the in-flight census holder.
- ⛔ **Any porcelain entry at preflight is NOT explained by `git diff HEAD` being empty** — that is
  real foreign WIP; reserve it, do not work around it.
- **Any packet premise here is refuted by live code. The code wins; the packet stops.**

The STOP report contains the smallest measured contradiction, the evidence, and a proposed split.
It contains **no speculative repair.**

---

## 15. Author posture (read this before trusting a figure)

### 15.0 ⭐ THE PROMOTING LANE'S OWN POSTURE (TE13, at `d5a6c009`)

Everything in §15.1 below is **TC13's**, at **TC13's** base. Lane TE13 promoted and executed this
packet at `d5a6c009` and adds three things rather than restating them:

1. **§-2's re-derivation table is TE13's own execution**, at `d5a6c009`, and it is the authority
   wherever it and §15.1 disagree. Three absolute figures moved; every predicted DELTA held.
2. ⛔ **DECLARED INTERIOR CONDITION AT P1, UNEXPOSED.** This packet's `requiredSymbols` name the two
   symbols it CREATES, on the landed INT-3B precedent, so `validate:packets` reds at the promotion
   commit with **EXACTLY TWO rows** — `IN-1C-A.requiredSymbols[…].path does not exist` for
   `informationNews.js` and `informationReceiptPools.js` — and cures WHOLE at I1. It is structural
   for any promotion whose deliverable is the file it names. **A third row, or a row of another
   kind, is a STOP.**
3. **D6, D7 and D8 in §13 are promotion-time corrections** made from executed reads of live code,
   not re-scopings: each preserves the arm the compile intended and names the mechanism that was
   measured wrong.

### 15.1 The compile lane's posture

**Lane TC13, the compile lane, at `fc8451c4` — read-only throughout; the worktree was not modified,
nothing was staged or committed, and no test, build, gate, lint or typecheck command was run.**
⚠ **Every figure below was read from the HEAD OBJECT rather than the working tree**, because the
tree is shared and an executor may be live in it — so these rows are receipts about the *committed*
base, which is exactly what a packet's verified base means.

- ⭐⭐ **EXECUTED BY THIS LANE (receipts, not projections):**
  the four hot files by eslint's own `Linter` under `max-lines {skipBlankLines, skipComments}` —
  `OutputContainer.jsx` **599**/1054, `convergence.js` **798**/1414, `peaceTerms.js` **797**/1265,
  `informationStatecraft.js` **780**/1502 — **all four EXACT to the capsule**; plus
  `neighbourMirror.js` **79**/188, `secondOrderBelief.js` **139**/300, `receiptAnnex.js` **89**/200,
  `grammarNews.js` **118**/267, `grammarReceiptPools.js` **112**/190, `sovereigntyNews.js`
  **313**/493, `sovereigntyReceiptPools.js` **125**/162, `sovereigntyKindPools.walker.test.js`
  **181**/267, `kindPoolWalker.js` **89**/257, `subsystemRowsVirtual.js` **603**/1102,
  `RelationshipsTab.jsx` **252**/310, `couplingRegistryInfo.js` **37**/150.
  **The validator-topology simulation** (§6 of the train plan) — 45 packets, zero non-terminal, zero
  reserved paths, zero collisions, zero duplicate-path errors at READY/LANDED/DRAFT, and the three
  LANDED CREATE-existence errors reported rather than filtered. **The capsule window audit** —
  `git diff --name-only e93376ec fc8451c4` returns four paths, all under `docs/`. **The unlayered
  baseline** — 179 entries against a ceiling of 179. **The OSR baseline** — 387 files / 1412
  findings, with all four production targets ABSENT from the inventory and `settlementRumors.js`
  present as the scope control. **The test ratchet** — 16 entries against `CEILING = 17`. **The size
  baseline** — 10 entries, none of them a target. **`EXACT_SECTION`** — 378 keys, 378 unique.
  **The corpus grep** — `mirror_shift`, `mirror_confidence_degraded`, `mirror_standing_line`,
  `INFORMATION_ANNEX_URL`, `informationNews`, `informationReceiptPools`, `INFORMATION_KIND_REGISTRY`
  and `RECEIPT_POOLS_INFORMATION` each **ZERO** non-doc files. **The three CREATE targets** — all
  absent. **The nine forked pick sites** — enumerated by file and line.
- **CONFIRMED — measured by executed read against the HEAD object:** the census tuple at `:4224`;
  all five `kindPoolFloors` literals and the `REGISTRIES` list; `HERALD_SECTIONS` and
  `CATCH_ALL_SECTION`; `GRAMMAR_KIND_REGISTRY`'s twelve rows and `grammarKindRow`'s parameter order;
  `treaty_age_line`'s `section: null` row; `grammarReceipt`'s eligibility filter and its documented
  hash cure; `registrationReasons`' five typed joins including the `slot-arity` arity check;
  `FREQUENCY_FLOORS`' arithmetic derivation; `neighbourMirror.js`'s complete composer including
  `standingSentence` and the absence rule's position; `mirrorInputsAt`'s plant/transfer filters
  **verbatim**; `secondOrderMirrorOf`'s use of `arg.tick`; `stalenessBandOf`'s module-privacy; the
  dormancy fence's four fences and its `importers` equality; `wizardNewsAuthoring.walker`'s exact
  per-file site counts; the annex's IN-1 block, its nine variants and its slot convention; the
  mirror certification row's three empty channels and `soakEvidence`.
- **PLAUSIBLE** (reasoned or single-source, **not executed**): every projected line count for a file
  this packet creates; that the two new leaves mint **zero** observed-shape findings (reasoned from
  their absence from the inventory and from `grammarNews.js`/`grammarReceiptPools.js` being absent
  too — **VERIFY-AT-BUILD**); that the new walker registers exactly eight straight-line titles and
  therefore moves runtime by exactly eight (reasoned from `kindPoolFloors` iterating `REGISTRIES`
  with a plain `for` inside one `test()` rather than through `.each` — **the implementer measures
  the real delta and a delta of anything else is a finding to report, not to explain away**); that
  no additional walker fires on a new `src/domain/worldPulse/**` registry beyond those named in §8.
- **NOT RUN by any lane:** no test, build, gate, lint, typecheck or smoke command. **Every row in
  §5b marked UNMEASURED is genuinely unmeasured**, and the rows marked EXECUTED above are the only
  executions in this document.
