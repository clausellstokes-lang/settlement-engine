/**
 * hooks/useMissedPath.js — THE ADDRESS THAT DID NOT EXIST, KEPT LONG ENOUGH TO SAY SO.
 *
 * ⛔ A DEAD LINK LOOKED LIKE IT WORKED (REVIEW-P F11, ODQ §934.24(c)). The 2026-09-20
 * walk opened `/this-page-does-not-exist` on both viewports and measured
 * `href: /create`, `title: SettlementForge`, `notices: []`, `saysNotFound: false`. The
 * routing table was never at fault — `lib/routes.js` has returned `notFound: true` for
 * an unknown path all along — but the only consumer was App's canonical-URL upgrade,
 * which rewrote the address and threw the flag away. A mistyped or rotted link
 * therefore delivered a visitor to the Create page looking exactly like a link that
 * worked, which is the worst version of this class: the reader has no way to know
 * anything went wrong at all.
 *
 * ⚠ WHY A LATCH, AND WHY THE FLAG CANNOT SIMPLY BE RENDERED. `notFound` is TRUE for one
 * render only. `replacePath` re-emits to the route store, so the very next resolve is a
 * clean `/create` with no flag on it, and a notice keyed directly to `notFound` would
 * appear and vanish inside a frame. The fact is therefore captured the moment it is
 * seen, with the address that failed — the one thing a reader can act on, since it
 * tells them whether they mistyped it or followed something stale.
 *
 * ⭐ ADJUSTED DURING RENDER, NOT IN AN EFFECT, and the first cut got this wrong. Two
 * effects (`[view]` to clear, `[notFound]` to latch) worked only because they were
 * declared in that order — a fragile ordering nothing enforced — and each cost a second
 * render pass. `react-hooks/set-state-in-effect` flagged both, and it was right: this is
 * not synchronisation with an external system, it is state derived from a value that
 * changed, which React's own "adjusting state when a prop changes" pattern covers. The
 * INITIAL state reads the flag directly, so a not-found FIRST PAINT latches with no
 * transition at all — the case the effect ordering existed to protect.
 *
 * A second bad address that resolves to the same default view does NOT change `view`, so
 * the clear branch does not fire — but `notFound` really does go false (after the
 * rewrite) and true again, so the LATCH branch re-fires and names the newer address.
 * That branch is the one the initial state cannot cover, and it has its own arm.
 *
 * SESSION-ONLY AND COMPONENT-LOCAL, deliberately: this is a fact about one navigation,
 * not about the world, so it never reaches the store, is never persisted, and cannot
 * travel to a surface the reader did not arrive at.
 *
 * @enforced-by tests/components/notFoundNotice.test.jsx
 */
import { useState } from 'react';

import { useRoute } from './useRoute.js';

/**
 * The address the router had no page for, or null.
 * @param {boolean|undefined} notFound
 * @returns {string|null}
 */
function missedAddress(notFound) {
  return notFound && typeof window !== 'undefined' ? window.location.pathname : null;
}

/**
 * The address the reader asked for when the router had no page for it, until they
 * dismiss it or navigate somewhere new.
 *
 * @returns {{ missedPath: string|null, dismiss: () => void }}
 */
export default function useMissedPath() {
  const { view, notFound } = useRoute();
  const [missedPath, setMissedPath] = useState(() => missedAddress(notFound));
  const [seen, setSeen] = useState({ view, notFound });

  if (seen.view !== view) {
    // Arriving somewhere new ends the fact: a refusal belongs to the navigation that
    // earned it, the same law App's own `[view]` effect applies to `lastRefusal`.
    setSeen({ view, notFound });
    setMissedPath(missedAddress(notFound));
  } else if (seen.notFound !== notFound) {
    // The flag moved without the view moving — either the canonical rewrite clearing it
    // (keep what was latched) or a SECOND unknown address arriving (name the newer one).
    setSeen({ view, notFound });
    if (notFound) setMissedPath(missedAddress(notFound));
  }

  return { missedPath, dismiss: () => setMissedPath(null) };
}
