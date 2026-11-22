/**
 * @vitest-environment jsdom
 *
 * tests/lib/mapBridgeTypedSurface.test.js — typed-surface completeness walker
 * (finding lib-infra-1).
 *
 * THE BUG THIS CATCHES: src/lib/mapThumb.js called `bridge.exportThumb(480)`, a
 * method that existed nowhere on the createMapBridge typed surface (nor as an
 * iframe handler). Every call threw a TypeError, which the best-effort try/catch
 * swallowed, so generated-terrain map shares NEVER got a thumbnail — every tile
 * fell back to the placeholder, silently, forever.
 *
 * THE GUARD: enumerate every `bridge.<member>` a src/lib module consumes and
 * assert each exists on the createMapBridge api. A future lib module that reaches
 * for a bridge method the surface doesn't expose fails here instead of at runtime.
 */

import { describe, test, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createMapBridge } from '../../src/lib/mapBridge.js';

const LIB_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'lib');

function walkJsFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walkJsFiles(full));
    else if (name.endsWith('.js')) out.push(full);
  }
  return out;
}

// Members reached through the RPC surface directly rather than as typed methods —
// legitimately absent from the api's named surface. `call`/`notify` ARE on the api,
// so nothing here is needed today; kept as the documented escape hatch.
const ALLOWED_UNTYPED = new Set([]);

describe('map bridge typed-surface completeness', () => {
  test('every bridge.<method> consumed in src/lib exists on the createMapBridge api', () => {
    const api = createMapBridge(() => null);
    const surface = new Set(Object.keys(api));

    // `bridge` or `bridge?` followed by a member access (call or property read).
    const memberRe = /\bbridge\s*\??\.\s*([a-zA-Z_$][\w$]*)/g;
    const consumed = new Map(); // method -> first file that consumes it

    for (const file of walkJsFiles(LIB_DIR)) {
      // mapBridge.js DEFINES the surface (uses `api.`/closures), not `bridge.`.
      if (file.endsWith('mapBridge.js')) continue;
      const src = readFileSync(file, 'utf8');
      let m;
      while ((m = memberRe.exec(src)) !== null) {
        const method = m[1];
        if (!consumed.has(method)) consumed.set(method, file);
      }
    }

    const missing = [...consumed.entries()]
      .filter(([method]) => !surface.has(method) && !ALLOWED_UNTYPED.has(method))
      .map(([method, file]) => `${method} (consumed in ${file.replace(LIB_DIR, 'src/lib')})`);

    expect(
      missing,
      'bridge methods consumed by src/lib that are absent from the createMapBridge typed surface',
    ).toEqual([]);
  });

  test('the surface actually exposes exportThumb (the method mapThumb depends on)', () => {
    const api = createMapBridge(() => null);
    expect(typeof api.exportThumb).toBe('function');
  });
});
