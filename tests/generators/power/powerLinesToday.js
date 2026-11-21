/**
 * tests/generators/power/powerLinesToday.js — PEOPLE-2 builder B2: THE SEEDED TEXT TESTS RE-KEYED BY IDENTITY.
 *
 * `voicePowerLines` (src/data/powerLineVariants.js) varies a power's opening, its standing codas and the relation rows by
 * a keyed pick. A seeded test that reads a WRITER's choice (the ladder's line, its twin, a rung, a standing, a branch)
 * reads it here through `todayOf(record)`: every voiced wording is read back to the line it voices, its pool's own key
 * (an opening's text; a coda's words with the names it carries; a relation branch's line for its pair, written as
 * `factionDynamics.js :: computeFactionRelationships` writes it). The record is otherwise untouched, so every claim the
 * test makes about the writer is the claim it made before. The pools' own laws are `powerLinesVoiced.test.js`'s.
 */
import { CODA_POOLS, DESC_POOLS, RELATION_POOLS, RELATION_BRANCHES } from '../../../src/data/powerLineVariants.js';
import { powerNameAfterArticle, powerNameWithArticle, powerPossessive } from '../../../src/domain/display/powerSentenceName.js';
import { pluralPowerName } from '../../../src/domain/display/pluralPowerName.js';
import { courtHoldersOf } from '../../../src/domain/facts/defence.js';

const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const say = (n) => powerNameWithArticle(n);
const sayOf = (n) => `the ${powerPossessive(powerNameAfterArticle(n))}`;
const verb = (n, one, many) => (pluralPowerName(say(n)) ? many : one);
const opening = (t) => t.replace(/(^|[.!?]\s+)the /g, '$1The ');

/** every opening wording, longest first, with the line it voices */
const OPENINGS = Object.entries(DESC_POOLS).flatMap(([today, p]) => p.rows.map((r) => [r.text, today])).sort((a, b) => b[0].length - a[0].length);
/** a coda's own words as a template ($n for each name it carries) */
const codaToday = (re) => { let n = 0; return re.source.replace(/\((?:\[a-z \]\+\?|\.\+\?)\)/g, () => `$${++n}`).replace(/\\(.)/g, '$1'); };
const CODAS = CODA_POOLS.flatMap((c) => c.rows.map((r) => {
  const groups = [];
  const src = esc(r.text).replace(/\\\$(\d)/g, (_m, d) => { groups.push(Number(d)); return '(.+?)'; });
  return { re: new RegExp(src, 'i'), groups, today: codaToday(c.re) };
}));

/** @param {string} desc @returns {string} the description with its voiced opening and codas read back */
export function descToday(desc) {
  if (typeof desc !== 'string') return desc;
  let s = desc;
  for (const [v, t] of OPENINGS) if (s === v || s.startsWith(`${v} `)) { s = t + s.slice(v.length); break; }
  for (const c of CODAS) {
    const m = c.re.exec(s);
    if (!m) continue;
    /** @type {Record<number, string>} */ const vals = {};
    c.groups.forEach((g, i) => { vals[g] = String(m[i + 1]).replace(/^The /, 'the '); });
    s = s.slice(0, m.index) + c.today.replace(/\$(\d)/g, (x, d) => vals[Number(d)] ?? x) + s.slice(m.index + m[0].length);
  }
  return s;
}

