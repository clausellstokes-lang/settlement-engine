/**
 * @vitest-environment jsdom
 */
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
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

const manifest = {
  kind: 'TownSceneManifest',
  schemaVersion: 1,
  compiler: { compilerVersion: 1 },
  source: {
    audience: 'dm',
    structureDigest: 'structure',
    dressDigest: 'dress',
  },
  space: { headingTurnDenominator: 16, elevationTurnDenominator: 16 },
  terrain: {},
  districts: [{ id: 'district:market', name: 'Market Ward' }],
  roads: [],
  walls: [],
  gates: [],
  buildings: [{
    id: 'building:market',
    semanticId: 'building:market',
    anchorKey: 'institution:market',
    skinId: 'stoneAshlar',
  }],
  vegetation: [],
  living: {},
  materials: [],
  semantics: [{
    sceneId: 'building:market',
    entityKind: 'building',
    anchorKey: 'institution:market',
    canonicalRef: { kind: 'institution', id: 'market' },
    districtId: 'district:market',
    label: 'The Covered Market',
    provenanceRefs: ['institution:market'],
  }, {
    sceneId: 'district:district:market',
    entityKind: 'district',
    anchorKey: 'district:market',
    canonicalRef: { kind: 'district', id: 'district:market' },
    districtId: 'district:market',
    label: 'Market Ward',
    provenanceRefs: [],
  }],
  provenance: [{
    id: 'institution:market',
    effect: 'anchors commerce',
    family: 'economy',
    sourceRef: 'institution:market',
  }],
  cameraPresets: [{
    id: 'overview',
    label: 'Overview',
    target: [0, 0, 0],
    azimuthStep: 2,
    elevationStep: 2,
    distanceCm: 1000,
  }],
  budgets: {},
};

vi.mock('../../src/domain/townScene/sceneCompileInput.js', () => ({
  prepareTownSceneCompileInput: vi.fn(({ settlement, audience }) => ({
    kind: 'TownSceneCompileInput',
    inputDigest: `input:${audience}:${settlement?.id || 'draft'}`,
    settlementId: settlement?.id || 'draft',
    audience,
  })),
}));

vi.mock('../../src/lib/townScene/townSceneWorkerClient.js', () => ({
  createTownSceneWorkerClient: vi.fn(() => {
    let disposed = false;
    return {
      async compile(sceneInput, options, requestOptions = {}) {
        if (disposed) throw new Error('Town-scene worker client is disposed');
        const sceneManifest = {
          ...manifest,
          source: {
            ...manifest.source,
            audience: sceneInput.audience,
            structureDigest: `structure:${sceneInput.settlementId}`,
          },
          semantics: manifest.semantics.map((semantic) => ({
            ...semantic,
            label: `${semantic.label} (${sceneInput.audience})`,
          })),
        };
        const manifestDigest = (
          `digest:${sceneManifest.source.audience}:${sceneManifest.source.structureDigest}`
        );
        requestOptions.onManifest?.({ manifest: sceneManifest, manifestDigest });
        const compiled = {
          kind: 'TownSceneGeometryBundle',
          manifestDigest,
          options,
          bounds: { min: [0, 0, 0], max: [100, 100, 100] },
          batches: [],
          templates: [],
          instances: [],
        };
        if (!options.massingOnly) {
          requestOptions.onProgress?.({
            stage: 'massing',
            geometry: { ...compiled, options: { ...options, massingOnly: true } },
          });
          if (sceneInput.settlementId === 'settlement:runtime-recovery') {
            await new Promise(resolve => setTimeout(resolve, 20));
          }
        }
        return {
          manifest: sceneManifest,
          manifestDigest,
          geometry: compiled,
          transport: 'worker',
        };
      },
      dispose() {
        disposed = true;
      },
    };
  }),
}));

const runtimePairs = vi.hoisted(() => []);

