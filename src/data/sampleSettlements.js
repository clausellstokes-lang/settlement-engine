/**
 * sampleSettlements.js — Tier 8.2 seed dashboard fixtures.
 *
 * Three hand-curated example settlements shown to new accounts (and any
 * account with zero saves). Each is a teaser, not a full dossier — the
 * card surfaces the headline character of the place so the user can
 * decide which sample to fork.
 *
 * Two reasons we ship teasers instead of full pre-generated JSON:
 *   1. Bundle weight. A full dossier serializes to 30-60 KB; three of
 *      them would push the initial bundle by ~150 KB for a feature
 *      most users see for 10 seconds.
 *   2. Drift. A pre-generated JSON locks in the generator output as it
 *      was on the day the sample was captured. The next time the
 *      generator improves (better history beats, richer factions, new
 *      institutions), the samples would feel stale relative to live
 *      output. Forking via config means samples re-derive every time
 *      and stay synchronised with the engine's actual capabilities.
 *
 * NARRATIVE PARITY (W5, owner order 2026-07-21, ledger 707b7d5a): each card
 * is a REAL generation. Its seed+config were seed-hunted through the live
 * generateSettlementPipeline until the generated FACTS carried the card's
 * bones, then the teaser was rewritten to the generated truth — the same
 * narrative-parity discipline the dossier obeys, applied to marketing. The
 * seeds are quoted forever; changing a config or seed re-derives a different
 * settlement and the teaser must be re-matched.
 *
 * Each sample carries:
 *   - id        — stable identifier (used by the fork action)
 *   - name      — display name shown on the card
 *   - tier      — settlement tier ('hamlet' | 'village' | 'town' | 'city' | 'capital')
 *   - terrain   — one-word terrain hint for the card subtitle
 *   - teaser    — single-sentence character pitch (italic, parchment serif)
 *   - tags      — 3-4 chip-style tags to set expectations
 *   - config    — the generator input the "Generate" CTA loads into the
 *                 wizard. Must be the live generator config shape that
 *                 resolveConfig() actually reads: flat priority* weights
 *                 (priorityMilitary / priorityReligion / priorityEconomy
 *                 / priorityCriminal / priorityMagic), a terrainOverride,
 *                 and a bounded monsterThreat tier — NOT a nested
 *                 `sliders` object or a `nearbyTerrain` key (the engine
 *                 ignores both). Each config also pins `culture` and
 *                 `customName` (real wizard dials) so the fork's names and
 *                 settlement name match the card, and MAY pin nearby-resource
 *                 state (Black Crag marks iron `depleted`, Cnocby its mountain
 *                 timber) when a defining resource trait must survive the
 *                 per-user fork suffix rather than ride the random depletion
 *                 roll. Plus a seed so forks are reproducible within a session
 *                 — each user still gets a different SETTLEMENT because the
 *                 seed is suffixed with the user id at fork time (they share
 *                 the card's name, not its people or history).
 */

