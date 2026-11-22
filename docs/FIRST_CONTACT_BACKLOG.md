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

## ⭐ LD LADDER — BUILD STATE, MEASURED 2026-08-03 (Lane F; CHECK-GIT-FIRST receipts)
> Every row below was checked against the tree at `d6c5af8e`, not inferred from
> this document. SOL_QUEUE §2 item 21 asks for exactly this and deliberately
> claimed nothing; these are the receipts. **Read this block before dispatching
> any LD item** — one lane was already dispatched greenfield against an
> already-complete surface (operator messages), and the ladder now has three
> different kinds of "open".
>
> | item | state | receipt |
> |---|---|---|
> | LD-1 | ⛔ **OPEN, BLOCKED** | no `landingSettlementFixture.js`, no `MiniatureFrame`; see the STOP note in LD-1 below |
> | LD-2 | ✅ **BUILT** @ `cf7243ab` | `components/nav/NavDivider.jsx` + `NavRibbon.jsx`; `navDividers.test.jsx` 9/9 |
> | LD-3 | ✅ **BUILT** @ `5a6d7aef`; its landing exemption **SUPERSEDED 2026-09-16** (owner order, see THE PINNED FOOTER below LD-3b) | `components/footer/LegalRibbonRow.jsx`; the route-scoped suppression and the band's row mount are gone; `landingFooterMigration.test.jsx` 4/4 (inverted) |
> | LD-3b | ✅ **REALISED 2026-09-16 in its every-page form** (see THE PINNED FOOTER below LD-3b) | sticky global footer on desktop with only its links row floating (the rest tucked below the viewport edge until the end of the page), letterboxed hero, `pinnedFooter.test.jsx`, `bottomAnchoredChrome.walker.test.js`, `e2e/pinned-footer.spec.js` |
> | LD-4 | ⛔ OPEN, blocked by LD-1 | shares LD-1's frame contract and its blocker |
> | LD-5 | 🔶 OPEN (chrome only) | the Account deep-links (`?section=`) and all three About routes are LANDED by other lanes — LD-5's remaining work is the MENU LAYER, nothing else. ⚠️ the Messages amendment binds |
> | LD-6 | ⛔ OPEN, **OWNER-GATED** | no `annual` anywhere in `config/pricing.js` or `services/stripe.js`; W-1's annual credit CADENCE is routed to the owner (`cca61099`) and item 7 says the toggle does not ship until it is ruled |
> | LD-7 | 🔶 OPEN | no moment-scope registry exists; `PricingMomentCard` still mounts at App level (`App.jsx:74`) off a flag no route change clears — the reported bug is live |
> | LD-8 | 🔶 OPEN (order 3 only) | orders 1+2 are deletions (`GenerateWizard.jsx:518` top `PipelineRail`, `:484` `LockControls`); order 3 is the `scroll-padding-top`/`scroll-margin-top` cure from `CHROME`. **Order 2 CLOSED 2026-09-17** by the owner's second order (see DOSSIER AND REALM POLISH, Order 3): the whole "What a new roll keeps" section is removed and its stored keys no longer act. Order 1's top receipts panel was deleted by §767.2/§777 (`GenerateWizard.jsx` records it; `tests/components/createWorkflowRail.test.jsx` pins it) |
> | LD-9 | ✅ BUILT (Lane C) | the About split landed; §4 (the dropdown) belongs to LD-5 |
> | LD-10 | 🔶 OPEN | `PrivacySettings.jsx:187` still reads "Off by default." and the market toggle is still opt-IN |
> | LD-11 | 🔶 OPEN | no reset map on the route registry; no `resetSection` anywhere in `src/` |
>
> **⚠️ THE LADDER'S REAL GATE IS THE SIZE RATCHET, and it is not in any LD spec.**
> `src/App.jsx` and `src/components/OutputContainer.jsx` both sit at a
> TOLERANCE-0 ceiling (App.jsx at its frozen `scripts/.size-baseline.json`
> number; OutputContainer at **exactly 600**, its layer ceiling, unbaselined).
> Any LD item that adds a line to either file reds `sizeBaseline` AND eslint.
> LD-2 and LD-3 each paid for themselves by extracting a leaf and ratcheting the
> number DOWN (720 → 693 → 659), which is the pattern the remaining items must
> follow — budget the extraction into the item, do not discover it at the gate.

---

## LD-1 — THE LIVING MINIATURE (owner-ordered 2026-08-01; implementation-ready spec;
## assigned to the external implementer)

> ⛔ **STOP-AND-REPORT, Lane F 2026-08-03 — a substrate blocker the binding spec
> does not name.** DESIGN_LIVING_MINIATURE.md §3's DEMO MOUNT CONTRACT (work
> item LM-2b) requires threading a `demoMode` prop through
> `src/components/OutputContainer.jsx`. That file measures **exactly 600
> effective lines — precisely its layer ceiling** (measured with eslint's own
> Linter, the enforcer's rule). It carries no `.size-baseline.json` entry
> because it has never exceeded the ceiling, so **one added effective line makes
> it a NEW offender**: `tests/lint/sizeBaseline.test.js`'s exact-set arm reds and
> the `max-lines` layer rule errors. LD-1 therefore cannot land as specced
> without either net-zero surgery inside OutputContainer or a decomposition —
> and OutputContainer is not on THE DECOMPOSITION WAVE's list, so nobody is
> currently rowing toward it. **Budget that work INTO LD-1, or rule the
> decomposition first.** (The rest of LD-1 is unstarted: no
> `landingSettlementFixture.js`, no `MiniatureFrame.jsx`, and the fixture
> full-emission mode is not in `scripts/generate-landing-fixture.mjs`. Nothing
> here is a fault in the design — the ceiling simply moved under it.)

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

> ✅ **BUILT 2026-08-03 (Lane F) @ `cf7243ab`.** `components/nav/NavDivider.jsx`
> (inline SVG, `preserveAspectRatio="none"` + `vector-effect: non-scaling-stroke`
> so one viewBox serves every bar height at a matched hairline weight) and
> `components/nav/NavRibbon.jsx` (the ribbon lifted verbatim out of App.jsx —
> the shell was at its frozen ceiling, so the extraction paid for the feature and
> ratcheted 720 → 693). Placement is DERIVED via `dividerKind` → `flowsInto` →
> NAV_FLOW, never a boundary map, and `navDividers.test.jsx` (9 tests) censuses
> the DOM against that derivation rather than against a frozen list. The desktop
> ribbon stopped mounting `NavFlowArrow`; the MOBILE bar keeps it, and
> `navFlowArrows.test.jsx`'s desktop half became an absence pin WITH a positive
> control so it can never pass on a ribbon that simply lost the mark. Three
> negative controls executed. **STILL OPEN, unchanged:** the ⚠️ TASTE CALL on the
> trio's OUTER boundaries (WELCOME|CREATE, REALM|COMPENDIUM) — the specced
> default (plain lines) SHIPPED, and flipping it is still a one-line predicate
> change in `dividerKind`, not a map edit. **DEFERRED, recorded:** the apex-
> clearance measurement is geometry, so it was satisfied by construction (16px
> label padding + a 7px mark in a gap-0 seam) rather than pinned — jsdom has no
> layout engine, and a fake geometry pin is worse than a recorded deferral.

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

> ⛔ **LANDING EXEMPTION SUPERSEDED BY THE OWNER, 2026-09-16.** "The footer is missing
> on the landing page. When we scroll, the header/ribbon remains sticky. The footer
> should be the same way on every page." The global footer now renders on every
> route, the landing included, and the landing band's own footer strip (its
> LegalRibbonRow mount, its brand-and-links row and the `landing.footer` copy keys)
> is deleted, so there is still exactly one footer. What LD-3 bought still holds: one
> row module, one copy truth, every legal and commercial destination reachable from
> the landing. Its deferred rect-above-the-bar pin is now written
> (`e2e/pinned-footer.spec.js`, the phone arm). See THE PINNED FOOTER below LD-3b.

> ✅ **BUILT 2026-08-03 (Lane F) @ `5a6d7aef`.** `components/footer/
> LegalRibbonRow.jsx` is the one row module; App.jsx mounts it inside the global
> footer on every non-landing route and `LandingBelowFold`'s band mounts it on
> the landing, so the copy cannot fork. Suppression is route-scoped
> (`view !== 'home'`). Pricing, Terms, Privacy, Feedback, © and the anti-AI line
> all migrated; the mobile clearance is
> `bottomClearance(CHROME.footerPadMobile)` on the landing mount only, pinned in
> BOTH directions so the migration cannot double-pad. The eager/downward import
> discipline holds by construction (App.jsx imports it statically; the lazy
> landing chunk imports it from there). App.jsx ratcheted 693 → 659.
> `landingFooterMigration.test.jsx` 6/6, driving the REAL landing through the
> shell with the lazy chunk awaited — the reachability pin is not vacuous — plus
> three negative controls. **DEFERRED, recorded not dropped:** the rect-above-
> the-bar pin (the Terms link's bounding rect sitting above the mobile nav) is
> layout and belongs to the `e2e/` harness; jsdom would make it vacuous. The
> `:461` "sits flush against the global app footer" comment and the document-end
> `scrollHeight` pin belong to LD-3b's model and were not written against the
> superseded one.

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

> ✅ **REALISED 2026-09-16, IN ITS EVERY-PAGE FORM** (owner order; see THE PINNED
> FOOTER directly below this section for what was built, what differs from the
> constraints here, and what was deferred). Constraints 1 (landing-route-only) and 5
> (a landing-only fixed ribbon with a reserve, ribbon z 60) are superseded by the
> order; constraint 6 (no fixed ribbon below the mobile breakpoint) is kept.

> 🔶 **OPEN — LD-3 landed first ON PURPOSE, and made this cheaper (Lane F,
> 2026-08-03).** LD-3b reuses "LD-3's migrated line" as its ribbon content; that
> row now EXISTS as an eager module (`components/footer/LegalRibbonRow.jsx`), so
> constraint 4's "its OWN tiny component rendered EAGERLY, NEVER inside the lazy
> below-fold chunk" is already satisfied — the conversion is a MOUNT MOVE (band →
> fixed chrome beside the header at the App.jsx mount) plus the hero/scrim work,
> not a new component. Three substrate notes for whoever takes it:
> 1. `computeScrollProgress` lives at **`src/components/loadingJourney/
>    useScrollJourney.js:40`** with the playhead hardcoded at
>    `scrollY + viewportH * 0.5` (constraint 2 names the function but not the
>    path); its pin is `tests/components/scrollJourney.test.js`.
> 2. `src/index.css:329`'s `.sf-landing-hero { min-height: 86vh }` and its
>    `background-attachment: fixed` are both still exactly as the 2026-08-02
>    self-audit described — the correction stands unamended.
> 3. ⚠️ **App.jsx is again the gate.** It is at its frozen number (659 after
>    LD-3), TOLERANCE-0, so mounting the ribbon there must be net-zero or pay for
>    itself with another extraction. Budget it into the item.
>
> Constraint 7's scrim-terminus pin ("the COMPUTED GRADIENT TERMINUS, not just
> the element's bounding box", at two viewport heights) is a real-browser
> assertion: it belongs in `e2e/`, and writing it in jsdom would produce exactly
> the vacuous pass the constraint's own wording warns about.

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

## THE PINNED FOOTER (owner orders 2026-09-16; supersedes LD-3's landing exemption, realises LD-3b)

**The first order (owner, against a 2000x1093 screenshot of the landing):** "On the
footer, keep it the same." Then: "The footer is missing on the landing page. When we
scroll, the header/ribbon remains sticky. The footer should be the same way on every
page. Do you see that gap where the shaded region breaks? Underneath that should be the
footer, as plain as day."

