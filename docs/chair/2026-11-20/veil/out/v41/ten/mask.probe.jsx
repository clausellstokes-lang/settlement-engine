// V41-TEN (R5-TENSION, the chair's N85 (2)): THE MASK WORD'S PATHS. Every stored document of RV9_STORED_DIR, at every setting of
// tell-common.mjs :: loadVeil().settings plus the unmarked {}, Reveal DM off and on, through the twin (galleryPayloadFor ->
// projectShareVeil) and the server (RV9_SERVER_TPL; ppkey.probe.jsx's three doors: get_gallery_dossier, get_unlisted_dossier
// anonymous, import_gallery_dossier as a non-owner reader). For each read: every string leaf (and every key) of the served
// document that holds the mask word 'an unseen interest', by normalised path, counted. With it: each stored tension that names
// a hidden power (a powerStructure.factions[] row stamped hidden: true, by its `faction`) and what the read serves of it
// (the name, the mask, or the tension gone), and every served tension whose party list is shorter than the stored one's.
// The server runs only where the stored record holds a hidden power or the word (the only places 210's mask can write it).
// Writes RV9_OUT_DIR/mask-shard<s>.json. Measures only.
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { loadVeil, clone, isRec } from '/home/user/settlement-engine/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const READER = '22222222-2222-2222-2222-222222222222';
const MASK = 'an unseen interest';

