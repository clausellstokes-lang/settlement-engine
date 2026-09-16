/**
 * noHardcodedPrivilegeEmail.test.js — bans hardcoded personal-email privilege
 * backdoors in the security/trust boundary (finding F4).
 *
 * Migration 018 originally granted admin (and returned true from
 * current_user_is_privileged) for a hardcoded maintainer email, so anyone
 * registering that address on a fork became an unbounded admin — and it leaked
 * a personal email into a public repo. Privilege must derive from `role` (or the
 * OWNER_EMAIL env seam the edge layer uses), never a literal baked into SQL or
 * an edge function.
 *
 * This scans every migration + edge function PRODUCTION source for a bare email
 * literal appearing near an auth/role/privilege keyword. It deliberately does NOT
 * scan src/ UI files (a `mailto:` support-contact link is a product choice, not a
 * trust boundary) NOR edge-function `*.test.ts` fixtures: a Deno test that stubs a
 * user with `email: 'admin@x.com'` next to an `adminClient` DI seam is test data,
 * not a shipped backdoor — the trust boundary is the deployed handler, which this
 * still scans in full. If a legitimate future need arises, use an env var (the
 * OWNER_EMAIL seam), not a literal.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const PRIVILEGE_CONTEXT = /privileg|role\s*(=|in|<>)|is_admin|admin|developer|auth\.(uid|email|role)|set\s+role/i;

function sqlFiles() {
  const dir = resolve(process.cwd(), 'supabase', 'migrations');
  return existsSync(dir)
    ? readdirSync(dir).filter(f => f.endsWith('.sql')).map(f => resolve(dir, f))
    : [];
}
function edgeFiles() {
  const dir = resolve(process.cwd(), 'supabase', 'functions');
  if (!existsSync(dir)) return [];
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = resolve(d, e.name);
      if (e.isDirectory()) walk(p);
      // PRODUCTION sources only — a *.test.ts fixture that stubs `admin@x.com` is
      // test data, not a deployed privilege backdoor (the boundary is index.ts).
      else if (/\.(ts|js)$/.test(e.name) && !/\.test\.(ts|js)$/.test(e.name)) out.push(p);
    }
  };
  walk(dir);
  return out;
}

describe('no hardcoded privilege email in the trust boundary (F4)', () => {
  const files = [...sqlFiles(), ...edgeFiles()];

  it('scans a non-trivial number of boundary files', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it('no migration or edge function grants privilege via a hardcoded email literal', () => {
    const offenders = [];
    for (const file of files) {
      const src = readFileSync(file, 'utf-8');
      src.split('\n').forEach((line, i) => {
        // Skip comments — historical/explanatory prose is fine; code is not.
        const code = line.replace(/--.*$/, '').replace(/\/\/.*$/, '').replace(/\*.*$/, '');
        if (!EMAIL_RE.test(code)) return;
        EMAIL_RE.lastIndex = 0;
        // Only flag when the email sits in a privilege/auth context on the line.
        if (PRIVILEGE_CONTEXT.test(code)) {
          offenders.push(`${file.split('/supabase/')[1]}:${i + 1}  ${line.trim()}`);
        }
      });
    }
    expect(offenders, `hardcoded privilege email(s) found:\n${offenders.join('\n')}`).toEqual([]);
  });
});
