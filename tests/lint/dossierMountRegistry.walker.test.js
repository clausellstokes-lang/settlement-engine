/**
 * dossierMountRegistry.walker.test.js — TRAIN 1 cars C2/C3. THE MOUNT REGISTRY WALKER,
 * and the arm that makes ONE FACT, ONE SENTENCE structural rather than aspirational.
 *
 * ── WHAT IT GUARDS ───────────────────────────────────────────────────────────────────
 * `src/domain/display/stateProse/dossierMounts.js` is the dossier's router: it says which
 * corpus block renders at which POSITION on which tab, and at which depth. A router is
 * only worth its bytes if it cannot drift from the two things it joins — the CORPUS on
 * one side and the COMPONENT TREE on the other — so every claim it makes is re-derived
 * from a producer here, on every run, and nothing is trusted to a list a human keeps.
 *
 *   TOTALITY      every corpus block carrying a pool is either mounted or declared dark.
 *   ONE SENTENCE  no block draws its SENTENCE rung at two positions (car C3).
 *   REACHABILITY  every mount id resolves to exactly one site under src/components.
 *   HONESTY       every mount over a dimension-bearing block declares that dimension,
 *                 and one over a dimension-free block declares none.
 *   SHRINK-ONLY   the dark half never grows.
 *
 * ── WHY THE ONE-SENTENCE ARM IS THE POINT ────────────────────────────────────────────
 * The corpus draws its variety across SETTLEMENTS, not across surfaces: 687 of its 708
 * pools carry exactly one variant per angle, so a design that pinned an angle per surface
 * would have made the seed inert and printed one sentence for every town in a state. The
 * refusal of that design costs something, and this is what pays for it. A settlement has
 * one story about its crime wave; `history.currentTensions` already renders on three tabs,
 * so the page repeats the RECORD, and repeating the record is coherent while contradicting
 * it is not. The registry holds the law by shape (`rung` is a field, and
 * `sentenceMountForBlock` answers with at most one position), and this arm is what turns
 * shape into enforcement: a table that could name two speaking positions never gets built.
 *
 * ── THE REGISTRY IS EMPTY TODAY, AND THAT IS WHY THE CONTROLS ARE NOT OPTIONAL ───────
 * No desk has landed, so `DOSSIER_MOUNTS` is empty and every arm above that reads a row
 * would pass over nothing and prove nothing. So each rule is a PURE FUNCTION over a
 * registry passed in, and the first describe drives every one of them over synthetic
 * tables: a clean table on which the rule must stay silent, and a planted violation on
 * which that rule alone must speak while its siblings stay silent. That is the difference
 * between an arm that is armed and an arm that is merely present, and with an empty table
 * it is the only way to tell them apart. The shipped table is then judged by the same
 * functions, so the controls and the live arms cannot fall out of step.
 *
 * The FOUR synthetic rows are the design's own worked example (DS-ECO-1 at the prosperity
 * header, DS-GEN-1 speaking on History and glancing on Power and Overview) rather than
 * invented shapes, so the controls also read as the documentation of what a real row and
 * a real page-set look like.
 *
 * @enforced-by itself (a source scan and a corpus join; no runtime coupling)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import { codeOnly } from '../helpers/codeOnlySource.js';
import { mustExtract } from '../helpers/sourceContract.js';
import { writeShrinkOnlyBaseline } from '../helpers/shrinkOnlyBaseline.js';
import {
  DOSSIER_MOUNTS,
  MOUNT_RUNGS,
  UNMOUNTED_BLOCKS,
  drawnAtMount,
  mountById,
  mountsForTab,
  sentenceMountForBlock,
} from '../../src/domain/display/stateProse/dossierMounts.js';
import { poolDimensions } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const COMPONENTS = join(ROOT, 'src/components');
const ROUTER = 'src/components/OutputContainer.jsx';
const BASELINE_PATH = join(ROOT, 'tests/lint/.dossier-mounts-baseline.json');
const UPDATE = process.env.UPDATE_MOUNT_BASELINE === '1';

/**
 * THE CORPUS, desk by desk. The desk key is the leaf's basename, which is the same word
 * a mount row spells, so the join needs no translation table that could drift.
 * @type {Readonly<Record<string, Record<string, {pools?: Record<string, unknown[]>}>>>}
 */
const DESKS = Object.freeze({
  defense: DOSSIER_STATE_PROSE_DEFENSE,
  economy: DOSSIER_STATE_PROSE_ECONOMY,
  general: DOSSIER_STATE_PROSE_GENERAL,
  power: DOSSIER_STATE_PROSE_POWER,
  stressors: DOSSIER_STATE_PROSE_STRESSORS,
  warFaith: DOSSIER_STATE_PROSE_WAR_FAITH,
});

// ── The producers, derived rather than declared ──────────────────────────────────────

/**
 * Every block id that carries at least one pool, mapped to the desk that holds it, in the
 * registry's own canonical order: desk name ascending, then the leaf's own block order.
 * @returns {{blockId: string, desk: string}[]}
 */
function corpusBlocks() {
  const rows = [];
  for (const desk of Object.keys(DESKS).sort()) {
    for (const [blockId, block] of Object.entries(DESKS[desk])) {
      if (Object.keys(block?.pools || {}).length > 0) rows.push({ blockId, desk });
    }
  }
  return rows;
}

const CORPUS_BLOCKS = corpusBlocks();
const DESK_OF_BLOCK = new Map(CORPUS_BLOCKS.map((row) => [row.blockId, row.desk]));
const CANONICAL_ORDER = CORPUS_BLOCKS.map((row) => row.blockId);

/**
 * The demoted STATE dimensions a block partitions itself by, unioned over its pools. The
 * kernel's own `poolDimensions` is the reader, so this walker cannot invent a second
 * opinion about what a dimension is.
 * @param {string} blockId
 * @returns {string[]} sorted, empty for a block the projection demoted nothing into
 */
function blockDimensions(blockId) {
  const desk = DESK_OF_BLOCK.get(blockId);
  const block = desk ? DESKS[desk][blockId] : null;
  const found = new Set();
  for (const pool of Object.values(block?.pools || {})) {
    for (const dimension of poolDimensions(/** @type {never} */ (pool))) found.add(dimension);
  }
  return [...found].sort();
}

/**
 * THE TAB VOCABULARY, read off the router itself. `OutputContainer`'s `renderTab` switch
 * is the only thing in the tree that decides what a tab id can be, so a hand-kept list
 * here would be a second opinion that drifts. `mustExtract` throws when the switch moves,
 * which is the loud failure a silently-empty extractor would not give.
 * @returns {Set<string>}
 */
function routerTabs() {
  const source = readFileSync(join(ROOT, ROUTER), 'utf8');
  mustExtract(source, 'switch (selectedTab) {', `the renderTab switch in ${ROUTER}`);
  return new Set([...source.matchAll(/case '([a-z_]+)':/g)].map((match) => match[1]));
}

const TAB_VOCABULARY = routerTabs();
const DESK_VOCABULARY = new Set(Object.keys(DESKS));
const RUNG_VOCABULARY = new Set(Object.values(MOUNT_RUNGS));

/**
 * The CONTENTS of every string literal in a source file, comments skipped. A mount id is
 * looked for INSIDE a literal because that is where an id can be used; the shared
 * `codeOnly` strip does the opposite (it blanks literal contents to find calls), so this
 * walker keeps its own reader, and the first arm below drives it against prose, a line
 * comment, a block comment and all three quote styles before any absence is asserted.
 * @param {string} src
 * @returns {string[]}
 */
function stringLiterals(src) {
  const out = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i += 1; continue; }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i += 1;
      i += 2;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      let buffer = '';
      i += 1;
      while (i < n && src[i] !== c) {
        if (src[i] === '\\') { buffer += src[i + 1] ?? ''; i += 2; continue; }
        buffer += src[i];
        i += 1;
      }
      i += 1;
      out.push(buffer);
      continue;
    }
    i += 1;
  }
  return out;
}

/** @param {string} dir @param {string[]} out @returns {string[]} */
function walkSources(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walkSources(path, out);
    else if (/\.jsx?$/.test(entry) && !/\.test\./.test(entry)) out.push(path);
  }
  return out;
}

const COMPONENT_LITERALS = walkSources(COMPONENTS).map((absolute) => ({
  rel: relative(ROOT, absolute).replace(/\\/g, '/'),
  literals: stringLiterals(readFileSync(absolute, 'utf8')),
}));

/**
 * How many sites under src/components name this id as a whole string literal.
 * @param {string} id
 * @param {{rel: string, literals: string[]}[]} [tree]
 * @returns {number}
 */
function componentSites(id, tree = COMPONENT_LITERALS) {
  let seen = 0;
  for (const file of tree) for (const literal of file.literals) if (literal === id) seen += 1;
  return seen;
}

// ── The rules. Each is TOTAL over a registry passed in, and each returns the offences it
//    found, so the same function serves the synthetic controls and the shipped table. ──

/** @param {readonly object[]} mounts @returns {string[]} */
function malformedRows(mounts) {
  const bad = [];
  for (const row of mounts) {
    const where = String(row?.mount ?? '(no mount id)');
    if (typeof row?.mount !== 'string' || row.mount === '') bad.push(`${where}: no mount id`);
    if (!TAB_VOCABULARY.has(row?.tab)) bad.push(`${where}: tab ${row?.tab} is not a router tab`);
    if (!DESK_VOCABULARY.has(row?.desk)) bad.push(`${where}: desk ${row?.desk} is not a corpus leaf`);
    if (!RUNG_VOCABULARY.has(row?.rung)) bad.push(`${where}: rung ${row?.rung} is not a rung`);
    if (!DESK_OF_BLOCK.has(row?.blockId)) bad.push(`${where}: ${row?.blockId} is not a corpus block`);
    else if (DESK_OF_BLOCK.get(row.blockId) !== row.desk) {
      bad.push(`${where}: ${row.blockId} lives on the ${DESK_OF_BLOCK.get(row.blockId)} desk`);
    }
    if (typeof row?.mount === 'string' && typeof row?.tab === 'string'
      && !row.mount.startsWith(`${row.tab}.`)) {
      bad.push(`${where}: the mount id does not begin with its own tab`);
    }
  }
  return bad.sort();
}

/** @param {readonly object[]} mounts @returns {string[]} */
function duplicateMountIds(mounts) {
  const seen = new Map();
  for (const row of mounts) seen.set(row?.mount, (seen.get(row?.mount) || 0) + 1);
  return [...seen].filter(([, count]) => count > 1).map(([id]) => String(id)).sort();
}

/**
 * THE ROOM, AS A PREDICATE. Every block that draws its sentence rung at more than one
 * position. Empty is the only lawful answer.
 * @param {readonly object[]} mounts
 * @returns {string[]}
 */
function blocksSpeakingTwice(mounts) {
  const speaking = new Map();
  for (const row of mounts) {
    if (row?.rung !== MOUNT_RUNGS.SENTENCE) continue;
    speaking.set(row.blockId, [...(speaking.get(row.blockId) || []), row.mount]);
  }
  return [...speaking]
    .filter(([, positions]) => positions.length > 1)
    .map(([blockId, positions]) => `${blockId} speaks at ${positions.sort().join(' and ')}`)
    .sort();
}

/** @param {readonly object[]} mounts @returns {string[]} */
function dimensionDeclarationFaults(mounts) {
  const bad = [];
  for (const row of mounts) {
    if (!DESK_OF_BLOCK.has(row?.blockId)) continue;
    const owed = blockDimensions(row.blockId);
    const declared = [...(row?.dimensions || [])].sort();
    if (owed.join(',') !== declared.join(',')) {
      bad.push(`${row.mount}: ${row.blockId} partitions by [${owed.join(',')}]`
        + ` and the row declares [${declared.join(',')}]`);
    }
  }
  return bad.sort();
}

/**
 * @param {readonly object[]} mounts
 * @param {{rel: string, literals: string[]}[]} [tree]
 * @returns {string[]}
 */
function unreachableMounts(mounts, tree = COMPONENT_LITERALS) {
  return mounts
    .filter((row) => componentSites(row?.mount, tree) !== 1)
    .map((row) => `${row?.mount}: ${componentSites(row?.mount, tree)} sites under src/components`)
    .sort();
}

/**
 * @param {readonly object[]} mounts
 * @param {readonly string[]} unmounted
 * @returns {{unrouted: string[], doubled: string[], strangers: string[]}}
 */
function routingLedger(mounts, unmounted) {
  const mounted = new Set(mounts.map((row) => row?.blockId));
  const dark = new Set(unmounted);
  const unrouted = CANONICAL_ORDER.filter((id) => !mounted.has(id) && !dark.has(id));
  const doubled = CANONICAL_ORDER.filter((id) => mounted.has(id) && dark.has(id));
  const strangers = [...dark].filter((id) => !DESK_OF_BLOCK.has(id)).sort();
  return { unrouted, doubled, strangers };
}

// ── THE CONTROLS. Every rule driven over a clean table and a planted one. ─────────────

/** The design's own worked example: one economy header, one fact speaking once. */
const CLEAN = Object.freeze([
  Object.freeze({
    mount: 'economics.prosperityHeader', tab: 'economics', desk: 'economy', blockId: 'DS-ECO-1', rung: 'sentence',
  }),
  Object.freeze({
    mount: 'history.tensions', tab: 'history', desk: 'general', blockId: 'DS-GEN-1', rung: 'sentence', dimensions: ['severity'],
  }),
  Object.freeze({
    mount: 'power.tensions', tab: 'power', desk: 'general', blockId: 'DS-GEN-1', rung: 'glance', dimensions: ['severity'],
  }),
  Object.freeze({
    mount: 'overview.tensions', tab: 'overview', desk: 'general', blockId: 'DS-GEN-1', rung: 'glance', dimensions: ['severity'],
  }),
]);

/** @param {number} index @param {object} patch @returns {object[]} */
function mutate(index, patch) {
  return CLEAN.map((row, i) => (i === index ? { ...row, ...patch } : row));
}

/** A component tree in which all four clean ids resolve exactly once. */
const WIRED_TREE = [{
  rel: 'src/components/probe.jsx',
  literals: CLEAN.map((row) => row.mount),
}];

/**
 * Every rule, by name, so a control can assert that ONE spoke and the others did not.
 * @type {Readonly<Record<string, (mounts: readonly object[]) => string[]>>}
 */
