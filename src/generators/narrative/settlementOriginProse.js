/**
 * settlementOriginProse.js — THE ORIGIN RUNG'S AUTHORED CORPUS (lane RR, part A).
 *
 * `generateSettlementReason` used to hold ONE sentence per arm. Nine arms, nine
 * bodies, forever: PT2-5 measured the whole corpus at 9 distinct bodies over 576
 * generations, with the DEFAULT `road` arm — 192 of those 576 — carrying a single
 * sentence. Two settlements sharing a route and a terrain printed the identical
 * origin line in the journal, the PDF, the dossier Origin note, the AI grounding
 * payload and the spine. The rung carried no per-settlement identity at all.
 *
 * This module is the widening PT2-5 designed and docs/GOLDEN_SHIFT_LEDGER.md
 * recorded. It holds the authored pools; `narrativeGenerator.generateSettlementReason`
 * keeps the branch logic and stays the single writer of the field.
 *
 * ── THREE LAWS, each one load-bearing ───────────────────────────────────────
 *
 * 1. DRAW-FREE. Selection goes through `pickVariant` (src/kernel/proseHash.js),
 *    which hashes a seed string and consumes ZERO PRNG draws. Adding a `pick()`
 *    here would insert a draw and fork every downstream roll in the settlement —
 *    the stream-theft class. Same idiom as historyGenerator's variant pick and
 *    assembleInstitutions' institution descriptions.
 *
 * 2. CANONICAL-AT-ZERO. Every pool's index 0 is the EXACT pre-widening sentence,
 *    and `pickVariant` returns index 0 for any falsy seed. Every seedless caller
 *    — including tests/generators/settlementReason.test.js and
 *    tests/generators/narrativeArrival.test.js, which pass a bare `{}` config —
 *    is therefore byte-identical to the pre-RR tree. Only the seeded generation
 *    path varies. This is the same law eventProse.js and proseHash.js carry.
 *
 * 3. NO POWER-OF-TWO POOL. `pickVariant` selects with `fnv1a32(key) % pool.length`,
 *    and FNV-1a's bit 0 is the input's XOR-parity rather than a hash — a
 *    power-of-two modulus reads exactly those weak low bits and can silently kill
 *    half a pool for any seed family whose varying token repeats an even number of
 *    times (memory: fnv1a-low-bit-parity-pool-aliasing; cured in `whatPhrase`,
 *    still live in `frameHeadline`). Every pool below therefore has FIVE entries,
 *    and tests/generators/settlementOriginProse.test.js pins every member of every
 *    pool REACHABLE over a real seed family — the only assertion shape that
 *    catches a halved pool (a share/uniformity check passes happily on one).
 *
 * ── WHAT THE SELECTION KEY READS ────────────────────────────────────────────
 * The chair ruling asks the origin to draw on "route × the settlement's actual
 * founding state". The ARM is the route branch (with the port and isolated
 * sub-arms the pre-RR code already had); the VARIANT is chosen from a key that
 * folds in the terrain the pipeline resolved, whether the food ledger records a
 * meaningful deficit, the settlement's special-resource endowment, and the
 * pipeline seed. So terrain, resources and founding condition are all live inputs
 * to which sentence a settlement gets, while no variant can CONTRADICT them:
 * within an arm the variants state the same fact in different voices, which is
 * what keeps the rung safe for the AI grounding payload.
 *
 * ── THE DM-EDIT BOUNDARY ────────────────────────────────────────────────────
 * `settlementReason` is DM-editable (src/domain/userEdits.js:91,
 * display/stateProse/dmFieldProjection.js:53). Selection happens HERE, on the
 * generator side, strictly before the DM's override is applied — and nothing
 * causal or machine-derived is wired into the field.
 */

import { pickVariant } from '../../kernel/proseHash.js';

/** The `{channels}` token the isolated-deficit pool splices the support list into. */
export const CHANNELS_TOKEN = '{channels}';

