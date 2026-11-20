// REVIEW-VEIL-12 — R3's roster choices where the two rulings MEET (the chair, 07:34 UTC): a power a HIDDEN house raised
// LEAVES WHOLE (no row, no nameless row, no trace) · VR42: the GOVERNING power's row is never removed while the government's
// name stays. Born towns (crime-heavy dials and crises; RV12_CONTROL=1: only towns with no hideable house), stored with the
// three family groupings OPENED by hand and every hideable house hidden whole by the default veil; served by the gallery read
// and the party link, Reveal DM off and on, on chain RV10_TPL. ORACLE for "raised" (independent of R3's rule): the engine's
// own predicate for the Thieves' Guild seat (rulingStructure.js: criminalEffective > 42 && (city|metropolis || > 58) && market
// for small places) evaluated by getInstFlags on the stored config with ALL houses and with the hidden houses REMOVED.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
const strs = (v, out = []) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach((x) => strs(x, out)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) { out.push(k); strs(x, out); } return out; };
const fname = (f) => String(f?.faction ?? f?.name ?? '');
it('rc', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = process.env.RV12_DB || 'rc';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`); const CSK = await import(`${SRC}/src/domain/facts/criminalStructureKey.js`);
  const PH = await import(`${GEN}/src/generators/priorityHelpers.js`);
  let hasMarket = null; try { hasMarket = (await import(`${GEN}/src/domain/facts/market.js`)).hasMarketInstitution; } catch { /* not exported */ }
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  let compose = null; let withPP = null;
  try { compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* master */ }
  await loadGenerationLawPayloads();
  const T = {}; const ex = {}; const bump = (k, bad, e) => { const r = T[k] = T[k] || { n: 0, bad: 0 }; r.n += 1; if (bad) { r.bad += 1; (ex[k] = ex[k] || []).length < 4 && ex[k].push(e); } };
  const labels = {}; const govSeen = {}; let n = 0; const N = Number(process.env.RV10_N || 1); const CONTROL = !!process.env.RV12_CONTROL;
  const open = [{ address: 'block:defense.criminalStructure', hidden: false }, { address: 'block:power.criminalUnderside', hidden: false }, { address: 'block:economy.criminalServices', hidden: false }];
  const guildRule = (cfg, insts, tier) => { const f = PH.getInstFlags(cfg, insts); const ce = f.criminalEffective; const mk = hasMarket ? hasMarket(insts) : true;
    return ce > 42 && (tier === 'city' || tier === 'metropolis' || ce > 58) && (!['thorp', 'hamlet', 'village'].includes(tier) || mk); };
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'city', 'city', 'metropolis', 'metropolis']) for (const crisis of ['none', 'indebted', 'insurgency', 'famine', 'infiltrated', 'politically_fractured', 'none', 'wartime']) {
    n += 1; const seed = `rv12-rc-${size}-${crisis}-${k}-${n}`;
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: n % 2 === 0, magicExists: true, contentProfile: 'grounded', ...(n % 2 ? { priorities: { ...(DEFAULT_CONFIG.priorities || {}), criminal: 85 } } : {}) };
    const cfg = birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    let A = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    A = { ...A }; if (compose) { delete A.publicProse; A = withPP(A, compose(A)); } A = JSON.parse(JSON.stringify(A));
    const hid = (A.institutions || []).filter(hideable); if (CONTROL ? hid.length : !hid.length) continue;
    const kept = (A.institutions || []).filter((h) => !hideable(h));
    let rule = null; try { rule = { all: guildRule(A.config || cfg, A.institutions || [], size), without: guildRule(A.config || cfg, kept, size) }; } catch (e) { rule = { err: String(e.message).slice(0, 60) }; }
    const stF = A.powerStructure?.factions || []; const gov = stF.find((f) => f?.isGoverning); const govName = gov ? fname(gov) : null;
    const guildStored = stF.some((f) => fname(f) === "Thieves' Guild");
    const raisedByHidden = guildStored && rule && rule.all && !rule.without;
    if (gov) govSeen[`${gov.category}:${govName}`] = (govSeen[`${gov.category}:${govName}`] || 0) + 1;
    for (const dm of [false, true]) {
      const ov = veil.writeShareVeil({}, open, { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
      const id = `abcd9c00-0000-0000-0000-${String(n * 2 + (dm ? 1 : 0)).padStart(12, '0')}`; const slug = `rc${n}${dm ? 'd' : 'p'}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
        values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,'unlisted',$5,$6,true,false)`, [id, JSON.stringify(A), slug, `u${slug}`, JSON.stringify(ov), dm]);
      await db.query('set role anon');
      const S = (await db.query('select data from public.get_gallery_dossier($1)', [slug])).rows[0]?.data;
      const L = (await db.query('select public.get_unlisted_dossier($1) as out', [`u${slug}`])).rows[0]?.out?.dossier;
      await db.query('reset role'); await db.query('delete from public.settlements where id = $1', [id]);
      for (const [door, D] of [['gallery', S], ['link', L]]) {
        const tag = `${door} dm=${dm}`; if (!D) { bump(`served nothing (${tag})`, true, seed); continue; }
        const sF = D.powerStructure?.factions || []; const names = sF.map(fname); const all = strs(D);
        const servedHouses = new Set((D.institutions || []).map((h) => String(h?.name || '').toLowerCase()));
        bump(`no nameless power row (${tag})`, sF.some((f) => !fname(f).trim()), `${seed}: ${JSON.stringify(sF.map((f) => [fname(f), f?.category]))}`);
        const shares = sF.map((f) => Number(f?.power)).filter((x) => Number.isFinite(x)); const sum = shares.reduce((a, b) => a + b, 0);
        bump(`power shares sum 100 on every town (${tag})`, shares.length > 0 && sum !== 100, `${seed}: ${sum} stored ${stF.reduce((a, f) => a + (Number(f?.power) || 0), 0)}`); const anyGone = stF.length !== sF.length; if (anyGone) bump(`power shares sum 100 where a power left (${tag})`, sum !== 100 && shares.length > 0, `${seed}: ${sum} of ${JSON.stringify(sF.map((f) => [fname(f), f?.power]))}`);
        // VR42: the government's name served anywhere outside the faction rows => its row stays
        if (govName) { const outside = strs({ ...D, powerStructure: { ...(D.powerStructure || {}), factions: undefined } }).some((s) => s === govName || s.includes(govName));
          const rowStays = names.includes(govName);
          bump(`VR42 governing row present where its name is served (${tag})`, outside && !rowStays, `${seed}: gov "${govName}" (${gov.category}) served elsewhere, row gone; served ${JSON.stringify(names)}`);
          if (gov.category === 'criminal') bump(`VR42 criminal government: row present (${tag})`, !rowStays, `${seed}: "${govName}" outside=${outside}`);
          if (gov.category === 'criminal' && raisedByHidden) bump(`MEET: criminal government AND a guild raised by a hidden house (${tag})`, false, ''); }
        // the ruling: a power a hidden house raised leaves whole
        if (raisedByHidden) { const guildRow = names.includes("Thieves' Guild"); const trace = all.filter((s) => /thieves'? guild/i.test(s) && !servedHouses.has(s.toLowerCase()));
          bump(`raised power absent as a row (${tag})`, guildRow, `${seed}: served ${JSON.stringify(names)}; hidden ${hid.map((h) => h.name).join('|')}`);
          bump(`raised power leaves no trace in served strings (${tag})`, trace.length > 0, `${seed}: ${trace.slice(0, 2).map((s) => s.slice(0, 90))}`);
          const mem = (D.npcs || []).flatMap((p) => (p?.memberships || []).map((m) => String(m?.power || ''))).filter((x) => x === "Thieves' Guild");
          bump(`raised power in no membership (${tag})`, mem.length > 0, `${seed}: ${mem.length}`); }
        if (guildStored && rule && rule.without) bump(`guild NOT raised by hidden (served stays) (${tag})`, false, '');
        // every served criminal power: none stored-and-raised; label distribution
        let key = null; try { key = CSK.criminalStructureKeyOf(D); } catch { key = 'threw'; }
        labels[`${tag} ${String(key)}`] = (labels[`${tag} ${String(key)}`] || 0) + 1;
        // a removed power's name in no served string (beyond a served house or a served power of the same name)
        for (const f of stF) { const nm = fname(f); if (!nm || names.includes(nm) || servedHouses.has(nm.toLowerCase())) continue;
          const hit = all.filter((s) => s.includes(nm)); bump(`removed power "${f.category}" name in no served string (${tag})`, hit.length > 0, `${seed}: "${nm}" in "${(hit[0] || '').slice(0, 100)}"`); }
      }
    }
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify({ T, ex, labels, govSeen }, null, 1));
}, 14_400_000);
