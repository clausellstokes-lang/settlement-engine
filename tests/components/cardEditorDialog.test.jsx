/** @vitest-environment jsdom */
/**
 * cardEditorDialog.test.jsx — EM-D0e's EIGHT arms over the first editor door,
 * `CardEditorDialog`.
 *
 * ⭐ WRITTEN AND RUN BEFORE THE LEAF EXISTED (§8 step 2). With the leaf absent this file
 * cannot even collect, so no arm here was ever green before its subject was built; the
 * gate batch re-proves it by PLANT-AND-RESTORE and quotes the count line.
 *
 * ⛔ EVERY WOULD-BE NEGATIVE IS SPELLED AS A POSITIVE EQUALITY (§6.6, §P6), so no
 * `// anchored:` marker is owed anywhere in this file: A3's purity arm, A4's draw scan
 * and A8's source scan are set equalities against the EMPTY set, each with its scanner
 * driven over a source that DOES contain a member in the same arm; A7's dark arm is
 * `toBe('')`; A6's stop is a call count.
 *
 * ⛔ NOTHING HERE RE-TYPES A PRODUCER'S ANSWER. The field list, the labels, the pool
 * members and the rolled value are read by CALLING `declarationsFor`, `poolValues` and
 * `rollFrom`; the refusal vocabulary is imported from EM-C4a's landed store leaf. A
 * fixture that mirrored a deriver could agree with a broken leaf by construction.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';

const viewport = vi.hoisted(() => ({ mobile: false }));
vi.mock('../../src/hooks/useIsMobile.js', () => ({
  default: () => viewport.mobile,
  getIsMobile: () => viewport.mobile,
}));

import CardEditorDialog, {
  REFUSAL_COPY_KEYS,
  REFUSAL_FALLBACK_KEY,
} from '../../src/components/edit/CardEditorDialog.jsx';
import { declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { poolValues, rollFrom } from '../../src/domain/edit/pools.js';
import { PLAIN_EDIT_REFUSALS } from '../../src/store/editSlice.js';
import { GOLD } from '../../src/components/theme.js';
import { t } from '../../src/copy/index.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const LEAF_REL = 'src/components/edit/CardEditorDialog.jsx';
const LEAF_SOURCE = readFileSync(join(ROOT, LEAF_REL), 'utf8');

/** EM-A1's REAL rows, read from the landed table and never retyped. */
const NPC_ROWS = declarationsFor('npc');
const FACTION_ROWS = declarationsFor('faction');

/** A world whose institutions roster answers `npc.role` with members. */
const WORLD = Object.freeze({
  institutions: [
    { role: 'Reeve', name: 'The Reeve' },
    { role: 'Miller', name: 'The Mill' },
  ],
});
/** A2's own fixture: a KNOWN pool whose read yields no member. */
const EMPTY_WORLD = Object.freeze({ institutions: [] });

const SEED = 'seed-em-d0e';
const ENTRY = 'npc_3';

/** The scanners' liveness controls, built in the body so neither can go stale. */
const DRAWING_CONTROL = 'const a = new Date(); const b = Math.random(); const c = Date.now();';
const FORBIDDEN_CONTROL = "import { makeOp } from '../../domain/edit/operations.js'; TIER_GATE.premium.settlementEditor;";
const MUTATING_CONTROL = 'const shown = [...pool].sort(); const cut = shown.filter(Boolean); cut.splice(0, 1);';

/** Every random draw and every clock reading in one source. */
const drawsIn = (src) => [...src.matchAll(/new Date|Math\.[A-Za-z]+|Date\.[A-Za-z]+|performance\.[A-Za-z]+|crypto\./g)].map((m) => m[0]);
/**
 * Every raw spelling of the ONE seam predicate in a source, in source order. A6's belt is
 * checked TWICE in the leaf — at the Save control's disabled state and as the handler's first
 * statement — and THIS is the only channel that can see the second one: react-dom's
 * `getListener` returns null for `onClick` on a `<button>` whose REACT PROPS carry
 * `disabled`, so a click fired at a DOM-re-enabled control never reaches the handler. The
 * rendered half of the belt below still pins that nothing is dispatched and nothing is
 * refused; the pair below is what convicts a dropped guard.
 */
const guardsIn = (src) => [...src.matchAll(/typeof apply [=!]== 'function'/g)].map((m) => m[0]);
const GUARD_CONTROL = "const ok = typeof apply === 'function'; if (ok) return;";

