/**
 * SURVEY-FINAL proof: births each plan row as the page battery does, hashes the born record (records moved?), and lists
 * every printed description and hook the S-A leaves move (owner) and what the reader's page prints.
 */
import { createHash } from 'node:crypto';
import { appendFileSync } from 'node:fs';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { toPublicSafe } from 'TREE/src/domain/display/publicSafe.js';
import { projectShareVeil } from 'TREE/src/domain/display/galleryVeil.js';
import { institutionDescShown } from 'TREE/src/domain/display/institutionDescShown.js';
import { collectPlotHooks } from 'TREE/src/domain/dossier/plotHooks.js';
const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    let line;
    try {
      const town = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      const recordHash = sha(town);
      const s = withPublicProse(town, composePublicProse(town));
      const pub = projectShareVeil(toPublicSafe(s, { full: false, memberOverrides: null }), null);
      const desc = [];
      for (const inst of s.institutions || []) {
        const stored = typeof inst.desc === 'string' ? inst.desc.trim() : '';
        const shown = institutionDescShown(inst, s);
        if (stored && shown !== stored) desc.push({ name: inst.name, stored, shown });
      }
      const descShare = [];
      for (const inst of pub.institutions || []) {
        const stored = typeof inst.desc === 'string' ? inst.desc.trim() : '';
        const shown = institutionDescShown(inst, pub, { reader: true });
        if (stored && shown !== stored) descShare.push({ name: inst.name, stored, shown });
      }
      const owner = collectPlotHooks(s).map((h) => h.text); const asStored = collectPlotHooks(s, { reader: true }).map((h) => h.text);
      const hooks = { gone: asStored.filter((t) => !owner.includes(t)), came: owner.filter((t) => !asStored.includes(t)) };
      line = { seed: row.seed, recordHash, desc, descShare, hooks };
    } catch (e) { line = { seed: row.seed, error: String(e?.stack || e).slice(0, 1500) }; }
    appendFileSync(out, `${JSON.stringify(line)}\n`);
  }
}
