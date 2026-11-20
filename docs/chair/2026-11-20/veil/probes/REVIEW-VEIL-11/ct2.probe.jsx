// REVIEW-VEIL-11 — ONE ATTACK on VEIL-19's item D (427ea0bed): the income shares re-derived to 100 by largest remainder. Where
// the rows carry no usable `weight` (master's legacy shape), 212 scales the STORED integer percentages, which were cut from
// 100 - held. A visitor holds the served integers q (sum 100) and the public rule: for each candidate P (the lawful sum before
// the re-derivation, 1..100) search integer vectors p with sum P whose largest-remainder image is q. If no candidate is 100,
// the visitor PROVES a row was withheld; if the candidates are few, they bound its share (100 - P). Born towns (RV10_GEN or
// RV6_SRC) stored with the DEFAULT veil (RV11_CONTROL=1: no hideable house), served on RV10_TPL as anon (gallery read).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
const lr = (bas) => { let tot = bas.reduce((a, b) => a + b, 0); let b = bas; if (!(tot > 0)) { b = bas.map(() => 1); tot = b.length; }
  const q = b.map((x) => (x / tot) * 100); const sh = q.map((v) => Math.floor(v)); let give = 100 - sh.reduce((a, c) => a + c, 0);
  const ord = q.map((v, k) => [v - Math.floor(v), k]).sort((x, y) => y[0] - x[0] || x[1] - y[1]);
  for (const [, k] of ord) { if (give <= 0) break; sh[k] += 1; give -= 1; } return sh; };
const candidates = (q) => { const out = []; const k = q.length; if (!k || k > 12) return null;
  for (let P = 1; P <= 100; P += 1) { const base = q.map((x) => Math.floor((x * P) / 100)); let found = false;
    for (let m = 0; m < (1 << k) && !found; m += 1) { const p = base.map((x, i) => x + ((m >> i) & 1)); if (p.reduce((a, b) => a + b, 0) !== P) continue;
      if (JSON.stringify(lr(p)) === JSON.stringify(q)) found = true; }
    if (found) out.push(P); }
  return out; };
it('dlattice', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = process.env.RV11_DB || 'dlat';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`); const CSK = await import(`${SRC}/src/domain/facts/criminalStructureKey.js`); const DD = await import(`${SRC}/src/domain/display/defenseDisplay.js`); const CS = await import(`${SRC}/src/domain/crimeSignal.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  let compose = null; let withPP = null;
  try { compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* master */ }
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const rows = []; let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'town', 'city', 'city', 'metropolis', 'metropolis']) for (const crisis of ['none', 'none', 'none', 'infiltrated', 'insurgency', 'indebted', 'wartime', 'none', 'occupied', 'politically_fractured']) {
    n += 1; const seed = `rv10-inv-${size}-${crisis}-${k}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; if (compose) { delete A.publicProse; A = withPP(A, compose(A)); } A = JSON.parse(JSON.stringify(A)); if (process.env.RV11_STRIPW) for (const e of A.economicState?.incomeSources || []) delete e.weight;
    const hid = (A.institutions || []).filter(hideable); if (process.env.RV11_CONTROL ? hid.length : !hid.length) continue;
    const ov = veil.writeShareVeil({}, process.env.RV11_OPEN ? [{ address: 'block:defense.criminalStructure', hidden: false }, { address: 'block:power.criminalUnderside', hidden: false }, { address: 'block:economy.criminalServices', hidden: false }] : [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }); const id = `abcd9700-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,'unlisted',$5,false,true,false)`, [id, JSON.stringify(A), `dl${n}`, `dll${n}`, JSON.stringify(ov)]);
    await db.query('set role anon');
    const S = (await db.query('select data from public.get_gallery_dossier($1)', [`dl${n}`])).rows[0].data;
    const Lk = (await db.query('select public.get_unlisted_dossier($1) as out', [`dll${n}`])).rows[0].out?.dossier;
    await db.query('reset role'); await db.query('delete from public.settlements where id = $1', [id]);
    const hn = (A.institutions || []).filter(hideable).map((h) => String(h.name || '').toLowerCase());
    const goneN = (A.institutions || []).filter((h) => !(S.institutions || []).some((x) => x.name === h.name)).length;
    const ctS = S.economicState?.safetyProfile?.crimeTypes; const ciS = S.economicState?.safetyProfile?.criminalInstitutions;
    let key = null; let lab = null; try { key = CSK.criminalStructureKeyOf(S); } catch (e) { key = 'threw'; } try { const d = DD.deriveCriminalStructure(S); lab = d && JSON.stringify(d).slice(0, 160); } catch (e) { lab = 'threw'; }
    const servedCrim = (S.institutions || []).filter(hideable).length; let keyA = null; try { keyA = CSK.criminalStructureKeyOf(A); } catch (e) { keyA = 'threw'; }
    let drv = {}; try { const sig = CS.crimeSignalOf({ seats: S.powerStructure?.factions, estate: S.institutions }); drv = { gone: (A.institutions || []).filter((h) => !(S.institutions || []).some((x) => x.name === h.name)).map((h) => h.name), powers: sig.powerNames, houses: (sig.houses || []).map((h) => h?.name || h), ci: (S.economicState?.safetyProfile?.criminalInstitutions || []).length, chains: CSK.runningCriminalChains(S).length, covert: CSK.covertCrimeHeld(S), rings: (CSK.ringHousesOf(S) || []).length }; } catch (e) { drv = { err: String(e.message).slice(0, 80) }; }
    rows.push({ seed, ct: true, goneN, key, keyA, lab, servedCrim, drv, ctServed: Array.isArray(ctS) ? ctS.map((c) => String(c?.type || c)) : ctS === undefined ? 'absent' : typeof ctS, ciServed: Array.isArray(ciS) ? ciS.length : 'absent', ciNames: Array.isArray(ciS) ? ciS : [], ciHidden: Array.isArray(ciS) ? ciS.filter((x) => hn.includes(String(x).toLowerCase())) : [],
      ctStored: (A.economicState?.safetyProfile?.crimeTypes || []).map((c) => String(c?.type || c)), descHit: Array.isArray(ctS) ? ctS.filter((c) => /smuggl|thie|black market|gang|assassin|contraband|fence/i.test(JSON.stringify(c))).map((c) => JSON.stringify(c).slice(0, 160)) : [] });
    const inA = A.economicState?.incomeSources || []; const inS = S.economicState?.incomeSources || [];
    const q = inS.map((e) => Number(e.percentage)); const lawful = inA.filter((e) => inS.some((x) => x.source === e.source)).reduce((a, e) => a + Number(e.percentage), 0);
    const withheld = inA.length - inS.length; const cand = withheld > 0 || process.env.RV11_ALL ? candidates(q) : null;
    rows.push({ seed, withheld, weightA: inA.some((e) => typeof e.weight === 'number'), weightServed: inS.some((e) => e.weight !== undefined) || (Lk?.economicState?.incomeSources || []).some((e) => e.weight !== undefined),
      sumS: q.reduce((a, b) => a + b, 0), sumLink: (Lk?.economicState?.incomeSources || []).reduce((a, e) => a + Number(e.percentage), 0), trueP: lawful, cand: cand && (cand.length > 12 ? `${cand.length} values ${cand[0]}..${cand[cand.length - 1]}` : cand), has100: cand ? cand.includes(100) : null, k: q.length });
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify(rows, null, 1));
}, 14_400_000);
