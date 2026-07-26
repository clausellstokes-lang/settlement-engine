/**
 * generators/data/deityPool.js — the GOVERNED core deity pool
 * (Phase 4 W-F5 stage 2).
 *
 * The starting-pantheon substrate: ~two dozen authored deities spanning the
 * alignment × law plane, drawn deterministically at generation time by the
 * `seedStartingPantheon` pipeline step (affinity-weighted by terrain / culture /
 * government). This is also the "DM-seeded global pool" spread substrate
 * (RELIGION_REWORK §2.7) for worlds whose DM never authors a custom god: pool
 * refs are STABLE ACROSS SAVES (`deity:core:<slug>`) so a valley of settlements
 * sharing the Harvest-Mother archetype is the intended prevalence-clustering
 * substrate, while custom/homebrew deities keep their own registry namespace.
 *
 * HOMED UNDER src/generators (not src/data) DELIBERATELY: vite's manualChunks
 * routes src/data/** into the eager first-paint `data` chunk, but this table is
 * consumed ONLY by the lazy generation pipeline (the `engine` chunk, absent
 * from the first-paint closure). Homing it here keeps its bytes out of first
 * paint — the CLOSURE_BUDGET_BYTES discipline (tests/build/vendorPdfLazy.test.js).
 *
 * Axis discipline (post axis-retirement, W-F5 stage 1): a deity's TEMPER is
 * DERIVED from its alignment axes (deityAxes.deriveTemper) — the stored
 * `temperamentAxis` on each entry is shape-parity metadata only (it mirrors the
 * derivation exactly; tests/domain/deityPool.test.js pins stored === derived so
 * the decoupled-temper fixture class can never re-enter through content).
 * Niche therefore falls out of alignment alone: good ⇒ peacelike:good,
 * neutral ⇒ neutral:neutral, evil ⇒ warlike:evil. Law differentiates same-niche
 * rivals through stance/receptivity (spec §3.3), not through the niche key.
 *
 * `portfolio` is the owner-ratified OPTIONAL FREE-TEXT FLAVOR FIELD — pure
 * content with ZERO mechanics. No engine module reads it; it rides the embed
 * for display only (customContentSchema.validateDeity admits it additively).
 *
 * Affinity vocabularies (matched by the generation step):
 *   terrain    — plains | hills | forest | riverside | coastal | mountain | desert
 *   culture    — the canonical eleven settlement culture-profile keys
 *   government — theocratic | martial | monarchic | civic  (regex classes over
 *                the governing faction name, the mandateAlignmentFit idiom)
 *
 * Rank shapes the draw: patrons come from major/minor entries, cults from
 * minor/cult entries (a 'major' god does not enter as a fringe cult).
 */

/**
 * @typedef {Object} PoolDeity
 * @property {string} slug            stable ref segment (`deity:core:<slug>`)
 * @property {string} name
 * @property {string} portfolio      optional free-text flavor — ZERO mechanics
 * @property {'good'|'neutral'|'evil'} alignmentAxis
 * @property {'lawful'|'neutral'|'chaotic'} lawAxis
 * @property {'warlike'|'peacelike'|'neutral'} temperamentAxis  mirrors the derivation (pinned)
 * @property {'major'|'minor'|'cult'} rankAxis
 * @property {string} domain
 * @property {{ terrain: string[], culture: string[], government: string[] }} affinity
 */

/** The stable ref namespace for pool deities (spec §4.5). */
export const DEITY_CORE_REF_PREFIX = 'deity:core:';

/** The stable, save-independent ref of a pool deity. @param {string} slug */
export function deityCoreRef(slug) {
  return `${DEITY_CORE_REF_PREFIX}${slug}`;
}

