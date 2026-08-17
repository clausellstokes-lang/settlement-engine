/**
 * soakRules.mjs — THE SOAK SCRIPT'S EXTRACTED SEAMS (sk family, SK-0; ODQ §141, §143).
 *
 * WHY THIS FILE EXISTS AT ALL
 *   `whole-world-soak.mjs` is a top-level-await script that RUNS ON IMPORT. A test
 *   cannot import it to pin a composition rule without executing a soak — which
 *   ODQ §145.2 forbids outright and which no unit test should do anyway. Every
 *   decision the new harness seams make is therefore a PURE FUNCTION here, and the
 *   script is reduced to calling them.
 *
 * ⛔⛔ WHY IT LIVES IN `scripts/audit/` AND NOT IN `scripts/soak/`
 *   `REALM_SCALE_SOURCE_PATHS` (scripts/audit/realm-scale-certification.mjs) is
 *   `src`, `scripts/audit`, `tests/fixtures/spatialPackFixtures.js`, `package.json`,
 *   `package-lock.json`. It contains `scripts/audit` and does NOT contain
 *   `scripts/soak`. Code that decides what a soak MEASURES therefore has to sit
 *   inside the certification source fingerprint, or the fingerprint has a silent
 *   hole: a file could change the instrument while leaving the evidence's source
 *   identity unmoved. The general law, pinned in tests/soak-harness/soakScriptSeams.test.js:
 *
 *       scripts/soak/**  MAY import from  scripts/audit/**
 *       scripts/audit/** MAY NEVER import from  scripts/soak/**
 *
 * ⚠ THE FILE NAME IS NARROWER THAN ITS CONTENTS, DELIBERATELY. The compile
 *   reserved this one change path for SK-0's whole extraction, so the invocation
 *   refusals and the checkpoint identity block live here too rather than opening a
 *   second `scripts/audit` path. They belong on the same side of the fingerprint
 *   wall as the composition for exactly the reason above.
 *
 * PURE: no clock, no rng, no filesystem, no process exit. Callers do the I/O.
 */

/**
 * ⛔⛔ THE FLAG DOMAIN LIVES ON THIS SIDE OF THE WALL, AND IT HAS TO.
 *
 * SK-4's covering array must enumerate the flag space FROM the registry at runtime
 * (the closed-corpus law — ask the corpus, never hand-list). But the registry is
 * `src/domain/worldPulse/simulationRules.js`, and `scripts/soak/**` is inside the
 * engine/telemetry wall's Arm B, which REDS on any import specifier matching
 * `worldPulse|worldState|generateSettlementPipeline|simulationRules`. A runner module
 * importing the registry directly would be a wall violation.
 *
 * So the census is read HERE, in `scripts/audit/`, where the soak already legitimately
 * imports the preset, and `scripts/soak/flagConstraints.mjs` imports it from here. That
 * is the allowed direction (soak → audit, never the reverse), the wall stays intact, and
 * the enumeration stays a runtime read of the live registry rather than a copy.
 *
 * ⭐ MEASURED AT THIS BASE, and the arithmetic is asserted rather than asserted-about:
 * 25 normalizer-governed booleans + 32 preset-declared-but-ungoverned + 22 engine-gated
 * virtual = 79, with ZERO overlap. 54 of the 79 are outside the normalizer's fail-closed
 * coercion, which is the measured content of "the normalizer is NOT the oracle".
 */
export function flagDomainCensus({ defaults, presets, virtualKeys }) {
  const governed = Object.keys(defaults).filter((key) => typeof defaults[key] === 'boolean');
  const presetBooleans = new Set();
  const presetKeys = new Set();
  for (const preset of Object.values(presets)) {
    for (const [key, value] of Object.entries(preset.rules)) {
      presetKeys.add(key);
      if (typeof value === 'boolean') presetBooleans.add(key);
    }
  }
  const ungoverned = [...presetBooleans].filter((key) => !governed.includes(key));
  const virtual = [...virtualKeys];
  const union = [...new Set([...governed, ...ungoverned, ...virtual])];
  return {
    governed,
    ungoverned,
    virtual,
    union,
    nonBoolean: [...presetKeys].filter((key) => !presetBooleans.has(key)),
    // A key claimed by two sets would double-count the domain and silently shrink the
    // array's real coverage, so the overlap is REPORTED rather than assumed empty.
    overlap: virtual.filter((key) => governed.includes(key) || ungoverned.includes(key)),
  };
}

