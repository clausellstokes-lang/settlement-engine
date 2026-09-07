/**
 * envoyTaskCatalog.test.js — the battery for W-OPS car O4.
 *
 * ⭐⭐ THE DISCIPLINE. The catalog is a set of CLAIMS ABOUT THIS TREE — "this row's receipt
 * family exists, that row's road does not" — and a battery that checked those claims against
 * hand-written literals would prove the catalog self-consistent while discovering nothing
 * about whether the claims are TRUE (§711.4's "an arm that cannot discover anything is a
 * green that means less than it looks"). Every census arm below is therefore driven from the
 * REAL producers: `eventProse.ENVOY_KINDS`, `dispositionLedger.DISPOSITION_SOURCE_KINDS`,
 * `foreignGuestHold.FOREIGN_GUEST_HOLD_CLOSE_REASONS`, `envoyErrandVocabulary.ERRAND_CONSUMERS`.
 * If any of those moves, the row that leaned on it REDS — which is the whole point of writing
 * a census down in code instead of in a receipt.
 *
 * ⭐ AND THE SIGHT ARMS ARE DRIVEN FROM THE REAL CHARACTER STACK, both doors: a genuine
 * `knownCharacterOf` RESULT must pass the shape gate, and genuine `effectiveCharacter` /
 * `characterAsSeenBy` outputs must be REFUSED. A gate proven only against hand-built objects
 * would not have discovered that `characterAsSeenBy({viewer:'mortal'})` returns the BARE
 * chart and is therefore refused too — which is the sharpest thing this file pins.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`: a loop-registered suite is
 * TEST_UNREGISTERED to the lighting census and its assertions are then evidence nowhere,
 * however green vitest reports it.
 *
 * @enforced-by this test
 */
import { describe, expect, test } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

import {
  ADMITTED_TASK_KINDS,
  CATALOG_PURPOSE_CLASSES,
  COUNTERPART_SIGHT_LAW,
  ENVOY_TASK_CATALOG,
  ENVOY_TASK_PROVENANCE,
  FIT_TERMS,
  NEGOTIATION_METHODS,
  NEGOTIATION_METHOD_KINDS,
  PARKED_ENVOY_TASKS,
  PARKED_TASK_KINDS,
  TASK_PARK_CLASSES,
  counterpartFitRead,
  knownReadingOrRefusal,
  negotiationMenuFor,
  taskQualification,
} from '../../src/domain/worldPulse/envoyTaskCatalog.js';
import { ENVOY_KINDS } from '../../src/domain/worldPulse/eventProse.js';
import {
  APPETITE_BAND_LADDER,
  DISPOSITION_SOURCE_KINDS,
} from '../../src/domain/worldPulse/dispositionLedger.js';
import {
  FOREIGN_GUEST_HOLD_CAUSES,
  FOREIGN_GUEST_HOLD_CLOSE_REASONS,
} from '../../src/domain/worldPulse/foreignGuestHold.js';
import {
  ENVOY_PURPOSES,
  ENVOY_PURPOSE_CLASSES,
  ERRAND_CONSUMERS,
} from '../../src/domain/worldPulse/envoyErrandVocabulary.js';
import { characterAsSeenBy, knownCharacterOf } from '../../src/domain/npc/knownCharacter.js';
import { effectiveCharacter } from '../../src/domain/npc/characterDrift.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
// LGT-P5-WOPS: the door this leaf's flag was minted onto. The read lives in the ERRAND
// family's door home beside the spine's own gate — never here, which the no-fork arm below
// still pins.
import { envoyTaskCatalogActive } from '../../src/domain/worldPulse/errandMint.js';
import {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';

const LEAF = 'src/domain/worldPulse/envoyTaskCatalog.js';

/** Every .js/.jsx under src/, repo-relative — the live tree, never a fixture list. */
function srcModules(dir = join(ROOT, 'src'), out = /** @type {string[]} */ ([])) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) srcModules(p, out);
    else if (p.endsWith('.js') || p.endsWith('.jsx')) out.push(relative(ROOT, p).replace(/\\/g, '/'));
  }
  return out;
}

