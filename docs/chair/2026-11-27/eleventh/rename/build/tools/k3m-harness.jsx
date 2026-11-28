// K3-1 (1), MEASURE FIRST: WHERE each name classifier of a power runs, by execution. Per birth, three phases:
//   stamp: composePublicProse(t), the prose composed at save into the stamp;
//   owner: the owner's page (OutputContainer, every tab walked) of the stamped record;
//   share: the shared page as a reader sees it (toPublicSafe + the veil's projection of the stamped record, rendered).
// Every call of the instrumented classifiers and door-id mints is logged with its phase and the name it was handed.
// Also: whether a born power carries an `id`, and every stored string that is a `faction.<slug>` reference (by path).
import { ownerPage, sharePage } from './rename-harness.jsx';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { appendFileSync } from 'node:fs';
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    let line;
    try {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      globalThis.__kinds = []; globalThis.__phase = 'stamp';
      const t = withPublicProse(born, composePublicProse(born));
      globalThis.__phase = 'owner'; await ownerPage(t);
      globalThis.__phase = 'share'; await sharePage(t);
      const calls = {}; for (const e of globalThis.__kinds) { const [ph, f] = e.split('\t'); const k = `${ph}|${f}`; calls[k] = (calls[k] || 0) + 1; }
      globalThis.__kinds = null; globalThis.__phase = null;
      const names = (born.powerStructure?.factions || []).map((f) => f?.faction || f?.name).filter(Boolean);
      const refs = []; const walk = (v, p) => { if (typeof v === 'string') { if (/^faction\.[a-z0-9_]+$/.test(v)) refs.push(p.replace(/\[\d+\]/g, '[]')); } else if (Array.isArray(v)) v.forEach((x, k) => walk(x, `${p}[${k}]`)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, p ? `${p}.${k}` : k); };
      walk(born, '');
      line = { seed: row.seed, size: row.size, powers: names.length, powerIds: (born.powerStructure?.factions || []).filter((f) => f?.id).length, refs: [...new Set(refs)], calls };
    } catch (e) { line = { seed: row.seed, error: String(e?.stack || e).slice(0, 800) }; }
    appendFileSync(out, `${JSON.stringify(line)}\n`);
  }
}
