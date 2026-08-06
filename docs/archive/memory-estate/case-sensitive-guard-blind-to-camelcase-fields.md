---
name: case-sensitive-guard-blind-to-camelcase-fields
description: "⚠️⚠️ A `\\bicon` guard cannot see `resourceIcon`/`needIcon` — copyCorruption SIG 1 reads as a total ban on empty icon slots and in fact bans only the lowercase spelling; 4,462 dead slots still ship in generated output"
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-03T23:02:46.855Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

**The guard:** `tests/lint/copyCorruption.test.js` SIG 1 (`empty-icon-prop`) matches
`/\bicon\s*[:=]\s*(?:""|'')/` over all of `src/`. Its docstring and the icon-sweep
commit message both describe it as banning the empty-icon form outright.

**The blind spot (MEASURED 2026-08-03, Lane GR):** `\bicon` is case-sensitive, and
in `resourceIcon` / `needIcon` the `I` is capital, so those fields can NEVER match.
The icon sweep (d9a1ea5a) consequently removed only the slots whose value was the
orphan U+FE0F variation selector — the plain-empty-string camelCase ones survived:
- 56 residual `resourceIcon: ''` in `src/data/supplyChainData.js`
- 2 residual `needIcon: ''` in `src/domain/inferSupplyChains.js`
- which put **4,462 `economicState.activeChains[*].resourceIcon: ""`** slots into
  live generated output at HEAD, counted over the 525-row golden corpus.

**Why it matters:** the owner's directive was "remove ALL icons of any kind that
are not logos". The sweep reports itself complete on the data surface, its guard
reports green, and the dead slots ship anyway. Closing the remainder WILL move the
generator golden again — a SECOND icon re-record is expected and is written into
`tests/property/generatorGoldenMaster.test.js`'s shift record so it is not
re-found as a bug.

**How to apply:** any source-scan guard of the form `\b<word>` is a guard on ONE
spelling, not on a concept. When the concept has camelCase compounds (`icon` →
`resourceIcon`, `needIcon`, `menuIcon`), the regex needs `[a-zA-Z]*[Ii]con` or the
`i` flag plus a negative control proving it catches the compound spelling. Sibling
class: [[filename-anchored-source-pin-vacuity]] — a guard whose limits are
undocumented gets trusted past its coverage.
