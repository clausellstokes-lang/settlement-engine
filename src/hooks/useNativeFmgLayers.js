/**
 * useNativeFmgLayers — the ONE owner of "the FMG iframe shows the native layers
 * (state borders, culture regions, biomes) that mapState.layers says it shows".
 *
 * The three flags are the store's truth (persisted with the campaign's map); the
 * frame only shows what it is told, through `settlementEngine:setFmgLayer`
 * (public/map/sf-bridge.js), which flips each layer's <g> display and lazy-draws
 * biomes on the first show into an empty group. So a flag must be pushed:
 *   - when the bridge first connects (first open);
 *   - when the flag changes (the Layers panel, the terrain toolbar's Biomes button);
 *   - and every time the frame's MAP IS REPLACED, because a replacement throws the
 *     previous push away. FMG's regenerateMap runs undraw() (public/map/main.js),
 *     which deletes every <path> in the viewbox, #biomes included, and its
 *     drawLayers() redraws biomes only when FMG's OWN toggleBiomes is on, which the
 *     bridge never turns on; a snapshot load replaces the whole SVG, so every layer's
 *     display comes back as the snapshot serialized it.
 * The third case was missing: a campaign saved with Biomes on, opened as an Instant
 * World (useInstantWorldMaterialize regenerates AFTER the bridge is up), showed the
 * switch ON and no biome on the map (2026-10-02, the landing realm re-cut).
 *
 * The replacement is caught at the bridge, not at its callers: the frame posts
 * `fmg:mapReset` after every resetMap and `fmg:snapshotLoaded` after every
 * loadSnapshot, whoever asked for them, and a frame document that comes up again
 * re-announces `fmg:ready`. Each re-push reads the flags LIVE from the store at the
 * moment the event lands, so a Regenerate (which resets mapState) re-pushes the
 * reset values, never the ones the reset just cleared.
 *
 * Pinned by tests/ui/worldMapNativeLayers.test.jsx (every lifecycle path, in the
 * gate) and e2e/realm-native-layers.spec.js (the real frame paints the biomes).
 */
import { useEffect } from 'react';
import { useStore } from '../store/index.js';

/**
 * Each native flag in mapState.layers, paired with the `layer` key the bridge's
 * setFmgLayer handler maps to FMG's own <g> ids (sf-bridge.js LAYER_MAP).
 * @type {ReadonlyArray<readonly [string, string]>}
 */
export const NATIVE_FMG_LAYERS = Object.freeze([
  Object.freeze(/** @type {const} */ (['nativeStateBorders', 'stateBorders'])),
  Object.freeze(/** @type {const} */ (['nativeCultureRegions', 'cultures'])),
  Object.freeze(/** @type {const} */ (['nativeBiomes', 'biomes'])),
]);

/** The bridge push events after which the frame holds a NEW map. */
export const MAP_REPLACED_EVENTS = Object.freeze(['mapReset', 'snapshotLoaded', 'ready']);

/**
 * @param {any} bridge the live map bridge (src/lib/mapBridge.js)
 * @param {string} layer a setFmgLayer key
 * @param {unknown} visible
 */
function pushFmgLayer(bridge, layer, visible) {
  bridge.call('settlementEngine:setFmgLayer', { layer, visible: !!visible })
    .catch((/** @type {unknown} */ e) => console.warn(`[WorldMap] setFmgLayer ${layer} failed`, e));
}

/**
 * Push every native flag into the frame (an absent flag reads as off).
 * @param {any} bridge
 * @param {Record<string, unknown> | null | undefined} layers mapState.layers
 */
export function pushNativeFmgLayers(bridge, layers) {
  for (const [flag, layer] of NATIVE_FMG_LAYERS) pushFmgLayer(bridge, layer, layers?.[flag]);
}

/**
 * One flag's push on first connection and on every change of that flag.
 * @param {{ current: any }} bridgeRef
 * @param {boolean} bridgeReady
 * @param {readonly [string, string]} entry a NATIVE_FMG_LAYERS row
 */
function useNativeFmgLayerFlag(bridgeRef, bridgeReady, [flag, layer]) {
  const visible = useStore((/** @type {any} */ s) => s.mapState.layers[flag]);
  useEffect(() => {
    if (!bridgeReady) return;
    const bridge = bridgeRef.current;
    if (!bridge) return;
    pushFmgLayer(bridge, layer, visible);
  }, [bridgeReady, bridgeRef, layer, visible]);
}

/**
 * @param {{ bridgeRef: { current: any }, bridgeReady: boolean }} args
 */
export function useNativeFmgLayers({ bridgeRef, bridgeReady }) {
  const [stateBorders, cultureRegions, biomes] = NATIVE_FMG_LAYERS;
  useNativeFmgLayerFlag(bridgeRef, bridgeReady, stateBorders);
  useNativeFmgLayerFlag(bridgeRef, bridgeReady, cultureRegions);
  useNativeFmgLayerFlag(bridgeRef, bridgeReady, biomes);

  // Every replacement of the frame's map re-pushes all three, read live.
  useEffect(() => {
    if (!bridgeReady) return undefined;
    const bridge = bridgeRef.current;
    if (!bridge) return undefined;
    const repush = () => pushNativeFmgLayers(bridge, useStore.getState().mapState?.layers);
    const offs = MAP_REPLACED_EVENTS.map((event) => bridge.on(event, repush));
    return () => { for (const off of offs) off?.(); };
  }, [bridgeReady, bridgeRef]);
}
