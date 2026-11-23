// V41-TP (TENSION-PARTIES, the chair's N72 (2)): A MEASURE of history.currentTensions[].factions[] on every stored document.
// Reads every stored document (RV9_STORED_DIR) at every setting of tell-common.mjs :: loadVeil().settings plus the unmarked {},
// Reveal DM off and on, through the twin (galleryPayloadFor -> projectShareVeil) and the server (RV9_SERVER_TPL; doors
// get_gallery_dossier, get_unlisted_dossier anonymous, import_gallery_dossier as a non-owner reader), ppkey.probe.jsx's doors.
// For each stored tension party: its class on the record (house / power / generic), and on each read what is served at that
// place (kept, party gone, tension gone, a word the record does not hold), with which party the read hides. Also C1's lookup
// (prose.probe.jsx: a telling stored string served nowhere as a leaf yet whole in served prose) restricted to the tension parties.
// Writes RV9_OUT_DIR/tp-shard<s>.json. Measures only: no line of 212, the twin or the registry is touched.
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { loadVeil, clone, isRec } from '/home/user/settlement-engine/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const READER = '22222222-2222-2222-2222-222222222222';
const W = 40;
const telling = (s) => s.length >= W || (s.length >= 6 && /^[A-Z]/.test(s) && /\s/.test(s));
const splitDoc = (doc) => {
  const strs = []; const prose = {};
  const go = (x, g, site) => {
    if (typeof x === 'string') { if (site) (prose[site] ||= []).push(x); else strs.push([g, x]); return; }
    if (Array.isArray(x)) { for (const y of x) go(y, `${g}[]`, site); return; }
    if (isRec(x)) for (const [k, y] of Object.entries(x)) {
      const q = g ? `${g}.${k}` : k;
      if (!site && q === 'publicProse') { const b = isRec(y?.blocks) ? y.blocks : {}; for (const [s, v] of Object.entries(b)) go(v, `publicProse.blocks.${s}`, s); continue; }
      go(y, q, site);
    }
  };
  go(doc, '', null); return { strs, prose };
};

