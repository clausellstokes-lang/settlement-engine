/**
 * factionPowerShare.test.js — the DECLARED UNIT of `factions[].power`, proved against its
 * own writer, and the magnitude-sniff habitat it removes.
 *
 * §759.3's POWER-SNIFF-CLIFF: six consumers each guessed the unit at read time with
 * `raw > 1 ? raw / 100 : raw`, a 100× cliff at exactly 1 where a faction holding a 1 % share
 * reads as FULL power. This suite holds three things:
 *
 *   1. THE UNIT IS TRUE, not merely declared — the real writer is executed and its roster is
 *      shown to be an integer percent summing to 100. A declared unit nobody checks is a
 *      comment.
 *   2. THE CLIFF IS GONE at every one of the six sites, by source scan, with a planted
 *      control proving the scan can convict.
 *   3. THE REST OF THE CLASS IS COUNTED. Three sniffs survive on OTHER fields (prosperity,
 *      unrest, a generic significance score) — different fields, different unit questions,
 *      outside this car's class. They are inventoried here SHRINK-ONLY, so the class cannot
 *      regrow and T9 inherits a work order rather than a rumour.
 *
 * @enforced-by this file
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { FACTION_POWER_UNIT, factionPowerShare01 } from '../../src/domain/factionPowerShare.js';
import { normalizeAndAnnotateFactions } from '../../src/generators/power/rulingStructure.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function srcFiles(dir = path.join(ROOT, 'src'), out = []) {
  for (const entry of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) srcFiles(full, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(path.relative(ROOT, full).replace(/\\/g, '/'));
  }
  return out;
}
const SRC = srcFiles();
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
const readCode = (rel) => strip(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

// The fingerprint of an undeclared unit: a magnitude test against 1 that divides by 100 on
// the true branch. Variable-name agnostic on purpose — the six cured sites used five
// different names for the same guess.
const SNIFF = /[>]=?\s*1(\.0)?\s*\?[^;\n]{0,80}\/\s*100/;

describe('the unit is TRUE, proved against its own writer', () => {
  test("normalizeAndAnnotateFactions mints an integer percent roster summing to 100", () => {
    // The writer is executed, not described. Raw weights of any magnitude go in; the unit
    // this leaf declares must come out.
    // `faction` is the roster's own name key (annotateFactionStanding reads it).
    const roster = normalizeAndAnnotateFactions([
      { faction: 'Merchant Guilds', power: 7, isGoverning: true },
      { faction: 'Craft Guilds', power: 3, description: '' },
      { faction: 'Military/Guard', power: 9, description: '' },
      { faction: "Thieves' Guild", power: 1, description: '' },
    ]);
    const powers = roster.map((f) => f.power);
    for (const p of powers) {
      expect(Number.isInteger(p), `power ${p} is not an integer percent`).toBe(true);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(100);
    }
    // Rounding can cost a point or two; the claim is "share of 100", not "exactly 100".
    const total = powers.reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThanOrEqual(98);
    expect(total).toBeLessThanOrEqual(102);
    expect(FACTION_POWER_UNIT).toBe('percent_0_100');
  });

  test('the reader inverts the writer: a 60-share faction outranks a 1-share faction', () => {
    // THE CLIFF ITSELF, as a behaviour assertion. Under the sniff these two compared
    // 0.6 vs 1.0 and the 1-share faction WON.
    expect(factionPowerShare01(60)).toBeGreaterThan(/** @type {number} */(factionPowerShare01(1)));
    expect(factionPowerShare01(1)).toBe(0.01);
    expect(factionPowerShare01(100)).toBe(1);
    expect(factionPowerShare01(0)).toBe(0);
  });

  test('TOTAL, and null-for-unreadable so each caller keeps its own default', () => {
    // STRICT: a numeric STRING is not a power either — two of the six callers already
    // rejected one, and coercing in the leaf would have silently changed them.
    for (const junk of [undefined, null, '', 'high', '50', NaN, true, {}, []]) {
      expect(factionPowerShare01(junk), `junk ${JSON.stringify(junk)}`).toBe(null);
    }
    expect(factionPowerShare01(-5)).toBe(0);   // clamped, not negative
    expect(factionPowerShare01(400)).toBe(1);  // clamped, not 4
  });
});

