/**
 * domain/worldPulse/treasury.js — THE STATE TREASURY: the estate's first conserved
 * COIN stock (W-COIN-1a — the stock, the flag, the lifecycle).
 *
 * Until this leaf there was no money in the world. `incomeSources` narrates taxation
 * in prose, prosperity is an OPINION whose smallest transactable unit is one band, and
 * the only conserved material stock is the granary's `storageMonths`. The peace
 * engine's own executor says so in its header: "There is NO treasury and NO
 * conserved-coin primitive anywhere in the estate." This leaf is that primitive, and
 * the ruling that forbade it (f3cf639e, no-conserved-coin) was REVERSED by owner order
 * (ODQ §731.1, Q-W8 GRANTED). The architecture is docs/DESIGN_W_COIN.md as amended by
 * AMENDMENT A1, which outranks the body; Q10/A1.21 and Q11/A1.23 (ODQ §763.2) are the
 * two ratifications this car ships under.
 *
 * ── WHAT THIS CAR CONTAINS, AND WHAT IT DELIBERATELY DOES NOT ─────────────────
 * 1a lands the STOCK and its lifecycle: the record, the accessors, the derived
 * capacity, the ONE transfer primitive, the ONE cross-settlement applicator, the ONE
 * governing-power resolution law, and the ONE pulse writer behind the ONE flag door.
 * It mints NO coin — taxation is 1b's only mint kind — and it ships NO caller of the
 * transfer primitive: the first callers are W-COIN-3's movers. The primitive therefore
 * lands fully unit-tested and dormant, which is deliberate and is stated here so a
 * later reader does not mistake "no caller" for "unfinished".
 *
 * NEVER, in any car (design §4.3 + A1.3, and these are design violations rather than
 * judgment calls): negative coin — an unpayable cost becomes a typed SHORTFALL receipt,
 * because debt is a genuinely new capability class and is owner-gated; coin from RNG;
 * coin written anywhere outside the writer + applicator pair; any exchange rate between
 * coin and grain, in either direction.
 *
 * ── THE UNIT, DECLARED AT BIRTH (the §711.6 law) ──────────────────────────────
 * `treasury.coin` is ABSOLUTE INTEGER STATE-COIN. Never per-capita, never re-expressed
 * in months or bands at rest; bands are DISPLAY derivations only, and they arrive in a
 * later car. Four sightings in this program's memory say what happens to a numeric
 * field with no declared unit: it acquires a DIFFERENT unit at every consumer and
 * nothing ever reds, because each consumer is internally consistent. So the unit is
 * declared in three places that a reader cannot miss — this header, the
 * `SimEconomicState` typedef, and the fieldManifest row's `displayRule` — and every
 * consumer reads through `coinOf()` / `treasuryCapacity()` rather than touching the
 * raw field. INTEGER, not the granary's tenth-month float, so the conservation
 * property is exact by construction: the §713.3 incident moved 1 leaf in 29 on nothing
 * but float associativity, and 28 of 29 rounded identically, so a smaller corpus would
 * have shipped the drift.
 *
 * ── STAGE-ORDER IS LAW, NOT LUCK (A1.4) ──────────────────────────────────────
 * EVERY COIN-DELTA EMITTER RUNS AT A PULSE STAGE AFTER `settlement_clock`. The writer
 * runs INSIDE `settlement_clock` (pulseKernel's per-settlement loop, beside
 * `advanceFoodStockpile`), so the vault a mover draws on later in the same tick is the
 * vault this pass left behind — and `computeCoinTransfer`'s committed-debit/credit
 * contract is what keeps two draws in one tick honest with each other. The law is
 * asserted in tests/domain/treasury.test.js, not merely written here.
 *
 * ── WHY THE SUMMARY KEY IS `coinFlows` AND NOT `flows` (measured, not preferred) ──
 * The design's record literal names it `flows`. It ships as `coinFlows`, and the reason is
 * a LEAF-NAME COLLISION that was measured rather than guessed. `routeNetworkFlows.js` and
 * `routeNetworkLedger.js` already mint a per-edge usage record `{ a, b, flows, tally,
 * receipts }` whose `flows` carries `goods`, and `sovereigntyReach.js` reads
 * `usage.flows.goods`. The observed-shape instrument keys shapes BY LEAF NAME, so a second
 * unrelated `flows` record makes the corpus's `flows` shape ambiguous — and when this leaf
 * was briefly made corpus-visible, that instrument immediately reported
 * `sovereigntyReach.js: goods on flows — read of a key no writer produces`. An innocent,
 * correct module was accused because of THIS module's field name.
 * That is the estate's own recorded `eventLog` hazard, verbatim: "TWO UNRELATED RECORDS
 * SHARE THE LEAF NAME, AND THAT IS THE WHOLE FINDING." The ruled CONTENT is untouched —
 * the same five integer terms, the same last-tick-only law, no history array ever — and
 * only the key name moves, so the collision cannot be re-created by a later car.
 *
 * PURE + DETERMINISTIC: no rng, no wall clock, no mutation (every function returns a
 * new object or the input unchanged). Lazy leaf — imported only by the pulse kernel's
 * settlement_clock loop and by tests, so it adds zero eager first-paint bytes.
 */

