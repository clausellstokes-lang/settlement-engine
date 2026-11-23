// VEIL-15, ITEM 1, MEASURED FIRST: the born chance runs (the chair's re-ruling of 07:42 UTC: of the 464 impressions with
// every appearance eye shut, how many share a run of twelve code points with their own appearance by chance; OVER 23 is
// a STOP). The guard's born towns (tests/security/gallerySecondHomes.pglite.test.js :: TOWNS, born as veil-probe-12's
// r2-born.probe.jsx births them), both stored shapes. Each person whose impression is a string: every string leaf of
// the appearance against every string leaf of the impression, each folded WHOLE by the one fold (the tree's caseFold),
// read as CODE POINTS (Array.from). THE RULE BY ITS LITERAL FORM, written independently of either engine's build: a
// window of twelve at every code point of the shorter string, sought in the other (String.prototype.includes); and,
// for the record, the longest common run of code points (a dynamic programme). No database. Writes one JSON (V15_OUT).
//   RV6_SRC=<tree> V15_PROBE=<this file> V15_OUT=<file> npx vitest run --config <veil-probe-15/measure/probe.config.mjs>
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
const RUN = 12;
const stringsOf = (v, out = []) => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => stringsOf(x, out));
  else if (isRec(v)) Object.values(v).forEach((x) => stringsOf(x, out));
  return out;
};
/** The literal form: a window of RUN at every code point of the shorter, sought in the other. The first hit, or null. */
const literal = (fa, fb) => {
  const [s, l] = Array.from(fa).length <= Array.from(fb).length ? [fa, fb] : [fb, fa];
  const cs = Array.from(s);
  for (let i = 0; i + RUN <= cs.length; i += 1) { const w = cs.slice(i, i + RUN).join(''); if (l.includes(w)) return w; }
  return null;
};
/** The longest common run of code points of two folded strings (for the record). */
const longest = (fa, fb) => {
  const a = Array.from(fa); const b = Array.from(fb);
  let best = 0; let end = 0; let prev = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i += 1) {
    const cur = new Array(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j += 1) if (a[i - 1] === b[j - 1]) { cur[j] = prev[j - 1] + 1; if (cur[j] > best) { best = cur[j]; end = i; } }
    prev = cur;
  }
  return { n: best, run: a.slice(end - best, end).join('') };
};
it('the born chance runs of twelve, measured first', async () => {
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { caseFold } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { factionIdFromName } = await import(`${SRC}/src/lib/entities.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const birth = (t) => gen(density.birthConfig({ ...DEFAULT_CONFIG, ...BROWSER, settType: t.settType, ...(t.stress ? { selectedStresses: [t.stress], selectedStressesRandom: false } : {}) }), null, { seed: t.seed, customContent: {} });
  // the two stored shapes, exactly as r2-born.probe.jsx makes them
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
  for (const t of TOWNS) {
    const born = birth(t);
    for (const [shape, record] of Object.entries(shapes(born))) {
      for (const p of (record.npcs || []).filter((x) => isRec(x) && isRec(x.presentation) && typeof x.presentation.impression === 'string')) {
        let hit = null; let best = { n: 0, run: '' };
        for (const a of stringsOf(p.physical)) for (const b of stringsOf(p.presentation.impression)) {
          const fa = caseFold(a); const fb = caseFold(b);
          hit = hit ?? literal(fa, fb);
          const l = longest(fa, fb); if (l.n > best.n) best = l;
        }
        rows.push({ town: t.seed, shape, id: p.id ?? null, name: p.name, run: hit, longest: best, physical: p.physical ?? null, impression: p.presentation.impression });
      }
    }
  }
  writeFileSync(process.env.V15_OUT, JSON.stringify(rows));
  console.log(`run12-chance: ${rows.length} impressions, ${rows.filter((r) => r.run !== null).length} share a run of ${RUN}`);
}, 14_400_000);
