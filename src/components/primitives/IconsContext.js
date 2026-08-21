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
 * found the previous list here was a claim rather than a census: of the seven
 * primitives it named as consulting the gate, FIVE never called useIconsOn —
 * IconButton, StateBadge, CanonBadge, PhaseBadge and Disclosure. (LU-1 and its
 * first record said four and left Disclosure out; the correction is recorded
 * here because a miscount inside the finding that "the count was fiction" is the
 * same defect one level up. Disclosure gained the gate in LU-1 and now sits in
 * roster A below.) Every StateBadge and PhaseBadge in the app had been rendering
 * its lucide glyph straight through the ratified icons-off redesign.
 *
 * ⚠️ THE THREE ROSTERS BELOW ARE MACHINE-READ, not prose. Their format is a
 * contract: `ROSTER <letter>`, a colon ending the description, then the member
 * names comma-separated until the blank comment line.
 * tests/lint/lucideTotality.test.js parses them and asserts each one equals the
 * set it pins from the source, so this comment can never drift from the code
 * again — in either direction. Add or remove a name here and the guard reds
 * until the pin agrees, and vice versa.
 *
 *   ROSTER A — they import lucide and render it only through the gate, so their
 *   glyphs appear inside the map Provider and nowhere else:
 *     ActionRail, Badge, BottomSheet, Button, DesktopOnlyGate, Dialog,
 *     Disclosure, FounderBadge, InstitutionCard
 *
 *   ROSTER B — they import NO lucide at all: the glyph arrives as a prop and
 *   this gate decides whether it renders. The lucide source scan is blind to
 *   them by construction, which is exactly why they are pinned by name:
 *     IconButton, Pill, Segmented, Stat
 *
 *   ROSTER C — they carry NO icon channel at all; the two channels that survive
 *   an icons-off badge are the kind's COLOR and its uppercase TEXT label (P7):
 *     CanonBadge, PhaseBadge, StateBadge
 *
 * ICONBUTTON — CLOSED (lane LU-2), and the reason is recorded here because the
 * previous version of this comment declared it unclosable. It WAS icon-only by
 * construction: its entire child was `<Icon />`, so suppressing the glyph left
 * an empty labelled box rather than a quieter control.
 *
 * ITS POPULATION, MEASURED rather than estimated (2026-08-03, at LU-2b): 68
 * files render IconButton across 141 call sites. The earlier record said "~70
 * call sites" and that "every one of them is a frozen row in the LU-W ratchet";
 * both halves were wrong. 141 sites live in 68 files, and those files split
 * three ways, not one: 50 are frozen rows, 15 sit under the MAP_SUBTREE
 * exemption (so clearing IconButton does not shrink the frozen list by them),
 * and one — InstitutionCard — is itself a gate primitive. The frozen subset was
 * 52 when LU-W froze the census and is 50 after LU-2b, which is why the numbers
 * here are dated: they are a measurement, and the burn-down moves them. What is
 * NOT a moving number, and is asserted on every run, is the shape — every
 * IconButton file that imports lucide is inside one of the guard's lists, so
 * the population can only shrink.
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
 * imports no lucide at all — it receives `Icon` as a prop. It is roster B, i.e.
 * lucideTotality's PROP_ICON_CONSUMERS, where membership is proved by the
 * useIconsOn call rather than by an import; its four render arms are pinned
 * behaviourally besides, in tests/components/iconButtonGlyphChannel.test.jsx.
 */
export const IconsContext = createContext(false);

/** True when lucide icons should render (only inside the Realm map subtree). */
export const useIconsOn = () => useContext(IconsContext);
