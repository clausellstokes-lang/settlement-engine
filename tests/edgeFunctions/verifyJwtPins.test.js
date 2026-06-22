/**
 * verifyJwtPins.test.js — every edge function must pin verify_jwt EXPLICITLY in
 * supabase/config.toml.
 *
 * The audit's deploy-drift finding: only stripe-webhook + verify-single-dossier
 * pinned verify_jwt, so the platform JWT gate for the OTHER anonymous-intent
 * functions (ingest-events, analytics-export, send-email's cap_warning) depended
 * on remembering `--no-verify-jwt` at deploy time. A forgotten flag silently
 * turns the gate ON and breaks the anon path; a stray flag turns it OFF on an
 * authenticated/money/admin endpoint. config.toml is the deploy source of truth,
 * so this guard asserts:
 *   1. EVERY function dir under supabase/functions/ (except _shared) has an
 *      explicit [functions.<name>] verify_jwt pin — no implicit defaults.
 *   2. The self-authenticating functions are pinned false, the rest true.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const toml = readFileSync(join(ROOT, 'supabase/config.toml'), 'utf8');

/** Parse `[functions.<name>] … verify_jwt = <bool>` pins out of config.toml. */
function verifyJwtPins(src) {
  const pins = {};
  const re = /\[functions\.([a-z0-9-]+)\]([\s\S]*?)(?=\n\[|$)/g;
  for (const m of src.matchAll(re)) {
    const body = m[2];
    const vm = body.match(/verify_jwt\s*=\s*(true|false)/);
    if (vm) pins[m[1]] = vm[1] === 'true';
  }
  return pins;
}

const functionDirs = readdirSync(join(ROOT, 'supabase/functions'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== '_shared')
  .map((d) => d.name);

// Intent map: false = the function authenticates ITSELF (signature / shared
// secret / per-request anon path) and the platform gate would block it.
const SELF_AUTH_FALSE = new Set([
  'stripe-webhook', 'verify-single-dossier', 'ingest-events', 'analytics-export', 'send-email',
]);

describe('every edge function pins verify_jwt explicitly in config.toml', () => {
  const pins = verifyJwtPins(toml);

  it('no function relies on the implicit verify_jwt default', () => {
    const unpinned = functionDirs.filter((fn) => !(fn in pins));
    expect(unpinned, `functions missing an explicit verify_jwt pin: ${unpinned.join(', ')}`).toEqual([]);
  });

  it('pins are not invented for non-existent functions', () => {
    const onDisk = new Set(functionDirs);
    const phantom = Object.keys(pins).filter((fn) => !onDisk.has(fn));
    expect(phantom, `config.toml pins a non-existent function: ${phantom.join(', ')}`).toEqual([]);
  });

  it('self-authenticating functions are verify_jwt = false; the rest are true', () => {
    for (const fn of functionDirs) {
      const expected = SELF_AUTH_FALSE.has(fn) ? false : true;
      expect(pins[fn], `${fn} should pin verify_jwt = ${expected}`).toBe(expected);
    }
  });
});
