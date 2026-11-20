/**
 * wording.census.mjs — MEASURE-WORDING (PROSE-2 helper, 2026-11-20). MEASURE ONLY.
 * Same birth as ../gen11-fields/gen11-fields.census.mjs (loadGenerationLawPayloads(), then
 * generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG, settType: size}), null, {seed, customContent: {}})),
 * same seeds hxd-<size>-0..N-1, no compose. Its walk (fieldsOf) is that census's, copied, plus each string's owner.
 * Per place, at EVERY place (not only needs_review), it records:
 *  - fault 1: every tier-noun finding over the receipt's joined `town` text, mapped to its field, with the whole field;
 *  - fault 2: every stored string carrying "hospital", with its path; for institutions[] the row's name and category;
 *    defenseFactsOf's hasHospital/hasHealer/healerName; and whether defense-words flags that string;
 *  - fault 3: every stored string carrying "walled apart" or its small-place twin "keep apart", with its path, the
 *    owning event/tension/annotation's own words, hasWalls, and whether defense-words flags it.
 * Env: WORD_SIZES (comma list), WORD_N (seeds per size), WORD_OUT (jsonl path).
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
import { defenseFactsOf } from '../../../../../../../src/domain/defense/defenseFacts.js';

const SIZES = String(process.env.WORD_SIZES || 'thorp,hamlet,village,town,city,metropolis').split(',');
const N = Number(process.env.WORD_N || 50);
const OUT = String(process.env.WORD_OUT);
const SKIPPED = new Set(['config', 'generationCoherenceReceipt', 'simulationTrace']);

/** gen11-fields.census.mjs :: fieldsOf, copied, plus the owning object of each string. */
function fieldsOf(settlement) {
  const rest = []; const town = []; const townSeen = new Set(); const seen = new Set();
  const superseded = foodwaysLineOf(settlement) ? settlement.culturalIdentity : null;
  const walk = (value, path, owner) => {
    if (typeof value === 'string') {
      if (!/\s/.test(value.trim())) return;
      if (/town/i.test(value)) { if (!townSeen.has(value)) { townSeen.add(value); town.push({ path, value, owner }); } }
      else rest.push({ path, value, owner });
      return;
    }
    if (value == null || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) { for (const e of value) walk(e, `${path}[]`, owner); return; }
    for (const [key, e] of Object.entries(value)) {
      if (key.startsWith('_') || SKIPPED.has(key) || (key === 'foodways' && value === superseded)) continue;
      walk(e, path ? `${path}.${key}` : key, value);
    }
  };
  walk(settlement, '', null);
  return { rest, town };
}

const mask = (s, name) => (name ? String(s).split(name).join('#') : String(s));
/** The owning object's short string fields, for context. */
const ownerWords = (o, name) => {
  if (!o || typeof o !== 'object') return null;
  const out = {};
  for (const [k, v] of Object.entries(o)) {
    if (typeof v === 'string' && v.length < 400) out[k] = mask(v, name);
    else if (Array.isArray(v) && v.every((x) => typeof x === 'string')) out[k] = v.map((x) => mask(x, name));
  }
  return out;
};

test('wording census', async () => {
  await loadGenerationLawPayloads();
  writeFileSync(OUT, '');
  for (const size of SIZES) for (let i = 0; i < N; i++) {
    const seed = `hxd-${size}-${i}`;
    const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const judgment = town?.generationCoherenceReceipt?.judgments?.find((x) => x?.id === 'record_coherence_battery');
    const name = String(town.name || '');
    const facts = defenseFactsOf(town);
    const { rest, town: townFields } = fieldsOf(town);
    const surfaces = recordTextSurfaces(town);
    const all = [...rest, ...townFields];
    const townJoined = townFields.map((f) => f.value).join('\n');
    const findings = judgment?.findings || [];
    const row = { seed, size, tier: town.tier, status: judgment?.status,
      walkMatches: all.map((f) => f.value).join('\n') === surfaces.all && townJoined === surfaces.town,
      hasHospital: facts.hasHospital, hasHealer: facts.hasHealer, healerName: facts.healerName, hasWalls: facts.hasWalls,
      receiptTierNoun: findings.filter((f) => f.path === 'battery.tier-noun').length,
      receiptHospital: findings.filter((f) => /^hospital without/.test(String(f.detail))).length,
      receiptWalledApart: findings.filter((f) => /walled apart/.test(String(f.quote || ''))).length,
      f1: [], f2: [], f3: [] };
    // fault 1
    let off = 0;
    const spans = townFields.map((f) => { const s = { start: off, end: off + f.value.length, f }; off += f.value.length + 1; return s; });
    for (const tn of tierNounFindings(town, townJoined)) {
      const span = spans.find((s) => tn.index >= s.start && tn.index < s.end);
      row.f1.push({ phrase: tn.phrase, field: span ? span.f.path : '(unmapped)', text: span ? mask(span.f.value, name) : '' });
    }
    // faults 2 and 3
    for (const fld of all) {
      const dw = () => recordBattery(town, { record: fld.value }, { only: ['defense-words'] }).map((f) => mask(f.detail, name));
      if (/hospital/i.test(fld.value)) {
        const o = fld.owner;
        row.f2.push({ field: fld.path, text: mask(fld.value, name), flagged: dw(),
          inst: fld.path.startsWith('institutions[]') && o ? { name: o.name ?? null, category: o.category ?? null } : null });
      }
      if (/walled apart|keep apart/i.test(fld.value)) {
        row.f3.push({ field: fld.path, text: mask(fld.value, name), flagged: dw(), owner: ownerWords(fld.owner, name) });
      }
    }
    appendFileSync(OUT, `${JSON.stringify(row)}\n`);
  }
});
