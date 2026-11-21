// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/CAUSES-WIRING/paritySort.mjs "$PWD" > docs/chair/2026-11-20/content/page/build/CAUSES-WIRING/paritySort.out.txt 2>&1
// PAGE-9, THE PARITY SORT (the chair's ruling of 21:47 UTC, relayed by PAGE-9): on the veiled crime_wave pairs of
// parity.before.txt (toPublicSafe and toPublicSafe full, each through the gallery veil's default set), for each pair:
//   OWNER ROW    the owner's cause row (the wording's own row in data/tensionCauses.js; 'plain' where none holds);
//   DECLARES     the atoms that row's wordings declare (`needs`, `no <excludes>`), and for each whether it reads the same
//                on the served document as on the owner's (a declared atom that FLIPS is the declaration catching the veil);
//   READS HIDDEN whether the row's predicate (tensionCauseHolds.js) stops holding on the served document: it reads a fact
//                the owner can hide;
//   SERVED       the served sentence's row, and whether a place with NOTHING HIDDEN prints it: `member` when it is a plain
//                line (any place where no cause holds prints it) or a wording of a row that ALSO holds on the owner's
//                document (true of the town as it is); `SIGNATURE` when its row holds only on the served document (it
//                says what is true only because something is hidden).
// A FAULT is a row whose predicate reads a hideable fact (READS HIDDEN) while no atom it declares flips with it: the
// declaration does not carry what the predicate reads. Listed, never mended (PAGE-7's files).
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { toPublicSafe } = await import(`${L}/src/domain/display/publicSafe.js`);
const { applyVeil, resolveVeil, defaultVeilFor } = await import(`${L}/src/domain/display/galleryVeil.js`);
const { tensionCauseSentenceOf } = await import(`${L}/src/domain/display/tensionCause.js`);
const { TENSION_CAUSE_HOLDS } = await import(`${L}/src/domain/display/tensionCauseHolds.js`);
const { TENSION_CAUSES } = await import(`${L}/src/data/tensionCauses.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { atomHolds } = await import(`${L}/src/domain/facts/factVocabulary.js`);
await loadGenerationLawPayloads();

const KIND = 'crime_wave';
const table = TENSION_CAUSES[KIND];
/** @type {Map<string, string>} */ const rowOfText = new Map();
for (const c of table.causes) for (const w of c.wordings) rowOfText.set(w.text, c.id);
for (const w of table.plain) rowOfText.set(w.text, 'plain');
const byId = new Map(table.causes.map((c) => [c.id, c]));
/** @param {any} c */
const declaredOf = (c) => [...new Set(c.wordings.flatMap((/** @type {any} */ w) => [...(w.needs || []), ...(w.excludes || []).map((/** @type {string} */ a) => `no ${a}`)]))];
const veiled = (/** @type {any} */ pub) => applyVeil(pub, resolveVeil(defaultVeilFor(pub), null));
/** @type {Record<string, (t: any) => any>} */
const PROJ = { 'toPublicSafe + default veil': (t) => veiled(toPublicSafe(t)), 'toPublicSafe full + default veil': (t) => veiled(toPublicSafe(t, { full: true })) };

/** @type {Map<string, { pairs: number, readsHidden: number, declaredFlips: number, fault: number, member: number, signature: number, declares: string[], served: Map<string, number> }>} */
const rows = new Map();
let pairs = 0;
/** @param {string} key @param {any} doc */
function measure(key, doc) {
  const t = (doc?.history?.currentTensions || []).find((/** @type {any} */ x) => x?.type === KIND);
  if (!t) return;
  const own = tensionCauseSentenceOf(doc, t);
  const ownFacts = factsOf(doc);
  for (const [proj, fn] of Object.entries(PROJ)) {
    const served = fn(doc);
    const t2 = (served?.history?.currentTensions || []).find((/** @type {any} */ x) => x?.type === KIND);
    if (!t2) continue;
    const s = tensionCauseSentenceOf(served, t2);
    if (s === own) continue;
    pairs += 1;
    const sFacts = factsOf(served);
    const ownId = rowOfText.get(String(own)) || '(unknown)';
    const servedId = rowOfText.get(String(s)) || '(unknown)';
    const c = byId.get(ownId);
    const declares = c ? declaredOf(c) : [];
    const readsHidden = c ? !TENSION_CAUSE_HOLDS[c.holds](served, sFacts) : false;
    const flips = declares.filter((a) => {
      const atom = a.startsWith('no ') ? a.slice(3) : a;
      return atomHolds(atom, /** @type {any} */ (ownFacts)) !== atomHolds(atom, /** @type {any} */ (sFacts));
    });
    const sc = byId.get(servedId);
    const member = servedId === 'plain' || (!!sc && TENSION_CAUSE_HOLDS[sc.holds](doc, ownFacts));
    const fault = readsHidden && flips.length === 0;
    const r = rows.get(ownId) || { pairs: 0, readsHidden: 0, declaredFlips: 0, fault: 0, member: 0, signature: 0, declares, served: new Map() };
    r.pairs += 1; if (readsHidden) r.readsHidden += 1; if (flips.length) r.declaredFlips += 1; if (fault) r.fault += 1;
    if (member) r.member += 1; else r.signature += 1;
    r.served.set(servedId, (r.served.get(servedId) || 0) + 1);
    rows.set(ownId, r);
    console.log(`PAIR ${proj} ${key} owner-row ${ownId} declares ${JSON.stringify(declares)} flips ${JSON.stringify(flips)} reads-hidden ${readsHidden} served-row ${servedId} ${member ? 'member' : 'SIGNATURE'}${fault ? ' FAULT' : ''}`);
  }
}
for (const size of SIZES) for (let i = 0; i < 50; i++) {
  const seed = `hxd-${size}-${i}`;
  measure(seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }));
}
for (const row of censusPlan('r2')) measure(row.seed, generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }));
for (const [id, r] of [...rows].sort((a, b) => b[1].pairs - a[1].pairs)) {
  console.log(`ROW ${id} pairs ${r.pairs} declares ${JSON.stringify(r.declares)} reads-hidden ${r.readsHidden} declared-atom-flips ${r.declaredFlips} FAULT ${r.fault} served: member ${r.member} SIGNATURE ${r.signature} by row ${JSON.stringify(Object.fromEntries(r.served))}`);
}
console.log(`COUNTS pairs ${pairs}`);
// every crime_wave row whose predicate the veil can reach and that declares no atom at all (the static list)
for (const c of table.causes) console.log(`DECLARED ${c.id} hideable ${c.hideable} holds ${c.holds} declares ${JSON.stringify(declaredOf(c))}`);