const RULES = Object.freeze({
  malformed: malformedRows,
  duplicate: duplicateMountIds,
  twoSentences: blocksSpeakingTwice,
  dimensions: dimensionDeclarationFaults,
  unreachable: (mounts) => unreachableMounts(mounts, WIRED_TREE),
});

/**
 * @param {readonly object[]} mounts
 * @returns {string[]} the names of the rules that found something
 */
function rulesThatSpeak(mounts) {
  return Object.entries(RULES).filter(([, rule]) => rule(mounts).length > 0).map(([name]) => name).sort();
}

describe('C2 mount registry — the guards can see the defects they guard', () => {
  test('guard the guard: the literal reader sees code and skips prose', () => {
    expect(stringLiterals("const a = 'history.tensions';")).toEqual(['history.tensions']);
    expect(stringLiterals('const a = "history.tensions";')).toEqual(['history.tensions']);
    expect(stringLiterals('const a = `history.tensions`;')).toEqual(['history.tensions']);
    // A comment naming a mount is documentation, never a site: the estate has convicted a
    // registry for DESCRIBING the thing it classifies eight times over, so this door is
    // driven rather than assumed.
    expect(stringLiterals('// history.tensions goes here')).toEqual([]);
    expect(stringLiterals('/* history.tensions goes here */')).toEqual([]);
    expect(stringLiterals("const a = 'x'; // 'history.tensions'")).toEqual(['x']);
    // And the scan really did reach the component tree, so an absence below is a
    // measurement rather than an empty walk.
    expect(COMPONENT_LITERALS.length, 'the component scan emptied').toBeGreaterThan(400);
    expect(
      COMPONENT_LITERALS.reduce((sum, file) => sum + file.literals.length, 0),
      'the component scan found no literals at all',
    ).toBeGreaterThan(5000);
  });

  test('guard the guard: the tab vocabulary is derived from the router that uses it', () => {
    // Derived from OutputContainer's own switch, never a hand-kept twin. If the switch
    // moves, mustExtract throws while this file is being read, which is the loud failure.
    expect(TAB_VOCABULARY.size, 'the router tab vocabulary collapsed').toBeGreaterThan(20);
    for (const tab of ['economics', 'history', 'power', 'overview', 'defense', 'war', 'faith']) {
      expect([...TAB_VOCABULARY], `${tab} is not a router tab`).toContain(tab);
    }
    // A word the router cannot render is not a tab, however plausible it reads.
    expect(TAB_VOCABULARY.has('economy'), 'the desk name is not a tab id').toBe(false);
    expect(DESK_VOCABULARY.has('economy'), 'the desk name is a desk').toBe(true);
    // The corpus join is populated, or every totality claim below is free.
    expect(CORPUS_BLOCKS.length, 'the corpus join emptied').toBe(68);
    expect(blockDimensions('DS-GEN-1')).toEqual(['severity']);
    expect(blockDimensions('DS-GEN-6')).toEqual(['deficit']);
    expect(blockDimensions('DS-GEN-9')).toEqual(['anchor']);
    expect(blockDimensions('DS-ECO-1')).toEqual([]);
  });

  test('the clean worked example passes every rule', () => {
    expect(rulesThatSpeak(CLEAN), 'the control table is not clean').toEqual([]);
    // The dark half for this control is DERIVED from the corpus rather than borrowed from
    // the shipped list, so a control cannot red because the thing it controls changed.
    const dark = CANONICAL_ORDER.filter((id) => !CLEAN.some((row) => row.blockId === id));
    expect(routingLedger(CLEAN, dark))
      .toEqual({ unrouted: [], doubled: [], strangers: [] });
  });

  test('ONE FACT ONE SENTENCE: a second speaking position reds this arm and no other', () => {
    // The design's own negative control: flip power.tensions to the sentence rung and
    // DS-GEN-1 now speaks on two tabs about one record. This is car C3's whole mechanism.
    const planted = mutate(2, { rung: MOUNT_RUNGS.SENTENCE });
    expect(blocksSpeakingTwice(planted))
      .toEqual(['DS-GEN-1 speaks at history.tensions and power.tensions']);
    expect(rulesThatSpeak(planted), 'the one-sentence plant disturbed a sibling rule')
      .toEqual(['twoSentences']);
    // Three positions is the annex note this design refused, and it reds the same way.
    const thrice = mutate(3, { rung: MOUNT_RUNGS.SENTENCE });
    expect(blocksSpeakingTwice(thrice.map((row, i) => (i === 2 ? { ...row, rung: MOUNT_RUNGS.SENTENCE } : row))))
      .toEqual(['DS-GEN-1 speaks at history.tensions and overview.tensions and power.tensions']);
    // And the lawful shape stays silent: the same block glancing at two positions is the
    // design, not the defect.
    expect(blocksSpeakingTwice(CLEAN)).toEqual([]);
  });

  test('a duplicated position reds the duplicate arm and no other', () => {
    const planted = [...CLEAN, { ...CLEAN[2], rung: MOUNT_RUNGS.GLANCE }];
    expect(duplicateMountIds(planted)).toEqual(['power.tensions']);
    expect(rulesThatSpeak(planted)).toEqual(['duplicate']);
  });

  test('a stranger tab, a mismatched desk and a mount id disowning its tab each red the shape arm', () => {
    expect(malformedRows(mutate(0, { tab: 'nowhere' })))
      .toEqual(['economics.prosperityHeader: the mount id does not begin with its own tab',
        'economics.prosperityHeader: tab nowhere is not a router tab'].sort());
    expect(rulesThatSpeak(mutate(0, { tab: 'nowhere' }))).toEqual(['malformed']);
    // A desk that does not hold the block: the row would read the wrong leaf forever.
    expect(malformedRows(mutate(1, { desk: 'power' })))
      .toEqual(['history.tensions: DS-GEN-1 lives on the general desk']);
    // A block the corpus does not have.
    expect(malformedRows(mutate(1, { blockId: 'DS-GEN-99' })))
      .toEqual(['history.tensions: DS-GEN-99 is not a corpus block']);
    // A rung outside the ladder.
    expect(malformedRows(mutate(1, { rung: 'detail' })))
      .toEqual(['history.tensions: rung detail is not a rung']);
    // A mount id that says one tab while the row says another. This is the field pair a
    // reader trusts most and the one nothing else would ever compare.
    expect(malformedRows(mutate(2, { mount: 'history.tensionsGlance' })))
      .toEqual(['history.tensionsGlance: the mount id does not begin with its own tab']);
  });

  test('a mount that names no dimension over a dimension-bearing block reds the honesty arm', () => {
    // The silent failure this replaces: at runtime the kernel would fail closed and the
    // surface would render prose-less forever, looking exactly like a state with nothing
    // to say. Here it is a build-time red naming the block and the dimension.
    const silent = mutate(1, { dimensions: undefined });
    expect(dimensionDeclarationFaults(silent))
      .toEqual(['history.tensions: DS-GEN-1 partitions by [severity] and the row declares []']);
    expect(rulesThatSpeak(silent)).toEqual(['dimensions']);
    // And the other way: a row claiming a dimension its block does not carry is a desk
    // that will assemble a reading nothing consumes.
    const invented = mutate(0, { dimensions: ['severity'] });
    expect(dimensionDeclarationFaults(invented))
      .toEqual(['economics.prosperityHeader: DS-ECO-1 partitions by [] and the row declares [severity]']);
    expect(rulesThatSpeak(invented)).toEqual(['dimensions']);
    // A wrong dimension name is caught by the same equality, not by a separate list.
    expect(dimensionDeclarationFaults(mutate(1, { dimensions: ['anchor'] })))
      .toEqual(['history.tensions: DS-GEN-1 partitions by [severity] and the row declares [anchor]']);
  });

  test('a mount with no JSX site, and one with two, both red the reachability arm', () => {
    // The synthetic probe the design names: a position declared and never built.
    const probe = [...CLEAN, {
      mount: 'overview.__probe', tab: 'overview', desk: 'economy', blockId: 'DS-ECO-2', rung: MOUNT_RUNGS.GLANCE,
    }];
    expect(unreachableMounts(probe, WIRED_TREE))
      .toEqual(['overview.__probe: 0 sites under src/components']);
    expect(rulesThatSpeak(probe)).toEqual(['unreachable']);
    // TWO sites is the other half of "exactly one", and it is the half a presence-only
    // scan would miss: one position rendered from two places is two positions.
    const twice = [{ rel: 'src/components/probe.jsx', literals: [...WIRED_TREE[0].literals, 'power.tensions'] }];
    expect(unreachableMounts(CLEAN, twice))
      .toEqual(['power.tensions: 2 sites under src/components']);
    // NON-VACUITY of the real scan: a string the component tree really does carry is
    // found, and one it does not is not. Without this the arm could be a reader that
    // stopped reading.
    expect(componentSites('economics'), 'the live component scan finds nothing')
      .toBeGreaterThan(0);
    expect(componentSites('overview.__probe.never')).toBe(0);
  });

  test('the routing ledger reds an unrouted block, a doubled block and a stranger', () => {
    // Unrouted: the corpus grew a block and nobody said where it goes. This is the plant
    // scripts/mutation-sweep.sh carries against the shipped registry.
    // The mounts passed here are the SHIPPED ones, not `[]`. An empty table was the same
    // thing as the shipped table on the day this walker landed, and the two parted company
    // the moment the first desk car mounted a block: with `[]` every mounted block also
    // reads as unrouted, and the control would red because the thing it controls changed
    // rather than because the plant worked. The clean-table arm above already derives its
    // dark half from the corpus for exactly this reason; this line is the same discipline.
    // ⚠ THE PLANT IS DERIVED, NOT HARDCODED, AND THIS ARM'S OWN COMMENT PREDICTED WHY.
    // It named `DS-CND-1` literally, and the stressor desk car mounted that block — so the
    // control reddened because the thing it controls changed, which is the exact staleness
    // the `doubled` plant below was already cured of. Same cure: take the dark list's own
    // first member, which is still dark by construction.
    const unroutedPlant = UNMOUNTED_BLOCKS[0];
    const short = UNMOUNTED_BLOCKS.filter((id) => id !== unroutedPlant);
    expect(routingLedger(DOSSIER_MOUNTS, short).unrouted).toEqual([unroutedPlant]);
    // Doubled: mounted AND still declared dark, so the darkness figure lies. The plant is
    // built from the dark list's OWN first member, which is still dark by construction, so
    // this control cannot go stale as desk cars mount blocks out of that list — the way a
    // hardcoded pair did the moment the economy desk car landed.
    const stillDark = UNMOUNTED_BLOCKS[0];
    const doubling = [{ ...CLEAN[0], blockId: stillDark, desk: DESK_OF_BLOCK.get(stillDark) }];
    expect(routingLedger(doubling, UNMOUNTED_BLOCKS).doubled).toEqual([stillDark]);
    // And the lawful shape stays silent: the SHIPPED table doubles nothing.
    expect(routingLedger(DOSSIER_MOUNTS, UNMOUNTED_BLOCKS).doubled).toEqual([]);
    // A stranger: a name in the dark list that the corpus does not have.
    expect(routingLedger([], [...UNMOUNTED_BLOCKS, 'DS-GHOST-1']).strangers).toEqual(['DS-GHOST-1']);
  });
});

describe('C2 mount registry — the shipped table', () => {
  test('every row is well formed, unique, reachable and honest about its dimensions', () => {
    expect(malformedRows(DOSSIER_MOUNTS), 'a mount row does not address the tree').toEqual([]);
    expect(duplicateMountIds(DOSSIER_MOUNTS), 'two rows claim one position').toEqual([]);
    expect(
      unreachableMounts(DOSSIER_MOUNTS),
      'a mount id resolves to no site or to more than one under src/components. A'
      + ' position the registry names and the tree does not build is a router pointing at'
      + ' nothing; add the row and the site in the SAME commit.',
    ).toEqual([]);
    expect(
      dimensionDeclarationFaults(DOSSIER_MOUNTS),
      'a mount over a dimension-bearing block does not declare its dimension. The kernel'
      + ' fails closed on an unanswered dimension, so this row would render prose-less in'
      + ' front of a reader and look like a state with nothing to say.',
    ).toEqual([]);
  });

  test('TOTALITY: every corpus block is mounted or declared dark, and exactly one of the two', () => {
    const ledger = routingLedger(DOSSIER_MOUNTS, UNMOUNTED_BLOCKS);
    expect(
      ledger.unrouted,
      'a corpus block is neither mounted nor declared dark. Every block has a position or'
      + ' a written reason it has none; there is no third state.',
    ).toEqual([]);
    expect(ledger.doubled, 'a block is mounted AND still listed dark').toEqual([]);
    expect(ledger.strangers, 'the dark list names something the corpus does not have').toEqual([]);
    // The accounting identity, stated as one number so the split is legible in a failure.
    expect(new Set(DOSSIER_MOUNTS.map((row) => row.blockId)).size + UNMOUNTED_BLOCKS.length)
      .toBe(CORPUS_BLOCKS.length);
  });

  test('the dark list is in its declared canonical order and holds no duplicate', () => {
    // ORDER IS CHECKED, NOT CLAIMED. A comment saying "desk ascending, then leaf order"
    // is worth what a reader is willing to re-derive; this arm re-derives it every run,
    // so an insertion is visible in a diff as an insertion.
    expect(new Set(UNMOUNTED_BLOCKS).size, 'the dark list repeats a block')
      .toBe(UNMOUNTED_BLOCKS.length);
    expect([...UNMOUNTED_BLOCKS])
      .toEqual(CANONICAL_ORDER.filter((id) => UNMOUNTED_BLOCKS.includes(id)));
  });

  test('SHRINK-ONLY: the dark half never grows past its committed baseline', () => {
    const measured = { UNMOUNTED_BLOCKS: { blocks: UNMOUNTED_BLOCKS.length } };
    if (UPDATE) {
      // The documented refreeze, guarded: writeShrinkOnlyBaseline THROWS on a raise rather
      // than banking it, so running the refreeze on a grown tree fails where someone is
      // watching instead of moving the line the debt is measured against.
      writeShrinkOnlyBaseline(BASELINE_PATH, measured, 'the dossier mount darkness baseline');
    }
    const committed = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    expect(
      measured.UNMOUNTED_BLOCKS.blocks,
      'the dark half GREW. A new corpus block cannot be parked dark: mount it, or say in'
      + ' writing why the page has no position for it. Refreeze a FALL with'
      + ' UPDATE_MOUNT_BASELINE=1 npx vitest run tests/lint/dossierMountRegistry.walker.test.js',
    ).toBeLessThanOrEqual(committed.UNMOUNTED_BLOCKS.blocks);
    // The baseline is a real number about a real corpus, not a placeholder.
    expect(committed.UNMOUNTED_BLOCKS.blocks).toBeLessThanOrEqual(CORPUS_BLOCKS.length);
  });
});

