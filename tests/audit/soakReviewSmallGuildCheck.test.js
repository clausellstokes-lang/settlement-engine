/**
 * F5 unit 3 (2026-11-04): A-14 HONOURS THE MARKET LICENCE. The chair's ruling on soak1k-313: a
 * Periodic market is a market. The engine seats a small place's Merchant Guilds and Thieves' Guild
 * only on a real market (`src/generators/economy/viability.js :: hasMarketInstitution`, R6 and
 * SIZE-3 in `rulingStructure.js`); the instrument reads the same predicate. A hamlet with no
 * market at all and a guild power is still flagged, and so is a guild the engine never seats
 * small (a craft guild).
 *
 * A-12 does NOT follow (measured, lane F5): `reviewSettlement` reads A-12 before A-14 is added, so
 * A-14 was never one of A-12's contradictions. 313's A-12 counts its coh:defense-words finding,
 * "The halls, the walls and the roads are all better than a hamlet this size strictly requires."
 * in a hamlet with no walls (kind 4, lane F1's class); it stays red on that real contradiction.
 */
import { describe, expect, it } from 'vitest';
import { guildPowerSmall, reviewSettlement } from '../../scripts/audit/soak-review/checks.mjs';

const hamlet = (institutions, faction) => ({ tier: 'hamlet', population: 60, institutions: institutions.map((name) => ({ name })), powerStructure: { factions: [{ faction: "Headman's Authority" }, { faction }] } });

describe('A-14 guild power in a small place', () => {
  it('a hamlet with a Periodic market and Merchant Guilds: licensed (soak1k-313)', () => {
    expect(guildPowerSmall(hamlet(['Subsistence farming', 'Periodic market'], 'Merchant Guilds'))).toBeUndefined();
  });
  it('a hamlet with no market at all and Merchant Guilds: still flagged', () => {
    expect(guildPowerSmall(hamlet(['Subsistence farming', 'Shrine'], 'Merchant Guilds'))).toBe('Merchant Guilds');
  });
  it('a craft guild in a hamlet with a market: still flagged (the engine never seats it small)', () => {
    expect(guildPowerSmall(hamlet(['Subsistence farming', 'Periodic market'], 'Craft Guilds'))).toBe('Craft Guilds');
  });
  it('a town is never read', () => {
    expect(guildPowerSmall({ ...hamlet([], 'Craft Guilds'), tier: 'town' })).toBeUndefined();
  });
});

describe('soak1k-313, Achilopolis: a hamlet with a Periodic market', () => {
  /** @param {Record<string, string>} extra */
  const review = async (extra) => {
    const { birth, ensureLaws } = await import('../../scripts/audit/soak-review/corpus.mjs');
    await ensureLaws();
    const b = birth(313);
    const s = b.settlement;
    expect(s.tier).toBe('hamlet');
    expect((s.institutions || []).map((i) => i.name)).toContain('Periodic market');
    const vouch = `Nothing in ${s.name}'s record contradicts anything else in it.`;
    // The page's surfaces, hand-built so only what is named here can convict it: the vouch line,
    // the stores row once on Economy and one Food endurance line (X-49, X-52).
    const tabs = { overview: vouch, economics: 'No granary; six weeks in household stores.', defense: 'Food endurance: six weeks on full rations.', plot_hooks: '', ...extra };
    return reviewSettlement(s, b.config, { tabs, tonight: '', tonightSheet: null, pdf: '', foundry: '', errors: {} }).map((f) => f.check);
  };
  it('gives no A-14 for its Merchant Guilds', async () => {
    const checks = await review({});
    expect(checks).not.toContain('A-14:guild-power-small'); // anchored: review() pins the hamlet and its Periodic market, and the next test drives the same review() to A-12
    expect(checks).not.toContain('A-12:self-vouch-false'); // anchored: review() pins its subject live, and the next test proves A-12 IS reported when the walls sentence is there
  });
  it('keeps A-12 red on its real contradiction, the walls sentence in a hamlet without walls', async () => {
    const checks = await review({ daily_life: 'The halls, the walls and the roads are all better than a hamlet this size strictly requires.' });
    expect(checks).toContain('coh:defense-words');
    expect(checks).toContain('A-12:self-vouch-false');
    expect(checks).not.toContain('A-14:guild-power-small'); // anchored: the two lines above pin this same checks list live (coh:defense-words and A-12 are in it)
  });
});
