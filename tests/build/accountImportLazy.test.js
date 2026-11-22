/**
 * Account-export import is a deliberate, account-page file interaction. Keep
 * its hostile-input parser and write/cleanup graph out of anonymous first paint.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const readSource = file => readFileSync(resolve(process.cwd(), file), 'utf8');

describe('account import stays behind its action boundary', () => {
  it('the eager slice is only a dynamic-import trampoline', () => {
    const source = readSource('src/store/accountImportSlice.js');
    expect(source).toMatch(/import\(\s*['"]\.\/accountImportBody\.js['"]\s*\)/);
    expect(source).not.toMatch(/from\s+['"]\.\/accountImportBody\.js['"]/);
  });

  it('the store mounts the trampoline, never the import body', () => {
    const source = readSource('src/store/index.js');
    expect(source).toMatch(/from\s+['"]\.\/accountImportSlice\.js['"]/);
    expect(source).not.toContain('accountImportBody');
  });
});
