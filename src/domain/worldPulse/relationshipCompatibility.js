/**
 * domain/worldPulse/relationshipCompatibility.js — relationship-compatibility
 * overlay model (Phase B0, proposal §5).
 *
 * THE PROBLEM IT ENCODES: today a regional edge carries ONE exclusive
 * `relationshipType` (neutral / trade_partner / allied / patron / client /
 * vassal / rival / cold_war / hostile / criminal_network) while the 13 channel
 * types layer underneath it. There is no rule for WHICH secondary
 * relationship-channels may legitimately coexist with a given primary label.
 * That lets incoherent states arise — e.g. two settlements at active war that
 * also carry a "normal trade" channel, which makes no sense.
 *
 * THIS MODEL is the COMPATIBILITY MATRIX over (primary relationshipType ×
 * secondary relationship-channel/status). It is PURE DATA + LOGIC — it does NOT
 * mutate edges or candidate generation (B4 consumes it). It answers three
 * questions:
 *
 *   isCompatible(primary, secondary, { covert, forced, mediated, temporary })
 *     — may this secondary status coexist with this primary label, given any
 *       exception channels in play?
 *   allowedSecondaries(primary)
 *     — the set of secondary statuses that are unconditionally compatible.
 *   validateRelationship(primary, secondaries[])
 *     — flag every incoherent combination on an edge.
 *
 * THE CORE §5 RULES:
 *   - rivals who trade: OK              (rival + trade_partner / preferred_supplier …)
 *   - allies who trade: OK             (allied + trade_partner / military_supplier …)
 *   - battlefield enemies as NORMAL trade: NOT OK
 *       (hostile / active siege / embargo + normal trade is forbidden)
 *     …EXCEPT through the covert / forced / mediated / temporary channels the
 *     proposal lists: smuggling (covert), forced_tribute (forced), mediated
 *     commerce (mediated), ceasefire_commerce (temporary).
 *
 * DETERMINISM: pure functions of their arguments. No I/O, no rng, no clock.
 * MOUNTED NOWHERE in B0 — no pulse path imports it. Strict-clean.
 */

// ── Primary relationship vocabulary (the 10 canonical labels) ────────────────
// Mirrors RELATIONSHIP_DEFAULTS / HOSTILITY_RANK in relationshipEvolution.js.
export const PRIMARY_RELATIONSHIP_TYPES = Object.freeze([
  'neutral',
  'trade_partner',
  'allied',
  'patron',
  'client',
  'vassal',
  'rival',
  'cold_war',
  'hostile',
  'criminal_network',
]);

// ── Secondary-relationship-status vocabulary (frozen registry) ───────────────
// The proposal §5 "secondary status" list. Each entry declares its CATEGORY
// (what kind of tie it is) and whether it is an EXCEPTION channel (only valid
// with a hostile primary when the matching exception flag is set). `commerceLike`
// marks the statuses that count as "trade" for the battlefield-enemy rule.
//
// id → descriptor. Frozen so consumers can iterate the canonical set.
export const SECONDARY_RELATIONSHIP_STATUSES = Object.freeze({
  // Trade / supply ties (commerce-like)
  trade_partner:        { category: 'commerce',  commerceLike: true,  exception: null,       label: 'Trade partner' },
  preferred_supplier:   { category: 'commerce',  commerceLike: true,  exception: null,       label: 'Preferred supplier' },
  critical_supplier:    { category: 'commerce',  commerceLike: true,  exception: null,       label: 'Critical supplier' },
  military_supplier:    { category: 'commerce',  commerceLike: true,  exception: null,       label: 'Military supplier' },
  // Hierarchy / dependence ties
  client:               { category: 'hierarchy', commerceLike: false, exception: null,       label: 'Client' },
  patron:               { category: 'hierarchy', commerceLike: false, exception: null,       label: 'Patron' },
  creditor:             { category: 'finance',   commerceLike: false, exception: null,       label: 'Creditor' },
  debtor:               { category: 'finance',   commerceLike: false, exception: null,       label: 'Debtor' },
  tribute:              { category: 'hierarchy', commerceLike: false, exception: null,       label: 'Tribute' },
  // Coercive / hostile ties
  embargo:              { category: 'coercive',  commerceLike: false, exception: null,       label: 'Embargo' },
  sanctioned:           { category: 'coercive',  commerceLike: false, exception: null,       label: 'Sanctioned' },
  proxy:                { category: 'coercive',  commerceLike: false, exception: null,       label: 'Proxy conflict' },
  // EXCEPTION channels — the only commerce-like ties allowed under a hostile
  // primary, each gated by its matching exception flag.
  smuggling:            { category: 'commerce',  commerceLike: true,  exception: 'covert',    label: 'Smuggling' },
  forced_tribute:       { category: 'commerce',  commerceLike: true,  exception: 'forced',    label: 'Forced tribute' },
  mediated_commerce:    { category: 'commerce',  commerceLike: true,  exception: 'mediated',  label: 'Mediated commerce' },
  ceasefire_commerce:   { category: 'commerce',  commerceLike: true,  exception: 'temporary', label: 'Ceasefire commerce' },
});

