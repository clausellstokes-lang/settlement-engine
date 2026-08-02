/**
 * Review addendum A-1 — prose-numerics class-kill + legacy ratchet.
 *
 * Reader prose may name quantities in world words, bands, and honest whole
 * counts. It may not expose the engine's float/scalar notation. This scanner
 * covers authored headline/summary/reason/receipt templates in JavaScript under
 * src and
 * the full E-E JSX corpus. Its four detector classes are independently mutant-
 * proven below; live debt is frozen by exact path + line + snippet identity in
 * .prose-numerics-baseline.json and may only shrink.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { scanProseNumericsSource } from '../helpers/proseNumericsWalk.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_PATH = join(ROOT, 'tests/lint/.prose-numerics-baseline.json');
const REVIEWED_TOTAL_CEILING = 401;
const REVIEWED_CATEGORY_CEILINGS = Object.freeze({
  floatInterpolation: 229,
  percentToken: 79,
  multiplier: 24,
  twoDecimalScore: 69,
});

function walkSourceFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walkSourceFiles(abs, out);
    else if (/\.(?:js|jsx)$/.test(entry)) out.push(abs);
  }
  return out;
}

function scanLiveTree() {
  const hits = [];
  const parseErrors = [];
  for (const abs of walkSourceFiles(join(ROOT, 'src')).sort()) {
    const path = relative(ROOT, abs).replace(/\\/g, '/');
    const result = scanProseNumericsSource({ source: readFileSync(abs, 'utf8'), path });
    hits.push(...result.hits);
    if (result.parseError) parseErrors.push(`${path}: ${result.parseError}`);
  }
  return { hits, parseErrors };
}

function ceilingViolations(hits) {
  const counts = Object.fromEntries(
    Object.keys(REVIEWED_CATEGORY_CEILINGS).map((category) => [category, 0]),
  );
  const unknownCategories = new Set();

  for (const hit of hits) {
    if (Object.prototype.hasOwnProperty.call(counts, hit.category)) {
      counts[hit.category] += 1;
    } else {
      unknownCategories.add(String(hit.category));
    }
  }

  const violations = [];
  if (hits.length > REVIEWED_TOTAL_CEILING) {
    violations.push(`total ${hits.length} exceeds reviewed ceiling ${REVIEWED_TOTAL_CEILING}`);
  }
  for (const [category, ceiling] of Object.entries(REVIEWED_CATEGORY_CEILINGS)) {
    if (counts[category] > ceiling) {
      violations.push(`${category} ${counts[category]} exceeds reviewed ceiling ${ceiling}`);
    }
  }
  for (const category of [...unknownCategories].sort()) {
    violations.push(`unknown detector category ${category} has no reviewed ceiling`);
  }
  return violations;
}

const LIVE = scanLiveTree();

describe('prose numerics detector discriminates (executed mutants)', () => {
  const cases = [
    {
      category: 'floatInterpolation',
      clean: "export const beat = { headline: 'The levy gathers.' };",
      mutant: 'export const beat = { headline: `The levy gathers at pressure ${pressure}.` };',
    },
    {
      category: 'percentToken',
      clean: "export const beat = { summary: 'The levy loses nearly half its strength.' };",
      mutant: 'export const beat = { summary: `The levy loses ${Math.round(loss * 100)}% of its strength.` };',
    },
    {
      category: 'multiplier',
      clean: "export const beat = { reasons: ['The levy outmatches the watch.'] };",
      mutant: 'export const beat = { reasons: [`The levy stands at ${depth}× the watch.`] };',
    },
    {
      category: 'twoDecimalScore',
      clean: "export const beat = { reason: 'The court believes the road unsafe.' };",
      mutant: 'export const beat = { reason: `The court reads danger ${score.toFixed(2)}.` };',
    },
  ];

  it.each(cases)('$category: the clean control stays quiet and the mutant is caught', ({ category, clean, mutant }) => {
    expect(scanProseNumericsSource({ source: clean, path: 'src/control.js' }).hits).toEqual([]);
    const found = scanProseNumericsSource({ source: mutant, path: 'src/mutant.js' }).hits;
    expect(found.map((hit) => hit.category)).toContain(category);
  });

  it('allows whole world counts and dates rather than banning all numbers', () => {
    const clean = 'export const beat = { summary: `${wagons} wagons arrived over ${years} years.` };';
    expect(scanProseNumericsSource({ source: clean, path: 'src/counts.js' }).hits).toEqual([]);
  });

  it('catches scalar concatenation as the same leak class as template interpolation', () => {
    const mutant = "export const beat = { headline: 'The court reads danger ' + score + '.' };";
    const found = scanProseNumericsSource({ source: mutant, path: 'src/concat-mutant.js' }).hits;
    expect(found.map((hit) => hit.category)).toContain('floatInterpolation');
  });
});

describe('E-E JSX prose numerics detector discriminates (executed mutants)', () => {
  const cases = [
    ['floatInterpolation', '<p>Pressure {score.toFixed(1)}</p>'],
    ['percentToken', '<p>Chance {Math.round(chance * 100)}%</p>'],
    ['multiplier', '<p>Commitment {depth}× the old mark</p>'],
    ['twoDecimalScore', '<p>Hold chance 0.62, roll 0.41</p>'],
  ];

  it.each(cases)('%s: a JSX mutant is caught', (category, body) => {
    const source = `export function Mutant() { return (${body}); }`;
    const result = scanProseNumericsSource({ source, path: 'src/Mutant.jsx' });
    expect(result.parseError).toBeNull();
    expect(result.hits.map((hit) => hit.category)).toContain(category);
  });

  it('the clean JSX control stays quiet', () => {
    const source = 'export function Clean() { return (<p>The watch is badly outmatched.</p>); }';
    expect(scanProseNumericsSource({ source, path: 'src/Clean.jsx' }).hits).toEqual([]);
  });

  it('layout/control/CSS numerics are not reader prose (negative matrix)', () => {
    const source = [
      "const css = '.meter { width: 100%; opacity: 0.62; }';",
      'export function SummaryTab({ active, cats, keyName }) {',
      '  return (<>',
      '    <style>{css}</style>',
      "    <p>{t('generate.title')}</p>",
      "    <p>{keyName.replace(/_/g, ' ')}</p>",
      "    <p>{cats.join(' / ')}</p>",
      "    <p>{active ? 'The gate is open.' : 'The gate is closed.'}</p>",
      "    <div style={{ width: '100%', opacity: 0.62, transform: 'scale(1.20)' }} />",
      '  </>);',
      '}',
    ].join('\n');
    const result = scanProseNumericsSource({ source, path: 'src/Clean.jsx' });
    expect(result.parseError).toBeNull();
    expect(result.hits).toEqual([]);
  });
});

describe('prose numerics live-tree ratchet (exact legacy identity, shrink-only)', () => {
  it('the complete JS/JSX corpus parses, so a green scan cannot mean skipped files', () => {
    expect(LIVE.parseErrors, LIVE.parseErrors.join('\n')).toEqual([]);
  });

  it('the committed exact baseline exists', () => {
    expect(
      existsSync(BASELINE_PATH),
      'baseline missing; restore the reviewed exact A-1 census rather than creating an empty or anonymous budget',
    ).toBe(true);
  });

  it('path + line + category + snippet debt exactly matches the committed baseline', () => {
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    expect(
      LIVE.hits,
      'A new prose numeric leaked, or legacy debt moved/fell. Humanize additions; when debt falls, regenerate once and review every removed row before committing the lower baseline.',
    ).toEqual(baseline);
  });

  it('the reviewed post-sweep total and per-category ceilings can only move down', () => {
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    const categoryCeilingTotal = Object.values(REVIEWED_CATEGORY_CEILINGS)
      .reduce((sum, ceiling) => sum + ceiling, 0);

    expect(categoryCeilingTotal).toBe(REVIEWED_TOTAL_CEILING);
    expect(
      ceilingViolations(baseline),
      'The committed baseline exceeds the reviewed 401-row census. Remove the leak; never raise a ceiling.',
    ).toEqual([]);
    expect(
      ceilingViolations(LIVE.hits),
      'The live tree exceeds the reviewed 401-row census. Humanize the new leak; never raise a ceiling.',
    ).toEqual([]);
  });

  it('a regenerated exact baseline cannot make an executed +1 leak green', () => {
    const mutant = scanProseNumericsSource({
      source: 'export const beat = { headline: `The court reads pressure ${pressure}.` };',
      path: 'src/governance-mutant.js',
    }).hits;
    expect(mutant.map((hit) => hit.category)).toEqual(['floatInterpolation']);

    const mutatedLive = [...LIVE.hits, ...mutant];
    const temporaryRegeneratedBaseline = JSON.parse(JSON.stringify(mutatedLive));
    expect(mutatedLive).toEqual(temporaryRegeneratedBaseline);
    expect(ceilingViolations(temporaryRegeneratedBaseline)).toEqual([
      'total 402 exceeds reviewed ceiling 401',
      'floatInterpolation 230 exceeds reviewed ceiling 229',
    ]);
  });

  it('the baseline itself has exact, unique, source-verifiable identities', () => {
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    const keys = baseline.map((hit) => `${hit.path}|${hit.line}|${hit.category}|${hit.snippet}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const hit of baseline) {
      expect(typeof hit.path).toBe('string');
      expect(Number.isInteger(hit.line) && hit.line > 0).toBe(true);
      expect(['floatInterpolation', 'percentToken', 'multiplier', 'twoDecimalScore']).toContain(hit.category);
      expect(typeof hit.snippet === 'string' && hit.snippet.length > 0).toBe(true);
      const source = readFileSync(join(ROOT, hit.path), 'utf8');
      const sourceLines = source.split(/\r?\n/);
      expect((sourceLines[hit.line - 1] || '').trim().length, `${hit.path}:${hit.line} is no longer a source line`)
        .toBeGreaterThan(0);
      const frozenSource = hit.snippet.endsWith('...') ? hit.snippet.slice(0, -3) : hit.snippet;
      expect(oneLineForIdentity(source), `${hit.path}:${hit.line} no longer contains its frozen snippet`)
        .toContain(frozenSource);
    }
  });
});

function oneLineForIdentity(text) {
  return text.replace(/\s+/g, ' ').trim();
}
