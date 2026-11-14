/**
 * stressNarrative.js — executable stressor summary text.
 *
 * A+ Track H (data-schema.3): these closures were previously embedded as
 * `summary: (r) => …` functions inside src/data/stressTypes.js, which forced
 * that pure-data file to `import { random } from rngContext` and to reference a
 * bare runtime-global `getInstFlags` via a `typeof getInstFlags == 'function'`
 * guard. The guard was ALWAYS FALSE under ESM (getInstFlags is never a global),
 * so the alternate branches never rendered (data-schema.6). They have been
 * removed here, keeping ONLY the text that actually rendered today, while the
 * instFlags param is now a real, explicitly-passed value.
 *
 * F8 (roll/render split): the summary is now produced in TWO phases so it can be
 * rendered with the settlement NAME, which is minted 16 steps after the stress
 * step rolls. resolveStress calls generateStress with an empty name, so the old
 * single-phase `stressSummary` baked prose like " is under active siege…" into
 * the persisted entry (bare leading `${name}` with name===''). We now:
 *   1. rollStressSummary(type, {rng})  — draws ONLY the rng-derived choice into a
 *      small JSON-serializable token, at the exact rng draw point of the old call.
 *   2. renderStressSummary(type, name, roll)  — pure text render, called again at
 *      assembly once the real name exists.
 * Only `wartime` draws rng (its `rng() < 0.45` profit coin); every other template
 * is rng-free, so the token is `null` for them and the draw order is byte-identical
 * to the old inline closures.
 */
import { drawDeclared, resolveSiblingSentences } from '../domain/facts/drawDeclared.js';

/**
 * #8 (STYLE-RULINGS §1(b), WAVE-RULINGS item 8; W4 PEOPLE second seat 2026-11-07): the migration's crisis
 * hook in TWO sets on W0's `stress[].direction`, never one for both. Kept here, beside the summary the
 * same direction picks, and not in `data/stressTypes.js`: only the generator reads it, and the data file
 * rides first paint. The type-level hook in STRESS_TYPE_MAP stays the catalogue's (it lists the kind).
 */
export const MIGRATION_HOOK_BY_DIRECTION = Object.freeze({
  arrivals: 'Someone has offered to find the newcomers work and a roof, for a price, and those in charge must decide whether to pay it.',
  departures: 'Someone is paying families to leave, and nobody yet knows who wants the houses they leave behind.',
});

/** mass_migration's food sentence, the key of its declared sibling set (STRESS_SUMMARY_SIBLINGS). */
const MIGRATION_FOOD = 'Newcomers arrive faster than housing, food and work can be found for them.';
/** wartime (loss)'s price sentence, the key of its declared sibling set (CENSUS-2d; the chair's answer 1, R-U). */
const WARTIME_PRICES = 'Food prices have doubled.';
/** plague_onset's healer sentence, the key of its declared sibling set. */
const PLAGUE_HEALERS = 'Healers are overwhelmed.';

/**
 * Roll the rng-derived choices for a stressor summary.
 *
 * Returns a small JSON-serializable token (or null) capturing any decision that
 * depends on the seeded stream, so the text can be re-rendered later with the real
 * settlement name WITHOUT re-drawing rng. Only `wartime` draws: its profit/loss
 * coin. The draw happens here, via the explicitly-passed rng, at the SAME point in
 * the pipeline the old inline `_rng()` fired — preserving draw order.
 *
 * @param {string} type - key from STRESS_TYPE_MAP (e.g. 'wartime')
 * @param {{ rng?: () => number }} [deps] - rng: the seeded draw (rngContext.random)
 * @returns {?Object} JSON-serializable roll token, or null for rng-free types
 */
export function rollStressSummary(type, { rng } = {}) {
  // wartime is the ONLY summary that consults rng.
  return type === 'wartime' ? { profit: rng() < 0.45 } : null;
}

