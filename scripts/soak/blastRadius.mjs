/**
 * blastRadius.mjs — THE DIFFERENTIAL RE-SOAK SCOPE, DERIVED (SK-3; ODQ §141.3).
 *
 * ⛔ DERIVED, NEVER HAND-SCOPED. After a fix, the cells that must re-run are the UNION of
 * three arms, any ONE of which is sufficient to include a cell:
 *
 *   1  the reverse-dependency closure of the changed files over the module graph,
 *      INCLUDING worker and dynamic-import edges. ⚠ A worker is a SEPARATE BUILD, so
 *      edges are classified by REFERENCES, not by static specifiers — the recorded TC-5bi
 *      lesson, where a seam minted a second compiler chunk that a static-specifier walk
 *      could not see.
 *   2  every coupling-registry row whose `flags` or `reads` intersect the change. The
 *      registry is SEVEN files, measured.
 *   3  a token-reference census of every changed exported symbol across the deterministic
 *      core — the barrel-hop catcher. The ES-Da lesson: one new coupling row moves three
 *      pins, and a differential that trusts static imports misses the back edge.
 *
 * ⛔⛔ AND IT REFUSES ITSELF. A differential that guesses is worse than no differential,
 * because it produces a green re-soak over the wrong cells and calls the fix proven. The
 * refusal conditions are ENUMERATED below, and a failed derivation is a FULL SOAK.
 *
 * ⛔ AT EVERY PHASE BOUNDARY THE FULL GRID RUNS REGARDLESS (SK.L4). The differential is an
 * accelerant BETWEEN boundaries, never a substitute AT one.
 */

/** The coupling registry, measured at this base — seven files, not one. */
export const COUPLING_REGISTRY_FILES = Object.freeze([
  'src/domain/certification/couplingRegistry.js',
  'src/domain/certification/couplingRegistryEspionage.js',
  'src/domain/certification/couplingRegistryGrammar.js',
  'src/domain/certification/couplingRegistryInfo.js',
  'src/domain/certification/couplingRegistrySchema.js',
  'src/domain/certification/couplingRegistryTrade.js',
  'src/domain/certification/couplingRegistryWar.js',
]);

/**
 * ⛔ THE REFUSE-TO-FULL SET, enumerated. Each entry names a change class whose blast
 * radius the three arms cannot bound honestly.
 */
export const REFUSE_TO_FULL_PATHS = Object.freeze([
  'src/kernel/',
  'src/domain/worldPulse/simulationRules.js',
  'package.json',
  'package-lock.json',
]);

export const REFUSE_TO_FULL_REASONS = Object.freeze({
  kernel: 'src/kernel/ is under everything — a kernel change has no bounded radius',
  rules: 'simulationRules.js defines the flag space itself; a change there re-scopes every cell',
  pipeline: 'a pipeline step-order change re-orders effects the closure cannot model',
  dependency: 'a dependency bump is a MINT TRIGGER (package.json/package-lock.json are governed) — the substrate moved, not the code',
  disagreement: 'the three arms disagreed on a file; a differential nobody can reconcile is a guess',
  error: 'the derivation itself errored — a failed derivation is a full soak, never a guess',
});

/**
 * @param {{changedFiles: string[], pipelineOrderChanged?: boolean,
 *          arms: {closure: string[], coupling: string[], tokens: string[]},
 *          derivationError?: string|null}} input
 * @returns {{mode: 'differential'|'full', reasons: string[], files: string[], arms: object}}
 */
