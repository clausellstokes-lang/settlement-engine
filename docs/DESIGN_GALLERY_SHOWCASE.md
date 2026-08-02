# DESIGN — GALLERY TIER BADGES + THE SPONSORED SHOWCASE

## Fable 5 architecture, 2026-08-01, from owner dictation (far-future feature, designed
## exhaustively now by owner order). Status: PARKED DESIGN — activation is owner-gated
## (money surface + legal review + migration train). Implementation = the external
## implementer, when sequenced. Nothing here builds until the owner opens it.

## §0 The owner's rulings (verbatim intent, binding)
1. Optional tier tags on gallery items, Wanderer → Cartographer → Surveyor → Founder,
   with INCREASING PROMINENCE; unique tags for Admin and Developer.
2. One tag class held for SPONSORED — the most prominent. When populated, sponsored
   items feature in their own SMALLER SECTION at the very top of the gallery,
   distinguished from everything else by a border line.
3. Only developers/admins can CREATE or EDIT sponsored entries; once published,
   anyone can view, comment, and import them (import per existing premium gating).
4. Sponsored entries carry INCREASED TELEMETRY and analytical scans — these exist
   for paying sponsors whose worlds we portray as advertisement.
5. Sponsored entries carry a LINK or PURCHASE BUTTON redirecting to the sponsor's
   site. They remain importable and fully functional gallery items.
6. Gallery gains sections for SETTLEMENT, MAP, and CAMPAIGN — a section does not
   render until it is populated.

## §1 THE TWO INTEGRITY RULINGS (the design's spine; everything else is furniture)
- **R-G1 — RANKING IS TIER-BLIND.** Badges affect the PRESENTATION of a card (the
  chip's richness), never sort order, never discovery weight, never search. The
  moment a paid tier buys visibility inside the organic flow, the gallery's trust
  is spent. Prominence lives in the pixel, not the algorithm. PINNED: the gallery
  ordering function's inputs enumerate zero tier/badge fields (a source-scan
  walker, the no-hidden-governor idiom pointed at ranking).
- **R-G2 — SPONSORSHIP IS QUARANTINED AND LABELED.** Sponsored items appear in the
  bordered top section ONLY while sponsorship is active — never double-placed into
  the organic flow (no ad-crowding; the section IS the disclosure boundary). The
  section label says SPONSORED in plain language (the ad-disclosure norm: clear
  and conspicuous). When sponsorship expires, the item reverts to a normal gallery
  item in its organic section, badge and CTA gone. An expired ad never haunts.

## §2 Two different things wearing one word (model them separately)
- **IDENTITY BADGES** (Wanderer…Founder, Developer, Admin) are a property of the
  AUTHOR, derived at READ TIME from the author's live profile (tier join) — never
  stamped at publish, so a badge can never lie (a lapsed subscriber's badge
  downgrades itself; Founder is lifetime and never lapses). Display is OPT-IN:
  one `showTierBadge` boolean chosen at publish, per item (the badge is a flex,
  never a caste mark — free users who don't want the plain chip simply don't
  show one, and the default is OFF for Wanderer, ON for Founder/Developer/Admin,
  owner-tunable).
- **SPONSORSHIP** is a property of the CONTENT — a record attached to a gallery
  item, admin/developer-writable only:
  ```
  sponsorship: { sponsorName, url, ctaLabel, startsAt, endsAt,
                 createdBy (admin id), active (derived from window) }
  ```
  It composes with (never replaces) the item's normal fields; `curated` remains
  the separate free editorial flag (an item may be both; sponsored placement
  governs while active).

## §3 The prominence ladder (closed vocabulary; finite semantics; tokens only)
`badgeClass ∈ { wanderer, cartographer, surveyor, founder, developer, admin,
sponsored }` — a CLOSED enum, each mapping to an authored chip treatment in
design tokens (no-raw-color law; the ladder's visual weights are a token table,
tuned in data): plain chip → tinted → tinted+icon → gold+icon (Founder) →
the forge-mark treatments (Developer/Admin, visually distinct from ALL paid
tiers — staff marks must never read as a purchasable rank) → the sponsored
treatment (richest, and legal only inside the bordered section). Every badge
carries an accessible name (never color-only); every badge is a real word a
first-time visitor understands or a `title=` gloss away from one.

## §4 The sections framework (settlement / map / campaign / sponsored)
- One rule for ALL sections including sponsored: A SECTION RENDERS ONLY WHEN
  POPULATED (the empty-state law; no dead shelves). The sponsored section, when
  populated, sits above everything, smaller, separated by the border line the
  owner specified.
