/**
 * tests/domain/npc/characterEdit.test.js — the edit surface's wall, its one
 * lawful writer, and the whole-chart-with-a-ghost model (W-LIVES car L8).
 *
 * ⭐ THE FOUR ASSERTIONS THIS FILE EXISTS FOR, and each is a bug the recon caught
 * by execution rather than a property somebody hoped for:
 *
 *   1. THE MARKER BUYS THE LIFECYCLE. `writeAuthoredChart` must leave the record
 *      in the state `regenerationPolicy` preserves, in ALL THREE regen modes.
 *      This is driven through the REAL `mergePreservedNpcs`, not through a
 *      restatement of its rule — a test that asserted `_authored === true` would
 *      pass forever while the preservation table moved underneath it.
 *   2. THE WALL IS FAIL-CLOSED AND THE REFUSALS ARE CLOSED. Every refusal a
 *      caller can provoke is in `CHART_REFUSALS`, asserted BOTH WAYS.
 *   3. THE CHART STAYS OUT OF THE PROSE REGISTRY. Asserted as a fact about the
 *      registry, so admitting it later reds here first.
 *   4. THE GHOST IS READ-ONLY AND THE WHOLE CHART IS WHOLE.
 */

import { describe, test, expect } from 'vitest';

import {
  AUTHORED_CHART_KEY,
  AUTHORED_MARKER_KEY,
  AXIS_POLES,
  CHART_EDIT_PROVENANCE,
  CHART_REFUSALS,
  CHART_WRITER_SEAM,
  admitAuthoredChart,
  authoredValuesOf,
  storedChartOf,
  writeAuthoredChart,
} from '../../../src/domain/npc/characterEdit.js';
import {
  NEUTRAL_POSITION_CELL,
  SPECTRUM_RUNGS,
  editChartModel,
  editChartRows,
} from '../../../src/domain/npc/characterEditView.js';
import { AXIS_LEVELS, NEUTRAL_POSITION, SPECTRUM_HALF_SPAN } from '../../../src/domain/npc/characterDrift.js';
import { EDITABLE_FIELDS, isEditablePath } from '../../../src/domain/userEdits.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { tagEntityCanon } from '../../../src/domain/canonStatus.js';
import { PRESERVATION_RULES, REGENERATION_MODES, preservesEntity } from '../../../src/domain/regenerationPolicy.js';
import { mergePreservedNpcs } from '../../../src/domain/regenerationPreservation.js';

const ROSTER = Object.freeze(['candour', 'greed', 'mercy', 'nerve']);
const CHART = Object.freeze({
  axes: {
    candour: { pole: 'virtue', level: 'defining' },
    greed: { pole: 'vice', level: 'marked' },
  },
});

/** A roster the merge can substitute into, with the authored soul in the last slot. */
function rosters(authoredNpc) {
  return {
    previous: [
      { id: 'npc_1', name: 'Alda Vare', role: 'Magistrate', category: 'civic' },
      { id: 'npc_2', name: 'Beren Holt', role: 'Captain', category: 'martial' },
      authoredNpc,
    ],
    fresh: [
      { id: 'npc_1', name: 'Dorn Ash', role: 'Reeve', category: 'civic' },
      { id: 'npc_2', name: 'Elsa Quin', role: 'Chandler', category: 'trade' },
      { id: 'npc_3', name: 'Fen Marr', role: 'Captain', category: 'martial' },
    ],
  };
}

