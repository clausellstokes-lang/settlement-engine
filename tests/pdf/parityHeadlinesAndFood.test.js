/**
 * @vitest-environment jsdom
 *
 * Regression pins for the B14-pdf screen-parity bugs:
 *
 *   #3 Relationships chapter headline was always empty / mislabelled neighbours
 *      as internal ties (wrong `{ all }` shape passed to relationshipsHeadline).
 *   #4 Resources headline silently dropped the depleted-resources clause (passed
 *      `primaryImports` instead of the `nearbyDepleted` key the function reads).
 *   #1 Daily-life food slice now routes through the shared deriveFoodBalance
 *      (clamped, screen-parity) instead of the raw metrics.foodBalance.
 *   #2 IdentityDailyLife no longer prints a false "Surplus of 0 units / supply is
 *      reliable" when food was never calculated, and reads "balanced" at zero.
 *   #5 NotableNPCs renders object-shaped secrets carrying only what/stakes/label
 *      (the slice admits them; the render used to drop them).
 *
 * PDF components are plain hook-free functions returning element trees, so we
 * execute them and collect text leaves — same trade-off as the other PDF tests.
 */
import { describe, it, expect } from 'vitest';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { relationshipsHeadline, resourcesHeadline } from '../../src/pdf/lib/headlines.js';
import { Relationships } from '../../src/pdf/sections/Relationships.jsx';
import { ResourcesProduction } from '../../src/pdf/sections/ResourcesProduction.jsx';
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { NotableNPCs } from '../../src/pdf/sections/NotableNPCs.jsx';

function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return collectText(node.type(node.props), out);
    return collectText(node.props?.children, out);
  }
  return out;
}
const joined = (node) => collectText(node).join(' ');

// ── #3 Relationships headline ──────────────────────────────────────────────
describe('#3 relationshipsHeadline reads the real slice shape', () => {
  it('names neighbours AND internal ties (not mislabelled)', () => {
    const out = relationshipsHeadline({
      neighbours: [{ name: 'Eastgate' }, { name: 'Stonewatch' }],
      internal: [{ label: 'guild feud' }],
    });
    expect(out).toBe('2 neighbour links, 1 internal tie on file.');
  });

  it('singularises a lone neighbour link', () => {
    const out = relationshipsHeadline({ neighbours: [{ name: 'Eastgate' }], internal: [] });
    expect(out).toBe('1 neighbour link on file.');
  });

  it('renders the headline in the Relationships chapter (not empty)', () => {
    const settlement = {
      name: 'Linktown',
      neighbourNetwork: [
        { neighbourName: 'Eastgate', relationshipType: 'allied' },
        { neighbourName: 'Stonewatch', relationshipType: 'rival' },
      ],
      relationships: [{ label: 'guild feud' }],
    };
    const vm = buildViewModel({ settlement });
    const text = joined(Relationships({ settlement, vm }));
    expect(text).toContain('2 neighbour links');
    expect(text).toContain('1 internal tie');
  });
});

// ── #4 Resources headline ──────────────────────────────────────────────────
describe('#4 resourcesHeadline surfaces depleted resources', () => {
  it('includes both the export clause and the depleted-resource clause', () => {
    const out = resourcesHeadline({
      exportPotential: ['iron_ore'],
      nearbyDepleted: ['timber', 'silver'],
    });
    expect(out).toBe('Exports iron ore; 2 depleted resources.');
  });

  it('renders the depleted clause in the Resources chapter', () => {
    const settlement = {
      name: 'Orevale',
      resourceAnalysis: {
        terrain: 'mountain',
        exports: ['iron_ore'],
        nearbyResources: ['iron_ore', 'timber'],
      },
      config: { nearbyResourcesDepleted: ['timber'] },
    };
    const vm = buildViewModel({ settlement });
    const text = joined(ResourcesProduction({ settlement, vm }));
    expect(text).toContain('1 depleted resource');
  });
});

