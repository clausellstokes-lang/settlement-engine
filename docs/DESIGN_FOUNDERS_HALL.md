# DESIGN — THE FOUNDERS' HALL (the Founder seat made grand)

## Fable 5 architecture, 2026-08-02, from owner dictation ("make the founder seat more
## GRAND — think of it like a hall of fame place; reserve an additional 20 seats, to a
## total of 50, invite only, and add it to the page"). Implementation = the external
## implementer. Paid-surface change owner-authorized by the order itself; activation
## gates in §8 stand.

## §0 The owner's orders (verbatim intent, binding — SUPERSEDED SAME SESSION, see below)
1. The Founder presence becomes GRAND — a hall-of-fame place.
2. ~~Twenty additional invite-only seats to fifty total~~ **SUPERSEDED by the
   owner within the hour: "founder seats are ALL only invite only. They can't
   be purchased. But they still show in the pricing page... I want to be
   selective and use them as a marketing strategy rather than a quick money
   grab — such as prominent DMs. Limit it back down to 30."**
3. FINAL SHAPE: **THIRTY CHAIRS, ALL BY INVITATION, NONE SOLD, EVER** — the
   Founder card remains on the pricing page as a prestige artifact with no
   purchase path. The hall is a marketing asset (prominent DMs, community
   pillars), not a revenue lane.

## §1 THE INTEGRITY RULING (rewritten at the pivot)
**The purchase class is ABOLISHED before it ever sold.** The live pricing copy
("one payment", "when the {seats} seats are gone, the charter closes", the
seats-remaining counters, the FAQ purchase answer) describes a sale that will
now never exist — it is REWRITTEN, not preserved: this is safe exactly because
the product is pre-launch and no seat has been sold (⚠️ VERIFY AT BUILD against
the seat ledger + purchase history; if any seat was ever sold — test purchases
included — those holders are grandfathered as full chairs and the copy notes
nothing). ENUMERATED COPY SURFACES that change together: pricingPage.js
(sustainability / capNote / seatsRemaining / seatsFallback / the lifetime FAQ),
the landing tier card ("One payment, no clock" dies), tierFacts.js, and any
checkout surface that lists a Founder price. STRUCTURAL PIN replacing the old
one: **no purchase path to Founder exists** — no Stripe price, no checkout
branch, no entitlement route except the admin grant lane; the pin walks the
billing config and asserts the absence. Scarcity stays honest: thirty chairs,
a chair is granted or open, and the counter never implies a sale.

## §2 THE HALL (the grand surface)
- A dedicated public route — **The Founders' Hall** (working name, owner may
  rename) — deep-linkable, linked from the pricing Founder card and the About
  journey. Not a modal, not a section: a place.
