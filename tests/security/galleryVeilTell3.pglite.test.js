/**
 * galleryVeilTell3.pglite.test.js — R3-TELL-3 (VEIL-28's builder; the chair's ruling 62 of 19:21, ruling 60's husk, each
 * vetoable by the owner): THE TELL'S CURE, its hand plants, BOTH ENGINES (212 through the server on a pglite chain of every
 * migration on disk; the twin, projectShareVeil over galleryPayloadFor, beside it), every setting of the owner's switch
 * (out/v27/tell/measure/tell-common.mjs :: settings: own, the mixed g:<bits>, allOpen, off), Reveal DM off and on; the gallery
 * read at every setting, the link, the import and the campaign map's member at the own setting.
 *   UNIT 2 (ruling 62 (2)): THE DRAG KEY. Where a hidden house raised it, `economicState.safetyProfile.economicDragDesc` is
 *     SERVED AS null (the empty form nothing-hidden pages show): the key kept, never deleted, never ''. A nothing-hidden town
 *     serves its sentence as stored.
 *   UNIT 3 (ruling 62 (5)): THE POWER'S ROW applies ONLY ON A READ THAT HIDES A HOUSE: a nothing-hidden town with a criminal
 *     power (the 29 towns' shape) is served the row byte for byte by both engines; on a hiding read a non-governing criminal
 *     power's row leaves whole where the read serves no criminal house.
 *   UNIT 4b (ruling 60; R3-CURE-8's STOP 1): THE NON-CRIMINAL HUSK: a NON-criminal `availableServices` row whose `institution` named the hidden house in another
 *     spelling ('(street gang)' beside the hidden "Street gang"), the key swept, LEAVES WHOLE, both engines, in every family the
 *     generator writes and a custom one (the chair's word of 20:03, relayed by the seat; red at 95f2ddfb8). The sweep stays
 *     for a row whose `institution` names no hidden house; a row born without the key stays.
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
const SVC_CUSTOM_FAMILY = 'curiosities';
const DRAG = 'Some of the trade here happens in back rooms, without a licence.';

/** UNIT 2: a hidden thieves' house (an organised name: the drag sentence moves with it), a served market and a council. */
const HAND_DRAG = Object.freeze({
  name: 'Saltgate', tier: 'town',
  institutions: [{ id: 'inst-tg9', name: "Thieves' guild chapter", category: 'Criminal', desc: 'They keep the docks.' },
    { id: 'inst-mk9', name: 'Fish market', category: 'Economy', desc: 'Fish.' }],
  powerStructure: { factions: [{ faction: 'Town Council', category: 'civic', power: 70, isGoverning: true }, { faction: 'Fishers', category: 'economic', power: 30 }] },
  economicState: { safetyProfile: { crimeTypes: [], economicDragDesc: DRAG, compound: { inst: { hasCriminalInst: true, hasThievesGuild: true, hasMarket: true } } } },
});
/** UNIT 2's and UNIT 3's control: nothing hideable, a criminal NON-governing power (the 29 towns' shape), the drag sentence. */
const HAND_OPEN = Object.freeze({
  name: 'Brinewell', tier: 'town',
  institutions: [{ id: 'inst-mk10', name: 'Fish market', category: 'Economy', desc: 'Fish.' }],
  powerStructure: { factions: [{ faction: 'Town Council', category: 'civic', power: 60, isGoverning: true },
    { faction: 'Dock Syndicate', category: 'criminal', power: 25 }, { faction: 'Fishers', category: 'economic', power: 15 }] },
  economicState: { safetyProfile: { crimeTypes: [], economicDragDesc: DRAG, compound: { inst: { hasMarket: true } } } },
});
/** UNIT 3 on a hiding read: a hidden street gang, a criminal NON-governing power, no criminal house served. */
const HAND_POWER = Object.freeze({
  name: 'Gullhaven', tier: 'town',
  institutions: [{ id: 'inst-sg11', name: 'Street gang', category: 'Criminal', desc: 'The gang works the docks.' },
    { id: 'inst-mk11', name: 'Fish market', category: 'Economy', desc: 'Fish.' }],
  powerStructure: { factions: [{ faction: 'Town Council', category: 'civic', power: 60, isGoverning: true },
    { faction: 'Dock Syndicate', category: 'criminal', power: 25 }, { faction: 'Fishers', category: 'economic', power: 15 }] },
  economicState: { safetyProfile: { crimeTypes: [] } },
});
/** UNIT 4b: per family, the row whose `institution` holds the hidden house's name in another spelling, a served one, one whose
 * `institution` names no hidden house, and one born without the key. */
