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
    // over the reader's set (TRAD-4 unit 10: the drawn set, here the owner's set whole), as the save composes them
    owner.forEach((rec, i) => expect(rows[i].text).toBe(describeTradition(rec, t, { audience: 'reader', set: descriptionSetOf(t, 'reader') })?.text ?? ''));
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

// ── TRAD-2 UNIT 2: EVERY ADDRESS THE CURATE SCREEN CAN HIDE (the chair's extension of the inversion above) ──────────
/*
 * THE LAW (CTR9, CTR11). The reader's text is drawn at the owner's save and served later, so it may name, and choose by,
 * nothing ANY later act of the DM could hide. Why no later hide reaches it, clause by clause (the census that heads
 * `traditionDescription.js`, VERIFIED here against the curate model of this tree, `galleryVeil.js :: curateModelFor`, and
 * of `origin/lane/veil-22-2026-11-20`, read by hand below, not assumed):
 *
 * WHAT IS DONE (S1, the lead and the gloss). The line is picked by `pickVariant` on the town's identity (`_seed`, else
 * `id`: SETTLEMENT_FLOOR, no address) and the record's own id; the pick is admitted over `factsOf` of the reader's view.
 * The facts the table declares: `market` (facts/market.js :: isMarketInstitution: a live house's own `tags`, else the
 * catalogue's tags for its NAME), `institution: smith` (live house NAMES, the institution floor), `navigable`, `river`,
 * `coast` (the config's terrain and trade route: SETTLEMENT_FLOOR), and the crisis families (crisisKind.js :: crisisOf:
 * the stress container's `type`s and `activeConditions`, which no CARD_KINDS list and no grouping remover reaches; on
 * veil-22 the name sweep and withholdCastByServed take a stress entry's CAST rows that name a hidden house, never the
 * entry or its `type`: a generated stress entry carries no `id` or `name` for the sweep to take it by). The one eye that
 * touches a declared fact's input is a house's `function` eye (it removes the house's own `tags`): the arms below hide
 * it on every house and the drawn rows stand byte for byte (a born house's own tags are the catalogue's for its name).
 * A DM-authored house's tags are not, and the reader's text read them: since TRAD-3 unit 4 the reader's view strips every
 * function-eye field (PLANT 2 at the end of this file).
 *
 * WHO KEEPS IT: THE RECORD'S OWNER, A HOUSE. The owner is named only where the view holds it by that exact name; a house
 * is the first LIVE house of a fitting kind over the view's roster, which holds no house of the hideable class
 * (people/cardVeil.js :: isHideableHouse). The only address that removes a house is `card:institution:<id>` (X-21e), and
 * the applier admits it for that class alone, the class already out of the view; a house's name, category, catalogue id
 * and status are its floor (CARD_KINDS.institution.floor), so no eye changes which live house stands first.
 *
 * WHO KEEPS IT: A POWER. The seat (rulingPower.js :: governingFactionOf: `isGoverning`, else `governingName`) or the
 * strongest power of an archetype (`power`; factionArchetypes.js :: factionArchetype by `category`), over the view's
 * powers (no isVeiledPower row). `faction`, `name`, `category`, `power` and `isGoverning` are the faction floor; no card
 * address hides a power (isHideable admits `card:` for a house alone) on either tree, and veil-22's name sweep floors a
 * shown power's `faction` and `name`. Question (a) of the chair: NO, a DM cannot hide a non-veiled power; the arms assert
 * every non-veiled power stands, by its floor, with its archetype, in the document with everything hidden.
 *
 * NO PERSON. The reader's text names no person at all (a card's tie to its house is the `ties` eye, card by card).
 *
 * THE FOUNDING CAUSE. `history.founding` (`age`, and whether `foundedBy` stands): no CARD_KINDS list reaches it and no
 * grouping remover touches it, on either tree. NOT SAFE, as written: veil-22's name sweep removes a `foundedBy` holding a
 * hidden name, and the reader printed it; since TRAD-3 unit 4 the reader never reads `foundedBy` (PLANT 1 below).
 *
 * THE DEAD'S CAUSE. The most recent graded event (`templateType`, `severity`, `yearsAgo`, `name`) over
 * `history.historicalEvents`: all four are the event card's floor; the veil hides an event's description, lasting effects
 * and hooks, never its row. Question (b) of the chair: NO, a DM cannot hide a crisis or an event's row through either
 * tree's model; the arms assert the stress readings (crisisOf) and every event's floor stand with everything hidden.
 *
 * THE ECONOMY. The fitting income's rank and the count of incomes, over the view's `incomeSources` less the criminal row
 * (`isCriminal: true`): the one row veil-22's applier withholds (gallerySecondHomes.js :: withholdCriminalIncome, when a
 * criminal house goes whole or either criminal grouping is shut). This tree's applier keeps it; the drawn arms below
 * withhold it as veil-22 does, so the economy clause is proven against veil-22's reading too.
 */
import {
  applyVeil, resolveVeil, defaultVeilFor, curateModelFor, galleryPayloadFor, CARD_KINDS, CURATE_SECTIONS,
} from '../../src/domain/display/galleryVeil.js';
import { isCriminalInstitution, isVeiledPower } from '../../src/domain/people/cardVeil.js';
import { cardHouseOf } from '../../src/domain/people/cardPowers.js';
import { crisisOf } from '../../src/domain/facts/crisisKind.js';
import { governingFactionOf, nameOf } from '../../src/domain/rulingPower.js';
import { factionArchetype } from '../../src/domain/factionArchetypes.js';
import { deepClone } from '../../src/domain/clone.js';

/** Every copy of a card kind the applier reaches (each list of CARD_KINDS[kind], a `*` walking every owner). */
const copiesOf = (s, kind) => CARD_KINDS[kind].lists.flatMap((path) => {
  const star = path.indexOf('*');
  /** @param {unknown} root @param {readonly string[]} p */
  const at = (root, p) => {
    let cur = root;
    for (const seg of p) cur = cur && typeof cur === 'object' && !Array.isArray(cur) ? cur[seg] : undefined;
    return Array.isArray(cur) ? cur.filter((x) => x && typeof x === 'object' && !Array.isArray(x)) : [];
  };
  return star < 0 ? at(s, path) : at(s, path.slice(0, star)).flatMap((owner) => at(owner, path.slice(star + 1)));
});

/** This tree's curate model: every address it draws an eye for (groupings, switches, whole-house cards, card eyes). */
const modelAddresses = (pub) => curateModelFor(pub, []).sections.flatMap((sec) => [
  ...sec.groupings.map((g) => g.address), ...sec.switches.map((w) => w.address),
  ...sec.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address)]),
]);

/**
 * veil-22's curate model, read by hand (`git show origin/lane/veil-22-2026-11-20:src/domain/display/galleryVeil.js ::
 * curateModelFor`, the seventh chair's VR34): a card's eyes read EVERY copy the applier reaches (each list of its kind,
 * grouped by id: a person's copies in a power's roster, master's top-level `factions[]`), and a house's People eye reads
 * the house each person belongs to as the applier does (the car's `{ kind: 'house', key }`, else a legacy string). The
 * grammar is the same five kinds; the eyes it adds are hand-built here.
 */
