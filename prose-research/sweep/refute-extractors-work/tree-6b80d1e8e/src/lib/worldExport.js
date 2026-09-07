/**
 * worldExport.js — THE WORLD-EXPORT FORMAT (Vision V-11 THE FOUNDRY BRIDGE).
 *
 * A single, versioned, plain-JSON portrait of a whole realm (campaign) that
 * leaves the app so the play surface can meet the world where it plays — the
 * standalone Foundry module (foundry-module/) imports it as journal entries, and
 * the local Truth Server (mcp-server/) reads it read-only under someone else's
 * AI. ONE format, TWO variants, governed by the secrets seam:
 *
 *   • variant 'dm'     — the owning DM's own copy. Per-settlement DM content
 *                        (secrets, plot hooks, NPC goals/relationships) rides
 *                        along via toPublicSafe({ full: true }) — the exact
 *                        `gallery_share_dm` projection (still strips AI prose,
 *                        seeds, and the latent pantheon).
 *   • variant 'player' — safe to hand to the table. Every settlement is reduced
 *                        to its player-safe allowlist via toPublicSafe (default,
 *                        fail-closed), so ZERO covert marks / whereabouts / nids
 *                        can leak. THE load-bearing pin (tests/lib/worldExport…).
 *
 * THE COVERT SEAM IS NOT RE-IMPLEMENTED HERE. The realm layer is the same
 * allowlist-only, covert-force-OFF `serializeWorldSnapshotPublic` the gallery /
 * shared-realm surfaces use, and each settlement is projected by the same
 * server-mirrored `toPublicSafe` the gallery uses — both fail-closed, both pinned
 * to their SQL twins. This exporter only ASSEMBLES their outputs; it can never
 * widen what they expose. The realm layer is the PUBLIC snapshot in BOTH variants
 * (a realm-level DM overlay — gm channels, covert war fronts, un-approved
 * proposals — is a deliberate follow-on, recorded here, not a bug to re-find).
 *
 * PURE + DETERMINISTIC. No Date.now / Math.random / new Date. `generatedAt` is an
 * injected string (the wiring layer passes wall-clock time; tests pin a fixed
 * value), so a fixed input yields byte-identical output — the exporter-determinism
 * pin. Never mutates its input.
 *
 * LAZY: designed to be reached ONLY behind a dynamic import, so its static
 * imports of the redactors cost zero first-paint bytes. NOTE (SB3 accuracy):
 * the in-app export CONTROL that would dynamic-import this producer is a
 * deliberate deferred follow-on — it is NOT wired yet. Today buildWorldExport
 * is exercised only by its tests and consumed indirectly by the offline
 * packages (foundry-module/ + mcp-server/), which read a pre-emitted world-
 * export JSON file rather than importing this module. Wiring the export surface
 * is an owner-scoped feature, recorded here, not dead code to re-find.
 *
 * @enforced-by tests/lib/worldExport.test.js
 */

import { toPublicSafe, veilPublicPayload } from '../domain/display/publicSafe.js';
import { serializeWorldSnapshotPublic } from '../domain/display/worldSnapshotPublic.js';
import { slugify } from '../kernel/slugify.js';

/** The format discriminator a consumer keys on before trusting the shape. */
export const WORLD_EXPORT_FORMAT = 'settlementforge-world';
/** Bumped on any breaking shape change so a stored export can be versioned. */
export const WORLD_EXPORT_FORMAT_VERSION = 1;
/** The two secrets-seam variants. 'player' is the fail-closed default. */
export const WORLD_EXPORT_VARIANTS = Object.freeze(['dm', 'player']);

// The realm-snapshot sections surfaced in the export (all public-derived). Every
// value still passes serializeWorldSnapshotPublic's covert-force-OFF scrub.
const SNAPSHOT_SECTIONS = Object.freeze({
  worldClock: true,
  chronicle: true,
  pantheon: true,
  warNetwork: true,
  dashboard: true,
});

/**
 * The stable settlement key used across the export. Prefers the id the realm's
 * worldState / regionalGraph reference (the campaign save id `m.id`), so a
 * consumer can join `realm.snapshot.*.affectedSettlementIds` back to a settlement
 * entry; falls back to the content-stable dossier id, then a name slug.
 * @param {any} member
 * @param {any} dossier
 * @returns {string}
 */
