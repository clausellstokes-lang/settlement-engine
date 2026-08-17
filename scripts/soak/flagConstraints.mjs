/**
 * flagConstraints.mjs — THE MINTED CONSTRAINT MANIFEST (SK-4; ODQ §143.2).
 *
 * ⛔ MEASURED: NO MACHINE-READABLE CONSTRAINT SOURCE EXISTS. The constraints that govern
 * the flag space live in four places, and only ONE of them is enforced by code:
 *
 *   1  `normalizeSimulationRules` — enforces exactly TWO families (the faithSpread ↔
 *      religionDynamics lockstep and the profile-materialization group). It spreads
 *      `...input`, so the 22 engine-gated virtual keys pass through UN-VALIDATED and 32
 *      preset-declared booleans are never coerced. **The normalizer is NOT the oracle.**
 *   2  code conjunctions (`settlementPoliticsEnabled === true && factionCompetitionEnabled === true`)
 *   3  COMMENTS ALONE ("Nested under warLayerEnabled")
 *   4  the exclusion set (owner-gated flags, derived keys, identity metadata)
 *
 * So the manifest is MINTED here — harness-side, fixture-pinned, shrink-guarded. Every
 * row is TYPED and carries its SOURCE and its RATIONALE, because a constraint whose
 * provenance nobody recorded is a constraint the next reader will delete.
 *
 * ⛔ AN INVALID COMBINATION IS A FALSE-FINDING FACTORY. A row that lights a child under a
 * dark parent produces a cell whose subsystem never ran; the finding it yields is about
 * the harness, not the world.
 *
 * ⭐ §85.4 IS **NOT OWED**, AND THAT IS A MEASUREMENT, NOT AN ASSUMPTION. The compile
 * flagged this conditionally (OQ-7) without the clause text. Read at this base, §85.4
 * prices two obligations on "any wave minting a SEEDED CHOOSER OR POOL": (a) a
 * decision-fork classification row in the habit fork registry, whose walker scans
 * `src/domain`, and (b) a mechanism-coverage baseline row, whose walker enumerates
 * `src/domain/worldPulse` modules. This manifest draws no random number, registers no
 * decision fork, and lights no worldPulse mechanism — it is a typed constraint table
 * under `scripts/soak/`. Neither obligation attaches.
 */

export const CONSTRAINT_KINDS = Object.freeze([
  'lockstep', 'requires', 'excluded-with-rationale', 'non-boolean', 'harness-companion',
]);

/**
 * `lockstep` — from the normalizer, the ONE machine-enforced source.
 */
export const LOCKSTEP_ROWS = Object.freeze([
  Object.freeze({
    kind: 'lockstep',
    keys: Object.freeze(['faithSpreadEnabled', 'religionDynamicsEnabled']),
    source: 'simulationRules.js normalizeSimulationRules — the faith lockstep',
    rationale: 'One value written to both keys; the LEGACY key is authoritative when explicitly boolean. Varying them independently produces rows the normalizer collapses on the way in.',
  }),
  Object.freeze({
    kind: 'lockstep',
    keys: Object.freeze(['politicalAutonomy', 'majorChangesRequireProposal']),
    source: 'simulationRules.js — next.majorChangesRequireProposal = next.politicalAutonomy !== \'full\'',
    rationale: 'The second is DERIVED from the first whenever the profile materializes, so it is not a free variable at all.',
  }),
  Object.freeze({
    kind: 'lockstep',
    keys: Object.freeze([
      'worldProgression', 'politicalAutonomy', 'spatialMode', 'travelMode', 'infoMode', 'profileVersion',
    ]),
    source: 'simulationRules.js PROFILE_KEYS — the profile-materialization group',
    rationale: 'Touching ANY of the six materializes ALL of them; touching NONE deletes all six from the output. They move as one group or not at all.',
  }),
]);

/**
 * `requires` — from code conjunctions and from COMMENTS, which is exactly why they must
 * be minted: a comment is not a constraint source any generator can read.
 */
