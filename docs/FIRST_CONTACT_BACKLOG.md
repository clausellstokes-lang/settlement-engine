# First-Contact Clarity — Proposal Backlog

From the first-contact visual-clarity pass: a brand-new-DM walkthrough of all 12 pages
(Create, Dossier, Library, Settlement detail, Realm, Compendium, About, Gallery, Pricing,
Account, Auth, Admin), hunting the small "huh?" moments a stranger hits in their first
few screens.

**Already done (not in this backlog):**
- **29 bounce-risk / friction fixes applied directly** in the first-contact pass (tooltips on
  jargon badges, score/scale anchors, orphaned-emoji removal, `AI-Enhanced` -> `Narrated`,
  sentence-case, mode-switch glosses, etc.).
- **~12 more friction-grade fixes applied** in the follow-up pass (Gallery `Stability:` chip
  prefix, Auth magic-link gloss, Library realm-clock `tick` -> month + sample `Fork this sample`,
  Compendium slider `0-100` anchor, Create threat-band gloss, Realm faith-tier gloss, Dossier
  `AIInlineCard` -> narrated, Account `AI model preference` -> `Narration model` + `AI-polish`
  -> `Narrate`, Pricing credit-pack subhead reorder).

What remains below is **wording judgment and feature-coupled renames the voice workstream owns**
(docs/VOICE_AND_TONE.md is binding). Severity: `friction` = a pause or extra click for a newcomer;
`polish` = refinement.

---

## Priority: residual "AI" language (voice-bible violation)

The voice bible is explicit (pillar 4 + the voice paragraph): **never "AI"; the product is
"narrated" / "the Narrative Layer."** These survive in **established feature labels with downstream
coupling** (shared `en.js` keys, the actual exported prompt text, analytics event names, pinned
tests), so they need a *coordinated* rename rather than an inline swap:

- **Export feature labels `Narrative AI Prompt` / `Map AI Prompt`** — appear on the dossier export
  controls and are referenced in the About guide (Quick Start step 6, Power User). Rename to drop
  "AI" (e.g. `Narrated prompt`), reconciling the `en.js` key, the button label, any analytics
  event, and the copied-prompt heading together.
- **About guide "Press the purple button"** (Quick Start + Power User) — names a color, not the
  control. Name the action diegetically (the Narrate / Narrative Layer control).
- **`COPY.ai.polishCta = 'Polish with AI'` in `src/copy/strings.js:74`** — still says "AI" and is
  consumed by `NextActionRail.jsx` (the post-generate rail). `AIInlineCard` was converted to an
  in-voice literal, but this shared string was left untouched to avoid silently changing
  NextActionRail. Rename the shared key (e.g. `'Run the Narrative Layer'`) and update both consumers
  together.

*(The low-coupling AI labels — `AIInlineCard` body/CTA, Account `AI model preference` / `AI-polish`
— were already converted in the follow-up friction pass, since they are component-local and the
bible mandates the swap.)*

---

## Remaining per-page proposals (wording + polish)

### Create
- `[polish]` **ChangeModeBar** — `Basic Generate` / `Advanced Generate` have no gloss on the bar
  itself (the intro paragraph below covers it). Optional `title=` on the mode name.
- `[polish]` **GenerateWizard "Generate Draft"** — confirm `Draft` reads as intended Lexicon to a
  first-timer (the subline + leave-confirm already teach it). Voice confirmation only.

### Dossier
- `[polish]` **Narrative empty states** ("Run the Narrative Layer to draw out...") — consider
  appending the known cost ("(N credits)") to the empty-state prompt, matching the button gloss.

### Library
- `[polish]` **SaveQuotaMeter pitch pill** — "Unlock the simulation: advance time, run campaigns..."
  is dense; optional `title=` gloss or simpler nouns. (`PREMIUM_PITCH` is centralized + test-asserted,
  so any change is coordinated.)
- `[polish]` **LivingWorldSignalRow war-weary pip** — the `title=` carries a raw decimal; drop it or
  anchor it ("on a 0 to 1 scale"). The band word alone reads fine.

