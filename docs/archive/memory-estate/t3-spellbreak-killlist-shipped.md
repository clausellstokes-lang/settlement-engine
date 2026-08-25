---
name: t3-spellbreak-killlist-shipped
description: "T3-B spell-break + kill-list @ claude/t3-spellbreak 3aaf963b (base 17d46413/composite-r4) — chronicle.camelKey cured to 0 via humanizeToken; decrees.rawId PROVEN coupled to owner-parked chronicle.rawId (flagged); kill-list all taste, 3 orphan files flagged"
metadata:
  node_type: memory
  type: project
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T09:40:55.076Z
---

**T3-B SHIPPED 2026-07-21 @ `3aaf963b` on `claude/t3-spellbreak`** (base `17d46413` = composite-r4 tip; NOT folded, NOT pushed). Two parts: (1) drive the SPELL-BREAK census's non-golden cells to 0; (2) classify the deepCraft kill-list remainder. Gate all green; eager closure Δ 0 (1,039,977 B, 23 B under the 1,040,000 ceiling; base rebuilt identical). Foreign stash@{0} preserved.

## Part 1 — what reached 0, what proved golden-bound

- **chronicle.camelKey 3 → 0 (CURED).** The ONLY camelKey source in the chronicle surface was `settlementStrategy.js` `emitMove`'s M9a non-war lever reason: `` `... a bounded ${Object.keys(nudge.relationshipPatch).join('/')} nudge.` `` → "resentment/tradeBalance" (the key `tradeBalance` is the leak). Cure = humanize the keys at the authoring point with `humanizeToken` from `display/humanizeEngineTokens.js` (`.map(humanizeToken)`) → "resentment/trade balance". Deterministic 0 (source eliminated; stable ×3). Baseline cell lowered 3→0.
- **decrees.rawId 3 → NOT FIXED, reclassified GOLDEN-BOUND.** ⚠️ THE BRIEF WAS WRONG that this is independently fixable. **decrees.rawId and the owner-parked chronicle.rawId (32, tranche-4/ONE REGEN) share ONE source.** Both surfaces read `raw.reasons` off the same recorded pulse outcomes (`chronicleReadModel.deputysDiary` line ~392 `reasons: raw.reasons`; decree `coneNodes` = `ChronicleNode.reasons` = `raw.reasons`, chronicleGraph.js:267/282). The prose "active condition: &lt;archetype&gt;" is authored ONLY in `pressureModel.js` (8 sites, `${...Conditions.join(', ')}` over raw archetype ids like `regional_criminal_pressure`). **Proven by controlled experiment:** humanize pressureModel → decrees.rawId 3→0 AND chronicle.rawId 32→6 fell TOGETHER. So decrees can't hit 0 without shifting the parked chronicle surface → flagged, not fixed (honored the brief's own STOP-and-flag rule).
- **letter (tickSpeak 1, camelKey 37) + chronicle.rawId (32): untouched, golden-bound.** Letter golden proven **BYTE-IDENTICAL** post-change (`tests/property/chroniclersLetterGolden` green) — the letter does not observe the settlementStrategy reason.

## Part 2 — kill-list classification (NO style edits; ceilings unchanged)

Totals == ceilings exactly (br 104 · bs 72 · rgba 167 · tinted 167). Three classes:
- **~500 live styling lines = TASTE** — owner's tranche-5 de-round call, not mine.
- **3 comment false-positives** (LivingWorldTab.jsx:53 borderRadius · SampleCard.jsx:13 boxShadow · SaveQuotaMeter.jsx:111 GOLD_BG) — documentation prose containing the trigger word, NOT SaaS structure; editing to dodge the regex = metric-gaming → leave.
- **3 orphaned (zero-importer) files** bearing 4 offenders: `gallery/MemberSettlementsList.jsx` (1), `gallery/GalleryMapsSidebar.jsx` (1), `map/SimulationRulesGateToggle.jsx` (`GateToggle`, 2). Only ref anywhere is a test COMMENT. Each has a consumer that renders equivalent-but-simpler UI INLINE instead (GalleryMaps inlines a member list ~L109; SimulationRulesDialog defines its own inline `Toggle` ~L128). **Built-but-unwired, capability-shaped, ambiguous dead-vs-pending → owner-flag, NOT a safe unilateral deletion.** Deleting is mechanically safe (no importer/test breaks) but would erase intended work / hide the wiring gap.

**Net: zero kill-list edits.** The ~510 de-round lines remain the owner's tranche-5 taste call.

## ⚠️ Durable hazards / how to apply

1. **The census "non-determinism" is real but bounded.** chronicle.rawId measured 32 (baseline) / 20 (clean probe) / 6 (experiment) across process runs — the shrink-only ratchet holds because it's a MAX-observed ceiling. A cured cell (source eliminated) IS deterministically 0. Never diff two chronicle runs; verify a fix by eliminating the source, then confirm stable across ≥3 runs.
2. **decrees.rawId ↔ chronicle.rawId are ONE defect, ONE cure** (humanize pressureModel's raw archetypes) — bundled into the owner's ONE REGEN (tranche 4). Do NOT try to fix decrees independently; a decree-renderer-local humanization is a divergent hack leaving the root leak.
3. **The census diagnostics `console.log` is suppressed on pass** — route probe output through `fs.writeFileSync` (or a throwaway `_probe_*.test.js` inside `tests/copy/` so imports resolve, then delete it — never stage it).
4. **Closure proof for a lazy-chunk edit:** settlementStrategy.js lives in the LAZY engine chunk (`engine-*.js`, 617 kB), NOT the 7-file eager first-paint closure (index + vendor-state/react/icons + data + engine-core + kernel). Adding an import there = eager Δ 0. Prove it: rebuild base 17d46413 and compare the entry-chunk hash (`index-DgvusCNO.js` was byte-identical).

## Gate (verbatim)
domain-strict (bare) exit 0 "0 errors, ceiling 0" · tsc --noEmit exit 0 · eslint touched exit 0 · NUL 0 · spellBreakCensus 4 passed ×3 · tests/copy 14f/185 · tests/design 20f/190 (ceilings unchanged) · letter golden 2 passed BYTE-IDENTICAL · consolidated 8f/93 · build exit 0 · VERIFY_DIST closure 31 passed · closure 1,039,977 = base, Δ 0.
