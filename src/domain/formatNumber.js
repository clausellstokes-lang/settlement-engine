/**
 * formatNumber.js — the determinism-critical number formatter.
 *
 * WHY THIS EXISTS: SettlementForge's core contract is that the SAME seed
 * produces the SAME settlement on every device AND in every locale. A bare
 * `Number.prototype.toLocaleString()` (or an `Intl.NumberFormat` built with no
 * explicit locale) breaks that contract: it formats through the host's
 * ICU/CLDR tables, so `8000` renders as "8,000" on a US host, "8.000" on a
 * German one, "8 000" on a French one, and in some locales with non-Latin
 * digits. Any number that lands in persisted/replayed output — a viability
 * warning, a world-pulse candidate summary, an AI-layer prompt — must
 * therefore NEVER be formatted through the host locale.
 *
 * `formatCount` reproduces the en-US grouped integer style (comma every three
 * digits) with a fixed, table-free string transform, so a given number renders
 * IDENTICALLY across machines, OS builds, and locale settings. This is the
 * value already baked into the golden master (Node's default locale groups the
 * same way), so switching the persisted sites onto it is behavior-preserving —
 * it removes the host-locale dependency without changing a single byte. This is
 * deliberately the sole sanctioned number formatter for src/generators/** and
 * src/domain/**; the determinism lint guard in eslint.config.js bans the
 * toLocale* methods / Intl formatters in those trees and points here.
 *
 * Pure, dependency-free (domain-kernel style): no imports, no rng, no clock —
 * the same doctrine as deterministicSort.js.
 *
 * ─── DISPLAY-LAYER RULING (Wave 4h — fixed en-US formatting EVERYWHERE) ───
 * The same fixed formatting applies to the DISPLAY layer (src/components, src/pdf,
 * src/utils exports), not only to persisted/replayed output. The architect's UX
 * call: a shared artifact must render IDENTICALLY for a DM in Berlin and one in
 * Boston — consistency beats locale-honoring for shareable content. So every count
 * a component or PDF shows routes through `formatCount` (device-independent en-US
 * grouping), and the few genuine DATE renders — which need the ICU calendar and so
 * cannot use formatCount — pin an EXPLICIT 'en-US' locale (never a bare no-arg or
 * `undefined`-locale toLocale* call, which reads the host locale). This is applied
 * by CONVENTION in the display trees (screen + exports), not by the eslint
 * determinism ban, which stays scoped to src/generators + src/domain; the
 * localeFormatGuard lint pins those engine trees, and this comment is the
 * standing rationale for the component/pdf convention.
 *
 * If locale-aware display is ever wanted it must be display-ONLY (never export/PDF,
 * whose goldens are byte-stable and support-diffable), set per-ACCOUNT not
 * per-device, and never feed generation or fingerprints (F13 doctrine).
 */

// Group the integer part in threes with ',' — the fixed, cross-device-stable
// equivalent of en-US grouping. `\B(?=(\d{3})+(?!\d))` inserts a separator
// before every group boundary that is not the start of the string.
/** @param {string} digits @returns {string} */
const groupThousands = (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * Deterministic replacement for `n.toLocaleString('en-US')` on counts.
 *
 * Verified byte-identical to `Number.prototype.toLocaleString('en-US')` for the
 * whole integer domain the generators emit (populations, migrant counts, deltas
 * — all integers). For a fractional value it groups the integer part and keeps
 * up to three decimal places (Intl's decimal default), trailing zeros dropped;
 * the seeded pipeline only ever hands it integers, so that path is defensive.
 *
 * @param {unknown} value — a number (or number-coercible value).
 * @returns {string} the grouped, locale-independent representation.
 */
export function formatCount(value) {
  const num = Number(value);
  // Non-finite never occurs in the seeded pipeline; return a stable token
  // rather than routing through the host locale's "NaN"/"∞" glyphs.
  if (!Number.isFinite(num)) return String(num);

  const neg = num < 0;
  const abs = Math.abs(num);
  const rounded = Math.round(abs * 1000) / 1000;
  const intPart = Math.floor(rounded);

  let out = groupThousands(String(intPart));

  const frac = rounded - intPart;
  if (frac > 1e-9) {
    const fracStr = Math.round(frac * 1000).toString().padStart(3, '0').replace(/0+$/, '');
    if (fracStr) out += '.' + fracStr;
  }

  return neg ? '-' + out : out;
}
