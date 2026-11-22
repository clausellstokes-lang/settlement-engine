/**
 * THE CAUSES' ATOM WALKER (PAGE-12, CAUSES-PARITY-2 step W; the chair's (1); a GUARD: its basename carries `walker` and it
 * owes its row in `scripts/mutation-coverage-manifest.json`).
 *
 * THE LAW (the chair's 21:47; COMMON-RULES 5 and 14 (e)): a cause's predicate reads (a) facts every read serves, or (b) a
 * fact a shared read can withhold THROUGH A DECLARED ATOM, so that a served document that has lost the fact prints what a
 * place without it prints. For EVERY row of `TENSION_CAUSES`, this walker:
 *   1. FINDS THE FACTS ITS PREDICATE READS, from the source of `tensionCauseHolds.js` (the predicate's own text, and the
 *      text of each module helper it calls): a house group (`causeHouses.js :: causeHouseStands`), an institution kind
 *      (`institutions.js :: hasInstitution`), a `factsOf` field (`facts.<name>`, `orderForce.js` among them), the roster of
 *      powers (`crimeSignalOf`, `governingFactionOf`, `powerStructure.factions`), the legitimacy's label, the timeline. A read
 *      it cannot name (an unknown call, an unknown `record` path, an unclassified `facts` field) REDS: nothing is waved through.
 *   2. SAYS WHICH OF THEM A SHARED READ CAN WITHHOLD: a house group any of whose catalogue houses `cardVeil.js ::
 *      isHideableHouse` hides (COMPUTED from `data/institutionalCatalog.js`, never listed); the powers' roster (a row
 *      `isVeiledPower` hides leaves it); a fact about crime (rule 5's crime clause) or about the powers, by the table below.
 *   3. IS RED where a predicate reads a withholdable fact while SOME WORDING of that row declares no atom answering it. An
 *      atom ANSWERS a fact when the vocabulary's own `atomHolds` flips with that fact alone (a stub of the facts in which
 *      only it moves); the powers' roster has no atom in the vocabulary, so a row that reads it is never answered.
 * A red row outside the units that cure it sits ONLY on THE EXEMPTION LIST below, each entry commented, for the chair.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TENSION_CAUSES } from '../../../src/data/tensionCauses.js';
import { TENSION_CAUSE_HOLDS } from '../../../src/domain/display/tensionCauseHolds.js';
import { CAUSE_HOUSES } from '../../../src/domain/facts/causeHouses.js';
import { institutionalCatalog } from '../../../src/data/institutionalCatalog.js';
import { isHideableHouse, isVeiledPower } from '../../../src/domain/people/cardVeil.js';
import { atomHolds, LAW_ORDER_RUNGS } from '../../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { tensionCauseSentenceOf } from '../../../src/domain/display/tensionCause.js';
import { toPublicSafe } from '../../../src/domain/display/publicSafe.js';
import { applyVeil, defaultVeilFor, resolveVeil } from '../../../src/domain/display/galleryVeil.js';
import { pickVariant } from '../../../src/kernel/proseHash.js';

const SRC = readFileSync(new URL('../../../src/domain/display/tensionCauseHolds.js', import.meta.url), 'utf8');

/** the module's helpers (`const <name> = (...) => ...;`), by name: their text joins a predicate that calls them */
const HELPERS = Object.fromEntries([...SRC.matchAll(/^const (\w+) = (\([\s\S]*?);\n(?=\n|\/\*\*|\/\/|export|const)/gm)].map((m) => [m[1], m[2]]));

/**
 * each predicate's own SOURCE TEXT, by key, read off the module's `TENSION_CAUSE_HOLDS` literal (never `Function#toString`:
 * the test transform rewrites an imported call as `(0, __vi_import_n__.name)(…)`)
 */
const PREDICATES = (() => {
  const start = SRC.indexOf('export const TENSION_CAUSE_HOLDS = Object.freeze({');
  const body = SRC.slice(start, SRC.indexOf('\n});', start));
  /** @type {Record<string, string>} */ const out = {};
  let key = '';
  for (const line of body.split('\n').slice(1)) {
    const m = /^ {2}(\w+): \(/.exec(line);
    if (m) { key = m[1]; out[key] = line.slice(m[0].length - 1); } else if (key && /^ {4}/.test(line)) out[key] += `\n${line}`; else key = '';
  }
  return out;
})();

/** the calls a predicate may make that read nothing of the place by themselves */
const PLAIN_CALLS = new Set(['Array.isArray', 'includes', 'some', 'String', 'filter', 'map']);

/**
 * THE `factsOf` FIELDS A PREDICATE MAY READ, each classified. `withheld`: a fact about crime (rule 5) or about the powers,
 * which a shared read can withhold, with the stubs of the facts on which its answering atom must flip; `served`: read
 * from what every read serves (the reason given).
 * @type {Record<string, { withheld: string, stubs: Array<Record<string, unknown>> } | { served: string }>}
 */
const FACT_FIELDS = {
  rivalRings: { withheld: 'crime: the rings the criminal structure key reads (rivalRings.js)', stubs: [{ rivalRings: true }, { rivalRings: false }] },
  lawBand: { withheld: 'crime: the law band of the safety profile (lawBand.js)', stubs: LAW_ORDER_RUNGS.map((b) => ({ lawBand: b })) },
  rivalPower: { withheld: 'the powers: a power not the governing one at Significant or above (rivalPower.js)', stubs: [{ rivalPower: true }, { rivalPower: false }] },
  seatOutranked: { withheld: 'the powers: a power not the governing one above the seat (seatOutranked.js)', stubs: [{ seatOutranked: true }, { seatOutranked: false }] },
  orderForce: { served: 'the garrison, watch and militia on the live roster (no hideable house) and the pay (orderForce.js)' },
  defence: { served: 'the defence houses on the live roster (no hideable house)' },
  rulerKind: { served: "the government's label (rulerKind.js)" },
  water: { served: 'the water the place stands on' },
  route: { served: 'the trade route' },
  crisis: { served: 'the crisis home (crisisKind.js)' },
  warState: { served: 'the war state' },
  famine: { served: 'the starving rule' },
  leadingSourceSpent: { served: 'the food sources' },
  failedSource: { served: 'the food sources' },
  prosperity: { served: "the economy's prosperity label" },
  legitimacyCrisis: { served: 'the public legitimacy band' },
  monsterFrontier: { served: 'the country around' },
  entrepot: { served: "the economy's stored mark (entrepot.js)" },
};

/** @param {string} group a CAUSE_HOUSES group @returns {boolean} some catalogue house of the group is hideable */
const groupHideable = (group) => Object.values(institutionalCatalog).some((tier) => Object.entries(tier).some(([shelf, rows]) =>
  Object.entries(rows).some(([name, row]) => CAUSE_HOUSES[group].has(name.toLowerCase()) && isHideableHouse({ name, category: shelf, ...row }))));

/**
 * The facts a predicate reads, each `{ fact, withheld, stubs }` (`stubs` empty: no atom of the vocabulary answers it),
 * and every read the walker could not name.
 * @param {string} key a key of TENSION_CAUSE_HOLDS
 */
function readsOf(key) {
  // the predicate's text and its helpers', comments gone (a type cast's `import(...)` is no call)
  const bare = (/** @type {string} */ t) => t.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ');
  let text = bare(PREDICATES[key] ?? '');
  for (const [name, body] of Object.entries(HELPERS)) if (new RegExp(`\\b${name}\\(`).test(text)) text += `\n${bare(body)}`;
  /** @type {Array<{ fact: string, withheld: string | null, stubs: Array<Record<string, unknown>> }>} */ const reads = [];
  /** @type {string[]} */ const unknown = [];
  let rest = text;
  const take = (/** @type {RegExp} */ re, /** @type {(m: RegExpMatchArray) => void} */ on) => { for (const m of rest.matchAll(re)) on(m); rest = rest.replace(re, ' '); };
  take(/causeHouseStands\(record, '(\w+)'\)/g, (m) => reads.push({ fact: `house ${m[1]}`, withheld: groupHideable(m[1]) ? 'a hideable house (isHideableHouse)' : null, stubs: [{ causeHouses: { [m[1]]: true } }, { causeHouses: { [m[1]]: false } }] }));
  take(/hasInstitution\(record, '(\w+)'\)/g, (m) => reads.push({ fact: `institution ${m[1]}`, withheld: null, stubs: [] }));
  take(/\b(crimeSignalOf|governingFactionOf)\(/g, (m) => reads.push({ fact: `the powers (${m[1]})`, withheld: isVeiledPower({ category: 'criminal' }) && isVeiledPower({ hidden: true }) ? 'a veiled power (isVeiledPower) leaves the roster' : null, stubs: [] }));
  take(/record\?\.powerStructure\?\.factions/g, () => reads.push({ fact: 'the powers (powerStructure.factions)', withheld: 'a veiled power (isVeiledPower) leaves the roster', stubs: [] }));
  take(/record\?\.powerStructure\?\.publicLegitimacy\?\.label/g, () => reads.push({ fact: 'the legitimacy label', withheld: null, stubs: [] }));
  take(/record\?\.history\?\.historicalEvents/g, () => reads.push({ fact: 'the timeline', withheld: null, stubs: [] }));
  take(/\bfacts\.(\w+)/g, (m) => {
    const c = FACT_FIELDS[m[1]];
    if (!c) { unknown.push(`facts.${m[1]}`); return; }
    reads.push('withheld' in c ? { fact: `facts.${m[1]}`, withheld: c.withheld, stubs: c.stubs } : { fact: `facts.${m[1]}`, withheld: null, stubs: [] });
  });
  // what is left must read nothing of the place: no `record` path, and no call the walker does not know
  for (const m of rest.matchAll(/\brecord(\?\.|\.)\w+/g)) unknown.push(m[0]);
  for (const m of rest.matchAll(/([A-Za-z_][\w.]*)\(/g)) {
    const name = m[1] === 'Array.isArray' ? m[1] : m[1].split('.').pop() || '';
    if (!PLAIN_CALLS.has(name) && !Object.hasOwn(HELPERS, name)) unknown.push(`${m[1]}()`);
  }
  return { reads, unknown };
}

/** @param {{ needs?: ReadonlyArray<string>, excludes?: ReadonlyArray<string> }} w @param {Array<Record<string, unknown>>} stubs */
const answers = (w, stubs) => [...(w.needs || []), ...(w.excludes || [])].some((atom) => {
  const seen = new Set(stubs.map((s) => atomHolds(atom, /** @type {any} */ (s))));
  return seen.size > 1;
});

/** every row of TENSION_CAUSES and what the walker finds of it */
const ROWS = Object.entries(TENSION_CAUSES).flatMap(([kind, table]) => table.causes.map((c) => {
  const { reads, unknown } = readsOf(c.holds);
  const unanswered = reads.filter((r) => r.withheld).filter((r) => c.wordings.some((w) => !answers(w, r.stubs)));
  return { row: `${kind}:${c.id}`, holds: c.holds, reads, unknown, unanswered };
}));

/**
 * THE EXEMPTION LIST, for the chair (PAGE-12 puts it): rows that read a withholdable fact with a wording that declares no
 * atom answering it, OUTSIDE the units that cure such rows (B: force_unpaid_or_cut; H: the five house rows). Not cured
 * here (the brief: report the row, the fact and the pairs of PARITY-SORT that bear on it). Each entry: the fact it reads.
 * The list is EXACT: a new red row fails, and an exempt row that stops reading red fails until it leaves the list.
 */
const EXEMPT = Object.freeze({
  // reads the powers through `crimeSignalOf` (a criminal power seated); no atom of the vocabulary answers the roster.
  // PARITY-SORT: 5 pairs owned by criminal_power, its predicate held on every served document; 4 of them SIGNATURES
  // (r2r-city-56, r2s-religious_conversion-metropolis-0: the served page prints rival_rings).
  'crime_wave:criminal_power': 'the powers (crimeSignalOf), the powers (powerStructure.factions)',
  // read the governing power through `governedByTrade` (`governingFactionOf`); their wordings declare `guild` (or none),
  // which does not answer who governs. PARITY-SORT sorts crime_wave alone: no pair bears on them.
  'guild_conflict:guilds_rule': 'the powers (governingFactionOf)',
  'outside_debt:merchants_rule': 'the powers (governingFactionOf)',
});

describe('the causes\' atom walker: a predicate reads a withholdable fact only through a declared atom', () => {
  it('finds what every predicate reads, and names every read (no unknown call, path or field)', () => {
    expect(Object.keys(PREDICATES).sort()).toEqual(Object.keys(TENSION_CAUSE_HOLDS).sort());
    expect(ROWS.length).toBe(Object.values(TENSION_CAUSES).reduce((n, t) => n + t.causes.length, 0));
    expect(ROWS.filter((r) => r.unknown.length).map((r) => `${r.row} (${r.holds}): ${r.unknown.join(', ')}`)).toEqual([]);
    for (const r of ROWS) expect(r.reads.length, `${r.row} reads nothing the walker can name`).toBeGreaterThan(0);
  });
  it('the walker discriminates: the hideable house groups are computed, and a declared house atom answers its house', () => {
    expect(['thievesGuild', 'smuggling', 'underground', 'assassins', 'blackMarket', 'whisperMarket', 'outlaws'].every(groupHideable)).toBe(true);
    expect(['caravans', 'fair', 'exchange', 'luxuryQuarter'].filter(groupHideable)).toEqual([]);
    const th = ROWS.find((r) => r.row === 'crime_wave:thieves_house');
    expect(th?.reads.map((x) => x.fact)).toEqual(['house thievesGuild']);
    expect(th?.unanswered).toEqual([]);
    // the same row with its declaration taken away reds
    const stubs = /** @type {any} */ (th).reads[0].stubs;
    expect(answers({}, stubs)).toBe(false);
    expect(answers({ needs: ['house: thieves_guild'] }, stubs)).toBe(true);
    expect(answers({ needs: ['house: smuggling'] }, stubs)).toBe(false);
  });
  it('no row reads a withholdable fact without an atom answering it on every wording, but those on the exemption list', () => {
    const red = Object.fromEntries(ROWS.filter((r) => r.unanswered.length).map((r) => [r.row, r.unanswered.map((x) => x.fact).join(', ')]));
    expect(red).toEqual(EXEMPT);
  });
});

/**
 * THE LAW ON EVERY ROW THAT DECLARES A HIDEABLE HOUSE (the chair's leave for H, condition (3), 23:39 UTC 2026-11-21): the
 * five house rows of H. For each: a place whose only cause is that house (a kept, fully paid force; no power), its house
 * the catalogue's own row; the hiding read is the gallery's (`toPublicSafe`, then the veil's default set, as PARITY-SORT
 * reads it). On that read the house is gone, the row does not hold, its declared atom reads no, and the page prints what
 * the TWIN (the same place with the house removed) prints; the owner's page keeps the row's own wording.
 */
describe('each row that declares a hideable house: a read that hides the house prints what a place without it prints', () => {
  const HOUSE_ROWS = /** @type {Array<[string, string, string]>} */ ([
    ['black_market', 'black_market', 'blackMarket'], ['assassins', 'assassins', 'assassins'], ['underground', 'underground', 'underground'],
    ['whisper_market', 'whisper_market', 'whisperMarket'], ['outlaws_near', 'outlaws', 'outlaws']]);
  /** the catalogue's own row of a house of the group (its shelf as its category) @param {string} group */
  const catalogueHouse = (group) => {
    for (const tier of Object.values(institutionalCatalog)) for (const [shelf, rows] of Object.entries(tier)) for (const [name, row] of Object.entries(rows)) {
      if (CAUSE_HOUSES[group].has(name.toLowerCase())) return { id: `inst_${group}`, name, category: shelf, ...row };
    }
    throw new Error(`no catalogue house for ${group}`);
  };
  const hide = (/** @type {any} */ record) => { const pub = toPublicSafe(record); return applyVeil(pub, resolveVeil(defaultVeilFor(pub), null)); };
  const crime = { type: 'crime_wave' };
  it('covers every row whose predicate reads a hideable house, but thieves_house and contraband_water (declared before H)', () => {
    const declaring = ROWS.filter((r) => r.reads.some((x) => x.fact.startsWith('house ') && x.withheld)).map((r) => r.row.split(':')[1]);
    expect(declaring.filter((id) => !['thieves_house', 'contraband_water'].includes(id)).sort()).toEqual(HOUSE_ROWS.map(([id]) => id).sort());
  });
  for (const [id, key, group] of HOUSE_ROWS) {
    it(`${id}: hidden, the row does not hold and the page prints the twin's sentence; the owner keeps the row's wording`, () => {
      const row = /** @type {any} */ (TENSION_CAUSES.crime_wave.causes.find((c) => c.id === id));
      const twin = { name: 'Ashford', institutions: [{ id: 'inst_watch', name: 'Town watch' }, { id: 'inst_garrison', name: 'Garrison' }],
        powerStructure: { factions: [] }, defenseProfile: { economicGates: { military: 1.2 } } };
      const record = { ...twin, institutions: [...twin.institutions, catalogueHouse(group)] };
      // the owner: the row holds, its atom reads yes, and the page prints the row's own wording
      expect(TENSION_CAUSE_HOLDS[row.holds](record, factsOf(record)), id).toBe(true);
      expect(atomHolds(`house: ${key}`, /** @type {any} */ (factsOf(record))), id).toBe(true);
      expect(tensionCauseSentenceOf(record, crime), id).toBe(pickVariant(row.wordings, 'Ashford::cause::crime_wave').text);
      // the hiding read: the house is gone, the row does not hold, the atom reads no
      const served = hide(record);
      expect(served.institutions.map((/** @type {any} */ i) => i.name), id).toEqual(twin.institutions.map((i) => i.name));
      expect(TENSION_CAUSE_HOLDS[row.holds](served, factsOf(served)), id).toBe(false);
      expect(atomHolds(`house: ${key}`, /** @type {any} */ (factsOf(served))), id).toBe(false);
      // and it prints what the place without the house prints (owner and served alike)
      const plain = tensionCauseSentenceOf(twin, crime);
      expect(TENSION_CAUSES.crime_wave.plain.map((l) => l.text), id).toContain(plain);
      expect(tensionCauseSentenceOf(served, crime), id).toBe(plain);
      expect(tensionCauseSentenceOf(hide(twin), crime), id).toBe(plain);
    });
  }
});
