---
name: unlayered-census-growth-rules-are-prose-only
description: "⭐⭐ FOUND AND CLOSED 2026-08-10 in couplingInclusion.walker.test.js: both rules protecting the unlayered census were PROSE-ONLY. The arm titled 'never grew' constrained no SIZE (exact-set equality moves BOTH sides together, so a new module smuggled in WITH its baseline line passed 16/16 GREEN — measured), and the roster ceiling was toBeLessThanOrEqual so a dissolved argument left an unrecorded free slot. Both now EXACT (UNLAYERED_BASELINE_CEILING = 179, roster .toBe). ⚠⚠ THE TRANSFERABLE LESSON: read the ASSERTION, never the test title — a name containing 'frozen'/'never grew'/'shrink-only' is a claim, not a guard."
metadata: 
  node_type: memory
  type: project
  date: 2026-08-10
  originSessionId: 98a1aee5-7467-48f4-997f-590f5ad3db26
  modified: 2026-08-10T18:48:43.335Z
---

Found while discharging the IA-1/6e7acc4d classification miss
([[coupling-inclusion-argued-roster-13]]), fixed in the same unstaged change once the
owner said to.

## The file that rails against this, and then did it twice

`tests/lint/couplingInclusion.walker.test.js` is the walker whose own header says a
narrow exception "shipped as this paragraph plus a `note` on one baseline entry, and
**a paragraph checks nothing**" — and then built `BASELINE_RETARGETS` to fix it. Two
of its other stated laws never got that treatment.

**(1) THE UNLAYERED BASELINE HAD NO SIZE GUARD.** `DESIGN_FP_ARCHITECTURE.md` states
the rule absolutely: "the unlayered baseline MAY NEVER GROW — such a file takes a NEW
`ARGUED_UNLAYERED` entry with a written reason in the same commit, never a baseline
row." The test *named* `'the frozen unlayered set is exact, unique, in scope, and
never grew'` checked an anti-vacuity floor, uniqueness, in-scope-and-still-exists, and
exact-set equality against `LIVE_UNLAYERED` — **and nothing about the size.**
Exact-set equality is the trap: a lane that lands a new unlayered module *and* adds
its baseline line moves BOTH sides of that equality together.

**(2) THE ROSTER CEILING WAS AN INEQUALITY.** `toBeLessThanOrEqual`, while the two
registers beside it (`BASELINE_RETARGETS` `toHaveLength(1)`, `REACH_OWED_ROWS`
`toHaveLength(2)`) were exact from birth. Its own docblock said "Lowering it when an
argument dissolves banks the win" and also "It is a CEILING, not a target" — the two
halves contradicted, and under `<=` the shrink half was unenforceable. A dissolved
argument left headroom that no diff recorded, so the next admission rode in through
the free slot with no review trigger.

## ⭐ THE MATCHED PAIR — the gap was MEASURED, not merely argued

Plant the actual defect shape: a zero-import module `zzGrowthProbe.js` under
`src/domain/worldPulse/` **plus** its line in `.coupling-unlayered-baseline.json`.

| Walker | Result |
|---|---|
| as it stood ten minutes earlier | **16/16 GREEN** — the forbidden growth completely silent |
| with the size pin | **1 failed / 15 passed**, "the unlayered census CHANGED SIZE", `expected 180 to be 179` |

Isolated control for the other arm: raise `ARGUED_ROSTER_CEILING` 13→14 leaving the
roster at 13 → exactly 1 red, "the argued roster no longer matches
ARGUED_ROSTER_CEILING". Under the old `<=` that state was green.

Both cures are EXACT, not `<=`, for the same reason: a bound that only forbids growth
lets a shrink go unbanked and leaves invisible headroom behind it. The census
legitimately shrinks whenever a baselined module finds a layer home, and the existing
"found a home" arm already reds to demand the line be deleted; exactness makes that
same event also move the recorded size. That is the sizeBaseline honesty idiom the
header already cited for the pair inventory, finally applied to the module census.

## ⚠⚠ HOW TO APPLY — the part that outlives this file

**Read the ASSERTION, never the test title, and never the header.** This is the
reference case: the most machinery-conscious walker in the estate carried two laws
that existed only as sentences, inside a file that explicitly polices exactly that.
Before citing any "frozen", "shrink-only", "ceiling" or "never grows" claim, open the
`expect(...)` and check the operator. `toBeLessThanOrEqual` where you expected `toBe`
is a budget wearing a ratchet's name.

**And build the defect shape before believing the cure.** The GREEN control is what
made this real — without it "the baseline has no growth guard" would have been a
reading of the code rather than a demonstrated hole.

⚠ One thing this did NOT fix: the *pair* baseline (`.coupling-inclusion-baseline.json`)
still has only `toBeGreaterThan(100)` and no size pin. Its shrink-only-ness is enforced
structurally instead — a dead pair reds the "GONE" arm — so the growth door there is
narrower, but it is not closed the same way. Deliberately left; documented, not a bug
to re-find.

Related: [[coupling-inclusion-argued-roster-13]] ·
[[derive-dont-restate-and-mutant-must-change]] ·
[[receipt-vacuity-and-shared-ratchet-rules]] · [[sizebaseline-exact-ceiling-hazard]]
