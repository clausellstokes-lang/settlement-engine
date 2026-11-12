/**
 * COHERENCE-VEIL phase 2, the chair's ruling 4: a share holding 50,000 deltas. The client clamps
 * (an address over 300 characters parses to nothing; de-duplicated by address, the LAST 2,000
 * kept). The probe plants every eye of the largest corpus town FIRST and 50,000 more deltas after
 * them, so the client's clamp cuts the real eyes off; the response must carry exactly what the
 * page built from the same row shows, and the read's time is set beside the every-eye-shut read.
 * Run: npx vitest run --config docs/chair/2026-11-11/veil-probe/vitest.probe.config.mjs clamp
 * Writes veil-probe/out/clamp.json.
 */
import { it, vi } from 'vitest';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const H = vi.hoisted(() => ({ db: null, last: null }));
vi.mock('../../../../src/lib/supabase.js', () => {
  const supabase = {
    rpc: async (name, args = {}) => {
      if (!['get_gallery_dossier', 'get_unlisted_dossier'].includes(name)) return { data: null, error: { message: 'not served' } };
      const k = Object.keys(args)[0];
      const q = name === 'get_gallery_dossier' ? `select * from public.${name}(${k} => $1)` : `select public.${name}(${k} => $1) as out`;
      try { const r = await H.db.query(q, [args[k]]); H.last = name === 'get_gallery_dossier' ? r.rows : r.rows[0].out; return { data: H.last, error: null }; }
      catch (e) { return { data: null, error: { message: String(e.message) } }; }
    },
  };
  return { supabase, isConfigured: true, default: supabase };
});

const O = '11111111-1111-1111-1111-111111111111';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const canon = (v) => (Array.isArray(v) ? v.map(canon) : isRec(v)
  ? Object.fromEntries(Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => [k, canon(v[k])])) : v);

it('a share past the client clamp', async () => {
  const { bootChain } = await import('./chain.mjs');
  const { db } = await bootChain();
  H.db = db;
  await db.exec(`insert into auth.users (id) values ('${O}'); update public.profiles set role='developer' where id='${O}'; set test.uid='';`);
  const { generateSettlementPipeline: gen } = await import('../../../../src/generators/generateSettlementPipeline.js');
  const { composePublicProse } = await import('../../../../src/components/new/publicProseCompose.js');
  const veil = await import('../../../../src/domain/display/galleryVeil.js');
  const gallery = await import('../../../../src/lib/gallery.js');
  const raw = gen({ settType: 'metropolis', tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' }, null, { seed: 'server-veil-metropolis-3', customContent: {} });
  const rec = { ...raw, publicProse: composePublicProse(raw) };
  const pub = veil.galleryPayloadFor(rec, {});
  const m = veil.curateModelFor(pub, []);
  const every = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
    ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address)])]);
  const realEyes = every.map((address) => ({ address, hidden: true }));
  const junk = Array.from({ length: 50000 }, (_, i) => ({ address: `field:npc:nobody-${i}:secret`, hidden: i % 2 === 0 }));
  const long = { address: `field:npc:${'x'.repeat(400)}:secret`, hidden: true };
  // stored as a hand-written row would be (the write path's clamp would have cut it): past the limit
  const planted = { $veil: { v: 1, deltas: [...realEyes, long, ...junk, long] } };
  const allEyes = veil.writeShareVeil({}, realEyes);
  await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides)
    values ('aaaaaaaa-0000-0000-0000-000000000001',$1,'T','metropolis',$2,true,'p',now(),'l','unlisted',$3)`, [O, JSON.stringify(rec), JSON.stringify(planted)]);
  const time = async (q) => { const ms = []; for (let k = 0; k < 8; k += 1) { const t = performance.now(); await db.query(q); ms.push(performance.now() - t); } ms.shift(); ms.sort((a, b) => a - b); return Math.round(ms[3]); };
  const out = { deltas: planted.$veil.deltas.length, rowBytes: JSON.stringify(planted).length };
  for (const [label, q, slug] of [['gallery', `select data from public.get_gallery_dossier('p')`, 'p'], ['link', `select public.get_unlisted_dossier('l')`, 'l']]) {
    out[`${label}MsPlanted`] = await time(q);
    const page = canon((await gallery.fetchPublicDossier(slug)).settlement);
    const resp = label === 'gallery' ? H.last[0].data : H.last.dossier;
    out[`${label}ResponseEqualsPage`] = JSON.stringify(canon(resp)) === JSON.stringify(page);
    // what the client's clamp keeps: the real eyes are cut, so the page shows the default veil only
    out[`${label}PageEqualsDefaultVeil`] = JSON.stringify(page) === JSON.stringify(canon(veil.projectShareVeil(pub, veil.writeShareVeil({}, []))));
  }
  await db.query('update public.settlements set gallery_member_overrides = $1', [JSON.stringify(allEyes)]);
  out.galleryMsEveryEyeShut = await time(`select data from public.get_gallery_dossier('p')`);
  out.linkMsEveryEyeShut = await time(`select public.get_unlisted_dossier('l')`);
  mkdirSync(resolve(process.cwd(), 'docs/chair/2026-11-11/veil-probe/out'), { recursive: true });
  writeFileSync(resolve(process.cwd(), 'docs/chair/2026-11-11/veil-probe/out/clamp.json'), JSON.stringify(out, null, 1));
});