it('tp: tension parties on every read', async () => {
  const V = await loadVeil(SRC);
  const { isHideableHouse, isVeiledPower } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { caseFold, buildNameSearch } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const DIR = process.env.RV9_STORED_DIR; const OUTD = process.env.RV9_OUT_DIR; mkdirSync(OUTD, { recursive: true });
  const LIMIT = Number(process.env.RV9_LIMIT || 0); const SERVER = process.env.RV9_SERVER !== '0';
  const ONLY = process.env.RV9_SEEDS ? new Set(readFileSync(process.env.RV9_SEEDS, 'utf8').split('\n').filter(Boolean)) : null;
  const index = readdirSync(DIR).filter((f) => /^index-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')).index)
    .sort((x, y) => (x.role + x.seed < y.role + y.seed ? -1 : 1));
  let db = null;
  if (SERVER) {
    const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
    const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
    const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
    db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  }
  const objs = (l) => (Array.isArray(l) ? l.filter(isRec) : []);
  const powersOf = (d) => [...objs(d?.powerStructure?.factions), ...objs(d?.factions)];
  const pnames = (f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v !== '');
  const tensOf = (d) => objs(d?.history?.currentTensions);
  const signalOf = (d) => objs(d?.institutions).some((h) => String(h.category ?? '').toLowerCase() === 'criminal' || String(h.priorityCategory ?? '').toLowerCase() === 'criminal')
    || objs(d?.powerStructure?.factions).some((f) => String(f.category ?? '').toLowerCase() === 'criminal');
  const T = {}; const bump = (k, n = 1) => { T[k] = (T[k] || 0) + n; };
  const EX = {}; const note = (k, s) => { EX[k] ||= []; if (EX[k].length < 6) EX[k].push(s); };
  const docsOut = []; let i = 0; let nrow = 0;
  for (const m of index) {
    i += 1; if (i % SHARD[1] !== SHARD[0]) continue; if (LIMIT && i > LIMIT * SHARD[1]) break;
    const SRV = SERVER && (!ONLY || ONLY.has(m.seed));
    if (process.env.RV9_SKIP === '1' && ONLY && !ONLY.has(m.seed)) continue;
    const doc = JSON.parse(readFileSync(`${DIR}/${m.seed}.json`, 'utf8'));
    const houses = objs(doc.institutions); const hideable = houses.filter((h) => isHideableHouse(h));
    const hideNames = hideable.map((h) => String(h.name ?? '')).filter((v) => v !== '');
    const hSearch = hideNames.length ? buildNameSearch(hideNames, houses.filter((h) => !isHideableHouse(h)).map((h) => String(h.name ?? ''))) : null;
    const P = powersOf(doc);
    // the class of a party on the record
    const classOf = (v) => {
      const f = caseFold(v);
      const hs = houses.filter((h) => caseFold(String(h.name ?? '')) === f);
      const ps = P.filter((p) => pnames(p).some((n) => caseFold(n) === f));
      const c = [];
      if (hs.length) c.push(hs.some((h) => isHideableHouse(h)) ? 'house:hideable' : 'house:open');
      if (ps.length) {
        const p = ps[0]; const crim = String(p.category ?? '').toLowerCase() === 'criminal';
        c.push(`power:${p.isGoverning === true ? 'governing' : crim ? 'criminal' : p.hidden === true ? 'hidden' : isVeiledPower(p) ? 'veiled' : 'open'}`);
      }
      if (!hs.length && hSearch && hSearch.hit(v)) c.push('holds:hideable-house-name');
      if (!c.length) c.push('generic');
      return c.join('+');
    };
    const tens = tensOf(doc);
    const cls = tens.map((t) => (Array.isArray(t.factions) ? t.factions : []).map((v) => (typeof v === 'string' ? classOf(v) : `nonstring:${typeof v}`)));
    for (const [j, t] of tens.entries()) for (const [k, v] of (t.factions || []).entries()) { bump(`Q1 value class ${cls[j][k]}`); if (cls[j][k] !== 'generic') note(`Q1 ${cls[j][k]}`, `${m.seed} [${t.type}] ${v}`); }
    // C1's lookup, on the twin reads C1 made (no g:111, no unmarked), restricted to tension parties
    const c1 = new Set();
    const rec = { seed: m.seed, role: m.role, server: SRV, hideable: hideNames, powers: P.map((p) => `${pnames(p)[0]}|${p.category}|${p.isGoverning === true ? 'gov' : ''}|${p.hidden === true ? 'hidden' : ''}`),
      tensions: tens.map((t) => ({ type: t.type, factions: t.factions })), cls, served: {}, hiddenEver: [], withheldEver: [], c1: [] };
    const hiddenEver = new Set(); const withheldEver = new Set();
    let id = null; let sl = null;
    if (SRV) {
      nrow += 1; id = `abcd4141-00${String(SHARD[0]).padStart(2, '0')}-0000-0000-${String(nrow).padStart(12, '0')}`; sl = `tp${SHARD[0]}x${nrow}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted','{}'::jsonb,false,true)`, [id, doc.name || 'x', JSON.stringify(doc), sl, `${sl}l`]);
    }
    const judge = (engine, tag, setting, d) => {
      if (!isRec(d)) { bump(`Q2 ${engine} NO DOCUMENT`); note(`${engine} NO DOCUMENT`, tag); return; }
      const sHouses = new Set(objs(d.institutions).map((h) => String(h.name ?? '')));
      const hiddenH = hideNames.filter((n) => !sHouses.has(n));
      const sP = new Set(powersOf(d).flatMap(pnames));
      const withheldP = [...new Set(P.flatMap(pnames))].filter((n) => !sP.has(n));
      for (const n of hiddenH) hiddenEver.add(n); for (const n of withheldP) withheldEver.add(n);
      const hidSearch = hiddenH.length ? buildNameSearch(hiddenH, [...sHouses]) : null;
      const wpF = new Set(withheldP.map(caseFold));
      const sig = signalOf(d);
      const S = tensOf(d); let p = 0; const forms = [];
      for (const [j, t] of tens.entries()) {
        const f0 = Array.isArray(t.factions) ? t.factions : [];
        const s = S[p];
        // matched by kind and description (the description is never masked or swept here: checked below), whatever its parties hold
        const match = !!s && s.type === t.type && (s.description === undefined || s.description === t.description || String(s.description).includes('an unseen interest'));
        const sf = match ? (Array.isArray(s.factions) ? s.factions : []) : null; if (match) p += 1;
        const extra = match ? sf.filter((x) => !f0.includes(x)) : [];
        if (extra.length) { bump(`Q2 ${engine} MASK WORD (served party the record does not hold)`); note(`${engine} mask`, `${m.seed} ${tag} ${JSON.stringify(f0)} -> ${JSON.stringify(extra)}`); }
        const namesW = f0.some((v) => typeof v === 'string' && wpF.has(caseFold(v)));
        let why = 'served';
        if (!match) why = t.type === 'crime_wave' && !sig ? 'tension gone: crime signal false' : namesW ? 'tension gone: names a withheld power' : 'tension gone: OTHER';
        else if (sf.length < f0.length) why = 'party gone';
        else if (extra.length) why = 'party masked';
        if (why !== 'served') forms.push({ j, why, served: sf });
        for (const [k, v] of f0.entries()) {
          if (typeof v !== 'string') continue;
          const hidH = !!hidSearch && hidSearch.hit(v); const hidP = wpF.has(caseFold(v));
          const party = hidH && hidP ? 'names hidden house+withheld power' : hidH ? 'names a hidden house' : hidP ? 'names a withheld power' : 'names nothing hidden';
          const out = !match ? why : sf.includes(v) ? 'stored name served' : (sf[k] !== undefined && !f0.includes(sf[k])) ? `masked as "${sf[k]}"` : 'party gone';
          bump(`Q2 ${engine} | ${party} | ${out}`);
          bump(`Q2s ${engine} | ${setting} | ${party} | ${out}`);
          if (party !== 'names nothing hidden' || out !== 'stored name served') note(`${engine} | ${party} | ${out}`, `${tag} [${t.type}] ${v} -> ${sf ? JSON.stringify(sf) : 'GONE'}`);
        }
      }
      if (p < S.length) { bump(`Q2 ${engine} UNMATCHED SERVED TENSION`); note(`${engine} unmatched`, `${tag} ${JSON.stringify(S.slice(p).map((x) => [x.type, x.factions]))}`); }
      if (forms.length) rec.served[`${engine}|${tag}`] = forms;
    };
    for (const dm of [false, true]) {
      const sets = { ...Object.fromEntries(Object.entries(V.settings(doc, dm).deltas).map(([k, d]) => [k, V.write(d)])), unmarked: {} };
      for (const [k, ov] of Object.entries(sets)) {
        const tag = `${dm ? 'dm' : 'off'}|${k}`;
        const tw = V.twin(doc, dm, clone(ov));
        judge('twin', tag, k, tw);
        if (k !== 'g:111' && k !== 'unmarked') {
          const { strs: served, prose } = splitDoc(tw); const servedSet = new Set(served.map(([, s]) => s));
          const text = Object.values(prose).map((l) => l.join('\n'));
          for (const t of tens) for (const v of t.factions || []) {
            if (typeof v !== 'string' || !telling(v) || servedSet.has(v)) continue;
            const site = Object.entries(prose).find(([, l]) => l.join('\n').includes(v));
            if (site) c1.add(`${v} -> ${site[0]}`);
          }
          void text;
        }
        if (!SRV) continue;
        await db.query('update public.settlements set gallery_member_overrides = $2, gallery_share_dm = $3 where id = $1', [id, JSON.stringify(ov), dm]);
        const page = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
        const link = (await db.query('select public.get_unlisted_dossier($1) d', [`${sl}l`])).rows[0]?.d;
        await db.query(`select set_config('test.uid', $1, false)`, [READER]);
        let imp = null; try { imp = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [sl])).rows[0]?.d; } catch (e) { imp = null; note('import error', `${m.seed} ${tag} ${String(e.message || e).slice(0, 80)}`); }
        await db.query(`select set_config('test.uid', '', false)`);
        judge('server page', tag, k, page); judge('server link', tag, k, isRec(link) ? link.dossier : link); judge('server import', tag, k, imp);
        // canonical (keys sorted: jsonb reorders keys), the whole list; and the parties alone, in order
        const canon = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((q) => [q, x[q]])) : x));
        const parties = (d) => JSON.stringify(tensOf(d).map((t) => [t.type, t.factions]));
        const tj = canon(tensOf(tw)); const tp = parties(tw);
        for (const [door, d] of [['page', page], ['link', isRec(link) ? link.dossier : link], ['import', imp]]) {
          const same = canon(tensOf(d)) === tj; bump(`Q2 server ${door} history.currentTensions (canonical) ${same ? 'EQUAL' : 'DIFFERS'} to the twin's`);
          const sameP = parties(d) === tp; bump(`Q2 server ${door} tension parties (type+factions[], in order) ${sameP ? 'EQUAL' : 'DIFFER'} to the twin's`);
          if (!same) note(`server ${door} tensions differ`, `${m.seed} ${tag} twin ${tj.slice(0, 200)} server ${canon(tensOf(d)).slice(0, 200)}`);
        }
      }
    }
    if (SRV) await db.query('delete from public.settlements where id = $1', [id]);
    rec.hiddenEver = [...hiddenEver]; rec.withheldEver = [...withheldEver]; rec.c1 = [...c1];
    if (c1.size) bump('Q0 C1 lookup documents');
    docsOut.push(rec);
  }
  writeFileSync(`${OUTD}/tp-shard${SHARD[0]}.json`, JSON.stringify({ src: SRC, server: SERVER, docs: docsOut.length, tally: T, examples: EX, records: docsOut }));
}, 14400000);
