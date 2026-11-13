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

/** The `{holds}` token the no-channel isolated pools splice what the record holds into (#7, #215). */
export const HOLDS_TOKEN = '{holds}';

/** The `{ground}` token the `ground` arm splices the record's terrain into. */
export const GROUND_TOKEN = '{ground}';

/**
 * The terrain the `ground` arm names, in plain words, keyed by the resolved terrain
 * (`config.terrainType`). Riverside is not here: a riverside port with no docks takes the river
 * arm. A terrain not listed (or none) keeps the road arm, as before.
 * @type {Readonly<Record<string, string>>}
 */
export const GROUND_PHRASE = Object.freeze({
  coastal: 'on the shore',
  mountain: 'on the mountainside',
  hills: 'in the hills',
  forest: 'in the forest',
  plains: 'out on the open plain',
  desert: 'in the desert',
});

/**
 * The authored corpus, keyed by ARM. Index 0 of every pool is the exact
 * pre-widening sentence (law 2). Pool length is 5 everywhere (law 3).
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const ORIGIN_POOLS = Object.freeze({
  road: Object.freeze([
    'Established along a road route. Trade flows in, goods flow out, people pass through.',
    'The road was here first. The settlement grew along its verge, and most of what it owns arrived on somebody else\'s cart.',
    'Founded roadside, where the day is measured in traffic: what arrives before noon, what leaves before dusk, and what stops for the night.',
    'A road settlement: it makes its living from other people\'s journeys, in stabling and meals and small repairs.',
    'Sited on a route already worn deep before anyone built here, on the reasoning that a road a century old will not be abandoned in one.',
  ]),

  crossroads: Object.freeze([
    // STYLE-2 FIRST-IMPRESSIONS (A·O16): the aphorism "by geography, not by choice" became the plain fact.
    'Built at a major crossroads, and trade comes in on every road.',
    'Built where two busy roads cross, and laid out around the crossing.',
    'A crossroads settlement: every road brings it trade, and any of them can bring it trouble.',
    'Founded at a junction on the oldest logic there is: whoever holds the meeting of roads holds what moves along them.',
    'It exists because travellers had to stop somewhere, and the roads decided that somewhere was here.',
  ]),

  river: Object.freeze([
    'Built along the river: water access shapes every economic decision.',
    'Founded on the bank, where the current does the hauling; every trade here is priced against what the water carries for nothing.',
    'A river settlement. The channel sets the calendar: what floods, what freezes, and what can be moved between the two.',
    'Sited at the water\'s edge because the river was the only road worth having, and it has been the argument for staying ever since.',
    'Established along the river for drinking, for milling, and for moving what the fields produce. All three still hold.',
  ]),

  'port.generic': Object.freeze([
    'A port settlement whose wharves and navigable water define its trade.',
    'A port: the wharves are why the place exists, and everything else grew up behind them.',
    'Founded where the water runs deep enough to unload. That fact, and no other, put a settlement on this ground.',
    'A working port: its wealth is the cargo it unloads, and its worry is a season when the cargo does not come.',
    'Built around a landing: what it trades comes in by boat, and the place is laid out around the unloading.',
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
    'An inland river port: barges, not ships, and a working season that closes when the channel does.',
    'A river port whose wharves face a moving current; the year is divided by what the channel will allow.',
    'A river port, founded where the water runs deep and steady enough to take a loaded barge. Rarer than it sounds, and worth more.',
    'An inland river port: cargo moves from barges to carts here, and the handling is its living.',
  ]),

  'port.coastal': Object.freeze([
    'A coastal seaport whose existence is inseparable from the sea.',
    'A seaport. The tide sets the working day, and the harbour is the only asset that finally matters.',
    'Founded on the coast for the shelter of its anchorage. The sea gives the settlement its living and sets the terms of it.',
    'A coastal settlement built to face the water. Most of what it eats, sells, and fears arrives the same way.',
    'A seaport that lives by its ships: what they carry off matters more here than anything the land behind it grows.',
  ]),

  // #10's GATE, FINALLY (STYLE-2-SURFACES A·O16; STYLE-RULINGS-2 B2): a port route whose roster
  // holds no docks or wharf founds on the ground the record names, never on the road ("Founded
  // roadside" printed under a port on a mountain, and under a port on the plains of a metropolis).
  // `{ground}` is the terrain in the words of GROUND_PHRASE below. A new arm: no pre-widening sentence,
  // so index 0 is its own.
  // #237 (R2-CODE-A-4; the chair's ruling, vetoable): THE ROUTE IS THE HOME OF "THIS IS A PORT"; THE
  // ROSTER IS THE HOME OF WHAT STANDS THERE. This arm is reached only on a port route, so no row denies
  // a wharf or docks from the roster's silence ("ask for the docks and you are told there are none"
  // beside a page that calls the place a port), and none names one as standing: each row states the
  // terrain and that the place was founded to trade by water, nothing else (no present traffic, which a
  // siege would make false; no "port", which the vocabulary reads as the docks house).
  ground: Object.freeze([
    `Built ${GROUND_TOKEN}, by people who meant to trade by water.`,
    `The first families built ${GROUND_TOKEN}, to trade by water.`,
    `It stands ${GROUND_TOKEN}; it was founded to trade by water.`,
    `Founded ${GROUND_TOKEN}, for trade by water.`,
    `It was built ${GROUND_TOKEN} by people who lived by trade on the water.`,
  ]),

  'isolated.sustained': Object.freeze([
    'Isolated from major trade routes. Self-sufficiency is not an aspiration here; it is a constraint.',
    'Isolated from major trade routes. What the settlement needs, it makes; what it cannot make, it learns to do without.',
    'Set apart from the trade roads. The distance is why it was founded and why it has stayed small and whole.',
    'Isolated by the lie of the land. The place feeds itself, and it cannot grow past what its own fields give.',
    'Off the trade routes entirely. Nothing arrives that was not sent for, and little is sent for.',
  ]),

  // #7 (R2-CODE-A-4): an isolated shortfall where the FOOD RECORD brings nothing in (importCoverage 0: the
  // page says "No food comes into X by trade") names no channel; it says what the record holds, what the
  // town has in store and what it produces itself, in the words of `holdingsOf`. A new arm: index 0 is its own.
  'isolated.unsupplied': Object.freeze([
    `Isolated from major trade routes. The settlement cannot fully feed itself, and no food comes in from outside: it gets by on ${HOLDS_TOKEN}.`,
    `Isolated from major trade routes, and short of what it eats. Nothing is brought in to close the gap; it gets by on ${HOLDS_TOKEN}.`,
    `Set apart from the trade roads, on ground that does not quite feed it. No food reaches it from outside, and it gets by on ${HOLDS_TOKEN}.`,
    `Isolated, and running a shortfall it cannot farm its way out of. Nothing comes in from outside; it gets by on ${HOLDS_TOKEN}.`,
    `Off the trade routes and under-fed by its own land. Nothing is brought in, and every season it gets by on ${HOLDS_TOKEN}.`,
  ]),

  // #215 (round two; the chair's ruling): an isolated shortfall UNDER A SIEGE in force names no channel of
  // trade as open; it says what the record holds (`holdingsOf`). A new arm: index 0 is its own.
  'isolated.besieged': Object.freeze([
    `Isolated from major trade routes, and now under siege. The settlement cannot fully feed itself, and nothing comes in by road: it gets by on ${HOLDS_TOKEN}.`,
    `Isolated from major trade routes, and short of what it eats. With the siege closing the roads, it gets by on ${HOLDS_TOKEN}.`,
    `Set apart from the trade roads, on ground that does not quite feed it, and now cut off by a siege. It gets by on ${HOLDS_TOKEN}.`,
    `Isolated, and running a shortfall it cannot farm its way out of. The siege has closed the roads; it gets by on ${HOLDS_TOKEN}.`,
    `Off the trade routes and under-fed by its own land, and now besieged: nothing comes in by road, and it gets by on ${HOLDS_TOKEN}.`,
  ]),

  'isolated.deficit': Object.freeze([
    `Isolated from major trade routes. The settlement cannot fully feed itself; what the land does not give arrives expensively — through ${CHANNELS_TOKEN} — or not at all.`,
    // ⚠️ THE SPLICE POINT NEEDS A VISIBLE CLOSE. `{channels}` is a LIST, and a
    // comma after it disappears into that list: "…through magical transport,
    // sanctioned caravans, seasonal access, or patronage, at a price the
    // settlement feels." reads as a fifth channel called "at a price". The
    // em-dash is the close the list's end needs — the same device index 0 uses
    // on both sides of its own splice. Any future variant that continues AFTER
    // the token must close it the same way; a bare comma cannot.
    `Isolated from major trade routes, and short of what it eats. The gap is closed through ${CHANNELS_TOKEN} — at a price the settlement feels.`,
    `Set apart from the trade roads, on ground that does not quite feed it. What is missing comes in through ${CHANNELS_TOKEN} — when it comes at all.`,
    // R2-CODE-A-4 (#7): the list is the record's own and may hold one channel; the close reads for one or many.
    `Isolated, and running a shortfall it cannot farm its way out of. Survival here rests on ${CHANNELS_TOKEN} — none of it certain.`,
    `Off the trade routes and under-fed by its own land. The shortfall is met through ${CHANNELS_TOKEN}, and every season the terms are bargained again.`,
  ]),
});

/**
 * THE CHANNELS AN ISOLATED SHORTFALL NAMES (R2-CODE-A-4: round three's #7, the increment's ww-3 and ww-29).
 * The `{channels}` list is read from the record's own isolation receipt (`isolationSupport.js ::
 * deriveIsolationSupport`, kept on the config as `_isolationSupport` by the coherence pass), one phrase for
 * each path that carries food in from outside the place's own land, in this order. A path the receipt
 * lacks is not named: no carriage by magic without the magical-transit path, no patron without the
 * patronage path, no caravans without a caravan or pack-train house among the seasonal path's evidence.
 * The local foodshed and the reserves are the place's own and are never channels.
 * @type {ReadonlyArray<readonly [string, (path: { evidence?: readonly string[] }) => string]>}
 */