import { governingFactionOf } from '../rulingPower.js';
import { factionArchetype } from '../factionArchetypes.js';
import { rulingPowerFromArchetype, RULING_POWERS } from '../spatial/cohesionWeave.js';
import { nativeSemanticNames } from '../content/customContentSemanticAuthority.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';

/**
 * TREASURY_TUNING — every constant this subsystem owns, in one frozen export.
 *
 * ⚠ TUNING-SIGNATURE-ADJACENT, EVERY VALUE. W-COIN ships PROVISIONAL numbers; the
 * owner signs real values at the endgame tuning pass (the TIME-IS-NOT-THE-CONSTRAINT
 * law — these are declared inputs to that pass, never silently final). A 300-year soak
 * must not show monotone coin explosion, and that trajectory is a tuning-pass input in
 * its own right.
 */
export const TREASURY_TUNING = Object.freeze({
  /** The payer's untouchable vault floor, in absolute coin. A crown may be beggared by
   *  a treaty; it may not be emptied to the last penny by one, because a court at zero
   *  cannot pay a garrison and the shortfall receipt is the honest signal instead. The
   *  coin twin of TREATY_TRANSFER_TUNING.RESERVE_MONTHS (1.5 storage-months).
   *  TUNING-SIGNATURE-ADJACENT. */
  COIN_RESERVE: 25,
  /** The share of a transferred load that reaches the payee; the remainder is destroyed
   *  on the road (spoilage, escort, graft). Strictly < 1 so the channel is a SINK:
   *  absolute coin is reduced by a transfer, never created. Mirrors the sack path's
   *  capture band. TUNING-SIGNATURE-ADJACENT. */
  TRANSFER_CAPTURE: 0.6,
  /** Vault capacity by settlement tier, in absolute coin — what the settlement's civic
   *  infrastructure could ever hold at once. Mirrors the granary's tier table idiom
   *  (foodStockpile.storageCapacityMonths): capacity is DERIVED on every read and
   *  NEVER persisted, so a re-tiered settlement re-derives instead of carrying a stale
   *  ceiling. TUNING-SIGNATURE-ADJACENT. */
  CAPACITY_BASE_BY_TIER: Object.freeze({
    thorp: 120, hamlet: 240, village: 600, town: 2400, city: 9000, metropolis: 24000,
  }),
  /** Capacity for a tier this table does not name (a custom or legacy tier string).
   *  Fail-neutral at the village rung rather than zero: a zero ceiling would make every
   *  mint a phantom mint-and-burn. TUNING-SIGNATURE-ADJACENT. */
  CAPACITY_BASE_DEFAULT: 600,
  /** Fiscal-institution capacity multipliers, applied over the tier base. The sniffing
   *  family is the one economicState's income generator already uses for the same four
   *  institutions, so the vault and the income prose agree about what a banking house
   *  is. Multiplicative and stacked; a settlement with none keeps its tier base.
   *  TUNING-SIGNATURE-ADJACENT. */
  CAPACITY_INSTITUTION_MULTIPLIERS: Object.freeze({
    /** A banking district or a stock exchange — the deepest fiscal infrastructure. */
    majorFinance: 1.6,
    /** A banking house or a money changer — the shallower rung. Never stacked with
     *  majorFinance; the generator's own income table treats them as an either/or. */
    minorFinance: 1.3,
    /** A city hall / civic treasury / strongroom — the vault itself. Stacks. */
    civicVault: 1.15,
  }),
});

