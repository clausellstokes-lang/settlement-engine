/**
 * acceptanceCharacterReads.test.js — the acceptance seam's character half, and the
 * ABSENCES it must keep distinguishable from readings.
 *
 * ⭐⭐ THE SHAPE OF THIS BATTERY IS DECIDED BY ONE MEASURED FACT: on every world this
 * engine can generate today there is no authored chart and no drift, so a suite that
 * only ever saw the absent case would be green and would discover NOTHING. Every arm
 * below is therefore driven TWICE — once with nothing, once with a chart proved able to
 * move the reading — and the byte-identity claims are the absent case measured beside a
 * live one, never asserted alone.
 *
 * ⭐ AND THE HARDEST ARMS ARE THE ONES WHERE THE NUMBERS AGREE. Finding O2-D's whole
 * point is that `null` and a supplied `0` produce IDENTICAL `center` and `breadth`; the
 * collapse shows only in `absent[]`. So those arms assert the numbers are equal AND the
 * absences differ — an assertion on either half alone would pass on the bug.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  MAX_RISK_BREADTH,
  MIN_RISK_BREADTH,
  NEUTRAL_RISK_CENTER,
} from '../../../src/domain/npc/characterConsumers.js';
import {
  ACCEPTANCE_READ_PROVENANCE,
  ACCEPTANCE_READ_TERMS,
  acceptanceCharacterRead,
  vettingInputFor,
} from '../../../src/domain/npc/acceptanceCharacterReads.js';
import { VETTING_TEMPER_BANDS, vetVolunteerEnvoy } from '../../../src/domain/worldPulse/sendTwoDivergence.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const LEAF = 'src/domain/npc/acceptanceCharacterReads.js';

/** Every .js/.jsx under src/, repo-relative. */
function srcFiles() {
  /** @type {string[]} */
  const out = [];
  const walk = (/** @type {string} */ dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.jsx?$/.test(entry.name)) out.push(full);
    }
  };
  walk(join(ROOT, 'src'));
  return out;
}

/** A soul with no chart at all — every world this engine generates today. */
const PLAIN = Object.freeze({ id: 'npc.plain' });

/** @param {Record<string, {pole: string, level: string}>} axes */
const charted = (axes) => ({ id: 'npc.charted', character: { axes } });

/** COURAGE at its virtue pole, PRUDENCE at its vice pole: the bold soul. */
const BOLD = charted({
  COURAGE: { pole: 'virtue', level: 'defining' },
  PRUDENCE: { pole: 'vice', level: 'defining' },
});

/** The mirror image, so the two centres sit either side of neutral. */
const TIMID = charted({
  COURAGE: { pole: 'vice', level: 'defining' },
  PRUDENCE: { pole: 'virtue', level: 'defining' },
});

/** A KNOWN chart the seat can band — `characterAsSeenBy`'s shape. */
const KNOWN_TREACHEROUS = { axes: { FIDELITY: { pole: 'vice', level: 'defining' } } };
const KNOWN_LOYAL = { axes: { FIDELITY: { pole: 'virtue', level: 'defining' } } };
/** A chart that exists and says nothing — the case `null` must not be confused with. */
const KNOWN_SILENT = { axes: {} };

describe('the acceptance read — the register reaches the soul THROUGH the chokepoint', () => {
  test('a chart MOVES the centre, so this reader is proved able to see before anything is pinned', () => {
    // The anti-vacuity arm, first. Every "identical" claim below is worthless unless
    // the comparator can tell two souls apart at all.
    const bold = acceptanceCharacterRead({ npc: BOLD }).register.center;
    const timid = acceptanceCharacterRead({ npc: TIMID }).register.center;
    expect(bold).toBeGreaterThan(NEUTRAL_RISK_CENTER);
    expect(timid).toBeLessThan(NEUTRAL_RISK_CENTER);
    expect(bold).toBeGreaterThan(timid);
  });

  test('an uncharted soul sits at the neutral centre and the narrowest window', () => {
    const read = acceptanceCharacterRead({ npc: PLAIN });
    expect(read.register.center).toBe(NEUTRAL_RISK_CENTER);
    expect(read.register.breadth).toBe(MIN_RISK_BREADTH);
  });

  test('disorder opens the window, and the two ends are the register\'s own', () => {
    expect(acceptanceCharacterRead({ npc: PLAIN, disorder01: 1 }).register.breadth)
      .toBe(MAX_RISK_BREADTH);
    expect(acceptanceCharacterRead({ npc: PLAIN, disorder01: 0 }).register.breadth)
      .toBe(MIN_RISK_BREADTH);
  });

  test('desperation pushes the centre OUTWARD only — a calm world is not its opposite', () => {
    const calm = acceptanceCharacterRead({ npc: PLAIN, desperation01: 0 }).register.center;
    const desperate = acceptanceCharacterRead({ npc: PLAIN, desperation01: 1 }).register.center;
    expect(calm).toBe(NEUTRAL_RISK_CENTER);
    expect(desperate).toBeGreaterThan(calm);
  });
});