export const REQUIRES_ROWS = Object.freeze([
  ['warEconomyDrainEnabled', ['warLayerEnabled'], 'DEFAULT_SIMULATION_RULES comment: "Nested under warLayerEnabled"'],
  ['warDispositionEnabled', ['warLayerEnabled'], 'DEFAULT_SIMULATION_RULES comment: nested under warLayerEnabled'],
  ['warLevyEnabled', ['warLayerEnabled'], 'DEFAULT_SIMULATION_RULES comment: nested under warLayerEnabled'],
  ['warSupplyQualityEnabled', ['warLayerEnabled'], 'DEFAULT_SIMULATION_RULES comment: nested under warLayerEnabled'],
  ['believedConditionsEnabled', ['beliefAxesEnabled'], 'ENGINE_GATED_VIRTUAL_RULE_KEYS comment: a CONJUNCTION with beliefAxesEnabled — a family cannot be lit under dark axes'],
  ['believedDevotionEnabled', ['beliefAxesEnabled'], 'ENGINE_GATED_VIRTUAL_RULE_KEYS comment: conjunction with beliefAxesEnabled'],
  ['believedScarcityEnabled', ['beliefAxesEnabled'], 'ENGINE_GATED_VIRTUAL_RULE_KEYS comment: conjunction with beliefAxesEnabled'],
  ['espionageEnabled', ['errandSpineEnabled', 'beliefAxesEnabled'], 'the same block: a THREE-DOOR conjunction (beliefs live, the errand spine lit, then the flag)'],
  ['settlementPoliticsEnabled', ['factionCompetitionEnabled'], 'the code conjunction settlementPoliticsEnabled === true && factionCompetitionEnabled === true'],
].map(([key, parents, source]) => Object.freeze({
  kind: 'requires', key, parents: Object.freeze(parents), source,
  rationale: 'A row lighting this key under a dark parent runs a subsystem that never engaged; its finding would be about the harness.',
})));

/** `excluded-with-rationale` — each exclusion states WHY, or it is just a deletion. */
export const EXCLUDED_ROWS = Object.freeze([
  Object.freeze({
    kind: 'excluded-with-rationale', key: 'majorChangesRequireProposal',
    source: 'simulationRules.js profile materialization',
    rationale: 'Derived from politicalAutonomy whenever the profile materializes. A free variable here generates rows the normalizer immediately overwrites — a false-finding factory.',
  }),
  Object.freeze({
    kind: 'excluded-with-rationale', key: 'religionDynamicsEnabled',
    source: 'simulationRules.js faith lockstep',
    rationale: 'A mirror of faithSpreadEnabled. Free-varying it doubles every faith row and collapses on normalize.',
  }),
  ...['presetId', 'schemaVersion', 'profileVersion'].map((key) => Object.freeze({
    kind: 'excluded-with-rationale', key,
    source: 'identity and metadata keys',
    rationale: 'Identity and metadata, not a switch. Varying it changes what the run CALLS itself, never what it does.',
  })),
]);

/**
 * `non-boolean` — held at their preset value across the array. Varying mixed-arity
 * factors is a DIFFERENT instrument and a separate, chair-signed act.
 */
export const NON_BOOLEAN_ROWS = Object.freeze([
  ['propagationMode', ['off', 'local', 'first_order', 'full'], 'enum-coerced by normalizeSimulationRules'],
  ['intensity', ['conservative', 'normal', 'dramatic'], 'enum-coerced by normalizeSimulationRules'],
  ['migrationMode', ['roll', 'void', 'distributed', 'concentrated'], 'enum-coerced by normalizeSimulationRules'],
  ['worldProgression', null, 'coerced only inside the profile-materialization branch'],
  ['politicalAutonomy', null, 'coerced only inside the profile-materialization branch'],
  ['infoMode', null, 'coerced only inside the profile-materialization branch'],
  ['spatialMode', null, 'coerced only inside the profile-materialization branch'],
  ['travelMode', null, 'coerced only inside the profile-materialization branch'],
  ['profileVersion', null, 'coerced only inside the profile-materialization branch'],
  ['narrativeTempo', null, 'preset-declared and NEVER coerced'],
  ['realmMagicDefault', null, 'preset-declared and NEVER coerced'],
  ['presetId', null, 'preset-declared and NEVER coerced'],
  ['schemaVersion', null, 'preset-declared and NEVER coerced'],
].map(([key, values, source]) => Object.freeze({
  kind: 'non-boolean', key, values: values ? Object.freeze(values) : null, source,
  rationale: 'Held at its preset value across the array; a covering array over mixed-arity factors is a different instrument.',
})));

