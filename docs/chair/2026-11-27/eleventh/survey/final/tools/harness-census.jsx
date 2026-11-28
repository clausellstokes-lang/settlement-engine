/**
 * SURVEY-FINAL (A)+(B) phase 1: births each plan row exactly as the page battery births it (birthConfig(row.config),
 * { seed, customContent: {} }) with a presumption ledger open around the birth (the bundle adds each note's text) and every
 * declarationAdmits call logged (the bundle wraps it). Then the FINAL record (the stamped town, as the page reads it) is
 * asked again: every birth note refused there, and every direct declarationAdmits call admitted at birth and refused there.
 * Writes one jsonl line per birth. Changes nothing in the tree.
 */
import { createHash } from 'node:crypto';
import { appendFileSync } from 'node:fs';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { withPresumptionLedger } from 'TREE/src/domain/facts/presumptionLedger.js';
import { factsOf } from 'TREE/src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOfTags, atomsOf } from 'TREE/src/domain/facts/factVocabulary.js';

const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const INTERNAL = /src\/domain\/facts\/(drawDeclared|presumptionCheck|factVocabulary)\.js|stateProseKernel\.js/;

/** paths in `obj` whose string value contains `text` (first 4) */
function pathsOf(obj, text, max = 4) {
  const out = [];
  const walk = (v, p, depth) => {
    if (out.length >= max || depth > 14) return;
    if (typeof v === 'string') { if (v.includes(text)) out.push(p); return; }
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${p}[${i}]`, depth + 1)); return; }
    if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], p ? `${p}.${k}` : k, depth + 1);
  };
  walk(obj, '', 0);
  return out;
}

function flat(obj) {
  const out = [];
  const walk = (v, p, depth) => {
    if (depth > 14) return;
    if (typeof v === 'string') { out.push([p, v]); return; }
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${p}[]`, depth + 1)); return; }
    if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], p ? `${p}.${k}` : k, depth + 1);
  };
  walk(obj, '', 0);
  return out;
}
export async function run(plan, out, { modmap }) {
  await loadGenerationLawPayloads();
  const callerOf = (stack) => {
    const frames = String(stack).split('\n').slice(1);
    for (const f of frames) {
      const m = f.match(/at (?:(\S+) )?\(?(.*):(\d+):(\d+)\)?$/);
      if (!m) continue;
      const mod = modmap(Number(m[3]));
      if (INTERNAL.test(mod)) return '(none)';
      return `${mod} :: ${m[1] || '(anon)'}`;
    }
    return '(none)';
  };
  let n = 0;
  for (const row of plan) {
    const t0 = Date.now();
    let line;
    try {
      globalThis.__DA_LOG = [];
      const ledger = [];
      const { result: town } = withPresumptionLedger(() => generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} }), ledger);
      const da = globalThis.__DA_LOG; globalThis.__DA_LOG = null;
      const recordHash = sha(town);
      const stamped = withPublicProse(town, composePublicProse(town));
      const facts = factsOf(stamped);
      const refused = [];
      for (const e of ledger) {
        const atoms = [...(e.poolDeclares || []), ...(e.atoms || [])];
        if (atoms.length === 0 && !e.crisisScoped) continue;
        const parts = [declarationOfTags(e.poolDeclares || []), ...(Array.isArray(e.__decl) ? e.__decl : [declarationOfTags(e.atoms || [])])];
        const decl = { needs: parts.flatMap((p) => p.needs), excludes: parts.flatMap((p) => p.excludes), crisis: parts.flatMap((p) => p.crisis) };
        const v = declarationAdmits(decl, facts, { crisisScoped: e.crisisScoped === true, ctx: e.ctx });
        const vTags = declarationAdmits(declarationOfTags(atoms), facts, { crisisScoped: e.crisisScoped === true, ctx: e.ctx });
        if (v.admitted) continue;
        const text = typeof e.__text === 'string' ? e.__text : null;
        refused.push({ pool: e.pool, lineId: e.lineId, text: e.__text ?? null, atoms, refused: v.refused, replaySees: !vTags.admitted, resolvedBy: e.resolvedBy, block: e.block ?? null, drawKind: e.drawKind, surface: e.surface, ctx: e.ctx ? Object.keys(e.ctx) : null, stored: text ? pathsOf(stamped, text.length > 60 ? text.slice(0, 60) : text) : null });
      }
      const direct = new Map();
      let directCalls = 0;
      for (const d of da) {
        const caller = callerOf(d.stack);
        if (caller === '(none)') continue;
        directCalls += 1;
        if (!d.admitted) continue;
        const v = declarationAdmits(d.decl, facts, { crisisScoped: d.crisisScoped === true, ctx: d.ctx });
        if (v.admitted) continue;
        const k = `${caller} || ${atomsOf(d.decl).join(' · ')} || ${v.refused.join(' · ')}`;
        direct.set(k, (direct.get(k) || 0) + 1);
      }
      const fl = flat(stamped);
      const homes = {};
      for (const e of ledger) {
        const declared = (e.atoms && e.atoms.length) || (e.poolDeclares && e.poolDeclares.length) || e.crisisScoped;
        const t = typeof e.__text === 'string' ? e.__text.trim() : null;
        const key = t ? (t.length > 60 ? t.slice(0, 60) : t) : null;
        let where = 'NO TEXT';
        if (key) { const hits = [...new Set(fl.filter(([, s]) => s.includes(key)).map(([p]) => p))]; where = hits.length ? hits.slice(0, 3).join(' + ') : 'NOT STORED'; }
        const k = `${e.pool} || ${declared ? 'D' : '-'} || ${where}`;
        homes[k] = (homes[k] || 0) + 1;
      }
      line = { seed: row.seed, size: row.size, recordHash, homes };
    } catch (e) {
      globalThis.__DA_LOG = null;
      line = { seed: row.seed, size: row.size, error: String(e?.stack || e).slice(0, 2000) };
    }
    appendFileSync(out, `${JSON.stringify(line)}\n`);
    n++;
    if (n % 25 === 0) console.log(`${new Date().toISOString()} ${n}/${plan.length} last ${row.seed} ${line.ms ?? 'ERR'}ms`);
  }
}
