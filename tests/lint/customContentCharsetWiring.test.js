/**
 * customContentCharsetWiring.test.js -- WHERE THE CHARSET WALL MAY BE REACHED
 * FROM, AND WHERE IT MAY NOT.
 *
 * TWO CLAIMS, both structural, both measured rather than argued.
 *
 * 1. THE LEAF IS NEVER STATICALLY IMPORTED FROM `src/`. The leaf and its
 *    generated table sit alone in the `custom-charset` chunk. Vite writes, per
 *    chunk that OWNS a dynamic import, an array holding the imported chunk plus
 *    its whole transitive STATIC import closure. The modules that want the wall
 *    -- customContentManifest.js, customContentCommands.js, contentPacks.js,
 *    customContentSliceRuntime.js, accountImportBody.js, the editor, en.js --
 *    are every one of them inside the static closure of a dynamic import the
 *    ENTRY owns. So a static edge from any of them would list the charset
 *    chunk's filename in the entry's own `__vite__mapDeps`: first-paint bytes
 *    for a leaf first paint never runs. The cure is that every edge is an
 *    `import()`, and this file is where that stops being a habit and becomes a
 *    rule. The design read only customContentManifest.js as dangerous; the
 *    measured graph says the whole set is.
 *
 * 2. THE RESTORE LANES NEVER BUILD A WALL (owner ruling CS-9). An import of a
 *    user's own account export is a RESTORE, never an authoring act. The wall
 *    is a VALUE handed in, so a lane that never builds one cannot consult one --
 *    the blindness is structural rather than a flag someone must remember. This
 *    file pins the two places that carry the split: accountImportBody.js asking
 *    prepareImport for `authoring: false`, and the command lane's pack IDENTITY
 *    re-derivation doing the same.
 *
 * WHY A LINT-CLASS FILE RATHER THAN A UNIT TEST. Both claims are about SOURCE
 * SHAPE across many files, and both fail silently at runtime: a static edge
 * still works, and a forgotten `authoring: false` still imports. Only a scan
 * convicts them.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = join(ROOT, 'src');

/** The leaf and its table, by the fragment every specifier for them contains. */
const LEAF_FRAGMENT = 'customContentCharset';

/**
 * Comments blanked, string CONTENTS kept, offsets preserved.
 *
 * The claim below is about IMPORT SPECIFIERS, which are strings. A strip that
 * blanks string bodies would convict nothing at all. What must not count is a
 * mention inside prose, so comments go and quotes stay.
 *
 * @param {string} src the source text
 * @returns {string} the source with comment bodies blanked
 */
function withoutComments(src) {
  const out = src.split('');
  const blank = (from, to) => {
    for (let i = from; i < to && i < out.length; i += 1) if (out[i] !== '\n') out[i] = ' ';
  };
  let i = 0;
  while (i < src.length) {
    const two = src.slice(i, i + 2);
    if (two === '//') {
      let j = i;
      while (j < src.length && src[j] !== '\n') j += 1;
      blank(i, j);
      i = j;
    } else if (two === '/*') {
      const end = src.indexOf('*/', i + 2);
      const j = end === -1 ? src.length : end + 2;
      blank(i, j);
      i = j;
    } else if (src[i] === '"' || src[i] === "'" || src[i] === '`') {
      const quote = src[i];
      let j = i + 1;
      while (j < src.length && src[j] !== quote) j += src[j] === '\\' ? 2 : 1;
      i = j + 1;
    } else {
      i += 1;
    }
  }
  return out.join('');
}

/** @returns {string[]} every JS/JSX source file under src/, repo-relative */
function srcFiles() {
  /** @type {string[]} */
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(js|jsx)$/.test(name)) files.push(relative(ROOT, full));
    }
  };
  walk(SRC);
  return files;
}

const SOURCES = new Map(
  srcFiles().map((file) => [file, withoutComments(readFileSync(join(ROOT, file), 'utf-8'))]),
);

/** The modules allowed to reach the leaf, and only by `import(`. */
const DYNAMIC_IMPORTERS = Object.freeze([
  'src/domain/content/customContentManifest.js',
]);

