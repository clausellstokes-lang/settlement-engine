/**
 * domain/coherence/pageCensusFindings.js — THE RENDERED-DOSSIER ARM's checks (W2-A-LEAVES, 2026-11-12; the
 * second wave's charter §0 item 6 and the amendment of record 287: "the arm is born from the census's own
 * counter").
 *
 * One check per pattern of the second wave's census (`docs/chair/2026-11-12/SECOND-WAVE-CENSUS-2026-11-12.md`),
 * each the census counter's own test (`probes/SECOND-WAVE-CENSUS/count.mjs` on lane/second-wave-census-2026-11-12),
 * read over ONE rendered dossier: the owner's view, every group and sub-tab, every disclosure opened, one line
 * per block element per view (`views`: `'Systems/Economics'` → its lines). Two patterns are not rows: 15 (the
 * owner's recorded design: burials under Healing) and 21 (a style rule's text a browser never shows).
 *
 * The counter's regex vocabulary was the union of two trees' pools; this arm reads the counted tree's own
 * pools, so it counts the lines this tree can print. Every row's bar is ZERO; the register
 * (`scripts/census/page-census.register.json`) holds each row's two census columns and its count today,
 * shrink-only on the way to the bar.
 *
 * Pure: no randomness, no clock, no write. A row that throws is reported as a finding of its own.
 */
import { DOSSIER_STATE_PROSE_POWER } from '../../data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../data/dossierStateProse/economy.generated.js';
import { NOT_A_GOOD } from '../../data/tradeListDeclarations.js';
import { institutionDisplayName } from '../display/institutionDisplayName.js';

/** @typedef {Record<string, unknown>} Rec */
/** @typedef {Readonly<Record<string, ReadonlyArray<string>>>} Views */
/** @typedef {{ row: string, quote: string, detail: string }} CensusFinding */

/** @param {unknown} v @returns {Rec} */
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Rec} */ (v) : {});
/** @param {unknown} v @returns {unknown[]} */
const arr = (v) => (Array.isArray(v) ? v : []);
/** @param {unknown} v @returns {string} */
const s = (v) => (typeof v === 'string' ? v : v == null ? '' : String(v));

/**
 * THE ROWS: id → [the pattern, the reader's class]. Every row's bar is zero.
 * @type {Readonly<Record<string, readonly [string, 'GLANCE'|'SECOND'|'CROSS']>>}
 */
export const PAGE_CENSUS_ROWS = Object.freeze({
  P1a: ['1a the food verdict "only just" beside "grows more than it eats"', 'SECOND'],
  P1b: ['1b "a small margin" beside a quarter or more bought in', 'SECOND'],
  P2: ['2 the stores stated as two durations', 'CROSS'],
  P3any: ['3 magic relied upon or common, and no practitioner on the rolls', 'CROSS'],
  P4: ['4 "three powers stand almost level" beside a leader far ahead', 'SECOND'],
  P5a: ['5a the hall "free of the criminals" beside criminal money reaching the officials', 'SECOND'],
  P5b: ['5b "Diffuse, no gang" beside a criminal power', 'SECOND'],
  P6: ['6 a gap naming what the imports bring', 'CROSS'],
  P7a: ['7a two founders', 'GLANCE'],
  P7b: ['7b a harbour origin where no wharf stands', 'CROSS'],
  P8any: ['8 no church, and worship in the economy', 'CROSS'],
  P9: ['9 a weak beasts grade over settled-country text', 'GLANCE'],
  P10: ['10 "hold the gates" with no walls', 'SECOND'],
  P11: ['11 a flow card naming a resource the town lacks', 'CROSS'],
  F4: ['F4 an income line naming a working the roster lacks', 'CROSS'],
  P13: ['13 "… and go on." doubled', 'GLANCE'],
  P14: ['14 size words in small places', 'SECOND'],
  P16three: ['16a "the ruling three" over fewer', 'GLANCE'],
  P16powers: ['16b two "The Powers (n)" counts', 'GLANCE'],
  P17: ['17 non-goods produced locally', 'GLANCE'],
  P18: ['18 catalogue count ranges printed as names', 'GLANCE'],
  P19: ['19 a diagnostic printed as a tension', 'GLANCE'],
  P20: ['20 siege words outside a siege', 'SECOND'],
  NEW1: ['NEW-1 the governance label against the Defense verdict', 'SECOND'],
  NEW2: ['NEW-2 magic income, and no practitioner on the rolls', 'CROSS'],
});

