/**
 * domain/briefs/citations.js — the CITATION LAW shared by the briefs (S2) and the
 * analyst (S1).
 *
 * DESIGN_AI_CONTROL_SURFACE §2/§3: every fact a brief bundle carries — and later,
 * every claim the AI prose layers OVER a bundle — is tagged to the READ-MODEL /
 * receipt it derives from. A section without a source is not renderable; an answer
 * claim without a source is answered "the engine does not record this" (the honesty
 * boundary, extending generate-narrative's invention-signal discipline).
 *
 * The AUDIENCE RULE is STRUCTURAL, not prompt-enforced: each SOURCE is classified
 * player-safe or DM-only by CONSTRUCTION. A player-facing composer/slicer can only
 * ever emit player-safe sources (it calls its ingredients with includeGroundTruth:
 * false / includeCovert:false and projects settlements through toPublicSafe). The
 * pins assert that no player bundle can carry a DM/ground-truth source — enforced by
 * construction, never by a runtime prompt.
 *
 * Pure; no I/O; deterministic.
 */

/**
 * The receipt vocabulary. Each key is the stable source tag a bundle section (and an
 * analyst retrieval slice) is stamped with. The value is a stable string id so the
 * AI prompt + client display + aiOperationLog all reference the SAME token.
 */
export const SOURCE = Object.freeze({
  // ── player-safe reads (projection only; never ground truth) ────────────────
  HEGEMONY: 'read:hegemony',                    // hegemonyRead (spheres; includeGroundTruth:false)
  POLITICS_PUBLIC: 'read:politics.public',      // settlementBlocs/realmPolitics (includeCovert:false)
  CREDIBILITY: 'read:credibility',              // settlementCredibility/realmCredibility (band only)
  RUMORS_PUBLIC: 'read:rumors.public',          // settlementRumors (includeGroundTruth:false)
  SETTLEMENT_PUBLIC: 'read:settlement.public',  // toPublicSafe(settlement) — the public projection

  // ── DM-only reads (ground truth / covert / secrets) ────────────────────────
  POLITICS_COVERT: 'read:politics.covert',      // conspiracies (includeCovert:true)
  POLITICS_TRUTH: 'read:politics.truth',        // raw strain/end/glue (includeGroundTruth:true)
  CREDIBILITY_TRUTH: 'read:credibility.truth',  // raw score/weight/discount
  RUMORS_TRUTH: 'read:rumors.truth',            // ground-truth rumor divergence
  WAR_CAUSAL: 'read:warCausal',                 // warCausalBrief (motive legibility receipts)
  NPC_TABLE: 'read:npcTable',                   // tonightAtTheTable / NPC secrets + goals
  PLOT_HOOKS: 'read:plotHooks',                 // collectPlotHooks
  DRAMATIC_IRONY: 'read:dramaticIrony',         // belief-vs-truth divergence
  // DESIGN_THE_ROADS §14/§15 — the road-scene truth read (the chosen route + per-hop
  // conditions, army/migrant/envoy movement, siege/occupation/festival at the gates). All
  // sections read TRUTH at the current tick ⇒ DM-ONLY (never player-safe, §15 classification).
  ROADS_TRUTH: 'read:roads.truth',
});

/**
 * The player-safe subset. Membership is the STRUCTURAL audience gate: a section or
 * slice whose source is NOT in this set may never appear in a player-audience bundle.
 * Frozen so the boundary can't be widened at runtime.
 */
export const PLAYER_SAFE_SOURCES = /** @type {ReadonlySet<string>} */ (Object.freeze(new Set([
  SOURCE.HEGEMONY,
  SOURCE.POLITICS_PUBLIC,
  SOURCE.CREDIBILITY,
  SOURCE.RUMORS_PUBLIC,
  SOURCE.SETTLEMENT_PUBLIC,
])));

/** Every registered source id (for validation that a section tags a KNOWN source). */
export const ALL_SOURCES = /** @type {ReadonlySet<string>} */ (Object.freeze(new Set(Object.values(SOURCE))));

