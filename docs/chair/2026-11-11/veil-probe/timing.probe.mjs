/**
 * COHERENCE-VEIL phase 2, condition (b): the gallery and link reads timed at 210 and at 211, on the
 * largest town of a corpus and on the deploy-check request ("Force all" at Metropolis), with every
 * eye shut (the heaviest veil) and with the default veil. Median of 7 warm reads, in pglite.
 * Run: npx vitest run --config docs/chair/2026-11-11/veil-probe/vitest.probe.config.mjs timing
 * Writes veil-probe/out/timing.json.
 */
import { it } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { bootChain } from './chain.mjs';

const O = '11111111-1111-1111-1111-111111111111';
const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

it('times the reads', async () => {
  const { generateSettlementPipeline: gen } = await import('../../../../src/generators/generateSettlementPipeline.js');
  const { composePublicProse } = await import('../../../../src/components/new/publicProseCompose.js');
  const veil = await import('../../../../src/domain/display/galleryVeil.js');
  const heavyReq = JSON.parse(readFileSync(process.env.FORCE_ALL, 'utf-8'));
  const towns = [
    ['largest corpus town (server-veil-metropolis-3)', gen({ settType: 'metropolis', ...BROWSER }, null, { seed: 'server-veil-metropolis-3', customContent: {} })],
    ['deploy-check Force all', gen(heavyReq.config, null, { seed: heavyReq.seed, customContent: {} })],
  ];
  const out = [];
  const dbs = { at210: await bootChain({ through: 210 }), at211: await bootChain() };
  for (const { db } of Object.values(dbs)) {
    await db.exec(`insert into auth.users (id) values ('${O}'); update public.profiles set role='developer' where id='${O}'; set test.uid='';`);
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
          out.push({ town: label, bytes: JSON.stringify(rec).length, db: dbName, cfg, read, medianMs: Math.round(ms[3]), maxMs: Math.round(ms.at(-1)) });
        }
      }
    }
  }
  mkdirSync(resolve(process.cwd(), 'docs/chair/2026-11-11/veil-probe/out'), { recursive: true });
  writeFileSync(resolve(process.cwd(), 'docs/chair/2026-11-11/veil-probe/out/timing.json'), JSON.stringify(out, null, 1));
});
