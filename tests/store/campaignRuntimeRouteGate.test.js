import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { loadCampaignRuntimeView } from '../../src/store/campaignRuntimeView.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = relative => readFileSync(join(ROOT, relative), 'utf8');

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, reject, resolve };
}

describe('campaign runtime view gate', () => {
  test('does not import a view until the runtime preload succeeds', async () => {
    const gate = deferred();
    const importer = vi.fn(async () => ({ default: 'CampaignView' }));
    const preload = vi.fn(() => gate.promise);
    const pending = loadCampaignRuntimeView({ name: 'store' }, importer, preload);

    expect(importer).not.toHaveBeenCalled();
    gate.resolve();
    await expect(pending).resolves.toEqual({ default: 'CampaignView' });
    expect(importer).toHaveBeenCalledTimes(1);
  });

  test('a failed preload rejects without importing a partially armed view', async () => {
    const importer = vi.fn();
    const failure = new Error('runtime unavailable');

    await expect(loadCampaignRuntimeView(
      {},
      importer,
      () => Promise.reject(failure),
    )).rejects.toBe(failure);
    expect(importer).not.toHaveBeenCalled();
  });

  test('a signed-in view also waits for a previously failed cold hydration retry', async () => {
    const hydration = deferred();
    const importer = vi.fn(async () => ({ default: 'CampaignView' }));
    let campaignsLoaded = false;
    const loadCampaigns = vi.fn(async () => {
      await hydration.promise;
      campaignsLoaded = true;
    });
    const store = {
      getState: () => ({
        auth: { tier: 'free' },
        campaignsLoaded,
        loadCampaigns,
      }),
    };
    const pending = loadCampaignRuntimeView(store, importer, async () => {});

    await Promise.resolve();
    expect(loadCampaigns).toHaveBeenCalledTimes(1);
    expect(importer).not.toHaveBeenCalled();
    hydration.resolve([]);
    await expect(pending).resolves.toEqual({ default: 'CampaignView' });
  });

  test('does not import when hydration resolves without admitting campaign state', async () => {
    const importer = vi.fn();
    const store = {
      getState: () => ({
        auth: { tier: 'free' },
        campaignsLoaded: false,
        campaignLoadError: {
          code: 'campaign_admission_failed',
          message: 'Saved campaign data was rejected.',
        },
        loadCampaigns: vi.fn(async () => []),
      }),
    };

    await expect(loadCampaignRuntimeView(store, importer, async () => {}))
      .rejects.toMatchObject({
        name: 'CampaignRuntimeViewLoadError',
        code: 'campaign_admission_failed',
        message: 'Saved campaign data was rejected.',
      });
    expect(importer).not.toHaveBeenCalled();
  });

  test('the real Zustand API and entry delegates share one per-store bridge key', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      removeItem: () => {},
      setItem: () => {},
    });
    const [
      { useStore },
      { preloadCampaignRuntimeForStore },
    ] = await Promise.all([
      import('../../src/store/index.js'),
      import('../../src/store/campaignRuntimeBridge.js'),
    ]);
    const delegate = useStore.getState().getCampaignForSettlement;

    await preloadCampaignRuntimeForStore(useStore);

    expect(useStore.getState().getCampaignForSettlement).toBe(delegate);
    const result = delegate('missing');
    expect(result).toBeNull();
    expect(result).not.toBeInstanceOf(Promise);
  });

  test('every campaign-capable route and Surveyor stage uses the gate', () => {
    const appViews = read('src/AppViews.jsx');
    expect(appViews).toContain('const lazy = importer => createRetryableLazy(importer');
    for (const module of [
      'GenerateWizard.jsx',
      'SettlementsPanel',
      'WorldMap.jsx',
      'AccountPage.jsx',
      'AdminPanel.jsx',
      'GalleryPage.jsx',
      'screen/DmScreen.jsx',
    ]) {
      expect(appViews).toContain(`campaignLazy(() => import('./components/${module}'))`);
    }

    for (const module of [
      'HomeLanding.jsx',
      'PricingPage.jsx',
      'about/AboutWhatThisIs.jsx',
      'legal/TermsPage.jsx',
      'auth/SignInPage.jsx',
    ]) {
      expect(appViews).toContain(`lazy(() => import('./components/${module}'))`);
      expect(appViews).not.toContain(`campaignLazy(() => import('./components/${module}'))`);
    }

    const workshop = read('src/components/surveyor/SurveyorWorkshop.jsx');
    expect(workshop).toContain("campaignLazy(() => import('./InterpretApplyPanel.jsx'))");
    expect(workshop).toContain("campaignLazy(() => import('./AutonomyPanel.jsx'))");
  });
});
