#!/usr/bin/env node
/**
 * scripts/prose-licence-card.mjs — PRINT THE LICENCE CARD OF ARCH §8.3 FOR ONE POOL.
 *
 *   node scripts/prose-licence-card.mjs DS-DEF-11 'WALLED-STRAINED'
 *   node scripts/prose-licence-card.mjs --all-taste
 *   node scripts/prose-licence-card.mjs --list DS-DEF-11
 *
 * WHO READS IT. A writer of a modifier pool, before a word is written (the taste's own
 * workflow calls it by name), and the chair at the sitting. It is READ-ONLY: it opens the
 * committed wiring census, the six projected leaves and the annex's §0c shape register, and
 * writes nothing anywhere.
 *
 * ⛔ EVERY LINE COMES FROM A REGISTER AND NONE FROM THIS FILE. The card builder is
 * `scripts/lib/prose-licence-card.mjs` and is pure; this script only assembles its inputs. So
 * an arm can edit ONE census row in memory and watch exactly one line of the card move, which
 * is the property that makes the card a projection rather than a document.
 *
 * @enforced-by tests/lint/proseLicenceCard.walker.test.js
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { isCovertPath, rootOf } from '../src/domain/prose/wiringCensus.js';
import { parseSlotShapes, mergeSlotShapes } from './lib/dossier-slot-shapes.mjs';
import { readAnnexDeclarations } from './lib/dossier-annex-grammar.mjs';
import { licenceCardLines } from './lib/prose-licence-card.mjs';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

/**
 * THE SEVEN POOLS OF THE TASTE (ARCH §6.3-§6.5; the taste's charter). Named here so
 * `--all-taste` is one command and so the roster has ONE home the workflow and the harness
 * both read.
 */
export const TASTE_POOLS = Object.freeze([
  Object.freeze({ block: 'DS-DEF-11', pool: 'country: pressed (walled)', dir: 'def11-country-walled' }),
  Object.freeze({ block: 'DS-DEF-11', pool: 'country: pressed (unwalled)', dir: 'def11-country-unwalled' }),
  Object.freeze({ block: 'DS-DEF-11', pool: 'watch: bought (revealed)', dir: 'def11-watch-revealed' }),
  Object.freeze({ block: 'DS-DEF-11', pool: 'watch: bought (covert)', dir: 'def11-watch-covert' }),
  Object.freeze({ block: 'DS-DEF-2', pool: 'stores: short', dir: 'def2-stores-short' }),
  Object.freeze({ block: 'DS-DEF-2', pool: 'stores: import-fed', dir: 'def2-stores-importfed' }),
  Object.freeze({ block: 'DS-GEN-3', pool: 'purse: short', dir: 'gen3-purse-short' }),
]);

/**
 * WHICH DESK LEAF A BLOCK'S MODIFIER PREDICATES ARE AUTHORED IN, by the block-id prefix the
 * projector's own DESKS table uses. The card names it so a writer can read the predicate
 * rather than be told it exists.
 * @type {Readonly<Record<string, string>>}
 */
const DESK_LEAF_OF = Object.freeze({
  'DS-ECO': 'src/domain/display/stateProse/economyStateProseCandidates.js',
  'DS-SUP': 'src/domain/display/stateProse/economyStateProseCandidates.js',
  'DS-POW': 'src/domain/display/stateProse/powerStateProseCandidates.js',
  'DS-DEF': 'src/domain/display/stateProse/defenseStateProseCandidates.js',
  'DS-WAR': 'src/domain/display/stateProse/warFaithStateProseCandidates.js',
  'DS-FTH': 'src/domain/display/stateProse/warFaithStateProseCandidates.js',
  'DS-STR': 'src/domain/display/stateProse/stressorsStateProseCandidates.js',
  'DS-CND': 'src/domain/display/stateProse/stressorsStateProseCandidates.js',
  'DS-GEN': 'src/domain/display/stateProse/generalStateProseCandidates.js',
  'DS-REL': 'src/domain/display/stateProse/generalStateProseCandidates.js',
  'DS-POP': 'src/domain/display/stateProse/generalStateProseCandidates.js',
  'DS-HK': 'src/domain/display/stateProse/generalStateProseCandidates.js',
});

/** The six generated desk leaves, by their module path. */
const LEAF_MODULES = Object.freeze([
  'defense', 'economy', 'general', 'power', 'stressors', 'warFaith',
]);

/**
 * The whole corpus as one `blockId -> block` map, read from the SAME leaves the desks import
 * so a card can never describe a corpus the runtime does not have.
 * @returns {Promise<Record<string, object>>}
 */
