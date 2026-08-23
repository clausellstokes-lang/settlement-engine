# THE WEBSITE TRAIN — SECOND TRAIN (W-C): PAID-SURFACE HONESTY — charter compile (ODQ §464.2: WEB-8 · WEB-9)

**Status:** **RULED at ODQ §471 (2026-08-23); skeptic-verified at b10ed1a1** — RULED-AS-AMENDED
once the nine §471 items below are applied (this revision, lane TC-WEBSITE-2-R2: every edit is
tagged `§471.x/F#` at its point of change; the pre-edit text is preserved as
`draft-WEBSITE-PLAN-2.pre-R2.md`). Promotion of any member to READY is the chair's act. The
skeptic pass (one Opus agent, §470) executed every load-bearing claim: fourteen confirmed
verbatim (the zero-motion base check over 39 paths, the `viewerCanAuthor` correction, the
unshipped pair, the Surveyor server path, the allowance trap, the arithmetic), one STOP (F1)
and six must-fixes (F2-F7) plus two notes (F8, F9) — all applied in place below.
**Compiled by:** lane TC-WEBSITE-2 (COMPILE, chair-tier, solo under the §465 two-lane cap —
no sub-agent was spawned; ODQ §464.2 dispatch; template: TC-WEBSITE's draft-WEBSITE-PLAN.md,
§402 ruled). Wrote nothing in the repository, moved no ref, created no worktree, ran no npm
install, no vitest, no build. ODQ read READ-ONLY in the main checkout on the ledger branch
`review-fixes-2026-07-08` (HEAD `0582e3bc5` = §465.1 at the first lane's read; `84ca4c6d` =
§468 at the redispatch's re-read, 2026-08-23 ~10:25Z — the redispatch RESUMED this draft from
the prior lane's §0-§3 and RE-VERIFIED every load-bearing claim by executed grep before
writing §4-§13; §468's "died before writing a byte" is STALE — the receipt and 583 lines were
on disk at 01:43/01:48 CDT).
**Every engine/site fact below is pinned to the chair's clean baseproof tree at
`b10ed1a1`** (`chair-baseproof-b10ed1a1`, `git status --short` = 0 lines at lane start).
The build tip is newer — `claude/composite-r4` resolved to `11539636` (13 commits over
b10ed1a1) at the first lane's read and to **`421c7345` (31 commits)** at the redispatch's —
and **`git log --oneline b10ed1a1..claude/composite-r4 -- <every path named in this charter>`
returned ZERO commits BOTH times** (executed from the main checkout, read-only; the path
list (the redispatch added src/lib/stripe.js · checkoutReconcile.js · App.jsx ·
PricingPage.jsx · src/components/pricing/): src/config/pricing.js · tierFacts.js · entitlementLadder.js · src/copy/pricingPage.js ·
src/store/authSlice.js · src/components/surveyor/ · src/lib/stripe.js · analyticsEvents.js ·
supabase/functions/create-checkout/index.ts · stripe-webhook/index.ts · migrations 139/174 ·
tests/config/ · tests/edgeFunctions/ · docs/DESIGN_AI_CONTROL_SURFACE.md · .env.example ·
docs/PRICING_MARGIN_SHEET.md). None of these surfaces moved; the migration head at the tip is
197 (198 WEB-2 / 199 WEB-3 in holding — §455/§460).
**Figure convention:** every numeral is a point-in-time measurement at b10ed1a1 and is marked
**STOP: RE-DERIVE AT BASE**; line numbers are hints, executors navigate by symbol; no figure
may be transcribed into code, pins, or the ledger from this document.
**Family:** website/product-surface — **un-stamped ⇒ four-member cap per train** (PACKET_STANDARD
"Differential member caps", b10ed1a1 docs/implementation/PACKET_STANDARD.md:179-195). Budget
block (PACKET_STANDARD:440-455): ≤3 existing logic-bearing production files modified · ≤3
registration-only · ≤2 new logic leaves · ≤12 handwritten files incl. tests · ≤400 effective ·
≤250/leaf · ≤15 per shared/hot-file delta · ≤8 acceptance. "If the work cannot fit, the agent
stops and proposes the smallest split" — applied below (§9): the ruling's WEB-9 is compiled as
**WEB-9a + WEB-9b**, and the allowance + annual plan as **WEB-10 (STOP-class)**.
**Binding compile laws carried:** §379.3 (no member here retires a symbol — VACUOUSLY
SATISFIED, said so); §384.2/§397 S0 two-part OSR reading at the member's ACTUAL base;
§389.1 bare gate = envelope instrument; §441 (a compile's CONFIRMED is a hypothesis —
every "exists / does not exist" below was grepped with the spelling varied and the
variations are listed); §403.1 (no `| head` beneath an absence claim — every census below
printed its full count. **§471.2/F7:** the first revision's `monthly_allowance` migration
census printed TWO files where the executed grep returns SIXTEEN, and its two money-path
reader floors were produced by a spelling that cannot see path-segment readers — both are
corrected in §4 with the full lists printed; the R2 pass re-executed every other census in
this document at b10ed1a1 and found them whole).

---

## §0 · ONE-PAGE SUMMARY

§464.2 ruled three paid-surface honesty items (§449's O-P1/O-P2/O-P3) into a second website
train: **WEB-8** (de-advertise + the enforcement-symbol pin + the pdfExport pin) and **WEB-9**
(the Surveyor tier end-to-end at $14.99/mo with a small allowance on top of BYOK; Cartographer
HOLDS at $5.99 and gains an ANNUAL plan). Compiled shape: **ONE train, FOUR cars — the cap
exactly** — because two measured facts reshape the ruled pair:

1. **The O-P1 premise is FALSE for four of its six paywall rows.** The recon grepped `canUse*`;
   the gate is spelled `viewerCanAuthor` (src/lib/viewerAuthority.js:74-78) threaded as
   `canEdit` → `entitled` into the town-map chrome, and three of the four rows already carry
   executed tier-gate pins (tests/components/dmPinsTierGate · fogTierGate ·
   changeViewDepthGate). Only **interiors** and **v2-redraw** are truly unenforced — and both are
   also UNSHIPPED (§1). De-advertising ten rows literally would delete four TRUE paywalls and
   four TRUE free-for-all rows. WEB-8 is compiled to the ruling's INTENT (no advertised paywall
   without a resolving gate) with the literal shape priced as the fallback — **C1**.
2. **Surveyor's purchase→grant path is ALREADY BUILT and executed-tested** (create-checkout
   `surveyor` env-gated :72; webhook grant :2890 / revoke :3276 / renewal money-kind :3062;
   Deno pins at create-checkout/index.test.ts:694,713 and stripe-webhook/index.test.ts:3271,
   3293,3339). What is missing is the CLIENT half (the catalog row, the purchase CTA, the
   return reconcile) — and the **allowance is webhook-minted** (hard `30`, Cartographer
   price-id gated, :303-410), so "a small monthly credit allowance" and the annual plan both
   require a money-path edit. The brief makes that a STOP-class proposal, not a car edit.

**TRAIN W-C (4 members, the un-stamped cap exactly):**

| Car | Ruled item | One line | Migration | Money-path edit |
|---|---|---|---|---|
| WEB-8 | O-P1 + O-P3 (+ the stale SKUs) **+ the siblings' registration stubs (§471.1/F1)** | Re-point the four ENFORCED map rows to `viewerCanAuthor`, retire the two UNSHIPPED rows to a deferred ledger, re-spell the four parity rows; a walker pins "every row that CLAIMS a paywall names a resolving gate" (§471.2/F4); `pdfExport` parity pinned (free = per-dossier); **WEB-8 ALONE owns `src/config/pricing.js`, `tests/config/pricing.test.js` and `.env.example`** and lands there, behind dials at 0, the stubs its siblings will read: `SURVEYOR_PLAN` (`monthlyCredits: 0`), `ANNUAL_FACTOR = 0` + `CARTOGRAPHER_ANNUAL` (derives to nothing at 0), `ACTIVE_CHECKOUT_SKUS` (dial-aware: `premium_annual` joins only when `ANNUAL_FACTOR > 0`) with the two-way source-scan parity arm against create-checkout's active block (F8 folded); `.env.example` corrected with a walker; `STRIPE_PRICE_FOUNDER_LIFETIME` struck from DEPLOY.md's money block (§471.2/F9) | none | none |
| WEB-9a | O-P2 (client purchase path, DARK) | The `surveyor` PRODUCTS row (price derived from WEB-8's `SURVEYOR_PLAN`) so `startCheckout('surveyor')` resolves; the return reconcile polls the real entitlement; the success-toast map is EXTRACTED to `stripe.js checkoutSuccessMessage()` (mandatory — §471.2/F2) and names the tier; `scripts/.size-baseline.json` App.jsx ratchets DOWN to the measured count | none | none (create-checkout's existing product is lit by env) |
| WEB-9b | O-P2 (the pricing page LIGHTS it) | The Surveyor band becomes a real subscription card: price from config, purchase/manage CTA on the entitlement read, "No subscription required" → "per-task credits OR the Surveyor tier"; the design doc's $19.99 reconciled to the ruled $14.99 | none | none |
| WEB-10 | §464.2 allowance + the ANNUAL plan's SERVER half | **STOP-CLASS PROPOSAL** (§4): the webhook's allowance becomes a price-id → (credits, plan) table (Cartographer monthly 30 — PRESENT-BY-DEFAULT, §471.2/F5 · Cartographer annual 300 · Surveyor 25, all `source='monthly_allowance'`); create-checkout gains `premium_annual`; the two pricing.js dials flip (`monthlyCredits` 0 → 25, `ANNUAL_FACTOR` 0 → 10 — the ONE residual shared-path touch, lawful by serial mint: WEB-8 is LANDED before WEB-10 is minted, §9); the band's allowance sentence lights by the dial. **§471.2/F3: the annual SKU exists server-side and is UNPURCHASABLE until WEB-11** — no annual CTA, no annual copy, nothing user-visible claims an annual plan at this car | none | YES — stripe-webhook + create-checkout, each with its executing Deno suite |

**Overflow, priced not folded (§471.2/F3):** the annual plan's CLIENT half is **WEB-11** (§5)
— **the ONE car of train W-D, dispatched the moment WEB-10 lands**; the un-stamped four-cap
forbids a fifth W-C car. **§464.2's annual clause ("gains an ANNUAL plan (two months free)")
is therefore delivered by W-C + W-D TOGETHER — W-C alone ships a dark server-side SKU and
no way to buy it; the chair rules the annual clause into both trains, not one.** The
credit-pack analytics event is a §10 deferred row (the WEB-4 rider cost). The split is the
cap's arithmetic, not a judgment about worth (C7).

**Shared change paths (§471.1/F1 — the STOP the skeptic found, cured):** the validator
reserves a change path at EVERY non-terminal packet status (`reservesChangePaths =
!TERMINAL.has(status)`, implementation-packets.mjs:543 — DRAFT, READY, BLOCKED and STALE all
reserve; only LANDED / SUPERSEDED release), so the first revision's "split promotion" was
unmintable. The cure is DE-DUPLICATION: WEB-8 alone owns the three config paths; WEB-9a and
WEB-9b touch none of them; WEB-10's two dial flips are the one residue and are minted only
after WEB-8 is LANDED (§9 states the rule as the validator enforces it).

