// R4I-PAGE-3 ST (VEIL-38; R4I-PAGE-2 brief item ST; E134 (3), PART 36 ruling 36.6): THE STORED ARM'S PERSON-ID PART.
// Every stored document of RV9_STORED_DIR (dump.sh's output: <seed>.json + index-shard*.json, the document as `saves.js`
// stores it) is read through RV6_SRC's twin (projectShareVeil over galleryPayloadFor) AND its server (the scratch PG16,
// RV9_SERVER_TPL: 211 + the tree's 212; get_gallery_dossier and get_unlisted_dossier), Reveal DM off and on, unmarked ({})
// and marked (writeShareVeil({}, []), the export's default marker), each read TWICE. Per read it reports:
//   (1) every served id, key or slug spelling a withheld power or hidden house by the lane's fold (galleryVeilIds' formsOf
//       over its id sites), BY SURFACE (0 expected);
//   (2) the stored person ids served UN-RE-KEYED anywhere (personIdBijection :: storedIdsServed: substring, key, the
//       marker), and of them the count IN STORED-ONLY FIELDS (`publicProse`, and every top-level key of the stored document
//       that the tree's own birth of the same seed lacks: RV9_BIRTH=1), said even if 0;
//   (3) two reads of one surface share no person id (readsDiffer); every reference inside one read resolves to a card of
//       that read, counted against the stored document's own dangling references (a dangling stored reference stays one);
//   (4) the re-key on the document: ids and references re-keyed, counted; with its CONTROLS: a planted bad reference (the
//       stored document's first resolving reference pointed at no card) must show one more unresolved reference on the twin,
//       and a stored id planted on a served card must be caught by (2).
// Shard s of n (RV9_SHARD). Out: RV9_OUT_DIR/ids-shard<s>.json; one line a document.
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync, mkdirSync } from 'node:fs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
const clone = (v) => JSON.parse(JSON.stringify(v));
const ID_RE = /npc[._]|tie_npc/i;
const formsOf = (n) => { const w = String(n).replace(/\s*[([].*?[)\]]\s*/g, ' ').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); return w.length ? [w.join('_'), w.join('')] : []; };
const nameOf = (f) => (isRec(f) ? f.faction || f.name : null);

