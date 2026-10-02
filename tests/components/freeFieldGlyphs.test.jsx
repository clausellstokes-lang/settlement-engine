/** @vitest-environment jsdom */
/**
 * freeFieldGlyphs.test.jsx — EM-D2's arms over FreeField's SECOND report: the
 * characters the printed dossier's eight embedded faces cannot draw.
 *
 * ⛔ THE BASENAME CARRIES NO INVARIANT WORD, for the same reason fontCmap.test.js's
 * does not: `NAME_PATTERN` in tests/lint/mutationCoverage.shared.mjs would enrol a
 * `*Coverage.test.jsx` into the mutation-coverage spine and demand a register row
 * from it. These five arms mount one leaf; they enumerate no invariant.
 *
 * ⭐ A NEW FILE RATHER THAN A WIDENING, and the reason is ownership, not taste.
 * FreeField's governing suite is tests/components/editFields.test.jsx, whose A7 pins the
 * two leaves' copy keys to an EXACT five-key set; tests/components/cardEditorDialog.test.jsx
 * is the DIALOG's suite and never mounts a field at all. Neither is in this member's
 * file manifest, so the coverage arms land in a file the member owns outright and
 * A7 keeps its meaning: this leaf still mints no copy key.
 *
 * ⛔ THE LAW UNDER TEST IS "REPORTED, NEVER SILENT" AND ALSO ITS OTHER HALF: NEVER
 * CLAMPED. Three of the five arms below exist only to prove the text came through
 * untouched -- the value the parent holds, the change it hears, and the markup with the
 * check absent -- because a coverage feature that quietly dropped a character would
 * satisfy "no bad glyph reaches the PDF" while destroying the DM's writing.
 *
 * ⚠ D5 IS THE ONLY ARM THAT TOUCHES DISK, and deliberately: it drives the REAL reader
 * over the REAL eight TTFs into the REAL control, so the four synthetic arms above it
 * cannot all be agreeing with a fixture. The characters are named by code point rather
 * than pasted, so nothing here depends on this file's own encoding.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

import FreeField from '../../src/components/edit/FreeField.jsx';
import { declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import {
  EMBEDDED_FACES, coverageOf, familyCoverage,
} from '../../src/pdf/lib/fontCoverage.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FONT_DIR = join(ROOT, 'public', 'fonts');

/** EM-A1's REAL rows, read from the landed table and never retyped. */
const NOTE_DECL = declarationsFor('npc').find((row) => row.field === 'note');

const ARROW = String.fromCodePoint(0x2192);
const WARNING = String.fromCodePoint(0x26a0);
const GRINNING = String.fromCodePoint(0x1f600);

/**
 * A PURE injected reporter over a named deny-set: a function of its argument and of
 * nothing else, so these arms measure the CONTROL rather than a stubbed font read.
 */
const reporterFor = (bad) => (text) => {
  const out = [];
  let index = 0;
  for (const char of text) {
    if (bad.includes(char)) out.push({ char, codePoint: char.codePointAt(0), index });
    index += char.length;
  }
  return out;
};

const noteOf = (container) => container.querySelector('[data-uncovered]');
const areaOf = (container) => container.querySelector('textarea');

/** The markup with React's generated id collapsed, so two mounts compare on CONTENT. */
function normalizedMarkup(container) {
  const generated = container.querySelector('label').getAttribute('for');
  return container.innerHTML.split(generated).join('GENERATED_ID');
}

