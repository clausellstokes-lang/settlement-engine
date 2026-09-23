/** @vitest-environment jsdom */
/**
 * editFields.test.jsx — EM-D0d's eight arms over the editor's two PURE input
 * controls, `PoolField` and `FreeField`.
 *
 * Seven of the eight are the packet's acceptance cases A1 to A7. The eighth is the
 * ANTI-VACUITY arm (§9a item 2): it convicts a roll affordance wired to nothing, and
 * a markup query that found nothing in either state.
 *
 * ⭐ WRITTEN AND RUN BEFORE EITHER LEAF EXISTED (§8 step 2). With the two leaves
 * absent this file cannot even collect, so no arm here was ever green before its
 * subject was built. The gate batch re-proves it by PLANT-AND-RESTORE.
 *
 * ⛔ TWO ARMS ARE POSITIVE SET EQUALITIES RATHER THAN BARE NEGATIVES (§9a item 3).
 * A4(b) collects every draw and clock reading in both leaves and asserts the list
 * EQUALS the empty set, with the scanner driven over a control source in the same
 * arm so an equality against nothing cannot read as agreement; A7 does the same for
 * the copy keys. Neither owes an `// anchored:` marker, because neither is a bare
 * `not.toContain` / `not.toMatch` / `not.toHaveProperty`.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

import PoolField from '../../src/components/edit/PoolField.jsx';
import FreeField from '../../src/components/edit/FreeField.jsx';
import { declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { en } from '../../src/copy/en.js';
import { t } from '../../src/copy/index.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** The two leaves, read as SOURCE for the two positive scans. */
const LEAF_PATHS = [
  'src/components/edit/PoolField.jsx',
  'src/components/edit/FreeField.jsx',
];
const LEAF_SOURCES = LEAF_PATHS.map((rel) => readFileSync(join(ROOT, rel), 'utf8'));

/**
 * §6.3's five keys, and the only strings either leaf may render.
 *
 * ⭐ A SIXTH ROW (EM-D2b, U7b). `FreeField` now says the font-coverage report as a
 * SENTENCE rather than as bare glyphs, through the landed key `edit.field.uncovered`,
 * and this is the row that admits it: the set equality below is exact in both
 * directions, so the leaf could not have started rendering it without this line, and
 * this line reds the day the leaf stops. The key lands in the commit that makes the
 * leaf read it, which is the whole of the rule EM-D2's own header recorded.
 */
const DECLARED_KEYS = [
  'edit.field.emptyOption',
  'edit.field.limit',
  'edit.field.noOptions',
  'edit.field.rollAnother',
  'edit.field.rollUnavailable',
  'edit.field.uncovered',
];

