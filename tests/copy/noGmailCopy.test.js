/**
 * tests/copy/noGmailCopy.test.js — Phase A1 copy fix.
 *
 * The proposal calls "Gmail" the wrong term for Google sign-in: users sign in
 * with a Google ACCOUNT, not specifically Gmail. This test fails if any
 * user-facing copy or component reintroduces "Gmail". We scan the copy strings
 * and the auth/account components (the surfaces that mention providers) — docs
 * and proposal/assessment markdown are intentionally out of scope (they quote
 * the term while describing the fix).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '..', '..', 'src');

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(jsx?|ts)$/.test(name)) out.push(full);
  }
  return out;
}

describe('copy — no user-facing "Gmail"', () => {
  it('copy strings never say "Gmail"', () => {
    const files = [join(SRC, 'copy', 'en.js'), join(SRC, 'copy', 'strings.js')];
    for (const f of files) {
      const text = readFileSync(f, 'utf8');
      expect(text, `${f} must not contain "Gmail"`).not.toMatch(/gmail/i);
    }
  });

  it('auth + account components never say "Gmail"', () => {
    const dirs = [join(SRC, 'components', 'auth'), join(SRC, 'components', 'account')];
    const offenders = [];
    for (const d of dirs) {
      for (const f of walk(d)) {
        if (/gmail/i.test(readFileSync(f, 'utf8'))) offenders.push(f);
      }
    }
    // Also check the two standalone auth components.
    for (const f of [join(SRC, 'components', 'AuthModal.jsx'), join(SRC, 'components', 'AccountMenu.jsx')]) {
      if (/gmail/i.test(readFileSync(f, 'utf8'))) offenders.push(f);
    }
    expect(offenders).toEqual([]);
  });
});
