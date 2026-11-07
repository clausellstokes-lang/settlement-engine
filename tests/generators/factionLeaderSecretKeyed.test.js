/**
 * CENSUS-1i unit 3 (R-AX, refined at 09:3x): BOTH rolls of the criminal secret read the holder.
 * The TYPE roll is drawn over the full weights as before; a type with no admitted row for this
 * holder (its rows keyed to another role, e.g. a non-clergy holder's religious type in a world
 * that bars the visions line) resolves — with no further roll — to an admitted type, the same roll
 * re-mapped inside that band; the ROW draw reads `criminalSecretsForHolder` (CENSUS-4g's keyed
 * view, historic order). The personal fallback stays for a pool empty for every holder. A holder
 * whose draw matches its role is unchanged; an unknown holder (no role) reads the flat view.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { generateFactionLeaderSecret } from '../../src/generators/npc/factionLeaderSecret.js';
import { NPC_CRIMINAL_SECRETS, NPC_CRIMINAL_SECRETS_BY_HOLDER } from '../../src/data/npcData.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

afterEach(() => clearActiveRng());

const keyed = (/** @type {'clergy'|'military'} */ cls) => new Set(Object.values(NPC_CRIMINAL_SECRETS_BY_HOLDER[cls]).flat().map((r) => r.secret));
const CLERGY = keyed('clergy'); const MILITARY = keyed('military');
const PERSONAL = new Set(NPC_CRIMINAL_SECRETS.personal.map((r) => r.secret));
const CONFIG_OFF = { magicExists: false, priorityReligion: 90, priorityMilitary: 80, stressTypes: ['religious_conversion'] };
const INSTITUTIONS = [{ name: 'Temple', category: 'Religious' }];

const draw = (/** @type {string} */ seed, /** @type {string|undefined} */ role, config = CONFIG_OFF) => {
  setActiveRng(createPRNG(seed));
  const s = generateFactionLeaderSecret(config, INSTITUTIONS, null, role);
  clearActiveRng();
  return s.secret;
};
const SEEDS = Array.from({ length: 600 }, (_, i) => `rax-${i}`);

describe('R-AX: the criminal secret\'s two rolls read the holder (CENSUS-1i unit 3)', () => {
  it('(a) a holder never draws a row keyed to another role', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const mayor = draw(seed, 'Mayor');
      expect(CLERGY.has(mayor) || MILITARY.has(mayor), `${seed} Mayor: ${mayor}`).toBe(false);
      expect(CLERGY.has(draw(seed, 'Watch Captain')), seed).toBe(false);
      expect(MILITARY.has(draw(seed, 'High Priestess')), seed).toBe(false);
    });
    expectNoSeedFailures(failures, 'no holder draws a row keyed to another role');
  });

  it('(b) a religious roll by a non-clergy holder in a visions-barred world is re-mapped over the admitted types, not dropped to the personal secrets', () => {
    // The weights here (magic off, religion 90, a conversion): religious ~7.41 of ~17.95. Dropping a
    // refused religious roll to the personal fallback would give the personal rows ~(1.5 + 7.41) /
    // 17.95 = 50% of draws; re-mapping inside the band gives 1.5 / 10.54 = 14%.
    const share = SEEDS.filter((s) => PERSONAL.has(draw(s, 'Mayor'))).length / SEEDS.length;
    expect(share).toBeGreaterThan(0.08);
    expect(share).toBeLessThan(0.25);
  });

  it('(c) a matching holder is unchanged: a clergy holder\'s draw that the flat view gave a clerical or role-free non-military row', () => {
    let compared = 0;
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const flat = draw(seed, undefined);
      if (MILITARY.has(flat)) return;
      const anyMilitary = new Set(NPC_CRIMINAL_SECRETS_BY_HOLDER.any.military.map((r) => r.secret));
      if (anyMilitary.has(flat)) return;
      expect(draw(seed, 'High Priestess'), seed).toBe(flat);
      compared += 1;
    });
    expectNoSeedFailures(failures, 'a matching holder keeps the flat view\'s draw');
    expect(compared).toBeGreaterThan(400);
  });

  it('(d) no role: the flat view, byte-identical to the unkeyed draw', () => {
    const failures = collectSeedFailures(SEEDS.slice(0, 50), (seed) => { expect(draw(seed, undefined), seed).toBe(draw(seed, undefined)); });
    expectNoSeedFailures(failures, 'no role draws the flat view, byte-identical');
  });
});