export const SAMPLE_SETTLEMENTS = Object.freeze([
  {
    id:      'sample-mossgate',
    name:    'Mossgate',
    tier:    'town',
    terrain: 'coastal',
    teaser:  'A rain-grey harbour town where the council and the temple have stopped speaking, and the merchant guilds quietly profit from the silence.',
    tags:    ['Coastal trade', 'Contested council', 'Religious tension'],
    config: {
      settType:         'town',
      tradeRouteAccess: 'port',
      terrainOverride:  'coastal',
      monsterThreat:    'heartland',
      culture:          'germanic',
      customName:       'Mossgate',
      priorityMilitary: 35,
      priorityReligion: 70,
      priorityEconomy:  68,
      priorityCriminal: 30,
      priorityMagic:    25,
      seed:             'mossgate-004',
    },
  },
  {
    id:      'sample-blackcrag',
    name:    'Black Crag',
    tier:    'city',
    terrain: 'mountain',
    teaser:  'A mountain city built on iron, ruled by its guild-masters, whose mines now give up too little ore.',
    tags:    ['Industrial', 'Guild power', 'Dwindling resource'],
    config: {
      settType:         'city',
      tradeRouteAccess: 'crossroads',
      terrainOverride:  'mountain',
      monsterThreat:    'frontier',
      culture:          'germanic',
      customName:       'Black Crag',
      priorityMilitary: 60,
      priorityReligion: 35,
      priorityEconomy:  78,
      priorityCriminal: 45,
      priorityMagic:    12,
      // The card's central promise — a city on iron whose mines are giving
      // out — must survive every user's fork, not just the canonical seed.
      // Iron presence + depletion are both random rolls, so under a pure seed
      // it held in only ~2 of 12 suffixed forks. Pin the nearby resources (a
      // real wizard dial — the four-state resource picker) with iron marked
      // DEPLETED; now it holds 12/12, deterministic and honest. The canonical
      // seed reads "Iron ore (local mines exhausted)" + a smelter starved of ore.
      nearbyResourcesRandom: false,
      nearbyResources:       ['iron_deposits', 'coal_deposits', 'stone_quarry', 'mountain_timber', 'alpine_pasture', 'crossroads_position'],
      nearbyResourcesState:  { iron_deposits: 'depleted' },
      seed:                  'blackcrag-016',
    },
  },
  // ⛔ CNOCBY REPLACED THORNWELL HERE (owner order ODQ §934.30, 2026-09-19: "Have
  // Cnocby replace Thornwell in the create page and the library as well"). Cnocby
  // is the town the LANDING PAGE is built around — the landing fixture's seed
  // lf-033 (src/components/home/landingFixture.js), the one a visitor reads four
  // artifacts about before they ever reach /create. Offering them Thornwell at
  // the door meant the first forkable thing in the product was a place they had
  // never heard of, while the place they HAD just read about was unreachable.
  //
  // ⚠ THIS IS A CURATED SEED, NOT A COPY OF THE FIXTURE, and the difference is
  // the fork: forkSeedFor() suffixes every fork with whoever is forking, so no
  // sample ever re-derives its canonical settlement (that is the whole design — "they
  // share the card's name, not their people or history"). What travels is the
  // CHARACTER, which lives in the dials. These dials are lf-033's own RESOLVED
  // config, read off the fixture run: a celtic mountain village the road reaches,
  // heartland threat, and the criminal dial the highest of the five.
  //
  // ⚠ AND THE CARD'S ONE PROMISE IS PINNED, for Black Crag's reason. "The good
  // timber was cut out" is a depletion ROLL, so under a pure seed it would hold
  // in some forks and not others. nearbyResources + mountain_timber DEPLETED are
  // real wizard dials (the four-state resource picker), and with them the claim
  // holds 12/12 across suffixed forks (measured 2026-09-19). The inn, the market
  // and the faction conflict are NOT pinned and NOT promised: they held 6/12,
  // 8/12 and 8/12, so the teaser says nothing about them.
  {
    id:      'sample-cnocby',
    name:    'Cnocby',
    tier:    'village',
    terrain: 'mountain',
    teaser:  'A mountain village on a through road, where the good timber was cut out a generation ago and the carters who still stop know exactly whose cousin to ask about the rest.',
    tags:    ['Mountain road', 'Exhausted timber', 'Quiet criminal pressure'],
    config: {
      settType:         'village',
      tradeRouteAccess: 'road',
      terrainOverride:  'mountain',
      monsterThreat:    'heartland',
      culture:          'celtic',
      customName:       'Cnocby',
      // lf-033's resolved priority roll, kept exactly — the landing's Cnocby is
      // the town these five numbers make.
      priorityMilitary: 47,
      priorityReligion: 23,
      priorityEconomy:  49,
      priorityCriminal: 64,
      priorityMagic:    21,
      nearbyResourcesRandom: false,
      nearbyResources:       ['mountain_timber', 'alpine_pasture', 'hunting_grounds', 'ancient_grove', 'stone_quarry'],
      nearbyResourcesState:  { mountain_timber: 'depleted' },
      seed:                  'cnocby-033a',
    },
  },
]);