### Settlement detail
- `[polish]` **Edit Names disclaimer** — "updates this settlement's JSON export" surfaces a file
  format; reword to a civic noun ("...saved file and any linked neighbour references").
- `[polish]` **"Revert to Raw"** — `Raw` is a state word; keep the label, ensure the helper sentence
  stays adjacent (it does).
- `[polish]` **Network Effects "Sources" causal tags** ("2-hop, 60% strength", "1.4x tier leverage")
  — a short `title=` on the Sources sub-heading explaining decay (distant neighbours pass weaker
  effects).

### Realm / World Map
- `[polish]` **WorldMapToolbar preset chips** (Quiet / Realistic / Dramatic in More > Simulation) —
  enrich each `title=` with a one-line consequence (what each does to pace/volatility).
- `[polish]` **RealmInspector section tabs** (Pulse Results, War & Diplomacy, Pantheon, Chronicle) —
  give each a `title=` that glosses the section's content rather than echoing the label.

### Compendium
- `[polish]` **EconomyTab "Viability Score" card** — names a score + "Economic stress analysis" but
  never states the scale/direction; add a one-line band or min/max anchor.
- `[polish]` **CustomContentManager "Custom" badge** — context already explains it; optional
  `title="Authored by you."`

### About / How-To
- (see the residual-"AI" cluster above for `Narrative AI Prompt` and "purple button")
- `[polish]` **Under the Hood slider thresholds** ("Military >=80") — a one-time "(sliders run 0 to
  100)" anchor at first mention.

### Gallery
- `[polish]` **GallerySidebar "Surface" filter heading** — groups Has image / Has comments / Curated;
  "Surface" is cryptic. Rename (candidate: "Listing" / "Details") or add a one-line gloss.
