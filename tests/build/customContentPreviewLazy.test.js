/**
 * The sample taste gate is optional and expensive. Its settlement generator
 * must stay in a worker reached only after the author requests a sample.
 */

import { describe, expect, it } from 'vitest';
import {
  existsSync,
  readFileSync,
  readdirSync,
} from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const DIST = join(ROOT, 'dist');
const ASSETS = join(DIST, 'assets');
const DIST_EXISTS = existsSync(DIST) && existsSync(ASSETS);
const REQUIRE_DIST = process.env.VERIFY_DIST === '1';
const SENTINEL = 'settlementforge:custom-content-preview:lazy-v1';

function source(path) {
  return readFileSync(join(ROOT, path), 'utf8');
}

function staticImports(code) {
  const out = new Set();
  const from = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g;
  const bare = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  let match;
  while ((match = from.exec(code)) !== null) out.add(match[1].slice(2));
  while ((match = bare.exec(code)) !== null) out.add(match[1].slice(2));
  return [...out];
}

function entryClosure() {
  const html = readFileSync(join(DIST, 'index.html'), 'utf8');
  const entry = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/)?.[1];
  if (!entry) throw new Error('Production entry chunk was not found.');
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length > 0) {
    const file = queue.shift();
    const code = readFileSync(join(ASSETS, file), 'utf8');
    for (const dependency of staticImports(code)) {
      if (!seen.has(dependency)) {
        seen.add(dependency);
        queue.push(dependency);
      }
    }
  }
  return [...seen];
}

describe('custom-content sample preview source boundary', () => {
  it('keeps the worker client and generator behind dynamic/worker edges', () => {
    const panel = source('src/components/surveyor/CustomContentPanel.jsx');
    expect(panel).toMatch(/import\(['"]\.\.\/\.\.\/lib\/customContentPreviewClient\.js['"]\)/);
    expect(panel).not.toMatch(/^import\s[^;]*customContentPreviewClient/m);
    expect(panel).not.toContain('generateSettlementPipeline');

    const worker = source('src/workers/customContentPreview.worker.js');
    expect(worker).toContain("from '../generators/generateSettlementPipeline.js'");
    expect(worker).toContain("from '../lib/customContentPreviewProtocol.js'");
    expect(source('src/lib/customContentPreviewProtocol.js')).toContain(SENTINEL);
  });
});

describe.runIf(DIST_EXISTS)('custom-content sample preview production boundary', () => {
  it('keeps the preview worker sentinel out of the entry static closure', () => {
    const carriers = entryClosure().filter((file) => (
      readFileSync(join(ASSETS, file), 'utf8').includes(SENTINEL)
    ));
    expect(carriers).toEqual([]);
  });

  it.skipIf(!REQUIRE_DIST)('ships the worker sentinel somewhere outside first paint', () => {
    const carriers = readdirSync(ASSETS)
      .filter((file) => file.endsWith('.js'))
      .filter((file) => readFileSync(join(ASSETS, file), 'utf8').includes(SENTINEL));
    expect(carriers.length).toBeGreaterThan(0);
  });
});
