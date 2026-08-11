# `ESPIONAGE / ES-5c` — implementation contract (DRAFT, rev 1)

- **Status:** READY
- **Status note:** promoted by the chair 2026-08-11; §13's seven open items are CLOSED in §13b below (CR-ES5C-1..6 plus the two authored values). O2's hard blocker is discharged.
- **Compiled:** 2026-08-11 by the ES-5c author/recon lane.
- **Verified base:** `claude/composite-r4` at `868aca1a8c602c0d50c3b35180156e17c6941a44`
- **Base note:** `git status --porcelain` **EMPTY** at compile start (EXECUTED). ES-5b landed at
  `6c0238ad`; `868aca1a` is its ledger record. CR-ES5B-7's just-in-time trigger is satisfied.
- **Depends on:** `6c0238ad` (ES-5b, LANDED)
- **Collision group:** the npcLadder family (`npcLadderKernel/State/Contest/Challenge`) — the
  ES-5 charter's THIRD named CHECK-GIT-FIRST surface.
- **Commit authority:** none granted by this draft.
- **Packet law:** [`PACKET_STANDARD.md`](../PACKET_STANDARD.md)

---

## 0. WHAT ES-5c INHERITS, AND WHAT MEASUREMENT DID TO IT

### 0.1 The charter, and the three arms it names

`DESIGN_FP_ARCH_ES.md:1503` (amended by ES-5b's landing) binds ES-5c to **"THE CAREER
CONSUMERS (§3.14)"**, and :1520-1524 enumerates them:

> "`promotionRiskOf` into the ladder contest math + `freshMissionGradeFor` into the ladder's
> maintenance road (npcLadderActive-gated; declared-degraded when the ladder is dark — the
> grade stays a receipt). Budgets: … career leaf ≤ 120"

CR-ES5B-7 adds a third: ES-5c **"must flip `espionageGauntlet.js:400`'s
`Object.freeze(['promotionRisk'])` declared-absent term, whose pin is
`tests/domain/espionageGauntlet.test.js:756`."**

Both chair addresses are **EXACT and LIVE at `868aca1a`** (EXECUTED). Naming them ARM A, ARM B,
ARM C:

| Arm | What | §3.14 role |
|---|---|---|
| **A** | `promotionRisk01Core` weakens an absent rung-holder's defense | the register's consumer (1), the Q1-gated one |
| **B** | `freshMissionGradeFor` credits ladder standing at mission close | J-ES-17, "the credit" |
| **C** | flip the gauntlet's declared-absent `promotionRisk` term | the register's consumer (2), §3.4b |

### 0.2 D5's address ROTTED; the chair's two did not

| Address | Source | Measured at `868aca1a` |
|---|---|---|
| `espionageGauntlet.js:400` `const absent = Object.freeze(['promotionRisk']);` | CR-ES5B-7 | **EXACT** |
| `tests/domain/espionageGauntlet.test.js:756` `expect(read.termsAbsent).toEqual(['promotionRisk']);` | CR-ES5B-7 | **EXACT** |
| `promotionRisk01Core` at `espionageMath.js:381` | ES-5b D5 | **ROTTED — actual `:401`** (+20) |

### 0.3 ⛔ §3.14's "no new contest code" IS FALSE — and it fails by NAMING THE WRONG FILE

`DESIGN_FP_ARCH_ES.md:1262-1264` claims, verbatim: *"(1) the ladder CONTEST math (an absent
holder defends weaker — rivals advance through the contest machinery that already runs every
tick; **no new contest code**)"*.