it('mask: the mask word at every served path', async () => {
  const V = await loadVeil(SRC);
  const DIR = process.env.RV9_STORED_DIR; const OUTD = process.env.RV9_OUT_DIR; mkdirSync(OUTD, { recursive: true });
  const LIMIT = Number(process.env.RV9_LIMIT || 0); const SERVER = process.env.RV9_SERVER !== '0';
  const ONLY = process.env.RV9_SEEDS ? new Set(readFileSync(process.env.RV9_SEEDS, 'utf8').split('\n').filter(Boolean)) : null;
  const index = readdirSync(DIR).filter((f) => /^index-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')).index)
    .sort((x, y) => (x.role + x.seed < y.role + y.seed ? -1 : 1));
  let db = null;
  if (SERVER) {
    const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
    const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
    const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  }
  const objs = (l) => (Array.isArray(l) ? l.filter(isRec) : []);
  const tensOf = (d) => objs(d?.history?.currentTensions);
  const T = {}; const bump = (k, n = 1) => { T[k] = (T[k] || 0) + n; };
  const EX = {}; const note = (k, s) => { EX[k] ||= []; if (EX[k].length < 8) EX[k].push(s); };
  const walk = (x, p, out) => {
    if (typeof x === 'string') { if (x.includes(MASK)) out.push(p); return; }
    if (Array.isArray(x)) { for (const y of x) walk(y, `${p}[]`, out); return; }
    if (isRec(x)) for (const [k, y] of Object.entries(x)) { const q = p ? `${p}.${k}` : k; if (k.includes(MASK)) out.push(`${q} (KEY)`); walk(y, q, out); }
  };
  let i = 0; let nrow = 0; let docs = 0; let srvDocs = 0;
  for (const m of index) {
    i += 1; if (i % SHARD[1] !== SHARD[0]) continue; if (LIMIT && i > LIMIT * SHARD[1]) break;
    if (ONLY && !ONLY.has(m.seed)) continue;
    const raw = readFileSync(`${DIR}/${m.seed}.json`, 'utf8'); const doc = JSON.parse(raw); docs += 1;
    const hidNames = objs(doc?.powerStructure?.factions).filter((f) => f.hidden === true && typeof f.faction === 'string' && f.faction.trim() !== '').map((f) => f.faction);
    const storedMask = raw.includes(MASK);
    if (storedMask) bump('stored documents holding the word');
    if (hidNames.length) bump('stored documents with a hidden power');
    const SRV = SERVER && (hidNames.length > 0 || storedMask);
    const tens = tensOf(doc);
    const namedT = tens.map((t) => (Array.isArray(t.factions) ? t.factions : []).some((v) => typeof v === 'string' && hidNames.some((n) => v.includes(n))));
    let id = null; let sl = null;
    if (SRV) {
      srvDocs += 1; nrow += 1; id = `abcd4142-00${String(SHARD[0]).padStart(2, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`; sl = `tn${SHARD[0]}x${nrow}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted','{}'::jsonb,false,true)`, [id, doc.name || 'x', raw, sl, `${sl}l`]);
    }
    const judge = (engine, dm, k, d) => {
      const kind = k === 'unmarked' ? 'unmarked' : 'marked';
      const cell = `${engine} | ${dm ? 'dm' : 'off'} | ${kind}`;
      bump(`READS ${cell}`);
      if (!isRec(d)) { bump(`NO DOCUMENT ${cell}`); note(`NO DOCUMENT ${cell}`, `${m.seed} ${k}`); return; }
      const out = []; walk(d, '', out);
      const nameServed = hidNames.some((n) => JSON.stringify(d).includes(n));
      for (const p of out) {
        bump(`MASK ${cell} | ${p}`);
        note(`MASK ${cell} | ${p}`, `${m.seed} ${k}${nameServed ? ' (name served elsewhere too)' : ''}`);
      }
      if (out.length) bump(`MASK READS ${cell}`);
      // the tensions: each stored one that names a hidden power, what this read serves of it; every list served shorter
      const S = tensOf(d); let q = 0;
      for (const [j, t] of tens.entries()) {
        const s = S[q];
        const match = !!s && s.type === t.type && (s.description === t.description || (typeof s.description === 'string' && s.description.includes(MASK)) || s.description === undefined);
        if (match) q += 1;
        const f0 = Array.isArray(t.factions) ? t.factions : []; const sf = match && Array.isArray(s.factions) ? s.factions : null;
        if (match && sf.length < f0.length) { bump(`PARTY LIST SHORTENED ${cell}`); note(`SHORT ${cell}`, `${m.seed} ${k} ${JSON.stringify(f0)} -> ${JSON.stringify(sf)}`); }
        if (namedT[j]) {
          const form = !match ? 'tension gone' : sf.some((v) => typeof v === 'string' && v.includes(MASK)) ? 'masked' : sf.some((v) => typeof v === 'string' && hidNames.some((n) => v.includes(n))) ? 'name served' : 'other';
          bump(`HIDDEN-POWER TENSION ${cell} | ${k} | ${form}`);
          bump(`HIDDEN-POWER TENSION ${cell} | ${form}`);
        }
      }
      if (q < S.length) { bump(`UNMATCHED SERVED TENSION ${cell}`); note(`UNMATCHED ${cell}`, `${m.seed} ${k}`); }
    };
    for (const dm of [false, true]) {
      const sets = { ...Object.fromEntries(Object.entries(V.settings(doc, dm).deltas).map(([k, d]) => [k, V.write(d)])), unmarked: {} };
      for (const [k, ov] of Object.entries(sets)) {
        judge('twin', dm, k, V.twin(doc, dm, clone(ov)));
        if (!SRV) continue;
        await db.query('update public.settlements set gallery_member_overrides = $2, gallery_share_dm = $3 where id = $1', [id, JSON.stringify(ov), dm]);
        const page = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
        const link = (await db.query('select public.get_unlisted_dossier($1) d', [`${sl}l`])).rows[0]?.d;
        await db.query(`select set_config('test.uid', $1, false)`, [READER]);
        let imp = null; try { imp = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [sl])).rows[0]?.d; } catch (e) { imp = null; note('import error', `${m.seed} ${k} ${String(e.message || e).slice(0, 80)}`); }
        await db.query(`select set_config('test.uid', '', false)`);
        judge('server page', dm, k, page); judge('server link', dm, k, isRec(link) ? link.dossier : link); judge('server import', dm, k, imp);
      }
    }
    if (SRV) await db.query('delete from public.settlements where id = $1', [id]);
  }
  writeFileSync(`${OUTD}/mask-shard${SHARD[0]}.json`, JSON.stringify({ src: SRC, docs, srvDocs, tally: T, examples: EX }));
}, 14400000);