- `galleryItemKind ∈ { settlement, map, campaign }` — closed enum. Settlement
  exists today; MAP items arrive with the cartography export lane (TC-8's
  gallery lane is the natural producer); CAMPAIGN items are the largest future
  lane (a shared campaign is a world with save-shape, audience projection, and
  import semantics of its own — its OWN design doc when its day comes; this
  framework only reserves its shelf). The section chrome ships once; content
  classes populate shelves as their lanes land.

## §5 The sponsored lifecycle (admin-curated showcases, NOT an ads marketplace)
- **SCOPE FENCE (binding):** no self-serve ad platform, no auction, no campaign
  manager, no sponsor dashboard v1. Sponsorships are hand-sold, invoiced
  offline, and entered by an admin — a dozen a year, each walk-checked. The
  fence is what keeps this affordable; revisit only on owner order.
- Create/edit: admin+developer roles only (RLS role check on the write path;
  the existing role vocabulary User/Admin/Developer). The sponsor's world must
  be a REAL engine artifact passing every normal gallery gate (moderation,
  promotion-contract human evidence) — on this platform an advertisement is a
  playable truth, which is the brand made literal.
- The CTA: `url` is validated + pinned at entry (https only, no redirect
  chains at entry time), rendered with `rel="sponsored noopener"` and
  target=_blank; the label is the sponsor's ("Visit", "Purchase") from a small
  closed set. No free-form URL ever renders as a button from user input —
  admin-only writes make this structural.
- Expiry: `endsAt` passes ⇒ active derives false ⇒ item reverts organic (R-G2);
  the section disappears when its last active sponsorship lapses.

## §6 Telemetry (the sponsor's report, the user's consent)
- Rides the EXISTING analytics events registry + consent architecture
  (profiles.telemetry_consent; the durable outbox): new event kinds
  `gallery_sponsored_impression` (section-visible / card-visible),
  `gallery_sponsored_cta_click`, `gallery_sponsored_import`. Consent-gated like
  every event; users who declined telemetry are simply absent from counts.
- Sponsor reporting is AGGREGATE-ONLY (counts, never user identities), rendered
  in an admin-only view; nothing new is collected about users — the "increased
  telemetry" is increased ATTENTION to existing event classes on these items,
  not new surveillance. This sentence is the privacy posture; keep it true.
- The intent-atlas law extends: showcase telemetry informs BUSINESS decisions,
  never engine math, never ranking (R-G1 would be violated by a
  popularity-feeds-placement loop).

## §7 Import semantics (the ad does not follow the content home)
Sponsored items import exactly like any gallery item (premium gating unchanged).
AT IMPORT: sponsorship metadata is STRIPPED — the user's library never renders a
sponsor's CTA (their library is theirs); a provenance line survives ("imported
from the Sponsored Showcase · <sponsorName>", honest history, no live link
button). PINNED with a JSON-round-trip import test: no `sponsorship.url` ever
reaches library persistence.

## §8 Legal + trust (the activation gate's checklist, recorded now)
- Sponsored-content disclosure: the labeled bordered section is the mechanism;
  the label text gets legal review at activation (jurisdictional ad-disclosure
  norms), alongside sponsor contract templates and the outbound-link policy.
- The "Simulated, not AI-generated" trust line and sponsorship must never blur:
  a sponsored WORLD is still a real deterministic world; if a sponsor wants
  content the engine didn't generate, the answer is no (brand law).
- Founder/staff badge integrity: Developer/Admin marks are never sellable and
  never visually confusable with paid tiers (§3).

## §9 Phasing (each phase independently shippable; only G-C is money-gated)
- **G-A — IDENTITY BADGES:** the read-time tier join, `showTierBadge`, the chip
  ladder, R-G1's ranking walker. Cheap, no schema beyond the boolean, no legal.
- **G-B — THE SECTIONS FRAMEWORK:** kind enum + render-when-populated shelves +
  the (empty, dormant) sponsored section chrome behind its population check.
- **G-C — SPONSORED (owner-gated activation):** the sponsorship record +
  migration (joins the train per deploy law), admin write surface, CTA, the
  telemetry events, the import-strip pin, legal checklist §8. Far future by
  owner's own framing; this doc is so that day is an execution, not a design.

## §10 Open owner calls (parked with the design)
1. Badge display default per tier (proposed: off for Wanderer, on for staff).
2. Whether Surveyor (AI early-access) belongs on the public ladder at all, given
   the voice doctrine keeps "AI" out of product language — the badge could read
   as the one place the product says the quiet part. Proposed: Surveyor shows
   the same chip as Cartographer publicly (private tier, public modesty).
3. The sponsored section's name in the house voice ("The Sponsored Shelf" /
   "Patrons of the Realm" / plain "Sponsored") — legal wants plain; voice wants
   world; the label likely needs both ("Sponsored · Patrons of the Realm").
