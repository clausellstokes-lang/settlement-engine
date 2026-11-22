# COMPENDIUM-HUB — the Compendium becomes a landing of boxes and a page per section, 2026-11-10

Seat COMPENDIUM-HUB, a child of the chair session `session_01FbPLbejcfwX5nii12VM673`. Lane
`lane/compendium-hub-2026-11-10`, cut from `lane/integration-2026-11-07` at **a116c2c52**.

**The owner's word (2026-11-10 02:4x UTC, verbatim):** "Rather than a horizontal scroll, I would like
that the first page of compendium lists in boxes that are flush to each other maybe in 3 rows each of
the different tabs. Then when one clicks on it they are taken to a different page. There is always a
back button and clicking the compendium tab when not on the main compendium page brings you back to
the main compendium page. Custom content itself now joins the other tabs."

## Measured first

| question | measurement | result |
|---|---|---|
| does any entry id collide with a reserved slug? | the 276 ids of `COMPENDIUM_INDEX` against the twelve slugs (and the old tab ids) | **none** — no STOP. Pinned. |
| H6: does the global search index institutions? | `searchCompendium` is a pure module; in Node, `inn`, `smith`, `temple`, `mills`, `watch`, `thieves` → `[]`; `mill` → only "River" (Trade Route). The index's categories: Tier 6, Trade Route 6, Monster Threat 3, Economy 5, Archetype 30, Magic & Religion 5, Living World 4 + 21, Stress 4, Neighbour 8 + 4, Concept 16, Operation 160, Calamity 4 — **no Institution at all** | a defect in every build, production included, not the e2e data mode. Cured (H6). |
| H6: which of the six words name an institution? | the 282 distinct catalog institutions by raw key and shown label | inn (5), smith (3), mills (1), watch (3), thieves (2) do; **temple names none** (the catalog's houses of worship are named otherwise), so it stays a no-match by the data |
| H3: what does the top nav's Compendium click do? | `App.jsx :: handleNavClick` → `setView(id)`, and `const setView = navigate` | a push of `/compendium` from any sub-page; once the panel takes its page from the route (H2), the landing follows by construction. Pinned. |

## Each ruling → its commit and pins

| ruling | commit | pins |
|---|---|---|
| H2 router: `/compendium/<section-slug>` reserved ahead of the entry pattern; section heads | aa88ec159 | `tests/lib/compendiumSectionRoutes.test.js` (red-first: the resolve test, 1 failed / 4 passed without the routes edit) |
| H1 + H4 + H2 pages: the landing grid, custom content the twelfth box, a page per section with Back | 8c4e62ce7 | `tests/ui/compendiumPanel.smoke.test.jsx` (re-keyed), `tests/ui/compendiumHubs.test.jsx` (re-keyed), `tests/ui/compendiumCatDeepLink.test.jsx` (re-keyed), `tests/domain/compendiumSearch.test.js` (TABS parity re-keyed to the section list), the phone chrome floor census row |
| H3 nav | ed5dadb72 | `tests/ui/compendiumHubNavigation.test.jsx` H3 block; `e2e/arrow-header.spec.js` "Compendium from a compendium sub-page returns to the landing" |
| H5 redirects, jumps, prerender, sitemap | ada3424b4 | `tests/ui/compendiumHubNavigation.test.jsx` H5 block (twelve old → new addresses, history replaced), `tests/build/sitemap.test.js`, `tests/build/prerenderRoutes.test.js`, `tests/components/surveyorGlossary.test.jsx` (re-keyed) |
| H6 search | 9538f7cb4 | `tests/ui/compendiumInstitutionSearch.test.jsx` (red-first: the rendered-search test red before the wiring, 1 failed / 3 passed) |

Every re-keyed pin was re-keyed BY IDENTITY with the owner's word as the cause; none was loosened (the
tablist pin became a nav-landmark pin with the twelve hrefs in order; the "opens on Overview" pins
became "opens on the landing grid"; the sitemap's "12 ?tab= URLs" became the eleven section pages
present and no `?tab=` URL).

## The words on the boxes (no new prose)

Each box's line is that section's existing Overview-card sentence or its own first intro sentence,
verbatim; counts come from the generated artifact.