This is the **third** occurrence of this disease in this volume (§3.11's "machinery that
already exists… with no further code" was measured false by ES-5b at both halves). The
measurement:

| §3.14's claim | Measured at `868aca1a` | Evidence |
|---|---|---|
| "the ladder CONTEST math" carries a defense term | `npcLadderContest.js` has **no defense term, no holder/challenger asymmetry, and no rung defense at all**. It resolves GOAL collisions, not rung holding. | `contestMargin` (`npcLadderContest.js:370`) is a single **symmetric** function applied identically to both sides via the `marginOf` closure (`:588-596`). |
| "an absent HOLDER defends weaker" | The holder/raiser vocabulary is the **opposed** contest — and the opposed branch of `resolveContest` (`:409-419`) **never reads `marginA`/`marginB`**. It decides on `raiserFired` / `raiserDone` alone. | EXECUTED read of `resolveContest` `:391-421`. |
| "the machinery that already runs every tick" | `contestMargin`'s ONLY consumer is `tieBreak` (`:428-429`); `tieBreak`'s ONLY caller is `resolveContest:405`, reached **only** on `kind === 'convergent'` **and** `firedA && firedB` (both goals fired the SAME advance). Every other path — `lapsed`, `stalemate`, single-fire, and the entire opposed family — ignores the margin. | EXECUTED. |
| "no new contest code" | Composing at `contestMargin` requires changing **four** surfaces: `contestMargin` (`:370`), `resolveContest` (`:391`), the `ContestMarginInputs` typedef (`:366`), and the `marginOf` closure (`:588-596`) — and `contestMargin` has **no `worldState`, no `tick`, and no npc object** in scope. | EXECUTED signature trace. |

**⭐ THE MACHINERY DOES EXIST — IN A FILE THE DESIGN NEVER NAMES.**
`src/domain/worldPulse/npcLadderChallenge.js#defenseScore` (`:132`) is the rung-defense
function, and it already carries **the exact idiom §3.14 asks for**, at `:145-147`:

```js
// §11.4 THE THREE-BODY: a defender who is itself straining upward defends weakened.
receipt.threeBodyPenalty = d.isChallenging ? -round4(Math.max(0, score) * (1 - T.DEFENSE_WHEN_CHALLENGING)) : 0;
if (d.isChallenging) score *= T.DEFENSE_WHEN_CHALLENGING;
```

"An absent holder defends weaker" is byte-for-byte the same shape as "a straining holder
defends weaker." And `defenseScore` drives **three** live decisions, not one tie-break:
`:301` (`cEval.score < dEval.score` ⇒ hopeless), `:302` (the margin feeding the attempt RATE),
`:310` (`win = cEval.score >= dEval.score * TURN_MARGIN`).

⇒ **§3.14's INTENT is deliverable and the reach is real — but at `npcLadderChallenge.js`, not
at `npcLadderContest.js`.** This is recorded as deviation **D2** and is open item **O1**.

### 0.4 ⛔ `rungExposure01` HAS NO SOURCE ANYWHERE IN `src/`

`promotionRisk01Core` (`espionageMath.js:401`) folds three inputs:

```js
const away = Math.min(1, Math.max(0, Number(row.awayWeeks) || 0) / T.PROMOTION_AWAY_CAP_WEEKS);
const pressure = T.PROMOTION_EXPOSURE_W * n01(row.rungExposure01)
  + T.PROMOTION_RIVAL_W * n01(row.rivalPressure01);
return round4(n01(away * pressure));
```

| Input | Source | Status |
|---|---|---|
| `awayWeeks` | `npc.whereabouts.sinceTick`, written by `advanceRoads` (`roadsKernel.js:1047`, hostage variant `:1055`), keyed `npcId(sid, npc, index)` (`:1067`) — the identical key spelling the ladder mints at `npcLadderKernel.js:521`. | **AVAILABLE, zero plumbing** |
| `rungExposure01` | `grep -rn "rungExposure" src/` returns **only the parameter's own declaration** (`espionageMath.js:398,405`). No per-rung exposure or contested magnitude exists in the ladder family. The nearest things are `seatWeightOf` (rung HEIGHT, not exposure) and `contestedGoal` (a **boolean**, `npcLadderChallenge.js:291-294`). | ⛔ **ABSENT — MUST BE BUILT** |
| `rivalPressure01` | `worldState.npcStates[nid]` carries `ambitionHeat` (`npcAgency.js:149,557,658,667,917,940,1138`) and `rivalryTargets` (minted `:553`), keyed by `npcId` (`npcAgency.js:193`) — the same function the ladder imports at `npcLadderKernel.js:81`. Reachable from `defenseScore` via `ctx.worldState`. ⚠ The ladder family holds **ZERO** `npcStates` references today. | **REACHABLE, new read** |

`PROMOTION_EXPOSURE_W = 0.5`, so feeding `rungExposure01 = 0` **halves the register**. A silent
zero is exactly what this estate forbids (the SP-C declared-absent idiom, and
`espionageGauntlet.js:389-392`'s own words). **Authoring `rungExposure01`'s derivation is an
operative choice this lane cannot settle from code — open item O2.**

### 0.5 ⭐ THE UNIT QUESTION, SETTLED AT SOURCE (CONFIRMED)

`whereabouts.sinceTick` is **misnamed**: it holds a WEEK, not a tick.
- `roadsKernel.js:1047` writes `sinceTick: num(mm.departTick, 0)`.
- `mm.departTick` is stamped from `weekClock` (`roadsKernel.js:492`).
- `roadsKernel.js:359`: `const weekClock = num(asObject(asObject(worldState).calendar).elapsedWeeks, now2); // calendar weeks`
- `npcLadderKernel.js:418`: `const weeks = num(asObject(asObject(worldState).calendar).elapsedWeeks, now2);`

⇒ **Both sides read `calendar.elapsedWeeks`.** `awayWeeks = weeks - npc.whereabouts.sinceTick`
is unit-correct with **no conversion**, and `PROMOTION_AWAY_CAP_WEEKS: 12` is directly
comparable. There is **no** `TICKS_PER_WEEK` constant anywhere in `src/domain/` (EXECUTED) —
the field name is the only thing that lies. Recorded as deviation **D4**.

### 0.6 ⛔ ARM C's SUBJECT IS A DEAD INSTRUMENT — AND AN UNCONDITIONAL FLIP CREATES THE EXACT
### DISHONESTY THE DOCBLOCK FORBIDS

`gatherOrGovernRead` (`espionageGauntlet.js:398`) is exported and **called by nothing**.
EXECUTED, exhaustive — the importers of `espionageGauntlet.js` in `src/` are:

| Importer | Imports |
|---|---|
| `envoyPulse.js:46` | `advanceEspionageGauntlet` |
| `espionageProductStage.js:110-114` | `GAUNTLET_TUNING`, `covertDwellRead`, `gauntletCatchFactors` |
| `couplingRegistryEspionage.js:170,203` | address STRINGS, not code |

`gatherOrGovernRead` appears in no import list and has no internal caller. The absence is
**declared and deliberate** at `espionageProductStage.js:44-52`: wiring it *"without also
RE-TIMING his departure would let him refuse a risk and then stand in it anyway"*; the
re-timing is *"route surgery on a live journey"* and is explicitly out of an information
wave's scope.

**The trap:** the function's own docblock (`:389-392`) says *"THE PROMOTION TERM IS DECLARED
ABSENT, NOT FOLDED AS ZERO… Folding a silent zero would narrate a risk no machinery
delivers."* A caller-supplied `promotionRisk01` parameter on a function with **no caller** is
**permanently `undefined` ⇒ folded as 0** — which converts an honest declared-absence into
precisely the silent zero the docblock forbids, and leaves a trap for whichever future wave
first wires the arm.

**RECOMMENDED CURE — CARRIER-CONDITIONAL, on the EP-q precedent** (open item O3): the term is
declared present only when a carrier actually supplies it.

```js
export function gatherOrGovernRead({ dwell, appetite01, demandMet, factors, promotionRisk01 } = {}) {
  const carried = Number.isFinite(Number(promotionRisk01));
  const absent = carried ? EMPTY_TERMS : PROMOTION_ABSENT;   // both module-frozen
```
…and the pin at `tests/domain/espionageGauntlet.test.js:756` becomes a **both-arms** pin: no
carrier ⇒ `['promotionRisk']`; a supplied carrier ⇒ `[]` **and** a measurably different
decision. This satisfies CR-ES5B-7 (the term is flipped, and the flip is reachable and
proven) without minting a silent zero.

### 0.7 ⛔⛔ THE SCAN PIN THAT GUARDS THIS WHOLE ARCHITECTURE IS **VACUOUS** — and ES-5c is the
### wave that first makes it load-bearing

§3.14 says *"The ladder's OWN writers write; the ES module set writes NO ladder state
(scan-pinned)"*, and ES-3's own registry docstring
(`couplingRegistryEspionage.js:266-268`) cites it: *"Nothing here writes ladder state — the ES
module set writes none, and the scan in tests/domain/espionageProducts.test.js proves it."*

**It proves nothing.** `tests/domain/espionageProducts.test.js:268-271` (EXECUTED read):

```js
const ladderWriters = Object.entries(sources)
  .filter(([, source]) => /\b(?:writeNpcLadder|setLadderState|npcLadderState\s*=)/.test(source))
  .map(([file]) => file);
expect(ladderWriters).toEqual([]);
```

| Defect | Measurement |
|---|---|
| All three forbidden spellings are **fictional** | `grep -rn "writeNpcLadder\|setLadderState" src/` → **ZERO in the entire tree** (EXECUTED). The third alternative `npcLadderState\s*=` requires an `=` after the token, so it cannot match `from './npcLadderState.js'` either. |
| It cannot see the **real** writer | The ladder's actual persistence spelling is `setSpatialLedger(worldState, 'npcLadder', …)` — `npcLadderKernel.js:310` and `:904` (EXECUTED). An espionage leaf writing ladder state through the real spelling leaves this assertion **green**. |
| It has **no** anti-vacuity control — and the test knows the technique | The **same test**, twelve lines below, plants a mutant for its `writeErrands` sibling (`:282-283`, `plantedSecond` ⇒ `toHaveLength(2)`). The `ladderWriters` half has **none**. This is the recorded credit-side-enumeration / negated-`arrayContaining` family: a negative shipped beside a positive control for the *other* arm. |

⚠⚠ **Why this is ES-5c's problem and not a passing observation.** Until now the claim was
cheap because **no import existed in this direction at all** — `grep -rn "espionage"
src/domain/worldPulse/npcLadder*.js` returns **ZERO** (EXECUTED). ES-5c opens that direction
for the first time. The guard stops being theoretical in exactly the commit that makes it
matter, and it is not wired to anything.

⇒ **This packet takes the repair as its one prevention guard** (PACKET_STANDARD.md:113 —
"one prevention guard that keeps that behavior from regressing"), as manifest item 9 and
acceptance case **A8**. The cure is to scan for the **real** writer spelling and to anchor it
with a plant, exactly as the `writeErrands` half already does. ⛔ This is a **test-only**
repair; it adds no production file and does not widen the behavior family.

### 0.8 Verdict

**ES-5c IS compilable — it is NOT a refuse-forward** — and its substrate is materially better
than ES-5b's: `defenseScore` already holds `d.npc` and `ctx.worldState`, the
multiplicative-weakening idiom is there to copy verbatim, the file has 628 lines of headroom,
and every espionage tuning constant the register needs already landed at ES-0.

But **§3.14 is wrong in three separate places**, and the packet cannot go READY until the
chair closes what those refutations open:

1. **Arm A's site** moves from the file the design names (`npcLadderContest.js`, no defense
   term) to the file that has the machinery (`npcLadderChallenge.js#defenseScore`) — **O1**.
2. **`rungExposure01` has NO SOURCE** anywhere in `src/`; one of the register's three inputs
   must be authored before the packet is implementable — **O2**. ⛔ *This is the hard blocker.*
3. **Arm C's flip lands on a function with no caller**; the literal flip mints the silent zero
   its own docblock forbids — **O3**.
4. **Arm B does not fit and its substrate does not exist** — no `momentum` field, no
   stock-credit seam, no carrier for the grade. Split to **ES-5d** — §3.1, §3.1b, **O5**.
5. **The scan pin guaranteeing the whole ladder↔espionage boundary is vacuous**, and ES-5c is
   the commit that first makes it load-bearing. Repaired here as the prevention guard — **O7**.

⭐ Three of these are the SAME disease ES-5b diagnosed once: **this volume's prose asserts that
machinery exists, and the machinery does not.** §3.11 was refuted on both halves at ES-5b;
§3.14 is now refuted on its contest half (§0.3), its credit half (§3.1b), and its guard
(§0.7). The pattern is worth a chair note beyond this packet.

---

## 1. Reconciled authority

1. **Live git at `868aca1a`** — existence authority.
2. **CR-ES-1 (SIGNED)** — the Roads §1 law 5 amendment. **CR-ES5B-3: ONE CR-ES-1 signature
   covers ES-5b and ES-5c.** ES-5c is **NOT separately owner-gated**, and this packet claims
   no owner gate on the register itself.
3. **`DESIGN_FP_ARCH_ES.md` §3.14** (lines 1228–1275) — the career grain's law, INCLUDING its
   measured-false "no new contest code" clause at :1262-1264.
4. **`DESIGN_FP_ARCH_ES.md:1503`, :1520-1524** — the ES-5 charter as amended by ES-5b, and the
   career leaf's ≤ 120 budget.
5. **CR-ES5B-7** — the just-in-time trigger and the gauntlet obligation.
6. **PACKET_STANDARD.md :118-158** — budget, acceptance cap, STOP law.
7. **ES-5b (`ES-5B.md`, LANDED `6c0238ad`)** — the sibling grain's precedents: the
   dependency-inverted INFO leaf, the licensed cross-layer row, the §9b declared-shift
   obligation.

**Unreconciled and therefore excluded:** nothing. §3.14's "no new contest code" clause is not
excluded but **refuted and recorded** (D2).

---

## 2. Outcome

Under `espionageEnabled` **and** `npcLadderActive`, the **promotion-risk register goes live**:
a rung-holder who has been abroad, on a contested rung, with rivals pressing, **defends his
seat weaker** — through `npcLadderChallenge.js`'s own defense score, in the same
multiplicative shape the file already uses for the three-body strain — and §3.4b's
gather-or-govern read stops declaring the promotion term absent **whenever a carrier supplies
it**.

`promotionRisk01Core` gets its **first production consumer**. Written at ES-0
(`espionageMath.js:401`), it is read by **nothing** in `src/` at `868aca1a` (EXECUTED —
`grep -rn "promotionRisk01Core" src/` returns the definition line and nothing else).

Dark worlds — espionage-dark, ladder-dark, or roads-dark — are **byte-identical**. The lit
shift is a **disclosed** one-time ladder-outcome move under ⟨F6⟩, declared in §9b and fenced
by its own golden pair.

**Explicit non-goals:**
- **ARM B — `freshMissionGradeFor` into the ladder's maintenance road. SPLIT TO ES-5d** (§3.1).
- `npcLadderContest.js` — **zero edits.** The margin is a tie-break only (§0.3); reaching it
  is a four-surface signature cascade for a branch that fires on double-fire alone.
- Any ladder **state write** by the espionage module set (the scan pin holds).
- Tuning of `PROMOTION_*` keys, any receipt/audience surface (ES-7's), the war chooser,
  `settlementStrategy.js`, `pulseKernel.js`, `applyWorldPulse.js`.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

---

## 3. Hard scope budget

### 3.1 ⛔ ARM B DOES NOT FIT — THE SECOND SPLIT, AND ITS REASONING

ES-5c as chartered carries **two behavior families** against a limit of one:

| | Arm A + C (the REGISTER) | Arm B (the CREDIT) |
|---|---|---|
| Direction | a PENALTY | a CREDIT |
| Trigger | per-tick, continuous | event-driven, at mission close |
| Input | `promotionRisk01Core` | `freshMissionGradeFor` |
| State | **writes NOTHING** (a derived read) | **WRITES ladder standing/momentum** |
| Named writer | none needed | one required, and it must be the ladder's own |

PACKET_STANDARD.md:123 allows **one behavior family**; :125 requires **exactly one named
writer for any state that changes**. Arm A+C need zero writers; Arm B needs one. They are not
the same family by any reading, and the split is the same one CR-ES5B-1 already ratified once
for exactly this reason.

**Arms A and C ARE one family**, on ES-5b's own precedent ("one behavior family, two
consumption sites"): §3.14 names the register's **two** consumers by number — "(1) the ladder
CONTEST math… (2) §3.4b's gather-or-govern read" — and this packet lights both. One family,
two consumers, which is the cap.

⇒ **ES-5c = the register (A + C). ES-5d = the credit (B).** Recorded as deviation **D1** and
open item **O5**. §3.1b states what ES-5d faces so the chair can slot it.

### 3.1b ⛔ ARM B'S SUBSTRATE DOES NOT EXIST EITHER — measured, so the chair can slot ES-5d
### without a second recon lane

§3.14:1240-1247 claims the credit rides *"the ladder family's EXISTING MAINTENANCE ROAD — the
exact template §3.5 already uses… success writes standing/momentum credit."* **Four
measurements refute it**, and they are the reason Arm B is a wave rather than a composition:

| §3.14's claim | Measured at `868aca1a` | Evidence |
|---|---|---|
| "standing/**momentum** credit" | ⛔ **`momentum` DOES NOT EXIST.** `grep -rn "momentum" src/domain/worldPulse/npcLadder*.js` → **ZERO** (EXECUTED). `LadderStanding` (`npcLadderKernel.js:118-133`) carries `stock, since, week, goal, stigma, grudges, [bonds], [lastExposed], [wasOusted], [lastLieSeen]`. **Half the named target is fictional.** |
| "the exact template §3.5 already uses" | The `freshLieExposureFor` template is real (`npcCredibility.js:173`, consumed at `npcLadderKernel.js:643`) — but its terminus is `maintainMarks`, which **never writes `stock`**: `npcLadderState.js:318` spreads `st` and overrides only `stigma`/`grudges`/`lastExposed`/`wasOusted`. It is a template for **MARKS**. |
| "the existing maintenance road" carries a credit seam | **No `stock` writer accepts an argument from outside the ladder family.** All seven write sites (`npcLadderKernel.js:350/363`, `:632-633`, `:636`, `:715`, `:811/824`; `npcLadderContest.js:676`; `npcLadderState.js:330`) take ladder-internal inputs only. The three existing external folds — `freshLieExposureFor`, `readRoadsBondEvents` (`npcLadderKernel.js:439`), `readGratitudeBondEvents` (`:444`) — **all terminate in `mintBond`/`maintainMarks`. None lands on `stock`.** |
| a fresh read "one tick later" | **The grade has no carrier.** `freshMissionGradeFor` is pure and its docstring says *"never persisted"*; its output reaches only a returned receipt (`espionageProductStage.js:843` → `envoyPulse.js:469 espionageLandings`) and is **never written to `worldState`**. The precedent's lag works only because the deposit is PERSISTED (`spatialLedgers.npcCredibility[nid].lieExposure`) and survives the tick boundary. Nothing of the grade does. |

**⇒ ES-5d must BUILD four things, not compose one:**
1. **a carrier** — a persisted deposit (the `readRoadsBondEvents` / `readGratitudeBondEvents`
   idiom is the honest precedent) or a widened `COVERT_KEYS` DTO vocabulary
   (`envoyErrandRecords.js:429-431` fails closed on an unlisted key);
2. **an identity bridge** — `errand.npcId` is `durableId || rosterId` (`envoyCasting.js:190`);
   ladder nids are `` `${saveId}:${npc.id||stablePart(name)}` `` (`npcAgency.js:193-195`).
   Different spellings; the credit needs a mapping;
3. **a new STOCK writer on the maintenance road**, ladder-owned, gated like `lieStigmaLit`
   (`npcLadderKernel.js:425`);
4. **a coupling row** — unless the deposit is routed through an UNLAYERED module, which is
   exactly how the precedent avoids the cost (`npcCredibility.js` is unlayered,
   `tests/lint/.coupling-unlayered-baseline.json:98`, so `npcLadderKernel → npcCredibility`
   crosses no layer and needed no row). **The template is structurally cheaper than the copy.**

That is a new persisted record family + a named writer + an identity mapping — a wave, and
plainly not a composition inside ES-5c's budget.

### 3.2 This packet against the standard's caps

| Limit | Cap | This packet | Head-room |
|---|---:|---:|---|
| Behavior families | 1 | **1** — "the promotion-risk register goes live" | at cap |
| New persisted record families | 1 | **0** | — |
| Named writers for changed state | 1 | **0** (writes no state) | — |
| Feature flags | 1 | **0 new** (rides `espionageEnabled` × `npcLadderEnabled`) | — |
| User-facing surfaces | 1 | **0** | — |
| Direct production consumers | 2 | **2** — `npcLadderChallenge.js`, `espionageGauntlet.js` | **at cap** |
| New logic-bearing leaves | 2 | **1** — `espionageCareer.js` | 1 |
| Existing logic-bearing files modified | 3 | **2** — `npcLadderChallenge.js`, `espionageGauntlet.js` | 1 |
| Registration-only files touched | 3 | **1** — `couplingRegistryEspionage.js` | 2 |
| Handwritten files | 12 | **8** (leaf + 2 modified + registry + 2 new tests + 2 edited tests) | 4 |
| New/changed effective production lines | 400 | **≈ 165** (leaf ≤ 120 · 15 · 10 · registry ≈ 20) | ~235 |
| New leaf effective lines | 250 | **≤ 120** (the charter's own career-leaf budget) | 130 |
| Shared/hot-file delta | 15 each | **≤ 15** `npcLadderChallenge.js` · **≤ 10** `espionageGauntlet.js` | at/under |
| Acceptance cases | 8 | **8** | **at cap** |

⇒ **NO FURTHER SPLIT IS REQUIRED once Arm B leaves.** ⚠ The packet sits **at** the
direct-consumer cap. Anything that would add a third direct consumer or a fourth modified
production file is a **re-slice, never a renegotiated cap** (STOP 8).

⚠ **No espionage tuning key is minted.** `PROMOTION_AWAY_CAP_WEEKS: 12` (`espionageMath.js:210`),
`PROMOTION_EXPOSURE_W: 0.5` (`:211`) and `PROMOTION_RIVAL_W: 0.5` (`:212`) all landed at ES-0.
The one new constant is a **ladder defense weight** and lands in `CHALLENGE_TUNING`, not in
`ESPIONAGE_TUNING` — see §6.3 and open item **O4**. That is why `espionageMath.js` is NOT in
the manifest and the third modified-file slot stays unspent.

### 3.3 Measured effective line counts (EXECUTED at `868aca1a`)

```sh
npx eslint <files> --rule '{"max-lines":["error",{"max":1,"skipBlankLines":true,"skipComments":true}]}' --format json
```
⚠ Run it **without** a pipe when reading its status: with `| head` the shell reports head's
exit, not eslint's. eslint's own exit under this rule is **1** by construction (every file
exceeds `max:1`); the COUNT is in the message text, and that is the figure. Never read this
through a pipe for a pass/fail claim.

| File | Effective | Ceiling | Headroom | Δ this packet | After |
|---|---:|---:|---:|---:|---:|
| `npcLadderChallenge.js` | **172** | 800 (domain default) | **628** | ≤ 15 | ≤ 187 |
| `espionageGauntlet.js` | **291** | 800 | 509 | ≤ 10 | ≤ 301 |
| `espionageCareer.js` (NEW) | 0 | 800 | — | ≤ 120 | ≤ 120 |
| `couplingRegistryEspionage.js` | **148** | 800 | 652 | ≤ 20 | ≤ 168 |
| `npcLadderContest.js` | **531** | 800 | 269 | **0** | 531 |
| `npcLadderKernel.js` | **577** | 800 | 223 | **0** | 577 |
| `npcLadderState.js` | **604** | 800 | 196 | **0** | 604 |
| `espionageMath.js` | **163** | 800 | 637 | **0** | 163 |
| `espionagePresence.js` | **46** | 800 | 754 | **0** | 46 |
| `factionCompetition.js` | **759** | 800 | **41** ⚠ | **0** | 759 |
| `settlementPolitics.js` | **560** | 800 | 240 | **0** | 560 |
| `npcAgency.js` | **833** | **833 EXACT** (`scripts/.size-baseline.json`) | **0** ⛔ | **0** | 833 |

**`scripts/.size-baseline.json` carries NO `npcLadder*` entry** (EXECUTED) — every ladder file
rides the 800-line domain default (`eslint.config.js`, `files: ['src/domain/**/*.js']`).
⛔ `npcAgency.js` sits at an **EXACT** baseline of 833 with **zero** headroom; this packet does
not touch it, and any edit there is STOP 6.

⭐ `npcLadderChallenge.js` has **628 effective lines of headroom** — by far the most in the
family, and one more reason it is the right composition site (§0.3).

---

## 4. Sealed dispatch and preflight

```sh
cd /Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold
git rev-parse --abbrev-ref HEAD                 # expect claude/composite-r4
git rev-parse HEAD                              # expect 868aca1a… or a pinned descendant
git merge-base --is-ancestor 868aca1a8c602c0d50c3b35180156e17c6941a44 HEAD; echo $?   # expect 0
git status --porcelain                          # every target file MUST be clean
git log --oneline -3 -- src/domain/worldPulse/npcLadderChallenge.js \
  src/domain/worldPulse/npcLadderKernel.js src/domain/worldPulse/npcLadderContest.js \
  src/domain/worldPulse/npcLadderState.js \
  src/domain/worldPulse/espionage/espionageGauntlet.js    # CHECK-GIT-FIRST, per the ES-5 charter
```

**CHECK-GIT-FIRST result at compile time (EXECUTED, `868aca1a`):** the newest commit touching
any ladder-family file is **`93e7ed50`** ("repair observed contracts and faction identity"),
then `173e9d7b`, then `9ecec2a2` — **identical to ES-5b's compile-time reading**, i.e. nothing
has landed on the ladder since. The espionage family's newest is `6c0238ad` (ES-5b itself).
**No collision.** Re-run at dispatch; a newer commit on any of the five is STOP 3.

**⚠ FOREIGN WORK RESERVED — do not touch, stage, restore, or attribute.** `git status
--porcelain` was **empty** at this compile, but a second read-only lane is live in this tree.
Treat any dirty or untracked path at dispatch as foreign unless it is in §8's manifest.

Required live symbols (verify each before editing; **navigate by symbol, never by the line
numbers quoted here**):

| Symbol | Home |
|---|---|
| `promotionRisk01Core` | `src/domain/worldPulse/espionage/espionageMath.js:401` |
| `ESPIONAGE_TUNING.PROMOTION_AWAY_CAP_WEEKS` / `_EXPOSURE_W` / `_RIVAL_W` | `espionageMath.js:210-212` |
| `espionageActive` | `src/domain/worldPulse/espionage/espionageGate.js:75` |
| `gatherOrGovernRead` | `src/domain/worldPulse/espionage/espionageGauntlet.js:398` |
| `defenseScore` | `src/domain/worldPulse/npcLadderChallenge.js:132` |
| `openWindows` | `src/domain/worldPulse/npcLadderChallenge.js:158` |
| `resolveFactionChallenges` (destructure at `:244`; `mk()` at `:260`) | `src/domain/worldPulse/npcLadderChallenge.js:242` |
| `CHALLENGE_TUNING` (`DEFENSE_WHEN_CHALLENGING: 0.6` at `:52`) | `src/domain/worldPulse/npcLadderChallenge.js:~40` |
| `Combatant` / `ChallengeCtx` typedefs | `src/domain/worldPulse/npcLadderChallenge.js:101-104` |
| `npcLadderActive` | `src/domain/worldPulse/npcLadderKernel.js:191` |
| `npcId` | `src/domain/worldPulse/npcAgency.js:193` |
| `whereabouts.sinceTick` (schema) | `src/domain/settlement.schema.js:451` |
| `espionageActive` | `src/domain/worldPulse/espionage/espionageGate.js:75` |
| `round4` (exported by ES-5b) | `src/domain/worldPulse/espionage/espionageMath.js:88` |
| `WHEREABOUTS_STATES` | `src/domain/roads/state.js:122` |
| `clamp01` | `src/kernel/math.js:60` |
| the vacuous `ladderWriters` scan | `tests/domain/espionageProducts.test.js:268-271` (its plant sibling at `:282-283`) |

---

## 5. Verified tree contract

- **State authority:** `settlement.npcs[].whereabouts.{state,sinceTick}` (the roads mirror) and
  `worldState.npcStates[nid].{ambitionHeat,rivalryTargets}` (the agency layer).
  **ES-5c writes NEITHER.**
- **Sole writers (unchanged by this packet):** mirror — `advanceRoads`
  (`roadsKernel.js:1047`/`:1055`, sole per-tick writer). Agency — `npcAgency.js` (`:553`,
  `:557`). Ladder standing — the ladder's own writers, untouched.
- ⚠ **`whereabouts.sinceTick` HOLDS A WEEK, NOT A TICK** (§0.5, CONFIRMED). It is written from
  `weekClock = calendar.elapsedWeeks` (`roadsKernel.js:359,492`), the same clock
  `npcLadderKernel.js:418` reads as `weeks`. The subtraction needs no conversion. **The field
  name is the only thing that lies, and the leaf's header must say so** — a future reader who
  trusts the name will divide by a constant that does not exist.
- ⚠ **The whereabouts mirror carries a DECLARED ONE-TICK LAG** for exactly this consumer class.
  `espionagePresence.js:17-31` records it and names `advanceNpcLadder` as one of the three
  affected consumers: the ladder reads the mirror BEFORE `advanceRoads` writes it. ES-5c
  inherits that lag unchanged, and it stays uniform. It must be restated in the new leaf's
  header and pinned (case A5). Reordering the pulse is forbidden (L1).
- **Direct readers this packet adds:** `defenseScore` (`npcLadderChallenge.js:132`) and
  `gatherOrGovernRead` (`espionageGauntlet.js:398`). **Two, which is the cap.**
- **Absence rule:** espionage dark / ladder dark / no `whereabouts` / `state === 'hostage'` /
  `sinceTick` absent or in the future / no `npcStates` row ⇒ the risk is exactly **`0`** and
  the defense multiplier is exactly **`1`** (the identity). **Never `NaN`, never `undefined`,
  never a negative multiplier.**
  ⚠ **Hostages are NOT counted** — `WHEREABOUTS_STATES` minus `'hostage'`, the same exclusion
  §3.11 and ES-5b already made by name ("hostages are already off-stage"). Derive it from the
  frozen export, never re-type the triple.
- **Persistence / regen / undo / migrate:** **NONE.** The leaf is a pure DERIVED read over
  structures this packet does not write — the `ransomDwellRead` / `espionagePresence`
  precedent, and §1's zero-new-keys law. No lifecycle seam applies.
- **Receipts:** none minted. `defenseScore`'s **internal** `receipt` record gains one named
  contribution (the file's own enumeration idiom); that is a debug enumeration, not a Herald
  surface. The Herald voice is ES-7's.
- **Test shapes to copy:** `tests/domain/npcLadderChallenge.test.js:41-52` (the
  `threeBodyPenalty` both-arms defense pin — the EXACT shape a new multiplicative term must
  copy, and the five assertions it must leave intact when dark);
  `tests/domain/espionagePresence.test.js` (ES-5b's leaf pins);
  `tests/property/espionageAbsenceDormancy.test.js` (the four-fence dormancy idiom + the
  declared-shift golden pair).
- **Forbidden homes:** `npcLadderContest.js` (§0.3 — zero edits); `npcLadderKernel.js`,
  `npcLadderState.js`, `npcLadderGoals.js`; `npcAgency.js` (**EXACT 833 baseline, zero
  headroom**); `pulseKernel.js`, `applyWorldPulse.js` (L1, banked); `settlementStrategy.js`
  (IN-4's no-EDIT law, exact 812); `roadsKernel.js` (exact 838); `roads/state.js`.
  ⛔ The espionage module set writes **NO** ladder state — the scan pin holds and this packet
  does not approach it.

---

## 6. Exact contracts

### 6.1 The leaf's surface

`src/domain/worldPulse/espionage/espionageCareer.js` exports exactly two symbols:

```
promotionRisk01For({ awayWeeks, rungExposure01, rivalPressure01 }) → number in [0, 1], round4
careerRiskFor(worldState, npc, nid, weeks, windowCount)
    → 0   when espionage is dark, the npc is not away, or the npc is a hostage
    → number in [0, 1]
```

**`careerRiskFor`** is the per-defender composer, and it takes **no ladder objects** —
dependency inversion, the `presentShare01` precedent:

1. `if (espionageActive(worldState) !== true) return 0;` — one flag read, nothing else
   touched. This is the byte-identical dark path.
2. `awayWeeks` = `max(0, weeks - Number(npc.whereabouts.sinceTick))`, and **0** unless
   `npc.whereabouts.state` is in `WHEREABOUTS_STATES` minus `'hostage'`
   (`WHEREABOUTS_STATES.filter(s => s !== 'hostage')` — **derived from the frozen export at
   `roads/state.js:122`, never re-typed**).
3. `rungExposure01` = **O2's derivation**, from the caller-supplied `windowCount` (a plain
   number — the leaf never imports the ladder).
4. `rivalPressure01` = the `npcStates[nid]` ambition/rivalry read, clamped, **0** when absent.
5. Return `promotionRisk01Core({ awayWeeks, rungExposure01, rivalPressure01 })`.

⛔ The leaf must **never** import `npcLadderChallenge.js` or any `npcLadder*` file — that
closes the loop and drags the whole family (the `barrel-hop` hazard).

### 6.2 The `npcLadderChallenge` composition — THE REACH

⭐ Written against live code read at `868aca1a`, not transcribed from the design.

The stamp mirrors the file's **existing** post-`mk()` mutation idiom. `defender.isChallenging`
is already stamped after construction at `:286`; `promotionRisk01` is stamped the same way,
**after** `openWindows` so the window count is in scope:

```js
// (1) new import — INFO leaf, INTERIOR importer: a REAL cross-layer pair, licensed (§7)
import { careerRiskFor } from './espionage/espionageCareer.js';

// (2) inside resolveFactionChallenges, AFTER `const windows = openWindows(...)` (:296)
//     and BEFORE `const dEval = defenseScore(defender, ctx)` (:300):
defender.promotionRisk01 = careerRiskFor(worldState, defender.npc, defender.nid, weeks, windows.length);

// (3) inside defenseScore, mirroring :145-147 VERBATIM in shape:
receipt.absenceDecay = d.promotionRisk01 > 0
  ? -round4(Math.max(0, score) * T.DEFENSE_WHEN_ABSENT * d.promotionRisk01) : 0;
score -= Math.max(0, -receipt.absenceDecay);

// (4) CHALLENGE_TUNING gains DEFENSE_WHEN_ABSENT beside DEFENSE_WHEN_CHALLENGING (:52)
// (5) the Combatant typedef (:101-102) gains `promotionRisk01: number`
```

**≤ 15 effective added lines**, the shared/hot-file cap, leaving ≈ 613 of 628 headroom.

⭐ **WHY THE STAMP AND NOT A SIGNATURE CHANGE — the load-bearing judgment.** `defenseScore` is
**exported** and pinned by `tests/domain/npcLadderChallenge.test.js:41-52`. Adding a
parameter changes a public surface and every existing call; stamping a field on the
`Combatant` record it already receives changes none, and it is **the file's own idiom** —
`isChallenging` is set exactly this way at `:286`. Recorded so the chair can veto in one
clause (O6).

⚠ **`defenseScore` is symmetric across roles.** A combatant is a defender at rung `i-1` and a
challenger at rung `i` in the same pass. This packet discounts **only the defense score**, per
§3.14's "an absent holder defends weaker". It does **not** touch `challengeScore` — an absent
climber's *challenge* is out of scope and is a non-goal. Recorded as **D3**.

### 6.3 `DEFENSE_WHEN_ABSENT` — home and value

**Home: `CHALLENGE_TUNING` (`npcLadderChallenge.js`), NOT `ESPIONAGE_TUNING`.** This is a
**ladder defense weight**, the direct sibling of `DEFENSE_WHEN_CHALLENGING: 0.6` (`:52`), and
it multiplies a LADDER score. The espionage arithmetic's own constants
(`PROMOTION_AWAY_CAP_WEEKS`, `PROMOTION_EXPOSURE_W`, `PROMOTION_RIVAL_W`) already live in
`ESPIONAGE_TUNING` and are untouched, so the espionage single-home idiom (`espionageMath.js:124-127`)
is **not** forked. This also keeps `espionageMath.js` out of the manifest entirely and leaves
the third modified-file slot unspent — the opposite trade from ES-5b's D6, and deliberately
so. **Open item O4** — the chair may rule the other way; the cost is one modified-file slot.

**Value: AUTHOR-TIME-UNSET — this lane does not author it (open item O4).** ES-5b's CR-ES5B-6
established that an implementer must never be forced to author dark tuning, and that the
**chair** authors it with its argument. The parity evidence this lane measured, for the
chair's use:
- `DEFENSE_WHEN_CHALLENGING: 0.6` — the file's own defense-weakening multiplier, and the
  structural twin of this term.
- `STIGMA_CHALLENGE_TAX`, `CLASH_DEFENSE_EROSION: 2.0`, `FACTION_FALLING_DEFENSE: -1.5` — the
  file's other defense modifiers, all authored in ladder units, none at 0.5.
- ⚠ The espionage `*_W` family's 0.5 parity (ES-5b §6.2) does **not** transfer: those are
  weights inside a 0..1 espionage ratio; this is a multiplier on a ladder score.
⇒ The lane recommends the chair set it as a **fraction in `DEFENSE_WHEN_CHALLENGING`'s
units**, and notes that at `promotionRisk01 = 1` the two terms should not compound to a
defense of zero.

### 6.4 The gauntlet composition — Arm C, carrier-conditional

Per §0.6. `gatherOrGovernRead` gains one optional `promotionRisk01`; `termsAbsent` is `[]`
**only** when a finite carrier is supplied, and `['promotionRisk']` otherwise. The folded term
raises the effective risk the spy weighs against his appetite (§3.14: the register is the
"govern" half of the trade), so a supplied carrier makes `govern` strictly more likely — never
less. **≤ 10 effective lines. No caller is added** — wiring it is route surgery, declared out
of scope at `espionageProductStage.js:44-52` and unchanged here.

### 6.5 Bounds, rounding, order

`clamp01` then `round4`, matching both families' idioms (`espionageMath.js`'s `n01`+`round4`;
`npcLadderChallenge.js`'s `round4(Math.max(0, score))`). The leaf imports `clamp01` from
`../../kernel/math.js` and `round4` from `./espionageMath.js` (exported by ES-5b — verify).
Iteration order is irrelevant: the read is per-defender and order-independent.

### 6.6 Flag and dormancy

Gated `espionageActive(worldState) === true` **and** `npcLadderActive(worldState) === true`,
both BY NAME, both read strictly with `=== true` so absent and false are identical. The ladder
gate is already the caller's (`npcLadderKernel.js:392` early-returns), so the leaf reads only
the espionage flag. Dark ⇒ `careerRiskFor` returns `0` ⇒ `receipt.absenceDecay` is `0` ⇒
`defenseScore` computes byte-identically to today.

**Triple dormancy, all arms measured:** ladder dark ⇒ `advanceNpcLadder` no-ops before the
challenge engine runs; espionage dark ⇒ the leaf returns 0 on one flag read; roads dark ⇒ no
`whereabouts` ⇒ `awayWeeks` 0 ⇒ risk 0.

### 6.7 Alignment and edit story

Req 13: declared-empty for this slice (the engagement is ES-5a's, landed).
Req 14: **engine-only** — the one player/DM verb is ES-7's.

---

## 7. THE COUPLING TRAP — CW-0w (⚠ this has bitten SIX times; ES-5c is the seventh, and it is
## TAKEN rather than avoided)

**Measured layer homes** (`tests/lint/couplingInclusion.walker.test.js`):

| Module | Layer | Evidence |
|---|---|---|
| `src/domain/worldPulse/espionage/**` | **INFO** | walker `:143` — a DIRECTORY pattern; every ES leaf is claimed the day it lands |
| `npcLadderChallenge.js` | **INTERIOR** | walker `:179`, `/^src\/domain\/worldPulse\/(?:faction|…|npcLadder|seatBooks)/` |
| `npcAgency.js` | UNLAYERED | matches no pattern (the INTERIOR npc pattern is `npcLadder`, not `npc`) |
| `src/domain/roads/**`, `src/kernel/**` | out of census scope | `CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//` (`:458`) |

**THE DECISIVE LAW, READ AT SOURCE.** `couplingInclusion.walker.test.js:807`:

> `test('a NEW cross-layer import is either licensed by a registry row or REDS')`

Its body filters `LIVE_PAIRS` by `!BASELINE_KEYS.has(…)`, then `!OWED_KEYS.has(…)`, then
**`licensingRows(pair).length === 0`**. `licensingRows` (`:667-671`) joins a row to a pair when
`row.direction === pair.direction` **and** (`moduleOf(row.read) === pair.importer` **or**
`moduleOf(row.counterforce) === pair.importer`). Direction is `${depLayer}→${layer}`
(imported→importer).

⇒ **A new cross-layer pair does NOT red the ratchet when a registry row licenses it in the
same commit** — ES-5b's ratified reading. Chains for every import this packet mandates:

1. **`npcLadderChallenge.js` → `espionageCareer.js`. A REAL PAIR, and it is TAKEN.**
   INTERIOR importer, INFO dependency ⇒ direction **`INFO→INTERIOR`**, minting the live key
   `src/domain/worldPulse/npcLadderChallenge.js|src/domain/worldPulse/espionage/espionageCareer.js|INFO→INTERIOR`.
   ⚠⚠ **ES-5b's `ES5B_ABSENCE_BENCH_COUPLING` does NOT license it.** That row's `read` is
   `src/domain/worldPulse/factionCompetition.js#topFactionEntries`, and the join is on the
   **importer module**, so a different importer needs its **own row**.
   **Licensed by the new CPL-20 row at manifest item 4**, whose `read` address is
   `src/domain/worldPulse/npcLadderChallenge.js#defenseScore` and whose `direction` is
   `INFO→INTERIOR`. **Nothing is baselined.**
   ⭐ This is **the first espionage→ladder edge in the repo** — the ladder family holds ZERO
   espionage references at `868aca1a` (EXECUTED, all six files).
2. **`espionageCareer.js` → `npcAgency.js` (`npcId`) and → `roads/state.js`
   (`WHEREABOUTS_STATES`).** `npcAgency.js` has no layer ⇒ `if (!depLayer) continue` fires;
   `roads/**` is outside `CENSUS_SCOPE_RE`. **No pair is minted** either way. Precedent chain
   already exists: `espionagePresence.js` imports both (ES-5b, §7 chain 3), and
   `npcLadderKernel.js:80` imports `isOffStage` from `../roads/state.js`.
3. **`espionageCareer.js` → `espionageGate.js` / `espionageMath.js`.** All INFO —
   `depLayer === layer` ⇒ **no pair**.
4. **`espionageGauntlet.js`** gains no import at all (Arm C adds a parameter, not a
   dependency). **No pair.**
5. **No cycle.** EXECUTED: no file under `src/domain/worldPulse/espionage/` imports any
   `npcLadder*` file, and no `npcLadder*` file imports any espionage leaf. The new edge is
   acyclic and one-directional. ⛔ The leaf must **never** import a ladder file.

⚠ **ONE ASYMMETRY TO RECORD, on ES-5b's CR-ES5B-4 precedent.** ES-3's
`ES3_FLAW_DISTORTION_COUPLING` already anchors CPL-20 in the **opposite** direction
(`INTERIOR→INFO`, `espionageTap.js` importing `npcLadderGoals.js`). ES-5c's row is the second
`INFO→INTERIOR` row under CPL-20 and the **first** touching the ladder. `pairId` stays
**CPL-20** — the volume's own INFO × INTERIOR anchor; **a wave never mints a twenty-third
anchor where a canonical one fits.**

**Cure order applied, in order:** dependency inversion FIRST (`careerRiskFor` takes a plain
`windowCount` number and the npc object, never reaching into the ladder; the leaf imports
nothing from any consumer), a registry row SECOND. **Nothing is baselined.**

---

## 8. Exact change manifest

| # | Action | Path | Symbol / region | Max Δ | Instruction |
|---:|---|---|---|---:|---|
| 1 | CREATE | `src/domain/worldPulse/espionage/espionageCareer.js` | `promotionRisk01For`, `careerRiskFor` | ≤ 120 eff | The pure career leaf per §6.1. Imports ONLY: `clamp01` (`../../kernel/math.js`), `round4` + `promotionRisk01Core` + `ESPIONAGE_TUNING` (`./espionageMath.js`), `espionageActive` (`./espionageGate.js`), `WHEREABOUTS_STATES` (`../../roads/state.js`), `npcId` (`../npcAgency.js`). Header states: the one-tick whereabouts lag (§5), **that `whereabouts.sinceTick` holds a WEEK not a tick** (§0.5), the hostage exclusion, and the never-import-the-ladder rule (§7 chain 5). |
| 2 | MODIFY | `src/domain/worldPulse/npcLadderChallenge.js` | `defenseScore` (`:132`), the stamp inside `resolveFactionChallenges` (after `:296`), `CHALLENGE_TUNING`, the `Combatant` typedef (`:101`) | **≤ 15 eff** | The composition VERBATIM per §6.2. `challengeScore` is NOT edited. No other function edited. ⚠ 628 effective lines of headroom — measure before and after. |
| 3 | MODIFY | `src/domain/worldPulse/espionage/espionageGauntlet.js` | `gatherOrGovernRead` (`:398`) + its docblock (`:389-392`) | ≤ 10 eff | Carrier-conditional promotion term per §6.4. Rewrite the "DECLARED ABSENT" docblock paragraph to state the new conditional law. **Add no caller.** **Nothing else.** |
| 4 | REGISTER | `src/domain/certification/couplingRegistryEspionage.js` | new `ES5C_CAREER_LADDER_COUPLING` | ≤ 20 eff | Row per the `ES5B_ABSENCE_BENCH_COUPLING` template at `:389-407`, through `couplingRow()`. **All ten required fields** (`couplingRegistrySchema.js:47-56`): `couplingId: 'CPL-20.INFO_TO_INTERIOR.ES-5c.career_register'` · `pairId: 'CPL-20'` · `direction: 'INFO→INTERIOR'` · **`read: 'src/domain/worldPulse/npcLadderChallenge.js#defenseScore'`** (this exact string is what `licensingRows` joins on — §7) · `receiptField:` **AUTHOR-TIME-UNMEASURED, §10** · `counterforce: 'src/domain/worldPulse/espionage/espionageGauntlet.js#gatherOrGovernRead'` · `flags: ['errandSpineEnabled','espionageEnabled','npcLadderEnabled']` · `owningVolume: 'ESPIONAGE'` · `owningWave: 'ES-5c'` · `intendedDesk:` **AUTHOR-TIME-UNMEASURED**. Docstring MUST name that this is the FIRST espionage→ladder edge and that ES-5b's row does not license it. Append to `ES_ESPIONAGE_COUPLINGS` (`:410`) in wave order. |
| 5 | TEST | `tests/domain/espionageCareer.test.js` | A1, A3, A4, A6 | — | The leaf's own pins + the `defenseScore` reach + the gauntlet's both-arms carrier pin. ⚠ New file ⇒ un-anchored-negative ceiling **ZERO**; anchor every negative, preferring `tests/helpers/anchoredNegatives.js`. |
| 6 | TEST | `tests/property/espionageCareerDormancy.test.js` | A2, A5, A7 | — | ES-5a/ES-5b's four-fence dormancy idiom + the declared-shift golden pair. Fence espionage-dark, ladder-dark, roads-dark, and `errandSpineEnabled` false EXPLICITLY. ⚠ New file ⇒ anchor ceiling **ZERO**. |
| 7 | MODIFY | `tests/domain/espionageGauntlet.test.js` | `:756` | — | The declared-absent pin becomes a **both-arms** pin (§6.4). ⚠ This file has **no** `negativeAssertionAnchor` ceiling row today; do not create one. |
| 8 | TEST | `tests/domain/espionageProducts.test.js` | the `ladderWriters` scan (`:268-271`) | — | ⭐ **THE PREVENTION GUARD.** Replace the three fictional spellings with the **real** ladder writer spelling (`setSpatialLedger(worldState, 'npcLadder', …)` — `npcLadderKernel.js:310`, `:904`) and ANCHOR it with a plant, mirroring the `writeErrands` half's own `plantedSecond` control twelve lines below (`:282-283`). ⛔ Test-only; no production file, no widened family. The repaired scan must RED against a planted real-spelling write and stay green otherwise. |
| 9 | DOC | `docs/DESIGN_FP_ARCH_ES.md`, `docs/DESIGN_FP_ARCHITECTURE.md`, `docs/implementation/INDEX.md` | §3.14:1262-1264; the ES-5c mapping at :1503; the wave count at :1591-1598; `INDEX.md:107` | — | Record D2 (§3.14's "no new contest code" is FALSE and names the wrong file) in the amended-in-place voice; slot ES-5d if O5 is accepted; ⚠ **`INDEX.md:107` still reads "ES-5b waits on insertion/order reconciliation" and is STALE at `868aca1a`** — ES-5b LANDED at `6c0238ad`. Documentation receipts do not count as production lines. |

**Nothing else.** A target outside this table is out of scope even if the full gate finds an
adjacent defect.

---

## 9. Acceptance matrix — 8 cases (cap 8)

| # | Case | Assertion |
|---|---|---|
| A1 | Main reachable behavior | A rung-holder away `6` weeks on a `traveling` errand, on a rung with open windows, with a live rival, espionage + ladder lit ⇒ `careerRiskFor` returns the exact `promotionRisk01Core` value for those three inputs, and on the SAME fixture that defender's `defenseScore` drops by exactly `DEFENSE_WHEN_ABSENT * risk` of its pre-term score, with `receipt.absenceDecay < 0`. **Both the leaf and the reach in one case** — the reach is the claim. |
| A2 | Absent / disabled — FOUR fences | On one fixture: (a) espionage dark ⇒ `defenseScore` **byte-identical** to base; (b) ladder dark ⇒ `advanceNpcLadder` no-ops, byte-identical; (c) roads dark / no `whereabouts` ⇒ risk `0`, byte-identical; (d) `errandSpineEnabled` false ⇒ `espionageActive` false ⇒ byte-identical. |
| A3 | Counterforce / negative (anchored) | A holder whose only absence is `state: 'hostage'` is discounted **ZERO** — hostages are already off-stage. Anchored against a live positive control **in the same test** (a `visiting` holder on the same fixture DOES decay), so the negative cannot fail open. The away set is asserted to be `WHEREABOUTS_STATES` minus `hostage` **derived from the frozen export**, so a fifth roads state cannot silently escape. |
| A4 | Sparse / malformed-but-supported | `whereabouts` absent · `sinceTick` absent · `sinceTick` in the FUTURE (negative elapsed) · no `npcStates` row · `windowCount` 0 ⇒ risk exactly `0` and multiplier exactly `1` in all five. Never `NaN`, never negative, never `undefined`. |
| A5 | Ordering — THE DECLARED LAG | Drive the REAL pulse: mint a covert errand, advance one tick, assert the decay appears on the tick AFTER the whereabouts mirror is written, not the same tick — the uniform one-tick lag ES-5b declared and this wave inherits. |
| A6 | ⭐ Arm C — the carrier, both arms | No carrier ⇒ `gatherOrGovernRead(...).termsAbsent` is `['promotionRisk']` (the pin at `:756` survives). A finite carrier ⇒ `termsAbsent` is `[]` **and** the choice measurably shifts toward `govern` on a fixture where it was `gather`. A NEGATIVE CONTROL proves the empty array is not vacuous: the same fixture with the carrier omitted returns the non-empty list. |
| A7 | ⭐ THE DISCLOSED SHIFT — the golden pair | The ⟨F6⟩ pair: (i) a **dark** golden asserting byte-identity with the pre-change output on the same seed; (ii) a **lit** golden recording the NEW ladder output, whose header names the shift, its cause, and this packet. The lit golden is recorded ONCE, in this commit, with the cause stated (§9b) — never re-recorded silently. |

| A8 | ⭐ THE PREVENTION GUARD — the vacuous scan, repaired | The `ladderWriters` scan in `tests/domain/espionageProducts.test.js` is rewritten to match the REAL writer spelling and is proven non-vacuous by a plant: an espionage source carrying `setSpatialLedger(worldState, 'npcLadder', next)` makes the scan report that file, and the unplanted set reports `[]`. **Both arms, in the same test** — the exact shape the `writeErrands` half already uses at `:282-283`. This is what makes §3.14's "the ES module set writes NO ladder state" a fact rather than a sentence, in the first commit where the two families touch. |

No lifecycle round-trip case: this packet writes no state (§5). No privacy case: no receipt or
audience surface is minted (ES-7 owns the voice). No idempotency case: no state is written.

---

## 9b. THE DECLARED BEHAVIOR SHIFT — the implementer MUST measure it before editing

> **This packet changes lit-world simulation output.** `defenseScore` feeds **three** live
> decisions (`npcLadderChallenge.js:301`, `:302`, `:310`), so a discounted defense changes
> which challenges are attempted, at what rate, and which succeed — i.e. **ladder successions,
> the news they emit, and every downstream consumer of rung order.** It is a DISCLOSED,
> one-time shift under ⟨F6⟩, anticipated by name at `DESIGN_FP_ARCH_ES.md:1273-1274` — *"Dark
> worlds byte-identical; the lit shift disclosed under the same golden pair discipline as
> §3.11 (⟨F6⟩ the seam-row-6 precedent, not L9)."* **It is NOT a regression, and it may NOT
> ride silently.**
>
> **THE IMPLEMENTER'S OBLIGATION, before the first edit:** run the full gate at BASE and record
> which goldens and pins are green. Then, after the change, **enumerate every golden/pin that
> moved, name each one in the commit message, and state the cause.**
> ⛔ **Re-recording any golden without stating the cause is forbidden** (house non-negotiable 10).
> ⛔ **A golden that moves and is NOT on the enumerated list is STOP 7** — it means the reach
> went somewhere this packet did not measure.
>
> **Goldens and pins most likely to move — CANDIDATES, not a closed list; the implementer
> measures the real set (§10):**
> `tests/property/npcLadderDormancyGolden.test.js` ·
> `tests/property/contestedGoalsDormancyGolden.test.js` ·
> `tests/domain/npcLadderChallenge.test.js` ·
> `tests/domain/npcLadderKernel.test.js` · `tests/domain/npcLadderContest.test.js` ·
> `tests/domain/npcLadderSeatTransitions.test.js` · `tests/domain/npcLadderHeirs.test.js` ·
> `tests/domain/npcLadderCoherence.test.js` · `tests/domain/ladderRead.test.js` ·
> `tests/domain/espionageGauntlet.test.js` (manifest item 7 — an INTENDED move) ·
> `tests/perf/tickScanBudget.test.js` (a NEW per-defender read on the hot path — see §10).
> ⚠ Every *Dormancy* golden should be **unmoved**: they drive dark worlds, and a dark world is
> byte-identical. **A moved dormancy golden is STOP 7**, not a re-record — it means a flag gate
> leaked.
>
> ⚠ **`tests/domain/npcLadderChallenge.test.js:41-52` must survive UNCHANGED.** Its five
> assertions describe `defenseScore` with the flag dark; if the new term moves them, the dark
> path is not byte-identical and that is a STOP, not a pin edit.

---

## 10. Verification commands

```sh
cd /Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold

# Focused tests — acquire the one test slot in the SAME command. Never bare vitest.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/espionageCareer.test.js \
  tests/property/espionageCareerDormancy.test.js \
  tests/domain/npcLadderChallenge.test.js \
  tests/domain/npcLadderKernel.test.js \
  tests/domain/espionageGauntlet.test.js \
  tests/domain/espionageProducts.test.js

# The coupling ratchet — MUST stay green, licensed by the new CPL-20 row, NEVER baselined.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/couplingInclusion.walker.test.js \
  tests/lint/couplingDesk.walker.test.js \
  tests/domain/couplingRegistry.test.js

# The anchored-negative walker + the lighting census — BOTH move when new test files land.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/negativeAssertionAnchor.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js

# The scan-cost ratchet — a NEW per-defender read lands on the hot path.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/perf/tickScanBudget.test.js tests/perf/tickOpBudget.test.js

# Effective-line check on all three production files (read the COUNT in the message; never pipe for status).
npx eslint src/domain/worldPulse/espionage/espionageCareer.js \
  src/domain/worldPulse/npcLadderChallenge.js \
  src/domain/worldPulse/espionage/espionageGauntlet.js

# Both typecheckers, named per the two-typechecker receipt law.
sh scripts/gate-tail.sh npm run typecheck:domain:strict     # tsconfig.domain-strict.json
sh scripts/gate-tail.sh npm run typecheck:ratchet           # tsconfig.full.json

# Wave-end gate — NEVER through a pipe.
npm run check:tail
```

⚠ **A NAMED HOT-PATH RISK the implementer must measure, not discover.** `defenseScore` runs
once per adjacent rung pair, per faction, per settlement, per tick. `careerRiskFor` adds a
`whereabouts` read plus a `worldState.npcStates[nid]` lookup to each. In a **dark** world the
cost is one flag read (the `espionageActive` early return), so dark is free. In a **lit** world
it is real but linear per defender, so the `scanOps(S=8)/scanOps(S=4) <= 2.6` ratio should stay
flat — **but that is a prediction, not a measurement.** Run the perf pair at BASE and after.
⛔ If it reds, the cure is **NOT** a cache: memoising on world contents is the recorded OSR
resolver-state-identity hazard (no cache key may embed monotone contents). The cure is a STOP
and a chair conversation.

⚠ **THE LANDING DISCIPLINE (standing).** This packet mints **two new test files**, so the
change **must re-derive the sovereignty lighting census WHOLE — all five figures in one run,
never patching one.** Current row: **`2387/364/2023/19594/5535`**
(`sovereigntyLightingContract.walker.test.js:3495`, moved there by ES-5b's own two new test
files). Every negative in the two new files must be anchored; both start at an
un-anchored-negative ceiling of **ZERO**, and `tests/helpers/anchoredNegatives.js`
(`expectPresentThenAbsent`, `expectAbsentWithAnchor`) is preferred over the `// anchored:`
hatch wherever a negative has no structural control.

**AUTHOR-TIME-UNMEASURED baselines** — the implementer measures each at preflight, against the
BASE, **before the first edit**. Do **not** inherit a number from this packet.

| Figure | Status | Exact preflight command |
|---|---|---|
| Standing full-gate red at base | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run check` |
| `typecheck:ratchet` error count + ceiling | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run typecheck:ratchet` |
| `typecheck:domain:strict` count + ceiling | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run typecheck:domain:strict` |
| The GREEN-AT-BASE golden/pin set (the §9b denominator) | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run check` at BASE, then diff the pass list after |
| `tickScanBudget` scanOps ratio + `fallbacks` at base | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/perf/tickScanBudget.test.js` |
| Lighting census five figures | **AUTHOR-TIME-UNMEASURED** | re-derive ALL FIVE in one run; never patch `files` |
| `negativeAssertionAnchor` rows/sites | **AUTHOR-TIME-UNMEASURED** | `sh scripts/ratchet-inventory.sh negativeAssertionAnchor HEAD` |
| `couplingInclusion` pass count at base | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/couplingInclusion.walker.test.js` |
| The CPL-20 row's `receiptField` and `intendedDesk` | **AUTHOR-TIME-UNMEASURED** — the packet does **not** hand-key them (HAND-KEYED-ADDRESS ROT). The observable is the ladder challenge EVENT (`evt('rise'|'failed', …)`, `npcLadderChallenge.js:~312-320`) carrying `dEval.receipt.absenceDecay`; the address must be derived, not guessed, and must state in words that no persisted espionage receipt exists (ES-7 owns the voice). | Derive the live path a challenge event's receipt reaches in the pulse record; then run `tests/lint/couplingDesk.walker.test.js` — its `kind=` scan reads this string, and a row naming NO Herald kind (like ES-5b's) avoids the desk-routing join entirely. |
| Whether `round4` is exported from `espionageMath.js` | ⭐ **MEASURED — YES, `espionageMath.js:88`** (ES-5b's manifest item 2 landed it). Re-verify at preflight. | `grep -n "export function round4" src/domain/worldPulse/espionage/espionageMath.js` |

⚠ `npm run check` is a 17-step `&&` chain: a red step blacks out every later step, so the
receipt must say which steps actually **ran**.

---

## 11. Mandatory STOP conditions

Stop, without expanding or repairing, when:

1. Packet status is not READY (**it is DRAFT today — do not dispatch**).
2. HEAD is not `868aca1a` or an explicitly pinned, ancestry-verified descendant.
3. Any target file is dirty, or any ladder-family file (`npcLadderChallenge.js`,
   `npcLadderKernel.js`, `npcLadderContest.js`, `npcLadderState.js`) has a commit newer than
   `93e7ed50`, or any espionage file has one newer than `6c0238ad`.
4. `careerRiskFor`, `promotionRisk01For`, or `DEFENSE_WHEN_ABSENT` already exists (measured
   **zero** occurrences in `src/` and `tests/` at `868aca1a`); presence means another lane
   landed the grain.
5. `tests/lint/couplingInclusion.walker.test.js` reds. **Never add a baseline entry to green
   it.** The cure order is dependency inversion, then a registry row (§7), **never**
   baselining. A pair that neither can license is a STOP.
6. `npcAgency.js`, `settlementStrategy.js`, `roadsKernel.js`, `pulseKernel.js`, or
   `applyWorldPulse.js` would need **any** edit, or any `.size-baseline.json` entry would move.
   All five are EXACT ceilings with zero headroom.
7. **Any golden or pin moves that §9b did not name** — or any *Dormancy* golden moves at all,
   or `tests/domain/npcLadderChallenge.test.js:41-52` moves.
8. Any hard scope limit in §3 would be exceeded — in particular a **third** direct consumer or
   a **fourth** modified production file. Direct consumers sit at the cap today; that is a
   re-slice, not a renegotiation.
9. `npcLadderContest.js` or any other `npcLadder*` file beyond `npcLadderChallenge.js` would
   need editing (§0.3 — the margin is a tie-break only).
10. `tests/perf/tickScanBudget.test.js` or `tickOpBudget.test.js` reds (§10).
11. The lighting census cannot be re-derived WHOLE, or any new test file needs an
    un-anchored-negative ceiling row.
12. **Any open item in §13 is still open at dispatch.** O1–O5 are load-bearing; O2 in
    particular means the packet CANNOT be implemented as written until the chair authors
    `rungExposure01`'s derivation.

The STOP report carries the smallest measured contradiction, its evidence, and a proposed
split. No speculative repair.

---

## 12. Recorded deviations from the ES-5 / §3.14 charter

| # | Charter text | This packet | Why |
|---|---|---|---|
| **D1** | ES-5c = "THE CAREER CONSUMERS (§3.14)", both the register and the grade credit | **Register only** (arms A + C); the grade credit splits to **ES-5d** | Two behavior families against a limit of one, and the credit arm needs a named state writer the register arm does not (§3.1). The same reasoning CR-ES5B-1 already ratified for the ES-5a/b split. |
| **D2** | §3.14:1262-1264: "the ladder CONTEST math … rivals advance through the contest machinery that already runs every tick; **no new contest code**" | **FALSE as measured, and it names the WRONG FILE.** The composition lands in `npcLadderChallenge.js#defenseScore`, not `npcLadderContest.js` | `npcLadderContest.js` has no defense term at all; its symmetric `contestMargin` is consumed on ONE branch (convergent + both-fired), and the entire OPPOSED family — where "holder" and "raiser" actually live — never reads it (§0.3). `defenseScore` has the exact idiom, the inputs already in scope, and 628 lines of headroom. |
| **D3** | §3.14: "an absent holder defends weaker" | Only `defenseScore` is discounted; `challengeScore` is **untouched** | The design's sentence is about DEFENSE. A combatant is both defender and challenger in the same pass, so discounting both would be a second, unasked-for behavior. Recorded so the asymmetry is deliberate and visible. |
| **D4** | (no charter text) | `whereabouts.sinceTick` **holds a WEEK, not a tick** | `roadsKernel.js:359,492,1047` — written from `weekClock = calendar.elapsedWeeks`, the same clock `npcLadderKernel.js:418` reads. No conversion is needed and no `TICKS_PER_WEEK` constant exists in `src/domain/`. The field name is the only thing that lies; the leaf header must say so. |
| **D5** | ES-5b D5: `promotionRisk01Core` at `espionageMath.js:381` | Actual **`:401`** | Address rot (+20 lines) since ES-5b's compile. The chair's OTHER two addresses (`espionageGauntlet.js:400`, `espionageGauntlet.test.js:756`) are EXACT. |
| **D6** | ES-5b D6 put `ABSENT_W` in `ESPIONAGE_TUNING` and spent a modified-file slot on it | `DEFENSE_WHEN_ABSENT` lands in **`CHALLENGE_TUNING`**, and `espionageMath.js` is NOT modified | The opposite trade, deliberately: this constant multiplies a LADDER score and is the direct sibling of `DEFENSE_WHEN_CHALLENGING`, whereas ES-5b's was a weight inside an espionage ratio. The espionage single-home idiom is not forked — `PROMOTION_*` already live in `ESPIONAGE_TUNING` and are untouched. Open item **O4**. |
| **D8** | §3.14: "the ES module set writes NO ladder state (**scan-pinned**)", echoed by `couplingRegistryEspionage.js:266-268` ("the scan… **proves** it") | **The scan is VACUOUS and this packet repairs it** as its one prevention guard | It forbids three spellings that exist NOWHERE in `src/`, cannot see the real writer `setSpatialLedger(worldState, 'npcLadder', …)`, and carries no anti-vacuity plant though its own sibling scan does (§0.7). ES-5c opens the first ladder↔espionage import direction, so the guard becomes load-bearing in exactly this commit. |
| **D7** | CR-ES5B-7: "must flip `espionageGauntlet.js:400`'s declared-absent term" | Flipped **CARRIER-CONDITIONALLY**, not unconditionally | `gatherOrGovernRead` has **no caller** (§0.6, EXECUTED). An unconditional flip makes the term permanently `undefined ⇒ 0` — the exact "silent zero" its own docblock forbids — and leaves a trap for the wave that first wires the arm. The conditional form satisfies the ruling and stays honest. Open item **O3**. |

---

## 13. OPEN ITEMS — the chair closes each at promotion

⛔ **O2 is a hard blocker: the packet cannot be implemented as written until it is closed.**

| # | Item | Recommendation |
|---:|---|---|
| **O1** | **The composition site moves from `npcLadderContest.js` (which the design names) to `npcLadderChallenge.js#defenseScore` (which has the machinery).** §3.14's "no new contest code" is false — the third such false reach claim in this volume. | **ACCEPT the move.** The measurement is decisive (§0.3): the named file has no defense term and its symmetric margin is read on one branch, while the unnamed file already carries the exact multiplicative-weakening idiom at `:145-147`, holds `d.npc` and `ctx.worldState` with zero signature change, drives three live decisions, and has 628 lines of headroom. The alternative — compose at `contestMargin` — is a four-surface signature cascade delivering a term that fires only when two rivals' goals fire the same week. Amend §3.14 in the promotion commit (manifest item 8). |
| **O2** | ⛔ **`rungExposure01` has NO SOURCE anywhere in `src/`** — one of `promotionRisk01Core`'s three inputs cannot be supplied, and it carries 0.5 of the pressure term. An implementer must not author it (the CR-ES5B-6 principle). | **The chair authors the derivation.** The lane recommends deriving it from the ladder's **own** vulnerability vocabulary: `openWindows` (`npcLadderChallenge.js:158`) returns a closed 8-member list of window reasons, one of which is literally **`contested_goal`** — so `rungExposure01 = clamp01(windows.length / N)` is "contested rungs decay faster" **in the file's own terms**, derived rather than invented, and it is already computed at the exact site (`:296`, before `defenseScore` at `:300`) at zero extra cost. The chair sets `N` (the lane notes the vocabulary has 8 members and that `openWindows` returning `[]` short-circuits the whole pass at `:297`, so the reachable range is 1..8). **Alternative:** declare `rungExposure01` ABSENT with a receipt (the SP-C idiom) and ship the register at half strength — the lane recommends AGAINST, because a register the design calls the "govern" half would then narrate a risk half its machinery does not deliver. |
| **O3** | **Arm C's subject `gatherOrGovernRead` has NO CALLER**, so an unconditional flip mints the silent zero its own docblock forbids (§0.6). | **ACCEPT the carrier-conditional form** (D7, §6.4), on the EP-q CARRIER-CONDITIONAL precedent. It satisfies CR-ES5B-7 literally (the term flips, and case A6 proves the flip reachable with a negative control) while keeping the declared-absence honest for the no-carrier path that is, today, the only path. **Alternative:** drop Arm C from ES-5c entirely and re-park it until the arm is wired — the lane recommends against, because CR-ES5B-7 named it and the conditional form costs ≤ 10 lines. |
| **O4** | `DEFENSE_WHEN_ABSENT`'s **home and value**. The lane places it in `CHALLENGE_TUNING` (D6) and does **not** author the value. | **Confirm the home; the chair authors the value.** Home: it multiplies a ladder score and is `DEFENSE_WHEN_CHALLENGING`'s direct sibling, so `CHALLENGE_TUNING` keeps both the ladder's and the espionage family's single-home idioms intact and leaves the third modified-file slot unspent. Value: chair-authored DARK tuning under CR-ES5B-6, individually vetoable, owner-signed at soak; the lane supplies the parity evidence in §6.3 and explicitly notes the espionage `0.5` parity does NOT transfer. ⛔ The implementer may not tune it. |
| **O5** | **ARM B (`freshMissionGradeFor` → the ladder's maintenance road) does not fit and is split to ES-5d** (§3.1, D1). | **ACCEPT the split and slot ES-5d.** Two families and a state writer cannot ride one packet, and the credit arm is J-ES-17's own handoff with its own gate (`npcLadderActive`), its own degraded-dark rule ("the grade stays a receipt"), and its own writer discipline ("the ladder's OWN writers write; the ES module set writes NO ladder state — scan-pinned"). §3.1b records what ES-5d faces. Compile it just-in-time after ES-5c lands, per CR-ES5B-7's own precedent. |
| **O7** | ⭐ **The `ladderWriters` scan is vacuous (§0.7, D8), and ES-5c is the commit that makes it matter.** Repairing it is test-only but it is not what the charter asked for. | **ACCEPT it as this packet's one prevention guard** (PACKET_STANDARD.md:113). The alternative — land the first ladder↔espionage edge while the guard that is supposed to police that exact boundary matches three identifiers that exist nowhere — is the worse trade by a wide margin, and the repair is ~6 test lines with a plant already modelled twelve lines below it in the same file. ⛔ If the chair prefers to split it, it must land BEFORE ES-5c, not after: after is a guard written to fit the code it was meant to constrain. |
| **O6** | D3/§6.2: the reach is a **stamp** on the `Combatant` record rather than a `defenseScore` signature change; and only `defenseScore` is discounted, not `challengeScore`. | **Confirm both.** The stamp is the file's own idiom (`isChallenging` at `:286`) and leaves the exported signature and its pins (`npcLadderChallenge.test.js:41-52`) untouched. Discounting only the defense follows §3.14's sentence exactly; discounting the challenge too would be a second behavior nothing asks for. Both vetoable in one clause. |

---

## 13b. Chair rulings at the READY flip (2026-08-11) — all seven items CLOSED

Fable-issued; implementing them owes no post-boundary row. The implementer reopens none.

- **O1 ACCEPTED — the composition site moves to `npcLadderChallenge.js#defenseScore`.**
  The measurement is decisive and §3.14's "no new contest code" is FALSE: the named file
  has no defense term, its margin is symmetric, and the OPPOSED branch never reads it.
  The unnamed file already carries the exact multiplicative-weakening idiom, holds
  `d.npc` and `ctx.worldState` with ZERO signature change, drives three live decisions,
  and has 628 lines of headroom. **This is the third false reach-claim measured in this
  volume** (after §3.11's twice) — amend §3.14 in the promotion commit, in the
  amended-in-place voice.
- **⛔ O2 DISCHARGED — the chair authors the derivation, and the span is PINNED to its
  producer.** `rungExposure01 = clamp01(windows.length / T.RUNG_EXPOSURE_WINDOW_SPAN)`,
  computed from the `openWindows` array **already built at `:296`**, four lines before
  `defenseScore` — zero extra cost, and "contested rungs decay faster" stated in the
  file's own vocabulary rather than invented.
  **`RUNG_EXPOSURE_WINDOW_SPAN: 8`** in `CHALLENGE_TUNING`. ⚠⚠ **The literal 8 MUST carry
  a producer-equality pin** asserting it equals the number of distinct reasons
  `openWindows` can push — the TC-4 catalog-canary pattern (CR-TC4-O2-R1), so a
  ninth window reason becomes a VISIBLE red instead of a silently compressed exposure.
  Tests may import anything; derive the count there, never restate it.
  ⛔ The half-strength ABSENT alternative is REJECTED: a register the design calls the
  "govern" half must not narrate a risk half its machinery does not deliver.
- **O3 ACCEPTED — carrier-conditional** (the EP-q precedent), with A6 proving the flip
  reachable against a negative control.
- **O4 — home CONFIRMED, value AUTHORED: `DEFENSE_WHEN_ABSENT: 0.5` in
  `CHALLENGE_TUNING`.** Ruled from its own sibling, not from espionage: the family's
  `DEFENSE_WHEN_CHALLENGING` is `0.6` for a defender DIVIDED by challenging elsewhere,
  and **physical absence must weaken defense STRICTLY MORE than divided attention — you
  cannot work a room you are not in** — so the value sits one step below it on the
  family's own grid. ⚠ It arrives at `0.5` by a DIFFERENT route than ES-5b's `ABSENT_W`;
  the coincidence is not a transfer, and neither may be tuned to match the other.
  Chair-authored DARK tuning: individually vetoable, owner-signed at soak. ⛔ The
  implementer may not tune it.
- **O5 ACCEPTED — arm B splits to ES-5d**, compiled just-in-time after ES-5c lands. Its
  substrate is fiction today: `momentum` is ZERO matches family-wide, `maintainMarks`
  never writes `stock`, no stock writer takes external input, and the grade is never
  persisted. ES-5d must BUILD four things.
- **O6 CONFIRMED both** — the `Combatant` stamp is the file's own idiom and leaves the
  exported signature and its pins untouched; discounting only `defenseScore` follows
  §3.14's sentence exactly, and discounting `challengeScore` too would be a second
  behavior nothing asks for.
- **⭐ O7 ACCEPTED IN-PACKET as the one prevention guard.** The `ladderWriters` scan
  forbids three spellings that exist NOWHERE in `src/` while the real writer
  (`setSpatialLedger(worldState, 'npcLadder', …)`) goes unguarded — and ES-3's registry
  docstring CITES that pin as proof. ES-5c opens the FIRST ladder↔espionage edge, so it
  repairs the guard that polices exactly that boundary, WITH a plant mirroring the
  `writeErrands` sibling twelve lines below. ⛔ Splitting it is refused: landing after
  ES-5c would be a guard written to fit the code it was meant to constrain.

**Standing landing discipline, binding on this packet:** it mandates TWO new test files,
so the change must ALSO re-derive the sovereignty lighting census WHOLE (all five figures
in one run, never patching one — current row `2387/364/2023/19594/5535`) and anchor every
negative in both new files (a new file starts at an un-anchored-negative ceiling of ZERO;
prefer `tests/helpers/anchoredNegatives.js` where no structural control exists, and read
the rendered-surface vacuity note before writing a denial against a render).

## 14. Marking-law note for the chair

Per the marking law at the `33aeea35` boundary, authoring a packet from a Fable-issued design
owes no queue row, and **this DRAFT lane appends nothing**. **Four items here go beyond that**
and in the compiling lane's judgment **owe a row at promotion**:

1. **§0.3 / D2 — §3.14's "no new contest code" is FALSE and names the wrong file.** A design
   volume's own reach claim refuted at source, for the third time in this volume, with the
   composition relocated to a file the design never mentions. This is the finding that decides
   the packet's shape.
2. **§3.1 / D1 / O5 — the ES-5c → ES-5c + ES-5d split.** A second wave boundary no design
   document contains, derived from a measured budget overflow.
3. **§0.4 / O2 — `rungExposure01` has no source in the estate**, so a term the register folds
   at half weight must be authored by the chair before the packet is implementable.
4. **§0.6 / D7 / O3 — CR-ES5B-7's mandated flip lands on a function with no caller**, and the
   literal flip would mint the silent zero the target's own docblock forbids. A chair ruling
   amended by measurement.
5. **§0.7 / D8 / O7 — the "scan-pinned" guarantee behind §3.14 and behind ES-3's registry
   docstring is VACUOUS.** A shipped guard measured to forbid three identifiers that exist
   nowhere in the tree, blind to the real writer spelling, with no anti-vacuity control though
   its own sibling has one. It is repaired here rather than re-found later.
6. **§3.1b — §3.14's "standing/momentum credit" names a field (`momentum`) that DOES NOT
   EXIST** on `LadderStanding`, and the "existing maintenance road" carries no stock-credit
   seam. This is what forces the ES-5d split and it refutes a second design reach claim in the
   same section.

Also worth a row in the lane's judgment, though smaller: **`docs/implementation/INDEX.md:107`
is STALE** — it still reads "ES-5b waits on insertion/order reconciliation" though ES-5b
landed at `6c0238ad`.
