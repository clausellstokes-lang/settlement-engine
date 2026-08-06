---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-21
  kind: lane-completion
  branch: claude/c6-misc
  tip: 5ace65c9
  status: NOT folded
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T06:11:14.946Z
---

# C6 MISC cluster shipped — the last fix-to-zero cluster

One gated commit `C6: the last polish` @ 5ace65c9 on claude/c6-misc (base 430f8042, lineage from composite minifold ceb77368). Resolution of the 3 remaining polish findings:

## F1 (bar10) FIXED — return detection device-local/lossy
`src/hooks/useReturnVisit.js`: when the device has no `sf:last_visit_at` stamp, a signed-in user's most-recent cloud-save timestamp (`campaignState.editedAt` / `savedAt`) now stands in as prior-visit evidence — cross-device, cleared-cache, and private-window returns are greeted. A present stamp always wins; anon exclusion kept BY DESIGN (WelcomeBackCard's documented gate). +6 pins in `tests/hooks/useReturnVisit.test.jsx`.
- ⚠ TWO parallel last-visit stores exist by design: `src/lib/session.js` uses key `sf_last_visit` (analytics band, eager, main.jsx) while the hook uses `sf:last_visit_at` (welcome-back surface, lazy). Different keys — no clobber; do not "unify" casually, session.js must stay dependency-free/eager.
- The whole surface is behind `flag('welcomeBack')` — default OFF, flip per phase plan.

## F2 (bar97) DEFERRED owner-gated — arcs are state captions, not causal arcs
Verified: `realmArcLines` (src/domain/display/realmArcSummary.js:83-137) reads only pantheon tiers + liveSieges + tradeWarState, and those public ledgers carry NO causal fields. The causal source (chronicle) is deliberately sanitizer-stripped (publicSafe.js:97 PRIVATE_KEY_RE; server mirror). Bar-meeting fix = sanitizer whitelist (security posture) OR new public-safe causal ledger (new capability) — both owner-gated. Queued for owner.

## F3 (misc) STRUCK deliberate-design — epistemic drama gated on spatial canon
Claim real: `beliefsActive` (beliefMap.js:199-204) needs integer `spatialCanonVersion > 0`; only stamp site = user-driven `store/campaignSpatialCanonize.js:114`; instant world ships version 0 by documented design (composeInstantWorld.js:27); rumorNetwork.js:512 dormant without a spatial digest even at flagship `infoMode: 'full'` (simulationRules.js:329). Constitutional dormancy (informationStatecraft.js:22-32 records the owner JUDGMENT). Cure (aspatial belief fallback or auto-canonize) = distribution-shifting capability — owner-gated, queued.

## Gate receipts
domain-strict bare 0 · tsc 0 · eslint touched 0 · pins 6/6 + 5 focused UI files/8 tests · vendorPdfLazy 18 passed/8 skipped on fresh build · NUL scan clean · eager Δ = 0 (entry closure 1,039,975 B of 1,040,000 — the base's exact ~25 B margin, unchanged; hook code lives only in lazy GenerateWizard chunk). No goldens touched.
