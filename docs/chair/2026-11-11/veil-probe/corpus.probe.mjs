/**
 * COHERENCE-VEIL phase 2: the corpus run, ONCE at the tip (the chair's ruling 8). The charter's
 * corpus (§0.4: 60 villages, 160 towns, 100 cities, 40 metropolises; every dial random; seeds
 * `coherence-veil-corpus-<tier>-<k>`), each row veiled by hand through the share panel's model in
 * five ways (default, every eye shut, every default opened, every eye shut with Reveal DM, every eye
 * shut in snapshot mode), read through the real client read at 210 and at 211 on the SAME rows.
 * Per read: CARRIED paths and READABLE strings (as the routine pin), and whether the 211 page equals
 * the 210 page of the same share read live (keys sorted, undefined keys dropped).
 * Run: npx vitest run --config docs/chair/2026-11-11/veil-probe/vitest.probe.config.mjs corpus
 * Writes veil-probe/out/corpus.json (totals by tier, configuration and read; every fault row).
 */
import { it, vi } from 'vitest';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const H = vi.hoisted(() => ({ db: null, last: null }));
vi.mock('../../../../src/lib/supabase.js', () => {
  const tableFns = new Set(['get_gallery_dossier']);
  const supabase = {
    rpc: async (name, args = {}) => {
      if (!['get_gallery_dossier', 'get_unlisted_dossier'].includes(name)) return { data: null, error: { message: 'not served' } };
      const k = Object.keys(args)[0];
      const q = tableFns.has(name) ? `select * from public.${name}(${k} => $1)` : `select public.${name}(${k} => $1) as out`;
      try { const r = await H.db.query(q, [args[k]]); H.last = tableFns.has(name) ? r.rows : r.rows[0].out; return { data: H.last, error: null }; }
      catch (e) { return { data: null, error: { message: String(e.message) } }; }
    },
  };
  return { supabase, isConfigured: true, default: supabase };
});

const O = '11111111-1111-1111-1111-111111111111';
const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = { village: 60, town: 160, city: 100, metropolis: 40 };
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const canon = (v) => (Array.isArray(v) ? v.map(canon) : isRec(v)
  ? Object.fromEntries(Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => [k, canon(v[k])])) : v);
const keyOf = (el, i) => { if (isRec(el)) for (const k of ['id', 'key', 'faction', 'name', 'title', 'address']) if (typeof el[k] === 'string' && el[k]) return `${k}=${el[k]}`; return `#${i}`; };
function flat(v, p = '', out = new Map()) {
  if (Array.isArray(v)) { if (!v.length) out.set(`${p}[]`, '[]'); v.forEach((e, i) => flat(e, `${p}[${keyOf(e, i)}]`, out)); }
  else if (isRec(v)) { const ks = Object.keys(v); if (!ks.length) out.set(`${p}{}`, '{}'); for (const k of ks) flat(v[k], p ? `${p}.${k}` : k, out); }
  else out.set(p, v);
  return out;
}
function carried(resp, page) {
  const P = flat(page); const text = JSON.stringify(page); let paths = 0; let readable = 0;
  for (const [p, v] of flat(resp)) {
    if (P.has(p)) continue;
    paths += 1;
    if (typeof v === 'string' && v.trim().length >= 6 && !text.includes(JSON.stringify(v).slice(1, -1))) readable += 1;
  }
  return { paths, readable };
}