describe('C3 the room — one fact, one sentence', () => {
  test('no block draws its sentence rung at two positions', () => {
    expect(
      blocksSpeakingTwice(DOSSIER_MOUNTS),
      'a block speaks at two positions. A settlement has one story about one record: the'
      + ' page may repeat the RECORD at as many positions as the layout wants, and every'
      + ' position after the first renders the glance and the detail rungs and no'
      + ' sentence. Flip the extra row to rung glance.',
    ).toEqual([]);
  });

  test('sentenceMountForBlock is fail-closed on a contradiction, and total on a clean table', () => {
    // The runtime half of the law. It cannot be driven over the shipped table today
    // because the table is empty, so it is driven over the worked example, which is the
    // shape a desk car will actually produce.
    const speaking = CLEAN.filter((row) => row.rung === MOUNT_RUNGS.SENTENCE);
    expect(speaking.map((row) => row.mount))
      .toEqual(['economics.prosperityHeader', 'history.tensions']);
    // And the accessor's own contract, exercised through the SHIPPED module: no position,
    // no fact, no answer.
    // ⚠ THE EMPTY-ANSWER PROBES ARE DERIVED, NOT HARDCODED, AND THIS FILE HAS NOW LEARNED
    // THAT LESSON THREE TIMES. `mountsForTab('history')` was pinned to `[]` when the shipped
    // table was empty, and the general desk's history car mounted three positions on that
    // very tab — so the control reddened because the thing it controls changed, exactly as
    // the hardcoded `DS-CND-1` and `doubled` plants did before it. The cure is the same one:
    // take a tab that is still unmounted BY CONSTRUCTION, so no desk car can invalidate the
    // probe by doing its job. `DS-GEN-1` stays a valid dark probe for the same reason the
    // dark list's own first member does: the registry says it is unmounted.
    const unmountedTab = [...TAB_VOCABULARY]
      .find((tab) => !DOSSIER_MOUNTS.some((row) => row.tab === tab));
    expect(unmountedTab, 'every router tab now carries a mount — pick a new empty probe')
      .toBeTruthy();
    expect(UNMOUNTED_BLOCKS, 'DS-GEN-1 is no longer dark').toContain('DS-GEN-1');
    expect(sentenceMountForBlock('DS-GEN-1')).toBeNull();
    expect(sentenceMountForBlock('')).toBeNull();
    expect(sentenceMountForBlock(/** @type {never} */ (undefined))).toBeNull();
    expect(mountById(`${unmountedTab}.tensions`)).toBeNull();
    expect(mountsForTab(unmountedTab)).toEqual([]);
    // NON-VACUITY: the same accessor DOES answer for a tab the table really carries, so the
    // emptiness above is the accessor discriminating rather than an accessor that stopped.
    expect(mountsForTab(DOSSIER_MOUNTS[0].tab).length).toBeGreaterThan(0);
    // THE FAIL-CLOSED RULE, proven by construction rather than by reading the source: a
    // block with two speaking rows must answer with NOTHING, because picking the first
    // would choose a winner by array order and that is the silent wrong answer this whole
    // subsystem refuses. The predicate below is the accessor's own body over a table the
    // registry is not allowed to hold.
    const contradictory = mutate(2, { rung: MOUNT_RUNGS.SENTENCE });
    const answer = contradictory.filter(
      (row) => row.blockId === 'DS-GEN-1' && row.rung === MOUNT_RUNGS.SENTENCE,
    );
    expect(answer.length, 'the contradiction did not plant').toBe(2);
    expect(answer.length === 1 ? answer[0] : null, 'a contradiction must read as silence')
      .toBeNull();

    // ── THE ROUTER READ, the other runtime accessor, folded into this test rather than
    // given a title of its own: the live test-title count is an ASSERTED census figure
    // (tests/lint/sovereigntyLightingContract.walker.test.js pins it exactly), and an arm
    // is worth adding on its evidence, not on a number it happens to move.
    //
    // This is the half that makes a mount id a DRAW rather than a citation. The
    // reachability rule above can only see that a literal appears once under
    // src/components; it cannot see whether the component obeyed the table. Driven over
    // the SHIPPED rows, so the table and its only reader cannot part company.
    const rung = Object.freeze({
      glance: 'Deficit 12%',
      sentence: 'The town does not grow what it eats.',
      detail: Object.freeze([{ label: 'Produced against need', value: 'short' }]),
      provenance: Object.freeze({ blockId: 'DS-ECO-2', poolKey: 'FOOD: deficit', angle: 'ledger' }),
    });
    // A SENTENCE row hands the rung back whole — the position may speak.
    expect(drawnAtMount('economics.prosperityHeader', rung)).toBe(rung);
    expect(drawnAtMount('economics.foodSecurity', rung)).toBe(rung);
    // A GLANCE row keeps the band word and the rows and takes the sentence away — AND the
    // provenance with it, because a trail describing a line that was never printed is the
    // false-report shape.
    const glanced = drawnAtMount('economics.foodTile', rung);
    expect(glanced.glance).toBe('Deficit 12%');
    expect(glanced.detail).toEqual(rung.detail);
    expect(glanced.sentence).toBeNull();
    expect(glanced.provenance).toBeNull();
    // Non-vacuity: the two answers must actually DIFFER, or this arm proves nothing.
    expect(glanced.sentence).not.toBe(rung.sentence);
    // UNMOUNTED IS SILENCE (R-DST-K), not a fallback to speech; and a desk that built no
    // rung for this state renders nothing rather than an empty frame.
    expect(drawnAtMount('economics.__nowhere', rung)).toBeNull();
    expect(drawnAtMount('economics.foodTile', null)).toBeNull();
    expect(drawnAtMount('', rung)).toBeNull();
    // Every shipped row is answerable — no position in the table is unreachable to the one
    // function a component is allowed to ask.
    for (const row of DOSSIER_MOUNTS) expect(drawnAtMount(row.mount, rung)).not.toBeNull();
  });

  test('the rung vocabulary is closed, and DETAIL is deliberately not a mount choice', () => {
    expect([...RUNG_VOCABULARY].sort()).toEqual(['glance', 'sentence']);
    // The legibility ladder has three rungs and only two of them are a DRAW. A detail is
    // translated rows, so every position may render one and no position competes for it;
    // putting `detail` in this vocabulary would invite a row that renders nothing at all.
    expect(RUNG_VOCABULARY.has('detail')).toBe(false);
  });
});

/**
 * THE PUBLIC-DOSSIER GUARD — the structural cure for a leak that was patched twice.
 *
 * WHY THIS EXISTS AS A GUARD RATHER THAN A THIRD GATE. `publicDossier` is
 * `readOnly && !saveId` (OutputContainer.jsx), i.e. a shared gallery dossier with no owning
 * save — a FREE, ANONYMOUS viewer. §885.3 rules dossier corpus prose a PAID surface, so a
 * desk must not draw there. That gate was added by hand for `economics`, then again by hand
 * for `power`. Two hand-fitted instances of one rule is the point at which the third ships
 * broken: only four of the router's fourteen tabs receive the flag at all, so a desk landing
 * on any of the other ten would leak SILENTLY — a free viewer simply sees prose, and nothing
 * in the estate reads rendered output.
 *
 * DERIVED FROM THE REGISTRY SO IT CANNOT ROT. The mounted tab set and mounted desk set both
 * come from DOSSIER_MOUNTS, never a hand list, so a car that adds a row for a new tab is
 * measured by this arm on the same commit that adds the row.
 *
 * ⚠ THE READING DISCIPLINE, AND IT IS THIS FILE'S OWN LESSON RE-LEARNED. `codeOnly` blanks
 * comments AND string CONTENTS, so a tab id — which lives inside a quoted `case 'power':` —
 * is blanked by it, and an import path is blanked entirely. A first cut of this guard read
 * the tab id out of `codeOnly` and every arm failed at once. The correct discipline, and the
 * reason `codeOnly` preserves offsets: LOCATE in the raw source, VERIFY at the same offset
 * in the stripped source. A `case 'x':` inside a comment has its whole span blanked, and one
 * inside a string literal has its contents blanked, so neither survives the offset check
 * while a real branch does.
 *
 * ⚠ WHAT ARM 2 PROVES AND WHAT IT DOES NOT, stated rather than implied. It is a PROXIMITY
 * test — the desk call must sit within 400 characters of a `publicDossier` read — which is a
 * structural claim about one expression, not a dataflow proof. It cannot catch a caller that
 * reads the flag and ignores it. It CAN catch the defect that actually shipped twice: a desk
 * wired on a tab whose component never received the flag. A guard that overstated itself
 * would be worse than one that says where it stops.
 *
 * ── ARM 3, AND THE HOP THAT HAD NO ARM ───────────────────────────────────────────────
 * ARMS 1 AND 2 GUARD THE TWO ENDS OF A CHAIN AND NOT ITS MIDDLE. The router computes the
 * flag; ARM 1 proves it reaches a mounted TAB; ARM 2 proves the desk call is a gated
 * expression. Between them sits a hop neither one reads, and it opened the day a desk stopped
 * being called by its own tab: `warFaith` spans two tabs and `general` spans seven, ARM 2
 * admits EXACTLY ONE caller per desk, so both had to move their gate into a shared READ
 * MODULE that the tabs call. The flag is then a PARAMETER of that module — and a parameter
 * has a default. `generalDeskLines`'s reads `options.publicDossier === true`, so a tab that
 * calls it with no flag gets the SPEAKING path, silently, on a free viewer's dossier. ARM 1
 * stays green (the router still hands the tab the prop), ARM 2 stays green (the gate
 * expression is intact and the flag is right there beside the call), and the leak ships.
 *
 * ⛔⛔ AND THE CALLER SET IS RESOLVED BY IMPORT PATH, WHICH IS THE OTHER HALF OF THE SAME
 * LESSON. ARM 2 finds a desk's callers by grepping the literal `<desk>StateProse(` — ONE
 * export name. DESK-DEF2 then landed a SECOND defense-desk drawer: `ViabilityTab` binds
 * `defenseMagicDependencyProse` for `viability.magicDependency` and never spells the entry
 * point, so that reader returns ONE while the tree holds TWO and ARM 2's "exactly one caller"
 * passes while it has stopped covering the tree (DEF2 measured it and routed the cure here
 * rather than edit this file under another lane). Every clause below therefore starts from
 * `deskImporters` — any component importing the leaf, whatever name it binds. An import PATH
 * cannot be aliased away; an export NAME can, and PLANT 5 is that alias.
 *
 * SO ARM 3 ASKS WHERE THE FLAG CAME FROM, AND WHAT ELSE IT WAS OWED. Three clauses, all
 * derived from O2GATE's own shape rather than invented, each TOTAL over every importer.
 * (a) The name a gate reads must ARRIVE — be a parameter of the function that holds the gate,
 * or be read off a parameter object it receives. (b) Every component that reaches a desk
 * through a shared reader must HAND it that flag and hold one itself. (c) EVERY name a
 * component imports from a mounted desk's corpus leaf must be gated in the statement of each
 * of its calls, not just the entry point ARM 2 reads: `defenseStateProse.js` hands DefenseTab six further producers,
 * `powerStateProse.js` hands PowerTab `powerLadderRung` and `stressorsStateProse.js` hands
 * OverviewTab `crisisBannerRung` — NINE corpus reads beside the five ARM 2 knows about, every
 * one gated today by hand with nothing asking.
 *
 * CLAUSE (a) ALSO CLOSES A HOLE IN ARM 2'S PROXIMITY WINDOW that predates the read modules:
 * `const publicDossier = false;` written one line above the desk call satisfies a
 * 400-character lookback exactly, gates nothing, and would ship the whole corpus to an
 * anonymous viewer. A flag a file writes for itself is a constant wearing a flag's name.
 *
 * ⚠ WHERE ARM 3 STOPS, said plainly. It reads `function` DECLARATIONS for signatures. A gate
 * moved into an arrow expression has no signature this reader can find and REDS rather than
 * passes — the fail-closed direction — which is why the limit is stated rather than cured.
 * And like ARM 2 it is a structural claim, not a dataflow proof: it cannot catch a consumer
 * that passes `publicDossier: false` on purpose. It catches the omission, which is the shape
 * that has actually shipped, twice by hand and once more the moment a default appeared.
 */
