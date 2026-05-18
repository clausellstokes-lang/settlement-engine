/**
 * domain/npcProfile.js — Structured NPC profiles + removal consequences.
 *
 * Tier 4.5 of the roadmap. Today's NPC entries are already rich:
 *
 *   { id, name, role, category, factionAffiliation,
 *     structuralPosition, structuralRank, influence, power,
 *     personality, physical, goal, secret, plotHooks, … }
 *
 * The roadmap target promotes them into causal nodes with:
 *
 *   { institutionLink, factionLink, publicReputation, privateAgenda,
 *     leverage[], vulnerabilities[], offerToPlayers, wantsFromPlayers,
 *     consequenceIfRemoved }
 *
 * Pure read-only derivation. The legacy NPC shape is preserved
 * everywhere; the canonical structured profile is layered on top via
 * `deriveNpcProfile`. Consumers (PDF, AI overlay, "Why is this NPC
 * powerful?" UI) call the derivation and get the structured shape
 * without anyone migrating the generator.
 *
 * No imports from src/lib — domain tsconfig include stays
 * self-contained, same constraint Phases 9-12 honored.
 */

// ── Category → archetype mapping ────────────────────────────────────────
// The generator's `category` field already aligns reasonably well with
// the faction archetype vocabulary established in Phase 9. We map them
// to the canonical archetypes so the leverage / vulnerability / removal
// templates can be shared across both surfaces.

const CATEGORY_TO_ARCHETYPE = Object.freeze({
  military:   'military',
  government: 'government',
  religious:  'religious',
  economy:    'merchant',
  craft:      'craft',
  criminal:   'criminal',
  arcane:     'arcane',
  occupation: 'occupation',
  other:      'other',
});

function archetypeFromCategory(category) {
  if (!category) return 'other';
  return CATEGORY_TO_ARCHETYPE[String(category).toLowerCase()] || 'other';
}

// ── Per-archetype leverage / vulnerability templates ─────────────────────
// Similar shape to the faction-archetype templates from Phase 9. The
// templates here are NPC-specific: what an individual at the top of
// this archetype controls, and what hangs over their head. Each entry
// is a fresh clone on every call so consumers can mutate safely.

const NPC_TEMPLATES = Object.freeze({
  military: {
    leverage:        ['barracks loyalty', 'weapon stockpiles', 'who walks the night patrol routes'],
    vulnerabilities: ['unpaid soldiers', 'a single weapons-cache scandal could break command'],
  },
  government: {
    leverage:        ['signature authority on civic acts', 'access to tax rolls', 'the watch reports to them'],
    vulnerabilities: ['unpopular decrees', 'patronage debts that came with the office'],
  },
  religious: {
    leverage:        ['birth/death records', 'public trust', 'control of relief distribution'],
    vulnerabilities: ['theological scandal', 'reliance on lay donations'],
  },
  merchant: {
    leverage:        ['debt held over rivals', 'warehouse keys', 'caravan timing'],
    vulnerabilities: ['inspection of the ledgers', 'a competitor pricing them out'],
  },
  craft: {
    leverage:        ['guild standards enforcement', 'apprentice pipelines'],
    vulnerabilities: ['guild infighting', 'a single rogue practitioner undercutting prices'],
  },
  criminal: {
    leverage:        ['routes through the watch', 'fear', 'corrupt favors in pocket'],
    vulnerabilities: ['informants', 'a rival gang ready to move'],
  },
  arcane: {
    leverage:        ['rare reagents', 'arcane research no one else can interpret'],
    vulnerabilities: ['public superstition', 'a magical accident waiting to surface'],
  },
  occupation: {
    leverage:        ['external arms', 'foreign coin', 'the homeland\'s backing'],
    vulnerabilities: ['no local legitimacy', 'recall risk from the homeland'],
  },
  other: {
    leverage:        ['institutional position'],
    vulnerabilities: ['outside the structural protections others enjoy'],
  },
});

