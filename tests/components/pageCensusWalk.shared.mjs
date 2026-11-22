/**
 * pageCensusWalk.shared.mjs — the rendered-dossier arm's birth plan and its walk, written once (W2-A-LEAVES,
 * 2026-11-12). Read by tests/components/pageCensus.walker.test.jsx (the suite's grid) and by
 * scripts/census/page-census.render.census.jsx (the census's corpus); a helper, never a suite.
 *
 * THE WALK is the second wave's census's (`probes/SECOND-WAVE-CENSUS/render.census.jsx`, itself
 * `dossierPhoneFloorAllViews`'s): the real OutputContainer as the OWNER sees it (not read-only, premium), every
 * group and sub-tab clicked, every `aria-expanded` disclosure opened (a popup is not a disclosure), the
 * single-valued accordions opened in turn; one line per block element per view, a repeated line kept once per
 * view, `<style>` text skipped (a browser never shows it).
 *
 * THE PLAN is the census's: `<prefix>r-<size>-<i>` calm (every dial random) and `<prefix>s-<crisis>-<size>-<i>`
 * under one forced crisis. The census's own corpus is prefix `r2` at scale 1 (360 calm + 360 in crisis):
 * the banked corpus. Any other prefix is a FRESH corpus nobody tuned to.
 */

export const SIZES = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
/** The fifteen crises, in the census's fixed order (8866a0ddd), so every tree births the same seeds. */
export const CRISES = Object.freeze(['under_siege', 'famine', 'occupied', 'politically_fractured', 'indebted', 'recently_betrayed', 'infiltrated', 'plague_onset', 'succession_void', 'monster_pressure', 'insurgency', 'religious_conversion', 'slave_revolt', 'wartime', 'mass_migration']);
export const DIALS = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
export const BANKED_PREFIX = 'r2';

/**
 * The plan: `{ seed, size, crisis }` rows. Scale 1 is the census's 720 (60 calm and 4 per crisis, per size).
 * @param {string} prefix @param {number} [scale]
 * @returns {Array<{ seed: string, size: string, crisis: string|null }>}
 */
export function censusPlan(prefix, scale = 1) {
  /** @type {Array<{ seed: string, size: string, crisis: string|null }>} */ const out = [];
  for (const size of SIZES) for (let i = 0; i < 60 * scale; i++) out.push({ seed: `${prefix}r-${size}-${i}`, size, crisis: null });
  for (const crisis of CRISES) for (const size of SIZES) for (let i = 0; i < 4 * scale; i++) out.push({ seed: `${prefix}s-${crisis}-${size}-${i}`, size, crisis });
  return out;
}

/**
 * THE SUITE'S GRID: twelve births of the banked corpus, each size's first calm birth and its first birth under the
 * crisis at twice the size's index in the census's order (siege, occupation, debt, infiltration, the void, revolt).
 * @returns {Array<{ seed: string, size: string, crisis: string|null }>}
 */
export function censusGrid() {
  const plan = censusPlan(BANKED_PREFIX);
  return SIZES.flatMap((size, i) => [
    /** @type {{ seed: string, size: string, crisis: string|null }} */ (plan.find((r) => r.size === size && r.crisis === null)),
    plan.filter((r) => r.size === size && r.crisis !== null)[i * 4 * 2],
  ]);
}

/**
 * The birth config of one plan row.
 * @param {{ size: string, crisis: string|null }} row
 * @param {Record<string, unknown>} DEFAULT_CONFIG @param {(c: Record<string, unknown>) => unknown} birthConfig
 */
export const configOf = (row, DEFAULT_CONFIG, birthConfig) => birthConfig({
  ...DEFAULT_CONFIG, ...DIALS, settType: row.size,
  ...(row.crisis ? { selectedStresses: [row.crisis], selectedStressesRandom: false } : {}),
});

/** The store the container reads, for one town (the census's). @param {unknown} town @param {() => unknown} fn */
export function storeFor(town, fn) {
  return { settlement: town, aiSettlement: null, setAiSettlement: fn(), clearAiSettlement: fn(), regenSection: fn(), requestNarrative: fn(), requestDailyLife: fn(), getCost: () => 0, creditBalance: 0, aiLoading: false, aiRegenerating: false, aiError: null, aiProgress: '', aiPartialFailure: null, aiViolations: null, clearAiViolations: fn(), lastRegenerationDelta: null, clearLastRegenerationDelta: fn(), showNarrative: false, setShowNarrative: fn(), savedSettlements: [{ id: 'save-1', settlement: town }], campaigns: [], eventLog: [], systemState: null, pinNpc: fn(), unpinNpc: fn(), queueEdit: fn(), applyUserEditAction: fn(), revertUserEditAction: fn(), focusEntity: fn(), editMode: false, phase: 'draft', auth: { tier: 'premium' }, isElevated: () => false, isSettlementClockBound: () => false, userPrefs: { tableViewOpen: false }, setUserPref: fn() };
}

