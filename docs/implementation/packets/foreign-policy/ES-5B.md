# `ESPIONAGE / ES-5b` — implementation contract (REVISION 2)

- **Status:** LANDED
- **Landed:** `6c0238ad` (2026-08-11) — four recorded deviations, zero moved goldens, full gate exit 0
- **Status note:** promoted from rev 2 by the chair 2026-08-11 (supersedes
  `es5b-packet-draft-ES-5B.md`, rev 1 at `46357c94`). Rev 1's seven open items were
  closed in-text by CR-ES5B-1..7 and CR-ES5B-5-R2; §13b closes the last two.
- **Compiled:** 2026-08-11 by the ES-5b author lane (revision).
- **Verified base:** `claude/composite-r4` at `2d420dfafd9e8f92db5deca124cc2353c0073588`
- **Base note:** `git merge-base --is-ancestor 46357c94… HEAD` = **0** (EXECUTED), and
  `git diff --stat 46357c94 HEAD` over every file this packet names is **EMPTY** —
  rev 1's measurements are re-verified, not inherited.
- **Packet law:** [`PACKET_STANDARD.md`](../PACKET_STANDARD.md)

---

## 0. THE BLOCKER, RECONCILED — AND THE BLOCK THAT WAS LIFTED

`docs/implementation/INDEX.md:106` reads, verbatim: *"ES-5b waits on
insertion/order reconciliation."* That sentence decomposes into **three**
distinct claims. Two are real and still true at HEAD; one dissolves.

### 0.1 INSERTION — documentary, REAL, chair-owned, no product decision

The literal antecedent is `docs/DESIGN_FP_ARCH_ES.md:1631`, whose clause is
headed **"§5 THE WAVES — insertion:"**. That clause places the ES waves into
the compiled volume's §5 ORDER, and it was written when ES-5 was ONE wave.

**ES-5b exists only in a commit message.** The a/b slice was taken as a
vetoable JUDGMENT inside the ES-5a landing commit `41ddeae0`:

> "So this is ES-5a — DOCTRINE ENGAGED — and ES-5b carries the amendment with
> both grains and its golden pair. JUDGMENT, vetoable in one clause; the veto
> asks for one commit."

Neither design volume was amended. Measured at HEAD:

| Site | Says | Post-slice truth |
|---|---|---|
| `DESIGN_FP_ARCHITECTURE.md:827` | "§5 THE WAVES (108 waves…)" | 109 |
| `DESIGN_FP_ARCHITECTURE.md:840` | "inserts **eight** ES waves" | nine |
| `DESIGN_FP_ARCHITECTURE.md:1372` | `ES-5` row carries doctrine **and** the absence amendment as one wave | doctrine half LANDED at `41ddeae0` |
| `DESIGN_FP_ARCH_ES.md:1495` | `ES-5` charter, both grains, one wave | same |
| `DESIGN_FP_ARCH_ES.md:1577` | "**Wave count: 8.**" | 9 |
| `DESIGN_FP_ARCH_ES.md:1650` | "ES-5/ES-6 follow" | no ES-5b row |
| `DESIGN_FP_ARCH_ES.md:1653` | "The wave count amends 60 → 68" | 60 → 69 |

`grep -rn "ES-5b" docs/` (excluding `docs/archive`) returns **exactly two
hits, both pointers rather than charters** — `INDEX.md:106` and
`SOL_QUEUE.md:95`. **ES-5b has no charter of its own anywhere in the design
corpus.** That is the insertion blocker; it is entirely documentary.

**CLOSED by CR-ES5B-1 (chair, 2026-08-11): RATIFY the slice, and amend all
seven stale sites in the promotion commit. A wave that exists only in a commit
message is not a charter — this packet becomes it.** The seven amendments are
carried as manifest item 7 (§8).

### 0.2 ORDER — code, REAL, and it RESOLVES to a declared one-tick lag

`presentShare01`'s two inputs are written at **opposite ends of one tick**,
and every consumer sits between them. Measured in `pulseKernel.js`
(a strictly sequential function body — line order is execution order), all
line numbers re-verified at `2d420dfa`:

| # | Event | Site | Pulse stage |
|---:|---|---|---|
| 1 | `seatNpcsIntoFactions` **writes `memberNpcIds`** | `pulseKernel.js:346` → `factionCompetition.js:449` | `actor_memory` |
| 2 | `advanceSettlementPolitics` — **bloc consumer A** | `pulseKernel.js:380` | `actor_memory` |
| 3 | `evaluateWorldPulseRules` → `candidateEvents.js:517` → `evaluateFactionRules` — **NEW consumer C (this revision)** | `pulseKernel.js:1375` | rules roll |
| 4 | `advanceEnvoyErrands` — **creates the absence** | `pulseKernel.js:2031` → `envoyPulse.js:201` | `consequence_fold` |
| 5 | `advanceNpcLadder` (holds `rulingBlocOf` at `npcLadderKernel.js:554`) — **bloc consumer B** | `roadsKernel.js:1191`, inside `pulseKernel.js:2563` | `consequence_fold` |
| 6 | `advanceRoads` **writes `npc.whereabouts`** — the SOLE per-tick writer | `roadsKernel.js:1074` | `consequence_fold` |

**The conflict:** `memberNpcIds` is fresh at step 1; `whereabouts` is not
written until step 6. **All three** consumers (steps 2, 3, 5) read the mirror
before this tick's write, so all three see LAST tick's whereabouts.

**The resolution — and the revision's own check:** adding consumer C at step 3
does **not** introduce a divergence. It lands strictly between steps 1 and 6,
exactly like A and B, so the lag stays **UNIFORM at exactly one tick for every
consumer**. Moving a consumer later is not available: FP L1 and
`DESIGN_FP_ARCH_ES.md:1579` state *"No wave edits pulseKernel.js or
applyWorldPulse.js (banked, zero headroom — L1)."*

**CLOSED by CR-ES5B-2: ACCEPT the one-tick lag, DECLARED AND PINNED.** It is
uniform and forced; an undeclared lag is the bug, not the lag. §3.11's own
parenthesis already anticipates it — *"the whereabouts mirror is self-healing,
rewritten from the ledger each tick."* Stated in the leaf header; pinned by
case A5.

### 0.3 VOCABULARY — DISSOLVES

ES-5a's landing commit recorded, as divergence #4, *"§3.11's whereabouts
vocabulary (`traveling|visiting|returning`) is not the tree's… ES-5b's
business."* **That divergence does not survive measurement.**

- `src/domain/roads/state.js:122` exports a frozen totality:
  `export const WHEREABOUTS_STATES = Object.freeze(['traveling', 'visiting', 'returning', 'hostage']);`
- It matches the `Whereabouts` typedef at `state.js:114` exactly.
- §3.11's set is precisely `WHEREABOUTS_STATES` minus `hostage` — and §3.11
  already excludes hostages by name (*"hostages are already off-stage —
  unchanged"*).
- The six-member list ES-5a measured lives at `envoyCasting.js:101`. It is a
  **defensive superset** for a different question (roster availability): it
  also accepts `outbound`, the British `travelling`, and reads
  `whereabouts.phase` — a field `settlement.schema.js:451` does not define on
  `whereabouts`. `outbound` is a roads **mission phase**, mapped to
  `traveling` at `roadsKernel.js:1045` before it ever reaches `whereabouts`.

⇒ **§3.11's vocabulary is correct against the authoritative export.** ES-5b
imports `WHEREABOUTS_STATES` and becomes its **first consumer** — re-measured
at `2d420dfa`: `grep -rn "WHEREABOUTS_STATES" src/ tests/` returns **the
definition line and nothing else** (CONFIRMED).

### 0.4 THE CHAIR'S BLOCK, AND ITS RETRACTION — CR-ES5B-5-R2

Rev 1 was **BLOCKED** by CR-ES5B-5 on the belief that inserting at
`rulingBlocOf` would wire the carved-out war chooser. A measurement lane
refuted that on three counts, each verified at source, and **CR-ES5B-5-R2
lifted the gate**. The block is recorded, not rewritten; the refutation is
carried here so the promoted packet is self-contained.

1. **Section boundaries: §3.11 = 1103–1156, §3.12 = 1157–1193.** The "NOTHING
   touches the chooser" text at `DESIGN_FP_ARCH_ES.md:1189-1192` lives in
   **§3.12 SPY-BEFORE-DECISION**, its subject is `deliberationRead`, and it is
   **CR-ES-4 answering Q4** — not a `presentShare01` ruling at all. A
   carve-out from a NEIGHBOURING section was read as governing this one.
2. **`DESIGN_FP_ARCH_ES.md:1123-1128` names the wire BY NAME as authorised** —
   verbatim: *"applied as a multiplier where `rulingBlocOf`/`blocDecisionFactor`
   weigh that faction — in a LAZY LEAF consumed at the existing bloc-read sites,
   gated `espionageActive` BY NAME, so: dark worlds … are BYTE-IDENTICAL, and
   the one-time bloc-math shift in a lit world is DISCLOSED"*. The shift is
   ANTICIPATED in the same sentence, and `blocDecisionFactor`'s sole consumer IS
   the chooser (`settlementStrategy.js:1223` — measured, §5).
3. **"NOTHING touches the chooser" is a NO-EDIT law, AND IT IS SCOPED TO IN-4
   BY NAME.** Read in full at `DESIGN_FP_ARCH_IN.md:483-485` (EXECUTED):
   *"no chooser edits (settlementStrategy is AT its 812 baseline — any
   strategy-side read lands in a leaf it imports… it does not: **NOTHING in
   IN-4 touches the chooser**; recorded)."* It is a **file-budget clause inside
   IN-4's own Files list**, and its subject is IN-4. Verified: the ONLY
   `scripts/.size-baseline.json` entry anywhere in this packet's neighbourhood
   is `src/domain/worldPulse/settlementStrategy.js` → **812** (EXECUTED). ES-5b
   edits **zero** lines there and adds **zero** wires — `blocDecisionFactor` was
   already wired by W-DOCTRINE-4. **A no-EDIT law is not a no-VALUE-CHANGE
   law**, and a clause that names its own wave is not an estate-wide carve-out.