describe('characterEdit — the admission wall', () => {
  test('admits a well-formed sparse chart and REDUCES it to {pole,level}', () => {
    const admitted = admitAuthoredChart({
      axes: {
        greed: { pole: 'vice', level: 'marked', smuggled: 'ride-along' },
        candour: { pole: 'virtue', level: 'defining' },
      },
    });
    expect(admitted.ok).toBe(true);
    // Codepoint-ordered and reduced: the smuggled sibling key is GONE.
    expect(JSON.stringify(admitted.ok && admitted.chart)).toBe(
      '{"axes":{"candour":{"pole":"virtue","level":"defining"},"greed":{"pole":"vice","level":"marked"}}}',
    );
  });

  test('ALL-NEUTRAL IS LEGAL and normalizes to the empty sparse map', () => {
    for (const candidate of [{}, { axes: {} }, { axes: { candour: {} } }]) {
      const admitted = admitAuthoredChart(candidate);
      expect(admitted.ok).toBe(true);
      expect(admitted.ok && admitted.chart).toEqual({ axes: {} });
    }
    // …and the explicitly-empty cell is REPORTED, not silently swallowed.
    const reported = admitAuthoredChart({ axes: { candour: {} } });
    expect(reported.ok && reported.neutralAxisIds).toEqual(['candour']);
  });

  test('a HALF-SPELLED position is REFUSED, never neutralized', () => {
    // This is the sharp one: `positionValue({pole:'virtue'})` reads NEUTRAL, so a
    // wall that admitted it would throw the user's stated pole away and show them
    // a neutral axis they had just set.
    expect(admitAuthoredChart({ axes: { candour: { pole: 'virtue' } } }))
      .toMatchObject({ ok: false, reason: 'position_incomplete', axisId: 'candour' });
    expect(admitAuthoredChart({ axes: { candour: { level: 'marked' } } }))
      .toMatchObject({ ok: false, reason: 'position_incomplete', axisId: 'candour' });
  });

  test('every refusal a caller can provoke, and the vocabulary is CLOSED both ways', () => {
    /** @type {Array<[unknown, string]>} */
    const provocations = [
      [null, 'chart_not_an_object'],
      ['a chart', 'chart_not_an_object'],
      [[], 'chart_not_an_object'],
      [{ axes: [] }, 'axes_not_an_object'],
      [{ axes: 'candour' }, 'axes_not_an_object'],
      [{ axes: { ' ': { pole: 'virtue', level: 'marked' } } }, 'axis_unnamed'],
      [{ axes: { candour: null } }, 'position_malformed'],
      [{ axes: { candour: 'virtue' } }, 'position_malformed'],
      [{ axes: { candour: { pole: 'virtue' } } }, 'position_incomplete'],
      [{ axes: { candour: { pole: 'neither', level: 'marked' } } }, 'pole_unknown'],
      [{ axes: { candour: { pole: 'virtue', level: 'total' } } }, 'level_unknown'],
    ];
    const seen = new Set();
    for (const [candidate, reason] of provocations) {
      const result = admitAuthoredChart(candidate);
      expect({ candidate, reason: result.ok ? 'ADMITTED' : result.reason })
        .toEqual({ candidate, reason });
      seen.add(reason);
    }
    // the roster refusal needs a roster, and the npc refusal is the writer's
    expect(admitAuthoredChart({ axes: { hubris: { pole: 'vice', level: 'marked' } } }, { axes: ROSTER }))
      .toMatchObject({ ok: false, reason: 'axis_unknown', axisId: 'hubris' });
    seen.add('axis_unknown');
    expect(writeAuthoredChart(null, CHART)).toMatchObject({ ok: false, reason: 'npc_not_an_object' });
    seen.add('npc_not_an_object');

    // FORWARD: nothing was emitted that the vocabulary does not speak.
    for (const reason of seen) expect(CHART_REFUSALS).toContain(reason);
    // REVERSE: nothing the vocabulary speaks is unreachable. This is the direction
    // that reds when a refusal is deleted and its row is left behind.
    expect([...CHART_REFUSALS].sort()).toEqual([...seen].sort());
  });

  test('the roster gate is OPT-IN and the result SAYS which check it got', () => {
    const shapeOnly = admitAuthoredChart({ axes: { hubris: { pole: 'vice', level: 'marked' } } });
    expect(shapeOnly.ok).toBe(true);
    expect(shapeOnly.ok && shapeOnly.rosterChecked).toBe(false);
    const checked = admitAuthoredChart(CHART, { axes: ROSTER });
    expect(checked.ok && checked.rosterChecked).toBe(true);
  });
});

