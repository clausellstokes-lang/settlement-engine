// R4-IDS PART ONE, M — THE MEASURE (V34-R4I, VEIL-34's builder; brief docs/chair/2026-11-20/veil/briefs/R4-IDS-BRIEF.md). An
// instrument beside the tell8b arm (out/v32/tell8b/measure/arm.probe.jsx, its model), over THE ARM'S PAGE SET: the R3 gate's 140
// births (tell-common.mjs :: pool, N=2, byte for byte as the arm births them), BOTH ENGINES (the SERVER, get_gallery_dossier and
// get_unlisted_dossier on RV9_SERVER_TPL = v27x211 + this tree's 212; the TWIN, projectShareVeil over galleryPayloadFor), BOTH
// STORED SHAPES (the new; master's: the powers ALSO in the top-level factions[], galleryRosterChoices.pglite.test.js's `openM`),
// every setting the arm reads (own, g:000..g:110, allOpen, off, allShown, unmarked), Reveal off and DM, THE GALLERY READ AND THE
// PARTY LINK. Per page and engine, BY SURFACE: every served person ID, KEY and SLUG (an id site: any string value or object key
// spelled `npc.`/`npc_`/`tie_npc`, or equal to a STORED person card id, or a number equal to a stored numeric card id) and the
// served marker's keys; of those, the ones that SPELL a power the read withholds or a house it hides whole, by THE LANE'S FOLD
// (gallerySecondHomes.js :: buildNameSearch over the withheld names, the served names open; and the name's words joined by '_'
// or by nothing, case-blind, the bare form). The re-key's baseline: the served card ids stable across two gallery reads of one row.
// LOCAL cluster only (PGHOST). Out: compact JSON (RV9_OUT). It reads; it changes nothing in the tree.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec, OPEN } from '../../../v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const STABLE_SETS = new Set(['own', 'off', 'allShown', 'unmarked', 'g:000']);

/** The named surface of a normalised path (indices dropped; a key position `{key}`). */
const surfaceOf = (p) => {
  const rules = [[/^npcs\[\]\.id$/, 'npcs[].id'], [/^npcs\[\]\.relationships\[\]/, 'npcs[].relationships[] (a card\'s own ties)'],
    [/^relationships\[\]\.id$/, 'relationships[].id (tie id)'], [/^relationships\[\]\./, 'relationships[].from/to/npc1Id/npc2Id'],
    [/^npcs\[\]\.memberships/, 'npcs[].memberships'], [/^npcs\[\]\.allegiance/, 'npcs[].allegiance'], [/^npcs\[\]\.goal/, 'npcs[].goal targets'],
    [/^(stress|stressors)(\[\])?\.cast\./, 'stress/stressors casts'], [/^simulationTrace/, 'simulationTrace targets'],
    [/^factions\[\]\.members/, 'factions[].members[] (roster copy)'], [/^powerStructure\.factions\[\]\.members/, 'powerStructure.factions[].members[]'],
    [/^\$marker/, 'served marker keys (gallery_member_overrides)'], [/^npcs\[\]/, 'npcs[] other']];
  for (const [re, name] of rules) if (re.test(p)) return name;
  return `other: ${p.split(/[.[{]/)[0]}`;
};
const ID_RE = /npc[._]|tie_npc/i;

