#!/usr/bin/env node
// FORTUNE-7 unit 0(b): THE VEIL AS A MEASURE (read-only; changes nothing under src/ or tests/).
// Is LASTING's input, `history.age` (and `history.founding.age`), served UNCHANGED on every shared read of a born place?
// Births: the visitor's pool (lit-run.mjs's visitorJob), law 2 forced after birthConfig, N seeds a size, plus the six
// places of measures/sentences/PAGES.md. Each projection below is compared with the owner's record, birth by birth.
// usage: node veil-probe.mjs <tree> <N-a-size> <out.md>
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const [treeArg, nArg, out] = process.argv.slice(2);
const T = resolve(treeArg);
const N = Number(nArg) || 25;
const imp = (p) => import(join(T, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { createCustomContentSlice } = await imp('src/store/customContentSlice.js');
const { settlementContentRuntimeOptions } = await imp('src/store/settlementContentRuntime.js');
const { eligibleCustomContent } = await imp('src/domain/customContentSchema.js');
const { contentRuntimeFromCampaignBinding } = await imp('src/domain/content/contentEnvironment.js');
const { toPublicSafe, publicVeiledRecordOf, veilPublicPayload } = await imp('src/domain/display/publicSafe.js');
const G = await imp('src/domain/display/galleryVeil.js');
const { projectSettlementForTownMapAudience } = await imp('src/domain/townMap/audienceProjection.js');
await loadGenerationLawPayloads();

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const visitorJob = (size, i) => {
  const config = { ...DEFAULT_CONFIG, settType: size, _institutionToggles: {}, _categoryToggles: {}, _goodsToggles: {}, _servicesToggles: {}, _randomizePriorities: true };
  let st;
  const slice = createCustomContentSlice(() => {}, () => st);
  st = { ...slice, activeCampaignId: null, campaigns: [], config: { ...DEFAULT_CONFIG, settType: size }, configExplicitFields: {} };
  return { size, seed: `visitor-${size}-${i}`, config, options: settlementContentRuntimeOptions(st, contentRuntimeFromCampaignBinding, eligibleCustomContent) };
};
const JOBS = [];
for (const size of SIZES) for (let i = 0; i < N; i += 1) JOBS.push(visitorJob(size, i));
// the six places of PAGES.md (fortuneMeritSentence.test.js :: PLACES)
for (const [seed, size, dials] of [['hxd-metropolis-73', 'metropolis', {}], ['visitor-thorp-71', 'thorp', { _randomizePriorities: true }],
  ['visitor-hamlet-21', 'hamlet', { _randomizePriorities: true }], ['visitor-village-8', 'village', { _randomizePriorities: true }],
  ['visitor-town-97', 'town', { _randomizePriorities: true }], ['visitor-city-14', 'city', { _randomizePriorities: true }]]) {
  JOBS.push({ size, seed, config: { ...DEFAULT_CONFIG, settType: size, ...dials }, options: { customContent: {} } });
}

const isRec = (v) => v && typeof v === 'object' && !Array.isArray(v);
const listAt = (s, path) => { let v = s; for (const k of path) v = isRec(v) ? v[k] : undefined; return Array.isArray(v) ? v.filter(isRec) : []; };
const cardsOf = (s, kind) => {
  const out = [];
  for (const path of G.CARD_KINDS[kind].lists) {
    const star = path.indexOf('*');
    if (star < 0) { out.push(...listAt(s, path)); continue; }
    for (const owner of listAt(s, path.slice(0, star))) out.push(...listAt(owner, path.slice(star + 1)));
  }
  return out;
};
/** THE WIDEST VEIL: every grouping, every class switch, every institution card, and every field of every card. */
const widestOf = (pub) => {
  const a = [...Object.keys(G.GROUPING_REMOVERS),
    ...Object.entries(G.CARD_KINDS).flatMap(([kind, k]) => Object.keys(k.fields).map((f) => `class:${kind}:${f}`))];
  for (const [kind, k] of Object.entries(G.CARD_KINDS)) {
    for (const card of cardsOf(pub, kind)) {
      const id = k.idOf(card);
      if (!id) continue;
      if (kind === 'institution') a.push(`card:institution:${id}`);
      for (const f of Object.keys(k.fields)) a.push(`field:${kind}:${id}:${f}`);
    }
  }
  return a;
};

const PROJ = [
  ['toPublicSafe(record) — the default share, the anonymous result, the pre-publish preview', (r) => toPublicSafe(r)],
  ['toPublicSafe(record, { full: true }) — the owner\'s DM-share opt-in', (r) => toPublicSafe(r, { full: true })],
  ['galleryPayloadFor(record) — the share row\'s payload', (r) => G.galleryPayloadFor(r)],
  ['galleryPayloadFor(record, { shareDm: true })', (r) => G.galleryPayloadFor(r, { shareDm: true })],
  ['applyVeil(payload, defaultVeilFor(payload)) — a marked share at its defaults', (r) => { const p = toPublicSafe(r); return G.applyVeil(p, G.defaultVeilFor(p)); }],
  ['applyVeil(payload, WIDEST) — every grouping, class, institution card and card field hidden', (r) => { const p = toPublicSafe(r); return G.applyVeil(p, widestOf(p)); }],
  ['applyVeil(full payload, WIDEST)', (r) => { const p = toPublicSafe(r, { full: true }); return G.applyVeil(p, widestOf(p)); }],
  ['projectShareVeil(payload, writeShareVeil(null, WIDEST as stored deltas)) — the reader\'s path', (r) => {
    const p = toPublicSafe(r);
    const deltas = widestOf(p).slice(0, G.VEIL_MAX_DELTAS).map((address) => ({ address, hidden: true }));
    return G.projectShareVeil(p, G.writeShareVeil(null, deltas));
  }],
  ['publicVeiledRecordOf(record) — the player view / public dossier reader', (r) => publicVeiledRecordOf(r)],
  ['veilPublicPayload(toPublicSafe(record)) — the civility backstop', (r) => veilPublicPayload(toPublicSafe(r))],
  ['projectSettlementForTownMapAudience(record, \'player\') — the town map\'s player audience', (r) => projectSettlementForTownMapAudience(r, 'player')],
];

const tally = PROJ.map(() => ({ same: 0, differ: 0, absent: 0, errors: 0, firstBad: null }));
let births = 0; let errors = 0; let ownerNoAge = 0; let truncated = 0; let maxWidest = 0;
for (const job of JOBS) {
  let rec;
  try { rec = generateSettlementPipeline({ ...birthConfig(job.config), _fortuneLawVersion: 2 }, null, { seed: job.seed, ...job.options }); }
  catch (e) { errors += 1; continue; }
  births += 1;
  const own = { age: rec.history?.age, founding: rec.history?.founding?.age };
  if (typeof own.age !== 'number') ownerNoAge += 1;
  const w = widestOf(toPublicSafe(rec)).length; maxWidest = Math.max(maxWidest, w); if (w > G.VEIL_MAX_DELTAS) truncated += 1;
  PROJ.forEach(([, f], i) => {
    let p;
    try { p = f(structuredClone(rec)); } catch (e) { tally[i].errors += 1; tally[i].firstBad ??= `${job.seed}: ${String(e).slice(0, 80)}`; return; }
    const got = { age: p?.history?.age, founding: p?.history?.founding?.age };
    if (got.age === undefined && got.founding === undefined) { tally[i].absent += 1; tally[i].firstBad ??= `${job.seed}: history.age absent`; return; }
    if (got.age === own.age && got.founding === own.founding) tally[i].same += 1;
    else { tally[i].differ += 1; tally[i].firstBad ??= `${job.seed}: ${JSON.stringify(got)} vs owner ${JSON.stringify(own)}`; }
  });
}
const lines = [`births ${births} (law 2 forced; ${N} visitor seeds a size + the six PAGES places), errors ${errors}; owner record without a numeric history.age: ${ownerNoAge}; widest veil addresses per record: max ${maxWidest} (stored-delta cap ${G.VEIL_MAX_DELTAS}; records over the cap: ${truncated})`, '',
  '| projection | same as owner (age and founding.age) | altered | absent | threw | first exception |', '|---|---|---|---|---|---|'];
PROJ.forEach(([name], i) => { const t = tally[i]; lines.push(`| ${name} | ${t.same} | ${t.differ} | ${t.absent} | ${t.errors} | ${t.firstBad ?? '—'} |`); });
writeFileSync(out, lines.join('\n') + '\n');
console.log(lines.join('\n'));
