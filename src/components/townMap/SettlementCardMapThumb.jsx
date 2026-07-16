/**
 * components/townMap/SettlementCardMapThumb — the SM-4 library-card thumbnail.
 *
 * A tiny, LAZY, CACHED raster preview of a settlement's deterministic town map,
 * shown as the leading element of a library SettlementCard. The heavy work — the
 * town-map model, the SVG projection, the canvas raster (src/lib/townMapThumb.js
 * → domain/townMap/**) — is reached ONLY through a dynamic import inside an effect,
 * gated by an IntersectionObserver, so:
 *   • the town-map fingerprint never enters the first-paint static closure (the
 *     card itself already rides the lazy settlements chunk; this keeps the raster
 *     module in a further lazy chunk fetched only when a card scrolls into view);
 *   • the expensive canvas encode runs at most once per settlement (the module
 *     cache dedupes; a re-roll / edit / world-pulse tick re-keys it).
 *
 * Self-collapsing: a map-less settlement (no institutions and no quarters) or a
 * canvas-less environment ⇒ renders nothing, so the card falls back to its exact
 * prior text-only layout. Decorative (alt="") — the card already names the place.
 */

import { useEffect, useRef, useState } from 'react';
import { BORDER, PARCH, R } from '../theme.js';

/**
 * @param {{ settlement: any, size?: number }} props
 *   `settlement` is the save blob (save.settlement); `size` is the displayed px box.
 */
export default function SettlementCardMapThumb({ settlement, size = 46 }) {
  // 'pending' → show the placeholder box (and observe it); 'ready' → the <img>;
  // 'empty' → render nothing (map-less / no canvas / failed).
  const [status, setStatus] = useState('pending');
  const [dataUrl, setDataUrl] = useState(null);
  const boxRef = useRef(null);

  // Re-seed for a NEW settlement blob (card reuse / a live edit) the React-sanctioned
  // way — adjust state DURING render (a setState in render re-renders before commit,
  // no cascading effect), the SettlementMapPane precedent. Keeps the generation
  // effect free of a synchronous setState in its body.
  const [seen, setSeen] = useState(settlement);
  if (seen !== settlement) {
    setSeen(settlement);
    setStatus('pending');
    setDataUrl(null);
  }

  useEffect(() => {
    if (!settlement) return undefined;
    let cancelled = false;

    const generate = async () => {
      try {
        const { renderTownMapThumb } = await import('../../lib/townMapThumb.js');
        // 2x the display box for a crisp raster on retina / downscale.
        const url = await renderTownMapThumb(settlement, { size: size * 2 });
        if (cancelled) return;
        if (typeof url === 'string' && url) { setDataUrl(url); setStatus('ready'); }
        else setStatus('empty');
      } catch {
        if (!cancelled) setStatus('empty');
      }
    };

    const el = boxRef.current;
    // No IntersectionObserver (jsdom / SSR) ⇒ generate straight away so the thumb
    // is still exercised; real browsers defer until the card nears the viewport.
    if (typeof IntersectionObserver === 'undefined' || !el) {
      generate();
      return () => { cancelled = true; };
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { io.disconnect(); generate(); break; }
      }
    }, { rootMargin: '300px' });
    io.observe(el);
    return () => { cancelled = true; io.disconnect(); };
  }, [settlement, size]);

  if (!settlement || status === 'empty') return null;

  const boxStyle = {
    width: size,
    height: size,
    flexShrink: 0,
    borderRadius: R?.md ?? 6,
    border: `1px solid ${BORDER}`,
    background: PARCH,
    overflow: 'hidden',
    display: 'block',
  };

  if (status === 'ready' && dataUrl) {
    return (
      <img
        src={dataUrl}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        style={{ ...boxStyle, objectFit: 'cover' }}
      />
    );
  }

  // Pending: a quiet placeholder box that the observer watches.
  return <div ref={boxRef} aria-hidden="true" style={boxStyle} />;
}