**The follow-up order (owner, later the same day, with two screenshots of the desktop
landing's lower half):** "I want to make one change to the footer work. The floating
piece is the one shown in the image above [only the links row: Pricing | Feedback &
support | Terms | Privacy | About, on the footer's dark band]. Only when a user scrolls
all the way to the bottom does it show the rest of the footer, including the logo, as
shown in the second image [the full, unchanged footer]." The footer's look and content
still do not change.

**Vocabulary.** THE BAND is the part that floats: the footer's top edge down to the top
of the row after the links row (the top border and padding, the links row and the gap
under it). THE TUCK is the rest (the home button, the copyright line and the bottom
padding), which hangs below the viewport edge until the end of the page. Measured in
Chromium at 2000x1093, 1280x800, 1024x768 and 800x900: band 51 px, tuck 70 px, footer
121 px. (The brief estimated the band at about 70 to 75 px from the owner's screenshot;
the measured distance to the home button's top is 51 CSS px, and the band is measured,
not tokenised.)

**What was built (uncommitted at hand-off; the chair commits):**
- `src/App.jsx`: one `<footer>` on every route. On desktop it is `position: sticky;
  z-index: 50`, the header's own mechanism and layer, with `bottom:
  calc(0px - var(--sf-footer-tuck, 0px))` (`FOOTER_TUCKED_BOTTOM`): a NEGATIVE offset by
  exactly the tuck, so only the band is held in view and, at maximum scroll, the sticky
  element reaches its natural spot and the whole footer shows. No script toggles
  anything and nothing animates. On phones it is in the flow on a low layer
  (`relative`, z-index 2; the tuck is 0px there, so the offset computes to 0px); its
  content, background, rule and padding are unchanged. App.jsx stays at 650 effective
  lines.
- `src/hooks/useChromeInsets.js` measures THE BAND (the footer's top edge to the top of
  the row after the links row, floored to whole px, so no pixel of the home button
  shows), THE TUCK (the footer's full height minus the band) and the header (floored),
  re-measures on a ResizeObserver over the header and the footer, and writes
  `--sf-footer-inset` (the band), `--sf-footer-tuck` and `--sf-header-h` on the document
  element; both footer values are `0px` whenever the footer is not pinned, and unmount
  removes all three. The links row is found by the stable hook `data-sf-footer-links`
  (`FOOTER_LINKS_ATTR`) on LegalRibbonRow's `<nav>`; the attribute changes nothing about
  how the row renders. The names, `FOOTER_INSET`, `FOOTER_TUCKED_BOTTOM` and
  `aboveFooter()` live in the leaf `src/lib/chromeInsets.js`, re-exported by
  `components/theme.js`.
- Four stylesheet rules, injected once by the hook as `<style id="sf-chrome-insets">`
  (`CHROME_INSET_RULES`): `html { scroll-padding-bottom: <band> }` so keyboard and
  nearest-aligned scrolls stop above the band (WCAG 2.2 SC 2.4.11); a matching
  `scroll-margin: <band> 0 -<band>` on the footer's own controls (see the judgment
  below); a print rule that lays the footer back into the flow; and THE KEYBOARD REVEAL,
  `.parchment-bg>footer:has(:focus-visible:not([data-sf-footer-links] *))
  { --sf-footer-tuck: 0px }`, so a tucked control with keyboard focus shows the whole
  footer, keyed on `:focus-visible` so a mouse press never makes the footer jump. None is
  in `src/index.css`, whose render-blocking budget (19,800 B,
  `tests/build/firstPaintNonJs.test.js`) had 5 B left; that sheet is unchanged at
  19,795 B.
- The landing hero's desktop LETTERBOX is an inline `minHeight` in the lazy HomeLanding
  chunk: `calc(100vh - var(--sf-header-h, 38px) - var(--sf-footer-inset, 0px))`, so at
  scroll 0 the dark band ends exactly at the band's top edge at every viewport height
  and header wrap; phones keep the 86vh rule.
- Every fixed bottom-anchored layer composes `aboveFooter()`, which now lifts by the
  band: the scroll-button stack (the owner's square arrow), the dossier-claim toast, the
  onboarding nudge, PostGenCoach, FeedbackWidget, PricingMomentCard, AiAnalystPanel,
  InterviewPanel, SurveyorWorkshop and the Realm map toast. The desktop Realm shell, the
  desktop Entity Inspector and the two lifted Surveyor panels subtract `FOOTER_INSET`
  (the band) from their viewport-sized heights.
- The landing band's `LandingFooter` and its `landing.footer` copy keys are deleted;
  `LegalRibbonRow`'s `clearMobileNav` prop is retired with its only caller; `#closer`
  gets a 48px bottom pad back.
- First paint (measured by replicating `tests/build/vendorPdfLazy.test.js`'s closure
  walk): raw entry closure 1,046,662 B at base `cb8f0f9e5`, 1,047,911 B after the first
  order, 1,047,944 B after the follow-up, against 1,048,000 (56 B spare); gzip 333,145
  of 337,000; Brotli 279,592 of 283,000; render-blocking CSS 19,795 of 19,800. After the
  review fixes (the same walk over a fresh `npm run build`): raw 1,047,948 B (52 B
  spare; the phone footer's z-index ternary is the 4 B), gzip 333,130, Brotli 279,514,
  render-blocking CSS 19,795. ⚠ The next eager byte needs its own extraction.
- Pins: `tests/components/pinnedFooter.test.jsx` (the tucked sticky offset, the registry
  layer, the band and tuck measurement from stubbed rects, 0px on phones, removal on
  unmount, the rule spellings, the letterbox height, the links-row hook),
  `tests/lint/bottomAnchoredChrome.walker.test.js` (every fixed bottom-anchored layer
  lifted or exempt by name, exact in both directions),
  `tests/components/landingFooterMigration.test.jsx` (inverted: the landing has the
  footer, one row), `e2e/pinned-footer.spec.js` (the geometry: only the band at scroll
  0, the whole footer at maximum scroll, on the landing at four viewports and on six
  routes; Tab to the home button reveals it; focusing footer controls mid-page never
  scrolls; a mouse press does not hold the footer open; a stand-in for the generation
  reveal's layer covers the phone footer's Terms link and sits under the desktop band),
  and the kill-list's `rgbaLiterals` ceiling lowered 166 to 163 for the deleted strip.
- Mutation coverage (review fix): `scripts/mutation-sweep.sh` areas 98 and 99 plant the
  two regressions the new invariant files exist for (the scroll-button stack losing its
  `aboveFooter`, and the footer's sticky offset written as `bottom: 0`, which is the first
  order's whole-footer shape), each claimed in `scripts/mutation-coverage-manifest.json`.
  Both were executed before landing with a copy backup and restore: the walker 11 passed,
  planted 2 red (LIFTED and EXEMPT), restored 11 passed; `pinnedFooter.test.jsx` 23
  passed, planted 2 red ((a) and (c) mobile /terms), restored 23 passed.
- Production performance (review fix, executed on this tree): `npm run
  test:e2e:performance` 2 passed, CLS 0.0003 on `performance-chromium` and 0.0035 on
  `performance-mobile-chromium` against the 0.1 budget; the `mobile-safari`
  pointer-targets spec 1 passed.

**How it differs from LD-3b's constraints, and why:**
- Sticky, not fixed: the footer keeps its space in the page, so no reserve has to track
  a content-sized footer, `scrollHeight` and the jump-to-bottom maths are unchanged, and
  the whole footer is always reachable at the end of a page.
- z-index 50 on desktop, not 60: 60 ties `floatingPanel` and wins that tie over the
  in-main Entity Inspector by DOM order; 50 matches the header and sits below
  `drawerScrim` (90). Phones take 2 (see the first judgment below).
- Measured CSS variables, not a `CHROME.ribbonLanding` token: the footer's height depends
  on the font, zoom and wrapping, and a few pixels short reopens the seam.
- Every page, not the landing only (the order), and mobile unchanged (constraint 6).

**Judgment calls (vetoable; say "veto" on the row to flip it):**
- JUDGMENT: the footer pins on desktop only (640px and wider, the `isMobile` breakpoint);
  phones keep today's in-flow footer above the fixed bottom nav, with no band and no
  tuck, so every mobile position computes exactly today's value. The one mobile change is
  its LAYER: the phone footer is `position: relative` (zero offset) on z-index 2,
  because the landing's fixed film backdrop (z 0) painted over an unpositioned footer at
  the end of the landing. That was found on a 375x812 screenshot, reproduced red by the
  e2e paint probe, and cleared. It was first z-index 50, the header's layer; the review
  lowered it to 2 because at 50 the in-flow phone footer painted over the generation
  reveal (PipelineReveal, fixed, z 45), which it had sat under before it was positioned,
  whenever the collapsed page sat scrolled to its end, and over the sticky mobile header
  on a landscape phone shorter than the header plus the footer. At 2 it clears the film
  and the landing's z-1 roots and changes no other order. The e2e reveal arm pins it and
  reds at 50 (executed: 2 failed with the old value, 20 passed with 2). Why the in-flow
  footer at all: the nav already holds the phone's bottom edge.
  Flipping it: pass `footerPinned=true` on mobile, place the footer at
  `bottomClearance(nav height)` and drop its 88px padding; every consumer already
  composes `aboveFooter`, so they follow.
- JUDGMENT (follow-up): the band ends at the TOP of the row after the links row, so the
  8px flex gap under the links stays in view and no pixel of the home button shows; it is
  floored and the tuck takes the fraction, so the band's top edge sits on a whole pixel.
- JUDGMENT (follow-up): the footer's own controls carry `scroll-margin: <band> 0 -<band>`.
  Without it, every focus on a footer link mid-page scrolled the document by about half
  a viewport and left the link where it was, because the root `scroll-padding-bottom`
  counts the band as obscured and no scroll can move a sticky element. Measured in
  Chromium at 1280x800: about 405 px per Tab through the band, and about 370 px per Tab
  in the whole-footer-pinned shape of the first car (so the defect predates the
  follow-up). With the rule, focus walks the whole footer with the scroll position
  unchanged. `scroll-padding-bottom` itself is kept, as the brief asked.
- JUDGMENT (follow-up): the keyboard reveal keys on `:focus-visible` of any control
  OUTSIDE the links row (today only the home button; the copyright line has no controls),
  not on focus in the band, so tabbing along the visible links never moves the footer.
- JUDGMENT (follow-up): the landing letterbox moved from an injected class rule to an
  inline style in the lazy HomeLanding chunk, and the injected sheet's marker became an
  `id`, to pay for the follow-up's bytes: the probe build of the follow-up as first
  written measured 1,048,213 B against the 1,048,000 B raw first-paint budget (213 B
  over). The budget was not raised. `HEADER_FALLBACK_PX` left the leaf with the rule
  (HomeLanding reads `CHROME.headerDesktop` directly).
- JUDGMENT: fixed layers lift by the band, not the full footer, as the follow-up brief
  asked, so mid-page they sit just above the band: a 48px centred stand-in at the
  dossier-claim toast's offset (`aboveFooter(24)`) clears the band by 24px at 1280x800
  with all five links painted. The price is paid in the last 70 px of scroll on a page,
  where the tuck rises into the lifted layers' line. MEASURED in Chromium on the landing
  at maximum scroll (a 420px centred stand-in, the toasts' own maximum width): at
  1280x800, 1024x768 and 2000x1093 a layer at the dossier-claim toast's and the
  onboarding nudge's offset, and at the Realm toast's `aboveFooter(20)`, covers ALL FIVE
  links of the links row (Pricing, Feedback & support, Terms, Privacy, About). This row
  first said such a toast would sit over the home button or copyright line; that was the
  shape before the pin, and it was wrong for the pinned footer. The feedback panel
  opened from the footer covers About at 1024x768 at the end of a page (no link at 1280
  wide), and PostGenCoach overlaps the footer's top 46px in the right corner at 1280x768,
  clear of the centred row at that width. The scroll-to-top button clears the whole
  footer by 2px at all three viewports (72 + 51 = 123 against 121), which is a
  coincidence of today's heights, not a guard. The toasts live 6 to 8 seconds and every
  covered link stays reachable once they go. Flipping it: add `var(--sf-footer-tuck,
  0px)` to the centred transient layers' offsets, which floats them 70px higher on every
  mid-page scroll.
- JUDGMENT: the landing band's brand-and-links strip (settlementforge, Compendium,
  Pricing, Account) is deleted rather than kept above the global footer, because the two
  together are the "TWO footers" LD-3 removed. Its destinations stay one click away
  (header Compendium, footer and closer Pricing, the account menu).
- JUDGMENT: `#closer` gets a 48px bottom pad so "Full pricing" does not sit on the
  footer's edge (item 11's flush bottom had no strip left to sit flush).
- JUDGMENT: StaleDeployNotice (the "updated while this page was open" alert, z 1000)
  stays over the footer, as an interrupting alert should.
- JUDGMENT: on desktop the generation reveal (PipelineReveal, z 45) sits under the pinned
  footer as it sits under the header, and its card stays centred on the full viewport.
  From a page at scroll 0 the band shows over its bottom edge. From a scrolled page the
  WHOLE footer (home button and copyright line included) shows over its bottom 121px:
  the reveal hides the output, the page collapses to the route reserve (about 87px of
  scroll, the reserve's measured figure on short desktop pages) and the browser clamps
  the scroll to that end, where the sticky footer rests whole (PLAUSIBLE: reasoned from the
  collapse and the reserve, not run with a live reveal). Resetting the scroll when the
  reveal mounts would restore band-only; that changes GenerateWizard's flow and is left
  to the chair. On phones the in-flow footer (z 2) stays under the reveal (the e2e arm,
  executed).
- JUDGMENT: z-index 50 popovers inside `<main>` (CompendiumGlobalSearch, the Realm toolbar
  menu) go under the band when opened within about 51px of the viewport bottom.
- JUDGMENT: the chrome-inset names live in `src/lib/chromeInsets.js` and theme.js
  re-exports them, instead of being defined in theme.js: a `src/hooks` file importing
  theme.js pulls theme.js (6 pre-existing tsc errors in its colour maths) into the
  full-typecheck gate (measured +6 against ceiling 167).
- JUDGMENT: the footer stylesheet rules are injected at runtime (the `lib/imFellFace.js`
  precedent; the CSP allows inline styles) rather than written into `src/index.css`,
  which had 5 B of render-blocking budget left.

**Deliberately deferred (documented, not bugs to re-find):**
- Engines without `:has()` (Firefox before 121) ignore the keyboard-reveal rule: there
  the tucked home button can take focus while below the viewport edge. Every other
  footer destination stays in the band, and the home button duplicates the header's own
  home control.
- LD-3b constraint 2, the film playhead inset: `computeScrollProgress` still measures at
  `scrollY + innerHeight * 0.5`, about 7px below the centre of the visible area between
  the 38px header and the 51px band (arithmetic, not measured). Fixing it re-times every
  film stop, a visible shift the order did not ask for.
- LD-3b constraint 7's computed-gradient-terminus pin: the e2e arms pin the hero's box
  against the band's top edge, not the scrim's computed gradient. With
  `background-attachment: fixed` the 0.7 terminal stop still lands at the viewport
  bottom behind the band (arithmetic, not measured).
- The `.app-route-main` reserve (72px against a 38px desktop header) still gives short
  desktop pages about 87px of scroll at 1280x800 (measured on /realm); at scroll 0 only
  the band shows, and the last 70px of that scroll reveal the tuck. Its own car.
- Existing mobile overlaps left as they were: AiAnalystPanel, InterviewPanel, the
  Surveyor door sheet and the dossier-claim toast over the mobile nav; `CHROME.bottomNav`
  says 57 where the nav measures 45; the Toast primitive composes `aboveFooter` only
  when a surface adopts it (the walker's OPAQUE row).
- Short desktop viewports: below about 714px tall the hero's natural content pushes the
  FOLLOW THE ROAD cue under the band at scroll 0 (a figure measured against the
  whole-footer shape, so the band's smaller height lowers it), and below about 741px the
  Realm shell's 500px floor makes the page scroll.
- Printing: the header, mobile nav and scroll buttons print as they did before; only
  the footer gained a print rule.
- The plan's walks at short desktop heights, partly run (review, 2026-09-16). WALKED in
  Chromium: the feedback panel opened from the footer at 1280x768 and 1024x768 (top
  357, bottom 701, band top 717) and at 1280x600 (top 189, bottom 533, band top 549);
  PostGenCoach after an anonymous generation at 1280x768 (top 468, bottom 693, band top
  717) and 1280x600 (top 300, bottom 525, band top 549). Mid-page every top stays below
  the 38px header and every bottom above the band; their end-of-page overlaps are in the
  lift-by-band judgment above. NOT WALKED, with the reason:
  - The Entity Inspector open at 768 tall: the anonymous /create dossier renders no
    entity links (the probe counted 0), so opening it needs a signed-in or saved
    dossier. Arithmetic only: at its maximum height (top 88, `calc(100dvh - 112px -
    band)`) its bottom sits 75px above the viewport bottom, 24px clear of the band
    mid-page, and the risen footer overlaps its bottom 46px at the end of a page.
  - The plan's collision 17, sticky top asides taller than the viewport minus the header
    and the band: the one live instance, the NextActionRail aside in
    `settlementDetail/SettlementDossierHero.jsx` (sticky, z 1, no height cap), renders
    only for a SAVED settlement. Its bottom 51px stay under the band until its container
    ends, 51px more than the viewport edge already hid; nothing becomes unreachable.
  - AiAnalystPanel, InterviewPanel, SurveyorWorkshop and PricingMomentCard at 768 and
    600 tall: they open only with a Surveyor entitlement or a pricing moment in the
    store. Their offsets compose the same `aboveFooter` as the walked panels.

---

## THE PAINTED ARROW HEADER (owner orders 2026-09-16; replaces the procedural ribbon)

**The orders (owner, 2026-09-16):** "Replace the arrow ribbon entirely with the following
image however appropriate. This is the arrow we were trying and failing to create, so I
created it. I do not want you to emulate it. I want some copy/cut/cropped/pasted version of
this arrow as the header/ribbon of the entire website." Then: "The top of the wooden shaft
(not the top feather) is where the page starts, so cut off that top feather." Then: "I leave
judgments to you." And of the footer: "keep it the same".

**The chair's rulings on the plan (vetoable; say "veto" on the row to flip it):**
- The design object in the header recon is the plan: one painted strip drawn as DOM segments
  with CSS masks (not a canvas), two stacked clips (the header's shaft band at z 50 and a
  sticky zero-height hang layer at z 35 carrying the feather and barb, with a content
  reserve), S_MAX 0.6, the word floor 0.48 and the 1024 switch.
- Below 1024 the COMPACT arrow (brand crop, a filler slot, the tail crop with the blank
  plate); the bottom bar shows six seats from 640 to 1023 (five below 640).
- The account's home is a parchment slip on the blank plate (Sign In or the account name);
  credits, Upgrade (still launch-locked with its pill) and Admin move into the plate's menu.
- Ship exactly the kit's `arrow-strip.q90.webp` (2133x182) and `arrow-filler.q90.webp`
  (183x70). The filler is cut from the painting's own plain-wood gaps. Every slot cut keeps
  at least FE px of plain wood on both sides; Compendium's two gaps are too narrow, so
  Compendium gets no slots.
- THE CROSSFADE LESSON: each slot's filler is painted OPAQUE first, spanning the slot plus FE
  on both sides, and only the painted segments fade over it (two layers that both fade dip in
  opacity and show the page through as grey bands).
- ONE CHANGE TO THE PLAN: the footer pins only in full-arrow mode (1024 and up). From 640 to
  1023 it is in normal flow at the page end with clearance above the bottom bar, and every
  footer inset variable is 0px there.
- Nav regions stay Button elements (links deferred), aria-current parity with today, the
  home control named "SettlementForge home" outside the nav, the anonymous "Sign In" name
  unchanged.

**Part 1, the paint engine (built and tested, not wired into App.jsx; uncommitted, the chair
commits):**
- `public/brand/arrow/arrow-strip.webp` and `arrow-filler.webp`: the kit's files byte for byte
  (sha256 matched at the copy), then the provenance credit written by
  `scripts/inject-ai-provenance.mjs` as container-only byte surgery. The ALPH and VP8 chunks
  are byte-identical to the kit's and the decoded pixels are identical (sharp decode compared
  before and after). Strip 68,530 B to 70,230 B; filler 3,310 B to 5,024 B.
- `scripts/ai-media-provenance.json`: two rows (origin `openai:gpt-image@2026-09-16`, agent
  OpenAI, model gpt-image 2.0 as the master's C2PA manifest names it, credit null because the
  master carries no human-readable credit, forbid `urn:c2pa` and `Made with Google AI`),
  `_counts` 52 to 54 present of 77, and an `_originals` note: the C2PA-bearing original is
  the owner's `~/Desktop/ChatGPT Image Sep 16, 2026, 08_15_41 PM.png` (sha1 e3bc3461...), the
  kit's copy lives in a temporary scratchpad, no manifest is fabricated, and whether OpenAI's
  terms require more disclosure is an owner or legal question.
- `tests/build/aiMediaProvenance.test.js`: `public/brand/arrow` joins MEDIA_ROOTS and
  PRESENT_COUNT moves 52 to 54 in the same change.
- `src/components/nav/arrowGeometry.js` (pure, JSDoc-typed): every table measured from the
  shipped strip's decoded pixels, and `layoutArrow({ clientWidth, full, short })` with
  `mapX`, plus `padTarget` for 44 px targets.
- `src/components/nav/useChromeWidth.js`: one external store (a guarded ResizeObserver on the
  document element, a resize fallback, the short-viewport query), no window access at
  module load.
- `src/components/nav/ArrowPaint.jsx`: fillers first and opaque, then masked segments; the
  band and hang parts; aria-hidden, alt="", no pointer events, one high-priority fetch.
- Pins: `tests/components/arrowGeometry.test.js` (23), `tests/build/arrowHeaderAssets.test.js`
  (22), `tests/components/arrowPaint.test.jsx` (12). Seven negative controls were executed
  by breaking the source and restoring it (a cut moved onto Gallery's G, Create's region
  moved onto binding 2, the hang cut short, segments painted before fillers, the observer
  never disconnected, a mask on the fillers, the uncredited kit filler shipped): each went
  red in its arms and green again once restored.

**Measured corrections to the plan (JUDGMENT rows, vetoable):**
- JUDGMENT: FE stays 10. Under the shipped strip's own measurement every one of the kit's
  eleven prototype cuts (558, 657, 713, 825, 881, 982, 1234, 1350, 1413, 1516, 1596) has ten
  plain columns on both sides. The addendum's first run (550..567) was two columns short at
  its left; the pixels are plain from 548.
- JUDGMENT: the compact join is 558 / 1596, not 511 / 1612. Column 511 has five columns of
  wood to its left and the first binding at 512, so no crossfade fits there. The brand crop
  now carries the first binding; the compact arrow's natural width is 1095 strip px and its
  scale min(0.6, cw / 1135), so phones render about 5 percent smaller than the plan's figures
  (390 px: band 23.4 px, home 176 px wide, plate 87 px, slip 49 x 12.4 px).
- JUDGMENT: with no Compendium slots the full arrow has 12 shares, not 14: uncut below 1303.8
  px (s peaks at 0.611 at 1303, above S_MAX as the plan's rule intends), S_MAX up to 2597.4 px,
  then one filler tile per share. 1280 renders as one uncut image; 1440 inserts 13.4 px of
  wood per share; 1920, 53.4 px.
- JUDGMENT: the barb reserve is 41 rows, not 39 (the barb's alpha ends at row 108), and the
  hit regions run between the MEASURED binding edges (Create 547..668, Library 702..836, Realm
  870..994, Compendium 1027..1187, Gallery 1219..1364, About 1397..1530).
- JUDGMENT: row 0 is opaque across 82..1946 and 1989..2055, not the whole of 82..2055: the
  painting has a see-through notch where the arrowhead's upper barb leaves the socket.
- JUDGMENT: the slip sits BETWEEN the plate's rivets (1683..1825 x 13..49; the flat field is
  1672..1833 x 11..51, the rivets at 1664..1679 and 1829..1843). The plan's 1672..1833 x 18..50
  would cover both rivets.
- JUDGMENT: `scripts/inject-ai-provenance.mjs` wrote a hard-coded 2026-08-24 into
  `sfp:restoredOn` and its C2PA note, which would have stamped a false date into the arrow
  files. A row's own `restored` date now wins. All 46 earlier rows record 2026-08-24, so their
  packets are unchanged: stripping and re-injecting all 46 reproduced the shipped bytes
  exactly, before and after the edit.
- ⚠ FINDING FOR PART 2 (contrast on the real pixels, pinned in arrowHeaderAssets (g)): the
  plan's "INK focus ring, 4.30:1 at the 5th percentile" does not hold across the band. INK
  clears 3:1 against the darkest 1 percent of plain wood only on rows 4 to 23. PARCH_100
  clears 3:1 against the lightest 1 percent only on rows 37 to 66. On rows 0 to 3, 24 to 36
  and 67 neither does, so a one-colour ring or rule cannot meet 3:1 around a painted region;
  a two-tone INK and PARCH_100 ring (15.2:1 between its own colours) can. The active-page rule
  rows (52 and 53, under every descender) take PARCH_100 at 8.3:1 or more and INK at 1.26:1 at
  best. The house bronze `#a0762a` is 1.26:1 against the median wood.

**Deliberately deferred (documented, not bugs to re-find):**
- `src/hooks/useChromeInsets.js` already writes `--sf-header-h` (the measured header height,
  floored). The plan makes ArrowHeader's layout effect the only writer of that name; part 2
  must retire or reconcile the hook's write so there are not two writers.
- `THIRD-PARTY-NOTICES.md` section 7 and `public/third-party-notices.html` do not yet name the
  OpenAI-generated header art. A disclosure edit is an owner or legal surface and was not
  made.
- The lighting census walker reds on the three new test files (files 2,584 to 2,587); its
  governed refreeze belongs in its own commit after the code commit.
- The two new pin files and the render contract are not enumerated invariants under
  `tests/lint/mutationCoverage.shared.mjs` (their names carry no invariant token and they sit
  outside the enforcer trees), so no manifest rows are owed; the plan's mutation-sweep areas
  for the new guards wait for part 2's header test.
- Not built, no e2e and no browser seam measurement yet (part 2): the crossfades, the
  filler's repeat and the band-to-hang boundary still need the seam metric at DPR 1, 1.25, 1.5
  and 2 in Chromium and WebKit, and owner review.

**Part 2, the header in the app (built and tested; uncommitted, the chair commits):**
- `src/components/nav/ArrowHeader.jsx` is mounted once by App.jsx for every width: the sticky
  shaft band (z 50, height `--sf-header-h`, transparent, no shadow, filter, transform or clip)
  holding the band paint, the home control ("SettlementForge home", outside the nav), the
  `<nav aria-label="Primary">` of six painted words (full arrow only, NAV order, keyed by id,
  `aria-current` when `view === id`, a PARCH_100 rule under the current word) and the account
  plate; then, as its next sibling, the zero-height sticky hang layer (z 35, no pointer events,
  aria-hidden, `sf-arrow-hang`). Its layout effect is the one writer of `--sf-header-h`,
  `--sf-arrow-hang`, `--sf-arrow-clear`, `--sf-arrow-barb-clear` and `--sf-bottom-nav-h`
  (names in `src/lib/chromeInsets.js`, re-exported by theme.js with their var() strings and
  `aboveBottomNav`). App.jsx keeps `handleNavClick`, every tier comparison, the skip link and
  `<main>`.
- `src/components/nav/ArrowControl.jsx`: every control is a transparent Button primitive over a
  painted rectangle (no raw buttons), with `--sf-focus: INK`, a PARCH_100 inner band while it has
  keyboard focus (the two-tone ring part 1's pixel finding requires), a PARCH_100 hover wash, no
  radius and no shadow. Phones and coarse pointers get 44 x 44 targets through `padTarget`.
- `src/components/AccountMenu.jsx` is the plate: a parchment slip between the rivets reads
  "Sign In" (the accessible name, unchanged) or the account name; the menu adds the credits row
  ("..., N credits remaining", to pricing), Upgrade (free tier only, native-disabled with
  AvailableAtLaunchPill while `purchasesOpen()` is false) and Admin panel (elevated only), and
  completes the menu-button pattern (Enter / Space / ArrowDown / ArrowUp open and focus a row,
  arrows / Home / End move over enabled rows, Escape and a choice return focus to the plate, Tab
  closes, `aria-controls`, rows out of the Tab order).
- The bottom bar shows below 1024 px: five seats on phones, six from 640 (MOBILE_NAV_PRIORITY
  order). THE CHAIR'S ONE CHANGE, landed: `useChromeInsets(!narrow)` pins the footer only with the
  full arrow; from 640 to 1023 the footer is `relative` on z 2 in the flow, its look unchanged,
  both footer variables 0px, and `.parchment-bg` pads its bottom by `BOTTOM_NAV_H`. The hook no
  longer measures or writes the header height (the part 1 two-writers deferral is closed).
- Every consumer of the old header numbers moved onto the painted lengths: main's top padding
  reserves `ARROW_HANG` on every view but the landing (whose hero now starts under the
  transparent header), WizardOutputToolbar pins at `HEADER_H` (and turns `visibility: hidden`
  after its mobile slide), GenerateWizard's scroll padding, the Realm shell and RealmMobileGate,
  the dossier rail, the Entity Inspector, the Gallery sidebar, `ANCHOR_OFFSET`
  (`calc(ARROW_CLEAR + 24px)`), the checkout toast and CampaignSyncBanner (below the band), and
  every bottom-anchored layer's desktop branch (`aboveBottomNav`, so none lands on the 640 to
  1023 bar; phones unchanged). `src/index.css`'s route floor reads `--sf-header-h`.
- RETIRED in this change: NavRibbon, FletchBand, ShaftWrap, ShaftNock, NavDivider, Lockup,
  GildedWordmark, WaxSeal, SealImpression, the war-arrow token block and FLETCH derivations in
  theme.js, CHROME.headerMobile / headerDesktop / scrollPadDesktop / mapShellOffset, the
  `.sf-shaft-wrap` CSS fallback, and the tests navFletching, navDividers, brandLockup,
  compositedBarAA and textureBudget (their surviving pins moved into
  `tests/components/arrowHeader.test.jsx`: no filter or transform on the header chain, no
  overflow clip on the controls' or the menu's chain, the a11y.css ring width equals the
  header's inset).
- Registers moved in the same change: raw-button budget 42 to 39 and the NavRibbon row out;
  App.jsx's size-baseline row deleted (650 to 562 effective lines) with the proseCorpusBytes
  anchor, sweep area 14 and its manifest label retargeted onto `src/domain/explanation.js`;
  sweep area 28b and its guard row out, area 98 re-anchored, areas 100 to 104 added (a nav edge
  on a binding, a cut on a word, a hang layer with pointer events, a ring falling back to the
  bronze, a retired height re-consumed), manifest rows for compositedBarAA, brandLockup and
  textureBudget out, a mutation row for `tests/lint/arrowHeaderRetirement.test.js` and four
  `meta:` rows in; negativeAssertionAnchor rows for the four deleted files and navFlowArrows out,
  organicLogo 4 to 2; `arrowOverhang: 35` in the z-layer contract; HZ-GROUNDMOVE records the
  fourth ground move (instances 3 to 4, the asset test joins its enforcers) and HZ-SIZECEILING
  the App.jsx row; rawColorLiteral 1329 to 1326 (FletchBand's three); contrast.test.js loses
  its five CSS-arrow describes and gains the slip and ring riders; organicLogo's inliner set is
  HouseDevice alone with LegalRibbonRow as its negative control; the bottom-anchored walker
  gains the bar-lift law; the deep-craft kill-list counts measured unchanged (84, 59, 163, 160).
- Bytes (fresh build of the final tree, measured with the budget tests' own walker): first-paint
  raw 1,033,094 of 1,048,000 (headroom 14,906, was 52 at d710f0a98), gzip 328,052 of 337,000
  (8,948, was 3,870), Brotli 275,409 of 283,000 (7,591, was 3,486), render-blocking CSS 19,576 of
  19,800 (224, was 5). No budget raised.

**Part 2 judgment calls (vetoable; say "veto" on the row to flip it):**
- JUDGMENT: THE SEAM IS AN OVERLAP, NOT A BUTT JOIN. The plan joined the band and hang clips on
  one CSS length. Measured (the seam metric compares the app against one unclipped image of the
  strip): a light one-device-pixel hairline across the whole arrow in Chromium at DPR 1.5 (row
  difference 85 against 3 elsewhere) and fainter at 1.25. Snapping the band to device pixels
  was built and measured and did not cure it (layout rounds to 1/64 px first), so it was removed.
  The layers now overlap on strip rows 55 to 62, which are opaque from the nock to the socket
  (pinned on the pixels); the hairline is gone (85 to 4.8, no visible line at 4x in either
  engine). Price: during the generation reveal (z 45) the shaft's rows 63 to 67, its
  anti-aliased lower edge (about 3 CSS px at s 0.6), hide with the feather.
- JUDGMENT: AccountMenu IS the plate control. The chip's only consumer was App, and its
  SHAFT_SAGE / SHAFT_STEEL tones had no honest ground on brass, so the chip path retired rather
  than living beside a `placement` prop. Its name is "Account menu, <name>" ("Account menu" when
  the visible name is "Account"), with the unread suffix.
- JUDGMENT: the two-tone ring is drawn by the control itself (INK `--sf-focus` plus a PARCH_100
  inner band while `:focus-visible`), costing JS bytes, not stylesheet bytes; the active-page
  rule is PARCH_100 on row 52 (part 1's measured finding over the plan's INK).
- JUDGMENT: the hang layer's print rule is one of the injected chrome rules
  (`@media print{.sf-arrow-hang{display:none}}` in lib/chromeInsets.js), not index.css: the
  footer's pins forbid a print rule in the render-blocking sheet. The route floor's
  `--sf-header-h` is the one chrome variable index.css reads (the pin now allows exactly its two
  floor declarations).
- JUDGMENT: the retirement scan lives at `tests/lint/arrowHeaderRetirement.test.js` (a source
  scan belongs with the enforcers and so enumerates, with its own sweep plant), and the plan's
  plants for the header and asset tests are claimed by `meta:` rows (those files do not
  enumerate by name).
- JUDGMENT: unkeyed docked Surveyor panels (AiAnalystPanel, InterviewPanel) read useIsMobile so
  their desktop branch clears the bar and their phone offsets stay exactly as they were.
- JUDGMENT: GenerateWizard's desktop scroll padding is `HEADER_H + 64 + 22 px` (the old 124 less
  its 38 px bar and 64 px toolbar); the landing letterbox is `100vh - FOOTER_INSET - BOTTOM_NAV_H`
  because the hero now starts at the top of the viewport; the checkout toast and the campaign
  sync banner sit `SP.sm` below the band.
- JUDGMENT: the z-layer note (the header shares the value 50 with `popover` deliberately) is its
  own `_arrowHeaderLayers` key, so the contract's `_doc` is untouched.
- JUDGMENT: `--sf-bottom-nav-h` publishes the bar as rendered, 45 px (a 44 px seat and its 1 px
  rule) plus the bottom safe-area inset, not the plan's 57: the Chromium e2e run measured the bar
  at 45 px at 390 and 800 px and the landing hero ended 12 px short of it. CHROME.bottomNav (57)
  is the older phone token, 12 px generous, and the phone surfaces that read it (RealmMobileGate
  and the fab lifts) are left as they were (recorded, not re-tuned here).

**Part 2 findings for the owner (measured, not fixed):**
- ⚠ THE FILLER TILE HAS A BRIGHT BAND. Its column-mean luma peaks at 134 around column 140
  against 111 to 121 elsewhere, so every repeat of the tile shows a lighter vertical stripe.
  It is plain at the eleven single-share slots up to 2597 px but visible in the double-share slot
  before the blank plate on wide screens (two repeats at 2560). The kit's filler ships
  byte-exact per the chair's ruling; a re-cut or a longer seamless filler from the painting is a
  kit decision. Seam metric, joins: the worst step inside a slot is 1 to 2.4 times the plain
  wood's 95th-percentile step, the plate slot the worst in every engine and ratio (receipts in
  the scratchpad `arrow-part2/seam-metric3.txt`, screenshots in `arrow-part2/shots/`).
- The strict "no join above the plain-wood p95" bar the plan set fails by that margin at most
  joins, and the band/hang row difference at fractional ratios stays a little above the other
  rows' p95 (Chromium 1.25 and 1.5: 4.3 and 4.8 against 2.9 and 3.0; WebKit 1.25: 8.8 against
  8.1). Neither shows as a line in 4x crops. Owner sign-off on the screenshots is owed.

**Part 2 deliberately deferred (documented, not bugs to re-find):**
- WebKit scroll smoothness with the masked segments under sticky layers at 1920 and 2560 was
  not measured (the plan's WebKit compositing risk); the fallback remains baking feathered crops.
- Pre-existing and unchanged: on phones the docked Surveyor panels (z 60) sit partly under the
  bottom bar (z 100); the account menu's z 1200 is effectively 50 inside the header's stacking
  context; SessionEvictedBanner covers the band with the feather hanging below it.
- Owner questions carried from the plan: whether /about/guide should light About (it lights
  nothing, parity), whether the nav regions should become links, whether S_MAX should grow,
  and WCAG 1.4.5 (the painted words are images of text by the owner's design; the names are
  real text).
- `THIRD-PARTY-NOTICES.md` still does not name the OpenAI-generated art (part 1's deferral).
- The lighting census walker reds on this change's test-file count; its governed refreeze is
  its own commit after the code commit.

**Part 3, the review's fixes and the feather order (2026-09-17; uncommitted, the chair commits):**

**The owner's new order (2026-09-17):** "once we start scrolling, the feather in the arrow
turns completely transparent, only to reappear fully if they scroll to the very top."

**The chair's rulings for this fix (vetoable; say "veto" on the row to flip it):**
- A. THE FILLER, RE-CUT BY THE CHAIR from the painting's own pixels: `arrow-filler.webp` is the
  kit's `arrow-filler-v3.q90.webp` (372x70, 6,366 B, kit sha256 `fb8659db...`; master
  `arrow-filler-v3.png`) plus the committed injector's credit, 8,246 B (sha256 `43ddc3bf...`),
  pixels identical to the kit's (decoded and compared). It joins the eleven plain-wood runs in
  painting order and then in a different order, mirrored, leaves out the bright knot beside
  binding 7, matches each row's lighting and flattens the column brightness (column luma 110.9
  to 116.6, measured). FILLER_W 183 to 372 everywhere it is read (the tile size, the per-slot
  phases, the tiled zone); the provenance row's `mapped_by` describes the re-cut and its
  `restored` date is 2026-09-17, the day the credit was written.
- B. TONE PER SLOT: `SLOT_TONE` in `arrowGeometry.js` holds the chair's table (558 1.047, 657
  1.027, 713 1.044, 825 1.014, 881 1.035, 982 1.019, 1234 0.994, 1350 0.955, 1413 0.981, 1516
  0.923, 1596 0.802). Each slot's filler takes `filter: brightness(k)`; the compact slot takes
  its left cut's tone (1.047) at its left end and its right cut's (0.802) at its right end: an
  opaque copy of the tile at the right tone fades in across the slot over the tile at the left
  tone, so nothing fades over the page. `tests/build/arrowHeaderAssets.test.js` re-measures the
  table on the shipped strip and filler to within 0.02.
- C. THE PLATE SLIP: a signed-in name is shown as written (no capitals, no letter-spacing), its
  type stepped down half a pixel at a time to SLIP_FLOOR before any ellipsis, with the full name
  in a title and in the plate's accessible name. "SIGN IN" is unchanged.
- D. HOVER: a soft radial glow, `radial-gradient(closest-side, color-mix(in srgb, PARCH_100 34%,
  transparent), transparent)`, on the hovered word, the logo plate or the blank plate, drawn only
  where `matchMedia('(hover: hover)')` matches when the pointer enters (a tap on a phone lights
  nothing). The Button primitive's flat hover fill is switched off on the arrow's controls
  (`--sf-btn-hover-bg: transparent`, because that variable only takes a colour). Zero stylesheet
  bytes.
- E. Recorded, not changed: the band jumps from 40.8 to 32.6 px when a window is resized across
  1024, and a classic scrollbar's width dips the full arrow's scale under the word floor (a 1024
  px window less a 15 to 17 px scrollbar lays s at about 0.472).
- F. THE FEATHER HIDES ON SCROLL, superseding the plan's constant feather: fully opaque only while
  the page is at its very top (scrollY under 1 px), fully transparent (opacity 0, still no pointer
  events and aria-hidden) anywhere else, a 120 ms fade that a11y.css's reduced-motion rule
  collapses to 1 ms, the right state on the first render of a page that loads already scrolled,
  one passive scroll listener, and main's content reserve unchanged. The arrowhead's lower barb is
  NOT the feather and stays (the chair's reading).

**How F is built:** the hang layer now holds two parts. `ArrowPaint part="hang"` draws rows 55
down as before but through an L-shaped mask: rows above 68 at every column, and every row from
strip column 480 rightward (the barb, the cord ends, the shaft's own lower edge). `ArrowPaint
part="feather"` draws exactly the rest, columns [0, 480) from row 60 down, and ArrowHeader sets
its opacity from `featherShown(window.scrollY)` read through `useSyncExternalStore`, so the header
re-renders only when that answer flips. The asset test pins the geometry on the pixels: below row
73 nothing left of the barb hangs outside columns [0, 480) (the feather itself is more than 20,000
pixels there), nothing above alpha 12 crosses column 480 below the band, and the overlap rows are
opaque except the nock's end [0, 80) and the feather's tip [455, 480).

**The review's findings, dispositioned:**
1. The pale wood before the blank plate: FIXED by A and B. The review's seam metric on the
   compendium page, zone mean luma step across a crossfade (before, the review's run of this tree,
   then after; the after run's plain-wood p95 in brackets): 2560 slot 10 fade-out 26.18 to 0.95
   and fade-in 26.28 to 2.43 [2.67]; 1920 slot 9 fade-in 20.93 to 1.89, slot 10 fade-out 26.75 to
   0.38 and fade-in 24.74 to 2.85 [2.85]; 1440 at DPR 1 slot 10 26.75 and 20.09 to 0.64 and 0.51
   [3.34]; 1440 at DPR 2 29.76 and 19.45 to 1.73 and 0.09 [5.32]; the compact slot at 1023
   fade-in 26.2 to 3.7 [2.68] and at 800 25.69 to 4.26 [3.94]. Filler minus the painted
   neighbours at slot 10: +21.29 to -0.22 at 1920 and +21.62 to -0.37 at 2560; the compact slot
   +9.49 to +0.87 at 1023. Every filler box edge still matches the unclipped reference (0). The
   after run's plain-wood p95s are lower because the re-cut tile has no knot, so "over" counts do
   not compare across the two runs; the step values do.
2. The knot repeating every 109.8 px: FIXED by A. The re-cut has no knot, and one tile is 223.2
   CSS px at s 0.6, so no single-share slot repeats it up to 3958.2 px; at 2560 the double share
   is 213.4 px, under one tile.
3. The slip cutting names: FIXED by C. Measured in the preview build: "Wanderer" at 390 px 8.5 px
   and whole, at 1024 px 11 px and whole, at 1440 px 12 px and whole; "Aldric Thornby" at 390 px 8
   px with an ellipsis ("Aldric T...", 41 of 56 px shown, the full name in the title and the
   plate's name), at 1024 px 8.5 px and whole, at 1440 px 11 px and whole (Chromium; WebKit shows
   the same at 390 and 1440, and at 1024 see the WebKit finding below).
4. No primary navigation landmark from 640 to 1023 px, and the destinations at the end of the Tab
   order: FIXED. Below 1024 px the bottom bar is `<nav aria-label="Primary">` (the header's nav
   shows only with the full arrow, so there is exactly one Primary nav at every width, pinned at
   390, 800 and 1440) and it sits in the DOM right after the header and its hang layer, so its
   seats come before main in the Tab order. It is fixed, so nothing moves on screen.
5. and 9. Keyboard focus under the bar from 640 to 1023 px (two reviewers): FIXED.
   `html{scroll-padding-bottom:calc(var(--sf-footer-inset, 0px) + var(--sf-bottom-nav-h, 0px))}`:
   the band is 0px wherever the bar shows and the bar 0px wherever the band does, so 1024 px and
   up is unchanged and phones gain the fix too. A new e2e arm at 800 px: a nearest-aligned scroll
   lands above the bar, with the root padding at 45px.
6. The plate menu off the page at 320 px: FIXED. `menuShift` moves the menu right only as far as
   keeps MENU_W (292 px, the review's measured 284 plus slack) 8 px inside the page's left edge,
   never past its right edge less 8, and the menu's max-width is the page width less 16. Pinned in
   jsdom (320 shifts; 390 and 1440 stay right-aligned) and in a WebKit arm at 320 px (the menu and
   every row start on the page).
7. The current-page rule lost under forced colours: FIXED with `forcedColorAdjust: 'none'` on the
   rule, which keeps PARCH_100 (8.3:1 on those rows of the painting, which forced colours leave
   alone); pinned on React's own serialisation of the header.
8. The locked Upgrade row out of reach: FIXED. It is aria-disabled, not native disabled: the arrow
   keys land on it and it reads its pill, it keeps the locked look (opacity 0.62, not-allowed), and
   a click or Enter on it does nothing and leaves the menu open. The launch-lock test's
   `expectLocked` accepts aria-disabled for a menu row only; every other locked control is still
   native disabled.
10. The first frame laid across the width before the scrollbar: FIXED. ArrowHeader re-reads the
   width in a layout effect and, if it moved, re-renders in the same task, before any paint.
   Pinned twice: in jsdom (a root rendered outside act; a microtask queued from the commit sees the
   band at 1903px, not 1920px) and in Chromium launched without `--hide-scrollbars` (presence
   controls: no scrollbar before the app, a classic scrollbar after; the first committed frame's
   paint width equals the page's clientWidth and nothing scrolls sideways).

**Part 3 judgment calls (vetoable; say "veto" on the row to flip it):**
- JUDGMENT: the feather's layer ends at strip column 480 and starts below row 68 for what hides.
  Scrolled, the shaft over the feather's columns ends at row 68: simulated cuts at rows 70, 72 and
  74 left a grey sliver of feather under the shaft, and row 68 did not.
- JUDGMENT: the feather layer overlaps the always-drawn hang by eight rows (from row 60), fading in
  across the first four and whole for the last four. A fade across all eight left a light line of
  page ground at the hang's mask edge in Chromium at 390 px and a device pixel ratio of 3 (that
  device row's mean luma 98 against 61 without the split), because the mask edge lands up to a
  device pixel early. With the fade ending four rows early, the split draws the same rows as the
  unsplit hang to within a row mean of 2.05 over the feather's columns (rows 52 to 92) in Chromium
  and WebKit at DPR 1, 1.25, 1.5, 2 and 3. Price, at the top of the page only: the overlap's
  translucent pixels (the nock's end and the feather's tip) draw twice. Against the pre-fix build
  at 1440 px, 39 of 1,440 pixels in rows 60 to 68 move by more than 8 levels (at most 26); at 390
  px, 140 of 660 (at most 23). Side by side at 6x the two builds look the same.
- JUDGMENT: `featherShown(scrollY)` is `!(scrollY >= 1)`: 0.5 px and the overscroll bounce count as
  the top, 1 px does not, and a value that is not a position counts as the top.
- JUDGMENT: SLIP_FLOOR is the house 8 px step (FS.nano). Measured in Nunito Bold, an 8-letter name
  needs 8.5 px on the 390 px slip (40.8 px of text room) and 7.97 px at 360 px, so a 9 px floor cut
  it at 390 (the WebKit arm went red at 9 px before the floor moved). At a device pixel ratio of 3
  the 8 px name reads cleanly.
- JUDGMENT: the full arrow's tiled zone follows the filler width, as the plan's rule reads ("no
  slot ever grows longer than one filler tile"): S_MAX now holds up to 3958.2 px (it was 2597.4),
  so a 3440 px ultrawide keeps s 0.6 (band 40.8 px) where it drew s 0.795.
- JUDGMENT: the asset test re-measures SLOT_TONE in BT.601 luma, where the chair's table
  reproduces to within 0.014 on the shipped pixels (in Rec. 709 luma, within 0.024, over the 0.02
  tolerance). The table itself is the chair's.
- JUDGMENT: the filler's wrap-seam pin compares the wrap step with the roughest step of the tile's
  own grain instead of its 95th percentile. The shipped re-cut wraps at 4.34 (grain p95 3.61, p99
  4.23, max 4.77); the kit's PNG master wraps at 3.30 (its p95 3.24), so the q90 encode roughened
  that one column. A new CONTROL shows every mis-wrap sampled (columns 20 to 340) measures 4.94 or
  rougher, so the pin still convicts a wrong wrap.
- JUDGMENT: the filler's byte ceiling in the asset test moved with the file, by ruling A (5,200 for
  the 5,024 B first cut; now exactly the re-cut's 8,246 B, no slack). No other ceiling, budget,
  cap or baseline moved.
- JUDGMENT: the bottom bar's new DOM place (right after the header) holds for phones too, where it
  sat after the footer: the destinations come before the page for keyboard and screen-reader users
  at every width under 1024 px, as the Primary nav does in the header from 1024 up.
- JUDGMENT: the glow appears and goes with the pointer (no fade), inside a box that is the word's
  lettering widened by 10 strip columns (inside its region and clear of every cut), the logo plate
  (columns 128 to 505, between the nock's binding and binding 1, re-measured on the pixels) or the
  blank plate, over band rows 4 to 64.

**Part 3 findings for the owner or the kit (measured, not fixed):**
- The plate slot's wood now matches in brightness but reads a little grey: at 2560 px the filler's
  mean chroma is 73 against 93 and 89 in the painted wood on either side (a brightness filter dims
  colour with light, while the painting's darker wood beside the plate stays warm). A per-slot
  `saturate()` measured the way the tone is, or a warmer cut, would close it; that is an art call
  past ruling B.
- WebKit's `max-width` media query leaves a classic scrollbar out: Playwright's WebKit at a 1024 px
  window (clientWidth 1018) lays the COMPACT arrow and the bar where Chromium lays the full arrow
  (CONFIRMED in Playwright's WebKit; PLAUSIBLE for Safari with always-shown scrollbars, at windows
  from 1024 to about 1038 px). It belongs with ruling E's switch questions.
- The compact slot's right-hand fade-in still steps slightly above plain wood (3.7 against 2.68 at
  1023 px, 4.26 against 3.94 at 800 px): the painting darkens from about 96 to 87 across the wood
  run the tail crop starts in, and one tone meets it there.

**Bytes (a fresh build of the final tree, measured with the budget tests' own walker):**
first-paint raw 1,036,070 of 1,048,000 (headroom 11,930; part 2 measured 1,033,094), gzip
329,151 of 337,000 (7,849), Brotli 276,417 of 283,000 (6,583), render-blocking CSS 19,576 of
19,800 (224, unchanged). No budget raised.

**Negative controls executed (the source broken, the named arm red, the source restored byte for
byte):** in jsdom, the first-frame re-read removed, the feather forced opaque, SLOT_TONE at 1596
set to 0.9, the brightness filter dropped, Upgrade back to native disabled, the glow lit on every
mouseenter, the menu never shifted, the slip never stepped down, the bar back to a plain div and
the hang's mask removed; in the browser, the feather forced opaque (Chromium), the first-frame
re-read removed (the classic-scrollbar arm, red on "the first frame is laid across the page
width"), the old scroll-padding rule (the 800 px arm, red on "the control lands above the bar")
and the menu never shifted (the WebKit 320 px arm, red on "the menu starts on the page").

**Part 3 deliberately deferred (documented, not bugs to re-find):**
- The lighting census walker is red (test files 2,584 to 2,585 from parts 1 and 2, and this part's
  new titles); its governed refreeze is its own commit after the code commit.
- The plate slot's residual grey and WebKit's scrollbar-blind switch (above) wait on the owner or
  the kit.
- `THIRD-PARTY-NOTICES.md` still does not name the OpenAI-generated art (part 1's deferral).

## COMPENDIUM: MAP LENSES AND INTERIORS REMOVED (owner order 2026-09-16)

**The order (owner):** "completely remove the map lenses and interior pages from the
compendium".

**The chair's reading (vetoable).** "Map lenses" is the Compendium's Map Lenses tab (tab id
`lenses`, `LensesHub`), including the District bands section that lived inside it (wealth,
safety and categories), its Overview card, its A to Z and global-search rows, and the five
per-entry pages `/compendium/lens-parchment`, `lens-watercolor`, `lens-darkfantasy`,
`lens-vtt` and `lens-accessible` with their prerendered documents and sitemap URLs.
"Interior pages" is the Facets tab (tab id `facets`, `FacetsHub`: institution natures,
interior kinds, room kinds, furnishing kinds) and its Overview card; it had no A to Z,
search or per-entry rows. Both described features the site does not ship: the
settlement-map lens plates were removed earlier, and `InteriorView` has no product
importer. The order is about the COMPENDIUM, so the map rendering, the interior engine
(`src/components/interior`, `src/domain/interior`), the entitlement ladder's deferred
`interiors` row and the pricing copy for building interiors are untouched.

**What was removed (uncommitted at hand-off; the chair commits):**
- `src/components/compendium/CatalogHubs.jsx`: `LensesHub` and `FacetsHub` deleted (and the
  now-dead `Card` import); the file carries `CalamityHub` alone and keeps its name, so every
  register that names the path stays valid.
- `src/components/CompendiumPanel.jsx`: the two tabs, their `ANCHOR_TO_TAB` rows, their
  `TAB_META` titles and descriptions, their render cases and `WIDE_TABS` entries; the
  Overview description no longer lists "map lenses, facets".
- `src/components/compendium/CompendiumDashboard.jsx`: the two Overview cards and the A to Z
  Lens rows.
- `src/domain/compendium/searchIndex.js`: `lenses` and `facets` left `COMPENDIUM_TABS`, and
  the five `Map Lens` index entries (`LENS_ENTRIES`) are gone, which is what removes the
  per-entry routes from the sitemap and the prerender.
- `scripts/generate-compendium-data.mjs`: the `lenses`, `districts` and `facets` blocks, their
  authored copy (`LENS_READINGS`, `ILLUSTRATED_LENS_NOTE`, `DISTRICT_*`), the lens build guard
  and the now-dead `townMapStyles` and `interiorTemplates` imports. The artifact
  `compendiumData.generated.js` was regenerated with `npm run gen:compendium-data`, never
  edited by hand.
- `scripts/generate-sitemap.mjs`: `lenses` and `facets` left its section list;
  `public/sitemap.xml` was regenerated with `node scripts/generate-sitemap.mjs`.

**Measured counts (base `d710f0a98` against the change, both from `npm run build`):**
sitemap 326 to 319 URLs (two section URLs and five entry URLs); prerender 311 to 306
documents (13 views + 15 gallery hubs + 283 compendium entries, then 278 entries); the
Compendium index 283 to 278 entries. First paint: raw entry closure 1,047,948 B both times
(budget 1,048,000); gzip 333,130 to 333,139 B (budget 337,000); Brotli 279,514 to 279,629 B
(budget 283,000); render-blocking CSS 19,795 B both times (budget 19,800). At the build
log's 0.01 kB precision only two built chunks changed size: `CompendiumPanel` 156.09 to
151.92 kB and `compendiumData.generated` 89.58 to 87.16 kB. The small gzip and Brotli movement with identical raw bytes is attributed
to the renamed lazy-chunk hashes in the entry's preload map (not proven byte by byte).

**Old links.** `/compendium/lens-*` still matches the router's per-entry pattern
(`view: 'compendium'`, `params.entry`); with no prerendered document the request reaches
the SPA shell, the id no longer resolves to an index entry, and `CompendiumPanel` opens on
the Overview. The first cut stopped there, which left the address bar, the canonical and
`og:url` on the dead path (`applyDocumentHead` builds them from `params.entry` and skips the
title, og and twitter tags for an entry route), so five URLs that were in the production
sitemap would have served the Overview under a self-canonical dead address. Review caught
it; the cure, per the chair's ruling 2 below, is that `CompendiumPanel` REPLACES a removed
id's address with `/compendium` (`navigate('compendium', { replace: true, scroll: false })`,
for the five ids in its `REMOVED_ENTRY_IDS`, standalone only). The route then resolves with
no entry, and App's head effect applies the `/compendium` title, description, canonical,
`og:url`, og and twitter tags. A live entry id keeps its address. Pinned by
`tests/ui/compendiumHubs.test.jsx` ("an old /compendium/lens-* link lands on the Overview at
/compendium, and the head follows the replaced address"; two mutants executed: with the
replace disabled it reds on `expected '/compendium/lens-parchment' to be '/compendium'`, and
with the id check removed the live-entry control reds on `expected '/compendium' to be
'/compendium/tier-thorp'`) and by the dist walk in `tests/build/prerenderRoutes.test.js`. A
stale `?tab=lenses`, `?tab=facets`, `#lenses` or `#facets` link also opens on the Overview,
since neither key is in `TAB_META` or `ANCHOR_TO_TAB` any more (pinned in the same test).
- JUDGMENT (vetoable), where the alias lives. The chair ruled for the router's in-app alias
  (`resolveLocation` returning `legacy: true`, which App's canonical-URL upgrade rewrites).
  That was built and MEASURED first: the most compact `legacy: true` form tried (the
  per-entry builder returning no params for a `lens-` id, the loop returning
  `{ view, params: {}, legacy: true }`) built to a first-paint static closure of 1,048,020 B
  against the 1,048,000 B budget (`tests/build/vendorPdfLazy.test.js`, 1 failed | 53
  passed). `lib/routes.js` is eager and the closure without it measures 1,047,948 B (52 B of
  headroom); in a standalone esbuild minify of `routes.js` that form adds 70 B and the
  explicit five-id set the review proposed adds 181 B, so no router alias fits without
  raising the budget, which is refused. The replace therefore runs in the lazy Compendium chunk, through the
  same `navigate(..., { replace: true })` primitive App's demoted-destination redirect uses,
  at zero first-paint bytes. The visible difference from a router alias: the dead address
  is replaced once the Compendium chunk has loaded rather than on the first route
  resolution. No `vercel.json` change.
- Observed, not changed (outside the order): any OTHER unknown id (`/compendium/<typo>`)
  still opens the Overview under its own dead address and canonical. Generalizing the
  replace to every id missing from the index would cure that class; it was kept to the five
  removed ids as the least invasive reading.

**Pins added or updated:** `tests/ui/compendiumHubs.test.jsx` (the tab strip, Overview cards
and A to Z destinations carry neither page; the old-link replace and head),
`tests/ui/compendiumMapCalamity.test.jsx` (the lens and district arms left; the calamity arm
stays), `tests/docs/compendiumDataFreshness.test.js` (the three blocks are absent),
`tests/domain/compendiumSearch.test.js` (no tab, entry, category or id routes to them),
`tests/build/sitemap.test.js` (12 sections, no removed URL) and
`tests/build/prerenderRoutes.test.js` (no removed document in dist). Every new negative goes
through `tests/helpers/anchoredNegatives.js`. Registers moved by the removal, each lowered to
its own measured figure: `tests/lint/rawColorLiteral.test.js` budget 1,329 to 1,320 (nine
Card accents left with the two hubs); the settlement-map allowlist struck
`src/domain/compendium/` (its only hit was the artifact header naming `townMapStyles`); the
prose-numerics row for the calamity `{b.scale}` re-addressed from line 95 to 43. Two stale
reader comments that still named "the compendium generator" as a `townMapStyles` reader were
corrected (the header of `src/design/townMapStyles.js` and the design-registry row's `why` in
`tests/lint/settlementMapSurfaceAllowlist.walker.test.js`); no map code moved.

**The chair's rulings on the review (2026-09-17, vetoable):**
1. The writer-reach DARK identities are banked through the walker's own governed door, not
   re-homed: the owner ordered the page removed.
2. Old `/compendium/lens-*` links land on `/compendium` with the address bar, canonical and
   og tags following, pinned by a test, with no `vercel.json` change (see Old links above for
   where the replace lives and why).
3. The observed-shape drift from the regenerated artifact is re-frozen through its own door if
   that door runs on an uncommitted tree; otherwise it stays red with the exact command.
4. Four whitespace-only lines restored and the stale `townMapStyles` reader comment fixed.

**Writer-reach (ruling 1, DONE).** Removing the District bands turned `wealth on
_timePressure` and `wealth on factions` DARK (LIT-NAME 4,647 to 4,645; DARK 1,325 to 1,327;
reviewable 525 to 527). Their only counting-surface read was `CD.districts.wealth` in the
removed bands (`CatalogHubs.jsx`), a key-name collision graded N, never a display of either
fact: `git grep -nw wealth` over `src/components`, `src/pdf`, `src/domain/display`,
`src/utils` and `src/foundry` finds only a comment and prose. The register has no row reason
that fits a deliberate removal (`dark-by-construction` needs a dormancy door,
`engine-internal` claims the key is not a customer fact, and `pending-surface` claims an owed
surface and its ceiling is shrink-only), so the lawful path is the one the walker's own
failure names ("bank it through the governed door"): `node scripts/check-writer-reach.mjs
--rebank --charter=...`, used by ruling for two identities exactly as the §900 desk landing
did for `forcedByConfig`. It printed `writer-reach REBANK — cohort 1321 → 1323; 0 stale folded
out; 0 registered rows now lit.` and appended a `rebankHistory` row whose charter names the
owner's 2026-09-16 order and this ruling. No ceiling was loosened, no arm deleted, no
register row added. `tests/lint/writerReach.walker.test.js`: 56 passed (56).
- ⚠ For the landing: the rebank stamped `frozenAtSha` with this worktree's HEAD
  (`d710f0a98`). If the landing places that sha inside a consist, re-stamp after the commit
  with the shrink-only `node scripts/check-writer-reach.mjs --write` (the cohort holds at
  1,323), as the 2026-09-15 consist-tip re-stamp did.
- Owner question, not a register act: faction wealth (and its time-pressure mirror) is
  generated on every world and shown on no surface.

**Known reds, left for the chair (each needs a committed tree):**
- `tests/lint/sovereigntyLightingContract.walker.test.js`: the live test-title count moved
  24,445 to 24,446. Refreeze owed after commit.
- `tests/lint/observedShapeReaders.walker.test.js` "THE LIVE ESTATE INSTANCE" and the
  standalone gate `node scripts/check-observed-shape-readers.mjs` (exit 1: "observed-shape
  execution INPUT changed since the last re-freeze (1 path(s):
  src/domain/compendium/generated/compendiumData.generated.js)"). Its shrink-only door
  `node scripts/check-observed-shape-readers.mjs --write` REFUSES this uncommitted tree
  (exit 1, "observed-shape current scanTree is not the exact committed HEAD input tree"; the
  baseline's md5 was unchanged after the refusal), so per ruling 3 it must run after the
  commit, then `tests/lint` re-runs whole.

**Deliberately deferred, documented, not bugs to re-find:**
- `scripts/generate-sitemap.mjs` still lists a `deities` section (`/compendium?tab=deities`)
  although the panel has had no Deities tab since the 2026-07-21 ruling; that URL lands on
  the Overview. Outside this order.
- The "289 named entries" figure in comments in `src/lib/routes.js`,
  `src/lib/seoCompendium.js` and `scripts/prerender-routes.mjs` was already stale (283 at
  base) and now reads against 278. Left for a prose pass, since the files are otherwise
  untouched.
- Remaining references outside the Compendium, kept by the order's scope: the entitlement
  ladder's deferred `interiors` row (`src/config/entitlementLadder.js`), the pricing label
  "Building interiors" (`src/copy/pricingPage.js`), the interior engine and viewer, the map
  style registry `src/design/townMapStyles.js`, and the Command Palette's "Map lens" hint
  (realm-map overlay toggles, not the Compendium).

---

## DOSSIER AND REALM POLISH (owner orders 2026-09-17)

**The orders (owner, 2026-09-17, after reviewing screenshots of a freshly forged dossier for
Kamalavalli, the Realm page and Pricing):**
1. "Fix the contradiction."
2. "The herald should only appear after the first advanced time on the map."
3. "Remove the entire section that says what a new roll keeps and any button associated with
   that."
4. "Fix the small visual defects."
5. (later the same day, over a screenshot of Systems Health) "Regarding the 10 different
   sentences, either simply pick just one or remove that entire section. Any of those pieces
   should live somewhere else instead and we'll figure that out later, but not altogether like
   it does right now."

The chair split the work in two parts on one worktree (`arrow-header-2026-09-16`, base
`a62dcbb90`). Part 1 carries orders 1, 3 and 5 and records them below; part 2 carries orders 2
and 4 and records them in its own subsections. Everything is uncommitted at hand-off; the chair
commits.

### Order 1: the contradiction (part 1)

**The chair's ruling (vetoable).** Fix it at the chokepoint so every surface that states crisis
status agrees with the active-crisis set the banner shows. Prefer correcting the prose rule's
predicate over hiding a line. Search for sibling contradictions of the same shape and fix every
instance found. Declare the output shift and move prose, golden or corpus pins only with that
stated cause, regenerating generated corpora with their own generators.

**The cause.** On the Overview one array (`settlement.stress[]`, normalized in
`OverviewTab.jsx`) feeds both the ACTIVE CRISIS cards and the stressor desk. The desk's
`crisisFramingPoolKey` returned the DS-STR-1 pool keyed "Overview's own section framing" when
that array was NOT empty. That pool is the annex's **ARITY, no banner** pool (R-DST-K gated):
all three of its wordings say the town has no crisis ("There is no crisis on the books…"). The
projection had keyed it by a bold span on a hard-wrapped line of the pool's own note, and DESK
CAR 10 (`fa5696675`, 2026-09-04) read the key literally as "the crisis section's framing" and
fired it whenever a banner showed. So every crisis town printed "no crisis" directly under its
crisis card, which is the Kamalavalli screenshot.

**What changed.**
- `src/domain/display/stateProse/stressorsStateProse.js`: `crisisFramingPoolKey` now returns
  the pool only when the banner reading is a real, EMPTY array; a missing reading is silence.
  The pool key string is unchanged, so the draw hash and the census rows do not move.
- `src/components/new/tabs/OverviewTab.jsx`: the crisis block no longer draws that rung at all.
  The block exists only when there is a banner, so the no-banner line can never be true there;
  on a calm town the rung is composed and not rendered, which is what R-DST-K asks.
- THE SIBLING, FIXED: DS-STR-1 **INFILTRATED** wording 3 printed "There is no visible crisis."
  inside the INFILTRATED card under its ACTIVE CRISIS badge. The annex line
  (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`) now reads "The crisis is out of sight. The
  pattern is legible only to whoever is counting the coincidences." The claim is kept (the
  crisis exists and is hidden); only the denial is gone. JUDGMENT: the replacement wording was
  chosen byte-for-byte the same length so the prose byte ratchet has nothing to bank; say "veto"
  to reword it. Regenerated with `node scripts/generate-dossier-state-prose.mjs` (one line of
  `stressors.generated.js` moved). The move-grammar sweep over `### DS-STR-` against the base
  reports 1 changed unit, 1 shift (ABSENCE+PRESENT to PRESENT, order none to V1) and 0 LEVEL1
  orders lost on spines. The shift is the cure: the ABSENCE move was the denial, and the old
  unit held no LEVEL1 order because ABSENCE opened it. The chair's corpus-gate ritual should
  still read this one unit.
- Tests: `tests/domain/stressorsStateProseDesk.test.js` (the predicate arm inverted; a
  generated-town arm proving the no-crisis rung is present if and only if the banner list is
  empty; a banner-pool arm refusing any crisis wording that denies its crisis);
  `tests/ui/generalDeskTabFlow.test.js` (a DOM arm over generated crisis towns, DM and player,
  that no no-crisis wording renders beside ACTIVE CRISIS, plus a source pin that the crisis
  block does not draw the rung). Each was run against the base sources and went red.

**Declared output shift.** Rendered: every settlement with at least one `stress[]` entry loses
exactly one italic sentence under its crisis cards on the Overview, in both the DM and the
player view; INFILTRATED towns that drew wording 3 read the new sentence. Calm towns, the DM
Summary, the PDF and public gallery dossiers (which never drew the line) are unchanged.
Generation, the simulation and the generator golden are unchanged. Composed (not rendered): the
no-banner rung now composes on calm towns instead of crisis towns, so the DRIFT manifest moved
on all 1,050 of 1,050 rows: golden-master-v3 72,108 to 71,076 cells (516 crisis towns times 2
audiences lose the cell) and gm-seed-a/b/c 394/390/392 to 400/396/398 (three calm towns times 2
gain it), 73,284 to 72,270 cells in all. No DRIFT town draws INFILTRATED wording 3, so the
corpus edit moved no row.

**Pins moved, each with the cause above.** `tests/fixtures/dossier-prose-manifest-golden.json`
re-recorded by its own recorder (`node scripts/prose-manifest-cells.mjs --record`); the FOUR
SEEDS tally in `tests/property/dossierProseManifest.test.js` restated with the cause in a
comment; `docs/content/wiring-census.json` re-stamped (`node scripts/wiring-census.mjs`; 0 rows
moved, the stamps of `stressorsStateProse.js` and `dossierMounts.js` only).

**⛔ OWED TO THE PEN, NOT TO A LANE.** The DRIFT manifest is FROZEN in
`tests/fixtures/.golden-freeze-register.json` (row `dossier-prose-manifest`, ownerRow §901, the
2026-09-16 genesis). `tests/lint/goldenFreeze.walker.test.js` arm 1 is therefore red on its
sha256 (`a64b9a75…` to `70607daf…`). A re-record of a frozen surface is OWNER-signed
(`goldenRecordDoor.js` ACTIONS), and this surface has NO capture arm through the door
(`recordEnv: null`; the recorder's `--record` comment still describes the unfrozen register),
so the lawful path is a signed shift record under `docs/shift-records/` plus a door write for
this surface, from a committed tree. The register row was NOT touched. If the signature is not
wanted, the fallback that keeps the owner's page fix without moving the golden is: restore the
base predicate in `stressorsStateProse.js`, restore the base fixture, tally and stressor
desk test, re-stamp the census, and keep the `OverviewTab.jsx` change and the DOM pin (the page
then never renders the rung, but the desk's own contract stays inverted). Executed on a scratch
clone of this change: the stressor desk test, the prose manifest, the golden-freeze walker and
the general desk DOM flow all pass (4 files, 152 tests). The banner-denial arm for INFILTRATED
does not depend on the predicate and should be carried over if this fallback is taken.

**Siblings reported, not fixed.**
- Insurgency, slave revolt, religious conversion, wartime and mass migration towns can keep
  `powerStructure.stability: Stable` (`generators/power/governanceNarrative.js`
  `applyStressStability` has no arm for them; code read, and the survey measured 19 of 42
  insurgency towns Stable), so the Power tab says the hall is settled beside a crisis banner.
  That is the generator, and the simulation programme is paused.
- The War tab's dormant note or "at peace" fallback on a campaign whose world has no war beat
  while the town carries a WARTIME or UNDER SIEGE stress. Campaign-only; not probed.
- DS-GEN-3's first-survey lines that say "not a crisis" or "not dangerous" beside a crisis
  banner. Moot on the page since order 5 removed that list.
- INFILTRATED wording 1 ("Nothing here looks wrong.") was read and judged not a denial: the next
  clause says what is wrong.

**Deliberately deferred, documented, not bugs to re-find.**
- The census RATE half for the no-banner pool (`rateBp` 3060) was measured under the inverted
  predicate and is now a stale report. Measured to a scratch file on this tree with
  `node scripts/prose-rate-corpus.mjs --out <file>`: 533 of 768 towns, 6,940 bp (the exact
  complement of 3,060). The norm bit stays 0 either way. Not folded into the census here
  (`node scripts/wiring-census.mjs --rates <file>`) because that re-takes every pool's rate row
  at once.
- The projection mis-parse that named this pool ("a bold span on a wrapped note line becomes
  the pool label") is left in place. Renaming the key to its authored name moves the draw hash,
  the census rows and the norms key; it wants its own car with a contract plant.

### Order 3: the new-roll locks (part 1)

**The chair's ruling (vetoable).** Remove the "What a new roll keeps" section everywhere it
renders and every Keep or Unlock button and component that exists only to serve it. Stored locks
must not keep acting invisibly: treat them as off at the narrowest read chokepoint that feeds
regeneration and the simulation, without deleting stored data. Census every writer and reader
first; if another still-visible surface sets or shows a lock, stop and report it rather than
removing it.

**The census.** The section was `LockControls` scope `world`, mounted twice: below the draft
dossier (`GenerateWizard.jsx`) and in edit mode (`SettlementDetail.jsx`). It was the only writer
of three keys in the persisted `state.locks` map: `identity` (read by `carryLockedSections`,
kept the old name on a full generate), `geography` (read by `geographyLockedConfig`, overlaid
the old terrain and trade access on a full generate) and the name-keyed seat array (read only by
`worldPulse/coup.js`, which turned a fallen seat into a proposal). Its "Clear all locks" button
was the only caller of the store action `clearLocks`. Locks persist inside
`save.campaignState`.

**STOP-AND-REPORT: still-visible surfaces that set and show locks, KEPT.** The NPCs tab ("Keep
these people" beside Reroll), the History tab ("Keep this history" beside Reroll) and the
per-character padlock on NPC rows, whose copy reads "Lock this person so they stay through any
new roll." They are not part of the section, so they stay. ⚠ The padlock's words "any new roll"
may read to the owner as associated with the order; that is the owner's call.

**What changed.**
- The section, its lazy imports and fallbacks left `GenerateWizard.jsx` and
  `SettlementDetail.jsx`. `LockControls.jsx` lost its world branch, the row copy, the
  ruling-power import and the `clearLocks` binding; the section scopes are untouched.
- Chokepoints, reads only: `domain/locksPreservation.js` `normalizeLocks` no longer reads
  `identity`, `geography` or the seat array; the name carry left `carryLockedSections` (its
  history carry stays); `geographyLockedConfig` is retired and `settlementGenerateAction.js`
  calls `birthConfig` directly; `worldPulse/coup.js` no longer reads the seat lock off the save
  (the fall's legacy mode is `auto`, still routed through `authorityFor`, and the "governing
  faction is locked" reason line is gone).
- The coup's row in `worldPulse/changeAuthorityPolicy.js` moved from the retired class
  `auto-with-lock-escalation` (it was that class's only member) to `auto-with-approval-routing`,
  and the locks typedef in `domain/types.js` marks the three keys retired.
- `clearLocks` retired (store action, registry row, its store test). The `setLock` registry
  description now says "A full regenerate also keeps a locked history." (it promised the name
  and terrain). `compendiumData.generated.js` regenerated with `npm run gen:compendium-data`
  (162 to 161 operations), and `public/sitemap.xml` regenerated with
  `node scripts/generate-sitemap.mjs` (319 to 318 URLs: `/compendium/op-clearlocks` is gone, so
  the build's prerender should also lose that one entry document; part 2's build measures it).
- STORED DATA IS KEPT. Hydrate, pickle, persist and `locksAfterFullGenerate` stay key-agnostic,
  so a save's old keys ride through untouched and a veto can restore the controls with them
  intact. Pruning them would be a migration (owner-gated) and was not done.
- Registers lowered to measured counts: `scripts/.size-baseline.json` `settlementSlice.js`
  824 to 823; `tests/lint/.domain-any-baseline.json` `coup.js` 9 to 7 any (via
  `node scripts/count-domain-any.mjs --update`, which moved nothing else).
- Tests: `tests/components/factionLockCoupShield.test.jsx` now pins the removal (the world scope
  renders nothing beside a live section scope; no component mounts the world scope or prints the
  rubric; a stored seat lock changes no coup outcome); `createWorkflowRail.test.jsx` (no section
  below the dossier); `rulingPower.test.js`, `proposalAdmission.test.js` (its coup fixture now
  routes through `politicalAutonomy: 'dm_only'`), `changeAuthorityPolicy.contract.test.js`,
  `locksEngine.test.js`, `locksPreservation.test.js`, `livingContentLawWiring.test.js`. Against
  the base sources 12 of these arms went red.

**Declared output shift.** Generation: only a full generate from a lock map carrying
`identity: true` or `geography: true` changes; the name and the ground now roll from the seed and
config like any other generate. Simulation: only saves whose `campaignState.locks` names the
incumbent when a coup falls; under the default, routine or full autonomy the fall now applies
automatically instead of queuing a proposal, and dm_only and recommendations are unchanged. No
rng draw moves. No golden, corpus, fixture, helper or script carries these keys (grep). How many
real saves carry them is unknown; querying production is owner-gated.

**LD-8 closed.** LD-8 (owner order 2026-08-01) ordered "Keep the name" and "Keep this ground"
removed; §767.2/§777 re-homed them instead. This order removes the whole section and stops the
stored keys acting; the structural pin in `factionLockCoupShield.test.jsx` refuses a re-mount.

**⛔ OWED TO THE CHAIR (instrument acts from a committed tree).**
- `tests/lint/observedShapeSentinel.test.js` (11 arms) and
  `tests/lint/observedShapeReaders.walker.test.js` (3 arms). Gate 0 now throws: the explained-
  writer exemption `factions on locks` names `LockControls.jsx`, which no longer writes the key,
  and every read of that key is gone too, so the exemption must be DELETED. It lives in a
  detector source (`scripts/check-observed-shape-readers.mjs`), so that is a governed schema
  migration with the sentinel's roster pins, not a plain re-freeze. The walker also reports 4
  stale rows (`identity`, `geography` and `factions on locks` in `locksPreservation.js`;
  `factions on locks` in `coup.js`), banked 62 to 60, and two drifted execution inputs (the
  regenerated compendium data and stressors leaf), all absorbed by the shrink-only `--write`
  after the migration. No comment in `LockControls.jsx` spells the key, so gate 0 cannot pass
  falsely. Rehearsed on a committed scratch clone of this change: `node
  scripts/check-observed-shape-readers.mjs --write` exits 1 at gate 0 with the STALE message, so
  a plain re-freeze cannot absorb it; the exemption's deletion has to come first.

### Order 5: the Systems Health sentence list (part 1)

**The chair's ruling (vetoable).** Remove the whole sentence list under the Systems Health bars
and keep the bars and their labels. Picking one sentence was rejected because one arbitrary
reading would stand in for the other nine. Do not delete the prose rules, the corpus or the
generator; the sentences are to be re-homed later. Bank anything the removal darkens through
the writer-reach register's own door. Pin the removal and the bars.

**What changed.**
- `src/domain/display/stateProse/dossierMounts.js`: the `overview.systemsHealth` row (DS-GEN-3)
  is now a GLANCE row, so the one reader draws no sentence there. DS-GEN-3 stays mounted (not
  parked dark, which would have grown the shrink-only dark list) and has no speaking position
  until its lenses are re-homed, which is a registry act.
- `src/components/new/tabs/OverviewTab.jsx`: the stacked `healthLines` render is gone; the
  status tags, the six bars, their band words and the first-survey caption stay.
- `src/components/new/generalDeskRead.js` keeps `healthLines` routed through the registry (now
  always empty), so the mount id keeps its one site and the future re-home has its call site.
- The desk (`generalStateProse.js`), the corpus and the generators are untouched.
- Tests: `tests/ui/generalDeskTabFlow.test.js` renders the Overview for the fixture town and
  three generated towns and asserts the bar labels render and the Systems Health section holds
  no sentence paragraph, plus the drawn DS-GEN-3 member is absent; the reader arm asserts
  `healthLines` is empty; `generalStateProseDesk.test.js` pins that DS-GEN-3 has no speaking
  position and is not parked dark; `composeStateProse.test.js` moved its sentence-mount example
  to `overview.ground`. Against the base sources the three DOM and reader arms and the
  registry arm went red.

**Where else it renders.** Nowhere as one block: the stack was OverviewTab's alone. The DM
Summary does not call the general desk and `src/pdf` imports no state prose (grep).

**Writer reach.** `tests/lint/writerReach.walker.test.js` stayed green: the removal takes no
read out of the web-display closure (the desk still reads the same fields, and every fact the
lines banded is still printed by its tag or bar), so nothing went dark and nothing was banked.

**Output shift.** Rendered: the Overview's Systems Health section prints no sentence list, on
every settlement, DM and player. Composed prose, the DRIFT manifest, the census rows and every
generator output are unchanged by this order (the census moved its `dossierMounts.js` stamp
only).

### Known reds at part 1's hand-off
`npx vitest run tests/lint tests/design tests/build/sitemap.test.js` on the part-1 tree: 4 files
and 16 tests red, 172 files and 2,865 tests green (`tests/lint` and `tests/design` were 175 of
175 files and 2,872 of 2,872 tests green at the base before any change). The whole suite, run on
a committed scratch clone of part 1 before the sitemap regeneration: 2,585 files, 6 failed, 2,571
passed, 8 skipped; 18 tests failed, 33,239 passed, 118 skipped. Of those 18, 16 are the reds
below, the sitemap one is cured by the regeneration above (9 of 9 after), and
`tests/soak-harness/coveringArrayCoverage.test.js` passed when re-run alone on the same clone
(the box's load average was about 200 on 8 cores during the whole-suite run). The 16:
- `tests/lint/sovereigntyLightingContract.walker.test.js` (1): the live test-title count moved
  24,462 to 24,461. Expected; refreeze after commit, never by a lane.
- `tests/lint/observedShapeSentinel.test.js` (11) and `tests/lint/observedShapeReaders.walker.test.js`
  (3): see Order 3's owed instrument act.
- `tests/lint/goldenFreeze.walker.test.js` arm 1 (1): see Order 1's owed signature.

### Order 2: the Herald waits for the first advance (part 2)

**The chair's ruling (vetoable).** The Herald (the desktop panel, its toggle or reopen control,
and the phone companion) is not shown on a campaign whose realm clock has never been advanced;
it appears once the first advance has happened and stays available from then on, including
after a reload. Derive "has advanced" from existing persisted campaign state and add no new
persisted field unless none exists. Whatever the Herald carries that a user still needs before
the first advance must stay reachable elsewhere, listed.

**The cause.** Nothing asked whether the realm had ever advanced. On desktop the panel mounted
whenever `inspectorOpen` was true (`WorldMap.jsx`), the toolbar toggle was always passed, and
for anon and free viewers `useRealmInspector.js` opened the Herald on every Realm entry to show
its locked Cartographer teaser, which is the owner's screenshot. The flagged phone companion
mounted for any premium campaign (`RealmMobileGate.jsx`).

**The persisted state used: `worldState.tick`, no new field.** It is 0 on a fresh world
(`createDefaultWorldState`) and every clock-moving path adds one per week (`pulseKernel.js`: a
single tick, an interval, the tick a paused interval commits, the autonomous catch-up); it
rides campaign hydration across a reload. `calendar.elapsedWeeks` (and the raw legacy
`elapsedMonths`) are read as a fallback because a legacy months-only save hydrates to tick 0
with weeks already elapsed. The predicate is one leaf, `src/lib/realmHeraldGate.js`
(`realmHasAdvanced`), with no theme or store import.

**What changed.**
- `src/hooks/useRealmInspector.js` returns `heraldAvailable` as its OWN flag. `inspectorOpen` and
  the per-campaign session record are left as the GM set them, so the Herald returns where it
  was once the clock moves, and after a reload of a realm that has advanced. The anon/free
  auto-open effect is gone; in its place the same `map_realm_teaser` pricing moment the teaser
  fired on mount now fires once per Realm visit, and only after `auth.loading` has cleared, so a
  premium session still hydrating is never pitched (cooldown-guarded as before).
- `src/components/WorldMap.jsx`: the toggle is passed only while `heraldAvailable` (the toolbar
  already drops a non-function toggle together with its unreviewed-count badge) and the panel
  mounts only while `heraldAvailable`. Zero net effective lines: the file stays at 599 of 600.
  The first advance's own `openInspectorAt('dashboard')` means the Herald opens on the Dashboard
  the moment the first tick commits; a paused first interval commits its tick and opens on
  Adjudication, where its verdict surface lives.
- `src/components/map/RealmMobileGate.jsx`: the companion needs `realmHasAdvanced(campaign)` too,
  and its copy is re-keyed so a premium never-advanced phone reads the read-only sentence, not
  the locked-account one. Production phones are unchanged (the `heraldCommandBrief` flag is dark
  there and their Dashboard slot is not the Herald).
- `src/components/map/WorldMapOverlays.jsx`: while the realm has never advanced, the Advance
  dialog carries `LivingWorldGates` (lazy, with a narrated fallback: the witnessed-wait ratchet
  holds at 38 silent boundaries).
- `src/components/map/WorldMapTourSteps.js`: the Inspector step now says it opens once the realm
  has advanced for the first time.

**Kept reachable before the first advance (the ruling's list).**
- Advance Realm and its interval: the toolbar (they never lived in the Herald).
- Start the World Clock: the Advance dialog (already there).
- Relationship drift, War layer, Faith spread: the Advance dialog (new) and More, then Rules.
- Map geography (the spatial canonize, which changes what the first advance computes): the
  Advance dialog (new). Its only live mount had been the Herald's Dashboard.
- The anon/free Cartographer upsell: the `map_realm_teaser` popover on Realm entry (the same
  moment, now fired by the hook), the same moment behind the locked Supply chains reaches in the
  Layers panel and the Routes toolbar, the Instant World card's See Premium (disabled with its
  pill until launch), and the footer's Pricing link. Phones keep the locked Dashboard teaser.
- Deity assignment: the dossier's `DeityAssignmentPanel`. Cancelling a queued event: the
  dossier's `PendingIntentions`. Map lenses: the Layers panel.
- Creating or selecting a campaign (the Herald's no-campaign Dashboard offered both): the
  palette's empty state and the toolbar's campaign select.

**Deliberately deferred until the first advance (documented, not bugs to re-find).** The realm
forcing surface `RealmVerbComposer` (its other mount, in `WorldPulsePanel`, is dead), the Stage
the Road and Timelapse desk tools, the Gazetteer, Remembrance and Wanderers registers, the Faith
door's pantheon panel, the read-only War and Trade panels, and the Herald's own search, filters
and time lens. The desktop anon/free teaser's longer body (its three benefit bullets) no longer
shows; the popover carries the pitch.

**JUDGMENTS (each vetoable).**
- JUDGMENT: the gate is derived with no sticky memory, so undoing a realm's ONLY advance returns
  it to never-advanced and the Herald waits again. The alternative, a session-only sticky flag,
  would not survive a reload and would disagree with the restored world. Say "veto" to add it.
- JUDGMENT: the anon/free upsell stays as the entry pricing moment rather than relocating the
  whole locked teaser into the 240px palette. Measured: that column already overflows at
  1024x768 (see the reported sibling below), so a second tall card there would bury the settlement
  list. Say "veto" to relocate the teaser instead.
- JUDGMENT: the pre-advance living-world controls ride the Advance dialog, the one place every
  first advance passes through, beside the existing Start the World Clock CTA, rather than a new
  toolbar or palette control. Say "veto" to move them.

**Tests (each run against the base sources and red there).**
- `tests/lib/realmHeraldGate.test.js` (new): the predicate over the real world-state
  constructors, the legacy months-only save and junk readings.
- `tests/ui/realmHeraldGate.test.jsx` (new, desktop WorldMap): a never-advanced realm with a
  remembered open Herald shows neither panel nor toggle while Advance Realm stays; an advanced
  realm's toggle opens it; the Herald appears the moment the first advance commits; a reload of
  an advanced realm restores it; the Advance dialog carries the living-world controls only before
  the first advance; anon gets no Herald and the moment fires once, only after auth settles;
  premium is never pitched. Base: 4 of 7 red. A mutant without the auth-settled guard reds 1.
- `tests/ui/heraldMobileCompanion.test.jsx`: the two premium fixtures moved from `worldState: {}`
  to `{ tick: 7 }` (declared cause: the companion now waits for the first advance), plus a
  never-advanced premium arm. Base: 1 red; a mutant without the copy re-key: 1 red.
- `tests/ui/realmInspectorSize.test.jsx`: the restored-session arm also asserts
  `heraldAvailable` is false while `inspectorOpen` stays true (the separate flag).
- `e2e/realm-herald-gate.spec.js` (new, Chromium): a fresh realm; an advanced realm opened from
  its toggle and restored by a reload; THE REAL FIRST ADVANCE (Start the World Clock in the
  dialog, advance, the Herald appears, no advance failure logged); anon. On the untouched base
  a62dcbb90: 3 of 4 red (the persistence arm is green there by design).
- `e2e/regional-causality.spec.js`: the Wizard News arm opens the Herald, so its campaign gains
  `worldState: { tick: 2, calendar: { elapsedWeeks: 2 } }` (declared cause: the toggle waits for
  the first advance).

**Output shift.** UI only. No simulation, engine, generation or persisted-shape change; no rng
draw moves.

### Order 4: the small visual defects (part 2)

**The chair's ruling (vetoable).** Fix all three. (a) Census every other host of
`AvailableAtLaunchPill`, fix any that clips at 1024 or 390, and pin the rule structurally if
cheap. (b) The Surveyor card reads top to bottom with no dead gap, its CTA aligned with its
siblings'. (c) The painted background meets the shaft once the feather is hidden, with no cream
strip at any scroll position, while content at scroll 0 still clears the feather.

**(a) "ee Premium" on the Realm's Instant World card.** Cause: the Button primitive is
`white-space: nowrap; justify-content: center`, and the a11y floor `button { min-width: 24px }`
(`src/styles/a11y.css`) replaces a flex item's min-content minimum; in the Realm's 240px sidebar
the locked button (186px) was narrower than "See Premium" plus the pill (about 238px), so both
spilled out and the card's `overflow: hidden` cut both ends. The launch-lock pass had given its
siblings a closed-only wrap keyed on the viewport, and this card is desktop-only. Fix: a
closed-only `flexWrap: 'wrap'` on that button. Measured on the production build in Chromium, at
1024 and 1440 wide: button 51 to 237, content 71 to 223, card 33 to 255; the button grows from 40
to 59px tall. THE CENSUS: 35 pills in 24 files, 22 inside the Button primitive. Only this one
clipped at 1024 or 390 in the survey's live walk. JUDGMENT: every other Button host now carries
the same closed-only wrap (LandingBelowFold, PlaceInRegionCard, SaveQuotaMeter, FaithSection,
DeityAssignmentPanel twice, EventComposerDeityField, DossierSessionNotices,
SettlementDetailActions), which changes nothing while the room is there and wraps instead of
clipping when it is not, so the rule can be pinned exactly; BuyThisDossier's two hosts stay
exempt by name (a min-content grid, where a wrap would always break the line; they wrap on
phones through their spread, pinned in `launchLock.dossier.test.jsx`). Say "veto" to keep the
eight unclipped hosts as they were and exempt them instead. THE PIN:
`tests/lint/launchPillHostWrap.walker.test.js` (espree over every file that mentions the pill;
WRAPS, EXEMPT and OTHER_HOSTS frozen exact in both directions; four in-file mutant arms), with
its manifest row and sweep plant #105 (deleting the card's wrap: clean 8 passed, planted 2 red,
restored 8 passed, md5 `986b6146145563020491b68f77bd77ac` before and after, cp backup and cp
restore). `tests/components/launchLock.upsells.test.jsx` asserts the locked reach wraps and the
premium toggle does not.

**(b) the Surveyor card's dead gap.** Cause: its body paragraph carried `flex: 1`, and the tier
row stretches every card to the tallest (590px), so the paragraph absorbed 242px (1024) or 261px
(1440) mid-card. Fix: the paragraph no longer grows and the CTA takes `marginTop: 'auto'`, so the
lead, body and key note read straight down and the spare height sits above the CTA, exactly where
the sibling cards keep theirs. Measured on the build: paragraph slack 1 to 3px; the CTA's top
880 against the Wanderer's 881 at 1440 and 859 against 860 at 1024 (the 1px is the Surveyor's
border). Pinned in `tests/ui/pricingPageBands.test.jsx` (every tier-row card: CTA last, the only
growing child directly above it or the CTA's own auto margin; base red).

**(c) the cream strip under the shaft: the premise corrected, then fixed.** Measured: the
landing reserves no space for the feather (App.jsx gives home only SP.lg of top padding and the
hero sits under the header). At 1440x900 and scroll 2400 the layer under the shaft is `#forge`'s
84px bottom padding (the section spans 1749 to 2505, so its tail sits 41 to 105px from the top),
and the film begins where `#forge` ends. The strip was a translucent-cream stop's empty tail
passing under the transparent header, so it recurred at every stop's tail. Fix: each
translucent-cream stop (`#forge`, `#voice`, `#realm`, `#commons`) fades its tail out over the
tail's own height with an inline mask (`linear-gradient(INK calc(100% - tail), transparent)`,
the ArrowPaint idiom; 84px on desktop, 48px on phones), so the cream dissolves into the film and
the painting meets the shaft at every scroll; the dark closer keeps its scene, the header and the
scroll-0 reserve are untouched. It lives in the lazy below-fold chunk, so first-paint JS and
render-blocking CSS do not move. JUDGMENT: this softens every cream stop's bottom edge into the
film at rest as well (a look change the order implies but does not name); `#voice`'s bottom
hairline fades with it. Say "veto" to keep hard edges; the strip then returns whenever a tail
passes under the arrow. Pinned in `tests/ui/homeLanding.test.jsx` (the rendered mask on exactly
the four cream stops, sized to each tail; base red) and measured in `e2e/visual-polish.spec.js`.

**Found beside them and fixed (same page, same family).** The phone landing scrolled 2px
sideways: `twoColGrid`'s `minmax(380px, 1fr)` in a 366px column. The track minimum is now
`min(380px, 100%)`. Measured at 390 wide: scrollWidth 390, clientWidth 390 (392 before).

**`e2e/visual-polish.spec.js` (new, Chromium):** (a) at 1024 and 1440 the label and pill sit
inside the button and the button inside the card; (b) at 1024 and 1440 no Surveyor paragraph
outgrows its text, the content sits one gap apart and the CTAs stay level; (c) Chromium's
computed mask on the four cream stops; the phone landing does not scroll sideways. On the
untouched base: 6 of 6 red.

### Found beside the orders (part 2), reported, not fixed

- ⛔ **THE FIRST REALM ADVANCE FAILS FOR A CAMPAIGN WITH NO CONTENT BINDING** (pre-existing,
  reproduced on the untouched base a62dcbb90 in Chromium against the e2e dev server). A campaign
  without `contentBinding` (a legacy, imported or seeded one) is pinned by
  `pinLegacyCampaignContentBindings` (`src/store/campaignSlice.js`, also called at the top of the
  advance session) inside a producer, passing `state.activeContentEnvironment`, an Immer draft,
  into `makeCampaignContentBinding`, whose vanilla branch keeps it by reference inside an
  `Object.freeze`d binding; Immer does not finalize drafts inside frozen objects, so the stored
  environment is a revoked proxy. The advance's `cloneJson(c)` then throws "Cannot perform
  'getPrototypeOf' on a proxy that has been revoked" and the GM sees "The realm could not advance.
  Try again in a moment." A probe located the revoked value at `campaign.contentBinding.environment`
  (CONFIRMED); the freeze mechanism is read from code (PLAUSIBLE until fixed and re-run). Such a
  realm can never make its first advance, so under Order 2 its Herald never appears.
  `e2e/realm-herald-gate.spec.js` seeds a pre-pinned vanilla binding to step around it. Not fixed
  here: it is a store and persistence repair outside these orders, and the simulation programme
  is paused. A follow-up task was raised with the repro, stack and a likely cure.
- **The Realm sidebar clips its own content at viewport heights below about 900px.** The palette
  column is `overflow: hidden`; at 1024x768 the Instant World card (554 to 799) is cut at 667 and
  the settlement list has no height, and at 1280x800 it is cut at 699. Pre-existing: the card was
  19px shorter before the wrap and was still cut. At the owner's 1440x900 it fits with 2px to
  spare after the wrap (797 against 799). A cure would let the no-campaign block scroll with the
  list; that is a palette layout change beyond the named defects.
- `useAdvanceSession.js`'s "Canonize the world" toast action opens the Herald's Adjudication door,
  which is withheld before the first advance; it cannot fire in practice because the Advance
  dialog's confirm stays disabled until the world is canonized. The `pendingMapWorkspace` consumer
  in `useRealmInspector.js` has no writer in any store slice. Both pre-existing, left as they were.

### Receipts and known reds at part 2's hand-off
- The whole vitest suite on the worktree (parts 1 and 2 together, after part 2's last source
  edit): 2,588 files, 4 failed, 2,583 passed, 1 skipped; 16 tests failed, 33,320 passed, 62
  skipped. The 16 are part 1's reds and nothing else: `observedShapeSentinel` (11) and
  `observedShapeReaders.walker` (3), with the same stale 4, banked 62 against 60 and the same two
  drifted inputs, so part 2 added no reader row; `goldenFreeze.walker` arm 1 (1); and
  `sovereigntyLightingContract.walker` (1), whose file count now reads 2,588 against the census's
  2,585 because part 2 adds three test files (and titles). Refreeze after commit, never by a lane.
- `node scripts/check-full-typecheck.mjs`: 167 errors, ceiling 167, no regression.
- ESLint, in chunks of eight, on every source, test and e2e file part 2 touched: exit 0.
- `npm run build`, then `VERIFY_DIST=1 npx vitest run tests/build/`: 55 files, 504 tests passed.
  The first-paint static closure (eight files) measured against the untouched base a62dcbb90 built
  the same way: raw 1,036,097 to 1,035,611 B (budget 1,048,000; 12,389 B spare), gzip 329,155 to
  328,993 (budget 337,000), Brotli 276,406 to 276,278 (budget 283,000), render-blocking CSS
  19,576 to 19,576 (budget 19,800). The small drop is part 1's store and domain removals; no string
  of any part-2 module appears in a first-paint chunk. Lazy chunks: WorldMap 82,191 to 82,802 B;
  the living-world controls now load as their own 7,405 B chunk (RealmDashboard 23,672 to 16,807);
  LandingBelowFold 24,617 to 24,833; PricingPage 25,140 to 25,150. The prerender wrote 305 route
  documents against the base's 306 (part 1's retired `/compendium/op-clearlocks`).
- `CI=1 npx playwright test --project=chromium`: 88 tests, 81 passed, 7 skipped, 0 failed, no
  retry. `CI=1 npx playwright test e2e/mobile-pointer-targets.spec.js e2e/arrow-header.spec.js
  --project=mobile-safari`: 5 passed, 14 skipped (the desktop Chromium arms skip there by design).

### The owner's third set of orders (2026-09-17, later), and what part 3 carries

The chair reported part 1 and asked whether the frozen dossier-prose golden could be
re-recorded. **The owner: "I approve and remove the other padlocks and fix the remaining
contradictions as well."** So part 3 carries three things: (A) the frozen goldens through their
own signed door, (B) every remaining lock control removed and every lock kind off at the read
chokepoint, and (C) the remaining contradictions fixed at source plus a census for others. The
owner lifted the simulation pause for the contradiction fixes only.

### Part 3 (A): the frozen goldens move ONLY through the signed door

**The chair's ruling (vetoable).** Re-record through `tests/helpers/goldenRecordDoor.js` and
nowhere else; record the owner's approval verbatim with the date and the cause; if the door
needs a committed tree or a commit trailer, prepare everything and state the exact command;
never hand-edit a golden; list every other frozen surface these changes move.

**What the door requires (read, not assumed).** `ACTIONS` makes `re-record` OWNER-signed.
`recordGolden` refuses in order: no signature (`GOLDEN_SHIFT_SIGNED` must NAME a record file
under `docs/shift-records/`, and the door parses its CONTENT), blank provenance ("" or "1" in
`ownerWords` / `ownerDate` / `odqRow` / `cause` / `seat`), a surface the record does not name, an
unknown verb, a proofForm that disagrees with the register row, **a tree dirty beyond the
register, the manifest being written and the record itself**, and a prediction miss. A
successful write THROWS by design; the receipt is a plain re-run of the suite plus
`tests/lint/goldenFreeze.walker.test.js`. `commitTrailerRefusal` wants `Owner-Signed: §NNN` on
the commit. The genesis act is the precedent to copy: `8c9fd0672`, trailer `Owner-Signed: §901`,
record `docs/shift-records/2026-09-16-genesis-freeze-generator-golden-master.json`, fixture +
register + record in ONE commit.

**The record, prepared and deliberately refused until the chair signs it:**
`docs/shift-records/2026-09-17-dossier-contradictions.json`. It carries the owner's words
verbatim, `ownerDate` 2026-09-17, ONE cause (the day's contradiction orders, with the mechanism
and the measured movement of each surface), the seat, and TWO surfaces
(`dossier-prose-manifest` · `re-record` · predictedRows 2 · `derived-artefact`;
`espionage-dormancy-fence` · `re-record` · predictedRows 1 · `in-file corpus constant`).
⛔ **`odqRow` IS BLANK ON PURPOSE**: the owner spoke in the chair's chat and the ledger row that
records it is the chair's to write. While it is blank the door REFUSES the record
(`BLANK_PROVENANCE`), so nothing can move by accident. JUDGMENT (vetoable): ONE record for both
surfaces, because both movements are the same cause (the day's contradiction orders) and the
door names its surface at each write; say "veto" to split it in two.

**⛔ PART 1's OUT-OF-DOOR WRITE IS REVERTED IN THE TREE.** Part 1 re-recorded
`tests/fixtures/dossier-prose-manifest-golden.json` with the plain recorder (before this
ruling). Part 3 restored it to its committed bytes (`git show HEAD:<path> > <path>`), so the
frozen golden is untouched in the working tree and moves for the first time inside the door act.
`tests/lint/goldenFreeze.walker.test.js` is therefore GREEN again (it was arm-1 red at part 1's
hand-off), and two arms of `tests/property/dossierProseManifest.test.js` are red until the door
commit (see the known reds).

**Surface 1 — `dossier-prose-manifest`. The capture arm now goes THROUGH the door.**
`scripts/prose-manifest-cells.mjs --record` wrote the fixture directly, which was lawful while
the register was UNFROZEN (the register's own arms forbade a recorded value then) and is an
unsigned move of a frozen golden since the genesis. It now calls `recordGolden`, so it refuses
without a signature, refuses a dirty tree, writes the fixture and its register row in one act
and throws on success. The register row's own note anticipated exactly this ("when the freeze
act arms this register, its re-record path becomes the door like every other"). The declared
shift the fixture carries (`MANIFEST_PROVENANCE`) is restated from the old INSTRUMENT shift
(SITTING §P.2-29) to a **PROSE** shift naming the owner's orders and this record; the suite's
provenance arm moves with it, with the cause in a comment. THE COMMANDS, in order, from a
CLEAN tree at the landing commit (the fixture, the register and the record are the only paths
that may be dirty):

```sh
# 1. fill odqRow in docs/shift-records/2026-09-17-dossier-contradictions.json
# 2. the door write (it FAILS on success, printing old -> new; that is correct)
GOLDEN_SHIFT_SIGNED=docs/shift-records/2026-09-17-dossier-contradictions.json \
  node scripts/prose-manifest-cells.mjs --record
# 3. the receipt
npx vitest run tests/property/dossierProseManifest.test.js tests/lint/goldenFreeze.walker.test.js
# 4. commit the fixture, the register and the record together, trailer `Owner-Signed: §NNN`
```

**Surface 2 — `espionage-dormancy-fence`, an IN-FILE corpus constant.** Its surface is the test
file itself (`tests/property/espionageDormancyFence.test.js`, `PRE_COUPLING_CORPUS_SHA`), and
its header's window law says movement outside a named chartered window is a STOP. The mover is
FOUND and attributed to zero residue: `src/generators/power/governanceNarrative.js` ALONE moves
it (the base clone with only that file swapped in produces the same new value), 29 of 360 rows
move and **every one of them in the single field `powerStructure.stability`** (11 wartime · 6
insurgency · 6 mass migration · 3 religious conversion · 3 infiltration), 360/360 hashes
stay distinct, `cda5ec87…` becomes `f13df68e5e511cd385473e95307240d5b73659e11f718eaeafc5f69bf060a69e`.
⛔ **AMENDED BY PART 4** (below): part 3 measured 26 rows and `b9dc82bc…` with five arms; the
sixth arm adds the three infiltration rows and carries the corpus to the value above, which is the
one the fence's own red now prints as "Received". The door
write is prepared as a one-off runner rather than new repo tooling:
`<f6ac0d98 scratchpad>/p3/door-espionage-fence.mjs`. It re-MEASURES the 360-settlement corpus
with the fence's own recipe, refuses unless the measurement equals `--expect`, rewrites the
constant AND adds the shift paragraph to the constant's docblock, and writes through
`recordGolden`:

```sh
GOLDEN_SHIFT_SIGNED=docs/shift-records/2026-09-17-dossier-contradictions.json \
  node <f6ac0d98 scratchpad>/p3/door-espionage-fence.mjs \
  --expect f13df68e5e511cd385473e95307240d5b73659e11f718eaeafc5f69bf060a69e
npx vitest run tests/property/espionageDormancyFence.test.js tests/lint/goldenFreeze.walker.test.js
# commit the fence file, the register and (if not already committed) the record, same trailer
```

⛔ **THE RUNNER IS CARRIED HERE VERBATIM, because the lane's scratchpad dies with the lane.**
Write these bytes to any path outside the repo (a scratch file: it is a one-off act, not repo
tooling) and run it from the repo root of the committed tree. It writes NOTHING unless the corpus
it measures equals `--expect`, and then only through the door.

```js
// THE CHAIR'S DOOR WRITE for the espionage dormancy fence's in-file corpus constant
// (owner orders 2026-09-17, the dossier contradictions). Run FROM THE REPO ROOT of a COMMITTED
// tree whose only dirty paths may be the fence file, the golden register and the signed record:
//
//   GOLDEN_SHIFT_SIGNED=docs/shift-records/2026-09-17-dossier-contradictions.json \
//     node <this file> --expect f13df68e5e511cd385473e95307240d5b73659e11f718eaeafc5f69bf060a69e
//
// It MEASURES the fence's 360-settlement corpus with the fence's own recipe, refuses unless the
// measurement equals --expect (the value the fence's own red run printed as "Received"), rewrites
// the constant and adds the SHIFT RECORD paragraph to the constant's docblock, and writes the file
// and its register row through tests/helpers/goldenRecordDoor.js, which THROWS on success by design.
// The receipt is a plain run of tests/property/espionageDormancyFence.test.js and
// tests/lint/goldenFreeze.walker.test.js afterwards.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const REL = 'tests/property/espionageDormancyFence.test.js';
const at = process.argv.indexOf('--expect');
const EXPECT = at >= 0 ? String(process.argv[at + 1] || '') : '';
if (!/^[0-9a-f]{64}$/.test(EXPECT)) throw new Error('--expect <64-hex sha> is required: the value the fence printed as Received');

const { generateSettlementPipeline } = await import(join(ROOT, 'src/generators/generateSettlementPipeline.js'));
const { recordGolden } = await import(join(ROOT, 'tests/helpers/goldenRecordDoor.js'));

// THE FENCE'S OWN RECIPE, transcribed from the test (tiers x routes x fifteen seeds, the
// key-sorted serializer, one row per settlement). The plain fence run afterwards recomputes it
// in the test's own code, so a transcription slip here reds there rather than landing.
function stable(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;
}
const sha = (s) => createHash('sha256').update(s).digest('hex');
const rows = [];
for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  for (const route of ['road', 'isolated', 'port', 'crossroads']) {
    for (let i = 0; i < 15; i += 1) {
      const seed = `SUBw4-fence1-${tier}-${route}-${String(i).padStart(3, '0')}`;
      const settlement = generateSettlementPipeline({ settType: tier, tier, tradeRouteAccess: route, culture: 'germanic' }, null, { seed });
      rows.push(`${tier}\t${route}\t${seed}\t${sha(stable(settlement))}`);
    }
  }
}
if (new Set(rows.map((row) => row.split('\t')[3])).size !== 360) throw new Error('the corpus stopped discriminating seeds');
const measured = sha(rows.join('\n'));
if (measured !== EXPECT) throw new Error(`the measured corpus is ${measured}, not the expected ${EXPECT}; NOTHING was written`);

const CONSTANT_RE = /const PRE_COUPLING_CORPUS_SHA = '([0-9a-f]{64})';/;
const ANCHOR = ' * ── 2026-09-02, T13 TRANS — THE WINDOW OPENED AND CLOSED WITH ZERO MOVEMENT ──────────';
const PARAGRAPH = [
  ' * ── 2026-09-17, THE DOSSIER CONTRADICTIONS (owner-signed, through the door) ────────────',
  ' * THE FIRST MOVEMENT OF THIS CONSTANT SINCE THE GENESIS FREEZE, AND IT DID NOT WAIT FOR THE',
  ' * LIGHTING WAVE: it is a signed re-record under tests/helpers/goldenRecordDoor.js, which from the',
  ' * genesis (2026-09-16) is the lawful path for every frozen surface. The owner ordered the dossier\'s',
  ' * contradictions fixed ("Fix the contradiction."; "fix the remaining contradictions as well") and',
  ' * signed the re-records ("I approve"), record docs/shift-records/2026-09-17-dossier-contradictions.json.',
  ' * THE MOVER, FOUND AND ATTRIBUTED TO ZERO RESIDUE: src/generators/power/governanceNarrative.js alone',
  ' * (a single-variable revert returns the old value). A town under an insurgency, a mass migration, a',
  ' * war, a religious conversion or an infiltration read `Stable` beside its ACTIVE CRISIS banner; it',
  ' * now reads a crisis band. On this corpus exactly 29 of 360 rows move, every one in the single field',
  ' * powerStructure.stability (11 wartime, 6 insurgency, 6 mass migration, 3 religious conversion,',
  ' * 3 infiltration); 360/360 hashes stay distinct. `cda5ec87…` -> `f13df68e…`.',
  ' *',
];

const produce = () => {
  const current = readFileSync(join(ROOT, REL), 'utf8');
  const match = CONSTANT_RE.exec(current);
  if (!match) throw new Error('the fence constant was not found');
  if (!current.includes(ANCHOR)) throw new Error('the docblock anchor was not found');
  if (current.includes(PARAGRAPH[0])) throw new Error('the shift paragraph is already present');
  return current
    .replace(CONSTANT_RE, `const PRE_COUPLING_CORPUS_SHA = '${measured}';`)
    .replace(ANCHOR, `${PARAGRAPH.join('\n')}\n${ANCHOR}`);
};

recordGolden({ surface: 'espionage-dormancy-fence', path: join(ROOT, REL), produce, root: ROOT });
```

**Every other frozen surface is UNMOVED, measured rather than assumed.** The generator golden
master is 525 of 525 byte-identical (the five new stability labels never occur in its corpus,
which is infiltrated or famine or calm), and `npx vitest run tests/property tests/simulation`
was 102 of 103 files green with the fence as the only red. The register's other rows are
untouched; no `sha256`, `rows` or `ownerRow` was hand-edited by this lane.

### Part 3 (B): the other padlocks

**The chair's ruling (vetoable).** Remove every remaining lock control and its display; treat
every lock kind as off at the read chokepoint without deleting stored data; census writers and
readers first; update the registers; declare every output shift.

**The census (writers and readers, before the change).** WRITERS: `LockControls.jsx` scopes
`npcs` and `history` (the NPCs tab's "Keep these people" and the History tab's "Keep this
history", each wrapping that section's Reroll) and the roster-row padlock in
`components/new/npcComponents.jsx` (`NPC_LOCK_COPY`, writing the id array). Both called the
store's `setLock`, whose only other caller (`clearLocks`) part 1 had already retired. READERS:
`domain/locksPreservation.js` (`normalizeLocks` and every predicate through it — `sectionLocked`
for `regenSection`'s refusal, `lockedNpcIdSet` for the roster carry and the full-generate carry,
`carryLockedSections` for the history carry), `generators/generateSettlementPipeline.js`
(`carryLockedRosterThroughGenerate`, `regenNPCsPipeline`), `domain/regenerationPreservation.js`
(the keepers union), the store's `remapLocksAfterRegen` / `remapLocksAfterGenerate` /
`persistLocksToActiveSave`, and `hooks/useReaderAudience.js` (a behaviour SIGNAL, see the
judgment). PERSISTENCE: `save.campaignState.locks`, carried by `pickleCampaignState`, hydrate and
the campaign pickle; `state.locks` is NOT in the local persisted projection.

**What changed.**
- `src/domain/locksPreservation.js` — THE CHOKEPOINT. `normalizeLocks` reads NOTHING: it takes
  the stored map and returns `{history: false, npcsSection: false, npcs: []}`. So the section
  refusal never fires, no id is carried through a reroll, the history carry is dormant and the
  Phase B roster carry sits at its dormancy gate. The signature keeps the map so every caller
  keeps its one read seat and a veto restores the reads in ONE function.
- `remapNpcLocks` now reads the RAW id list instead of the honoured view, because it is ALSO the
  pin remap's algebra (`remapPinnedNpcsAfterRegen` wraps `aiData.pinnedNpcs` as `{ npcs }`) and
  because keeping a stored id pointing at its own subject is data maintenance, not a lock acting.
- `src/components/dossier/LockControls.jsx` is DELETED (no scope survived it). The NPCs and
  History tabs now render the Reroll button they used to wrap, offered only to a viewer who may
  roll (before, the lock row and its button rendered even for a viewer with no reroll handler).
- `src/components/new/npcComponents.jsx` — the row padlock, its copy block, its two bronze tones
  and the `useStore` lock reads are gone; the purple PIN (a different promise: the AI leaves the
  prose alone) stays.
- The store: `setLock` retired with its registry row and with `persistLocksToActiveSave` (its
  only caller), the way part 1 retired `clearLocks`. `regenSection` keeps its `sectionLocked`
  call as the one seat a veto re-arms, with the dormancy written at the call.
  `compendiumData.generated.js` regenerated (161 to 160 operations) and `public/sitemap.xml`
  regenerated (318 to 317 URLs: `/compendium/op-setlock` is gone, so the prerender loses that
  document too).
- The display: `primitives/StateBadge.jsx` loses the never-rendered `locked` kind and
  `copy/en.js` its `state.badges.locked` / `state.tooltips.locked` ("Locked. Survives an NPC
  reroll.") — a promise nothing can make any more. `moments.regen_burst`'s body advertised
  "Locks, drift, chronicle" and now advertises "Drift and the chronicle".
- `domain/types.js`'s `Locks` typedef marks every key retired and records that the map is kept.

**Declared output shift.** RENDERED: no roster row offers a padlock; the NPCs and History tabs
show their Reroll with no lock sentence beside it, and a viewer with no reroll right sees
neither (they used to see the lock row). GENERATION: a section reroll of a settlement whose
stored map says `npcs: true` or `history: true` now REROLLS instead of refusing; a stored id no
longer carries its character through a roster reroll or a full generate; a stored `history: true`
no longer carries the history across a full generate. The new draft after a full generate drops
the stored `npcs` id array (nothing was carried, so every id names a stranger — the existing
stale-id rule), and keeps every other key verbatim; no save row is written by a generate. No rng
draw moves (the whole engine is post-hoc over a finished roll). SIMULATION: unchanged by this
part (part 1 retired the seat lock the coup read; nothing else in the pulse reads the map).
STORED DATA: hydrate, pickle and persist stay key-agnostic, so a save's map rides through
untouched and a veto restores the controls with a user's old locks intact. How many real saves
carry a lock is unknown; querying production is owner-gated.

**JUDGMENTS (each vetoable).**
- JUDGMENT: the chokepoint is `normalizeLocks`, exactly where part 1 put the world keys, rather
  than the store's two action entries. Every consumer (the store, the generation worker, any
  future caller) flows through it, so no path can honour a stored lock. The cost is that the
  Phase B carry is now unreachable code; it is KEPT, dormant and documented, so a veto is a
  revert of one read rather than a rebuild. Say "veto" to gate at the store instead.
- JUDGMENT: `hooks/useReaderAudience.js` still counts "any save with a lock" as one of the
  campaign-tier behaviour signals. It is evidence that the reader ONCE used the feature, which
  stays true, and it feeds no regeneration and no simulation; turning it off would silently
  lower some existing readers' archetype (and with it the Founder tile's eligibility). Say
  "veto" to route it through the chokepoint too.
- JUDGMENT: the tests that used a LOCK as the lever for a survival through a reroll now use an
  AUTHORED character (`_authored: true`), which the reroll's entity policy carries into the same
  moved slot (probed: npc_6 -> npc_8 under the same pinned seeds), so
  `pinnedNpcRegenRemap.test.js` and `npcStateRegenRebind.test.js` keep measuring what they were
  written for. `departedNameProseBoundary.test.js`'s prefix-collision cure moved to its shared
  helper (`substituteWholeWord`), because the carry that used to host it is dormant.

**STOP-AND-REPORT: lock-shaped surfaces that are NOT this order's and were left alone.**
- The PREMIUM padlocks (LayersPanel's gold `Lock` glyph, the Realm dashboard's locked teaser,
  NextActionRail's "Edit (Premium)", ShareToGallery's "Save first to share publicly",
  `LockedDestination`): a tier gate, not a keep-through-a-reroll promise.
- The ENTITY-level `locked` / `pinned` flags (`domain/canonStatus.js`, honoured by
  `domain/regenerationPolicy.js`): this is how a user's OWN edits survive a reroll. It has no
  control and no padlock of its own (`CanonBadge`, which would draw one, is mounted nowhere in
  `src/`), and turning it off would make a reroll destroy authored work. Untouched.
- `copy/en.js`'s `canon.provenance.locked` label: the entity-level word above, unrendered.
- ⚠ THE SAVE-CONFIRMATION EMAIL still says "Future regenerations will not overwrite locked
  entities." The live copy is in the EDGE FUNCTION (`supabase/functions/send-email/index.ts`,
  mirrored in `src/lib/emailTemplates.js`), so changing it is a deploy, which is owner-gated.
  Reported, not fixed.

### Part 3 (C): the remaining contradictions, and the census

**The chair's ruling (vetoable).** Fix the five stress types' stability labels at the
generator's single source of truth so a settlement with an active crisis never reads as Stable;
probe the War tab's "at peace" note; then census the dossier for any other pair of surfaces that
state opposite truths about the same fact, fix every one found at its source, and list what was
checked.

**C1 — THE STABILITY LABEL (the generator's single source of truth).**
`generators/power/governanceNarrative.js`'s `applyStressStability` had an arm for seven
stressors and none for five: `insurgency`, `mass_migration`, `wartime`, `religious_conversion`,
`slave_revolt`. Measured before the fix on a forced corpus (15 stress types x 6 tiers x 3 seeds
beside the 525 golden configurations): 12 of 18 forced towns per type read the plain baseline
`Stable` under an ACTIVE CRISIS banner. Worse, `infiltrated` returned the baseline ON THE SPOT,
so an infiltration beside a PUBLIC crisis (debt, monster pressure, or any of the five) masked
that crisis's label too. Both are fixed at that one function: five arms at its tail, in the
module's own `PRIMARY_STRESS_PRECEDENCE` order (so the label names the same crisis the vignette
is written for), and the infiltration arm no longer short-circuits the arms below it. (The five
are written as five plain `if` returns rather than a table: the table cost 27 lines the module
does not have under its 800-line ceiling, and the leaf it was extracted to cost the generation
worker more bytes than its ceiling had left. See the receipts below.) The five labels, each leading with a band word already in `STABILITY_BANDS` and glossed in
the `Band (gloss)` form with no em dash (JUDGMENT, vetoable — the words are a lane's, drawn from
each stressor's own vignette and hook):
`Unstable (insurgency contests authority)` · `Strained (people arriving or leaving)` ·
`Tense (requisition and conscription)` · `Tense (the creed is contested)` ·
`Unstable (revolt not contained)`.
After the fix the census reads NO Stable band on any of the fifteen stress types except
`infiltrated` alone (below).
**Declared generation output shift.** Only `powerStructure.stability` moves, and only on a town
carrying one of the five (or an infiltration beside a public crisis): on the espionage fence's
360-settlement corpus exactly 26 rows move, all in that one field, and a whole-object deep diff
finds nothing else — no name, no roster, no history, no rng draw. The generator golden master is
unmoved (its corpus has none of the five). Downstream, those towns' Power tab reads a crisis band
instead of `Stable`, the DS-POW-2 pool key follows it (`unstable matched` for the two Unstable
labels, the plain-description floor for the other three — pinned in
`tests/domain/powerStateProseDesk.test.js`), and the AI brief, the PDF power slice and the quick
guide print the new label. The owner lifted the simulation pause for this fix.

**C2 — THE WAR TAB'S "AT PEACE" NOTE (probed, CONFIRMED, fixed).** Probe: a canonized campaign
whose world ledger has no war beat, over generated towns forced into each martial stressor,
rendered through `WarTab`. It printed "This settlement is at peace and keeps no named faith." on
a town whose Overview reads "Under Siege · ACTIVE CRISIS", "A stranger finds neither soldiers nor
temples worth remarking on at Hartsee" on an occupied town, and "There are quarrels Rundkoppel
could be part of … and it is part of none" on a town at war; outside any campaign the plain
fallback said "there is no war picture to tell". The cause: every one of those readings comes
from the campaign's war LEDGER, and a generated siege is not a ledger siege. The fix is at the
tab's own reading of "is anything martial happening": `martialCrisisBanners(settlement)` reads
the town's own banners for the five martial stressors (`under_siege`, `occupied`, `wartime`,
`insurgency`, `slave_revolt` — the same `settlement.stress` array the Overview's cards read), so
neither the DS-WAR-3 dormant note nor either plain fallback can print beside one, and the tab
renders the banners in the banner's OWN words (label + summary) under an "Active crisis" eyebrow.
A calm town in the same quiet campaign still draws its dormant note: the pool is gated, not
deleted. JUDGMENT (vetoable): the gate is the TAB's, not the desk's, because the desk would need
a new reading (`martialCrisis`) that the wiring census cannot resolve to a producer — it grew the
census's unresolved-source and not-produced counts by one each, and the tab is where "the whole
page-set at rest" is computed anyway. Say "veto" to move it into the desk and re-take the census.

**C3 — THE CENSUS.** Executed over 795 generated settlements (the 525 golden configurations plus
15 stress types x 6 tiers x 3 seeds forced), reading each town's labels and every sentence its
six desks compose at both audiences, plus targeted probes. WHAT WAS CHECKED, and the verdict:

| # | The pair | Verdict |
|---|---|---|
| 1 | stability label vs the ACTIVE CRISIS banner | FIXED (C1) |
| 2 | War tab "at peace" / "nothing is being fought" / "no siege at the walls" vs a martial banner | FIXED (C2) |
| 3 | DS-GEN-16 `UNMARKED` ("No great blow stands on {settlement}'s record") vs a `major` or `catastrophic` row listed on the History tab | FIXED: the block's own STATE-KEY says UNMARKED means "no severe event on the record", and the desk had it as the fall-through for every record neither anchored arm claimed. 15 of 525 golden towns spoke it over a severe row. A record carrying one that neither arm claims now draws NOTHING (RECORDED-UNANCHORED asserts a `false` the record never wrote) |
| 4 | safety band vs the banner (all 15 stress types) | no contradiction: every stressor lands on a non-safe band |
| 5 | food-security band vs the banner | no contradiction at the label (famine reads `Deficit — Active Famine`) |
| 6 | defense readiness vs the banner | no contradiction at the label (no besieged town reads Well-Defended or Fortress) |
| 7 | viability / prosperity / economic complexity vs the banner | no contradiction |
| 8 | every ABSENCE-keyed prose pool vs the list it denies (walls, organized force, legal chain, market, charter hall, arcane defense, exports, reserves) | consistent except the reserves row, item 12 |
| 9 | the dormant-layer, no-conflict and no-relationship-flag rows vs their lists | consistent |
| 10 | `infiltrated` ALONE keeping a `Stable` baseline | **FIXED IN PART 4** (this row read LEFT at part 3's hand-off, on the producer's own covert-crisis reasoning, with the size of the exemption declared). The review measured it: 479 of the 525 golden-master towns read `Stable` under an `Infiltrated · ACTIVE CRISIS` card, which is the same contradiction the other five were, so the sixth arm was written. See part 4 below for the label, the JUDGMENT and the declared shift |
| 11 | DS-POW-1's `Approved` band line ("nobody a stranger falls in with suggests the {seat} ought to be somebody else") vs a `Succession Void` banner and its `Volatile — power is available to whoever moves first` label | FOUND, NOT FIXED (4 of 18 forced succession-void towns). The true source is the legitimacy MODEL: `publicLegitimacy` does not read the succession-void stressor at all, so the band itself is what disagrees. Curing it moves a generation figure the coup machinery reads, which is a simulation change beyond the lifted pause; gating the prose alone would leave the label contradiction standing |
| 12 | DS-DEF-2 / DS-DEF-6 "holds no food against a bad year" / "nothing put by" vs a `Communal root cellar` in the institution list (whose own tooltip is "the buffer that carries a place through a bad harvest") | FOUND, NOT FIXED (36 of 795). The source is the generator's `instFlags.hasGranary` (`priorityHelpers.js`, keyed on the substring `granar`), while the estate's own canonical reserve reader (`isolationSupport.js RESERVE_INSTITUTION`) counts root cellars. Curing it at the flag moves the persisted `compound` flags, the defense economic score and therefore the generator golden master, and it needs a new word for the Defense tab's "Granary present" status: a generation change with authored copy, for the chair to rule |
| 13 | DS-ECO-9 `IMPORT-DEPENDENT` variant 3 ("Nothing about the arrangement is failing") vs an `Under Siege` banner | FOUND, NOT FIXED (about 3 towns of 795): a VARIANT-level overclaim against its own block's ENTAILMENT rule ("Import-Dependent entails dependence, not a named cause"). The cure is a corpus rewording, which is authoring and the chair's; the corpus gate and the byte ratchet ride with it |
| 14 | DS-DEF-2 "Defense at {settlement} is not an emergency arrangement" (the plagued perimeter-and-force row) vs an `Under Siege` banner | FOUND, NOT FIXED (2 of 795), same variant-level class; DS-DEF-8's own override row already says the crisis has rewritten the posture, so the desk knows |
| 15 | DS-DEF-1 `readiness WEAK` ("how normal the town seems to find that") vs a siege banner | FOUND, JUDGED NOT OPPOSITE (a claim about the town's habit, not about the crisis) |
| 16 | DS-GEN-11 `criticalIssueCount zero` ("finds no seam in it") vs a Structural Issues row on the Overview | JUDGED NOT OPPOSITE: two different records (the economic arithmetic vs institution prerequisites) |
| 17 | "walls with NO force" vs a `Free company hall`; "arcane defense ABSENT" vs a Druid Circle or a Warden's Lodge | JUDGED NOT OPPOSITE: a hiring hall is not a standing garrison and neither lodge is an arcane defense; the desk's own taxonomy distinguishes them (`watch PRESENT` says so in as many words) |
| 18 | Food Security's BAND WORD vs its BAR (the bar tracks `resilienceScore`) | FOUND, NOT FIXED: the ranges overlap, so a `Deficit — Active Famine` town can show a fuller bar (up to 63) than a `Secure` one (from 58). The bar's meaning is the owner's own 2026-07-22 order ("the band label, never a bare number", with the bar on the derived resilience), so reconciling them is a presentation decision for the owner rather than a lane's |
| 19 | the PDF's `powerTone` (an accent colour) matching only the bare words `unstable`/`fragile`/`volatile` | JUDGED OUT OF SCOPE: a tone, not a stated truth, and pre-existing for every glossed label |

### Receipts and known reds at part 3's hand-off

**Every figure below was EXECUTED on the settled tree**, after part 3's last source edit (the
`governanceNarrative.js` squeeze that put the module back under its 800-line ceiling and the
generation worker back under its byte ceiling). Nothing here is a prediction; the only edits
after the last run quoted here are to this document.

- **The whole vitest suite.** `npx vitest run`: 2,588 files, **5 failed**, 2,582 passed, 1
  skipped; **18 tests failed**, 33,309 passed, 62 skipped (1,047.8 s). The five red files are
  the five known reds listed at the end of this section and nothing else. Two files that were red
  earlier in part 3 are GREEN here: `tests/generators/powerStructure.test.js` (the `power/`
  module line ceiling: `governanceNarrative.js` is 799 lines against 800, and the ceiling was NOT
  raised) and `tests/domain/npcLedgerState.test.js` (its preservation lever moved from a lock to
  an authored character). `tests/scripts/gateMutex.test.js`, which failed once in an earlier
  whole-suite run on a loaded box and passed alone on this tree and on the parts-1-and-2 clone,
  passed here too: that red was load, not code.
- **tests/lint and tests/design as directories.** `npx vitest run tests/lint tests/design`: 176
  files, 3 failed, 173 passed; 15 tests failed, 2,865 passed. The three are the two
  observed-shape files and the lighting walker. `tests/lint/goldenFreeze.walker.test.js` is
  GREEN, which is part 1's out-of-door write reverted and the golden moving only inside the door.
- **The focused set.** 26 files in one run (the locks family, the removal family, C1/C2/C3's
  pins, and the four registers part 3 touched): **539 tests passed, exit 0**. The two door-owed
  goldens were run on their own and are red BY DESIGN until the chair's door act:
  `espionageDormancyFence` 21 tests / 1 failed, `dossierProseManifest` 15 tests / 2 failed.
- **Every test importing a changed or deleted module.** Enumerated on the settled tree over the
  43 changed `src/` and `scripts/` modules: **324 test files import one DIRECTLY, and 1,315 reach
  one through their static import closure** (of 2,585 test files). All of them ran inside the
  whole-suite run above, and the only reds in either set are the two door-owed goldens. Nothing
  imports the deleted
  `src/components/dossier/LockControls.jsx`: every surviving mention in `src/` and `tests/` is a
  comment or a negative assertion, and the one live reader of its PATH is
  `scripts/check-observed-shape-readers.mjs`'s stale explained-writer exemption, which is the
  observed-shape red below.
- **The generators' `--check` modes this lane touched.**
  `node scripts/generate-dossier-state-prose.mjs --check`, exit 0: "verified 68 state blocks /
  2266 variants across 6 desks, 78 causal families / 468 variants".
  `node scripts/wiring-census.mjs --check`, exit 0: "verified 708 pools / 2266 variants / 165
  relation rows against 7 stamped files". (`generate-compendium-data.mjs` and
  `generate-sitemap.mjs` carry no `--check` mode; their freshness arms ran inside the suite.)
- **The typecheck ratchet.** `node scripts/check-full-typecheck.mjs`:
  "[typecheck-ratchet] OK — no type regressions (167 error(s), ceiling 167)".
- **ESLint, in chunks of eight.** All 81 changed `.js` / `.jsx` / `.mjs` files (parts 1, 2 and 3
  together), 11 chunks, every chunk exit 0.
- **The build, and the first-paint numbers.** `npm run build` exit 0, "✓ built in 18.73s",
  "[prerender] wrote 304 static route documents (13 views + 15 gallery hubs + 276 compendium
  entries)" — one document fewer than part 2's 305, the retired `setLock` operation page.
  `VERIFY_DIST=1 npx vitest run tests/build/`: 55 files, **504 tests passed**. THE FIRST-PAINT
  STATIC CLOSURE (eight files), measured against a clone holding parts 1 and 2 only, built the
  same way: raw 1,035,611 to **1,035,094 B** (budget 1,048,000), gzip 328,993 to **328,807**
  (337,000), Brotli 276,278 to **276,135** (283,000), render-blocking CSS **19,576 unchanged**
  (19,800). Part 3 only shrinks first paint (the deleted lock controls, copy and badge kind).
  Lazy chunks: the `LockControls` chunk (1,295 B) is GONE; WarTab 19,718 to 20,380 B (C2's crisis
  block); StateBadge 1,215 to 1,163; NPCsTab 10,017 to 10,004; HistoryTab 14,732 to 14,725;
  `compendiumData.generated` 86,866 to 86,490. THE GENERATION WORKER: 1,404,417 to **1,404,489 B**
  against its never-raised ceiling of 1,404,493 — four bytes spare. That ceiling, not the line
  ceiling, is why C1's five labels are five inline `if` arms and three glosses are short: the
  table-plus-leaf shape cost 332 B more than the ceiling had left (measured, 1,404,821 B).
- **Playwright.** `CI=1 npx playwright test --project=chromium`: 88 tests, **81 passed, 7
  skipped, 0 failed**, no retry, exit 0 (4.2 m).
- **The two door writes, RE-MEASURED on the settled tree.** The rehearsal clone was cut before
  the squeeze, so both values were taken again here rather than carried over. The manifest
  composes to 1,050 rows / 72,240 cells and sha256
  `ef95a9064f161be6edb9be44e2c2d5687b3b18e49521908c5ea0ff17ae8298e2` — identical to the
  rehearsal, so the label rewording does not reach the manifest. The fence corpus measures
  `b9dc82bc…`, exactly the `--expect` the runner above carries (it is the fence's own red,
  printed as "Received").
  ⛔ **BOTH VALUES ARE SUPERSEDED BY PART 4**, whose sixth arm moves the same two surfaces once
  more: the manifest to `921c51cf…` (its provenance note grew with it) and the fence to
  `f13df68e…`, and a THIRD door write joins them (`generator-golden-master`). The live figures,
  the commands and the re-measurements are in part 4; these two are kept as the trail.
  In the rehearsal clone both door acts were executed end to end: the
  manifest row moved `a64b9a75…` to `ef95a906…` with `rows` 2 and the suite then 105 tests green,
  and the fence row moved `fe8be28d…` to `b068435b…` (the sha of the rewritten TEST FILE, `rows`
  null because the surface is not JSON) with 111 tests green. Both refusals were also proved
  there: `NO_SIGNATURE` with the env var unset, `DIRTY_TREE` with one unrelated dirty path.
  ⚠ `predictedRows` for the manifest is **2** because the door counts the artefact's TOP-LEVEL
  KEYS (`provenance` and `rows`), not its rows; the 1,050-row movement is declared in the
  record's `cause` and inside the fixture's own provenance block.
- **Negative controls, executed, never reasoned.** On a clone holding parts 1 and 2 only, with
  part 3's tests dropped in: the locks family reds 19 tests across 4 files, the control-removal
  family reds 8 across 4 files, and C1/C2/C3's family reds 8 across 3 files. The one test that
  passes on that base by design is `npcLedgerState.test.js`, whose change is a lever migration
  (lock to authored) rather than a new claim.

**THE FIVE KNOWN REDS, verbatim, and exactly what each needs.**

1. `tests/property/dossierProseManifest.test.js` (2 tests). "AssertionError: rows whose composed
   prose moved: expected [ …(1050) ] to deeply equal []" and "AssertionError: the re-record is a
   DECLARED prose shift: expected 'INSTRUMENT' to be 'PROSE'". ⛔ NEEDS THE CHAIR: a committed
   tree, `odqRow` filled in the signed record, the door command in part 3 (A), and the
   `Owner-Signed: §NNN` trailer on the commit. A lane cannot clear it without hand-editing a
   frozen golden, which the ruling forbids.
2. `tests/property/espionageDormancyFence.test.js` (1 test). "AssertionError: THE DRIVEN CORPUS
   MOVED. This is a STOP, not a re-record. … FIND THE MOVER — and attribute it to zero residue —
   before touching this constant … expected 'b9dc82bc58347d575ee111c5c88bee34570b9…' to be
   'cda5ec87790ba9fb06e68e9dfe064bb9059d0…'". The mover IS found and attributed to zero residue
   (part 3 (A)). ⛔ NEEDS THE CHAIR: same committed tree, same record, the fence runner, same
   trailer.
3. `tests/lint/observedShapeSentinel.test.js` (11 tests). Every arm fails on one cause, which the
   run prints verbatim: "Error: observed-shape explained-writer exemption \"factions on locks\"
   names a writer that cannot be read: src/components/dossier/LockControls.jsx" (then "ENOENT: no
   such file or directory"). The exemption's named writer is the component the owner ordered
   removed, and the scan reads that file on EVERY dispatch, so the whole sentinel family reds.
   ⛔ NEEDS THE CHAIR: the cure is a governed schema migration that DELETES the stale exemption
   row (`scripts/check-observed-shape-readers.mjs`) and then a shrink-only
   `node scripts/check-observed-shape-readers.mjs --write` from a CLEAN, COMMITTED tree; the
   baseline refuses a hand-edited row by design and refuses any write over a dirty tree.
4. `tests/lint/observedShapeReaders.walker.test.js` (3 tests). "AssertionError: the live heuristic
   inventory must exactly match the frozen one. A lawful shrink is `node
   scripts/check-observed-shape-readers.mjs --write` on a clean tree … NEVER hand-edit a row …
   expected { violations: +0, stale: 6 } to deeply equal { violations: +0, stale: +0 }". Same
   cause, same cure, same commit: six rows whose files or keys the removals took away.
5. `tests/lint/sovereigntyLightingContract.walker.test.js` (1 test). "AssertionError: the
   estate's file count moved — re-measure, do not re-word: expected 2588 to be 2585". Parts 2 and
   3 add test files. ⛔ NEEDS THE CHAIR, AFTER THE COMMIT: the lighting census refreeze is always
   its own commit and is never taken by a lane (this is the standing law in MEMORY and in the
   walker's own header), so it is reported here and left red.

⭐ **No ceiling, budget, baseline or cap was raised by these orders.** Every register that moved
moved DOWN to a newly measured count or sideways: the raw-color budget 1,317 to 1,313 (the
padlock's own glyph colour, with the dated note and the red run that measured it), the slice's
size baseline 824 to 816, the two prose-numerics rows in `npcComponents.jsx` only re-addressed to
their new lines, and the negative-anchor register's `npcRowLockToggle` row DELETED at zero rather
than parked. The writer-reach `--rebank` is a growth-door entry with a written charter (banking
`locks on campaignState` as DARK, because the owner ordered its only readers removed), not a
raise. The two ceilings that bind hardest — the `power/` line ceiling 800 and the
generation-worker ceiling 1,404,493 B — were met by making the code smaller.

### Part 4: the review's findings, confirmed or refuted, and what they moved

An independent review of the uncommitted parts 1 to 3 raised one must-fix and five should-fix
findings (two pairs of them the same defect seen through two lenses). Every one was re-measured
on this tree before it was acted on; nothing below is carried from the review's own numbers.

**P4-1 (MUST-FIX, CONFIRMED, FIXED) — `infiltrated` was the last stressor that could read
`Stable` under its own ACTIVE CRISIS card.** Part 3 left it deliberately and said so (C3 row 10),
on the producer's documented reasoning that infiltration is covert. The review's counter is the
owner's own later sentence, "fix the remaining contradictions as well", and the size of what the
exemption covered. MEASURED on this tree with the estate's own 525-row golden corpus: `golden rows
525 crisis towns: 516 Stable-band beside a crisis banner: 479 {"infiltrated":479}`; 480 of the 525
towns carry an infiltration banner and 479 of those read a `Stable` band beside it. THE FIX is a
sixth arm at the tail of `applyStressStability`, after the five so every public crisis still names
itself:
`if (hasStress('infiltrated')) return baselineStability.startsWith('Stable') ? 'Vulnerable (decisions shaped from outside)' : baselineStability;`

**JUDGMENT (vetoable) — why `Vulnerable`, and why the guard.** `Vulnerable` is the least alarmed
word already in `STABILITY_BANDS` that still refuses to call the town calm, which is what covert
means here: exposed, not visibly disordered. Inventing a band word (`Compromised`) would have been
authoring AND a vocabulary change rippling into every `bandOf` consumer, so it was refused. The
`startsWith('Stable')` guard is load-bearing rather than defensive: without it an infiltrated town
whose baseline already reads `Unstable (pervasive organized crime)` would be DOWNGRADED by this arm,
and the module's own precedence test says it must not be. (`includes('Stable')` would have been the
bug the estate documents twice over: `Unstable` contains `Stable`.) Say "veto" to take either back.

**The declared generation output shift (the owner lifted the pause for these fixes).** One field,
`powerStructure.stability`, and nothing else, proved by single-variable revert and a whole-object
deep diff at both corpora:
- **generator-golden-master: 480 of 525 rows move**, `FIELD PATHS THAT MOVED: [[".powerStructure.stability", 480]]`;
  479 `Stable` -> `Vulnerable (decisions shaped from outside)` and one
  `Tense — regional monster threat` -> `Vulnerable (decisions shaped from outside); monster threat active`
  (that town is `plagued`, and the new label carries a pressure marker the old one did not, so the
  annotation now rides it instead of replacing it). The 525-key set is IDENTICAL. ⛔ THE FIVE ARMS OF
  PART 3 MOVED ZERO ROWS OF THIS CORPUS, measured at the same tree: every one of the 480 is this arm,
  which is why this surface enters the signed record only now.

**AND THE RATE A PLAYER ACTUALLY MEETS, because 480 of 525 would read as alarming and is not
that number.** The golden corpus shares ONE seed (`golden-master-v3`) across 517 of its 525 rows,
so its infiltration roll is correlated almost everywhere; that is what makes it a good drift
instrument and a poor prevalence estimate. Measured on a natural sweep instead — 900
settlements over four tiers at 900 distinct seeds — **17 carry an infiltration banner and
all 17 are relabelled**: about 1.9 % of generated towns, not 91 %.
- **espionage-dormancy-fence: 26 rows become 29 of 360**, the 3 new ones all infiltration; corpus sha
  `cda5ec87...` (frozen) -> `b9dc82bc...` (part 3) -> `f13df68e...` (now).
- **dossier-prose-manifest: the CELL COUNT does not move** (72,240 before and after this arm), but 958
  cells do: 479 towns x 2 audiences, one block, `DS-POW-2 :: power.stabilityHeader`, leaving the
  `stable matched` pool for the plain-description floor, exactly as three of part 3's five labels
  already did. Fixture sha `ef95a906...` -> `921c51cf...`.

**P4-2 (CONFIRMED, FIXED) — the signed shift record understated the frozen manifest's movement by
about 35x.** Its `cause` said "72,270 cells become 72,240". 72,270 is a part-1 intermediate that was
never committed and never frozen; the FROZEN bytes at `a62dcbb90` hold 73,284 cells
(`git show HEAD:tests/property/dossierProseManifest.test.js` asserts 72,108 + 394 + 390 + 392), and
part 1's own prose in this document had it right. Nothing in the estate would have caught it:
`verifyShiftRecord` checks the record's FORM, never its prose, and `goldenFreeze.walker.test.js`
short-circuits its record-enumeration arm while `frozenAt` is set. The record now states
73,284 -> 72,240 with both rungs named, carries the DS-POW-2 movement, and carries a THIRD surface,
`generator-golden-master` (`re-record`, `predictedRows` 525, `proofForm` `settlement-hash`).
⛔ THE AMENDMENT IS LAWFUL BECAUSE NO DOOR ACT HAS HAPPENED: `odqRow` is still blank, so the door
refuses the record with BLANK_PROVENANCE and all three surfaces still stand at their frozen bytes.
A record is never edited after its act, only superseded. The same declaration is mirrored in
`MANIFEST_PROVENANCE` (`scripts/prose-manifest-cells.mjs`), which rides INSIDE the fixture's own
bytes; amending it moved the predicted sha, so the sha in the record was re-measured afterwards
and is the one above.

**THE THIRD DOOR WRITE THE CHAIR NOW OWES**, beside the two part 3 (A) already describes, from a
clean committed tree with `odqRow` filled:
```
GOLDEN_SHIFT_SIGNED=docs/shift-records/2026-09-17-dossier-contradictions.json \
  UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js
```
It throws BY DESIGN on success; the plain re-run afterwards is the receipt, and the commit carries
the same `Owner-Signed: §NNN` trailer as the other two.

**P4-3 (CONFIRMED, FIXED) — the new Herald-gate test was load-flaky.** Five of its waits cross a
`React.lazy` boundary (`RealmInspector` at `WorldMap.jsx`, `LivingWorldGates` at
`WorldMapOverlays.jsx`) on Testing Library's default 1,000 ms find timeout. Two independent reviewers
reproduced it at two different arms, and it was the sixth red in a whole-suite run that part 3
reported as five. Each of the five waits now carries an explicit `{ timeout: 5000 }`, the sibling
Herald suite's own idiom. A PER-WAIT BUDGET, NEVER A BANK: the number bounds one lazy chunk
arriving, not the file.

**P4-4 (CONFIRMED, FIXED) — the padlock removal took away the only pipeline-level pin on the
departed-name cure, and the cure is still live.** `departedNameProseBoundary.test.js` had been
rewritten to call `substituteWholeWord` directly, because the lock that used to seat its fixture is
retired. But `swapNames` still ships on the SECTION-REROLL path
(`regenNPCsPipeline -> refreshRosterProse -> swapNames -> substituteWholeWord`, keepers by `_authored`
canon, no lock anywhere), and `grep` found no test in the estate driving it: a revert to
`out.split(from).join(to)` would have passed everything. `refreshRosterProse` is now EXPORTED purely
as that seam (no `src/` module imports it, so the bundlers drop it), and the file's new first arm
merges the prefix-pair fixture with the real `mergePreservedNpcs` on an `_authored` keeper and
repairs it with the pipeline's own lane. NEGATIVE CONTROL EXECUTED: with `swapNames` reverted to the
substring swap, the new arm reds with `expected 'Kara Vossn owes Kara Voss a silent debt.'` and the
three leaf arms stay green, which is the gap itself, measured.

**P4-5 (REFUTED IN PART) — "the three sibling `realm-inspector` waits are not lazy-gated".** They
are: `WorldMap.jsx` mounts `RealmInspector` through `lazy(() => import('./map/RealmInspector.jsx'))`,
and the other reviewer observed a real failure at one of them. All five waits were budgeted, not
just the `living-world-gates` one.

**⭐ NO CEILING, BUDGET OR BASELINE WAS RAISED, AND THE WORKER PAID FOR ITSELF.** The sixth arm cost
the generation worker 86 B against 4 B of headroom (measured: 1,404,489 -> 1,404,575 B, ceiling
1,404,493, never raised). It was paid back inside the same module, output-neutrally:
`MONSTER_THREAT_ANNOTATION_MARKERS` was fifteen lower-cased strings probed by
`.some(m => stability.toLowerCase().includes(m))` and is now one case-insensitive alternation probed
by `.test(stability)` — an identical unanchored substring test, one module-private reader, no export,
no consumer. Rebuilt: **1,404,488 B, five bytes under the ceiling.** PROVED OUTPUT-NEUTRAL, not
argued: with the regex in place the 360-row fence corpus hashes to the same `f13df68e...` and the
525-row golden corpus deep-diffs to `rows whose serialized object moved: 0 of 525`. The `power/`
module line ceiling (800) is met the same way: the file is 799 lines, unchanged in count.

**Receipts, all EXECUTED on this tree after the last source edit.**
- The stability-label consumers, every test file in the estate that reads `powerStructure.stability`,
  `governanceNarrative`, `deriveGovernance` or `stabilityHeader` (8 files): **235 passed**.
- The Herald and locks families (8 files): **72 passed**. The flake batch the reviewers used (12
  files) run FIVE times: **12 passed / 170 tests, five times out of five.**
- The golden-bearing directories `tests/property tests/generators tests/simulation`: 214 files,
  **3 failed / 211 passed**; 1,802 tests, **4 failed / 1,798 passed**. The three are the door-owed
  goldens and nothing else, which answers "does this move any OTHER frozen surface": it does not.
- `tests/lint tests/design` as directories: 176 files, **3 failed / 173 passed**; 2,880 tests,
  **15 failed / 2,865 passed** — the same three files, the same 15 tests, as part 3's hand-off.
- `node scripts/check-full-typecheck.mjs`: "OK — no type regressions (167 error(s), ceiling 167)".
- ESLint over the six files this part changed, one chunk: exit 0.
- `npm run build`: "✓ built in 18.35s", 304 prerendered route documents (unchanged).
  `VERIFY_DIST=1 npx vitest run tests/build/`: 55 files, **504 passed**. FIRST PAINT, measured on
  that dist: the eight-file static closure is raw **1,035,094 B** (budget 1,048,000; 12,906 spare),
  gzip 329,347 and Brotli 276,213 (budgets 337,000 / 283,000), render-blocking CSS **19,576 B**
  (budget 19,800; 224 spare) — raw and CSS identical to part 3's figures, because nothing here
  reaches the first-paint graph. THE GENERATION WORKER: **1,404,488 B** against its never-raised
  ceiling of 1,404,493, five bytes spare (part 3 left four).
- `CI=1 npx playwright test --project=chromium`: 88 tests, **81 passed, 7 skipped, 0 failed** (4.1 m).

**THE KNOWN REDS AT PART 4'S HAND-OFF ARE SIX, one more than part 3's five.** The new one is
`tests/property/generatorGoldenMaster.test.js` (1 test, "expected [ …(480) ] to deeply equal []"),
and it is the infiltration arm's declared shift standing at the door exactly like the other two:
the corpus-totality arm beside it is GREEN (525 keys = 525), so what moved is output, not shape.
⛔ NEEDS THE CHAIR, with the command above. The other five are unchanged from part 3's list:
`dossierProseManifest` (2) and `espionageDormancyFence` (1), both door-owed; `observedShapeSentinel`
(11) and `observedShapeReaders.walker` (3), both owed the governed schema migration and a
shrink-only `--write` from a clean tree; and `sovereigntyLightingContract.walker` (1), the
test-file-count refreeze that is always its own commit and never a lane's.

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
- **Account ▾** Profile · Security · Subscription · **Messages** · Support · Data ·
  Preferences — SEVEN items, in exactly this order.

**[AMENDED 2026-08-03 — Lane C, operator messages. This block was written on
2026-08-01, before Messages existed; building it verbatim would DELETE a landed
surface.]** **Messages** shipped ahead of LD-5 (`DESIGN_OPERATOR_MESSAGES.md` §2;
commits `59d298d3` + `3b0ba465`) and is owner-ordered, not chair-elective. Three
corrections bind any LD-5 build:
1. **The Messages row is mandatory in Account ▾.** It carries the unread badge's
   SECOND render point — the owner's "moves" behavior, where opening the menu
   hides the Account button's numeral and shows the Messages item's numeral in
   the same frame. `tests/components/accountMenuMessages.test.jsx` reds if the
   row or either badge arm is dropped; that red is a REAL regression, never
   stale test debt to be re-baselined against this doc.
2. **The order mirrors the page rail, so Messages sits FOURTH, not seventh.**
   `ACCOUNT_SECTIONS` (`src/components/account/AccountNav.jsx`) is the one
   canonical order and already places Messages after Subscription. The operator-
   messages design doc's "seventh item" meant "a seventh member of a six-item
   menu", not position seven; the dropdown mirrors the rail rather than
   appending. (Chair call, vetoable — say "veto" to append it last instead.)
3. **The AI & keys row stays Surveyor-gated and out of this list**, exactly as
   the rail already filters it.

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
   `/about/guide` could not resolve when this was written (`/about` did not
   exist — About was view `howto` at `/how-to`) — **THE ABOUT SPLIT HAS SINCE
   BUILT IT; see the amendment below**; `/account/security` likewise. THE
   CORRECTED TARGETS:
   - Compendium ▾ Built-in Catalog → `/compendium`; Custom Content →
     `/compendium?mode=custom` (shipped today).
   - About ▾ — **[AMENDED 2026-08-03 — Lane C, THE ABOUT SPLIT. The old targets
     `/how-to` and `/how-to?tab=guide` are now WRONG: `/how-to` is a RETIRED
     redirect surface and `?tab=guide` never existed. Building this bullet
     verbatim would point the menu at a redirect.]** The About family is now
     three real path routes, all landed and pinned
     (`tests/components/aboutSplit.test.jsx`):
     **What this Is → `/about/what-this-is`** · **Practical Guide →
     `/about/guide`** · **Founders → `/founders`** (the owner's third item, per
     `docs/DESIGN_ABOUT_PAGES.md` §0.4/§4 — the Hall's nav home is the About
     family). The parent "About" is a link to `/about/what-this-is`, and
     `/about` itself resolves and forwards there, so the parent-stays-a-link law
     needs no special case. LD-5's remaining About work is PURE CHROME: the menu
     layer. Every target already exists.
   - Gallery ▾ Settlements → `/gallery`; Maps → `/gallery?tab=maps`;
     Campaigns → `/gallery?tab=campaigns`; My Saves → `/gallery?tab=mine`
     (auth-gated). NEW WORK: GalleryPage's tab is local `useState` — the tab
     param threads through AppViews' route props, never a second local tab
     source. (If literal path forms are ever wanted, they must register AHEAD
     of the slug regex plus a reserved-slug denylist at publish for
     maps/campaigns/mine — recorded, not chosen here.)
   - Account ▾ → **`/account?section=profile|security|subscription|messages|
     support|data|preferences`**. **[CORRECTED 2026-08-03 — Lane C: this bullet
     is now a DESCRIPTION of landed code, not new work.]** The param is spelled
     **`section`**, not `tab`; the `?tab=` form here was never built and writing
     it now would break the landed links, including the operator-message reply
     deep link `?section=support&message=<id>` (`AccountPage.jsx`). The cited
     "local `useState('profile')` at AccountPage.jsx:75 with no route read/write"
     is STALE: `AccountPage` already takes `routeSection`/`routeMessageId` props and
     the URL sync landed at `59d298d3`. The allowlist is DERIVED from
     `ACCOUNT_SECTIONS` rather than hardcoded, so adding a rail section adds its
     deep link for free — keep it derived; a hardcoded list here would silently
     drop `messages`.
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