const veil22Addresses = (pub) => {
  const services = pub.availableServices && typeof pub.availableServices === 'object' ? pub.availableServices : {};
  const offered = new Set(Object.values(services).flatMap((rows) => (Array.isArray(rows) ? rows : []).map((r) => r?.institution)).filter(Boolean));
  const staffed = new Set(copiesOf(pub, 'npc').map((n) => cardHouseOf(n) || (typeof n.institution === 'string' ? n.institution : '')).filter(Boolean));
  const valueOf = (copies, kind, field) => {
    if (kind === 'institution' && field === 'services') return offered.has(copies[0].name) ? true : undefined;
    if (kind === 'institution' && field === 'people') return staffed.has(copies[0].name) ? true : undefined;
    for (const card of copies) {
      for (const key of CARD_KINDS[kind].fields[field] || []) {
        const v = card[key];
        if (v != null && !(Array.isArray(v) && !v.length) && v !== '') return v;
      }
    }
    return undefined;
  };
  const out = [];
  for (const sec of CURATE_SECTIONS) {
    out.push(...sec.groupings.map(([address]) => address));
    const usable = new Set();
    for (const kind of sec.kinds) {
      const byId = new Map();
      for (const copy of copiesOf(pub, kind)) {
        const id = CARD_KINDS[kind].idOf(copy);
        if (id) byId.set(id, [...(byId.get(id) || []), copy]);
      }
      for (const [id, copies] of byId) {
        if (kind === 'institution' && isHideableHouse(copies[0])) out.push(`card:institution:${id}`);
        for (const field of Object.keys(CARD_KINDS[kind].fields)) {
          if (`${kind}:${field}` === 'faction:capture' || valueOf(copies, kind, field) === undefined) continue;
          usable.add(`class:${kind}:${field}`);
          out.push(`field:${kind}:${id}:${field}`);
        }
      }
    }
    out.push(...sec.switches.map(([address]) => address).filter((a) => usable.has(a)));
  }
  return out;
};

/** The class of an address: a grouping, a switch, a whole house, or a card eye of its kind. */
const classOf = (address) => {
  const head = address.split(':')[0];
  if (head === 'tab' || head === 'block') return 'grouping';
  if (head === 'class') return 'switch';
  if (head === 'card') return 'card:institution';
  return `field:${address.split(':')[1]}`;
};

/**
 * The record with a veil's hides removed (the applier's own removal, run on the OWNER's record so the rows are DRAWN over
 * it), and, as veil-22's applier also does, the criminal income row withheld where a criminal house goes whole or either
 * criminal grouping is shut (gallerySecondHomes.js :: withholdCriminalIncome on veil-22; this tree's applier keeps it).
 */
const hiddenFrom = (raw, veil) => {
  const veiled = applyVeil(raw, veil);
  const criminalGone = (raw.institutions || []).some((i) => isCriminalInstitution(i) && veil.has(`card:institution:${CARD_KINDS.institution.idOf(i)}`));
  if (!criminalGone && !veil.has('block:defense.criminalStructure') && !veil.has('block:power.criminalUnderside')) return veiled;
  const econ = veiled.economicState || {};
  return { ...veiled, economicState: { ...econ, incomeSources: (econ.incomeSources || []).filter((r) => r?.isCriminal !== true) } };
};

/** Every string leaf of a value. */
const stringsOf = (v, out = []) => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => stringsOf(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => stringsOf(x, out));
  return out;
};

/**
 * The names of what a veil hid: every house removed whole; every person (the reader names none); every veiled power;
 * and every phrase (two words or more) the projection carried that the veiled document holds nowhere (a field value an
 * address removed), the drawn prose itself set aside.
 */
const hiddenNamesOf = (raw, pub, served) => {
  const kept = new Set((served.institutions || []).map((i) => i.name));
  const rest = JSON.stringify({ ...served, publicProse: null });
  return {
    houses: (pub.institutions || []).map((i) => i.name).filter((n) => n && !kept.has(n)),
    persons: [...new Set(copiesOf(raw, 'npc').map((n) => n.name).filter(Boolean))],
    powers: (raw.powerStructure?.factions || []).filter(isVeiledPower).map((f) => nameOf(f)).filter(Boolean),
    values: [...new Set(stringsOf({ ...pub, publicProse: null }))]
      .filter((s) => /\S\s+\S/.test(s) && !rest.includes(JSON.stringify(s).slice(1, -1))),
  };
};

/** Each row text that names a hidden thing, with what it names (houses and powers in any case, as prose lowers them). */
const namedHidden = (rows, hidden) => rows.flatMap((r) => {
  const low = String(r.text).toLowerCase();
  return [
    ...[...hidden.houses, ...hidden.powers].filter((n) => low.includes(String(n).toLowerCase())),
    ...[...hidden.persons, ...hidden.values].filter((n) => r.text.includes(n)),
  ].map((n) => `${r.name}: ${n}`);
});

/** Master's stored shape (veil-22's VR34 reading): the powers' roster on a top-level `factions[]`, each with its members. */
const storedShape = (t) => ({
  ...t,
  factions: (t.powerStructure?.factions || []).map((f) => ({
    ...deepClone(f),
    members: (t.npcs || []).filter((n) => (n.memberships || []).some((m) => m?.power === nameOf(f))).map((n) => deepClone(n)),
  })),
});

