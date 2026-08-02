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

> **SUPERSEDED — docs/DESIGN_LIVING_MINIATURE.md is the binding spec** (fully
> architected 2026-08-01; self-audit corrections folded 2026-08-02). The sketch
> below is historical. Two of its claims are known FALSE and corrected there:
> the OutputContainer mount is NOT store-free (it reads the store, fires a
> mount-time pricing RPC, and the readOnly/no-saveId mount changes the tab
> set — the design doc's DEMO MOUNT CONTRACT is the cure), and fixture v2 is
> ADDITIVE (the excerpt fields have other live consumers and are KEPT).
> [CORRECTED 2026-08-02 (self-audit)]

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

**Spec [CORRECTED 2026-08-02 (self-audit): three substrate errors fixed — there
are no `›` glyphs (the real flow mark is `components/nav/NavFlowArrow.jsx`,
rendered on BOTH the desktop nav, App.jsx:601, and the mobile bottom nav,
App.jsx:816); the placement map was a hardcoded second truth routes.js forbids;
`height:100%` on a flex child of `<nav>` spans the nav row, not the bar]:**
- One `NavDivider` leaf, parameterized `{ kind: 'line' | 'chevron' }` — an inline
  SVG: `line` = one 1px vertical stroke; `chevron` = two strokes (top-edge →
  mid-right apex, bottom-edge → mid-right apex). Stroke color from design tokens
  (the muted divider register; no-raw-color law applies), stroke-width matched
  between kinds. BYTE-FRUGAL by chair ruling: the divider renders in the eager
  App.jsx header — inline SVG, no new module weight beyond the trivial; measure
  the App.jsx byte delta against the eager budget (tests/build/vendorPdfLazy
  discipline) before landing.
- **Geometry (the "top-to-bottom of the bar" order, made mechanical):** the
  `<nav>` gains `alignSelf: 'stretch'` and each divider stretches to the nav's
  full height. Chosen over absolutely positioning dividers against the header
  (top:0/bottom:0) because the header is `flexWrap: 'wrap'` (App.jsx:546) — an
  absolute child would span BOTH rows when the header wraps at intermediate
  widths. When the header wraps, "the bar" is the nav's own row and dividers
  span that row — the accepted wrapped behavior, recorded.
- **Placement is DERIVED, never a map:** divider kind between adjacent NAV cells
  is `kind = flowsInto(NAV[i].id, NAV[i+1].id) ? 'chevron' : 'line'`, computed
  from routes.js's NAV order + NAV_FLOW (routes.js:190-193) — the single source
  of truth routes.js declares; a hardcoded boundary list is the parallel-array
  drift routes.js:163 exists to forbid. Today that derivation yields chevrons at
  CREATE|LIBRARY and LIBRARY|REALM and lines everywhere else — the owner's
  intent, derived not restated.
  ⚠️ ONE TASTE CALL for the owner's eye at the walk: whether the trio's OUTER
  boundaries (WELCOME|CREATE, REALM|COMPENDIUM) stay plain lines (specced
  default) or also become chevrons (journey entry/exit) — with derivation this
  is a one-line predicate change, not a map edit. Default ships; the eye rules.
- **Desktop-only, and the mobile mark SURVIVES (chair ruling):** the desktop
  ribbon stops rendering `NavFlowArrow` and gains the between-cell `NavDivider`;
  the MOBILE bottom nav keeps its `NavFlowArrow` mount (App.jsx:816) untouched —
  the Create→Library chevron draws on mobile today and this order must not
  silently delete it. `tests/components/navFlowArrows.test.jsx` updates its
  desktop half consciously; its mobile half stays green as the negative control.
- Apex clearance: nav item padding adjusts so the chevron apex never collides with
  label text at any viewport where the full nav renders.
- The active-tab underline is untouched; the SIGN IN button region carries no
  divider.
- A11y: dividers are pure decoration — `aria-hidden`, zero focus stops; removing
  the desktop NavFlowArrow must not change the accessible name of any link (it
  is already glyph-free decoration).
- Pin: a DOM census asserting the divider kinds AGAINST THE DERIVATION (NAV +
  NAV_FLOW), never a frozen boundary list — a future nav insertion files its own
  divider automatically instead of redding a stale map.

---

## LD-3 — THE PAGE ENDS ON THE PAINTING (owner-ordered 2026-08-01; implementation =
## the external implementer)

**The order (owner, at the landing bottom):** the landing page currently stacks TWO
footers — its own §06 artwork-band footer (the painted create scene + brand row),
then the GLOBAL app footer strip below it (Pricing | Feedback & support | Terms |
Privacy + © + "Simulated, not AI-generated"). Replace the bottom with the default
band and go no deeper: THE ARTWORK IS THE END OF THE PAGE.

**Spec [CORRECTED 2026-08-02 (self-audit): the row's home, the copy seam, the
Pricing omission, the false sibling pin, and the mobile clearance were all
wrong or missing]:**
- Suppress the global app footer ON THE LANDING ROUTE ONLY (route-scoped condition
  at the App.jsx mount — never a global deletion; every other page keeps it).
- MIGRATE, never delete (binding): **`Pricing`** [added by chair ruling — the
  global footer is the landing's ONLY path to /pricing (routes.js gives pricing
  no `nav:` block), and LD-3 as first written removed the conversion surface's
  only Pricing link], `Terms`, `Privacy`, `Feedback & support`, and the
  `© 2026 SettlementForge · Simulated, not AI-generated.` line.
