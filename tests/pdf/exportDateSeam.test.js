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
import { rmSync } from 'node:fs';
import { Cover } from '../../src/pdf/sections/Cover.jsx';
import { generateCampaignPDF } from '../../src/utils/generateCampaignPDF.js';
import { paintedText } from '../helpers/jsPdfPaintedText.js';

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

  test('an injected label reaches the painted cover byline', () => {
    const file = 'campaign-seam-probe.pdf';
    try {
      generateCampaignPDF(campaign, saves, { now: 'Cyfrin 1, 2026' });
      const text = paintedText(file);
      expect(text).toContain('Generated Cyfrin 1, 2026');
      // The wall clock is NOT consulted when a label is injected.
      expect(text).not.toContain(new Date().toLocaleDateString('en-US'));
    } finally {
      rmSync(file, { force: true });
    }
  });

  test('omitting it keeps the wall-clock byline (the default is unchanged)', () => {
    const file = 'campaign-seam-probe.pdf';
    try {
      generateCampaignPDF(campaign, saves);
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

  test('a culture that lives ONLY under settlement.config.culture reaches the page', () => {
    const file = 'campaign-coast-watch.pdf';
    try {
      // The real generator shape: resolved config, no top-level culture key.
      const saves = [member('gen-1', 'Tidewatch', { config: { culture: 'tide_reaver' } })];
      generateCampaignPDF({ id: 'c9', name: 'Coast Watch', settlementIds: ['gen-1'] }, saves, { now: 'Cyfrin 1, 2026' });
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

  test('the materialized culturalIdentity.key resolves a config-stripped save', () => {
    const file = 'campaign-keyed.pdf';
    try {
      // assembleSettlement stamps culturalIdentity on the settlement ROOT; it is the
      // one live root address, and it survives a save whose config was stripped.
      const saves = [member('keyed-1', 'Keyford', { culturalIdentity: { key: 'norse' } })];
      generateCampaignPDF({ id: 'c10', name: 'Keyed', settlementIds: ['keyed-1'] }, saves, { now: 'Cyfrin 1, 2026' });
      expect(paintedText(file).toLowerCase()).toContain('norse');
    } finally {
      rmSync(file, { force: true });
    }
  });

  test('the DEAD root address settlement.culture is no longer read', () => {
    // ONE-TIME BEHAVIOUR SHIFT, stated: the exporter used to print a top-level
    // `settlement.culture`. No writer in src/ produces that key (the generator
    // writes config.culture + culturalIdentity; normalizeSettlement's identity
    // lift is still deferred; no import path mints it), so no producible save
    // changes — but a hand-built fixture that carried it now prints nothing.
    const file = 'campaign-dead-key.pdf';
    try {
      const saves = [member('dead-1', 'Twinford', { culture: 'stale_root' })];
      generateCampaignPDF({ id: 'c11', name: 'Dead Key', settlementIds: ['dead-1'] }, saves, { now: 'Cyfrin 1, 2026' });
      const painted = paintedText(file).toLowerCase();
      expect(painted).toContain('twinford');
      // anchored: 'twinford' is painted by the SAME index + digest rows that carry the culture column and pill, so those rows demonstrably rendered — the absence is a selection, not an empty page.
      expect(painted).not.toContain('stale root');
    } finally {
      rmSync(file, { force: true });
    }
  });

  test('the `random_culture` UI sentinel is never printed as a culture', () => {
    const file = 'campaign-sentinel.pdf';
    try {
      const saves = [member('sent-1', 'Rollford', { config: { culture: 'random_culture' } })];
      generateCampaignPDF({ id: 'c12', name: 'Sentinel', settlementIds: ['sent-1'] }, saves, { now: 'Cyfrin 1, 2026' });
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

  function paintedNames(campaign, saves, file) {
    try {
      generateCampaignPDF(campaign, saves, { now: 'Cyfrin 1, 2026' });
      return paintedText(file).toLowerCase();
    } finally {
      rmSync(file, { force: true });
    }
  }

  test('NUMERIC save ids resolve against STRING settlementIds', () => {
    const painted = paintedNames(
      { id: 'c13', name: 'Numeric Saves', settlementIds: ['1', '2'] },
      [member(1, 'Ashford'), member(2, 'Grimhold')],
      'campaign-numeric-saves.pdf',
    );
    expect(painted).toContain('ashford');
    expect(painted).toContain('grimhold');
  });

  test('STRING save ids resolve against NUMERIC settlementIds', () => {
    const painted = paintedNames(
      { id: 'c14', name: 'Numeric Ids', settlementIds: [1, 2] },
      [member('1', 'Ashford'), member('2', 'Grimhold')],
      'campaign-numeric-ids.pdf',
    );
    expect(painted).toContain('ashford');
    expect(painted).toContain('grimhold');
  });

  test('a genuine non-member is still excluded (the coercion is not a wildcard)', () => {
    const painted = paintedNames(
      { id: 'c15', name: 'Exclusion', settlementIds: ['1'] },
      [member(1, 'Ashford'), member(2, 'Grimhold')],
      'campaign-exclusion.pdf',
    );
    // anchored: 'ashford' proves the index rows rendered at all, so Grimhold's
    // absence is a selection rather than an empty page.
    expect(painted).toContain('ashford');
    expect(painted).not.toContain('grimhold');
  });
});