describe('TRAD-2 UNIT 2, PROVEN BORN: with EVERY address the curate screen can hide hidden, the traditions text stands', () => {
  // Every tier; a town whose criminal income outranks its market taxes (the economy clause's rank); a town under a
  // famine whose crisis cast names hideable houses; a siege; and one town in master's stored shape (veil-22's eyes).
  const SPECS = [
    ['thorp', 'celtic', 'trad-curate-thorp'], ['hamlet', 'slavic', 'trad-curate-hamlet'], ['village', 'germanic', 'trad-curate-village'],
    ['town', 'arabic', 'trad-curate-town'], ['city', 'latin', 'trad-curate-city'], ['metropolis', 'germanic', 'inc-metropolis-germanic-3'],
    ['city', 'germanic', 'pre-city-germanic-1', ['famine']], ['town', 'latin', 'trad-curate-siege', ['under_siege']],
  ];
  const towns = SPECS.map(([tier, culture, seed, stresses]) => {
    const t = generateSettlementPipeline(
      { settType: tier, culture, terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized',
        ...(stresses ? { selectedStressesRandom: false, selectedStresses: stresses } : {}) },
      null, { seed, customContent: {} },
    );
    return { tier, raw: tier === 'town' && !stresses ? storedShape(t) : t };
  }).map(({ tier, raw }) => {
    const saved = withPublicProse(raw, composePublicProse(raw));
    const pub = galleryPayloadFor(saved);
    const here = modelAddresses(pub);
    const v22 = veil22Addresses(pub);
    // and every eye the same reading offers on the OWNER's record, which the drawn arms hide from (master's stored shape:
    // the projection does not carry the top-level roster, the owner's record does)
    const all = [...new Set([...here, ...v22, ...veil22Addresses(raw)])];
    return { tier, raw, saved, pub, here, v22, all, rows: saved.publicProse.blocks.traditions };
  });
  const CLASSES = [...new Set(towns.flatMap((t) => t.all.map(classOf)))].sort();
  const allHidden = (t) => resolveVeil(defaultVeilFor(t.pub), t.all.map((address) => ({ address, hidden: true })));
  const classHidden = (t, cls) => resolveVeil(null, t.all.filter((a) => classOf(a) === cls).map((address) => ({ address, hidden: true })));
  const drawn = (rec) => JSON.stringify(sharedTraditionRowsOf(rec));

  it('NOT VACUOUS: every town draws rows; the pool holds every class of address, whole houses, veil-22\'s added eyes, a criminal income above a fitting one, an active crisis', () => {
    for (const t of towns) expect(t.rows?.length, t.raw.name).toBeGreaterThan(0);
    for (const cls of ['grouping', 'switch', 'card:institution', 'field:npc', 'field:institution', 'field:faction', 'field:event', 'field:relationship']) {
      expect(CLASSES, cls).toContain(cls);
    }
    const added = towns.flatMap((t) => t.v22.filter((a) => !t.here.includes(a)));
    expect(added.some((a) => a.endsWith(':people'))).toBe(true); // the house car's People eye, which this tree's model omits
    const stored = towns.find((t) => Array.isArray(t.raw.factions));
    expect(copiesOf(stored.raw, 'npc').length).toBeGreaterThan(copiesOf({ npcs: stored.raw.npcs }, 'npc').length); // roster copies
    const income = towns.find((t) => {
      const rows = t.raw.economicState?.incomeSources || [];
      return rows[0]?.isCriminal === true && rows[1]?.source === 'Market Taxes';
    });
    expect(income, 'a criminal income row ranked above market taxes').toBeTruthy();
    expect(towns.some((t) => crisisOf(t.raw).active)).toBe(true);
  }, 240000);

  it('ALL AT ONCE: the rows drawn over the record with every address hidden are byte-identical to the rows drawn with nothing hidden; the served rows are the saved rows', () => {
    for (const t of towns) {
      const veil = allHidden(t);
      expect(drawn(hiddenFrom(t.raw, veil)), `${t.tier} ${t.raw.name}: drawn`).toBe(drawn(t.raw));
      expect(drawn(t.raw), `${t.tier}: the save's own rows`).toBe(JSON.stringify(t.rows));
      expect(JSON.stringify(publicProseOf(applyVeil(t.pub, veil), 'traditions')), `${t.tier}: served`).toBe(JSON.stringify(t.rows));
    }
  }, 240000);

  it('EACH CLASS ALONE: the drawn rows stand byte for byte, and the served rows are the saved rows', () => {
    let runs = 0;
    for (const t of towns) {
      // the classes this town holds an address of (a thorp holds no house of the hideable class)
      const held = CLASSES.map((cls) => [cls, classHidden(t, cls)]).filter(([, veil]) => veil.size > 0);
      for (const [cls, veil] of held) {
        runs += 1;
        expect(drawn(hiddenFrom(t.raw, veil)), `${t.tier} ${t.raw.name}: ${cls}`).toBe(drawn(t.raw));
        expect(JSON.stringify(publicProseOf(applyVeil(t.pub, veil), 'traditions')), `${t.tier}: ${cls} served`).toBe(JSON.stringify(t.rows));
      }
    }
    expect(runs).toBeGreaterThan(towns.length * 5); // each town hides several classes, one at a time
  }, 240000);

  it('NAMES NOTHING HIDDEN: no row names a house hidden whole, a person, a veiled power or a phrase an address removed (all at once, and each class alone)', () => {
    let hiddenCount = 0;
    for (const t of towns) {
      for (const veil of [allHidden(t), ...CLASSES.map((cls) => classHidden(t, cls))]) {
        const hidden = hiddenNamesOf(t.raw, t.pub, applyVeil(t.pub, veil));
        hiddenCount += hidden.houses.length + hidden.values.length;
        expect(namedHidden(t.rows, hidden), `${t.tier} ${t.raw.name}`).toEqual([]);
      }
    }
    expect(hiddenCount).toBeGreaterThan(0);
  }, 240000);

  it('CONTROL: a hidden house\'s name, or a removed phrase, planted into a row makes the check red', () => {
    const t = towns.find((x) => hiddenNamesOf(x.raw, x.pub, applyVeil(x.pub, allHidden(x))).houses.length > 0);
    const hidden = hiddenNamesOf(t.raw, t.pub, applyVeil(t.pub, allHidden(t)));
    const plant = (name) => t.rows.map((r, i) => (i === 0 ? { ...r, text: `${r.text} It is kept by ${name}.` } : r));
    expect(namedHidden(plant(hidden.houses[0]), hidden)).toEqual([`${t.rows[0].name}: ${hidden.houses[0]}`]);
    expect(namedHidden(plant(hidden.values[0]), hidden).length).toBeGreaterThan(0);
  }, 240000);

  it('CONTROL: the comparator sees a text that does choose by a hidden row (the OWNER\'s description ranks over the criminal income row)', () => {
    const t = towns.find((x) => x.raw.economicState?.incomeSources?.[0]?.isCriminal === true);
    const owner = (rec) => JSON.stringify(shownTraditionsOf(rec, []).recs.map((r) => describeTradition(r, rec, { audience: 'owner' })?.text ?? ''));
    expect(owner(hiddenFrom(t.raw, allHidden(t)))).not.toBe(owner(t.raw));
  }, 240000);

  it('THE CHAIR\'S QUESTIONS (a) and (b): with everything hidden, every non-veiled power, the stress readings, every event row and the founding stand', () => {
    for (const t of towns) {
      const veil = allHidden(t);
      // the served document against the projection it was veiled from; the record the rows are drawn over against the owner's
      for (const [doc, before] of [[applyVeil(t.pub, veil), t.pub], [hiddenFrom(t.raw, veil), t.raw]]) {
        const floor = (f) => [nameOf(f), f.category, f.power, f.isGoverning === true, factionArchetype(f)];
        const powers = (s) => (s.powerStructure?.factions || []).filter((f) => !isVeiledPower(f)).map(floor);
        expect(powers(doc), `${t.tier}: powers`).toEqual(powers(before));
        expect(nameOf(governingFactionOf(doc)), `${t.tier}: the seat`).toBe(nameOf(governingFactionOf(before)));
        const crisis = (s) => { const c = crisisOf(s); return [c.types, c.kinds, c.families, c.conditionKinds]; };
        expect(crisis(doc), `${t.tier}: crisis`).toEqual(crisis(before));
        const events = (s) => (s.history?.historicalEvents || []).map((e) => [e.name, e.templateType, e.severity, e.yearsAgo]);
        expect(events(doc), `${t.tier}: events`).toEqual(events(before));
        expect(doc.history?.founding?.age, `${t.tier}: founding`).toBe(before.history?.founding?.age);
        expect(doc.history?.founding?.foundedBy, `${t.tier}: founding`).toBe(before.history?.founding?.foundedBy);
      }
    }
  }, 240000);
});

// ── TRAD-3 UNIT 4: THE CHAIR'S TWO PLANTS (CTR11: the reader's text reads no field a later act of the DM can withhold) ──
/*
 * PLANT 1. `history.founding.foundedBy` is an editable field, and veil-22's name sweep (gallerySecondHomes.js ::
 * sweepHiddenNames on origin/lane/veil-22-2026-11-20) removes it when it holds a hidden house's name; the reader's founding
 * clause chose its pool by foundedBy's presence and printed it. The cure, by class: the reader's founding clause never
 * reads foundedBy (the bare pool, always); the owner's page keeps "founded by …".
 * PLANT 2. A house's `function` eye (galleryVeil.js :: CARD_KINDS.institution.fields.function) removes the house's own
 * `tags`, which the `market` fact reads (facts/market.js :: isMarketInstitution: own tags, else the catalogue's for its
 * NAME). The cure, by class: the reader's view strips every function-eye field from every house (read from the veil's own
 * declaration), so every fact the reader's text admits by is read from a house's floor.
 */
import { isMarketInstitution } from '../../src/domain/facts/market.js';
import { catalogIdForName } from '../../src/data/institutionalCatalog.js';

