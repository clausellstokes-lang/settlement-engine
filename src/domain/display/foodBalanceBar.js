/**
 * foodBalanceBar.js — THE FOOD BALANCE BAR'S GEOMETRY, READ FROM THE RECORD THAT
 * ALREADY HOLDS IT (ODQ §934.20).
 *
 * ── THE DEFECT THIS LEAF EXISTS TO CLOSE ─────────────────────────────────────
 * The Economics tab drew the food balance bar from TWO of the three channels the
 * record credits. A world needing 1,014 lb/day against 773 produced and 169
 * imported drew production (76 %), imports (17 %) and a beige tail of 7 % — while
 * the sentence under it said "Residual shortfall is 4 %". Both were honest about
 * their own arithmetic and they could not both be true: the missing three points
 * are `foodSecurity.magicOffset`, the druidic / divine / arcane provision the food
 * writer applies AFTER trade (foodBalance.js, `magicFoodOffset`), which the bar
 * never drew and no label ever named. §934.15 cured the same class one layer down
 * — the FIGURES disagreed; this is the PICTURE disagreeing with the figures.
 *
 * ── THE LAW THIS OBEYS (§934.15) ─────────────────────────────────────────────
 * A view that re-derives a number its writer already holds is a second source of
 * truth. Every term below is a published field:
 *   · production  ← foodBalance.dailyProduction  (the "Production: N lbs/day" figure)
 *   · imports     ← foodBalance.importCoverage   (the "+ N imported" figure)
 *   · magic       ← foodBalance.magicFoodOffset  (the "+ N by <channel> provision" figure)
 *   · the tail    ← the RECORD'S OWN residual share (deriveFoodBalance().deficitPct,
 *                   which is `foodSecurity.deficitPct` — the number the band word was
 *                   cut from and the number the sentence prints).
 *
 * ── WHY THE MAGIC RUN IS THE CLOSING TERM, AND WHY THAT IS NOT A RE-DERIVATION ─
 * The tail is pinned to the record's residual so the picture and the sentence can
 * never disagree again, which leaves ONE degree of freedom for the two coverage
 * channels. It goes to magic, because that is the writer's own arithmetic: in the
 * canonical reconcile the magical offset IS the closing term —
 *   `const magicResidual = Math.max(0, totalCoverage - importPortion); … magicFoodOffset = magicResidual;`
 * (src/generators/economy/foodBalance.js). Drawing it as the remainder of the
 * covered gap reproduces the writer, it does not invent a second model. Its
 * PRESENCE is gated on the published `magicFoodOffset`, and its LABEL prints that
 * field, so no reader is ever shown a channel the record does not credit.
 *
 * ── WHEN THE RECORD DOES NOT CLOSE ───────────────────────────────────────────
 * A gap with no channel to carry it (no imports, no magic) leaves the tail wider
 * than the stated residual rather than inventing a run to fill it. That is the
 * honest failure: the bar shows what is uncovered and names nothing it cannot
 * name. `residual` is returned so a caller — or a test — can read what was
 * actually drawn instead of assuming.
 *
 * Pure, dependency-free, and shared by the Economics tab and the PDF economics
 * chapters so the screen and the print cannot part on the same three pounds.
 */

