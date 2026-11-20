// REVIEW-VEIL-10 — THE CRIMINAL SWITCH (VS1) against the hand. Born towns (RV10_GEN's pipeline; RV6_SRC's veil and switch).
// For each town with criminal parts, Reveal DM off and on:
//  (1) the switch's Show-all delta list vs every address the curate screen offers a hand (model eyes, iterated);
//  (2) SERVED(show-all) vs SERVED(hand-max: every family eye the screen offers, opened by toggleVeilDelta to a fixed point);
//  (3) SERVED(hide-all after every offered eye opened) vs SERVED(every NON-family offered eye opened, family at default);
//  (4) after Show-all is stored, the town changes: a new criminal house (a copy of one, new name, no id) and a rename of a shown one.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
function diff(a, b, p, out) {
  if (Array.isArray(a) && Array.isArray(b)) { const n = Math.max(a.length, b.length); for (let i = 0; i < n; i += 1) diff(a[i], b[i], `${p}[${i}]`, out); return; }
  if (isRec(a) && isRec(b)) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], p ? `${p}.${k}` : k, out); return; }
  if (JSON.stringify(a) !== JSON.stringify(b)) out.push([p, a, b]);
}
it('REVIEW-VEIL-10: the switch against the hand', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = process.env.RV10_DB; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const sw = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  let compose = null; let withPP = null;
  try { compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* master */ }
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let nrow = 0;
  const serve = async (rec, dm, deltas, read = 'gallery') => {
    const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    nrow += 1; const id = `abcd1000-0000-0000-0000-${String(nrow).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true,false)`, [id, rec.name || 'x', JSON.stringify(rec), `sw${nrow}`, `swl${nrow}`, JSON.stringify(ov), dm]);
    const r = read === 'link' ? (await db.query('select public.get_unlisted_dossier($1) x', [`swl${nrow}`])).rows[0]?.x?.dossier : (await db.query('select * from public.get_gallery_dossier($1)', [`sw${nrow}`])).rows[0]?.data;
    await db.query('delete from public.settlements where id = $1', [id]);
    return r;
  };
  const offered = (pub, deltas) => { const m = veil.curateModelFor(pub, deltas); return m.sections.flatMap((s) => [...s.groupings, ...s.switches, ...s.cards.flatMap((c) => [...(c.whole ? [c.whole] : []), ...c.eyes])]); };
  const handOpen = (pub, defaults, keep) => { let d = []; for (let i = 0; i < 6; i += 1) { let moved = false; for (const e of offered(pub, d)) { if (!keep(e.address) || !e.hidden) continue; d = veil.toggleVeilDelta(d, e.address, defaults); moved = true; } if (!moved) break; } return d; };
  const SIZES = (process.env.RV10_SIZES || 'village,town,city,city,metropolis,metropolis').split(',');
  const CRISES = (process.env.RV10_CRISES || 'none,infiltrated,insurgency,occupied,indebted,none').split(',');
  const report = { towns: [], unreachable: {}, showVsHand: {}, hideVsDefault: {}, later: [] };
  const bump = (bucket, p, ex) => { const r = bucket[p] = bucket[p] || { n: 0, ex }; r.n += 1; };
  let idx = 0;
  for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; const seed = `rv10-sw-${size}-${crisis}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }); if (compose) { A = { ...A }; delete A.publicProse; A = withPP(A, compose(A)); } A = JSON.parse(JSON.stringify(A)); } catch (e) { report.towns.push({ seed, threw: String(e.message).slice(0, 120) }); continue; }
    for (const dm of [false, true]) {
      const pub = veil.galleryPayloadFor(A, { shareDm: dm, memberOverrides: {} });
      const model = veil.curateModelFor(pub, []); const defaults = model.defaults;
      const present = sw.presentCriminalGroupings(pub);
      const parts = sw.criminalPartsOf(defaults, [], present); if (!parts.length) { report.towns.push({ seed, dm, parts: 0 }); continue; }
      const partSet = new Set(parts);
      const show = sw.setCriminalVeil([], defaults, false, present);
      const reach = new Set(); let d = []; for (let i = 0; i < 6; i += 1) { for (const e of offered(pub, d)) reach.add(e.address); d = handOpen(pub, defaults, () => true); }
      for (const x of show) if (!reach.has(x.address)) bump(report.unreachable, x.address.replace(/:[^:]+:([a-z]+)$/, ':<id>:$1').replace(/^card:institution:.*/, 'card:institution:<id>'), `${seed} dm=${dm} ${x.address} hidden=${x.hidden}`);
      const hand = handOpen(pub, defaults, (a) => partSet.has(a) || /^class:npc:corruption$/.test(a));
      for (const read of ['gallery', 'link']) {
        const sS = await serve(A, dm, show, read); const sH = await serve(A, dm, hand, read);
        const out = []; diff(sS, sH, '', out);
        for (const [p, a, b] of out) bump(report.showVsHand, `${read} dm=${dm} ${p.replace(/\[\d+\]/g, '[]')}`, `${seed}: SHOW=${JSON.stringify(a)?.slice(0, 200)} | HAND=${JSON.stringify(b)?.slice(0, 200)}`);
      }
      const allOpen = handOpen(pub, defaults, () => true);
      const hideAfter = sw.setCriminalVeil(allOpen, defaults, true, present);
      const nonFamily = handOpen(pub, defaults, (a) => !partSet.has(a) && !/^class:npc:corruption$/.test(a));
      const sX = await serve(A, dm, hideAfter); const sY = await serve(A, dm, nonFamily);
      const out2 = []; diff(sX, sY, '', out2);
      for (const [p, a, b] of out2) bump(report.hideVsDefault, `dm=${dm} ${p.replace(/\[\d+\]/g, '[]')}`, `${seed}: HIDEALL=${JSON.stringify(a)?.slice(0, 200)} | NONFAMILY=${JSON.stringify(b)?.slice(0, 200)}`);
      report.towns.push({ seed, dm, parts: parts.length, show: show.length, hand: hand.length, state: sw.criminalSwitchStateOf(defaults, hideAfter, present) });
      // (4) the town changes after Show-all
      const crim = (A.institutions || []).filter((h) => isRec(h) && /criminal/i.test(String(h.category || '')));
      if (crim.length && !dm) {
        const B = JSON.parse(JSON.stringify(A)); const born = { ...JSON.parse(JSON.stringify(crim[0])), name: 'Zzqx Brotherhood Of Knives' }; delete born.id; delete born.catalogId; B.institutions.push(born);
        const r = await serve(B, false, show); const t = JSON.stringify(r);
        const C = JSON.parse(JSON.stringify(A)); const old = C.institutions.find((h) => h.name === crim[0].name); const oldName = old.name; old.name = 'Qqzw Renamed Den';
        const r2 = await serve(C, false, show); const t2 = JSON.stringify(r2);
        report.later.push({ seed, newHouseSent: /Zzqx Brotherhood/i.test(t), renamedSent: /Qqzw Renamed/i.test(t2), oldHadId: !!crim[0].id, oldName });
      }
    }
  }
  await db.end();
  writeFileSync(process.env.RV10_OUT, JSON.stringify(report, null, 1));
}, 14_400_000);
