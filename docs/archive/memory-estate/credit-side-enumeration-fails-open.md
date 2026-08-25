---
name: credit-side-enumeration-fails-open
description: "2026-08-06 — ⚠⚠ THE CLASS: an enumeration is unsafe on whichever side DECIDES CREDIT, and that side cannot be read off the polarity of the surrounding sentence; cure = a TOTAL positive predicate. Plus: three new guards passed all 31 arms with the clause DELETED — only mutation found them."
metadata:
  node_type: memory
  type: project
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-06T04:42:54.591Z
---

# ⚠⚠ AN ENUMERATION ON THE CREDIT SIDE FAILS OPEN

**Landed at 5166a342 (ninth/anchor cut of `tests/lint/sovereigntyLightingContract.walker.test.js`),
parent 7cb237e7.** The eighth cut's header argued its binding enumeration — "a declaration, a
parameter, a destructure, a catch binding, a function name, a non-vitest import" — was safe
**because it sat on the credit side, "the side that was always closed"**. That reasoning is
wrong and this is the record of why.

## The falsifier, executed at three layers

```js
import { expect as it } from 'vitest';
it('ES-4-DISTANT-SOURCE-EVIDENCE — …', () => { throw new Error('THIS RAN'); });
```

- classifier: `reasons=[]`, the title **credited**
- shipped evaluator: `SATISFIED / satisfiable true / missing []` off the REAL marker
- vitest 4.1.8, planted beside a green anchor: **ZERO rows**, `Tests 1 passed (1)`, exit 0,
  `grep -c 'THIS RAN'` = 0 — the deliberate throw never fired

The shadow clause keyed on the module SOURCE (`node.source.value !== 'vitest'`) and never on
whether a specifier's LOCAL name equalled its IMPORTED one. `expect as describe` was worse:
`creditedSuiteBody` handed registration THROUGH the aliased word, forging **two** titles from
one line.

## The rule to carry forward

**An enumeration is unsafe on whichever side decides CREDIT.** "Park is the default" does not
make a credit-back list safe — the list IS the credit decision. The cure is not a longer list;
it is a **TOTAL positive predicate**, where the failure modes are not rows but simply the ways
the function fails to return a value. Here: a callee is credited only where it RESOLVES,
through the module's own bindings, to a vitest export whose **imported** name (never the local
alias) is in the running grammar. "Bound elsewhere", "bound twice", "unbound", "bound to a
different export" stopped being enumerable cases.

Corollary spelling that worked: **a reserved word may only ever mean itself; any other word may
mean an opener.** Renames therefore park (or classify by TRUE name), and globals cannot coast.

## ⚠⚠ THREE GUARDS PASSED ALL 31 ARMS WITH THE CLAUSE DELETED

The defence-in-depth bite, for the **fourth** time in this program, and review did not catch it
— **mutation did**. Deleting each of these left the whole suite GREEN:

1. the computed-namespace clause — the file parked anyway via a downstream `TEST_UNREGISTERED`
2. `creditedSuiteBody`'s reserved check — reachable ONLY by the **reverse** rebind
   (`describe as it`), because `expect as describe` is already refused one clause earlier
3. the import-specifier binding-site record — invisible for SHORTHAND imports (espree reuses
   one node for both halves); needs a RENAMED specifier beside a plain one to bite

**`carries`-style boolean pins cannot tell a live guard from an absorbed one. The REASON SET
can.** Always pin the reason array with `toEqual`, and always run the deletion mutant — a guard
you cannot make red is a guard you do not have.

## The stale-numeral cure that shipped with it

Census figures (parked / credited / titles) moved from prose into a frozen `CENSUS` table the
suite asserts against a live measurement. Three cuts stated the census in prose; **two stated it
wrong in the same direction** — the cut's own new arm added exactly the title its sentence
described (24,456 vs 24,457; then 23,674 vs 23,675). The new arm caught its own +1 on the first
run. Floor (1,900) / ceiling (420) were **deleted**, not kept — exact equality subsumes them, and
keeping a redundant bound would have reproduced the covered-guard failure inside its own repair.

⚠ **Operational cost, accepted under chair ruling:** any lane adding/removing a test title
anywhere in `tests/` reds this walker. Remedy is to re-MEASURE and re-record one number, never
to loosen the bound.

## Facts worth not re-deriving

- The repo declares **no `globals: true`**; all 2,314 test files import from `'vitest'`. That is
  what makes a positive resolution rule affordable at all.
- Estate cost of the whole change: **ZERO** — same 357 parked / 1,957 credited / 23,675 titles,
  identical title sets file-for-file, no newly parked, no un-parked.
- Executed before crediting: `import { describe as mkSuite, it as check }` and
  `import * as V from 'vitest'; V.describe/V.it` both really RUN under 4.1.8.
- espree **rejects** `import { it } from 'vitest'` beside `function it(){}` as a duplicate
  module-scope declaration — the double-binding pin needs a nested param instead.
- Synthetic battery sources need a vitest-import PRELUDE once resolution is positive, and the
  prelude must omit words the source itself binds or deliberate-rebind entries die at the parser
  door instead of the grammar.
