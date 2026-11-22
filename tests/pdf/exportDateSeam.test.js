/**
 * tests/pdf/exportDateSeam.test.js — the export-date seam, one shape across all
 * three cover artifacts.
 *
 * The generation date is the one non-reproducible byte on a cover. The World Book
 * has always made it injectable (generateWorldBook opts.now); the settlement Cover
 * and the campaign PDF read the wall clock with no seam, so neither cover could be
 * rendered reproducibly by a fixture. These pins hold the seam open on all three
 * and prove the DEFAULT still reads the wall clock (no behavior change for callers
 * that pass nothing).
 *
 * The jsPDF lane is asserted by inflating the painted content streams and reading
 * the drawn TEXT — a content assertion, never a byte-identity comparison (this
 * file's sibling doctrine in generateWorldBook.js's header).
 *
 * ⭐ THIS FILE IS ALSO THE CAMPAIGN-PDF PAINTED-CONTENT SUITE. It is the only live
 * suite that imports BOTH generateCampaignPDF and the painted-text reader, so the
 * paid-surface repairs whose only honest proof is "what did the page actually say"
 * are pinned here rather than in a new file (a new test file reds three censuses).
 * Sections after the date seam: culture address, member resolution, sanitiser.
 */
import { describe, test, expect } from 'vitest';
import { existsSync, rmSync } from 'node:fs';
import { Cover } from '../../src/pdf/sections/Cover.jsx';
import { generateCampaignPDF } from '../../src/utils/generateCampaignPDF.js';
import { paintedText } from '../helpers/jsPdfPaintedText.js';
import { loadBookFace as loadFace } from '../helpers/bookFaceLoader.js';

// Collect every string leaf from a react-pdf element tree, expanding function
// components (the walker idiom from timelineLigatureDefuse.test.js).
function collectText(node, out = []) {
  if (node == null || node === false || node === true) return out;
  if (typeof node === 'string') { out.push(node); return out; }
  if (typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const c of node) collectText(c, out); return out; }
  if (typeof node?.type === 'function') { collectText(node.type({ ...node.props }), out); return out; }
  const children = node?.props?.children;
  if (children != null) collectText(children, out);
  return out;
}

const settlement = { name: 'Ashford', tier: 'town', population: 1800 };
const vm = { summary: { identity: { name: 'Ashford', tier: 'town', population: 1800 } }, overview: {} };

describe('settlement Cover — the export date is injectable', () => {
  test('an injected label is the date the cover prints', () => {
    const text = collectText(Cover({ settlement, vm, now: 'Cyfrin 1, 2026' })).join(' ');
    expect(text).toContain('Cyfrin 1, 2026');
  });

  test('omitting it keeps the wall-clock read (the default is unchanged)', () => {
    const text = collectText(Cover({ settlement, vm })).join(' ');
    const wallClock = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    expect(text).toContain(wallClock);
  });
});

describe('campaign PDF — the export date is injectable (the World Book seam)', () => {
  const campaign = { id: 'c1', name: 'Seam Probe', settlementIds: ['a'] };
  const saves = [{ id: 'a', name: 'Ashford', settlement }];

  test('an injected label reaches the painted cover byline', async () => {
    const file = 'campaign-seam-probe.pdf';
    try {
      await generateCampaignPDF(campaign, saves, { now: 'Cyfrin 1, 2026', loadFace });
      const text = paintedText(file);
      expect(text).toContain('Generated Cyfrin 1, 2026');
      // The wall clock is NOT consulted when a label is injected.
      expect(text).not.toContain(new Date().toLocaleDateString('en-US'));
    } finally {
      rmSync(file, { force: true });
    }
  });

  test('omitting it keeps the wall-clock byline (the default is unchanged)', async () => {
    const file = 'campaign-seam-probe.pdf';
    try {
      await generateCampaignPDF(campaign, saves, { loadFace });
      expect(paintedText(file)).toContain(`Generated ${new Date().toLocaleDateString('en-US')}`);
    } finally {
      rmSync(file, { force: true });
    }
  });
});

/**
 * CULTURE ADDRESS. The generator writes the resolved culture to
 * `settlement.config.culture` (assembleSettlement.js stores effectiveConfig);
 * NOTHING has ever written a top-level `settlement.culture` — PlacementDetailCard.jsx
 * recorded that in prose, and scripts/.observed-shape-readers-baseline.json carried
 * `culture on settlement` frozen for this very file. The campaign PDF read only the
 * dead address, so four surfaces (cover Cultures stat, cover culture list, index
 * CULTURE column, digest culture pill) printed blank for EVERY modern save.
 * domain/resolveCulture.js is now the one read. Executed against the live generator:
 * `settlement.culture` is `undefined`, `settlement.config.culture` is `"germanic"`.
 */
