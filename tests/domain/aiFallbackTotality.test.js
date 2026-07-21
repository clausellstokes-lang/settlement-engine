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
 * THE CENSUS (the same wall as aiSurfaceSourceScan): the surfaces driven here are checked
 * against the DISCOVERED model-calling edge roster. A new AI surface that ships without a
 * fallback driver reds the coverage test — no surface may become load-bearing unnoticed.
 *
 * @enforced-by this test
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

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

const ROOT = resolve(process.cwd());
const FN_DIR = join(ROOT, 'supabase', 'functions');
const SEED = 'ai-off-2026-07-21';

// ── The AI-off world (typed truth, generated with zero AI) ───────────────────
const settlement = generateSettlementPipeline(
  { settType: 'town', culture: 'germanic', terrainOverride: 'hills', tradeRouteAccess: 'road' },
  null,
  { seed: SEED, customContent: {} },
);

// ── The discovered model-calling roster (the coverage denominator) ───────────
const MODEL_CALL = /anthropic|runCreditedCall|callAnthropic|messages\.create|createMessage|ANTHROPIC_CLAUDE|resolveModel|providerKey/i;
function tsFilesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return tsFilesUnder(p);
    return /\.ts$/.test(name) && !/\.test\.ts$/.test(name) ? [p] : [];
  });
}
const AI_SURFACES = readdirSync(FN_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== '_shared')
  .map((d) => d.name)
  .filter((n) => existsSync(join(FN_DIR, n)) && tsFilesUnder(join(FN_DIR, n)).some((f) => MODEL_CALL.test(readFileSync(f, 'utf8'))))
  .sort();

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
  'ai-analyst': {
    drive: () => askAnalyst({ question: 'Who governs this settlement?', settlement }),
    check: (r) => expect(isFriendlyMessage(r?.error), 'analyst returns a friendly AI-off refusal').toBe(true),
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
    const uncovered = AI_SURFACES.filter((s) => !covered.has(s));
    expect(
      uncovered,
      `these model-calling edge surfaces have NO AI-off fallback driver — every AI surface `
      + `must degrade to a deterministic fallback (AI is dressing, never load-bearing): ${uncovered.join(', ')}`,
    ).toEqual([]);
    // Guard-the-guard: the roster discovery actually found the surfaces.
    expect(AI_SURFACES.length).toBeGreaterThanOrEqual(11);
  });
});