describe('TRAD-3 UNIT 4, PLANT 1: a hideable house\'s name written into history.founding.foundedBy', () => {
  const towns = ['town', 'city', 'metropolis'].flatMap((tier) => [0, 1, 2].map((j) => born(tier, 'latin', `trad-inversion-${tier === 'town' ? 'city' : tier}-${j}`)))
    .filter((t) => (t.institutions || []).some((i) => isHideableHouse(i)) && typeof t.history?.founding?.foundedBy === 'string');
  const withFoundedBy = (t, by) => {
    const { foundedBy, ...rest } = t.history.founding;
    return { ...t, history: { ...t.history, founding: by === undefined ? rest : { ...rest, foundedBy: by } } };
  };
  const plantOf = (t) => (t.institutions || []).find((i) => isHideableHouse(i)).name;
  const core = (t) => shownTraditionsOf(t, []).recs.find((r) => /\.0$/.test(String(r.id)));

  it('NOT VACUOUS: born towns hold a hideable house and a born foundedBy, and a drawn row carries the founding cause', () => {
    expect(towns.length).toBeGreaterThan(1);
    const causes = towns.filter((t) => (sharedTraditionRowsOf(t) || []).some((r) => r.text.includes(`${t.history.founding.age} years ago`)));
    expect(causes.length).toBeGreaterThan(0);
  }, 120000);

  it('CONTROL: the OWNER\'s founding sentence names the planted value (the plant reaches the leaf)', () => {
    let reached = 0;
    for (const t of towns) {
      const planted = withFoundedBy(t, plantOf(t));
      const rec = core(planted);
      if (!rec) continue;
      const d = describeTradition(rec, planted, { audience: 'owner' });
      if (d?.parts.origin === 'cause') { reached += 1; expect(d.text, t.name).toContain(`by ${plantOf(t)}`); }
    }
    expect(reached).toBeGreaterThan(0);
  }, 120000);

  it('the rows the save draws and every reader description name nothing of the planted house', () => {
    const named = [];
    for (const t of towns) {
      const planted = withFoundedBy(t, plantOf(t));
      const low = plantOf(t).toLowerCase();
      for (const r of sharedTraditionRowsOf(planted) || []) if (r.text.toLowerCase().includes(low)) named.push(`${t.name} row ${r.name}: ${r.text}`);
      for (const rec of shownTraditionsOf(planted, []).recs) {
        const d = describeTradition(rec, planted, { audience: 'reader' });
        if (d && d.text.toLowerCase().includes(low)) named.push(`${t.name} ${rec.name}: ${d.text}`);
      }
    }
    expect(named).toEqual([]);
  }, 120000);

  it('the reader\'s rows are BYTE-IDENTICAL with foundedBy as born, deleted and planted (the pool does not choose by it)', () => {
    for (const t of towns) {
      const asBorn = JSON.stringify(sharedTraditionRowsOf(t));
      expect(JSON.stringify(sharedTraditionRowsOf(withFoundedBy(t, undefined))), `${t.name}: deleted`).toBe(asBorn);
      expect(JSON.stringify(sharedTraditionRowsOf(withFoundedBy(t, plantOf(t)))), `${t.name}: planted`).toBe(asBorn);
    }
  }, 120000);
});

describe('TRAD-3 UNIT 4, PLANT 2: a DM-authored house tagged market, the town\'s only market, its function eye hidden', () => {
  const HOUSE = { name: 'The Lantern Exchange', category: 'Economy', tags: ['market'] };
  const towns = [['town', 'latin', 'trad-plant2-town-latin-0'], ['village', 'arabic', 'trad-plant2-village-arabic-0']].map(([tier, culture, seed]) => {
    const t = born(tier, culture, seed);
    return { ...t, institutions: [...t.institutions.filter((i) => !isMarketInstitution(i)), { ...HOUSE }] };
  });
  const id = CARD_KINDS.institution.idOf(HOUSE);
  const veiled = (t) => applyVeil(t, new Set([`field:institution:${id}:function`]));
  const byHand = (t) => ({ ...t, institutions: t.institutions.map((i) => (i.name === HOUSE.name ? { name: HOUSE.name, category: HOUSE.category } : i)) });
  const marketRites = (t) => shownTraditionsOf(t, []).recs.filter((r) => r.coreMotif?.element === 'market');
  const texts = (t, s, audience) => JSON.stringify(shownTraditionsOf(t, []).recs.map((r) => describeTradition(r, s, { audience })?.text ?? ''));

  it('NOT VACUOUS: the house is DM-authored (the catalogue does not know its name), the town\'s only market, and the town holds a market rite', () => {
    expect(catalogIdForName(HOUSE.name)).toBeFalsy();
    for (const t of towns) {
      expect(t.institutions.filter((i) => isMarketInstitution(i)).map((i) => i.name), t.name).toEqual([HOUSE.name]);
      expect(marketRites(t).length, t.name).toBeGreaterThan(0);
      expect(veiled(t).institutions.find((i) => i.name === HOUSE.name).tags, t.name).toBeUndefined(); // the eye reaches the tags
    }
  }, 120000);

  it('CONTROL: the OWNER\'s description does change with the function-eye fields removed (the plant reaches the fact)', () => {
    for (const t of towns) expect(texts(t, byHand(t), 'owner'), t.name).not.toBe(texts(t, t, 'owner'));
  }, 120000);

  it('the reader\'s descriptions of the town\'s rites are byte-identical with the house\'s function-eye fields present, hidden by applyVeil, and removed by hand', () => {
    for (const t of towns) {
      expect(texts(t, veiled(t), 'reader'), `${t.name}: applyVeil`).toBe(texts(t, t, 'reader'));
      expect(texts(t, byHand(t), 'reader'), `${t.name}: by hand`).toBe(texts(t, t, 'reader'));
    }
  }, 120000);
});

describe('TRAD-3 UNIT 4, THE SET (the chair\'s cure B): the rows drawn for the shared page admit by the floor only', () => {
  // The OWNER's set (shownTraditions.js :: shownTraditionsOf: the tab, the owner's page) is unchanged and still admits by
  // a house's own tags. The ROWS DRAWN FOR THE SHARED PAGE (sharedTraditionRowsOf) admit over the record with every
  // house's function-eye fields stripped (a house's NAME against the catalogue's tags, hidden or shown), so the drawn set
  // is no function of the function eye. (Before the cure this arm was the chair's pinned finding: the drawn set dropped
  // the market/fair and tide/fair rites when the DM-authored market house's tags went.)
  const t = (() => {
    const b = born('town', 'latin', 'trad-plant2-town-latin-0');
    return { ...b, institutions: [...b.institutions.filter((i) => !isMarketInstitution(i)), { name: 'The Lantern Exchange', category: 'Economy', tags: ['market'] }] };
  })();
  const stripped = { ...t, institutions: t.institutions.map((i) => (i.name === 'The Lantern Exchange' ? { name: i.name, category: i.category } : i)) };
  const veiled = applyVeil(t, new Set([`field:institution:${CARD_KINDS.institution.idOf({ name: 'The Lantern Exchange' })}:function`]));
  const motifs = (s) => shownTraditionsOf(s, []).recs.map((r) => `${r.coreMotif.element}/${r.coreMotif.act}`);

  it('the OWNER\'s set is as it was: it admits the market rites by the house\'s own tags (genesis derives the same three rites either way)', () => {
    expect(deriveFoundingTraditions(stripped).map((r) => r.id)).toEqual(deriveFoundingTraditions(t).map((r) => r.id));
    expect(motifs(t)).toEqual(['first-landing/feast', 'market/fair', 'tide/fair']);
    expect(motifs(stripped)).toEqual(['first-landing/feast']); // the owner's page reads the record it is handed
  }, 120000);

  it('the drawn rows are byte-identical with the house\'s tags present, hidden by applyVeil, and removed by hand', () => {
    const rows = JSON.stringify(sharedTraditionRowsOf(t));
    expect(JSON.stringify(sharedTraditionRowsOf(veiled)), 'applyVeil').toBe(rows);
    expect(JSON.stringify(sharedTraditionRowsOf(stripped)), 'by hand').toBe(rows);
  }, 120000);
});

