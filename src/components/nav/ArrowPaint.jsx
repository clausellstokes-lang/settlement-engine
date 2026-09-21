/**
 * components/nav/ArrowPaint.jsx: paint one layout of the owner's arrow painting.
 *
 * The header is the painting itself (owner, 2026-09-16: "I do not want you to emulate it"),
 * so this component draws nothing of its own: every pixel is the shipped strip or the filler
 * tile cut from the same painting, placed where components/nav/arrowGeometry.js says.
 *
 * PAINT ORDER IS THE SEAM LAW. Each slot's filler is painted FIRST and OPAQUE, spanning the
 * slot plus the crossfade width on both sides; the painted segments are painted after it and
 * only they fade (a mask gradient over their crossfade ends). Two layers that both fade
 * across one zone dip in opacity and let the page show through as grey bands, which is the
 * failure the kit's canvas prototype showed. Masks read only alpha, so the opaque stop is a
 * theme token and the other is `transparent`.
 *
 * TONE. Each filler takes a CSS brightness (arrowGeometry.js SLOT_TONE), because the painting
 * darkens toward the arrowhead and an untoned tile reads as a pale patch. The compact arrow's
 * one slot joins two different tones, so its filler carries a copy of its own tile at the
 * right-hand tone that fades in across the slot: an opaque copy over an opaque tile, so
 * nothing dips.
 *
 * THREE PARTS OF ONE ROW. The arrow is drawn from the same layout at the same page position:
 *   - part="band" clips to rows [0, SEAM_BAND_TO), inside the header's own box (BAND_H rows);
 *   - part="hang" sits in a layer whose top is the header's bottom, so its clip starts
 *     (BAND_H - SEAM_HANG_FROM) rows above that layer and shows rows [SEAM_HANG_FROM, the
 *     end): the shaft's lower edge and the arrowhead's barb. A mask leaves out the feather,
 *     the columns [0, FEATHER_X1) below BAND_H;
 *   - part="feather" is exactly that feather, rows [FEATHER_FROM, the end) of those columns,
 *     fading in across the first FEATHER_RAMP of the rows it shares with the hang and whole
 *     for the rest of them. ArrowHeader hides it on scroll.
 * The band and hang clips OVERLAP inside the shaft's opaque body (arrowGeometry.js explains the
 * measured hairline a butt join showed at fractional device pixel ratios), and the feather
 * overlaps the hang for the same reason.
 *
 * The paint is decoration: aria-hidden, every image alt="" and not draggable, and no pointer
 * events (the controls are the header's own buttons over it). Only the first band image asks
 * for high fetch priority (it is likely the page's largest paint on desktop). Styling is
 * inline (the render-blocking stylesheet has no byte to spare) and stays inside the kill
 * list: no shadow, no rounding, no translucent literal, no stacking above the local band.
 *
 * @enforced-by tests/components/arrowPaint.test.jsx
 */
import { INK } from '../theme.js';
import {
  ARROW_FILLER_SRC, ARROW_STRIP_SRC, BAND_H, FE, FEATHER_FROM, FEATHER_RAMP, FEATHER_X1,
  SEAM_BAND_TO, SEAM_HANG_FROM, STRIP_H, STRIP_W,
} from './arrowGeometry.js';

/** @param {number} n */
const px = (n) => `${n}px`;

/**
 * The alpha mask for a segment with fadeL / fadeR CSS px of crossfade at its ends.
 * @param {number} fadeL
 * @param {number} fadeR
 * @returns {string | undefined}
 */
export function segmentMask(fadeL, fadeR) {
  if (!fadeL && !fadeR) return undefined;
  const stops = fadeL ? ['transparent 0px', `${INK} ${px(fadeL)}`] : [`${INK} 0px`];
  stops.push(...(fadeR ? [`${INK} calc(100% - ${px(fadeR)})`, 'transparent 100%'] : [`${INK} 100%`]));
  return `linear-gradient(90deg, ${stops.join(', ')})`;
}

/** A solid mask layer (masks read only alpha). */
const SOLID = `linear-gradient(${INK}, ${INK})`;

