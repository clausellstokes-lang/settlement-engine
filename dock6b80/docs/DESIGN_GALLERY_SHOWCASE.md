# DESIGN — GALLERY ACCOUNT-STANDING BADGES + THE SPONSORED SHOWCASE

## Fable 5 architecture, 2026-08-01, from owner dictation (far-future feature, designed
## exhaustively now by owner order). Status: PARKED DESIGN — activation is owner-gated
## (money surface + legal review + migration train). Implementation = the external
## implementer, when sequenced. Nothing here builds until the owner opens it.
##
## CORRECTED 2026-08-02 (self-audit): the whole doc re-derived against the shipped
## gallery under the chair's rulings — vocabulary renamed (tier → ACCOUNT STANDING;
## `tier` is taken and means settlement size on every gallery surface), §4 rewritten
## against the shipped tabs, the badge opt-in made a SERVER-BOUNDARY rule, the
## ordering surface pluralized into a manifest, is_featured/is_curated absorbed,
## the write path re-specced on the real admin machinery, §7 inverted around the
## provenance line, and every missing-substrate gap named as a numbered work item
## so Sol can build without inventing architecture. Owner §0 text is verbatim;
## corrections to it land as bracketed notes, never rewrites.

## §0 The owner's rulings (verbatim intent, binding)
1. Optional tier tags on gallery items, Wanderer → Cartographer → Surveyor → Founder,
   with INCREASING PROMINENCE; unique tags for Admin and Developer.
   > [VOCABULARY NOTE — CORRECTED 2026-08-02 (self-audit): `tier` is already taken in
   > the gallery and means SETTLEMENT SIZE — every gallery RPC returns `tier text`
   > (thorp…capital), GalleryCard.jsx renders `TIER_LABELS[item.tier]` as its first
   > meta chip, and galleryHubs.js mints six `/gallery/tier/:tier` hub pages from it.
   > The owner's "tier tags" therefore render throughout this design as ACCOUNT
   > STANDING badges — standing ∈ {wanderer, cartographer, surveyor, founder,
   > developer, admin} — and NO gallery surface ever says "tier" for an account.
   > The intent is unchanged; the word is. A builder who adds an account field named
   > `tier` to any gallery row shape silently collides with the size facet.]
2. One tag class held for SPONSORED — the most prominent. When populated, sponsored
   items feature in their own SMALLER SECTION at the very top of the gallery,
   distinguished from everything else by a border line.
   > [CLASS NOTE — CORRECTED 2026-08-02 (self-audit): SPONSORED is ruled a CONTENT
   > class, not an account standing — it renders its own chrome in its own shelf
   > and never joins the standing-badge enum. See §1/§3.]
