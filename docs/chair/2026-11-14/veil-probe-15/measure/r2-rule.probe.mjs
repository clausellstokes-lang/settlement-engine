// VEIL-15, ITEM 2 (R2), THE RULE IS ONE: a processing name withheld or kept, by the server (each database named in R2_DBS,
// a local chain of the same tree's migrations) and by the client's twin, on towns written for it: houses hidden whole and
// houses left open, named from an alphabet of the characters whose case maps disagree (U+0130, U+212A, a capital and a
// small final sigma, the sharp s and its capital, a Deseret pair, Cyrillic, Greek, a dotless i, a combining dot) and
// ASCII, each chain naming one processing name (drawn from the houses' names, recased, cut, or new) beside the Corn
// exchange. For each processing name: does the gallery read keep it (Reveal DM off; the houses hidden whole by their card
// eyes), does the twin (galleryPayloadFor, then projectShareVeil), and what the ENGINE's own match says
// (computeActiveChains.js :: institutionMatchesProcessor on an unstamped house, or the same name): a name only houses
// hidden whole answer to must not be sent. LOCAL scratch cluster only; writes its own rows (slug prefix r2r) and deletes
// them; writes one JSON file (R2_OUT).
//   RV6_SRC=<tree> V15_PROBE=<this file> R2_DBS=<db,db> R2_OUT=<file> RV6_PGMOD=<dir with pg@8.13.1> PGHOST=<socket dir>
//   npx vitest run --config <veil-probe-15/measure/probe.config.mjs>
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const ALPHA = ['a', 'b', 'i', 'k', 'r', 'o', 'n', ' ', 'I', 'K', 'R', 'O', 'N', 'İ', 'K', 'ı', '̇', 'ß', 'ẞ', 'Σ', 'σ', 'ς', 'Α', 'α',
  'Ж', 'ж', 'Ä', 'ä', '𐐀', '𐐨', '-', "'"];
let seed = Number(process.env.R2_SEED || 20261115);
const rnd = (m) => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) % m; };
const word = (len, bias) => { let t = ''; for (let i = 0; i < len; i += 1) t += rnd(100) < bias ? ALPHA[rnd(13)] : ALPHA[rnd(ALPHA.length)]; return t.trim() || 'ab'; };
const recase = (t) => Array.from(t).map((c) => (rnd(2) ? c.toUpperCase() : c.toLowerCase())).join('');

