import { test, expect } from '@playwright/test';

function settlementSave(id, name) {
  return {
    id,
    name,
    tier: 'town',
    timestamp: '2026-01-01T00:00:00.000Z',
    settlement: {
      id,
      name,
      tier: 'town',
      population: 1500,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      powerStructure: { factions: [], conflicts: [] },
      npcs: [],
      economicState: {
        primaryExports: id === 'supplier' ? ['Bulk grain and foodstuffs'] : [],
        primaryImports: id === 'buyer' ? ['Grain and malt'] : [],
        activeChains: [],
      },
      activeConditions: [],
      neighbourNetwork: [],
    },
    campaignState: {
      phase: 'canon',
      eventLog: [],
      systemState: null,
      locks: {},
      generatedAt: '2026-01-01T00:00:00.000Z',
      editedAt: '2026-01-01T00:00:00.000Z',
      canonizedAt: '2026-01-01T00:00:00.000Z',
      lastExportAt: null,
      narrativeDrift: null,
      exportState: null,
    },
  };
}

function seededCampaign() {
  return {
    id: 'camp-regional',
    name: 'Trade Belt',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    settlementIds: ['supplier', 'buyer'],
    collapsed: false,
    mapState: null,
    wizardNews: {
      schemaVersion: 1,
      currentTick: 2,
      entries: [{
        schemaVersion: 1,
        id: 'wizard_news.2.queued.regional_impact.e2e',
        createdAt: '2026-01-02T00:00:00.000Z',
        tick: 2,
        scope: 'regional',
        significance: 'major',
        score: 121,
        headline: 'Millcross faces import shortage',
        summary: 'Queued via trade dependency around Grain: Granary Ford can no longer reliably supply grain.',
        kind: 'queued',
        impactKind: 'import_shortage',
        channelType: 'trade_dependency',
        severity: 0.75,
        settlementIds: ['supplier', 'buyer'],
        impactIds: ['regional_impact.e2e'],
        channelIds: ['channel.trade_dependency.supplier.buyer.grain'],
        sourceEventId: 'evt_e2e',
        tags: ['queued', 'import_shortage', 'trade_dependency', 'grain'],
        reasons: ['high severity', 'critical impact type', 'critical goods involved'],
      }, {
        schemaVersion: 1,
        id: 'wizard_news.2.ready.regional_impact.delayed',
        createdAt: '2026-01-02T01:00:00.000Z',
        tick: 2,
        scope: 'regional',
        significance: 'notable',
        score: 56,
        headline: 'Route disruption reaches Millcross',
        summary: 'Ready via trade dependency around Grain: Regional trade access is expected to tighten soon.',
        kind: 'ready',
        impactKind: 'route_disruption',
        channelType: 'trade_dependency',
        severity: 0.35,
        settlementIds: ['supplier', 'buyer'],
        impactIds: ['regional_impact.delayed'],
        channelIds: ['channel.trade_dependency.supplier.buyer.grain'],
        sourceEventId: 'evt_e2e',
        tags: ['ready', 'route_disruption', 'trade_dependency', 'grain'],
        reasons: ['critical impact type', 'delayed effect matured'],
      }],
      updatedAt: '2026-01-02T01:00:00.000Z',
    },
    regionalGraph: {
      schemaVersion: 2,
      nodes: [
        { id: 'supplier', name: 'Granary Ford', settlementId: 'supplier' },
        { id: 'buyer', name: 'Millcross', settlementId: 'buyer' },
      ],
      edges: [],
      channels: [{
        id: 'channel.trade_dependency.supplier.buyer.grain',
        type: 'trade_dependency',
        from: 'supplier',
        to: 'buyer',
        status: 'confirmed',
        visibility: 'public',
        strength: 0.9,
        confidence: 0.9,
        goods: [{ id: 'grain', label: 'Grain', category: 'food', criticality: 0.9 }],
      }],
      queuedImpacts: [{
        id: 'regional_impact.e2e',
        kind: 'import_shortage',
        sourceSettlementId: 'supplier',
        sourceSettlementName: 'Granary Ford',
        targetSettlementId: 'buyer',
        channelId: 'channel.trade_dependency.supplier.buyer.grain',
        channelType: 'trade_dependency',
        goods: [{ id: 'grain', label: 'Grain', category: 'food', criticality: 0.9 }],
        severity: 0.75,
        confidence: 0.9,
        status: 'queued',
        delayTicks: 0,
        ageTicks: 0,
        maxAgeTicks: 12,
        waveDepth: 0,
        sourceChange: { kind: 'export_lost' },
        explanation: 'Granary Ford can no longer reliably supply grain.',
        createdAt: '2026-01-01T00:00:00.000Z',
      }, {
        id: 'regional_impact.delayed',
        kind: 'route_disruption',
        sourceSettlementId: 'supplier',
        sourceSettlementName: 'Granary Ford',
        targetSettlementId: 'buyer',
        channelId: 'channel.trade_dependency.supplier.buyer.grain',
        channelType: 'trade_dependency',
        goods: [{ id: 'grain', label: 'Grain', category: 'food', criticality: 0.9 }],
        severity: 0.35,
        confidence: 0.8,
        status: 'queued',
        delayTicks: 1,
        ageTicks: 0,
        maxAgeTicks: 12,
        waveDepth: 0,
        sourceChange: { kind: 'route_cut' },
        explanation: 'Regional trade access is expected to tighten soon.',
        createdAt: '2026-01-01T00:00:00.000Z',
      }],
      eventLog: [{
        id: 'regional_event.e2e',
        sourceSettlementId: 'supplier',
        sourceSettlementName: 'Granary Ford',
        sourceEvent: { id: 'evt_e2e', type: 'DEPLETE_RESOURCE', targetId: 'grain_fields' },
        impactIds: ['regional_impact.e2e', 'regional_impact.delayed'],
        recordedAt: '2026-01-01T00:00:00.000Z',
      }],
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  };
}

function supabaseRowsFromSaves(saves) {
  return saves.map(save => ({
    id: save.id,
    name: save.name,
    tier: save.tier,
    data: save.settlement,
    config: save.config || null,
    toggles: null,
    seed: save.seed || null,
    neighbour_links: save.settlement?.neighbourNetwork || null,
    ai_data: save.aiData || {},
    campaign_state: save.campaignState || null,
    created_at: save.timestamp,
    updated_at: save.timestamp,
  }));
}

test.describe('regional causality campaign UI', () => {
  test.beforeEach(async ({ page }) => {
    const saves = [settlementSave('supplier', 'Granary Ford'), settlementSave('buyer', 'Millcross')];
    const campaigns = [seededCampaign()];
    await page.route(/\/rest\/v1\/settlements/i, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(supabaseRowsFromSaves(saves)),
      });
    });
    await page.addInitScript(({ saves, campaigns }) => {
      try {
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem('dnd_settlement_saves', JSON.stringify(saves));
        localStorage.setItem('sf_campaigns', JSON.stringify(campaigns));
        localStorage.setItem('sf_campaigns:mock-e2e', JSON.stringify(campaigns));
        localStorage.setItem('settlement_mock_auth', JSON.stringify({
          user: { id: 'mock-e2e', email: 'dm@example.test', user_metadata: {} },
          session: { access_token: 'mock-token' },
          tier: 'premium',
          role: 'user',
          displayName: 'DM',
          isFounder: false,
          needsVerification: false,
        }));
      } catch { /* storage unavailable */ }
    }, { saves, campaigns });
  });

  test('applies and resolves a queued regional impact from the campaign folder', async ({ page }) => {
    await page.goto('/settlements');

    await expect(page.getByText('Trade Belt')).toBeVisible();
    await expect(page.getByText('Regional graph')).toBeVisible();
    await expect(page.getByText('Causal chains')).toBeVisible();
    await expect(page.getByText('Millcross', { exact: true })).toBeVisible();
    await expect(page.getByText('2 queued')).toBeVisible();
    await expect(page.getByText(/1\/2 ready/)).toBeVisible();

    await page.getByTitle('Show causal details').first().click();
    await expect(page.getByText('Source event')).toBeVisible();
    await expect(page.getByText('Target condition')).toBeVisible();
    await expect(page.getByText(/condition\.regional_import_shortage/)).toBeVisible();

    await page.getByTitle('Advance regional impacts 1 tick').click();
    await expect(page.getByText(/2\/2 ready/)).toBeVisible();

    await page.getByTitle('Apply regional impact').first().click();
    await expect(page.getByText(/1 applied/).first()).toBeVisible();

    await page.getByTitle('Resolve applied regional impact').first().click();
    await expect(page.getByText(/1 resolved/).first()).toBeVisible();
  });

  test('discovers and confirms suggested regional channels', async ({ page }) => {
    await page.goto('/settlements');

    await page.getByTitle('Discover regional channels').click();
    await expect(page.getByText(/suggested/).first()).toBeVisible();
    await expect(page.getByTitle('Confirm channel').first()).toBeVisible();

    await page.getByTitle('Confirm channel').first().click();
    await expect(page.getByText(/2 confirmed|3 confirmed/).first()).toBeVisible();
  });

  test('world map campaign workspace can switch to Wizard News', async ({ page }) => {
    await page.goto('/map');

    const campaignSelect = page.locator('select').filter({
      has: page.locator('option', { hasText: 'Trade Belt' }),
    });
    await expect(campaignSelect).toBeVisible();
    const campaignValue = await campaignSelect.locator('option', { hasText: 'Trade Belt' }).getAttribute('value');
    await campaignSelect.selectOption(campaignValue);

    // P4/P5 IA move: the standalone "Show Wizard News" view is gone — the news
    // feed now lives in the Chronicle tab of the Realm Inspector, opened from
    // the toolbar "News" button.
    await page.getByTitle('Show the Chronicle in the Realm Inspector').click();

    // The Realm Inspector opens at the Chronicle section, which renders the
    // WizardNewsPanel with the seeded entries.
    await expect(page.getByText('Most Significant News')).toBeVisible();
    await expect(page.getByText('Millcross faces import shortage')).toBeVisible();
    await expect(page.getByText('Realm Notables')).toBeVisible();
    await expect(page.getByText('Route disruption reaches Millcross')).toBeVisible();

    // Close the inspector to return to the map workspace.
    await page.getByTitle('Close inspector').click();
    await expect(page.getByTitle('Toggle layer visibility')).toBeVisible();
  });

  test('map Layers panel exposes regional overlay toggles and filters', async ({ page }) => {
    await page.goto('/map');

    await page.getByTitle('Toggle layer visibility').click();
    await expect(page.getByText('Regional channels', { exact: true })).toBeVisible();
    await expect(page.getByText('Regional impacts')).toBeVisible();
    await expect(page.getByText('GM regional channels')).toBeVisible();
    await expect(page.getByRole('button', { name: /trade dependency/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /queued/i })).toBeVisible();

    await page.getByLabel('Regional impacts').uncheck();
    await expect(page.getByLabel('Regional impacts')).not.toBeChecked();
    await page.getByLabel('Regional impacts').check();
    await expect(page.getByLabel('Regional impacts')).toBeChecked();
  });
});
