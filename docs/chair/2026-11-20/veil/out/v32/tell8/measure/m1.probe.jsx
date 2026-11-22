// R3-TELL-8 unit (viii) STEP 1, THE MEASURE (VEIL-32's builder; ruling 85; brief R3-TELL-8 step 1). No line of 212 or the twin.
// The R3 gate's 140 births (tell-common.mjs :: pool, byte for byte as tell2.sh births them): the 92 hidden-house towns and the
// 48 controls. Each read, Reveal off and DM, under EVERY setting tell-common.mjs :: settings computes (own, g:000..g:110,
// allOpen, off; g:111 = own), plus 'allShown' (part B's: "Show everything criminal" with every hideable house's card shown, so
// nothing is hidden) and 'unmarked' (the old stored shape: no member overrides, no veil marker), by the TWIN (projectShareVeil)
// and by the SERVER (get_gallery_dossier on RV9_SERVER_TPL = v27x211 + this tree's 212). Per page:
//   key     the served `economicState.safetyProfile.crimeTypes` state ('#absent' or the list as [type, desc] pairs)
//   ref     THE RECORD REFERENCE over the page in hand (TELL7's: generateSafetyProfile(served config, tier, houses) then
//           settleCrimeLinesToSignal over the served seats, houses, tensions, services), [type, desc] pairs; run with NO seed
//           active (getActiveRng() is read and recorded: VR13, the seed never ships)
//   refIn   1b: the same writer over the STORED config and tier and the STORED houses restricted to the ones the page serves
//           (by name), with the page's own seats, tensions and services: where refIn != ref, a key the projection or the veil
//           removed from a served input changes the list; plus the input diffs themselves (config keys absent or changed,
//           served houses that equal no stored house, the tier)
//   open    1e: the grouping's truth on this read (block:defense.criminalStructure among the overrides' shut groupings, as
//           the setting writes them) against the data's own evidence (criminalInstitutions an array; and today's
//           GROUPING_OPEN_EVIDENCE, both arrays)
//   dep     1a: each display-time dependent over the page as served and over the page with the reader's list in place:
//           blockListsCrime, deriveCriminalStructure (key, label, note), shadowCaptureShown / criminalsStandHere, the Economics
//           tab's smuggling filter; and whether publicProse 'defense:criminal' (composed at birth from the stored list) ships
//   ma      1f: getStressFlags(served config, served houses).merchantArmy, and whether the merchant-army hook is served
// Per birth: the STORED list ([type, desc]), the seedless writer over the stored config, tier and ALL stored houses (1c), the
// stored merchantArmy flag. LOCAL cluster only (PGHOST). Out: compact JSON (RV9_OUT).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec, OPEN } from '../../../v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const MA_HOOK = "The merchant guild's private security force just detained someone";