// ── the tree's own pools, as the counter reads them ──────────────────────────────────────────
/** @param {string} t @returns {RegExp} */
const toRe = (t) => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-z]+\\\}/g, '.+?').replace(/\btown\b/g, '(?:thorp|hamlet|village|town|city|metropolis)'));
/**
 * @param {unknown} corpus a corpus leaf (block id → block) @param {(key: string) => boolean} want
 * @returns {Array<{ key: string, re: RegExp }>}
 */
function poolsOf(corpus, want) {
  /** @type {Array<{ key: string, re: RegExp }>} */ const out = [];
  for (const block of Object.values(obj(corpus))) {
    for (const [key, variants] of Object.entries(obj(obj(block).pools))) {
      if (want(key)) for (const v of arr(variants)) out.push({ key, re: toRe(s(obj(v).text)) });
    }
  }
  return out;
}
/** @type {Array<{ key: string, re: RegExp }> | null} */ let capturePools = null;
/** @type {Array<{ key: string, re: RegExp }> | null} */ let beastPools = null;
/** @type {Array<{ key: string, re: RegExp }> | null} */ let magicIncomePools = null;
/** @type {Array<{ key: string, re: RegExp }> | null} */ let houseIncomePools = null;
const pools = () => {
  capturePools ??= poolsOf(DOSSIER_STATE_PROSE_POWER, (k) => /^capture pressure/.test(k));
  beastPools ??= poolsOf(DOSSIER_STATE_PROSE_DEFENSE, (k) => /^Beasts & Monsters: /.test(k));
  magicIncomePools ??= poolsOf(DOSSIER_STATE_PROSE_ECONOMY, (k) => k === 'INCOME WEIGHT: the practice of magic');
  houseIncomePools ??= poolsOf(DOSSIER_STATE_PROSE_ECONOMY, (k) => k === 'INCOME WEIGHT: the religious houses');
  return { capturePools, beastPools, magicIncomePools, houseIncomePools };
};

// ── the counter's readings ───────────────────────────────────────────────────────────────────
/** @type {Readonly<Record<string, number>>} */
const WORD = Object.freeze({ a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 });
/** A stated duration in months, as the counter reads it. @param {string|undefined} phrase @returns {number|null} */
function months(phrase) {
  if (!phrase) return null;
  const ph = phrase.toLowerCase();
  if (/few weeks/.test(ph)) return 0.5;
  if (/about a month|^a month/.test(ph)) return 1;
  if (/more than two years/.test(ph)) return 24;
  if (/more than a year/.test(ph)) return 13;
  if (/about a year/.test(ph)) return 12;
  const m = ph.match(/(\w+) months/);
  if (!m) return null;
  return WORD[m[1]] ?? (Number.isFinite(Number(m[1])) ? Number(m[1]) : null);
}
/**
 * The census's page phrases that name a defence thing, held in one table: they match PRINTED sentences, never the
 * roster, so they are no reader of the defence facts (the defence-reader walker counts a name test written on its
 * call line).
 */
const PAGE_PHRASES = Object.freeze({
  holdTheGates: /hold the gates/,
  noPerimeterWalls: /No perimeter walls/,
  militaryFounder: /military|soldier|veteran|garrison|command|war\b/,
});
const FOUNDER = /^(was founded by|was settled by|was established by|was founded as|grew because a healer|grew because a famous navigator|was founded by religious|was built around a single family)/;
/** @param {string} t */
const founderKind = (t) => (PAGE_PHRASES.militaryFounder.test(t) ? 'military'
  : /religious|hermit|monk|priest|church|temple/.test(t) ? 'religious' : /healer/.test(t) ? 'healer'
    : /navigator|merchant|trade|consortium|coalition/.test(t) ? 'merchant' : /family|mill/.test(t) ? 'family'
      : /noble|lord|crown|royal|imperial|decree/.test(t) ? 'noble' : 'other');
