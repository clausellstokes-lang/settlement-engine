/**
 * domain/npcProfile.js — Structured NPC profiles + removal consequences.
 *
 * Today's NPC entries are already rich:
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
 * self-contained, the same constraint the sibling derivations honor.
 */

// ── Category → archetype mapping ────────────────────────────────────────
// The generator's `category` field already aligns reasonably well with
// the faction archetype vocabulary. We map them
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
  // The vocabulary npcGenerator ACTUALLY emits — without these aliases every
  // crafts/magic/noble NPC fell to the generic 'other' templates, so a Guild
  // Archmage read as "almost no structural ripple" (the magicLevel-scores-0 bug
  // class, on the NPC surface).
  crafts:     'craft',
  magic:      'arcane',
  noble:      'government',
  nobility:   'government',
});

/** @param {any} category */
function archetypeFromCategory(category) {
  if (!category) return 'other';
  return CATEGORY_TO_ARCHETYPE[/** @type {keyof typeof CATEGORY_TO_ARCHETYPE} */ (String(category).toLowerCase())] || 'other';
}

// ── Per-archetype leverage / vulnerability templates ─────────────────────
// Similar shape to the faction-archetype templates. The
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

/** @param {any} archetype */
function templateForArchetype(archetype) {
  const t = NPC_TEMPLATES[/** @type {keyof typeof NPC_TEMPLATES} */ (archetype)] || NPC_TEMPLATES.other;
  return {
    leverage:        [...t.leverage],
    vulnerabilities: [...t.vulnerabilities],
  };
}

// ── Consequence-if-removed templates ─────────────────────────────────────
// The headline feature: each NPC carries a structured forecast
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
      'A succession contender steps forward, possibly a rival faction.',
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
      'A sectarian successor emerges, possibly with a harder line.',
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
      'The homeland recalls or replaces. The replacement is an unknown quantity.',
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

/**
 * @param {any} archetype
 * @param {any} rank
 */
function consequencesForRemoval(archetype, rank) {
  const archetypeMap = REMOVAL_CONSEQUENCES[/** @type {keyof typeof REMOVAL_CONSEQUENCES} */ (archetype)] || REMOVAL_CONSEQUENCES.other;
  const normalizedRank = (rank || 'minor').toLowerCase();
  const consequences = /** @type {any} */ (archetypeMap)[normalizedRank] || archetypeMap.minor || [];
  return [...consequences];
}

// ── Helpers ─────────────────────────────────────────────────────────────

/** @param {...any} candidates */
function firstNonEmpty(...candidates) {
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return null;
}

/** @param {any} s */
function snakeCase(s) {
  return String(s)
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

/** @param {any} name */
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
  craft:      /smithy|forge|workshop|carpenter|tannery|brewery|guild|hall/i,
  criminal:   /tavern|den|gang|black\s+market/i,
  arcane:     /mage|wizard|college|alchemist|library|laboratory|tower|sanctum/i,
});

// The npcGenerator emits magic/crafts/noble (not arcane/craft/government); without
// these the hint lookup falls through and the Power tab shows "None". Mapped per the
// CATEGORY_TO_ARCHETYPE intent: crafts→craft, magic→arcane, noble→government.
const CATEGORY_HINT_ALIASES = Object.freeze({
  crafts: 'craft',
  magic:  'arcane',
  noble:  'government',
});

/**
 * Resolve the settlement institution an NPC is plausibly tied to, by matching
 * the NPC's `category` against institution names with {@link
 * CATEGORY_INSTITUTION_HINTS}. Returns the matched institution's DISPLAY NAME
 * (e.g. "The Iron Garrison") or null when the category has no hint or no
 * institution name fits. First match wins, so members of one category collapse
 * to a single institution — a deliberate narrowing, not over-breadth.
 *
 * Shared so the Power tab can derive a faction's institutional footprint from
 * its members and then resolve that name to a rename-safe entity id (the index
 * keys institutions by slug, not by this `snake_case` form — see
 * `institutionIdFromName`). The legacy `inferInstitutionLink` wraps this to keep
 * its `institution.<snake>` contract byte-identical for the NPC profile.
 *
 * @param {{category?: string}|null} npc                   The NPC (needs `category`).
 * @param {{institutions?: Array<{name?: string}>}|null} settlement   Context (needs `institutions[]`).
 * @returns {string|null}            Matched institution display name, or null.
 */
export function inferInstitutionName(npc, settlement) {
  if (!npc || !settlement) return null;
  const institutions = Array.isArray(settlement.institutions) ? settlement.institutions : [];
  if (institutions.length === 0) return null;

  const rawCategory = typeof npc.category === 'string' ? npc.category.toLowerCase() : npc.category;
  const category = /** @type {keyof typeof CATEGORY_INSTITUTION_HINTS} */ (CATEGORY_HINT_ALIASES[/** @type {keyof typeof CATEGORY_HINT_ALIASES} */ (rawCategory)] || rawCategory);
  const hint = CATEGORY_INSTITUTION_HINTS[category];
  if (!hint) return null;

  const match = institutions.find(
    /** @param {{name?: string}} inst */
    inst => !!inst && typeof inst.name === 'string' && hint.test(inst.name)
  );
  return match && typeof match.name === 'string' ? match.name : null;
}

