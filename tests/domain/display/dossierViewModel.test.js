import { describe, it, expect } from 'vitest';
import {
  deriveFoodBalance,
  deriveExportPosture,
  deriveViability,
  deriveMagicPosture,
  deriveBlockadeRelief,
  deriveDossierViewModel,
} from '../../../src/domain/display/dossierViewModel.js';
import { sanitizePublicValue, PRIVATE_KEY_RE } from '../../../src/domain/display/publicSafe.js';

const withFood = (fb) => ({ economicViability: { metrics: { foodBalance: fb } } });
const withEco  = (economicState, extra = {}) => ({ economicState, ...extra });

describe('deriveFoodBalance (§1c)', () => {
  it('maps dailyProduction/dailyNeed into produced/needed', () => {
    const fb = deriveFoodBalance(withFood({ dailyProduction: 134520, dailyNeed: 50400, surplus: 84120, deficit: 0 }));
    expect(fb.produced).toBe(134520);
    expect(fb.needed).toBe(50400);
    expect(fb.display).toBe('Surplus +84,120');
    expect(fb.detail).toBe('Produced/Needed: 134,520 / 50,400 lb/day');
  });

  it('never shows produced=0 / needed=0 beside a non-zero surplus (the PDF bug)', () => {
    // surplus present but the raw daily fields absent — what the PDF saw when
    // it read .production / .need instead of dailyProduction / dailyNeed.
    const fb = deriveFoodBalance(withFood({ surplus: 84120, deficit: 0 }));
    expect(fb.display).toBe('Surplus +84,120');
    expect(fb.produced).toBeNull();
    expect(fb.needed).toBeNull();
    expect(fb.detail).toBe('Produced/Needed: Not calculated');
  });

  it('renders a deficit with the minus sign and normalizes it as a share of need', () => {
    const fb = deriveFoodBalance(withFood({ dailyProduction: 13065, dailyNeed: 14280, surplus: 0, deficit: 1215 }));
    expect(fb.deficitPct).toBe(9); // 1215 / 14280 ≈ 8.5% → 9%
    expect(fb.display).toBe('Deficit −1,215 (9% of need)');
  });

  it('falls back cleanly when foodBalance is absent', () => {
    const fb = deriveFoodBalance({});
    expect(fb.available).toBe(false);
    expect(fb.detail).toBe('Produced/Needed: Not calculated');
  });
});

describe('deriveExportPosture (§1d)', () => {
  it('reads primaryExports, not the legacy exports field', () => {
    const ep = deriveExportPosture(withEco({ primaryExports: ['Grain', 'Wool', 'Iron'], exports: [] }));
    expect(ep.count).toBe(3);
    expect(ep.status).toBe('established');
  });

  it('classifies an entrepôt', () => {
    const ep = deriveExportPosture(withEco({ primaryExports: ['Silk (transit)'], isEntrepot: true }));
    expect(ep.status).toBe('entrepot');
  });

  it('classifies isolated trade routes as vulnerable', () => {
    const ep = deriveExportPosture(withEco({ primaryExports: ['Furs', 'Ore'] }, { config: { tradeRouteAccess: 'isolated' } }));
    expect(ep.status).toBe('vulnerable');
  });

  it('classifies a single export as limited', () => {
    const ep = deriveExportPosture(withEco({ primaryExports: ['Salt'] }, { config: { tradeRouteAccess: 'road' } }));
    expect(ep.status).toBe('limited');
  });

  it('reports none only when truly empty', () => {
    const ep = deriveExportPosture(withEco({ primaryExports: [], exports: [] }));
    expect(ep.status).toBe('none');
    expect(ep.label).toMatch(/No exports/);
  });

  it('falls back to the legacy exports field when primaryExports is absent', () => {
    const ep = deriveExportPosture(withEco({ exports: ['Grain', 'Wool'] }, { config: { tradeRouteAccess: 'road' } }));
    expect(ep.count).toBe(2);
    expect(ep.status).toBe('established');
  });
});

describe('deriveDossierViewModel', () => {
  it('is a pure single source: identical input yields identical output', () => {
    const s = {
      ...withFood({ dailyProduction: 100, dailyNeed: 80, surplus: 20, deficit: 0 }),
      economicState: { primaryExports: ['Grain'] },
      config: { tradeRouteAccess: 'road' },
    };
    expect(deriveDossierViewModel(s)).toEqual(deriveDossierViewModel(s));
    const vm = deriveDossierViewModel(s);
    expect(vm.foodBalance.display).toBe('Surplus +20');
    expect(vm.exportPosture.status).toBe('limited');
    expect(vm.viability).toBeTruthy();
  });
});