const SMALL = new Set(['thorp', 'hamlet', 'village']);
const F4_TESTS = /** @type {const} */ ([
  ['ore', 'Local ore feeds the smithy', /smith|forge|foundr|smelt|metal|armou?r|weapon/],
  ['coal', 'Local coal fires the forges, ', /smith|forge|foundr|smelt|metal|armou?r|weapon/],
  ['quarry', 'Local quarry provides dressed stone', /quarr|mason|stone/],
  ['saw', 'managed felling and sawmilling', /sawmill|lumber|timber|carpent|wood|forest/],
]);

/**
 * Every census row this dossier carries.
 * @param {unknown} settlement the generated record
 * @param {Views} views the rendered dossier: `'Group/Tab'` → its lines, in order
 * @returns {CensusFinding[]}
 */
export function pageCensusFindings(settlement, views) {
  const rec = obj(settlement);
  const V = (/** @type {string} */ name) => views[name] || [];
  const E = V('Systems/Economics'); const D = V('Systems/Defense'); const PW = V('Systems/Power'); const M = V('Systems/Magic');
  const H = V('World/History'); const OV = V('Summary/Overview'); const NP = V('World/NPCs');
  const all = Object.values(views).flat();
  const econ = obj(rec.economicState);
  const fr = obj(obj(econ.foodSecurity).foodRecord);
  const { capturePools: cap, beastPools: beast, magicIncomePools: mag, houseIncomePools: houses } = pools();
  /** @type {CensusFinding[]} */ const out = [];
  /** @param {string} row @param {() => readonly [unknown, unknown] | null | undefined | false} test */
  const run = (row, test) => {
    try {
      const hit = test();
      if (hit) out.push({ row, quote: s(hit[0]).slice(0, 230), detail: s(hit[1]).slice(0, 230) });
    } catch (error) {
      out.push({ row, quote: '', detail: `instrument threw: ${s(error instanceof Error ? error.message : error)}` });
    }
  };
  const noArcane = D.some((l) => /No arcane practitioners on the rolls/.test(l));
  const roster = arr(rec.institutions).map((i) => s(obj(i).name).toLowerCase());

  run('P1a', () => {
    const onlyJust = E.find((l) => /is fed, but only just/.test(l)); const grows = E.find((l) => /grows (a little more|more|far more) than it eats/.test(l));
    return onlyJust && grows ? [onlyJust, grows] : null;
  });
  run('P1b', () => {
    const margin = E.find((l) => /feeds itself with a small margin/.test(l));
    return margin && Number(fr.normalImportPct) >= 25 ? [margin, `record normalImportPct ${s(fr.normalImportPct)}`] : null;
  });
  run('P2', () => {
    const st = E.find((l) => /^No granary;|^Stores: a granary/.test(l)); const fe = D.find((l) => /^Food endurance:/.test(l));
    if (!st || !fe) return null;
    const m1 = st.match(/^No granary; (.+?) in household stores|^No granary; (a few weeks) in the larder|^Stores: a granary,? (?:of )?(.+?)(?: of grain| that)/);
    const a = months(m1 ? m1[1] || m1[2] || m1[3] : undefined); const m2 = fe.match(/for (.+?) at full rations/); const b = m2 ? months(m2[1]) : null;
    return a != null && b != null && a !== b ? [st, fe] : null;
  });
  run('P3any', () => {
    const relLine = M.find((l) => /^Reliance on magic: /.test(l)) || ''; const relied = /Relied upon|Integral/i.test(relLine);
    const avail = (M.find((l) => /^Availability/.test(l)) || '').replace('Availability', '');
    return noArcane && (relied || /common|broad|pervasive/.test(avail)) ? [relLine || avail, 'No arcane practitioners on the rolls'] : null;
  });
  run('P4', () => {
    const level = PW.find((l) => /Three powers stand almost level/.test(l));
    if (!level) return null;
    const f = arr(obj(rec.powerStructure).factions).map((x) => Number(obj(x).power)).sort((a, b) => b - a);
    return f.length >= 3 && f[0] - f[2] > 10 ? [level.slice(level.indexOf('Three')).slice(0, 90), `powers ${f.join('/')}`] : null;
  });
  run('P5a', () => {
    const free = PW.find((l) => /^Free of the criminals/.test(l)); const pressure = PW.find((l) => cap.some((p) => p.re.test(l)));
    return free && pressure ? [free.slice(0, 60), pressure] : null;
  });
  run('P5b', () => {
    const diffuse = D.find((l) => /Criminal structure: Diffuse/i.test(l) || /books record no gang, guild or racket/.test(l));
    const gangPower = PW.find((l) => /^Thieves' Guild|^Rival gangs|^Street gang|Thieves' Guild \(\d+\)|CriminalDominant|CriminalStrong|CriminalMinor|CriminalMajor/.test(l));
    const gangDefense = D.find((l) => /^Underworld: /.test(l));
    return diffuse && (gangPower || gangDefense) ? [diffuse, `Power: ${gangPower || ''} / Defense: ${gangDefense || ''}`] : null;
  });
  run('P6', () => {
    const at = E.indexOf('Imports'); const imports = (at >= 0 ? E[at + 1] || '' : '').toLowerCase();
    for (const l of V('Systems/Resources')) {
      const m = l.match(/^No (.+?) (?:reaches|reach) the (.+)\.$/); const m2 = l.match(/exists but lacks access to (.+?)\.?$/);
      const named = m ? m[1] : m2 ? m2[1] : null;
      if (named && named.split(/, | or | and /).some((n) => imports.includes(n.toLowerCase()))) return [l, `Imports: ${E[at + 1]}`];
    }
    return null;
  });
  const origin = (H.find((l) => /^Origin:/.test(l)) || '').replace('Origin:', '');
  run('P7a', () => {
    const by = (H.find((l) => /^Founded by:/.test(l)) || '').replace('Founded by:', '');
    return origin && by && FOUNDER.test(origin) && !/^was founded as/.test(origin) && founderKind(origin) !== founderKind(by) ? [`Origin: ${origin}`, `Founded by: ${by}`] : null;
  });
  run('P7b', () => {
    const first = OV[OV.indexOf('Settlement Origin▲') + 1] || '';
    return /wharf/.test(first) && /trading port|maritime hub|naval base|natural harbour|shipwright/.test(origin) ? [first, `Origin: ${origin}`] : null;
  });
  run('P8any', () => {
    const noChurch = all.find((l) => /has no church of its own/.test(l));
    if (!noChurch) return null;
    const income = E.find((l) => houses.some((p) => p.re.test(l)));
    const at = E.findIndex((l) => /^Faith & Worship/.test(l));
    const flow = at >= 0 && /Running|Operational/.test(E[at]) ? `${E[at]} · ${E[at + 2] || ''}` : null;
    return income || flow ? [income || flow, noChurch] : null;
  });
  run('P9', () => {
    const at = D.indexOf('Beasts & Monsters');
    if (at < 0) return null;
    const rating = (D[at + 1] || '').replace(/[▲▼]/g, ''); const text = D[at + 2] || ''; const p = beast.find((x) => x.re.test(text));
    return p && /settled/.test(p.key) && /Critical|Weak/.test(rating) ? [`Beasts & Monsters: ${rating}`, `[${p.key}] ${text}`] : null;
  });
  run('P10', () => {
    const gates = all.find((l) => PAGE_PHRASES.holdTheGates.test(l));
    const unwalled = all.some((l) => PAGE_PHRASES.noPerimeterWalls.test(l));
    return gates && unwalled ? [gates, 'Unfortified. No perimeter walls.'] : null;
  });
  run('P11', () => {
    const near = new Set(arr(obj(rec.config).nearbyResources).map(s));
    for (const chain of arr(econ.activeChains).map(obj)) {
      const resource = s(chain.resource); const key = s(chain.resourceKey);
      if (!resource || !key || near.has(key)) continue;
      const l = E.find((x) => x === resource || x.startsWith(`${resource} ·`) || x.startsWith(`${resource} (`));
      if (l) return [`${s(chain.label)}: From ${l}`, `nearbyResources: ${[...near].join(', ')}`];
    }
    return null;
  });
  run('F4', () => {
    for (const [kind, needle, re] of F4_TESTS) {
      const l = E.find((x) => x.includes(needle));
      if (l && !roster.some((n) => re.test(n))) return [l.slice(0, 120), `${kind}: the roster has none matching ${re}`];
    }
    return null;
  });
  run('P13', () => {
    const l = all.find((x) => /more slowly and less comfortably and go on\./.test(x));
    return l ? [l, ''] : null;
  });
  run('P14', () => {
    if (!SMALL.has(s(rec.tier))) return null;
    const words = all.find((l) => /urban food supply|dense populations/.test(l));
    const districts = all.find((l) => l !== OV[1] && /\bdistricts?\b|whole quarters/i.test(l) && !/\(district\)/.test(l));
    return words || districts ? [words || districts, `tier ${s(rec.tier)}`] : null;
  });
  run('P16three', () => {
    const at = PW.findIndex((l) => /^The ruling three of/.test(l));
    if (at < 0) return null;
    const n = ['Head ·', 'Second ·', 'Third ·'].filter((h, i) => (PW[at + 1 + i] || '').startsWith(h)).length;
    return n < 3 ? [PW[at], PW.slice(at + 1, at + 4).join(' | ')] : null;
  });
  run('P16powers', () => {
    const counts = PW.filter((l) => /^The Powers \(\d+\)/.test(l));
    return counts.length >= 2 && new Set(counts).size > 1 ? [counts[0], counts[1]] : null;
  });
  run('P17', () => {
    const at = E.indexOf('Produced locally'); const produced = at >= 0 ? E[at + 1] || '' : '';
    const named = NOT_A_GOOD.map((x) => s(x).toLowerCase()).filter((x) => produced.toLowerCase().includes(x));
    const access = produced.match(/[a-z ]*access|[A-Z][a-z]+ services/g) || [];
    return named.length || access.length ? [`Produced locally: ${produced}`, [...new Set([...named, ...access])].join(', ')] : null;
  });
  run('P18', () => {
    const npc = NP.find((l) => /\((\d+)-(\d+)\)/.test(l));
    if (npc) return [npc, 'a count range on the people page'];
    for (const chain of arr(econ.activeChains).map(obj)) {
      if (arr(chain.processingInstitutions).some((p) => /\(\d+-\d+\)/.test(institutionDisplayName(/** @type {string} */ (p))))) return [s(chain.label), 'a count range through the display name'];
    }
    return null;
  });
  run('P19', () => {
    const l = all.find((x) => /operating on stockpiles only/.test(x));
    return l ? [l, ''] : null;
  });
  run('P20', () => {
    const l = D.find((x) => /under siege the outlying fields are lost/i.test(x));
    return l && !obj(econ.foodSecurity).hasSiege ? [l.slice(0, 120), 'not besieged'] : null;
  });
  run('NEW1', () => {
    const head = OV[1] || ''; const at = OV.indexOf('Defense'); const verdict = at >= 0 ? OV[at + 1] || '' : '';
    if (/underdefended/.test(head) && /^(Defensible|Well-defended|Fortress)$/.test(verdict)) return [head.slice(head.lastIndexOf('·')), `Defense ${verdict}`];
    if (/strong military presence/.test(head) && /^(Undefended|Lightly defended|Vulnerable)$/.test(verdict)) return [head.slice(head.lastIndexOf('·')), `Defense ${verdict}`];
    return null;
  });
  run('NEW2', () => {
    const l = E.find((x) => mag.some((p) => p.re.test(x)));
    return l && noArcane ? [l, 'No arcane practitioners on the rolls'] : null;
  });
  return out;
}

/**
 * The rendered dossier's views from a battery's surfaces: a surface whose id is `'Group/Tab'` is one view
 * (its text split into lines); every other surface is not a view and is not read here.
 * @param {Readonly<Record<string, string>>} surfaces
 * @returns {Views}
 */
export function viewsOfSurfaces(surfaces) {
  /** @type {Record<string, string[]>} */ const out = {};
  for (const [id, text] of Object.entries(surfaces || {})) if (id.includes('/')) out[id] = s(text).split('\n');
  return out;
}
