/**
 * tensionSpareWordings.test.js — PAGE-2 T1 (brief docs/chair/2026-11-20/content/page/briefs/T1.md, 2026-11-20): A TENSION'S
 * SPARE WORDINGS, USED ALWAYS. Where a selected current tension prints its template's canonical `description` (not the
 * unanchored form, not the dated form, not a sentence the selection wrote for the town, not a kind keyed by migration
 * direction), the description is chosen among the canonical and its two spares (`historyDescVariants.js`) by a draw-free hash
 * of the town's own seed (`historyData.js :: tensionWording`). Before the cure the spares printed only where the canonical
 * would repeat the town's own past event word for word (`historyGenerator.js :: apartFromOwnEvent`): one form a kind.
 *
 * Every form is computed from the modules' exports, never quoted. A printed text is read back to its form by word overlap
 * (the tension's tokens, the place's own noun and the small-place twins move a few words, never the sentence).
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { SIZES } from '../components/pageCensusWalk.shared.mjs';
import {
  HISTORICAL_EVENTS_DATA, HISTORY_DESC_SIBLINGS, LEGITIMACY_HELD_TWINS, historyDescVariantsOf,
} from '../../src/data/historyData.js';
import { buildCurrentTensionTokens, renderHistoryTemplate } from '../../src/generators/historyTemplate.js';

const PER_SIZE = 50; // 300 towns, the chair's census (hxd-<size>-<i>)
const SEEDS = SIZES.flatMap((size) => Array.from({ length: PER_SIZE }, (_, i) => ({ size, seed: `hxd-${size}-${i}` })));
const BASE_SEEDS = SIZES.flatMap((size) => Array.from({ length: 10 }, (_, i) => ({ size, seed: `hxd-${size}-${i}` })));

/** @param {any} gen @param {{size: string, seed: string}} row */
const bornWith = (gen, row) => gen.generateSettlementPipeline(gen.birthConfig({ ...gen.DEFAULT_CONFIG, settType: row.size }), null,
  { seed: row.seed, customContent: {} });
const born = (row) => bornWith({ generateSettlementPipeline, birthConfig, DEFAULT_CONFIG }, row);