/** Every literal first argument of a `t(` call in one source. */
const copyKeysIn = (src) => [...src.matchAll(/\bt\(\s*'([^']+)'/g)].map((m) => m[1]);

/** Every random draw and every clock reading in one source. */
const DRAW_PATTERN = /new Date|Math\.[A-Za-z]+|Date\.[A-Za-z]+/g;
const drawsIn = (src) => [...src.matchAll(DRAW_PATTERN)].map((m) => m[0]);

/**
 * The scanner's liveness control, built in the test body so it can never go stale:
 * a source that really does draw and really does read a clock.
 */
const DRAWING_CONTROL = 'const a = new Date(); const b = Math.random(); const c = Date.now();';

const EM_DASH = '—';
const BANG = '!';

/** EM-A1's REAL rows, read from the landed table and never retyped. */
const NPC_ROWS = declarationsFor('npc');
const ROLE_DECL = NPC_ROWS.find((row) => row.field === 'role');
const NAME_DECL = NPC_ROWS.find((row) => row.field === 'name');
const NOTE_DECL = NPC_ROWS.find((row) => row.field === 'note');

/** Deliberately UNSORTED, so "the array's own order, never sorted" is provable. */
const OPTIONS = ['Reeve', 'Miller', 'Smith'];

/** All three empty spellings A3 names. */
const EMPTY_SPELLINGS = ['', undefined, null];

/**
 * A PURE injected roller: a function of its three arguments and of nothing else, so
 * A4's determinism is a property of the control rather than of a stubbed random.
 */
const rollOf = (seed, entryId, n) => OPTIONS[(seed.length + entryId.length + n) % OPTIONS.length];

const selectOf = (container) => container.querySelector('select');
const labelOf = (container) => container.querySelector('label');
/** The label's own visible text, which the control it NESTS never contributes to. */
const labelTextOf = (container) => container.querySelector('label span').textContent;
const buttonOf = (container) => container.querySelector('button');
const optionsOf = (container) => [...container.querySelectorAll('option')];
const optionTexts = (container) => optionsOf(container).map((o) => o.textContent);
const optionValues = (container) => optionsOf(container).map((o) => o.value);

/** The markup with React's generated id collapsed, so two mounts compare on CONTENT. */
function normalizedMarkup(container) {
  const generated = labelOf(container).getAttribute('for');
  return container.innerHTML.split(generated).join('GENERATED_ID');
}

describe('EM-D0d: the editor two pure input controls', () => {
  afterEach(() => cleanup());

  it('A1: a non-empty pool renders a selectable control in the array order, named by its declaration, and reports one change', () => {
    const changes = [];
    const { container } = render(
      <PoolField
        declaration={ROLE_DECL}
        options={OPTIONS}
        value=""
        onChange={(next) => changes.push(next)}
        seed="seed-a"
        entryId="npc-1"
        roll={rollOf}
      />,
    );
    const select = selectOf(container);
    const label = labelOf(container);
    expect(labelTextOf(container)).toBe(ROLE_DECL.label);
    expect(label.getAttribute('for')).toBe(select.getAttribute('id'));
    expect(label.contains(select)).toBe(true);
    expect(select.disabled).toBe(false);
    expect(optionValues(container)).toEqual(['', ...OPTIONS]);
    expect(optionTexts(container)).toEqual([t('edit.field.emptyOption'), ...OPTIONS]);
    fireEvent.change(select, { target: { value: 'Miller' } });
    expect(changes).toEqual(['Miller']);
  });

  it('A2: an empty options array renders the select empty and disabled, never absent', () => {
    const changes = [];
    const { container } = render(
      <PoolField
        declaration={ROLE_DECL}
        options={[]}
        value=""
        onChange={(next) => changes.push(next)}
        seed="seed-a"
        entryId="npc-1"
        roll={rollOf}
      />,
    );
    const select = selectOf(container);
    const button = buttonOf(container);
    expect(Boolean(select)).toBe(true);
    expect(Boolean(button)).toBe(true);
    expect(select.disabled).toBe(true);
    expect(optionTexts(container)).toEqual([t('edit.field.noOptions')]);
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(changes).toEqual([]);
  });

  it('A3: an empty value with a non-empty pool renders shown-empty and ENABLED, for all three spellings', () => {
    const rows = [];
    for (const spelling of EMPTY_SPELLINGS) {
      const { container } = render(
        <PoolField
          declaration={ROLE_DECL}
          options={OPTIONS}
          value={spelling}
          onChange={() => {}}
          seed="seed-a"
          entryId="npc-1"
          roll={rollOf}
        />,
      );
      rows.push({
        disabled: selectOf(container).disabled,
        selected: selectOf(container).value,
        firstOptionText: optionTexts(container)[0],
        firstOptionDisabled: optionsOf(container)[0].disabled,
        optionCount: optionsOf(container).length,
      });
      cleanup();
    }
    const shownEmptyAndEnabled = {
      disabled: false,
      selected: '',
      firstOptionText: t('edit.field.emptyOption'),
      firstOptionDisabled: false,
      optionCount: OPTIONS.length + 1,
    };
    expect(rows).toEqual([shownEmptyAndEnabled, shownEmptyAndEnabled, shownEmptyAndEnabled]);
  });

  it('A4: the seeded roll is deterministic by repetition, and neither leaf draws a random number or reads a clock', () => {
    const first = [];
    const mountOne = render(
      <PoolField
        declaration={ROLE_DECL}
        options={OPTIONS}
        value=""
        onChange={(next) => first.push(next)}
        seed="seed-a"
        entryId="npc-1"
        roll={rollOf}
      />,
    );
    fireEvent.click(buttonOf(mountOne.container));
    cleanup();
    const second = [];
    const mountTwo = render(
      <PoolField
        declaration={ROLE_DECL}
        options={OPTIONS}
        value=""
        onChange={(next) => second.push(next)}
        seed="seed-a"
        entryId="npc-1"
        roll={rollOf}
      />,
    );
    fireEvent.click(buttonOf(mountTwo.container));
    expect(first).toEqual([rollOf('seed-a', 'npc-1', 1)]);
    expect(second).toEqual(first);
    expect(LEAF_SOURCES.map((src) => src.length > 0)).toEqual([true, true]);
    expect(drawsIn(DRAWING_CONTROL)).toEqual(['new Date', 'Math.random', 'Date.now']);
    expect(LEAF_SOURCES.flatMap(drawsIn)).toEqual([]);
  });

  it('A5: a null roll answer commits nothing and says so', () => {
    const changes = [];
    const { container } = render(
      <PoolField
        declaration={ROLE_DECL}
        options={OPTIONS}
        value="Miller"
        onChange={(next) => changes.push(next)}
        seed="seed-a"
        entryId="npc-1"
        roll={() => null}
      />,
    );
    const notice = t('edit.field.rollUnavailable');
    const before = { selected: selectOf(container).value, notice: container.textContent.includes(notice) };
    fireEvent.click(buttonOf(container));
    const after = { selected: selectOf(container).value, notice: container.textContent.includes(notice) };
    expect(changes).toEqual([]);
    expect(before).toEqual({ selected: 'Miller', notice: false });
    expect(after).toEqual({ selected: 'Miller', notice: true });
  });

  it('A6: maxLength is enforced and reported in the same render, for both free kinds', () => {
    const cascade = render(<FreeField declaration={NAME_DECL} value="" onChange={() => {}} />);
    const input = cascade.container.querySelector('input');
    const cascadeRow = { type: input.getAttribute('type'), max: input.maxLength };
    cleanup();
    const free = render(<FreeField declaration={NOTE_DECL} value="" onChange={() => {}} />);
    const area = free.container.querySelector('textarea');
    const freeRow = { tag: area.tagName.toLowerCase(), max: area.maxLength };
    cleanup();

    const atText = 'x'.repeat(NAME_DECL.maxLength);
    const at = render(<FreeField declaration={NAME_DECL} value={atText} onChange={() => {}} />);
    const atNotice = at.container.textContent.includes(
      t('edit.field.limit', { actual: atText.length, max: NAME_DECL.maxLength }),
    );
    cleanup();

    const overText = 'x'.repeat(NAME_DECL.maxLength + 5);
    const over = render(<FreeField declaration={NAME_DECL} value={overText} onChange={() => {}} />);
    const overNotice = over.container.textContent.includes(
      t('edit.field.limit', { actual: overText.length, max: NAME_DECL.maxLength }),
    );
    cleanup();

    const underText = 'x'.repeat(NAME_DECL.maxLength - 1);
    const under = render(<FreeField declaration={NAME_DECL} value={underText} onChange={() => {}} />);
    const underRow = {
      label: under.container.textContent.includes(NAME_DECL.label),
      notice: under.container.textContent.includes(
        t('edit.field.limit', { actual: underText.length, max: NAME_DECL.maxLength }),
      ),
    };

    expect(cascadeRow).toEqual({ type: 'text', max: NAME_DECL.maxLength });
    expect(freeRow).toEqual({ tag: 'textarea', max: NOTE_DECL.maxLength });
    expect(atNotice).toBe(true);
    expect(overNotice).toBe(true);
    expect(underRow).toEqual({ label: true, notice: false });
  });

  it('A7: every rendered string comes from en.js through t(), as a positive set equality', () => {
    const found = [...new Set(LEAF_SOURCES.flatMap(copyKeysIn))].sort();
    const resolved = found.map((key) => key.split('.').reduce(
      (branch, part) => (branch == null ? branch : branch[part]), en,
    ));
    expect(found).toEqual(DECLARED_KEYS);
    expect(resolved.map((value) => typeof value)).toEqual(found.map(() => 'string'));
    expect(resolved.map((value) => String(value).length > 0)).toEqual(found.map(() => true));
    expect(resolved.map((value, i) => value === found[i])).toEqual(found.map(() => false));
    expect(resolved.map((value) => String(value).includes(EM_DASH) || String(value).includes(BANG)))
      .toEqual(found.map(() => false));
  });

  it('A8: ANTI-VACUITY: a different seed reaches a different value, and a populated pool differs from an empty one', () => {
    const shortSeed = [];
    const mountOne = render(
      <PoolField
        declaration={ROLE_DECL}
        options={OPTIONS}
        value=""
        onChange={(next) => shortSeed.push(next)}
        seed="s"
        entryId="npc-1"
        roll={rollOf}
      />,
    );
    fireEvent.click(buttonOf(mountOne.container));
    const populated = normalizedMarkup(mountOne.container);
    cleanup();

    const longSeed = [];
    const mountTwo = render(
      <PoolField
        declaration={ROLE_DECL}
        options={OPTIONS}
        value=""
        onChange={(next) => longSeed.push(next)}
        seed="seed-long"
        entryId="npc-1"
        roll={rollOf}
      />,
    );
    fireEvent.click(buttonOf(mountTwo.container));
    cleanup();

    const mountThree = render(
      <PoolField
        declaration={ROLE_DECL}
        options={[]}
        value=""
        onChange={() => {}}
        seed="s"
        entryId="npc-1"
        roll={rollOf}
      />,
    );
    const empty = normalizedMarkup(mountThree.container);

    expect([shortSeed.length, longSeed.length]).toEqual([1, 1]);
    expect(shortSeed[0] === longSeed[0]).toBe(false);
    expect([populated.length > 0, empty.length > 0]).toEqual([true, true]);
    expect(populated === empty).toBe(false);
  });

  it('A9: with NO roller injected the affordance is refused at BOTH guards, the gate by behaviour and the belt by spelling', () => {
    const changes = [];
    const { container } = render(
      <PoolField
        declaration={ROLE_DECL}
        options={OPTIONS}
        value=""
        onChange={(next) => changes.push(next)}
        seed="seed-a"
        entryId="npc-1"
      />,
    );
    const select = selectOf(container);
    const button = buttonOf(container);

    // Anchored: this mount is LIVE — the pool is populated, the select is enabled and it
    // carries every member — so the button's refusal below measures the roller's absence
    // and not a field that failed to render.
    expect(select.disabled).toBe(false);
    expect(optionValues(container)).toEqual(['', ...OPTIONS]);

    // GUARD 1, THE GATE, by behaviour: the affordance is dead while `roll` is absent, and
    // a click commits nothing and shows no refusal notice.
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(changes).toEqual([]);
    expect(container.textContent.includes(t('edit.field.rollUnavailable'))).toBe(false);

    // GUARD 2, THE BELT, by spelling — and the spelling is the ONLY honest instrument here,
    // measured rather than assumed. React decides `onClick` dispatch from the element's own
    // React PROPS, not from the DOM attribute, so re-enabling the node
    // (`button.disabled = false`) does not reach the handler while the gate holds: the belt
    // has no reachable habitat through this surface until a caller re-enables the control
    // for itself, which is exactly the case the leaf's docblock keeps it for. Pinned the way
    // the sheet's focus-trap call is pinned in editorHalo.test.jsx.
    const poolSource = LEAF_SOURCES[LEAF_PATHS.indexOf('src/components/edit/PoolField.jsx')];
    expect(poolSource.length > 0).toBe(true);
    expect(poolSource).toContain("if (typeof roll !== 'function') return;");
  });

  it('A10: the select is CONTROLLED for all three empty spellings: a change the parent does not accept returns to empty', () => {
    const rows = [];
    for (const spelling of EMPTY_SPELLINGS) {
      const changes = [];
      const { container } = render(
        <PoolField
          declaration={ROLE_DECL}
          options={OPTIONS}
          value={spelling}
          onChange={(next) => changes.push(next)}
          seed="seed-a"
          entryId="npc-1"
          roll={rollOf}
        />,
      );
      const select = selectOf(container);
      const before = select.value;
      fireEvent.change(select, { target: { value: 'Miller' } });
      rows.push({ before, reported: changes, after: select.value });
      cleanup();
    }
    // A3 above reads `select.value` alone, which is the empty member for an UNCONTROLLED
    // select too. This reads the CONTROL: the parent kept its empty value, so the element
    // must come back to it. The '' row is the liveness control — it is controlled under
    // either spelling of the normalization — and the null and undefined rows are the pin.
    const controlled = { before: '', reported: ['Miller'], after: '' };
    expect(rows).toEqual([controlled, controlled, controlled]);
  });
});
