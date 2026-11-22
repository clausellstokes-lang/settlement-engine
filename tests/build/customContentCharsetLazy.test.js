/**
 * customContentCharsetLazy.test.js -- THE CHARSET LEAF PAYS NO FIRST-PAINT BYTES.
 *
 * ⛔ WHAT THIS FILE EXISTS TO STOP, and it is a measured incident rather than a
 * fear. `customContentSchema.js` is excised from ENGINE_SHARED_DOMAIN and pinned
 * to its own lazy chunk. The estate has already measured what happens when an
 * excised importer gains a new leaf: the leaf lands in the EAGER `engine-core`
 * chunk (+214 B) and re-hashes 112 chunks. The charset leaf is exactly the shape
 * that would do it -- a small pure module in `src/domain/content/` that several
 * content modules would like to reach.
 *
 * So this file pins the three properties the zero-byte claim rests on:
 *
 *   1. neither the leaf nor its generated table is in vite's OWN eager module
 *      derivation;
 *   2. neither is in ENGINE_SHARED_DOMAIN, so the derived grouping cannot pull
 *      them into `engine-core`;
 *   3. `customContentSchema.js` -- the one content module the generators import
 *      -- does not import the leaf, which is the edge that would defeat 1 and 2.
 *
 * ⭐ AND ONE PROPERTY THAT IS TRUE ONLY WHILE THE WALL IS UNWIRED. At this car
 * the leaf has NO importer at all, so Rollup emits no `custom-charset` chunk and
 * the leaf's bytes are absent from the whole dist. That is the strongest form of
 * the claim, and it is worth pinning precisely because it is temporary: the car
 * that wires the wall must reach the leaf through `import(` at the admission
 * call, never through a static edge from `customContentManifest.js`. Fourteen
 * modules statically import that manifest and five entry-owned dynamic imports
 * reach it, so a static edge would list the new chunk's filename in the ENTRY's
 * own `__vite__mapDeps` array. The dist arm below is written against the ENTRY
 * CLOSURE rather than against chunk existence, so it keeps its meaning after the
 * wiring lands instead of needing a rewrite.
 */

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EAGER_FIRST_PAINT_MODULES, ENGINE_SHARED_DOMAIN_EXCISIONS } from '../../vite.config.js';
import { codeOnly } from '../helpers/codeOnlySource.js';

/**
 * Comments blanked, string CONTENTS kept, offsets preserved.
 *
 * The shared `codeOnly` strip blanks string text as well, which is right for a
 * detector making a USE claim but wrong here: the two claims below are about
 * PATH LITERALS -- a manualChunks rule and an import specifier are strings, and
 * a strip that blanks them convicts nothing. What still must not count is a
 * mention inside prose, so comments go.
 */
function withoutComments(src) {
  const out = src.split('');
  const blank = (from, to) => {
    for (let i = from; i < to && i < out.length; i += 1) if (out[i] !== '\n') out[i] = ' ';
  };
  let i = 0;
  while (i < src.length) {
    if (src[i] === '/' && src[i + 1] === '/') {
      let j = i;
      while (j < src.length && src[j] !== '\n') j += 1;
      blank(i, j);
      i = j;
    } else if (src[i] === '/' && src[i + 1] === '*') {
      let j = i + 2;
      while (j < src.length && !(src[j] === '*' && src[j + 1] === '/')) j += 1;
      blank(i, Math.min(j + 2, src.length));
      i = j + 2;
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

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF = 'src/domain/content/customContentCharset.js';
const TABLE = 'src/domain/content/customContentCharset.generated.js';
const SCHEMA = join(ROOT, 'src/domain/customContentSchema.js');
const assetsDir = join(ROOT, 'dist/assets');
const distExists = existsSync(assetsDir);

/** The chunk the built index.html loads as a module. */
function findEntryChunk() {
  const html = readFileSync(join(ROOT, 'dist/index.html'), 'utf-8');
  const match = html.match(/<script[^>]+type="module"[^>]+src="\/assets\/([^"]+\.js)"/);
  if (!match) throw new Error('no module entry script in dist/index.html');
  return match[1];
}

/** Static import specifiers, resolved to asset filenames. */
function staticImportSpecifiers(code) {
  const out = [];
  for (const match of code.matchAll(/(?:^|[;\s}])(?:import|export)[^;]*?from\s*["']\.\/([^"']+\.js)["']/g)) {
    out.push(match[1]);
  }
  for (const match of code.matchAll(/import\s*["']\.\/([^"']+\.js)["']/g)) out.push(match[1]);
  return out;
}

function entryStaticClosure() {
  const entry = findEntryChunk();
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    const code = readFileSync(join(assetsDir, file), 'utf-8');
    for (const dep of staticImportSpecifiers(code)) {
      if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
    }
  }
  return [...seen];
}

