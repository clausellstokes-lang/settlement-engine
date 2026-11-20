/**
 * traditionDescriptionSharedPage.test.js — TRAD-1's born proof for CTR5 (the seventh chair, 2026-11-20).
 *
 * THE LAW. A tradition's description composed for a reader who is not the owner names no house, no person and no
 * power the SERVED document does not hold, and names nothing the veil hides; the owner's page still names its keeper.
 * The served documents are composed by the security lane's own doors, read and never edited here:
 *   - the PARTY LINK: `projectShareVeil(toPublicSafe(record), writeShareVeil(null, []))`, the default veil the link fails
 *     closed to (`lib/gallery.js :: sanitizeDossier`, partyLink, R4 of VEIL-FIX);
 *   - the GALLERY under the default veil (the same composition for a share the export marked).
 *
 * THE ARMS. (1) A born pool of every tier: every name in every reader description stands in the served document.
 * (2) A born town with a PLANTED hideable house that would keep a rite (its weekly market stamped criminal, the class
 * X-21e hides whole by default): the owner's page names it; the party link's served document drops the card and the
 * reader's description names it nowhere — and the reader's description over the OWNER'S raw record (the owner's own page
 * in player view) does not name it either: the leaf's second wall. (3) A LIT coup: the mirror's owner is a criminal
 * seat, carried on a full-mode share (deepClone keeps `traditions`); the reader's description drops it.
 * This file edits no file of the security lane.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil, writeShareVeil } from '../../src/domain/display/galleryVeil.js';
import { describeTradition } from '../../src/domain/traditions/traditionDescription.js';

const partyLink = (record) => projectShareVeil(toPublicSafe(record), writeShareVeil(null, []));

/** Does the served document hold this exact name as a string value somewhere? */
const holds = (served, name) => JSON.stringify(served).includes(JSON.stringify(String(name)).slice(1, -1));