describe('THE PUBLIC-DOSSIER GUARD — a mounted desk never draws for a free viewer', () => {
  const ROUTER_RAW = readFileSync(join(ROOT, ROUTER), 'utf8');
  const ROUTER_CODE = codeOnly(ROUTER_RAW);
  const MOUNTED_TABS = [...new Set(DOSSIER_MOUNTS.map((row) => row.tab))].sort();
  const MOUNTED_DESKS = [...new Set(DOSSIER_MOUNTS.map((row) => row.desk))].sort();

  /**
   * The offset of a REAL `case '<tab>':` branch — located in raw, verified in stripped.
   * @param {string} tab @param {string} raw @param {string} code @returns {number}
   */
  function caseOffset(tab, raw, code) {
    const needle = `case '${tab}':`;
    for (let i = raw.indexOf(needle); i >= 0; i = raw.indexOf(needle, i + 1)) {
      // A commented branch has its whole span blanked; one inside a string literal has its
      // contents blanked. Only a real branch still reads `case '` at this exact offset.
      if (code.startsWith("case '", i)) return i;
    }
    return -1;
  }

  /**
   * One tab's case block, returned as STRIPPED source so the containment test below reads
   * an identifier in code and never a mention in prose.
   * @param {string} tab @param {string} [raw] @param {string} [code] @returns {string}
   */
  function routerCaseBlock(tab, raw = ROUTER_RAW, code = ROUTER_CODE) {
    const start = caseOffset(tab, raw, code);
    if (start < 0) return '';
    const next = code.indexOf("case '", start + 6);
    return code.slice(start, next < 0 ? code.length : next);
  }

  const COMPONENT_FILES = walkSources(COMPONENTS);

  /**
   * The file(s) that CALL one desk. The call is read from stripped source (a call cannot
   * execute from inside a literal); the import is confirmed in raw, because the path IS a
   * literal and `codeOnly` blanks it by design.
   * @param {string} desk @returns {string[]}
   */
  function deskCallSites(desk) {
    const fn = `${desk}StateProse`;
    return COMPONENT_FILES.filter((path) => {
      const raw = readFileSync(path, 'utf8');
      return raw.includes(`stateProse/${fn}.js`) && codeOnly(raw).includes(`${fn}(`);
    });
  }

  // ── ARM 3's readers. Each is pure and takes its source, so the controls below drive the
  //    same functions the shipped arm does. ─────────────────────────────────────────────

  /**
   * The contents of the balanced-paren span opening at `open`. Read from STRIPPED source, so
   * a parenthesis inside a comment or a quoted literal cannot unbalance it.
   * @param {string} code @param {number} open the offset of the `(` @returns {string}
   */
  function parenSpan(code, open) {
    let depth = 0;
    for (let i = open; i < code.length; i += 1) {
      if (code[i] === '(') depth += 1;
      else if (code[i] === ')') { depth -= 1; if (depth === 0) return code.slice(open + 1, i); }
    }
    return '';
  }

  /** Every declared function's PARAMETER span. @param {string} code @returns {string[]} */
  function signatureSpans(code) {
    return [...code.matchAll(/\bfunction\s+[A-Za-z0-9_$]+\s*\(/g)]
      .map((match) => parenSpan(code, match.index + match[0].length - 1));
  }

  /**
   * Does this file obtain `publicDossier` from OUTSIDE itself? Either the name is a parameter
   * of some function it declares (`EconomicsTab({ …, publicDossier })`), or it is read off a
   * parameter object one of them receives (`generalDeskLines(s, options)` reading
   * `options.publicDossier`). A `const publicDossier = …` the file writes for itself is not a
   * flag, and this is the whole distinction ARM 2's proximity window cannot draw.
   * @param {string} code @returns {boolean}
   */
  function flagArrivesAsParameter(code) {
    const spans = signatureSpans(code);
    if (spans.some((span) => /\bpublicDossier\b/.test(span))) return true;
    const names = new Set(spans.flatMap(
      (span) => [...span.matchAll(/[A-Za-z_$][A-Za-z0-9_$]*/g)].map((match) => match[0]),
    ));
    return [...names].some((name) => new RegExp(`\\b${name}\\.publicDossier\\b`).test(code));
  }

  /**
   * The ARGUMENTS of every call to `fn`, its own declaration excluded and a method of the
   * same name (`x.fn(`) excluded with it.
   * @param {string} code @param {string} fn @returns {string[]}
   */
  function callArgumentSpans(code, fn) {
    const out = [];
    for (const match of code.matchAll(new RegExp(`(^|[^A-Za-z0-9_$.])(${fn})(\\s*)\\(`, 'g'))) {
      const idStart = match.index + match[1].length;
      const open = idStart + fn.length + match[3].length;
      if (/\bfunction\s+$/.test(code.slice(Math.max(0, idStart - 20), idStart))) continue;
      out.push(parenSpan(code, open));
    }
    return out;
  }

  /**
   * The STATEMENT a call sits in, read backwards from its own `(`. Nesting in PARENTHESES is
   * walked THROUGH rather than stopped at — a corpus read is very often an argument to
   * `drawnAtMount(...)`, and a reader that stopped at the first enclosing paren would grade
   * the ternary that gates it as absent. A statement ends at a `;` at group depth zero, or at
   * a `{` at group depth zero, which is a BLOCK opener: a depth-zero `{` reached backwards
   * cannot be an object literal we are inside, because that literal's `}` would have raised
   * the depth first.
   *
   * ⚠ THE BRACE STOP IS LOAD-BEARING AND A PLANT FOUND IT. Without it the walk runs back out
   * of the function body and into its own SIGNATURE — so a corpus read written as the first
   * statement of `function Tab({ settlement, publicDossier })` read as GATED while nothing
   * gated it. PLANT 6 is that shape.
   * @param {string} code @param {number} at the offset of the call's `(` @returns {string}
   */
  function enclosingStatement(code, at) {
    let depth = 0;
    let i = at - 1;
    for (; i >= 0; i -= 1) {
      const c = code[i];
      if (c === '}' || c === ')' || c === ']') depth += 1;
      else if (c === '(' || c === '[') { if (depth > 0) depth -= 1; }
      else if (c === '{') { if (depth === 0) break; depth -= 1; }
      else if (c === ';' && depth === 0) break;
    }
    return code.slice(i + 1, at);
  }

  /**
   * ⛔ THE THIRD CLAUSE, AND IT GUARDS NINE SITES ARM 2 NEVER LOOKS AT. ARM 2 reads exactly
   * one name per desk — `<desk>StateProse(` — and a corpus leaf exports MORE than its entry
   * point. `defenseStateProse.js` hands DefenseTab six further producers, `powerStateProse.js`
   * hands PowerTab `powerLadderRung`, `stressorsStateProse.js` hands OverviewTab
   * `crisisBannerRung`; every one of them builds corpus rungs and every one is gated TODAY BY
   * HAND, with nothing asking. So: every name a component imports from a mounted desk's leaf
   * must have `publicDossier` in the STATEMENT of each of its calls.
   * @param {readonly string[]} desks
   * @param {(path: string) => string} read
   * @param {readonly string[]} tree
   * @returns {string[]}
   */
  function ungatedCorpusReads(desks, read, tree) {
    const bad = [];
    const leaves = new Set(desks.map((desk) => `stateProse/${desk}StateProse.js`));
    for (const file of tree) {
      const raw = read(file);
      const imports = [...raw.matchAll(
        /import\s*\{([^}]*)\}\s*from\s*'([^']*stateProse\/[A-Za-z0-9_]+StateProse)\.js'/g,
      )].filter((match) => [...leaves].some((leaf) => `${match[2]}.js`.endsWith(leaf)));
      if (imports.length === 0) continue;
      const code = codeOnly(raw);
      for (const match of imports) {
        const names = match[1].split(',')
          .map((piece) => piece.trim().split(/\s+as\s+/).pop())
          .filter((name) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name || ''));
        for (const name of names) {
          for (const call of code.matchAll(new RegExp(`(^|[^A-Za-z0-9_$.])${name}\\s*\\(`, 'g'))) {
            const open = call.index + call[0].length - 1;
            if (/\bfunction\s+$/.test(code.slice(Math.max(0, open - 30), open - name.length))) continue;
            if (!/\bpublicDossier\b/.test(enclosingStatement(code, open))) {
              bad.push(`${relative(ROOT, file).replace(/\\/g, '/')}: ${name}() reads the corpus`
                + ' in a statement that never mentions publicDossier, so a free anonymous'
                + ' viewer draws it');
            }
          }
        }
      }
    }
    return bad;
  }

  /**
   * The names a file BINDS from one desk's corpus leaf, aliases resolved to the local name.
   * @param {string} raw @param {string} desk @returns {string[]}
   */
  function boundNames(raw, desk) {
    const out = [];
    for (const match of raw.matchAll(
      /import\s*\{([^}]*)\}\s*from\s*'([^']*stateProse\/[A-Za-z0-9_]+StateProse)\.js'/g,
    )) {
      if (!`${match[2]}.js`.endsWith(`stateProse/${desk}StateProse.js`)) continue;
      for (const piece of match[1].split(',')) {
        const name = piece.trim().split(/\s+as\s+/).pop();
        if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name || '')) out.push(name);
      }
    }
    return [...new Set(out)];
  }

  /**
   * ⛔ EVERY COMPONENT THAT IMPORTS ONE DESK'S LEAF, BY IMPORT-PATH IDENTITY. This is the
   * reader ARM 2 does not have, and the difference is not theoretical: DESK-DEF2 landed a
   * SECOND defense-desk drawer (`ViabilityTab`, for `viability.magicDependency`) that binds
   * `defenseMagicDependencyProse` rather than the leaf's entry point, so `deskCallSites` —
   * which greps the literal `<desk>StateProse(` — returns ONE while the tree holds TWO, and
   * ARM 2's "exactly one caller" passes while it has stopped covering the tree. DEF2 measured
   * that and routed the cure here rather than editing this file under another lane. An import
   * PATH cannot be aliased away; an export NAME can.
   * @param {string} desk @param {(path: string) => string} read @param {readonly string[]} tree
   * @returns {string[]}
   */
  function deskImporters(desk, read, tree) {
    return tree.filter((file) => read(file).includes(`stateProse/${desk}StateProse.js`));
  }

  /**
   * The EXPORTED functions of one file that actually reach the desk: for every call of a bound
   * name, the nearest exported function above it. `''` marks a call that sits inside none,
   * which is a fault rather than a reader.
   * @param {string} code @param {readonly string[]} names @returns {string[]}
   */
  function deskReadersIn(code, names) {
    const found = [];
    for (const name of names) {
      for (const call of code.matchAll(new RegExp(`(^|[^A-Za-z0-9_$.])${name}\\s*\\(`, 'g'))) {
        const at = call.index + call[0].length - 1;
        if (/\bfunction\s+$/.test(code.slice(Math.max(0, at - 30), at - name.length))) continue;
        const heads = [...code.slice(0, at)
          .matchAll(/\bexport\s+(?:default\s+)?function\s+([A-Za-z0-9_$]+)\s*\(/g)];
        found.push(heads.length ? heads[heads.length - 1][1] : '');
      }
    }
    return [...new Set(found)];
  }

  /**
   * ARM 3's whole rule, as offences. TOTAL over the desks passed in, with the source reader and
   * the component tree injectable, so the shipped table and the planted controls are judged by
   * one function. Callers are resolved by IMPORT PATH, never by a call spelling.
   * @param {readonly string[]} desks
   * @param {(path: string) => string} [read]
   * @param {readonly string[]} [tree]
   * @returns {string[]}
   */
  function threadingFaults(desks, read = (p) => readFileSync(p, 'utf8'), tree = COMPONENT_FILES) {
    const bad = [];
    const label = (path) => relative(ROOT, path).replace(/\\/g, '/');
    for (const desk of desks) {
      const importers = deskImporters(desk, read, tree);
      if (importers.length === 0) {
        bad.push(`${desk}: no component under src/components imports its corpus leaf, so a`
          + ' mounted desk draws from nowhere this arm can see');
        continue;
      }
      for (const drawer of importers) {
        const code = codeOnly(read(drawer));
        const readers = deskReadersIn(code, boundNames(read(drawer), desk));
        if (readers.includes('')) {
          bad.push(`${desk}: a desk read in ${label(drawer)} sits inside no exported function,`
            + ' so there is nothing a caller could hand a flag to');
        }
        // CLAUSE (a), now over EVERY drawer rather than one: the flag must ARRIVE.
        if (!flagArrivesAsParameter(code)) {
          bad.push(`${desk}: ${label(drawer)} does not RECEIVE publicDossier — the name its gate`
            + ' reads is written by that file itself, and a flag a file writes for itself gates'
            + ' nothing');
        }
        // CLAUSE (b), now from EVERY drawer: a shared reader must be handed the flag.
        for (const reader of readers.filter(Boolean)) {
          for (const file of tree) {
            if (file === drawer) continue;
            const raw = read(file);
            if (!raw.includes(basename(drawer))) continue;
            const consumer = codeOnly(raw);
            for (const args of callArgumentSpans(consumer, reader)) {
              if (!/\bpublicDossier\b/.test(args)) {
                bad.push(`${desk}: ${label(file)} reads the desk through ${reader}() and hands it`
                  + ' no publicDossier, so the shared reader falls back to its own default');
              } else if (!flagArrivesAsParameter(consumer)) {
                bad.push(`${desk}: ${label(file)} hands ${reader}() a publicDossier it does not`
                  + ' itself receive');
              }
            }
          }
        }
      }
    }
    return [...new Set([...bad, ...ungatedCorpusReads(desks, read, tree)])].sort();
  }

  test('guard the guard: the case reader takes a real branch and skips prose and literals', () => {
    const raw = [
      "// case 'ghost': a comment, and it must not be found",
      'const s = "case \'phantom\':";',
      "switch (t) { case 'real': return <X publicDossier={publicDossier} />;",
      "  case 'bare': return <Y />; }",
    ].join('\n');
    const code = codeOnly(raw);
    expect(caseOffset('ghost', raw, code), 'a commented branch was taken for a real one').toBe(-1);
    expect(caseOffset('phantom', raw, code), 'a branch inside a string was taken').toBe(-1);
    expect(caseOffset('real', raw, code)).toBeGreaterThan(-1);
    expect(routerCaseBlock('real', raw, code)).toContain('publicDossier');
    // The negative the arms depend on: an ungated block is DISTINGUISHABLE, or arm 1 is vacuous.
    // `raw` is a literal built four lines up in this test body, and the line above proves
    // the SAME reader finds the flag in the 'real' branch of that literal — so this
    // absence is the reader discriminating, not the reader having stopped working.
    // anchored: the line above finds the flag in the 'real' branch of this same literal
    expect(routerCaseBlock('bare', raw, code)).not.toContain('publicDossier');
  });

  test('ARM 1: every tab carrying a mount row receives publicDossier from the router', () => {
    expect(MOUNTED_TABS.length).toBeGreaterThan(0);
    for (const tab of MOUNTED_TABS) {
      const block = routerCaseBlock(tab);
      expect(block, `the router has no real case block for the mounted tab '${tab}'`).not.toBe('');
      expect(
        block,
        `TAB '${tab}' MOUNTS A STATE-PROSE DESK AND DOES NOT RECEIVE publicDossier.`
        + ' A public gallery dossier is a free, anonymous viewer and §885.3 rules corpus'
        + ' prose a PAID surface. Pass publicDossier={publicDossier} to this tab and gate'
        + ' the desk call on it, the way EconomicsTab and PowerTab do.',
      ).toContain('publicDossier');
    }
  });

  test('ARM 2: every mounted desk has exactly one caller, and that caller gates on the flag', () => {
    expect(MOUNTED_DESKS.length).toBeGreaterThan(0);
    for (const desk of MOUNTED_DESKS) {
      const sites = deskCallSites(desk);
      // Exactly one caller is what keeps the gate auditable: two call sites are two places
      // to forget, and would also break the one-position reading the registry assumes.
      expect(sites.map((p) => relative(ROOT, p)), `desk '${desk}' call sites`).toHaveLength(1);
      const code = codeOnly(readFileSync(sites[0], 'utf8'));
      const call = code.indexOf(`${desk}StateProse(`);
      expect(call).toBeGreaterThan(-1);
      expect(
        code.slice(Math.max(0, call - 400), call),
        `desk '${desk}' is called in ${relative(ROOT, sites[0])} with no publicDossier read`
        + ` in the same expression. Gate it: const deskProse = publicDossier ? <rungs null>`
        + ` : ${desk}StateProse(...)`,
      ).toContain('publicDossier');
    }
  });

  test('NON-VACUITY: an ungated tab and an ungated desk call are both convicted', () => {
    const ungatedRouter = "switch (t) { case 'power': return <PowerTab settlement={s} />; }";
    // `ungatedRouter` is a literal built on the line above, and the SHIPPED positive
    // control at the end of this test proves the same reader finds the flag. The
    // annotation rides the `.not.` line itself because this negative is split across two
    // lines and the walker's lookback is exactly one line from the matcher, not the expect.
    expect(routerCaseBlock('power', ungatedRouter, codeOnly(ungatedRouter)))
      .not.toContain('publicDossier'); // anchored: the shipped positive control below proves the reader works
    const ungatedCaller = codeOnly([
      "import { powerStateProse } from '../../../domain/display/stateProse/powerStateProse.js';",
      'const deskProse = powerStateProse(s, { seed });',
    ].join('\n'));
    const at = ungatedCaller.indexOf('powerStateProse(');
    expect(at, 'the fixture no longer contains the call the slice is taken around').toBeGreaterThan(-1);
    // `ungatedCaller` is a literal built in this test body and `at` is pinned to a real
    // offset on the line above, so the slice is non-empty by construction.
    // anchored: `at` is pinned to a real offset on the line above
    expect(ungatedCaller.slice(Math.max(0, at - 400), at)).not.toContain('publicDossier');
    // The SHIPPED tree is the positive control standing beside both negatives.
    expect(routerCaseBlock('power')).toContain('publicDossier');
  });

  test('guard the guard: the span reader takes one call and its own arguments, and a received flag is told from a self-written one', () => {
    // A span stops at ITS OWN close paren, so two calls on one line are two argument lists.
    const pair = codeOnly('const a = f({ publicDossier }); const b = g({ playerView });');
    expect(callArgumentSpans(pair, 'f')).toEqual(['{ publicDossier }']);
    expect(callArgumentSpans(pair, 'g')).toEqual(['{ playerView }']);
    // A nested call inside the arguments does not close the span early — the defect that
    // would make every multi-argument gate read as flagless.
    expect(callArgumentSpans(codeOnly('h(map(x), publicDossier);'), 'h'))
      .toEqual(['map(x), publicDossier']);
    // The DECLARATION is not a call site, or every shared reader would convict itself; the
    // recursive call beside it still is.
    expect(callArgumentSpans(codeOnly('function h(publicDossier) { return h(publicDossier); }'), 'h'))
      .toEqual(['publicDossier']);
    // A method of the same name on some other object is not this reader.
    expect(callArgumentSpans(codeOnly('desk.h(nothing);'), 'h')).toEqual([]);
    // THE PROVENANCE RULE, all four directions. A named parameter is a flag…
    expect(flagArrivesAsParameter(codeOnly(
      'export function Tab({ settlement, publicDossier = false }) { return publicDossier; }',
    ))).toBe(true);
    // …so is one read off a parameter OBJECT, which is the shared-read-module shape…
    expect(flagArrivesAsParameter(codeOnly(
      'export function read(s, options = {}) { const publicDossier = options.publicDossier === true; return publicDossier; }',
    ))).toBe(true);
    // …a constant the file writes for itself is NOT, and this is precisely the shape ARM 2's
    // 400-character lookback passes: the gate expression is intact and gates nothing…
    expect(flagArrivesAsParameter(codeOnly(
      'const publicDossier = false;\nexport function Tab({ settlement }) { return publicDossier; }',
    ))).toBe(false);
    // …and neither is a file with no function for a flag to arrive on at all.
    expect(flagArrivesAsParameter(codeOnly('const publicDossier = true;'))).toBe(false);
    // THE STATEMENT READER walks THROUGH nesting, because a corpus read is usually an
    // argument to drawnAtMount(…) and a reader that stopped at the first enclosing paren
    // would grade the ternary gating it as absent — a false red on shipped code.
    const nested = codeOnly('const a = 1;\nconst drawn = publicDossier ? null : draw(M, rung(s));');
    expect(enclosingStatement(nested, nested.indexOf('rung(') + 4)).toContain('publicDossier');
    // And it does not reach BACK past the previous statement, or every gate in a file would
    // launder every read after it.
    const after = codeOnly('const gate = publicDossier ? 1 : 2;\nconst drawn = draw(M, rung(s));');
    expect(enclosingStatement(after, after.indexOf('rung(') + 4)).toBe('\nconst drawn = draw(M, rung');
    // …nor back out of a function BODY into its own SIGNATURE, which would let a component
    // that merely RECEIVES the flag pass for one that USES it. A plant found this.
    const firstLine = codeOnly('export function Tab({ s, publicDossier = false }) { return rung(s); }');
    expect(enclosingStatement(firstLine, firstLine.indexOf('rung(') + 4)).toBe(' return rung');
  });

  test('ARM 3: every corpus read is gated, and the flag it is gated on ARRIVED from outside the file that reads it', () => {
    expect(MOUNTED_DESKS.length, 'no desk is mounted, so this arm walked nothing')
      .toBeGreaterThan(0);
    expect(
      threadingFaults(MOUNTED_DESKS),
      'A CORPUS READ IS UNGATED, or the publicDossier it is gated on never ARRIVED. ARM 1'
      + ' proves the ROUTER passes the flag to a mounted tab and ARM 2 proves ONE name per'
      + ' desk is a gated expression; this arm covers what sits between and beside them.'
      + ' (a) A shared read module has a parameter DEFAULT, so a tab that omits the flag does'
      + ' not error — it silently takes the SPEAKING path on a free anonymous dossier.'
      + ' (b) A corpus leaf exports more than its entry point, and every one of those'
      + ' producers builds rungs ARM 2 never looks at. (c) A `const publicDossier = false`'
      + ' the file writes for itself satisfies a proximity window and gates nothing.'
      + ' Thread it: pass publicDossier at the call, receive it as a prop in the component'
      + ' that passes it, and gate every corpus read in its own statement.',
    ).toEqual([]);
  });

  test('NON-VACUITY: a self-written flag, a consumer that hands none, one threading a name it lacks, an ungated second producer and an ALIASED second drawer are each convicted', () => {
    const GATE = join(ROOT, 'src/components/new/probeDeskRead.js');
    const CONSUMER = join(ROOT, 'src/components/new/tabs/ProbeTab.jsx');
    const TREE = [GATE, CONSUMER];
    /** The lawful shape, written as the two landed shared readers actually write it — with
     *  the SECOND producer beside the entry point, which is DefenseTab's real shape. */
    const CLEAN_FILES = Object.freeze({
      [GATE]: [
        "import { probeStateProse, probeBannerRung } from '../../domain/display/stateProse/probeStateProse.js';",
        'export function probeDeskLines(settlement, options = {}) {',
        '  const publicDossier = options.publicDossier === true;',
        '  const banner = publicDossier ? null : probeBannerRung(settlement);',
        '  return publicDossier ? SILENT : probeStateProse(settlement, { banner });',
        '}',
      ].join('\n'),
      [CONSUMER]: [
        "import { probeDeskLines } from '../probeDeskRead.js';",
        'export function ProbeTab({ settlement, publicDossier = false }) {',
        '  return probeDeskLines(settlement, { publicDossier });',
        '}',
      ].join('\n'),
    });
    // The control table is clean, or every conviction below is free.
    expect(threadingFaults(['probe'], (p) => CLEAN_FILES[p], TREE)).toEqual([]);

    // PLANT 1 — the flag becomes a constant the gate file writes for itself. ARM 2's window
    // still sees `publicDossier` beside the call; ARM 3 sees that nothing can set it.
    const selfWritten = {
      ...CLEAN_FILES,
      [GATE]: CLEAN_FILES[GATE].replace(
        'const publicDossier = options.publicDossier === true;', 'const publicDossier = false;',
      ),
    };
    const one = threadingFaults(['probe'], (p) => selfWritten[p], TREE);
    expect(one, 'the self-written flag did not plant').toHaveLength(1);
    expect(one[0]).toContain('does not RECEIVE publicDossier');

    // PLANT 2 — the consumer stops handing the flag over. This is the hop that had no arm,
    // and the shared reader's own default then chooses the SPEAKING path.
    const handsNone = {
      ...CLEAN_FILES,
      [CONSUMER]: CLEAN_FILES[CONSUMER].replace('settlement, { publicDossier }', 'settlement, {}'),
    };
    const two = threadingFaults(['probe'], (p) => handsNone[p], TREE);
    expect(two, 'the flagless call did not plant').toHaveLength(1);
    expect(two[0]).toContain('hands it no publicDossier');

    // PLANT 3 — the consumer threads a name it does not itself receive, which is the same
    // omission one component further up the chain.
    const notHeld = {
      ...CLEAN_FILES,
      [CONSUMER]: CLEAN_FILES[CONSUMER].replace('{ settlement, publicDossier = false }', '{ settlement }'),
    };
    const three = threadingFaults(['probe'], (p) => notHeld[p], TREE);
    expect(three, 'the unheld flag did not plant').toHaveLength(1);
    expect(three[0]).toContain('a publicDossier it does not itself receive');

    // PLANT 4 — the leaf's SECOND producer loses its gate while the entry point keeps its
    // own. ARM 2 reads one name per desk and would never look here.
    const secondProducer = {
      ...CLEAN_FILES,
      [GATE]: CLEAN_FILES[GATE].replace(
        'const banner = publicDossier ? null : probeBannerRung(settlement);',
        'const banner = probeBannerRung(settlement);',
      ),
    };
    const four = threadingFaults(['probe'], (p) => secondProducer[p], TREE);
    expect(four, 'the ungated second producer did not plant').toHaveLength(1);
    expect(four[0]).toContain('probeBannerRung() reads the corpus');

    // PLANT 5 — ⛔ THE DEF2 SHAPE, and the one a call-spelling reader cannot see. A SECOND
    // component imports the same leaf under an ALIASED name, draws it, and writes its own
    // flag. Every clause that used to start from `deskCallSites` looked only at the file that
    // spelled `<desk>StateProse(`, so this drawer was never examined at all.
    const SECOND = join(ROOT, 'src/components/new/tabs/SecondProbeTab.jsx');
    const twoDrawers = {
      ...CLEAN_FILES,
      [SECOND]: [
        "import { probeBannerRung as aliasedRead } from '../../domain/display/stateProse/probeStateProse.js';",
        'const publicDossier = false;',
        'export function SecondProbeTab({ settlement }) {',
        '  return publicDossier ? null : aliasedRead(settlement);',
        '}',
      ].join('\n'),
    };
    const five = threadingFaults(['probe'], (p) => twoDrawers[p], [...TREE, SECOND]);
    expect(five, 'the aliased second drawer did not plant').toHaveLength(1);
    expect(five[0]).toContain('SecondProbeTab.jsx does not RECEIVE publicDossier');
    // …and the SAME second drawer, drawing UN-GATED under its alias, is convicted by the
    // corpus-read clause instead — the alias never hides the read.
    const aliasUngated = {
      ...twoDrawers,
      [SECOND]: twoDrawers[SECOND]
        .replace('const publicDossier = false;\n', '')
        .replace('export function SecondProbeTab({ settlement }) {', 'export function SecondProbeTab({ settlement, publicDossier = false }) {')
        .replace('return publicDossier ? null : aliasedRead(settlement);', 'return aliasedRead(settlement);'),
    };
    const six = threadingFaults(['probe'], (p) => aliasUngated[p], [...TREE, SECOND]);
    expect(six, 'the aliased un-gated draw did not plant').toHaveLength(1);
    expect(six[0]).toContain('aliasedRead() reads the corpus');

    // And a desk NO component imports at all is convicted before any of the above is read.
    expect(threadingFaults(['probe'], (p) => CLEAN_FILES[p], [CONSUMER]))
      .toEqual(['probe: no component under src/components imports its corpus leaf, so a mounted'
        + ' desk draws from nowhere this arm can see']);
  });
});

