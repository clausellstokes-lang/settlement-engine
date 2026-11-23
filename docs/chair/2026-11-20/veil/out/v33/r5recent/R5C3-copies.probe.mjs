// R5C3: the history and narrative steps receive powerStructure.recentConflict (historyGenerator.js :: buildHistoryContext,
// narrativeGenerator.js :: genPressureDetail / generatePressureSentence). Is a SECOND COPY of the sentence stored, or served?
// Every string leaf of the stored record (and of the twin's served page, Reveal DM off and on) other than the key itself is
// asked whether it equals the sentence or holds a 24-code-point run of it. Pool: R5C2's seeds (r5c2-m3-*, r5c2-m3b-*).
const W = '/home/user/wt/r5c/src';
const { generateSettlementPipeline } = await import(`${W}/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${W}/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${W}/store/configSlice.js`);
const veil = await import(`${W}/domain/display/galleryVeil.js`);
const BIRTH_DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
await loadGenerationLawPayloads();
const clone = (v) => JSON.parse(JSON.stringify(v));
const N = Number(process.env.R5C3_N || 40);
function leaves(v, path, out) {
  if (typeof v === 'string') out.push([path, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => leaves(x, `${path}[${i}]`, out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) leaves(x, path ? `${path}.${k}` : k, out);
  return out;
}
const runs = (s, n = 24) => { const o = new Set(); for (let i = 0; i + n <= s.length; i += 1) o.add(s.slice(i, i + n)); return o; };
function copiesIn(doc, S) {
  const R = runs(S);
  return leaves(doc, '', []).filter(([p, v]) => p !== 'powerStructure.recentConflict' && (v === S || [...runs(v)].some((w) => R.has(w)))).map(([p]) => p);
}
const T = { births: 0, withSentence: 0, storedCopy: 0, servedCopy: 0 };
const byPath = {}; const ex = [];
for (const prefix of ['r5c2-m3', 'r5c2-m3b']) for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (let i = 0; i < N; i += 1) {
  const seed = `${prefix}-${size}-${i}`;
  const t = clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size }), null, { seed, customContent: {} }));
  T.births += 1;
  const S = t.powerStructure?.recentConflict;
  if (typeof S !== 'string' || S.length < 24) continue;
  T.withSentence += 1;
  const st = copiesIn(t, S);
  if (st.length) { T.storedCopy += 1; for (const p of st) byPath[`stored ${p.replace(/\[\d+\]/g, '[]')}`] = (byPath[`stored ${p.replace(/\[\d+\]/g, '[]')}`] || 0) + 1; if (ex.length < 12) ex.push(`${seed}: stored at ${st.join(', ')}`); }
  let served = false;
  for (const dm of [false, true]) {
    const d = veil.projectShareVeil(veil.galleryPayloadFor(clone(t), { shareDm: dm, memberOverrides: null }), null);
    const sv = copiesIn(d, S);
    if (sv.length) { served = true; for (const p of sv) byPath[`served dm=${dm} ${p.replace(/\[\d+\]/g, '[]')}`] = (byPath[`served dm=${dm} ${p.replace(/\[\d+\]/g, '[]')}`] || 0) + 1; }
  }
  if (served) T.servedCopy += 1;
}
console.log(JSON.stringify(T));
console.log(JSON.stringify(byPath, null, 1));
for (const e of ex) console.log(' ', e);
