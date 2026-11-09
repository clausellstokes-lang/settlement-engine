/**
 * domain/display/causeConjunctionContent.js — W2: THE CONJUNCTION CONTENT LADDER.
 *
 * The multiplication seam of the Phase 5 content architecture: every W-C5
 * lifecycle receipt carries a CONJUNCTION KEY {role, situation, causeClass,
 * lifecycleStage} (causeLifecycle.js makeEvent / the compromiseLifecycle stamp),
 * and this module resolves it to the MOST SPECIFIC authored line through a
 * four-rung selection ladder:
 *
 *   1. full  — (role × situation × causeClass × stage): FULL_CONTENT below, the
 *              hand-picked most dramatic conjunctions, covert/revealed split.
 *   2. role  — (role × causeClass × stage): causeConjunctionRoleContent.js, the
 *              Tier-1 table, total over the 12 built role archetypes.
 *   3. class — (causeClass × stage): causeConjunctionClassContent.js, role-slot
 *              lines serving unknown/future roles.
 *   4. floor — the UNCHANGED W-C5 generic template floor
 *              (causeLifecycleVocabulary.causeLifecyclePhrase), which also owns
 *              the age-band register (the years-past historicize voice).
 *
 * VARIANT SELECTION is a pure hash of (seedId, key): no rng stream, no Date,
 * byte-inert to the engine (FIRST-PAINT/GOLDEN laws — this module is imported
 * only by the lazy dossier NPC card, never by generation or the pulse kernel).
 * Two NPCs in one settlement with the same conjunction hash to different
 * variants through their distinct seed ids (anti-repetition).
 *
 * The situation dimension is deliberately sparse: rungs 2-3 are
 * situation-agnostic (one line serves covert and revealed where the read does
 * not change — the brief's rule), and only the full rung splits it.
 */

import {
  causeLifecyclePhrase, conjunctionKeyString, roleNoun, STAGE_BADGE,
} from './causeLifecycleVocabulary.js';
import { ROLE_CONTENT } from './causeConjunctionRoleContent.js';
import { drawDeclared, lineText } from '../facts/drawDeclared.js';
import { CLASS_CONTENT } from './causeConjunctionClassContent.js';

/** @typedef {{ role?: string, situation?: string, causeClass?: string, lifecycleStage?: string, ageBand?: string }} ConjunctionKeyLike */

/**
 * TIER-2 FULL-SPECIFICITY CONTENT — the dozen most dramatic conjunctions, each
 * split by situation where covert and revealed genuinely read differently
 * (covert = tells and dramatic irony; revealed = public reckoning). Keyed
 * content[role][situation][causeClass][stage].
 * @type {Readonly<Record<string, Record<string, Record<string, Record<string, ReadonlyArray<string>>>>>>}
 */
