/**
 * galleryVeilRecent.pglite.test.js — R5-RECENT's RED FIRST, item 1 (VEIL-33's V33-R5R; the chair's E78 (1) of 2026-11-22
 * 12:21 UTC, vetoable by the owner; docs/chair/2026-11-20/veil/briefs/R5-RECENT-BRIEF.md): A POWER THE READ WITHHOLDS IS
 * NAMED ON A SHARED READ, by `powerStructure.recentConflict` (registry row power.recentConflict, its host PLANNED: built in
 * neither engine). BOTH ENGINES: 212 through the server on a pglite chain of every migration on disk; the twin
 * (projectShareVeil over galleryPayloadFor) beside it. galleryVeilTell5's harness: every setting of the owner's switch (own,
 * the mixed g:<bits>, allOpen, off) and `shown` (the own setting with every hideable house shown by hand), Reveal DM off and
 * on, BOTH STORED SHAPES (the new shape; master's, the powers also in the top-level factions[]); the gallery read at every
 * setting, the party link, the import and the campaign map's member at the own setting (the map's member and the link are
 * the player view: their twin is read with Reveal DM off).
 *
 * THE RULE (E78 (1), as ruled): on every shared read, `powerStructure.recentConflict` IS WITHHELD wherever it NAMES A POWER
 * THE READ WITHHOLDS (by rule: a power of the stored lists that neither served list names; or by the owner: a power flagged
 * `hidden`), in both engines. WITHHELD, NOT MASKED: on such a read the served value is the key's absence or the empty form
 * (null or ''; the writer measures which, ruling 62 (2)); a served sentence that names the power (by the lane's fold,
 * gallerySecondHomes.js :: buildNameSearch, the served powers' and houses' names its open names), carries the projection's
 * mask ("an unseen interest") or is any other rewrite of the stored sentence is a fault. server = twin at the key.
 *
 * A power the owner hid is withheld where the read does not serve its row (the player view; on Reveal DM its row is served).
 *
 * THE PLANTS (each its own arm, RED at abd68e653 by design: the cure is the writer's):
 *   (a) a hidden criminal house whose criminal power took the seat (power.entry withholds it), the sentence naming it;
 *   (b) the same naming a power the OWNER hid (`hidden: true`);
 *   (c) the name in another spelling: the bare form without its qualifier, a possessive, lower case (and lower case on (b)).
 * THE TEETH (GREEN, or the seat STOPs): a sentence naming only SERVED powers is served byte for byte, both engines, every read
 * (beside a withheld criminal power, and beside an owner-hidden one); on a read that hides nothing it is served as stored.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { appendFileSync } from 'node:fs';
import { bootChain, OWNER } from './veilChain.shared.mjs';
import { buildNameSearch } from '../../src/domain/display/gallerySecondHomes.js';
import { HIDDEN_POWER_MASK } from '../../src/domain/display/publicSafe.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';

const ARM_TIMEOUT_MS = 600_000; // deadlock guard, not a perf budget
const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const arr = (v) => (Array.isArray(v) ? v : []);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = (v) => JSON.stringify(v);
const canon = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
/** The measures the hand-back quotes, to R5R_MEASURES where it is set (the config silences the console). */
const note = (...a) => { if (process.env.R5R_MEASURES) appendFileSync(process.env.R5R_MEASURES, `${a.join(' ')}\n`); };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const CRIM = OPEN.slice(0, 3);

// ── THE TOWNS ────────────────────────────────────────────────────────────
const TGC = Object.freeze({ id: 'inst-r5-tgc', name: "Thieves' guild chapter", category: 'Criminal', desc: 'A chapter of the guild.' });
const FISH = Object.freeze({ id: 'inst-r5-fish', name: 'Fish market', category: 'Economy', desc: 'Fish, salted and fresh.' });
const MILL = Object.freeze({ id: 'inst-r5-mill', name: 'Mill', category: 'Economy', desc: 'Grain, ground fine.' });
const TG = "Thieves' Guild";
const TGP = "Thieves' Guild (powerful)";
const HAND = 'Silent Hand';
/** The witness's shape (jp6-metropolis-0, act K): the criminal power is NOT the governing one, so power.entry withholds it. */
const takerPowers = (taker) => [{ faction: 'Shadow Senate', category: 'civic', power: 50, isGoverning: true, desc: 'The senate sits behind closed doors.' },
  { faction: taker, category: 'criminal', power: 30, desc: 'The guild takes its cut.' },
  { faction: 'Fishers', category: 'economic', power: 20, desc: 'The fishers keep the quay.' }];
