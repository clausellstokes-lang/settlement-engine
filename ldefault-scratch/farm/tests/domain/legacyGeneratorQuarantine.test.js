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

  it('keeps the pipeline as the sole lazy generation entry point', () => {
    const slice = readFileSync(join(src, 'store', 'settlementSlice.js'), 'utf8');
    expect(slice).toMatch(/generateSettlementPipeline/);
    expect(slice).not.toMatch(/engineGenerate|engineRegen|usePipeline/);
  });
});
