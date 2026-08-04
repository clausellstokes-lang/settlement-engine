/**
 * MakerPlate.jsx — THE MAKER'S PLATE: an aged-bronze heater escutcheon, mounted on
 * the shaft, with the house device struck into its face.
 *
 * Owner task #78, built to the research-locked spec. It replaces the bare house
 * device in the header lockup: the mark is no longer floating on the wood, it is
 * riveted to it on a small bronze plate, the way a maker's plate actually is.
 *
 * ⚠️⚠️ THE DEVICE'S FILL CARRIES 100% OF THE CONTRAST; THE RELIEF CARRIES 0%.
 * This is the heraldic RULE OF TINCTURE enforced as code: a METAL (PLATE_DEVICE, pale
 * parchment-gold) on a COLOUR (the bronze face), clearing AA by fill alone with the
 * emboss switched off. Every relief layer here — the bevel, the emboss offsets, the
 * keyline, the grit, the rivets — is CHARACTER ONLY. If a browser drops all of them
 * the plate still reads. That is deliberate: relief is the first thing to go on a
 * low-quality raster, at a forced-colours setting, or under a reduced-transparency
 * preference, and a mark whose legibility depended on it would vanish there.
 *
 * ⚠️⚠️ NEVER PUT A CSS `filter` ON AN ANCESTOR OF THIS — THE CONTAINING-BLOCK TRAP.
 * A non-`none` filter on an element makes it the containing block for every
 * `position: fixed` descendant, so a filter applied to the header (or to the lockup
 * wrapper) would silently re-parent every fixed overlay in the app — modals, the
 * mobile nudge, the FAB — to a 38px-tall bar, and they would render inside it. The
 * research pass reproduced exactly that. So the mounting shadow is a filter on THIS
 * SVG, which is a leaf and contains nothing, and the emboss is layered ZERO-BLUR
 * offsets rather than a blur filter — which the same pass measured as CRISPER than an
 * SVG filter at the 14-20px sizes this plate is actually drawn at.
 *
 * ⚠️ THE BEVEL IS CONFINED TO PLATE.margin AND THE DEVICE IS FORBIDDEN THERE.
 * PLATE_BEVEL_LIGHT is lighter than the face; a device sitting on it would measure
 * 4.28:1 and fail AA. It cannot, because the two occupy disjoint fractions of the
 * plate — the same geometric move SHAFT_STOPS.body makes for the barrel, and it is
 * pinned the same way: as a relationship between numbers, not as a promise.
 *
 * REDRAW FOR SIZE, NEVER SCALE DOWN. The favicon variant of this mark is a SIMPLER
 * DRAWING — the device alone, no plate — and the plate itself drops its grit and its
 * rivets below `size` 20 rather than rendering them at a sub-pixel weight where they
 * turn into dirt. `detail` is that switch, derived from the size it is asked for.
 *
 * ORNAMENT: TWO RIVETS, AND NOTHING ELSE. Rivets are mounting hardware — they say the
 * plate is fixed to something, which is the entire story. Wreaths, borders and
 * flourishes are forbidden by the spec because they say the plate is important, which
 * is a claim the plate is not entitled to make about itself.
 */
import {
  PLATE, PLATE_BEVEL_LIGHT, PLATE_BEVEL_SHADE, PLATE_DEEP, PLATE_DEVICE, PLATE_FACE,
  PLATE_KEYLINE, PLATE_LIT, PLATE_RIVET, PLATE_SHADOW,
} from '../theme.js';

/** The plate's own coordinate space: 5 wide by 6 tall, at 100 units of width. */
const W = 100;
const H = Math.round(W / PLATE.ratio);          // 120 — the heater's 5:6
const M = W * PLATE.margin;                     // the bevel's territory

/**
 * THE HEATER SILHOUETTE — flat top, straight sides for the upper two thirds, then
 * two curves meeting at a point. Authored as one closed path so the keyline, the
 * face and the clip are all the same shape and cannot drift apart.
 */
const SHIELD = `M 2 2 L ${W - 2} 2 L ${W - 2} ${H * 0.52}`
  + ` C ${W - 2} ${H * 0.82}, ${W * 0.72} ${H - 3}, ${W / 2} ${H - 3}`
  + ` C ${W * 0.28} ${H - 3}, 2 ${H * 0.82}, 2 ${H * 0.52} Z`;

/**
 * THE DEVICE'S FIELD — the inner box the mark is allowed to occupy, inset by the
 * bevel's margin on every side. ⚠️ This is the AA claim's geometry: nothing drawn
 * inside it ever touches PLATE_BEVEL_LIGHT. Exported so the pin can measure it
 * against the bevel rather than trust this comment.
 */
const FIELD = Object.freeze({ x: M, y: M, w: W - M * 2, h: H - M * 2 });