describe('⛔ THE R6 COERCION CURE — null is ABSENT, never a supplied zero (finding O2-D)', () => {
  test('null desperation and a supplied ZERO agree on every number and DISAGREE on absent[]', () => {
    // THE WHOLE OF O2-D IN ONE ARM. `Number(null)` is a finite 0, so the register's own
    // presence guard would record "nobody is desperate" where the caller meant "nobody
    // asked" — and the two readings produce byte-identical centres, so only `absent[]`
    // can tell them apart. Asserting the numbers alone would pass on the bug; asserting
    // the absence alone would not show that the bug is invisible.
    const asked = acceptanceCharacterRead({ npc: BOLD, desperation01: 0 });
    const unasked = acceptanceCharacterRead({ npc: BOLD, desperation01: null });
    expect(unasked.register.center).toBe(asked.register.center);
    expect(unasked.register.breadth).toBe(asked.register.breadth);
    expect(asked.absent).not.toContain('desperation01');
    expect(unasked.absent).toContain('desperation01');
  });

  test('null disorder and a supplied ZERO agree on breadth and DISAGREE on absent[]', () => {
    const asked = acceptanceCharacterRead({ npc: BOLD, disorder01: 0 });
    const unasked = acceptanceCharacterRead({ npc: BOLD, disorder01: null });
    expect(unasked.register.breadth).toBe(asked.register.breadth);
    expect(asked.absent).not.toContain('disorder01');
    expect(unasked.absent).toContain('disorder01');
  });

  test('every non-number spelling of "I do not hold this" is ABSENT, not a zero', () => {
    for (const value of [null, undefined, '', '0', true, false, {}, []]) {
      const read = acceptanceCharacterRead({
        npc: PLAIN, desperation01: value, disorder01: value,
      });
      expect(read.absent, `desperation01 must be absent for ${JSON.stringify(value)}`)
        .toContain('desperation01');
      expect(read.absent, `disorder01 must be absent for ${JSON.stringify(value)}`)
        .toContain('disorder01');
    }
  });

  test('NaN and Infinity ARE numbers and neither is a reading — the REGISTER\'s guard, named', () => {
    // ⚠⚠ EVERY ARM IN THIS DESCRIBE IS NOW THE REGISTER'S GUARD, AND SAYING SO IS STILL
    // THE POINT. At car 1 this leaf held a `finiteOrAbsent` of its own and only the
    // finiteness half was the register's; a planted removal of that half SURVIVED the
    // whole battery, which is how the redundancy was found. The substrate coupling then
    // moved the TYPE test into `riskRegister` itself — the chokepoint every caller
    // reads, rather than the one caller that remembered — so this leaf's copy became a
    // second spelling of one guard and was retired in its turn.
    //
    // ⭐ WHAT THAT MAKES THIS DESCRIBE IS A CONSUMER-SIDE PROOF OF A PRODUCER-SIDE CURE,
    // and it is worth more than it was: every test here now reds if the register's guard
    // is reverted, which is exactly the evidence that retiring the local copy left no
    // hole. Measured, not assumed — the plants that revert `riskRegister`'s two guards
    // kill three of these rows.
    const read = acceptanceCharacterRead({
      npc: PLAIN, desperation01: Number.NaN, disorder01: Number.POSITIVE_INFINITY,
    });
    expect(read.absent).toContain('desperation01');
    expect(read.absent).toContain('disorder01');
    // And the register did not quietly clamp the infinity into a wide window.
    expect(read.register.breadth).toBe(MIN_RISK_BREADTH);
  });

  test('a fully supplied read declares NOTHING absent, so the list is not stuck full', () => {
    const read = acceptanceCharacterRead({
      npc: BOLD, knownChart: KNOWN_SILENT, desperation01: 0.5, disorder01: 0.5,
    });
    expect(read.absent).toEqual([]);
  });
});

