/**
 * pdf/primitives/HouseDeviceSeal — THE HOUSE DEVICE for the PDF pipeline.
 *
 * Renders the canonical hand-inked device via @react-pdf's Svg/Path (the
 * TownMapPlate precedent) from the ONE path source (design/organic/logo.js) —
 * no forked geometry. Used on the dossier cover (the export colophon's seal).
 *
 * The settlement's seeded COUNTERSEAL is deliberately NOT rendered here: the
 * ornament pool draws SVG strings (for the DOM), which react-pdf cannot mount —
 * a structured-path refactor is the recorded seam (census: DEFERRED). The web
 * dossier foot carries the full seal-and-counterseal pair.
 */
import { Svg, Path, Circle } from '@react-pdf/renderer';
import { DEVICE_PATHS, DEVICE_DOT, DEVICE_WEIGHTS, devicePalette } from '../../design/organic/logo.js';

export function HouseDeviceSeal({ size = 18 }) {
  const p = devicePalette('light');
  const w = DEVICE_WEIGHTS.standard;
  const common = { fill: 'none', stroke: p.ink, strokeLineCap: 'round', strokeLineJoin: 'round' };
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path d={DEVICE_PATHS.ring} {...common} strokeWidth={w.ring} />
      <Path d={DEVICE_PATHS.skyline} {...common} strokeWidth={w.skyline} />
      <Path d={DEVICE_PATHS.triangle} {...common} strokeWidth={w.triangle} />
      <Circle cx={DEVICE_DOT.cx} cy={DEVICE_DOT.cy} r={DEVICE_DOT.r} fill={p.rubric} />
    </Svg>
  );
}
