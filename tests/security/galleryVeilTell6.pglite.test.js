/**
 * galleryVeilTell6.pglite.test.js — R3-TELL-5 units (iv) and (v) (V33-Q's parked preparation, built by VEIL-40's T5; the
 * chair's rulings 72 (a), 73 (2), 74 and N86, vetoable by the owner): THE RED-FIRST ARMS OF THE BAR'S LAST CURES ON CHAIN A, on
 * hand plants AND the gate's failing towns (born here, the gate's own seeds and dials), BOTH ENGINES (212 through the server on
 * a pglite chain of every migration on disk; the twin, projectShareVeil over galleryPayloadFor, beside it), every setting of the
 * owner's switch (own, the mixed g:<bits>, allOpen, off), Reveal DM off and on; the gallery read at every setting, the link,
 * the import and the campaign map's member at the own setting (galleryVeilTell4's harness, unchanged). Each arm states the form
 * the CURE serves, MEASURED FIRST (docs/chair/2026-11-20/veil/out/v40/t5/T5-HANDBACK.md; the measure out/v40/t5/q-an.txt).
 * THE LAW (73 (2)): WHAT NAMES OR DEPENDS ON A WITHHELD HOUSE IS SERVED AS THE HOUSE-FREE TWIN WOULD SERVE IT; (72 (a)) what is
 * SENT is a value places with nothing hidden really show, at the size, and it says nothing of what is hidden.
 *   (v)(1) `safetyDesc` (r3m-city-none-1-113, r3m-metropolis-infiltrated-0-62): on a read that withholds a house whole and
 *     serves no house that moves goods beneath the walls (safetyLineTruth.js :: BENEATH_THE_WALLS), the Very Safe line's clause
 *     " The guard keeps the gates, but smugglers have ways in beneath the walls." is served as the house-free twin's
 *     " Everyone comes in by the gates, where the guard sees them." (safetyProfile.js's own line where no house is beneath),
 *     the rest of the line as stored; never the key absent. The tooth: where the read shows the house, the line as stored.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { appendFileSync } from 'node:fs';
import { bootChain, BIRTH_DIALS, OWNER } from './veilChain.shared.mjs';

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
// (v)(1): THE VERY SAFE LINE'S TWO CLAUSES (safetyProfile.js; safetyLineTruth.js :: GATES_KEPT_SMUGGLERS_BENEATH) and the houses
// that move goods beneath the walls (safetyLineTruth.js :: BENEATH_THE_WALLS)
const BENEATH_CLAUSE = ' The guard keeps the gates, but smugglers have ways in beneath the walls.';
const EVERYONE_CLAUSE = ' Everyone comes in by the gates, where the guard sees them.';
const BENEATH_HOUSE = /smuggling (?:network|operation)|underground (?:network|city)/i;
/** (v)(1): a walled Very Safe city whose only house beneath the walls is a hidden smuggling network (criminal, hideable). */
const HAND_SAFE = Object.freeze({
  name: 'Gatewell', tier: 'city',
  institutions: [{ id: 'inst-sn61', name: 'Smuggling network', category: 'Criminal', desc: 'Tunnels under the east wall.' },
    { id: 'inst-wl61', name: 'City walls', category: 'Defense', desc: 'Stone, twice a man high.' },
    { id: 'inst-mk61', name: 'Market square', category: 'Economy', desc: 'Stalls by the gate.' }],
  powerStructure: { factions: [{ faction: 'City Council', category: 'civic', power: 70, isGoverning: true }, { faction: 'Merchants', category: 'economic', power: 30 }] },
  economicState: { safetyProfile: { safetyLabel: 'Very Safe', crimeTypes: [],
    safetyDesc: `Visitors can walk anywhere at any hour, and there is little crime; the garrison sees to that.${BENEATH_CLAUSE} The adventurers' charter hall handles threats the watch cannot.` } },
});
/** The gate's failing towns each arm reads (GATE-MAP's rows), born here by the gate's own seeds and dials. */
const BORN_SEEDS = Object.freeze(['r3m-city-none-1-113', 'r3m-metropolis-infiltrated-0-62']);

