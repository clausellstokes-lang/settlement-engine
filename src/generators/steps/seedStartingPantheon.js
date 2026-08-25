/**
 * Step: seedStartingPantheon — the LATENT starting pantheon
 * (Phase 4 W-F5 stage 2; RELIGION_REWORK §6, PHASE4_FAITH_DELTA §4 + the
 * PREMIUM GATE addendum, owner 2026-07-10).
 *
 * IMPLEMENTATION LAW — TIER NEVER TOUCHES GENERATION: this step bakes the
 * starting pantheon LATENTLY for every seed. It draws a chief (patron) deity +
 * 0..(capacity−1) minor cults from the GOVERNED core pool
 * (src/generators/data/deityPool.js), affinity-weighted by terrain / culture /
 * government,
 * and writes them to `config.latentPantheon` — NEVER to the live embed keys
 * (`primaryDeitySnapshot` / `cultDeitySnapshots`). Account tier is invisible
 * here (identical data for all tiers; ONE golden per seed): a free account's
 * settlement carries the same latent gods a premium one does — "the gods were
 * always there, latent in the seed."
 *
 * ACTIVATION is a separate, rng-free, post-generation seam
 * (domain/worldPulse/latentPantheon.js — activateLatentPantheon copies the
 * latent patron/cults into the live embed keys, in the exact setPrimaryDeity /
 * imposeCult field-disciplined shape). Until it fires there are ZERO embeds, so
 * the religion subsystem gate stays closed and the engine is provably inert by
 * the neutrality theorem — the free tier IS the certified ground state.
 *
 * LATENCY DISCIPLINE: nothing at generation time may NAME a latent deity —
 * no prose, no hooks, no pipeline-rail summary text (the rail summary in
 * stepMetadata reports counts only). The latent record is data for the
 * activation seam and the (premium-gated, W-F6) dossier surfaces alone.
 *
 * Config surface (architect-ratified default): `config.faith` —
 *   absent / 'pantheon'  ⇒ bake the latent pantheon (the DEFAULT for new
 *                          generations; this wave's deliberate golden change),
 *   'none'               ⇒ OPT-OUT: the step writes NOTHING and draws NOTHING
 *                          beyond its isolated per-step fork — byte-identical
 *                          faith-free output.
 * An input config that ALREADY carries a live primaryDeitySnapshot (a DM
 * assignment echoed through regeneration) is respected verbatim — the step
 * bakes no latent record beneath an explicit deity.
 *
 * Determinism: the runner forks this step's PRNG by name; candidate lists are
 * codepoint-ordered by slug before every weighted draw; the draw sequence
 * (patron → cult count → cults) is fixed. Same seed ⇒ same latent pantheon.
 *
 * Niche discipline (post axis-retirement): temper derives from alignment, so a
 * deity's niche is a pure function of its axes. Cults are drawn with niches
 * DISTINCT from the patron's and each other's (one-deity-per-niche — the
 * religionState entry discipline), so an activated pantheon never opens in a
 * day-one patron contest. Capacity stays the hard ceiling (capacityForTier).
 */
import { registerStep } from '../pipeline.js';
import { capacityForTier, nicheOf } from '../../domain/worldPulse/cultImpositionApply.js';
import { DEITY_POOL, deityCoreRef } from '../data/deityPool.js';

// Affinity weights — matches lift the draw, mismatches never exclude (every
// deity remains reachable everywhere; the plane stays fully expressible).
const W_TERRAIN = 0.75;
const W_CULTURE = 0.5;
const W_GOVERNMENT = 0.5;
// Patron draws prefer the pool's great powers a little (rank-weighted), while
// minor gods still take seats — variety as content, not a fixed hierarchy.
const PATRON_RANK_WEIGHT = Object.freeze({ major: 1.5, minor: 1.0 });
// Cults are fringe faiths: minor/cult ranks only (a 'major' god never enters
// as a cult), and small settlements sustain at most a couple beside the patron.
const MAX_CULTS = 2;

/** The government AFFINITY CLASS of a governing-faction name — the same regex
 * idiom mandateAlignmentFit reads (government strings are faction names, not an
 * enum). @param {unknown} government @returns {string} */
export function governmentClassOf(government) {
  const g = String(government || '').toLowerCase();
  if (/theocra|temple|church|priest|faith/.test(g)) return 'theocratic';
  if (/despot|autocra|imperial|empire|milit|warlord|garrison|legion/.test(g)) return 'martial';
  if (/monarch|feudal|kingdom|throne|royal|king|queen|noble|lord/.test(g)) return 'monarchic';
  return 'civic';
}

/** Affinity weight of a pool deity for this settlement's context. Base 1 so no
 * candidate is ever excluded; matches add. Pure.
 * @param {import('../data/deityPool.js').PoolDeity} d
 * @param {{ terrain: string, culture: string, govClass: string }} site */
export function affinityWeightOf(d, site) {
  let w = 1;
  if (d.affinity.terrain.includes(site.terrain)) w += W_TERRAIN;
  if (d.affinity.culture.includes(site.culture)) w += W_CULTURE;
  if (d.affinity.government.includes(site.govClass)) w += W_GOVERNMENT;
  return w;
}

