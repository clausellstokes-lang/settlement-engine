// REVIEW-VEIL-12 — R4's people and the per-read re-key (VR10, VR46, THE SALT), on the SERVER through a client library's
// prepared path. Born towns (sizes x crises), stored on the chain RV10_TPL, shares UNMARKED and the DEFAULT veil, Reveal DM
// off and on; each read through node-pg NAMED prepared statements in ONE session (the extended protocol a client library
// uses): RV12_K executions (default 10), the last 3 under plan_cache_mode = force_generic_plan. Doors: the gallery read
// (anon), the party link (anon, unlisted slug), the import (an authenticated non-owner).
// Teeth (each counted per read): (v) the K reads' person-id lists all differ; (ii) a STORED person id served anywhere: as a
// whole string, as a SUBSTRING of any served string, or as an object KEY; (iv) the re-key a bijection by the card's name;
// (i) every served string of a re-keyed id form names a served card; NUMBER: a planted card with a NUMBER id and a tie to
// it (the id must not be served as such, the tie must follow the card); NAME: a stored person served as no card: its name
// in no served string (a hidden holder's name).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const strings = (v, out = [], keys = []) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach((x) => strings(x, out, keys)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { keys.push(k); strings(x, out, keys); } return { out, keys }; };
it('rk', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = process.env.RV12_DB || 'rk'; const K = Number(process.env.RV12_K || 10);
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const own = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await own.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  let compose = null; let withPP = null;
  try { compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* master */ }
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const T = {}; const ex = {}; const bump = (k, bad, e) => { const r = T[k] = T[k] || { n: 0, bad: 0 }; r.n += 1; if (bad) { r.bad += 1; (ex[k] = ex[k] || []).length < 4 && ex[k].push(e); } };
  const N = Number(process.env.RV10_N || 1); let n = 0; const sample = {};
  const doors = [['gallery', 'anon', null, 'select data as d from public.get_gallery_dossier($1)', (r) => r.d],
    ['link', 'anon', null, 'select public.get_unlisted_dossier($1) as d', (r) => r.d?.dossier],
    ['import', 'authenticated', '22222222-2222-2222-2222-222222222222', 'select public.import_gallery_dossier($1) as d', (r) => r.d?.data ?? r.d?.dossier ?? r.d]];
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'city', 'metropolis']) for (const crisis of ['none', 'infiltrated', 'insurgency', 'indebted', 'politically_fractured', 'none']) {
    n += 1; const seed = `rv12-rk-${size}-${crisis}-${k}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; if (compose) { delete A.publicProse; A = withPP(A, compose(A)); } A = JSON.parse(JSON.stringify(A));
    // NUMBER: one card's id planted as a number, with a tie to it (the first town of each size only)
    let plantNum = null;
    if (crisis === 'none' && (A.npcs || []).length > 2) { const old = A.npcs[1].id; plantNum = 90000 + n; A.npcs[1].id = plantNum; for (const r of A.relationships || []) for (const f of ['from', 'to', 'npc1Id', 'npc2Id']) if (r[f] === old) r[f] = plantNum; }
    const stored = (A.npcs || []).map((p) => p?.id).filter((x) => x !== undefined && x !== null);
    const storedS = stored.map(String).filter((s) => s.length >= 4);
    const nameOf = new Map((A.npcs || []).map((p) => [String(p?.id), p?.name]));
    if (!sample.storedIds) sample.storedIds = stored.slice(0, 6);
    for (const marked of [false, true]) for (const dm of [false, true]) {
      const ov = marked ? veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }) : {};
      const id = `abcd9c00-0000-0000-0000-${String(n * 4 + (marked ? 2 : 0) + (dm ? 1 : 0)).padStart(12, '0')}`; const slug = `rk${n}${marked ? 'm' : 'u'}${dm ? 'd' : 'p'}`;
      await own.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated,visibility,unlisted_slug)
        values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,$5,true,false,'unlisted',$6)`, [id, JSON.stringify(A), slug, JSON.stringify(ov), dm, `u${slug}`]);
      const tag = `${marked ? 'marked' : 'unmarked'} dm=${dm}`;
      for (const [door, role, uid, sql, pick] of doors) {
        const c = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await c.connect();
        await c.query(`set role ${role}`); if (uid) await c.query(`select set_config('test.uid', '${uid}', false), set_config('test.role', 'authenticated', false)`);
        const lists = []; let docs = [];
        for (let e = 0; e < K; e += 1) {
          if (e === K - 3) await c.query('set plan_cache_mode = force_generic_plan');
          let d; try { d = pick((await c.query({ name: `rd_${door}`, text: sql, values: [door === 'link' ? `u${slug}` : slug] })).rows[0]); } catch (er) { bump(`${door} read threw (${tag})`, true, `${seed}: ${String(er.message).slice(0, 90)}`); break; }
          if (typeof d === 'string') d = JSON.parse(d);
          docs.push(d); lists.push(JSON.stringify((d?.npcs || []).map((p) => p?.id)));
        }
        await c.end(); if (!docs.length || !docs[0]) { bump(`${door} served nothing (${tag})`, true, seed); continue; }
        const dl = (docs[0].npcs || []).length;
        if (dl > 1) bump(`(v) ${door} K reads all differ (${tag})`, new Set(lists).size !== lists.length, `${seed}: ${new Set(lists).size} distinct of ${lists.length}`);
        if (!sample[door]) sample[door] = (docs[0].npcs || []).slice(0, 3).map((p) => p?.id);
        for (const d of docs.slice(0, 2)) {
          const { out, keys } = strings(d);
          const whole = out.filter((s) => storedS.includes(s)); const sub = storedS.filter((s) => out.some((x) => x !== s && x.includes(s))); const key = storedS.filter((s) => keys.some((x) => x.includes(s)));
          bump(`(ii) ${door} no stored id served whole (${tag})`, whole.length > 0, `${seed}: ${whole.slice(0, 3)}`);
          bump(`(ii) ${door} no stored id as a substring (${tag})`, sub.length > 0, `${seed}: ${sub.slice(0, 2)} in "${(out.find((x) => sub[0] && x.includes(sub[0])) || '').slice(0, 80)}"`);
          bump(`(ii) ${door} no stored id as a key (${tag})`, key.length > 0, `${seed}: ${key.slice(0, 3)}`);
          const cards = (d.npcs || []).map((p) => p?.id); const cardSet = new Set(cards.map(String));
          // (iv) bijection by name, among names unique in the stored town
          const nameCount = {}; for (const p of A.npcs || []) nameCount[p?.name] = (nameCount[p?.name] || 0) + 1;
          const m = new Map(); const inv = new Map(); let bad = '';
          for (const p of d.npcs || []) { if (nameCount[p?.name] !== 1) continue; const st = String((A.npcs || []).find((q) => q?.name === p?.name)?.id); const sv = String(p?.id);
            if (m.has(st) && m.get(st) !== sv) bad = `split ${st}`; if (inv.has(sv) && inv.get(sv) !== st) bad = `collision ${sv}`; m.set(st, sv); inv.set(sv, st); }
          bump(`(iv) ${door} re-key a bijection (${tag})`, !!bad || cardSet.size !== cards.length, `${seed}: ${bad || 'duplicate card id'}`);
          // (i) every re-keyed-form string names a served card; the ties' ends name served cards
          const form = /^npc_[0-9a-f]{16}$/; const dangling = out.filter((s) => form.test(s) && !cardSet.has(s));
          bump(`(i) ${door} re-keyed refs name a served card (${tag})`, dangling.length > 0, `${seed}: ${dangling.slice(0, 2)}`);
          const tieEnds = (d.relationships || []).flatMap((r) => ['from', 'to', 'npc1Id', 'npc2Id'].map((f) => r?.[f]).filter((x) => x !== undefined));
          const tieBad = tieEnds.filter((x) => !cardSet.has(String(x)));
          bump(`(i) ${door} every tie end names a served card (${tag})`, tieBad.length > 0, `${seed}: ${tieBad.slice(0, 3)}`);
          if (plantNum !== null) { const stillNum = cards.some((x) => typeof x === 'number' || String(x) === String(plantNum)); const numSeen = out.some((s) => s.includes(String(plantNum))) || JSON.stringify(d).includes(`:${plantNum}`);
            bump(`NUMBER ${door} planted number id re-keyed (${tag})`, stillNum || numSeen, `${seed}: cards ${JSON.stringify(cards.slice(0, 3))} numSeen ${numSeen}`); }
          // NAME: a stored person served as no card: its full name in no served string
          const servedNames = new Set((d.npcs || []).map((p) => p?.name));
          const gone = (A.npcs || []).filter((p) => p?.name && !servedNames.has(p.name) && String(p.name).length >= 5).map((p) => p.name);
          const hit = gone.filter((nm) => out.some((s) => s.includes(nm)));
          bump(`NAME ${door} an unserved person's name in no served string (${tag})`, hit.length > 0, `${seed}: ${hit.slice(0, 2)} in "${(out.find((s) => hit[0] && s.includes(hit[0])) || '').slice(0, 100)}"`);
          if (gone.length) bump(`NAME ${door} towns with unserved people (${tag})`, false, '');
        }
      }
      await own.query('delete from public.settlements where id = $1', [id]);
    }
  }
  await own.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify({ T, ex, sample }, null, 1));
}, 14_400_000);
