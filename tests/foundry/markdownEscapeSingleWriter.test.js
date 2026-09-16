/**
 * markdownEscapeSingleWriter.test.js — ONE markdown/HTML escaper for both
 * Foundry journal lanes.
 *
 * The in-app module builder (src/foundry/journalPages.js) and the standalone
 * world importer (foundry-module/scripts/build-journals.js) each used to declare
 * their own `esc`, with DIVERGENT character classes ({\ ` * _ [ ] # |} vs
 * {\ ` * _ [ ] ( ) # + ~ |}), opposite pass ordering, and different entity sets —
 * a security-shaped function drifting in two places with no cross-pin. Both now
 * import foundry-module/scripts/markdownEscape.js.
 *
 * These pins hold the convergence: behavioural agreement on a hostile corpus, the
 * superset character class, the load-bearing pass ORDER, and a source scan that
 * fails the moment a lane re-declares its own escape chain.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { escapeMarkdown } from '../../foundry-module/scripts/markdownEscape.js';
import { esc as standaloneEsc } from '../../foundry-module/scripts/build-journals.js';
import { esc as inAppEsc } from '../../src/foundry/journalPages.js';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');

// Hostile + ordinary strings. No ZWNJ here — that character is the in-app lane's
// own extra concern and is pinned separately below.
const CORPUS = [
  '<img src=x onerror=alert(1)>',
  '[link](http://evil.example)',
  '# not a heading',
  '> not a blockquote',
  'a *bold* _under_ `tick` ~strike~ +plus+',
  'Tom & Jerry',
  "O'Brien said \"hello\"",
  'pipe | table | row',
  'back\\slash',
  'The Wardens (Third Company)',
  'plain prose with nothing special',
  '',
];

describe('both Foundry lanes escape through the SAME writer', () => {
  it('agree byte-for-byte across a hostile corpus', () => {
    for (const input of CORPUS) {
      expect(inAppEsc(input), input).toBe(standaloneEsc(input));
      expect(standaloneEsc(input), input).toBe(escapeMarkdown(input));
    }
  });

  it('the standalone lane IS the shared writer (not a copy)', () => {
    expect(standaloneEsc).toBe(escapeMarkdown);
  });

  it('the in-app lane adds ONLY its ZWNJ strip on top', () => {
    // format.js's noLig() slips U+200C between ligature pairs for the PDF font;
    // it must never reach a Foundry page (F24 corruption class).
    expect(inAppEsc('con‌flict')).toBe('conflict');
    expect(standaloneEsc('con‌flict')).toBe('con‌flict');
    expect(inAppEsc(null)).toBe('');
    expect(standaloneEsc(null)).toBe('');
  });
});

describe('the shared escaper keeps the superset behaviour', () => {
  it('escapes the WIDER markdown class (the standalone lane\'s, not the app lane\'s)', () => {
    // ( ) + ~ were escaped by the standalone lane only; the app lane now gets them too.
    expect(escapeMarkdown('(a) +b~c')).toBe('\\(a\\) \\+b\\~c');
    // …and the characters both already covered.
    expect(escapeMarkdown('a *b* _c_ `d` [e] #f |g \\h')).toBe('a \\*b\\* \\_c\\_ \\`d\\` \\[e\\] \\#f \\|g \\\\h');
  });

  it('emits the WIDER entity set, and never double-encodes one', () => {
    expect(escapeMarkdown('<b>&"\'')).toBe('&lt;b&gt;&amp;&quot;&#39;');
    // The ordering contract: the `#` inside &#39; survives because the markdown
    // pass ran BEFORE the entity pass. Reversed, this reads O&\#39;Brien.
    expect(escapeMarkdown("O'Brien")).toBe('O&#39;Brien');
    expect(escapeMarkdown('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('blocks the injection classes both lanes existed to block', () => {
    const hostile = escapeMarkdown('<script>alert(1)</script> [x](javascript:1)');
    expect(hostile).not.toContain('<script');
    expect(hostile).not.toContain('](');
  });
});

describe('neither lane may re-declare an escape chain', () => {
  // The drift this convergence removes: an entity-escape chain living in more
  // than one file. Exactly ONE file may carry it.
  const ENTITY_CHAIN = /replace\(\/&\/g,\s*'&amp;'\)/;

  it('only markdownEscape.js declares the entity chain', () => {
    expect(read('foundry-module/scripts/markdownEscape.js')).toMatch(ENTITY_CHAIN);
    expect(read('foundry-module/scripts/build-journals.js')).not.toMatch(ENTITY_CHAIN);
    expect(read('src/foundry/journalPages.js')).not.toMatch(ENTITY_CHAIN);
  });

  it('both lanes import the shared writer', () => {
    expect(read('foundry-module/scripts/build-journals.js')).toMatch(/from '\.\/markdownEscape\.js'/);
    expect(read('src/foundry/journalPages.js')).toMatch(/from '\.\.\/\.\.\/foundry-module\/scripts\/markdownEscape\.js'/);
  });

  it('the shared writer stays self-contained (the shipped module imports no src/)', () => {
    const src = read('foundry-module/scripts/markdownEscape.js');
    expect(src).not.toMatch(/from\s+['"][^'"]*\/src\//);
    expect(src).not.toMatch(/^import\s/m);
  });
});
