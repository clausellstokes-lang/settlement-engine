/**
 * dossierSearchTraditions.test.js — TRAD-2 unit 2: THE SEARCH INDEX COMPOSED WITH THE VIEW'S OWN AUDIENCE
 * (`src/domain/dossier/dossierSearch.js :: traditionsOf`).
 *
 * THE LAW. A search finds what the page prints. On a shared page (`publicDossier`) the Traditions tab prints ONLY the
 * rows the owner's save drew as text (`publicProse`, site `traditions`, CTR9), so the search reads only those rows (name,
 * chip, text) and never derives a set from `id` (the seed never travels); with no rows drawn it indexes no tradition. On
 * the owner's views it indexes the tab's one set (`shownTraditions.js`) with each description composed for the view's
 * audience: the player view reads as the reader, the owner's page as the owner.
 *
 * Born: a town saved owner-side (`withPublicProse(t, composePublicProse(t))`) and served by the party link as
 * `tests/security/traditionDescriptionSharedPage.test.js` builds it (`projectShareVeil(toPublicSafe(record),
 * writeShareVeil(null, []))`). Every word searched for is read off the served rows at run time.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { publicProseOf, withPublicProse } from '../../src/domain/display/publicProse.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil, writeShareVeil } from '../../src/domain/display/galleryVeil.js';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { shownTraditionsOf } from '../../src/domain/traditions/shownTraditions.js';
import { describeTradition } from '../../src/domain/traditions/traditionDescription.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';
import { enumerateDossierObjects, searchDossier, foldSearchText } from '../../src/domain/dossier/dossierSearch.js';

const partyLink = (record) => projectShareVeil(toPublicSafe(record), writeShareVeil(null, []));
const born = (settType, culture, seed) => generateSettlementPipeline(
  { settType, culture, terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized' },
  null, { seed, customContent: {} },
);
/** Every tradition object a search answers with. */
const traditionHits = (result) => result.groups.flatMap((g) => g.objects).filter((o) => o.type === 'tradition');

describe('THE PUBLIC SEARCH reads only the rows the owner\'s save drew', () => {
  const t = born('city', 'germanic', 'trad-search-public');
  const saved = withPublicProse(t, composePublicProse(t));
  const served = partyLink(saved);
  const rows = publicProseOf(served, 'traditions') || [];
  const shownNames = new Set(rows.map((r) => r.name));
  // A word of a served row's description that neither its name nor its chip carries (read at run time).
  const pick = rows.flatMap((r) => (r.text.match(/[A-Za-z]{6,}/g) || [])
    .filter((w) => !foldSearchText(`${r.name} ${r.chip}`).includes(foldSearchText(w)))
    .map((w) => ({ row: r, word: w })))[0];

  it('the served page carries drawn rows with descriptions (not vacuous)', () => {
    expect(rows.length).toBeGreaterThan(0);
    expect(pick).toBeTruthy();
  });

  it('searching a word of a served row\'s description finds that row, carrying the drawn text', () => {
    const hits = traditionHits(searchDossier(served, pick.word, { publicDossier: true }));
    const hit = hits.find((o) => o.names[0] === pick.row.name);
    expect(hit, `"${pick.word}" from ${pick.row.name}`).toBeTruthy();
    expect(hit.meta.description).toBe(pick.row.text);
    expect(hit.meta.calendarLine).toBe(pick.row.when);
  });

  it('every tradition the public search indexes is a served row, by name, chip and text alone', () => {
    const objects = enumerateDossierObjects(served, { publicDossier: true }).objects.filter((o) => o.type === 'tradition');
    expect(objects.map((o) => o.names[0])).toEqual(rows.map((r) => r.name));
    objects.forEach((o, i) => expect(o.text).toEqual([rows[i].chip, rows[i].text].filter(Boolean)));
  });

  it('searching the name of a rite the id-derived set holds but the owner\'s set does not finds nothing', () => {
    const derivedOnly = deriveFoundingTraditions(served).map((r) => r.name).filter((n) => !shownNames.has(n));
    expect(derivedOnly.length).toBeGreaterThan(0); // the derivation the shared page must not make differs here
    for (const name of derivedOnly) {
      // anchored: the first arm above finds a served row by a word of its description on this same page
      expect(traditionHits(searchDossier(served, name, { publicDossier: true })).map((o) => o.names[0]), name).toEqual([]);
    }
  });

  it('a shared page saved before the traditions were drawn indexes no tradition', () => {
    const unsaved = partyLink(t);
    expect(publicProseOf(unsaved, 'traditions')).toBeNull();
    // anchored: the arms above index the drawn rows of this same town once its save drew them
    expect(enumerateDossierObjects(unsaved, { publicDossier: true }).objects.filter((o) => o.type === 'tradition')).toEqual([]);
  });
});

