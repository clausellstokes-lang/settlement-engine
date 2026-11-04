/**
 * tests/lint/faithTeaserLicence.test.js — EVERY DS-FTH-2 SENTENCE READS THE ONE FAITH READING
 * (lane FAITH-POOLS, 2026-11-04).
 *
 * Lane FAITH cured the denial beside a church by one reading
 * (`src/domain/dossier/faithReading.js :: faithReadingOf`) and left the patron-less town's
 * prose pool, DS-FTH-2, for a prose car: its eight variants denied an organised faith, graded
 * it, or described it in words the reading cannot back. This walker is the car's measure:
 * it lists every DS-FTH-2 sentence whose words are not licensed by the reading.
 *
 * WHAT A SENTENCE MAY SAY. DS-FTH-2's two cells are keyed on the viewer alone, so every
 * variant is offered to EVERY patron-less town, with a church or without. A variant therefore
 * says only:
 *   - what a slot it names carries, because the kernel's anchored liveness drops it where the
 *     reading has no such fact — `{houses}` (`reading.churchWords`, only where a church
 *     stands), `{cleric}` (`reading.seniorCleric.role`), `{faction}`
 *     (`reading.religiousFaction.name`);
 *   - what is true on every reading: the religion dial (`{observance}`, banded by
 *     `faithReading.js :: observancePhraseOf`) and the town's own name (`{settlement}`).
 * A word that names a church, a cleric or a faction is CASE-BOUND: it may stand only in a
 * variant that also names the slot carrying that fact. No denial phrase
 * (`faithDenialFindings.js :: FAITH_DENIALS`), no word outside the licensed vocabulary.
 *
 * The cells keep their size: at least four variants each, as authored before the car.
 */
import { describe, expect, test } from 'vitest';

import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { FAITH_DENIALS } from '../../src/domain/coherence/faithDenialFindings.js';

/** The slots the reading fills, and the reading field each one carries. */
const READING_SLOTS = Object.freeze({
  settlement: 'the town’s own name (every reading)',
  observance: 'reading.dial, banded by observancePhraseOf (every reading)',
  houses: 'reading.churchWords (only where reading.hasChurch)',
  cleric: 'reading.seniorCleric.role (only where a senior cleric is on the roster)',
  faction: 'reading.religiousFaction.name (only where a religious faction holds power)',
});

/**
 * Words that state a CASE-BOUND fact, and the slot whose presence licenses them. A variant
 * that uses one without naming its slot would speak over a town the fact is false of.
 */
const CASE_BOUND = Object.freeze({
  // "the faith" is an organised faith: a church, a cleric or a religious faction, never the
  // quiet observances of a town with none (`faithLinesOf`'s quiet case says no creed holds).
  faith: ['houses', 'cleric', 'faction'],
  church: ['houses'], churches: ['houses'],
  cleric: ['cleric'], senior: ['cleric'], rank: ['cleric'], clergy: ['cleric'],
  factions: ['faction'], party: ['faction'], affairs: ['faction'],
});

/**
 * THE LICENSED VOCABULARY — function words, and the content words the faith line itself
 * speaks (`faithReading.js :: faithLinesOf`) for the facts above. Anything else is a word
 * the reading does not give.
 */
const LICENSED = new Set([
  // function words
  'a', 'an', 'the', 'in', 'of', 'its', 'is', 'and', 'for', 'their', 'to', 'among', 'by',
  // the page's own town, spoken without its name
  'here', 'place', 'local',
  // the facts, as the faith line words them
  'faith', 'keeps', 'keep', 'kept', 'at', 'people', 'folk', 'observances', 'rites',
  'church', 'churches', 'cleric', 'senior', 'rank', 'clergy', 'holds',
  'factions', 'speaks', 'party', 'affairs',
]);

const BLOCK = DOSSIER_STATE_PROSE_WAR_FAITH['DS-FTH-2'];
const CELL_FLOOR = Object.freeze({ 'PRIVATE DOSSIER': 4, 'PUBLIC / SHARED DOSSIER': 4 });

/** @param {string} text @returns {string[]} the bare words, slots removed */
function wordsOf(text) {
  return text.replace(/\{[a-z_]+\}/g, ' ').toLowerCase().replace(/[’']s\b/g, '').split(/[^a-z]+/).filter(Boolean);
}

/**
 * Every unlicensed sentence in DS-FTH-2 (or in the pools handed in), with its reasons.
 * @param {Record<string, ReadonlyArray<{text: string, vid: number}>>} [pools]
 * @returns {Array<{cell: string, vid: number, text: string, reasons: string[]}>}
 */
function unlicensed(pools = BLOCK.pools) {
  const out = [];
  for (const [cell, variants] of Object.entries(pools)) {
    for (const v of variants) {
      const reasons = [];
      const slots = [...v.text.matchAll(/\{([a-z_]+)\}/g)].map((m) => m[1]);
      for (const re of FAITH_DENIALS) if (re.test(v.text)) reasons.push(`denial ${re}`);
      for (const slot of slots) if (!(slot in READING_SLOTS)) reasons.push(`slot {${slot}} is not the reading's`);
      for (const word of wordsOf(v.text)) {
        if (!LICENSED.has(word)) reasons.push(`word "${word}" is not the reading's`);
        else if (CASE_BOUND[word] && !CASE_BOUND[word].some((s) => slots.includes(s))) {
          reasons.push(`word "${word}" is case-bound to {${CASE_BOUND[word].join('|')}}, which the variant does not name`);
        }
      }
      if (reasons.length > 0) out.push({ cell, vid: v.vid, text: v.text, reasons: [...new Set(reasons)] });
    }
  }
  return out;
}

describe('DS-FTH-2 reads the one faith reading', () => {
  test('no DS-FTH-2 sentence says more than the reading gives', () => {
    const found = unlicensed();
    expect(found.map((f) => `${f.cell} #${f.vid}: ${f.text} — ${f.reasons.join('; ')}`), `${found.length} unlicensed`).toEqual([]);
  });

  test('every cell keeps its size, and at least one variant speaks on every reading', () => {
    for (const [cell, floor] of Object.entries(CELL_FLOOR)) {
      const variants = BLOCK.pools[cell];
      expect(variants.length, cell).toBeGreaterThanOrEqual(floor);
      // A variant naming only the slots every reading fills is live on the quietest town.
      const universal = variants.filter((v) => (v.slots || []).every((s) => s === 'settlement' || s === 'observance'));
      expect(universal.length, cell).toBeGreaterThanOrEqual(1);
    }
  });

  test('anti-vacuity: the walker reds a denial, a grade and a case-bound word out of place', () => {
    const plant = (text) => unlicensed({ plant: [{ text, vid: 99 }] }).length;
    expect(plant('No faith holds the town.')).toBe(1);
    expect(plant('Devotion runs deep in {settlement}.')).toBe(1);
    expect(plant('The people of {settlement} keep the faith at the church.')).toBe(1);
  });
});
