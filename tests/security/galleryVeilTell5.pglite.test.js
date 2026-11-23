/**
 * galleryVeilTell5.pglite.test.js — R3-TELL-5 (VEIL-31's builder; the chair's rulings 73 (2) and 74, vetoable by the owner):
 * THE JOINT TELL'S CURE, unit (ii), THE EMPTY ARRAYS, on hand plants, BOTH ENGINES (212 through the server on a pglite chain of
 * every migration on disk; the twin, projectShareVeil over galleryPayloadFor, beside it), every setting of the owner's switch
 * (own, the mixed g:<bits>, allOpen, off), Reveal DM off and on; the gallery read at every setting, the link, the import and
 * the campaign map's member at the own setting (galleryVeilTell4's harness, unchanged).
 * THE LAW (73 (2)): WHAT NAMES OR DEPENDS ON A WITHHELD HOUSE IS SERVED AS THE HOUSE-FREE TWIN WOULD SERVE IT.
 *   UNIT (ii) `svc.criminal`: on a read that hides a house whole, a row of availableServices.criminal stays only BY POSITIVE
 *     ACCOUNT: its `institution` is the name of a house the read lists, or the tag of a crime type a shown house or a crisis
 *     raises (servicesGenerator.js: '(street gang)' Street gang activity, '(smuggling)' Smuggling, '(arcane underground)'
 *     Magical crime or Arcane black market, '(state apparatus)' State predation, '(criminal governance)' Criminal governance,
 *     '(religious fraud)' Religious fraud, '(commercial crime)' Commercial crime; the type kept by VR39's attribution over the
 *     record's own list). Every other row (the climate's '(lawless)' and '(informal)', drawn from the criminal climate the
 *     houses moved) leaves; what is left may be [] (VR29: the list stays a list). The tooth: a row a served house, a shown
 *     crime type or a crisis's type accounts for is served byte for byte.
 *   UNIT (iii) `powers.capture` (R3-TELL-5b): on a read that hides a house whole and serves NO criminal house and NO criminal
 *     power (the served crime signal false), no served power or relation carries `captureState` (the hall's birth seed on the
 *     governing row, a capture relation's rung): the open place's form, measured (out/v31/tell5b/capform/: no nothing-hidden
 *     page of the pool serves one without a criminal house or power, at any size). `criminalCaptureState`'s VALUE is not
 *     judged here (the hand-back's STOP: its only open form under an open grouping is 'none', a sent value). The teeth: beside
 *     a shown criminal house, and on a criminal governing power's row (VR42), every capture key is served byte for byte.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { appendFileSync } from 'node:fs';
import { bootChain, OWNER } from './veilChain.shared.mjs';

const ARM_TIMEOUT_MS = 600_000; // deadlock guard, not a perf budget
const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = (v) => JSON.stringify(v);
const canon = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
const note = (...a) => { if (process.env.R3_MEASURES) appendFileSync(process.env.R3_MEASURES, `${a.join(' ')}\n`); };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const CRIM = OPEN.slice(0, 3);

/** UNIT (ii) svc.criminal: a hidden street gang (criminal, hideable; the record's gang flag its own), a served fish market and
 * harbour office, a crisis's type (State predation) and a shown type no hidden house raised (Smuggling), and the services: the
 * climate's two rows and a fraud row no served type accounts for (each must leave), and the tooth: a served house's row, the
 * shown type's row and the crisis's row (each served byte for byte). */
const svc = (name, institution) => ({ name, desc: `${name}: the plant's words.`, institution });
const HAND_SVC = Object.freeze({
  name: 'Corvel', tier: 'town',
  institutions: [{ id: 'inst-sg51', name: 'Street gang', category: 'Criminal', desc: 'The gang works the docks.' },
    { id: 'inst-mk51', name: 'Fish market', category: 'Economy', desc: 'Fish.' },
    { id: 'inst-ho51', name: 'Harbour office', category: 'Government', desc: 'Berths and dues.' }],
  powerStructure: { factions: [{ faction: 'Town Council', category: 'civic', power: 70, isGoverning: true }, { faction: 'Fishers', category: 'economic', power: 30 }] },
  npcs: [{ id: 'npc-c51', name: 'Pell Arno', role: 'Net-maker' }],
  availableServices: { criminal: [svc('No law; bring coin', '(lawless)'), svc('Ask around quietly', '(informal)'), svc('Relic forgery', '(religious fraud)'),
    svc('Fence', 'Harbour office'), svc('Contraband transport', '(smuggling)'), svc('Official shakedown', '(state apparatus)')] },
  economicState: { compound: { inst: { hasCriminalInst: true, hasGangInfra: true, hasSmuggling: false } },
    safetyProfile: { compound: { inst: { hasCriminalInst: true, hasGangInfra: true, hasSmuggling: false } },
      crimeTypes: [{ type: 'Street gang activity', desc: 'Gangs.' }, { type: 'Smuggling', desc: 'Goods.' }, { type: 'State predation', desc: 'The state.' }] } },
});
const SVC_KEPT = new Set(['Fence', 'Contraband transport', 'Official shakedown']);

