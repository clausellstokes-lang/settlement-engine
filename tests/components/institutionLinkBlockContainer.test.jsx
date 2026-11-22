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
 *
 * ⛔ AND THE CONTAINER DOES NOT ONLY HAVE A TYPE — IT HAS HANDLERS (review 13).
 * The same in-place mount that made the wrapper a dialog's PARENT also made it
 * the dialog's event host. PowerStrata's faction row is a `role="button"` div
 * whose onClick toggles it, so every click inside the open profile — its body,
 * its rows, and the Close button — bubbled into that row and toggled it behind
 * the card. The last describe below is that class: it renders PowerStrata with
 * its expand state held for real, opens a profile, closes it, and asserts the
 * row is exactly as the reader left it.
 */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { useState } from 'react';
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
 * EVERY JSX element enclosing `index`, outermost first, by a tag-stack scan from
 * the top of the file. Attribute values are skipped with brace and quote depth so
 * a `>` inside `style={{…}}` cannot close a tag early.
 *
 * ⛔ THE WHOLE STACK, NOT THE TOP OF IT (review 13). This returned only the
 * IMMEDIATE parent, so `<b><div><InstitutionLink/></div></b>` passed: the scan
 * saw the `<div>`, called it a block container and stopped. The `<b>` is still a
 * phrasing element and the browser still implies its close at the dialog's first
 * block tag — the defect is two levels up rather than one, and one level was all
 * this could see. Every ancestor is returned and every ancestor is judged.
 *
 * @returns {string[]} the enclosing tag names, outermost first (empty at the top level).
 */
function enclosingTagsAt(source, index) {
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
    if (j > index) return [...stack];                       // index is inside this tag
    if (!selfClosing && !VOID_TAGS.has(open[1])) stack.push(open[1]);
    i = j;
  }
  return [...stack];
}

function walkSrc(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSrc(p, out);
    else if (/\.jsx?$/.test(entry)) out.push(p);
  }
  return out;
}

afterEach(cleanup);

// One pipeline settlement for every render below — a real one, because the roster
// row this file is about only exists when the derivation produces factions with
// resolvable institutions. Memoised: generating it per test is seconds each.
let cachedTown = null;
function town() {
  cachedTown = cachedTown || generateSettlementPipeline(
    { settType: 'city', terrain: 'grassland', tradeRouteAccess: 'road' },
    null,
    { seed: 'institution-link-block-container', customContent: {} },
  );
  return cachedTown;
}

/**
 * PowerStrata with the roster's expand state held FOR REAL.
 *
 * The component takes `expandedFaction`/`setExpandedFaction` from its caller
 * (PowerTab owns them so the NPC-faction focus affordance can drive them), so a
 * harness that passed a constant and a no-op would make the row's aria-expanded
 * a fixed string and every assertion about toggling vacuous.
 */
function StatefulStrata() {
  const [expandedFaction, setExpandedFaction] = useState(null);
  return (
    <PowerStrata
      settlement={town()}
      powerStructure={town().powerStructure}
      expandedFaction={expandedFaction}
      setExpandedFaction={setExpandedFaction}
      focusIndex={-1}
      focusedRowRef={{ current: null }}
    />
  );
}

const renderStrata = () => render(<StatefulStrata />);

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
        const ancestors = enclosingTagsAt(source, m.index);
        const line = source.slice(0, m.index).split('\n').length;
        const phrasing = ancestors.filter((tag) => PHRASING_PARENTS.has(tag));
        if (phrasing.length) {
          bad.push({ site: `${rel}:${line}`, parent: phrasing.join('> inside <') });
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

  test('a phrasing ancestor ANY distance up is caught, not just the immediate parent', () => {
    // ⛔ THE CONTROL FOR THE WHOLE-STACK SCAN. The census asserts an EMPTY list,
    // which is also what a scan that resolves one level and stops produces once
    // the tree is clean. These three sources are judged by the real function.
    const direct = enclosingTagsAt('<span><InstitutionLink /></span>', 6);
    expect(direct.filter((t) => PHRASING_PARENTS.has(t)), 'the immediate phrasing parent').toEqual(['span']);

    const buried = '<b><div><InstitutionLink /></div></b>';
    expect(
      enclosingTagsAt(buried, buried.indexOf('<InstitutionLink')).filter((t) => PHRASING_PARENTS.has(t)),
      'a phrasing grandparent behind a block parent — the shape the one-level scan passed',
    ).toEqual(['b']);

    const clean = '<div><section><InstitutionLink /></section></div>';
    expect(
      enclosingTagsAt(clean, clean.indexOf('<InstitutionLink')).filter((t) => PHRASING_PARENTS.has(t)),
      'a genuinely block chain is reported as an offender',
    ).toEqual([]);
  });

  test('the render: no trigger on PowerStrata has an inline ancestor', () => {
    const { container } = renderStrata();

    const triggers = [...container.querySelectorAll('[aria-haspopup="dialog"]')];
    // ANTI-VACUITY: PowerStrata's roster is where the silent half of the class
    // lived, so a render that produced no trigger would prove nothing.
    expect(triggers.length, 'PowerStrata rendered no institution trigger').toBeGreaterThan(0);

    // ⭐ EVERY ANCESTOR UP TO THE PANEL, BY TWO SIGNALS. The tag list is the HTML
    // content model and is what the parser acts on; the computed `display: inline`
    // is the one a COMPONENT wrapper hides — `<Row>` is not a tag this walk can
    // name, but whatever it renders is, and a `<div style={{display:'inline'}}>`
    // is a box no tag name would betray. The source census cannot resolve a
    // component at all, which is exactly why this arm walks the real DOM.
    const offenders = triggers
      .flatMap((el) => {
        const label = (el.textContent || '').trim().slice(0, 40);
        const found = [];
        for (let node = el.parentElement; node && node !== container; node = node.parentElement) {
          const tag = node.tagName.toLowerCase();
          if (PHRASING_PARENTS.has(tag)) found.push(`<${tag}> above "${label}" (phrasing content)`);
          else if (getComputedStyle(node).display === 'inline') found.push(`<${tag}> above "${label}" (display: inline)`);
        }
        return found;
      });

    expect(offenders, `\n${offenders.join('\n')}\n`).toEqual([]);
  }, 60_000);
});