describe('TRAD-3 UNIT 4, THE DEAD\'S CAUSE (the chair\'s item 3): the reader names the event by its KIND, never by its name', () => {
  // The chair's ruling: for a reader, the event a rite of the dead is kept in memory of is named by an authored phrase of
  // its template type (traditionDescriptionTable.js :: DEAD_EVENT_PHRASES), never by `event.name`, and is chosen only among
  // events whose name holds no house, person or power name the WHOLE record holds (hidden or shown). THE TOOTH: an event
  // renamed by a plant to hold a hideable house's name. "Hidden" is modelled as veil-22 serves it: the house goes whole
  // (this tree's applyVeil, `card:institution:<id>`) and the event entry whose name holds it leaves its list
  // (gallerySecondHomes.js :: sweepHiddenNames on origin/lane/veil-22-2026-11-20: an entry whose own `name` is taken).
  const SPECS = [['city', 'arabic', 'trad-dead-city-arabic-0'], ['city', 'latin', 'trad-dead-city-latin-0'], ['metropolis', 'latin', 'trad-dead-metropolis-latin-0']];
  const DEAD = ['great_fire', 'great_flood', 'plague_years', 'external_threat'];
  const graded = (e) => DEAD.includes(e.templateType) && ['major', 'catastrophic'].includes(e.severity);
  const towns = SPECS.map(([tier, culture, seed]) => {
    const t = born(tier, culture, seed);
    const house = t.institutions.find((i) => isHideableHouse(i));
    const target = [...t.history.historicalEvents].filter(graded).sort((a, b) => a.yearsAgo - b.yearsAgo)[0];
    const eventName = `The ${house.name} ${target.templateType === 'external_threat' ? 'Siege' : 'Disaster'}`;
    const planted = { ...t, history: { ...t.history, historicalEvents: t.history.historicalEvents.map((e) => (e === target ? { ...e, name: eventName } : e)) } };
    const veiled = applyVeil(planted, new Set([`card:institution:${CARD_KINDS.institution.idOf(house)}`]));
    const swept = { ...veiled, history: { ...veiled.history, historicalEvents: veiled.history.historicalEvents.filter((e) => !String(e.name).toLowerCase().includes(house.name.toLowerCase())) } };
    return { t, house, eventName, planted, hidden: swept };
  });
  const deadRites = (s) => shownTraditionsOf(s, []).recs.filter((r) => r.coreMotif?.element === 'the-dead');

  it('NOT VACUOUS: each town holds a rite of the dead and a hideable house, and the hide takes the house and the planted event', () => {
    for (const x of towns) {
      expect(deadRites(x.planted).length, x.t.name).toBeGreaterThan(0);
      expect(x.hidden.institutions.some((i) => i.name === x.house.name), x.t.name).toBe(false);
      expect(x.hidden.history.historicalEvents.some((e) => e.name === x.eventName), x.t.name).toBe(false);
    }
  }, 120000);

  it('CONTROL: the OWNER\'s description names the planted event (the plant reaches the leaf)', () => {
    for (const x of towns) {
      const texts = deadRites(x.planted).map((r) => describeTradition(r, x.planted, { audience: 'owner' }).text).join(' ');
      expect(texts, x.t.name).toContain(x.eventName.replace(/^The /, 'the '));
    }
  }, 120000);

  it('THE TOOTH: the reader\'s descriptions and the drawn rows are byte-identical with the house hidden and shown, and name nothing of it', () => {
    for (const x of towns) {
      const reader = (s) => JSON.stringify(deadRites(x.planted).map((r) => describeTradition(r, s, { audience: 'reader' }).text));
      expect(reader(x.hidden), `${x.t.name}: descriptions`).toBe(reader(x.planted));
      expect(JSON.stringify(sharedTraditionRowsOf(x.hidden)), `${x.t.name}: rows`).toBe(JSON.stringify(sharedTraditionRowsOf(x.planted)));
      // anchored: the CONTROL arm asserts the owner's text over this same planted town names the event holding this house
      expect(reader(x.planted).toLowerCase(), x.t.name).not.toContain(x.house.name.toLowerCase());
    }
  }, 120000);

  it('the reader names a born event by its kind, never by its name; at least one born rite of the dead carries the cause', () => {
    let causes = 0;
    for (const x of towns) {
      for (const r of deadRites(x.t)) {
        const d = describeTradition(r, x.t, { audience: 'reader' });
        if (/in memory of/.test(d.text)) causes += 1;
        expect(d.named.events, x.t.name).toEqual([]);
        // anchored: the owner names these same events by name (the CONTROL arm), and `causes` below counts the cause present
        for (const e of x.t.history.historicalEvents) expect(d.text, x.t.name).not.toContain(String(e.name).replace(/^The /, 'the '));
      }
    }
    expect(causes).toBeGreaterThan(0);
  }, 120000);
});

describe('TRAD-3 UNIT 4, THE DRAWN ROWS ARE NUMBERED DENSE (the chair\'s item 5): a rite the floor rule drops leaves no gap', () => {
  // The rows drawn for the shared page carry `tradition.shared.<n>`, n their place in the DRAWN set (0..n-1, in the order
  // served), never the genesis id (which holds the seed) nor its index: a rite dropped by the floor rule would leave a
  // gap that tells the reader a rite stood there. The owner's page keeps the genesis ids. The plant: plant 2's town with
  // a lit mirror whose MIDDLE rite is the market fair (admitted by the DM-authored house's own tags on the owner's set,
  // dropped by the floor on the drawn set) and whose last rite stands either way.
  const b = born('town', 'latin', 'trad-plant2-town-latin-0');
  const [first, market] = deriveFoundingTraditions(b).filter((r) => ['first-landing', 'market'].includes(r.coreMotif.element));
  const harvest = { ...market, id: market.id.replace(/\.\d+$/, '.2'), name: 'The Harvest Feast', coreMotif: { element: 'harvest', act: 'feast' } };
  const HOUSE = { name: 'The Lantern Exchange', category: 'Economy', tags: ['market'] };
  const t = { ...b, institutions: [...b.institutions.filter((i) => !isMarketInstitution(i)), HOUSE], traditions: [first, market, harvest] };
  const veiled = applyVeil(t, new Set([`field:institution:${CARD_KINDS.institution.idOf(HOUSE)}:function`]));
  const stripped = { ...t, institutions: t.institutions.map((i) => (i.name === HOUSE.name ? { name: i.name, category: i.category } : i)) };

  it('NOT VACUOUS: the owner\'s set holds the three rites; the floor drops the middle one from the drawn set', () => {
    expect(shownTraditionsOf(t, []).recs.map((r) => r.id)).toEqual([first.id, market.id, harvest.id]);
    expect(sharedTraditionRowsOf(t).map((r) => r.name)).toEqual([first.name, harvest.name]);
  }, 120000);

  it('the served ids are dense (tradition.shared.0..n-1), carry nothing of the genesis id or the seed, and are byte-identical with the house hidden and shown', () => {
    const rows = sharedTraditionRowsOf(t);
    const seedSlug = first.id.split('.')[1];
    expect(seedSlug).toMatch(/plant2/); // the genesis id carries the seed
    expect(rows.map((r) => r.id)).toEqual(rows.map((_, i) => `tradition.shared.${i}`));
    for (const r of rows) {
      // anchored: the seed's slug is read off the genesis id itself (asserted non-empty), and the line above asserts r.id
      expect(r.id).not.toContain(seedSlug);
      // anchored: the owner arm below asserts these three ids stand on the owner's set; the dense ids are asserted above
      expect([first.id, market.id, harvest.id]).not.toContain(r.id);
    }
    expect(JSON.stringify(sharedTraditionRowsOf(veiled)), 'applyVeil').toBe(JSON.stringify(rows));
    expect(JSON.stringify(sharedTraditionRowsOf(stripped)), 'by hand').toBe(JSON.stringify(rows));
  }, 120000);

  it('the OWNER\'s page keeps the genesis ids', () => {
    expect(shownTraditionsOf(t, []).recs.map((r) => r.id)).toEqual([first.id, market.id, harvest.id]);
  }, 120000);
});

