/**
 * townMapEditsPublicDrop.test.js — SM-3 PUBLIC PROJECTION pin (design §5/§6).
 *
 * settlement.mapEdits is a LIBRARY-ONLY surface. The public-safe projection is
 * fail-closed at the settlement root (PUBLIC_TOPLEVEL_KEYS allowlist), so a
 * top-level `mapEdits` that is NOT on the allowlist is dropped from every gallery /
 * anonymous read — the correct default until a deliberate, owner-gated gallery
 * opt-in (§6) adds it with its SQL-sanitizer twin. This pin holds the V1 boundary:
 *   • `mapEdits` is NOT on PUBLIC_TOPLEVEL_KEYS;
 *   • the DEFAULT (fail-closed) projection — the SHIPPED anonymous-result /
 *     pre-publish-preview path — drops it while keeping the allowlisted content it
 *     rides beside.
 *
 * SCOPE: the full/DM-share projection (gallery_share_dm) is the owner-gated §6
 * gallery opt-in — designed-for but NOT shipped in V1 (it needs the SQL-sanitizer
 * twin migration + character-identical contract tests). A library-only,
 * map-editable settlement never reaches that path through a shipped V1 flow, so
 * this pin covers the default mode only; the full-mode drop lands with §6.
 */
import { describe, expect, it } from 'vitest';
import { toPublicSafe, PUBLIC_TOPLEVEL_KEYS } from '../../src/domain/display/publicSafe.js';

const withMapEdits = () => ({
  id: 'sm3-public', name: 'Publicton', tier: 'town', population: 1200,
  institutions: [{ id: 'inst.market', name: 'Market' }],
  factions: [{ id: 'fac.guild', name: 'Guild' }],
  // The library-only cosmetic container — must never reach a public projection.
  mapEdits: { layoutVariant: 2, pins: [{ anchor: 'cat:market', dx: 5, dy: -3 }], legendPrefs: { showLabels: true } },
});

describe('SM-3 — mapEdits is dropped from the public projection', () => {
  it('mapEdits is NOT an allowlisted top-level public key', () => {
    expect(PUBLIC_TOPLEVEL_KEYS).not.toContain('mapEdits');
  });

  it('the DEFAULT (fail-closed) projection drops mapEdits but keeps allowlisted content', () => {
    const pub = toPublicSafe(withMapEdits());
    expect('mapEdits' in pub).toBe(false);
    expect(pub.name).toBe('Publicton');        // allowlisted content still projected
    expect(Array.isArray(pub.institutions)).toBe(true);
  });
});
