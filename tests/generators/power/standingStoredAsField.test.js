/**
 * tests/generators/power/standingStoredAsField.test.js — A5 (the tenth chair's BIRTH-2; RULING G1; intake item 13): THE
 * STANDING SENTENCE STORED AS ITS OWN FIELD AT BIRTH.
 *
 * Every power of a place born from now on holds its standing sentence as `dmStanding` (a string; '' where the power has
 * none), BESIDE its description, which keeps the sentence at its end exactly as before: no reader changes. The field is
 * DM-only by its name: today's public projection drops it (`publicSafe.js :: PRIVATE_KEY_RE`, `\bdm`; its SQL twin's
 * `\m(dm|gm)`). An OLD record holds no field, and no load adds one.
 *
 *   (a) RED FIRST: births of the close's two corpora (C dp-city-0, dp-town-3; V dp-metropolis-1, dp-village-0): every
 *       power holds the field; a description ends with its non-empty field; and THE ORACLE IS THE WRITER: the field equals
 *       the text `annotateFactionStanding` appends, read off the description before and after it, on a fresh roster.
 *   (b) the player's projection holds no `dmStanding` at any depth; the key matches PRIVATE_KEY_RE.
 *   (c) the load: a new record keeps its field through `normalizeSettlement`; an old record (the key removed) comes back
 *       byte-equal, with no field added.
 *   (d) the rename applies to the field as to the description (`factionRename.js :: applyFactionRenameToSettlement`).
 * The proof over every birth of C and V is `docs/chair/2026-11-24/tenth/gen/birth-2/probes/a5proof.census.jsx`.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { annotateFactionStanding } from '../../../src/generators/power/factionStanding.js';
import { toPublicSafe, PRIVATE_KEY_RE } from '../../../src/domain/display/publicSafe.js';
import { normalizeSettlement } from '../../../src/domain/normalizeSettlement.js';
import { applyFactionRenameToSettlement } from '../../../src/domain/factionRename.js';

/** @param {string} seed @param {'C'|'V'} corpus */
function birth(seed, corpus) {
  const settType = seed.split('-')[1];
  const config = corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true };
  return generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
}
const CASES = Object.freeze([['dp-city-0', 'C'], ['dp-town-3', 'C'], ['dp-metropolis-1', 'V'], ['dp-village-0', 'V']]);
/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const [seed, corpus] of CASES) births[`${corpus} ${seed}`] = birth(seed, corpus);
}, 180000);

/** Every `dmStanding` key at any depth. @param {unknown} v */
const keysAnywhere = (v) => { let n = 0; JSON.stringify(v, (k, x) => { if (k === 'dmStanding') n += 1; return x; }); return n; };

describe('A5 (a): every power of a new place holds its standing as its own field', () => {
  it.each(CASES)('%s (%s): a string on every power; the description ends with it', (seed, corpus) => {
    const powers = births[`${corpus} ${seed}`].powerStructure.factions;
    expect(powers.length).toBeGreaterThan(0);
    for (const f of powers) {
      expect(typeof f.dmStanding, f.faction).toBe('string');
      if (f.dmStanding) expect(String(f.desc).endsWith(f.dmStanding), f.faction).toBe(true);
    }
    expect(powers.some((/** @type {any} */ f) => f.dmStanding)).toBe(true);
  });

  it('the oracle is the writer: on a fresh roster the field is exactly the text it appends', () => {
    const roster = [
      { faction: 'Town Council', power: 40, isGoverning: true, desc: 'The council sits in the hall.' },
      { faction: 'Merchant Guild', power: 30, desc: 'The guild keeps the scales.' },
      { faction: 'Craft Guild', power: 20, desc: '' },
      { faction: 'Thieves Guild', power: 10, desc: 'Nobody admits to knowing them.' },
    ];
    const before = roster.map((f) => f.desc);
    annotateFactionStanding(roster);
    roster.forEach((f, i) => {
      const appended = f.desc.slice(before[i].length).trim();
      expect(/** @type {any} */ (f).dmStanding, f.faction).toBe(appended);
    });
    expect(roster.some((f) => /** @type {any} */ (f).dmStanding)).toBe(true);
  });
});

describe('A5 (b): the field is DM-only by its name', () => {
  it('the key matches the public projection\'s private-key rule', () => {
    expect(PRIVATE_KEY_RE.test('dmStanding')).toBe(true);
  });
  it.each(CASES)('%s (%s): the player\'s projection holds no dmStanding at any depth', (seed, corpus) => {
    const s = births[`${corpus} ${seed}`];
    expect(keysAnywhere(s)).toBeGreaterThan(0);
    expect(keysAnywhere(toPublicSafe(s))).toBe(0);
  });
});

describe('A5 (c): a load neither adds nor drops the field', () => {
  it.each(CASES)('%s (%s): new keeps it; old (the key removed) comes back byte-equal', (seed, corpus) => {
    const json = JSON.stringify(births[`${corpus} ${seed}`]);
    expect(JSON.stringify(normalizeSettlement(JSON.parse(json)))).toBe(json);
    const old = JSON.stringify(JSON.parse(json, (k, x) => (k === 'dmStanding' ? undefined : x)));
    const loaded = normalizeSettlement(JSON.parse(old));
    expect(JSON.stringify(loaded)).toBe(old);
    expect(keysAnywhere(loaded)).toBe(0);
  });
});

describe('A5 (d): the rename applies to the field as to the description', () => {
  it('a power named in another power\'s standing is renamed in both, and the description still ends with its field', () => {
    for (const [seed, corpus] of CASES) {
      const s = structuredClone(births[`${corpus} ${seed}`]);
      const powers = s.powerStructure.factions;
      const named = powers.find((/** @type {any} */ f) => powers.some((/** @type {any} */ g) => g !== f && g.dmStanding.includes(f.faction)));
      if (!named) continue;
      const oldName = named.faction;
      const holder = powers.find((/** @type {any} */ g) => g !== named && g.dmStanding.includes(oldName));
      const { changed, touched } = applyFactionRenameToSettlement(s, oldName, 'The Lantern House');
      expect(changed).toBe(true);
      expect(touched).toContain('powerStructure.factions[].dmStanding');
      expect(holder.dmStanding.includes(oldName)).toBe(false);
      expect(holder.dmStanding.includes('Lantern House')).toBe(true);
      expect(String(holder.desc).endsWith(holder.dmStanding)).toBe(true);
      return;
    }
    throw new Error('no case names one power in another power\'s standing');
  });
});