/**
 * The hang's mask: the rows above BAND_H everywhere, and every row from FEATHER_X1 rightward.
 * @param {number} s
 * @param {number} featherW - CSS px
 * @returns {import('react').CSSProperties}
 */
export function hangMask(s, featherW) {
  const image = `${SOLID}, ${SOLID}`;
  const size = `100% ${px((BAND_H - SEAM_HANG_FROM) * s)}, 100% 100%`;
  const position = `0px 0px, ${px(featherW)} 0px`;
  return {
    WebkitMaskImage: image, maskImage: image,
    WebkitMaskSize: size, maskSize: size,
    WebkitMaskPosition: position, maskPosition: position,
    WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
  };
}

/**
 * @param {{
 *   layout: import('./arrowGeometry.js').ArrowLayout,
 *   part?: 'band' | 'hang' | 'feather',
 *   style?: import('react').CSSProperties,
 * }} props
 */
export default function ArrowPaint({ layout, part = 'band', style }) {
  const band = part === 'band';
  const feather = part === 'feather';
  const { s } = layout;
  const rowH = px(STRIP_H * s);
  const from = (feather ? FEATHER_FROM : SEAM_HANG_FROM) * s;
  const featherW = layout.mapX(FEATHER_X1);
  const clipW = feather ? featherW : layout.width;
  const ramp = feather ? `linear-gradient(transparent 0px, ${INK} ${px(FEATHER_RAMP * s)})` : undefined;
  return (
    <div
      aria-hidden="true"
      data-sf-arrow-paint={part}
      style={{
        position: 'absolute',
        left: 0,
        top: px(band ? 0 : from - layout.bandPx),
        width: px(clipW),
        height: px(band ? SEAM_BAND_TO * s : layout.bandPx + layout.hangPx - from),
        overflow: 'hidden',
        pointerEvents: 'none',
        ...(part === 'hang' ? hangMask(s, featherW) : { WebkitMaskImage: ramp, maskImage: ramp }),
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: px(band ? 0 : -from),
          width: px(layout.width),
          height: rowH,
        }}
      >
        {layout.fillers.map((filler, i) => {
          if (filler.x >= clipW) return null;
          const tile = {
            backgroundImage: `url("${ARROW_FILLER_SRC}")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: `${px(layout.fillerPx.w)} ${px(layout.fillerPx.h)}`,
            backgroundPosition: `${px(-filler.phase)} 0px`,
          };
          const ext = FE * s;
          const blend = `linear-gradient(90deg, transparent ${px(ext)}, ${INK} ${px(filler.w - ext)})`;
          return (
            <div
              key={`filler-${i}`}
              data-sf-arrow-filler=""
              style={{
                position: 'absolute',
                left: px(filler.x),
                top: 0,
                width: px(filler.w),
                height: px(layout.fillerPx.h),
                ...tile,
                filter: `brightness(${filler.toneL})`,
              }}
            >
              {filler.toneR !== filler.toneL && (
                <div
                  data-sf-arrow-filler-tone=""
                  style={{
                    position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
                    ...tile,
                    filter: `brightness(${filler.toneR / filler.toneL})`,
                    WebkitMaskImage: blend,
                    maskImage: blend,
                  }}
                />
              )}
            </div>
          );
        })}
        {layout.segments.map((segment, i) => {
          if (segment.x >= clipW) return null;
          const mask = segmentMask(segment.fadeL, segment.fadeR);
          return (
            <div
              key={`segment-${i}`}
              data-sf-arrow-segment=""
              style={{
                position: 'absolute',
                left: px(segment.x),
                top: 0,
                width: px(segment.w),
                height: rowH,
                overflow: 'hidden',
                WebkitMaskImage: mask,
                maskImage: mask,
              }}
            >
              <img
                src={ARROW_STRIP_SRC}
                alt=""
                draggable={false}
                width={STRIP_W}
                height={STRIP_H}
                fetchPriority={band && i === 0 ? 'high' : undefined}
                style={{
                  position: 'absolute',
                  left: px(-segment.from * s),
                  top: 0,
                  width: px(STRIP_W * s),
                  height: rowH,
                  maxWidth: 'none',
                  display: 'block',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
