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
 *   - UNDER SIEGE: `stress[].type` `under_siege` alone, whose summary says nothing comes in by road: the strong
 *     pool's first line reads the town "from the road in" (CENSUS-2 kind b, 7 of its 720 at R3-TABS L3's tip).
 *     Under a siege every strong line is struck and the posture says nothing; the banner names the siege.
 *   - A FORCE STANDS: any standing garrison, militia, watch or contracted company (`standingDefenseForces`,
 *     L0's reading).
 *   - NO WALLS / NO WATCH OR GARRISON (R3-TABS-4; the chair's ruling (b) of 2026-11-14 on the fresh reader's F3):
 *     a line that names a thing reads the roster. The strong pool's first line names WORKS ("the works are kept
 *     up") and a watch on the approaches ("the approaches are watched"): it is struck where the roster holds no
 *     walls, and where it holds neither a watch nor a garrison (3 unwalled towns of the reader's 1,536 at
 *     bb2bf91c5, 2 at the line's tip 976db5b19: Muulcoba "the works are kept up" beside "The town's defense is
 *     people rather than works").
 *   - UNDER AN OCCUPATION: `stress[].type` `occupied` (R3-TABS-4; the chair's ruling (a) of 2026-11-14 on the
 *     fresh reader's F1): the strong pool is struck WHOLE, as under a siege. Every one of its lines says the
 *     town's own defences are in good order, beside the banner "The occupiers' troops at … protect it from
 *     everyone except the people who sent them" (14 occupied towns of the reader's 1,536 at bb2bf91c5, 10 at
 *     the line's tip 976db5b19).
 * Pure: no randomness, no clock, no write. One view per struck set.
 */
import { standingDefenseForces } from '../../institutions/defenseInstitutionBuckets.js';

/** @typedef {'at war' | 'under siege' | 'a force stands' | 'no walls' | 'no watch or garrison'} PostureLineFact */
/** @typedef {{ opens: string, falseWhere: PostureLineFact | ReadonlyArray<PostureLineFact> }} PostureLineDeclaration */

/**
 * `<pool>` → `vid` → what the line opens with and the fact that makes it false.
 * @type {Readonly<Record<string, Readonly<Record<number, Readonly<PostureLineDeclaration>>>>>}
 */
export const POSTURE_LINE_DISQUALIFIERS = Object.freeze({
  'readiness STRONG': Object.freeze({
    1: Object.freeze({ opens: '{settlement} reads as a defended place from the road in', falseWhere: /** @type {ReadonlyArray<PostureLineFact>} */ (Object.freeze(['under siege', 'no walls', 'no watch or garrison'])) }),
    2: Object.freeze({ opens: 'What {settlement} can field and what {settlement} has built', falseWhere: 'at war' }),
    3: Object.freeze({ opens: 'The town does not spend much time thinking about being attacked', falseWhere: 'at war' }),
    4: Object.freeze({ opens: 'Nothing presses {settlement} at present', falseWhere: 'at war' }),
  }),
  'readiness WEAK': Object.freeze({
    2: Object.freeze({ opens: "Much of {settlement}'s perimeter has nobody on it", falseWhere: 'a force stands' }),
  }),
});

/** The pools struck whole under an occupation. @type {ReadonlySet<string>} */
const STRUCK_UNDER_AN_OCCUPATION = new Set(['readiness STRONG']);

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
  const types = stressList(settlement?.stress).map((entry) => /** @type {{ type?: unknown } | null} */ (entry)?.type);
  const underSiege = types.includes('under_siege');
  const atWar = underSiege || types.includes('wartime');
  const occupied = types.includes('occupied');
  const forces = standingDefenseForces(settlement);
  const force = forces.garrison.present || forces.militia.present || forces.watch.present || forces.mercenary.present;
  /** @type {Record<PostureLineFact, boolean>} */
  const holds = {
    'at war': atWar, 'under siege': underSiege, 'a force stands': force,
    'no walls': !forces.walls.present, 'no watch or garrison': !forces.watch.present && !forces.garrison.present,
  };
  /** @type {Record<string, ReadonlyArray<{ vid?: unknown }>>} */ const pools = {};
  /** @type {string[]} */ const struck = [];
  for (const [pool, declared] of Object.entries(POSTURE_LINE_DISQUALIFIERS)) {
    const variants = block.pools[pool];
    if (!Array.isArray(variants)) continue;
    const wholePool = occupied && STRUCK_UNDER_AN_OCCUPATION.has(pool);
    const kept = variants.filter((v) => {
      const d = typeof v?.vid === 'number' ? declared[v.vid] : undefined;
      const facts = d ? (typeof d.falseWhere === 'string' ? [d.falseWhere] : d.falseWhere) : [];
      const out = wholePool || facts.some((fact) => holds[fact]);
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
