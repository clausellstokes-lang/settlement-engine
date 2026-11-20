# TOWN-NOUN — the first measure (PROSE-3's measuring builder, brief MEASURE-SEAT-TOWN, unit 2)

ROOT=/home/user/settlement-engine/.claude/worktrees/agent-ac99ce80789bf85d3
HEAD=9f3558f67035381fdbfa92ed1a747d3218ecd9c3 (branch `lane/prose-3-2026-11-20-measure-seat`, cut at the tip of `lane/prose-3-2026-11-20`, whose parent is the brief's commit 56ce26391)

MEASURE ONLY; no source touched. **EXECUTED** = run here (output counted or quoted); **INFERRED** = read in the code.
Two instruments: `town-noun.static.mjs` (plain node over the six corpus leaves and the kernel's own pass) and the 900
births of `seat-town.census.mjs` (the same run as SEAT-SAID: `hxd-<size>-<0..149>`, `Tests 300 passed (300)` ×3, exit 0),
which keeps every stored `publicProse.blocks` string holding "town" (the shared page's surface, searched by CONTAINMENT).

## 1. THE COUNT — EXECUTED

Command: `node town-noun.static.mjs <ROOT> <out.json>` → `{"variants":3054,"withWholeTown":882,"counted":876,
"byFile":{"defense":258,"economy":170,"general":156,"power":83,"stressors":63,"warFaith":146},"notMoved":6,"apart":30}`.

**How a use was counted "of the place"**: every whole word `town` / `Town` / `town's` in a variant's text, classed by the
kernel's OWN pass (`stateProseKernel.js :: speakTierNoun`, run at `village` and at `city`) and its kept list
(`TIER_NOUN_KEPT` via `tierNounKeptSpans`): **counted** = the pass speaks it (a definite, demonstrative, indefinite or
measured-modifier reference to this settlement); **kept** = a `TIER_NOUN_KEPT` phrase (a comparison, an idiom, a pair);
**residual** = neither. Residual: **0** occurrences (every whole-word `town` in the six leaves is either spoken or kept).

| file | wordings counted | pools | blocks (wordings) |
|---|---|---|---|
| defense.generated.js | 258 | 134 | DS-DEF-1 19 · DEF-2 53 · DEF-3 19 · DEF-4 16 · DEF-5 30 · DEF-6 25 · DEF-7 14 · DEF-8 6 · DEF-9 11 · DEF-10 32 · DEF-11 15 · DEF-12 18 |
| economy.generated.js | 170 | 96 | DS-ECO-1 6 · ECO-2 12 · ECO-3 9 · ECO-4 3 · ECO-5 4 · ECO-6 7 · ECO-7 2 · ECO-8 20 · ECO-9 23 · ECO-10 12 · ECO-11 38 · ECO-12 20 · SUP-1 8 · SUP-2 1 · SUP-3 5 |
| general.generated.js | 156 | 108 | DS-GEN-1 12 · GEN-2 3 · GEN-3 20 · GEN-5 6 · GEN-6 10 · GEN-7 14 · GEN-9 12 · GEN-10 1 · GEN-11 8 · GEN-12 6 · GEN-13 13 · GEN-14 2 · GEN-15 3 · GEN-16 10 · GEN-17 2 · GEN-18 3 · POP-1 15 · POP-2 8 · POP-3 2 · REL-1 2 · HK-1 4 |
| power.generated.js | 83 | 51 | DS-POW-1 6 · POW-2 12 · POW-3 3 · POW-4 15 · POW-5 21 · POW-6 13 · POW-7 13 |
| stressors.generated.js | 63 | 42 | DS-STR-1 28 · STR-2 14 · CND-1 21 |
| warFaith.generated.js | 146 | 98 | DS-WAR-1 36 · WAR-2 22 · WAR-4 3 · WAR-5 48 · FTH-1 16 · FTH-3 17 · FTH-4 4 |
| **all** | **876** | **529** | of 3,054 variants |

**Every counted wording, by file, block, pool, vid and line, with its eligible sizes: `town-count.tsv`** (876 rows, ROOT and
HEAD at its head). The sizes the marks make each pool eligible at (the vocabulary's own reader,
`factVocabulary.js :: atomHolds` over `{ tier }`, on each variant's `tier:` marks): **865 of 876 at every size**; 9 at
`village, town, city, metropolis` (`tier: ≥ village` / `>= village`); 2 at `town, city, metropolis`; 1 also carries a
`population:` mark; 31 are `dm-only`.

**Listed apart, not dropped** (whole words that are not `town`/`town's`, 30): `towns` 13, `towns'` 3 (other places —
"other towns' goods", "both towns' prices"), `townsfolk` 9, `townspeople` 5 (the people, not the place's noun). **No**
`downtown`, `townsman`, proper name, "town hall", "town watch" or any other institution compound occurs (0). **Kept, never
moved** (6 wordings): `edge of town` ×2 (DS-DEF-3 monster threat v2; DS-POP-1 growth v1), `a comfortable town`
(DS-GEN-3 Pressured v2), `neither town` ×3 (DS-REL-1 allied v1, patron v3; DS-WAR-2 sovereignty·honored v3); and inside one
counted wording a kept comparison stays: DS-POW-5 `economicBase: trade_hub` v2 "…the way a farming town watches the sky".

## 2. WHERE THE SPEAK PASS RUNS — INFERRED (read), with the census's confirmation

The pass is applied at ONE place, on the finished unit, and only when the caller's bag carries a noun:
`src/domain/display/stateProse/composeStateProse.js :: composeStateProse` — `const tierNoun = typeof options.tierNoun ===
'string' ? options.tierNoun : '';` (:855) … `text: speakTierNoun(text, tierNoun),` (:906). So each block speaks the noun
exactly where its desk reader puts `tierNoun` in the bag:

| block (leaf) | desk reader :: the bag | its callers pass the tier? | spoken |
|---|---|---|---|
| defense | `defenseDeskRead.js :: defenseDeskRead` :75 `tierNoun: tierNounFor(options.tier)` | composer `defense:*` `tier: s?.tier`; tab yes | yes |
| economy | `economyDeskRead.js` :153 `tierNoun: options.tierNoun ?? tierNounFor(options.tier)` | composer `economy:*` `tier: s?.tier` | yes |
| power | `powerDeskRead.js :: powerDeskRead` :74 `tierNoun: tierNounFor(s.tier)` (from the record) | always | yes |
| stressors | `stressorsDeskRead.js` :78 `tierNoun: tierNounFor(options.tier)` | composer `stressors:overview` `tier: s?.tier` | yes |
| warFaith | `tabs/WarFaithDesk.jsx :: warFaithDeskRungs` :123 `tierNoun: tierNounFor(settlement?.tier)` | always | yes |
| general | `generalDeskRead.js :: generalDeskLines` :332 `tierNoun: options.tierNoun ?? tierNounFor(options.tier)` | per desk, below | per desk |
| general › overview (DS-GEN-2/5/6/7/12/13/17, DS-POP-3, DS-REL-2) | same | **NO**: `tabs/OverviewTab.jsx` :179-181 and `publicProseCompose.js` :65-68 (`// The Overview states no tier, exactly as OverviewTab's call does.`) | **NO** |
| general › history (DS-GEN-9/14/16) | same | yes: `HistoryTab.jsx` :174, composer :69 | yes |
| general › viability, economics, steadings | same | yes: `ViabilityTab.jsx` :70, `EconomicsTab.jsx` :326, `SteadingsSection.jsx` :53, composer :70-71 | yes |
| (the printed dossier) | `stateProse/printProse.js` :336 `tierNoun: tierNounFor(r.tier)` for every desk | yes | yes |

The Overview renders the desk's lines as returned: `OverviewTab.jsx` calls neither `weaveBlock` nor `speakTierNoun` (grep:
none), so there is no render-time backstop on that tab.

**Census (EXECUTED)**: over the 750 non-town births, a stored string with an unspoken, unkept `town` appears at ONE site
only, `general:overview.siteLines[]` — thorp 146 of 150 places, hamlet 140, village 103, city 106, metropolis 105 — and the
wordings are all DS-GEN-13: NO-MARKET v3 ×386, WAREHOUSES v2 ×81, WAREHOUSES v3 ×72, COMMERCE: a bank v1 ×62, ENTREPOT v1
×45, COMMERCE: a merchant guild, no bank v2 ×9, MARKET-OPEN v5 ×4, COMMERCE: a market, no guild v2 ×2, MARKET-NARROW v1 ×1.
No other site stored one.

**Why the two named lines escape**:
- "…what trade the town does is done house to house." is DS-GEN-13 › NO-MARKET v3, drawn at `overview.market`
  (`generalStateProse.js` :2159) → `siteLines` — the Overview group, whose two callers pass no tier, so the bag's
  `tierNoun` is null and :855 makes it `''` → identity. Printed unspoken at thorp 146, hamlet 139, village 101 (EXECUTED).
- "{settlement} still knows why it was first built, and the town has grown well past that since." is DS-GEN-14 ›
  FOUNDED-OLD v2, drawn at `history.founded` (:2212) — the History group, whose callers DO pass the tier. **On this tree it
  does not escape on the shared page**: it was stored with "the town" on 29 places, all of them towns, and on no other size
  (EXECUTED). The chair's thorp-of-21 and metropolis-of-75,000 sighting must come through a caller that passes no tier
  (e.g. a renderer that calls the desk or `generalStateProse` directly, as the recorder `scripts/prose-rate-corpus.mjs ::
  deskReturns` does, which states no noun on purpose) — INFERRED; the rehearsal's renderer was not available to check.

## 3. WHAT `speakTierNoun` DOES — EXECUTED (all 876 wordings × six sizes; outputs in the static JSON)

The two named lines:

| size | DS-GEN-13 › NO-MARKET v3 | DS-GEN-14 › FOUNDED-OLD v2 |
|---|---|---|
| thorp | …what trade the thorp does is done house to house. | …and the thorp has grown well past that since. |
| hamlet | …what trade the hamlet does is done house to house. | …and the hamlet has grown well past that since. |
| village | …what trade the village does is done house to house. | …and the village has grown well past that since. |
| town | …what trade the town does is done house to house. (identity) | …and the town has grown well past that since. (identity) |
| city | …what trade the city does is done house to house. | …and the city has grown well past that since. |
| metropolis | …what trade the metropolis does is done house to house. | …and the metropolis has grown well past that since. |

**Outputs that may not be good English** (rule-flagged over 876 × 5 non-town sizes; the rules: `an` before a consonant
noun, `a` before a vowel, a plural noun made, `town` left beside the spoken noun, `metropolis's`, the noun twice):

| flag | wordings | read |
|---|---|---|
| article (`an thorp`, `a` + vowel) | **0** | the pass agrees the article itself (`a hamlet`, never `an hamlet`; kernel :819-823) |
| plural made | **0** | `towns` never moves |
| `metropolis's` | 170 | correct English possessive; listed for the eye (e.g. DS-DEF-2 "The metropolis's plan for an army is to not be interesting to one…") |
| the noun twice in one line | 52 | inherited: the same lines say "the town … the town" at the town size (e.g. DS-DEF-2 Economic Survival STRONG v4 "The famine is costing the thorp dearly, and the thorp is paying…") |
| `town` left beside the noun | 1 | DS-POW-5 trade_hub v2: "What frightens the thorp is a route turning elsewhere, and {settlement} watches the {route} the way a farming town watches the sky." (a kept comparison; reads correctly) |

Sense, not grammar, is the residual (INFERRED, read): "the thorp has grown well past that since" on a thorp of 20.

## 4. PROPOSE — the smallest change (no code written)

**Two lines, one per caller of the Overview group**, so the screen and the shared page keep printing the same words
(`tests/components/publicProseEquality.test.jsx` holds the two equal; the composer's rule is "exactly as OverviewTab's
call does"):

- `src/components/new/tabs/OverviewTab.jsx :: OverviewTab` (the `overviewDesk` memo, :179-181): add `tier: r?.tier,` to the
  `generalDeskLines(r, { … })` bag.
- `src/components/new/publicProseCompose.js :: PUBLIC_PROSE_SITES` (`'general:overview'`, :65-68): add `tier: s?.tier,`
  (and the comment above it, "The Overview states no tier", becomes false and goes).

Not the one-line alternative in `generalDeskLines` (`tierNounFor(options.tier ?? r.tier)`): the reader's rule is
"FORWARDED, NEVER DERIVED" (`economyDeskRead.js` :142-153 states why: the manifest recorder must get the corpus's own
words), and it would speak for the recorder too (INFERRED).

- **At the town size: nothing changes** — `speakTierNoun` returns the line by identity when the noun is `town`
  (kernel :782; EXECUTED: the town column above is identical).
- **Stored strings: NOT "new births only"** (the brief's expectation does not hold on this tree). `publicProse` is not
  written at birth: it is composed at every cloud SAVE, from the record being written (`src/lib/saves.js ::
  publicProseForRow` :283-296, "composed owner-side from the record being written"). So the Overview screen changes for
  every non-town place on its next render, old or new; the stored `publicProse.blocks['general:overview']` changes at the
  NEXT SAVE of any place, old or new; a saved place keeps its stored sentence only until it is saved again (INFERRED).
- **Fingerprints** (INFERRED, not run): the dossier-prose manifest golden (`tests/fixtures/dossier-prose-manifest-golden.json`
  via `tests/helpers/dossierManifest.js` → `scripts/prose-rate-corpus.mjs :: deskReturns`, which calls the desk with no
  noun) does not move; the generator golden master (`tests/fixtures/generator-golden-master.json`) does not move
  (generation untouched; `publicProse` is a save-time projection); the corpus registers that pin template texts
  (`tests/lint/presumedThings.widened.register.json`, `tests/lint/presumptionClasses.register.json`,
  `tests/domain/corpusEcoTailGuards.test.js` :192) do not move (no corpus byte changes). A two-tree proof would show
  STRING differences only, in the Overview group's lines at the five non-town sizes, and 0 non-string differences; a test
  that pins an Overview sentence with "the town" on a non-town record would move (candidates: `tests/ui/generalDeskTabFlow.test.js`,
  `tests/components/publicProseEquality.test.jsx`). None of this was run (measure first).

## 5. BEFORE — six places, one a size, each printing a counted line (EXECUTED; the stored string, its surface)

Surface: `publicProse.blocks['general:overview'].siteLines[i]` (the Overview tab's site lines, as the shared page stores
them). "After" is `speakTierNoun(before, size)` run here, what the proposed change would print.

| size | seed | place (pop.) | surface | BEFORE (printed) | after the change |
|---|---|---|---|---|---|
| thorp | hxd-thorp-0 | Rossleigh (20) | siteLines[0] | No market or fair stands in Rossleigh: what trade the town does is done house to house. | …what trade the thorp does… |
| hamlet | hxd-hamlet-3 | Breitwiese (39) | siteLines[0] | No market or fair stands in Breitwiese: what trade the town does is done house to house. | …what trade the hamlet does… |
| village | hxd-village-0 | Dobroki (366) | siteLines[0] | No market or fair stands in Dobroki: what trade the town does is done house to house. | …what trade the village does… |
| town | hxd-town-0 | Petenmul (790) | siteLines[1] | Petenmul's merchant guild sets the terms of trade and its members carry the town's dealings outward. | unchanged (identity) |
| city | hxd-city-0 | Petenhuitz (5,848) | siteLines[2] | A merchant at Petenhuitz can store a cargo in the town's warehouses and sell it when the price suits. | …in the city's warehouses… |
| metropolis | hxd-metropolis-0 | Shangjin (395,885) | siteLines[2] | A merchant at Shangjin can store a cargo in the town's warehouses and sell it when the price suits. | …in the metropolis's warehouses… |

## Files

`town-noun.static.mjs` (the count and the six-size outputs), `town-count.tsv` (the 876 wordings), and the shared census
files listed in `SEAT-SAID-MEASURE.md` (`seat-town.census.mjs`, `vitest.seat-town.config.mjs`, `run-seat-town.sh`,
`analyze-seat-town.mjs`).
