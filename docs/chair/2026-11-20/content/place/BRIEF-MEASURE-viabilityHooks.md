# PLACE-1 MEASURE brief 7 — `economicViability.plotHooks[].hook` (the economy's hooks)

Written by PLACE-1, `date -u` at writing: 2026-11-20T16:39Z. Read `BRIEF-MEASURE-COMMON.md` beside this file FIRST and WHOLE (its section 0, PROVE IT PRINTS, comes first; its ATOM rule binds G): it says how; this says what.
Your output: `docs/chair/2026-11-20/content/place/viabilityHooks-MEASURE.md` and `docs/chair/2026-11-20/content/place/tools/viabilityHooks/`.

## Why this field (the chair, 16:38 UTC, from SAME-1's rendered census `OFF-LIST.md` on `origin/lane/same-1-2026-11-20`, `docs/chair/2026-11-20/content/same/census/`)
Printed on the Plot Hooks tab, the PDF and the session sheet. "The settlement grows less food than it eats, and a merchant has offered to make up the difference for a price that is n…": the commonest in 48 to 60% of the towns and villages that hold one.

## THE RULE FOR A HOOK (the chair's, binding every wording)
A hook is a lead a DM can use tonight: something has happened or is about to. It MAY propose a twist; it may NOT name a house (an institution, a power) the place lacks, nor a fact the record lacks. The owner's rules stand: capitalise on what is already there; never invent a crisis the record does not hold.

## Where to start
Find the writer of the field (grep `plotHooks` under `src/generators/`; the economy's hooks are likely beside `src/generators/economy/foodBalance.js`, the safety's in `src/generators/safetyProfile.js`), read it WHOLE, and measure per hook TEMPLATE (a hook's slots may already vary: mask goods only if the census masks them, which it does not). Section 0: render places that hold the field (DM view, player view if hooks show there, and say whether the PDF and the session sheet print it from the same stored string). Reuse the sibling measures' scripts (`tools/safetyDesc/`: `prove-prints.mjs`, `render-player.mjs`, the tap; `tools/situationDesc/`: where the seed and the final trade lists are reachable).