⇒ **Reaching the chooser through the existing `blocDecisionFactor` wire is
AUTHORISED.** The consequence is not hidden: it is declared in §9b.

### 0.5 THE REAL DEFECT — §3.11's "no further code" is FALSE, and rev 1 made it worse

`DESIGN_FP_ARCH_ES.md:1141-1144` claims, verbatim: *"Rivals exploit the window
through machinery that already exists: the ladder's contest math and
factionCompetition read the same bloc weights every tick — a lightened faction
IS the two-books texture with no further code."* **Measured at `2d420dfa`,
that sentence is false on both halves:**

| §3.11's claim | Measured | Evidence |
|---|---|---|
| "factionCompetition read[s] the same bloc weights" | `factionCompetition.js` does **not** import `settlementPolitics.js` at all, and holds **zero** bloc tokens | `grep -n "^import" src/domain/worldPulse/factionCompetition.js` — **eight** import statements, none of them `settlementPolitics.js`; `grep -c "rulingBloc\|blocDecisionFactor\|coalitionConsolidation01\|settlementPolitics" src/domain/worldPulse/factionCompetition.js` → **0** (EXECUTED at `2d420dfa`) |
| "the ladder's contest math [reads] the same bloc weights" | the ladder reads a **BOOLEAN**, not a weight | `npcLadderKernel.js:554` computes `rulingBloc`; the only downstream read is `npcLadderKernel.js:682`, `const blocBacked = politicalWindowsLit && rulingBloc != null && …isGoverning === true`. The `consolidation` NUMBER is never read. Inert except at a floor crossing. |
| "with no further code" | the ES-5 charter itself budgets the code | `DESIGN_FP_ARCH_ES.md:1506-1514`: *"settlementPolitics (1043) and factionCompetition (996) gain ≤ 10 composition lines **each** (both war-adjacent — CHECK-GIT-FIRST …)"* |

**The reach was to be BUILT.** Rev 1's recorded deviation **D2 dropped the
`factionCompetition` edit** on two reasons that this revision re-measures and
finds insufficient (§12). As drafted, rev 1 would have delivered **almost none
of §3.11's intended reach** — the ladder gets a boolean that only moves at a
floor crossing, the corruption web and seat books get a consolidation nudge —
**while still flipping war-move selection** (§9b). That is the worst possible
trade: the whole disclosed cost, almost none of the designed benefit.

**This revision restores the budgeted reach.** §6.3 specifies the composition
against live code; §8 manifest item 3 builds it.

### 0.6 Verdict

The blocker is REAL. 0.3 dissolves; 0.1 is closed by CR-ES5B-1; 0.2 resolves
to a forced, declarable answer accepted by CR-ES5B-2; the CR-ES5B-5 gate is
lifted by R2. ES-5b is **reconcilable and, with the restored reach, it FITS
its budget** (§3) as the bench grain, with the career grain split to ES-5c.

---

## 1. Reconciled authority

1. **Live git at `2d420dfa`** — existence authority.
2. **CR-ES-1 (SIGNED)** — the Roads §1 law 5 amendment.
   `DESIGN_FP_ARCHITECTURE.md:1373` records *"the absence arm rides CR-ES-1,
   SIGNED"*; the owner blanket queue sign-off (2026-08-05) covers it and it is
   in none of the four carve-outs. **CR-ES5B-3: ONE CR-ES-1 signature covers
   ES-5b and ES-5c** — the same doctrine, split for budget, not for scope.
   ES-5c is **not** re-gated.
3. **`DESIGN_FP_ARCH_ES.md` §3.11** (J-ES-9, lines 1103–1156) — the bench
   grain's law, INCLUDING its `factionCompetition` reach at :1141-1144.
4. **`DESIGN_FP_ARCH_ES.md` :1506-1514** — the ES-5 charter's file budgets.
5. **CR-ES5B-1..7 and CR-ES5B-5-R2** (chair, 2026-08-11) — folded into this
   text at §0.1, §0.2, §1.2, §0.4, §6.2, §7, §13.
6. **PACKET_STANDARD.md :118-158** — budget, acceptance cap, STOP law.
7. The ES-5a landing commit `41ddeae0` supplies the slice, not a charter.

**Unreconciled and therefore excluded:** nothing.

---

## 2. Outcome

Under `espionageEnabled`, a faction's **weight in the court** is discounted by
its absent members' share, at **both** of the places the design names:

1. the **council bench** — `rulingBlocOf`'s power sum, which is the chokepoint
   feeding `coalitionConsolidation01`, `blocDecisionFactor` and the ladder's
   `blocBacked` boolean; and
2. the **contest math** — `factionCompetition`'s per-faction contest weight,
   which feeds all four faction-rule severities.

`isOffStage` is untouched. Dark worlds — including roads-lit, espionage-dark
worlds — are **byte-identical** (measured control: the identity discount
`s ≡ 1` reproduces base output exactly, probe 6). The lit shift is a
**disclosed** one-time bloc-math move under ⟨F6⟩ (FP §9 seam row 6), declared
in §9b and fenced by its own golden pair.