describe('⭐ THE THIRD ARM — no chart gives NO BAND, not an ordinary man', () => {
  test('an absent chart bands to null and declares knownChart absent', () => {
    const read = acceptanceCharacterRead({ npc: BOLD });
    expect(read.temperBand).toBe(null);
    expect(read.absent).toContain('knownChart');
  });

  test('a chart that SAYS NOTHING bands to `ordinary` and declares nothing absent', () => {
    // The discriminating pair. `vettingTemperBand` answers `ordinary` for both inputs,
    // so a supplier that quoted it unconditionally would report a finding the court
    // never made. The two cases must be separable here or nowhere.
    const read = acceptanceCharacterRead({ npc: BOLD, knownChart: KNOWN_SILENT });
    expect(read.temperBand).toBe('ordinary');
    expect(read.absent).not.toContain('knownChart');
  });

  test('the band is read from the KNOWN chart, at both poles', () => {
    expect(acceptanceCharacterRead({ npc: PLAIN, knownChart: KNOWN_TREACHEROUS }).temperBand)
      .toBe('self_serving');
    expect(acceptanceCharacterRead({ npc: PLAIN, knownChart: KNOWN_LOYAL }).temperBand)
      .toBe('dutiful');
  });

  test('the band the seat reads is the KNOWN one and never the subject\'s own chart', () => {
    // §12 R2: a court is a MORTAL consumer, which is what makes a well-run treachery
    // read `dutiful`. The npc handed in is treacherous on FIDELITY; the KNOWN chart the
    // town holds says otherwise, and the town's reading is what a seat vets on.
    const trueSelf = charted({ FIDELITY: { pole: 'vice', level: 'defining' } });
    expect(acceptanceCharacterRead({ npc: trueSelf, knownChart: KNOWN_LOYAL }).temperBand)
      .toBe('dutiful');
  });

  test('every band this leaf can emit is a member of the ⟨F8⟩ reader\'s own vocabulary', () => {
    const emitted = [KNOWN_TREACHEROUS, KNOWN_SILENT, KNOWN_LOYAL]
      .map((chart) => acceptanceCharacterRead({ npc: PLAIN, knownChart: chart }).temperBand);
    expect(emitted).toEqual(['self_serving', 'ordinary', 'dutiful']);
    expect(emitted.every((band) => VETTING_TEMPER_BANDS.includes(String(band)))).toBe(true);
  });
});

describe('the ⟨F8⟩ input row — composed, never decided', () => {
  /** The row `vetVolunteerEnvoy` takes, with nothing in it a careful seat would refuse. */
  const volunteer = Object.freeze({
    npcId: 'npc.volunteer', loyaltyBand: 'proven', foreignTieBand: 'none',
  });

  test('NO CHART ⇒ THE CALLER\'S OWN ROW, BY REFERENCE — the byte-identity proof, structurally', () => {
    expect(vettingInputFor({ volunteer })).toBe(volunteer);
    expect(vettingInputFor({ volunteer, knownChart: null })).toBe(volunteer);
    expect(vettingInputFor({ volunteer, knownChart: 'dutiful' })).toBe(volunteer);
  });

  test('a chart fills the one field the ⟨F8⟩ reader has been waiting for', () => {
    const filled = /** @type {Record<string, unknown>} */ (
      vettingInputFor({ volunteer, knownChart: KNOWN_TREACHEROUS })
    );
    expect(filled).not.toBe(volunteer);
    expect(filled.temperBand).toBe('self_serving');
    expect(filled.npcId).toBe('npc.volunteer');
    expect(filled.loyaltyBand).toBe('proven');
  });

  test('a band the caller already made is NOT overwritten — this leaf is not the decider', () => {
    const judged = { ...volunteer, temperBand: 'dutiful' };
    expect(vettingInputFor({ volunteer: judged, knownChart: KNOWN_TREACHEROUS })).toBe(judged);
  });

  test('an empty band string is not a judgement, so it IS filled', () => {
    const blank = { ...volunteer, temperBand: '' };
    const filled = /** @type {Record<string, unknown>} */ (
      vettingInputFor({ volunteer: blank, knownChart: KNOWN_TREACHEROUS })
    );
    expect(filled.temperBand).toBe('self_serving');
  });

  test('garbage passes straight back rather than becoming a half-row', () => {
    for (const value of [null, undefined, 7, 'row', []]) {
      expect(vettingInputFor({ volunteer: value, knownChart: KNOWN_TREACHEROUS })).toBe(value);
    }
  });

  test('⭐ THE ARM THAT COULD NOT FIRE BEFORE NOW FIRES — and only through the one home', () => {
    // `vetVolunteerEnvoy`'s own header records that its `temper` arm "cannot fire, which
    // is every caller today", because nothing in the estate held a KNOWN chart to band.
    // This is the whole coupling in one assertion: the same seat, the same reader, the
    // same records — and a man the paperwork clears is now refused on his character.
    expect(vetVolunteerEnvoy({ quality: 'careful', volunteer })).toEqual({
      accepted: true, quality: 'careful', basis: 'nothing_found', reason: 'vetted',
    });
    expect(vetVolunteerEnvoy({
      quality: 'careful',
      volunteer: vettingInputFor({ volunteer, knownChart: KNOWN_TREACHEROUS }),
    })).toEqual({
      accepted: false, quality: 'careful', basis: 'temper', reason: 'vetted',
    });
  });

  test('the seat\'s OWN RECORDS still decide first — character speaks only about a cleared man', () => {
    // J6, met from the supplier side: a close foreign tie refuses on `foreign_tie` even
    // when the character term would also have refused, and a hurried seat never looks
    // at all. Filling the field may not reorder the reader's arms.
    const tied = { ...volunteer, foreignTieBand: 'close' };
    expect(vetVolunteerEnvoy({
      quality: 'careful',
      volunteer: vettingInputFor({ volunteer: tied, knownChart: KNOWN_TREACHEROUS }),
    }).basis).toBe('foreign_tie');
    expect(vetVolunteerEnvoy({
      quality: 'hurried',
      volunteer: vettingInputFor({ volunteer, knownChart: KNOWN_TREACHEROUS }),
    }).basis).toBe('no_time_to_look');
  });
});