/**
 * The dark control's non-boolean overrides, verbatim from the literal block this
 * module replaced (`whole-world-soak.mjs:211-217` at `0cbb0177`). Held as a frozen
 * constant so the dark control has ONE spelling.
 */
export const DARK_NON_BOOLEAN_OVERRIDES = Object.freeze({
  presetId: 'behavioral_dark_control',
  propagationMode: 'off',
  migrationMode: 'void',
  worldProgression: 'dm_advanced',
  politicalAutonomy: 'dm_only',
});

/** The `--seasons` seam, unchanged in meaning: 'on' | 'off' | anything else. */
export function seasonsOverride(seasons) {
  if (seasons === 'on') return { seasonsEnabled: true };
  if (seasons === 'off') return { seasonsEnabled: false };
  return {};
}

/**
 * ⛔⛔ THE SINGLE HIGHEST-RISK RULE IN THE HARNESS (charter §0; annex SK.M1).
 *
 * `darkRules` is `Object.fromEntries(Object.entries(fullRules)…)`, so its KEY SET
 * IS `fullRules`'s KEY SET. An overlay applied ABOVE that derivation gives the dark
 * control an explicit `false` for every key the lit run declares. An overlay
 * applied BELOW it leaves those keys ABSENT from the dark control — and absence is
 * not falseness, not for the 25 booleans `normalizeSimulationRules` defaults, and
 * not for any engine read spelled `!== false`. The detector that would eventually
 * catch the damage is `conditionalStateLeaks` over ten worldState containers
 * against `maxConditionalStateLeaks: 0`, which is a whole soak away from the edit.
 *
 * So the overlay is spread INTO `fullRules`, on the line above the derivation, and
 * the key-set identity is pinned with a planted mutant that applies it after.
 *
 * @param {{preset: Record<string, unknown>, seasons?: string, overlay?: Record<string, unknown>}} input
 * @returns {{fullRules: Record<string, unknown>, darkRules: Record<string, unknown>}}
 */
export function composeSoakRules({ preset, seasons = 'preset', overlay = {} }) {
  const fullRules = {
    ...preset,
    ...seasonsOverride(seasons),
    ...overlay,
  };
  const darkRules = Object.fromEntries(Object.entries(fullRules).map(([key, value]) => (
    [key, typeof value === 'boolean' ? false : value]
  )));
  Object.assign(darkRules, DARK_NON_BOOLEAN_OVERRIDES);
  return { fullRules, darkRules };
}

