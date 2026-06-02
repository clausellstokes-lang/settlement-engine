import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const SRC = join(ROOT, 'src');

function filesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

describe('client AI trust boundary', () => {
  it('does not call Anthropic directly from browser code', () => {
    const offenders = filesUnder(SRC)
      .filter(path => /\.(js|jsx|ts|tsx)$/.test(path))
      .filter(path => /api\.anthropic\.com|anthropic-version|x-api-key/i.test(readFileSync(path, 'utf8')));

    expect(offenders).toEqual([]);
  });
});
