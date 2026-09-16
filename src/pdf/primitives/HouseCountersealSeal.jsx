/**
 * pdf/primitives/HouseCountersealSeal — THE SETTLEMENT COUNTERSEAL for the PDF
 * (V-27c, the structured-path refactor that closes the recorded seam).
 *
 * The web dossier foot closes like a charter: the maker's device (HouseDeviceSeal)
 * beside the subject's own seeded medallion. The medallion was web-only because the
 * ornament pool draws SVG STRINGS react-pdf cannot mount. This renders it through
 * @react-pdf's Svg/Path/Circle from the structured geometry (ornament/emblemPaths),
 * selecting the emblem with the SAME seeded picker the web counterseal uses
 * (seededPicker(seed).pick('emblem', EMBLEMS)) — so a given settlement gets the
 * SAME mark on screen and in the export (bar 11 determinism across surfaces).
 *
 * Decorative + text-free by construction (no <Text> ever — it adds nothing to the
 * PDF's text leaves, so the goldenViewModel / collectText parity family is
 * unmoved). Inked to match HouseDeviceSeal (devicePalette).
 */
import { Svg, Path, Circle } from '@react-pdf/renderer';
import { seededPicker } from '../../design/organic/ornament/fnv.js';
import { EMBLEMS } from '../../design/organic/ornament/pools.js';
import { EMBLEM_PATHS, EMBLEM_VIEWBOX } from '../../design/organic/ornament/emblemPaths.js';
import { devicePalette } from '../../design/organic/logo.js';

/** The emblem name a seed selects — the SAME choice the web `emblem(seed)` makes. */
export function countersealEmblemName(seed) {
  return seededPicker(seed).pick('emblem', EMBLEMS).name;
}

/**
 * @param {object} props
 * @param {string} props.seed — the settlement name (seeds the medallion).
 * @param {number} [props.size=14]
 * @param {'light'|'dark'} [props.mode='light']
 */
export function HouseCountersealSeal({ seed, size = 14, mode = 'light' }) {
  if (!seed) return null;
  const name = countersealEmblemName(seed);
  const nodes = EMBLEM_PATHS[name];
  if (!nodes) return null;
  const p = devicePalette(mode);
  const strokeCommon = { fill: 'none', stroke: p.ink, strokeLineCap: 'round', strokeLineJoin: 'round' };
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${EMBLEM_VIEWBOX} ${EMBLEM_VIEWBOX}`}>
      {nodes.map((n, i) => {
        const paint = n.role === 'fill'
          ? { fill: p.ink }
          : { ...strokeCommon, strokeWidth: n.w || 2 };
        return n.el === 'circle'
          ? <Circle key={i} cx={n.cx} cy={n.cy} r={n.r} {...paint} />
          : <Path key={i} d={n.d} {...paint} />;
      })}
    </Svg>
  );
}