export function deriveBlastRadius({
  changedFiles = [], pipelineOrderChanged = false, arms, derivationError = null,
}) {
  const reasons = [];
  if (derivationError) reasons.push(`${REFUSE_TO_FULL_REASONS.error}: ${derivationError}`);
  if (pipelineOrderChanged) reasons.push(REFUSE_TO_FULL_REASONS.pipeline);
  for (const file of changedFiles) {
    if (file.startsWith('src/kernel/')) reasons.push(REFUSE_TO_FULL_REASONS.kernel);
    if (file === 'src/domain/worldPulse/simulationRules.js') reasons.push(REFUSE_TO_FULL_REASONS.rules);
    if (file === 'package.json' || file === 'package-lock.json') reasons.push(REFUSE_TO_FULL_REASONS.dependency);
  }
  if (!arms || !Array.isArray(arms.closure) || !Array.isArray(arms.coupling) || !Array.isArray(arms.tokens)) {
    reasons.push(`${REFUSE_TO_FULL_REASONS.error}: an arm did not report`);
    return { mode: 'full', reasons: [...new Set(reasons)], files: [], arms: arms || {} };
  }
  // ⚠ DISAGREEMENT IS A REFUSAL, NOT A MERGE. The arms are meant to be REDUNDANT over the
  // deterministic core: a file that exactly one arm sees is a file some arm is blind to,
  // and blindness is what a differential cannot afford. A file NO arm sees is simply out
  // of scope; a file EVERY arm sees is the healthy case.
  const union = [...new Set([...arms.closure, ...arms.coupling, ...arms.tokens])].sort();
  const seenBy = (file) => [
    arms.closure.includes(file), arms.coupling.includes(file), arms.tokens.includes(file),
  ].filter(Boolean).length;
  const contested = union.filter((file) => seenBy(file) === 1 && file.startsWith('src/domain/'));
  if (contested.length) {
    reasons.push(`${REFUSE_TO_FULL_REASONS.disagreement}: ${contested.join(', ')}`);
  }
  if (reasons.length) return { mode: 'full', reasons: [...new Set(reasons)], files: union, arms };
  return { mode: 'differential', reasons: [], files: union, arms };
}

/**
 * ⭐ THE CONTROL SAMPLE. §141.3 names "a control sample" without a size, so the band is
 * DERIVED and its floor comes from the release profile's own recorded precedent:
 * `whole-world-soak.mjs` states "three release probes across two seed families and two
 * scale bands are enough to test the control oracle". The 10% term scales it with the grid.
 *
 * ⚠ THE DRAW IS A SEEDED, CONFIG-DERIVED PERMUTATION — never `Math.random`. A control
 * sample that differs between two derivations of one fix is not a control.
 */
export function controlSampleSize(gridSize) {
  return Math.max(3, Math.ceil(0.10 * Math.max(0, Number(gridSize) || 0)));
}

function fnv1a32(value) {
  let hash = 0x811c9dc5;
  const text = String(value);
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Draw the control sample. Composition rule: at least one cell from EACH seed family and
 * EACH scale band present in the grid — a control drawn entirely from one family tests
 * one family.
 */
export function drawControlSample(cells, { configHash }) {
  const size = controlSampleSize(cells.length);
  const ordered = [...cells].sort((a, b) => (
    fnv1a32(`${configHash}::${a.key}`) - fnv1a32(`${configHash}::${b.key}`)
  ));
  const picked = [];
  const familiesSeen = new Set();
  const bandsSeen = new Set();
  const familyOf = (cell) => String(cell.seed).split('-')[0];
  const bandOf = (cell) => String(cell.settlements);
  // Composition first: one from each family and each band, in the seeded order.
  for (const cell of ordered) {
    if (!familiesSeen.has(familyOf(cell)) || !bandsSeen.has(bandOf(cell))) {
      familiesSeen.add(familyOf(cell));
      bandsSeen.add(bandOf(cell));
      picked.push(cell);
    }
  }
  // Then fill to the band size in the same seeded order.
  for (const cell of ordered) {
    if (picked.length >= size) break;
    if (!picked.includes(cell)) picked.push(cell);
  }
  return {
    cells: picked.slice(0, Math.max(size, picked.length)),
    size,
    families: [...familiesSeen].sort(),
    bands: [...bandsSeen].sort(),
  };
}
