import { createContext, useContext } from 'react';

/**
 * IconsContext — the icons-off gate (mirrors the redesign template's IconCtx).
 *
 * The redesign suppresses lucide/SVG icons on EVERY surface except the Realm
 * map: text-only nav, tabs, cards, buttons, badges. Default is false (off);
 * the Realm map subtree opts back in via <IconsContext.Provider value={true}>.
 *
 * The icon-bearing primitives (Button, IconButton, StateBadge, CanonBadge,
 * PhaseBadge, Disclosure, Segmented) consult this so the icons-on boundary is
 * ONE Provider, not a per-call-site edit. Two channels are preserved with the
 * icon off: state badges keep color + their uppercase text label (P7), and
 * affordances fall back to unicode TEXT glyphs (+ / - / x / chevrons), which
 * are not icons and are unaffected by this gate.
 */
export const IconsContext = createContext(false);

/** True when lucide icons should render (only inside the Realm map subtree). */
export const useIconsOn = () => useContext(IconsContext);
