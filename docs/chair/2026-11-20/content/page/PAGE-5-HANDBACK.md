# PAGE-5's hand-back: THE TROUBLE (kept current at every push; last written 2026-11-20 15:13 UTC by `date -u`)

Read this, then `PAGE-3-HANDBACK.md` (sections 0, 0a, 4b), `briefs/BUILDER-RULES.md`, `briefs/T1.md` (S6),
`briefs/S7.md` + `briefs/S7-FOLLOWUP.md` (sides). PAGE-5 integrates; builders (the Agent tool) build. PAGE-6 owns the
other half (L2, L4/S9, S3); no file is shared.

## 1. State

- Lane `lane/page-5-2026-11-20`, fast-forwarded to PAGE-3's final tip 79710682d (the chair, 14:06 and 14:13).
- Container: `npm ci` done; `/node_modules` in `.git/info/exclude`; ledger ref review-fixes-2026-07-08 fetched.

## 2. Units

| unit | state | commit | next |
|---|---|---|---|
| 1 sides table | MERGED: 2f6b6a1db read once against 13:22/13:50 (all six changes + case arm verbatim); red re-run "6 failed / 9 passed (15)" (five new arms + the S7-TABLE arm: the table was regenerated in the same commit; the builder's 5 was with the old table), green 15/15; merge c5da1cfb3; lighting census refrozen 12e2fd25b (titles 31247->31252), verified 34/34; wiring --check green (861/3054/169) | c5da1cfb3, 12e2fd25b | owed at the join: parity test with `sideArchetypes.js` (origin/lane/frame-5-2026-11-20) |
| 2 S6 | MERGED 464fc1b98 (builder's eca22cc51 on page5/s6: bar4 arm (b)'s bare negative anchored; gates: 49 importers green, ratchet 167, strict 1113, lint 0 errors; confinement 60/60 equal masked, 17/107 tensions moved). Re-run by PAGE-5: red 3 failed/11 passed (14), green 14/14. Census refrozen (3708->3709 files, 31252->31257 titles), wiring green. STORED FINGERPRINTS MOVED, SIGNED BY NONE: generatorGoldenMaster 74 of 525 (inside the 521 red at the base; equal with descriptions masked). Measure 39.9%->38.9% (`measures/page-5/s6/`). Reds not ours: ledgerCitationIntegrity (ref missing in the worktree), readerShapeResolver 258>256 (red on the base) | 464fc1b98 | done |
| 3 causes | (a) MEASURED; (b) PROPOSED 14:16; the chair's FOUR RULINGS 14:21 (section 4) applied in `measures/page-5/sim.mjs` (the tables there ARE the proposal: cause, rank, predicate); re-projection sent | | (c) crime_wave + guild_conflict lines in ONE file to the chair before any merge, then the other six; (d) `src/data/tensionCauses.js` + totality test |

## 3. Unit 3's measure (scripts and outputs: `measures/page-5/`)

- `feat.mjs` (per town: tensions + flat born-record facts), `an.mjs` (lift per kind), `in.mjs` (within-kind rates),
  `inst.mjs` (houses/powers per kind), `tx.mjs` (texts per kind), `sim.mjs` (the candidate cause tables over the real
  document, placeholder lines 2 a cause / 3 plain, `pickVariant` keyed `<seed>::cause::<kind>`; mode `priority` or `held`).
  Run: `node <script> $PWD 150 hxd priority`.
- Generator reads (historyGenerator.js :: buildHistoricalEvent): crime_wave = criminal-priority house + viability record
  (rng>.5), small tier + fence/smuggler/bandit/outlaw house, or fill (crime signal); guild_conflict = fill, guild-biased
  (rng>.7), needs guild; resource_scarcity = viability issues (rng>.4) or famine/plague stress; external_threat,
  succession_crisis, outside_debt, legitimacy_crisis = STRESS_TO_TENSION (historyPolicyData.js) or fill; great_flood = fill.
- Baseline (900 towns hxd-<size>-0..149): same-size three in a row 41.2% (city 83.1%, metropolis 81.1%), random triples
  34.1%. Projection with the proposed tables: priority 10.3% random, city 18.9%, metropolis 27.7%; hash-among-held 9.7%,
  city 20.3%, metropolis 20.9%. Tables and rates: `causes.priority.150.out.txt`.
- SURPRISE reported: great_flood stands in towns with no water about half the time (its stored text says rising water).

## 4. The chair's rulings on the causes (14:21 UTC, summarized; the message is the authority)

1. TWO RANKS: rank 1 = the trouble's own engine (a stress, a band, a past event of the kind, who holds the hall, a rival
   power, rival rings); rank 2 = a standing feature (a house, the route, the terrain). The reader takes the rank-1 causes
   that hold and picks among them by keyed hash; only if none, the same among rank 2; else plain. Each row marks its rank.