it('R3-TELL-8 step 1: the measure', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const { generateSafetyProfile, settleCrimeLinesToSignal } = await import(`${SRC}/src/generators/safetyProfile.js`);
  const { getStressFlags } = await import(`${SRC}/src/generators/priorityHelpers.js`);
  const { blockListsCrime, deriveCriminalStructure } = await import(`${SRC}/src/domain/display/defenseDisplay.js`);
  const { shadowCaptureShown, criminalsStandHere } = await import(`${SRC}/src/domain/display/shadowEconomyShown.js`);
  const { GROUPING_OPEN_EVIDENCE } = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { getActiveRng } = await import(`${SRC}/src/kernel/rngContext.js`);
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  let nrow = 0;
  const server = async (rec, dm, ov) => {
    nrow += 1; const id = `abcd88${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `s8${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov == null ? {} : ov), dm]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  const has = (o, k) => isRec(o) && Object.prototype.hasOwnProperty.call(o, k);
  const spOf = (d) => (isRec(d?.economicState?.safetyProfile) ? d.economicState.safetyProfile : null);
  const pairs = (xs) => (Array.isArray(xs) ? xs.map((c) => (isRec(c) ? [String(c.type), typeof c.desc === 'string' ? c.desc : `#${typeof c.desc}`] : [`#${typeof c}`, ''])) : '#notarray');
  const keyOf = (d) => { const sp = spOf(d); return !sp ? '#nosp' : !has(sp, 'crimeTypes') ? '#absent' : pairs(sp.crimeTypes); };
  const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
  const settle = (d, sp) => settleCrimeLinesToSignal({ ...(d.economicState || {}), safetyProfile: sp }, { seats: d.powerStructure?.factions, estate: d.institutions, tensions: d.history?.currentTensions, services: d.availableServices })?.safetyProfile;
  /** The record reference over a document: [type, desc] pairs, or '#noconfig' / '#threw ...'. */
  const writer = (cfg, tier, houses, d) => { try { return pairs(settle(d, generateSafetyProfile(cfg, tier, houses))?.crimeTypes); } catch (e) { return `#threw ${String(e?.message).slice(0, 80)}`; } };
  const refOf = (d) => (isRec(d?.config) ? writer(d.config, d.tier, recs(d.institutions), d) : '#noconfig');
  /** The page with the reader's list in place (what the cure's one reader would leave on the page's own copy). */
  const withList = (d, list) => { const c = clone(d); const sp = spOf(c); if (sp) { if (Array.isArray(list)) sp.crimeTypes = list.map(([type, desc]) => ({ type, desc })); else delete sp.crimeTypes; } return c; };
  const deps = (d) => {
    const sp = spOf(d) || {}; let cs = null; try { cs = deriveCriminalStructure(d); } catch (e) { cs = { key: `#threw ${String(e?.message).slice(0, 40)}` }; }
    const ct = Array.isArray(sp.crimeTypes) ? sp.crimeTypes : [];
    return { blc: blockListsCrime(d) ? 1 : 0, cs: cs ? [cs.key ?? null, cs.label ?? null, cs.note ?? null] : null, shadow: shadowCaptureShown(sp) ?? null, stand: criminalsStandHere(sp) ? 1 : 0,
      smug: ct.filter((x) => /smuggl|contraband|black market/i.test(String(x?.type ?? ''))).slice(0, 2).map((x) => x.type) };
  };
  const cfgDiff = (sc, ac) => { if (!isRec(sc)) return ['#noconfig']; const out = []; for (const k of Object.keys(ac || {})) { if (!has(sc, k)) out.push(`-${k}`); else if (JSON.stringify(sc[k]) !== JSON.stringify(ac[k])) out.push(`~${k}`); } return out; };
  const out = { meta: { src: SRC, shard: SHARD, started: new Date().toISOString(), rngAtProbe: getActiveRng() ? String(getActiveRng().seed ?? 'set') : null }, towns: [] };
  const ONLY = process.env.RV9_ONLY ? new Set(process.env.RV9_ONLY.split(',')) : null;
  for (const b of E.pool(Number(process.env.RV9_N || 2), SHARD)) {
    if (ONLY && !ONLY.has(b.seed)) continue;
    const A = E.birth(b.cfg, b.seed, null);
    const hideable = recs(A.institutions).filter((h) => E.isHideableHouse(h));
    const storedSp = spOf(A) || {};
    const rec = { seed: b.seed, size: b.size, crisis: b.crisis, hidden: hideable.map((h) => h.name), stored: pairs(storedSp.crimeTypes),
      seedless: writer(A.config, A.tier, recs(A.institutions), A), rngNow: getActiveRng() ? 'set' : null,
      maStored: storedSp.flags?.merchantArmy ?? null, maHookStored: (storedSp.plotHooks || []).some((h) => String(h).startsWith(MA_HOOK)) ? 1 : 0, pages: {} };
    const storedByName = new Map(recs(A.institutions).map((h) => [String(h.name), JSON.stringify(h)]));
    for (const dm of [false, true]) {
      const { sc, deltas } = V.settings(A, dm);
      const cards = hideable.map((h) => ({ address: `card:institution:${V.veil.CARD_KINDS.institution.idOf(h)}`, hidden: false }));
      const sets = Object.fromEntries(Object.entries(deltas).filter(([k]) => k !== 'g:111'));
      if (hideable.length) sets.allShown = [...V.sw.setCriminalVeil(V.opened(OPEN), sc.defaults, false, sc.present, sc.model), ...cards];
      const entries = [...Object.entries(sets).map(([k, d]) => [k, V.write(d)]), ['unmarked', {}]];
      for (const [k, ov] of entries) {
        const shut = k === 'unmarked' ? false : !(sets[k] || []).some((x) => x.address === 'block:defense.criminalStructure' && x.hidden === false);
        for (const [eng, page] of [['tw', V.twin(A, dm, ov)], ['sv', await server(clone(A), dm, ov)]]) {
          const d = isRec(page) ? page : {}; const sp = spOf(d);
          const ref = refOf(d);
          const servedNames = new Set(recs(d.institutions).map((h) => String(h.name)));
          const refIn = writer(A.config, A.tier, recs(A.institutions).filter((h) => servedNames.has(String(h.name))), d);
          const key = keyOf(d);
          const dServed = deps(d); const dRef = deps(withList(d, Array.isArray(ref) ? ref : null));
          let ma = null; try { ma = isRec(d.config) ? (getStressFlags(d.config, recs(d.institutions)).merchantArmy ? 1 : 0) : null; } catch { ma = '#threw'; }
          rec.pages[`${dm ? 'dm' : 'off'}|${k}|${eng}`] = {
            key, ref, refIn: JSON.stringify(refIn) === JSON.stringify(ref) ? '=' : refIn,
            cfg: cfgDiff(d.config, A.config), tier: d.tier === A.tier ? '=' : String(d.tier),
            housesAltered: recs(d.institutions).filter((h) => storedByName.get(String(h.name)) !== JSON.stringify(h)).map((h) => String(h.name)),
            shut: shut ? 1 : 0, evOps: Array.isArray(sp?.criminalInstitutions) ? 1 : 0, evToday: GROUPING_OPEN_EVIDENCE['block:defense.criminalStructure'](d) ? 1 : 0,
            dep: JSON.stringify(dServed) === JSON.stringify(dRef) ? '=' : { served: dServed, ref: dRef },
            prose: has(d.publicProse?.blocks, 'defense:criminal') ? 1 : 0,
            ma, maHook: (sp?.plotHooks || []).some((h) => String(h).startsWith(MA_HOOK)) ? 1 : 0, hooks: Array.isArray(sp?.plotHooks) ? 1 : 0,
          };
        }
      }
    }
    out.towns.push(rec);
  }
  await db.end();
  out.meta.ended = new Date().toISOString();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