/** today's line of each pooled branch, for its pair (the writer's own words) */
const TODAY = {
  'GM.sub+soldiers': (r) => `${say(r.Mil)} carries out what ${say(r.G)} decides. The soldiers enforce the law; they do not make it.`,
  'GM.sub': (r) => `${say(r.Mil)} carries out what ${say(r.G)} decides.`,
  'GM.sym': (r) => `${say(r.G)} gives the orders and ${say(r.Mil)} carries them out; each needs the other to stay strong.`,
  'GM.tense': (r) => `${say(r.Mil)} is now about as strong as ${say(r.G)}. The hall asks for ${sayOf(r.Mil)} agreement instead of giving orders, and less and less is decided without it.`,
  'GE.dep': (r) => `${say(r.G)} needs the taxes and loans of ${say(r.M)}, and ${say(r.M)} ${verb(r.M, 'needs', 'need')} ${say(r.G)} to enforce ${verb(r.M, 'its', 'their')} contracts and keep the law. Neither can afford to ruin the other.`,
  'GE.sub': (r) => `${say(r.M)} ${verb(r.M, 'works', 'work')} under the rules ${say(r.G)} sets, and ${verb(r.M, 'pays', 'pay')} for a hearing in the hall when it wants something.`,
  'GR.tense': (r) => `People take their marriages, inheritances and hard times to ${say(r.R)}, not to ${say(r.G)}, and the two do not agree on who decides what.`,
  'GR.dep': (r) => `${say(r.G)} holds the seat and collects the taxes; ${say(r.R)} ${verb(r.R, 'tells', 'tell')} people that ${sayOf(r.G)} rule is right and ordained. Each props up the other.`,
  'MC.vote-against': (r) => `${say(r.M)} and ${say(r.C)} vote together against ${say(r.L)}, then fight over who keeps the profit.`,
  'MC.vote': (r) => `${say(r.M)} and ${say(r.C)} vote together whenever trade is at stake, then fight over who keeps the profit.`,
  'MR.tense': (r) => `${say(r.M)} and ${say(r.R)} want the same households' money: tithes on one side, debts and contracts on the other. Church land exemptions and the church's rules on lending are a standing grievance with the merchants.`,
  'MR.dep': (r) => `The money of ${say(r.M)} pays for the charity of ${say(r.R)}, and the charity keeps the poor quiet. Each needs the other, and neither likes it.`,
  'NG.sub+merchant': (r) => `${say(r.N)} still ${verb(r.N, 'has', 'have')} ${verb(r.N, 'its', 'their')} titles, but merchant money and the hall's offices have taken most of ${verb(r.N, 'its', 'their')} power.`,
  'NG.sub': (r) => `${say(r.N)} still ${verb(r.N, 'has', 'have')} ${verb(r.N, 'its', 'their')} titles, but the hall's offices have taken most of ${verb(r.N, 'its', 'their')} power.`,
  'NG.dep': (r) => `${say(r.N)} ${verb(r.N, 'lives', 'live')} under the rule of ${say(r.G)} but ${verb(r.N, 'keeps', 'keep')} enough rights of ${verb(r.N, 'its', 'their')} own (${r.courts ? 'land, courts, levies' : 'land, levies'}) to bargain, not simply obey.`,
};
const RELATIONS = Object.entries(RELATION_POOLS).flatMap(([branch, rows]) => rows.map((row) => ({
  branch, re: new RegExp(`^${esc(row.text).replace(/\\\{[^}]*\\\}/g, '.+?')}$`, 'i'),
})));
const NOBLE = /noble|landed gentry|manor/i;

/**
 * @template T @param {T} record a born record @returns {T} the same record, its voiced power lines read back to the
 * lines they voice
 */
export function todayOf(record) {
  const ps = /** @type {any} */ (record)?.powerStructure;
  if (!ps) return record;
  for (const f of ps.factions || []) if (typeof f?.desc === 'string') f.desc = descToday(f.desc);
  const courts = courtHoldersOf(record).length > 0;
  for (const row of ps.factionRelationships || []) {
    if (!row || typeof row.narrative !== 'string' || !Array.isArray(row.pair)) continue;
    const hit = RELATIONS.find((p) => p.re.test(row.narrative));
    if (!hit) continue;
    const b = RELATION_BRANCHES.find((x) => x.id === hit.branch);
    const roles = { [b.roles[0]]: row.pair[0], [b.roles[1]]: row.pair[1], courts };
    if (hit.branch === 'MC.vote-against') roles.L = (ps.factions || []).find((f) => NOBLE.test(String(f.faction || '')) && !row.pair.includes(f.faction))?.faction;
    row.narrative = opening(TODAY[hit.branch](roles));
  }
  return record;
}
