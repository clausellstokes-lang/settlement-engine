/**
 * aiFallbackTotality.test.js — NO LOAD-BEARING AI (Enforcer E-D part 2; A+ bar 19).
 *
 * The finite-semantics law's other face: AI is DRESSING on typed truth, never the truth
 * itself. This enforcer proves the product is FULLY FUNCTIONAL with AI disabled — the
 * typed engine generates a complete world, and every AI surface degrades to a coherent
 * deterministic fallback (a full local narrative, or a friendly refusal), never a crash,
 * an empty render, or a raw error leaking to the user.
 *
 * The whole file runs in genuine AI-OFF mode: in the test environment Supabase is not
 * configured, so `isConfigured` is false and every client transport takes its no-AI path
 * — which is exactly what the deployed product does for a signed-out or offline user.
 *
 * THE CENSUS (literally the same census as aiSurfaceSourceScan — one module, imported by
 * both halves of E-D): the surfaces driven here are checked against the DISCOVERED ROSTER,
 * the UNION of every model-calling edge surface and every client-invoked AI transport. A
 * new AI surface that ships without a fallback driver reds the coverage test — no surface
 * may become load-bearing unnoticed.
 *
 * WHY A UNION, NOT AN EDGE WALK: this file used to build its denominator by walking
 * supabase/functions/* for MODEL_CALL — a copy of part 1's discovery, made before part 1
 * grew its client pass. That copy was blind to 'table-clerk', a live AI transport
 * (src/lib/tableClerk.js) whose edge half has never existed in this tree: it had no driver
 * here, AND the census could never demand one. A surface must be visible to this wall
 * whichever side of the wire it lives on, so the denominator is the union.
 *
 * @enforced-by this test
 */
import { describe, it, expect } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { runTemplateNarrative } from '../../src/generators/aiLayer.js';
import { generateNarrative } from '../../src/lib/ai.js';
import { isConfigured } from '../../src/lib/supabase.js';
import { askAnalyst } from '../../src/lib/aiAnalyst.js';
import { askInterview } from '../../src/lib/interview.js';
import { dressRoadScene } from '../../src/lib/roadSceneAi.js';
import { requestCampaignChronicle } from '../../src/lib/campaignChronicle.js';
import {
  compileCustomContent, compileStyleOverhaul, compileConstruction,
  compileInterpretation, composeAutonomy,
} from '../../src/lib/surveyorWrite.js';
import { getByokStatus } from '../../src/lib/surveyorByok.js';
import { compileTableClerk } from '../../src/lib/tableClerk.js';
import { TABLE_EVENT_KINDS, MAGNITUDE_BAND_IDS, OBLIGATION_TYPES } from '../../src/domain/tableLedger.js';
import {
  AI_SURFACES, AI_CLIENT_TRANSPORTS, AI_SURFACE_ROSTER, CLIENT_TRANSPORTS, CENSUS_FLOORS,
} from '../security/aiSurfaceCensus.js';

const SEED = 'ai-off-2026-07-21';

// ── The AI-off world (typed truth, generated with zero AI) ───────────────────
const settlement = generateSettlementPipeline(
  { settType: 'town', culture: 'germanic', terrainOverride: 'hills', tradeRouteAccess: 'road' },
  null,
  { seed: SEED, customContent: {} },
);

// The coverage denominator is AI_SURFACE_ROSTER, imported above — see the header. It is
// built once, in tests/security/aiSurfaceCensus.js, and shared with E-D part 1.