/**
 * ⛔⛔ THE ADVANCE-EPOCH SEAM, AND IT IS THE STORE'S OWN SHAPE RATHER THAN A BYPASS
 * (ODQ §213.3 member F1; the EP-1 kernel guard).
 *
 * WHY IT EXISTS. `advanceEpochEnabled` joined the flag census as a virtual key, so SK-4's
 * covering array lawfully generates rows that light it. The kernel's `assertEpochPinnedInTest`
 * then REFUSES any fresh advance that runs with the rule strictly true and no threaded
 * `advanceEpoch` — by design, because a lit advance with no epoch composes the DARK seed
 * and silently replays the pre-wave future. The soak reached the world through
 * `simulateCampaignWorldInterval` without ever threading one, so 50 of 56 rows — 150 of
 * 168 cells — exited 1 at the FIRST pulse with no receipt (RS-2 F1).
 *
 * THE PRODUCTION SHAPE, mirrored term for term from `src/store/campaignAdvanceSession.js`'s
 * `runAdvanceCampaignWorld`:
 *
 *     const simulationRules = <the LIVE campaign's rules>;
 *     const epochLit = simulationRules?.advanceEpochEnabled === true;
 *     const advanceEpoch = epochLit ? (options.epoch || generateSeed()) : null;
 *
 * The soak takes the `options.epoch` arm — the SAME arm the store's own resume path takes
 * (`options.epoch || cursor.advanceEpoch`) and the same one every replay caller takes. It
 * is a caller-supplied epoch, not a disabled guard: the value stays ARGS-BORNE, the gate
 * stays a strict `=== true` read of the live rules, and nothing is read from ambience. The
 * `generateSeed()` arm is unavailable here for a reason that is about the instrument rather
 * than about taste — it is `Date.now()`-derived, and a soak whose nonce moved between run A
 * and run B would red its own byte-identical re-run property every time.
 *
 * ⭐ THE GRAIN IS THE ADVANCE, NEVER THE TICK, which is the orchestrator's own law
 * (`advanceInterval.js`: "ONE value rides EVERY composed tick … a per-tick nonce would be
 * destroyed by the interval collapse"). `runYears` calls the orchestrator once per YEAR, so
 * the year IS the advance and the nonce is keyed on it.
 *
 * ⚠ THE DERIVATION MUST NOT CARRY THE RUN LABEL, AND THAT IS LOAD-BEARING. Run B replays
 * run A's seed and must land on identical yearly composite hashes; a label-bearing nonce
 * would fork the two streams and red assertion 2. Seed and year are the whole key — which
 * is also what makes a `--restore-from` resume land on the very epoch its checkpointed
 * original ran under, so the restore stays a restore.
 *
 * @param {{simulationRules: Record<string, unknown>|null|undefined, seed: string, year: number}} input
 * @returns {string|null} the flag-gated term — null on every dark or legacy world
 */
export function soakAdvanceEpoch({ simulationRules, seed, year }) {
  const epochLit = simulationRules?.advanceEpochEnabled === true;
  return epochLit ? `soak::${String(seed)}::advance:${Number(year)}` : null;
}

/**
 * Parse `--lighting k=v,k=v`. `true`/`false` become booleans and a bare decimal
 * becomes a number; everything else stays a string. A malformed pair is REFUSED by
 * name rather than skipped, because a silently dropped flag is a soak that measured
 * something other than what its operator asked for.
 * @param {string} spec
 * @returns {{overlay: Record<string, unknown>, refusals: string[]}}
 */
export function parseLightingOverlay(spec) {
  const overlay = {};
  const refusals = [];
  for (const raw of String(spec || '').split(',')) {
    const pair = raw.trim();
    if (!pair) continue;
    const eq = pair.indexOf('=');
    if (eq <= 0 || eq === pair.length - 1) {
      refusals.push(`--lighting pair "${pair}" is not key=value`);
      continue;
    }
    const key = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      refusals.push(`--lighting key "${key}" is not a rule identifier`);
      continue;
    }
    if (value === 'true') overlay[key] = true;
    else if (value === 'false') overlay[key] = false;
    else if (/^-?\d+(\.\d+)?$/.test(value)) overlay[key] = Number(value);
    else overlay[key] = value;
  }
  return { overlay, refusals };
}

/**
 * The properties a run EARNED, computed rather than declared.
 *
 * ⛔ THIS IS THE `--skip-divergence` CURE (annex SK.M3). `properties` used to be an
 * all-or-nothing literal that always contained `seed_divergent`, and downstream
 * `realm-scale-certification.mjs` REQUIRES that property while
 * `certificationSchema.js` publishes it as a customer-facing clause ("told a
 * different tale on a different seed"). A naive `--skip-divergence` therefore had
 * exactly two outcomes: publish a property the run did not earn, or red the
 * realm-scale aggregate. Neither is acceptable, so the array is computed from what
 * actually executed, and the refusal below makes the case-directory route
 * structurally unreachable rather than merely discouraged.
 *
 * @param {{failures: string[], seedDivergenceExecuted: boolean}} input
 * @returns {string[]}
 */
