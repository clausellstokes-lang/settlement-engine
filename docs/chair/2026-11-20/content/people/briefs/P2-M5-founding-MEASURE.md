# PEOPLE-2 measuring seat M5: who founded the place, as PRINTED (written 2026-11-20T17:19Z)

Read `docs/chair/2026-11-20/content/people/briefs/MEASURE-COMMON.md` first: it binds you word for word (you change NO file under `src/`, `tests/`, `scripts/`, `supabase/`, nor `package.json` / `package-lock.json`).

## The chair's ruling this unit answers (17:13 UTC, relayed in `PEOPLE-1-HANDBACK.md`, section THE SPLIT, item 5)
"FOUNDING IS IN SCOPE: it prints through the traditions card (387 of 1,232 rites quote `foundedBy`). Measure the `foundedBy` pool's commonest phrase by size and propose; a noble founder where no lord rules is history, not a contradiction: leave it. M3's PROPOSAL-founding.md is the start."

## Start from
`docs/chair/2026-11-20/content/people/PROPOSAL-founding.md` (read it whole), its scripts `measures/m3-births.mjs`, `m3-origins.mjs`, `m3-pools.mjs` and their `.out.txt` files. Base: the commit your worktree starts on (its `src/` is identical to the working line `43ab0f5eb`). The noble-founder question is RULED (leave it): do not reopen it.

## What you measure (100 places a size, seeds `hxd-<size>-0..99`, the six sizes)
1. PROVED PRINTED, by containment. Find the writer(s) of the traditions card's rites that quote `history.founding.foundedBy` (read each WHOLE; name them `path :: symbol`), and whatever else composes from it on a surface (`historyBeats.js :: deriveFoundingCause`, the History tab, the PDF chapter 08, the Foundry journal). Then RENDER: for each place, render the traditions card (and the History/PDF surfaces you can render the way the chair's page census does: `docs/chair/2026-11-20/content/tools/confinement/render.census.jsx` shows how) and count the places whose rendered text CONTAINS the stored `foundedBy` (or the phrase the rite takes from it). Report places and rites by size; the chair's figure is 387 of 1,232 rites.
2. TODAY: the top share by size of (a) the stored `foundedBy` (re-confirm M3's 38/41/26/26/29/37%), and (b) the PRINTED rite sentence that quotes it (the place's own names masked to `#`, digits to `0`): the commonest rite sentence, its places over the places printing any founding rite.
3. THE PROJECTION with M3's 108 `foundedBy` wordings (`m3-pools.mjs`, as written, the same selection `pickVariant([resolvedRow, ...eligible], '<seed>::history.founding.foundedBy')`): the projected top share of (a) and (b) by size, and the commonest projected sentence of each.
4. THE FILL READ: every distinct rite sentence the projection prints with a NEW founder wording inside it, over the 600 places, written whole to `measures/m5-rite-fills.out.txt` (one line each, with its count). Then read them yourself: list in the proposal every one that does not read as English or says what the record does not hold (e.g. a founder phrase whose clause clashes with the rite's own grammar, a doubled "who", a tense that fights). For each, propose the cure: a rewording of the founder line, or a need that keeps it out of that rite.
5. `overcoming`: re-confirm M3's today and projected tops (24/22/22/27/35/27% to 10/8/10/11/13/10%) on the same births, and say whether any surface beyond the PDF prints it (render, by containment).

## Your outputs
- `docs/chair/2026-11-20/content/people/PROPOSAL-founding.md`, AMENDED in place: a new section at its head, "## 0. As printed (M5, <date -u>)", with items 1 to 5 above, the fill read's findings and cures, and the amended wordings (if any) quoted whole beside the M3 wording they replace. Do not rewrite M3's sections; strike in place (`~~…~~`) any line of them your measure refutes, with one sentence why.
- Your script(s): `docs/chair/2026-11-20/content/people/measures/m5-*.mjs`, each run's output beside it as `.out.txt` (count lines; the fill list is the one long file).

## Hand-back
Commit your files ONLY by explicit path on your worktree's branch; do not push. Final message at most 200 words: the commit; printed status by surface (places, rites); today and projected top shares of the stored field and of the rite sentence by size; how many fills you flagged and how you propose to cure them; anything the chair must rule.
