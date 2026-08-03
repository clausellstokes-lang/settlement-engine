/**
 * hookRetention.js — THE RANKED NON-REDUNDANCY LAYER (wave HK-2,
 * docs/DESIGN_HOOK_NONREDUNDANCY.md §3).
 *
 * WHAT IT IS FOR: the aggregator already drops a hook whose PROSE was printed
 * before (exact text) and a hook that is a reframing of prose printed before
 * (the echo family). What neither can see is two DIFFERENT authored strings
 * telling the SAME BEAT, worn by two different actors — the owner's case. HK-1
 * gave every authored template a theme; this module is what acts on it: per
 * theme, keep the best K tellings and let the rest fall out of the PROJECTION.
 *
 * HK-LAW-5 — PROJECTION-SIDE DROPS ONLY. This module returns a filtered VIEW of
 * an array it was handed. It writes nothing, mutates nothing, and no caller
 * persists its output. That is the whole safety argument for regen / undo /
 * import / serialize: there is nothing to survive, because nothing was stored.
 * It is also why the same cure covers generated AND advanced snapshots without
 * a second code path — the projection reads whatever state the advance left.
 *
 * HK-LAW-7 — DETERMINISTIC TASTE. "Most dramatic and interesting" is the typed
 * composite in `interestOf` plus a codepoint tie-break. No RNG, no clock, no
 * model, no text heuristics: not length, not vocabulary, not sentiment. Same
 * input, same survivors, forever — which is what lets THE PROMISE hold across a
 * projection that decides what a DM sees.
 *
 * WHAT IT REFUSES TO DO (HK-LAW-1): it never rewrites, merges, truncates, or
 * paraphrases hook prose, and it never substitutes a replacement. A display-time
 * fetch cannot see generation context, so plausibility could not be guaranteed;
 * the redraw arm belongs at generation (HK-3), where staying inside the same
 * authored, context-scoped pool makes plausibility structural. Here the only
 * verb is DROP.
 *
 * THE TWO ALWAYS-SURVIVE CLASSES, and why they consume slots rather than being
 * exempt from counting:
 *   • HK-LAW-2, THE DM'S PEN — a hook whose prose carries a user edit is never
 *     dropped, and it participates as a BLOCKER: its theme counts as taken, so
 *     it evicts machine hooks rather than being evicted by them. Machine taste
 *     is not authorized over human prose in either direction.
 *   • HK-LAW-4, STORY IN MOTION — a hook anchoring a live escalation clock is
 *     retained regardless of theme collision, because dropping it orphans a
 *     multi-stage trajectory mid-story.
 * Both are supplied BY THE CALLER as key sets. This module never decides what is
 * edited or what is anchored — it is handed those facts, which keeps it pure and
 * keeps the two laws enforceable at whichever surface actually knows.
 *
 * HK-LAW-3 — `untyped` IS NOT A BUCKET. Free prose (DM edits, AI-bucketed custom
 * content, legacy strings, and any authored template HK-1 has not been taught)
 * classifies `untyped` and is passed through untouched. `untyped` hooks are
 * never grouped with each other, never ranked, and never dropped here — the
 * exact-text layer upstream already removed true duplicates among them.
 */
import { compareCodepoint } from '../deterministicSort.js';
import { walkUserEdits } from '../userEdits.js';
import { UNTYPED, hookThemeKey } from '../../generators/hookThemes.js';

/**
 * The shape this layer needs from a hook, and no more. Both collectors emit
 * supersets of it (the display aggregator adds source/role/sub/links, the
 * structured one adds origin/consequences), so typing the INTERSECTION rather
 * than either producer keeps the helper honestly shared instead of quietly
 * coupled to whichever surface was written first.
 *
 * @typedef {Object} RetainableHook
 * @property {unknown} [text] the hook prose
 * @property {unknown} [priority] the aggregator's 0-9 rank
 * @property {unknown} [accent] the source's own "worth the eye" mark
 * @property {unknown} [severity] structured-surface band
 * @property {unknown} [category]
 * @property {unknown[]} [links] entity references this hook names
 */

/**
 * THE TUNING SURFACE (docs/DESIGN_HOOK_NONREDUNDANCY.md §5). Every term is a
 * typed, owner-signed number in ONE table — never a bare float at a call site,
 * and never a term that reads prose content. Raising K is an edit here, never
 * a code change (J-HK-4).
 *
 * @typedef {Object} RetentionTuning
 * @property {Record<string, number>} kByBand hooks retained per theme, by scale band
 * @property {Record<string, number>} categoryWeight persons over abstractions
 * @property {number} accentBonus
 * @property {Record<string, number>} severityBonus
 * @property {number} linkBonusPer
 * @property {number} linkBonusCap max links counted
 */