export function soakProperties({ failures, seedDivergenceExecuted }) {
  if ((failures || []).length !== 0) return [];
  return [
    'no_crash',
    'rerun_identical',
    ...(seedDivergenceExecuted ? ['seed_divergent'] : []),
    'population_bounded',
    'isolated_worker_executed',
    'isolated_worker_output_identical',
  ];
}

/**
 * Every refusal the new seams owe, as ONE pure function so the script cannot honour
 * some and forget others. Returns the empty array when the invocation is lawful.
 *
 * @param {{skipDivergence?: boolean, caseId?: string, checkpointEvery?: string|number|null,
 *          restoreFrom?: string}} invocation
 * @returns {string[]}
 */
export function soakInvocationRefusals(invocation = {}) {
  const {
    skipDivergence = false,
    caseId = '',
    checkpointEvery = null,
    restoreFrom = '',
  } = invocation;
  const refusals = [];

  if (skipDivergence && caseId) {
    refusals.push(
      'REFUSED: --skip-divergence with --case-id. A realm-scale case receipt must carry '
      + 'seed_divergent (realm-scale-certification.mjs requires it and certificationSchema.js '
      + 'publishes it); a run that skipped the divergence pass cannot earn it.',
    );
  }
  if (checkpointEvery !== null && checkpointEvery !== '' && checkpointEvery !== undefined) {
    const years = Number(checkpointEvery);
    if (!Number.isInteger(years) || years < 1) {
      refusals.push(
        `REFUSED: --checkpoint-every ${JSON.stringify(checkpointEvery)} is not an integer >= 1. `
        + 'The year boundary is the only checkpoint-complete seam the engine exposes (SK.L3): '
        + 'PRNG stream position is closure state in src/kernel/prng.js and interior-tick state '
        + 'lives inside simulateCampaignWorldInterval, so a sub-year cadence is UNBUILDABLE '
        + 'without an engine edit.',
      );
    }
  }
  if (restoreFrom && caseId) {
    refusals.push(
      'REFUSED: --restore-from with --case-id. Checkpoint replay serves the FIX LOOP only — '
      + 'no official soak verdict, rung or phase-boundary run is ever computed from a restored '
      + 'run (§141 refused-by-name list, generalized).',
    );
  }
  return refusals;
}

/**
 * The identity block a checkpoint carries, so a restore into a DIFFERENT world is
 * refused instead of silently producing a run nobody can interpret.
 * @returns {Record<string, unknown>}
 */
export function checkpointIdentity({
  year, seed, years, settlements, sourceSha, nodeVersion, platform, arch, schemaVersion,
}) {
  return {
    year: Number(year),
    seed: String(seed),
    years: Number(years),
    settlements: Number(settlements),
    sourceSha: String(sourceSha || ''),
    nodeVersion: String(nodeVersion || ''),
    platform: String(platform || ''),
    arch: String(arch || ''),
    schemaVersion: Number(schemaVersion),
  };
}

/**
 * The three facts that must agree for a restore to BE a restore. Node version,
 * platform and arch are NOT in this set: a mismatch there is ENGINE-VARIANCE, which
 * the capsule layer reports separately, never a world-identity failure.
 * @returns {string[]}
 */
export const CHECKPOINT_IDENTITY_KEYS = Object.freeze(['seed', 'settlements', 'sourceSha']);

export function checkpointIdentityMismatch(identity, invocation) {
  const mismatches = [];
  for (const key of CHECKPOINT_IDENTITY_KEYS) {
    const stored = identity?.[key];
    const asked = invocation?.[key];
    // An EMPTY stored sourceSha is a mismatch, not a pass: a checkpoint that
    // recorded no source identity cannot testify that it came from this tree.
    if (String(stored ?? '') !== String(asked ?? '')) {
      mismatches.push(`${key}: checkpoint has ${JSON.stringify(stored ?? null)}, invocation asks ${JSON.stringify(asked ?? null)}`);
    }
  }
  return mismatches;
}

