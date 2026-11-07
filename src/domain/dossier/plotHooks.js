import { compareCodepoint } from '../deterministicSort.js';
import { hookTruthViolations, settlementHookFacts, speakHookTruthfully } from '../coherence/hookTruth.js';
import { traditionHook } from '../traditions/prose.js';
import { factsOf } from '../facts/factsOf.js';
import { normalizePlotHook, plotHookText } from '../../lib/proseSeams.js';
import { themeOfText } from '../hookThemes.js';
import { createConflictHookDraw, foodGapHookLine } from './hookLines.js';
import { retainHooks, retentionKey, editedHookTextKeys } from './hookRetention.js';
import { crisisHooksOf } from '../crisis/crisisHooks.js';
import { effectiveCastOf } from '../crisis/crisisCast.js';

const TENSION_LABELS = Object.freeze({
  crime_wave: 'Crime Wave',
  economic_disparity: 'Economic Disparity',
  guild_conflict: 'Guild Conflict',
  infiltration_fear: 'Infiltration Fear',
  leadership_vacuum: 'Leadership Vacuum',
  magical_controversy: 'Magical Controversy',
  occupation_legacy: 'Occupation Legacy',
  outside_debt: 'External Debt',
  resource_scarcity: 'Resource Scarcity',
  succession_crisis: 'Succession Crisis',
});

const EVENT_LABELS = Object.freeze({
  disaster: 'Disaster',
  political: 'Political',
  economic: 'Economic',
  religious: 'Religious',
  magical: 'Magical',
  demographic: 'Demographic',
  exile_return: 'Exile & Return',
  occupation_infiltration: 'Occupation',
});

export const PLOT_HOOK_CATEGORIES = Object.freeze({
  npc: { color: '#2a3a7a', label: 'NPCs' },
  faction: { color: '#8b1a1a', label: 'Factions' },
  tension: { color: '#b8860b', label: 'Tensions' },
  economics: { color: '#a0762a', label: 'Economy' },
  safety: { color: '#5a2a8a', label: 'Safety' },
  history: { color: '#1a4a2a', label: 'History' },
  // ⚠ KEPT FOR THE VOCABULARY, NO LONGER EMITTED (chair ruling X-2, 2026-10-30): a
  // relationship's `tension` is a fact of the tie and lives on the Relationships tab beside
  // it. The entry stays so DS-HK-1's 7-for-7 category identity and any stored hook that
  // still carries the token keep a colour and a label.
  relationship: { color: '#5a3a1a', label: 'Relationships' },
});

/**
 * THE PAGE EACH HOOK'S SOURCE FACT LIVES ON (chair ruling X-2 / RULINGS-T1 Plot Hooks). The
 * Plot Hooks tab is the hooks' one home and groups its cards by that page, under a caption
 * naming it, so a DM can see which page holds the fact a hook grows from. Keyed on the
 * collector's own category; traditions ride the `tension` category and are told apart by
 * the source label the collector writes for them. Labels are the strip's own tab labels.
 * @type {ReadonlyArray<{ id: string, label: string }>}
 */
export const PLOT_HOOK_SOURCE_PAGES = Object.freeze([
  Object.freeze({ id: 'npcs', label: 'NPCs' }),
  Object.freeze({ id: 'relationships', label: 'Relationships' }),
  Object.freeze({ id: 'history', label: 'History' }),
  Object.freeze({ id: 'traditions', label: 'Traditions' }),
  Object.freeze({ id: 'viability', label: 'Outlook' }),
  Object.freeze({ id: 'defense', label: 'Defense' }),
]);

/** @type {Readonly<Record<string, string>>} */
const SOURCE_PAGE_OF_CATEGORY = Object.freeze({
  npc: 'npcs',
  faction: 'relationships',
  relationship: 'relationships',
  tension: 'history',
  history: 'history',
  economics: 'viability',
  safety: 'defense',
});

