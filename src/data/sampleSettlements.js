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
 *                 state (Black Crag marks iron `depleted`) when a defining
 *                 resource trait must survive the per-user fork suffix rather
 *                 than ride the random depletion roll. Plus a seed so forks
 *                 are reproducible within a session — each user still gets a
 *                 different SETTLEMENT because the seed is suffixed with the
 *                 user id at fork time (they share the card's name, not its
 *                 people or history).
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
  {
    id:      'sample-thornwell',
    name:    'Thornwell',
    tier:    'village',
    terrain: 'forest',
    teaser:  "A forest village a week from the nearest road, where every cottage bars its door twice and the hunter's lodge kills more wolves than the militia has ever fought men.",
    tags:    ['Frontier', 'Monster pressure', 'Self-reliant'],
    config: {
      settType:         'village',
      tradeRouteAccess: 'isolated',
      terrainOverride:  'forest',
      monsterThreat:    'plagued',
      culture:          'germanic',
      customName:       'Thornwell',
      priorityMilitary: 60,
      priorityReligion: 45,
      priorityEconomy:  30,
      priorityCriminal: 20,
      priorityMagic:    35,
      seed:             'thornwell-034',
    },
  },
]);

/**
 * Build a fork seed unique to the user but stable per sample. Forks
 * land in the user's saves with a unique name + seed so two users who
 * fork Mossgate get visually-similar but mechanically-different towns.
 */
export function forkSeedFor(sample, userId) {
  if (!sample || !sample.config?.seed) return null;
  const suffix = (userId || 'anon').slice(0, 8);
  return `${sample.config.seed}-${suffix}`;
}