- `[polish]` **GalleryDetail "Share" button** — refine the `title=` to name the result ("Copy a link
  to this dossier"); behavior is platform-dependent.

### Pricing
- `[polish]` **Cartographer tier bullets** ("The self-ending war layer + the living pantheon") — a
  short plain-language gloss (wars start and end on their own; faiths gain and lose converts).
- `[polish]` **PricingMomentCard "See Cartographer"** — append a cost hint ("Cartographer is
  $6/month"); placement is a conversion + voice call.

### Account
- `[polish]` **AI model dropdown for zero-credit users** — a free DM with no credits sees a
  paid-narration model picker with no "optional" signal; mark it optional or note it applies once
  credits are present.
- `[polish]` **Saved Settlements "inactive retained"** — unexplained jargon for a returning
  downgraded user; `title=` gloss ("Settlements kept read-only beyond your active save limit").
- `[polish]` **Save profile vs See Cartographer** — two primary-variant buttons on the page (in
  separate sections); consider demoting Save profile to secondary so the conversion CTA is the lone
  primary.
- `[polish]` **Subscription upsell-footer wording** — harmonize "AI prose pass" -> "narrated prose
  pass" to match the Narrate control + Narrative Layer lexicon.

### Auth
- `[polish]` **Tab toggle case** — "Sign In" / "Create Account" / "Back to Sign In" are title case;
  the voice doc prefers sentence case. Harmonize the tabs + their referents together.
- `[polish]` **AuthModal header** — "Welcome" has no subtitle of its own; optional one-line subtitle
  echoing the page ("Sign in to keep your work"). The panel below already carries this.

### Admin
- `[polish]` **"Sim Tuning" Section title** — clipped; a new admin can't tell it changes live
  war/occupation/trade behavior. A one-line gloss under the title.
- `[polish]` **Role edit dropdown options** (User / Admin / Developer) — the open menu options carry
  no scope gloss (the trigger `title=` covers first contact); per-option glosses would need a custom
  menu component.

---

## Couldn't verify in this environment
- Native `title=` tooltips (the bulk of the applied fixes) only appear on hover and to assistive
  tech — confirm with a real pointer + a screen reader.
- The orphaned-`U+FE0F` removal fixed a stray-box artifact whose old rendering was OS/font-stack
  dependent — confirm the dropdowns look clean on the platforms your DMs use.
- The `/realm` FMG map fill needs a real browser (the cross-origin iframe black band noted in the
  UI/UX overhaul status).

---

## LD-1 — THE LIVING MINIATURE (owner-ordered 2026-08-01; implementation-ready spec;
## assigned to the external implementer)

**The order:** replace the landing page's sample-dossier CARD with the REAL dossier,
scaled down into the same footprint — tabs and all, one-to-one, interactable. Owner
explicitly waives legibility at miniature scale; exactness is the goal.

**Verified substrate (2026-08-01, makes this wiring not architecture):**
- The card's DATA was never fake: `src/components/home/landingFixture.js` is FROZEN
  REAL ENGINE OUTPUT (seed lf-033, 12 ticks, 5-settlement region, generated by
  `scripts/generate-landing-fixture.mjs`). Only the PRESENTATION is a facsimile
  (`LandingArtifacts.jsx` re-renders excerpts through its own card markup — a second
  rendering of dossier look-and-feel that drifts as the real dossier evolves).
- `OutputContainer.jsx:200` already accepts the exact demo mount:
  `{ settlement: propSettlement, readOnly, playerView, hideHeader,
  suppressNarrativeCta }` — props-driven, no store seeding required.

**Work items:**
1. **Fixture full-emission:** the current fixture is excerpt-only (206 lines). Extend
   `generate-landing-fixture.mjs` with a full-settlement emission mode and regenerate
   seed lf-033. The STOCK narration grounding rule in the script header is unchanged.
2. **Mount:** inside the existing lazy `LandingBelowFold` chunk, dynamic-import
   OutputContainer AT THIS SITE (never static — the lazy-import-reparents hazard;
   the landing chunk must not swallow the dossier chunk). Build pin per the 5-layer
   *Lazy recipe WITH the second assertion (lazy parent). First-paint budget untouched
   by construction.
3. **The scale frame — FIXED WINDOW, INNER SCROLL (owner clarification, binding):**
   `transform: scale(k)` (k ≈ 0.35, derived from measured natural width vs the card
   column), `transform-origin: top left`. The frame has a FIXED height (≈ the current
   card's footprint) that content can NEVER grow: a long tab (Services is the named
   example) scrolls WITHIN the window (`overflow-y: auto` inside the frame), exactly
   like a real viewport in miniature — the card bottom never moves, whatever tab is
   open. Tabs, scrolling, hovers all live — it is the real component behind glass.
4. **AUDIENCE RULING (recommended default, owner may override): mount the ANON-TIER
   view.** The miniature must equal what "Forge this exact town" delivers to an
   anonymous visitor — promise-parity is the entire point of the surface. (The
   premium view would show more and overpromise; the fixture town is within the anon
   ceiling BY DESIGN per its own header.)
5. **Verbs inert:** `readOnly` mount; verify no store-coupled affordance (AI, save,
   rename, regen) renders live for the anonymous mount. The Save-to-Library and
   Forge CTAs remain OUTSIDE the frame exactly as today.
6. **A11y decision at build:** the miniature is real DOM (strictly better than the
   facsimile for screen readers), but choose the focus strategy — recommended: one
   focus stop that activates into the miniature (so keyboard users don't traverse an
   entire dossier mid-landing-page), aria-labelled as a live miniature of a real
   dossier.
7. **Optional enhancer (owner taste, not required):** click-to-expand lightbox
   rendering the SAME mount at scale 1 — the miniature stays one-to-one honest and
   the curious get the readable version one click away.
8. **Regen policy unchanged and now load-bearing:** the fixture regenerates whenever
   generation output legitimately shifts (golden-regen = the signal), or the
   miniature will visibly drift from what the button forges — the drift the facsimile
   could hide, the miniature exposes. That exposure is a feature.

---

## LD-2 — NAV DIVIDERS: LINES FOR SECTIONS, CHEVRONS FOR THE JOURNEY (owner-ordered
## 2026-08-01; implementation = the external implementer)

**The order (owner, on the header nav):** items separated by vertical lines extending
top-to-bottom of the bar — EXCEPT within the Create → Library → Realm trio, whose
dividers become full-height ARROWS: two strokes from the bar's top and bottom edges
converging to a mid-height apex (pointing right, the journey's direction), open at
the base/back. Sections read as sections; the journey reads as flow.

**Spec:**
- One `NavDivider` leaf, parameterized `{ kind: 'line' | 'chevron' }` — an inline
  SVG spanning the header height (`height: 100%`, viewBox-scaled): `line` = one
  1px vertical stroke; `chevron` = two strokes (top-edge → mid-right apex,
  bottom-edge → mid-right apex). Stroke color from design tokens (the muted
  divider register; no-raw-color law applies), stroke-width matched between kinds.
- Placement: line dividers at WELCOME|CREATE, REALM|COMPENDIUM, COMPENDIUM|GALLERY,
  GALLERY|ABOUT; chevron dividers at CREATE|LIBRARY and LIBRARY|REALM (replacing
  the current small `›` glyphs entirely).
  ⚠️ ONE TASTE CALL for the owner's eye at the walk: whether the trio's OUTER
  boundaries (WELCOME|CREATE, REALM|COMPENDIUM) stay plain lines (specced default)
  or also become chevrons (journey entry/exit). Default ships; the eye rules.
- Apex clearance: nav item padding adjusts so the chevron apex never collides with
  label text at any viewport where the full nav renders.
- The active-tab underline is untouched; the SIGN IN button region carries no
  divider; mobile/collapsed nav is untouched (dividers are desktop-nav only).
- A11y: dividers are pure decoration — `aria-hidden`, zero focus stops; the
  existing `›` glyphs' removal must not change the accessible name of any link.
- Pin: a DOM census asserting divider kind-by-boundary (the exact placement map
  above), so a future nav item insertion cannot silently misfile a divider.

---

## LD-3 — THE PAGE ENDS ON THE PAINTING (owner-ordered 2026-08-01; implementation =
## the external implementer)

**The order (owner, at the landing bottom):** the landing page currently stacks TWO
footers — its own §06 artwork-band footer (the painted create scene + brand row),
then the GLOBAL app footer strip below it (Pricing | Feedback & support | Terms |
Privacy + © + "Simulated, not AI-generated"). Replace the bottom with the default
band and go no deeper: THE ARTWORK IS THE END OF THE PAGE.

**Spec:**
- Suppress the global app footer ON THE LANDING ROUTE ONLY (route-scoped condition
  at the App.jsx mount — never a global deletion; every other page keeps it).
- MIGRATE, never delete (binding): `Terms`, `Privacy`, and the
  `© 2026 SettlementForge · Simulated, not AI-generated.` line move INTO the
  landing band's dark flush region as a modest final row (existing LandingFooter,
  one row added; token typography; links reuse the global footer's copy keys from
  copy/footer.js — one copy truth, two renderers is FORBIDDEN: extract the shared
  row into one component or import the same keys). `Feedback & support` joins the
  same row (the widget entry must stay reachable from first contact).
- The band's bottom edge = document end: no margin/padding artifact below the
  artwork (pin: the landing document's scrollHeight ends within the band's
  bounding box; no sibling renders after LandingFooter).
- The `:461` comment ("sits flush against the global app footer") updates to the
  new truth.
- Pins: route-scoped suppression (landing lacks the global footer, Compendium
  still has it); legal-links presence ON the landing (Terms+Privacy reachable —
  an absence regression here is a legal defect, treated as such); welcomeJourney
  suite green.

---

## LD-4 — THE HERALD MINIATURE (owner-ordered 2026-08-01; implementation = the
## external implementer; the living-miniature principle's second consumer)

**The order:** the landing's "The Chronicle" card becomes **The Herald** and matches
EXACTLY how the Herald looks on the Realm page — the real surface, miniaturized,
not a facsimile.

**Spec (LD-1's architecture verbatim, two deltas):**
- The "Chronicle half" of `LandingArtifacts.jsx` (:353) is replaced by a second
  `MiniatureFrame` mounting the REAL `HeraldBody` — the exact component
  `RealmInspector.jsx` hosts — under the exact label and chrome the realm page
  gives it. The exactness law: whatever the realm Herald shows (tabs, section
  doors, severity presentation, pills), the miniature shows; facsimile elements
  survive ONLY if the real surface has them. Fixed window + inner scroll per
  LD-1 §4, same frame contract.
- **Delta 1 — the data is world-side:** fixture v2 additionally emits the RAW
  inputs `buildHeraldFeed` consumes (the pulse records + campaign wizard-news
  entries + the read-only fourth source's inputs) from the same 12-tick run —
  NEVER a pre-built feed. The landing runs the REAL derivation at mount, so the
  demo exercises the actual pipeline. The facsimile excerpt fields
  (`fixture.chronicle`, `fixture.relationships`) die with the facsimile (grep
  for other consumers first). The promise-parity pin extends: the replay must
  reproduce the herald feed digest, not just the settlement digest.
- **Delta 2 — the store seam:** verify at build whether HeraldBody is
  props-driven; if it reads the store, mount through the CONTROLLED-seam idiom
  (the TC-0 precedent — supply feed/world via props, store path byte-untouched).
  A second Herald renderer is FORBIDDEN (single writer for the surface).
- Vocabulary note (first-contact clarity): "Chronicle" names the persistent
  history ledger in-product; the news surface is THE HERALD. The rename aligns
  the landing with the product's own nouns.

**⚠️ THE HONEST CONSEQUENCE (recorded so the priority lands):** the real Herald
renders the real sentences — including the legacy D-grade templates the blind
grading flagged ("Cnocby shows enough conflict pressure for a new condition to
emerge" is that exact class). The facsimile currently HIDES the product's worst
voice; the miniature will EXPOSE it on the landing page. Correct response: the
legacy receipt sweep (register R-refs; the prose-numerics/authoring walls Sol
already landed are its enforcement half) graduates to LAUNCH-VISIBLE priority —
the voice is fixed at the SOURCE, never faked on the landing.

---

## LD-3b — THE TWO RIBBONS (owner amendment 2026-08-01 to LD-3; supersedes LD-3's
## document-end model with a stronger one)

**The owner's observation + solution:** at scroll-top, the hero shader visibly fails
to reach the viewport bottom (a floating seam mid-artwork). Rather than retune the
shader: the LD-3 bottom ribbon behaves like the TOP ribbon — persistent chrome —
and everything else scrolls BETWEEN the two ribbons. The shader then terminates at
the bottom ribbon at scroll-top, by construction.

**Why this is the right cure (recorded):** the seam is a HEIGHT-ASSUMPTION defect —
a scrim sized to an assumed viewport lands mid-artwork on other aspect ratios.
Tuning gradient stops fixes one screen; the ribbon model deletes the CLASS: the
scrim's terminus becomes a hard chrome edge at every aspect ratio. Letterboxing —
the scroll film plays between two fixed rails, and the page's end is always
visible.

**Binding constraints:**
1. **WINDOW SCROLL IS PRESERVED.** Both ribbons are `position: fixed`; the body
   remains the scroll container. A nested scroll region is FORBIDDEN — the
   landing's scroll-scrubbed film math (pins/triggers) survives fixed chrome but
   not a re-parented scroller. Re-derive only the viewport-height offsets.
2. **Chrome heights are layout tokens** (`LANDING_HEADER_H`, `LANDING_RIBBON_H`,
   tokens.js): the hero/scrim heights become
   `calc(100dvh - LANDING_HEADER_H - LANDING_RIBBON_H)` — termination at the
   ribbon by construction, zero per-aspect tuning. Root-cause the current seam's
   exact line at build and delete its assumption rather than layering over it.
3. **The ribbon is SLIM** — one modest row (LD-3's migrated legal line: Terms ·
   Privacy · Feedback · © · "Simulated, not AI-generated"), visibly lighter than
   the header; the film's vertical budget on laptop viewports is the scarce
   resource.
4. **Mobile/safe-area:** fixed bottom bars fight collapsing browser chrome; below
   the mobile breakpoint the ribbon is NOT fixed — it reverts to LD-3's
   document-end placement with `env(safe-area-inset-bottom)` padding. Desktop
   letterboxes; mobile ends on the band.
5. LD-3's pins update: no sibling ever renders below the ribbon (trivial when
   fixed); the scrim-terminus pin is new — at scroll-top the hero paint region's
   bottom edge equals the ribbon's top edge (a computed-style assertion at two
   viewport heights, the seam's regression test).

---

## LD-5 — RIBBON DROPDOWNS + THE ACCOUNT IA (owner-ordered 2026-08-01;
## implementation = the external implementer; composes with LD-2's dividers)

**The order:** Compendium, Gallery, and About gain hover-opened dropdowns (styled
in the SIGN IN button's register); the account dropdown restructures. Every item
is a real deep link to its page/tab:
- **Compendium ▾** Built-in Catalog · Custom Content
- **Gallery ▾** Settlements · Maps · Campaigns · My Saves (NEW: a private per-user
  tab — ALL the user's saves regardless of category)
- **About ▾** What this Is · Practical Guide
- **Account ▾** Profile · Security · Subscription · Support · Data · Preferences

**Binding rulings:**
1. **PARENTS STAY LINKS.** Compendium/Gallery/About remain clickable routes
   exactly as today; the dropdown is a shortcut layer, never a replacement.
   Menu-only parents break muscle memory, middle-click, and crawlability.
2. **EVERY ITEM IS A ROUTE.** Each entry deep-links through the routes table
   (the TC-0 sub-tab deep-link precedent): compendium/custom, gallery/maps,
   gallery/mine, about/guide, account/security, … — shareable URLs; the menu is
   a list of real `<a>`s, zero JS-only navigation.
3. **THE TRIPLE-MODE MENU (a11y law):** hover opens (with hover-intent grace so
   diagonal travel doesn't flicker), FOCUS opens (keyboard: the parent is a
   focus stop; arrows traverse items; Escape closes and returns focus), TOUCH
   opens on tap with the caret as the toggle (hover does not exist on touch;
   the parent link still navigates on direct tap). Menu roles per the house
   tablist discipline; never a hover-only surface.
4. **MENUS OBEY RENDER-WHEN-POPULATED:** Gallery ▸ Maps and Campaigns appear
   only when those shelves exist (DESIGN_GALLERY_SHOWCASE §4 — one law for
   shelves and their menu items alike); My Saves is auth-gated (absent, not
   disabled, for anonymous — the presence discipline).
5. **ONE SAVES TRUTH:** My Saves is a PROJECTION of the same store/data the
   Library reads — a cross-category private view rendered as a Gallery tab;
   no second saves list state anywhere. ⚠️ OWNER-PARKED QUESTION recorded, not
   ruled: the eventual relationship between Library (settlement workspace) and
   Gallery ▸ My Saves (cross-category view) — two nav paths to saved work is
   fine as projections, but the long-game IA (does Library fold in when maps/
   campaigns mature?) is the owner's future call.
6. **ACCOUNT IS A PAGE-IA RESTRUCTURE, not just a menu:** the six items imply
   the Account page reorganizes into six deep-linkable tabs (Profile · Security
   · Subscription · Support · Data · Preferences). Existing account sections
   map into them (billing → Subscription; telemetry consent + export/delete →
   Data; narration prefs → Preferences; the feedback widget entry → Support).
   Data is the privacy/trust surface and earns first-class placement.
7. **Vocabulary check at build:** the product's existing tab says "Built-in
   Catalog" — one spelling everywhere (default: the product's existing
   "Catalog" unless the owner orders the change to "Catalogue").
8. **LD-2 composition:** dropdown hover zones live inside each nav cell; the
   dividers (lines/chevrons) sit between cells and are unaffected; the journey
   trio (Create › Library › Realm) gains NO dropdowns in this order — it stays
   the clean arrowed path.
