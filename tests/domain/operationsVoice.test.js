/**
 * operationsVoice.test.js — the battery for W-OPS car O7 (the operations voice).
 *
 * ⭐⭐ THE DISCIPLINE. The leaf under test mirrors every typed word it speaks —
 * refusal vocabulary, covert cause, worth bands, rungs, exposure words, verdicts —
 * so the first duty of this battery is RECONCILIATION: every mirror is pinned
 * against the REAL authority module, imported here (a test may import a dark leaf;
 * a sibling may not), so a drift in any pair reds the same run that would have
 * shipped it. The second duty is the VOICE LAW: the going-native surface must be
 * proven unable to speak a reversal while the owner fork is unsigned, and the
 * exposure roster must be proven exactly as short as the set of receipts the
 * engine's writers can actually mint at this tip.
 *
 * STATICALLY REGISTERED tests, and EVERY TITLE IS A SINGLE ONE-LINE LITERAL: a
 * loop-registered suite is invisible to the lighting census, and a title built
 * with `+` is a BinaryExpression the census credits as nothing (car O4's finding).
 *
 * @enforced-by this test
 */
import { describe, expect, test } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

import {
  ARC_BEAT_KINDS,
  ARC_RUNGS_MIRROR,
  COVERT_CAUSE_MIRROR,
  DWELL_SPAN_BANDS,
  EXPOSURE_MOMENTS,
  GOING_NATIVE_VERDICT_WORDS,
  GOING_NATIVE_VOICE_LAW,
  IMMERSED_WORD_MIRROR,
  MISSION_BEAT_KINDS,
  OPERATIONS_VOICE_PROVENANCE,
  RECEIPT_ROW_MIRROR,
  STORIED_REFUSALS,
  UNSTORIED_REFUSALS,
  VOICE_AUDIENCES,
  VOICE_REFUSALS,
  WORTH_BAND_MIRROR,
  dwellSpanBandOf,
  exposureNewsBeat,
  goingNativeArcBeat,
  missionAcceptedBeat,
  missionRefusalBeat,
  readerLine,
} from '../../src/domain/worldPulse/espionage/operationsVoice.js';

