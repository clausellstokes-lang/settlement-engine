/** @vitest-environment jsdom */
/**
 * freeFieldGlyphNotice.test.jsx — EM-D2b's four arms over THE WIRE EM-D2 LEFT OPEN: the
 * door obtains the font-coverage reader, the field says the uncovered characters as a
 * SENTENCE, and the reader stays on the far side of the lazy PDF edge.
 *
 * ⛔ THE BASENAME CARRIES NO INVARIANT WORD, for the reason freeFieldGlyphs.test.jsx and
 * fontCmap.test.js give: `NAME_PATTERN` in tests/lint/mutationCoverage.shared.mjs would
 * enrol a `*Coverage.test.jsx` into the mutation-coverage spine and demand a register row
 * from it. These arms mount two leaves; they enumerate no invariant.
 *
 * ⭐ WHAT WAS MEASURED BEFORE A LINE WAS WRITTEN (the verifier's FIX-4, re-run in this
 * worktree at a686beafb): `src/components/edit/CardEditorDialog.jsx` contained no
 * occurrence of `coverage` at all, and `grep -rn 'fontCoverage\|coverageOf' src/` found
 * the leaf's own file and ONE COMMENT in FreeField.jsx and nothing else. EM-D2's only new
 * capability shipped with no importer; N3 and N4 below are the arms that could not have
 * been green on that tree.
 *
 * ⛔ TWO OF THE FOUR ARE POSITIVE SET EQUALITIES RATHER THAN BARE NEGATIVES, which is
 * A4(b)/A7's own idiom in tests/components/editFields.test.jsx: N4 collects every STATIC
 * import specifier in the door and asserts the ones naming the reader equal the empty
 * set, with the scanner driven over a source that really does carry one in the same arm,
 * so an equality against nothing cannot read as agreement. Neither owes an `// anchored:`
 * marker, because neither is a bare `not.toContain` / `not.toMatch` / `not.toHaveProperty`.
 *
 * ⚠ N3 IS THE ONLY ARM THAT TOUCHES DISK, and deliberately: it serves the REAL eight
 * faces to the door's OWN seam over a stubbed `fetch`, so the wiring is proven by the
 * note a DM would actually see rather than by a spelling. The characters are named by
 * code point rather than pasted, so nothing here depends on this file's own encoding.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { afterEach, beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';

const viewport = vi.hoisted(() => ({ mobile: false }));
vi.mock('../../src/hooks/useIsMobile.js', () => ({
  default: () => viewport.mobile,
  getIsMobile: () => viewport.mobile,
}));

import FreeField from '../../src/components/edit/FreeField.jsx';
import CardEditorDialog, { faceCoverageReporter } from '../../src/components/edit/CardEditorDialog.jsx';
import { declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { EMBEDDED_FACES, FONT_URL_PREFIX } from '../../src/pdf/lib/fontCoverage.js';
import { t } from '../../src/copy/index.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FONT_DIR = join(ROOT, 'public', 'fonts');
const DOOR_REL = 'src/components/edit/CardEditorDialog.jsx';
const DOOR_SOURCE = readFileSync(join(ROOT, DOOR_REL), 'utf8');

/** EM-A1's REAL rows, read from the landed table and never retyped. */
const NOTE_DECL = declarationsFor('npc').find((row) => row.field === 'note');

const ARROW = String.fromCodePoint(0x2192);
const WARNING = String.fromCodePoint(0x26a0);
const GRINNING = String.fromCodePoint(0x1f600);

/** A world whose institutions roster answers `npc.role` with members. */
const WORLD = Object.freeze({ institutions: [{ role: 'Reeve', name: 'The Reeve' }] });

/**
 * A PURE injected reporter over a named deny-set: a function of its argument and of
 * nothing else, so the two field arms measure the CONTROL rather than a font read.
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

const noteOf = (root) => root.querySelector('[data-uncovered]');

/** The markup with React's generated id collapsed, so two mounts compare on CONTENT. */
function normalizedMarkup(container) {
  const generated = container.querySelector('label').getAttribute('for');
  return container.innerHTML.split(generated).join('GENERATED_ID');
}

/**
 * Every STATIC import specifier in a source, read the way the BUILD reads them:
 * comments stripped first and `[^'"()]` keeping `import(...)` out of the from-clause,
 * which is `computeEagerModuleGraph`'s own shape in vite.config.js. A dynamic import is
 * a lazy boundary there, and this arm is only honest if it agrees with that.
 */
const staticSpecifiersIn = (src) => [...src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')
  .matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)].map((m) => m[1]);

const READER_SPECIFIER = '../../pdf/lib/fontCoverage.js';
/** The scanner's liveness control: a source that really does carry the static edge. */
const STATIC_CONTROL = `import { coverageOf } from '${READER_SPECIFIER}';`;

const doorOf = (props) => (
  <CardEditorDialog
    open
    cardType="npc"
    entityId="npc_3"
    values={{}}
    world={WORLD}
    seed="seed-em-d2b"
    phase="draft"
    onClose={() => {}}
    {...props}
  />
);

/** The faces this arm serves, and the URLs `fetchFace` must ask for to get them. */
const LORA_URLS = EMBEDDED_FACES.Lora.map((file) => `${FONT_URL_PREFIX}${file}`);
const served = [];
const realFetch = globalThis.fetch;