describe('the read\'s own shape', () => {
  test('the term roster is DERIVED from the register\'s, so a term added upstream arrives here', () => {
    expect(ACCEPTANCE_READ_TERMS).toEqual(['desperation01', 'disorder01', 'knownChart']);
  });

  test('absent[] is codepoint-ordered and frozen, and the read itself is frozen', () => {
    const read = acceptanceCharacterRead({ npc: PLAIN });
    expect([...read.absent]).toEqual([...read.absent].sort());
    expect(Object.isFrozen(read)).toBe(true);
    expect(Object.isFrozen(read.absent)).toBe(true);
    expect(() => /** @type {{absent: string[]}} */ (read).absent.push('x')).toThrow();
  });

  test('the provenance is owner-UNSIGNED and names what it consumes', () => {
    expect(ACCEPTANCE_READ_PROVENANCE.signedBy).toBe(null);
    expect(ACCEPTANCE_READ_PROVENANCE.consumes.length).toBe(3);
    expect(ACCEPTANCE_READ_PROVENANCE.ownerRows.every((row) => row.length > 60)).toBe(true);
  });
});

describe('DARK BY CONSTRUCTION — the supplier has no production caller and reaches one module', () => {
  test('nothing under src/ imports this leaf', () => {
    const importers = srcFiles()
      .filter((file) => !file.endsWith('acceptanceCharacterReads.js'))
      .filter((file) => /from\s+'[^']*acceptanceCharacterReads\.js'/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(ROOT, file).replace(/\\/g, '/'))
      .sort();
    expect(importers).toEqual([]);
  });

  test('⛔ the leaf imports the CHOKEPOINT and nothing else from the character stack', () => {
    // The darknesses this leaf must not spend: `characterDrift.js` is pinned to ONE
    // production door and `knownCharacter.js` to ZERO src importers. Reaching either
    // directly would be a cheaper read bought with another car's guarantee.
    const source = readFileSync(join(ROOT, LEAF), 'utf8');
    const imports = [...source.matchAll(/^import[\s\S]*?from\s+'([^']+)';$/gm)].map((m) => m[1]);
    expect(imports.sort()).toEqual(['../deterministicSort.js', './characterConsumers.js']);
  });

  test('⛔ and it names no drift writer, no world state and no flag', () => {
    const source = readFileSync(join(ROOT, LEAF), 'utf8');
    // Asserted LIVE first, so the exclusions below cannot pass on a path that read back
    // empty (the anti-vacuity idiom this estate's closure scans all carry).
    expect(source).toContain('ACCEPTANCE_READ_TERMS');
    expect(source).not.toContain('writeAxisDrift');
    expect(source).not.toContain('setCharacterDrift');
    expect(source).not.toMatch(/\bworldState\b/);
    expect(source).not.toMatch(/simulationRules|Enabled'/);
  });

  test('⛔ THE FIFTH SEAM IS NOT NAMED HERE — the willingness pin keeps its place', () => {
    // O1's producer census walks src/ for the symbols the roster still awaits, excluding
    // only the operations family. Naming the willingness door in THIS file would trip
    // that census on a leaf that wired nothing — so the absence is asserted rather than
    // trusted to review. (This test file is under tests/ and the census does not walk it.)
    expect(readFileSync(join(ROOT, LEAF), 'utf8')).not.toContain('seek_compromise');
  });
});