describe('campaign PDF — culture is read from the RESOLVED config', () => {
  function member(id, name, settlement) {
    return { id, name, settlement: { name, tier: 'town', population: 1500, npcs: [], neighbourNetwork: [], ...settlement } };
  }

  test('a culture that lives ONLY under settlement.config.culture reaches the page', async () => {
    const file = 'campaign-coast-watch.pdf';
    try {
      // The real generator shape: resolved config, no top-level culture key.
      const saves = [member('gen-1', 'Tidewatch', { config: { culture: 'tide_reaver' } })];
      await generateCampaignPDF({ id: 'c9', name: 'Coast Watch', settlementIds: ['gen-1'] }, saves, { now: 'Cyfrin 1, 2026', loadFace });
      const painted = paintedText(file).toLowerCase();
      // The label is painted on three surfaces; one occurrence is the repair, and
      // the count proves the cover list, the index column and the digest pill all
      // resolved it rather than just one of them.
      expect(painted).toContain('tide reaver');
      expect(painted.split('tide reaver').length - 1).toBeGreaterThanOrEqual(3);
    } finally {
      rmSync(file, { force: true });
    }
  });

  test('the materialized culturalIdentity.key resolves a config-stripped save', async () => {
    const file = 'campaign-keyed.pdf';
    try {
      // assembleSettlement stamps culturalIdentity on the settlement ROOT; it is the
      // one live root address, and it survives a save whose config was stripped.
      const saves = [member('keyed-1', 'Keyford', { culturalIdentity: { key: 'norse' } })];
      await generateCampaignPDF({ id: 'c10', name: 'Keyed', settlementIds: ['keyed-1'] }, saves, { now: 'Cyfrin 1, 2026', loadFace });
      expect(paintedText(file).toLowerCase()).toContain('norse');
    } finally {
      rmSync(file, { force: true });
    }
  });

  test('the DEAD root address settlement.culture is no longer read', async () => {
    // ONE-TIME BEHAVIOUR SHIFT, stated: the exporter used to print a top-level
    // `settlement.culture`. No writer in src/ produces that key (the generator
    // writes config.culture + culturalIdentity; normalizeSettlement's identity
    // lift is still deferred; no import path mints it), so no producible save
    // changes — but a hand-built fixture that carried it now prints nothing.
    const file = 'campaign-dead-key.pdf';
    try {
      const saves = [member('dead-1', 'Twinford', { culture: 'stale_root' })];
      await generateCampaignPDF({ id: 'c11', name: 'Dead Key', settlementIds: ['dead-1'] }, saves, { now: 'Cyfrin 1, 2026', loadFace });
      const painted = paintedText(file).toLowerCase();
      expect(painted).toContain('twinford');
      // anchored: 'twinford' is painted by the SAME index + digest rows that carry the culture column and pill, so those rows demonstrably rendered — the absence is a selection, not an empty page.
      expect(painted).not.toContain('stale root');
    } finally {
      rmSync(file, { force: true });
    }
  });

  test('the `random_culture` UI sentinel is never printed as a culture', async () => {
    const file = 'campaign-sentinel.pdf';
    try {
      const saves = [member('sent-1', 'Rollford', { config: { culture: 'random_culture' } })];
      await generateCampaignPDF({ id: 'c12', name: 'Sentinel', settlementIds: ['sent-1'] }, saves, { now: 'Cyfrin 1, 2026', loadFace });
      const painted = paintedText(file).toLowerCase();
      expect(painted).toContain('rollford');
      // anchored: 'rollford' is painted by the SAME index row that carries the culture column, so its presence proves that row rendered at all.
      expect(painted).not.toContain('random culture');
    } finally {
      rmSync(file, { force: true });
    }
  });
});

