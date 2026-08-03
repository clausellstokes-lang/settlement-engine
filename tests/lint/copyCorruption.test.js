/**
 * copyCorruption.test.js — R1 (Product finish) durable pin for the em-dash /
 * emoji-strip copy-corruption class.
 *
 * BACKGROUND. A mechanical pass once stripped em-dashes and leading emoji from
 * app-side copy, leaving four recurring residue shapes behind. F24 reversed the
 * first batch; a re-grade found the class had SURVIVED in more components
 * (ConfigurationPanel, OverviewTab, EconomicsTab, SummaryTab, DailyLifeTab,
 * VersionsTab, QuickInspector, PlacementDetailCard, SettlementPalette,
 * CatalogTabs, GenerateWizard, SupplyChainsPanel, PowerTab). Those were fixed.
 * This test is the guard so the class cannot silently return.
 *
 * It is a source SCAN (not a runtime assertion): it reads every JS/JSX file
 * under src/components and src/copy and fails on any of four signatures, each
 * tuned to ZERO false positives on the current tree:
 *
 *   SIG 1 — EMPTY ICON PROP/FIELD:  icon=""  |  icon:''  |  icon: ''
 *     The root cause of the "ScoreRow-style leading space" artifact: a render
 *     of `{icon} {label}` with an empty icon emits a stray leading space before
 *     the label. Banning the empty prop at the source prevents the regression
 *     without a brittle leading-space text scan (leading spaces are sometimes
 *     intentional — e.g. " vs ", " · " separators — so they are deliberately
 *     NOT pinned; the empty-icon ban covers the real defect at its cause).
 *
 *   SIG 2 — ', ' EMPTY-VALUE FALLBACK:  `x || ', '`  |  `return ', '`
 *     The corrupted empty-value placeholder. The sanctioned replacement is
 *     EMPTY_VALUE ('—'), exported from src/components/theme.js.
 *
 *   SIG 3 — ORPHAN VARIATION SELECTOR (U+FE0F) preceded by `>`, a quote, or
 *     whitespace. When a base emoji was stripped, its trailing U+FE0F was left
 *     orphaned (e.g. `<option>️ Mountain`, `resourceIcon || '️'`). A VALID
 *     emoji+VS16 (e.g. tabConstants `icon:'⚔️'`) has its FE0F immediately after
 *     the emoji base codepoint, never after `>`/quote/space, so it is NOT
 *     flagged — the class distinction is exact.
 *
 *   SIG 4 — CORRUPTED EM-DASH PLACEHOLDER:  `">,`  or  `}}>,`
 *     An attribute- or style-object-close immediately followed by ", " at the
 *     start of an element's text (e.g. `<option value="">, Choose …`,
 *     `…flex:1}}>, resilience …`). The em-dash was mechanically replaced by a
 *     comma. Restored to '—'. This shape excludes legitimate inline list commas
 *     (`</em>, <em>`) and JSDoc generics (`Array<…>, …`), which the naive `>,`
 *     scan would false-positive on.
 *
 * Zero exclusions are needed: all four signatures are 0 across the current
 * src/components + src/copy tree. If you legitimately need one of these shapes
 * in the future, prefer the sanctioned form (EMPTY_VALUE, a real icon glyph)
 * rather than widening this pin.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, it, expect } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// THE SCAN IS THE WHOLE OF src/ (icon sweep, 2026-08-03). It used to be
// ['src/components', 'src/copy'], and that narrowness made the guard a liar:
// the emoji-strip residue it exists to catch had SURVIVED, untouched, in every
// directory the walk never entered — 24 empty `icon` fields in
// src/data/resourceData.js, 15 in src/data/stressTypes.js, 5 in
// src/domain/display/threatAssessment.js, 9 in src/generators/computeActiveChains.js,
// and 27 orphan U+FE0F selectors across src/data. All were removed in the same
// commit as this widening; the scan is total so the class cannot simply relocate
// one directory sideways and go quiet again.
const SCAN_DIRS = ['src'];

// Each signature: a per-line regex + a human label. All must stay at 0 hits.
const SIGNATURES = [
  { id: 'empty-icon-prop',       re: /\bicon\s*[:=]\s*(?:""|'')/,        why: "empty icon prop/field (renders a stray leading space in `{icon} {label}`); remove the icon slot" },
  { id: 'comma-empty-fallback',  re: /(?:\|\|\s*|return\s+)', '/,        why: "', ' empty-value fallback; use EMPTY_VALUE from theme.js" },
  { id: 'orphan-variation-sel',  re: /[>'"\s]️/,                    why: "orphan U+FE0F variation selector (base emoji was stripped); remove it or restore a full glyph" },
  { id: 'comma-em-dash-holder',  re: /(?:"|\}\})>,\s/,                   why: "corrupted em-dash placeholder (`\">,` / `}}>,`); restore '—'" },
];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?|tsx?)$/.test(e)) out.push(p);
  }
  return out;
}

function findViolations() {
  const hits = [];
  for (const d of SCAN_DIRS) {
    for (const abs of walk(join(ROOT, d))) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/');
      const lines = readFileSync(abs, 'utf8').split('\n');
      lines.forEach((line, i) => {
        for (const sig of SIGNATURES) {
          if (sig.re.test(line)) hits.push(`${rel}:${i + 1}  [${sig.id}]  ${sig.why}`);
        }
      });
    }
  }
  return hits;
}

describe('copy-corruption pin (R1 — em-dash / emoji-strip residue)', () => {
  // NON-VACUITY: a zero-hit result only means something if the walk actually
  // read files. A bad path, a renamed directory, or a broken extension filter
  // would otherwise turn this pin permanently, silently green — the exact way
  // the old src/components-only scan hid the residue it was written to catch.
  it('the scan actually reaches the source tree', () => {
    const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));
    expect(files.length).toBeGreaterThan(500);
    expect(files.some((f) => f.replace(/\\/g, '/').includes('/src/data/'))).toBe(true);
    expect(files.some((f) => f.replace(/\\/g, '/').includes('/src/domain/'))).toBe(true);
    expect(files.some((f) => f.replace(/\\/g, '/').includes('/src/generators/'))).toBe(true);
    expect(files.some((f) => f.replace(/\\/g, '/').includes('/src/components/'))).toBe(true);
  });

  it('no empty-icon / \', \' fallback / orphan U+FE0F / comma-em-dash residue anywhere in src/', () => {
    const hits = findViolations();
    expect(
      hits,
      `Copy-corruption residue re-appeared (${hits.length}):\n${hits.join('\n')}\n\n` +
        `Each is a stripped em-dash or emoji artifact. Restore the intended '—' / EMPTY_VALUE / glyph.`,
    ).toEqual([]);
  });

  // Guardrail on the guard: the four signatures must actually catch their shapes,
  // so a future refactor can't neuter the pin into a no-op that trivially passes.
  it('signatures still match their canonical corrupted forms', () => {
    const byId = Object.fromEntries(SIGNATURES.map((s) => [s.id, s.re]));
    expect(byId['empty-icon-prop'].test('<ScoreRow label="X" icon=""/>')).toBe(true);
    expect(byId['empty-icon-prop'].test("{icon:'',label:'Economy'}")).toBe(true);
    expect(byId['comma-empty-fallback'].test("const t = a || ', ';")).toBe(true);
    expect(byId['comma-empty-fallback'].test("if (!ts) return ', ';")).toBe(true);
    expect(byId['orphan-variation-sel'].test(">️ Mountain")).toBe(true);
    expect(byId['orphan-variation-sel'].test("resourceIcon || '️'")).toBe(true);
    expect(byId['comma-em-dash-holder'].test('<option value="">, Choose an archetype')).toBe(true);
    expect(byId['comma-em-dash-holder'].test('flex:1}}>, resilience relies')).toBe(true);

    // …and must NOT flag the sanctioned / legitimate forms:
    expect(byId['orphan-variation-sel'].test("icon:'⚔️'")).toBe(false); // valid emoji+VS16 (⚔️)
    expect(byId['comma-em-dash-holder'].test('<em>Healing</em>, <em>Curse</em>')).toBe(false); // inline list comma
    expect(byId['empty-icon-prop'].test('icon="⚔️"')).toBe(false); // non-empty icon
    expect(byId['comma-empty-fallback'].test("names.join(', ')")).toBe(false); // join separator
  });
});
