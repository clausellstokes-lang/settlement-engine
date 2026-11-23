// VEIL-41 (chain C, C2-BUILD (a')): THE PROOF BY VALUE OF ONE KEY. Every stored document of RV9_STORED_DIR (stored-dump.sh's
// output), at EVERY setting of tell-common.mjs :: loadVeil().settings (own, g:000..g:111, allOpen, off) plus the unmarked
// share ({}), Reveal DM off and on, read through THIS tree's twin (galleryPayloadFor -> projectShareVeil) and its server
// (RV9_SERVER_TPL: v27x211 + this tree's 212; three doors: get_gallery_dossier anonymous, get_unlisted_dossier anonymous,
// import_gallery_dossier as a reader who is not the owner). Counts, per engine and door, the reads whose served response
// carries a `publicProse` key ANYWHERE (a deep walk of the whole response) and whose document carried one when stored.
// Writes RV9_OUT_DIR/ppkey-shard<s>.json. Measures only: no line of 212, the twin or the registry.
// N67 (2): FOR EVERY SERVER READ, the sha256 of the served document's canonical form (keys sorted; the link door's `dossier`, the page's and the
// import's `data`) and of the twin's projection for the same read, one row each in RV9_OUT_DIR/shas-shard<s>.tsv (document, door, setting, Reveal,
// server sha, twin sha); the first RV9_KEEP (13) differing pairs of each shard kept WHOLE in diffs-shard<s>.json. Judged by nobody here (N48's form).
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync, mkdirSync, appendFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { loadVeil, clone, isRec } from '../../v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const READER = '22222222-2222-2222-2222-222222222222';

it('ppkey: no publicProse on any shared read', async () => {
  const V = await loadVeil(SRC);
  const DIR = process.env.RV9_STORED_DIR; const OUTD = process.env.RV9_OUT_DIR; mkdirSync(OUTD, { recursive: true });
  const LIMIT = Number(process.env.RV9_LIMIT || 0); const SERVER = process.env.RV9_SERVER !== '0';
  const index = readdirSync(DIR).filter((f) => /^index-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')).index)
    .sort((x, y) => (x.role + x.seed < y.role + y.seed ? -1 : 1));
  const has = (v) => { if (Array.isArray(v)) return v.some(has); if (!isRec(v)) return false; if (Object.prototype.hasOwnProperty.call(v, 'publicProse')) return true; return Object.values(v).some(has); };
  let db = null;
  if (SERVER) {
    const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
    const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
    const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  }
  const canon = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
  const sha = (v) => createHash('sha256').update(canon(v) ?? 'undefined').digest('hex');
  const TSV = `${OUTD}/shas-shard${SHARD[0]}.tsv`; writeFileSync(TSV, 'document\tdoor\tsetting\treveal\tserver\ttwin\n');
  const KEEP = Number(process.env.RV9_KEEP || 13); const diffs = []; const same = { equal: 0, differ: 0 };
  const C = {}; const bump = (k, hit) => { C[k] ||= { reads: 0, carry: 0 }; C[k].reads += 1; if (hit) C[k].carry += 1; };
  const ex = {}; const note = (k, s) => { ex[k] ||= []; if (ex[k].length < 5) ex[k].push(s); };
  let i = 0; let docs = 0; let stored = 0; let nrow = 0;
  for (const m of index) {
    i += 1; if (i % SHARD[1] !== SHARD[0]) continue; if (LIMIT && i > LIMIT * SHARD[1]) break;
    const doc = JSON.parse(readFileSync(`${DIR}/${m.seed}.json`, 'utf8')); docs += 1; if ('publicProse' in doc) stored += 1;
    let id = null; let sl = null;
    if (SERVER) {
      nrow += 1; id = `abcd4100-00${String(SHARD[0]).padStart(2, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`; sl = `p${SHARD[0]}x${nrow}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted','{}'::jsonb,false,true)`, [id, doc.name || 'x', JSON.stringify(doc), sl, `${sl}l`]);
    }
    for (const dm of [false, true]) {
      const sets = { ...Object.fromEntries(Object.entries(V.settings(doc, dm).deltas).map(([k, d]) => [k, V.write(d)])), unmarked: {} };
      for (const [k, ov] of Object.entries(sets)) {
        const tag = `${m.seed} ${dm ? 'dm' : 'off'}|${k}`;
        const tw = V.twin(doc, dm, clone(ov)); const th = has(tw); bump('twin', th); if (th) note('twin', tag);
        if (!SERVER) continue;
        await db.query('update public.settlements set gallery_member_overrides = $2, gallery_share_dm = $3 where id = $1', [id, JSON.stringify(ov), dm]);
        const page = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
        const link = (await db.query('select public.get_unlisted_dossier($1) d', [`${sl}l`])).rows[0]?.d;
        await db.query(`select set_config('test.uid', $1, false)`, [READER]);
        let imp = null; try { imp = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [sl])).rows[0]?.d; } catch (e) { imp = { __error: String(e.message || e) }; }
        await db.query(`select set_config('test.uid', '', false)`);
        for (const [door, d] of [['page', page], ['link', link], ['import', imp]]) {
          if (!isRec(d) || d.__error) { bump(`server ${door} NO DOCUMENT`, true); note(`server ${door} NO DOCUMENT`, `${tag} ${String(d?.__error || d).slice(0, 80)}`); continue; }
          const h = has(d); bump(`server ${door}`, h); if (h) note(`server ${door}`, tag);
          const doc2 = door === 'link' ? d.dossier : d; const a = sha(doc2); const b = sha(tw);
          appendFileSync(TSV, `${m.seed}\t${door}\t${k}\t${dm ? 'dm' : 'off'}\t${a}\t${b}\n`);
          if (a === b) same.equal += 1; else { same.differ += 1; if (diffs.length < KEEP) diffs.push({ seed: m.seed, door, setting: k, reveal: dm ? 'dm' : 'off', server: doc2, twin: tw }); }
        }
      }
    }
    if (SERVER) await db.query('delete from public.settlements where id = $1', [id]);
  }
  writeFileSync(`${OUTD}/ppkey-shard${SHARD[0]}.json`, JSON.stringify({ src: SRC, docs, stored, counts: C, examples: ex, shas: same }, null, 1));
  writeFileSync(`${OUTD}/diffs-shard${SHARD[0]}.json`, JSON.stringify(diffs));
}, 14400000);
