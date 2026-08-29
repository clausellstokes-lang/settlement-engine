# LANE R4 — FIGURE-PIN AUDIT (build tip `1a2471990`)

**Validator semantics (CONFIRMED):** `scripts/implementation-packets.mjs` checks each LANDED packet's `requiredSymbols` by raw substring — `if (!source.includes(row.symbol))` at lines 745/784/789 — against `docs/implementation/PACKET_MANIFEST.json` (182 packets, **2,374 requiredSymbols rows total, 3 carrying `retiredBy`**: EST-B `fogEdit`, MF-MP1 ×2, all `§725/§731`). So a pin reds the day its exact byte-string leaves the file. §731.3(ii) law text (ODQ:31492): *"requiredSymbols pin symbols/anchors, never lines or figures … a shrink-only ratchet must be able to shrink."* STRIP-3's record is ODQ §747.4(3): five latent figure-pins — GR-4D×2, EFF-M1A, GVF-1, WEB-8 — "recorded for the retirement-path sweep, not swept blind."

## A. The five recorded pins — disposition (all CONFIRMED matching live today; none ALREADY-DIVERGED)

| # | Packet · row | Pinned symbol (verbatim) | Live constant | Governing law → red trigger | Class |
|---|---|---|---|---|---|
| 1 | GR-4D rs[5] | `export const ACTOR_MAJOR_HOLD_WEEKS = 6` | `src/domain/worldPulse/actorMajorApproval.js:44` = `6` | Tuning constant (owner-signed tuning is the endgame's LAST pass, with the 300y-runaway + map-leg inputs pending). Reds either direction the day tuning moves it. | **LATENT** (tuning-pass) |
| 2 | GR-4D rs[12] | `const RECORD_MODE_PROPOSAL_VERSION = 4;` | `src/domain/worldPulse/pulseHelpers.js:19` = `4` | Version constant consumed as `version < RECORD_MODE_PROPOSAL_VERSION` (line 74) — grows by design on the next proposal-record schema bump. | **LATENT** (grow-only) |
| 3 | EFF-M1A §2 row | `testTimeout: 20000` | `vite.config.js:801` (sole occurrence) | No ratchet governs the value; EFF-M1A §2 recorded it as *state at base*, not a guarantee. Reds on any retiming of the estate test block. Weakest of the five, still a figure. | **LATENT** (any-change) |
| 4 | GVF-1 rs[5] | `const TEMPLATE_BUDGET = 1;` | `tests/lint/rawColorLiteral.test.js:66` = `1`, comment "EXACT"; sibling `BUDGET` (line 61) says *"Lower on a shrink; never raise"* — an EXACT monotone-down occurrence ratchet | The purest §731.3(ii) shape: banking the one grandfathered template hex forces `1 → 0` and the pin reds. Note GVF-1 rs[4] `const BUDGET` was ALREADY corrected to symbol-only at STRIP-3; this sibling row in the same packet was not. | **LATENT** (shrink-only ratchet) |
| 5 | WEB-8 rs[5] | `export const ANNUAL_FACTOR = 0;` | `src/config/pricing.js:357` = `0` | ⭐ Sharpest: WEB-8.md:224-226 promises *"Every pin written for them asserts the SHAPE and the DERIVATION, never the dial's value, and is therefore green at 0 and at 10"* — the manifest row breaks the packet's own promise. WEB-10's planned flip (`0 → 10`, "needs no second edit here") reds WEB-8 the day it lands. Owner-gated paid surface. | **LATENT** (grow-only, planned flip) |

GR-4D prose baselines (797/941, census `2412/365/2047/19984/5638`) are packet-body text only — rs[24] pins `const CENSUS = Object.freeze` symbol-only, so they do not red the validator (CONFIRMED against the manifest).

## B. Exact correction each row needs (single sweep car; all are §731.3(ii) symbol-not-figure truncations — **none needs `retiredBy`**, every symbol is alive)

Each replacement verified unique-single-hit in its live file at `1a2471990`:

1. GR-4D rs[5] `symbol` → `"export const ACTOR_MAJOR_HOLD_WEEKS"`
2. GR-4D rs[12] `symbol` → `"const RECORD_MODE_PROPOSAL_VERSION"`
3. EFF-M1A rs[3] `symbol` → `"testTimeout:"` (1 occurrence in vite.config.js)
4. GVF-1 rs[5] `symbol` → `"const TEMPLATE_BUDGET"` (mirrors the landed `const BUDGET` correction; not a substring of anything else)
5. WEB-8 rs[5] `symbol` → `"export const ANNUAL_FACTOR"` (delivers the packet's own "green at 0 and at 10" promise)

## C. Unrecorded-sibling sweep

**Denominators:** mechanical ≥2-digit-number-in-symbol sweep: **54 / 2,374 rows** hit; value-position numeric-literal sweep (catches the single-digit shapes the five recorded pins actually have): **26 / 2,374** unique rows. Union triaged by hand.

**True unrecorded siblings (7 rows, 8 packet-reds — each live-verified):**

| Packet · path | Pinned figure | Live site | Red trigger | Class |
|---|---|---|---|---|
| **GR-4E** `CREDIBILITY_HIT: 0.3` | 0.3 | `src/domain/worldPulse/peaceTermsCatalog.js:73` (sole hit) | tuning pass | LATENT — fix: `"CREDIBILITY_HIT:"` |
| **CS-A2** `SILENCE_DECAY: 0.92` | 0.92 | `src/domain/worldPulse/beliefMap.js:112` (sole hit; line 675 calls it "the byte-identity anchor") | tuning pass (owner-signed; same-seed shift) | LATENT — fix: `"SILENCE_DECAY:"` |
| **AO-4 + AO-5** (same row twice) `selectedOutcomes: publicSelectedOutcomes.slice(0, 24)` | 24 | `src/domain/worldPulse/pulseKernel.js:1798` | history-cap retune reds TWO packets at once | LATENT — fix: `"selectedOutcomes: publicSelectedOutcomes.slice("` |
| **SK-2A** `const ceiling = 900_000 * SETTLEMENTS` | 900_000 | `scripts/audit/whole-world-soak.mjs:862` (`const ceiling` sole hit) | soak-ceiling tightening — a shrink is the natural motion | LATENT — fix: `"const ceiling ="` |
| **GAP-1** `` `src/domain/worldPulse/convergence.js` \| 798 \| 800 \| 2 `` | 798/800/2 | `docs/implementation/PACKET_STANDARD.md:472` — the **Hot files** table is a LIVING re-recorded list ("The standing list, every figure executed"; EconomicsTab joined 2026-08-15) | one effective-line move in convergence.js re-records the row — the exact TE-26 "re-recorded FIGURE" law | LATENT — fix: pin `` "| `src/domain/worldPulse/convergence.js` |" `` (membership, not figures) |
| **AO-6** rs[19] `A3 freezes both raw lanes and all 26 exact rewrite counts` | 26 | `tests/lint/newsHeadlineContract.walker.test.js:109` (test title) | next headline-rewrite row re-titles A3. AO-6 was "corrected" at STRIP-3 yet still carries this row | LATENT — fix: `"A3 freezes both raw lanes"` |
| **DOM-1** `` `typecheck:ratchet` is step 12 of the 17-step chain today `` | 12/17 | `scripts/check-full-typecheck.mjs:9` (comment; sole hit; self-dated "today") | check-chain growth updates the comment | LATENT — fix: ``"`typecheck:ratchet` is step"`` |
| **EFF-M3** `of `kindPoolFloorsRegistries` off **10**` | 10 | `docs/implementation/preambles/INT-PREAMBLE.md:311` — a ⛔ STOP-list baseline row | an 11th kind-pool registry re-records the preamble line | LATENT (grow) — fix: ``"of `kindPoolFloorsRegistries` off"`` |

**Examined and ruled SAFE, with the reason (so the sweep car doesn't re-litigate):** WEB-2 `interval '90 days'` (migration 198 — applied migrations are immutable); MF-UC1/UC2 `RE-MEASURED 2026-08-23 BY …` (ruinFilterRoster.walker.test.js:355/366 — re-measure lines ACCRETE, old lines never rewritten); INFRA-M1-DOCS `= **108**` (DESIGN_FP_ARCHITECTURE.md:892 — the doc itself declares at :857 "THE `= **108**` ARITHMETIC LINE … LEFT EXACTLY AS IT STANDS"); EP-3B's eight `yearBase: 0/1` rows (PROMISE-frozen seed-derivation structure — changing them shifts same-seed worlds, constitutionally barred); TM-2A `196_world_sim_metrics.sql` roster constant (the validator's own documented negative control, HK-3 comment block); CS-A2 `1 : 0` / CS-B2 `Math.max(0,` / TM-1B `null, 2` (code idioms, not tunable figures); all §-ledger references (§69.3, §67.2, §288, §118, 362.2, 310.3(7) — append-only ledger, comments stable); identifier digits (hash01/hash32/fnv1a32, WR10, `VIEWING_PAYWALLS_PENDING_514`, DS-GEN-nn, M13, A-21). Borderline, flag-only: AO-6 rs[23] `…road at 7 7 7` and WEB-2's A3 test title (90/89 — policy-bound, moves only with a new retention ruling); WEB-6's `§01 Forge` is a section label, not a figure.

**Net for the sweep car:** 5 recorded + 7 sibling rows = **12 symbol-truncation edits across 11 packets** (AO-4/AO-5 share a line; AO-6 is a second correction in an already-corrected packet), zero `retiredBy` annotations, all edits confined to `docs/implementation/PACKET_MANIFEST.json`, every replacement string above verified unique in its live file at `1a2471990`. All dispositions CONFIRMED by executed reads except the red-*trigger* timing claims (tuning pass, WEB-10 flip, template-hex cure), which are PLAUSIBLE — grounded in quoted packet/ledger text but contingent on future landings.