function memberKey(member, dossier) {
  if (member && member.id != null && String(member.id)) return String(member.id);
  if (dossier && dossier.id != null && String(dossier.id)) return String(dossier.id);
  const name = String((member && member.name) || (dossier && dossier.name) || 'settlement');
  return slugify(name, { sep: '_', fallback: 'settlement' });
}

/**
 * @typedef {Object} WorldExportInput
 * @property {string} [name]            the realm / campaign name
 * @property {(string|number)} [seed]   the generation seed (DM-variant provenance only)
 * @property {Array<any>} [settlements] member saves — `{ id, name, settlement }` (or bare settlements)
 * @property {any} [worldState]         the campaign's live worldState (realm snapshot source)
 * @property {any} [regionalGraph]      the campaign's regional graph (channels source)
 */

/**
 * @typedef {Object} WorldExportOptions
 * @property {('dm'|'player')} [variant]   which secrets-seam variant to emit (default 'player')
 * @property {string} [generatedAt]        injected ISO timestamp for determinism (default null)
 */

/**
 * Build a versioned, secrets-seam-aware world export from a realm/campaign.
 *
 * @param {WorldExportInput} world
 * @param {WorldExportOptions} [options]
 * @returns {{
 *   format: string,
 *   formatVersion: number,
 *   variant: 'dm'|'player',
 *   generatedAt: string|null,
 *   realm: Record<string, any>,
 *   settlements: Array<{ id: string, name: string, tier: (string|null), dossier: Record<string, any> }>,
 * }}
 */
export function buildWorldExport(world, options = {}) {
  const opts = options && typeof options === 'object' ? options : {};
  // FAIL CLOSED: anything that is not an explicit 'dm' request emits the
  // player-safe variant, so a caller bug can never accidentally leak DM content.
  const variant = opts.variant === 'dm' ? 'dm' : 'player';
  const full = variant === 'dm';
  const generatedAt = typeof opts.generatedAt === 'string' ? opts.generatedAt : null;

  const w = world && typeof world === 'object' && !Array.isArray(world) ? world : {};
  const members = Array.isArray(w.settlements) ? w.settlements : [];
  const worldState = w.worldState || null;
  const regionalGraph = w.regionalGraph || (worldState && worldState.regionalGraph) || null;

  const settlements = members.map((member) => {
    const dossier = member && member.settlement && typeof member.settlement === 'object'
      ? member.settlement
      : (member && typeof member === 'object' && !Array.isArray(member) ? member : {});
    return {
      id: memberKey(member, dossier),
      name: String((member && member.name) || dossier.name || 'Settlement'),
      tier: dossier.tier != null ? String(dossier.tier) : null,
      // The ONE covert seam: full=true keeps the DM's own secrets/hooks/goals;
      // default (full=false) is the fail-closed player-safe allowlist. Both are
      // the server-mirrored toPublicSafe — no redaction logic is invented here.
      dossier: toPublicSafe(dossier, { full }),
    };
  });

  /** @type {Record<string, any>} */
  const realm = {
    name: String(w.name || 'Realm'),
    settlementCount: settlements.length,
    // Allowlist-only, covert-force-OFF realm projection — identical in both
    // variants (realm-level DM overlay is a recorded follow-on).
    snapshot: serializeWorldSnapshotPublic(worldState, regionalGraph, members, SNAPSHOT_SECTIONS),
  };
  // The seed is DM-variant provenance ONLY. It replays the procedural world, so a
  // player export never carries it (mirrors the gallery seed-posture strip).
  if (full && w.seed != null && String(w.seed)) realm.seed = String(w.seed);

  // THE PUBLIC-PAYLOAD VEIL SEAM (§9, VH-1). The per-settlement dossier is already
  // veiled inside toPublicSafe, but this function HOISTS two strings that never
  // touched that projection — `settlements[].name` (built from the raw member/dossier
  // above) and `realm.name` (raw `w.name`) — so an export carried the same term
  // veiled in one field and plain in its sibling. The cure is the payload BOUNDARY,
  // not the two fields: everything this exporter assembles leaves through one call,
  // so a future hoisted field is covered without anyone remembering to cover it.
  // Applying it to the WHOLE payload also keeps the export's joins intact — the
  // settlement keys and the snapshot's affectedSettlementIds are masked by the same
  // deterministic transform, so both sides of a join still match.
  return veilPublicPayload({
    format: WORLD_EXPORT_FORMAT,
    formatVersion: WORLD_EXPORT_FORMAT_VERSION,
    variant,
    generatedAt,
    realm,
    settlements,
  });
}

export default buildWorldExport;
