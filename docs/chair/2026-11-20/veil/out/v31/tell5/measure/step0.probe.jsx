// R3-TELL-5 unit (ii) STEP 0 (the chair's order of 22:19, R3-TELL-4's open PLAUSIBLE) AND the failing rows' measure.
// The gate's 140 births (tell-common.mjs :: pool, RV9_N=2, byte for byte as tell2.probe.jsx's towns mode), each read by the
// twin AND the server under every setting (tell-common.mjs :: settings, g:111 = own skipped), Reveal off and on.
// (1) THE SEARCH: every served document, deep: any key `allegiance` at any path but npcs[<i>].allegiance; and every served
//     copy of a person card: factions[].members[], powerStructure.factions[].members[], an object at a relation's end
//     (relationships[] / powerStructure.factionRelationships[]: any object-valued key), counted, each searched the same way.
// (2) THE ROWS (VEIL-31's builder: for EVERY birth, the controls too, so the open places' rows are read beside the failing ones): per page, the served availableServices.criminal rows (name|institution), safetyProfile.criminalInstitutions,
//     crimeTypes' types, the served houses (name|category|priorityCategory), the record's crisis. Read-only: no line of 212 or the twin.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, isRec } from '../../../v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
it('R3-TELL-5 step 0', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  let nrow = 0;
  const server = async (rec, dm, ov) => {
    nrow += 1; const id = `abcd7e${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `s${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  const hitsOf = (v, p, out) => {
    if (Array.isArray(v)) v.forEach((x, i) => hitsOf(x, `${p}[${i}]`, out));
    else if (isRec(v)) for (const k of Object.keys(v)) { const q = p ? `${p}.${k}` : k; if (k === 'allegiance' && !/^npcs\[\d+\]\.allegiance$/.test(q)) out.push(q); hitsOf(v[k], q, out); }
    return out;
  };
  const copiesOf = (d) => {
    const c = { members: 0, psMembers: 0, relEnds: 0 };
    for (const f of (Array.isArray(d.factions) ? d.factions : [])) if (isRec(f) && Array.isArray(f.members)) c.members += f.members.length;
    for (const f of (Array.isArray(d.powerStructure?.factions) ? d.powerStructure.factions : [])) if (isRec(f) && Array.isArray(f.members)) c.psMembers += f.members.length;
    for (const r of [...(Array.isArray(d.relationships) ? d.relationships : []), ...(Array.isArray(d.powerStructure?.factionRelationships) ? d.powerStructure.factionRelationships : [])])
      if (isRec(r)) for (const v of Object.values(r)) if (isRec(v)) c.relEnds += 1;
    return c;
  };
  const rowsOf = (d) => ({
    // (VEIL-31's builder: a third field, 1 where the row's institution is the name of a house the page serves, else 0)
    svc: (Array.isArray(d.availableServices?.criminal) ? d.availableServices.criminal : []).map((x) => (isRec(x) ? `${x.name}|${x.institution}|${(Array.isArray(d.institutions) ? d.institutions : []).some((h) => isRec(h) && h.name === x.institution) ? 1 : 0}` : JSON.stringify(x))),
    ops: d.economicState?.safetyProfile?.criminalInstitutions,
    types: Array.isArray(d.economicState?.safetyProfile?.crimeTypes) ? d.economicState.safetyProfile.crimeTypes.map((x) => (isRec(x) ? x.type : x)) : d.economicState?.safetyProfile?.crimeTypes,
    houses: (Array.isArray(d.institutions) ? d.institutions : []).filter(isRec).filter((h) => /criminal/i.test(`${h.category}|${h.priorityCategory}`) || E.isHideableHouse(h)).map((h) => `${h.name}|${h.category}|${h.priorityCategory}`),
  });
  const out = { births: [] };
  for (const b of E.pool(Number(process.env.RV9_N || 2), SHARD)) {
    const A = E.birth(b.cfg, b.seed, null);
    const hidden = (A.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => h.name);
    const rec = { seed: b.seed, size: b.size, crisis: b.crisis, hidden, stored: rowsOf(A), allHouses: (A.institutions || []).filter(isRec).map((h) => `${h.name}|${h.category}`), hits: [], copies: { members: 0, psMembers: 0, relEnds: 0 }, pages: {} };
    for (const dm of [false, true]) {
      const { deltas } = V.settings(A, dm);
      for (const [k, d] of Object.entries(deltas)) {
        if (k === 'g:111') continue;
        const ov = V.write(d);
        for (const [eng, page] of [['twin', V.twin(A, dm, ov)], ['server', await server(A, dm, ov)]]) {
          const key = `${eng}:${dm ? 'dm' : 'off'}:${k}`; const p = isRec(page) ? page : {};
          for (const h of hitsOf(p, '', [])) rec.hits.push(`${key} ${h}`);
          const c = copiesOf(p); for (const x of Object.keys(c)) rec.copies[x] += c[x];
          rec.pages[key] = rowsOf(p);
        }
      }
    }
    out.births.push(rec);
  }
  await db.end();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