it('the corpus, at 210 and at 211', async () => {
  const { bootChain } = await import('./chain.mjs');
  const dbs = { at210: (await bootChain({ through: 210 })).db, at211: (await bootChain()).db };
  for (const db of Object.values(dbs)) await db.exec(`insert into auth.users (id) values ('${O}'); update public.profiles set role='developer' where id='${O}'; set test.uid='';`);
  const { generateSettlementPipeline: gen } = await import('../../../../src/generators/generateSettlementPipeline.js');
  const { composePublicProse } = await import('../../../../src/components/new/publicProseCompose.js');
  const veil = await import('../../../../src/domain/display/galleryVeil.js');
  const gallery = await import('../../../../src/lib/gallery.js');
  const totals = {}; const faults = []; const seeds = []; let n = 0; const t0 = Date.now();
  const add = (k, c) => { const a = (totals[k] ||= { reads: 0, paths: 0, readable: 0, pageChanged: 0 }); a.reads += 1; a.paths += c.paths; a.readable += c.readable; a.pageChanged += c.pageChanged ? 1 : 0; };
  for (const [tier, count] of Object.entries(TIERS)) {
    for (let k = 0; k < count; k += 1) {
      const seed = `coherence-veil-corpus-${tier}-${k}`; seeds.push(seed); n += 1;
      const raw = gen({ settType: tier, ...BROWSER }, null, { seed, customContent: {} });
      const rec = { ...raw, publicProse: composePublicProse(raw) };
      const pub = veil.galleryPayloadFor(rec, {});
      const m = veil.curateModelFor(pub, []);
      const every = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
        ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address)])]);
      const shut = every.map((address) => ({ address, hidden: true }));
      const opened = veil.defaultVeilFor(pub).map((d) => ({ address: d.address, hidden: false }));
      const at = '2026-11-11T00:00:00.000Z';
      const cases = [
        ['default', veil.writeShareVeil({}, [], { mode: 'live', at }), false, 'default'],
        ['everyEyeShut', veil.writeShareVeil({}, shut, { mode: 'live', at }), false, 'everyEyeShut'],
        ['everyDefaultOpened', veil.writeShareVeil({}, opened, { mode: 'live', at }), false, 'everyDefaultOpened'],
        ['everyEyeShut+dm', veil.writeShareVeil({}, shut, { mode: 'live', at }), true, 'everyEyeShut+dm'],
        ['everyEyeShut/snapshot', veil.writeShareVeil({}, shut, { mode: 'snapshot', at, snapshot: pub }), false, 'everyEyeShut'],
      ];
      const id = `aaaaaaaa-0000-0000-0000-${String(n).padStart(12, '0')}`;
      for (const db of Object.values(dbs)) {
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility) values ($1,$2,'T',$3,$4,true,$5,now(),$6,'unlisted')`,
          [id, O, tier, JSON.stringify(rec), `p${n}`, `l${n}`]);
      }
      const ref = {};
      for (const [label, ov, dm, refKey] of cases) {
        const pages = {};
        for (const [dbName, db] of Object.entries(dbs)) {
          await db.query('update public.settlements set gallery_member_overrides = $2, gallery_share_dm = $3 where id = $1', [id, JSON.stringify(ov), dm]);
          H.db = db;
          const g = await gallery.fetchPublicDossier(`p${n}`); const gResp = H.last[0];
          const l = await gallery.fetchPublicDossier(`l${n}`); const lResp = H.last;
          const gPage = canon(g.settlement); const lPage = canon(l.settlement);
          pages[dbName] = { gPage, lPage };
          const gSnap = gResp.gallery_member_overrides?.$veil?.snapshot;
          const gc = carried(gResp.data, gPage); if (gSnap) { const sc = carried(gSnap, gPage); gc.paths += sc.paths; gc.readable += sc.readable; }
          const lc = carried(lResp.dossier, lPage);
          if (dbName === 'at211') {
            const r = ref[refKey];
            gc.pageChanged = !!r && JSON.stringify(gPage) !== JSON.stringify(r.gPage);
            lc.pageChanged = !!r && JSON.stringify(lPage) !== JSON.stringify(r.lPage);
            if (gc.paths || gc.readable || lc.paths || lc.readable || gc.pageChanged || lc.pageChanged) faults.push({ seed, label, gallery: gc, link: lc });
          }
          add(`${dbName} | ${tier} | ${label} | gallery`, gc); add(`${dbName} | ${tier} | ${label} | link`, lc);
        }
        if (label === refKey && !ref[refKey]) ref[refKey] = pages.at210;
      }
      for (const db of Object.values(dbs)) await db.query('delete from public.settlements where id = $1', [id]);
    }
  }
  mkdirSync(resolve(process.cwd(), 'docs/chair/2026-11-11/veil-probe/out'), { recursive: true });
  writeFileSync(resolve(process.cwd(), 'docs/chair/2026-11-11/veil-probe/out/corpus.json'),
    JSON.stringify({ towns: n, minutes: Math.round((Date.now() - t0) / 60000), seedsPattern: 'coherence-veil-corpus-<tier>-<k>', tiers: TIERS, totals, faults: faults.slice(0, 200), faultCount: faults.length }, null, 1));
});
