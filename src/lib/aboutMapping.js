/**
 * lib/aboutMapping.js — THE ABOUT SPLIT's mapping manifest (the totality contract).
 *
 * DESIGN_ABOUT_PAGES.md §1 requires the old About page's card inventory to be
 * assigned to exactly one destination page + section each, with the mapping
 * landing IN THE SLICE and a pin asserting totality. A comment block cannot be
 * machine-checked, so the mapping lives here as DATA and three consumers read
 * this one writer:
 *
 *   1. lib/routes.js `redirectForView` (the `/how-to?tab=…` → page + anchor bounce
 *      App's redirect effect performs),
 *   2. the two page components (their section ids come from here),
 *   3. tests/components/aboutSplit.test.jsx (totality + anchor-survival pins).
 *
 * It lives in lib/ rather than components/about/ precisely so routes.js may read
 * it: the routing table must not import a component module, and this one is pure
 * data either way.
 *
 * A fourth reader would be a fourth chance to drift, so there is no second copy.
 *
 * SUBSTRATE NOTE (verified at build, 2026-08-03). The design doc anticipated
 * "every old collapsible's deep-link anchor id" — the tree has NONE. The old
 * page's collapsibles were `primitives/Disclosure` panels whose only ids came
 * from React's `useId()` (`:r0:`-shaped, regenerated every mount), so they were
 * never addressable. The REAL deep-link grammar was the query param `?tab=<id>`
 * on `/how-to`, read once at mount. That param set is therefore the anchor set
 * this manifest must carry forward, and the split UPGRADES it: every unit now
 * has a stable, hand-authored `#anchor` that survives a reload.
 *
 * Pure data + pure functions — no React, no DOM. Unit-testable in node.
 */

/** The two page views the About family split into (lib/routes.js view ids). */
export const ABOUT_WHAT_VIEW = 'about-what-this-is';
export const ABOUT_GUIDE_VIEW = 'about-guide';

/**
 * THE MAPPING. Every unit of the pre-split About page, with the ONE destination
 * page and the ONE section anchor it becomes. `legacyTab` is the old `?tab=`
 * value where the unit was reachable by deep link (the handbook's six tabs);
 * the manifesto bands had no deep link and carry `null`.
 *
 * Split rule (design §1): the conceptual half — thesis, what the simulator is,
 * the positioning ladder, the "how it works" narrative — goes to What this Is;
 * the operational half — quick start, power use, reference, day-to-day answers —
 * goes to Practical Guide.
 *
 * @typedef {Object} AboutUnit
 * @property {string} id            stable unit id (this manifest's own key)
 * @property {'manifesto'|'handbook'} source  which old collapsible it came from
 * @property {string} legacyTab     the old ?tab= value, or '' when it had none
 * @property {string} view          destination view id
 * @property {string} anchor        destination section id (the new `#anchor`)
 * @property {string} heading       the section heading rendered at that anchor
 */
