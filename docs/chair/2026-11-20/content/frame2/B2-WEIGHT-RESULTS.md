# FRAME-2 · B2 — CF11 final: the frame only where the record holds a trouble of weight (results)

Written 2026-11-20T06:50Z (`date -u`) by builder B2 of FRAME-2, on `frame2-b2` (from `70381e96a` on `lane/frame-2-2026-11-20`). The measure is taken over B1's pool: the FRAME-1 pool script, rebuilt from this tree, **tried 484, calm 330** (55 a tier), the same 330 towns that B1 measured.

## The definition as built (`src/domain/tension/troubleCast.js :: troubleOfWeight`)

- **W1, the seat under real pressure**: legitimacy below `LEGITIMACY_CUTS.contested` (30) or `LEGITIMACY_CUTS.tolerated` (45). The values come from `src/data/bandLadders.js` and are read the way the gates read them (`governanceLedger(s).legitimacyScore`). The other trigger is `coupContenders(s).incumbent.gated === false`. A tension is about W1 only by its matter: `legitimacy_crisis`, `succession_crisis`, `leadership_vacuum`, `tyranny` or `popular_uprising`, plus `corruption_scandal` where its own sides name the ruling power (see below).
- **The ungated seat ranks with below 30.** In `resolveCoupVerdict`, an ungated incumbent holds at pHold **0.08** ("the seat falls; only the heir is in question"). That is below the 0.1 floor of every gated contest, so it is the gravest reading the record has of the seat.
- **W2**: a `powerStructure.conflicts` row at intensity `high`. A tension is about it when one of its sides is one of the row's two powers. Sides and powers are compared as B1 did: lower case, with a leading "the " dropped.
- **W3**: food below Secure, a creditor power, or an `impaired` chain. Food below Secure means one of the bands `pressured`, `importDependent`, `deficit` or `famine`, read from `FOOD_SECURITY_BANDS`' own labels. A creditor power is a power whose name carries the word "creditor". This reads B1's mark; the two powers the `indebted` stress pushes are the only names in the tree that carry it. The tension types that count are `trade_collapse`, `trade_dispute`, `resource_scarcity`, `outside_debt` and `market_crash`.
- **The opening order** (`WEIGHT_GRADES`), sharpest first:
  1. legitimacy below 30, or the ungated seat;
  2. legitimacy below 45;
  3. a high conflict;
  4. food below Secure, a creditor power, or an impaired chain.

  Ties go to the record's order. `severity` is not read.
- **No new numeric constant.** The edges 30 and 45 are imported from `LEGITIMACY_CUTS`. A test pins `[contested, tolerated] = [30, 45]` and the grade at the scores 29, 30, 44, 45 and 60.

**The corruption_scandal reading.** The template's sentence is "Evidence of official corruption has surfaced but powerful figures resist investigation". The generator writes its first side, "Corrupt officials", as the governing power (`historyGenerator.js :: substituteNames`: `.replace(/Corrupt officials/g, govFaction)`). On the pool, 17 of 17 stored scandals name the governing power there. So the officials in the record are the ruling body's own. I read a scandal as being about the seat where one of its sides names the ruling power, and as not about it otherwise. On the pool this matches every stored scandal. It still guards a record whose side does not name the seat.

**Why the function lives in `troubleCast.js` and not in a new file.** It reads a tension's sides (`.factions`). The legacy-faction-reader walker's reviewed exemption for that read is keyed to `troubleCast.js` (`noLegacyFactionReaders.core.mjs`: "a tension's sides"). A new file would need a new exemption row in a lint file outside my manifest.