/**
 * ⛔⛔ THE FIRST-PAINT LAW — a lit sentence a reader cannot see is dark.
 *
 * `Primitives.jsx:114` (and `Collapsible` at :83) render a shut section as
 * `{open && <div>{children}</div>}`: a collapsed host emits NO BYTES AT ALL, not hidden
 * ones. So a SENTENCE row whose draw sits inside a host that is not open on first paint is
 * lit in the registry and dark on the page — and every instrument this file already owns
 * is green over it. The reachability arm sees the literal; the public-dossier guard sees
 * the gate; the desk builds the rung; the DOM carries nothing.
 *
 * IT WAS NOT UNNOTICED — IT WAS WORKED AROUND, TWICE, IN WRITING, BY TWO LANDED LANES.
 * `tests/ui/defenseTabFlow.test.js`'s docblock names the fold and answers it with an
 * `openSection()` click helper; `tests/ui/economicsTabFlow.test.js` names it and answers it
 * by choosing a fixture with a real food deficit so the fold opens. Both suites went green
 * and both readers stayed dark. That is why this belongs in the walker: a cure that lives
 * in a test fixture is not a cure, and the next position will meet the same fold.
 *
 * ── WHAT THE ARM HAS TO DO THAT THE REACHABILITY ARM CANNOT ──────────────────────────
 * The reachability arm counts a STRING LITERAL. The literal is nowhere near the draw:
 * `DefenseTab.jsx` names `defense.supportingCapabilities` in a module-scope const at line
 * 72 and renders it at 522, and `WarFaithDesk.jsx` names `war.standing` in a const that a
 * component in ANOTHER FILE renders. So this arm follows the mount:
 *   1. from its id — a `mount="…"` JSX prop, or the first argument of `drawnAtMount(…)`,
 *      spelled literally or through a module-scope const;
 *   2. through the CARRIER variables the call's value flows into, closed transitively over
 *      `const X = …carrier…` and SCOPED to the top-level declaration that owns them (two
 *      components in one file both naming a local `drawn` are two different values, and a
 *      file-wide reader hands each mount the other's draw sites — measured on
 *      `war.dormantNote` and `faith.nicheRow`, which share `WarFaithDesk.jsx`);
 *   3. OUT of the drawing component to every place that component is itself rendered,
 *      recursively, stopping at `OutputContainer.jsx` — the dossier root, and the frame a
 *      tab's own first paint happens inside.
 * Then every `<Section>`/`<Collapsible>` enclosing any of those sites is graded.
 *
 * ⚠ A HOST IS OPEN ONLY WHEN IT IS STATICALLY OPEN. `defaultOpen={false}` is shut for
 * every reader on every world; a DATA-DEPENDENT `defaultOpen={<expr>}` is shut for every
 * world on the wrong side of the cut, which is the same defect on those towns and not a
 * smaller one. Measured before this arm was written: `economics.shadowEconomy` sat behind
 * `defaultOpen={bmc>=15}`, true on 1 of 60 generated towns, so DS-ECO-6's one speaking
 * position was reaching under two percent of the worlds the generator builds.
 *
 * The escape is a REGISTRY DECLARATION, `visibility: 'closed-section'` plus a
 * `visibilityReason` the arm holds to a length, and it is TWO-SIDED: a row that declares
 * the exemption while its host is actually open is convicted too, so a declaration cannot
 * outlive the layout that earned it.
 */