/**
 * All settlement institutions whose name fits a DOMAIN category's hint — the
 * power-tab counterpart to {@link inferInstitutionName}. inferInstitutionName
 * answers "which institution is THIS npc tied to" (first match, one result);
 * this answers "which institutions does a power of this CATEGORY touch" (every
 * match). A power row uses it so it shows its institutional footprint even when
 * it has no sub-faction members to infer from — e.g. the Religious Authorities
 * power surfaces the temple/shrine without a single clergy member on file.
 *
 * Returns DISPLAY NAMES (the caller resolves rename-safe ids via the entity
 * index, exactly as the member path does). Same hints + aliases as the npc
 * path, so the two stay consistent.
 *
 * @param {string} category  a faction/power domain (military/religious/economy/…)
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @returns {string[]} matching institution display names (deduped, source order)
 */
export function institutionsForCategory(category, settlement) {
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  if (institutions.length === 0) return [];
  const rawCategory = typeof category === 'string' ? category.toLowerCase() : category;
  const resolved = /** @type {keyof typeof CATEGORY_INSTITUTION_HINTS} */ (
    CATEGORY_HINT_ALIASES[/** @type {keyof typeof CATEGORY_HINT_ALIASES} */ (rawCategory)] || rawCategory
  );
  const hint = CATEGORY_INSTITUTION_HINTS[resolved];
  if (!hint) return [];
  const seen = new Set();
  const out = [];
  for (const inst of institutions) {
    if (!inst || typeof inst.name !== 'string' || !hint.test(inst.name)) continue;
    if (seen.has(inst.name)) continue;
    seen.add(inst.name);
    out.push(inst.name);
  }
  return out;
}

// Domain (faction category) -> institution TAG affinity. Tag-based association is
// the PRIMARY signal for a power's institutional footprint: every catalog
// institution is tagged, and tags don't suffer the misses/false-positives of name
// matching — a "Local fence" or "Smuggling ring" carries the `criminal` tag but
// matches no criminal NAME keyword, so the name path alone left criminal powers
// showing "None" despite the settlement having criminal institutions. Tags also
// overlap by design (a guild hall is `['guild','market']`), so one institution
// maps to MORE THAN ONE power — exactly the "maps to one or more powers" intent.
// Keyed by the SAME resolved domains as CATEGORY_INSTITUTION_HINTS (after the
// magic→arcane / crafts→craft / noble→government aliases). The generic `trade`
// tag is deliberately excluded — it sits on a third of all institutions, so it is
// "participates in commerce", not "is an economic institution".
const CATEGORY_INSTITUTION_TAGS = Object.freeze({
  military:   ['military', 'defense', 'fortification', 'law_enforcement'],
  government: ['civic', 'legal', 'law_enforcement'],
  religious:  ['religious', 'church', 'monastery', 'divine'],
  economy:    ['market', 'banking', 'guild', 'port', 'warehouse', 'economy'],
  craft:      ['guild', 'metalwork', 'textile', 'leather', 'timber'],
  criminal:   ['criminal', 'smuggling', 'underground'],
  arcane:     ['arcane', 'alchemy', 'planar', 'enchanting'],
});

/**
 * A power's full institutional footprint — every institution that LOGICALLY
 * belongs to this power (faction). Three signals, unioned:
 *   1. TAGS — the institution carries a tag in this power's domain affinity
 *      (primary; see {@link CATEGORY_INSTITUTION_TAGS}).
 *   2. NAME — the institution name fits the domain hint (fallback for the rare
 *      untagged entry; same hints {@link inferInstitutionName} uses).
 *   3. EXPLICIT — the institution was pulled into existence BY this faction at
 *      generation (`factionSource` === the power's name, set by factionCorrelation).
 * Because tags overlap, an institution can belong to several powers at once.
 *
 * Returns DISPLAY NAMES (deduped, source order); the caller resolves rename-safe
 * ids via the entity index, same as the member path. Pure, UI-only (not consumed
 * by the generator), so it is safe to evolve without a golden-master regen.
 *
 * @param {{faction?: string, category?: string}|null} faction  a power-structure faction
 * @param {{institutions?: Array<{name?: string, tags?: string[], factionSource?: string}>}|null} settlement
 * @returns {string[]} matching institution display names
 */
