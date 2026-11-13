/**
 * domain/display/stateProse/postureLineDisqualifiers.js — THE DEFENCE POSTURE'S LINES AND WHAT MAKES EACH FALSE
 * (R3-TABS, with L1 of the chair's ruling of 2026-11-13; the defence lane's fourth read, class D).
 *
 * WHY THIS FILE. L1 makes the posture line (DS-DEF-1) read the readiness BADGE, which sends every Well-Defended
 * town to the strong pool and every Vulnerable one to the weak pool. Three of the strong pool's four lines
 * presume peace and one of the weak pool's presumes nobody to man the works: measured on the defence reader's
 * 1,440 births, the move alone would have put the peace lines under a siege or a war in 21 more towns and the
 * empty perimeter beside a force in 9 more. The owner's design (the crime desk's precedent,
 * `crimeLineDisqualifiers.js`): a line is in its pool unless something about the town makes IT false, and that
 * disqualifier is declared ON THE LINE and enforced AT THE DRAW. Each declaration names its line by pool, `vid`
 * and the words it opens with (held against the corpus by tests/domain/defensePostureReadsBadge.test.js, so a
 * re-generated corpus cannot shift one onto another line); the kernel draws, uniformly, among the lines no
 * declaration strikes, and a town no declaration touches draws exactly as before. The lines are the corpus
 * lane's: it carries each declaration onto its variant, and this table goes.
 *
 * THE TWO FACTS, each read from its one home:
 *   - AT WAR: a siege or a war in force, `stress[].type` `under_siege` / `wartime` (the Defense header's
 *     military-status banner names it).
 *   - A FORCE STANDS: any standing garrison, militia, watch or contracted company (`standingDefenseForces`,
 *     L0's reading).
 * Pure: no randomness, no clock, no write. One view per struck set.
 */
import { standingDefenseForces } from '../../institutions/defenseInstitutionBuckets.js';

/** @typedef {{ opens: string, falseWhere: 'at war' | 'a force stands' }} PostureLineDeclaration */

/**
 * `<pool>` → `vid` → what the line opens with and the fact that makes it false.
 * @type {Readonly<Record<string, Readonly<Record<number, Readonly<PostureLineDeclaration>>>>>}
 */
export const POSTURE_LINE_DISQUALIFIERS = Object.freeze({
  'readiness STRONG': Object.freeze({
    2: Object.freeze({ opens: 'What {settlement} can field and what {settlement} has built', falseWhere: 'at war' }),
    3: Object.freeze({ opens: 'The town does not spend much time thinking about being attacked', falseWhere: 'at war' }),
    4: Object.freeze({ opens: 'Nothing presses {settlement} at present', falseWhere: 'at war' }),
  }),
  'readiness WEAK': Object.freeze({
    2: Object.freeze({ opens: "Much of {settlement}'s perimeter has nobody on it", falseWhere: 'a force stands' }),
  }),
});

/** @type {Map<unknown, Map<string, unknown>>} */
const VIEWS = new Map();

/** @param {unknown} stress @returns {unknown[]} */
const stressList = (stress) => (Array.isArray(stress) ? stress.filter(Boolean) : stress ? [stress] : []);

/**
 * The corpus as one town may draw the posture: the DS-DEF-1 lines its facts make false struck. The corpus
 * itself comes back, by identity, where nothing is struck.
 * @template T
 * @param {T} corpus
 * @param {{ stress?: unknown, institutions?: unknown } | null | undefined} settlement
 * @returns {T}
 */
export function corpusAdmittingPostureLines(corpus, settlement) {
  const c = /** @type {Record<string, { pools?: Record<string, ReadonlyArray<{ vid?: unknown }>> } & Record<string, unknown>>} */ (/** @type {unknown} */ (corpus));
  const block = c?.['DS-DEF-1'];
  if (!block?.pools) return corpus;
  const atWar = stressList(settlement?.stress).some((entry) => {
    const type = /** @type {{ type?: unknown } | null} */ (entry)?.type;
    return type === 'under_siege' || type === 'wartime';
  });
  const forces = standingDefenseForces(settlement);
  const force = forces.garrison.present || forces.militia.present || forces.watch.present || forces.mercenary.present;
  /** @type {Record<PostureLineDeclaration['falseWhere'], boolean>} */
  const holds = { 'at war': atWar, 'a force stands': force };
  /** @type {Record<string, ReadonlyArray<{ vid?: unknown }>>} */ const pools = {};
  /** @type {string[]} */ const struck = [];
  for (const [pool, declared] of Object.entries(POSTURE_LINE_DISQUALIFIERS)) {
    const variants = block.pools[pool];
    if (!Array.isArray(variants)) continue;
    const kept = variants.filter((v) => {
      const d = typeof v?.vid === 'number' ? declared[v.vid] : undefined;
      const out = Boolean(d && holds[d.falseWhere]);
      if (out) struck.push(`${pool}#${v.vid}`);
      return !out;
    });
    if (kept.length !== variants.length) pools[pool] = Object.freeze(kept);
  }
  if (!struck.length) return corpus;
  const id = struck.join('|');
  let byCorpus = VIEWS.get(corpus);
  if (!byCorpus) { byCorpus = new Map(); VIEWS.set(corpus, byCorpus); }
  const held = byCorpus.get(id);
  if (held) return /** @type {T} */ (held);
  const view = Object.freeze({ ...c, 'DS-DEF-1': Object.freeze({ ...block, pools: Object.freeze({ ...block.pools, ...pools }) }) });
  byCorpus.set(id, view);
  return /** @type {T} */ (/** @type {unknown} */ (view));
}