/**
 * `harness-companion` — THE FIFTH KIND, AND IT IS AN INCLUSION ROW RATHER THAN AN
 * EXCLUSION (chair disposition (a), ODQ §213.3 member F1).
 *
 * ⛔ THE CLASS IT NAMES. Some flags are not merely a switch the engine reads: lighting them
 * obliges the CALLER to thread a companion VALUE on the same call. `advanceEpochEnabled` is
 * the first of them — the kernel's `assertEpochPinnedInTest` refuses a fresh advance that
 * runs with the rule strictly true and no `advanceEpoch` argument, because a lit advance
 * with no epoch composes the DARK seed and silently replays the pre-wave future. That guard
 * is the engine working as designed; the gap was the HARNESS's.
 *
 * ⛔ WHY THIS IS NOT AN `excluded-with-rationale` ROW. Excluding the key would have been the
 * cheap disposition and it would have bought a permanently unmeasured flag: the array would
 * stop varying the one key whose whole purpose is to change the stream a re-advance draws
 * from, and the certification row for it could then only ever grade UNOBSERVED. The chair
 * ruled the other way — the flag must be able to light LAWFULLY in a soak cell — so the row
 * below records the OBLIGATION and names the seam that discharges it, and the key stays a
 * full varying factor of the covering array.
 *
 * ⚠ THE ROW IS NOT SELF-PROVING AND MUST NEVER BE READ AS IF IT WERE. It names a seam; the
 * evidence that the seam EXISTS and is wired is a source pin over the soak script
 * (tests/soak-harness/soakScriptSeams.test.js). A companion row whose seam was deleted
 * would otherwise be a comment claiming a cure — the exact shape RS-2 F1 found in the
 * opposite direction, a census key with no disposition at all.
 */
export const HARNESS_COMPANION_ROWS = Object.freeze([
  Object.freeze({
    kind: 'harness-companion',
    key: 'advanceEpochEnabled',
    companion: 'advanceEpoch',
    seam: 'scripts/audit/soakRules.mjs soakAdvanceEpoch — threaded by whole-world-soak.mjs into simulateCampaignWorldInterval and into the isolated-worker payload',
    source: 'src/domain/clock.js assertEpochPinnedInTest, armed from src/domain/worldPulse/pulseKernel.js when the rule is strictly true on a FRESH advance',
    rationale: 'Lighting this key without threading its args-borne companion does not produce a wrong finding — it produces NO finding, because the cell exits 1 at the first pulse with no receipt at all (RS-2 F1: 150 of 168 cells). The harness discharges the obligation the way the store mint does, so the row is an inclusion with an obligation rather than an exclusion.',
  }),
]);

/**
 * ⭐⭐ THE SHRINK GUARD EARNED ITS KEEP ON ITS FIRST EXECUTED RUN, and this list is what
 * it found. The compile listed `neutralNeighborsEnabled` as an `excluded-with-rationale`
 * row. Executed against the live census, it is not in the domain AT ALL — it is declared
 * on neither `DEFAULT_SIMULATION_RULES`, nor any preset, nor
 * `ENGINE_GATED_VIRTUAL_RULE_KEYS`; it is added only to the ONE_REGEN spread. An
 * exclusion row for a key that was never included is a row pointing at nothing, and the
 * manifest's own defect scan convicted it.
 *
 * It is NOT simply deleted, because the knowledge is real and load-bearing: this flag is
 * OWNER-GATED and must never become a grid axis. It is recorded as a DECLARED ABSENCE
 * with its own pin — the same idiom the wall walker uses for an awaiting root. If a
 * future change puts it into a preset, the absence pin REDS and somebody has to decide
 * deliberately, rather than the flag drifting silently into the covering array.
 */
export const OWNER_GATED_ABSENT = Object.freeze([
  Object.freeze({
    key: 'neutralNeighborsEnabled',
    source: 'simulationRules.js — a virtual flag of the WAVES class, added only to the ONE_REGEN spread',
    rationale: 'OWNER-GATED, and absent from the flag census at this base. The harness never varies an owner-gated switch; that is a signature act, not a grid axis. If it enters the census, this row must become a live exclusion.',
  }),
]);