| box | count (source) | line (source) |
|---|---|---|
| Tiers & Routes | 6 (`CD.tiers.length`, the Tiers card) | the Tiers card |
| Economy | — | EconomyTab's italic lead-in |
| Powers | 30 (`CD.archetypes.count`, the Archetypes card) | the Archetypes card |
| Institutions | 282 (`CD.institutions.distinctNames`) | the Institutions card |
| Operations | 160 (`CD.operations.count`) | the Operations card |
| Magic & Religion | — | ArcaneTab's first sentence, read from `CD.faith.authorship` |
| Living World | 21 (`CD.systems.length`) | the Living World card |
| Stress | — | StressTab's first sentence |
| Calamity | 4 (`CD.calamity.flavors.length`) | the Calamity card |
| Neighbour System | 8 (`CD.relationships.count`, the Relationships card) | the Relationships card |
| A–Z Index | — (the Overview carried no A–Z card) | AtoZIndex's first sentence, with its own total |
| My Custom Content | the reader's item count when above 0 (the old toggle's badge) | — (neither source exists) |

One composed string, flagged for veto: the custom page's head title "My Custom Content: SettlementForge
Compendium" (the section's label in the other sections' title pattern); its description reuses the
compendium route's own description. The section page heading's kicker is the word "Compendium".


## Phase 1 additions (the chair's rulings of 02:42 and 02:50, reached this seat at 03:43)

**The owner's words (verbatim):** "And apply your suggestions as wll" · "Sorry u meant three columns not three
rows! Behind each box should be imagery(chosen from our stock) made opaque with regal gold for the lettering of
the button. Of course custom content gets the purple gold treatment waiting till launch." · "The search bar acts
as a search bar that filters based on string matching".