/**
 * The checkpoint payload, exactly what `runYears` threads forward and nothing else
 * (annex SK.M7): `{ campaign: { worldState, regionalGraph, wizardNews, … }, saves }`.
 * Everything else in the loop — yearlyMs, peakHeapUsedBytes, the per-year
 * observation arrays — is accumulated OUTPUT, not carried state, so including it
 * would make the checkpoint bigger and no more faithful.
 */
export function buildCheckpoint({ identity, campaign, saves }) {
  return { kind: 'whole_world_soak_checkpoint', identity, campaign, saves };
}

/**
 * ⛔⛔ THE SK.U1 CURE, AND WHY IT IS NOT THE SELF-REFERENTIAL ONE.
 *
 * MEASURED, not predicted: a year-boundary realm carries `undefined`-valued keys —
 * twelve distinct paths at the first executed probe, all in the settlement saves
 * (`activeChains[].entrepot`, `foodBalance.magicFoodNote`, `stress.icon`,
 * `institutions[].removedByWorldPulseOutcomeId`, …). `JSON.stringify` DROPS them, so
 * the round trip is NOT key-faithful, and `Object.keys(o).length` moves on those
 * objects. The composite hash cannot see any of it, because the hash is itself
 * stringify-based.
 *
 * The compile's signed fork (SK-2B′) assumed curing this needed an ENGINE-SIDE
 * serialization seam, which would be an `src/` edit and would flip the family's §0
 * classification. ⭐ THAT PREMISE IS REFUTED BY MEASUREMENT: the census already knows
 * the exact paths, so the writer records them and the reader RE-PLANTS them. The
 * restore becomes faithful because the thing is made true — not because the
 * instrument was made blind. Normalizing BOTH sides through a lossy round trip to
 * make the comparison pass would be making the instrument agree with itself, which is
 * the self-referential pin class this estate refuses; the census below still runs at
 * full strength AFTER the replant, and it is what proves the cure worked.
 *
 * ⚠ SEGMENT ARRAYS, NEVER DOTTED STRINGS. Real keys in a live realm contain dots and
 * colons (`relationshipStates['edge.soak-a.soak-b']`, rumour-ledger keys spelled
 * `trade:wizard_news.season.…`), so a dotted path could not be parsed back.
 *
 * @param {unknown} value
 * @returns {Array<Array<string|number>>}
 */
export function collectUndefinedKeyPaths(value) {
  /** @type {Array<Array<string|number>>} */
  const out = [];
  const ancestors = new Set();
  const walk = (node, trail) => {
    if (!node || typeof node !== 'object') return;
    if (ancestors.has(node)) return;
    if (node instanceof Map || node instanceof Set || node instanceof Date) return;
    ancestors.add(node);
    try {
      if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i += 1) walk(node[i], [...trail, i]);
        return;
      }
      for (const key of Object.keys(node)) {
        if (node[key] === undefined) { out.push([...trail, key]); continue; }
        walk(node[key], [...trail, key]);
      }
    } finally {
      ancestors.delete(node);
    }
  };
  walk(value, []);
  return out;
}

/**
 * Re-plant `undefined` at each recorded path. Returns how many landed and how many
 * could not be reached — a path that no longer resolves is REPORTED, never swallowed,
 * because a silently-skipped replant is the failure this cure exists to prevent.
 * @param {unknown} value
 * @param {Array<Array<string|number>>} paths
 */
