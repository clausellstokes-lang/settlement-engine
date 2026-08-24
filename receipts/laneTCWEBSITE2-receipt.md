# laneTCWEBSITE2 receipt

STARTED 2026-08-23T06:28:27Z
lane: TC-WEBSITE-2 (chair-tier COMPILE, solo, zero repo writes)
charter target: /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/695a70c5-80ee-4ebd-b806-a8c102244d16/scratchpad/draft-WEBSITE-PLAN-2.md
clean tree: /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/695a70c5-80ee-4ebd-b806-a8c102244d16/scratchpad/chair-baseproof-b10ed1a1

## RESUME POINT 2026-08-23T06:55Z
- PROVEN (reads only, clean tree b10ed1a1; path motion b10ed1a1..claude/composite-r4 = 0 commits on every named path, tip 11539636, 13 commits):
  - entitlementLadder.js: 10 rows carry `ruled-2026-07-17` (NOT 11); of those only SIX claim a Cartographer-only paywall (map-editing, dm-pins, change-view, fog-table, interiors, v2-redraw); four are free:true parity rows.
  - ⚠ THE RECON'S "no gate exists" IS FALSE FOR FOUR OF SIX: the gate is `viewerCanAuthor` (src/lib/viewerAuthority.js:74) threaded as canEdit→entitled into townMap chrome (SettlementMapEditControls.jsx:93 LockedMarkers; fog/SettlementMapFogControls.jsx:70; SettlementMapNotes.jsx:157 FREE_CHANGE_DEPTH=1; useTownMapPresentation.js:121 editing). Pinned already by tests/components/{dmPinsTierGate,fogTierGate,changeViewDepthGate}.test.jsx + tests/ui/settlementMapPaneEdit.test.jsx. The recon grepped `canUse*` — wrong spelling.
  - interiors: InteriorView.jsx mounted by NOTHING in product (only boundBook artwork registry) — unshipped, no sample gate. v2-redraw: withLayoutLawVersion has ZERO UI callers; new settlements mint v2 for every tier. Both truly UNENFORCED and unshipped.
  - pdfExport: TIERS.*.features.pdfExport has ZERO readers in src (dead field that lies).
  - Surveyor: purchase→grant ALREADY BUILT end-to-end (create-checkout PRICE_MAP surveyor env-gated :72; webhook checkout branch :2890 grant_surveyor_entitlement (mig 159); .deleted revoke :3276; renewal money kind :3062). Client gap: stripe.js PRODUCTS has no surveyor row → startCheckout('surveyor') throws; App toast else-branch says 'Credits added.'; checkoutReconcile 'other product' arm.
  - The monthly ALLOWANCE is webhook-minted (grantMonthlyAllowanceIfNeeded :303, hard 30, Cartographer price-id gate :366 FAIL-OPEN when STRIPE_PRICE_PREMIUM unset). A Surveyor allowance needs a webhook edit (STOP-class) or a DB-side alternative.
- IN FLIGHT: pricing page test census; migration 174 margin policy read; webhook/create-checkout test files (bill); DESIGN_AI_CONTROL_SURFACE $19.99 line; .env.example; analyticsEvents.
- NEXT: read 174 + tests/edgeFunctions list, then write draft-WEBSITE-PLAN-2.md §0 + WEB-8.