describe('the charset leaf is reached dynamically or not at all', () => {
  it('no file under src/ statically imports the leaf or its generated table', () => {
    /** @type {string[]} */
    const offenders = [];
    for (const [file, source] of SOURCES) {
      if (file.startsWith('src/domain/content/customContentCharset')) continue;
      const statics = [
        ...source.matchAll(/(?:^|[\s;}])import\s[^;]*?from\s*["']([^"']+)["']/g),
        ...source.matchAll(/(?:^|[\s;}])export\s[^;]*?from\s*["']([^"']+)["']/g),
        ...source.matchAll(/(?:^|[\s;}])import\s*["']([^"']+)["']/g),
      ].map((match) => match[1]);
      if (statics.some((specifier) => specifier.includes(LEAF_FRAGMENT))) offenders.push(file);
    }
    expect(offenders, 'a static edge to the charset leaf costs entry bytes').toEqual([]);
  });

  it('exactly the named modules reach the leaf, and each does it with import(', () => {
    /** @type {string[]} */
    const importers = [];
    for (const [file, source] of SOURCES) {
      if (file.startsWith('src/domain/content/customContentCharset')) continue;
      if (/import\s*\(\s*["'][^"']*customContentCharset[^"']*["']\s*\)/.test(source)) {
        importers.push(file);
      }
    }
    expect(importers.sort()).toEqual([...DYNAMIC_IMPORTERS].sort());
  });

  it('the manifest adapter reaches the leaf from exactly one place', () => {
    // One loader means one edge to audit and one place a policy override can be
    // handed in. Two loaders is how a second, static one arrives unnoticed.
    const source = SOURCES.get('src/domain/content/customContentManifest.js');
    const edges = [...(source || '').matchAll(/import\s*\(\s*["']\.\/customContentCharset\.js["']\s*\)/g)];
    expect(edges).toHaveLength(1);
  });
});

describe('the restore lanes never build a charset wall', () => {
  it('the account-import pack lane asks prepareImport for a restore', () => {
    const source = SOURCES.get('src/store/accountImportBody.js') || '';
    const call = source.slice(source.indexOf('prepareContentPackImport(parsedPack.pack'));
    expect(call).not.toBe('');
    expect(call.slice(0, 300)).toContain('authoring: false');
  });

  it('the command lane re-derives pack identity without the wall', () => {
    // The account-export plan is applied through the same command lane the
    // Compendium save uses, and previewCustomContentCommand re-derives the pack
    // to check identity. A charset verdict there could disagree with the lane
    // that admitted the entries and refuse a restore that was rightly admitted.
    const source = SOURCES.get('src/domain/content/customContentCommands.js') || '';
    expect(source).toContain('prepareContentPackImport(manifest, { authoring: false })');
  });

  it('the shared-pack lane is authoring, and says so', () => {
    const source = SOURCES.get('src/components/compendium/ContentPackBar.jsx') || '';
    expect(source).toContain('authoring: true');
  });

  it('the account-export source type is the one the split turns on', () => {
    const manifest = SOURCES.get('src/domain/content/customContentManifest.js') || '';
    expect(manifest).toContain("RESTORE_CONTENT_SOURCE_TYPES = Object.freeze(['account-export'])");
    const runtime = SOURCES.get('src/store/customContentSliceRuntime.js') || '';
    expect(runtime).toContain('isAuthoringContentSource(source)');
  });
});

describe('the transient rejection list is cleared wherever the error is', () => {
  it('every customContentError clear clears the charset list beside it', () => {
    // R11: five sibling action files write customContentError. A findings list
    // that outlived a successful retry would accuse a field that is now clean.
    const files = [
      'src/store/customContentSlice.js',
      'src/store/customContentSliceRuntime.js',
      'src/store/customContentReviewedSupplyChainActions.js',
    ];
    for (const file of files) {
      const source = SOURCES.get(file) || '';
      const clears = [...source.matchAll(/state\.customContentError = null;/g)].length;
      const paired = [...source.matchAll(
        /state\.customContentError = null;\s*state\.customContentCharsetRejections = \[\];/g,
      )].length;
      expect(paired, `${file}: ${clears} clears, ${paired} paired`).toBe(clears);
    }
  });
});