/**
 * Build a fork seed unique to the forker but stable per sample. Forks land in
 * the user's saves with a unique name + seed so two people who fork Mossgate
 * get visually-similar but mechanically-different towns.
 *
 * ⭐ THE SUFFIX IS WHO IS FORKING, AND BOTH HALVES OF THAT WERE WRONG (REVIEW-P
 * F1 + noticed 8, cured 2026-09-20 under ODQ §934.63).
 *
 *   1. A SIGNED-OUT READER WAS THE CONSTANT 'anon', so every anonymous visitor
 *      on earth shared one seed. Walked on two independent browser contexts:
 *      both forks of Cnocby returned id `s_01773858621d9a94`, seed
 *      `cnocby-033a-anon`, the same population and the same four NPCs. The
 *      cure is a per-visitor salt (lib/anonForkSalt.js), minted once and held,
 *      so two visitors differ while a visitor's own re-fork still repeats.
 *   2. AN ACCOUNT WAS TRUNCATED TO EIGHT CHARACTERS, so two accounts whose ids
 *      agree on the first eight hex characters forked the same world. The id is
 *      now used WHOLE. There is nothing for the truncation to buy: the seed is
 *      never a fixed-width field, and the only length constant in the tree is a
 *      defensive 200-char cap in lib/errorReporter.js.
 *
 * ⛔ AND THE SALT IS RESOLVED BY THE CALLER, BECAUSE THIS LAYER MAY NOT MINT IT.
 * `src/data/**` is PURE DATA by a rule with two enforcers (eslint
 * no-restricted-imports on this directory + tests/domain/dataPurity.test.js): no
 * runtime import of generators, store or lib, precisely so ambient entropy and
 * IO cannot enter the tables. A salt is both — localStorage and a random mint —
 * so it is read in the component layer and arrives here already resolved, and
 * this function stays a pure function of its two arguments.
 *
 * ⚠ THAT PUTS THE ONE RULE ON THE DOORS, SO A WALKER HOLDS IT: every
 * `forkSeedFor` call site in `src/` must pass an identity resolved through
 * `forkIdentity` (lib/anonForkSalt.js), pinned by
 * tests/data/sampleSettlements.test.js. Without it this is exactly the shape
 * that bit the sample-fork INTENT, which was passed on one fork door and
 * silently not on the other (ODQ §934.24(b)) — two doors, one rule, and nothing
 * checking that both obeyed it. The `'anon'` fallback below is what a door that
 * forgot would produce, and the walker is what stops one existing.
 *
 * ⛔ WHAT THIS DOES NOT CHANGE: a saved world keeps the seed it was born with
 * (normalizeSettlement stamps its id from `_seed` once), and the same forker
 * re-forking the same card still lands on the same town. Whether a SECOND CLICK
 * should draw fresh is a separate, owner-parked question
 * (docs/DESIGN_FP_ARCH_EP.md §7a row 1) and is deliberately left standing.
 *
 * @param {{ config?: { seed?: string } } | null | undefined} sample
 * @param {string | null | undefined} forkerId who is forking, ALREADY RESOLVED —
 *   the signed-in account id, or this visitor's anonymous fork salt
 * @returns {string|null}
 */
export function forkSeedFor(sample, forkerId) {
  if (!sample || !sample.config?.seed) return null;
  const suffix = typeof forkerId === 'string' && forkerId !== '' ? forkerId : 'anon';
  return `${sample.config.seed}-${suffix}`;
}

/**
 * A sample's config as a fork LOADS it: every key but `seed`. The sample's seed is
 * the fork's generation ARGUMENT (forkSeedFor, then generateSettlement(seed)), never
 * a config key. A `seed` in the stored config broke generation outright once the
 * pipeline began refusing it (see store/settlementGenerateAction.js), and because
 * the config is persisted, one fork broke every later generation in that browser.
 * @param {{ config?: Record<string, unknown> } | null | undefined} sample
 * @returns {Record<string, unknown>}
 */
export function forkConfigFor(sample) {
  if (!sample || !sample.config) return {};
  const config = { ...sample.config };
  delete config.seed;
  return config;
}
