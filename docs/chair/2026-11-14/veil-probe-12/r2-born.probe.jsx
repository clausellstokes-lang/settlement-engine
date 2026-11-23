// VEIL-12, RULING (2) BORN: the impressions withheld on born towns, by identity (the base) and by the words, clause by
// clause (after). The guard's born towns (tests/security/gallerySecondHomes.pglite.test.js :: TOWNS, born as its seeds and
// configuration give them, without its markers), in both stored shapes (the new one, and master's), the Reveal DM off and
// on, with THE DEFAULT VEIL and with EVERY PERSON'S APPEARANCE EYE SHUT by hand: each person's impression, whether each
// server read (gallery, party link, import; stored on a local chain built from the same tree's migrations) and the
// client's twin (galleryPayloadFor, then projectShareVeil) still carries it. Read-only but for its own rows on that chain;
// writes one JSON file (R2_OUT). LOCAL scratch cluster only (PGHOST, unix socket). Run once per tree:
//   sh <REVIEW-VEIL-6>/native/chain.sh <db> 212 <tree>/supabase/migrations
//   RV6_SRC=<tree> R2_DB=<db> R2_OUT=<file> RV6_PGMOD=<dir with pg@8.13.1> npx vitest run --config <a config whose root is
//   <tree> and whose include is this file> (REVIEW-VEIL-6's vitest.config.mjs, pointed at this file)
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
it('the impressions on born towns, by veil, read and engine', async () => {
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
  const rows = [];
  let n = 0;
  await db.query("delete from public.settlements where public_slug like 'r2b%'");
  for (const t of TOWNS) {
    const born = birth(t);
    for (const [shape, record] of Object.entries(shapes(born))) {
      for (const dm of [false, true]) {
        const pub = veil.galleryPayloadFor(record, { shareDm: dm, memberOverrides: {} });
        const appearance = veil.curateModelFor(pub, []).sections.flatMap((sec) => sec.cards.flatMap((c) => (c.kind === 'npc' ? c.eyes.map((e) => e.address) : [])))
          .filter((a) => /^field:npc:.*:physical$/.test(a));
        for (const [vn, addresses] of [['default', []], ['appearance', appearance]]) {
          n += 1;
          const ov = veil.writeShareVeil({}, addresses.map((a) => ({ address: a, hidden: true })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
          const slug = `r2b${n}`;
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
          const people = (record.npcs || []).filter((p) => isRec(p) && isRec(p.presentation) && typeof p.presentation.impression === 'string');
          for (const [rd, doc] of Object.entries(reads)) {
            const sent = (Array.isArray(doc?.npcs) ? doc.npcs : []).filter(isRec);
            for (const p of people) {
              const q = sent.find((x) => (p.id != null && x.id === p.id) || (p.id == null && x.name === p.name));
              rows.push({ town: t.seed, shape, dm, veil: vn, read: rd, id: p.id ?? null, name: p.name, present: !!q,
                withheld: !!q && !(isRec(q.presentation) && typeof q.presentation.impression === 'string'),
                appearanceSent: !!q && q.physical !== undefined, physical: p.physical ?? null, impression: p.presentation.impression });
            }
          }
        }
      }
    }
  }
  await db.query("delete from public.settlements where public_slug like 'r2b%'");
  await db.end();
  writeFileSync(process.env.R2_OUT, JSON.stringify(rows));
  console.log(`r2-born: ${rows.length} rows`);
}, 14_400_000);