const BLOCK = new Set(['DIV', 'P', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SECTION', 'TR', 'UL', 'OL', 'TABLE', 'HEADER', 'FOOTER', 'ARTICLE', 'BR', 'DT', 'DD', 'DETAILS', 'SUMMARY', 'BLOCKQUOTE', 'FIGCAPTION']);

/** One line per block element; `<style>` skipped. @param {Element} root @returns {string[]} */
export function linesOf(root) {
  /** @type {string[]} */ const out = []; let cur = '';
  const flush = () => { const t = cur.replace(/\s+/g, ' ').trim(); if (t) out.push(t); cur = ''; };
  /** @param {Node} n */
  const walk = (n) => {
    for (const c of n.childNodes) {
      if (c.nodeType === 3) cur += c.nodeValue;
      else if (c.nodeType === 1) {
        const el = /** @type {Element} */ (c);
        if (el.tagName === 'STYLE') { flush(); continue; }
        const block = BLOCK.has(el.tagName);
        if (block) flush();
        walk(el);
        if (block) flush();
      }
    }
  };
  walk(root); flush();
  return out;
}

/**
 * Walk the rendered container: every group, every sub-tab, every disclosure. Returns the views.
 * @param {Element} container
 * @param {{ fireEvent: { click: (e: Element) => unknown }, waitFor: (f: () => void, o?: object) => Promise<unknown>, expect: (v: unknown) => any }} t
 * @returns {Promise<Record<string, string[]>>}
 */
export async function walkDossier(container, { fireEvent, waitFor, expect }) {
  const groupTabs = () => [...container.querySelectorAll('[aria-label="Dossier sections"] [role="tab"]')];
  const subTabs = () => [...container.querySelectorAll('[aria-label="Dossier tabs"] [role="tab"]')];
  await waitFor(() => expect(groupTabs().length).toBeGreaterThan(0));
  /** @type {Record<string, string[]>} */ const views = {};
  for (let g = 0; g < groupTabs().length; g++) {
    const groupName = (groupTabs()[g].textContent || '').trim();
    fireEvent.click(groupTabs()[g]);
    await waitFor(() => expect(subTabs().length).toBeGreaterThan(0));
    for (let i = 0; i < subTabs().length; i++) {
      const tab = subTabs()[i]; const tabName = (tab.textContent || '').trim(); const id = (tab.id || '').replace(/^sf-tab-/, '');
      fireEvent.click(tab);
      try {
        await waitFor(() => { const p = container.querySelector(`#sf-panel-${id}`); expect(p).toBeTruthy(); expect((p?.textContent || '').length).toBeGreaterThan(15); }, { timeout: 10000 });
      } catch { /* an empty panel is read as it is */ }
      const panel = container.querySelector(`#sf-panel-${id}`);
      const name = `${groupName}/${tabName}`;
      if (!panel) { views[name] = ['[NO PANEL]']; continue; }
      const seen = new Set(); /** @type {string[]} */ const acc = [];
      const snap = () => { for (const l of linesOf(panel)) if (!seen.has(l)) { seen.add(l); acc.push(l); } };
      const disclosures = () => [...panel.querySelectorAll('[aria-expanded]')].filter((e) => !e.hasAttribute('aria-haspopup'));
      for (let pass = 0; pass < 4; pass++) {
        const closed = disclosures().filter((e) => e.getAttribute('aria-expanded') === 'false');
        if (!closed.length) break;
        for (const e of closed) fireEvent.click(e);
      }
      snap();
      const n = disclosures().length;
      for (let k = 0; k < n; k++) {
        const e = disclosures()[k];
        if (!e || e.getAttribute('aria-expanded') !== 'false') continue;
        fireEvent.click(e);
        if (e.getAttribute('aria-expanded') === 'true') snap();
      }
      views[name] = acc;
    }
  }
  return views;
}
