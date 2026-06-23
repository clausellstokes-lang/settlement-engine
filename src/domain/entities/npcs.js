/**
 * domain/entities/npcs.js — Structural NPC model + event helpers.
 *
 * The plan: most NPCs stay flavor; a small subset becomes load-bearing
 * with mechanical effects on linked institutions and factions. This
 * module defines the importance tiers, the structural fields, and the
 * pure helpers events use to add/kill/replace NPCs.
 *
 * Tier rules:
 *   - minor   : flavor only. No propagation, no impairment.
 *   - notable : weak link to one institution/faction. Small modifier.
 *   - key     : meaningful effect. Removal impairs linked entity.
 *   - pillar  : major consequence. Death creates institutional vacuum
 *               that needs filling via ASSIGN_NPC_TO_ROLE.
 *
 * The engine should default NPCs at generation time:
 *   - solo role-holders in their institution → key
 *   - generic guild members / staff           → notable
 *   - background NPCs                         → minor
 *   - explicit user promotion required        → pillar
 *
 * Pure: no React, no Zustand. Returns new entities; never mutates input.
 */


/** @typedef {'minor'|'notable'|'key'|'pillar'} NpcImportance */

/** @typedef {'active'|'dead'|'missing'|'exiled'|'retired'} NpcStatus */

/** @typedef {Object} NpcStructural
 *  @property {string} id
 *  @property {string} name
 *  @property {string=} role
 *  @property {NpcImportance} importance
 *  @property {NpcStatus} status
 *  @property {string[]=} linkedInstitutionIds
 *  @property {string[]=} linkedFactionIds
 *  @property {number=} influence              0-100, optional
 *  @property {number=} legitimacyContribution 0-100 — what they prop up when alive
 *  @property {number=} stabilityContribution  0-100 — how much their absence destabilizes
 *  @property {string[]=} serviceContribution  e.g. ["healing", "charity", "funerary_rites"]
 *  @property {string[]=} potentialSuccessors  npc ids the engine pre-suggests on death
 *  @property {string=} removedByEventId
 *  @property {string=} createdByEventId       event that created this NPC (ADD_NPC); undo drops it
 *  @property {string=} notes                  free-form DM annotation
 *  @property {string=} flaw                   character flaw — the organic-corruption vector
 *  @property {string=} temperament            input alias; stored as personality.dominant
 *  @property {Object=} personality            {dominant?, ideal?, bond?, ambition?, …} display traits
 *  @property {(string|Object)=} goal          {short?, long?} or a plain string
 *  @property {(string|Object)=} goals         input alias for goal
 *  @property {string=} constraint             input alias; stored as activeConstraint
 *  @property {string=} activeConstraint       a binding constraint on the NPC
 *  @property {(string|Object)=} secret        {what?, stakes?} or a plain string
 *  @property {string=} generatedAs            'pipeline'|'faction_structural' — provenance marker
 *  @property {(string|number)=} _idSeed       input-only: disambiguates the auto-generated
 *                                             id (e.g. the originating event id); not persisted
 */

const IMPORTANCE_WEIGHT = {
  minor:   0.0,  // suppresses propagation entirely
  notable: 0.4,
  key:     0.7,
  pillar:  1.0,
};

/**
 * Default importance tier from generated NPC fields. The pipeline
 * tags each NPC at generation time; this is a fallback for legacy
 * saves.
 *
 * @param {Object} npc
 * @returns {NpcImportance}
 */
export function inferImportance(npc) {
  if (npc?.importance && IMPORTANCE_WEIGHT[npc.importance] !== undefined) return npc.importance;
  // Power, leadership, or named-role NPCs are more likely "key"
  const role = String(npc?.role || npc?.title || '').toLowerCase();
  if (/high priest|patriarch|matriarch|archmage|dragon|lord mayor|noble lord|baron|baroness|duke|duchess/.test(role)) return 'pillar';
  if (/captain|priest|guildmaster|master|magister|sheriff|warden|abbot|seneschal/.test(role)) return 'key';
  if (/lieutenant|clerk|sergeant|deputy|apprentice|councilor|merchant|smith/.test(role))     return 'notable';
  return 'minor';
}

/** Numeric weight (0-1) for propagation strength. */
export function importanceWeight(npc) {
  return IMPORTANCE_WEIGHT[inferImportance(npc)] ?? 0;
}

/**
 * Create a new NPC with structural defaults. Used by the ADD_NPC event
 * and by manual user input. Caller supplies what they have; this fills
 * in defaults so downstream consumers always see a complete shape.
 *
 * @param {Partial<NpcStructural>} input
 * @returns {NpcStructural}
 */
