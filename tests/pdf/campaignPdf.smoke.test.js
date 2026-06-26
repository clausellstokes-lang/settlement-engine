/**
 * @vitest-environment jsdom
 *
 * tests/pdf/campaignPdf.smoke.test.js — Campaign-level PDF assembly smoke test.
 *
 * Unlike the settlement dossier under src/pdf/ (react-pdf element tree, 78
 * tests), src/utils/generateCampaignPDF.js is hand-painted jsPDF: a single
 * imperative pass over cover → index → relationship map → cross-settlement NPC
 * contacts → per-settlement digest → network-effects appendix → Realm Chronicle.
 * It drives every page with manual cursor math (`y += N`), raw `addPage()`
 * calls, and an `_ensureSpace` paginator — exactly the fragile shape that
 * silently overflows or throws on an edge input. Before this file it had ZERO
 * test coverage.
 *
 * What this catches: a crash or regression anywhere in the imperative layout
 * code. We render a real multi-settlement campaign (relationships, cross-
 * settlement NPC contacts, and a live worldState so the Realm Chronicle &
 * Geopolitics section actually runs), then assert generateCampaignPDF emits a
 * non-empty PDF blob without throwing. The dormant path (empty worldState, no
 * relationships) and the empty-campaign path are exercised too, to confirm the
 * graceful-degradation branches still produce a document.
 *
 * jsPDF renders fine under jsdom for this generator — it only draws vectors
 * (rect/line/circle/text), never canvas images — so a full render is cheap
 * (~tens of ms). The one piece we intercept is `doc.save()`: in the browser it
 * triggers a file download, and it gives the caller no handle on the bytes.
 * jsPDF defines `save` as a per-INSTANCE own property (not on the prototype),
 * so we wrap the `jspdf` module: every instance still renders for real, but its
 * `save` is swapped to record the blob via `output('blob')` and the page count,
 * skipping the download side effect.
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';

// Shared sink for the swapped `save` to push into. `vi.hoisted` makes it visible
// to the hoisted `vi.mock('jspdf')` factory below.
const captured = vi.hoisted(() => ({ docs: /** @type {Array<{ blob: Blob, pages: number }>} */ ([]) }));

// Wrap jspdf: real renderer, but each instance's per-instance `save` is replaced
// to capture the rendered blob instead of triggering a browser file download.
vi.mock('jspdf', async (importActual) => {
  const actual = /** @type {any} */ (await importActual());
  const RealJsPDF = actual.jsPDF;
  function PatchedJsPDF(...args) {
    const inst = new RealJsPDF(...args);
    inst.save = function () {
      captured.docs.push({ blob: this.output('blob'), pages: this.internal.getNumberOfPages() });
      return this;
    };
    return inst;
  }
  PatchedJsPDF.API = RealJsPDF.API;
  return { ...actual, jsPDF: PatchedJsPDF };
});

// Analytics + research-capture fire on the export-success path. They are
// consent-gated no-ops here, but mocking them keeps the test hermetic: no
// stray provider fetch, no consent/UUID dependence, no fire-and-forget async
// leaking past the test. `track` doubles as a probe that the success path ran.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: { PDF_EXPORT_COMPLETED: 'pdf_export_completed' },
}));
vi.mock('../../src/lib/researchCapture.js', () => ({
  captureFingerprint: vi.fn(),
}));

import { generateCampaignPDF } from '../../src/utils/generateCampaignPDF.js';
import { track } from '../../src/lib/analytics.js';

beforeEach(() => {
  captured.docs = [];
  vi.mocked(track).mockClear();
});

// ── Fixture builders ──────────────────────────────────────────────────────────
function makeSave(id, name, opts = {}) {
  return {
    id,
    name,
    settlement: {
      name,
      tier: opts.tier || 'town',
      population: opts.population ?? 1200,
      culture: opts.culture || 'germanic',
      npcs: opts.npcs || [
        { name: `${name} Reeve`, role: 'Reeve & toll-keeper', influence: 'high' },
        { name: `${name} Smith`, role: 'Blacksmith', influence: 'medium' },
        { name: `${name} Priest`, role: 'Keeper of the shrine', influence: 'low' },
      ],
      neighbourNetwork: opts.neighbourNetwork || [],
      interSettlementRelationships: opts.isr || [],
      history: { historicalCharacter: `${name} grew at a river crossing and never forgave the toll.` },
      plotHooks: [`A barge bound for ${name} has vanished on the night tide.`],
      settlementReason: { primary: 'river crossing' },
    },
  };
}

// Three settlements wired with neighbour links + one cross-settlement NPC pair.
function multiSettlementSaves() {
  return [
    makeSave('sett-a', 'Aldermoor', {
      tier: 'city',
      population: 9200,
      neighbourNetwork: [
        { id: 'sett-b', relationshipType: 'trade_partner' },
        { id: 'sett-c', relationshipType: 'rival' },
      ],
      isr: [{
        npcName: 'Bram Holt', npcRole: 'Reeve',
        partnerSettlement: 'Cresthollow', partnerName: 'Doral Finn', partnerRole: 'Harbormaster',
        relType: 'trade_partner',
      }],
    }),
    makeSave('sett-b', 'Cresthollow', {
      tier: 'town', population: 2400, culture: 'coastal',
      neighbourNetwork: [{ id: 'sett-a', relationshipType: 'trade_partner' }],
    }),
    makeSave('sett-c', 'Thornwatch', {
      tier: 'village', population: 640, culture: 'highland',
      neighbourNetwork: [{ id: 'sett-a', relationshipType: 'rival' }],
    }),
  ];
}

