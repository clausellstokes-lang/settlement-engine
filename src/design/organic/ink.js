/**
 * design/organic/ink.js — THE INK TONAL RAMP (Organic Craft law §3 / §6).
 *
 * Print has no z-axis. A manuscript expresses depth by INK COVERAGE on one paper
 * tone, never by elevation — so the organic layer replaces drop-shadow hierarchy
 * with a graded ramp of ONE warm text ink. Emphasis = add ink (weight/size/tone);
 * de-emphasis = remove ink. (Tufte CSS's #fffff8/#111 grayscale ramp is the model,
 * warmed for parchment.)
 *
 * TWO GROUNDS, ONE INK IDEA:
 *   • LIGHT  (DESK / SPREAD) — the warm-black ink on parchment. Steps `deepest`
 *     `strong` `body` map 1:1 to the shipped ink-900 / ink-800 / ink-600 tokens
 *     (zero visual regression: an existing surface that reads INK.body renders the
 *     same pixel). `secondary` is the gloss/marginalia tone; `hairline` is the
 *     feint receding rule tone (decorative — NEVER text).
 *   • FIELD  (dim) — warm off-white ink on a warm dark gray ground, never pure
 *     white on pure black (§6 halation rule). Its own ramp so the field notebook
 *     is art-directed, not an inverted light theme.
 *
 * CONTRAST LAW (§6): every TEXT step clears WCAG AA (4.5:1 body / 3:1 large) at
 * the letterform, measured against the DARKEST paper tone a glyph sits on
 * (parchment-100 #F4EAD0 for light; the field panel for dim). Verified in
 * tests/design/contrast.test.js — headroom is deliberately reserved above the
 * floor so a future grain overlay can darken the local ground and still pass.
 * `hairline` is the sole non-text tone; it is documented as decorative (a
 * negative control pins that it would fail AS text), exactly like the shipped
 * card-border convention.
 *
 * Raw hexes live here legitimately — this is a token-DEFINITION file under
 * src/design/ (the visual-budget lint exemption). Nothing eager imports this
 * module; the whole organic layer is lazy (first-paint closure law).
 */

// ── LIGHT ground — the parchment ink ramp (DESK / SPREAD) ────────────────────
export const INK = Object.freeze({
  deepest:   '#1B1408',  // display / primary — maximum ink (= ink-900, 1:1)
  strong:    '#2C2210',  // secondary headings, strong labels (= ink-800, 1:1)
  body:      '#4A3B22',  // BODY COPY — the reading ink (= ink-600, 1:1; AA on all grounds)
  secondary: '#6B5340',  // gloss / marginalia / de-emphasized aside (AA text; 5.97:1 on parch-100)
  hairline:  '#C8B89A',  // feint receding RULE tone only — decorative, never text
});

// ── FIELD ground — the dim field-notebook ramp (warm, halation-safe) ─────────
export const FIELD_INK = Object.freeze({
  ground:    '#211B12',  // the warm dark-gray page (never #000)
  panel:     '#2C2416',  // a lifted panel / card ground in field mode
  ink:       '#ECE0C6',  // warm off-white primary ink (never #FFF; 11.7:1 on panel)
  body:      '#D8C8A8',  // body copy in field mode (9.3:1 on panel)
  secondary: '#C0AE8A',  // gloss / secondary in field mode (7.05:1 on panel)
  faint:     '#9C8C6E',  // faint labels in field mode (AA text; 4.66:1 on panel)
  hairline:  '#5A4E38',  // feint rule tone on the dark ground — decorative, never text
});

/**
 * The ordered light-ramp steps from most ink to least — the tonal spine a
 * component walks to rank content without boxes. Frozen so the order (and thus
 * the monotone-darkening contract the ramp test pins) is stable.
 */
export const INK_RAMP_ORDER = Object.freeze(['deepest', 'strong', 'body', 'secondary', 'hairline']);

/** The TEXT steps that owe WCAG AA (everything but the decorative hairline). */
export const INK_TEXT_STEPS = Object.freeze(['deepest', 'strong', 'body', 'secondary']);
export const FIELD_TEXT_STEPS = Object.freeze(['ink', 'body', 'secondary', 'faint']);