/**
 * The field-disciplined frozen snapshot of a pool deity — the EXACT shape
 * setPrimaryDeity/imposeCult write (re-picked fields, never a spread; no
 * wall-clock), plus the owner-ratified optional `portfolio` flavor field
 * (free text, ZERO mechanics — additive to the embed shape). The activation
 * seam copies these records VERBATIM into the live embed keys, so latent and
 * activated data are byte-equal. @param {import('../data/deityPool.js').PoolDeity} d
 */
export function poolDeityEmbed(d) {
  return Object.freeze({
    _deityRef: deityCoreRef(d.slug),
    name: String(d.name || ''),
    alignmentAxis: d.alignmentAxis || 'neutral',
    temperamentAxis: d.temperamentAxis || 'neutral',
    rankAxis: d.rankAxis || 'minor',
    lawAxis: d.lawAxis || 'neutral',
    ...(d.domain ? { domain: String(d.domain) } : {}),
    ...(d.portfolio ? { portfolio: String(d.portfolio) } : {}),
  });
}

/** Codepoint-ordered (by slug) copy of the pool — the deterministic draw order. */
const ORDERED_POOL = Object.freeze(
  DEITY_POOL.slice().sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0)),
);

registerStep('seedStartingPantheon', {
  // generatePower: the affinity read wants the governing faction (government
  // class). resolveConfig gives tier/terrain/culture/effectiveConfig.
  deps: ['resolveConfig', 'generatePower'],
  reads: ['tier', 'terrainType', 'culture', 'effectiveConfig', 'powerStructure'],
  provides: [],
  mutates: ['effectiveConfig'], // the LATENT record lands on the resolved config snapshot (→ settlement.config.latentPantheon)
  phase: 'assembly',
}, (ctx, rng) => {
  const config = ctx.config || {};
  const effective = ctx.effectiveConfig;
  if (!effective || typeof effective !== 'object') return;

  // Tolerant faith reader: 'none' is the ratified opt-out; absent or anything
  // else ⇒ 'pantheon' (the default for new generations). The opt-out path
  // returns before ANY draw or write — byte-identical faith-free output.
  const faith = String(config.faith ?? effective.faith ?? 'pantheon');
  if (faith === 'none') return;

  // Never bake latent gods beneath an explicit live deity (a DM assignment
  // echoed through regeneration is respected verbatim).
  if (effective.primaryDeitySnapshot || config.primaryDeitySnapshot) return;

  const site = {
    terrain: String(ctx.terrainType || effective.terrainOverride || 'plains'),
    culture: String(ctx.culture || 'germanic'),
    govClass: governmentClassOf(ctx.powerStructure?.government || ctx.powerStructure?.governingName),
  };

  // 1. The chief (patron): affinity- and rank-weighted over major/minor entries.
  const patronCandidates = ORDERED_POOL.filter((d) => d.rankAxis === 'major' || d.rankAxis === 'minor');
  const patron = rng.weightedPick(
    patronCandidates,
    patronCandidates.map((d) => affinityWeightOf(d, site) * (PATRON_RANK_WEIGHT[d.rankAxis] || 1)),
  );
  if (!patron) return; // an empty pool bakes nothing (never a half-pantheon)

  // 2. Minor cults: 0..min(capacity−1, MAX_CULTS), each drawn affinity-weighted
  //    from minor/cult entries in a niche DISTINCT from the patron's and every
  //    prior cult's (one-deity-per-niche; capacity is the hard ceiling).
  const cultCapacity = Math.max(0, Math.min(capacityForTier(ctx.tier) - 1, MAX_CULTS));
  const cultCount = cultCapacity > 0 ? rng.randInt(0, cultCapacity) : 0;
  const usedNiches = new Set([nicheOf(patron)]);
  const usedSlugs = new Set([patron.slug]);
  const cults = [];
  for (let i = 0; i < cultCount; i++) {
    const candidates = ORDERED_POOL.filter((d) =>
      (d.rankAxis === 'minor' || d.rankAxis === 'cult')
      && !usedSlugs.has(d.slug)
      && !usedNiches.has(nicheOf(d)));
    if (!candidates.length) break; // niches exhausted — bounded, never forced
    const cult = rng.weightedPick(candidates, candidates.map((d) => affinityWeightOf(d, site)));
    usedNiches.add(nicheOf(cult));
    usedSlugs.add(cult.slug);
    cults.push(cult);
  }

  // 3. Bake the LATENT record onto the RESOLVED config snapshot
  //    (assembleSettlement spreads it into settlement.config; the raw _config
  //    input stays untouched, so a same-seed regeneration re-bakes this exact
  //    pantheon). NO live embed keys are written — zero embeds until the
  //    activation seam fires, so the engine stays provably inert.
  effective.faith = 'pantheon';
  effective.latentPantheon = Object.freeze({
    patron: poolDeityEmbed(patron),
    ...(cults.length ? { cults: Object.freeze(cults.map(poolDeityEmbed)) } : {}),
  });
});
