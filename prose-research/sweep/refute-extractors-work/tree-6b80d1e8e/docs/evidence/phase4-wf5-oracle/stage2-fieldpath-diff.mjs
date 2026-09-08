/**
 * docs/evidence/phase4-wf5-oracle/stage2-fieldpath-diff.mjs
 *
 * W-F5 STAGE 2 field-path diff evidence over the 187-config golden corpus.
 *
 * Consumes the BEFORE (HEAD worktree) and AFTER (working tree) corpus outputs
 * from stage2-corpus-outputs.mjs and proves, per config:
 *   1. The changed field paths fall into EXACTLY two classes:
 *        - LATENT-PANTHEON: config.faith + config.latentPantheon.* (added)
 *        - CORRUPTION-TRACE: simulationTrace (corruptionPass receipts APPENDED
 *          at the tail — prior trace entries byte-identical)
 *      Anything else ⇒ listed under `unexplained` (must be empty).
 *   2. LATENCY: no pool deity name appears ANYWHERE outside
 *      config.latentPantheon (prose/hooks/npcs/history all clean).
 *   3. BOUNDEDNESS: every latent pantheon has exactly 1 patron; 1+cults ≤
 *      capacityForTier(tier); niches distinct; refs all deity:core:*; patron
 *      rank ∈ {major,minor}; cult ranks ∈ {minor,cult}.
 *   4. PROSE/HOOK STABILITY: the named narrative fields are byte-identical
 *      before → after for every config.
 *
 * Usage: node stage2-fieldpath-diff.mjs <before.json> <after.json> <out.json>
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { DEITY_POOL, DEITY_CORE_REF_PREFIX } from '../../../src/generators/data/deityPool.js';
import { capacityForTier, nicheOf } from '../../../src/domain/worldPulse/cultImpositionApply.js';

const [, , beforeFile, afterFile, outFile] = process.argv;
const before = JSON.parse(readFileSync(beforeFile, 'utf8'));
const after = JSON.parse(readFileSync(afterFile, 'utf8'));

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

/** Collect changed leaf-ish paths between two values (arrays compared wholesale). */
function diffPaths(a, b, path, out) {
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (isObj(a) && isObj(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      diffPaths(a?.[k], b?.[k], path ? `${path}.${k}` : k, out);
    }
    return;
  }
  out.push(path || '(root)');
}

// The narrative/prose/hook surfaces that must be byte-stable (latency law).
const PROSE_FIELDS = [
  'pressureSentence', 'arrivalScene', 'history', 'narrativeHooks', 'hooks',
  'dailyLife', 'coherence', 'settlementReason', 'name',
];

const POOL_NAMES = DEITY_POOL.map((d) => d.name);

const report = {
  configs: Object.keys(before).length,
  changedConfigs: 0,
  latentPantheonConfigs: 0,
  corruptionTraceConfigs: 0,
  unexplained: /** @type {Record<string, string[]>} */ ({}),
  proseDrift: /** @type {string[]} */ ([]),
  latencyLeaks: /** @type {string[]} */ ([]),
  boundednessViolations: /** @type {string[]} */ ([]),
  traceNotAppendOnly: /** @type {string[]} */ ([]),
  pathClassTally: /** @type {Record<string, number>} */ ({}),
};

