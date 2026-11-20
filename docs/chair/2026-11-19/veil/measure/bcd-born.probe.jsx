// VEIL-19's builder (items B, C, D of briefs/SUB-BRIEF-BCD.md): WHAT B, C AND D MOVE ON BORN TOWNS, through the server.
// The born towns of v8245-born.probe.jsx (REVIEW-VEIL-13's seed prefix 'v11-ties', six sizes, calm and infiltrated, R5_N
// each), both stored shapes, two veils (the default veil record, no eye shut by hand; every eye the curate model offers
// shut), Reveal DM off and on, on a local chain of one tree's migrations; read by the gallery read, the party link and the
// import, and by the client's twin of the same tree. Per read: the trace (each entry's target and step, its causes'
// sources, its effects' targets; the allegiance receipts' power and handler lines), the two copies of the engine's
// institution flags, what the engine's own getInstFlags raises over the STORED records of the houses the read still lists,
// the income rows (source, criminal mark, share, weight), the economy prose rungs that carry the income, the people's
// allegiances, and a fingerprint of everything else. Run once per tree; compare two runs with bcd-born-cmp.mjs.
// LOCAL scratch cluster only (PGHOST, unix socket).
//   sh <REVIEW-VEIL-6>/native/chain.sh <db> 212 <tree>/supabase/migrations
//   RV6_SRC=<tree> RV6_PROBE=bcd-born.probe.jsx BCD_DB=<db> BCD_OUT=<file> R5_N=4 RV6_PGMOD=<dir with pg@8.13.1> \
//     npx vitest run --config <this dir>/vitest.config.mjs
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const sha = (v) => createHash('sha256').update(JSON.stringify(v) ?? 'undefined').digest('hex').slice(0, 24);
const str = (v) => (typeof v === 'string' ? v : '');
const FLAG = /^has[A-Z]/;
const flagsOf = (inst) => (isRec(inst) ? Object.fromEntries(Object.entries(inst).filter(([k]) => FLAG.test(k))) : null);
const PROSE_KEYS = ['incomeMix', 'criminalLine'];
/** everything but what B, C and D may move */
const rest = (doc) => {
  if (!isRec(doc)) return doc;
  const d = structuredClone(doc);
  delete d.simulationTrace;
  const e = d.economicState;
  if (isRec(e)) {
    delete e.incomeSources;
    if (isRec(e.compound)) delete e.compound.inst;
    if (isRec(e.safetyProfile) && isRec(e.safetyProfile.compound)) delete e.safetyProfile.compound.inst;
  }
  const eco = d.publicProse?.blocks?.['economy:economics'];
  if (isRec(eco)) for (const k of Object.keys(eco)) if (PROSE_KEYS.some(p => k === p || k.startsWith(`${p}@`) || k.startsWith('@'))) delete eco[k];
  return d;
};
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
const traceOf = (doc) => (Array.isArray(doc?.simulationTrace) ? doc.simulationTrace : null)?.map((e) => (isRec(e)
  ? { tt: str(e.targetType), ti: str(e.targetId), st: str(e.step),
      c: (Array.isArray(e.causes) ? e.causes : []).map(x => (isRec(x) ? str(x.source) : JSON.stringify(x))),
      e: (Array.isArray(e.downstreamEffects) ? e.downstreamEffects : []).map(x => (isRec(x) ? str(x.target) : JSON.stringify(x))),
      ar: (Array.isArray(e.downstreamEffects) ? e.downstreamEffects : []).filter(x => isRec(x) && (x.effect === 'holds a hidden allegiance' || x.effect === 'handles the agent')).map(x => `${x.effect}|${str(x.target)}`) }
  : { raw: JSON.stringify(e).slice(0, 60) })) ?? null;
it('B, C, D on born towns: the default veil and every eye shut', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.BCD_DB }); await db.connect();
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { getInstFlags } = await import(`${SRC}/src/generators/priorityHelpers.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
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
  const rows = []; const stored = []; let n = 0; let towns = 0;
  await db.query("delete from public.settlements where public_slug like 'bcdb%'");
  for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let born; try { born = gen(density.birthConfig(cfg), null, { seed: `${PFX}-${settType}-${stress || 'calm'}-${i}`, customContent: {} }); } catch { continue; }
    towns += 1;
    const town = `${settType}/${stress || 'calm'}/${i}`;
    const houses = (born.institutions || []).filter(isRec);
    stored.push({ town, houses: houses.map(h => ({ id: str(h.id), name: str(h.name), cid: str(h.catalogId), hide: isHideableHouse(h), custom: !!(h.isCustom || h.custom) })),
      flags: flagsOf(born.economicState?.compound?.inst), sflags: flagsOf(born.economicState?.safetyProfile?.compound?.inst),
      income: (born.economicState?.incomeSources || []).map(r => [str(r.source), r.isCriminal === true, r.percentage, r.weight]),
      trace: traceOf(born), allegiances: (born.npcs || []).filter(p => isRec(p?.allegiance)).map(p => [str(p.id), str(p.allegiance.house), str(p.allegiance.handler), str(p.allegiance.power)]) });
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
        const slug = `bcdb${n}`;
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
          const listed = (Array.isArray(doc?.institutions) ? doc.institutions : []).filter(isRec);
          const servedRecords = houses.filter(h => listed.some(l => (str(l.id) !== '' ? str(l.id) === str(h.id) : str(l.name) === str(h.name))));
          const gone = houses.filter(h => !servedRecords.includes(h));
          const eco = doc?.publicProse?.blocks?.['economy:economics'];
          rows.push({ town, shape, kind, dm, read: rd, error: doc?.ERROR ? String(doc.ERROR).slice(0, 80) : null,
            h: sha(doc), hRest: sha(rest(doc)),
            gone: gone.map(h => str(h.id) || str(h.name)), goneHide: gone.filter(h => isHideableHouse(h)).map(h => str(h.id) || str(h.name)),
            trace: traceOf(doc),
            flags: flagsOf(doc?.economicState?.compound?.inst), sflags: flagsOf(doc?.economicState?.safetyProfile?.compound?.inst),
            names: doc?.economicState?.compound?.inst?.names ?? null,
            served: flagsOf(getInstFlags({}, servedRecords).inst),
            income: Array.isArray(doc?.economicState?.incomeSources) ? doc.economicState.incomeSources.map(r => (isRec(r) ? [str(r.source), r.isCriminal === true, r.percentage, r.weight, 'desc' in r] : [JSON.stringify(r)])) : null,
            prose: isRec(eco) ? Object.keys(eco).filter(k => PROSE_KEYS.some(p => k === p || k.startsWith(`${p}@`)) || k.startsWith('@')).map(k => [k, sha(eco[k])]) : null,
            allegiances: (Array.isArray(doc?.npcs) ? doc.npcs : []).filter(p => isRec(p?.allegiance)).map(p => [str(p.id), str(p.allegiance.house), str(p.allegiance.handler), str(p.allegiance.power)]),
            twin: rd === 'gallery' || rd === 'import' ? differ(doc, client) : null });
        }
      }
    }
  }
  await db.end();
  writeFileSync(process.env.BCD_OUT, JSON.stringify({ towns, stored, rows }));
  console.log(`bcd-born: ${towns} towns, ${rows.length} rows`);
}, 14_400_000);
