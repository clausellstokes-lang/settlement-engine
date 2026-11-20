// REVIEW-VEIL-11 — ATTACKS on VEIL-DOORS-2 (4994ee371): the chronicle's classes and the log's-own-names rule. Born towns with a
// hideable house; one hidden house H (its stored name N, catalogId C) is RENAMED in the stored town to "The Velvet Hand"
// (catalogId kept), a second hideable house G is REMOVED from the town entirely. The DEFAULT veil (groupings shut, both houses
// hidden or gone). A planted log, each entry an attack; get_gallery_dossier as anon; per entry: served or not.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
const snake = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
it('d2a', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = process.env.RV11_DB || 'd2a';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const T = {}; const ex = {}; let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['town', 'city', 'city', 'metropolis']) for (const crisis of ['none', 'infiltrated', 'indebted', 'none']) {
    n += 1; const seed = `rv11-d2-${size}-${crisis}-${k}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; delete A.publicProse; A = JSON.parse(JSON.stringify(withPP(A, compose(A))));
    const hid = (A.institutions || []).filter(hideable); if (hid.length < 2) continue;
    const H = hid[0]; const G = hid[1]; const N0 = String(H.name); const GN = String(G.name);
    H.name = 'The Velvet Hand';                                       // renamed by the DM, catalogId kept
    A.institutions = A.institutions.filter((i) => i !== G);         // G removed from the town
    const short = N0.split(/\s+/)[0];                                // the first word of the birth name ("Smuggling", "Thieves'", ...)
    const ev = (key, type, summary, targetId, payload = {}) => ({ key, e: { event: { id: `ev-${key}`, type, targetId, payload, cause: 'authoring' }, appliedAt: `2026-11-01T10:${String(Object.keys(T).length % 60).padStart(2, '0')}:00.000Z`, narrativeSummary: summary } });
    const log = [
      ev('rename: old label, old id', 'ADD_INSTITUTION', `A new ${N0} was established.`, `institution.${snake(N0)}`),
      ev('rename: new name, old id', 'DAMAGE_INSTITUTION', 'The Velvet Hand was damaged.', `institution.${snake(N0)}`),
      ev('rename: new name, new id', 'IMPAIR_INSTITUTION', 'The Velvet Hand lost reach.', 'institution.the_velvet_hand'),
      ev('rename: short new name in free text (target class)', 'STARTED_RIOT', 'A riot broke out at the Velvet Hand\'s door.', 'docks', { location: "Velvet Hand's door" }),
      ev('removed: label', 'REMOVE_INSTITUTION', `The ${GN} closed or was dissolved.`, `institution.${snake(GN)}`),
      ev('removed: name only in summary, opaque id', 'DAMAGE_INSTITUTION', `The ${GN} was burned.`, 'inst-7f3a9c'),
      ev('removed: free text (target class)', 'RAID_OR_MONSTER_ATTACK', `Thugs from the ${GN} raided the market.`, 'market', { attacker: `the ${GN}` }),
      ev('short form of hidden name (target class)', 'STARTED_RIOT', `${short} crews rioted in the lower town.`, 'lower_town', { location: 'the lower town' }),
      ev('custom stressor, crime-worded', 'APPLY_STRESSOR', 'Gang war grips the settlement.', 'gang_war', { stressorType: 'gang_war', label: 'Gang war', isCustom: true }),
      ev('custom stressor naming the hidden house loosely', 'APPLY_STRESSOR', `${short} crackdown grips the settlement.`, `${snake(short)}_crackdown`, { stressorType: `${snake(short)}_crackdown`, label: `${short} crackdown`, isCustom: true }),
      ev('control: ordinary house event', 'ADD_INSTITUTION', 'A new Bakery was established.', 'institution.bakery'),
    ];
    const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }); const id = `abcd9a00-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated,campaign_state)
      values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,'unlisted',$5,false,true,false,$6)`, [id, JSON.stringify(A), `d2${n}`, `d2l${n}`, JSON.stringify(ov), JSON.stringify({ eventLog: log.map((x) => x.e) })]);
    await db.query('set role anon'); const row = (await db.query('select * from public.get_gallery_dossier($1)', [`d2${n}`])).rows[0]; await db.query('reset role');
    await db.query('delete from public.settlements where id = $1', [id]);
    const served = new Set((row.chronicle || []).map((c) => c.narrativeSummary));
    const shownH = (row.data.institutions || []).some((i) => i.name === 'The Velvet Hand');
    for (const x of log) { const r = T[x.key] = T[x.key] || { n: 0, served: 0 }; r.n += 1; if (served.has(x.e.narrativeSummary)) { r.served += 1; ex[x.key] = ex[x.key] || `${seed}: "${x.e.narrativeSummary}" (H shown ${shownH}; birth name ${N0}, removed ${GN})`; } }
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify({ T, ex }, null, 1));
}, 14_400_000);
