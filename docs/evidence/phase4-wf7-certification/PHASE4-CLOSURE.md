# Phase 4 — Faith system: closure summary (W-F7)

The double-axis faith system landed across eight implementer waves and closed at
W-F7's re-certification. This is the phase's ledger: every wave, every owner
refinement, every bound envelope's verdict, and the debts that survive the phase.

Companion: `CERTIFICATION.md` (the per-envelope verdict table + soak numbers) and the
soak logs in this directory. Spec of record: `docs/PHASE4_FAITH_DELTA.md`.

---

## 1. The waves

| Wave | Commit | What landed |
|---|---|---|
| W-F0 | (baseline) | Parity audit + the 4 soak before-numbers (`docs/evidence/phase4-baseline-soaks/`). |
| W-F1 | gate split | `faithSpreadEnabled` migration from `religionDynamicsEnabled`; local/spread lane split; worldpulse-oracle regen (reviewed); 4 owner pins. |
| W-F2 | 779fbfff | `deityStance.js` + STANCE_TUNING (target-conditional tables); temper-derivation shim; law-method term into contest. |
| W-F3 | 872d2978 | `piety.js` + PIETY_TUNING; the amplified-site table; realm-piety multiplier; corruption-plane amplifier; per-axis dampener; clergy-trait plane; neutrality theorem pins. |
| W-F4a | daf970df | Reciprocal patron loop (conduct-fit, subcritical); clergy legitimacy/foothold consumption; conduct-drift erodes legitimacy. |
| W-F4b | 8bbb1688 | Evil-pact cohesion + betrayal hazard (pair-forked, cooldown, realm cap); risk-calculator fidelity noise (chaos misjudges wars); stance global lane. |
| W-F5 | 5f0ad7b7 | Axis retirement (temperament dropped as load-bearing); starting-pantheon `deityPool` seeded LATENTLY into every seed; generator-golden regen (reviewed). |
| W-F5.5 | 9cb43ffb | Devotional momentum (piety hysteresis); the unaffiliated sink (secularization ≤45 + crisis revival); conduct-drift erodes piety. |
| W-F6 | 77b2e300 | Product surface: faith panel + PDF parity, piety arcs, cause-chain chronicle; latent-pantheon privacy (migration 128); tier gate (free = generic, premium = activated). |
| **W-F7** | (this tree) | **Re-certification + cleanup batch (below).** |

## 2. The owner refinements (all landed + certified)

The stance heuristic (evil non-consolidated / good consolidated); the axis-integration
directive (warbound integrated into law×chaos + good×evil, temper derived); the
risk-calculator fidelity term; the corruption-plane amplifier (superadditive at
chaos×evil, ≈0 at lawful×good); development-fidelity + government-form synergy (law
axis only); evil-pact cohesion (LE×LE > LE×CE ≥ CE×CE); the reciprocal patron loop
(subcritical, imposed-god-withers); the clergy lens (per-trait plane projection); the
opposed-runner-up dampener (per-axis decomposition); the chaos font (designed,
soak-gated — **holstered**, §4); chaos-converts-in-the-cracks; the premium gate
(tier never touches generation; latent → activation seam); piety dynamics (momentum +
unaffiliated sink); conduct-drift-erodes-piety. Portfolio resolved to a free-text
flavor field (zero engine mechanics). Every one is neutrality-theorem-inert
(deity-free / zero-piety ⇒ byte-identical).

## 3. W-F7 cleanup batch — outcomes

**(a) DM-full latent strip — LANDED.** `config.latentPantheon` (the unrevealed
starting pantheon) is now stripped even from the DM-share (full) projection, not just
the public one. Client `toPublicSafe({full:true})` strips it
(`src/domain/display/publicSafe.js`); server migration **129** recreates
`_gallery_dm_full_json` net-current from 121 + `- 'latentPantheon'`. Head 129,
contiguous. Guards: `tests/security/galleryDmFull.pglite.test.js` (execution + static
drift), `tests/domain/display/publicSafe.test.js` (client twin). Rationale: unrevealed
content never leaves the account, not even on a DM-full share (architect ruling in the
W-F6 commit).

**(b) Deity-holding pulse golden — LANDED.** The orphan
`tests/fixtures/worldpulse-golden-master.json` got its FIRST real consumer:
`tests/property/worldpulseDeityGolden.test.js` drives a deity-ACTIVATED campaign
(patrons across the law×align plane, a rival cult, spread ON) through N real pulse
ticks and pins the ORACLE-NORMALIZED mechanical faith projection (pantheon ledger +
per-settlement patron seat/legitimacy + candidate histogram + roll summary). Fixture
captured fresh (not a regen). The deity-free dormancy oracle now has a deity-HOLDING
counterpart.

**(c) Two land-if-green-able items — SPLIT:**
- **Realm-salience site #10 (realmMult on pantheon arcs) — LANDED.** The one amplified
  site that was unwired: `synthesizePantheonArcs` (`realmEvents.js`) now scales the
  arc salience score by `realmMult`, threaded from the tick-start realm-piety
  multiplier (`pulseKernel.js`). Significance stays `'major'`, so the E4
  feed-distribution caps apply unchanged (reorder, never flood). Byte-identical when
  spread off (realmMult = 1). Pinned in `tests/domain/pantheon.test.js`. This
  completes the §2.3 amplified-site table (10/10).
