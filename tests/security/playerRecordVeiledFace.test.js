/**
 * playerRecordVeiledFace.test.js — A PLAYER-VIEW READER PRINTS NOTHING OF A VEILED FACE'S HOUSE
 * (COHERENCE-VEIL; the chair's ruling 7 of 2026-11-12 on COHERENCE-POWERS's flag).
 *
 * THE FLAG. The player record (src/domain/display/publicSafe.js :: publicVeiledRecordOf), which the
 * audience-gated readers draw from in the player view and when a save composes its public text,
 * strips a veiled face's own title and role but KEEPS its `institution` (the house's key and title)
 * and its `memberships`. Measured in phase 1: no response and no page carries them, and no reader
 * prints them today. This is a GUARD, not a cure (publicSafe.js is not changed): it goes red the day
 * a player-view reader prints any of the four.
 *
 * HOW. Generated towns with veiled faces (the generator's own `institution.veiled: true`); on each
 * veiled face a SENTINEL is planted in the house's key and title, the card's title and role, and
 * every membership's power. Each reader that draws from the player record is executed in the player
 * view; its output must hold no sentinel. THE REGISTER: the modules that import the player record are
 * exactly those executed here — a new one is red until it is executed here too.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const BROWSER = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
const TOWNS = Object.freeze([
  { seed: 'server-veil-village-3', settType: 'village' },
  { seed: 'server-veil-town-2', settType: 'town' },
  { seed: 'server-veil-city-2', settType: 'city' },
  { seed: 'server-veil-city-infiltrated-0', settType: 'city', stressTypes: ['infiltrated'], selectedStressesRandom: false },
  { seed: 'server-veil-metropolis-3', settType: 'metropolis' },
]);
const SENTINEL = 'SENTINEL-VEILED-HOUSE';

/** Plant the sentinel on every veiled face: its house's key and title, its title and role, its memberships. */
function plant(rec) {
  const s = JSON.parse(JSON.stringify(rec));
  let faces = 0;
  for (const [i, n] of (s.npcs || []).entries()) {
    if (!n?.institution || n.institution.veiled !== true) continue;
    faces += 1;
    n.institution = { ...n.institution, key: `${SENTINEL}-KEY-${i}`, title: `${SENTINEL}-TITLE-${i}` };
    n.title = `${SENTINEL}-CARD-TITLE-${i}`;
    n.role = `${SENTINEL}-ROLE-${i}`;
    n.memberships = [...(Array.isArray(n.memberships) ? n.memberships : []), { power: `${SENTINEL}-POWER-${i}`, rank: 'member', share: 0.1, veiled: true }]
      .map((m, j) => ({ ...m, power: `${SENTINEL}-POWER-${i}-${j}` }));
  }
  return { s, faces };
}

describe('a player-view reader prints nothing of a veiled face\'s house (the guard on the player record)', () => {
  /** @type {any[]} */ let towns = [];
  /** @type {any} */ let R;
  beforeAll(async () => {
    const { generateSettlementPipeline: gen } = await import('../../src/generators/generateSettlementPipeline.js');
    towns = TOWNS.map(({ seed, ...cfg }) => ({ seed, ...plant(gen({ ...BROWSER, ...cfg }, null, { seed, customContent: {} })) }));
    R = {
      ...(await import('../../src/domain/display/publicSafe.js')),
      ...(await import('../../src/components/new/publicProseCompose.js')),
      ...(await import('../../src/components/new/powerDeskRead.js')),
      ...(await import('../../src/components/new/defenseDeskRead.js')),
    };
  }, 180_000);

  it('the plant is live: the towns hold veiled faces, and the player record still carries the sentinel', () => {
    expect(towns.reduce((a, t) => a + t.faces, 0)).toBeGreaterThan(10);
    for (const t of towns.filter((x) => x.faces)) {
      expect(JSON.stringify(R.publicVeiledRecordOf(t.s)), t.seed).toContain(`${SENTINEL}-TITLE-`);
    }
  });

  it('no player-view reader prints a sentinel', () => {
    for (const t of towns) {
      const veiledRecord = R.publicVeiledRecordOf(t.s);
      const outputs = {
        composePublicProse: R.composePublicProse(t.s),
        powerDeskRead: R.powerDeskRead(t.s, { playerView: true }),
        powerDeskReadWithRecord: R.powerDeskRead(t.s, { playerView: true, veiledRecord }),
        governanceAccountRead: R.governanceAccountRead(t.s, { playerView: true }),
        defenseDeskRead: R.defenseDeskRead(t.s, { playerView: true }),
      };
      for (const [reader, out] of Object.entries(outputs)) {
        const text = JSON.stringify(out) ?? '';
        expect(text.length, `${t.seed} ${reader} said something`).toBeGreaterThan(2);
        // anchored: the arm above proves the record these readers draw from carries the sentinel
        expect(text, `${t.seed} ${reader}`).not.toContain(SENTINEL);
      }
    }
  });

  it('THE GUARD CATCHES A LEAK: a planted reader that prints the record\'s house title is caught by the same check', () => {
    const t = towns.find((x) => x.faces);
    const leaky = (settlement) => (R.publicVeiledRecordOf(settlement).npcs || [])
      .filter((n) => n?.institution?.title).map((n) => `${n.name} of ${n.institution.title}`).join('; ');
    expect(JSON.stringify(leaky(t.s))).toContain(SENTINEL);
  });

  it('THE REGISTER: every module that imports the player record is executed above', () => {
    const EXECUTED = ['src/components/new/defenseDeskRead.js', 'src/components/new/powerDeskRead.js',
      'src/components/new/publicProseCompose.js', 'src/domain/display/publicSafe.js'];
    const found = [];
    const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(js|jsx|ts|tsx)$/.test(e.name) && readFileSync(p, 'utf-8').includes('publicVeiledRecordOf')) found.push(p.slice(process.cwd().length + 1));
    } };
    walk(resolve(process.cwd(), 'src'));
    expect(found.sort()).toEqual(EXECUTED);
  });
});
