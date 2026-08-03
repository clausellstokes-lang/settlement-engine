# DESIGN — THE ABOUT SPLIT (two pages, one header law, the Hall's nav home)

## Fable 5 architecture, 2026-08-02, from owner dictation. Implementation = the
## external implementer. ⚠️ Substrate discipline (the self-audit's lesson, applied):
## every claim below about the CURRENT About page is marked VERIFY-AT-BUILD — this
## doc was written while a correction sweep held the tree, and it asserts nothing
## about current component shape it has not verified. The ORDERS are exact; the
## component inventory is the build's first step, not this doc's assumption.

## §0 The owner's orders (binding)
1. The About page SPLITS into the two pages its dropdown names: **What this Is**
   and **Practical Guide** — two distinct pages, not sections.
2. The collapsing cards are REMOVED — content is no longer collapsible; the card
   headers go with them.
3. Each new page's header MATCHES the Compendium / Gallery / Library page-header
   pattern — the fourth page family joins the same grammar.
4. The About dropdown gains a THIRD item: **Founders** — the new nav home of the
   Founders' Hall.

## §1 The two pages (routes + content mapping)
- **Routes:** `about/what-this-is` (the default — "About" as a parent link lands
  here, per LD-5's parents-stay-links law) and `about/guide`. The Hall keeps its
  own route; the dropdown's third item points at it (§4).
- **THE MAPPING IS A TOTALITY CONTRACT, not a vibe:** build step one inventories
  every card/section of the current About accordion (VERIFY-AT-BUILD: the
  component lives in the howto/ family; enumerate its cards) and assigns each to
  exactly one destination page and section — the conceptual half (thesis, what
  the simulator is, the positioning ladder, "how it works" narrative) → What
  this Is; the operational half (Quick Start, Power User, Under the Hood,
  export guidance) → Practical Guide. The mapping table lands IN THE SLICE
  (a comment block or doc appendix) and a pin asserts totality: no card of the
  old page is orphaned, none is double-homed.
- **Anchor survival:** every old collapsible's deep-link anchor id survives as a
  section id on its destination page, and the old `/about` route (plus any
  anchored form) redirects to the right new page + anchor. Old links in the
  wild — including the product's own guide references — never 404 and never
  land on the wrong page. Pinned: a redirect-map walk over the inventoried
  anchor set.

## §2 THE HEADER LAW (one grammar for page headers, at last)
- The order's real content: the About family stops being the odd sibling.
  VERIFY-AT-BUILD whether Compendium/Gallery/Library share an actual component
  or merely a convention. If a shared component exists, both new pages consume
  it verbatim. If it is convention-only, THE SLICE EXTRACTS the shared
  `PageHeader` first (title · eyebrow/kicker · subtitle slot — whatever the
  three pages' real common shape is) and ALL FIVE pages consume the extraction —
  single-writer for page headers, and the fourth family's arrival is the reason
  the writer finally exists. No new-page-only lookalike markup: that is the
  projection-as-second-truth class applied to chrome.
- The removed CARD headers do not survive as decorative page furniture — each
  page gets the standard header plus plain section headings in the standard
  scale. Grandeur belongs to the Hall; the About family is calm and legible.

## §3 De-collapsing (the reading-order rule)
- Every card becomes a plain section in the OLD EXPANDED ORDER (reading order
  is content, preserve it); heading hierarchy re-levels to a single clean
  h1 → h2 → h3 tree per page (the accordion's heading semantics were card-local;
  the flat pages get real document structure — an a11y upgrade the accordion
  never allowed).
- No collapse/expand state, no chevrons, no per-section show-more. Long content
  is what tables of contents are for: each page MAY carry the standard in-page
  section nav IF the Compendium pattern has one (match, never invent —
  VERIFY-AT-BUILD).
- The voice-workstream backlog items that live on these surfaces ("purple
  button", `Narrative AI Prompt` renames) RIDE ALONG in the same slice where
  the split touches their sentences anyway — coordinate with the backlog's
  residual-AI cluster; never re-introduce the old wording on the new pages.

## §4 Nav integration (LD-5's grammar, completed)
- **About ▾ What this Is · Practical Guide · Founders** — three items, all real
  routes (LD-5's every-item-is-a-route law), triple-mode menu behavior
  unchanged, desktop-only dropdowns unchanged, mobile nav untouched.
- "About" the parent remains a link → `about/what-this-is`.
- The Founders item routes to the Hall's own route — the Hall's nav home is the
  About family (part of *what this is*, not what's for sale — the
  de-transactionalization completed in navigation), and the pricing card's
  "Visit the Founders' Hall" CTA keeps working unchanged.

## §5 Pins
- Mapping totality (no orphaned/double-homed card from the old inventory).
- Anchor survival (every inventoried old anchor resolves post-split).
- Header parity (all five page families render through ONE header writer —
  a source-scan pin against lookalike header markup).
- Heading-tree sanity per page (one h1; no skipped levels — the a11y floor).
- The dropdown's three items present, ordered, routed (extends LD-5's
  divider/menu census pin).

## §6 Sequencing note
Rides the LD family (landing/nav program) — after LD-5's dropdown machinery
exists; independent of the Hall's own §2/§2c amendments (the Hall doc owns
those). No engine surface, no flags, no goldens anywhere near this.

---

## PROGRESS — ✅ BUILT 2026-08-03 (Lane C, the Fable chair)

> **§1 · §2 · §3 · §5 LANDED. §4 DEFERRED (blocked on LD-5) with reason.**
> Built in the minifold worktree on `claude/composite-r4`, dark, pathspec-committed.
>
> **WHAT LANDED**
> - **§1 THE TWO PAGES.** `about-what-this-is` → `/about/what-this-is` (the nav
>   parent's destination) and `about-guide` → `/about/guide`, both real path
>   routes in `src/lib/routes.js`, both prerendered + sitemap-listed with their
>   own hand-written descriptions. The bare `/about` resolves and forwards to
>   What this Is.
> - **THE MAPPING IS DATA, NOT A COMMENT.** `src/lib/aboutMapping.js` carries all
>   twelve units of the pre-split page with their destination page + anchor, and
>   is the SINGLE writer read by (a) `routes.js redirectForView`, (b) both page
>   components' section ids, (c) the pins. The design asked for a comment block
>   or doc appendix; a data manifest is strictly better — it is machine-checkable
>   and cannot drift from the rendered anchors. *(Chair call, vetoable.)*
> - **§2 THE HEADER LAW — VERIFY-AT-BUILD RESOLVED.** A shared component ALREADY
>   EXISTED: `primitives/PageHeader.jsx`, consumed by Compendium, Gallery,
>   Library, Pricing, Account, Admin and the legal pages. No extraction was
>   needed; both new pages consume it verbatim, and a source-scan pin forbids
>   lookalike header markup on any About file.
> - **§3 DE-COLLAPSING.** `Disclosure` and the tab strip are gone from the About
>   family. Sections render flat in the old expanded order under a clean
>   h1 → h2 → h3 tree (the manifesto's hero `<h1>` was promoted into the page
>   header, so each page has exactly one). "How We Compare" moved to What this Is
>   as the positioning ladder — the one cross-half assignment.
> - **ANCHOR SURVIVAL HAS A SCROLL HALF.** `history.replaceState` performs no
>   fragment navigation and `navigate()` then scrolls to top, and a cold load of
>   `/about/guide#faq` looks for the anchor before React renders — so without
>   `components/about/useAboutHashScroll.js` a translated deep link would land on
>   the right page at the WRONG PLACE. The hook lands it on its section (instant,
>   not smooth — the motion law); an unknown fragment is a no-op.
> - **§5 PINS** — `tests/components/aboutSplit.test.jsx`, 29 tests (25 at the
>   original landing; +4 for the §3 section nav ruled in below): mapping
>   totality (against an INDEPENDENT census of the pre-split page), anchor
>   survival in both halves (published-anchor contract ⟷ manifest ⟷ real DOM ids,
>   the no-leak direction, and the arrival scroll), header parity, heading-tree
>   sanity. Four negative controls executed — a corrupted anchor, a dropped
>   section, a second h1, and an unwired scroll hook each red the suite. The FIRST
>   version of the anchor pin was VACUOUS (the pages derive their ids from the
>   manifest, so a corrupted anchor stayed green); the published-anchor literal
>   table is the independent second truth that fixed it.
>
> **§3 THE IN-PAGE SECTION NAV — THE THIRD VERIFY-AT-BUILD, ANSWERED: THE
> PATTERN EXISTS, SO THE `MAY` IS BUILT.** *(Chair ruling 2026-08-03, vetoable.)*
> §3 permits a table of contents "IF the Compendium pattern has one (match, never
> invent)". **It has one:** `src/components/compendium/CompendiumDashboard.jsx`
> renders its catalogs as a grid of REAL, anchor-carrying hrefs — crawlable and
> openable in a new tab, with the click doing in-page navigation (the pattern is
> stated in that file's own comment at the `hubHref` helper). The Practical Guide
> is a 387-line flat page carrying five sections, so the legibility law's glance
> rung is exactly what it is missing. `HowToUse.jsx` now renders `SectionNav`
> above its sections, at the Compendium's own measurements (auto-fill 220px
> columns, gold left rule, serif label over a small secondary line), with its rows
> derived from `aboutMapping.js` — the same manifest the section ids come from, so
> the nav cannot list a section the page does not render nor miss one it does.
> Two differences are forced by the surface rather than invented, and both are
> recorded in the component's docstring: there is **no count** (a guide section has
> no catalog number, and faking one is the invention §3 bars), and the **href is a
> bare `#anchor`** (every target is on this page, so the fragment IS the real
> crawlable URL, and being same-document by construction it cannot cost a reload —
> which leaves the Compendium's preventDefault half nothing to do).
>
> **`AboutWhatThisIs` GETS NO NAV, AND THE REASON IS LENGTH, NOT SYMMETRY.** The
> ruling asked for the same call there if its flat length were comparable. It is
> not: the file is 53 lines and renders exactly TWO sections (`AboutManifesto`,
> `CompareSection`). A table of contents longer than the page it indexes is
> furniture, not legibility, so it is deliberately omitted — recorded here so the
> asymmetry is not re-found as an oversight.
>
> **⊕ A REAL DEFECT THE NAV EXPOSED, FIXED IN THE SAME SLICE (disclosed, not
> drift).** The desktop ribbon is `position:'sticky', top:0`, so ANY fragment
> landing on these pages — a nav click, a translated `?tab=` deep link, or
> `useAboutHashScroll`'s `scrollIntoView` — parked the section heading UNDERNEATH
> the chrome. The shipped anchor-survival work had this latent already; the nav
> would merely have made it obvious. The Compendium answers it with
> `scroll-margin-top` (its `ANCHOR_SCROLL_MARGIN`, 84). `GuideSection` now carries
> the same 84 **derived from the chrome token rather than copied** —
> `CHROME.headerDesktop` (60) + `SP.xxl` (24) — so the two anchor surfaces share a
> measurement instead of a magic number that could drift on one side only. Pinned.
>
> **⚠️ SUBSTRATE CORRECTION (the doc's VERIFY-AT-BUILD, answered).** §1's
> "every old collapsible's deep-link anchor id" did not exist. The old
> collapsibles were `primitives/Disclosure` panels whose only ids came from
> React's `useId()` — regenerated every mount, never addressable. The page's REAL
> deep-link grammar was `/how-to?tab=<id>`, read once at mount. That param set is
> what the split carries forward, and every one of the six now redirects to a
> stable hand-authored `#anchor` (a strict upgrade: the anchors survive reload).
> Likewise "the old `/about` route" never existed — the old route was `/how-to`.
> Both are handled; `/about` now exists as the forwarding parent.
>
> **⛔ §4 NAV INTEGRATION — DEFERRED, DOCUMENTED, NOT A BUG TO RE-FIND.**
> §6 sequences §4 after LD-5's dropdown machinery, and at this commit that
> machinery does not exist: the desktop ribbon renders one flat `<button>` per
> NAV cell, and **no NAV-RIBBON DROPDOWN exists** — which is LD-5's grammar.
> *(CORRECTED 2026-08-03: this sentence originally read "with no menu layer
> anywhere", which is false and would mislead LD-5's implementer into thinking
> it must invent menu behaviour from nothing. The estate has real menus —
> `src/components/AccountMenu.jsx` and `src/components/townMap/SettlementMapExportMenu.jsx`
> are both live, and either may be worth reading for triple-mode/dismiss
> behaviour. What is absent is specifically a dropdown IN THE NAV RIBBON. The
> claim is made about the ribbon rather than about `App.jsx`, because LD-2 is
> concurrently lifting the ribbon into `src/components/nav/NavRibbon.jsx`.)*
> Building a one-off About menu would fork
> the grammar LD-5 exists to create. What landed instead: the About nav cell
> keeps its label and order-70 slot and now points at `/about/what-this-is`, and
> all three future dropdown targets (What this Is · Practical Guide · Founders)
> are real routes today — pinned. `docs/FIRST_CONTACT_BACKLOG.md`'s LD-5 block is
> AMENDED with the corrected targets, so LD-5 cannot be built against the stale
> `/how-to?tab=guide` spelling.
>
> **DISCLOSED BEHAVIOUR CHANGES** (ordered, not drift): the About nav cell's
> destination view id changed (`howto` → `about-what-this-is`); `/how-to` and
> `/compare*` became redirects; `/how-to` left the sitemap and the two new pages
> entered it; the guide's tab strip and both card collapsibles were deleted, and
> the tests pinning them were rewritten to pin the flat pages instead.
>
> **NOT DONE / OUT OF SCOPE.** §3's voice-workstream ride-along ("purple button",
> `Narrative AI Prompt` renames) was NOT performed: the split moved that copy
> byte-identically rather than editing it, so the residual-AI cluster still owns
> those sentences and can rename them in one place without racing this commit.
> Deliberately deferred.
