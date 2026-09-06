/**
 * knownCharacter.test.js — the reputation read and THE SIGHT RULING (W-LIVES car
 * L4, the R2 half-car).
 *
 * Four things are pinned, and the first is the feature:
 *
 *   UNRECEIPTED DRIFT STAYS PRIVATE. A soul whose chart has genuinely curdled, with
 *   nothing on record, reads to the whole town exactly as he was authored. The
 *   quiet clerk's treachery surprises. This is asserted against a soul whose TRUE
 *   chart is simultaneously proved to have moved, so it cannot pass on a fixture
 *   where nothing happened.
 *
 *   THE SIGHT RULING IS ONE SEAM WITH TWO BRANCHES, and the divine branch is L2's
 *   `effectiveCharacter` CALLED — so "deities read the true chart" is a property of
 *   there being one function, not of two functions agreeing. Byte-identity is
 *   proved by REFERENCE where the design promises it.
 *
 *   ⚠ AMENDED BY CAR L5: `targetedFootholds` KEEPS TRUE SIGHT, and the proof is
 *   now the PROPERTY executed rather than a substring ban that L5 walked past —
 *   see the re-pointed test below. The original sentence read:
 *   `targetedFootholds` KEEPS TRUE SIGHT, and the proof is that this car did not
 *   touch it: it reads `npc.personality` and never `npc.character`, so it has no
 *   code path a chart could disturb. Pinned so the day L5 re-points it, somebody
 *   has to mean it.
 *
 *   NO STORE IS MINTED. GAP D forbids a per-NPC memory; the read is a function of
 *   its arguments and the world is byte-identical after it.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`.
 *
 * @enforced-by this test
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  DISCLOSURE_KINDS,
  KNOWN_CHARACTER_PROVENANCE,
  KNOWN_STATE_FLAGS,
  SIGHT_VIEWERS,
  TRUE_SIGHT_VIEWER,
  bandWordPosition,
  beliefConfidence,
  characterAsSeenBy,
  knownCharacterOf,
  observerTrustWeight,
} from '../../../src/domain/npc/knownCharacter.js';
import { AXIS_LEVELS, SPECTRUM_HALF_SPAN, effectiveCharacter } from '../../../src/domain/npc/characterDrift.js';
import { npcCredibilityWeightOf } from '../../../src/domain/worldPulse/npcCredibility.js';
import { npcTraitPlane, targetedFootholds } from '../../../src/domain/worldPulse/clergyTraitPlane.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const KEY = 'save.town:npc_1';

/** A reeve authored as a paragon of JUSTICE. */
const REEVE = { id: 'npc_1', name: 'Alda', character: { axes: { JUSTICE: { pole: 'virtue', level: 'defining' } } } };
/** And his true chart, four bands the other way — a virtue curdled into its vice. */
const CURDLED = { JUSTICE: { offset: -4, updatedTick: 5 } };

const observerAt = (pole, level) => ({ character: { axes: { TRUST: { pole, level } } } });
const TRUSTING = observerAt('virtue', 'defining');
const SUSPICIOUS = observerAt('vice', 'defining');

const crossing = (axisId, to, tick = 7, eventId = 'e1') =>
  ({ kind: 'band_crossing', axisId, crossing: { to }, tick, sourceEventIds: [eventId] });

const base = { npc: REEVE, worldState: {}, subjectNpcKey: KEY, tick: 9 };

describe('THE BAND WORD READER — total, and it makes no claim it cannot parse', () => {
  test('every rung of the ladder round-trips to its signed position', () => {
    for (const [rung, level] of AXIS_LEVELS.entries()) {
      expect(bandWordPosition(`virtue_${level}`)).toBe(rung + 1);
      expect(bandWordPosition(`vice_${level}`)).toBe(-(rung + 1));
    }
    expect(bandWordPosition('neutral')).toBe(0);
  });

  test('an unparseable disclosure bands at the midpoint rather than guessing', () => {
    for (const junk of ['', 'garbage', 'virtue_enormous', 'sideways_marked', null, 7, {}]) {
      expect(bandWordPosition(junk), String(junk)).toBe(0);
    }
  });
});