describe('characterEdit — the one lawful writer', () => {
  test('writes the chart, stamps the marker, and does NOT mutate the caller', () => {
    const npc = { id: 'npc_3', name: 'Cass Rell' };
    const result = writeAuthoredChart(npc, CHART);
    expect(result.ok).toBe(true);
    expect(result.changed).toBe(true);
    expect(result.npc).not.toBe(npc);
    expect(npc).toEqual({ id: 'npc_3', name: 'Cass Rell' });   // untouched
    expect(storedChartOf(result.npc)).toEqual(CHART);
    expect(/** @type {Record<string, unknown>} */ (result.npc)[AUTHORED_MARKER_KEY]).toBe(true);
  });

  test('a re-write of the SAME claim returns the SAME reference', () => {
    const first = writeAuthoredChart({ id: 'npc_3' }, CHART);
    const again = writeAuthoredChart(first.npc, CHART);
    expect(again.changed).toBe(false);
    expect(again.npc).toBe(first.npc);
    // …and the claim is compared by MEANING, not by bytes: a differently-ordered,
    // sibling-carrying spelling of the same chart is still the same claim.
    const reordered = writeAuthoredChart(first.npc, {
      axes: {
        greed: { level: 'marked', pole: 'vice', stray: 1 },
        candour: { pole: 'virtue', level: 'defining' },
      },
    });
    expect(reordered.changed).toBe(false);
    expect(reordered.npc).toBe(first.npc);
  });

  test('a REFUSED payload leaves no marker and no chart behind', () => {
    const npc = { id: 'npc_3', name: 'Cass Rell' };
    const result = writeAuthoredChart(npc, { axes: { candour: { pole: 'virtue' } } });
    expect(result.ok).toBe(false);
    expect(result.changed).toBe(false);
    expect(result.npc).toBe(npc);
    expect(npc).toEqual({ id: 'npc_3', name: 'Cass Rell' });
  });

  test('sibling keys on `character` are PRESERVED, never tidied away', () => {
    const npc = { id: 'npc_3', character: { axes: {}, mintedBy: 'some-later-car' } };
    const result = writeAuthoredChart(npc, CHART);
    expect(storedChartOf(result.npc)).toEqual({ mintedBy: 'some-later-car', axes: CHART.axes });
  });

  test('clearing a chart back to all-neutral NEVER un-canons the soul', () => {
    const written = writeAuthoredChart({ id: 'npc_3' }, CHART);
    const cleared = writeAuthoredChart(written.npc, { axes: {} });
    expect(cleared.changed).toBe(true);
    expect(storedChartOf(cleared.npc)).toEqual({ axes: {} });
    expect(/** @type {Record<string, unknown>} */ (cleared.npc)[AUTHORED_MARKER_KEY]).toBe(true);
  });

  test('authoredValuesOf reads the SPECTRUM, codepoint-ordered', () => {
    const written = writeAuthoredChart({ id: 'npc_3' }, CHART);
    expect(authoredValuesOf(written.npc)).toEqual({ candour: SPECTRUM_HALF_SPAN, greed: -2 });
    expect(Object.keys(authoredValuesOf(written.npc))).toEqual(['candour', 'greed']);
    expect(authoredValuesOf(null)).toEqual({});
  });
});

