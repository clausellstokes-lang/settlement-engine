---
name: negated-arraycontaining-fails-open
description: "A negative assertion over expect.arrayContaining is ALL-OR-NOTHING — it only fires when EVERY listed member is present, so any proper subset ships green"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7987e799-6091-4459-a738-834233f4840b
  modified: 2026-08-10T19:16:22.103Z
---

⚠⚠ **`expect(xs).not.toEqual(expect.arrayContaining([a, b, c, d]))` FAILS OPEN.**
`arrayContaining` matches only when **all** listed members are present, so its NEGATION
fires only in that same all-present case. Any **proper subset** passes. A guard written to
forbid a list of things therefore permits every one of them individually — usually the exact
regression the test is named for.

Found 2026-08-10 in `tests/build/campaignRuntimeLazy.test.js`, test *"the bridge has one
dynamic capsule edge and no static implementation edge"*. MEASURED on the real bridge with one
static edge spliced in:

```
specifiers now: ["./campaignSlice.js"]
OLD not.toEqual(arrayContaining(all four)) would RED?  false   ← shipped green
NEW per-specifier not.toContain would RED?             true
```

**Compounding defect: the subject was EMPTY.** `staticSpecifiers(bridge)` is legitimately `[]`
at head, and `expect([]).not.toEqual(expect.arrayContaining([...]))` passes — so the line
asserted *nothing whatsoever*, and would have kept passing if the parser's regex rotted to
return `[]` for every input.

**THE CURE, both halves — a subset-sensitive matcher AND a liveness control:**
```js
// LIVENESS CONTROL: no same-subject positive is possible, because the correct answer for
// this input really is the empty list. So drive the producer over the SAME text with one
// member spliced in — a rotted producer reds here instead of greening every absence.
expect(staticSpecifiers(`import './__probe__.js';\n${bridge}`)).toContain('./__probe__.js');
for (const specifier of [ /* … */
  // anchored: the parser is proven live on this exact text by the probe above
]) expect(staticSpecifiers(bridge)).not.toContain(specifier);
```
MUTANT-PROVEN both ways: one static edge reds the loop; a parser rotted to `return []` reds
the probe.

⭐ **THE GENERAL RULE.** When the correct answer for a collection is legitimately EMPTY, no
same-subject positive can exist — so the anchor must be a **negative control that drives the
producer**, not a positive on the subject. Splice a known member into the producer's input and
assert it comes back.

⚠ Switching `not.toEqual` → `not.toContain` moves a site INTO the three matchers scanned by
`negativeAssertionAnchor.walker` — it then needs an `// anchored:` line, and for a multi-line
`for (…) expect(…)` the token must sit on the last line **inside the array literal**
(see [[negative-anchor-annotation-placement-mechanics]]).

Same family as [[credit-side-enumeration-fails-open]] (cure = a TOTAL positive predicate) and
[[conjunction-coverage-blind-guard-pairs]].