/** @type {readonly PoolDeity[]} */
export const DEITY_POOL = Object.freeze([
  // ── GOOD (derived temper: peacelike — niche peacelike:good) ────────────────
  { slug: 'aurelion', name: 'Aurelion, the Dawnfather', portfolio: 'Sunrise oaths, honest courts, and the first seed of spring.',
    alignmentAxis: 'good', lawAxis: 'lawful', temperamentAxis: 'peacelike', rankAxis: 'major', domain: 'sun',
    affinity: { terrain: ['plains', 'hills'], culture: ['latin', 'greek', 'mesoamerican'], government: ['monarchic', 'theocratic'] } },
  { slug: 'thessa', name: 'Thessa of the Hearth', portfolio: 'Bread, birth, and the fire that outlasts winter.',
    alignmentAxis: 'good', lawAxis: 'neutral', temperamentAxis: 'peacelike', rankAxis: 'major', domain: 'hearth',
    affinity: { terrain: ['plains', 'riverside'], culture: ['germanic', 'celtic', 'slavic', 'east_asian', 'south_asian'], government: ['civic'] } },
  { slug: 'maravel', name: 'Maravel Wavemother', portfolio: 'Safe harbors, fair winds, and drowned sailors sung home.',
    alignmentAxis: 'good', lawAxis: 'neutral', temperamentAxis: 'peacelike', rankAxis: 'minor', domain: 'sea',
    affinity: { terrain: ['coastal', 'riverside'], culture: ['latin', 'greek', 'norse', 'east_asian'], government: ['civic'] } },
  { slug: 'brannor', name: 'Brannor Oakshield', portfolio: 'Sworn shields, kept borders, and the honest axe.',
    alignmentAxis: 'good', lawAxis: 'lawful', temperamentAxis: 'peacelike', rankAxis: 'minor', domain: 'oaths',
    affinity: { terrain: ['forest', 'hills'], culture: ['celtic', 'germanic', 'slavic', 'steppe'], government: ['monarchic', 'martial'] } },
  { slug: 'liraen', name: 'Liraen, the Wandering Light', portfolio: 'Lost roads found, strangers fed, and tyrants tripped.',
    alignmentAxis: 'good', lawAxis: 'chaotic', temperamentAxis: 'peacelike', rankAxis: 'minor', domain: 'travel',
    affinity: { terrain: ['desert', 'mountain'], culture: ['celtic', 'arabic', 'south_asian', 'steppe'], government: ['civic'] } },
  { slug: 'sylfa', name: 'Sylfa Greenveil', portfolio: 'Every unfenced meadow, and the mercy of wild things.',
    alignmentAxis: 'good', lawAxis: 'chaotic', temperamentAxis: 'peacelike', rankAxis: 'cult', domain: 'wilds',
    affinity: { terrain: ['forest'], culture: ['celtic', 'norse', 'slavic', 'mesoamerican'], government: ['civic'] } },
  { slug: 'velia', name: 'Velia of Quiet Mercies', portfolio: 'Fevers broken, griefs carried, and doors left unlatched for the poor.',
    alignmentAxis: 'good', lawAxis: 'neutral', temperamentAxis: 'peacelike', rankAxis: 'cult', domain: 'healing',
    affinity: { terrain: ['riverside', 'plains'], culture: ['latin', 'greek', 'east_asian', 'south_asian'], government: ['theocratic'] } },

  // ── NEUTRAL (derived temper: neutral — niche neutral:neutral) ──────────────
  { slug: 'kethis', name: 'Kethis the Scalekeeper', portfolio: 'Weights, measures, and the ledger no coin escapes.',
    alignmentAxis: 'neutral', lawAxis: 'lawful', temperamentAxis: 'neutral', rankAxis: 'major', domain: 'justice',
    affinity: { terrain: ['plains', 'hills'], culture: ['latin', 'greek', 'germanic', 'east_asian'], government: ['monarchic', 'theocratic'] } },
  { slug: 'yshara', name: 'Yshara Riverbraid', portfolio: 'Floods and silt, ferry-tolls, and the water that gives and takes.',
    alignmentAxis: 'neutral', lawAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: 'major', domain: 'rivers',
    affinity: { terrain: ['riverside'], culture: ['celtic', 'germanic', 'slavic', 'east_asian', 'mesoamerican', 'south_asian'], government: ['civic'] } },
  { slug: 'morvain', name: 'Morvain Deepdelver', portfolio: 'Ore, anvils, and the patience of stone.',
    alignmentAxis: 'neutral', lawAxis: 'lawful', temperamentAxis: 'neutral', rankAxis: 'minor', domain: 'forge',
    affinity: { terrain: ['mountain', 'hills'], culture: ['germanic', 'norse', 'slavic', 'steppe'], government: ['civic', 'martial'] } },
  { slug: 'vessa', name: 'Vessa of the Turning Moon', portfolio: 'Tides, cycles, and debts that always return.',
    alignmentAxis: 'neutral', lawAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: 'minor', domain: 'moon',
    affinity: { terrain: ['forest', 'coastal'], culture: ['norse', 'celtic', 'east_asian', 'south_asian'], government: ['civic'] } },
  { slug: 'tolm', name: 'Tolm Greycoin', portfolio: 'The honest bargain, the sharp one, and the handshake sealing both.',
    alignmentAxis: 'neutral', lawAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: 'minor', domain: 'trade',
    affinity: { terrain: ['plains', 'coastal'], culture: ['latin', 'greek', 'arabic', 'south_asian'], government: ['civic'] } },
  { slug: 'erruk', name: 'Erruk Stonefather', portfolio: 'High passes, old walls, and words cut in rock.',
    alignmentAxis: 'neutral', lawAxis: 'lawful', temperamentAxis: 'neutral', rankAxis: 'cult', domain: 'mountains',
    affinity: { terrain: ['mountain'], culture: ['norse', 'germanic', 'slavic', 'steppe'], government: ['martial'] } },
  { slug: 'quennel', name: 'Quennel of the Thousand Doors', portfolio: 'Dice, doorways, and the wind that changes everything.',
    alignmentAxis: 'neutral', lawAxis: 'chaotic', temperamentAxis: 'neutral', rankAxis: 'minor', domain: 'luck',
    affinity: { terrain: ['coastal', 'desert'], culture: ['latin', 'greek', 'arabic', 'south_asian'], government: ['civic'] } },
  { slug: 'skarn', name: 'Skarn Stormbrother', portfolio: 'Thunderheads, broken masts, and courage at the rail.',
    alignmentAxis: 'neutral', lawAxis: 'chaotic', temperamentAxis: 'neutral', rankAxis: 'minor', domain: 'storms',
    affinity: { terrain: ['coastal', 'mountain'], culture: ['norse', 'steppe'], government: ['martial'] } },
  { slug: 'pell', name: 'Pell the Unwritten', portfolio: 'Riddles, crossroads pranks, and rules bent double.',
    alignmentAxis: 'neutral', lawAxis: 'chaotic', temperamentAxis: 'neutral', rankAxis: 'cult', domain: 'mischief',
    affinity: { terrain: ['forest', 'plains'], culture: ['celtic', 'mesoamerican'], government: ['civic'] } },

  // ── EVIL (derived temper: warlike — niche warlike:evil) ────────────────────
  { slug: 'vorgath', name: 'Vorgath, the Iron Yoke', portfolio: 'Chains, censuses, and order paid for in fear.',
    alignmentAxis: 'evil', lawAxis: 'lawful', temperamentAxis: 'warlike', rankAxis: 'major', domain: 'tyranny',
    affinity: { terrain: ['plains', 'hills'], culture: ['germanic', 'slavic', 'steppe'], government: ['martial', 'monarchic'] } },
  { slug: 'karrgha', name: 'Karrgha Red-Mouth', portfolio: 'The joy of ruin, and the feast after.',
    alignmentAxis: 'evil', lawAxis: 'chaotic', temperamentAxis: 'warlike', rankAxis: 'major', domain: 'slaughter',
    affinity: { terrain: ['mountain', 'desert'], culture: ['norse', 'steppe', 'mesoamerican'], government: ['martial'] } },
  { slug: 'malzeth', name: 'Malzeth Whisperking', portfolio: 'Sealed letters, bought judges, and the debt you forgot you owed.',
    alignmentAxis: 'evil', lawAxis: 'lawful', temperamentAxis: 'warlike', rankAxis: 'minor', domain: 'secrets',
    affinity: { terrain: ['coastal', 'plains'], culture: ['latin', 'greek', 'arabic', 'east_asian'], government: ['civic', 'monarchic'] } },
  { slug: 'nashra', name: 'Nashra Duskveil', portfolio: 'Knives in alleys, and the price of silence.',
    alignmentAxis: 'evil', lawAxis: 'neutral', temperamentAxis: 'warlike', rankAxis: 'minor', domain: 'night',
    affinity: { terrain: ['desert', 'forest'], culture: ['latin', 'greek', 'arabic', 'south_asian'], government: ['civic'] } },
  { slug: 'grimhild', name: 'Grimhild Weftcutter', portfolio: 'Knots, ill-wishes, and threads cut short.',
    alignmentAxis: 'evil', lawAxis: 'chaotic', temperamentAxis: 'warlike', rankAxis: 'minor', domain: 'curses',
    affinity: { terrain: ['forest', 'mountain'], culture: ['norse', 'celtic', 'slavic', 'east_asian'], government: ['civic'] } },
  { slug: 'belkor', name: 'Belkor Ashcrown', portfolio: 'Tribute, torched fields, and a crown of cinders.',
    alignmentAxis: 'evil', lawAxis: 'lawful', temperamentAxis: 'warlike', rankAxis: 'cult', domain: 'conquest',
    affinity: { terrain: ['hills', 'mountain'], culture: ['germanic', 'slavic', 'steppe'], government: ['martial'] } },
  { slug: 'ozmir', name: 'Ozmir, the Gilded Maw', portfolio: 'Hoards, hunger, and hands that never fill.',
    alignmentAxis: 'evil', lawAxis: 'neutral', temperamentAxis: 'warlike', rankAxis: 'cult', domain: 'greed',
    affinity: { terrain: ['coastal', 'plains'], culture: ['latin', 'greek', 'arabic', 'south_asian'], government: ['civic'] } },
  { slug: 'ythrix', name: 'Ythrix, the Crawling Rot', portfolio: 'Blight, fever-dreams, and sweet decay.',
    alignmentAxis: 'evil', lawAxis: 'chaotic', temperamentAxis: 'warlike', rankAxis: 'cult', domain: 'plague',
    affinity: { terrain: ['riverside', 'forest'], culture: ['celtic', 'slavic', 'mesoamerican'], government: ['civic'] } },
]);