describe('characterEdit — THE LIFECYCLE THE RECON GATED THIS CAR ON', () => {
  // ⛔ THE MODE TABLE IS PINNED FIRST, because the two tests below mean DIFFERENT
  // things per mode and a silent table change would quietly turn the control into
  // a tautology. `nudge` rates npc 'always' — it preserves EVERY character
  // unconditionally, so it is the one mode where the marker is not what saves the
  // chart. The two modes that actually reroll are where the marker earns its keep.
  test('the preservation table this car depends on, pinned', () => {
    expect(REGENERATION_MODES.map((mode) => [mode, PRESERVATION_RULES[mode].npc]))
      .toEqual([['nudge', 'always'], ['rebalance', 'canon'], ['reforge', 'locked']]);
  });

  const REROLLING_MODES = ['rebalance', 'reforge'];

  test('⭐ the written chart survives ALL THREE regen modes, through the REAL merge', () => {
    const written = writeAuthoredChart({ id: 'npc_3', name: 'Cass Rell', role: 'Chandler', category: 'trade' }, CHART);
    expect(tagEntityCanon(written.npc)).toEqual({ source: 'user', canonStatus: 'canon', locked: true });

    const { previous, fresh } = rosters(/** @type {any} */ (written.npc));
    for (const mode of REGENERATION_MODES) {
      expect(preservesEntity(mode, 'npc', /** @type {any} */ (written.npc))).toBe(true);
      const merged = mergePreservedNpcs(previous, fresh, { mode, locks: {} });
      const carrier = merged.npcs.find((n) => JSON.stringify(storedChartOf(n)) === JSON.stringify(CHART));
      expect({ mode, survived: !!carrier }).toEqual({ mode, survived: true });
    }

    // ⚠ AND THE ID MOVED. Asserted on the rerolling modes, where the marked soul
    // is the ONLY keeper and the substitution is unambiguous: the keeper INHERITS
    // a fresh slot's id, so any sidecar keyed on the positional id would now be
    // about a different person — which is exactly why the authored core lives ON
    // the record and not in a map.
    for (const mode of REROLLING_MODES) {
      const merged = mergePreservedNpcs(previous, fresh, { mode, locks: {} });
      expect({ mode, preserved: merged.preserved })
        .toEqual({ mode, preserved: [{ id: 'npc_2', name: 'Cass Rell', fromId: 'npc_3' }] });
      expect({ mode, at3: merged.npcs.find((n) => n.id === 'npc_3')?.name })
        .toEqual({ mode, at3: 'Fen Marr' });
    }
  });

  test('THE NEGATIVE CONTROL: without the marker the chart is DESTROYED by every mode that rerolls', () => {
    // The control is the whole proof. A merge that preserved everything would pass
    // the assertion above while the marker did nothing at all.
    const bare = { id: 'npc_3', name: 'Cass Rell', role: 'Chandler', category: 'trade', [AUTHORED_CHART_KEY]: CHART };
    const { previous, fresh } = rosters(bare);
    const survives = (mode) => mergePreservedNpcs(previous, fresh, { mode, locks: {} })
      .npcs.some((n) => JSON.stringify(storedChartOf(n)) === JSON.stringify(CHART));

    for (const mode of REROLLING_MODES) {
      expect({ mode, survived: survives(mode) }).toEqual({ mode, survived: false });
    }
    // ⭐ AND `nudge` IS STATED, NOT HIDDEN. It rates npc 'always', so an unmarked
    // chart survives there too — a control that quietly asserted otherwise would
    // be claiming the marker does work the table already does.
    expect({ mode: 'nudge', survived: survives('nudge') }).toEqual({ mode: 'nudge', survived: true });
  });

  test('the chart survives a PERSIST/UNDO round trip (the snapshot is a JSON clone)', () => {
    const written = writeAuthoredChart({ id: 'npc_3' }, CHART);
    const settlement = { name: 'Probeton', npcs: [written.npc], versionHistory: [{ at: 'earlier' }] };
    const snapshot = JSON.parse(JSON.stringify(settlement));
    delete snapshot.versionHistory;
    expect(storedChartOf(snapshot.npcs[0])).toEqual(CHART);
    expect(snapshot.npcs[0][AUTHORED_MARKER_KEY]).toBe(true);
  });
});