/** The honesty boundary string: a claim with no source resolves to this. */
export const ENGINE_DOES_NOT_RECORD = 'the engine does not record this';

/**
 * True iff `source` is a known, player-safe read. Fail-closed: an unknown token is
 * NOT player-safe.
 * @param {unknown} source
 * @returns {boolean}
 */
export function isPlayerSafeSource(source) {
  return typeof source === 'string' && PLAYER_SAFE_SOURCES.has(source);
}

/**
 * True iff `source` is a registered receipt tag.
 * @param {unknown} source
 * @returns {boolean}
 */
export function isKnownSource(source) {
  return typeof source === 'string' && ALL_SOURCES.has(source);
}

/**
 * A bundle SECTION: a titled, sourced group of items. `source` is mandatory — a
 * section with no known source is a citation violation.
 * @typedef {Object} BriefSection
 * @property {string} id
 * @property {string} title
 * @property {string} source     one of SOURCE.*
 * @property {Array<Record<string, unknown>>} items
 */

/**
 * A brief BUNDLE: a pure, sourced, AI-free digest. The AI prose layer (S1/S3) grounds
 * on this under the SAME citation law.
 * @typedef {Object} Brief
 * @property {string} kind        settlement|faction|regional|weekly|sessionPrep|dramaticIrony|playerSafe
 * @property {'dm'|'player'} audience
 * @property {BriefSection[]} sections
 */

/**
 * Construct a section. Throws in dev-shaped tests if the source is unknown — the
 * citation law is enforced at CONSTRUCTION, so a mis-sourced section can never be
 * built silently.
 * @param {string} id @param {string} title @param {string} source
 * @param {Array<Record<string, unknown>>} items
 * @returns {BriefSection}
 */
export function section(id, title, source, items) {
  if (!isKnownSource(source)) {
    throw new Error(`brief section "${id}" tagged with unknown source: ${String(source)}`);
  }
  return { id, title, source, items: Array.isArray(items) ? items : [] };
}

/**
 * Assemble a bundle from non-empty sections. Empty sections are dropped so a dormant
 * ingredient contributes nothing (byte-identical off-state). A player bundle FAILS
 * CLOSED: any section whose source is not player-safe is a construction error.
 * @param {{ kind: string, audience: 'dm'|'player', sections: Array<BriefSection|null|undefined> }} args
 * @returns {Brief}
 */
export function assembleBrief({ kind, audience, sections }) {
  const kept = /** @type {BriefSection[]} */ ((Array.isArray(sections) ? sections : [])
    .filter((s) => s && Array.isArray(s.items) && s.items.length > 0));
  if (audience === 'player') {
    for (const s of kept) {
      if (!isPlayerSafeSource(s.source)) {
        // STRUCTURAL audience guard: a player bundle can never carry a DM/ground-truth
        // source. Reaching here means a composer wired a DM ingredient into a player
        // bundle — a bug the pins catch, surfaced loudly rather than leaked.
        throw new Error(`player brief "${kind}" leaked a non-player-safe source: ${s.source}`);
      }
    }
  }
  return { kind, audience, sections: kept };
}

/**
 * Citation coverage of a bundle: the fraction of sections carrying a KNOWN source.
 * A pure bundle is sourced by construction, so this is 1 for any well-formed bundle
 * and the floor pin asserts it never drops.
 * @param {Brief|null|undefined} brief
 * @returns {number} 0..1 (1 for an empty bundle — nothing uncited)
 */
export function bundleCitationCoverage(brief) {
  const sections = brief && Array.isArray(brief.sections) ? brief.sections : [];
  if (sections.length === 0) return 1;
  const cited = sections.filter((s) => isKnownSource(s?.source)).length;
  return cited / sections.length;
}

/** The distinct source tags a bundle draws on (its bibliography).
 * @param {Brief|null|undefined} brief @returns {string[]} */
export function bundleSources(brief) {
  const sections = brief && Array.isArray(brief.sections) ? brief.sections : [];
  return [...new Set(sections.map((s) => s?.source).filter(isKnownSource))];
}