describe('the charset leaf is outside every eager derivation', () => {
  it('vite does not count the leaf or its table as an eager first-paint module', () => {
    const eager = [...EAGER_FIRST_PAINT_MODULES];
    expect(eager.length).toBeGreaterThan(100);
    for (const id of eager) {
      expect(id.includes('customContentCharset'), `eager module ${id}`).toBe(false);
    }
  });

  it('the manualChunks rule routes the pair to its own chunk BEFORE the engine grouping', () => {
    // Order is the whole cure. If the engine-core grouping matched first the pin
    // below it would never run, and the leaf would ride an eager chunk.
    const config = withoutComments(readFileSync(join(ROOT, 'vite.config.js'), 'utf-8'));
    const pin = config.indexOf('customContentCharset');
    const grouping = config.indexOf('isEngineSharedDomain(id)');
    expect(pin, 'the custom-charset manualChunks rule is missing').toBeGreaterThan(-1);
    expect(grouping).toBeGreaterThan(-1);
    expect(pin).toBeLessThan(grouping);
  });

  it('neither file is excised INTO engine-shared domain by an excision entry', () => {
    for (const frag of ENGINE_SHARED_DOMAIN_EXCISIONS) {
      expect(frag.includes('customContentCharset'), frag).toBe(false);
    }
  });

  it('customContentSchema.js does not import the leaf', () => {
    // The generator-reached content module. A static edge from here is the exact
    // shape that put a sibling leaf into eager engine-core at +214 B.
    const source = codeOnly(readFileSync(SCHEMA, 'utf-8'));
    expect(source.includes('customContentCharset')).toBe(false);
  });

  it('the leaf imports nothing but its own generated table', () => {
    // Zero imports is what lets the pair sit alone in a lazy chunk. A second
    // import would drag that module's whole closure in with it.
    const source = withoutComments(readFileSync(join(ROOT, LEAF), 'utf-8'));
    const specifiers = [...source.matchAll(/from\s*["']([^"']+)["']/g)].map((m) => m[1]);
    expect(specifiers).toEqual(['./customContentCharset.generated.js']);
  });

  it('the generated table imports nothing at all', () => {
    const source = withoutComments(readFileSync(join(ROOT, TABLE), 'utf-8'));
    expect([...source.matchAll(/from\s*["']([^"']+)["']/g)].map((m) => m[1])).toEqual([]);
  });
});

describe.runIf(distExists)('the built bundle carries no charset bytes on first paint', () => {
  it('no chunk in the entry static closure mentions the charset table', () => {
    const carriers = entryStaticClosure().filter(
      (file) => readFileSync(join(assetsDir, file), 'utf-8').includes('CUSTOM_CONTENT_CHARSET'),
    );
    expect(
      carriers,
      `the charset table reached first paint via ${carriers.join(', ')}; the admission call must reach the leaf through import(, never a static edge`,
    ).toHaveLength(0);
  });

  it('the entry closure is measured, not empty', () => {
    // Non-vacuity: an arm that walks nothing would pass the arm above forever.
    expect(entryStaticClosure().length).toBeGreaterThan(3);
  });

  it('the two jsPDF painters reach the hoisted text pass, and it stays off first paint', () => {
    const closure = new Set(entryStaticClosure());
    const carriers = readdirSync(assetsDir)
      .filter((file) => file.endsWith('.js'))
      .filter((file) => readFileSync(join(assetsDir, file), 'utf-8').includes('x09\\x0A\\x0D'));
    expect(carriers.length, 'the one jsPDF text pass was tree-shaken out of every chunk').toBeGreaterThan(0);
    for (const file of carriers) {
      expect(closure.has(file), `the text pass reached first paint via ${file}`).toBe(false);
    }
  });
});
