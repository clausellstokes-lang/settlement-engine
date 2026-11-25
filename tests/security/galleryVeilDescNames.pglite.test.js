/**
 * galleryVeilDescNames.pglite.test.js — DESCARM, the red-first arm of VEIL-51's unit 4 (R5-DESC narrowed; the tenth chair's
 * order of 2026-11-24 23:49 UTC; brief docs/chair/2026-11-24/tenth/veil/v51/u4/DESCARM-BRIEF.md): A SHOWN POWER'S DESCRIPTION
 * NAMES A POWER THE READ WITHHOLDS. RED BY DESIGN until R5-DESC's cure (the writer's; this file is the instrument only).
 *
 * THE CLASS (measured by the lane): a power's `desc` ends in a STANDING written over the WHOLE stored roster
 * (src/generators/power/factionStanding.js :: annotateFactionStanding: "... they play <A> and <B> against each other ...").
 * Where a read withholds <A> (its criminal house hidden: the rule power.entry), both engines serve the shown power's desc as
 * stored, so the served text names a power the read withholds. server = twin there, so "server = twin" never caught it.
 *
 * THE PLACES: (i) two births by the gate's recipe (galleryVeilDesc.pglite.test.js :: poolOf at aa54a6791, crisis 'none':
 * BIRTH_DIALS as it is, publicProse deleted as there), each checked to carry the standing (a recipe drift reds, never passes);
 * (ii) ONE HAND PLANT: galleryVeilRecent's witness town (a hideable criminal house; its criminal power not the governing one),
 * each desc its base + the standing annotateFactionStanding writes over the roster (the plant's descs are the engine's own).
 * THE READS (galleryVeilRecent's harness): both engines (212 on a pglite chain of every migration; the twin projectShareVeil
 * over galleryPayloadFor), both stored shapes (new; master's, the powers also in the top-level factions[]), every setting of
 * the owner's switch (own, g:<bits>, allOpen, off) and the HAND HIDE of every hideable house (`hide`), Reveal DM off and on;
 * the gallery at every setting, the party link, the import and the campaign map's member at the own setting (the map's
 * member and the link are the player view: their twin is read with Reveal DM off). THE JUDGMENT is galleryVeilRecent's, line
 * for line (listsOf, withheldOf, servedNamesOf, namesWithheld: the lane's fold, gallerySecondHomes.js :: buildNameSearch).
 * A fault quotes the LAST 80 characters of the desc (where the standing sits).
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { appendFileSync } from 'node:fs';
import { bootChain, BIRTH_DIALS, OWNER } from './veilChain.shared.mjs';
import { buildNameSearch } from '../../src/domain/display/gallerySecondHomes.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';
import { annotateFactionStanding } from '../../src/generators/power/factionStanding.js';

const ARM_TIMEOUT_MS = 3_600_000; // deadlock guard, not a perf budget
const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const arr = (v) => (Array.isArray(v) ? v : []);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = (v) => JSON.stringify(v);
/** The measures the hand-back quotes, to DESCARM_MEASURES where it is set (the config silences the console). */
const note = (...a) => { if (process.env.DESCARM_MEASURES) appendFileSync(process.env.DESCARM_MEASURES, `${a.join(' ')}\n`); };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const CRIM = OPEN.slice(0, 3);

// ── THE PLACES ───────────────────────────────────────────────────────────
const TG = "Thieves' Guild";
const TGC = Object.freeze({ id: 'inst-dsc-tgc', name: "Thieves' guild chapter", category: 'Criminal', desc: 'A chapter of the guild.' });
const FISH = Object.freeze({ id: 'inst-dsc-fish', name: 'Fish market', category: 'Economy', desc: 'Fish, salted and fresh.' });
/** THE HAND PLANT: galleryVeilRecent's witness roster (the criminal power is NOT the governing one, so power.entry withholds it
 * where its house is hidden), each desc its base + the standing the engine's writer adds over the whole roster. */
