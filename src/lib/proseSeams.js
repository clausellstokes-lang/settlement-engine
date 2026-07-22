/**
 * proseSeams.js - the ONE display-time cleanup for authored-prose seam artifacts.
 *
 * Generator templates bake authoring scaffolding into the strings they emit: a
 * leading ' PLOT HOOK: ' marker on economic/safety hooks (economy/foodBalance.js),
 * and article doubling / capitalised-article joins ('the the ...', 'the The ...')
 * where a template's own leading article meets a token that already carries one.
 *
 * Historically each reader surface re-derived its OWN stripper - ViabilityTab
 * had a local `_cleanHook`, the dossier aggregator had a local `cleanHook`, the
 * PDF view model relied on the aggregator - so the cleanup drifted per surface,
 * and a newly-surfaced surface (EconomicsTab, cold-review finding H2) simply
 * forgot to strip at all and rendered the raw ' PLOT HOOK: ' marker to the DM.
 * This module is the single import every display consumer routes through, so a
 * new surface cannot silently omit the cleanup again.
 *
 * DISPLAY-SIDE ONLY. These strippers never touch generator emission. The real
 * fix for the baked-in seams is the generator-side ONE REGEN (findings
 * H5/H6/H7/M1/M3/M4, owner-gated, golden-shifting) which retires the markers at
 * the source; until then these keep the reader surface clean, and the guard
 * tests/copy/composedProseSeams.test.js banks the remaining generator-side debt
 * as a shrink-only baseline so it stays visible and only shrinks.
 *
 * SCOPE NOTE - camelKey leakage: the same cold review flagged raw camelCase
 * simulationRules keys reaching prose (finding M1, ChroniclersLetterPanel). That
 * is a DIFFERENT surface whose fix is owner-gated (Wave 9) and would shift a
 * green golden, so it is NOT transformed here (mutating shared display text
 * would risk the golden-neutral contract). It is instead a DETECTED, banked
 * defect class in the guard - visible debt, not a silent rewrite.
 *
 * NAME NOTE: a same-named `normalizePlotHook` also lives in
 * src/generators/aiLayer.js. That one is generator-side (it reduces raw hooks to
 * prompt-ready text for the AI layer) and is intentionally left un-consolidated -
 * touching it would edit generator emission. The two are independent by design.
 */

/** The authored ' PLOT HOOK: ' marker a template prepends, tolerant of leading
 *  whitespace and case (' plot hook: ...'). */
const PLOT_HOOK_PREFIX_RE = /^\s*PLOT HOOK:\s*/i;

/**
 * Strip the authored ' PLOT HOOK: ' marker from a hook string and trim the ends.
 * Non-string input coerces to ''. This is byte-identical to the per-surface
 * strippers it replaces (domain/dossier/plotHooks.cleanHook and the tail of
 * components/new/tabs/ViabilityTab._cleanHook), so routing existing consumers
 * through it does not change their rendered output.
 *
 * @param {unknown} text - a hook string (or anything; non-strings become '').
 * @returns {string} the hook text with the authoring marker removed, trimmed.
 */
export function normalizePlotHook(text) {
  return String(text || '').replace(PLOT_HOOK_PREFIX_RE, '').trim();
}

/** 'the the ' / 'the a ' / 'the an ' - a lowercase doubled article. */
const DOUBLED_ARTICLE_LOWER_RE = /\bthe\s+(the|a|an)\s+/gi;
/** 'the The ' / 'the A ' / 'the An ' - a following CAPITALISED article, folded
 *  down to a single lowercase 'the '. */
const DOUBLED_ARTICLE_CAPS_RE = /\bthe\s+(The|A|An)\s+/g;

/**
 * Collapse a doubled article at a seam join - 'the the harbour district' or
 * 'the The harbour district' becomes 'the harbour district' - where a template's
 * leading 'the ' meets a token that already begins with an article. The two
 * passes mirror the generator-side cleanup (generators/historyGenerator.js and
 * generators/narrativeGenerator.js) exactly: the case-insensitive pass folds
 * lowercase pairs, then the cased pass folds a following capitalised article
 * down to a single lowercase 'the '. Non-string input coerces to ''.
 *
 * @param {unknown} text - prose that may contain a doubled article at a seam.
 * @returns {string} the prose with doubled articles collapsed.
 */
export function collapseDoubledArticles(text) {
  return String(text || '')
    .replace(DOUBLED_ARTICLE_LOWER_RE, 'the ')
    .replace(DOUBLED_ARTICLE_CAPS_RE, 'the ');
}
