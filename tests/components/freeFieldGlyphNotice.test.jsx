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
 *
 * ── EM-D2c's FIVE (N5..N9): THE FACE THE FIELD IS REALLY DRAWN IN (U84) ─────────────
 * EM-D2b's wiring asked LORA for every field. The dossier sets two families, so that was
 * the wrong question for half of them: a NAME is a Lora card title AND a Nunito caption,
 * pill or running page header, while a NOTE is Lora alone. N5 and N6 are the product-
 * visible cure -- one door, one text, the name reported and the note silent. N7 drives the
 * three roles over the REAL eight faces. N8 re-derives the role -> family map from
 * src/pdf/theme.js's own bytes, so the restatement in the reader cannot drift. N9 walks
 * EM-A1's whole table so a free row declared tomorrow cannot take an unmeasured role.
 *
 * ⛔ THE TWO GLYPHS THIS TURNS ON ARE THE ESTATE'S OWN MEASUREMENT, already pinned by
 * tests/pdf/fontCmap.test.js's C3: U+0133 is drawn by Lora and NOT by Nunito, U+0200 by
 * Nunito and NOT by Lora. Both are re-measured live in N7 before the table that uses them,
 * so no arm here rests on a divergence that may have been re-cut away.
 *
 * ⛔ THE TWO SUBJECTS ARE IMPORTED AS NAMESPACES, and that is a red-first requirement
 * rather than a style: a named import of an export the pre-change file does not have kills
 * the whole FILE's collection, and a plant-and-restore red that has no title and no count
 * line is not the proof the law asks for. Through a namespace, every arm below reds BY ITS
 * OWN TITLE against HEAD.
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
import CardEditorDialog, * as door from '../../src/components/edit/CardEditorDialog.jsx';
import { FIELD_DECLARATIONS, declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import * as faces from '../../src/pdf/lib/fontCoverage.js';
import { t } from '../../src/copy/index.js';

const { EMBEDDED_FACES, FONT_URL_PREFIX } = faces;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FONT_DIR = join(ROOT, 'public', 'fonts');
const DOOR_REL = 'src/components/edit/CardEditorDialog.jsx';
const DOOR_SOURCE = readFileSync(join(ROOT, DOOR_REL), 'utf8');
const THEME_SOURCE = readFileSync(join(ROOT, 'src/pdf/theme.js'), 'utf8');

/** EM-A1's REAL rows, read from the landed table and never retyped. */
const NOTE_DECL = declarationsFor('npc').find((row) => row.field === 'note');
const NAME_DECL = declarationsFor('npc').find((row) => row.field === 'name');

const ARROW = String.fromCodePoint(0x2192);
const WARNING = String.fromCodePoint(0x26a0);
const GRINNING = String.fromCodePoint(0x1f600);
/** LATIN SMALL LIGATURE IJ -- drawn by Lora, NOT by Nunito (fontCmap.test.js C3). */
const IJ = String.fromCodePoint(0x0133);
/** LATIN CAPITAL A WITH DOUBLE GRAVE -- drawn by Nunito, NOT by Lora (the same arm). */
const A_DOUBLE_GRAVE = String.fromCodePoint(0x0200);

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

/**
 * ONE generated control, found by the caption EM-A1 declares for it, so a door drawing
 * four rows can be read field by field instead of "the first note on the page".
 */
const fieldNamed = (root, caption) => [...root.querySelectorAll('label')]
  .filter((node) => node.firstElementChild?.textContent === caption)
  .map((node) => node.parentElement)[0] ?? null;

/** What one named field says it cannot print, or '' when it says nothing. */
const uncoveredAt = (root, caption) => {
  const wrapper = fieldNamed(root, caption);
  const note = wrapper === null ? null : wrapper.querySelector('[data-uncovered]');
  return note === null ? '' : note.getAttribute('data-uncovered');
};

/** The real family sets, read from public/fonts through the module's own intersection. */
const familyFromDisk = (family) => faces.familyCoverage(
  family,
  EMBEDDED_FACES[family].map((file) => ({
    file, bytes: new Uint8Array(readFileSync(join(FONT_DIR, file))),
  })),
);

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

/**
 * The faces these arms serve, and the URLs `fetchFace` must ask for to get them. EVERY
 * registered family, in EMBEDDED_FACES' own order -- N8 below pins that order against the
 * reader's widest role, so this list is a join and not a second spelling.
 */
const ALL_URLS = Object.keys(EMBEDDED_FACES)
  .flatMap((family) => EMBEDDED_FACES[family].map((file) => `${FONT_URL_PREFIX}${file}`));
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

    // The door went to the network, and it went for EVERY EMBEDDED FACE under /fonts/ --
    // eight since EM-D2c, because a field drawn in a Nunito label cannot be answered out
    // of Lora's four and the door reads the families before it answers for any role.
    await waitFor(() => expect(served.length).toBe(ALL_URLS.length));
    expect(served).toEqual(ALL_URLS);
    await waitFor(() => expect(typeof door.faceCoverageReporter()).toBe('function'));
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
    expect(served).toEqual(ALL_URLS);
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

  it('N5: a NAME is measured against the LABEL face too, so a glyph only Lora draws is reported', async () => {
    // The faces are in from N3 -- the door reads once per page load -- but the await is
    // kept so this arm is a proof on its own and not on its neighbour's order.
    await waitFor(() => expect(typeof door.faceCoverageReporter(NAME_DECL)).toBe('function'));
    const text = `Becanahau${IJ}`;

    const { container } = render(doorOf({ values: { name: text } }));
    // ⭐ THE LIE EM-D2b LEFT: Lora draws U+0133, so the one-family reader said nothing --
    // while the dossier sets this same name in a Nunito caption, pill and page header,
    // where it prints as a plausible WRONG LETTER.
    expect(uncoveredAt(container, NAME_DECL.label)).toBe(IJ);
    expect(noteOf(container).parentElement.textContent)
      .toBe(t('edit.field.uncovered', { chars: IJ }));
    // THE DM'S TEXT IS UNTOUCHED, which is the control's standing law either way.
    expect(fieldNamed(container, NAME_DECL.label).querySelector('input').value).toBe(text);
    cleanup();

    // ...and the same field with a character BOTH families draw is silent through the very
    // same reporter, so the note above is a fact about that character and not about names.
    const clean = render(doorOf({ values: { name: 'Becanahau' } }));
    expect(uncoveredAt(clean.container, NAME_DECL.label)).toBe('');
  });

  it('N6: ONE door, ONE text, TWO answers: the name is reported and the note is silent, because they are drawn in different faces', async () => {
    await waitFor(() => expect(typeof door.faceCoverageReporter(NOTE_DECL)).toBe('function'));
    const text = `Becanahau${IJ}`;
    const { container } = render(doorOf({ values: { name: text, note: text } }));

    // The report is PER FIELD ROLE. A note lands in Lora alone (type.italic / type.body /
    // type.prose), which draws U+0133; a name lands in a Nunito label as well, which does
    // not. Same door, same characters, two honest answers.
    expect([
      uncoveredAt(container, NAME_DECL.label),
      uncoveredAt(container, NOTE_DECL.label),
    ]).toEqual([IJ, '']);
    // Both controls really did render and really do hold the same text, so the silence
    // above is a measured answer and not a field the door failed to draw.
    expect([
      fieldNamed(container, NAME_DECL.label).querySelector('input').value,
      fieldNamed(container, NOTE_DECL.label).querySelector('textarea').value,
    ]).toEqual([text, text]);
    cleanup();

    // THE REVERSE CHARACTER, THE REVERSE ANSWER: U+0200 is Nunito's and not Lora's, so the
    // NOTE reports it and the NAME reports it too -- a union is never narrower than a part.
    const flipped = render(doorOf({
      values: { name: `Becanahau${A_DOUBLE_GRAVE}`, note: `Becanahau${A_DOUBLE_GRAVE}` },
    }));
    expect([
      uncoveredAt(flipped.container, NAME_DECL.label),
      uncoveredAt(flipped.container, NOTE_DECL.label),
    ]).toEqual([A_DOUBLE_GRAVE, A_DOUBLE_GRAVE]);
  });

  it('N7: the reader answers per ROLE over the real eight faces, and the widest role is the union of the failures', () => {
    const LORA = familyFromDisk('Lora');
    const NUNITO = familyFromDisk('Nunito');
    const loaded = { Lora: LORA, Nunito: NUNITO };
    // THE DIVERGENCE IS RE-MEASURED BEFORE IT IS USED, so no row below rests on a fact a
    // font re-cut may have removed. This is fontCmap.test.js's C3 asked again, live.
    expect([
      LORA.covered.has(0x0133), NUNITO.covered.has(0x0133),
      LORA.covered.has(0x0200), NUNITO.covered.has(0x0200),
    ]).toEqual([true, false, false, true]);

    const reported = (role, char) => faces
      .coverageAcross(`a${char}b`, faces.familiesForRole(role).map((family) => loaded[family]))
      .uncovered.map((entry) => entry.char).join('');
    // The three roles against the two dividing characters, as one table. A body-face field
    // is silent about U+0133 and a label-face field is silent about U+0200; the field drawn
    // in both is silent about neither, which is the only answer that cannot promise a
    // character will print when it will not.
    expect([
      `body ${reported('body', IJ)}`,
      `label ${reported('label', IJ)}`,
      `both ${reported('both', IJ)}`,
      `body ${reported('body', A_DOUBLE_GRAVE)}`,
      `label ${reported('label', A_DOUBLE_GRAVE)}`,
      `both ${reported('both', A_DOUBLE_GRAVE)}`,
    ]).toEqual([
      'body ', `label ${IJ}`, `both ${IJ}`,
      `body ${A_DOUBLE_GRAVE}`, 'label ', `both ${A_DOUBLE_GRAVE}`,
    ]);

    // TOTAL: a role nobody measured takes the widest list rather than a narrow one, and an
    // inherited name is an unnamed role like any other.
    const unnamed = ['shouted', null, 'constructor', 'both'];
    expect(unnamed.map((role) => [...faces.familiesForRole(role)]))
      .toEqual(unnamed.map(() => [...faces.ROLE_FAMILIES.both]));
    // FAILS OPEN, one layer up: with no family measured it reports nothing rather than
    // everything, and it says which families really answered.
    const unmeasured = faces.coverageAcross(`a${A_DOUBLE_GRAVE}`, [null, undefined, {}]);
    expect([unmeasured.families, unmeasured.uncovered]).toEqual([[], []]);
    expect(faces.coverageAcross(`a${A_DOUBLE_GRAVE}`, [LORA]).families).toEqual(['Lora']);
  });

  it('N8: the role -> family map is DERIVED FROM src/pdf/theme.js, so the reader\'s restatement cannot drift', () => {
    // The `type` scale only: `sheet` and `palette` are not roles, and a slice keeps the
    // parser from reading a page default as one.
    const start = THEME_SOURCE.indexOf('export const type = {');
    const slice = THEME_SOURCE.slice(start, THEME_SOURCE.indexOf('\n};', start));
    const rolesOf = (src) => {
      /** @type {Record<string, string[]>} */
      const byFamily = {};
      for (const m of src.matchAll(/^ {2}(\w+):\s*\{[^\n]*fontFamily:\s*'([^']+)'/gm)) {
        (byFamily[m[2]] = byFamily[m[2]] || []).push(m[1]);
      }
      return byFamily;
    };
    const byFamily = rolesOf(slice);
    // THE PARSER IS LIVE, and it really would see a third family if theme.js grew one.
    expect(Object.keys(rolesOf("  x: { fontFamily: 'Garamond', fontSize: 9 },")))
      .toEqual(['Garamond']);
    expect(Object.values(byFamily).flat().length > 8).toBe(true);

    // EXACTLY TWO FAMILIES, and they are the two whose faces the reader embeds.
    expect(Object.keys(byFamily).sort()).toEqual(Object.keys(EMBEDDED_FACES).sort());
    expect([...faces.ROLE_FAMILIES.both]).toEqual(Object.keys(EMBEDDED_FACES));

    // THE MAP, RE-DERIVED: the body role is whichever family theme.js sets `body` in and
    // the label role whichever it sets `label` in -- never the names typed in the reader.
    const familyOf = (role) => Object.keys(byFamily).filter((f) => byFamily[f].includes(role))[0];
    expect([...faces.ROLE_FAMILIES.body]).toEqual([familyOf('body')]);
    expect([...faces.ROLE_FAMILIES.label]).toEqual([familyOf('label')]);
    expect([...faces.ROLE_FAMILIES.both]).toEqual([familyOf('body'), familyOf('label')]);

    // ...and the two lists the reader's header names are the file's, role for role, so the
    // comment that tells the next author what was measured is itself measured.
    const bodyRoles = ['body_em', 'prose', 'italic', 'cover_title', 'page_head', 'section'];
    const labelRoles = ['label_em', 'label_plain', 'caption', 'pill', 'sub', 'cover_meta'];
    expect(bodyRoles.map(familyOf)).toEqual(bodyRoles.map(() => familyOf('body')));
    expect(labelRoles.map(familyOf)).toEqual(labelRoles.map(() => familyOf('label')));
  });

  it('N9: EVERY free row EM-A1 declares has a MEASURED role, so a row added tomorrow cannot take an unmeasured one', () => {
    const freeRows = Object.keys(FIELD_DECLARATIONS)
      .flatMap((card) => declarationsFor(card))
      .filter((row) => row.kind === 'free' || row.kind === 'free-cascade');
    // The walk is live: the table really does declare free rows, and they are the rows
    // FreeField draws.
    expect(freeRows.length).toBe(6);

    // EVERY group the free rows carry is a group the door measured, as a set equality in
    // both directions rather than a membership check that an empty table would pass.
    expect([...new Set(freeRows.map((row) => row.group))].sort())
      .toEqual(Object.keys(door.FIELD_GROUP_ROLES).sort());
    // ...and every role the door names is a role the reader really knows.
    expect(Object.values(door.FIELD_GROUP_ROLES).map((role) => Object.hasOwn(faces.ROLE_FAMILIES, role)))
      .toEqual(Object.values(door.FIELD_GROUP_ROLES).map(() => true));

    // THE MEASUREMENT, WRITTEN DOWN ROW BY ROW (src/pdf/sections, 2026-09-23): a name is a
    // Lora card title and a Nunito caption/pill/page header; a note is Lora alone.
    expect(freeRows.map((row) => `${row.card}.${row.field} ${door.FIELD_GROUP_ROLES[row.group]}`))
      .toEqual([
        'institution.name both',
        'institution.note body',
        'npc.name both',
        'npc.note body',
        'faction.faction both',
        'phantom.name both',
      ]);
  });
});