/**
 * The source page of one hook, as an entry of PLOT_HOOK_SOURCE_PAGES.
 * @param {{ category?: unknown, source?: unknown }|null|undefined} hook
 * @returns {{ id: string, label: string }}
 */
export function plotHookSourcePage(hook) {
  const id = hook?.source === 'Traditions'
    ? 'traditions'
    : (SOURCE_PAGE_OF_CATEGORY[String(hook?.category ?? '')] || 'history');
  return PLOT_HOOK_SOURCE_PAGES.find((page) => page.id === id) || PLOT_HOOK_SOURCE_PAGES[2];
}

/**
 * The hooks grouped by source page, in PLOT_HOOK_SOURCE_PAGES order, each group keeping the
 * collector's own order. Empty pages are absent.
 * @template {{ category?: unknown, source?: unknown }} H
 * @param {ReadonlyArray<H>} hooks
 * @returns {Array<{ page: { id: string, label: string }, hooks: H[] }>}
 */
export function groupPlotHooksBySourcePage(hooks) {
  /** @type {Map<string, H[]>} */
  const byPage = new Map();
  for (const hook of hooks || []) {
    const { id } = plotHookSourcePage(hook);
    if (!byPage.has(id)) byPage.set(id, []);
    /** @type {H[]} */ (byPage.get(id)).push(hook);
  }
  return PLOT_HOOK_SOURCE_PAGES
    .filter((page) => byPage.has(page.id))
    .map((page) => ({ page, hooks: /** @type {H[]} */ (byPage.get(page.id)) }));
}

/**
 * A raw hook as produced by the generators: either a bare string, or an object
 * carrying the prose under `hook`/`text` (plus optional category/severity).
 * @typedef {string | { hook?: unknown, text?: unknown, category?: unknown, severity?: unknown }} PlotHookRaw
 */

/**
 * A normalized dossier plot hook.
 * @typedef {Object} PlotHook
 * @property {string} text
 * @property {string} [source]
 * @property {string} [role]
 * @property {(string|null)} [sub]
 * @property {string} category
 * @property {number} priority
 * @property {boolean} [accent]
 * @property {Array<{ kind: string, label: unknown, id: unknown }>} [links]
 * @property {string} [crisis] the crisis kind a crisis hook belongs to (absent on every other hook)
 */

// Hook-prefix cleanup is the shared display chokepoint (src/lib/proseSeams.js);
// `normalizePlotHook` here is byte-identical to the local `cleanHook` it replaced.

// ── Anti-repetition: the aggregator owns final cross-tab uniqueness ───────────
// Generators keep their OWN source varied (the settlement-scoped draw registry in
// npcGenerator; see hookVariety.js). collectPlotHooks is the single point where
// every source converges, so it owns the guarantee that the DM never reads the
// same hook twice ACROSS tabs — by two layers of dedup on the priority-sorted
// list, keeping the first (highest-priority) occurrence.
//
// Echo prefixes: historyGenerator reframes older present-tense hooks as archival
// discoveries ("Old records suggest …"). Those are paraphrase VARIANTS of one hook
// family, so the family key strips them before comparing — otherwise the same beat
// reads once live and once reframed. A match list, never printed (CENSUS-1e: row 91); the printed copy
// in historyGenerator.js is ruled {colour} (CENSUS-2e, R-R).
const ECHO_PREFIXES = [
  // W5 HIS (2026-11-07): the five tellings the generator now prints, then the five it printed before,
  // so a saved page's hooks still fold to their family.
  'an old story from that time: ',
  'a letter found this year tells it this way: ',
  'families who lived through it tell it this way: ',
  'the records of that time say: ',
  'what survives from that time says: ',
  'old records suggest ',
  'a recently surfaced document implies ',
  'family accounts passed down from the time claim ',
  "an archivist's notes from that period reveal ",
  'evidence that survived the years indicates ',
];