/**
 * ⛔ THE SECOND CONSEQUENCE OF RENDERING THE CARD IN PLACE, AND THE ONE A READER
 * ACTUALLY FELT.
 *
 * The card is not merely INSIDE a container that may be the wrong element type —
 * it is inside a container that LISTENS. PowerStrata's faction row is a
 * `role="button"` div whose onClick toggles it, and the card is a
 * `position: fixed` overlay rendered as its DOM descendant. So every click the
 * reader made on the open profile — its body, its contribution rows, and the
 * Close button itself — bubbled into that row and toggled it. Opening the card
 * was already safe because `InstitutionLink` stops its own trigger's click;
 * nothing stopped the CARD's, and nobody had looked at the way out.
 */
describe('the open profile does not click through to the row behind it', () => {
  test('closing the card leaves the faction row exactly as the reader left it', () => {
    const { container } = renderStrata();

    // Find a roster row that both EXPANDS and carries a resolving institution
    // trigger — the two properties the defect needs, and neither is guaranteed
    // of any particular faction on any particular seed.
    const row = [...container.querySelectorAll('[role="button"][aria-expanded]')]
      .find((el) => el.querySelector('[aria-haspopup="dialog"]'));
    expect(row, 'no PowerStrata row both expands and holds an institution trigger').toBeTruthy();

    fireEvent.click(row);
    expect(row.getAttribute('aria-expanded'), 'the row did not open').toBe('true');

    const trigger = row.querySelector('[aria-haspopup="dialog"]');
    fireEvent.click(trigger);
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog, 'the institution profile did not open').toBeTruthy();
    expect(row.getAttribute('aria-expanded'), 'opening the card toggled the row').toBe('true');

    // A click on the card's own body is a click inside the row's box.
    fireEvent.click(dialog.querySelector('h2'));
    expect(row.getAttribute('aria-expanded'), 'a click on the card body toggled the row').toBe('true');
    expect(container.querySelector('[role="dialog"]'), 'the card closed on its own heading').toBeTruthy();

    // ⭐ THE ONE THE READER HITS. Close dismisses the card AND must leave the row
    // open; without the overlay's stopPropagation this assertion reads 'false'.
    const close = [...dialog.querySelectorAll('button')]
      .find((b) => (b.getAttribute('aria-label') || b.textContent || '').includes('Close'));
    expect(close, 'the card rendered no Close control').toBeTruthy();
    fireEvent.click(close);
    expect(container.querySelector('[role="dialog"]'), 'Close did not dismiss the card').toBeFalsy();
    expect(row.getAttribute('aria-expanded'), 'Close toggled the row behind the card').toBe('true');
  }, 60_000);

  test('Escape still reaches the focus trap, which listens on window', () => {
    // ⚠ THE LIMIT ON THE CURE, ASSERTED. `useDialogFocusTrap` binds keydown on
    // WINDOW and React's synthetic stopPropagation calls the native one, so a
    // blanket keydown stop at the overlay would have cut Escape and Tab off from
    // the hook that makes this a modal at all. The overlay stops Enter and Space
    // only; this is the arm that would red if that ever widened.
    const { container } = renderStrata();
    const trigger = container.querySelector('[aria-haspopup="dialog"]');
    expect(trigger, 'PowerStrata rendered no institution trigger').toBeTruthy();
    fireEvent.click(trigger);
    expect(container.querySelector('[role="dialog"]'), 'the profile did not open').toBeTruthy();

    fireEvent.keyDown(container.querySelector('[role="dialog"]'), { key: 'Escape' });
    expect(container.querySelector('[role="dialog"]'), 'Escape no longer dismisses the card').toBeFalsy();
  }, 60_000);
});
