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
 * THE ONE PRIMITIVE THIS GATE CANNOT CLOSE — IconButton. Its entire child is
 * `<Icon size={s.icon} />`: it is icon-ONLY by construction, so suppressing the
 * glyph leaves an empty labelled box, not a quieter control. Its ~70 call sites
 * therefore still render lucide, and every one of them is a frozen row in the
 * lucideTotality ratchet. Closing it needs a UX shape the chair has not picked
 * (unicode text twin per call site vs. relaxing the fixed box and rendering the
 * required `label` as text) — see the lane LU commit body's STOP report.
 */
export const IconsContext = createContext(false);

/** True when lucide icons should render (only inside the Realm map subtree). */
export const useIconsOn = () => useContext(IconsContext);
