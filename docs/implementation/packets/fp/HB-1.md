# HB / HB-1 — THE ACTION VOCABULARIES + THE FORK REGISTRY (train `hb-1`, member M2)

**Preamble:** `docs/implementation/preambles/HB-PREAMBLE.md` at SHA-256
`2cf2407d93cef46ce647a88e235e2a9a84f68c310f9f4ccd7b01d14c9f9eb215`.

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `6784bf62de455ca13b701c09b6b241476cf9d555`
- **Ruled:** `OWNER_DECISION_QUEUE.md` §36 signed all four of this wave's preconditions —
  **CR-HB1-R21** (the corrected `martialMoves` act: a NAMED DERIVED SUBSET, never a
  retirement; the charter's literal clause was a live war-chooser behaviour change and is
  struck), **CR-HB1-R24** (net-zero at 812; HB-5 recompiles against that), **CR-HB1-W**
  (the three J-HB-23 assertions live in `chooserTotality.walker.test.js` — the §4 charter
  outranks §3c's prose), and **CR-HB1-C1** (HABIT MINTS the shared move vocabulary; the
  two-export leaf shape; this wave's at-most-one-exporter scan discharges WC-0's
  structural half).
- **Builds at:** the train's I2 commit, on M1's I1 commit. ⛔ **There is no truncation
  boundary inside this member** — its four instruments share the totality denominator and
  the roster ceiling, and a partial M2 lands a registry whose walker asserts a partition it
  has not completed.
- **Collision group:** ⚠ **the war lane** — `settlementStrategy.js` +
  `settlementPolitics.js`, the estate's most-edited files. **CHECK-GIT-FIRST is MANDATORY
  immediately before I2.** It also shares `tests/lint/couplingInclusion.walker.test.js`
  with M1 — ⛔ **RE-READ that file at I2 at its live state; a blind 13 → 15 patch reds the
  exact-equality arm** (the §36 executor tripwire).
- **Census holder:** this packet takes the estate lighting-census reservation, which the
  INDEX records as free. It is the last commit in the train that moves a `tests/` byte,
  which is what leaves the terminal docs-only.
- **Flag:** **NONE.** **Persisted shape:** **NONE.** **Coupling row:** **NONE.**
- **Commit authority:** the `hb-1` train's private ref only.

---

## 1. Scope and boundary

> **Boundary sentence.** HB-1 mints the estate's single closed strategy-move vocabulary and
> the habit fork registry, deletes one dead disjunct, and lands the two totality walkers
> that make both frozen. **It does NOT** mint a flag, read `worldState`, add a habit load
> anywhere, change any move's score, move a persisted shape, or edit `convergence.js`
> (a read-only shape reference at 798/800 — hot).

**No row says LEARN in this wave.** Every fork row that the volume disposes toward learning
lands DEFER with a written `closeOwed`, so the registry is born seeing the whole surface and
later waves only shrink the defer list. The volume's PERMANENT rulings are preserved as
they stand: a row it rules STAY-DETERMINISTIC lands STAY, because recording a permanent
ruling as a deferral would be a false record, not caution.

## 2. The behaviour/identity contract

**IDENTITY: byte-identical same-seed goldens, and the proof is corrected from the volume's
own false one.**

⛔ **THE COMPILE'S PROOF — *"an arm that never fired cannot change an output"* — IS FALSE
AND THE VOLUME ALREADY RETRACTED IT (R7).** The arm at `settlementPolitics.js:635` is a
**DISJUNCTION** — `} else if (move === 'fortify' || move === 'defend') {` — and **it
FIRES**, through `defend`, which `enumerateMoves` emits unconditionally. **An implementer
who deletes the whole `else if` deletes live behaviour** and will read the resulting golden
red as an error somewhere else.

**THE CORRECTED PROOF, in two steps, the second checking the first rather than replacing
it:**

1. **EXECUTED ENUMERATION.** For every move `enumerateMoves` actually emits, **no emitted
   move satisfies the removed disjunct** — so the disjunction's truth value is unchanged
   move-for-move. MEASURED: `'fortify'` appears in `src/domain/worldPulse/` only at
   `settlementPolitics.js:615` (a JSDoc line), `:635` (the disjunct), and in
   `mobilizationReactions.js` — **a different vocabulary's own move set.** The defect is a
   **CROSS-VOCABULARY COLLISION**, not a phantom.