/**
 * ⚠️ THE GRIT'S SEED IS VETTED, AND THE VETTING IS A DERIVATION.
 *
 * SVG's feTurbulence is specified down to its PRNG, and that PRNG has DEGENERATE
 * seeds: initial lattices where a gradient vector comes out as exactly (0, 0), which
 * leaves a dead spot in the noise field. Engines then differ on how they handle it,
 * so a degenerate seed is the one thing that turns "deterministic texture" into a
 * cross-engine golden hazard. There are 66 of them below 20,000.
 *
 * The exclusion is therefore not a hardcoded blocklist that rots — it is the spec's
 * OWN lattice construction, re-run here, so ANY seed a future edit picks is checked
 * against the real condition. `isDegenerateSeed` is exported for the pin.
 *
 * @param {number} seed the feTurbulence seed to test
 * @returns {boolean} true when the spec's lattice yields a zero gradient vector
 */
function isDegenerateSeed(seed) {
  const M31 = 2147483647;
  const A = 16807;
  const Q = 127773;
  const R = 2836;
  let l = seed > 0 ? seed : 1;
  const step = () => {
    const r = A * (l % Q) - R * Math.floor(l / Q);
    l = r <= 0 ? r + M31 : r;
    return ((l % 512) - 256) / 256;
  };
  for (let k = 0; k < 4; k += 1) {
    for (let i = 0; i < 256; i += 1) {
      const gx = step();
      const gy = step();
      if (gx === 0 && gy === 0) return true;
    }
  }
  return false;
}

/**
 * THE GRIT — age, not gloss. A fractal-noise wash whose per-channel deviation is
 * capped at PLATE.gritAmp (8 of 255), which is enough to stop the face reading as a
 * flat swatch and far too little to move any contrast ratio.
 *
 * ⚠️ `color-interpolation-filters="sRGB"` IS SPELLED OUT AND IS NOT OPTIONAL. The
 * SVG default is linearRGB, engines disagree about it in filter chains, and the whole
 * point of a fixed seed is that the same bytes produce the same picture. Declaring
 * the space is what makes "deterministic" mean anything.
 *
 * @param {string} id the SVG-local id prefix
 * @returns {JSX.Element}
 */
const grit = (id) => (
  <filter
    id={`${id}-grit`}
    x="0"
    y="0"
    width="100%"
    height="100%"
    filterUnits="objectBoundingBox"
    colorInterpolationFilters="sRGB"
  >
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={PLATE.seed} result="n" />
    {/* Noise -> a neutral speckle at an alpha that caps the per-channel deviation at
        PLATE.gritAmp/255. The last column is the alpha bias; the 0.5 coefficients
        centre the wash so it darkens and lightens equally instead of only dirtying. */}
    <feColorMatrix
      in="n"
      type="matrix"
      values={`0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.32  ${PLATE.gritAmp / 255} ${PLATE.gritAmp / 255} 0 0 -${PLATE.gritAmp / 510}`}
    />
  </filter>
);

/**
 * THE MAKER'S PLATE.
 *
 * @param {Object} props
 * @param {number} [props.size=26] the plate's HEIGHT in px; its width follows the ratio.
 * @param {React.CSSProperties} [props.style]
 */