describe('EM-D2b: the door passes the coverage and the field names what the dossier cannot draw', () => {
  beforeAll(() => {
    // The door's OWN seam, over the REAL bytes: `fetchFace` asks the network for a served
    // face, and here the network is public/fonts/. Nothing about the door is stubbed.
    globalThis.fetch = async (url) => {
      served.push(String(url));
      const bytes = readFileSync(join(FONT_DIR, String(url).slice(FONT_URL_PREFIX.length)));
      return {
        ok: true,
        arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      };
    };
  });
  afterAll(() => { globalThis.fetch = realFetch; });
  afterEach(() => cleanup());

  it('N1: the note is the LANDED KEYS SENTENCE, and the characters keep an element of their own inside it', () => {
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
    const sentence = note.parentElement;
    const chars = `${WARNING} ${ARROW}`;

    // The key really does carry a placeholder, so the split below has a seam to find.
    expect(t('edit.field.uncovered')).toContain('{chars}');
    // THE SENTENCE, word for word what en.js writes, with the characters in their place.
    expect(sentence.textContent).toBe(t('edit.field.uncovered', { chars }));
    // ...and it is a SENTENCE and not the glyphs re-labelled: it says strictly more.
    expect(sentence.textContent.length > chars.length).toBe(true);
    // The characters are still one node with one attribute, deduped in the DM's order.
    expect(note.textContent).toBe(chars);
    expect(note.getAttribute('data-uncovered')).toBe(chars);
    // THE CONTROL STILL HOLDS THE DM'S TEXT, byte for byte.
    expect(container.querySelector('textarea').value).toBe(text);
  });

  it('N2: a fully covered value renders EXACTLY the unchecked tree, byte for byte', () => {
    const clean = 'A quiet reeve keeps the ford.';
    const bare = render(<FreeField declaration={NOTE_DECL} value={clean} onChange={() => {}} />);
    const bareMarkup = normalizedMarkup(bare.container);
    cleanup();

    const checked = render(
      <FreeField
        declaration={NOTE_DECL}
        value={clean}
        onChange={() => {}}
        coverage={reporterFor([WARNING, ARROW])}
      />,
    );

    expect(bareMarkup.length > 0).toBe(true);
    expect(noteOf(checked.container)).toBe(null);
    // A GOLDEN BY COPY: the sentence costs a good text not one byte of markup.
    expect(normalizedMarkup(checked.container)).toBe(bareMarkup);
  });

  it('N3: THE DOOR IS THE IMPORTER: it reads the real eight faces through its own seam and the field names the real uncovered character', async () => {
    const text = `Becanahau${GRINNING}`;
    // COLD: nothing in this file has asked for a face yet — the two arms above mount the
    // FIELD, which imports nothing and fetches nothing. The door's mount below is
    // therefore the whole of the wiring under test.
    expect(served).toEqual([]);
    render(doorOf({ values: { note: text } }));

    // The door went to the network, and it went for LORA'S FOUR FACES under /fonts/.
    await waitFor(() => expect(served.length).toBe(LORA_URLS.length));
    expect(served).toEqual(LORA_URLS);
    await waitFor(() => expect(typeof faceCoverageReporter()).toBe('function'));
    cleanup();

    // The next render of the same door, with the faces in: the note is there, it names
    // the character the faces really cannot draw, and the DM's text is untouched.
    const { container } = render(doorOf({ values: { note: text } }));
    const note = noteOf(container);
    expect(Boolean(note)).toBe(true);
    expect(note.textContent).toBe(GRINNING);
    expect(note.parentElement.textContent).toBe(t('edit.field.uncovered', { chars: GRINNING }));
    expect(container.querySelector('textarea').value).toBe(text);
    cleanup();

    // ...and a text of the same shape those faces CAN draw is silent through the very
    // same loaded reporter, so the note above is a fact about that character.
    const plain = render(doorOf({ values: { note: 'Becanahau' } }));
    expect(noteOf(plain.container)).toBe(null);
    // One read per page load: the second and third doors fetched nothing.
    expect(served).toEqual(LORA_URLS);
  });

  it('N4: the reader is reached by a DYNAMIC import and by no static edge, so it can never ride the first-paint closure behind the door', () => {
    expect(DOOR_SOURCE.length > 0).toBe(true);
    // The scanner is live: it finds the static edge in a source that has one.
    expect(staticSpecifiersIn(STATIC_CONTROL)).toEqual([READER_SPECIFIER]);
    // The door has none, measured the way the build's own eager-graph walk measures.
    expect(staticSpecifiersIn(DOOR_SOURCE).filter((spec) => spec.includes('fontCoverage')))
      .toEqual([]);
    // What it has instead is the lazy boundary, spelled once.
    expect(DOOR_SOURCE.includes(`import('${READER_SPECIFIER}')`)).toBe(true);
    // And the field control still reaches the reader through nothing at all.
    const fieldSource = readFileSync(join(ROOT, 'src/components/edit/FreeField.jsx'), 'utf8');
    expect(staticSpecifiersIn(fieldSource).filter((spec) => spec.includes('pdf/'))).toEqual([]);
  });
});