const CHANNEL_OF_PATH = Object.freeze([
  ['magical_transit', () => 'carriage by magic'],
  ['hinterland', () => 'carts from the country around it'],
  ['seasonal_access', (path) => ((path.evidence || []).some((e) => /caravan|pack train/i.test(String(e)))
    ? 'the caravans that still come'
    : 'the tracks in a good season')],
  ['patronage', () => 'the favour of a patron'],
]);

/**
 * The `{channels}` list for an isolated shortfall, from the record's isolation receipt; null where the
 * receipt names no outside path (the pool then keeps its token unfilled, which no arm but the
 * isolated-deficit one carries, and that arm is reached only with a receipt).
 * @param {{ paths?: ReadonlyArray<{ type?: string, evidence?: readonly string[] }> } | null | undefined} support
 * @returns {string|null}
 */
export const supportChannelsOf = (support) => {
  const paths = Array.isArray(support?.paths) ? support.paths : [];
  const words = CHANNEL_OF_PATH
    .map(([type, phrase]) => { const path = paths.find((p) => p?.type === type); return path ? phrase(path) : null; })
    .filter((w) => typeof w === 'string');
  if (!words.length) return null;
  if (words.length === 1) return words[0];
  return `${words.slice(0, -1).join(', ')}${words.length > 2 ? ',' : ''} or ${words[words.length - 1]}`;
};

