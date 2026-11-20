/**
 * map-plain.census.mjs — MAP-1's control: the same birth with NO mock of the kernel. Writes `<OUT>/<seed>.plain.json`
 * (the composed publicProse) so the instrumented run can be proved byte-identical.
 */
import { test } from 'vitest';
import { PLAN, OUT, birthAndCompose, writeFileSync } from './map-birth.shared.mjs';

for (const row of PLAN) {
  test(row.seed, async () => {
    const prose = await birthAndCompose(row);
    writeFileSync(`${OUT}/${row.seed}.plain.json`, JSON.stringify(prose));
  }, 300000);
}
