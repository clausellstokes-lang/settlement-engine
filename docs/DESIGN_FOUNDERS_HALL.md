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
  and belongs to the CHAIR, not the holder — MINTED IN SEATING ORDER and shown
  on every plate, even though display order is not numeric (below). Held chairs
  show the founder's chosen display (opt-in name; otherwise the numeral alone —
  "Seat XVII is held" is already grand). Every chair is invitational; there is
  no purchasable class and the hall never implies one.
- **DISPLAY LAW (owner orders 2026-08-02, superseding the open-chair rhetoric):**
  the roll renders HELD CHAIRS ONLY — an unfilled slot does not appear at all;
  the Hall looks complete at every stage of its life (three founders is a hall
  of three, never a hall of twenty-seven vacancies). ORDER IS ALPHABETICAL by
  display name; numeral-only chairs follow the named, in numeral order (chair
  ruling, vetoable). Scarcity lives in the counter and the Request letterbox,
  never in vacant pedestals.
- **THE BIO DRAWER (owner order 2026-08-02):** clicking a founder's card opens
  a RIGHT-SIDE PANEL with the founder's bio — OPTIONAL, written and updated by
  the founder from Account ▸ Profile (a Founder block that exists ONLY when the
  account holds a chair — the presence discipline). The bio is authored-public
  text: the civility guard's BLOCK mode runs on save; an authored length band
  keeps plates from becoming blogs; it rides the SAME single display-identity
  opt-in as name and image (one consent, everywhere); the drawer is
  keyboard-reachable (card = button; Escape closes; focus returns) and renders
  the §2b register in miniature.