**The allowance arithmetic (§4, PLAUSIBLE — the margin sheet 174 cites is ABSENT from the tree):**
at the policy's own implied bounds (creditValueUsd 0.157; narrative priced 5 credits under
≥2.5× expected / ≥1.2× worst-case ⇒ expected COGS ≤ $0.063/credit, worst-case ≤ $0.131/credit),
a **25-credit** Surveyor allowance costs ≤ $1.57 expected / ≤ $3.27 worst-case (§471: the
first revision's "$1.58" was a rounding slip — 25 × 0.0628 = 1.57, as §4's table says) against
$14.26 net (after Stripe 2.9% + $0.30) — **9.1× / 4.4×**, clearing both floors with room;
the policy ceiling is ≈90 credits. 25 = the starter pack, so the copy derives ("the starter
pack, every month") with zero hand-typed numbers. The $5.99/30 Cartographer bundle reads
**2.9× / 1.4×** at the same bounds — thin, NOT underwater (the recon's "plausibly underwater"
compared credit VALUE, not COGS). An annual 360-credit grant reads 2.55× / 1.23× — at the
floors; **300** clears (3.07× / 1.47×) — C4.

**Stays owner (unchanged by this compile):** `supabase db push` of the Surveyor stack
(139/150/159 are among the ~75 unpushed) and of every WEB migration (§464.4) · the Stripe
dashboard products (§4 "THE OWNER'S STRIPE TO-DO", exact) · `STRIPE_PRICE_SURVEYOR` /
`STRIPE_PRICE_PREMIUM` / `STRIPE_PRICE_PREMIUM_ANNUAL` in the Functions secrets · the legal
placeholders (docs/legal/TERMS_OF_USE_DRAFT.md:104,418 "$19.99 PROVISIONAL" — counsel's) ·
the deploy · the tuning signature · every COPY wording walk beyond the config-derived strings
compiled here.

---

## §1 · WEB-8 — PAID-SURFACE HONESTY: THE LADDER, THE pdfExport DRIFT, THE STALE SKUs (O-P1, O-P3)

### The ruling being implemented

§464.2: "O-P1 the ten unenforced Cartographer map rows are DE-ADVERTISED until the map ships
(the pricing table stops claiming a paywall that does not exist), with a contract-test pin that
every advertised Cartographer-only row has an enforcement symbol; at map activation (D3b/P6)
the rows return WITH their gates · … · O-P3 the `pdfExport` drift pinned in the tierFacts
contract test (free = per-dossier)." The chair's brief adds (d) `.env.example`'s stale SKUs
and (e) the credit-pack analytics event if it fits the cap.

### What exists at the pin (executed reads, b10ed1a1)

**The ladder** — `src/config/entitlementLadder.js` (102 lines). `grep -c "enforcement:
'ruled-2026-07-17'"` = **10** (the recon's "11" counted the header comment at :21; §449's
"ten of the eleven" is the maps-exports group's eleven rows, of which nine are ruled + one
in world-generation). The ten, by what they CLAIM:

| id | line | free | cartographer | claims a paywall? |
|---|---|---|---|---|
| gallery-viewing | :53 | true | true | no — parity |
| map-view | :67 | true | true | no — parity |
| provenance-hover | :68 | true | true | no — parity |
| panorama | :70 | true | true | no — parity |
| map-editing | :71 | false | true | YES |
| dm-pins | :72 | false | true | YES |
| change-view | :73 | false | true | YES |
| fog-table | :74 | false | true | YES |
| interiors | :75 | '1 sample per settlement' | true | YES (qualified) |
| v2-redraw | :76 | false | true | YES |

**The gates, hunted with the spelling varied** (`canUse*` → 0 hits in src/components/townMap
and src/components/interior, the recon's result reproduced; then `entitled|canEdit|
viewerCanAuthor|isPremium|auth\.tier|TIER_GATE|cartographer` → **25 hits in townMap**, 0 in
interior). The authority is ONE predicate:

- `src/lib/viewerAuthority.js:74-78` `viewerCanAuthor(state)` = `tier === 'premium' ||
  tier === 'founder' || isElevated() === true`, fail-closed; "THE single source for the
  dossier AUTHORING-AUTHORITY spelling" (:2). SettlementDetail.jsx:231 `canEdit =
  useStore(viewerCanAuthor)` → SettlementDossierHero.jsx:103 `mapCanEdit={canEdit}` →
  OutputContainer.jsx:729 `<MapTabShell canEdit={mapCanEdit}>` → MapTabShell.jsx:216 →
  SettlementMapPane.jsx:751/773/781 `entitled={!!canEdit}`.
- **map-editing**: useTownMapPresentation.js:120-124 `editing = audience==='dm' &&
  Boolean(canEdit) && authoringSaveId != null && desktop` — the SM-3 edit chrome mounts only
  under it (SettlementMapPane.jsx:755 comment "desktop + canEdit + a saved blob only").
  Pinned: tests/ui/settlementMapPaneEdit.test.jsx (exists; reads `canEdit`).
- **dm-pins**: SettlementMapEditControls.jsx:93 `{savedMap && !entitled && <LockedMarkers />}`
  (:139-170 the locked teaser, aria-label "DM markers are a Cartographer premium feature").
  Pinned: tests/components/dmPinsTierGate.test.jsx (header :4-17: free sees the lock, premium
  passes, derivation tier-blind by source scan).
- **fog-table**: fog/SettlementMapFogControls.jsx:70 `if (!entitled)` → the locked panel
  (:83 aria-label "Fog of war is a Cartographer premium feature"). Pinned:
  tests/components/fogTierGate.test.jsx.
- **change-view**: SettlementMapNotes.jsx:33 `FREE_CHANGE_DEPTH = 1`, :157 `depth = entitled
  ? Infinity : FREE_CHANGE_DEPTH`, :211-216 the hidden-count padlock. Pinned:
  tests/components/changeViewDepthGate.test.jsx. NOTE the ladder's `free: false` is itself a
  small lie — free sees the LATEST change per band; the honest cell is a qualifier.
- **interiors**: `src/components/interior/InteriorView.jsx` is "STORE-FREE … mounted-from-a-
  plain-prop" (:1-25) and is imported by NOTHING in product — `grep -rln InteriorView src`
  = boundBook.js:117 (an artwork registry row), two fog files whose hits are the phrase
  "the InteriorView posture" in comments, domain/interior/index.js, and itself; `grep -rn
  "onEnterInterior|enterInterior|openInterior" src` = 0. No "1 sample per settlement" gate
  exists anywhere (`grep -rn "sample" src/components/interior` = 0). UNENFORCED **and
  UNSHIPPED**.
- **v2-redraw**: `withLayoutLawVersion` (domain/townMap/mapEdits.js:581) has ZERO callers
  outside mapEdits.js/index.js (`grep -rn withLayoutLawVersion src` = the definition + the
  barrel); `newSettlementMapEdits()` (:611) mints `layoutLawVersion: 2` for EVERY new
  settlement at the create boundary (SaveToLibraryButton.jsx:41,91; SettlementsPanel.jsx:166;
  BuyThisDossier.jsx:158) regardless of tier. There is no opt-in UI and no gate. UNENFORCED
  **and UNSHIPPED as an opt-in**.
- **the four parity rows** claim nothing a gate could enforce: map-view (SettlementMapPane is
  "the town-map VIEWER … VIEWING stays free on every tier" :2,:32), provenance hover
  (townMap/provenanceModel.js), panorama (`buildTownMapPanoramaDrawList` imported at
  SettlementMapPane.jsx:41), gallery viewing (PublicDossierView.jsx:147 mounts the pane with
  `canEdit={false}`). True today, paywall-free, no gate needed.

**Existing ladder readers** (`grep -rln entitlementLadder tests` = 2): tests/ui/
pricingPageBands.test.jsx:119-131 (the LADDER WALKER — every row must have a label in
`band4.rows` and render; string cells must render verbatim) and tests/config/
illustratedLensFree.test.js:24 (finds rows by id: `all-lenses`). Neither reads `enforcement`.
The comparison table renders `row.free` / `row.cartographer` only (PricingBands.jsx:255-270).

**pdfExport** — `src/config/pricing.js:245` `wanderer.features.pdfExport: true` (cartographer
:263 true, founder :288 true) vs `src/config/tierFacts.js:45` `EXPORT_MODE.free 'per_dossier'`
and `src/store/authSlice.js:49` `TIER_GATE.free.export: false`. **`TIERS.*.features.pdfExport`
has ZERO readers** (`grep -rn "features\.pdfExport|pdfExport" src` = the three pricing.js lines
+ an unrelated i18n key `errors.pdfExportFail`; `.features.` reads in src are the COPY
registry's feature lists, a different object). The contract test
(tests/config/tierFacts.contract.test.js:31-44) pins tierFacts ↔ TIER_GATE but never touches
TIERS.features — the drift is a dead field that lies, invisible to every pin.

**.env.example** — :33-34 `STRIPE_PRICE_CREDITS_10/50` (legacy keys kept RESOLVABLE in
create-checkout PRICE_MAP :78-79 for refund/replay, not sold) while the active catalog
(pricing.js NEW_PACKS :47-51 credits_25/60/150, SINGLE_DOSSIER :297, surveyor) is absent; the
canonical list already lives in docs/DEPLOY.md:303-318 (incl. `STRIPE_PRICE_SURVEYOR` with
its ⛔ unset note). Readers of .env.example in tests: tests/docs/docCounts.test.js:179-181
(the error-reporter sink line only) and tests/security/committedSecretsScan.test.js:85
(an exception row). No test pins the SKU lines.

**DEPLOY.md's money block (§471.2/F9 — executed, b10ed1a1):** docs/DEPLOY.md:298 opens
"**Money — a first cutover cannot take payment without these.**" and **:305 still lists
`STRIPE_PRICE_FOUNDER_LIFETIME`** — a SKU create-checkout REFUSES to sell
(`ABOLISHED_PRODUCTS` :113, ODQ §118) and that no function reads (`grep -rn
STRIPE_PRICE_FOUNDER_LIFETIME supabase/functions` = a header comment at
create-checkout/index.ts:35 + a test fixture at index.test.ts:35 — NO `Deno.env.get`;
`grep -rn FOUNDER_LIFETIME tests` = 0). deployRunbookFreshness runs in ONE direction
(consumed ⇒ documented, :371-384), so the stale line is inert to every pin — and
DEPLOY.md:407-413 records that very line as its worked example of the tolerated
"documented-but-unconsumed" state. Leaving it means WEB-8's `.env.example` walker forbids a
name the canonical runbook still instructs a deployer to set: two documents disagreeing
about one SKU. WEB-8 strikes it (contract 7).

**The credit-pack analytics event (e)** — `src/lib/analyticsEvents.js` is a frozen registry
with `EVENTS_REV` bumps, `EVENT_CLASS`, the edge-shared bundle (analyticsEventsBundle.
freshness + edgeSharedBundleReproducibility), the analytics dictionary
(analyticsDictionaryFreshness) and metricsRegistry — 14 test files read it. WEB-4 measured
the cost of one registry row at a twelve-row rider (§446). **NOT FOLDED** — it cannot fit
beside the rest under ≤400 and it touches a generated bundle WEB-3 already broke once
(§460.2). Recorded as a deferred row in §10; it belongs to the telemetry client train.

### Behaviour contract

1. The comparison table claims a Cartographer-only paywall ONLY for rows whose `enforcement`
   names a symbol that resolves in code; a row resting on the 2026-07-17 ruling alone may
   only claim parity (both columns included).
2. The four gated map rows re-point to `viewerCanAuthor` (the truth), and `change-view`'s
   free cell becomes the honest qualifier `'latest change only'` (pinned to
   `FREE_CHANGE_DEPTH = 1` by source scan — the house idiom the three gate tests already use).
3. `interiors` and `v2-redraw` leave the rendered ladder into `DEFERRED_LADDER_ROWS` (a frozen
   ledger in entitlementLadder.js: id · the claim as it will return · `returnsAt:
   'map activation D3b/P6'` · reason) so the return is a move, not a rewrite; their
   `band4.rows` labels STAY (pinned present, pinned NOT rendered).
4. `TIERS.wanderer.features.pdfExport` becomes `false` (free exports per-dossier via the $2.99
   ladder — the same spelling TIER_GATE.free.export uses) and the contract test pins
   `TIERS.<tier>.features.pdfExport === TIER_GATE.<legacy>.export` for wanderer/free,
   cartographer/premium, founder/premium.
5. `.env.example` lists every ACTIVE checkout SKU's env name (derived from ONE exported list
   `ACTIVE_CHECKOUT_SKUS` in pricing.js = the active pack keys + `premium` + `single_dossier`
   + `surveyor` + (**§471.1/F1, F8 folded:** `premium_annual` IFF `ANNUAL_FACTOR > 0` — the
   list is DIAL-AWARE, so at this car it excludes `premium_annual` and at WEB-10 it includes
   it without a second edit to the derivation) → `STRIPE_PRICE_` + key upper-cased)
   and no ABOLISHED one (`founder_lifetime` — create-checkout's own `ABOLISHED_PRODUCTS`,
   ODQ §118); LEGACY keys (`credits_5/10/15/40/50`, kept resolvable for refund/replay —
   create-checkout :73-78) are tolerated ONLY under a "legacy — refund/replay" comment block,
   never in the active block (J8: DEPLOY.md:407-413's own one-direction rule — documented-but-
   unconsumed is inert, undocumented-but-consumed breaks a cutover). A walker pins all three
   classes. **The two-way source-scan parity arm (F8):** `ACTIVE_CHECKOUT_SKUS` ↔ the keys of
   create-checkout's ACTIVE `PRICE_MAP` block (:65-72 at base, the block between the
   "Active catalog" and "Legacy SKUs" markers) — same set, both directions, the
   contracts.test.js:1160 idiom — so when WEB-10 adds `premium_annual` to the server block in
   the same commit that flips `ANNUAL_FACTOR`, the scan stays green, and if either side moves
   alone it reds. `.env.example` ALSO pre-lists `STRIPE_PRICE_PREMIUM_ANNUAL` in its active
   block under a one-line comment ("registered behind `ANNUAL_FACTOR`; consumed from WEB-10")
   so WEB-10 never touches `.env.example` (J-R2-3).
6. **The siblings' registration stubs (§471.1/F1 — WEB-8 ALONE owns `src/config/pricing.js`):**
   (a) `SURVEYOR_PLAN` — `{ key:'surveyor', stripeProduct:'surveyor', priceCents: 1499,
   billing:'monthly', monthlyCredits: 0, byok: true, entitlement: 'surveyor_entitlements' }`,
   frozen, OUTSIDE `TIERS` (TIERS keys are `profiles.tier` shapes; Surveyor is an
   entitlement — 139's own reason for not widening the tier CHECK), so `getVisibleTiers()`
   stays three-way (pinned tests/config/pricing.test.js:315-320) and no TIERS iterator changes
   (none exists: `grep -rn "Object\.(keys|values|entries)\(TIERS\)" src tests` = 0).
   `monthlyCredits: 0` is THE DIAL — WEB-9b's allowance sentence keys on it and WEB-10 flips
   it; the :100-101 "PROVISIONAL — owner-queued" header sentence is re-worded "ruled §464.2".
   (b) `ANNUAL_FACTOR = 0` (THE SECOND DIAL; WEB-10 sets 10 — "two months free") and a frozen
   `CARTOGRAPHER_ANNUAL = { key:'premium_annual', stripeProduct:'premium_annual', priceCents:
   TIERS.cartographer.priceCents * ANNUAL_FACTOR, billing:'annual', credits:
   TIERS.cartographer.monthlyCredits * ANNUAL_FACTOR, factor: ANNUAL_FACTOR }` — at dial 0 it
   derives to a zero-priced, zero-credit, UNLISTED plan that no surface reads; NOT a TIERS
   key (Surveyor's reason applies). (c) `ACTIVE_CHECKOUT_SKUS` as contract 5. Every stub is
   registration-only: no reader of `SURVEYOR_PLAN` or `CARTOGRAPHER_ANNUAL` exists until
   WEB-9a/9b/11 import them, and the pins WEB-8 writes for them hold at BOTH dial values
   (they pin the DERIVATION — `priceCents === ANNUAL_FACTOR * TIERS.cartographer.priceCents`
   — and the dial's CONSEQUENCE — `ACTIVE_CHECKOUT_SKUS.includes('premium_annual') ===
   (ANNUAL_FACTOR > 0)` — never the dial's value, which is WEB-10's pin).
7. **DEPLOY.md (§471.2/F9):** the `STRIPE_PRICE_FOUNDER_LIFETIME` line (:305) is STRUCK from
   the money block — one doc line, citing ODQ §118 in the commit, CLAIM_RE-clean (the line
   carries no claim vocabulary); the :407-413 paragraph that names it as the worked example
   of "documented-but-unconsumed" is left as written — it describes a state that WAS true and
   the paragraph's rule still binds (J-R2-4: an executor who prefers may re-word its one
   clause to past tense at +0 lines; either is lawful).

### Non-goals, affirmatively

- Does NOT add a `canUse*` symbol, does NOT change `viewerCanAuthor` or any gate's behaviour
  (no paid-surface behaviour moves — only the TABLE and a dead field).
- Does NOT touch the edge functions, the webhook, any migration, RLS or grants.
- Does NOT ship interiors or the v2 opt-in — they return at map activation per the ruling.
- Does NOT add the analytics event (deferred, §10).
- Does NOT change the Cartographer price ($5.99 HOLDS, §464.2).
- **§471.1/F1:** does NOT flip either dial — `SURVEYOR_PLAN.monthlyCredits` stays `0` and
  `ANNUAL_FACTOR` stays `0` at this car; does NOT add `premium_annual` to create-checkout
  (the parity scan holds because BOTH sides lack it); does NOT give `SURVEYOR_PLAN` or
  `CARTOGRAPHER_ANNUAL` a reader (9a/9b/11 import them later).

### Change manifest (priced against PACKET_STANDARD:440-455; re-priced §471.1/F1)

| Path | Kind | Eff (est.) |
|---|---|---:|
| `src/config/entitlementLadder.js` | modify (logic-bearing config): header rewritten (the `ruled-2026-07-17` vocabulary retired — "gate has not landed yet" is now false for four rows and vacuous for four); rows :71-74 → `enforcement: 'viewerCanAuthor'`; :73 free → `'latest change only'`; :53/:67/:68/:70 → `enforcement: 'parity'`; :75/:76 removed; `DEFERRED_LADDER_ROWS` export added | ~35 |
| `src/config/pricing.js` | modify (registration-only; **the ONLY W-C writer of this file except WEB-10's two dial flips** — §471.1/F1): :245 `pdfExport: false` + a two-line comment naming TIER_GATE.free.export as the truth (~3); `SURVEYOR_PLAN` + its header re-word (~18, contract 6a — moved here from WEB-9a); `ANNUAL_FACTOR = 0` + `CARTOGRAPHER_ANNUAL` + the "two months free" derivation comment (~14, contract 6b — moved here from WEB-10, at dial 0); `ACTIVE_CHECKOUT_SKUS` dial-aware (~6, contract 5) | ~41 |
| `.env.example` | modify (docs-class, not production): :33-35 → the active block (CREDITS_25/60/150, PREMIUM, SINGLE_DOSSIER, SURVEYOR, + PREMIUM_ANNUAL under its dial comment — J-R2-3) + a legacy block under a marker comment | ~13 |
| `docs/DEPLOY.md` | docs (§471.2/F9): strike :305 `STRIPE_PRICE_FOUNDER_LIFETIME` from the money block | 1 |
| `tests/config/entitlementLadder.enforcement.test.js` | **CREATE** (the walker): resolver table `{ 'TIER_GATE.<k>': TIER_GATE.free[k]===false && TIER_GATE.premium[k]===true; 'TIER_GATE.maxSaves': free < premium; 'viewerCanAuthor': viewerCanAuthor({auth:{tier:'free'}})===false && ({tier:'premium'})===true; 'TIER_GATE.free.maxTier' / 'TOWN_MAP_STYLE_IDS' / 'SURVEYOR_AI_COSTS' / 'constitutional' / 'parity': parity-only — no resolution demanded }`; **rule A (§471.2/F4): every row that CLAIMS a paywall — `row.free !== row.cartographer` — names an enforcement symbol that RESOLVES to "free refused, premium granted"** (never `free !== true`: two parity rows, `all-lenses` :69 and `surveyor-stages` :83, carry equal STRING cells and would red the wrong predicate — executed over all 19 rows at b10ed1a1: `free !== cartographer` claims 11 / parity 8; `free !== true` is 13, the two extras exactly those rows); rule B: a row with `free === cartographer` demands no resolution, and the four `'parity'`-marked rows are `true/true`; rule C: `DEFERRED_LADDER_ROWS` ids are absent from the ladder, present in `band4.rows`; rule D: `'latest change only'` ⇔ `FREE_CHANGE_DEPTH = 1` by source scan; negative controls: a planted `{free:false, cartographer:true, enforcement:'ruled-x'}` row REDS rule A (the §441 self-anchor) AND a planted `{free:'x', cartographer:'x', enforcement:'ruled-x'}` row does NOT (proving the predicate is the pair comparison) | ~100 |
| `tests/config/tierFacts.contract.test.js` | modify: the pdfExport parity block | ~14 |
| `tests/config/pricing.test.js` | modify (**the ONLY W-C writer except WEB-10's dial-value pins** — §471.1/F1): the `.env.example` SKU walker over `ACTIVE_CHECKOUT_SKUS` (active present in the active block · `FOUNDER_LIFETIME` absent · legacy only under the legacy marker) (~24); the two-way `ACTIVE_CHECKOUT_SKUS` ↔ create-checkout active-block parity scan with a planted-extra negative control on EACH side (~14, F8); `SURVEYOR_PLAN` pins — `priceCents === 1499` (derived-equals `14.99*100`), `billing === 'monthly'`, `stripeProduct` matches a create-checkout PRICE_MAP key by source scan, NOT in `getVisibleTiers()` (~16, from WEB-9a); `CARTOGRAPHER_ANNUAL` DERIVATION pins — `priceCents === ANNUAL_FACTOR * TIERS.cartographer.priceCents`, `credits === ANNUAL_FACTOR * TIERS.cartographer.monthlyCredits`, `factor === ANNUAL_FACTOR`, NOT in `getVisibleTiers()`, and `ACTIVE_CHECKOUT_SKUS.includes('premium_annual') === (ANNUAL_FACTOR > 0)` — every one true at dial 0 AND at dial 10, so WEB-10's flip leaves them green (~14) | ~68 |

Totals (§471.1/F1 re-price): 1 new leaf (a test) · 1 logic-bearing production file modified
(entitlementLadder.js) + 1 registration-only (pricing.js) · 7 handwritten files (+ .env.example
and DEPLOY.md as docs-class) · **~76 effective PRODUCTION lines** (35 + 41; tests and docs do
not count; ≤400 ✓, ≤250/leaf ✓ — the walker is the largest leaf at ~100) · acceptance 8 (A7
and A8 merged to make room — J-R2-5) · no generated artifact · no migration · no package.json
byte (§349.2 checked: none). **The cap is not approached; no split is proposed.**

### Acceptance (≤8)

| id | case |
|---|---|
| A1 | **(§471.2/F4)** walker rule A: every ladder row that CLAIMS a paywall — `row.free !== row.cartographer` — names an enforcement symbol that resolves to "free refused, premium granted" at the real TIER_GATE / viewerAuthority (executed, not grepped). At this car's tip the claiming set is NINE rows (saves · custom-content · living-realm · map-chains · export-bundle · map-editing · dm-pins · change-view · fog-table — `change-view`'s `'latest change only'` still differs from `true`, so it still claims) and the parity set is EIGHT (every-size · gallery-viewing · same-engine · map-view · provenance-hover · all-lenses · panorama · surveyor-stages) over the 17 rows that remain; the test prints both sets. Negative controls: a planted claiming row on `'ruled-x'` reds; a planted equal-string row does not |
| A2 | walker rule B: a `free === cartographer` row demands no resolution; every `'parity'`-marked row is `true/true`; no row carries the retired `ruled-2026-07-17` spelling (absence pin anchored by A1's positive rows) |
| A3 | `interiors` and `v2-redraw` are in `DEFERRED_LADDER_ROWS`, NOT in `ENTITLEMENT_LADDER`, and their `band4.rows` labels still exist; the rendered comparison table (the existing pricingPageBands harness) does NOT contain 'Building interiors' / 'The v2 map redraw' — anchored on the same render containing 'DM pins' |
| A4 | `change-view` free cell is `'latest change only'` and SettlementMapNotes.jsx declares `FREE_CHANGE_DEPTH = 1` (source scan, with the negative control that the scan fires on a planted `= 2`) |
| A5 | `TIERS.wanderer.features.pdfExport === TIER_GATE.free.export === false`; cartographer/founder ↔ premium `true` (the O-P3 pin, free = per-dossier) |
| A6 | `.env.example` names `STRIPE_PRICE_<KEY>` for every key in `ACTIVE_CHECKOUT_SKUS` in its active block; names NO abolished SKU (`FOUNDER_LIFETIME`); any legacy `CREDITS_5/10/15/40/50` line sits below the legacy comment marker (walker: active-block membership, abolished absence anchored on the active positives, legacy placement); **(F8 folded)** `ACTIVE_CHECKOUT_SKUS` equals the key set of create-checkout's active `PRICE_MAP` block by source scan in BOTH directions — at this car neither side has `premium_annual` — with a planted extra on each side as the negative control |
| A7 | **(J-R2-5, merged)** re-runs: the existing LADDER WALKER (pricingPageBands #5) and illustratedLensFree stay green (the ladder shrank by two rows, nothing else moved); the four gate suites (dmPinsTierGate, fogTierGate, changeViewDepthGate, settlementMapPaneEdit) re-run green — the re-pointed symbols are the gates those suites already execute |
| A8 | **(§471.1/F1 — the stubs)** `SURVEYOR_PLAN.priceCents === 1499` derived-equals `14.99*100`, `billing === 'monthly'`, `stripeProduct === 'surveyor'` matches a create-checkout PRICE_MAP key by source scan, `monthlyCredits === 0` is NOT pinned here (the dial's VALUE is WEB-10's pin); `CARTOGRAPHER_ANNUAL.priceCents === ANNUAL_FACTOR * TIERS.cartographer.priceCents` and `credits === ANNUAL_FACTOR * TIERS.cartographer.monthlyCredits` (true at 0 and at 10); `ACTIVE_CHECKOUT_SKUS.includes('premium_annual') === (ANNUAL_FACTOR > 0)`; `getVisibleTiers()` still `['wanderer','cartographer','founder']` |

### Census, mutants, reds, STOP

- **censusAuthorization:** §464.2. Predicted motion: +1 test file (the walker is a CREATE row
  at every packet status — §packet-validator law), titles ≈ +12..+16 (A1-A6 and A8 as
  titles — the §471.1/F1 stub pins and the F8 parity arm add ≈ +6 over the first revision's
  estimate; A7 is re-runs), the lighting/exact-equality census re-stamped from the hash AFTER the last
  edit (§rebase-slot law). `tests/config/` is in the default vitest project — no park risk
  (`test.each` NOT used: loop-registered tests are invisible to the census).
- **Mutants (≥3, each convicts a branch):** M1 plant `{ id:'x', free:false, cartographer:true,
  enforcement:'ruled-2026-07-17' }` → A1 reds (the walker's reason for existing). M2 flip
  map-editing's enforcement to `'parity'` while leaving `free:false` → A2 reds. M3 restore
  `pdfExport: true` on wanderer → A5 reds. M4 move `interiors` back into the ladder → A3
  reds (the deferred-ledger rule). M5 `FREE_CHANGE_DEPTH = 2` → A4 reds. **M6 (§471.2/F4)**
  rewrite rule A's predicate to `free !== true` → the walker reds on `all-lenses` /
  `surveyor-stages` at the clean tree, i.e. the equal-string negative control convicts the
  wrong predicate. **M7 (F8)** add `premium_annual` to `ACTIVE_CHECKOUT_SKUS` unconditionally
  → A6's parity scan reds (the server block lacks it). **M8 (F1)** `priceCents: 1999` on
  `SURVEYOR_PLAN` → A8 reds.
- **Interior reds named:** (i) `tests/ui/pricingPageBands.test.jsx` LADDER WALKER — green by
  construction (fewer rows); (ii) the anchor walker (`negativeAssertionAnchor.walker`) on the
  new file's absence assertions — every `not.toContain` is anchored on a positive in the same
  render (A3's 'DM pins'); (iii) comment-only edits fire ratchets (§104.4) — the
  entitlementLadder.js header rewrite and the pricing.js :100-101 re-word are DECLARED;
  (iv) `tests/lint/copyCorruption` / `controlBytes` — the lane scans its own authored files
  (the §TE-T2H U+001F lesson); (v) the title-census ceiling (the ratchet total is only a
  FLOOR — +N titles red the EXACT-equality lighting census until re-stamped); (vi)
  **(§471.2/F9)** the DEPLOY.md strike runs the exact CLAIM_RE first (the struck line is a
  bare env name — no vocabulary) and `tests/docs/deployRunbookFreshness` stays green (it
  parses the Secrets section's fenced blocks for NAMES and requires >10 — the section
  documents 52 names at b10ed1a1 by the test's own parser, 51 after the strike; the
  one-direction rule never demanded the line); (vii) **(F1)** the existing
  `tests/config/pricing.test.js:315-320` three-way `getVisibleTiers` pin is re-run
  unchanged — the stubs live OUTSIDE `TIERS`.
- **STOP:** any gate suite (A7) red at base → STOP-RAISE (it means the gate moved under the
  recon); any test found pinning the literal `ruled-2026-07-17` (grep at base: 0 in tests —
  `grep -rn "ruled-2026" tests` = 0 at b10ed1a1) → declared re-point; **(F1)** any reader of
  `SURVEYOR_PLAN` / `CARTOGRAPHER_ANNUAL` / `ACTIVE_CHECKOUT_SKUS` found at base
  (`grep -rn "SURVEYOR_PLAN\|CARTOGRAPHER_ANNUAL\|ACTIVE_CHECKOUT_SKUS\|ANNUAL_FACTOR" src
  tests` = 0 at b10ed1a1 — re-run) → the names collided; STOP-RAISE.
- **Trust boundary:** nothing here sells or grants; the only money-adjacent bytes are
  `.env.example` (names, never values — committedSecretsScan's exception row stands) and the
  DEPLOY.md strike (removes an instruction to configure a SKU the platform refuses to sell).
  The stubs are inert: `SURVEYOR_PLAN` has no reader until WEB-9a, `CARTOGRAPHER_ANNUAL`
  none until WEB-11, and at dial 0 nothing derives a price or a credit from either.
- **Owner-gated remainder:** none for this car (no deploy, no push). The owner's veto window
  on C1 (the literal-vs-intent shape) is this document.

---

## §2 · WEB-9a — THE SURVEYOR TIER, CLIENT PURCHASE PATH (O-P2, part 1 — DARK until WEB-9b)

### The ruling being implemented

§464.2: "O-P2 Surveyor becomes a REAL TIER: $14.99/mo with a small monthly credit allowance on
top of BYOK, the pricing page's 'No subscription required' becomes 'per-task credits OR the
Surveyor tier', create-checkout's existing surveyor product lit, the entitlement provisioned
by purchase not concierge." The ruled WEB-9 is split here per PACKET_STANDARD:457 ("propose
the smallest split"): 9a = the purchase path's client half (no user-visible surface yet);
9b = the pricing page; the allowance is WEB-10's (§4) because it is webhook-minted.

### What exists at the pin (executed reads, b10ed1a1)

**Server side — COMPLETE, executed-tested, NOTHING TO EDIT:**

| Leg | Where | Pin |
|---|---|---|
| Product | create-checkout/index.ts:72 `surveyor: Deno.env.get('STRIPE_PRICE_SURVEYOR') \|\| ''` ("Unset env ⇒ '' ⇒ unpurchasable (LAW 1). Signed-in only"); :97 `SUBSCRIPTION_PRODUCTS = new Set(['premium','surveyor'])`; :545 `mode = 'subscription'`; :626-633 `subscription_data.metadata { supabase_user_id, product }` | create-checkout/index.test.ts:694 (subscription-mode session, metadata.product 'surveyor'), :713 (anonymous refused); env fixture :36 |
| Grant | stripe-webhook/index.ts:2890-2913 `product === 'surveyor'` → out-of-order dead-sub guard → `rpc('grant_surveyor_entitlement', { p_user, p_source:'subscription', p_subscription_id, p_customer_id })`, throws on error; :2938 money mirror kind `surveyor_start` | stripe-webhook/index.test.ts:3271 |
| Entitlement store | migration 139 `surveyor_entitlements` (user_id PK, status active/revoked, source) + `has_surveyor_entitlement()` (authenticated, fail-closed on null uid); migration 159 adds `stripe_subscription_id` UNIQUE-partial + `grant_surveyor_entitlement` / `revoke_surveyor_entitlement_by_subscription` (service-role only, caller-role checked :58-61) | tests/edgeFunctions/surveyorByok.test.js; migration sequence suites |
| Revoke | webhook :3270-3291 `customer.subscription.deleted` probes the surveyor revoke FIRST, breaks before the Cartographer downgrade when a row was revoked | index.test.ts:3339 |
| Renewal | webhook :3057-3063 discriminates the invoice's first line price against `STRIPE_PRICE_SURVEYOR` → money kind `surveyor_renewal`; :366-370 the ALLOWANCE PRICE-ID GATE skips the 30-credit Cartographer allowance for a non-PREMIUM price — **FAIL-OPEN when `STRIPE_PRICE_PREMIUM` is unset** (:371-373 "proceeding for back-compat") | index.test.ts:3293 "THE ALLOWANCE TRAP" |
| Read gate | src/components/surveyor/surveyorGate.js:16-22 `isSurveyorTier(auth)` = `hasSurveyorEntitlement === true \|\| isFounder \|\| role admin/developer`; useSurveyorEntitled.js:24-36 fetches `rpc('has_surveyor_entitlement')`, fail-closed, module-level `cache` keyed by userId; the account copy (useAccountSurveyorGate.js:21-43) is byte-pinned to it by tests/components/surveyorGateParity.test.js | parity pin |
| Door | FloatingAffordances.jsx:25 `<SurveyorDoor visible={visible}/>` (App.jsx:830, route-visible); SurveyorDoor.jsx:70 `if (!visible \|\| !surveyorEntitled) return null` — NO feature flag; the per-stage kill switches (migration 150:36-48) seed every stage `true` | surveyorKillSwitch tests |

The brief's sentence "`surveyorGate.js`'s `isSurveyorTier` reads the purchased entitlement"
is ALREADY TRUE — it reads `hasSurveyorEntitlement`, which `useSurveyorEntitled` resolves from
the 139 table that the 159 RPC writes on purchase. **WEB-9a does not touch surveyorGate.js.**

**Client side — the gaps (each an executed read):**

- `src/lib/stripe.js:24-53` `buildProductsMap()` = active packs + `premium` + `single_dossier`
  + `founder_lifetime`. **No `surveyor` row** ⇒ `startCheckout('surveyor')` throws `Unknown
  product` at :91-93 (`!PRODUCTS[product] && !findPackByKey(product)`). Note the premium row's
  hand-typed `credits: 30` (:31) and `'Premium Upgrade'` — pre-existing, out of scope.
- `src/lib/checkoutReconcile.js:36-38` `isPremiumProduct` = premium|founder_lifetime; a
  `surveyor` return falls to the :116 "Unknown/other product: a verified paid session is
  success enough" arm — success after ONE sleep without ever reading the entitlement the
  webhook grants (the file's own doctrine :1-23: the URL must not declare success; the
  entitlement is the ground truth).
- `src/App.jsx:256-260` success toast: premium → 'Cartographer activated.' · founder → 'Welcome
  aboard, Founder.' · **else 'Credits added.'** — a Surveyor purchase would be announced as
  credits.
- `src/config/pricing.js` has no Surveyor price anywhere (`grep -n "1499\|14\.99\|surveyor"
  src/config/pricing.js` = the SURVEYOR_AI_COSTS block :99-113 and nothing priced);
  `pricingDisplay.js:68-80` `SURVEYOR_SURFACE` says "Surveyor is NOT a subscription tier".
  **§471.1/F1: the price row is WEB-8's** — `SURVEYOR_PLAN` lands there (contract 8.6a, at
  `monthlyCredits: 0`) and this car only IMPORTS it; WEB-9a's base must therefore contain
  WEB-8's commit (a dependency, satisfied by the train order — not a path reservation).
- **`src/App.jsx` is an EXACT 650-line ceiling (§471.2/F2, measured):** `scripts/
  .size-baseline.json:7` `"src/App.jsx": 650`, and `tests/lint/sizeBaseline.test.js:112-127`
  pins the frozen number to the file's current effective count in BOTH directions ("grew to
  … never raise the number" / "shrank to … LOWER its number here"). Measured at b10ed1a1
  with the test's own eslint helper (`max-lines`, `skipBlankLines` + `skipComments`): **650**.
  Simulated: the :256-260 ternary (5 effective lines) replaced by one `const msg =
  stripeLib.checkoutSuccessMessage(result.product);` line → **646**; plus the one-line
  `fetchSurveyorEntitled` dep row at :243-245 → **647**. The src-root `.jsx` layer ceiling is
  600 (sizeBaseline.test.js:69), so 647 keeps the entry (ratchet DOWN, not delete). ANY
  non-zero delta reds the pin; the natural shape of this car is −3, so the baseline file
  joins the manifest.
- Lifecycle path checked — the entitlement caches: both module-level `cache` Maps
  (useSurveyorEntitled.js:21, useAccountSurveyorGate.js:28) would hold a stale `false` after
  an in-session grant, BUT the Stripe return is a full-document navigation to `success_url`
  (create-checkout :605-607), so both modules re-evaluate from empty on return. No bust
  needed for the purchase path; a concierge grant mid-session still needs a reload
  (pre-existing, recorded, not this car's).
- `verify-checkout-session/index.ts:177-195` returns `{ verified, product, status }` from
  session metadata for ANY account-bound product — works for `surveyor` unchanged.

### Behaviour contract

1. **(§471.1/F1 — moved to WEB-8 contract 6a)** `SURVEYOR_PLAN` is READ from pricing.js, never
   written here: `{ key:'surveyor', stripeProduct:'surveyor', priceCents: 1499,
   billing:'monthly', monthlyCredits: 0, byok: true, entitlement: 'surveyor_entitlements' }`,
   frozen, OUTSIDE `TIERS`, landed by WEB-8 at dial 0. `monthlyCredits: 0` until WEB-10 flips
   it — the ONE dial the allowance sentence keys on (§3/§4). This car touches neither
   `src/config/pricing.js` nor `tests/config/pricing.test.js` nor `.env.example`.
2. `stripe.js` `buildProductsMap()` gains `surveyor: { key, name: 'Surveyor', price:
   '$'+(SURVEYOR_PLAN.priceCents/100).toFixed(2)+'/mo', credits: SURVEYOR_PLAN.monthlyCredits,
   perCredit:null, discount:null }` — the price string DERIVED exactly as the premium row does
   (:31). **(§471.2/F2)** `stripe.js` ALSO gains the pure `checkoutSuccessMessage(product)` —
   the App.jsx :256-260 ternary moved verbatim (premium → 'Cartographer activated.' ·
   founder_lifetime → 'Welcome aboard, Founder.' · **surveyor → 'Surveyor activated.'** ·
   else 'Credits added.'); WEB-11 later adds its annual arm HERE, not in App.jsx.
3. `checkoutReconcile.js` gains `isSurveyorProduct(product)` and a fourth poll arm: when
   `surveyor`, poll `deps.fetchSurveyorEntitled()` (a new dep, `rpc('has_surveyor_entitlement')`
   → boolean, fail-closed) and succeed ONLY when it returns `true`; on timeout → PROCESSING
   (never a false success — the premium arm's doctrine :127-129 applied to the entitlement).
4. `App.jsx` passes `fetchSurveyorEntitled` (a thin lazy import from stripe.js, beside
   `fetchProfileTier`, +1 effective line at :243-245) and **(§471.2/F2 — MANDATORY, not
   conditional)** replaces the :256-260 toast ternary with the one-line call
   `stripeLib.checkoutSuccessMessage(result.product)` (−4). The car's App.jsx delta is
   therefore −3 effective lines (650 → 647, simulated; **STOP: RE-DERIVE AT BASE** with the
   sizeBaseline helper, never `wc -l`), and `scripts/.size-baseline.json` `"src/App.jsx"` is
   LOWERED to the measured count in the same commit — a ratchet-DOWN, which the baseline's
   own SHRINK-ONLY rule and §13 permit (only RAISING is forbidden). A net-zero shape is
   lawful only if it arises naturally; padding App.jsx to hold 650 is NOT (J-R2-2).
5. `trackCheckoutSuccess` (stripe.js:174-184) — `Funnel.paidAction({ kind })` gains
   `'surveyor'` as a kind. EXECUTED (redispatch): `kind` is an OPEN string
   (analytics.js:164 `{ kind?: string, userId?: string }`, forwarded as a prop of
   `EVENTS.PAID_AFTER_ANON`); the `analytics/funnel-event-contract` ESLint rule
   (eslint.config.js:157; tests/lib/funnelEventContract.test.js) governs EVENT NAMES
   (`EVENTS.*` constants), not `kind` values, and `analytics-props-hygiene` wants props coarse
   — a tier key is coarse. No new EVENT (the WEB-4 rider cost, §10 row 1); re-confirm at
   base with `grep -n "paidAction" src/lib/analytics.js tests/lib/analytics.test.js`.

### Non-goals, affirmatively

- NO edit to create-checkout, stripe-webhook, any migration, RLS, grants, or surveyorGate.js.
- NO pricing-page change (WEB-9b) — after WEB-9a nothing user-visible changes; the product is
  purchasable only by a caller that does not exist yet.
- NO allowance (WEB-10). NO Cartographer change.
- NO third copy of the entitlement predicate (the parity law): the reconcile's poll reads the
  RPC's boolean directly — it is the same `has_surveyor_entitlement()` the door reads, not a
  re-spelled predicate.
- **§471.1/F1:** NO edit to `src/config/pricing.js`, `tests/config/pricing.test.js` or
  `.env.example` — WEB-8 owns them; this car's packet names none of the three.

### Change manifest (re-priced §471.1/F1 + §471.2/F2)

| Path | Kind | Eff (est.) |
|---|---|---:|
| `src/lib/stripe.js` | modify (logic): the `surveyor` PRODUCTS row; `fetchSurveyorEntitled()` beside `fetchProfileTier` (:320); **`checkoutSuccessMessage(product)` — the toast map moved in from App.jsx (F2)** | ~24 |
| `src/lib/checkoutReconcile.js` | modify (logic): `isSurveyorProduct`; the surveyor poll arm; the timeout rule | ~16 |
| `src/App.jsx` | modify (logic; exact-ceiling file, 650 at base): +1 the dep row, −4 the ternary → the one-line `checkoutSuccessMessage` call (F2, mandatory) | **−3** (647 sim; RE-DERIVE) |
| `scripts/.size-baseline.json` | modify (registration-only; **F2**): `"src/App.jsx": 650` → the measured count after the edit (647 expected) — a ratchet-DOWN | 1 |
| `tests/lib/checkoutReconcile.test.js` | modify: `describe('surveyor reconciliation')` — SUCCESS when the entitlement flips true; PROCESSING when it never does; FAILED on definitive verify reject | ~30 |
| `tests/lib/stripeProducts.test.js` | **CREATE** (small): PRODUCTS has `surveyor` with the derived price string; `startCheckout('surveyor')` passes the `Unknown product` guard (mocked supabase); **`checkoutSuccessMessage` over the four products (F2)** | ~42 |

Totals (§471 re-price): 1 new leaf (a test) · 3 logic-bearing production files modified
(stripe.js, checkoutReconcile.js, App.jsx) + 1 registration-only (`.size-baseline.json`) ·
6 handwritten files · **~38 effective production lines** (24 + 16 − 3 + 1; was ~57 — the
`SURVEYOR_PLAN` registration and its pins moved to WEB-8, the toast map moved within the car)
· no migration · no package.json byte · **no shared change path with any W-C sibling**
(`scripts/.size-baseline.json` is touched again only by WEB-11 in W-D, minted after WEB-10 —
and therefore WEB-9a — is LANDED).

### Acceptance (≤8)

| id | case |
|---|---|
| A1 | **(§471.2/F2; the old A1 — `SURVEYOR_PLAN`'s shape — is WEB-8's A8 now)** `checkoutSuccessMessage('premium') === 'Cartographer activated.'`, `('founder_lifetime') === 'Welcome aboard, Founder.'`, `('surveyor') === 'Surveyor activated.'`, `('credits_25') === 'Credits added.'` — the moved map is a pure function pinned in isolation |
| A2 | create-checkout's PRICE_MAP has a `surveyor:` row reading `STRIPE_PRICE_SURVEYOR` and SUBSCRIPTION_PRODUCTS contains 'surveyor' (source scan; the contracts.test.js:1160 idiom) — the client product key and the server key are one spelling |
| A3 | `PRODUCTS.surveyor.price === '$14.99/mo'` derived from SURVEYOR_PLAN (and changes when a test-local override changes priceCents — the derivation is live, not a literal) |
| A4 | `startCheckout('surveyor')` reaches the edge invoke with `{ product:'surveyor' }` (mocked supabase.functions.invoke), never the `Unknown product` throw |
| A5 | reconcile: product 'surveyor' + `fetchSurveyorEntitled` → true on attempt 2 ⇒ SUCCESS and `onEntitlement` fired once |
| A6 | reconcile: 'surveyor' + entitlement never true + verified session ⇒ PROCESSING (never SUCCESS) |
| A7 | reconcile: 'surveyor' + verify definitively false ⇒ FAILED without polling |
| A8 | **(§471.2/F2)** App.jsx's effective count after the edit, measured with the sizeBaseline helper, EQUALS the new `scripts/.size-baseline.json` entry (647 expected; RE-DERIVE) and is ≥ 601 (the entry stays — the src-root `.jsx` layer ceiling is 600); `tests/lint/sizeBaseline.test.js` re-runs green; App.jsx contains NO `'Credits added.'` literal (the map left the file — anchored on App.jsx still containing `checkoutSuccessMessage`) |

### Census, mutants, reds, STOP

- **censusAuthorization:** §464.2. Predicted: +1 test file (CREATE row), titles ≈ +8..+10;
  tests/lib is default-project — no park. (`tests/config` is no longer this car's.)
- **Mutants:** M1 delete the PRODUCTS `surveyor` row → A3/A4 red. M2 make the surveyor arm
  succeed on a verified session without the entitlement (restore the "other product" arm) →
  A6 reds. **M3 (F2)** `checkoutSuccessMessage('surveyor')` returns 'Credits added.' → A1
  reds. **M4 (F2)** leave the ternary inline in App.jsx (skip the extraction) → the file
  measures 651 > the frozen 650 ⇒ eslint `max-lines` AND sizeBaseline red; **M5 (F2)** do the
  extraction but leave the baseline at 650 → sizeBaseline reds "shrank to 647 — LOWER its
  number".
- **Interior reds named:** **(§471.2/F2)** `src/App.jsx` is NOT on PACKET_STANDARD's hot list
  (:466-476 names EconomicsTab/OutputContainer/three worldPulse files) but carries a
  `scripts/.size-baseline.json` entry of **650** (:7) pinned EXACTLY in both directions — the
  extraction is MANDATORY (contract 4) and the baseline row is in the manifest; the executor
  MEASURES at base and after (eslint `max-lines`, `skipBlankLines`+`skipComments`, never
  `wc -l`), and `eslint.config.js` regenerates the per-file `max-lines` override from the
  lowered entry; the any-cast ledgers (checkoutReconcile is JSDoc-typed —
  new deps typed in the JSDoc, zero `any`); `tests/lint/premiumGateSingleSource` (no tier
  literal added — the reconcile reads a boolean); `stripe.js` is in the analytics ESLint
  rules' scope — event NAMES stay `EVENTS.*` constants (`funnel-event-contract`) and the new
  `kind` is a coarse string (`analytics-props-hygiene`); tests/lib/analytics.test.js:179-184
  pins `paidAction` for `single_dossier` only — unchanged.
- **STOP:** if `has_surveyor_entitlement` is NOT granted to `authenticated` at base (139:85
  says it is) → STOP; if the analytics funnel kind vocabulary is closed and pinned → record,
  do not widen (§10).
- **Trust boundary:** the client never declares Surveyor success from the URL — only from the
  RPC's `true`; fail-closed on every error (false); the purchase requires a session
  (create-checkout :713 pin); no secret, no price id, no key leaves the server.
- **Owner-gated remainder:** `STRIPE_PRICE_SURVEYOR` set in the Functions secrets (LAW 1:
  unset = unpurchasable; the car lands DARK by construction until the owner lights it) — see
  §4's to-do list.

---

## §3 · WEB-9b — THE SURVEYOR TIER, THE PRICING PAGE LIGHTS IT (O-P2, part 2)

### The ruling being implemented

§464.2 O-P2's copy clause: "the pricing page's 'No subscription required' becomes 'per-task
credits OR the Surveyor tier'"; plus the chair's brief: "`docs/DESIGN_AI_CONTROL_SURFACE.md`'s
$19.99 line reconciled to the ruled $14.99". Depends on WEB-9a (a live `startCheckout
('surveyor')`) and, **§471.1/F1**, on WEB-8 (`SURVEYOR_PLAN` — the price this band renders —
is WEB-8's stub; this car imports it and touches none of WEB-8's three paths).

### What exists at the pin (executed reads, b10ed1a1)

- **The band:** `src/components/pricing/PricingBands.jsx:41-79` `SurveyorBand({ onSeeMenu })`
  — name/badge/lead/body/byok from `tp('band2.surveyor.*')` and ONE button, "See the task
  menu". Its header comment :35-38 and PricingPage.jsx:362-364 carry the W-DOC wave's
  "ruling #3": "Surveyor is WALLED … task-priced + BYOK, never a lookalike subscription";
  `pricingDisplay.js:68-73` "Surveyor is NOT a subscription tier (getVisibleTiers stays
  three-way)". **§464.2 SUPERSEDES ruling #3's 'never a subscription' half**; the band's
  WALLED/violet/not-a-fourth-TierCard half stands (the three-way row pin :315 holds).
- **The copy:** `src/copy/pricingPage.js:33-40` band2.surveyor — `body` :37 carries "No
  subscription required." (the ONLY src occurrence of that phrase for Surveyor; band3's
  heading :63 "One-time purchases, no subscription required" is about the BUNDLE lane and is
  TRUE — stays). COPY LAW :8-11 "ZERO hand-typed numbers … A number literal in this file is a
  bug", enforced by tests/ui/pricingPageBands.test.jsx:166-173 (`/\$\s*\d/` and
  `/\b\d+\s+(credits?|chairs?|seats?|months?|saves?)\b/i` over every string).
- **The CTA machinery:** PricingPage.jsx:148-168 `buy(product)` (referral intent → `startCheckout
  (product, { redeemCode })` → notice); :195-233 `ctaFor(tier)` returns `{ label, onCta, kind }`
  with `kind ∈ 'purchase'|'manage'|'current'|'navigate'` (P8: exactly one loud primary; a
  'manage' never primary); :231 Cartographer: `currentPaid ? manageBilling : () => buy
  ('premium')`; `loading === 'premium'` keys the button state (:353).
- **The entitlement read on this page:** none. PricingPage reads `authTier`/`isFounder`/
  `isElevated` from the store (sell-to-the-tier, exempt in premiumGateSingleSource). The
  Surveyor bit lives off the eager store by design (useSurveyorEntitled.js:10-13: "a module
  SHARED across the door + account lazy chunks forms a shared chunk that rebalances the
  first-paint closure. Only the pure, import-free predicate … is shared (inlined) — the
  mechanical fetch is per-chunk"). PricingPage is its own lazy chunk ⇒ the house pattern is a
  THIRD per-chunk fetch importing `isSurveyorTier` from `surveyorGate.js` (an import-free leaf
  built to be inlined — :3-5). No test censuses `surveyorGate.js` importers (`grep -rn
  surveyorGate tests/lint tests/build` = 0).
- **The design doc:** docs/DESIGN_AI_CONTROL_SURFACE.md:290 "**Surveyor tier $19.99/mo** =
  Premium + the AI control surface; tier axis gains 'surveyor'" and :295 "**BYOK** included in
  Surveyor: $19.99 covers orchestration…"; :318 "OWNER DECISIONS QUEUED: Surveyor pricing
  final, allowance sizes…". Two facts in :290 are now stale: the price (ruled $14.99) and the
  composition ("= Premium +": the built entitlement is SEPARATE from profiles.tier — 139:7-11
  — so Surveyor is STACKABLE beside Cartographer, not inclusive of it; C2). Other $19.99
  carriers: docs/VISION_IDEALIZED_FINAL_PRODUCT.md:148 (one line), docs/
  COMPREHENSIVE_REVIEW_PROGRAM.md:61 (historical program prose), docs/legal/
  TERMS_OF_USE_DRAFT.md:97,104,418 (counsel's placeholders — NOT this car's).
- **A sibling honesty trap found while reading:** the Cartographer TierCard renders its own
  copy from `en.js pricing.tiers.cartographer.*` (PricingTierCards.jsx:40-43) — outside this
  car; not touched.

### Behaviour contract

1. The Surveyor band renders the PRICE from `SURVEYOR_PLAN` (`{price}/mo` interpolated — the
   copy law), keeps the violet wall and the "See the task menu" link, and gains a CTA in the
   page's `ctaFor` vocabulary: entitled (per `isSurveyorTier` over the per-chunk fetch +
   founder/role) → `{ kind:'manage', label:'Manage subscription', onCta: manageBilling }`;
   founder/elevated → `kind:'current'` ("Included with your chair" / "Included"); else →
   `{ kind:'purchase', label: tp('band2.surveyor.cta'), onCta: () => buy('surveyor') }`. The
   P8 single-primary selector (`pricingPrimaryKey`) is NOT widened — Cartographer stays the
   loud primary; the Surveyor purchase button renders `variant="secondary"` unless the reader
   is already Cartographer (then the band's button may be the page's primary — executor's
   call inside P8's rule, recorded).
2. Copy: `band2.surveyor.lead` → 'The AI workshop. Subscribe, or pay per task.' ; `body` →
   the same sentence with "No subscription required." replaced by "Per-task credits, or the
   Surveyor tier at {price} a month." ; new `cta: 'Subscribe to Surveyor'`; a new
   `allowance: '{credits} credits each month — the starter pack, included.'` that renders
   ONLY when `SURVEYOR_PLAN.monthlyCredits > 0` (WEB-10 lights it by setting the dial; until
   then the band makes NO allowance claim — honest at every status).
3. The three stale comments ("never a lookalike subscription" ×2, "NOT a subscription tier")
   are re-worded to cite §464.2 (comment-only edits DECLARED — they fire ratchets).
4. docs/DESIGN_AI_CONTROL_SURFACE.md:290/:295 → "$14.99/mo (ruled ODQ §464.2)" and the
   composition sentence corrected to "the AI control surface + BYOK + a monthly allowance;
   SEPARATE from Cartographer (entitlement, not tier — migration 139) and stackable"; :318's
   "Surveyor pricing final" moves from QUEUED to RULED. VISION:148 one-line reconcile (cheap;
   same CLAIM_RE discipline).

### Non-goals, affirmatively

- NO fourth TierCard; NO change to `getVisibleTiers`; NO change to en.js tier copy.
- NO allowance sentence while `monthlyCredits === 0`.
- NO edit to docs/legal/* (counsel's); NO edit to COMPREHENSIVE_REVIEW_PROGRAM.md (history).
- NO money-path edit; NO migration.

### Change manifest

| Path | Kind | Eff (est.) |
|---|---|---:|
| `src/components/pricing/PricingBands.jsx` | modify (logic): SurveyorBand gains `price`, `cta`, `allowance` props and renders them; header comment re-worded | ~30 |
| `src/components/PricingPage.jsx` | modify (logic): `ctaFor` surveyor branch; the per-chunk entitlement hook call; `loading === 'surveyor'` key; the :362-364 comment | ~28 |
| `src/components/pricing/useSurveyorPlanState.js` | **CREATE** (logic leaf, ~45 lines): the per-chunk `has_surveyor_entitlement` fetch (the useSurveyorEntitled.js:24-53 shape, cache + fail-closed) combined through the IMPORTED `isSurveyorTier` — no third predicate copy (parity law) | ~45 |
| `src/copy/pricingPage.js` | modify (registration-only): lead/body/cta/allowance strings, tokens only | ~6 |
| `src/config/pricingDisplay.js` | modify (registration-only): SURVEYOR_SURFACE gains `plan: SURVEYOR_PLAN`; comment :68-73 re-worded | ~4 |
| `docs/DESIGN_AI_CONTROL_SURFACE.md` · `docs/VISION_IDEALIZED_FINAL_PRODUCT.md` | docs (not production lines): the price/composition lines | ~6 |
| `tests/ui/pricingPageBands.test.jsx` | modify: band pins — the rendered price equals the derived string; the purchase CTA renders for a free reader (mock store), 'Manage subscription' for an entitled one (mock the RPC true); **the allowance sentence pinned THREE-ARMED (J-R2-6): override `monthlyCredits: 0` ⇒ NO sentence (anchored on the price rendering); override `monthlyCredits: 25` ⇒ the sentence with `25` interpolated; real config ⇒ presence equals `SURVEYOR_PLAN.monthlyCredits > 0` — so the pin is non-vacuous at this car and needs NO edit when WEB-10 flips the real dial** (WEB-10 re-runs it; the first revision had WEB-10 REPLACING this arm, an unlisted shared path); copy-source guard stays green over the new strings | ~46 |
| `tests/components/useSurveyorPlanState.test.jsx` | **CREATE**: fail-closed on RPC error; founder short-circuit; cache per userId; agrees with `isSurveyorTier` on the 3×3×4 input grid (the parity idiom, reusing surveyorGateParity's grid) | ~50 |

Totals: 1 new logic leaf (+1 test leaf) · 2 logic-bearing modified (PricingBands, PricingPage)
+ 2 registration (copy, pricingDisplay) · 8 handwritten files (+2 docs) · ~113 effective
production lines · no migration · no package.json byte · **(§471.1/F1) no shared change path
with any W-C sibling** — none of this car's eight files is named by WEB-8, WEB-9a or WEB-10
(WEB-10's first-revision edit to `tests/ui/pricingPageBands.test.jsx` is removed by J-R2-6).

### Acceptance (≤8)

| id | case |
|---|---|
| A1 | the band renders `$14.99` derived from `SURVEYOR_PLAN.priceCents` (a test-local override of the config changes the rendered string — derivation live) |
| A2 | free reader (mock store tier 'free', RPC false) → a 'Subscribe to Surveyor' button of kind purchase; click → `startCheckout('surveyor', …)` called once (the mocked stripe.js) |
| A3 | entitled reader (RPC true) → 'Manage subscription' (kind manage) and NO purchase button — the double-subscription wall (create-checkout has no server guard: `grep -n "already\|existing sub" create-checkout/index.ts` = redeem-code strings only) |
| A4 | founder / elevated reader → kind current, no purchase button, no RPC call (short-circuit) |
| A5 | **(J-R2-6, three-armed so it survives WEB-10's flip unedited)** under a test-local override `monthlyCredits: 0` ⇒ NO allowance sentence in the DOM (anchored: the same render contains the price string); under override `monthlyCredits: 25` ⇒ the sentence renders with `25` interpolated and no `$`/number literal in the copy file (the positive arm that keeps the negative from going vacuous — the rendered-surface-negative law); and with the REAL config, `rendered.includes(sentence) === (SURVEYOR_PLAN.monthlyCredits > 0)` — false/absent at this car, true/present after WEB-10, never a hand-typed expectation |
| A6 | the copy-source guard (pricingPageBands #8) stays green: no `$\d` and no `\d+ credits` literal in pricingPage.js after the edit |
| A7 | the page's single loud primary is unchanged for a free reader (Cartographer), and `ctaFor` never returns kind 'purchase' for Surveyor to an entitled reader (the P8 rule) |
| A8 | `useSurveyorPlanState` agrees with `isSurveyorTier` on the full input grid and reads false on an RPC error/absent client (fail-closed) |

### Census, mutants, reds, STOP

- **censusAuthorization:** §464.2. Predicted: +2 test files (one CREATE row each), titles ≈ +10;
  tests/ui is jsdom — the `@vitest-environment jsdom` pragma in the new component test (a
  file that parks is a CREATE-row census lie — the §parked-file law: attribute by reverting one
  file at a time).
- **Mutants:** M1 render the allowance sentence unconditionally → A5 reds. M2 hand-type
  `'$14.99'` in the band → A1's override arm reds AND the copy guard if typed in the copy file.
  M3 show the purchase CTA to an entitled reader → A3 reds. M4 make the hook return true on an
  RPC error → A8 reds.
- **Interior reds named:** the pricing chunk's size — `scripts/.size-baseline.json` exact
  ceilings (the sizeBaseline hazard; `verify:dist` / `test:ratchet` take the gate mutex
  themselves — start the terminal under load); the anchor walker on A5's negative (anchored);
  `tests/lint/premiumGateSingleSource` (PricingPage is on the sell-to-the-tier exemption; the
  new hook spells no tier literal — founder/role only); first-paint: PricingPage is lazy
  (App.jsx `lazy(() => import(...PricingPage))` — verify at base) so the entry closure does not
  move; `surveyorPanelsLazy` fingerprints are workshop/transport strings, untouched.
- **STOP:** any requirement to import `useSurveyorEntitled` (the door's hook) into the pricing
  chunk → STOP (it forms the shared chunk the first-paint law forbids) — the per-chunk copy is
  the only lawful shape; any CLAIM_RE hit in the two doc edits → re-word before commit.
- **Trust boundary:** the CTA fails CLOSED toward the CUSTOMER's money: an unreadable
  entitlement shows the purchase button (the same posture the door takes — false), but the
  SERVER path still requires a session and the webhook's grant is idempotent by `user_id` PK
  (159:64-73 upsert) — a duplicate subscription would be a second Stripe sub on the same
  customer (the recorded residual; the manage-vs-purchase wall is the mitigation; a server-side
  "already subscribed" refusal in create-checkout is a WEB-10 option, C5).
- **Owner-gated remainder:** the `db push` of 139/150/159 (production appliedHead is **121**,
  `supabase/applied-head.json`, verified 2026-07-28 — every Surveyor migration is unpushed);
  the Stripe product; the env. Until all three, a buyer can see the band (WEB-9b) but
  create-checkout refuses with "Price ID not configured" (LAW 1) — the band must therefore
  render its CTA only when the feature is purchasable: **the executor adds the same
  `isConfigured`-class guard the Founder band had (`FounderCharterBand`'s "supabase-configured
  disable", PricingPage.jsx:226-229 comment) — a disabled purchase button with the early-access
  badge, never a dead click.** Recorded as contract 1's fourth state.

---
## §4 · WEB-10 — THE ALLOWANCE TABLE + THE ANNUAL PLAN'S SERVER HALF (§464.2; **STOP-CLASS PROPOSAL** — the money path moves)

### The ruling being implemented, and why this is a proposal and not a car edit

§464.2: "a small monthly credit allowance on top of BYOK" (Surveyor) and "Cartographer … gains
an ANNUAL plan (two months free) in WEB-9". The chair's dispatch: "READ the webhook's grant
path — a needed webhook change is a STOP-class proposal with its bill"; "an ANNUAL Cartographer
plan (10× monthly) in the same car if checkout/webhook support interval without a money-path
edit, else WEB-10 priced." Both conditions were READ and both fail (executed, b10ed1a1):

- **The allowance is minted ONLY by the webhook** — `grantMonthlyAllowanceIfNeeded`
  (stripe-webhook/index.ts:303-410) on `invoice.paid` / `invoice.payment_succeeded` (:3036-
  3043): a hard literal `30` (:406) behind the ALLOWANCE PRICE-ID GATE (:359-373) that SKIPS
  any invoice whose first line price is not `STRIPE_PRICE_PREMIUM` — i.e. a Surveyor invoice
  mints NOTHING today, by design and by executed pin ("THE ALLOWANCE TRAP",
  index.test.ts:3293). **There is no DB-side allowance path (§471.2/F7 — the census
  re-executed and printed in full):** `grep -rl monthly_allowance supabase/migrations` =
  **SIXTEEN files** (018 · 024 · 057 · 114 · 116 · 131 · 140 · 149 · 151 · 153 · 158 · 161 ·
  163 · 174 · 178 · 192), not the two the first revision printed. Every hit is one of three
  shapes, and NONE is a grantor: (a) the spend-order FIFO clause `order by case when
  g.source = 'monthly_allowance' then 0 else 1 end` — re-minted TWELVE times as
  `spend_credits` was re-created (018:208 → 024:182 → 057:131 → 114:401 → 131:287 → 140:121
  → 149:126 → 151:135 → 153:134 → 161:238 → 174:207 → **192:255**), so the ACTIVE body the
  DB runs is 192's (`192_tier_credit_multiplier.sql:110` is the latest `create or replace
  function public.spend_credits`); (b) the grant-side delivery-key arm `when source =
  'monthly_allowance' then metadata->>'stripe_invoice_id'` inside `system_grant_credits` —
  re-minted FIVE times (024:67 → 116:94 → 158:344 → 163:126 → **178:242**; 178:196 is the
  latest `create or replace function public.system_grant_credits`, and the webhook's
  `grantCredits` calls exactly that RPC, index.ts:90); (c) the two idempotency STRUCTURES
  that were minted ONCE and never re-created — the partial unique index
  `idx_credit_ledger_monthly_invoice` on `(metadata->>'stripe_invoice_id') where source =
  'monthly_allowance'` (018:92-94; `grep -rn idx_credit_ledger_monthly_invoice
  supabase/migrations` = that one site) and the `credit_grant_idempotency` table keyed
  `(source, idempotency_key)` with its back-fill (024:8-32). The conclusion stands — a
  SOURCE the ledger recognises and special-cases, never a grantor; the amount is a
  parameter everywhere — and the executor reasons from the ACTIVE definitions (192 and 178),
  never from the 018/024 bodies the first revision cited (the searchpath-baseline class:
  tests/ui/pricingPageBands.test.jsx:145-152 records the same lesson for
  `handle_premium_downgrade`).
- **create-checkout has no interval parameter** — `grep -n "interval\|annual\|premium_annual"
  create-checkout/index.ts` = 0; the product key IS the SKU (`PRICE_MAP` :62-79, one env per
  key; `SUBSCRIPTION_PRODUCTS` :97 = `premium`,`surveyor`; `mode` :545). A second Cartographer
  price needs a second key, and the webhook's checkout dispatch keys on `product === 'premium'`
  (:2764) and THROWS `Unhandled checkout product` for any key it does not name (:2926); the
  money mirror (:2935-2939) likewise. A `premium_annual` session would therefore be PAID and
  UNFULFILLED — the webhook's own fail-LOUD posture, which is correct and is why this is a
  money-path edit.

So WEB-10 is compiled as ONE money-path car carrying BOTH the Surveyor allowance and the annual
plan's server half — one STOP, one webhook diff, one Deno re-proof — landing DARK (LAW 1: an
unset `STRIPE_PRICE_PREMIUM_ANNUAL` is unpurchasable; the allowance row for Surveyor activates
the moment WEB-9a/9b's purchase path has a subscriber). The annual plan's CLIENT half is priced
as **WEB-11** (§5) — it cannot fit here under ≤3 logic-bearing files (§5 shows the count).
**§471.2/F3 — said plainly:** at this car the annual SKU exists SERVER-SIDE ONLY and is
UNPURCHASABLE — no client catalog row, no CTA, no copy, no toast names it; `ANNUAL_FACTOR`
flips to 10 here only so that `ACTIVE_CHECKOUT_SKUS` stays in parity with create-checkout's
block (no surface renders `CARTOGRAPHER_ANNUAL` until WEB-11). §464.2's annual clause is
delivered by W-C + W-D together; WEB-11 is the ONE car of W-D, dispatched the moment this car
lands.

### What exists at the pin (executed reads, b10ed1a1)

| Surface | Read |
|---|---|
| The grantor | webhook :303-410 as above; `grantCredits(supabase, userId, amount, source, metadata, expiresAt)` (:82) — amount is a parameter; `expiresAt` = the invoice line's `period.end` (:402-404) — an annual invoice's period end is one year out, so an annual grant expires with the year, untouched code |
| Idempotency **(§471.2/F7)** | three layers, all keyed on `metadata->>stripe_invoice_id` under `source='monthly_allowance'`: the webhook's own pre-check (index.ts:395-400) · the ACTIVE `system_grant_credits` delivery-key arm (**178:242** — the latest re-mint; 024:67/116:94/158:344/163:126 are superseded bodies) · the once-minted structures (unique index 018:92-94; `credit_grant_idempotency` PK 024:8-14) — per INVOICE, amount-agnostic ⇒ a different amount under the same source needs NO schema change |
| Spend order **(§471.2/F7)** | the ACTIVE `spend_credits` body is **192:255** (the twelfth re-mint of the same clause; 018:208 / 024:182 are superseded) — allowance-first FIFO, so a Surveyor or annual allowance is consumed before purchased credits, exactly as Cartographer's is |
| Existing pins | index.test.ts:513 (exactly 30 with computed expiry) · :526 (manual invoice ⇒ none) · :3293 (Surveyor invoice ⇒ NO 30 + `surveyor_renewal`) · :3317 (premium price still mints) · 2012 (founder refund reverses the 30-credit bonus — a DIFFERENT 30: `founder_grant`) |
| Renewal kind | :3057-3063 discriminates `surveyor_renewal` vs `subscription_renewal` by line price — an annual Cartographer invoice reads `subscription_renewal` unchanged (no new `MoneyEventKind`) |
| Catalog drift detector | tests/edgeFunctions/contracts.test.js:1487-1501: every `PRICE_MAP` key that is not a credit pack MUST appear as a quoted string in the webhook — `premium_annual` in the checkout dispatch satisfies it by construction; :1198 pins `SUBSCRIPTION_PRODUCTS` contains `premium` (unchanged) |
| Env documentation | tests/docs/deployRunbookFreshness.test.js:254 — every `Deno.env.get('NAME')` the functions consume must be documented in DEPLOY.md's Functions → Secrets section (:303-318) — a new env name is a DEPLOY.md write (CLAIM_RE discipline) |
| Readers of the two functions in vitest **(§471.2/F6 — re-derived with the path-segment spelling and classified)** | The first revision's spelling (`"stripe-webhook/index.ts\|readFunction('stripe-webhook')"` = 4; create-checkout = 2) cannot see `resolve(…, 'stripe-webhook', 'index.ts')` readers. Executed at b10ed1a1: **`grep -rln stripe-webhook tests` = 14** — (a) SOURCE readers of `index.ts`, **6**: founderPurchasePathAbsent (:163) · deployRunbookFreshness (:40 — the `Deno.env.get` census; reds on an undocumented env) · **autoReloadWebhookRace (:11)** · **checkoutAsyncPaymentFailure (:14)** · contracts (`readFunction('stripe-webhook')` ×10 describes) · paymentRefundDurableWorker (:24); (b) readers of **`index.test.ts` itself, 3**: contracts:119-125 (≥ 50 `(Deno\|scopedEnv).test(` registrations — 115 at base) · **moneyPathCoverageContract:42** (tokens `Missing signature` · `Invalid signature` · `system_grant_credits` · `does NOT double-grant` + > 120 lines) · **moneySecurityExecutionFloor:39** (token `signature` + ≥ 3 tests + > 400 bytes); (c) name-only / prose / other-artifact, **6**: verifyJwtPins (config.toml) · verifyJwtPosture (config.toml) · edgeLogRedaction (a string arg) · moneyPathJourney.pglite (comments) · profileStripeSubPin (comment) · refundLedger.contract (:158 reads docs/refund-ledger-audit.md). **`grep -rln create-checkout tests` = 9** — SOURCE readers of `index.ts`, **3** (+1 scanner): founderPurchasePathAbsent (:127) · contracts (`readFunction('create-checkout')` ×4 describes; :90 pins `index.test.ts` EXISTS) · **sessionGateCensus (:21-22, :183 — reads every named function's index.ts)** · tests/security/aiSurfaceCensus.js (walks every function's .ts tree for a model-call regex — inert unless a model call is added); prose/name-only, **5**: pricing.test.js:302 · checkoutAsyncPaymentFailure:4 · verifyJwtPosture:63 · emailTemplates:177 · referralRedeem.pglite:70. **The corrected floor: 6 + 3 readers for the webhook, 3 (+1) for create-checkout** — the executor enumerates each reader's pins at base; these are the bill's floor, not its ceiling |
| Stripe fee basis | NOT in the tree (`grep -rn "2\.9%\|0\.30" src/config supabase/migrations` — not executed as an absence claim; the figure below is Stripe's published US card rate and is the owner's to confirm against the account) |

### THE ALLOWANCE ARITHMETIC (PLAUSIBLE — the margin sheet 174:22 cites is ABSENT; every input below is a tree figure, the COGS are policy-implied BOUNDS, not measurements)

**Inputs (b10ed1a1):** `creditValueUsd` **0.157** (114:112, unchanged by 174:97) · the margin
policy "standard ≥ 2.5× expected post-engineering COGS AND ≥ 1.2× worst-case" (174:17) · 174's
finding that at **5** credits every standard action clears both floors and at **3** the
narrative did not (174:13-22) · prices: Cartographer **$5.99** (pricing.js:255), Surveyor
**$14.99** (ruled), annual **10×** = **$59.90** (ruled "two months free") · the starter pack
**credits_25 = 25** (pricing.js:48).

**Step 1 — what the policy implies per credit.** If an action priced at `n` credits clears
≥ 2.5× expected and ≥ 1.2× worst-case, then per credit spent on it: expected COGS ≤
0.157 / 2.5 = **$0.0628**, worst-case COGS ≤ 0.157 / 1.2 = **$0.1308**. (Lower bound on the
narrative's expected COGS from "3 did not clear": > 3 × 0.157 / 2.5 = $0.188 per narrative
⇒ > $0.0377 per credit. The true figure lies in ($0.038, $0.063] per credit; the ceiling is
used below — conservative.) Since 174 says EVERY standard action now clears, an allowance
credit can induce at most these COGS whatever it is spent on.

**Step 2 — net revenue per invoice** (Stripe US card rate 2.9% + $0.30, owner-confirmed):
$14.99 → **$14.26** · $5.99 → **$5.52** · $59.90 → **$57.86** (one fee per year — the annual
plan's net is 10.5× the monthly's).

**Step 3 — the policy ceiling on an allowance** = net ÷ creditValueUsd (both floors collapse
to the same bound because Step 1's bounds were derived from creditValueUsd): Surveyor
**≈ 90** credits · Cartographer monthly **≈ 35** · annual **≈ 368**.

**Step 4 — candidates:**

| Plan | Allowance | Expected COGS ≤ | Ratio (≥2.5 floor) | Worst COGS ≤ | Ratio (≥1.2 floor) | Verdict |
|---|---:|---:|---:|---:|---:|---|
| Surveyor $14.99 | 15 | $0.94 | 15.1× | $1.96 | 7.3× | clears; stingy beside Cartographer's 30 |
| Surveyor $14.99 | **25** | $1.57 | **9.1×** | $3.27 | **4.4×** | **clears with room; = the starter pack, derivable** |
| Surveyor $14.99 | 30 | $1.88 | 7.6× | $3.93 | 3.6× | clears; Cartographer parity (chair alternative, C3) |
| Surveyor $14.99 | 50 | $3.14 | 4.5× | $6.54 | 2.2× | clears; no longer "small" |
| Cartographer $5.99 (TODAY) | 30 | $1.88 | 2.9× | $3.93 | 1.4× | clears both floors — THIN, not underwater (the recon compared credit VALUE $4.71 to price, not COGS) |
| Annual $59.90 | 360 (12 × 30) | $22.61 | 2.56× | $47.10 | 1.23× | AT the worst-case floor — no room for a fee-rate surprise |
| Annual $59.90 | **300 (10 × 30)** | $18.84 | **3.07×** | $39.25 | **1.47×** | **clears both; the SAME ×10 factor the price uses** |

**Compiled sizes (J4, J5 — vetoable):** Surveyor **25/month** (`NEW_PACKS.credits_25.
credits` — the copy derives "the starter pack, every month" with zero hand-typed numbers);
annual **300 up front** (`ANNUAL_FACTOR × TIERS.cartographer.monthlyCredits` = 10 × 30 — the
one factor expresses both "two months free" and the credit grant; a 360 grant sits on the
1.2× floor). Cartographer monthly HOLDS at 30 (§464.2). Caveats the chair should weigh:
(i) BYOK subscribers spend allowance credits only on the non-BYOK path, so the realised
Surveyor COGS is BELOW the table; (ii) allowance credits EXPIRE at period end (:402-404) —
no liability accumulates; (iii) the bounds are implied by 174's claim that every action
clears — if the absent margin sheet ever shows an action that does not, the table's
ceiling moves with it (the nightly `pricing-resync-cron` calibrator at targetMultiplier
2.5 is the live guard, 174:26-31).

### Behaviour contract

1. **The allowance table.** `grantMonthlyAllowanceIfNeeded` replaces the literal `30` + the
   PREMIUM-only gate with a price-id → grant table read AT CALL TIME from env:
   `STRIPE_PRICE_PREMIUM → { credits: 30, plan: 'cartographer_monthly' }` ·
   `STRIPE_PRICE_PREMIUM_ANNUAL → { credits: 300, plan: 'cartographer_annual' }` ·
   `STRIPE_PRICE_SURVEYOR → { credits: 25, plan: 'surveyor_monthly' }`. **§471.2/F5 — the
   Cartographer row is PRESENT-BY-DEFAULT, the other two are present only when their env is
   set.** Resolution, in order: (i) the invoice's first line price id matches a CONFIGURED
   Surveyor or annual row ⇒ that row's credits; (ii) `STRIPE_PRICE_PREMIUM` is SET and the
   line price equals it ⇒ 30, `plan: 'cartographer_monthly'`; (iii) `STRIPE_PRICE_PREMIUM` is
   SET and the line price matches NO row ⇒ SKIP, logged (fail-CLOSED toward the platform's
   money — today's :368-370 posture, now covering every plan); (iv) `STRIPE_PRICE_PREMIUM`
   is UNSET, or the invoice carries NO line price ⇒ the Cartographer DEFAULT arm: 30 under
   `plan: 'cartographer_monthly'`, logged with today's :371-373 "gate inactive … proceeding
   for back-compat" line — PRESERVED verbatim because local/dev and the :513 pin depend on
   it, and because of the victim the skeptic named: without (iv), the configuration
   "Surveyor env set, PREMIUM env unset" would silently stop every live Cartographer
   subscriber's monthly 30 (today that configuration still mints it). Arm (iv) is NARROWER
   than today's fail-open because (i) now catches a Surveyor or annual invoice BEFORE it —
   the ALLOWANCE TRAP is closed in code whatever the env — and it is exactly as wide as
   today's for everything else. Every grant writes `source='monthly_allowance'` (unchanged
   — the ledger's idempotency and FIFO hang on it), `metadata.plan` beside the existing four
   keys, `expiresAt` = period end (unchanged).
2. **The annual product, server side.** create-checkout `PRICE_MAP` gains `premium_annual:
   Deno.env.get('STRIPE_PRICE_PREMIUM_ANNUAL') || ''` (active catalog block, with the LAW 1
   comment) and `SUBSCRIPTION_PRODUCTS` gains `'premium_annual'`; the webhook's checkout
   dispatch :2764 becomes `product === 'premium' || product === 'premium_annual'` (the branch
   body — profiles.tier, subscription id, out-of-order guard — UNCHANGED; the legacy-SKU
   comment :2765-2766 extended) and the mirror :2935 the same (kind `subscription_start`).
   `customer.subscription.deleted` (:3270-3291) is product-blind (it keys on the subscription
   id) — untouched.
3. **The two dial flips (§471.1/F1 — the ONE residual shared-path touch in W-C, serial-mint
   lawful).** `SURVEYOR_PLAN`, `ANNUAL_FACTOR`, `CARTOGRAPHER_ANNUAL` and `ACTIVE_CHECKOUT_SKUS`
   are WEB-8's registrations (contracts 8.5/8.6); this car changes TWO literals in
   pricing.js and nothing else there: `SURVEYOR_PLAN.monthlyCredits: 0 →
   NEW_PACKS.credits_25.credits` (WEB-9b's band sentence lights by itself — contract 9b.2)
   and `ANNUAL_FACTOR = 0 → 10` (`CARTOGRAPHER_ANNUAL` derives 5990 / 300 / factor 10 from
   it; `ACTIVE_CHECKOUT_SKUS` gains `premium_annual` by the dial — **F8: the same commit
   adds `premium_annual` to create-checkout's active block, so WEB-8's two-way parity scan
   stays green; flip either side alone and it reds**). The flips cannot be de-duplicated
   (they must land ATOMICALLY with the webhook table or the band claims credits nobody
   mints), so this car's packet is MINTED only after WEB-8 is LANDED — automatically true,
   since §471.3 builds it LAST, after WEB-9b lands (§9). The dial VALUE pins
   (`monthlyCredits === NEW_PACKS.credits_25.credits`, `ANNUAL_FACTOR === 10`,
   `CARTOGRAPHER_ANNUAL.priceCents === 5990`, `credits === 300`, `'premium_annual' ∈
   ACTIVE_CHECKOUT_SKUS`) are this car's, in `tests/config/pricing.test.js` under the same
   serial-mint rule; WEB-8's derivation pins there hold unchanged at 10.
4. **The two client/server numbers are ONE spelling:** the webhook's table credits are
   NOT read from pricing.js (Deno has no import of the client config — EXECUTED:
   `grep -n "pricing.js\|SURVEYOR_PLAN\|from '../../../src" supabase/functions/stripe-webhook/index.ts`
   = 0 at b10ed1a1; re-run at base). The parity is pinned by SOURCE SCAN in the vitest suite: `SURVEYOR_PLAN.
   monthlyCredits` and `CARTOGRAPHER_ANNUAL.credits` must equal the integers the webhook's
   table spells beside `STRIPE_PRICE_SURVEYOR` / `STRIPE_PRICE_PREMIUM_ANNUAL` (the
   contracts.test.js:1160 idiom; the same way `premium: 30` is… NOT pinned today —
   stripe.js:31's hand-typed `credits: 30` vs webhook :406 is a PRE-EXISTING unpinned pair,
   recorded in §10, closed for free by this pin's third row).

### Non-goals, affirmatively

- NO migration (the ledger source, idempotency key, FIFO and expiry all hold; no column).
  If the chair prefers a `plan` COLUMN over `metadata.plan`, that is the TWELVE-gate bill
  (§446/§455: creates no table — TEN gates) and a different car; not recommended.
- NO change to the Cartographer monthly grant (30), to `grantCredits`, to the referral
  settlement (:3064-3075), to the deletion/inactive paths, or to `revoke_surveyor_*`.
- NO RLS or grant change; NO new `MoneyEventKind`; NO `interval` parameter (one key per SKU
  stays the law — the drift detector censuses keys).
- NO client purchase path for the annual plan (WEB-11 — **§471.2/F3: the SKU ships dark and
  UNPURCHASABLE; §0's first-revision "the annual CTA lights" was FALSE and is struck**); NO
  copy change beyond the dial that WEB-9b already reads; NO annual copy of any kind.
- **§471.1/F1:** NO edit to `.env.example` (WEB-8 pre-listed `STRIPE_PRICE_PREMIUM_ANNUAL`
  under its dial comment) and NO edit to `tests/ui/pricingPageBands.test.jsx` (WEB-9b's
  allowance pin is two-armed under an override — this car RE-RUNS it, J-R2-6); in
  `src/config/pricing.js` and `tests/config/pricing.test.js` ONLY the two dial flips and
  their value pins (contract 3).
- NO DB-side cron allowance (considered and rejected — J6: credits must follow MONEY; an
  invoice-driven grant is idempotent per invoice and dies with the subscription; a cron grant
  would pay a `past_due` subscriber).

### Change manifest

| Path | Kind | Eff (est.) |
|---|---|---:|
| `supabase/functions/stripe-webhook/index.ts` | modify (logic; MONEY PATH): the table + lookup replacing :359-373/:406 with the Cartographer row present-by-default (§471.2/F5, +2 over the first revision); :2764/:2935 widened; comments | ~34 |
| `supabase/functions/create-checkout/index.ts` | modify (logic; MONEY PATH): the `premium_annual` row in the ACTIVE block + set member + header doc line | ~6 |
| `src/config/pricing.js` | modify (registration-only; **§471.1/F1 serial-mint: this packet is minted only after WEB-8 is LANDED**): the TWO dial flips — `monthlyCredits: 0 → NEW_PACKS.credits_25.credits`; `ANNUAL_FACTOR = 0 → 10` — and nothing else | ~2 |
| `supabase/functions/stripe-webhook/index.test.ts` | modify (Deno): :3293 re-pointed (a Surveyor invoice mints **25** under `source='monthly_allowance'`, `metadata.plan='surveyor_monthly'`, NEVER 30 — **F6: the re-pointed title must keep the file's required tokens intact; they live elsewhere (`Missing signature` :318, `Invalid signature` :329, `system_grant_credits` ×42, `does NOT double-grant` ×3) and the registration count stays ≥ 50, so a title change alone cannot red them — verify at the tip**); NEW: an annual invoice mints 300 with a one-year expiry; NEW: a configured table + an unknown line price ⇒ no grant (fail-closed); **NEW (§471.2/F5): `STRIPE_PRICE_SURVEYOR` set + `STRIPE_PRICE_PREMIUM` unset + a premium-priced invoice ⇒ 30 under `plan: 'cartographer_monthly'` (the default arm) — the skeptic's victim, pinned**; :513/:526/:3317 stay green (the preserved arm) | ~85 |
| `supabase/functions/create-checkout/index.test.ts` | modify (Deno): `premium_annual` = subscription mode + metadata.product (the :694 idiom); unset env ⇒ "Price ID not configured" | ~25 |
| `tests/edgeFunctions/contracts.test.js` | modify: the three-row credits parity source scan (contract 4); `SUBSCRIPTION_PRODUCTS` contains `premium_annual` | ~20 |
| `tests/config/pricing.test.js` | modify (**serial-mint, as above**): the dial VALUE pins — `SURVEYOR_PLAN.monthlyCredits === NEW_PACKS.credits_25.credits`; `ANNUAL_FACTOR === 10`; `CARTOGRAPHER_ANNUAL.priceCents === 5990` and `.credits === 300`; `'premium_annual' ∈ ACTIVE_CHECKOUT_SKUS` (WEB-8's derivation and parity pins are RE-RUN, not edited) | ~8 |
| `docs/DEPLOY.md` | docs: `STRIPE_PRICE_PREMIUM_ANNUAL` in the Secrets section (:303-318) — deployRunbookFreshness REDS without it (WEB-8 is LANDED by then; its F9 strike and this line never coexist in a non-terminal packet) | ~2 |

Totals (§471 re-price): 2 logic-bearing production files (BOTH money path) + 1 registration
(the two-line dial flip) · 0 new leaves · 8 handwritten files (`.env.example` DROPPED — WEB-8
pre-lists the name; `tests/ui/pricingPageBands.test.jsx` never enters — J-R2-6) · **~42
effective production lines** (34 + 6 + 2) · no migration · no package.json byte · no
generated artifact. **Shared paths with siblings: `src/config/pricing.js` and
`tests/config/pricing.test.js` with WEB-8 ONLY — both released by WEB-8's LANDED status before
this packet exists (§9).** The Deno suites are NOT in the vitest census (no vitest test
imports `handleStripeWebhook` — `grep -rn "handleStripeWebhook" tests` = 0 at b10ed1a1); they
run under `deno test` per DEPLOY.md — the executor's terminal runs BOTH instruments and
quotes both exits (the §wrong-instrument law).

### Acceptance (≤8)

| id | case |
|---|---|
| A1 | (Deno) a `subscription_cycle` invoice whose first line is `STRIPE_PRICE_SURVEYOR` grants exactly 25 credits, `source='monthly_allowance'`, `metadata.plan='surveyor_monthly'`, expiry = line period end; money kind `surveyor_renewal` (the :3293 test re-pointed — its title changes: the census key moves, DECLARED) |
| A2 | (Deno) a `subscription_create` invoice on `STRIPE_PRICE_PREMIUM_ANNUAL` grants exactly 300 with expiry = period end (≈ one year in the fixture); a second delivery of the same invoice grants nothing (idempotency on the invoice id — unchanged machinery, re-proven at the new amount) |
| A3 | (Deno) THREE arms of the gate (§471.2/F5): with PREMIUM configured, an invoice on an UNKNOWN price id grants nothing and logs the skip; with NO price env configured at all, the legacy 30 still mints (the :513 arm preserved); **and with `STRIPE_PRICE_SURVEYOR` SET but `STRIPE_PRICE_PREMIUM` UNSET, a premium-priced invoice mints 30 under `plan: 'cartographer_monthly'` with the back-compat log line — while a Surveyor-priced invoice in the SAME configuration mints 25 (the trap closed, the victim spared)** — with the negative control that removing the default arm flips the third outcome |
| A4 | (Deno) `checkout.session.completed` with `metadata.product='premium_annual'` sets `profiles.tier='premium'`, records the subscription id, mirrors `subscription_start` — byte-equal outcomes to the `premium` fixture except the product string |
| A5 | (Deno) create-checkout `premium_annual` ⇒ `mode='subscription'`, `subscription_data.metadata.product='premium_annual'`; anonymous ⇒ refused; env unset ⇒ `Price ID not configured for premium_annual` |
| A6 | (vitest) the credits parity scan: `SURVEYOR_PLAN.monthlyCredits` = the integer beside `STRIPE_PRICE_SURVEYOR` in the webhook table, `CARTOGRAPHER_ANNUAL.credits` = the one beside `STRIPE_PRICE_PREMIUM_ANNUAL`, `TIERS.cartographer.monthlyCredits` = the one beside `STRIPE_PRICE_PREMIUM` — with a planted-mismatch negative control; **(F8 folded) and the dial-value pins: `ANNUAL_FACTOR === 10`, `'premium_annual' ∈ ACTIVE_CHECKOUT_SKUS`, `CARTOGRAPHER_ANNUAL.priceCents === 5990`** |
| A7 | (vitest) RE-RUNS at the tip: the catalog-drift detector (contracts:1487) and deployRunbookFreshness (:254) are green — `premium_annual` appears in the webhook; `STRIPE_PRICE_PREMIUM_ANNUAL` is documented; **WEB-8's two-way `ACTIVE_CHECKOUT_SKUS` ↔ active-block scan is green with `premium_annual` on BOTH sides (F8 — the scan is EXECUTED, not assumed)** |
| A8 | (vitest) RE-RUN (J-R2-6): WEB-9b's three-armed allowance pin — its real-config arm now evaluates `present === (25 > 0)` and the band renders the allowance sentence with `25` interpolated; the two override arms are unchanged, so the negative is still exercised, never vacuous (the rendered-surface-negative law). The executor QUOTES this test's output at the tip — a pin that "stays green" across a behaviour flip is the one to read, not trust |

### Census, mutants, reds, STOP

- **censusAuthorization:** §464.2. Vitest motion: 0 new files, titles ≈ +5..+7 (A6's arms
  incl. the dial-value pins, A7's arms; 9b's A5 is a re-run, +0); Deno motion: **+5 tests**
  (A2 ×1, A3's third arm, A4, A5, the annual renewal) with one title renamed (A1 — a
  banked-failure identity hazard if :3293 is ever on the banked list: check the baseline
  FIRST). The vitest census re-stamped from the hash after the last edit.
- **Mutants (≥3):** M1 table credits for Surveyor → 30 ⇒ A1 + A6 red. M2 remove the
  fail-closed skip (grant on unknown price while PREMIUM is set) ⇒ A3 arm 1 red. M3 leave
  :2764 at `=== 'premium'` only ⇒ A4 red (and the paid-unfulfilled throw — the reason the car
  exists). M4 `ANNUAL_FACTOR = 12` ⇒ pricing.test red (priceCents ≠ 5990) — and the margin
  table's floor row. M5 drop `premium_annual` from `SUBSCRIPTION_PRODUCTS` ⇒ A5 red (payment
  mode). **M6 (§471.2/F5)** make the Cartographer row PRESENT ONLY WHEN `STRIPE_PRICE_PREMIUM`
  is set (the first revision's shape) ⇒ A3's third arm reds — a premium-priced invoice under
  "SURVEYOR set / PREMIUM unset" grants nothing. **M7 (F8)** add `premium_annual` to
  create-checkout's block without flipping `ANNUAL_FACTOR` (or vice versa) ⇒ WEB-8's two-way
  parity scan reds (A7).
- **Interior reds named (§471.2/F6 — the corrected floor):** every vitest reader of the two
  functions' SOURCE — **6 for the webhook** (founderPurchasePathAbsent · deployRunbookFreshness
  · autoReloadWebhookRace · checkoutAsyncPaymentFailure · contracts · paymentRefundDurableWorker)
  **and 3 (+1 scanner) for create-checkout** (founderPurchasePathAbsent · contracts ·
  sessionGateCensus · aiSurfaceCensus) — enumerate each one's pins at base (`contracts.test.js`
  alone has ≥6 regexes over create-checkout :1160-1200 and the drift detector;
  autoReloadWebhookRace and checkoutAsyncPaymentFailure pin webhook arms this car does not
  touch — re-run, quote) · **the THREE readers of `index.test.ts` itself**
  (moneyPathCoverageContract:42 · moneySecurityExecutionFloor:39 · contracts:119-125): the
  :3293 title re-point must preserve their required tokens — none of the tokens is in that
  title, so the re-point is safe by construction, but the executor greps the four tokens +
  the registration count AT THE TIP before calling the Deno edit done ·
  `tests/docs/deployRunbookFreshness` (the env name) · WEB-8's `.env.example` walker and
  two-way parity scan (both derive from `ACTIVE_CHECKOUT_SKUS`, dial-aware — green by
  construction once BOTH the dial and the server block move in one commit) · the
  money-ledger tests (`grep -rln "money_events\|MoneyEventKind" tests` at base) ·
  `tests/edgeFunctions/surveyorByok.test.js` (reads 139/159 — untouched, re-run) · CLAIM_RE
  over DEPLOY.md · **`tests/security` as a whole joins this car's widened sweep (§13)** — a
  money-path car whose sweep excludes the money-path security suites is the wrong instrument.
- **STOP (this whole car is one):** the chair rules WEB-10's dispatch at this review
  (C6). Inside the car: any need to touch `grantCredits`, the ledger RPCs, a migration, or
  the deletion paths ⇒ STOP-RAISE; any banked Deno failure in the webhook suite at base ⇒
  baseline lookup before attribution (the wrong-instrument law).
- **Trust boundary:** fail-CLOSED toward the platform's money on every new arm (unknown
  price while PREMIUM is set ⇒ no grant; unset env ⇒ unpurchasable; product validated
  against PRICE_MAP before metadata, contracts:1594); the only fail-OPEN is the pre-existing
  back-compat arm — **§471.2/F5: preserved as the Cartographer DEFAULT arm (an unset
  `STRIPE_PRICE_PREMIUM` or a line without a price still resolves the legacy 30 for any
  non-Surveyor, non-annual line), exactly as wide as today's for those lines and narrower
  only where a configured Surveyor/annual row now catches its own invoice first** — so the
  narrowing has no victim; no amount is ever read from the client; metadata is trusted only
  after signature verification (unchanged, contracts Tier 0.5).
- **Owner-gated remainder — THE OWNER'S STRIPE TO-DO (exact; WEB-9a/9b need items 1-3 and
  5-7; WEB-10 adds 4; nothing here is the chair's to execute):**
  1. Stripe Dashboard → Products → **Surveyor** (create if absent) → add a recurring price
     **USD 14.99 / month** → copy the `price_…` id.
  2. Supabase → Edge Functions → Secrets: **confirm `STRIPE_PRICE_PREMIUM` is SET and equals
     the live Cartographer monthly price id BEFORE step 3** (§471.2/F5 — the consequence in
     BOTH directions): **before WEB-10 deploys**, with it unset the allowance gate is
     fail-open and the first Surveyor invoice would mint the Cartographer 30 (the ALLOWANCE
     TRAP, webhook :371-373); **after WEB-10 deploys**, the trap is closed in code whatever
     the env (a Surveyor invoice always resolves the Surveyor row), AND an unset
     `STRIPE_PRICE_PREMIUM` still mints the Cartographer 30 for every non-Surveyor,
     non-annual invoice — so live Cartographer subscribers keep their allowance either way —
     but only a SET `STRIPE_PRICE_PREMIUM` makes the Cartographer arm exact (an invoice on an
     unrecognised price is then SKIPPED rather than paid 30). Set it; it costs nothing and
     closes the last fail-open.
  3. Secrets: `STRIPE_PRICE_SURVEYOR=price_…` (LAW 1: until set, the band's CTA is disabled
     by WEB-9b's configured-guard and create-checkout refuses). Deno reads secrets at
     invocation — no function redeploy is needed for a secret alone.
  4. (WEB-10) Products → **Cartographer** → add a second recurring price **USD 59.90 /
     year** → Secrets: `STRIPE_PRICE_PREMIUM_ANNUAL=price_…`; deploy `stripe-webhook` and
     `create-checkout` (the code moved — a deploy IS needed for these two).
  5. `supabase db push` of the Surveyor stack — **139, 150, 159** are among the ~75 unpushed
     (production appliedHead **121**, `supabase/applied-head.json`, verified 2026-07-28) —
     within the owner's ordered train (§464.4's document; DEPLOY.md preambles).
  6. Stripe Dashboard → Developers → Webhooks → the endpoint's events: confirm
     `checkout.session.completed`, `invoice.paid` / `invoice.payment_succeeded`,
     `customer.subscription.deleted` are subscribed (they already are for Cartographer; NO new
     event type is needed by WEB-9 or WEB-10).
  7. Stripe Dashboard → Settings → Billing → Customer portal: if the portal's product list
     is RESTRICTED, add Surveyor (and the annual price) so "Manage subscription"
     (`create-customer-portal`, PricingPage.jsx:172) can cancel/switch it.
  8. Legal: docs/legal/TERMS_OF_USE_DRAFT.md:97,104,418 carry "$19.99 PROVISIONAL" — counsel's
     text; the $14.99 ruling is the owner's to carry there (NOT this train's edit).

---

## §5 · WEB-11 — THE ANNUAL PLAN'S CLIENT HALF (PRICED; **train W-D — ONE car, dispatched the moment WEB-10 lands — §471.2/F3**)

**Why it is not in WEB-10:** its touch set is stripe.js (the `premium_annual` PRODUCTS row,
price derived from `CARTOGRAPHER_ANNUAL`; the annual arm of `checkoutSuccessMessage` —
`'Cartographer activated.'` keyed on `isPremiumProduct`), checkoutReconcile.js
(`isPremiumProduct` gains `premium_annual` — the tier poll is the right reconcile: the
webhook sets `profiles.tier`), PricingPage.jsx (a monthly/annual toggle on the Cartographer
card or a second CTA inside P8's single-primary rule; `loading === 'premium_annual'`) and
PricingTierCards.jsx (the annual price string + "two months free" from
`CARTOGRAPHER_ANNUAL.factor`, copy via en.js tokens) — **four logic-bearing files** beside
WEB-10's two; the cap is three. **§471.2/F2:** App.jsx is NOT in WEB-11's set — WEB-9a's
extraction moved the toast map to stripe.js, so the annual toast is a stripe.js arm at +0
App.jsx lines; if an executor nevertheless finds an App.jsx edit necessary, the file is an
exact ceiling (647 after WEB-9a; RE-DERIVE) and `scripts/.size-baseline.json` joins WEB-11's
manifest as a ratchet-DOWN with the measured number — never a raise, never padding.

**Shape (≈ WEB-9a's mirror):** ~45 effective production lines · +1 test leaf
(`tests/lib/stripeProducts.test.js` from WEB-9a gains the annual arms — so 0 new leaves) ·
acceptance: the derived `$59.90/yr` string; `startCheckout('premium_annual')` reaches the edge
invoke; reconcile SUCCESS on tier `premium`; the configured-guard (unset env ⇒ disabled);
P8 single-primary unchanged; copy-guard green (no `$\d` literal) · mutants: hand-typed
price; annual purchase CTA shown to a current subscriber (the manage wall). Depends on
WEB-10 LANDED and the owner's item 4. Census: +0 files, ≈ +6 titles. **Topology (F3):**
W-D = WEB-11 alone; it is chartered HERE (this section is its charter — no second compile
seat), minted the moment WEB-10 reaches LANDED, and is the car that makes §464.2's annual
clause TRUE for a buyer. Until it lands, the annual plan is a server-side SKU nobody can
purchase, and every document in this train says so.

(§6-§8 are intentionally unused so that §9 topology · §10 sweep · §11 open questions ·
§12 judgments · §13 standing laws keep the first train's section numbers.)

---
## §9 · TRAIN TOPOLOGY

- **W-C (4 members = the un-stamped cap, PACKET_STANDARD:179-195; the website family's
  preamble carries NO Fable-round stamp at b10ed1a1 — §402 chartered the first train at four
  for the same reason):** **WEB-8 → WEB-9a → WEB-9b → WEB-10**. Dependencies are REAL here,
  unlike W-A's judgment-density order: 9b needs 9a's `startCheckout('surveyor')` and
  `SURVEYOR_PLAN` (WEB-8's stub, §471.1/F1) — so 9a and 9b both import from a base that
  CONTAINS WEB-8; 10's dial flips light 9b's allowance sentence and join `premium_annual`
  to the SKU list whose `.env.example` line WEB-8 pre-listed; 8 is independent of all
  three and lands first because it is the honesty fix with zero money adjacency. Each
  member severable by its own commit (the §364 split rule). **§471.3 RULED C6: WEB-10 is
  dispatched as compiled**, STOP-class, built LAST after WEB-9b lands (and therefore after
  WEB-8 is LANDED — the serial-mint condition below is met by the order itself).
- **Shared change paths — THE RULE AS THE VALIDATOR ENFORCES IT (§471.1/F1; the first
  revision's "split promotion" was unmintable):** `scripts/implementation-packets.mjs:43`
  `TERMINAL_PACKET_STATUSES = {LANDED, SUPERSEDED}`; :543 `reservesChangePaths =
  !TERMINAL_PACKET_STATUSES.has(status)`; :561-568 a second packet naming a path a
  non-terminal packet already names is `duplicate change path across packets` — an ERROR at
  DRAFT, READY, BLOCKED and STALE alike. **Therefore: at most ONE non-terminal packet may
  name a given path; a sibling's packet cannot even be MINTED at DRAFT on that path until
  the owner packet is LANDED or SUPERSEDED.** (No pre-existing collision: the only packet
  naming these paths at b10ed1a1 is documentation-truth/DOM-2.md at LANDED; no website
  family packet exists yet.) The train is therefore DE-DUPLICATED: **`src/config/pricing.js`
  · `tests/config/pricing.test.js` · `.env.example` belong to WEB-8 ALONE** (it lands the
  siblings' stubs behind dials at 0 — §1 contracts 5-6); **WEB-9a names none of them** (its
  `SURVEYOR_PLAN` registration and pins moved to WEB-8; its own paths — stripe.js,
  checkoutReconcile.js, App.jsx, `.size-baseline.json`, two tests — are named by no sibling);
  **WEB-9b names none of them** (PricingBands, PricingPage, the new hook, copy,
  pricingDisplay, two docs, two tests — named by no sibling; WEB-10's first-revision edit to
  pricingPageBands.test.jsx is removed by J-R2-6); **WEB-10 is the ONE residue that cannot
  be de-duplicated** — its two dial flips in pricing.js and their value pins in
  pricing.test.js must land atomically with the webhook table — and its packet is MINTED
  only after WEB-8 is LANDED (serial mint), which the train's own order guarantees: §471.3
  builds WEB-10 LAST, after WEB-9b lands, by which time WEB-8 is terminal and its
  reservation released. `src/lib/stripe.js` and `scripts/.size-baseline.json` are named by
  9a and (in W-D) WEB-11 — WEB-11 is minted after WEB-10 LANDED, hence after 9a LANDED.
  `docs/DEPLOY.md` is named by WEB-8 (the F9 strike) and WEB-10 (the new env line) — the
  same serial-mint rule covers it. **Consequence for minting:** WEB-8, WEB-9a and WEB-9b may
  all hold non-terminal packets simultaneously (zero overlap); WEB-10's packet may not
  exist while WEB-8's is non-terminal. The CAS order stays the dependency order — 9a's and
  9b's bases must CONTAIN WEB-8's pricing.js (an import dependency, not a reservation).
- **W-D (§471.2/F3 — CHARTERED here, one car):** WEB-11 (the annual client half, §5),
  dispatched the moment WEB-10 lands; W-D = WEB-11 alone. The telemetry rider (§10 row 1)
  is NOT in W-D — it stays a deferred row for the telemetry client train. W-D is
  independent of W-C except WEB-11 ← WEB-10 LANDED.
- **Queue position:** per §464.2's queue effect, W-C's cars build on Opus as seats free and
  land AFTER WEB-2/WEB-3 (198/199 in holding — §455/§460); under §465's two-lane cap one
  build seat at a time, the landing seat still ONE (§291). Never inside a §353 mint window;
  §388 build-vs-land applies.
- **Terminal law per member:** the full bare gate under the arm-and-wait watcher (§395),
  mutexed attribution sweeps (§393), in-shell TRUE_EXIT, self-named logs, the §358.2 stray
  posture; WEB-10 additionally runs `deno test` over BOTH function suites and quotes both
  exits (the Deno suites are outside the vitest census — §4).
- **OSR envelope:** no W-C car touches a generated prose leaf or any of the 13 unscanned
  files (the targets are config, copy, components, edge functions, tests, two docs); every
  executor runs the bare gate at its ACTUAL base in preflight (S0, two-part reading,
  §384.2/§397) — an inherited broken envelope is RECORDED, never cured in-member.
- **Migration motion:** ZERO across W-C (every "needs a column?" question answered NO in
  §1-§4 with the reason); the twelve/ten-gate bill (§446/§455) is therefore not incurred —
  which is also why WEB-10 can be one car.

---

## §10 · THE SWEEP — adjacent items found while reading, enumerated (chair decides; none is in a car)

| # | Item | Where | Disposition |
|---|---|---|---|
| 1 | A dedicated credit-pack purchase analytics event (the brief's (e)) | `src/lib/analyticsEvents.js` frozen registry; `Funnel.paidAction({kind})` (analytics.js:164) already carries `kind` as an OPEN string — `'credit_pack'` is emitted today (stripe.js:174-184) | DEFERRED with reason: a registry row costs the twelve-row rider WEB-4 measured (§446) and touches the edge-shared bundle WEB-3 broke once (§460.2); the funnel kind already distinguishes packs. W-D candidate if the chair wants a first-class event. |
| 2 | `stripe.js:31` hand-types `credits: 30` for the premium PRODUCTS row and names it `'Premium Upgrade'` | vs `TIERS.cartographer.monthlyCredits` one import away | PRE-EXISTING drift of the O-P3 class; WEB-10's A6 parity scan closes the NUMBER; the name is a copy-walk item (owner's words). A one-line derivation fits WEB-9a's stripe.js edit at +0 lines — executor MAY fold (recorded here so it is not a silent scope creep). |
| 3 | `pricing.js:45-46` comment "repriced narrative costs (3/4/5 per feature)" | stale since 174 (5/4/6) | comment-only; fires ratchets (§104.4); NOT folded — belongs to the pricing lane's next touch. |
| 4 | `change-view`'s ladder cell `free: false` is itself a small lie (free sees the latest change) | entitlementLadder.js:73 vs SettlementMapNotes.jsx:33 | FOLDED into WEB-8 (contract 2) — listed so the chair sees it was a finding, not an invention. |
| 5 | The Cartographer TierCard renders its own copy from `en.js pricing.tiers.cartographer.*` (PricingTierCards.jsx:40-43) — a second place tier claims live | outside the ladder walker's reach | NOT this train's; the O-P1 class one surface over. Recommend a W-D or copy-walk row: "every TierCard bullet names a ladder row id" (the same walker idiom). |
| 6 | The `has_surveyor_entitlement` module caches (`useSurveyorEntitled.js:21`, `useAccountSurveyorGate.js:28`) hold a stale `false` after a CONCIERGE grant mid-session | pre-existing; the purchase path is immune (full-document return) | RECORDED; a `bustSurveyorCache()` on auth change is a one-line W-D item if concierge grants continue. |
| 7 | create-checkout has NO "already subscribed" refusal — a second Cartographer/Surveyor subscription on one customer is possible if the client's manage-vs-purchase wall is bypassed | `grep -n "already\|existing sub" create-checkout/index.ts` = redeem-code strings only | C5: a server-side refusal is a money-path edit → WEB-10 option (≈ +8 lines, one Deno pin) or a W-D car. Not compiled in by default (one webhook/checkout diff per car is already the STOP). |
| 8 | The pricing page's `pricingDisplay.js:68-80` SURVEYOR_SURFACE prose and the W-DOC "ruling #3" comments say "never a subscription" | three comment sites | FOLDED into WEB-9b contract 3 (comment-only, DECLARED). |
| 9 | `docs/legal/TERMS_OF_USE_DRAFT.md:97,104,418` — "$19.99 PROVISIONAL" | counsel's placeholders | OWNER (to-do item 8). |
| 10 | Production appliedHead 121 vs migration head 197 at the tip | `supabase/applied-head.json` | OWNER (§464.4) — every Surveyor car lands dark behind it; recorded so no executor "tests it live". |

---

## §11 · OPEN QUESTIONS — CHAIR vs OWNER

**CHAIR (sign or flip at this review; each carries the compiled recommendation):**

| id | Question | Compiled recommendation |
|---|---|---|
| C1 | WEB-8 literal (de-advertise all ten `ruled-2026-07-17` rows) vs INTENT (re-point the four ENFORCED rows to `viewerCanAuthor`, retire the two UNSHIPPED, re-spell the four parity rows) | INTENT. The ruling's sentence is "stops claiming a paywall that does not exist" — four paywalls DO exist (executed gate suites); deleting their rows would be the mirror lie (a table that hides a real wall). The literal shape is priced at −2 rows of the same manifest if the chair prefers it; the walker pin (A1/A2) is identical under both. |
| C2 | Surveyor's COMPOSITION in the design doc: "= Premium + the AI surface" (DESIGN_AI_CONTROL_SURFACE.md:290) vs the BUILT shape (an entitlement SEPARATE from `profiles.tier`, stackable beside Cartographer — 139:7-11) | Write the BUILT shape into the doc (WEB-9b contract 4); "includes Cartographer" would need a tier write on Surveyor purchase (a webhook edit + the downgrade path) — a different product, and the ruling says "on top of BYOK", not "on top of Cartographer". |
| C3 | Surveyor allowance: **25** (= the starter pack; derivable) vs 30 (Cartographer parity) | 25 (J4). "Small" in the ruling; clears 9.1×/4.4×; copy derives from `NEW_PACKS.credits_25`. 30 also clears (7.6×/3.6×) and reads as parity — flip by a word; the table is in §4. |
| C4 | Annual credits: **300** (10 × 30, the price's own factor) vs 360 (12 × 30) | 300 (J5). 360 sits ON the 1.2× worst-case floor (1.23×) with no room for a fee-rate or COGS surprise; 300 clears 3.07×/1.47×, and one `ANNUAL_FACTOR` derives both price and credits so the copy can say "ten months of credits up front, two months free" without a second number. |
| C5 | A server-side "already subscribed" refusal in create-checkout (§10 row 7) — fold into WEB-10, open a W-D car, or leave to the client wall | Leave to the client wall for W-C (one money-path diff per car); open as a W-D row. |
| C6 | **WEB-10's dispatch** — the STOP-class money-path car (§4): dispatch in W-C as compiled · dispatch server-allowance-only (drop the annual product to W-D) · refuse | **RULED §471.3: dispatch as compiled, built LAST.** The Surveyor allowance cannot ship any other honest way (the ruling's "small monthly credit allowance" is webhook-minted or it is nothing), and folding the annual product into the same webhook diff is one Deno re-proof instead of two. **§471.2/F3, said plainly: WEB-10 delivers the annual plan's SERVER half only — a dark, unpurchasable SKU; §464.2's annual clause is delivered by W-C + W-D together, and W-D is WEB-11 alone, dispatched when WEB-10 lands.** The Cartographer allowance row is present-by-default (F5) so no live subscriber loses the 30 under any env. |
| C7 | Topology: W-C at four; WEB-11 into W-D | **RULED §471.1/F1 + §471.2/F3: W-C = four cars with the shared paths DE-DUPLICATED** — WEB-8 alone owns pricing.js / pricing.test.js / .env.example; 9a and 9b name none of them; WEB-10's two dial flips are the one residue and its packet is minted only after WEB-8 is LANDED (serial mint, §9 — as the validator enforces it, implementation-packets.mjs:543/:561-568). **W-D = WEB-11, ONE car, chartered in §5, dispatched the moment WEB-10 lands; §464.2's annual clause is W-C + W-D together.** The telemetry rider is NOT in W-D. |
| C8 | The ALLOWANCE-TRAP ordering in the owner's to-do (item 2 before 3) — should the chair make `STRIPE_PRICE_PREMIUM` set-ness a WEB-9a PRECONDITION the lane verifies by reading DEPLOY.md rather than an owner instruction? | Owner instruction only — the program has no Supabase contact by constitutional law (§464); the lane can only say it in the runbook. WEB-10's table is the code-side cure. |

**OWNER (docketed; none blocks a dispatch — every W-C car lands DARK by construction):**

| id | Item | Note |
|---|---|---|
| O1 | The Stripe to-do list (§4, eight items) | Items 1-3 and 5-7 light WEB-9; item 4 lights WEB-10; item 8 is counsel's. |
| O2 | `supabase db push` of 139/150/159 and the WEB migrations (§464.4) | The Surveyor door exists in the tree today and shows for any entitled user once 139 is live — WEB-9a does not change that. |
| O3 | Stripe fee basis (2.9% + $0.30 assumed) | Confirm against the account; every ratio in §4 moves with it (the Surveyor rows have the room; the annual-360 row does not). |
| O4 | The copy WORDS in WEB-9b (lead/body/cta/allowance) beyond the config-derived tokens | The copy walk's; the compile supplies the shapes so the page is honest at every status. |
| O5 | The deploy of `stripe-webhook` + `create-checkout` after WEB-10 | The owner's keystroke. |

---

## §12 · JUDGMENTS (each vetoable — say veto to flip)

| id | Call | Why |
|---|---|---|
| J1 | WEB-8 compiled to the ruling's INTENT, escalated as C1 rather than decided silently | It interprets a ruling whose premise (no gate exists) was measured FALSE for four rows; the chair ruled on the recon's spelling, not on the code. |
| J2 | `interiors` / `v2-redraw` move to `DEFERRED_LADDER_ROWS` (labels kept, render pinned absent) rather than being deleted | "at map activation the rows return WITH their gates" — a move is reversible by a move; a delete rewrites copy twice. |
| J3 | WEB-9 split into 9a (dark client purchase path) + 9b (the page lights it) | PACKET_STANDARD:457 — the ruled WEB-9 exceeded ≤3 logic-bearing files; 9a lands with nothing user-visible so the page never offers a purchase that throws. |
| J4 | Surveyor allowance = 25 = `NEW_PACKS.credits_25.credits` | Clears both floors with room; "small"; ZERO hand-typed numbers in copy (the copy law). C3 offers 30. |
| J5 | Annual credits = `ANNUAL_FACTOR × monthlyCredits` = 300, granted up front with a one-year expiry | 360 is at the 1.2× floor; one factor derives price and credits; the ledger's expiry machinery is unchanged. C4 offers 360. |
| J6 | The allowance is invoice-driven (the webhook table), not a DB cron | Credits follow money; per-invoice idempotency; dies with the subscription; a cron would pay a `past_due` subscriber. |
| J7 | ONE money-path car (WEB-10) carries both the Surveyor allowance and the annual product; the annual CLIENT half is WEB-11 | One STOP, one webhook diff, one Deno re-proof; the cap arithmetic forbids five cars. |
| J8 | The `.env.example` walker distinguishes ACTIVE (required) / ABOLISHED (forbidden) / LEGACY (tolerated under a marker) | create-checkout keeps legacy keys RESOLVABLE for refund/replay (:73-78) and DEPLOY.md:407-413 records the one-direction rule; forbidding legacy names would mislead a deployer who must honour a legacy refund. |
| J9 | The credit-pack analytics event is NOT folded | WEB-4's measured rider cost (§446) + the generated bundle WEB-3 broke (§460.2); `Funnel.paidAction.kind` already discriminates packs. |
| J10 | `SURVEYOR_PLAN` and `CARTOGRAPHER_ANNUAL` live OUTSIDE `TIERS` | TIERS keys are `profiles.tier` shapes; Surveyor is an entitlement (139's reason) and annual is a price of the SAME tier; the three-way `getVisibleTiers` pin holds untouched. |
| J11 | Surveyor's checkout reconcile polls `has_surveyor_entitlement` and never declares success from the URL | checkoutReconcile.js's own doctrine (:1-23, :127-129) applied to the entitlement the webhook actually writes. |
| J12 | The allowance sentence is keyed on the `monthlyCredits` dial (renders only when > 0) | Honest at every status: 9b can land before 10 without claiming credits nobody mints. |
| J13 | The stale "never a subscription" comments (three sites) are re-worded in 9b and DECLARED | §464.2 supersedes ruling #3's half-sentence; a comment that contradicts the ruling is the §320 class one level down (the first train's J9 precedent). |
| J14 | `ACTIVE_CHECKOUT_SKUS` introduced in WEB-8 as the ONE list the `.env.example` walker and (later) WEB-10 derive from | Two derivations of "active SKU" would be the second-ledger hazard; one exported list pinned against create-checkout's active block by source scan. |
| **J-R2-1** (§471.1/F1) | The sibling stubs land in WEB-8 behind NUMERIC dials — `SURVEYOR_PLAN.monthlyCredits = 0` and `ANNUAL_FACTOR = 0` — rather than boolean `live` flags, and `ACTIVE_CHECKOUT_SKUS` derives `premium_annual`'s membership from `ANNUAL_FACTOR > 0` | The ruling says "at dial 0"; a numeric dial IS the value the siblings read (the band interpolates `monthlyCredits`, the annual plan derives price and credits from the factor), so there is no second flag to keep in step, and WEB-8's pins can pin the DERIVATION (true at 0 and at 10) while WEB-10 pins the VALUE. A boolean flag beside a number would be two ledgers. |
| **J-R2-2** (§471.2/F2) | WEB-9a's App.jsx delta is compiled as the MEASURED −3 (650 → 647 simulated) with `scripts/.size-baseline.json` in the manifest as a ratchet-DOWN, rather than engineering a net-zero shape | The ruling's primary is net-zero; the executed simulation shows the mandated extraction is −4 and the dep is +1, so net-zero would require padding — forbidden by the baseline's own SHRINK-ONLY law. The ratchet-down is the honest shape; the executor re-derives the number at base. |
| **J-R2-3** (§471.1/F1) | `.env.example` pre-lists `STRIPE_PRICE_PREMIUM_ANNUAL` in WEB-8 under a one-line dial comment, so WEB-10 never names `.env.example` | The walker tolerates a non-active, non-abolished, non-legacy extra; the alternative (WEB-10 adds the line under serial mint) is lawful but keeps one more path on the money car for one documentation line. DEPLOY.md is NOT pre-documented the same way (a runbook line tells a deployer to SET a secret; listing an unconsumed one there is the state F9 just removed). |
| **J-R2-4** (§471.2/F9) | DEPLOY.md:407-413's paragraph, which names `STRIPE_PRICE_FOUNDER_LIFETIME` as its worked example of documented-but-unconsumed, is left as written after the :305 strike | The paragraph's RULE (the pin runs one direction) still binds and is referenced by J8; its example becomes historical prose, not a false claim. An executor may re-word the one clause to past tense at +0 lines. Either way CLAIM_RE-clean. |
| **J-R2-5** (WEB-8 acceptance) | WEB-8's first-revision A7 (existing walkers stay green) and A8 (the four gate suites re-run) are MERGED into one re-run row to make room for A8 = the sibling stubs' pins, keeping ≤ 8 | Both were re-runs of existing suites, not new cases; the stubs needed an acceptance row or the manifest would price unpinned registration. |
| **J-R2-6** (a shared path the skeptic did not name) | WEB-9b's allowance-sentence pin is THREE-ARMED (override 0 ⇒ absent; override 25 ⇒ present; real config ⇒ presence equals `monthlyCredits > 0`) so WEB-10 only RE-RUNS `tests/ui/pricingPageBands.test.jsx` instead of replacing an arm in it | The first revision had WEB-10 "REPLACING" 9b's negative arm — an edit to 9b's file that WEB-10's manifest never listed (the F8 class). With 9b LANDED before 10 is minted the edit would have been lawful, but a pin that needs rewriting when the dial flips is a pin on the dial's VALUE in the wrong car; the three-arm shape is non-vacuous at every status and owned once. |
| **J-R2-7** (§471.2/F7) | The migration census names the ACTIVE definitions (FIFO 192:255; grant delivery-key arm 178:242; once-minted index 018:92-94 and idempotency table 024:8-14) and states that the grant-side arm IS re-minted, refining the ruling's "idempotency sites 018:92-94 + 024:26-30 (never re-minted)" | Executed: the `system_grant_credits` arm was re-created five times and the webhook calls that RPC; only the index and the table were minted once. Handing the executor 024:26-30 as "the" idempotency site would repeat the class the finding corrects. |
| **J-R2-8** (§471.2/F6) | `tests/security/aiSurfaceCensus.js` is listed as a fourth create-checkout reader (a tree scanner) though it is not a `.test.js` | It reads every function's `.ts` for a model-call regex; WEB-10 adds none, so it is inert — listed so the floor is the executed grep's truth, not a curated subset. |

---

## §13 · STANDING LAWS THAT BIND EVERY EXECUTOR OF THIS TRAIN (the first train's §13, plus what this train adds)

- Pin every read to the SHA you resolve; **no SHA is typed rather than read**; every landing
  script carries the tip guard (§381.1). Every figure in this charter is **STOP: RE-DERIVE AT
  BASE** — none may be transcribed into code, pins or the ledger.
- The tail is not the gate: full log by printed path, pid-lineage when no path printed
  (§382.1); in-shell TRUE_EXIT beside the gate's own tail. **§460.1 — BUILDERS NEVER RUN
  `npm run check:tail`**: the landing terminal is the gate; a builder's proof is the WIDENED
  mutexed sweep — `tests/lint tests/build tests/docs tests/ops` PLUS `tests/ui` (WEB-8's
  render pins, 9b), `tests/edgeFunctions` (9a's contracts reads, 10), `tests/domain` / 
  `tests/data` whenever the member touches a UI prop, an edge function, a domain reader or
  data; **WEB-10's builder ALSO sweeps `tests/security`** (§471.2/F6 — four of its suites
  read the files WEB-10 edits: moneyPathCoverageContract and moneySecurityExecutionFloor
  read `index.test.ts`; edgeLogRedaction and refundLedger.contract name the function; a
  money-path car whose sweep excludes the money-path security suites is the wrong
  instrument) and adds `deno test` over both function suites.
- **§440.2 / §457 — INLINE SHELL EXPORTS:** the harness starts a FRESH shell per command, so
  every battery/terminal command carries its exports INLINE IN THE SAME COMMAND LINE —
  `export GATE_MUTEX_LOCK_DIR=/tmp/settlementforge-vitest-gate.lock; export
  GATE_MUTEX_MAX_POLLS=480; export TMPDIR=/tmp/<lane>; sh scripts/gate-mutex.sh --run -- …`
  — with a pre-run `ls -d` of the shared lock to see who holds it; a per-lane TMPDIR without
  the shared lock dir DEFEATS cross-lane exclusion (the §457 hold-up).
- **§448 — RESUME POINTs every 30 minutes** in the lane receipt; the receipt stub precedes
  the first read; a lane that dies leaves a resumable point (this charter exists because
  the prior compile lane obeyed it).
- **§410 — a retrospective mint enters at the terminal status:** a packet whose work is
  already complete is INVALID at DRAFT (a `retiredSymbols` row is a promise at every
  non-terminal status and a claim only at LANDED) — if the validator refuses DRAFT for
  finished work, that is the law, not a bug; enter at LANDED. No W-C car retires a symbol
  (§379.3 vacuously satisfied, said so in §0), so this binds only a car minted after the fact.
- A NEW test file is a CREATE row at every packet status; the census-carry law: never carry
  a tuple across a rebase — re-stamp from the hash after the last edit; a parked test file
  swallows its titles (attribute by reverting one file at a time).
- Any package.json byte change is a MINT TRIGGER (§349.2) — STOP, not absorb. None of W-C's
  cars touches it (checked: no new dependency is needed by any manifest above).
- docs/**.md writes run the exact CLAIM_RE first (tests/docs/enforcement-claims.test.js:40);
  naked-claim debt is per-claim — **WEB-8's DEPLOY.md strike (§471.2/F9)**, WEB-9b's two doc
  lines and WEB-10's DEPLOY.md line are the only doc writes in W-C (DEPLOY.md is thus named
  by WEB-8 and WEB-10 — serial-mint, §9).
- **§471.1/F1 — THE RESERVATION LAW, for every packet author in this train:** a change path
  is reserved at EVERY non-terminal status (implementation-packets.mjs:543); never mint a
  packet naming a path a sibling's non-terminal packet names — WEB-10's packet waits for
  WEB-8 LANDED; WEB-11's for WEB-10 LANDED. A "split promotion" does not exist.
- Comment-only edits fire ratchets (§104.4) and, for edge-bundle-inlined files, the
  regeneration trigger — every comment re-wording above is DECLARED; no W-C target is in the
  edge bundle at the pin (`src/lib/analyticsEvents.js` is NOT touched — verify bundle
  membership at base before touching `src/lib/stripe.js`, §385.2).
- Attribution sweeps run mutexed (§393); the arm-and-wait watcher is the terminal standard
  (§395); `test:ratchet` / `verify:dist` take the gate mutex themselves — start the terminal
  under load; never wrap `npm run check*` in `gate-mutex.sh --run`.
- Never clone node_modules from the main checkout; npm ci against the lockfile, entry-count
  tell (§386.1); ⛔ REF-PIN holding tips before any worktree cleanup (§403 — a detached
  worktree HEAD is a commit's only ref); disk check on green.
- **Money-path law (this train's addition):** an edit to `stripe-webhook/index.ts` or
  `create-checkout/index.ts` exists ONLY inside WEB-10 (or a later STOP-ruled car); WEB-8,
  9a, 9b executors who find they "need" one STOP-RAISE instead. The Deno suites are a second
  instrument outside the vitest census — quote both exits. Billing adjacency fails CLOSED
  toward the platform's money on every new arm.
- **The size-baseline exact ceilings** (`scripts/.size-baseline.json`: App.jsx 650) are
  measured at base with eslint `max-lines` (`skipBlankLines`+`skipComments`), never `wc -l`;
  the pin holds in BOTH directions (tests/lint/sizeBaseline.test.js:112-127). **§471.2/F2:**
  WEB-9a's toast-map extraction to stripe.js is MANDATORY; any non-zero delta means the
  baseline file joins that car's manifest as a ratchet-DOWN to the measured number (the
  natural shape is −3); the same rule binds WEB-11; an entry is never RAISED and a file is
  never padded to hold its number.
- The any-cast allowance is a second ledger: new deps are JSDoc-typed, zero `any`
  (checkoutReconcile.js is typed throughout — keep it so).
- Foreign WIP is the owner's — unknown untracked files and the main worktree's dirty hunks
  are preserved untouched; the main worktree matches no branch (ledger commits only by the
  private-index method).

— end of charter —