describe('deriveMagicPosture (Wave 7 — MagicProfile surfaced)', () => {
  const magicTown = {
    config: { magicLevel: 'medium' },
    powerStructure: { factions: [] },
    institutions: [],
  };
  const deadMagicTown = {
    config: { magicExists: false, magicLevel: 'pervasive' },
    institutions: [{ name: "Wizard's Tower" }],
    powerStructure: { factions: [{ faction: 'Arcane Conclave', power: 70 }] },
  };

  it('renders the Tier 4.8 bands for a magic world', () => {
    const m = deriveMagicPosture(magicTown);
    expect(m.available).toBe(true);
    expect(m.magicExists).toBe(true);
    expect(m.availability).toBe('moderate');
    expect(m.legality).toBe('regulated');
    expect(m.cost).toBe('costly');
    expect(m.risk).toBeTruthy();
    expect(m.display).toBe('Availability moderate: regulated, costly services, moderate risk');
  });

  it('emits the four role lines', () => {
    const m = deriveMagicPosture(magicTown);
    expect(m.roleLines).toHaveLength(4);
    expect(m.roleLines[0]).toMatch(/^Economic role: /);
    expect(m.roleLines).toContain(`Military role: ${m.roles.military}`);
  });

  it('keeps the honest absent shape for a dead-magic world', () => {
    const m = deriveMagicPosture(deadMagicTown);
    expect(m.magicExists).toBe(false);
    expect(m.availability).toBe('absent');
    expect(m.cost).toBe('absent');
    expect(m.risk).toBe('absent');
    expect(m.display).toBe('Magic does not function in this world');
    expect(m.roles).toEqual({
      economic: 'absent', military: 'absent', medical: 'absent', infrastructure: 'absent',
    });
  });

  it('falls back cleanly for a nullish settlement', () => {
    const m = deriveMagicPosture(null);
    expect(m.available).toBe(false);
    expect(m.display).toBe('Not assessed');
  });

  it('is wired into the canonical view model', () => {
    const vm = deriveDossierViewModel(magicTown);
    expect(vm.magic).toEqual(deriveMagicPosture(magicTown));
  });

  it('every new field survives the public-safe projection (denylist check)', () => {
    for (const town of [magicTown, deadMagicTown]) {
      const m = deriveMagicPosture(town);
      expect(sanitizePublicValue({ magic: m })).toEqual({ magic: m });
      const keys = (obj) => Object.entries(obj).flatMap(([k, v]) =>
        v && typeof v === 'object' ? [k, ...keys(v)] : [k]);
      for (const key of keys(m)) {
        expect(PRIVATE_KEY_RE.test(key), `field name "${key}" trips the publicSafe denylist`).toBe(false);
      }
    }
  });
});

describe('deriveViability (§1f)', () => {
  it('downgrades "self-sufficient" to strained when there is a food deficit', () => {
    const r = deriveViability({ economicViability: {
      viable: true,
      summary: '✓ VIABLE: Settlement is economically self-sufficient and historically plausible.',
      metrics: { foodBalance: { deficit: 1215, dailyProduction: 13065, dailyNeed: 14280 } },
    } });
    expect(r.verdict).toBe('strained');
    expect(r.summary).toMatch(/STRAINED/);
  });

  it('reports critical dependencies when deps exist and food is fine', () => {
    const r = deriveViability({ economicViability: {
      viable: true, dependencies: [{}, {}],
      metrics: { foodBalance: { deficit: 0, surplus: 100, dailyProduction: 200, dailyNeed: 100 } },
    } });
    expect(r.verdict).toBe('dependent');
  });

  it('keeps self-sufficient only when there is no deficit and no dependencies', () => {
    const r = deriveViability({ economicViability: {
      viable: true, dependencies: [],
      metrics: { foodBalance: { deficit: 0, surplus: 100, dailyProduction: 200, dailyNeed: 100 } },
    } });
    expect(r.verdict).toBe('self_sufficient');
  });

  it('keeps a not-viable verdict', () => {
    const r = deriveViability({ economicViability: { viable: false, summary: '✗ NOT VIABLE: 2 critical issues prevent settlement survival.' } });
    expect(r.verdict).toBe('not_viable');
    expect(r.viable).toBe(false);
  });
});

