/**
 * data/oracleCorpus.js — THE ORACLE's in-register texture corpus (V-14, VISION WAVE).
 *
 * Pure frozen data, zero behavior (the src/data leaf convention: exempt from the domain
 * max-lines ratchet). These are the TEXTURE lines the deterministic oracle weaves around
 * the WORLD-TRUTH it reads from the ledgers — the corpus never carries a fact, only tone.
 * Every actual claim in an oracle answer comes from a ledger with a basis note; the corpus
 * is the sentence it rides in. Selection is deterministic (pickVariant over the oracle rng
 * seed), so the same question against the same world yields the same scene.
 */

/** Scene texture for a world under some live pressure (danger and/or turmoil present). */
export const ORACLE_SCENE_TEXTURE = Object.freeze([
  'A hush sits over the approach: the kind that comes just before news.',
  'You catch the smell of woodsmoke and the sound of hurried feet.',
  'Doors that should stand open are barred, and eyes track you from the shutters.',
  'The road is busier than it should be, all of it moving one way.',
  'A bell rings somewhere ahead, then stops, as if thought better of.',
  'Someone has scrawled a warning at the milestone; the paint is still wet.',
]);

/** Scene texture for a quiet world (no live danger or turmoil bears on the question). */
export const ORACLE_QUIET_SCENE = Object.freeze([
  'The road gives you nothing to fear today; the day is only itself.',
  'Ordinary business fills the way: carts, gossip, a dog asleep in the sun.',
  'Nothing stirs that the ledgers have not already forgotten.',
  'The approach is unremarkable, which is its own kind of answer.',
]);

/** Connectors that frame a live ledger fact as a complication (the {detail} is world-true). */
export const ORACLE_COMPLICATION_FRAMES = Object.freeze([
  'but {detail} is already in motion here',
  'and {detail} forces the question sooner than you\'d like',
  'though {detail} shadows whatever you decide',
  'yet {detail} will not wait for you',
]);

/** The four odds rungs the player sets as their prior (the Mythic-style ladder). Order
 *  is meaningful (certain → farfetched); base is p(yes) before any ledger weight. */
export const ORACLE_LIKELIHOODS = Object.freeze([
  { id: 'certain', label: 'Almost certain', base: 0.90 },
  { id: 'likely', label: 'Likely', base: 0.70 },
  { id: 'even', label: 'Even odds', base: 0.50 },
  { id: 'unlikely', label: 'Unlikely', base: 0.30 },
  { id: 'farfetched', label: 'Far-fetched', base: 0.10 },
]);
