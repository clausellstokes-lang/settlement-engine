/**
 * golden-corpus-key.mjs — THE ONE HOME for the golden-corpus key derivation.
 *
 * THE DEFECT THIS EXISTS TO MAKE IMPOSSIBLE. The 525-row golden manifest
 * (`tests/fixtures/generator-golden-master.json`) is keyed by a six-field join that lives
 * as a private arrow inside the golden test itself — `keyOf` in
 * `tests/property/generatorGoldenMaster.test.js`. Four consumers were each about to spell
 * that derivation again: the band census wanted `keyOf`/`rowFromKey`, the reader corpus
 * wanted `goldenKeyOf`/`configFromGoldenKey`, the clone census wanted its own private copy
 * inside a probe, and any headless runner wanted a fourth. Four spellings of one law is a
 * fork with a delay fuse: the day the golden corpus gains a seventh field, the manifest and
 * its readers disagree silently and every consumer reports a corpus it is not actually
 * reading.
 *
 * SO THE LAW IS WRITTEN ONCE, HERE, AND EVERY CONSUMER IMPORTS IT. The law is not invented
 * here — it is transcribed from the golden test's own arrow, which remains the authority:
 *
 *     const keyOf = (c) => [c.settType, c.culture, c.terrainOverride,
 *                           c.tradeRouteAccess, c.monsterThreat, c._seed].join('|');
 *
 * WHY THE MANIFEST KEYS AND NOT `corpus()`. A consumer that wants the corpus reads it FROM
 * THE MANIFEST KEYS, never by re-hoisting the golden test's private `corpus()` builder.
 * The two are one set by executed proof, not by convention: the golden's own arm asserts
 * `rows.map(keyOf).sort()` equals `Object.keys(manifest).sort()` on every gate, so a
 * consumer reading the keys is reading the corpus with the golden test standing guard over
 * the equality. Re-hoisting the builder would instead fork it, and a forked builder drifts
 * without ever failing.
 *
 * WHY A KEY ROUND-TRIPS LOSSLESSLY. The golden corpus is generated from a single `base`
 * config whose only varying members are exactly the five non-seed key fields, with the seed
 * folded in as the sixth. There is therefore no config information outside the key, and
 * `configFromGoldenKey` reconstructs a whole row rather than a partial one. Callers that
 * want to regenerate a row destructure the seed back out, exactly as the golden test does:
 * `const { _seed, ...cfg } = config`.
 *
 * WHY `scripts/lib/`. Zero imports, so it is importable from `scripts/` and `tests/` alike;
 * outside every Vite entry, so it costs neither ceiling a byte; and `scripts/lib/*.mjs` is
 * not one of the observed-shape reader's scanner-tool files, so a new module here owes no
 * schema rung.
 *
 * PURE: no I/O, no state, no clock. The callers read the manifest file.
 */

/**
 * The key's field order — the golden test's own law, transcribed.
 * @type {readonly ['settType', 'culture', 'terrainOverride', 'tradeRouteAccess', 'monsterThreat', '_seed']}
 */
export const GOLDEN_KEY_FIELDS = Object.freeze([
  'settType',
  'culture',
  'terrainOverride',
  'tradeRouteAccess',
  'monsterThreat',
  '_seed',
]);

/** The separator the golden manifest's keys are joined with. */
export const GOLDEN_KEY_SEPARATOR = '|';

/**
 * The key of a golden-corpus config. Byte-for-byte the golden test's `keyOf`: a missing or
 * nullish field joins as the empty string, because `Array.prototype.join` renders both
 * `null` and `undefined` that way and this derivation must not diverge from the arrow it
 * transcribes.
 *
 * @param {Record<string, unknown> | null | undefined} config
 * @returns {string}
 */
export function goldenKeyOf(config) {
  return GOLDEN_KEY_FIELDS
    .map((field) => String(config?.[field] ?? ''))
    .join(GOLDEN_KEY_SEPARATOR);
}

/**
 * The config a golden-corpus key names. Throws on any key that does not carry exactly the
 * six fields, because a caller that silently accepted five would generate a DIFFERENT
 * settlement and compare it against the manifest hash of another one — a false red that
 * reads like real drift.
 *
 * @param {string} key
 * @returns {{ settType: string, culture: string, terrainOverride: string, tradeRouteAccess: string, monsterThreat: string, _seed: string }}
 */
export function configFromGoldenKey(key) {
  if (typeof key !== 'string') {
    throw new TypeError(`golden key must be a string, got ${typeof key}`);
  }
  const parts = key.split(GOLDEN_KEY_SEPARATOR);
  if (parts.length !== GOLDEN_KEY_FIELDS.length) {
    throw new Error(
      `golden key must carry ${GOLDEN_KEY_FIELDS.length} fields separated by `
      + `'${GOLDEN_KEY_SEPARATOR}', got ${parts.length}: ${key}`,
    );
  }
  /** @type {Record<string, string>} */
  const out = {};
  GOLDEN_KEY_FIELDS.forEach((field, index) => {
    out[field] = parts[index];
  });
  return /** @type {ReturnType<typeof configFromGoldenKey>} */ (out);
}

/**
 * Every config the manifest names, in the manifest's own key order. The corpus, read from
 * the keys.
 *
 * @param {Record<string, unknown> | null | undefined} manifestJson
 * @returns {ReturnType<typeof configFromGoldenKey>[]}
 */
export function manifestRows(manifestJson) {
  return Object.keys(manifestJson || {}).map((key) => configFromGoldenKey(key));
}