export const FULL_CONTENT = Object.freeze({
  military: {
    'compromised-covert': {
      underfunded: {
        attributed: [
          "The garrison's pay has run short for too many seasons, and the captain has quietly started taking outside coin to make up the muster. The men are paid, the gate watches bend, and no one has asked why yet.",
          'Watch the captain on pay day: the chest is light, the men are made whole anyway, and the difference walks in through a side door after dark. The garrison is bought and does not know it.',
        ],
      },
      captured: {
        attributed: [
          'The town thinks the captain is the law, but the underworld pays the captain. Raids that matter are sold before they march, and the only sign is how quiet certain streets stay.',
          "The watch still drills, patrols and salutes its captain, but every order that threatens the underworld dies between the captain's desk and the duty sergeant. No one has noticed yet.",
        ],
      },
    },
    'compromised-revealed': {
      captured: {
        'exposed-public': [
          "The town now knows the captain was the underworld's man. Every empty raid, stalled warrant and easy escape is laid at the captain's door, and the watch's own men are the angriest in the square.",
          'It is now known that the underworld ran the watch through its captain, and the town is asking whether anything the watch did was real.',
        ],
      },
    },
  },
  religious: {
    'compromised-covert': {
      'conduct-drift': {
        attributed: [
          'The priest still keeps the hours, blesses the harvest and hears confession, but serves another master. A dark patron rewards what happens after the candles are out, and the congregation does not know.',
          "The priest's sermons follow the doctrine and sound sincere, but the devotion behind them goes to a dark patron, who pays in quiet favors for the work done after dark.",
        ],
      },
      secularization: {
        historicized: [
          'The pews emptied when the faith went cold, and the priest found other ways to live. The pews are full again, but the priest has not given up those other ways.',
          'The faith came back to the town but not to its priest. What the priest took up while the altars stood empty goes on behind the restored rites, and the congregation does not see it.',
        ],
      },
    },
    'compromised-revealed': {
      'clergy-scandal': {
        'exposed-public': [
          'It is out that the priest took money from guilty brothers to keep their sins quiet, and the town is in no mood to forgive its clergy.',
          'It is now known that the priest made money from the scandal the pulpit preached against, and the congregation no longer listens to the priest on repentance.',
        ],
      },
    },
  },
  ruler: {
    'compromised-covert': {
      occupation: {
        attributed: [
          "The ruler's seal still stamps the town's decrees, and the occupier's clerk reads them first. The ruler keeps the seat by serving quietly, and the town takes the quiet for protection.",
          'The town believes its ruler shields it from the occupier. The requisition lists say otherwise: signed in the familiar hand, delivered on schedule, and the names on them chosen with care.',
        ],
      },
    },
    'compromised-revealed': {
      scandal: {
        'exposed-public': [
          'It is now known that the ruler sold pardons and bought prosecutions while the scandal was being judged, and the people who demanded the trials learn that the ruler profited from every one.',
          'It is out that the ruler, sworn to end the corruption, sold its verdicts instead. Everyone who watched the trials now knows the outcomes were bought.',
        ],
      },
    },
  },
  criminal: {
    'compromised-covert': {
      captured: {
        attributed: [
          "The crews think the boss runs this town, and the boss lets them think it. In truth the boss's books are checked every quarter by people from elsewhere.",
          "Every oath in the boss's outfit runs up to someone the crews have never seen. The boss runs the town like a steward runs an estate, for owners who have never visited.",
        ],
      },
    },
  },
  merchant: {
    'compromised-covert': {
      'trade-strangled': {
        attributed: [
          "The embargo ruined every honest house in town except the guildmaster's. The crates roll out on schedule, the customs stamps are perfect, and that is what gives it away.",
          'Ask the ruined merchants what they notice about the guildmaster: the warehouses stay full, the caravans stay moving, and the embargo that beggared everyone else seems to make way. No one has said the word smuggler aloud. Yet.',
        ],
      },
    },
  },
  healer: {
    'compromised-covert': {
      depleted: {
        attributed: [
          'The medicine chest is nearly empty, and the healer decides who gets what is left. The well-connected recover, the poor get colored water and a kind word, and some of them die.',
          "From the door the sickroom's two shelves look the same. One holds medicine and one holds colored water, and which a patient gets depends on the size of their purse.",
        ],
      },
    },
  },
  dissident: {
    'compromised-revealed': {
      occupation: {
        'exposed-public': [
          'It is out that the agitator sold every serious plan to the occupier before it could happen, and the movement is breaking apart over it.',
          'It is now known why the occupier let this one resistance survive: the agitator who led it reported to them. The survivors of the failed nights now know who sold them.',
        ],
      },
    },
  },
});

/** FNV-1a 32-bit — the pure variant-selection hash (no rng, no Date).
 *  @param {string} str */
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Normalize a conjunction key to the same defaults conjunctionKeyString uses.
 *  @param {ConjunctionKeyLike|null|undefined} key */
function normalizeKey(key) {
  const k = key || {};
  return {
    role: String(k.role || 'civic'),
    situation: String(k.situation || 'compromised-covert'),
    causeClass: String(k.causeClass || 'unknown'),
    lifecycleStage: String(k.lifecycleStage || 'attributed'),
    ageBand: k.ageBand ? String(k.ageBand) : undefined,
  };
}

/**
 * Resolve a conjunction key to its ladder rung WITHOUT selecting a variant:
 * the authored variant list and the tier it was found at, or the floor tier
 * with no list. Exported for the coverage test (tier distribution).
 * @param {ConjunctionKeyLike|null|undefined} key
 * @returns {{ tier: 'full'|'role'|'class'|'floor', variants: ReadonlyArray<string>|null }}
 */
