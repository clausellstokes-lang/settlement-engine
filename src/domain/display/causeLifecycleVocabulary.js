/**
 * domain/display/causeLifecycleVocabulary.js — W-C5: the GENERIC CONTENT FLOOR for
 * the cause-resolution lifecycle. The side-car pattern (institutionVocabulary.js):
 * a PURE HEADLESS LEAF (imports only the shared ageBands helper and, since CENSUS-1d, the
 * one draw function `facts/drawDeclared.js`, itself pure), read only by the lazy dossier card —
 * so generation NEVER imports it and adding to it is byte-inert to every golden.
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
import { drawDeclared, lineText } from '../facts/drawDeclared.js';

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
    'The first reason passed, but then {cause}, and the {role} kept on dealing.',
    'The first reason passed, but then {cause}, and that gave the {role} a new reason to carry on.',
    'The {role} might have stopped when the first trouble ended, but then {cause}, and the dealing went on.',
  ],
  reformed: [
    'The pressure lifted and the {role} came clean; the compromise is over.',
    'Once the trouble ended, this {role} stopped dealing and came clean.',
    'The reason passed, and the dealing stopped with it.',
  ],
  historicized: [
    'It began when {cause}. That trouble is over, but the {role} has not stopped.',
    'That trouble has passed, but what began when {cause} goes on.',
    'Whatever started it is over, but the {role} carries on dealing all the same.',
  ],
  'exposed-public': [
    'It is public now: it began when {cause}, and now everyone knows.',
    'What began when {cause} is out in the open now, and people are talking.',
    'It is out: what started when {cause} is common talk now.',
  ],
  're-adjudicated': [
    'Whoever paid the {role} before is gone, but by then {cause}, and the dealing went on.',
    'Whoever kept the {role} paid was destroyed, but by then {cause}, and that gave the dealing a new reason.',
    'The deal lost the one who paid for it, but by then {cause}, and it carried on.',
  ],
});

/** The register-tuned historicize voice for the YEARS-PAST band (the constitution's
 *  PIN: "the lean years" language is impossible below years-past). */
const HISTORICIZE_YEARS_PAST = Object.freeze([
  'It began in the lean years, when {cause}. That is long past, but the {role} has kept at it.',
  'Years ago, {cause}. That trouble is over, but the dealing still goes on.',
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
 * ⭐ CENSUS-1d unit 2 (Appendix B row 102, kind H): the template index is drawn over the FULL
 * stage pool exactly as before and resolved through `drawDeclared` (noted as
 * `CAUSE_LIFECYCLE.<stage>` / `CAUSE_LIFECYCLE.historicize-years-past`); `facts` answers a
 * declared template, none = a declared template is refused (fail-closed).
 * @param {{ stage?: string, causeClass?: string, role?: string, ageBand?: string, variant?: number }} [key]
 * @param {object|null|(() => object|null)} [facts]
 * @returns {string}
 */
export function causeLifecyclePhrase({ stage, causeClass, role, ageBand, variant } = {}, facts = null) {
  const st = String(stage || '');
  const cc = String(causeClass || '');
  const cause = CAUSE_MECHANISM_PHRASE[cc] || (cc ? cc.replace(/-/g, ' ') : 'the pressure');
  let templates = STAGE_TEMPLATES[st];
  let poolId = `CAUSE_LIFECYCLE.${st}`;
  if (st === 'historicized' && ageBand === HISTORICIZE_BAND) { templates = HISTORICIZE_YEARS_PAST; poolId = 'CAUSE_LIFECYCLE.historicize-years-past'; }
  if (!templates || !templates.length) {
    // Defensive floor-of-the-floor: an unknown stage still renders something honest.
    return `This ${roleNoun(role)} is compromised, and it began when ${cause}.`;
  }
  const drawn = drawDeclared(templates, {
    draw: (p) => p[Number.isInteger(variant)
      ? ((/** @type {number} */ (variant) % p.length) + p.length) % p.length
      : variantIndex(`${st}|${cc}|${role || ''}`, p.length)],
    facts, key: `${st}|${cc}|${role || ''}`, poolId, surface: 'npcs', drawKind: 'H',
  });
  return String(lineText(drawn.line) ?? '').replace(/\{cause\}/g, cause).replace(/\{role\}/g, roleNoun(role));
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
