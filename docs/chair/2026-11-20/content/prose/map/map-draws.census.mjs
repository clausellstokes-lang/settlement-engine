/**
 * map-draws.census.mjs — MAP-1's instrumented run. The kernel is wrapped (never changed): `drawVariant` records the
 * eligible list and the chosen variant; `readStateProse` recomputes `eligibleVariants` + `drawVariant` on the ORIGINALS
 * to record, then returns the original read unchanged. Recording is ON only while composePublicProse runs for the place,
 * and only for blockIds of the six generated state-prose leaves. Writes `<OUT>/<seed>.instr.json` (the composed
 * publicProse, for the byte-identity proof) and appends one JSON line per draw to `<OUT>/draws.<worker>.jsonl`.
 */
import { test, vi } from 'vitest';
import { PLAN, OUT, birthAndCompose, writeFileSync, appendFileSync } from './map-birth.shared.mjs';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../../../../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../../../../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../../../../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../../../../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../../../../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../../../../../src/data/dossierStateProse/warFaith.generated.js';
import { STATE_MARK_DIMENSIONS } from '../../../../../../src/domain/facts/factVocabulary.js';

const rec = vi.hoisted(() => ({ on: false, row: null, draws: [], calls: {}, reads: 0, drawsDirect: 0 }));

vi.mock('/home/user/settlement-engine/src/domain/display/stateProse/stateProseKernel.js', async (importOriginal) => {
  const orig = await importOriginal();
  const callerOf = () => {
    const lines = String(new Error().stack).split('\n').slice(1);
    const hit = lines.find((l) => !l.includes('stateProseKernel.js') && !l.includes('map-draws.census.mjs'));
    const m = hit && hit.match(/src\/[^\s:)?]+/);
    return m ? m[0] : 'unknown';
  };
  const note = (path, eligible, blockId, poolKey, chosen, pool) => {
    rec.calls[path] = (rec.calls[path] || 0) + 1;
    rec.draws.push({ path, eligible, blockId, poolKey, chosen, pool });
  };
  return {
    ...orig,
    drawVariant(eligible, blockId, poolKey, seed) {
      const chosen = orig.drawVariant(eligible, blockId, poolKey, seed);
      if (rec.on) { rec.drawsDirect += 1; note(`drawVariant<-${callerOf()}`, eligible, blockId, poolKey, chosen, null); }
      return chosen;
    },
    readStateProse(corpus, blockId, poolKey, options = {}) {
      if (rec.on) {
        rec.reads += 1;
        const pool = corpus?.[blockId]?.pools?.[poolKey];
        const eligible = orig.eligibleVariants(pool, options);
        const chosen = orig.drawVariant(eligible, blockId, poolKey, options.seed || '');
        note(`readStateProse<-${callerOf()}`, eligible, blockId, poolKey, chosen, pool);
      }
      return orig.readStateProse(corpus, blockId, poolKey, options);
    },
  };
});

const LEAVES = { defense: DOSSIER_STATE_PROSE_DEFENSE, economy: DOSSIER_STATE_PROSE_ECONOMY, general: DOSSIER_STATE_PROSE_GENERAL, power: DOSSIER_STATE_PROSE_POWER, stressors: DOSSIER_STATE_PROSE_STRESSORS, warFaith: DOSSIER_STATE_PROSE_WAR_FAITH };
const leafOf = (blockId) => Object.keys(LEAVES).find((k) => LEAVES[k] && LEAVES[k][blockId]);
const DIM_VALUES = new Set(Object.values(STATE_MARK_DIMENSIONS).flat());
const WORKER = process.env.MAP_WORKER || '0';

/** Every string under publicProse.blocks (aliases or not: a match anywhere counts). */
function storedStrings(prose) {
  const out = []; const walk = (v) => { if (typeof v === 'string') out.push(v); else if (v && typeof v === 'object') for (const x of Object.values(v)) walk(x); };
  walk(prose && prose.blocks); return out;
}
/** The template as a regex: each {slot} a lazy wildcard, the corpus 'town' also matching the size noun. */
function templateRe(text, size) {
  const cap = size[0].toUpperCase() + size.slice(1);
  const src = String(text).split(/(\{[^}]+\})/).map((t) => (t.startsWith('{') && t.endsWith('}') ? '[\\s\\S]*?'
    : t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\btown\b/g, `(?:town|${size})`).replace(/\bTown\b/g, `(?:Town|${cap})`))).join('');
  return new RegExp(src);
}

function signature(v) {
  const marks = Array.isArray(v.marks) ? v.marks : [];
  return {
    vid: v.vid ?? null,
    slots: Array.isArray(v.slots) ? v.slots : (String(v.text).match(/\{([^}]+)\}/g) || []).map((s) => s.slice(1, -1)),
    dmOnly: marks.includes('dm-only'),
    dimMarks: marks.filter((m) => DIM_VALUES.has(m)),
    factMarks: marks.filter((m) => m !== 'dm-only' && !DIM_VALUES.has(m)),
  };
}

for (const row of PLAN) {
  test(row.seed, async () => {
    rec.draws = []; rec.calls = {}; rec.reads = 0; rec.drawsDirect = 0;
    const prose = await birthAndCompose(row, { before() { rec.on = true; }, after() { rec.on = false; } });
    writeFileSync(`${OUT}/${row.seed}.instr.json`, JSON.stringify(prose));
    const strings = storedStrings(prose);
    const seen = new Set(); const lines = []; const out = { inScope: 0, outOfScope: 0 };
    for (const d of rec.draws) {
      const leaf = leafOf(d.blockId);
      if (!leaf) { out.outOfScope += 1; continue; }
      out.inScope += 1;
      const pool = d.pool || LEAVES[leaf][d.blockId]?.pools?.[d.poolKey];
      if (!Array.isArray(pool)) continue;
      const chosenVid = d.chosen ? (d.chosen.vid ?? pool.indexOf(d.chosen)) : null;
      const key = `${d.blockId}|${d.poolKey}|${chosenVid}`;
      if (seen.has(key)) continue; seen.add(key);
      const eligibleSet = new Set(d.eligible || []);
      const eligibleVids = (d.eligible || []).map((v) => v.vid ?? pool.indexOf(v));
      lines.push(JSON.stringify({
        size: row.size, seed: row.seed, leaf, path: d.path, blockId: d.blockId, poolKey: d.poolKey,
        poolLength: pool.length, eligibleVids, chosenVid, chosenText: d.chosen ? d.chosen.text : null,
        stored: d.chosen ? (() => { const re = templateRe(d.chosen.text, row.size); return strings.some((x) => re.test(x)); })() : false,
        excluded: pool.filter((v) => !eligibleSet.has(v)).map(signature),
      }));
    }
    if (lines.length) appendFileSync(`${OUT}/draws.${WORKER}.jsonl`, `${lines.join('\n')}\n`);
    appendFileSync(`${OUT}/calls.${WORKER}.jsonl`, `${JSON.stringify({ seed: row.seed, calls: rec.calls, reads: rec.reads, drawsDirect: rec.drawsDirect, ...out, kept: lines.length })}\n`);
  }, 300000);
}
