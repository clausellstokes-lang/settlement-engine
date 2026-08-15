/**
 * @vitest-environment jsdom
 *
 * Accessibility checks that are meaningful without a physical browser/device.
 * These contracts cover semantic DOM order and authored media-query behavior;
 * they deliberately do not claim screen-reader, high-contrast screenshot, or
 * browser-zoom journey evidence.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import React from 'react';
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  cleanup,
  render,
  screen,
} from '@testing-library/react';

import TownSceneSemanticList from '../../src/components/townMap/scene3d/TownSceneSemanticList.jsx';
import TownSceneViewerControls from '../../src/components/townMap/scene3d/TownSceneViewerControls.jsx';

const ROOT = resolve(process.cwd());
const SCENE_A11Y_CSS = readFileSync(
  resolve(
    ROOT,
    'src/components/townMap/scene3d/townSceneA11y.css',
  ),
  'utf8',
);
const GLOBAL_A11Y_CSS = readFileSync(
  resolve(ROOT, 'src/styles/a11y.css'),
  'utf8',
);
const SCENE_SOURCE = readFileSync(
  resolve(
    ROOT,
    'src/components/townMap/scene3d/SettlementScene3D.jsx',
  ),
  'utf8',
);

afterEach(cleanup);

describe('TownScene locally testable accessibility contract', () => {
  it('authors explicit forced-colors, high-zoom, and coarse-pointer behavior', () => {
    expect(SCENE_SOURCE).toMatch(/data-town-scene-layout/);
    expect(SCENE_A11Y_CSS).toMatch(
      /@media\s*\(forced-colors:\s*active\)\s*\{/,
    );
    expect(SCENE_A11Y_CSS).toMatch(
      /\[data-town-scene-3d\]\s+canvas\s*\{[\s\S]*forced-color-adjust:\s*none/,
    );
    expect(SCENE_A11Y_CSS).toMatch(
      /\[data-town-scene-3d\]\s+\[aria-current="true"\]/,
    );
    expect(SCENE_A11Y_CSS).toMatch(
      /@media\s*\(max-width:\s*900px\)[\s\S]*\[data-town-scene-layout\][\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*!important/,
    );
    expect(SCENE_A11Y_CSS).toMatch(
      /@media\s*\(pointer:\s*coarse\)[\s\S]*min-height:\s*44px/,
    );
  });

  it('retains both the global motion floor and runtime preference threading', () => {
    expect(GLOBAL_A11Y_CSS).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*animation-duration:\s*1ms\s*!important/,
    );
    expect(SCENE_SOURCE).toContain(
      "globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')",
    );
    expect(SCENE_SOURCE).toMatch(
      /<TownSceneCanvas[\s\S]*reducedMotion=\{reducedMotion\}/,
    );
  });

  it('places named non-gesture controls before camera, search, and place controls in tab order', () => {
    render(
      <section data-town-scene-3d="test">
        <TownSceneViewerControls
          qualityMode="auto"
          effectiveQuality={1}
          onQualityModeChange={vi.fn()}
          onZoomIn={vi.fn()}
          onZoomOut={vi.fn()}
          onUsePlan={vi.fn()}
        />
        <TownSceneSemanticList
          semantics={[{
            sceneId: 'building:market',
            entityKind: 'building',
            canonicalRef: {
              kind: 'institution',
              id: 'market',
            },
            districtId: 'district:market',
            label: 'Covered Market',
          }]}
          districts={[{
            id: 'district:market',
            name: 'Market Ward',
          }]}
          cameraPresets={[{
            id: 'overview',
            label: 'Overview',
          }]}
          selectedNodeId={null}
          selectedCameraId="overview"
          onSelect={vi.fn()}
          onRequestCamera={vi.fn()}
        />
      </section>,
    );

    const expectedOrder = [
      screen.getByRole('combobox', { name: 'Rendering quality' }),
      screen.getByRole('button', { name: 'Zoom in' }),
      screen.getByRole('button', { name: 'Zoom out' }),
      screen.getByRole('button', { name: 'Use 2D plan' }),
      screen.getByRole('button', { name: 'Overview' }),
      screen.getByRole('searchbox', { name: 'Find a settlement place' }),
      screen.getByRole('button', { name: /Covered Market/ }),
    ];
    const focusable = [
      ...document.querySelectorAll(
        'button:not([disabled]), select:not([disabled]), '
        + 'input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ];

    expect(focusable).toEqual(expectedOrder);
    for (const element of expectedOrder) {
      element.focus();
      expect(document.activeElement).toBe(element);
    }
  });
});