2. **SAME-SEED GOLDENS UNCHANGED**, as the CHECK on that reasoning, never as its substitute.

## 3. ⚠⚠ THE THREE CHARTER CORRECTIONS (all signed at §36)

### 3.1 R21 — the `martialMoves` retirement is a BEHAVIOUR CHANGE as written

**THE CHARTER SAYS:** *"retire `settlementStrategy`'s local `martialMoves` Set to it
[`STRATEGY_MOVES`]"*, on §1.3's premise that *"a THIRD hand-maintained copy lives in a local
`martialMoves` Set."* **BOTH HALVES ARE REFUTED.** MEASURED at `settlementStrategy.js:801`:
an **EIGHT-member** Set, a deliberate PROPER SUBSET of the eleven, excluding `reroute`,
`embargo` and `legitimacy` — **all three of which ARE emitted moves.** It is not a copy of
the vocabulary; it is a **semantic predicate**, and its single consumer says so in-source:
*"Martial history already entered this move through computeAggressiveness. Record that
single consumption here; never multiply the bar by it again."*

⛔ **RETIRING AN 8-MEMBER PREDICATE TO AN 11-MEMBER TOTALITY MAKES THE MEMBERSHIP TEST TRUE
FOR THREE MOVES THAT DELIBERATELY CARRY NO MARTIAL REASON**, appending a
`dispositionReasons` entry wherever the martial factor is not exactly one. **That is live
behaviour on the estate's most contended chooser** — the exact R7 failure mode this volume
documents once already.

**THE CORRECTED ACT (CR-HB1-R21).** The set becomes a **NAMED DERIVED SUBSET** exported
from the new leaf, with its three exclusions pinned BY NAME:

```js
export const NON_MARTIAL_HISTORY_MOVES = Object.freeze(['embargo', 'legitimacy', 'reroute']);
export const MARTIAL_HISTORY_MOVES = Object.freeze(
  STRATEGY_MOVES.filter((move) => !NON_MARTIAL_HISTORY_MOVES.includes(move)),
);
```

**Drift prevention is fully preserved** — membership now derives from the frozen totality
and a named, pinned exclusion list — **and behaviour is not touched.** Case **A4** asserts
the subset relation, the length of eight, and the three exclusions BY NAME; mutant **M-3**
widens it to the totality and must red.

### 3.2 R24 — HB-1 BUYS NO HEADROOM

**THE CHARTER SAYS** the wave's net effect on `settlementStrategy.js` is a RATCHET-DOWN and
that the size baseline moves down in this commit. **MEASURED: THERE IS NO HEADROOM TO BUY.**
`settlementStrategy.js` is **812** effective lines by the ENFORCER against a baseline of
**812**; the `martialMoves` declaration is **ONE** effective line; replacing it with an
import of the derived subset is a **one-for-one swap**. **Net effect: ZERO.**

**THE CORRECTED POSTURE (CR-HB1-R24).** This wave declares **NET ZERO**; the baseline stays
at 812 and `scripts/.size-baseline.json` is **NOT in this manifest**. ⚠ The ratchet is
tolerance-ZERO in BOTH directions, so a measured **+1** is a hard STOP and a measured **−1**
must be banked by lowering the baseline in the same commit.

⚠ **THE SHAPE THAT KEEPS IT AT ZERO IS PART OF THE INSTRUCTION, NOT AN IMPLEMENTER'S
CHOICE.** One import line replaces one declaration line, and the consumer becomes an
`includes` test over the exported ARRAY. Re-wrapping the import in `new Set(...)` at the
call site would keep a declaration line AND add an import line — a measured **+1**, which is
the hard STOP above.

⚠⚠ **THE CONSEQUENCE FOR HB-5, STATED HERE RATHER THAN DISCOVERED THERE: HB-5's declared
per-file delta has NO bought headroom behind it.** HB-5 must find its lines in a real
decomposition or re-charter.

### 3.3 CR-HB1-W — the two-walker-name contradiction