// ── reading a printed text back to its form ──────────────────────────────────────────────────────────────────────
const words = (text) => new Set(String(text).toLowerCase().replace(/\{[a-z_]+\}/g, ' ').match(/[a-z']+/g) || []);
const overlap = (a, b) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n / Math.max(1, Math.min(a.size, b.size)); };

/** Every authored text of a kind, labelled: the canonical (0), each spare (1, 2), and the forms that are not the case. */
function labelledForms(type) {
  const tmpl = HISTORICAL_EVENTS_DATA.find((e) => e.type === type);
  /** @type {Array<{label: string, text: string}>} */
  const out = [];
  const add = (label, text) => { if (typeof text === 'string' && text) out.push({ label, text }); };
  [tmpl.description, ...historyDescVariantsOf(type)].forEach((form, i) => {
    add(`form:${i}`, form);
    for (const sib of HISTORY_DESC_SIBLINGS[form] || []) add(`form:${i}`, sib.text);
    add(`form:${i}`, LEGITIMACY_HELD_TWINS[form]);
  });
  add('unanchored', tmpl.byMemory?.unanchored?.description);
  add('dated', tmpl.byMemory?.dated?.description);
  for (const t of Object.values(tmpl.descriptionByDirection || {})) add('direction', t);
  return out;
}
/** The label of the authored text a printed text reads as, or 'other' (a sentence the selection wrote for the town). */
function formOf(type, printed) {
  const p = words(printed);
  let best = { label: 'other', score: 0.6 };
  for (const f of labelledForms(type)) {
    const s = overlap(p, words(f.text));
    if (s > best.score) best = { label: f.label, score: s };
  }
  return best.label;
}

/** The canonical-anchored tensions of a town, each with its form; a tension whose own past event prints the canonical is
 *  left out (there the spare was taken before the cure too, so the fault does not show). */
function anchoredOf(s) {
  const timeline = s.history?.historicalEvents || [];
  return (s.history?.currentTensions || []).flatMap((t) => {
    if (HISTORICAL_EVENTS_DATA.find((e) => e.type === t.type)?.descriptionByDirection) return []; // keyed by direction: not the case
    const form = formOf(t.type, t.description);
    if (!form.startsWith('form:')) return [];
    const own = timeline.find((e) => e?.templateType === t.type);
    if (own && formOf(t.type, own.description) === 'form:0') return [];
    return [{ type: t.type, form }];
  });
}

describe('PAGE-2 T1 · a tension\'s spare wordings, used always', () => {
  /** @type {Array<{row: {size: string, seed: string}, s: any}>} */
  let towns = [];
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    towns = SEEDS.map((row) => ({ row, s: born(row) }));
  }, 600_000);

  it('every spare of every kind renders with the tension\'s own tokens (no token left unfilled)', () => {
    const tokens = buildCurrentTensionTokens({});
    const unfilled = HISTORICAL_EVENTS_DATA.flatMap((e) => historyDescVariantsOf(e.type)
      .map((form) => ({ type: e.type, text: renderHistoryTemplate(form, tokens) }))
      .filter(({ text }) => /\{[a-z_]+\}/.test(text)));
    expect(unfilled).toEqual([]);
  });

  it('(1) the canonical-anchored tensions show more than one form for at least one kind', () => {
    /** @type {Record<string, Record<string, number>>} */
    const byKind = {};
    for (const { s } of towns) for (const { type, form } of anchoredOf(s)) {
      byKind[type] ||= {};
      byKind[type][form] = (byKind[type][form] || 0) + 1;
    }
    const total = Object.values(byKind).reduce((n, f) => n + Object.values(f).reduce((a, b) => a + b, 0), 0);
    expect(total, 'premise: the case occurs in the sample').toBeGreaterThan(20);
    const manyForms = Object.entries(byKind).filter(([, f]) => Object.keys(f).length > 1).map(([k]) => k);
    expect(manyForms, JSON.stringify(byKind)).not.toEqual([]);
    // the legitimacy tension keeps its canonical: the record reads it against the seat by its words (LEGITIMACY_HELD_TWINS)
    expect(Object.keys(byKind.legitimacy_crisis || {}).filter((f) => f !== 'form:0')).toEqual([]);
    console.info(`[T1] canonical-anchored tensions by kind and form: ${JSON.stringify(byKind)}`);
  });

  it('(2) the same town born twice prints the same tension text', () => {
    expectNoSeedFailures(collectSeedFailures(SEEDS.filter((_, i) => i % 25 === 0), (row) => {
      const again = born(row);
      const first = towns.find((t) => t.row.seed === row.seed).s;
      expect(again.history.currentTensions.map((t) => t.description), row.seed)
        .toEqual(first.history.currentTensions.map((t) => t.description));
    }), 'T1 (2): the same town born twice prints the same tension text');
  });

  it('(3) no tension prints its own past event\'s text (COHERENCE-PRESUME)', () => {
    const repeats = towns.flatMap(({ row, s }) => (s.history?.currentTensions || []).filter((t) => {
      const own = (s.history?.historicalEvents || []).find((e) => e?.templateType === t.type);
      return own && own.description === t.description;
    }).map((t) => `${row.seed}:${t.type}`));
    expect(repeats).toEqual([]);
  });

  it('(4) every field but the tensions\' descriptions is unchanged against the base (60 towns, 10 a size)', async () => {
    // THE BASE, in this file: the same tree with the choice taken out (the one call site reads the template's own
    // description, `tensionDescription`, exactly as before the cure).
    vi.resetModules();
    vi.doMock('../../src/data/historyData.js', async (importOriginal) => {
      const real = /** @type {any} */ (await importOriginal());
      return { ...real, tensionWording: real.tensionDescription };
    });
    const baseGen = {
      ...(await import('../../src/generators/generateSettlementPipeline.js')),
      ...(await import('../../src/domain/density/densityCreateBoundary.js')),
      ...(await import('../../src/store/configSlice.js')),
    };
    await baseGen.loadGenerationLawPayloads();
    const base = BASE_SEEDS.map((row) => bornWith(baseGen, row));
    vi.doUnmock('../../src/data/historyData.js');
    vi.resetModules();
    const mask = (s) => JSON.parse(JSON.stringify({ ...s, history: { ...s.history,
      currentTensions: (s.history?.currentTensions || []).map((t) => ({ ...t, description: '<masked>' })) } }));
    let tensions = 0;
    let moved = 0;
    expectNoSeedFailures(collectSeedFailures(BASE_SEEDS, (row) => {
      const i = BASE_SEEDS.indexOf(row);
      const now = towns.find((t) => t.row.seed === row.seed).s;
      expect(mask(now), row.seed).toEqual(mask(base[i]));
      base[i].history.currentTensions.forEach((t, j) => {
        tensions++;
        if (t.description !== now.history.currentTensions[j].description) moved++;
      });
    }), 'T1 (4): every field but the tensions\' descriptions is unchanged against the base');
    console.info(`[T1] tensions whose text moved: ${moved} of ${tensions} (${((100 * moved) / tensions).toFixed(1)}%) over ${BASE_SEEDS.length} towns`);
    expect(moved, 'premise: the base is the tree before the cure (the choice moved some tension)').toBeGreaterThan(0);
  }, 600_000);
});

