# R4I-PAGE-2 HANDBACK (VEIL-38, chain B). WIP, kept current at every commit.

Branch `lane/veil-38-2026-11-23-r4ipage2-wip` (local, never pushed), cut at fd7163ba6. Brief: `briefs/R4I-PAGE-2-BRIEF.md` (d8201ca8f).

## S1 — THE SWITCH'S ONE SALT (DONE)
- `galleryVeil.js :: applyVeil(publicSettlement, veil, opts)`: optional `{ salt }`; absent, `readSalt()` as before.
- `criminalVeilSwitch.js :: presentCriminalGroupings`: ONE `readSalt()`, passed to both of its `applyVeil` calls.
- Guard + arm: `tests/security/criminalSwitchSalt.test.js` (+ `criminalSwitchSalt.shared.mjs`; manifest row `self-proving-meta`).
  - RED FIRST (S1 unapplied, logs/s1-red.txt): 3 failed | 3 passed of 6. The arm: 4 of 24 reads differ (Redwick and Quietford, DM off and on).
    The walker: the switch's two calls unsalted.
  - GREEN (logs/s1-green.txt): 6 of 6.
  - JUDGMENT (vetoable): the brief's literal "no function `_gallery_veil*` has a salt parameter" is false of 212 as built: its six
    named salt carriers (`_gallery_veil_rekey_id`, `_rekey_ref`, `_rekey_at`, `_rekey_each`, `_rekey`, `_rekey_served`) take `salt`.
    The test therefore shows that the entry `_gallery_veil` and the three reads take none, that `_gallery_veil` draws it
    (`salt text := gen_random_uuid()::text`), and that EVERY salt-taker is one of those six, each revoked from public, anon and
    authenticated and granted to no one.
  - The arm's fixtures in-tree: CurateMode's 2 hand towns, criminalSwitchHandReach's 6 births, and 4 tell-gate births. The whole 92 + 48 go through the probe.
- The expected greens after S1 (logs/s1-switch-tests.txt): curateModeCriminalSwitch GREEN (all). criminalVeilSwitch: 2 STILL RED,
  both class (i) id pins, NOT S1's cause: "VR34 (b)" (`open.factions[0].members` pinned to id `n1`) and the births'
  "(a)-(e)" ((c) = `mask(H) === mask(before)`: two applyVeil copies byte for byte, 24 of 24; (b) = `allegiance` handler, 5 dm copies).
