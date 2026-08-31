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
      if (!source.includes(`export function ${row.receiptWriter}`)) {
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

describe('W-OPS O1 — the W-LIVES acceptance seams are NAMED, and their absence is pinned', () => {
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

  test('the ONE landed seam is the estate\'s one vetting reader, and its home is real', () => {
    const landed = ACCEPTANCE_SEAMS.filter((row) => row.landed === true);
    expect(landed.map((row) => row.awaitedSymbol)).toEqual(['vetVolunteerEnvoy']);
    const home = readFileSync(join(ROOT, String(landed[0].home)), 'utf8');
    expect(home.includes(`export function ${landed[0].awaitedSymbol}`)).toBe(true);
  });

  test('THE PRODUCER CENSUS — every unlanded seam symbol is still absent from src, and this reds the day one lands', () => {
    const sources = srcFiles().map((file) => [relative(ROOT, file), readFileSync(file, 'utf8')]);
    /** @type {string[]} */
    const arrived = [];
    for (const row of ACCEPTANCE_SEAMS) {
      if (row.landed === true) continue;
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