export function createNpc(input = {}) {
  // Auto-id deterministically from the NPC's identity (and an optional _idSeed the
  // caller can pass — e.g. the originating event id — to disambiguate same-named NPCs).
  const idSeed = input._idSeed != null
    ? String(input._idSeed)
    : [input.name, input.role, ...(input.linkedFactionIds || []), ...(input.linkedInstitutionIds || [])].join('|');
  const id = input.id || `npc.${slugify(input.name || 'unnamed')}_${shortHash(idSeed)}`;
  const out = {
    id,
    name: input.name || 'Unnamed',
    role: input.role || '',
    importance: input.importance || 'notable',
    status: /** @type {NpcStatus} */ (input.status || 'active'),
    linkedInstitutionIds: input.linkedInstitutionIds || [],
    linkedFactionIds:     input.linkedFactionIds || [],
    influence:               input.influence ?? null,
    legitimacyContribution:  input.legitimacyContribution ?? null,
    stabilityContribution:   input.stabilityContribution ?? null,
    serviceContribution:     input.serviceContribution || [],
    potentialSuccessors:     input.potentialSuccessors || [],
    notes: input.notes || '',
  };

  // Authored descriptive traits. The NPC read card (npcComponents NPCInlineCard,
  // via entityLinks normalizeNpcTraits) reads these in specific shapes; we accept
  // lenient plain strings here and store them in exactly those shapes so an
  // authored NPC shows precisely what the author typed. Each is retained only
  // when supplied — a created NPC with none of them keeps its old footprint.
  //   - temperament → personality.dominant (the card's "Temperament" trait chip)
  //   - flaw        → top-level flaw (the "Flaw" chip)
  //   - goal        → { short } when a string was passed, else the object as-is
  //   - constraint  → activeConstraint
  //   - secret      → { what } when a string was passed, else the object as-is
  const traits = /** @type {Record<string, any>} */ (out);
  if (input.temperament != null && input.temperament !== '') {
    const existing = (input.personality && typeof input.personality === 'object' && !Array.isArray(input.personality))
      ? input.personality
      : {};
    traits.personality = { ...existing, dominant: input.temperament };
  } else if (input.personality !== undefined) {
    traits.personality = input.personality;
  }
  if (input.flaw != null && input.flaw !== '') traits.flaw = input.flaw;
  if (input.goal != null && input.goal !== '') {
    traits.goal = typeof input.goal === 'string' ? { short: input.goal } : input.goal;
  } else if (input.goals != null && input.goals !== '') {
    traits.goal = typeof input.goals === 'string' ? { short: input.goals } : input.goals;
  }
  if (input.constraint != null && input.constraint !== '') {
    traits.activeConstraint = input.constraint;
  } else if (input.activeConstraint != null && input.activeConstraint !== '') {
    traits.activeConstraint = input.activeConstraint;
  }
  if (input.secret != null && input.secret !== '') {
    traits.secret = typeof input.secret === 'string' ? { what: input.secret } : input.secret;
  }

  return /** @type {NpcStructural} */ (out);
}

/**
 * Apply a KILL_NPC effect: mark the NPC dead and produce the patches
 * that should propagate to its linked institutions and factions.
 *
 * Critical product behavior: removing a key/pillar NPC creates an
 * institutional vacancy. That vacancy is itself an impairment of
 * STAFFING (institution side) and LEADERSHIP (faction side) until
 * filled by a subsequent ASSIGN_NPC_TO_ROLE event.
 *
 * @param {NpcStructural} npc
 * @param {string} eventId
 * @returns {{ npc: NpcStructural, institutionImpairments: Array<{instId:string, impairment:Object}>, factionImpairments: Array<{factionId:string, impairment:Object}> }}
 */