/** Exact-text key: identical prose, modulo case/whitespace/edge punctuation.
 *  Delegates to the estate's ONE fold (hookThemes.hookThemeKey, re-exported here
 *  as hookRetention.retentionKey) — byte-identical to the local spelling it
 *  replaces, and now impossible to drift away from the theme lookup and the
 *  protected-key sets that must agree with it about what "the same hook" means.
 *  @param {unknown} text @returns {string} */
function normHookText(text) {
  return retentionKey(text);
}

/** Family key: the exact-text key with known reframing prefixes stripped, so
 *  paraphrase variants of one authored hook collapse to a single family.
 *  @param {unknown} text @returns {string} */
function hookFamilyId(text) {
  let key = normHookText(text);
  for (const prefix of ECHO_PREFIXES) {
    if (key.startsWith(prefix)) { key = key.slice(prefix.length); break; }
  }
  return key.trim();
}

/**
 * Drop cross-tab repeats from a priority-sorted hook list, keeping the FIRST
 * (highest-priority) occurrence. A hook is dropped when either its exact text OR
 * its family id has already been kept — belt-and-suspenders: exact-text catches
 * identical prose emitted by two sources; the family layer additionally catches
 * reframed variants of the same authored beat.
 * @param {PlotHook[]} sorted
 * @returns {PlotHook[]}
 */
function dedupeHooks(sorted) {
  /** @type {Set<string>} */ const seenText = new Set();
  /** @type {Set<string>} */ const seenFamily = new Set();
  /** @type {PlotHook[]} */ const out = [];
  for (const hook of sorted) {
    const textKey = normHookText(hook.text);
    const familyKey = hookFamilyId(hook.text);
    if (!textKey) continue;
    if (seenText.has(textKey) || seenFamily.has(familyKey)) continue;
    seenText.add(textKey);
    seenFamily.add(familyKey);
    out.push(hook);
  }
  return out;
}

// ── THE TRUTH GATE: A HOOK CHECKS THE PLACE BEFORE IT SPEAKS ─────────────────
// (the chair's rulings 1, 2 and 4, 2026-11-03; docs/GENERATION_ROOT_CAUSES_2026-11-02.md
// traces 1, 4 and 8.) Measured on this lane's 120-settlement corpus BEFORE the gate: 36 of
// 120 settlements read "The settlement is starving. Villagers are turning to banditry…"
// while the engine's own food analysis called them Import-Dependent with 1.9 months of
// grain in store; 5 of 5 "N days of reserves" hooks printed the harvest share × 30 rather
// than the store; 4 named soldiers where no force existed; 21 called the residents of a
// town, city or metropolis "villagers"; 4 of 60 small places read "the town's leaders".
//
// ⚠ THIS IS THE DISPLAY'S DOOR, NOT THE WRITER'S CURE, AND THE DIFFERENCE IS RECORDED.
// The sentences are stored on the RECORD by writers this lane does not own —
// `src/generators/economy/foodBalance.js :: deriveSupplyRiskAnalysis` (the food crisis and
// the reserves figure), `src/generators/power/conflicts.js :: buildConflictPlotHooks` (the
// two fixed conflict hooks), `src/data/historyData.js` (the "town's leaders" line) — so the
// collector, which is the ONE point every surface's hooks pass through, is where a false
// sentence can be refused today. `src/domain/coherence/hookTruthFindings.js ::
// hookTruthFindings` reports the record's own remaining debt so the cure at the writer is
// not quietly papered over by this gate.
//
// WHAT IT DOES, IN ORDER: reword what is merely mis-worded (the stored figure, the tier
// noun), then REFUSE what the record contradicts outright. A display layer may not invent
// the fact that would make a claim true, so a refused hook is dropped, not rewritten
// (HK-LAW-1 — drop or redraw, never rewrite).