function templateForArchetype(archetype) {
  const t = NPC_TEMPLATES[archetype] || NPC_TEMPLATES.other;
  return {
    leverage:        [...t.leverage],
    vulnerabilities: [...t.vulnerabilities],
  };
}

// ── Consequence-if-removed templates ─────────────────────────────────────
// The headline Tier 4.5 feature: each NPC carries a structured forecast
// for what happens if they're killed, exiled, retired, or co-opted.
// Severity scales with `structuralRank` ('dominant' / 'secondary' /
// 'minor'); the consequence palette comes from the archetype.

const REMOVAL_CONSEQUENCES = Object.freeze({
  military: {
    dominant: [
      'Watch staffing destabilizes; patrol routes get inconsistent.',
      'The merchant guild pushes private guards into the gap.',
      'Public order strains within weeks; criminal activity rises.',
      'A succession dispute opens among the surviving captains.',
    ],
    secondary: [
      'A unit captain loses their reporting line briefly.',
      'A subordinate moves up; the new face takes time to settle.',
    ],
    minor: [
      'A guard or two notice; the rest of the watch carries on.',
    ],
  },
  government: {
    dominant: [
      'Tax collection slows; the watch loses paid authority.',
      'A succession contender steps forward — possibly a rival faction.',
      'Public legitimacy of the governing body drops several bands.',
      'Quiet courtiers and clients realign overnight.',
    ],
    secondary: [
      'A clerk or under-official scrambles to backfill paperwork.',
      'The governing body absorbs the role temporarily.',
    ],
    minor: [
      'Routine civic functions wobble for a week, then recover.',
    ],
  },
  religious: {
    dominant: [
      'Temple relief authority weakens; food queues lengthen.',
      'A sectarian successor emerges — possibly with a harder line.',
      'Public mourning becomes a political moment.',
      'The governing faction loses a major source of moral cover.',
    ],
    secondary: [
      'A novice or under-priest steps up unprepared.',
      'Donations dip until a new face earns trust.',
    ],
    minor: [
      'A few parishioners notice; the temple carries on.',
    ],
  },
  merchant: {
    dominant: [
      'Trade chains lose a major anchor; prices wobble.',
      'Smuggling networks rush in to fill the gap.',
      'A rival guildmaster consolidates the routes.',
      'Tax revenue drops as the books reshuffle.',
    ],
    secondary: [
      'A specific contract goes unfulfilled; clients seek alternatives.',
      'Guild succession becomes the dinner-table topic.',
    ],
    minor: [
      'A stall on the docks goes quiet for a season.',
    ],
  },
  craft: {
    dominant: [
      'Guild standards enforcement collapses temporarily.',
      'Cheap imports flow in unchecked; quality drops.',
      'Apprentices scatter to other masters.',
    ],
    secondary: [
      'A workshop closes or transfers ownership.',
    ],
    minor: [
      'One product line goes out of stock briefly.',
    ],
  },
  criminal: {
    dominant: [
      'The territory opens up; rival gangs move in within days.',
      'Smuggling routes get rerouted, then locked down by whoever wins.',
      'A corruption network collapses; protected favors become vulnerable.',
      'The watch claims a public victory whether or not it caused this.',
    ],
    secondary: [
      'A lieutenant takes over; old favors get reaccounted.',
    ],
    minor: [
      'A few jobs go to the next-tier hand.',
    ],
  },
  arcane: {
    dominant: [
      'Specialized magical services lapse; the wealthy seek substitutes.',
      'A rival school courts the now-leaderless apprentices.',
      'Arcane research projects stall or move elsewhere.',
      'Public superstition resurges without the moderating expert.',
    ],
    secondary: [
      'A research line is paused; reagents get reassigned.',
    ],
    minor: [
      'A regular customer finds another caster.',
    ],
  },
  occupation: {
    dominant: [
      'The homeland recalls or replaces — the replacement is an unknown quantity.',
      'Local cells of resistance test the new chain of command.',
      'Tribute schedules slip while the transition settles.',
    ],
    secondary: [
      'A junior officer takes a temporary command.',
    ],
    minor: [
      'A roster change few notice.',
    ],
  },
  other: {
    dominant: [
      'A noticeable absence in civic life that the settlement adapts around.',
    ],
    secondary: [
      'A small role goes unfilled briefly.',
    ],
    minor: [
      'Almost no structural ripple.',
    ],
  },
});