/**
 * TREASURY_RECEIPT_KINDS — the closed receipt vocabulary this car can actually EMIT.
 *
 * FINITE-SEMANTICS: typed buckets, no free-text keys, ever. The list holds exactly the
 * kinds 1a emits and not one more. Declaring 1b's `tax_receipt` or W-COIN-2's
 * `upkeep_paid` here would be dead arms — a mark that passes every existence census
 * while nothing can ever draw it — which is the failure mode this program has already
 * measured twice. Each car adds its kinds in the same act as its emitter.
 *
 * @type {ReadonlyArray<string>}
 */
export const TREASURY_RECEIPT_KINDS = Object.freeze([
  /** The ledger began counting. Minted once, at the first lit tick, at coin 0. */
  'treasury_opened',
  /** Revenue is suspended because an occupying authority holds the settlement. */
  'suspended_by_occupation',
  /** Revenue is suspended because the settlement is under siege. */
  'suspended_by_siege',
  /** A demanded amount could not be paid. NEVER a negative balance — this receipt is
   *  what standing in for debt looks like. */
  'treasury_shortfall',
]);

/**
 * TREASURY_SUSPENSIONS — why revenue is suspended, closed and ordered by precedence.
 *
 * A1.14, ruled in car 1 so 1b's mint runs under machinery that already exists. Siege
 * outranks occupation because the generator's own committed sentence is absolute:
 * under siege "all normal economic activity is suspended. Markets are closed"
 * (generators/economy/prosperity.js). Occupation is narrower and directional —
 * "revenue flows outward to the occupying authority" — so it zeroes the OWN vault's
 * yield without pretending the economy stopped.
 *
 * @type {ReadonlyArray<string>}
 */
export const TREASURY_SUSPENSIONS = Object.freeze(['siege', 'occupation']);

/**
 * RULING_POWER_BASES — how a ruling-power reading was arrived at, closed.
 * The resolver NEVER throws and NEVER silently skips; when it falls through to the
 * fail-neutral row the receipt says WHICH fall-through happened, so "everything is
 * mixed" can never hide as a plausible-looking answer.
 * @type {ReadonlyArray<string>}
 */
export const RULING_POWER_BASES = Object.freeze([
  /** A governing faction was found and its archetype is on the ruling-power map. */
  'governing_archetype',
  /** No faction carries the governing seat — fail-neutral to 'mixed'. */
  'no_governing_faction',
  /** A governing faction was found but its archetype is off the map (`outsider` /
   *  `other`, or an unrecognised string) — fail-neutral to 'mixed'. */
  'archetype_off_map',
]);

/** The fail-neutral ruling power, and the one every fall-through resolves to. */
const NEUTRAL_RULING_POWER = 'mixed';

/**
 * THE ONE FLAG DOOR of the treasury layer, and the only `treasuryEnabled === true` in
 * the tree. It is read BY NAME with the strict idiom rather than through a frozen-list
 * `.every()`, because a computed member access attributes to NO key and would be fully
 * wired, genuinely gated, and invisible to the engine-gated-key census that exists to
 * see exactly this. It is read ONCE, at the writer, because two doors on one flag is
 * how a deleted guard hides behind a surviving one.
 *
 * A1.21 / Q10, recorded where a reader will hit it: lighting is the PRESET TABLE's,
 * and the flag is LIT in dramatic_campaign / living_realm / full_simulation ONLY AFTER
 * W-COIN-2's band chip lands. Until then it is dark on every owner-presented surface,
 * so a lit world is never glance-blind about a stock it cannot see.
 *
 * ⚠ THE RECEIVER IS SPELLED `rules`, DELIBERATELY, AND THE SHORT FORM WAS MEASURED RATHER
 * THAN ASSUMED. The observed-shape corpus discovers flags by scanning for a
 * `simulationRules….<x>Enabled` receiver and LIGHTS every flag it finds, so the long form
 * would pull this layer into that corpus. Measured at this base: of eight virtual
 * engine-gated keys, SIX are undiscovered (`undercityHighWater`, `pactFormation`,
 * `espionage`, `habitConditioning`, `errandSpine`, `treatyRenewal`) and two are not —
 * undiscovered is the estate's norm for a virtual key, and matching the norm is what keeps
 * this layer from silently re-shaping a governed, content-addressed instrument.
 *
 * @param {unknown} rules simulation rules (may be absent on a legacy path)
 * @returns {boolean}
 */