/** @type {RegExp} */
// The two fixed conflict sentences `buildConflictPlotHooks` writes unconditionally: one
// naming nobody at all, one wearing the two faction names. Matched narrowly, by the shape
// the writer gives them, so a flag-conditioned conflict hook (which IS specific, and true)
// passes through untouched. SWITCH THIS to a drawn library at the writer when the engine
// side opens; the matcher is this lane's door, not a preference.
const FIXED_CONFLICT_HOOK = /^Evidence has surfaced suggesting a third party is deliberately escalating the tension between the two factions\.$|^A neutral figure is being pressured by both .+ to take a side before .+\.$/;

/**
 * @param {PlotHook[]} out
 * @param {Record<string, unknown>} hook
 */
function push(out, hook) {
  const text = normalizePlotHook(hook.text);
  if (!text) return;
  out.push(/** @type {PlotHook} */ ({
    ...hook,
    text,
    category: hook.category || 'tension',
    priority: Number.isFinite(hook.priority) ? hook.priority : 5,
    accent: Boolean(hook.accent),
  }));
}

/**
 * Every collected hook, spoken as this place may speak it.
 *
 * A hook whose only fault is a word is REWORDED (the stored figure, the tier noun); a hook
 * the record contradicts is REFUSED. When the refusal takes the place's only food hook away
 * and the record still shows a real gap, one drawn food-gap line takes its slot, so a place
 * with a shortfall still hands the DM a food hook — the chair's ruling 1: a grain-price hook
 * for a moderate gap, nothing for a fed place.
 *
 * @param {PlotHook[]} collected
 * @param {import('../coherence/hookTruth.js').HookFacts} facts
 * @param {PlotHookSettlement} settlement
 * @returns {PlotHook[]}
 */
function speakHooks(collected, facts, settlement) {
  /** @type {PlotHook[]} */
  const out = [];
  let refusedFamine = false;
  let keptFoodHook = false;
  for (const hook of collected) {
    const text = speakHookTruthfully(hook.text, facts);
    const violations = hookTruthViolations(text, facts);
    if (violations.length > 0) {
      if (violations.some((finding) => finding.code === 'famine_words_on_a_fed_place')) {
        refusedFamine = true;
      }
      continue;
    }
    if (hook.category === 'economics' && /\bgrain\b|\bfood\b|\bharvest\b/i.test(text)) {
      keptFoodHook = true;
    }
    out.push(text === hook.text ? hook : /** @type {PlotHook} */ ({ ...hook, text }));
  }
  if (refusedFamine && !keptFoodHook && facts.foodGap) {
    push(out, {
      text: foodGapHookLine({ name: settlement.name, band: facts.foodBand }, () => factsOf(settlement)),
      source: 'Economy',
      role: '',
      category: 'economics',
      priority: 7,
    });
  }
  return out;
}

/**
 * @typedef {Object} PlotHookNpc
 * @property {PlotHookRaw[]} [plotHooks]
 * @property {string} [name]
 * @property {string} [role]
 * @property {string} [title]
 * @property {string} [factionAffiliation]
 * @property {string} [influence]
 * @property {number} [power]
 * @property {string} [id]
 */
/**
 * @typedef {Object} PlotHookConflict
 * @property {PlotHookRaw[]} [plotHooks]
 * @property {string} [intensity]
 * @property {string[]} [parties]
 * @property {string} [issue]
 */
/**
 * @typedef {Object} PlotHookTension
 * @property {PlotHookRaw[]} [plotHooks]
 * @property {string} [type]
 * @property {string} [description]
 */
/**
 * @typedef {Object} PlotHookRelationship
 * @property {string} [tension]
 * @property {string} [npc1Name]
 * @property {string} [npc2Name]
 * @property {string} [npc1Id]
 * @property {string} [npc2Id]
 * @property {string} [npc1Role]
 * @property {string} [npc2Role]
 * @property {string} [typeName]
 * @property {string} [type]
 * @property {(string|number)} [strength]
 * @property {boolean} [flagDriven]
 */