describe('THE FIRST-PAINT LAW — a sentence behind a shut fold reaches no reader', () => {
  const HOST_TAGS = Object.freeze(['Section', 'Collapsible']);
  const DOSSIER_ROOT = 'src/components/OutputContainer.jsx';
  /** A declaration has to argue; this is the floor that stops a token buying an exemption. */
  const REASON_FLOOR = 120;

  /**
   * Comments blanked to spaces, OFFSETS AND NEWLINES PRESERVED and string literals left
   * alone. The shared `codeOnly` blanks literal CONTENTS, which is the opposite of what a
   * reader that must recover a mount id out of `drawnAtMount('economics.foodSecurity', …)`
   * needs, and this arm reports line numbers, so the length must not move.
   * @param {string} src @returns {string}
   */
  function blankComments(src) {
    const out = src.split('');
    let i = 0;
    const n = src.length;
    while (i < n) {
      const c = src[i];
      if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') { out[i] = ' '; i += 1; } continue; }
      if (c === '/' && src[i + 1] === '*') {
        out[i] = ' '; out[i + 1] = ' ';
        i += 2;
        while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] !== '\n') out[i] = ' '; i += 1; }
        if (i < n) { out[i] = ' '; out[i + 1] = ' '; i += 2; }
        continue;
      }
      if (c === "'" || c === '"' || c === '`') {
        i += 1;
        while (i < n && src[i] !== c) { if (src[i] === '\\') i += 1; i += 1; }
        i += 1;
        continue;
      }
      i += 1;
    }
    return out.join('');
  }

  /**
   * Every `<Section …>` / `<Collapsible …>` SPAN in a file, as `{from, to, tag, attrs}`.
   * FAIL-CLOSED: an unbalanced tree throws rather than answering, because a reader that
   * silently mis-paired one tag would grade a shut host as open.
   * @param {string} code @param {string} where @returns {{from:number,to:number,tag:string,attrs:string}[]}
   */
  function hostFrames(code, where) {
    const events = [];
    for (const tag of HOST_TAGS) {
      for (const m of code.matchAll(new RegExp(`<${tag}(?=[\\s>/])`, 'g'))) {
        let i = m.index + tag.length + 1;
        let depth = 0;
        let selfClose = false;
        for (; i < code.length; i += 1) {
          const c = code[i];
          if (c === '{') depth += 1;
          else if (c === '}') depth -= 1;
          else if (c === '>' && depth === 0) { selfClose = code[i - 1] === '/'; break; }
        }
        if (selfClose) continue;                        // no children, so nothing to hide
        events.push({ pos: m.index, kind: 'open', tag, attrs: code.slice(m.index, i + 1).replace(/\s+/g, ' ') });
      }
      for (const m of code.matchAll(new RegExp(`</${tag}\\s*>`, 'g'))) events.push({ pos: m.index, kind: 'close', tag });
    }
    events.sort((a, b) => a.pos - b.pos);
    const frames = [];
    const stack = [];
    for (const e of events) {
      if (e.kind === 'open') { stack.push(e); continue; }
      const top = stack.pop();
      if (!top || top.tag !== e.tag) throw new Error(`unbalanced <${e.tag}> at offset ${e.pos} in ${where}`);
      frames.push({ from: top.pos, to: e.pos, tag: top.tag, attrs: top.attrs });
    }
    if (stack.length !== 0) throw new Error(`${stack.length} unclosed host tag(s) in ${where}`);
    return frames;
  }

  /**
   * Is this host OPEN on first paint?
   *
   * ⚠ THE TAG DECIDES WHETHER THERE IS A FOLD AT ALL, AND A GUARD-THE-GUARD ARM CAUGHT
   * THIS FILE GETTING IT WRONG. `Section` is a plain header UNLESS it is passed
   * `collapsible`; `Collapsible` IS the fold and takes no such prop. Keying on the
   * attribute alone graded every `<Collapsible defaultOpen={false}>` as OPEN — there are
   * three in the tree today (`HistoryTab.jsx:230`/`:252`, `NPCsTab.jsx:162`) and the first
   * mount to land inside one would have passed this arm in silence.
   *
   * A fold is open only when `defaultOpen` is STATICALLY true — bare, `{true}`, or absent
   * (both primitives default the parameter to `true`).
   * @param {string} attrs the opening tag, `<Section …>` or `<Collapsible …>`
   * @returns {'open'|'closed'|'conditional'}
   */
  function hostOpenness(attrs) {
    const folds = attrs.startsWith('<Collapsible') || /\bcollapsible\b/.test(attrs);
    if (!folds) return 'open';
    const m = attrs.match(/\bdefaultOpen\s*(=\s*(\{[^]*?\}|"[^"]*"|'[^']*'))?/);
    if (!m || !m[2]) return 'open';
    const value = m[2].replace(/^\{|\}$/g, '').trim();
    if (value === 'true') return 'open';
    if (value === 'false') return 'closed';
    return 'conditional';
  }

  /** Module-scope `const NAME = 'literal';` bindings — how every tab spells its own mounts. */
  function stringConsts(raw) {
    const map = new Map();
    for (const m of raw.matchAll(/\bconst\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*(['"])([^'"\n]*)\2\s*;/g)) map.set(m[1], m[3]);
    return map;
  }

  /**
   * The STATEMENT a call sits in, read backwards from its own `(` — ARM 3's reader, brace
   * stop included: a depth-zero `{` reached backwards is a block opener and never an object
   * literal we are inside, because that literal's `}` would have raised the depth first.
   * @param {string} code @param {number} at @returns {string}
   */
  function enclosingStatement(code, at) {
    let depth = 0;
    let i = at - 1;
    for (; i >= 0; i -= 1) {
      const c = code[i];
      if (c === '}' || c === ')' || c === ']') depth += 1;
      else if (c === '(' || c === '[') { if (depth > 0) depth -= 1; }
      else if (c === '{') { if (depth === 0) break; depth -= 1; }
      else if (c === ';' && depth === 0) break;
    }
    return code.slice(i + 1, at);
  }

  /** The first argument of the call whose `(` sits at `open`. @returns {string} */
  function firstArgument(raw, open) {
    let depth = 0;
    for (let i = open; i < raw.length; i += 1) {
      const c = raw[i];
      if (c === '(' || c === '[' || c === '{') depth += 1;
      else if (c === ')' || c === ']' || c === '}') { depth -= 1; if (depth === 0) return raw.slice(open + 1, i); }
      else if (c === ',' && depth === 1) return raw.slice(open + 1, i);
    }
    return '';
  }

  /**
   * The TOP-LEVEL declarations of a module, each running to the next. A carrier is
   * function-scoped in the language and is read that way here.
   */
  function declarationSpans(code) {
    const marks = [];
    const re = /^(?:export\s+)?(?:default\s+)?(?:function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(|const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=)/gm;
    for (const m of code.matchAll(re)) marks.push({ name: m[1] || m[2], from: m.index });
    return marks.map((mark, i) => ({
      name: mark.name, from: mark.from, to: i + 1 < marks.length ? marks[i + 1].from : code.length,
    }));
  }

  /** The index of the `)` closing the `(` at `open`, or -1 when the file is unbalanced. */
  function closingParen(code, open) {
    let depth = 0;
    for (let i = open; i < code.length; i += 1) {
      const c = code[i];
      if (c === '(' || c === '[' || c === '{') depth += 1;
      else if (c === ')' || c === ']' || c === '}') { depth -= 1; if (depth === 0) return i; }
    }
    return -1;
  }

  /**
   * The `.a.b.c` property chain standing at `at`, and the offset just past it.
   * @returns {{names: string[], end: number}}
   */
  function propertyChain(code, at) {
    const names = [];
    let i = at;
    for (;;) {
      const m = /^\s*\.\s*([A-Za-z_$][A-Za-z0-9_$]*)/.exec(code.slice(i, i + 120));
      if (!m) return { names, end: i };
      names.push(m[1]);
      i += m[0].length;
    }
  }

  /** Is the `{` at `i` an object LITERAL rather than a block or a destructuring pattern? */
  function isObjectOpen(code, i) {
    let j = i - 1;
    while (j >= 0 && /\s/.test(code[j])) j -= 1;
    if (j < 0) return false;
    if ('(,=:['.includes(code[j])) return true;
    return /\breturn$/.test(code.slice(Math.max(0, j - 6), j + 1));
  }

  /**
   * ⭐ THE GENERAL DESK'S FIELD INDIRECTION, READ OFF THE READER'S OWN SOURCE.
   *
   * A tab that draws a general-desk position NEVER NAMES THE MOUNT — and that is deliberate,
   * not an oversight: the reachability arm counts string LITERALS under `src/components` and
   * refuses a position named twice, so an id that speaks on seven tabs has to be spelled
   * once. `generalDeskRead.js` spells it, binding `<group>: {<field>: … line(<X>_MOUNT, …)}`
   * over `const <X>_MOUNT = '<id>'`, and a tab reads `generalDeskLines(s, …).<group>.<field>`.
   * The FIELD NAME is the whole of what the tab carries, so an arm that follows only `mount=`
   * props and `drawnAtMount(…)` calls can follow no draw site for any of them.
   *
   * ⛔ IT IS BUILT FROM THE FILES THIS ARM WAS HANDED, NEVER FROM THE REPO BEHIND THEIR BACK.
   * A first draft that read `src/components/new/generalDeskRead.js` off disk injected the
   * shipped desk into every synthetic control below, so the controls stopped judging the
   * function the shipped table is judged by. Passing the tree through means a control can
   * carry its own three-line reader and prove the door both ways.
   *
   * The scan is a brace stack over `codeOnly` source — string CONTENTS blanked, so a field
   * name written inside a sentence is not a binding — and it tells an object LITERAL from a
   * block by the token before its `{`, which is what stops a function body, a `catch` block
   * or a `const {a, b} =` pattern from contributing a key.
   * @param {{rel:string, raw:string, spans:{name:string,from:number,to:number}[]}[]} index
   * @param {Set<string>} ids the mount ids the registry names — the index answers about
   *   those and no other literal, so an unrelated `flex: …(SOME_CONST)` mints nothing
   * @returns {Map<string, {reader: string, path: string}[]>} mount id → the readers and the
   *   dotted field paths that draw it
   */
  function deskFieldIndex(index, ids) {
    const table = new Map();
    for (const file of index) {
      const consts = stringConsts(file.raw);
      if (consts.size === 0) continue;
      const code = codeOnly(file.raw);
      const frames = [];
      let pending = null;
      for (let i = 0; i < code.length; i += 1) {
        const c = code[i];
        if (c === '{') { frames.push({ obj: isObjectOpen(code, i), key: pending }); pending = null; continue; }
        if (c === '(' || c === '[') { frames.push({ obj: false, key: null }); continue; }
        if (c === '}') { frames.pop(); pending = null; continue; }
        if (c === ')' || c === ']') { frames.pop(); continue; }
        if (c === ';') { pending = null; continue; }
        if (!/[A-Za-z_$]/.test(c)) continue;
        let j = i + 1;
        while (j < code.length && /[A-Za-z0-9_$]/.test(code[j])) j += 1;
        const word = code.slice(i, j);
        i = j - 1;
        if (word === 'return') { pending = null; continue; }
        let k = j;
        while (k < code.length && /\s/.test(code[k])) k += 1;
        if (code[k] === ':') { pending = word; continue; }
        const id = consts.get(word);
        if (!id || !ids.has(id) || pending === null) continue;
        // ⚠ THE CONST MUST BE AN ARGUMENT INSIDE THE FIELD'S VALUE, not the value itself.
        // Without this, every `flex: SOME_LAYOUT_CONST` in the estate minted a binding —
        // measured, 16 of them, none a mount but all of them noise a later reader would
        // have to disprove. A drawn position always reads `<field>: … line(<X>_MOUNT, …)`,
        // so a call or array frame stands between the field's `{` and the id.
        const lastObject = frames.reduce((last, f, at) => (f.obj ? at : last), -1);
        if (lastObject < 0 || lastObject === frames.length - 1) continue;
        const reader = (file.spans.find((s) => i >= s.from && i < s.to) || {}).name;
        if (!reader) continue;
        const path = [...frames.filter((f) => f.obj && f.key).map((f) => f.key), pending].join('.');
        if (!table.has(id)) table.set(id, []);
        const rows = table.get(id);
        if (!rows.some((r) => r.reader === reader && r.path === path)) rows.push({ reader, path });
      }
    }
    return table;
  }

  /** Do two dotted paths agree over the length they share? */
  function pathsFit(a, b) {
    const n = Math.min(a.length, b.length);
    return a.slice(0, n).join('.') === b.slice(0, n).join('.');
  }

  /**
   * Every offset in ONE file that draws a mount THROUGH a desk reader's field, and the
   * carriers it followed. A tab binds the read four ways and all four are followed here:
   * the whole path at once (`const craftReasonLine = ….economics.craftReasonLine`), a
   * destructured group (`const {identityLines, foundedLine, recordLine} = ….history`), a
   * group held whole and completed at each use (`const desk = ….steadings`, then
   * `desk.remnantLine`), and the same inside a `useMemo` (`useMemo(() => ….hooks, […])`).
   *
   * ⚠ A PARTIAL CARRIER USED WITHOUT COMPLETING ITS PATH — `desk` handed to a child — is
   * counted as a draw site, not passed over. Over-collecting sites can only ADD hosts, so
   * that direction fails toward a red, and a red is what this arm exists to produce.
   * @param {{code: string, spans: {name:string,from:number,to:number}[]}} file
   * @param {string} reader the exported function a tab calls
   * @param {string} path the dotted field path that carries the mount
   * @returns {{sites: number[], carriers: {name: string, at: number}[]}}
   */
  function deskDrawSites(file, reader, path) {
    const { code, spans } = file;
    const want = path.split('.');
    const sites = [];
    const carriers = [];
    for (const m of code.matchAll(new RegExp(`\\b${reader}\\s*\\(`, 'g'))) {
      if (/\bfunction\s+$/.test(code.slice(Math.max(0, m.index - 24), m.index))) continue;   // its own declaration
      const open = m.index + m[0].length - 1;
      const close = closingParen(code, open);
      if (close < 0) continue;
      const read = propertyChain(code, close + 1);
      const chain = read.names;
      const statement = enclosingStatement(code, m.index);
      const from = m.index - statement.length;
      const single = /^\s*(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=/.exec(statement);
      const pattern = /^\s*(?:const|let|var)\s*\{([^}]*)\}\s*=/.exec(statement);
      const bound = [];
      if (single) bound.push({ name: single[1], path: chain });
      else if (pattern) {
        for (const part of pattern[1].split(',')) {
          const nm = /^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*(?::\s*([A-Za-z_$][A-Za-z0-9_$]*))?\s*$/.exec(part);
          if (nm) bound.push({ name: nm[2] || nm[1], path: [...chain, nm[1]] });
        }
      } else if (pathsFit(chain, want) && chain.length >= want.length) {
        sites.push(open);                                     // read and rendered in one breath
        continue;
      }
      for (const b of bound) {
        if (!pathsFit(b.path, want)) continue;
        const span = spans.find((s) => from >= s.from && from < s.to) || { from: 0, to: code.length };
        const region = code.slice(span.from, span.to);
        for (const u of region.matchAll(new RegExp(`\\b${b.name}\\b`, 'g'))) {
          const at = span.from + u.index;
          if (at >= from && at < read.end) continue;           // its own declaration is not a use
          const full = [...b.path, ...propertyChain(code, at + b.name.length).names];
          if (!pathsFit(full, want)) continue;
          const stmt = enclosingStatement(code, at);
          const decl = /^\s*(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=/.exec(stmt);
          if (decl) carriers.push({ name: decl[1], at: at - stmt.length });
          else sites.push(at);
        }
      }
    }
    return { sites, carriers };
  }

  /**
   * Every offset in ONE file that draws `mountId`, and the carriers it followed to get
   * there. Null when this file draws the mount nowhere.
   * @param {{raw: string, code: string, spans: {name:string,from:number,to:number}[]}} file
   * @param {string} mountId
   * @param {{reader: string, path: string}[]} [deskBindings] the desk fields that carry this
   *   mount, from `deskFieldIndex`; empty for a mount no reader binds
   * @returns {{sites: number[], carriers: string[]}|null}
   */
  function drawSitesIn(file, mountId, deskBindings = []) {
    const { raw, code, spans } = file;
    const consts = stringConsts(raw);
    const sites = [];
    const carriers = [];
    for (const m of raw.matchAll(/\bmount\s*=\s*(?:(['"])([^'"]*)\1|\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\})/g)) {
      if ((m[2] !== undefined ? m[2] : consts.get(m[3])) === mountId) sites.push(m.index);
    }
    for (const m of code.matchAll(/\bdrawnAtMount\s*\(/g)) {
      const open = m.index + m[0].length - 1;
      const argument = firstArgument(raw, open).trim();
      const literal = /^(['"])(.*)\1$/.exec(argument);
      if ((literal ? literal[2] : consts.get(argument)) !== mountId) continue;
      const statement = enclosingStatement(code, open);
      const declared = /^\s*(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=/.exec(statement);
      if (declared) carriers.push({ name: declared[1], at: open - statement.length });
      else sites.push(open);                                  // drawn inline, where it is called
    }
    // …and THE THIRD DOOR: a desk reader's field, where the tab never spells the id at all.
    for (const { reader, path } of deskBindings) {
      const drawn = deskDrawSites(file, reader, path);
      sites.push(...drawn.sites);
      carriers.push(...drawn.carriers);
    }
    if (sites.length === 0 && carriers.length === 0) return null;
    const byScope = new Map();
    for (const { name, at } of carriers) {
      const span = spans.find((s) => at >= s.from && at < s.to) || { from: 0, to: code.length };
      if (!byScope.has(span.from)) byScope.set(span.from, { span, names: new Set() });
      byScope.get(span.from).names.add(name);
    }
    for (const { span, names } of byScope.values()) {
      const region = code.slice(span.from, span.to);
      for (let grew = true; grew;) {
        grew = false;
        for (const m of region.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=([^;]*);/g)) {
          if (names.has(m[1])) continue;
          if ([...names].some((c) => new RegExp(`\\b${c}\\b`).test(m[2]))) { names.add(m[1]); grew = true; }
        }
      }
      for (const name of names) {
        for (const m of region.matchAll(new RegExp(`\\b${name}\\b`, 'g'))) {
          if (/\b(?:const|let|var)\s+$/.test(region.slice(Math.max(0, m.index - 40), m.index))) continue;
          // ⚠ `desk.foundedLine` IS NOT A USE OF A VARIABLE CALLED `foundedLine`. Without
          // this, a carrier whose name matches its own source field counted its own
          // declaration line as a draw site — harmless, because an extra OPEN site can
          // never mask a shut host, but it made the arm's own report read wrong.
          if (/\.\s*$/.test(region.slice(Math.max(0, m.index - 40), m.index))) continue;
          sites.push(span.from + m.index);
        }
      }
    }
    return {
      sites: [...new Set(sites)].sort((a, b) => a - b),
      carriers: [...new Set([...byScope.values()].flatMap((v) => [...v.names]))],
    };
  }

  /**
   * THE VERDICT FOR EVERY SENTENCE ROW, AS DATA — the sites this arm followed, the hosts
   * that enclose them and the openness that follows. `foldedSentenceMounts` grades exactly
   * this and re-derives nothing, so a per-mount table read out of here and the assertion
   * below cannot disagree about what the tree says.
   * @param {readonly object[]} mounts
   * @param {{rel: string, raw: string}[]} files
   * @returns {{row: object, sites: string[], hosts: {where:string,attrs:string,open:string}[],
   *   verdict: 'open'|'closed'|'conditional'|'unresolved'}[]}
   */
  function visibilityOf(mounts, files) {
    const index = files.map((f) => {
      const code = blankComments(f.raw);
      return { rel: f.rel, raw: f.raw, code, frames: hostFrames(code, f.rel), spans: declarationSpans(code) };
    });
    const lineAt = (file, pos) => file.code.slice(0, pos).split('\n').length;
    const rendered = new Map();
    const renderSites = (name) => {
      if (!rendered.has(name)) {
        const out = [];
        for (const file of index) {
          for (const m of file.code.matchAll(new RegExp(`<${name}(?=[\\s>/])`, 'g'))) out.push({ file, pos: m.index });
        }
        rendered.set(name, out);
      }
      return rendered.get(name);
    };
    const hostsOf = (file, pos, seen, depth) => {
      const here = file.frames
        .filter((f) => pos > f.from && pos < f.to)
        .map((f) => ({ where: `${file.rel}:${lineAt(file, f.from)}`, attrs: f.attrs, open: hostOpenness(f.attrs) }));
      if (file.rel === DOSSIER_ROOT) return here;             // the frame first paint happens in
      if (depth > 8) return [...here, { where: `${file.rel}:${lineAt(file, pos)}`, attrs: '(the walk ran past its depth cap)', open: 'unresolved' }];
      const owner = (file.spans.find((s) => pos >= s.from && pos < s.to) || {}).name;
      if (!owner) return here;
      const key = `${file.rel}::${owner}`;
      if (seen.has(key)) return here;
      seen.add(key);
      for (const up of renderSites(owner)) {
        if (up.file === file && up.pos === pos) continue;
        here.push(...hostsOf(up.file, up.pos, seen, depth + 1));
      }
      return here;
    };

    const desk = deskFieldIndex(index, new Set(mounts.map((row) => row?.mount)));
    const out = [];
    for (const row of mounts) {
      if (row?.rung !== MOUNT_RUNGS.SENTENCE) continue;
      const found = [];
      for (const file of index) {
        const drawn = drawSitesIn(file, row.mount, desk.get(row.mount) || []);
        if (drawn) for (const pos of drawn.sites) found.push({ file, pos });
      }
      if (found.length === 0) { out.push({ row, sites: [], hosts: [], verdict: 'unresolved' }); continue; }
      const hosts = new Map();
      for (const site of found) {
        for (const host of hostsOf(site.file, site.pos, new Set(), 0)) hosts.set(host.where, host);
      }
      const shut = [...hosts.values()].filter((h) => h.open !== 'open');
      out.push({
        row,
        sites: found.map((s) => `${s.file.rel}:${lineAt(s.file, s.pos)}`),
        hosts: [...hosts.values()],
        verdict: shut.length === 0 ? 'open' : shut[0].open,
      });
    }
    return out;
  }

  /**
   * THE RULE, total over a registry and a component tree passed in, so the controls below
   * and the shipped table are judged by one function.
   * @param {readonly object[]} mounts
   * @param {{rel: string, raw: string}[]} files
   * @returns {string[]}
   */
  function foldedSentenceMounts(mounts, files) {
    const bad = [];
    for (const { row, hosts, verdict } of visibilityOf(mounts, files)) {
      const declared = row.visibility === 'closed-section';
      if (verdict === 'unresolved') {
        bad.push(`${row.mount}: this arm can follow no draw site for it, so its visibility is unknown`);
        continue;
      }
      const shut = hosts.filter((h) => h.open !== 'open');
      if (shut.length > 0 && !declared) {
        const worst = shut[0];
        bad.push(`${row.mount} (${row.blockId}) draws inside ${worst.where} ${worst.attrs.slice(0, 90)}`
          + `, which is ${worst.open} on first paint, and the row declares no visibility`);
      }
      if (shut.length === 0 && declared) {
        bad.push(`${row.mount}: the row declares visibility 'closed-section' and every host that`
          + ' encloses it is open on first paint — a stale exemption');
      }
      if (shut.length > 0 && declared && String(row.visibilityReason || '').length < REASON_FLOOR) {
        bad.push(`${row.mount}: visibility 'closed-section' is declared with a ${String(row.visibilityReason || '').length}-character reason`
          + `, and this exemption is only bought with an argument (${REASON_FLOOR} characters)`);
      }
    }
    return bad.sort();
  }

  // ── THE CONTROLS. A synthetic tab drawn four ways, so the rule is proved ARMED before
  //    the shipped table is judged by it. ──────────────────────────────────────────────
  const PROBE_ROW = Object.freeze([Object.freeze({
    mount: 'economics.probe', tab: 'economics', desk: 'economy', blockId: 'DS-ECO-1', rung: 'sentence',
  })]);
  /** The mount is drawn through a CARRIER, the way every landed tab draws one. */
  const probeTab = (hostAttrs, inside) => [
    "import { drawnAtMount } from '../../domain/display/stateProse/dossierMounts.js';",
    "const PROBE_MOUNT = 'economics.probe';",
    'export function ProbeTab({ settlement, publicDossier = false }) {',
    '  const drawn = drawnAtMount(PROBE_MOUNT, settlement.rung);',
    '  const probeLines = [drawn].map((d) => d?.sentence).filter(Boolean);',
    '  return (',
    '    <div>',
    inside ? '' : '      {probeLines.length > 0 && <p>{probeLines[0]}</p>}',
    `      <${hostAttrs}>`,
    inside ? '        {probeLines.length > 0 && <p>{probeLines[0]}</p>}' : '',
    '        <div>the rows</div>',
    `      </${hostAttrs.split(' ')[0]}>`,
    '    </div>',
    '  );',
    '}',
  ].filter(Boolean).join('\n');
  const tree = (raw, rel = 'src/components/new/tabs/ProbeTab.jsx') => [{ rel, raw }];

  test('guard the guard: the openness reader tells a bare defaultOpen from {false} and from an expression', () => {
    // A plain header is not a fold at all.
    expect(hostOpenness('<Section title="X">')).toBe('open');
    // Both primitives default the parameter to true, so `collapsible` alone is open…
    expect(hostOpenness('<Section title="X" collapsible>')).toBe('open');
    expect(hostOpenness('<Section title="X" collapsible defaultOpen>')).toBe('open');
    expect(hostOpenness('<Section title="X" collapsible defaultOpen={true}>')).toBe('open');
    // …and only these two hide a child on some world or on every one.
    expect(hostOpenness('<Section title="X" collapsible defaultOpen={false}>')).toBe('closed');
    expect(hostOpenness('<Section title="X" collapsible defaultOpen={!!fb.deficit}>')).toBe('conditional');
    expect(hostOpenness('<Collapsible title="X" defaultOpen={false}>')).toBe('closed');
    // An UNBALANCED tree is refused rather than answered: a reader that mis-paired one tag
    // would grade a shut host as open, which is the exact failure this arm exists to catch.
    expect(() => hostFrames('<Section title="a"><div/>', 'probe')).toThrow(/unclosed/);
    expect(() => hostFrames('<div/></Section>', 'probe')).toThrow(/unbalanced/);
    // A SELF-CLOSING host has no children and encloses nothing (RegenerationDeltaCard.jsx
    // renders seven of them; counting their `>` as an opener unbalanced the first draft).
    expect(hostFrames('<Section title="a" items={x} />\n<div/>', 'probe')).toEqual([]);
  });

  test('guard the guard: a carrier is read in the scope that declares it, and a comment is not code', () => {
    const twoComponents = [
      "import { drawnAtMount } from '../../domain/display/stateProse/dossierMounts.js';",
      "const A_MOUNT = 'economics.probe';",
      "const B_MOUNT = 'economics.other';",
      'export function DrawA({ s }) {',
      '  const drawn = drawnAtMount(A_MOUNT, s.a);',
      '  return <div>{drawn?.sentence}</div>;',
      '}',
      'export function DrawB({ s }) {',
      '  const drawn = drawnAtMount(B_MOUNT, s.b);',
      '  return <Section title="B" collapsible defaultOpen={false}><p>{drawn?.sentence}</p></Section>;',
      '}',
    ].join('\n');
    const code = blankComments(twoComponents);
    const file = { raw: twoComponents, code, spans: declarationSpans(code) };
    const a = drawSitesIn(file, 'economics.probe');
    const b = drawSitesIn(file, 'economics.other');
    // Both components name their local `drawn`. A file-wide carrier reader would hand A the
    // sites inside B's shut fold and report a defect that is not there.
    expect(a.carriers).toEqual(['drawn']);
    expect(b.carriers).toEqual(['drawn']);
    const lineOf = (pos) => code.slice(0, pos).split('\n').length;
    expect(a.sites.map(lineOf)).toEqual([6]);
    expect(b.sites.map(lineOf)).toEqual([10]);
    // …and a mount id MENTIONED IN PROSE draws nothing: the reader takes code, not comments.
    const prose = ['// economics.probe is discussed here', 'export function Nothing() { return null; }'].join('\n');
    expect(drawSitesIn({ raw: prose, code: blankComments(prose), spans: declarationSpans(blankComments(prose)) }, 'economics.probe')).toBeNull();
  });

  test('guard the guard: a desk reader\'s FIELD is followed to the tab that renders it, and a field it does not bind stays unknown', () => {
    // THE GENERAL DESK'S SHAPE IN TEN LINES: ids spelled ONCE in a reader, bound to fields
    // of a frozen return value, and a tab that names no id at all. ⛔ The tree is passed in
    // rather than read off disk, which is the whole reason this control can exist: a first
    // draft that opened `generalDeskRead.js` itself injected the shipped desk here and this
    // arm stopped judging the function the shipped table is judged by.
    const reader = {
      rel: 'src/components/new/probeDeskRead.js',
      raw: [
        "import { drawnAtMount } from '../../domain/display/stateProse/dossierMounts.js';",
        "const PROBE_MOUNT = 'economics.probe';",
        "const OTHER_MOUNT = 'economics.other';",
        'function line(mount, rung) { return drawnAtMount(mount, rung)?.sentence ?? null; }',
        'export function probeDeskLines(settlement) {',
        '  return Object.freeze({',
        '    economics: Object.freeze({ probeLine: line(PROBE_MOUNT, settlement.rung) }),',
        '    aside: Object.freeze({ otherLine: line(OTHER_MOUNT, settlement.rung) }),',
        '  });',
        '}',
      ].join('\n'),
    };
    const deskTab = (read, expr, inside) => ({
      rel: 'src/components/new/tabs/DeskProbeTab.jsx',
      raw: [
        "import { probeDeskLines } from '../probeDeskRead.js';",
        'export function DeskProbeTab({ settlement }) {',
        `  ${read}`,
        '  return (',
        '    <div>',
        inside ? '' : `      <p>{${expr}}</p>`,
        '      <Section title="Deep" collapsible defaultOpen={false}>',
        inside ? `        <p>{${expr}}</p>` : '',
        '        <div>the rows</div>',
        '      </Section>',
        '    </div>',
        '  );',
        '}',
      ].filter(Boolean).join('\n'),
    });
    const PROBE = Object.freeze([Object.freeze({
      mount: 'economics.probe', tab: 'economics', desk: 'economy', blockId: 'DS-ECO-1', rung: MOUNT_RUNGS.SENTENCE,
    })]);

    // FOUR BINDINGS, which is every shape the landed tabs use: the whole path at once, a
    // destructured group, a group held whole and completed at the use, and the same inside
    // a `useMemo`. Each is planted inside the fold and then hoisted above it.
    for (const [what, read, expr] of [
      ['the whole path at once', 'const probeLine = probeDeskLines(settlement).economics.probeLine;', 'probeLine'],
      ['a destructured group', 'const { probeLine } = probeDeskLines(settlement).economics;', 'probeLine'],
      ['a group held whole', 'const desk = probeDeskLines(settlement).economics;', 'desk.probeLine'],
      ['a useMemo', 'const { probeLine } = useMemo(() => probeDeskLines(settlement).economics, [settlement]);', 'probeLine'],
    ]) {
      const shut = foldedSentenceMounts(PROBE, [reader, deskTab(read, expr, true)]);
      expect(shut, `${what}: the shut fold did not plant`).toHaveLength(1);
      expect(shut[0], what).toContain('economics.probe (DS-ECO-1) draws inside');
      expect(shut[0], what).toContain('closed on first paint');
      expect(foldedSentenceMounts(PROBE, [reader, deskTab(read, expr, false)]), what).toEqual([]);
    }

    // ⭐ THE FIELD IS THE UNIT, NOT THE READER. A table that mapped a whole reader to one
    // place would pass a tab that draws one field above the fold and the other inside it.
    const twoFields = {
      rel: 'src/components/new/tabs/DeskProbeTab.jsx',
      raw: [
        "import { probeDeskLines } from '../probeDeskRead.js';",
        'export function DeskProbeTab({ settlement }) {',
        '  const desk = probeDeskLines(settlement);',
        '  return (',
        '    <div>',
        '      <p>{desk.economics.probeLine}</p>',
        '      <Section title="Deep" collapsible defaultOpen={false}>',
        '        <p>{desk.aside.otherLine}</p>',
        '      </Section>',
        '    </div>',
        '  );',
        '}',
      ].join('\n'),
    };
    const both = [PROBE[0], { ...PROBE[0], mount: 'economics.other', blockId: 'DS-ECO-2' }];
    const split = foldedSentenceMounts(both, [reader, twoFields]);
    expect(split, 'the two-field split did not plant').toHaveLength(1);
    expect(split[0]).toContain('economics.other (DS-ECO-2) draws inside');

    // A mount the reader binds NO FIELD for is still UNKNOWN, so this door cannot quietly
    // answer for a position nobody draws — the blindness has to stay loud.
    expect(foldedSentenceMounts([{ ...PROBE[0], mount: 'economics.unbound' }],
      [reader, deskTab('const probeLine = probeDeskLines(settlement).economics.probeLine;', 'probeLine', false)]))
      .toEqual(['economics.unbound: this arm can follow no draw site for it, so its visibility is unknown']);

    // ⚠ DECLARED CONSERVATISM: a carrier handed on without completing its path — `desk` given
    // to a child — is counted for EVERY field under it. Over-collecting can only add hosts,
    // so that direction fails toward a red, which is the failure this arm is for.
    const handedOn = {
      rel: 'src/components/new/tabs/DeskProbeTab.jsx',
      raw: [
        "import { probeDeskLines } from '../probeDeskRead.js';",
        'export function DeskProbeTab({ settlement }) {',
        '  const desk = probeDeskLines(settlement);',
        '  return (',
        '    <Section title="Deep" collapsible defaultOpen={false}>',
        '      <Child desk={desk} />',
        '    </Section>',
        '  );',
        '}',
      ].join('\n'),
    };
    expect(foldedSentenceMounts(both, [reader, handedOn]).map((b) => b.split(' ')[0])).toEqual(['economics.other', 'economics.probe']);
  });

  test('NON-VACUITY: a sentence drawn inside a shut fold is convicted, and the same draw hoisted above it is not', () => {
    const shut = foldedSentenceMounts(PROBE_ROW, tree(probeTab('Section title="Deep" collapsible defaultOpen={false}', true)));
    expect(shut, 'the shut fold did not plant').toHaveLength(1);
    expect(shut[0]).toContain('economics.probe (DS-ECO-1) draws inside');
    expect(shut[0]).toContain('closed on first paint');
    // THE CURE THIS LANE APPLIED, driven rather than described: the same fold, the same
    // draw, hoisted to frame it instead of sitting inside it.
    expect(foldedSentenceMounts(PROBE_ROW, tree(probeTab('Section title="Deep" collapsible defaultOpen={false}', false)))).toEqual([]);
    // A DATA-DEPENDENT default is the same defect on the towns that fall the wrong side.
    const conditional = foldedSentenceMounts(PROBE_ROW, tree(probeTab('Section title="Deep" collapsible defaultOpen={bmc>=15}', true)));
    expect(conditional, 'the conditional fold did not plant').toHaveLength(1);
    expect(conditional[0]).toContain('conditional on first paint');
    // …while a fold that is statically open hides nothing and must stay silent.
    expect(foldedSentenceMounts(PROBE_ROW, tree(probeTab('Section title="Deep" collapsible defaultOpen', true)))).toEqual([]);
    // ⭐ THE CROSS-FILE HOP, which is where `war.standing` and every DeskLines position live:
    // the draw is at the top level of ITS OWN file and shut by the tab that renders it.
    const leaf = [
      "import { drawnAtMount } from '../../domain/display/stateProse/dossierMounts.js';",
      "const PROBE_MOUNT = 'economics.probe';",
      'export function ProbeLines({ desk }) {',
      '  const drawn = drawnAtMount(PROBE_MOUNT, desk.rung);',
      '  return <p>{drawn?.sentence}</p>;',
      '}',
    ].join('\n');
    const host = [
      "import { ProbeLines } from './ProbeLines.jsx';",
      'export function ProbeTab({ desk }) {',
      '  return <Section title="Deep" collapsible defaultOpen={false}><ProbeLines desk={desk} /></Section>;',
      '}',
    ].join('\n');
    const across = foldedSentenceMounts(PROBE_ROW, [
      { rel: 'src/components/new/tabs/ProbeLines.jsx', raw: leaf },
      { rel: 'src/components/new/tabs/ProbeTab.jsx', raw: host },
    ]);
    expect(across, 'the cross-file hop did not plant').toHaveLength(1);
    expect(across[0]).toContain('ProbeTab.jsx:3');
    // …and the same two files with the draw hoisted out of the fold are clean, so the hop
    // is reading the HOST and not merely the second file's existence.
    expect(foldedSentenceMounts(PROBE_ROW, [
      { rel: 'src/components/new/tabs/ProbeLines.jsx', raw: leaf },
      { rel: 'src/components/new/tabs/ProbeTab.jsx', raw: host.replace('<Section title="Deep" collapsible defaultOpen={false}><ProbeLines desk={desk} /></Section>', '<div><ProbeLines desk={desk} /><Section title="Deep" collapsible defaultOpen={false}><i/></Section></div>') },
    ])).toEqual([]);
    // A mount NO file draws is convicted rather than passed over — this arm's own blindness
    // has to be loud, or a rename would quietly retire the guard.
    expect(foldedSentenceMounts(PROBE_ROW, tree('export function Empty() { return null; }')))
      .toEqual(['economics.probe: this arm can follow no draw site for it, so its visibility is unknown']);
  });

  test('NON-VACUITY: the exemption must be earned — a stale declaration and a token reason are both convicted', () => {
    const shutHost = probeTab('Section title="Deep" collapsible defaultOpen={false}', true);
    const openHost = probeTab('Section title="Deep" collapsible defaultOpen', true);
    const declare = (reason) => Object.freeze([Object.freeze({ ...PROBE_ROW[0], visibility: 'closed-section', visibilityReason: reason })]);
    const ARGUED = 'The datum this sentence stands beside is inside the same fold, so the page never'
      + ' prints a fact and hides the sentence about it, and the header names the topic either way.';
    expect(ARGUED.length).toBeGreaterThanOrEqual(REASON_FLOOR);
    // A declared row over a genuinely shut host is the ONE lawful way to stay inside a fold.
    expect(foldedSentenceMounts(declare(ARGUED), tree(shutHost))).toEqual([]);
    // TWO-SIDED: the same declaration over an OPEN host is a stale exemption and is convicted,
    // so a row cannot keep an escape the layout stopped needing.
    const stale = foldedSentenceMounts(declare(ARGUED), tree(openHost));
    expect(stale, 'the stale declaration did not plant').toHaveLength(1);
    expect(stale[0]).toContain('a stale exemption');
    // …and a token reason buys nothing: the floor is what stops `visibility` becoming a word
    // a lane types to make an arm quiet.
    const token = foldedSentenceMounts(declare('layout'), tree(shutHost));
    expect(token, 'the token reason did not plant').toHaveLength(1);
    expect(token[0]).toContain('only bought with an argument');
    // A GLANCE row is out of scope by law, not by accident: a glance draws no sentence, so
    // there is no sentence for a fold to hide.
    expect(foldedSentenceMounts([{ ...PROBE_ROW[0], rung: MOUNT_RUNGS.GLANCE }], tree(shutHost))).toEqual([]);
  });

  test('THE SHIPPED TABLE: every sentence mount is visible on first paint, or declares why not', () => {
    const files = walkSources(COMPONENTS).map((absolute) => ({
      rel: relative(ROOT, absolute).replace(/\\/g, '/'),
      raw: readFileSync(absolute, 'utf8'),
    }));
    expect(files.length, 'the component tree walked nothing').toBeGreaterThan(20);
    expect(DOSSIER_MOUNTS.filter((row) => row.rung === MOUNT_RUNGS.SENTENCE).length,
      'no sentence row is mounted, so this arm judged nothing').toBeGreaterThan(0);
    expect(
      foldedSentenceMounts(DOSSIER_MOUNTS, files),
      'A SENTENCE IS MOUNTED WHERE NO READER CAN SEE IT. `Primitives.jsx:114` renders a shut'
      + ' section as `{open && children}`, so a collapsed host emits NO BYTES and the position'
      + ' is lit in the registry and dark on the page — with the reachability arm, the'
      + ' public-dossier guard and the desk itself all green over it. Hoist the line ABOVE the'
      + ' fold so it FRAMES what follows (the DS-HK-1 arrangement), re-host it beside the datum'
      + ' it explains, or — if the datum it stands beside is inside the SAME fold, so the page'
      + ' never prints a fact and hides the sentence about it — declare'
      + " `visibility: 'closed-section'` on the row with the argument in `visibilityReason`."
      + ' Never by deleting the collapsible.',
    ).toEqual([]);
  });
});
