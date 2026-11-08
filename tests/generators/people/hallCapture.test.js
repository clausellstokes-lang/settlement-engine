/**
 * tests/generators/people/hallCapture.test.js — THE HALL-CAPTURE STATE, DERIVED (the allegiance train, car 2,
 * ALLEGIANCE-CAR2, 2026-11-08; docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md §3.4, §4 I-1; the chair's J-13).
 *
 * Written FIRST, red-first (the brief §2): the I-1 arm reads the RECORD's raw fields — not the module under
 * test — so it ran at car 1's tip (7395b5dab), where the state was the strengths-only classifier and the soak
 * slice held 4 'corrupted' halls with no agent in the ruling three and no criminal governing power (towns
 * 154, 160, 221, 232); every check reds on a planted violation (its control), so a green arm proves the check
 * is live, not that there was nothing to look at.
 *
 *   I-1  a captured or corrupted hall has a criminal in the ruling three — an agent (a card holding an
 *        allegiance, ranked 1–3 in the governing power) or a criminal governing power; a 'capture' hall's
 *        lord is an agent;
 *   J-13 ONE writer: on the birth path (src/generators, src/domain/people) `criminalCaptureState` and the
 *        governing row's `captureState` seed are written at exactly one site, domain/people/hallCapture.js ::
 *        writeHallCapture;
 *   and the derivation's rungs (§3.4) on small fixtures, and the soak kind `coh:capture-without-agent`'s control.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';
import { captureWithoutAgentFindings } from '../../../scripts/audit/soak-review/checks.mjs';

/** The soak slice: the cities and metropolises of the soak 1,000's first 240 (index ≡ 4, 5 mod 6). */
const SLICE = Array.from({ length: 240 }, (_, i) => i).filter((i) => i % 6 === 4 || i % 6 === 5);
/** @type {Map<number, any>} */
const BORN = new Map();
async function born() {
  await ensureLaws();
  for (const i of SLICE) if (!BORN.has(i)) BORN.set(i, birth(i).settlement);
  return SLICE.map((i) => ({ i, s: BORN.get(i) }));
}

/**
 * I-1 by the raw record (independent of the soak check and of the module under test).
 * @param {any} s @returns {string[]}
 */
function hallFindings(s) {
  const state = s?.powerStructure?.criminalCaptureState;
  const gov = (s?.powerStructure?.factions || []).find((f) => f?.isGoverning);
  const ruler = gov ? String(gov.faction || gov.name) : null;
  const agentRanks = (s?.npcs || [])
    .filter((n) => n?.allegiance && typeof n.allegiance === 'object' && n.allegiance.house)
    .map((n) => (n.memberships || []).find((m) => m?.power === ruler && [1, 2, 3].includes(m?.rank))?.rank)
    .filter(Boolean);
  const rulerCriminal = !!gov && (String(gov.category || '').toLowerCase() === 'criminal' || /thie/i.test(ruler || ''));
  const out = [];
  if ((state === 'capture' || state === 'corrupted') && !agentRanks.length && !rulerCriminal) out.push(`I-1: '${state}' with no criminal in the ruling three`);
  if (state === 'capture' && !agentRanks.includes(1)) out.push(`I-1: 'capture' with no agent lord`);
  return out;
}

describe('I-1 — a captured or corrupted hall has a criminal in the ruling three', () => {
  it('over the soak slice, by the raw record: 0 findings, and the soak kind agrees', async () => {
    const rows = await born();
    const found = rows.flatMap(({ i, s }) => hallFindings(s).map((f) => `${i} ${f}`));
    const soak = rows.flatMap(({ i, s }) => captureWithoutAgentFindings(s).map((f) => `${i} ${f.detail}`));
    expect(found).toEqual([]);
    expect(soak).toEqual([]);
    // anti-vacuity: the slice holds halls the agents moved (an agent in the ruling three) and corrupted halls
    const withAgents = rows.filter(({ s }) => (s.npcs || []).some((n) => n?.allegiance
      && (n.memberships || []).some((m) => m?.power === (s.powerStructure.factions.find((f) => f.isGoverning) || {}).faction && [1, 2, 3].includes(m?.rank))));
    expect(withAgents.length).toBeGreaterThan(5);
    expect(rows.filter(({ s }) => ['corrupted', 'capture'].includes(s.powerStructure.criminalCaptureState)).length).toBeGreaterThan(2);
  }, 120_000);

  it('the control: a planted strengths-only capture reds both checks', async () => {
    const rows = await born();
    const clean = rows.find(({ s }) => !(s.npcs || []).some((n) => n?.allegiance) && !/thie/i.test(String(s.powerStructure.governingName || '')));
    expect(clean).toBeTruthy();
    const planted = { ...clean.s, powerStructure: { ...clean.s.powerStructure, criminalCaptureState: 'capture' } };
    expect(hallFindings(planted).length).toBeGreaterThan(0);
    expect(captureWithoutAgentFindings(planted).length).toBe(1);
    const corrupted = { ...clean.s, powerStructure: { ...clean.s.powerStructure, criminalCaptureState: 'corrupted' } };
    expect(hallFindings(corrupted).length).toBe(1);
    expect(captureWithoutAgentFindings(corrupted).length).toBe(1);
  }, 120_000);

  it('the derivation is the record\'s: re-reading a born record returns its stored state, and a capture hall is an agent lord\'s', async () => {
    const { hallCaptureOf } = await import('../../../src/domain/people/hallCapture.js');
    const rows = await born();
    for (const { i, s } of rows) {
      const hall = hallCaptureOf(s);
      expect(`${i} ${hall.state}`).toBe(`${i} ${s.powerStructure.criminalCaptureState}`);
      if (hall.state === 'capture') expect(hall.agents.some((a) => a.rank === 1)).toBe(true);
      expect(typeof hall.receipt).toBe('string');
      expect(hall.receipt.startsWith(`${hall.state[0].toUpperCase()}${hall.state.slice(1)}: `)).toBe(true);
    }
  }, 120_000);
});

