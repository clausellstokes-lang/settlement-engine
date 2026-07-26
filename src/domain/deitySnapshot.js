/**
 * Pure deity-snapshot authority.
 *
 * Assignment resolves authored content outside the simulation, then embeds this
 * bounded record so headless event, generation, and pulse consumers never read
 * the account library. Keeping the builder in domain lets both UI/store intent
 * paths and deterministic preview fixtures share one source without reversing
 * the engine's dependency direction.
 */

/**
 * Build the self-contained deity snapshot from an authored deity record.
 *
 * @param {{
 *   name?:unknown,
 *   alignmentAxis?:unknown,
 *   temperamentAxis?:unknown,
 *   rankAxis?:unknown,
 *   lawAxis?:unknown,
 *   domain?:unknown,
 * }} raw
 */
export function deitySnapshotFrom(raw) {
  return {
    name: raw.name,
    alignmentAxis: raw.alignmentAxis,
    temperamentAxis: raw.temperamentAxis,
    rankAxis: raw.rankAxis,
    // A legacy three-axis deity has no law axis. The event embed path defaults
    // the absent value to neutral, so old definitions remain deterministic.
    lawAxis: raw.lawAxis,
    ...(raw.domain ? { domain: raw.domain } : {}),
  };
}
