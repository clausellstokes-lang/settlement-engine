/**
 * Auto-reload lifetime wall.
 *
 * A paid edge handler returns before its best-effort reload check finishes.
 * Every production caller must therefore use the shared scheduler, which owns
 * EdgeRuntime.waitUntil and rejection handling. The census is source-derived so
 * a future caller cannot quietly reintroduce a bare, isolate-lifetime promise.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { runDetached } from '../../supabase/functions/_shared/edgeLifetime.ts';

const FN_DIR = resolve(process.cwd(), 'supabase', 'functions');
const read = (name) => {
  const path = join(FN_DIR, name, 'index.ts');
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
};
const functionDirs = readdirSync(FN_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== '_shared')
  .map((entry) => entry.name)
  .sort();
const AUTO_RELOAD_CALLERS = functionDirs
  .filter((name) => /from\s+['"]\.\.\/_shared\/autoReload\.ts['"]/.test(read(name)));
const sharedSource = readFileSync(join(FN_DIR, '_shared', 'autoReload.ts'), 'utf8');

const originalEdgeRuntime = Object.getOwnPropertyDescriptor(globalThis, 'EdgeRuntime');

afterEach(() => {
  vi.restoreAllMocks();
  if (originalEdgeRuntime) {
    Object.defineProperty(globalThis, 'EdgeRuntime', originalEdgeRuntime);
  } else {
    delete globalThis.EdgeRuntime;
  }
});

describe('auto-reload edge lifetime', () => {
  it('discovers every production caller (guard against a vacuous census)', () => {
    expect(AUTO_RELOAD_CALLERS.length).toBeGreaterThanOrEqual(11);
  });

  it.each(AUTO_RELOAD_CALLERS)('%s schedules auto-reload through the shared lifetime helper', (name) => {
    const source = read(name);
    expect(source).toMatch(
      /import\s*\{[^}]*\bscheduleAutoReload\b[^}]*\}\s*from\s*['"]\.\.\/_shared\/autoReload\.ts['"]/s,
    );
    expect(source).toMatch(/\bscheduleAutoReload\(\s*supabaseAdmin\s*,\s*user\.id\s*\)/);
    expect(source).not.toMatch(/\bmaybeAutoReload\s*\(/);
  });

  it('the shared scheduler registers maybeAutoReload with runDetached', () => {
    expect(sharedSource).toMatch(
      /runDetached\(\s*maybeAutoReload\(admin,\s*userId,\s*deps\),\s*['"]auto-reload['"]\s*\)/,
    );
  });

  it('registers guarded work with EdgeRuntime.waitUntil', async () => {
    let registered;
    const waitUntil = vi.fn((work) => {
      registered = work;
    });
    Object.defineProperty(globalThis, 'EdgeRuntime', {
      configurable: true,
      value: { waitUntil },
    });
    let finished = false;

    runDetached(
      Promise.resolve().then(() => {
        finished = true;
      }),
      'test-work',
    );

    expect(waitUntil).toHaveBeenCalledTimes(1);
    expect(registered).toBeInstanceOf(Promise);
    await registered;
    expect(finished).toBe(true);
  });

  it('observes rejections safely when EdgeRuntime is unavailable', async () => {
    delete globalThis.EdgeRuntime;
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => runDetached(Promise.reject(new Error('boom')), 'test-work')).not.toThrow();
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 0));

    expect(warn).toHaveBeenCalledWith('[test-work] detached work failed: boom');
  });
});