- **The row is its own tiny EAGER component (chair ruling), not a LandingFooter
  addition.** The shared legal/ribbon row lives in an EAGER module beside
  copy/footer.js (App.jsx already pays for that copy); the lazy landing chunk
  imports it DOWNWARD — never the reverse (the lazy-import-reparents hazard:
  a shared component inside the landing chunk imported by App.jsx would
  re-parent the lazy closure into the entry chunk). One copy truth holds by
  construction: the row imports `t` from copy/footer.js under a DISTINCT local
  alias — LandingFooter's own `tl` resolves the `landing.footer` namespace, and
  `tl('footer.terms')` would silently return the literal key string; two
  identically-prefixed namespaces through one resolver is the trap. The row is
  not pure copy: it takes an `onNavigate` callback (the global footer's entries
  are Buttons, not `<a>`s) and the `sf:open-feedback` CustomEvent dispatcher —
  verify that event's listener is mounted on the landing route before calling
  the widget entry "reachable".
- **Mobile clearance (the occlusion this spec originally created):** App.jsx
  renders the fixed mobile bottom nav on EVERY view including the landing, and
  the global footer's own `footerPadMobile` padding is today the only thing
  keeping landing content clear of it (HomeLanding deliberately cancels main's
  mobile bottom pad). Suppressing the footer removes that clearance — the
  migrated row therefore carries
  `paddingBottom: bottomClearance(CHROME.footerPadMobile)` (the existing theme.js
  helper), NOT a bare safe-area inset. Pin in the terms this spec already
  accepts: at a mobile viewport, the Terms link's bounding-rect bottom sits
  ABOVE the mobile nav's top — a presence pin alone passes while the link is
  invisible under the bar.
- The band's bottom edge = document end **[pin respecced — the original "no
  sibling renders after LandingFooter" is false by construction: App.jsx renders
  the mobile bottom nav, the FAB stack, and the auth modal after `</footer>` on
  every route]:** no IN-FLOW sibling renders after the landing band —
  fixed/absolutely-positioned chrome (mobile bottom nav, scroll FAB stack, auth
  modal, feedback widget) is excluded by construction and ENUMERATED in the pin
  so a new fixed sibling is a conscious addition; and
  `document.documentElement.scrollHeight` equals the band's document-space
  bottom (desktop: plus the LD-3b ribbon reserve).
- The `:461` comment ("sits flush against the global app footer") updates to the
  new truth.
- Pins: route-scoped suppression (landing lacks the global footer, Compendium
  still has it); links presence ON the landing — Pricing + Terms + Privacy +
  Feedback all reachable from the landing document (a Terms/Privacy absence
  regression is a legal defect, treated as such; the Pricing absence is the
  commercial equivalent and is now pinned too); welcomeJourney suite green.

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
  DESIGN_LIVING_MINIATURE.md §4 (LD-1's binding frame contract — the sketch in
  this file is superseded and has no §4; pointer fixed 2026-08-02, self-audit),
  same frame contract.
