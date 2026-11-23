// VEIL-13, RULING (5) BORN: does a read tell a covert tie the public projection drops, in any of its four strings
// (prominentRelationship.full, .tension, .phrasing; pressureSentence)? The 240 born towns PART 12 section 5 counted
// (veil-probe-11/measure/born-ties.probe.jsx: seed prefix 'v11-ties', six sizes, calm and infiltrated, twenty each), in both
// stored shapes (the new one with its public prose, and master's: veil-probe-12/r2-born.probe.jsx's), each stored three
// times (no veil record, Reveal DM off; the default veil, Reveal DM off; the default veil, Reveal DM on) on a local chain
// built from the same tree's migrations, read by the gallery, the party link and the import, and by the client's twin
// (galleryPayloadFor, then projectShareVeil). Read-only but for its own rows on that chain; writes one JSON file (R5_OUT)
// and the largest born town (R5_BIG, for the cost row). LOCAL scratch cluster only (PGHOST, unix socket). Run once per tree:
//   sh <REVIEW-VEIL-6>/native/chain.sh <db> 212 <tree>/supabase/migrations
//   RV6_SRC=<tree> RV6_PROBE=<this file, relative to REVIEW-VEIL-6> R5_DB=<db> R5_OUT=<file> R5_BIG=<file>
//   RV6_PGMOD=<dir with pg@8.13.1> npx vitest run --config <REVIEW-VEIL-6>/vitest.config.mjs
// The counter is this file's own, not the engines': a copy is a covert tie's where born-ties.probe.jsx's `match` says so
// (the same two ends and type, or a text equal to the tie's); a pressure sentence tells it where it holds both ends' names
// as written, or (lower case) a run of 12 or more of the tie's description or tension between sentence stops.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const sha = (v) => createHash('sha256').update(JSON.stringify(v) ?? 'undefined').digest('hex').slice(0, 24);
/** The read without the two keys ruling (5) may withhold: a read that changed anywhere else changes this. */
const rest = (doc) => (isRec(doc) ? Object.fromEntries(Object.entries(doc).filter(([k]) => k !== 'prominentRelationship' && k !== 'pressureSentence')) : doc);
const str = (v) => (typeof v === 'string' ? v : '');
const match = (t, pr) => (str(t.npc1Name) === str(pr.npc1) && str(t.npc2Name) === str(pr.npc2) && str(t.typeName) === str(pr.type))
  || (str(pr.full) !== '' && t.description === pr.full) || (str(pr.tension) !== '' && t.tension === pr.tension);