- **Stance graph-channel type — DEFERRED as post-phase debt (§5).**

## 4. The chaos font — HOLSTERED (architect to ratify)

W-F7's plane soak (`CERTIFICATION.md` §5) is the first law-axis distribution
measurement (W-F0 pinned every deity law-neutral). It shows **no lawful runaway pole
in the faith system**: stable realms hold the incumbent regardless of law pole (no
calcification); corrupt realms turn over on the good/evil axis with **no** lawful
displacement advantage (seizure gap +0%); the one directional pressure that exists
(chaos-in-the-cracks) points AWAY from a lawful monoculture. There is no measured
lawful drift to correct, so arming the font is **not warranted on this evidence**.
Recommendation: leave it designed-but-holstered — the architect's call, on this
evidence; W-F7 tuned no constant.

## 5. Remaining debts

1. **Stance graph-channel type (W-F7 item c, part 2) — POST-PHASE DEBT.** Minting a
   REGIONAL_CHANNEL_TYPES member (`divine_alliance`/`divine_betrayal`) from
   `deityStanceLane` outcomes is a clean seam (the lane already exposes `betrayed`/
   `pacts`; `graphChannels` is already plumbed to the graph). It was NOT landed because
   a new enum member trips the owner-guarded creatable invariant
   (`tests/domain/regionalChannelCreatable.test.js`): every enum member must ship with
   a discovery/bundle CREATOR, and a simulation-mint-only type has none — making it
   green requires either parking it in `UNCREATABLE` (contradicts the owner note) or
   redefining "creator" to include simulation mints, plus it adds public map-legend
   vocabulary. Both are owner/architect decisions, out of an implementer's remit.
   **Behavior is not missing** — betrayals already surface as `betrayal` stressors and
   pacts as `faith_pact` news; only the optional graph-channel visualization is
   deferred.
2. **Phase-6 development-fidelity envelopes.** The "lawful economies peak higher /
   break harder, chaotic fatter survival tails" half of the variance-with-payoff law
   is the economy/planner layer — not run by the religion soaks (spec binds it to
   Phase-6). The war-fidelity half IS pinned (`fidelityNoise.test.js`).
3. **Chaos-in-the-cracks seat-level differential** is unit-pinned
   (`crisisConversion.test.js`) but second-order to the good/evil growth driver, so it
   does not surface as a law-differentiated seat distribution at soak scale. A
   receptivity-only emergent-distribution harness is a Phase-6 refinement.
4. **`simulate-religion.mjs` `seatsMoved`** is a dead field (declared, never
   incremented) — cosmetic, flagged for a cleanup pass.
5. **`religionDynamicsEnabled` tolerant reader** — scheduled for deletion in the
   Phase-6 lifecycle pass (architect ratification #2).

## 6. Envelope roll-up

All nine bound envelopes **PASS** (two with a Phase-6-deferred half, documented in
`CERTIFICATION.md` §7.2–7.3). Generator golden byte-identical; dormancy byte-identical;
194 faith unit/property pins green; the four baseline soaks in-envelope (balance
byte-identical, soak/coup shifted in the DESIGNED direction); the new plane soak shows
no lawful runaway.

## 7. Gate (`npm run check`) — one PRE-EXISTING failure, proven not W-F7's

Full gate log: `npm-check.log` in this directory. typecheck 0, strict 0, lint 0 errors,
7,170+ tests with the W-F7 additions. **All new/changed W-F7 tests pass.** The
`architectureFreshness` migration-count assertion was updated (ARCHITECTURE.md 128 → 129,
the forced companion to migration 129).

**One failure remains and it is NOT W-F7's:** `tests/build/vendorPdfLazy.test.js` —
first-paint static closure = **1,410,293 bytes vs the 1,410,000 budget (+293)**. Proven
independent of this wave: rebuilding with EVERY W-F7 `src/` change stashed produces the
**identical** 1,410,293 bytes (the diff is byte-for-byte zero in the first-paint
closure — `publicSafe` and the `worldPulse` site-#10 code both fall OUTSIDE the
first-paint entry). The mid-session branch advance to 88127ffb was docs-only, so the
overage was already present at the W-F6 gate-green commit (77b2e300) — the signature of
a shared-checkout node_modules/lockfile drift, not a code regression. Per the mandate
("do NOT tune to pass; report precisely"), the budget ratchet is left UNTOUCHED —
nudging it (or `npm ci` to re-pin deps) is an owner/architect maintenance decision on
this evidence. **W-F7 introduced no ratchet regression.**

## 8. HEAD note

The shared branch advanced mid-session from **77b2e300** (W-F6) to **88127ffb** (a
docs-only Phase-4 spec commit); the W-F7 working-tree changes are unstaged on top of
88127ffb. No commits were made this wave.