for (const key of Object.keys(before)) {
  const b = before[key], a = after[key];
  const paths = [];
  diffPaths(b, a, '', paths);
  if (paths.length) report.changedConfigs += 1;

  const unexplained = [];
  let sawLatent = false, sawTrace = false;
  for (const p of paths) {
    const cls = p === 'config.faith' || p === 'config.latentPantheon' || p.startsWith('config.latentPantheon.')
      ? 'latent-pantheon'
      : p === 'simulationTrace' || p.startsWith('simulationTrace.')
        ? 'corruption-trace'
        : 'UNEXPLAINED';
    report.pathClassTally[cls] = (report.pathClassTally[cls] || 0) + 1;
    if (cls === 'latent-pantheon') sawLatent = true;
    else if (cls === 'corruption-trace') sawTrace = true;
    else unexplained.push(p);
  }
  if (sawLatent) report.latentPantheonConfigs += 1;
  if (sawTrace) report.corruptionTraceConfigs += 1;
  if (unexplained.length) report.unexplained[key] = unexplained;

  // 1b. Trace changes must be INSERTION-ONLY corruptionPass receipts: removing
  //     the corruption receipts from AFTER must reproduce BEFORE exactly, up to
  //     the deterministic _traceClock renumber (ts === insertion index), which
  //     shifts the ts of traces recorded by later steps.
  const bt = b.simulationTrace || [], at = a.simulationTrace || [];
  if (JSON.stringify(bt) !== JSON.stringify(at)) {
    const stripTs = (arr) => arr.map(({ ts, ...rest }) => rest);
    const inserted = at.filter((t) => t.step === 'corruptionPass' && t.result === 'corrupted');
    const afterMinus = at.filter((t) => !(t.step === 'corruptionPass' && t.result === 'corrupted'));
    const restEqual = JSON.stringify(stripTs(afterMinus)) === JSON.stringify(stripTs(bt));
    const clockIsIndex = at.every((t, i) => t.ts === i) && bt.every((t, i) => t.ts === i);
    if (!(inserted.length > 0 && restEqual && clockIsIndex)) report.traceNotAppendOnly.push(key);
  }

  // 2. Latency: no pool deity name outside config.latentPantheon.
  const clone = JSON.parse(JSON.stringify(a));
  if (clone.config) delete clone.config.latentPantheon;
  const rest = JSON.stringify(clone);
  for (const name of POOL_NAMES) {
    if (rest.includes(name)) { report.latencyLeaks.push(`${key} :: ${name}`); }
  }

  // 3. Boundedness of the latent pantheon.
  const latent = a.config?.latentPantheon;
  if (!latent?.patron) {
    report.boundednessViolations.push(`${key} :: missing latent patron`);
  } else {
    const all = [latent.patron, ...(latent.cults || [])];
    if (all.length > capacityForTier(a.tier)) report.boundednessViolations.push(`${key} :: over capacity`);
    const niches = all.map(nicheOf);
    if (new Set(niches).size !== niches.length) report.boundednessViolations.push(`${key} :: niche collision`);
    for (const d of all) {
      if (!String(d._deityRef).startsWith(DEITY_CORE_REF_PREFIX)) report.boundednessViolations.push(`${key} :: bad ref ${d._deityRef}`);
    }
    if (!['major', 'minor'].includes(latent.patron.rankAxis)) report.boundednessViolations.push(`${key} :: patron rank ${latent.patron.rankAxis}`);
    for (const c of latent.cults || []) {
      if (!['minor', 'cult'].includes(c.rankAxis)) report.boundednessViolations.push(`${key} :: cult rank ${c.rankAxis}`);
    }
  }

  // 4. Prose/hook byte-stability.
  for (const f of PROSE_FIELDS) {
    if (JSON.stringify(b[f]) !== JSON.stringify(a[f])) report.proseDrift.push(`${key} :: ${f}`);
  }
}

report.verdict = {
  everyConfigShifted: report.changedConfigs === report.configs,
  everyConfigHasLatentClass: report.latentPantheonConfigs === report.configs,
  unexplainedPathCount: Object.keys(report.unexplained).length,
  proseByteStable: report.proseDrift.length === 0,
  zeroLatencyLeaks: report.latencyLeaks.length === 0,
  boundednessClean: report.boundednessViolations.length === 0,
  tracesInsertOnlyCorruptionReceipts: report.traceNotAppendOnly.length === 0,
};

writeFileSync(outFile, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.verdict, null, 2));
console.log(`classes: ${JSON.stringify(report.pathClassTally)}`);
console.log(`latent-class configs: ${report.latentPantheonConfigs}/${report.configs}; corruption-trace configs: ${report.corruptionTraceConfigs}`);