/**
 * MEMBER RESOLUTION. `campaign.settlementIds` and a save's `id` are the same
 * identity written by two different producers, and NOTHING in the persisted shape
 * forces them to the same JavaScript type — the import panel round-trips whatever
 * the source file carried, and a legacy save can hold a numeric id. The exporter
 * resolved members with a raw `Set.has(s.id)`, so one type mismatch resolves ZERO
 * members and the paid artifact prints a cover with no settlements at all rather
 * than failing loudly. Nine sibling sites across src/ (mapEntityIds.js:41,
 * RoadScenePanel.jsx:64, resolveExportSeam.js:28-33, AuspicePanel.jsx:59,
 * PantheonPanel.jsx:77, RealmVerbComposer.jsx:62, AdminSimTuningPanel.jsx:47,
 * AssignDeityFromMap.jsx:46, SettlementsPanel.jsx:723) already coerce both ends
 * with `String`; the two exporters were the outliers.
 */
describe('campaign PDF — member ids resolve across the id-type seam', () => {
  function member(id, name) {
    return { id, name, settlement: { name, tier: 'town', population: 1500, npcs: [], neighbourNetwork: [] } };
  }

  async function paintedNames(campaign, saves, file) {
    try {
      await generateCampaignPDF(campaign, saves, { now: 'Cyfrin 1, 2026', loadFace });
      return paintedText(file).toLowerCase();
    } finally {
      rmSync(file, { force: true });
    }
  }

  test('NUMERIC save ids resolve against STRING settlementIds', async () => {
    const painted = await paintedNames(
      { id: 'c13', name: 'Numeric Saves', settlementIds: ['1', '2'] },
      [member(1, 'Ashford'), member(2, 'Grimhold')],
      'campaign-numeric-saves.pdf',
    );
    expect(painted).toContain('ashford');
    expect(painted).toContain('grimhold');
  });

  test('STRING save ids resolve against NUMERIC settlementIds', async () => {
    const painted = await paintedNames(
      { id: 'c14', name: 'Numeric Ids', settlementIds: [1, 2] },
      [member('1', 'Ashford'), member('2', 'Grimhold')],
      'campaign-numeric-ids.pdf',
    );
    expect(painted).toContain('ashford');
    expect(painted).toContain('grimhold');
  });

  test('a genuine non-member is still excluded (the coercion is not a wildcard)', async () => {
    const painted = await paintedNames(
      { id: 'c15', name: 'Exclusion', settlementIds: ['1'] },
      [member(1, 'Ashford'), member(2, 'Grimhold')],
      'campaign-exclusion.pdf',
    );
    // anchored: 'ashford' proves the index rows rendered at all, so Grimhold's
    // absence is a selection rather than an empty page.
    expect(painted).toContain('ashford');
    expect(painted).not.toContain('grimhold'); // anchored: 'ashford' asserted present above — the index rows rendered, so Grimhold's absence is a selection
  });
});

/**
 * THE FOOTER. Two defects in one mechanism, and one cure removes the habitat of both.
 *
 * (1) `footer(d, campaignName, pageN, totalPagesHint)` has always accepted a total, and
 *     renders "Page N of M" when given one — but ALL ELEVEN call sites passed three
 *     arguments, so the parameter was dead and the reader never saw a page count.
 * (2) The chapter calls stamped footers by hand, and `buildNetworkAppendix` can return
 *     WITHOUT advancing pageN (it early-returns when getAllModifiers throws, and when no
 *     settlement has network effects) while its caller stamped a footer unconditionally.
 *     The previous chapter had already stamped that same page, so it was painted TWICE,
 *     one footer over the other. The living-world call site showed the correct shape —
 *     `if (rlw.pageN !== pageN) { … footer(…) }` — so the file already disagreed with
 *     itself about how this is done.
 *
 * The cure is a SINGLE WRITER: the per-chapter stamps are gone, and every page is
 * footered exactly once in one final pass, after the document is complete and the total
 * is therefore knowable. A double stamp is now unreachable by construction rather than
 * by a guard someone must remember to copy, and "of M" is exact rather than a
 * placeholder patched up afterwards. Page 1 (the cover) stays unfootered, as before.
 */
