// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/SIDES/parity.mjs "$PWD" > docs/chair/2026-11-20/content/page/build/SIDES/parity.out.txt 2>&1
// PAGE-9 SIDES, the PAGE-9 amendment's PARITY ARM over the born pools: the chair's 300 (`hxd-<size>-<i>`, DEFAULT_CONFIG) and
// the census's 720 (`censusPlan('r2')` + `configOf`), the births of build/CARD/bornHash.mjs. For every tension the served
// document still holds (matched by its kind: a town draws each kind once), `tensionSidesShown(owner, t)` against
// `tensionSidesShown(served, t')` for EACH projection a non-owner page is given:
//   toPublicSafe (the gallery/public default; dossierSearch's player view), toPublicSafe full (gallery_share_dm),
//   publicVeiledRecordOf (the audience-gated readers' record), and each of the first two through the gallery veil's
//   default set (galleryVeil.js :: projectShareVeil's applyVeil(resolveVeil(defaultVeilFor(pub)))).
// ALLOWED: a side differs only where the owner's side names a power (stored as that power's name, or a `named` fill) that
// the served roster lacks, and the served side is then table words (a row's own words or a `without`), never a name of the
// owner's roster. ANY OTHER DIFFERENCE is printed `STOP` (the brief: it stops the builder).
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { toPublicSafe, publicVeiledRecordOf } = await import(`${L}/src/domain/display/publicSafe.js`);
const { applyVeil, resolveVeil, defaultVeilFor } = await import(`${L}/src/domain/display/galleryVeil.js`);
const { tensionSidesShown } = await import(`${L}/src/domain/display/tensionShown.js`);
const { TENSION_SIDE_MEANINGS } = await import(`${L}/src/data/tensionSideMeanings.js`);
const { powerNameWithArticle } = await import(`${L}/src/data/people/powerSentenceName.js`);

await loadGenerationLawPayloads();
const veiled = (/** @type {any} */ pub) => applyVeil(pub, resolveVeil(defaultVeilFor(pub), null));
/** @type {Record<string, (t: any) => any>} */
const PROJECTIONS = {
  'toPublicSafe': (t) => toPublicSafe(t),
  'toPublicSafe full': (t) => toPublicSafe(t, { full: true }),
  'publicVeiledRecordOf': (t) => publicVeiledRecordOf(t),
  'toPublicSafe + default veil': (t) => veiled(toPublicSafe(t)),
  'toPublicSafe full + default veil': (t) => veiled(toPublicSafe(t, { full: true })),
};
const tableWords = new Set(Object.entries(TENSION_SIDE_MEANINGS).flatMap(([k, r]) => [k, ...(typeof r.without === 'string' ? [r.without] : [])])
  .map((s) => s.toLowerCase()));
const rosterNames = (/** @type {any} */ d) => (d?.powerStructure?.factions || []).map((/** @type {any} */ f) => f?.faction).filter((/** @type {unknown} */ n) => typeof n === 'string' && n);
/** the owner's powers a shown side names @param {string} side @param {string[]} names */
const namedIn = (side, names) => names.filter((n) => side === n || side.includes(powerNameWithArticle(n, true)) || side.includes(powerNameWithArticle(n, false)));

const c = { towns: 0, tensions: 0, pairs: 0, sides: 0, sameAll: 0, allowed: 0, stop: 0, tensionsGone: 0, ownerNamedFills: 0, ownerChanged: 0 };
/** @type {Record<string, { pairs: number, allowed: number, stop: number, gone: number }>} */
const byProj = Object.fromEntries(Object.keys(PROJECTIONS).map((k) => [k, { pairs: 0, allowed: 0, stop: 0, gone: 0 }]));
/** @type {Map<string, number>} */ const changes = new Map();
/** @param {string} key @param {any} doc */
function measure(key, doc) {
  c.towns += 1;
  const ownerNames = rosterNames(doc);
  const ts = doc?.history?.currentTensions || [];
  for (const t of ts) {
    c.tensions += 1;
    const o = tensionSidesShown(doc, t);
    const stored = (t.factions || []).map(String);
    if (JSON.stringify(o) !== JSON.stringify(stored.map((s) => s.charAt(0).toUpperCase() + s.slice(1)))) c.ownerChanged += 1;
    stored.forEach((s, i) => { const k = `${t.type} :: ${JSON.stringify(s)} -> ${o[i] === undefined ? '(dropped)' : JSON.stringify(namedIn(o[i], ownerNames).length && !ownerNames.includes(o[i]) ? o[i].replace(namedIn(o[i], ownerNames).map((n) => powerNameWithArticle(n, true)).find((x) => o[i].includes(x)) || '', '<NAME>') : (ownerNames.includes(o[i]) ? '<STORED NAME>' : o[i]))}`; changes.set(k, (changes.get(k) || 0) + 1); });
    for (const side of o) if (!ownerNames.includes(side) && namedIn(side, ownerNames).length) c.ownerNamedFills += 1;
  }
  for (const [proj, fn] of Object.entries(PROJECTIONS)) {
    const served = fn(doc);
    const servedNames = rosterNames(served);
    const sts = served?.history?.currentTensions || [];
    for (const t of ts) {
      const t2 = sts.find((/** @type {any} */ x) => x?.type === t.type);
      if (!t2) { c.tensionsGone += 1; byProj[proj].gone += 1; continue; }
      c.pairs += 1; byProj[proj].pairs += 1;
      const o = tensionSidesShown(doc, t); const s = tensionSidesShown(served, t2);
      if (JSON.stringify(o) === JSON.stringify(s)) { c.sameAll += 1; c.sides += o.length; continue; }
      let ok = o.length === s.length;
      if (ok) o.forEach((side, i) => {
        c.sides += 1;
        if (side === s[i]) return;
        const meant = namedIn(side, ownerNames);
        const lacking = meant.length > 0 && meant.every((n) => !servedNames.includes(n));
        const plain = tableWords.has(s[i].toLowerCase()) && namedIn(s[i], ownerNames).length === 0;
        if (!(lacking && plain)) ok = false;
      });
      if (ok) { c.allowed += 1; byProj[proj].allowed += 1; console.log(`ALLOWED ${proj} ${key} ${t.type} owner ${JSON.stringify(o)} served ${JSON.stringify(s)}`); }
      else { c.stop += 1; byProj[proj].stop += 1; console.log(`STOP ${proj} ${key} ${t.type} owner ${JSON.stringify(o)} served ${JSON.stringify(s)}`); }
    }
  }
}
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  measure(seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }));
}
for (const row of censusPlan('r2')) measure(row.seed, generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }));
for (const [k, n] of [...changes].sort((a, b) => b[1] - a[1])) console.log(`SHOWN ${String(n).padStart(5)} ${k}`);
for (const [p, v] of Object.entries(byProj)) console.log(`PROJECTION ${p} ${JSON.stringify(v)}`);
console.log(`COUNTS ${JSON.stringify(c)}`);
