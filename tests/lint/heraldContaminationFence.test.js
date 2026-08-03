/**
 * heraldContaminationFence.test.js — THE TRUTH LAW + THE CONTAMINATION FENCE
 * (SP-6's owner-law amendment, 2026-08-03). K3 INVERTED.
 *
 * THE HERALD IS THE DM'S PAPER AND IT ALWAYS TELLS THE TRUTH. No manipulation at
 * the rumor or local level ever permeates it: the Herald's composers may never
 * read a rumor ledger, a belief map, or a disinfo record AS A CONTENT SOURCE.
 * Their inputs are truth-side events and receipts only.
 *
 * K3 fenced NEGOTIATION away from TRUTH. This is the same idiom pointed the
 * other way — it fences TRUTH away from BELIEF — and it is enforced structurally
 * rather than by convention, in the three-part shape the war architecture
 * requires:
 *
 *   REACHABILITY   each composer's TRANSITIVE import closure is a closed,
 *                  reviewed list, so a belief hop cannot appear by refactor two
 *                  modules deep where a direct-import pin would never see it.
 *   TOKEN SCAN     no belief/rumor/disinfo access token appears anywhere in the
 *                  composer set.
 *   GUARD-THE-GUARD the same scan FINDS every one of those tokens in a module
 *                  that legitimately reads them, so a scan that silently stopped
 *                  matching cannot pass as compliance.
 *
 * `heraldIntegrity.js` sits OUTSIDE the fence BY RULING and is one of the
 * positive controls here. It is not a composer: it is the DM's audit register
 * over the disinfo record, and it contributes no word to a headline, a subheader
 * or a telling. The fence is what proves that separation is real — the composer
 * cannot reach it, so no disclosure fact can leak into a sentence.
 *
 * @enforced-by this file
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Source with every comment stripped. A source-scan claim about what a module
 * CANNOT reach must read the CODE, never the prose: these modules' own headers
 * describe at length the belief sources they refuse, and a raw scan would count
 * the refusal as the offence.
 */