function plantTown() {
  const factions = [{ faction: 'Shadow Senate', category: 'civic', power: 50, isGoverning: true, desc: 'The senate sits behind closed doors.' },
    { faction: TG, category: 'criminal', power: 30, desc: 'The guild takes its cut.' },
    { faction: 'Fishers', category: 'economic', power: 20, desc: 'The fishers keep the quay.' }];
  annotateFactionStanding(factions);
  return { name: 'Saltreach', tier: 'town', institutions: clone([TGC, FISH]),
    powerStructure: { factions, factionRelationships: [{ pair: ['Shadow Senate', 'Fishers'], type: 'ally' }] },
    economicState: { safetyProfile: { crimeTypes: [] } } };
}
/** Each place, the shown power whose stored desc carries the standing (`holder`), and the powers that standing names. */
const PLACES = Object.freeze([
  { place: 'r3m-town-none-0-17', size: 'town', holder: 'Religious Authorities', names: [TG, 'Arcane Council'] },
  { place: 'r3m-city-none-1-117', size: 'city', holder: 'Military/Guard', names: [TG, 'Corrupt City Council'] },
  { place: 'plant-saltreach', size: null, holder: 'Fishers', names: [TG, 'Shadow Senate'] },
]);
/** BOTH STORED SHAPES: the new one, and master's (the powers also in the top-level factions[], R3's 'openM'). */
const SHAPES = Object.freeze({ new: (s) => clone(s), master: (s) => ({ ...clone(s), factions: clone(s.powerStructure.factions) }) });

// ── THE JUDGMENT (galleryVeilRecent.pglite.test.js, line for line) ───────
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
/** Every power desc a document carries, with its path: powerStructure.factions[] and master's top-level factions[]. */
const descsOf = (d) => [...arr(d?.powerStructure?.factions).map((f, i) => [`powerStructure.factions[${i}].desc`, f]), ...arr(d?.factions).map((f, i) => [`factions[${i}].desc`, f])]
  .filter(([, f]) => isRec(f) && typeof f.desc === 'string').map(([p, f]) => [p, f.desc]);

