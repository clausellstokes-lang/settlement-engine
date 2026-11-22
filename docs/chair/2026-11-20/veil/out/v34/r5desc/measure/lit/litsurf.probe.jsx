// COPIED by R5-DESC-MEASURE (VEIL-34) from origin/lane/veil-33-2026-11-22-joinprobe-wip (df7447e58) out/v33/joinprobe/lit/measure/litsurf.probe.jsx;
// ONE addition: seatRead's b_contest.strataHits (M5: the four places' strata strings, one by one). Otherwise byte for byte.
// V33-JOINPROBE PASS 2 (LIT), step 4's lit-surfaces item (the chair's 11:29 UTC addition): WHAT THE LIT LAWS ADD ON A SHARED READ,
// each served surface by name, SERVER and TWIN, on births of THIS tree (a measure; changes nothing in src, supabase, the twin or a test).
// Run as the lane's probes run: RV6_SRC=<worktree> RV6_PGMOD=/var/tmp/v18/pgmod RV9_PROBE=<this file> RV9_SERVER_TPL=<tpl: v27x211 + the tree's 212>
//   RV9_SERVER_DB=<prefix> RV9_N=<births per size> RV9_SHARD=<s>/<n> RV9_OUT=<json> npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs
// (1) WHO RULES (SEAT-6-TO-LIGHT section 4, surfaces a-i; ruling 67 (3)'s recommended arm): on each born place, the DM's own act
//   (`rulingPower.js :: transferRulingPower`, the path mutateWorld's CHANGE_RULING_POWER and the pulse take; circumstances handed in
//   as `applyWorldPulseFactionRoster.js` hands them) in three scenarios:
//     T  a HIDDEN TAKER: a non-governing power is hidden by the DM (`hidden: true`) and takes the seat;
//     R  a HIDDEN RETIRED HOLDER: the hidden power takes the seat, then a shown power takes it from it (the retired edge names it);
//     K  a CRIMINAL TAKER (veiled by kind) where the place holds one.
//   publicProse re-composed as a saved record, then read by both engines at two hiding reads: `off` (the default share) and `dm`
//   (the DM door open, gallery_share_dm true), no member overrides. Every served string is name-searched with the lane's fold
//   (`gallerySecondHomes.js :: buildNameSearch`) for the names the read hides: withheld powers (the hidden taker / retired holder
//   among them), hidden houses, and persons the read withholds; the served names are open. Each hit is kept with its path.
// (2) FORTUNE (ruling 63 (1), 65): on each born place (no act): `breakdown.merits`, the score and `meritsOf` on the owner's record
//   and on each served document, both engines, both reads; the counterfactual (the same place with the capture rung set to
//   'capture', and with every hideable house removed): the merits and the score, owner and served; the merit's sentence (U5b, in
//   `publicProse['power:governance']`) served or not, the same across the counterfactual, and name-searched as above.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'thorp,hamlet,village,town,city,metropolis').split(',');
const N = Number(process.env.RV9_N || 10); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const SEED = process.env.RV9_SEED || 'jp6';
const clone = (v) => JSON.parse(JSON.stringify(v));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const powerName = (f) => String(f?.faction ?? f?.name ?? '');
const strings = (v, path = '', out = []) => {
  if (typeof v === 'string') out.push([path, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${path}[${i}]`, out));
  else if (isRec(v)) for (const [k, x] of Object.entries(v)) strings(x, path ? `${path}.${k}` : k, out);
  return out;
};
// a served string's path, by the who-rules lane's surface letters (SEAT-6-TO-LIGHT section 4) and fortune's
const surfaceOf = (p) => {
  if (/^config\./.test(p)) return 'a:config';
  if (/^publicProse\.blocks\.power:desk/.test(p)) return 'c:power:desk';
  if (/^publicProse\.blocks\.power:governance/.test(p)) return 'governance(merit sentence)';
  if (/^powerStructure\.factions\[\d+\]\.desc/.test(p)) return 'd:factions[].desc';
  if (/^powerStructure\.recentConflict/.test(p)) return 'e:recentConflict';
  if (/^powerStructure\.factionRelationships/.test(p)) return 'f:factionRelationships';
  if (/^powerStructure\.publicLegitimacy/.test(p)) return 'fortune:publicLegitimacy';
  if (/^publicProse/.test(p)) return `publicProse:${p.split('.')[2] ?? ''}`;
  return p.split(/[.[]/)[0];
};

it('V33-JOINPROBE lit surfaces', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { isHideableHouse, isVeiledPower } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { buildNameSearch } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const { transferRulingPower } = await import(`${SRC}/src/domain/rulingPower.js`);
  const { seatCircumstancesOf } = await import(`${SRC}/src/domain/seat/seatCircumstances.js`);
  const { holderOf } = await import(`${SRC}/src/domain/seat/holderOfSeat.js`);
  const { coupContenders } = await import(`${SRC}/src/domain/rulingPowerCoup.js`);
  const { derivePowerStrata } = await import(`${SRC}/src/domain/dossier/powerStrata.js`);
  const { meritsOf, weatheredCatastrophe } = await import(`${SRC}/src/domain/fortune/fortuneMerits.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const none = veil.writeShareVeil({}, []);
  const saved = (rec) => { const r = { ...rec }; delete r.publicProse; return clone(withPublicProse(r, composePublicProse(r))); };
  let nrow = 0;
  const server = async (rec, dm) => {
    nrow += 1; const id = `abce9f${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `k${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(none), dm]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  const twin = (rec, dm) => veil.projectShareVeil(veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: none }), none);
  const docs = async (rec) => ({ off: { server: await server(rec, false), twin: twin(rec, false) }, dm: { server: await server(rec, true), twin: twin(rec, true) } });
  // what a read hides, and every served string that names it (the lane's fold), with the surface it rides
  const hides = (rec, doc, extra = []) => {
    const servedInst = new Set((doc?.institutions || []).map((i) => String(i?.name ?? '')));
    const hiddenHouses = (rec.institutions || []).filter((i) => isHideableHouse(i) && !servedInst.has(String(i?.name ?? ''))).map((i) => String(i.name));
    const servedPowers = new Set((doc?.powerStructure?.factions || []).map(powerName));
    const withheldPowers = (rec.powerStructure?.factions || []).filter((f) => isRec(f) && !servedPowers.has(powerName(f))).map(powerName);
    const servedNpcs = new Set((doc?.npcs || []).map((n) => String(n?.name ?? '')));
    const hiddenPersons = (rec.npcs || []).map((n) => String(n?.name ?? '')).filter((n) => n && !servedNpcs.has(n));
    const hidden = [...new Set([...hiddenHouses, ...withheldPowers, ...hiddenPersons, ...extra])].filter(Boolean);
    const open = [...servedInst, ...servedPowers, ...servedNpcs].filter((n) => n && !hidden.includes(n));
    const search = hidden.length ? buildNameSearch(hidden, open) : null;
    const hits = search ? strings(doc).filter(([, s]) => search.hit(s)).map(([p, s]) => ({ surface: surfaceOf(p), path: p, text: s.slice(0, 220) })) : [];
    return { hiddenHouses: hiddenHouses.sort(), withheldPowers: withheldPowers.sort(), hiddenPersons: hiddenPersons.length, closed: !!search?.closed, hits };
  };
  const seatRead = (rec, doc, hiddenPower) => {
    const ps = doc?.powerStructure ?? {};
    const rels = (ps.factionRelationships || []).map((r) => String(r?.narrative ?? ''));
    const ch = (() => { try { return coupContenders(doc).challengers.map((c) => c.name); } catch (e) { return [`ERR ${e.message}`]; } })();
    const strata = (() => { try { return JSON.stringify(derivePowerStrata(doc)); } catch (e) { return `ERR ${e.message}`; } })();
    const h = (() => { try { const x = holderOf(doc, { audience: 'reader' }); return { rule: x.rule, holderName: x.holderName ?? null, person: x.person ? String(x.person.name ?? x.person) : null, refused: x.refused }; } catch (e) { return { err: e.message }; } })();
    const hp = hiddenPower ? buildNameSearch([hiddenPower], []) : null;
    const desk = JSON.stringify(doc?.publicProse?.blocks?.['power:desk'] ?? null);
    return {
      a_config: { seat: doc?.config?._seatLawVersion ?? null, fortune: doc?.config?._fortuneLawVersion ?? null },
      b_contest: { challengers: ch, namesHidden: hp ? ch.filter((c) => hp.hit(c)).length + (hp.hit(strata) ? 1 : 0) : 0 },
      // R5-DESC-MEASURE M5 (VEIL-34): the strata's and the contenders' own strings that name the hidden power or carry the mask, by path
      strataHits: (() => { try { return [...strings(derivePowerStrata(doc), 'strata'), ...strings(coupContenders(doc), 'coup')].filter(([, s]) => (hp && hp.hit(s)) || /an unseen interest/.test(s)).map(([p, s]) => [p, hp && hp.hit(s) ? 1 : 0, /an unseen interest/.test(s) ? 1 : 0, s.slice(0, 400)]); } catch (e) { return [['ERR', 0, 0, String(e?.message)]]; } })(),
      c_desk: { served: desk !== 'null', namesHidden: hp ? hp.hit(desk) : false, unseen: (desk.match(/an unseen interest/gi) || []).length },
      d_desc: { served: (ps.factions || []).filter((f) => typeof f?.desc === 'string' && f.desc).length, namesHidden: hp ? (ps.factions || []).filter((f) => hp.hit(String(f?.desc ?? ''))).length : 0 },
      e_recentConflict: { served: typeof ps.recentConflict === 'string' ? ps.recentConflict : null, namesHidden: hp ? hp.hit(String(ps.recentConflict ?? '')) : false },
      f_edges: { behind: rels.filter((n) => / is the power behind the /.test(n)), retired: rels.filter((n) => / held the .* until .* took it\.$/.test(n)),
        namesHidden: hp ? rels.filter((n) => hp.hit(n)).length : 0,
        corruptedNoCapture: (ps.factionRelationships || []).filter((r) => (r?.type === 'corrupted' || r?.type === 'capture') && r?.captureState === undefined).length },
      g_holderReader: h,
      captureRungServed: ps.criminalCaptureState ?? null,
    };
  };
  const scenarios = (rec) => {
    const fs = rec.powerStructure?.factions || []; const gov = fs.find((f) => f?.isGoverning);
    const cands = fs.filter((f) => isRec(f) && f !== gov && !isVeiledPower(f));
    const crim = fs.filter((f) => isRec(f) && f !== gov && String(f.category ?? '').toLowerCase() === 'criminal');
    const out = [];
    const go = (r, name) => transferRulingPower(r, name, { cause: 'coup', seatCircumstances: () => seatCircumstancesOf(r) });
    if (gov && cands.length >= 1) {
      const A = powerName(cands[0]);
      const hid = clone(rec); hid.powerStructure.factions = hid.powerStructure.factions.map((f) => (powerName(f) === A ? { ...f, hidden: true } : f));
      const t = go(hid, A);
      if (!t.error) out.push({ scen: 'T', hiddenPower: A, from: powerName(gov), rec: t.settlement, transfer: { from: t.transfer?.fromGovernment, to: t.transfer?.toGovernment } });
      if (!t.error && cands.length >= 2) {
        const B = powerName(cands[1]); const r2 = go(t.settlement, B);
        if (!r2.error) out.push({ scen: 'R', hiddenPower: A, taker: B, rec: r2.settlement, transfer: { from: r2.transfer?.fromGovernment, to: r2.transfer?.toGovernment } });
        else out.push({ scen: 'R', skipped: r2.error });
      }
    }
    if (gov && crim.length) {
      const K = powerName(crim[0]); const k = go(clone(rec), K);
      if (!k.error) out.push({ scen: 'K', hiddenPower: K, rec: k.settlement, transfer: { from: k.transfer?.fromGovernment, to: k.transfer?.toGovernment } });
    }
    return out;
  };
  const fortuneRead = (rec, doc) => {
    const leg = doc?.powerStructure?.publicLegitimacy ?? null; const gov = String(doc?.publicProse?.blocks?.['power:governance']?.text ?? '');
    const w = weatheredCatastrophe(rec); const ev = w ? String(w.name ?? '') : '';
    return { merits: leg?.breakdown?.merits ?? null, score: leg?.score ?? null, label: leg?.label ?? null, meritsOf: (() => { try { return meritsOf(doc); } catch (e) { return [`ERR ${e.message}`]; } })(),
      sentence: ev && gov.includes(ev) ? gov.split(/(?<=\.)\s+/).filter((x) => x.includes(ev)) : [], governanceServed: !!gov };
  };
  const rows = [];
  for (const size of SIZES) for (let i = 0; i < N; i += 1) {
    if (((SIZES.indexOf(size) * N) + i) % SHARD[1] !== SHARD[0]) continue;
    const seed = `${SEED}-${size}-${i}`;
    const born = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const rec = saved(born);
    const row = { seed, size, law: { seat: rec.config?._seatLawVersion ?? null, fortune: rec.config?._fortuneLawVersion ?? null } };
    // (2) FORTUNE, no act
    const own = { merits: rec.powerStructure?.publicLegitimacy?.breakdown?.merits ?? null, score: rec.powerStructure?.publicLegitimacy?.score ?? null, meritsOf: meritsOf(rec), rung: rec.powerStructure?.criminalCaptureState ?? null };
    const cap = clone(rec); cap.powerStructure.criminalCaptureState = 'capture'; cap.powerStructure.factions = cap.powerStructure.factions.map((f) => (f?.isGoverning ? { ...f, captureState: 'capture' } : f));
    const noh = clone(rec); noh.institutions = (noh.institutions || []).filter((x) => !isHideableHouse(x));
    const capS = saved(cap);
    const d0 = await docs(rec); const dc = await docs(capS);
    row.fortune = { own, ownCaptured: { meritsOf: meritsOf(cap), score: cap.powerStructure?.publicLegitimacy?.score ?? null }, ownNoHideable: { meritsOf: meritsOf(noh) },
      reads: Object.fromEntries(['off', 'dm'].map((rd) => [rd, { server: fortuneRead(rec, d0[rd].server), twin: fortuneRead(rec, d0[rd].twin), capServer: fortuneRead(cap, dc[rd].server), capTwin: fortuneRead(cap, dc[rd].twin),
        hidesServer: hides(rec, d0[rd].server), hidesTwin: hides(rec, d0[rd].twin), rungServer: d0[rd].server?.powerStructure?.criminalCaptureState ?? null, rungTwin: d0[rd].twin?.powerStructure?.criminalCaptureState ?? null }])) };
    row.baseSeat = Object.fromEntries(['off', 'dm'].map((rd) => [rd, { server: seatRead(rec, d0[rd].server, null), twin: seatRead(rec, d0[rd].twin, null) }]));
    // (1) WHO RULES, the DM's act
    row.seat = [];
    for (const sc of scenarios(rec)) {
      if (!sc.rec) { row.seat.push(sc); continue; }
      const r = saved(sc.rec); const d = await docs(r);
      const ownerHolder = (() => { const x = holderOf(r, { audience: 'owner' }); return { rule: x.rule, holderName: x.holderName ?? null }; })();
      row.seat.push({ scen: sc.scen, hiddenPower: sc.hiddenPower, taker: sc.taker ?? sc.hiddenPower, transfer: sc.transfer, ownerHolder,
        ownerRecentConflict: r.powerStructure?.recentConflict ?? null,
        ownerEdges: (r.powerStructure?.factionRelationships || []).map((e) => String(e?.narrative ?? '')).filter((n) => n.includes(sc.hiddenPower)),
        // the act's power counts as HIDDEN on a read only where that read serves no row of it (the DM door, `dm`, serves a DM-hidden row)
        reads: Object.fromEntries(['off', 'dm'].map((rd) => {
          const servedBy = (doc) => (doc?.powerStructure?.factions || []).some((f) => powerName(f) === sc.hiddenPower);
          const hp = (doc) => (servedBy(doc) ? null : sc.hiddenPower);
          return [rd, { server: { ...seatRead(r, d[rd].server, hp(d[rd].server)), hides: hides(r, d[rd].server, hp(d[rd].server) ? [sc.hiddenPower] : []) },
            twin: { ...seatRead(r, d[rd].twin, hp(d[rd].twin)), hides: hides(r, d[rd].twin, hp(d[rd].twin) ? [sc.hiddenPower] : []) },
            servedPower: servedBy(d[rd].server), servedPowerTwin: servedBy(d[rd].twin) }];
        })) });
    }
    rows.push(row);
  }
  await db.end();
  writeFileSync(process.env.RV9_OUT, JSON.stringify({ shard: SHARD, N, sizes: SIZES, rows }, null, 1));
});
