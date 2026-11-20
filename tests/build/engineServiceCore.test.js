/**
 * engineServiceCore.test.js — the engine service runs THE ONE CORE (ENGINE-2 unit 1).
 *
 * `engine-generate` answers through `runGenerationRequest` from the committed engine
 * bundle (`src/engine/serviceEntry.js` → `supabase/functions/_shared/engineBundle.js`),
 * so its reply carries the worker's `pipelineHistory`. This pins the Node link of that
 * chain: for the service's request (no neighbour, no custom content), the bundle's core
 * and the in-process core answer the same settlement and the same step list, byte for
 * byte. The Deno link (the function's reply carries the list) is
 * supabase/functions/engine-generate/index.test.ts.
 */
import { describe, it, expect } from 'vitest';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { runGenerationRequest } from '../../src/workers/generationRequest.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const configFor = (settType) => JSON.parse(JSON.stringify(birthConfig({
  ...DEFAULT_CONFIG, settType, _institutionToggles: {}, _categoryToggles: {}, _goodsToggles: {}, _servicesToggles: {},
})));
describe('the service runs the same core as the worker', () => {
  it('the bundle\'s runGenerationRequest equals the in-process core for the service\'s request', async () => {
    const bundle = await import(/* @vite-ignore */ pathToFileURL(
      resolve(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'engineBundle.js')).href);
    await bundle.loadGenerationLawPayloads();
    // The in-process side's law payloads, loaded once before the loop (they were loaded
    // inside it, after the first served call; the bundle carries its own module copy, so
    // the order never reached it). Hoisting the one await lets the loop run synchronously
    // under collectSeedFailures: every seed runs and the roster is asserted once.
    await loadGenerationLawPayloads();
    const failures = collectSeedFailures([['remote-a', 'town'], ['remote-b', 'village'], ['remote-c', 'city']], ([seed, settType]) => {
      const config = configFor(settType);
      const serviceRequest = (birth) => ({
        op: 'settlement',
        requestId: null,
        payload: {
          fullConfig: birth(config),
          neighbour: null,
          seed,
          // engine-generate's birth: the store's standalone vanilla stamp (remote-path R2).
          contentRuntime: {
            customContent: {},
            contentProvenance: { scope: 'standalone', environment: bundle.VANILLA_CONTENT_ENVIRONMENT, bindingHash: null },
          },
        },
      });
      const served = bundle.runGenerationRequest(serviceRequest(bundle.birthConfig));
      const local = runGenerationRequest(serviceRequest(birthConfig));
      expect(JSON.stringify(served.settlement), seed).toBe(JSON.stringify(local.settlement));
      expect(JSON.stringify(served.pipelineHistory), seed).toBe(JSON.stringify(local.pipelineHistory));
    });
    expectNoSeedFailures(failures, 'the bundle\'s core answers the in-process core\'s settlement and step list');
  });
});