export function treasuryActive(rules) {
  return !!rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).treasuryEnabled === true;
}

/** @typedef {{ coin: number, openedTick: number, lastTick: number,
 *   coinFlows: { taxed: number, upkeep: number, transferredIn: number,
 *            transferredOut: number, shortfall: number } }} TreasuryRecord */
/** @typedef {{ tier?: unknown, institutions?: unknown, powerStructure?: unknown,
 *   economicState?: { treasury?: unknown } }} TreasurySettlement */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * The settlement's treasury record, or null when the ledger was never opened.
 * "Opened" means a finite `coin` — the no-backfill witness. A malformed record (a
 * string balance, a null, an array) reads as ABSENT rather than as zero: fail-inert,
 * the `warCosts` idiom, so a corrupt import can never be handed a fabricated vault.
 * @param {TreasurySettlement | null | undefined} settlement
 * @returns {TreasuryRecord | null}
 */
function treasuryRecordOf(settlement) {
  const t = asObject(settlement?.economicState?.treasury);
  return Number.isFinite(Number(t.coin)) ? /** @type {TreasuryRecord} */ (/** @type {unknown} */ (t)) : null;
}

/**
 * Has this settlement's ledger been opened? The null-on-absent guard both legs of the
 * transfer primitive stand on.
 * @param {TreasurySettlement | null | undefined} settlement
 * @returns {boolean}
 */
export function hasOpenTreasury(settlement) {
  return treasuryRecordOf(settlement) !== null;
}

/**
 * THE ONE COIN READ. Absolute integer state-coin held; 0 when the ledger was never
 * opened or the record is malformed. No consumer may hand-read
 * `economicState.treasury.coin` — the unit law is enforced by everyone coming through
 * here, and a per-capita or banded reading is a bug this accessor makes visible.
 * @param {TreasurySettlement | null | undefined} settlement
 * @returns {number} integer ≥ 0
 */
export function coinOf(settlement) {
  const record = treasuryRecordOf(settlement);
  return record ? Math.max(0, Math.floor(Number(record.coin))) : 0;
}

/**
 * THE ONE CAPACITY READ — DERIVED on every call, never persisted (the
 * `storageCapacityMonths` idiom). Tier base × fiscal-institution multipliers, floored
 * to integer coin. A settlement whose tier or institutions change re-derives its
 * ceiling instead of carrying a stale one, which is the whole reason the granary's
 * capacity is derived too.
 *
 * Institution names come through `nativeSemanticNames` — the custom-content semantic
 * authority — so an authored institution is read by what it IS, not by whatever a
 * player typed.
 *
 * ⛔ THE ROSTER IS RUIN-FILTERED, through the canonical `liveInstitutions` accessor.
 * This is a CREDITING read — a banking district raises the ceiling by 60% — and a
 * crediting read over the raw roster gives a flattened building its full function, so a
 * town whose banking district burned down in a calamity would keep a vault ceiling it no
 * longer has any means to hold. The granary's sibling capacity derivation carries the
 * same guard in its own spelling; this one uses the shared accessor.
 *
 * @param {TreasurySettlement | null | undefined} settlement
 * @returns {number} integer ≥ 0
 */
export function treasuryCapacity(settlement) {
  const standing = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement));
  const names = nativeSemanticNames(/** @type {Parameters<typeof nativeSemanticNames>[0]} */ (standing))
    .map((/** @type {string} */ name) => String(name).toLowerCase());
  const has = (/** @type {string[]} */ ...fragments) => names
    .some((/** @type {string} */ n) => fragments.some(f => n.includes(f)));
  const tier = String(settlement?.tier || '');
  const bases = /** @type {Record<string, number>} */ (TREASURY_TUNING.CAPACITY_BASE_BY_TIER);
  const base = Number.isFinite(bases[tier]) ? bases[tier] : TREASURY_TUNING.CAPACITY_BASE_DEFAULT;
  const mult = TREASURY_TUNING.CAPACITY_INSTITUTION_MULTIPLIERS;
  // Either/or on the finance rung — the income generator treats a banking district and
  // a banking house as alternatives, not as a stack, and the vault agrees with it.
  const finance = has('banking district', 'stock exchange') ? mult.majorFinance
    : has('banking house', 'money changer') ? mult.minorFinance
      : 1;
  const vault = has('city hall', 'civic treasury', 'strongroom') ? mult.civicVault : 1;
  return Math.max(0, Math.floor(base * finance * vault));
}