// A live worldState that lights up every Realm Chronicle subhead: sieges +
// deployments, a flipped trade prize, disposition + war-weariness standings,
// and a pantheon ledger. Ids line up with the multi-settlement saves above.
function liveWorldState() {
  return {
    deployments: { 'sett-a': { targetId: 'sett-b', sinceTick: 4, role: 'siege' } },
    dispositionStats: {
      'sett-a': { wins: 3, losses: 1, score: 2 },
      'sett-b': { wins: 0, losses: 2, score: -2 },
    },
    warExhaustion: { 'sett-b': 0.72 },
    tradeWarState: { 'sett-b:grain': { lastFlipTick: 6, winnerId: 'sett-a', incumbentId: 'sett-c' } },
    pantheon: {
      'deity:Vael': { seats: 4, wins: 3, losses: 1, tier: 'minor' },
      'deity:Korth': { seats: 2, wins: 1, losses: 2, tier: 'cult' },
    },
  };
}

function liveRegionalGraph() {
  return {
    channels: [
      { type: 'war_front', status: 'confirmed', from: 'sett-a', to: 'sett-b', strength: 0.8, visibility: 'public' },
      { type: 'trade_dependency', from: 'sett-a', to: 'sett-b', goods: [{ id: 'grain', label: 'Grain' }] },
    ],
  };
}

/** Render one campaign and return the captured { blob, pages }. */
function render(campaign, saves) {
  expect(() => generateCampaignPDF(campaign, saves)).not.toThrow();
  expect(captured.docs).toHaveLength(1);
  return captured.docs[0];
}

describe('generateCampaignPDF — campaign-level PDF assembly smoke test', () => {
  test('renders a populated, live-world campaign to a non-empty PDF blob', () => {
    const saves = multiSettlementSaves();
    const campaign = {
      name: 'The Riverlands Compact',
      description: 'Three holdings bound by trade and old grudges along the Alder.',
      settlementIds: ['sett-a', 'sett-b', 'sett-c'],
      worldState: liveWorldState(),
      regionalGraph: liveRegionalGraph(),
    };

    const { blob, pages } = render(campaign, saves);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(1000); // a real multi-page PDF, not an empty shell
    // cover + index + map + NPC contacts + digest + appendix + realm chronicle
    expect(pages).toBeGreaterThanOrEqual(6);

    // The export-success path ran to completion (save → analytics).
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith('pdf_export_completed', expect.objectContaining({ scope: 'campaign' }));
  });

  test('Realm Chronicle section actually runs — a live worldState adds pages over a dormant one', () => {
    // Identical settlements; the ONLY difference is the worldState. The live
    // campaign must paginate the extra Realm Chronicle & Geopolitics section,
    // proving the section executed rather than silently no-op'ing.
    const saves = multiSettlementSaves();
    const base = { name: 'Compared Realm', settlementIds: ['sett-a', 'sett-b', 'sett-c'] };

    generateCampaignPDF({ ...base, worldState: liveWorldState(), regionalGraph: liveRegionalGraph() }, saves);
    generateCampaignPDF({ ...base, worldState: null, regionalGraph: null }, saves);

    expect(captured.docs).toHaveLength(2);
    const [live, dormant] = captured.docs;
    expect(live.pages).toBeGreaterThan(dormant.pages);
  });

  test('dormant campaign (empty worldState, no relationships) degrades gracefully', () => {
    // No neighbour links, no cross-settlement NPC contacts, no worldState — the
    // map renders bare nodes, the NPC table renders its empty-state copy, and
    // the Realm Chronicle renders nothing at all. Still a valid PDF.
    const saves = [
      makeSave('s1', 'Lone Hollow', { tier: 'hamlet', population: 90, npcs: [] }),
      makeSave('s2', 'Still Water', { tier: 'village', population: 410 }),
    ];
    const campaign = {
      name: 'Quiet Vale',
      description: 'A peaceful set of holdings with nothing to report.',
      settlementIds: ['s1', 's2'],
      worldState: {},
      regionalGraph: null,
    };

    const { blob, pages } = render(campaign, saves);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(1000);
    expect(pages).toBeGreaterThanOrEqual(2); // at minimum cover + index
  });

  test('empty campaign (no member settlements) still emits a cover-bearing PDF', () => {
    // settlementIds resolves to zero matching saves — the generator early-returns
    // past the map/digest/appendix but must still produce the cover + index.
    const campaign = { name: 'Unsettled Frontier', settlementIds: [] };
    const { blob } = render(campaign, []);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(500);
  });

  test('tolerates sparse settlement shapes (missing optional fields) without throwing', () => {
    // Saves that omit npcs / hooks / history / culture / population — every
    // field the imperative layout reads through optional chaining.
    const saves = [
      { id: 'x1', name: 'Barebones', settlement: { tier: 'town' } },
      { id: 'x2', name: 'Half Filled', settlement: { population: 300, neighbourNetwork: [{ id: 'x1' }] } },
    ];
    const campaign = { name: 'Sparse Set', settlementIds: ['x1', 'x2'] };
    const { blob } = render(campaign, saves);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(500);
  });

  test('throws on a missing campaign (guard clause)', () => {
    expect(() => generateCampaignPDF(null, [])).toThrow(/missing campaign/);
  });
});
