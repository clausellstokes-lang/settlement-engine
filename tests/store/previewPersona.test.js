/**
 * previewPersona.test.js — THE DEV-ONLY PREVIEW PERSONA (ODQ §934.35).
 *
 * THE ORDER (the owner): "give me a dummy admin account for our preview purposes
 * only." No account is created and no password is handled — the chair may do
 * neither. What exists instead is a VIEW: `VITE_PREVIEW_ROLE` seats the ROLE the
 * client's own gates read, so the preview renders the admin surface, while the
 * SESSION stays exactly what it really is and NOTHING is claimed to the server.
 *
 * THREE PROPERTIES, and the second and third are the ones that matter:
 *   1. ACTIVE — with DEV true and a valid value, the role is seated everywhere
 *      an auth writer sets it, and the staff surface opens.
 *   2. INERT — with DEV false the persona does not exist. Asserted at RUNTIME
 *      (the stub is verified to have taken, so a vitest that cannot flip DEV
 *      REDS here instead of passing on nothing) AND in SOURCE, because the
 *      production guarantee is dead-code elimination, which only holds if the
 *      branch is literally `import.meta.env.DEV && …`.
 *   3. NEVER CLAIMED — no request carries it. Proved by scanning every module
 *      in src/ that builds headers or calls fetch/supabase for any mention of
 *      the persona, in either spelling.
 *
 * FAIL-CLOSED: any value that is not one of the two staff roles reads as NO
 * persona, so a plausible-looking 'owner'/'staff'/'ADMIN' cannot open anything.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** Build a slice from a FRESH module graph so the env stub is read at import. */
async function freshSlice() {
  vi.resetModules();
  const { createAuthSlice } = await import('../../src/store/authSlice.js');
  /** @type {any} */
  let state = {};
  const get = () => state;
  const set = (fn) => { fn(state); };
  state = createAuthSlice(set, get);
  state.canAfford = () => false;
  return state;
}

// The dev server reports MODE 'development'; vitest reports 'test', and the persona is

// inert there by design — so every arm that expects the persona stands for the server.

beforeEach(() => { vi.stubEnv('MODE', 'development'); });

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('1. ACTIVE — the persona seats the role the client gates read', () => {
  for (const role of ['admin', 'developer']) {
    test(`VITE_PREVIEW_ROLE=${role} opens the staff surface for an ANONYMOUS session`, async () => {
      vi.stubEnv('VITE_PREVIEW_ROLE', role);
      expect(import.meta.env.DEV, 'this suite runs with DEV true').toBe(true);
      const s = await freshSlice();

      // Seated from the very first frame — before any auth resolves.
      expect(s.auth.role).toBe(role);
      expect(s.isElevated()).toBe(true);
      expect(s.isAdmin()).toBe(true);
      // …and the §934.28 unlock follows the role, so the paid surface opens.
      expect(s.auth.tier).toBe('premium');
      expect(s.canExport()).toBe(true);
      expect(s.canUseCustomContent()).toBe(true);
      expect(s.maxSaves()).toBe(Infinity);

      // ⛔ THE SESSION IS STILL ANONYMOUS. The persona is a view, not a login:
      // nothing here is a user, a session or a token.
      expect(s.auth.user).toBeNull();
      expect(s.auth.session).toBeNull();
    });
  }

  test('a REAL signed-in session keeps its own identity; only the role is previewed', async () => {
    vi.stubEnv('VITE_PREVIEW_ROLE', 'admin');
    const s = await freshSlice();
    s.setAuth({ id: 'real-user' }, { access_token: 'real-token' }, 'free', 'user', 'Alice');
    expect(s.auth.user.id, 'the real user survives').toBe('real-user');
    expect(s.auth.session.access_token, 'the real token survives').toBe('real-token');
    expect(s.auth.displayName).toBe('Alice');
    // The profile says 'user'; the preview says 'admin'. The preview wins on the
    // CLIENT only — the token above is what the server will judge.
    expect(s.auth.role).toBe('admin');
  });

  test('every auth writer honours it — sign-out included', async () => {
    // The §934.28 recon found authSignIn alone skipping resolveTier, so the
    // per-writer sweep is the pin, not an afterthought.
    vi.stubEnv('VITE_PREVIEW_ROLE', 'developer');
    const s = await freshSlice();
    expect(s.auth.role, 'initial state').toBe('developer');
    s.setAuth({ id: 'u' }, { access_token: 't' }, 'free', 'user', null);
    expect(s.auth.role, 'setAuth').toBe('developer');
    s.clearAuth();
    expect(s.auth.role, 'clearAuth — the preview outlives the session').toBe('developer');
    expect(s.auth.tier, 'and so does its tier').toBe('premium');
  });

  test('FAIL-CLOSED: any value that is not a staff role is no persona at all', async () => {
    for (const bad of ['owner', 'staff', 'ADMIN', 'Developer', 'user', 'true', '1', ' ']) {
      vi.stubEnv('VITE_PREVIEW_ROLE', bad);
      const s = await freshSlice();
      expect(s.auth.role, `${JSON.stringify(bad)} must not seat a persona`).toBe('user');
      expect(s.isElevated()).toBe(false);
      expect(s.auth.tier).toBe('anon');
    }
  });

  test('unset is the default, and the default is nothing', async () => {
    vi.stubEnv('VITE_PREVIEW_ROLE', '');
    const s = await freshSlice();
    expect(s.auth.role).toBe('user');
    expect(s.isElevated()).toBe(false);
  });
});

