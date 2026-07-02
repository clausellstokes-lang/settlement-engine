/**
 * narrativeMutations.js — Pure helpers for keeping AI narrative in sync with
 * settlement edits.
 *
 * The AI narrative layer refines the settlement's prose. When the user edits
 * the underlying settlement, the narrative must decide what to do:
 *
 *   cosmetic:   mechanical substitution is enough (rename NPC / faction).
 *               We walk every string inside the narrative and substitute
 *               whole-word occurrences of the old name for the new one.
 *
 *   structural: the change altered something the narrative reasons ABOUT
 *               (institutions added/removed, stressors, goods, priorities).
 *               Search-and-replace can't fix it — the UI prompts the user
 *               to Regenerate or Revert to Raw. Progression evolves the
 *               existing narrative against the diff.
 *
 *   seismic:    fundamental identity change (tier, culture, government).
 *               The narrative's premise no longer holds. Same UX as
 *               structural today; may get its own heavier modal later.
 *
 * This module is deliberately pure — no store, no persistence. Callers
 * (aiSlice) are responsible for writing the mutated blob back to disk.
 */

/** Map a settlement change type to a tier. Unknown types default to 'structural'. */
export function classifyChange(type) {
  switch (type) {
    // Cosmetic: name-only swaps that don't change the narrative's claims.
    case 'renameNpc':
    case 'renameFaction':
    case 'renameSettlement':
      return 'cosmetic';

    // Structural: alters what the narrative reasons about.
    case 'addInstitution':
    case 'removeInstitution':
    case 'addStressor':
    case 'removeStressor':
    case 'addTradeGood':
    case 'removeTradeGood':
    case 'addResource':
    case 'removeResource':
    case 'setResourceState':
    case 'setPrioritySlider':
      return 'structural';

    // Seismic: changes the settlement's fundamental identity.
    case 'changeTier':
    case 'changeCulture':
    case 'changeGovernment':
    case 'changeTerrain':
      return 'seismic';

    default:
      return 'structural';
  }
}

/** Escape regex metacharacters so a user-supplied name can be safely embedded. */
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Walk `value` (any shape) and return a transformed copy where every string
 * leaf has had `fn` applied to it. Leaves arrays/objects structurally intact,
 * does not mutate the input.
 */
function mapStrings(value, fn) {
  if (value == null) return value;
  if (typeof value === 'string') return fn(value);
  if (Array.isArray(value)) return value.map(v => mapStrings(v, fn));
  if (typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = mapStrings(v, fn);
    return out;
  }
  return value;
}

/**
 * A single "word character" for boundary purposes: any Unicode letter, number,
 * combining mark, or underscore. We can't use `\b` here — it's ASCII-only, so a
 * name that starts or ends with a non-ASCII letter (Éowyn, José, Zoë) sits
 * between two characters `\b` both consider "non-word", and never matches at
 * all. Instead we assert the name isn't flanked by a word character via
 * Unicode-aware lookarounds under the `u` flag.
 */
const WORD_CHAR = '[\\p{L}\\p{N}\\p{M}_]';

/**
 * Return a copy of `text` with whole-word matches of `oldName` replaced by
 * `newName`. "Whole word" means the match isn't glued to an adjacent word
 * character on either side, so:
 *   - "Ruskovia" is NOT rewritten when renaming "Rusk" (trailing 'o'),
 *   - "Aldric's" IS rewritten (apostrophe is not a word character),
 *   - "Éowyn" / "José" / "Zoë" rename correctly (Unicode-aware, unlike `\b`).
 * `newName` is inserted verbatim (function-form replacement), so `$`-sequences
 * in a user-supplied name aren't interpreted as replacement patterns.
 */
function substituteWholeWord(text, oldName, newName) {
  if (!oldName || oldName === newName) return text;
  const re = new RegExp(
    `(?<!${WORD_CHAR})${escapeRegex(oldName)}(?!${WORD_CHAR})`,
    'gu',
  );
  return text.replace(re, () => newName);
}

/**
 * Apply a cosmetic rename to an ai_data blob. Returns a new blob (or the
 * original reference if no narrative exists to touch). Safe to call when
 * aiData is null/empty — just returns the input.
 */
export function applyRenameToAiData(aiData, oldName, newName) {
  if (!aiData || !oldName || oldName === newName) return aiData;
  const hasNarrative = aiData.aiSettlement || aiData.aiDailyLife;
  if (!hasNarrative) return aiData;

  const rewrite = (s) => substituteWholeWord(s, oldName, newName);
  return {
    ...aiData,
    aiSettlement: aiData.aiSettlement ? mapStrings(aiData.aiSettlement, rewrite) : aiData.aiSettlement,
    aiDailyLife:  aiData.aiDailyLife  ? mapStrings(aiData.aiDailyLife,  rewrite) : aiData.aiDailyLife,
  };
}

/**
 * Apply multiple cosmetic renames in one pass. Useful when a single edit
 * triggers several substitutions (e.g. renaming a faction also renames
 * cross-settlement references to it).
 */
export function applyRenamesToAiData(aiData, pairs) {
  if (!aiData || !pairs || !pairs.length) return aiData;
  let out = aiData;
  for (const { oldName, newName } of pairs) {
    out = applyRenameToAiData(out, oldName, newName);
  }
  return out;
}
