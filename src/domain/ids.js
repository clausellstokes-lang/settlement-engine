/**
 * domain/ids.js — canonical entity-id helpers.
 *
 * SINGLE SOURCE for deriving stable, rename-safe entity ids from display names.
 * This was previously copy-pasted byte-identically into 15 modules. Cross-module
 * joins depend on the id being computed IDENTICALLY on both sides — e.g.
 * explanation.explainFaction builds `faction.${snakeCase(name)}` to match the id
 * factionProfile mints — so any drift between copies would silently return an
 * empty envelope with no error. Importing from here makes divergence impossible.
 *
 * @param {string} s
 * @returns {string}
 */
export function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}
