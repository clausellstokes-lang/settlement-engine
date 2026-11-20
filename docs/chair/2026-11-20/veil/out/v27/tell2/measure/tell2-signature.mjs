// R3-TELL-2 unit 1 (VEIL-27's builder): THE SIGNATURE of a served page's criminal surface, exactly as ruling 54 (a) words
// it, ONE FUNCTION used for both pools (the nothing-hidden controls and the 92 towns, every engine and setting).
//
//   signatureOf(page, isHideableHouse) -> { sig, parts }
//
// It reads THE SERVED PAGE ALONE (what a reader holds): no stored document, no name from outside the page. A house or a
// power is criminal by what the page itself says of it (tell-surface.mjs :: namesOf over the page: a house criminal by its
// category / priorityCategory or hideable by cardVeil.js :: isHideableHouse; a power criminal by its category). Its parts:
//
//   f  FIELDS: each field of the criminal surface present ('p'), absent ('a'), empty ('e': [], {}, '') or null ('n'). AN
//      EMPTY LIST AND AN ABSENT FIELD DIFFER (t2sig-2: null is its own state; the drag sentence's empty form is null). The fields are FIELDS below: every path R3-TELL's search found
//      (out/v27/tell/search/search-paths.txt) outside a list, tagged switch, house or key (not by a criminal word alone),
//      plus the family lists' own containers.
//   k  ROW KEYS of the criminal rows a reader can see whole (criminal services, criminal powers): per key the set of its
//      states over the family's rows (p / e / a), so a row served without a key (a power's depth, a service's house)
//      differs from one served with it.
//   r  ROWS: each content family (tell-surface.mjs, kind C, attributed by the page's own names) none ('0'), one ('1') or
//      several ('n'). The families' presence items ('#absent', '#empty', '#list') are fields, not rows.
//   x  THE FOUR CROSS-FIELD BITS that carried the old tells:
//      x.powerNoHouse  a criminal power served with no criminal house served;
//      x.typesNoHouse  crime types served (a non-empty list) with no criminal house served;
//      x.svcNoHouse    a criminal services row whose `institution` names no house the page serves (absent, '(covert)',
//                      or a name not on the served roster);
//      x.sharesOff     the served income shares do not sum to their whole (|sum of percentage - 100| > 0.5; rows with no
//                      numeric percentage make it '?').
//      x.dragMarket    (ruling 58 3 (a), the FIFTH bit) the drag sentence's state against the SERVED market:
//                      '<drag>:<market>', drag = a (absent) / n (null) / e ('') / siege / stalls (the market line) / backrooms
//                      (the no-market line) / low (the two lesser lines) / other; market = 1 where market.js ::
//                      hasMarketInstitution holds on the SERVED houses, else 0. A stalls line beside no served market, or an
//                      empty line where no-market places print one, is a value the controls decide.
//
// sig is the canonical JSON of { f, k, r, x } (keys sorted): two pages share a signature iff every part is equal.
import { isRec } from '../../tell/measure/tell-common.mjs';
import { makeSurface, namesOf } from '../../tell/measure/tell-surface.mjs';

export const SIG_VERSION = 't2sig-2';

/** The criminal surface's fields outside any list (search-paths.txt, tagged switch / house / key), and the lists' containers. */
export const FIELDS = Object.freeze([
  'availableServices.criminal',
  'config.priorityCriminal',
  'conflicts',
  'economicState.compound',
  ...['hasBlackMarket', 'hasCriminalInst', 'hasGangInfra', 'hasSmuggling', 'hasThievesGuild'].map((k) => `economicState.compound.inst.${k}`),
  'economicState.compound.raw.criminal',
  'economicState.economicComplexity',
  'economicState.priorities.criminal',
  'economicState.incomeSources',
  'economicState.activeChains',
  'economicState.primaryImports',
  'economicState.safetyProfile',
  'economicState.safetyProfile.compound',
  ...['hasBlackMarket', 'hasCriminalInst', 'hasGangInfra', 'hasSmuggling', 'hasThievesGuild'].map((k) => `economicState.safetyProfile.compound.inst.${k}`),
  'economicState.safetyProfile.compound.raw.criminal',
  'economicState.safetyProfile.crimeTypes',
  'economicState.safetyProfile.criminalInstitutions',
  'economicState.safetyProfile.blackMarketCapture',
  'economicState.safetyProfile.economicDragDesc',
  'economicState.safetyProfile.flags',
  'economicState.safetyProfile.flags.crimeIsGovt',
  'economicState.safetyProfile.flags.stateCrime',
  'economicState.safetyProfile.flags.stateCrimeIntensity',
  'economicState.safetyProfile.guardEffectivenessDesc',
  'economicState.safetyProfile.plotHooks',
  'economicState.safetyProfile.safetyDesc',
  'history.currentTensions',
  'powerStructure.factions',
  'powerStructure.conflicts',
  'powerStructure.criminalCaptureState',
  'powerStructure.factionRelationships',
  'simulationTrace',
  'activeConditions',
  'relationships',
  ...['capture', 'ringNote', 'structure.detail', 'structure.glance', 'structure.sentence'].map((k) => `publicProse.blocks.defense:criminal.${k}`),
  ...['daily_life', 'economics', 'resources', 'services'].map((s) => `publicProse.blocks.economy:${s}.criminalLine`),
  ...['daily_life', 'resources', 'services'].map((s) => `publicProse.blocks.economy:${s}.incomeMix`),
  ...['detail', 'glance', 'sentence'].map((k) => `publicProse.blocks.economy:economics.incomeMix.${k}`),
  ...['captureReading', 'gmAdvisory', 'legitimacyReading', 'operationReading'].flatMap((r) => [r, ...['detail', 'glance', 'sentence'].map((k) => `${r}.${k}`)]).map((x) => `publicProse.blocks.power:desk.${x}`),
]);