describe('R3-TELL-5 units (iv), (v) (V33-Q\'s instruments, VEIL-40\'s T5): the red-first arms, the twin against 212', () => {
  let db;
  let veil;
  let sw;
  let born;
  let isHideable;
  let idOf;
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
  /** Every read of one record by BOTH engines: [{ setting, dm, read, eng, doc }]; `extra` adds settings by name. */
  const readAll = async (stored, extra = {}) => {
    const out = [];
    for (const dm of [false, true]) for (const [setting, deltas] of Object.entries({ ...settingsOf(stored, dm), ...extra })) {
      m += 1;
      const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at });
      const id = `7e5c6000-0000-0000-0000-${String(m).padStart(12, '0')}`;
      const slug = `t6x${m}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(stored.name || 'T'), String(stored.tier || 'town'), J(stored), slug, `${slug}-link`, J(ov), dm]);
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
  /** A read hides a house of the record: a hideable house of the stored roster (cardVeil.js :: isHideableHouse) that the served
   * roster does not list. */
  const hidesOf = (stored) => {
    const hideable = (stored.institutions || []).filter((h) => isRec(h) && isHideable(h)).map((h) => h.name);
    return (d) => hideable.some((n) => !(Array.isArray(d?.institutions) ? d.institutions : []).some((h) => isRec(h) && h.name === n));
  };
  /** The setting that SHOWS every hideable house of the record by hand (its card and its four eyes), the groupings open: no house
   * is hidden, the tooth's read. */
  const shownOf = (stored) => ({ shown: opened([...OPEN, ...(stored.institutions || []).filter((h) => isRec(h) && isHideable(h))
    .flatMap((h) => [`card:institution:${idOf(h)}`, ...['description', 'function', 'services', 'people'].map((f) => `field:institution:${idOf(h)}:${f}`)])]) });

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    veil = await import('../../src/domain/display/galleryVeil.js');
    sw = await import('../../src/domain/display/criminalVeilSwitch.js');
    ({ isHideableHouse: isHideable } = await import('../../src/domain/people/cardVeil.js'));
    idOf = (h) => veil.CARD_KINDS.institution.idOf(h);
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    await loadGenerationLawPayloads();
    // THE GATE'S BIRTHS, byte for byte (out/v27/tell/measure/tell-common.mjs :: birth with no cut; seeds r3m-<size>-<crisis>-<k>-<idx>)
    const birth = (seed) => {
      const [, size, crisis] = seed.split('-');
      const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
      const t = { ...generateSettlementPipeline(cfg, null, { seed, customContent: {} }) }; delete t.publicProse;
      return clone(withPublicProse(t, composePublicProse(t)));
    };
    born = Object.fromEntries(BORN_SEEDS.map((s) => [s, birth(s)]));
  }, PGLITE_BOOT_TIMEOUT_MS);
  afterAll(async () => { if (db) await db.close(); });

  it('(v)(1) safetyDesc (ruling 72 (a) (1)): on a read that withholds a house whole and serves no house beneath the walls, the Very Safe line\'s beneath clause is served as the house-free twin\'s " Everyone comes in by the gates, where the guard sees them.", the rest as stored, never the key absent; both engines, every read and setting, Reveal DM off and on; the plant and the gate\'s two towns; the tooth: a read that shows the house serves the line as stored', async () => {
    const bad = []; const seen = {}; let judged = 0; let tooth = 0;
    for (const [name, stored] of [['hand-safe', HAND_SAFE], ...BORN_SEEDS.map((s) => [s, born[s]])]) {
      const sd0 = stored.economicState?.safetyProfile?.safetyDesc;
      if (typeof sd0 !== 'string' || !sd0.includes(BENEATH_CLAUSE)) { bad.push(`${name}: the record holds no beneath clause ${J(sd0)}`); continue; }
      const want = sd0.split(BENEATH_CLAUSE).join(EVERYONE_CLAUSE);
      const hides = hidesOf(stored);
      const rs = await readAll(stored, shownOf(stored));
      const byKey = {};
      for (const r of rs) {
        const sd = r.doc.economicState?.safetyProfile?.safetyDesc;
        const beneath = (Array.isArray(r.doc.institutions) ? r.doc.institutions : []).some((h) => isRec(h) && BENEATH_HOUSE.test(String(h.name || '')));
        const st = sd === undefined ? 'absent' : sd === want ? 'twin' : sd === sd0 ? 'stored' : 'other';
        const k = `${name} ${hides(r.doc) ? 'hiding' : 'showing'}${beneath ? '+beneath' : ''} ${r.eng}:${st}`;
        seen[k] = (seen[k] || 0) + 1;
        (byKey[`${r.read} ${r.setting} dm=${r.dm}`] ||= {})[r.eng] = sd;
        if (hides(r.doc) && !beneath) { judged += 1; if (st !== 'twin') bad.push(`${name} ${tag(r)}: ${st} ${J(sd)?.slice(0, 160)}`); }
        if (!hides(r.doc)) { tooth += 1; if (st !== 'stored') bad.push(`${name} ${tag(r)}: the shown house's line not as stored: ${st} ${J(sd)?.slice(0, 160)}`); }
      }
      for (const [k, v] of Object.entries(byKey)) if (J(v.server) !== J(v.twin)) bad.push(`${name} ${k}: the twin ${J(v.twin)?.slice(0, 80)} | 212 ${J(v.server)?.slice(0, 80)}`);
    }
    note('(v)(1) safetyDesc: record state:engine:served form -> reads', J(seen), '| hiding reads judged', judged, '| tooth reads (house shown)', tooth, '| faults', bad.length, bad.length ? `\n  ${bad.slice(0, 16).join('\n  ')}` : '');
    expect(judged).toBeGreaterThan(0);
    expect(tooth).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);
});
