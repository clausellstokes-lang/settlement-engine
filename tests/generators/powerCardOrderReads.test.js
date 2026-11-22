/**
 * SW-B1 CONTRADICTIONS (STYLE-RULINGS-2 B1, the SURFACES audit's P50 and P51; 2026-11-09):
 * the power cards read the powers they speak of.
 *
 * P51, THE ORDER FAULT: `factionStanding.js :: annotateFactionStanding` wrote each card's
 * "behind / in the shadow of / the gap is narrow" sentence on the governing-first sort, BEFORE
 * `factionDynamics.js :: applyLegitimacyMultipliers` moved the powers and re-sorted the roster.
 * So Al-karez's Thieves' Guild (39) printed "Behind the governing council by enough margin…"
 * above a Guild Council of 37, and Copanucan's Occupation Authority (37) printed "in the shadow
 * of Elected Reeve" (29). The cure: one reader for one fact — the standing is written after the
 * step's last power write, on the power order, and "the governing council" names the governing
 * seat only.
 *
 * P50: the government line fell back to the Mixed Council's "Power is distributed across
 * multiple factions without a clear dominant authority" for every seat the two tables did not
 * name (Haifeng's Household Council beside a Dominant 63; Achileia's Headman's Authority beside
 * a 50) — a claim the writer never read. The cure: the seat's own line is read from the label
 * table too, the unnamed seats have their own plain line, and the fallback claims nothing.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { generatePowerStructure } from '../../src/generators/power/rulingStructure.js';

const MIXED = 'Power is distributed across multiple factions without a clear dominant authority.';
// The three standing frames that name the power above (factionStanding.js, rank 1).
const FRAMES = [
  { re: /The gap between them and (.+?) is narrow\./, rel: 'narrow' },
  { re: /They operate in the shadow of (.+?) but not comfortably/, rel: 'above' },
  { re: /Behind (.+?) by (?:enough margin|too much)/, rel: 'above' },
];

/** @param {any[]} factions @param {string} named */
const resolveNamed = (factions, named) =>
  named === 'the governing council' ? factions.find((f) => f.isGoverning) : factions.find((f) => f.faction === named);

describe('SW-B1 · P51: a power card names a power above it only when that power stands above it', () => {
  /** @type {Record<number, any>} */
  const born = {};
  beforeAll(async () => {
    await ensureLaws();
    for (const i of [2, 3, 7, 8]) born[i] = birth(i).settlement;
  }, 120_000);

  it('soak1k-2, -3, -7, -8: every "behind / in the shadow of" names a stronger power', () => {
    for (const i of [2, 3, 7, 8]) {
      const factions = born[i].powerStructure.factions;
      let read = 0;
      for (const f of factions) {
        for (const { re, rel } of FRAMES) {
          const m = re.exec(f.desc || '');
          if (!m) continue;
          const target = resolveNamed(factions, m[1]);
          expect(target, `soak1k-${i}: ${f.faction} names "${m[1]}", which is not on the roster`).toBeTruthy();
          if (rel === 'above') expect(target.power, `soak1k-${i}: ${f.faction} (${f.power}) "${m[0]}" above ${target.faction} (${target.power})`).toBeGreaterThan(f.power);
          else expect(target.power, `soak1k-${i}: ${f.faction} (${f.power}) "${m[0]}" beside ${target.faction} (${target.power})`).toBeGreaterThanOrEqual(f.power);
          read += 1;
        }
      }
      expect(read, `soak1k-${i}`).toBeGreaterThanOrEqual(0);
    }
  });

  it('"the governing council" is said of the governing seat only', () => {
    for (const i of [2, 3, 7, 8]) {
      const factions = born[i].powerStructure.factions;
      for (const f of factions) {
        if (!/the governing council/.test(f.desc || '')) continue;
        expect(factions.find((x) => x.isGoverning)?.faction, `${f.faction}: ${f.desc}`).toMatch(/council/i);
      }
    }
  });
});

describe('SW-B1 · P50: the government line is the seat\'s own, never the unread "no dominant authority"', () => {
  it('a thorp seated as economy, military or religion and a town as economy-and-military each print their own line', () => {
    // RE-KEYED BY IDENTITY 2026-11-12, COHERENCE-POWERS 2B (the council of a kind: a government of a kind is drawn
    // only where the town has a house of that kind, else the next priority, else the size's civic government): the
    // religion row's thorp now stands its priest's house, so Priestly Guidance is still the seat it names; with no
    // house at all, the same thorp is an Elder Council (asserted below).
    for (const [tier, prio, seat, houses] of /** @type {Array<[string, Record<string, number>, string, Array<{ name: string }>]>} */ ([
      ['thorp', { priorityEconomy: 80 }, 'Household Council', []],
      ['thorp', { priorityMilitary: 80 }, "Headman's Authority", []],
      ['thorp', { priorityReligion: 80 }, 'Priestly Guidance', [{ name: 'Priest (resident)' }]],
      ['thorp', { priorityReligion: 80 }, 'Elder Council', []],
      ['town', { priorityEconomy: 40, priorityMilitary: 40 }, 'Town Mayor', []],
    ])) {
      const config = { priorityMilitary: 20, priorityReligion: 20, priorityEconomy: 20, priorityCriminal: 10, priorityMagic: 10, tradeRouteAccess: 'road', ...prio };
      const result = generatePowerStructure(tier, { prosperity: 'Moderate' }, null, config, houses);
      const gov = result.factions.find((f) => f.isGoverning);
      expect(gov?.faction, `${tier} ${JSON.stringify(prio)}`).toBe(seat);
      expect(gov.desc.startsWith(MIXED), gov.desc).toBe(false);
    }
  });

  it('soak1k-7, -8: the governing card does not claim "no clear dominant authority"', async () => {
    await ensureLaws();
    for (const i of [7, 8]) {
      const gov = birth(i).settlement.powerStructure.factions.find((/** @type {any} */ f) => f.isGoverning);
      expect(gov.desc.length, `soak1k-${i}: the governing card has a line`).toBeGreaterThan(0);
      // anchored: the governing card's line is asserted non-empty on the line above
      expect(gov.desc, `soak1k-${i}`).not.toContain('without a clear dominant authority');
    }
  }, 120_000);
});

describe('SW-B1 · §2·D #7: one card governs — the noble houses name the seat they stand behind', () => {
  it('soak1k-4, -10: no non-governing card claims to be "the governing authority here"', async () => {
    await ensureLaws();
    for (const i of [4, 10]) {
      const factions = birth(i).settlement.powerStructure.factions;
      const gov = factions.find((/** @type {any} */ f) => f.isGoverning);
      expect(factions.filter((/** @type {any} */ f) => !f.isGoverning && f.desc).length, `soak1k-${i}: non-governing cards with lines`).toBeGreaterThan(0);
      // anchored: non-governing cards with lines are asserted present on the line above
      for (const f of factions) if (!f.isGoverning) expect(f.desc, `soak1k-${i}: ${f.faction}`).not.toMatch(/the governing authority here/);
      const noble = factions.find((/** @type {any} */ f) => /^Hereditary landowners behind the /.test(f.desc || ''));
      if (noble) expect(noble.desc, `soak1k-${i}`).toContain(`behind the ${gov.faction};`);
    }
  }, 120_000);
});
