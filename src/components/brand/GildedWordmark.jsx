/**
 * GildedWordmark.jsx — THE WORDMARK AS THE MOUNTED ARTIFACT (owner directive, ribbon
 * V4). Three layers, in this order and no other: THE BOLE BED, THE LEAF, THE KEYLINE.
 *
 * ⚠️⚠️ THIS MODULE REPLACES THE MAKER'S PLATE, AND THE REPLACEMENT IS FORCED RATHER
 * THAN PREFERRED. The owner's correction is that the WORDMARK ITSELF is the gilded
 * object and there is no plate. The arithmetic agrees twice over:
 *
 *   1. The plate's legibility structure was a pale metal device on a MID-TONE bronze
 *      face behind a near-black keyline. On the V4 cedar shaft that keyline measures
 *      2.86:1 against the lightest ground it touches — under SC 1.4.11's 3:1 — and
 *      the bronze face sits inside the mid-russet DEAD BAND (theme.js). There is no
 *      retune: a dark object on dark wood behind a dark keyline is a smudge.
 *   2. A plate BESIDE a name is two marks competing at 26px. A gilded name is one.
 *
 * The house DEVICE itself is untouched and still ships — favicon, PDF seal, footer,
 * error boundary (components/brand/HouseDevice.jsx). What retired is the PLATE.
 *
 * ⚠️⚠️ WHY THE WORDMARK IS STILL REAL TYPE AND NOT A DRAWING. Every instinct says
 * "gild it" means "draw it", and drawing it would cost four things this lockup cannot
 * spend: the two capitals' 1.32em step would stop tracking the font, the wax seal
 * would stop sitting on the text baseline, the name would stop being selectable and
 * copyable (the SettlementFoOrge incident is recorded in Lockup.jsx), and the bar
 * would gain a second set of metrics to keep in sync with FS.h1. So the gilding is
 * done to LIVE TYPE: the leaf is a gradient clipped to the glyphs, the keyline is a
 * text stroke, and only the BED is drawn.
 *
 * ⚠️⚠️ THE FILL CARRIES 100% OF THE CONTRAST AND THE RELIEF CARRIES 0% — the same law
 * the retired plate ran on, inherited deliberately. Every stop of the leaf gradient is
 * at or above L 0.44, so the claim holds at every point of every glyph rather than on
 * average; the keyline and the glint are CHARACTER ONLY and carry no part of it. A
 * browser that drops them loses texture and no legibility.
 *
 * ⚠️⚠️ AND THE CLIP FAILS SAFE. `background-clip: text` with a transparent fill is the
 * one idiom here that could make a wordmark VANISH rather than degrade, so the colour
 * declared underneath it is GILT — not `transparent`, not `inherit`. An engine that
 * honours neither `-webkit-background-clip` nor `-webkit-text-fill-color` renders a
 * solid GILT wordmark at 7.50:1 on the bole, which is the same claim one stop flatter.
 * The pin asserts the fallback tone is a member of the GILT ladder, because "it will
 * be fine" is exactly how a wordmark ships invisible.
 */
import {
  BOLE, BOLE_DEEP, CHROME, GILD, GILT, GILT_LIGHT, HEADER_RIDERS, PLATE_KEYLINE, lightOffset,
} from '../theme.js';

/**
 * The bed's own HORIZONTAL coordinate space. Stretched to the run, so it is a
 * proportion — the burn around a word is as wide as the word. ⚠️ THERE IS NO MATCHING
 * VERTICAL CONSTANT any more: since R-1 the vertical axis is the BAR's and its extent is
 * computed per bar (BOLE_BLEED, boleField, BOLE_UNIT).
 */
const BW = 200;

/**
 * ⚠️ THE SEED IS VETTED, AND THE VETTING IS A DERIVATION — moved here verbatim from
 * the retired MakerPlate, because the reason it existed did not retire with the plate.
 *
 * SVG's feTurbulence is specified down to its PRNG, and that PRNG has DEGENERATE
 * seeds: initial lattices where a gradient vector comes out as exactly (0, 0), which
 * leaves a dead spot in the noise field. Engines then differ on how they handle it,
 * so a degenerate seed is the one thing that turns "deterministic texture" into a
 * cross-engine golden hazard. There are 66 of them below 20,000.
 *
 * The exclusion is therefore not a hardcoded blocklist that rots — it is the spec's
 * OWN lattice construction, re-run here, so ANY seed a future edit picks is checked
 * against the real condition.
 *
 * @param {number} seed the feTurbulence seed to test
 * @returns {boolean} true when the spec's lattice yields a zero gradient vector
 */