export async function loadCorpus() {
  /** @type {Record<string, object>} */
  const out = {};
  for (const leaf of LEAF_MODULES) {
    const mod = await import(url.pathToFileURL(path.join(ROOT, `src/data/dossierStateProse/${leaf}.generated.js`)).href);
    for (const value of Object.values(mod)) Object.assign(out, value);
  }
  return out;
}

/**
 * Every input the card builder needs, assembled once for the whole corpus.
 * @returns {Promise<{cardFor: (block: string, pool: string) => string[],
 *   corpus: Record<string, object>, census: object}>}
 */
export async function cardMachine() {
  const census = JSON.parse(readFileSync(path.join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
  const corpus = await loadCorpus();
  const rows = new Map(census.rows.map((r) => [`${r.block} :: ${r.pool}`, r]));
  const facts = new Map((census.mountsPerFact?.rows || []).map((r) => [r.field, r]));
  const annexText = readFileSync(path.join(ROOT, 'docs/content/RECEIPT_POOLS_DOSSIER_STATE.md'), 'utf8');
  // ⭐ THE ANNEX'S OWN DECLARATION, so the card can say whether an attach set was DERIVED or
  // NARROWED BY HAND. The projected `poolMeta.attach` carries the RESULT and not the route,
  // and a writer told "derived" about a hand-narrowed set is being told the block's shape
  // decided something an author decided.
  const declared = readAnnexDeclarations(annexText);
  const shapes = mergeSlotShapes([
    parseSlotShapes(annexText, 'RECEIPT_POOLS_DOSSIER_STATE.md §0c/§0c-2'),
    parseSlotShapes(readFileSync(path.join(ROOT, 'docs/content/RECEIPT_POOLS_CAUSAL_DOSSIER.md'), 'utf8'), 'RECEIPT_POOLS_CAUSAL_DOSSIER.md §0c'),
  ]);
  /** @param {string} block @param {string} pool */
  const cardFor = (block, pool) => {
    const blockData = corpus[block];
    if (!blockData) throw new Error(`no block \`${block}\` in the projected corpus`);
    const variants = blockData.pools?.[pool];
    if (!variants) {
      throw new Error(`no pool \`${pool}\` in ${block}. Its pools: ${Object.keys(blockData.pools || {}).join(' · ')}`);
    }
    const meta = blockData.poolMeta?.[pool] || {};
    const row = rows.get(`${block} :: ${pool}`) || null;
    const field = (row?.reads || [])[0] || '';
    return licenceCardLines({
      blockId: block,
      poolKey: pool,
      row,
      poolMeta: meta,
      blockSlots: blockData.slots || [],
      shapeOf: (slot) => shapes.shapeOf(slot),
      variants,
      // ⛔ KEYED ON `rootOf(field)`, NEVER ON THE PATH. `factMounts` indexes the echo table on
      // the PRODUCER TOKEN root (`wiringCensus.js:984`) so its two halves speak one
      // vocabulary; a card looking the full read path up in it misses every row and prints
      // NOT-EXECUTABLE on facts the table holds.
      factRow: facts.get(field ? rootOf(field) : '') || null,
      spineRows: (meta.attach || []).map((k) => rows.get(`${block} :: ${k}`)).filter(Boolean),
      covertPath: field ? isCovertPath(field) : false,
      declaredAttach: declared.get(`${block} :: ${pool}`)?.attach ?? null,
      candidateLeaf: DESK_LEAF_OF[block.split('-').slice(0, 2).join('-')] || '',
    });
  };
  return { cardFor, corpus, census };
}

/** The entry point. */
async function main() {
  const argv = process.argv.slice(2);
  const machine = await cardMachine();
  if (argv.includes('--all-taste')) {
    for (const entry of TASTE_POOLS) {
      let lines;
      try {
        lines = machine.cardFor(entry.block, entry.pool);
      } catch (error) {
        lines = [`LICENCE (block ${entry.block} · key \`${entry.pool}\`)`,
          `  NOT YET IN THE CORPUS: ${error instanceof Error ? error.message : String(error)}`];
      }
      console.log(lines.join('\n'));
      console.log('');
    }
    return;
  }
  const listAt = argv.indexOf('--list');
  if (listAt >= 0) {
    const block = argv[listAt + 1];
    const blockData = machine.corpus[block];
    if (!blockData) throw new Error(`no block \`${block}\``);
    for (const key of Object.keys(blockData.pools)) {
      console.log(`${(blockData.poolMeta?.[key]?.role || 'spine').padEnd(9)} ${key}`);
    }
    return;
  }
  const [block, pool] = argv;
  if (!block || !pool) {
    throw new Error('usage: node scripts/prose-licence-card.mjs <block> <pool>'
      + '  |  --all-taste  |  --list <block>');
  }
  console.log(machine.cardFor(block, pool).join('\n'));
}

if (process.argv[1] && process.argv[1].endsWith('prose-licence-card.mjs')) await main();
