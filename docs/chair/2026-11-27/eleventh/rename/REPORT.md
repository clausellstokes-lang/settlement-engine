RENAME-MEASURE DONE: branch lane/rename-measure-2026-11-27 at 444149cfd

Tree cccda7569, pages walked as OutputContainer renders them, plus PDF, Foundry and Tonight. (D)/(F): first 300 of C and of V (thorps, hamlets); (E): all 900 + 900.

- **Sites:** 33 view-time picks (30 print); 24 name-keyed (22 print): 19 town, 4 person, 2 power, 0 house (A30 holds two). CONFIRMED.
- **Roads:** save/reload keeps all; JSON import, share and gallery import drop `_seed` (10/10), so an imported copy re-deals 10/10 pages. `id` survives every road; houses and powers have none. CONFIRMED.
- **Owner vs shared after a town rename:** they agree but for 8 / 31 lines of the owner-only `commoner_resentments_dm` slot; the share re-deals 300/300 too. CONFIRMED. A share whose save was deferred keeps its old stamp. PLAUSIBLE.
- **Still printing the old town name:** 300/300 and 295/300, from `arrivalScene`, `stress.summary`, `pressureSentence` and `stress[].summary`. CONFIRMED.

| rename (C / V, of 300) | pages re-dealt otherwise than by the name | main site |
|---|---|---|
| town | 300 / 300 | Daily Life 300/300; crisis vantage 97/109; overview headline 75/87 |
| person | 39 / 36 | the people headline |
| house | 298 / 279 | name read as kind |
| power | 179 / 175 | name read as kind; honorific 6/7; conflict hook 0/1 |

**The cure.** Key the town-name sites on the town's `id`, and the people headline on the person's `id`. In a scratch copy it moves every page once: 900/900 in both corpora, 28,031 / 28,670 lines. CONFIRMED. By site:
- Daily Life: 900 / 900.
- The headlines: 539 / 532.
- The crisis vantage: 293 / 287.
- The second outsider option: 272 / 397.
- Fortune: 66 / 56.

Then no town or person rename moves a pick. Sparing Daily Life still moves 577 / 560 and keeps the worst re-dealer.

**What I would NOT change:**
- the fallback-only names (A11, A21, A17, A31, A30's person part);
- the unwired A32/A33;
- the food-gap hook (no pick on 1,800 births);
- the power-name keys A15/A30 (re-dealt on 0–7 of 300 pages, and powers have no id).

Two defects re-keying does not touch:
- **The kind-reading of names** (house and power renames).
- **The stored sentences:** they need a write-time cascade in `renameSettlementImpl`, like `applyFactionRenameToSettlement`'s `substituteWholeWord`.

Re-keying the `_seed` sites to `id` would cure the import re-deal, plausibly at one move of every page. PLAUSIBLE, not run.

**Not measured:**
- the server SQL sanitizer (mirrored by toPublicSafe);
- real PDF rendering (composers measured);
- (D) and (F) on villages and larger towns;
- the A13/A14 salience hash, which is outside the pick log;
- the `_seed`→`id` re-key;
- the house rename (no UI).