function consequencesForRemoval(archetype, rank) {
  const archetypeMap = REMOVAL_CONSEQUENCES[archetype] || REMOVAL_CONSEQUENCES.other;
  const normalizedRank = (rank || 'minor').toLowerCase();
  const consequences = archetypeMap[normalizedRank] || archetypeMap.minor || [];
  return [...consequences];
}

// ── Helpers ─────────────────────────────────────────────────────────────

function firstNonEmpty(...candidates) {
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return null;
}

function snakeCase(s) {
  return String(s)
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function factionIdFromName(name) {
  if (!name) return null;
  return `faction.${snakeCase(name)}`;
}

// ── Institution link inference ──────────────────────────────────────────
// Match the NPC's category / role to the first settlement institution
// with overlapping tags or name patterns. Best-effort — returns null
// when no clear link exists.

const CATEGORY_INSTITUTION_HINTS = Object.freeze({
  military:   /watch|garrison|militia|guard|barracks|patrol/i,
  government: /council|hall|government|courthouse|reeve|mayor|chamber|seat/i,
  religious:  /temple|shrine|church|abbey|cathedral|monastery|chapel/i,
  economy:    /market|guild|hall|broker|exchange|warehouse|bank|docks/i,
  craft:      /smithy|forge|workshop|carpenter|tannery|brewery/i,
  criminal:   /tavern|den|gang|black\s+market/i,
  arcane:     /mage|wizard|college|alchemist|library|laboratory|tower|sanctum/i,
});

function inferInstitutionLink(npc, settlement) {
  if (!npc || !settlement) return null;
  const institutions = Array.isArray(settlement.institutions) ? settlement.institutions : [];
  if (institutions.length === 0) return null;

  const hint = CATEGORY_INSTITUTION_HINTS[npc.category];
  if (!hint) return null;

  const match = institutions.find(inst =>
    inst && typeof inst.name === 'string' && hint.test(inst.name)
  );
  return match ? `institution.${snakeCase(match.name)}` : null;
}

// ── Relationship-triangle inference ─────────────────────────────────────
// For Tier 4.5 V1, we surface a single primary relationship: the
// strongest ally or rival the NPC has, sourced from
// settlement.relationships. Triangles (three-way structures) are a
// follow-up — the data is there, but the surface needs careful UX.

function inferPrimaryRelationship(npc, settlement) {
  const rels = Array.isArray(settlement?.relationships) ? settlement.relationships : [];
  if (!npc?.id || rels.length === 0) return null;

  // Find any relationship involving this NPC.
  const candidates = rels.filter(r => r.npc1Id === npc.id || r.npc2Id === npc.id);
  if (candidates.length === 0) return null;

  // Prefer relationships with explicit tension over plain alliances —
  // these are the more campaign-actionable connections.
  const withTension = candidates.find(r => typeof r.tension === 'string' && r.tension);
  const chosen = withTension || candidates[0];

  const otherId = chosen.npc1Id === npc.id ? chosen.npc2Id : chosen.npc1Id;
  const otherName = chosen.npc1Id === npc.id
    ? (chosen.npc2N || chosen.npc2Name || otherId)
    : (chosen.npc1N || chosen.npc1Name || otherId);

  return {
    otherId,
    otherName,
    type: chosen.type || 'connected',
    typeName: chosen.typeName || null,
    description: chosen.description || null,
    tension: chosen.tension || null,
  };
}

// ── Composer ────────────────────────────────────────────────────────────

/**
 * Build a structured NPC profile.
 *
 * Pure; idempotent; lossless on legacy fields (id, name, role,
 * personality, etc. are preserved on the returned object).
 *
 * @param {Object} npc       The legacy NPC entry.
 * @param {Object} [settlement] Optional context for institution-link +
 *                              relationship-triangle derivation.
 * @returns {Object|null}
 */
export function deriveNpcProfile(npc, settlement) {
  if (!npc || typeof npc !== 'object') return null;

  const archetype = archetypeFromCategory(npc.category);
  const template = templateForArchetype(archetype);
  const rank = npc.structuralRank || 'minor';

  return {
    id:   npc.id || `npc.${snakeCase(npc.name || 'unnamed')}`,
    name: npc.name || 'Unnamed NPC',
    role: npc.role || null,
    category:  npc.category || null,
    archetype,
    rank,
    power:     npc.power     ?? null,
    influence: npc.influence ?? null,

    // Linkages
    institutionLink: inferInstitutionLink(npc, settlement),
    factionLink:     factionIdFromName(npc.factionAffiliation),

    // Public-facing markers
    publicReputation: firstNonEmpty(
      npc.structuralPosition,
      npc.presentation,
      npc.role ? `Known locally as ${npc.role}.` : null,
    ),
    privateAgenda: firstNonEmpty(
      npc.goal?.long,
      npc.goal?.short,
    ),

    // Tier 4.5 structured fields — leverage / vulnerability from template,
    // augmented with the NPC's own secret stakes / plot hooks.
    leverage:        [...template.leverage],
    vulnerabilities: (() => {
      const out = [...template.vulnerabilities];
      const secretStakes = firstNonEmpty(npc.secret?.stakes);
      if (secretStakes) out.push(`Secret-driven exposure: ${secretStakes}`);
      return out;
    })(),

    // Player-facing — derived from existing hooks. We intentionally
    // present the same hook prose without paraphrasing; the structured
    // wrapping is what's new.
    offerToPlayers:    Array.isArray(npc.plotHooks) ? npc.plotHooks.slice(0, 2) : [],
    wantsFromPlayers:  firstNonEmpty(npc.goal?.short),

    // The headline Tier 4.5 contribution: structured forecast of what
    // happens if this NPC is removed from play.
    consequenceIfRemoved: {
      severity: rank,
      consequences: consequencesForRemoval(archetype, rank),
    },

    // V1 triangle: single primary relationship. Full three-way
    // triangles are a follow-up.
    primaryRelationship: inferPrimaryRelationship(npc, settlement),
  };
}

/** Enrich every NPC on a settlement. Returns []. for missing data. */
export function deriveAllNpcProfiles(settlement) {
  if (!settlement) return [];
  const npcs = Array.isArray(settlement.npcs) ? settlement.npcs : [];
  return npcs.map(n => deriveNpcProfile(n, settlement)).filter(Boolean);
}

// ── Diagnostic helpers ──────────────────────────────────────────────────

/**
 * Count NPCs by archetype. Useful for distribution tests + future
 * faction-roster surfaces.
 */
export function npcArchetypeBreakdown(settlement) {
  const out = {
    government: 0, military: 0, religious: 0, merchant: 0,
    craft: 0, criminal: 0, arcane: 0, occupation: 0, other: 0,
  };
  for (const p of deriveAllNpcProfiles(settlement)) {
    if (out[p.archetype] !== undefined) out[p.archetype] += 1;
  }
  return out;
}

/**
 * Forecast the cumulative impact of removing all 'dominant'-rank NPCs.
 * Returns a flat list of consequences — useful for the future
 * "If the players burn through the leadership" forecasting UI.
 */
export function dominantNpcRemovalImpact(settlement) {
  const dominant = deriveAllNpcProfiles(settlement)
    .filter(p => p.rank === 'dominant');
  const out = [];
  for (const p of dominant) {
    for (const c of p.consequenceIfRemoved.consequences) {
      out.push({ npcId: p.id, npcName: p.name, archetype: p.archetype, consequence: c });
    }
  }
  return out;
}
