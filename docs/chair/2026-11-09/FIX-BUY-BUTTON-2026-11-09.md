# FIX-BUY-BUTTON — the dossier buy buttons lose the price, 2026-11-09

Seat FIX-BUY-BUTTON, a child of the chair session `session_01FbPLbejcfwX5nii12VM673`. Lane
`lane/fix-buy-button-2026-11-09`, cut from `lane/integration-2026-11-07` at **464887416**.

**The owner's word (2026-11-09, verbatim):** "Oh in the button buy this dossier, remove the for 2.99
and available at launch. The available at launch is in the pill for the button."

## The measure, and the STOP it raised

The brief placed the button on the Actions rail (`NextActionRail.jsx`) as `dossierExport.buySaved.cta`.
**CONFIRMED by reading the source, that placement is wrong.** The rail never renders `buySaved.cta`. Its
purchase rungs are "Export Dossier" and "Edit (Cartographer)", and neither carries a price. The
button the owner names is `src/components/BuyThisDossier.jsx`, which has two buying states. The STOP
went to the chair with my default, and the lane ran on that default.

## Before → after

| control | before | after |
|---|---|---|
| anon button (GenerateWizard, DossierActionBand) | "Buy this dossier for $2.99" + pill | "Buy this dossier" + pill |
| anon button `title` | "Buy this dossier as a PDF for $2.99. No account required." | unchanged (the price stays reachable) |
| saved, unpurchased button (SettlementDetailActions), label and `title` | `buySaved.cta` "Unlock all exports for this settlement · $2.99" + pill | `buySaved.cta` "Unlock all exports for this settlement" + pill |
| ExportUnlockDialog title | `buySaved.cta` with `{price}` → "… · $2.99" | `buySaved.dialogTitle` "Unlock all exports for this settlement · {price}" → "… · $2.99" (the text does not change) |
| the pill | "Available at launch", once, inside each button | unchanged. Still the one place on these buttons. |

The price stays everywhere a buyer sees it before paying: the dialog title, the anon button's hover
title, the ladder's one-time rung description (`dossierExport.ladder.oneTime.description`), and the
pricing page. None of those changed. On both buttons, "Available at launch" already appeared only in
the pill. Once the price is gone, each button's own text is exactly its label, and the accessible name
is that label followed by the pill's words, said once. **CONFIRMED** by the pin below.

## The other controls that wear the pill (named for the chair; nothing changed)

- **NextActionRail `lockForLaunch`** (the "Edit (Cartographer)" rung, and "Export Dossier" when export
  is a purchase): `disabledReason: AVAILABLE_AT_LAUNCH` becomes the row's native `title` tooltip,
  while the pill sits on the hint line. **This duplicates the words visually (tooltip and pill).** The
  accessible description goes through `aria-describedby` to the hint, so assistive tech announces the
  reason once (PLAUSIBLE: from the accname rule that `title` is not used for the description when
  `aria-describedby` is present; not separately pinned here).
- **PurchaseModal** pack buttons (:236) and the save-card control (:296): the `aria-label` appends
  ", Available at launch" and the pill is visible inside. The `aria-label` replaces the content for the
  accessible name, so it is said once and seen once. No duplication.
- **PricingTierCards** (:283): the same `aria-label` pattern as PurchaseModal. No duplication.
- The pill alone, no second instance of the words: DossierLadderModal rungs, the ExportUnlockDialog
  "Continue to checkout", DossierSessionNotices "View plans", FaithSection, DeityAssignmentPanel
  (×2), EventComposerDeityField, SettlementCard (×2), SaveQuotaMeter, CustomContentGate (×2),
  AccountMenu, AccountAutoReloadPanel (×2), AccountSubscriptionSection (×2), AccountSeatTransferPanel
  (×2), ReferralRedeemBlocks, SettlementDetailActions' Edit upsell, WarTab, RumorsTab, LockedDestination.

## Pins

- `tests/components/launchLock.dossier.test.jsx`: both buy buttons are keyed by their labels. The new
  helper `expectLabelOnlyThenPill` checks that exactly one pill is in the button, that the button's
  own text with the pill removed is EXACTLY the label (so no "$" and no "Available at launch"), and
  that "Available at launch" appears once in the whole button. The saved button's `title` equals the
  label. A new test checks that the dialog title is still "Unlock all exports for this settlement ·
  $2.99". **Red-first CONFIRMED:** 2 failed before the fix (`Received: "Buy this dossier for $2.99"`
  and `"… · $2.99"`), all green after.
- `tests/components/buyThisDossierSaveFirst.test.jsx`: re-keyed by identity to `/^buy this dossier$/i`,
  and the price is now checked on the button's `title`.
- `tests/components/actionsPanelRelocation.test.jsx`: its dialog-title pin
  (`/… · \$2\.99/`) holds unchanged. CONFIRMED green.

## Doors

- Copy walkers `tests/copy/*` green (the new key goes through `t()`; en.js is the only locale).
  Component, launch-pill and phone-floor suites green (`dossierPhoneFloorAllViews`,
  `phoneChromeFloor.census`, `launchPillHostWrap`, `buttonLaunchSkin`). Row height is unchanged at
  phone width, because the label only got shorter.
- The generator deltas: no generator, PDF or prose code was touched. `tests/property` (golden master,
  dormancy fences, herald desk golden, dossier prose manifest), `tests/pdf` and
  `presetLightingWitness` are green at the tip, so gm 0/525, fence 0/360, herald 0, prose 0/1,050,
  witness 0, pdf 0. CONFIRMED by the suites passing, not by a row diff. The one red file there,
  `editCorpusRatchet` (4 tests), is red identically at the parent in a clean worktree, so it is
  inherited.
- `tests/lint` at the tip against the parent: the same inherited reds (domainAnyCastBaseline,
  mutationCoverageManifest, negativeAssertionAnchor, proseWiringCensus). `ledgerCitationIntegrity` was
  red only because the ledger branch was missing locally and is green after `git fetch origin
  review-fixes-2026-07-08`. My own two bare `not.toMatch` lines were struck before commit, because the
  exact `toBe(label)` already covers them. The lighting census was refrozen by its ritual
  (titles 28,695 → 28,696, the one new test), as its own commit.
- The source-citation roster: `dated` +1 for this record.
