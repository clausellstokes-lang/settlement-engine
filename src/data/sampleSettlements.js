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
 * Each sample carries:
 *   - id        — stable identifier (used by the fork action)
 *   - name      — display name shown on the card
 *   - tier      — settlement tier ('hamlet' | 'village' | 'town' | 'city' | 'capital')
 *   - terrain   — one-word terrain hint for the card subtitle
 *   - teaser    — single-sentence character pitch (italic, parchment serif)
 *   - tags      — 3-4 chip-style tags to set expectations
 *   - config    — the generator input the "Fork & Forge" CTA loads into
 *                 the wizard. Same shape as `settlement.config` on a
 *                 real save, plus a seed so forks are reproducible
 *                 within a session (but each user gets a different
 *                 character because the SEED is suffixed with the user
 *                 id at fork time).
 */

export const SAMPLE_SETTLEMENTS = Object.freeze([
  {
    id:      'sample-mossgate',
    name:    'Mossgate',
    tier:    'town',
    terrain: 'coastal',
    teaser:  'A rain-blessed lakeside town where the council and the temple have stopped speaking, and the harbour-master quietly runs both.',
    tags:    ['Coastal trade', 'Contested council', 'Religious tension'],
    config: {
      settType:         'town',
      tradeRouteAccess: 'port',
      nearbyTerrain:    'coastal',
      monsterThreat:    'occasional',
      sliders: {
        military:  35,
        religious: 70,
        economic:  68,
        criminal:  30,
        magical:   25,
      },
      seed: 'sample-mossgate-v1',
    },
  },
  {
    id:      'sample-blackcrag',
    name:    'Black Crag',
    tier:    'city',
    terrain: 'mountain',
    teaser:  'A mountain city built on iron, ruled by a guild of master smiths, surrounded by mines that have started giving up too little ore.',
    tags:    ['Industrial', 'Guild power', 'Dwindling resource'],
    config: {
      settType:         'city',
      tradeRouteAccess: 'crossroads',
      nearbyTerrain:    'mountain',
      monsterThreat:    'frontier',
      sliders: {
        military:  60,
        religious: 35,
        economic:  78,
        criminal:  45,
        magical:   30,
      },
      seed: 'sample-blackcrag-v1',
    },
  },
  {
    id:      'sample-thornwell',
    name:    'Thornwell',
    tier:    'village',
    terrain: 'forest',
    teaser:  'A forest village a week from the nearest road, where every cottage has a door that locks twice and the woodward kills more wolves than the militia has ever fought men.',
    tags:    ['Frontier', 'Monster pressure', 'Self-reliant'],
    config: {
      settType:         'village',
      tradeRouteAccess: 'road',
      nearbyTerrain:    'forest',
      monsterThreat:    'frontier',
      sliders: {
        military:  55,
        religious: 50,
        economic:  30,
        criminal:  20,
        magical:   40,
      },
      seed: 'sample-thornwell-v1',
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
