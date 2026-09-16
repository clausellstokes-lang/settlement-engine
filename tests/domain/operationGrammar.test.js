/**
 * operationGrammar.test.js — W-OPS car O1, the grammar leaf and THE RECEIPT-FAMILY CENSUS.
 *
 * The census is the point of this file. DESIGN_W_OPS §0's task qualification law says a
 * mission kind registers only if its resolution writes an ALREADY-RECEIPTED outcome family,
 * and a catalog that merely NAMES a family has asserted nothing. So the verdict column is
 * EXECUTED here: every `verified` row's module is resolved against the live tree and its
 * writer symbol is read out of that file, and every `unverified` row is held to carrying its
 * marker and its reason. A rename upstream reds this file rather than leaving the catalog
 * quietly pointing at nothing.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  ACCEPTANCE_SEAMS,
  ACCEPTANCE_SUPPLIER_SEAM,
  DISPATCHABLE_MISSION_KINDS,
  MISSION_KINDS,
  MISSION_KIND_CATALOG,
  OPERATION_CLASSES,
  OPERATION_REFUSALS,
  OPERATION_STATES,
  OPERATION_TERMINAL_STATES,
  OPERATION_TRANSITIONS,
  RECEIPT_SOURCE_VERDICTS,
  advanceOperation,
  isDispatchableKind,
  mayTransition,
  missionKindRow,
  normalizeOperation,
  operationRefusal,
} from '../../src/domain/worldPulse/operations/operationGrammar.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** Every .js under src/, repo-relative. */
function srcFiles() {
  /** @type {string[]} */
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) out.push(full);
    }
  };
  walk(join(ROOT, 'src'));
  return out;
}

/**
 * ⛔⛔ A CITATION IS NOT A LANDING — AND THE PRODUCER CENSUS LEARNED IT THE ESTATE'S USUAL
 * WAY, BY CONVICTING A FILE FOR EXPLAINING ITSELF.
 *
 * The census below asks whether any file under `src/` NAMES an awaited seam symbol, and it
 * asked over RAW BYTES. W-OPS car O4's `envoyTaskCatalog.js` carries a header paragraph
 * saying, in as many words, that it declines to add a purpose — "it is the same line sibling
 * car O2 declined to cross with `seek_compromise`" — and the census read that sentence as
 * the willingness door having LANDED. Same shape as `livedExperienceSources.test.js`'s
 * comment strip and its dereference ban before that.
 *
 * ⭐ COMMENTS ONLY, AND DELIBERATELY NOT STRING LITERALS. The sibling detectors go on to
 * blank strings, because the symbols THEY chase are JS identifiers and a quoted identifier
 * is a receipt. This census is different in kind: `seek_compromise` is a snake_case KIND
 * WORD, and a kind word lands as `kind: 'seek_compromise'` — a string literal. Blanking
 * strings here would cure the false conviction by going blind to the very landing the arm
 * exists to catch, so the strip stops at comments and the control below pins both halves.
 * @param {string} text
 */
function withoutComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

/**
 * ⛔⛔ DOES `file` REALLY EXPORT `symbol` — AS A WHOLE NAME, NOT AS A PREFIX?
 *
 * The substrate coupling's mutation battery found this hole INSIDE THE CURE FOR IT. Both
 * censuses in this file resolved an export with `source.includes('export function ' + s)`,
 * and `knownCharacter.js` declares `export function knownCharacterOf` — which CONTAINS
 * `export function knownCharacter`. So a row awaiting the symbol that names nothing
 * resolved cleanly against the symbol that does, and a planted revert of the respelled
 * row SURVIVED a census written to catch exactly that.
 *
 * ⭐ FOURTH SIGHTING OF ONE LAW IN ONE WAVE: L4 turned a substring ban into a dereference
 * ban; L5 stripped comments before every closure scan; this coupling found a frozen data
 * roster convicted as an importer; and here a substring resolver admitted a longer name.
 * The declaration is therefore matched with its own open paren, so the name must END
 * where the roster says it ends.
 *
 * @param {string} source @param {string} symbol
 */