describe('TRAD-3 UNIT 4b, THE FLOOR EXCLUDES THE HIDEABLE CLASS (the chair\'s ruling of 12:25 UTC)', () => {
  // The rows drawn for the shared page admit by the floor over houses NOT of the hideable class (people/cardVeil.js ::
  // isHideableHouse, read on the house whole, before the function-eye strip), whether a given house is hidden or shown.
  // The plant: a DM-made CRIMINAL house named like a catalogue market (the catalogue knows the name and tags it market),
  // the town's only market. Before the cure its name admitted the market rites into the drawn rows; a hide of the house
  // (card:institution:<id>, X-21e: it goes whole) would then have told the reader the rites stood on it.
  const HOUSE = { name: 'Weekly market', category: 'Criminal', priorityCategory: 'criminal' };
  const b = born('town', 'latin', 'trad-plant2-town-latin-0');
  const t = { ...b, institutions: [...b.institutions.filter((i) => !isMarketInstitution(i)), { ...HOUSE }] };
  const hidden = applyVeil(t, new Set([`card:institution:${CARD_KINDS.institution.idOf(HOUSE)}`]));
  // a rite that stands on a market: the market element, or the fair act (shownTraditions.js :: ACT_NEEDS), read off the row
  const standsOnMarket = (r) => r.element === 'market' || /\bFair\b/.test(`${r.name} ${r.chip}`);

  it('NOT VACUOUS: the house is of the hideable class, the catalogue knows its name, it is the only market, and the hide takes it whole', () => {
    expect(isHideableHouse(HOUSE)).toBe(true);
    expect(catalogIdForName(HOUSE.name)).toBeTruthy();
    expect(t.institutions.filter((i) => isMarketInstitution(i)).map((i) => i.name)).toEqual([HOUSE.name]);
    expect(hidden.institutions.some((i) => i.name === HOUSE.name)).toBe(false);
  }, 120000);

  it('CONTROL: the OWNER\'s set still admits the market rites on it', () => {
    expect(shownTraditionsOf(t, []).recs.map((r) => `${r.coreMotif.element}/${r.coreMotif.act}`)).toEqual(['first-landing/feast', 'market/fair', 'tide/fair']);
  }, 120000);

  it('the drawn rows hold no rite that stands on the hideable house, and are byte-identical with it hidden and shown', () => {
    const rows = sharedTraditionRowsOf(t);
    expect(rows.map((r) => r.name)).toEqual(shownTraditionsOf(t, []).recs.filter((r) => r.coreMotif.element === 'first-landing').map((r) => r.name));
    expect(rows.filter(standsOnMarket).map((r) => r.name)).toEqual([]);
    expect(JSON.stringify(sharedTraditionRowsOf(hidden))).toBe(JSON.stringify(rows));
  }, 120000);
});

// ── TRAD-4 UNIT 7 (REVIEW-VEIL-13's hole in "TRAD-SHARE 1f3cdc135"; the chair's rulings of 13:50 and 13:59 UTC) ──────
/*
 * (1) THE DEAD'S EVENT BY A BARE NAME. The reader's dead-cause skipped an event whose name held a FULL held name; the
 * security lane's sweep (migration 212) also withholds an event by a hidden house's BARE form (its name less its
 * bracketed qualifier). The chair's word rule: for a reader the dead's cause is chosen only among events whose name
 * shares NO WORD with any name the record holds (letter runs, case-folded, the qualifier's words in, a closed stop list
 * out, an event word that begins with a held word caught). The PLANT: the first hideable house renamed
 * "<bare> (word of mouth)" and a graded great fire, two years ago, named by the bare form; the event as 212 withholds it
 * is the record less that entry, and the reader's text and the drawn rows must be byte-identical with it and without it.
 * (2) A POWER'S ARCHETYPE FROM A HIDEABLE FIELD. A power with no mapped category takes its archetype from its
 * `description` (factionArchetypes.js :: factionArchetype), a field the faction card's eye removes: the reader's view
 * reads every power less every field any of its eyes can remove (galleryVeil.js :: CARD_KINDS.faction.fields).
 */