it('R2: the processing names of written towns, server against twin against the engine', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { institutionMatchesProcessor } = await import(`${SRC}/src/generators/computeActiveChains.js`);
  const T = Number(process.env.R2_TOWNS || 60);
  const towns = [];
  for (let t = 0; t < T; t += 1) {
    const bias = [95, 80, 55][t % 3];
    const hidden = Array.from({ length: 1 + rnd(3) }, (_, i) => ({ id: `inst-h${t}-${i}`, name: `${word(3 + rnd(10), bias)}${rnd(2) ? ` ${word(2 + rnd(6), bias)}` : ''}`, category: 'Criminal', desc: 'Hidden.' }));
    const open = Array.from({ length: rnd(4) }, (_, i) => ({ id: `inst-o${t}-${i}`, name: `${word(3 + rnd(10), bias)}${rnd(2) ? ` ${word(2 + rnd(6), bias)}` : ''}`, category: 'Industry', desc: 'Open.' }));
    // the open houses may also share a hidden house's words, recased
    for (const o of open) if (rnd(2)) o.name = `${recase(hidden[rnd(hidden.length)].name)}${rnd(2) ? ` ${word(2 + rnd(5), bias)}` : ''}`;
    const all = [...hidden, ...open];
    const procs = new Set();
    for (let j = 0; j < 14; j += 1) {
      const h = all[rnd(all.length)].name; const cps = Array.from(h); const k = rnd(3);
      const x = k === 0 ? cps.slice(0, 3 + rnd(Math.max(cps.length - 2, 1))).join('') : k === 1 ? recase(cps.slice(0, 2 + rnd(Math.max(cps.length - 1, 1))).join('')) : word(3 + rnd(12), bias);
      if (x.trim() !== '' && x !== 'Corn exchange') procs.add(x);
    }
    const town = { name: `Fuzzwick ${t}`, tier: 'town',
      institutions: [...all, { id: `inst-c${t}`, name: 'Corn exchange', category: 'Economy', desc: 'Grain.' }],
      npcs: [{ id: `npc.f${t}`, name: 'Una Farrow', role: 'Factor' }],
      economicState: { activeChains: [...procs].map((x, j) => ({ label: `Chain ${t}-${j}`, processingInstitutions: [x, 'Corn exchange'] })) } };
    towns.push({ town, hidden, open, procs: [...procs] });
  }
  const cardAddress = (card) => `card:institution:${veil.CARD_KINDS.institution.idOf(card)}`;
  /** the engine's own answer: does this house give the chain this processing name (unstamped: its fuzzy match on the name) */
  const engine = (h, x) => h.name === x || institutionMatchesProcessor({ name: h.name }, x);
  const kept = (doc, j, x) => { const c = (doc?.economicState?.activeChains || []).find((y) => isRec(y) && y.label === `Chain ${j}`); return c ? (Array.isArray(c.processingInstitutions) && c.processingInstitutions.includes(x)) : null; };
  const result = { towns: T, names: 0, dbs: {} };
  const twinRows = [];
  for (const [t, w] of towns.entries()) {
    const ov = { [veil.VEIL_OVERRIDE_KEY]: { v: 1, mode: 'live', deltas: [...new Set(w.hidden.map(cardAddress))].map((address) => ({ address, hidden: true })) } };
    w.ov = ov;
    const client = veil.projectShareVeil(veil.galleryPayloadFor(JSON.parse(JSON.stringify(w.town)), { shareDm: false, memberOverrides: ov }), ov);
    w.procs.forEach((x, j) => {
      const truthHidden = w.hidden.some((h) => engine(h, x)) && ![...w.open, { name: 'Corn exchange' }].some((o) => engine(o, x));
      twinRows.push({ t, j, x, truthHidden, ascii: !/[^\x00-\x7f]/.test(x.toLowerCase().slice(0, 12)), twin: kept(client, `${t}-${j}`, x) });
    });
  }
  result.names = twinRows.length;
  for (const dbName of String(process.env.R2_DBS).split(',')) {
    const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbName }); await db.connect();
    const ctype = (await db.query('select datctype as c from pg_database where datname = current_database()')).rows[0].c;
    await db.query("delete from public.settlements where public_slug like 'r2r%'");
    const server = new Map();
    for (const [t, w] of towns.entries()) {
      const slug = `r2r${t}`;
      await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
        values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', $1, 'town', $2, true, $3, now(), $4, 'unlisted', $5, false, true)`,
      [w.town.name, JSON.stringify(w.town), slug, `${slug}l`, JSON.stringify(w.ov)]);
      await db.query("select set_config('test.uid', '', false)"); await db.query('set role anon');
      let doc;
      try { doc = (await db.query('select (select to_jsonb(g.data) from public.get_gallery_dossier($1) g) as d', [slug])).rows[0]?.d ?? null; } finally { await db.query('reset role'); }
      w.procs.forEach((x, j) => server.set(`${t}|${j}`, kept(doc, `${t}-${j}`, x)));
    }
    await db.query("delete from public.settlements where public_slug like 'r2r%'");
    await db.end();
    const rows = twinRows.map((r) => ({ ...r, server: server.get(`${r.t}|${r.j}`) }));
    const count = (f) => rows.filter(f).length;
    result.dbs[dbName] = {
      ctype,
      chainGone: count((r) => r.server === null || r.twin === null),
      differ: count((r) => r.server !== r.twin),
      serverSends: count((r) => r.truthHidden && r.server === true),
      twinSends: count((r) => r.truthHidden && r.twin === true),
      truthHidden: count((r) => r.truthHidden),
      withheldBeyondEngine: { server: count((r) => !r.truthHidden && r.server === false), twin: count((r) => !r.truthHidden && r.twin === false) },
      asciiNeedles: count((r) => r.ascii), engineKeeps: count((r) => !r.truthHidden), engineKeepsAscii: count((r) => !r.truthHidden && r.ascii),
      withheldBeyondEngineAscii: { server: count((r) => !r.truthHidden && r.ascii && r.server === false), twin: count((r) => !r.truthHidden && r.ascii && r.twin === false) },
      examples: rows.filter((r) => r.server !== r.twin || (r.truthHidden && (r.server || r.twin))).slice(0, 8)
        .map((r) => ({ x: r.x, server: r.server, twin: r.twin, truthHidden: r.truthHidden, hidden: towns[r.t].hidden.map((h) => h.name), open: towns[r.t].open.map((o) => o.name) })),
    };
  }
  writeFileSync(process.env.R2_OUT, JSON.stringify(result, null, 1));
  const lines = [`r2-rule: ${T} towns, ${result.names} processing names (the engine's answer withholds ${result.dbs[Object.keys(result.dbs)[0]].truthHidden})`];
  for (const [d, v] of Object.entries(result.dbs)) lines.push(`  ${d} (ctype ${v.ctype}): server and twin differ on ${v.differ}; sent where the engine's answer withholds: server ${v.serverSends}, twin ${v.twinSends}; withheld where the engine's match alone keeps: server ${v.withheldBeyondEngine.server}, twin ${v.withheldBeyondEngine.twin}; chain gone ${v.chainGone}`);
  console.log(lines.join('\n'));
}, 14_400_000);