2. THE CAP BINDS THE SENTENCE: no single wording in more than about 15% of its kind's towns; where plain wordings together
   exceed 45% (great_flood) the kind gets FOUR plain wordings.
3. A cause must be a cause of the SAME trouble (craft-vs-merchant dropped). Crime adds: no kept force; the guard too few
   (the record has no size count: the nearest true fact used, unpaid volunteers or pay short/cut). Flood plain lines name
   no river and no coast.
4. HIDEABLE HOUSES: a cause naming or implying a criminal house holds only where the document in hand shows it; the data
   file's header says so for the display seat; the rows are listed for the security reader at the join (criminal power,
   rival rings, thieves' guild house, smuggling+water, underground, assassins, black market, whisper market,
   fence/outlaw/bandit).
- Re-projection (`causes.ranks.150.out.txt`): random triples 8.8%, interleaved 7.9%, city 18.2%, metropolis 24.3%, with
  THREE wordings on causes over about a quarter of their kind (listed in `sim.mjs :: WORDS`; PAGE-5's proposal to the
  chair, not yet ruled). Lines: crime_wave and guild_conflict first, in one file to the chair.

## 5. THE PROPOSAL AS RULED (the chair, 14:21 and 14:33): a successor re-runs NO measure

RULED 14:33: accepted; THREE wordings for a cause that speaks for more than about a quarter of its kind (`WORDS` below),
two for the others, plain three a kind (great_flood FOUR). "No kept force" rank 1: approved. "Unpaid or pay short": approved
ONLY by a named field: its row names `factsOf(record).orderForce.volunteers` / `.payCut` / `.pay` ('short'|'unpaid',
`guardPay.js :: guardPayOf`) — `orderForce.js :: orderForceOf`'s own fields. Trade house + luxury quarter at guild rank 2,
worded as places where trade passes outside the guild, no new party. Craft-and-merchant and a past crime wave: dropped.
HIDEABLE ROWS (into the data file's header as written; listed for the security reader at the join): criminal power, rival
rings, thieves' guild house, smuggling + water, underground, assassins, black market, whisper market, fence/outlaw/bandit.
They hold only where the document in hand shows the house.

THE ONE COMMAND: `node docs/chair/2026-11-20/content/page/measures/page-5/sim.mjs $PWD 150 hxd ranks` (900 towns
hxd-<size>-0..149; about 2 minutes). Per cause: `raw` = share of the kind's tensions where the predicate holds; `→` = share it
speaks for after the two ranks; MAX WORDING = the largest single placeholder wording's share of the kind's tensions.

```
crime_wave (231): criminal_power(r1) raw 5.2% → 4.3% · law_thin(r1) raw 14.7% → 6.5% · rival_rings(r1) raw 30.7% → 29.4% · no_force(r1) raw 13.0% → 8.2% · force_unpaid_or_cut(r1) raw 8.7% → 7.4% · old_crime_wave(r1) raw 0.0% → 0.0% · thieves_house(r2) raw 20.8% → 6.1% · contraband_water(r2) raw 24.7% → 3.0% · underground(r2) raw 29.4% → 6.9% · assassins(r2) raw 32.0% → 3.9% · black_market(r2) raw 49.4% → 10.0% · whisper_market(r2) raw 36.8% → 5.2% · outlaws_near(r2) raw 17.3% → 1.3% · plain 7.8% · MAX WORDING rival_rings:1 11.3%
guild_conflict (215): old_guild_war(r1) raw 14.0% → 10.2% · guilds_rule(r1) raw 34.0% → 29.3% · rival_power(r1) raw 32.1% → 24.7% · caravans(r2) raw 33.0% → 3.3% · ships(r2) raw 32.6% → 4.2% · crossroads(r2) raw 17.7% → 0.9% · fair(r2) raw 77.2% → 13.0% · trade_center(r2) raw 54.9% → 6.0% · luxury_quarter(r2) raw 70.7% → 7.0% · plain 1.4% · MAX WORDING guilds_rule:1 13.0%
resource_scarcity (114): famine(r1) raw 18.4% → 13.2% · sickness(r1) raw 24.6% → 21.9% · war_levy(r1) raw 26.3% → 26.3% · source_spent(r1) raw 7.0% → 3.5% · old_scarcity(r1) raw 13.2% → 8.8% · isolated(r2) raw 16.7% → 2.6% · plain 23.7% · MAX WORDING sickness:0 13.2%
external_threat (79): war(r1) raw 32.9% → 24.1% · beasts_pressing(r1) raw 24.1% → 20.3% · old_threat(r1) raw 44.3% → 29.1% · militia_only(r2) raw 21.5% → 2.5% · open_road(r2) raw 20.3% → 2.5% · beasts_frontier(r2) raw 57.0% → 12.7% · plain 8.9% · MAX WORDING beasts_pressing:0 15.2%
succession_crisis (74): void(r1) raw 37.8% → 20.3% · heir_house(r1) raw 9.5% → 5.4% · outranked(r1) raw 21.6% → 0.0% · rival_power(r1) raw 40.5% → 18.9% · contested(r1) raw 33.8% → 18.9% · old_succession(r1) raw 41.9% → 21.6% · plain 14.9% · MAX WORDING contested:1 14.9%
outside_debt (63): creditors_sit(r1) raw 44.4% → 23.8% · old_crash(r1) raw 27.0% → 14.3% · hard_up(r1) raw 22.2% → 14.3% · merchants_rule(r1) raw 20.6% → 14.3% · old_debt(r1) raw 20.6% → 6.3% · through_trade(r2) raw 27.0% → 6.3% · plain 20.6% · MAX WORDING creditors_sit:1 12.7%
great_flood (39): old_flood(r1) raw 15.4% → 15.4% · coast(r2) raw 10.3% → 5.1% · river(r2) raw 30.8% → 28.2% · plain 51.3% · MAX WORDING plain:3 20.5%
legitimacy_crisis (58): insurgency(r1) raw 32.8% → 20.7% · creed(r1) raw 15.5% → 8.6% · crisis_band(r1) raw 29.3% → 5.2% · outranked(r1) raw 24.1% → 5.2% · lord(r1) raw 20.7% → 12.1% · rival_power(r1) raw 46.6% → 29.3% · plain 19.0% · MAX WORDING insurgency:0 15.5%
BASE  same size 41.2% (thorp 8.8% hamlet 14.2% village 21.6% town 38.5% city 83.1% metropolis 81.1%); interleaved sizes 34.3%; random triples 34.1%
CAUSE same size 13.7% (thorp 2.7% hamlet 8.8% village 18.9% town 9.5% city 18.2% metropolis 24.3%); interleaved sizes 7.9%; random triples 8.8%
```

THE TABLES (cause, rank, predicate over the document `t` with `f = factsOf(t)`; helpers `inst` = a house on
`t.institutions` by name, `pw` = powers of a category on `t.powerStructure.factions`, `gov` = the governing power, `past` =
a `history.historicalEvents` entry of that template type, `stress` = `t.stress` holds that type), verbatim from `sim.mjs`:

```js
// [cause, rank (1: the trouble's own engine, this town's present or own past; 2: a standing feature), predicate]
const T = {
  crime_wave: [
    ['criminal_power', 1, (t) => pw(t, 'criminal').length > 0],
    ['law_thin', 1, (t, f) => ['critical', 'collapsed'].includes(f.lawBand)],
    ['rival_rings', 1, (t, f) => !!f.rivalRings],
    ['no_force', 1, (t, f) => !f.orderForce?.kept],
    ['force_unpaid_or_cut', 1, (t, f) => !!f.orderForce?.kept && (!!f.orderForce?.volunteers || !!f.orderForce?.payCut || ['short', 'unpaid'].includes(f.orderForce?.pay))],
    ['old_crime_wave', 1, (t) => past(t, 'crime_wave')],
    ['thieves_house', 2, (t) => inst(t, /thieves'? guild/i)],
    ['contraband_water', 2, (t, f) => inst(t, /smuggl/i) && !!f.water?.navigable],
    ['underground', 2, (t) => inst(t, /underground/i)],
    ['assassins', 2, (t) => inst(t, /assassin|contract killer/i)],
    ['black_market', 2, (t) => inst(t, /black market/i)],
    ['whisper_market', 2, (t) => inst(t, /whisper market/i)],
    ['outlaws_near', 2, (t) => inst(t, /fence|outlaw|bandit/i)],
  ],
  guild_conflict: [
    ['old_guild_war', 1, (t) => past(t, 'guild_conflict')],
    ['guilds_rule', 1, (t) => gov(t)?.category === 'economy'],
    ['rival_power', 1, (t, f) => !!f.rivalPower],
    ['caravans', 2, (t) => inst(t, /caravan/i)],
    ['ships', 2, (t) => inst(t, /docks|port facilities|harbou?r/i)],
    ['crossroads', 2, (t, f) => f.route === 'crossroads'],
    ['fair', 2, (t) => inst(t, /annual fair/i)],
    ['trade_center', 2, (t) => inst(t, /international trade center|auction house|money changers/i)],
    ['luxury_quarter', 2, (t) => inst(t, /luxury goods quarter/i)],
  ],
  resource_scarcity: [
    ['famine', 1, (t, f) => !!f.famine?.famine],
    ['sickness', 1, (t) => stress(t, 'plague_onset')],
    ['war_levy', 1, (t, f) => f.warState === 'at war' || f.warState === 'front'],
    ['source_spent', 1, (t, f) => !!f.leadingSourceSpent || !!f.failedSource],
    ['old_scarcity', 1, (t) => past(t, 'resource_scarcity')],
    ['isolated', 2, (t, f) => f.route === 'isolated'],
  ],
  external_threat: [
    ['war', 1, (t, f) => f.warState === 'at war' || f.warState === 'front' || stress(t, 'wartime')],
    ['beasts_pressing', 1, (t) => stress(t, 'monster_pressure')],
    ['old_threat', 1, (t) => past(t, 'external_threat')],
    ['militia_only', 2, (t, f) => !!f.defence?.militia && !f.defence?.garrison],
    ['open_road', 2, (t, f) => f.route === 'crossroads'],
    ['beasts_frontier', 2, (t, f) => !!f.monsterFrontier],
  ],
  succession_crisis: [
    ['void', 1, (t) => stress(t, 'succession_void')],
    ['heir_house', 1, (t, f) => f.rulerKind === 'lord'],
    ['outranked', 1, (t, f) => !!f.seatOutranked],
    ['rival_power', 1, (t, f) => !!f.rivalPower],
    ['contested', 1, (t) => /Contested/.test(t.powerStructure?.publicLegitimacy?.label || '')],
    ['old_succession', 1, (t) => past(t, 'succession_crisis')],
  ],
  outside_debt: [
    ['creditors_sit', 1, (t) => stress(t, 'indebted')],
    ['old_crash', 1, (t) => past(t, 'market_crash') || past(t, 'trade_collapse')],
    ['hard_up', 1, (t) => ['Struggling', 'Poor'].includes(t.economicState?.prosperity)],
    ['merchants_rule', 1, (t) => gov(t)?.category === 'economy'],
    ['old_debt', 1, (t) => past(t, 'outside_debt')],
    ['through_trade', 2, (t) => !!t.economicState?.isEntrepot],
  ],
  great_flood: [
    ['old_flood', 1, (t) => past(t, 'great_flood')],
    ['coast', 2, (t, f) => !!f.water?.coast],
    ['river', 2, (t, f) => !!f.water?.river],
  ],
  legitimacy_crisis: [
    ['insurgency', 1, (t) => stress(t, 'insurgency')],
    ['creed', 1, (t) => stress(t, 'religious_conversion')],
    ['crisis_band', 1, (t, f) => !!f.legitimacyCrisis],
    ['outranked', 1, (t, f) => !!f.seatOutranked],
    ['lord', 1, (t, f) => f.rulerKind === 'lord'],
    ['rival_power', 1, (t, f) => !!f.rivalPower],
  ],
};
const PLAIN = { great_flood: 4 };
const WORDS = { 'crime_wave:rival_rings': 3, 'guild_conflict:guilds_rule': 3, 'guild_conflict:rival_power': 3, 'guild_conflict:fair': 3, 'resource_scarcity:war_levy': 3, 'external_threat:old_threat': 3, 'external_threat:war': 3, 'legitimacy_crisis:rival_power': 3, 'outside_debt:creditors_sit': 3, 'great_flood:river': 3, 'succession_crisis:old_succession': 3 };
```

## 6. Lines batch 1 (crime_wave, guild_conflict): ae06f1618, UNREAD BY PAGE-5 (the chair reads every line)

`lines/CAUSES-crime_wave-guild_conflict.md` (brief `briefs/CAUSE-LINES-1.md`; dispatched 14:37, before the chair's 14:39
change; PAGE-7 uses it and writes none of its own). crime_wave 28 lines (11 causes x2, rival rings x3, plain 3);
guild_conflict 24 (6 x2, guilds_rule/rival_power/fair x3, plain 3). The builder's notes for the reader seat: (1) the house
predicates in `sim.mjs` read `t.institutions`, not the LIVE roster: the reader must test the live roster (a ruined house
would make a line false; none seen in a 300-town probe); (2) the small-place crime `.replace` is dead (its strings are not
in the stored sentence: the ruled dead branch); (3) guild_conflict's anchored sentence is guild-against-guild past tense and
prints exactly where old_guild_war holds; (4) plain lines name no house, so a hidden house may sit behind one;
(5) trade_center and luxury_quarter say trade passes outside the guild by the chair's ruling, not by a record field.