const exportsSymbol = (source, symbol) => (
  new RegExp(`export function ${symbol}\\s*\\(`).test(source)
);

/** A lawful MISSION row, used as the base every refusal arm perturbs. */
function lawfulMission() {
  return {
    operationId: 'op.1',
    operationClass: 'MISSION',
    kind: 'confirm_belief',
    principalId: 'court.a',
    subjectId: 'court.b',
    state: 'chartered',
  };
}

describe('W-OPS O1 — the mission-kind catalog is REGISTER V, owner-unsigned', () => {
  test('the catalog carries exactly Register V\'s seven mission kinds, in its order', () => {
    expect(MISSION_KINDS).toEqual([
      'confirm_belief',
      'acquire_intel',
      'refute_claim',
      'counter_lie',
      'place_agent',
      'task_mole',
      'extract_agent',
    ]);
  });

  test('every row is owner-UNSIGNED, so a signature can only arrive as an authored diff', () => {
    const signed = MISSION_KIND_CATALOG.filter((row) => row.signedBy !== null).map((row) => row.kind);
    expect(signed).toEqual([]);
  });

  test('every row carries a verdict from the two-word closed set', () => {
    const verdicts = [...new Set(MISSION_KIND_CATALOG.map((row) => row.sourceVerdict))].sort();
    expect(verdicts.every((verdict) => RECEIPT_SOURCE_VERDICTS.includes(verdict))).toBe(true);
    expect(RECEIPT_SOURCE_VERDICTS).toEqual(['verified', 'unverified']);
  });

  test('every row declares MISSION as its class, and the class word is in the closed set', () => {
    const classes = [...new Set(MISSION_KIND_CATALOG.map((row) => row.operationClass))];
    expect(classes).toEqual(['MISSION']);
    expect(OPERATION_CLASSES.includes('MISSION')).toBe(true);
  });
});