/**
 * Render the one-paragraph summary for a stressor type.
 *
 * Pure: no rng, no globals. The 9 templates that lead with (or embed) a bare name
 * interpolate the REAL settlement name; the 5 that already guard keep their
 * `name || 'the settlement'` fallback; wartime branches on the pre-rolled token.
 *
 * @param {string} type - key from STRESS_TYPE_MAP
 * @param {string} [name] - the real settlement name (empty/undefined at roll time)
 * @param {?Object} [roll] - token from rollStressSummary (only wartime uses it)
 * @param {'arrivals'|'departures'} [direction] - the entry's own `direction` (mass_migration only;
 *   WIRING-W0, domain/migrationDirection.js); absent reads as arrivals, the §934.101 default
 * @param {object|null} [facts] - `factsOf(record)` at assembly (CENSUS-2c): a sentence of the
 *   paragraph that is a key of STRESS_SUMMARY_SIBLINGS resolves through its declaration, after the
 *   render and draw-free. Absent (the provisional roll-time render): every sentence is kept.
 *   MERGE-R2: both kept — W0's direction (the one fact) and the census's declared sentences.
 * @returns {string|undefined}
 */
export function renderStressSummary(type, name, roll, direction, facts = null) {
  const fn = RENDERERS[type];
  if (!fn) return undefined;
  const text = fn(name, roll, facts, direction);
  return facts ? resolveSiblingSentences(text, STRESS_SUMMARY_SIBLINGS, { facts, poolId: 'stressNarrative:STRESS_SUMMARY_SIBLINGS', surface: 'crisis', drawKind: 'T' }) : text;
}

/**
 * THE DECLARED SENTENCES OF THE STRESS NARRATIVE (CENSUS-2c; `docs/DESIGN_POOL_CENSUS.md` §3.1, the
 * chair's R-P 1). A sentence a renderer prints that presumes a fact the stressor alone does not
 * guarantee is a declared sibling set keyed by its own text: the original with its atoms, and its
 * twin (`twinOf`) — what the record DOES hold — reached only when the original is refused. A keyed
 * renderer does not re-declare its own stressor (R-B1). Each twin is the chair's ruling (R-G),
 * recorded in `docs/CENSUS_2_LANE_2026-11-04.md` "CENSUS-2c" with its share: a T cell, so a twin
 * moves only the births whose original is refused.
 * @type {Readonly<Record<string, ReadonlyArray<Readonly<{ text: string, crisis?: string[], needs?: string[], excludes?: string[], twinOf?: string }>>>>}
 */
export const STRESS_SUMMARY_SIBLINGS = Object.freeze({
  // mass_migration: "faster than … food … can absorb them" needs the food record's deficit (the
  // food record counts the influx at ×1.15, so a fed influx is FED: CENSUS-1c unit 7).
  [MIGRATION_FOOD]: Object.freeze([
    Object.freeze({ text: MIGRATION_FOOD, crisis: ['hunger'] }),
    Object.freeze({ text: 'Newcomers arrive faster than housing and work can be found for them.', twinOf: MIGRATION_FOOD, excludes: ['crisis: hunger'] }),
  ]),
  // plague_onset: "Healers are overwhelmed" needs a healer, an infirmary or a monastic house
  // (`factsOf(record).defence.healer`); most thorps and hamlets have none (Phase A's ledger).
  [PLAGUE_HEALERS]: Object.freeze([
    Object.freeze({ text: PLAGUE_HEALERS, needs: ['healer'] }),
    Object.freeze({ text: 'The sick outnumber those who can tend them.', twinOf: PLAGUE_HEALERS, excludes: ['healer'] }),
  ]),
  // wartime (loss): a doubled price is the food deficit speaking (R-U; the chair's answer 1 to
  // CENSUS-2c): the line needs `crisis: hunger`; a war fought on a secure food record takes what
  // the war takes that is not grain (the twin, the chair's ruling R-G).
  [WARTIME_PRICES]: Object.freeze([
    Object.freeze({ text: WARTIME_PRICES, crisis: ['hunger'] }),
    Object.freeze({ text: 'The army has the carts and the road, and the fields are short of hands.', twinOf: WARTIME_PRICES, excludes: ['crisis: hunger'] }),
  ]),
});

