# LAST-VARIETY · hand-back (seat LAST-VARIETY, the last small round, 2026-11-18)

Base: b014a7bf3 (`lane/landing-pieces-2026-11-18`, points 54 to 65). Branch: `lane/last-variety-2026-11-18`.
Brief: `docs/chair/2026-11-18/last/BRIEF-LAST.md` (chair's lane), section LAST-VARIETY, items 1 to 3.

| commit | what |
|---|---|
| f98a31cdd | the hand-back opened |
| 2455faed8 | item 1: two lines at the end of each DS-DEF-3 safety pool; the guard `tests/domain/lastVariety.test.js` |
| 94a44219f | item 3 measured, nothing written; item 1's proof |
| f3b728bb0 | item 1: Unsafe v6 declared (`no watch`); the older tests its lines made untrue, re-keyed by identity |
| f00dd3a66 | item 2 HELD for the chair's word: its patch `LAST-VARIETY-ITEM2-WANT.diff` and figures |
| (the last) | the net, the stored figures, what is left |

The measuring scripts (scratch, not committed): the 900 born as FAULTS-DESKS's guard births them (the thirty
`seeds.bar7.txt`, the 150 `seeds.w150.txt`, the 720 `censusPlan('r2')`); every pool's admitted set read by
`declarationAdmits(variantFactDeclaration(v), factsOf(record), { crisisScoped })`, as R7 read it. At the base the script
gives R7's counts exactly (Moderate 105 of 259, Safe 21 of 46, Very Safe 10 of 33, Unsafe 3 of 16).

## 1 · Item 1: the DS-DEF-3 safety pools for small places

**What R7's short towns are.** Every one keeps no court and no gaol (`court or gaol` false) and no watch. Two kinds: nobody
under arms (`guardPresence` false), and a militia with no watch (`guardPresence` true through `militia`). Each pool holds
towns that admitted ONE line (Moderate: thorps and hamlets with a militia, v7 only; r2r-hamlet-17, law collapsed, v8 only;
Safe: thorps with nobody under arms, v1 only; Very Safe: villages and hamlets, v2 only; Unsafe: v4 only), so each pool
needs two new lines admitted together in those towns: **eight lines, two a pool, the fewest that can do it.**

