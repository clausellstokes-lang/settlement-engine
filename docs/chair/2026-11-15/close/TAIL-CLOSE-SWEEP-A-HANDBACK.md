# TAIL-CLOSE-SWEEP-A — hand-back

Seat: TAIL-CLOSE-SWEEP-A (a CLOSE seat). Branch `lane/tail-close-sweep-a-2026-11-15`, cut from the joined line at
`dc4bae117`. Every file was run ALONE at that tip first, to a file.

## Each file

| # | file | at dc4bae117 | turning commit | class | what was done |
|---|---|---|---|---|---|
| 1 | `tests/lint/siteCoherenceRatchet.test.js` | red | in progress | | |
| 2 | `tests/lint/newsHeadlineContract.walker.test.js`, `tests/lint/newsVoiceContract.walker.test.js` | red (395 → 417) | in progress | | |
| 3 | `tests/joins/fieldManifest.test.js` | green already | — | — | — |
| 4 | `tests/joins/labelJoins.test.js` | green already | — | — | — |
| 5 | `tests/data/dossierStateProseProjection.contract.test.js` | red, 2 (not the brief's throw: `generate-dossier-state-prose.mjs --check` exits 0 at the tip) | 4467cd7d6 · b284cbe44 · d4a4bd590, composed at JOIN-9 · 3 `c46e61abe` and JOIN-9 · 4 `954340b6f` | (ii) | re-recorded through the register's rows (`docs/content/prose-shift-register.json`), the move noted on each row |
| 6 | `tests/lint/rawColorLiteral.test.js` | green already | — | — | — |
| 7 | `tests/lint/styleLaw.walker.test.js` | green already | — | — | — |
| 8 | `tests/generators/institutionProseDeclared.test.js` | green already | — | — | — |

### 5. dossier state prose — the shift register's five pins, 2954 → 2959

The red: "variant-count-per-pool pin 0 … the register pins 2954 and the corpus measures 2959" and four sibling
pins (the variant digest, the face sum and digest, the vids digest), and the mutant test reading the same sum.
Bisected over the joined line's merge points with the test itself: JOIN-9 · 2 `70d80f3e9` measures 2954 against
a register of 2950; JOIN-9 · 3 `c46e61abe` (corpus-eco at a8ea5ef8e, which re-took the register 2950 → 2954 on
its own base) measures 2956; JOIN-9 · 4 `954340b6f` (corpus-def at b284cbe44, which did not touch the register)
measures 2959. Per-pool diff of every pool's variant count and vids, `70d80f3e9` against the tip: FIVE pools
grew by one, each the NEXT vid (no vid renumbered, none removed), each a twin its seat declared with its count:

- DS-ECO-1 `COMBINATION C1: a high rung on a working approach` v4 — 4467cd7d6 (TAIL-CORPUS-ECO-4 batch 7)
- DS-GEN-13 `COMMERCE: a market, no guild` v5 — 4467cd7d6
- DS-DEF-2 `Beasts & Monsters: settled, defenses beyond the need` v6 — b284cbe44 (TAIL-CORPUS-DEF-4 U2)
- DS-DEF-3 `Safe` v4 and `Very Safe` v5 — d4a4bd590 (TAIL-CORPUS-DEF-4 batch 6)

Re-recorded (ruling SW1): the five pin values, and a `note` on each of the three moved rows naming the commits.
After: the contract 79 of 79; `node scripts/generate-dossier-state-prose.mjs --check` exit 0 ("2959 variants").
No `src/` line touched; nothing a town prints moves in this commit (the twins already printed at the tip).

## The owner's part, in plain words

- **Dossier prose register (item 5):** the count of written variants in the dossier's state paragraphs went from
  2954 to 2959 because two writing seats each added twins (a second wording that holds in the other state). Each
  seat declared its own lines; their separate re-counts did not add up once both were joined. I re-recorded the
  register to 2959. This is "THIN-pool growth", which the register marks owner-gated per batch: yours to veto.
