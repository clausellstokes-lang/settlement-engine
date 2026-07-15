/**
 * @vitest-environment jsdom
 *
 * tests/pdf/campaignPdfCulture.test.js — Culture is read from the RESOLVED config.
 *
 * Regression guard for the finding: generateCampaignPDF read `settlement.culture`,
 * a field the generator never produces — culture lives at `settlement.config.culture`
 * (assembleSettlement writes it from effectiveConfig). As a result the cover's
 * Cultures stat, the index CULTURE column, and the digest culture pill were all
 * silently blank for real (generator-shaped) saves.
 *
 * We intercept every `doc.text(...)` call (jsPDF renders text glyph-by-string, so
 * the literal culture label passes through `text`) and assert:
 *   1. A save with culture ONLY under `config.culture` (the real shape) renders the
 *      culture label — the old bare-field read would NOT have.
 *   2. The legacy top-level `settlement.culture` still works (fallback).
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';

const captured = vi.hoisted(() => ({ texts: /** @type {string[]} */ ([]) }));

// Wrap jspdf: real renderer, but record every string handed to `doc.text` so we
// can assert the culture label reached a page. `save` is swapped to a no-op so no
// browser download fires.
vi.mock('jspdf', async (importActual) => {
  const actual = /** @type {any} */ (await importActual());
  const RealJsPDF = actual.jsPDF;
  function PatchedJsPDF(...args) {
    const inst = new RealJsPDF(...args);
    const realText = inst.text.bind(inst);
    inst.text = function (txt, ...rest) {
      if (typeof txt === 'string') captured.texts.push(txt);
      else if (Array.isArray(txt)) for (const t of txt) if (typeof t === 'string') captured.texts.push(t);
      return realText(txt, ...rest);
    };
    inst.save = function () { return this; };
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

import { generateCampaignPDF } from '../../src/utils/generateCampaignPDF.js';

beforeEach(() => { captured.texts = []; });

// The label the PDF should render: 'tide_reaver' → 'tide reaver' (underscores
// folded), matched case-insensitively since the cover title-cases it.
function hasCulture(texts, needle) {
  const n = needle.replace(/_/g, ' ').toLowerCase();
  return texts.some(t => t.toLowerCase().includes(n));
}

describe('generateCampaignPDF — culture is read from the resolved config', () => {
  test('renders culture that lives ONLY under settlement.config.culture (real generator shape)', () => {
    const saves = [{
      id: 'gen-1',
      name: 'Tidewatch',
      settlement: {
        name: 'Tidewatch',
        tier: 'town',
        population: 1500,
        // Generator shape: culture on the RESOLVED config, NOT top-level.
        config: { culture: 'tide_reaver' },
        npcs: [],
        neighbourNetwork: [],
      },
    }];
    const campaign = { name: 'Coast Watch', settlementIds: ['gen-1'] };

    generateCampaignPDF(campaign, saves);

    // Would fail against the old `settlement.culture`-only read (blank column/pill/stat).
    expect(hasCulture(captured.texts, 'tide_reaver')).toBe(true);
  });

  test('still renders a legacy top-level settlement.culture (fallback path)', () => {
    const saves = [{
      id: 'legacy-1',
      name: 'Oldford',
      settlement: {
        name: 'Oldford',
        tier: 'village',
        population: 400,
        culture: 'moorfolk', // legacy top-level, no config
        npcs: [],
        neighbourNetwork: [],
      },
    }];
    const campaign = { name: 'Old Set', settlementIds: ['legacy-1'] };

    generateCampaignPDF(campaign, saves);

    expect(hasCulture(captured.texts, 'moorfolk')).toBe(true);
  });
});