/** A power the OWNER hid (`hidden: true`, the stress infiltrator's stamp). */
const ownerPowers = () => [{ faction: 'Town Council', category: 'civic', power: 50, isGoverning: true, desc: 'The council sits weekly.' },
  { faction: HAND, category: 'civic', power: 25, hidden: true, desc: 'Nobody says who they are.' },
  { faction: 'Fishers', category: 'economic', power: 25, desc: 'The fishers keep the quay.' }];
const openPowers = () => [{ faction: 'Reeve', category: 'civic', power: 60, isGoverning: true, desc: 'The reeve keeps the rolls.' },
  { faction: 'Millers', category: 'economic', power: 40, desc: 'The millers keep the weir.' }];
const townOf = (name, factions, recent, houses = [TGC, FISH]) => ({
  name, tier: 'town', institutions: clone(houses),
  powerStructure: { factions: clone(factions), factionRelationships: [{ pair: [factions[0].faction, factions[factions.length - 1].faction], type: 'ally' }], recentConflict: recent },
  economicState: { safetyProfile: { crimeTypes: [] } },
});
/** The own setting's engine-reads (2 engines x 2 shapes x 7: Reveal off gallery, map, link, import; on, gallery, map, import). */
const ALL_OWN = 2 * 2 * 7;
/** Of them, the player view's (Reveal off, and the map's member whatever the share says): where an owner-hidden row is dropped. */
const PLAYER_OWN = 2 * 2 * 5;
/** THE PLANTS: each names the power its read withholds (`target`), stored once in the sentence; `ownWithheld` the own
 * setting's engine-reads that withhold it. */
const PLANTS = Object.freeze([
  { arm: '(a)', seed: 'r5-taker', target: TG, ownWithheld: ALL_OWN, how: 'a hidden criminal house\'s criminal power took the seat, named as itself',
    stored: townOf('Saltreach', takerPowers(TG), `${TG} overthrew the grand merchant oligarchy and reshaped the government as a shadow senate.`) },
  { arm: '(b)', seed: 'r5-owner', target: HAND, ownWithheld: PLAYER_OWN, how: 'a power the OWNER hid (hidden: true), named as itself',
    stored: townOf('Greywater', ownerPowers(), `${HAND} overthrew the council's old guard and reshaped the government as a shadow senate.`) },
  { arm: '(c)', seed: 'r5-bare', target: TGP, ownWithheld: ALL_OWN, how: 'the withheld power\'s BARE form, without its qualifier',
    stored: townOf('Copperhythe', takerPowers(TGP), `${TG} overthrew the grand merchant oligarchy and reshaped the government as a shadow senate.`) },
  { arm: '(c)', seed: 'r5-possessive', target: TG, ownWithheld: ALL_OWN, how: 'a POSSESSIVE of the withheld power',
    stored: townOf('Wrackmouth', takerPowers(TG), `The ${TG}'s enforcers overthrew the grand merchant oligarchy, and a shadow senate sits in its place.`) },
  { arm: '(c)', seed: 'r5-lower', target: TG, ownWithheld: ALL_OWN, how: 'the withheld power in LOWER CASE',
    stored: townOf('Eelford', takerPowers(TG), "the thieves' guild overthrew the grand merchant oligarchy and reshaped the government as a shadow senate.") },
  { arm: '(c)', seed: 'r5-owner-lower', target: HAND, ownWithheld: PLAYER_OWN, how: 'the owner-hidden power in LOWER CASE (past the mask)',
    stored: townOf('Duskmere', ownerPowers(), 'Since the silent hand overthrew the old guard, the town answers to a shadow senate.') },
]);
/** THE TEETH: a sentence naming only served powers, beside a withheld criminal power and beside an owner-hidden one; a town
 * that hides nothing (no hideable house, no hidden power). */
const TEETH = Object.freeze([
  { seed: 'r5-served', stored: townOf('Harrowgate', takerPowers(TG), 'The Fishers overthrew the grand merchant oligarchy and reshaped the government as a shadow senate.') },
  { seed: 'r5-owner-served', stored: townOf('Lowmoor', ownerPowers(), 'The Fishers overthrew the old guard and left the Town Council to sit in its place.') },
]);
const OPEN_TOWN = Object.freeze({ seed: 'r5-open', stored: townOf('Millbrook', openPowers(), "The Millers overthrew the reeve's old bailiff and reshaped the government as a council of elders.", [MILL]) });
/** BOTH STORED SHAPES: the new one, and master's (the powers also in the top-level factions[], R3's 'openM'). */
const SHAPES = Object.freeze({ new: (s) => clone(s), master: (s) => ({ ...clone(s), factions: clone(s.powerStructure.factions) }) });

