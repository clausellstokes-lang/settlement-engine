/**
 * Lockup.jsx — THE BRAND LOCKUP: the GILDED WORDMARK, with its gilded wax-seal `o`.
 *
 * ⚠️⚠️ THE MAKER'S PLATE LEFT THIS FILE IN RIBBON V4, and it is the owner's own
 * correction: the WORDMARK ITSELF is the mounted, gilded artifact, and there is no
 * plate. Two objects were always one too many at 26px — a plate BESIDE a name is two
 * marks competing, a gilded name is one — and on the V4 cedar shaft the plate could
 * not have survived anyway: its near-black keyline measures 2.86:1 on that wood and
 * its bronze face sits inside theme.js's mid-russet dead band. The reasoning and the
 * three layers that replace it live in components/brand/GildedWordmark.jsx; the HOUSE
 * DEVICE is untouched and still ships as the favicon, the PDF seal, the footer mark
 * and the error boundary's.
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
import { CHROME, FS, GILT, serif_ } from '../theme.js';
import GildedWordmark from './GildedWordmark.jsx';
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
    // THE WORDMARK'S INK HAS MOVED THREE TIMES WITH THE GROUND BENEATH IT, and every
    // move was forced rather than stylistic. GOLD was right on V1's ink bar and 1.85:1
    // on wood; GOLD_TXT was right on V2's cream plank at 5.75:1 and 3.38:1 on the
    // honey-tan barrel; INK_DEEP was right on the honey barrel at 7.06:1 and is 1.97:1
    // on V4's cedar. ⚠️ THE FOURTH MOVE IS DIFFERENT IN KIND: no flat tone clears on
    // this ground in either register at the weight a wordmark wants, so the mark stops
    // borrowing a ground and BRINGS ITS OWN — the bole bed — and the ink becomes gold
    // leaf at 7.50:1 on it. `color` here is only the CLIP'S FALLBACK, and it is a GILT
    // ladder member on purpose: if `background-clip: text` does not take, the wordmark
    // renders solid gold rather than transparent. GildedWordmark.jsx owns the rest.
    color: GILT,
    fontFamily: serif_,
    letterSpacing: '0.01em',
    // `relative` is what the bole bed hangs off: the bed fills this box plus its
    // derived reach, absolutely, so it costs no height. ⚠️ It must not cost one —
    // theme.js derives ANCHOR_OFFSET from CHROME.headerDesktop and every in-page
    // anchor in the estate lands on that number.
    position: 'relative',
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
  // ⚠️ THE GILDING WRAPS THE RUN RATHER THAN REPLACING IT. The bed is painted behind
  // the same live type the lockup has always used, so the two capitals still track the
  // font, the seal still sits on the text baseline, and the name is still selectable
  // and copyable. Only the BED is drawn; see GildedWordmark.jsx's note on why.
  //
  // ⚠️⚠️ AND THE BAR IS PASSED, WHICH IS THE ONE THING THE MARK CANNOT MEASURE ABOUT ITS
  // OWN MOUNTING. The burn has to bleed off the bar's two long edges or it reads as a
  // PLAQUE (GildedWordmark's BOLE_BLEED), and these two bars are not a scale of each
  // other: the desktop bar is 38px because the WORDMARK is 24px, and the mobile bar is
  // ~60px because a TAP TARGET is 44px — the type shrinks while the bar grows. So this
  // component, which is the one place that knows which draw it is making, tells the bed
  // which plank it is being branded into, from CHROME rather than from a literal.
  const gilded = (
    <GildedWordmark
      id={compact ? 'gild-m' : 'gild-d'}
      bar={compact ? CHROME.headerMobile : CHROME.headerDesktop}
    >
      {word}
    </GildedWordmark>
  );
  return compact
    ? <span aria-hidden="true" data-testid="brand-wordmark" style={type}>{gilded}</span>
    : <h1 aria-hidden="true" data-testid="brand-wordmark" style={type}>{gilded}</h1>;
}
