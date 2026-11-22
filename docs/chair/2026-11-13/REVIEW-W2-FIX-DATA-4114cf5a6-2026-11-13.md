# REVIEW-W2-FIX-DATA — the verdict (lane/w2-fix-data-2026-11-13, base 31f57e8eb → tip 4114cf5a6)

Reviewer: REVIEW-W2-FIX-DATA, independent. Reading pinned to **4114cf5a6** (a second builder adds commits after it;
ignored). Branch `lane/review-w2-fix-data-2026-11-13` (cut from 4114cf5a6). Two scratch worktrees (`4114cf5a6`,
`31f57e8eb`), `npm ci` in each; nothing written in the main checkout.

## VERDICT: **NOT CLEAR to merge.**

The lane's data work is largely sound — most of the 56 claimed cures are true in the product's own config shape, no
census row rises, and no new false sentence is introduced. But **one class of cure is reported true and is not true in
the shape the app generates towns in** (F1, HIGH). The seat's own §2 numbers already show it (granary `hold off famine`
55→55, charnel `carts go out at dusk` 38→38 on the 720) but were not interrogated. The fix is one line in generator
code, outside the lane's manifest; the seat's twins are already correct and will fire once it lands.

What I executed is marked **[X]**; what is reasoned but unrun is **[~]**.

---

## Step one — my own cold list (committed before the hand-back was read)

`docs/chair/2026-11-13/REVIEW-W2-FIX-DATA-COLD-LIST.json`, commit **fdb5331eb**. Twenty towns of my own seeds
(`rvfd-*`, none the census's or the fixture's), six sizes, two under siege, two in famine, one each occupied / plague /
wartime / mass-migration, born at 4114cf5a6 with `{ seed, customContent:{} }`, rendered through the soak harness (20
dossier tabs + Tonight + PDF + Foundry), read cold by four readers against each town's record. 373 rows (87 FALSE, 213
DOUBTFUL, 73 MACHINERY); 140 name this lane's files. [X]

---

## FINDINGS

### F1 — HIGH — crisis-excluding institution descriptions are "cured" only in the fixture's config shape; still false in the app's shape
The lane added `excludes: crisis` declarations + crisis twins to the granary and the charnel house
(`institutionDescVariants.js:1985–1999`, `:598`, `:1043`, `:2094`, `:2109`). The twin fires **only when the config
carries `stressType`/`stressTypes` directly — the REVIEW-W2B cold-list / fixture shape.** In the app's own shape
(`selectedStresses` + `selectedStressesRandom:false`, which the UI `ConfigurationPanel.jsx` writes and the
SECOND-WAVE-CENSUS births use) the twin **never fires**.