/**
 * Legacy single-call shim. Any caller not yet migrated to the roll/render split
 * keeps working: it rolls and renders in one shot. instFlags is accepted but
 * unused (no template consults it anymore).
 *
 * @param {string} type
 * @param {{ name?: string }} ctx
 * @param {{ rng?: () => number, instFlags?: object }} [deps]
 * @returns {string|undefined}
 */
export function stressSummary(type, ctx = {}, { rng } = {}) {
  return renderStressSummary(type, ctx?.name, rollStressSummary(type, { rng }));
}

const RENDERERS = {
  under_siege: (name) =>
    `Enemies are camped around ${name}, and nothing comes in by road. Inside, people argue over whether to hold out or give in.`,

  famine: (name) =>
    `${name} has lost its harvest for a second season. Rationing has begun, the wealthy are hoarding, and the children are visibly hungry.`,

  occupied: (name) =>
    `The forces of another power hold ${name}, and its own officials take their orders. Most people keep their heads down; a few fight back in secret.`,

  politically_fractured: (name) =>
    `Two or three powers each run part of ${name}, and none will give way. Daily life goes on, but nothing is done without asking whose side it helps.`,

  indebted: (name) =>
    `${name} owes an outside power more than it can ever repay, and the debt now decides what it can and cannot do.`,

  recently_betrayed: (name) =>
    `Someone trusted in ${name} sold something important, not long ago. Everyone knows it happened; nobody yet knows who, or how much was lost.`,

  infiltrated: (name) =>
    `Agents of an outside power have worked their way into ${name}, close to the people who decide things, and nobody there knows it.`,

  plague_onset: (name) =>
    `Something is spreading in ${name}. It is not yet a plague, but it will be if nothing changes. ${PLAGUE_HEALERS} The origin is disputed. Quarantine measures are being resisted.`,

  succession_void: (name) =>
    `${name}'s last strong leader died recently with no clear heir, and several people are racing to take the seat first.`,

  monster_pressure: (name) =>
    `Something in the country around ${name || 'the settlement'} has grown bolder: caravans go missing, and a farmstead was lost to fire last week. Its defences were built for quieter times.`,

  // insurgency: the old closure branched on `typeof getInstFlags == 'function'`
  // (ALWAYS FALSE under ESM) → only the else-branch ever rendered. data-schema.6:
  // dead branch removed; this is exactly that else-branch text.
  insurgency: (name) => {
    const h = name || "the settlement";
    return (
      "A strong power in " +
      h +
      " has stopped obeying the government. Its people stall, its taxes go unpaid, and it waits."
    );
  },

  // religious_conversion: three wordings, picked by the name's length (an H modulus). Variants 0
  // and 1 presume the old religious house (`institution: temple`; Phase A's ledger): with facts in
  // hand the pick runs through `drawDeclared` over the FULL list (the modulus unchanged), and a
  // refused pick resolves to the admitted variant by the kernel's hash — variant 2, the one that
  // presumes no building. No new wording. With no facts (the provisional render) the pick is kept.
  religious_conversion: (name, _roll, facts) => {
    const s = name || "the settlement";
    const o = name ? name.length % 3 : 0;
    const variants = RELIGIOUS_CONVERSION_VARIANTS(s);
    if (!facts) return variants[o].text;
    return drawDeclared(variants, { draw: (p) => p[o], facts, key: `stressNarrative:religious_conversion::${s}`, /* R-AT (CENSUS-1i unit 5): the settlement's name, not a constant */ poolId: 'stressNarrative:RELIGIOUS_CONVERSION', surface: 'crisis', drawKind: 'H', keepRefused: true }).text ?? variants[o].text; // R-AM: a kept beat is noted
  },

  // slave_revolt: presumes only what the key guarantees, enslaved people and their revolt (R-U; the
  // chair's answer 2 to CENSUS-2c). "The slave market's holding facilities have been breached"
  // presumed a slave market, which has no fact home (`institution: slave market` is listed under
  // "needs a home" in docs/CENSUS_2_LANE_2026-11-04.md "CENSUS-2d").
  slave_revolt: (name) =>
    "The enslaved population of " +
    (name || "the settlement") +
    " has organised. What began as work stoppages and passive resistance has moved into open defiance. Whole work gangs have downed tools and will not take them up again. The governing authority's first response was inadequate. Its second response is still being decided.",

  // wartime: the profit text names no garrison (lane DEFENSE-2, 2026-11-03). It is rendered from
  // the stress type and the place's name alone, with no roster in reach, so it says only what
  // is true of every place at war; "The garrison is reinforced and well-supplied" was printed on
  // places with no garrison.
  // wartime: the only summary that draws from rng. rollStressSummary made the draw
  // (`rng() < 0.45` → roll.profit) at the pipeline's draw point; this pure render
  // just branches on that pre-rolled token (the draw is unchanged; the profit text is not).
  wartime: (name, roll) => {
    const s = name || "the settlement";
    return roll?.profit
      ? s +
          " is in a kingdom at war and doing well out of it: army contracts pay, prices are high, and merchants with the right friends are getting rich. The bill will come later."
      : s +
          " is in a kingdom fighting a war it may not win. Conscription has taken a third of the working-age men. Supply caravans pass through on crown requisition. " + WARTIME_PRICES + " The governing authority is demanding sacrifice while certain families are quietly thriving on contracts.";
  },

  // mass_migration: the old closure used `typeof getInstFlags == 'function'` (ALWAYS
  // FALSE under ESM) so `(…getInstFlags…).economyOutput || 50` was always 50, making
  // the `>= 50` guard ALWAYS TRUE — the `_rng() < 0.5` term was short-circuited away
  // and NEVER evaluated. data-schema.6: the dead getInstFlags branch is removed AND
  // the never-reached rng term is dropped, so `d` is always true. This preserves both
  // the rendered text AND the rng draw count (the old `_rng()` never ran here).
  // WIRING-W0 (2026-11-07, R-W7 e): the text reads the entry's declared direction, never a score.
  // Arrivals is the one direction a drawn migration carries at birth; the departures text is for a
  // record that declares one (an authored entry, the campaign's ledger re-derive).
  mass_migration: (name, _roll, _facts, direction) => { // MERGE-R2: the census's facts ride third, W0's direction fourth
    const l = name || "The settlement";
    if (direction === "departures") {
      return (
        l +
        " is losing people faster than it can replace them. Households leave by the season, and those who go are the ones who could afford to. Fields, shops and offices are worked by fewer hands than they were built for."
      );
    }
    return (
      l +
      " is taking in more people than it has houses or work for. " + MIGRATION_FOOD + " The old residents and the new ones keep apart."
    );
  },
};

/**
 * religious_conversion's three wordings for one place (`s` = the name, or "the settlement"), in
 * the order the name's length picks them; ids are the old branch numbers. Variants 0 and 1 speak
 * of the old institution's buildings and its priest, so they declare the temple (CENSUS-2c).
 * @param {string} s
 * @returns {ReadonlyArray<{ id: number, text: string, needs?: string[] }>}
 */
function RELIGIOUS_CONVERSION_VARIANTS(s) {
  return [
    { id: 0, needs: ['institution: temple'], text: "A new faith is gaining ground in " + s + ". The old house keeps its buildings and its records, but each week its priest preaches to fewer people." },
    { id: 1, needs: ['institution: temple'], text: "The religious community of " + s + " has fractured. Both sides claim the legitimate succession. Both hold services. Both have a priest who will not acknowledge the other. The congregation has been forced to choose, and some of them have chosen neither." },
    { id: 2, text: "An outside authority is requiring " + s + " to convert. The governing power has formally complied. The population's compliance is more varied, more private, and more complicated than the official record shows." },
  ];
}