describe('deriveViability — isolated import-channel wording matrix', () => {
  // Isolated settlement with a residual deficit; the foodBalance fields vary
  // per case. 'magical provision' must be gated on magicFoodOffset > 0 — an
  // isolated village in a magicExists:false world covered by minor caravan
  // routes must NOT be described as magically fed.
  const isolated = (fb) => ({
    economicViability: {
      viable: true,
      metrics: { foodBalance: { deficit: 500, dailyProduction: 1000, dailyNeed: 1500, ...fb } },
    },
    config: { tradeRouteAccess: 'isolated' },
  });

  it('covered + channel + magic offset names the channel AND magical provision', () => {
    const r = deriveViability(isolated({ importCoverage: 300, importChannel: 'teleportation circle', magicFoodOffset: 200 }));
    expect(r.verdict).toBe('strained');
    expect(r.summary).toMatch(/feeds itself through the teleportation circle, magical provision, and stored reserves/);
  });

  it('covered + channel WITHOUT magic offset never claims magical provision', () => {
    const r = deriveViability(isolated({ importCoverage: 60, importChannel: 'minor routes and sanctioned caravans' }));
    expect(r.summary).toMatch(/feeds itself through minor routes and sanctioned caravans and stored reserves/);
    expect(r.summary).not.toMatch(/magical provision/);
  });

  it('legacy covered + no channel reads as generic trade imports, not "no import channel"', () => {
    // Pre-wave saves carry importCoverage without importChannel — the imports
    // are real (EconomicsTab shows 'Trade covers N% of gap'), so the clause
    // must not deny them.
    const r = deriveViability(isolated({ importCoverage: 120 }));
    expect(r.summary).toMatch(/feeds itself through trade imports and stored reserves/);
    expect(r.summary).not.toMatch(/no meaningful import channel/);
    expect(r.summary).not.toMatch(/magical provision/);
  });

  it('genuinely uncovered keeps the no-import-channel clause', () => {
    const r = deriveViability(isolated({}));
    expect(r.summary).toMatch(/survives on local production and stored reserves \(no meaningful import channel reaches it\)/);
  });

  it('uncovered but magic-fed credits magical provision alongside local production', () => {
    // Isolated hamlets can have importCoverage 0 with a druidic offset —
    // magic supplements local production without any import channel.
    const r = deriveViability(isolated({ magicFoodOffset: 200 }));
    expect(r.summary).toMatch(/survives on local production, magical provision, and stored reserves \(no meaningful import channel reaches it\)/);
  });
});

describe('deriveBlockadeRelief (Wave 8 — blockadeBypass gains its reader)', () => {
  // The stockpile bookkeeping advanceFoodStockpile writes each pulse; this
  // derivation is the dossier read that says WHY the siege did or didn't bite.
  const withStockpile = (stockpile) => ({
    economicState: { foodSecurity: { deficitPct: 0, storageMonths: 4, stockpile } },
  });

  it('a teleport bypass explains why the siege is not biting — capped at the channel, not a free pass', () => {
    const b = deriveBlockadeRelief(withStockpile({ blockaded: true, blockadeBypass: 'teleport' }));
    expect(b).toEqual({
      available: true, blockaded: true, bypass: 'teleport',
      // The throughput caveat is load-bearing: the bypass carries at most the
      // circle's FOOD_IMPORT_RATES share — a port city still starves on the
      // overflow, and the prose must not promise otherwise.
      display: "Supplies arrive by teleportation circle despite the siege, as much as the circle can carry.",
    });
  });

  it('an airship bypass reads as impaired relief, not a free pass', () => {
    const b = deriveBlockadeRelief(withStockpile({ blockaded: true, blockadeBypass: 'airship' }));
    expect(b.bypass).toBe('airship');
    expect(b.display).toMatch(/Airships run the blockade/);
    expect(b.display).toMatch(/impaired/);
  });

  it('no channel: the display says the blockade is biting', () => {
    const b = deriveBlockadeRelief(withStockpile({ blockaded: true, blockadeBypass: null }));
    expect(b.blockaded).toBe(true);
    expect(b.bypass).toBeNull();
    expect(b.display).toMatch(/blockade is biting/);
    expect(b.display).toMatch(/import share of need goes unmet/);
  });

  it('no active blockade: the record is available but says nothing', () => {
    const b = deriveBlockadeRelief(withStockpile({ blockaded: false, blockadeBypass: null }));
    expect(b).toEqual({ available: true, blockaded: false, bypass: null, display: null });
  });

  it('settlements the pulse never touched degrade gracefully (no stockpile record)', () => {
    expect(deriveBlockadeRelief({ economicState: { foodSecurity: {} } }))
      .toEqual({ available: false, blockaded: false, bypass: null, display: null });
    expect(deriveBlockadeRelief(null))
      .toEqual({ available: false, blockaded: false, bypass: null, display: null });
  });

  it('is wired into the canonical view model', () => {
    const s = withStockpile({ blockaded: true, blockadeBypass: 'teleport' });
    const vm = deriveDossierViewModel(s);
    expect(vm.blockade).toEqual(deriveBlockadeRelief(s));
  });

  it('every field survives the public-safe projection (denylist check)', () => {
    const b = deriveBlockadeRelief(withStockpile({ blockaded: true, blockadeBypass: 'teleport' }));
    expect(sanitizePublicValue({ blockade: b })).toEqual({ blockade: b });
    for (const key of Object.keys(b)) {
      expect(PRIVATE_KEY_RE.test(key), `field name "${key}" trips the publicSafe denylist`).toBe(false);
    }
  });
});