// ── THE JUDGMENT ─────────────────────────────────────────────────────────
const listsOf = (x) => [...arr(x?.powerStructure?.factions), ...arr(x?.factions)].filter(isRec);
/** The powers a read withholds: every name (and id, as text) of a stored power that neither served list names, whether the
 * rule withheld it (power.entry) or the owner hid it (`hidden: true`: the projection drops its row on the player view).
 * MEASURED (run 1, the twin and 212 alike): on Reveal DM the owner-hidden row IS SERVED, `hidden: true` on it, and the
 * sentence names it unmasked; that read does not withhold the power, so it is not judged here (the hand-back says so). */
function withheldOf(stored, d) {
  const served = new Set(listsOf(d).flatMap((f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v)));
  const out = new Set();
  for (const f of listsOf(stored)) {
    const names = [f.faction, f.name].filter((v) => typeof v === 'string' && v);
    if (!names.length || names.some((n) => served.has(n))) continue;
    for (const v of [...names, typeof f.id === 'number' ? String(f.id) : f.id]) if (typeof v === 'string' && v) out.add(v);
  }
  return [...out];
}
/** The names of the powers and houses a document serves (the search's open names, ruling 37 (a)). */
const servedNamesOf = (d) => [...new Set([...listsOf(d).flatMap((f) => [f.faction, f.name]), ...arr(d?.institutions).filter(isRec).map((h) => h.name)]
  .filter((v) => typeof v === 'string' && v))];
/** Whether a string names a withheld power by THE LANE'S FOLD (itself and its bare form, case-blind, a possessive and a plural
 * ending as a boundary), the served names its open names; the ONLY exemption a hit lying wholly inside a name the same
 * document serves (galleryRosterChoices.pglite.test.js :: searchHits, its rule); an id as the whole text. */
function namesWithheld(text, withheld, d) {
  if (typeof text !== 'string' || text === '') return false;
  if (withheld.includes(text)) return true;
  const words = withheld.filter((t) => !/^\d+$/.test(t));
  const opens = servedNamesOf(d);
  const bare = buildNameSearch(words, []);
  const search = buildNameSearch(words, opens);
  if (!bare || !bare.hit(text)) return false;
  if (search && search.hit(text)) return true;
  const holders = opens.filter((n) => text.includes(n) && bare.hit(n));
  return !holders.length || bare.hit(holders.reduce((x, n) => x.split(n).join(' '), text));
}
/** The served key: { has, v }. */
const recentOf = (d) => (isRec(d?.powerStructure) && Object.prototype.hasOwnProperty.call(d.powerStructure, 'recentConflict')
  ? { has: true, v: d.powerStructure.recentConflict } : { has: false });
/** The empty forms the rule admits on a read that withholds the named power (the writer measures which, ruling 62 (2)). */
const isWithheldForm = (k) => !k.has || k.v === null || k.v === '';
/** One engine's fault on a GATED read (the stored sentence names a power the read withholds), or null. */
function gatedFault(want, k, wh, d) {
  if (isWithheldForm(k)) return null;
  if (namesWithheld(k.v, wh, d)) return 'names the withheld power';
  if (typeof k.v === 'string' && k.v.includes(HIDDEN_POWER_MASK) && !want.includes(HIDDEN_POWER_MASK)) return 'serves the mask\'s form';
  return 'serves a rewritten form';
}