describe('2. INERT — with DEV false the persona does not exist', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_PREVIEW_ROLE', 'admin');
    vi.stubEnv('DEV', false);
  });

  test('RUNTIME: a production-mode graph ignores the variable entirely', async () => {
    // ⛔ ANTI-VACUITY. If this runner cannot flip DEV, the assertion below would
    // pass for the wrong reason, so the stub is verified FIRST and this test
    // reds honestly rather than reporting a guarantee it never measured.
    expect(
      import.meta.env.DEV,
      'vi.stubEnv could not flip import.meta.env.DEV — this arm measured nothing; '
        + 'do not delete it, fix the stub (the SOURCE arm below still holds).',
    ).toBe(false);
    const s = await freshSlice();
    expect(s.auth.role).toBe('user');
    expect(s.isElevated()).toBe(false);
    expect(s.auth.tier).toBe('anon');
    expect(s.canExport()).toBe(false);
  });

  test('SOURCE: the guard is spelled so a production build eliminates it', () => {
    // The production guarantee is DEAD-CODE ELIMINATION, and that only holds if
    // Vite can constant-fold the test. `import.meta.env.DEV` becomes the literal
    // `false` at build time; anything indirected through a variable would not
    // fold, would survive minification, and would ship the mechanism. MODE !== 'test' sits
    // second: DEV folds to `false` first and takes the whole conjunction with it.
    const slice = readFileSync(join(ROOT, 'src/store/authSlice.js'), 'utf8');
    expect(slice).toMatch(
      /if \(import\.meta\.env\.DEV && import\.meta\.env\.MODE !== 'test' && import\.meta\.env\.VITE_PREVIEW_ROLE\)/,
    );
    const menu = readFileSync(join(ROOT, 'src/components/AccountMenu.jsx'), 'utf8');
    expect(menu).toMatch(
      /import\.meta\.env\.DEV && import\.meta\.env\.MODE !== 'test' && import\.meta\.env\.VITE_PREVIEW_ROLE/,
    );
  });
});

describe('3. NEVER CLAIMED — nothing sends the persona anywhere', () => {
  /** Every .js/.jsx under src/, forward-slash normalized. */
  function sourceFiles(dir = join(ROOT, 'src'), acc = []) {
    for (const e of readdirSync(dir)) {
      const abs = join(dir, e);
      if (statSync(abs).isDirectory()) sourceFiles(abs, acc);
      else if (/\.(jsx?|mjs)$/.test(e)) acc.push(relative(ROOT, abs).split(sep).join('/'));
    }
    return acc;
  }

  const FILES = sourceFiles();
  /** Modules that actually build a request: a header bag, fetch, or the client. */
  const SENDERS = FILES.filter((rel) => {
    const src = readFileSync(join(ROOT, rel), 'utf8');
    return /headers\s*:/.test(src) || /\bfetch\s*\(/.test(src) || /createClient\s*\(/.test(src);
  });

  test('the scan is live (there are senders to scan)', () => {
    expect(FILES.length, 'the src tree is empty — has it moved?').toBeGreaterThan(500);
    expect(SENDERS.length, 'nothing in src/ builds a request — has the client moved?')
      .toBeGreaterThan(5);
    // Liveness: the supabase client really is in the scanned set.
    expect(SENDERS).toContain('src/lib/supabase.js');
  });

  test('no module that builds a request mentions the persona, in either spelling', () => {
    const offenders = SENDERS.filter((rel) => {
      const src = readFileSync(join(ROOT, rel), 'utf8');
      return /VITE_PREVIEW_ROLE|previewPersona|preview[-_]?role/i.test(src);
    });
    expect(
      offenders,
      '\nA module that builds a request mentions the preview persona. The persona is a '
        + 'CLIENT VIEW; the moment it travels it becomes a forged claim, and the server '
        + 'would be trusting a dev environment variable:\n'
        + `${offenders.join('\n')}\n`,
    ).toEqual([]);
  });

  test('the persona is read in exactly two places, and neither is a network module', () => {
    const readers = FILES.filter((rel) => /VITE_PREVIEW_ROLE/.test(readFileSync(join(ROOT, rel), 'utf8')));
    expect(readers.sort()).toEqual([
      'src/components/AccountMenu.jsx',   // the visible marker
      'src/store/authSlice.js',           // the role resolution
    ]);
  });

  test('the persona is inert under vitest even with the switch set — a test run is not the dev server', () => {
    // anchored: the switch is set below and DEV is what vitest reports; only MODE separates a test from the preview.
    vi.stubEnv('VITE_PREVIEW_ROLE', 'admin');
    vi.stubEnv('DEV', true);
    vi.stubEnv('MODE', 'test');
    expect(import.meta.env.MODE).toBe('test');
    expect(import.meta.env.DEV && import.meta.env.MODE !== 'test' && import.meta.env.VITE_PREVIEW_ROLE).toBeFalsy();
    vi.unstubAllEnvs();
  });
});
