// R5C4: E97 (2) THE COUNT and E97 (3) THE THIRD-COPY SCAN, before the first edit, on R5C2's pool (480 births: r5c2-m3-*,
// r5c2-m3b-*). (a) stored pressureSentence !== stored recentConflict; (b) of them, those naming a power or a house by the
// lane's fold (gallerySecondHomes.js :: buildNameSearch over every stored power and house name), by the writer's branch
// (narrativeGenerator.js :: generatePressureSentence) where it can be told; (c) on hiding reads (the tell instrument's
// settings: own, g:<bits>, allOpen, off, shown; Reveal DM off and on; the twin), how many of (b) SERVE a pressureSentence
// naming a WITHHELD power or house (a stored power neither served list names; a stored house the served roster lacks), the
// served names the search's open names. THE SCAN: every string leaf of every stored record holding the stored
// recentConflict as a substring, other than the key itself.
const W = '/home/user/wt/r5c/src';
const { generateSettlementPipeline } = await import(`${W}/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${W}/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${W}/store/configSlice.js`);
const { isHideableHouse } = await import(`${W}/domain/people/cardVeil.js`);
const veil = await import(`${W}/domain/display/galleryVeil.js`);
const sw = await import(`${W}/domain/display/criminalVeilSwitch.js`);
const { buildNameSearch } = await import(`${W}/domain/display/gallerySecondHomes.js`);
const { resolvePrimaryStress } = await import(`${W}/generators/stressPriority.js`);
const { PRESSURE_SENTENCES } = await import(`${W}/generators/narrativeText.js`);
const BIRTH_DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
await loadGenerationLawPayloads();
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const arr = (v) => (Array.isArray(v) ? v : []);
const clone = (v) => JSON.parse(JSON.stringify(v));
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const CRIM = OPEN.slice(0, 3);
const opened = (as) => as.map((a) => ({ address: a, hidden: false }));
const THORP = ['A dispute over grazing rights', 'The harvest was thin this year.', 'A family moved away last spring.', 'The question of who tends the shared fields', 'Two families have been in a quiet feud', 'The last frost came late', 'A stranger passed through a month ago'];
function settingsOf(stored, dm) {
  const pub = veil.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: null });
  const model = veil.curateModelFor(pub, []);
  const present = sw.presentCriminalGroupings(pub);
  const out = { own: opened(OPEN) };
  for (let b = 0; b < 7; b += 1) { const bits = [4, 2, 1].map((x) => ((b & x) ? '1' : '0')).join(''); out[`g:${bits}`] = opened(['tab:plot_hooks', ...CRIM.filter((_g, i) => bits[i] === '1')]); }
  out.allOpen = sw.setCriminalVeil(opened(OPEN), model.defaults, false, present, model).filter((d) => !String(d.address).startsWith('card:institution:'));
  out.off = sw.setCriminalVeil(opened(OPEN), model.defaults, true, present, model);
  const idOf = (h) => veil.CARD_KINDS.institution.idOf(h);
  out.shown = opened([...OPEN, ...arr(stored.institutions).filter((h) => isHideableHouse(h)).flatMap((h) => [`card:institution:${idOf(h)}`, ...['description', 'function', 'services', 'people'].map((f) => `field:institution:${idOf(h)}:${f}`)])]);
  return out;
}
const listsOf = (x) => [...arr(x?.powerStructure?.factions), ...arr(x?.factions)].filter(isRec);
const pNames = (f) => [f.faction, f.name].filter((v) => typeof v === 'string' && v);
function withheldOf(stored, d) {
  const served = new Set(listsOf(d).flatMap(pNames));
  const sh = new Set(arr(d?.institutions).filter(isRec).map((h) => h.name));
  const out = new Set();
  for (const f of listsOf(stored)) { const n = pNames(f); if (n.length && !n.some((x) => served.has(x))) n.forEach((x) => out.add(x)); }
  for (const h of arr(stored.institutions).filter(isRec)) if (typeof h.name === 'string' && h.name && !sh.has(h.name)) out.add(h.name);
  return [...out];
}
const servedNamesOf = (d) => [...new Set([...listsOf(d).flatMap(pNames), ...arr(d?.institutions).filter(isRec).map((h) => h.name)].filter((v) => typeof v === 'string' && v))];
function namesWithheld(text, withheld, d) {
  if (typeof text !== 'string' || text === '' || !withheld.length) return false;
  const opens = servedNamesOf(d);
  const bare = buildNameSearch(withheld, []); const search = buildNameSearch(withheld, opens);
  if (!bare || !bare.hit(text)) return false;
  if (search && search.hit(text)) return true;
  const holders = opens.filter((n) => text.includes(n) && bare.hit(n));
  return !holders.length || bare.hit(holders.reduce((x, n) => x.split(n).join(' '), text));
}
function branchOf(t, ps) {
  if (typeof ps !== 'string') return 'null';
  const stresses = (t.stress ? (Array.isArray(t.stress) ? t.stress : [t.stress]) : []).map((s) => s?.type);
  const st = resolvePrimaryStress(stresses);
  if (st && PRESSURE_SENTENCES[st]) return 'stress';
  if (isRec(t.prominentRelationship) && t.prominentRelationship.phrasing === ps) return 'tie';
  if (THORP.some((x) => ps.startsWith(x))) return 'thorp';
  return 'succession (by elimination)';
}
function leaves(v, path, out) {
  if (typeof v === 'string') out.push([path, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => leaves(x, `${path}[${i}]`, out));
  else if (isRec(v)) for (const [k, x] of Object.entries(v)) leaves(x, path ? `${path}.${k}` : k, out);
  return out;
}
const T = { births: 0, a: 0, b: 0, bBranch: {}, aBranch: {}, c: 0, cReads: 0, cBranch: {}, scanBirths: 0, scanPaths: {}, thirdCopies: [] };
const cEx = [];
for (const prefix of ['r5c2-m3', 'r5c2-m3b']) for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (let i = 0; i < 40; i += 1) {
  const seed = `${prefix}-${size}-${i}`;
  const t = clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size }), null, { seed, customContent: {} }));
  T.births += 1;
  const S = t.powerStructure?.recentConflict;
  if (typeof S === 'string' && S !== '') {
    T.scanBirths += 1;
    for (const [p, v] of leaves(t, '', [])) {
      if (p === 'powerStructure.recentConflict' || !v.includes(S)) continue;
      const k = p.replace(/\[\d+\]/g, '[]'); T.scanPaths[k] = (T.scanPaths[k] || 0) + 1;
      if (k !== 'pressureSentence') T.thirdCopies.push(`${seed} ${p}`);
    }
  }
  const ps = t.pressureSentence;
  if (ps === S) continue;
  T.a += 1;
  const br = branchOf(t, ps); T.aBranch[br] = (T.aBranch[br] || 0) + 1;
  const allNames = [...new Set([...listsOf(t).flatMap(pNames), ...arr(t.institutions).filter(isRec).map((h) => h.name).filter((v) => typeof v === 'string' && v)])];
  const all = buildNameSearch(allNames, []);
  if (!(typeof ps === 'string' && all && all.hit(ps))) continue;
  T.b += 1; T.bBranch[br] = (T.bBranch[br] || 0) + 1;
  const hides = arr(t.institutions).some((h) => isRec(h) && isHideableHouse(h)) || listsOf(t).some((f) => f.hidden === true);
  if (!hides) continue;
  let hit = false;
  for (const dm of [false, true]) for (const [setting, deltas] of Object.entries(settingsOf(t, dm))) {
    const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    const d = veil.projectShareVeil(veil.galleryPayloadFor(clone(t), { shareDm: dm, memberOverrides: ov }), ov);
    if (typeof d.pressureSentence !== 'string') continue;
    const wh = withheldOf(t, d);
    if (namesWithheld(d.pressureSentence, wh, d)) { hit = true; T.cReads += 1; if (cEx.length < 12) cEx.push(`${seed} ${setting} dm=${dm} [${br}] withheld ${JSON.stringify(wh.filter((w) => buildNameSearch([w], []).hit(d.pressureSentence)))}: ${JSON.stringify(d.pressureSentence).slice(0, 170)}`); }
  }
  if (hit) { T.c += 1; T.cBranch[br] = (T.cBranch[br] || 0) + 1; }
}
console.log(JSON.stringify(T, null, 1));
for (const e of cEx) console.log(' ', e);