export const ABOUT_UNITS = Object.freeze(/** @type {ReadonlyArray<AboutUnit>} */ ([
  // ── The "What this is" collapsible — the manifesto's six bands ──────────────
  { id: 'hero', source: 'manifesto', legacyTab: '', view: ABOUT_WHAT_VIEW,
    anchor: 'what-this-is', heading: 'What this is' },
  { id: 'premise', source: 'manifesto', legacyTab: '', view: ABOUT_WHAT_VIEW,
    anchor: 'the-premise', heading: 'What if the town remembered?' },
  { id: 'covenant', source: 'manifesto', legacyTab: '', view: ABOUT_WHAT_VIEW,
    anchor: 'the-covenant', heading: 'The covenant' },
  { id: 'mechanism', source: 'manifesto', legacyTab: '', view: ABOUT_WHAT_VIEW,
    anchor: 'how-it-works', heading: 'One tick, in dependency order' },
  { id: 'ai', source: 'manifesto', legacyTab: '', view: ABOUT_WHAT_VIEW,
    anchor: 'where-the-ai-fits', heading: 'Caged by mechanism, not by promise' },
  { id: 'close', source: 'manifesto', legacyTab: '', view: ABOUT_WHAT_VIEW,
    anchor: 'examine-it', heading: 'Examine it thoroughly' },

  // ── The "Keeper's Handbook" collapsible — its six tabs (the ?tab= set) ──────
  { id: 'quick', source: 'handbook', legacyTab: 'quick', view: ABOUT_GUIDE_VIEW,
    anchor: 'quick-start', heading: 'Quick Start' },
  { id: 'power', source: 'handbook', legacyTab: 'power', view: ABOUT_GUIDE_VIEW,
    anchor: 'power-user', heading: 'Power User' },
  { id: 'living', source: 'handbook', legacyTab: 'living', view: ABOUT_GUIDE_VIEW,
    anchor: 'the-living-world', heading: 'The Living World' },
  { id: 'ref', source: 'handbook', legacyTab: 'ref', view: ABOUT_GUIDE_VIEW,
    anchor: 'reference', heading: 'Reference' },
  // THE ONE CROSS-HALF ASSIGNMENT: "How We Compare" is the POSITIONING LADDER,
  // which design §1 names explicitly as conceptual — so it leaves the handbook
  // and lands on What this Is. Every /compare* redirect follows it there.
  { id: 'compare', source: 'handbook', legacyTab: 'compare', view: ABOUT_WHAT_VIEW,
    anchor: 'how-we-compare', heading: 'How SettlementForge compares' },
  { id: 'faq', source: 'handbook', legacyTab: 'faq', view: ABOUT_GUIDE_VIEW,
    anchor: 'faq', heading: 'Frequently asked questions' },
]));

/** Units belonging to a destination page, in reading order (design §3). */
export function unitsForView(view) {
  return ABOUT_UNITS.filter((u) => u.view === view);
}

/** The section anchor for a unit id. Throws on an unknown id (fail loud). */
export function anchorFor(id) {
  const unit = ABOUT_UNITS.find((u) => u.id === id);
  if (!unit) throw new Error(`aboutMapping: unknown About unit "${id}"`);
  return unit.anchor;
}

/**
 * The legacy `?tab=` values that were real deep links into the old About page.
 * DERIVED from the manifest, never hand-listed, so a mapping edit cannot leave
 * the redirect grammar behind.
 */
export const LEGACY_ABOUT_TABS = Object.freeze(
  ABOUT_UNITS.filter((u) => u.legacyTab).map((u) => u.legacyTab),
);

/**
 * Where a legacy `/how-to[?tab=…]` link now lands.
 *
 * An unknown or absent tab falls to What this Is with no hash — the page the
 * bare `/how-to` showed first, and the default the parent "About" link lands on
 * (design §1). Never 404, never the wrong page.
 *
 * @param {string|null|undefined} tab
 * @returns {{ view: string, hash: string }}
 */
export function destinationForLegacyTab(tab) {
  const unit = tab ? ABOUT_UNITS.find((u) => u.legacyTab === tab) : undefined;
  if (!unit) return { view: ABOUT_WHAT_VIEW, hash: '' };
  return { view: unit.view, hash: `#${unit.anchor}` };
}

/**
 * Where a legacy About URL's QUERY STRING sends the reader. Wraps
 * destinationForLegacyTab with the `?tab=` parse so the redirect caller holds no
 * knowledge of the old grammar — a malformed or absent query is the bare-page
 * case, never a throw.
 *
 * @param {string} search  a location.search value ('?tab=faq'), or ''
 * @returns {{ view: string, hash: string }}
 */
export function destinationForLegacySearch(search) {
  try {
    return destinationForLegacyTab(new URLSearchParams(search || '').get('tab'));
  } catch {
    return { view: ABOUT_WHAT_VIEW, hash: '' };
  }
}
