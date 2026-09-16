# DOM / DOM-3 — the founder purchase path, abolished

- **Status:** LANDED
- **Landed at:** `cea076f5`
- **Verified base:** `claude/composite-r4` at `30638bb77f188a6bc4a8017bc53c74b63a05cb71`
- **Train:** `dom`, family **DOM**, member **4** in landing order and LAST BY DESIGN, so the
  train's prefix stands lawful if this member stops. Promoted only after DOM-4 flipped LANDED
  and released `src/copy/en.js`.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§115.1** (J-TC22-4/5/6/7 signed) · **§115.2**
  (the member HELD on an owner-side precondition) · ⭐⭐ **§118** (the owner's never-sold
  attestation, 2026-08-15, verbatim: "also no founder seats have been sold as of this date. so
  remove the $99 purchase button.").
- **Design of record:** `docs/DESIGN_FOUNDERS_HALL.md` §1/§5/§5b.
- **Compile of record:** `laneTC22-DOM-PLAN.md` §4, annex rows DOM.M19..M29.

---

## §1 · ⛔ THE PRECONDITION, AND WHY THIS MEMBER COULD NOT HAVE LANDED WITHOUT IT

`PricingPage.jsx` carried a prior lane's deliberate deferral, in the file, in prose: abolishing
the purchase path is a paid-surface change **gated on a build-time never-sold verification
against the seat ledger and purchase history**, and "renaming the destination is not the same
act as removing the door".

That check is OWNER-SIDE and cannot be run from the repo. The available inference — migration
137 dark, `appliedHead` 121, the whole webhook train undeployed — is strong and is **NOT the
verification**, because DESIGN_FOUNDERS_HALL §1 forks on it: *if any seat was ever sold, test
purchases included, those holders are grandfathered as full chairs and the copy notes nothing*,
which is a different cure with a different copy set. Proceeding on inference would have silently
picked one branch of an owner-written fork.

⭐ The owner ran the check and attested on **2026-08-15**. The fork resolves to the NEVER-SOLD
arm; the grandfather arm is **DEAD**. The in-file note is rewritten to cite §118 rather than
deleted, so the discharge is legible where the deferral was.

## §2 · THE LIVE PURCHASE PATH, WHOLE — AND TWO SURFACES THE COMPILE DID NOT NAME

| surface | what it did |
|---|---|
| `PricingPage.jsx` charter CTA | `buy('founder_lifetime')`, `kind:'purchase'` — electable as the page's loud primary |
| `PricingBands.jsx` charter band | rendered `$99` + `one-time`, and a break-even arithmetic sentence that PRICES a chair |
| `pricingPage.js` / `en.js` / `landing.js` | the charter copy, the tier block, the FAQ, the audience lines |
| `create-checkout/index.ts` | a `founder_lifetime` PRICE_MAP row and a 30-seat sellout gate |
| ⭐ `FounderTile.jsx` | **a SECOND live checkout** on the account page, with its own `$99`, `$144` and a retry loop around the purchase |
| ⭐ `LandingBelowFold.jsx` | the marketing front door rendering **"N/30 seats left"** — scarcity vocabulary for a thing that was never on sale |

The last two are this lane's findings. The compile's §4.1 named neither.

## §3 · THE CURE

- **The CTA reads "Request a chair" and NAVIGATES to `/founders`** (J-TC22-4), where the §5b
  letterbox already ships. This satisfies the design's §5 and §5b at once, and it REFUSES the
  one shape that would cost a chunk edge: rendering `RequestChairLetter` inline would drag
  `components/founders/*` → `lib/foundersHall.js` → `lib/founderChairRequest.js` into the
  pricing chunk, and the Hall is deliberately lazy.
- ⭐ **`kind` is never `'purchase'` again, and that is load-bearing rather than cosmetic**: the
  page's loud-primary selector requires `kind === 'purchase'`, so the charter band can no longer
  be elected the conversion action by any code path.
- **The vocabulary converges on the Hall's.** The Hall already renders "N of 30 chairs held",
  and its covenant voice FORBIDS "remaining" as sale vocabulary. Pricing, landing and the
  account tile now say the same words as the Hall they point at. Every number stays
  interpolated from `FOUNDER_SEAT_CAP`; none is typed into copy.
- **Checkout fails closed, and the refusal is a SYMBOL** (J-TC22-5). Deleting the PRICE_MAP row
  alone already refuses with the generic 400 — but a bare absence gives an absence pin nothing
  POSITIVE to assert, and a future edit re-adding the row would silently restore the sale. So
  `ABOLISHED_PRODUCTS` is checked BEFORE the catalog. The 30-seat gate goes with the sale it
  guarded: an unreachable enforcement block is the dead-arm class.
- ⛔ **`stripe-webhook` IS NOT TOUCHED** (J-TC22-6). Its founder branches — grant, credit bonus,
  seat claim, clawback, money-spine mirror — are the INBOUND path. Refunds and replays never
  call `create-checkout`, and deleting them would strand any historical or in-flight session.
  They become unreachable in practice and remain correct, which is what the legacy-SKU pattern
  is for. The absence pin asserts they are STILL THERE.

## §4 · THE ASSERTIONS THAT PINNED THE SALE INTO EXISTENCE

Nine existing assertions required the purchase path to exist. They are cured in this member or
it reds:

| site | becomes |
|---|---|
| `contracts.test.js` "exposes founder_lifetime product" | **INVERTED** — the row is absent AND `ABOLISHED_PRODUCTS` contains it |
| `contracts.test.js` webhook founder branches ×4 | **KEPT UNCHANGED** — the inbound path |
| `founderTileRestore.test.jsx` retry re-invokes the checkout | **REWRITTEN IN PLACE**, never deleted (J-TC22-7) |
| `create-checkout/index.test.ts` founder succeeds / caps at 30 | **INVERTED** at both seat counts, plus a CONTROL that `premium` still transacts on the same harness |
| `create-checkout/index.test.ts` fail-closed / savePaymentMethod | **RE-KEYED** onto `premium` and `single_dossier` |
| `pricingPageBands.test.jsx` charter arithmetic | **RE-AIMED** at the cap; the arithmetic helper's maths is still asserted |

⚠ The tile's retry is not "rewritten to retry the navigate" as the compile drafted: a link
cannot fail, so a retry for it would be INVENTED BEHAVIOUR. The file instead pins the negative
with teeth — the checkout seam stays mocked and must never be called.

## §5 · THE ABSENCE PIN, AND ITS TWO VACUITIES

`tests/components/founderPurchasePathAbsent.test.jsx`, modelled on the Hall's own idiom:

- **Rendered arm, POSITIVE-CONTROLLED.** A rendered-surface negative passes when the surface
  never rendered — a crashed PricingPage would green every assertion. So: text length over 200,
  the charter band present, the covenant sentence present, the CTA reading "Request a chair",
  and "by invitation" on the page, before any negative is asserted.
- **Structural arm with a live symbol.** No `stripeProduct: 'founder_lifetime'`, no PRICE_MAP
  row — AND `ABOLISHED_PRODUCTS` present and CONSULTED. Each negative carries a positive
  control so it cannot pass because a whole field was renamed away.
- **The inbound arm asserts PRESENCE**, so a later sweep cannot "finish the job" by deleting
  the refund path.
- **Placement in `tests/components/`, not `tests/lint/`**, which keeps §102.3 NOT INCURRED.

## §6 · SAME-SEED POSTURE

**GENERATION-NEUTRAL, and RENDERED-COPY-CHANGING BY DESIGN.** No touched file is reachable from
the generation pipeline, feeds `worldPulse`, or is an AI-bundle input. The member changes what a
reader sees on `/pricing`, the landing tier strip and the account tile, and the commit says so
rather than letting it look silent.

## §7 · STOP CONDITIONS

1. Any founder seat is found to have EVER been sold — the member re-charters on the grandfather
   arm with a different copy set (fork DOM.U2).
2. `stripe-webhook` is edited (J-TC22-6).
3. The absence pin lands without its non-vacuity controls, or `ABOLISHED_PRODUCTS` is dropped
   for a bare deletion (J-TC22-5).
4. `founderTileRestore.test.jsx` is deleted rather than rewritten (J-TC22-7).
5. The census moves by anything other than `files` +1 with `credited`, `parked` still (DOM.U1).
6. The letterbox is rendered inline on the pricing page (J-TC22-4).
7. The seat-TRANSFER product is touched: `AccountSeatTransferPanel` and the Terms page price a
   different, owner-parked, legally-gated thing.
