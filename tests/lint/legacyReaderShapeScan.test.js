import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  assertGovernedLegacyDetectorSource,
  governedLegacyDetectorSha256,
} from '../../scripts/lib/observed-shape-governance.mjs';
import { scanReaders } from '../../scripts/lib/legacy-reader-shape-scan.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEGACY_SCANNER = join(ROOT, 'scripts/lib/legacy-reader-shape-scan.mjs');
const LEGACY_BLOB_SHA = '0310fa9fdda873c1b382cf18c3936707e8e4addf';
const ORIGINAL_EMISSION = 'file: rel, line: line + 1, key, shapes: objects.sort(),';
const POSITION_ENRICHED_EMISSION = 'file: rel, line: line + 1, pos: node.name.getStart(sf), key, shapes: objects.sort(),';

function gitBlobSha(source) {
  const body = Buffer.from(source);
  return createHash('sha1')
    .update(`blob ${body.length}\0`)
    .update(body)
    .digest('hex');
}

describe('legacy observed-shape reader detector', () => {
  test('is the exact 6e7acc4d detector with only node-name position enrichment', () => {
    const source = readFileSync(LEGACY_SCANNER, 'utf8');
    const enrichedCount = source.split(POSITION_ENRICHED_EMISSION).length - 1;

    expect(enrichedCount).toBe(1);
    // An emptied read reds the count above first.
    // anchored: that count proves `source` carries the enriched emission EXACTLY once
    expect(source).not.toContain(ORIGINAL_EMISSION);

    const restored = source.replace(POSITION_ENRICHED_EMISSION, ORIGINAL_EMISSION);
    expect(gitBlobSha(restored)).toBe(LEGACY_BLOB_SHA);
    expect(assertGovernedLegacyDetectorSource(source)).toBe(governedLegacyDetectorSha256());

    const algorithmChange = source.replace('if (tokens.size) {', 'if (tokens.size >= 0) {');
    expect(() => assertGovernedLegacyDetectorSource(algorithmChange))
      .toThrow(/does not reconstruct governed Git blob/);
    expect(() => assertGovernedLegacyDetectorSource(
      source.replace(POSITION_ENRICHED_EMISSION, ORIGINAL_EMISSION),
    )).toThrow(/exactly the sole node-name-start-v1 enrichment/);
  });

  test('emits the exact property-name source position on a legacy leaf finding', () => {
    const dir = mkdtempSync(join(tmpdir(), 'legacy-reader-shape-'));
    const file = join(dir, 'probe.js');
    const source = [
      'export function inspect(settlement) {',
      '  return settlement.missing;',
      '}',
      '',
    ].join('\n');
    writeFileSync(file, source);

    const result = scanReaders({
      files: [file],
      shapes: { settlement: { rows: 16, keys: ['id'] } },
      arrayShapes: [],
      singleHome: ['settlement'],
      rootShapes: ['settlement'],
      minRows: 8,
      root: dir,
    });

    expect(result.findings).toEqual([{
      file: 'probe.js',
      line: 2,
      pos: source.indexOf('missing'),
      key: 'missing',
      shapes: ['settlement'],
      text: 'settlement.missing',
    }]);
    expect(result.stats).toEqual({ files: 1, reads: 1, resolved: 1, unresolved: 0 });
  });
});
