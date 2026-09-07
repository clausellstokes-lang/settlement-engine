/**
 * townMapFogPublicDrop.test.js — DOOR 2 THE TABLE LAYER fail-closed pin.
 *
 * settlement.fogSessions (the fog-of-war reveal state) is a LIBRARY-ONLY, DM-secret surface —
 * it encodes exactly what the players are NOT meant to see yet. The public-safe projection is
 * fail-closed at the settlement root (PUBLIC_TOPLEVEL_KEYS allowlist), so a top-level
 * `fogSessions` that is NOT on the allowlist is dropped from every gallery / anonymous read —
 * fog reveal state NEVER reaches a public/player projection (the design's FAIL-CLOSED law).
 * This pin holds that boundary (mirrors townMapEditsPublicDrop.test.js):
 *   • `fogSessions` is NOT on PUBLIC_TOPLEVEL_KEYS;
 *   • the DEFAULT (fail-closed) projection — the SHIPPED anonymous-result / pre-publish-preview
 *     path — drops it wholesale while keeping the allowlisted content it rides beside.
 *
 * SCOPE (mirrors the mapEdits precedent): the full/DM-share projection (gallery_share_dm) is the
 * owner-gated §6 gallery opt-in — designed-for but NOT shipped in V1 (it needs the SQL-sanitizer
 * twin migration + character-identical contract tests). A library-only, fog-tracking settlement
 * never reaches that path through a shipped V1 flow, so this pin covers the default mode only;
 * the full-mode strip (`delete clone.fogSessions`, beside dmNotes) lands with §6, together with
 * the mapEdits + interiorEdits cosmetic-sidecar family — deliberately deferred, not a bug.
 */
import { describe, expect, it } from 'vitest';
import { toPublicSafe, PUBLIC_TOPLEVEL_KEYS } from '../../src/domain/display/publicSafe.js';

const withFog = () => ({
  id: 'door2-public', name: 'Fogtown', tier: 'town', population: 1200,
  institutions: [{ id: 'inst.market', name: 'Market' }],
  factions: [{ id: 'fac.guild', name: 'Guild' }],
  // The library-only, DM-secret reveal state — must never reach a public projection.
  fogSessions: { 'friday-game': { name: 'Friday Game', districts: ['dA'], buildings: ['cat:vault'] } },
});

describe('DOOR 2 — fogSessions is dropped from the public projection (fail-closed)', () => {
  it('fogSessions is NOT an allowlisted top-level public key', () => {
    expect(PUBLIC_TOPLEVEL_KEYS).not.toContain('fogSessions');
  });

  it('the DEFAULT (fail-closed) projection drops fogSessions but keeps allowlisted content', () => {
    const pub = toPublicSafe(withFog());
    expect('fogSessions' in pub).toBe(false);
    expect(pub.name).toBe('Fogtown');            // allowlisted content still projected
    expect(Array.isArray(pub.institutions)).toBe(true);
  });
});
