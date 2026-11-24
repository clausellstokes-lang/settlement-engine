// V53 REDS-CAUSE reds (3) and (4): built from the TRAD-2 test's own helpers (lines copied by sed, paths made absolute) plus the probe's reads.
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '/home/user/join53/src/generators/generateSettlementPipeline.js';
import { deriveFoundingTraditions } from '/home/user/join53/src/domain/traditions/genesis.js';
import { toPublicSafe } from '/home/user/join53/src/domain/display/publicSafe.js';
import { projectShareVeil, writeShareVeil } from '/home/user/join53/src/domain/display/galleryVeil.js';
import { describeTradition } from '/home/user/join53/src/domain/traditions/traditionDescription.js';

const partyLink = (record) => projectShareVeil(toPublicSafe(record), writeShareVeil(null, []));

import { composePublicProse } from '/home/user/join53/src/components/new/publicProseCompose.js';
import { publicProseOf, withPublicProse } from '/home/user/join53/src/domain/display/publicProse.js';
import { shownTraditionsOf, sharedTraditionRowsOf } from '/home/user/join53/src/domain/traditions/shownTraditions.js';
import { isHideableHouse } from '/home/user/join53/src/domain/people/cardVeil.js';
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
} from '/home/user/join53/src/domain/display/galleryVeil.js';
import { isCriminalInstitution, isVeiledPower } from '/home/user/join53/src/domain/people/cardVeil.js';
import { cardHouseOf } from '/home/user/join53/src/domain/people/cardPowers.js';
import { crisisOf } from '/home/user/join53/src/domain/facts/crisisKind.js';
import { governingFactionOf, nameOf } from '/home/user/join53/src/domain/rulingPower.js';
import { factionArchetype } from '/home/user/join53/src/domain/factionArchetypes.js';
import { deepClone } from '/home/user/join53/src/domain/clone.js';

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

import { writeFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
const J = '/home/user/join53';
it('r34', async () => {
  const out = [];
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
  // NOT VACUOUS: the People eye
  for (const t of towns) out.push(`R4 NV ${t.tier} here:people=${t.here.filter((a) => a.endsWith(':people')).length} v22:people=${t.v22.filter((a) => a.endsWith(':people')).length} added=${t.v22.filter((a) => !t.here.includes(a)).length} addedPeople=${t.v22.filter((a) => !t.here.includes(a) && a.endsWith(':people')).length} sample=${JSON.stringify(t.here.filter((a) => a.endsWith(':people')).slice(0, 2))}`);
  out.push(`R4 NV CLASSES=${JSON.stringify(CLASSES)}`);
  const stored = towns.find((t) => Array.isArray(t.raw.factions));
  out.push(`R4 NV rosterCopies=${copiesOf(stored.raw, 'npc').length} vs npcs=${copiesOf({ npcs: stored.raw.npcs }, 'npc').length}`);
  out.push(`R4 NV income=${!!towns.find((t) => { const rows = t.raw.economicState?.incomeSources || []; return rows[0]?.isCriminal === true && rows[1]?.source === 'Market Taxes'; })} crisisActive=${towns.some((t) => crisisOf(t.raw).active)}`);
  // CONTROL
  const t = towns.find((x) => hiddenNamesOf(x.raw, x.pub, applyVeil(x.pub, allHidden(x))).houses.length > 0);
  const hidden = hiddenNamesOf(t.raw, t.pub, applyVeil(t.pub, allHidden(t)));
  const plant = (name) => t.rows.map((r, i) => (i === 0 ? { ...r, text: `${r.text} It is kept by ${name}.` } : r));
  out.push(`R4 CONTROL town=${t.tier} houses=${JSON.stringify(hidden.houses)} named=${JSON.stringify(namedHidden(plant(hidden.houses[0]), hidden))} valuesHolding=${JSON.stringify(hidden.values.filter((v) => `${t.rows[0].text} It is kept by ${hidden.houses[0]}.`.includes(v)))} powersHolding=${JSON.stringify(hidden.powers.filter((p) => String(hidden.houses[0]).toLowerCase().includes(String(p).toLowerCase())))}`);
  // (a)/(b)
  for (const tt of towns) {
    const veil = allHidden(tt);
    for (const [nm, doc, before] of [['served', applyVeil(tt.pub, veil), tt.pub], ['drawn', hiddenFrom(tt.raw, veil), tt.raw]]) {
      const floor = (f) => [nameOf(f), f.category, f.power, f.isGoverning === true, factionArchetype(f)];
      const powers = (s) => (s.powerStructure?.factions || []).filter((f) => !isVeiledPower(f)).map(floor);
      const a = powers(doc); const b = powers(before);
      if (JSON.stringify(a) !== JSON.stringify(b)) {
        const veiledShare = (before.powerStructure?.factions || []).filter((f) => isVeiledPower(f)).map((f) => [nameOf(f), f.power]);
        out.push(`R4 AB ${tt.tier} ${nm} before=${JSON.stringify(b)} after=${JSON.stringify(a)} veiledInBefore=${JSON.stringify(veiledShare)} sumBefore=${b.reduce((x, r) => x + (r[2] || 0), 0)} sumAfter=${a.reduce((x, r) => x + (r[2] || 0), 0)}`);
      }
      const crisis = (s) => { const c = crisisOf(s); return [c.types, c.kinds, c.families, c.conditionKinds]; };
      const events = (s) => (s.history?.historicalEvents || []).map((e) => [e.name, e.templateType, e.severity, e.yearsAgo]);
      const other = { seat: nameOf(governingFactionOf(doc)) === nameOf(governingFactionOf(before)), crisis: JSON.stringify(crisis(doc)) === JSON.stringify(crisis(before)), events: JSON.stringify(events(doc)) === JSON.stringify(events(before)), founding: doc.history?.founding?.age === before.history?.founding?.age && doc.history?.founding?.foundedBy === before.history?.founding?.foundedBy };
      if (Object.values(other).some((v) => !v)) out.push(`R4 AB-OTHER ${tt.tier} ${nm} ${JSON.stringify(other)}`);
    }
  }
  // ---- red (3): hxd-city-138
  const { birthConfig, loadGenerationLawPayloads } = await import(`${J}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${J}/src/store/configSlice.js`);
  const { CAUSE_HOUSES } = await import(`${J}/src/domain/facts/causeHouses.js`);
  const { tensionCauseSentenceOf } = await import(`${J}/src/domain/display/tensionCause.js`);
  const { writeShareVeil } = await import(`${J}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const doc = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: 'hxd-city-138', customContent: {} });
  const hide = (r) => { const pub = toPublicSafe(r); return applyVeil(pub, resolveVeil(defaultVeilFor(pub), null)); };
  const isBlackMarket = (i) => CAUSE_HOUSES.blackMarket.has(String(i?.name ?? '').trim().toLowerCase());
  const tn = doc.history.currentTensions.find((x) => x.type === 'crime_wave');
  const served = hide(doc);
  const crim = (s) => ({ crimHouses: (s.institutions || []).filter((h) => String(h.category).toLowerCase() === 'criminal' || String(h.priorityCategory).toLowerCase() === 'criminal').map((h) => h.name), crimPowers: (s.powerStructure?.factions || []).filter((f) => String(f.category).toLowerCase() === 'criminal').map((f) => f.faction) });
  const twin = structuredClone(doc); twin.institutions = twin.institutions.filter((i) => !isBlackMarket(i));
  out.push(`R3 own tensions=${JSON.stringify(doc.history.currentTensions.map((x) => x.type))} crime=${JSON.stringify(crim(doc))} ownSentence=${JSON.stringify(tensionCauseSentenceOf(doc, tn))}`);
  out.push(`R3 served tensions=${JSON.stringify(served.history.currentTensions.map((x) => x.type))} crime=${JSON.stringify(crim(served))} t2=${JSON.stringify(served.history.currentTensions.find((x) => x.type === 'crime_wave') ?? null)}`);
  out.push(`R3 twin tensions=${JSON.stringify(twin.history.currentTensions.map((x) => x.type))} crime=${JSON.stringify(crim(twin))} twinSentence=${JSON.stringify(tensionCauseSentenceOf(twin, tn))} hide(twin) tensions=${JSON.stringify(hide(twin).history.currentTensions.map((x) => x.type))}`);
  // the served document with the crime_wave tension handed back (does the sentence then print?)
  const back = structuredClone(served); back.history.currentTensions = [...back.history.currentTensions, structuredClone(tn)];
  out.push(`R3 served+tensionBack sentence=${JSON.stringify(tensionCauseSentenceOf(back, tn))}`);
  // (c) the server
  const { bootChain, storeShare } = await import(`${J}/tests/security/veilChain.shared.mjs`);
  const db = new PGlite({ extensions: { pgcrypto } });
  const failed = await bootChain(db);
  out.push(`C boot failed=${JSON.stringify(failed)}`);
  const st = JSON.parse(JSON.stringify(withPublicProse(doc, composePublicProse(doc))));
  await storeShare(db, { town: st, slug: 'c-hxd-city-138', overrides: writeShareVeil({}, []), shareDm: false });
  const sv = (await db.query('select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g', ['c-hxd-city-138'])).rows[0]?.d;
  out.push(`R3 C server tensions=${JSON.stringify((sv?.history?.currentTensions || []).map((x) => x.type))} crime=${JSON.stringify(crim(sv || {}))} sentence=${JSON.stringify(tensionCauseSentenceOf(sv, (sv?.history?.currentTensions || []).find((x) => x.type === 'crime_wave')))}`);
  // (c) red 4: the metropolis served by the server: the powers' floor
  const metro = towns.find((x) => x.tier === 'metropolis');
  const ms = JSON.parse(JSON.stringify(metro.saved));
  await storeShare(db, { town: ms, slug: 'c-metro', overrides: writeShareVeil({}, []), shareDm: false });
  const msv = (await db.query('select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g', ['c-metro'])).rows[0]?.d;
  const floor = (f) => [nameOf(f), f.power];
  out.push(`R4 C server metropolis powers=${JSON.stringify((msv?.powerStructure?.factions || []).filter((f) => !isVeiledPower(f)).map(floor))} twin(default veil)=${JSON.stringify((applyVeil(metro.pub, resolveVeil(defaultVeilFor(metro.pub), null)).powerStructure?.factions || []).filter((f) => !isVeiledPower(f)).map(floor))} owner=${JSON.stringify((metro.raw.powerStructure?.factions || []).map((f) => [nameOf(f), f.power, isVeiledPower(f)]))}`);
  writeFileSync('/var/tmp/v53/redscause/r34.out', out.join('\n') + '\n');
}, 900000);
