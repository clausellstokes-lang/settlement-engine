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

  it.each([2, 3, 7, 8])('soak1k-%i: every "behind / in the shadow of" names a stronger power', (i) => {
    const factions = born[i].powerStructure.factions;
    let read = 0;
    for (const f of factions) {
      for (const { re, rel } of FRAMES) {
        const m = re.exec(f.desc || '');
        if (!m) continue;
        const target = resolveNamed(factions, m[1]);
        expect(target, `${f.faction} names "${m[1]}", which is not on the roster`).toBeTruthy();
        if (rel === 'above') expect(target.power, `${f.faction} (${f.power}) "${m[0]}" above ${target.faction} (${target.power})`).toBeGreaterThan(f.power);
        else expect(target.power, `${f.faction} (${f.power}) "${m[0]}" beside ${target.faction} (${target.power})`).toBeGreaterThanOrEqual(f.power);
        read += 1;
      }
    }
    expect(read).toBeGreaterThanOrEqual(0);
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
  it.each([
    ['thorp', { priorityEconomy: 80 }, 'Household Council'],
    ['thorp', { priorityMilitary: 80 }, "Headman's Authority"],
    ['thorp', { priorityReligion: 80 }, 'Priestly Guidance'],
    ['town', { priorityEconomy: 40, priorityMilitary: 40 }, 'Town Mayor'],
  ])('a %s seated as %j prints its own line (%s)', (tier, prio, seat) => {
    const config = { priorityMilitary: 20, priorityReligion: 20, priorityEconomy: 20, priorityCriminal: 10, priorityMagic: 10, tradeRouteAccess: 'road', ...prio };
    const result = generatePowerStructure(tier, { prosperity: 'Moderate' }, null, config, []);
    const gov = result.factions.find((f) => f.isGoverning);
    expect(gov?.faction).toBe(seat);
    expect(gov.desc.startsWith(MIXED), gov.desc).toBe(false);
  });

  it.each([7, 8])('soak1k-%i: the governing card does not claim "no clear dominant authority"', async (i) => {
    await ensureLaws();
    const gov = birth(i).settlement.powerStructure.factions.find((/** @type {any} */ f) => f.isGoverning);
    expect(gov.desc).not.toContain('without a clear dominant authority');
  }, 60_000);
});

describe('SW-B1 · §2·D #7: one card governs — the noble houses name the seat they stand behind', () => {
  it.each([4, 10])('soak1k-%i: no non-governing card claims to be "the governing authority here"', async (i) => {
    await ensureLaws();
    const factions = birth(i).settlement.powerStructure.factions;
    const gov = factions.find((/** @type {any} */ f) => f.isGoverning);
    for (const f of factions) if (!f.isGoverning) expect(f.desc, f.faction).not.toMatch(/the governing authority here/);
    const noble = factions.find((/** @type {any} */ f) => /^Hereditary landowners behind the /.test(f.desc || ''));
    if (noble) expect(noble.desc).toContain(`behind the ${gov.faction};`);
  }, 60_000);
});