describe('THE BELIEF WEIGHT — derived from two ladders that already exist', () => {
  test('the observer\'s TRUST maps across the spectrum\'s OWN span onto 0..1', () => {
    expect(observerTrustWeight(TRUSTING, null)).toBe(1);
    expect(observerTrustWeight(SUSPICIOUS, null)).toBe(0);
    // ⚠ ABSENT OBSERVER ⇒ NEUTRAL, NOT CREDULOUS. "The town in general" is a real
    // answer, and it is the honest prior rather than a maximally believing one.
    expect(observerTrustWeight(null, null)).toBe(0.5);
    expect(observerTrustWeight({ character: { axes: {} } }, null)).toBe(0.5);
    expect(observerTrustWeight(observerAt('virtue', AXIS_LEVELS[0]), null))
      .toBe((1 + SPECTRUM_HALF_SPAN) / (2 * SPECTRUM_HALF_SPAN));
  });

  test('the subject\'s half is the estate\'s own credibility weight, which is 1.0 for a stranger', () => {
    // Asserted against the real reader, so this cannot drift from the ledger's
    // own neutral. A dark ledger and an unknown person both weigh exactly one.
    expect(npcCredibilityWeightOf({}, KEY, 9)).toBe(1);
    expect(beliefConfidence({ worldState: {}, subjectNpcKey: KEY, observer: null, tick: 9 })).toBe(0.5);
    expect(beliefConfidence({ worldState: {}, subjectNpcKey: KEY, observer: TRUSTING, tick: 9 })).toBe(1);
    expect(beliefConfidence({ worldState: {}, subjectNpcKey: KEY, observer: SUSPICIOUS, tick: 9 })).toBe(0);
  });

  test('the drifted observer reads through the SAME chokepoint as everybody else', () => {
    // A suspicious observer who has drifted back toward trust believes more. The
    // observer's own drift is not a special case; it is the one read.
    const healed = observerTrustWeight(SUSPICIOUS, { TRUST: { offset: 6, updatedTick: 2 } });
    expect(healed).toBe(1);
  });
});

describe('⭐⭐ UNRECEIPTED DRIFT STAYS PRIVATE — the feature, not a gap', () => {
  test('a soul who has truly curdled, with nothing on record, reads as AUTHORED', () => {
    // The TRUE chart is asserted to have moved FIRST, so the equality below cannot
    // pass on a fixture where nothing ever happened.
    expect(effectiveCharacter(REEVE, CURDLED).axes.JUSTICE).toEqual({ pole: 'vice', level: 'a_touch' });
    const known = knownCharacterOf({ ...base }).character;
    expect(known.axes.JUSTICE).toEqual({ pole: 'virtue', level: 'defining' });
    expect(knownCharacterOf({ ...base }).disclosedAxes).toEqual([]);
  });

  test('a disclosed crossing walks the town\'s opinion toward the record, by the confidence', () => {
    const disclosures = [crossing('JUSTICE', 'vice_a_touch')];
    // ⭐ ONE RUMOUR DOES NOT CHANGE A MAN'S REPUTATION. At neutral trust and
    // ordinary credibility the confidence is one half, so a four-band journey is
    // believed as two — he is thought to be slipping, not fallen.
    expect(knownCharacterOf({ ...base, disclosures }).character.axes.JUSTICE)
      .toEqual({ pole: 'virtue', level: 'a_touch' });
    // A trusting observer believes the record whole.
    expect(knownCharacterOf({ ...base, disclosures, observer: TRUSTING }).character.axes.JUSTICE)
      .toEqual({ pole: 'vice', level: 'a_touch' });
    // A suspicious one believes none of it and holds the public persona.
    expect(knownCharacterOf({ ...base, disclosures, observer: SUSPICIOUS }).character.axes.JUSTICE)
      .toEqual({ pole: 'virtue', level: 'defining' });
  });

  test('an axis the record never spoke of is untouched even when a sibling axis was disclosed', () => {
    const twoAxis = { ...REEVE, character: { axes: { JUSTICE: { pole: 'virtue', level: 'defining' }, MERCY: { pole: 'virtue', level: 'marked' } } } };
    const out = knownCharacterOf({ ...base, npc: twoAxis, disclosures: [crossing('JUSTICE', 'vice_a_touch')], observer: TRUSTING });
    expect(out.character.axes.MERCY).toEqual({ pole: 'virtue', level: 'marked' });
    expect(out.disclosedAxes).toEqual(['JUSTICE']);
  });

  test('ONE AXIS TAKES ITS LATEST DISCLOSURE, never a sum of them', () => {
    const disclosures = [
      crossing('JUSTICE', 'vice_defining', 9, 'e2'),
      crossing('JUSTICE', 'virtue_a_touch', 12, 'e1'),
    ];
    // Two crossings on one axis are two reports of one journey. The later is what
    // the town holds; summing them would invent a position nobody ever reported.
    const out = knownCharacterOf({ ...base, disclosures, observer: TRUSTING });
    expect(out.character.axes.JUSTICE).toEqual({ pole: 'virtue', level: 'a_touch' });
    // And the reading is a property of the SET, not of arrival order.
    const reversed = knownCharacterOf({ ...base, disclosures: [...disclosures].reverse(), observer: TRUSTING });
    expect(reversed.character).toEqual(out.character);
  });

  test('a DISPLACEMENT marks an axis spoken-of and moves no position — it names no band', () => {
    const out = knownCharacterOf({
      ...base, observer: TRUSTING,
      disclosures: [{ kind: 'displacement', axisId: 'JUSTICE', overtook: 'MERCY', rank: 0, tick: 7, sourceEventIds: ['e1'] }],
    });
    expect(out.disclosedAxes).toEqual(['JUSTICE']);
    expect(out.character.axes.JUSTICE).toEqual({ pole: 'virtue', level: 'defining' });
  });

  test('a disclosure outside the closed kind vocabulary is ignored entirely', () => {
    const out = knownCharacterOf({
      ...base, observer: TRUSTING,
      disclosures: [{ kind: 'gossip', axisId: 'JUSTICE', crossing: { to: 'vice_defining' }, tick: 7 }],
    });
    expect(out.disclosedAxes).toEqual([]);
    expect(out.character.axes.JUSTICE).toEqual({ pole: 'virtue', level: 'defining' });
    expect(DISCLOSURE_KINDS.length).toBe(3);
  });

  test('the revealed STATES ride beside the chart as flags, legible rather than numeric', () => {
    const out = knownCharacterOf({ ...base, flags: { revealedCorruption: true } });
    expect(out.flags).toEqual({ lieStigma: false, revealedCorruption: true });
    expect([...KNOWN_STATE_FLAGS].sort()).toEqual(['lieStigma', 'revealedCorruption']);
    // Absent flags read false, never undefined: a court asking "has he been exposed"
    // must get an answer, not a hole.
    expect(knownCharacterOf({ ...base }).flags).toEqual({ lieStigma: false, revealedCorruption: false });
  });
});

