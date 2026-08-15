# W-F5 STAGE 2 — THE LATENT STARTING PANTHEON — EVIDENCE

Status: **STAGE 2 EVIDENCE READY.** The 187-config generator golden fails AS
EXPECTED (all 187 keys drift — the deliberate latent-pantheon class). No
commits; the architect performs UPDATE_GOLDEN
(`UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js`).

Built against the PREMIUM GATE addendum (docs/PHASE4_FAITH_DELTA.md §"THE
PREMIUM GATE", commit 64a1855e): **tier never touches generation** — the
pantheon bakes LATENTLY for every seed, identical for all account tiers, one
golden per seed; activation is a separate rng-free seam; the free tier is the
certified ground state by the neutrality theorem.

Reproduce:
```
node docs/evidence/phase4-wf5-oracle/stage2-corpus-outputs.mjs <HEAD-worktree> before.json
node docs/evidence/phase4-wf5-oracle/stage2-corpus-outputs.mjs <working-tree>  after.json
node docs/evidence/phase4-wf5-oracle/stage2-fieldpath-diff.mjs before.json after.json report.json
```
Machine verdicts pinned in `stage2-diff-report.json`.

## 1. What landed

| Piece | File | Notes |
|---|---|---|
| Governed deity pool | `src/generators/data/deityPool.js` | 24 deities spanning all 9 alignment×law cells + all 3 ranks; portfolio flavor text; terrain/culture/government affinity tags; refs `deity:core:<slug>`. HOMED under generators (not src/data) so its bytes ride the LAZY engine chunk — the first-paint budget discipline (§6). |
| Latent generation step | `src/generators/steps/seedStartingPantheon.js` | Per-step PRNG fork, codepoint-ordered weighted draws; patron (major/minor) + 0..min(cap−1, 2) cults (minor/cult), distinct derived niches; writes ONLY `config.latentPantheon` + `config.faith` — never a live embed key. `faith:'none'` opt-out writes/draws nothing; explicit live deity respected. |
| Activation seam | `src/domain/worldPulse/latentPantheon.js` | Pure, rng-free, tier-blind, store-blind: `latentPantheonOf` / `hasActivePantheon` / `activateLatentPantheon` (copies latent → live embeds in the setPrimaryDeity/imposeCult shape; idempotent same-reference no-op; latent record preserved). Store wiring + tier checks = W-F6. |
| Portfolio field | `src/domain/customContentSchema.js` | `validateDeity` admits an OPTIONAL free-text `portfolio` (absent tolerated; present must be a string ≤ `DEITY_PORTFOLIO_MAX_LENGTH` 500). ZERO mechanics — no engine read anywhere. Authoring-surface input = W-F6. |
| corruptionPass receipts | `src/generators/steps/corruptionPass.js` | One trace per corrupted NPC (flaw + climate odds causes; institution/guild downstream). Emitted only on onset ⇒ clean rosters stay traceless. Deterministic (`_traceClock`). |
| Pipeline wiring | `steps/index.js`, `assembleSettlement.js` (dep), `stepMetadata.js` | Rail summary reports COUNTS ONLY — latency discipline (never names a latent god). ARCHITECTURE.md step order updated 19→20 (freshness pin). |
| Direct-reader re-plumbs | `magicProfile.js` ×3, `relationshipRulesAdversarial.js`, `display/deityEffects.js` | All temper reads now via `deityTemper` derivation — nothing can disagree with the niche. `religionLegitimacy.deityRulerFit` untouched per §3.3. Edge bundle rebuilt (`aiGroundingBundle` — magicProfile is an input; freshness pins green). |

## 2. The 187-config field-path diff — EXACTLY two classes

`stage2-diff-report.json` verdicts (all TRUE):

| Verdict | Meaning |
|---|---|
| everyConfigShifted (187/187) | the latent bake is the ratified DEFAULT — every legacy config gains it |
| everyConfigHasLatentClass (187/187) | every config's diff includes `config.faith` + `config.latentPantheon` |
| unexplainedPathCount = 0 | **no path outside the two classes changed, anywhere in the corpus** |
| tracesInsertOnlyCorruptionReceipts | trace diffs (34 configs) = corruptionPass receipts INSERTED at the step's position; removing them reproduces BEFORE exactly modulo the deterministic `_traceClock` renumber (ts === index, verified both sides) |
| proseByteStable | pressureSentence / arrivalScene / history / hooks / dailyLife / coherence / settlementReason / name byte-identical for all 187 |
| zeroLatencyLeaks | **no pool deity name appears anywhere outside `config.latentPantheon`** in any of the 187 outputs (prose/hooks/npcs/history clean) |
| boundednessClean | see §3 |

Path-class tally: `latent-pantheon` 374 (= 2 paths × 187: `config.faith`,
`config.latentPantheon`), `corruption-trace` 34, UNEXPLAINED 0.

## 3. Boundedness (all 187 latent pantheons)

- Exactly 1 patron; patron rank ∈ {major, minor}; cult ranks ∈ {minor, cult}.
- 1 + cults ≤ `capacityForTier(tier)`; design cap ≤ 2 cults.
- All niches DISTINCT (derived temper × alignment — no day-one patron contest).
- Every ref `deity:core:<slug>` resolving to a real pool entry.

## 4. Zero embeds + engine inertness (the neutrality theorem)

Pinned by `tests/generators/seedStartingPantheon.test.js` +
`tests/domain/latentPantheon.test.js` (13 tests):

- Latent data present for EVERY default-path generation; `primaryDeitySnapshot`
  / `primaryDeityRef` / `cultDeitySnapshots` all ABSENT from output config.
- `isSubsystemActive(…, 'religion')` FALSE on generated settlements (gate
  closed on latent data) and TRUE after `activateLatentPantheon` — on the same
  data. The free tier is the ground state; activation is the key.
- Activation: deterministic (deep-equal outputs), byte-equal embeds to the
  latent record (portfolio rides along), IDEMPOTENT (same-reference no-op),
  conservative (no latent / already-active / DM-assigned ⇒ untouched),
  latency-preserving (latent record kept).
- `faith:'none'`: no latent record; stripping the faith/latent class fields
  yields BYTE-IDENTICAL output to the default run on the same seed (the step
  provably touches nothing else).
- End-to-end: a real pipeline settlement activates its own baked record
  verbatim.

## 5. The expected golden failure

`tests/property/generatorGoldenMaster.test.js` → "every config produces
byte-identical output" fails with **drift = all 187 keys**; the corpus-coverage
test passes (no keys added/removed). This is the wave's ONE deliberate
generator-golden event. §2 proves the drift is exactly the latent-pantheon +
corruption-trace classes. Architect: review + `UPDATE_GOLDEN=1`.

Note: the worldpulse/dormancy oracles are untouched — latent data never opens
the religion gate, so no pulse fixture shifts (deity-free dormancy stays
verbatim-green in the suite).

## 6. Gate state at the STAGE 2 stop

| Gate | Result |
|---|---|
| Full vitest (615 files / 7113 tests) | **614 green; 1 expected failure** (the golden, §5) |
| Formerly-pending stage-1 fixtures (religionCorruption OQ22/R3, crisisConversion) | **green** (re-fixtured per intent: warlike ⇒ evil-aligned, peacelike ⇒ good-aligned; Faded ⇒ good ⇒ distinct niche) |
| Same-class display/magic fixtures (deityEffects ×3, z2MagicDeity ×2) | **green** (same intent-preserving re-fixture) |
| typecheck / domain-strict | **0 / 0 (ceiling 0)** |
| lint | **0 errors** (15 pre-existing warnings) |
| any-cast ratchet | **2252 = ceiling 2252** (zero added) |
| layer boundaries (cycle allowlist) | **green** (deityAxes is a leaf — no new cycles) |
| first-paint closure budget | **1,409,503 ≤ 1,410,000** (headroom 497; the pool was moved to the lazy engine chunk — eager `data` chunk hash byte-identical to pre-change) |
| validators (data / migration-head 127 contiguous / edge / map) | **pass** — still no migration 128 needed (latent data is config JSON; no schema change) |
| build | **exit 0** |
| edge-bundle freshness (aiGroundingBundle rebuilt after magicProfile re-plumb) | **green** (tests/edgeFunctions 406 pass) |

## 7. W-F6 handoffs

1. **Store wiring of the activation seam**: call `activateLatentPantheon` at
   generation-complete / save-open for premium accounts; tier checks live in
   the store, never in the domain helper.
2. **Dossier gating + generic-faith copy** (free tier hides faith surfaces;
   lapsed = read-only) — per the addendum.
3. **Portfolio authoring input** in the compendium deity form (schema + cap
   constant already exported: `DEITY_PORTFOLIO_MAX_LENGTH`).
4. **Gallery/publish allowlist**: decide whether `config.latentPantheon` passes
   the fail-closed allowlist (latent names in shared payloads = premium
   advertisement per the addendum's gallery rule, but it is an explicit
   allowlist decision + drift-pin update).
5. **Events-lane portfolio**: setPrimaryDeity/imposeCult embeds do not carry
   `portfolio` yet — additive adoption when the store lane next changes.
6. **Trace vocabulary**: `ALLOWED_TARGET_TYPES`/`RECEIPT_KINDS` (closed set,
   outside this fence) has no 'deity' kind — the pantheon step emits no traces;
   extend the vocabulary if pantheon receipts are wanted.
7. **Wizard faith control** (`config.faith` 'pantheon'|'none') — the config
   surface exists and is tolerant; the UI control is product surface.