/**
 * THE ONE GOVERNING RESOLUTION LAW (A1.12 part 1, ratified as Q11/A1.23).
 *
 * Every W-COIN read of "who rules here" comes through this function, and it is shared
 * with W-SEAT. It composes the three pieces the estate already has —
 * `governingFactionOf` (which faction holds the seat), `factionArchetype` (the closed
 * 13-value archetype enum) and `rulingPowerFromArchetype` (the closed 6-value
 * RULING_POWERS enum) — and it is the ONLY composition of them a treasury read may use.
 *
 * ⛔ IT NEVER READS `powerStructure.government`. That field is FREE TEXT with four
 * writers and no normalizer, and every existing consumer branches on it by REGEX with
 * the recorded consequence that ordinary labels like `Town Council` match nothing and
 * silently score zero. Adding a ninth regex consumer is precisely the open-vocabulary
 * disease this program exists to refuse; normalizing the field itself is a real but
 * separate cross-cutting migration, docketed rather than smuggled in here.
 *
 * FAIL-NEUTRAL, NEVER THROWING, NEVER SILENTLY SKIPPING: both fall-throughs resolve to
 * `'mixed'` and the returned `basis` says which one happened, so a world that is all
 * `mixed` for a structural reason is distinguishable from one that is all `mixed`
 * because it genuinely is.
 *
 * @param {TreasurySettlement | null | undefined} settlement
 * @returns {{ power: string, basis: string }} `power` ∈ RULING_POWERS, `basis` ∈ RULING_POWER_BASES
 */
export function resolveRulingPower(settlement) {
  const governing = governingFactionOf(/** @type {Parameters<typeof governingFactionOf>[0]} */ (settlement));
  if (!governing) return { power: NEUTRAL_RULING_POWER, basis: 'no_governing_faction' };
  const power = rulingPowerFromArchetype(factionArchetype(governing));
  // `rulingPowerFromArchetype` already fails soft to 'mixed' for `outsider` / `other`
  // and for anything unrecognised, so the off-map case is detected by the RESULT
  // rather than by re-listing the archetype map here — one map, one place.
  const onMap = RULING_POWERS.includes(power) && power !== NEUTRAL_RULING_POWER;
  return { power, basis: onMap ? 'governing_archetype' : 'archetype_off_map' };
}

/**
 * THE ONE TRANSFER PRIMITIVE — every settlement→settlement coin movement in every car
 * goes through here. Inherited clause by clause from the grain executor's TRUE
 * contract (A1.1 restated the body's summary, which had the reserve clause wrong):
 *
 *  1. RESERVE FLOOR, ALL-OR-NOTHING. The payer may only spend what stands above
 *     `COIN_RESERVE`, and it pays the demanded amount IN FULL or it pays nothing at
 *     all — receipted as a shortfall for the whole amount. Nothing is ever scraped off
 *     the floor, and no leg ever half-executes.
 *  2. NULL ON ABSENT, BOTH LEGS. When EITHER party's ledger was never opened the
 *     primitive returns null and nothing happens — no fabricated vault on either side.
 *  3. CAPTURE ≤ 1. The road/graft sink. The remainder is DESTROYED, receipted by the
 *     out/in asymmetry rather than by a second bookkeeping field.
 *  4. INTEGER FLOOR-ROUNDING, SINK-BIASED. Both legs floor, so
 *     `credited ≤ debited × capture` always holds and rounding can only ever
 *     under-credit. Coin is never minted by arithmetic.
 *  5. PAYEE HEADROOM. Credit is clamped to the payee's derived capacity headroom and
 *     the clamped remainder is destroyed too — the payer still loses what it paid, the
 *     way a sacked granary's overflow is lost rather than refunded.
 *  6. SAME-TICK COMPOSITION. `committedDebit` / `committedCredit` carry what THIS
 *     tick's earlier movements already reserved, so a second draw sees the vault the
 *     first one left behind. Without them two terms would price against the same
 *     untouched stock and could jointly drive a payer past its reserve floor.
 *
 * CONSERVATION, exactly: `credited − debited === −destroyed`, in integers, with no
 * epsilon anywhere.
 *
 * NO CALLER SHIPS IN 1a — the first callers are W-COIN-3's movers. This is deliberate
 * and is why the primitive lands fully unit-tested and dormant.
 *
 * @param {{ payer?: TreasurySettlement | null, payee?: TreasurySettlement | null,
 *           amount?: number, captureFraction?: number,
 *           committedDebit?: number, committedCredit?: number }} args
 * @returns {{ debited: number, credited: number, destroyed: number, shortfall: number } | null}
 */
