/**
 * Lockup.jsx — THE BRAND LOCKUP: the maker's plate, then the wordmark with its
 * wax-seal `o`.
 *
 * Owner task #78. It exists as its own module rather than as JSX inside App.jsx for
 * two reasons, and the second is the real one:
 *
 *   1. There are TWO headers — the desktop shaft and the mobile bar — and the lockup
 *      is ONE object. Written twice inline it drifted immediately (the two wordmarks
 *      already carried different capital ratios for no reason anyone recorded).
 *   2. The lockup's rules are not layout, they are BRAND LAW, and law wants a file it
 *      can be written down in: the plate scales to the bar, the seal replaces exactly
 *      one glyph, the mark never becomes the way the name is spelled, and chroma is
 *      rationed to the seal alone. None of that is legible as a run of spans inside a
 *      600-line shell.
 *
 * ⚠️ THE HEADING SEMANTICS ARE THE CALLER'S, NOT THIS COMPONENT'S. The desktop bar
 * wants an `h1` (it is the page's top-level identity); the mobile bar already has one
 * elsewhere and must not emit a second. So the element is a prop, and both variants
 * are `aria-hidden` regardless — the accessible name comes from the home control's own
 * `aria-label`, which is the plain string "SettlementForge". That arrangement predates
 * the seal and is exactly what lets one glyph become a graphic for free: assistive
 * technology never read these spans.
 *
 * ⚠️ THE TWO CAPITALS ARE SET A STEP LARGER, and the step differs by bar on purpose:
 * 1.32em on the desktop wordmark, 1.28em on the smaller mobile one. A single ratio
 * looks correct at one size only — the larger the type, the more the eye tolerates.
 */
import { FS, INK_DEEP, serif_ } from '../theme.js';
import MakerPlate from './MakerPlate.jsx';
import WaxSeal from './WaxSeal.jsx';

/**
 * The visually-hidden box the replaced letter lives in — it takes no space and paints
 * nothing, but it stays inside the wordmark's text run, so selecting and copying the
 * name yields the name. Authored here rather than reached for from a utility class
 * because the lockup must not depend on a stylesheet loading to spell itself right.
 */
const COPY_ONLY = Object.freeze({
  position: 'absolute', width: 1, height: 1, overflow: 'hidden',
  clipPath: 'inset(50%)', whiteSpace: 'nowrap',
});

/**
 * The lockup.
 *
 * @param {Object} props
 * @param {boolean} [props.compact=false] the mobile bar's smaller draw.
 * @returns {JSX.Element}
 */
export default function Lockup({ compact = false }) {
  const cap = compact ? '1.28em' : '1.32em';
  const type = {
    margin: 0,
    fontSize: compact ? FS.lg : FS.h1,
    fontWeight: 800,
    // THE WORDMARK IS DARK INK, and it has moved twice with the ground beneath it —
    // both times forced, never stylistic. GOLD was right on V1's ink bar and 1.85:1
    // on wood; GOLD_TXT was right on V2's cream plank at 5.75:1 and is 3.38:1 on the
    // honey-tan barrel, which fails AA as text. INK_DEEP measures 7.06:1 against
    // SHAFT_BODY and 6.69:1 against the composited bar, and is what the directive asks
    // for in its own words. Both bars take it: they paint the same barrel.
    color: INK_DEEP,
    fontFamily: serif_,
    letterSpacing: '0.01em',
    ...(compact ? {} : { lineHeight: 1.1 }),
  };
  // ⚠️ EXACTLY ONE GLYPH BECOMES A GRAPHIC. The `o` of "Forge" — not the `o` of
  // "Settlement", which would put the seal mid-word where it reads as a blot rather
  // than as a stamp, and not two of them, which would read as a typeface rather than
  // as a seal. The name is otherwise ordinary type, which is the point: the seal has
  // to be the ONE odd thing to be seen at all.
  //
  // ⚠️⚠️ THE REPLACED LETTER STAYS IN THE DOM, INVISIBLY, AND THAT IS NOT PEDANTRY.
  // The first cut of this rendered the seal BESIDE the glyph and the bar shipped
  // "SettlementFoOrge" — visible in the very first screenshot, invisible to every
  // test, because no pin asked what the word said. The letter is now removed from the
  // visible run and re-added as COPY_ONLY: a user who selects the wordmark and copies
  // it still gets "SettlementForge" rather than "SettlementFrge". Assistive
  // technology is unaffected either way (the whole lockup is aria-hidden and the home
  // control carries the name), but a product's own name has to survive being copied.
  const word = (
    <>
      <span style={{ fontSize: cap, fontWeight: 800 }}>S</span><span>ettlement</span>
      <span style={{ fontSize: cap, fontWeight: 800 }}>F</span>
      <WaxSeal /><span style={COPY_ONLY}>o</span><span>rge</span>
    </>
  );
  return (
    <>
      {/* The plate scales to the bar it is mounted on: the shaft is thin, so the
          plate is small. It is a half-step quieter than the fletch band by
          construction — the band is the loudest thing on this bar and the maker's
          plate is not competing with it for the eye. */}
      <MakerPlate size={compact ? 22 : 26} style={compact ? { flexShrink: 0 } : { marginRight: 8, flexShrink: 0 }} />
      {compact
        ? <span aria-hidden="true" data-testid="brand-wordmark" style={type}>{word}</span>
        : <h1 aria-hidden="true" data-testid="brand-wordmark" style={type}>{word}</h1>}
    </>
  );
}
