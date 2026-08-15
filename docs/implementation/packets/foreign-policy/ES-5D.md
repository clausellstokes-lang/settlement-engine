# `ESPIONAGE / ES-5d` — implementation contract (DRAFT, rev 1)

- **Status:** LANDED
- **Landed:** `954592c0` (2026-08-11) — one packet-level correction (D7: the tick-1 window was provably dead), zero moved goldens, 228 tests green
- **Status note:** promoted by the chair 2026-08-11; §13's nine open items are CLOSED in §13b below.
- **Compiled:** 2026-08-11 by the ES-5d author/recon lane.
- **Verified base:** `claude/composite-r4` at `857e3a1ac6e5580bb1016fb644dab00f77038a34`
- **Base note:** `git status --porcelain` **EMPTY** at compile start (EXECUTED). ES-5c landed at
  `c0447b8f` + `4b0b0fdc`; `857e3a1a` is its ledger record. CR-ES5B-7's just-in-time trigger and
  CR-ES5C-O5's split are both satisfied.
- **Depends on:** `c0447b8f` (ES-5c, LANDED)
- **Collision group:** the npcLadder family (`npcLadderKernel/State/Contest/Challenge`) — the
  ES-5 charter's THIRD named CHECK-GIT-FIRST surface — **plus** the envoy-errand writer family
  (`envoyErrand.js` / `envoyErrandLedger.js` / `envoyErrandRecords.js`), which is the war lane's
  most-recently-edited surface.
- **Commit authority:** none granted by this draft.
- **Packet law:** [`PACKET_STANDARD.md`](../PACKET_STANDARD.md)

---

## 0. THE FOUR MISSING SUBSTRATE CLAIMS, RE-VERIFIED AT `857e3a1a`

CR-ES5C-3 handed ES-5d four claims. This lane re-measured every one against live code rather
than inheriting them. **All four hold.** Two of them are narrower than they read, and the
narrowing is what makes this packet compilable.

| # | Claim (CR-ES5C-3 / §3.1b) | Verdict | Evidence, EXECUTED at `857e3a1a` |
|---|---|---|---|
| 1 | `momentum` is ZERO matches across the whole ladder family | **CONFIRMED** | `grep -rn "momentum" src/domain/worldPulse/npcLadder*.js` → **exit 1, zero matches** across all six family files. `LadderStanding` (`npcLadderKernel.js:118-133`) carries `stock, since, week, goal, stigma, grudges, [bonds], [lastExposed], [wasOusted], [lastLieSeen]`. **Half the design's named target is fictional.** |
| 2 | `maintainMarks` never writes `stock` | **CONFIRMED** | `npcLadderState.js:252-322`. Its terminal record is `nextSt = { ...st, stigma, grudges, lastExposed, wasOusted }` (`:318`), plus optional `bonds` (`:319`) and `lastLieSeen` (`:320`). `stock` passes through the spread untouched; the identifier does not appear in the function. |
| 3 | No `stock` writer accepts external input | **CONFIRMED** | Eight `stock` write sites measured: `npcLadderKernel.js:350`/`:363` (`applyGoalLifecycle`), `:632-633` (decay), `:636` (seed), `:715` (share), `:811`/`:815`/`:824` (orphan decay); `npcLadderContest.js:676` (plan apply); `npcLadderState.js:330` (normalize, a read path). The only one on the maintenance road is `applyGoalLifecycle` (`npcLadderKernel.js:330-364`), whose deposit is `goal.stakes * delta * attributionWeight(...) * GOAL_TUNING.DEPOSIT_SCALE` (`:349`) — **every term ladder-internal.** The three existing external folds terminate elsewhere: `freshLieExposureFor` → `maintainMarks` → stigma; `readRoadsBondEvents` → `mintBond` → bonds (`:653-656`); `readGratitudeBondEvents` → `mintBond` → bonds (`:661-666`). **None lands on `stock`.** |
| 4 | The grade is never persisted; nothing survives the tick boundary | **CONFIRMED, and the trace is one hop longer than §3.1b said** | `freshMissionGradeFor` (`espionageProducts.js:409-417`) docstring: *"Pure, and never persisted."* Its one call site is `landOne` (`espionageProductStage.js:820-824`); `grade` is bound only into `receipt.grade`/`receipt.gradeCapped` (`:843-844`). Trace: `landOne` → `gatherArm:522` / `homeMouthArm:638` → `advanceEspionageProducts:734` → `envoyPulse.js:469` `espionageLandings` → **`pulseKernel.js:2031-2054`, which destructures exactly seven fields off `envoys` (`worldState`, `settlementUpdates`, `wizardNews`, `regionalGraph`, `evidence`, `autoApplied`, `newsEntries`) and never reads `espionageLandings`.** The value is dead output on every production path; the discard is at the pulse mouth, not at `envoyPulse`. |

### 0.1 ⭐ WHAT §3.1b DID **NOT** MEASURE, AND IT CHANGES THE WAVE'S SHAPE

§3.1b measured that the grade's **output** is unpersisted. It did not measure whether the
espionage set already owns a persistence road, an identity closure, or a deposit idiom. All
three exist, and finding them turns "BUILD four things" into "build two and reuse two."

| §3.1b's implied gap | Measured at `857e3a1a` |
|---|---|
| "a carrier … or a widened `COVERT_KEYS` DTO vocabulary" | ⭐ **The espionage set ALREADY writes persisted state through two roads.** (a) `setSpatialLedger(worldState, 'beliefMaps', …)` — `espionageProducts.js:509-511`, the module set's one spatial-ledger write. (b) `writeErrands` — imported at `espionageProductStage.js:106`, routed by `amendCovert` (`:365-373`) to append `covert.gathered`. ⚠⚠ **ES-5c's repaired scan PINS that exactly ONE espionage module may route `writeErrands`, and names it: `tests/domain/espionageProducts.test.js:311-315` asserts `amendersOf(sources)` equals `[espionageProductStage.js]`.** A second amender REDS. |
| "an identity bridge — different spellings; the credit needs a mapping" | **CONFIRMED disjoint, and the mapping is a THREE-HOP composition of parts that all exist.** Ladder nid = `` `${saveId}:${npc.id \|\| stablePart(...)}` `` (`npcAgency.js:193`), always colon-prefixed. Errand `npcId` = `durableId \|\| rosterId` — a `wnpc_<hex8>` FNV1a hash (`npcLedger.js:548-567`, prefix `:87`) or a bare roster id. **Neither ever carries the `${sid}:` prefix, so `errand.npcId === ladderNid` is structurally impossible.** The three hops: `errand.from` → sid (on every errand row, `envoyErrand.js:268`); `rosterPersonById(worldState, sid, settlement, errand.npcId)` → the roster npc object (`envoyCasting.js:178-190`, live at `envoyPulse.js:428`); `npcId(sid, npc, index)` → the nid. ⛔ **No file in `src/` composes hop 2 into hop 3.** That composition is the only genuinely new identity code. |
| "a new STOCK writer on the maintenance road, ladder-owned" | **CONFIRMED absent and genuinely required.** See §0.2. |
| "a coupling row — unless routed through an UNLAYERED module" | **Partly dissolves.** ⭐ Both bridge inputs are UNLAYERED and therefore mint NO pair: `npcAgency.js` (`tests/lint/.coupling-unlayered-baseline.json:92`) and `envoyCasting.js` (matches no `LAYER_PATTERNS` entry). `espionagePresence.js:53` already imports `npcId` from `../npcAgency.js` — the precedent chain exists. **Exactly one new pair is minted**, and it needs its own row (§7). |

### 0.2 THE MAINTENANCE ROAD, MEASURED — and §3.14's description of it is loose, not wrong

**THE MAINTENANCE ROAD IS `advanceLitLadder`'s PASS-1 per-rung loop:
`src/domain/worldPulse/npcLadderKernel.js:624-671`.** In order, for one settlement × faction ×
rung:

| Line | Step | Writes |
|---|---|---|
| `:631-633` | decay an existing standing toward baseline | `stock` |
| `:634-639` | or seed a new rung by structural height | `stock` |
| `:643` | `freshLieExposureFor(worldState, nid, num(st.lastLieSeen, -1), now2)` — **the external deposit read**, gated `lieStigmaLit` (`:425`) | — |
| `:644` | `maintainMarks(st, npcObj, bandMult, weeks, now2, lieExp)` | stigma, grudges, `lastLieSeen` |
| `:647-650` | `applyGoalLifecycle(marks.st, …)` → `npcs[nid] = gl.st` | `stock`, `goal` |
| `:653-656` | `roadsBondEvents.get(...)` → `mintBond` | `bonds` |
| `:661-666` | `gratSidEvents` → `mintBond` | `bonds` |

**The two hoists that matter.** The external deposit Maps are built **once per advance**, above
the settlement loop: `readRoadsBondEvents(worldState, now2)` at `:439` and
`readGratitudeBondEvents(worldState, now2)` at `:444`, then `.get()` per rung. ⭐ **That is the
file's own answer to the hot-path problem, and it is the shape ES-5d must copy** — not
`freshLieExposureFor`'s per-nid call, which is O(1) only because the credibility ledger is
already nid-keyed and an errand ledger is not.

⚠ **§3.14 is loose but not refuted here.** It calls the road "the exact template §3.5 already
uses" and names `freshLieExposureFor`. The template is real; the terminus is not. A credit that
lands on `stock` reaches **no** existing terminus — `maintainMarks` writes marks and `mintBond`
writes bonds — so the wave must add a `stock` terminus. That is deviation **D1**, and it is a
narrowing of §3.14's prose, not a contradiction of it. **Unlike ES-5b and ES-5c, this lane found
no false reach claim in §3.14's credit half beyond the ones ES-5c already recorded and the
design already amended in place (`DESIGN_FP_ARCH_ES.md:1302-1314`).**

### 0.3 ⭐ THE DEPOSIT IDIOM THE WAVE SHOULD COPY, READ AT SOURCE

`readRoadsBondEvents` (`src/domain/roads/thirdPartyRansom.js:332-346`) is the complete pattern,
and it is materially cheaper than the `freshLieExposureFor` template §3.14 names:

```js
export function readRoadsBondEvents(worldState, tick) {
  const ledger = asObject(getSpatialLedger(worldState, 'roadsBondEvents'));
  const oneTickAgo = Math.floor(num(tick, 0)) - 1;
  const out = new Map();
  for (const key of Object.keys(ledger).sort(cmp)) {
    const r = asObject(ledger[key]);
    if (Math.floor(num(r.depositTick, oneTickAgo)) !== oneTickAgo) continue; // stale (dark depositor) ⇒ never re-consume
    …
    out.set(`${homeId}|${captiveNpcKey}`, { … });
  }
  return out;
}
```

Three properties this buys, each measured:
1. **Consume-once WITHOUT a persisted marker on the standing.** The strict `depositTick ===
   tick - 1` window plus the writer's own prune (`thirdPartyRansom.js:371-372`: *"Prior records
   are ALWAYS dropped — the consumer runs [one tick later]"*) means a deposit can fire at most
   once. ⇒ **`normalizeStanding` and `sortedStanding` are NOT touched, and `npcLadderState.js`
   stays out of the manifest.** This is the single decision that keeps the packet inside budget
   (§3.1).
2. **The one-tick lag is structural**, matching the lag `espionagePresence.js:17-31` already
   declares for this consumer class and that ES-5b/ES-5c both inherited.
3. ⚠⚠ **A MECHANICAL CONSTRAINT, quoted from `thirdPartyRansom.js:358-359`:** *"The CALLER
   performs the literal-key `setSpatialLedger`/`dropSpatialLedger` so the ledger-coverage walker
   detects the write."* The deposit write **must spell its ledger key as a string literal at the
   `setSpatialLedger` call site**, never through an imported constant, or
   `tests/lib/spatialLedgerCoverage.walker.test.js` cannot see it.

