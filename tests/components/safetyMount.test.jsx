/** @vitest-environment jsdom */
/**
 * safetyMount.test.jsx — PAGE-4 SAFETY-MOUNT: THE SAFETY LINE'S AUDIENCE FAILS CLOSED AT THE MOUNT (the chair's ruling of
 * 15:58 UTC, briefs/SAFETY-MOUNT.md). `safetyShown.js :: safetyAudienceOf` gives the owner's line only where BOTH
 * `publicDossier` and `playerView` are said and false; the two tabs defaulted both to false BEFORE handing them over, so a
 * caller that passed neither got the owner's line. The tabs now hand it the two props AS PASSED (an omitted prop is a
 * reader); every other use of the two flags in the tabs keeps its default.
 *
 * (1) THE MOUNT: each tab mounted with a town whose owner's line exists prints the line only when both props are passed
 *     as false; with neither prop, or with only one of them, it prints no `overview-safety-beside-law` /
 *     `defense-safety-beside-law`.
 * (2) THE MOUNT CENSUS: every place in `src/` that holds `OverviewTab` or `DefenseTab` (an import of the tab's module, the
 *     lazy registry `dossierLazyTabs.js`, a name imported from it) is found, and every use of that binding is a JSX mount
 *     that passes BOTH props by name. A mount that passes neither or one fails unless it is a reader page (READER_PAGES,
 *     empty today: such a page now gets the reader's line anyway); a use that is not a JSX mount (a component map, a
 *     createElement, a re-export) fails as unclassified, the fail-closed direction. Planted sources prove it can red.
 */
import React from 'react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { safetyShownOf } from '../../src/domain/display/safetyShown.js';
import { codeOnly, commentsOnly } from '../helpers/codeOnlySource.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { SIZES } from './pageCensusWalk.shared.mjs';

afterEach(cleanup);

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/** The two tabs and the testid of the owner's line each prints. */
const TABS = {
  overview: { Tab: OverviewTab, testId: 'overview-safety-beside-law' },
  defense: { Tab: DefenseTab, testId: 'defense-safety-beside-law' },
};

/** The audiences a caller can hand the tab, as PASSED (an absent key is an omitted prop). */
const OMITTED = {
  neither: {},
  'publicDossier only': { publicDossier: false },
  'playerView only': { playerView: false },
};

/** @type {{ seed: string, town: any, line: string } | null} */
let OWNED = null;
beforeAll(async () => {
  await loadGenerationLawPayloads();
  // The first of the chair's 300 (measure A's recipe) whose owner's line exists: the record decides, nothing is quoted.
  for (let i = 0; i < 50 && !OWNED; i++) for (const size of SIZES) {
    const seed = `hxd-${size}-${i}`;
    const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const line = safetyShownOf(town, 'owner').qualifier;
    if (line) { OWNED = { seed, town, line }; break; }
  }
}, 600000);

describe('(1) the Safety line\'s audience is read from the props AS PASSED: an omitted prop is a reader', () => {
  test('a town with an owner\'s line exists among the chair\'s 300', () => {
    expect(OWNED?.line).toBeTruthy();
  });
  for (const [tab, { Tab, testId }] of Object.entries(TABS)) {
    test(`${tab}: both props passed as false (the owner's page) still prints the line`, () => {
      const { queryByTestId } = render(<Tab settlement={OWNED?.town} narrativeNote={null} publicDossier={false} playerView={false} />);
      expect(queryByTestId(testId)?.textContent).toBe(OWNED?.line);
    });
    for (const [who, props] of Object.entries(OMITTED)) {
      test(`${tab}: mounted with ${who} prints no owner's line`, () => {
        const owner = render(<Tab settlement={OWNED?.town} narrativeNote={null} publicDossier={false} playerView={false} />);
        const before = owner.container.textContent ?? '';
        cleanup();
        const { queryByTestId, container } = render(<Tab settlement={OWNED?.town} narrativeNote={null} {...props} />);
        expect(container.innerHTML.length).toBeGreaterThan(0);
        expect(queryByTestId(testId)).toBeNull(); // anchored: the owner's mount of the same town prints this testid (the test above, and `before` below)
        expectPresentThenAbsent(before, container.textContent ?? '', OWNED?.line, `${tab} owner's page, then ${who}`);
      });
    }
  }
});

// ── (2) THE MOUNT CENSUS ─────────────────────────────────────────────────────────────────────────────────────────────
const TAB_MODULES = { OverviewTab: 'src/components/new/tabs/OverviewTab', DefenseTab: 'src/components/new/tabs/DefenseTab' };
const REGISTRY = 'src/components/dossier/dossierLazyTabs';
/**
 * The mounts that may pass fewer than both props because the page is a reader page (it gets the reader's line anyway
 * now). `<file>:<tab>` → why. EMPTY TODAY: every mount in src/ passes both.
 * @type {Record<string, string>}
 */
const READER_PAGES = {};