describe('TRAD-4 UNIT 7 (1): the dead\'s event named by a hidden house\'s bare form, a plural, a possessive, a three-letter name', () => {
  const SPECS = [['town', 'germanic', 'trad-f-town-germanic'], ['town', 'greek', 'trad-c-town-greek'],
    ['city', 'arabic', 'trad-dead-city-arabic-0'], ['city', 'latin', 'trad-dead-city-latin-0'], ['metropolis', 'latin', 'trad-dead-metropolis-latin-0']];
  const bareOf = (name) => String(name).replace(/\s*\([^)]*\)\s*$/, '');
  /** The town with its first hideable house renamed and a graded great fire, two years ago, named `eventName`. */
  const plant = (t, houseName, eventName) => {
    const old = t.institutions.find((i) => isHideableHouse(i)).name;
    return {
      ...t,
      institutions: t.institutions.map((i) => (i.name === old ? { ...i, name: houseName } : i)),
      history: { ...t.history, historicalEvents: [...t.history.historicalEvents,
        { id: 'evt_trad4_u7', name: eventName, templateType: 'great_fire', severity: 'major', yearsAgo: 2, description: 'The fire took a street.' }] },
    };
  };
  /** The record as migration 212 serves it: the planted event withheld whole. */
  const withheld = (p) => ({ ...p, history: { ...p.history, historicalEvents: p.history.historicalEvents.filter((e) => e.id !== 'evt_trad4_u7') } });
  const towns = SPECS.map(([tier, culture, seed]) => {
    const t = born(tier, culture, seed);
    const bare = bareOf(t.institutions.find((i) => isHideableHouse(i)).name);
    const word = `${bare} (word of mouth)`;
    return {
      t, bare,
      plants: [
        ['bare form', word, `The ${bare} Fire`],
        ['plural', word, `The ${bare}s' Fire`],
        ['possessive', word, `${bare}'s Burning`],
        ['three letters', 'Inn (word of mouth)', 'The Inn Fire'],
      ].map(([arm, houseName, eventName]) => ({ arm, eventName, planted: plant(t, houseName, eventName) })),
      control: plant(t, word, 'The Granary Fire'),
    };
  });
  const deadRites = (s) => shownTraditionsOf(s, []).recs.filter((r) => r.coreMotif?.element === 'the-dead' && !(/\.0$/.test(String(r.id)) && r.foundedYear === 1));
  const readerTexts = (s) => JSON.stringify(deadRites(s).map((r) => describeTradition(r, s, { audience: 'reader' })?.text ?? ''));
  const RECALL = 'in memory of the great fire, 2 years ago';
  const recalls = (s) => sharedTraditionRowsOf(s).some((r) => r.text.includes(RECALL));

  it('NOT VACUOUS: born towns of three tiers each hold a hideable house and a rite of the dead, and the plant keeps the house hideable', () => {
    expect(new Set(SPECS.map(([tier]) => tier)).size).toBe(3);
    for (const x of towns) {
      expect(deadRites(x.t).length, x.t.name).toBeGreaterThan(0);
      for (const p of x.plants) expect(p.planted.institutions.some((i) => isHideableHouse(i) && /\(word of mouth\)$/.test(i.name)), `${x.t.name} ${p.arm}`).toBe(true);
    }
  }, 120000);

  it('CONTROL: "The Granary Fire", where no held name holds "granary", is STILL recalled by the reader (the rule is not "never")', () => {
    // a town whose record holds a house, person or power named with "granary" (a born "Town granary") is no control
    const holdsGranary = (s) => ['institution', 'npc', 'faction'].some((k) => copiesOf(s, k).some((c) => /granary/i.test(`${c.name ?? ''} ${c.faction ?? ''}`)));
    const controls = towns.filter((x) => !holdsGranary(x.control));
    expect(controls.length).toBeGreaterThan(1);
    for (const x of controls) {
      expect(recalls(x.control), x.t.name).toBe(true);
      expect(readerTexts(x.control), x.t.name).not.toBe(readerTexts(withheld(x.control)));
    }
  }, 120000);

  it('CONTROL: the OWNER\'s page names the planted event by its own name in every plant (the plant reaches the leaf)', () => {
    for (const x of towns) {
      for (const p of x.plants) {
        const owner = deadRites(p.planted).map((r) => describeTradition(r, p.planted, { audience: 'owner' }).text).join(' ');
        // any of the three dead frames (the keyed pick; TRAD-4 unit 11's mixed pick reaches "… since then, 2 years ago")
        const named = p.eventName.replace(/^The /, 'the ').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        expect(owner, `${x.t.name} ${p.arm}`).toMatch(new RegExp(`${named}(?: since then)?, 2 years ago`));
      }
    }
  }, 120000);

  it('THE PLANTS: the reader\'s descriptions and the drawn rows are byte-identical with the event present and withheld, and recall no fire of two years ago', () => {
    const red = [];
    for (const x of towns) {
      for (const p of x.plants) {
        const where = `${x.t.name} ${p.arm} "${p.eventName}"`;
        if (readerTexts(p.planted) !== readerTexts(withheld(p.planted))) red.push(`${where}: descriptions`);
        if (JSON.stringify(sharedTraditionRowsOf(p.planted)) !== JSON.stringify(sharedTraditionRowsOf(withheld(p.planted)))) red.push(`${where}: rows`);
        // anchored: the CONTROL arm asserts this same phrase stands in the rows for an event no held name shares a word with
        if (recalls(p.planted)) red.push(`${where}: recalled`);
      }
    }
    expect(red).toEqual([]);
  }, 120000);
});

describe('TRAD-4 UNIT 7 (2): a DM-made power with no mapped category whose description alone makes it the wanted archetype', () => {
  const PLANTS = [
    ['religious', { faction: 'The Lantern Circle', category: 'other', power: 99, description: 'A temple brotherhood of priests who keep the shrines.' }],
    ['merchantry', { faction: 'The Lantern Circle', category: 'other', power: 99, description: 'A merchant guild of caravan traders.' }],
  ];
  const towns = [['thorp', 'celtic', 'trad-curate-thorp'], ['hamlet', 'slavic', 'trad-curate-hamlet'], ['village', 'germanic', 'trad-curate-village'],
    ['town', 'arabic', 'trad-curate-town']].map(([tier, culture, seed]) => born(tier, culture, seed));
  const withPower = (t, power) => ({ ...t, powerStructure: { ...t.powerStructure, factions: [...(t.powerStructure?.factions || []), power] } });
  const noDescription = (power) => { const { description, ...rest } = power; return rest; };
  const rites = (t) => shownTraditionsOf(t, []).recs;
  const texts = (t, s, audience) => JSON.stringify(rites(t).map((r) => describeTradition(r, s, { audience })?.text ?? ''));

  it('NOT VACUOUS: the description alone makes the power the wanted archetype, it is a field the faction card\'s eye removes, and the eyes leave the name and category on the floor', () => {
    expect(factionArchetype(PLANTS[0][1])).toBe('religious');
    expect(factionArchetype(PLANTS[1][1])).toBe('merchant');
    for (const [, p] of PLANTS) expect(factionArchetype(noDescription(p))).toBe('other');
    const eyeKeys = Object.values(CARD_KINDS.faction.fields).flat();
    expect(eyeKeys).toContain('description');
    // anchored: the line above asserts the same declaration's eye keys hold the description (the collection is live)
    for (const k of ['faction', 'name', 'category']) expect(eyeKeys).not.toContain(k);
    expect(isVeiledPower(PLANTS[0][1])).toBe(false);
  }, 120000);

  it('CONTROL: the OWNER\'s keeper does change with the description removed (the plant reaches the leaf), for each archetype', () => {
    for (const [want, power] of PLANTS) {
      const moved = towns.filter((t) => texts(t, withPower(t, power), 'owner') !== texts(t, withPower(t, noDescription(power)), 'owner'));
      expect(moved.length, want).toBeGreaterThan(0);
    }
  }, 120000);

  it('the READER\'s descriptions are byte-identical with the power\'s description present and removed', () => {
    const red = [];
    for (const [want, power] of PLANTS) {
      for (const t of towns) {
        if (texts(t, withPower(t, power), 'reader') !== texts(t, withPower(t, noDescription(power)), 'reader')) red.push(`${want} ${t.name}`);
      }
    }
    expect(red).toEqual([]);
  }, 120000);
});

/**
 * TRAD-4 UNIT 10 (the chair, reading the owner's thirty): NO TOWN PRINTS THE SAME SENTENCE IN TWO OF ITS RITES. Inside one
 * town a slot's wording is taken by rotation over the set the surface shows, in its order; the READER's rotation (CTR11) is
 * over the rites the reader is shown (the drawn set: shownTraditions.js :: descriptionSetOf(t, 'reader'), admitted at the
 * floor) and the reader's own composition, never over a row a DM can hide; every surface passes the same set.
 */
import { descriptionSetOf } from '../../src/domain/traditions/shownTraditions.js';
import { enumerateDossierObjects } from '../../src/domain/dossier/dossierSearch.js';