/**
 * @typedef {Object} PlotHookEvent
 * @property {PlotHookRaw[]} [plotHooks]
 * @property {string} [type]
 * @property {number} [yearsAgo]
 * @property {boolean} [anchored]
 */
/**
 * @typedef {Object} PlotHookSettlement
 * @property {string} [name]
 * @property {PlotHookNpc[]} [npcs]
 * @property {PlotHookConflict[]} [conflicts]
 * @property {{ currentTensions?: PlotHookTension[], historicalEvents?: PlotHookEvent[], [key: string]: unknown }} [history]
 * @property {PlotHookRelationship[]} [relationships]
 * @property {{ plotHooks?: PlotHookRaw[] }} [economicViability]
 * @property {{ safetyProfile?: { plotHooks?: PlotHookRaw[] } }} [economicState]
 * @property {unknown[]} [traditions]  THE TRADITIONS mirror (T-5) — outcome/relation hooks
 * @property {unknown} [stress]  the crisis container: one entry or a list, each carrying its `cast`
 */

/**
 * The crisis container as a list of entries (one entry, a list, or nothing).
 * @param {unknown} stress
 * @returns {Array<{ type?: unknown, label?: unknown, cast?: unknown }>}
 */
function crisisEntriesOf(stress) {
  const list = Array.isArray(stress) ? stress : stress && typeof stress === 'object' ? [stress] : [];
  return list.filter((e) => !!e && typeof e === 'object');
}

/** The link kinds a hook card can carry. */
const CRISIS_LINK_KINDS = new Set(['npc', 'faction']);

/**
 * @param {PlotHookSettlement} [settlement]
 * @param {{ retention?: boolean }} [options] `retention: true` engages the HK-2
 *   theme-retention layer (src/domain/dossier/hookRetention.js). It is OFF by
 *   default and every existing caller leaves it off, so this function's output
 *   is byte-identical to its pre-HK-2 output — see the seam note at the tail.
 * @returns {PlotHook[]}
 */
