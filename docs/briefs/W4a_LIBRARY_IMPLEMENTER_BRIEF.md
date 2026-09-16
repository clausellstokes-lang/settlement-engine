# W4a Implementer Brief — Library Living Surface

You are the Opus implementer for Phase 5 Reunification Wave W4a in
/Users/cstokes/Desktop/settlement-engine (branch review-fixes-2026-07-08). You
implement; the manager reviews and commits. Runs AFTER RQ commits (RQ wires RealmStrip
into CampaignFolder — build on that, don't redo it).

BINDING: docs/PHASE5_REUNIFICATION.md (standing laws) + memory/feature-parity-ledger.md
§3 (Library / Settlements) with its file:line refs. This wave makes the Library a living
surface: you advance a campaign's clock and see which towns are brewing, without opening
the Realm. It is OWNER FINDING #2 and top-20 #1.

REFERENCE (read-only): /Users/cstokes/Desktop/settlement-generator/settlement-engine —
the ledger cites THEIRS' paths. Adopt onto OUR floor; preserve OUR logic.

## The items (verify each ledger file:line against the live tree first)

1. ADVANCE-TIME FROM THE LIST (ledger §3 #1, PARTIAL — store capability EXISTS).
   The store already has `advanceCampaignWorld` + `isAdvanceInFlight`
   (campaignWorldPulseSlice.js:132,232). Wire the UI THEIRS ships:
   - CampaignFolder: an advance button + Week/Month/Season/Year interval picker +
     in-flight state (their CampaignFolder.jsx:117-147; handler SettlementsPanel.jsx:456-470).
     Use OUR weeksPerInterval / INTERVAL_WEEKS vocabulary (one_week/one_month/one_season/
     one_year, the committed 4-4-5 calendar) — NOT any stale 48-week labels.
   - Per-row advance via the SettlementCard kebab (their SettlementCard.jsx:336-345) with
     the free-tier upgrade-preview (advancing is premium — reuse OUR existing gate; the
     Realm's `canManageCampaigns`/premium gate is the reference).
   - `ADVANCE_TIME_NAV_TARGET` deep-link (their settlements/advanceTimeTarget.js) if it
     wires cleanly to OUR nav; else report.
   PREMIUM GATE: advancing time is Cartographer. Anon/free get the upgrade preview, never
   a working advance. Verify the gate; do NOT let free advance.

2. BULK MULTI-SELECT + BulkActionBar (ledger §3 #14). Adopt settlements/BulkActionBar.jsx +
   useLibraryBulkSelect + computeBulkDelete (helpers.js:65). Actions: add-to-campaign,
   canonize, export, delete — each wired to OUR existing store actions (canonize =
   settlementSlice.js:1835; verify the others exist, STOP+report any that don't).

3. SaveQuotaMeter (ledger §3 #14). OURS already computes the counts
   (SettlementsPanel.jsx:184-185); render the meter + upgrade funnel (their
   settlements/SaveQuotaMeter.jsx). Cap = free maxSaves 3 (authSlice TIER_GATE) — read it,
   don't hardcode; premium unlimited.

4. HEALTH PIPS + LIVING-WORLD SIGNAL ROW + crisis rail on cards (ledger §3 #14). Rooted in
   the missing `livingWorldSignals.js` / `HealthPip.jsx` / `LivingWorldSignalRow.jsx`
   (their SettlementCard.jsx:162,172,84-107). Adopt the three files; derive signals from
   OUR live worldState/pulse read-models (the same read-models the dossier uses — do NOT
   invent a parallel signal source, and do NOT subscribe to whole-settlement objects where
   a boolean selector suffices — F40 discipline). These surface which saved towns have
   pending drama at a glance.

5. NEEDS-ATTENTION sort + At-war / Has-deity / In-crisis filters (ledger §3). Depend on
   #4's helpers; add once those land (their LibraryToolbar.jsx:48-59,120-145).

6. Draft-phase / has-pending-edits filter chips (§3, PARTIAL — pipeline supports the keys,
   LibraryToolbar.jsx:71-87). Surface the chip/segment UI. RP-adjacent, include if cheap.

## Laws
Preserve OUR CampaignFolder/SettlementsPanel/LibraryToolbar logic; adopt the missing
files onto it. Living-world signals must be dormancy-correct (a settlement with no live
world → no signals, no pip, byte-quiet). Premium gate on advance is non-negotiable.
First-paint budget HARD (the Library surface is lazy — keep new heavy reads lazy;
livingWorldSignals must not ride first paint). Do-not-regress the OURS-ahead set.

## Shared checkout
Concurrent waves may run in other fences; the manager sequences. NOT yours: home/**,
map/**, gallery/**, account/**, dossier tab files. Yours: settlements/**,
SettlementsPanel.jsx, library/LibraryToolbar.jsx, CampaignFolder.jsx, SettlementCard.jsx,
+ the 3 new signal files. NO git add/commit/stash. Leave work unstaged.

## Gates
eslint clean; targeted tests (settlements/library + a new test pinning: advance gated to
premium, bulk-select actions, quota meter reads the real cap, signals dormancy-quiet);
typecheck + strict; build + verify:dist (budget); goldens byte-identical (UI-side).
Full suite --test-timeout=90000 (note flakiness, don't chase).

## Report
Per-item status (done/skipped-reason), the premium-gate verification for advance, files
touched + line counts, any absent store action found, first-paint before/after, gate
results, any OURS-ahead item worked around.
