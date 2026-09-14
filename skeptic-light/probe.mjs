// SKEPTIC probe — independent of the receipt's own test file.
const R = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepLIGHT';
const { generateSettlementPipeline } = await import(`${R}/src/generators/generateSettlementPipeline.js`);
const V = await import(`${R}/src/domain/content/livingContentLawVersion.js`);
const LAW = await import(`${R}/src/domain/content/livingContentLaw.js`);
const B = await import(`${R}/src/domain/density/densityCreateBoundary.js`);
const { goldenCorpus } = await import(`${R}/tests/helpers/goldenMasterCorpus.js`);
const { rateGrid } = await import(`${R}/scripts/prose-rate-corpus.mjs`);
const PACK = await import(`${R}/tests/fixtures/customContentReferencePack.js`);

const KEY = V.LIVING_CONTENT_LAW_CONFIG_KEY;
console.log('KEY =', KEY);
console.log('DIAL NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION =', LAW.NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION);
console.log('ROSTER_LIVING_CONTENT_LAW_VERSION =', V.ROSTER_LIVING_CONTENT_LAW_VERSION);
console.log('newSettlementLivingContentLaw() =', JSON.stringify(LAW.newSettlementLivingContentLaw()));

// (f) closed membership — fail closed?
for (const v of [undefined, null, 0, 1, 2, 3, 99, '2', '3', true, 2.0, NaN, Infinity, '2abc']) {
  const out = V.readLivingContentLawVersion(v);
  if (!V.LIVING_CONTENT_LAW_VERSIONS.includes(out)) console.log('FAIL-OPEN', v, '->', out);
}
console.log('readLivingContentLawVersion(3) =', V.readLivingContentLawVersion(3));
console.log('readLivingContentLawVersion("2") =', V.readLivingContentLawVersion('2'));
console.log('every probed value stays inside LIVING_CONTENT_LAW_VERSIONS:',
  [undefined,null,0,1,2,3,99,'2','3',true,NaN,Infinity].every(v => V.LIVING_CONTENT_LAW_VERSIONS.includes(V.readLivingContentLawVersion(v))));

// deep field diff
function paths(o, p = '', out = []) {
  if (o === null || typeof o !== 'object') { out.push([p, JSON.stringify(o)]); return out; }
  if (Array.isArray(o)) { o.forEach((v, i) => paths(v, `${p}[${i}]`, out)); if (!o.length) out.push([p, '[]']); return out; }
  const k = Object.keys(o);
  if (!k.length) out.push([p, '{}']);
  for (const key of k) paths(o[key], p ? `${p}.${key}` : key, out);
  return out;
}
function diff(a, b) {
  const A = new Map(paths(a)); const Bm = new Map(paths(b));
  const d = [];
  for (const [k, v] of A) { if (!Bm.has(k)) d.push(`ONLY-DARK ${k}`); else if (Bm.get(k) !== v) d.push(`MOVED ${k}`); }
  for (const k of Bm.keys()) if (!A.has(k)) d.push(`ONLY-LIT ${k}`);
  return d;
}

function pair(config, seed, customContent) {
  const dark = generateSettlementPipeline({ ...config }, null, { seed, customContent });
  const lit = generateSettlementPipeline({ ...config, [KEY]: 2 }, null, { seed, customContent });
  return { dark, lit, d: diff(dark, lit) };
}

const g = goldenCorpus();
const rt = rateGrid();
console.log('corpus sizes: golden', g.length, 'rate', rt.length);
const { _seed: gseed, ...gcfg } = g[0];
const rows = [
  ['GOLDEN[0]', gcfg, gseed],
  ['RATE[0]', rt[0].config, rt[0].seed],
  ['RATE[400]', rt[400].config, rt[400].seed],
];

await B.loadGenerationLawPayloads();
console.log('\n=== EMPTY customContent (the receipt corpora condition) ===');
for (const [label, cfg, seed] of rows) {
  const { dark, lit, d } = pair(cfg, seed, {});
  console.log(label, 'seed', seed, '| diff paths:', JSON.stringify(d),
    '| dark hasOwn roster', Object.hasOwn(dark, 'customContentRoster'),
    '| lit hasOwn roster', Object.hasOwn(lit, 'customContentRoster'),
    '| lit.customContentRoster ===', JSON.stringify(lit.customContentRoster),
    '| lit law', V.resolveLivingContentLawVersion(lit.config),
    '| dark law', V.resolveLivingContentLawVersion(dark.config));
}

console.log('\n=== REFERENCE PACK customContent (anti-vacuity) ===');
const cc = PACK.identifyCustomContentPack(PACK.customContentReferencePack());
// arm the seam the way production does
await B.loadGenerationLawPayloads();
for (const [label, cfg, seed] of rows) {
  const { dark, lit, d } = pair(cfg, seed, cc);
  const strip = (s) => { const c = { ...s }; delete c.customContentRoster;
    c.config = { ...c.config }; delete c.config[KEY];
    if (c._config) { c._config = { ..._c(c._config) }; }
    return JSON.stringify(c); };
  function _c(o) { const x = { ...o }; delete x[KEY]; return x; }
  console.log(label, '| diff paths (first 12):', JSON.stringify(d.slice(0, 12)), '| total diff paths', d.length);
  console.log('   lit roster present:', !!lit.customContentRoster,
    '| buckets:', lit.customContentRoster ? Object.keys(lit.customContentRoster.buckets).sort().join(',') : 'NONE',
    '| schemaVersion:', lit.customContentRoster?.schemaVersion,
    '| dark roster:', Object.hasOwn(dark, 'customContentRoster'));
  console.log('   after removing marker+roster, byte-identical:', strip(dark) === strip(lit));
}

// the LIT PRODUCT birth (through birthConfig, the way the dial actually acts)
console.log('\n=== birthConfig (the shipped dial) ===');
const born = generateSettlementPipeline(B.birthConfig({ ...gcfg }), null, { seed: 'skeptic-born', customContent: cc });
console.log('born config marker =', born.config[KEY], '| roster present', !!born.customContentRoster,
  '| provenance present', !!born.customContentProvenance);
const bornEmpty = generateSettlementPipeline(B.birthConfig({ ...gcfg }), null, { seed: 'skeptic-born', customContent: {} });
console.log('born with EMPTY customContent: marker =', bornEmpty.config[KEY],
  '| hasOwn roster =', Object.hasOwn(bornEmpty, 'customContentRoster'),
  '| hasOwn provenance =', Object.hasOwn(bornEmpty, 'customContentProvenance'));