## RESUME POINT 2026-08-23T07:25Z
- PROVEN since last point (reads only):
  - Surveyor purchase path EXECUTED-TESTED in the Deno suites: create-checkout/index.test.ts:694 (subscription session), :713 (auth required); stripe-webhook/index.test.ts:3271 (grant + surveyor_start), :3293 (ALLOWANCE TRAP: a Surveyor invoice mints NO 30-credit allowance), :3339 (deleted → revoke). No vitest test imports handleStripeWebhook.
  - The door is NOT flag-dark: FloatingAffordances.jsx:25 mounts SurveyorDoor on route visibility; stage kill-switches (mig 150) seed ON. A purchaser sees the door once 139/150/159 are pushed (owner's db-push train).
  - Ledger: source 'monthly_allowance' is special-cased (idempotency on stripe_invoice_id 018:94/116:94; spend FIFO allowance-first 024:182) ⇒ a Surveyor/annual allowance must REUSE source='monthly_allowance' (amount differs) — no migration.
  - credit value basis: ai_pricing_knobs creditValueUsd 0.157 (114:112), targetMultiplier 2.5 (174:100); formula pricingResync.ts:497. PRICING_MARGIN_SHEET.md ABSENT (ls + find + grep: only the 174 comment names it).
  - PACKET_STANDARD budget (docs/implementation/PACKET_STANDARD.md:440-455): ≤3 logic-bearing modified, ≤2 new leaves, ≤12 handwritten files, ≤400 eff, ≤250/leaf, ≤8 acceptance; "cannot fit ⇒ propose the smallest split".
  - Client gaps for Surveyor: stripe.js buildProductsMap lacks 'surveyor' (startCheckout throws 'Unknown product'); checkoutReconcile 'other product' arm; App.jsx:256-260 toast else-branch 'Credits added.'; module-level entitlement caches reset on the Stripe full-document return (no bust needed).
  - Annual plan: the webhook checkout branch keys on metadata.product==='premium' (webhook:2764) and throws 'Unhandled checkout product' for any other key (webhook:2927) ⇒ a 'premium_annual' product cannot ship without create-checkout+webhook edits; the allowance price-id gate (webhook:366) skips non-PREMIUM prices ⇒ annual credits need the webhook edit too.
- DECISION SHAPE (to be written): W-C = WEB-8 → WEB-9a (client purchase path, dark) → WEB-9b (pricing page lights it) → WEB-10 (STOP-class money-path: allowance table + annual) = 4 = the un-stamped cap.
- NEXT: write draft-WEBSITE-PLAN-2.md §0, §1 WEB-8, §2 WEB-9a, §3 WEB-9b, §4 WEB-10, §9-§13; then CLAIM_RE + C0 over the charter.

## REDISPATCH STARTED 2026-08-23T10:24Z (TC-WEBSITE-2 redispatch — resuming, NOT restarting)
- Found on disk at resume: this receipt (last RESUME POINT 07:25Z) + draft-WEBSITE-PLAN-2.md 583 lines (§0, §1 WEB-8, §2 WEB-9a, §3 WEB-9b complete; ends after §3's owner-gated remainder). The redispatch brief's "died before writing anything" is STALE — the prior lane wrote ~48KB. §4 WEB-10 (STOP-class), §9 topology, §10 deferred rows, §11 open questions, §12 judgments, §13 standing laws, CLAIM_RE + C0 scans: NOT yet written.
- Plan: spot-verify the load-bearing claims of §0-§3 by executed grep in the clean tree (ladder count, viewerCanAuthor chain, webhook grant/allowance lines, stripe.js gaps, 174 margin policy), then write §4, §9-§13 in place, then CLAIM_RE + C0.

## RESUME POINT 2026-08-23T10:46Z (redispatch)
- RE-VERIFIED by executed grep at b10ed1a1 (every §0-§3 load-bearing claim HOLDS): ladder = 10 ruled rows (6 paywall / 4 parity) · gate spelled viewerCanAuthor (viewerAuthority.js:74-78; SettlementDetail.jsx:231; EditControls:93; FogControls:70; Notes:33/157; useTownMapPresentation:121) · `canUse*` = 88 src hits, ALL customContent/mapChains/neighbour/magicalIsolation, 0 in townMap/interior/pricing/config · InteriorView: comment mentions + boundBook registry only · withLayoutLawVersion 0 UI callers · pdfExport 0 readers · webhook allowance :303-410 hard 30 + PREMIUM price-id gate fail-open · checkout branch premium :2764 / surveyor :2890 / 'Unhandled checkout product' :2926 · create-checkout PRICE_MAP :62-79, no interval param, SUBSCRIPTION_PRODUCTS :97, founder_lifetime ABOLISHED (§118) · 174:17 policy 2.5×/1.2× · 114:112 creditValueUsd 0.157 · PRICING_MARGIN_SHEET.md absent (ls + grep: 174 is the only mention) · Deno pins :694/:713 and :513/:526/:3271/:3293/:3317/:3339 · contracts.test.js:1487 catalog-drift detector (every PRICE_MAP key must appear in the webhook) · applied-head 121.
- CORRECTION to §2: the ":1160 idiom" is tests/edgeFunctions/contracts.test.js:1160, not pricing.test.js — fixed in the draft.
- Build tip moved: claude/composite-r4 = 421c7345 (31 over b10ed1a1); path motion on every charter surface STILL 0 (executed). Ledger HEAD 84ca4c6d.
- NEXT: write §4 WEB-10 (STOP-class; allowance table + premium_annual server half; annual CLIENT half → WEB-11 priced), §9 topology, §10 deferred, §11, §12, §13; then CLAIM_RE + C0.

## RESUME POINT 2026-08-23T11:20Z — CHARTER COMPLETE (redispatch)
- draft-WEBSITE-PLAN-2.md now §0-§5, §9-§13 (≈1035 lines, ≈93KB): §4 WEB-10 STOP-class proposal (allowance table Surveyor 25 / annual 300 / Cartographer 30; `premium_annual` server half; NO migration; bill enumerated; the owner's 8-item Stripe to-do), §5 WEB-11 priced (annual client half, W-D), §9 W-C = WEB-8 → 9a → 9b → 10 with the shared-path split-promotion order, §10 ten sweep rows, §11 C1-C8 / O1-O5, §12 J1-J14, §13 laws (§440.2/§457 INLINE SHELL EXPORTS, §460.1 widened sweep not check:tail, §410 retrospective-mint status, §448, money-path law) — the first three corrected after reading the ODQ sections verbatim (the brief's shorthand had misled the first draft of §13).
- Corrections applied to the prior lane's §0-§3: §2 ":1160 idiom" → contracts.test.js; App.jsx size-baseline 650 exact-ceiling red; §2 contract 5 resolved (paidAction kind is an open string — executed); §1 contract 5/A6 refined to ACTIVE/ABOLISHED/LEGACY (J8) with `ACTIVE_CHECKOUT_SKUS` (J14); §0 rounding 9.1×/3.07×.
- Scans: CLAIM_RE (exact, enforcement-claims.test.js:40, plain `node -e`) = 0 hits on charter + receipt; C0 (controlBytes.test.js:58 rule) = 0 on both. Re-run after the last edit below.
- Zero repo writes, zero git mutations, zero vitest/npm/deno runs; no sub-agent spawned (§465).