/** R3-TELL-5b UNIT (iii) powers.capture: a hidden street gang and NO criminal house or power left to serve; the governing civic
 * power carries the hall's birth seed (`captureState`), a relation carries one, and the town its `criminalCaptureState` (each
 * key must leave the served powers and relations: no nothing-hidden page serves one without a criminal house or power). The
 * teeth: the same town with a black market SHOWN beside the hidden gang (a criminal house served), and a town whose GOVERNING
 * power is itself criminal (VR42: its row stays, and the hall's rung its own seat accounts for), each served byte for byte. */
const capTown = (extraHouses, gov, ccs) => ({
  name: 'Varrow', tier: 'town',
  institutions: [{ id: 'inst-sg52', name: 'Street gang', category: 'Criminal', desc: 'The gang works the docks.' }, ...extraHouses,
    { id: 'inst-mk52', name: 'Fish market', category: 'Economy', desc: 'Fish.' }, { id: 'inst-ho52', name: 'Harbour office', category: 'Government', desc: 'Berths and dues.' }],
  powerStructure: { factions: [{ faction: gov.faction, category: gov.category, power: 70, powerLabel: 'Dominant', captureState: ccs, isGoverning: true }, { faction: 'Fishers', category: 'economic', power: 30, powerLabel: 'Minor' }],
    factionRelationships: [{ pair: [gov.faction, 'Fishers'], type: 'tense', direction: 'stable', captureState: ccs, narrative: 'The two bargain over the quays.' }],
    criminalCaptureState: ccs },
  npcs: [{ id: 'npc-c52', name: 'Pell Arno', role: 'Net-maker' }],
});
const HAND_CAP = Object.freeze(capTown([], { faction: 'Town Council', category: 'civic' }, 'equilibrium'));
const HAND_CAP_SHOWN = Object.freeze(capTown([{ id: 'inst-bm52', name: 'Black market', category: 'Criminal', desc: 'Goods without questions.' }], { faction: 'Town Council', category: 'civic' }, 'equilibrium'));
const HAND_CAP_GOV = Object.freeze(capTown([], { faction: 'Corrupt Council', category: 'criminal' }, 'corrupted'));

