/**
 * gen11-fields.census.mjs — MEASURE-GEN11-FIELDS (PROSE-2 helper, 2026-11-20). MEASURE ONLY.
 * Birth as map-birth.shared.mjs does (loadGenerationLawPayloads(), then
 * generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG, settType: size}), null, {seed, customContent: {}})),
 * with no compose (the receipt's battery reads the stored record, never a render; GEN11-108 ran the same way).
 * For each place: the receipt's record_coherence_battery judgment, the DS-GEN-11 pool key (live criticalIssuePoolKey
 * with recordCleanOf's reading), and, at every needs_review place, each battery finding attributed to the STORED FIELD
 * that holds it:
 *  - the record is walked exactly as recordBatteryFindings.js :: recordTextSurfaces walks it, keeping each string's
 *    path (array indices as []); the walk's joined text is checked equal to recordTextSurfaces' own (walkMatches);
 *  - defense-words (and faith-denial, food-words, magic-words): the instruments split sentences on \n, so they are
 *    re-run field by field on the same record;
 *  - tier-noun: the instrument runs once over the same joined `town` text the receipt reads, and each finding's index
 *    is mapped back to the field whose span holds it (exact; no per-field re-run that could move kept spans);
 *  - hook-truth-record, seat-holder: record-level, no field.
 * Attributed counts per check are compared to the receipt's own findings (countsMatch, detailsMatch).
 * Env: GEN11F_SIZES (comma list), GEN11F_N (seeds per size), GEN11F_OUT (jsonl path).
 */
import { writeFileSync, appendFileSync } from 'node:fs';
import { test } from 'vitest';
import { generateSettlementPipeline } from '../../../../../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../../../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../../../../../src/store/configSlice.js';
import { recordTextSurfaces } from '../../../../../../../src/generators/recordBatteryFindings.js';
import { recordBattery } from '../../../../../../../src/domain/coherence/recordBattery.js';
import { tierNounFindings } from '../../../../../../../src/domain/coherence/tierNounFindings.js';
import { foodwaysLineOf } from '../../../../../../../src/domain/foodways.js';
import { criticalIssuePoolKey } from '../../../../../../../src/domain/display/stateProse/generalStateProse.js';
import { byDesignItemsOf } from '../../../../../../../src/domain/display/validationOnPage.js';

const SIZES = String(process.env.GEN11F_SIZES || 'thorp,hamlet,village,town,city,metropolis').split(',');
const N = Number(process.env.GEN11F_N || 50);
const OUT = String(process.env.GEN11F_OUT);
const SKIPPED = new Set(['config', 'generationCoherenceReceipt', 'simulationTrace']);

/** recordTextSurfaces' walk, with paths (its `town` is a Set, so a repeated string is kept once, first path). */
function fieldsOf(settlement) {
  const rest = []; const town = []; const townSeen = new Set(); const seen = new Set();
  const superseded = foodwaysLineOf(settlement) ? settlement.culturalIdentity : null;
  const walk = (value, path) => {
    if (typeof value === 'string') {
      if (!/\s/.test(value.trim())) return;
      if (/town/i.test(value)) { if (!townSeen.has(value)) { townSeen.add(value); town.push({ path, value }); } }
      else rest.push({ path, value });
      return;
    }
    if (value == null || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) { for (const e of value) walk(e, `${path}[]`); return; }
    for (const [key, e] of Object.entries(value)) {
      if (key.startsWith('_') || SKIPPED.has(key) || (key === 'foodways' && value === superseded)) continue;
      walk(e, path ? `${path}.${key}` : key);
    }
  };
  walk(settlement, '');
  return { rest, town };
}

/** generalDeskRead.js :: recordCleanOf (not exported), copied. */
function recordCleanOf(r) {
  const j = r?.generationCoherenceReceipt?.judgments;
  const verdict = Array.isArray(j) ? j.find((x) => x?.id === 'record_coherence_battery')?.status : undefined;
  if (verdict === 'pass' && byDesignItemsOf(r?.economicViability, r).length > 0) return undefined;
  return verdict === 'pass' ? true : verdict === 'needs_review' ? false : undefined;
}

