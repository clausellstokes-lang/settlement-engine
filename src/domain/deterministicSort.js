/**
 * deterministicSort.js — the determinism-critical string comparator.
 *
 * WHY THIS EXISTS: SettlementForge's core contract is that the SAME seed
 * produces the SAME settlement on every device AND in every locale. A bare
 * `String.prototype.localeCompare` breaks that contract: it collates through
 * the host's ICU/CLDR tables, so 'Åby' vs 'Zurich' (and every accented,
 * cased, or non-ASCII pair) can order DIFFERENTLY across machines, OS builds,
 * and locale settings. Any sort that feeds an rng draw order, or that lands in
 * persisted/replayed output, must therefore NEVER use localeCompare.
 *
 * `compareCodepoint` orders by JavaScript's built-in string relational
 * operators, which compare by UTF-16 code unit — a fixed, table-free,
 * cross-device-STABLE total order. It is the ONLY string order safe to feed
 * the seeded pipeline. This is deliberately the sole sanctioned string
 * comparator for src/generators/** and src/domain/**; the determinism lint
 * guard in eslint.config.js bans localeCompare in those trees and points here.
 *
 * Pure, dependency-free (domain-kernel style): no imports, no rng, no clock.
 */

// Codepoint (UTF-16 code-unit) order. Nullish coerces to '' so mixed/absent
// keys never throw and always sort deterministically.
export const compareCodepoint = (a, b) => {
  const x = String(a ?? '');
  const y = String(b ?? '');
  return x < y ? -1 : x > y ? 1 : 0;
};

// Convenience comparator for the common `{ name }` shape.
export const byNameCodepoint = (a, b) => compareCodepoint(a?.name, b?.name);