export function computeCoinTransfer({
  payer, payee, amount = 0, captureFraction = TREASURY_TUNING.TRANSFER_CAPTURE,
  committedDebit = 0, committedCredit = 0,
} = {}) {
  const want = Math.floor(Math.max(0, Number(amount) || 0));
  if (want <= 0) return null;
  // Clause 2 — either ledger unopened ⇒ nothing half-executes, and nothing is invented.
  if (!hasOpenTreasury(payer) || !hasOpenTreasury(payee)) return null;
  const owed = Math.max(0, Math.floor(Number(committedDebit) || 0));
  const held = Math.max(0, Math.floor(Number(committedCredit) || 0));
  // Clause 1 + 6 — spendable is what stands above the floor AFTER this tick's earlier draws.
  const spareable = coinOf(payer) - TREASURY_TUNING.COIN_RESERVE - owed;
  if (spareable < want) return { debited: 0, credited: 0, destroyed: 0, shortfall: want };
  // Clauses 3 + 4 — capture is a sink, and flooring keeps it one under both roundings.
  const capture = Math.max(0, Math.min(1, Number(captureFraction)));
  const grossCredit = Math.floor(want * capture);
  // Clause 5 — the payee's headroom, over the vault this tick's earlier credits left.
  const headroom = Math.max(0, treasuryCapacity(payee) - (coinOf(payee) + held));
  const credited = Math.max(0, Math.min(grossCredit, headroom));
  return { debited: want, credited, destroyed: want - credited, shortfall: 0 };
}

/**
 * THE ONE APPLICATOR for cross-settlement coin deltas — the `applyFoodDeltasToUpdates`
 * shape, in integers. Movers that later grow a coin leg emit deltas into here; none of
 * them ever becomes a second writer.
 *
 * Clamped to [0, derived capacity] so a credit can never push a vault past a ceiling
 * the writer also stops mints at (the clamp is a SAFETY NET, never the mechanism), and
 * never below zero because negative coin does not exist. A settlement whose ledger was
 * never opened is SKIPPED rather than opened here: only the writer opens a ledger, and
 * only at a lit tick, so the no-backfill law has exactly one gatekeeper.
 *
 * Returns the INPUT ARRAY BY REFERENCE when nothing moved — the unchanged-tick identity
 * every applicator in this family keeps.
 *
 * @param {Array<{ saveId?: unknown, settlement?: unknown }>} updates
 * @param {Map<string, number>} updateIndex
 * @param {Map<string, number>} coinDeltas
 * @returns {Array<{ saveId?: unknown, settlement?: unknown }>}
 */
export function applyCoinDeltasToUpdates(updates, updateIndex, coinDeltas) {
  const input = Array.isArray(updates) ? updates : [];
  if (!coinDeltas || coinDeltas.size === 0) return updates;
  let next = input;
  let cloned = false;
  for (const [id, delta] of coinDeltas) {
    if (!delta) continue;
    const ui = updateIndex.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = /** @type {TreasurySettlement | undefined} */ (entry?.settlement);
    const record = treasuryRecordOf(settlement);
    if (!record) continue;                              // never opened here — the writer's job alone
    const cap = treasuryCapacity(settlement);
    const current = coinOf(settlement);
    const nextCoin = Math.max(0, Math.min(cap, Math.floor(current + Number(delta))));
    if (nextCoin === current) continue;
    if (!cloned) { next = input.slice(); cloned = true; }
    const economicState = asObject(settlement?.economicState);
    next[ui] = {
      ...entry,
      settlement: {
        .../** @type {Record<string, unknown>} */ (/** @type {unknown} */ (settlement)),
        economicState: { ...economicState, treasury: { ...record, coin: nextCoin } },
      },
    };
  }
  return next;
}