- **Delta 1 — the data is world-side:** fixture v2 additionally emits the RAW
  inputs `buildHeraldFeed` consumes (the pulse records + campaign wizard-news
  entries + the read-only fourth source's inputs) from the same 12-tick run —
  NEVER a pre-built feed; they land in the HEAVY sibling module
  (`landingSettlementFixture.js`, DESIGN_LIVING_MINIATURE §2), which only the
  miniature site dynamic-imports. The landing runs the REAL derivation at
  mount, so the demo exercises the actual pipeline.
  [CORRECTED 2026-08-02 (self-audit): the fields this delta named for deletion
  were misspelled AND the deletion is rescinded. They live at
  `fixture.realm.chronicle` / `fixture.realm.relationships` — not top-level —
  so a grep against the old spelling finds nothing; and per the chair's
  fixture-v2 ADDITIVE ruling they are KEPT: `fixture.realm.*` has live
  consumers (LandingArtifacts.jsx:264, :298) and nothing deletes. What dies is
  the facsimile CARD MARKUP; whether a kept excerpt field later loses its LAST
  consumer is a per-field check at build, with its consumer line cited — a
  checklist, never a sweep.] The promise-parity pin extends: the replay must
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

**[CORRECTED 2026-08-02 (self-audit) — the ACTUAL seam mechanism, named so the
build deletes the right assumption:** the defect line is `src/index.css:329` —
`.sf-landing-hero { min-height: 86vh }` ends the element 14vh short of the
viewport, exposing the next section. And the scrim CANNOT be cured by resizing
the element alone: `.sf-landing-hero` carries `background-attachment: fixed`,
under which the background positioning area is the VIEWPORT, not the element —
shrinking the element clips the paint but does NOT re-phase the gradient; its
0.7 terminal stop still lands at the viewport bottom behind the ribbon. The
cure: the scrim moves to a pseudo-element sized to the ELEMENT (the gradient
element-scoped; the scene image may keep or drop the fixed attachment —
noting iOS Safari ignores `background-attachment: fixed`, so the mobile arm
already behaves differently). The constraint-5 scrim-terminus pin must assert
the COMPUTED GRADIENT TERMINUS, not just the element's bounding box, or it
passes on a mid-gradient seam.]**

**Binding constraints [CORRECTED 2026-08-02 (self-audit) throughout — the v1
constraints named substrate that does not exist (GSAP-style "pins/triggers",
tokens.js chrome tokens) and silently reached into global chrome]:**
1. **WINDOW SCROLL IS PRESERVED — and the conversion is LANDING-ROUTE-ONLY
   (chair ruling).** The TOP chrome stays the shipped `position: sticky` header
   on every route, exactly as shipped (App.jsx:546 — sticky at top:0 already IS
   persistent chrome; converting the global header to `fixed` would shift every
   route's layout and re-calibrate CHROME.scrollPadDesktop and every anchor
   scroll — out of scope). Only the BOTTOM ribbon is new and `position: fixed`,
   on the landing route only. The body remains the scroll container; the
   landing's SCROLL CONTAINER may not be re-parented. Bounded inner scroll
   inside a fixed-size frame (the DESIGN_LIVING_MINIATURE.md §4 miniature,
   LD-4's Herald) is EXPLICITLY
   PERMITTED and must carry `overscroll-behavior: contain` — the v1 blanket
   "nested scroll region is FORBIDDEN" read as banning what LD-1/LD-4 mandate.
2. **The film math, against the real substrate:** there is no GSAP/ScrollTrigger
   /Lenis in this tree (that vocabulary belongs to the marketing microsite).
   The driver is `useScrollJourney`'s pure
   `computeScrollProgress(ranges, legs, scrollY, viewportH)` with the playhead
   hardcoded at `y = scrollY + viewportH * 0.5`. A fixed bottom ribbon does not
   change `window.innerHeight`, so without change the judged centre stays at
   the FULL viewport's centre while the visible band shrinks — the ribbon would
   silently re-time every stop-freeze. WORK ITEM: `computeScrollProgress` gains
   a chrome-inset parameter (top + bottom) so the playhead is the centre of the
   VISIBLE band; its existing unit tests gain non-zero-inset cases; and
   `.sf-welcome-leg`'s `100vh` (70vh mobile/reduced-motion) — a second viewport
   assumption — becomes the same calc the hero uses.
3. **Chrome heights live in theme.js `CHROME`** — the tree's one frozen source
   for painted chrome heights (its own header says so) — never a second
   tokens.js measurement of the same chrome. `CHROME` gains `ribbonLanding`
   (LANDING_RIBBON_H's real home, chair ruling); the header heights are the
   existing `CHROME.headerMobile` (59) / `CHROME.headerDesktop` (60) — one
   LANDING_HEADER_H constant cannot cover both breakpoints. The hero/scrim
   height becomes the breakpoint-aware
   `calc(100dvh - CHROME.header* - CHROME.ribbonLanding)`; the mobile arm
   composes `bottomClearance(CHROME.footerPadMobile)` rather than inventing an
   inset (the fixed mobile bottom nav is ~57px + safe area; a bare
   `env(safe-area-inset-bottom)` does not cover it).
4. **The ribbon is SLIM and EAGER** — one modest row (LD-3's migrated line:
   Pricing · Terms · Privacy · Feedback · © · "Simulated, not AI-generated"),
   visibly lighter than the header; the film's vertical budget on laptop
   viewports is the scarce resource. It is its OWN tiny component rendered
   EAGERLY (route-scoped chrome beside the header at the App.jsx mount — the
   LD-3 eager shared row), NEVER inside the lazy below-fold chunk: the ribbon
   must exist at scroll-top on first paint or the hero sized to end at it
   reserves a strip of nothing until the chunk resolves — the exact seam this
   amendment deletes, popping back in. Pin: render the landing with the
   below-fold chunk suspended; assert the ribbon is present and the hero's
   bottom edge meets it.
5. **Reserved space + the z-ladder (previously unruled):** with the body as
   scroll container and the ribbon fixed, the document's last ribbon-height is
   permanently occluded at max scroll (the scroll-to-bottom FAB lands exactly
   there) unless the landing root reserves
   `padding-bottom: CHROME.ribbonLanding` — DESKTOP ONLY. [Supersession note,
   recorded: the §06 item-11 flush-bottom order ("zero bottom padding; the band
   sits flush at page end") is superseded ON DESKTOP by the owner's own LD-3b
   letterbox model — the band now ends at the ribbon's top edge, which IS the
   visible page end between the rails; MOBILE keeps the flush document-end
   placement.] The ribbon takes an explicit z-index in the existing ladder,
   recorded here: film backdrop 0 < landing content 1 < header 50 <
   **ribbon 60** < mobile nav 100 < FAB stack 200 < TableView 1100 — under the
   mobile nav is correct since mobile un-fixes the ribbon anyway; unset would
   paint it UNDER the z-1 content.
6. **Mobile/safe-area:** fixed bottom bars fight collapsing browser chrome; below
   the mobile breakpoint the ribbon is NOT fixed — it reverts to LD-3's
   document-end placement with the LD-3 clearance rule
   (`bottomClearance(CHROME.footerPadMobile)`, keeping the row above the fixed
   mobile bottom nav — a bare safe-area inset does not clear it). Desktop
   letterboxes; mobile ends on the band.
7. LD-3's pins update per its respecced pin (no IN-FLOW sibling below the
   ribbon, fixed chrome enumerated; scrollHeight = band bottom + desktop
   reserve); the scrim-terminus pin is new — at scroll-top the hero's COMPUTED
   GRADIENT TERMINUS equals the ribbon's top edge (asserted at two viewport
   heights, the seam's regression test).

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

**Binding rulings [CORRECTED 2026-08-02 (self-audit): rulings 1, 2, 4, 5, and 6
were written against substrate that does not exist or already exists — each is
respecced against the tree]:**
1. **PARENTS BECOME LINKS (corrected — they are BUTTONS today).** The desktop
   ribbon renders `<button type="button" onClick>` for every NAV cell
   (App.jsx:574-576), so middle-click, cmd-click, and crawlability already do
   not work — "exactly as today" and this ruling's own rationale could not both
   be satisfied. WORK ITEM: nav cells become real
   `<a href={viewToPath(id)}>` with onClick preventDefault → handleNavClick —
   the shipped house idiom (GalleryHubPage.jsx:177 renders a real `href` and
   SPA-navigates) — preserving aria-current and the divider positioning
   context. The dropdown is a shortcut layer, never a replacement.
2. **EVERY ITEM IS A ROUTE — respecced to the REAL URL grammar.** The cited
   "TC-0 sub-tab deep-link precedent" is a QUERY PARAM read once at mount
   (`?tab=` in HowToUse.jsx:390, `?mode=custom` / `?cat=` in
   CompendiumPanel.jsx:129-137), never a path segment — `resolveLocation`
   returns `params:{}` for exact paths and drops the query except view/slug;
   the components do the reading. The v1 path examples were all broken:
   `/compendium/custom` resolves as a compendium ENTRY page (routes.js:131);
   `/gallery/maps` and `/gallery/mine` are swallowed by the dossier-slug
   catch-all (routes.js:134) and would permanently shadow user-derived slugs;
   `/about/guide` cannot resolve (`/about` does not exist — About is view
   `howto` at `/how-to`, routes.js:55, so it falls to notFound → /create);
   `/account/security` likewise. THE CORRECTED TARGETS:
   - Compendium ▾ Built-in Catalog → `/compendium`; Custom Content →
     `/compendium?mode=custom` (shipped today).
   - About ▾ What this Is → `/how-to`; Practical Guide → `/how-to?tab=guide`.
   - Gallery ▾ Settlements → `/gallery`; Maps → `/gallery?tab=maps`;
     Campaigns → `/gallery?tab=campaigns`; My Saves → `/gallery?tab=mine`
     (auth-gated). NEW WORK: GalleryPage's tab is local `useState` — the tab
     param threads through AppViews' route props, never a second local tab
     source. (If literal path forms are ever wanted, they must register AHEAD
     of the slug regex plus a reserved-slug denylist at publish for
     maps/campaigns/mine — recorded, not chosen here.)
   - Account ▾ → `/account?tab=profile|security|subscription|support|data|
     preferences`. NEW WORK: AccountPage's section is local
     `useState('profile')` (AccountPage.jsx:75) with no route read/write —
     it gains a mount-time query read + URL sync so the six sections become
     shareable deep links.
   The menu is a list of real `<a>`s to those URLs, zero JS-only navigation.
3. **THE TRIPLE-MODE MENU (a11y law):** hover opens (with hover-intent grace so
   diagonal travel doesn't flicker), FOCUS opens (keyboard: the parent is a
   focus stop; arrows traverse items; Escape closes and returns focus), TOUCH
   opens on tap with the caret as the toggle (hover does not exist on touch;
   the parent link still navigates on direct tap). Menu roles per the house
   tablist discipline; never a hover-only surface.
4. **THE MENU MIRRORS THE SHIPPED SHELVES (corrected — they exist NOW).**
   Gallery ▸ Maps and Campaigns are SHIPPED tabs today (GalleryMaps.jsx,
   GalleryCampaigns.jsx; GalleryPage renders an unconditional three-tab
   Segmented, :168-172), so the v1 render-when-populated gate was citing a
   PARKED, owner-gated design (DESIGN_GALLERY_SHOWCASE is stamped "nothing
   here builds until the owner opens it" — not binding law on this order) and
   would have given one shelf two truths: the menu hiding Maps while the page
   shows the tab. The menu renders Maps and Campaigns unconditionally,
   mirroring the page; the showcase's render-when-populated law waits for its
   own activation. My Saves is auth-gated (absent, not disabled, for
   anonymous — the presence discipline) — and My Saves is a VIEW FILTER, never
   a `galleryItemKind` member (the kind enum stays closed).
5. **ONE SAVES TRUTH (corrected — there is no third save class).** The real
   tables are TWO: `settlements` (settlement saves) and `saved_maps` — one
   table serving maps AND campaigns alike (a campaign row IS a saved_maps row;
   campaigns.js:4). My Saves is the CROSS-CATEGORY private view over those two
   tables, rendered as a Gallery tab — a PROJECTION of the same store/data the
   Library reads; no second saves list state anywhere. The Library
   relationship, updated to reality: Library ALREADY spans settlements and
   campaigns (its subtitle is "Your saved settlements and campaigns") —
   Library is the WORKSPACE lens; My Saves is the gallery-context lens
   (publish/share posture across categories) over the same rows. ⚠️
   OWNER-PARKED QUESTION recorded, not ruled: the eventual relationship
   between Library (settlement workspace) and Gallery ▸ My Saves
   (cross-category view) — two nav paths to saved work is fine as projections,
   but the long-game IA (does Library fold in when maps/campaigns mature?) is
   the owner's future call.
6. **ACCOUNT: THE SIX-TAB IA ALREADY EXISTS — the work is DEEP-LINKING, not a
   restructure (corrected).** `ACCOUNT_SECTIONS` already ships
   profile/security/subscription/support/data/preferences with a desktop left
   rail + MobileTabStrip (AccountNav.jsx); the only missing piece is ruling 2's
   URL sync. Mapping corrections against the shipped page: billing →
   Subscription and telemetry consent + export/delete → Data hold; the
   narration model picker lives in PROFILE today (threaded into
   AccountProfileSection), NOT Preferences; the shipped Preferences panel
   mounts ONLY the email opt-out toggles (AccountEmailPreferencesSection); and
   the feedback widget entry is the GLOBAL footer control, not an account
   section — Account ▸ Support is the FAQ/support tab (and LD-6 §3's
   refund-request route). Data is the privacy/trust surface and earns
   first-class placement.
   **THE SEVENTH SECTION (the menu must not orphan it):** the rail also ships
   the Surveyor-gated `AI & keys` BYOK section (`ACCOUNT_SECTIONS` id `ai`) —
   the paid chat surface depends on it. **[CHAIR RULING 2026-08-02, vetoable]:
   BYOK HOMES UNDER SECURITY** — the `ai` section folds into the Security tab
   as a Surveyor-gated subsection (presence discipline: absent when
   unentitled); the menu stays six items and Account ▾ Security is the keys
   surface's menu home; the recorded byok fail-open hazard travels with the
   surface unchanged. Also recorded so nothing is silently dropped: the
   elevated-only Developer Admin rail row and the page-foot Sign Out do NOT
   join the menu — the owner's six-item list is closed; both remain page-level
   affordances reachable from any Account item.
   **TWO OPEN FORKS — flagged for the chair, not decided here:** (a) whether
   the narration-model picker MOVES Profile → Preferences (the correction
   above states where it IS; a move re-points the prop thread); (b) the
   unmounted `AccountPreferencesSection.jsx` ("Product Preferences" — imported
   by nothing in src, pinned only by its own test): mount under Preferences or
   delete with its test.
7. **Vocabulary check at build:** the product's existing tab says "Built-in
   Catalog" — one spelling everywhere (default: the product's existing
   "Catalog" unless the owner orders the change to "Catalogue").
8. **LD-2 composition:** dropdown hover zones live inside each nav cell; the
   dividers (lines/chevrons) sit between cells and are unaffected; the journey
   trio (Create › Library › Realm) gains NO dropdowns in this order — it stays
   the clean arrowed path.
9. **DESKTOP-ONLY IN THIS ORDER (chair ruling — the v1 spec had no mobile
   story while mandating a touch mode).** The dropdowns exist only in the
   desktop ribbon; the mobile bottom nav is untouched — all three parents live
   in the fixed bottom bar on a phone, where cells have no caret room and any
   menu would open upward over safe-area chrome; ruling 3's touch clause
   covers tablet/desktop touch pointers, not the mobile bar. Every menu
   destination stays reachable on mobile through its page's own surface: My
   Saves via the Gallery page's own tab (never the nav), Account sections via
   the page's MobileTabStrip. Pin: every menu route resolves and its
   destination is reachable at the mobile breakpoint.

---

## LD-6 — THE ANNUAL TOGGLE (owner-ordered 2026-08-01; paid surface — owner-authorized
## by the order itself; implementation = the external implementer)

**The order:** the Cartographer card gains a monthly/annual toggle — $5.99/mo ↔
$59.99/yr (owner explicitly accepts the ~$11.89 discount) — switching both the
displayed price and the Stripe destination the Subscribe button targets. No new
box; the toggle lives inside the existing card.

**Spec:**
1. **Two Stripe Prices, one Product:** `cartographer_monthly` + `cartographer_annual`
   on the same Stripe product; the pair lives in billing CONFIG (single source),
   never hardcoded in the component. The toggle swaps which price/link the button
   uses. (If the current button is a Payment Link, mint the annual link the same
   way; if it is a checkout-session endpoint, the endpoint takes the priceId.)
   [CORRECTED 2026-08-02 (self-audit) — THE PRICE NUMBER'S REAL HOMES, named so
   the config-driven rule is executable: the displayed figure lives in THREE
   places today — the copy keys (`pricing.tiers.cartographer.priceLabel`/
   `priceSub`, PricingTierCards.jsx:50-51), the constant
   `TIERS.cartographer.priceCents: 599` in src/config/pricing.js:255 (owner
   sign-off comment 2026-07-17), and stripe.js:31, which re-derives a
   user-visible string from it with a HARDCODED `/mo` suffix for the
   PurchaseModal. The annual amount's home is a sibling `annualPriceCents` on
   `TIERS.cartographer` with the same owner-sign-off comment discipline;
   stripe.js's derived price string becomes cadence-aware (the modal must never
   say "/mo" to an annual subscriber); the copy keys gain annual variants.
   The live-pricing layer (src/config/livePricing.js / useLivePricing / the
   admin resync panel) touches per-model credit costs ONLY, never tier prices —
   verified 2026-08-02; a second cadence does not interact with it.]
2. **⚠️ THE DOUBLE-SUBSCRIBE GATE [CORRECTED 2026-08-02 (self-audit): the gate
   ALREADY EXISTS — what is missing is the portal's plan-switch capability]:**
   the subscribed-state gate ships at all three premium entry points today
   (PricingPage.jsx:221-224 swaps the CTA to 'Manage subscription' →
   manageBilling; PurchaseModal.jsx:288 gates the premium upsell;
   AccountSubscriptionSection.jsx:160-170 shows 'Manage subscription'). The
   v1 "verify the gate at build" clause is replaced by the two REAL items:
   (1) **owner/dashboard task** — the Stripe Customer Portal session is created
   BARE today (`billingPortal.sessions.create({ customer, return_url })`,
   create-customer-portal/index.ts:136-137, no `configuration`, no
   `flow_data`), and whether the portal offers a monthly↔annual switch AT ALL
   is a Stripe Dashboard portal-configuration setting outside this tree:
   enable `subscription_update` with BOTH Cartographer prices and a proration
   behavior in the portal configuration, or pass explicit
   `flow_data: { type: 'subscription_update' }` from create-customer-portal —
   without one of these, "plan switch with proration" cannot be delivered from
   code. (2) all three gates key on the LOCAL store tier, so an unhydrated or
   webhook-lagged subscriber still sees the raw checkout button: the checkout
   CTA hard-blocks while `authLoading` (recommended default, vetoable — the
   anti-double-subscribe posture this item exists for).
3. **THE REFUND POLICY — RULED BY THE OWNER 2026-08-01 (supersedes the parked
   call):** NO REFUNDS for subscriptions — every purchase is one-time and final,
   for all purchasers. A refund may be REQUESTED — through FEEDBACK & SUPPORT
   or the Account ▸ Support tab (both routes valid; owner-specified 2026-08-01;
   both land in the same support channel, one queue never two) — but a request
   is never a guarantee; grants are owner-discretionary.
   Consequences: (a) the policy is WRITTEN INTO TERMS and disclosed clearly at
   checkout BEFORE annual goes live — with the standard except-where-required-
   by-law carve-out for the legal reviewer's judgment (some consumer
   jurisdictions impose statutory rights no contract can waive; the carve-out
   is the lawyer's to word, flagged here so the tail's legal review sees it);
   (b) the webhook-train interaction SHRINKS but does not vanish — any
   DISCRETIONARY refund granted before the train deploys still claws back whole
   seats (the standing order: issue none until then applies to goodwill grants
   exactly as it did to policy refunds); (c) cancellation stays self-serve and
   immediate-effect-at-period-end in the portal (no-refunds never means
   no-cancellation — the subscription simply runs out its paid term).

   **[SCOPE + SURFACES NOTE — CORRECTED 2026-08-02 (self-audit); the owner's
   ruling above stands verbatim, this note bounds and operationalizes it:**
   - **Scope:** the ruling covers SUBSCRIPTION and one-time TIER purchases.
     Two shipped guarantees are PRODUCT MECHANICS, not discretionary refunds,
     and are explicitly carved out — they survive: the automatic credit return
     on a failed narration (TermsPage.jsx:137-141; restated at
     copy/pricingPage.js:95 and :161) and the single-dossier
     undelivered-PDF make-good (TermsPage.jsx:143-150). The Founder
     charged-in-error review (:159-163) is an error-correction lane, not a
     refund grant, and also survives.
   - **The policy surface is NOT blank — WORK ITEM, the copy surfaces that
     change WITH this ruling, by file:** (1) TermsPage.jsx §terms-refunds
     (:135-177) — drop "The Cartographer plan is billed monthly through
     Stripe" (falsified by the annual toggle) and "We do not generally refund
     partial months…" (softer than the ruling), restate the subscription
     policy, PRESERVE the credit + PDF guarantees as the distinct product
     classes above; (2) the FAQ key `en.js:1549 refundWindow` — it renders
     inside Account ▸ Support, the very tab this ruling routes requests to;
     (3) copy/pricingPage.js:95 and :161 — survive as product mechanics,
     re-verify wording against the new Terms; (4) copy/footer.js:36 'Refunds'
     and the `/refunds` route alias (routes.js:83 → TermsPage
     scrollToId="terms-refunds") must still point somewhere TRUE after the
     rewrite; (5) PurchaseModal.jsx:318-323's checkout-adjacent Terms link.
     Pinned — an absence or contradiction here is the same legal-defect class
     LD-3 names.
   - **The checkout disclosure has NO substrate today — its own WORK ITEM:**
     create-checkout's sessionParams set no `custom_text` and no
     `consent_collection`, so "disclosed clearly at checkout" is currently
     emitted by nothing. Ship Stripe `custom_text.submit` on subscription
     sessions, or an in-app pre-checkout confirm — named, built, and pinned
     before annual goes live.]**
4. **Honest math on the face:** the annual side shows the real numbers in house
   voice — "$59.99 a year · two months free" (or equivalent-monthly phrasing,
   owner's taste) — the discount is the lever; show it, never bury it.
5. **MONTHLY IS THE DEFAULT STATE** (anti-dark-pattern ruling, vetoable): the
   toggle opens on monthly; annual is chosen, never preselected.
6. **The toggle is a real control:** labeled radio-pair/switch semantics, keyboard
   operable, state readable by screen readers; PRICING copy keys centralized as
   today (the PREMIUM_PITCH discipline — coordinated with its pinned tests).
   [See item 1's corrected note for where the price NUMBER actually lives —
   "copy keys centralized" understated it: the constant and stripe.js's derived
   '/mo' string change with the copy keys or the modal lies to annual buyers.]
7. **Entitlements — TWO WEBHOOK BLOCKERS, not a grep [CORRECTED 2026-08-02
   (self-audit): the v1 "annual should be free if the webhook is honest" was
   false — the webhook is NOT cadence-neutral, and an annual subscriber today
   would pay $59.99 and receive ZERO credits]:**
   - **(W-1) Annual price-id → credits mapping (BLOCKER).**
     `grantMonthlyAllowanceIfNeeded` gates the 30-credit Cartographer allowance
     on the invoice's first line price id equalling `STRIPE_PRICE_PREMIUM`
     (stripe-webhook/index.ts:366-373) and grants ONCE PER INVOICE. An annual
     price id is by definition not the monthly one, so the gate positively
     identifies the annual invoice as a non-Cartographer plan and SKIPS the
     grant entirely; and even once widened, Stripe emits ONE subscription_cycle
     invoice per year — 30 credits per YEAR, a 12x entitlement shortfall, with
     expiresAt at the annual period end. The gate widens to a SET of
     Cartographer price ids, and the annual credit CADENCE is an OWNER-GATED
     ruling recorded as an open fork (proposed default: a monthly drip keyed on
     the subscription anniversary, deduped per period exactly like the existing
     credit_ledger invoice check; alternative: 360 up front). The toggle DOES
     NOT SHIP until the cadence is ruled and the mechanism built.
   - **(W-2) Unknown-product-key FAIL-CLOSED guard with alert (BLOCKER).** A
     buyer must never pay-and-get-nothing: an invoice whose price id maps to no
     known product key fails CLOSED — surfaced loudly (alert/log-with-alarm),
     never a silent skip that keeps the money and grants nothing. This guard is
     what makes adding the second price safe against every FUTURE price id too.
   The remaining half of the v1 clause stands: the webhook mirrors Stripe's
   `current_period_end` regardless of cadence — verify no period-length
   assumption in the entitlement READS (that half really is a grep).
8. **Analytics:** toggle-state + checkout-initiation events extend the existing
   funnel vocabulary, consent-gated as ever.

---

## LD-7 — THE POPUP SCOPE LAW (owner-ordered 2026-08-01; implementation = the
## external implementer; a live bug + the general law it reveals)

**The bug (diagnosed):** the Cartographer World-Map upsell (PricingMomentCard)
follows the user OUT of the Realm page — it mounts at App level (App.jsx:70 lazy
mount) off a store moment-flag that no route change clears.

**THE LAW (owner, verbatim intent — applies to ALL popups):**
1. A popup is PAGE-SCOPED BY DEFAULT: it never follows the user off the surface
   that spawned it (leaving the page unmounts it, immediately).
2. Leaving is NOT dismissing: an undismissed popup RE-APPEARS every time the
   user returns to its owner page, until they actually dismiss it.
3. Cross-page popups exist ONLY by explicit design declaration — a popup that
   travels must say so in its registration, never by accident of mount point.

**Spec:**
- Every popup/moment declares `{ scope: pageKey | 'global' }` in one registry
  (the moment system's own table — no scattered mount-point logic). The App-level
  host stays (lazy chunk economics unchanged) but RENDERS a moment only when the
  active route matches its declared scope; route change auto-suppresses without
  writing dismissal state (law 2 falls out: the flag survives, the render gates).
- Dismissal (`Not now` / ✕) writes the per-user persisted suppression exactly as
  today; it remains the ONLY permanent suppressor. [Parked owner knob, default
  ships: whether `Not now` suppresses a moment forever or re-arms when its
  triggering condition re-fires after a long cadence band — today's behavior
  stands until ruled.]
- AUDIT SLICE (the law applied retroactively): enumerate every popup/overlay/
  moment in the tree (PricingMomentCard's moment kinds, welcome-back card, save
  quota nudges, auth modal, feedback prompts, held-docket surfaces…) and classify
  each page-scoped vs cross-page in the registry — the auth modal and the held
  adjudication docket are the obvious legitimate cross-page members (the docket
  is coup-guarantee law, never suppressed by navigation). The classification
  table lands in the registry as data, pinned by a walker: no popup renders
  without a declared scope.
- Pins: the Realm upsell unmounts on navigate-away and re-shows on return
  (undismissed) — the exact reported sequence as a DOM test; a declared-global
  moment still travels; dismissal survives reload (persisted).

---

## LD-8 — THE CREATED SETTLEMENT'S FIRST IMPRESSION + THE RIBBON CLIP
## (owner-ordered 2026-08-01; implementation = the external implementer)

**Order 1 — "How this was simulated" must not lead.** The simulation-record box
(SimulationDrawer/PipelineRail) currently renders as the FIRST thing on a freshly
created settlement. The settlement itself leads — its identity is the first
impression; the record's EXISTING lower placement (the "same choices and seed
rebuild the same settlement" drawer) becomes its ONLY placement. Remove the
top-of-page instance; never two mounts of the record on one page (one surface,
one home).

**Order 2 — the two pin buttons are REMOVED ENTIRELY:** "A new roll can rename
the settlement · Keep the name" and "A new roll can move it to different ground ·
Keep this ground" (LockControls.jsx) leave the created-settlement surface, not
relocated — deleted from it. NOTE for the record: the underlying reroll-
preservation machinery (store-level pins) remains built and merely unadvertised —
reachable-but-unadvertised trips no ratchet; if the owner later wants the pin
CAPABILITY retired too, that is a separate order touching the reroll lanes
(history-reroll preservation has an open owner question already; do not entangle).

**Order 3 — the ribbon clip (a layout defect, fix globally):** page content
scrolls BEHIND the top ribbon and gets visually clipped mid-element (the
screenshot shows the drawer's intro line half-swallowed). The fix is the standard
fixed-chrome inset done ONCE, structurally: the scroll region carries top inset
from the frozen chrome source, and every in-page anchor target carries
scroll-margin-top of the same token, so nothing ever slides under the ribbon
mid-glyph. With LD-3b's two-ribbon model this generalizes: content is inset
between BOTH chrome tokens. Pin: scroll any dossier anchor into view — its top
edge lands below the ribbon, asserted at two viewport sizes.
[CORRECTED 2026-08-02 (self-audit), two placement facts: (1) the chrome tokens
live in theme.js `CHROME` — `headerMobile` (59) / `headerDesktop` (60), plus
the existing `CHROME.scrollPadDesktop` (124) which exists for exactly this
anchor-clearance job — never a tokens.js LANDING_HEADER_H (see LD-3b constraint
3; one constant cannot cover both breakpoints). (2) The header is `position:
sticky` (App.jsx:546), not fixed — the clip is the anchor/programmatic-scroll-
under-sticky-chrome class, so the cure is `scroll-padding-top` on the scroller
+ `scroll-margin-top` on anchor targets from the CHROME tokens, exactly as the
order prescribes; no header repositioning is implied.]

---

## LD-9 — THE ABOUT SPLIT (owner-ordered 2026-08-02; full architecture in
## docs/DESIGN_ABOUT_PAGES.md — this entry is the pointer)
Two distinct pages (What this Is · Practical Guide), collapsing cards removed,
page headers matching the Compendium/Gallery/Library grammar (extracting the
shared PageHeader if the three share only a convention — single-writer for
headers), the About dropdown gains FOUNDERS as its third item (the Hall's nav
home). Mapping totality + anchor survival + header parity pinned. See the doc.

---

## LD-10 — CONSENT DEFAULTS: ALL THREE ON (owner-ordered 2026-08-02)
- Product analytics, generator improvement, and anonymous market research all
  DEFAULT ON for new accounts. The third card's "Off by default." sentence
  dies; all three adopt the middle card's honest grammar ("It's on by
  default; you can turn it off here at any time").
- **THE DECIDED-STATE LAW:** a default is for the undecided — any account that
  ever explicitly set a toggle keeps its choice through this change (defaults
  flip for the unset only; no override of a made decision; pinned).
- **LEGAL FLAG (routed, not relitigated):** the market-research toggle
  describes aggregate data that "may be shared or licensed" — jurisdictions
  with consent-first regimes (EU/UK) may require a regional consent variant
  regardless of the global default. Joins the standing legal packet (Terms
  rewrite + covenant). Default-on ships as the product's posture; counsel
  rules the regional question.

---

## LD-11 — NAV RESET-ON-SELF-CLICK (owner-ordered 2026-08-02)
**The order:** clicking a ribbon button while ALREADY on its page resets that
section to its default view — deep in Advanced Configuration, clicking CREATE
returns to the mode-choice entry (Instant / Basic / Advanced); same grammar
for Library, Compendium, Gallery, Realm, Account, etc.
- **The reset map is DATA on the route registry** (routes.js — LD-2's
  no-second-truth law extends): each section registers its default view +
  reset handler; the nav's onClick compares active section vs target and
  dispatches reset-or-navigate. No scattered per-page hacks.
- **⚠️ THE DIRTY-STATE GUARD (the one binding safety law):** reset NEVER
  silently discards work — a dirty wizard (Advanced Config mid-edit) fires
  the EXISTING leave-confirm machinery; clean state resets instantly. An
  accidental self-click must never cost a user twenty dials of work.
- **TRANSIENT RESETS, PREFERENCES SURVIVE:** reset returns NAVIGATION state
  (drill-ins, wizard steps, sub-views, scroll) to the section default; it
  never erases PERSISTED preferences (TC-0's persisted map sub-tab choice,
  saved sorts — settings are not navigation; the two laws compose).
- **Already-at-default self-click = scroll to top** (the mobile-tab idiom's
  second half; cheap, familiar, vetoable).
- LD-5 composition: off-page click navigates exactly as today; dropdown
  hover/caret behavior untouched; a11y — reset moves focus to the page top
  landmark and announces via the existing route-change announcement.
- Pins: dirty-confirm fires; clean reset lands on the registered default;
  persisted prefs survive a reset; off-page clicks never reset; the reset
  map's totality (every ribbon section registers one).