§4's HB-1 charter says land the three J-HB-23 assertions in
`tests/lint/chooserTotality.walker.test.js`; §3c's normative quote block says
`habitDomainChecklist.walker`. **One obligation, two addresses — the exact R13 class the
volume itself reds.** **RULED (CR-HB1-W): ONE walker file,
`tests/lint/chooserTotality.walker.test.js`, carries all of it.** §4 is the DISPATCH
charter; the three checklist assertions and the idiom-partition assertions share one
denominator, and splitting them would give two files two views of one source.

## 4. ⚠⚠ CROSS-VOLUME COLLISION C1 — THE BINDING CONSTRAINT ON THIS WAVE

`DESIGN_FP_ARCH_WC.md` §4.1.1: *"exactly ONE module exports the closed move vocabulary,
whichever volume BUILDS ITS STRATEGY WAVE FIRST mints it as a dependency-free leaf … the
second volume AMENDS the same leaf and does not mint."*

**MEASURED AT `6784bf62` — the arbitration resolves in HB's favour on facts:** WC-0 has NOT
landed (`lawBandModulation.js`, `contributionMoves.js`, `contributionDispatch.js`,
`strategyMoveVocabulary.js` all ABSENT); WC's single-exporter fences do not exist;
`warCirculationEnabled` / `contributionLedgerEnabled` are unminted; and WC's own measured
fact still holds — `enumerateMoves` is module-private with a bare re-export, and the file's
only vocabulary export is `STRATEGY_TUNING`. **HB-1 builds first, so HABIT MINTS.**

**THREE OBLIGATIONS FOLLOW, AND THIS PACKET CARRIES ALL THREE:**

**(1) `strategyMoves.js` IS DEPENDENCY-FREE — ZERO IMPORTS, PINNED (case A5).**
⛔ **THIS OVERRIDES HB-1's CHARTER CLAUSE** *"retire `scoringObjective`'s implicit lever set
to a derived export"*: deriving the totality from `scoringObjective.js` would give the
shared leaf a dependency and **break C1's contract on its first day.** **THE DIRECTION
REVERSES** — the leaf stays frozen and zero-import; `scoringObjective.js`'s lever keys are
pinned ⊆ `STRATEGY_MOVES` **from the test side** (case A2), and
**`scoringObjective.js` leaves this manifest entirely.**

**(2) THE LEAF IS SHAPED FOR AN ADDITIVE WIDENING IT DOES NOT YET CONTAIN.**
⚠⚠ **THE REAL HAZARD, AND NEITHER VOLUME NAMES IT.** HB-1's totality pin makes
`STRATEGY_MOVES` **exactly the emitter's set**. WC-4's three auxiliary moves are
**dispatched, never emitted**, so a naive additive widening at WC-4 **REDS HB-1's own
totality pin.** The cure costs nothing now: the leaf exports `STRATEGY_MOVES` (the emitted
totality, pinned against the emitter) **and** `ALL_MOVE_TOKENS` (the union the fences key
on), asserted **equal today**, with a named comment that WC-4's amendment moves the union
and not the emitted set.

**(3) THE FENCE WC-0 WAS SUPPOSED TO LAND FIRST DOES NOT EXIST, SO THIS WAVE LANDS IT.**
`tests/lint/strategyMoveVocabulary.walker.test.js` ships **WC-0's structural half** — the
**AT-MOST-ONE-EXPORTER** scan — landed by the volume that got there first. CR-HB1-C1 records
that as DISCHARGING WC-0's obligation rather than duplicating it. ⚠ The inbound half — the
reciprocal clause in the habit directive's memory file and `FABLE_VALIDATION_QUEUE.md` —
**remains owed by WC's fold.**

## 5. The exact manifest, with budgets

