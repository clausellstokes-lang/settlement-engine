/**
 * writer-reach-lit-corpus.mjs — THE LIT-DIAL ARM (HORIZON §7.1, §7.5 Car 3).
 *
 * ── THE CLASS THIS EXISTS FOR ────────────────────────────────────────────────
 * OSR's corpus generates worlds at the SHIPPED dials. A generation dial that has
 * not been rolled forward therefore writes NOTHING the corpus can observe: the
 * key is absent, and an absent key is not a DARK identity — it is not an identity
 * at all. So the writer walker cannot see the dial-gated family, and a key that is
 * written, gated and unread would be invisible to the very instrument built to
 * find writers with no readers.
 *
 * This module builds a SECOND corpus at the LIT versions of every dial and
 * subtracts the dark one. What survives is `dialGated`: the identities a lit world
 * writes and a shipped world does not. Every one of them owes a `generation-dial`
 * row, and every `generation-dial` row must be in this set — set equality BOTH
 * ways, which makes dormancy an EXECUTED BIT (present lit, absent dark) rather
 * than a version comparison somebody wrote down once.
 *
 * ── ⚠ WHY A SEPARATE CORPUS, AND NEVER A DIAL FLIP ──────────────────────────
 * THE PROMISE forbids re-rolling a fixed reference world silently. The arm passes
 * explicit dial values on its OWN in-memory configs and never touches
 * `NEW_SETTLEMENT_*`; the walker's own corpus is untouched and is pinned
 * byte-identical beside this one. A dial flip would change every seeded draw in
 * the estate, which is precisely the act the corpus builder's own note refuses.
 *
 * ── THE MAT RETRO-CONTROL ───────────────────────────────────────────────────
 * `customContentRoster on settlement` is the textbook case: at the pre-MAT base
 * the key did not exist; from the MAT pick onward the pipeline writes it behind
 * `livingContentRosterFor(...)`, gated, and nothing in `src/` reads it. It must
 * appear in `dialGated` and carry a row. If it ever appears in the DARK corpus
 * too, the dial has been rolled and the row must die with its premise.
 *
 * @see docs/DESIGN_HORIZON.md §7.1, §7.5  (the charter; on the ledger line)
 */
import { join } from 'node:path';

import { ROOT, CONFIGS, SEEDS, foldCorpus } from './observed-shape-corpus.mjs';
import { writerIdentity } from './writer-reach-scan.mjs';

/**
 * Build the corpus a world generated at every LIT dial would write.
 * Producer 1 only (the generation entry over CONFIGS x SEEDS) — the pulse and the
 * steading mint add no dial-gated key, and 16 generations cost about half a second.
 */
