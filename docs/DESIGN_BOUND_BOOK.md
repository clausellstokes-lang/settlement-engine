# DESIGN — THE BOUND BOOK (the aesthetic refinement program)

## Fable 5 architecture, 2026-08-02, from the chair's design critique + owner order
## ("architect exhaustively, comprehensively, and coherently all the fixes").
## Implementation = the external implementer. THE THESIS: the identity is NOT
## touched — palette, typography, artwork, and register all stand; this program
## closes the four gaps between a very good aesthetic and a finished one, by doing
## for seams, density, motion, and voice-in-frame what the no-raw-color law already
## did for color: turning taste into enforceable law. The site should feel bound
## like one book; hence the name.
## Substrate discipline: component facts below marked VERIFY-AT-BUILD are the
## build's first step, never this doc's assumption (the self-audit's standing
## lesson). Token-home law: chrome DIMENSIONS live in theme.js CHROME (the frozen
## source the audit identified); COLOR/type/motion values live in tokens.js —
## VERIFY-AT-BUILD and follow the existing split, never fork a third home.

## §1 THE FOUR DEFECT CLASSES (named, so fixes trace)
- **A. VOICE-IN-FRAME DISSONANCE** — engine vocabulary inside illuminated frames
  ("Severity 45%" in a manuscript card; "shows enough conflict pressure…" beside
  serif italic taglines). The frame makes a promise the sentence breaks.
