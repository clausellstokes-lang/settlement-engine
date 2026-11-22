/**
 * fortuneLawTradeLine.test.js — FS7 FINDING F2 (FORTUNE-1's U4, FORTUNE-3's builder), DARK.
 *
 * ⭐ THE FINDING. The economic situation's `high` trade line names the place's guilds ("... the guilds are well run ...").
 * The fortune label picks it at a Prosperous place whose output band is slow (`prosperity.js :: tradeBandFor`), and under
 * the fortune law the small places that are Prosperous are many: it printed at thorps, hamlets and villages that hold no
 * guild (`facts/guild.js :: guildOf` false), 36 of 120 small births on a slow or a busy output band
 * (docs/chair/2026-11-20/content/fortune/FS7-INVENTORY.md section 1.A).
 *
 * ⭐ THE CURE, BY THE LINE'S OWN CONDITION: under law 2 only, the line declares the guild it names, and its twin, the same
 * line without the guilds, prints where no guild house stands. Under law 1 it prints exactly as today.
 *
 * THE ARMS:
 *   (a) LIT — where law 1 prints the `high` band's guild line at a law-2 small birth that holds no guild, law 2 prints a
 *       line naming no guild that is still the `high` band's by the agreement arm's own table (`TRADE_LINE_BANDS`), so
 *       the label and the line keep one answer; a place holding a guild keeps the line. (The `very_high` line's guilds
 *       are picked by the output band, never by the label in a combination: FS7 F3, reported, not cured here.)
 *   (b) DARK — the same records' trade line recomputed WITHOUT the marker (law 1) is the stored line wherever the law-2
 *       line names no guild, and names the guilds in at least one guildless place (today's line); an explicit 1 is the
 *       marker-less line.
 *
 * Every expectation is computed from the record, `TRADE_LINE_BANDS` and the guild atom; no sentence is quoted.
 *
 * @enforced-by this test
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { TRADE_LINE_BANDS, deriveEconomicSituationDesc } from '../../src/generators/economy/prosperity.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { guildHouseStands } from '../../src/domain/facts/guild.js';
import { FORTUNE_LAW_CONFIG_KEY, SIZE_RELATIVE_FORTUNE_LAW_VERSION } from '../../src/domain/fortune/fortuneLaw.js';

const SIZES = ['thorp', 'hamlet', 'village'];
/** A slow and a busy output band: the label re-keys the first, the band picks the second. */
const ECONOMY = [25, 92];
const PER_CELL = 20;
/** The guild atom's own word, as the line names it. */
const NAMES_GUILDS = /\bguilds?\b/i;

/** @param {string} line @returns {string|undefined} the band the agreement arm reads a trade line as */
const bandOf = (line) => TRADE_LINE_BANDS.find(([opening]) => opening.test(line))?.[1];
/** The stored line recomputed from the record under a config with the marker set to `v`, or taken off (`null`).
 *  @param {any} s @param {number|null} v */
const tradeLineUnder = (s, v) => {
  const { [FORTUNE_LAW_CONFIG_KEY]: _held, ...rest } = s.config;
  const config = v === null ? rest : { ...rest, [FORTUNE_LAW_CONFIG_KEY]: v };
  const e = s.economicState;
  return deriveEconomicSituationDesc({ ...config, tradeRouteAccess: e.tradeAccess ?? config.tradeRouteAccess }, s.tier, s.institutions, e.foodSecurity, e.prosperity);
};

/** @type {any[]} */
const born = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (const economy of ECONOMY) for (let i = 0; i < PER_CELL; i += 1) {
    born.push(generateSettlementPipeline(
      { ...birthConfig({ ...DEFAULT_CONFIG, settType: size, priorityEconomy: economy }), [FORTUNE_LAW_CONFIG_KEY]: SIZE_RELATIVE_FORTUNE_LAW_VERSION },
      null, { seed: `u4f-${size}-${economy}-${i}`, customContent: {} },
    ));
  }
}, 240_000);

describe('FS7 F2: the trade line names no guild where none stands (law 2 only)', () => {
  it('(a) LIT: where law 1 prints the high band\'s guild line at a guildless place, law 2 prints its twin: no guilds, the same band', () => {
    const cases = born.filter((s) => factsOf(s).guild !== true && bandOf(tradeLineUnder(s, null)) === 'high' && NAMES_GUILDS.test(tradeLineUnder(s, null)));
    expect(cases.length, 'the arm reads at least one such birth').toBeGreaterThan(0);
    for (const s of cases) {
      const line = String(s.economicState.situationDesc);
      // anchored: the case set is chosen where the law-1 line names the guilds, and the next assertion reads this line's band
      expect(line, `${s.name} (${s.tier}, ${s.economicState.prosperity})`).not.toMatch(NAMES_GUILDS);
      expect(bandOf(line), s.name).toBe('high');
    }
  });

  it('(a2) LIT: a place that holds a guild house keeps the line that names it', () => {
    const housed = born.filter((s) => guildHouseStands(s) && bandOf(tradeLineUnder(s, null)) === 'high' && NAMES_GUILDS.test(tradeLineUnder(s, null)));
    for (const s of housed) expect(String(s.economicState.situationDesc), s.name).toBe(tradeLineUnder(s, null));
  });

  it('(b) DARK: without the marker the same records print today\'s line, and an explicit 1 is the marker-less world', () => {
    for (const s of born) {
      const law1 = tradeLineUnder(s, null);
      expect(tradeLineUnder(s, 1), s.name).toBe(law1);
      if (!NAMES_GUILDS.test(law1)) expect(String(s.economicState.situationDesc), s.name).toBe(law1);
    }
    expect(born.some((s) => factsOf(s).guild !== true && NAMES_GUILDS.test(tradeLineUnder(s, null))), 'law 1 still names the guilds').toBe(true);
  });
});