export function conjunctionVariantsFor(key) {
  const k = normalizeKey(key);
  const full = FULL_CONTENT[k.role]?.[k.situation]?.[k.causeClass]?.[k.lifecycleStage];
  if (Array.isArray(full) && full.length) return { tier: 'full', variants: full };
  const role = ROLE_CONTENT[k.role]?.[k.causeClass]?.[k.lifecycleStage];
  if (Array.isArray(role) && role.length) return { tier: 'role', variants: role };
  const cls = CLASS_CONTENT[k.causeClass]?.[k.lifecycleStage];
  if (Array.isArray(cls) && cls.length) return { tier: 'class', variants: cls };
  return { tier: 'floor', variants: null };
}

/**
 * THE LADDER — resolve a conjunction key + seed to one speakable line.
 * Deterministic: same (key, seedId) always yields the same line; distinct
 * seeds (npc ids) prefer distinct variants. The floor rung is the UNCHANGED
 * W-C5 template floor and keeps its own age-band register.
 * @param {ConjunctionKeyLike|null|undefined} key
 * @param {string|number|null|undefined} seedId  npc/settlement id (variant seed)
 * @param {object|null|(() => object|null)} [facts] `factsOf(settlement)` (or a thunk): answers a
 *   declared line (CENSUS-1d unit 2, Appendix B rows 101–102: the modulus over the FULL ladder
 *   rung, resolved through `drawDeclared`); none = a declared line is refused (fail-closed)
 * @returns {{ line: string, tier: 'full'|'role'|'class'|'floor' }}
 */
export function conjunctionContent(key, seedId, facts = null) {
  const k = normalizeKey(key);
  const { tier, variants } = conjunctionVariantsFor(k);
  const keyStr = conjunctionKeyString({
    role: k.role, situation: k.situation, causeClass: k.causeClass, lifecycleStage: k.lifecycleStage,
  });
  const h = fnv1a32(`${String(seedId ?? '')}::${keyStr}`);
  if (!variants) {
    // Floor: the existing generic template floor, hash-seeded into its own
    // variant space so the last rung anti-repeats too.
    return {
      line: causeLifecyclePhrase({
        stage: k.lifecycleStage, causeClass: k.causeClass, role: k.role,
        ageBand: k.ageBand, variant: h % 3,
      }, facts),
      tier: 'floor',
    };
  }
  const drawn = drawDeclared(variants, {
    draw: (p) => p[h % p.length], facts, key: `${String(seedId ?? '')}::${keyStr}`,
    poolId: `CAUSE_CONJUNCTION.${tier}.${keyStr}`, surface: 'npcs', drawKind: 'H',
  });
  const line = String(lineText(drawn.line) ?? '')
    .replace(/\{role\}/g, roleNoun(k.role));
  return { line, tier };
}

/**
 * The dossier NPC-card read-model for a stamped compromise lifecycle — the W2
 * consumption seam. Same shape as causeLifecycleVocabulary's
 * describeCompromiseLifecycle (badge + tone + phrase + conjunctionKey), with
 * the phrase resolved through the ladder instead of the floor alone, plus the
 * rung it resolved at. Returns null for an absent/empty stamp.
 * @param {{ stage?: string, causeClass?: string, role?: string, situation?: string, ageBand?: string }|null|undefined} stamp  npc.compromiseLifecycle
 * @param {string|number|null|undefined} seedId  stable npc id (variant seed)
 * @param {object|null|(() => object|null)} [facts] `factsOf(settlement)` (or a thunk)
 * @returns {{ badge: string|null, tone: string, phrase: string, tier: string, conjunctionKey: object }|null}
 */
export function describeCompromiseConjunction(stamp, seedId, facts = null) {
  if (!stamp || !stamp.stage || !stamp.causeClass) return null;
  const badge = STAGE_BADGE[stamp.stage] || STAGE_BADGE.attributed;
  const key = {
    role: stamp.role || 'civic',
    situation: stamp.situation || 'compromised-covert',
    causeClass: stamp.causeClass,
    lifecycleStage: stamp.stage,
    ageBand: stamp.ageBand,
  };
  const { line, tier } = conjunctionContent(key, seedId, facts);
  return {
    badge: badge.label,
    tone: badge.tone,
    phrase: line,
    tier,
    conjunctionKey: {
      role: key.role, situation: key.situation,
      causeClass: key.causeClass, lifecycleStage: key.lifecycleStage,
    },
  };
}