| # | Action | Path | Budget (effective lines, ENFORCER) |
|---|---|---|---|
| 1 | CREATE | `src/domain/worldPulse/strategyMoves.js` | **≤ 120** (ceiling 800) |
| 2 | CREATE | `src/domain/worldPulse/habitForkRegistry.js` | **≤ 600** (ceiling 800) — ⚠ §9 risk 1 |
| 3 | MODIFY | `src/domain/worldPulse/settlementStrategy.js` | **NET ZERO**, 812 → 812 (R24) |
| 4 | MODIFY | `src/domain/worldPulse/settlementPolitics.js` | **NET ZERO**, 560 → 560 (ceiling 800, not baselined) |
| 5 | CREATE | `tests/domain/strategyMoves.test.js` | 8 literal `test` + 1 `describe` |
| 6 | CREATE | `tests/domain/habitForkRegistry.test.js` | 6 literal `test` + 1 `describe` |
| 7 | CREATE | `tests/lint/chooserTotality.walker.test.js` | 8 literal `test` + 1 `describe` |
| 8 | CREATE | `tests/lint/strategyMoveVocabulary.walker.test.js` | 6 literal `test` + 1 `describe` |
| 9 | REGISTER | `tests/lint/couplingInclusion.walker.test.js` | +2 rows, ceiling **15 → 17** |
| 10 | REGISTER | `tests/lint/sovereigntyLightingContract.walker.test.js` | the WHOLE census re-derived here |
| 11 | REGISTER | `scripts/mutation-coverage-manifest.json` | +2 entries for the two new enforcer files |

