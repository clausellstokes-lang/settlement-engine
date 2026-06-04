import { describe, expect, test } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'src', 'components');
const NATIVE_DIALOG = /window\.(confirm|prompt|alert)\s*\(/;

function walk(dir) {
  return readdirSync(dir).flatMap(entry => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return walk(path);
    return /\.(js|jsx)$/.test(entry) ? [path] : [];
  });
}

describe('component dialog consistency', () => {
  test('components do not use native browser dialogs', () => {
    const offenders = walk(ROOT).filter(path => NATIVE_DIALOG.test(readFileSync(path, 'utf8')));

    expect(offenders).toEqual([]);
  });
});