/** The path's segments: a block site ('defense:criminal') is one segment; '.' separates. */
const at = (d, path) => path.split('.').reduce((v, k) => (isRec(v) ? v[k] : undefined), d);
const state = (v) => (v === undefined ? 'a' : v === null ? 'n' : (v === '' || (Array.isArray(v) && !v.length) || (isRec(v) && !Object.keys(v).length)) ? 'e' : 'p');
const bucket = (n) => (n === 0 ? '0' : n === 1 ? '1' : 'n');
const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
const canon = (v) => (Array.isArray(v) ? v.map(canon) : isRec(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])])) : v);
/** A family's presence items and the capture-state field item are fields, not rows. */
const isPresenceItem = (x) => x.startsWith('#') || x.startsWith('criminalCaptureState:');

const surfaceC = makeSurface(() => ({}));

/** The drag sentence's kind (safetyProfile.js's four lines, by their words). */
function dragKind(v) {
  if (v === undefined) return 'a'; if (v === null) return 'n'; if (v === '') return 'e'; if (typeof v !== 'string') return 'other';
  if (/siege/i.test(v)) return 'siege'; if (/stalls/.test(v)) return 'stalls'; if (/back rooms/.test(v)) return 'backrooms';
  if (/without a licence|between neighbours/.test(v)) return 'low'; return 'other';
}

/** Per key, the sorted set of its states (p / e / a) over the rows. */
function rowKeys(rows) {
  const keys = new Set(rows.flatMap((r) => Object.keys(r)));
  const out = {};
  for (const k of [...keys].sort()) out[k] = [...new Set(rows.map((r) => state(r[k])))].sort().join('');
  return out;
}

/**
 * THE SIGNATURE (ruling 54 (a)) of a served page.
 * @param {unknown} page the served document (a non-owner read's `data`)
 * @param {(h: unknown) => boolean} isHideableHouse cardVeil.js :: isHideableHouse, of the tree under test
 * @param {(houses: unknown[]) => boolean} hasMarketInstitution market.js :: hasMarketInstitution, of the tree under test
 * @returns {{ sig: string, parts: { f: Record<string,string>, k: Record<string,Record<string,string>>, r: Record<string,string>, x: Record<string,string> } }}
 */
export function signatureOf(page, isHideableHouse, hasMarketInstitution) {
  const d = isRec(page) ? page : {};
  const names = namesOf(isHideableHouse, d);
  const s = surfaceC(d, names);
  const f = {}; for (const p of FIELDS) f[p] = state(at(d, p));
  const r = {};
  for (const [fam, v] of Object.entries(s)) if (v.kind === 'C') r[fam] = bucket(v.items.filter((x) => !isPresenceItem(x)).length);
  const servedHouses = new Set(recs(d.institutions).map((h) => String(h.name ?? '')));
  const crimHouses = recs(d.institutions).filter((h) => names.H.has(String(h.name ?? '')));
  const powers = [...recs(d.powerStructure?.factions), ...recs(d.factions)].filter((p) => names.P.has(String(p.faction ?? p.name ?? '')) || String(p.category ?? '').toLowerCase() === 'criminal');
  const svc = recs(d.availableServices?.criminal);
  const k = { svc: rowKeys(svc), powers: rowKeys(powers) };
  const types = at(d, 'economicState.safetyProfile.crimeTypes');
  const inc = recs(at(d, 'economicState.incomeSources'));
  let sharesOff = '0';
  if (inc.length) {
    if (inc.some((x) => typeof x.percentage !== 'number')) sharesOff = '?';
    else sharesOff = Math.abs(inc.reduce((a, x) => a + x.percentage, 0) - 100) > 0.5 ? '1' : '0';
  }
  const x = {
    powerNoHouse: powers.length && !crimHouses.length ? '1' : '0',
    typesNoHouse: Array.isArray(types) && types.length && !crimHouses.length ? '1' : '0',
    svcNoHouse: svc.some((row) => typeof row.institution !== 'string' || !servedHouses.has(row.institution)) ? '1' : '0',
    sharesOff,
    dragMarket: `${dragKind(at(d, 'economicState.safetyProfile.economicDragDesc'))}:${hasMarketInstitution(recs(d.institutions)) ? 1 : 0}`,
  };
  const parts = canon({ f, k, r, x });
  return { sig: JSON.stringify(parts), parts };
}

/** The parts two signatures differ in, as 'f.<path>: a->b' lines (for the hand-back's examples). */
export function sigDiff(a, b) {
  const A = typeof a === 'string' ? JSON.parse(a) : a; const B = typeof b === 'string' ? JSON.parse(b) : b;
  const out = [];
  for (const part of ['f', 'k', 'r', 'x']) {
    const ka = A[part] || {}; const kb = B[part] || {};
    for (const key of [...new Set([...Object.keys(ka), ...Object.keys(kb)])].sort()) {
      const va = JSON.stringify(ka[key]); const vb = JSON.stringify(kb[key]);
      if (va !== vb) out.push(`${part}.${key}: ${va ?? '-'} -> ${vb ?? '-'}`);
    }
  }
  return out;
}