export function killNpc(npc, eventId) {
  const dead = /** @type {NpcStructural} */ ({ ...npc, status: 'dead', removedByEventId: eventId });
  const weight = importanceWeight(npc);

  // Minor NPCs leave no mechanical trace — the campaign feels their
  // death narratively but the engine doesn't ripple it through.
  if (weight === 0) return { npc: dead, institutionImpairments: [], factionImpairments: [] };

  const institutionImpairments = [];
  const factionImpairments = [];

  for (const instId of npc.linkedInstitutionIds || []) {
    institutionImpairments.push({
      instId,
      impairment: {
        type: 'staffing',
        severity: weight,
        causeEventId: eventId,
        description: `Lost key staff member: ${npc.name}${npc.role ? ` (${npc.role})` : ''}`,
      },
    });
    // Pillar NPCs also impair legitimacy — their public identity
    // *was* part of the institution's claim to authority.
    if (npc.importance === 'pillar') {
      institutionImpairments.push({
        instId,
        impairment: {
          type: 'legitimacy',
          severity: 0.7,
          causeEventId: eventId,
          description: `${npc.name}'s death leaves a legitimacy vacuum at this institution.`,
        },
      });
    }
  }

  for (const factionId of npc.linkedFactionIds || []) {
    factionImpairments.push({
      factionId,
      impairment: {
        type: npc.importance === 'pillar' ? 'leadership' : 'membership',
        severity: weight,
        causeEventId: eventId,
        description: `${npc.name} is gone. ${npc.importance === 'pillar' ? 'Leadership' : 'Ranks'} affected.`,
      },
    });
  }

  return { npc: dead, institutionImpairments, factionImpairments };
}

/**
 * Apply an ASSIGN_NPC_TO_ROLE effect: place an NPC into an institution
 * role, partially or fully restoring impairments caused by the prior
 * vacancy. Replacement quality determines how much restoration occurs.
 *
 * Quality scale:
 *   - weak           : 0.3 — token replacement, minimal capacity recovery
 *   - competent      : 0.7 — does the job, capacity recovers
 *   - popular        : 0.9 — improves both capacity AND legitimacy
 *   - corrupt        : 0.5 capacity, REDUCES legitimacy (controversial)
 *   - faction_captured: 0.6 capacity, controlled-by-faction effect
 *
 * Returns the updated NPC plus the inverse impairments that should be
 * applied to the institution (negative-severity impairment = restore).
 */
export function assignNpcToRole({ npc, institutionId, role, quality, factionAlignment, importance, influence, eventId }) {
  const updated = createNpc({
    ...npc,
    status: 'active',
    role: role || npc?.role,
    // Importance + influence come from the role being filled (the role
    // catalogue / faction seat), falling back to whatever the NPC already had.
    importance: importance || npc?.importance,
    influence:  influence ?? npc?.influence,
    linkedInstitutionIds: dedupeIds([...(npc?.linkedInstitutionIds || []), institutionId]),
    linkedFactionIds: factionAlignment
      ? dedupeIds([...(npc?.linkedFactionIds || []), factionAlignment])
      : (npc?.linkedFactionIds || []),
  });

  const restorations = [];
  // We "restore" by removing prior staffing impairments that came
  // from a kill event — handled by the reducer via withoutEventImpairments
  // — then optionally adding a positive-severity legitimacy bump for
  // popular replacements.
  const Q = QUALITY[quality] || QUALITY.competent;
  if (Q.legitimacyBoost > 0) {
    restorations.push({
      instId: institutionId,
      impairment: {
        type: 'legitimacy',
        severity: -Q.legitimacyBoost,  // negative severity = bonus
        causeEventId: eventId,
        description: `Popular new ${role || 'leader'} ${updated.name} is widely accepted.`,
      },
    });
  }
  if (Q.legitimacyHit > 0) {
    restorations.push({
      instId: institutionId,
      impairment: {
        type: 'legitimacy',
        severity: Q.legitimacyHit,
        causeEventId: eventId,
        description: `${quality === 'corrupt' ? 'Corrupt' : 'Faction-aligned'} appointment of ${updated.name} is publicly contested.`,
      },
    });
  }

  return { npc: updated, restorations, recoveryQuality: Q.capacityFactor };
}

const QUALITY = {
  weak:              { capacityFactor: 0.3, legitimacyBoost: 0,    legitimacyHit: 0    },
  competent:         { capacityFactor: 0.7, legitimacyBoost: 0,    legitimacyHit: 0    },
  popular:           { capacityFactor: 0.9, legitimacyBoost: 0.4,  legitimacyHit: 0    },
  corrupt:           { capacityFactor: 0.5, legitimacyBoost: 0,    legitimacyHit: 0.4  },
  faction_captured:  { capacityFactor: 0.6, legitimacyBoost: 0,    legitimacyHit: 0.3  },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 32) || 'npc';
}

// Deterministic short hash (djb2). createNpc runs inside the pure, seeded event
// pipeline — Math.random() here broke seed-replayability of stored settlements.
function shortHash(s) {
  let h = 0;
  const str = String(s);
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).slice(0, 6).padStart(5, '0');
}

function dedupeIds(arr) {
  return [...new Set(arr.filter(Boolean))];
}