describe('W-OPS O1 — THE RECEIPT-FAMILY CENSUS, executed against the live tree', () => {
  test('every VERIFIED row names a module that exists and a writer that module exports', () => {
    /** @type {string[]} */
    const failures = [];
    for (const row of MISSION_KIND_CATALOG) {
      if (row.sourceVerdict !== 'verified') continue;
      const modulePath = join(ROOT, String(row.receiptModule));
      if (!existsSync(modulePath)) {
        failures.push(`${row.kind}: module missing at ${row.receiptModule}`);
        continue;
      }
      const source = readFileSync(modulePath, 'utf8');
      if (!exportsSymbol(source, String(row.receiptWriter))) {
        failures.push(`${row.kind}: ${row.receiptModule} does not export ${row.receiptWriter}`);
      }
    }
    expect(
      failures,
      'A verified catalog row must resolve to a real writer. Re-run the census and move the'
      + ' row to unverified rather than leaving it pointing at nothing.',
    ).toEqual([]);
  });

  test('exactly four kinds are VERIFIED, and they are the ES product triad plus the contradict arm', () => {
    expect(DISPATCHABLE_MISSION_KINDS).toEqual([
      'confirm_belief',
      'acquire_intel',
      'refute_claim',
      'counter_lie',
    ]);
  });

  test('exactly three kinds are UNVERIFIED, and each carries its marker and its reason', () => {
    const unverified = MISSION_KIND_CATALOG.filter((row) => row.sourceVerdict === 'unverified');
    expect(unverified.map((row) => row.kind)).toEqual(['place_agent', 'task_mole', 'extract_agent']);
    const bad = unverified.filter((row) => (
      row.sourceUnverified !== true
      || row.receiptWriter !== null
      || row.receiptModule !== null
      || String(row.sourceNote).length < 80
    ));
    expect(
      bad.map((row) => row.kind),
      'An unverified row keeps its marker, nulls its writer/module so nothing can read a'
      + ' phantom out of it, and states in its note what is actually missing.',
    ).toEqual([]);
  });

  test('extract_agent stays unverified while `caught_spying` has no caller — the road, not the family', () => {
    // The census finding, made executable: the custody CAUSE is a declared vocabulary
    // member, and no module opens a hold with it. The day a caller appears, this reds and
    // the row is re-run rather than outliving its own fact.
    const openers = srcFiles().filter((file) => {
      // The ledger's own module DEFINES both the opener and the cause word; stripping the
      // definition is what makes this a CALLER census rather than a spelling census.
      const source = readFileSync(file, 'utf8').replace(/function openForeignGuestHold/g, '');
      return /openForeignGuestHold\s*\(/.test(source) && /caught_spying/.test(source);
    });
    expect(openers.map((file) => relative(ROOT, file)).sort()).toEqual([]);
    expect(isDispatchableKind('extract_agent')).toBe(false);
  });

  test('the dispatchable set is DERIVED from the verdict column, never a second list', () => {
    const derived = MISSION_KIND_CATALOG
      .filter((row) => row.sourceVerdict === 'verified')
      .map((row) => row.kind);
    expect(DISPATCHABLE_MISSION_KINDS).toEqual(derived);
    expect(MISSION_KIND_CATALOG.every((row) => isDispatchableKind(row.kind)
      === (row.sourceVerdict === 'verified'))).toBe(true);
  });

  test('an unknown kind is neither in the catalog nor dispatchable', () => {
    expect(missionKindRow('no_such_kind')).toBe(null);
    expect(isDispatchableKind('no_such_kind')).toBe(false);
    expect(isDispatchableKind(null)).toBe(false);
  });
});

describe('W-OPS O1 — the one walk: charter, cast, accept or refuse, method, resolve, receipt', () => {
  test('the adjacency covers every state and names no state outside the closed set', () => {
    expect(Object.keys(OPERATION_TRANSITIONS).sort()).toEqual([...OPERATION_STATES].sort());
    const named = new Set(Object.values(OPERATION_TRANSITIONS).flat());
    expect([...named].every((state) => OPERATION_STATES.includes(state))).toBe(true);
  });

  test('every terminal state has zero exits, and no non-terminal state has zero exits', () => {
    const stuck = OPERATION_STATES.filter((state) => (
      OPERATION_TRANSITIONS[state].length === 0
    ));
    expect(stuck.sort()).toEqual([...OPERATION_TERMINAL_STATES].sort());
  });

  test('the DM mandate reaches every non-terminal state — an interrupt anywhere, as chartered', () => {
    const missing = OPERATION_STATES
      .filter((state) => !OPERATION_TERMINAL_STATES.includes(state))
      .filter((state) => !OPERATION_TRANSITIONS[state].includes('lapsed'));
    expect(missing).toEqual([]);
  });

  test('the ordinary walk runs charter to receipt, one lawful step at a time', () => {
    let row = /** @type {any} */ (lawfulMission());
    for (const next of ['cast', 'accepted', 'method_chosen', 'resolved', 'receipted']) {
      row = advanceOperation(row, next);
      expect(row).not.toBe(null);
      expect(row.state).toBe(next);
    }
  });

  test('a refusal is terminal — a refused operation cannot be re-cast into acceptance', () => {
    const cast = advanceOperation(lawfulMission(), 'cast');
    const refused = advanceOperation(cast, 'refused');
    expect(refused?.state).toBe('refused');
    expect(advanceOperation(refused, 'cast')).toBe(null);
    expect(advanceOperation(refused, 'accepted')).toBe(null);
    expect(mayTransition('accepted', 'cast')).toBe(false);
  });

  test('a skipped rung is refused — casting straight to resolved is not a walk', () => {
    expect(advanceOperation(lawfulMission(), 'resolved')).toBe(null);
    expect(mayTransition('chartered', 'resolved')).toBe(false);
    expect(mayTransition('chartered', 'cast')).toBe(true);
  });
});

describe('W-OPS O1 — the validator refuses total-on-garbage, and every arm is reachable', () => {
  test('a lawful mission normalizes to the exact key set and nothing else', () => {
    const normalized = normalizeOperation(lawfulMission());
    expect(Object.keys(/** @type {object} */ (normalized)).sort()).toEqual([
      'kind', 'operationClass', 'operationId', 'principalId', 'state', 'subjectId',
    ]);
    expect(operationRefusal(lawfulMission())).toBe(null);
  });

  test('each closed refusal word is separately reachable from a perturbed lawful row', () => {
    const reached = new Set();
    reached.add(operationRefusal(null));
    reached.add(operationRefusal({ ...lawfulMission(), operationId: '' }));
    reached.add(operationRefusal({ ...lawfulMission(), operationClass: 'RAID' }));
    reached.add(operationRefusal({ ...lawfulMission(), kind: 'no_such_kind' }));
    reached.add(operationRefusal({ ...lawfulMission(), principalId: '  ' }));
    reached.add(operationRefusal({ ...lawfulMission(), subjectId: '' }));
    reached.add(operationRefusal({ ...lawfulMission(), state: 'dreaming' }));
    reached.add(operationRefusal({ ...lawfulMission(), kind: 'place_agent' }));
    reached.delete(null);
    // `class_kind_mismatch` is UNREACHABLE from data today and that is a fact worth stating
    // rather than hiding: every catalog row is MISSION, so no kind can disagree with its
    // class. The word stays because the catalog is a candidate register the owner may
    // extend with a GOAL- or ERRAND-classed row, and the arm is what will catch it.
    expect([...reached].sort()).toEqual([
      'kind_unqualified',
      'missing_operation_id',
      'missing_principal',
      'missing_subject',
      'not_a_row',
      'unknown_class',
      'unknown_kind',
      'unknown_state',
    ]);
    const unreached = OPERATION_REFUSALS.filter((word) => !reached.has(word));
    expect(unreached).toEqual(['class_kind_mismatch']);
  });

  test('the task qualification law bites at the validator — an unverified kind is refused', () => {
    expect(operationRefusal({ ...lawfulMission(), kind: 'place_agent' })).toBe('kind_unqualified');
    expect(normalizeOperation({ ...lawfulMission(), kind: 'place_agent' })).toBe(null);
  });

  test('GOAL and ERRAND do not pass through the mission catalog — two of three classes stay usable', () => {
    const goal = { ...lawfulMission(), operationClass: 'GOAL', kind: 'seek_promotion' };
    const errand = { ...lawfulMission(), operationClass: 'ERRAND', kind: 'negotiate_treaty' };
    expect(operationRefusal(goal)).toBe(null);
    expect(operationRefusal(errand)).toBe(null);
    expect(normalizeOperation(goal)?.kind).toBe('seek_promotion');
  });

  test('garbage of every shape refuses rather than throwing', () => {
    expect(operationRefusal([])).toBe('not_a_row');
    expect(operationRefusal(undefined)).toBe('not_a_row');
    expect(operationRefusal(7)).toBe('not_a_row');
    expect(normalizeOperation('mission')).toBe(null);
    expect(advanceOperation(null, 'cast')).toBe(null);
  });
});

describe('W-OPS O1 — the W-LIVES acceptance seams: four BOUND, one still pinned absent', () => {
  test('the roster covers the four reads DESIGN_W_OPS §1 gives the acceptance step', () => {
    expect(ACCEPTANCE_SEAMS.map((row) => row.seam)).toEqual([
      'vetting_refusal',
      'willingness',
      'risk_register',
      'known_character',
      'effective_character',
    ]);
    expect(ACCEPTANCE_SEAMS.every((row) => String(row.ruling).length > 40)).toBe(true);
  });

  test('THE BINDING CENSUS — every LANDED seam resolves to a real module and a real EXPORT', () => {
    // The census that replaced the absence pin for the four seams the substrate coupling
    // brought together. It is the MISSION_KIND_CATALOG idiom applied one section down:
    // the verdict is EXECUTED against the live tree, so a rename upstream reds this file
    // rather than leaving the roster quietly pointing at nothing.
    //
    // ⛔ AND IT IS WHY THE `known_character` ROW HAD TO BE RESPELLED. The row awaited
    // `knownCharacter`, which names NO symbol anywhere in the estate — the reader is
    // `knownCharacterOf`. A mention census reported it ARRIVED on the strength of three
    // comments; this one opens the file and asks the module what it exports.
    const landed = ACCEPTANCE_SEAMS.filter((row) => row.landed === true);
    expect(landed.map((row) => row.seam)).toEqual([
      'vetting_refusal', 'risk_register', 'known_character', 'effective_character',
    ]);
    /** @type {string[]} */
    const failures = [];
    for (const row of landed) {
      const modulePath = join(ROOT, String(row.home));
      if (!existsSync(modulePath)) {
        failures.push(`${row.seam}: module missing at ${row.home}`);
        continue;
      }
      if (!exportsSymbol(readFileSync(modulePath, 'utf8'), String(row.awaitedSymbol))) {
        failures.push(`${row.seam}: ${row.home} does not export ${row.awaitedSymbol}`);
      }
    }
    expect(
      failures,
      'A bound acceptance seam must resolve to a real exported producer. Re-run the census'
      + ' and correct the symbol rather than leaving the roster pointing at a spelling'
      + ' nothing answers to.',
    ).toEqual([]);
    // ⛔ THE ANTI-PREFIX CONTROL, and it is not hypothetical: a substring resolver
    // matched the roster's ORIGINAL wrong spelling against the right export, because
    // one name is a prefix of the other. Pinned live against the two real files.
    const knownRead = readFileSync(join(ROOT, 'src/domain/npc/knownCharacter.js'), 'utf8');
    expect(exportsSymbol(knownRead, 'knownCharacterOf')).toBe(true);
    expect(exportsSymbol(knownRead, 'knownCharacter')).toBe(false);
    // A BOUND ROW ALSO NAMES ITS ROUTE. The seam is not "this symbol exists" — it is
    // "acceptance reads it, and here is what it reads it through". A row that recorded
    // only the producer would be back to naming a fact nobody is obliged to honour.
    expect(landed.filter((row) => String(row.consumedThrough).length < 40).map((r) => r.seam))
      .toEqual([]);
    expect(landed.every((row) => String(row.consumedThrough).includes('acceptanceCharacterReads')))
      .toBe(true);
  });

  test('the supplier the bound rows name is a real module, and the grammar still imports NOTHING from it', () => {
    // The two halves of the same claim. The route the roster advertises must exist —
    // otherwise `consumedThrough` is prose — and this leaf must still not reach it,
    // because the drift family's one-door and the known read's zero-importer
    // darknesses are cars L4's and L5's and are not this leaf's to spend.
    expect(existsSync(join(ROOT, ACCEPTANCE_SUPPLIER_SEAM))).toBe(true);
    const grammar = readFileSync(
      join(ROOT, 'src/domain/worldPulse/operations/operationGrammar.js'), 'utf8',
    );
    expect(/^import\s/m.test(grammar)).toBe(false);
  });

  test('THE PRODUCER CENSUS — every unlanded seam symbol is still absent from src, and this reds the day one lands', () => {
    // ⛔ ANTI-VACUITY FIRST. This census iterates the UNLANDED rows, so a roster whose
    // rows had all been flipped would pass by asking nothing. The unlanded set is
    // therefore pinned exactly: one row, and it is the willingness door.
    expect(ACCEPTANCE_SEAMS.filter((row) => row.landed !== true).map((row) => row.seam))
      .toEqual(['willingness']);
    const sources = srcFiles()
      .map((file) => [relative(ROOT, file), withoutComments(readFileSync(file, 'utf8'))]);
    /** @type {string[]} */
    const arrived = [];
    for (const row of ACCEPTANCE_SEAMS) {
      if (row.landed === true) continue;
      // ⛔ CANNOT-CATCH (§879 V2): this arm's green at the coupled tip is a SCOPE fact, not a
      // strip fact — `operations/` is excluded on the line below, and O2's `WILLINGNESS_KIND`
      // ('seek_compromise', missionAcceptance.js:123) lives inside it. And because the strip
      // stops at comments BY DESIGN (a kind word LANDS as a string literal), a kind word held
      // in a receipt STRING outside `operations/` convicts here exactly as a landing would —
      // the arm cannot tell a string-literal citation from a string-literal landing. Read a
      // red here as "a producer outside operations/ names the word", then classify by hand.
      const namers = sources
        .filter(([file]) => !file.startsWith('src/domain/worldPulse/operations/'))
        .filter(([, source]) => new RegExp(`\\b${row.awaitedSymbol}\\b`).test(source))
        .map(([file]) => file);
      if (namers.length > 0) arrived.push(`${row.awaitedSymbol}: ${namers.join(', ')}`);
    }
    expect(
      arrived,
      'A W-LIVES acceptance seam has LANDED. This is a schedule, not a defect: wire car O2\'s'
      + ' acceptance read to the real symbol and flip the roster row to landed:true, rather'
      + ' than leaving a named seam that has outlived its own fact.',
    ).toEqual([]);
  });

  test('⭐⭐ THE STRIP DOES NOT BLIND THE CENSUS — a kind word in a string still lands', () => {
    // Both directions, because a census cured by going blind reports "nothing has landed"
    // forever and reads exactly like a census that is working. Driven off the ROSTER rather
    // than a transcribed word, so re-spelling the awaited symbol moves this control with it.
    const awaited = String(ACCEPTANCE_SEAMS.find((row) => row.landed !== true)?.awaitedSymbol);
    expect(awaited).toBe('seek_compromise');
    const names = new RegExp(`\\b${awaited}\\b`);
    // ⭐ A REAL LANDING. A snake_case kind word lands as a STRING LITERAL in a producer,
    // which is exactly why this strip stops at comments instead of blanking strings.
    expect(names.test(withoutComments("export const W = Object.freeze([{ kind: 'seek_compromise' }]);")))
      .toBe(true);
    // ⛔ AND THE TWO CITATION SHAPES — the block comment that actually convicted
    // `envoyTaskCatalog.js`, and its line-comment sibling.
    expect(names.test(withoutComments('/**\n * O2 declined to cross with `seek_compromise`.\n */\nconst a = 1;')))
      .toBe(false);
    expect(names.test(withoutComments('// declined to cross with seek_compromise\nconst a = 1;')))
      .toBe(false);
  });
});

describe('W-OPS O1 — DARK: the grammar leaf has no production caller', () => {
  test('nothing under src/ imports the operation grammar leaf', () => {
    // An IMPORT SPECIFIER census, not a mention census: a comment naming the leaf is not a
    // caller, and the two files in this family name each other in their headers on purpose.
    const importers = srcFiles()
      .filter((file) => !file.endsWith('operationGrammar.js'))
      .filter((file) => /from\s+'[^']*operationGrammar\.js'/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(ROOT, file))
      .sort();
    // The dispatcher is this leaf's ONE importer and is itself dark; every other name here
    // would be a production caller arriving without a flag, which is the thing this car
    // must not do.
    expect(importers).toEqual(['src/domain/worldPulse/operations/missionDispatcher.js']);
  });
});
