# -*- coding: utf-8 -*-
p = "docs/implementation/preambles/EM-PREAMBLE.md"
s = open(p, encoding="utf-8").read()
anchor = "9. **The tick hook (wave 3) owes the preset witness**"
i = s.index(anchor); j = s.index("\n", i)
add = ("\n10. **An edit to any INPUT of an edge-shared bundle closure owes `npm run build:edge-shared` and the regenerated artifacts in the member's manifest.** The test is INPUT MEMBERSHIP against the bundle metas' own `inputs` lists, never entry-hood: freshness hashes every input's raw source text, so a JSDoc-only edit to `src/domain/entities/npcs.js` stales `aiCharterBundle` and `aiOutputSchemaBundle` (measured at EM-B1d's pre-proof, 2026-09-19). Every pre-proof measures its `src/` paths against the five metas and says which bundles, or none."
       "\n11. **The byte budgets are priced at pre-proof (ODQ §934.19 addendum 2; the charter's amendment of 2026-09-19).** Every `src/` path a member creates or modifies is measured against the generation worker's closure (`WORKER_BUNDLE_CEILING_BYTES` — EXACT, zero slack), the lazy engine (`tests/build/vendorPdfLazy.test.js`), the eager first-paint set (`EAGER_FIRST_PAINT_MODULES`) and the edge-shared metas. A member that lands bytes in a zero-slack or near-full budget CARRIES the obligation: the budget's test as a TEST row with a stated byte bound, and the build lane's step — a real `npm run build`, the kit's per-module attribution showing ONLY the member's own modules moved, growth inside the bound, then the re-mint in commit `91d5f155b`'s form — or STOP. THE CURE IS THE PLACEMENT BEFORE IT IS THE CEILING: bytes a bundle never reads are moved out of its import closure, not paid for (EM-P3's citation map, measured at +634 B into the worker for data the worker never reads).")
s = s[:j] + add + s[j:]
open(p, "w", encoding="utf-8").write(s)
print("preamble §P2 gains rows 10 and 11")
