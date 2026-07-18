# DESIGN — THE ORGANIC CRAFT LAW
## Fable 5 (architect), 2026-07-17 — owner-ratified ("Do it!… make it look like a $10,000 website… a 10,000 mobile companion piece as well… make sure realm is desktop only"). Sources: research sweeps wf_cd021516 (organic craft, 5 agents) + wf_65e6aacd (mobile companion, 5 agents), both banked; reconciliation brief: docs/briefs/W_ORGANIC_CRAFT_WAVE.md (ledger branch).

## 0. The thesis
The UI redesigns under the product's own laws. Humans detect AUTHORED vs DEFAULTED, not
handmade vs digital — every choice must read as decided by one maker; template grammar
(hero / three cards / feature rows; containers-in-containers) is the tell, whatever skin
it wears. The map laws apply verbatim: asymmetry with provenance (seeded, never jitter),
period craft never age damage, expression varies while substance holds.

## 1. THE ONE FICTION (total commitment)
**The surveyor's working desk.** Everything the user reads is something the surveyor
collected or drew (paper, ink, wash); everything the user operates is the surveyor's
instrument (machined, precise, quiet). The fiction lives in EVERY state — empty states,
errors, loaders — in one voice. A thin theme over standard components is a skin; depth of
one conceit beats breadth of ornament.

## 2. THE ARTIFACT/INSTRUMENT SPLIT (the master pattern; every studied success obeys it)
- ARTIFACTS (read surfaces — dossiers, maps, chronicles, plates, covenants): fully
  in-fiction; asymmetric composition on a rigorous spine; manuscript grammar.
- INSTRUMENTS (operated surfaces — buttons, forms, tables, nav, pickers): orthodox,
  geometric, quiet, accessible. The rebellion budget is spent on composition, texture,
  and voice — never on interaction targets. Ingold's parse test governs: every screen
  instantly answers what is a control, what is a display.
- In-fiction chrome is legal only where it imports a mental model the user already owns
  (a book gets chapters/bookmarks free). Diegetic friction only where friction IS the
  experience — never in bookkeeping.

## 3. MANUSCRIPT GRAMMAR (how information organizes without boxes)
Four ranked signals replace containers: SCALE · INK DENSITY (a tonal ramp of one text
ink; no drop shadows — print has no z-axis) · POSITION (main block vs margin) ·
RUBRICATION (the apparatus speaks in one restrained red/gold: section transitions,
do-this instructions, entry points — semantic, never decorative). Rules carry grammar:
hairline = subdivision, single = section close, double = total/finality, swelled/tapered
= hiatus. Margins are architecture (proportional, asymmetric; the wide outer margin is
the gloss channel) with floors/ceilings on small screens. Every structural mark has a
whitespace-only fallback. The interface is typography: inventory the real strings, rank
them, typeset them; containers are the residue of failed typesetting. Boxes become RARE
AND MEANINGFUL: seal, plate, charter.

## 4. TYPOGRAPHY (the cheapest strongest signal)
Reading tier: one workhorse text serif ≥16px, 45–90ch measure, ~1.5 line-height, true
italics/small caps (faux small caps BANNED — simultaneously the perf shortcut and the
kitsch tell). Display tier: the period voice (IM Fell class) at ~24px+ only. Mobile: the
scale COMPRESSES (≈1.414 vs desktop ≈1.618, fluid clamp(), space scales with type);
letterforms are size-specific (opsz/weight bump at small sizes). Dropcaps at openings
(CSS-only, float fallback); body-colored underlined links; one voice superbly set beats
options.

## 5. ORNAMENT (rationed, seeded, honest)
Hand-drawn one-off marks at meaningful moments surrounded by clean space ("clean dirt");
icon-library glyphs at display level are a named AI-slop tell — house marks are drawn
for purpose. SEEDED ORNAMENT: constrained composition of authored components (small
vetted libraries: emblems, corner pieces, glyph alternates × fixed palette ×
deterministic seed) — per-settlement uniqueness with provenance; the component library
sits under the same-seed golden discipline (a library change is a DECLARED golden
shift). Whimsy unrepeated: a quirk repeated becomes a system. Every flourish is
aria-hidden, alt="", non-interactive; decorative and functional are separate contracts.