describe('THE OWNER\'S VIEWS index the description composed for the view\'s audience', () => {
  // A born town whose owner's page names a house as a shown rite's keeper, by its record's own spelling; that house is
  // then stamped criminal (the class the gallery veil hides whole, isHideableHouse): the owner's page still names it,
  // the player view must not.
  /** @returns {{ planted: Record<string, any>, house: string, rite: string }} */
  const plantedTown = () => {
    for (const [tier, culture, seed] of [['city', 'germanic', 'trad-search-own-0'], ['town', 'latin', 'trad-search-own-1'], ['metropolis', 'celtic', 'trad-search-own-2']]) {
      const t = born(tier, culture, seed);
      for (const rec of shownTraditionsOf(t, []).recs) {
        const owner = describeTradition(rec, t, { audience: 'owner' });
        const house = owner?.named.houses[0];
        // a house the owner's sentence spells as its record does (so a search for that name finds it there)
        if (!house || !foldSearchText(owner.text).includes(foldSearchText(house))) continue;
        const planted = {
          ...t,
          institutions: t.institutions.map((i) => (i.name === house ? { ...i, category: 'Criminal', priorityCategory: 'criminal' } : i)),
        };
        const still = shownTraditionsOf(planted, []).recs.find((r) => r.id === rec.id);
        if (still && describeTradition(still, planted, { audience: 'owner' })?.named.houses[0] === house) {
          return { planted, house, rite: String(rec.name) };
        }
      }
    }
    throw new Error('no born town names a house as a rite\'s keeper');
  };
  const { planted, house, rite } = plantedTown();
  const houseInText = (o) => [...o.names, ...o.text].some((s) => foldSearchText(s).includes(foldSearchText(house)));

  it('the planted house is of the hideable class and the owner\'s description names it (not vacuous)', () => {
    expect(isHideableHouse(planted.institutions.find((i) => i.name === house))).toBe(true);
  });

  it('on the OWNER\'s page the tradition is indexed with the owner\'s description, which names its keeper', () => {
    const objects = enumerateDossierObjects(planted, {}).objects.filter((o) => o.type === 'tradition');
    const found = objects.find((o) => o.names[0] === rite);
    expect(found.meta.description).toBe(describeTradition(found.raw, planted, { audience: 'owner' }).text);
    expect(houseInText(found)).toBe(true);
  });

  it('on the owner\'s PLAYER VIEW the description is the reader\'s, and no tradition object holds the hideable house\'s name', () => {
    const objects = enumerateDossierObjects(planted, { playerView: true }).objects.filter((o) => o.type === 'tradition');
    expect(objects.map((o) => o.names[0])).toEqual(shownTraditionsOf(planted, []).recs.map((r) => r.name));
    const found = objects.find((o) => o.names[0] === rite);
    expect(found.meta.description).toBe(describeTradition(found.raw, planted, { audience: 'reader' }).text);
    // anchored: the owner's-page arm above finds this same house in this same rite's indexed description
    expect(objects.filter(houseInText).map((o) => o.names[0])).toEqual([]);
  });
});