describe('campaign PDF — every page is footered exactly once, and says its page count', () => {
  function member(id, name, settlement) {
    return { id, name, settlement: { name, tier: 'town', population: 1200, npcs: [], neighbourNetwork: [], ...settlement } };
  }

  async function paint(campaign, saves, file) {
    try {
      await generateCampaignPDF(campaign, saves, { now: 'Cyfrin 1, 2026', loadFace });
      return paintedText(file);
    } finally {
      rmSync(file, { force: true });
    }
  }

  // Two members with NO neighbour links: settlements.length > 1 (so the appendix is
  // attempted) but no settlement has network effects (so it early-returns without
  // advancing the page) — the exact shape that double-stamped.
  const NO_EFFECTS = [member('n1', 'Ashford'), member('n2', 'Grimhold')];

  test('the page count is rendered — the total is no longer a dead parameter', async () => {
    const painted = await paint({ id: 'f1', name: 'Footer Count', settlementIds: ['n1', 'n2'] }, NO_EFFECTS, 'campaign-footer-count.pdf');
    expect(painted).toMatch(/Page \d+ of \d+/);
  });

  test('the printed total equals the number of pages the reader can turn to', async () => {
    const painted = await paint({ id: 'f2', name: 'Footer Total', settlementIds: ['n1', 'n2'] }, NO_EFFECTS, 'campaign-footer-total.pdf');
    const totals = [...painted.matchAll(/Page \d+ of (\d+)/g)].map(m => Number(m[1]));
    expect(totals.length).toBeGreaterThan(0);
    // One total, agreed by every page.
    expect(new Set(totals).size).toBe(1);
    // The highest page number printed is that total (the cover carries no footer,
    // so the footered pages run 2..total).
    const pages = [...painted.matchAll(/Page (\d+) of \d+/g)].map(m => Number(m[1]));
    expect(Math.max(...pages)).toBe(totals[0]);
  });

  test('no page is stamped twice (the appendix early-return no longer double-footers)', async () => {
    const painted = await paint({ id: 'f3', name: 'Footer Once', settlementIds: ['n1', 'n2'] }, NO_EFFECTS, 'campaign-footer-once.pdf');
    const pages = [...painted.matchAll(/Page (\d+) of \d+/g)].map(m => Number(m[1]));
    expect(pages.length).toBeGreaterThan(0);
    // anchored: pages were demonstrably footered, so this compares real stamps.
    expect(pages.length).toBe(new Set(pages).size);
    // And every footered page from 2..max is present exactly once — no gaps either.
    expect([...new Set(pages)].sort((a, b) => a - b)).toEqual(
      Array.from({ length: Math.max(...pages) - 1 }, (_, i) => i + 2),
    );
  });
});

/**
 * THE DOWNLOAD FILENAME'S CAP CAN LAND MID-SEPARATOR. The kernel slugify primitive
 * edge-trims BEFORE applying `max` (its documented contract — and not changeable,
 * because several call sites mint PERSISTED ids through it), so a cap at 40 can slice
 * straight through a separator and leave it dangling. The dossier exporter carried
 * this and was cured at its call site in repair 10; the two campaign-scope exporters
 * carry the identical latency, which repair 10 recorded rather than fixed.
 *
 * "Thornbury Under The Everwatchful Cliffs …" is the shape that exposes it: its slug
 * is exactly `thornbury-under-the-everwatchful-cliffs-` at 40 characters, so the file
 * downloaded as `campaign-thornbury-…-cliffs-.pdf` — a name ending in a hyphen before
 * the extension. Measured, not supposed.
 */
describe('campaign PDF — the 40-character cap never leaves a dangling separator', () => {
  const LONG = 'Thornbury Under The Everwatchful Cliffs Of Old Kingsmoor And The Sundered Vale';

  async function savedNameFor(name) {
    // The painter names the file itself; find which of the two candidates landed.
    const trimmed = 'campaign-thornbury-under-the-everwatchful-cliffs.pdf';
    const dangling = 'campaign-thornbury-under-the-everwatchful-cliffs-.pdf';
    try {
      await generateCampaignPDF({ id: 'slug1', name, settlementIds: [] }, [], { now: 'Cyfrin 1, 2026', loadFace });
      if (existsSync(trimmed)) return trimmed;
      if (existsSync(dangling)) return dangling;
      return null;
    } finally {
      rmSync(trimmed, { force: true });
      rmSync(dangling, { force: true });
    }
  }

  test('a long campaign name is capped at 40 and trimmed clean', async () => {
    const saved = await savedNameFor(LONG);
    // anchored: a file really was written under one of the two candidate names, so
    // the assertion below is about WHICH, not about a missing export.
    expect(saved).not.toBeNull();
    const slug = saved.replace(/^campaign-/, '').replace(/\.pdf$/, '');
    expect(slug.length).toBeLessThanOrEqual(40);
    expect(slug.endsWith('-')).toBe(false);
    // Still a genuine prefix of the name, not a truncation to nothing.
    expect(slug.startsWith('thornbury-under-the')).toBe(true);
  });
});
