/**
 * W2-FIX-DATA (2026-11-13) — the institution descriptions the cold list read false (REVIEW-W2B,
 * `docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json`, rows in `institutionalCatalog.js`,
 * `institutionDescColour.js`, `institutionDescVariants.js`), drawn through the real site
 * (`steps/institutionDescDraw.js :: drawInstitutionDesc`) over the real pool (`[catalogue desc, ...variants]`)
 * with the facts a birth hands it (`factsOf.js :: birthFactsOf`): in the town that makes a line false no
 * drawn index prints it, and in the town where it is true the line as written still prints. This half: the lines
 * reworded to presume nothing false (the conditioned lines join in the next commit).
 */
import { describe, expect, it } from 'vitest';
import { INSTITUTION_DESC_VARIANTS } from '../../src/data/institutionDescVariants.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

/** @param {string} key `tier|category|name` */
const poolOf = (key) => {
  const [tier, cat, name] = key.split('|');
  const row = /** @type {any} */ (institutionalCatalog)[tier][cat][name];
  return [row.desc, ...(INSTITUTION_DESC_VARIANTS[key] || [])];
};

const none = (/** @type {string[]} */ texts, /** @type {RegExp} */ re) => expect(texts.filter((t) => re.test(t))).toEqual([]);

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
