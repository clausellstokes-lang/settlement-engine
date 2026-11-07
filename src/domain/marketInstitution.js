/**
 * src/domain/marketInstitution.js — IS THERE A REAL MARKET HERE? A re-export of the one home.
 *
 * The rung-1 landing (LANDING-2, 2026-11-04) moved `hasMarketInstitution` out of
 * src/generators/economy/viability.js to this path (the domain -> generators boundary); the
 * pool census (CENSUS-1 wave 0, fact 5) moved the same rule to src/domain/facts/market.js, which
 * reads the LIVE roster. The two moves composed at the rung-2 merge (R2-SHADOW, 2026-11-07):
 * one rule, one home — this path re-exports it, so nothing holds a second copy.
 */
export { hasMarketInstitution } from './facts/market.js';
