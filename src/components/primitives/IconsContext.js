import { createContext, useContext } from 'react';

/**
 * IconsContext — the icons-off gate (mirrors the redesign template's IconCtx).
 *
 * The redesign suppresses lucide/SVG icons on EVERY surface except the Realm
 * map: text-only nav, tabs, cards, buttons, badges. Default is false (off);
 * the Realm map subtree opts back in via <IconsContext.Provider value={true}>.
 *
 * Two channels are preserved with the icon off: state badges keep color + their
 * uppercase text label (P7), and affordances fall back to unicode TEXT glyphs
 * (+ / - / x / chevrons), which are not icons and are unaffected by this gate.
 *
 * THE CONSULTING PRIMITIVES — this list is enforced, not aspirational. Lane LU
 * found the previous list here was a claim rather than a census: it named
 * IconButton, StateBadge, CanonBadge and PhaseBadge as consulting the gate, and
 * NONE of the four did. Every StateBadge and PhaseBadge in the app had been
 * rendering its lucide glyph straight through the ratified icons-off redesign.
 * tests/lint/lucideTotality.test.js now pins the real set, so this comment can
 * never drift from the code again:
 *
 *   consult the gate (may render lucide, but only inside the map Provider) —
 *     Button, Badge, Pill, Dialog, BottomSheet, Stat, Segmented, ActionRail,
 *     FounderBadge, DesktopOnlyGate, Disclosure, InstitutionCard
 *   carry NO icon channel at all (color + uppercase text label only) —
 *     StateBadge, PhaseBadge, CanonBadge
 *
 * ICONBUTTON — CLOSED (lane LU-2), and the reason is recorded here because the
 * previous version of this comment declared it unclosable. It WAS icon-only by
 * construction: its entire child was `<Icon />`, so suppressing the glyph left
 * an empty labelled box rather than a quieter control, and each of its ~70 call
 * sites imported lucide directly to feed it.
 *
 * The chair picked the unicode text twin (2026-08-03), i.e. the shape Dialog,
 * Badge and BottomSheet already use for their close affordance rather than the
 * competing "render the required label as text", which would have varied the
 * fixed box width and reflowed every toolbar in the product. IconButton now
 * takes `glyph` alongside `Icon`; a call site passing `glyph` drops its lucide
 * import and keeps its box, tone, focus ring, `title` and required
 * `aria-label`. A call site that has not been converted passes no `glyph` and
 * behaves exactly as before, so the sweep is incremental rather than a big bang.
 *
 * NOTE THAT ICONBUTTON IS NOT IN lucideTotality's GATE_PRIMITIVES: that list
 * means "imports lucide but renders it only through the gate", and IconButton
 * imports no lucide at all — it receives `Icon` as a prop. Its gate consultation
 * is pinned separately by tests/components/iconButtonGlyphChannel.test.jsx.
 */
export const IconsContext = createContext(false);

/** True when lucide icons should render (only inside the Realm map subtree). */
export const useIconsOn = () => useContext(IconsContext);