describe('⭐⭐ THE SIGHT RULING — gods know souls, men know reputations', () => {
  test('a deity reads the TRUE chart, through L2\'s chokepoint and not a copy of it', () => {
    expect(characterAsSeenBy({ viewer: 'deity', ...base, drift: CURDLED }))
      .toEqual(effectiveCharacter(REEVE, CURDLED));
    expect(TRUE_SIGHT_VIEWER).toBe('deity');
    expect([...SIGHT_VIEWERS]).toEqual(['deity', 'mortal']);
  });

  test('and BY REFERENCE when the soul has not drifted — the byte-identity claim', () => {
    // Not a copy, not a rebuild: the very object. That is what makes an undrifted
    // world unable to differ from a pre-drift one.
    expect(characterAsSeenBy({ viewer: 'deity', ...base })).toBe(REEVE.character);
  });

  test('a mortal reads the KNOWN chart, and the two genuinely differ', () => {
    const seen = characterAsSeenBy({ viewer: 'mortal', ...base, drift: CURDLED });
    expect(seen.axes.JUSTICE).toEqual({ pole: 'virtue', level: 'defining' });
    expect(seen).not.toEqual(effectiveCharacter(REEVE, CURDLED));
  });

  test('⭐ AN UNRECOGNISED VIEWER READS AS A MORTAL — sight fails toward less of it', () => {
    for (const viewer of ['archfey', '', null, undefined, 'DEITY']) {
      expect(characterAsSeenBy({ viewer, ...base, drift: CURDLED }).axes.JUSTICE, String(viewer))
        .toEqual({ pole: 'virtue', level: 'defining' });
    }
  });

  test('⭐ targetedFootholds KEEPS TRUE SIGHT — re-pointed by car L5, and still true', () => {
    const source = readFileSync(join(REPO_ROOT, 'src/domain/worldPulse/clergyTraitPlane.js'), 'utf8');
    // Asserted LIVE first: the file is pinned to hold the function before anything
    // is excluded from it.
    expect(source).toContain('export function targetedFootholds');
    expect(source).toContain('npcTraitPlane');
    // ⭐⭐ L4 WROTE THIS AS A SUBSTRING BAN AND CAR L5 WALKED STRAIGHT PAST IT.
    // The ban named three spellings — `effectiveCharacter`, `knownCharacter`,
    // `characterDrift` — and the re-route arrived through a FOURTH module,
    // `characterConsumers`, so the guard that existed to make somebody MEAN the
    // re-point stayed green while the re-point happened. That is the same lesson
    // L4 itself minted one car earlier when a substring ban on `simulationRules`
    // had to become a dereference ban: a ban over a hand-listed vocabulary guards
    // the list, never the property.
    //
    // So the guard is REWRITTEN AS THE PROPERTY IT MEANT. The claim was never "this
    // file imports nothing" — it was "a DEITY reads the TRUE chart". That is now
    // checkable directly and positively: the file may reach the chart, and it must
    // reach it through the seam that returns `effectiveCharacter`'s own output,
    // never through the reputation read.
    expect(source).toContain('effectiveDescriptors');
    // anchored: the file is pinned above to hold targetedFootholds, so it is live
    expect(source).not.toContain('knownCharacterOf');
    // anchored: the file is pinned above to hold targetedFootholds, so it is live
    expect(source).not.toContain('characterAsSeenBy');
    // AND THE PROPERTY, EXECUTED rather than grepped: the same minister read with a
    // lens whose drift resolver is live moves — so the deity's sight follows the
    // TRUE chart, which is what "gods know souls" has to mean arithmetically.
    const minister = {
      id: 'npc_1', name: 'Alda', importance: 'pillar', linkedFactionIds: ['temple'],
      personality: { dominant: 'patient' },
      character: { axes: { MERCY: { pole: 'virtue', level: 'defining' } } },
    };
    const plane = (/** @type {any} */ lens) => npcTraitPlane(/** @type {any} */ (minister), lens);
    const project = () => ({ word: 'cruel', displaces: ['compassionate', 'merciful'] });
    expect(plane(null).e).toBeLessThanOrEqual(0);
    expect(plane({ project, driftOf: () => ({ MERCY: { offset: -6, updatedTick: 1 } }) }).e).toBeGreaterThan(0);
  });

  test('and it still runs, untouched, returning its own shape', () => {
    // Executed rather than only grepped: a walker over a file nobody calls proves
    // the file was not edited, not that the consumer still works.
    const settlement = {
      id: 'save.town',
      npcs: [{ id: 'npc_1', name: 'Alda', personality: { dominant: 'devout', flaw: 'cruel' }, importance: 'major' }],
      powerStructure: { factions: [] },
    };
    const out = targetedFootholds(settlement, null, []);
    expect(Array.isArray(out)).toBe(true);
  });
});

