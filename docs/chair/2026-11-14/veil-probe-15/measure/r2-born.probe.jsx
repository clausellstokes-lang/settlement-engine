// VEIL-15, ITEM 2 (R2), BORN: the processing names withheld on born towns. The guard's born towns
// (tests/security/gallerySecondHomes.pglite.test.js :: TOWNS, born as its seeds and configuration give them, without its
// markers; the same list as veil-probe-12/r2-born.probe.jsx), in both stored shapes (the new one with its public prose, and
// master's), Reveal DM off and on, under three veils: THE DEFAULT (no delta), EVERY OTHER HOUSE OPENED (each second house
// that has a whole eye opened by hand, so open houses stand beside houses hidden whole) and EVERY HOUSE SHUT (each whole
// eye shut by hand). For each read (gallery, party link, import: a local chain built from the same tree's migrations; and
// the client's twin, galleryPayloadFor then projectShareVeil): each chain's processing names and dependency, kept or
// withheld. Read-only but for its own rows on that chain; writes one JSON file (R2_OUT). LOCAL scratch cluster only.
//   RV6_SRC=<tree> V15_PROBE=<this file> R2_DB=<db> R2_OUT=<file> RV6_PGMOD=<dir with pg@8.13.1> PGHOST=<socket dir>
//   npx vitest run --config <veil-probe-15/measure/probe.config.mjs>
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const TOWNS = [
  { seed: 'rv5-plant-city-infiltrated-0', settType: 'city', stress: 'infiltrated' },
  { seed: 'rv5-plant-hamlet-infiltrated-0', settType: 'hamlet', stress: 'infiltrated' },
  { seed: 'cv6-proc-metropolis-infiltrated-0', settType: 'metropolis', stress: 'infiltrated' },
  { seed: 'cv6-proc-city-infiltrated-2', settType: 'city', stress: 'infiltrated' },
];
it('R2 born: the processing names withheld on born towns, by veil, read and engine', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.R2_DB }); await db.connect();
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { factionIdFromName } = await import(`${SRC}/src/lib/entities.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const birth = (t) => gen(density.birthConfig({ ...DEFAULT_CONFIG, ...BROWSER, settType: t.settType, ...(t.stress ? { selectedStresses: [t.stress], selectedStressesRandom: false } : {}) }), null, { seed: t.seed, customContent: {} });
  const oldPerson = (p) => {
    const { memberships, allegiance, institution, ...rest } = p;
    const ms = (Array.isArray(memberships) ? memberships : []).filter((m) => isRec(m) && typeof m.power === 'string');
    const out = { ...rest };
    if (ms[0]) out.factionAffiliation = ms[0].power;
    if (ms[1]) out.secondaryAffiliation = ms[1].power;
    if (ms.length) out.linkedFactionIds = ms.map((m) => factionIdFromName(m.power));
    if (isRec(institution) && institution.kind === 'house' && typeof institution.key === 'string') out.institution = institution.key;
    if (isRec(allegiance)) { out.corrupt = true; out.corruptionVector = allegiance.vector ?? null; }
    return out;
  };
  const oldTie = ({ from, to, id: _id, ...rest }) => ({ ...rest, npc1Id: from, npc2Id: to });
  const shapes = (born) => ({
    new: { ...born, publicProse: compose(born) },
    old: (() => { const s = structuredClone(born); s.npcs = (s.npcs || []).map((p) => (isRec(p) ? oldPerson(p) : p));
      s.relationships = (s.relationships || []).map((t) => (isRec(t) && 'from' in t ? oldTie(t) : t)); s.schemaVersion = 1; return s; })(),
  });
  const chainsOf = (doc) => (Array.isArray(doc?.economicState?.activeChains) ? doc.economicState.activeChains : []).filter(isRec);
  const keyOf = (c) => String(c.chainId ?? c.id ?? c.label ?? '');
  const rows = []; let n = 0; const ascii = { names: 0, outside: 0 };
  await db.query("delete from public.settlements where public_slug like 'r2n%'");
  for (const t of TOWNS) {
    const born = birth(t);
    for (const [shape, record] of Object.entries(shapes(born))) {
      const recChains = chainsOf(record);
      for (const c of recChains) for (const x of [...(Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []), ...(isRec(c.dependency) ? [c.dependency.institution] : [])]) {
        if (typeof x !== 'string') continue; ascii.names += 1; if (/[^\x00-\x7f]/.test(x)) ascii.outside += 1;
      }
      for (const dm of [false, true]) {
        const pub = veil.galleryPayloadFor(record, { shareDm: dm, memberOverrides: {} });
        const wholes = veil.curateModelFor(pub, []).sections.flatMap((sec) => sec.cards.flatMap((c) => (c.whole ? [c.whole.address] : [])));
        for (const [vn, deltas] of [['default', []], ['alternate', wholes.map((a, i) => ({ address: a, hidden: i % 2 === 1 }))], ['every', wholes.map((a) => ({ address: a, hidden: true }))]]) {
          n += 1;
          const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
          const slug = `r2n${n}`;
          await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
            values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', $1, $2, $3, true, $4, now(), $5, 'unlisted', $6, $7, true)`,
          [String(record.name || 'T'), String(record.tier || 'town'), JSON.stringify(record), slug, `${slug}l`, JSON.stringify(ov), dm]);
          const read = async (uid, role, q, args) => {
            await db.query("select set_config('test.uid', $1, false)", [uid]); await db.query(`set role ${role}`);
            try { return (await db.query(q, args)).rows[0]?.d ?? null; } finally { await db.query('reset role'); await db.query("select set_config('test.uid', '', false)"); }
          };
          const reads = {
            gallery: await read('', 'anon', 'select (select to_jsonb(g.data) from public.get_gallery_dossier($1) g) as d', [slug]),
            link: await read('', 'anon', "select public.get_unlisted_dossier($1) -> 'dossier' as d", [`${slug}l`]),
            import: await read('22222222-2222-2222-2222-222222222222', 'authenticated', 'select (select to_jsonb(g.data) from public.import_gallery_dossier($1) g) as d', [slug]),
            client: veil.projectShareVeil(veil.galleryPayloadFor(record, { shareDm: dm, memberOverrides: ov }), ov),
          };
          await db.query('delete from public.settlements where public_slug = $1', [slug]);
          for (const [rd, doc] of Object.entries(reads)) {
            const sent = new Map(chainsOf(doc).map((c) => [keyOf(c), c]));
            const withheld = []; let chainsWithheld = 0; let depsWithheld = 0; let names = 0;
            for (const c of recChains) {
              const s = sent.get(keyOf(c));
              const procs = (Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []).filter((x) => typeof x === 'string');
              names += procs.length;
              if (!s) { chainsWithheld += 1; withheld.push(...procs.map((x) => `${keyOf(c)}: ${x} (the chain)`)); continue; }
              const kept = Array.isArray(s.processingInstitutions) ? s.processingInstitutions : [];
              for (const x of procs) if (!kept.includes(x)) withheld.push(`${keyOf(c)}: ${x}`);
              if (isRec(c.dependency) && !isRec(s.dependency)) { depsWithheld += 1; withheld.push(`${keyOf(c)}: dependency ${c.dependency.institution}`); }
            }
            rows.push({ town: t.seed, shape, dm, veil: vn, read: rd, error: doc?.ERROR ? String(doc.ERROR).slice(0, 80) : null,
              chains: recChains.length, names, chainsWithheld, depsWithheld, withheld });
          }
        }
      }
    }
  }
  await db.query("delete from public.settlements where public_slug like 'r2n%'");
  await db.end();
  writeFileSync(process.env.R2_OUT, JSON.stringify({ ascii, rows }));
  console.log(`r2-born: ${rows.length} rows; processing names and dependencies on the born records ${ascii.names}, outside ASCII ${ascii.outside}`);
}, 14_400_000);
