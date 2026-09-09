/**
 * @vitest-environment jsdom
 *
 * The map URL, parent handshake, bridge target, and CSP allowlist are one
 * security contract. These tests exercise the pure resolver so production can
 * never silently regress to the privileged app origin.
 */

import { describe, expect, it } from 'vitest';
import {
  MAP_FORK_REVISION,
  MapRuntimeConfigError,
  PRODUCTION_MAP_ORIGIN,
  resolveMapRuntimeConfig,
} from '../../src/lib/mapRuntimeConfig.js';

const APP_URL = 'https://settlementforge.com/world/realm-1?panel=map#selection';

describe('resolveMapRuntimeConfig', () => {
  it('builds the production frame URL and sends only the parent origin', () => {
    const config = resolveMapRuntimeConfig({
      configuredUrl: PRODUCTION_MAP_ORIGIN,
      parentHref: APP_URL,
      production: true,
    });
    const frame = new URL(config.frameUrl);

    expect(config.frameOrigin).toBe(PRODUCTION_MAP_ORIGIN);
    expect(config.parentOrigin).toBe('https://settlementforge.com');
    expect(frame.pathname).toBe('/map/index.html');
    expect(frame.searchParams.get('v')).toBe(MAP_FORK_REVISION);
    expect(frame.searchParams.get('parentOrigin')).toBe('https://settlementforge.com');
    expect(frame.href).not.toContain('realm-1');
    expect(frame.href).not.toContain('selection');
  });

  it('preserves an explicit map entrypoint while owning the handshake params', () => {
    const config = resolveMapRuntimeConfig({
      configuredUrl: `${PRODUCTION_MAP_ORIGIN}/map/index.html?theme=parchment&v=stale`,
      parentHref: APP_URL,
      production: true,
    });
    const frame = new URL(config.frameUrl);

    expect(frame.searchParams.get('theme')).toBe('parchment');
    expect(frame.searchParams.get('v')).toBe(MAP_FORK_REVISION);
    expect(frame.searchParams.getAll('parentOrigin')).toEqual(['https://settlementforge.com']);
  });

  it('uses the same-origin static copy only for non-production development', () => {
    const config = resolveMapRuntimeConfig({
      parentHref: 'http://localhost:5173/world/local',
      production: false,
    });
    const frame = new URL(config.frameUrl);

    expect(config.frameOrigin).toBe('http://localhost:5173');
    expect(frame.pathname).toBe('/map/index.html');
    expect(frame.searchParams.get('parentOrigin')).toBe('http://localhost:5173');
  });

  it.each([
    ['', 'required in production'],
    ['https://settlementforge.com/map/index.html', 'must use a separate origin'],
    ['https://other-map.example/map/index.html', 'must match the CSP allowlist'],
    ['http://map.settlementforge.com/map/index.html', 'must use HTTPS'],
  ])('rejects unsafe production configuration %j', (configuredUrl, message) => {
    expect(() => resolveMapRuntimeConfig({
      configuredUrl,
      parentHref: APP_URL,
      production: true,
    })).toThrowError(message);
  });

  it.each([
    'javascript:alert(1)',
    'https://user:secret@map.settlementforge.com/map/index.html',
    'https://map.settlementforge.com/map/index.html#bridge',
    'http://map.internal.example/map/index.html',
  ])('rejects malformed or insecure map URL %j', (configuredUrl) => {
    expect(() => resolveMapRuntimeConfig({
      configuredUrl,
      parentHref: 'http://localhost:5173/',
      production: false,
    })).toThrow(MapRuntimeConfigError);
  });
});
