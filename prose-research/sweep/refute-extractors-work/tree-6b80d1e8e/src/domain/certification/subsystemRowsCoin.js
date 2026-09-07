/**
 * domain/certification/subsystemRowsCoin.js — THE W-COIN FAMILY'S CERTIFICATION
 * ROWS (docs/DESIGN_W_COIN.md as amended by A1).
 *
 * A FAMILY leaf on the `subsystemRowsSeat.js` pattern, and unlike this lane's two
 * BLOCK cuts it is a family in the full sense: W-COIN-1a's `treasuryEnabled` — the
 * estate's first conserved coin stock — is the first car of a program that has
 * more, and every one of them will want a row. W-SEAT's leaf exists because the
 * seat program charters three virtual keys; the same argument is true here and was
 * simply not available when treasury landed, since `subsystemRowsVirtual.js` had
 * twelve lines of headroom at that mint and the habitat cure did not yet exist.
 *
 * ⛔ THIS LEAF SITS AT INDEX 25 OF `VIRTUAL_SUBSYSTEM_ROWS`, ONE ROW LONG, and a
 * second W-COIN row appended here therefore lands at index 26 and shifts the three
 * rows after it (W-SEAT, W-MEM, and whatever the doors bring). That is a real
 * certification-output move and it is the family leaf's honest cost: a family that
 * grows in the BODY pays reordering, a family that grows at the TAIL does not.
 * Whichever way the W-COIN car goes, it is a decision to take out loud and receipt
 * — the §864 ordinal-seat-theft finding is exactly this shape, caught late.
 *
 * ⛔ IT DELIBERATELY DOES NOT JOIN `subsystemCertification.js`'s import list. The
 * row spreads back into `VIRTUAL_SUBSYSTEM_ROWS`, which stays the ONE export every
 * consumer, walker and bijection already reads.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/lint/engineGatedRuleKeys.walker.test.js,
 *   tests/domain/subsystemRowsVirtual.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The W-COIN family's authored rows (the sibling row leaves' idiom verbatim).
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const COIN_SUBSYSTEM_ROWS = Object.freeze([
  // ── THE STATE TREASURY (W-COIN-1a, docs/DESIGN_W_COIN.md as amended by A1) ──
  Object.freeze({
    rule: 'treasuryEnabled',
    title: 'The state treasury (the conserved coin stock)',
    module: 'src/domain/worldPulse/treasury.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: 1a mints no `candidateType` literal. The stock is a per-tick
      // record, not a decision, and the DM verbs that would carry a candidate type are
      // not chartered in any W-COIN car.
      eventTypes: Object.freeze([]),
      // ⭐ AMENDED BY W-COIN-2/3 (2026-08-30, A1.19). W-COIN-1 minted zero news kinds and
      // this list was empty as a COMMITMENT. The commitment is now paid — the layer mints
      // TWO kinds, `treasury_shortfall` and `treasury_band`, both filed under the Herald's
      // `trade` section — AND THE LIST STAYS EMPTY, for a reason that was MEASURED rather
      // than inherited.
      //
      // EXECUTED at this tip: `moverFamilyOf` (scripts/audit/behavioral-observation.mjs)
      // classifies BOTH coin beats as **`knowledge`**, not `economy`. The cause is not
      // subtle and this file is not the first to meet it — the classifier joins
      // impactKind, kind and id, every wizard-news id begins `wizard_news.`, and `news` is
      // a KNOWLEDGE token. The audit module's own comment names that path: "the bare
      // `news` token in a wizard-news id — the contamination path IN-6's ratchet exists to
      // shrink". `treasury` appears in no family's token list at all.
      //
      // So declaring `['economy']` here would be a claim the live classifier CONTRADICTS,
      // and declaring `['knowledge']` would grade this row alive off the information lane's
      // traffic — the exact hazard `knowledgeLaneEvidence.js` was written about. Empty is
      // the only honest value, and the contract makes a mover family corroborating-only, so
      // nothing is lost: this row can never reach ALIVE on a family claim anyway. Re-run
      // the classifier before ever filling this in.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, and this one needs saying because it is the row's honest
      // weakness: the treasury's state is a per-SETTLEMENT record
      // (`economicState.treasury`), and the v5 census reads worldState containers. There
      // is no `spatialLedgers.*` this subsystem owns and there never will be — a realm
      // stock would mint the polity entity the hegemony ruling forbids, and the realm
      // view is a pure read-time aggregation over the sphere with zero persisted state.
      // The undercityHighWater row above stands on the same ground for the same reason.
      stateKeys: Object.freeze([]),
      other: 'THE ESTATE\'S FIRST CONSERVED COIN STOCK, and the reversal of a standing ruling: f3cf639e forbade a conserved-coin primitive and the owner reversed it by order (ODQ 731.1, Q-W8 GRANTED). ONE GATE: treasury.treasuryActive reads treasuryEnabled by name with the strict === true idiom, and it sits at the PULSE WRITER door because that is the door nothing can write past - only advanceTreasury may open or move a ledger, and only applyCoinDeltasToUpdates may fold a cross-settlement delta onto one already open, so a second gate at the applicator would be a guard hiding behind a guard. WHAT CAR 1a CONTAINS: the record (coin, openedTick, lastTick, coinFlows), the accessors coinOf and treasuryCapacity, capacity DERIVED on every read and never persisted, the ONE transfer primitive computeCoinTransfer, the ONE applicator, and the ONE governing resolution law resolveRulingPower - governingFactionOf composed with factionArchetype and rulingPowerFromArchetype over the frozen six-value RULING_POWERS, shared with W-SEAT, never the free-text powerStructure.government string. WHAT CAR 1b ADDS: TAXATION, the writer ONE mint kind. Eight closed TAX_FORMS grounded in the incomeSources families the generator already narrates, five ordered TAX_RATE_BANDS, and a frozen six-by-eight profile keyed on RULING_POWERS - so a merchant league taxes trade and spares land while a theocracy takes its tithe, and a coup RETYPES taxation on the next tick because the A1.12 stamp moved the seat archetype. Rates are BANDS and never free floats. Criminal incomeSources rows are NEVER a tax base, which is the generator own committed sentence turned into an assertion. THE MINT READS THE STOCK ONLY AT THE CAPACITY STOP AND IT DAMPS: every other input is generation-frozen structure or the prosperity OPINION, so no tax-transfer-tax feedback can close. THE LEGITIMACY PRICE is the stock ONLY write to any opinion anywhere, it follows the BAND rather than the coin so a capacity-stopped tick still pays it, and it rides the writer summary to a LATER pulse stage because settlementUpdates does not exist at settlement_clock - landing through the ONE existing applyLegitimacyDeltasToUpdates, never a second applicator (ODQ 768.2 amendment).  THE UNIT IS DECLARED AT BIRTH: absolute integer state-coin, never per-capita, never months, never a band at rest, stated in the typedef and in the fieldManifest displayRule and read only through the accessors. WHAT IT NEVER DOES: no negative coin ever (an unpayable cost becomes a typed shortfall, because debt is owner-gated), no coin from RNG, no coin written outside the writer and applicator pair, no exchange rate between coin and grain in either direction, no per-tick history array, no DM edit surface, no display surface. WHAT IS DELIBERATELY DORMANT AT THIS CAR: the transfer primitive ships with NO caller - the first callers are W-COIN-3 movers - so it lands fully unit-tested and unreached, and that is the design rather than an omission. OCCUPIED AND BESIEGED ARE RULED HERE (A1.14): siege suspends every form and occupation zeroes the own vault with a typed suspended_by_occupation receipt, both read off the SAME blockade record the granary pass already derived, so the vault and the granary can never disagree about the same siege. THE INTERIM LAW, and it governs when this key may be lit at all (A1.21 as answered by Q10, ODQ 763.2): THE FLAG IS NOT LIT ON ANY OWNER-PRESENTED SURFACE BEFORE W-COIN-2 TIP. Lighting belongs to the preset table and the key ships lit in dramatic_campaign, living_realm and full_simulation only after W-COIN-2 band chip lands, so a lit world is never glance-blind about a stock it cannot see. THIS ROW IS AMENDED BY CAR 2 (A1.19): the warCosts coffers read door and the coalitionExpenditure read door join the door list when they land. Until then the lane is pinned where its bodies are readable: tests/domain/treasury.test.js and tests/domain/treasuryDormancy.byteIdentity.test.js.  AMENDED BY W-COIN-2 AND W-COIN-3 (A1.19, the amendment this row was authored expecting). THE DOOR LIST IS NOW THREE, each with its own necessity rationale (A1.6): the WRITER door treasuryActive at advanceTreasury governs whether a ledger may exist, and the two READ doors - warCosts.readWarHomeFront and warCoalitionExpenditure.readCoalitionExpenditure - govern whether a ledger that exists may SPEAK into a war pressure read. The reads are not redundant with the writer, and the cell that proves it is a campaign that was lit, accumulated ledgers, and was then darkened: the writer stops moving those records, and without the read doors their coin would keep pricing war pressure in a world whose owner switched the layer off. W-COIN-2 ADDS: the UPKEEP SINK (an outbound deployment costs the crown coin every tick, charged from the same one-army ledger the granary pass reads, spending to zero because the reserve floor is a TRANSFER clause and upkeep is the garrison the reserve exists to protect), the two receipt kinds a cost that can fail to be met needs (upkeep_paid, and treasury_shortfall RETURNING with a live emitter after the reachability arm struck it as a dead arm in 1a), the closed COIN_FLOW_TERMS ledger with the conservation identity as a function this layer owns, the TWO coin news beats under the address law, and the at-a-glance band CHIP that A1.21 requires before the flag may be lit anywhere. W-COIN-3 ADDS the coffers component to both war reads through ONE shared reading, coffersRead, so two surfaces cannot score how long a crown can pay its army from two independently written expressions. THE COMPONENT IS ABSENT UNLESS OBSERVED rather than present at zero, because readWarHomeFront averages sum over length and a sixth component at zero would dilute the other five on every world the treasury has nothing to say about; coalition expenditure keeps its FROZEN five-weight set untouched and uses a sibling six-weight set only on an observed tick. ⛔ THE UPKEEP BASIS IS NOT THE CHARTER FIELD, and the divergence was measured: the design named deployedPopulation, which is written only behind warEconomyDrainEnabled and warLevyEnabled - lit in full_simulation and nowhere else - so on dramatic_campaign, the other preset that lights war, an upkeep keyed on it would have been identically zero on every world anyone plays. The sink reads currentEffectiveStrength instead, in declared CAPACITY POINTS on the 0 to 100 scale, and a standing arm re-proves that divergence on every run.',
    }),
    // The writer runs on every settlement on every lit tick — it opens the ledger, moves
    // lastTick and receipts the suspension verdict — so the cadence is the pulse's own.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_writes_no_treasury_key',
        description: 'THE PROMISE: with the flag dark the writer returns its INPUT SETTLEMENT BY REFERENCE before reading anything else, so no `treasury` key is ever created and a dark world serializes byte-for-byte as it did before this leaf existed. Absent, never null and never an empty record: a key is a byte.',
        check: 'NOT expressible from a receipt — the record is per-settlement and no receipt section reads settlement economicState. Pinned behaviourally in tests/domain/treasuryDormancy.byteIdentity.test.js against the HONEST comparator: the same seeded world advanced the same number of ticks at the pre-W-COIN base and at this tip, flag absent, serialized bytes compared RAW. The arm deliberately does NOT import normalizeForDormancy (A1.19) — normalising would launder the very bytes the bar exists to compare — and it carries a lit anti-vacuity drive so a green cannot mean the instrument compared nothing.',
      }),
      Object.freeze({
        name: 'no_coin_without_a_receipted_mint',
        description: 'THE NO-BACKFILL LAW: the ledger opens EMPTY, at coin 0, with a treasury_opened receipt naming the tick. No generator, no worldPlan, no fingerprint and no import may ever hand a settlement a balance, so every coin that exists is traceable to a mint this campaign receipted. It is deliberately MORE conservative than its own precedent — the granary regenerates to a generated NONZERO stock and the treasury does not — and the regen coin-wipe is an accepted, documented loss (A1.7).',
        check: 'NOT expressible from a receipt. Pinned in tests/domain/treasury.test.js (the writer opens at zero and stamps openedTick; a second lit tick does not re-open) and in tests/lib/importScrub.test.js (the import strip, all three import paths, A1.8).',
      }),
      Object.freeze({
        name: 'coin_is_conserved_exactly_in_integers',
        description: 'Per tick, the change in total coin across all settlements equals mints minus sinks EXACTLY — an integer equality with no epsilon, asserted with .toBe. In car 1a there is no mint, so the identity reduces to a pure sink law: the applicator plus the transfer primitive can only ever destroy coin (capture remainder on the road, and the payee capacity clamp), never create it. Coin is INTEGER rather than the granary tenth-month float precisely so this is exact by construction: the float-associativity incident this program measured moved one leaf in twenty-nine, and twenty-eight rounded identically, so a smaller corpus would have shipped the drift.',
        check: 'NOT expressible from a receipt. Pinned as a property test in tests/domain/treasury.test.js over a fixture with concurrent flows — two payers into one payee in the same tick through the committed-debit path, a capacity-edge payee, a reserve-edge payer that shortfalls, and an absent-record party that returns null on both legs.',
      }),
      Object.freeze({
        name: 'every_coin_delta_emitter_runs_after_settlement_clock',
        description: 'STAGE ORDER IS LAW, NOT LUCK (A1.4). The writer runs inside @pulse-stage: settlement_clock, so any later emitter draws on the vault this pass left behind, and the primitive committed-debit/credit contract keeps two draws in one tick honest with each other. In car 1a there are ZERO emitters, so the source arm that would catch a violation is armed rather than discovering: it is a REGRESSION guard for W-COIN-3, and saying so is the point.',
        check: 'Expressible from source, and asserted that way in tests/domain/treasury.test.js: the ONE call site of advanceTreasury sits after the settlement_clock stage marker and before the next stage marker in pulseKernel.js, and the set of modules importing applyCoinDeltasToUpdates is empty at this car and every future member must name a stage after settlement_clock.',
      }),
    ]),
    // No channel at all, so the row can never be graded ALIVE from a receipt and says so.
    // It is UNOBSERVED for the lane-wide reason stated in this file's header — the soak
    // builds its rules from the full_simulation spread, which declares no virtual key —
    // and for a second reason of its own: A1.21 forbids lighting this flag on an
    // owner-presented surface before W-COIN-2's tip, so the observation window is a
    // HARNESS inside that car's act (A1.22), not this one's.
    soakEvidence: 'unobserved',
  }),
]);
