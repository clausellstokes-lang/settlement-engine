/**
 * W2-FIX-DATA (2026-11-13) — the institution descriptions the cold list read false (REVIEW-W2B,
 * `docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json`, rows in `institutionalCatalog.js`,
 * `institutionDescColour.js`, `institutionDescVariants.js`), drawn through the real site
 * (`steps/institutionDescDraw.js :: drawInstitutionDesc`) over the real pool (`[catalogue desc, ...variants]`)
 * with the facts a birth hands it (`factsOf.js :: birthFactsOf`): in the town that makes a line false no
 * drawn index prints it, and in the town where it is true the line as written still prints.
 */
import { describe, expect, it } from 'vitest';
import { INSTITUTION_DESC_VARIANTS } from '../../src/data/institutionDescVariants.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { drawInstitutionDesc } from '../../src/generators/steps/institutionDescDraw.js';
import { birthFactsOf } from '../../src/domain/facts/factsOf.js';

/** @param {string} key `tier|category|name` */
const poolOf = (key) => {
  const [tier, cat, name] = key.split('|');
  const row = /** @type {any} */ (institutionalCatalog)[tier][cat][name];
  return [row.desc, ...(INSTITUTION_DESC_VARIANTS[key] || [])];
};

/**
 * Every text the site prints for this pool over 300 seeds.
 * @param {string} key @param {{ houses?: string[], terrain?: string, stress?: string[], port?: 'maritime'|'river'|'none' }} town
 */
const printed = (key, town) => {
  const [tier, , name] = key.split('|');
  const facts = () => birthFactsOf({ institutions: [{ name }, ...(town.houses || []).map((n) => ({ name: n }))], config: { terrainType: town.terrain || 'plains', tradeRouteAccess: 'road', stressTypes: town.stress || [] }, tier }, { portKind: town.port || 'none' });
  const pool = poolOf(key);
  const out = new Set();
  for (let n = 0; n < 300; n++) out.add(String(drawInstitutionDesc(pool, `w2fd${n}:${name}`, facts, key)));
  return [...out];
};

const none = (/** @type {string[]} */ texts, /** @type {RegExp} */ re) => expect(texts.filter((t) => re.test(t))).toEqual([]);
const some = (/** @type {string[]} */ texts, /** @type {RegExp} */ re) => expect(texts.some((t) => re.test(t))).toBe(true);

describe('W2-FIX-DATA: a description prints only where it is true, and the other case has its own line', () => {
  it('the maltster supplies alehouses only where an alehouse stands (c11, c07)', () => {
    for (const key of ['hamlet|Crafts|Maltster', 'village|Crafts|Maltster']) {
      none(printed(key, {}), /alehouse/i);
      some(printed(key, { houses: ['Alehouse'] }), /alehouse/i);
    }
  });
  it('the town watch holds gates only where a gate stands (c16, c19, c20)', () => {
    none(printed('town|Defense|Town watch', {}), /\bgates?\b/i);
    some(printed('town|Defense|Town watch', { houses: ['Town walls'] }), /\bgates?\b/i);
  });
  it('the charcoal burner works the woods only in forest country (c27, c14)', () => {
    for (const key of ['hamlet|Economy|Charcoal burner', 'village|Economy|Charcoal burner', 'town|Economy|Charcoal burner', 'city|Economy|Charcoal burner', 'metropolis|Economy|Charcoal burner']) {
      none(printed(key, { terrain: 'plains' }), /woodland|woods|forest/i);
      some(printed(key, { terrain: 'forest' }), /woodland|woods/i);
    }
  });
  it('the customs house names a port only where docks stand (c22, c18, c28, c27)', () => {
    for (const key of ['town|Economy|Customs house', 'city|Economy|Customs house', 'metropolis|Economy|Customs house']) {
      none(printed(key, {}), /\bport\b|harbour/i);
      some(printed(key, { houses: ['Harbour'] }), /\bport\b|harbour/i);
    }
  });
  it('the pawnbroker speaks of the banks only where a bank stands (c18)', () => {
    for (const key of ['town|Economy|Pawnbroker', 'city|Economy|Pawnbroker', 'metropolis|Economy|Pawnbroker']) {
      none(printed(key, {}), /\bbanks?\b/i);
      some(printed(key, { houses: ['Banking houses'] }), /\bbanks\b/i);
    }
  });
  it('the town granary holds off famine only where no famine is in force (c18)', () => {
    none(printed('town|Economy|Town granary', { stress: ['famine'] }), /hold off famine|prevents famine/i);
    some(printed('town|Economy|Town granary', {}), /hold off famine|prevents famine/i);
  });
  it('the charnel house carts go out only where no siege holds the roads (c22)', () => {
    none(printed('city|Religious|Burial grounds and charnel house', { houses: ['City walls'], stress: ['under_siege'] }), /carts (?:that )?go out|Carts go out/i);
    some(printed('city|Religious|Burial grounds and charnel house', { houses: ['City walls'] }), /carts (?:that )?go out|Carts go out/i);
  });
  it('the mercenary companies run to thousands only in a metropolis (c24, c22)', () => {
    none(printed('city|Defense|Mercenary quarter', {}), /thousands/i);
    some(printed('metropolis|Defense|Mercenary quarter', {}), /thousands/i);
  });
  it('the town fish market sells the fresh catch only by navigable water (c24)', () => {
    for (const key of ['town|Economy|Fish market', 'city|Economy|Fish market', 'metropolis|Economy|Fish market']) {
      none(printed(key, { port: 'none' }), /morning's catch|fresh catch/i);
      some(printed(key, { port: 'river' }), /morning's catch|fresh catch/i);
    }
  });
});

describe('W2-FIX-DATA: the descriptions reworded to presume nothing false', () => {
  const all = (/** @type {string} */ name) => Object.keys(INSTITUTION_DESC_VARIANTS).filter((k) => k.endsWith(`|${name}`)).flatMap(poolOf);
  it('the ferry denies no bridge (c16, c20, c22, c30)', () => none(all('River ferry'), /bridge/i));
  it('the royal seat names no governor in the monarch\'s place (c23)', () => none(all('Royal seat'), /^A royal governor or viceroy administers/));
  it('the druids\' council presumes no peace with the wild (c24, c28, c29)', () => none(all('Elder Grove Council'), /peace with the wild|come to terms with the wild/i));
  it('the contract killer is not "too small" in a city (c25)', () => none(all('Contract killer'), /too small/i));
  it('the beast trainers deny no exotic animal (c26, c27)', () => none(all('Beast trainers'), /nothing more exotic|only/i));
  it('the metropolis parishes count no hundreds of quarters (c27)', () => none(all('Parish churches (50-100+)'), /hundreds of quarters/i));
  it('the salt works claims no trade figure (c16, c23, c26, c30)', () => none(all('Salt works'), /most[- ]traded/i));
  it('the auction house sells no persons (c22, c25: content off)', () => none(all('Auction house'), /persons/i));
  it('a hamlet\'s common grazing is not called the village\'s (c06)', () => none(poolOf('hamlet|Economy|Common grazing land'), /\bvillage\b/));
});
