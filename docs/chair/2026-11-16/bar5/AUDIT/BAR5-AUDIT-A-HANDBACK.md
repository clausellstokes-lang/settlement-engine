# BAR5-AUDIT-A · hand-back (seat A: LAW 1 and LAW 4)

**State of this file: first push. Only the sixty read towns are done. The 720 and the fresh 300 are still rendering, so their counts, the precision sample and the cure forms are to follow.** Tree: `lane/join-2026-11-14` at `9867b4b17`, rendered in a scratch worktree with PAGE-COPY's `census3.sh --count-only`.

- Detectors: `tests/helpers/pageLaws/` (`page.mjs`, `law1.mjs`, `law4.mjs`).
- Runner: `run-a.mjs`. Controls: `controls-a.mjs`. Tables: `tables-a.mjs`, which writes [`TABLES-A.md`](TABLES-A.md).
- Only the DOSSIER tabs (Summary, Systems, World, Notes) are read. The Tonight sheet, the PDF and the Journal are not counted.

## 1. The controls (sixty): every STANDS row found, no EXPLAINED row found

- **LAW 1, 12 of 12 STANDS found:**
  - 1a: C17061, C29831, C9617, C33713, C43125.
  - 1b: C40276.
  - 1c: C33631, C35627, C39734, C43925, C38889.
  - 1d: C32519.
- **LAW 1, 0 of 4 EXPLAINED found:** C31972, C40444, C33652, C16520.
- **LAW 4, 7 of 7 STANDS found:** C44306, C42840, C15951, C30295, C22786, C2000, C39999.
- **LAW 4, WEAK rows:**
  - C42731 ("at market") and C31115 (the harbour's "outer wall") are found only by the register's vocabulary pass 4r.
  - C31780 ("civilian courts") and C37631 ("several quarters") are not found. The register's court words are "courthouse / court of law"; its quarter words need a qualifier.

**The read before's cured STANDS of these laws:** 12 of 15 no longer print in their towns. Three still print:

- **C24951** (the temple district, History): a finding.
- **C31074** (magic "help beyond ordinary work"): the page's word is Relied upon, so LAW 1 does not hold it. Its fault is the fished-out fishery, which is LAW 3's.
- **C7336** ("well paid" guard): its other end, the unpaid-guard hook C6022, no longer prints, so the pair is cured.

The full table is in TABLES-A.md.

## 2. The counts: see TABLES-A.md

On the sixty:

- **LAW 1:** 20 instances in 18 towns (1a 7 in 5 · 1b 1 · 1c 11 in 11 · 1d 1).
- **LAW 4 (4n):** 17 instances in 15 towns.

## Two facts for one thing, found so far

- **MAGIC.**
  - The record's reading is `src/domain/magicReliance.js :: deriveMagicReliance`. `src/generators/defenseGenerator.js :: generateDefenseProfile` stores it as `defenseProfile.magicDependency` (relied-upon or integral).
  - The page's word is `src/domain/display/dossierViewModel.js :: deriveMagicRelianceView`, which lowers the reading through `magicProvisionShown.js :: relianceReadingShown` (BAR2-LABELS LB1).
  - The Magic tab's DS-DEF-9 sentence (`src/domain/display/stateProse/defenseStateProse.js :: defenseMagicDependencyProse`, via `reliesOnMagic`) re-reads `deriveMagicReliance`, the record's reading. It ignores the shown reading that `magicRelianceDeskSettlement` writes into `defenseProfile.magicDependency`.
  - Result: "Reliance on magic: None" sits above "part of the town's work now holds up only with help beyond ordinary labour". On the sixty: 3 towns have record relied-upon against shown none, and 2 have record integral against shown relied-upon.
  - The Overview's "relies on arcane workings it does not entirely trust" (`src/generators/narrativeText.js`, `magical_heavy`) has `needs: ['magic']`, which reads magic's presence, not its reliance.
- **FOOD.**
  - The page's word is `src/domain/display/foodWordShown.js` → `src/domain/summary/tonightSheet.js :: foodBandOf` (band secure with gapPct > 0 → Pressured).
  - The stored `economicState.foodSecurity.label` stays Secure. On the sixty, 10 towns print Pressured over a stored Secure.
  - DS-ECO-9's security rung keys on the stored label (`economyStateProse.js :: foodSecurityPoolKey(eco.foodSecurity.label)`).
  - DS-ECO-9's food-sources lens (`foodSourcesPoolKey`) keys on the number of sources alone. That lens wrote C40276 ("can take a bad season in one source without going hungry") in a town short every day.