/** Source with block and line comments stripped, so a citation in prose is never a match. */
function codeOf(rel) {
  return readFileSync(join(ROOT, rel), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

/** A real authored chart, in the estate's own axis shape. */
const BRAVE_NPC = Object.freeze({
  character: Object.freeze({
    axes: Object.freeze({
      FIDELITY: Object.freeze({ pole: 'virtue', level: 'marked' }),
      COURAGE: Object.freeze({ pole: 'virtue', level: 'defining' }),
    }),
  }),
});

/** A nerve read the OBSERVER earned: a band plus the records it was read from. */
const READ_NERVE = Object.freeze({
  present: true,
  band: 'restrained',
  heldReceiptIds: Object.freeze(['evt_war_resolution_11']),
});

// ── 1. THE DENOMINATORS, FROM THE REAL PRODUCERS ─────────────────────────────────

describe('W-OPS O4 — the census denominators are the tree\'s, not the catalog\'s', () => {
  test('the envoy receipt family is SIXTEEN kinds, and the catalog says so', () => {
    expect(ENVOY_KINDS).toHaveLength(16);
    expect(ENVOY_TASK_PROVENANCE.census.envoyReceiptKinds).toBe(ENVOY_KINDS.length);
  });

  test('the disposition source vocabulary is THIRTEEN kinds, and the catalog says so', () => {
    expect(DISPOSITION_SOURCE_KINDS).toHaveLength(13);
    expect(ENVOY_TASK_PROVENANCE.census.dispositionSourceKinds).toBe(DISPOSITION_SOURCE_KINDS.length);
  });

  test('⭐ the sixteen carry the JOURNEY, never the TASK KIND', () => {
    // …which is why the envoy family alone can qualify nothing, and (R) must test the
    // DOWNSTREAM outcome family instead.
    // Anchored on a member that DOES travel this collection, so the exclusion cannot pass
    // by the whole registry having drifted away.
    expectAbsentWithAnchor(
      [...ENVOY_KINDS], 'envoy_treaty_negotiated', 'envoy_terms_agreed', 'the envoy kind registry',
    );
    expectAbsentWithAnchor(
      [...ENVOY_KINDS], 'envoy_ransom_settled', 'terms_never_reached', 'the envoy kind registry',
    );
  });

  test('the census bill in the provenance reconciles to the two lists it describes', () => {
    expect(ENVOY_TASK_PROVENANCE.census.admitted).toBe(ENVOY_TASK_CATALOG.length);
    expect(ENVOY_TASK_PROVENANCE.census.parked).toBe(PARKED_ENVOY_TASKS.length);
    expect(ENVOY_TASK_PROVENANCE.census.dispositions)
      .toBe(ENVOY_TASK_CATALOG.length + PARKED_ENVOY_TASKS.length);
  });
});

// ── 2. THE ADMITTED ROWS' RECEIPT FAMILIES ARE REAL ──────────────────────────────

describe('W-OPS O4 — every admitted row names a family this tree actually writes', () => {
  test('every receiptModule is a file that exists under src/', () => {
    const live = new Set(srcModules());
    for (const row of ENVOY_TASK_CATALOG) expect(live.has(row.receiptModule)).toBe(true);
  });

  test('every receiptWriter symbol appears in its own named module', () => {
    for (const row of ENVOY_TASK_CATALOG) {
      expect(codeOf(row.receiptModule)).toContain(row.receiptWriter);
    }
  });

  test('mediate\'s family is one of the frozen thirteen', () => {
    expect(DISPOSITION_SOURCE_KINDS).toContain('mediation_landed');
  });

  test('arrange_reimbursement rides FIVE of the frozen thirteen', () => {
    const coalition = DISPOSITION_SOURCE_KINDS.filter((kind) => kind.startsWith('coalition_'));
    expect(coalition).toHaveLength(5);
  });

  test('every admitted purposeClass is a real member of the errand spine\'s closed set', () => {
    for (const row of ENVOY_TASK_CATALOG) {
      expect(ENVOY_PURPOSE_CLASSES).toContain(row.ridesPurposeClass);
    }
  });

  test('⭐ the catalog purpose classes survive the spine own vocabulary', () => {
    // A bogus class would DROP OUT of the derived list and shrink it — the list is filtered
    // through the real vocabulary rather than restated beside it.
    const declared = [...new Set(ENVOY_TASK_CATALOG.map((row) => row.ridesPurposeClass))].sort();
    expect([...CATALOG_PURPOSE_CLASSES]).toEqual(declared);
    for (const rides of CATALOG_PURPOSE_CLASSES) {
      expect(ENVOY_PURPOSE_CLASSES).toContain(rides);
    }
  });

  test('every admitted row is verified on BOTH conjuncts', () => {
    for (const row of ENVOY_TASK_CATALOG) {
      expect(row.sourceVerdict).toBe('verified');
      expect(row.roadLanded).toBe(true);
    }
  });
});

// ── 3. THE PARKS ARE MEASUREMENTS, NOT OPINIONS ──────────────────────────────────

describe('W-OPS O4 — the parked rows are parked for reasons this tree still holds', () => {
  // ⚠ THE CATALOG ITSELF NAMES EVERY PARKED KIND, so these two scans must exclude the leaf
  // or they would red on their own park rows. Excluding the SUBJECT of a census is honest;
  // excluding anything else would not be, and the arms below scan the whole rest of src/.
  test('⛔ state_visit: no standing-display receipt family exists anywhere else in src/', () => {
    const elsewhere = srcModules().filter((rel) => rel !== LEAF).map(codeOf).join('\n');
    expect(/stateVisit|state_visit|standingDisplay|legitimacyDisplay/.test(elsewhere)).toBe(false);
    expect(taskQualification('state_visit').parkClass).toBe('no_family');
  });

  test('⛔ deliver_ultimatum: the word "ultimatum" appears nowhere else in src/', () => {
    const elsewhere = srcModules().filter((rel) => rel !== LEAF).map(codeOf).join('\n');
    expect(/ultimatum/i.test(elsewhere)).toBe(false);
  });

  test('⭐ hostage_exchange: the custody ledger closes four ways and NONE is an exchange', () => {
    expect(FOREIGN_GUEST_HOLD_CLOSE_REASONS).toHaveLength(4);
    expectAbsentWithAnchor(
      [...FOREIGN_GUEST_HOLD_CLOSE_REASONS], 'exchange', 'release', 'the custody close reasons',
    );
    expectAbsentWithAnchor(
      [...FOREIGN_GUEST_HOLD_CAUSES], 'hostage_exchange', 'parlay_refused', 'the custody causes',
    );
  });

  test('⭐⭐ trade_embassy proves the two conjuncts are separate', () => {
    // Its receipt family is REAL and its road is NOT — the only row in the census that
    // passes one conjunct and fails the other.
    // (R) passes — measured against the real frozen vocabulary.
    expect(DISPOSITION_SOURCE_KINDS).toContain('trade_contest');
    // (E) fails — measured against the real consumer registry.
    const factors = ERRAND_CONSUMERS.find((row) => row.consumer === 'factors');
    expect(factors?.built).toBe(false);
    expect(factors?.purposeClass).toBe('commercial');
    const verdict = taskQualification('trade_embassy');
    expect(verdict.receiptOk).toBe(true);
    expect(verdict.roadOk).toBe(false);
    expect(verdict.admitted).toBe(false);
    expect(verdict.parkClass).toBe('road_unbuilt');
  });

  test('trade_embassy names the wave that unblocks it, and it is the registry\'s own', () => {
    const row = PARKED_ENVOY_TASKS.find((r) => r.kind === 'trade_embassy');
    const factors = ERRAND_CONSUMERS.find((r) => r.consumer === 'factors');
    expect(row?.namedWave).toBe(factors?.wave);
  });

  test('every park class is a declared member, and only road_unbuilt keeps its receipt', () => {
    for (const row of PARKED_ENVOY_TASKS) {
      expect(TASK_PARK_CLASSES).toContain(row.parkClass);
      expect(taskQualification(row.kind).receiptOk).toBe(row.parkClass === 'road_unbuilt');
    }
  });
});

// ── 4. QUALIFICATION IS TOTAL, AND THE TWO LISTS ARE DISJOINT ────────────────────

describe('W-OPS O4 — the qualification test', () => {
  test('an unknown kind is UNKNOWN, never quietly admitted', () => {
    const verdict = taskQualification('negotiate_weather');
    expect(verdict.known).toBe(false);
    expect(verdict.admitted).toBe(false);
    expect(verdict.parkClass).toBeNull();
  });

  test('the empty string is unknown, not a match on an empty field', () => {
    expect(taskQualification('').known).toBe(false);
  });

  test('no kind is both admitted and parked', () => {
    // Anchored on a REAL parked member: a bare exclusion would pass just as happily if the
    // parked list had drifted to empty, which is the day this arm most needs to red.
    for (const kind of ADMITTED_TASK_KINDS) {
      expectAbsentWithAnchor([...PARKED_TASK_KINDS], kind, 'state_visit', 'the parked kinds');
    }
  });

  test('both lists are codepoint-ordered, so the catalog is a set and not a history', () => {
    expect([...ADMITTED_TASK_KINDS]).toEqual([...ADMITTED_TASK_KINDS].sort());
    expect([...PARKED_TASK_KINDS]).toEqual([...PARKED_TASK_KINDS].sort());
  });

  test('every admitted kind qualifies on both halves through the executable test', () => {
    for (const kind of ADMITTED_TASK_KINDS) {
      const verdict = taskQualification(kind);
      expect(verdict.admitted).toBe(true);
      expect(verdict.receiptOk).toBe(true);
      expect(verdict.roadOk).toBe(true);
    }
  });
});

// ── 5. ⛔⛔ THE SIGHT LAW, AGAINST THE REAL CHARACTER STACK ──────────────────────

describe('W-OPS O4 — the two-sights law is structural, not promised', () => {
  test('a REAL knownCharacterOf result passes the shape gate', () => {
    const reading = knownCharacterOf({ npc: BRAVE_NPC });
    const gate = knownReadingOrRefusal(reading);
    expect(gate.ok).toBe(true);
    expect(typeof gate.confidence).toBe('number');
  });

  test('⭐ a confidence number is NOT provenance', () => {
    // A chart wearing a BORROWED confidence is still refused: the disclosed axes are what
    // say the record spoke at all.
    // The near-miss this guard actually exists for: not a true chart (those have no
    // confidence and the first clause catches them), but a chart dressed with a confidence
    // taken from somewhere else — a belief record, a negotiation picture, a caller's own
    // number. Without the disclosedAxes clause this passes, and the mutation battery proved
    // it: dropping that clause killed NOTHING until this arm existed.
    const dressed = {
      character: effectiveCharacter(BRAVE_NPC, null),
      confidence: 0.9,
    };
    const gate = knownReadingOrRefusal(dressed);
    expect(gate.ok).toBe(false);
    expect(gate.reason).toBe('not_a_known_reading');
    // …and the fit read NAMES it absent rather than reading it. The nerve half still
    // answers — that is "a missing term is dropped, never voted" working as designed, and
    // the verdict carries `envoyChart` in `absent` so no consumer can mistake a one-term
    // read for a two-term one.
    const verdict = counterpartFitRead({
      methodKind: 'press_hard', counterpartNerve: READ_NERVE, envoyChart: dressed,
    });
    expect(verdict.absent).toContain('envoyChart');
    expect(verdict.fit).toBe('fits');
    expect(verdict.readAtConfidence).toBe(0);
  });

  test('⛔ a REAL effectiveCharacter chart is REFUSED — it carries no provenance', () => {
    const gate = knownReadingOrRefusal(effectiveCharacter(BRAVE_NPC, null));
    expect(gate.ok).toBe(false);
    expect(gate.reason).toBe('not_a_known_reading');
  });

  test('⛔⛔ characterAsSeenBy({viewer:"deity"}) — the TRUE-SIGHT door — is REFUSED', () => {
    const trueChart = characterAsSeenBy({ viewer: 'deity', npc: BRAVE_NPC, drift: null });
    expect(knownReadingOrRefusal(trueChart).ok).toBe(false);
  });

  test('⭐ characterAsSeenBy mortal is ALSO refused — it returns the bare chart', () => {
    // The gate demands the knownCharacterOf RESULT, never the chart it carries.
    const mortalChart = characterAsSeenBy({ viewer: 'mortal', npc: BRAVE_NPC, drift: null });
    expect(knownReadingOrRefusal(mortalChart).ok).toBe(false);
  });

  test('the fit read refuses a true chart LOUDLY rather than degrading quietly', () => {
    const verdict = counterpartFitRead({
      methodKind: 'press_hard',
      counterpartNerve: READ_NERVE,
      envoyChart: effectiveCharacter(BRAVE_NPC, null),
    });
    expect(verdict.refusal).toBe('true_chart_refused');
    expect(verdict.fit).toBe('refused');
  });

  test('⭐⭐ a true chart refuses the WHOLE menu, wait_them_out included', () => {
    // wait_them_out never reads the envoy, yet it must still refuse: a partial refusal
    // would leave exactly one row looking valid.
    const menu = negotiationMenuFor({
      counterpartNerve: READ_NERVE,
      envoyChart: effectiveCharacter(BRAVE_NPC, null),
    });
    expect(menu).toHaveLength(NEGOTIATION_METHOD_KINDS.length);
    for (const row of menu) expect(row.refusal).toBe('true_chart_refused');
    // The negative control for this arm: the SAME menu on a real known reading refuses nobody.
    const clean = negotiationMenuFor({
      counterpartNerve: READ_NERVE,
      envoyChart: knownCharacterOf({ npc: BRAVE_NPC }),
    });
    for (const row of clean) expect(row.refusal).toBe('');
  });

  test('⭐⭐ a band with NO receipt behind it is not a read', () => {
    // The clause that stops a counterpart-ledger band being laundered into knowledge.
    const laundered = { present: true, band: 'restrained', heldReceiptIds: [] };
    const verdict = counterpartFitRead({ methodKind: 'press_hard', counterpartNerve: laundered });
    expect(verdict.known).toBe(false);
    expect(verdict.fit).toBe('unread');
    expect(verdict.absent).toContain('counterpartNerve');
  });

  test('the sight law names the observer-scoped model and the footholds-only scope', () => {
    expect(COUNTERPART_SIGHT_LAW.observerScopedModel)
      .toBe('src/domain/worldPulse/beliefMap.js');
    expect(COUNTERPART_SIGHT_LAW.deityTrueSightScope).toBe('targetedFootholds');
  });

  test('⭐ the believed-attribute list the law quotes is the one beliefMap actually carries', () => {
    const beliefSource = codeOf('src/domain/worldPulse/beliefMap.js');
    for (const attr of COUNTERPART_SIGHT_LAW.believedAttributesToday) {
      expect(beliefSource).toContain(attr);
    }
    // And the thing it says is NOT believed is genuinely not there.
    expect(/believedAppetite|appetiteBand/.test(beliefSource)).toBe(false);
  });
});

// ── 6. ABSENT IS NAMED, NEVER VOTED ──────────────────────────────────────────────

describe('W-OPS O4 — an unread court is unread, not a middle band', () => {
  test('no nerve at all ⇒ fit "unread" and the term NAMED in absent', () => {
    const verdict = counterpartFitRead({ methodKind: 'press_hard' });
    expect(verdict.fit).toBe('unread');
    expect(verdict.absent).toContain('counterpartNerve');
  });

  test('null and the empty string are ABSENT, never a supplied band', () => {
    const withNull = counterpartFitRead({
      methodKind: 'press_hard',
      counterpartNerve: { present: true, band: null, heldReceiptIds: ['e1'] },
    });
    const withEmpty = counterpartFitRead({
      methodKind: 'press_hard',
      counterpartNerve: { present: true, band: '', heldReceiptIds: ['e1'] },
    });
    expect(withNull.known).toBe(false);
    expect(withEmpty.known).toBe(false);
  });

  test('present must be strictly true — absent and false are identical at the decision site', () => {
    const verdict = counterpartFitRead({
      methodKind: 'press_hard',
      counterpartNerve: { present: 'yes', band: 'restrained', heldReceiptIds: ['e1'] },
    });
    expect(verdict.known).toBe(false);
  });

  test('an unknown method is refused rather than fitted', () => {
    const verdict = counterpartFitRead({ methodKind: 'sing_to_them' });
    expect(verdict.fit).toBe('unknown_method');
    expect(verdict.absent).toEqual([...FIT_TERMS].sort());
  });
});

// ── 7. THE METHOD MENU ───────────────────────────────────────────────────────────

describe('W-OPS O4 — the R3b method menu', () => {
  test('⭐ press the cowardly court, never the brave one', () => {
    // The volume's own sentence, made arithmetic.
    const cowardly = counterpartFitRead({
      methodKind: 'press_hard',
      counterpartNerve: { present: true, band: 'restrained', heldReceiptIds: ['e1'] },
    });
    const brave = counterpartFitRead({
      methodKind: 'press_hard',
      counterpartNerve: { present: true, band: 'dominant', heldReceiptIds: ['e1'] },
    });
    expect(cowardly.fit).toBe('fits');
    expect(brave.fit).toBe('misfires');
  });

  test('⭐ the band words are BORROWED, not minted', () => {
    // Every band a method names is a real member of the appetite ladder.
    for (const method of NEGOTIATION_METHODS) {
      for (const band of [...method.fitsNerve, ...method.misfiresOn]) {
        expect(APPETITE_BAND_LADDER).toContain(band);
      }
    }
  });

  test('no method both fits and misfires on one band', () => {
    // ⚠ NO ANCHOR IS AVAILABLE HERE, and that is a fact about the data rather than a
    // shortcut: `appeal_to_interest` misfires on NOBODY, so its misfire list is legitimately
    // empty and a bare exclusion against it would pass vacuously. The intersection form
    // carries its own liveness instead — and it names WHICH method collided when it reds.
    const overlaps = NEGOTIATION_METHODS.flatMap((method) => method.fitsNerve
      .filter((band) => method.misfiresOn.includes(band))
      .map((band) => `${method.kind}:${band}`));
    expect(NEGOTIATION_METHODS.reduce((n, m) => n + m.fitsNerve.length, 0)).toBeGreaterThan(0);
    expect(NEGOTIATION_METHODS.reduce((n, m) => n + m.misfiresOn.length, 0)).toBeGreaterThan(0);
    expect(overlaps).toEqual([]);
  });

  test('wait_them_out is the one method that consults nobody who was sent', () => {
    const waiting = NEGOTIATION_METHODS.find((m) => m.kind === 'wait_them_out');
    expectAbsentWithAnchor(
      [...(waiting?.reads || [])], 'envoyChart', 'counterpartNerve', 'wait_them_out\'s reads',
    );
  });

  test('the menu is codepoint-ordered and complete whatever the caller knows', () => {
    const menu = negotiationMenuFor({ counterpartNerve: READ_NERVE });
    expect(menu.map((row) => row.methodKind)).toEqual([...NEGOTIATION_METHOD_KINDS]);
    expect([...NEGOTIATION_METHOD_KINDS]).toEqual([...NEGOTIATION_METHOD_KINDS].sort());
  });

  test('an empty menu call still returns every method, each honestly unread', () => {
    const menu = negotiationMenuFor({});
    expect(menu).toHaveLength(NEGOTIATION_METHOD_KINDS.length);
    for (const row of menu) expect(row.fit).toBe('unread');
  });
});

// ── 8. DARKNESS, AND THE NO-FORK PINS ────────────────────────────────────────────

describe('W-OPS O4 — the leaf is dark and forks nothing', () => {
  test('⭐ NO src/ MODULE IMPORTS THIS LEAF — the darkness is a discovery arm', () => {
    // ⏱ RE-CUT 2026-09-05 BY LGT-P5-WOPS, ON THIS VOLUME'S OWN RULING. The arm's TITLE is
    // the claim — no src MODULE IMPORTS this leaf — and its first spelling measured
    // MENTIONS of the string `envoyTaskCatalog`, which the CR-WR10-C mint necessarily adds
    // in three bookkeeping places: the manifest member, the certification row's module
    // path, and the errand family door. None of them is a caller. The sibling car in this
    // same volume already ruled the instrument verbatim (missionDispatcher.test.js: "An
    // IMPORT SPECIFIER census, not a mention census … a header is not a caller"), so the
    // caller claim is now that census — STRICTLY STRONGER, because a mention scan is
    // satisfied by a renamed import — and the mention census SURVIVES beside it as an
    // EXACT roster, so a fourth namer reds and a vanished mint surface reds too.
    const importers = srcModules()
      .filter((rel) => rel !== LEAF)
      .filter((rel) => /from\s+'[^']*envoyTaskCatalog\.js'/.test(codeOf(rel)));
    expect(importers).toEqual([]);
    const namers = srcModules()
      .filter((rel) => rel !== LEAF)
      .filter((rel) => /envoyTaskCatalog/.test(codeOf(rel)))
      .sort();
    expect(namers).toEqual([
      'src/domain/certification/subsystemRowsOps.js',
      'src/domain/worldPulse/errandMint.js',
      'src/domain/worldPulse/simulationRules.js',
    ]);
  });

  test('the leaf mints NO flag read — the door is named and not opened', () => {
    const code = codeOf(LEAF);
    // ⏱ THE MINT LANDED 2026-09-05 AND THIS NEGATIVE IS UNCHANGED ON PURPOSE — it is the
    // contract, not a countdown. The catalog is a pure table whose exports take their
    // inputs as arguments, so the world is consulted in the errand family's door home and
    // never here; the door's own arms are at the foot of this file.
    expect(/envoyTaskCatalogEnabled\s*\]?\s*===\s*true/.test(code)).toBe(false);
    expect(ENVOY_TASK_PROVENANCE.door).toContain('MINTED 2026-09-05');
    expect(ENVOY_TASK_PROVENANCE.door).toContain('the READ IS NOT HERE');
  });

  test('⛔ THE LEAF IMPORTS NOTHING CROSS-LAYER — no coupling registry row is owed', () => {
    // ⚠ ANCHORED AT STATEMENT START, and the first spelling of this arm was not. A bare
    // /from\s+'([^']+)'/ matched a PROSE STRING that happened to end in the word "from",
    // and reported a second import that does not exist — the substring-ban-guards-the-list-
    // not-the-property class, caught by this arm reddening on its own subject.
    const imports = [...codeOf(LEAF).matchAll(/^import[^;]*?from\s+'([^']+)';/gm)].map((m) => m[1]);
    expect(imports).toEqual(['./envoyErrandVocabulary.js']);
  });

  test('⭐ the leaf reads NO court ledger — the two-sights law is kept by having no reach', () => {
    const code = codeOf(LEAF);
    expect(/courtRiskAppetiteOf\s*\(/.test(code)).toBe(false);
    expect(/readDispositionAppetite\s*\(/.test(code)).toBe(false);
    expect(/knownCharacterOf\s*\(/.test(code)).toBe(false);
  });

  test('the method menu is a FIRST MINT — no other negotiation-method vocabulary exists', () => {
    const others = srcModules()
      .filter((rel) => rel !== LEAF)
      .filter((rel) => /NEGOTIATION_METHOD|negotiationStyle/.test(codeOf(rel)));
    expect(others).toEqual([]);
  });

  test('⚠ the catalog does NOT touch ENVOY_PURPOSES', () => {
    // A task kind is CHARTERED; a purpose is PERSISTED. Different grains, and the persisted
    // one is total by pin.
    expect([...ENVOY_PURPOSES]).toEqual(['sue', 'self_parlay']);
    expectAbsentWithAnchor(
      [...ENVOY_PURPOSES], 'negotiate_treaty', 'sue', 'the persisted envoy purposes',
    );
    expectAbsentWithAnchor(
      [...ENVOY_PURPOSES], 'mediate', 'self_parlay', 'the persisted envoy purposes',
    );
  });

  test('the catalog does not take sibling car O3\'s name, so the landing appends', () => {
    const code = codeOf(LEAF);
    expect(/PLACEMENT_MISSION_KINDS/.test(code)).toBe(false);
    // …but it DOES take O3's field shape, which is what makes the union clean.
    for (const row of ENVOY_TASK_CATALOG) {
      expect(row).toHaveProperty('receiptFamily');
      expect(row).toHaveProperty('receiptWriter');
      expect(row).toHaveProperty('receiptModule');
      expect(row).toHaveProperty('sourceVerdict');
      expect(row).toHaveProperty('signedBy');
    }
  });

  test('nothing here is signed — the catalog is the owner\'s §9 row 1', () => {
    expect(ENVOY_TASK_PROVENANCE.signedBy).toBeNull();
    for (const row of ENVOY_TASK_CATALOG) expect(row.signedBy).toBeNull();
  });
});

// ── 9. THE DOOR, MINTED 2026-09-05 BY LGT-P5-WOPS ────────────────────────────────

describe('W-OPS O4 — the CR-WR10-C door, and the polarity census that keeps it single', () => {
  /** The spine's real precondition — `errandSpineEnabled` read strictly, by name, off the
   * world's own rules — and then this key. Deliberately NO espionage flag: the catalog is
   * diplomatic business, and the asymmetry is asserted below rather than assumed. */
  const litWorld = (extra = {}) => ({
    simulationRules: { errandSpineEnabled: true, envoyTaskCatalogEnabled: true, ...extra },
  });

  test('⭐ THE ONE GATE READ IS LIT, AND IT IS THE ERRAND DOOR — not this leaf', () => {
    expect(envoyTaskCatalogActive(litWorld())).toBe(true);
    expect(envoyTaskCatalogActive(litWorld({ envoyTaskCatalogEnabled: false }))).toBe(false);
    expect(envoyTaskCatalogActive({ simulationRules: {} })).toBe(false);
    expect(envoyTaskCatalogActive(null)).toBe(false);
    expect(envoyTaskCatalogActive(undefined)).toBe(false);
  });

  test('⛔ STRICT, NOT TRUTHY: every truthy non-true spelling reads exactly like absent', () => {
    const absent = envoyTaskCatalogActive(litWorld({ envoyTaskCatalogEnabled: undefined }));
    expect(absent).toBe(false);
    for (const truthy of [1, 'true', {}, []]) {
      expect(
        envoyTaskCatalogActive(litWorld({ envoyTaskCatalogEnabled: truthy })),
        `a truthy non-true ${JSON.stringify(truthy)} must read exactly like absent`,
      ).toBe(absent);
    }
  });

  test('⛔ THE DOOR IS THE SPINE AND NEVER THE ESPIONAGE LAYER — the asymmetry is the design', () => {
    // Drop the spine and the menu goes dark: a list of business nobody can be sent on.
    expect(envoyTaskCatalogActive(litWorld({ errandSpineEnabled: false }))).toBe(false);
    // ...and with NO espionage flag anywhere in the world it stays LIT, which is the half
    // that would silently invert if a later car folded this key under the covert layer.
    expect(envoyTaskCatalogActive(litWorld())).toBe(true);
    // THE FIXTURE ITSELF CARRIES NO COVERT FLAG, and the claim is anchored rather than
    // bare: a `not.toContain` over a key list passes just as happily when the LIST drifted
    // away, so the anchor asserts the key that IS there in the same breath.
    expectAbsentWithAnchor(
      Object.keys(litWorld().simulationRules), 'espionageEnabled', 'envoyTaskCatalogEnabled',
      'the lit fixture is spine-only, so the arm above proves a spine door and not a covert one',
    );
  });

  test('⛔ THE POLARITY CENSUS: exactly ONE by-name read in src/, and it is strict', () => {
    // A READ, NOT A MENTION: the manifest member, the certification row's `rule` field and
    // this leaf's provenance string all NAME the key and gate nothing.
    const KEY = 'envoyTaskCatalogEnabled';
    const READ_RE = new RegExp(`\\b${KEY}\\s*(?:===|!==|==|!=)`);
    const readers = srcModules()
      .map((rel) => ({ rel, code: codeOf(rel) }))
      .filter((entry) => READ_RE.test(entry.code))
      .map((entry) => entry.rel)
      .sort();
    expect(readers).toEqual(['src/domain/worldPulse/errandMint.js']);
    expect(READ_RE.test('rules.envoyTaskCatalogEnabled === true')).toBe(true);
    expect(READ_RE.test("door: 'envoyTaskCatalogEnabled: MINTED'")).toBe(false);
  });

  test('⛔ THE KEY IS VIRTUAL: absent from the defaults and from every preset spread', () => {
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, 'envoyTaskCatalogEnabled')).toBe(false);
    for (const [id, preset] of Object.entries(SIMULATION_RULE_PRESETS)) {
      expect(
        Object.prototype.hasOwnProperty.call(preset.rules, 'envoyTaskCatalogEnabled'),
        `${id} declares the key — a virtual key must be false everywhere by ABSENCE`,
      ).toBe(false);
    }
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain('envoyTaskCatalogEnabled');
  });

  test('⭐ MINTING THE DOOR SIGNED NOTHING — the table is still the pen\'s', () => {
    expect(ENVOY_TASK_PROVENANCE.signedBy).toBe(null);
    expect(ENVOY_TASK_PROVENANCE.status).toMatch(/OWNER-UNSIGNED/);
    expect(ENVOY_TASK_PROVENANCE.ownerRows.length).toBe(5);
  });
});
