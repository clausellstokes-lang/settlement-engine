# LANE: CHARSET3 — the sanitiser erases codepoints the renderer can draw
⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧ · released by the §893 carve-out amendment.

## WHY THIS IS NO LONGER GATED
It was held under "paid-surface behaviour". The chair's amendment ruled it a **REPAIR, not a change
of what a customer is sold**: the sanitiser strips 27 codepoints the renderer is fully able to draw,
so real names ship mangled today (`Uroš`, `Hadžić`). Protecting a paid surface that has no paying
customer yet, at the price of misspelling a player's own name, is the wrong trade. Nothing reaches a
human until the owner pushes, which is the real backstop.

## THE ACT
Narrow the sanitiser to the codepoints the renderer genuinely cannot draw. **Establish the drawable
set by MEASUREMENT against the shipped font stack — never by assumption or by a list in a doc.**
Report the measured set, the 27 (confirm or correct that count yourself), and the diff between them.

## ⛔ DISCIPLINE
- The sanitiser guards an AUTHORING path. §893 ruled CS-9 separately: an account import of a user's
  OWN export is a RESTORE path and must hydrate rather than refuse, marking undrawable entries
  `charset_legacy`. Do not blur the two paths — this car is the authoring wall's WIDTH, not its
  existence.
- A name is user-visible data. Round-trip every change: author → persist → export → import → render.
- PREDICT every register figure in writing before any instrument runs. You take no register door.