describe('characterEdit — the chart stays OUT of the prose registry', () => {
  test('`character` is not an EDITABLE_FIELDS path, and admitting it must red HERE first', () => {
    // Three consumers depend on that registry being prose-shaped: the pending-edit
    // queue compares values with `===` (reference equality on an object, so its
    // no-effect and idempotence gates would be permanently false), and
    // walkUserEdits feeds the AI's PROSE grounding payload.
    expect(isEditablePath('npc', AUTHORED_CHART_KEY)).toBe(false);
    // ⚠ ANCHORED BY A LIVE SIBLING. A bare absence here is TRUE both when the chart key is
    // correctly kept out and when the npc roster was emptied or re-keyed out from under the
    // test — and the second reading is the regression this arm exists to catch. `personality`
    // is a prose path on the same roster and would vanish under the same drift.
    expectAbsentWithAnchor(
      EDITABLE_FIELDS.npc, AUTHORED_CHART_KEY, 'personality', 'EDITABLE_FIELDS.npc',
    );
    for (const [type, paths] of Object.entries(EDITABLE_FIELDS)) {
      expect(paths.length, `${type} has no editable paths at all`).toBeGreaterThan(0);
      // anchored: the line above proves THIS entry is live and populated on every iteration, so the absence below cannot pass on an emptied roster
      expect(paths).not.toContain(AUTHORED_CHART_KEY);
    }
  });

  test('the writer does NOT stamp `_userEdits` — the marker is the whole cost', () => {
    const result = writeAuthoredChart({ id: 'npc_3' }, CHART);
    expect(/** @type {Record<string, unknown>} */ (result.npc)._userEdits).toBeUndefined();
  });

  test('the reconcile seam names the unlanded reader and does not import it', () => {
    expect(CHART_WRITER_SEAM.readerSymbol).toBe('authoredCharacterOf');
    expect(CHART_WRITER_SEAM.readerLanded).toBe(false);
    expect(CHART_WRITER_SEAM.writerSymbol).toBe('writeAuthoredChart');
    expect(CHART_EDIT_PROVENANCE.signedBy).toBeNull();
    expect(CHART_EDIT_PROVENANCE.ownerRows.length).toBeGreaterThan(0);
  });
});