/** The arms that splice what the record holds (`{holds}`). */
const HOLDS_ARMS = new Set(['isolated.unsupplied', 'isolated.besieged']);

/**
 * What an isolated place with no outside supply holds (#7): its stores where the receipt counts a reserves
 * path, what it produces itself where it counts a local foodshed; both, one, or "what little it has".
 * @param {{ paths?: ReadonlyArray<{ type?: string }> } | null | undefined} support
 * @returns {string}
 */
export const holdingsOf = (support) => {
  const paths = Array.isArray(support?.paths) ? support.paths : [];
  const stores = paths.some((p) => p?.type === 'reserves');
  const own = paths.some((p) => p?.type === 'local_foodshed');
  if (stores && own) return 'what it has in store and what it produces itself';
  if (stores) return 'what it has in store';
  if (own) return 'what it produces itself';
  return 'what little it has';
};

/** Every arm key, frozen, so a pin can walk the corpus without hard-coding it. */
export const ORIGIN_ARMS = Object.freeze(Object.keys(ORIGIN_POOLS));

/** The sizes a "living from other people's journeys" is not said of. */
const TRAVELLER_LIVING_REFUSED_TIERS = new Set(['city', 'metropolis']);

/** @param {{ siege?: boolean }} state */
const noSiege = (state) => state.siege !== true;

/**
 * THE ROWS A FOUNDING STATE REFUSES (R2-CODE-A-4: round three's #154 and the increment's #ww-1227, the
 * chair's rulings of 2026-11-13 20:33 and 21:14). A row listed here is said only where its test holds;
 * a refused pick resolves DRAW-FREE to the next admitted row of the same pool (pickVariant's index,
 * then onward, wrapping), so law 1 holds: no draw is added or moved. A pool or a row not listed is
 * admitted everywhere, and a state that does not say (no `siege`, no `tier`, no traveller flag) is
 * admitted, so a seedless or bare caller keeps the pre-RR sentence (law 2).
 *   - Present traffic (trade flowing in, a day measured in traffic, a living from journeys, busy roads,
 *     trade on every road) is refused while a siege is in force: nothing comes in by road.
 *   - "A living from other people's journeys, in stabling and meals" needs a house that serves
 *     travellers (an inn or a tavern: the vocabulary's `tavern` atom, read by the caller), and is not
 *     said of a city or a metropolis, whose living is not other people's journeys.
 * @type {Readonly<Record<string, Readonly<Record<number, (state: { siege?: boolean, tier?: string|null, hasTravellerHouse?: boolean }) => boolean>>>>}
 */