3. Only developers/admins can CREATE or EDIT sponsored entries; once published,
   anyone can view, comment, and import them (import per existing premium gating).
   > [SCOPE NOTE — CORRECTED 2026-08-02 (self-audit): "comment" is true today for
   > the SETTLEMENT kind only — gallery_comments is settlement-scoped (019:
   > `settlement_id references public.settlements(id)`; `list_gallery_comments(
   > target_settlement_id uuid)`). No comment table, RPC, or component exists for
   > saved_maps, so a sponsored MAP or CAMPAIGN cannot be commented on until work
   > item G-C-3 lands (comments for saved_maps, with moderation/tombstone parity).
   > The owner's claim stands as the TARGET; the doc names the work.]
4. Sponsored entries carry INCREASED TELEMETRY and analytical scans — these exist
   for paying sponsors whose worlds we portray as advertisement.
5. Sponsored entries carry a LINK or PURCHASE BUTTON redirecting to the sponsor's
   site. They remain importable and fully functional gallery items.
6. Gallery gains sections for SETTLEMENT, MAP, and CAMPAIGN — a section does not
   render until it is populated.
   > [SUBSTRATE NOTE — CORRECTED 2026-08-02 (self-audit): the map and campaign
   > galleries ALREADY EXIST — GalleryPage.jsx ships a three-tab view switch
   > (Settlements / Maps / Campaigns) today, backed by public.saved_maps (a
   > different table from public.settlements; a campaign IS a saved_maps row with
   > share_kind='map_with_campaign', migration 045). The render-when-populated
   > rule applies to the SPONSORED shelf and any FUTURE kind's shelf, never
   > retroactively to shipped tabs (an empty shipped tab keeps its EmptyState —
   > hiding a nav tab is a different promise from hiding a shelf). §4 carries the
   > rewritten framework.]

## §1 THE TWO INTEGRITY RULINGS (the design's spine; everything else is furniture)
### (rewritten 2026-08-02, self-audit — the pins made real against the actual substrate)
- **R-G1 — RANKING IS STANDING-BLIND.** Badges affect the PRESENTATION of a card
  (the chip's richness), never sort order, never discovery weight, never search.
  The moment a paid standing buys visibility inside the organic flow, the
  gallery's trust is spent. Prominence lives in the pixel, not the algorithm.
  PINNED — and the pin is honest about where ordering actually lives: there is
  NO single "gallery ordering function". The ordering surface is PLURAL and it
  is SQL, not client source. The pin is therefore an ORDERING MANIFEST + walker
  (work item G-A-4):
  - The manifest enumerates EVERY ordering surface: `list_gallery_dossiers`
    (the relevance-scored main feed — defined in migrations 019, 063, 071, 076,
    147; NET-CURRENT IS 147, and the four stale prior definitions are recorded
    as superseded so no extractor or future edit anchors on them — the
    netCurrentExtractorAnchor hazard class), `list_gallery_maps` (its own
    ORDER BY + sort keys), `list_gallery_more_by_creator`,
    `list_my_gallery_dossiers`, `list_featured_dossiers`, `list_featured_maps`,
    `list_curated_dossiers`, the client-side `MAP_SORT_OPTIONS`
    (galleryMapsFilters.js), and the 15 hub pages in galleryHubs.js that each
    lock a sort+filter.
  - The walker asserts: (a) MANIFEST TOTALITY — a new ordering path without a
    manifest entry goes red (the registration-manifest idiom); (b) zero
    ACCOUNT-STANDING or badge fields, and zero sponsorship fields, in any score
    expression or ORDER BY of a live definition; (c) WHERE-clause MEMBERSHIP
    predicates only from an explicit allowlist — {exclude_curated (shipped,
    147), exclude_sponsored (new, G-B-3)} — quarantine is membership, never
    weight; (d) the settlement-size `tier` facet is EXPLICITLY EXEMPT (it is a
    legitimate content filter input, not an account field — the walker must not
    fire on it).
  - Grandfather note (recorded, veto open): 147's relevance score already
    carries `case when r.is_curated then 40 else 0 end` — an editorial thumb on
    the algorithm. It SURVIVES R-G1 as reframed, because R-G1's harm model is
    PAID visibility: curated is the free, disclosed, human editorial pick (the
    Curated chip), not a purchasable rank. If the owner prefers R-G1's stricter
    spirit (no algorithmic thumb at all), removing the +40 is a one-line 147
    successor — the manifest row for it makes that a named, findable decision.
- **R-G2 — SPONSORSHIP IS QUARANTINED AND LABELED.** Sponsored items appear in
  the bordered top shelf ONLY while sponsorship is active — never double-placed
  into the organic flow OR the featured set (no ad-crowding; the shelf IS the
  disclosure boundary). The shelf is a SEPARATE LABELED QUERY — it is not a
  ranking outcome, so it never touches the ordering surfaces R-G1 pins; the
  organic and featured listings exclude active-sponsored rows via the
  allowlisted `exclude_sponsored` membership predicate (mirroring 147's
  `exclude_curated` idiom). The shelf label says SPONSORED in plain language
  (the ad-disclosure norm: clear and conspicuous). When sponsorship expires,
  the item reverts to a normal gallery item in its organic place, badge-free
  and CTA-free, and its dormant featured/curated flags resume effect. An
  expired ad never haunts.
  - No predicate conflict with R-G1 remains: `sponsored` is a CONTENT class
    outside the standing-badge enum (§3), the walker forbids account-standing
    fields in organic ordering, and the shelf is its own query.

## §2 Two different things wearing one word (model them separately)
### (rewritten 2026-08-02, self-audit — renamed, and the privacy boundary made structural)
- **ACCOUNT-STANDING BADGES** (Wanderer…Founder, Developer, Admin) are a property
  of the AUTHOR, derived at READ TIME — never stamped at publish, so a badge can
  never lie (a lapsed subscriber's badge downgrades itself at the next read).
  Two corrections to the original text, both load-bearing:
  - **The derivation is NOT one join.** The ladder spans the profile row plus
    the role machinery: `STANDING_OF(author_id)` is an explicit composition
    evaluated INSIDE the SECURITY DEFINER gallery RPC —
    `profiles.role` ('developer'/'admin' → the staff marks) →
    `profiles.is_founder` (→ founder) →
    `profiles.tier` ('premium' → cartographer, 'free' → wanderer; the CHECK is
    exactly ('free','premium'), migration 001 — 139's header explicitly refused
    to widen it). Two deliberate absences: SURVEYOR is never read — 
    surveyor_entitlements is owner-read-only RLS (139: "Owner reads own
    surveyor entitlement"; `has_surveyor_entitlement()` is caller-scoped), so a
    public RPC structurally CANNOT name another user a Surveyor, and the ruling
    (§10.2, now resolved) is that Surveyor displays as Cartographer publicly.
    And SUPPORT-role accounts (the fourth role, 050) carry no staff mark — they
    derive like any account (is_founder → tier); staff marks are developer and
    admin only.
  - **Founder does not lapse with billing, but it IS transferable.** Migration
    160's finalize path runs `set is_founder = false ... where id = from_user`
    then `set is_founder = true, tier = 'premium' ... where id = to_user`, and
    the reversal path swaps them back. The read-time derivation is exactly what
    keeps the badge honest on BOTH accounts across a transfer; the transfer
    case joins the badge test matrix (G-A-3). "Never lapses" is retired as an
    invariant — nothing may cache a Founder badge or skip the downgrade path on
    the strength of it. [CROSS-DOC NOTE 2026-08-02 (self-audit):
    DESIGN_FOUNDERS_HALL §4 — owner order, later the same night — ABOLISHES
    founder transfers and orders migration 160's machinery RETIRED ENTIRELY.
    Until that retirement commit lands, 160's finalize path is in the tree and
    this derivation note stands as written; once it lands, the transfer case
    retires with the machinery (G-A-3 drops that arm). The read-time-derivation
    law itself SURVIVES either way — the admin grant lane and account deletion
    still move `is_founder`, so nothing may ever cache a Founder badge.]
- **THE OPT-IN IS A SERVER-BOUNDARY RULE, NOT A DISPLAY RULE.** Account standing
  is NOT public data anywhere today: profiles SELECT RLS is own-row-only (001),
  and the ONLY profile datum the public gallery RPCs expose is external_name
  (076, deliberately, through SECURITY DEFINER). This repo has already ruled on
  the shape (120's header): "A client-side entitlement check is a UX
  affordance, not a boundary." So:
  - The badge is computed SERVER-SIDE, inside the definer RPC, and the payload
    carries `author_standing` ONLY when the row's own opt-in flag is true —
    otherwise the column is NULL in the wire payload itself. The paid status of
    a non-opted author NEVER leaves the database. A builder who adds
    `ap.tier as author_tier` to a listing RPC unconditionally has leaked every
    listed author's commercial status to `anon` before any client filter runs.
  - PINNED (G-A-3): a pglite security test in the tests/security/galleryUnlisted*
    style — "a non-opted-in author's standing is ABSENT from the anon listing
    payload"; plus the positive arm across the whole ladder including the
    founder-transfer case.
  - **Both halves of the no-stamping law, stated plainly:** what is stored
    per-item at publish is `showStandingBadge` — the OPT-IN FLAG ONLY, i.e.
    CONSENT, chosen by the author at publish time. The badge VALUE is never
    persisted anywhere, on any row, at any time — it derives live at read from
    STANDING_OF. Consent is stamped; standing never is. That is why the flag
    can sit on the published row without violating the never-stamped law: a
    stale flag can at worst hide a badge or show a CURRENT one, never a false
    one. Storage: `showStandingBadge boolean not null default false` on BOTH
    public.settlements and public.saved_maps (no such column exists today);
    the entire existing corpus backfills FALSE (no recorded consent = no
    badge). publish_settlement (008) is re-runnable — each publish sets/updates
    the flag, so re-publish is the natural edit affordance. The publish
    dialog's checkbox DEFAULT per standing is owner call §10.1 (the stored
    value is always the author's explicit choice; only the checkbox's initial
    state is standing-dependent).
- **SPONSORSHIP** is a property of the CONTENT — a record attached to a gallery
  item, admin/developer-writable only:
  ```
  sponsorship: { sponsorName, url, ctaLabel, startsAt, endsAt,
                 createdBy (admin id), active (derived from window) }
  ```
  It composes with (never replaces) the item's normal fields. It is a CONTENT
  class with its own shelf and chrome (§3, §4) — never a standing badge.

## §2b The editorial matrix (CORRECTED 2026-08-02 (self-audit) — the spec absorbs
## the TWO admin editorial mechanisms that already ship, which the original never
## reconciled)
Three flags exist once G-C lands; two ship today. Their semantics, verbatim from
the substrate:

| flag | lives | who sets | governs | ordering effect |
|---|---|---|---|---|
| **curated** (`is_curated`, migrations 011/147) | settlements | admin/developer via `set_curated` (definer RPC + audit row) | the free EDITORIAL PICK: the Curated chip, the curated filter, `list_curated_dossiers` | +40 relevance term in the organic feed (shipped @147; grandfathered under R-G1 as reframed — veto open, §1) |
| **featured** (`is_featured` + `featured_order`, migration 168) | settlements AND saved_maps | admin/developer via `set_featured` / `set_featured_map` (definer RPC, role gate, `_audit_action` before/after) | the existing SPOTLIGHT mechanism: the top-billed hero set, per section — 168's own header: the sibling of curated, explicit display-order, and map-featured COVERS THE CAMPAIGN SECTION (a campaign IS a saved_maps row). HIDDEN-UNTIL-OCCUPIED is already 168's own law ("an empty Featured section never renders — the DB just returns []"). Read via `list_featured_dossiers`/`list_featured_maps`, ordered `featured_order nulls last, published_at desc`. In the client today, Featured is a VIEW TOGGLE (`featuredOnly` swaps the feed to `fetchFeaturedGallery()`), not a stacked section | none (featured items also remain in the organic flow; membership, not weight) |
| **sponsored** (new record, G-C) | sponsorship record referencing the item | admin/developer via the two-key write path (§5) | the PAID third: the bordered top shelf, the CTA, the sponsor attribution | none in any ordering surface; active items are EXCLUDED from organic + featured listings via `exclude_sponsored` (R-G2) |

**Composition rule:** an item may hold any combination of the three. While
sponsorship is ACTIVE, sponsored placement governs EXCLUSIVELY — the item
renders ONLY in the sponsored shelf; its featured/curated flags stay stored but
dormant, and resume effect the moment sponsorship expires. Curated + featured
compose freely (an item may be both; each governs its own surface).

## §3 The prominence ladder (closed vocabulary; finite semantics; tokens only)
### (rewritten 2026-08-02, self-audit — sponsored leaves the enum)
`standingBadge ∈ { wanderer, cartographer, surveyor, founder, developer, admin }`
— a CLOSED six-member enum, each mapping to an authored chip treatment in design
tokens (no-raw-color law; the ladder's visual weights are a token table, tuned
in data): plain chip → tinted → tinted+icon → gold+icon (Founder) → the
forge-mark treatments (Developer/Admin, visually distinct from ALL paid
standings — staff marks must never read as a purchasable rank). Notes:
- `surveyor` remains IN the enum (the derivation vocabulary is total) but its
  PUBLIC RENDERING is the cartographer chip (§10.2, resolved) — the token table
  maps surveyor → the cartographer treatment on gallery surfaces. Keeping the
  member means a future owner reversal is a token-table edit, not a schema one.
- `support` is deliberately NOT a member — support-role accounts derive
  founder/tier like any account (§2).
- **SPONSORED is not in this enum.** It is a CONTENT class (§2) rendering its
  own chrome — the richest treatment in the product, legal ONLY inside the
  bordered shelf, replacing (not joining) the standing badge on sponsored cards
  (§5). The owner's "one tag class held for SPONSORED — the most prominent"
  (§0.2) is honored as the sponsored-class chrome, not as a seventh standing.
Every badge carries an accessible name (never color-only); every badge is a
real word a first-time visitor understands or a `title=` gloss away from one.

## §4 The shelves framework (settlement / map / campaign / sponsored)
### (rewritten 2026-08-02, self-audit — against the shipped gallery, not a greenfield)
- **What ships TODAY (the framework EXTENDS this; it does not reinvent it):**
  GalleryPage.jsx renders a three-tab view switch — Settlements / Maps /
  Campaigns (a Segmented control; "a view switch, not a header action").
  Settlements read `public.settlements` via `list_gallery_dossiers`; maps AND
  campaigns read `public.saved_maps` via `list_gallery_maps`, where a campaign
  is `share_kind = 'map_with_campaign'` (045: `check (share_kind in ('map',
  'map_with_campaign'))`). Each non-settlement tab has its own shipped filter
  vocabulary, sidebar, premium import, and EmptyState. `public.settlements` has
  NO kind column, and `list_gallery_maps` already RETURNS a column literally
  named `kind` (aliased from share_kind, members {map, map_with_campaign}) and
  accepts a `kind` facet.
- **The discriminator:** `shelfKind ∈ { settlement, map, campaign }` is a
  UI-LEVEL UNION DISCRIMINATOR derived from (source table, share_kind) —
  NEVER a column on either table, and deliberately NOT named `kind` (that name
  is taken by the shipped maps facet, whose members differ). A builder who
  invents a kind column on `settlements`, or a discriminator that must span
  both tables as one column, has left the substrate.
- **Tabs stay tabs.** No tabs→sections conversion: routes, the 15 hub pages,
  and pagination are untouched. The render-when-populated law applies to the
  SPONSORED shelf and any FUTURE kind's shelf only — never retroactively to
  the shipped tabs (an empty shipped tab keeps its EmptyState; hiding a nav
  tab would be a discoverability regression dressed as honesty).
- **The sponsored shelf:** ONE shelf, rendered ABOVE the tab switch (the
  owner's "at the very top of the gallery" read literally), spanning kinds —
  a sponsored settlement and a sponsored map share the shelf, each card
  carrying its shelfKind label. It is a separate labeled query (§1 R-G2),
  smaller than the feed, separated by the border line the owner specified,
  and it renders ONLY while ≥1 sponsorship is active. [One-shelf-spanning-kinds
  is a recorded architecture call, veto open — the alternative (a per-tab
  shelf) fragments the disclosure boundary and triples the chrome.]
- **Mobile clause (new — the original had none):** the shelf collapses to a
  single-column strip (or a horizontal scroll-snap row) above the tabs; the
  standing chip truncates to icon + accessible name on narrow cards; the
  SPONSORED label and the border line render at ALL widths — the disclosure
  never disappears responsively.
- CAMPAIGN remains the deepest future lane for RICHER sharing semantics (a
  campaign world with save-shape, audience projection, and import semantics of
  its own gets its OWN design doc when its day comes) — but the SHELF is not
  reserved, it is shipped; that future doc extends the shipped tab.

## §5 The sponsored lifecycle (admin-curated showcases, NOT an ads marketplace)
### (write path + authorship rewritten 2026-08-02, self-audit)
- **SCOPE FENCE (binding):** no self-serve ad platform, no auction, no campaign
  manager, no sponsor dashboard v1. Sponsorships are hand-sold, invoiced
  offline, and entered by an admin — a dozen a year, each walk-checked. The
  fence is what keeps this affordable; revisit only on owner order.
- **The write path (CORRECTED — the real machinery is not bare RLS):** gallery
  editorial writes go through SECURITY DEFINER RPCs, not RLS policies — the
  shipped idiom is `set_featured` (168): read the caller's `profiles.role`,
  RAISE unless `role in ('developer','admin')`, perform the write, then
  `perform public._audit_action(...)` writing a before/after admin_actions
  row. Sponsorship create/edit/expire MIRRORS that idiom exactly, with two
  hardenings: (a) the MANDATORY AUDIT ROW on every sponsorship write (a money
  surface without an audit trail fails any walk-check), and (b) sponsorship
  CREATION runs the TWO-KEY DISCIPLINE (the founders-roll admin precedent,
  DESIGN_FOUNDERS_HALL §4: a second admin confirms the highest-stakes verbs;
  viewing stays single-admin).
- **The role vocabulary (CORRECTED):** the CHECK is FOUR roles — `('user',
  'support', 'developer', 'admin')` (050). Sponsorship writes are developer +
  admin ONLY; `support` is EXPLICITLY EXCLUDED — and the natural negative
  check (`role <> 'user'`) is FORBIDDEN, because it silently grants support
  staff a money-surface write.
- **Sponsor authorship (named new work, G-C-2 — the original left the world
  unowned):** `publish_settlement` (008) is strictly owner-scoped (`where id =
  target_id and user_id = auth.uid()`), and 076's live author join renders the
  owning account's external_name — so without a ruling, whoever publishes the
  sponsor's world wears the author line, most plausibly a staff forge-mark on
  the most commercial card in the product. RULED: the sponsor world publishes
  through a named ADMIN PUBLISH-ON-BEHALF path — the accountable admin account
  owns and publishes the row via the two-key write path; the sponsorship
  record's `sponsorName` is the DISPLAYED author line on the card; the admin
  is the AUTHOR OF RECORD (in the audit row and the database, never on the
  card); and the STANDING BADGE IS SUPPRESSED on sponsored items — the
  sponsored chrome replaces it (the shelf is the disclosure; a staff mark on
  an ad is the worst possible read, per §8). PINNED (G-C-2): a sponsored
  card's payload carries `sponsorName` and NO `author_standing` — the
  suppression is server-side, like every badge rule.
- The sponsor's world must be a REAL engine artifact passing every normal
  gallery gate (moderation, promotion-contract human evidence) — on this
  platform an advertisement is a playable truth, which is the brand made
  literal.
- The CTA: `url` is validated + pinned at entry (https only, no redirect
  chains at entry time), rendered with `rel="sponsored noopener"` and
  target=_blank; the label is the sponsor's ("Visit", "Purchase") from a small
  closed set. No free-form URL ever renders as a button from user input —
  admin-only writes make this structural.
- Expiry: `endsAt` passes ⇒ active derives false ⇒ item reverts organic
  (R-G2); the shelf disappears when its last active sponsorship lapses;
  dormant featured/curated flags resume (§2b).

## §6 Telemetry (the sponsor's report, the user's consent)
### (event classes assigned + consent sentence corrected 2026-08-02, self-audit)
- Rides the EXISTING analytics events registry + consent architecture
  (profiles.telemetry_consent; the durable outbox): new event kinds
  `gallery_sponsored_impression` (section-visible / card-visible),
  `gallery_sponsored_cta_click`, `gallery_sponsored_import`.
- **EVENT_CLASS (CORRECTED — the original assigned none, and the registry
  requires a parallel class entry per event):** all three are **research**
  class in analyticsEvents.js's EVENT_CLASS map (vocabulary: 'essential' |
  'research'; the edge stamps consent_tier 'research' per 036's
  ('product','research') CHECK). Research-class events are never built or
  mirrored without consent — and telemetry_consent defaults research:true
  with an explicit user opt-out (124), so:
- **The consent sentence, corrected to be TRUE for the chosen class:** users
  who opted out of research telemetry are simply absent from counts. (Had the
  events been essential-class, that sentence would be FALSE — essential events
  are collected from everyone and are not user-flippable.) The disclosed
  consequence: sponsor counts are OPT-OUT-SHAPED — an undercount floor, and
  the sponsor report says so. This paragraph is the privacy posture; keep it
  true.
- Sponsor reporting is AGGREGATE-ONLY (counts, never user identities), rendered
  in an admin-only view; nothing new is collected about users — the "increased
  telemetry" is increased ATTENTION to existing event classes on these items,
  not new surveillance.
- **Registry mechanics (named work, G-C-5):** the three events join EVENTS +
  EVENT_CLASS, EVENTS_REV bumps from 11, and the edge shared bundle is
  regenerated (scripts/build-edge-shared.mjs) — or the edge validator rejects
  the new names on arrival.
- The intent-atlas law extends: showcase telemetry informs BUSINESS decisions,
  never engine math, never ranking (R-G1 would be violated by a
  popularity-feeds-placement loop).

## §7 Import provenance (the ad does not follow the content home)
### (rewritten 2026-08-02, self-audit — the original pinned the half that is already
### true by construction and left the real work unspecified)
- **The strip is true by construction:** `import_gallery_dossier` returns a
  fixed four-column shape — (id, name, tier, sanitized data) (120) — so a
  sponsorship record attached as columns or a sibling table can NEVER ride the
  import payload. The originally promised JSON-round-trip pin ("no
  `sponsorship.url` ever reaches library persistence") was VACUOUS against
  this shape (the contractTestAntiVacuity class). Retired.
- **The real work item (G-C-4) is the PROVENANCE LINE — the additive half:**
  - The RPC: `import_gallery_dossier` gains a provenance return column — a
    RETURN-TYPE change, which per 076's own header means DROP-and-recreate
    (42P13), sequenced on the migration train.
  - The library field: `importProvenance { source: 'sponsored_showcase',
    sponsorName, importedAt }` persisted as SAVE-ENVELOPE METADATA beside the
    world data — never inside generated world state — so regen, undo, and
    rebuild cannot touch it BY CONSTRUCTION, and export carries it as plain
    history. If the user later re-shares the world, the line persists on their
    copy as provenance. [Lifecycle placement is a recorded architecture call,
    veto open: metadata-beside-the-save is what makes every lifecycle path
    safe without per-path handling.]
  - Where it renders + what it says: a static line on the library card and the
    dossier header — "Imported from the Sponsored Showcase · <sponsorName>" —
    honest history, plain text, NO live link, no CTA (their library is
    theirs).
  - The pins, non-vacuous: (a) the provenance field round-trips
    import → persist → reload; (b) the strip pin re-aimed at the ONLY shape
    that could carry sponsor data — a sponsorship blob inside
    `settlements.data` — asserted ABSENT from the imported payload.

## §8 Legal + trust (the activation gate's checklist, recorded now)
- Sponsored-content disclosure: the labeled bordered shelf is the mechanism;
  the label text gets legal review at activation (jurisdictional ad-disclosure
  norms), alongside sponsor contract templates and the outbound-link policy.
- The "Simulated, not AI-generated" trust line and sponsorship must never blur:
  a sponsored WORLD is still a real deterministic world; if a sponsor wants
  content the engine didn't generate, the answer is no (brand law).
- Founder/staff badge integrity: Developer/Admin marks are never sellable and
  never visually confusable with paid standings (§3) — and on sponsored cards
  the question cannot arise, because the standing badge is suppressed there
  outright (§5): the sponsored chrome replaces it. Structural, not stylistic.

## §9 Phasing — the numbered work items (each phase independently shippable;
## only G-C is money-gated)
### (rewritten 2026-08-02, self-audit — G-A's "cheap, no schema beyond the boolean"
### was false; this is the honest bill, itemized so Sol builds without inventing)

**G-A — ACCOUNT-STANDING BADGES**
- **G-A-1 — the author slot (prerequisite; the original never noticed it):**
  the settlements gallery card names NO author today — `list_gallery_dossiers`
  has returned `author_name` since 076, but the tile mapper `sanitizeTile`
  (src/lib/gallery.js) never maps it and GalleryCard.jsx renders no author;
  the gallery's only author render is GalleryCampaigns.jsx ("by
  {m.author_name}"). Work: map author_name into the tile, render the author
  line on GalleryCard, chip beside the name. The author NAME is already the
  deliberately-public datum (076 exposes external_name through the definer
  boundary; campaigns display it today without opt-in) — the STANDING stays
  opt-in; the name is not. [OPEN FORK flagged 2026-08-02 (self-audit), chair
  to rule — do NOT build past it: DESIGN_PROFILE_IMAGE §1 (owner-dictated
  later the same night, and adopted by DESIGN_FOUNDERS_HALL §2's bio drawer)
  makes name + image ONE public display identity behind a SINGLE opt-in —
  consent off blanks the NAME too, on every public surface INCLUDING this
  author line (its §7 pin walks the gallery tile). That supersedes this
  sentence when the identity object lands; today's shipped external_name
  behavior is the interim state. The consequence — a non-opted author's
  published items carry no author line — is the chair's to confirm, never
  the builder's.] Pins: tile-mapper round-trip; the badge chip never
  renders without an author line to attach to.
- **G-A-2 — the standing derivation + schema:** STANDING_OF composition inside
  the definer RPC (§2: role → is_founder → tier; surveyor never read; support
  never marks), returned as `author_standing`, NULL unless the row's
  `showStandingBadge`. Schema: `showStandingBadge boolean not null default
  false` on settlements + saved_maps (existing corpus backfills false), and
  the RPC return-shape change (DROP-and-recreate per 42P13). This is a
  MIGRATION, not "no schema beyond the boolean" — G-A joins the migration
  train.
- **G-A-3 — the privacy + honesty pins:** pglite (galleryUnlisted* style):
  non-opted author's standing ABSENT from the anon payload; opted author's
  standing correct across the full ladder; the founder-transfer case (160)
  flips the badge on both accounts at next read [this arm retires with the
  160 machinery per DESIGN_FOUNDERS_HALL §4 — see §2's cross-doc note]; the
  surveyor case renders the cartographer chip.
- **G-A-4 — the ordering manifest + walker** (§1 R-G1's pin made real): the
  manifest of every ordering surface, net-current anchored (147), stale
  definitions (019/063/071/076) recorded superseded — this IS the
  stale-definition cleanup; the walker's four assertions per §1.
- **G-A-5 — chip tokens:** the six-standing token table, accessible names,
  staff marks distinct from all paid standings, surveyor → cartographer
  mapping on gallery surfaces.

**G-B — RECONCILING THE SHIPPED TABS + THE SPONSORED SHELF CHROME**
(re-scoped 2026-08-02: the tabs EXIST — G-B extends them, it does not build a
sections framework)
- **G-B-1 —** `shelfKind` union discriminator (UI-level, derived, not a
  column, not named `kind` — §4).
- **G-B-2 —** the sponsored shelf chrome above the tab switch, dormant behind
  its population check (render-when-populated scoped to this shelf + future
  kinds only), border + plain SPONSORED label, mobile clause (§4).
- **G-B-3 —** the quarantine predicate: `exclude_sponsored` membership
  predicate (default true) added to the organic + featured listing RPCs,
  allowlisted in the ordering walker; the §2b composition rule (sponsored
  governs exclusively while active) enforced here.

**G-C — SPONSORED (owner-gated activation)**
- **G-C-1 —** the sponsorship record + migration (joins the train per deploy
  law).
- **G-C-2 —** the admin write surface: two-key definer RPCs + mandatory
  `_audit_action` rows (§5), roles developer+admin only, support excluded;
  ADMIN PUBLISH-ON-BEHALF with sponsorName as the displayed author line, the
  admin as author of record, and server-side standing-badge suppression on
  sponsored cards, pinned.
- **G-C-3 —** COMMENTS FOR saved_maps (named new work): a comment surface for
  map/campaign items — new table (or a generalized gallery_comments) + RPC +
  component, with moderation/tombstone parity with 169/172 (both
  settlement-only today), its own migration on the train. Until it lands,
  §0.3's "comment" claim holds for the settlement kind only (bracketed note at
  §0.3); a sponsored map/campaign is viewable + importable but not
  commentable.
- **G-C-4 —** the provenance line (§7): RPC return column (DROP/recreate),
  save-envelope field, the two non-vacuous pins.
- **G-C-5 —** telemetry: the three research-class events, EVENTS_REV bump,
  edge shared bundle regeneration (§6).
- **G-C-6 —** the CTA machinery (§5) + the legal checklist (§8). Far future by
  owner's own framing; this doc is so that day is an execution, not a design.

## §10 Owner calls (one resolved, two parked with the design)
1. Badge display default per standing — the PUBLISH-DIALOG CHECKBOX default
   only; the stored value is always the author's explicit choice (§2)
   (proposed: off for Wanderer, on for staff; owner-tunable).
2. ~~Whether Surveyor belongs on the public ladder~~ — **RESOLVED 2026-08-02
   (chair ruling): Surveyor displays as Cartographer publicly.** The substrate
   already enforces the modesty at the boundary: surveyor_entitlements is
   owner-read-only RLS (139 — no author-scoped read exists, so a public RPC
   structurally cannot name another user a Surveyor), and the AI-surface
   census walls (tests/security/aiSurfaceCensus.js +
   tests/security/aiSurfaceSourceScan.test.js) keep every AI surface
   enumerated and walled. Honest nuance: the premise of the original call
   ("the badge could be the one place the product says the quiet part") was
   false — the pricing page already names Surveyor publicly (PricingPage.jsx
   renders SurveyorBand; src/copy/pricingPage.js names the tier, browsed not
   bought — cross-ref DESIGN_AI_CHAT_SURFACE §4). The ruling is therefore
   about GALLERY CARDS: the ladder shows the cartographer chip for surveyor
   accounts (private standing, public modesty), and reversal is a token-table
   edit (§3).
3. The sponsored shelf's name in the house voice ("The Sponsored Shelf" /
   "Patrons of the Realm" / plain "Sponsored") — legal wants plain; voice wants
   world; the label likely needs both ("Sponsored · Patrons of the Realm").

## CHAIR RULING 2026-08-02 (identity fork, sweeper-escalated): the profile-image
## SINGLE OPT-IN governs the author name AND image from the moment the identity
## object lands — G-A-1's name-renders-without-consent reading is superseded then.
## Migration default: any account that ever SET external_name counts as opted in
## (their action was the consent); unset accounts default private. One consent
## truth, no surface exceptions.