export async function buildLitDialCorpus({ configs = CONFIGS, seeds = SEEDS, root = ROOT, rollDials = true } = {}) {
  const { generateSettlementPipeline } = await import(`${root}/src/generators/generateSettlementPipeline.js`);
  const { DENSITY_LAW_CONFIG_KEY, REGISTER_VII_DENSITY_LAW_VERSION } =
    await import(`${root}/src/domain/density/densityLaw.js`);
  const { LIVING_CONTENT_LAW_CONFIG_KEY, ROSTER_LIVING_CONTENT_LAW_VERSION } =
    await import(`${root}/src/domain/content/livingContentLawVersion.js`);
  const { eligibleCustomContent } = await import(`${root}/src/domain/customContentSchema.js`);
  const { customContentReferencePack } = await import(`${root}/tests/fixtures/customContentReferencePack.js`);
  // ⚠ THE LIT PATH HAS A LOADING PRECONDITION THE DARK PATH DOES NOT, and the lit
  // arm is the first caller in the estate to meet it. `livingContentRosterFor`
  // answers dormant-or-lit SYNCHRONOUSLY and throws
  // `[livingContentSeam] v2 world, roster payload not loaded` when the dial is at
  // v2 and nobody has registered the builder. That is by design: the roster module
  // is loaded by a DYNAMIC import so its closure stays out of the eager
  // `engine-core` chunk (a direct import moved the first-paint closure
  // 1,045,910 -> 1,095,584 against a 1,047,000 ceiling). So a lit-dial corpus must
  // await the loader exactly as a lit browser session does. Idempotent and memoized.
  const { loadLivingContentRoster } = await import(`${root}/src/domain/content/livingContentSeam.js`);
  await loadLivingContentRoster();

  const pack = customContentReferencePack();
  const roots = [];
  const dials = rollDials ? {
    [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION,
    [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION,
  } : {};
  const dialConfigKeys = [DENSITY_LAW_CONFIG_KEY, LIVING_CONTENT_LAW_CONFIG_KEY];
  for (const cfg of configs) {
    for (const seed of seeds) {
      const settlement = generateSettlementPipeline({ ...cfg, ...dials }, null, {
        seed,
        customContent: eligibleCustomContent(pack, { tier: cfg.settType }),
      });
      roots.push({ name: 'settlement', value: settlement });
    }
  }
  const folded = foldCorpus(roots);
  return { shapes: folded.shapes, generations: roots.length, dials, dialConfigKeys };
}

/**
 * THE DOUBLY-CONTROLLED DIAL-GATED SET: the identities a LIT world writes that no
 * shipped world writes anywhere.
 *
 * ── ⚠⚠ TWO CONFOUNDS, BOTH MEASURED, BOTH CONTROLLED ────────────────────────
 * §7.1 compares the lit corpus against the WALKER'S corpus. That difference moves
 * two variables at once and misses a third, and both were measured at this base:
 *
 *   1. THE CONTENT PACK. The lit arm passes the reference pack; the walker's
 *      corpus passes `customContent: {}`. Of the 55 identities that raw difference
 *      yields, **24 are produced by the pack alone with no dial rolled**, and 55
 *      trips the |dialGated| > 40 STOP. The pack control (same pack, dials dark)
 *      removes them: 34.
 *   2. THE PRODUCER SET. The lit arm runs producer 1 only — 16 generations — while
 *      the walker's corpus also folds the campaign pulse and the steading mint. A
 *      key those later producers write is ABSENT from a producer-1 control and
 *      would read as dial-gated when a shipped world writes it every time. Three
 *      did: `description on factions`, `name on traditions`, `severity on
 *      stressors`. Subtracting the walker's corpus as well removes them: **31**.
 *
 * So an identity is dial-gated only if the lit run writes it AND the pack-matched
 * dark-dial run does not AND the walker's full corpus does not. Both controls are
 * required and each one catches what the other cannot.
 *
 * ── AND WHY THE POPULATION IS THE WALKER'S, NOT THE LIT CORPUS'S ────────────
 * `MIN_ROWS` is 40 and the lit corpus is 16 generations, so `settlement` carries
 * 16 rows there and a floor applied to the lit side would call it THIN — which
 * excludes `customContentRoster on settlement`, the canonical MAT retro-control
 * this arm exists to observe. The population that matters is the one the register
 * speaks about: the shapes the walker judges.
 *
 * @param {Record<string, {rows: number, keys: string[]}>} litShapes  dials ROLLED
 * @param {Array<Record<string, {keys: string[]}>>} controls  every shape-map to subtract
 * @param {Set<string>|string[]} judgedShapes  the walker's known shapes
 * @param {string[]} dialConfigKeys  the arm's own dial config keys, excluded by name
 * @returns {Set<string>} identities present lit and absent from every control
 */
export function dialGatedOf(litShapes, controls, judgedShapes, dialConfigKeys = []) {
  if (!Array.isArray(controls) || controls.length === 0) {
    throw new Error('writer-reach dial-gating requires at least one CONTROL corpus; an uncontrolled'
      + ' difference measures the content pack and the producer set as if they were dials.');
  }
  const judged = judgedShapes instanceof Set ? judgedShapes : new Set(judgedShapes);
  const excluded = new Set(dialConfigKeys);
  const gated = new Set();
  for (const shape of judged) {
    const record = litShapes[shape];
    if (!record) continue;
    const controlKeys = controls.map((shapes) => new Set(shapes[shape]?.keys ?? []));
    for (const key of record.keys) {
      // The arm passes the dial values on its own configs, so the dial keys
      // themselves show up as written keys. They are the instrument's own
      // fingerprint, never a product fact, and they are excluded BY NAME.
      if (excluded.has(key)) continue;
      if (!controlKeys.some((keys) => keys.has(key))) gated.add(writerIdentity(key, shape));
    }
  }
  return gated;
}

/** Group a dialGated set by the dial each identity plausibly belongs to, for the STOP. */
export function dialGatedByFamily(gated, register) {
  const rows = new Map(register.map((row) => [row.identity, row.door?.configKey ?? null]));
  const families = new Map();
  for (const identity of gated) {
    const family = rows.get(identity) ?? '(unrowed)';
    if (!families.has(family)) families.set(family, []);
    families.get(family).push(identity);
  }
  for (const list of families.values()) list.sort();
  return families;
}

export { join };