| ruling | commit | what changed | pins |
|---|---|---|---|
| H1 revised + H1+ order and kickers | a2f84305e | three columns at every width (at 390 px three columns hold: names in two lines at most, the count on its own line, kicker hidden), order reading across: Tiers & Routes, Economy, Powers / Institutions, Magic & Religion, Stress / Calamity, Neighbour System, Operations / Living World, A–Z Index, My Custom Content; kickers "The world" x 8, "How it works" x 2, none x 2 | smoke: hrefs in order, `repeat(3, …)`, kickers 8/2/0 |
| H13 tiles | a2f84305e | a stock painting behind every tile (crops under public/backgrounds/compendium/, 800 x 320 webp q60, 432 KB in all, lazy, sized, alt=""), an ink scrim at 0.80, the name in regal gold (gold-400 #D9B566 = GOLD_B, the launch skin's letter token) and the serif, the count smaller; descriptions dropped | smoke: src, lazy, 800 x 320, alt, file on disk, no description |
| H14 launch skin | a2f84305e | My Custom Content, while purchases are closed: data-skin="launch", the launch ground's deepest stop as scrim, the shimmer on the name, the existing "Available at launch" pill (wraps inside the tile on a phone) | smoke: skin and pill on the twelfth tile only |
| H12 first phone screen | a2f84305e (measured, no change) | iPhone 13: the first row of tiles ends at 517 px; the bottom bar begins near 620 px (screenshot) — the row is whole on the first screen with no text removed | — (measured; e2e overflow walk green) |
| H8 search | 5a8522a83, 69e39ed93 | landing: every entry whose name or category CONTAINS the string, case-insensitive, no cap; section page: the one box hides every entry whose text lacks the string, in place, entries kept whole | red-first 2 failed / 9 passed, then green |
| registers | 7a834a63d | lighting census titles 28982 -> 28984, suiteTitles 7825 -> 7826 | the door, then 34/34 |

**Contrast, measured:** gold-400 on the 0.80 ink scrim over pure white (the brightest pixel any painting can
show): 5.02:1. Scrim 0.75 would give 4.17:1, so 0.80 is the shallowest AA scrim.

**Provenance (the AI-media register, scripts/ai-media-provenance.json):** our stock is credited AI media, so
every crop is cut with sharp `.keepMetadata()` (the estate's own pipeline rule), carries its source's XMP credit
byte for byte (every `require` marker present, every `forbid` marker absent, checked per file), and is registered
with its source's row plus `derived_from`; present 56 -> 68, PRESENT_COUNT re-keyed with the cause. Three first
choices (pricing, thorpe, create) were cohort-A files of unrecorded origin, which the register freezes at 23 and
must not grow, and a fourth (export-dispatch) is a pinned no-Google-credit master; all were swapped for
credited stills (commit c53d6175e).

**Section → stock file → crop (for the owner's veto):**

| section | stock | crop |
|---|---|---|
| Tiers & Routes | backgrounds/world-map.jpg (the crossroads signpost) | attention |
| Economy | backgrounds/city.jpg (the trading town from above) | centre |
| Powers | backgrounds/founders-charter.jpg (the sealed charter) | centre |
| Institutions | backgrounds/gallery.jpg (the town crier in the square) | attention |
| Magic & Religion | backgrounds/dim-desk.jpg (the lantern desk) | centre |
| Stress | backgrounds/evolution-1-thorp.jpg (the lone thorp) | centre |
| Calamity | backgrounds/about.jpg (the night fire) | centre |
| Neighbour System | backgrounds/settlements.jpg (the map of settlements) | west |
| Operations | backgrounds/realm-table.jpg (the map table) | centre |
| Living World | backgrounds/evolution-5-city.jpg (the living city) | centre |
| A–Z Index | backgrounds/compendium.jpg (the scriptorium) | west |
| My Custom Content | backgrounds/evolution-2-hamlet.jpg (a hamlet beginning) | centre |

**Seen at 1440 x 900 and iPhone 13:** three columns by four rows, flush, the paintings legible behind the
scrim, the gold names clear; the purple twelfth tile with its pill; no page scrolls sideways (1440 = 1440, 390 =
390); Back on every sub-page. The e2e walk (overflow, arrow header, pinned footer) on Chromium: 90 passed, 4
skipped (WebKit).

## Old → new addresses (H5: history REPLACED, in the lazy panel)

| old | new |
|---|---|
| `/compendium?tab=<id>[#anchor]` | `/compendium/<slug>[#anchor]` (tiers, economy, powers, institutions, operations, magic-and-religion, living-world, stress, calamity, neighbours, a-z) |
| `/compendium?tab=overview`, a removed tab (`lenses`, `facets`) | `/compendium` |
| `/compendium?mode=custom` | `/compendium/custom` |
| `/compendium?mode=custom&cat=<bucket>`, `/compendium?cat=<valid bucket>` | `/compendium/custom?cat=<bucket>` |
| `/compendium#<anchor>` (ANCHOR_TO_TAB) | `/compendium/<slug>#<anchor>` |
| `/compendium#<unknown>` | unchanged (the landing) |
| sitemap `?tab=` × 12 (one, `deities`, dead) | `/compendium/<slug>` × 11 (custom is per-reader, not listed) |
| prerender: none for sections | eleven section documents with their own head |

Jumps: the global search's result and the A–Z index push the section page with the entry's anchor; the
dossier's glossary card (`SurveyorGlossary`) links the section page directly. The dossier's own entity
links (`useNavigateToEntity`) move between dossier tabs and never enter the compendium, so they are
unchanged.

## What I saw (screenshots)

Taken against `vite --mode e2e`, read by me, at 1440x900 and as an iPhone 13 (390 wide); each page also measured
in the browser (`scrollWidth <= clientWidth`, the grid's distinct row tops and column lefts, a Back button, the h1, `document.title`).

| page | desktop 1440 | iPhone 13 |
|---|---|---|
| `/compendium` | header unchanged, the global search, the paragraph and sample-world line, then ONE bordered grid **4 x 3**, flush: hairline rules shared, one outer border, no gaps; each box icon + name, the count right-aligned in gold old-style figures, one muted line; no Back; title "The SettlementForge Compendium"; 1440 = 1440 | **2 x 6**, flush, every box whole (long lines wrap inside the box, "Neighbour System" and "My Custom Content" wrap their names); 390 = 390 |
| `/compendium/institutions` | Back, kicker "Compendium", h1 "Institutions", "Search..." bar, the catalog grid as before (282, first 48); title "Institutional catalog: …" | the same, one column of cards; 390 = 390 |
| `/compendium/custom` | Back, h1 "My Custom Content", "Search custom content..." and the authoring workspace | Back, h1, search, the "Author custom content on desktop" gate unchanged; 390 = 390 |
| `/compendium/tier-thorp` | Back, h1 "Tiers & Routes", scrolled to the tiers; title "Thorp · SettlementForge Compendium" | the same; 390 = 390 |
| `/compendium?tab=operations` | replaced by `/compendium/operations` | the same |
| global search "inn" | five rows, each tagged INSTITUTION (Inn (multiple), Inns and taverns (district), Wayside inn, Coaching inn, Travelers' inn); choosing the first opened `/compendium/institutions#inst-inn-multiple`, search filled "Inn (multiple)", 1 result, its card on screen | — |

One thing fixed after looking: the A–Z box first showed its total twice (as the count and inside its line); the
count went (the Overview carried no A–Z card), the line keeps the total.

Not seen: the WebKit phone block of `e2e/arrow-header.spec.js` (no WebKit build in this container); the
iPhone 13 screenshots are Chromium's device emulation.

Lane-own sweep reds, cured in their own commits: 7d8eb376e (three bare negatives anchored; the
raw-button baseline loses the CompendiumPanel row, a shrink), 29205be43 (the lighting census re-frozen by its
door: files 3173 -> 3176, the three new test files), 231fa7c44 (the observed-shape UNREVIEWED-UI cohort gap
1/19/49 -> 0/18/47: CompendiumPanel's two M11-cleared `replaceState on history` reads left with the tab row),
and this record's commit (the citation roster `dated` 215 -> 216, through the Edit tool).

## Gates

| gate | result |
|---|---|
| the sweep `tests/lint tests/scripts tests/components tests/build` | after the cures, every remaining red is red at the base a116c2c52 (measured in a base worktree): dossierPhoneFloorAllViews (2), publicProseEquality (2), readerValidationOnPage (1), proseFamilyContract (3), newsHeadlineContract (2), domainAnyCastBaseline (1), ledgerCitationIntegrity and provenanceMap (0 tests, load errors), observedShapeReaders (4 of its 5; the fifth was this lane's, cured); engineGatedRuleKeys timed out at 20 s once under the full sweep's load and passes alone |
| `npm run typecheck:ratchet` | 167, ceiling 167 |
| wiring census `--check` | 856 pools / 2779 variants / 165 relation rows verified |
| phone chrome floor census | re-recorded (/compendium floored 208 -> 206) in 8c4e62ce7 |
| e2e on Chromium against `vite --mode e2e` | arrow-header 15 passed / 4 skipped (the WebKit phone block); phone-horizontal-overflow + pinned-footer 75/75, every section page among them |
| production build (`NODE_OPTIONS=--max-old-space-size=8192`; the default heap OOMs in this container) + prerender | 315 documents (276 entries + 11 sections + 13 views + 15 hubs); tests/build: the entry budget green; the five dist reds (vendorPdfLazy 2, cultureProfilesLazy, generationWorkerLazy worker ceiling, bootSmoke) red at the base build too, the same five, the worker byte-identical (generation.worker-CMnADi-X.js, 2,007,375 B both sides) |
| generated outputs | no file under src/generators or src/domain changed except searchIndex.js's COMPENDIUM_TABS (the destination list, not an entry); gm /525, fence /360, prose, witness, herald and the PDF snapshot were not re-run separately |

## CONFIRMED against PLAUSIBLE

CONFIRMED by execution: the routes and the no-collision guard; the grid's 4 x 3 / 2 x 6 and zero horizontal
scroll at 1440 and 390 (and 375 in the e2e walk); Back on every sub-page; the nav returning to the landing
(unit and e2e); the twelve old addresses replaced; institutions findable and landing on their card; the
sweep's lane-own reds cured. PLAUSIBLE, not executed: that the generated outputs (gm, fence, prose, witness,
herald, PDF) are unmoved — no generator or display source changed, but those suites were not run here; the
WebKit phone block of the arrow-header spec.

## What stays

- Inbound links outside the compendium keep their old addresses and ride the H5 redirect:
  `HowToUse.jsx` (`?tab=`, `?mode=custom`), `AboutManifesto.jsx` (`?tab=operations` × 4, pinned by
  `tests/ui/aboutManifesto.test.jsx`), `HelpPopover.jsx` (`#anchor`), `EventComposerDeityField.jsx`
  (`?mode=custom&cat=deities`). Re-pointing them is a separate, vetoable tidy.
- The embedded (non-standalone) panel has no consumer; it keeps its own section state.
- `temple` finds no institution: no catalog institution carries the word.
