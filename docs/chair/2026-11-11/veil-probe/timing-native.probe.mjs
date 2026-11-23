/**
 * COHERENCE-VEIL phase 2, the chair's ruling 2: the same reads as timing.probe.mjs on the NATIVE
 * engine (PostgreSQL 16 from the container image), at 210 and at 211. One attempt: the chain is
 * applied with the pglite probe's shims and nothing else; a file that refuses is recorded and the
 * measure stops. The cluster is the caller's scratch cluster (trust auth on a unix socket):
 *   PGHOST=<socket dir> PGPORT=<port> PGUSER=postgres FORCE_ALL=<deploy-check-force-all.json> \
 *   npx vitest run --config docs/chair/2026-11-11/veil-probe/vitest.probe.config.mjs timing-native
 * Writes veil-probe/out/timing-native.json.
 */
import { it } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import pg from 'pg';
import { SCAFFOLD_SQL, chainFiles } from './chain.mjs';

const O = '11111111-1111-1111-1111-111111111111';
const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

async function nativeChain(name, through) {
  const admin = new pg.Client({ database: 'postgres' });
  await admin.connect();
  await admin.query(`drop database if exists ${name}`);
  await admin.query(`create database ${name}`);
  await admin.end();
  const db = new pg.Client({ database: name });
  await db.connect();
  await db.query(SCAFFOLD_SQL);
  const failed = [];
  for (const [f, sql] of chainFiles(through)) {
    try { await db.query(sql); } catch (e) { failed.push(`${f}: ${String(e.message).slice(0, 160)}`); }
  }
  return { db, failed };
}

it('times the reads on the native engine', async () => {
  const out = { engine: null, failed: {}, rows: [] };
  const dbs = { at210: await nativeChain('veil210', 210), at211: await nativeChain('veil211', 999) };
  out.engine = (await dbs.at211.db.query('select version()')).rows[0].version;
  for (const [k, { failed }] of Object.entries(dbs)) out.failed[k] = failed;
  const write = () => {
    mkdirSync(resolve(process.cwd(), 'docs/chair/2026-11-11/veil-probe/out'), { recursive: true });
    writeFileSync(resolve(process.cwd(), 'docs/chair/2026-11-11/veil-probe/out/timing-native.json'), JSON.stringify(out, null, 1));
  };
  if (out.failed.at210.length || out.failed.at211.length) { write(); for (const { db } of Object.values(dbs)) await db.end(); return; }
  const { generateSettlementPipeline: gen } = await import('../../../../src/generators/generateSettlementPipeline.js');
  const { composePublicProse } = await import('../../../../src/components/new/publicProseCompose.js');
  const veil = await import('../../../../src/domain/display/galleryVeil.js');
  const heavyReq = JSON.parse(readFileSync(process.env.FORCE_ALL, 'utf-8'));
  const towns = [
    ['largest corpus town (server-veil-metropolis-3)', gen({ settType: 'metropolis', ...BROWSER }, null, { seed: 'server-veil-metropolis-3', customContent: {} })],
    ['deploy-check Force all', gen(heavyReq.config, null, { seed: heavyReq.seed, customContent: {} })],
  ];
  for (const { db } of Object.values(dbs)) {
    await db.query(`insert into auth.users (id) values ('${O}') on conflict do nothing`);
    await db.query(`update public.profiles set role = 'developer' where id = '${O}'`);
    await db.query(`set test.uid = ''`);
  }
  for (const [ti, [label, raw]] of towns.entries()) {
    const rec = { ...raw, publicProse: composePublicProse(raw) };
    const pub = veil.galleryPayloadFor(rec, {});
    const m = veil.curateModelFor(pub, []);
    const every = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
      ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address)])]);
    const configs = { default: veil.writeShareVeil({}, []), all: veil.writeShareVeil({}, every.map((address) => ({ address, hidden: true }))) };
    for (const [dbName, { db }] of Object.entries(dbs)) {
      const id = `aaaaaaaa-0000-0000-0000-00000000000${ti + 1}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility) values ($1,$2,'T','metropolis',$3,true,$4,now(),$5,'unlisted')`,
        [id, O, JSON.stringify(rec), `p${ti}`, `l${ti}`]);
      for (const [cfg, ov] of Object.entries(configs)) {
        await db.query('update public.settlements set gallery_member_overrides = $2 where id = $1', [id, JSON.stringify(ov)]);
        for (const [read, q] of [['gallery', `select data from public.get_gallery_dossier('p${ti}')`], ['link', `select public.get_unlisted_dossier('l${ti}')`]]) {
          const ms = [];
          for (let k = 0; k < 8; k += 1) { const t = performance.now(); await db.query(q); ms.push(performance.now() - t); }
          ms.shift();
          ms.sort((a, b) => a - b);
          out.rows.push({ town: label, bytes: JSON.stringify(rec).length, db: dbName, cfg, read, medianMs: Math.round(ms[3]), maxMs: Math.round(ms.at(-1)) });
        }
      }
    }
  }
  write();
  for (const { db } of Object.values(dbs)) await db.end();
});