vi.mock('../../src/components/townMap/scene3d/TownSceneCanvas.jsx', () => ({
  default: function FakeTownSceneCanvas({
    manifest: sceneManifest,
    geometry: sceneGeometry,
    quality,
    cameraRequest,
    reducedMotion,
    onCameraInteraction,
    onPick,
  }) {
    runtimePairs.push(`${sceneManifest.source.audience}:${sceneGeometry.manifestDigest}`);
    if (
      sceneManifest.source.structureDigest
        === 'structure:settlement:runtime-recovery'
      && sceneGeometry.options?.massingOnly
    ) {
      throw new Error('Synthetic progressive-render failure');
    }
    return (
      <>
        <button
          type="button"
          data-testid="fake-town-scene-canvas"
          data-runtime-pair={`${sceneManifest.source.audience}:${sceneGeometry.manifestDigest}`}
          data-effective-quality={quality.quality}
          data-camera-kind={cameraRequest?.kind || ''}
          data-camera-scale={cameraRequest?.scale || ''}
          data-reduced-motion={String(reducedMotion)}
          onClick={() => onPick('building:market')}
        >
          Pick market in canvas
        </button>
        <button
          type="button"
          data-testid="fake-camera-interaction"
          onClick={onCameraInteraction}
        >
          Simulate camera interaction
        </button>
      </>
    );
  },
}));

import SettlementScene3D from '../../src/components/townMap/scene3d/SettlementScene3D.jsx';
import TownSceneInspector from '../../src/components/townMap/scene3d/TownSceneInspector.jsx';
import TownSceneLivingSummary from '../../src/components/townMap/scene3d/TownSceneLivingSummary.jsx';
import TownSceneOrphanOverrides from '../../src/components/townMap/scene3d/TownSceneOrphanOverrides.jsx';

afterEach(cleanup);
afterEach(() => { runtimePairs.length = 0; });