- **B. SEAM ANARCHY** — paint meets page a different way on every surface; the
  hero shader seam (LD-3b's catch) was the extreme case of a general lawlessness.
- **C. DENSITY COLLAPSE** — cream-on-cream with hairline borders reads as elegant
  calm on airy pages and washes out on dense ones; hierarchy leans on type alone.
- **D. MOTION ANONYMITY** — no codified motion identity; the site is static
  between the scroll film and page loads, while two specs (the Hall's
  entered-not-loaded, the miniature's settle) have already invented the register
  without naming it.

## §2 LAW A — ONE REGISTER: THE FRAME SETS THE SENTENCE'S FLOOR
**The ruling:** a surface's visual formality sets the MINIMUM voice formality of
every string rendered inside it. A manuscript-framed card may only carry
chronicle-voice sentences; a ceremonial surface only covenant-register prose.
Design and voice are one register or they are neither.
- **THE SURFACE-REGISTER MAP (new, data):** a closed vocabulary —
  `chrome | parchment | manuscript | ceremonial` — each declaring: its voice
  floor (UI-label ≤ chrome; plain prose ≤ parchment; chronicle voice ≤
  manuscript; covenant register = ceremonial), its type scale, and its CHIP
  PERMISSIONS (what may render as a pill there). Components declare their
  register; the map lives beside the tokens.
- **CHIP LAW (the concrete kills):** raw-scalar pills are BANNED in manuscript
  and ceremonial registers — "Severity NN%" becomes the band word
  (magnitudeBandOf's vocabulary, already built); "Tick N" becomes the in-world
  date phrasing the product already owns; exact figures demote to `title=`
  glosses where an operator genuinely needs them. VERIFY-AT-BUILD the full pill
  census on WizardNewsPanel + the herald/chronicle cards (the register's known
  four scalar-leak members are the seed list).
- **ENFORCEMENT is already half-landed and this section BINDS it:** the
  prose-numerics wall + the authoring census (Sol's a82a5c70) police the
  sentence side; the legacy receipt sweep (register items; June lanes worst,
  graded C/D) polices the stock of old sentences; the register map polices
  WHICH surfaces demand which floor. One program, three instruments — recorded
  here so nobody treats them as three unrelated chores.

## §3 LAW B — THE SEAM GRAMMAR (paint meets page exactly one of four ways)
**The closed seam vocabulary** — every surface where artwork touches interface
declares one:
- `letterbox` — a hard chrome edge (LD-3b's two ribbons; the film plays between
  rails). Owned by the chrome tokens; already specced.
- `feather` — a scrim gradient whose stops and heights are TOKENS (never
  per-page tuning — the hero seam bug was per-page tuning's child). For heroes
  and section backdrops.
- `plate` — artwork hard-framed inside content with the house border ring (the
  map card, hall plates, gallery tiles). The ring weights are tokens.
- `edge` — the deckle/torn-parchment mask: ONE shared SVG mask asset, used
  sparingly for full-bleed-to-parchment transitions. PARKED as owner taste
  (§9) — the grammar reserves the slot; nothing ships until the owner likes a
  rendered sample.
**Work:** VERIFY-AT-BUILD the artwork-surface inventory (hero film, the §06
create scene, landing waypoints, pricing backdrop, any compendium art), assign
each a seam kind in a small manifest, convert stragglers; a census walker
asserts every inventoried artwork surface declares its seam (the
registration-manifest idiom — seam anarchy becomes structurally impossible).

## §4 LAW C — THE ELEVATION GRAMMAR (density without noise)
- **PARCHMENT_STEPS (new tokens):** exactly three surface tones — page (base),
  card (+1 step), nested/emphasis (+2) — replacing close-valued ad-hoc creams.
  Hairline borders stay; SHADOWS ARE NOT ELEVATION on parchment (shadow remains
  reserved for true overlays: drawers, modals, the bio panel — the existing
  overlay class, unchanged).
- **THE DENSITY RULE:** dense pages (the Compendium grids, Gallery/Library
  lists — any view with card counts above an authored threshold per viewport)
  MUST render cards at +1 with section anchors; airy pages (landing, About,
  the Hall) may stay flat — calm is a feature there, not a bug.
- **THE CONTRAST FLOOR:** every chip/badge meets AA on the step it sits on —
  re-checked once against the +1 tone since moving the floor moves the figure.
- **Enforcement:** card backgrounds source from PARCHMENT_STEPS only (a
  source-scan sibling of the no-raw-color lint — the same law, one level up).

## §5 LAW D — THE MOTION LAW ("things resolve into place, once, with dignity")
- **The closed motion vocabulary:** `settle` (a short rise-and-fade on first
  entry: translate-y of a few px + opacity, once, never re-triggered) ·
  `reveal` (the staged ceremonial resolve — the Hall, the miniature; already
  specced twice, now named once) · `scrub` (the scroll-owned film; exists) ·
  `none` (the default — most things should not move).
- **Values are tokens:** durations and easings in a MOTION table (settle in the
  300–400ms band, ease-out, NO bounce, NO springs, NO loops, ever — the
  candlelight rule applied to time). Bands owner-tunable like any other.
- **REDUCED-MOTION IS A PARITY LAW, not an afterthought:** every declared
  motion names its static composition (the Hall's "a different grandeur, never
  a lesser one" — generalized to every surface). Pinned.
- **WHERE APPLIED, sparingly by law:** page-header entry, first-viewport card
  entry, drawers/overlays (existing), the two ceremonial reveals. Everything
  else: `none`. Motion is punctuation, not prose.
- **Enforcement:** transition/animation values source from the MOTION tokens
  (the lint family extends); a census of animated surfaces against the
  vocabulary — an undeclared animation is a red.

## §6 THE PROTECTED DELIGHTS (recorded so no sweep "improves" them away)
The gold letter-circle avatar fallback · the flags pill · the maker's mark
footer line ("Simulated, not AI-generated.") · the italic serif taglines ·
the painted artwork assets themselves · the muted-gold register — UNTOUCHED
by every slice below. A fix that erodes one of these is wrong by definition.

## §7 SLICES (each: no engine surface, no goldens, one commit; and because
## aesthetics answer to the OWNER'S EYE, every slice ends with a rendered
## before/after matrix — the promotion-contract human-evidence discipline
## applied to design; the owner walk is the gate, not the suite)
- **AE-1 THE SUBSTRATE:** PARCHMENT_STEPS + MOTION tokens + the surface-register
  map + the seam manifest — data only, zero visual change, lints armed in
  report-mode. (Sequenced FIRST: LD-3b, the Hall, and the miniature all consume
  these tokens — building them before those land beats retrofitting after.)
- **AE-2 THE SEAM SWEEP:** inventory → declare → convert stragglers to their
  seam kind; the census walker goes enforcing. Hero rides LD-3b's letterbox.
- **AE-3 THE ELEVATION SWEEP:** the dense pages adopt +1 steps + anchors;
  contrast re-floor; the background lint goes enforcing.
- **AE-4 THE MOTION APPLICATION:** settle on the sanctioned surfaces, statics
  for reduced motion, the animation lint goes enforcing.
- The VOICE half of Law A ships through the already-queued legacy receipt
  sweep + chip conversions (register items) — coordinated, not duplicated.

## §8 PINS (beyond the per-law enforcement above)
Register-map coverage over the inventoried reader-facing card components ·
seam-manifest totality · steps-only backgrounds · motion-tokens-only ·
reduced-motion parity (every motion has its named static) · the delights
list untouched (a snapshot pin on the six protected elements' key surfaces).

## §9 Parked owner calls
1. The deckle-edge mask (rendered sample first; taste rules).
2. Motion band values (the tokens ship at the chair's defaults; the eye tunes).
3. Whether the Compendium adopts an in-page section nav (only if the shared
   header pattern already carries one — the DESIGN_ABOUT_PAGES match-never-
   invent rule governs).