- **ROLE RINGS (owner order 2026-08-02 — roles and chairs COEXIST):** a founder
  who is also staff wears the role as a ring around the plate: BLUE for
  Developer, PURPLISH-PINK for Admin — named tokens (`founderRingDeveloper`,
  `founderRingAdmin`; values from the owner's two hues through tokens.js — the
  no-raw-color law holds even here), visually distinct from the ceremonial gold
  so staff marks never read as purchasable prestige. Role is what you are to
  the product; the chair is an honor you hold; the two compose without
  collision and the ring is the composition made visible.
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
  legibility ladder holds (glance: how many chairs are held, of thirty;
  sentence: any chair's line; table: the roll).

## §2b THE GRANDEUR SPEC (owner emphasis: "still make the page more grand" —
## the ceremony is architecture, not decoration; every element token-derived)
- **THE HALL IS ENTERED, NOT LOADED.** The route opens on a dark ceremonial
  field (the house artwork register at its most formal) and the thirty chairs
  RESOLVE into place as the page settles — one restrained reveal, once per
  visit, honoring prefers-reduced-motion with a dignified static composition
  (the reduced experience is a different grandeur, never a lesser one).
- **A CHAIR IS AN OBJECT, NOT A LIST ROW.** Each chair renders as an
  illuminated plate — the wax-seal motif the pricing artwork already speaks —
  numeral engraved, gold-on-dark. [SUPERSEDED 2026-08-02 by the §2 display
  law: unfilled chairs no longer render at all — the unlit-chair rhetoric
  retires; the plates that exist carry the whole ceremony, and the roll only
  ever grows. Scarcity lives in the counter and the letterbox.]
- **A held chair opens to its plate:** the name (or the numeral standing
  alone, set just as formally), and the seating date in the covenant's own
  tense ("Seated MMXXVI"). The optional founder-authored dedication line
  stays PARKED (§9.3) — the plate's design reserves the space for it.
- **THE COVENANT is an illuminated document block** — the treaty-artifact
  aesthetic the product already owns (a treaty renders as a document a DM can
  read; the covenant is the house's own treaty with its founders, rendered by
  the same discipline).
- **Typography and color:** the serif display register at full formality; the
  roll set like a charter, not a table; every value from tokens (the A-9 law —
  grandeur through restraint; the no-raw-color lint applies to the hall like
  any surface). No gradients-of-the-week, no glow effects: candlelight, not
  neon.
- **THE LADDER HOLDS EVEN HERE:** glance — how many chairs are held, of thirty;
  sentence — any plate read aloud; table — the roll as a real, screen-reader-
  honest list beneath the ceremony (the hall is never the only path to the
  facts). Lazy route, zero eager bytes, the artwork under the image-weight
  discipline.

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
- **THE REMOVAL VERB (owner order 2026-08-02 — "an admin could remove them,
  but this is ceremonial and we don't know what happens"):** REMOVE CHAIR
  exists, admin-only, TWO-KEY like issuance (symmetric stakes), audit-rowed.
  Its DOWNSTREAM is deliberately under-ruled per the owner's own words —
  recorded defaults, vetoable, until the first removal (if ever) forces the
  ruling: the entitlement leaves with the chair; remaining chairs never
  renumber; the removed chair simply stops rendering (no tombstone); whether
  a vacated numeral re-issues or retires forever is PARKED (§10). One
  dividend arrives free: the Request letterbox's presence derives from the
  live ledger, so a removal reopens it with zero code changes. The §2b
  permanence law rewords to the new truth: chairs are never TRADED — the
  owner's ceremonial hand was never bound by it.
- **TRANSFERS ARE ABOLISHED (owner order):** no post-acceptance transfer path
  exists. RETIREMENT WORK ITEM: the founder-transfer machinery (code-complete,
  key-inert, never legally activated — migration 160's cases, the transfer
  flows, founderLineage's transfer arcs) is RETIRED ENTIRELY — ⚠️ the
  op-retirement cascade checklist applies (the recorded five-frozen-artifacts
  hazard; dry-run every anchor), and the retirement is its own commit with the
  capability atlas and any advertising surface swept (the sweep includes
  DESIGN_GALLERY_SHOWCASE §2/G-A-3's founder-transfer badge arm — cross-noted
  there 2026-08-02, self-audit). The legal sign-off gate
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

## §5b THE REQUEST FOR A CHAIR (owner order, same session: "claim a founder
## seat" becomes "request a founder seat" — a letter, not a purchase)
- **The path:** wherever the old claim/purchase control lived (the pricing
  Founder card + the Hall itself), the CTA becomes **"Request a chair"** — it
  opens a guided letter that files into the ONE support queue (the same
  Feedback & support channel; a `founders_request` tag rides the pre-typed
  subject — "Founders' Hall — a request for a chair" — so the §4 admin panel
  filters them without any new system).
- **THE LETTER IS THE FORM, AND THE FORM IS THE FILTER (owner intent:
  aspirational, never transactional):** two prompts, written in the covenant's
  register — *why do you wish to be a founder*, and *what would holding a
  chair mean* — framed around what a founder IS (a patron whose name the Hall
  keeps for as long as SettlementForge runs), never around what a founder
  GETS. No price anywhere. No "apply now." No reach/audience/follower fields —
  even though chairs will often go to prominent DMs, the FORM must not smell
  like an influencer application; the owner can read standing from a letter,
  and the letter format itself selects: transactional forms attract
  transactions, letters attract believers.
- **EXPECTATION HONESTY (binding copy law):** the surface says plainly that
  chairs are few, invitations are rare, and a letter may not be answered with
  a chair — no queue positions, no status tracker, no implied timeline. One
  promise only, and it must be TRUE: every letter is read.
- **Mechanics:** signed-in required (an honor needs a bearer; anonymous
  visitors see the CTA and are asked to sign in first); ONE open request per
  account with a long resubmission band after closure; the CIVILITY GUARD's
  block mode runs on the letter body (authored-public-class text aimed at a
  human reader); the letter lands as a normal support ticket — the invitation
  itself, if one ever follows, still flows ONLY through the §4 two-key admin
  issuance (a request grants nothing and shortcuts nothing).
- **THE BUTTON DISAPPEARS WITH THE LAST CHAIR (owner order, same session):**
  when the seat ledger reads thirty held, the Request CTA is ABSENT — not
  disabled, absent (the presence discipline) — everywhere it renders, and the
  surfaces state the completed truth in the covenant register ("The Hall is
  full — thirty chairs, thirty names"). Presence derives from the SAME ledger
  read as the counter (one truth), so if a chair were ever freed by the
  parked mistake-window path or account deletion, the letterbox reopens by
  itself with no code change. Open letters at fill-time are answered with
  grace, not silence (the closure note is written in the same register).
- **Pins:** the tag filter surfaces requests in the admin panel; one-open-
  request enforced; the guard runs; the anonymous path lands on sign-in and
  returns to the letter afterward; AND the presence pin — held==30 renders no
  Request control anywhere and the full-hall line renders in its place;
  held<30 restores it (both arms, one ledger fixture).

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
- PERMANENCE: no code path REASSIGNS a granted chair's holder (the
  never-traded structural pin — walk the entitlement writers and assert the
  absence; the negative case pins hardest). The two-key REMOVE verb VACATES,
  never reassigns — asserted in the same walk.
- DISPLAY LAW: the roll renders held chairs only, alphabetical among named,
  numeral-order after; zero unfilled slots in the DOM (both arms on one
  ledger fixture).
- THE BIO: guard-blocked on save, band-bounded, absent without the identity
  opt-in, drawer keyboard-reachable, and editing exists only for
  chair-holding accounts (presence pin on the Account block).
- ROLE RINGS: developer/admin founders render their ring from the named
  tokens; a non-staff founder renders none; a staff non-founder renders
  nothing here at all (three arms, one fixture).

## §8 ACTIVATION GATES (unchanged by this design)
The founder-transfer lane is RETIRED (owner order — see §4); its legal gate
closes as resolved-by-removal. The invite covenant's terms language joins the
same legal-review packet as the refund rewrite (and now states plainly: chairs
are personal and non-transferable).
Seat-ledger schema changes (the invited class, invites table) join the
migration train per deploy law. ⚠️ Build-time check: reconcile with
src/config/firstHundred.js (an existing early-supporter config whose
relationship to the thirty must be stated, not discovered) [count fixed
2026-08-02 (self-audit) — "the fifty" was a relic of the superseded seat
total].

## §9 Parked owner calls
1. The hall's name (working: The Founders' Hall).
2. Public indistinction of invited chairs (chair default: indistinct).
3. Whether the hall shows world-flavor per chair (a founder may bind their
   chair to a settlement name from their own world — deferred; charming but
   new consent surface).