const code = (rel) => readFileSync(join(ROOT, rel), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

const relativeImportsOf = (source) => [...source.matchAll(/from '([^']+)'/g)]
  .map((m) => m[1])
  .filter((s) => s.startsWith('.'));

/** The transitive reachable set of a set of entry modules, repo-relative. */
function reachable(entries) {
  const seen = new Set();
  const queue = entries.map((rel) => join(ROOT, rel));
  while (queue.length) {
    const file = queue.pop();
    const rel = file.slice(ROOT.length + 1);
    if (seen.has(rel)) continue;
    seen.add(rel);
    for (const spec of relativeImportsOf(code(rel))) {
      const target = resolve(dirname(file), spec);
      if (existsSync(target)) queue.push(target);
    }
  }
  return seen;
}

/**
 * THE COMPOSER SET — every module that puts a word on a Herald tier. The causal
 * voice composes the three prose registers; heraldFeed normalizes the records
 * into entries; heraldGrammar fills the typed headline slots; heraldFilter
 * decides which entries the paper carries at all.
 */
const HERALD_COMPOSERS = Object.freeze([
  'src/domain/display/heraldCausalVoice.js',
  'src/domain/display/heraldCausalGrammar.js',
  'src/domain/display/heraldIndex.js',
  'src/components/map/heraldFeed.js',
  'src/components/map/heraldGrammar.js',
  'src/components/map/heraldFilter.js',
]);

/**
 * THE REVIEWED CLOSURE. Every module a Herald composer is let read, transitively.
 * Adding a row here is a deliberate act with a reason; a refactor that grows the
 * set silently reds instead.
 */
const REVIEWED_CLOSURE = Object.freeze([
  'src/components/map/WorldPulseData.js',
  'src/components/map/heraldFeed.js',
  'src/components/map/heraldFilter.js',
  'src/components/map/heraldGrammar.js',
  'src/domain/display/heraldCausalGrammar.js',
  'src/domain/display/heraldCausalVoice.js',
  'src/domain/display/heraldIndex.js',
  'src/domain/display/humanizeEngineTokens.js',
  'src/domain/display/newsBody.js',
  'src/domain/formatNumber.js',
  'src/domain/realm/heraldRouting.js',
]);

/**
 * The spellings by which BELIEF, RUMOR or DISINFORMATION enters a module in this
 * engine. Each is present in at least one positive control below, so the list
 * cannot rot into a set of strings that no longer matches anything.
 */
const BELIEF_SOURCE_TOKENS = Object.freeze([
  'rumorLedgers',
  'beliefMaps',
  'disinfo',
  'getSpatialLedger',
  'settlementRumors',
  'applyBeliefOverrides',
]);

/**
 * THE POSITIVE CONTROLS — modules that legitimately read the believed world.
 * `heraldIntegrity.js` is here BY RULING: the audit register reads the disinfo
 * record precisely so the composer never has to.
 */
const BELIEF_SOURCES = Object.freeze([
  'src/domain/display/settlementRumors.js',
  'src/domain/worldPulse/beliefMap.js',
  'src/domain/worldPulse/informationStatecraft.js',
  'src/domain/display/heraldIntegrity.js',
]);

describe('REACHABILITY — the composer closure is closed and reviewed', () => {
  test('the transitive closure is exactly the reviewed list', () => {
    expect([...reachable([...HERALD_COMPOSERS])].sort()).toEqual([...REVIEWED_CLOSURE].sort());
  });

  test('no belief source is reachable from any composer, at any depth', () => {
    const closure = reachable([...HERALD_COMPOSERS]);
    for (const source of BELIEF_SOURCES) {
      expect(closure.has(source), `${source} is reachable from a Herald composer`).toBe(false);
    }
  });

  test('the composer cannot reach the audit register — that separation IS the fence', () => {
    expect(reachable(['src/domain/display/heraldCausalVoice.js']).has('src/domain/display/heraldIntegrity.js')).toBe(false);
  });
});

describe('TOKEN SCAN — no belief spelling appears in the composer set', () => {
  test('every composer is clean of every token', () => {
    for (const rel of REVIEWED_CLOSURE) {
      const source = code(rel);
      for (const token of BELIEF_SOURCE_TOKENS) {
        expect(source.includes(token), `${rel} spends the belief token "${token}"`).toBe(false);
      }
    }
  });
});

describe('GUARD-THE-GUARD — the scan bites', () => {
  test('every token is FOUND in a module that legitimately reads the believed world', () => {
    const sources = BELIEF_SOURCES.map((rel) => code(rel));
    for (const token of BELIEF_SOURCE_TOKENS) {
      expect(sources.some((s) => s.includes(token)), `no positive control spends "${token}" — the scan has rotted`).toBe(true);
    }
  });

  test('the reachability walker finds a belief source when one IS reachable', () => {
    // A module that really does reach the rumor ledger must be caught, or the
    // reachability pin above proves nothing about the composers.
    const control = reachable(['src/domain/display/heraldIntegrity.js']);
    expect(control.has('src/domain/display/heraldIntegrity.js')).toBe(true);
    const rumorSide = reachable(['src/domain/display/settlementRumors.js']);
    expect(rumorSide.size).toBeGreaterThan(1);
  });
});

describe('THE TRUTH LAW at the content grain', () => {
  test('the causal voice carries no belief-attribution phrasing of its own', () => {
    // "men said" and its family are lawful in the RUMOR MILL and in-world voices.
    // The Herald attributes minds only as reported fact, and the connective pools
    // that do so (`believed`, `judged`) are the grammar's, never free prose here.
    const voice = code('src/domain/display/heraldCausalVoice.js');
    for (const phrase of ['men said', 'it is rumoured', 'they say', 'word has it']) {
      expect(voice.toLowerCase().includes(phrase)).toBe(false);
    }
  });
});
