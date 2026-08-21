/**
 * domain/display/causeLifecycleVocabulary.js — W-C5: the GENERIC CONTENT FLOOR for
 * the cause-resolution lifecycle. The side-car pattern (institutionVocabulary.js):
 * a PURE HEADLESS LEAF (imports only the shared ageBands helper), read only by the
 * lazy dossier card — so generation NEVER imports it and adding to it is byte-inert
 * to every golden.
 *
 * THE CONTRACT (WC5 brief §6). Every lifecycle event carries a CONJUNCTION KEY —
 * {role, situation, causeClass, lifecycleStage}. W2 authors SPECIFIC
 * role×situation×cause lines against that key; THIS file is the generic FLOOR so no
 * surface ever renders empty. It covers every lifecycleStage × causeClass
 * generically (compositionally: a per-STAGE template with a {cause}/{role} slot ×
 * a per-CAUSE mechanism phrase → 2-3 variants each), and the temporal register
 * (age band) tunes the historicize voice ("the lean years" only at years-past — the
 * constitution's PIN, read through the shared ageBands helper).
 *
 * The lifecycleStage vocabulary is CLOSED: attributed, re-caused, reformed,
 * historicized, exposed-public, re-adjudicated.
 */

import { HISTORICIZE_BAND } from '../ageBands.js';

/** The closed lifecycle-stage vocabulary (the conjunction key's fourth dimension). */
export const LIFECYCLE_STAGES = Object.freeze([
  'attributed', 're-caused', 'reformed', 'historicized', 'exposed-public', 're-adjudicated',
]);

/** The 14 cause classes (mirrors causeVocabulary.CAUSE_CLASS_IDS; pinned equal by
 *  tests/domain/causeLifecycleVocabulary.test.js so the floor can never orphan a class). */
export const FLOOR_CAUSE_CLASSES = Object.freeze([
  'underfunded', 'chain-starved', 'depleted', 'trade-strangled',
  'levied-away', 'garrison-drained', 'siege-scarred', 'occupation',
  'conduct-drift', 'conversion-pressure', 'secularization', 'clergy-scandal',
  'captured', 'scandal',
]);

/** Per-cause MECHANISM phrase (the {cause} slot). Generic, settlement-agnostic,
 *  names the mechanism structurally. @type {Readonly<Record<string, string>>} */
export const CAUSE_MECHANISM_PHRASE = Object.freeze({
  underfunded: 'the coin ran short',
  'chain-starved': 'the supply lines failed',
  depleted: 'the stores ran dry',
  'trade-strangled': 'the trade was choked off',
  'levied-away': 'the strength was levied away to war',
  'garrison-drained': 'the garrison was hollowed out',
  'siege-scarred': 'the war pressed in',
  occupation: 'an occupier held the town',
  'conduct-drift': 'a patron rewarded the deed',
  'conversion-pressure': 'a rival faith pressed in',
  secularization: 'the faith went cold',
  'clergy-scandal': 'the priesthood was tainted',
  captured: 'the underworld held the office',
  scandal: 'a corruption scandal broke',
});

/** Per-stage TEMPLATES with a {cause} and/or {role} slot — 2-3 generic variants
 *  each. @type {Readonly<Record<string, ReadonlyArray<string>>>} */
export const STAGE_TEMPLATES = Object.freeze({
  attributed: [
    'This {role} is compromised, and the root of it is that {cause}.',
    'The compromise here traces back to one thing: {cause}.',
    'What turned this {role} was that {cause}.',
  ],
  're-caused': [
    'The old pressure eased, but the habit found a new home: now {cause}, and it sustains the arrangement.',
    'Need became appetite. The compromise re-formed around a new reason: {cause}.',
    'One cause closed and another opened; {cause}, and the {role} carries on.',
  ],
  reformed: [
    'The pressure lifted and the {role} came clean; the compromise is over.',
    'With the cause resolved, this {role} reformed. The arrangement is finished.',
    'Sole-cause corruption, ended: the reason passed, and so did the compromise.',
  ],
  historicized: [
    'The compromise persists, but its origin is past now — {cause}, once, and the habit outlived the reason.',
    'What began when {cause} endures out of habit; the ledger never closed.',
    'The originating cause is history now; the corruption carries on regardless.',
  ],
  'exposed-public': [
    'The compromise is public now — {cause} was only the beginning; this is a scandal.',
    'Once covert, now revealed: the arrangement that began when {cause} has broken into the open.',
    'The quiet is over. What started when {cause} is a public reckoning.',
  ],
  're-adjudicated': [
    'The paymaster is gone; the compromise was re-judged from scratch, and now {cause}.',
    'With the sustaining institution destroyed, the arrangement re-formed on a new footing: {cause}.',
    'The old infrastructure fell, and the compromise was re-adjudicated around {cause}.',
  ],
});

/** The register-tuned historicize voice for the YEARS-PAST band (the constitution's
 *  PIN: "the lean years" language is impossible below years-past). */