⛔ **NO OTHER PATH.** In particular: **no** `scripts/.size-baseline.json` (R24), **no**
`scoringObjective.js` (C1 obligation 1), **no** `convergence.js` (**hot at 798/800** — a
read-only shape reference only), **no** `mobilizationReactions.js` (its `'fortify'` is its
own vocabulary's and is NOT touched), **no** flag manifest, **no** coupling registry, **no**
`scripts/mutation-sweep.sh` (a planted sweep mutation is a two-file edit this wave has not
declared), and **no** `pulseKernel.js` / `applyWorldPulse.js` (L1).

### 5.1 THE REGISTRATION TEMPLATE AT FULL STRENGTH (OQ §35.3 — instance five)

| Part | Address |
|---|---|
| **THE ROWS** | `ARGUED_UNLAYERED['src/domain/worldPulse/strategyMoves.js']` and `ARGUED_UNLAYERED['src/domain/worldPulse/habitForkRegistry.js']`, each `{ kind: 'substrate', reason: <over 20 chars>, reads: Object.freeze([]) }` |
| **THE HEAD RE-EXPORT** | **NONE, and the absence is the argument.** ⚠ For `strategyMoves.js` it is **doubly load-bearing**: C1 requires a dependency-free leaf, and a head re-export is how a dependency arrives by the back door. |
| **THE EXACT-LIST PIN** | `ARGUED_ROSTER_CEILING`, **15 → 17**, in the SAME commit — `toBe()`, exact both directions |
| **THE REGISTRY TEST PATH** | `tests/lint/couplingInclusion.walker.test.js` |

**`reads: []` IS THE MEASURED ANSWER FOR BOTH LEAVES**, re-measured rather than copied:
`strategyMoves.js` has **zero imports** (C1); `habitForkRegistry.js` imports only
`habitVocabulary.js`, which M1 made `ARGUED_UNLAYERED` and therefore absent from the layer
map. ⚠ **This differs from M1's `habitVocabulary.js` row, which carries a NON-empty
`reads`** — the two members' registration rows are not interchangeable.

⛔ **RE-READ THE ROSTER AT I2.** M1 leaves it at fifteen.

### 5.2 ⚠⚠ THE OUTSIDE-THE-EXPORT PREDICATE — UNDER-SPECIFIED IN THE VOLUME, DEFINED HERE

The volume asks for *"a walker that reds any module branching on a strategy-move token
outside the frozen export."* **Read literally, that predicate reds the tree on day one**,
and the executor must not discover this at I2. **MEASURED at `6784bf62`, ten `src` modules
compare a strategy-move literal**, and they fall into two kinds that a token scan alone
cannot tell apart:

- **FOUR are genuine strategy-move branchers** — `settlementStrategy.js` (the chooser
  itself), `settlementPolitics.js` (the bloc decision load, which takes the move key as an
  argument), `momentum.js` (the commitment load) and `warIntent.js` (the deploy order).
- **SIX compare a word that belongs to a DIFFERENT closed vocabulary** — `convergence.js`
  spells the engagement posture's own member; `npcLadderContest.js` and `npcLadderState.js`
  spell a ladder posture; `generosityKernel.js` and `generosityReactions.js` spell a
  generosity act; `factionCompetition.js` spells a competition axis.

⚠⚠ **THAT SECOND GROUP NARROWS A CLAIM THE COMPILE MADE.** The draft reasoned that once
HB-1 mints the eleven, the cross-vocabulary collision *"becomes impossible because the two
vocabularies no longer share a member"*. **That is true of `'fortify'` and
`mobilizationReactions.js`, and false in general:** three move words are shared with three
other closed vocabularies today, measured. The structural cure is therefore the REGISTER,
not the disjointness.

**THE DEFINED PREDICATE, and it is two arms:**

1. **THE BRANCHER REGISTER.** A frozen `MOVE_TOKEN_BRANCHERS` register names every module
   that compares a member of `ALL_MOVE_TOKENS` as a literal, each row carrying its tokens,
   its `kind` (`strategy` or `foreign-vocabulary`), and a written reason naming the foreign
   vocabulary where that applies. Exact set equality against the live scan, BOTH
   directions, so a new brancher reds and a dissolved one must be banked.
2. **THE OWNER ARM, which is what the guard-the-guard reds.** Inside a `strategy`-kind
   module, every literal compared against a move-named identifier must be a MEMBER of
   `ALL_MOVE_TOKENS`. A re-inserted `move === 'fortify'` in `settlementPolitics.js` is a
   comparison against a NON-member inside an owner module, so it reds by name — which the
   membership scan of arm 1 could never see, because `'fortify'` is not in the vocabulary.

⚠ **THE `settlementPolitics.js` JSDoc IS CORRECTED IN THE SAME EDIT** — the parameter line
still advertises the token this wave is deleting. Comments are skipped for size but they are
what the next reader believes, and a doc line left naming a deleted token is how R7 happened
the first time.

## 6. Acceptance cases (denominator 8)

| # | Case |
|---|---|
| **A1** | ⭐ **THE EMITTER IS THE DENOMINATOR.** `STRATEGY_MOVES` equals the set `enumerateMoves` actually emits, measured across every exported scoring objective — **never a hand list**. Both directions. |
| **A2** | **NO MODULE BRANCHES ON A STRATEGY-MOVE TOKEN OUTSIDE THE FROZEN EXPORT**, under §5.2's two-arm predicate; and `scoringObjective.js`'s lever keys are asserted ⊆ `STRATEGY_MOVES` from the TEST side (C1 obligation 1). |
| **A3** | ⭐ **GUARD-THE-GUARD ON A2:** the walker **REDS on a planted `move === 'fortify'` re-insertion**, or it is not watching the thing it was built for. |
| **A4** | **THE CORRECTED `martialMoves` ACT (R21):** `MARTIAL_HISTORY_MOVES` ⊂ `STRATEGY_MOVES`, length 8, and the three exclusions asserted BY NAME. |
| **A5** | **C1's LEAF CONTRACT:** `strategyMoves.js` has **zero imports** (source scan); `ALL_MOVE_TOKENS` **equals** `STRATEGY_MOVES` today; and the **AT-MOST-ONE-EXPORTER** scan holds tree-wide (WC-0's structural half). |
| **A6** | **THE DISJUNCT DELETION'S BEHAVIOUR IDENTITY:** the executed enumeration showing no emitted move satisfies the removed disjunct, **THEN** the bloc decision load asserted unchanged move-for-move as the CHECK. |
| **A7** | ⭐⭐ **THE REGISTRY'S THREE J-HB-23 ASSERTIONS**, verbatim: **(a) FOURTEEN** named-domain rows, each with a disposition and a **non-empty** reason; **(b)** the label set asserted **SET-EQUAL both directions** to the closed explicit eight — ⛔ **a distinct-string count is the vacuous form and is REFUSED**; **(c)** the owner's SEVEN spoken domains mapped TOTAL onto those eight, *"goals, and goal orientation"* → **BOTH** labels. |
| **A8** | **THE PARTITION AND ITS UNIQUENESS ARMS:** `classified` equals `discovered` both directions over the FOUR idiom signatures across `worldPulse`, `spatial` **and `traditions`** (the R15 root widening); the **ROOT-SET** self-assertion; `symbolsWithTwoDispositions` empty (R13); `symbolsWithTwoArities` empty; **every DEFER row's `closeOwed` non-empty**; DEFER shrink-only; plus the registry's own guard-the-guard. |