export const SECONDARY_STATUS_IDS = Object.freeze(Object.keys(SECONDARY_RELATIONSHIP_STATUSES));

// The exception flags the proposal recognizes — the ONLY routes by which a
// commerce-like tie may coexist with a battlefield enemy.
export const EXCEPTION_FLAGS = Object.freeze(['covert', 'forced', 'mediated', 'temporary']);

// Primaries that mean "battlefield enemy / embargoed" — normal commerce is
// forbidden between them; only the exception channels above are valid.
const BATTLEFIELD_PRIMARIES = new Set(['hostile']);
// Primaries that are adversarial but NOT open warfare — they MAY carry normal
// commerce (rivals who trade, a cold-war back channel) per §5.
const ADVERSARIAL_PRIMARIES = new Set(['rival', 'cold_war']);

// ── Per-primary allowed secondary sets ───────────────────────────────────────
// What secondary statuses are UNCONDITIONALLY compatible with each primary
// (no exception flag needed). Battlefield primaries (hostile) get NO commerce
// here — their commerce comes only through isCompatible's exception path.
const ALLOWED_SECONDARIES = Object.freeze({
  neutral: ['trade_partner', 'preferred_supplier', 'critical_supplier', 'creditor', 'debtor'],
  trade_partner: ['preferred_supplier', 'critical_supplier', 'military_supplier', 'creditor', 'debtor', 'client', 'patron'],
  allied: ['trade_partner', 'preferred_supplier', 'critical_supplier', 'military_supplier', 'creditor', 'debtor', 'client', 'patron'],
  patron: ['trade_partner', 'preferred_supplier', 'critical_supplier', 'military_supplier', 'tribute', 'creditor', 'client'],
  client: ['trade_partner', 'preferred_supplier', 'critical_supplier', 'tribute', 'debtor', 'patron'],
  vassal: ['trade_partner', 'preferred_supplier', 'critical_supplier', 'military_supplier', 'tribute', 'debtor', 'patron'],
  // Rivals & cold-war: §5's "rivals who trade" — commerce is allowed, but the
  // relationship colors it (embargo / sanctioned / proxy coexist too).
  rival: ['trade_partner', 'preferred_supplier', 'critical_supplier', 'embargo', 'sanctioned', 'proxy', 'creditor', 'debtor'],
  cold_war: ['trade_partner', 'preferred_supplier', 'critical_supplier', 'embargo', 'sanctioned', 'proxy', 'creditor', 'debtor'],
  // Hostile: NO normal commerce. Only coercive/proxy ties are unconditional;
  // commerce requires an exception channel via isCompatible.
  hostile: ['embargo', 'sanctioned', 'proxy', 'tribute'],
  // Criminal network: smuggling is its native mode, plus the gray-market ties.
  criminal_network: ['smuggling', 'trade_partner', 'preferred_supplier', 'creditor', 'debtor', 'proxy'],
});

const norm = (/** @type {any} */ v) => String(v || '').trim().toLowerCase();

/**
 * The set of secondary statuses UNCONDITIONALLY compatible with `primary`
 * (without any exception flag). Unknown primary → empty list.
 *
 * @param {string} primary
 * @returns {string[]}
 */
export function allowedSecondaries(primary) {
  const list = /** @type {Record<string, string[]>} */ (ALLOWED_SECONDARIES)[norm(primary)];
  return Array.isArray(list) ? [...list] : [];
}

/**
 * May `secondary` coexist with `primary`, given the exception channels in play?
 *
 * The decision:
 *   1. Unknown primary or secondary → false (not in the registry = not coherent).
 *   2. If `secondary` is in the primary's unconditional allow-list → true.
 *   3. If `secondary` is an EXCEPTION channel (smuggling / forced_tribute /
 *      mediated_commerce / ceasefire_commerce), it is compatible with a
 *      BATTLEFIELD primary (hostile) ONLY when its matching exception flag is set.
 *   4. A commerce-like secondary with a battlefield primary and NO exception flag
 *      → false (the "battlefield enemies as normal trade is NOT OK" rule).
 *   5. Otherwise → false.
 *
 * @param {string} primary
 * @param {string} secondary
 * @param {{ covert?: boolean, forced?: boolean, mediated?: boolean, temporary?: boolean }} [exceptions]
 * @returns {boolean}
 */
