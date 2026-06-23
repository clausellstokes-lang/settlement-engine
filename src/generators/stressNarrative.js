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
 * rng and instFlags are EXPLICIT parameters (no implicit module globals), so the
 * RNG draw happens at the same point, in the same order, producing byte-identical
 * output to the old inline closures.
 */

/**
 * Resolve the one-paragraph summary for a stressor type.
 *
 * @param {string} type  - key from STRESS_TYPE_MAP (e.g. 'famine')
 * @param {{ name?: string }} ctx - render context (settlement name)
 * @param {{ rng?: () => number, instFlags?: object }} [deps]
 *   rng       - the seeded draw (rngContext.random) — pass the SAME instance the
 *               pipeline uses so draw order is preserved.
 *   instFlags - getInstFlags(config, institutions) output. Real value now (the
 *               old code's `typeof getInstFlags` guard never bound it), but the
 *               rendered text below is the historical else-path, byte-identical.
 * @returns {string}
 */
export function stressSummary(type, ctx = {}, { rng, instFlags } = {}) {
  const name = ctx?.name;
  const fn = SUMMARIES[type];
  return fn ? fn(name, { rng, instFlags }) : undefined;
}

const SUMMARIES = {
  under_siege: (name) =>
    `${name} is under active siege. Land supply lines are cut or contested. Morale is fracturing under sustained pressure. Every decision carries the weight of survival.`,

  famine: (name) =>
    `${name} is in its second failed harvest season. Rationing has begun. The wealthy are hoarding. Children are visibly hungry.`,

  occupied: (name) =>
    `${name} is under the administrative control of an outside power. Locals comply outwardly, but resistance exists, distributed and careful.`,

  politically_fractured: (name) =>
    `${name} has no stable governing authority. Two or three factions each control part of the settlement and none will yield. Daily life continues, but every interaction has a political valence.`,

  indebted: (name) =>
    `${name} owes a debt it cannot repay to an external power: a merchant house, a noble, a guild confederation, or something older. The debt is now a leash.`,

  recently_betrayed: (name) =>
    `${name} was betrayed from within, recently enough that the wound hasn't closed. Someone trusted sold something important. The settlement knows it, but the full picture is not yet known.`,

  infiltrated: (name) =>
    `${name} has been quietly penetrated by an outside interest: enemy agents, a cult, a merchant intelligence network. The settlement does not know. Its decisions are already being steered.`,

  plague_onset: (name) =>
    `Something is spreading in ${name}. It is not yet a plague, but it will be if nothing changes. Healers are overwhelmed. The origin is disputed. Quarantine measures are being resisted.`,

  succession_void: (name) =>
    `The last strong leader of ${name} died recently. No one has consolidated authority. Power is there for whoever moves first, and several parties already know it.`,

  monster_pressure: () =>
    "Something in the surrounding region has grown bolder. Caravans are disappearing. A farmstead burned last week. Whether wolves, raiders, or worse, the settlement's defences are adequate for normal times, but these are not normal times.",

  // insurgency: the old closure branched on `typeof getInstFlags == 'function'`
  // (ALWAYS FALSE under ESM) → only the else-branch ever rendered. data-schema.6:
  // dead branch removed; this is exactly that else-branch text.
  insurgency: (name) => {
    const h = name || "the settlement";
    return (
      "A powerful faction in " +
      h +
      " has decided the current government is illegitimate. The challenge is quiet, institutional, and dangerous. Not street fighting but the systematic withdrawal of cooperation."
    );
  },

  religious_conversion: (name) => {
    const s = name || "the settlement";
    const o = name ? name.length % 3 : 0;
    return o === 0
      ? "A new faith is gaining ground in " +
          s +
          ". The old religious institution still holds its buildings and its records, but it is losing the congregation. The priest gives a service on Sunday to a room that is quietly, consistently, slightly emptier than the week before."
      : o === 1
        ? "The religious community of " +
          s +
          " has fractured. Both factions claim the legitimate succession. Both hold services. Both have a priest who will not acknowledge the other. The congregation has been forced to choose, and some of them have chosen neither."
        : "An outside authority is requiring " +
          s +
          " to convert. The governing faction has formally complied. The population's compliance is more varied, more private, and more complicated than the official record shows.";
  },

  slave_revolt: (name) =>
    "The enslaved population of " +
    (name || "the settlement") +
    " has organised. What began as work stoppages and passive resistance has moved into open defiance. The slave market's holding facilities have been breached. The governing authority's first response was inadequate. Its second response is still being decided.",

  // wartime: the only summary that draws from rng. The draw happens here, via the
  // explicitly-passed rng, at the same point as the old inline `_rng()` call —
  // preserving draw order and byte-identical output.
  wartime: (name, { rng }) => {
    const s = name || "the settlement";
    return rng() < 0.45
      ? s +
          " is in a kingdom at war and currently positioned to profit. Military contracts are flowing. The garrison is reinforced and well-supplied. Prices are high and merchants with the right connections are getting richer. The cost will come due; it always does. But for now, the war is good for business."
      : s +
          " is in a kingdom fighting a war it may not win. Conscription has taken a third of the working-age men. Supply caravans pass through on crown requisition. Food prices have doubled. The governing authority is demanding sacrifice while certain families are quietly thriving on contracts.";
  },

  // mass_migration: the old closure used `typeof getInstFlags == 'function'` (ALWAYS
  // FALSE under ESM) so `(…getInstFlags…).economyOutput || 50` was always 50, making
  // the `>= 50` guard ALWAYS TRUE — the `_rng() < 0.5` term was short-circuited away
  // and NEVER evaluated. data-schema.6: the dead getInstFlags branch is removed AND
  // the never-reached rng term is dropped, so `d` is always true. This preserves both
  // the rendered text AND the rng draw count (the old `_rng()` never ran here).
  mass_migration: (name) => {
    const l = name || "The settlement";
    return (
      l +
      " is receiving more people than its infrastructure was built for. New arrivals come faster than housing, food, and employment can absorb them. The old residents and the new ones are not yet the same community."
    );
  },
};
