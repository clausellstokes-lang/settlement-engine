/**
 * institutionDescSharedPage.test.js — SURVEY S-A, the chair's condition (3) of ruling S-A-1, for print site 1 (a house's
 * description re-answered on the final record, `domain/display/institutionDescShown.js`).
 *
 * THE LAW. A line re-answered at view on a SHARED page must not let a reader count or read a hidden thing. The leaf
 * re-answers there ONLY the sibling sets whose every atom reads what no veil address reaches (`SHARE_SAFE_DIMENSIONS`:
 * the config's terrain, the stress record's crisis); a set that reads the roster (the docks, the walls, a gate) prints
 * AS STORED on the shared page. PROVEN BORN here on 62 births (sixty of the corpus C, ten a tier, and the measure's two
 * named towns): over the SERVED projection (the party link: `projectShareVeil(toPublicSafe(record), writeShareVeil(null,
 * []))`), every shown house's printed description is byte-identical with nothing hidden, with EVERY address this tree's
 * curate model offers hidden at once (each hideable house whole, each card eye, every function eye shut, every grouping
 * and switch), and with each class of address alone.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import TOWNS from '../fixtures/surveyFinalTowns.json';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { applyVeil, curateModelFor, defaultVeilFor, galleryPayloadFor, projectShareVeil, resolveVeil, writeShareVeil } from '../../src/domain/display/galleryVeil.js';
import { DESC_VARIANT_SIBLINGS } from '../../src/data/institutionDescVariants.js';
import { institutionDescShown, SHARE_SAFE_DIMENSIONS } from '../../src/domain/display/institutionDescShown.js';
import { institutionDescription } from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { speakTierNoun } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { tierNounFor } from '../../src/domain/display/stateProse/weaveBlock.js';
import { lineText } from '../../src/domain/facts/drawDeclared.js';
import { atomsOf, declarationOf, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

const partyLink = (record) => projectShareVeil(toPublicSafe(record), writeShareVeil(null, []));
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const ROWS = [
  ...TIERS.flatMap((tier) => Array.from({ length: 10 }, (_, n) => ({ plan: 'C', seed: `dp-${tier}-${n}`, config: { settType: tier } }))),
  ...TOWNS.filter((t) => t.plan === 'V' && ['dp-hamlet-12', 'dp-metropolis-4'].includes(t.seed)),
];

/** Every address this tree's curate model draws an eye for (groupings, switches, whole-house cards, card eyes). */
const addressesOf = (pub) => curateModelFor(pub, []).sections.flatMap((sec) => [
  ...sec.groupings.map((g) => g.address), ...sec.switches.map((w) => w.address),
  ...sec.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address)]),
]);
/** The class of an address: a grouping, a switch, a whole house, or a card eye of its kind and field. */
const classOf = (a) => {
  const head = a.split(':')[0];
  if (head === 'tab' || head === 'block') return 'grouping';
  if (head === 'class') return 'switch';
  if (head === 'card') return `card:${a.split(':')[1]}`;
  return `field:${a.split(':')[1]}:${a.split(':').pop()}`;
};
/** The printed description of every house the served document shows, by its id, beside its stored description. */
const printed = (served) => new Map((served.institutions || []).map((i, k) => [`${i.id ?? i.name}#${k}`, [i.desc, institutionDescShown(i, served, { audience: 'reader' })]]));
/** Every house of `served` whose stored description is the base's prints what the base prints (an eye that removes the
 * description itself takes the line away: that is the veil's, not a re-answer). @returns {string[]} the houses that differ */
const differs = (base, served) => [...printed(served)].filter(([id, [desc, shown]]) => base.has(id) && base.get(id)[0] === desc && base.get(id)[1] !== shown).map(([id]) => id);
/** The set a stored description belongs to (in the tier noun it was stored in). */
const setOf = (desc, tier) => {
  const noun = tierNounFor(tier);
  return Object.values(DESC_VARIANT_SIBLINGS).find((set) => Array.isArray(set) && set.some((l) => speakTierNoun(String(lineText(l)), noun).trim() === String(desc || '').trim()));
};
const dimsOf = (set) => [...new Set(set.flatMap((l) => atomsOf(declarationOf(l)).map((a) => parseAtom(a.replace(/^no\s+/i, ''))?.dimension)))];