/**
 * The authored corpus, keyed by ARM. Index 0 of every pool is the exact
 * pre-widening sentence (law 2). Pool length is 5 everywhere (law 3).
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const ORIGIN_POOLS = Object.freeze({
  road: Object.freeze([
    'Established along a road route — trade flows in, goods flow out, people pass through.',
    'The road was here first. The settlement grew along its verge, and most of what it owns arrived on somebody else\'s cart.',
    'Founded roadside, where the day is measured in traffic: what arrives before noon, what leaves before dusk, and what stops for the night.',
    'A road settlement — it makes its living from other people\'s journeys, in stabling and meals and small repairs.',
    'Sited on a route already worn deep before anyone built here, on the reasoning that a road a century old will not be abandoned in one.',
  ]),

  crossroads: Object.freeze([
    'Positioned at a major crossroads — trade flows through here by geography, not by choice.',
    'Built where two roads refuse to avoid each other. Nobody chose this ground; the map did.',
    'A crossroads settlement — the meeting of routes is the whole of its fortune and the whole of its exposure.',
    'Founded at a junction on the oldest logic there is: whoever holds the meeting of roads holds what moves along them.',
    'It exists because travellers had to stop somewhere, and the roads decided that somewhere was here.',
  ]),

  river: Object.freeze([
    'Built along the river — water access shapes every economic decision.',
    'Founded on the bank, where the current does the hauling; every trade here is priced against what the water carries for nothing.',
    'A river settlement. The channel sets the calendar — what floods, what freezes, and what can be moved between the two.',
    'Sited at the water\'s edge because the river was the only road worth having, and it has been the argument for staying ever since.',
    'Established along the river for drinking, for milling, and for moving what the fields produce. All three still hold.',
  ]),

  'port.generic': Object.freeze([
    'A port settlement whose wharves and navigable water define its trade.',
    'A port. The wharves are the reason the place exists, and everything inland of them is a consequence.',
    'Founded where the water runs deep enough to unload — that fact, and no other, put a settlement on this ground.',
    'A working port: what it is worth is counted in berths, and what it fears is counted in the same.',
    'Built around a landing. Trade arrives by hull rather than by axle, and the whole economy is shaped to that difference.',
  ]),

  // ⚠️ EVERY VARIANT OF THIS ARM IS WORLD-LAW CONSTRAINED. An inland river port
  // has NO maritime capability (generationContext: maritime needs `coastal`
  // terrain, or a port route on non-riverside terrain), so a variant carrying
  // "sea traffic", "seaport", "coastal trade" etc. makes the coherence auditor
  // raise "Maritime claim without coastal or ocean-going capability." and the
  // whole dossier drops to needs_review. Two of the first-draft variants here did
  // exactly that and tests/generators/generationWorldLaw.test.js caught them.
  // Every variant must also carry a river-port token — the same audit reads
  // `settlementReason` for /river port|barges/i. Both rules are pinned in
  // tests/generators/settlementOriginProse.test.js against the REAL predicate.
  'port.riverside': Object.freeze([
    'A river port built around navigable inland water; barges, wharves, and seasonal river traffic shape its economy.',
    'An inland river port — barges rather than hulls, and a working season that closes when the channel does.',
    'A river port whose wharves face a moving current; the year is divided by what the channel will allow.',
    'A river port, founded where the water runs deep and steady enough to take a loaded barge — rarer than it sounds, and worth more.',
    'An inland river port: cargo changes between barges and carts here, and the changing is itself the trade.',
  ]),

  'port.coastal': Object.freeze([
    'A coastal seaport whose existence is inseparable from the sea.',
    'A seaport. The tide sets the working day, and the harbour is the only asset that finally matters.',
    'Founded on the coast for the shelter of its anchorage — the sea gives the settlement its living and sets the terms of it.',
    'A coastal settlement built to face the water. Most of what it eats, sells, and fears arrives the same way.',
    'A seaport whose horizon is its market; what the land behind it produces matters less than what the hulls carry off.',
  ]),

  'isolated.sustained': Object.freeze([
    'Isolated from major trade routes. Self-sufficiency is not an aspiration here; it is a constraint.',
    'Isolated from major trade routes. What the settlement needs, it makes; what it cannot make, it learns to do without.',
    'Set apart from the trade roads. The distance is why it was founded and why it has stayed small and whole.',
    'Isolated by geography rather than by preference. The place feeds itself, and that is both its security and its ceiling.',
    'Off the trade routes entirely. Nothing arrives that was not sent for, and little is sent for.',
  ]),

  'isolated.deficit': Object.freeze([
    `Isolated from major trade routes. The settlement cannot fully feed itself; what the land does not give arrives expensively — through ${CHANNELS_TOKEN} — or not at all.`,
    `Isolated from major trade routes, and short of what it eats. The gap is closed through ${CHANNELS_TOKEN}, at a price the settlement feels.`,
    `Set apart from the trade roads, on ground that does not quite feed it. What is missing comes in through ${CHANNELS_TOKEN} — when it comes at all.`,
    `Isolated, and running a shortfall it cannot farm its way out of. Survival here rests on ${CHANNELS_TOKEN} — every one of them fragile.`,
    `Off the trade routes and under-fed by its own land. The shortfall is met through ${CHANNELS_TOKEN}, and the arrangement is renegotiated every season.`,
  ]),
});

/** Every arm key, frozen, so a pin can walk the corpus without hard-coding it. */
export const ORIGIN_ARMS = Object.freeze(Object.keys(ORIGIN_POOLS));

