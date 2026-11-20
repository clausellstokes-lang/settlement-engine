# S7 FOLLOW-UP: the chair's six changes to the sides table (brief written 2026-11-20 13:30 UTC by PAGE-3; read BUILDER-RULES.md and S7.md first)

The chair read `S7-TABLE.txt` (a89859e6f) row by row, all 137, at 13:22 UTC. `presumes` and `without` HOLD, with two
changes. `means` is not yet safe, because the display seat's reader will NAME a power from it: several rows cast a whole
power as a camp or a part of itself. THE CHANGES, verbatim from the chair:

1. A NEW OPTIONAL FIELD `named`: THE ONLY DOOR TO A NAME. The reader shows a power's name only through a row's `named`
   wording ({power} filled by the names helper); a row without it is never named, whatever its `means`. No finite verb that
   must agree with the power. The rows and their wordings:
   "The sitting authority": "{power}" · "The restored order": "{power}" · "Those in charge, who will not give way":
   "{power}, who will not give way" · "Authorities exploiting the rift": "{power}, exploiting the rift" · "Those in authority
   who would exploit the rift": "{power}, who would exploit the rift" · "Authorities caught between them": "{power}, caught
   between them" · "Wealthy merchants": "{power}" · "Merchants who benefit from cheap newcomer labour": "{power}, gaining
   from cheap newcomer labour" · "Orthodox believers": "{power}" · "Guild members": "{power}" · "Criminal organisations": "{power}".
2. `means` BECOMES 'none' ON CAMPS AND PARTS (a power is never cast as one camp of its own kind): "Established guilds",
   "Upstart guilds", "Displaced traders", "Traders who fear the buyers are going elsewhere", "Merchants tied to the old
   partner", "Merchants who trade with the partner", "Temple beneficiaries", "Price regulators".
3. "Price regulators" where the town lacks a market: NOT dropped: `without` = "Those who would fix a fair price" (the kind's
   own unanchored words): three sides stay three.
4. "the merchant class" standing at economic_disparity/base/0 with no merchant power shows the SLOT row's `without` ("Those
   growing richer"), not "those who pull the strings", which is right only at succession_crisis/base/2: so the reader's
   rule 3 in the header reads the slot row's `without` first and the fixed word's own only where the slot row has none.
5. The fixed word row "the criminal network": `without` = "Lawbreakers", the same as its template row.
6. A totality arm: every row with `named` has a `means` that is the ruler or a power; no two rows of one kind and form carry
   `named` for the same party.

**FIRST, BEFORE BUILDING:** check each change against the code (`historyGenerator.js :: buildHistoricalEvent`,
`substituteNames`, the template table). If a row above is wrong by the code (e.g. a `named` row at a slot the generator
never writes a power into, or a wording that would make a sentence false), STOP and hand back which and why: do not mend
silently. Also check whether test (4) ("no row whose presumes is empty carries a without, save ...") and the `owing` list
must change with items 2 and 3, and whether "Price regulators" after item 2 still owes its `presumes: ['market']`.

**FILES YOU OWN:** `src/data/tensionSideMeanings.js`, `tests/data/tensionSideMeanings.test.js`,
`docs/chair/2026-11-20/content/page/S7-TABLE.txt` (regenerated from the file; add a `named` column). Nothing else. Red
first: the new arms red on the unchanged file (keep the count line). Gates: your test; `npm run typecheck:ratchet`;
`npm run typecheck:domain:strict`; `npm run lint` (each to a file, by `sh scripts/gate-tail.sh`). NOT `tests/lint`
(PAGE-3 runs it and refreezes the lighting census). ONE commit by explicit paths on branch `page3/s7-fix`. Never push.