describe('DESCARM (VEIL-51 unit 4, R5-DESC narrowed): a shown power\'s desc names no power the read withholds, the twin against 212', () => {
  let db;
  let veil;
  let sw;
  let m = 0;
  let places = [];
  const at = '2026-11-01T00:00:00.000Z';
  const opened = (as) => as.map((a) => ({ address: a, hidden: false }));
  const cache = new Map();
  /** The owner's switch settings, each computed on the record read (tell-common.mjs :: settings; g:111 is own), and `hide`:
   * the own setting with every hideable house hidden by hand. */
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
    out.hide = [...opened(OPEN), ...arr(stored.institutions).filter((h) => isHideableHouse(h)).map((h) => ({ address: `card:institution:${idOf(h)}`, hidden: true }))];
    return out;
  };
  /** Every read of one record in one stored shape, both engines: [{ shape, setting, dm, read, server, twin }]. */
  const readAll = async (stored, shape) => {
    const out = [];
    for (const dm of [false, true]) for (const [setting, deltas] of Object.entries(settingsOf(stored, dm))) {
      m += 1;
      const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at });
      const id = `7e5cd000-0000-0000-0000-${String(m).padStart(12, '0')}`;
      const slug = `dsc${m}`;
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
  /** Every read of a place, both stored shapes (read once, kept for the positive). */
  const readsOf = async (p) => {
    if (!cache.has(p.place)) {
      const out = [];
      for (const [shape, make] of Object.entries(SHAPES)) {
        const stored = make(p.t);
        for (const r of await readAll(stored, shape)) out.push({ ...r, stored });
      }
      cache.set(p.place, out);
    }
    return cache.get(p.place);
  };
  /** The reads a place's every shape serves: 2 shapes x (2 Reveal DM x 11 settings gallery, + map and import (x2), + link). */
  const READS_PER_PLACE = 2 * (2 * 11 + 2 * 2 + 1);
  const engines = (r) => [['server', r.server], ['twin', r.twin]];

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    veil = await import('../../src/domain/display/galleryVeil.js');
    sw = await import('../../src/domain/display/criminalVeilSwitch.js');
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    await loadGenerationLawPayloads();
    places = PLACES.map((p) => {
      if (!p.size) return { ...p, t: plantTown() };
      const t = clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: p.size }), null, { seed: p.place, customContent: {} }));
      delete t.publicProse;
      return { ...p, t };
    });
    // THE RECIPE CARRIES THE CLASS: each place's holder is a stored power whose desc names every power its standing names
    // (a recipe drift is not a pass)
    const drift = places.filter((p) => !arr(p.t.powerStructure?.factions).some((f) => isRec(f) && f.faction === p.holder && typeof f.desc === 'string' && p.names.every((n) => f.desc.includes(n))))
      .map((p) => `${p.place}: no stored ${p.holder} desc naming ${J(p.names)}`);
    expect(drift, 'every place carries the standing the brief names').toEqual([]);
    expect(places.every((p) => arr(p.t.institutions).some((h) => isRec(h) && isHideableHouse(h))), 'every place has a hideable house').toBe(true);
  }, PGLITE_BOOT_TIMEOUT_MS);
  afterAll(async () => { if (db) await db.close(); });

  it('THE CLASS: on every HIDING read (withheldOf non-empty), no served powerStructure.factions[].desc and no master factions[].desc names a withheld power by the lane\'s fold, both engines, both stored shapes, every setting and the hand hide, Reveal DM off and on, every door (RED BY DESIGN until R5-DESC\'s cure)', async () => {
    const faults = []; const byKey = new Map(); const readsHit = new Map(); const hitPlaces = new Set();
    let reads = 0; let hiding = 0;
    const bump = (mp, k) => mp.set(k, (mp.get(k) || 0) + 1);
    for (const p of places) for (const r of await readsOf(p)) for (const [eng, d] of engines(r)) {
      if (!isRec(d)) { faults.push(`${p.place}|${r.shape}|${eng}|${r.read}|dm=${r.dm}|${r.setting}|: no document`); continue; }
      reads += 1;
      const wh = withheldOf(r.stored, d);
      if (!wh.length) continue;
      hiding += 1;
      let hitHere = false;
      for (const [path, desc] of descsOf(d)) {
        if (!namesWithheld(desc, wh, d)) continue;
        faults.push(`${p.place}|${r.shape}|${eng}|${r.read}|dm=${r.dm}|${r.setting}|${path}: ${desc.slice(-80)}`);
        bump(byKey, `${eng} ${r.read} dm=${r.dm}`); hitPlaces.add(p.place); hitHere = true;
      }
      if (hitHere) bump(readsHit, `${p.place} ${eng} ${r.read} dm=${r.dm}`);
    }
    note('DESCARM class: places', places.length, '| engine-reads', reads, '| hiding engine-reads', hiding, '| faults (descs)', faults.length, '| places hit', J([...hitPlaces]),
      '\n  faults by engine, door, Reveal:', J(Object.fromEntries([...byKey].sort())),
      '\n  faulting reads by place, engine, door, Reveal:', J(Object.fromEntries([...readsHit].sort())),
      faults.length ? `\n  ${faults.slice(0, 40).join('\n  ')}` : '');
    expect(reads, 'both engines served every read of every place').toBe(places.length * 2 * READS_PER_PLACE);
    expect(hiding, 'the places hide on some reads').toBeGreaterThan(0);
    // anchored: reads and hiding are asserted above, so an empty fault list is a judgment over every hiding read
    expect(faults, `${faults.length} faults over ${hiding} hiding engine-reads of ${reads}`).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('THE POSITIVE: the instrument bites: on at least one read of each place, the STORED desc of a power the read serves names a power the read withholds (the lane\'s fold)', async () => {
    const per = {}; const perEng = {};
    for (const p of places) {
      per[p.place] = 0;
      for (const r of await readsOf(p)) for (const [eng, d] of engines(r)) {
        if (!isRec(d)) continue;
        const wh = withheldOf(r.stored, d);
        if (!wh.length) continue;
        const served = new Set(listsOf(d).flatMap((f) => [f.faction, f.name]).filter((v) => typeof v === 'string' && v));
        if (!listsOf(r.stored).some((f) => [f.faction, f.name].some((n) => served.has(n)) && namesWithheld(f.desc, wh, d))) continue;
        per[p.place] += 1;
        perEng[`${p.place} ${eng}`] = (perEng[`${p.place} ${eng}`] || 0) + 1;
      }
    }
    note('DESCARM positive: engine-reads whose stored shown desc names a withheld power, by place', J(per), '| by place and engine', J(perEng));
    expect(Object.keys(per).sort()).toEqual(PLACES.map((p) => p.place).sort());
    expect(Object.entries(per).filter(([, n]) => !(n > 0)), 'every place has a read where the stored desc names a withheld power').toEqual([]);
  }, ARM_TIMEOUT_MS);
});
