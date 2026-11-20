// REVIEW-VEIL-13 — COLD READ OF "TRAD-SHARE 1f3cdc135" (the chair, 13:27). The traditions' lane (origin/lane/trad-3-2026-11-20).
// SRC = the lane's tree. Born towns (the gate's recipe, crime dial random; RV13_CRIM=1 forces the criminal dial 85 on odd towns).
// (1) DEPENDENCY: the shared rows (sharedTraditionRowsOf, the save's composer) on the stored town against the same town with
//     every row of a class a DM can hide REMOVED (hideable houses; veiled powers; criminal income rows; npcs' institution
//     ties; history.founding.foundedBy; every house's function-eye fields): byte-equal, else the field moves the text.
//     And (1b) the SET: does any shared row stand on a hideable house or a veiled power (its ownerLabel, its name holding
//     such a name), and does the set itself move when the hideable houses are cut from the genesis input.
// (2) ROUND TRIP: the town saved with its composed publicProse; served by get_gallery_dossier (anon), get_unlisted_dossier
//     (anon) and import_gallery_dossier (an authenticated non-owner), on RV10_TPL (the lane's chain, <=210) and RV13_TPL2
//     (the veil lane's 212), under the default veil and with every Curate address hidden (RV13 inversion); the served
//     `publicProse` traditions rows byte-equal to the client's, and the page's reader (publicProseOf) returns them.
// (3) INVERSION: every address the Curate screen offers hidden at once (curateModelFor's offered addresses + the groupings):
//     the served rows against the same town with NOTHING hidden.
// (4) OLD TOWN: the same town saved WITHOUT the traditions site in publicProse: the served page holds no rows, and the
//     shared tab's source (publicProseOf) returns nothing.
// (5) SEARCH: every served row's strings for any house, power, person or event name of the WHOLE record that the served
//     document does not serve (case-blind, word-start).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
const CRISES = (process.env.RV9_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
const N = Number(process.env.RV9_N || 2);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const canon = (v) => (Array.isArray(v) ? v.map(canon) : isRec(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])])) : v);
const J = (v) => JSON.stringify(canon(v));
const strs = (v, out = []) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach((x) => strs(x, out)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) { out.push(k); strs(x, out); } return out; };
it('trad', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const chains = [['lane', process.env.RV10_TPL], ...(process.env.RV13_TPL2 ? [['veil212', process.env.RV13_TPL2]] : [])];
  const dbs = {};
  for (const [c, tpl] of chains) { await admin.query(`drop database if exists trd_${c} with (force)`); await admin.query(`create database trd_${c} template ${tpl}`); dbs[c] = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: `trd_${c}` }); await dbs[c].connect(); }
  await admin.end();
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const PP = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { sharedTraditionRowsOf } = await import(`${SRC}/src/domain/traditions/shownTraditions.js`);
  const { deriveFoundingTraditions } = await import(`${SRC}/src/domain/traditions/genesis.js`);
  const CV = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const FN = veil.CARD_KINDS.institution.fields.function;
  const T = {}; const ex = {}; const bump = (k, bad, e) => { const r = T[k] = T[k] || { n: 0, bad: 0 }; r.n += 1; if (bad) { r.bad += 1; (ex[k] = ex[k] || []).length < 5 && ex[k].push(e); } };
  const pname = (f) => String(f?.faction ?? f?.name ?? '');
  const rowsOfDoc = (d) => { const r = PP.publicProseOf ? PP.publicProseOf(d, 'traditions') : d?.publicProse?.traditions; return Array.isArray(r) ? r : null; };
  let n = 0; let nrow = 0; let towns = 0; let withRows = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    n += 1; const tag = `${size}-${crisis}-${k}-${n}`; const seed = `r3m-${tag}`;
    const crim = process.env.RV13_CRIM && n % 2 ? { priorities: { ...(DEFAULT_CONFIG.priorities || {}), criminal: 85 }, _randomizePriorities: false } : {};
    const cfg = { ...DEFAULT_CONFIG, ...dials, ...crim, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = clone(generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} })); } catch { continue; }
    towns += 1;
    const rows = sharedTraditionRowsOf(A); if (rows) withRows += 1;
    // (1) DEPENDENCY on every DM-hideable row/field
    const cut = clone(A);
    cut.institutions = (cut.institutions || []).filter((i) => !CV.isHideableHouse(i)).map((i) => { const o = { ...i }; for (const f of FN) delete o[f]; return o; });
    if (cut.powerStructure) cut.powerStructure.factions = (cut.powerStructure.factions || []).filter((f) => !CV.isVeiledPower(f));
    if (cut.economicState) cut.economicState.incomeSources = (cut.economicState.incomeSources || []).filter((r) => r?.isCriminal !== true);
    for (const p of cut.npcs || []) if (isRec(p)) delete p.institution;
    if (cut.history?.founding) delete cut.history.founding.foundedBy;
    const rowsCut = sharedTraditionRowsOf(cut);
    bump('(1) rows equal with every hideable row and field removed from the input', J(rows) !== J(rowsCut), `${tag}: ${JSON.stringify(rows).slice(0, 200)} || ${JSON.stringify(rowsCut).slice(0, 200)}`);
    // (1b) the set's own source: genesis over the whole record vs without the hideable houses / veiled powers
    const hid = (A.institutions || []).filter((i) => CV.isHideableHouse(i)); const vp = (A.powerStructure?.factions || []).filter((f) => CV.isVeiledPower(f));
    const mirror = Array.isArray(A.traditions) && A.traditions.length;
    if (hid.length || vp.length) {
      let g1 = null; let g2 = null; try { g1 = deriveFoundingTraditions(A); g2 = deriveFoundingTraditions(cut); } catch (e) { g1 = String(e.message); }
      bump(`(1b) genesis set equal without the hideable rows (${mirror ? 'mirror' : 'preview'} towns)`, J((g1 || []).map((r) => [r?.name, r?.coreMotif])) !== J((g2 || []).map((r) => [r?.name, r?.coreMotif])), `${tag}: ${JSON.stringify((g1 || []).map((r) => r?.name))} vs ${JSON.stringify((g2 || []).map((r) => r?.name))}`);
      const src = mirror ? A.traditions : (g1 || []);
      const badNames = [...hid.map((h) => String(h.name || '')), ...vp.map(pname)].filter((x) => x.length >= 4).map((x) => x.toLowerCase());
      const onHidden = src.filter((r) => (r?.ownerLabel && badNames.includes(String(r.ownerLabel).toLowerCase())) || badNames.some((b) => String(r?.name || '').toLowerCase().includes(b.replace(/\s*\(.*\)$/, ''))));
      bump('(1b) no tradition of the set stands on a hideable house or veiled power (owner or name)', onHidden.length > 0, `${tag}: ${JSON.stringify(onHidden.map((r) => [r.name, r.ownerKind, r.ownerLabel]))}`);
    }
    if (!rows) continue;
    // the save: the owner's record with its composed publicProse (with and without the traditions site)
    const saved = PP.withPublicProse(clone(A), composePublicProse(A));
    bump('(2) the composed publicProse carries the rows as sharedTraditionRowsOf draws them', J(rowsOfDoc(saved)) !== J(rows), `${tag}`);
    const old = clone(saved); if (old.publicProse && isRec(old.publicProse)) { for (const k2 of Object.keys(old.publicProse)) if (/tradition/i.test(k2)) delete old.publicProse[k2]; if (isRec(old.publicProse.blocks)) for (const k2 of Object.keys(old.publicProse.blocks)) if (/tradition/i.test(k2)) delete old.publicProse.blocks[k2]; }
    // the inversion veil: every address the curate screen offers, hidden
    const pub0 = veil.galleryPayloadFor(clone(saved), { shareDm: true, memberOverrides: {} });
    const model = veil.curateModelFor(pub0, []);
    const offered = new Set(); for (const sec of model?.sections || []) { for (const g of sec.groupings || []) offered.add(g.address); for (const s2 of sec.switches || []) offered.add(s2.address); for (const c of sec.cards || []) { if (c.whole) offered.add(c.whole.address); for (const e of c.eyes || []) offered.add(e.address); } }
    const ovAll = veil.writeShareVeil({}, [...offered].map((a) => ({ address: a, hidden: true })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    const ovDef = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    const ovNone = veil.writeShareVeil({}, [...offered].map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    for (const [c, db] of Object.entries(dbs)) for (const [vname, ov] of [['nothing hidden', ovNone], ['default veil', ovDef], ['EVERY Curate address hidden', ovAll]]) for (const dm of [false, true]) {
      const served = {};
      for (const [form, rec] of [['new', saved], ['old', old]]) {
        nrow += 1; const id = `abcd9a13-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `tr${nrow}`;
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
          values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,'unlisted',$5,$6,true,false)`, [id, JSON.stringify(rec), sl, `u${sl}`, JSON.stringify(ov), dm]);
        await db.query('set role anon');
        const G = (await db.query('select data from public.get_gallery_dossier($1)', [sl])).rows[0]?.data;
        const L = (await db.query('select public.get_unlisted_dossier($1) as out', [`u${sl}`])).rows[0]?.out?.dossier;
        await db.query('reset role');
        await db.query("select set_config('test.uid', '22222222-2222-2222-2222-222222222222', false), set_config('test.role', 'authenticated', false)"); await db.query('set role authenticated');
        let I = null; try { I = (await db.query('select data from public.import_gallery_dossier($1)', [sl])).rows[0]?.data; } catch (e) { I = { __err: String(e.message).slice(0, 80) }; }
        await db.query('reset role'); await db.query("select set_config('test.uid', '', false), set_config('test.role', '', false)");
        await db.query('delete from public.settlements where id = $1', [id]);
        served[form] = { gallery: G, link: L, import: I };
      }
      for (const door of ['gallery', 'link', 'import']) {
        const tg = `${c} ${door} ${vname} dm=${dm}`; const D = served.new[door];
        if (!D || D.__err) { bump(`(2) served a document (${tg})`, true, `${tag}: ${D?.__err || 'null'}`); continue; }
        const got = rowsOfDoc(D);
        bump(`(2) served rows byte-equal to the client's (${tg})`, J(got) !== J(rows), `${tag}: served ${JSON.stringify(got).slice(0, 220)}`);
        const Do = served.old[door]; bump(`(4) a town saved before the change serves no rows (${tg})`, !!(Do && rowsOfDoc(Do)), `${tag}`);
        // (5) search: names of the whole record the served document does not serve
        const svH = new Set((D.institutions || []).map((h) => String(h?.name || '').toLowerCase())); const svP = new Set((D.powerStructure?.factions || []).map((f) => pname(f).toLowerCase())); const svN = new Set((D.npcs || []).map((p) => String(p?.name || '').toLowerCase()));
        const gone = [...(A.institutions || []).map((h) => String(h?.name || '')).filter((x) => !svH.has(x.toLowerCase())), ...(A.powerStructure?.factions || []).map(pname).filter((x) => !svP.has(x.toLowerCase())), ...(A.npcs || []).map((p) => String(p?.name || '')).filter((x) => !svN.has(x.toLowerCase())), ...(A.history?.historicalEvents || []).map((e) => String(e?.name || '')).filter((x) => !new Set((D.history?.historicalEvents || []).map((e) => String(e?.name || ''))).has(x))]
          .flatMap((x) => [x, x.replace(/\s*\([^)]*\)\s*/g, ' ').trim()]).map((x) => x.toLowerCase()).filter((x) => x.length >= 5);
        const txt = strs(got || []).map((s) => s.toLowerCase());
        const hit = gone.find((g) => txt.some((s) => { for (let i = s.indexOf(g); i >= 0; i = s.indexOf(g, i + 1)) if (i === 0 || !/[a-z0-9]/.test(s[i - 1])) return true; return false; }));
        bump(`(5) the rows name nothing the served document withholds, nor a withheld event (${tg})`, !!hit, `${tag}: "${hit}"`);
      }
    }
  }
  for (const db of Object.values(dbs)) await db.end();
  const lines = [`towns ${towns}, with shared rows ${withRows}`, ...Object.entries(T).map(([k2, v]) => `${v.bad}/${v.n}\t${k2}`), '', 'EXAMPLES', ...Object.entries(ex).flatMap(([k2, v]) => [k2, ...v.map((x) => `   ${x}`)])];
  writeFileSync(process.env.RV10_OUT, lines.join('\n') + '\n');
}, 14_400_000);
