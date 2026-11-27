// R5D-SQL-2 (VEIL-37, the chair's E136 (a)): THE MASK IN THE NAME SLOT, on born towns, through the server and the twin (a measure:
// it changes nothing in src, supabase, the twin or a test). Re-makes the shape of R5D-SQL's lost scratch probe, and adds the plants.
//   RV6_SRC=<worktree> RV6_PGMOD=<dir with pg> RV9_PROBE=<this file> R5Q_DB=<001..211 + this 212> R5Q_DB_OLD=<001..211 + eeda6a126's 212>
//   R5Q_OLD_LIT=<eeda6a126's STANDING_FORMS literal, a file> R5Q_OUT=<dir> [R5Q_N=6] npx vitest run --config <rv9 vitest.config.mjs> --maxWorkers=1
// (1) THE BORN READS: births `v11-ties-<size>-<calm|infiltrated>-<i>` (six sizes, calm and infiltrated, R5Q_N each; the browser's
//     random config as bcd-born / v106-born), the new stored shape with its prose. Per town: the gallery read unmarked (no veil),
//     with the default veil, and with the default veil and Reveal DM (get_gallery_dossier, as anon), and the party link
//     (get_unlisted_dossier, as anon, the default veil); each against the twin's projectShareVeil(galleryPayloadFor(...)). Per read:
//     twin = server (every leaf); every served desc of both power lists: no table tail left (the reference cut finds no row); equal
//     to the reference cut of the desc the projection hands the veil (galleryPayloadFor: the mask written in); and, counted, against
//     the reference cut of the STORED desc. Brief item 6: a served base that holds the mask is COUNTED (reads, towns, sentences).
// (2) THE PLANTS (act T's own path, without the seat transfer): a power HIDDEN BY THE OWNER (`hidden: true` set on its row, the
//     owner's choice) whose label another power's STANDING carries, so the projection's maskText writes the mask into that
//     standing. Candidates are found by the twin; up to R5Q_PER (3) plants per class, the class being the row that cuts the masked
//     standing and the slot's place (a sentence head; mid-sentence; after capital words, a partial name). Each plant is read
//     Reveal off (the default veil, and unmarked) by THIS tree's server and twin: the masked standing must be cut, the served desc
//     the base; and by eeda6a126's server (R5Q_DB_OLD) and twin (this twin with eeda6a126's literal, R5Q_OLD_LIT: the two trees'
//     twins differ in that literal alone): the masked standing sentence must be served WHOLE in the desc (THE RED, said).
// The largest born metropolis (its stored text) is written to R5Q_OUT/largest-metropolis.json for the cost law (cost.mjs).
import { expect, it, vi } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
/** The leaves at which two documents differ: [count, the first few paths]. */
function differ(a, b) {
  let n = 0; const at = []; const stack = [[a, b, '']];
  while (stack.length) {
    const [x, y, p] = stack.pop();
    if (isRec(x) && isRec(y)) { for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) stack.push([x[k], y[k], `${p}.${k}`]); continue; }
    if (Array.isArray(x) && Array.isArray(y)) { for (let i = 0; i < Math.max(x.length, y.length); i += 1) stack.push([x[i], y[i], `${p}[${i}]`]); continue; }
    if (JSON.stringify(x) !== JSON.stringify(y)) { n += 1; if (at.length < 5) at.push(p); }
  }
  return [n, at];
}
const LISTS = [['powerStructure', 'factions'], ['factions']];
const listOf = (doc, path) => { let v = doc; for (const k of path) v = isRec(v) ? v[k] : undefined; return Array.isArray(v) ? v : []; };
const sentences = (t) => String(t).split(/(?<=[.!?])\s+/);

