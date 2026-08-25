---
name: app-shell-suite-census-and-app-prefix-grep-trap
description: "⚠️⚠️ The creditLedger leaf-mock class is FIVE suites, now all cured @ 456271ea — and `grep 'render(<App'` FALSELY counts `render(<ApplyControls` as a member, which is how a brief named a non-member and missed a live red"
metadata: 
  node_type: memory
  created: 2026-08-04
  tags: 
    - vitest
    - jsdom
    - gate-hazard
    - census
    - grep-trap
    - creditLedger
  type: project
  originSessionId: 67345a0e-2f81-4ca1-a48d-c037cb9d6da2
  modified: 2026-08-04T16:01:45.387Z
---

# The App-shell suite census — closed 2026-08-04 @ `456271ea`

`.claude/worktrees/minifold`, branch `claude/composite-r4`. The class described in
[[vitest-dynamic-import-escapes-module-mock]] is now **fully cured**. The complete
membership, established by census rather than by inheriting a brief's list:

| suite | `render(<App />)` | leaf mock |
|---|---|---|
| `navFlowArrows.test.jsx` | 5 | committed earlier |
| `navFletching.test.jsx` | 28 | cured 2026-08-04, **committed @ `ac377738`** (3/3 solo runs green, 70/70) |
| `navDividers.test.jsx` | 9 | **cured @ `456271ea`** |
| `appShellResilience.test.jsx` | 6 | cured @ `456271ea` |
| `landingFooterMigration.test.jsx` | 2 | cured @ `456271ea` |

## ⚠️⚠️ THE GREP TRAP THAT CORRUPTED THE BRIEF — `<App` is a PREFIX

A brief built on `grep -c 'render(<App'` reported `destroyConfirmSurfaces.test.jsx`
as a member with 1 site. **It has zero.** The match was
`render(<ApplyControls {...props} />)` — `<App` is a literal prefix of
`<ApplyControls`. The file never imports `src/App.jsx` at all.

The same grep, lacking a delimiter, is also why the brief **missed `navDividers.test.jsx`**,
which was the only suite actually RED.

**The cure for the census, not just the bug:** membership in this class is
"imports `src/App.jsx`", not "matches a render regex". Enumerate with
`grep -rln "src/App.jsx" tests/`, then confirm with a DELIMITED render probe
(`grep -c 'render(<App[ /)>]'`). Related: [[self-referential-pin-class]],
[[filename-anchored-source-pin-vacuity]].

## ⚠️ "PREVENTIVE HARDENING" WAS FALSE FOR ONE MEMBER — measure before believing it

The brief asserted all three named suites were green on 3 consecutive solo runs, so
this was preventive. True for the two real members it named. But the unnamed
`navDividers.test.jsx` measured **EXIT 1 on 2 of 9 solo runs** at `1453676b`, with all
12 tests passing every time and **exactly 9 `EnvironmentTeardownError`s against its 9
shell renders** — the diagnostic law from [[vitest-dynamic-import-escapes-module-mock]]
holding to the digit. After the mock: 18 of 18 runs EXIT 0.

Note the combined 5-file run was green 3 of 3 at baseline while `navDividers` alone was
red — **the combined gate is NOT a superset of the solo red here.** Measure solo too.

## ⚠️ THE MOCK PROVABLY VOIDS NO PIN — the argument to reuse

Every member already stubs supabase with `isConfigured: false`. The REAL
`fetchCreditBalanceFromLedger` returns 0 at its **first line** under that stub
(`creditLedger.js:53`), and real `stripe.fetchCreditBalance` does the same at
`stripe.js:337`. So `() => Promise.resolve(0)` is byte-equivalent to real behavior —
the mock removes the post-teardown module **fetch**, never a behavior. Genuine ledger
coverage (`tests/lib/creditLedger.test.js`, the `tests/security/*.pglite` set) renders
no shell and is unreachable from a per-file module mock.

## How to apply

Before adding this mock anywhere, prove the file imports `src/App.jsx` and asserts
nothing on credit balance. A stale comment claiming the `PricingMomentCard` mock
"severs the stripe->creditLedger chain at the component boundary" is FALSE wherever it
appears — `App.jsx` imports stripe directly — and was corrected in `navDividers` and
`navFletching`. Related: [[minifold-tree-is-live]] (HEAD moved `1453676b` → `ca46705b`
mid-session again), [[lintstaged-hook-reverts-foreign-unstaged-tracked-files]].
