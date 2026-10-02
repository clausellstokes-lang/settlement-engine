/**
 * foundingSeeds.js — R-2 CURATED FIRST SEEDS: the editorial registry.
 *
 * A small set of hand-chosen starting seeds whose FORGED OPENING STATE tells a
 * legible drama in the first ten minutes — the conversion moment. Each entry is a
 * seed + a config preset (an archetype key resolved through characterPresets) + a
 * house-voiced synopsis + the claim of what its opening years show.
 *
 * CLAIMS-PARITY (owner law): a synopsis claims ONLY what the probe proves. Every
 * `receipts` line below is backed by an assertion in tests/data/foundingSeeds.probe
 * .test.js — the probe GENERATES the seed (same seed + config ⇒ same world) and
 * asserts the claimed elements exist. If the generator drifts, the probe reds and
 * the claim must be re-verified or the seed re-chosen (the goldens-regen policy).
 *
 * HONESTY NOTE (recorded): the claims rest on the DETERMINISTIC GENERATED STATE
 * (founding, historical events, legitimacy, the figures' ambitions) — what a new DM
 * SEES immediately in the dossier. They do NOT claim specific post-advance news,
 * because a campaign's world-pulse rngSeed derives from its (random) campaign id,
 * not the settlement seed, so a decade's news is not reproducible from the seed
 * alone. "Opening years" therefore means the settlement's own generated recent
 * history + its live tensions — the drama the seed is BORN with.
 *
 * The archetype key resolves through archetypePatch (src/components/generate/
 * characterPresets.js) at forge time; the registry stores the KEY (single source of
 * truth) plus settType. Pure data — no imports — so it rides the lazy data chunk
 * (consumed only by the lazy create surface, never eager).
 */

/**
 * @typedef {Object} FoundingSeed
 * @property {string} id          stable slug
 * @property {string} title       the world's editorial name
 * @property {string} seed        the generation seed (a string)
 * @property {string} archetype   a characterPresets ARCHETYPES key (resolved via archetypePatch)
 * @property {string} settType    tier hint (hamlet | village | town)
 * @property {string} synopsis    house-voiced pitch (claims ONLY what the probe proves)
 * @property {string} firstDecade one line on what its opening years show
 * @property {string[]} receipts  the claim, itemised — each backed by a probe assertion
 */

/** @type {ReadonlyArray<FoundingSeed>} */
export const FOUNDING_SEEDS = Object.freeze([
  // RE-CHOSEN 2026-09-30 (the urban band, ODQ §934.86): besi-582's town now reads 'Contested',
  // so the drama moved to besi-872, the first besi- seed whose forged world proves every receipt
  // and the synopsis's mining, harvest and guild-master claims. Two specifics are re-verified to
  // that world: the siege is seven years past (was twelve), and a merchant council governs (was a
  // mayor).
  Object.freeze({
    id: 'the-contested-crown',
    title: 'The Crown That Will Not Hold',
    seed: 'besi-872',
    archetype: 'besieged_holdout',
    settType: 'town',
    synopsis:
      'A mining town raised on rich ore and poor harvests, seven years past a siege that broke more than its walls. Its merchant council holds a title the streets no longer honour; a guild master has begun, quietly, to write the authority the collapse handed the commercial wards into permanent ink. The coup here is not a rumour. It is a matter of paperwork.',
    firstDecade:
      'Opens in a legitimacy crisis: fractured governance, a catastrophic siege in living memory, and a guild master formalising the power a failing crown can no longer reclaim.',
    receipts: Object.freeze([
      "Its legitimacy reads 'Legitimacy Crisis', with governance fractured.",
      'A catastrophic siege sits within the last fifteen years of its history.',
      'A ranking figure means to formalise the independent authority that governance failure created.',
    ]),
  }),
  Object.freeze({
    id: 'the-enduring-mill',
    title: 'The Mill That Outlived Its Wars',
    seed: 'besi-1',
    archetype: 'besieged_holdout',
    settType: 'town',
    synopsis:
      'Grown from a single logging operation whose owner refused to leave when the contract ended, this river town has turned its wheel through an economic rift, a great migration, a religious war, an occupation, an arcane catastrophe, and a siege a generation gone. Upheaval after upheaval of the first rank, and the mills still turn. A chronicle of endurance, and of what endurance costs.',
    firstDecade:
      'A settlement defined by survival: five or more major upheavals across its history, closing with a siege within the last generation, yet standing today under a hand its people tolerate.',
    receipts: Object.freeze([
      'Its remembered history carries five or more MAJOR upheavals.',
      'A major siege sits within its history.',
      'It grew from a single logging operation whose owner refused to leave when the contract ended.',
      'Its mills still stand among its institutions.',
      "Its governance today reads as 'Tolerated' (a survivor, still standing).",
    ]),
  }),
  Object.freeze({
    id: 'the-rot-beneath-the-ore',
    title: 'The Rot Beneath the Ore',
    seed: 'mini-3',
    archetype: 'mining_colony',
    settType: 'town',
    synopsis:
      'The ore comes up clean; nothing else here does. A government survives by never looking too hard at the arrangements it rests on; an uprising still smoulders, eight years young; and every officer and merchant is deciding which side to stand on before the choice is made for them. Contested ground, where the honest question is simply who will still be standing.',
    firstDecade:
      'Contested authority riddled with informal power: a recent uprising, criminal arrangements the government dares not confront, and figures caught between the governing faction and the insurgency.',
    receipts: Object.freeze([
      "Its legitimacy reads 'Contested'.",
      'An uprising of the first rank sits within the last fifteen years.',
      'A ranking figure means to hold the line without confronting the criminal or informal arrangements the town rests on.',
    ]),
  }),
]);

/** All founding-seed ids (dedup + walker convenience). */
export const FOUNDING_SEED_IDS = Object.freeze(FOUNDING_SEEDS.map((s) => s.id));

/** Lookup by id. @param {string} id */
export function foundingSeedById(id) {
  return FOUNDING_SEEDS.find((s) => s.id === id) || null;
}
