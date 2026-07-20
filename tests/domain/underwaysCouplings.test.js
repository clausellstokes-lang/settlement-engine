/**
 * underwaysCouplings.test.js — D6 THE UNDERWAYS engine-couplings pins
 * (DESIGN_SIM_DEPTH_R2 §D6, engine-couplings half).
 *
 * Every coupling reads the CLANDESTINE facet through THE FACET LAW (facetOf), never an
 * institution name string. The catalog + generation half rides Track-G2, so here the facet
 * exists ONLY via CUSTOM institutions — which is exactly why these fixtures also prove the
 * facet law's CUSTOM-CONTENT PARITY (a genre-blind custom institution declaring the facet
 * couples identically to the catalog institution G2 will land). Absent the facet every
 * coupling is a no-op (byte-identical) — the broad byte-identity is pinned by the six
 * dormancy goldens (corruptionWeb/naval/settlementLifecycle/resourceDynamics/supplyWeb/
 * worldpulseSpatial); these pins prove the LIT path and the shared facet read.
 */
import { describe, it, expect } from 'vitest';
import { hasClandestineFacet, settlementHasUnderways, UNDERWAYS_TUNING } from '../../src/domain/worldPulse/clandestineFacet.js';
import { smuggleSuccessChance, smuggleDetected } from '../../src/domain/spatial/smuggle.js';
import { advanceFoodStockpile } from '../../src/domain/worldPulse/foodStockpile.js';
import { detectInstitutionGaps } from '../../src/domain/worldPulse/institutionLifecycle.js';

// A CUSTOM clandestine institution — declared via the facets{} map (the primary form) and
// the facet:<kind>:<value> tag (the alternate). Neither is a catalog entry; both COUNT.
const WARREN_FACETS = { name: "The Sunken Warren", facets: { institutionFunction: 'clandestine' } };
const WARREN_TAG = { name: 'Old Delvings', tags: ['facet:institutionFunction:clandestine'] };
const VICE_DEN = { name: 'The Rat Cellar', tags: ['facet:institutionNature:vice'] };
const PLAIN_GRANARY = { id: 'granary', name: 'Old Granary' };

describe('D6 — the clandestine facet read (custom-content parity)', () => {
  it('a custom institution declaring the clandestine function COUNTS (facets{} AND tag form)', () => {
    expect(hasClandestineFacet([WARREN_FACETS])).toBe(true);
    expect(hasClandestineFacet([WARREN_TAG])).toBe(true);
    expect(settlementHasUnderways({ institutions: [PLAIN_GRANARY, WARREN_FACETS] })).toBe(true);
  });
  it('a genre-blind settlement with no clandestine facet does NOT count (dormant read)', () => {
    expect(hasClandestineFacet([PLAIN_GRANARY, VICE_DEN])).toBe(false);
    expect(settlementHasUnderways({ institutions: [PLAIN_GRANARY] })).toBe(false);
    expect(settlementHasUnderways(null)).toBe(false);
  });
});

describe('D6 coupling 1 — M7 smuggling substrate (the network lever the facet moves)', () => {
  it('more network reach ⇒ higher success ⇒ lower detection (the underways bonus direction)', () => {
    const args = { corruption: 0.3, goodsResistance: 0.3, boldness: 0.6 };
    const low = smuggleSuccessChance({ network: 0.4, ...args });
    const high = smuggleSuccessChance({ network: 0.4 + UNDERWAYS_TUNING.SMUGGLE_NETWORK_BONUS, ...args });
    expect(high).toBeGreaterThan(low);
    // Detection is the inverse of success: a fixed draw is more likely to MISS a higher chance.
    const draw = 0.5;
    expect(smuggleDetected(high, draw) ? 1 : 0).toBeLessThanOrEqual(smuggleDetected(low, draw) ? 1 : 0);
  });
});

describe('D6 coupling 2 — siege + blockade endurance (land–sea parity)', () => {
  const besiege = (institutions) => {
    const blockade = { id: 'siege.x', type: 'siege', severity: 0.8, lifecycleStage: 'active', affectedSettlementIds: ['a'] };
    let cur = {
      name: 'Ashford', tier: 'town', population: 2000, institutions, activeConditions: [],
      economicState: { foodSecurity: { deficitPct: 0, surplusPct: 0, storageMonths: 4, importDependency: 0.4 } },
    };
    for (let tick = 1; tick <= 4; tick++) cur = advanceFoodStockpile(cur, { interval: 'one_month', tick, blockade }).settlement || cur;
    return cur.economicState.foodSecurity.storageMonths;
  };
  it('LAND siege: a tunneled town keeps a supply trickle and holds more food than a plain one', () => {
    const plain = besiege([PLAIN_GRANARY]);
    const tunneled = besiege([PLAIN_GRANARY, WARREN_FACETS]);
    expect(tunneled).toBeGreaterThan(plain); // the underways trickle floors the import cut
  });
  // NAVAL leg (warDeployment supplyInterdiction capitulation discount): SEAMED — the
  // warDeployment file sits at its max-lines ceiling, so the naval-blockade discount is
  // deferred with an in-file seam (see warDeployment.js). The land leg above stands.
});

// D6 coupling 3 — covert-operations affinity: the CONSPIRACY-EASE leg (corruptionWeb
// recruitmentWeight) is live-wired and byte-verified dormant by corruptionWebDormancyGolden.
// The EXPOSURE-DISCOUNT leg is SEAMED (exposureChance lives in the eager corruption.js chunk
// AND npcAgency is at its max-lines ceiling — see the npcAgency.js seam). No pin here.

describe('D6 coupling 5 — organic founding hook (dormant behind the underways-founding flag)', () => {
  const settlement = {
    name: 'Crookharbor', tier: 'town', population: 3000,
    institutions: [VICE_DEN], // criminal underground present, but no clandestine institution yet
    economicState: {}, activeConditions: [],
  };

  it('DARK (default): a vice-bearing village+ settlement produces NO underways gap (byte-identical)', () => {
    // The G2 catalog entry 'Underground network' now EXISTS, so the resolver resolves — but the
    // clandestine emission is gated behind underwaysFoundingLit (default off), owner-parked because
    // lighting it shifts same-seed worldPulse goldens. Dark ⇒ addGap never fires ⇒ no clandestine gap.
    const gaps = detectInstitutionGaps(settlement);
    expect(gaps.every((g) => g.kind !== 'clandestine')).toBe(true);
    expect(() => detectInstitutionGaps(settlement)).not.toThrow();
  });

  it('LIT: the organic founding path resolves the catalog entry and emits the clandestine gap', () => {
    // With the flag lit, the hook resolves 'Underground network' (the catalog NAME — the prior
    // 'underground_network' SLUG passed to the exact-name resolver was DEAD forever) and founds it.
    const gaps = detectInstitutionGaps(settlement, null, { underwaysFoundingLit: true });
    const clandestine = gaps.find((g) => g.kind === 'clandestine');
    expect(clandestine, 'the clandestine gap now EMITS when lit').toBeTruthy();
    expect(clandestine.name).toBe('Underground network'); // the catalog entry resolved (no longer null)
    // negative control: a settlement that already has tunnels emits NO gap even when lit.
    const tunneled = { ...settlement, institutions: [VICE_DEN, WARREN_FACETS] };
    expect(detectInstitutionGaps(tunneled, null, { underwaysFoundingLit: true }).every((g) => g.kind !== 'clandestine')).toBe(true);
  });
});