export function replantUndefinedKeys(value, paths) {
  let planted = 0;
  const unreachable = [];
  for (const trail of Array.isArray(paths) ? paths : []) {
    let node = value;
    let ok = Array.isArray(trail) && trail.length > 0;
    for (let i = 0; ok && i < trail.length - 1; i += 1) {
      if (!node || typeof node !== 'object') { ok = false; break; }
      node = node[trail[i]];
    }
    if (!ok || !node || typeof node !== 'object') { unreachable.push(trail); continue; }
    node[trail[trail.length - 1]] = undefined;
    planted += 1;
  }
  return { planted, unreachable };
}

/**
 * ⛔ A DEEP KEY CENSUS, NOT A HASH (annex SK.U1 / F4; chair ruling §149.3).
 *
 * The composite hash the soak already computes is `JSON.stringify`-based, so it is
 * BLIND to exactly the loss a JSON round trip causes: a key whose value is
 * `undefined` is dropped by `JSON.stringify`, hashes identically, and still changes
 * `'k' in obj` and `Object.keys(o).length` inside the engine. A restore proof that
 * compared only hashes would be green and meaningless.
 *
 * This walks the object graph and returns a SORTED list of dotted key paths,
 * including keys whose value is `undefined`, plus a marker for the container class
 * (`Map`/`Set`/`Date` survive a round trip as `{}` or a string and must be visible).
 * Array indices collapse to `[]` so a length change shows up as a count, not as
 * thousands of distinct paths.
 *
 * ⚠⚠ THE CENSUS MUST BE ALIAS-INSENSITIVE, AND THE FIRST EXECUTED PROBE PROVED WHY.
 * A naive walker with ONE global `seen` set marks the SECOND arrival at a shared
 * object as a cycle and stops. A live realm is a DAG — the same reasons array is
 * referenced from two ledgers — while `JSON.stringify` duplicates every shared node,
 * so the round-tripped copy is a TREE. An alias-sensitive census therefore reports a
 * difference at every shared reference: the first run of this probe returned 36 lost
 * and 103 gained keys, of which only 12 were real. An instrument that drowns twelve
 * true findings in a hundred artifacts is worse than no instrument.
 *
 * So the cycle detector is the ANCESTOR STACK (a true cycle is a node that is its own
 * ancestor), and a shared-but-acyclic node is walked at every path it appears under.
 * The `(node, path)` memo is what keeps that from re-walking a shared subtree
 * exponentially; it bounds the work at roughly the size of the output.
 *
 * @param {unknown} value
 * @returns {string[]}
 */
export function deepKeyCensus(value) {
  const out = new Set();
  const ancestors = new Set();
  /** @type {WeakMap<object, Set<string>>} node → the paths it has already been walked at */
  const walkedAt = new WeakMap();
  const walk = (node, path) => {
    if (node === null) { out.add(`${path}=null`); return; }
    const type = typeof node;
    if (type !== 'object') { out.add(`${path}:${type}`); return; }
    // A CYCLE is a node that is its own ancestor. A merely SHARED node is not.
    if (ancestors.has(node)) { out.add(`${path}:cycle`); return; }
    let paths = walkedAt.get(node);
    if (!paths) { paths = new Set(); walkedAt.set(node, paths); }
    if (paths.has(path)) return;
    paths.add(path);
    ancestors.add(node);
    try {
      if (Array.isArray(node)) {
        out.add(`${path}:array[${node.length}]`);
        for (let i = 0; i < node.length; i += 1) walk(node[i], `${path}[]`);
        return;
      }
      if (node instanceof Map) { out.add(`${path}:Map[${node.size}]`); return; }
      if (node instanceof Set) { out.add(`${path}:Set[${node.size}]`); return; }
      if (node instanceof Date) { out.add(`${path}:Date`); return; }
      const keys = Object.keys(node).sort();
      out.add(`${path}:object{${keys.length}}`);
      for (const key of keys) {
        // The whole point: an `undefined` value still contributes its KEY.
        if (node[key] === undefined) { out.add(`${path}.${key}=undefined`); continue; }
        walk(node[key], `${path}.${key}`);
      }
    } finally {
      ancestors.delete(node);
    }
  };
  walk(value, '$');
  return [...out].sort();
}
