---
name: site-coherence-wave0-instrument-landed
description: "⭐⭐ SCW-0 LANDED @ d648e788 — the site-coherence contradiction ratchet + liveness census. ⚠⚠ THE AUDIT'S 80/33/23/0/103 IS NOT REPRODUCIBLE AT ANY HEAD: the corpus spec pins axes and count but NOT the SEED LITERALS, and seed choice swings the totals wider than the whole gap. ⚠⚠ A NEW hazard-registry class needs a SEVENTH path — scripts/lib/premortem-triggers.mjs — or gate STEP 2 reds."
metadata: 
  node_type: memory
  type: project
  created: 2026-08-12
  modified: 2026-08-12T06:10:30.255Z
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
---

# SCW-0 — the site-coherence enforcement layer (Wave 0 of 9)

Landed `d648e788` on `claude/composite-r4`, base `d0af9b35`. **Instrument-only: zero `src/` files.**
7 paths, 996 insertions. Full gate `npm run check:tail` TRUE_EXIT=0.

**Deliverable:** `tests/lint/siteCoherenceRatchet.test.js` (9 tests, the identity-keyed
contradiction ratchet) · `tests/lint/.site-coherence-baseline.json` (**43 rows over 462
settlements**, `frozenAt` `d0af9b35`) · `tests/lint/exportTokenCoverage.test.js` (5 tests,
predicate liveness + `KNOWN_INERT`) · `scripts/hazard-registry.json` (HZ-READERNOWRITER 3→4,
new **HZ-SITECOHERENCE** MACHINERY) · `scripts/mutation-coverage-manifest.json` (2 rationale
rows) · the lighting-census fold · **`scripts/lib/premortem-triggers.mjs` (the 7th path)**.

## ⛔⛔ THE ONE THAT WILL BITE THE NEXT LANE: A NEW REGISTRY CLASS COSTS A SEVENTH PATH

Adding any class to `scripts/hazard-registry.json` reds **`validate:premortem`, gate STEP 2**:
*"registry class X has NO trigger predicate and no stated reason in NOT_CHANGESET_EXPRESSIBLE."*
The cure lives in **`scripts/lib/premortem-triggers.mjs`** — either a `PREDICATES` entry or a
`NOT_CHANGESET_EXPRESSIBLE` reason ≥20 chars. A predicate must satisfy four self-check arms:
every `classIds` resolves, every declared `sources` path EXISTS, `population()` is NON-EMPTY,
and `synthetic()` must make `run()` actually FIRE ("a predicate that cannot be made to warn
cannot be trusted to warn"). ⚠ SCW-0's packet enumerated FIVE landing obligations and missed
this one entirely — **CR-SCW0-2's "six paths" was refuted by live machinery**, which also
weakened (not voided) CR-SCW0-4's grounds for `kind: "rationale"`.

## ⭐⭐ THE AUDIT'S EXIT FIGURES WERE NEVER REPRODUCIBLE — SEEDS, NOT REGRESSION

`SITE_COHERENCE_PLAN.md:81` made it an exit criterion to reproduce `80 / 33 / 23 / 0 / 103`
**exactly**. Re-derived at `d0af9b35`: **131 / 24 / 35 / 0 / 166**. CR-SCW0-6 had already
replaced "reproduce exactly" with "re-derive and report against" on staleness grounds — but the
real cause is stronger and was MEASURED, not guessed: **the corpus spec (`:56`) pins the axes, the
count and the culture rotation but NOT THE SEED LITERALS**, and the audit's seeds died with its
`/tmp` probes. Same corpus, two other arbitrary seed sets → `154/50/19/0/173` and
`172/73/16/0/188`; same seeds with culture rotated +3 → **all five identical**. ⇒ Seed choice
dominates; the audit's figures could not have been hit at any HEAD. `dunesOnWet` is 0 under
every variant. ⭐ The metric definitions were validated by reproducing the audit's own identity
`waterOnDry + flankOnFlat + dunesOnWet = anyContradiction` on independent data.
**Metric defs:** dry = {plains,hills,forest,mountain,desert}; flat = {plains,desert,riverside,
coastal}; wet = {riverside,coastal}.

## Design decisions worth not re-deriving

- **Read the SHIPPED path, not a replica.** `siteKind` comes from
  `buildTownLayoutV2(s).meta.siteKind`; only **274 ms for all 462**, so there is no cost excuse
  for replicating `townLayoutV2.js:250-283,320`. The reconstructed `generateSite` bag (needed
  for the token probe) is cross-checked against it on all 462 rows — the audit's own **S13**
  defect turned into a guard.
- **The decisive token is LEAVE-ONE-OUT against the real deriver**, never a re-implemented arm
  chain: empty the exports → same kind ⇒ `(biome)`; else the first source-order alternative
  whose removal changes `kind`; else the first matching one.
- **DERIVE the token set, never transcribe it.** It immediately caught a stale inherited figure:
  the audit measured `/barge/` DEAD, and it is now **LIVE** on `Cargo barges`. Transcribing the
  plan's expected inert list would have reddened on the first run. `/salt/` is LIVE and is NOT
  quarantined — the audit's salt finding is about DECISIVENESS (shadowed), not liveness.
- **Report all four ratchet polarities in ONE assertion.** Four sequential `expect`s stop at the
  first and hide the rest — the sequenced-census trap, inside your own test. Found by running
  the C2 mutant and seeing only `grown`.
- ⚠ **zsh gotchas that cost two tool calls:** `PIPESTATUS` is `pipestatus` (so capture `$?`
  directly, never after a pipe), unquoted `$VAR` does NOT word-split, and **`read -r ... rel`
  not `path` — `path` is tied to `PATH` and destroys it.**

## Receipts

- **B7 corpus cost: 7,595 ms** for the 462-settlement pipeline build (CR-SCW0-5 STOP 120,000).
  A local `120_000` per-test timeout is the estate spelling (`determinismBanCoverage.test.js:169`);
  the global `testTimeout` at `vite.config.js:801` was NOT touched.
- **C2 mutant executed:** deleting `coal` from `siteGenesis.js:247` → ratchet reds naming
  `plains|mountain-flank|coal (frozen 10, now absent)` + forest 12 + desert 6, the same 28
  reappearing as grown `plain`/`dunes` rows with nothing left over, **while
  `exportTokenCoverage` stayed GREEN**. Restored byte-identically (sha256 `11eeb40a…f90d`).
- **Census fold:** 2,399/365/2,034/19,821/5,592 → **2,401/365/2,036/19,835/5,594**; both new
  files CREDITED not parked (462-loop inside one `it`); derived twice, agreeing exactly.
- Registry: 28 classes, MACHINERY 11/9, DOCUMENT 6/6, OWED 17/18, floor 27 — **no floor moved**.
- Typechecks at exact ceilings, unmoved: full 173/173, domain-strict 1134/1134.

## Still open

Waves 1–9 are all unstarted; **Wave 3's biome guard must precede Wave 4's predicate narrowing**
(fixing one predicate in a first-match chain redistributes load onto the next: measured, Option B
moved flank-on-flat 15 → 19). Audit finding **C1 was already half-discharged** by the schema-4
genesis `2a7fb033` — its prose half was cured before SCW-0 arrived and was deliberately NOT
re-edited; only the instance count remained. Recorded follow-up micro-act: upgrade the ratchet's
manifest row from `rationale` to a planted sweep mutation (needs a `MUTATED_FILES` row).