it('R4-IDS M: every served person id, key and slug by surface', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const { buildNameSearch } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  let nrow = 0;
  /** The server's reads of one stored row: gallery (twice where asked), link; each { data, ov }. */
  const server = async (rec, dm, ov, twice) => {
    nrow += 1; const id = `abcd4100-0000-0000-00${String(SHARD[0]).padStart(2, '0')}-${String(nrow).padStart(12, '0')}`; const sl = `s4i${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov == null ? {} : ov), dm]);
    const g = async () => { const r = (await db.query('select to_jsonb(g.data) d, g.gallery_member_overrides o from public.get_gallery_dossier($1) g', [sl])).rows[0]; return { data: r?.d, ov: r?.o }; };
    const gallery = await g(); const gallery2 = twice ? await g() : null;
    const lx = (await db.query('select public.get_unlisted_dossier($1) x', [`${sl}l`])).rows[0]?.x;
    const link = { data: lx?.dossier, ov: lx?.gallery_member_overrides ?? lx?.overrides ?? null, keys: isRec(lx) ? Object.keys(lx).sort() : null };
    await db.query('delete from public.settlements where id = $1', [id]);
    return { gallery, gallery2, link };
  };
  const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
  const nameOf = (f) => (typeof f?.faction === 'string' ? f.faction : typeof f?.name === 'string' ? f.name : null);
  /** The explicit fold: the name's words (its bracketed qualifier dropped) joined by '_' and by nothing, case-blind. */
  const formsOf = (n) => { const base = String(n).replace(/\s*[([].*?[)\]]\s*/g, ' '); const w = base.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); return w.length ? [w.join('_'), w.join('')] : []; };
  /** Every id site of a document: [normalised path, value] (values and keys). */
  const idSites = (doc, storedIds, storedNums) => {
    const out = [];
    const walk = (v, p) => {
      if (typeof v === 'string') { if (ID_RE.test(v) || storedIds.has(v)) out.push([p, v]); return; }
      if (typeof v === 'number') { if (storedNums.has(v)) out.push([p, String(v)]); return; }
      if (Array.isArray(v)) { for (const x of v) walk(x, `${p}[]`); return; }
      if (isRec(v)) for (const k of Object.keys(v)) { if (ID_RE.test(k) || storedIds.has(k)) out.push([`${p ? `${p}.` : ''}{key}`, k]); walk(v[k], p ? `${p}.${k}` : k); }
    };
    walk(doc, '');
    return out;
  };
  const out = { meta: { src: SRC, shard: SHARD, started: new Date().toISOString() }, towns: [] };
  const ONLY = process.env.RV9_ONLY ? new Set(process.env.RV9_ONLY.split(',')) : null;
  for (const b of E.pool(Number(process.env.RV9_N || 2), SHARD)) {
    if (ONLY && !ONLY.has(b.seed)) continue;
    const A = E.birth(b.cfg, b.seed, null);
    const hideable = recs(A.institutions).filter((h) => E.isHideableHouse(h));
    const storedCards = recs(A.npcs).map((n) => n.id).filter((x) => x != null);
    const storedIds = new Set(storedCards.map(String)); const storedNums = new Set(storedCards.filter((x) => typeof x === 'number'));
    const rec = { seed: b.seed, hidden: hideable.map((h) => h.name), cards: storedCards.length,
      storedForms: [...new Set(storedCards.map((x) => String(x).replace(/^(npc_power_|npc_veiled_|npc_seat|npc\.|npc_).*$/, '$1')))].sort(), pages: {}, linkKeys: null };
    const shapes = { new: A, master: { ...A, factions: clone(A.powerStructure?.factions || []) } };
    for (const dm of [false, true]) {
      const { sc, deltas } = V.settings(A, dm);
      const cards = hideable.map((h) => ({ address: `card:institution:${V.veil.CARD_KINDS.institution.idOf(h)}`, hidden: false }));
      const sets = Object.fromEntries(Object.entries(deltas).filter(([k]) => k !== 'g:111'));
      if (hideable.length) sets.allShown = [...V.sw.setCriminalVeil(V.opened(OPEN), sc.defaults, false, sc.present, sc.model), ...cards];
      const entries = [...Object.entries(sets).map(([k, d]) => [k, V.write(d)]), ['unmarked', {}]];
      for (const [shape, S] of Object.entries(shapes)) for (const [k, ov] of entries) {
        const sv = await server(clone(S), dm, ov, STABLE_SETS.has(k));
        if (!rec.linkKeys) rec.linkKeys = sv.link.keys;
        const twinDoc = V.twin(S, dm, ov);
        const page = {};
        for (const [eng, read, doc, marker] of [['sv', 'gallery', sv.gallery.data, sv.gallery.ov], ['sv', 'link', sv.link.data, sv.link.ov], ['tw', 'twin', twinDoc, null]]) {
          const d = isRec(doc) ? doc : {};
          const servedPowers = new Set(recs(d.powerStructure?.factions).map(nameOf).filter(Boolean));
          const servedHouses = new Set(recs(d.institutions).map((h) => h.name).filter(Boolean));
          const wPowers = recs(S.powerStructure?.factions).map(nameOf).filter((n) => n && !servedPowers.has(n));
          const wHouses = recs(S.institutions).map((h) => h.name).filter((n) => n && !servedHouses.has(n));
          const W = [...new Set([...wPowers, ...wHouses])];
          const search = W.length ? buildNameSearch(W, [...servedPowers, ...servedHouses]) : null;
          const forms = W.flatMap(formsOf);
          const spells = (v) => {
            if (!W.length) return 0;
            const lane = search && !search.closed && search.hit(v) ? 1 : 0;
            const low = v.toLowerCase(); const u = low.replace(/[^a-z0-9]+/g, '_'); const z = low.replace(/[^a-z0-9]+/g, '');
            const fold = forms.some((f) => u.includes(f) || z.includes(f)) ? 2 : 0;
            return lane | fold;
          };
          const sites = idSites(d, storedIds, storedNums);
          if (isRec(marker)) for (const key of Object.keys(marker)) if (key !== '$veil') sites.push(['$marker{key}', key]);
          const surf = {}; const hits = [];
          for (const [p, v] of sites) {
            const s = surfaceOf(p); const h = spells(v);
            const row = (surf[s] = surf[s] || [0, 0, 0, 0]); row[0] += 1; if (h) { row[1] += 1; if (h & 1) row[2] += 1; if (h & 2) row[3] += 1; hits.push(`${p}=${v}`); }
          }
          const cardIdsServed = recs(d.npcs).map((n) => n.id).filter((x) => x != null).map(String);
          page[read] = { surf, hits: hits.sort(), closed: search?.closed ? 1 : 0, W: W.length, wPowers: wPowers.length, wHouses: wHouses.length,
            npcs: cardIdsServed.length, storedServed: cardIdsServed.filter((x) => storedIds.has(x)).length,
            markerKeys: isRec(marker) ? Object.keys(marker).filter((x) => x !== '$veil').length : null };
        }
        if (sv.gallery2) {
          const a = recs(sv.gallery.data?.npcs).map((n) => String(n.id)); const bb = new Set(recs(sv.gallery2.data?.npcs).map((n) => String(n.id)));
          page.stable = [a.filter((x) => bb.has(x)).length, a.length];
        }
        rec.pages[`${dm ? 'dm' : 'off'}|${k}|${shape}`] = page;
      }
    }
    out.towns.push(rec);
  }
  await db.end();
  out.meta.ended = new Date().toISOString();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