import {
  ACCEPTANCE_REFUSALS,
  REFUSED_MISSION_RECEIPT_ROW,
  decideAcceptance,
  freezeRegisterAtRooting,
  refusedMissionReceipt,
} from '../../src/domain/worldPulse/operations/missionAcceptance.js';
import {
  INFILTRATION_LEVELS,
  INFILTRATION_LEVEL_NAMES,
} from '../../src/domain/worldPulse/espionage/infiltrationDepth.js';
import {
  DEPTH_EXPOSURE_BANDS,
  DEPTH_EXPOSURE_WORDS,
  UNBOUNDED_EXPOSURE_WORD,
  goingNativeVerdict,
  viceWardReachability,
} from '../../src/domain/worldPulse/espionage/infiltrationDrift.js';
import {
  LIVED_EXPERIENCE_KINDS,
  PARADIGM_AXIS_IDS,
  experienceRowOf,
} from '../../src/domain/npc/livedExperienceCatalog.js';
import { MATERIALIZATION_EPSILON } from '../../src/domain/npc/characterDrift.js';
import {
  FOREIGN_GUEST_HOLD_CAUSES,
  FOREIGN_GUEST_HOLD_CLOSE_REASONS,
  FOREIGN_GUEST_HOLD_COVERT_CAUSE,
} from '../../src/domain/worldPulse/foreignGuestHold.js';
import { RANSOM_WORTH_BANDS } from '../../src/domain/worldPulse/ransomClaim.js';
import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
// LGT-P5-WOPS: the door this leaf's flag was minted onto. The read lives in the espionage
// family's one door module because this leaf's LOGIC is pinned to carry no flag token at
// all — the door is an address here and a gate only there.
import { operationsVoiceActive } from '../../src/domain/worldPulse/espionage/espionageGate.js';
import {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const LEAF_REL = 'src/domain/worldPulse/espionage/operationsVoice.js';
const LEAF = join(ROOT, ...LEAF_REL.split('/'));
const LEAF_SOURCE = readFileSync(LEAF, 'utf8');

/** Source with block and line comments stripped, string literals intact. */
const LEAF_CODE = LEAF_SOURCE.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/**
 * Code with string literals blanked as well — where a READ would have to live.
 * ⚠ TEMPLATE LITERALS ARE BLANKED FIRST, and the order is load-bearing: this leaf's
 * composed lines carry apostrophes inside backticks, and a single-quote pass that
 * runs first reads each apostrophe as an opening quote and eats real identifiers —
 * the sibling batteries never hit this because their leaves compose no prose.
 */
const LEAF_LOGIC = LEAF_CODE.replace(/`(?:[^`\\]|\\.)*`/g, '``').replace(/'(?:[^'\\]|\\.)*'/g, "''");

/** Every .js file under src/, for the darkness census. */
function srcFiles(dir, out = []) {
  for (const name of readdirSync(dir).sort(compareCodepoint)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) srcFiles(full, out);
    else if (name.endsWith('.js') || name.endsWith('.jsx')) out.push(full);
  }
  return out;
}

/** Every (kind, pull) row of the real experience table, with its reachability. */
function catalogPullRows() {
  const rows = [];
  for (const kind of LIVED_EXPERIENCE_KINDS) {
    const row = experienceRowOf(kind);
    for (const pull of row.pulls) {
      rows.push({ kind, axisId: pull.axisId, pole: pull.pole, reachable: !row.sourceUnverified });
    }
  }
  return rows;
}

const REACH = viceWardReachability(catalogPullRows(), PARADIGM_AXIS_IDS);

/** The real verdict words, driven from the real read — never assumed. */
const REAL_VERDICTS = Object.freeze({
  no_road: goingNativeVerdict({
    axisId: 'FIDELITY', reachability: REACH, corePosition: 2, ambientBound: MATERIALIZATION_EPSILON,
  }),
  event_only: goingNativeVerdict({
    axisId: 'MERCY', reachability: REACH, corePosition: 1, ambientBound: MATERIALIZATION_EPSILON,
  }),
  reachable: goingNativeVerdict({
    axisId: 'MERCY', reachability: REACH, corePosition: 0, ambientBound: MATERIALIZATION_EPSILON,
  }),
});

const IDS = Object.freeze({
  npcId: 'npc_ilva',
  npcName: 'Ilva Rooke',
  principalId: 'court_greyharbor',
  principalName: 'the Court of Greyharbor',
  hostId: 'set_ash',
  hostName: 'Ashford',
  captorId: 'set_cold',
  captorName: 'Coldharbour',
});

const OPEN_REGISTER = Object.freeze({ center: 0.5, breadth: 0.2 });

/** A real accepted decision through the real acceptance seam. */
function acceptedDecision() {
  return decideAcceptance({
    operationId: 'op_one', register: OPEN_REGISTER, risk01: 0.55,
  });
}

/** A real signed refusal receipt for one refusal shape. */
function signedReceipt(overrides) {
  const decision = decideAcceptance({
    operationId: 'op_one', register: OPEN_REGISTER, risk01: 0.55, ...overrides,
  });
  return refusedMissionReceipt({ signed: true, decision, principalId: IDS.principalId });
}

function refusalBeatFor(overrides) {
  return missionRefusalBeat({
    receipt: signedReceipt(overrides),
    principalName: IDS.principalName,
    npcId: IDS.npcId,
    npcName: IDS.npcName,
  });
}

function takenBeat(extra = {}) {
  return exposureNewsBeat({
    moment: 'taken',
    cause: FOREIGN_GUEST_HOLD_COVERT_CAUSE,
    npcId: IDS.npcId,
    npcName: IDS.npcName,
    hostId: IDS.hostId,
    hostName: IDS.hostName,
    ...extra,
  });
}

function custodyBeat(moment, extra = {}) {
  return exposureNewsBeat({
    moment,
    cause: FOREIGN_GUEST_HOLD_COVERT_CAUSE,
    npcId: IDS.npcId,
    npcName: IDS.npcName,
    captorId: IDS.captorId,
    captorName: IDS.captorName,
    ...extra,
  });
}

function arcBeat(extra = {}) {
  return goingNativeArcBeat({
    level: 'rooted',
    verdict: REAL_VERDICTS.no_road.verdict,
    cadences: 5,
    npcId: IDS.npcId,
    npcName: IDS.npcName,
    hostId: IDS.hostId,
    hostName: IDS.hostName,
    ...extra,
  });
}

describe('every mirrored word reconciles against its authority', () => {
  test('the storied and unstoried refusals union to the acceptance seam seven, exactly', () => {
    const union = [...STORIED_REFUSALS, ...UNSTORIED_REFUSALS].sort(compareCodepoint);
    expect(union).toEqual([...ACCEPTANCE_REFUSALS].sort(compareCodepoint));
    expect(union).toHaveLength(7);
    for (const word of STORIED_REFUSALS) {
      expectAbsentWithAnchor(
        UNSTORIED_REFUSALS, word, 'invalid_register',
        'a refusal word is storied or machine, never both',
      );
    }
  });

  test('the receipt row mirror is the acceptance seam own row string, byte for byte', () => {
    expect(RECEIPT_ROW_MIRROR).toBe(REFUSED_MISSION_RECEIPT_ROW);
  });

  test('the covert cause mirror is the hold ledger fifth cause, and the only covert one', () => {
    expect(COVERT_CAUSE_MIRROR).toBe(FOREIGN_GUEST_HOLD_COVERT_CAUSE);
    expect(FOREIGN_GUEST_HOLD_CAUSES[4]).toBe(COVERT_CAUSE_MIRROR);
    expect(FOREIGN_GUEST_HOLD_CAUSES).toHaveLength(5);
  });

  test('the arc rung mirror reconciles against the real infiltration ladder, row for row', () => {
    expect(ARC_RUNGS_MIRROR.map((row) => row.name)).toEqual([...INFILTRATION_LEVEL_NAMES]);
    expect(ARC_RUNGS_MIRROR.map((row) => row.level)).toEqual(INFILTRATION_LEVELS.map((row) => row.level));
    expect(ARC_RUNGS_MIRROR).toHaveLength(INFILTRATION_LEVELS.length);
  });

  test('the arc exposure words reconcile against the depth bands, zip for zip', () => {
    expect(ARC_RUNGS_MIRROR.map((row) => row.exposure)).toEqual([...DEPTH_EXPOSURE_WORDS]);
    for (const [index, row] of ARC_RUNGS_MIRROR.entries()) {
      expect(row.name).toBe(DEPTH_EXPOSURE_BANDS[index].name);
      expect(row.exposure).toBe(DEPTH_EXPOSURE_BANDS[index].exposure);
    }
  });

  test('the immersed mirror is the one word the aggregate bound deliberately excludes', () => {
    expect(IMMERSED_WORD_MIRROR).toBe(UNBOUNDED_EXPOSURE_WORD);
  });

  test('the worth band mirror is the ransom claim vocabulary, in its own order', () => {
    expect([...WORTH_BAND_MIRROR]).toEqual([...RANSOM_WORTH_BANDS]);
  });

  test('all three verdict words are reachable from the real read, and the law partitions them', () => {
    expect(REAL_VERDICTS.no_road.verdict).toBe('no_road');
    expect(REAL_VERDICTS.event_only.verdict).toBe('event_only');
    expect(REAL_VERDICTS.reachable.verdict).toBe('reachable');
    const partition = [...GOING_NATIVE_VOICE_LAW.spoken, ...GOING_NATIVE_VOICE_LAW.unspoken]
      .sort(compareCodepoint);
    expect(partition).toEqual([...GOING_NATIVE_VERDICT_WORDS].sort(compareCodepoint));
    for (const word of GOING_NATIVE_VOICE_LAW.spoken) {
      expectAbsentWithAnchor(
        GOING_NATIVE_VOICE_LAW.unspoken, word, 'reachable',
        'a verdict word is spoken or unspoken, never both',
      );
    }
  });
});

describe('mission beats: the acceptance walk voiced', () => {
  test('a real accepted decision composes the accepted beat with both names in the line', () => {
    const beat = missionAcceptedBeat({
      decision: acceptedDecision(),
      principalId: IDS.principalId,
      principalName: IDS.principalName,
      npcId: IDS.npcId,
      npcName: IDS.npcName,
    });
    expect(beat.spoken).toBe(true);
    expect(beat.kind).toBe('mission_accepted');
    expect(beat.line).toContain(IDS.npcName);
    expect(beat.line).toContain(IDS.principalName);
    expect(MISSION_BEAT_KINDS).toContain(beat.kind);
  });

  test('a rooted acceptance carries the rooting sentence beside the ordinary reason', () => {
    const rooted = freezeRegisterAtRooting(OPEN_REGISTER, 10);
    const beat = missionAcceptedBeat({
      decision: decideAcceptance({ operationId: 'op_one', rootedRegister: rooted, risk01: 0.55 }),
      principalId: IDS.principalId,
      principalName: IDS.principalName,
      npcId: IDS.npcId,
      npcName: IDS.npcName,
    });
    expect(beat.registerSource).toBe('rooted');
    expect(beat.reasons).toHaveLength(2);
    expect(beat.reasons[1]).toContain('stayed');
  });

  test('a live acceptance carries one reason and names the live register source', () => {
    const beat = missionAcceptedBeat({
      decision: acceptedDecision(),
      principalId: IDS.principalId,
      principalName: IDS.principalName,
      npcId: IDS.npcId,
      npcName: IDS.npcName,
    });
    expect(beat.registerSource).toBe('live');
    expect(beat.reasons).toHaveLength(1);
  });

  test('a refused decision offered to the accepted composer refuses as not an acceptance', () => {
    const beat = missionAcceptedBeat({
      decision: decideAcceptance({ operationId: 'op_one', register: OPEN_REGISTER, risk01: 0.9 }),
      principalId: IDS.principalId,
      principalName: IDS.principalName,
      npcId: IDS.npcId,
      npcName: IDS.npcName,
    });
    expect(beat.spoken).toBe(false);
    expect(beat.refusal).toBe('not_an_acceptance');
  });

  test('a vetting refusal is voiced as the seat setting the person aside, not their no', () => {
    const beat = refusalBeatFor({ vetting: { accepted: false } });
    expect(beat.spoken).toBe(true);
    expect(beat.kind).toBe('mission_refused');
    expect(beat.refusal).toBe('vetting');
    expect(beat.byThePerson).toBe(false);
    expect(beat.line).toContain('aside');
  });

  test('an unwilling refusal is voiced as the person own no, and the receipt says so', () => {
    const beat = refusalBeatFor({ willing: false });
    expect(beat.refusal).toBe('unwilling');
    expect(beat.byThePerson).toBe(true);
    expect(beat.line).toContain('will not take it');
  });

  test('the two window edges are voiced as opposite statements of character', () => {
    const above = refusalBeatFor({ risk01: 0.9 });
    const below = refusalBeatFor({ risk01: 0.1 });
    expect(above.refusal).toBe('risk_above_window');
    expect(below.refusal).toBe('risk_below_window');
    expect(above.spoken).toBe(true);
    expect(below.spoken).toBe(true);
    expect(above.line).toContain('death warrant');
    expect(below.line).toContain('beneath them');
    expect(above.reasons[0]).toContain('more than they will carry');
    expect(below.reasons[0]).toContain('asked too little');
  });

  test('the three machine refusals are receipted but never voiced', () => {
    const machine = [
      refusedMissionReceipt({ signed: true, decision: decideAcceptance({}), principalId: IDS.principalId }),
      refusedMissionReceipt({ signed: true, decision: decideAcceptance({ operationId: 'op_one' }), principalId: IDS.principalId }),
      refusedMissionReceipt({ signed: true, decision: decideAcceptance({ operationId: 'op_one', register: OPEN_REGISTER }), principalId: IDS.principalId }),
    ];
    expect(machine.map((receipt) => receipt.refusal))
      .toEqual(['invalid_operation', 'invalid_register', 'unpriced_operation']);
    for (const receipt of machine) {
      const beat = missionRefusalBeat({
        receipt, principalName: IDS.principalName, npcId: IDS.npcId, npcName: IDS.npcName,
      });
      expect(beat.spoken).toBe(false);
      expect(beat.refusal).toBe('unstoried_refusal');
    }
  });

  test('while row seven is unsigned there is no receipt, and with no receipt no beat', () => {
    const dark = refusedMissionReceipt({
      decision: decideAcceptance({ operationId: 'op_one', register: OPEN_REGISTER, risk01: 0.9 }),
      principalId: IDS.principalId,
    });
    expect(dark).toBeNull();
    const beat = missionRefusalBeat({
      receipt: dark, principalName: IDS.principalName, npcId: IDS.npcId, npcName: IDS.npcName,
    });
    expect(beat.spoken).toBe(false);
    expect(beat.refusal).toBe('unreceipted_beat');
  });
});

describe('the refusal beat trusts only the row-seven shape', () => {
  test('a receipt naming any other register row is refused as unreceipted', () => {
    const receipt = { ...signedReceipt({ willing: false }), row: 'W-REGISTERS-PACK#REGISTER-VI.6' };
    const beat = missionRefusalBeat({
      receipt, principalName: IDS.principalName, npcId: IDS.npcId, npcName: IDS.npcName,
    });
    expect(beat.refusal).toBe('unreceipted_beat');
  });

  test('a receipt carrying a refusal word outside the seven is refused as unreceipted', () => {
    const receipt = { ...signedReceipt({ willing: false }), refusal: 'sulking' };
    const beat = missionRefusalBeat({
      receipt, principalName: IDS.principalName, npcId: IDS.npcId, npcName: IDS.npcName,
    });
    expect(beat.refusal).toBe('unreceipted_beat');
  });

  test('a principal name that fails to resolve refuses the beat as a missing name', () => {
    const beat = missionRefusalBeat({
      receipt: signedReceipt({ willing: false }),
      principalName: IDS.principalId,
      npcId: IDS.npcId,
      npcName: IDS.npcName,
    });
    expect(beat.refusal).toBe('missing_name');
  });

  test('who refused is the receipt own field, passed through and never re-derived here', () => {
    const lying = { ...signedReceipt({ vetting: { accepted: false } }), byThePerson: true };
    const beat = missionRefusalBeat({
      receipt: lying, principalName: IDS.principalName, npcId: IDS.npcId, npcName: IDS.npcName,
    });
    expect(beat.spoken).toBe(true);
    expect(beat.byThePerson).toBe(true);
  });
});

describe('exposure news: four moments, one cause', () => {
  test('the catch is spoken to the town, naming the person and the place that took them', () => {
    const beat = takenBeat();
    expect(beat.spoken).toBe(true);
    expect(beat.kind).toBe('operative_unmasked');
    expect(beat.audience).toBe('common_word');
    expect(beat.line).toContain(IDS.npcName);
    expect(beat.line).toContain(IDS.hostName);
    expect(beat.npcIds).toEqual([IDS.npcId]);
    expect(beat.settlementIds).toEqual([IDS.hostId]);
  });

  test('a catch whose host name never resolved is silence, not a slug in a sentence', () => {
    const beat = takenBeat({ hostName: IDS.hostId });
    expect(beat.spoken).toBe(false);
    expect(beat.refusal).toBe('missing_name');
  });

  test('the three worth bands buy three different price sentences, each naming the captor', () => {
    const lines = WORTH_BAND_MIRROR.map((band) => custodyBeat('price_named', { worthBand: band }).line);
    expect(new Set(lines).size).toBe(3);
    for (const line of lines) {
      expect(line).toContain(IDS.captorName);
      expect(line).toContain(IDS.npcName);
    }
  });

  test('a worth band outside the claim vocabulary refuses rather than pricing by guess', () => {
    const beat = custodyBeat('price_named', { worthBand: 'legendary' });
    expect(beat.spoken).toBe(false);
    expect(beat.refusal).toBe('unknown_worth');
  });

  test('a pardon is spoken as the captor own word opening the road home', () => {
    const beat = custodyBeat('pardoned');
    expect(beat.spoken).toBe(true);
    expect(beat.kind).toBe('operative_pardoned');
    expect(beat.line).toContain('opens the road home');
  });

  test('a death in keeping closes the story and what was never sent home with it', () => {
    const beat = custodyBeat('died_in_custody');
    expect(beat.spoken).toBe(true);
    expect(beat.kind).toBe('operative_died_in_custody');
    expect(beat.reasons[0]).toContain('never arrive');
  });

  test('every non-covert cause in the real hold vocabulary is another desk story', () => {
    const others = FOREIGN_GUEST_HOLD_CAUSES.filter((cause) => cause !== FOREIGN_GUEST_HOLD_COVERT_CAUSE);
    expect(others).toHaveLength(4);
    for (const cause of others) {
      const beat = takenBeat({ cause });
      expect(beat.spoken).toBe(false);
      expect(beat.refusal).toBe('not_covert_cause');
    }
  });

  test('a moment outside the closed roster is refused, never rounded to the nearest story', () => {
    const beat = custodyBeat('escaped');
    expect(beat.spoken).toBe(false);
    expect(beat.refusal).toBe('not_the_moment');
  });

  test('no parked custody exit has a moment word, and the roster says so by absence', () => {
    for (const parked of ['escape', 'release', 'extraction', 'burn', 'root_permanently']) {
      expectAbsentWithAnchor(
        EXPOSURE_MOMENTS, parked, 'pardoned',
        'a sentence for a receipt no writer can mint narrates a world that does not exist',
      );
    }
  });

  test('the two close reasons with real writers are exactly the two closure moments', () => {
    expect([...FOREIGN_GUEST_HOLD_CLOSE_REASONS]).toEqual(['release', 'escape', 'death', 'pardon']);
    expect(EXPOSURE_MOMENTS).toContain('pardoned');
    expect(EXPOSURE_MOMENTS).toContain('died_in_custody');
    expect(EXPOSURE_MOMENTS).toHaveLength(4);
  });
});

describe('the going-native arc speaks strain and never a turning', () => {
  test('the real no-road verdict composes the manners beat with both names and the span', () => {
    const beat = arcBeat();
    expect(beat.spoken).toBe(true);
    expect(beat.kind).toBe('manners_worn');
    expect(beat.line).toContain(IDS.npcName);
    expect(beat.line).toContain(IDS.hostName);
    expect(beat.verdict).toBe('no_road');
    expect(ARC_BEAT_KINDS).toContain(beat.kind);
  });

  test('the event-only verdict is spoken with its own reasons, not the no-road ones', () => {
    const noRoad = arcBeat();
    const eventOnly = arcBeat({ verdict: REAL_VERDICTS.event_only.verdict });
    expect(eventOnly.spoken).toBe(true);
    expect(eventOnly.reasons).not.toEqual(noRoad.reasons);
    expect(eventOnly.reasons[1]).toContain('something that happens to them');
  });

  test('the reachable verdict is refused as an unruled reversal, which is the voice law', () => {
    const beat = arcBeat({ verdict: REAL_VERDICTS.reachable.verdict });
    expect(beat.spoken).toBe(false);
    expect(beat.refusal).toBe('unruled_reversal');
  });

  test('the voice law is unsigned and the reversal prose does not exist to be lit', () => {
    expect(GOING_NATIVE_VOICE_LAW.signedBy).toBeNull();
    expect(GOING_NATIVE_VOICE_LAW.unspoken).toEqual(['reachable']);
    expectAbsentWithAnchor(
      ARC_BEAT_KINDS, 'goes_native', 'manners_worn',
      'no beat kind exists for a turning while the fork is unsigned',
    );
  });

  test('every bounded rung wears the manners and the seat alone lives the host life', () => {
    for (const rung of ARC_RUNGS_MIRROR) {
      const beat = arcBeat({ level: rung.name });
      expect(beat.spoken).toBe(true);
      expect(beat.kind).toBe(rung.exposure === IMMERSED_WORD_MIRROR ? 'lives_the_host_life' : 'manners_worn');
    }
  });

  test('a rung resolves by name or by level number, and an unknown depth refuses', () => {
    expect(arcBeat({ level: 3 }).rung).toBe('placed');
    expect(arcBeat({ level: 'nowhere' }).refusal).toBe('unknown_rung');
    expect(arcBeat({ level: 9 }).refusal).toBe('unknown_rung');
  });

  test('an arc line before one whole ambient period is short of dwell, never guessed', () => {
    expect(arcBeat({ cadences: 0 }).refusal).toBe('short_of_dwell');
    expect(arcBeat({ cadences: null }).refusal).toBe('short_of_dwell');
  });

  test('the dwell span words band the stay and surface in the sentence itself', () => {
    expect(dwellSpanBandOf(1).word).toBe('newly lodged');
    expect(dwellSpanBandOf(5).word).toBe('seasons deep');
    expect(dwellSpanBandOf(30).word).toBe('years grown');
    expect(DWELL_SPAN_BANDS).toHaveLength(3);
    expect(arcBeat({ cadences: 30 }).line).toContain('years grown');
  });

  test('a verdict word outside the closed three refuses as unknown rather than nearest', () => {
    const beat = arcBeat({ verdict: 'turning' });
    expect(beat.spoken).toBe(false);
    expect(beat.refusal).toBe('unknown_verdict');
  });
});

describe('every spoken sentence survives the reader guard', () => {
  test('every reachable line and reason in the battery fixtures is scalar-free reader prose', () => {
    const beats = [
      missionAcceptedBeat({
        decision: acceptedDecision(),
        principalId: IDS.principalId,
        principalName: IDS.principalName,
        npcId: IDS.npcId,
        npcName: IDS.npcName,
      }),
      refusalBeatFor({ vetting: { accepted: false } }),
      refusalBeatFor({ willing: false }),
      refusalBeatFor({ risk01: 0.9 }),
      refusalBeatFor({ risk01: 0.1 }),
      takenBeat(),
      custodyBeat('price_named', { worthBand: 'common' }),
      custodyBeat('price_named', { worthBand: 'notable' }),
      custodyBeat('price_named', { worthBand: 'principal' }),
      custodyBeat('pardoned'),
      custodyBeat('died_in_custody'),
      arcBeat(),
      arcBeat({ verdict: REAL_VERDICTS.event_only.verdict }),
      arcBeat({ level: 'seated' }),
    ];
    const sentences = [];
    for (const beat of beats) {
      expect(beat.spoken).toBe(true);
      sentences.push(beat.line, ...beat.reasons);
    }
    expect(new Set(sentences).size).toBeGreaterThanOrEqual(14);
    for (const sentence of sentences) {
      expect(readerLine(sentence)).toBe(sentence);
    }
  });

  test('the guard refuses digits, machine words and scalar punctuation outright', () => {
    expect(readerLine('a price of 40 crowns')).toBe('');
    expect(readerLine('the roll went against them')).toBe('');
    expect(readerLine('a multiplier of standing')).toBe('');
    expect(readerLine('held {here}')).toBe('');
    expect(readerLine('')).toBe('');
    expect(readerLine('the road home stays open')).toBe('the road home stays open');
  });

  test('a name that smuggles a scalar refuses the whole beat at composition', () => {
    const beat = takenBeat({ npcName: 'Agent 47' });
    expect(beat.spoken).toBe(false);
    expect(beat.refusal).toBe('unspeakable_line');
  });

  test('a name that merely echoes its id refuses as missing before anything is composed', () => {
    const beat = takenBeat({ npcName: IDS.npcId });
    expect(beat.spoken).toBe(false);
    expect(beat.refusal).toBe('missing_name');
  });
});

describe('the leaf is dark, injected, and pure', () => {
  test('no module under src names this leaf, and the census is executed over the tree', () => {
    // ⏱ RE-CUT 2026-09-05 BY LGT-P5-WOPS, ON THE VOLUME'S OWN RULING. The arm's CLAIM is
    // that no module under src/ CALLS this leaf; its first spelling measured MENTIONS of
    // the string `operationsVoice`, which the CR-WR10-C mint necessarily adds in three
    // bookkeeping places — the manifest member, the certification row's module path, and
    // the family door. The sibling car in this same volume already ruled the instrument
    // verbatim: "An IMPORT SPECIFIER census, not a mention census … a header is not a
    // caller." So the caller claim is now an import-specifier census, which is STRICTLY
    // STRONGER for the property named (a mention scan is satisfied by a renamed import),
    // and the mention census SURVIVES beside it as an EXACT roster rather than an empty
    // one — so a fourth namer still reds, and a mint surface that vanishes reds too.
    const callers = srcFiles(join(ROOT, 'src'))
      .filter((file) => relative(ROOT, file).split('\\').join('/') !== LEAF_REL)
      .filter((file) => /from\s+'[^']*operationsVoice\.js'/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(ROOT, file).split('\\').join('/'));
    expect(callers).toEqual([]);
    const namers = srcFiles(join(ROOT, 'src'))
      .filter((file) => relative(ROOT, file).split('\\').join('/') !== LEAF_REL)
      .filter((file) => /operationsVoice/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(ROOT, file).split('\\').join('/'))
      .sort();
    expect(namers).toEqual([
      'src/domain/certification/subsystemRowsOps.js',
      'src/domain/worldPulse/espionage/espionageGate.js',
      'src/domain/worldPulse/simulationRules.js',
    ]);
  });

  test('the leaf imports nothing at all, so no sibling darkness arm can be reddened by it', () => {
    const imports = [...LEAF_SOURCE.matchAll(/^import\s[^;]*?from\s+'([^']+)'/gm)].map((match) => match[1]);
    expect(imports).toEqual([]);
  });

  test('the leaf opens no transcendental site and no exponent operator', () => {
    for (const banned of ['Math.pow', 'Math.exp', 'Math.log', 'Math.sin', 'Math.cos', 'Math.atan']) {
      expectAbsentWithAnchor(
        LEAF_LOGIC, banned, 'readerLine',
        'the transcendental ratchet refuses new engine-dependent last bits in src/domain',
      );
    }
    expectAbsentWithAnchor(
      LEAF_LOGIC, '**', 'Object.freeze',
      'the exponent operator is a transcendental site under the same ratchet',
    );
  });

  test('the leaf reaches no world state, no clock, no randomness and no store', () => {
    for (const banned of ['worldState', 'Math.random', 'Date.', 'simulationRules', 'localStorage']) {
      expectAbsentWithAnchor(
        LEAF_LOGIC, banned, 'readerName',
        'every quantity this leaf needs arrives as an argument, never as a reach',
      );
    }
  });

  test('the door is named in a string and never read in code', () => {
    expect(LEAF_CODE).toMatch(/operationsVoiceEnabled/);
    expectAbsentWithAnchor(
      LEAF_LOGIC, 'Enabled', 'OPERATIONS_VOICE_PROVENANCE',
      'the door is an address for the flag car, not a gate this leaf opens',
    );
    expect(OPERATIONS_VOICE_PROVENANCE.consumers).toMatch(/NONE/);
    // ⏱ THE DOOR IS MINTED NOW, AND THE ARM ABOVE IS UNCHANGED ON PURPOSE: the mint put
    // the READ in the family door module and left this leaf's logic exactly as gate-free
    // as it was, which is the contract this arm holds.
    expect(OPERATIONS_VOICE_PROVENANCE.door).toMatch(/MINTED 2026-09-05/);
  });

  test('the one magic gate cannot be grazed by a term this leaf does not carry', () => {
    const lowered = LEAF_SOURCE.toLowerCase();
    for (const banned of ['magic', 'arcane', 'sorcer', 'thaumat']) {
      expectAbsentWithAnchor(
        lowered, banned, 'exposure',
        'the one magic gate cannot be grazed by a term this leaf does not carry',
      );
    }
  });

  test('the leaf cites every substrate leaf by description, never by a scannable name', () => {
    for (const banned of ['livedExperience', 'characterDrift']) {
      expectAbsentWithAnchor(
        LEAF_SOURCE, banned, 'the acceptance seam',
        'two closure arms scan raw source, so even a comment costs a sibling its green',
      );
    }
    for (const banned of ['knownCharacter', 'effectiveCharacter', 'characterAsSeenBy', 'applyAxisDrift', 'writeAxisDrift']) {
      expectAbsentWithAnchor(
        LEAF_CODE, banned, 'GOING_NATIVE_VOICE_LAW',
        'the comment-stripping closure arms leave strings standing, so a named writer costs a green',
      );
    }
    for (const banned of ['infiltrationDrift', 'infiltrationDepth', 'envoyTaskCatalog', 'missionAcceptance']) {
      expectAbsentWithAnchor(
        LEAF_SOURCE, banned, 'depth-pricing',
        'a sibling darkness arm scans src for its own leaf name, and a citation here reds it',
      );
    }
  });

  test('the leaf authors no feed envelope: the banner field never appears in it at all', () => {
    expectAbsentWithAnchor(
      LEAF_SOURCE.toLowerCase(), 'headline', 'reasons',
      'the wizard-news envelope is the wiring car business, and this leaf stays out of its census',
    );
  });

  test('nothing here is signed, and the provenance says so out loud', () => {
    expect(OPERATIONS_VOICE_PROVENANCE.signedBy).toBeNull();
    expect(GOING_NATIVE_VOICE_LAW.signedBy).toBeNull();
    expect(OPERATIONS_VOICE_PROVENANCE.status).toMatch(/OWNER-UNSIGNED/);
    expect(OPERATIONS_VOICE_PROVENANCE.ownerRows.length).toBeGreaterThanOrEqual(5);
  });
});

describe('the fog and the desk boundaries', () => {
  test('mission beats and the long watch address the principal; exposure addresses the town', () => {
    expect(missionAcceptedBeat({
      decision: acceptedDecision(),
      principalId: IDS.principalId,
      principalName: IDS.principalName,
      npcId: IDS.npcId,
      npcName: IDS.npcName,
    }).audience).toBe('principal_private');
    expect(refusalBeatFor({ willing: false }).audience).toBe('principal_private');
    expect(arcBeat().audience).toBe('principal_private');
    expect(takenBeat().audience).toBe('common_word');
    expect(custodyBeat('pardoned').audience).toBe('common_word');
  });

  test('the audience vocabulary is exactly two words and every spoken beat uses one', () => {
    expect([...VOICE_AUDIENCES].sort(compareCodepoint)).toEqual(['common_word', 'principal_private']);
    for (const beat of [takenBeat(), arcBeat(), refusalBeatFor({ willing: false })]) {
      expect(VOICE_AUDIENCES).toContain(beat.audience);
    }
  });

  test('no word exists for a covert success, because an unseen spy is not yet a story', () => {
    for (const absent of ['delivered', 'confirmed', 'mission_resolved', 'product_landed']) {
      expectAbsentWithAnchor(
        EXPOSURE_MOMENTS, absent, 'taken',
        'the fog law: a success mints no public word, so the roster carries none',
      );
      expectAbsentWithAnchor(
        MISSION_BEAT_KINDS, absent, 'mission_accepted',
        'the mission surface voices the acceptance seam only; resolution is another car',
      );
    }
  });

  test('every refusal word in the closed vocabulary is reached by a real composition', () => {
    const reached = new Set([
      takenBeat({ npcName: IDS.npcId }).refusal,
      missionAcceptedBeat({ decision: { verdict: 'refused' } }).refusal,
      missionRefusalBeat({ receipt: null }).refusal,
      missionRefusalBeat({
        receipt: refusedMissionReceipt({ signed: true, decision: decideAcceptance({}), principalId: IDS.principalId }),
        principalName: IDS.principalName,
        npcId: IDS.npcId,
        npcName: IDS.npcName,
      }).refusal,
      takenBeat({ cause: 'war_continuation' }).refusal,
      custodyBeat('escaped').refusal,
      custodyBeat('price_named', { worthBand: 'legendary' }).refusal,
      arcBeat({ level: 'nowhere' }).refusal,
      arcBeat({ verdict: 'turning' }).refusal,
      arcBeat({ verdict: 'reachable' }).refusal,
      arcBeat({ cadences: 0 }).refusal,
      takenBeat({ npcName: 'Agent 47' }).refusal,
    ]);
    expect([...reached].sort(compareCodepoint)).toEqual([...VOICE_REFUSALS].sort(compareCodepoint));
  });
});

// ── THE DOOR, MINTED 2026-09-05 BY LGT-P5-WOPS ───────────────────────────────────

describe('W-OPS O4 — the CR-WR10-C door, and the polarity census that keeps it single', () => {
  /** ES-0's real precondition, measured from the gate's own source: a positive canon
   * marker and a non-omniscient info mode (`beliefsActive`), the errand spine, the layer
   * flag — then this key. */
  const litWorld = (extra = {}) => ({
    spatialCanonVersion: 1,
    simulationRules: {
      infoMode: 'full',
      errandSpineEnabled: true,
      espionageEnabled: true,
      operationsVoiceEnabled: true,
      ...extra,
    },
  });

  test('⭐ THE ONE GATE READ IS LIT, AND IT IS THE FAMILY DOOR — not this leaf', () => {
    expect(operationsVoiceActive(litWorld())).toBe(true);
    expect(operationsVoiceActive(litWorld({ operationsVoiceEnabled: false }))).toBe(false);
    expect(operationsVoiceActive({ simulationRules: {} })).toBe(false);
    expect(operationsVoiceActive(null)).toBe(false);
    expect(operationsVoiceActive(undefined)).toBe(false);
  });

  test('⛔ STRICT, NOT TRUTHY: every truthy non-true spelling reads exactly like absent', () => {
    const absent = operationsVoiceActive(litWorld({ operationsVoiceEnabled: undefined }));
    expect(absent).toBe(false);
    for (const truthy of [1, 'true', {}, []]) {
      expect(
        operationsVoiceActive(litWorld({ operationsVoiceEnabled: truthy })),
        `a truthy non-true ${JSON.stringify(truthy)} must read exactly like absent`,
      ).toBe(absent);
    }
  });

  test('⛔ THE VOICE NEVER OUTLIVES THE RECEIPTS IT READS: each ES-0 door dropped alone', () => {
    expect(operationsVoiceActive({ simulationRules: litWorld().simulationRules })).toBe(false);
    expect(operationsVoiceActive(litWorld({ errandSpineEnabled: false }))).toBe(false);
    expect(operationsVoiceActive(litWorld({ espionageEnabled: false }))).toBe(false);
    expect(operationsVoiceActive(litWorld())).toBe(true);
  });

  test('⛔ THE POLARITY CENSUS: exactly ONE by-name read in src/, and it is strict', () => {
    // A READ, NOT A MENTION: this leaf's own provenance NAMES the key in a string and
    // gates nothing, and so do the manifest member and the row's `rule` field.
    const KEY = 'operationsVoiceEnabled';
    const READ_RE = new RegExp(`\\b${KEY}\\s*(?:===|!==|==|!=)`);
    const readers = srcFiles(join(ROOT, 'src'))
      .map((file) => ({
        rel: relative(ROOT, file).split('\\').join('/'),
        code: readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' '),
      }))
      .filter((entry) => READ_RE.test(entry.code))
      .map((entry) => entry.rel)
      .sort();
    expect(readers).toEqual(['src/domain/worldPulse/espionage/espionageGate.js']);
    expect(READ_RE.test('rules.operationsVoiceEnabled === true')).toBe(true);
    expect(READ_RE.test("door: 'operationsVoiceEnabled: MINTED'")).toBe(false);
  });

  test('⛔ THE KEY IS VIRTUAL: absent from the defaults and from every preset spread', () => {
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, 'operationsVoiceEnabled')).toBe(false);
    for (const [id, preset] of Object.entries(SIMULATION_RULE_PRESETS)) {
      expect(
        Object.prototype.hasOwnProperty.call(preset.rules, 'operationsVoiceEnabled'),
        `${id} declares the key — a virtual key must be false everywhere by ABSENCE`,
      ).toBe(false);
    }
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain('operationsVoiceEnabled');
  });

  test('⭐ MINTING THE DOOR SIGNED NOTHING — every line here is still the pen\'s', () => {
    expect(OPERATIONS_VOICE_PROVENANCE.signedBy).toBe(null);
    expect(OPERATIONS_VOICE_PROVENANCE.status).toMatch(/OWNER-UNSIGNED/);
    expect(OPERATIONS_VOICE_PROVENANCE.ownerRows.length).toBe(5);
  });
});