/**
 * Resolve the ARM for a founding state. This is the pre-RR branch structure
 * exactly: route, with the port terrain sub-arms and the isolated deficit split.
 * @param {{ route?: string, terrainType?: string|null, hasFoodDeficit?: boolean }} state
 * @returns {string} an ORIGIN_POOLS key
 */
export const originArmKey = ({ route, terrainType = null, hasFoodDeficit = false }) => {
  if (route === 'crossroads') return 'crossroads';
  if (route === 'river') return 'river';
  if (route === 'port') {
    if (terrainType === 'riverside') return 'port.riverside';
    if (terrainType === 'coastal') return 'port.coastal';
    return 'port.generic';
  }
  if (route === 'isolated') return hasFoodDeficit ? 'isolated.deficit' : 'isolated.sustained';
  // Every other route (road, mountain_pass, none, unset…) founds on the road arm,
  // which is what the pre-RR `else` branch did.
  return 'road';
};

/**
 * The draw-free selection key. Non-empty ONLY when a pipeline seed is present, so
 * a seedless caller falls through pickVariant's canonical-at-zero contract and
 * gets the pre-widening sentence byte-for-byte.
 *
 * The varying tokens each appear ONCE in the key. That matters: the FNV parity
 * aliasing recorded in memory bites seed families whose varying token repeats an
 * EVEN number of times, and single-occurrence families are the safe shape.
 *
 * @param {{ seed?: string|null, arm: string, terrainType?: string|null,
 *           hasFoodDeficit?: boolean, specialResources?: readonly string[]|null }} state
 * @returns {string|null}
 */
export const originVariantKey = ({ seed, arm, terrainType = null, hasFoodDeficit = false, specialResources = null }) => {
  const s = typeof seed === 'string' ? seed.trim() : '';
  if (!s) return null;
  const res = Array.isArray(specialResources) && specialResources.length
    ? [...specialResources].map(String).sort().join(',')
    : 'none';
  return `${s}::settlement-origin::${arm}::terrain:${terrainType || 'unset'}::deficit:${hasFoodDeficit ? 1 : 0}::res:${res}`;
};

/**
 * THE ONE ENTRY POINT. Returns the origin sentence for a founding state.
 *
 * @param {{ route?: string, terrainType?: string|null, hasFoodDeficit?: boolean,
 *           supportChannels?: string, specialResources?: readonly string[]|null,
 *           seed?: string|null }} state
 * @returns {string}
 */
export const selectOriginBody = (state) => {
  const arm = originArmKey(state);
  const pool = ORIGIN_POOLS[arm];
  const body = pickVariant(pool, originVariantKey({ ...state, arm }));
  return state.supportChannels
    ? body.split(CHANNELS_TOKEN).join(state.supportChannels)
    : body;
};