## 6. MATERIAL + LEGIBILITY (the floor that never bends)
Texture is an ornament layer, NEVER a ground under live text — the worst pixel behind
any glyph clears 4.5:1 (body) / 3:1 (large), measured at the letterform. Contrast spends
from a tinted budget: ink tokens chosen against the darkest paper tone, headroom
reserved for grain. Ornamented controls owe three contrasts per state (label/fill,
boundary/ground, focus/landing). Links declare themselves without color alone and
without hover. Dark/dim: warm ink-and-ground values (off-white on warm dark gray),
never pure white on pure black. Unconventional layout, conventional wayfinding:
asymmetric grids ride a boring skeleton — visible consistent nav, current-location cue,
DOM order = reading order, 320px reflow survives.

## 7. THE MOBILE COMPANION (the field notebook — same bar, own art direction)
Composed, not collapsed: every major surface records a keep-vs-stack ruling; mobile is
art-directed at its own size. THE PHONE IS A PROMPTER: the at-table budget is a
2-second glance + ≤3 taps inside a ~10-second social window; surfaces earn a phone slot
by being IMPROVISED or TRACKED (names/NPC quick-facts/rules-refs/trackers/tonight's
notes); launch resumes the exact scene, never a dashboard. FIELD MODE is a deliberate
display state (cook-mode pattern): dim warm theme, enlarged type, stripped chrome, wake
lock where supported, tap-to-mark. Interruption is the normal case: all transient state
survives navigation and process death. One thumb, bottom third: 44–48px targets, bigger
at edges, primary verbs bottom-center; 3–5 visible destinations + one honest "more"
(the hamburger-dump halves discoverability — NN/g n=179). Marginalia re-anchor from
space to point (tap-gloss at the reference, in-flow for screen readers); hover-reveals
die. Speed is a materials property: fastness IS the parchment aesthetic (slowness reads
as rot).
**THE REALM IS DESKTOP-ONLY (owner ruling):** gate the tool, never the data — mobile
shows the read-only render (the render IS the trust signal), capability-forward copy
("built for a bigger canvas"; the companion role named), every gate ends in an action
(deep link / QR / state-waits promise), scoped to exactly the realm surface — dossiers,
town maps, gallery, pages stay fully live.

## 8. PERFORMANCE (the critic's law — craft that is slow is not craft)
Fonts: subset variable fonts, metric-matched fallbacks, no FOUT reflow; a stated font
byte budget. Ornament: pre-baked static SVG (no runtime feTurbulence/displacement), no
blend-modes on long scrolling registers, seeded compositions memoized/precomputed at
gallery scale. The first-paint eager-JS ratchet applies unchanged; ornament assets load
lazy. Mobile verification is a RATCHET, not a vibe: throttled mid-range-device budgets
(TTI/INP) join the tests/build family. Registers key off container queries, not
viewport.

## 9. Standing gates
The preview legibility review (desktop + mobile + dim pass) gates every craft fold; the
owner's taste veto on a sample screen set precedes any app-wide sweep; legibility beats
immersion in every collision, permanently.

## 10. THE TABLET COMPANION (owner amendment, 2026-07-17: "we need a tablet companion…
## This one can include the realm")

THE THREE-POSTURE MODEL replaces the mobile/desktop binary: **DESK** (desktop — the full
instrument bench, realm included) · **FIELD** (phone — the prompter/notebook, realm
gated) · **THE SPREAD** (tablet — the open book and the shared surface, **REALM-CAPABLE
by owner ruling**). Postures derive from pointer/hover capability + width + orientation
(a posture model, never width-only breakpoints), building on the existing isMobile layer
— extended, never greenfielded. Tablet is COMPOSED AT ITS OWN SIZE (the stretched-phone
and shrunken-desktop failure modes are the named tells): two-page spreads where the
book metaphor earns it, orientation as two compositions (landscape spread vs portrait
scroll), floating instrument panels over artifact grounds. THE TABLE SCENARIOS the
tablet uniquely owns: the GM-screen replacement (reference + trackers at the elbow) and
THE FLAT SHARED SURFACE (the town map/fog layer laid on the table for players — the fog
table layer's true home; the DM/player visibility split governs what a flat tablet may
show). REALM ON TOUCH: pan/zoom/inspect first-class; drag-placement with fat-finger
precision assists (tap-then-confirm placement, snap, loupe-class aids per the research);
44-48px on every realm control OUR chrome owns; the FMG iframe's touch behavior verified
empirically at build, never assumed. Sweep wf_3c80f28a feeds the wave's tablet phase;
the preview legibility review gains the tablet viewport both orientations.