describe('the cliff is gone where it was chartered', () => {
  // The six that read `factions[].power`, cured in T7/UNITS.
  const CURED = Object.freeze([
    'src/domain/worldPulse/factionCompetition.js',
    'src/domain/worldPulse/warPoliticalLoop.js',
    'src/domain/worldPulse/disposition.js',
    'src/domain/worldPulse/supplyKernel.js',
    'src/domain/undercity/colonization.js',
    'src/domain/worldPulse/warSeatBooks.js',
  ]);

  test.each(CURED)('%s carries no magnitude sniff and reads the ONE leaf', (rel) => {
    const code = readCode(rel);
    expect(SNIFF.test(code), `${rel} magnitude-sniffs a power field again`).toBe(false);
    expect(code, `${rel} no longer imports the one reader`).toMatch(/factionPowerShare01/);
  });

  test('the scan is not vacuous — it convicts the exact body it was built from', () => {
    // Verbatim from the six, before the cure.
    expect(SNIFF.test('return raw > 1 ? clamp01(raw / 100) : clamp01(raw);')).toBe(true);
    expect(SNIFF.test('return clamp01(number > 1 ? number / 100 : number);')).toBe(true);
    expect(SNIFF.test('clamp(power > 1 ? power / 100 : power, 0, 1)')).toBe(true);
    // …and stays silent on the cure and on an ordinary percentage.
    expect(SNIFF.test('return factionPowerShare01(faction.power) ?? 0.5;')).toBe(false);
    expect(SNIFF.test('const pct = Math.round((f.power || 0) / total * 100);')).toBe(false);
  });
});

describe('the rest of the sniff class is counted, shrink-only', () => {
  // ⚠ THESE ARE NOT `factions[].power`. Each is the same IDIOM on a different field, so each
  // owes its own unit answer and its own shift measurement — outside T7/UNITS' class boundary
  // ("every instance caused by the undeclared unit on factions[].power"). They are counted
  // here so the class cannot regrow silently and T9/GUARDS inherits a measured work order.
  // Codepoint order, matching the source walk.
  const REMAINING = Object.freeze([
    ['src/domain/realm/realmItemReadModel.js', 1,
      'a generic `score` on an arbitrary semantic record; the unit genuinely varies by '
      + 'producer here, so the answer is a typed registry rather than a division'],
    ['src/domain/worldPulse/npcReplacement.js', 2,
      'prosperity and unrest, both read "0..100 or 0..1" off a settlement. The prosperity one '
      + 'is adjacent to the ladder T7 unified — it reads a NUMERIC prosperity, not the label — '
      + 'and wants the same declared-unit treatment'],
  ]);

  test('the surviving sniff sites are exactly the inventoried ones, and no more', () => {
    const found = SRC
      .map((rel) => [rel, (readCode(rel).match(new RegExp(SNIFF.source, 'g')) || []).length])
      .filter(([, n]) => n > 0)
      .map(([rel, n]) => [rel, n]);
    const expected = REMAINING.map(([rel, n]) => [rel, n]);
    expect(
      found,
      'the magnitude-sniff class moved. It may only SHRINK: a new site is an undeclared unit '
      + 'arriving (§711.6), and a cured site should be deleted from REMAINING with its cure',
    ).toEqual(expected);
  });

  test('the inventory is non-empty and each row states why it is not this car', () => {
    expect(REMAINING.length).toBeGreaterThan(0);
    for (const [rel, count, why] of REMAINING) {
      expect(count).toBeGreaterThan(0);
      expect(why.length, `${rel} has no reason`).toBeGreaterThan(40);
    }
  });
});
