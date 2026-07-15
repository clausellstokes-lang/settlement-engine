/**
 * @vitest-environment jsdom
 *
 * tests/pdf/campaignPdfIdNormalization.test.js — campaign PDF id-type hardening.
 *
 * Campaign membership and the relationship map both key on save ids, which can
 * disagree in JS type across the storage round-trip: a save might carry a
 * numeric `id` while `campaign.settlementIds` (or a neighbour's `id`) is the
 * stringified form, or vice versa. A raw `Set.has(save.id)` / `===` lookup
 * silently drops the member or the edge on that mismatch.
 *
 * These tests reproduce that: numeric save ids against string settlementIds /
 * neighbour ids. Before the normalize-to-String fix, members vanish and map
 * edges disappear; after it, both survive and members list in settlementIds
 * order.
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';

// Same jspdf wrapping pattern as campaignPdf.smoke.test.js: real renderer, but
// each instance's per-instance `save` is swapped to capture the blob + page
// count instead of triggering a browser download. We additionally tap `line`
// (the map edge primitive) so we can count drawn edges.
const captured = vi.hoisted(() => ({ docs: [], lineCalls: 0 }));

vi.mock('jspdf', async (importActual) => {
  const actual = /** @type {any} */ (await importActual());
  const RealJsPDF = actual.jsPDF;
  function PatchedJsPDF(...args) {
    const inst = new RealJsPDF(...args);
    const realLine = inst.line.bind(inst);
    inst.line = function (...a) { captured.lineCalls++; return realLine(...a); };
    inst.save = function () {
      captured.docs.push({ blob: this.output('blob'), pages: this.internal.getNumberOfPages() });
      return this;
    };
    return inst;
  }
  PatchedJsPDF.API = RealJsPDF.API;
  return { ...actual, jsPDF: PatchedJsPDF };
});

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: { PDF_EXPORT_COMPLETED: 'pdf_export_completed' },
}));
vi.mock('../../src/lib/researchCapture.js', () => ({
  captureFingerprint: vi.fn(),
}));

import { generateCampaignPDF, __resolveMembers } from '../../src/utils/generateCampaignPDF.js';

beforeEach(() => {
  captured.docs = [];
  captured.lineCalls = 0;
});

function makeSave(id, name, neighbourNetwork = []) {
  return {
    id,
    name,
    settlement: { name, tier: 'town', population: 1200, culture: 'germanic', neighbourNetwork },
  };
}

describe('__resolveMembers — id-type normalization + ordering', () => {
  test('resolves members when save ids are numeric but settlementIds are strings', () => {
    const saves = [makeSave(1, 'Aldermoor'), makeSave(2, 'Cresthollow'), makeSave(3, 'Thornwatch')];
    const campaign = { settlementIds: ['1', '2', '3'] };

    const members = __resolveMembers(campaign, saves);

    // Before the fix `new Set(['1','2','3']).has(1)` is false → zero members.
    expect(members.map(m => m.name)).toEqual(['Aldermoor', 'Cresthollow', 'Thornwatch']);
  });

  test('resolves members when save ids are strings but settlementIds are numeric', () => {
    const saves = [makeSave('1', 'Aldermoor'), makeSave('2', 'Cresthollow')];
    const campaign = { settlementIds: [1, 2] };

    expect(__resolveMembers(campaign, saves).map(m => m.name)).toEqual(['Aldermoor', 'Cresthollow']);
  });

  test('lists members in settlementIds order, not allSaves order', () => {
    // allSaves arrives in a different order than the campaign declares.
    const saves = [makeSave('c', 'Thornwatch'), makeSave('a', 'Aldermoor'), makeSave('b', 'Cresthollow')];
    const campaign = { settlementIds: ['a', 'b', 'c'] };

    expect(__resolveMembers(campaign, saves).map(m => m.name)).toEqual(['Aldermoor', 'Cresthollow', 'Thornwatch']);
  });

  test('de-dupes a settlementId that appears twice', () => {
    const saves = [makeSave('a', 'Aldermoor'), makeSave('b', 'Cresthollow')];
    const campaign = { settlementIds: ['a', 'b', 'a'] };

    expect(__resolveMembers(campaign, saves).map(m => m.name)).toEqual(['Aldermoor', 'Cresthollow']);
  });

  test('skips settlementIds with no matching save', () => {
    const saves = [makeSave('a', 'Aldermoor')];
    const campaign = { settlementIds: ['a', 'ghost'] };

    expect(__resolveMembers(campaign, saves).map(m => m.name)).toEqual(['Aldermoor']);
  });
});

describe('relationship map — edges survive an id-type mismatch', () => {
  // A campaign whose member saves carry numeric ids while their neighbour
  // links reference the stringified form. The map must still draw the edge
  // line. We count `doc.line` calls and compare against a type-matched twin
  // (same topology, all-string ids): equal counts prove the mismatched run
  // did not silently drop its edge.
  function buildCampaign(idA, idB, neighbourId) {
    const saves = [
      makeSave(idA, 'Aldermoor', [{ id: neighbourId, relationshipType: 'trade_partner' }]),
      makeSave(idB, 'Cresthollow'),
    ];
    const campaign = { name: 'Edge Test', settlementIds: [String(idA), String(idB)] };
    return { saves, campaign };
  }

  test('a numeric-id ↔ string-neighbour edge is still drawn', () => {
    // Type-matched twin (all strings).
    const matched = buildCampaign('a', 'b', 'b');
    generateCampaignPDF(matched.campaign, matched.saves);
    const matchedLines = captured.lineCalls;

    captured.lineCalls = 0;
    captured.docs = [];

    // Mismatched: numeric save ids, string neighbour id.
    const mismatched = buildCampaign(1, 2, '2');
    generateCampaignPDF(mismatched.campaign, mismatched.saves);
    const mismatchedLines = captured.lineCalls;

    // Same topology ⇒ same number of drawn lines. Before the fix the mismatched
    // run drops its single edge and draws one fewer line.
    expect(matchedLines).toBeGreaterThan(0);
    expect(mismatchedLines).toBe(matchedLines);
  });
});
