import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = join(root, 'src');

describe('legacy generator retirement', () => {
  it('removes the legacy generator and compatibility engine shim', () => {
    expect(existsSync(join(src, 'generators', 'generateSettlement.js'))).toBe(false);
    expect(existsSync(join(src, 'generators', 'engine.js'))).toBe(false);
  });

  // GREEN-BASE (2026-11-08): the slice no longer names the pipeline itself. WORKER Car 1 (c9611da70) moved the
  // generation lane into its own lazy module, and ENGINE-5 unit 1 (9c7bb42d0) moved section regeneration out the
  // same way, taking the slice's last `import('../generators/generateSettlementPipeline.js')` with it. The entry is
  // therefore followed hop by hop from the slice's two lazy lanes to the pipeline module, and every hop is held to
  // the same law the slice was: no legacy engine name.
  it('keeps the pipeline as the sole lazy generation entry point', () => {
    const read = (...path) => readFileSync(join(src, ...path), 'utf8');
    const slice = read('store', 'settlementSlice.js');
    expect(slice).toMatch(/import\('\.\/settlementGenerateAction\.js'\)/);
    expect(slice).toMatch(/import\('\.\/settlementRegenAction\.js'\)/);
    // the generation lane: the action -> the local engine seam -> the request runner -> the pipeline
    expect(read('store', 'settlementGenerateAction.js')).toMatch(/import \{ loadGenerationCore \} from '\.\.\/lib\/localEngine\.js'/);
    expect(read('lib', 'localEngine.js')).toMatch(/import\('\.\.\/workers\/generationRequest\.js'\)/);
    expect(read('workers', 'generationRequest.js')).toMatch(/import \{[^}]*\bgenerateSettlementPipeline\b[^}]*\} from '\.\.\/generators\/generateSettlementPipeline\.js'/);
    // the regeneration lane: the action -> the local pipeline door -> the pipeline
    expect(read('store', 'settlementRegenAction.js')).toMatch(/import\('\.\.\/lib\/localPipeline\.js'\)/);
    expect(read('lib', 'localPipeline.js')).toMatch(/import\('\.\.\/generators\/generateSettlementPipeline\.js'\)/);
    const hops = [slice, ...[['store', 'settlementGenerateAction.js'], ['store', 'settlementRegenAction.js'], ['lib', 'localEngine.js'], ['lib', 'localPipeline.js'], ['workers', 'generationRequest.js']].map((path) => read(...path))];
    for (const hop of hops) expect(hop).not.toMatch(/engineGenerate|engineRegen|usePipeline/);
  });
});
