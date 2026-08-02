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