**The eight** (annex `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, each at its pool's END; the leaf
`src/data/dossierStateProse/defense.generated.js` projected by `scripts/generate-dossier-state-prose.mjs` after a fresh
census in the tree, the census then restored: the leaf is committed, the census is not). THE OWNER'S VETO LIST:

| pool · vid | line | declared | prints in (the Defense tab's public-order rung, its PDF copy; the record, `toPublicSafe` and the share veil alike) | admitted in (of the pool's towns) |
|---|---|---|---|---|
| Very Safe v6 | What trouble {settlement} sees is mostly quarrels, and they seldom outlast the week. | street · tier ≤ village · no crime wave · crisis: any · no crisis: threat, unrest | bar0-village-calm-rand-36 (Onongol), r2r-hamlet-11 (Riparipa), r2r-hamlet-41 (Keshigbulag); 5 in all | 10 of 33 |
| Very Safe v7 | {settlement} has no watch; its neighbours notice anything out of place, and are quick to say so. | ledger · no watch · crisis: any · no crisis: threat, unrest | r2r-village-8 (Khandavan), r2r-village-49 (Yaxchtzal); admitted, not drawn: r2r-village-6, -14 | 10 of 33 |
| Safe v6 | {settlement} has no gaol, and has so far had little use for one. | ledger · no prison · crisis: any · no crisis: threat, unrest | bar0-town-calm-rand-29 (Neadgill), bar0-town-calm-rand-31 (Zelenosk), bar0-hamlet-calm-rand-32 (Raskot), r2r-town-4 (Jayagiri); 12 in all | 31 of 46 |
| Safe v7 | Visitors to {settlement} see nobody keeping watch, and come to no harm all the same. | visitor · no guardPresence · crisis: any · no crisis: threat, unrest | bar0-thorp-calm-rand-28 (Jalalbash), r2r-thorp-28 (Zelenoev), r2s-infiltrated-village-2 (Bayarserai) | 4 of 46 |
| Moderate v9 | Whatever trouble {settlement} has is soon known to everyone in it. | street · tier ≤ village | bar0-village-calm-rand-46 (Tihono), bar0-thorp-calm-rand-31 (Madinatqila), r2r-hamlet-17 (Faroaltum); 34 in all | 138 of 259 |
| Moderate v10 | With no gaol at {settlement}, nobody who does wrong here can be locked away; most go on living beside the people they wronged. | ledger · no court or gaol | bar0-thorp-calm-rand-45 (Dunwood), bar0-hamlet-calm-rand-45 (Ravenland), r2r-town-45 (Varanand); 39 in all | 146 of 259 |
| Unsafe v5 | Theft at {settlement} grows each season, and with nobody under arms, every household guards its own. | street · no guardPresence · crime wave | bar0-hamlet-calm-rand-29 (Skálgarde); admitted, not drawn: bar0-hamlet-calm-rand-27, r2r-thorp-30 (the only three towns of the 900 it is true of) | 3 of 16 |
| Unsafe v6 | There is no watch at {settlement}, and visitors are warned to keep their belongings close. | visitor · no watch (first written undeclared; the undeclared-lines register, shrink-only, refused it: it now says what it presumes, f3b728bb0) | bar0-hamlet-calm-rand-27 (Gangapur), r2r-thorp-30 (Obergasse); admitted, not drawn: bar0-hamlet-calm-rand-29 (the three towns of the 900 with no watch) | 3 of 16 |

Why each is declared as it is: v10 names the gaol but says the wrongdoer stays among the wronged, which a court (exile,
the rope) could make false, so it declares `no court or gaol`, not `no prison`; Safe v6 names only the gaol (`no prison`).
Moderate v9 first read "Most days … pass without trouble", which is not true beside a crime wave and a collapsed law
(r2r-hamlet-17): reworded before the commit to a thought true under both. Very Safe v6 declares `no crime wave` (quarrels
as the worst of it). Each thought is its own: none repeats Moderate v5/v6 ("its own people keep order"), Safe v1 ("the
would-be spreaders are known"), Safe v4 ("somebody keeps it that way") or Unsafe v4 ("the rest goes unanswered").

**Proof.** Over the 900 at the tip, every town of the four pools admits three or more (Moderate 0 of 259 under three,
Safe 0 of 46, Very Safe 0 of 33, Unsafe 0 of 16; base 105, 21, 10, 3). The guard holds it in R7's one-line towns on the
record, its public projection and the share veil, each line printed in a named town on all three forms, and each
declaration refused where its premise fails (a negative beside each positive): red at the base 4 of 4 (the lines are
not in the leaf), green at the tip.

**Declared moves (R5).** Field family: the Defense tab's public-order rung (DS-DEF-3 `publicOrder.beside`) and its PDF
copy. Towns whose line moves, base against tip: the thirty 4, the 150 27, the 720 67; every one moves TO one of the eight
(no town moves between old lines). By pool: Moderate 4 · 19 · 50, Safe 0 · 5 · 10, Very Safe 0 · 1 · 6, Unsafe 0 · 2 · 1
(the thirty · the 150 · the 720). **Named: the Unsafe twin v4 (the chair's word of 09:11) now prints in NO town of the
900**: its three towns admit v4, v5 and v6, and the draw gives them v6, v5, v6. It stays admitted there (held by
`faultsDesks.test.js`, re-keyed) and true wherever drawn. The 525 by the golden's own `hashFor`: **0 of 525** move (display prose; no stored
record). (At the base, 191 of the 525 already differ from the stored fixture: the base's own red, the close's.)

## 2 · Item 2: the SUPPLY goal family

**Measured at the base over the 900:** 93 cards in 85 towns (the thirty 2, the 150 12, the 720 79) hold a SUPPLY family of
dependency lines only, EVERY one refused (11e.wantBuy), so 0 admitted in each vantage; a SUPPLY pick there falls to the
next family's first admitted line, draw-free. Goods: precious metals 33, iron 19, stone and iron and grain 15, iron and
fuel 11, timber 6, iron and grain and fuel 4, metal ore and fuel 2, timber and rags, livestock and game, medicinal herbs 1
each. 23 of the 93 under a siege or with no market (cells of 3 or 5).

**Why not in `goalFamilies.js` alone (THE STOP, sent to the chair):** `goals.js` marks every candidate of the dependency
cell refused where `needUnmet`; a line appended there is refused with them, and the other SUPPLY cells (impaired,
isolation, expansion) are not dealt to these cards. The cure needs one push in `goals.js`, a file outside the item.

**HELD, NOT COMMITTED (no word from the chair by the hand-back; its session idle).** The cure is written and measured
in my tree, and handed over as a patch that applies on f3b728bb0: `docs/chair/2026-11-18/last/LAST-VARIETY-ITEM2-WANT.diff`
(`git apply` it; four files: `src/data/people/goalFamilies.js`, `src/generators/people/goals.js` (two lines),
`tests/data/goalFamilies.test.js` (the §6.6 count), `tests/domain/lastVariety.test.js` (item 2's guard block)).

- **The cell.** `GOAL_FAMILY_LINES.SUPPLY.want` (slots `resource`, `house`; `GOAL_SUBKIND_SLOTS.SUPPLY.want`), at the
  family's END; the intent key falls to SUPPLY's `*` (`secure_supply`). `goals.js` pushes it beside the refused dependency
  cell ONLY where `needUnmet` holds, so no card with a met dependency moves by it. A refused dependency pick then takes the
  family's next admitted line (a want line), draw-free, as POWERS-9 resolves it.
- **The four lines (THE OWNER'S VETO LIST; none presumes a supply, none buys from outside, so none is refused under a
  siege; the slot contract held by `goalFamilies.test.js`):**

  | vantage | line | e.g. (as it fills on a card of the 900) |
  |---|---|---|
  | short | Find something the work at {house} can use in place of {resource}. | bar0-city-wartime-rand-45, Klara Weber (the citadel; stone and iron and grain); bar0-city-wartime-rand-31, Banbh Farrell (the banking houses; precious metals); r2r-town-30, Helga Gormsson (the blacksmiths; iron and fuel) |
  | short | Gather what {resource} can be found close to home for the work at {house}. | bar0-hamlet-under_siege-rand-39, Khongorzul Ongut (the citizen militia; iron, under a siege); r2r-metropolis-18, Katla Finsson (the banking district; precious metals); r2r-metropolis-50, Lasair Brennan (the citadel) |
  | long | Open a lasting way to bring {resource} in for the work at {house}. | r2r-village-8, Rashid Besud (the citizen militia; iron); r2r-town-9, Grettir Kolbeinsson (the carpenters; timber); r2r-town-23, Taghrid ibn Ali (the citadel) |
  | long | Win those who govern here over to bringing {resource} in for the work at {house}. | bar0-town-occupied-rand-40, Varun Mukherjee (the docks; timber); r2s-insurgency-metropolis-2 and r2s-slave_revolt-metropolis-0 (the banking district; precious metals) |

- **Proof (in my tree).** Over the 900: cards whose SUPPLY family holds fewer than two admitted lines, 93 → **0** in each
  vantage. The guard block (cells and slots; five such cards, two under a siege, hold two admitted lines a vantage; a want
  line dealt on two cards of the 900; NEGATIVE: no want line beside a met dependency, over every card of the guard's towns)
  green; red at the base (no cell). `goalFamilies`, `goals`, `goalChainWords`, `goalCharterRefused` and `faultsNeed` green.
- **Declared moves (re-measured with the patch's final words, applied and reverted in my tree).** Field family: the cards' goals (`npcs[].goal` short, long and
  intent) on the NPCs tab, the summary, the PDF and the journal. Towns moving: the thirty 1, the 150 3, the 720 37 (82
  cards: the cards that now draw a want line, and cards whose draw moved because a held text moved). **13 of the 525** move
  by the golden's own `hashFor` (town|… desert, city|… mountain rows among them). Stored figures it would move: the golden
  master (already red at the base), `goalFamilies.test.js`'s §6.6 count (SUPPLY 48 → 52, 524 → 528: in the patch), the
  estate's file count (no new file: unchanged).

## 3 · Item 3: CL22's two lopsided pools, measured; nothing written

Measured on the dominance arm's own corpus (prefix `quarrel`, 2,050 births, the ledger read as `pool-dominance.mjs`
reads it), at the base tree's generator (item 1 touches neither pool).

**`ledger:institutionDescVariants:DESC_LATE_SIBLINGS` (top1 0.8110 over 2,550 draws in 1,226 towns; line 0 2,068, line 1
482). THE SHAPE OF THE TABLE: write nothing.** The table is 38 sibling sets of two (an original house description and its
twin), resolved DRAW-FREE (`drawDeclared.js :: resolveSibling`: the original where admitted, else its twin); the ledger's
line id is the member's index, so "line 0" is 38 different originals and "line 1" 38 different twins. No set's draw can
be widened: a third member would print only where both others are refused. The originals carry what the twins deny
(of the 2,068 originals printed: 1,311 declare `no crisis: under_siege`, 306 `no route: isolated`, 268 no silk or spice
needed and not brought in, and so on); the twins print exactly where those fail. The rise from 0.6364 is the
table growing (29 keys at CL22's measure, 38 now), each new set's original being most towns' line.

**`ledger:npcData:STRESS_ECONOMIC_EFFECTS.gov_econ_dependence` (top5 0.7429 over 599 draws in 219 towns; top1 0.1636).
THE SHAPE OF ITS DECLARATIONS, NOT A SHORT POOL: write nothing; one corner named.** The pool is the eight (description,
tension) pairs of Financial Dependence. Shares: line 7 0.164, 0 0.155, 5 0.154, 1 0.150, 2 0.120, 4 0.120, 6 0.085, 3
0.052. No line dominates; the five-line share sits high because two lines are true of fewer pairs: line 3 (`no seat
held`, BAR6-PEOPLE 10d-seat: 31 draws, against 70 to 84 for its neighbours) and line 6 (a bank and a ruling body: 51).
With line 3 at its neighbours' rate the five-line share would read about 0.69 (the old ceiling 0.6662). **The corner:** where a lord
rules (no ruling body; 53 of the 599 draws) the pool admits four lines (0, 1, 5, 7); in four towns of the corpus with five
to eight such ties those four repeat (quarrel-city-64, -city-261, -metropolis-103, -metropolis-127; 9 repeat draws; 2 more
in two ruling-body towns). Not written: a line added to this pool changes `size`, so `(base + used) % size` re-deals
EVERY tie of the archetype in every town, and a tension line must be paired with a description line; that is a wide move
for nine repeats. Named for the chair as variety owed.

## 4 · The net (base b014a7bf3 in a worktree of its own; tip f3b728bb0, the last code commit; each gate alone through `sh scripts/gate-tail.sh`; reds compared BY MESSAGE)

| gate | base | tip |
|---|---|---|
| `typecheck:domain:strict` | 0 | 0 |
| `typecheck:ratchet` | 0 | 0 |
| `npx eslint` (my changed JS files) | — | 0 errors |
| `tests/architecture` | green | green |
| `tests/lint` (JSON) | 31 reds | 34: the base's 31, seven of them with a count my lines move (section 5), and 3 new, each a stored figure or a walker's reading (section 5): `factLayers` POOLS, `proseCorpusBytes` GZIP, the trailing-coordinate pin. `ledgerCitationIntegrity` red at both (wants the ledger branch as a local ref) |
| `tests/joins` | 1 red (`mutationOrder`: the chain gains `assembleSettlement`) | the same, same message |
| `tests/data`, `tests/domain/facts`, `crisisBlindDossierProse` | 5 reds | the same 5; one with a count moved (the shift register's mutant, 3044 → 3052 against 3033). `crisisBlindDossierProse` red on my first tip (no setter for `prison`), cured in f3b728bb0; `declarationRegisters` red on my first tip (Unsafe v6 undeclared), cured likewise |
| the six faults guards | green | green (`faultsDesks.test.js` re-keyed by identity in f3b728bb0: FR7's planted line now at the pool's next number, v11; the Unsafe twin keeps v4 with v5 and v6 after it, and is ADMITTED, not the only line, in its three towns) |
| my guard `lastVariety.test.js` | red, 4 of 4 (the lines are not in the leaf) | green, 4 of 4; item 2's block (in the patch) green with the patch applied, red at the base |
| THE OLDER TESTS (every test file naming the defense leaf, the annex, DS-DEF-3, `defenseStateProse`, `goalFamilies`, `goals.js`'s functions: 78 listed, 65 test files run, in one JSON run a tree) | 3 files red (5 cases): `generationForkCensus` (3), `rosterFinalUnderHeldRoster`, `composeStateProse` | the same 5 by message, `composeStateProse`'s count moved 3044 → 3052 |
| the claims pin `tests/docs/enforcement-claims.test.js` | — | green over this file |

## 5 · Stored figures my work moves (named; none re-taken; for the last close)

| figure | base → tip |
|---|---|
| the state corpus's variant count (`proseComposed`, `proseWiringCensus`, `composeStateProse`, the shift register's mutant; stored 3033) | 3044 → 3052 (+8) |
| `proseEntryContradiction` loaders (stored 3501 / 2794) | 3512 → 3520, 2804 → 2812 |
| `proseWaveGate` units (stored 658) | 663 → 671 |
| the trailing-coordinate class (`proseEntryContradiction` anti-vacuity, report-only, stored 377) | 377 → 379 (two of the eight end on a plain ", and …" clause) |
| `scripts/.prose-byte-baseline.json`, `defense.generated.js` (stored 281,298 raw / 37,154 gz) | raw measured 286,547 at the tip; gzip 37,820 (outside the 1 % band, red at the tip only) |
| `factLayers.poolTable.json`: DS-DEF-3 › Very Safe and › Unsafe placed at layer 3 | they now declare `crime wave` (layer 4: Very Safe v6 `no crime wave`, Unsafe v5 `crime wave`); BAR6-DEFDESK placed Safe and Moderate at 5 for the same atom. Kept true rather than reworded to pass (R6): the placement is the close's, or a ruling's |
| `presumedThings` ARM 1 fresh hits (stored register) | 5 → 6: Moderate v10 ("With no gaol at …") read as naming a prison undeclared; it declares `no court or gaol`, which holds only where no gaol stands. The same reading the walker gives Unsafe v4 at the base (FAULTS-DESKS named it): the walker's, not reshaped |
| `sovereigntyLightingContract`'s estate file count | 3696 → 3697 (my guard) |
| the golden master (`tests/fixtures/generator-golden-master.json`; 191 of 525 already differ at the base) | item 1: 0 of 525. Item 2 (held): 13 of 525 if applied |
| the wiring census stamp | untouched: projected after a fresh census in the tree, the census restored byte-equal (the leaf committed, the census not) |

## 6 · Left by name

- **Item 2, held**: the patch `LAST-VARIETY-ITEM2-WANT.diff` waits on the chair's word on `goals.js` (section 2).
- **The lord-ruled corner of `gov_econ_dependence`** (item 3): four lines where a lord rules; nine repeat draws in four
  towns of the corpus. Not written (a line re-deals every tie of the archetype).
- **The Unsafe twin v4 prints in no town of the 900** (section 1): admitted in its three towns, out-drawn there.
- Not raised: none.
