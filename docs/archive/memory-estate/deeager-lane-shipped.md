---
name: deeager-lane-shipped
description: "⭐ THE DE-EAGERING LANE shipped on claude/de-eager (base aad6265e; DE-a 7a629d80 · DE-b 5cee2ea0 · DE-c 2c4d599b, NOT folded) — registry/schema out of first paint, closure 1,040,998 → 1,022,962 (budget UNTOUCHED at 1,040,000, 17,038 B headroom); store API sync→async on 4 actions"
metadata:
  node_type: memory
  type: project
  created: 2026-07-19
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T13:39:46.028Z
---

2026-07-19: the owner-ordered de-eagering (the sole COMPOSITE push blocker's cure,
[[composite-budget-breach-998b]]; un-gates [[customregistry-deeagering-gated]]).
customRegistry + dependencyEngine + stressTypesMeta + customContentSchema +
settlementDeityHelpers (+religionState, bonus) all left the eager closure.

**The mechanism:** NEW lib/customContentSource.js = the zero-import EAGER SEAM
(pinned to the kernel chunk — ⚠️ unpinned, Rollup co-located it INTO the lazy
custom-registry chunk and the ENTRY statically imported the whole registry:
+351 KB inversion, caught by measurement). Store wires its getter there;
dependencyEngine self-registers its invalidator on lazy load
(no-op-before-load is exact — the first registry build reads the live source).
Slices reach the schema ONLY via `await import()` at the validation chokepoint
(a submit racing the load is validated, never skipped).

**API shape moved (owner-authorized):** addCustomItem / updateCustomItem /
setPrimaryDeity / imposeCult now return Promises; resolve values unchanged
(null-on-rejection / ActionResult envelope). Persisted output byte-identical.
deitySnapshotFrom extracted to zero-import store/deitySnapshot.js (helpers
re-export verbatim). vite.config: the two lib seeds REMOVED, schema excised
from ENGINE_SHARED_DOMAIN, pins → lazy 'custom-registry' + 'custom-schema'
chunks (registry NOT into engine — would breach engine's 660 KB assertion).

**Reclaim honesty:** measured −18,036 B, NOT the recorded ~41 KB (FP-G11's
figure ≈ source bytes; minified registry code in the data chunk was ~12 KB +
schema ~5.8 KB in engine-core). Whale tables stayed eager as required.
stressTypesMeta CANNOT be string-fingerprinted (its strings are duplicated in
the legitimately-eager stressTypes.js — a false-positive trap for closure greps).

**Guards:** tests/build/customRegistryLazy.test.js (chunk-name + live-fingerprint
absence, VERIFY_DIST non-vacuity, source contracts on the seam + dynamic imports)
+ tests/store/customContentSlice.deeager.test.js (author→persist→rehydrate→edit→
validate incl. the premium offline-mirror leg · the race · import lane · seam
re-wire past the count:latest cache blind spot). T5-c TRADITION_*_KEYS mirror +
drift guard SURVIVE with re-stated rationale (keeps corpus out of the schema chunk).

**How to apply:** manager folds the branch (3 commits atop aad6265e); the
budget re-tighten to ~1,023,0xx is the MANAGER's post-fold move, deliberately
not done in-lane. Never re-add a static store import of these modules — the
named guard + budget both fail loudly. Related: [[comprehensive-review-fix-program]].
