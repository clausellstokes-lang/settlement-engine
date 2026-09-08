/**
 * warStanceLadder.test.js — WC-0A acceptance A6..A8 for `src/domain/worldPulse/warStance.js`.
 *
 * ⚠ ANCHOR DISCIPLINE (negativeAssertionAnchor.walker): a NEW tests/domain file starts at
 * ceiling ZERO against the frozen roster, so this file writes NONE of the three negated
 * membership forms that walker scans for. Every negative below is spelled as `toEqual([])`,
 * `toBe(false)` or `toHaveLength(0)`, all of which are free.
 *
 * ⛔ AND THIS NOTICE IS WORDED, NOT QUOTED, FOR A MEASURED REASON — see the sibling header
 * in `peopleLedgerVocabulary.test.js`. Quoting the scanned forms to explain that they are
 * absent is itself three violations; the cure is rewording, never widening the scan.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  WAR_STANCE_LADDER,
  WAR_STANCE_RANK,
  STANCE_SCALAR_AXES,
  warStanceOf,
  stanceScalars,
} from '../../src/domain/worldPulse/warStance.js';

const SOURCE_PATH = fileURLToPath(
  new URL('../../src/domain/worldPulse/warStance.js', import.meta.url),
);

/**
 * The module's code with every comment BLANKED, so a comment can neither satisfy nor break
 * a scan.
 *
 * ⛔ LINE-PRESERVING BY CONSTRUCTION, AND THE TEST ASSERTS THAT IT IS. The landed HB-1
 * walker's `codeOnly()` collapses what it masks, so its blob stops being line-addressable
 * and every `file:line` it reports afterwards is wrong. Here each masked character becomes
 * a space and every newline survives, so a reported line number still points at the line
 * that carries the offence.
 */
function codeOnly(source) {
  const blank = (match) => match.replace(/[^\n]/g, ' ');
  return source.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/^[ \t]*\/\/.*$/gm, blank);
}

describe('WC-0A · the war stance ladder is a rank map, not an array position', () => {
  it('holds the five rungs and gives each an explicit rank', () => {
    expect(WAR_STANCE_LADDER).toEqual([
      'neutral',
      'materiel',
      'auxiliary',
      'belligerent',
      'principal',
    ]);
    expect(Object.isFrozen(WAR_STANCE_LADDER)).toBe(true);
    expect(WAR_STANCE_RANK).toEqual({
      neutral: 0,
      materiel: 1,
      auxiliary: 2,
      belligerent: 3,
      principal: 4,
    });
    // The two declarations cover the same rungs — a roster member with no rank, or a rank
    // for a rung nobody rosters, is the drift this pair exists to make impossible.
    expect([...WAR_STANCE_LADDER].sort()).toEqual(Object.keys(WAR_STANCE_RANK).sort());

    // ⭐ THE ARM THAT SAYS MEANING IS NOT POSITION. A SHUFFLED roster, re-sorted by the rank
    // the module reports, must come back in semantic order. A `warStanceOf` re-keyed on
    // array index answers with the shuffled roster's positions and this reds — which is
    // exactly mutant M4, whose plant shuffles the array in the same edit.
    const shuffled = ['principal', 'auxiliary', 'neutral', 'belligerent', 'materiel'];
    expect([...shuffled].sort()).toEqual([...WAR_STANCE_LADDER].sort());
    const bySemanticRank = [...shuffled].sort(
      (a, b) => warStanceOf(a).rank - warStanceOf(b).rank,
    );
    expect(bySemanticRank).toEqual([
      'neutral',
      'materiel',
      'auxiliary',
      'belligerent',
      'principal',
    ]);
    for (const rung of WAR_STANCE_LADDER) {
      expect(warStanceOf(rung).rank).toBe(WAR_STANCE_RANK[rung]);
    }
  });

  it('throws on an unknown rung and keeps stanceScalars total over the ladder', () => {
    for (const bad of ['declared', 'Principal', 'ally', '', null, undefined, 0]) {
      expect(() => warStanceOf(bad)).toThrow(TypeError);
      expect(() => stanceScalars(bad)).toThrow(TypeError);
    }
    // ⛔ A silent default would grade an unknown party as `neutral`, which is a real stance.
    expect(() => warStanceOf('neutral')).not.toThrow();

    expect(STANCE_SCALAR_AXES).toEqual(['casus', 'exhaustion', 'terms']);
    for (const rung of WAR_STANCE_LADDER) {
      const row = stanceScalars(rung);
      expect(Object.keys(row).sort()).toEqual([...STANCE_SCALAR_AXES].sort());
      expect(Object.isFrozen(row)).toBe(true);
    }

    // ⭐ THE VALUES ARE UNREGISTERED AND THAT IS ASSERTED, NOT ASSUMED — WC-0's "TUNING:
    // none" made a measurement. Multipliers are constants and constants are owner-signature
    // surface; the volume lands them with their movers at WC-2. A numeric scalar entering
    // this module reds here.
    const registered = WAR_STANCE_LADDER.flatMap((rung) =>
      Object.entries(stanceScalars(rung))
        .filter(([, value]) => typeof value === 'number')
        .map(([axis]) => `${rung}.${axis}`),
    );
    expect(registered).toEqual([]);
  });

  it('exposes no declarer disjunct: priced shielding is not purchasable at declaration time', () => {
    // Directive (f). A rung reachable by DECLARING it would let a party buy `principal`'s
    // protection by saying the word instead of by fielding the majority realized share.
    const DECLARER = /declar/i;
    const surface = [
      ...WAR_STANCE_LADDER,
      ...Object.keys(WAR_STANCE_RANK),
      ...STANCE_SCALAR_AXES,
    ];
    expect(surface.filter((name) => DECLARER.test(name))).toEqual([]);

    // ⚠ SCANNED WITH COMMENTS STRIPPED, DELIBERATELY. This module's header EXPLAINS the
    // absence at length and therefore spells the word; a raw-text scan would convict the
    // explanation instead of a branch. The masked scan preserves line count, so what it
    // reports stays addressable.
    const masked = codeOnly(readFileSync(SOURCE_PATH, 'utf8'));
    expect(masked.split('\n')).toHaveLength(readFileSync(SOURCE_PATH, 'utf8').split('\n').length);
    const offendingLines = masked
      .split('\n')
      .map((line, i) => [i + 1, line])
      .filter(([, line]) => DECLARER.test(line))
      .map(([n, line]) => `${n}: ${line.trim()}`);
    expect(offendingLines).toEqual([]);
    // Non-vacuity: the mask really is looking at live code, not at an emptied buffer.
    expect(masked).toContain('export const WAR_STANCE_LADDER');
  });
});