describe('NO STORE IS MINTED — GAP D, and the read is a function of its arguments', () => {
  test('the world is byte-identical after any number of readings', () => {
    const worldState = { tick: 9, spatialLedgers: { npcCredibility: { [KEY]: { score: -6, lastUpdateTick: 4 } } } };
    const snapshot = JSON.stringify(worldState);
    for (let i = 0; i < 5; i += 1) {
      knownCharacterOf({ ...base, worldState, disclosures: [crossing('JUSTICE', 'vice_marked')] });
      characterAsSeenBy({ viewer: 'mortal', ...base, worldState, drift: CURDLED });
    }
    expect(JSON.stringify(worldState)).toBe(snapshot);
  });

  test('a real credibility record moves the confidence, so the ledger read is LIVE', () => {
    const damaged = { tick: 9, spatialLedgers: { npcCredibility: { [KEY]: { score: -12, lastUpdateTick: 9 } } } };
    const weight = npcCredibilityWeightOf(damaged, KEY, 9);
    expect(weight).toBeLessThan(1);
    // A discredited subject's record is believed LESS, by exactly that weight.
    expect(beliefConfidence({ worldState: damaged, subjectNpcKey: KEY, observer: TRUSTING, tick: 9 }))
      .toBeCloseTo(weight, 10);
  });

  test('the reading is frozen, and it is total on garbage input', () => {
    const out = knownCharacterOf({ npc: null, disclosures: null, worldState: null });
    expect(Object.isFrozen(out)).toBe(true);
    expect(out.disclosedAxes).toEqual([]);
    expect(out.character.axes).toEqual({});
  });

  test('the module is owner-unsigned and names the fork it did not take', () => {
    expect(KNOWN_CHARACTER_PROVENANCE.signedBy).toBeNull();
    const rows = KNOWN_CHARACTER_PROVENANCE.ownerRows.join(' ');
    expect(rows).toContain('DIRECTION OF SUSPICION');
    expect(KNOWN_CHARACTER_PROVENANCE.consumers).toContain('NONE');
  });
});
