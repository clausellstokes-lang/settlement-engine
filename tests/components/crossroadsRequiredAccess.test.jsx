/** @vitest-environment jsdom */
/**
 * crossroadsRequiredAccess.test.jsx — COHERENCE-AGREE-3 (the chair's ruling of 2026-11-12, Part B (iii)): ONE DATUM,
 * THREE READERS. `resourceData.js` says the crossroads position REQUIRES crossroads access. The wizard
 * (ConfigurationPanel.jsx :: NearbyResourcesPanel, through getCompatibleResources' `offered`) dims it on a road exactly
 * as it dims it on a port, with the row's own words and the same "force include anyway"; the structural validator warns
 * on a forced one on a road as on a port; the random roll's pool (`compatible`) is unchanged.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { NearbyResourcesPanel } from '../../src/components/ConfigurationPanel.jsx';
import { getCompatibleResources } from '../../src/domain/resourceTerrainCompatibility.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';

afterEach(cleanup);
const WARNING = 'A crossroads position requires crossroads trade access.';
const crossroadsButton = () => screen.getAllByRole('button').find((b) => /crossroads position/i.test(b.textContent || ''));

describe('the crossroads position on a road (one datum, three readers)', () => {
  it('the wizard dims it on a road with the row\'s words, and it can still be forced', () => {
    const updateConfig = vi.fn();
    render(<NearbyResourcesPanel config={{ tradeRouteAccess: 'road', nearbyResourcesRandom: false, nearbyResources: [] }} updateConfig={updateConfig} />);
    const button = crossroadsButton();
    expect(button?.getAttribute('title')).toBe(`${WARNING}. Click to force include anyway`);
    fireEvent.click(/** @type {HTMLElement} */ (button));
    expect(updateConfig).toHaveBeenCalledWith({ nearbyResources: ['crossroads_position'] });
  });
  it('as it is dimmed on a port today, in the same words', () => {
    render(<NearbyResourcesPanel config={{ tradeRouteAccess: 'port', nearbyResourcesRandom: false, nearbyResources: [] }} updateConfig={vi.fn()} />);
    expect(crossroadsButton()?.getAttribute('title')).toBe(`${WARNING}. Click to force include anyway`);
  });
  it('on a crossroads it is offered plainly', () => {
    render(<NearbyResourcesPanel config={{ tradeRouteAccess: 'crossroads', nearbyResourcesRandom: false, nearbyResources: [] }} updateConfig={vi.fn()} />);
    expect(crossroadsButton(), 'the crossroads button is on the panel').toBeTruthy();
    // anchored: the button was just found, so its title is read from the panel and not from a missing node
    expect(crossroadsButton()?.getAttribute('title') || '').not.toMatch(/force include/);
  });
  it('a forced position warns on a road in the same words as on a port; never on a crossroads', () => {
    const forced = (route) => checkStructuralValidity([], { tradeRouteAccess: route, nearbyResourcesRandom: false, nearbyResources: ['crossroads_position'] })
      .violations.filter((v) => v.type === 'resource_access_violation').map((v) => v.reason);
    expect(forced('road')).toEqual(forced('port'));
    expect(forced('road')).toEqual([WARNING]);
    expect(forced('crossroads')).toEqual([]);
  });
  it('the roll\'s pool is unchanged: on a road the row stays `compatible`, only `offered` says no', () => {
    const row = getCompatibleResources('road').find((r) => r.key === 'crossroads_position');
    expect(row).toMatchObject({ compatible: true, offered: false, incompatibleReason: WARNING });
    expect(getCompatibleResources('crossroads').find((r) => r.key === 'crossroads_position')).toMatchObject({ compatible: true, offered: true });
  });
});
