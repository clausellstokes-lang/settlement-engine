# DESIGN — THE FOUNDERS' HALL (the Founder seat made grand)

## Fable 5 architecture, 2026-08-02, from owner dictation ("make the founder seat more
## GRAND — think of it like a hall of fame place; reserve an additional 20 seats, to a
## total of 50, invite only, and add it to the page"). Implementation = the external
## implementer. Paid-surface change owner-authorized by the order itself; activation
## gates in §8 stand.

## §0 The owner's orders (verbatim intent, binding)
1. The Founder presence becomes GRAND — a hall-of-fame place.
2. TWENTY additional seats are reserved beyond the current thirty — FIFTY total —
   and the twenty are INVITE ONLY.
3. It lands on the page.

## §1 THE INTEGRITY RULING (first, because a shipped promise is at stake)
The live pricing copy promises: "When the {seats} seats are gone, the charter
closes. The cap never reopens." That sentence STAYS TRUE: **the purchasable
charter remains exactly thirty and never reopens.** The twenty new seats are a
DISTINCT HONORARY CLASS — THE INVITED CHAIRS — which were never part of the
purchasable charter and never will be: they cannot be bought at any price, an
unclaimed invitation returns to the reserved pool and NEVER converts to sale
(converting one would falsify the shipped promise; treat it as near-forbidden —
it would take an explicit owner order AND a public copy amendment together).
Scarcity stays honest in both directions: nothing reopens, nothing quietly grows.

## §2 THE HALL (the grand surface)
- A dedicated public route — **The Founders' Hall** (working name, owner may
  rename) — deep-linkable, linked from the pricing Founder card and the About
  journey. Not a modal, not a section: a place.
- **FIFTY NUMBERED CHAIRS, Roman numerals I–L.** The seat number is permanent
  and belongs to the CHAIR, not the holder. Held chairs show the founder's
  chosen display (opt-in name; otherwise the numeral alone — "Seat XVII is
  held" is already grand). Open charter chairs stand honestly open ("Seat
  XLII stands open"). The twenty invited chairs render as reserved without
  advertising WHICH twenty ("held for invitation" as a count, never a list —
  no public map of who might be invited).
- **LINEAGE IS THE GRANDEUR** (and founderLineage.js already exists): a chair
  carries its history — "Seat IX · held by NAME · first held by NAME" — so a
  legally-transferred seat deepens the hall instead of eroding it. The chair
  persists; holders pass through it. This is THE PROMISE applied to patronage:
  a seat is a seat, forever.
- **THE COVENANT** renders beside the roll: what a founder receives, in the
  house voice, permanent tense ("Everything Cartographer runs, for as long as
  SettlementForge runs"). One surface states the deal; the hall embodies it.
- Register: the ceremonial gold treatment, token-derived (the A-9 palette
  discipline — grandeur through restraint, no foreign color world); the
  legibility ladder holds (glance: fifty chairs and how many stand open;
  sentence: any chair's line; table: the roll).

## §3 ENTITLEMENTS + STANDING (one tier, two doors)
- Invited founders receive IDENTICAL entitlements to charter founders — one
  Founder tier, two doors in. **On the roll, a founder is a founder**: no
  public purchased/invited distinction (chair ruling, vetoable — equality is
  the grander form; the internal ledger records provenance `charter|invited`
  for accounting and nothing renders it).
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
- Post-acceptance, invited seats ride the EXISTING founder-transfer machinery
  unchanged — including its standing LEGAL SIGN-OFF activation gate; nothing
  here loosens it.

## §5 THE PAGE (the pricing card upgrade)
- The Founder card gains: the live counter — "{remaining} of 30 charter seats
  remain · 20 chairs held for invitation" — reading the REAL seat ledger
  (founderSeats.js; never a hardcoded number; no fake scarcity, ever), and
  the hall link ("Visit the Founders' Hall").
- The existing {seats} copy templates keep resolving to THIRTY on every
  charter surface (the promise's number); the fifty appears only in
  hall-vocabulary sentences that name both classes honestly.

## §6 PRIVACY + CONSENT
Display name is opt-in at acceptance and changeable any time (Account ▸
Profile); numeral-only is the default and is presented as equally honored,
not as a fallback. No email, no PII, ever, anywhere on the roll. Consent
withdrawal reverts the chair to numeral-only immediately.

## §7 PINS (the hall lies never)
- COUNTER TRUTH: rendered counts equal the seat ledger, pinned (charter
  remaining + invited held + open = 50, exactly, always).
- INVITED-NEVER-SOLD: structural pin — the purchase path cannot allocate a
  chair from the invited pool under any ledger state (the negative case pins
  hardest, per house discipline).
- CAP COPY: the charter surfaces' {seats} resolve to 30, pinned against the
  copy keys (the shipped promise is a tested sentence).
- CONSENT: no name renders without its opt-in flag; withdrawal round-trips.
- LINEAGE: a transfer preserves the chair numeral and appends, never
  rewrites, the holder history (JSON-round-trip + the transfer fixture).

## §8 ACTIVATION GATES (unchanged by this design)
Founder transfers stay legal-gated (the standing memory: code-complete,
key-inert, LEGAL SIGN-OFF is the activation gate). The invite covenant's
terms language joins the same legal-review packet as the refund rewrite.
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