const HISTORICIZE_YEARS_PAST = Object.freeze([
  'It began in the lean years — {cause} — and though that is long past, the habit endures. The ledger never closed.',
  'Years ago, {cause}. The reason is history; the corruption is not.',
]);

/** Per-stage short BADGE label + tone for the dossier marker. `null` badge = the
 *  bearer reads clean (reformed drops the tag before display).
 *  @type {Readonly<Record<string, { label: string|null, tone: string }>>} */
export const STAGE_BADGE = Object.freeze({
  attributed:       { label: 'Compromised', tone: 'danger' },
  're-caused':      { label: 'Compromised', tone: 'danger' },
  reformed:         { label: null,          tone: 'clear' },
  historicized:     { label: 'Longstanding', tone: 'muted' },
  'exposed-public': { label: 'Exposed',     tone: 'exposed' },
  're-adjudicated': { label: 'Compromised', tone: 'danger' },
});

/** Role archetype id → a generic role NOUN for the {role} slot. Fallback humanizes
 *  the id. @type {Readonly<Record<string, string>>} */
const ROLE_LABEL = Object.freeze({
  military: 'captain', ruler: 'ruler', heir: 'claimant', merchant: 'guildmaster',
  religious: 'priest', criminal: 'boss', arcane: 'adept', civic: 'official',
  healer: 'healer', labor_resource: 'foreman', diplomat_outsider: 'envoy', dissident: 'agitator',
});

/** @param {string|null|undefined} role */
export function roleNoun(role) {
  const r = String(role || '').trim();
  return ROLE_LABEL[r] || (r ? r.replace(/_/g, ' ') : 'official');
}

/** A stable, deterministic variant index for a conjunction (so the floor is
 *  reproducible across renders). @param {string} key @param {number} n */
function variantIndex(key, n) {
  if (n <= 1) return 0;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % n;
}

/**
 * The GENERIC FLOOR phrase for a lifecycle conjunction. Never empty for any
 * stage × causeClass. `ageBand` (an ageBands id) tunes the historicize register.
 * `variant` (0-based) selects a specific variant; omit for the deterministic default.
 *
 * @param {{ stage?: string, causeClass?: string, role?: string, ageBand?: string, variant?: number }} [key]
 * @returns {string}
 */
export function causeLifecyclePhrase({ stage, causeClass, role, ageBand, variant } = {}) {
  const st = String(stage || '');
  const cc = String(causeClass || '');
  const cause = CAUSE_MECHANISM_PHRASE[cc] || (cc ? cc.replace(/-/g, ' ') : 'the pressure');
  let templates = STAGE_TEMPLATES[st];
  if (st === 'historicized' && ageBand === HISTORICIZE_BAND) templates = HISTORICIZE_YEARS_PAST;
  if (!templates || !templates.length) {
    // Defensive floor-of-the-floor: an unknown stage still renders something honest.
    return `This ${roleNoun(role)}'s compromise (${st || 'active'}) roots in ${cause}.`;
  }
  const idx = Number.isInteger(variant)
    ? ((/** @type {number} */ (variant) % templates.length) + templates.length) % templates.length
    : variantIndex(`${st}|${cc}|${role || ''}`, templates.length);
  return templates[idx].replace(/\{cause\}/g, cause).replace(/\{role\}/g, roleNoun(role));
}

/**
 * The dossier read-model for a stamped compromise lifecycle. Feeds the NPC card:
 * a badge (or none, when reformed/clean) + the generic floor phrase. Returns null
 * for an absent/empty stamp.
 * @param {{ stage?: string, causeClass?: string, role?: string, situation?: string, ageBand?: string }|null|undefined} stamp  npc.compromiseLifecycle
 * @returns {{ badge: string|null, tone: string, phrase: string, conjunctionKey: object }|null}
 */
export function describeCompromiseLifecycle(stamp) {
  if (!stamp || !stamp.stage || !stamp.causeClass) return null;
  const badge = STAGE_BADGE[stamp.stage] || STAGE_BADGE.attributed;
  return {
    badge: badge.label,
    tone: badge.tone,
    phrase: causeLifecyclePhrase({
      stage: stamp.stage, causeClass: stamp.causeClass, role: stamp.role, ageBand: stamp.ageBand,
    }),
    conjunctionKey: {
      role: stamp.role || 'civic',
      situation: stamp.situation || 'compromised-covert',
      causeClass: stamp.causeClass,
      lifecycleStage: stamp.stage,
    },
  };
}

/** Serialize a conjunction key to the stable string W2 keys content off.
 *  @param {{ role?: string, situation?: string, causeClass?: string, lifecycleStage?: string }|null|undefined} key */
export function conjunctionKeyString(key) {
  const k = key || {};
  return [k.role || 'civic', k.situation || 'compromised-covert', k.causeClass || 'unknown', k.lifecycleStage || 'attributed'].join('|');
}