describe('characterEditView — the whole chart, with a read-only ghost', () => {
  const npc = writeAuthoredChart({ id: 'npc_3', name: 'Cass Rell' }, CHART).npc;
  //  candour +3 (virtue defining), greed -2 (vice marked)
  const drift = { greed: { offset: -1, updatedTick: 4 }, mercy: { offset: 2, updatedTick: 5 } };

  test('the spectrum ladder is the authored vocabulary, derived not re-authored', () => {
    expect(SPECTRUM_RUNGS.map((r) => r.value)).toEqual([-3, -2, -1, 0, 1, 2, 3]);
    expect(SPECTRUM_RUNGS[0]).toEqual({ pole: 'vice', level: AXIS_LEVELS[AXIS_LEVELS.length - 1], value: -SPECTRUM_HALF_SPAN });
    expect(SPECTRUM_RUNGS[SPECTRUM_RUNGS.length - 1]).toEqual({ pole: 'virtue', level: 'defining', value: SPECTRUM_HALF_SPAN });
    expect(SPECTRUM_RUNGS[AXIS_LEVELS.length]).toBe(NEUTRAL_POSITION_CELL);
    expect(NEUTRAL_POSITION_CELL.value).toBe(NEUTRAL_POSITION);
  });

  test('⭐ WITH A ROSTER the chart is WHOLE — every axis gets a row, most at neutral', () => {
    const model = editChartModel({ npc, drift, axes: ROSTER });
    expect(model.whole).toBe(true);
    expect(model.rows.map((r) => r.axisId)).toEqual(['candour', 'greed', 'mercy', 'nerve']);
    // `nerve` is the axis nobody has touched: it MUST still have a row, or the
    // user can never author a new position on it.
    const nerve = model.rows.find((r) => r.axisId === 'nerve');
    expect(nerve).toMatchObject({ neutral: true, drifted: false, displaced: false });
    expect(nerve?.core).toBe(NEUTRAL_POSITION_CELL);
    expect(model.rows.filter((r) => r.neutral).map((r) => r.axisId)).toEqual(['mercy', 'nerve']);
  });

  test('WITHOUT a roster the model says so rather than pretending', () => {
    const model = editChartModel({ npc, drift });
    expect(model.whole).toBe(false);
    // the UNION: what the soul holds, plus what a life moved. `mercy` has no
    // authored cell at all — a chart-only walk would leave its ghost nowhere to stand.
    expect(model.rows.map((r) => r.axisId)).toEqual(['candour', 'greed', 'mercy']);
  });

  test('the ghost stands where the drift put it, beside an UNMOVED anchor', () => {
    const rows = editChartRows({ npc, drift, axes: ROSTER });
    const byId = Object.fromEntries(rows.map((r) => [r.axisId, r]));

    // greed: authored `vice marked` (-2), drifted -1 ⇒ effective -3 = vice defining
    expect(byId.greed.core).toEqual({ pole: 'vice', level: 'marked', value: -2 });
    expect(byId.greed.ghost).toEqual({ pole: 'vice', level: 'defining', value: -3 });
    expect(byId.greed).toMatchObject({ offset: -1, drifted: true, displaced: true, neutral: false });

    // mercy: NO authored position, drifted +2 ⇒ the ghost stands on an empty anchor
    expect(byId.mercy.core).toBe(NEUTRAL_POSITION_CELL);
    expect(byId.mercy.ghost).toEqual({ pole: 'virtue', level: 'marked', value: 2 });
    expect(byId.mercy).toMatchObject({ drifted: true, displaced: true, neutral: true });

    // candour: authored, undrifted ⇒ ghost sits ON the anchor and is NOT displaced
    expect(byId.candour.ghost).toEqual(byId.candour.core);
    expect(byId.candour).toMatchObject({ offset: 0, drifted: false, displaced: false });

    // AND THE AUTHORED CORE NEVER MOVED — the ghost is a second reading, not an edit.
    expect(storedChartOf(npc)).toEqual(CHART);
  });

  test('DISPLACED IS A BAND COMPARISON: a sub-band offset drifts without displacing', () => {
    const rows = editChartRows({ npc, drift: { candour: { offset: 0.25, updatedTick: 9 } }, axes: ROSTER });
    const candour = rows.find((r) => r.axisId === 'candour');
    expect(candour).toMatchObject({ drifted: true, displaced: false, offset: 0.25 });
    expect(candour?.ghost).toEqual(candour?.core);
  });

  test('§7 "Gods: same chart, no ghost" — the ghost half is absent, not blank', () => {
    const model = editChartModel({ npc, drift, axes: ROSTER, ghost: false });
    expect(model.rows.every((r) => r.ghost === null)).toBe(true);
    expect(model.ghostVisible).toBe(false);
    expect(model.displacedAxisIds).toEqual([]);
    // the drift is still REPORTED — the god's chart just does not draw it
    expect(model.driftedAxisIds).toEqual(['greed', 'mercy']);
    // and the rows are the same rows
    expect(model.rows.map((r) => r.axisId)).toEqual(['candour', 'greed', 'mercy', 'nerve']);
  });

  test('THE GHOST IS READ-ONLY BY CONSTRUCTION — the model exposes no writer at all', () => {
    const model = editChartModel({ npc, drift, axes: ROSTER });
    expect(Object.isFrozen(model)).toBe(true);
    expect(Object.isFrozen(model.rows)).toBe(true);
    expect(model.rows.every((r) => Object.isFrozen(r) && Object.isFrozen(r.core))).toBe(true);
    // No row carries a function of any kind. A surface that wanted to let the user
    // drag the ghost would have to invent a write path this module does not give it.
    for (const row of model.rows) {
      for (const value of Object.values(row)) expect(typeof value).not.toBe('function');
    }
  });

  test('`authored` and `ghostVisible` are DIFFERENT questions', () => {
    // a soul the user never wrote on, whom a life taught something anyway
    const untouched = editChartModel({ npc: { id: 'npc_9' }, drift: { mercy: { offset: 2 } }, axes: ROSTER });
    expect(untouched.authored).toBe(false);
    expect(untouched.ghostVisible).toBe(true);
    // and a soul the user wrote on whom nothing has yet taught
    const fresh = editChartModel({ npc, drift: null, axes: ROSTER });
    expect(fresh.authored).toBe(true);
    expect(fresh.ghostVisible).toBe(false);
  });

  test('every pole the wall admits is a pole the ladder can draw', () => {
    expect([...new Set(SPECTRUM_RUNGS.map((r) => r.pole).filter(Boolean))].sort())
      .toEqual([...AXIS_POLES].sort());
  });
});
