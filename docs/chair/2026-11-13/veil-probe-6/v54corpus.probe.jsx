// COHERENCE-VEIL-6, V5-4: on towns born by MASTER's generator (roster copies embedded whole), shared UNMARKED with Reveal DM
// on and a third of the people switched off (revealDm:false), the four reads at the item-1 chain against the V5-4 chain:
// every difference must be a roster copy of a switched-off person, equal in the V5-4 response to that person's npcs[] entry.
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV5_SRC;
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
it('v54 corpus', async () => {
  const pg = (await import(`${SRC}/node_modules/pg/lib/index.js`)).default;
  const M = `${SRC}/src`;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const { galleryMemberKey } = await import(`${M}/domain/display/publicSafe.js`);
  await loadGenerationLawPayloads();
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbs = {};
  for (const [k, tpl] of [['before', 'n211'], ['after', 'v54']]) { await admin.query(`drop database if exists c54_${k} with (force)`); await admin.query(`create database c54_${k} template ${tpl}`);
    dbs[k] = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: `c54_${k}` }); await dbs[k].connect(); }
  await admin.end();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = { towns: 0, shares: 0, reads: 0, switchedOff: 0, rosterCopiesOfSwitchedOff: 0, diffs: {}, unexplained: [], copyNotEqualCard: 0, hiddenSentAfter: 0 };
  let n = 0;
  for (const size of ['village', 'town', 'city', 'metropolis']) for (const k of [0, 1, 2]) {
    const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size }), null, { seed: `cv6-v54-${size}-${k}`, customContent: {} });
    out.towns += 1;
    const ppl = (s.npcs || []).filter(isRec);
    const off = new Set(ppl.filter((_, i) => i % 3 === 0).map((p) => galleryMemberKey(p)));
    out.switchedOff += off.size;
    const ov = Object.fromEntries([...off].map((key) => [key, { revealDm: false }]));
    for (const imp of [false, true]) {
      n += 1; out.shares += 1;
      const resp = {};
      for (const [k2, db] of Object.entries(dbs)) {
        const id = `c54c54c5-0000-0000-0000-${String(n).padStart(12, '0')}`;
        await db.query(`select set_config('test.uid', '', false)`);
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
          values ($1,'11111111-1111-1111-1111-111111111111',$2,$3,$4,true,$5,now(),$6,'unlisted',$7,true,true)`, [id, s.name || 'T', size, JSON.stringify(s), `c54p${n}`, `c54l${n}`, JSON.stringify(ov)]);
        const g = (await db.query('select data from public.get_gallery_dossier($1)', [`c54p${n}`])).rows[0]?.data;
        const l = (await db.query('select public.get_unlisted_dossier($1) x', [`c54l${n}`])).rows[0]?.x?.dossier;
        await db.query(`select set_config('test.uid', '22222222-2222-2222-2222-222222222222', false)`);
        const i = (await db.query('select data from public.import_gallery_dossier($1)', [`c54p${n}`])).rows[0]?.data;
        resp[k2] = { gallery: g, link: l, import: i };
      }
      for (const read of ['gallery', 'link', 'import']) {
        out.reads += 1;
        const A = resp.before[read]; const B = resp.after[read];
        const strip = (d) => { const c = structuredClone(d); const cards = new Map((c.npcs || []).filter(isRec).map((p) => [galleryMemberKey(p), p]));
          for (const fs of [c.factions, c.powerStructure?.factions]) for (const f of (Array.isArray(fs) ? fs : []).filter(isRec)) if (Array.isArray(f.members)) f.members = f.members.map((m) => {
            if (!isRec(m) || !off.has(galleryMemberKey(m))) return m;
            if (d === B) { out.rosterCopiesOfSwitchedOff += 1; if (JSON.stringify(m) !== JSON.stringify(cards.get(galleryMemberKey(m)))) out.copyNotEqualCard += 1; }
            return '<switched off>'; });
          return c; };
        const a = JSON.stringify(strip(A)); const b = JSON.stringify(strip(B));
        if (a !== b) out.unexplained.push(`${s.name} imp=${imp} ${read}`);
        // a switched-off person's secret, if any, in the after response
        for (const p of ppl) if (off.has(galleryMemberKey(p)) && typeof p.secret === 'object' && p.secret?.what && JSON.stringify(B).includes(p.secret.what)) out.hiddenSentAfter += 1;
        if (a !== b || JSON.stringify(A) !== JSON.stringify(B)) out.diffs[read] = (out.diffs[read] || 0) + 1;
      }
    }
  }
  writeFileSync(process.env.RV5_OUT, JSON.stringify(out, null, 1));
  for (const db of Object.values(dbs)) await db.end();
}, 3600000);