const runs = (t) => [t, ...str(t).split(/[.!?—]+/)].map((p) => str(p).trim().toLowerCase()).filter((p) => p.length >= 12);
const tellsPs = (ps, t) => typeof ps === 'string' && ((str(t.npc1Name) !== '' && str(t.npc2Name) !== '' && ps.includes(t.npc1Name) && ps.includes(t.npc2Name))
  || [...runs(t.description), ...runs(t.tension)].some((p) => ps.toLowerCase().includes(p)));
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
it('ruling (5): the covert tie\'s four strings on born towns, by read and engine', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: process.env.R5_DB }); await db.connect();
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { factionIdFromName } = await import(`${SRC}/src/lib/entities.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const N = Number(process.env.R5_N || 20); const PFX = process.env.R5_SEED || 'v11-ties';
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
  const read = async (uid, role, q, args) => {
    await db.query("select set_config('test.uid', $1, false)", [uid]); await db.query(`set role ${role}`);
    try { return (await db.query(q, args)).rows[0]?.d ?? null; } finally { await db.query('reset role'); await db.query("select set_config('test.uid', '', false)"); }
  };
  const rows = []; let n = 0; let big = null; let towns = 0;
  await db.query("delete from public.settlements where public_slug like 'r5b%'");
  for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let born; try { born = gen(density.birthConfig(cfg), null, { seed: `${PFX}-${settType}-${stress || 'calm'}-${i}`, customContent: {} }); } catch { continue; }
    towns += 1;
    const town = `${settType}/${stress || 'calm'}/${i}`;
    for (const [shape, record] of Object.entries(shapes(born))) {
      const text = JSON.stringify(record);
      if (shape === 'new' && (!big || text.length > big.length)) big = text;
      const covert = (Array.isArray(record.relationships) ? record.relationships : []).filter((t) => isRec(t) && t.covert === true);
      const pr = isRec(record.prominentRelationship) ? record.prominentRelationship : null;
      for (const [share, marked, dm] of [['none', false, false], ['veil', true, false], ['dm', true, true]]) {
        n += 1;
        const ov = marked ? veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' }) : {};
        const slug = `r5b${n}`;
        await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
          values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', $1, $2, $3, true, $4, now(), $5, 'unlisted', $6, $7, true)`,
        [String(record.name || 'T'), String(record.tier || 'town'), text, slug, `${slug}l`, JSON.stringify(ov), dm]);
        const reads = {
          gallery: await read('', 'anon', 'select (select to_jsonb(g.data) from public.get_gallery_dossier($1) g) as d', [slug]),
          link: await read('', 'anon', "select public.get_unlisted_dossier($1) -> 'dossier' as d", [`${slug}l`]),
          import: await read('22222222-2222-2222-2222-222222222222', 'authenticated', 'select (select to_jsonb(g.data) from public.import_gallery_dossier($1) g) as d', [slug]),
          client: veil.projectShareVeil(veil.galleryPayloadFor(JSON.parse(text), { shareDm: dm, memberOverrides: ov }), ov),
        };
        await db.query('delete from public.settlements where public_slug = $1', [slug]);
        for (const [rd, doc] of Object.entries(reads)) {
          const kept = (Array.isArray(doc?.relationships) ? doc.relationships : []).filter((t) => isRec(t) && t.covert === true);
          const dropped = covert.filter((t) => !kept.some((k) => str(k.npc1Name) === str(t.npc1Name) && str(k.npc2Name) === str(t.npc2Name) && str(k.typeName) === str(t.typeName)));
          const sentPr = isRec(doc?.prominentRelationship) ? doc.prominentRelationship : null;
          const prCovert = !!pr && dropped.some((t) => match(t, pr));
          const ownTie = (rels) => !!pr && (Array.isArray(rels) ? rels : []).some((t) => isRec(t) && match(t, pr));
          rows.push({ town, shape, share, read: rd, error: doc?.ERROR ? String(doc.ERROR).slice(0, 80) : null,
            hasPr: !!pr, prCovert, dropped: dropped.length,
            prNoTieInRead: !!pr && !ownTie(doc?.relationships), prNoTieInStored: !!pr && !ownTie(record.relationships),
            tells: {
              full: prCovert && typeof sentPr?.full === 'string', tension: prCovert && typeof sentPr?.tension === 'string', phrasing: prCovert && typeof sentPr?.phrasing === 'string',
              pressureSentence: dropped.some((t) => tellsPs(doc?.pressureSentence, t)),
            },
            psStored: typeof record.pressureSentence === 'string', psSent: typeof doc?.pressureSentence === 'string',
            prSent: !!sentPr, prKeys: sentPr ? ['full', 'tension', 'phrasing'].filter((k) => typeof sentPr[k] === 'string').join(',') : '',
            psNamesDroppedEnds: dropped.some((t) => str(t.npc1Name) && str(t.npc2Name) && str(record.pressureSentence).includes(t.npc1Name) && str(record.pressureSentence).includes(t.npc2Name)),
            twinDiffers: rd === 'gallery' ? differ(doc, reads.client) : null,
            // THE READ AS A WHOLE, for the comparison of two runs: its fingerprint, the fingerprint of the rest, and the two keys
            h: sha(doc), hRest: sha(rest(doc)), prJson: isRec(doc) && 'prominentRelationship' in doc ? JSON.stringify(doc.prominentRelationship) : null,
            psJson: isRec(doc) && 'pressureSentence' in doc ? JSON.stringify(doc.pressureSentence) : null,
            relsNotArray: 'relationships' in record && !Array.isArray(record.relationships), unnamedCovert: covert.some((t) => str(t.npc1Name) === '' || str(t.npc2Name) === '') });
        }
      }
    }
  }
  await db.end();
  writeFileSync(process.env.R5_OUT, JSON.stringify({ towns, rows }));
  if (process.env.R5_BIG && big) writeFileSync(process.env.R5_BIG, big);
  console.log(`r5-born: ${towns} towns, ${rows.length} rows`);
}, 14_400_000);
