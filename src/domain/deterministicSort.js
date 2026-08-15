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
/** @type {(a: unknown, b: unknown) => number} */
export const compareCodepoint = (a, b) => {
  const x = String(a ?? '');
  const y = String(b ?? '');
  return x < y ? -1 : x > y ? 1 : 0;
};

// Convenience comparator for the common `{ name }` shape.
/** @type {(a: {name?: unknown} | null | undefined, b: {name?: unknown} | null | undefined) => number} */
export const byNameCodepoint = (a, b) => compareCodepoint(a?.name, b?.name);

/**
 * Stable order for custom-registry entries whose display name is explicitly
 * presentation-only. Current entries carry `refId`; older projections may
 * expose only one of the raw persistence identities. Name is the final legacy
 * fallback because an unstamped row has no stronger rename-stable key.
 *
 * This comparator is required anywhere iteration order feeds seeded draws. A
 * name sort would make a cosmetic rename move the row to another RNG slot and
 * thereby change unrelated native institutions, services, or resources.
 *
 * @param {{refId?:unknown,name?:unknown,raw?:Record<string,unknown>} | null | undefined} value
 * @returns {unknown}
 */
function customIdentityKey(value) {
  return value?.refId
    ?? value?.raw?.definitionId
    ?? value?.raw?.localUid
    ?? value?.raw?.id
    ?? value?.name;
}

/** @type {(
 *   a: Parameters<typeof customIdentityKey>[0],
 *   b: Parameters<typeof customIdentityKey>[0],
 * ) => number} */
export const byCustomIdentityCodepoint = (a, b) => (
  compareCodepoint(customIdentityKey(a), customIdentityKey(b))
);
