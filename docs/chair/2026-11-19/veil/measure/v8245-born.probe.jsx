// VEIL-18's builder (V8-2, V8-4, V8-5): WHAT THE CURES MOVE ON BORN TOWNS, under THE DEFAULT VEIL and under EVERY EYE SHUT.
// The born towns of REVIEW-VEIL-13's probe (veil-probe-13/measure/r5-born.probe.jsx: seed prefix 'v11-ties', six sizes,
// calm and infiltrated, R5_N each), in both stored shapes (the new one with its public prose; master's, as r5-born builds
// it), each stored under two veils (the default veil record, no eye shut by hand; every eye the curate model offers shut,
// as REVIEW-VEIL-9's differ-server.probe.jsx builds it), Reveal DM off and on, on a local chain of one tree's migrations;
// read by the gallery read, the party link and the import, and by the client's twin of the same tree. Each read's
// fingerprint, and what V8-5 may withhold: its ties (by their ends), whether it sends prominentRelationship and
// pressureSentence, the fingerprint of the rest. Run once per tree; compare two runs with v8245-born-cmp.mjs.
// LOCAL scratch cluster only (PGHOST, unix socket).
//   sh <REVIEW-VEIL-6>/native/chain.sh <db> 212 <tree>/supabase/migrations
//   RV6_SRC=<tree> V85_DB=<db> V85_OUT=<file> R5_N=4 RV6_PGMOD=<dir with pg@8.13.1> npx vitest run --config <a config including this file>
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const sha = (v) => createHash('sha256').update(JSON.stringify(v) ?? 'undefined').digest('hex').slice(0, 24);
const str = (v) => (typeof v === 'string' ? v : '');
const rest = (doc) => (isRec(doc) ? Object.fromEntries(Object.entries(doc).filter(([k]) => !['relationships', 'prominentRelationship', 'pressureSentence'].includes(k))) : doc);
const tieKey = (t) => (isRec(t) ? [str(t.from) || str(t.npc1Id) || str(t.npc1Name), str(t.to) || str(t.npc2Id) || str(t.npc2Name), str(t.type) || str(t.typeName)].join('|') : JSON.stringify(t));
function differ(a, b) {
  let n = 0; const stack = [[a, b]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (isRec(x) && isRec(y)) { for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) stack.push([x[k], y[k]]); continue; }
    if (Array.isArray(x) && Array.isArray(y)) { for (let i = 0; i < Math.max(x.length, y.length); i += 1) stack.push([x[i], y[i]]); continue; }
    if (JSON.stringify(x) !== JSON.stringify(y)) n += 1;
  }
  return n;
}
it('V8-2, V8-4, V8-5 on born towns: the default veil and every eye shut', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.V85_DB }); await db.connect();
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { factionIdFromName } = await import(`${SRC}/src/lib/entities.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const N = Number(process.env.R5_N || 4); const PFX = process.env.R5_SEED || 'v11-ties';
  // master's stored shape, as r5-born.probe.jsx builds it
  const oldPerson = (p) => {
    const { memberships, allegiance, institution, ...r } = p;
    const ms = (Array.isArray(memberships) ? memberships : []).filter((m) => isRec(m) && typeof m.power === 'string');
    const out = { ...r };
    if (ms[0]) out.factionAffiliation = ms[0].power;
    if (ms[1]) out.secondaryAffiliation = ms[1].power;
    if (ms.length) out.linkedFactionIds = ms.map((m) => factionIdFromName(m.power));
    if (isRec(institution) && institution.kind === 'house' && typeof institution.key === 'string') out.institution = institution.key;
    if (isRec(allegiance)) { out.corrupt = true; out.corruptionVector = allegiance.vector ?? null; }
    return out;
  };
  const oldTie = ({ from, to, id: _id, ...r }) => ({ ...r, npc1Id: from, npc2Id: to });
  const shapes = (born) => ({
    new: { ...born, publicProse: compose(born) },
    old: (() => { const s = structuredClone(born); s.npcs = (s.npcs || []).map((p) => (isRec(p) ? oldPerson(p) : p));
      s.relationships = (s.relationships || []).map((t) => (isRec(t) && 'from' in t ? oldTie(t) : t)); s.schemaVersion = 1; return s; })(),
  });
  const read = async (uid, role, q, args) => {
    await db.query("select set_config('test.uid', $1, false)", [uid]); await db.query(`set role ${role}`);
    try { return (await db.query(q, args)).rows[0]?.d ?? null; } catch (e) { return { ERROR: String(e?.message || e).slice(0, 120) }; } finally { await db.query('reset role'); await db.query("select set_config('test.uid', '', false)"); }
  };
  const rows = []; let n = 0; let towns = 0;
  await db.query("delete from public.settlements where public_slug like 'v85b%'");
  for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let born; try { born = gen(density.birthConfig(cfg), null, { seed: `${PFX}-${settType}-${stress || 'calm'}-${i}`, customContent: {} }); } catch { continue; }
    towns += 1;
    const town = `${settType}/${stress || 'calm'}/${i}`;
    for (const [shape, record] of Object.entries(shapes(born))) {
      const text = JSON.stringify(record);
      for (const kind of ['default', 'all']) for (const dm of [false, true]) {
        n += 1;
        let eyes = [];
        if (kind === 'all') {
          const m = veil.curateModelFor(veil.galleryPayloadFor(JSON.parse(text), { shareDm: dm, memberOverrides: {} }), []);
          eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
            ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]);
        }
        const ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
        const slug = `v85b${n}`;
        await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
          values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', $1, $2, $3, true, $4, now(), $5, 'unlisted', $6, $7, true)`,
        [String(record.name || 'T'), String(record.tier || 'town'), text, slug, `${slug}l`, JSON.stringify(ov), dm]);
        let client;
        try { client = veil.projectShareVeil(veil.galleryPayloadFor(JSON.parse(text), { shareDm: dm, memberOverrides: ov }), ov); } catch (e) { client = { ERROR: String(e?.message || e).slice(0, 120) }; }
        const reads = {
          gallery: await read('', 'anon', 'select (select to_jsonb(g.data) from public.get_gallery_dossier($1) g) as d', [slug]),
          link: await read('', 'anon', "select public.get_unlisted_dossier($1) -> 'dossier' as d", [`${slug}l`]),
          import: await read('22222222-2222-2222-2222-222222222222', 'authenticated', 'select (select to_jsonb(g.data) from public.import_gallery_dossier($1) g) as d', [slug]),
          client,
        };
        await db.query('delete from public.settlements where public_slug = $1', [slug]);
        for (const [rd, doc] of Object.entries(reads)) {
          rows.push({ town, shape, kind, dm, read: rd, error: doc?.ERROR ? String(doc.ERROR).slice(0, 80) : null,
            h: sha(doc), hRest: sha(rest(doc)),
            ties: (Array.isArray(doc?.relationships) ? doc.relationships : []).map(tieKey),
            pr: isRec(doc) && 'prominentRelationship' in doc, ps: isRec(doc) && 'pressureSentence' in doc,
            people: Array.isArray(doc?.npcs) ? doc.npcs.length : 0,
            twin: rd === 'gallery' ? differ(doc, client) : rd === 'import' ? differ(doc, client) : rd === 'link' ? null : null });
        }
      }
    }
  }
  await db.end();
  writeFileSync(process.env.V85_OUT, JSON.stringify({ towns, rows }));
  console.log(`v8245-born: ${towns} towns, ${rows.length} rows`);
}, 14_400_000);