const born = (settType, culture, seed) => generateSettlementPipeline(
  { settType, culture, terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized' },
  null, { seed, customContent: {} },
);

describe('the shared page names nothing the served document lacks (CTR5)', () => {
  it('a born pool of every tier: every house, person, power and event a reader description names stands in the party link\'s served document', () => {
    const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    let names = 0;
    const missing = [];
    for (const [i, tier] of TIERS.entries()) {
      for (const j of [0, 1, 2]) {
        const t = born(tier, ['germanic', 'celtic', 'arabic', 'slavic', 'mesoamerican', 'steppe'][(i + j) % 6], `trad-shared-${tier}-${j}`);
        const served = partyLink(t);
        for (const rec of [...deriveFoundingTraditions(served), ...deriveFoundingTraditions(t)]) {
          const d = describeTradition(rec, served, { audience: 'reader' });
          if (!d) continue;
          for (const n of [...d.named.houses, ...d.named.persons, ...d.named.powers, ...d.named.events]) {
            names += 1;
            if (!holds(served, n)) missing.push(`${t.name}: ${n}`);
          }
        }
      }
    }
    expect(names).toBeGreaterThan(50); // the arm reads real names, not an empty pool
    expect(missing).toEqual([]);
  }, 60000);
});

describe('PROVEN BORN: a hideable house that would keep a rite', () => {
  // A born town whose record holds a weekly market; the market is stamped criminal (the X-21e class the default
  // veil hides whole). The rite is the town's own market fair, composed as genesis's shape.
  const t = born('town', 'germanic', 'trad-shared-hideable');
  const market = (t.institutions || []).find((i) => /^(weekly market|market square)$/i.test(String(i?.name)));
  const planted = {
    ...t,
    institutions: t.institutions.map((i) => (i === market ? { ...i, category: 'Criminal', priorityCategory: 'criminal' } : i)),
  };
  const rec = { id: 'tradition.planted.2', coreMotif: { element: 'market', act: 'fair' }, name: 'The Market Fair', foundedYear: 30,
    ownerKey: null, ownerKind: null, ownerLabel: null, deityRef: null, mutationLog: [] };

  it('the born town holds a market house to plant on (the arm is not vacuous)', () => {
    expect(market).toBeTruthy();
  });

  it("the OWNER's page names the house as the rite's keeper", () => {
    const d = describeTradition(rec, planted, { audience: 'owner' });
    expect(d.named.houses).toEqual([market.name]);
  });

  it('the party link\'s served document does not hold the house, and the reader\'s description names it nowhere', () => {
    const served = partyLink(planted);
    expect((served.institutions || []).some((i) => i?.name === market.name)).toBe(false);
    const d = describeTradition(rec, served, { audience: 'reader' });
    // anchored: the owner arm above names this same house for the same rite
    expect(d.named.houses).not.toContain(market.name); // another public market house may stand in its place
    // anchored: the owner arm above names this same house for the same rite
    expect(d.text.toLowerCase()).not.toContain(` ${String(market.name).toLowerCase()}`);
  });

  it("the leaf's second wall: a reader composed over the owner's RAW record (the owner's page in player view) does not name it either", () => {
    const d = describeTradition(rec, planted, { audience: 'reader' });
    // anchored: the owner arm names this same house for the same rite over the same record
    expect(d.named.houses).not.toContain(market.name);
  });
});

describe('PROVEN BORN: a lit coup — the mirror\'s owner is a criminal seat', () => {
  const t = born('city', 'latin', 'trad-shared-coup');
  const seatless = (t.powerStructure?.factions || []).map((f) => ({ ...f, isGoverning: false }));
  const coup = {
    ...t,
    powerStructure: { ...t.powerStructure, factions: [{ faction: "Thieves' Guild", category: 'criminal', isGoverning: true, power: 40 }, ...seatless.filter((f) => f.category !== 'criminal')] },
  };
  const [core] = deriveFoundingTraditions(coup);
  const lit = { ...core, ownerKey: 'faction:thieves_guild', ownerKind: 'seat', ownerLabel: "Thieves' Guild" };
  const withMirror = { ...coup, traditions: [lit] };

  it("the owner's page names the seat that keeps the founding rite now", () => {
    expect(describeTradition(lit, withMirror, { audience: 'owner' }).named.powers).toEqual(["Thieves' Guild"]);
  });

  it('a full-mode share carries the mirror, and the reader\'s description still drops the criminal owner', () => {
    const served = toPublicSafe(withMirror, { full: true });
    expect(Array.isArray(served.traditions)).toBe(true); // the mirror does travel on a full share
    const d = describeTradition(served.traditions[0], served, { audience: 'reader' });
    expect(d.named.powers).toEqual([]);
    // anchored: the arm above asserts the owner's page names the Thieves' Guild for this lit record
    expect(d.text).not.toMatch(/Thieves/);
  });
});

// ── CTR9: THE SHARED PAGE SHOWS THE OWNER'S TRADITIONS, as text drawn at the owner's save ─────────────────────────
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { publicProseOf, withPublicProse } from '../../src/domain/display/publicProse.js';
import { shownTraditionsOf, sharedTraditionRowsOf } from '../../src/domain/traditions/shownTraditions.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';

describe('CTR9: the owner\'s set and the reader\'s descriptions travel as text', () => {
  const t = born('city', 'germanic', 'trad-shared-ctr9');
  const saved = withPublicProse(t, composePublicProse(t));

  it('the save draws the owner\'s set, in the owner\'s order, under publicProse.blocks.traditions', () => {
    const rows = saved.publicProse.blocks.traditions;
    expect(rows.map((r) => r.name)).toEqual(shownTraditionsOf(t, []).recs.map((r) => r.name));
    for (const r of rows) expect(Object.keys(r).sort()).toEqual(['chip', 'element', 'id', 'name', 'text', 'when']);
    expect(rows.some((r) => r.text)).toBe(true);
  });

  it('the party link serves those rows byte for byte, and they are the owner\'s set, not one derived from id', () => {
    const served = partyLink(saved);
    expect(publicProseOf(served, 'traditions')).toEqual(saved.publicProse.blocks.traditions);
    // the derivation the shared page used to make: a different set (the seed never travels)
    expect(deriveFoundingTraditions(served).map((r) => r.name)).not.toEqual(saved.publicProse.blocks.traditions.map((r) => r.name));
  });

  it('every key under the drawn traditions is clear of the private-key denylist (the projection keeps them all)', () => {
    const served = toPublicSafe(saved);
    expect(served.publicProse.blocks.traditions).toEqual(saved.publicProse.blocks.traditions);
  });

  it('the drawn rows carry the READER\'s description: no person, nothing of the hideable class', () => {
    const owner = shownTraditionsOf(t, []).recs;
    const rows = saved.publicProse.blocks.traditions;
    owner.forEach((rec, i) => expect(rows[i].text).toBe(describeTradition(rec, t, { audience: 'reader' })?.text ?? ''));
    const people = (t.npcs || []).map((n) => n?.name).filter(Boolean);
    for (const r of rows) for (const p of people) expect(r.text.includes(p), `${r.name}: ${p}`).toBe(false);
  });
});

describe('CTR9, PROVEN BORN BY INVERSION: the drawn traditions text does not depend on what is hidden', () => {
  // Born towns that hold hideable houses (criminal, clandestine, illegal brokerage): the same town with every one of
  // them gone (as a DM's veil would take them off the page) draws byte-identical traditions text.
  const towns = ['metropolis', 'city'].flatMap((tier) => [0, 1, 2].map((j) => born(tier, 'latin', `trad-inversion-${tier}-${j}`)))
    .filter((t) => (t.institutions || []).some((i) => isHideableHouse(i)));

  it('the inversion reads real hideable houses (not vacuous)', () => {
    expect(towns.length).toBeGreaterThan(0);
  });

  it('every hideable house hidden vs none hidden: the rows under publicProse are byte-identical', () => {
    for (const t of towns) {
      const hiddenNames = new Set((t.institutions || []).filter((i) => isHideableHouse(i)).map((i) => i.name));
      const without = {
        ...t,
        institutions: t.institutions.filter((i) => !hiddenNames.has(i.name)),
        npcs: (t.npcs || []).map((n) => (n?.institution && hiddenNames.has(n.institution.key) ? { ...n, institution: null } : n)),
      };
      expect(JSON.stringify(sharedTraditionRowsOf(without)), t.name).toBe(JSON.stringify(sharedTraditionRowsOf(t)));
    }
  });
});