/** galleryVeilIds' walkSites: [holder, key, phase] for every card id, reference and tie id. */
const walkSites = (doc) => {
  const out = [];
  if (!isRec(doc)) return out;
  const at = (obj, keys, phase) => { let cur = obj; for (const k of keys.slice(0, -1)) { if (!isRec(cur)) return; cur = cur[k]; } const l = keys[keys.length - 1]; if (isRec(cur) && (typeof cur[l] === 'string' || typeof cur[l] === 'number')) out.push([cur, l, phase]); };
  recs(doc.npcs).forEach((n) => at(n, ['id'], 'card'));
  recs(doc.powerStructure?.factions).forEach((f) => recs(f.members).forEach((m) => at(m, ['id'], 'card')));
  recs(doc.factions).forEach((f) => recs(f.members).forEach((m) => at(m, ['id'], 'card')));
  recs(doc.npcs).forEach((n) => { for (const k of [['goal', 'intent', 'short', 'target', 'id'], ['goal', 'intent', 'long', 'target', 'id'], ['allegiance', 'handler']]) at(n, k, 'ref'); });
  recs(doc.relationships).forEach((t) => { for (const k of ['from', 'to', 'npc1Id', 'npc2Id']) at(t, [k], 'ref'); });
  recs(doc.npcs).forEach((n) => recs(n.relationships).forEach((t) => { for (const k of ['from', 'to', 'npc1Id', 'npc2Id', 'targetId', 'npcId']) at(t, [k], 'ref'); }));
  for (const key of ['stress', 'stressors']) (Array.isArray(doc[key]) ? doc[key] : [doc[key]]).forEach((c) => { if (!isRec(c) || !isRec(c.cast)) return; recs(c.cast.roles).forEach((r) => at(r, ['id'], 'ref')); recs(c.cast.levers).forEach((l) => at(l, ['holderId'], 'ref')); });
  recs(doc.simulationTrace).forEach((e) => { at(e, ['targetId'], 'ref'); recs(e.downstreamEffects).forEach((x) => at(x, ['target'], 'ref')); });
  recs(doc.relationships).forEach((t) => at(t, ['id'], 'tie'));
  recs(doc.npcs).forEach((n) => recs(n.relationships).forEach((t) => at(t, ['id'], 'tie')));
  return out;
};
const cardIdsOf = (d) => new Set(walkSites(d).filter((x) => x[2] === 'card').map(([h, k]) => String(h[k])).filter((v) => v !== ''));
const unresolvedOf = (d) => { const ids = cardIdsOf(d); return walkSites(d).filter((x) => x[2] === 'ref' && !ids.has(String(x[0][x[1]]))).length; };
/** galleryVeilIds' idSites: every id-shaped value or key of a served document and its marker. */
const idSites = (doc, marker, stored) => {
  const storedIds = new Set(recs(stored.npcs).map((x) => x.id).filter((x) => x != null).map(String));
  const out = [];
  const walk = (v, p) => {
    if (typeof v === 'string') { if (ID_RE.test(v) || storedIds.has(v) || /(^|\.)(id|slug|[a-z]+Id)$/.test(p)) out.push([p, v]); return; }
    if (typeof v === 'number') { if (storedIds.has(String(v))) out.push([p, String(v)]); return; }
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${p}[${i}]`)); return; }
    if (isRec(v)) for (const k of Object.keys(v)) { if (ID_RE.test(k) || storedIds.has(k)) out.push([`${p}{key}`, k]); walk(v[k], p ? `${p}.${k}` : k); }
  };
  walk(doc, '');
  if (isRec(marker)) for (const k of Object.keys(marker)) if (k !== '$veil') out.push(['$marker{key}', k]);
  return out;
};

it('R4I-PAGE-3 stored person ids', async () => {
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const B = await import(`${SRC}/tests/security/personIdBijection.shared.mjs`);
  const DIR = process.env.RV9_STORED_DIR; const OUTD = process.env.RV9_OUT_DIR; mkdirSync(OUTD, { recursive: true });
  const index = readdirSync(DIR).filter((f) => /^index-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')).index)
    .sort((x, y) => (x.role + x.seed < y.role + y.seed ? -1 : 1));
  const LIMIT = Number(process.env.RV9_LIMIT || 0);
  // the birth's own keys (RV9_BIRTH=1): the tree's pipeline output for the same seed, so a stored-only key is one it lacks
  let birthKeys = null;
  if (process.env.RV9_BIRTH === '1') {
    const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
    const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
    const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
    await loadGenerationLawPayloads();
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    birthKeys = (j) => new Set(Object.keys(clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: j.size, ...(j.crisis !== 'none' ? { selectedStresses: [j.crisis], selectedStressesRandom: false } : {}) }), null, { seed: j.seed, customContent: {} }))));
  }
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  let nrow = 0;
  const server = async (rec, dm, ov) => {
    nrow += 1; const id = `abcd7f${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `s${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}-link`, JSON.stringify(ov), dm]);
    const g = async () => (await db.query('select to_jsonb(g.data) d, g.gallery_member_overrides o from public.get_gallery_dossier($1) g', [sl])).rows[0];
    const l = async () => (await db.query('select public.get_unlisted_dossier($1) x', [`${sl}-link`])).rows[0]?.x;
    const [g1, g2, l1, l2] = [await g(), await g(), await l(), await l()];
    await db.query('delete from public.settlements where id = $1', [id]);
    return { gallery: [[g1?.d, g1?.o], [g2?.d, g2?.o]], link: [[l1?.dossier, l1?.gallery_member_overrides ?? null], [l2?.dossier, l2?.gallery_member_overrides ?? null]] };
  };
  const twin = (doc, dm, ov) => { const t = veil.projectShareVeil(veil.galleryPayloadFor(clone(doc), { shareDm: dm, memberOverrides: ov }), ov); return [t, null]; };
  const lines = [];
  let n = 0;
  for (const [i, j] of index.entries()) {
    if (i % SHARD[1] !== SHARD[0]) continue;
    if (LIMIT && n >= LIMIT) break;
    n += 1;
    const stored = JSON.parse(readFileSync(`${DIR}/${j.seed}.json`, 'utf8'));
    const bk = birthKeys ? birthKeys(j) : null;
    const storedOnly = new Set(['publicProse', ...(bk ? Object.keys(stored).filter((k) => !bk.has(k)) : [])]);
    const row = { seed: j.seed, role: j.role, storedOnlyKeys: [...storedOnly].filter((k) => k in stored), storedUnresolved: unresolvedOf(stored), cards: cardIdsOf(stored).size,
      reads: 0, f1: {}, f2: 0, f2StoredOnly: 0, f3Shared: 0, f3Unresolved: 0, f3UnresolvedOverStored: 0, f4: { ids: 0, refs: 0, ties: 0 }, controls: {}, faults: [] };
    const W = (d) => { const sp = new Set([...recs(d?.powerStructure?.factions), ...recs(d?.factions)].map(nameOf).filter(Boolean)); const sh = new Set(recs(d?.institutions).map((h) => h.name).filter(Boolean));
      return [...new Set([...[...recs(stored.powerStructure?.factions), ...recs(stored.factions)].map(nameOf).filter((x) => x && !sp.has(x)), ...recs(stored.institutions).map((h) => h.name).filter((x) => x && !sh.has(x))])]; };
    for (const dm of [false, true]) for (const [shape, ov] of [['unmarked', {}], ['marked', veil.writeShareVeil({}, [])]]) {
      const srv = await server(stored, dm, ov);
      const surfaces = { twin: [twin(stored, dm, ov), twin(stored, dm, ov)], gallery: srv.gallery, link: srv.link };
      for (const [surface, pair] of Object.entries(surfaces)) {
        pair.forEach(([doc, marker], k) => {
          if (!isRec(doc)) { if (k === 0) row.faults.push(`${surface} ${shape} dm=${dm}: no read`); return; }
          row.reads += 1;
          const tag = `${surface} ${shape} dm=${dm}${k ? ' again' : ''}`;
          // (1)
          const forms = W(doc).flatMap(formsOf);
          for (const [p, v] of idSites(doc, marker, stored)) { const low = v.toLowerCase(); if (forms.some((f) => low.replace(/[^a-z0-9]+/g, '_').includes(f) || low.replace(/[^a-z0-9]+/g, '').includes(f))) { row.f1[surface] = (row.f1[surface] || 0) + 1; if (row.faults.length < 20) row.faults.push(`(1) ${tag}: ${p} = ${v}`); } }
          // (2)
          const leaks = B.storedIdsServed([doc, marker], stored);
          row.f2 += leaks.length;
          const only = leaks.filter((x) => [...storedOnly].some((key) => x.startsWith(`[0].${key}`) || x.startsWith(`[0].${key}{`) || x.startsWith(`[0]{key} = ${key}`)));
          row.f2StoredOnly += only.length;
          if (leaks.length && row.faults.length < 20) row.faults.push(`(2) ${tag}: ${leaks.slice(0, 2).join('; ')}`);
          // (3) within one read
          const u = unresolvedOf(doc); row.f3Unresolved += u;
          if (u > row.storedUnresolved) { row.f3UnresolvedOverStored += u - row.storedUnresolved; if (row.faults.length < 20) row.faults.push(`(3) ${tag}: ${u} unresolved against the stored ${row.storedUnresolved}`); }
          // (4) the re-key's reach on this read
          if (k === 0 && surface === 'twin') for (const [h, key, phase] of walkSites(doc)) row.f4[phase === 'card' ? 'ids' : phase === 'ref' ? 'refs' : 'ties'] += String(h[key]).startsWith(phase === 'tie' ? 'tie_' : 'npc_') ? 1 : 0;
        });
        // (3) two reads of one surface
        if (isRec(pair[0][0]) && isRec(pair[1][0])) { const shared = B.readsDiffer(pair[0][0], pair[1][0]); if (shared.length && shared[0] !== '(the first read serves no person id)') { row.f3Shared += shared.length; if (row.faults.length < 20) row.faults.push(`(3) ${surface} ${shape} dm=${dm}: two reads share ${shared.length}`); } }
      }
    }
    // (4) THE CONTROLS, on the twin at Reveal DM on, unmarked: a planted bad reference (each of the first five references that
    // resolve, pointed at no card, one at a time: caught where the twin then serves one more unresolved reference; a reference
    // the veil withholds cannot show); a stored id served
    const [a] = twin(stored, true, {}); const base = unresolvedOf(a);
    const ids0 = cardIdsOf(stored);
    const at = walkSites(stored).map((x, idx) => [x, idx]).filter(([x]) => x[2] === 'ref' && ids0.has(String(x[0][x[1]]))).slice(0, 5).map(([, idx]) => idx);
    let caught = 0;
    for (const idx of at) { const planted = clone(stored); const site = walkSites(planted)[idx]; site[0][site[1]] = B.FOREIGN_KEY; const [b] = twin(planted, true, {}); if (unresolvedOf(b) > base) caught += 1; }
    row.controls.badRef = !at.length ? 'no reference to plant' : caught ? 'caught' : 'not caught';
    row.controls.badRefPlants = [at.length, caught];
    const [c0] = twin(stored, false, {}); const storedId = recs(stored.npcs).map((x) => x.id).find((v) => v != null);
    if (storedId != null && recs(c0.npcs).length) { const c = clone(c0); c.npcs[0].id = storedId; row.controls.storedId = B.storedIdsServed([c, null], stored).length ? 'caught' : 'MISSED'; } else row.controls.storedId = 'no card';
    lines.push(row);
  }
  await db.end();
  writeFileSync(`${OUTD}/ids-shard${SHARD[0]}.json`, JSON.stringify({ src: SRC, stored: DIR, ended: new Date().toISOString(), rows: lines }));
}, 14_400_000);