describe('R3-TELL-5 (ruling 73 (2), unit (ii)): the empty arrays on hand plants, the twin against 212', () => {
  let db;
  let veil;
  let sw;
  let m = 0;
  const at = '2026-11-01T00:00:00.000Z';
  const opened = (as) => as.map((a) => ({ address: a, hidden: false }));
  /** The owner's switch settings, each computed on the record read (tell-common.mjs :: settings; g:111 is own). */
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
    return out;
  };
  /** Every read of one record by BOTH engines: [{ setting, dm, read, eng, doc }]. R3-TELL-5b unit (iii): `extra` adds settings
   * (each a list of deltas) to the owner's switch settings, by name. */
  const readAll = async (stored, extra = {}) => {
    const out = [];
    for (const dm of [false, true]) for (const [setting, deltas] of Object.entries({ ...settingsOf(stored, dm), ...extra })) {
      m += 1;
      const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at });
      const id = `7e5c5000-0000-0000-0000-${String(m).padStart(12, '0')}`;
      const slug = `t5x${m}`;
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
        if (!isRec(d)) continue;
        out.push({ setting, dm, read, eng: 'server', doc: d });
        out.push({ setting, dm, read, eng: 'twin', doc: read === 'map' || read === 'link' ? twinOff : twin });
      }
    }
    return out;
  };
  const tag = (r) => `${r.eng} ${r.read} ${r.setting} dm=${r.dm}`;
  const hides = (d) => !(Array.isArray(d?.institutions) ? d.institutions : []).some((h) => isRec(h) && h.name === 'Street gang');

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    veil = await import('../../src/domain/display/galleryVeil.js');
    sw = await import('../../src/domain/display/criminalVeilSwitch.js');
  }, PGLITE_BOOT_TIMEOUT_MS);
  afterAll(async () => { if (db) await db.close(); });

  it('UNIT (ii) (svc.criminal): on a read that withholds the house, a criminal services row stays only by positive account (a listed house, or a shown or crisis crime type\'s tag); the climate\'s rows and an unaccounted tag leave, the list stays a list, both engines, every read and setting, Reveal DM off and on; an accounted row is served byte for byte (the tooth)', async () => {
    const bad = []; const tooth = []; const seen = {}; let hiding = 0; let keptServed = 0;
    const want = Object.fromEntries(HAND_SVC.availableServices.criminal.map((x) => [x.name, canon(x)]));
    for (const r of await readAll(HAND_SVC)) {
      if (!hides(r.doc)) continue;
      const list = r.doc.availableServices?.criminal;
      if (list === undefined) continue; // the services grouping shut: nothing of the family is served
      hiding += 1;
      if (!Array.isArray(list)) { bad.push(`${tag(r)}: availableServices.criminal is not a list ${J(list)}`); continue; }
      for (const x of list) {
        const k = `${r.eng}:${isRec(x) ? x.name : J(x)}`;
        seen[k] = (seen[k] || 0) + 1;
        if (!isRec(x) || !SVC_KEPT.has(x.name)) bad.push(`${tag(r)}: served ${J(x)}`);
        else { keptServed += 1; if (canon(x) !== want[x.name]) tooth.push(`${tag(r)}: ${J(x)}`); }
      }
      for (const n of SVC_KEPT) if (!list.some((x) => isRec(x) && x.name === n)) tooth.push(`${tag(r)}: the accounted row ${n} withheld`);
    }
    note('R3-TELL-5 unit (ii) svc.criminal on the hiding plant: hiding reads serving the family', hiding, '| engine:row (served):', J(seen), '| faults', bad.length, '| tooth: accounted rows served', keptServed, 'missing or not byte for byte', tooth.length,
      bad.length ? `\n  ${bad.slice(0, 12).join('\n  ')}` : '', tooth.length ? `\n  TOOTH ${tooth.slice(0, 6).join('\n  TOOTH ')}` : '');
    expect(hiding).toBeGreaterThan(0);
    expect(keptServed).toBeGreaterThan(0);
    expect(tooth).toEqual([]);
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);

  /** The served copies that carry the capture keys: a power's `captureState` (both lists), a relation's `captureState`. */
  const capKeys = (d) => {
    const ps = isRec(d?.powerStructure) ? d.powerStructure : {};
    const powers = [...(Array.isArray(ps.factions) ? ps.factions : []), ...(Array.isArray(d?.factions) ? d.factions : [])].filter(isRec);
    return [...powers.filter((f) => 'captureState' in f).map((f) => `power ${f.faction ?? f.name} captureState ${J(f.captureState)}`),
      ...(Array.isArray(ps.factionRelationships) ? ps.factionRelationships : []).filter((x) => isRec(x) && 'captureState' in x).map((x) => `relation ${J(x.pair)} captureState ${J(x.captureState)}`)];
  };
  it('UNIT (iii) (powers.capture): on a read that withholds the house and serves NO criminal house and NO criminal power, no served power or relation carries a capture key (the open place\'s form), both engines, every read and setting, Reveal DM off and on; beside a shown criminal house, and on a criminal governing power\'s row (VR42), the keys are served byte for byte (the teeth)', async () => {
    const bad = []; const tooth = []; let hiding = 0; let underside = 0; let keptServed = 0;
    for (const r of await readAll(HAND_CAP)) {
      if (!hides(r.doc)) continue;
      hiding += 1;
      if (isRec(r.doc.powerStructure) && 'criminalCaptureState' in r.doc.powerStructure) underside += 1;
      for (const k of capKeys(r.doc)) bad.push(`${tag(r)}: ${k}`);
    }
    const bm = HAND_CAP_SHOWN.institutions[1];
    const shownBm = { 'own+bm': [...opened(OPEN), { address: `card:institution:${veil.CARD_KINDS.institution.idOf(bm)}`, hidden: false }] };
    for (const [plant, extra, label] of [[HAND_CAP_SHOWN, shownBm, 'shown black market'], [HAND_CAP_GOV, {}, 'criminal governing power']]) {
      const ccs = plant.powerStructure.criminalCaptureState; const gov = plant.powerStructure.factions[0].faction;
      for (const r of await readAll(plant, extra)) {
        if (!hides(r.doc)) continue;
        if (plant === HAND_CAP_SHOWN && !(Array.isArray(r.doc.institutions) && r.doc.institutions.some((h) => isRec(h) && h.name === bm.name))) continue;
        const ps = r.doc.powerStructure;
        if (!isRec(ps) || !('criminalCaptureState' in ps)) continue; // the capture reading's grouping shut, or Reveal off: nothing of it is served
        keptServed += 1;
        const g = (Array.isArray(ps.factions) ? ps.factions : []).find((f) => isRec(f) && f.faction === gov);
        const rel = (Array.isArray(ps.factionRelationships) ? ps.factionRelationships : []).find((x) => isRec(x) && J(x.pair) === J([gov, 'Fishers']));
        if (ps.criminalCaptureState !== ccs) tooth.push(`${label} ${tag(r)}: criminalCaptureState ${J(ps.criminalCaptureState)}`);
        if (!g || g.captureState !== ccs) tooth.push(`${label} ${tag(r)}: the governing row ${J(g)}`);
        if (!rel || rel.captureState !== ccs) tooth.push(`${label} ${tag(r)}: the relation ${J(rel)}`);
      }
    }
    note('R3-TELL-5b unit (iii) powers.capture on the hiding plant: hiding reads', hiding, '| of them serving the capture reading (criminalCaptureState present)', underside, '| faults', bad.length,
      '| teeth: reads serving the capture reading beside a shown criminal house or a criminal governing power', keptServed, 'not byte for byte', tooth.length,
      bad.length ? `\n  ${bad.slice(0, 12).join('\n  ')}` : '', tooth.length ? `\n  TOOTH ${tooth.slice(0, 6).join('\n  TOOTH ')}` : '');
    expect(hiding).toBeGreaterThan(0);
    expect(underside).toBeGreaterThan(0);
    expect(keptServed).toBeGreaterThan(0);
    expect(tooth).toEqual([]);
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);
});
