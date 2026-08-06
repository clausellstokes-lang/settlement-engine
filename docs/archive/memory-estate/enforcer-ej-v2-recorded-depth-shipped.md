---
name: ""
metadata:
  node_type: memory
  title: "E-J v2 SHIPPED — recorded provenance goes MULTI-HOP (wave→immediate-parent, dark, eager-Δ0)"
  date: 2026-07-21
  tags:
    - provenance
    - recorded-depth
    - deepChains
    - wave-propagation
    - dark-gated
    - eager-closure
    - first-paint-ceiling
    - additive
    - arc-soak
  branch: claude/e-j-recorded-depth
  base: b339e178
  tip: PENDING_COMMIT
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T08:32:47.829Z
---

# E-J v2 — recorded provenance goes MULTI-HOP

**What shipped.** The recorded provenance ledger moved from one-hop-to-ROOT toward genuine
≥2-hop chains. A derived regional WAVE receipt (waveDepth ≥ 1) now names its IMMEDIATE-PARENT
impact's recorded receipt key as an ADDITIVE `causedBy` edge (its existing `sourceEventId`→root
edge is KEPT). Result on the arc-soak (seed 'arc-soak-seed', 15y × 8): `deepChains` 0 → **6**
(e.g. conquest → information-shock → import-shortage-wave, a real recorded chain). Dark-gated
behind `provenanceLedgerEnabled`; OFF ⇒ byte-identical.

## THE preconditions (all PROVEN before editing — the verify-first discipline held)
- **V1 reachability** CONFIRMED: base arc-soak already records 44 wave receipts (`waveEdges=44`),
  so wave d≥1 receipts DO reach `recordProvenanceLedger`.
- **V2 transient parent-key derivability** CONFIRMED (throwaway probe): `deriveRegionalImpacts`
  mints a wave and its source impact TOGETHER (same call, same tick — propagation.js:708-741), so
  `d1.sourceImpactId === d0.id`, both get news entries in the SAME advance, and the child's
  parent key `wizard_news.<tick>.<transition>.<parentImpactId>` is derivable with NO persisted
  field and NO migration.
- **V3 namespace gap** CONFIRMED: base `deepChains=0` and NO recorded parent id even contains
  `regional_wave` — every wave's recorded parent today is the ROOT (via `sourceEventId`).

## ⚠️⚠️ THE EAGER-CLOSURE TRAP (the sharp lesson — cost one full rebuild+revert cycle)
The FIRST implementation put the resolution in `deriveWizardNewsEntriesFromGraphChange`
(wizardNews.js) with a threaded `recordCauseEdges` option. It PASSED every behavioral gate but
**`deriveWizardNewsEntriesFromGraphChange` is EAGER — it bundles into the `index` entry chunk**
(first-paint). The +~284 minified bytes blew the first-paint closure ratchet:
`tests/build/vendorPdfLazy.test.js` `CLOSURE_BUDGET_BYTES = 1_040_000`, base closure **1,039,971
(margin only 29 bytes)**. So ANY eager add of more than ~29 B breaches. ⚠️ The closure assertion
is `it.skipIf(!requireDistRead)` — it is SKIPPED unless `VERIFY_DIST=1`, so a plain `vitest run`
is GREEN-ON-NOTHING; you MUST run `npm run build` then `VERIFY_DIST=1 vitest run
tests/build/vendorPdfLazy.test.js`, or compute the entry-closure BFS by hand.

**The cure (final shape): do it ALL in the LAZY recorder.** `provenanceKernel.js` (which lands in
lazy `advanceInterval`/`advanceCampaignWorld` chunks, never the entry closure) already receives
`applied`, and `applied.regionalGraph.queuedImpacts` carries each wave's `sourceImpactId`
(normalizeImpact spreads it — graph.js:196). New pure helper `withWaveCauseEdges(newsEntries,
queuedImpacts)` builds `impactId→sourceImpactId` (waves only) + `impactId→recordedNewsKey` from
the same advance and returns SHALLOW-COPIED entries with additive `causedBy`. Wired into
`appendPulseHistoryWithProvenance` + `recordProposalProvenance`. **Eager Δ = 0** (branch closure
== base 1,039,971 byte-for-byte; `index` chunk 538,615 unchanged). wizardNews.js + applyWorldPulse.js
REVERTED to base. The recorder-side approach records the IDENTICAL DAG as the eager version
(deepChains=6, wave=59, crossSystem=144 — same numbers), so it is behaviorally equivalent AND free.

**Rule for future recorded-provenance / news-adjacent work:** the news-derivation path
(wizardNews.js `deriveWizardNewsEntriesFromGraphChange`, `createWizardNewsEntryFromImpact`,
`normalizeEntry`) is EAGER/first-paint with ~29 B of headroom. Put dark/recorder-only logic in
`provenanceKernel.js` (lazy) and feed it `applied.regionalGraph.queuedImpacts`, never the eager
news path.

## Files (final diff)
- `src/domain/worldPulse/provenanceKernel.js` — `+export function withWaveCauseEdges(...)`; wired
  into `appendPulseHistoryWithProvenance` and `recordProposalProvenance` (app cast gained
  `regionalGraph?.queuedImpacts`). All new code inside the flag-active branch.
- `tests/domain/recordedDepthMultiHop.test.js` (NEW) — unit pins the seam: additive causedBy,
  purity (no input mutation), dark (same-ref when no queued impacts), determinism.
- `tests/simulation/emergentArcSoak.test.js` — added `deepChains ≥ 1` pin (measured 6); rewrote
  honest-limit #1 (was "measured ZERO") and refreshed the measured band (3180 edges · 144 cross-
  system · 59 wave · 46 cones · 117 multi-system · 6 triple · deepChains 6). All existing floors
  unchanged (numbers only rose).

## Gate (verbatim outcomes)
- V3 DARK byte-identity CONFIRMED: temp base-worktree diff, flag OFF — branch news feed hash
  `524a0074…` == base; provenance ledger key absent on both. (⚠️ full-`r` hash is non-deterministic
  on BASE too — wall-clock fields; strip createdAt/updatedAt and hash the news feed, which is
  deterministic.) `provenanceDormancyGolden.test.js` green independently.
- V4 LIT depth CONFIRMED: arc-soak `deepChains=6 ≥ 1`, 8/8 tests green.
- V7 EAGER Δ0 CONFIRMED: entry-closure BFS = 1,039,971 == base; `VERIFY_DIST=1 vendorPdfLazy` +
  engineChunkLazy 31/31 green.
- domain-strict BARE `0 errors, ceiling 0`; typecheck exit 0; eslint 0 on touched; NUL 0; focused
  provenance/region/news/worldPulse suites 124 + 33 + 21 green.

## JUDGMENT (vetoable) + deferrals
- JUDGMENT: implemented recorder-side (lazy) not news-side (eager) — forced by V7 hard-zero. Same DAG.
- JUDGMENT: shipped family (1) waves; DEFERRED family (2) conquest/occupation applied-outcome →
  mobilization/deploy applied-outcome key. Family (1) already delivers the conquest→shock→shortage
  depth chains; (2) is the separate war applied-outcome→applied-outcome seam (the mover-beat risk
  class) needing its own V1/V2 proof. Deliberately deferred, not a bug.
- UNTOUCHED (owner-gated): the default-on flip (`provenanceLedgerEnabled` in any preset) = the ONE
  REGEN; Tier-2 (moving pulseKernel impactDigest snapshot after movers run) = out of scope.
- NEVER pushed, NEVER folded (owner-gated). Foreign stash@{0} preserved.