### 0.4 Verdict

**ES-5d IS COMPILABLE — it is NOT a refuse-forward — under architecture β (§3.1), and it is a
refuse-forward under architecture α.** The difference is one design decision the chair must
ratify (**O1**), and the arithmetic is in §3.1. Under β the packet sits at **2 of 3** modified
production files, **1 of 1** new persisted record families, **1 of 2** direct consumers, and
**1 of 2** new leaves. Under α it needs **4 of 3** modified production files and must split.

⛔ **Three things must be authored by the chair before dispatch** (§13): the credit magnitude
(O2), the grade→credit map (O3), and the ledger's `spatialUsage` classification (O4).

---

## 1. Reconciled authority

1. **Live git at `857e3a1a`** — existence authority.
2. **CR-ES-1 (SIGNED)** — the Roads §1 law 5 amendment. **CR-ES5B-3** puts ES-5b and ES-5c under
   one signature. ⚠ **CR-ES5B-3 says nothing about ES-5d** (it postdates it); this packet claims
   **no** owner gate on the credit itself and records the question as **O6**.
3. **`DESIGN_FP_ARCH_ES.md` §3.14** (:1228-1314), **as amended in place by ES-5c** — the credit
   half at :1240-1255 and the split note at :1302-1314.
4. **`DESIGN_FP_ARCH_ES.md:1549-1553`** — the ES-5d charter sentence, as amended by ES-5c.
5. **CR-ES5C-3, CR-ES5C-5, CR-ES5C-6** — the split, the repaired scan, and the own-row law.
6. **CR-ES5B-6 / CR-ES5C-O4** — an implementer may never author dark tuning; the chair does.
7. **PACKET_STANDARD.md :118-158** — budget, acceptance cap, STOP law.
8. **ES-5c (`ES-5C.md`, LANDED `c0447b8f`)** — the sibling grain's precedents: the
   dependency-inverted INFO leaf, the own coupling row under CPL-20, the §9b declared-shift
   obligation, the standing landing discipline.

**Unreconciled and therefore excluded:** nothing.

---

## 2. Outcome

Under `espionageEnabled` **and** `npcLadderActive`, **a graded espionage mission credits the
operative's ladder standing**: a covert mission that lands at or above the bar it was sent to
clear deposits a credit keyed by the operative's ladder nid, and the ladder's **own** maintenance
road folds it into that NPC's standing `stock` one tick later — through a ladder-owned writer,
in the shape `readRoadsBondEvents`/`mintBond` already use for the two existing external folds.

`freshMissionGradeFor` gets its **first consumer whose output survives the tick.** Written at
ES-3 (`espionageProducts.js:409`), its value is discarded at `pulseKernel.js:2031-2054` today
(EXECUTED, §0 claim 4).