describe('EM-D2: FreeField reports the characters the dossier cannot print', () => {
  afterEach(() => cleanup());

  it('D1: the note names every DISTINCT uncovered character, in the DM order, and the text is whole', () => {
    const text = `a${WARNING}b${ARROW}c${WARNING}d`;
    const { container } = render(
      <FreeField
        declaration={NOTE_DECL}
        value={text}
        onChange={() => {}}
        coverage={reporterFor([WARNING, ARROW])}
      />,
    );
    const note = noteOf(container);
    expect(Boolean(note)).toBe(true);
    // FIRST-APPEARANCE ORDER, deduped: the warning sign is typed twice and named once,
    // and the arrow keeps its place behind it.
    expect(note.getAttribute('data-uncovered')).toBe(`${WARNING} ${ARROW}`);
    expect(note.textContent).toBe(`${WARNING} ${ARROW}`);
    // THE CONTROL STILL HOLDS THE DM'S TEXT, byte for byte, both bad characters included.
    expect(areaOf(container).value).toBe(text);
  });

  it('D2: with no coverage function the field is EXACTLY what it was before this member', () => {
    const text = `a${WARNING}b`;
    const bare = render(<FreeField declaration={NOTE_DECL} value={text} onChange={() => {}} />);
    const bareMarkup = normalizedMarkup(bare.container);
    const bareNote = noteOf(bare.container);
    cleanup();

    const checked = render(
      <FreeField
        declaration={NOTE_DECL}
        value={text}
        onChange={() => {}}
        coverage={reporterFor([WARNING])}
      />,
    );
    const checkedMarkup = normalizedMarkup(checked.container);

    expect(bareNote).toBe(null);
    // The two mounts differ ONLY by the note, so the absence above is the prop's doing
    // and not a render that failed: same declaration, same value, same everything else.
    expect(bareMarkup.length > 0).toBe(true);
    expect(checkedMarkup === bareMarkup).toBe(false);
    expect(checkedMarkup.startsWith(bareMarkup.slice(0, bareMarkup.lastIndexOf('</div>')))).toBe(true);
  });

  it('D3: a fully covered text draws no note, so the note measures the CHARACTERS and not the mount', () => {
    const check = reporterFor([WARNING, ARROW]);
    const clean = render(
      <FreeField declaration={NOTE_DECL} value="A quiet reeve." onChange={() => {}} coverage={check} />,
    );
    const cleanNote = noteOf(clean.container);
    cleanup();
    // The SAME reporter over a text that does carry one: one mount silent, one loud.
    const spoiled = render(
      <FreeField declaration={NOTE_DECL} value={`A quiet reeve${ARROW}`} onChange={() => {}} coverage={check} />,
    );
    const spoiledNote = noteOf(spoiled.container);
    expect(cleanNote).toBe(null);
    expect(Boolean(spoiledNote)).toBe(true);
    expect(spoiledNote.textContent).toBe(ARROW);
  });

  it('D4: the check NEVER CLAMPS: every change the parent hears is byte-identical with and without it', () => {
    const typed = `${WARNING}keep me${ARROW}`;
    const heardBare = [];
    const bare = render(
      <FreeField declaration={NOTE_DECL} value="" onChange={(next) => heardBare.push(next)} />,
    );
    fireEvent.change(areaOf(bare.container), { target: { value: typed } });
    cleanup();

    const heardChecked = [];
    const checked = render(
      <FreeField
        declaration={NOTE_DECL}
        value=""
        onChange={(next) => heardChecked.push(next)}
        coverage={reporterFor([WARNING, ARROW])}
      />,
    );
    fireEvent.change(areaOf(checked.container), { target: { value: typed } });

    expect(heardBare).toEqual([typed]);
    expect(heardChecked).toEqual(heardBare);
    expect(heardChecked[0].length).toBe(typed.length);
  });

  it('D5: the REAL eight faces, through the REAL reader, put a real uncovered character in the note', () => {
    const loraBytes = (file) => ({ file, bytes: new Uint8Array(readFileSync(join(FONT_DIR, file))) });
    const lora = familyCoverage('Lora', EMBEDDED_FACES.Lora.map(loraBytes));
    const check = (text) => coverageOf(text, lora).uncovered;

    // The reader is LIVE: it read real faces and found thousands of real code points.
    expect(lora.covered.size > 500).toBe(true);

    const text = `Beca${GRINNING}nahau${WARNING}`;
    const { container } = render(
      <FreeField declaration={NOTE_DECL} value={text} onChange={() => {}} coverage={check} />,
    );
    const note = noteOf(container);
    expect(Boolean(note)).toBe(true);
    expect(note.textContent).toBe(`${GRINNING} ${WARNING}`);
    expect(areaOf(container).value).toBe(text);
    // ...and a text of the same shape that the faces CAN draw is silent through the very
    // same reader, so the note above is a fact about those two characters.
    cleanup();
    const plain = render(
      <FreeField declaration={NOTE_DECL} value="Becanahau" onChange={() => {}} coverage={check} />,
    );
    expect(noteOf(plain.container)).toBe(null);
  });
});