// ── A coherent-fallback predicate: no crash, no empty, no raw error ──────────
function hasNoRawLeak(value, seen = new Set()) {
  if (value == null) return true;
  if (typeof value === 'string') return !/\[object Object\]|\bundefined\b/.test(value);
  if (typeof value !== 'object') return true;
  if (seen.has(value)) return true;
  seen.add(value);
  return Object.values(value).every((v) => hasNoRawLeak(v, seen));
}
/** A friendly, human-readable refusal string (never blank, never a raw dump). */
function isFriendlyMessage(s) {
  return typeof s === 'string' && s.trim().length > 0 && !/\[object Object\]|^undefined$|^\[/.test(s.trim());
}

// ── Per-surface AI-off drivers + coherence checks ────────────────────────────
// Keyed by the discovered edge-surface name so coverage is provable against the roster.
const SURFACE_FALLBACK = {
  // The narrative surface has a DETERMINISTIC content fallback (a full local narrative)
  // AND a coherent transport fallback (the mock the client runs when Supabase is absent).
  'generate-narrative': {
    async drive() {
      const mock = await generateNarrative('narrative', settlement, settlement?.id);
      return { mock };
    },
    check({ mock }) {
      expect(mock, 'the narrative transport resolves AI-off (no throw)').toBeTruthy();
      expect(mock.result && typeof mock.result === 'object', 'a coherent result object AI-off').toBe(true);
    },
  },
  // Read-only answer surfaces: a friendly refusal, never a crash or a blank.
  // TWO client modules post this one slug, and each has its own AI-off branch: the analyst
  // lane (aiAnalyst.js) and the road-scene dressing (roadSceneAi.js). The roster is keyed by
  // SURFACE, so the census can only ever demand ONE driver here — drive both transports so
  // the second module's refusal is proven rather than assumed.
  'ai-analyst': {
    async drive() {
      const analyst = await askAnalyst({ question: 'Who governs this settlement?', settlement });
      const roadScene = await dressRoadScene({
        brief: { sections: [{ id: 'roads', source: 'ROADS_TRUTH', title: 'The road', items: ['a ford'] }] },
      });
      return { analyst, roadScene };
    },
    check: ({ analyst, roadScene }) => {
      expect(isFriendlyMessage(analyst?.error), 'analyst returns a friendly AI-off refusal').toBe(true);
      expect(isFriendlyMessage(roadScene?.error), 'road-scene dressing returns a friendly AI-off refusal').toBe(true);
      // Additive-only: the un-dressed bundle stands alone, so the refusal carries no prose.
      expect(roadScene?.answer, 'no AI prose is fabricated for the road scene AI-off').toBeUndefined();
    },
  },
  'interview': {
    drive: () => askInterview({ question: 'Who governs this settlement?', settlement }),
    check: (r) => expect(isFriendlyMessage(r?.error), 'interview returns a friendly AI-off refusal').toBe(true),
  },
  'generate-chronicle': {
    drive: () => requestCampaignChronicle({ campaign: { worldState: { tick: 3 }, wizardNews: [] } }),
    check: (r) => {
      expect(isFriendlyMessage(r?.error), 'chronicle returns a friendly AI-off message').toBe(true);
      // The DETERMINISTIC grounding still computes AI-off — the chronicle is derived, not invented.
      expect(r?.grounding !== undefined, 'the deterministic chronicle grounding still computes AI-off').toBe(true);
    },
  },
  // Surveyor WRITE stages: a friendly { ok:false } refusal — the authoring tools are
  // additive; the world stands without them.
  'custom-content': {
    drive: () => compileCustomContent({ intent: 'a smoky harbor tavern', settlement, savedSettlements: [settlement] }),
    check: (r) => expectWriteRefusal(r),
  },
  'style-overhaul': {
    drive: () => compileStyleOverhaul({ prompt: 'a moody ink-wash map', settlement, savedSettlements: [settlement] }),
    check: (r) => expectWriteRefusal(r),
  },
  'construct-settlement': {
    drive: () => compileConstruction({ intent: 'a fortified river town', scope: 'settlement', settlement, savedSettlements: [settlement] }),
    check: (r) => expectWriteRefusal(r),
  },
  'construct-realm': {
    drive: () => compileConstruction({ intent: 'a coastal trade realm', scope: 'realm', settlement, savedSettlements: [settlement] }),
    check: (r) => expectWriteRefusal(r),
  },
  'interpret-session': {
    drive: () => compileInterpretation({ sessionText: 'The party burned the granary and the reeve fled town.', settlement, savedSettlements: [settlement] }),
    check: (r) => expectWriteRefusal(r),
  },
  'surveyor-autonomy': {
    drive: () => composeAutonomy({ intent: 'run ten weeks, stop if population falls', settlement, savedSettlements: [settlement] }),
    check: (r) => expectWriteRefusal(r),
  },
  // The Session Ledger's bucketing clerk — a CLIENT-ONLY AI transport: no
  // supabase/functions/table-clerk exists in this tree (the server half is an owner-gated
  // fold), so an edge-directory walk is blind to it and only the client census sees it.
  // The DM's ledger must not depend on the clerk: AI-off it refuses in the TIER register
  // and hands the DM back the manual bucket picker, which needs no AI at all.
  'table-clerk': {
    drive: () => compileTableClerk({
      text: 'The party burned the granary and the reeve fled town.',
      targets: { stressors: [], npcs: [] },
    }),
    check: (r) => {
      expectWriteRefusal(r);
      // The refusal must be the AI-OFF one. `refusalKind` is what separates it from the
      // empty-input refusal ('input'), which satisfies expectWriteRefusal without ever
      // reaching the isConfigured branch — a green check proving nothing.
      expect(r.refusalKind, 'the clerk refuses in the TIER register AI-off, not the input register').toBe('tier');
      // Nothing is proposed, accepted or rejected AI-off — the transport never fabricates
      // buckets to fill the silence.
      expect(r.accepted, 'no buckets are accepted AI-off').toBeUndefined();
      expect(r.rejected, 'no buckets are produced AI-off').toBeUndefined();
      // "record it by hand below" has to be a real offer: the closed vocabulary the MANUAL
      // picker runs on is fully present with zero AI, so the refusal points somewhere.
      expect(TABLE_EVENT_KINDS.length, 'the manual event-kind vocabulary stands AI-off').toBeGreaterThan(0);
      expect(MAGNITUDE_BAND_IDS.length, 'the manual magnitude bands stand AI-off').toBeGreaterThan(0);
      expect(OBLIGATION_TYPES.length, 'the manual obligation types stand AI-off').toBeGreaterThan(0);
    },
  },
  // A key/health management transport: a coherent empty status AI-off.
  'surveyor-byok': {
    drive: () => getByokStatus(),
    check: (r) => expect(Array.isArray(r), 'byok status is a coherent array AI-off').toBe(true),
  },
  // No client apply surface exists AI-off (or on): the feature is simply absent, which is
  // itself the safe fallback. Kept in the map so a future client wiring cannot escape the
  // coverage census below without adding a real driver.
  'parley': {
    drive: async () => ({ absent: true }),
    check: (r) => expect(r.absent, 'parley has no client surface — absence is the fallback').toBe(true),
  },
};

function expectWriteRefusal(r) {
  expect(r && typeof r === 'object', 'a write surface resolves to an object AI-off').toBe(true);
  expect(r.ok, 'a write surface refuses (ok:false) AI-off').toBe(false);
  expect(isFriendlyMessage(r.error), 'a write surface returns a friendly AI-off refusal').toBe(true);
}

describe('no load-bearing AI — the typed world is complete with zero AI', () => {
  it('the test runs in genuine AI-off mode (Supabase not configured)', () => {
    expect(isConfigured, 'this suite proves the AI-OFF product path').toBe(false);
  });

  it('the deterministic generator produces a complete, typed settlement (no AI involved)', () => {
    expect(typeof settlement.name).toBe('string');
    expect(settlement.name.length).toBeGreaterThan(0);
    expect(typeof settlement.population).toBe('number');
    expect(settlement.population).toBeGreaterThan(0);
    expect(Array.isArray(settlement.institutions) && settlement.institutions.length).toBeTruthy();
    expect(Array.isArray(settlement.npcs)).toBe(true);
    expect(Array.isArray(settlement.powerStructure?.factions)).toBe(true);
  });

  it('the local narrative engine dresses that world fully, AI-off (thesis + daily life + every tab note)', async () => {
    const narrative = await runTemplateNarrative(settlement);
    expect(isFriendlyMessage(narrative.thesis), 'a real thesis').toBe(true);
    expect(isFriendlyMessage(narrative.dailyLife), 'real daily-life prose').toBe(true);
    const TAB_KEYS = ['overview', 'economics', 'services', 'power', 'defense', 'npcs', 'history', 'resources', 'viability', 'plot_hooks'];
    for (const k of TAB_KEYS) {
      expect(isFriendlyMessage(narrative.tabNotes?.[k]), `a coherent '${k}' tab note AI-off`).toBe(true);
    }
    expect(narrative.dmCompass && typeof narrative.dmCompass === 'object', 'a DM compass AI-off').toBe(true);
    expect(hasNoRawLeak(narrative), 'no raw [object Object]/undefined leaks into the local narrative').toBe(true);
  });
});

describe('no load-bearing AI — every AI surface has a coherent AI-off fallback', () => {
  it.each(Object.entries(SURFACE_FALLBACK))(
    '%s degrades to a coherent deterministic fallback (no crash, no empty, no raw error)',
    async (surface, { drive, check }) => {
      const result = await drive(); // a throw here fails the test — an AI-off crash is a real defect
      expect(result !== undefined, `${surface}: the AI-off path returns a defined result`).toBe(true);
      expect(hasNoRawLeak(result), `${surface}: no raw [object Object]/undefined leaks to the user`).toBe(true);
      check(result);
    },
  );

  it('the fallback drivers cover the full discovered AI-surface roster (a new surface reds)', () => {
    const covered = new Set(Object.keys(SURFACE_FALLBACK));
    const uncovered = AI_SURFACE_ROSTER.filter((s) => !covered.has(s));
    expect(
      uncovered,
      `THE RULE: no load-bearing AI — every AI surface, edge-side or client-side, must `
      + `degrade to a coherent deterministic fallback with AI off (AI is dressing, never the `
      + `truth). These rostered surfaces have NO AI-off fallback driver: ${uncovered.join(', ')}.\n`
      + `THE FIX: add a SURFACE_FALLBACK entry that DRIVES the surface's real client path `
      + `with Supabase unconfigured and asserts what the user actually gets — a full local `
      + `result, or a friendly typed refusal (expectWriteRefusal). If the slug carries no `
      + `model output at all, it belongs in NON_AI_CLIENT_TRANSPORTS in `
      + `tests/security/aiSurfaceCensus.js with the reason written down, not here.\n`
      + `THE LEGAL SHRINK: the roster shrinks only by RETIRING the surface — delete the edge `
      + `function and/or the client transport. Deleting the driver while the surface still `
      + `ships is the one move this test exists to forbid.`,
    ).toEqual([]);
  });

  it('no fallback driver outlives its surface (the roster is an EXACT set, not a floor)', () => {
    // The reverse direction. A driver for a surface discovered on NEITHER side is fiction,
    // and fiction in a census reads as coverage — it makes the wall look wider than it is.
    const orphaned = Object.keys(SURFACE_FALLBACK).filter((s) => !AI_SURFACE_ROSTER.includes(s)).sort();
    expect(
      orphaned,
      `SURFACE_FALLBACK drives surfaces that exist on NEITHER side of the census — no `
      + `model-calling edge directory AND no client invocation: ${orphaned.join(', ')}. `
      + `If the surface was retired, delete its driver here (and its AI_SURFACE_WALLS entry `
      + `in the E-D part 1 scan). If it still ships, the census lost it — fix the discovery `
      + `in tests/security/aiSurfaceCensus.js rather than the manifest.`,
    ).toEqual([]);
  });

  it('the roster discovery is non-vacuous and genuinely two-sided (guard-the-guard)', () => {
    // If discovery collapses, both checks above pass on an empty denominator.
    expect(AI_SURFACES.length, 'the edge-side census found the model-calling functions').toBeGreaterThanOrEqual(CENSUS_FLOORS.edgeSurfaces);
    expect(CLIENT_TRANSPORTS.size, 'the client-side census found the invoked slugs').toBeGreaterThanOrEqual(CENSUS_FLOORS.clientTransports);
    expect(AI_SURFACE_ROSTER.length, 'the union roster is intact').toBeGreaterThanOrEqual(CENSUS_FLOORS.roster);

    // The denominator is a real UNION: neither side may be quietly dropped from it.
    const missingEdge = AI_SURFACES.filter((s) => !AI_SURFACE_ROSTER.includes(s));
    expect(missingEdge, 'the roster lost model-calling edge surfaces').toEqual([]);
    const missingClient = AI_CLIENT_TRANSPORTS.filter((s) => !AI_SURFACE_ROSTER.includes(s));
    expect(missingClient, 'the roster lost client-side AI transports').toEqual([]);

    // The pinned hard case: 'table-clerk' is rostered whichever side finds it. Today only
    // the client side can — it has no supabase/functions/table-clerk directory — which is
    // exactly the blind spot an edge-only denominator had, and the reason for the union.
    expect(
      AI_SURFACE_ROSTER.includes('table-clerk'),
      "the roster lost 'table-clerk' — a live AI transport (src/lib/tableClerk.js) whose "
      + 'edge half is not in this tree. If the client census stopped seeing it, this wall '
      + 'has gone back to being blind to out-of-band surfaces.',
    ).toBe(true);
  });
});
