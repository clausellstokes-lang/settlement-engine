// REVIEW-VEIL-3, third question: master's client (db832c892) over 203 (production), 203+204..211, and 203+211 alone.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SP = '/tmp/claude-0/-home-user-settlement-engine/f87af9a7-d5c7-5553-9326-6c79fdba1af5/scratchpad';
const M = '/home/user/wt-master/src';
const H = globalThis.__H = { db: null, uid: '', last: null };
vi.mock('/home/user/wt-master/src/lib/supabase.js', () => {
  const H = globalThis.__H;
  const SERVED = new Set(['get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map']);
  const tableFns = new Set(['get_gallery_dossier', 'import_gallery_dossier']);
  const supabase = {
    rpc: async (name, args = {}) => {
      if (!SERVED.has(name)) return { data: name.startsWith('list_') ? [] : null, error: null };
      try {
        await H.db.query(`select set_config('test.uid', $1, false)`, [H.uid]);
        const keys = Object.keys(args);
        const call = `public.${name}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')})`;
        const r = await H.db.query(tableFns.has(name) ? `select * from ${call}` : `select ${call} as out`, keys.map((k) => args[k]));
        H.last = tableFns.has(name) ? r.rows : r.rows[0]?.out;
        return { data: H.last, error: null };
      } catch (e) { H.last = { error: String(e.message) }; return { data: null, error: { message: String(e.message) } }; }
    },
  };
  return { supabase, isConfigured: true, default: supabase };
});
const OWNER = '11111111-1111-1111-1111-111111111111'; const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const strings = (v, out = new Set()) => { if (Array.isArray(v)) v.forEach((x) => strings(x, out)); else if (isRec(v)) Object.values(v).forEach((x) => strings(x, out)); else if (typeof v === 'string' && v.trim().length >= 6) out.add(v); return out; };
const minus = (a, b) => [...a].filter((x) => !b.has(x));