describe('R5-RECENT (E78 (1)): powerStructure.recentConflict naming a power the read withholds, the twin against 212', () => {
  let db;
  let veil;
  let sw;
  let m = 0;
  const at = '2026-11-01T00:00:00.000Z';
  const opened = (as) => as.map((a) => ({ address: a, hidden: false }));
  const cache = new Map();
  /** The owner's switch settings, each computed on the record read (tell-common.mjs :: settings; g:111 is own), and `shown`. */
  const settingsOf = (stored, dm) => {
    const pub = veil.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: null });
    const model = veil.curateModelFor(pub, []);
    const present = sw.presentCriminalGroupings(pub);
    const out = { own: opened(OPEN) };
    for (let b = 0; b < 7; b += 1) {
      const bits = [4, 2, 1].map((x) => ((b & x) ? '1' : '0')).join('');
      out[`g:${bits}`] = opened(['tab:plot_hooks', ...CRIM.filter((_g, i) => bits[i] === '1')]);
    }
    out.allOpen = sw.setCriminalVeil(opened(OPEN), model.defaults, false, present, model).filter((d) => !String(d.address).startsWith('card:institution:'));
    out.off = sw.setCriminalVeil(opened(OPEN), model.defaults, true, present, model);
    const idOf = (h) => veil.CARD_KINDS.institution.idOf(h);
    const shows = arr(stored.institutions).filter((h) => isHideableHouse(h))
      .flatMap((h) => [`card:institution:${idOf(h)}`, ...['description', 'function', 'services', 'people'].map((f) => `field:institution:${idOf(h)}:${f}`)]);
    out.shown = opened([...OPEN, ...shows]);
    return out;
  };
  /** Every read of one record in one stored shape, both engines: [{ shape, setting, dm, read, server, twin }]. */
  const readAll = async (stored, shape) => {
    const out = [];
    for (const dm of [false, true]) for (const [setting, deltas] of Object.entries(settingsOf(stored, dm))) {
      m += 1;
      const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at });
      const id = `7e5c7000-0000-0000-0000-${String(m).padStart(12, '0')}`;
      const slug = `r5r${m}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(stored.name), String(stored.tier), J(stored), slug, `${slug}-link`, J(ov), dm]);
      await db.exec(`set test.uid = '';`);
      const docs = { gallery: (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d };
      if (setting === 'own') {
        await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
          values (gen_random_uuid(), $1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, J({ campaign: { settlementIds: [id] } }), `${slug}-map`, `${slug}-mapl`]);
        docs.map = (await db.query('select public.get_gallery_map($1) #> \'{members,0,settlement}\' d', [`${slug}-map`])).rows[0]?.d;
        if (!dm) docs.link = (await db.query('select public.get_unlisted_dossier($1) -> \'dossier\' d', [`${slug}-link`])).rows[0]?.d;
        await db.exec(`set test.uid = '${READER}';`);
        docs.import = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [slug])).rows[0]?.d;
        await db.exec(`set test.uid = '';`);
      }
      const twinOf = (d) => veil.projectShareVeil(veil.galleryPayloadFor(clone(stored), { shareDm: d, memberOverrides: ov }), ov);
      const twin = twinOf(dm); const twinOff = dm ? twinOf(false) : twin;
      for (const [read, d] of Object.entries(docs)) {
        out.push({ shape, setting, dm, read, server: isRec(d) ? d : null, twin: read === 'map' || read === 'link' ? twinOff : twin });
      }
    }
    return out;
  };
  /** Every read of a town, both stored shapes (read once, kept for the later arms). */
  const readsOf = async (town) => {
    if (!cache.has(town.seed)) {
      const out = [];
      for (const [shape, make] of Object.entries(SHAPES)) {
        const stored = make(town.stored);
        for (const r of await readAll(stored, shape)) out.push({ ...r, stored });
      }
      cache.set(town.seed, out);
    }
    return cache.get(town.seed);
  };
  const tag = (r, eng) => `${eng} ${r.shape} ${r.read} ${r.setting} dm=${r.dm}`;
  /** Per read and engine: the withheld powers, whether the stored sentence names one (gated), and the served key. */
  const judged = (r) => [['server', r.server], ['twin', r.twin]].filter(([, d]) => isRec(d)).map(([eng, d]) => {
    const want = r.stored.powerStructure.recentConflict;
    const wh = withheldOf(r.stored, d);
    return { eng, d, want, wh, gated: namesWithheld(want, wh, d), k: recentOf(d) };
  });
  /** The reads a town's every shape serves: 2 shapes x 2 Reveal DM x 11 settings gallery, + map and import (x2), + link. */
  const READS_PER_TOWN = 2 * (2 * 11 + 2 * 2 + 1);

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    veil = await import('../../src/domain/display/galleryVeil.js');
    sw = await import('../../src/domain/display/criminalVeilSwitch.js');
  }, PGLITE_BOOT_TIMEOUT_MS);
  afterAll(async () => { if (db) await db.close(); });

  for (const p of PLANTS) {
    it(`PLANT ${p.arm} ${p.seed} (${p.how}): on every read that withholds the power, recentConflict is withheld (the key's absence or the empty form), never naming it by the lane's fold and never masked, both engines, every setting, Reveal DM off and on, both stored shapes; server = twin`, async () => {
      const rs = await readsOf(p);
      const faults = []; let gated = 0; let gatedOwn = 0; let own = 0; let ownWh = 0;
      for (const r of rs) {
        const js = judged(r);
        for (const j of js) {
          if (r.setting === 'own') own += 1;
          if (r.setting === 'own' && j.wh.includes(p.target)) ownWh += 1;
          if (!j.gated) continue;
          gated += 1;
          if (r.setting === 'own' && j.wh.includes(p.target)) gatedOwn += 1;
          const f = gatedFault(j.want, j.k, j.wh, j.d);
          if (f) faults.push(`${tag(r, j.eng)}: ${f}: ${J(j.k.v).slice(0, 120)}`);
        }
        if (js.length === 2 && canon(js[0].k) !== canon(js[1].k)) faults.push(`${tag(r, 'server!=twin')}: server ${J(js[0].k)} | twin ${J(js[1].k)}`.slice(0, 260));
        else if (js.length !== 2) faults.push(`${tag(r, 'server!=twin')}: a document served by ${js.map((j) => j.eng).join('') || 'neither engine'} alone`);
      }
      note(`R5R plant ${p.arm} ${p.seed}: reads`, rs.length, '| gated reads (engine x read)', gated, '| own engine-reads withholding the target', ownWh, '| of them gated', gatedOwn, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '');
      // THE PLANT REACHES THE GATE (green: the red below is the rule's, not the plant's)
      expect(rs.length, 'every read was made').toBe(READS_PER_TOWN);
      expect(own, 'both engines served every read of the own setting').toBe(ALL_OWN);
      expect(ownWh, 'the own setting withholds the target on the reads the plant names, both engines, both shapes').toBe(p.ownWithheld);
      expect(gatedOwn, 'on each of them the stored sentence names the target (the lane\'s fold)').toBe(ownWh);
      // anchored: gated counts the reads judged (asserted above), so an empty fault list is a judgment, not an empty walk
      expect(faults, `${faults.length} faults over ${gated} gated engine-reads`).toEqual([]);
    }, ARM_TIMEOUT_MS);
  }

  for (const t of TEETH) {
    it(`TOOTH ${t.seed}: recentConflict naming only SERVED powers is served byte for byte, both engines, every read and setting, Reveal DM off and on, both stored shapes`, async () => {
      const rs = await readsOf(t);
      const faults = []; let beside = 0; let judgedN = 0;
      for (const r of rs) for (const j of judged(r)) {
        judgedN += 1;
        if (j.wh.length) beside += 1;
        if (j.gated) faults.push(`${tag(r, j.eng)}: the tooth's sentence reads as naming a withheld power ${J(j.wh)}`);
        else if (!(j.k.has && j.k.v === j.want)) faults.push(`${tag(r, j.eng)}: not served byte for byte: ${J(j.k)}`.slice(0, 260));
      }
      note(`R5R tooth ${t.seed}: engine-reads`, judgedN, '| beside a withheld power', beside, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '');
      expect(judgedN, 'both engines served every read').toBe(2 * READS_PER_TOWN);
      expect(beside, 'the tooth stands beside a withheld power on the gated reads').toBeGreaterThan(0);
      // anchored: judgedN is asserted above, so an empty fault list is a judgment over every engine-read
      expect(faults).toEqual([]);
    }, ARM_TIMEOUT_MS);
  }

  it('TOOTH: on a read that hides nothing (no power withheld, every stored house served), recentConflict is served as stored, both engines; the open town on every read, and every such read of every town', async () => {
    const faults = []; let open = 0; let fromOthers = 0;
    for (const town of [OPEN_TOWN, ...TEETH, ...PLANTS]) for (const r of await readsOf(town)) for (const j of judged(r)) {
      const houses = new Set(arr(j.d.institutions).filter(isRec).map((h) => h.name));
      const hidesNothing = !j.wh.length && arr(r.stored.institutions).every((h) => houses.has(h.name));
      if (town === OPEN_TOWN && !hidesNothing) { faults.push(`${town.seed} ${tag(r, j.eng)}: the open town's read hides something ${J(j.wh)}`); continue; }
      if (!hidesNothing) continue;
      if (town === OPEN_TOWN) open += 1; else fromOthers += 1;
      if (!(j.k.has && j.k.v === j.want)) faults.push(`${town.seed} ${tag(r, j.eng)}: not served as stored: ${J(j.k)}`.slice(0, 260));
    }
    note('R5R tooth hides-nothing: the open town\'s engine-reads', open, '| other towns\' reads that hide nothing', fromOthers, '| faults', faults.length, faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '');
    expect(open, 'the open town hides nothing on every engine-read').toBe(2 * READS_PER_TOWN);
    // anchored: open is asserted above, so an empty fault list is a judgment over every read that hides nothing
    expect(faults).toEqual([]);
  }, ARM_TIMEOUT_MS);
});