export const ORIGIN_ROW_ADMITS = Object.freeze({
  road: Object.freeze({
    0: noSiege,
    2: noSiege,
    3: (state) => noSiege(state)
      && state.hasTravellerHouse !== false
      && !TRAVELLER_LIVING_REFUSED_TIERS.has(String(state.tier || '')),
  }),
  crossroads: Object.freeze({ 0: noSiege, 1: noSiege, 2: noSiege }),
});

/**
 * The index the founding state takes in its arm's pool: the hash's pick, or, where the state refuses
 * that row, the next admitted row (draw-free). Where no row is admitted the pick stands.
 * @param {string} arm
 * @param {readonly string[]} pool
 * @param {number} at the hash's pick
 * @param {{ siege?: boolean, tier?: string|null, hasTravellerHouse?: boolean }} state
 * @returns {number}
 */
const admittedIndex = (arm, pool, at, state) => {
  const admits = ORIGIN_ROW_ADMITS[arm];
  if (!admits) return at;
  for (let k = 0; k < pool.length; k++) {
    const i = (at + k) % pool.length;
    const test = admits[i];
    if (!test || test(state)) return i;
  }
  return at;
};

/**
 * Resolve the ARM for a founding state. This is the pre-RR branch structure
 * exactly: route, with the port terrain sub-arms and the isolated deficit split.
 * @param {{ route?: string, terrainType?: string|null, hasFoodDeficit?: boolean, hasDocks?: boolean, hasFoodImport?: boolean, siege?: boolean }} state
 * @returns {string} an ORIGIN_POOLS key
 */
export const originArmKey = ({ route, terrainType = null, hasFoodDeficit = false, hasDocks, hasFoodImport, siege }) => {
  if (route === 'crossroads') return 'crossroads';
  if (route === 'river') return 'river';
  // #10 (STYLE-RULINGS §1, W5 HIS 2026-11-07) — A RECORD DEFECT, NOT A WORDING: a port reason
  // over a roster with no docks or wharf institution contradicted the record (a mountain thorp
  // with no docks read "A port. The wharves are the reason the place exists"). `hasDocks` is the
  // roster's port-infrastructure flag; an EXPLICIT false takes the arm the terrain gives (the
  // river for a riverside town, else the road). An absent flag is a caller that did not say, and
  // keeps the port arm exactly as before.
  // STYLE-2 A·O16: with no docks the arm is the TERRAIN's — the river for a riverside town, the
  // ground the record names for any other, the road only where the record names no terrain.
  if (route === 'port' && hasDocks === false) {
    if (terrainType === 'riverside') return 'river';
    return terrainType && Object.hasOwn(GROUND_PHRASE, terrainType) ? 'ground' : 'road';
  }
  if (route === 'port') {
    if (terrainType === 'riverside') return 'port.riverside';
    if (terrainType === 'coastal') return 'port.coastal';
    return 'port.generic';
  }
  // #7: a shortfall the food record brings nothing in for (an explicit false; absent keeps the deficit arm)
  // names no channel.
  // #215: a shortfall under a siege in force names no channel as open, whatever the food record brings in.
  if (route === 'isolated' && hasFoodDeficit && siege === true) return 'isolated.besieged';
  if (route === 'isolated' && hasFoodDeficit && hasFoodImport === false) return 'isolated.unsupplied';
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
 * @param {{ route?: string, terrainType?: string|null, hasFoodDeficit?: boolean, hasDocks?: boolean,
 *           supportChannels?: string, specialResources?: readonly string[]|null,
 *           seed?: string|null, siege?: boolean, tier?: string|null, hasTravellerHouse?: boolean,
 *           hasFoodImport?: boolean, isolationSupport?: { paths?: ReadonlyArray<{ type?: string }> } | null }} state
 * @returns {string}
 */
export const selectOriginBody = (state) => {
  const arm = originArmKey(state);
  const pool = ORIGIN_POOLS[arm];
  const hashed = pickVariant(pool, originVariantKey({ ...state, arm }));
  const picked = pool[admittedIndex(arm, pool, pool.indexOf(hashed), state)];
  const body = arm === 'ground'
    ? picked.split(GROUND_TOKEN).join(GROUND_PHRASE[/** @type {string} */ (state.terrainType)])
    : picked;
  const held = HOLDS_ARMS.has(arm) ? body.split(HOLDS_TOKEN).join(holdingsOf(state.isolationSupport)) : body;
  return state.supportChannels
    ? held.split(CHANNELS_TOKEN).join(state.supportChannels)
    : held;
};