export function collectPlotHooks(settlement = {}, options = {}) {
  /** @type {PlotHook[]} */
  const hooks = [];
  const facts = settlementHookFacts(settlement);
  const drawConflictHook = createConflictHookDraw(() => factsOf(settlement));

  // ── THE CRISIS HOOKS, FIRST (the HOOKS-UNDER-STRESS lane, SOAK-1000 §3) ─────────────────
  // Each active crisis adds the hooks its cast derives (`src/domain/crisis/crisisHooks.js ::
  // crisisHooksOf`): one naming a line role's holder with the role's reason, one naming the lever
  // and the faction that loses. They are read off the cast HERE, never stored, and off the cast
  // the page shows (`effectiveCastOf`: the DM's word where the DM spoke). They are collected
  // ahead of every other source and marked `crisis`, and the sort below keeps them first, so the
  // place's own hooks are the floor of the count and not the whole. A calm place has no entry,
  // so nothing here runs for it.
  crisisEntriesOf(settlement.stress).forEach((entry) => {
    const kind = typeof entry.type === 'string' ? entry.type : '';
    const label = typeof entry.label === 'string' && entry.label ? entry.label : 'Crisis';
    const { cast } = effectiveCastOf(/** @type {never} */ (settlement), /** @type {never} */ (entry));
    crisisHooksOf(settlement, { type: kind, cast }, facts).forEach((hook) => {
      push(hooks, {
        text: hook.text,
        source: label,
        role: '',
        category: 'tension',
        priority: 10,
        accent: true,
        crisis: kind,
        links: hook.link && CRISIS_LINK_KINDS.has(hook.link.kind) ? [{ kind: hook.link.kind, label: hook.link.label, id: hook.link.id }] : [],
      });
    });
  });

  (settlement.npcs || []).forEach((npc) => {
    (npc.plotHooks || []).forEach((hook) => push(hooks, {
      text: plotHookText(hook),
      source: npc.name || 'NPC',
      role: npc.role || npc.title || '',
      sub: [
        npc.factionAffiliation,
        npc.influence === 'high' ? 'High influence' : npc.influence === 'moderate' ? 'Moderate influence' : null,
      ].filter(Boolean).join(' · '),
      category: 'npc',
      priority: npc.power || (npc.influence === 'high' ? 8 : 5),
      accent: npc.influence === 'high',
      links: [{ kind: 'npc', label: npc.name, id: npc.id || npc.name }],
    }));
  });

  (settlement.conflicts || []).forEach((conflict) => {
    const intensity = conflict.intensity || 'moderate';
    // ONE HOOK PER CONFLICT, CHOSEN (the chair's ruling 3). The two sentences
    // `buildConflictPlotHooks` writes for every conflict in the estate are replaced by one
    // line drawn from this issue's own library, naming both parties and the issue from the
    // record; the writer's FLAG-CONDITIONED hooks are specific already and ride through.
    const stored = (conflict.plotHooks || []).map((hook) => normalizePlotHook(plotHookText(hook)));
    const specific = stored.filter((text) => !FIXED_CONFLICT_HOOK.test(text));
    const texts = specific.length === stored.length
      ? stored
      : [...drawConflictHook(conflict), ...specific];
    texts.forEach((hook) => push(hooks, {
      text: hook,
      source: (conflict.parties || []).join(' vs ') || 'Conflict',
      role: conflict.issue || '',
      sub: `${intensity} tension`,
      category: 'faction',
      priority: intensity === 'high' ? 9 : intensity === 'low' ? 5 : 7,
      accent: intensity === 'high',
      links: (conflict.parties || []).filter(Boolean).map(party => ({ kind: 'faction', label: party, id: party })),
    }));
  });

  (settlement.history?.currentTensions || []).forEach((tension) => {
    const label = TENSION_LABELS[/** @type {keyof typeof TENSION_LABELS} */ (tension.type)] || tension.type || 'Tension';
    (tension.plotHooks || []).forEach((hook) => push(hooks, {
      text: plotHookText(hook),
      source: label,
      // Full description — tension prose runs ~95 chars and the role renders
      // small/muted; a hard slice left mid-word fragments ('…resist investi').
      role: typeof tension.description === 'string' ? tension.description : '',
      category: 'tension',
      priority: 7,
    }));
  });

  // ⛔ NO RELATIONSHIP-TENSION CATEGORY (chair ruling X-2, 2026-10-30). A relationship's
  // `tension` is a FACT of the tie, not a hook: it renders on the Relationships tab beside
  // its tie, and the Plot Hooks collector no longer repeats it as a card.

  (settlement.economicViability?.plotHooks || []).forEach((hook) => {
    const h = /** @type {{ hook?: unknown, text?: unknown, category?: unknown, severity?: unknown }} */ (typeof hook === 'object' && hook ? hook : { hook });
    push(hooks, {
      text: plotHookText(h),
      source: h.category || 'Economy',
      role: '',
      sub: ['high', 'critical'].includes(/** @type {string} */ (h.severity)) ? `${h.severity} severity` : null,
      category: 'economics',
      priority: h.severity === 'critical' ? 9 : h.severity === 'high' ? 8 : 7,
      accent: h.severity === 'critical' || h.severity === 'high',
    });
  });

  (settlement.economicState?.safetyProfile?.plotHooks || []).forEach((hook) => push(hooks, {
    text: plotHookText(hook),
    source: 'Safety & Crime',
    role: '',
    category: 'safety',
    priority: 8,
  }));

  (settlement.history?.historicalEvents || []).forEach((event) => {
    const label = EVENT_LABELS[/** @type {keyof typeof EVENT_LABELS} */ (event.type)] || EVENT_LABELS.political;
    (event.plotHooks || []).forEach((hook) => push(hooks, {
      text: plotHookText(hook),
      source: `${label} Event`,
      role: event.yearsAgo ? `${event.yearsAgo}y ago` : '',
      sub: event.anchored ? 'Still affecting this settlement' : null,
      category: 'history',
      priority: event.anchored ? 7 : 5,
      accent: Boolean(event.anchored),
    }));
  });

  // THE TRADITIONS wave (T-5) — outcome/relation-conditioned hooks off the festival
  // register (settlement.traditions MIRROR). A failed/cancelled/triumphant festival, a
  // rite suppressed under an overlord / just liberated / carried in by settlers each raise
  // a seeded hook. Absent mirror (dark / draft) ⇒ nothing added, byte-identical.
  (settlement.traditions || []).forEach((rec) => {
    const hook = traditionHook(/** @type {Parameters<typeof traditionHook>[0]} */ (rec), { town: settlement.name, facts: () => factsOf(settlement) });
    if (!hook) return;
    push(hooks, {
      text: hook.text,
      source: 'Traditions', // the source label marks these; they ride the existing 'tension' category
      role: hook.source, // the tradition's name
      category: 'tension',
      priority: hook.priority,
      accent: hook.priority >= 8,
    });
  });

  // THE TRUTH GATE runs before the sort, so a reworded sentence is the one the dedupe
  // folds on and a refused one never competes for a slot.
  const spoken = speakHooks(hooks, facts, settlement);

  // Sort by priority (then category, for a stable tiebreak), THEN dedupe so the
  // kept instance of any repeated hook is always the highest-priority one. A crisis hook
  // leads every other (the first key); between two hooks that are not crisis hooks the first
  // key is 0, so a calm place's order is the order it always had.
  const sorted = spoken.sort((a, b) => (Number(Boolean(b.crisis)) - Number(Boolean(a.crisis)))
    || b.priority - a.priority || compareCodepoint(a.category, b.category));
  const deduped = dedupeHooks(sorted);

  // ── HK-2 SEAM (dark by default) ────────────────────────────────────────────
  // Layer 3 — theme retention — runs only when a caller asks for it. It is off
  // by default and no caller in the tree turns it on yet, so the line above is
  // still this function's answer and every consumer (the three tabs, the PDF
  // view model, the briefs, the quick guide, tonight-at-the-table) is
  // byte-unmoved. The measurement behind that caution is in the HK-2 report:
  // at the §5 K defaults this layer drops 15% of a hamlet's hooks and 40% of a
  // metropolis's, because K caps typed survivors at K × |HOOK_THEMES| rather
  // than at a share of the settlement. Lighting it is an owner-signed K away,
  // not a rewrite — everything below is built, tested, and waiting.
  if (!options.retention) return deduped;
  return /** @type {PlotHook[]} */ (retainHooks(deduped, {
    themeOf: (hook) => themeOfText(hook.text),
    editedTextKeys: editedHookTextKeys(/** @type {import('../userEdits.js').EditableEntity} */ (settlement)),
    // HK-LAW-4's set is EMPTY here, and deliberately so: no hook in this estate
    // anchors an escalation clock. deriveEscalationClocks derives every clock
    // from supply-chain state and faction profiles — it never references a hook
    // — so there is no join to read, and inventing one by keyword-matching hook
    // prose to clock stages is exactly the fuzzy classification HK-LAW-3 bans.
    // Reported, not papered over; retainHooks honours the set the day one exists.
    scaleBand: /** @type {{ tier?: unknown }} */ (settlement).tier,
  }));
}

/**
 * @param {PlotHook[]} [hooks]
 * @returns {Record<string, number>}
 */
export function countPlotHookCategories(hooks = []) {
  return hooks.reduce((/** @type {Record<string, number>} */ acc, hook) => {
    acc[hook.category] = (acc[hook.category] || 0) + 1;
    return acc;
  }, {});
}
