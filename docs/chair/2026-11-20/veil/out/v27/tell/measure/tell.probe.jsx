// R3-TELL unit 1, PASS 2: THE POSSIBLE-WORLD RULE, MEASURED (ruling 49). MEASURE ONLY: no line of 212 or the twin.
// Per birth of the gate's pool with a hideable house (A) and its counterfactual B (the generator with every hideable house
// cut after every step; tell-common.mjs), Reveal DM off and on, per SETTING FAMILY X (tell-common.mjs :: settings: own,
// the seven other mixed settings g:<bits> of the three criminal groupings, allOpen, off), each computed on its own record:
//   A_X  today's served page (twin; and the server: get_gallery_dossier on the scratch PG16, 211+212 of this tree)
//   B_X  B's page under the same setting
//   W    THE WITHHELD SET: the content items (tell-surface.mjs, kind C) B_X shows and A_X does not
//   N    THE NEAREST SETTING: X plus the FEWEST criminal parts of B's own Curate screen (criminalVeilSwitch.js ::
//        criminalPartsOf, the parts a hand can see and undo) hidden such that B_N shows none of W; ties broken toward the
//        setting that keeps the most surface items shown (counted). None found among the single parts' covers: the switch
//        OFF; still not covered: UNCOVERABLE (no setting of the owner's switches withholds it: the rule would have to REVEAL).
//   T    the target page: B_N. THE TELL COLUMN: surface(A_X) == surface(T), family by family (YES/NO with the items).
//   COST: items A_X shows and T does not (what a reader of the cured page loses beside today's page).
// The server reads A_X and T too: parity with the twin per family, and its own tell.
// Control (no hideable house): B is A by construction; checked: the cut birth equals the plain birth byte for byte.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec, leaves, norm, OPEN } from './tell-common.mjs';
import { makeSurface, namesOf, compare, minus } from './tell-surface.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const N = Number(process.env.RV9_N || 1); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const ONLY = process.env.RV9_ONLY ? new Set(process.env.RV9_ONLY.split(',')) : null;
const SERVER = process.env.RV9_SERVER !== '0';
it('R3-TELL measure', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const { factsOf } = await import(`${SRC}/src/domain/facts/factsOf.js`);
  const { deriveCriminalStructure, blockListsCrime } = await import(`${SRC}/src/domain/display/defenseDisplay.js`);
  const { covertCrimeHeld, runningCriminalChains } = await import(`${SRC}/src/domain/facts/criminalStructureKey.js`);
  const { rederiveForPage } = await import(`${SRC}/src/domain/veil/pageRederive.js`);
  const T = (f) => { try { const v = f(); return typeof v === 'string' ? v : JSON.stringify(v); } catch (e) { return `threw:${String(e?.message).slice(0, 40)}`; } };
  const labelsOf = (d) => {
    const x = rederiveForPage(clone(d)); const fx = factsOf(x);
    return { crime: T(() => fx.crime), crimeWave: T(() => fx.crimeWave), rivalRings: T(() => fx.rivalRings), criminalIncome: T(() => fx.criminalIncome),
      lawBand: T(() => fx.lawBand), structure: T(() => deriveCriminalStructure(x)), blockListsCrime: T(() => blockListsCrime(x)),
      covertCrimeHeld: T(() => covertCrimeHeld(x)), runningChains: T(() => runningCriminalChains(x).length),
      magicalCrime: T(() => (x?.economicState?.safetyProfile?.crimeTypes || []).some((c) => c?.type === 'Magical crime')) };
  };
  const surface = makeSurface(labelsOf);
  let db = null; let nrow = 0;
  if (SERVER) {
    const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
    const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
    const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  }
  const server = async (rec, dm, ov) => {
    nrow += 1; const id = `abcd7e${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `t${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  const count = (s) => Object.values(s).reduce((a, f) => a + f.items.length, 0);
  /** The withheld items still shown on B under a surface sY: per C family, W ∩ (sY − sA) as multisets. */
  const stillShown = (W, sY, sA) => {
    const out = {};
    for (const [f, items] of Object.entries(W)) {
      const extra = minus(sY[f]?.items || [], sA[f]?.items || []);
      const keep = items.filter((x) => { const i = extra.indexOf(x); if (i < 0) return false; extra.splice(i, 1); return true; });
      if (keep.length) out[f] = keep;
    }
    return out;
  };
  /** A compare() result kept small: per family the counts, and the first six items each way. */
  const brief = (c) => Object.fromEntries(Object.entries(c).map(([f, v]) => [f, { kind: v.kind, a: v.aExtra.length, b: v.bExtra.length, aEx: v.aExtra.slice(0, 6), bEx: v.bExtra.slice(0, 6) }]));
  const nItems = (o) => Object.values(o).reduce((a, v) => a + v.length, 0);
  const out = [];
  for (const b of E.pool(N, SHARD)) {
    if (ONLY && !ONLY.has(b.seed)) continue;
    let A; E.state.dial = null; try { A = E.birth(b.cfg, b.seed, null); } catch (e) { out.push({ seed: b.seed, threw: String(e.message).slice(0, 100) }); continue; }
    const hidden = (A.institutions || []).filter((h) => E.isHideableHouse(h));
    const rec = { seed: b.seed, size: b.size, crisis: b.crisis, dial: E.state.dial, hidden: hidden.map((h) => h.name) };
    if (!hidden.length) {
      // THE CONTROL: the counterfactual's own path, cutting nothing, gives A byte for byte (so the target IS the served page)
      const A2 = E.birth(b.cfg, b.seed, (h) => E.isHideableHouse(h));
      rec.control = { cutEqualsPlain: JSON.stringify(A2) === JSON.stringify(A) };
      out.push(rec); continue;
    }
    let B; try { B = E.birth(b.cfg, b.seed, (h) => E.isHideableHouse(h)); } catch (e) { rec.Bthrew = String(e.message).slice(0, 100); out.push(rec); continue; }
    const names = namesOf(E.isHideableHouse, A, B);
    rec.H = [...names.H]; rec.P = [...names.P]; rec.reads = {};
    const houseCards = hidden.map((h) => `card:institution:${V.veil.CARD_KINDS.institution.idOf(h)}`);
    // THE COUNTERFACTUAL'S ARTIFACT (run1): B's simulationTrace logs a house's SELECTION before the probe cuts it, so B's
    // trace names cut houses a truly house-free town never selected. Those trace items are dropped from every B surface.
    const slug = (x) => String(x).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const cutTags = hidden.map((h) => `institution.${slug(h.name)}`);
    const surfB = (d) => { const s = surface(d, names);
      for (const f of ['trace.criminal', 'trace.criminalRows']) if (s[f]) s[f].items = s[f].items.filter((x) => !cutTags.some((c) => x === c || x.includes(`"${c}"`)));
      return s; };
    // THE COUNTERFACTUAL'S FIDELITY AUDIT: every leaf of B's served page (twin, own setting) holding a cut house's name
    { const cutNames = hidden.map((h) => String(h.name)).filter((x) => x.length > 3);
      const hits = {}; for (const dm of [false, true]) for (const [p, v] of leaves(V.twin(B, dm, V.write(V.opened(OPEN))))) { const sv = String(v); for (const c of cutNames) if (sv.includes(c)) { const k = norm(p); hits[k] = (hits[k] || 0) + 1; } }
      rec.bCutNameHits = hits; }
    for (const dm of [false, true]) {
      const sa0 = V.settings(A, dm); const sb0 = V.settings(B, dm);
      const scB = sb0.sc;
      const partsB = V.sw.criminalPartsOf(scB.defaults, [], scB.present, scB.model);
      const keys = Object.keys(sa0.deltas).filter((k) => k !== 'g:111');
      for (const k of keys) {
        const ovA = V.write(sa0.deltas[k]); const XB = sb0.deltas[k];
        const sA = surface(V.twin(A, dm, ovA), names); const sB = surfB(V.twin(B, dm, V.write(XB)));
        // W: what B_X shows and A_X does not, AND A's own page shows under X with its hideable houses shown (A_X^open): a
        // withholding by the veil. The rest of B_X - A_X is DRIFT (the counterfactual's own regeneration; A never had it).
        const sO = surface(V.twin(A, dm, V.write([...sa0.deltas[k], ...houseCards.map((a) => ({ address: a, hidden: false }))])), names);
        const W = {}; const drift = {};
        for (const [f, v] of Object.entries(sB)) if (v.kind === 'C') {
          const m = minus(v.items, sA[f]?.items || []); if (!m.length) continue;
          const open = minus(sO[f]?.items || [], sA[f]?.items || []);
          const w = m.filter((x) => { const i = open.indexOf(x); if (i < 0) return false; open.splice(i, 1); return true; });
          if (w.length) W[f] = w; const dr = minus(m, w); if (dr.length) drift[f] = dr;
        }
        let Nd = XB; let added = []; let nClass = 'own'; let uncovered = {}; let ties = 0;
        if (nItems(W)) {
          const now = V.veil.resolveVeil(scB.defaults, XB);
          const cand = partsB.filter((p) => !V.sw.isPartHidden(now, p));
          const cover = new Map();
          for (const p of cand) {
            const sY = surfB(V.twin(B, dm, V.write([...XB, { address: p, hidden: true }])));
            const rem = stillShown(W, sY, sA); const gone = nItems(W) - nItems(rem);
            if (gone > 0) cover.set(p, rem);
          }
          // the fewest parts whose union covers W (singles' covers, as sets of family:item keys), sizes 1..4
          const key = (o) => new Set(Object.entries(o).flatMap(([f, xs]) => xs.map((x, i) => `${f}\u0000${x}\u0000${i}`)));
          const all = key(W); const rems = [...cover.entries()].map(([p, r]) => [p, key(r)]);
          let best = null;
          const combos = (arr, n, start = 0, acc = []) => (n === 0 ? [acc] : arr.slice(start).flatMap((x, i) => combos(arr, n - 1, start + i + 1, [...acc, x])));
          for (let n = 1; n <= Math.min(4, rems.length) && !best; n += 1) {
            const ok = combos(rems, n).filter((c) => [...all].every((x) => c.some(([, r]) => !r.has(x))));
            if (!ok.length) continue;
            const scored = ok.slice(0, 24).map((c) => { const d = [...XB, ...c.map(([p]) => ({ address: p, hidden: true }))]; const sY = surfB(V.twin(B, dm, V.write(d))); return { c, d, shown: count(sY), rem: stillShown(W, sY, sA) }; })
              .filter((x) => !nItems(x.rem)).sort((x, y) => y.shown - x.shown);
            if (scored.length) { best = scored[0]; ties = scored.filter((x) => x.shown === scored[0].shown).length - 1; }
          }
          if (best) { Nd = best.d; added = best.c.map(([p]) => p); nClass = 'nearer'; }
          else { Nd = sb0.deltas.off; added = ['(switch off)']; nClass = 'off'; }
          if (nClass === 'nearer' && V.sw.criminalSwitchStateOf(scB.defaults, Nd, scB.present, scB.model) === 'hidden') nClass = 'off';
          const sOff = nClass === 'off' ? surfB(V.twin(B, dm, V.write(Nd))) : null;
          if (sOff) uncovered = stillShown(W, sOff, sA);
        }
        const ovN = V.write(Nd);
        const sT = surfB(V.twin(B, dm, ovN));
        const tell = compare(sA, sT);
        const r = { W, drift: Object.fromEntries(Object.entries(drift).map(([f, x]) => [f, { n: x.length, ex: x.slice(0, 4) }])), added, nClass, ties, uncovered, tell: brief(tell), aItems: count(sA), tItems: count(sT) };
        if (SERVER) {
          const svA = surface(await server(A, dm, ovA), names); const svT = surfB(await server(B, dm, ovN));
          r.parA = Object.keys(compare(svA, sA)); r.parT = Object.keys(compare(svT, sT));
          r.srvTell = Object.keys(compare(svA, svT));
          if (r.parA.length) r.parAx = brief(compare(svA, sA));
          if (r.parT.length) r.parTx = brief(compare(svT, sT));
        }
        rec.reads[`${dm ? 'dm' : 'off'}|${k}`] = r;
      }
    }
    out.push(rec);
  }
  if (db) await db.end();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
