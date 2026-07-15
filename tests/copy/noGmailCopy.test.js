/**
 * tests/copy/noGmailCopy.test.js — Phase A1 copy fix.
 *
 * "Gmail" is the wrong term for Google sign-in: users sign in with a Google
 * ACCOUNT, not specifically Gmail. This test fails if any user-facing copy or
 * auth/account component reintroduces "Gmail" as a PROVIDER label. We scan the
 * copy strings and the auth/account components (the surfaces that mention
 * providers) — docs and proposal/assessment markdown are intentionally out of
 * scope (they quote the term while describing the fix).
 *
 * A literal @gmail.com EMAIL ADDRESS (e.g. the support-contact mailto) is NOT a
 * provider mislabel — it is an address — so it is allowed. We strip gmail.com
 * email addresses before scanning for the service-name term: "Sign in with
 * Gmail" is still caught; "settlementforge@gmail.com" is not.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '..', '..', 'src');

/**
 * True if `text` uses "Gmail" as a provider/service name. A real @gmail.com
 * email address is stripped out first, so a support-contact mailto does not
 * count — only a standalone "Gmail" (the sign-in mislabel) trips it.
 */
function usesGmailAsProvider(text) {
  const withoutEmails = text.replace(/[\w.+-]+@gmail\.com/gi, '');
  return /gmail/i.test(withoutEmails);
}

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
  it('the guard distinguishes a provider mislabel from a @gmail.com address', () => {
    // Still fires on the real offense (mislabeling Google sign-in as "Gmail").
    expect(usesGmailAsProvider('Sign in with your Gmail account')).toBe(true);
    expect(usesGmailAsProvider('Use Gmail to continue')).toBe(true);
    // Allows a legitimate contact email address.
    expect(usesGmailAsProvider('Email us at settlementforge@gmail.com')).toBe(false);
  });

  it('copy strings never use "Gmail" as a provider label', () => {
    const files = [join(SRC, 'copy', 'en.js'), join(SRC, 'copy', 'strings.js')];
    for (const f of files) {
      const text = readFileSync(f, 'utf8');
      expect(usesGmailAsProvider(text), `${f} must not use "Gmail" as a provider label`).toBe(false);
    }
  });

  it('auth + account components never use "Gmail" as a provider label', () => {
    const dirs = [join(SRC, 'components', 'auth'), join(SRC, 'components', 'account')];
    const offenders = [];
    for (const d of dirs) {
      for (const f of walk(d)) {
        if (usesGmailAsProvider(readFileSync(f, 'utf8'))) offenders.push(f);
      }
    }
    // Also check the two standalone auth components.
    for (const f of [join(SRC, 'components', 'AuthModal.jsx'), join(SRC, 'components', 'AccountMenu.jsx')]) {
      if (usesGmailAsProvider(readFileSync(f, 'utf8'))) offenders.push(f);
    }
    expect(offenders).toEqual([]);
  });
});