it('master client over three chains', async () => {
  const pg = (await import(`${SP}/pgmod/node_modules/pg/lib/index.js`)).default;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const veil = await import(`${M}/domain/display/galleryVeil.js`);
  const gallery = await import(`${M}/lib/gallery.js`);
  await loadGenerationLawPayloads();
  const CHAINS = ['m203', 'mfull', 'm203p211'];
  const dbs = {};
  for (const c of CHAINS) {
    dbs[c] = new pg.Client({ database: c }); await dbs[c].connect();
    await dbs[c].query(`insert into auth.users (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
      insert into public.profiles (id) values ('${OWNER}'), ('${READER}') on conflict do nothing;
      update public.profiles set role = 'developer' where id = '${OWNER}';
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
  }
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const towns = [];
  for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
    towns.push({ seed: `m3-${size}-calm`, cfg: { ...DEFAULT_CONFIG, ...dials, settType: size } });
    towns.push({ seed: `m3-${size}-infiltrated`, cfg: { ...DEFAULT_CONFIG, ...dials, settType: size, selectedStresses: ['infiltrated'], selectedStressesRandom: false } });
  }
  const out = { rows: 0, reads: 0, breaks: [], showMore: {}, hideMore: {}, carried: {}, postFreeze: {}, labels: {}, examples: {} };
  const bump = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
  const ex = (k, v) => { out.examples[k] = out.examples[k] || []; if (out.examples[k].length < 8) out.examples[k].push(v); };
  let n = 0;
  for (const t of towns) {
    const record = generateSettlementPipeline(birthConfig(t.cfg), null, { seed: t.seed, customContent: {} });
    const pub = veil.galleryPayloadFor(record, {});
    const m = veil.curateModelFor(pub, []);
    const eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
      ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address)])]);
    const defaults = [...veil.defaultVeilFor(pub)].map((x) => (typeof x === 'string' ? x : x.address)).filter(Boolean);
    const edited = structuredClone(record);
    edited.npcs = [...(edited.npcs || []), { id: 'npc_m3_post', name: 'Mthree Postfreeze', role: 'spy', secret: 'M3POST_SECRET', personality: 'M3POST_PERSONA' }];
    if ((edited.institutions || [])[0]) edited.institutions[0].desc = `M3POST_DESC ${edited.institutions[0].desc || ''}`;
    const CONFIGS = [
      ['unmarked', false, null, {}],
      ['default', false, 'live', []],
      ['allShut', false, 'live', eyes.map((a) => ({ address: a, hidden: true }))],
      ['opened', false, 'live', defaults.map((a) => ({ address: a, hidden: false }))],
      ['dmDefault', true, 'live', []],
      ['snapDefault', false, 'snapshot', []],
      ['snapAllShut', false, 'snapshot', eyes.map((a) => ({ address: a, hidden: true }))],
      ['dmSnap', true, 'snapshot', []],
    ];
    for (const [name, dm, mode, deltas] of CONFIGS) {
      n += 1;
      const id = `abcdabcd-0000-0000-0000-${String(n).padStart(12, '0')}`;
      const ov = mode === null ? {} : veil.writeShareVeil({}, deltas, mode === 'snapshot'
        ? { mode, at: '2026-11-01T00:00:00.000Z', snapshot: veil.galleryPayloadFor(record, { shareDm: dm, memberOverrides: {} }) }
        : { mode, at: '2026-11-01T00:00:00.000Z' });
      const liveRow = mode === 'snapshot' ? edited : record;
      const pages = {};
      for (const c of CHAINS) {
        const db = dbs[c];
        await db.query(`select set_config('test.uid', '', false)`);
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
          values ($1,$2,$3,$4,$5,true,$6,now(),$7,'unlisted',$8,$9,true)`, [id, OWNER, record.name || t.seed, t.cfg.settType, JSON.stringify(liveRow), `mp${n}`, `ml${n}`, JSON.stringify(ov), dm]);
        await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign) values (gen_random_uuid(),$1,'m',$2,true,$3,'map_with_campaign',true)`,
          [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `mm${n}`]);
        H.db = db; const P = {};
        const read = async (key, fn) => { out.reads += 1; try { const page = await fn(); P[key] = { page, resp: H.last }; if (!page) out.breaks.push(`${c} ${t.seed} ${name} ${key}: no page (${JSON.stringify(H.last).slice(0, 120)})`); } catch (e) { out.breaks.push(`${c} ${t.seed} ${name} ${key}: threw ${String(e.message).slice(0, 120)}`); } };
        H.uid = '';
        await read('gallery', async () => { const d = await gallery.fetchPublicDossier(`mp${n}`); H.last = (await db.query('select data, gallery_member_overrides from public.get_gallery_dossier($1)', [`mp${n}`])).rows[0]; return d ? { s: d.settlement, mode: d.galleryMode, at: d.snapshotAt } : null; });
        await read('link', async () => { const d = await gallery.fetchPublicDossier(`ml${n}`); H.last = (await db.query('select public.get_unlisted_dossier($1) as x', [`ml${n}`])).rows[0].x; return d ? { s: d.settlement, mode: d.galleryMode, at: d.snapshotAt } : null; });
        await read('map', async () => { const mp = await gallery.fetchGalleryMap(`mm${n}`); const mem = mp?.members?.find((x) => x.settlement); return mem ? { s: mem.settlement } : null; });
        H.uid = READER;
        await read('import', async () => { const d = await gallery.fetchDossierForImport(`mp${n}`); return d ? { s: d.settlement } : null; });
        H.uid = '';
        pages[c] = P;
      }
      out.rows += 1;
      for (const key of ['gallery', 'link', 'map', 'import']) {
        const a = pages.m203[key]; if (!a?.page) continue;
        const A = strings(a.page.s);
        for (const c of ['mfull', 'm203p211']) {
          const b = pages[c][key]; if (!b?.page) continue;
          const B = strings(b.page.s);
          const more = minus(B, A); const less = minus(A, B);
          if (more.length) { bump(out.showMore, `${c}:${key}`); ex(`showMore ${c}:${key}`, `${t.seed} ${name}: ${more.slice(0, 3).join(' | ').slice(0, 200)}`); }
          if (less.length) bump(out.hideMore, `${c}:${key}`);
          if (key !== 'map' && key !== 'import' && (a.page.mode !== b.page.mode || a.page.at !== b.page.at)) { bump(out.labels, `${c}:${key}:${a.page.mode}/${a.page.at}->${b.page.mode}/${b.page.at}`); }
        }
        for (const c of CHAINS) {
          const b = pages[c][key]; if (!b?.page) continue;
          const respStr = strings(b.resp); const pageStr = strings(b.page.s);
          const carried = minus(respStr, pageStr).filter((s) => !/^\d{4}-\d\d-\d\dT/.test(s) && !/^[0-9a-f-]{36}$/.test(s));
          if (carried.length) { bump(out.carried, `${c}:${key}`, 1); bump(out.carried, `${c}:${key}:strings`, carried.length); }
          if (mode === 'snapshot' && /M3POST/.test(JSON.stringify(b.resp))) bump(out.postFreeze, `${c}:${key}:response`);
          if (mode === 'snapshot' && /M3POST/.test(JSON.stringify(b.page.s))) bump(out.postFreeze, `${c}:${key}:page`);
        }
      }
    }
  }
  writeFileSync(`${SP}/mprobe/out.json`, JSON.stringify(out, null, 1));
  for (const c of CHAINS) await dbs[c].end();
}, 7_200_000);