export const CONSTRAINT_MANIFEST = Object.freeze([
  ...LOCKSTEP_ROWS, ...REQUIRES_ROWS, ...EXCLUDED_ROWS, ...NON_BOOLEAN_ROWS,
  ...HARNESS_COMPANION_ROWS,
]);

/** Every key the array may vary: the union census minus every excluded key. */
export function varyingFactors(census, manifest = CONSTRAINT_MANIFEST) {
  const excluded = new Set(manifest
    .filter((row) => row.kind === 'excluded-with-rationale' || row.kind === 'non-boolean')
    .map((row) => row.key));
  return census.union.filter((key) => !excluded.has(key));
}

/** The `requires` graph, as `key -> parents`. */
export function requiresGraph(manifest = CONSTRAINT_MANIFEST) {
  return new Map(manifest.filter((row) => row.kind === 'requires').map((row) => [row.key, row.parents]));
}

/**
 * ⛔ EFFECTIVE, not merely assigned. A key whose `requires` parent is off in this row is
 * STRUCTURALLY DARK: the row assigns it `true`, and the engine never lights it. Pair
 * coverage credited on such a key is coverage the grid does not actually have.
 */
export function isEffective(row, key, graph = requiresGraph()) {
  if (row[key] !== true) return false;
  for (const parent of graph.get(key) || []) {
    if (row[parent] !== true) return false;
    if (!isEffective(row, parent, graph)) return false;
  }
  return true;
}

/**
 * ⭐ THE ALL-ON ROW IS RECAST AS THE MAXIMAL-LAWFUL ROW (the L2 idiom): the runtime census
 * minus the exclusion set, with every `requires` parent forced on. A literal all-on row
 * over a space with owner-gated and derived keys is not the maximum — it is an invalid
 * combination wearing the maximum's name.
 */
export function maximalLawfulRow(census, manifest = CONSTRAINT_MANIFEST) {
  const row = {};
  for (const key of varyingFactors(census, manifest)) row[key] = true;
  for (const [, parents] of requiresGraph(manifest)) {
    for (const parent of parents) row[parent] = true;
  }
  return row;
}

/** All-off stays the dark control, unchanged. */
export function darkControlRow(census, manifest = CONSTRAINT_MANIFEST) {
  return Object.fromEntries(varyingFactors(census, manifest).map((key) => [key, false]));
}

/**
 * The manifest's own defect scan. SHRINK-GUARDED: a row whose named key no longer exists
 * in the live census is a constraint pointing at nothing, and it REDS rather than being
 * quietly skipped.
 * @returns {string[]}
 */
export function manifestDefects(census, manifest = CONSTRAINT_MANIFEST, absent = OWNER_GATED_ABSENT) {
  const defects = [];
  const known = new Set([...census.union, ...census.nonBoolean]);
  // A declared absence that has become PRESENT is a decision somebody owes, so it reds.
  for (const row of absent) {
    if (known.has(row.key)) {
      defects.push(`${row.key}: declared ABSENT from the flag census but is now present — it must become a live exclusion row or a grid axis, deliberately`);
    }
  }
  for (const row of manifest) {
    if (!CONSTRAINT_KINDS.includes(row.kind)) defects.push(`${row.kind}: kind is outside the vocabulary`);
    if (!String(row.source || '').trim()) defects.push(`${row.key || row.keys}: no source`);
    if (String(row.rationale || '').length < 20) defects.push(`${row.key || row.keys}: no rationale`);
    // A companion row that names no VALUE and no SEAM is a row asserting an obligation
    // nobody can discharge — worse than no row, because it reads as a disposition.
    if (row.kind === 'harness-companion') {
      if (!String(row.companion || '').trim()) defects.push(`${row.key}: a harness-companion row names no companion value`);
      if (!String(row.seam || '').trim()) defects.push(`${row.key}: a harness-companion row names no seam that threads its companion`);
    }
    for (const key of row.keys || [row.key]) {
      if (!known.has(key)) defects.push(`${key}: named by a ${row.kind} row but absent from the live flag census`);
    }
    for (const parent of row.parents || []) {
      if (!known.has(parent)) defects.push(`${parent}: named as a requires parent but absent from the live flag census`);
    }
  }
  return defects;
}