describe('the derivation (§3.4) on fixtures', () => {
  const powers = (gov = { faction: 'Elder Council', category: 'government', power: 40, isGoverning: true }) => ({
    factionRelationships: [], factions: [gov, { faction: "Thieves' Guild", category: 'criminal', power: 20 }],
  });
  const agent = (id, rank, extra = {}) => ({
    id, name: `Card ${id}`, memberships: [{ power: 'Elder Council', rank, share: 1 }],
    allegiance: { power: "Thieves' Guild", house: 'Rookery', vector: 'greed', via: 'office', handler: 'h', share: 0.15, veiled: true, covert: true },
    ...extra,
  });
  const clean = (id, rank) => ({ id, name: `Card ${id}`, memberships: [{ power: 'Elder Council', rank, share: 1 }] });

  it('the agent rung: capture (lord + second), corrupted (lord alone; second + third; criminal ruler), equilibrium (one lesser), none', async () => {
    const { hallCaptureOf } = await import('../../../src/domain/people/hallCapture.js');
    const at = (npcs, climate = 'none', ps = powers()) => hallCaptureOf({ npcs, powerStructure: ps }, { climate });
    expect(at([agent('a', 1), agent('b', 2), clean('c', 3)]).state).toBe('capture');
    expect(at([agent('a', 1), clean('b', 2), agent('c', 3)]).state).toBe('corrupted'); // 3 + 1 = 4 < 5
    expect(at([agent('a', 1), clean('b', 2), clean('c', 3)]).state).toBe('corrupted');
    expect(at([clean('a', 1), agent('b', 2), agent('c', 3)]).state).toBe('corrupted');
    expect(at([clean('a', 1), agent('b', 2), clean('c', 3)]).state).toBe('equilibrium');
    expect(at([clean('a', 1), clean('b', 2), agent('c', 3)]).state).toBe('equilibrium');
    expect(at([clean('a', 1), clean('b', 2), clean('c', 3)]).state).toBe('none');
    const council = { faction: 'Corrupt Council', category: 'criminal', power: 40, isGoverning: true };
    expect(at([], 'none', powers(council)).state).toBe('corrupted');
    // an agent outside the ruling three does not count
    expect(at([clean('a', 1), clean('b', 2), clean('c', 3), { ...agent('d', null) }]).state).toBe('none');
  });

  it('the climate rung is capped at equilibrium: strengths alone never reach corrupted or capture', async () => {
    const { hallCaptureOf } = await import('../../../src/domain/people/hallCapture.js');
    const at = (climate) => hallCaptureOf({ npcs: [clean('a', 1)], powerStructure: powers() }, { climate });
    expect(at('capture').state).toBe('equilibrium');
    expect(at('corrupted').state).toBe('equilibrium');
    expect(at('equilibrium').state).toBe('equilibrium');
    expect(at('adversarial').state).toBe('adversarial');
    expect(at('none').state).toBe('none');
    // the max of the two rungs
    const both = hallCaptureOf({ npcs: [clean('a', 1), agent('b', 2)], powerStructure: powers() }, { climate: 'adversarial' });
    expect([both.agentRung, both.climateRung, both.state]).toEqual(['equilibrium', 'adversarial', 'equilibrium']);
  });

  it('the receipt names the rung and who answers to whom, in one plain line', async () => {
    const { hallCaptureOf } = await import('../../../src/domain/people/hallCapture.js');
    const hall = hallCaptureOf({ npcs: [clean('a', 1), agent('b', 2), agent('c', 3)], powerStructure: powers() }, { climate: 'none' });
    expect(hall.receipt).toBe("Corrupted: The second and the third of Elder Council answer to Thieves' Guild.");
    expect(hall.receipt.split('\n')).toHaveLength(1);
  });

  it('the one writer: the state after factionRelationships, the governing row seeded at equilibrium and above, the input untouched', async () => {
    const { writeHallCapture } = await import('../../../src/domain/people/hallCapture.js');
    const ps = { factions: [{ faction: 'Elder Council', isGoverning: true, powerLabel: 'Strong', legitimacyCrisis: false }, { faction: 'X' }], factionRelationships: [], powerProjectionVersion: 1 };
    const frozen = JSON.stringify(ps);
    const out = /** @type {any} */ (writeHallCapture(ps, { state: 'corrupted' }));
    expect(JSON.stringify(ps)).toBe(frozen);
    expect(Object.keys(out)).toEqual(['factions', 'factionRelationships', 'criminalCaptureState', 'powerProjectionVersion']);
    expect(Object.keys(out.factions[0])).toEqual(['faction', 'isGoverning', 'powerLabel', 'captureState', 'legitimacyCrisis']);
    expect(out.factions[0].captureState).toBe('corrupted');
    expect(out.factions[1]).toBe(ps.factions[1]);
    const low = /** @type {any} */ (writeHallCapture(ps, { state: 'adversarial' }));
    expect(low.criminalCaptureState).toBe('adversarial');
    expect('captureState' in low.factions[0]).toBe(false);
  });
});

