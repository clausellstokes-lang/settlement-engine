// R3-CURE MEASURE (VEIL-23's R3-cure builder): units 2, 4 and 5 on born towns, THROUGH THE SERVER (scratch PG16, a chain
// of the worktree's migrations), the veil "groupings and the plot-hooks tab opened by hand, every hideable house hidden
// whole" (R3's measure veil). Two stored shapes: L (as born: the powers in powerStructure.factions) and M (master's: the
// same powers ALSO in the top-level factions[], R4's twins). Per town: A (as born) and B (the house-free counterfactual:
// every hideable house taken out after every step, R6's / R3's birth), each read by the gallery (Reveal off, on), A by
// the link and the import too. Out: compact JSON per town (RV9_OUT).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
const CRISES = (process.env.RV9_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
const N = Number(process.env.RV9_N || 1); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const READER = '22222222-2222-2222-2222-222222222222';
const fname = (f) => (isRec(f) ? String(f.faction ?? f.name ?? '') : '');
const norm = (p) => p.replace(/\[\d+\]/g, '[]');
/** Every string (value or key) of `doc` holding `needle` (case-insensitive), by path. */
function hits(doc, needle) {
  const out = []; const n = needle.toLowerCase(); const stack = [[doc, '']];
  while (stack.length) {
    const [v, p] = stack.pop();
    if (typeof v === 'string') { if (v.toLowerCase().includes(n)) out.push([norm(p), v.length > 90 ? `${v.slice(0, 90)}…` : v]); }
    else if (Array.isArray(v)) v.forEach((x, i) => stack.push([x, `${p}[${i}]`]));
    else if (isRec(v)) for (const k of Object.keys(v)) { if (k.toLowerCase().includes(n)) out.push([`${norm(p)}.{KEY}`, k]); stack.push([v[k], p ? `${p}.${k}` : k]); }
  }
  return out;
}
it('R3-cure measure', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  await db.query(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { criminalStructureKeyOf } = await import(`${SRC}/src/domain/facts/criminalStructureKey.js`);
  const { crimeSignalOf } = await import(`${SRC}/src/domain/crimeSignal.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const birth = (cfg, seed, drop) => {
    const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
    let t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: drop ? (name, ctx) => { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } : undefined });
    if (drop) cut(t.institutions);
    t = { ...t }; delete t.publicProse; t = withPublicProse(t, composePublicProse(t));
    return JSON.parse(JSON.stringify(t));
  };
  let nrow = 0;
  const ov = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
  const served = async (rec, dm, all) => {
    nrow += 1; const id = `abcd9f${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `c${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const out = { gallery: (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d };
    if (all) {
      if (!dm) out.link = (await db.query(`select public.get_unlisted_dossier($1) -> 'dossier' d`, [`${sl}l`])).rows[0]?.d;
      await db.query(`select set_config('test.uid', '${READER}', false)`);
      out.import = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [sl])).rows[0]?.d;
      await db.query(`select set_config('test.uid', '', false)`);
    }
    await db.query('delete from public.settlements where id = $1', [id]);
    return out;
  };
  const keyWhy = (s) => {
    const names = (s?.institutions || []).map((i) => String(i?.name || ''));
    const m = (re) => names.filter((n) => re.test(n.toLowerCase()));
    const sig = crimeSignalOf({ seats: s?.powerStructure?.factions, estate: s?.institutions });
    return { key: criminalStructureKeyOf(s), guild: m(/thieves'? guild/), syndicate: m(/multiple criminal|underground city|front business/), semi: m(/smuggling|black market|gambling/),
      diffuse: m(/fence|bandit|outlaw/), powers: sig.powerNames, houses: sig.houses, ops: (s?.economicState?.safetyProfile?.criminalInstitutions || []).map((c) => (isRec(c) ? c.name ?? c.type ?? J(c) : c)),
      chains: (s?.economicState?.activeChains || []).filter((c) => c?.needKey === 'criminal_economy').map((c) => c?.status) };
  };
  const J = (v) => JSON.stringify(v);
  const types = (s) => { const c = s?.economicState?.safetyProfile?.crimeTypes; return Array.isArray(c) ? c.map((x) => x?.type ?? null) : c === undefined ? '(absent)' : c; };
  const out = []; let idx = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `r3m-${size}-${crisis}-${k}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = birth(cfg, seed, null); } catch (e) { out.push({ seed, threw: String(e.message).slice(0, 100) }); continue; }
    const hidden = (A.institutions || []).filter((h) => isHideableHouse(h));
    const rec = { seed, hidden: hidden.map((h) => ({ name: h.name, cat: h.category ?? null })), shown: (A.institutions || []).filter((h) => !isHideableHouse(h)).map((h) => h.name),
      storedPowers: (A.powerStructure?.factions || []).map((f) => ({ n: fname(f), c: f.category ?? null, g: f.isGoverning === true })), topLevel: Array.isArray(A.factions) ? A.factions.length : null,
      storedInst: A.economicState?.safetyProfile?.compound?.inst || null, storedTypes: types(A), storedKey: keyWhy(A).key };
    let B = null;
    if (hidden.length) { try { B = birth(cfg, seed, (h) => isHideableHouse(h)); } catch (e) { rec.Bthrew = String(e.message).slice(0, 100); } }
    if (B) rec.Bpowers = (B.powerStructure?.factions || []).map((f) => ({ n: fname(f), c: f.category ?? null, g: f.isGoverning === true }));
    const M = { ...A, factions: JSON.parse(JSON.stringify(A.powerStructure?.factions || [])) };
    rec.reads = {};
    for (const [shape, doc] of [['L', A], ['M', M]]) for (const dm of [false, true]) {
      const r = await served(doc, dm, true);
      for (const [read, d] of Object.entries(r)) {
        if (!isRec(d)) { rec.reads[`${shape}/${dm ? 'dm' : 'off'}/${read}`] = { none: true }; continue; }
        // a power is gone where its list (powerStructure.factions, or the top-level factions[]) no longer serves it
        const goneOf = (stored, sent) => { const sv = new Set((Array.isArray(sent) ? sent : []).map(fname)); return (Array.isArray(stored) ? stored : []).map(fname).filter((n) => n && !sv.has(n)); };
        const gone = [...new Set([...goneOf(doc.powerStructure?.factions, d.powerStructure?.factions), ...(Array.isArray(d.factions) ? goneOf(doc.factions, d.factions) : [])])];
        const h = {}; for (const g of gone) h[g] = hits(d, g);
        const x = { gone, hits: h, types: types(d), why: keyWhy(d), inst: d.economicState?.safetyProfile?.compound?.inst || null,
          powers: (d.powerStructure?.factions || []).map((f) => ({ n: fname(f), c: f.category ?? null, g: f.isGoverning === true, p: f.power })),
          top: Array.isArray(d.factions) ? d.factions.map((f) => ({ n: fname(f), keys: isRec(f) ? Object.keys(f).sort() : typeof f })) : null };
        rec.reads[`${shape}/${dm ? 'dm' : 'off'}/${read}`] = x;
      }
    }
    if (B) for (const dm of [false, true]) {
      const d = (await served(B, dm, false)).gallery;
      rec.reads[`B/${dm ? 'dm' : 'off'}/gallery`] = { types: types(d), why: keyWhy(d), inst: d?.economicState?.safetyProfile?.compound?.inst || null };
    }
    out.push(rec);
  }
  await db.end();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
