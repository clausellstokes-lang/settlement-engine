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
 * @property {ReadonlyArray<FoundingSeedLink>} [links] the synopsis's causal joins, each held by a record field
 *   (LANDING-7 G3, ruling R-G3): a causal word may join two facts only on a row here, proven by the probe
 */

/**
 * @typedef {Object} FoundingSeedLink
 * @property {string} cause  the cause fact (a fact id the probe defines)
 * @property {string} effect the effect fact
 * @property {string} field  the record field that holds the link (a field id the probe defines)
 * @property {string} words  the synopsis words that state the link, verbatim
 */

/** @type {ReadonlyArray<FoundingSeed>} */
export const FOUNDING_SEEDS = Object.freeze([
  // RE-CHOSEN 2026-09-30 (the urban band, ODQ §934.86): besi-582's town now reads 'Contested',
  // so the drama moved to besi-872, the first besi- seed whose forged world proves every receipt
  // and the synopsis's mining, harvest and guild-master claims. Two specifics are re-verified to
  // that world: the siege is seven years past (was twelve), and a merchant council governs (was a
  // mayor).
  // RE-CHOSEN 2026-11-04 (REGISTERS-6, the chair's ruling E1; vetoable by the owner): FOOD-1/2 re-dealt the
  // forged world, and besi-872 now reads 'Contested'. The hunt kept the probe's three receipts and added the
  // opening sentence's facts (Mining among the strengths, a food-short record, a merchant or council governor)
  // and the guild master formalising (the brewing coup). It walked crown-3000..8826 and besi-3000..5014. The
  // first seeds passing everything: crown-8826 and besi-5014. The first passing all but the coup: crown-7163
  // and besi-4212, where only the mayor's exit goal met receipt 3. crown-8826 forges the whole story (the mining
  // chain live, Active Famine, a merchant oligarchy, the guild master formalising), so only the two incidental
  // specifics follow its world: the siege is ten years past (was seven), and a merchant oligarchy governs
  // (was a merchant council).
  // RE-CHOSEN 2026-11-06 (LANDING-7 lane G, second seat, the chair's ruling R-G2; vetoable by the owner): crown-8826
  // lost the coup at the X-46 train compose (1264a8152) and the mining chain at the x46-3 budget compose
  // (90dc22f18), and no crown seed in 0..20000 forges the whole old story. The STORY is the ESSENTIALS: a brewing
  // coup (a guild master formalising the independent authority) in a legitimacy crisis (fractured). crown-3 is
  // the first seed in order forging both. Its two most story-bearing specifics replace the old seed's mining and
  // siege: plague at its onset (a Quarantine Council on the roster), and a Thieves' Guild that outweighs the
  // governing Guild Council and whose guild master is the one formalising. The governor follows the seed too:
  // a guild council (was a merchant oligarchy). The harvests still read short (Pressured).
  // RE-WRITTEN AS A CHAIN 2026-11-06 (LANDING-7 lane G, third seat, the chair's ruling R-G3; vetoable by the owner):
  // the synopsis now runs in cause order, and every causal word in it stands on a `links` row: a record field
  // naming one fact as the cause of another, proven by the probe. The record holds plague → short harvests (not
  // the other way), plague and short harvests → the legitimacy crisis, the crisis → the thieves' guild above the
  // council, and the crisis and that weight → the guild master's goal. It holds no link from the plague to the
  // quarantine council, so the council stands beside the other facts with no causal word.
  // `firstDecade` RE-WORDED 2026-11-06 (LANDING-7 lane H, the verifier's NOTE-5, the chair's ruling R-H3; vetoable by
  // the owner): "a failing crown" named a governor crown-3 does not seat. RE-SAID 2026-11-09 (ALLEGIANCE-CAR4 STOP 4, the
  // chair's ruling; the owner's copy, vetoable): the goal is A9's now (people/goals.js), so the master's formalising goal
  // — the structural pass's retired condition row — is on nobody; what the forge holds is the master's PLACE: the head of
  // the power the crisis lifted, on the ground the governing guild council (its title no longer honoured in the streets)
  // has stopped watching — her structural row (position, constraint, condition, rank).
  Object.freeze({
    id: 'the-contested-crown',
    title: 'The Crown That Will Not Hold',
    seed: 'crown-3',
    archetype: 'besieged_holdout',
    settType: 'town',
    synopsis:
      "A plague is taking hold in this town, and it has thinned the hands that work the fields, so the harvests come in short. A quarantine council sits among its factions. Between the sickness and the short harvests, the guild council holds a title the streets no longer honour, and the crisis has lifted the thieves' guild above it; that guild's master stands over ground the failing seat has stopped watching, and the one thing that could close the town's ranks against the guild is taking it in the open. The coup here is not a rumour. It is a matter of not being seen.",
    firstDecade:
      "Opens in a legitimacy crisis: fractured governance, a plague at its onset, and the thieves' guild's master standing over the ground a guild council, its title no longer honoured in the streets, has stopped watching.",
    receipts: Object.freeze([
      "Its legitimacy reads 'Legitimacy Crisis', with governance fractured.",
      'Plague is at its onset, and a quarantine council sits among its factions.',
      "The thieves' guild's master heads the power the crisis lifted, on ground the failing seat has stopped watching, and can take it only unseen.",
    ]),
    links: Object.freeze([
      Object.freeze({ cause: 'plague', effect: 'poor harvests', field: 'economicViability.issues[stress_consequence]', words: 'it has thinned the hands that work the fields, so the harvests come in short' }),
      Object.freeze({ cause: 'plague', effect: 'title unhonoured', field: 'powerStructure.publicLegitimacy.breakdown.safety', words: 'Between the sickness and the short harvests, the guild council holds a title the streets no longer honour' }),
      Object.freeze({ cause: 'poor harvests', effect: 'title unhonoured', field: 'powerStructure.publicLegitimacy.breakdown.food', words: 'Between the sickness and the short harvests, the guild council holds a title the streets no longer honour' }),
      Object.freeze({ cause: 'title unhonoured', effect: 'thieves outweigh', field: 'factions[].rawPower→power × publicLegitimacy multipliers', words: "the crisis has lifted the thieves' guild above it" }),
      Object.freeze({ cause: 'thieves outweigh', effect: 'master placed', field: 'npcs[].structuralRank', words: "the thieves' guild above it; that guild's master" }),
      Object.freeze({ cause: 'title unhonoured', effect: 'master placed', field: 'npcs[].settlementCondition', words: 'ground the failing seat has stopped watching' }),
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
      'Figures in the town answer in secret to its criminal houses.',
    ]),
  }),
]);

/** All founding-seed ids (dedup + walker convenience). */
export const FOUNDING_SEED_IDS = Object.freeze(FOUNDING_SEEDS.map((s) => s.id));

/** Lookup by id. @param {string} id */
export function foundingSeedById(id) {
  return FOUNDING_SEEDS.find((s) => s.id === id) || null;
}