## 7. Wave-specific mutants

| # | Mutant | Must RED |
|---|---|---|
| M-1 | **Re-insert `move === 'fortify' \|\|`** in `settlementPolitics.js` | A3 — the guard-the-guard |
| M-2 | **Delete the whole `else if` arm** (the compile's false ruling) | A6 — proving the arm is LIVE through `defend` |
| M-3 | **Widen `MARTIAL_HISTORY_MOVES` to `STRATEGY_MOVES`** | A4 — R21's whole argument, executed |
| M-4 | **Add a second exporter of the move list** in another module | A5's at-most-one-exporter scan (C1's fence) |
| M-5 | **Drop one named-domain row** from the registry | A7(a) — the FOURTEEN count |
| M-6 | **Misspell one domain label** in one row | A7(b) — ⛔ and it must red the **SET EQUALITY**, which a distinct-string count would NOT catch |
| M-7 | **Give one symbol two arities** across rows | A8's arity-uniqueness arm |
| M-8 | **Remove `src/domain/traditions` from the scan roots** | A8's ROOT-SET self-assertion (R15: a totality walker whose roots miss a whole domain directory does not report a gap; it reports SUCCESS) |

⚠ **M-5 mutates the TABLE, not the recorded count** — a count mutant on a literal goes
vacuous. All mutants restore digest-exact (`cmp`-proved).

## 8. The checks (bare, in-shell, unpiped, each `; echo TRUE_EXIT=$?`)

```
npx vitest run tests/domain/strategyMoves.test.js tests/domain/habitForkRegistry.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/chooserTotality.walker.test.js tests/lint/strategyMoveVocabulary.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/domain/settlementPolitics.test.js tests/domain/settlementStrategy.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/sizeBaseline.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/couplingInclusion.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/mutationCoverageManifest.test.js ; echo TRUE_EXIT=$?
node scripts/check-observed-shape-readers.mjs ; echo TRUE_EXIT=$?
npm run typecheck:ratchet ; echo TRUE_EXIT=$?
npm run typecheck:domain:strict ; echo TRUE_EXIT=$?
```

⛔ **NEVER wrap any of these in `gate-mutex.sh --run`.** The bare full gate and `smoke:boot`
belong to **T**.

**§31 ANCHOR PREFLIGHT — MANDATORY.** All four new test files are NEW ⇒ `ceilingFor` = **0**.
⚠ The two walker files are the high-risk ones: absence claims over `offenders`-style
collections naturally reach for a bare negative matcher.

## 9. Declared census movement (J-TE3-1 — BY FIGURE)

`2421/366/2055/20046/5646` (M1's I1 state) → **`2425/366/2059/20074/5650`**
(**+4 files / +0 parked / +4 credited / +28 titles / +4 suite titles**). ⭐ **THE WHOLE
TUPLE IS RE-DERIVED AT THIS COMMIT**, which cures M1's named interior red and leaves the
terminal docs-only. `runtimeTests` +28 → **28090**. **Parked stays at 366:** every title is
a literal in a straight-line registration — ⛔ **no `test.each()`, no `describe.runIf()`.**

## 10. Risks and open items

1. **`habitForkRegistry.js` size.** Declared ≤ 600, STOP at 800. ⚠ The split contingency
   costs a **THIRD** `ARGUED_UNLAYERED` entry and takes the roster to **18**, not 17 — the
   census and the plan's figures then move and must be **re-derived, not patched**.
2. **CHECK-GIT-FIRST on the war lane** immediately before I2.
3. **Not taken, recorded:** the `ruinFilterRoster.walker.test.js` `codeOnly()` defect
   (OQ §33 ruling 3) is the same shape as the family's H-A hazard in its *broader*
   direction. **It is a separate queued micro-act and is NOT repaired here.**
4. **The WC inbound half remains owed** — until it exists the arbitration is a
   recommendation with a fence, by WC's own words, and after this train the fence exists.