- **Mechanism [X, code-confirmed].** `assembleInstitutions.js:1004` draws the institution description with
  `birthFactsOf({ institutions, config, tier }, worldLaw)` where `config = ctx.config` — the **raw caller config**, not
  `ctx.effectiveConfig` that `resolveStress` threaded the stress into. In the `selectedStresses` shape the raw config
  has no `stressTypes`, so `factsOf(...).crisis` at the draw is empty and every `excludes: crisis` description keeps its
  (false) original. The ledger confirms it: a famine town's granary draw notes `atoms:["no crisis: famine"],
  resolvedBy:"drawn"`. (Services and arrival beats resolve later, with the stress threaded, so their siege/famine twins
  DO fire — mill/produce/freight and the ironwork/water arrivals are genuinely cured in the app shape.)
- **Measured [X].** famine-granary + siege-charnel towns still showing the false original, twin firings = **0**:
  - census 720: 4 famine granaries (`r2s-famine-town-0`..`3`), 3 siege charnels (`r2s-under_siege-city-1,2`), twin=0.
  - my fresh 1800 (app shape): 3 famine granaries, 2 siege charnels, twin=0.
  - fixture shape (same tier, same final `crisis.types:["famine"]`): twin **fires** — this is why the seat's §5
    "cured and true" and my own fixture-town check (56 cured, 0 at tip) both passed while production stays false.
  - The seat's own §2 table corroborates: `hold off famine` #212 55→55, `carts go out at dusk` #135 38→38 (unchanged).
- **Towns / sentences (app shape, at the tip):**
  - `r2s-famine-town-0` (Gründorf, town, famine) — Town granary: *"Communal grain storage. Buffers harvests,
    prevents famine."* — the same dossier is in famine. `src/data/institutionDescVariants.js:1986`.
  - `r2s-famine-town-1` (Hongcheng, town, famine) — Town granary: *"Shared grain stores that even out the harvests
    and hold off famine."* `:1990` / `:2109`.
  - `r2s-under_siege-city-1` (Torrivilla, city, under siege) — Burial grounds and charnel house: *"Carts go out at
    dusk to ground bought beyond the walls…"* `:1998` / `:2094`.
  - `r2s-under_siege-city-2` (Andronarion, city, under siege) — *"The old grounds inside the walls filled generations
    ago, so the dead are lifted…"* `:1043`.
- **Fix [X, proven].** In a scratch worktree, passing the resolved stress into the draw —
  `birthFactsOf({ institutions, config: { ...config, stressTypes: ctx.effectiveConfig?.stressTypes || config.stressTypes }, tier }, worldLaw)`
  at `assembleInstitutions.js:1004` — makes the app shape take the twin ("meant to carry the town through bad
  harvests…", "built to even out the harvests…") on the same famine towns. One line, generator code (NOT the lane's
  manifest). The seat's twins are already correct; they only need the crisis fact at the draw. Proof note in the probes
  folder. Whole-suite impact of the fix **[~] not run.**
- **Why HIGH:** it is a cure the seat reports true that is false in the real product, and the entire crisis-dimension
  **institution-description** declaration class is unverified in production (verified on a shape the app never uses).
  Each individual false sentence is MEDIUM; the class-wide verification gap is why I rank the finding HIGH.

### F2 — MEDIUM — customs house "via the port" residual, 24 towns (the seat's #210, disclosed PLAUSIBLE)
`institutionDescVariants.js` customs twins cut the false "via the port / road or harbour" line from **128 → 24** towns
without docks (720 census) [X]. The 24 residual are exactly the cascade-added customs houses (`source:"cascade"`),
whose rows keep the catalogue line through `shipFreeDesc` and never reach the declared draw — the seat named this
(#210). e.g. `r2r-town-8`, `r2r-city-7`. Fix is in `assembleInstitutions.js` (cascade rows through
`drawInstitutionDesc`), not the lane's files. Real but disclosed; not a regression (base also 128 false, uncounted).

### F3 — MEDIUM — pre-existing / EXPOSURE (NOT this lane): open-cast Mine contradicts its own description
A **Mine** whose description says *"work a shaft into the deposits … winding gear, and ore carts"* carries the service
line *"Surface-level ore extraction. Lower yield than shaft mining but cheaper to operate."* — the institution
describes a shaft, its service describes surface digging. **95 of 124 Mine towns, identical at base and tip**
(`institutionServices.js:650` + the Mine desc; the lane never touched either line). e.g. `rvfd-city-0`,
`rvfd-metropolis-1`. This is **not in the seat's WAITING list** and is **cheaper than a resource-atom cure**: align the
service text to the mine's drawn description (open-cast vs shaft), no new leaf. Flag for the owning seat; not this
lane's to clear, and not a regression.

### F4 — LOW — Elder Grove Council description says "the city" in town-tier settlements
The reworded druid lines keep *"…govern their circle's relationship with the city…"*; the institution is placed at
town tier, so a **town** reads "the city". 20 of 20 Elder-Grove towns in my 1800 (app shape) [X]. The lane only removed
the "Found in cities…" tail; the "city" clause is pre-existing. `institutionDescVariants.js:740s` /
`institutionalCatalog.js`. Minor tier-noun leak; pre-existing.

---

## The seat's claims, measured

- **The 56 "cured" fixture rows [X].** All 56 print at the base and **0 print at the tip** on the fixture towns (every
  surface: tabs, Tonight, PDF, Foundry). 54 are **genuinely cured in the app shape** too (charcoal/forest,
  customs/docks main path, fish-market/navigable, maltster/tavern, pawnbroker/bank, grazing, ferry, salt figure, beast
  trainers, assassin guild, sellsword, worship-quarters, the service siege twins, the arrival declarations, the history
  rewords). **2 are cured only in the fixture shape** — the famine granary (#212) and the siege charnel (#135) — and
  remain false in the app shape (F1).
- **The new words — §5 twins and §6 rewords [X].** Read in app-shape towns the seat did not use (my 1800). The
  non-crisis declared twins fire correctly where they should (forest/docks/tavern/bank/market/mercenary). No machinery
  leaks on the page (no points, shares, rule names). Caveat: the **crisis** twins (granary famine, charnel siege) do
  not fire in the app shape — F1.
- **No true line lost — the census [X].** My own `census.sh` run (base vs tip) matches the seat row-for-row: **no row
  rises; one falls (pattern 10, "hold the gates, no walls", 17 → 0).** All 17 were the town watch's description "walk
  the night and hold the gates" → "…keep the peace" (true; a watch needs no gate). No gate line lost. GLANCE 716→716.
- **Pattern 10 [X].** 17 towns, all the town-watch gate twin; the replacement is TRUE and presumes no gate. Origin vs
  exposure: n/a (a true-for-true reword, no new false line).
- **The guard captain re-key (watch not garrison) [X].** Across the census + my 1800, **0** garrison-no-watch towns
  carry a crime-wave tension — so no garrison town "loses a true line." The 9 base→tip hook drops are militia-only
  thorps/hamlets/villages (no watch, no garrison): a household levy has no captain, so the drop is correct, not a lost
  true line.
- **The defence pin re-key "by cause" [X].** The pin's membership is **identical** base→tip (3 keys); re-keyed by
  shape (an original needing a defence atom whose twin excludes it), not loosened. The two siege-charnel sets fall
  outside the pin — correctly, they are crisis not defence atoms.
- **A plant of my own (a third dropping picker) [X].** I planted an impossible declaration
  (`needs:['tier: = thorp','tier: = metropolis']`) on four rows read by four pickers. Three **refused** it correctly
  (the `Street food` service, a history plot-hook, an arabic arrival beat — none printed). The **fourth did not**:
  `cultureProfiles.js :: materializeCulturalIdentity` (civicPattern) printed the planted line in 64 towns regardless —
  it drops a row's declaration. This confirms the seat's §3 note that `materializeCulturalIdentity` is a non-declaring
  picker (already in WAITING); I found no fourth dropping picker in the lane's own files.
- **A zero across every surface [X].** For one cured line ("…separate quarters" → "…keep apart"), checked the page,
  the PDF, the Foundry journal, and **both** world-export variants (dm + player): gone everywhere. Page walk 42→0
  towns; record 2→0; world export 2→0.
- **The 32 WAITING rows [X].** Confirmed genuinely blocked (salt/quarry/mine-depletion need a resource atom; the five
  picker cures are other files). **One is cheaper than the seat frames it:** the open-cast Mine (F3) is not a
  resource-atom problem — it is an internal desc/service mismatch fixable by aligning the service text.

## Not measured / owed
- The worker byte ceiling the seat flagged as owed (`institutionDescVariants.js` +~23.5 KB into the signed generation
  worker). I ran no production build; a rise is bytes for the merge seat (the seat's own §9 note). **[~]**
- The whole-suite effect of the F1 fix. **[~]**

## What would make it CLEAR
Land the one-line `assembleInstitutions.js:1004` fix (thread `ctx.effectiveConfig.stressTypes` into the
institution-description draw) so the crisis twins fire in the app shape, then re-measure the granary/charnel on a
`selectedStresses` cold read. F2 (cascade customs) and F3 (open-cast mine) belong to other seats/files; F4 is minor.
