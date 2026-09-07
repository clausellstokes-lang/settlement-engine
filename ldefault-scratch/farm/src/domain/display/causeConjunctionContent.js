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
          "The garrison's pay has run short too many seasons, and the captain has quietly started taking a merchant house's coin to cover the muster; the men are paid, the gate rota bends, and nobody asks the right question yet.",
          'Watch the captain on pay day: the chest is light, the men are made whole anyway, and the difference walks in through a side door after dark. The garrison is bought and does not know it.',
        ],
      },
      captured: {
        attributed: [
          'To the town the captain is the law; to the syndicate the captain is a line item. The raids that matter are sold before they march, and the only tell is how calm certain streets stay.',
          "The watch still drills, still patrols, still salutes its captain, and every order that threatens the syndicate dies between the captain's desk and the duty sergeant. No one has noticed the pattern. Someone will.",
        ],
      },
    },
    'compromised-revealed': {
      captured: {
        'exposed-public': [
          "The town now knows what the syndicate always did: the captain was theirs. Every empty raid, every stalled warrant, every convenient escape has an author now, and the watch's own men are the angriest in the square.",
          'The capture of the watch is public, and the captain wears its face; the underworld ran the law through the very desk sworn against it, and the town is deciding whether anything the watch did was real.',
        ],
      },
    },
  },
  religious: {
    'compromised-covert': {
      'conduct-drift': {
        attributed: [
          'The priest still keeps the hours, still blesses the harvest, still hears confession, and serves something else entirely; a darker patron rewards what happens after the candles are out, and the congregation kneels to a fiction.',
          "Listen closely to the priest's sermons: the doctrine is correct and the conviction is real, but the conviction belongs to another altar. The dark work is the true liturgy, and the patron pays for it in quiet power.",
        ],
      },
      secularization: {
        historicized: [
          'The pews were empty once, and the priest learned to live by other means; the pews have long since refilled, and the means continue. What the cold season taught, no revival has untaught.',
          "The faith came back to this town, but not to its priest; the habits learned while the altars stood empty run on beneath the restored rite, and the congregation prays over a hollow it cannot see.",
        ],
      },
    },
    'compromised-revealed': {
      'clergy-scandal': {
        'exposed-public': [
          "The priest's trade in the priesthood's own disgrace is out: silence bought from sinning brothers and sold as absolution of the record. A town that forgave its clergy once is not in the mood to do it twice.",
          'It is public now, and it is the worst kind of public: the priest profited from the very scandal the pulpit condemned, and every sermon on repentance is being read back as an invoice.',
        ],
      },
    },
  },
  ruler: {
    'compromised-covert': {
      occupation: {
        attributed: [
          "The ruler's seal still stamps the town's decrees, and the occupier's clerk reads them first; the seat survives on service, the service is quiet, and the town mistakes the quiet for protection.",
          'The town believes its ruler shields it from the occupier. The requisition lists say otherwise: signed in the familiar hand, delivered on schedule, and the names on them chosen with care.',
        ],
      },
    },
    'compromised-revealed': {
      scandal: {
        'exposed-public': [
          "The scandal has reached the seat itself, and it is public: the ruler sold the reckoning, pardons priced and prosecutions bought, and the town has learned that even its outrage was somebody's revenue.",
          'It is out, and there is no smaller word for it: the ruler ran the corruption scandal as a market from the seat sworn to end it. The town watched the trials and did not know it was watching an auction.',
        ],
      },
    },
  },
  criminal: {
    'compromised-covert': {
      captured: {
        attributed: [
          'The crews call the boss the power in this town, and the boss lets them; the truth sits in a ledger audited quarterly from elsewhere. The streets belong to the syndicate, and their king is a clerk.',
          "Every oath in the boss's outfit runs upward to a chair the crews have never seen; the boss holds the town like a steward holds an estate, and the real owners have never once visited.",
        ],
      },
    },
  },
  merchant: {
    'compromised-covert': {
      'trade-strangled': {
        attributed: [
          "The embargo ruined every honest house in town, and the guildmaster's alone stands unbowed; the bonded crates roll out on schedule, the customs stamps are perfect, and perfection is precisely the tell.",
          'Ask the ruined merchants what they notice about the guildmaster: the warehouses stay full, the caravans stay moving, and the embargo that beggared everyone else seems to make way. No one has said the word smuggler aloud. Yet.',
        ],
      },
    },
  },
  healer: {
    'compromised-covert': {
      depleted: {
        attributed: [
          'The medicine chest is nearly empty, and the healer decides who gets what remains; the connected recover, the poor drink colored water with a steady hand and a kind word, and the graves keep the accounts.',
          "The sickroom's two shelves look identical from the door. One holds physic, one holds hope dissolved in water, and the healer's choice between them tracks the patient's purse with terrible precision.",
        ],
      },
    },
  },
  dissident: {
    'compromised-revealed': {
      occupation: {
        'exposed-public': [
          "It is public, and the movement is breaking on it: the agitator sold every serious plan to the occupier before it ripened. The resistance's failures were not misfortune, they were merchandise.",
          'The one resistance the occupation tolerated was tolerated for a reason, and the reason is now public: its leader reported upward. The survivors of the failed nights are learning they were sold by the voice that rallied them.',
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
 * @returns {{ line: string, tier: 'full'|'role'|'class'|'floor' }}
 */
export function conjunctionContent(key, seedId) {
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
      }),
      tier: 'floor',
    };
  }
  const line = variants[h % variants.length]
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
 * @returns {{ badge: string|null, tone: string, phrase: string, tier: string, conjunctionKey: object }|null}
 */
export function describeCompromiseConjunction(stamp, seedId) {
  if (!stamp || !stamp.stage || !stamp.causeClass) return null;
  const badge = STAGE_BADGE[stamp.stage] || STAGE_BADGE.attributed;
  const key = {
    role: stamp.role || 'civic',
    situation: stamp.situation || 'compromised-covert',
    causeClass: stamp.causeClass,
    lifecycleStage: stamp.stage,
    ageBand: stamp.ageBand,
  };
  const { line, tier } = conjunctionContent(key, seedId);
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