/** @type {Readonly<RetentionTuning>} */
export const DEFAULT_RETENTION_TUNING = Object.freeze({
  // J-HK-4: conservative by design — K=1 below city keeps "plenty of variety"
  // honest. MEASURED CAVEAT, recorded for the owner's signing (HK-2 report,
  // 2026-08-03): because K caps the TOTAL typed survivors at K × |HOOK_THEMES|,
  // these defaults drop 15% of a hamlet's hooks and 40% of a metropolis's on the
  // current corpus. That is why the aggregator seam ships DARK — see
  // `collectPlotHooks`' `retention` option — pending an owner-signed K.
  kByBand: Object.freeze({ thorp: 1, hamlet: 1, village: 1, town: 1, city: 2, metropolis: 2 }),
  categoryWeight: Object.freeze({ relationship: 0.5, npc: 0.25, faction: 0.25 }),
  accentBonus: 1.5,
  severityBonus: Object.freeze({ critical: 2, high: 1 }),
  linkBonusPer: 0.25,
  linkBonusCap: 2,
});

/** The permissive K for a band the table does not name. An UNKNOWN band must
 *  drop the FEWEST hooks, never the most: a band we cannot classify is a band
 *  whose density we cannot reason about, and the reversible error is retaining
 *  a repeat, not deleting a story. */
function fallbackK(/** @type {Readonly<RetentionTuning>} */ tuning) {
  return Math.max(...Object.values(tuning.kByBand));
}

/**
 * Hooks retained per theme for a scale band.
 * @param {unknown} scaleBand settlement tier ('village', 'city', …)
 * @param {Readonly<RetentionTuning>} [tuning]
 * @returns {number}
 */
export function retentionK(scaleBand, tuning = DEFAULT_RETENTION_TUNING) {
  const named = typeof scaleBand === 'string' ? tuning.kByBand[scaleBand] : undefined;
  return Number.isFinite(named) ? /** @type {number} */ (named) : fallbackK(tuning);
}

/**
 * The lookup key for a hook's prose — THE ONE FOLD, delegated to
 * `hookThemeKey` rather than re-spelled here.
 *
 * Three layers ask "is this the same hook": the exact-text dedup in
 * plotHooks.js, the theme lookup in hookThemes.js, and the protected-key sets
 * below. Three copies of one normalisation is the writer/reader
 * payload-spelling drift class in miniature — the copies agree until someone
 * tightens one of them, and then a DM-edited hook silently stops matching its
 * own protection entry. One fold, one spelling, imported by everyone.
 *
 * @param {unknown} text
 * @returns {string}
 */
export function retentionKey(text) {
  return hookThemeKey(text);
}

/**
 * THE DETERMINISTIC TASTE FUNCTION (§4). Every term is typed and tunable; no
 * term reads prose content, prose length, or any model output.
 *
 *   priority       the aggregator's own 0–9 per-source rank (the spine)
 * + accentBonus    the source already marked this one worth the eye
 * + severityBonus  critical/high, for the structured surface that carries it
 * + linkBonus      a hook naming real entities is more playable than an abstract one
 * + categoryWeight persons over abstractions, per the named-actor rule
 *
 * Missing terms contribute zero (priority falls back to the aggregator's own
 * default of 5), so a hook shape carrying fewer fields ranks on what it has
 * rather than being penalised for its shape.
 *
 * @param {RetainableHook} hook
 * @param {Readonly<RetentionTuning>} [tuning]
 * @returns {number}
 */
export function interestOf(hook, tuning = DEFAULT_RETENTION_TUNING) {
  if (!hook || typeof hook !== 'object') return 0;
  const priority = Number.isFinite(hook.priority) ? Number(hook.priority) : 5;
  const accent = hook.accent ? tuning.accentBonus : 0;
  const severity = tuning.severityBonus[String(hook.severity)] || 0;
  const linkCount = Array.isArray(hook.links) ? hook.links.length : 0;
  const links = tuning.linkBonusPer * Math.min(linkCount, tuning.linkBonusCap);
  const category = tuning.categoryWeight[String(hook.category)] || 0;
  return priority + accent + severity + links + category;
}

/** The userEdits walk kinds that mean "a DM wrote this hook's prose". */
const DM_HOOK_KINDS = new Set(['hook', 'plotHook']);

/**
 * THE DM'S PEN, read at its single sanctioned source (HK-LAW-2). Returns the
 * retentionKey()s of every hook whose prose carries a user edit, so a caller can
 * hand them to `retainHooks` as the always-survive set.
 *
 * WHY IT READS EVERY PROSE FIELD rather than just the edited path: the estate's
 * two collectors extract hook prose from different fields (`hook` then `text` in
 * the display aggregator; `text` then `hook` then `description` in the
 * structured one), and `walkUserEdits` reports the edited PATH, not the field a
 * collector happens to render. Keying all of them over-includes at worst, and
 * over-including here can only RETAIN a hook that would otherwise have been
 * ranked out — the safe direction under HK-LAW-2. Under-including silently
 * deletes a DM's own writing, which the law forbids outright.
 *
 * It goes through `walkUserEdits` rather than reading `_userEdits` directly
 * because the estate's writer/reader payload-spelling drift class is exactly
 * what a second, hand-rolled reader of that shape would re-create.
 *
 * @param {import('../userEdits.js').EditableEntity | null | undefined} settlement
 * @returns {Set<string>}
 */