const hand4bOf = (families) => ({
  name: 'Keelmouth', tier: 'town',
  institutions: [{ id: 'inst-sg12', name: 'Street gang', category: 'Criminal', desc: 'The gang works the docks.' },
    { id: 'inst-fish12', name: 'Fish market', category: 'Economy', desc: 'Fish.' }],
  powerStructure: { factions: [{ faction: 'Town Council', category: 'civic', power: 70, isGoverning: true }, { faction: 'Fishers', category: 'economic', power: 30 }] },
  availableServices: Object.fromEntries(families.map((f) => [f, [
    { name: `Swept ${f}`, desc: 'A row whose house is the hidden one, in another spelling.', institution: '(street gang)' },
    { name: `Served ${f}`, desc: 'A served house offers it.', institution: 'Fish market' },
    // the seat's condition (2), 20:03: the sweep STAYS for a row whose `institution` names no hidden house (its desc does), and
    // a row born without the key stays
    { name: `Kept ${f}`, desc: 'Ask the street gang at the door.', institution: 'Harbour office' },
    { name: `Bare ${f}`, desc: 'No house offers it.' }]])),
  economicState: { safetyProfile: { crimeTypes: [] } },
});

describe('R3-TELL-3 (ruling 62; ruling 60): the tell\'s cure on hand plants, the twin against 212', () => {
  let db;
  let veil;
  let sw;
  let families;
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
  /** Every read of one record by BOTH engines: [{ setting, dm, read, eng, doc }]. */
  const readAll = async (stored) => {
    const out = [];
    for (const dm of [false, true]) for (const [setting, deltas] of Object.entries(settingsOf(stored, dm))) {
      m += 1;
      const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at });
      const id = `7e5c3000-0000-0000-0000-${String(m).padStart(12, '0')}`;
      const slug = `t3x${m}`;
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
  const spOf = (d) => (isRec(d?.economicState?.safetyProfile) ? d.economicState.safetyProfile : null);
  const powersOf = (d) => (Array.isArray(d?.powerStructure?.factions) ? d.powerStructure.factions.filter(isRec) : []);

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    const { generateAvailableServices } = await import('../../src/generators/servicesGenerator.js');
    veil = await import('../../src/domain/display/galleryVeil.js');
    sw = await import('../../src/domain/display/criminalVeilSwitch.js');
    // THE FAMILY LIST, FROM THE GENERATOR (never a hand list): the buckets it writes for every size, and the custom one
    families = [...new Set([...['village', 'town', 'city', 'metropolis'].flatMap((tier) => Object.keys(generateAvailableServices(tier, [], {}, {}))), SVC_CUSTOM_FAMILY])];
  }, PGLITE_BOOT_TIMEOUT_MS);
  afterAll(async () => { if (db) await db.close(); });

  it('UNIT 2 (ruling 62 (2)): THE DRAG KEY where a hidden house raised it is SERVED AS null (the key kept; never deleted, never \'\'), both engines, every read, every setting, Reveal DM off and on; a nothing-hidden town serves its sentence as stored', async () => {
    const bad = []; const seen = {};
    for (const r of await readAll(HAND_DRAG)) {
      const sp = spOf(r.doc);
      const st = !sp ? 'no profile' : !('economicDragDesc' in sp) ? 'ABSENT' : sp.economicDragDesc === null ? 'null' : J(sp.economicDragDesc);
      seen[st] = (seen[st] || 0) + 1;
      if (st !== 'null') bad.push(`${tag(r)}: ${st}`);
    }
    const ctl = []; let nctl = 0;
    for (const r of await readAll(HAND_OPEN)) { nctl += 1; const sp = spOf(r.doc); if (!sp || sp.economicDragDesc !== DRAG) ctl.push(`${tag(r)}: ${J(sp?.economicDragDesc)}`); }
    note('R3-TELL-3 unit 2, the drag key on the hiding plant, by state (reads):', J(seen), '| faults', bad.length, '| the nothing-hidden control: reads', nctl, 'faults', ctl.length);
    expect(ctl).toEqual([]);
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('UNIT 3 (ruling 62 (5)): a nothing-hidden town with a criminal NON-governing power (the 29 towns\' shape) is served its powers\' rows BYTE FOR BYTE by both engines on every read; on a hiding read that serves no criminal house the criminal non-governing row leaves WHOLE and the governing row stays (VR42)', async () => {
    const bad = []; let n = 0;
    const want = canon(HAND_OPEN.powerStructure.factions);
    for (const r of await readAll(HAND_OPEN)) { n += 1; if (canon(powersOf(r.doc)) !== want) bad.push(`nothing hidden, ${tag(r)}: ${J(powersOf(r.doc))}`); }
    for (const r of await readAll(HAND_POWER)) {
      n += 1;
      const ps = powersOf(r.doc);
      const crimHouse = (Array.isArray(r.doc.institutions) ? r.doc.institutions : []).some((h) => isRec(h) && String(h.category || '').toLowerCase() === 'criminal');
      if (!crimHouse && ps.some((f) => f.faction === 'Dock Syndicate')) bad.push(`hiding read, ${tag(r)}: the non-governing criminal row served with no criminal house`);
      if (J(r.doc).includes('Dock Syndicate') && !crimHouse) bad.push(`hiding read, ${tag(r)}: the withheld power's name is still served`);
      if (!ps.some((f) => f.faction === 'Town Council' && f.isGoverning === true)) bad.push(`hiding read, ${tag(r)}: the governing row withheld`);
    }
    note('R3-TELL-3 unit 3: reads', n, '| faults', bad.length, bad.length ? `\n  ${bad.slice(0, 20).join('\n  ')}` : '');
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('UNIT 4b (ruling 60; THE CHAIR\'S WORD OF 20:03: the row leaves whole): a NON-criminal services row whose `institution` named the hidden "Street gang" in another spelling (\'(street gang)\') LEAVES WHOLE in every family the generator writes and a custom one, both engines, every read, every setting, Reveal DM off and on; the served house\'s row, a row whose `institution` names no hidden house and a row born without the key stay (the seat\'s condition (2))', async () => {
    expect(families).toContain(SVC_CUSTOM_FAMILY);
    const husks = []; const lost = []; const table = {};
    for (const r of await readAll(hand4bOf(families))) {
      const av = isRec(r.doc.availableServices) ? r.doc.availableServices : {};
      for (const f of families) {
        if (!Array.isArray(av[f])) continue;
        const swept = av[f].find((x) => isRec(x) && x.name === `Swept ${f}`);
        const k = `${r.eng}:${swept ? ('institution' in swept ? 'keyed' : 'HUSK') : 'withheld'}`;
        ((table[f] ||= {})[k] = (table[f][k] || 0) + 1);
        if (f !== 'criminal' && swept) husks.push(`${f} ${tag(r)}: served ${J(swept)}`);
        if (!av[f].some((x) => isRec(x) && x.name === `Served ${f}`)) lost.push(`${f} ${tag(r)}: the served house's row withheld`);
        if (!av[f].some((x) => isRec(x) && x.name === `Kept ${f}` && x.institution === 'Harbour office')) lost.push(`${f} ${tag(r)}: the row whose institution names no hidden house withheld or stripped`);
        if (!av[f].some((x) => isRec(x) && x.name === `Bare ${f}`)) lost.push(`${f} ${tag(r)}: the row born without the key withheld`);
      }
    }
    note('R3-TELL-3 unit 4b, families', J(families), '| the swept row per family (engine:state reads):', Object.entries(table).map(([f, v]) => `\n  ${f}: ${J(v)}`).join(''), '| husks served', husks.length);
    for (const f of families) expect(table[f], `${f}: judged on no read`).toBeTruthy();
    expect(lost.filter((x) => !x.startsWith('criminal '))).toEqual([]);
    expect(husks).toEqual([]);
  }, ARM_TIMEOUT_MS);
});
