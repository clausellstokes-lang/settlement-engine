import { test, expect } from '@playwright/test';

/**
 * e2e/library-phone-controls.spec.js — LIBRARY-SIMPLE (2026-11-10), the chair's reopen.
 *
 * The owner's words that opened the lane (2026-11-10, verbatim): "I now want to simplify the
 * library page. No longer does it advance time. ... The library should only house settlements,
 * allow to view them edit settlements where gated, create campaigns, and then assign campaigns
 * to settlements."
 *
 * Removing the folder's advance cluster brought the Library's phone page back to its viewport
 * (390 px; the base read 578). The chair then saw, in the lane's own iPhone 13 picture, that a
 * campaign folder's settlement row still cut its action controls at the folder's right edge.
 * MEASURED at base and tip alike: the folder table was 360 px inside a 316 px box, because the
 * row's "name · world" line ("Hearthfell · The Reach") would not wrap; Open, the menu chevron
 * and Delete sat at x 337-385 against a box ending at 353, and a tap at their centre missed.
 * The unassigned ledger's row (no world after the name) fit.
 *
 * THE PIN, for both kinds of card: at phone width every action control of the row lies inside
 * the scroll box that holds the row's table, with the box at rest (no sideways scroll), and is
 * the element at its own centre point — so a tap on what the reader sees lands on it.
 */

test.skip(({ browserName }) => browserName !== 'chromium', 'Measured in Chromium at a phone viewport');
test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

function save(id, name) {
  return {
    id, name, tier: 'town', timestamp: '2026-01-01T00:00:00.000Z',
    settlement: {
      id, name, tier: 'town', population: 1500, config: {}, institutions: [],
      powerStructure: { factions: [], conflicts: [] }, npcs: [],
      economicState: { primaryExports: [], primaryImports: [], activeChains: [] },
      activeConditions: [], neighbourNetwork: [],
    },
    campaignState: { phase: 'draft', eventLog: [], locks: {} },
  };
}

const CAMPAIGN = {
  id: 'camp-phone', name: 'The Reach',
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  settlementIds: ['in-folder'], collapsed: false, mapState: null,
};

test.beforeEach(async ({ page }) => {
  const saves = [save('in-folder', 'Hearthfell'), save('unassigned', 'Ashford')];
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
        tier: 'premium', role: 'user', displayName: 'DM', isFounder: false, needsVerification: false,
      }));
    } catch { /* storage unavailable */ }
  }, { saves, campaigns: [CAMPAIGN] });
});

/** Measure one row's action controls against the scroll box that holds its table, at rest. */
async function measureRow(page, name) {
  return page.evaluate((rowName) => {
    const tr = [...document.querySelectorAll('tr')].find((t) => t.querySelector('h3')?.textContent === rowName);
    if (!tr) return { missing: true };
    const box = tr.closest('table').parentElement;
    box.scrollLeft = 0;
    const controls = [...tr.querySelectorAll('[data-card-actions] button')];
    // Bring the row to the middle of the screen vertically only; never sideways.
    window.scrollTo(0, window.scrollY + tr.getBoundingClientRect().top - window.innerHeight / 2);
    const b = box.getBoundingClientRect();
    return {
      missing: false,
      count: controls.length,
      bad: controls.flatMap((el) => {
        const r = el.getBoundingClientRect();
        const label = el.getAttribute('aria-label') || el.textContent.trim();
        const out = [];
        if (r.left < b.left - 0.5 || r.right > b.right + 0.5) {
          out.push(`${label}: x ${Math.round(r.left)}-${Math.round(r.right)} outside its box ${Math.round(b.left)}-${Math.round(b.right)}`);
        }
        const hit = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2);
        if (!hit || !(hit === el || el.contains(hit))) out.push(`${label}: a tap at its centre lands elsewhere`);
        return out;
      }),
    };
  }, name);
}

for (const [kind, name] of [['a campaign folder card', 'Hearthfell'], ['an unassigned card', 'Ashford']]) {
  test(`at 390 px every action control of ${kind} lies inside its box and takes a tap at its centre`, async ({ page }) => {
    await page.goto('/settlements');
    await page.waitForFunction(() => !document.querySelector('[data-sf-route-loading]'));
    await expect(page.getByRole('heading', { name: 'Library', exact: true })).toBeVisible();
    await expect(page.getByRole('status', { name: 'Loading saves' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    const m = await measureRow(page, name);
    expect(m.missing, `${name}'s row is on the page`).toBe(false);
    expect(m.count, `${name}'s row carries its action controls`).toBeGreaterThanOrEqual(3);
    expect(m.bad, `\n${m.bad.join('\n')}`).toEqual([]);
  });
}
