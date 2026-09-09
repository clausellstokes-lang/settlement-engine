/**
 * data/galleryReactionVocab.js — the six structured gallery reactions
 * (GALLERY-2 phase 2, owner-signed 2026-07-17).
 *
 * A bounded, fiction-register vocabulary: readers react to a public dossier by
 * choosing from these six fixed phrases — never free text (free-form commentary
 * is the separate, already-shipped comments surface; anything beyond it stays
 * deferred post-launch per the standing ruling).
 *
 * The LABELS are the owner-approved wording VERBATIM — do not editorialize,
 * re-case, or "fix" them. The KEYS are the storage identity: they appear in
 * the gallery_reactions.reaction_key CHECK constraint AND the
 * toggle_gallery_reaction vocabulary guard (supabase/migrations/
 * 145_gallery_reactions.sql). tests/data/galleryReactionVocab.test.js pins all
 * three lists to each other, so adding/renaming a reaction is a single
 * coordinated change (new migration + this module + the pin), never a drift.
 *
 * Order is the display order (card chips + dossier chip row).
 */

export const REACTION_VOCAB = Object.freeze([
  Object.freeze({ key: 'worth_walking',   label: 'A world worth walking' }),
  Object.freeze({ key: 'finely_wrought',  label: 'Finely wrought' }),
  Object.freeze({ key: 'steeped_history', label: 'Steeped in history' }),
  Object.freeze({ key: 'run_campaign',    label: "I'd run a campaign here" }),
  Object.freeze({ key: 'map_speaks',      label: 'The map speaks' }),
  Object.freeze({ key: 'true_to_life',    label: 'True to life' }),
]);

/** The key set, frozen, for clamps and membership checks. */
export const REACTION_KEYS = Object.freeze(REACTION_VOCAB.map(r => r.key));

/** key → label lookup (unknown keys → undefined; render nothing, never the raw key). */
export const REACTION_LABELS = Object.freeze(
  Object.fromEntries(REACTION_VOCAB.map(r => [r.key, r.label])),
);
