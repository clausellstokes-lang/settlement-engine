/**
 * engineRemoteSurveyorPreview.test.js — the surveyor's construction preview in a build that
 * carries no engine (ENGINE-4 unit 1, the flag-on gaps).
 *
 * The settlement scope's preview is `generateSettlementPipeline(config, null, { seed })` — no
 * custom content, no mint — so engine-generate's `derive` op reproduces it: ROUTED, proved over
 * a JSON wire for three seeds against that exact local call. The realm scope runs the
 * synchronous instant-world composer, which the service does not serve: the panel says one
 * plain sentence instead of running a refusal into "Generation failed".
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { runRemoteDerive } from '../../src/lib/engineRemote.js';

const URL_ = 'https://stub.functions/engine-generate';
const PANEL = readFileSync(resolve(__dirname, '..', '..', 'src', 'components', 'surveyor', 'ConstructionPanel.jsx'), 'utf8');

function deriveFetch() {
  const bodies = [];
  const impl = async (_url, init) => {
    const body = JSON.parse(init.body);
    bodies.push(body);
    const settlement = generateSettlementPipeline(body.config, null,
      body.pins === undefined ? { seed: body.seed } : { seed: body.seed, pins: body.pins });
    const reply = JSON.parse(JSON.stringify({ settlement, engineVersion: 'feedfacecafebeef', generatedAt: '2026-11-04T00:00:00.000Z' }));
    return { ok: true, status: 200, json: async () => reply };
  };
  return { impl, bodies };
}

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('the settlement preview through the engine service', () => {
  it('for three seeds (town, village, city), the derive reply over the wire equals the panel\'s local call', async () => {
    const failures = [];
    // seed-loop: collected — every seed runs: a failing seed is caught and listed, and the roster is asserted once below
    for (const [settType, seed] of [['town', 'engine4-survey-0'], ['village', 'engine4-survey-1'], ['city', 'engine4-survey-2']]) {
      try {
        // The surveyor's config is a compiled draft, not a birthed one; birthConfig here only
        // gives the run a realistic config, and both sides receive the same object.
        const config = birthConfig({ settType });
        const local = generateSettlementPipeline(structuredClone(config), null, { seed });
        const { impl, bodies } = deriveFetch();
        const remote = await runRemoteDerive({ seed, config }, { fetchImpl: impl, url: URL_, getAccessToken: async () => null });
        expect(JSON.stringify(remote), `${settType} ${seed}`).toBe(JSON.stringify(local));
        expect(bodies[0].op).toBe('derive');
        expect('pins' in bodies[0], 'no bag is sent for a preview').toBe(false);
        expect(remote.engineVersion, 'unstamped, as the local pipeline returns it').toBeUndefined();
      } catch (error) {
        failures.push(`${settType} ${seed}: ${String(error?.message ?? error).split('\n')[0]}`);
      }
    }
    expect(failures, `${failures.length} of the seeds failed; every seed ran`).toEqual([]);
  }, 240_000);
});

describe('the panel takes the service with the flag on, and says the realm preview plainly', () => {
  it('the settlement branch calls runRemoteDerive({ seed, config }) under the flag, the local door otherwise', () => {
    const at = PANEL.indexOf('if (engineServiceBuild()) {\n          const { runRemoteDerive }');
    expect(at, 'the flagged settlement branch').toBeGreaterThan(-1);
    expect(PANEL.indexOf('dossier = await runRemoteDerive({ seed, config });', at)).toBeGreaterThan(at);
    expect(PANEL.indexOf('loadLocalPipeline()', at)).toBeGreaterThan(at);
  });

  it('the realm branch answers the plain sentence before the composer is reached', () => {
    const realm = PANEL.indexOf("if (scope === 'realm' && engineServiceBuild()) {");
    expect(realm).toBeGreaterThan(-1);
    expect(PANEL.indexOf('setGenerated({ error: REALM_PREVIEW_ABSENT });', realm)).toBeGreaterThan(realm);
    expect(PANEL.indexOf('composeInstantWorld({ seed, basicConfig: config })', realm))
      .toBeGreaterThan(PANEL.indexOf('setGenerated({ error: REALM_PREVIEW_ABSENT });', realm));
    expect(PANEL).toMatch(/const REALM_PREVIEW_ABSENT = 'Realm previews are not available in this build\. Settlement previews still are\.';/);
  });
});
