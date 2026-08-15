/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

const registry = {
  listAll: () => [],
  resolve: () => null,
};

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector({ customContent: {} }),
}));

vi.mock('../../src/lib/customRegistry.js', () => ({
  buildRegistry: () => registry,
  customRefIdFromItem: (item) => `custom:${item?.localUid || 'unknown'}`,
}));

import EntityPicker from '../../src/components/EntityPicker.jsx';
import { CustomItemAttributes } from '../../src/components/compendium/CustomItemAttributes.jsx';
import { DependencySummary } from '../../src/components/compendium/Dependencies.jsx';

afterEach(cleanup);

describe('Custom-content attributes — stored enums become authored labels', () => {
  it('renders the canonical food-effect meaning, not the foodImpact key', () => {
    const { container } = render(
      <CustomItemAttributes
        bucket="institutions"
        item={{ foodImpact: 'produces' }}
      />,
    );

    expect(container.textContent).toContain('Food · Produces food — raises supply');
    expect(container.textContent).not.toMatch(/\bproduces\b(?! food)/);
  });

  it('does not expose an unknown food enum token', () => {
    const { container } = render(
      <CustomItemAttributes
        bucket="institutions"
        item={{ foodImpact: 'legacy_food_mode' }}
      />,
    );

    expect(container.textContent).toContain('Food · Unrecognized setting');
    expect(container.textContent).not.toContain('legacy_food_mode');
  });
});

// The manifest declares `compendium` as the consumer of factions.agenda and
// factions.methods. tests/domain/customContentConsumerEvidence.walker.test.js
// proves the token is present in this component's source — which a doc comment
// alone would satisfy. These pin the thing that actually matters: the authored
// sentences reach the DOM, and nothing else was authored to fill the gap.
describe('Custom-content faction prose — authored agenda and methods are shown', () => {
  it('renders both sentences the author wrote', () => {
    const { container } = render(
      <CustomItemAttributes
        bucket="factions"
        item={{
          archetype: 'Thieves’ cabal',
          agenda: 'Own every dock licence before the spring convoy.',
          methods: 'Bribery first, arson when bribery is refused.',
        }}
      />,
    );

    expect(container.textContent).toContain('Own every dock licence before the spring convoy.');
    expect(container.textContent).toContain('Bribery first, arson when bribery is refused.');
    expect(container.textContent).toContain('Agenda');
    expect(container.textContent).toContain('Methods');
    // The chip row still renders alongside the prose.
    expect(container.textContent).toContain('Archetype · Thieves’ cabal');
  });

  it('renders prose for a faction that set no chip-bearing attribute', () => {
    // The component returned null on an empty chip list, so a faction with only
    // free-text answers would have rendered nothing at all.
    const { container } = render(
      <CustomItemAttributes bucket="factions" item={{ agenda: 'Restore the drowned shrine.' }} />,
    );

    expect(container.textContent).toContain('Restore the drowned shrine.');
    expect(container.textContent).not.toContain('Methods');
  });

  it('stays empty when the author left every attribute blank', () => {
    const { container } = render(
      <CustomItemAttributes bucket="factions" item={{ agenda: '   ', methods: '' }} />,
    );

    expect(container.textContent).toBe('');
  });
});

describe('Missing custom-content links — explain the failure, keep ids private', () => {
  it.each([
    ['custom:local_7a9f', 'Deleted custom item'],
    ['prebuilt:resources:iron_deposits', 'Missing catalog item'],
    ['legacy.opaque_ref_44', 'Missing linked item'],
  ])('EntityPicker translates %s without displaying it', (refId, expectedLabel) => {
    const { container } = render(
      <EntityPicker
        category="resources"
        value={[refId]}
        onChange={vi.fn()}
      />,
    );

    expect(container.textContent).toContain(expectedLabel);
    expect(container.textContent).not.toContain(refId);
    expect(container.querySelector(`[title="${refId}"]`)).toBeNull();
    expect(screen.getByTitle('This linked item no longer exists.')).toBeTruthy();
  });

  it('DependencySummary uses the same missing-link language without a raw id', () => {
    const refId = 'prebuilt:resources:iron_deposits';
    const { container } = render(
      <DependencySummary
        deps={[{ key: 'requires', label: 'Requires' }]}
        item={{ localUid: 'subject', requires: [refId] }}
      />,
    );

    expect(container.textContent).toContain('Missing catalog item');
    expect(container.textContent).toContain('1 linked item could not be found');
    expect(container.textContent).not.toContain(refId);
    expect(container.textContent).not.toMatch(/dangling reference/i);
    expect(screen.getByTitle('This linked item no longer exists.')).toBeTruthy();
  });
});