**Declared-degraded when the ladder is dark — the grade stays a receipt.** Ladder dark ⇒ the
deposit is still written (it is espionage's own state) but nothing consumes it, and the grade
continues to ride `receipt.grade` exactly as today. ⚠ **This is an operative choice, not a
reading of the design** — see **O5**; the alternative (skip the deposit when the ladder is dark)
is cheaper but makes espionage read a ladder flag.

Dark worlds — espionage-dark, ladder-dark, or errand-spine-dark — are **byte-identical**. The lit
shift is a **disclosed** one-time ladder-outcome move under ⟨F6⟩, declared in §9b and fenced by
its own golden pair.

**Explicit non-goals:**
- Any **new grade arithmetic.** `freshMissionGradeFor` and `missionGradeFor` are read, never
  edited. `MISSION_GRADES` (`espionageMath.js:115`) is not widened.
- Any **debit.** §3.14's sentence is "success writes … credit." A failed or empty mission
  costing standing is a second behavior nothing asks for (**D3**).
- The **magic early-resolve arm's** separate grading — `landOne` is shared by both worlds
  (`espionageProductStage.js:737-746`), so both arms deposit through the same seam and neither
  gets a second spelling.
- `npcLadderState.js`, `npcLadderContest.js`, `npcLadderChallenge.js`, `npcLadderGoals.js` —
  **zero edits.**
- Any **widening of `COVERT_KEYS`** (§3.1, architecture α is not taken).
- Any **ladder state write by the espionage module set** — ES-5c's repaired scan holds and this
  packet does not approach it.
- Tuning of any `LADDER_TUNING`/`GOAL_TUNING` key beyond the one new constant; any
  receipt/audience surface (ES-7's); the war chooser; `settlementStrategy.js`; `pulseKernel.js`;
  `applyWorldPulse.js`.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

---

## 3. Hard scope budget

### 3.1 ⛔ THE ARCHITECTURE DECISION IS THE BUDGET DECISION — measured both ways

Two carriers are available. **They differ by one modified production file, and the cap is
three.** This is the packet's load-bearing judgment and it is **O1**.

| | **α — the errand-row carrier** | **β — the one-tick deposit ledger** ⭐ |
|---|---|---|
| Where the grade lands | a new key on the covert sub-record | a new spatial-ledger deposit, pruned each tick |
| Carrier precedent | `covert.gathered` (ES-3) | `roadsBondEvents` / `gratitudeBondEvents` (D-5, D-7e) |
| `envoyErrandVocabulary.js` | **MODIFY** (teach `COVERT_KEYS`) | untouched |
| `envoyErrandRecords.js` | **MODIFY** (teach `normalizeCovertMission`) — 685 eff, 115 headroom | untouched |
| `espionageProductStage.js` | MODIFY (stamp via `amendCovert`) | MODIFY (call the deposit writer) |
| `npcLadderKernel.js` | MODIFY (hoist + fold) | MODIFY (hoist + fold) |
| `npcLadderState.js` | **MODIFY** — a persisted consume-once marker must be taught to BOTH `normalizeStanding` (`:326-346`) and `sortedStanding` (`:768-801`), or it evaporates | **untouched** — the strict `depositTick === tick-1` window plus the writer's prune make the fold fire once with no marker |
| **Existing logic-bearing files modified** | **4** ⛔ over the cap of 3 | **2** ✅ |
| New persisted record families | 0 (a field on an existing family) | **1** ✅ at cap |
| Consume-once correctness | robust across a collapsed multi-week advance | ⚠ inherits the roads/gratitude deposits' own exposure (a deposit whose tick is skipped is dropped) |

⇒ **THE LANE RECOMMENDS β**, and records the cost honestly: β's consume-once is a strict
one-tick window, so a **collapsed multi-tick advance drops the credit** where α's persisted
marker would not. That exposure is **already accepted twice by this estate** for the two
structurally identical deposits (`npcLadderKernel.js:437-444`), and it costs a dropped credit,
never a double credit. α's alternative — reusing the already-persisted `st.week` as the marker —
is **REJECTED by this lane**: `st.week` is in CALENDAR WEEKS (`npcLadderKernel.js:418`) while an
errand's `closedTick` is in TICKS (`envoyErrand.js:412-449` writes `homeTick: now` from the pulse
tick), and this volume has already been bitten once by a field whose name lies about its clock
(ES-5c's D4). ⛔ **Do not cross the clocks to save a file.**

### 3.2 This packet against the standard's caps (architecture β)

| Limit | Cap | This packet | Head-room |
|---|---:|---:|---|
| Behavior families | 1 | **1** — "a graded mission credits the operative's ladder standing" | at cap |
| New persisted record families | 1 | **1** — the credit deposit ledger | **at cap** |
| Named writers per changed state | 1 each | **1 each** — the espionage leaf writes the deposit; the ladder's own writer writes `stock` (**O7**) | at cap |
| Feature flags | 1 | **0 new** (rides `espionageEnabled` × `npcLadderEnabled`) | — |
| User-facing surfaces | 1 | **0** | — |
| Direct production consumers | 2 | **1** — `npcLadderKernel.js` | 1 |
| New logic-bearing leaves | 2 | **1** — `espionageCareerCredit.js` | 1 |
| Existing logic-bearing files modified | 3 | **2** — `espionageProductStage.js`, `npcLadderKernel.js` | 1 |
| Registration-only files touched | 3 | **2** — `couplingRegistryEspionage.js`, `src/lib/spatialUsage.js` | 1 |
| Handwritten files | 12 | **8** (leaf + 2 modified + 2 registration + 2 new tests + 1 edited test) | 4 |
| New/changed effective production lines | 400 | **≈ 175** (leaf ≤ 120 · 15 · 15 · registry ≈ 20 · usage ≈ 5) | ~225 |
| New leaf effective lines | 250 | **≤ 120** (the charter's career-leaf budget, §3.14/:1572) | 130 |
| Shared/hot-file delta | 15 each | **≤ 15** `npcLadderKernel.js` · **≤ 15** `espionageProductStage.js` | at cap |
| Acceptance cases | 8 | **8** | **at cap** |

⇒ **NO FURTHER SPLIT IS REQUIRED under β.** ⚠ The packet sits **at** the new-persisted-record cap
and at both hot-file deltas. Anything that would add a second persisted family, a third modified
production file, or a second direct consumer is a **re-slice, never a renegotiated cap** (STOP 8).

⚠ **One new tuning constant is minted, and it is a LADDER constant.** It lands in
`LADDER_TUNING` (`npcLadderState.js:44`) — ⛔ **which would make `npcLadderState.js` a third
modified file.** See **O2**: the lane recommends the constant live in the **new leaf's own frozen
export** and be consumed by the ladder, exactly as `CHALLENGE_TUNING` consumers do, OR that the
chair spend the third modified-file slot on `npcLadderState.js`. **This is unresolved and it is
the one place the budget could still tip.**

### 3.3 Measured effective line counts (EXECUTED at `857e3a1a`)

```sh
npx eslint <files> --rule '{"max-lines":["error",{"max":1,"skipBlankLines":true,"skipComments":true}]}' --format json
```
⚠ Run it **without** a pipe when reading its status. eslint's own exit under this rule is **1** by
construction (every file exceeds `max:1`); the COUNT is in the message text, and that is the
figure. This lane captured `TRUE_ESLINT_EXIT=1` directly.

| File | Effective | Ceiling | Headroom | Δ this packet | After |
|---|---:|---:|---:|---:|---:|
| `npcLadderKernel.js` | **577** | 800 (domain default) | **223** | ≤ 15 | ≤ 592 |
| `espionageProductStage.js` | **540** | 800 | **260** | ≤ 15 | ≤ 555 |
| `espionageCareerCredit.js` (NEW) | 0 | 800 | — | ≤ 120 | ≤ 120 |
| `couplingRegistryEspionage.js` | **165** | 800 | 635 | ≤ 20 | ≤ 185 |
| `src/lib/spatialUsage.js` | **176** | (src/lib default) | ample | ≤ 5 | ≤ 181 |
| `npcLadderState.js` | **604** | 800 | 196 | **0** (β) | 604 |
| `npcLadderChallenge.js` | **181** | 800 | 619 | **0** | 181 |
| `npcLadderContest.js` | **531** | 800 | 269 | **0** | 531 |
| `espionageCareer.js` | **30** | 800 | 770 | **0** | 30 |
| `espionageProducts.js` | **266** | 800 | 534 | **0** | 266 |
| `espionageGauntlet.js` | **298** | 800 | 502 | **0** | 298 |
| `espionageMath.js` | **163** | 800 | 637 | **0** | 163 |
| `envoyErrandRecords.js` | **685** | 800 | **115** ⚠ | **0** (β) / ≤ 10 (α) | 685 |
| `envoyPulse.js` | **305** | 800 | 495 | **0** | 305 |
| `envoyCasting.js` | **92** | 800 | 708 | **0** | 92 |
| `npcCredibility.js` | **133** | 800 | 667 | **0** | 133 |
| `npcAgency.js` | **833** | **833 EXACT** (`scripts/.size-baseline.json:10`) | **0** ⛔ | **0** | 833 |

**`scripts/.size-baseline.json` carries NO entry for any ladder, espionage, envoy, or
certification file** (EXECUTED — the only match among these families is `npcAgency.js: 833`).
Every other file above rides the 800-line domain default (`eslint.config.js`, `files:
['src/domain/**/*.js']`).
⛔ `npcAgency.js` sits at an **EXACT** baseline of 833 with **zero** headroom; this packet does
not touch it, and any edit there is STOP 6.

⭐ `npcLadderChallenge.js` measured **181**, exactly ES-5c's projected `172 + 9`. The projection
held; the file is not near any limit.

---

## 4. Sealed dispatch and preflight

```sh
cd /Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold
git rev-parse --abbrev-ref HEAD                 # expect claude/composite-r4
git rev-parse HEAD                              # expect 857e3a1a… or a pinned descendant
git merge-base --is-ancestor 857e3a1ac6e5580bb1016fb644dab00f77038a34 HEAD; echo $?   # expect 0
git status --porcelain                          # every target file MUST be clean
git log --oneline -3 -- src/domain/worldPulse/npcLadderKernel.js \
  src/domain/worldPulse/npcLadderState.js src/domain/worldPulse/npcLadderChallenge.js \
  src/domain/worldPulse/npcLadderContest.js \
  src/domain/worldPulse/espionage/espionageProductStage.js \
  src/domain/worldPulse/envoyErrandLedger.js    # CHECK-GIT-FIRST, per the ES-5 charter
```

**CHECK-GIT-FIRST result at compile time (EXECUTED, `857e3a1a`):** the espionage family's newest
commits are `c0447b8f` + `4b0b0fdc` (ES-5c itself); `857e3a1a` is its ledger record and touches
docs only. **No collision.** Re-run at dispatch; a commit newer than `c0447b8f` on any espionage
file, or newer than ES-5c's own reading on any ladder file, is STOP 3.

**⚠ FOREIGN WORK RESERVED — do not touch, stage, restore, or attribute.** `git status
--porcelain` was **empty** at this compile, but a second lane is live in this tree on the OSR
instrument (`scripts/check-observed-shape-readers.mjs`, `scripts/lib/*`,
`scripts/.observed-shape-readers-baseline.json`, `tests/lint/observedShape*`). **Those four paths
are RESERVED.** Treat any dirty or untracked path at dispatch as foreign unless it is in §8's
manifest.

Required live symbols (verify each before editing; **navigate by symbol, never by the line
numbers quoted here** — this volume has had two address rots):

| Symbol | Home |
|---|---|
| `freshMissionGradeFor` | `src/domain/worldPulse/espionage/espionageProducts.js:409` |
| `landOne` (the shared grading site) | `src/domain/worldPulse/espionage/espionageProductStage.js:747` (grade at `:820`) |
| `advanceEspionageProducts` (`npcFor` param) | `src/domain/worldPulse/espionage/espionageProductStage.js:654,667,719` |
| `MISSION_GRADES` (frozen totality) | `src/domain/worldPulse/espionage/espionageMath.js:115` |
| `missionGradeFor` | `src/domain/worldPulse/espionage/espionageMath.js:421` |
| `espionageActive` | `src/domain/worldPulse/espionage/espionageGate.js:75` |
| `npcId` | `src/domain/worldPulse/npcAgency.js:193` |
| `rosterPersonById` | `src/domain/worldPulse/envoyCasting.js:178` |
| `errand.from` (the sid) | minted `src/domain/worldPulse/envoyErrand.js:268` |
| `advanceLitLadder` PASS-1 rung loop | `src/domain/worldPulse/npcLadderKernel.js:624-671` |
| the deposit-Map hoists to copy | `src/domain/worldPulse/npcLadderKernel.js:439`, `:444` |
| `applyGoalLifecycle` (the road's existing `stock` writer) | `src/domain/worldPulse/npcLadderKernel.js:330-364` |
| `npcLadderActive` | `src/domain/worldPulse/npcLadderKernel.js:191` |
| `readRoadsBondEvents` (the idiom) | `src/domain/roads/thirdPartyRansom.js:332` |
| `setSpatialLedger` / `dropSpatialLedger` | `src/domain/spatial/distanceRead.js` |
| `TRACKED_LEDGER_KEYS` / `EXEMPT_LEDGER_KEYS` | `src/lib/spatialUsage.js:227` / `:282` |
| ES-5c's repaired ladder-writer scan + the `amendersOf` pin | `tests/domain/espionageProducts.test.js:264-320` (`amendersOf` at `:311-315`) |
| `LADDER_TUNING` | `src/domain/worldPulse/npcLadderState.js:44` |
| `round4` | `src/domain/worldPulse/espionage/espionageMath.js:88` |
| `clamp` / `clamp01` | `src/kernel/math.js` |

---

## 5. Verified tree contract

- **State authority — TWO states change, and each gets exactly one writer.**
  1. **The credit deposit** — a new `worldState.spatialLedgers.<creditKey>` record family.
     **Sole writer: the new leaf's deposit function**, called once per pulse from
     `advanceEspionageProducts`. ⛔ Nothing else writes or prunes it.
  2. **Ladder standing `stock`** — `worldState.spatialLedgers.npcLadder[sid].npcs[nid].stock`.
     **Sole writer family: the ladder's own** (`npcLadderKernel.js`), unchanged in ownership.
     ⛔ **The espionage module set writes NO ladder state** — ES-5c's repaired scan
     (`tests/domain/espionageProducts.test.js:280-307`) now actually polices this: it matches
     `(set|drop)SpatialLedger(… 'npcLadder'` and direct `spatialLedgers.npcLadder =` slot
     mutation, comment-stripped, with four plants. **The new leaf lives in
     `src/domain/worldPulse/espionage/`, so `espionageSources()` picks it up automatically and it
     is scanned from the moment it lands.**
- ⚠⚠ **ES-5c's OTHER pin binds this wave and is easy to trip.**
  `tests/domain/espionageProducts.test.js:311-315` asserts that **exactly one** espionage module
  routes `writeErrands`, and names `espionageProductStage.js`. ⛔ **If the implementer drifts to
  architecture α and has the new leaf call `writeErrands`, that pin REDS. That is STOP 5, not a
  pin edit.**
- ⚠ **The whereabouts/deposit ONE-TICK LAG is inherited and stays uniform.** The deposit is
  written during the espionage product pass; the ladder runs LAST over the fully-settled tick
  (`npcLadderKernel.js:61-65`) but consumes deposits written **one tick earlier**
  (`depositTick === tick - 1`), matching `readRoadsBondEvents` and the lag
  `espionagePresence.js:17-31` declares by name for this consumer class. Reordering the pulse is
  forbidden (L1). Restate it in the leaf's header and pin it (case A5).
  ⛔ **CORRECTED IN EXECUTION — DEVIATION D7, landed `954592c0`; RATIFIED by chair ruling H32,
  2026-08-11.** This bullet is left as written because it is the record of what was specified;
  **it is not what shipped, and a successor must not build to it.** The one-tick lag above is
  MEASURABLY WRONG FOR THIS PAIR. `simulateCampaignWorldPulse` calls the espionage product pass
  (`pulseKernel.js:2031`) and the ladder chain (`:2563`) unconditionally, in that order, in ONE
  function body, both handed `tick: worldState.tick` — **so the depositor runs EARLIER IN THE SAME
  PULSE than the consumer.** A `tick - 1` window would prune tick T−1's records before the ladder
  at T ever looked, **making the fold never fire on any world while every unit pin around it
  stayed green.** The packet transferred its lag claim from `espionagePresence.js`, a DIFFERENT
  writer/reader pair whose one-tick lag is real only because ROADS runs LAST, strictly after the
  ladder. **⚠⚠ THE STANDING LESSON: a lag belongs to a WRITER/READER PAIR and must be re-derived
  from pulse CALL ORDER, never inherited.** What shipped is the same-tick handoff on the
  `readGratitudeBondEvents` template, with the pulse call ORDER pinned at source so a future
  reorder reds loudly rather than silently killing the feature.
- **Direct readers this packet adds:** `advanceLitLadder` (`npcLadderKernel.js`). **One.**
- **Absence rule:** espionage dark / ladder dark / errand spine dark / no graded mission this
  tick / an operative whose roster npc cannot be resolved / a grade outside the credited set ⇒
  the credit is exactly **`0`** and `stock` is **byte-identical**. **Never `NaN`, never
  `undefined`, never a negative delta** (a debit is a non-goal, D3).
- ⚠ **The identity bridge has one failure mode that must be DECLARED, not silent.**
  `npcId(sid, npc, index)` falls back to `stablePart(npc.name || npc.label || \`npc_${index}\`)`
  when `npc.id` is absent. `rosterPersonById` returns the npc **object**, not its index. ⇒ the
  deposit writer must recover the index from the home settlement's roster
  (`homeItem.settlement.npcs`), or **declare the credit absent for an id-less operative with a
  reason on the receipt** (the SP-C degraded-arm idiom). ⛔ **Silently keying an id-less
  operative under a wrong nid would credit the wrong NPC — the worst available failure.**
  Open item **O8**.
- **Persistence / regen / undo / migrate — THE FULL TRACE.** See §5b; this packet writes state,
  so the trace is mandatory and every path below must be answered before the first edit.
- **Receipts:** none minted. `receipt.grade` and `receipt.gradeCapped` already exist
  (`espionageProductStage.js:843-844`) and are unchanged. The Herald voice is ES-7's.
- **Test shapes to copy:** `tests/property/espionageCareerDormancy.test.js` (ES-5c's four-fence
  dormancy idiom + the declared-shift golden pair); `tests/domain/espionageCareer.test.js`
  (ES-5c's leaf pins and its derive-don't-restate producer pin);
  `tests/domain/espionageMission.test.js:363-374` (the unknown-key tripwire shape, if α is ever
  revisited); the `roadsBondEvents` deposit/consume round-trip pins.
- **Forbidden homes:** `npcLadderState.js`, `npcLadderContest.js`, `npcLadderChallenge.js`,
  `npcLadderGoals.js`; `npcAgency.js` (**EXACT 833 baseline, zero headroom**);
  `envoyErrand.js`/`envoyErrandLedger.js`/`envoyErrandRecords.js`/`envoyErrandVocabulary.js`
  (β does not touch the errand writer family at all); `pulseKernel.js`, `applyWorldPulse.js`
  (L1, banked); `settlementStrategy.js` (IN-4's no-EDIT law); `roadsKernel.js`; `roads/state.js`.
  ⛔ **RESERVED BY A CONCURRENT LANE:** `scripts/check-observed-shape-readers.mjs`,
  `scripts/lib/*`, `scripts/.observed-shape-readers-baseline.json`, `tests/lint/observedShape*`.

### 5b. THE STATE LIFECYCLE TRACE — mandatory, because this wave BUILDS state

**State 1 — the credit deposit ledger (`spatialLedgers.<creditKey>`).**

| Path | What must happen | Measured basis |
|---|---|---|
| **create** | Written once per pulse by the leaf's deposit function, called from `advanceEspionageProducts` after `landOne` returns. Key = the ladder nid; value = `{ depositTick, grade }` (or `{ depositTick, credit }` — **O3**). ⛔ The `setSpatialLedger` call must spell the ledger key as a **string literal at the call site** (`thirdPartyRansom.js:358-359`). | `espionageProducts.js:509-511` is the family's existing literal-key write |
| **read** | `readMissionCreditEvents(worldState, tick)` → `Map<nid, {...}>`, filtering `depositTick === tick - 1`, codepoint-sorted iteration. Hoisted ONCE per advance beside `npcLadderKernel.js:439`/`:444`, never called per rung. ⛔ **CORRECTED IN EXECUTION — D7, landed `954592c0`; RATIFIED by chair ruling H32, 2026-08-11: the shipped filter is the SAME-TICK strict equality `if (Math.floor(Number(row.depositTick)) !== now) continue;`, NOT `tick - 1`.** The depositor runs earlier in the SAME pulse, so a `tick - 1` window would never fire. The hoist is real and structurally adjacent as specified — `npcLadderKernel.js` hoists `readRoadsBondEvents`, `readGratitudeBondEvents` and `readMissionCreditEvents` in one block — but the TEMPLATE is the `gratitudeBondEvents` twin ("generosity ran earlier THIS tick"), not the roads one. | `thirdPartyRansom.js:332-346` |
| **persist** | `setSpatialLedger` writes into `worldState.spatialLedgers`; sorted keys, **drop-when-empty** so a dark world mints **no key at all** and dormancy goldens do not move. | `thirdPartyRansom.js:363-369` `diffLedger` |
| **prune** | ⛔ **MANDATORY AND EASY TO FORGET.** Prior records are dropped every pulse — the deposit lives exactly one tick. Without the prune the ledger grows without bound AND the strict-window read silently keeps working, so the bug is invisible until a save bloats. **Pin it (case A6).** | `thirdPartyRansom.js:371-372` |
| **regenerate** | A world regen re-derives settlements; the deposit is per-tick and is not re-derived. ⚠ **AUTHOR-TIME-UNMEASURED:** the implementer must confirm that a regen does not resurrect a stale deposit, by running the regen path with a deposit present and asserting the credit does not double-fire. |  |
| **undo** | ⚠ **AUTHOR-TIME-UNMEASURED.** If undo snapshots `worldState.spatialLedgers`, an undo across the consume boundary could re-present a consumed deposit. The strict `depositTick === tick - 1` window makes this safe **only if the tick also rewinds**. The implementer measures it and states the answer. ⛔ **CORRECTED IN EXECUTION — D7, landed `954592c0`; RATIFIED by chair ruling H32, 2026-08-11: the shipped window is SAME-TICK, not `tick - 1`.** The safety argument is unchanged in shape and still binds on the same condition (it holds only if the tick rewinds with the ledger), but it must be re-read against same-tick equality. **Consume-once does NOT come from the lag** — it comes from the deposit pass replacing the whole record set every pulse (prune-by-construction, drop-when-empty), so the correction does not weaken it. |  |
| **migrate** | A legacy save carries no key ⇒ `asObject(undefined)` ⇒ `{}` ⇒ an empty Map ⇒ zero credits. Additive-optional by construction. | `readRoadsBondEvents` reads through `asObject` |
| **classify** | ⛔ `tests/lib/spatialLedgerCoverage.walker.test.js` **REDS on any `setSpatialLedger` key not classified** in `src/lib/spatialUsage.js`. This is a DEPOSIT that persists across a tick boundary ⇒ **TRACKED** by the recorded axis. ⚠⚠ **A TRACKED row FAILS OPEN** — adding the key to `TRACKED_LEDGER_KEYS` alone greens the walker while emitting zero telemetry, so it **must** ship with a behavioral pin driving the extractor, run as two mutants (drop the `counts` entry; drop the `MOVER_PRESENCE` row) — both must red. ⚠ Never import the key constant into `spatialUsage.js` (it drags `distanceRead.js` onto first paint); use the bare string literal as all ~37 other entries do. | `spatialUsage.js:171`, `:227`, `:282` |

**State 2 — ladder standing `stock`.**

| Path | What must happen | Measured basis |
|---|---|---|
| **create / read / persist / regenerate / undo / migrate** | **UNCHANGED.** `stock` already exists on `LadderStanding` (`npcLadderKernel.js:121`), is already normalized (`npcLadderState.js:330`), already serialized (`npcLadderState.js:770`), already mirrored (`:901`), and already decays (`:219-224`). ⭐ **The credit adds a delta to an existing persisted field and mints NO new field**, which is exactly why architecture β touches neither key list. | EXECUTED reads of both key lists |
| **the one new lifecycle question** | The credit must be applied **after** the decay/seed (`:631-639`) and **before or inside** the `stock`-writing step, and it must be `clamp`ed to `[0, STAND_MAX]` and `round4`ed, or a byte-instability enters the persisted record. | `npcLadderKernel.js:350`, `:363` |

⛔ **NO NEW PERSISTED FIELD IS ADDED TO `LadderStanding` UNDER β.** If the implementer finds
themselves editing `normalizeStanding` or `sortedStanding`, they have drifted to architecture α
and that is **STOP 8**.

---

## 6. Exact contracts

### 6.1 The leaf's surface

`src/domain/worldPulse/espionage/espionageCareerCredit.js` exports exactly three symbols:

```
CAREER_CREDIT_TUNING                              (frozen; the one new constant — O2)
depositMissionCredits({ worldState, tick, landings, npcFor, byId }) → { worldState, changed }
readMissionCreditEvents(worldState, tick) → Map<nid, { grade: string, credit: number }>
```

**`depositMissionCredits`** — the deposit writer, dependency-inverted so the leaf never reaches
into the ladder:
1. `if (espionageActive(worldState) !== true) return { worldState, changed: false };` — the
   byte-identical dark path, one flag read.
2. For each landing whose `grade` is in the credited set (**O3**): resolve
   `sid = String(landing.observerId)` (the row's `homeId`, already `text(errand.from)` at
   `espionageProductStage.js:708`), resolve the roster npc through the caller-supplied
   `npcFor(errand)` closure (**already a parameter at `:654`/`:667`/`:719` — no new import**),
   and mint `nid = npcId(sid, npc, index)`.
3. Write `{ [nid]: { depositTick: tick, grade } }` through **one literal-key**
   `setSpatialLedger(worldState, '<creditKey>', next)`; drop the key entirely when the record set
   is empty (`dropSpatialLedger`), so a dark or credit-free tick mints no key.

**`readMissionCreditEvents`** — the pure consumer read, `readRoadsBondEvents` verbatim in shape:
codepoint-sorted key iteration, `depositTick === tick - 1` or skip, returns a `Map` keyed by nid.
Returns an **empty Map** when the ledger is absent.

⛔ **CORRECTED IN EXECUTION — DEVIATION D7, landed `954592c0`; RATIFIED by chair ruling H32,
2026-08-11.** The specified `depositTick === tick - 1` filter is **provably dead for this pair** and
was NOT built. What shipped is the SAME-TICK strict equality — `if (Math.floor(Number(row.depositTick))
!== now) continue;` — and the shape template is **`readGratitudeBondEvents`, not
`readRoadsBondEvents`.** The two idioms are identical except for the window, and the window is the
whole question: the depositor runs earlier in the SAME pulse body, so a one-tick read would prune
before the consumer ever looked. The sentence above is preserved as the record of what was specified.



⛔ The leaf must **never** import `npcLadderChallenge.js`, `npcLadderKernel.js`, or any
`npcLadder*` file — that closes the loop and drags the whole family (the `barrel-hop` hazard).
⛔ The leaf must **never** call `writeErrands` (§5, the `amendersOf` pin).

### 6.2 The `npcLadderKernel` composition — THE REACH

⭐ Written against live code read at `857e3a1a`, not transcribed from the design.

```js
// (1) new import — INFO leaf, INTERIOR importer: a REAL cross-layer pair, licensed (§7)
import { readMissionCreditEvents } from './espionage/espionageCareerCredit.js';

// (2) inside advanceLitLadder, BESIDE the two existing deposit hoists (:439, :444) —
//     ONCE per advance, never per rung:
const missionCredits = readMissionCreditEvents(worldState, now2);

// (3) inside the PASS-1 rung loop, AFTER applyGoalLifecycle writes npcs[nid] (:650)
//     and in the same shape as the two mintBond folds below it (:653, :661):
if (missionCredits.size) {
  const mc = missionCredits.get(nid);
  if (mc) npcs[nid] = applyMissionCredit(npcs[nid], mc);   // the ladder's OWN writer
}
```

`applyMissionCredit(st, mc)` is a **module-private ladder function** in `npcLadderKernel.js`, the
direct sibling of `applyGoalLifecycle` (`:330`): `{ ...st, stock: round4(clamp(st.stock +
mc.credit, 0, LADDER_TUNING.STAND_MAX)) }`. **≤ 15 effective added lines** across both sites.

⭐ **WHY THE FOLD SITS AFTER `applyGoalLifecycle` AND NOT INSIDE IT — the load-bearing
judgment.** `applyGoalLifecycle` is the GOAL lifecycle; its deposit is the goal's own
attribution-weighted progress. Folding an unrelated external credit into it would give one
function two reasons to change `stock` and would put an espionage term inside the goal's
receipt. Placing it beside the two existing external folds (`mintBond` at `:653` and `:661`)
matches the file's own layering: **internal derivation first, external deposits after.** Recorded
so the chair can veto in one clause (**O9**).

⚠ **The gate is the caller's, and it is already there.** `advanceNpcLadder` early-returns when
`npcLadderActive(worldState) !== true` (`:392-394`), so the ladder-dark arm is byte-identical
with no new flag read. The leaf reads only the espionage flag. **Both flags are read `=== true`,
strictly, so absent and false are identical.**

### 6.3 The credited set and the credit magnitude — AUTHOR-TIME-UNSET

**Home: the new leaf's own frozen `CAREER_CREDIT_TUNING`, NOT `LADDER_TUNING` and NOT
`ESPIONAGE_TUNING`** — because `LADDER_TUNING` lives in `npcLadderState.js`, and touching it
would spend the third modified-file slot for one constant (**O2**). ⚠ This is the **opposite**
trade from ES-5c's D6, which put `DEFENSE_WHEN_ABSENT` in `CHALLENGE_TUNING` precisely because
that file was already in its manifest. Here it is not, and the trade flips.

**Value: AUTHOR-TIME-UNSET — this lane does not author it (O2), per CR-ES5B-6 / CR-ES5C-O4.**
The parity evidence this lane measured, for the chair's use, all EXECUTED:

- `LADDER_TUNING.STAND_MAX: 10`, `STAND_BASELINE: 3.0`, `SEED_SPREAD: 3.0`
  (`npcLadderState.js:45-48`). **`SEED_SPREAD` is the entire structural head start between the
  floor rung and the top rung** — the whole ladder's height in stock units.
- `LADDER_TUNING.STAND_HALF_LIFE_WEEKS: 156` (`npcLadderState.js:50`) — ~3 years. Any credit decays away on this
  clock; §8d's "old glory fades" applies to a spy's career exactly as to a courtier's.
- `GOAL_TUNING.DEPOSIT_SCALE: 1.5` (`npcLadderGoals.js:45`) — the scale on the ladder's own
  event-driven deposit, which is `stakes × progressDelta × attributionWeight × 1.5`.
- ⚠ The espionage `*_W` family's `0.5` parity does **not** transfer (the same warning ES-5c's
  §6.3 carried): those are weights inside a 0..1 espionage ratio; this is an **additive delta on
  a 0..10 ladder stock**.

⇒ **The lane's recommendation, with its argument, for the chair to author or reject:** a credit
in `SEED_SPREAD`'s units and materially **below** it — a single good mission is not a rung. A
`met` credit at a small fraction of `SEED_SPREAD`, with `exceeded` at twice that and `partial`
and `empty` at exactly zero, keeps a career built on espionage a matter of **sustained** work
against a 156-week half-life rather than one lucky week. ⛔ **The implementer may not tune it,
and this lane deliberately does not name the number.**

### 6.4 Bounds, rounding, order

`clamp` to `[0, STAND_MAX]` then `round4`, matching `applyGoalLifecycle`'s own idiom
(`npcLadderKernel.js:350`, `:363`). Ledger key iteration is codepoint-sorted on both sides
(`compareCodepoint`), so the deposit's write order and the read's Map order are byte-stable.
Per-rung application is order-independent (one credit per nid, at most).

### 6.5 Flag and dormancy

Gated `espionageActive(worldState) === true` **and** `npcLadderActive(worldState) === true`, both
BY NAME. **Triple dormancy, all arms measured:** espionage dark ⇒ `depositMissionCredits` returns
on one flag read, no key minted, no credit; ladder dark ⇒ `advanceNpcLadder` no-ops at `:392`
before PASS 1 runs; errand-spine dark ⇒ no covert errands ⇒ no landings ⇒ no deposit.
⭐ **Drop-when-empty is what makes dark byte-identical**: a dark or credit-free tick must mint
**no ledger key at all**, or every dormancy golden moves.

### 6.6 Alignment and edit story

Req 13: declared-empty for this slice (the engagement is ES-5a's, landed).
Req 14: **engine-only** — the one player/DM verb is ES-7's.

---

## 7. THE COUPLING TRAP — CW-0w (⚠ this has bitten SIX times; ES-5d is the eighth crossing, and
## it is TAKEN rather than avoided)

**Measured layer homes** (`tests/lint/couplingInclusion.walker.test.js`, EXECUTED):

| Module | Layer | Evidence |
|---|---|---|
| `src/domain/worldPulse/espionage/**` | **INFO** | walker `:143`, a DIRECTORY pattern — the new leaf is claimed the day it lands |
| `npcLadderKernel.js` | **INTERIOR** | walker `:179`, `/^src\/domain\/worldPulse\/(?:faction\|…\|npcLadder\|seatBooks)/` |
| `npcAgency.js` | **UNLAYERED** | matches no pattern; `tests/lint/.coupling-unlayered-baseline.json:92` |
| `envoyCasting.js` | **UNLAYERED** | matches no pattern |
| `src/domain/spatial/distanceRead.js` | **UNLAYERED** | `.coupling-unlayered-baseline.json:5` |
| `src/domain/roads/**` , `src/kernel/**` , `src/lib/**` | out of census scope | `CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse\|spatial)\//` (`:458`) |

**THE DECISIVE LAW, READ AT SOURCE.** `couplingInclusion.walker.test.js:807` —
`test('a NEW cross-layer import is either licensed by a registry row or REDS')`. Its body filters
`LIVE_PAIRS` by `!BASELINE_KEYS.has(…)`, then `!OWED_KEYS.has(…)`, then
**`licensingRows(pair).length === 0`**. `licensingRows` (`:664-671`) joins a row to a pair when
`row.direction === pair.direction` **and** (`moduleOf(row.read) === pair.importer` **or**
`moduleOf(row.counterforce) === pair.importer`).

⇒ **Chains for every import this packet mandates:**

1. **`npcLadderKernel.js` → `espionageCareerCredit.js`. A REAL PAIR, and it is TAKEN.**
   INTERIOR importer, INFO dependency ⇒ direction **`INFO→INTERIOR`**, minting the live key
   `src/domain/worldPulse/npcLadderKernel.js|src/domain/worldPulse/espionage/espionageCareerCredit.js|INFO→INTERIOR`.
   ⚠⚠ **ES-5c's `ES5C_CAREER_LADDER_COUPLING` does NOT license it.** That row's `read` is
   `src/domain/worldPulse/npcLadderChallenge.js#defenseScore` and its `counterforce` is
   `…/espionageGauntlet.js#gatherOrGovernRead`; the join is on the **importer module**, and
   `npcLadderKernel.js` is neither. **A different importer needs its own row** — the row's own
   docstring says so in as many words (`couplingRegistryEspionage.js:418-422`).
   **Licensed by the new CPL-20 row at manifest item 4**, whose `read` address is
   `src/domain/worldPulse/npcLadderKernel.js#advanceNpcLadder` and whose `direction` is
   `INFO→INTERIOR`. **Nothing is baselined.**
   ⭐ Measured: `npcLadderKernel.js` holds **ZERO** espionage references at `857e3a1a`
   (EXECUTED — the only ladder→espionage import in the repo is `npcLadderChallenge.js:28`, ES-5c's).
2. **`espionageCareerCredit.js` → `npcAgency.js` (`npcId`) and → `envoyCasting.js`
   (`rosterPersonById`, if imported rather than injected).** Both UNLAYERED ⇒
   `if (!depLayer) continue` fires ⇒ **no pair is minted** either way. Precedent chain already
   exists: `espionagePresence.js:53` imports `npcId` from `../npcAgency.js` (ES-5b), and
   `envoyPulse.js:428` already calls `rosterPersonById`.
   ⭐ **PREFER INJECTION OVER IMPORT for `rosterPersonById`**: `advanceEspionageProducts` already
   receives `npcFor` as a closure parameter (`espionageProductStage.js:654`, `:667`, `:719`), so
   the roster npc arrives without any new edge at all. **Dependency inversion first, per the cure
   order.**
3. **`espionageCareerCredit.js` → `espionageGate.js` / `espionageMath.js`.** All INFO —
   `depLayer === layer` ⇒ **no pair**.
4. **`espionageCareerCredit.js` → `src/domain/spatial/distanceRead.js`** (`setSpatialLedger`).
   UNLAYERED ⇒ **no pair**. `espionageProducts.js:69` already imports it.
5. **`espionageProductStage.js` → `espionageCareerCredit.js`.** Both INFO ⇒ **no pair**.
6. **No cycle.** EXECUTED: no file under `src/domain/worldPulse/espionage/` imports any
   `npcLadder*` file. The new edge is acyclic and one-directional. ⛔ The leaf must **never**
   import a ladder file.

⚠ **ONE ASYMMETRY TO RECORD, on ES-5c's own precedent.** CPL-20 now carries three rows in two
directions: ES-3's `INTERIOR→INFO` (`espionageTap.js` → `npcLadderGoals.js`), ES-5b's
`INFO→INTERIOR`, and ES-5c's `INFO→INTERIOR`. ES-5d's is the **third `INFO→INTERIOR` row and the
second touching the ladder.** `pairId` stays **CPL-20** — the volume's own INFO × INTERIOR
anchor; **a wave never mints a twenty-third anchor where a canonical one fits.**

**Cure order applied, in order:** dependency inversion FIRST (the leaf takes plain values and an
injected `npcFor` closure, never reaching into the ladder or the errand family), a registry row
SECOND. **Nothing is baselined.**

---

## 8. Exact change manifest

| # | Action | Path | Symbol / region | Max Δ | Instruction |
|---:|---|---|---|---:|---|
| 1 | CREATE | `src/domain/worldPulse/espionage/espionageCareerCredit.js` | `CAREER_CREDIT_TUNING`, `depositMissionCredits`, `readMissionCreditEvents` | ≤ 120 eff | The deposit writer + the pure consumer read per §6.1. Imports ONLY: `clamp`/`clamp01` (`../../../kernel/math.js`), `round4` (`./espionageMath.js`), `espionageActive` (`./espionageGate.js`), `npcId` (`../npcAgency.js`), `getSpatialLedger`/`setSpatialLedger`/`dropSpatialLedger` (`../../spatial/distanceRead.js`), `compareCodepoint` (`../../deterministicSort.js`). ⛔ **No ladder import. No `writeErrands`.** Header states: the one-tick deposit lag, the drop-when-empty dormancy contract, the literal-key walker requirement, the id-less-operative declared absence (**O8**), and the never-import-the-ladder rule. |
| 2 | MODIFY | `src/domain/worldPulse/espionage/espionageProductStage.js` | `advanceEspionageProducts` (`:654-735`), after the landings loop | **≤ 15 eff** | One call to `depositMissionCredits({ worldState, tick, landings, npcFor, byId: ctx.byId })`, threading its returned `worldState`/`changed`. **No other function edited. `landOne` is NOT edited. `amendCovert` is NOT edited.** ⚠ 260 effective lines of headroom — measure before and after. |
| 3 | MODIFY | `src/domain/worldPulse/npcLadderKernel.js` | the hoist beside `:439`/`:444`; the fold after `:650`; the private `applyMissionCredit` beside `applyGoalLifecycle` (`:330`) | **≤ 15 eff** | The composition VERBATIM per §6.2. ⛔ `applyGoalLifecycle` is NOT edited. ⛔ No `LadderStanding` field is added. ⚠ 223 effective lines of headroom — measure before and after. |
| 4 | REGISTER | `src/domain/certification/couplingRegistryEspionage.js` | new `ES5D_CAREER_CREDIT_COUPLING` | ≤ 20 eff | Row per the `ES5C_CAREER_LADDER_COUPLING` template at `:444-474`, through `couplingRow()`. **All ten required fields**: `couplingId: 'CPL-20.INFO_TO_INTERIOR.ES-5d.career_credit'` · `pairId: 'CPL-20'` · `direction: 'INFO→INTERIOR'` · **`read: 'src/domain/worldPulse/npcLadderKernel.js#advanceNpcLadder'`** (this exact string is what `licensingRows` joins on — §7) · `receiptField:` **AUTHOR-TIME-UNMEASURED, §10** · `counterforce: 'src/domain/worldPulse/espionage/espionageCareerCredit.js#readMissionCreditEvents'` · `flags: ['errandSpineEnabled','espionageEnabled','npcLadderEnabled']` · `owningVolume: 'ESPIONAGE'` · `owningWave: 'ES-5d'` · `intendedDesk:` **AUTHOR-TIME-UNMEASURED**. Docstring MUST name that ES-5c's row does not license this importer. Append to `ES_ESPIONAGE_COUPLINGS` (`:477-488`) in wave order. |
| 5 | REGISTER | `src/lib/spatialUsage.js` | `TRACKED_LEDGER_KEYS` (`:227`) **or** `EXEMPT_LEDGER_KEYS` (`:282`) — **O4** | ≤ 5 eff | Classify the new ledger key. ⚠ Use the **bare string literal**; never import the key constant (it drags `distanceRead.js` onto first paint). ⚠⚠ If TRACKED, the classification **fails open** — it must ship with the behavioral pin in item 7, run as two mutants (drop the `counts` entry; drop the `MOVER_PRESENCE` row); both must red. |
| 6 | TEST | `tests/domain/espionageCareerCredit.test.js` | A1, A3, A4, A6 | — | The leaf's deposit/read pins + the lifecycle round trip + the anchored negative. ⚠ New file ⇒ un-anchored-negative ceiling **ZERO**; anchor every negative, preferring `tests/helpers/anchoredNegatives.js` (`expectPresentThenAbsent`, `expectAbsentWithAnchor`). |
| 7 | TEST | `tests/property/espionageCareerCreditDormancy.test.js` | A2, A5, A7, A8 | — | ES-5c's four-fence dormancy idiom + the declared-shift golden pair + the `spatialUsage` behavioral pin. Fence espionage-dark, ladder-dark, errand-spine-dark, and roads-dark EXPLICITLY. ⚠ New file ⇒ anchor ceiling **ZERO**. |
| 8 | TEST | `tests/domain/espionageProducts.test.js` | the ES-5c scan block (`:264-320`) | — | ⭐ **NO EDIT EXPECTED.** The block is listed so the implementer VERIFIES both arms stay green with the new leaf present: `ladderWritersOf(sources)` must still be `[]` (the leaf writes a different key), and `amendersOf(sources)` must still be exactly `[espionageProductStage.js]` (the leaf must not call `writeErrands`). ⛔ **If either moves, that is STOP 5 — never a pin edit.** |
| 9 | DOC | `docs/DESIGN_FP_ARCH_ES.md`, `docs/implementation/INDEX.md` | §3.14's credit half (:1240-1255); the ES-5d mapping at :1549-1553 | — | Record D1 (the maintenance road has no `stock` terminus and the wave adds one) and D2 (the carrier is the deposit idiom, not the `freshLieExposureFor` template §3.14 names) in the amended-in-place voice. Documentation receipts do not count as production lines. |

**⚠ THE STANDING LANDING DISCIPLINE, BINDING ON THIS PACKET.** It mints **two new test files**,
so the change **must ALSO re-derive the sovereignty lighting census WHOLE — all five figures in
one run, never patching one.** Current row: **`files: 2389, parked: 364, credited: 2025, titles:
19610, suiteTitles: 5543`** (`tests/lint/sovereigntyLightingContract.walker.test.js:3581`, moved
there by ES-5c). ⚠⚠ The five figures are asserted **in sequence** with `files` first, so **a red
`files` arm stops the run and the other four are never evaluated** — the walker says so itself at
`:3106-3113`. ⭐ **Measure them the way ES-5c did: a `console.log` inside the existing census test
BEFORE its first assertion**, so the probe mints no title and cannot move what it measures. Every
negative in both new files must be anchored; both start at an un-anchored-negative ceiling of
**ZERO**.

**Nothing else.** A target outside this table is out of scope even if the full gate finds an
adjacent defect.

---

## 9. Acceptance matrix — 8 cases (cap 8)

| # | Case | Assertion |
|---|---|---|
| A1 | Main reachable behavior | A covert mission closing with a credited grade for an operative who holds a rung, espionage + ladder lit ⇒ `depositMissionCredits` writes exactly one record keyed by that operative's ladder nid with `depositTick === tick`, and on the NEXT advance that NPC's `stock` rises by exactly the credited amount for that grade, `clamp`ed and `round4`ed. **Both the deposit and the reach in one case** — the reach is the claim. |
| A2 | Absent / disabled — FOUR fences | On one fixture: (a) espionage dark ⇒ **no ledger key minted** and `stock` byte-identical; (b) ladder dark ⇒ the deposit is written but `advanceNpcLadder` no-ops, ladder state byte-identical; (c) `errandSpineEnabled` false ⇒ no covert errands ⇒ no landings ⇒ no key; (d) roads dark ⇒ no journeys ⇒ no key. **Drop-when-empty proven in every arm: `spatialLedgers` must not gain the key at all.** |
| A3 | Counterforce / negative (anchored) | A landing whose grade is NOT in the credited set deposits **nothing**, and its operative's `stock` is byte-identical. Anchored against a live positive control **in the same test** (a credited grade on the same fixture DOES deposit and DOES move stock), so the negative cannot fail open. The credited set is asserted **derived from the frozen `MISSION_GRADES` export**, never re-typed, so a fifth grade cannot silently escape. |
| A4 | Sparse / malformed-but-supported | No landings · a landing with no resolvable roster npc · an id-less operative · an operative on no rung · a landing whose `observerId` names no live settlement ⇒ zero credit, zero `NaN`, zero negative delta, and the id-less arm is **declared** with a reason rather than silently keyed (**O8**). |
| A5 | Ordering — THE DECLARED ONE-TICK LAG | Drive the REAL pulse: close a graded mission, assert the credit lands on the tick **AFTER** the deposit is written, not the same tick — and assert that on the same-tick advance `stock` is unchanged. The uniform lag this wave inherits. ⛔ **CASE CORRECTED IN EXECUTION — DEVIATION D7, landed `954592c0`; RATIFIED by chair ruling H32, 2026-08-11.** As written this case asserts the DEAD window and **a conforming implementation would have shipped a feature that never fires.** The case as built asserts the opposite and pins the reason structurally: `espionageCareerCreditDormancy.test.js:232-251` reads `pulseKernel.js` **at source** and asserts that `advanceEnvoyDiplomacyPulse` (`:2031`) precedes the ladder chain (`:2563`) inside one `simulateCampaignWorldPulse` body with `tick: worldState.tick` co-occurring, carrying a ⛔ note that **flipping the call order must flip the window.** That is structural prevention, not a comment: a future reorder reds loudly instead of silently killing the fold. The credit lands on the SAME tick as the deposit. |
| A6 | ⭐ LIFECYCLE ROUND TRIP + IDEMPOTENCY (state is written) | **The full deposit lifecycle in one case:** write → persist → read → fold → **prune**. Advance twice with no new mission and assert (i) the ledger key is GONE after the consuming tick, (ii) `stock` did not move a second time, and (iii) a hand-planted deposit carrying a stale `depositTick` is never consumed. **The prune arm is the one that fails silently if forgotten** (§5b). |
| A7 | ⭐ Real writer-to-reader integration | Through `advanceEspionageProducts` and `advanceNpcLadder` on a real world: the espionage writer deposits, the ladder's own writer folds, and a SOURCE SCAN proves the espionage set wrote no ladder state and no second module routed `writeErrands` (ES-5c's two pins, re-run against the new leaf). |
| A8 | ⭐ THE DISCLOSED SHIFT — the golden pair | The ⟨F6⟩ pair: (i) a **dark** golden asserting byte-identity with the pre-change output on the same seed; (ii) a **lit** golden recording the NEW ladder output, whose header names the shift, its cause, and this packet. The lit golden is recorded ONCE, in this commit, with the cause stated (§9b) — never re-recorded silently. **The `spatialUsage` TRACKED behavioral pin rides here**, run as its two mutants (§5b). |

No privacy case: no receipt or audience surface is minted (ES-7 owns the voice).

---

## 9b. THE DECLARED BEHAVIOR SHIFT — the implementer MUST measure it before editing

> **This packet changes lit-world simulation output.** A credited `stock` feeds
> `npcLadderChallenge.js:291` (`standing: num(npcs[nid]?.stock, 0)`), which feeds `defenseScore`
> and `challengeScore`, which drive **whether a challenge is hopeless, the attempt RATE, and
> whether it clears the sustained margin** — i.e. **ladder successions, the news they emit, and
> every downstream consumer of rung order.** `stock` also feeds the §8 standing loop
> (`npcLadderKernel.js:995`) and the mirror's `standing` projection
> (`npcLadderState.js:901`). It is a DISCLOSED, one-time shift under ⟨F6⟩, anticipated by name at
> `DESIGN_FP_ARCH_ES.md:1273-1274`. **It is NOT a regression, and it may NOT ride silently.**
>
> **THE IMPLEMENTER'S OBLIGATION, before the first edit:** run the full gate at BASE and record
> which goldens and pins are green. Then, after the change, **enumerate every golden/pin that
> moved, name each one in the commit message, and state the cause.**
> ⛔ **Re-recording any golden without stating the cause is forbidden** (house non-negotiable 10).
> ⛔ **A golden that moves and is NOT on the enumerated list is STOP 7** — it means the reach went
> somewhere this packet did not measure.
>
> **Goldens and pins most likely to move — CANDIDATES, not a closed list; the implementer
> measures the real set (§10):**
> `tests/property/npcLadderDormancyGolden.test.js` ·
> `tests/property/contestedGoalsDormancyGolden.test.js` ·
> `tests/property/espionageAbsenceDormancy.test.js` ·
> `tests/property/espionageCareerDormancy.test.js` ·
> `tests/property/espionageProductsDormancyFence.test.js` ·
> `tests/domain/npcLadderKernel.test.js` · `tests/domain/npcLadderChallenge.test.js` ·
> `tests/domain/npcLadderSeatTransitions.test.js` · `tests/domain/npcLadderHeirs.test.js` ·
> `tests/domain/npcLadderCoherence.test.js` · `tests/domain/ladderRead.test.js` ·
> `tests/domain/espionageProducts.test.js` · `tests/lib/spatialUsage.test.js` ·
> `tests/lib/spatialLedgerCoverage.walker.test.js` ·
> `tests/perf/tickScanBudget.test.js` (a new per-advance ledger read — see §10).
> ⚠ Every *Dormancy* golden should be **unmoved**: they drive dark worlds, and a dark world mints
> no ledger key at all. **A moved dormancy golden is STOP 7**, not a re-record — it means the
> drop-when-empty contract leaked.
>
> ⭐ **BOTH SIBLINGS MOVED ZERO GOLDENS AND PROVED IT BY ARITHMETIC.** ES-5b and ES-5c each
> reached lit ladder/bloc math and each landed with zero moved goldens, because every lit consumer
> was itself behind a dark flag. **ES-5d should expect the same and must prove it the same way:**
> against the frozen census, not by absence of complaint. ⚠ If a golden DOES move here, that is
> the first time in this grain and it deserves the chair's attention before the commit, not after.

---

## 10. Verification commands

```sh
cd /Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold

# Focused tests — acquire the one test slot in the SAME command. NEVER bare vitest.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/espionageCareerCredit.test.js \
  tests/property/espionageCareerCreditDormancy.test.js \
  tests/domain/espionageProducts.test.js \
  tests/domain/npcLadderKernel.test.js \
  tests/domain/npcLadderChallenge.test.js \
  tests/domain/espionageCareer.test.js

# The ledger-coverage + usage walkers — a NEW setSpatialLedger key MUST be classified.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lib/spatialLedgerCoverage.walker.test.js tests/lib/spatialUsage.test.js

# The coupling ratchet — MUST stay green, licensed by the new CPL-20 row, NEVER baselined.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/couplingInclusion.walker.test.js \
  tests/lint/couplingDesk.walker.test.js \
  tests/domain/couplingRegistry.test.js

# The anchored-negative walker + the lighting census — BOTH move when new test files land.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/negativeAssertionAnchor.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js

# The dormancy goldens — the §9b denominator's most load-bearing arm.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/property/npcLadderDormancyGolden.test.js \
  tests/property/contestedGoalsDormancyGolden.test.js \
  tests/property/espionageAbsenceDormancy.test.js

# The scan-cost ratchet — a NEW per-advance ledger read lands on the pulse path.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/perf/tickScanBudget.test.js tests/perf/tickOpBudget.test.js

# Effective-line check (read the COUNT in the message; never pipe for status).
npx eslint src/domain/worldPulse/espionage/espionageCareerCredit.js \
  src/domain/worldPulse/espionage/espionageProductStage.js \
  src/domain/worldPulse/npcLadderKernel.js

# Both typecheckers, named per the two-typechecker receipt law.
sh scripts/gate-tail.sh npm run typecheck:domain:strict     # tsconfig.domain-strict.json
sh scripts/gate-tail.sh npm run typecheck:ratchet           # tsconfig.full.json

# Wave-end gate — NEVER through a pipe.
npm run check:tail
```

⚠ **A NAMED HOT-PATH RISK the implementer must measure, not discover.**
`readMissionCreditEvents` is called **once per ladder advance**, not per rung — that is the whole
point of the `:439`/`:444` hoist. Its cost is O(deposits), and deposits are pruned to one tick, so
the set is tiny. In a **dark** world the cost is zero (no key ⇒ `asObject(undefined)` ⇒ empty).
**But that is a prediction, not a measurement.** Run the perf pair at BASE and after.
⛔ If it reds, the cure is **NOT** a cache: memoising on world contents is the recorded OSR
resolver-state-identity hazard (no cache key may embed monotone contents). The cure is a STOP and
a chair conversation.
⛔ **If the implementer finds themselves calling `readMissionCreditEvents` inside the rung loop,
that is the bug the hoist exists to prevent.**

⚠ **THE COMMENT-CONVICTS-ITSELF HAZARD — it has fired twice recently.** A leaf has been convicted
by a roster-reader scan matching a single header line of PROSE. This packet's new leaf will carry
a header that necessarily discusses ladder state, `setSpatialLedger`, and `writeErrands` by name.
ES-5c's own scan is safe (it applies `stripComments`, and pins that a commented writer must not
convict — `tests/domain/espionageProducts.test.js:304-307`), **but other walkers in this estate do
not all strip comments.** ⛔ **If any scan reds on a comment, the cure is to reword the comment,
never to widen the scan.**

**AUTHOR-TIME-UNMEASURED baselines** — the implementer measures each at preflight, against the
BASE, **before the first edit**. Do **not** inherit a number from this packet.

| Figure | Status | Exact preflight command |
|---|---|---|
| Standing full-gate red at base | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run check` |
| `typecheck:ratchet` error count + ceiling | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run typecheck:ratchet` |
| `typecheck:domain:strict` count + ceiling | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run typecheck:domain:strict` |
| The GREEN-AT-BASE golden/pin set (the §9b denominator) | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run check` at BASE, then diff the pass list after |
| `tickScanBudget` scanOps ratio + `fallbacks` at base | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/perf/tickScanBudget.test.js` |
| Lighting census five figures | **AUTHOR-TIME-UNMEASURED** (the row read `2389/364/2025/19610/5543` at compile — **re-derive, do not inherit**) | re-derive ALL FIVE in one run via a `console.log` before the census test's first assertion; never patch `files` |
| `negativeAssertionAnchor` rows/sites | **AUTHOR-TIME-UNMEASURED** | `sh scripts/ratchet-inventory.sh negativeAssertionAnchor HEAD` |
| `couplingInclusion` pass count at base | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/couplingInclusion.walker.test.js` |
| `spatialLedgerCoverage` pass count at base | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lib/spatialLedgerCoverage.walker.test.js` |
| The CPL-20 row's `receiptField` and `intendedDesk` | **AUTHOR-TIME-UNMEASURED** — the packet does **not** hand-key them (HAND-KEYED-ADDRESS ROT). The observable is the ladder challenge/succession EVENT the credited standing causes, carried into the persisted pulse record; the address must be **derived**, not guessed, and must state in words that no persisted espionage receipt exists (ES-7 owns the voice). | Derive the live path a challenge event's receipt reaches in the pulse record; then run `tests/lint/couplingDesk.walker.test.js` — a row naming NO Herald kind (like ES-5b's and ES-5c's) avoids the desk-routing join entirely. |
| The credit ledger's key NAME | **AUTHOR-TIME-UNSET — O4** | the chair names it; it must be a bare string literal at the `setSpatialLedger` call site |

⚠ `npm run check` is a 17-step `&&` chain: a red step blacks out every later step, so the receipt
must say which steps actually **ran**.

---

## 11. Mandatory STOP conditions

Stop, without expanding or repairing, when:

1. Packet status is not READY (**it is DRAFT today — do not dispatch**).
2. HEAD is not `857e3a1a` or an explicitly pinned, ancestry-verified descendant.
3. Any target file is dirty, or any ladder-family file has a commit newer than ES-5c's recorded
   reading, or any espionage/envoy file has one newer than `c0447b8f`.
4. `depositMissionCredits`, `readMissionCreditEvents`, `applyMissionCredit`, or the chosen ledger
   key already exists (measured **zero** occurrences at `857e3a1a`); presence means another lane
   landed the grain.
5. ⛔ **Either ES-5c pin in `tests/domain/espionageProducts.test.js:264-320` moves** — the
   `ladderWriters` scan reporting any file, or `amendersOf` reporting anything but
   `[espionageProductStage.js]`. **Never edit either pin to green it.**
6. `npcAgency.js`, `settlementStrategy.js`, `roadsKernel.js`, `pulseKernel.js`, or
   `applyWorldPulse.js` would need **any** edit, or any `.size-baseline.json` entry would move.
7. **Any golden or pin moves that §9b did not name** — or any *Dormancy* golden moves at all.
8. Any hard scope limit in §3 would be exceeded — in particular a **third** modified production
   file, a **second** new persisted record family, or a **second** direct consumer. ⛔ **Editing
   `normalizeStanding` or `sortedStanding` means the implementer has drifted to architecture α;
   that is a re-slice, not a renegotiation.**
9. `tests/lint/couplingInclusion.walker.test.js` reds. **Never add a baseline entry to green it.**
   The cure order is dependency inversion, then a registry row (§7), **never** baselining.
10. `tests/lib/spatialLedgerCoverage.walker.test.js` reds and the cure is not a classification
    row, or the TRACKED behavioral pin cannot be made to red under both its mutants.
11. `tests/perf/tickScanBudget.test.js` or `tickOpBudget.test.js` reds (§10). ⛔ The cure is never
    a cache.
12. The lighting census cannot be re-derived WHOLE, or any new test file needs an
    un-anchored-negative ceiling row.
13. Any file reserved by the concurrent OSR lane would need touching.
14. **Any open item in §13 is still open at dispatch.** O1–O4 are load-bearing; **O1 in particular
    decides whether the packet fits at all**, and O2/O3 mean the packet CANNOT be implemented as
    written until the chair authors the tuning.

The STOP report carries the smallest measured contradiction, its evidence, and a proposed split.
No speculative repair.

---

## 12. Recorded deviations from the ES-5 / §3.14 charter

| # | Charter text | This packet | Why |
|---|---|---|---|
| **D1** | §3.14:1243-1247: the credit rides "the ladder family's EXISTING MAINTENANCE ROAD — the exact template §3.5 already uses" | The road is real and the wave joins it, **but it has no `stock` terminus and this wave adds one** | Measured (§0.2): the road's three existing external folds terminate in `maintainMarks` (stigma) and `mintBond` (bonds); its only `stock` writer, `applyGoalLifecycle`, takes purely ladder-internal input. The template §3.14 names is a template for MARKS. A narrowing of the prose, not a contradiction. |
| **D2** | §3.14:1244-1246: "a pure espionage-close read (`freshMissionGradeFor`, the `freshLieExposureFor` mirror) consumed by the ladder's maintenance one tick later" | The carrier is the **`readRoadsBondEvents` one-tick deposit idiom**, not the `freshLieExposureFor` keyed-ledger idiom | `freshLieExposureFor` is O(1) only because the credibility ledger is already nid-keyed; an errand ledger is not, so copying it literally would put an O(errands) scan inside the per-rung loop. The deposit idiom is already hoisted once per advance at `npcLadderKernel.js:439`/`:444`, needs no persisted consume-once marker, and keeps the packet inside its file budget (§3.1). |
| **D3** | §3.14: "success writes standing/momentum credit" | **Credit only; no debit.** A failed or `empty` mission costs nothing | The design's sentence is about success. A debit would be a second, unasked-for behavior and a second direction on the same tick. Recorded so the asymmetry is deliberate and visible. |
| **D4** | §3.14:1246: "standing/**momentum** credit" | **`stock` only** — `momentum` does not exist | Re-confirmed at `857e3a1a` (§0 claim 1). Half the named target is fictional; the wave credits the field that exists. |
| **D5** | CR-ES5C-3: "ES-5d must BUILD four things" | **Builds two, reuses two** | The identity bridge's three hops all exist as parts (`errand.from`, `rosterPersonById`, `npcId`) and only the composition is new; the coupling row is one row, not four things' worth of work; and the espionage set already owns a persistence road. The genuinely new construction is the deposit family and the ladder's `stock` terminus. |
| **D6** | ES-5c's D6 put `DEFENSE_WHEN_ABSENT` in the CONSUMING file's tuning block | The credit constant lands in the **new leaf's own** frozen export, not `LADDER_TUNING` | The opposite trade, deliberately: ES-5c's consuming file was already in its manifest, so the constant was free. Here `npcLadderState.js` is NOT in the manifest, and putting one constant there would spend the third modified-file slot (§3.2, **O2**). |

---

## 13. OPEN ITEMS — the chair closes each at promotion

⛔ **O1 decides whether the packet fits at all. O2 and O3 are hard blockers: the packet cannot be
implemented as written until the chair authors the tuning.**

| # | Item | Recommendation |
|---:|---|---|
| **O1** | ⛔ **THE CARRIER ARCHITECTURE — α (a `COVERT_KEYS` field on the errand row) or β (a one-tick deposit ledger).** α needs FOUR modified production files against a cap of three and is therefore a refuse-forward; β needs two. | **ACCEPT β.** The measurement is decisive (§3.1): α forces `envoyErrandRecords.js` + `envoyErrandVocabulary.js` for the DTO and `npcLadderState.js` for a persisted consume-once marker that must be taught to BOTH `normalizeStanding` and `sortedStanding` or it evaporates. β's strict `depositTick === tick - 1` window plus the writer's own prune make the fold fire once with **no** persisted marker, which is exactly how the ladder's two existing external deposits already work (`npcLadderKernel.js:437-444`). **Cost recorded honestly:** β drops a credit if a tick is skipped in a collapsed advance, where α would not — an exposure this estate has already accepted twice for the two structurally identical deposits, and one that loses a credit rather than double-counting one. ⛔ The third option — reusing the already-persisted `st.week` as the marker — is REJECTED: it crosses the WEEKS/TICKS clock split, and this volume has been bitten once already by a field whose name lies about its clock. |
| **O2** | ⛔ **THE CREDIT MAGNITUDE, and the tuning constant's HOME.** An implementer must not author it (CR-ES5B-6 / CR-ES5C-O4). The home question is live because `LADDER_TUNING` lives in `npcLadderState.js`, which β otherwise never touches. | **Home: the new leaf's own frozen `CAREER_CREDIT_TUNING`** — putting one constant in `LADDER_TUNING` would spend the third modified-file slot and pull a file with 196 lines of headroom into a manifest that does not need it. **Value: the chair authors it**, from the ladder's own grid, not from espionage. The parity evidence is measured in §6.3: `SEED_SPREAD: 3.0` is the ENTIRE structural height of the ladder in stock units, `STAND_MAX` is `10`, `STAND_BASELINE` is `3.0`, the half-life is `156` weeks, and the ladder's own event-driven deposit scale is `1.5`. **The lane's argument: a `met` credit should be a small fraction of `SEED_SPREAD`, with `exceeded` at twice it — a single good mission is not a rung, and against a 156-week half-life a career built on espionage must be sustained work rather than one lucky week.** ⚠ The espionage `*_W` family's `0.5` parity does NOT transfer (weights in a 0..1 ratio vs an additive delta on a 0..10 stock) — the same warning ES-5c carried. ⛔ The implementer may not tune it. |
| **O3** | ⛔ **THE GRADE → CREDIT MAP.** `MISSION_GRADES` is the frozen four-member set `['empty','exceeded','met','partial']` (`espionageMath.js:115`). Which grades credit, and in what ratio, is a tuning shape no code answers. | **The chair authors the map.** The lane recommends `exceeded` and `met` credit (at a 2:1 ratio), `partial` and `empty` credit **zero**, and **nothing debits** (D3). Argument: `freshMissionGradeFor` already caps an unfilled-leg mission at `partial` precisely so a dead leg cannot report success (`espionageProducts.js:402-404`), so `partial` is the design's own "did not do what it was asked" band — crediting it would undo that cap. ⛔ The map must be **derived from the frozen `MISSION_GRADES` export** in both code and test, never re-typed, so a fifth grade cannot silently escape (case A3). |
| **O4** | ⛔ **THE LEDGER KEY'S NAME AND ITS `spatialUsage` CLASSIFICATION.** `tests/lib/spatialLedgerCoverage.walker.test.js` reds on any unclassified `setSpatialLedger` key. | **TRACKED, with a behavioral pin.** By the recorded axis this is a DEPOSIT that persists across a tick boundary (like `routeNetwork`, `demographicPlans`, `pactProposals`), not a per-pulse re-derivation, and its gate is a virtual flag lit in no preset — both TRACKED conditions. ⚠⚠ **A TRACKED row FAILS OPEN**: adding the key to `TRACKED_LEDGER_KEYS` alone greens the walker while emitting zero telemetry, because `counts` and `MOVER_PRESENCE` are function-local and unexported. It **must** ship with a pin that drives the extractor, run as two mutants (drop the `counts` entry; drop the `MOVER_PRESENCE` row) — both must red (case A8). ⚠ Use the bare string literal in `spatialUsage.js`; never import the constant. **The key's NAME is the chair's** — the lane notes only that it must be spelled as a literal at the `setSpatialLedger` call site or the coverage walker cannot see the write (`thirdPartyRansom.js:358-359`). |
| **O5** | **THE DEGRADED-DARK RULE'S DIRECTION.** CR-ES5C-O5 says "declared-degraded when the ladder is dark — the grade stays a receipt." Does the espionage side still deposit when the ladder is dark? | **YES — deposit unconditionally; let the ladder's dormancy gate be the only ladder gate.** The deposit is espionage's own state, and having espionage read `npcLadderActive` would make the INFO layer conditional on an INTERIOR flag for no behavioral gain (the deposit is pruned each tick regardless). The grade continues to ride `receipt.grade` exactly as today, which IS the "stays a receipt" clause. **Alternative:** skip the deposit when the ladder is dark — cheaper by one ledger write per tick, but it couples the layers backwards. The lane recommends against, and flags that the choice is visible in case A2(b): under the recommendation, a ladder-dark world **does** mint the ledger key. ⚠⚠ **If the chair prefers a ladder-dark world to mint NO key, say so — it changes A2(b) from "the key exists and nothing consumes it" to "no key at all", and it changes which dormancy goldens are in scope.** |
| **O6** | **IS ES-5d OWNER-GATED?** CR-ES5B-3 put ES-5b and ES-5c under one CR-ES-1 signature but predates ES-5d. This packet writes a new persisted record family, which is a persistence-shape change. | **The lane cannot settle this and does not claim it.** The register (ES-5c) wrote nothing and was plainly covered; ES-5d mints a new `spatialLedgers` key. Under judgment-ledger §3, persistence shape is owner-gated regardless of delegation breadth. **The lane's reading: a per-tick, pruned, drop-when-empty deposit behind two dark flags is engine-inert dark state of the same class as `roadsBondEvents` and `gratitudeBondEvents`, neither of which took an owner signature** — but that reading is the chair's to confirm, not the lane's to assume. ⛔ Do not dispatch on lane momentum. |
| **O7** | **THE WRITER-COUNT READING OF `PACKET_STANDARD.md:125`** — "exactly one named writer for any state that changes." Two states change here (the deposit, and ladder `stock`), each with one writer. Is the cap per-state or per-packet? | **Read it PER-STATE.** The clause is a single-writer law, and the repo spells the same law that way in its own architecture (`npcLadderKernel.js:44`: "SINGLE-WRITER LAW (§8): the ladder kernel writes ONLY its sidecar"). Under a per-packet reading, **no** handoff wave could ever ship, because a handoff by definition has a depositor and a consumer. ⚠ ES-5c's budget table recorded this row as a count (`1 / 0`), so the ambiguity is real and unresolved in the standard's own use. **If the chair reads it per-packet, ES-5d is a refuse-forward under both architectures and must split into a deposit wave and a fold wave** — the lane recommends against that split, because a deposit with no consumer is dead state and the fold wave would have nothing to prove. |
| **O8** | **THE ID-LESS OPERATIVE.** `npcId` falls back to `stablePart(name \|\| label \|\| npc_${index})` when `npc.id` is absent, and `rosterPersonById` hands back the object, not the index. | **DECLARE the credit ABSENT with a reason** for an operative whose nid cannot be minted unambiguously (the SP-C degraded-arm idiom), rather than recovering the index from `homeItem.settlement.npcs`. Argument: index recovery is possible but couples the deposit writer to roster ordering, and a mis-recovered index would credit **the wrong NPC** — the worst available failure. An absent credit is visible and honest; a wrong credit is neither. **Alternative:** recover the index (it is a two-line `findIndex`) and credit correctly in the rare case. The lane leans to declaring absence but flags that the chair may prefer coverage, and case A4 pins whichever is chosen. |
| **O9** | **§6.2: the fold sits AFTER `applyGoalLifecycle`, beside the two `mintBond` folds, rather than inside the goal lifecycle.** | **Confirm.** The placement follows the file's own layering — internal derivation first, external deposits after — and keeps `applyGoalLifecycle` with one reason to change `stock` and no espionage term in the goal receipt. Vetoable in one clause. |

---

## 13b. Chair rulings at the READY flip (2026-08-11) — all nine items CLOSED

Fable-issued; implementing them owes no post-boundary row. Reopen none.

- **O1 — ARCHITECTURE β, the one-tick deposit ledger.** The lane's refuse-forward on α is
  ACCEPTED as measured: a persisted consume-once marker must be taught to BOTH
  `normalizeStanding` and `sortedStanding` or it evaporates, which forces a fourth
  modified production file against a cap of three. β's strict `depositTick === tick-1`
  window plus the writer's prune make the fold fire once with **no persisted marker**.
  Its honest cost is recorded and accepted: β drops a credit on a collapsed advance where
  α would not — an exposure this estate already carries twice for the two identical
  deposits, and **losing a credit is the right failure direction versus double-counting
  one.** ⛔ The `st.week` marker option stays REJECTED: it crosses the WEEKS/TICKS clock
  split, and this volume was bitten once already by a field whose name lies about its clock.
- **O2 — `MISSION_CREDIT_MET = 0.15`, home = the new leaf's own frozen export.**
  Chair-authored DARK tuning, individually vetoable, owner-signed at soak; ⛔ the
  implementer may not tune it. Parity argument, derived from the lane's grid: `SEED_SPREAD`
  is `3.0` and is **the ladder's entire structural height**, so `0.15` is one twentieth of
  it — roughly twenty sustained met-grade missions to move an officer one full
  rung-spread. **That is a career's worth of work, not a season's**, which is the register
  §3.14 describes. The home is the leaf's own export because the value is meaningless
  outside it and the single-home law outranks slot economy (the CR-ES5C-O4 precedent).
- **O3 — the grade→credit map CONFIRMED: exceeded 2×, met 1×, partial and empty ZERO, and
  NO DEBIT.** The lane's reason is decisive and I am adopting it verbatim:
  `freshMissionGradeFor` **already caps unfilled-leg missions at `partial`**, so crediting
  partial would undo that cap from the other side. No debit — a mission that fails is
  already its own punishment through the errand's existing consequences; a second one
  double-counts.
- **O4 — ledger key and classification: the key is the leaf's own, classified TRACKED**,
  with the behavioral pin the lane demands. ⚠⚠ `spatialLedgerCoverage.walker` reds on an
  UNCLASSIFIED key but a TRACKED classification **FAILS OPEN**, so the pin must be
  behavioral and run as TWO mutants — one proving it catches an unclassified key, one
  proving it catches a TRACKED key that emits nothing.
- **O5 — ladder-dark: the deposit is NOT written.** No writer, no prune, no key: a dark
  ladder must be byte-identical, and a ledger that accumulates while nothing consumes it
  is a leak wearing a receipt.
- **O6 — I RULE IT, and record it as vetoable rather than escalating.** A new
  `spatialLedgers` key is persistence-shape, which sits near the owner-gated line — but
  this one is a ONE-TICK ledger with a mandatory prune, written only when the flag is lit,
  carrying no history and no migration. It is a transient under the delegation grant's
  breadth, not a durable record family. **Recorded on the owner queue as an FYI, not a
  gate; nothing waits on it.** ⚠ If the prune is ever removed, that removal IS owner-gated.
- **⭐ O7 — `PACKET_STANDARD.md:125` READS PER-STATE, and the standard is sharpened to say
  so.** The clause is *"exactly one named writer for any state that changes"* — "for any
  state" is already the grammatical reading, and the lane is right that the per-PACKET
  misreading would make **no handoff wave shippable, ever**. The standard is amended in
  the promotion commit to read "for any ONE state that changes (per state, not per
  packet)". This unblocks a whole class of future waves, not just this one.
- **O8 — the id-less operative resolves to NO CREDIT, silently and by design.** An
  operative with no resolvable ladder identity is not an error; it is someone the ladder
  does not model. ⛔ It must never throw and never fall back to a default identity.
- **O9 — the fold's placement follows the file's OWN hot-path idiom:** hoist the deposit
  Map once per advance beside the two existing external Maps (`npcLadderKernel.js:439`
  and `:444`), then `.get()` per rung. ⛔ Do NOT copy `freshLieExposureFor`, which is O(1)
  only because the credibility ledger is nid-keyed and an errand ledger is not — the lane
  caught this and it is the difference between a hoist and a per-rung scan.

**Standing landing discipline, binding:** any new test file obliges this change to
re-derive the sovereignty lighting census WHOLE (five figures, one run — current
`2389/364/2025/19610/5543`; use ES-5c's method: a `console.log` inside the existing census
test BEFORE its first assertion, so the probe mints no title and cannot move what it
measures) and to anchor every negative in the new files (new files start at ceiling ZERO;
prefer `tests/helpers/anchoredNegatives.js` where no structural control exists).
⚠ ES-5c's repaired scan now polices you: `espionageProducts.test.js:311-315` asserts only
ONE espionage module may route `writeErrands`. ⚠ The comment-convicts-itself hazard has
fired twice — a leaf matched a roster-reader scan on a single header line of PROSE.

## 14. Marking-law note for the chair

Per the marking law at the `33aeea35` boundary, authoring a packet from a Fable-issued design owes
no queue row, and **this DRAFT lane appends nothing**. **Four items here go beyond that** and in
the compiling lane's judgment **owe a row at promotion**:

1. **§0.1 / D5 — CR-ES5C-3's "BUILD four things" is measurably TWO builds and TWO reuses.** The
   espionage set already owns a persistence road (`beliefMaps` + a scan-pinned single `writeErrands`
   amender), and the identity bridge's three hops all exist as parts with only the composition
   missing. A chair ruling narrowed by measurement — and the narrowing is what makes the wave fit.
2. **§3.1 / O1 — the carrier architecture decides the budget.** α is a refuse-forward at 4-of-3
   modified files; β fits at 2-of-3. This is the finding that decides the packet's shape, and it
   turns on a persisted consume-once marker that two explicit key lists would otherwise have to be
   taught (`normalizeStanding` and `sortedStanding`) — the recorded evaporating-field class.
3. **§0.1 / §5 — ES-5c's repaired scan carries a SECOND pin nobody has recorded outside its own
   file:** `amendersOf(sources)` must equal exactly `[espionageProductStage.js]`. It is a live
   constraint on every later espionage wave, it is the reason architecture α is doubly expensive,
   and it deserves to be known outside the test that holds it.
4. **§13 / O7 — `PACKET_STANDARD.md:125`'s writer clause is genuinely ambiguous**, and under one
   reading **no handoff wave can ever ship**. ES-5c's own budget table used the count reading. This
   needs a chair ruling that will bind every future handoff, not just this one.

Also worth a row in the lane's judgment, though smaller: **`freshMissionGradeFor`'s output is dead
on every production path today** — computed at `espionageProductStage.js:820`, carried to
`envoyPulse.js:469`, and dropped at `pulseKernel.js:2031-2054`, which reads seven other fields off
the same object and never touches `espionageLandings`. ES-5d is the wave that gives it a consumer,
and until it lands the grade is arithmetic nobody reads.
