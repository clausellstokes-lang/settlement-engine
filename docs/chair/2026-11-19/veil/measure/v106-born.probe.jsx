// VEIL-19's builder (V10-6, the chair's ruling VR21, with item B): NO HOLE IN ANY SERVED COUNTER, through the server, on born
// towns. The 48 births of bcd-born.probe.jsx (seed prefix 'v11-ties', six sizes, calm and infiltrated, R5_N each) and the
// reader's repro (seed 'rv10-gap-town-none-0', a town, no stress), both stored shapes, the default veil and every eye shut,
// Reveal DM on (the trace reaches no other read), on a local chain of one tree's migrations: the gallery read and the import,
// and the client's twin of the same tree. Per read: the served trace's `ts` (its only counter; causes and effects hold
// none) against 0..n-1, the holes counted; and server against twin.
//   sh <REVIEW-VEIL-6>/native/chain.sh <db> 212 <tree>/supabase/migrations
//   RV6_SRC=<tree> RV6_PROBE=v106-born.probe.jsx V106_DB=<db> V106_OUT=<file> R5_N=4 RV6_PGMOD=<dir with pg@8.13.1> \
//     npx vitest run --config <this dir>/vitest.config.mjs
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v) => (typeof v === 'string' ? v : '');
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
it('V10-6 on born towns: no hole in the served trace\'s ts', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.V106_DB }); await db.connect();
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { factionIdFromName } = await import(`${SRC}/src/lib/entities.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const N = Number(process.env.R5_N || 4); const PFX = process.env.R5_SEED || 'v11-ties';
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
  await db.query("delete from public.settlements where public_slug like 'v106b%'");
  const births = [];
  for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) births.push([settType, stress, `${PFX}-${settType}-${stress || 'calm'}-${i}`, `${settType}/${stress || 'calm'}/${i}`]);
  births.push(['town', null, 'rv10-gap-town-none-0', 'rv10-gap-town-none-0']);
  for (const [settType, stress, seed, town] of births) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let born; try { born = gen(density.birthConfig(cfg), null, { seed, customContent: {} }); } catch { continue; }
    towns += 1;
    for (const [shape, record] of Object.entries(shapes(born))) {
      const text = JSON.stringify(record);
      for (const kind of ['default', 'all']) for (const dm of [true]) {
        n += 1;
        let eyes = [];
        if (kind === 'all') {
          const m = veil.curateModelFor(veil.galleryPayloadFor(JSON.parse(text), { shareDm: dm, memberOverrides: {} }), []);
          eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
            ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]);
        }
        const ov = veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
        const slug = `v106b${n}`;
        await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
          values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', $1, $2, $3, true, $4, now(), $5, 'unlisted', $6, $7, true)`,
        [String(record.name || 'T'), String(record.tier || 'town'), text, slug, `${slug}l`, JSON.stringify(ov), dm]);
        let client;
        try { client = veil.projectShareVeil(veil.galleryPayloadFor(JSON.parse(text), { shareDm: dm, memberOverrides: ov }), ov); } catch (e) { client = { ERROR: String(e?.message || e).slice(0, 120) }; }
        const reads = {
          gallery: await read('', 'anon', 'select (select to_jsonb(g.data) from public.get_gallery_dossier($1) g) as d', [slug]),
          import: await read('22222222-2222-2222-2222-222222222222', 'authenticated', 'select (select to_jsonb(g.data) from public.import_gallery_dossier($1) g) as d', [slug]),
          client,
        };
        await db.query('delete from public.settlements where public_slug = $1', [slug]);
        for (const [rd, doc] of Object.entries(reads)) {
          const tr = Array.isArray(doc?.simulationTrace) ? doc.simulationTrace : [];
          const ts = tr.filter((e) => isRec(e) && 'ts' in e).map((e) => e.ts);
          const holes = ts.filter((v, i) => v !== i).length;
          rows.push({ town, shape, kind, dm, read: rd, error: doc?.ERROR ? String(doc.ERROR).slice(0, 80) : null,
            entries: tr.length, stored: (born.simulationTrace || []).length, holes, gone: (born.institutions || []).length - (Array.isArray(doc?.institutions) ? doc.institutions.length : 0),
            twin: rd === 'client' ? null : differ(doc, client) });
        }
      }
    }
  }
  await db.end();
  const sum = (f) => rows.filter(f).length;
  const lines = [`v106-born: ${towns} towns; rows ${rows.length}; reads that raise ${sum((r) => r.error)}; server against twin rows ${sum((r) => r.twin)}`,
    `  reads that hide a house whole ${sum((r) => r.gone > 0)}; of them with a withheld trace entry ${sum((r) => r.gone > 0 && r.entries < r.stored)}`,
    `  READS WITH A HOLE IN THE SERVED ts: ${sum((r) => r.holes > 0)} (gallery ${sum((r) => r.holes > 0 && r.read === 'gallery')}, import ${sum((r) => r.holes > 0 && r.read === 'import')}, twin ${sum((r) => r.holes > 0 && r.read === 'client')}); towns ${new Set(rows.filter((r) => r.holes > 0).map((r) => r.town)).size}`,
    ...rows.filter((r) => r.town === 'rv10-gap-town-none-0' && r.kind === 'default').map((r) => `  the reader's repro ${r.shape} ${r.read}: entries ${r.entries} of ${r.stored}, holes ${r.holes}`)];
  writeFileSync(process.env.V106_OUT, `${lines.join('\n')}\n`);
}, 14_400_000);
