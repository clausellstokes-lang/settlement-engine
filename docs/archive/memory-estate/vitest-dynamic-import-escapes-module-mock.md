---
# THIRD MEMBER (2026-08-04, WR-10 wiring WW-A): a test file that IMPORTS a module
# it also vi.mocks LOSES interception for that module's OTHER consumers — the
# identical leaf spy fired 1x without the import and 0x with it, static or
# dynamic. Failure mode = silent green on every "never fires while dark"
# assertion. Cure = never import what you mock in the same file; the paired
# NON-VACUITY anchor on the lit run is what catches it. General law: mocking a
# module's EXPORTS is not mocking its GRAPH.
name: vitest-dynamic-import-escapes-module-mock
description: "⚠️⚠️ vi.mock of a module's exports does NOT intercept a dynamic import() of it from another source module — mock the LEAF dependency; navFletching's intermittent gate exit 1 cured"
metadata: 
  node_type: memory
  created: 2026-08-04
  tags: 
    - vitest
    - jsdom
    - gate-hazard
    - flaky
    - mocking
    - navFletching
  type: project
  originSessionId: aae60605-4ab3-4994-b6ab-b492bfff0a1d
  modified: 2026-08-04T20:47:10.044Z
---

# The dynamic import that walks past its own mock (cured 2026-08-04)

`.claude/worktrees/minifold`, branch `claude/composite-r4`, HEAD `1453676b`.
`tests/components/navFletching.test.jsx` intermittently exited 1 with
`EnvironmentTeardownError: Cannot load '/src/lib/creditLedger.js' imported from
src/lib/stripe.js after the environment was torn down`, while every test passed.

## ⚠️⚠️ THE MECHANISM — mocking a module's EXPORTS does not sever its MODULE GRAPH

The file already had `vi.mock('../../src/lib/stripe.js', factory)`. It did not help,
and the reason is the durable lesson:

- **A dynamic `import()` inside another source module does NOT resolve through the
  test's `vi.mock` factory.** `src/App.jsx`'s mount effect calls
  `import('./lib/stripe.js')` on every render. **Instrumenting the factory's two
  functions with `console.error` recorded ZERO calls** while the real `stripe.js` was
  fetched anyway — its line-17 `import { fetchCreditBalanceFromLedger } from
  './creditLedger.js'` landing after jsdom was gone.
- The same file's *static* mocks (`useRoute`, `supabase`, `useIsMobile`,
  `store/index.js`) work fine. **Static imports are mocked; the dynamic one is not.**
- A direct `await import('../../src/lib/stripe.js')` **from the test file itself** DID
  return the mock (`keys=checkCheckoutResult|fetchCreditBalance`). So "the mock works"
  is true and irrelevant — it proves nothing about another module's `import()`.

**THE CURE IS TO MOCK THE LEAF**, because a factory mock is served from the registry
and needs no post-teardown fetch at all:

```js
vi.mock('../../src/lib/creditLedger.js', () => ({
  fetchCreditBalanceFromLedger: () => Promise.resolve(0),
}));
```

This is the house idiom, already recorded at `tests/components/navFlowArrows.test.jsx:84`
— navFletching was the SECOND suite bitten. That comment's claim that "the sibling
suites already mock it or never reach it" was false when written.

## ⚠️ THE DIAGNOSTIC LAW — the error count IS the `render(<App />)` count

27 `render(<App />)` call sites produced **exactly 27** unhandled rejections, one
apiece. Lane V4D independently saw 29 → 27 when it retargeted two pins off `<App />`.
The imports are fired in an effect, the tests are synchronous, so **all of them are
still pending when the file tears down** — which is why the count is exact and why the
failure is intermittent (it depends on whether teardown wins the race).

## ⚠️⚠️ TWO PREMISES THE TREE REFUTED — do not inherit them

1. **"Running the file alone exits 0" is FALSE.** Measured solo: red 2 of 3, same 27
   errors. It passes alone by luck, not by isolation. Combined-gate baseline was red
   **6 of 8** at `cb1ea74f` and **2 of 4** at `1453676b` (negative control).
2. **Retargeting `<App />` → `<NavRibbon />` could never have fixed it.** An exhaustive
   inventory of all 27 sites found **6 that genuinely need the shell** — the mobile
   negative control (`H.isMobile = true`, block 11, where NavRibbon is not rendered at
   all), the header-paint and header-`minHeight`/ANCHOR_OFFSET pins, and the
   ancestor-chain clip-path walk that stops at `HEADER`. Retargeting caps out at 21 of
   27 errors and **silently narrows those pins**; one site (the accessible-name loop)
   is a bare `for…of` over a NodeList with no length guard, so a careless retarget
   makes it pass with ZERO assertions. Related: [[self-referential-pin-class]],
   [[harness-default-empty-state-vacuous-absence-pin]].

## How to apply

When a jsdom suite exits 1 with post-teardown "Cannot load X imported from Y" while
every test passes: count the errors and compare against the number of shell renders —
if they match 1:1, it is this class. Do not add `await` flushes and do not retarget
pins; **mock the leaf module named in the error**. Before believing any red on this
gate, run it more than once (see [[generation-remediation-gate-state]]) and read the
gate through `scripts/gate-tail.sh`, never a bare pipe.

Related: [[v4d-bole-axis-split-and-blend-contract]] (where this was deferred as its own
task), [[minifold-tree-is-live]] (HEAD moved `cb1ea74f` → `1453676b` mid-session from a
concurrent WR-9 session committing — re-bind verification to the new snapshot).
