/**
 * COHERENCE-VEIL-2: the review's cost rows on the native engine (F4, F5, F6), median of seven warm reads.
 * Each row is timed at 210, at the reviewed 211 (ORIG_211) and at the working 211, beside the same row
 * unveiled (no `$veil`, no member key, no eye) at the working 211. PARTS picks rows: f4,f5a,f5b,f6.
 *   PG_MODULE=... PGHOST=... PGPORT=... PGUSER=postgres ORIG_211=<file> FORCE_ALL=<json> PARTS=f6 RUN=1 \
 *   npx vitest run --config docs/chair/2026-11-12/veil-probe-2/vitest.config.mjs timing
 * Writes veil-probe-2/out/timing-<RUN>.json.
 */
import { it } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { nativeChain, open, OWNER } from './native.mjs';
import { everyEye, median7 } from './client.mjs';

const OUT = resolve(process.cwd(), 'docs/chair/2026-11-12/veil-probe-2/out');
const PARTS = new Set((process.env.PARTS || 'f4,f5a,f5b,f6').split(','));

it('the cost rows', async () => {
  const F = '211_server_side_share_veil.sql';
  const build = (n, t, r) => (process.env.REUSE ? open(n) : nativeChain(n, t, r));
  const dbs = { at210: await build('ct210', 210, {}), work211: await build('ct211w', 999, process.env.WORK_211 ? { [F]: process.env.WORK_211 } : {}) };
  if (process.env.ORIG_211) dbs.orig211 = await build('ct211o', 999, { [F]: process.env.ORIG_211 });
  const out = { engine: (await dbs.at210.db.query('select version()')).rows[0].version, failed: {}, rows: [] };
  for (const [k, v] of Object.entries(dbs)) out.failed[k] = v.failed;
  const veil = await import('../../../../src/domain/display/galleryVeil.js');
  let n = 0;
  async function time(db, data, ov) {
    n += 1;
    const id = `bbbbbbbb-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides)
      values ($1,$2,'T','town',$3,true,$4,now(),$5,'unlisted',$6)`, [id, OWNER, JSON.stringify(data), `t${n}`, `u${n}`, JSON.stringify(ov)]);
    await db.query(`select set_config('test.uid', '', false)`);
    const r = {};
    for (const [read, q] of [['gallery', `select data from public.get_gallery_dossier('t${n}')`], ['link', `select public.get_unlisted_dossier('u${n}')`]]) {
      const ms = [];
      for (let k = 0; k < 8; k += 1) { const t = performance.now(); await db.query(q); ms.push(performance.now() - t); }
      r[read] = median7(ms);
    }
    await db.query('delete from public.settlements where id = $1', [id]);
    return r;
  }
  async function row(label, data, ov, unveiled) {
    const r = { label, bytes: JSON.stringify(data).length + JSON.stringify(ov).length };
    for (const [k, { db }] of Object.entries(dbs)) r[k] = await time(db, data, ov);
    r.work211unveiled = await time(dbs.work211.db, unveiled.data ?? data, unveiled.ov ?? {});
    out.rows.push(r);
    console.log(JSON.stringify(r));
  }

  if (PARTS.has('f4')) {
    const town = { name: 'T', npcs: [{ id: 'npc_0', name: 'A', personality: { core: 'p' } }] };
    for (const N of [1000, 50000]) {
      const ov = { $veil: { v: 1, deltas: [] } };
      for (let i = 0; i < N; i += 1) ov[`npc_${i}`] = { revealDm: false };
      await row(`F4 ${N} member keys revealDm:false, one-person town`, town, ov, { ov: { $veil: { v: 1, deltas: [] } } });
    }
  }
  if (PARTS.has('f5a')) {
    for (const [E, D] of [[4000, 2000], [8000, 2000]]) {
      const town = { name: 'T', history: { historicalEvents: Array.from({ length: E }, (_, i) => ({ description: `anonymous event ${i}`, severity: 'minor' })) } };
      const ov = { $veil: { v: 1, deltas: Array.from({ length: D }, (_, i) => ({ address: `field:event:event.legacy-${i.toString(36)}:description`, hidden: true })) } };
      await row(`F5 ${E} anonymous events x ${D} event eyes`, town, ov, { ov: { $veil: { v: 1, deltas: [] } } });
    }
  }
  if (PARTS.has('f5b')) {
    for (const [I, D] of [[2000, 2000], [4000, 2000]]) {
      const town = { name: 'T', institutions: Array.from({ length: I }, (_, i) => ({ id: `inst_${i}`, name: `House ${i}`, category: 'civic', desc: `d${i}`, tags: ['civic'] })) };
      const ov = { $veil: { v: 1, deltas: Array.from({ length: D }, (_, i) => ({ address: `card:institution:inst_${i}`, hidden: true })) } };
      await row(`F5 ${I} institutions, ${D} card-hidden ordinary houses`, town, ov, { ov: { $veil: { v: 1, deltas: [] } } });
    }
  }
  if (PARTS.has('f6') && process.env.FORCE_ALL) {
    const { generateSettlementPipeline: gen } = await import('../../../../src/generators/generateSettlementPipeline.js');
    const { composePublicProse } = await import('../../../../src/components/new/publicProseCompose.js');
    const req = JSON.parse(readFileSync(process.env.FORCE_ALL, 'utf-8'));
    const raw = gen(req.config, null, { seed: req.seed, customContent: {} });
    const rec = { ...raw, publicProse: composePublicProse(raw) };
    const pub = veil.galleryPayloadFor(rec, {});
    const all = veil.writeShareVeil({}, everyEye(veil, pub).map((address) => ({ address, hidden: true })));
    await row('F6 Force all, every eye shut', rec, all, { ov: {} });
    await row('F6 Force all, default veil', rec, veil.writeShareVeil({}, []), { ov: {} });
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(resolve(OUT, `timing-${process.env.RUN || 'x'}.json`), JSON.stringify(out, null, 1));
  for (const { db } of Object.values(dbs)) await db.end();
});