// ── #1 daily food slice routes through deriveFoodBalance ────────────────────
describe('#1 dailySlice.foodBalance mirrors the clamped canonical food number', () => {
  it('clamps deficit/surplus and flags availability when computed', () => {
    const settlement = {
      name: 'Hungertown',
      economicViability: { metrics: { foodBalance: { dailyProduction: 100, dailyNeed: 400, deficit: 300, surplus: 0 } } },
    };
    const vm = buildViewModel({ settlement });
    expect(vm.daily.foodBalance).toMatchObject({ available: true, deficit: 300, surplus: 0 });
  });

  it('is null when food was never calculated', () => {
    const vm = buildViewModel({ settlement: { name: 'Sparse' } });
    expect(vm.daily.foodBalance).toBeNull();
  });
});

// ── #2 IdentityDailyLife honest food verdict ───────────────────────────────
describe('#2 IdentityDailyLife food verdict is honest', () => {
  it('omits the food verdict entirely when food was never calculated', () => {
    const settlement = { name: 'Sparse', tier: 'thorp', population: 30 };
    const vm = buildViewModel({ settlement });
    const text = joined(IdentityDailyLife({ settlement, vm }));
    expect(text).not.toContain('supply is reliable');
    expect(text).not.toMatch(/Surplus of 0 units/);
  });

  it('reads "balanced" (not a false surplus) when production meets need exactly', () => {
    const settlement = {
      name: 'Eventown',
      economicViability: { metrics: { foodBalance: { dailyProduction: 400, dailyNeed: 400, deficit: 0, surplus: 0 } } },
    };
    const vm = buildViewModel({ settlement });
    const text = joined(IdentityDailyLife({ settlement, vm }));
    expect(text).not.toMatch(/Surplus of 0 units/);
    expect(text).not.toContain('supply is reliable');
    expect(text.toLowerCase()).toContain('balanced');
  });

  it('still reports a real surplus and a real deficit', () => {
    const surplusS = {
      name: 'Plentyburg',
      economicViability: { metrics: { foodBalance: { dailyProduction: 600, dailyNeed: 400, deficit: 0, surplus: 200 } } },
    };
    const surplusVm = buildViewModel({ settlement: surplusS });
    expect(joined(IdentityDailyLife({ settlement: surplusS, vm: surplusVm }))).toContain('Surplus of 200 units');

    const deficitS = {
      name: 'Hungertown',
      economicViability: { metrics: { foodBalance: { dailyProduction: 100, dailyNeed: 400, deficit: 300, surplus: 0 } } },
    };
    const deficitVm = buildViewModel({ settlement: deficitS });
    expect(joined(IdentityDailyLife({ settlement: deficitS, vm: deficitVm }))).toContain('Deficit of 300 units');
  });
});

// ── #5 NotableNPCs object-shaped secrets ───────────────────────────────────
describe('#5 NotableNPCs renders object-shaped secrets the slice admits', () => {
  it('renders a what/stakes-only secret object', () => {
    const settlement = {
      name: 'Secretburg',
      npcs: [{
        name: 'Mara the Quiet',
        power: 90,
        secrets: [{ what: 'Embezzles the temple tithe', stakes: 'Exposure means exile' }],
      }],
    };
    const vm = buildViewModel({ settlement });
    // Slice preserves it...
    expect(vm.npcs.sorted[0].secrets).toHaveLength(1);
    // ...and the render now surfaces it (was dropped by the text||description-only read).
    const text = joined(NotableNPCs({ settlement, vm }));
    expect(text).toContain('Embezzles the temple tithe');
    expect(text).toContain('Exposure means exile');
  });

  it('renders a label-only secret object', () => {
    const settlement = {
      name: 'Secretburg',
      npcs: [{ name: 'Rook', power: 95, secrets: [{ label: 'Double agent for the rival baron' }] }],
    };
    const vm = buildViewModel({ settlement });
    const text = joined(NotableNPCs({ settlement, vm }));
    expect(text).toContain('Double agent for the rival baron');
  });
});