const mask = (s, name) => (name ? String(s).split(name).join('#') : String(s));
const PER_FIELD = ['defense-words', 'faith-denial', 'food-words', 'magic-words'];

test('gen11 fields census', async () => {
  await loadGenerationLawPayloads();
  writeFileSync(OUT, '');
  for (const size of SIZES) for (let i = 0; i < N; i++) {
    const seed = `hxd-${size}-${i}`;
    const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const judgment = town?.generationCoherenceReceipt?.judgments?.find((x) => x?.id === 'record_coherence_battery');
    const count = town?.economicViability?.metrics?.criticalIssueCount;
    const recordClean = recordCleanOf(town);
    const row = { seed, size, tier: town.tier, status: judgment?.status, count, poolKey: criticalIssuePoolKey(count, recordClean) };
    if (judgment?.status === 'needs_review') {
      const name = String(town.name || '');
      const { rest, town: townFields } = fieldsOf(town);
      const surfaces = recordTextSurfaces(town);
      const all = [...rest, ...townFields];
      const townJoined = townFields.map((f) => f.value).join('\n');
      row.walkMatches = all.map((f) => f.value).join('\n') === surfaces.all && townJoined === surfaces.town;
      const receiptByCheck = {};
      for (const f of judgment.findings) receiptByCheck[f.path] = (receiptByCheck[f.path] || 0) + 1;
      row.receiptFindings = judgment.findings.map((f) => ({ path: f.path, detail: mask(f.detail, name) }));
      const found = [];
      for (const fld of all) {
        for (const f of recordBattery(town, { record: fld.value }, { only: PER_FIELD })) {
          const word = f.check === 'defense-words' ? f.detail.split(' without ')[0] : '';
          found.push({ check: `battery.${f.check}`, word, detail: mask(f.detail, name), field: fld.path, example: mask(f.quote, name) });
        }
      }
      let off = 0;
      const spans = townFields.map((f) => { const s = { start: off, end: off + f.value.length, path: f.path }; off += f.value.length + 1; return s; });
      for (const f of tierNounFindings(town, townJoined)) {
        const span = spans.find((s) => f.index >= s.start && f.index < s.end);
        const fieldText = span ? townJoined.slice(span.start, span.end) : '';
        const local = span ? f.index - span.start : 0;
        found.push({ check: 'battery.tier-noun', word: f.phrase, detail: `"${f.phrase}" for a ${town.tier}`, field: span ? span.path : '(unmapped)',
          example: mask(fieldText.slice(Math.max(0, local - 90), local + 70), name) });
      }
      for (const f of recordBattery(town, {}, { only: ['hook-truth-record', 'seat-holder'] })) {
        found.push({ check: `battery.${f.check}`, word: '', detail: mask(f.detail, name), field: '(record-level)', example: mask(f.quote, name) });
      }
      const foundByCheck = {};
      for (const f of found) foundByCheck[f.check] = (foundByCheck[f.check] || 0) + 1;
      row.receiptByCheck = receiptByCheck; row.foundByCheck = foundByCheck;
      row.unnamed = receiptByCheck['battery.unnamed'] || 0;
      row.countsMatch = Object.keys({ ...receiptByCheck, ...foundByCheck }).filter((k) => k !== 'battery.unnamed')
        .every((k) => (receiptByCheck[k] || 0) === (foundByCheck[k] || 0));
      const ms = (xs) => xs.slice().sort().join('|');
      row.detailsMatch = ms(row.receiptFindings.filter((f) => f.path !== 'battery.unnamed').map((f) => f.detail)) === ms(found.map((f) => f.detail));
      row.found = found;
    }
    appendFileSync(OUT, `${JSON.stringify(row)}\n`);
  }
});