/**
 * Which suspension, if any, grips this settlement — A1.14, ruled in car 1.
 *
 * The blockade record is the one the granary pass ALREADY derived for this settlement
 * this tick (`foodStockpile.blockadeFor`), threaded in rather than re-detected here.
 * That is deliberate and it is the §711.6 discipline applied to a boolean: a second,
 * independently-written occupied-detector would be internally consistent, disagree with
 * the granary about the same siege, and never red. The vault and the granary answer to
 * ONE reading of what is happening to the town.
 *
 * @param {{ type?: unknown } | null | undefined} blockade
 * @returns {string | null} a TREASURY_SUSPENSIONS member, or null
 */
function suspensionFor(blockade) {
  const type = String(blockade?.type || '');
  if (type === 'siege') return 'siege';
  if (type === 'occupation') return 'occupation';
  return null;
}

/**
 * THE ONE PULSE WRITER. Advance the settlement's treasury one tick.
 *
 * DARK (the flag absent or anything but exactly `true`): returns the INPUT SETTLEMENT
 * BY REFERENCE with a null summary, before reading anything else. No key is created, no
 * field is touched, and a dark world's serialized bytes are identical to a world built
 * before this leaf existed. A key is a byte.
 *
 * LIT, first tick: the ledger OPENS at `{ coin: 0, openedTick: tick }` with a
 * `treasury_opened` receipt. Opening EMPTY is the no-backfill law — no fabricated
 * balance, so every coin that ever exists is traceable to a receipted mint. It is
 * deliberately MORE conservative than its own precedent: the granary regenerates to a
 * generated NONZERO stock, and the treasury does not.
 *
 * LIT, thereafter: `lastTick` advances (bookkeeping, by definition every tick) and the
 * suspension verdict is receipted. 1a has NO MINT and NO SINK at the writer — taxation
 * is 1b's only mint kind — so `coinFlows` stays at its zero row and the record's only
 * movement is its bookkeeping. That is what "the stock, without the flows" means, and
 * saying it here stops a later reader from reading the zero row as a bug.
 *
 * The receipts are on the RETURNED SUMMARY and are EPHEMERAL. Nothing about them is
 * persisted: `treasury.coinFlows` is a last-tick integer summary and there is no per-tick
 * history array, ever, in any car (the save-size discipline; the pulse news feed is the
 * history surface and it is already capped).
 *
 * @param {TreasurySettlement | null | undefined} settlement
 * @param {{ interval?: unknown, tick?: unknown, deployment?: unknown,
 *           blockade?: { type?: unknown } | null, rules?: unknown }} [options]
 * @returns {{ settlement: TreasurySettlement | null | undefined,
 *             summary: { tick: number, opened: boolean, coin: number, capacity: number,
 *                        suspension: string | null,
 *                        receipts: Array<{ kind: string, tick: number }> } | null }}
 */
export function advanceTreasury(settlement, options = {}) {
  // THE DOOR. Everything below this line is unreachable in a dark world.
  if (!treasuryActive(options.rules)) return { settlement, summary: null };
  if (!settlement || typeof settlement !== 'object') return { settlement, summary: null };
  const tick = Number.isFinite(Number(options.tick)) ? Math.floor(Number(options.tick)) : 0;
  const existing = treasuryRecordOf(settlement);
  const suspension = suspensionFor(options.blockade);
  /** @type {Array<{ kind: string, tick: number }>} */
  const receipts = [];
  const opened = !existing;
  if (opened) receipts.push({ kind: 'treasury_opened', tick });
  if (suspension === 'siege') receipts.push({ kind: 'suspended_by_siege', tick });
  if (suspension === 'occupation') receipts.push({ kind: 'suspended_by_occupation', tick });
  const record = existing || {
    coin: 0,
    openedTick: tick,
    lastTick: tick,
    coinFlows: { taxed: 0, upkeep: 0, transferredIn: 0, transferredOut: 0, shortfall: 0 },
  };
  const coin = Math.max(0, Math.floor(Number(record.coin)));
  const nextRecord = { ...record, coin, lastTick: tick };
  const economicState = asObject(settlement.economicState);
  const nextSettlement = /** @type {TreasurySettlement} */ ({
    .../** @type {Record<string, unknown>} */ (/** @type {unknown} */ (settlement)),
    economicState: { ...economicState, treasury: nextRecord },
  });
  return {
    settlement: nextSettlement,
    summary: {
      tick, opened, coin, capacity: treasuryCapacity(nextSettlement), suspension, receipts,
    },
  };
}
