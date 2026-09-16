/**
 * townMapGalleryOptIn.test.js — SM-4 GALLERY OPT-IN security pins (design §5/§6/§7).
 *
 * The gallery town map renders from the ALREADY-sanitized public projection, gated
 * fail-closed on the owner's existing share flag. These pins hold the boundary the
 * opt-in must never cross:
 *   • the fail-closed default is UNCHANGED — `mapEdits` is still NOT allowlisted, so
 *     the owner's cosmetic edits never reach the gallery (the opt-in exposes the
 *     BASE map only; a dedicated flag + cosmetic exposure is the owner-gated §6
 *     migration step, deliberately deferred);
 *   • every mapEdits schema key DODGES the private-key strip — so even a future
 *     allowlisting could never silently drop a cosmetic key (the "assert it" the
 *     brief names);
 *   • the design-§7 publicSafe ROUND-TRIP: a town map built from a projected
 *     settlement contains NOTHING the projection dropped (no DM note, plot hook, or
 *     generation seed), and is base layout, and derives only from public data.
 */
import { describe, expect, it } from 'vitest';

import { toPublicSafe, PUBLIC_TOPLEVEL_KEYS, PRIVATE_KEY_RE } from '../../src/domain/display/publicSafe.js';
import {
  buildTownMapModel, readMapEdits, hasDrawableMap, MAP_EDITS_SCHEMA_KEYS,
} from '../../src/domain/townMap/index.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

describe('SM-4 gallery opt-in — the fail-closed default is unchanged', () => {
  it('mapEdits is still NOT allowlisted (the opt-in exposes the base map, never cosmetic edits)', () => {
    expect(PUBLIC_TOPLEVEL_KEYS).not.toContain('mapEdits');
  });

  it('every mapEdits schema key dodges the private-key strip (gallery-exposure safety)', () => {
    // If mapEdits were ever allowlisted, the recursive deeper denylist must not
    // silently eat a cosmetic key — the load-bearing key-naming trap, re-asserted
    // in the gallery context (the design chose `layoutVariant` over the trap name
    // `layoutSeed`, avoided a `hooks` key, etc.).
    const offenders = MAP_EDITS_SCHEMA_KEYS.filter((k) => PRIVATE_KEY_RE.test(k));
    expect(offenders).toEqual([]);
  });
});

describe('SM-4 gallery opt-in — publicSafe round-trip (design §7)', () => {
  // A settlement carrying public map inputs AND DM-private fields + cosmetic edits.
  const full = () => ({
    ...makeTownFixture({ tier: 'city', terrain: 'riverside', walls: true, water: true, seed: 'gallery-rt' }),
    // DM-private top-level fields toPublicSafe must strip:
    dmNotes: 'PRIVATE_DM_SENTINEL',
    plotHooks: ['PRIVATE_HOOK_SENTINEL'],
    _seed: 'PRIVATE_SEED_SENTINEL',
    // The owner's library-only cosmetic edits — must never reach the gallery:
    mapEdits: { layoutVariant: 4, pins: [{ anchor: 'cat:market', dx: 9, dy: 9 }], legendPrefs: { showLabels: true } },
  });

  it('the projection drops mapEdits ⇒ the gallery map is BASE layout (no cosmetic leak)', () => {
    const projected = toPublicSafe(full());
    expect('mapEdits' in projected).toBe(false);
    expect(readMapEdits(projected)).toBe(null);
    // Built exactly as PublicDossierView builds it (readMapEdits(projected) === null).
    const model = buildTownMapModel(projected, readMapEdits(projected));
    expect(hasDrawableMap(model)).toBe(true);
    expect(model.meta.layoutVariant).toBe(0); // base layout, NOT the owner's variant 4
  });

  it('the gallery map leaks NOTHING the projection dropped', () => {
    const projected = toPublicSafe(full());
    const model = buildTownMapModel(projected, readMapEdits(projected));
    const json = JSON.stringify(model);
    expect(json).not.toContain('PRIVATE_DM_SENTINEL');
    expect(json).not.toContain('PRIVATE_HOOK_SENTINEL');
    expect(json).not.toContain('PRIVATE_SEED_SENTINEL');
  });

  it('every placed building derives from the PUBLIC projection (nothing invented / read past it)', () => {
    const projected = toPublicSafe(full());
    const model = buildTownMapModel(projected, readMapEdits(projected));
    const publicNames = new Set((projected.institutions || []).map((i) => i.name));
    for (const b of model.buildings) {
      expect(publicNames.has(b.name), `building "${b.name}" is not in the public projection`).toBe(true);
    }
    expect(model.buildings.length).toBeGreaterThan(0);
  });

  it('the gallery map is deterministic (same projection → identical model)', () => {
    const projected = toPublicSafe(full());
    const a = JSON.stringify(buildTownMapModel(projected, readMapEdits(projected)));
    const b = JSON.stringify(buildTownMapModel(projected, readMapEdits(projected)));
    expect(a).toBe(b);
  });
});