/** @param {unknown} v @returns {number} a finite number, or 0 */
function num(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

/** @param {number} n @returns {number} n clamped into [0, 100] */
function clampPct(n) {
  return n < 0 ? 0 : n > 100 ? 100 : n;
}

/**
 * The three magical food channels the writer can credit, in the writer's own
 * vocabulary. `magicFoodNote` opens on the channel adjective — "Druidic
 * cultivation…", "Divine provision…", "Arcane quickening…" — which is the only
 * place the channel is published, so the word is READ off the note rather than
 * guessed from institutions the view cannot see.
 */
const MAGIC_FOOD_CHANNELS = Object.freeze(['druidic', 'divine', 'arcane']);

/**
 * The channel word for a magical food offset, lowercased for mid-sentence use.
 *
 * Falls back to the neutral 'magical' rather than to a wrong adjective: a note
 * the writer stops opening on its channel must not silently promote one of the
 * three, and a reader told "magical provision" has been told the truth.
 *
 * @param {unknown} note `foodBalance.magicFoodNote`
 * @returns {string} 'druidic' | 'divine' | 'arcane' | 'magical'
 */
export function magicFoodChannelWord(note) {
  const first = String(note ?? '').trim().split(/\s+/)[0].toLowerCase();
  return MAGIC_FOOD_CHANNELS.includes(first) ? first : 'magical';
}

/**
 * The food-balance record this leaf reads, as an OPAQUE BAG OF UNKNOWNS rather than an
 * `any`. src/domain is under the strict typecheck and the any-cast ratchet (a new file
 * carrying any debt fails on arrival), and the honest shape here is genuinely unknown:
 * the same record arrives from the canonical writer, from a legacy save and from a direct
 * unit caller, and every field is read through `num()` or `String()` for exactly that
 * reason. Naming a struct would assert a shape three callers do not all satisfy.
 * @typedef {{[key: string]: unknown}|null|undefined} FoodBalanceRecord
 */

/**
 * @typedef {object} FoodBarSegments
 * @property {number} production  percent of daily need the town grows itself
 * @property {number} imports     percent of daily need trade lands
 * @property {number} magic       percent of daily need magical provision closes
 * @property {number} residual    percent of daily need left undrawn (the tail)
 * @property {string|null} magicChannel the channel word, or null when no magic is credited
 */

/**
 * The balance bar's runs, as whole percents of daily need that tile the track.
 *
 * `production + imports + magic + residual === 100` by construction, and
 * `residual` is the record's own residual share whenever the record's channels
 * account for the gap — so the picture's tail and the sentence's "Residual
 * shortfall is N %" are one number.
 *
 * @param {FoodBalanceRecord} fb `economicViability.metrics.foodBalance`, or null
 * @param {number|null|undefined} residualPct the record's residual share of need
 *   (`deriveFoodBalance(s).deficitPct`); null on a record that carries none, in
 *   which case the published deficit pounds are used instead.
 * @returns {FoodBarSegments}
 */
export function foodBarSegments(fb, residualPct) {
  const need = Math.max(1, num(fb?.dailyNeed));
  const importLb = Math.max(0, num(fb?.importCoverage));
  const magicLb = Math.max(0, num(fb?.magicFoodOffset));
  const production = clampPct(Math.round((num(fb?.dailyProduction) / need) * 100));

  // The record's own residual first; the published pounds are the arm for a
  // record that carries no percentage (an older save, or a caller that hands the
  // model only pounds and a need) — the same fallback ladder deriveFoodBalance
  // uses, so the two readers cannot part on which number is authoritative.
  const statedResidual = typeof residualPct === 'number' && Number.isFinite(residualPct)
    ? residualPct
    : (num(fb?.deficit) / need) * 100;
  const residualCap = 100 - production;
  const residual = Math.max(0, Math.min(residualCap, Math.round(statedResidual)));

  // What the two coverage channels must carry between them for the tail to BE
  // the stated residual.
  const covered = residualCap - residual;
  const importRun = clampPct(Math.round((importLb / need) * 100));

  let imports = 0;
  let magic = 0;
  if (magicLb > 0) {
    // Imports draw their own published quantity; magic closes the rest, exactly
    // as the writer computes it.
    imports = Math.min(covered, importRun);
    magic = Math.max(0, covered - imports);
  } else if (importLb > 0) {
    // No magical channel to credit: the whole covered gap is import-carried,
    // which is the writer's own else-branch.
    imports = covered;
  }

  return {
    production,
    imports,
    magic,
    residual: 100 - production - imports - magic,
    // ⚠ THE CHANNEL IS A PROPERTY OF THE RECORD, NOT OF THE DRAWING. Gating it on the
    // drawn run would blank the word on an offset too small to round to a whole percent
    // — and the sentence, which names the channel whenever the record credits one, would
    // then be naming something the label beside the bar could not.
    magicChannel: magicLb > 0 ? magicFoodChannelWord(fb?.magicFoodNote) : null,
  };
}
