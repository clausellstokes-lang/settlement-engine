---
name: ""
metadata: 
  node_type: memory
  created: 2026-08-04
  lane: "WZ-3 (WR-8 razing wiring, under chair ruling CR-PK-1)"
  commits: "d5b0fca8, b43986b5, 2d24ac3d, e5ceb2f2, 32035947"
  branch: claude/composite-r4 (worktree .claude/worktrees/minifold)
  status: WR-8 STILL OPEN — dispatch item 4 is one quarter built
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-04T04:53:17.574Z
---

# WZ-3 — the lint pair's false premise, the razing accumulator, and item 4's measured remainder

## Why this matters

A chair ruling (CR-PK-1) was built on a lane's recorded analysis that turned out
to be **false on both legs**. Four waves of work had been shaped around it. The
cure was a five-minute parse-tree check that nobody had run. Verify a recorded
analysis against source before building a ruling on top of it.

## 1. ⚠️⚠️ THE FALSE PREMISE, and the method that killed it

WZ-2 recorded `pulseKernel.js`'s two `no-useless-assignment` errors (1426:7,
1427:7) as unfixable: "`reasonCoalitionEvidence`'s reassignment sits INSIDE the
peace-engine conditional, so dropping the `= []` hands `undefined` to
`mergeWarCoalitionEvidence` on the peace-dark path."

Both legs are false:

1. **It is not inside a conditional.** Read off espree rather than off the
   indentation, the enclosing chain is
   `FunctionDeclaration@224 > BlockStatement@224 > BlockStatement@2569` — a
   **bare lexical block** that scopes `peaceCausal`. No `if` anywhere above it.
   The treaty assignment sits at body level with no block at all.
2. **`undefined` ≡ `[]` at that consumer.** `mergeWarCoalitionEvidence(...groups)`
   iterates `Array.isArray(group) ? group : []`. A missing group contributes
   nothing, by construction.

**HOW TO APPLY.** When an indentation-based claim about control flow is
load-bearing, check it with the parser, not the eye. Recipe (node resolves
espree by absolute path from outside the repo):

```js
import { parse } from '<repo>/node_modules/espree/dist/espree.cjs';
// walk with a stack; print the Function/If/Block chain for the target line
```

And always read the CONSUMER before believing a "this would hand it undefined"
claim — the guard is usually already there.

## 2. The invariant is now pinned at the consumer

`tests/domain/warCoalitionPulse.test.js` asserts empty/undefined/null groups merge
identically **around a real shared group** (non-vacuity). A future edit that makes
a kernel assignment conditional is safe by that contract.

## 3. ⚠️⚠️ THE RAZING ACCUMULATOR SEAM (`licenseState`)

The mouth's razing branch lives INSIDE the per-target siege loop in
`warDeployment.js`, so a tick that wins two sieges calls `razingSiegeEmission`
twice, and `evaluateWarLayer` carries exactly ONE `worldStatePatch` home. Both
calls derived from the same untouched worldState ⇒ the second patch REPLACED the
first ⇒ one town's mourners silently lost their vengeance licenses. Inert while
the patch went nowhere; **landing the spread is what made it real**.

**The cure is a two-argument split, and the split is the point:**
`razingSiegeEmission({ worldState, licenseState })` — `licenseState` is the
accumulating ledger (threaded by the mouth, folded forward after each razing) and
is read **only by the mint**; `worldState` stays the tick's ORIGINAL picture for
every DECISION read. Collapsing them would let a license minted by the first
burning arm the second on the same tick — the eye-for-an-eye cascade re-entering
through the door opened to stop a leak. `licenseState` absent ⇒ falls back to
`worldState` ⇒ byte-identical for single-razing ticks.

## 4. ⚠️ Two mutants survived first

- **The MOUTH's fold** survived every suite (the leaf seam was proved, the mouth's
  threading was not). It now carries a **structural** pin, labelled as such on its
  face; a behavioural mouth proof needs two sieges won on one tick = a seed search.
- **The siege-ceiling pin was SELF-REFERENTIAL**: it drove the arm with
  `siegeAge: SIEGE_MAX_AGE`, the very constant that defines the ceiling, so a
  mutant moving the ceiling moved the input with it. Cure = pin the tuned value,
  drive with a **literal**, assert the arm's own receipt + its no-roll signature
  (`roll 0 / pFall 1 / band costly_success`), and add a control one tick below.
  See also [[self-referential-pin-class]].

## 5. E-H lit coverage: a decomposition converts direct proof into incidental exercise

`mechanismLitCoverage` grants AUTO credit only when a lit-eligible test **imports
that module**. THE DECOMPOSITION WAVE's record treated the five WD leaves as
covered through the parent's suite; `warDeployment.test.js` drives the PARENT, so
they were exercised incidentally and proven nowhere. `tests/domain/warDeploymentLeaves.test.js`
(18 tests) closes it honestly — uncovered modules 35 → 30. **An import alone would
satisfy the walker while proving nothing; never take that shortcut.**

## 6. Item 4's remainder, measured so the next lane does not re-derive it

- **(4c) BUILT** — `razing` was an UNROUTED Herald token (the single orphan reddening
  `heraldRouting.walker` at base). Now files under `war`.
- **(4b) MEASURED** — WR-6's believed-retaliation deterrence is `readAllianceWebRisk`
  in `warAllianceRisk.js`, with **exactly ONE runtime consumer**
  (`warCoalitionDecision.js`); everything else is registry/doc/test. **No rebuilt
  web exists — the razing must CONSUME that function, never grow a second.**
- **(4d) THE CR-WR8-H GATE IS ANSWERED — NO OWNER GATE NEEDED.** `scoreAtrocityAnswer`
  still has no caller and `advanceWarReasons` passes no `razings`. Believed razings
  are derivable from surfaces that already persist: the news ledger + `distancePricedNews.js`
  (`hopDelayTicks` / `routeAwareHopDelayTicks`). A pure read model filtering
  razing-kind news whose stamped tick + observer hop delay has come mints **no new
  persisted surface**, which is exactly what CR-WR8-H permits. WZ-1's F1 worry is
  retired.
- **(4a) NOT BUILT, NOT MEASURED** — the observer-axis relationship hits.

## 7. Still owner-gated (parked, not owed by this wave)

K1 severity carry (`dmSeverity` on a PERSISTED institution-status record), seat
ransom, ransom persistence, counterpart re-mint.

## Verification receipts

Same-seed whole-pipeline hash (3 rule sets × 2 seeds × 24 ticks) byte-identical
across both source changes; **its own limit recorded** — two negative controls
deleting each coalition-evidence group from the merge BOTH SURVIVED, so that hash
does not independently cover those variables. Eleven mutants, all red, sources
restored sha256-exact. pulseKernel **1580 effective before and after** (net-zero,
R-BLD-10's bank intact). Strict 1317/1317 flat. tests/lint/ failure sets diffed
against a temp worktree at clean base `af1b9d38`: **zero new reds, two cleared**
(34/13 → 32/12), both of them WZ-2's own.