/** Every mutation of an options array in one source. */
const mutatorsIn = (src) => [...src.matchAll(/\.sort\(|\.filter\(|\.splice\(/g)].map((m) => m[0]);
/** Every forbidden name in one source: a mutation module, a store or command address, a gate. */
const FORBIDDEN_NAMES = [
  'set-npc-name', 'rename-npc', 'makeOp', 'applyEdit', 'OP_TYPES',
  'src/store/', 'src/application/', 'EDITOR_GROUND', 'houseBloom',
  'TIER_GATE', 'settlementEditor',
];
const forbiddenIn = (src) => FORBIDDEN_NAMES.filter((name) => src.includes(name));

const labelsOf = (c) => [...c.querySelectorAll('label span')].map((n) => n.textContent);
const controlsOf = (c) => [...c.querySelectorAll('label')].map((l) => {
  const el = l.querySelector('input, select, textarea');
  return el === null ? 'none' : el.tagName.toLowerCase();
});
const fieldAt = (c, index) => [...c.querySelectorAll('label')][index].querySelector('input, select, textarea');
const optionsOf = (el) => [...el.querySelectorAll('option')].map((o) => o.value);
const rollButtonAt = (c, index) => [...c.querySelectorAll('button')]
  .filter((b) => b.textContent === t('edit.field.rollAnother'))[index];
const saveButtonOf = (c) => [...c.querySelectorAll('button')]
  .filter((b) => b.textContent === t('edit.dialog.save'))[0];
const closersOf = (c) => [...c.querySelectorAll('[aria-label]')]
  .filter((n) => n.getAttribute('aria-label').includes('Close'));

/** The expectation routed through the SAME CSS parser the assertion reads from. */
const cssValue = (prop, value) => {
  const probe = document.createElement('div');
  probe.style[prop] = value;
  return probe.style[prop];
};

const dialogOf = (props) => (
  <CardEditorDialog
    open
    cardType="npc"
    entityId={ENTRY}
    values={{}}
    world={WORLD}
    seed={SEED}
    phase="draft"
    onClose={() => {}}
    {...props}
  />
);

describe('EM-D0e: the first editor door, generated from the declaration table', () => {
  afterEach(() => {
    viewport.mobile = false;
    cleanup();
  });

  it('A1: the controls are GENERATED from the table in authored order, and an undeclared kind renders nothing at all', () => {
    const npc = render(dialogOf({}));
    const npcRow = {
      count: labelsOf(npc.container).length,
      labels: labelsOf(npc.container),
      controls: controlsOf(npc.container),
    };
    cleanup();
    const faction = render(dialogOf({ cardType: 'faction' }));
    const factionRow = {
      count: labelsOf(faction.container).length,
      labels: labelsOf(faction.container),
      controls: controlsOf(faction.container),
    };

    expect(npcRow).toEqual({
      count: NPC_ROWS.length,
      labels: NPC_ROWS.map((row) => row.label),
      controls: ['input', 'select', 'select', 'textarea'],
    });
    expect(FACTION_ROWS.map((row) => row.kind)).toEqual(['free-cascade', 'pool', 'share']);
    expect(factionRow).toEqual({
      count: 2,
      labels: FACTION_ROWS.filter((row) => row.kind !== 'share').map((row) => row.label),
      controls: ['input', 'select'],
    });
  });

  it('A2: the two empties are different and BOTH are shown: an empty pool is present and DISABLED, an empty value present and ENABLED', () => {
    const { container } = render(dialogOf({ world: EMPTY_WORLD }));
    const role = fieldAt(container, 1);
    const name = fieldAt(container, 0);

    expect(poolValues('npc.role', EMPTY_WORLD).length).toBe(0);
    expect({
      rolePresent: role.tagName.toLowerCase(),
      roleValue: role.value,
      roleDisabled: role.disabled,
      roleOption: [...role.querySelectorAll('option')].map((o) => o.textContent),
      namePresent: name.tagName.toLowerCase(),
      nameValue: name.value,
      nameDisabled: name.disabled,
    }).toEqual({
      rolePresent: 'select',
      roleValue: '',
      roleDisabled: true,
      roleOption: [t('edit.field.noOptions')],
      namePresent: 'input',
      nameValue: '',
      nameDisabled: false,
    });
  });

  it('A3: an OFF-LIST stored value is PREPENDED and re-selectable, the pool keeps its producer order, and the leaf mutates no options array', () => {
    const pool = poolValues('npc.status', WORLD);
    const offList = 'Nightwarden of the Old Ford';
    const { container } = render(dialogOf({ values: { status: offList } }));
    const status = fieldAt(container, 2);

    expect(pool.includes(offList)).toBe(false);
    expect(pool.length > 0).toBe(true);
    expect(status.value).toBe(offList);
    expect(optionsOf(status)).toEqual(['', offList, ...pool]);
    expect(mutatorsIn(MUTATING_CONTROL)).toEqual(['.sort(', '.filter(', '.splice(']);
    expect(mutatorsIn(LEAF_SOURCE)).toEqual([]);
  });

  it('A4: the seeded roll is the PRODUCERS, reproducible across mounts, and the leaf draws no random number and reads no clock', () => {
    const first = render(dialogOf({}));
    fireEvent.click(rollButtonAt(first.container, 0));
    const firstValue = fieldAt(first.container, 1).value;
    cleanup();
    const second = render(dialogOf({}));
    fireEvent.click(rollButtonAt(second.container, 0));
    const secondValue = fieldAt(second.container, 1).value;

    expect(firstValue).toBe(rollFrom('npc.role', WORLD, SEED, ENTRY, 1));
    expect(secondValue).toBe(firstValue);
    expect(LEAF_SOURCE.length > 0).toBe(true);
    expect(drawsIn(DRAWING_CONTROL)).toEqual(['new Date', 'Math.random', 'Date.now']);
    expect(drawsIn(LEAF_SOURCE)).toEqual([]);
  });

  it('A5: the refusal set is EM-C4as closed seven in both directions, every line resolves, and an unknown word takes the ONE fallback', async () => {
    const declared = Object.keys(REFUSAL_COPY_KEYS).slice().sort();
    const landed = [...PLAIN_EDIT_REFUSALS].sort();
    const resolved = Object.values(REFUSAL_COPY_KEYS).map((key) => t(key, { field: 'Role' }));

    const { container } = render(dialogOf({
      values: { role: 'Reeve' },
      apply: async () => ({ ok: false, reason: 'no_verb' }),
    }));
    fireEvent.change(fieldAt(container, 1), { target: { value: 'Miller' } });
    await act(async () => { fireEvent.click(saveButtonOf(container)); });

    expect(declared).toEqual(landed);
    expect(resolved.map((line) => typeof line)).toEqual(declared.map(() => 'string'));
    expect(resolved.map((line, i) => line === Object.values(REFUSAL_COPY_KEYS)[i])).toEqual(declared.map(() => false));
    expect(landed.includes('no_verb')).toBe(false);
    expect(container.textContent.includes(t(REFUSAL_FALLBACK_KEY, { field: 'Role' }))).toBe(true);
  });

  it('A6: ONE call per CHANGED field in authored order, the right coordinates, the stop at the first refusal, and the belt when the seam is absent', async () => {
    const calls = [];
    const ok = render(dialogOf({
      values: { name: 'Mara', role: 'Reeve' },
      apply: async (edit) => { calls.push(edit); return { ok: true }; },
    }));
    fireEvent.change(fieldAt(ok.container, 1), { target: { value: 'Miller' } });
    fireEvent.change(fieldAt(ok.container, 0), { target: { value: 'Tamsin' } });
    await act(async () => { fireEvent.click(saveButtonOf(ok.container)); });
    cleanup();

    const refused = [];
    const stop = render(dialogOf({
      values: { name: 'Mara', role: 'Reeve' },
      apply: async (edit) => { refused.push(edit); return { ok: false, reason: 'canon_locked' }; },
    }));
    fireEvent.change(fieldAt(stop.container, 1), { target: { value: 'Miller' } });
    fireEvent.change(fieldAt(stop.container, 0), { target: { value: 'Tamsin' } });
    await act(async () => { fireEvent.click(saveButtonOf(stop.container)); });
    const noticeShown = stop.container.textContent.includes(
      t(REFUSAL_COPY_KEYS.canon_locked, { field: NPC_ROWS[0].label }),
    );
    cleanup();

    const belt = [];
    const closes = [];
    const bare = render(dialogOf({
      values: { name: 'Mara' }, apply: null, onClose: () => closes.push('closed'),
    }));
    fireEvent.change(fieldAt(bare.container, 0), { target: { value: 'Tamsin' } });
    const save = saveButtonOf(bare.container);
    const wasDisabled = save.disabled;
    save.removeAttribute('disabled');
    await act(async () => { fireEvent.click(save); });
    // With the guard gone the handler would reach `await apply(...)` on a null seam, the catch
    // would take the fallback line, and THIS would be true: the notice is what tells a returned
    // handler apart from a handler that ran and was rescued.
    const beltNotice = bare.container.textContent.includes(
      t(REFUSAL_FALLBACK_KEY, { field: NPC_ROWS[0].label }),
    );
    cleanup();

    // THE BELT'S COUNTERFORCE, in the same arm: the IDENTICAL interaction with a real seam
    // dispatches once and closes the door, so the two empty lists above are the guard's
    // doing and not an interaction that never happened.
    const liveCloses = [];
    const live = render(dialogOf({
      values: { name: 'Mara' },
      apply: async (edit) => { belt.push(edit); return { ok: true }; },
      onClose: () => liveCloses.push('closed'),
    }));
    fireEvent.change(fieldAt(live.container, 0), { target: { value: 'Tamsin' } });
    await act(async () => { fireEvent.click(saveButtonOf(live.container)); });

    expect(calls).toEqual([
      { cardType: 'npc', entityId: ENTRY, field: 'name', value: 'Tamsin' },
      { cardType: 'npc', entityId: ENTRY, field: 'role', value: 'Miller' },
    ]);
    expect(calls.map((edit) => Object.keys(edit).sort())).toEqual([
      ['cardType', 'entityId', 'field', 'value'],
      ['cardType', 'entityId', 'field', 'value'],
    ]);
    expect(refused).toEqual([{ cardType: 'npc', entityId: ENTRY, field: 'name', value: 'Tamsin' }]);
    expect(noticeShown).toBe(true);
    expect(wasDisabled).toBe(true);
    expect(closes).toEqual([]);
    expect(beltNotice).toBe(false);
    expect(guardsIn(GUARD_CONTROL)).toEqual(["typeof apply === 'function'"]);
    expect(guardsIn(LEAF_SOURCE)).toEqual([
      "typeof apply === 'function'",
      "typeof apply !== 'function'",
    ]);
    expect(belt).toEqual([{ cardType: 'npc', entityId: ENTRY, field: 'name', value: 'Tamsin' }]);
    expect(liveCloses).toEqual(['closed']);
  });

  it('A7: DARK and CANON: closed renders the empty string, an undeclared card renders the empty string, and canon disables every control and dispatches nothing', async () => {
    const closed = render(dialogOf({ open: false }));
    const closedMarkup = closed.container.innerHTML;
    cleanup();
    const undeclared = render(dialogOf({ cardType: 'sheriff' }));
    const undeclaredMarkup = undeclared.container.innerHTML;
    cleanup();

    const calls = [];
    const canon = render(dialogOf({
      phase: 'canon',
      values: { name: 'Mara' },
      apply: async (edit) => { calls.push(edit); return { ok: true }; },
    }));
    const disabled = [...canon.container.querySelectorAll('input, select, textarea')].map((el) => el.disabled);
    const canonLine = canon.container.textContent.includes(t('edit.dialog.canonNotice'));
    await act(async () => { fireEvent.click(saveButtonOf(canon.container)); });
    const live = render(dialogOf({}));

    expect(closedMarkup).toBe('');
    expect(undeclaredMarkup).toBe('');
    expect(disabled).toEqual([true, true, true, true]);
    expect(canonLine).toBe(true);
    expect(calls).toEqual([]);
    expect(labelsOf(live.container).length).toBe(NPC_ROWS.length);
  });

  it('A8: the TWO doors carry the §934.31 door and the halo, and the leafs own bytes name no mutation module, no store and no gate', () => {
    const desktop = render(dialogOf({}));
    const popup = desktop.container.querySelector('[role="dialog"]');
    const desktopRow = {
      dialog: popup !== null,
      ariaModal: popup.getAttribute('aria-modal'),
      closers: closersOf(desktop.container).length,
      rim: popup.style.border,
    };
    cleanup();

    viewport.mobile = true;
    const phone = render(dialogOf({}));
    const trigger = [...phone.container.querySelectorAll('button')]
      .filter((b) => b.textContent === t('edit.dialog.open'))[0];
    const beforeOpen = phone.container.querySelector('[role="dialog"]');
    fireEvent.click(trigger);
    const sheet = phone.container.querySelector('[role="dialog"]');
    const phoneRow = {
      trigger: trigger !== undefined,
      closedFirst: beforeOpen === null,
      dialog: sheet !== null,
      ariaModal: sheet.getAttribute('aria-modal'),
      rim: sheet.style.borderTop,
      fields: labelsOf(phone.container).length,
    };

    expect(desktopRow).toEqual({
      dialog: true,
      ariaModal: 'true',
      closers: 1,
      rim: cssValue('border', `1px solid ${GOLD}`),
    });
    expect(phoneRow).toEqual({
      trigger: true,
      closedFirst: true,
      dialog: true,
      ariaModal: 'true',
      rim: cssValue('borderTop', `1px solid ${GOLD}`),
      fields: NPC_ROWS.length,
    });
    expect(forbiddenIn(FORBIDDEN_CONTROL)).toEqual(['makeOp', 'TIER_GATE', 'settlementEditor']);
    expect(forbiddenIn(LEAF_SOURCE)).toEqual([]);
  });
});