it('R5D-SQL-2: the mask in the name slot, born towns and plants, server and twin', async () => {
  const OUT = process.env.R5Q_OUT;
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const dbNew = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.R5Q_DB }); await dbNew.connect();
  const dbOld = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.R5Q_DB_OLD }); await dbOld.connect();
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { HIDDEN_POWER_MASK: MASK } = await import(`${SRC}/src/domain/display/publicSafe.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const sf = await import(`${SRC}/scripts/veil/standingForms.mjs`);
  const { powerSentenceName } = await import(`${SRC}/src/data/people/powerSentenceName.js`);
  const rowsNew = sf.compileRows(sf.readTable().forms);
  const refBase = (d) => { const c = sf.cutDesc(d, rowsNew); return c ? c.base : d; };
  // eeda6a126's twin: standingBase over eeda6a126's literal (the one difference between the two trees' twins)
  const oldRows = Object.entries(JSON.parse(readFileSync(process.env.R5Q_OLD_LIT, 'utf8'))).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([id, r]) => ({ id, re: new RegExp(`(?:^| )(${r.re})`) }));
  const oldBase = (desc) => { let rest = desc; for (;;) { let at = -1; for (const r of oldRows) { const m = r.re.exec(rest); if (m && (at < 0 || m.index < at)) at = m.index; } if (at < 0) return rest; rest = rest.slice(0, at); } };
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const N = Number(process.env.R5Q_N || 6); const PER = Number(process.env.R5Q_PER || 3);
  const AT = '2026-11-01T00:00:00.000Z';
  const DEFAULT_OV = veil.writeShareVeil({}, [], { mode: 'live', at: AT });
  let nrow = 0;
  /** One stored row, its gallery read (and the link), as anon. */
  const serve = async (db, rec, ov, dm, link = false) => {
    nrow += 1; const slug = `r5q${nrow}`;
    await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
      values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', $1, $2, $3, true, $4, now(), $5, 'unlisted', $6, $7, true)`,
    [String(rec.name || 'T'), String(rec.tier || 'town'), JSON.stringify(rec), slug, `${slug}l`, JSON.stringify(ov), dm]);
    const q = async (sql, arg) => {
      await db.query("select set_config('test.uid', '', false)"); await db.query('set role anon');
      try { return (await db.query(sql, [arg])).rows[0]?.d ?? null; } catch (e) { return { ERROR: String(e?.message || e).slice(0, 160) }; } finally { await db.query('reset role'); }
    };
    const out = { gallery: await q('select (select to_jsonb(g.data) from public.get_gallery_dossier($1) g) as d', slug) };
    if (link) out.link = await q("select public.get_unlisted_dossier($1) -> 'dossier' as d", `${slug}l`);
    await db.query('delete from public.settlements where public_slug = $1', [slug]);
    return out;
  };
  const twinOf = (rec, ov, dm) => veil.projectShareVeil(veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: ov }), ov);
  const projOf = (rec, ov, dm) => veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: ov });
  /** The served descs of both lists, each with its projected and stored counterparts (by list and faction). */
  const descRows = (served, proj, rec) => {
    const out = [];
    for (const path of LISTS) {
      const pl = listOf(proj, path); const rl = listOf(rec, path);
      for (const f of listOf(served, path)) {
        if (!isRec(f) || typeof f.desc !== 'string') continue;
        const key = typeof f.faction === 'string' ? f.faction : f.name;
        const p = pl.find((x) => isRec(x) && (x.faction ?? x.name) === key);
        const r = rl.find((x) => isRec(x) && (x.faction ?? x.name) === key);
        out.push({ list: path.join('.'), key, served: f.desc, proj: p && typeof p.desc === 'string' ? p.desc : null, stored: r && typeof r.desc === 'string' ? r.desc : null });
      }
    }
    return out;
  };

  // (1) THE BORN READS
  const stat = { towns: 0, reads: 0, raise: 0, twinDiff: 0, twinDiffAt: [], descs: 0, cut: 0, baseOnly: 0, tailLeft: 0, tailLeftEx: [], refDiff: 0, refDiffEx: [], noProj: 0,
    storedDiff: 0, storedDiffEx: [], maskBase: { reads: 0, towns: new Set(), sentences: new Map() } };
  const births = [];
  for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) births.push([settType, stress, `v11-ties-${settType}-${stress || 'calm'}-${i}`]);
  const recs = [];
  let largest = null;
  for (const [settType, stress, seed] of births) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let born; try { born = gen(density.birthConfig(cfg), null, { seed, customContent: {} }); } catch { continue; }
    const rec = clone({ ...born, publicProse: compose(born) });
    recs.push({ seed, rec });
    stat.towns += 1;
    if (settType === 'metropolis') { const len = JSON.stringify(rec).length; if (!largest || len > largest.len) largest = { seed, len, rec }; }
    const reads = [['unmarked', {}, false], ['default', DEFAULT_OV, false], ['dm', DEFAULT_OV, true]];
    for (const [kind, ov, dm] of reads) {
      const srv = await serve(dbNew, rec, ov, dm, kind === 'default');
      const twin = twinOf(rec, ov, dm); const proj = projOf(rec, ov, dm);
      for (const [rd, doc] of Object.entries(srv)) {
        stat.reads += 1;
        if (!doc || doc.ERROR) { stat.raise += 1; continue; }
        const [d, at] = differ(doc, twin);
        if (d) { stat.twinDiff += 1; if (stat.twinDiffAt.length < 8) stat.twinDiffAt.push(`${seed} ${kind}/${rd}: ${d} leaves, ${at.join(' ')}`); }
        let maskHere = false;
        for (const r of descRows(doc, proj, rec)) {
          stat.descs += 1;
          if (r.proj === null) { stat.noProj += 1; continue; }
          if (r.proj !== r.served) stat.cut += 1; else stat.baseOnly += 1;
          if (sf.cutDesc(r.served, rowsNew)) { stat.tailLeft += 1; if (stat.tailLeftEx.length < 5) stat.tailLeftEx.push(`${seed} ${kind}/${rd} ${r.key}: ${r.served.slice(-200)}`); }
          if (refBase(r.proj) !== r.served) { stat.refDiff += 1; if (stat.refDiffEx.length < 5) stat.refDiffEx.push(`${seed} ${kind}/${rd} ${r.key}`); }
          if (r.stored !== null && refBase(r.stored) !== r.served) { stat.storedDiff += 1; if (stat.storedDiffEx.length < 5) stat.storedDiffEx.push(`${seed} ${kind}/${rd} ${r.key}: "${r.served.slice(0, 140)}"`); }
          if (r.served.includes(MASK)) {
            maskHere = true; stat.maskBase.towns.add(seed);
            for (const s of sentences(r.served)) if (s.includes(MASK)) stat.maskBase.sentences.set(s, (stat.maskBase.sentences.get(s) || 0) + 1);
          }
        }
        if (maskHere) stat.maskBase.reads += 1;
      }
    }
  }
  if (largest) writeFileSync(`${OUT}/largest-metropolis.json`, JSON.stringify({ seed: largest.seed, length: largest.len, record: largest.rec, defaultVeil: DEFAULT_OV }));

  // (2) THE PLANTS: candidates by the twin, classed by the row that cuts the masked standing and the slot's place
  const candidates = new Map();
  for (const { seed, rec } of recs) {
    const fs = listOf(rec, ['powerStructure', 'factions']);
    for (const P of fs) {
      if (!isRec(P) || P.hidden === true || typeof P.faction !== 'string' || !P.faction) continue;
      const L = P.faction;
      for (const O of fs) {
        if (O === P || !isRec(O) || typeof O.desc !== 'string') continue;
        const c = sf.cutDesc(O.desc, rowsNew);
        if (!c || !c.standing.includes(L)) continue;
        const planted = clone(rec);
        for (const f of listOf(planted, ['powerStructure', 'factions'])) if (isRec(f) && f.faction === L) f.hidden = true;
        const proj = projOf(planted, DEFAULT_OV, false);
        const po = listOf(proj, ['powerStructure', 'factions']).find((x) => isRec(x) && x.faction === O.faction);
        if (!po || typeof po.desc !== 'string' || !po.desc.includes(MASK)) continue;
        const pc = sf.cutDesc(po.desc, rowsNew);
        const masked = pc ? sentences(pc.standing).filter((s) => s.includes(MASK)) : [];
        const head = masked.some((s) => s.startsWith(MASK));
        // a partial name: the hidden label inside a longer power name the standing carries ("Free Elder Council")
        const partial = fs.some((Q) => isRec(Q) && Q !== P && typeof Q.faction === 'string' && powerSentenceName(Q.faction) !== L
          && powerSentenceName(Q.faction).includes(L) && c.standing.includes(powerSentenceName(Q.faction)));
        const ids = pc ? pc.ids.join('+') : 'NO-ROW';
        const cls = `${ids} ${head ? 'head' : partial ? 'partial' : 'mid'}`;
        if (!candidates.has(cls)) candidates.set(cls, []);
        const list = candidates.get(cls);
        if (list.length < PER && !list.some((x) => x.seed === seed)) list.push({ seed, hidden: L, other: O.faction, planted, standing: pc ? pc.standing : po.desc });
      }
    }
  }
  const plants = { n: 0, classes: [], fails: [], newWhole: 0, oldWhole: 0, oldNotRed: [] };
  for (const [cls, list] of [...candidates.entries()].sort()) {
    plants.classes.push(`${cls}: ${list.length}`);
    for (const pl of list) {
      for (const [kind, ov] of [['default', DEFAULT_OV], ['unmarked', {}]]) {
        plants.n += 1;
        const proj = projOf(pl.planted, ov, false);
        const pDesc = listOf(proj, ['powerStructure', 'factions']).find((x) => isRec(x) && x.faction === pl.other)?.desc ?? null;
        const want = typeof pDesc === 'string' ? refBase(pDesc) : null;
        const sNew = (await serve(dbNew, pl.planted, ov, false)).gallery;
        const sOld = (await serve(dbOld, pl.planted, ov, false)).gallery;
        const twin = twinOf(pl.planted, ov, false);
        const pick = (doc) => listOf(doc, ['powerStructure', 'factions']).find((x) => isRec(x) && x.faction === pl.other)?.desc ?? null;
        const got = { server: pick(sNew), twin: pick(twin), oldServer: pick(sOld), oldTwin: typeof pDesc === 'string' ? oldBase(pDesc) : null };
        const [d] = differ(sNew, twin);
        const ok = want !== null && got.server === want && got.twin === want && !String(want).includes(MASK) && d === 0;
        if (ok) plants.newWhole += 1; else plants.fails.push(`${cls} ${pl.seed} hide "${pl.hidden}" in "${pl.other}" ${kind}: want "${String(want).slice(-120)}" server "${String(got.server).slice(-120)}" twin "${String(got.twin).slice(-120)}" twinDiff ${d}`);
        // THE RED: eeda6a126's two engines serve the same desc, and it still holds each masked standing sentence WHOLE (a later
        // note that holds no mask is cut there: the masked rank line before it is not)
        const maskedSentences = typeof pDesc === 'string' ? sentences(pl.standing).filter((x) => x.includes(MASK)) : [];
        const red = typeof got.oldServer === 'string' && got.oldServer === got.oldTwin && maskedSentences.length > 0
          && maskedSentences.every((x) => got.oldServer.includes(x)) && got.oldServer !== want;
        if (red) plants.oldWhole += 1; else plants.oldNotRed.push(`${cls} ${pl.seed} ${kind}: old server "${String(got.oldServer).slice(-120)}" old twin "${String(got.oldTwin).slice(-120)}"`);
      }
    }
  }
  const ex = [...candidates.entries()].sort().map(([cls, list]) => `  ${cls}: e.g. ${list[0].seed}, "${list[0].hidden}" hidden, in "${list[0].other}": "${list[0].standing.slice(0, 220)}"`);
  await dbNew.end(); await dbOld.end();
  const lines = [
    `r5dsql2 probe: ${stat.towns} born towns; ${stat.reads} reads (gallery unmarked, default veil, Reveal DM; the link); reads that raise ${stat.raise}`,
    `  TWIN = SERVER: reads that differ ${stat.twinDiff}${stat.twinDiffAt.length ? `\n    ${stat.twinDiffAt.join('\n    ')}` : ''}`,
    `  served descs ${stat.descs}: cut ${stat.cut}, a base as handed ${stat.baseOnly}, no projected counterpart ${stat.noProj}`,
    `  STILL ENDING IN A TABLE TAIL: ${stat.tailLeft}${stat.tailLeftEx.length ? `\n    ${stat.tailLeftEx.join('\n    ')}` : ''}`,
    `  DIFFERING FROM THE REFERENCE CUT of the desc the projection hands the veil: ${stat.refDiff}${stat.refDiffEx.length ? ` (${stat.refDiffEx.join('; ')})` : ''}`,
    `  differing from the reference cut of the STORED desc (the projection's mask aside, counted): ${stat.storedDiff}${stat.storedDiffEx.length ? `\n    ${stat.storedDiffEx.join('\n    ')}` : ''}`,
    `  item 6, A SERVED BASE HOLDING THE MASK: reads ${stat.maskBase.reads}, towns ${stat.maskBase.towns.size}${stat.maskBase.towns.size ? ` (${[...stat.maskBase.towns].join(', ')})` : ''}, sentences ${stat.maskBase.sentences.size}`,
    ...[...stat.maskBase.sentences.entries()].map(([s, k]) => `    ${k}x "${s}"`),
    `r5dsql2 plants (an owner-hidden power whose label another power's standing carries): ${plants.n} reads of ${[...candidates.values()].reduce((a, l) => a + l.length, 0)} plants, by class (the row that cuts the masked standing; the slot's place):`,
    ...plants.classes.map((c) => `  ${c}`), ...ex,
    `  THIS TREE, server and twin: the served desc is the base on ${plants.newWhole} / ${plants.n}${plants.fails.length ? `\n    FAIL ${plants.fails.slice(0, 8).join('\n    FAIL ')}` : ''}`,
    `  AT eeda6a126 (THE RED), server and twin: the masked standing served WHOLE on ${plants.oldWhole} / ${plants.n}${plants.oldNotRed.length ? `\n    NOT RED ${plants.oldNotRed.slice(0, 8).join('\n    NOT RED ')}` : ''}`,
  ];
  writeFileSync(`${OUT}/probe.txt`, `${lines.join('\n')}\n`);
  writeFileSync(`${OUT}/probe.json`, JSON.stringify({ stat: { ...stat, maskBase: { reads: stat.maskBase.reads, towns: [...stat.maskBase.towns], sentences: Object.fromEntries(stat.maskBase.sentences) } }, plants: { ...plants }, classes: [...candidates.keys()] }, null, 1));
  console.log(lines.join('\n'));
  expect({ raise: stat.raise, twinDiff: stat.twinDiff, tailLeft: stat.tailLeft, refDiff: stat.refDiff, plantFails: plants.fails.length, notRed: plants.oldNotRed.length, plants: plants.n > 0 })
    .toEqual({ raise: 0, twinDiff: 0, tailLeft: 0, refDiff: 0, plantFails: 0, notRed: 0, plants: true });
}, 14_400_000);