`memberNpcIds` gets its first reader. Written every tick since it was minted
(`factionCompetition.js:449`, comment at `:418` — *"so faction power can read
its roster"*), it is read by **nothing** in `src/` at HEAD. EXECUTED
`grep -rn "memberNpcIds" src/` at `2d420dfa` returns exactly three hits and no
reader: the writer (`factionCompetition.js:449`), its comment (`:418`), and one
empty initializer at **`src/domain/events/mutateEntities.js:372`**. §3.11's
census-1-H2 premise **HOLDS at `2d420dfa`** (CONFIRMED).

---

## 3. Hard scope budget — RE-MEASURED against PACKET_STANDARD, and it FITS

### 3.1 The split that was already taken (unchanged)

**ES-5 as chartered does not fit.** Both grains would modify **five** existing
logic-bearing production files — `settlementPolitics.js`,
`factionCompetition.js`, `npcLadderContest.js`, `npcLadderKernel.js`,
`espionageGauntlet.js` — against a limit of three, and carry **two** behavior
families against a limit of one.

- **ES-5b (this packet) — THE BENCH.** `presentShare01` + the council-weight
  discount + the contest-weight discount. **One behavior family** (an absent
  faction weighs less), **two consumption sites**.
- **ES-5c (not compiled) — THE CAREER.** `promotionRisk01Core` into the ladder
  contest math, and the flip of the gauntlet's declared-absent `promotionRisk`
  term. **CR-ES5B-7: compile only after ES-5b LANDS** (just-in-time; no second
  stale backlog).

### 3.2 Rev 1 undercounted the cap. The real caps, quoted

`PACKET_STANDARD.md:118-144` (EXECUTED read) — rev 1's §3 wrote "one direct
production consumer" and "one existing production file modified". **Those are
rev 1's self-imposed numbers, not the standard's.** The standard says:

> - one behavior family; … at most **two direct production consumers**; at most
>   **two new logic-bearing production leaves**; at most **three existing
>   logic-bearing production files modified**; at most **three additional
>   registration-only production files touched**; at most **twelve handwritten
>   files** total, including tests and guards; at most **400** new or changed
>   effective production lines; each new production leaf at most **250**
>   effective lines; **each shared or hot-file delta at most 15 effective
>   lines**; at most **eight** named acceptance cases.

### 3.3 This packet against those caps

| Limit | Cap | This packet | Head-room |
|---|---:|---:|---|
| Behavior families | 1 | **1** — "an absent faction weighs less" | at cap |
| New persisted record families | 1 | **0** | — |
| Named writers for changed state | 1 | **0** (writes no state) | — |
| Feature flags | 1 | **0 new** (rides `espionageEnabled`) | — |
| User-facing surfaces | 1 | **0** | — |
| Direct production consumers | 2 | **2** — `settlementPolitics.js`, `factionCompetition.js` | **at cap** |
| New logic-bearing leaves | 2 | **1** — `espionagePresence.js` | 1 |
| Existing logic-bearing files modified | 3 | **3** — `settlementPolitics.js`, `factionCompetition.js`, `espionageMath.js` | **at cap** |
| Registration-only files touched | 3 | **1** — `couplingRegistryEspionage.js` | 2 |
| Handwritten files | 12 | **7** (leaf + 3 modified + registry + 2 tests) | 5 |
| New/changed effective production lines | 400 | **≈ 177** (leaf ≤ 120 · 10 · 15 · 2 · registry ≈ 30) | ~223 |
| New leaf effective lines | 250 | **≤ 120** (the charter's own bloc-leaf budget) | 130 |
| Shared/hot-file delta | 15 each | **≤ 10** fC · **≤ 15** sP · **≤ 2** eM | at/under |
| Acceptance cases | 8 | **8** | at cap |

**⇒ NO FURTHER SPLIT IS REQUIRED.** The restored `factionCompetition` edit
fits, and it puts the packet **exactly at** two of the caps (direct consumers,
existing files modified). That is stated so a later scope creep is visibly a
STOP and not a line: **anything that would add a fourth modified production
file or a third direct consumer is a re-slice, never a renegotiated cap**
(STOP 9).

⚠ **The third file slot is spent on ONE tuning key.** `espionageMath.js` is
modified only to add `ABSENT_W` to `ESPIONAGE_TUNING` and to `export` the
`round4` helper it already defines privately at `:80`. That is a deliberate
call with a stated reason (§6.2 and §12 D6): the family's own docblock at
`espionageMath.js:124-127` says `ESPIONAGE_TUNING` is *"EVERY CONSTANT THE
ESPIONAGE ARITHMETIC READS, in one frozen export (the house idiom)"*, and
authoring the amendment's weight anywhere else forks that home.

### 3.4 Measured effective line counts (EXECUTED at `2d420dfa`)

```sh
npx eslint <files> --rule '{"max-lines":["error",{"max":1,"skipBlankLines":true,"skipComments":true}]}' --format json
```

| File | Effective | Ceiling | Headroom | Δ this packet | After |
|---|---:|---:|---:|---:|---:|
| `settlementPolitics.js` | 558 | 800 (domain default) | 242 | ≤ 15 | ≤ 573 |
| `factionCompetition.js` | **752** | 800 | **48** ⚠ | ≤ 10 | **≤ 762** |
| `espionageMath.js` | 162 | 800 | 638 | ≤ 2 | ≤ 164 |
| `couplingRegistryEspionage.js` | 131 | 800 | 669 | ≤ 30 | ≤ 161 |
| `npcLadderContest.js` | 531 | 800 | 269 | 0 | 531 |
| `npcLadderKernel.js` | 577 | 800 | 223 | 0 | 577 |
| `npcLadderState.js` | 604 | 800 | 196 | 0 | 604 |
| `candidateEvents.js` | 533 | 800 | 267 | 0 | 533 |
| `roads/state.js` | 287 | 800 | 513 | 0 | 287 |
| `settlementStrategy.js` | — | **812 EXACT** (`scripts/.size-baseline.json`) | — | **0** | unchanged |

**`scripts/.size-baseline.json` carries exactly one entry among these files:
`src/domain/worldPulse/settlementStrategy.js` → 812** (EXECUTED). Every other
file above rides the 800-line domain ratchet. ⚠ The ES-5 charter's figures
("settlementPolitics (1043)", "factionCompetition (996)") are **raw `wc -l`**
and the charter says so; `skipComments` is ON, so they are not headroom.

⚠ **`factionCompetition.js` has 48 effective lines of headroom.** A ≤ 10-line
composition leaves ~38. That is enough, and it is the reason §6.3's
composition is specified line-by-line rather than left to the implementer.

---

## 4. Sealed dispatch and preflight

```sh
cd /Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold
git rev-parse --abbrev-ref HEAD                 # expect claude/composite-r4
git rev-parse HEAD                              # expect 2d420dfa… or a pinned descendant
git merge-base --is-ancestor 2d420dfafd9e8f92db5deca124cc2353c0073588 HEAD; echo $?   # expect 0
git status --porcelain                          # every target file MUST be clean
git log --oneline -3 -- src/domain/worldPulse/factionCompetition.js \
  src/domain/worldPulse/settlementPolitics.js \
  src/domain/worldPulse/npcLadderKernel.js src/domain/worldPulse/npcLadderContest.js \
  src/domain/worldPulse/npcLadderState.js     # CHECK-GIT-FIRST, per the ES-5 charter
```

**CHECK-GIT-FIRST result at compile time (EXECUTED, `2d420dfa`):** the newest
commit touching any of the five collision-surface files is `93e7ed50` ("repair
observed contracts and faction identity"), then `173e9d7b`, then `9ecec2a2` —
**all ancestors of `46357c94`**, i.e. none of them landed during or after rev
1's compilation. `git diff --stat 46357c94 HEAD` over the full target set is
EMPTY. **No collision.** Re-run at dispatch; a newer commit on any of the five
is STOP 3.

**⚠ FOREIGN WORK RESERVED — do not touch, stage, restore, or attribute.**
`git status --porcelain` was **empty** at this revision's compile time, but a
read-only UI-triage lane is live in this tree and rev 1 watched the dirty set
grow *during its own compilation*. Treat any dirty or untracked path at
dispatch as foreign unless it is in §8's manifest.

Required live symbols (verify each before editing; navigate by symbol, never
by the line numbers quoted here):

| Symbol | Home |
|---|---|
| `espionageActive` | `src/domain/worldPulse/espionage/espionageGate.js:75` |
| `ESPIONAGE_TUNING` | `src/domain/worldPulse/espionage/espionageMath.js:128` |
| `round4` (private today) | `src/domain/worldPulse/espionage/espionageMath.js:80` |
| `WHEREABOUTS_STATES` | `src/domain/roads/state.js:122` |
| `npcId` | `src/domain/worldPulse/npcAgency.js:193` |
| `stablePart` | `src/domain/worldPulse/worldState.js` |
| `seatNpcsIntoFactions` | `src/domain/worldPulse/factionCompetition.js:420` |
| `topFactionEntries` (private) | `src/domain/worldPulse/factionCompetition.js:171` |
| `evaluateFactionRules` | `src/domain/worldPulse/factionCompetition.js:898` (entries built at `:919`) |
| `rulingBlocOf` | `src/domain/worldPulse/settlementPolitics.js:541` (power sum at `:549-556`) |
| `coalitionConsolidation01` | `src/domain/worldPulse/settlementPolitics.js:579` |
| `blocDecisionFactor` | `src/domain/worldPulse/settlementPolitics.js:596` |

---

## 5. Verified tree contract

- **State authority:** `worldState.factionStates[fid].memberNpcIds` (roster)
  and `settlement.npcs[].whereabouts.state` (mirror). ES-5b writes **NEITHER**.
- ⚠ **The mirror is NOT on `npcStates`.** Measured: `grep -rn "whereabouts"
  src/domain/worldPulse/npcAgency.js` returns **zero hits**. `whereabouts`
  lives only on the settlement roster entries (`settlement.npcs[]`), written
  at `roadsKernel.js:1074` into `settlementUpdates`. Any lookup must therefore
  index the **item's own `settlement.npcs`**, keyed with
  `npcId(item.id, npc, index)` — the same function `npcStates` keys are minted
  with (`npcAgency.js:193`), already imported by sixteen modules.
- **Sole writers (unchanged by this packet):** roster —
  `seatNpcsIntoFactions` (`factionCompetition.js:420`, only call site
  `pulseKernel.js:346`). Mirror — `advanceRoads` (`roadsKernel.js:1074`, sole
  per-tick writer, reached from `pulseKernel.js:2563`).
- **The full downstream census of the bloc-read family** (EXECUTED
  `grep -rn "rulingBlocOf\|coalitionConsolidation01\|blocDecisionFactor" src/`,
  excluding the definitions) — **four consumers, no others**:

  | Consumer | Site | Reads | Effect of the discount |
  |---|---|---|---|
  | The war chooser | `settlementStrategy.js:1223` → `:759-763` | `blocDecisionFactor` per move | **Multiplier moves; the chosen move can flip** (§9b) |
  | The NPC ladder | `npcLadderKernel.js:554` → `:682` | `rulingBloc != null` — a BOOLEAN | Inert **except** at a `RULING_CONSOLIDATION_FLOOR` crossing, where `blocBacked` flips |
  | War seat books | `warSeatBooks.js:500` | `coalitionConsolidation01` | Consolidation nudge |
  | The corruption web | `corruptionWeb.js:421` | `coalitionConsolidation01` | Recruitment-weight degrade nudge |

- **Direct readers this packet adds:** `rulingBlocOf`
  (`settlementPolitics.js:541`) and `topFactionEntries`
  (`factionCompetition.js:171`). Two, which is the cap.
- **Absence rule:** faction absent / `memberNpcIds` absent or empty / no
  matching faction state / espionage dark ⇒ the share is exactly `1` (the
  identity multiplier). **Never `0`, never `null`, never `undefined`.**
- **Persistence / regen / undo / migrate:** **NONE.** The leaf is a pure
  DERIVED read over two structures this packet does not write, matching §1's
  zero-new-keys law and the `ransomDwellRead` precedent. No lifecycle seam
  applies.
- **Receipts:** none minted here. The Herald voice is ES-7's.
- **Test shapes to copy:** `tests/domain/settlementPoliticsPins.test.js`
  (bloc-read pin idiom, esp. `:267-308`);
  `tests/domain/espionageWariness.test.js` (ES-5a's zero-import fence and
  four-fence dormancy idiom); `tests/domain/worldPulseRulebook.test.js:311+`
  (the live `evaluateFactionRules` drive).
- **Forbidden homes:** `pulseKernel.js`, `applyWorldPulse.js` (L1, banked,
  zero headroom); `settlementStrategy.js` (**zero edits — IN-4's no-EDIT law,
  exact 812 baseline**); `roads/state.js` (`isOffStage` is untouched —
  J-ES-9); the faction's authored `power` (read-only derivation output, HZ6);
  the ladder family `npcLadderKernel/State/Contest` (ES-5c's, and untouched
  here). ⛔ Do not mint any second court-vote-weight under any spelling —
  `conquestVoteWeight01` is deleted-and-pinned-absent (HZ5).

---

## 6. Exact contracts

### 6.1 The leaf's surface

`src/domain/worldPulse/espionage/espionagePresence.js` exports exactly two
symbols:

```
presentShare01(memberNpcIds, npcsById) → number in [1 - ABSENT_W, 1], round4
presenceSharesFor(worldState, item)
    → null  when espionage is dark, or the settlement has no faction states
    → { byFactionId: Map<string, number>, byNameKey: Map<string, number> }
```

**`presentShare01`** is the pure kernel and takes **no world objects**:

- `memberNpcIds`: the roster array off `factionStates[fid].memberNpcIds`.
- `npcsById`: a plain `Map` the CALLER supplies (dependency inversion).
- Returns `round4(1 - ABSENT_W * (awayMembers / max(1, memberNpcIds.length)))`.
- `awayMembers` = members whose resolved `npc.whereabouts.state` is in
  `WHEREABOUTS_STATES` **minus** `'hostage'`, i.e.
  `traveling | visiting | returning`. Hostages are already off-stage and are
  **not** counted (§3.11). The exclusion is written as
  `WHEREABOUTS_STATES.filter(s => s !== 'hostage')` — **derived from the frozen
  export, never re-typed as a literal** (derive-don't-restate; a re-typed
  triple goes stale silently the day roads adds a state).
- A member id that resolves to no npc contributes **0** away (absent ≠ away).
- `memberNpcIds` absent, non-array, or `[]` ⇒ `1`. `npcsById` absent ⇒ `1`.

**`presenceSharesFor`** is the per-settlement composer both consumers call:

1. `if (espionageActive(worldState) !== true) return null;` — one flag read,
   nothing else touched. This is the byte-identical dark path.
2. Build `npcsById` **once** from `item.settlement.npcs` using
   `npcId(item.id, npc, index)`.
3. Walk `worldState.factionStates` once, keeping entries whose
   `settlementId === String(item.id)`. For each:
   - `byFactionId` key = **the factionStates entry's own key**. ⭐ No id is
     derived: `ensureFactionStates` mints that key with
     `factionId(item.id, faction, index)` (`factionCompetition.js:190`), which
     is the identical expression `topFactionEntries` uses at `:178`, so the
     join is exact by construction and mints **no second identity spelling**.
   - `byNameKey` key = `stablePart(String(state.name || ''))`, skipping empty.
     This mirrors `settlementPolitics.js:709`'s own bucket key
     (`stablePart(String(st.name || stripSavePrefix(fid)))`) and joins
     `rulingBlocOf`'s existing `stablePart(factionNameOf(f))` at `:551`.
     ⚠ **This is the packet's one key MIRROR, and it is pinned by case A7** —
     a name-key that fails to join must degrade to share `1`, never to `0`.
4. Return both maps. Determinism: both are built by a single
   `Object.keys(factionStates)` walk in `compareCodepoint` order; neither is
   iterated for output, only `get()`-ed, so iteration order cannot leak.

### 6.2 `ABSENT_W` — chair-authored dark tuning, set BY PARITY

**CR-ES5B-6: `ABSENT_W` IS CHAIR-AUTHORED DARK TUNING** (the TC-4 O-3 /
`MAXIMUM_WARDS` precedent): a dark-flagged, engine-inert value, individually
vetoable, and **NOT** the owner's tuning signature (which binds LIT-surface
tuning at soak). The lane was right that an implementer must never be forced
to author it — so the chair authors it here, with its argument.

**Home:** `ESPIONAGE_TUNING` in `espionageMath.js:128`, under a new
`// §3.11 THE ABSENCE COST.` heading beside the existing `// §3.14 THE
PROMOTION-RISK REGISTER.` block. Not the leaf: the family docblock at
`:124-127` states the house idiom — *"EVERY CONSTANT THE ESPIONAGE ARITHMETIC
READS, in one frozen export"* — and a weight authored in the leaf forks it.

**Value: `ABSENT_W: 0.5`.**

**The parity argument (DERIVED, executed — not eyeballed).** Enumerating every
`*_W` key in the espionage tuning family:

| Key | Value | Home |
|---|---:|---|
| `COMP_POWER_W` | 0.35 | `ESPIONAGE_TUNING` |
| `COMP_CRIME_W` | 0.15 | `ESPIONAGE_TUNING` |
| `NOTOR_W` | **0.5** | `ESPIONAGE_TUNING` |
| `SHELTER_W` | 0.6 | `ESPIONAGE_TUNING` |
| `WARINESS_W` | **0.5** | `ESPIONAGE_TUNING` |
| `PERF_POISON_W` | **0.5** | `ESPIONAGE_TUNING` |
| `PROMOTION_EXPOSURE_W` | **0.5** | `ESPIONAGE_TUNING` (§3.14) |
| `PROMOTION_RIVAL_W` | **0.5** | `ESPIONAGE_TUNING` (§3.14) |
| `DESPERATION_W` | **0.5** | `TAP_TUNING` |
| `INTEGRITY_W` | **0.5** | `TAP_TUNING` |

**Seven of ten are exactly 0.5** — and the three that are not
(`COMP_POWER_W`, `COMP_CRIME_W`, `SHELTER_W`) are each **split-term weights
inside a multi-term sum**, where the weights must apportion between terms.
`ABSENT_W` is a **lone weight on a single ratio**, structurally identical to
`NOTOR_W`, `WARINESS_W` and — decisively — to **both weights of §3.14's
promotion-risk register, which is THE OTHER GRAIN OF THIS SAME AMENDMENT**
(one signature, two grains — §3.11:1150-1155). Setting the bench grain's
weight anywhere other than its career twin's value would be the anomaly.

**What 0.5 means, stated plainly:** `presentShare01 ∈ [0.5, 1]`. A faction
whose entire roster is abroad loses **half** its council and contest weight,
never all of it. A quarter abroad loses an eighth.

**⚠ VETOABLE, and OWNER-SIGNED AT SOAK.** This is a chair authorship under
CR-ES5B-6, individually vetoable in one clause, and it rides the terminal
tuning pass like every other espionage constant (`ESPIONAGE_TUNING`'s own
docblock: *"Every value is a RAW-AUTHORED PROPOSAL until the owner signs it at
the soak redo (L5, THE PROMISE)"*). The implementer does **not** re-decide it
and does **not** tune it to make a test pass.

### 6.3 The `factionCompetition` composition — THE RESTORED REACH

⭐ **This section replaces rev 1's deviation D2.** It is written against live
code read at `2d420dfa`, not transcribed from the charter's prose.

**What "the contest math" IS, measured.** `factionCompetition.js` has no bloc
read of any kind. Its per-faction contest weight is `entry.power`, produced in
exactly one place — `topFactionEntries` (`:171-183`), which maps the roster
through `factionPower(faction, index)` (`:116-120`) — and consumed in exactly
these places (EXECUTED `grep -on "entry\.[a-zA-Z]*"`):

| Site | Function | Role |
|---|---|---|
| `:666` | `governmentChallenge` | `baseSeverity = clamp01(legitimacy*0.48 + entry.power*0.28 + …)` |
| `:742` | `institutionCandidate` | `severity = clamp01(pressureScore*0.44 + entry.power*0.24 + …)` |
| `:801` | `serviceOrLawCandidate` | `severity = clamp01(pressureScore*0.42 + entry.power*0.2 + …)` |
| `:864` | `rivalryOrExhaustionCandidate` | `severity = clamp01(legitimacy*0.26 + conflict*0.26 + entry.power*0.18 + …)` — this is the `faction_rival_power_contest` rule, i.e. **literally the "rivals exploit the window" mechanism §3.11 names** |
| `:621` | `candidateBase` | records `metadata.power = entry.power` on the emitted candidate |

The only other fields read off an entry are `entry.id` (`:921`) and
`entry.index` (`:737`). **Nothing reads `entry.faction` or `entry.archetype`**
— so adding a field to the entry object is safe.

**THE COMPOSITION — one producer, four consumers inherit it.** The discount is
applied at `topFactionEntries`, the single producer of `entry.power`:

```js
// (1) new import — INFO leaf, INTERIOR importer: a REAL cross-layer pair, licensed (§7)
import { presenceSharesFor } from './espionage/espionagePresence.js';

// (2) topFactionEntries gains worldState and the discount
function topFactionEntries(item, worldState = null) {
  const shares = presenceSharesFor(worldState, item);        // null ⇒ dark ⇒ untouched
  return settlementFactions(item)
    .map((faction, index) => {
      const id = factionId(item.id, faction, index);
      const rawPower = factionPower(faction, index);
      return {
        faction, index, id, rawPower,
        power: shares ? clamp01(rawPower * (shares.byFactionId.get(id) ?? 1)) : rawPower,
        archetype: inferFactionArchetype(faction),
      };
    })
    .sort((a, b) => b.rawPower - a.rawPower)                 // ⭐ SELECTION stays on RAW power
    .slice(0, 3);
}

// (3) the one call site, factionCompetition.js:919
const entries = topFactionEntries(item, snapshot.worldState);
```

**≤ 10 effective added lines**, which is exactly the charter's budget for this
file, and leaves ≈ 38 of its 48 effective lines of headroom.

**⭐ WHY THE SORT AND SLICE STAY ON RAW POWER — the load-bearing judgment.**
`topFactionEntries` does two different jobs in one expression: it computes a
contest WEIGHT and it SELECTS which three factions are evaluated at all
(`.slice(0, 3)`). Discounting the selection key too would let a lightened
faction fall out of the evaluated set entirely — silencing all four of its
candidate rules rather than weakening them, a coverage cliff that no design
sentence asks for and that would move far more goldens than the discount
itself. Selecting on `rawPower` keeps the candidate SET byte-stable and moves
only the SEVERITIES, which is precisely "a lightened faction IS the two-books
texture". `rawPower` is a new field carried solely for the sort; nothing else
reads it. **This is an author-lane judgment, recorded here so the chair can
veto it in one clause** (§13 O2) — the alternative (discount the selection
key) is a one-word change to the `.sort` comparator.

**Double dormancy, both arms measured.** The factionCompetition arm is gated
twice: `candidateEvents.js:516` admits `evaluateFactionRules` only when
`rules.factionCompetitionEnabled` is true, and `presenceSharesFor` returns
`null` unless `espionageActive(worldState) === true`. A world with faction
competition lit and espionage dark is byte-identical; so is the reverse.

### 6.4 The `settlementPolitics` composition — the bench chokepoint

Inside `rulingBlocOf` only, at the power-sum step (`:549-556`):

```js
import { presenceSharesFor } from './espionage/espionagePresence.js';   // (1)

// inside rulingBlocOf, before the roster walk:
const shares = presenceSharesFor(worldState, item);                     // (2)
// inside the walk, replacing `const power = factionPowerOf(f);`:
const power = factionPowerOf(f) * (shares ? (shares.byNameKey.get(key) ?? 1) : 1);   // (3)
```

`power` at `:552` feeds BOTH `totalPower` (`:553`) and `byKey` (`:554`), and
`:561` sums `byKey` — so one line reaches the numerator and the denominator
together, which is the arithmetic the probes measured. **No other function in
this file is edited.** ≤ 15 effective lines including the header comment
declaring the one-tick lag and the disclosed shift.

**D3 stands (rev 1): insert ONCE, at `rulingBlocOf`.** `coalitionConsolidation01`
(`:580`) and `blocDecisionFactor` (`:597`) each call `rulingBlocOf`
independently — measured, probe 7 — so one insertion serves all four
downstream consumers and satisfies single-chokepoint discipline. Inserting
inside `coalitionConsolidation01`'s body instead would reach the seat books and
the corruption web and **neither the chooser nor the ladder** (probe 9).

### 6.5 Bounds, rounding, order

`clamp01` then `round4`, matching `settlementPolitics.js`'s own idiom
(`:563`, `:617`). The leaf imports `clamp01` from `../../kernel/math.js` and
`round4` from `./espionageMath.js`. ⚠ `round4` is **not** in `kernel/math.js`
(measured: only `clamp01` is); the two exported `round4`s live in
`npcLadderState.js:34` (INTERIOR) and `peaceTermsPrimitives.js:26` (GRAMMAR),
and importing either from an INFO leaf would mint a cross-layer pair **for a
rounding helper**. The espionage family already defines its own private
`round4` at `espionageMath.js:80`; **add `export` to it** — one word, zero
behavior change, zero new spellings, INFO→INFO.

Iteration is over `memberNpcIds` in its stored order; the result is an
order-independent ratio, so no sort is required — asserted by case A6.

### 6.6 THE DECLARED ONE-TICK LAG

The discount reads a whereabouts mirror written **later in the same tick**
(§0.2). All three consumers read it pre-write, so the lag is uniform at
exactly one tick. **This must be stated in the leaf's header block** and in
`rulingBlocOf`'s and `topFactionEntries`'s comment, and pinned by case A5.
Reordering the pulse to remove it is forbidden (L1).

### 6.7 Flag and dormancy

Gated `espionageActive(worldState) === true`, BY NAME, read strictly with
`=== true` so absent and false are identical. Dark ⇒ `rulingBlocOf` computes
its power sum and `topFactionEntries` its entries exactly as they do today,
byte-identically.

### 6.8 Alignment and edit story

Req 13: declared-empty for this slice (the engagement is ES-5a's, landed).
Req 14: **engine-only** — the one player/DM verb is ES-7's.

---

## 7. THE COUPLING TRAP — CW-0w (⚠ this has bitten five times; this packet is the sixth near-miss, and it is TAKEN rather than avoided)

**Executed at `46357c94`** (unchanged at `2d420dfa` — no walker file moved):
`sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/couplingInclusion.walker.test.js`
→ **16/16 passed, true exit 0.** Re-run at preflight (§10).

The ratchet keys on `importer|imported|direction`
(`couplingInclusion.walker.test.js:581`), and `scanCrossLayerPairs`
(`:568-579`) iterates **only LAYERED importers** — `if (!depLayer ||
depLayer === layer) continue`. Measured layer homes:

| Module | Layer | Evidence |
|---|---|---|
| `src/domain/worldPulse/espionage/**` | **INFO** | walker `:143` (a DIRECTORY pattern — every ES leaf is claimed the day it lands) |
| `factionCompetition.js` | **INTERIOR** | walker `:179`, `/^src\/domain\/worldPulse\/(?:faction|…)/` |
| `settlementPolitics.js` | **UNLAYERED** | matches no `LAYER_PATTERNS` entry; present in the 179-row `.coupling-unlayered-baseline.json`; **not** in `ARGUED_UNLAYERED` |
| `worldState.js` | ARGUED **host** | walker `:258`, and in `ARGUED_HOSTS` `:429` |
| `npcAgency.js` | UNLAYERED | matches no pattern (the INTERIOR npc pattern is `npcLadder`, not `npc`) |
| `src/domain/roads/**`, `src/kernel/**` | out of census scope | `CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//` (`:458`) |

**⭐ THE DECISIVE LAW, READ AT SOURCE.** `couplingInclusion.walker.test.js:807`:

> `test('a NEW cross-layer import is either licensed by a registry row or REDS')`

and its body filters `LIVE_PAIRS` by `!BASELINE_KEYS.has(…)`, then by
`!OWED_KEYS.has(…)`, then by **`licensingRows(pair).length === 0`**.
`licensingRows` (`:667-671`) joins a `COUPLING_REGISTRY` row to a pair when
`row.direction === pair.direction` **and** `moduleOf(row.read) ===
pair.importer`. The shrink-only baseline arm (`:820`) only reds when a
BASELINE pair's import is GONE.

⇒ **A new cross-layer pair does NOT red the ratchet when a registry row
licenses it in the same commit.** Rev 1's STOP 5 ("a new cross-layer pair is a
STOP") was over-strict; the real law is "a new cross-layer pair is a STOP
**unless it is licensed in this commit** — and it is NEVER baselined."

Chains for every import this packet mandates:

1. **`factionCompetition.js` → the new leaf. A REAL PAIR, and it is TAKEN.**
   INTERIOR importer, INFO dependency ⇒ direction **`INFO→INTERIOR`**
   (`${depLayer}→${layer}`). This mints a live pair key
   `src/domain/worldPulse/factionCompetition.js|src/domain/worldPulse/espionage/espionagePresence.js|INFO→INTERIOR`.
   **Licensed by the CPL-20 row at manifest item 5**, whose `read` address is
   `src/domain/worldPulse/factionCompetition.js#topFactionEntries` and whose
   `direction` is `INFO→INTERIOR`. Nothing is baselined.
   ⭐ Rev 1 avoided this pair by dropping the edit. That was the wrong cure:
   the pair is a **designed coupling the volume names**, and the registry
   exists precisely to make designed couplings visible rather than absent.
2. **`settlementPolitics.js` → the new leaf.** The importer is UNLAYERED, so
   `scanCrossLayerPairs` skips it and **no pair key is minted**. ⚠ This is a
   *fail-open*, not a win: the read is genuinely cross-layer and the ratchet
   **cannot see it**.
   **CR-ES5B-4: MINT CPL-20 ANYWAY.** *"Routing through the UNLAYERED
   `settlementPolitics.js` mints no pair only because `scanCrossLayerPairs`
   iterates LAYERED importers — that is FAIL-OPEN INVISIBILITY, not absence.
   Record the edge that the walker cannot see."* Carried as a named clause in
   the same CPL-20 row's docstring (manifest item 5), on the
   `ES5_DOCTRINE_MORAL_LADDER_COUPLING` precedent of recording its own
   asymmetry. It is one row because the walker's join is per-`read`-module and
   a second row with an unjoinable direction would assert nothing.
3. **The new leaf → `roads/state.js` (`WHEREABOUTS_STATES`)** and
   **→ `npcAgency.js` (`npcId`)** and **→ `worldState.js` (`stablePart`)**.
   None has a layer, so `if (!depLayer) continue` fires and **no pair is
   minted**. Precedent chain already exists: `npcLadderKernel.js:80` imports
   `isOffStage` from `../roads/state.js`; sixteen modules import `npcId`.
4. **The new leaf → `espionageGate.js` / `espionageMath.js`.** All INFO —
   `depLayer === layer` ⇒ **no pair**.
5. **No cycle.** Measured: no file under `src/domain/worldPulse/espionage/`
   imports `factionCompetition.js`, `candidateEvents.js` or `npcAgency.js`
   (EXECUTED grep over the family's twenty-six relative imports), and
   `factionCompetition.js` imports no espionage leaf today. The new edge is
   acyclic. ⚠ The leaf must **never** import `factionCompetition.js` — that
   would close the loop and drag the whole family (`barrel-hop` hazard).

**Cure order applied, in order:** dependency inversion FIRST (`presentShare01`
takes a caller-supplied `Map`, never reaching for a world lookup; the leaf
imports nothing from either consumer), a registry row SECOND. **Nothing is
baselined.**

---

## 8. Exact change manifest

| # | Action | Path | Symbol / region | Max Δ | Instruction |
|---:|---|---|---|---:|---|
| 1 | CREATE | `src/domain/worldPulse/espionage/espionagePresence.js` | `presentShare01`, `presenceSharesFor` | ≤ 120 eff | The pure bench leaf per §6.1. Imports ONLY: `clamp01` (`../../kernel/math.js`), `round4` + `ESPIONAGE_TUNING` (`./espionageMath.js`), `espionageActive` (`./espionageGate.js`), `WHEREABOUTS_STATES` (`../../roads/state.js`), `npcId` (`../npcAgency.js`), `stablePart` (`../worldState.js`). Header states the one-tick lag (§6.6), the fail-open coupling note (§7 chain 2), and the never-import-factionCompetition rule (§7 chain 5). |
| 2 | MODIFY | `src/domain/worldPulse/espionage/espionageMath.js` | `ESPIONAGE_TUNING`; `round4` at `:80` | ≤ 2 eff | Add `ABSENT_W: 0.5` under a `// §3.11 THE ABSENCE COST.` heading, beside the §3.14 block. Add `export` to the existing private `round4`. **Nothing else.** |
| 3 | MODIFY | `src/domain/worldPulse/factionCompetition.js` | `topFactionEntries` (`:171`) + its one call site (`:919`) | **≤ 10 eff** | The composition VERBATIM per §6.3, including the `rawPower` sort key. No other function edited. ⚠ 48 effective lines of headroom — measure before and after. |
| 4 | MODIFY | `src/domain/worldPulse/settlementPolitics.js` | inside `rulingBlocOf` only, at the power-sum step (`:549-556`) | ≤ 15 eff | Per §6.4. No other function edited. |
| 5 | REGISTER | `src/domain/certification/couplingRegistryEspionage.js` | new `ES5B_ABSENCE_BENCH_COUPLING` | ≤ 30 eff | Row per the `ES3_FLAW_DISTORTION_COUPLING` template at `:272-290`, through `couplingRow()`. **All ten required fields** (`couplingRegistrySchema.js:47-56`): `couplingId: 'CPL-20.INFO_TO_INTERIOR.ES-5b.absence_bench'` · `pairId: 'CPL-20'` (the volume's own INFO × INTERIOR anchor — never mint a twenty-third) · `direction: 'INFO→INTERIOR'` · **`read: 'src/domain/worldPulse/factionCompetition.js#topFactionEntries'`** (this exact string is what `licensingRows` joins on — §7) · `receiptField:` **AUTHOR-TIME-UNMEASURED, §10** · `counterforce: 'src/domain/worldPulse/settlementPolitics.js#rulingBlocOf'` · `flags: ['errandSpineEnabled', 'espionageEnabled', 'factionCompetitionEnabled']` · `owningVolume: 'ESPIONAGE'` · `owningWave: 'ES-5b'` · `intendedDesk: 'war'`. Docstring MUST name the walker-invisible `settlementPolitics.js` edge (CR-ES5B-4) and the fail-open reason. Append to the exported wave-order array. |
| 6 | TEST | `tests/domain/espionagePresence.test.js` | A1, A3, A4, A6, A7 | — | The leaf's own pins + the factionCompetition reach. |
| 7 | TEST | `tests/property/espionageAbsenceDormancy.test.js` | A2, A5, A8 | — | ES-5a's four-fence dormancy idiom + the declared-shift golden pair. Fence the roads-lit / espionage-dark world EXPLICITLY (§3.11's own scope-guard) AND the espionage-lit / factionCompetition-dark world (§6.3). |
| 8 | DOC | `docs/DESIGN_FP_ARCHITECTURE.md`, `docs/DESIGN_FP_ARCH_ES.md` | the seven stale sites in §0.1 | — | **CR-ES5B-1.** FP §5 108→109 and "eight"→"nine" ES waves; FP's ES-5 row split into ES-5a (LANDED `41ddeae0`) + ES-5b; ES §4 "Wave count: 8"→9; ES §6 item 3 "ES-5/ES-6 follow"→"ES-5a/ES-5b/ES-6" and "60 → 68"→"60 → 69". Documentation receipts do not count as production lines. |
| 9 | DOC | the packet's completion receipt | — | — | Records §9b's declared shift verbatim, by name (⟨F6⟩), with the measured golden list. |

**Nothing else.** A target outside this table is out of scope even if the full
gate finds an adjacent defect.

---

## 9. Acceptance matrix — 8 cases (cap 8)

| # | Case | Assertion |
|---|---|---|
| A1 | Main reachable behavior | A faction with 4 members, 1 `traveling`, espionage lit ⇒ `presentShare01` = `round4(1 - 0.5*0.25)` = `0.875`, and on the SAME fixture that faction's bloc share in `rulingBlocOf` drops measurably **and** its `entry.power` in `topFactionEntries` drops by the same factor. **Both consumption sites in one case** — the reach is the claim. |
| A2 | Absent / disabled — FOUR fences | On one fixture: (a) espionage dark ⇒ `rulingBlocOf` AND `evaluateFactionRules` outputs are **byte-identical** to base; (b) roads-lit + espionage-dark fenced explicitly; (c) espionage-lit + `factionCompetitionEnabled` dark ⇒ the faction arm is byte-identical while the bench arm moves; (d) `errandSpineEnabled` false ⇒ `espionageActive` false ⇒ byte-identical. |
| A3 | Counterforce / negative (`// anchored:`) | A faction whose only away member is a **`hostage`** is discounted **ZERO** — hostages are already off-stage. Anchored against a live positive control **in the same test** (a `visiting` member on the same fixture DOES discount, at both sites), so the negative cannot fail open. The away set is asserted to be `WHEREABOUTS_STATES` minus `hostage` **derived from the frozen export**, so a fourth roads state cannot silently escape the discount. |
| A4 | Sparse / malformed-but-supported | `memberNpcIds` absent, `[]`, carrying an id that resolves to no npc, and a faction with no `factionStates` entry at all ⇒ share `1` in all four, at both sites. Never `0`, never `NaN`, never `undefined`. |
| A5 | Ordering — THE DECLARED LAG | Drive the REAL pulse: mint a covert errand, advance one tick, assert the discount appears on the tick AFTER the whereabouts mirror is written, not the same tick — and assert it appears on the **same** tick at BOTH consumers (uniform lag, no divergence). Pins §0.2 rather than leaving it to be rediscovered. |
| A6 | Determinism | Same seed, same world ⇒ identical bloc output and identical candidate list; and a `memberNpcIds` array reversed in place yields an identical share (order-independence). |
| A7 | The key mirror (§6.1 step 3) | `presenceSharesFor`'s `byNameKey` joins `rulingBlocOf`'s roster key and its `byFactionId` joins `topFactionEntries`'s `entry.id`, on a fixture where a faction carries BOTH a distinct `faction.id` and a distinct display name — the case where the two derivations diverge. A failed join must yield share `1`, proven by driving a deliberately unjoinable name and asserting byte-identity with base. |
| A8 | ⭐ THE DISCLOSED SHIFT — the golden pair | The ⟨F6⟩ pair: (i) a **dark** golden asserting byte-identity with the pre-change output on the same seed; (ii) a **lit** golden recording the NEW output, whose header names the shift, its cause, and this packet. The lit golden is recorded ONCE, in this commit, with the cause stated (§9b) — never re-recorded silently. |

No lifecycle round-trip case: this packet writes no state (§5). No privacy
case: no receipt or audience surface is minted (ES-7 owns the voice).

---

## 9b. THE DECLARED BEHAVIOR SHIFT — verbatim, and the implementer MUST measure it before editing

> **This packet changes lit-world simulation output. It is a DISCLOSED,
> one-time bloc-math shift under ⟨F6⟩ (FP §9 seam row 6), anticipated by name
> in `DESIGN_FP_ARCH_ES.md:1123-1128` — "dark worlds … are BYTE-IDENTICAL, and
> the one-time bloc-math shift in a lit world is DISCLOSED, named in the wave's
> commit, and fenced by its own golden pair". It is NOT a regression, and it
> may NOT ride silently.**
>
> **What was measured, at `2d420dfa`, by driving the REAL production
> `rulingBlocOf` / `blocDecisionFactor` (scratchpad `warchoose-probe.mjs`,
> `warchoose-probe2.mjs`):**
>
> 1. **The war chooser's input moves at any non-uniform discount.** Sweeping a
>    single faction's `presentShare01` over `{1, 0.99, 0.98, 0.95, 0.9, 0.75,
>    0.5, 0.25, 0}`, **every value below 1** changed `blocDecisionFactor`.
>    A **1 % discount already moves the multiplier** (`deploy` 1.1907 → 1.1904).
>    Four of the chooser's twelve moves are load-bearing — `deploy`,
>    `sue_for_peace`, `fortify`, `defend`; the other eight take pull 0 and stay
>    exactly 1.
> 2. **The chosen MOVE flips.** Replicating `settlementStrategy.js:759-763`
>    verbatim over a court whose top two moves sit within 0.6 % after loading:
>    `DISCOUNT OFF → CHOSEN = deploy`; `DISCOUNT ON (share 0.75) → CHOSEN =
>    fortify`. **This packet changes which war move a court selects.**
> 3. **A large discount crosses the consolidation floor.**
>    `RULING_CONSOLIDATION_FLOOR = 0.4`. On a court of Noble 30 (governing, in
>    bloc) / Merchant 30 (in bloc) / Craft 60: at `presentShare = 0.5` the bloc
>    holds (consolidation 0.4286); at **`presentShare ≤ 0.2` `rulingBlocOf`
>    returns `null`** — every `blocDecisionFactor` collapses to exactly 1, the
>    chooser's entire coalition load vanishes, and the ladder's `blocBacked`
>    (`npcLadderKernel.js:682`) **flips false**. ⚠ At the chair-set
>    `ABSENT_W = 0.5` the share floor is 0.5, so this crossing is **NOT
>    reachable by absence alone on that fixture** — it becomes reachable only
>    when absence stacks on a bloc already near the floor. The implementer must
>    NOT tune `ABSENT_W` to avoid a crossing (§6.2).
> 4. **Dark is safe, proven.** The identity control — discount `s ≡ 1` for
>    every faction — is **byte-identical** to base (probe 6). So is a uniform
>    court-wide discount `c ∈ {1, 0.75, 0.5}` (probe 3), which also proves the
>    probe non-vacuous: `share` is a RATIO, invariant only under a court-wide
>    constant, so **no per-faction shaping escapes the chooser.** There is no
>    re-siting that delivers the reach and spares the chooser.
> 5. **The contest math moves too, by construction.** `entry.power` scales by
>    the same factor into four severities (`:666`, `:742`, `:801`, `:864`) and
>    into `metadata.power` (`:621`); the candidate SET is unchanged because
>    selection stays on `rawPower` (§6.3).
>
> **THE IMPLEMENTER'S OBLIGATION, before the first edit:** run the full gate at
> BASE and record which goldens and pins are green. Then, after the change,
> **enumerate every golden/pin that moved, name each one in the commit
> message, and state the cause.** ⛔ **Re-recording any golden without stating
> the cause is forbidden** (house non-negotiable 10). ⛔ **A golden that moves
> and is NOT on the enumerated list is STOP 7** — it means the reach went
> somewhere this packet did not measure.
>
> **Goldens and pins most likely to move — CANDIDATES, not a closed list; the
> implementer measures the real set (§10):**
> `tests/property/settlementPoliticsDormancyGolden.test.js` ·
> `tests/property/npcLadderDormancyGolden.test.js` ·
> `tests/property/corruptionWebDormancyGolden.test.js` ·
> `tests/property/contestedGoalsDormancyGolden.test.js` ·
> `tests/domain/settlementPoliticsPins.test.js` ·
> `tests/domain/warSeatBooks.test.js` ·
> `tests/domain/warMachineObeysPolitics.test.js` ·
> `tests/domain/warPoliticalLoop.test.js` ·
> `tests/domain/worldPulseRulebook.test.js` ·
> `tests/domain/decisionTier.test.js` ·
> `tests/perf/tickScanBudget.test.js` (a NEW per-settlement scan — see §10).
> ⚠ Every *Dormancy* golden should be **unmoved**: they drive dark worlds, and
> a dark world is byte-identical. **A moved dormancy golden is STOP 7**, not a
> re-record — it means the flag gate leaked.

---

## 10. Verification commands

```sh
cd /Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold

# Focused tests — acquire the one test slot in the SAME command. Never bare vitest.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/espionagePresence.test.js \
  tests/property/espionageAbsenceDormancy.test.js \
  tests/domain/settlementPoliticsPins.test.js \
  tests/domain/worldPulseRulebook.test.js \
  tests/domain/warPoliticalLoop.test.js

# The coupling ratchet — MUST stay green, licensed by the CPL-20 row, NEVER baselined.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/couplingInclusion.walker.test.js \
  tests/lint/couplingDesk.walker.test.js \
  tests/domain/couplingRegistry.test.js

# The scan-cost ratchet — a NEW per-settlement scan lands on the hot path (see below).
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/perf/tickScanBudget.test.js tests/perf/tickOpBudget.test.js

# Effective-line check on all four production files.
npx eslint src/domain/worldPulse/espionage/espionagePresence.js \
  src/domain/worldPulse/espionage/espionageMath.js \
  src/domain/worldPulse/factionCompetition.js \
  src/domain/worldPulse/settlementPolitics.js

# Both typecheckers, named per the two-typechecker receipt law.
sh scripts/gate-tail.sh npm run typecheck:domain:strict     # tsconfig.domain-strict.json
sh scripts/gate-tail.sh npm run typecheck:ratchet           # tsconfig.full.json

# Wave-end gate — NEVER through a pipe.
npm run check:tail
```

⚠ **A NAMED HOT-PATH RISK the implementer must measure, not discover.**
`settlementStrategy.js:1223` builds `{ factorFor: move => blocDecisionFactor(…) }`
and the scorer calls it **once per move** (`:759-763`), so `rulingBlocOf` runs
**twelve times per settlement per tick** today, each rebuilding its roster map.
`presenceSharesFor` adds a `factionStates` walk **and** an `item.settlement.npcs`
index build to each of those calls. In a **dark** world the cost is one flag
read (the `espionageActive` early return), so dark is free. In a **lit** world
it is real. `tests/perf/tickScanBudget.test.js` asserts
`scanOps(S=8)/scanOps(S=4) <= 2.6` plus `fallbacks === 0`; the added work is
linear per settlement, so the RATIO should stay flat — **but that is a
prediction, not a measurement.** Run the perf pair at BASE and after.
⛔ If it reds, the cure is **NOT** a cache: memoising on world contents is the
recorded OSR resolver-state-identity hazard (no cache key may embed monotone
contents). The cure is a STOP and a chair conversation about hoisting the
share map to the one place `settlementStrategy.js` builds `coalitionLoad` —
which would edit the frozen chooser and is therefore itself owner-gated.

**AUTHOR-TIME-UNMEASURED baselines** — the implementer measures each at
preflight, against the BASE, **before the first edit**. Do **not** inherit a
number from this packet.

| Figure | Status | Exact preflight command |
|---|---|---|
| Standing full-gate red at base | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run check` |
| `typecheck:ratchet` error count + ceiling | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run typecheck:ratchet` |
| `typecheck:domain:strict` count + ceiling | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run typecheck:domain:strict` |
| The GREEN-AT-BASE golden/pin set (the §9b denominator) | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run check` at BASE, then diff the pass list after |
| `tickScanBudget` scanOps ratio + `fallbacks` at base | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/perf/tickScanBudget.test.js` |
| Lighting census five figures | **AUTHOR-TIME-UNMEASURED** | re-derive ALL FIVE; never patch `files` |
| `negativeAssertionAnchor` rows/sites | **AUTHOR-TIME-UNMEASURED** | `sh scripts/ratchet-inventory.sh negativeAssertionAnchor HEAD` |
| `couplingInclusion` pass count at base | **AUTHOR-TIME-UNMEASURED** (rev 1 measured 16/16 at `46357c94`; re-measure) | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/couplingInclusion.walker.test.js` |
| The CPL-20 row's `receiptField` address | **AUTHOR-TIME-UNMEASURED** — the packet does **not** hand-key it (HAND-KEYED-ADDRESS ROT). The observable is the discounted contest weight recorded at `factionCompetition.js:621` as `metadata.power` on a `type: 'faction'` candidate; the bench arm has **no** persisted receipt (ES-7 owns the voice) and the address must say so in words. | Derive the live path a faction candidate's `metadata` reaches in the pulse record: `grep -rn "metadata" src/domain/worldPulse/candidateEvents.js src/domain/worldPulse/pulseKernel.js` and drive `evaluateFactionRules` per `tests/domain/worldPulseRulebook.test.js:311`. Then write the address as measured, and run `tests/lint/couplingDesk.walker.test.js` — its `kind=` scan reads this string. |

⚠ `npm run check` is a 17-step `&&` chain: a red step blacks out every later
step, so the receipt must say which steps actually **ran**.

---

## 11. Mandatory STOP conditions

Stop, without expanding or repairing, when:

1. Packet status is not READY (**it is DRAFT today — do not dispatch**).
2. HEAD is not `2d420dfa` or an explicitly pinned, ancestry-verified
   descendant.
3. Any target file is dirty, or **any of the five CHECK-GIT-FIRST collision
   surfaces** (`factionCompetition.js`, `settlementPolitics.js`,
   `npcLadderKernel.js`, `npcLadderContest.js`, `npcLadderState.js`) has a
   commit newer than `93e7ed50`.
4. `presentShare01` or `ABSENT_W` already exists (measured **zero** occurrences
   in `src/` and `tests/` at `2d420dfa`); presence means another lane landed
   the grain.
5. `tests/lint/couplingInclusion.walker.test.js` reds. **Never add a baseline
   entry to green it.** The cure order is dependency inversion, then a registry
   row (§7), **never** baselining. A pair that neither inversion nor a row can
   license is a STOP.
6. `settlementStrategy.js` would need **any** edit, or its `.size-baseline.json`
   entry (812) would move. IN-4 is a no-EDIT law and it is intact only while
   the diff on that file is empty.
7. **Any golden or pin moves that §9b did not name** — or any *Dormancy*
   golden moves at all.
8. `pulseKernel.js`, `applyWorldPulse.js`, `roads/state.js`, or any
   `npcLadder*` file would need editing.
9. Any hard scope limit in §3 would be exceeded — in particular a **fourth**
   modified production file or a **third** direct consumer. Both sit at the cap
   today; either is a re-slice, not a renegotiation.
10. `tests/perf/tickScanBudget.test.js` or `tickOpBudget.test.js` reds (§10).
11. Any open item in §13 is still open at dispatch.

The STOP report carries the smallest measured contradiction, its evidence, and
a proposed split. No speculative repair.

---

## 12. Recorded deviations from the ES-5 charter

| # | Charter text | This packet | Why |
|---|---|---|---|
| D1 | ES-5 is one wave carrying both grains | Bench only; career split to ES-5c | PACKET_STANDARD hard budget: 5 files > 3, 2 families > 1 (§3.1). CR-ES5B-3 keeps one CR-ES-1 signature over both. |
| **D2 — REVERSED IN THIS REVISION** | "`settlementPolitics` (1043) and `factionCompetition` (996) gain ≤ 10 composition lines **each**" | **`factionCompetition.js` IS edited, at ≤ 10 effective lines** (§6.3) | Rev 1 dropped it on two reasons, both re-measured and found insufficient: **(a) "48 lines of headroom"** — true, and ≤ 10 fits with ≈ 38 to spare; **(b) "the import would mint a new CW-0w pair"** — true, and a new pair is licensed by a registry row rather than forbidden (`couplingInclusion.walker.test.js:807`, §7). Dropping the edit deleted **§3.11's entire named reach** while keeping the whole disclosed cost (§0.5). |
| D3 | §3.11: "applied as a multiplier where `rulingBlocOf`/`blocDecisionFactor` weigh that faction" | Inserted **once**, inside `rulingBlocOf` | `blocDecisionFactor` (`:597`) and `coalitionConsolidation01` (`:580`) both call `rulingBlocOf` independently (probe 7); one insertion serves all four downstream consumers and satisfies single-chokepoint discipline. |
| D4 | ES-5a divergence #4 hands ES-5b a whereabouts-vocabulary problem | Recorded **DISSOLVED** | `WHEREABOUTS_STATES` is the authoritative frozen totality and matches §3.11 (§0.3). |
| D5 | ES-0 charter: "`promotionRiskOf`'s pure core" | The built symbol is `promotionRisk01Core` (`espionageMath.js:381`) | Naming drift, recorded for ES-5c; no ES-5b consumer. |
| **D6 — NEW** | §3.11 states the formula with `ABSENT_W` and names no home | `ABSENT_W: 0.5` lands in `ESPIONAGE_TUNING` (`espionageMath.js:128`), not in the leaf | The family docblock (`:124-127`) makes `ESPIONAGE_TUNING` the single frozen home for every espionage constant; a weight in the leaf forks it. Costs the third and last modified-file slot (§3.3), knowingly. |
| **D7 — NEW** | §3.11: "factionCompetition read[s] the same bloc weights every tick … with no further code" | **The claim is FALSE as measured**; the packet builds the reach on `entry.power`, not on a bloc weight | `factionCompetition.js` has no bloc read at all (§0.5). The design's INTENT — a lightened faction weighs less in the contest — is realised through the file's actual contest weight. Reading a bloc weight into `factionCompetition` instead would be a second, unrelated behavior (folding court consolidation into faction rules), which §3.11 does not ask for and the budget does not hold. |
| **D8 — NEW** | (no charter text) | `topFactionEntries` selects its top three on **raw** power and discounts only the weight | Discounting the selection key silences a lightened faction's four candidate rules entirely — a coverage cliff nothing asks for (§6.3). Author-lane judgment; vetoable in one clause (§13 O2). |

---

## 13. OPEN ITEMS — the chair's rulings, FOLDED; two items remain

### CLOSED IN-TEXT (chair, 2026-08-11 — no longer the implementer's or the promoter's to re-decide)

| Ruling | Disposition | Folded at |
|---|---|---|
| **CR-ES5B-1** | RATIFY the `41ddeae0` slice; amend all seven stale doc sites in the promotion commit. A wave that exists only in a commit message is not a charter — this packet becomes it. | §0.1, manifest item 8 |
| **CR-ES5B-2** | ACCEPT the one-tick lag, DECLARED and PINNED. Uniform and forced; an undeclared lag is the bug, not the lag. | §0.2, §6.6, case A5 |
| **CR-ES5B-3** | ONE CR-ES-1 signature covers ES-5b **and** ES-5c — same doctrine, split for budget, not for scope. ES-5c is not re-gated. | §1.2, §3.1 |
| **CR-ES5B-4** | MINT CPL-20 ANYWAY. The UNLAYERED `settlementPolitics.js` route mints no pair only because `scanCrossLayerPairs` iterates LAYERED importers — **fail-open invisibility, not absence**. Record the edge the walker cannot see. | §7 chain 2, manifest item 5 |
| **CR-ES5B-5** | ⛔ Blocked the packet on the war-chooser reach. **RETRACTED.** | §0.4 |
| **CR-ES5B-5-R2** | The block was WRONG — misattributed carve-out (§3.12's CR-ES-4, not §3.11), the wire is named BY NAME at :1123-1128, and "NOTHING touches the chooser" is a **no-EDIT** law satisfied by zero edits. **Gate LIFTED.** The real defect is the reverse and is chair-side: the reach does not exist and must be built. | §0.4, §0.5, §6.3 |
| **CR-ES5B-6** | `ABSENT_W` is chair-authored DARK tuning (TC-4 O-3 / `MAXIMUM_WARDS` precedent): dark-flagged, engine-inert, individually vetoable, **NOT** the owner's tuning signature. An implementer must never be forced to author it. **Chair sets `0.5` by parity; owner-signed at soak.** | §6.2, §12 D6 |
| **CR-ES5B-7** | ES-5c compiles only **after** ES-5b LANDS (just-in-time; no second stale backlog). It inherits D5's naming drift and must flip `espionageGauntlet.js:400`'s `Object.freeze(['promotionRisk'])` declared-absent term, whose pin is `tests/domain/espionageGauntlet.test.js:756`. | §3.1 |

### STILL OPEN — the chair closes each at promotion

| # | Item | Recommendation |
|---:|---|---|
| **O1** | The packet now sits **exactly at** two hard caps: three modified production files and two direct consumers (§3.3). The third file slot buys one tuning key plus one `export` keyword. | **Accept, or move `ABSENT_W` into the leaf** and buy back a slot at the cost of forking `ESPIONAGE_TUNING`'s single-home idiom (§6.2, D6). The author lane recommends **accept**: a tuning key in the family's frozen home is worth more than a spare slot this packet has no use for, and the alternative is exactly the kind of second home the estate has been paying down. |
| **O2** | D8: `topFactionEntries` selects on **raw** power and discounts only the weight, so the candidate SET is byte-stable and only severities move. | **Confirm.** The alternative — discount the selection key — is a one-word comparator change and a much larger, unasked-for shift (a lightened faction stops generating candidates at all). Recorded as an author-lane judgment precisely so the chair can veto it in one clause. |

---

## 13b. Chair rulings at the READY flip (2026-08-11)

Both remaining items are CLOSED. The implementer reopens neither.

- **O1 ACCEPTED — spend the third modified-file slot on `ABSENT_W`'s home.**
  `espionageMath.js`'s own docblock (`:124-127`) makes `ESPIONAGE_TUNING` the single
  frozen home for this family, and the single-home law outranks slot economy: a second
  tuning home is a permanent structural cost, while the third slot is spent once. The
  parity derivation is ratified as executed — seven of ten `*_W` keys are exactly
  `0.5`, the three that differ are split-term weights inside multi-term sums, and
  `ABSENT_W` is a lone weight on one ratio, structurally identical to `NOTOR_W`,
  `WARINESS_W`, and both weights of §3.14's promotion-risk register (the other grain of
  this same amendment). **`ABSENT_W = 0.5` is chair-authored DARK tuning: individually
  vetoable, engine-inert while the flag is dark, and re-ratified under the owner's
  tuning signature at soak.** ⛔ The implementer may NOT tune it — least of all to
  avoid a floor crossing (§9b item 3).
- **O2 CONFIRMED — D8 stands: selection stays on RAW power.** Discounting the
  `.slice(0, 3)` sort key would SILENCE a lightened faction's four contest rules rather
  than weaken them — a coverage cliff nothing in §3.11 asks for, and the opposite of
  the amendment's intent, which is that an absent faction *weighs* less, not that it
  *disappears*. The discount lands on `entry.power` (the weight every consumer reads)
  while `rawPower` orders the slice. Vetoable in one clause.

**Also ratified from the revision, for the record:** rev 1's scope refusal was
SELF-IMPOSED, not the standard's — `PACKET_STANDARD.md:118-144` allows two direct
consumers, three modified logic-bearing files, and three registration-only files, so
restoring `factionCompetition` puts this packet exactly AT two caps rather than over
any, and no further split is required. Rev 1's STOP 5 was likewise over-strict: the
coupling walker's law is *licensed-by-a-registry-row OR reds*, so the INTERIOR↔INFO
pair is licensable, not forbidden. And the lane's source reading STRENGTHENS
CR-ES5B-5-R2: IN-4's clause reads "NOTHING in **IN-4** touches the chooser" — scoped to
its own wave BY NAME.

## 14. Marking-law note for the chair

Per the marking law at the `33aeea35` boundary, authoring a packet from a
Fable-issued design owes no queue row. **Four items here go beyond that** and
in the compiling lane's judgment **owe a row at promotion**:

1. **§0.3 — the vocabulary dissolution.** ES-5a recorded divergence #4 as open
   and handed it to ES-5b by name. Retiring it contradicts a recorded landing
   claim.
2. **§3.1 / D1 — the ES-5 → ES-5b + ES-5c split.** A wave boundary no design
   document contains, derived from a measured budget overflow.
3. **§0.5 / D7 — §3.11's "machinery that already exists… with no further code"
   is FALSE as measured.** A design volume's own reach claim refuted at source.
   This is the finding that reversed D2 and it is the reason the packet is
   worth building at all.
4. **§6.2 / D6 — `ABSENT_W = 0.5` authored by parity.** Chair-authored dark
   tuning under CR-ES5B-6, individually vetoable, owner-signed at soak.

The compiling lane does **not** append to `FABLE_VALIDATION_QUEUE.md`. The
chair does, at promotion.
