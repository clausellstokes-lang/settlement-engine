/** @vitest-environment jsdom */
/**
 * institutionLinkBlockContainer.test.jsx — EVERY CALLER OF InstitutionLink OWES
 * IT A BLOCK CONTAINER.
 *
 * `primitives/InstitutionLink` returns a fragment: the inline trigger, and
 * BESIDE IT the whole `InstitutionCard` — a fixed-position overlay holding a
 * `<section role="dialog">`, a `<header>`, an `<h2>`, its own `<p>`s and a
 * `<ul>`, rendered in place because nothing in src/ portals. So the element a
 * caller wraps it in becomes that dialog's parent the moment a reader opens it.
 *
 * ⛔ WHY THE SERVICES PIN WAS NOT ENOUGH. That one reads console.error, and
 * React's DOM-nesting validator only checks a short list of parents — `<p>` is
 * on it, `<span>` is NOT. PowerStrata wrapped two InstitutionLinks in `<span>`,
 * which is phrasing content and may no more hold a `<section>` than a paragraph
 * may; React said nothing, and the defect sat there SILENT while its noisy twin
 * on the Services tab was being cured. A console pin can only ever find the
 * loud half of this class.
 *
 * So this file states the rule twice, over two different readers:
 *
 *   1. THE SOURCE CENSUS — every `<InstitutionLink` in src/ is located, its
 *      ENCLOSING JSX ELEMENT is resolved by a tag-stack scan, and that element
 *      must not be phrasing content. This is the arm that sees a caller written
 *      tomorrow, on a surface no test renders.
 *   2. THE RENDER — PowerStrata is mounted for real and every trigger's ancestor
 *      chain is walked. This is the arm that survives a source scan fooled by
 *      some JSX shape the tokenizer did not anticipate.
 *
 * Neither is redundant: the census cannot execute, and the render cannot see a
 * file it does not mount.
 */

import { describe, expect, test, vi } from 'vitest';
import { render } from '@testing-library/react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));

import { PowerStrata } from '../../src/components/new/tabs/power/PowerStrata.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// The repo root under vitest. NOT `import.meta.url`: the jsdom environment
// rewrites it to a `/@fs/…` dev-server path, which readdirSync cannot open.
const ROOT = process.cwd();

/**
 * Elements that may hold only phrasing content (or, for `<button>`, no
 * interactive content). A block-level dialog inside any of them is invalid
 * markup whether or not React happens to say so.
 */
const PHRASING_PARENTS = new Set([
  'span', 'p', 'a', 'button', 'em', 'strong', 'b', 'i', 'u', 's', 'small',
  'label', 'cite', 'code', 'abbr', 'q', 'sub', 'sup', 'summary',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
]);

const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'area', 'col']);

/**
 * Strip JS/JSX comments so prose that NAMES a tag ("wraps it in a `<p>`") is not
 * read as markup. Both this file's subjects carry docblocks that do exactly that,
 * which is how the scan first mis-resolved a parent.
 */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '');
}

/**
 * The JSX element enclosing `index`, by a tag-stack scan from the top of the
 * file. Attribute values are skipped with brace and quote depth so a `>` inside
 * `style={{…}}` cannot close a tag early.
 *
 * @returns {string|null} the enclosing tag name, or null at the top level.
 */