**`tonightSheet.js`** (the seat's ruling (a)): there is one edit, `...(frame ? { frame } : {})` in place of `frame,`, and the typedef property is now optional (`[frame]`). Without it a sheet with no frame carries `"frame":null`. That key alone kept every unframed sheet off the base digest; I measured it on `frame-calm-thorp-2`, which digests equal once that key is gone.

## The count (the first number)

| measure | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| calm towns | 55 | 55 | 55 | 55 | 55 | 55 | 330 |
| **with a trouble of weight (framed)** | 0 | 9 | 15 | 9 | 29 | 31 | 93 |
| **without (today's sheet)** | 55 | 46 | 40 | 46 | 26 | 24 | 237 |
| W1 held (seat: ungated, or legitimacy < 45) | 2 | 25 | 45 | 0 | 0 | 0 | 72 |
| W1 with a tension about it | 0 | 5 | 14 | 0 | 0 | 0 | 19 |
| W2 held (a conflicts row at intensity high) | 0 | 4 | 0 | 14 | 45 | 53 | 116 |
| W2 with a tension about it | 0 | 2 | 0 | 4 | 24 | 21 | 51 |
| W3 held (food < Secure, a creditor power, an impaired chain) | 2 | 4 | 8 | 39 | 39 | 53 | 145 |
| W3 with a tension about it | 0 | 3 | 2 | 5 | 5 | 13 | 28 |
| (cast null: must equal "without") | 55 | 46 | 40 | 46 | 26 | 24 | 237 |

"Held" counts towns where the strain stands. "With a tension about it" counts towns where at least one tension is about that strain. Three towns hold legitimacy below 30 (B1's count), but none of their tensions is about the seat, so none of them opens on W1-30. A strain alone is never weight.

## Each strain with its matched tensions, by tier

A tension is listed under every strain it is about, not only its sharpest. Each strain is read alone: the town is re-read with the other strains' causes removed.

**W1: matched tensions by type and tier** (tensions)

| type | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| succession_crisis | 0 | 2 | 7 | 0 | 0 | 0 | 9 |
| popular_uprising | 0 | 1 | 2 | 0 | 0 | 0 | 3 |
| tyranny | 0 | 1 | 2 | 0 | 0 | 0 | 3 |
| legitimacy_crisis | 0 | 0 | 3 | 0 | 0 | 0 | 3 |
| corruption_scandal | 0 | 1 | 1 | 0 | 0 | 0 | 2 |

**W2: matched tensions by type and tier** (tensions)

| type | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| crime_wave | 0 | 1 | 0 | 2 | 18 | 16 | 37 |
| succession_crisis | 0 | 1 | 0 | 1 | 4 | 2 | 8 |
| economic_disparity | 0 | 0 | 0 | 1 | 1 | 1 | 3 |
| religious_tension | 0 | 0 | 0 | 0 | 1 | 2 | 3 |
| corruption_scandal | 0 | 0 | 0 | 0 | 2 | 0 | 2 |

**W3: matched tensions by type and tier** (tensions)

| type | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| trade_dispute | 0 | 0 | 0 | 1 | 2 | 8 | 11 |
| outside_debt | 0 | 0 | 0 | 1 | 4 | 2 | 7 |
| trade_collapse | 0 | 2 | 0 | 3 | 0 | 0 | 5 |
| resource_scarcity | 0 | 1 | 1 | 0 | 0 | 3 | 5 |
| market_crash | 0 | 0 | 1 | 0 | 0 | 0 | 1 |

## The opening trouble, by type

**The opening trouble by type** (of 93 framed towns): crime_wave 37, succession_crisis 16, trade_dispute 9, trade_collapse 5, resource_scarcity 5, outside_debt 5, corruption_scandal 3, tyranny 3, legitimacy_crisis 3, religious_tension 3, popular_uprising 2, economic_disparity 2
ONE TYPE OPENS MORE THAN A THIRD: crime_wave 37 of 93 (39.8%)

**By tier**: thorp: none · hamlet: trade_collapse 2, succession_crisis 2, corruption_scandal 1, crime_wave 1, resource_scarcity 1, popular_uprising 1, tyranny 1 · village: succession_crisis 7, legitimacy_crisis 3, tyranny 2, corruption_scandal 1, resource_scarcity 1, popular_uprising 1 · town: trade_collapse 3, crime_wave 2, outside_debt 1, succession_crisis 1, trade_dispute 1, economic_disparity 1 · city: crime_wave 18, succession_crisis 4, outside_debt 3, trade_dispute 2, corruption_scandal 1, religious_tension 1 · metropolis: crime_wave 16, trade_dispute 6, resource_scarcity 3, succession_crisis 2, religious_tension 2, economic_disparity 1, outside_debt 1

**The opening strain's grade**: high-conflict 50, impaired-chain 24, legitimacy-below-45 18, seat-ungated 1

**Grade and type**: high-conflict|crime_wave 37, legitimacy-below-45|succession_crisis 9, impaired-chain|trade_dispute 9, high-conflict|succession_crisis 7, impaired-chain|trade_collapse 5, impaired-chain|resource_scarcity 5, impaired-chain|outside_debt 5, legitimacy-below-45|tyranny 3, high-conflict|religious_tension 3, legitimacy-below-45|corruption_scandal 2, legitimacy-below-45|popular_uprising 2, legitimacy-below-45|legitimacy_crisis 2, high-conflict|economic_disparity 2, seat-ungated|legitimacy_crisis 1, high-conflict|corruption_scandal 1


**Yes: one type opens more than a third of the framed towns. `crime_wave` opens 37 of 93 (39.8%): 18 cities, 16 metropolises, 2 towns and 1 hamlet.** All 37 open on a high conflict (W2). The reason: the generator writes crime_wave's first and third sides as the military power and the criminal power. Those two powers are parties to many high conflicts, and many of those conflicts are over issues that have nothing to do with crime. The rows' issues include "Blame for a costly failure last season" 6, "Stolen goods sold openly" 4, "Who commands when danger comes" 3, and 18 other issues (script `crimeAlt.mjs`).

### PROPOSAL (not built): letting the record vary the choice

1. **Varying the choice among a town's matched tensions barely moves the share.** Only 5 of the 37 crime_wave towns have another tension about a strain they hold (economic_disparity 1, corruption_scandal 1, trade_dispute 2, outside_debt 1). Even if every one of the 5 opened elsewhere, crime_wave would still open 32 of 93 (34.4%). The grade order cannot fix this, because all of those alternatives are of the same grade or lower.
2. **What does vary it is reading whether the conflict is the tension's own quarrel.** Each variant below keeps the grades and the record's order. Measured with `w2variants.mjs`, none built:
   - (a) **both** of the row's powers are sides of the tension. Framed towns go to 58; crime_wave opens 12 (20.7%).
   - (b) the row's issue or description **speaks of the tension's matter** (`TROUBLE_MATTER[type].words`, the cast's own words). Framed towns go to 51; crime_wave opens 6 (11.8%); trade_dispute opens most, with 11.

   Either variant narrows W2 to conflicts that are about the trouble. Variant (b) reads the record's own sentence for the quarrel, so I would propose it. Either one is the chair's ruling to make, because both reduce the number of framed towns.

## The CF7 face table, re-taken on the framed towns only (93 towns, 279 sides)

FRAME-1's measure script, with one change: the people count is taken after the frame test, so every figure below comes from a framed town.

- Faces by kind:
  - a person by a tie: 134
  - the criminal power: 41
  - seat-holder: 32
  - a force's commander: 22
  - a trade's master: 22
  - absent: 21 (7.5%)
  - a power's head: 4
  - an outsider, reached: 3
- Office (seat, commander, head) fills 58 of the 258 filled sides (22.5%).
- The "usual three": 255 named faces. The seat-holder is 35 of them, a guild head 11, a garrison commander 24. No town has all three of its faces from the usual three; 32 towns have none.
- People to voice on the framed sheets: 255, every one a side's face.

| archetype | faces |
|---|---|
| challenger | a person by a tie 60, a trade's master 5, absent 3, a power's head 2 |
| profiteer | a person by a tie 22, absent 9, the criminal power 7, a trade's master 1 |
| authority | seat-holder 29, a person by a tie 8, a trade's master 1 |
| enforcer | a force's commander 22, a person by a tie 13, a trade's master 2 |
| criminal | the criminal power 34, an outsider, reached 3 |
| payer | a person by a tie 18, absent 4, a trade's master 3 |
| reformer | a person by a tie 8, absent 3, a trade's master 2 |
| establishment | a trade's master 6, seat-holder 3, a person by a tie 2, a power's head 1 |
| middle | absent 2, a person by a tie 2, a trade's master 1 |
| faithful | a person by a tie 1, a power's head 1, a trade's master 1 |

| tier | faces |
|---|---|
| hamlet | absent 13, a person by a tie 6, seat-holder 5, a force's commander 1, a trade's master 1, an outsider, reached 1 |
| village | a person by a tie 23, seat-holder 12, absent 8, a trade's master 1, a power's head 1 |
| town | a person by a tie 18, a trade's master 4, an outsider, reached 2, a force's commander 1, seat-holder 1, a power's head 1 |
| city | a person by a tie 41, the criminal power 23, a force's commander 10, a trade's master 6, seat-holder 6, a power's head 1 |
| metropolis | a person by a tie 46, the criminal power 18, a force's commander 10, a trade's master 10, seat-holder 8, a power's head 1 |

## The born test and the red

`tests/domain/tension/troubleWeight.test.js` checks four things against digests pinned at `7e0c77ae2`. The pins were measured in an archive of that commit (`git archive 7e0c77ae2 | tar -x`, with `node_modules` linked; `src/generators` does not change between that commit and the tip). Each digest is the first 16 hex of the sha256 of `JSON.stringify(composeTonightSheet(s))` as composed; no key is dropped.

- **Calm towns without weight.** 24 towns, the first four of each tier that have no trouble of weight:
  - thorp 0, 1, 7, 9
  - hamlet 0, 3, 5, 6
  - village 3, 6, 8, 9
  - town 0, 2, 3, 4
  - city 1, 2, 5, 6
  - metropolis 3, 4, 6, 7

  The journal's Tonight page text is also pinned for thorp-0 and thorp-1.
- **Towns in crisis.** One per tier: thorp-2, hamlet-1, village-1, town-6, city-24 and metropolis-0. Each sheet digests byte for byte.
- **Liveness.** Each town below opens on the tension the order picks:
  - hamlet-17: `succession_crisis` #0 (legitimacy below 45)
  - hamlet-19: `corruption_scandal` #0 (legitimacy below 45, through the scandal reading)
  - village-76: `legitimacy_crisis` #0 (the ungated seat)
  - village-49: `succession_crisis` #1, over the impaired-chain `market_crash` at #0 (grade beats the record's order)
  - city-4: `corruption_scandal` #2 (a high conflict)
  - village-20: `resource_scarcity` #1 (an impaired chain)

**RED** (the test run on an archive of `70381e96a`, before any change): 4 failed of 4. The collected counts:
- calm sheets: **24 of 24** red, because the code at that commit frames every pinned town;
- journal pages: **2 of 2** red;
- crisis sheets: **6 of 6** red, because of the `"frame":null` key;
- liveness: **2 of 6** red (village-49 and city-4: the severity rank picked another tension).

The test's first form used `it.each`: 34 failed and 4 passed of 38 at the unchanged tip. **GREEN**: 4 of 4.

## The veil test's reds (recorded; not fixed, per the brief)

`tests/security/frameShareVeil.test.jsx` gives 1 failed and 2 passed. The loop stops at its first red (thorp-0, at :120).

- **:120** `own.frame` truthy (liveness). Five of its eight towns no longer cast a frame: `frame-calm-thorp-0`, `hamlet-0`, `town-0`, `city-1` and `metropolis-3`. The three that still do: `village-0` (tyranny #0, legitimacy below 45), `city-0` and `metropolis-1` (both crime_wave #0, high conflict).
- **:121** criminal side: this holds for `city-0` and `metropolis-1`.
- **:135** `expect(composeTonightSheet(shared).frame).toBe(null)` reds on every shared read of every town. A sheet with no frame now has no `frame` key, so the value is `undefined`. The repair would be `toBeUndefined()`; I have not made it.

## Gates

| gate | result |
|---|---|
| `npx vitest run tests/domain/tension` | 3 files, 22 tests, green |
| the 27 other tests that import `tonightSheet.js` or `troubleCast.js` | 164/164 green; `repeatOnceTonightTraditions` is green as it stands |
| `npm run typecheck:ratchet` | exit 0 (167, ceiling 167) |
| `npm run typecheck:domain:strict` | exit 0 (1113, ceiling 1113) |
| `npm run lint` | exit 0 (0 errors; 38 warnings, none in my files) |

`tests/lint`, run whole: the reds that remain are already red at `70381e96a` (measured in its archive):
- `proseWiringCensus`: stale stamp, 2 tests;
- `seedLoopTotality`: the veil file's loop at :111;
- `tuningRegister`: FRAME_TUNING measured but not in the inventory, and CRISIS_CAST_TUNING's dependents moved;
- `ledgerCitationIntegrity`: environmental (needs the ledger ref);
- one figure my change moves: `sovereigntyLightingContract` census `files` (3702 stated; 3705 at the tip, 3706 with my test file). I have named it and not refrozen it.

Two reds were mine and are cured: the creditor literal ("presumptionClasses", the sovereign class) and the `it.each` park debt in `sovereigntyLightingContract`.

## The scripts (run with node from the scratchpad; argv as noted)

The pool: `node pool.mjs 55 <pool.json> [src/]`. This is FRAME-1's script with the tree as its third argument. Then `node cf11weight.mjs <pool.json> <src/>`, `node cf7framed.mjs <pool.json> <src/>`, `node crimeAlt.mjs <pool.json> <src/>` and `node w2variants.mjs <pool.json> <src/>`. For the pins: `node pins.mjs <base src/> <tip src/> '<JSON list of calm seeds>'`, with the base tree from `git archive 7e0c77ae2`.


`pool.mjs`

```js
// Births the calm pool once and caches it (JSON), so every measure reads the same towns.
// The FRAME-1 pool script, with the tree's src/ as argv[4] (default: this worktree's).
import fs from 'node:fs';
const R = process.argv[4] || '/tmp/claude-0/-home-user-settlement-engine/a24e1eb5-d90d-5963-a121-dbebc78118f8/scratchpad/wt-b2/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PER = Number(process.argv[2] || 55);
const out = process.argv[3];
const towns = []; let tried = 0, crisis = [];
for (const tier of TIERS) {
  let got = 0, i = 0;
  while (got < PER) {
    const seed = `frame-calm-${tier}-${i++}`; tried++;
    const s = generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
    const st = Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : []);
    if (st.length) { if (crisis.length < 12) crisis.push(seed + '|' + tier); continue; }
    towns.push({ seed, tier, s }); got++;
  }
}
fs.writeFileSync(out, JSON.stringify({ tried, crisis, towns }));
console.log('tried', tried, 'calm', towns.length);
```

`cf11weight.mjs`

```js
// CF11 final (FRAME-2 · B2): over the cached calm pool, the towns with a trouble of weight and without, by tier; each
// strain held, and held with a tension about it, by tier, with the matched tensions' types; the opening trouble by type.
// argv: the cached pool (the FRAME-1 pool script), a tree's src/ path. Prints markdown; exits 1 if the script's own
// reading of the opening ever disagrees with troubleOfWeight's (the script re-reads every tension's strains to list them).
import fs from 'node:fs';
const R = process.argv[3];
const { troubleOfWeight, castTroubleFrame, WEIGHT_GRADES } = await import(R + 'domain/tension/troubleCast.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const c = (m, k) => { m[k] = (m[k] || 0) + 1; };
const rank = (g) => WEIGHT_GRADES.findIndex((row) => row.includes(g));
const T = Object.fromEntries(TIERS.map((t) => [t, { towns: 0, with: 0, without: 0, W1held: 0, W1: 0, W2held: 0, W2: 0, W3held: 0, W3: 0, castNull: 0 }]));
const matched = { W1: {}, W2: {}, W3: {} }, opening = {}, openingGrade = {}, openingByTier = {}, grades = {};
let disagree = 0;
for (const { tier, s } of towns) {
  const X = T[tier]; X.towns++;
  const top = troubleOfWeight(s);
  if ((castTroubleFrame(s) === null) !== (top === null)) disagree++;
  // EACH STRAIN ALONE: the town read with only that strain left standing (the others' causes read away: legitimacy 60 and
  // the incumbent gated by a large govMultiplier; no conflicts row; food Secure and no chain), then troubleOfWeight over
  // the town with ONE tension, so a tension is listed under every strain it is about, not only its sharpest.
  const ps = s.powerStructure || {}, es = s.economicState || {};
  const noSeat = { publicLegitimacy: { ...(ps.publicLegitimacy || {}), score: 60, govMultiplier: 1e6 } };
  const only = {
    W1: { ...s, powerStructure: { ...ps, conflicts: [] }, economicState: { ...es, foodSecurity: { label: 'Secure' }, activeChains: [] } },
    W2: { ...s, powerStructure: { ...ps, ...noSeat }, economicState: { ...es, foodSecurity: { label: 'Secure' }, activeChains: [] } },
    W3: { ...s, powerStructure: { ...ps, ...noSeat, conflicts: [] } },
  };
  const about = (k, t) => troubleOfWeight({ ...only[k], history: { currentTensions: [t] } })?.strain.strain === k;
  const held = {
    W1: about('W1', { type: 'succession_crisis', factions: ['x', 'y', 'z'] }),
    W2: (ps.conflicts || []).some((r) => r?.intensity === 'high' && (r.parties || []).some((p) => about('W2', { type: 'great_fire', factions: [p, 'y', 'z'] }))),
    W3: about('W3', { type: 'trade_dispute', factions: ['x', 'y', 'z'] }),
  };
  const hit = { W1: false, W2: false, W3: false };
  (s.history?.currentTensions || []).forEach((t) => {
    for (const k of ['W1', 'W2', 'W3']) if (held[k] && about(k, t)) { hit[k] = true; c(matched[k], `${tier}|${t.type}`); }
  });
  for (const k of ['W1', 'W2', 'W3']) { if (held[k]) X[`${k}held`]++; if (hit[k]) X[k]++; }
  if (top) {
    X.with++; c(opening, top.tension.type); c(openingGrade, top.strain.grade); c(grades, `${top.strain.grade}|${top.tension.type}`);
    openingByTier[tier] = openingByTier[tier] || {}; c(openingByTier[tier], top.tension.type);
  } else X.without++;
  if (castTroubleFrame(s) === null) X.castNull++;
}
const tot = (k) => TIERS.reduce((a, t) => a + T[t][k], 0);
const row = (label, k) => console.log(`| ${label} | ${TIERS.map((t) => T[t][k]).join(' | ')} | ${tot(k)} |`);
console.log(`| measure | ${TIERS.join(' | ')} | total |\n|---|${TIERS.map(() => '---:').join('|')}|---:|`);
row('calm towns', 'towns'); row('**with a trouble of weight (framed)**', 'with'); row('**without (today\'s sheet)**', 'without');
row('W1 held (seat: ungated, or legitimacy < 45)', 'W1held'); row('W1 with a tension about it', 'W1');
row('W2 held (a conflicts row at intensity high)', 'W2held'); row('W2 with a tension about it', 'W2');
row('W3 held (food < Secure, a creditor power, an impaired chain)', 'W3held'); row('W3 with a tension about it', 'W3');
row('(cast null: must equal "without")', 'castNull');
const fmt = (m) => Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ');
for (const k of ['W1', 'W2', 'W3']) {
  const byType = {};
  for (const [kk, v] of Object.entries(matched[k])) { const [tier, type] = kk.split('|'); byType[type] = byType[type] || {}; byType[type][tier] = v; }
  console.log(`\n**${k}: matched tensions by type and tier** (tensions)\n\n| type | ${TIERS.join(' | ')} | total |\n|---|${TIERS.map(() => '---:').join('|')}|---:|`);
  for (const [type, m] of Object.entries(byType).sort((a, b) => Object.values(b[1]).reduce((x, y) => x + y) - Object.values(a[1]).reduce((x, y) => x + y)))
    console.log(`| ${type} | ${TIERS.map((t) => m[t] || 0).join(' | ')} | ${Object.values(m).reduce((x, y) => x + y)} |`);
}
const framed = tot('with');
console.log(`\n**The opening trouble by type** (of ${framed} framed towns): ${fmt(opening)}`);
for (const [type, n] of Object.entries(opening)) if (n > framed / 3) console.log(`ONE TYPE OPENS MORE THAN A THIRD: ${type} ${n} of ${framed} (${(100 * n / framed).toFixed(1)}%)`);
console.log(`\n**By tier**: ${TIERS.map((t) => `${t}: ${fmt(openingByTier[t] || {}) || 'none'}`).join(' · ')}`);
console.log(`\n**The opening strain's grade**: ${fmt(openingGrade)}`);
console.log(`\n**Grade and type**: ${fmt(grades)}`);
console.log(`\ncast/weight disagreements: ${disagree}`);
process.exitCode = disagree ? 1 : 0;
```

`cf7framed.mjs`

```js
// CF7 (FRAME-1's measure script, FRAME-1-HANDBACK.md), re-taken on the FRAMED towns only: the one change is that the
// people count is taken after the frame test, so every figure is of a framed town. argv: the cached pool, a tree's src/.
import fs from 'node:fs';
const R = process.argv[3] || '/home/user/settlement-engine/src/';
const { composeTonightSheet } = await import(R + 'domain/summary/tonightSheet.js');
const { rulingChainOf } = await import(R + 'domain/dossier/powerStrata.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const c = (m, k) => { m[k] = (m[k] || 0) + 1; };
const out = { towns: towns.length, frames: 0, sides: 0, kinds: {}, byArch: {}, byTier: {}, usual: { faces: 0, seat: 0, guildHead: 0, garrison: 0, townsAllThreeUsual: 0, townsNoUsual: 0 }, people: {} };
for (const { s, tier } of towns) {
  const sh = composeTonightSheet(s);
  if (!sh.frame) continue; out.frames++;
  for (const p of sh.people) c(out.people, p.why);
  const seat = rulingChainOf(s).npc?.name;
  let usualHere = 0, namedHere = 0;
  for (const d of sh.frame.sides) {
    out.sides++;
    const npc = d.sourcePath ? s.npcs[Number(/\d+/.exec(d.sourcePath)[0])] : null;
    const k = !d.kind ? 'absent' : d.kind === 'office' ? (d.name === seat ? 'seat-holder' : /^because (?:she|he|they) command/.test(d.reason) ? "a force's commander" : "a power's head")
      : d.kind === 'tie' ? 'a person by a tie' : d.kind === 'trade' ? "a trade's master" : d.kind === 'outsider' ? 'an outsider, reached' : 'the criminal power';
    c(out.kinds, k); out.byArch[d.archetype] = out.byArch[d.archetype] || {}; c(out.byArch[d.archetype], k);
    out.byTier[tier] = out.byTier[tier] || {}; c(out.byTier[tier], k);
    if (npc) {
      namedHere++; out.usual.faces++;
      const isSeat = npc.name === seat, isGuild = /guild/i.test(`${npc.role} ${npc.title}`) && (npc.memberships || []).some((m) => m.rank === 1 && /guild/i.test(m.power)), isGarrison = /garrison commander/i.test(`${npc.role} ${npc.title}`);
      if (isSeat) out.usual.seat++; if (isGuild) out.usual.guildHead++; if (isGarrison) out.usual.garrison++;
      if (isSeat || isGuild || isGarrison) usualHere++;
    }
  }
  if (namedHere === 3 && usualHere === 3) out.usual.townsAllThreeUsual++;
  if (usualHere === 0) out.usual.townsNoUsual++;
}
console.log(JSON.stringify(out, null, 1));
```

`pins.mjs`

```js
// Pins: births each seed (the generator is the same at base and tip: no src/generators change between them) and
// digests composeTonightSheet and the journal's Tonight page at the tree argv[2] (base) and argv[3] (tip).
import crypto from 'node:crypto';
const [BASE, TIP] = process.argv.slice(2, 4);
const { generateSettlementPipeline } = await import(TIP + 'generators/generateSettlementPipeline.js');
const B = { sheet: await import(BASE + 'domain/summary/tonightSheet.js'), j: await import(BASE + 'foundry/journalPages.js'), vm: await import(BASE + 'pdf/lib/viewModel.js') };
const T = { sheet: await import(TIP + 'domain/summary/tonightSheet.js'), j: await import(TIP + 'foundry/journalPages.js'), vm: await import(TIP + 'pdf/lib/viewModel.js') };
const d = (x) => crypto.createHash('sha256').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex').slice(0, 16);
const page = (M, s) => { const p = M.j.buildJournalPages(M.vm.buildViewModel({ settlement: s }), { settlement: s }).find((x) => x.name === M.sheet.TONIGHT_COPY.title); return p ? p.markdown : ''; };
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const born = (tier, seed) => generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
const calm = JSON.parse(process.argv[4]);
const out = { calm: {}, crisis: {}, journal: {} };
let red = 0;
for (const seed of calm) {
  const tier = seed.split('-')[2]; const s = born(tier, seed);
  const b = d(B.sheet.composeTonightSheet(s)), t = d(T.sheet.composeTonightSheet(s));
  out.calm[seed] = b; if (b !== t) red++;
}
for (const seed of calm.slice(0, 2)) { const s = born(seed.split('-')[2], seed); out.journal[seed] = { base: d(page(B, s)), tip: d(page(T, s)) }; }
let cred = 0;
for (const tier of TIERS) {
  for (let i = 0; i < 200; i++) {
    const seed = `frame-calm-${tier}-${i}`; const s = born(tier, seed);
    const st = Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : []);
    if (!st.length) continue;
    const b = d(B.sheet.composeTonightSheet(s)), t = d(T.sheet.composeTonightSheet(s));
    out.crisis[seed] = b; if (b !== t) cred++;
    break;
  }
}
console.log(JSON.stringify(out, null, 1));
console.log('calm pinned', calm.length, 'differ at tip', red, '| crisis pinned', Object.keys(out.crisis).length, 'differ at tip', cred);
```

`crimeAlt.mjs`

```js
// Among the framed towns whose opening is crime_wave: their high-conflict row's issue, and whether another tension of
// the town is about a strain it holds (an alternative the choice could fall on). argv: the cached pool, a tree's src/.
import fs from 'node:fs';
const R = process.argv[3];
const { troubleOfWeight } = await import(R + 'domain/tension/troubleCast.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const c = (m, k) => { m[k] = (m[k] || 0) + 1; };
const issues = {}, pairs = {}, alt = { withAlt: 0, without: 0 }, altTypes = {};
for (const { s } of towns) {
  const top = troubleOfWeight(s); if (!top || top.tension.type !== 'crime_wave') continue;
  const row = (s.powerStructure.conflicts || []).find((r) => r.intensity === 'high' && top.strain.powers && r.parties.join('|') === top.strain.powers.join('|'));
  c(issues, row?.issue); c(pairs, [...(top.strain.powers || [])].sort().join(' vs '));
  const others = (s.history.currentTensions || []).map((t, i) => ({ t, i })).filter(({ i }) => i !== top.at)
    .filter(({ t }) => troubleOfWeight({ ...s, history: { currentTensions: [t] } }));
  if (others.length) { alt.withAlt++; for (const { t } of others) c(altTypes, t.type); } else alt.without++;
}
console.log(JSON.stringify({ issues, pairs, alt, altTypes }, null, 1));
```

`w2variants.mjs`

```js
// PROPOSAL MEASURE (not built): how many framed towns, and how many crime_wave openings, if a tension were about a high
// conflict only (a) where BOTH the row's powers are sides of it, or (b) where the row's issue speaks of the tension's
// matter (sideArchetypes.js TROUBLE_MATTER[type].words over the row's issue and desc). The choice rule otherwise as built.
import fs from 'node:fs';
const R = process.argv[3];
const { troubleOfWeight } = await import(R + 'domain/tension/troubleCast.js');
const { TROUBLE_MATTER, TROUBLE_MATTER_DEFAULT } = await import(R + 'domain/tension/sideArchetypes.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const key = (v) => String(v || '').replace(/\s+/g, ' ').trim().toLowerCase().replace(/^the\s+/, '');
for (const v of ['built', 'both', 'issue']) {
  let framed = 0, crime = 0; const types = {};
  for (const { s } of towns) {
    // keep only the conflict rows the variant admits for each tension: read per tension, then choose as built
    const ts = s.history?.currentTensions || [];
    let best = null;
    ts.forEach((t, at) => {
      const sides = (t.factions || []).map(key);
      const rows = (s.powerStructure?.conflicts || []).filter((r) => r?.intensity === 'high').filter((r) => v === 'built' ? true
        : v === 'both' ? r.parties.every((p) => sides.includes(key(p)))
          : (TROUBLE_MATTER[t.type] || TROUBLE_MATTER_DEFAULT).words.test(`${r.issue} ${r.desc}`));
      const one = troubleOfWeight({ ...s, powerStructure: { ...s.powerStructure, conflicts: rows }, history: { currentTensions: [t] } });
      if (!one) return;
      const rank = ['legitimacy-below-30', 'seat-ungated', 'legitimacy-below-45', 'high-conflict', 'food-below-secure', 'creditor-power', 'impaired-chain'].indexOf(one.strain.grade);
      const r2 = rank <= 1 ? 0 : rank === 2 ? 1 : rank === 3 ? 2 : 3;
      if (!best || r2 < best.r) best = { r: r2, type: t.type };
    });
    if (best) { framed++; types[best.type] = (types[best.type] || 0) + 1; if (best.type === 'crime_wave') crime++; }
  }
  console.log(v, 'framed', framed, 'crime_wave opens', crime, `(${(100 * crime / framed).toFixed(1)}%)`, JSON.stringify(Object.entries(types).sort((a, b) => b[1] - a[1])));
}
```

## After B9 (both powers)

Written 2026-11-20T09:25Z (`date -u`) by builder B9 of FRAME-3, on `frame3-b9` (from `4421fbf6c` on `lane/frame-3-2026-11-20`, the line merged at `e356c94f2`). The chair's ruling (W2 read as written): a high conflict gives a trouble weight only where BOTH of the row's powers are sides of the tension. The pool is the same: the FRAME-1 pool script, born at `4421fbf6c`, **tried 484, calm 330** (55 a tier); the seat's recount script (`FRAME3-CF11-RECOUNT.md`) run over it gives the seat's 56-town list byte for byte, so the pool is the seat's.

**The build** (`troubleOfWeight`): the W2 row is found with `every` in place of `some` (each of the row's two powers equals a side, as `sideKey` compares them). Nothing else changes.

### The count, with and without weight, by tier

| measure | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| calm towns | 55 | 55 | 55 | 55 | 55 | 55 | 330 |
| **with a trouble of weight (framed)** | 0 | 8 | 15 | 5 | 12 | 18 | 58 |
| **without (today's sheet)** | 55 | 47 | 40 | 50 | 43 | 37 | 272 |
| W1 held (seat: ungated, or legitimacy < 45) | 2 | 25 | 45 | 0 | 0 | 0 | 72 |
| W1 with a tension about it | 0 | 5 | 14 | 0 | 0 | 0 | 19 |
| W2 held (a conflicts row at intensity high) | 0 | 4 | 0 | 14 | 45 | 53 | 116 |
| W2 with a tension about it (both powers its sides) | 0 | 0 | 0 | 0 | 7 | 6 | 13 |
| W3 held (food < Secure, a creditor power, an impaired chain) | 2 | 4 | 8 | 39 | 39 | 53 | 145 |
| W3 with a tension about it | 0 | 3 | 2 | 5 | 5 | 13 | 28 |
| (cast null: must equal "without") | 55 | 47 | 40 | 50 | 43 | 37 | 272 |

This is the seat's count, measured independently: 58 framed; thorp 0, hamlet 8, village 15, town 5, city 12, metropolis 18. Before B9 it was 93; 35 towns lose their frame, every one in hamlet (1), town (4), city (17) or metropolis (13). Script: B2's `cf11weight.mjs` with one change to its "W2 held" probe, which read one party as a side; it now hands both parties as sides of a probe tension (`cf11weight-b9.mjs`). At the base the changed probe prints B2's table unchanged; cast and weight disagree on 0 towns.

**Town by town against the seat's list** (`listFramed.mjs`, "seed #place type grade" in the seat's notation, against the 56 rows of `FRAME3-CF11-RECOUNT.md`): the 56 towns agree in seed, place and type. Three lines differ, and none is a count difference:
- `frame-calm-hamlet-19 #0 corruption_scandal` and `frame-calm-village-10 #0 corruption_scandal` are framed here and absent from the seat's strict list. They are the two towns the seat names as the difference between its strict 56 and the lane's 58: a scandal whose sides name the ruling power (`WEIGHT_MATTER.seatWhereItNamesTheRuler`), legitimacy below 45.
- `frame-calm-village-76 #0 legitimacy_crisis` is grade 0 here and grade 1 in the seat's list. It is the same town and the same tension. The difference is the notation: the lane ranks the ungated incumbent with legitimacy below 30 (`WEIGHT_GRADES[0]`), while the seat's script gives grade 0 only to legitimacy below 30.

### Each strain with its matched tensions, by tier

A tension is listed under every strain it is about. Each strain is read alone.

**W1: matched tensions by type and tier** (tensions)

| type | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| succession_crisis | 0 | 2 | 7 | 0 | 0 | 0 | 9 |
| popular_uprising | 0 | 1 | 2 | 0 | 0 | 0 | 3 |
| tyranny | 0 | 1 | 2 | 0 | 0 | 0 | 3 |
| legitimacy_crisis | 0 | 0 | 3 | 0 | 0 | 0 | 3 |
| corruption_scandal | 0 | 1 | 1 | 0 | 0 | 0 | 2 |

**W2: matched tensions by type and tier** (tensions)

| type | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| crime_wave | 0 | 0 | 0 | 0 | 7 | 5 | 12 |
| succession_crisis | 0 | 0 | 0 | 0 | 0 | 1 | 1 |

**W3: matched tensions by type and tier** (tensions)

| type | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| trade_dispute | 0 | 0 | 0 | 1 | 2 | 8 | 11 |
| outside_debt | 0 | 0 | 0 | 1 | 4 | 2 | 7 |
| trade_collapse | 0 | 2 | 0 | 3 | 0 | 0 | 5 |
| resource_scarcity | 0 | 1 | 1 | 0 | 0 | 3 | 5 |
| market_crash | 0 | 0 | 1 | 0 | 0 | 0 | 1 |


### The opening trouble, by type

**Of 58 framed towns**: crime_wave 12, succession_crisis 10, trade_dispute 10, outside_debt 6, trade_collapse 5, resource_scarcity 5, tyranny 3, legitimacy_crisis 3, corruption_scandal 2, popular_uprising 2. No type opens more than a third. **crime_wave opens 12 of 58 (20.7%), about a fifth**, as the ruling said; before B9 it opened 37 of 93 (39.8%).

**By tier**: thorp: none · hamlet: trade_collapse 2, succession_crisis 2, corruption_scandal 1, resource_scarcity 1, popular_uprising 1, tyranny 1 · village: succession_crisis 7, legitimacy_crisis 3, tyranny 2, corruption_scandal 1, resource_scarcity 1, popular_uprising 1 · town: trade_collapse 3, outside_debt 1, trade_dispute 1 · city: crime_wave 7, outside_debt 3, trade_dispute 2 · metropolis: trade_dispute 7, crime_wave 5, resource_scarcity 3, outside_debt 2, succession_crisis 1

**The opening strain's grade**: impaired-chain 26, legitimacy-below-45 18, high-conflict 13, seat-ungated 1.

**What moved** (`diffFramed.mjs`, the base against the tip): 37 towns. 35 lose their frame. Two keep a frame on another tension: `frame-calm-metropolis-1` (crime_wave #0 → trade_dispute #2, an impaired chain) and `frame-calm-metropolis-21` (crime_wave #0 → outside_debt #2, an impaired chain). All 12 crime_wave openings that remain stand on the same row, the Military/Guard against the Thieves' Guild (`crimeAlt.mjs`): city 8, 14, 25, 33, 35, 45, 57 and metropolis 8, 19, 56, 64, 68. The rows' issues: "Blame for a costly failure last season" 3, "Stolen goods sold openly" 2, "A member held by the other side" 2, and five others once each. Only one of the 12 has another tension about a strain it holds (a trade_dispute).

### The CF7 face table, on the framed towns (58 towns, 174 sides)

B2's `cf7framed.mjs`, with one change: since B3's audience gate only the owner's sheet carries a frame, so the sheet is composed `{ audience: 'owner' }`. At the base the changed script gives B2's table unchanged (93 frames, 279 sides, the same kinds).

- Faces by kind: a person by a tie 85, seat-holder 27, absent 21 (12.1%), the criminal power 17, a trade's master 12, a force's commander 9, a power's head 3. There are no outsiders on the 58.
- Office (seat, commander, head) fills 39 of the 153 filled sides (25.5%; it was 22.5% before B9).
- The "usual three": 153 named faces. The seat-holder is 28 of them, a guild head 5, a garrison commander 10. No town has all three of its faces from the usual three; 19 towns have none.
- People to voice on the framed sheets: 153, every one a side's face.

| archetype | faces |
|---|---|
| challenger | a person by a tie 31, absent 3, a power's head 2, a trade's master 1 |
| authority | seat-holder 23, a person by a tie 10 |
| profiteer | a person by a tie 16, absent 9, the criminal power 5, a trade's master 1 |
| payer | a person by a tie 17, absent 4, a trade's master 3 |
| establishment | a trade's master 6, seat-holder 4, a person by a tie 2, a power's head 1 |
| enforcer | a force's commander 9, a person by a tie 3 |
| criminal | the criminal power 12 |
| reformer | a person by a tie 6, absent 3, a trade's master 1 |
| middle | absent 2 |

| tier | faces |
|---|---|
| hamlet | absent 13, a person by a tie 6, seat-holder 5 |
| village | a person by a tie 23, seat-holder 12, absent 8, a trade's master 1, a power's head 1 |
| town | a person by a tie 12, a trade's master 2, a power's head 1 |
| city | a person by a tie 16, the criminal power 9, a force's commander 5, a trade's master 3, seat-holder 2, a power's head 1 |
| metropolis | a person by a tie 28, seat-holder 8, the criminal power 8, a trade's master 6, a force's commander 4 |

### What was re-seated, by measuring

- **`troubleWeight.test.js`**: the red test is two towns measured on the pool. `frame-calm-hamlet-45` has one high row (Free Elder Council against the Military Party), and its crime_wave names only the Military Party. It holds no other strain, so it gets no frame and keeps today's sheet. `frame-calm-city-8` has the row Military/Guard against Thieves' Guild, and its crime_wave names both, so it opens there on W2. The liveness town `city-4` (corruption_scandal #2, which named one power) is replaced by `city-8` (crime_wave #0). Three calm towns that lose their frame now hold today's sheet in the byte-identity pins: `hamlet-45` (crime_wave), `city-0` (crime_wave) and `city-4` (corruption_scandal). They were measured in an archive of the line `e356c94f2`. Each is born there to the same record as at the tip, the line's sheet is the pin, and the tip composes it for the owner and for a stranger. The control `thorp-0` gave its existing pin again in the same run.
- **`troubleCast.test.js`**: the pool is taken by the same measure as before, the first ten calm births of each tier that frame. At the base the measure gives the old literal exactly. At the tip, town 67, city 9, 19 and 21, and metropolis 2, 6, 13, 15 and 17 drop out, and town 134, city 27, 38 and 40, and metropolis 19, 25, 31, 41 and 44 come in. The hand-built W2 fixtures now name both powers. Two new lines hold one power as a side (either one) to no weight.
- **`frameWordsLevel.test.jsx`** (in the tension gate, not named in the brief): its pool lost `city-19` and `metropolis-2`. `city-38` (crime_wave: a commander, a hook, the criminal power, the same three as city-19) and `metropolis-3` replace them, and every reason still fires.
- **`frameShareVeil.test.jsx`**: `city-0` and `city-4` lose their frame, and `metropolis-1` now opens on a trade_dispute with no criminal side. BORN takes `city-8` and `metropolis-8` in their place. They are the first crime_wave opener of each tier that births one, and every one of the 12 has the criminal power on its third side. `WITH_CRIMINAL` is `{city-8, metropolis-8}`. Their shared-read digests come from the file's own FRAME_VEIL_PRINT door, in an archive of the line `e356c94f2`. The same run gave the six kept towns their pinned digests again, and the tip holds all eight equal.

### Red and green

- **RED** (the new test, before the build): 1 failed, 1 passed of 2. `hamlet-45`: `troubleOfWeight` returned the crime_wave, not null.
- **GREEN**: `tests/domain/tension`: 4 files, 31 tests. The veil file: 6 of 6.

### Gates (each run to a file, read by its count lines)

| gate | result |
|---|---|
| `npx vitest run tests/domain/tension` | 4 files, 31 tests, green |
| `tests/security/frameShareVeil.test.jsx` | 6 of 6, green |
| the 33 test files that import `tonightSheet.js` or `troubleCast.js` (the veil file and the tension files among them) | 32 files green; 220 passed, 1 expected fail, **1 failed** (below) |
| `npm run typecheck:ratchet` | exit 0 (167, ceiling 167) |
| `npm run typecheck:domain:strict` | exit 0 (1113, ceiling 1113) |
| `npm run lint` | exit 0 (0 errors; 38 warnings, none in my files) |

**One figure my change moves, named and NOT re-seated:** `tests/domain/frame2NamesRule.test.js`, "reads every file's output (the pool is not empty)": `read.troubleCast` must be over 300. It reads **272** at the tip and **307** at the base (the file is green in an archive of `4421fbf6c`). The cause is B9. Its 120-town pool loses five frames: calm metropolis-2 and metropolis-3 (crime_wave), and crisis city-0, metropolis-0 and metropolis-9. Lowering the floor would weaken a non-vacuity assertion to fit a count, so I have not done it; the floor is the chair's to re-seat. The breach assertions over the strings that remain read green.

### The scripts

B2's scripts, with the two one-line changes named above, and these three. Run them as `node listFramed.mjs <pool.json> <src/>`, `node castPool.mjs <src/>` and `node pinsLine.mjs <line src/> <tip src/> <seed,seed,...>`.

`listFramed.mjs`

```js
// The framed towns at a tree (argv[3]) over the pool (argv[2]): "seed #at type gN" in the seat's notation
// (grade 1 seat, 2 high conflict, 3 material; 0 legitimacy < 30 or ungated); with argv[4], W2's powers and grade too.
import fs from 'node:fs';
const [POOL, R] = process.argv.slice(2, 4);
const { troubleOfWeight } = await import(R + 'domain/tension/troubleCast.js');
const { towns } = JSON.parse(fs.readFileSync(POOL, 'utf8'));
const g = { 'legitimacy-below-30': 0, 'seat-ungated': 0, 'legitimacy-below-45': 1, 'high-conflict': 2, 'food-below-secure': 3, 'creditor-power': 3, 'impaired-chain': 3 };
for (const { seed, s } of towns) {
  const w = troubleOfWeight(s);
  if (w) console.log(`${seed} #${w.at} ${w.tension.type} g${g[w.strain.grade]}${process.argv[4] ? ' ' + w.strain.grade + (w.strain.powers ? ' [' + w.strain.powers.join(' | ') + ']' : '') : ''}`);
}
```

`castPool.mjs`

```js
// troubleCast.test.js's pool: the first ten CALM births `frame-cast-<tier>-<i>` of each tier that cast a frame at the
// tree argv[2] (births at the tree argv[3], default the same). Prints the FRAMED literal and how many calm births each
// tier took to fill.
const R = process.argv[2];
const G = process.argv[3] || R;
const { generateSettlementPipeline } = await import(G + 'generators/generateSettlementPipeline.js');
const { castTroubleFrame } = await import(R + 'domain/tension/troubleCast.js');
const out = {};
for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const got = []; let calm = 0; let i = 0;
  for (; i < (tier === 'thorp' ? 40 : 200) && got.length < 10; i++) {
    const seed = `frame-cast-${tier}-${i}`;
    const s = generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
    const st = Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : []);
    if (st.length) continue;
    calm++;
    if (castTroubleFrame(s)) got.push(i);
  }
  out[tier] = got;
  console.log(tier, JSON.stringify(got), 'calm births read', calm, 'last index', i - 1);
}
```

`pinsLine.mjs`

```js
// New calm pins (FRAME-3 addendum 1): each seed born at the LINE (argv[2], an archive of e356c94f2, no frame code) and
// at the TIP (argv[3]); the sheet composed at the line is the pin; the tip's owner and stranger sheets must equal it.
import crypto from 'node:crypto';
const [LINE, TIP] = process.argv.slice(2, 4);
const seeds = process.argv[4].split(',');
const L = { gen: await import(LINE + 'generators/generateSettlementPipeline.js'), sheet: await import(LINE + 'domain/summary/tonightSheet.js') };
const T = { gen: await import(TIP + 'generators/generateSettlementPipeline.js'), sheet: await import(TIP + 'domain/summary/tonightSheet.js'), cast: await import(TIP + 'domain/tension/troubleCast.js') };
const d = (x) => crypto.createHash('sha256').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex').slice(0, 16);
for (const seed of seeds) {
  const tier = seed.split('-')[2];
  const sl = L.gen.generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
  const st = T.gen.generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
  const sameBirth = JSON.stringify(sl) === JSON.stringify(st);
  const pin = d(L.sheet.composeTonightSheet(sl));
  const owner = d(T.sheet.composeTonightSheet(st, { audience: 'owner' }));
  const stranger = d(T.sheet.composeTonightSheet(st));
  console.log(JSON.stringify({ seed, sameBirth, pin, tipOwner: owner, tipStranger: stranger, equal: pin === owner && pin === stranger, tipFrame: T.cast.castTroubleFrame(st) }));
}
```