/** @param {string} dir @returns {string[]} repo-relative posix paths of every source file under dir */
function walk(dir) {
  const out = [];
  for (const name of readdirSync(join(ROOT, dir)).sort()) {
    const rel = posix.join(dir, name);
    if (statSync(join(ROOT, rel)).isDirectory()) out.push(...walk(rel));
    else if (/\.(m?js|jsx|ts|tsx)$/.test(name)) out.push(rel);
  }
  return out;
}

/** @param {string} from repo-relative file @param {string} spec import specifier @returns {string} repo-relative, no extension */
function resolveSpec(from, spec) {
  if (!spec.startsWith('.')) return spec;
  return relative(ROOT, resolve(ROOT, posix.dirname(from), spec)).split('\\').join('/').replace(/\.(m?js|jsx|ts|tsx)$/, '');
}

/** The attribute names of a JSX tag's depth-0 text, and whether it spreads. @param {string} code @param {number} at after the name */
function tagAttributes(code, at) {
  let depth = 0;
  let flat = '';
  let spread = false;
  for (let i = at; i < code.length; i++) {
    const c = code[i];
    if (c === '{') { if (depth === 0 && /^\{\s*\.\.\./.test(code.slice(i, i + 8))) spread = true; depth += 1; continue; }
    if (c === '}') { depth -= 1; continue; }
    if (depth === 0 && c === '>') break;
    if (depth === 0) flat += c;
  }
  return { names: new Set([...flat.matchAll(/([A-Za-z_$][\w$-]*)\s*=/g)].map((m) => m[1])), spread };
}

/**
 * THE CENSUS over a set of sources: every binding of the two tabs, and every use of each binding.
 * @param {Record<string, string>} sources repo-relative path → raw source
 * @returns {{ mounts: { file: string, tab: string, passes: string[] }[], unclassified: string[] }}
 */
function mountCensus(sources) {
  /** @type {{ file: string, local: string, tab: string, span: [number, number] }[]} */
  const bindings = [];
  const unclassified = [];
  for (const [file, whole] of Object.entries(sources)) {
    const raw = commentsOnly(whole); // a path or an import written in a comment binds nothing
    const self = file.replace(/\.(m?js|jsx|ts|tsx)$/, '');
    if (Object.values(TAB_MODULES).includes(self)) continue; // the tab's own definition
    let accounted = 0;
    // A lazy registry entry: `const X = lazy(() => import('…/tabs/OverviewTab'))`.
    for (const m of raw.matchAll(/\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*lazy\(\s*\(\)\s*=>\s*import\(\s*['"]([^'"]+)['"]\s*\)\s*\)/g)) {
      const tab = Object.keys(TAB_MODULES).find((t) => TAB_MODULES[t] === resolveSpec(file, m[2]));
      if (!tab) continue;
      accounted += 1;
      bindings.push({ file, local: m[1], tab, span: [m.index, m.index + m[0].length] });
    }
    // A static import of the tab's module, or of a tab's name from the registry.
    for (const m of raw.matchAll(/\bimport\s+([\s\S]*?)\s+from\s*['"]([^'"]+)['"]/g)) {
      const target = resolveSpec(file, m[2]);
      const clause = m[1];
      const span = /** @type {[number, number]} */ ([m.index, m.index + m[0].length]);
      const direct = Object.keys(TAB_MODULES).find((t) => TAB_MODULES[t] === target);
      if (direct) {
        accounted += 1;
        const named = clause.match(/\{([\s\S]*)\}/)?.[1] ?? '';
        for (const part of named.split(',')) {
          const [name, alias] = part.trim().split(/\s+as\s+/);
          if (name === direct || name === 'default') bindings.push({ file, local: (alias || name).trim(), tab: direct, span });
        }
        const def = clause.replace(/\{[\s\S]*\}/, '').split(',')[0].trim();
        if (def && !def.startsWith('*')) bindings.push({ file, local: def, tab: direct, span });
        if (def.startsWith('*')) unclassified.push(`${file}: a namespace import of ${direct}`);
      } else if (target === REGISTRY) {
        const named = clause.match(/\{([\s\S]*)\}/)?.[1] ?? '';
        for (const part of named.split(',')) {
          const [name, alias] = part.trim().split(/\s+as\s+/);
          const tab = Object.keys(TAB_MODULES).find((t) => t === name);
          if (tab) bindings.push({ file, local: (alias || name).trim(), tab, span });
        }
        if (/\*\s+as\b/.test(clause)) unclassified.push(`${file}: a namespace import of the tab registry`);
      }
    }
    // Every spelling of a tab module's path must be one of the bindings above (a bare dynamic import, a re-export…).
    const paths = [...raw.matchAll(/['"]([^'"]*\/tabs\/(?:OverviewTab|DefenseTab)(?:\.jsx)?)['"]/g)]
      .filter((m) => Object.values(TAB_MODULES).includes(resolveSpec(file, m[1])));
    if (paths.length > accounted) unclassified.push(`${file}: ${paths.length - accounted} path(s) to a tab bound by no import this census reads`);
  }
  /** @type {{ file: string, tab: string, passes: string[] }[]} */
  const mounts = [];
  const byFile = new Map();
  for (const b of bindings) byFile.set(b.file, [...(byFile.get(b.file) ?? []), b]);
  for (const [file, list] of byFile) {
    const code = codeOnly(sources[file]);
    for (const { local, tab } of list) {
      for (const m of code.matchAll(new RegExp(`(^|[^\\w$.])(${local.replace(/\$/g, '\\$')})(?![\\w$])`, 'g'))) {
        const at = m.index + m[1].length;
        if (list.some((b) => at >= b.span[0] && at < b.span[1])) continue; // the binding itself
        if (file.replace(/\.(m?js|jsx|ts|tsx)$/, '') === REGISTRY && /\bexport\s+const\s+$/.test(code.slice(Math.max(0, at - 20), at))) continue;
        if (code.slice(at - 2, at) === '</') continue; // a closing tag
        if (code[at - 1] === '<') {
          const { names, spread } = tagAttributes(code, at + local.length);
          const passes = ['publicDossier', 'playerView'].filter((p) => names.has(p));
          mounts.push({ file, tab, passes: spread && passes.length < 2 ? [...passes, '…spread'] : passes });
          continue;
        }
        const lineNo = code.slice(0, at).split('\n').length;
        unclassified.push(`${file}:${lineNo}: ${local} (${tab}) is used but not mounted as JSX`);
      }
    }
  }
  return { mounts, unclassified };
}

/** @param {{ file: string, tab: string, passes: string[] }} m */
const passesBoth = (m) => m.passes.includes('publicDossier') && m.passes.includes('playerView');

describe('(2) THE MOUNT CENSUS: every mount of OverviewTab and DefenseTab in src/ passes both props or is a reader page', () => {
  const sources = Object.fromEntries(walk('src').map((f) => [f, readFileSync(join(ROOT, f), 'utf8')]));
  const census = mountCensus(sources);

  test('the census finds the two tabs mounted, and every use of them is a JSX mount', () => {
    console.log(`SAFETY MOUNT CENSUS: ${census.mounts.length} mount(s)\n${census.mounts
      .map((m) => `  ${m.file} <${m.tab}> passes [${m.passes.join(', ')}] ${passesBoth(m) ? 'BOTH' : (READER_PAGES[`${m.file}:${m.tab}`] ? 'READER PAGE' : 'FAILS')}`)
      .join('\n')}`);
    expect(census.unclassified).toEqual([]);
    for (const tab of Object.keys(TAB_MODULES)) expect(census.mounts.some((m) => m.tab === tab)).toBe(true);
  });

  test('no mount passes neither or one of publicDossier and playerView (unless it is a reader page)', () => {
    const short = census.mounts.filter((m) => !passesBoth(m) && !READER_PAGES[`${m.file}:${m.tab}`]);
    expect(short).toEqual([]);
  });

  test('NEGATIVE CONTROLS: planted mounts with neither, one, a spread, and a component map are caught', () => {
    const planted = {
      'src/components/plantA.jsx': "import { OverviewTab } from './new/tabs/OverviewTab.jsx';\nexport const A = (s) => <OverviewTab settlement={s} />;\n",
      'src/components/plantB.jsx': "import Def from './new/tabs/DefenseTab';\nexport const B = (s, f) => <Def settlement={s} playerView={f} />;\n",
      'src/components/plantC.jsx': "import { DefenseTab as D } from './dossier/dossierLazyTabs.js';\nexport const C = (p) => <D {...p} />;\n",
      'src/components/plantD.jsx': "import { OverviewTab } from './dossier/dossierLazyTabs.js';\nexport const MAP = { overview: OverviewTab };\n",
      'src/components/plantE.jsx': "export const E = () => import('./new/tabs/DefenseTab.jsx');\n",
      'src/components/plantF.jsx': "import { OverviewTab } from './new/tabs/OverviewTab.jsx';\nexport const F = (s) => <OverviewTab settlement={s} publicDossier={false} playerView={false} />;\n",
    };
    const got = mountCensus(planted);
    expect(got.mounts.filter((m) => !passesBoth(m)).map((m) => `${m.file}:${m.passes.join('+')}`)).toEqual([
      'src/components/plantA.jsx:', 'src/components/plantB.jsx:playerView', 'src/components/plantC.jsx:…spread',
    ]);
    expect(got.mounts.filter(passesBoth).map((m) => m.file)).toEqual(['src/components/plantF.jsx']);
    expect([...got.unclassified].sort()).toEqual([
      'src/components/plantD.jsx:2: OverviewTab (OverviewTab) is used but not mounted as JSX',
      'src/components/plantE.jsx: 1 path(s) to a tab bound by no import this census reads',
    ]);
  });
});