export default function MakerPlate({ size = 26, style }) {
  const id = 'maker-plate';
  // REDRAW FOR SIZE: below 20px the grit and the rivets are sub-pixel and turn into
  // dirt, so they are not drawn at all rather than drawn badly.
  const detail = size >= 20;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={Math.round(size * PLATE.ratio)}
      height={size}
      aria-hidden="true"
      focusable="false"
      data-testid="maker-plate"
      style={{
        display: 'block',
        // THE MOUNTING STACK — umbra, penumbra, ambient, in that order. One shadow
        // makes a sticker; three make a thing bolted to a surface: a tight near-black
        // contact under the plate's own edge, a soft mid one for the gap it stands
        // off by, and a wide faint one for the light the room throws back. The filter
        // is on the SVG itself — a leaf — never on an ancestor (the containing-block
        // trap; see the header note).
        filter: `drop-shadow(0px 0.5px 0.5px ${PLATE_SHADOW}) `
          + `drop-shadow(0.5px 1px 1.5px ${PLATE_SHADOW}) `
          + `drop-shadow(1px 2px 4px ${PLATE_SHADOW})`,
        ...style,
      }}
    >
      <defs>
        {/* The face, lit from PLATE_LIGHT_DEG: brightest at the top-left corner the
            light comes from, deepest at the point. */}
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor={PLATE_LIT} />
          <stop offset="0.45" stopColor={PLATE_FACE} />
          <stop offset="1" stopColor={PLATE_DEEP} />
        </linearGradient>
        {detail && grit(id)}
        <clipPath id={`${id}-shape`}><path d={SHIELD} /></clipPath>
      </defs>

      {/* 1 — THE KEYLINE, and it is load-bearing craft rather than decoration: one
          hard near-black hairline around the whole plate is what separates a rendered
          object from its background at small sizes, whatever the background is. It is
          drawn UNDER the face and half-clipped by it, so it reads as a line rather
          than as a border. */}
      <path d={SHIELD} fill={PLATE_KEYLINE} />
      <g clipPath={`url(#${id}-shape)`}>
        <path d={SHIELD} fill={`url(#${id}-face)`} transform={`translate(${PLATE.keyline} ${PLATE.keyline}) scale(${1 - (PLATE.keyline * 2) / W} ${1 - (PLATE.keyline * 2) / H})`} />
        {detail && <rect x="0" y="0" width={W} height={H} filter={`url(#${id}-grit)`} />}

        {/* 2 — THE BEVEL: a PAIR of inset strokes under the one light. The lit half
            rides the top-left inner edge and the shaded half the bottom-right, which
            is what says the plate stands PROUD of the wood. Both are near-tonal to
            the face by construction — relief carries no contrast — and both live
            inside PLATE.margin, where the device is forbidden to go. */}
        <path
          d={SHIELD}
          data-testid="maker-plate-bevel-light"
          fill="none"
          stroke={PLATE_BEVEL_LIGHT}
          strokeWidth={W * PLATE.bevel}
          transform={`translate(-${W * PLATE.bevel * 0.4} -${W * PLATE.bevel * 0.4})`}
        />
        <path
          d={SHIELD}
          data-testid="maker-plate-bevel-shade"
          fill="none"
          stroke={PLATE_BEVEL_SHADE}
          strokeWidth={W * PLATE.bevel}
          transform={`translate(${W * PLATE.bevel * 0.4} ${W * PLATE.bevel * 0.4})`}
        />

        {/* 3 — THE DEVICE, STRUCK INTO THE FACE. The silhouette is drawn three times
            in the same place: a shadow copy offset AWAY from the light, a light copy
            offset TOWARD it, and the metal fill on top. Zero blur on both offsets —
            measured crisper than a filter at the sizes this is drawn — and both
            offsets are near-tonal, so the strike reads as depth and never as a second
            edge competing with the mark.
            ⚠️ THE OFFSETS ARE INVERTED RELATIVE TO THE PLATE'S OWN BEVEL: the plate
            stands proud, the device is sunk INTO it, so its shadow falls on the side
            the plate's highlight is on. Getting this backwards is what makes an
            engraving look like a sticker of an engraving. */}
        <g data-testid="maker-plate-device" transform={`translate(${FIELD.x} ${FIELD.y}) scale(${FIELD.w / 64} ${FIELD.h / 64})`}>
          <g transform="translate(1.6 1.6)"><Device fill={PLATE_BEVEL_LIGHT} /></g>
          <g transform="translate(-1.4 -1.4)"><Device fill={PLATE_BEVEL_SHADE} /></g>
          <Device fill={PLATE_DEVICE} />
        </g>

        {/* 4 — THE RIVETS: symmetric mounting hardware, the one ornament the spec
            allows, and only because it is not ornament — it is the reason the plate
            is attached to anything. */}
        {detail && [0.24, 0.76].map((f) => (
          <circle key={f} data-testid="maker-plate-rivet" cx={W * f} cy={H * 0.11} r={W * 0.045} fill={PLATE_RIVET} />
        ))}
      </g>
    </svg>
  );
}

/**
 * THE DEVICE'S FLAT SILHOUETTE, in the house device's own 64-unit space.
 *
 * ⚠️ FLAT, AND TINTED BY ITS CALLER — no baked bevels, no baked colours. That is what
 * lets ONE asset serve the plate's emboss (three tints of it, stacked), the favicon
 * (one tint, no plate) and the PDF seal. A silhouette with its highlight painted in
 * is a picture of a mark, not a mark, and it cannot be re-lit for a new ground.
 *
 * @param {{ fill: string }} props
 */
function Device({ fill }) {
  return (
    <g fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 7 44 A 27.15 26.85 0 1 1 57 44" strokeWidth="6.1" />
      <path d="M 7 44.1 Q 13.5 43.75 20 43.95 L 25.1 36.9 L 29.9 44.05 Q 32 43.9 34 44 L 40.1 34.85 L 45.9 44.1 Q 51.5 43.8 57 44" strokeWidth="5.85" />
      <path d="M 31.9 15.2 L 41.05 30.9 Q 32 31.35 23.05 31.1 Z" strokeWidth="4.95" />
      <circle cx="32" cy="25.7" r="4.2" fill={fill} stroke="none" />
    </g>
  );
}

export { FIELD, H, M, SHIELD, W, isDegenerateSeed };