export function isDegenerateSeed(seed) {
  const M31 = 2147483647;
  const A = 16807;
  const Q = 127773;
  const RR = 2836;
  let l = seed > 0 ? seed : 1;
  const step = () => {
    const r = A * (l % Q) - RR * Math.floor(l / Q);
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
 * HOW FAR THE BED MUST REACH PAST THE WORDMARK'S OWN BOX, in px, on each side.
 *
 * ⚠️⚠️ IT IS DERIVED FROM MEASURED INK, NOT FROM THE BOX, AND THAT IS THE WHOLE POINT.
 * The wordmark's laid-out box is 34.84px of a 38px bar, so it spans 1.58..36.42 — but
 * its INK runs 7.58..37.08, overflowing its own box by 0.66px at the bottom (the `g`
 * of "Forge"). A bed inset from the BOX by 3px would therefore fall 0.66px short of
 * the requirement at exactly the one place a descender needs it, and every screenshot
 * would look correct. So the reach is computed from HEADER_RIDERS' ink extents, and
 * the containment pin re-derives the same relationship rather than reading these
 * numbers back.
 *
 * ⚠️⚠️ THE TOP REACH IS NEGATIVE, AND THAT IS THE FIX FOR A REAL DEFECT, NOT A
 * MICRO-OPTIMISATION. The first cut clamped every reach at zero — `Math.max(0, …)` —
 * on the reasoning that a bed covering MORE than it must is still containment. It is,
 * and it looked wrong for a reason the arithmetic could not see: the wordmark's box
 * starts 6px above its own ink, so a clamped bed ran the full height of the bar and
 * read as a hard-edged black PLAQUE. Screenshotted at 250% it was unmistakably a plate
 * — the exact object the owner's V4 correction retires — with a gilded name sitting on
 * it. So the reach is SIGNED: the bed hugs `ink ± pad` on every side and nothing more,
 * which is what a branded-in patch of shaft looks like. Containment is unchanged and
 * still asserted; what changed is that the bed no longer claims territory it does not
 * need, and territory is what made it read as an object rather than as a scorch.
 *
 * ⚠️⚠️ AND SINCE R-1 IT SIZES ONE AXIS RATHER THAN TWO. `left`/`right` are still the
 * bed's own horizontal reach and are spent as insets; `top`/`bottom` now LOCATE the ink
 * band inside the wordmark's box rather than bounding the bed, because the bed's
 * vertical extent became the BAR's business (see BOLE_BLEED). The derivation is
 * unchanged and still the containment reference — what changed is who reads which half.
 *
 * @param {{ ink: number[], bar: number, box: number }} [rider] the wordmark's row
 * @param {number} [pad] BOLE_PAD, the opaque core's reach past the ink
 * @returns {{ top: number, right: number, bottom: number, left: number }} px, signed
 */
export function boleReach(rider = HEADER_RIDERS.wordmark, pad = GILD.pad) {
  const boxTop = (rider.bar - rider.box) / 2;
  return Object.freeze({
    top: boxTop - (rider.ink[0] - pad),
    right: pad,
    bottom: (rider.ink[1] + pad) - (boxTop + rider.box),
    left: pad,
  });
}

const REACH = boleReach();

/**
 * BOLE_BLEED — HOW FAR THE BURN'S FIELD OVERSHOOTS THE BAR'S TWO LONG EDGES, in px.
 *
 * ⚠️⚠️ THIS IS R-1's REPAIR, AND THE DEFECT IT CLOSES SURVIVED EVERY PIN IN THE SUITE.
 * R1's cure — the burn bleeding off the bar's long edges so it has no horizontal
 * boundary a reader can see — was measured on the 38px DESKTOP bar and was FALSE on the
 * 60px mobile one. Probed in Chrome at 390x844 dsf2: the burn's top edge sat DEAD
 * STRAIGHT at y≈10.7 and its foot at y≈56, with ~11px of bare cedar above it and ~4px
 * below. A dark rectangle floating on the plank — the PLAQUE the whole V4 correction
 * retires, shipping on every phone while the desktop screenshot looked right.
 *
 * ⚠️⚠️ THE CAUSE WAS A FRAME-OF-REFERENCE ERROR, WHICH IS WHY NO px CONSTANT FIXED IT.
 * The bed hugged the WORDMARK's ink extents ± BOLE_PAD and the burn reached a fixed
 * distance past that — so the field's height was set by the TYPE, while the thing it had
 * to bleed off was the BAR. Those two move independently and, between these two
 * breakpoints, they move OPPOSITE ways: the mobile lockup is FS.lg on a bar sized by a
 * 44px TAP TARGET, so the type shrank 24 → 15px while the bar grew 38 → 60. Two scale
 * errors in the same direction, compounding.
 *
 * SO THE AXES SPLIT, AND THAT SPLIT IS THE ARCHITECTURE: the bed's HORIZONTAL reach is
 * still the INK's business (± BOLE_PAD, unchanged, because a burn around a WORD is as
 * wide as the word), and its VERTICAL reach is now the BAR's (because a burn ACROSS a
 * plank is as deep as the plank). The field runs from the wordmark's own centre out to
 * half the bar plus this bleed, so both long edges are outside the bar BY CONSTRUCTION
 * at every breakpoint rather than by measurement on one screenshot.
 *
 * ⚠️ AND THE BLEED IS DERIVED, NOT PICKED. It is exactly how far the DESKTOP ink band
 * already overshot the desktop bar at the foot — `ink[1] + BOLE_PAD − bar` = 2.08px —
 * i.e. the accident of one bar's metrics that made V4C's burn bleed at all. Promoting it
 * to the law at both edges of both bars is also what leaves the desktop render alone:
 * the field's foot lands on the very px it already did.
 */
export const BOLE_BLEED = (HEADER_RIDERS.wordmark.ink[1] + GILD.pad) - HEADER_RIDERS.wordmark.bar;

/**
 * THE FIELD'S HALF-HEIGHT on a bar of `bar` px, measured from the wordmark's own centre.
 *
 * ⚠️ IT IS MEASURED FROM THE CENTRE, AND THAT IS WHAT LETS CSS DO THE REST. Both bars
 * centre the lockup vertically (`alignItems: center`), so `top: calc(50% − half)` on a
 * box absolutely positioned inside the wordmark resolves the 50% against the WORDMARK's
 * own height — whatever the font makes it — and lands the field on the bar's own edges
 * without this module ever knowing how tall the type came out.
 *
 * @param {number} bar the bar's height in px: CHROME.headerDesktop or CHROME.headerMobile
 * @returns {number} px from the wordmark's vertical centre to the field's edge
 */
export function boleField(bar) {
  return bar / 2 + BOLE_BLEED;
}

/**
 * BOLE_UNIT — HOW MANY PX OF BAR ONE UNIT OF THE BED'S VERTICAL AXIS IS WORTH.
 *
 * ⚠️⚠️ IT IS V4C's OWN SCALE, HELD FIXED, AND THAT IS WHAT MAKES R-1 A REPAIR RATHER
 * THAN A REDRAW. Every number that shapes this burn lives in these units — BURN_FREQ's
 * two frequencies, GILD.edgeAmp's displacement, the singe's blur — so an axis that
 * re-scaled with the bar would quietly re-texture the desktop bar as a side effect of a
 * fix aimed at the phone. The V4C bed drew the ink band (`ink ± BOLE_PAD`, 35.5px) in 48
 * units; one unit was 0.7396px of bar then and is 0.7396px of bar now, on every bar.
 * ⚠️ WHAT MOVES WITH THE BAR IS HOW MANY UNITS THE FIELD IS, NEVER HOW BIG ONE IS.
 */
const INK_UNITS = 48;
export const BOLE_UNIT = ((HEADER_RIDERS.wordmark.ink[1] + GILD.pad)
  - (HEADER_RIDERS.wordmark.ink[0] - GILD.pad)) / INK_UNITS;

/**
 * HOW FAR THE SCORCH FIELD STARTS OUTSIDE THE CORE, in the bed's own units.
 *
 * ⚠️ TWICE THE AMPLITUDE, AND THE FACTOR IS THE PROOF. The displacement moves each
 * edge pixel by at most `edgeAmp` in either direction, so a field starting 2·edgeAmp
 * out has its nearest possible edge at 1·edgeAmp out — strictly outside the core, at
 * every seed and every amplitude, by construction rather than by inspection.
 */
const SCORCH_OUT = GILD.edgeAmp * 2;

/**
 * HOW FAR THE SINGE HALO REACHES BEYOND THE SCORCH — the outermost of the three
 * layers, and the one that stops the brand having an edge at all.
 *
 * ⚠️ IT IS A MULTIPLE OF THE SCORCH'S OWN REACH so the three layers stay in
 * proportion when `edgeAmp` moves; a px constant here would make the halo a hairline
 * at a large amplitude and a smear at a small one.
 */
const SINGE_OUT = SCORCH_OUT * 2.2;

/**
 * THE BURN'S OWN ANISOTROPY — slow across the shaft, fast along its short axis, which
 * makes the displaced edge run in long horizontal TONGUES the way a brand bites along
 * wood fibre. ⚠️ IT IS THE SAME DIRECTION THE GRAIN RUNS (theme.js's `0.008 0.42`), one
 * octave broader, so the burn and the wood it is burned into agree about which way the
 * material goes. The first cut ran `0.035 0.09` — fast ACROSS and slow ALONG, i.e. a
 * cross-grain wobble on a longitudinally-grained shaft.
 */
const BURN_FREQ = '0.012 0.16';

/**
 * THE LEAF + THE KEYLINE, as the style one text run wears.
 *
 * ⚠️ ONE VERTICAL TWO-STOP GRADIENT, AND NO THIRD STOP EVER. The temptation on a
 * gilded letter is a dark stop "for modelling", and it is precisely the failure the
 * fill claim forbids: a sub-floor tone inside a letterform is unmeasurable by any
 * token-vs-token pin and invisible in review. Modelling lives in the KEYLINE and the
 * BED. GILT_LIGHT (L 0.6068) at the top, GILT (L 0.4509) at the foot — both at or
 * above the 0.44 floor, so the claim holds at every scanline of every glyph.
 *
 * ⚠️ THE GLINT IS THE ONE UPPER-LEFT LIGHT, and it is DERIVED from PLATE_LIGHT_DEG
 * rather than hand-placed: a text-shadow pushed TOWARD the light, in the leaf's own
 * light stop, which reads as the lit edge of a raised letter. It is a whisper (0.6px,
 * no blur) — anything heavier and gold-on-gold starts reading as a double strike.
 */
const GLINT = lightOffset(0.6);
export const LEAF = Object.freeze({
  // ⚠️ THE FALLBACK, AND IT IS FIRST ON PURPOSE. If the clip does not take, this is
  // what a reader sees: a solid GILT wordmark at 7.50:1 on the bole.
  color: GILT,
  backgroundImage: `linear-gradient(180deg, ${GILT_LIGHT} 0%, ${GILT} 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  // The keyline: near-black, per glyph, character only. `paint-order` puts it OUTSIDE
  // the fill where engines support it, so the letterform is not thinned by its own
  // outline; where they do not, a 0.75px centred stroke costs 0.375px of counter and
  // nothing else.
  WebkitTextStrokeWidth: `${GILD.keyline}px`,
  WebkitTextStrokeColor: PLATE_KEYLINE,
  paintOrder: 'stroke fill',
  textShadow: `${GLINT.dx}px ${GLINT.dy}px 0 ${GILT_LIGHT}`,
  position: 'relative',
  zIndex: 1,
});

/**
 * THE BOLE BED — a scorched, branded-in patch of shaft behind the whole wordmark run.
 *
 * ⚠️⚠️ THE CORE IS THE BED AND EVERY OTHER LAYER LIVES ENTIRELY OUTSIDE IT — and the
 * INEQUALITY between them is what makes the containment geometric rather than hopeful.
 *
 * Three layers. The opaque BOLE core is exactly the bed's own box — the wordmark's ink
 * ± BOLE_PAD across, and the BAR ± BOLE_BLEED down (R-1) — undisplaced, so it is a
 * strict SUPERSET of `ink ± BOLE_PAD` on both axes. The scorch is a LARGER rect — inset
 * by −2·edgeAmp on every side — run through a displacement map of amplitude edgeAmp, so
 * its edge can wander anywhere in [bed + 1·edgeAmp, bed + 3·edgeAmp] and NEVER inside
 * the core. The singe halo is larger still. So no seed, at any amplitude, can uncover a
 * glyph.
 *
 * ⚠️ THE FIRST CUT INSET THE CORE BY THE AMPLITUDE INSTEAD, AND IT COST THE WHOLE
 * EFFECT. That construction is also sound, and it couples the two numbers backwards:
 * every unit of raggedness you buy is a unit eaten out of the opaque core, so the
 * amplitude is capped by the pad and the edge can only ever be a faint wobble around a
 * rectangle's own outline. Screenshotted, the bed read as a dark rounded slab. Pushing
 * the scorch OUTWARD instead decouples them completely: the amplitude is free, the
 * ragged edge is the silhouette the eye actually gets, and the AA claim is untouched
 * because the core never moved.
 *
 * ⚠️⚠️ AND IT STILL READ AS A PLAQUE — R1, AND THE CAUSE WAS AN INTERNAL EDGE NOBODY
 * WAS LOOKING FOR. The reach repair made the bed hug `ink ± 3px` and the plaque read
 * survived it. Probed at device-pixel resolution down a column of the real bar, the
 * cause is unambiguous: the SCORCH was BOLE_DEEP and the CORE was BOLE, so the core's
 * own undisplaced rectangle drew a DEAD-STRAIGHT horizontal step from L 0.0088 to
 * L 0.0168 across the whole run — a hard rectangle edge inside the burn. The bed's
 * OUTER edge was already ragged and already bled past the bar's top; what a reader was
 * seeing was the rectangle drawn INSIDE it.
 *
 * SO THE THREE LAYERS ARE RE-TONED RATHER THAN RE-SHAPED, and the cure is that the
 * scorch takes the CORE'S OWN TONE. Core and scorch are then one continuous BOLE field
 * with a single ragged outline and no internal edge anywhere, and the deep tone moves
 * OUTWARD to where a brand actually chars — the SINGE HALO, blurred, fading into the
 * wood so the burn has no hard boundary on any side. That is also what the tokens
 * already claimed: "BOLE is the opaque core; BOLE_DEEP is the scorch at its EDGE, where
 * the brand bit deepest".
 *
 * ⚠️ THE DISPLACEMENT IS NOW ANISOTROPIC ALONG THE GRAIN. A brand bites INTO wood, and
 * wood splits along its fibres, so the burn's edge runs in long horizontal tongues
 * rather than in an even wobble. `0.012 0.16` is slow across the shaft and fast along
 * its short axis — the same direction the grain itself has run since V3 (`0.008 0.42`),
 * one octave broader. An isotropic edge reads as a torn sticker.
 *
 * ⚠️ `color-interpolation-filters="sRGB"` IS SPELLED OUT AND IS NOT OPTIONAL — the
 * SVG default for a filter chain is linearRGB, engines disagree about it, and the
 * whole point of a fixed seed is that the same bytes produce the same picture.
 *
 * ⚠️⚠️ AND IT READ AS A PLAQUE ON THE PHONE — R-1, one breakpoint later, and the cause
 * this time was the FRAME OF REFERENCE rather than a tone. R1's cure held on the 38px
 * desktop bar and was false on the 60px mobile one, because the field's height was the
 * TYPE's and the edges it had to clear were the BAR's. BOLE_BLEED owns that argument;
 * what it costs HERE is three computed numbers instead of two constants — the field's
 * height in units, and the viewBox ORIGIN that keeps the noise anchored to the ink.
 *
 * @param {{ id: string, bar: number }} props the filter-id scope, and the bar's height
 *   in px (CHROME.headerDesktop or CHROME.headerMobile) the burn must bleed off.
 */
function BoleBed({ id, bar }) {
  // The field, in the bed's own units. ⚠️ ONLY THE COUNT MOVES WITH THE BAR — BOLE_UNIT
  // does not — so a taller bar buys more burn rather than a re-scaled one.
  const half = boleField(bar);
  const field = (half * 2) / BOLE_UNIT;
  // ⚠️⚠️ AND USER y=0 STAYS ON THE INK BAND'S TOP EDGE, which is exactly where V4C's
  // viewBox put it. feTurbulence samples the noise at a point's own user-space
  // coordinates, so an origin that moved with the field would hand every bar a different
  // (equally valid, entirely gratuitous) ragged edge — including the desktop bar this
  // repair is not about. Anchored here, the burn is one field the wordmark is stamped
  // into and a taller bar EXTENDS it rather than re-drawing it.
  const y0 = -(half - (HEADER_RIDERS.wordmark.box / 2) - REACH.top) / BOLE_UNIT;
  const u = (n) => +n.toFixed(4);
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-testid="bole-bed"
      viewBox={`0 ${u(y0)} ${BW} ${u(field)}`}
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        // ⚠️ THE 50% IS THE WHOLE TRICK, and it resolves against the WORDMARK's own
        // height — whatever the font made it — so the field lands on the bar's edges
        // without this module knowing the type's metrics. `top` + `height` and no
        // `bottom`/`right`: an over-constrained inset is a declaration the engine throws
        // away, which is how a geometry starts lying about itself.
        top: `calc(50% - ${u(half)}px)`,
        height: `${u(half * 2)}px`,
        left: -REACH.left,
        width: `calc(100% + ${REACH.left + REACH.right}px)`,
        // Paint, never layout: the bed reaches past the wordmark's box on every side and
        // must cost no height, or ANCHOR_OFFSET moves and every in-page anchor in the
        // estate lands worse. Absolute + overflow-visible buys the reach for free.
        overflow: 'visible',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <defs>
        <filter
          id={`${id}-scorch`}
          x="-40%"
          y="-60%"
          width="180%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency={BURN_FREQ} numOctaves="3" seed={GILD.seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={GILD.edgeAmp} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* The halo's own chain: the SAME field at the same seed, displaced the same
            way, then blurred. ⚠️ THE BLUR IS ANISOTROPIC TOO (`3 1.4`) — a round blur
            would put an even glow all round the brand, which is a shadow, not a singe.
            Heat travels along the fibre. */}
        <filter
          id={`${id}-singe`}
          x="-40%"
          y="-60%"
          width="180%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency={BURN_FREQ} numOctaves="3" seed={GILD.seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={GILD.edgeAmp} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="3 1.4" />
        </filter>
      </defs>
      {/* 1 — THE SINGE HALO: the char at the burn's rim, blurred out into bare wood so
             the brand has no hard boundary on any side. It is the outermost layer and
             the only one a reader ever sees END. */}
      <rect
        data-testid="bole-singe"
        x={-SINGE_OUT}
        y={u(y0 - SINGE_OUT)}
        width={BW + SINGE_OUT * 2}
        height={u(field + SINGE_OUT * 2)}
        fill={BOLE_DEEP}
        fillOpacity="0.85"
        filter={`url(#${id}-singe)`}
      />
      {/* 2 — the scorch: the burn's own ragged silhouette, edge-displaced along the
             grain. ⚠️ It starts TWO amplitudes outside the core, so a displacement of
             ONE amplitude leaves its nearest possible edge a full amplitude clear of the
             core on every side — the ragged outline is the silhouette, and it can
             never be the thing under a letter.
             ⚠️⚠️ IT IS THE CORE'S OWN TONE. That is R1's cure: two tones here draw a
             hard rectangle inside the burn (see the note above), and one tone draws
             nothing at all. */}
      <rect
        data-testid="bole-scorch"
        x={-SCORCH_OUT}
        y={u(y0 - SCORCH_OUT)}
        width={BW + SCORCH_OUT * 2}
        height={u(field + SCORCH_OUT * 2)}
        fill={BOLE}
        filter={`url(#${id}-scorch)`}
      />
      {/* 3 — THE OPAQUE CORE, and it IS the bed: `ink ± BOLE_PAD` across and the BAR ±
              BOLE_BLEED down, undisplaced, carrying the whole AA claim by itself. ⚠️ ITS
              TWO LONG EDGES ARE OUTSIDE THE BAR BY CONSTRUCTION (R-1), so the only
              straight edges a reader can reach are the two short ones — and those are
              buried a full SCORCH_OUT inside the ragged silhouette. */}
      <rect
        data-testid="bole-core"
        x="0"
        y={u(y0)}
        width={BW}
        height={u(field)}
        fill={BOLE}
      />
    </svg>
  );
}

/**
 * THE GILDED WORDMARK — the bed, then the leaf-and-keyline run inside it.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children the wordmark's own text run
 * @param {string} [props.id] scopes the SVG-local filter id so two lockups on one page
 *   (the desktop bar and a mobile one under a breakpoint change) cannot collide.
 * @param {number} [props.bar] the height in px of the bar this lockup is mounted on —
 *   CHROME.headerDesktop or CHROME.headerMobile. ⚠️ IT IS A REQUIRED FACT WEARING A
 *   DEFAULT: the burn has to bleed off the bar's two long edges (BOLE_BLEED), and the
 *   bar is the one thing about its own mounting the wordmark cannot measure. The default
 *   is the desktop bar because that is the draw a caller who forgets is most likely to
 *   be making; the caller that matters — the phone — passes it, and the pin checks both.
 */
export default function GildedWordmark({ children, id = 'gild', bar = CHROME.headerDesktop }) {
  return (
    <>
      <BoleBed id={id} bar={bar} />
      <span data-testid="gilded-leaf" style={LEAF}>{children}</span>
    </>
  );
}

export { BW, BURN_FREQ, REACH, SCORCH_OUT, SINGE_OUT };
