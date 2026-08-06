---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-21
  branch: claude/w2-dossier-chrome
  base: 5e23db2d (composite-r4)
  tip: ff14ca74
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-21T18:31:53.561Z
---

# W2 dossier-chrome + About walk — SHIPPED (8 commits, off 5e23db2d)

The owner's UI walk, lane W2 (ledger 3e3afa1c / row 70a19ce5). All six orders +
the manager's (a-REVISED) amendment landed as clean per-order commits; NOT folded,
NOT pushed (owner-gated tail).

## Why (the deliverables)
- **(d) c1d60619** header flush — WizardOutputToolbar top on CHROME tokens
  (added CHROME.headerDesktop=60), not a magic 60; oc-arrival div got
  willChange:'transform' (transient-gap cure, PLAUSIBLE — not browser-QA'd).
- **(f) 5dc01782** mobile compaction — toolbar mobile = Back + name + '⋯' overflow
  menu (How-simulated/Regenerate/New Draft), auto-hide-on-scroll, Escape/focus a11y.
- **(b) eb9e2761** buy caption → hover pill — anon 'One-time, no account needed.'
  opacity-toggled tooltip, kept in DOM via aria-describedby (useId).
- **(e) 37c6ff33** About split — HowToUse standalone → two Disclosure collapsibles
  ('What this is' AboutManifesto default-open / 'The Keeper's Handbook' default-
  collapsed); ?tab= deep-link auto-expands the handbook (defaultOpen={hasTabParam}).
- **(a) 57af001d** floating stack — scroll-to-top/bottom lifted above the base FAB
  (App.jsx net-zero), dev-flags chip → bottom-LEFT. SUPERSEDED IN PART by a-REVISED.
- **(c) 95143bee** MAP AS FIFTH TAB — OutputContainer TAB_GROUPS gains `map` between
  World/Notes (order Summary/Systems/World/Map/Notes), mounts lazy SettlementMapPane;
  SettlementDossierHero [Dossier|Map] toggle RETIRED (one-revert-away). VERIFY-FIRST
  passed: draft state feeds the pane (contract read + dossierMapTab test CONFIRMED).
- **844335d9** kill-list flatten (fixes b+f — see hazard below).
- **(a-REVISED) ff14ca74** feedback consolidation — floating Feedback button DELETED;
  footer 'Feedback & support' (was Contact mailto) opens the panel via an app-wide
  `sf:open-feedback` window event; owner phrase verbatim in the intro; signed-in
  auto-attaches auth.user.id (already the support_messages.user_id column, mig 055 —
  no new shape) + disclosure microcopy.

## How-to-apply / HAZARDS (each bit this session)
- ⚠️⚠️ **The map-tab gate is `!publicDossier`** — OutputContainer renders in the
  wizard draft, the saved owner view (hero), AND the public gallery (PublicDossierView).
  PublicDossierView keeps its OWN owner-opt-in [Dossier|Map] toggle (fail-closed
  gallery share). The map tab MUST stay gated off public dossiers or it double-renders
  AND bypasses the share opt-in. Threaded new OutputContainer props
  mapWorldState/mapRegionalGraph/mapCanEdit (default null/false); wizard passes none ⇒
  view-only base map (dormancy).
- ⚠️⚠️ **deep-craft kill-list ratchets** (tests/design/deepCraftKillList.test.js) are
  EXACT (toBe) shrink-only: borderRadius 103 / boxShadow 72 / rgbaLiterals 167 /
  tintedCallouts 165, counting ANY line matching `/borderRadius/`, `/boxShadow/`,
  `/rgba\(/` (even tokenized) under src/components. New inline styles MUST use the
  flat rule-framed idiom (no rounded corner, no z-axis shadow, no rgba — token
  borders only). Tripped by the b-pill + f-menu; cured in 844335d9.
- ⚠️⚠️ **The first-paint closure** (tests/build/vendorPdfLazy.test.js,
  CLOSURE_BUDGET_BYTES=1,040,000, ~25B margin) is blown by ANY eager-chunk growth.
  App.jsx + theme.js are EAGER. Order a/d pushed it to 1,040,046 (+46 OVER). (a-REVISED)
  removing the App.jsx supportMailto import DROPPED copy/support.js from the eager
  closure and the byte-light ghost Button (newlines free under minify) brought it BACK
  UNDER (index chunk 538,690→538,635). Now GREEN but THIN — recommend a re-pin at
  promotion. `vite build` alone does NOT prerender: run postbuild
  (node scripts/prerender-routes.mjs) BEFORE verify:dist or metaShell/prerenderRoutes
  fail as ENV (not code).
- ⚠️ **App.jsx frozen at EXACTLY 732** eff lines (sizeBaseline both grow+shrink fail).
  Absorbed 2 new theme imports on the existing multi-line import token list (net-zero);
  the footer control went 6→7 lines to offset the removed import (−1). JSX `{/* */}`
  comments COUNT — kept the footer comment at 6 lines + preserved its 1 em-dash.
- ⚠️ **lint-staged deletes the worktree-local untracked `.claude/skills/` on commit**
  (new instance of the known hazard). HARMLESS here — every other worktree lacks it,
  canonical BRAND-landing copy lives in the MAIN tree's .claude/skills/. NOT recovered.
  `stash@{0}` is a FOREIGN "generation-tuning fixes" stash — do NOT touch.
- ⚠️ SettlementMapPane current sizeBaseline metric reads **600/600** (memory/brief said
  598/600). Untouched either way. The tinymce `__exact_set_probe__` vendor-manifest
  red is a shared-tree test-probe race (not on disk), not W2.

## Discrepancy / deferrals
- Brief's "E-I keyboardPlacement 13/13" — the file has **6 test()s** (map-placement
  surface, NOT the dossier); untouched, stays green.
- oc-arrival transient-gap cure = willChange (PLAUSIBLE; a deeper keyframe/gap fix in
  organic.css is out of the arrival-seam scope, deferred).
- Remaining mailto: refs LEFT UNTOUCHED (per amendment, inventory in report):
  SingleDossierSuccessPage, legal/BountyPage, legal/PrivacyPage, legal/TermsPage,
  account/AccountSupportSection — all via copy/support.supportMailto (still used there).