export function isCompatible(primary, secondary, exceptions = {}) {
  const p = norm(primary);
  const sec = norm(secondary);
  const descriptor = /** @type {Record<string, any>} */ (SECONDARY_RELATIONSHIP_STATUSES)[sec];
  if (!PRIMARY_RELATIONSHIP_TYPES.includes(p) || !descriptor) return false;

  // 2 — unconditional allow.
  if (allowedSecondaries(p).includes(sec)) return true;

  // 3 — exception channels: valid only under a battlefield primary with the flag.
  if (descriptor.exception) {
    if (!BATTLEFIELD_PRIMARIES.has(p)) {
      // An exception channel under a non-battlefield primary: smuggling under a
      // neutral/trade primary is incoherent (use the normal commerce tie). The
      // criminal_network primary lists smuggling unconditionally (handled by 2).
      return false;
    }
    return exceptions[/** @type {'covert'|'forced'|'mediated'|'temporary'} */ (descriptor.exception)] === true;
  }

  // 4 — battlefield primary + commerce-like normal tie, no exception ⇒ forbidden.
  if (BATTLEFIELD_PRIMARIES.has(p) && descriptor.commerceLike) return false;

  return false;
}

/**
 * @typedef {Object} CompatibilityIssue
 * @property {string} primary
 * @property {string} secondary
 * @property {string} code     'unknown_primary' | 'unknown_secondary' | 'incompatible'
 *                             | 'commerce_with_battlefield_enemy' | 'orphan_exception'
 * @property {string} reason   Human-readable explanation.
 */

/**
 * Validate a full edge: a primary label plus its layered secondary statuses.
 * Flags every incoherent combination. A clean edge returns { ok: true, issues: [] }.
 *
 * Each secondary may be a bare status id (string) or an object
 * `{ status, covert?, forced?, mediated?, temporary? }` carrying its own
 * exception flags.
 *
 * @param {string} primary
 * @param {Array<string | { status: string, covert?: boolean, forced?: boolean, mediated?: boolean, temporary?: boolean }>} secondaries
 * @returns {{ ok: boolean, issues: CompatibilityIssue[] }}
 */
export function validateRelationship(primary, secondaries = []) {
  /** @type {CompatibilityIssue[]} */
  const issues = [];
  const p = norm(primary);
  if (!PRIMARY_RELATIONSHIP_TYPES.includes(p)) {
    issues.push({ primary: p, secondary: '', code: 'unknown_primary', reason: `'${primary}' is not a canonical relationship type.` });
    return { ok: false, issues };
  }
  for (const raw of Array.isArray(secondaries) ? secondaries : []) {
    const entry = typeof raw === 'string' ? { status: raw } : (raw || { status: '' });
    const sec = norm(entry.status);
    const descriptor = /** @type {Record<string, any>} */ (SECONDARY_RELATIONSHIP_STATUSES)[sec];
    if (!descriptor) {
      issues.push({ primary: p, secondary: sec, code: 'unknown_secondary', reason: `'${entry.status}' is not a known secondary status.` });
      continue;
    }
    const exceptions = {
      covert: entry.covert === true,
      forced: entry.forced === true,
      mediated: entry.mediated === true,
      temporary: entry.temporary === true,
    };
    if (isCompatible(p, sec, exceptions)) continue;

    // Classify WHY it failed for a useful message.
    if (descriptor.exception && !exceptions[/** @type {'covert'|'forced'|'mediated'|'temporary'} */ (descriptor.exception)]) {
      issues.push({
        primary: p, secondary: sec, code: 'orphan_exception',
        reason: `'${descriptor.label}' requires the '${descriptor.exception}' channel to be active.`,
      });
    } else if (BATTLEFIELD_PRIMARIES.has(p) && descriptor.commerceLike) {
      issues.push({
        primary: p, secondary: sec, code: 'commerce_with_battlefield_enemy',
        reason: `Normal commerce ('${descriptor.label}') cannot coexist with an active '${p}' relationship — only smuggling, forced tribute, mediated, or ceasefire commerce can.`,
      });
    } else {
      issues.push({
        primary: p, secondary: sec, code: 'incompatible',
        reason: `'${descriptor.label}' is not compatible with a '${p}' relationship.`,
      });
    }
  }
  return { ok: issues.length === 0, issues };
}

/**
 * Is this an adversarial-but-trading primary (rival / cold_war)? Convenience for B4.
 * @param {string} primary
 * @returns {boolean}
 */
export function isAdversarialTradingPrimary(primary) {
  return ADVERSARIAL_PRIMARIES.has(norm(primary));
}

/**
 * Is this a battlefield primary (active warfare; only exception commerce allowed)?
 * @param {string} primary
 * @returns {boolean}
 */
export function isBattlefieldPrimary(primary) {
  return BATTLEFIELD_PRIMARIES.has(norm(primary));
}
