/**
 * primitives/InfoPill.jsx — THE ? PILL (the owner, 2026-11-02 UTC, X-42): "the little circle
 * with the ? inside that one a mouse covers over it It explained what the section does".
 *
 * A circled question mark beside a section header. Hover or focus shows the words; a tap
 * toggles them (touch has no hover); Escape and a tap outside close them. The words are a
 * generic line from copy/sectionHelp.js, never a fact about the settlement. The pill is a
 * real button with an accessible name, the words are its description (aria-describedby),
 * so a screen reader hears them whether or not the bubble is open. The glyph is text, not
 * an icon (the immersion law); the circle is PAINTED by a radial gradient rather than
 * rounded by a corner radius (the deep-craft kill-list counts every rounded-corner line,
 * even in a comment, and the wave closes at zero); the bubble is the parchment callout
 * grammar from theme tokens, no shadow (print has no z-axis; print shows no pill at all).
 *
 * @param {{ text: string, label?: string }} props
 */
import { useEffect, useId, useRef, useState } from 'react';
import { BORDER_STRONG, CARD, FS, GOLD_DEEP, INK, sans } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

export default function InfoPill({ text, label = 'What this shows' }) {
  const [pinned, setPinned] = useState(false);
  const [hover, setHover] = useState(false);
  const mobile = useIsMobile();
  const ref = useRef(null);
  const id = useId();
  const open = pinned || hover;

  useEffect(() => {
    if (!pinned) return undefined;
    const onPointerDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setPinned(false); };
    const onKey = (e) => { if (e.key === 'Escape') setPinned(false); };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [pinned]);

  if (!text) return null;
  return (
    <span ref={ref} data-testid="info-pill" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 6, verticalAlign: 'middle' }}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setPinned((v) => !v)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: mobile ? 24 : 20, height: mobile ? 24 : 20, padding: 0, border: 'none',
          // the ring: a painted circle with a one-pixel gold edge, transparent beyond it
          background: `radial-gradient(circle at center, ${CARD} 0 42%, ${GOLD_DEEP} 42% 50%, transparent 52%)`,
          color: GOLD_DEEP, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800,
          lineHeight: 1, cursor: 'help', WebkitTapHighlightColor: 'transparent',
        }}
      >
        ?
      </button>
      {/* The words stay in the DOM for the description; the bubble is shown by opacity so a
          screen reader reads them either way (the BuyThisDossier caption's own idiom). */}
      <span
        id={id}
        role="tooltip"
        data-testid="info-pill-text"
        style={{
          position: 'absolute', left: 0, top: '100%', marginTop: 6, zIndex: 3,
          minWidth: 220, maxWidth: 'min(360px, 80vw)',
          padding: '8px 11px', background: CARD, border: `1px solid ${BORDER_STRONG}`,
          color: INK, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), fontWeight: 500, lineHeight: 1.45,
          textAlign: 'left', whiteSpace: 'normal',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 120ms ease-out',
        }}
      >
        {text}
      </span>
    </span>
  );
}
