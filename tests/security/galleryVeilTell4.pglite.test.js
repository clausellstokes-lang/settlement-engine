/**
 * galleryVeilTell4.pglite.test.js — R3-TELL-4 (VEIL-29's builder; the chair's ruling 73 (2) of 21:30, vetoable by the owner):
 * THE JOINT TELL'S CURE, family by family, on hand plants, BOTH ENGINES (212 through the server on a pglite chain of every
 * migration on disk; the twin, projectShareVeil over galleryPayloadFor, beside it), every setting of the owner's switch
 * (out/v27/tell/measure/tell-common.mjs :: settings: own, the mixed g:<bits>, allOpen, off), Reveal DM off and on; the gallery
 * read at every setting, the link, the import and the campaign map's member at the own setting (galleryVeilTell3's harness).
 * THE LAW (73 (2)): WHAT NAMES OR DEPENDS ON A WITHHELD HOUSE IS SERVED AS THE HOUSE-FREE TWIN WOULD SERVE IT (the value a
 * place with no such house shows), never as the bare record's value, and never as an absence no open place shows.
 *   UNIT 1 (`people.allegiance`): a served person's `allegiance` ({ power, house, ... }, allegiance.js :: dealAllegiances)
 *     that names a withheld house or a withheld power is served in the open place's form: THE KEY ABSENT (no nothing-hidden
 *     birth of the pool serves one: out/v29/tell4/measure/twinform-u1-3.txt). An allegiance whose house this read lists and
 *     whose power it serves (or that names none) is served byte for byte (the tooth). A husk the name sweep left (its `house`
 *     taken) names no served house: it leaves too.
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

/** An allegiance as allegiance.js :: dealAllegiances writes it (the handler dealt by assignHandlers). */
const ally = (house, power, handler) => ({ power, house, vector: 'greed', via: 'office', handler, share: 0.1, veiled: true, covert: true });
/** UNIT 1: a hidden street gang (criminal, hideable), a served fish market and harbour office, a criminal NON-governing power
 * (withheld by power.entry on a hiding read), and four agents: one to the hidden house (no power), one to the hidden house
 * through the criminal power, one to a SERVED house through the criminal power (the power withheld), and the tooth: one to a
 * SERVED house naming no power, and one to a served house through the served governing power. */
const HAND_ALLY = Object.freeze({
  name: 'Tarnwick', tier: 'town',
  institutions: [{ id: 'inst-sg21', name: 'Street gang', category: 'Criminal', desc: 'The gang works the docks.' },
    { id: 'inst-mk21', name: 'Fish market', category: 'Economy', desc: 'Fish.' },
    { id: 'inst-ho21', name: 'Harbour office', category: 'Government', desc: 'Berths and dues.' }],
  powerStructure: { factions: [{ faction: 'Town Council', category: 'civic', power: 60, isGoverning: true },
    { faction: 'Dock Syndicate', category: 'criminal', power: 25 }, { faction: 'Fishers', category: 'economic', power: 15 }] },
  npcs: [
    { id: 'npc-a1', name: 'Odile Varr', role: 'Clerk', allegiance: ally('Street gang', null, null) },
    { id: 'npc-a2', name: 'Bram Kettle', role: 'Wharfinger', allegiance: ally('Street gang', 'Dock Syndicate', null) },
    { id: 'npc-a3', name: 'Sefa Lune', role: 'Fishwife', allegiance: ally('Fish market', 'Dock Syndicate', null) },
    { id: 'npc-k1', name: 'Hale Dunmore', role: 'Harbourmaster', allegiance: ally('Harbour office', null, null) },
    { id: 'npc-k2', name: 'Ines Corr', role: 'Councillor', allegiance: ally('Fish market', 'Town Council', null) },
    { id: 'npc-c1', name: 'Pell Arno', role: 'Net-maker' }],
  economicState: { safetyProfile: { crimeTypes: [] } },
});
const WITHHELD = new Set(['npc-a1', 'npc-a2', 'npc-a3']);
const KEPT = new Set(['npc-k1', 'npc-k2']);

describe('R3-TELL-4 (ruling 73 (2)): the joint tell\'s cure on hand plants, the twin against 212', () => {
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
  /** Every read of one record by BOTH engines: [{ setting, dm, read, eng, doc }]. */
  const readAll = async (stored) => {
    const out = [];
    for (const dm of [false, true]) for (const [setting, deltas] of Object.entries(settingsOf(stored, dm))) {
      m += 1;
      const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at });
      const id = `7e5c4000-0000-0000-0000-${String(m).padStart(12, '0')}`;
      const slug = `t4x${m}`;
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

  it('UNIT 1 (people.allegiance): on a read that withholds the house, an allegiance naming a withheld house or a withheld power is served in the open place\'s form, THE KEY ABSENT (never a husk), both engines, every read and setting, Reveal DM off and on; an allegiance naming only what the read serves is served byte for byte (the tooth)', async () => {
    const bad = []; const tooth = []; const seen = {}; let hiding = 0; let keptServed = 0;
    const want = Object.fromEntries(HAND_ALLY.npcs.map((n) => [n.id, canon(n.allegiance)]));
    for (const r of await readAll(HAND_ALLY)) {
      if (!hides(r.doc)) continue;
      hiding += 1;
      for (const n of (Array.isArray(r.doc.npcs) ? r.doc.npcs : []).filter(isRec)) {
        const st = !('allegiance' in n) ? 'absent' : !isRec(n.allegiance) ? `non-object ${J(n.allegiance)}` : canon(n.allegiance) === want[n.id] ? 'as stored' : 'HUSK';
        const k = `${r.eng}:${WITHHELD.has(n.id) ? 'withheld-names' : KEPT.has(n.id) ? 'served-names' : 'none'}:${st}`;
        seen[k] = (seen[k] || 0) + 1;
        if (WITHHELD.has(n.id) && st !== 'absent') bad.push(`${n.id} ${tag(r)}: ${st} ${J(n.allegiance)}`);
        if (n.id === 'npc-c1' && st !== 'absent') bad.push(`${n.id} ${tag(r)}: a clean card served an allegiance`);
        if (KEPT.has(n.id) && st !== 'absent') { keptServed += 1; if (st !== 'as stored') tooth.push(`${n.id} ${tag(r)}: ${st} ${J(n.allegiance)}`); }
      }
    }
    note('R3-TELL-4 unit 1, people.allegiance on the hiding plant: hiding reads', hiding, '| engine:kind:state (cards):', J(seen), '| faults', bad.length, '| tooth: kept allegiances served', keptServed, 'not byte for byte', tooth.length,
      bad.length ? `\n  ${bad.slice(0, 12).join('\n  ')}` : '');
    expect(hiding).toBeGreaterThan(0);
    // (V33-Q, ruling 72 (c)'s second tooth: the tooth judges something; with no kept allegiance served it would pass empty)
    expect(keptServed).toBeGreaterThan(0);
    expect(tooth).toEqual([]);
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);
});