describe('SettlementScene3D product integration', () => {
  it('does not mistake an unavailable manifest for deletion of every edit target', () => {
    render(
      <TownSceneOrphanOverrides
        manifest={null}
        mapEdits={{
          sceneOverrides: [{
            anchor: 'institution:market',
            skinId: 'stoneAshlar',
          }],
        }}
        audience="dm"
        canEdit
        onCommitEdits={vi.fn()}
      />,
    );

    expect(screen.queryByLabelText('Orphaned portrait edits')).toBeNull();
  });

  it('progressively mounts its lazy canvas and mirrors semantic selection', async () => {
    const onSelect = vi.fn();
    render(
      <SettlementScene3D
        settlement={{ id: 'settlement:test' }}
        audience="dm"
        onSelect={onSelect}
        capabilityOverride={{ available: true, reason: null }}
      />,
    );

    const canvas = await screen.findByTestId('fake-town-scene-canvas');
    const overview = screen.getByRole('button', { name: 'Overview' });
    await waitFor(() => expect(overview.getAttribute('aria-pressed')).toBe('true'));
    fireEvent.click(screen.getByTestId('fake-camera-interaction'));
    expect(overview.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(canvas);
    expect(onSelect).toHaveBeenCalledWith(
      'building:market',
      expect.objectContaining({
        semantic: expect.objectContaining({ label: 'The Covered Market (dm)' }),
        source: 'canvas',
      }),
    );
    expect(screen.getByRole('heading', { name: 'The Covered Market (dm)' })).toBeTruthy();
  });

  it('keeps Workbench, Herald, and cosmetic edits in product callbacks', async () => {
    const onOpenWorkbench = vi.fn();
    const onOpenHerald = vi.fn();
    const onCommitEdits = vi.fn();
    const onUndo = vi.fn();
    const onRedo = vi.fn();
    render(
      <SettlementScene3D
        settlement={{ id: 'settlement:test' }}
        mapEdits={null}
        audience="dm"
        canEdit
        selectedNodeId="building:market"
        onCommitEdits={onCommitEdits}
        canUndo
        canRedo
        onUndo={onUndo}
        onRedo={onRedo}
        onOpenWorkbench={onOpenWorkbench}
        onOpenHerald={onOpenHerald}
        capabilityOverride={{ available: true, reason: null }}
      />,
    );

    await screen.findByRole('heading', { name: 'The Covered Market (dm)' });
    fireEvent.click(screen.getByRole('button', { name: 'Open in Workbench' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open the Herald' }));
    fireEvent.click(screen.getByRole('button', { name: 'Rotate right' }));
    fireEvent.click(screen.getByRole('button', { name: 'Undo portrait edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Redo portrait edit' }));

    expect(onOpenWorkbench).toHaveBeenCalledWith(expect.objectContaining({
      sceneId: 'building:market',
      canonicalRef: { kind: 'institution', id: 'market' },
    }));
    expect(onOpenHerald).toHaveBeenCalledWith(expect.objectContaining({
      provenanceRefs: ['institution:market'],
      provenance: [expect.objectContaining({ effect: 'anchors commerce' })],
    }));
    expect(onCommitEdits).toHaveBeenCalledWith(
      expect.objectContaining({
        sceneOverrides: [expect.objectContaining({
          anchor: 'institution:market',
          headingOffsetStep: 1,
        })],
      }),
      expect.objectContaining({ action: 'rotate-right', anchor: 'institution:market' }),
    );
    expect(onUndo).toHaveBeenCalledOnce();
    expect(onRedo).toHaveBeenCalledOnce();
  });

  it('translates typed scene facts and exact connected-settlement actions without inference', () => {
    const onOpenWorkbench = vi.fn();
    const onOpenHerald = vi.fn();
    render(
      <TownSceneInspector
        audience="player"
        semantic={{
          sceneId: 'road:approach:0',
          entityKind: 'road',
          label: 'Approach road',
          canonicalRef: { kind: 'map-element', id: 'road:approach:0' },
          workbenchRef: {
            kind: 'settlement',
            id: 'settlement:neighbor',
            label: 'Northwatch',
          },
          provenanceRefs: [],
          chronicleRefs: [],
          relatedRefs: {
            factionRefs: [],
            pressureRefs: [],
            storyRefs: [],
          },
          details: {
            kind: 'road',
            roadKind: 'arterial',
            connectionLabel: 'Northwatch',
            relationshipType: 'trade partner',
            districtIds: ['district:market'],
            gateIds: ['gate:0'],
            bridgeIds: [],
          },
        }}
        onOpenWorkbench={onOpenWorkbench}
        onOpenHerald={onOpenHerald}
      />,
    );

    expect(screen.getByText(/player-safe projection/i)).toBeTruthy();
    expect(screen.getByText('Arterial')).toBeTruthy();
    expect(screen.getByText('Northwatch')).toBeTruthy();
    expect(screen.getByText('Trade Partner')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Open connected settlement' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open the Herald' }));
    expect(onOpenWorkbench).toHaveBeenCalledWith(expect.objectContaining({
      workbenchRef: expect.objectContaining({
        kind: 'settlement',
        id: 'settlement:neighbor',
      }),
    }));
    expect(onOpenHerald).toHaveBeenCalledOnce();
  });

  it('states when district control is unrecorded instead of inventing a faction', () => {
    render(
      <TownSceneInspector
        audience="dm"
        semantic={{
          sceneId: 'district:market',
          entityKind: 'district',
          label: 'Market Ward',
          canonicalRef: { kind: 'district', id: 'market' },
          provenanceRefs: [],
          chronicleRefs: [],
          relatedRefs: {
            factionRefs: [],
            pressureRefs: [],
            storyRefs: [],
          },
          details: {
            kind: 'district',
            category: 'merchant',
            wealthBand: 'comfortable',
            safetyBand: 'tense',
            densityPermille: 640,
            synthetic: false,
          },
        }}
      />,
    );

    expect(screen.getByText(/dm projection/i)).toBeTruthy();
    expect(screen.getByText('Not recorded for this quarter')).toBeTruthy();
    expect(screen.getByText('64%')).toBeTruthy();
  });

  it('reports orphaned overrides and relinks them through one undoable parent commit', async () => {
    const onCommitEdits = vi.fn();
    const onUndo = vi.fn();
    const common = {
      settlement: { id: 'settlement:test' },
      audience: 'dm',
      canEdit: true,
      onCommitEdits,
      onUndo,
      capabilityOverride: { available: true, reason: null },
    };
    const { rerender } = render(
      <SettlementScene3D
        {...common}
        mapEdits={{
          layoutVariant: 2,
          sceneOverrides: [{
            anchor: 'institution:gone',
            skinId: 'timberVillage',
            headingOffsetStep: 2,
          }],
        }}
      />,
    );

    expect(await screen.findByRole('heading', {
      name: '1 portrait edit needs a target',
    })).toBeTruthy();
    expect(screen.getByText(/nothing was changed automatically/i)).toBeTruthy();
    expect(screen.getByRole('button', {
      name: 'Remove orphaned override',
    })).toBeTruthy();

    fireEvent.change(screen.getByRole('combobox', {
      name: 'Relink destination for institution:gone',
    }), {
      target: { value: 'institution:market' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Relink override' }));

    expect(onCommitEdits).toHaveBeenCalledOnce();
    const [nextEdits, metadata] = onCommitEdits.mock.calls[0];
    expect(nextEdits).toEqual({
      layoutVariant: 2,
      sceneOverrides: [{
        anchor: 'institution:market',
        skinId: 'timberVillage',
        headingOffsetStep: 2,
      }],
    });
    expect(metadata).toEqual({
      kind: 'scene-override',
      action: 'relink-orphan',
      anchor: 'institution:market',
      sourceAnchor: 'institution:gone',
      targetAnchor: 'institution:market',
      sceneId: 'building:market',
    });

    rerender(<SettlementScene3D {...common} mapEdits={nextEdits} canUndo />);
    expect(screen.queryByRole('heading', {
      name: '1 portrait edit needs a target',
    })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Undo portrait edit' }));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it('Escape clears search and selection, and non-institutions do not offer Workbench', async () => {
    const onSelect = vi.fn();
    const onOpenWorkbench = vi.fn();
    const { rerender } = render(
      <SettlementScene3D
        settlement={{ id: 'settlement:test' }}
        audience="dm"
        selectedNodeId="district:district:market"
        onSelect={onSelect}
        onOpenWorkbench={onOpenWorkbench}
        capabilityOverride={{ available: true, reason: null }}
      />,
    );
    await screen.findByRole('heading', { name: 'Market Ward (dm)' });
    expect(screen.queryByRole('button', { name: 'Open in Workbench' })).toBeNull();

    rerender(
      <SettlementScene3D
        settlement={{ id: 'settlement:test' }}
        audience="dm"
        onSelect={onSelect}
        onOpenWorkbench={onOpenWorkbench}
        capabilityOverride={{ available: true, reason: null }}
      />,
    );
    const search = screen.getByRole('searchbox', { name: 'Find a settlement place' });
    fireEvent.change(search, { target: { value: 'market' } });
    fireEvent.keyDown(search, { key: 'Escape' });
    expect(search.value).toBe('');
    expect(onSelect).toHaveBeenLastCalledWith(
      null,
      expect.objectContaining({ semantic: null, source: 'semantic-list' }),
    );
  });

  it('never joins a new player manifest to stale DM geometry', async () => {
    const props = {
      capabilityOverride: { available: true, reason: null },
    };
    const { rerender } = render(
      <SettlementScene3D
        {...props}
        settlement={{ id: 'settlement:dm' }}
        audience="dm"
      />,
    );
    await screen.findByTestId('fake-town-scene-canvas');
    expect(screen.getByTestId('fake-town-scene-canvas').dataset.runtimePair)
      .toBe('dm:digest:dm:structure:settlement:dm');

    rerender(
      <SettlementScene3D
        {...props}
        settlement={{ id: 'settlement:player' }}
        audience="player"
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('fake-town-scene-canvas').dataset.runtimePair)
        .toBe('player:digest:player:structure:settlement:player');
    });
    expect(runtimePairs).not.toContain('player:digest:dm:structure:settlement:dm');
  });

  it('recovers the final bundle after a progressive renderer failure', async () => {
    const onFallback = vi.fn();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(
        <SettlementScene3D
          settlement={{ id: 'settlement:runtime-recovery' }}
          audience="dm"
          onFallback={onFallback}
          capabilityOverride={{ available: true, reason: null }}
        />,
      );

      expect(await screen.findByText(/3D portrait is unavailable/i)).toBeTruthy();
      expect(await screen.findByTestId('fake-town-scene-canvas')).toBeTruthy();
      expect(onFallback).toHaveBeenCalledWith(expect.objectContaining({
        reason: 'renderer-boundary-failed',
        recoverable: true,
      }));
    } finally {
      consoleError.mockRestore();
    }
  });

  it('announces and reports a capability fallback without loading Three', async () => {
    const onFallback = vi.fn();
    render(
      <SettlementScene3D
        settlement={{ id: 'settlement:test' }}
        audience="dm"
        onFallback={onFallback}
        capabilityOverride={{ available: false, reason: 'webgl2-unavailable' }}
      />,
    );

    await waitFor(() => expect(onFallback).toHaveBeenCalledWith({
      reason: 'webgl2-unavailable',
      recoverable: false,
    }));
    expect(screen.queryByTestId('fake-town-scene-canvas')).toBeNull();
    expect(screen.getAllByText(/settlement plan remains available/i).length).toBeGreaterThan(0);
  });

  it('applies manual quality ceilings and offers a direct Plan escape', async () => {
    const onFallback = vi.fn();
    render(
      <SettlementScene3D
        settlement={{ id: 'settlement:test' }}
        audience="dm"
        onFallback={onFallback}
        capabilityOverride={{ available: true, reason: null }}
      />,
    );

    const canvas = await screen.findByTestId('fake-town-scene-canvas');
    const quality = screen.getByRole('combobox', { name: 'Rendering quality' });
    expect(quality.value).toBe('auto');

    fireEvent.change(quality, { target: { value: 'medium' } });
    await waitFor(() => expect(canvas.dataset.effectiveQuality).toBe('0.7'));
    expect(screen.getByText(/current detail is 70%/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    await waitFor(() => expect(canvas.dataset.cameraKind).toBe('zoom'));
    expect(canvas.dataset.cameraScale).toBe('0.78');

    fireEvent.click(screen.getByRole('button', { name: 'Use 2D plan' }));
    expect(onFallback).toHaveBeenCalledWith({
      reason: 'user-selected-plan',
      recoverable: true,
    });
  });

  it('mirrors authorized living conditions as textual, selectable state', () => {
    const onSelect = vi.fn();
    const semantic = {
      sceneId: 'hazard:flooded-ford',
      entityKind: 'hazard',
      label: 'Flooded ford',
    };
    render(
      <TownSceneLivingSummary
        living={{
          atmosphere: { season: 'autumn', besieged: false },
          conditions: [{
            id: 'hazard:flooded-ford',
            label: 'Flooded ford',
            severityBand: 'high',
            severityPermille: 820,
          }],
          scars: [],
          reconstruction: [],
        }}
        semantics={[semantic]}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText('Autumn season')).toBeTruthy();
    expect(screen.getByText('High severity · 82% intensity')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Flooded ford/i }));
    expect(onSelect).toHaveBeenCalledWith('hazard:flooded-ford', semantic);
  });

  it('threads reduced-motion preference into the animation-free runtime', async () => {
    const priorMatchMedia = globalThis.matchMedia;
    globalThis.matchMedia = vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    try {
      render(
        <SettlementScene3D
          settlement={{ id: 'settlement:reduced-motion' }}
          capabilityOverride={{ available: true, reason: null }}
        />,
      );
      const canvas = await screen.findByTestId('fake-town-scene-canvas');
      await waitFor(() => expect(canvas.dataset.reducedMotion).toBe('true'));
    } finally {
      cleanup();
      globalThis.matchMedia = priorMatchMedia;
    }
  });

  it('survives the Strict Mode setup-cleanup-setup lifecycle', async () => {
    const onFallback = vi.fn();
    render(
      <React.StrictMode>
        <SettlementScene3D
          settlement={{ id: 'settlement:strict-mode' }}
          onFallback={onFallback}
          capabilityOverride={{ available: true, reason: null }}
        />
      </React.StrictMode>,
    );

    await screen.findByTestId('fake-town-scene-canvas');
    expect(onFallback).not.toHaveBeenCalledWith(expect.objectContaining({
      reason: 'geometry-compile-failed',
    }));
  });
});