describe('S-A site 1 on the SHARED page: no re-answer reads what a veil can hide', () => {
  /** @type {Array<{ plan: string, seed: string, raw: any, pub: any, all: string[] }>} */
  const towns = [];
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const row of ROWS) {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      const raw = withPublicProse(born, composePublicProse(born));
      const pub = galleryPayloadFor(raw); // every house shown: the base every hide is compared with
      towns.push({ plan: row.plan, seed: row.seed, raw, pub, link: partyLink(raw), all: [...new Set([...addressesOf(pub), ...addressesOf(raw)])] });
    }
  }, 600000);

  it('NOT VACUOUS: 62 births; houses of a share-safe set and of a roster set stand; the walk holds whole houses and function eyes', () => {
    expect(towns.length).toBe(62);
    const dims = towns.flatMap((t) => (t.pub.institutions || []).map((i) => setOf(i.desc, t.raw.tier)).filter(Boolean).map(dimsOf));
    expect(dims.some((d) => d.length && d.every((x) => SHARE_SAFE_DIMENSIONS.includes(x)))).toBe(true);
    expect(dims.some((d) => d.some((x) => !SHARE_SAFE_DIMENSIONS.includes(x)))).toBe(true);
    const classes = new Set(towns.flatMap((t) => t.all.map(classOf)));
    expect(classes.has('card:institution')).toBe(true);
    expect([...classes].some((c) => c.startsWith('field:institution:') && c.endsWith(':function'))).toBe(true);
  }, 240000);

  it('THE CURE REACHES THE SHARED PAGE where it may: the charcoal burner of V:dp-hamlet-12 prints its forest line', () => {
    const t = towns.find((x) => x.plan === 'V' && x.seed === 'dp-hamlet-12');
    const house = t.pub.institutions.find((i) => i.name === 'Charcoal burner');
    expect(house.desc).toMatch(/whenever wood can be had/);
    expect(institutionDescShown(house, t.pub, { audience: 'reader' })).toMatch(/^Kiln crews in the surrounding woodland/);
  });

  it('A ROSTER SET PRINTS AS STORED on the shared page: the customs house of V:dp-metropolis-4', () => {
    const t = towns.find((x) => x.plan === 'V' && x.seed === 'dp-metropolis-4');
    const house = t.pub.institutions.find((i) => i.name === 'Customs house');
    expect(institutionDescShown(house, t.pub, { audience: 'reader' })).toBe(house.desc.trim());
    expect(institutionDescShown(house, t.raw, { audience: 'owner' })).not.toBe(house.desc.trim()); // the owner's page re-answers it
  });

  it('ALL AT ONCE: every shown house prints byte-identically with every address hidden; the party link too', () => {
    for (const t of towns) {
      const base = printed(t.pub);
      const served = applyVeil(t.pub, resolveVeil(defaultVeilFor(t.pub), t.all.map((address) => ({ address, hidden: true }))));
      expect(differs(base, served), `${t.plan}:${t.seed} all hidden`).toEqual([]);
      expect(differs(base, t.link), `${t.plan}:${t.seed} the party link`).toEqual([]);
    }
  }, 600000);

  it('EACH CLASS ALONE: every shown house prints byte-identically', () => {
    let runs = 0;
    for (const t of towns) {
      for (const cls of [...new Set(t.all.map(classOf))]) {
        const veil = resolveVeil(null, t.all.filter((a) => classOf(a) === cls).map((address) => ({ address, hidden: true })));
        if (!veil.size) continue;
        runs += 1;
        expect(differs(printed(t.pub), applyVeil(t.pub, veil)), `${t.plan}:${t.seed} ${cls}`).toEqual([]);
      }
    }
    expect(runs).toBeGreaterThan(towns.length * 3);
  }, 600000);
  it('CONTROL (a plant): the docks taken off the served record, as a hide would take a house whole, move the OWNER\'s re-answer of the customs house; the reader\'s line does not move', () => {
    const t = towns.find((x) => x.plan === 'V' && x.seed === 'dp-metropolis-4');
    const docksGone = { ...t.pub, institutions: t.pub.institutions.filter((i) => !/dock|harbo|wharf|pier|port/i.test(String(i.name))) };
    expect(factsOf(t.pub).hasInstitution('docks')).toBe(true);
    expect(factsOf(docksGone).hasInstitution('docks')).toBe(false); // the plant reaches the fact
    const customs = (rec) => rec.institutions.find((i) => i.name === 'Customs house');
    expect(institutionDescShown(customs(docksGone), docksGone, { audience: 'owner' })).not.toBe(institutionDescShown(customs(t.pub), t.pub, { audience: 'owner' })); // the owner's re-answer would tell
    expect(institutionDescShown(customs(docksGone), docksGone, { audience: 'reader' })).toBe(institutionDescShown(customs(t.pub), t.pub, { audience: 'reader' })); // the reader's does not
  });
  it('S-A-4: THE SEARCH CARD\'s call (the tab\'s institutionDescription with the page\'s audience) is byte-equal hidden and shown, all at once and class by class, and equal to the tab\'s line', () => {
    const card = (served) => new Map((served.institutions || []).map((i, k) => [`${i.id ?? i.name}#${k}`, [i.desc, institutionDescription(i, served, { audience: 'reader' })]]));
    let runs = 0;
    for (const t of towns) {
      const base = card(t.pub);
      for (const [id, [, line]] of base) expect(line, `${t.seed} ${id}: the card is the tab's line`).toBe(printed(t.pub).get(id)[1] || line);
      const veils = [resolveVeil(defaultVeilFor(t.pub), t.all.map((address) => ({ address, hidden: true }))),
        ...[...new Set(t.all.map(classOf))].map((cls) => resolveVeil(null, t.all.filter((a) => classOf(a) === cls).map((address) => ({ address, hidden: true }))))];
      for (const veil of veils) {
        if (!veil.size) continue;
        runs += 1;
        const served = applyVeil(t.pub, veil);
        const moved = [...card(served)].filter(([id, [desc, line]]) => base.has(id) && base.get(id)[0] === desc && base.get(id)[1] !== line);
        expect(moved, `${t.plan}:${t.seed}`).toEqual([]);
      }
    }
    expect(runs).toBeGreaterThan(towns.length * 3);
  }, 600000);

  it('S-A-4 PLANT: C:dp-village-0\'s only tavern re-classed Criminal: every house\'s card line is the same hidden (the party link) and shown', async () => {
    const row = TOWNS.find((x) => x.plan === 'C' && x.seed === 'dp-village-0');
    const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    const raw = withPublicProse(born, composePublicProse(born));
    const tavern = raw.institutions.find((i) => /tavern|ale house|alehouse|inn\b/i.test(String(i.name)));
    expect(tavern).toBeTruthy();
    const planted = { ...raw, institutions: raw.institutions.map((i) => (i === tavern ? { ...i, category: 'Criminal' } : i)) };
    const hidden = partyLink(planted); const shown = galleryPayloadFor(planted);
    expect(hidden.institutions.some((i) => i.name === tavern.name)).toBe(false);
    const lineOf = (served, name) => institutionDescription(served.institutions.find((i) => i.name === name), served, { audience: 'reader' });
    for (const inst of hidden.institutions) expect(lineOf(hidden, inst.name), inst.name).toBe(lineOf(shown, inst.name));
    expect(lineOf(hidden, 'Maltster')).toBe(shown.institutions.find((i) => i.name === 'Maltster').desc.trim());
  });
});
