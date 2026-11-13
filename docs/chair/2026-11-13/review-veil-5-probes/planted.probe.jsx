// REVIEW-VEIL-5 — SECOND HOMES BY PLANTED MARKER (the chair's instruction of 2026-11-13 15:07 UTC).
//
// Every string a user can hide by hand is given a marker of its own DURING THE BIRTH, at the step boundary where it
// first exists (the generator's own `options.onStep` hook), so that every field a LATER step derives from it carries
// the marker with it. The town is then shared with EVERY EYE SHUT BY HAND, stored in local chains, and the WHOLE
// PAYLOAD of each of the four reads is searched as text for any marker. A marker that is still there is a hidden
// string that was sent: a second home (or a veil miss). Nothing is looked for by key.
//
// What a marker cannot ride: a boolean or a number (`corrupt: true`, a capture share), and a NAME (a house hidden
// whole is hidden with its name; names are join keys, so they are not renamed mid-birth: they are searched as text).
// A field derived from its source INSIDE THE SAME STEP that wrote the source is planted too late for that derivation;
// the step each marker was planted after is recorded, so that limit can be read.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';

const SRC = process.env.RV5_SRC; const SIDE = process.env.RV5_SIDE || 'master'; const OUT = process.env.RV5_OUT;
const CHAINS = (process.env.RV5_CHAINS || '').split(',').filter(Boolean).map((x) => { const [db, tpl] = x.split(':'); return { db, tpl }; });
const SEEDS = Number(process.env.RV5_SEEDS || 1); const SHARD = (process.env.RV5_SHARD || '0/1').split('/').map(Number);
const SIZES = (process.env.RV5_SIZES || 'thorp,hamlet,village,town,city,metropolis').split(',');
vi.mock(`${process.env.RV5_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const OWNER = '11111111-1111-1111-1111-111111111111'; const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const TOKEN_RE = /RV5~[A-Za-z0-9_.-]+~[0-9]+~[A-Za-z0-9_.-]+~Z/g;
const marked = (v) => JSON.stringify(v ?? null).includes('RV5~');

it(`second homes by planted marker (${SIDE})`, async () => {
  const pg = (await import(`${SRC}/node_modules/pg/lib/index.js`)).default;
  const M = `${SRC}/src`;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const veil = await import(`${M}/domain/display/galleryVeil.js`);
  const compose = SIDE === 'tip' ? (await import(`${M}/components/new/publicProseCompose.js`)).composePublicProse : null;
  await loadGenerationLawPayloads();
  // THE THINGS A USER CAN HIDE BY HAND, from the side's own tables: every eye of every card kind with the keys it
  // removes, and every grouping with the data its remover deletes (read off GROUPING_REMOVERS' source, listed here).
  const KINDS = veil.CARD_KINDS;
  const GROUPING_DATA = { 'block:services.criminal': [['availableServices', 'criminal']],
    'block:defense.criminalStructure': [['economicState', 'safetyProfile', 'criminalInstitutions'], ['economicState', 'safetyProfile', 'crimeTypes']],
    'block:power.criminalUnderside': [['powerStructure', 'criminalCaptureState'], ['economicState', 'safetyProfile', 'blackMarketCapture']],
    'block:housekeeping.structuralIssues': [['structuralViolations'], ['structuralSuggestions']], 'block:housekeeping.coherenceNotes': [['coherenceNotes']],
    'block:housekeeping.receipt': [['generationCoherenceReceipt']], 'block:housekeeping.decrees': [['decrees'], ['dmLayer']] };

  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbs = {};
  for (const c of CHAINS) { const name = `${c.db}_${SHARD[0]}`; await admin.query(`drop database if exists ${name} with (force)`); await admin.query(`create database ${name} template ${c.tpl}`);
    dbs[c.db] = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: name }); await dbs[c.db].connect(); }
  await admin.end();

  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = { side: SIDE, towns: 0, birthsThatThrew: [], planted: 0, plantedByOrigin: {}, plantedAfterStep: {}, shares: 0, reads: 0, handHides: 0, sent: {}, sentTowns: {}, examples: {}, houseNames: {}, houseNameTowns: {}, housesHiddenWhole: 0, raised: [] };
  const bump = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
  let n = 0; let idx = 0;
  for (let k = 0; k < SEEDS; k += 1) for (const size of SIZES) for (const stress of [null, 'infiltrated']) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `rv5-plant-${size}-${stress}-${k}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let seq = 0; const origin = new Map();
    const tok = (kind, key, step) => { seq += 1; const t = `RV5~${kind}~${seq}~${key}~Z`; origin.set(t, `${kind}.${key}`); bump(out.plantedByOrigin, `${kind}.${key}`); bump(out.plantedAfterStep, `${kind}.${key} after ${step}`); out.planted += 1; return t; };
    const plant = (holder, key, kind, step) => {
      const v = holder[key];
      if (v == null || typeof v === 'boolean' || typeof v === 'number' || marked(v)) return;
      if (typeof v === 'string') { if (v.trim()) holder[key] = `${v} ${tok(kind, key, step)}`; } else if (Array.isArray(v)) { if (v.length) v.push(tok(kind, key, step)); } else if (isRec(v)) v.rv5 = tok(kind, key, step);
    };
    const at = (root, path) => path.reduce((c, seg) => (isRec(c) ? c[seg] : undefined), root);
    const plantAll = (root, step) => {
      if (!isRec(root)) return;
      for (const [kind, def] of Object.entries(KINDS)) for (const path of def.lists) {
        const star = path.indexOf('*');
        const owners = star < 0 ? [root] : (Array.isArray(at(root, path.slice(0, star))) ? at(root, path.slice(0, star)).filter(isRec) : []);
        for (const o of owners) { const arr = at(o, star < 0 ? path : path.slice(star + 1)); if (!Array.isArray(arr)) continue;
          for (const c of arr.filter(isRec)) for (const [eye, keys] of Object.entries(def.fields)) { if (kind === 'faction' && eye === 'members') continue;
            for (const key of [...keys, ...(kind === 'npc' && eye === 'goals' ? ['factionGoal'] : []), ...(kind === 'npc' && eye === 'ties' ? ['linkedFactionIds'] : [])]) {
              if (kind === 'npc' && (key === 'institution' || key === 'linkedInstitutionIds' || key === 'linkedFactionIds')) continue; // join keys: searched as names
              if (kind === 'institution' && (key === 'tags' || key === 'serviceKeys' || key === 'facets')) continue;                     // read by the engine's own predicates
              if (kind === 'npc' && key === 'relationships') continue;
              plant(c, key, kind, step);
            } } }
      }
      for (const paths of Object.values(GROUPING_DATA)) for (const p of paths) { const holder = at(root, p.slice(0, -1)); const key = p[p.length - 1];
        if (isRec(holder) && Array.isArray(holder[key])) holder[key].filter(isRec).forEach((row) => { for (const f of ['desc', 'description', 'reason', 'note', 'text', 'detail']) plant(row, f, 'grouping', step); }); else if (isRec(holder) && typeof holder[key] === 'string') plant(holder, key, 'grouping', step); }
    };
    let born;
    try {
      born = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: (name, ctx) => { plantAll(ctx, name); if (isRec(ctx.settlement)) plantAll(ctx.settlement, name); } });
    } catch (e) { out.birthsThatThrew.push(`${seed}: ${String(e.message).slice(0, 160)}`); continue; }
    plantAll(born, 'the end of the birth');
    born.decrees = [{ id: 'd1', text: tok('grouping', 'decrees', 'by the editor') }]; born.dmLayer = { notes: tok('grouping', 'dmLayer', 'by the editor') };
    const record = compose ? { ...born, publicProse: compose(born) } : born;
    out.towns += 1;
    for (const dm of [false, true]) {
      const pub = veil.galleryPayloadFor(record, { shareDm: dm, memberOverrides: {} });
      const m = veil.curateModelFor(pub, []);
      const eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
        ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]);
      for (const mode of ['live', 'snapshot']) {
        n += 1; out.shares += 1; out.handHides += eyes.length;
        const id = `abcd77${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(n).padStart(12, '0')}`; const slug = `pp${SHARD[0]}x${n}`; const link = `pl${SHARD[0]}x${n}`; const map = `pm${SHARD[0]}x${n}`;
        const ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), mode === 'snapshot' ? { mode, at: '2026-11-01T00:00:00.000Z', snapshot: pub } : { mode, at: '2026-11-01T00:00:00.000Z' });
        for (const c of CHAINS) {
          const db = dbs[c.db];
          try {
            await db.query(`select set_config('test.uid', '', false)`);
            await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
              values ($1,$2,$3,$4,$5,true,$6,now(),$7,'unlisted',$8,$9,true)`, [id, OWNER, record.name || seed, size, JSON.stringify(record), slug, link, JSON.stringify(ov), dm]);
            await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign) values (gen_random_uuid(),$1,'m',$2,true,$3,'map_with_campaign',true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), map]);
            const g = (await db.query('select * from public.get_gallery_dossier($1)', [slug])).rows[0];
            const resp = { gallery: g, link: (await db.query('select public.get_unlisted_dossier($1) x', [link])).rows[0]?.x, map: (await db.query('select public.get_gallery_map($1) x', [map])).rows[0]?.x };
            await db.query(`select set_config('test.uid', $1, false)`, [READER]);
            resp.import = (await db.query('select * from public.import_gallery_dossier($1)', [slug])).rows[0];
            await db.query(`select set_config('test.uid', '', false)`);
            const sentNames = new Set((g?.data?.institutions || []).filter(isRec).map((i) => i.name));
            const gone = (record.institutions || []).filter(isRec).map((i) => i.name).filter((x) => typeof x === 'string' && x.length >= 6 && !sentNames.has(x));
            if (c === CHAINS[0] && mode === 'live' && !dm) out.housesHiddenWhole += gone.length;
            for (const [read, body] of Object.entries(resp)) {
              out.reads += 1; if (!body) { out.raised.push(`${c.db} ${seed} ${read}: no row`); continue; }
              const walk = (v, p) => { if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`)); else if (isRec(v)) for (const [k2, x] of Object.entries(v)) walk(x, p ? `${p}.${k2}` : k2); else if (typeof v === 'string') {
                for (const t of v.match(TOKEN_RE) || []) { const key = `${origin.get(t) || '?'}  ->  ${p.replace(/^(data|dossier|members\[\]\.settlement)\./, '')}`; const kk = `${c.db} | ${dm ? 'DM reveal on' : 'no reveal'} | ${key}`;
                  out.sent[kk] = out.sent[kk] || {}; bump(out.sent[kk], read); (out.sentTowns[kk] = out.sentTowns[kk] || {})[seed] = 1; out.examples[kk] = out.examples[kk] || `${seed} ${mode} ${read}: ${v.slice(0, 150)}`; }
                for (const nm of gone) if (v.includes(nm)) { const kk = `${c.db} | ${dm ? 'DM reveal on' : 'no reveal'} | a house hidden whole  ->  ${p.replace(/^(data|dossier|members\[\]\.settlement)\./, '')}`;
                  out.houseNames[kk] = out.houseNames[kk] || {}; bump(out.houseNames[kk], read); (out.houseNameTowns[kk] = out.houseNameTowns[kk] || {})[seed] = 1; out.examples[kk] = out.examples[kk] || `${seed} ${mode} ${read}: "${nm}" in "${v.slice(0, 110)}"`; } } };
              walk(body, '');
            }
          } catch (e) { out.raised.push(`${c.db} ${seed} dm=${dm} ${mode}: ${String(e.message).slice(0, 160)}`); }
        }
      }
    }
  }
  for (const k of Object.keys(out.sentTowns)) out.sentTowns[k] = Object.keys(out.sentTowns[k]).length;
  for (const k of Object.keys(out.houseNameTowns)) out.houseNameTowns[k] = Object.keys(out.houseNameTowns[k]).length;
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  for (const c of CHAINS) await dbs[c.db].end();
}, 14_400_000);