describe('J-13 — ONE writer of the hall-capture state on the birth path', () => {
  const ROOT = join(__dirname, '../../..');
  /** @param {string} dir @returns {string[]} */
  const walk = (dir) => readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : (/\.(js|jsx|mjs)$/.test(name) ? [p] : []);
  });
  /** a WRITE of the state: an assignment, an object key, a shorthand property, or the key as a literal (a computed write) */
  const STATE_WRITE = /(\.criminalCaptureState\s*=(?!=))|((?<![.?\w])criminalCaptureState\s*:)|(^\s*criminalCaptureState\s*,)|(['"`]criminalCaptureState['"`])/;
  /** a WRITE of the governing row's seed: an assignment, or the key as a literal (a computed write) */
  const SEED_WRITE = /(\.captureState\s*=(?!=))|(['"`]captureState['"`])/;
  /** code only: a whole-line comment, a JSDoc line and a trailing // comment are not code */
  const code = (line) => (/^\s*(\*|\/\/|\/\*)/.test(line) ? '' : line.replace(/\s\/\/.*$/, ''));
  /**
   * The exemptions, each with its reason. factionDynamics.js's relation rows carry the CLASSIFIER's verdict as their
   * own field (`factionRelationships[].captureState`, an object key, not this scan's form) — the chair's ruling on car
   * 2's STOP 3 governs it.
   */
  const SITES = (re) => [join(ROOT, 'src/generators'), join(ROOT, 'src/domain/people')].flatMap(walk).flatMap((file) =>
    readFileSync(file, 'utf8').split('\n').map((line, n) => ({ file: relative(ROOT, file), n: n + 1, line: code(line) }))
      .filter((x) => re.test(x.line)).map((x) => `${x.file}:${x.line.trim()}`));

  it('criminalCaptureState is written at exactly one site, hallCapture.js :: writeHallCapture', () => {
    const sites = SITES(STATE_WRITE);
    expect(sites).toHaveLength(1);
    expect(sites[0].startsWith('src/domain/people/hallCapture.js:')).toBe(true);
  });

  it('the governing row\'s captureState seed is written at exactly one site, the same function', () => {
    const sites = SITES(SEED_WRITE);
    expect(sites).toHaveLength(1);
    expect(sites[0].startsWith('src/domain/people/hallCapture.js:')).toBe(true);
  });

  it('the control: each scan finds a planted second writer', () => {
    expect(STATE_WRITE.test(code('  powerStructure.criminalCaptureState = projected.criminalCaptureState;'))).toBe(true);
    expect(STATE_WRITE.test(code('    criminalCaptureState,'))).toBe(true);
    expect(STATE_WRITE.test(code('  return { ...ps, criminalCaptureState: cap };'))).toBe(true);
    expect(STATE_WRITE.test(code('  const crimCap = settlement.powerStructure?.criminalCaptureState || \'none\';'))).toBe(false);
    expect(SEED_WRITE.test(code('    if (govEntry && !govEntry.captureState) govEntry.captureState = criminalCaptureState;'))).toBe(true);
    expect(SEED_WRITE.test(code("  'captureState',"))).toBe(true);
    expect(SEED_WRITE.test(code('  if (faction.captureState === x) return;'))).toBe(false);
  });
});
