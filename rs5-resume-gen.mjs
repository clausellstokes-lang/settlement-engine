/**
 * RS-4 resume generator — validates every existing receipt (truncation check), deletes
 * corrupt ones AND stale segment configs, then writes per-seed configs of missing rows.
 * Same design as RS-1's, with the stale-config guard from the start.
 */
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SCRATCH = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad';
const RECEIPT_DIR = `${SCRATCH}/rs5-receipts`;
const config = JSON.parse(readFileSync(`${SCRATCH}/rs5-config.json`, 'utf8'));

const safe = (key) => key.replace(/[^A-Za-z0-9_.-]+/g, '_');
let corrupt = 0;
const done = new Set();
for (const seed of config.seeds) {
  for (const row of config.rows) {
    const key = `${seed}::${config.years}::${config.settlements}::${row.id}`;
    const path = join(RECEIPT_DIR, `${safe(key)}.json`);
    if (!existsSync(path)) continue;
    try {
      const r = JSON.parse(readFileSync(path, 'utf8'));
      if (r.kind !== 'whole_world_soak' || !Array.isArray(r.yearlyHashes)) throw new Error('wrong shape');
      done.add(key);
    } catch {
      corrupt += 1;
      unlinkSync(path);
      console.log(`corrupt receipt deleted (mid-write kill): ${path}`);
    }
  }
}

for (const seed of config.seeds) {
  const old = `${SCRATCH}/rs5-config-resume-${seed}.json`;
  if (existsSync(old)) unlinkSync(old);
}

const segments = [];
for (const seed of config.seeds) {
  const remaining = config.rows.filter((row) => !done.has(`${seed}::${config.years}::${config.settlements}::${row.id}`));
  if (!remaining.length) continue;
  const out = `${SCRATCH}/rs5-config-resume-${seed}.json`;
  writeFileSync(out, `${JSON.stringify({ ...config, seeds: [seed], rows: remaining }, null, 2)}\n`);
  segments.push({ seed, remaining: remaining.length });
}
console.log(JSON.stringify({
  totalCells: config.seeds.length * config.rows.length,
  complete: done.size,
  corrupt,
  segments,
}));
