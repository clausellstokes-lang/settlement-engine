/**
 * engineRemoteStorePreflight.test.js — THE PRE-FLIGHT READ FROM THE REAL STORE (D1 of the
 * remote-path walk, 2026-11-10).
 *
 * The transport's own suite (`engineRemoteTransport.test.js`) builds its content runtime from a
 * hand-built state with no `getActiveCustomContentRuntime`, so its provenance never named an
 * environment. The real store ALWAYS names one: `customContentSlice.js ::
 * getActiveCustomContentRuntime` answers `VANILLA_CONTENT_ENVIRONMENT` when the account has
 * none, and `settlementContentRuntimeOptions` stamps every standalone generation with it. The
 * pre-flight refused that stamp, so every flagged generation failed before any request.
 *
 * Pins:
 *   1. the store in its DEFAULT state yields a content runtime the pre-flight names nothing in;
 *   2. the mirror: a non-vanilla environment (or a vanilla one carrying a binding hash, or a
 *      look-alike that is not the vanilla identity) is still refused as `contentEnvironment`;
 *   3. homebrew, tunables and a neighbour stay refused beside the vanilla stamp.
 */
import { describe, it, expect } from 'vitest';
import { useStore } from '../../src/store/index.js';
import { loadSettlementContentRuntimeOptions } from '../../src/store/settlementContentRuntime.js';
import { remoteUnsupportedInputs } from '../../src/lib/engineRemote.js';
import { VANILLA_CONTENT_ENVIRONMENT } from '../../src/domain/content/contentEnvironmentDefaults.js';

const HASH = 'a'.repeat(64);

async function storeRuntime() {
  return loadSettlementContentRuntimeOptions(useStore.getState());
}

describe('the remote pre-flight reads the real store\'s content runtime', () => {
  it('the store in its default state stamps the vanilla environment, and the pre-flight names nothing', async () => {
    const contentRuntime = await storeRuntime();
    // The precondition the defect lived in: the default state is NOT environment-free.
    expect(contentRuntime.contentProvenance?.environment?.environmentRevisionId)
      .toBe(VANILLA_CONTENT_ENVIRONMENT.environmentRevisionId);
    expect(remoteUnsupportedInputs({ neighbour: null, contentRuntime })).toEqual([]);
  });

  it('a non-vanilla environment is still refused', async () => {
    const base = await storeRuntime();
    const reviewed = {
      ...base,
      contentProvenance: {
        ...base.contentProvenance,
        environment: {
          ...VANILLA_CONTENT_ENVIRONMENT,
          environmentId: 'env:mine',
          environmentRevisionId: 'env:mine:r3',
          source: 'account',
          environmentHash: HASH,
        },
      },
    };
    expect(remoteUnsupportedInputs({ neighbour: null, contentRuntime: reviewed })).toEqual(['contentEnvironment']);
  });

  it('a vanilla look-alike (same revision id, another hash or source) is refused', async () => {
    const base = await storeRuntime();
    for (const tamper of [{ environmentHash: HASH }, { source: 'account' }, { environmentId: 'env:other' }]) {
      const contentRuntime = {
        ...base,
        contentProvenance: { ...base.contentProvenance, environment: { ...VANILLA_CONTENT_ENVIRONMENT, ...tamper } },
      };
      expect(remoteUnsupportedInputs({ neighbour: null, contentRuntime }), JSON.stringify(tamper))
        .toEqual(['contentEnvironment']);
    }
  });

  it('the vanilla environment under a binding hash (a campaign) is refused', async () => {
    const base = await storeRuntime();
    const contentRuntime = {
      ...base,
      contentProvenance: { ...base.contentProvenance, scope: 'campaign', bindingHash: HASH },
    };
    expect(remoteUnsupportedInputs({ neighbour: null, contentRuntime })).toEqual(['contentEnvironment']);
  });

  it('a binding hash with no environment is refused', async () => {
    const base = await storeRuntime();
    const contentRuntime = {
      ...base,
      contentProvenance: { scope: 'campaign', environment: null, bindingHash: HASH },
    };
    expect(remoteUnsupportedInputs({ neighbour: null, contentRuntime })).toEqual(['contentEnvironment']);
  });

  it('homebrew, tunables and a neighbour beside the vanilla stamp are refused by name', async () => {
    const base = await storeRuntime();
    const contentRuntime = {
      ...base,
      customContent: { institutions: [{ id: 'x' }] },
      contentTunables: { someTunable: 2 },
    };
    expect(remoteUnsupportedInputs({ neighbour: { _seed: 'n' }, contentRuntime }))
      .toEqual(['neighbour', 'customContent', 'contentTunables']);
  });

  it('FU-3: the refusal carries the provenance scope, so the reader can be told "inside a campaign"', async () => {
    const { runRemoteGeneration } = await import('../../src/lib/engineRemote.js');
    const base = await storeRuntime();
    const contentRuntime = { ...base, contentProvenance: { ...base.contentProvenance, scope: 'campaign', bindingHash: HASH } };
    const err = await runRemoteGeneration({ payload: { seed: 's', fullConfig: {}, neighbour: null, contentRuntime } },
      { url: 'https://never', fetchImpl: async () => { throw new Error('no fetch may happen'); } }).catch((e) => e);
    expect(err.code).toBe('engine_remote_unsupported');
    expect(err.inputs).toEqual(['contentEnvironment']);
    expect(err.scope).toBe('campaign');
  });
});