- **THIRTY NUMBERED CHAIRS, Roman numerals I–XXX.** The seat number is permanent
  and belongs to the CHAIR, not the holder. Held chairs show the founder's
  chosen display (opt-in name; otherwise the numeral alone — "Seat XVII is
  held" is already grand). Open chairs stand honestly open ("Seat
  XXIV stands open — the Hall invites"). Every chair is invitational; there
  is no purchasable class and the hall never implies one.
- **PERMANENCE IS THE GRANDEUR (owner order, same session: seats are NOT
  traded — that piece is removed entirely):** a chair is bound to its founder
  PERMANENTLY — "Seat IX · NAME" is a sentence that will never change. One
  holder per chair, ever. No transfers, no market, no inheritance mechanics —
  an honor is personal, and the hall's promise is that the roll only ever
  grows more true. This is THE PROMISE applied to patronage in its strongest
  form.
- **THE COVENANT** renders beside the roll: what a founder receives, in the
  house voice, permanent tense ("Everything Cartographer runs, for as long as
  SettlementForge runs"). One surface states the deal; the hall embodies it.
- Register: the ceremonial gold treatment, token-derived (the A-9 palette
  discipline — grandeur through restraint, no foreign color world); the
  legibility ladder holds (glance: thirty chairs and how many stand open;
  sentence: any chair's line; table: the roll).

## §3 ENTITLEMENTS + STANDING (one tier, two doors)
- One tier, ONE DOOR: every founder is invited; entitlements are everything
  Cartographer runs, forever (the covenant's language survives; only the
  payment sentence dies). The internal ledger records provenance
  `invited|grandfathered` (the latter only if the build-time sale check in §1
  finds any).
- The gallery standing badge (DESIGN_GALLERY_SHOWCASE) composes unchanged —
  founders carry the gold mark; the hall link can ride the badge's tooltip.

## §4 THE INVITATION MACHINERY (admin-held, two-key)
- **THE ADMIN SURFACE (owner order, same day):** the Admin page (role-gated to
  admin) gains a FOUNDERS' HALL PANEL: issue an invitation **to an email
  address or to an existing account** (account lookup by handle/email), see
  the outstanding-invites table (chair pool status · issued · expires ·
  accepted/expired/revoked), and REVOKE an unaccepted invite (returns to the
  reserved pool). ISSUANCE runs the two-key discipline (a founder-grade grant
  is the highest-stakes admin verb this product has; viewing is single-admin);
  every issue/revoke/accept writes an audit row.
- **Two delivery routes, one acceptance:** to an ACCOUNT — in-app notice +
  email; to an EMAIL — the invitation letter (the emailTemplates lane, written
  in the covenant's own register — this email is the first artifact of the
  honor, write it like one) carrying an acceptance link that routes through
  sign-in/sign-up and lands on the SAME covenant-acceptance step. One
  acceptance flow regardless of door.
- Invitations are issued through the admin two-key discipline (the
  founders-roll admin precedent): an invite record {chairNumeral, inviteeRef,
  issuedBy, issuedAt, expiresAt}, non-transferable before acceptance,
  expiring back to the reserved pool.
- Acceptance = authentication + explicit covenant acceptance ⇒ the seat GRANT
  flows through a named ADMIN-GRANT ENTITLEMENT LANE (new work: the Founder
  entitlement minted without payment — the Stripe webhook is not involved;
  the grant writes the same seat ledger the purchase path writes, one seat
  truth). No payment fields, no checkout theater, for an honor.
- **TRANSFERS ARE ABOLISHED (owner order):** no post-acceptance transfer path
  exists. RETIREMENT WORK ITEM: the founder-transfer machinery (code-complete,
  key-inert, never legally activated — migration 160's cases, the transfer
  flows, founderLineage's transfer arcs) is RETIRED ENTIRELY — ⚠️ the
  op-retirement cascade checklist applies (the recorded five-frozen-artifacts
  hazard; dry-run every anchor), and the retirement is its own commit with the
  capability atlas and any advertising surface swept. The legal sign-off gate
  becomes moot for founders and is closed as RESOLVED-BY-REMOVAL in the queue.

## §5 THE PAGE (the pricing card, purchase-free by design)
- The Founder card STAYS on the pricing page — prestige is the product being
  sold to everyone ELSE on that page — with NO purchase button: its CTA is
  "Visit the Founders' Hall" and its badge line reads the invitation truth
  ("Thirty chairs · by invitation"). THE PRECEDENT IS ALREADY SET tonight:
  the Surveyor card carries "See the task menu" instead of a buy button —
  the pricing page now has two non-purchase cards and one grammar for them.
- The live counter reads the REAL seat ledger ("N of thirty chairs held" —
  founderSeats.js; never hardcoded; no fake scarcity, ever).
- MARKETING NOTE (the owner's stated intent, recorded): chairs are offered
  selectively — prominent DMs, community pillars — as a standing marketing
  instrument; the hall converts a one-time revenue pool into a permanent
  credibility asset, which matches the experience-first doctrine exactly.

## §6 PRIVACY + CONSENT
Display name is opt-in at acceptance and changeable any time (Account ▸
Profile); numeral-only is the default and is presented as equally honored,
not as a fallback. No email, no PII, ever, anywhere on the roll. Consent
withdrawal reverts the chair to numeral-only immediately.

## §7 PINS (the hall lies never)
- COUNTER TRUTH: rendered counts equal the seat ledger, pinned (held + open
  = 30, exactly, always).
- NEVER-SOLD: structural pin — no billing config, checkout branch, or
  entitlement path reaches Founder except the admin grant lane (the negative
  case pins hardest, per house discipline).
- COPY: no surface says "payment", "buy", "remaining for sale", or a price in
  the same breath as Founder — pinned against the rewritten copy keys.
- CONSENT: no name renders without its opt-in flag; withdrawal round-trips.
- PERMANENCE: no code path reassigns a granted chair's holder (the
  never-traded structural pin — walk the entitlement writers and assert the
  absence; the negative case pins hardest).

## §8 ACTIVATION GATES (unchanged by this design)
The founder-transfer lane is RETIRED (owner order — see §4); its legal gate
closes as resolved-by-removal. The invite covenant's terms language joins the
same legal-review packet as the refund rewrite (and now states plainly: chairs
are personal and non-transferable).
Seat-ledger schema changes (the invited class, invites table) join the
migration train per deploy law. ⚠️ Build-time check: reconcile with
src/config/firstHundred.js (an existing early-supporter config whose
relationship to the fifty must be stated, not discovered).

## §9 Parked owner calls
1. The hall's name (working: The Founders' Hall).
2. Public indistinction of invited chairs (chair default: indistinct).
3. Whether the hall shows world-flavor per chair (a founder may bind their
   chair to a settlement name from their own world — deferred; charming but
   new consent surface).