export function institutionsForPower(faction, settlement) {
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  if (institutions.length === 0 || !faction) return [];
  const rawCategory = typeof faction.category === 'string' ? faction.category.toLowerCase() : faction.category;
  const resolved = /** @type {keyof typeof CATEGORY_INSTITUTION_HINTS} */ (
    CATEGORY_HINT_ALIASES[/** @type {keyof typeof CATEGORY_HINT_ALIASES} */ (rawCategory)] || rawCategory
  );
  const hint = CATEGORY_INSTITUTION_HINTS[resolved];
  const tags = CATEGORY_INSTITUTION_TAGS[resolved];
  const factionName = typeof faction.faction === 'string' ? faction.faction : null;
  const seen = new Set();
  const out = [];
  for (const inst of institutions) {
    if (!inst || typeof inst.name !== 'string' || seen.has(inst.name)) continue;
    const instTags = Array.isArray(inst.tags) ? inst.tags : [];
    const byTag     = !!tags && instTags.some(t => tags.includes(t));
    const byName    = !!hint && hint.test(inst.name);
    const byFaction = !!factionName && inst.factionSource === factionName;
    if (byTag || byName || byFaction) {
      seen.add(inst.name);
      out.push(inst.name);
    }
  }
  return out;
}

/**
 * @param {import('./settlement.schema.js').SimNpc} npc
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 */
function inferInstitutionLink(npc, settlement) {
  const name = inferInstitutionName(npc, settlement);
  return name ? `institution.${snakeCase(name)}` : null;
}

// ── Relationship-triangle inference ─────────────────────────────────────
// For V1, we surface a single primary relationship: the
// strongest ally or rival the NPC has, sourced from
// settlement.relationships. Triangles (three-way structures) are a
// follow-up — the data is there, but the surface needs careful UX.

/**
 * @param {import('./settlement.schema.js').SimNpc} npc
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 */
function inferPrimaryRelationship(npc, settlement) {
  const rels = Array.isArray(settlement?.relationships) ? settlement.relationships : [];
  if (!npc?.id || rels.length === 0) return null;

  // Find any relationship involving this NPC.
  const candidates = rels.filter(/** @param {any} r */ r => r.npc1Id === npc.id || r.npc2Id === npc.id);
  if (candidates.length === 0) return null;

  // Prefer relationships with explicit tension over plain alliances —
  // these are the more campaign-actionable connections.
  const withTension = candidates.find(/** @param {any} r */ r => typeof r.tension === 'string' && r.tension);
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
 * @param {import('./settlement.schema.js').SimNpc} npc       The legacy NPC entry.
 * @param {any} [settlement] Optional context for institution-link +
 *                              relationship-triangle derivation.
 * @returns {any}
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

    // Corruption truth — mirror the raw fields the corruption pass writes at
    // generation (corruptionPass.js) and the world-pulse sim mirrors back per
    // tick (npcAgency.js#mirrorCorruptionOntoSettlement). The dossier card
    // already renders the raw flags; the structured profile must tell the
    // same story instead of presenting a compromised/ousted NPC as a clean
    // incumbent. `corrupt` stays tri-state: explicit false is a generation
    // verdict, null means a legacy save the corruption pass never judged.
    corrupt:          npc.corrupt ?? null,
    corruptionVector: npc.corruptionVector || null,
    timesExposed:     npc.timesExposed || 0,
    ousted:           npc.ousted === true,

    // structured fields — leverage / vulnerability from template,
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

    // The headline contribution: structured forecast of what
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

/**
 * Enrich every NPC on a settlement. Returns []. for missing data.
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 */
export function deriveAllNpcProfiles(settlement) {
  if (!settlement) return [];
  const npcs = Array.isArray(settlement.npcs) ? settlement.npcs : [];
  return npcs.map(/** @param {import('./settlement.schema.js').SimNpc} n */ n => deriveNpcProfile(n, settlement)).filter(Boolean);
}

// ── Diagnostic helpers ──────────────────────────────────────────────────

/**
 * Count NPCs by archetype. Useful for distribution tests + future
 * faction-roster surfaces.
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 */
export function npcArchetypeBreakdown(settlement) {
  // Seed one bucket per canonical archetype from NPC_TEMPLATES (the single source
  // of the archetype vocabulary every profile resolves into — archetypeFromCategory
  // falls back to 'other', itself a template key). Building the buckets dynamically
  // means a newly-added archetype can never be silently undercounted by a stale literal.
  /** @type {Record<string, number>} */
  const out = {};
  for (const archetype of Object.keys(NPC_TEMPLATES)) out[archetype] = 0;
  for (const p of deriveAllNpcProfiles(settlement)) {
    if (out[p.archetype] === undefined) out[p.archetype] = 0; // defensive: any unforeseen value still counts
    out[p.archetype] += 1;
  }
  return out;
}

/**
 * Forecast the cumulative impact of removing all 'dominant'-rank NPCs.
 * Returns a flat list of consequences — useful for the future
 * "If the players burn through the leadership" forecasting UI.
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 */
export function dominantNpcRemovalImpact(settlement) {
  const dominant = deriveAllNpcProfiles(settlement)
    .filter(/** @param {any} p */ p => p.rank === 'dominant');
  const out = [];
  for (const p of dominant) {
    for (const c of p.consequenceIfRemoved.consequences) {
      out.push({ npcId: p.id, npcName: p.name, archetype: p.archetype, consequence: c });
    }
  }
  return out;
}