export function editedHookTextKeys(settlement) {
  /** @type {Set<string>} */
  const keys = new Set();
  for (const { kind, entity, path } of walkUserEdits(settlement)) {
    if (!DM_HOOK_KINDS.has(kind) || !entity) continue;
    for (const field of [path, 'text', 'hook', 'description']) {
      const value = /** @type {Record<string, unknown>} */ (entity)[field];
      if (typeof value !== 'string') continue;
      const key = retentionKey(value);
      if (key) keys.add(key);
    }
  }
  return keys;
}

/**
 * @typedef {Object} RetainOptions
 * @property {(hook: RetainableHook) => string} themeOf classifier; MUST answer
 *   a closed-vocabulary theme or `untyped`. Absent ⇒ this layer is a no-op.
 * @property {ReadonlySet<string>} [editedTextKeys] retentionKey()s of DM-edited prose (HK-LAW-2)
 * @property {ReadonlySet<string>} [clockAnchoredKeys] retentionKey()s of clock-anchored prose (HK-LAW-4)
 * @property {unknown} [scaleBand] settlement tier, for K
 * @property {Readonly<RetentionTuning>} [tuning]
 */

/**
 * Keep the best K tellings of each theme; drop the rest from the PROJECTION.
 *
 * ORDER IS PRESERVED EXACTLY. The output is a subsequence of the input, so the
 * priority ordering the aggregator established survives untouched — a projection
 * that reordered the DM's list would be a UI regression wearing a fix's name.
 *
 * @param {RetainableHook[]} hooks priority-sorted, already exact/family deduped
 * @param {RetainOptions} [options]
 * @returns {RetainableHook[]} a subsequence of `hooks`
 */
export function retainHooks(hooks, options = /** @type {RetainOptions} */ ({})) {
  if (!Array.isArray(hooks) || hooks.length === 0) return Array.isArray(hooks) ? hooks : [];
  const { themeOf } = options;
  // No classifier ⇒ nothing is typed ⇒ nothing may be dropped. Returning the
  // input rather than throwing keeps a mis-wired caller SAFE (it sees every
  // hook) instead of silently emptying a DM's list.
  if (typeof themeOf !== 'function') return hooks;

  const tuning = options.tuning || DEFAULT_RETENTION_TUNING;
  const edited = options.editedTextKeys || new Set();
  const clocked = options.clockAnchoredKeys || new Set();
  const K = retentionK(options.scaleBand, tuning);

  /** Per theme: how many slots are still free. */
  /** @type {Map<string, number>} */
  const budget = new Map();
  /** Candidates per theme, in the order they must be considered. */
  /** @type {Map<string, number[]>} */
  const contenders = new Map();
  /** Index → decision. Everything starts retained; only ranked losers flip. */
  const keep = hooks.map(() => true);

  hooks.forEach((hook, index) => {
    const theme = themeOf(hook);
    // HK-LAW-3: free prose is never theme-judged, never grouped, never ranked.
    if (!theme || theme === UNTYPED) return;
    const key = retentionKey(hook.text);
    if (edited.has(key) || clocked.has(key)) {
      // Always survives (HK-LAW-2 / HK-LAW-4) AND consumes a slot, so a protected
      // hook EVICTS machine tellings of its beat rather than sitting beside them.
      budget.set(theme, (budget.get(theme) ?? K) - 1);
      return;
    }
    if (!contenders.has(theme)) contenders.set(theme, []);
    /** @type {number[]} */ (contenders.get(theme)).push(index);
  });

  for (const [theme, indices] of contenders) {
    const slots = Math.max(0, budget.get(theme) ?? K);
    if (indices.length <= slots) continue;
    // Rank: highest INTEREST first, then codepoint on the normalised prose. The
    // tie-break reads the TEXT KEY rather than the raw prose so two hooks whose
    // only difference is whitespace or case cannot swap places between runs.
    const ranked = [...indices].sort((a, b) => {
      const delta = interestOf(hooks[b], tuning) - interestOf(hooks[a], tuning);
      if (delta !== 0) return delta;
      return compareCodepoint(retentionKey(hooks[a].text), retentionKey(hooks[b].text));
    });
    for (const index of ranked.slice(slots)) keep[index] = false;
  }

  return hooks.filter((_, index) => keep[index]);
}