function enclosingTagAt(source, index) {
  const stack = [];
  let i = 0;
  while (i < index) {
    if (source[i] !== '<') { i += 1; continue; }
    const close = /^<\/\s*([A-Za-z][\w.]*)\s*>/.exec(source.slice(i));
    if (close) {
      for (let k = stack.length - 1; k >= 0; k -= 1) {
        if (stack[k] === close[1]) { stack.length = k; break; }
      }
      i += close[0].length;
      continue;
    }
    const open = /^<\s*([A-Za-z][\w.]*)/.exec(source.slice(i));
    if (!open) { i += 1; continue; }
    let j = i + open[0].length;
    let depth = 0;
    let quote = null;
    let selfClosing = false;
    while (j < source.length) {
      const c = source[j];
      if (quote) { if (c === quote) quote = null; j += 1; continue; }
      if (c === '"' || c === "'" || c === '`') { quote = c; j += 1; continue; }
      if (c === '{') { depth += 1; j += 1; continue; }
      if (c === '}') { depth -= 1; j += 1; continue; }
      if (depth === 0 && c === '/' && source[j + 1] === '>') { selfClosing = true; j += 2; break; }
      if (depth === 0 && c === '>') { j += 1; break; }
      j += 1;
    }
    if (j > index) return stack.length ? stack[stack.length - 1] : null; // index is inside this tag
    if (!selfClosing && !VOID_TAGS.has(open[1])) stack.push(open[1]);
    i = j;
  }
  return stack.length ? stack[stack.length - 1] : null;
}

function walkSrc(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSrc(p, out);
    else if (/\.jsx?$/.test(entry)) out.push(p);
  }
  return out;
}

describe('InstitutionLink renders a dialog, so its caller owes it a block container', () => {
  test('the source census: no call site sits inside phrasing content', () => {
    const files = walkSrc(join(ROOT, 'src'));
    /** @type {{site: string, parent: string}[]} */
    const bad = [];
    let sites = 0;

    for (const file of files) {
      const rel = relative(ROOT, file).replace(/\\/g, '/');
      if (rel.endsWith('primitives/InstitutionLink.jsx')) continue; // the definition
      const source = stripComments(readFileSync(file, 'utf8'));
      const re = /<InstitutionLink[\s/>]/g;
      let m;
      while ((m = re.exec(source)) !== null) {
        sites += 1;
        const parent = enclosingTagAt(source, m.index);
        const line = source.slice(0, m.index).split('\n').length;
        if (parent && PHRASING_PARENTS.has(parent)) {
          bad.push({ site: `${rel}:${line}`, parent });
        }
      }
    }

    // ANTI-VACUITY: a scan that found no call sites would pass while proving
    // nothing, and this is a regex over source — the exact shape that goes quiet.
    expect(sites, 'the census found no <InstitutionLink call sites at all').toBeGreaterThanOrEqual(3);

    expect(
      bad,
      `\n${bad.length} InstitutionLink call site(s) sit inside phrasing content.\n`
      + 'The card renders BESIDE the trigger, so the wrapper becomes a dialog\'s parent:\n'
      + `${bad.map(b => `  ${b.site}  inside <${b.parent}>`).join('\n')}\n`,
    ).toEqual([]);
  });

  test('the render: no trigger on PowerStrata has an inline ancestor', () => {
    const town = generateSettlementPipeline(
      { settType: 'city', terrain: 'grassland', tradeRouteAccess: 'road' },
      null,
      { seed: 'institution-link-block-container', customContent: {} },
    );
    const { container } = render(
      <PowerStrata
        settlement={town}
        powerStructure={town.powerStructure}
        expandedFaction={null}
        setExpandedFaction={() => {}}
        focusIndex={-1}
        focusedRowRef={{ current: null }}
      />,
    );

    const triggers = [...container.querySelectorAll('[aria-haspopup="dialog"]')];
    // ANTI-VACUITY: PowerStrata's roster is where the silent half of the class
    // lived, so a render that produced no trigger would prove nothing.
    expect(triggers.length, 'PowerStrata rendered no institution trigger').toBeGreaterThan(0);

    const offenders = triggers
      .map((el) => {
        for (let node = el.parentElement; node && node !== container; node = node.parentElement) {
          const tag = node.tagName.toLowerCase();
          if (PHRASING_PARENTS.has(tag)) return `<${tag}> above "${(el.textContent || '').trim().slice(0, 40)}"`;
        }
        return null;
      })
      .filter(Boolean);

    expect(offenders, `\n${offenders.join('\n')}\n`).toEqual([]);
  }, 60_000);
});
