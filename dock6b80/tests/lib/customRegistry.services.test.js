import { describe, it, expect } from 'vitest';
import { buildRegistry, prebuiltRefId } from '../../src/lib/customRegistry.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';

// Built-in services are derived from INSTITUTION_SERVICES (institutions are the
// single source of truth) — not a separate hand-authored catalog. These tests
// pin that derivation so the custom-content pickers can reference built-in
// services alongside customs.
describe('customRegistry — prebuilt services derived from institutions', () => {
  const reg = buildRegistry({});

  it('surfaces built-in services with the providing institution as subcategory', () => {
    const services = reg.listAll('services');
    expect(services.length).toBeGreaterThan(50);
    for (const s of services) {
      expect(s.category).toBe('services');
      expect(s.source).toBe('prebuilt');
      expect(typeof s.name).toBe('string');
      expect(s.subcategory).toBeTruthy(); // the providing institution (+N when shared)
    }
  });

  it('resolves a known service by its prebuilt refId', () => {
    // "Lodging" is offered by Inn/Tavern in INSTITUTION_SERVICES.
    expect(INSTITUTION_SERVICES['Inn/Tavern']).toHaveProperty('Lodging');
    const entry = reg.resolve(prebuiltRefId('services', 'Lodging'));
    expect(entry).toBeTruthy();
    expect(entry.name).toBe('Lodging');
    expect(entry.source).toBe('prebuilt');
  });

  it('dedupes a service name shared by several institutions into one entry', () => {
    const services = reg.listAll('services');
    const lodging = services.filter((s) => s.name === 'Lodging');
    expect(lodging.length).toBe(1); // one pickable entry, not one per provider
  });

  it('merges built-in + custom services in listAll', () => {
    const withCustom = buildRegistry({
      services: [{ name: 'Hedge Healer', localUid: 'svc-custom-1', category: 'healing' }],
    });
    const all = withCustom.listAll('services');
    expect(all.some((s) => s.name === 'Hedge Healer' && s.source === 'custom')).toBe(true);
    expect(all.some((s) => s.source === 'prebuilt')).toBe(true);
  });
});
