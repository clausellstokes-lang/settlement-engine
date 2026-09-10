/**
 * tests/generators/narrativeDeadCategory.test.js
 *
 * genSettSummary built npcNames[].category that NO consumer reads (its only
 * consumer, generateCrimeLevel, destructures stressType/commodity/factions and
 * never touches npcNames) AND conflated two distinct category vocabularies (the
 * NPC's authored category — crafts/noble/… — vs roleToCategory's
 * government/military/economy/… buckets). The dead field was removed, along with
 * the now-unused roleToCategory import.
 *
 * Verified at the source level: the live consumer (generateCoherence →
 * genSettSummary) still runs, but it is a deep internal so we pin the shape via
 * source assertions, and prove the module still imports/runs cleanly.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { describe, it, expect } from 'vitest';

import * as narrative from '../../src/generators/narrativeGenerator.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = readFileSync(resolve(__dirname, '../../src/generators/narrativeGenerator.js'), 'utf8');

const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const CODE = stripComments(SRC);

describe('narrativeGenerator dead npcNames category removed', () => {
  it('genSettSummary no longer derives a category onto npcNames entries', () => {
    // The npcNames map keeps name + role only — no category, no roleToCategory call.
    expect(/npcNames:\s*npcs\.slice\(0,\s*6\)\.map/.test(CODE)).toBe(true);
    expect(/category:\s*n\.category\s*\|\|\s*roleToCategory\(/.test(CODE)).toBe(false);
  });

  it('no longer imports roleToCategory (it was only used by the dead field)', () => {
    expect(/roleToCategory/.test(CODE)).toBe(false);
    expect(/from\s*['"]\.\/roleCategory\.js['"]/.test(CODE)).toBe(false);
  });

  it('the module still loads and its public surface is intact', () => {
    // A revert that left a dangling roleToCategory reference / broken import would
    // throw on module load; reaching here proves the import graph is clean.
    expect(typeof narrative.generateCoherence).toBe('function');
    expect(typeof narrative.generateArrivalScene).toBe('function');
    expect(typeof narrative.generatePressureSentence).toBe('function');
  });
});