describe('TRAD-4 UNIT 10: the drawn rows print no sentence twice, and the reader\'s rotation is over the DRAWN set (CTR11)', () => {
  /** Every sentence printed in two or more of the texts, with its count. */
  const twice = (texts) => {
    /** @type {Map<string, number>} */
    const seen = new Map();
    for (const text of texts) for (const s of String(text || '').split(/(?<=\.) (?=\p{Lu})/u).filter(Boolean)) seen.set(s, (seen.get(s) || 0) + 1);
    return [...seen].filter(([, n]) => n >= 2).map(([s, n]) => `${n}x ${s}`);
  };
  // towns the 432 pool (tools/trad-pool.mjs) found printing a sentence twice, the owner's two samples first (not Zhongmen,
  // trad-c-metropolis-east_asian: four of its rites are kept at the market squares by one power and the keeper frames are
  // three, so its fourth keeps its pick: a slot that runs out is reported, not invented; tests/domain/traditionDescription.test.js
  // holds that rule: "A KEEPER SLOT THAT RUNS OUT")
  const towns = [
    ['city', 'celtic', 'trad-e-city-celtic'], ['town', 'norse', 'trad-a-town-norse'], ['town', 'norse', 'trad-d-town-norse'],
    ['town', 'south_asian', 'trad-d-town-south_asian'], ['hamlet', 'celtic', 'trad-c-hamlet-celtic'], ['metropolis', 'east_asian', 'trad-d-metropolis-east_asian'],
  ].map(([tier, culture, seed]) => born(tier, culture, seed));

  it('born towns the pool found repeating (Ringthwaite and Bergbrekka among them): no drawn row prints a sentence another row of its town prints', () => {
    expect(towns.slice(0, 2).map((t) => t.name)).toEqual(['Ringthwaite', 'Bergbrekka']);
    const found = [];
    for (const t of towns) for (const s of twice((sharedTraditionRowsOf(t) || []).map((r) => r.text))) found.push(`${t.name}: ${s}`);
    expect(found).toEqual([]);
  }, 120000);

  it('THE SAME SET ON EVERY SURFACE: the drawn rows, the player view\'s search and the leaf over the reader\'s set read alike; the owner\'s search and the leaf over the owner\'s set alike', () => {
    for (const t of towns) {
      const readerSet = descriptionSetOf(t, 'reader');
      const rows = sharedTraditionRowsOf(t) || [];
      expect(rows.map((r) => r.name), t.name).toEqual(readerSet.map((r) => String(r.name)));
      readerSet.forEach((rec, i) => expect(rows[i].text, `${t.name}: ${rec.name}`).toBe(describeTradition(rec, t, { audience: 'reader', set: readerSet })?.text ?? ''));
      const player = enumerateDossierObjects(t, { playerView: true }).objects.filter((o) => o.type === 'tradition');
      for (const o of player) {
        const i = readerSet.findIndex((r) => r.id === o.raw.id);
        if (i >= 0) expect(o.meta.description, `${t.name} player view: ${o.names[0]}`).toBe(rows[i].text);
      }
      const ownerSet = descriptionSetOf(t, 'owner');
      const own = enumerateDossierObjects(t, {}).objects.filter((o) => o.type === 'tradition');
      expect(own.map((o) => o.meta.description), t.name).toEqual(ownerSet.map((rec) => describeTradition(rec, t, { audience: 'owner', set: ownerSet })?.text ?? ''));
      expect(twice(own.map((o) => o.meta.description)), `${t.name} owner`).toEqual([]);
    }
  }, 120000);

  // THE CTR11 TOOTH: a rite the OWNER's set admits by a house's own tags and the floor drops (plant 2's DM-authored market
  // house, the town's only market) stands between two rites that fill the keeper slot the same way (the seat). Over the
  // owner's set the later rite would rotate past it; the reader's rotation never sees it.
  const b = born('town', 'latin', 'trad-plant2-town-latin-0');
  const HOUSE = { name: 'The Lantern Exchange', category: 'Economy', tags: ['market'] };
  const first = deriveFoundingTraditions(b).find((r) => r.coreMotif.element === 'first-landing');
  const riteAt = (n, name, element, act) => ({ ...first, id: first.id.replace(/\.\d+$/, `.${n}`), name, foundedYear: 30, coreMotif: { element, act } });
  const plant = (n) => {
    const fair = riteAt(n, 'The Charter Fair', 'charter', 'fair');
    const procession = riteAt(99, 'The Charter Procession', 'charter', 'procession');
    return { fair, procession, t: { ...b, institutions: [...b.institutions.filter((i) => !isMarketInstitution(i)), HOUSE], traditions: [first, fair, procession] } };
  };
  // the fair's id is chosen so that, over the owner's set, the procession's reader text WOULD move (null: no id does)
  const tooth = (() => {
    for (let n = 3; n < 60; n += 1) {
      const p = plant(n);
      const over = describeTradition(p.procession, p.t, { audience: 'reader', set: [first, p.fair, p.procession] })?.text;
      if (over !== describeTradition(p.procession, p.t, { audience: 'reader', set: [first, p.procession] })?.text) return p;
    }
    return null;
  })();
  const { fair, procession, t } = tooth || plant(3);
  const veiled = applyVeil(t, new Set([`field:institution:${CARD_KINDS.institution.idOf(HOUSE)}:function`]));
  const stripped = { ...t, institutions: t.institutions.map((i) => (i.name === HOUSE.name ? { name: i.name, category: i.category } : i)) };

  it('NOT VACUOUS: the owner\'s set holds the fair between the two; the reader\'s set drops it; over the owner\'s set the procession\'s reader text would move', () => {
    expect(tooth, 'a fair id that moves the procession over the owner\'s set').not.toBeNull();
    expect(descriptionSetOf(t, 'owner').map((r) => r.id)).toEqual([first.id, fair.id, procession.id]);
    expect(descriptionSetOf(t, 'reader').map((r) => r.id)).toEqual([first.id, procession.id]);
  }, 120000);

  it('the drawn rows and the player view\'s descriptions are byte-identical with the house\'s function eye open, shut by applyVeil, and its fields removed by hand', () => {
    const read = (s) => JSON.stringify({
      rows: sharedTraditionRowsOf(s),
      player: enumerateDossierObjects(s, { playerView: true }).objects.filter((o) => o.type === 'tradition' && o.raw.id !== fair.id).map((o) => o.meta.description),
    });
    expect(read(veiled), 'applyVeil').toBe(read(t));
    expect(read(stripped), 'by hand').toBe(read(t));
    const procText = sharedTraditionRowsOf(t).find((r) => r.name === procession.name).text;
    expect(enumerateDossierObjects(t, { playerView: true }).objects.find((o) => o.raw.id === procession.id).meta.description).toBe(procText);
  }, 120000);

  // THE PIN (TRAD-5 unit 13, the chair's security condition): a held element's later rite reads "also" only where an earlier
  // rite of THE AUDIENCE'S OWN SHOWN SET holds the element. Here the charter fair (the procession's earlier rite of the same
  // element) stands in the owner's set and is withheld from the reader's: the owner's procession says "also"; the reader's
  // drawn row and player view print the present gloss, and are byte-identical with the house's function eye open or shut.
  const CHARTER = ['honours the charter', 'marks the granting of the charter', 'remembers the charter'];
  const s1 = (text) => String(text).slice(0, String(text).indexOf('.') + 1);
  it('THE PIN: the owner\'s procession (its charter fair shown before it) prints "also"; the reader\'s, whose set withholds the fair, prints the present gloss', () => {
    expect(fair.coreMotif.element).toBe(procession.coreMotif.element); // not vacuous: one element, two rites
    const owner = describeTradition(procession, t, { audience: 'owner', set: descriptionSetOf(t, 'owner') }).text;
    expect(s1(owner)).toMatch(/ that also honours the charter\.$/);
    const row = sharedTraditionRowsOf(t).find((r) => r.name === procession.name).text;
    const player = enumerateDossierObjects(t, { playerView: true }).objects.find((o) => o.raw.id === procession.id).meta.description;
    for (const [where, text] of [['drawn row', row], ['player view', player], ['veiled', sharedTraditionRowsOf(veiled).find((r) => r.name === procession.name).text]]) {
      // anchored: the owner's text of this same rite over the owner's set is asserted above to say "also"
      expect(s1(text), where).not.toMatch(/\balso\b/);
      expect(CHARTER.some((g) => s1(text).endsWith(` that ${g}.`)), `${where}: ${s1(text)}`).toBe(true);
    }
  }, 120000);
});
