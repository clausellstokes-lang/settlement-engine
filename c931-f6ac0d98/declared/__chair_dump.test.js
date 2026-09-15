// chair probe — dumps every golden-corpus settlement as JSON + sha, for a base-vs-tip declared-scope diff. Never committed.
import { it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';
it('dump', () => {
  const out = {};
  for (const c of goldenCorpus()) {
    const { _seed, ...cfg } = c;
    const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
    const json = JSON.stringify(s, null, 1);
    out[keyOf(c)] = { sha: createHash('sha256').update(JSON.stringify(s)).digest('hex'), json };
  }
  writeFileSync(process.env.CHAIR_DUMP_OUT, JSON.stringify(out));
  expect(Object.keys(out).length).toBeGreaterThan(500);
}, 600_000);
