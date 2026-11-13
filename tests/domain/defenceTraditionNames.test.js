/**
 * defenceTraditionNames.test.js — COHERENCE-UPKEEP-5 (the addendum's SOURCE table): the defence
 * traditions (arcane, divine, druid, wardens, alchemy, tower, guild, teleport) and the small
 * place's community tests (elders, the criminal den) were NAME TESTS inside defenseGenerator.js, a
 * second reading of the roster outside its home. They live in the roster's defence home,
 * `src/domain/institutions/defenseInstitutionBuckets.js`, with the same keywords, and defence asks
 * the home.
 *
 * The reference below is the generator's own `hasInst` as it stood at e1b2f9c1f, copied verbatim,
 * so the home's answers are proven equal to the answers the generator gave.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { nativeSemanticName } from '../../src/domain/content/customContentSemanticAuthority.js';
import { defenseTraditionNamesOf, DEFENSE_TRADITION_KEYWORDS } from '../../src/domain/institutions/defenseInstitutionBuckets.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** e1b2f9c1f's `hasInst`, verbatim. @param {any[]} institutions */
const referenceOf = (institutions) => {
  const hasInst = (...kws) => institutions.some((i) => kws.some((kw) => nativeSemanticName(i).toLowerCase().includes(kw)));
  return {
    arcane: hasInst('wizard', 'mages', 'arcane', 'enchant', 'spellcasting', 'academy of magic', 'mages\' district'),
    arcaneGuild: hasInst('mages\' guild', 'wizard\'s tower', 'arcane academy', 'mages\' district', 'academy of magic'),
    divine: hasInst('cathedral', 'monastery', 'great cathedral', 'parish church'),
    divineShrine: hasInst('shrine', 'temple', 'friary'),
    divineStrong: hasInst('cathedral', 'monastery', 'great cathedral'),
    druid: hasInst('druid circle', 'grove shrine', 'elder grove', 'sacred grove'),
    wardens: hasInst('warden\'s lodge'),
    alchemy: hasInst('alchemist', 'apothecary district', 'alchemist quarter'),
    tower: hasInst('wizard\'s tower'),
    teleport: hasInst('teleportation', 'teleport'),
    elders: hasInst('reeve', 'steward', 'elder', 'household council', 'free elder'),
    criminalDen: hasInst('fence', 'smuggl', 'gang', 'outlaw'),
    actualMagic: hasInst('healer', 'monastery', 'cathedral', 'divine', 'healing', 'druid', 'wizard', 'mage', 'arcane', 'enchant'),
  };
};

const ROSTERS = [
  [],
  [{ name: 'Great Cathedral' }, { name: 'Mages\' Guild' }, { name: 'Wizard\'s Tower' }],
  [{ name: 'Parish church' }, { name: 'Village elder' }, { name: 'Fence' }],
  [{ name: 'Shrine' }, { name: 'Sacred Grove' }, { name: 'Warden\'s Lodge' }, { name: 'Alchemist quarter' }],
  [{ name: 'Teleportation circle' }, { name: 'Healer\'s house' }, { name: 'Smugglers\' den' }],
  [{ name: 'Free elder council' }, { name: 'Outlaw camp' }, { name: 'Temple of the Sun' }, { name: 'Friary' }],
  [{ name: 'Enchanter\'s workshop' }, { name: 'Arcane academy' }, { name: 'Monastery' }],
];

describe('the defence traditions are read by the roster\'s defence home', () => {
  test('the home answers every tradition question as the generator did, on every roster', () => {
    for (const roster of ROSTERS) expect(defenseTraditionNamesOf(roster), JSON.stringify(roster)).toEqual(referenceOf(roster));
    expect(Object.keys(DEFENSE_TRADITION_KEYWORDS).sort()).toEqual(Object.keys(referenceOf([])).sort());
  });

  test('defenseGenerator.js reads no institution name: no nativeSemanticName, no hasInst', () => {
    const src = readFileSync(join(ROOT, 'src/generators/defenseGenerator.js'), 'utf8');
    expect(src).not.toMatch(/nativeSemanticName/);
    expect(src).not.toMatch(/\bhasInst\s*\(/);
  });
});
