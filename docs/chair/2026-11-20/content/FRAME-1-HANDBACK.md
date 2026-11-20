# FRAME-1 — hand-back

Written 2026-11-20T05:20Z (`date -u`). Branch `lane/frame-2026-11-20`, base `origin/lane/join-2026-11-14` at `85fccf898`; the build is commit `535511009` (this hand-back rides the commit after it). Assignment read at `lane/chair-2026-11-08` `d3981afb2`. The pre-build proposal and its measure: `FRAME-1-PROPOSAL.md` beside this file (`5c63c875c`). Every rule and dial below is vetoable by the owner.

## What was built (CF1–CF6)

- `src/domain/tension/sideArchetypes.js`: 130 side labels (29 types, 49 side lists, 147 places; the chair's 48/144 was the `factions:` line count) classed into 13 archetypes; each archetype's ladder; what each trouble touches (`TROUBLE_MATTER`: the tie kinds that speak of it, its words, its trades, its office kinds); the seven labels the generator writes over at birth (`GENERATOR_REPLACED_SIDES`, pinned to `historyGenerator.js :: substituteNames`); the dials in ONE frozen table, `FRAME_TUNING`.
- `src/domain/tension/troubleCast.js`: `sharpestTroubleOf` (highest grade the record's `severity` list admits; record order breaks a tie) and `castTroubleFrame` (derived at render; facts first, then `castHash(seed, type, side:kind)` against the rate, then the first rung the town can fill, else absent; caps: one side by office, the seat-holder on one side, nobody on two, a crisis-cast person never on a side; the authority side is cast first so the seat stands where the record puts it; a challenger or reformer is never fronted by the seat's own people). Every reason is one of `FRAME_REASONS`, filled with the person's own gender. Fails closed with no `_seed`.
- `src/domain/summary/tonightSheet.js`: `frame` on the sheet; a calm town opens on the trouble's sentence with its hooks; its people are the sides' faces (voiced as every person is); its hooks list the faces' own first, then the rest by priority, none the trouble already shows; one-want-one-home across the sides. `sideReadOf` is the one home for how a side reads. A town in crisis: unchanged (diffed).
- Renderers: `TonightSheet.jsx` (Table View, Session Mode) draws the trouble, its hooks and its sides; the PDF chapter and the Foundry journal page draw the trouble BY NAME and its sides (the sentence prints once per export, B4; pending ruling 1 below).

## The measure (CF7): 330 calm born towns, 55 a tier, seeds `frame-calm-<tier>-<i>`

Before (base): every calm sheet opened on `pressureSentence` (a two-name tie beat in 173); the seat-holder was the first person in 330/330, the senior cleric second in 220; no side of any trouble had a face.

| face of a side | before (base) | after (tip) |
| --- | --- | --- |
| seat-holder | 0 | 83 (8.4%) |
| a power's head | 0 | 41 (4.1%) |
| a force's commander | 0 | 59 (6.0%) |
| a person by a tie | 0 | 271 (27.4%) |
| a trade's master | 0 | 137 (13.8%) |
| an outsider, reached | 0 | 26 (2.6%) |
| the criminal power | 0 | 47 (4.7%) |
| absent | 990 (100%: three labels with nobody) | 326 (32.9%) |

| archetype | sides | seat-holder | a power's head | a force's commander | a person by a tie | a trade's master | an outsider, reached | the criminal power | absent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| authority | 66 | 53 | 0 | 0 | 9 | 4 | 0 | 0 | 0 |
| blamed | 25 | 0 | 0 | 0 | 6 | 2 | 0 | 0 | 17 |
| challenger | 155 | 0 | 11 | 0 | 89 | 17 | 0 | 0 | 38 |
| creditor | 3 | 0 | 0 | 0 | 2 | 0 | 1 | 0 | 0 |
| criminal | 59 | 0 | 0 | 0 | 0 | 0 | 17 | 28 | 14 |
| enforcer | 113 | 2 | 0 | 56 | 15 | 21 | 0 | 0 | 19 |
| establishment | 84 | 26 | 15 | 3 | 5 | 19 | 0 | 0 | 16 |
| faithful | 41 | 0 | 4 | 0 | 3 | 16 | 0 | 0 | 18 |
| middle | 104 | 0 | 0 | 0 | 16 | 17 | 0 | 0 | 71 |
| outsider | 14 | 0 | 0 | 0 | 0 | 0 | 8 | 1 | 5 |
| payer | 144 | 0 | 0 | 0 | 77 | 18 | 0 | 0 | 49 |
| profiteer | 88 | 2 | 0 | 0 | 24 | 5 | 0 | 18 | 39 |
| reformer | 94 | 0 | 11 | 0 | 25 | 18 | 0 | 0 | 40 |

| tier | seat-holder | a power's head | a force's commander | a person by a tie | a trade's master | an outsider, reached | the criminal power | absent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| thorp | 20 | 0 | 0 | 4 | 3 | 0 | 0 | 138 |
| hamlet | 15 | 2 | 6 | 24 | 10 | 5 | 0 | 103 |
| village | 16 | 16 | 5 | 43 | 24 | 2 | 0 | 59 |
| town | 12 | 10 | 13 | 72 | 28 | 17 | 0 | 13 |
| city | 9 | 9 | 17 | 67 | 33 | 2 | 22 | 6 |
| metropolis | 11 | 4 | 18 | 61 | 39 | 0 | 25 | 7 |

THE OWNER'S EXAMPLE, on the 637 named faces: the seat-holder 104 (16.3%), a guild's head 30 (4.7%), the garrison's commander 42 (6.6%). Towns whose three named faces are all of those three: 0 of 330; towns where none of them stands on a side: 181 of 330.

## CF3, proved born

`tests/security/frameShareVeil.test.jsx`, eight born towns (every tier; two whose frame names the criminal power): the owner's record casts a frame and its Table View prints every face's reason (liveness); the gallery read (default and DM-full share), the party link, the import and the player world export digest IDENTICALLY at the base and the tip (measured at base `85fccf898` in an archive, pinned); from every one of them the sheet composes no frame and the Table View draws none of its lines; only `tonightSheet.js` imports the cast; the PDF/Foundry variants are the DM's four (no player variant exists). Surfaces that draw the sheet: Table View, Session Mode, PDF chapter `tonightAtTheTable`, Foundry Tonight page. **Finding (pre-existing, not my file):** `OutputContainer.jsx` mounts `<TableView>` and the Overview's "Open Tonight" with no readOnly/public gate, so the gallery page and the party link can open a shared town's sheet today; the frame stays off them by the seed gate; the mount itself is the security lane's to gate.

## Three sheets, before and after (plain text, executed)

### Before (base)
```
=== Baiwan (town, seed frame-calm-town-0) ===
[What is urgent] Jong Kobayashi and Yuna Hayashi are tied by a debt not yet paid. Jong Kobayashi has begun to act like someone who considers the debt paid. Yuna Hayashi does not.
[People to voice]
  Kai Luo (Mayor · seat): Wants to answer the next move by Religious Authorities against Merchant Guilds, quickly and in public.
  Yuki Li (the dean · cleric): Wants to make sure Lang Li is not left behind by the changes in the work.
[What the players test first]
  Food: Secure. Stores: a granary, about six months of grain.
  Defence: Town walls, Town watch.
[Hooks]
  - A partner died owing them money, and the partner's heir says the debt was paid in a letter nobody can find. (Kai Luo)
  - A spy they turned is now being turned back, and feeding information in both directions. (Yuna Hayashi)
  - Both sides have changed the locks on the building, and a third party has been living in it all winter. (Town Council vs Military/Guard)

=== Nokhoisaray (city, seed frame-calm-city-0) ===
[What is urgent] Merchant oligarchy has been debating market levies for three months. The merchants have argued against every one of them, and nothing has been settled yet.
[People to voice]
  Shahrukh Jadaran (First Magnate · seat): Wants to lure one capable person away from Thieves' Guild to work for Merchant oligarchy.
  Zulzaga Budaad (the dean · cleric): Wants to call in one part of what Zanabazar Jirgin owes this season.
[What the players test first]
  Food: Secure. Stores: a granary, about nine months of grain.
  Defence: City walls and gates, Garrison, Professional city watch, Mercenary quarter, Multiple adventurers' guilds.
[Hooks]
  - Both sides have written to the same neighbour, and the letters say opposite things. (Merchant oligarchy vs Craft Guilds)
  - Bread went up twice this month, and one of the sellers says they were told to raise it. (Merchant Guilds vs Craft Guilds)
  - A good stall has been taken over by night, and its holder wants it back before market day. (Craft Guilds vs Thieves' Guild)

=== Oxteche (village, seed frame-calm-village-0) ===
[What is urgent] A dispute over field rotation and grazing rights has divided the village for most of this season.
[People to voice]
  Chan Koh (Headman · seat): Wants to find out which members of Merchant Guilds are still friendly with Craft Guilds, and why.
  Acna Ixim (the priest · cleric): Wants to show Ixquil Caan how far they have both come since the lessons ended.
[What the players test first]
  Food: Secure. No granary; about two months in household stores.
  Defence: No walls and no standing force.
[Hooks]
  - Someone has been selling cheaper and worse goods under their mark, and customers are blaming them. (Chan Koh)
  - The debt is due at the end of the month, and the man who signed for it has gone away. (Headman's Authority vs Craft Guilds)
  - What survives from that time says: the newcomers fled something, and that something has sent agents after them. (Demographic Event)

=== Dongdao (thorp, seed frame-calm-thorp-2) ===
[Active crisis] Religious Conversion. Each faith in Dongdao watches the other for an insult, and the next feast day could end in a fight. It is aimed at Chang Liu.
[People to voice]
  Chang Liu (Elder · seat): Wants to pay every hand at the shepherd collective in full and on time this season.
[What the players test first]
  Food: Secure. No granary; about a month and a half in household stores.
  Defence: No walls and no standing force.
[Hooks]
  - In the conversion, it is aimed at Chang Liu of Elder Council, who holds the seat, and the right to it is already in dispute. (Religious Conversion)
  - A regular customer has stopped coming. The reason they've been given doesn't make sense. (The High Priestess)
  - Three members crossed over in a single week, and the side they left wants to know what they were offered. (Elder Council vs Reform Congregation)
```
### After (tip)
```
=== Baiwan (town, seed frame-calm-town-0) ===
[The trouble] The common people are pressing those in charge over guild recognition and fair wages, and each dispute grows louder than the last.
  - Someone is keeping a list of who speaks loudest for the demands, and passing it to those in charge.
  - An outside hand is quietly paying for the agitation, and will want something for it.
  - A concession has been promised to the common people, and someone in authority means to break the promise.
[Its three sides]
  Those pressing their demands: No one here is named for it.
  Those in charge, who will not give way: Kai Luo (Mayor), because he holds the seat. Wants to answer the next move by Religious Authorities against Merchant Guilds, quickly and in public.
  Those waiting to see which side wins: No one here is named for it.
[What the players test first]
  Food: Secure. Stores: a granary, about six months of grain.
  Defence: Town walls, Town watch.
[Hooks]
  - A partner died owing them money, and the partner's heir says the debt was paid in a letter nobody can find. (Kai Luo)
  - A spy they turned is now being turned back, and feeding information in both directions. (Yuna Hayashi)
  - Both sides have changed the locks on the building, and a third party has been living in it all winter. (Town Council vs Military/Guard)

=== Nokhoisaray (city, seed frame-calm-city-0) ===
[The trouble] Whether one person is taking more power than anyone granted is the quarrel of the day, and every new rule is read as a step toward tyranny.
  - Someone close to authority is gathering powers no one granted, and keeps the papers that show it locked away.
  - A household that spoke out against the new rules has had its goods seized on a pretext, and wants them back.
  - Someone is paying for praise of a strong hand in the street, and stands to profit if it comes.
[Its three sides]
  Those who want a strong hand: Onggur Besud (the exchange's steward), because the trouble touches his trade. Wants to beat Thieves' Guild to the next opportunity, and win the credit for The Guard.
  Those who fear a tyrant in the making: Ergene Olqunu'ud (the scroll scribe), because the trouble touches her trade. Wants to make sure no new rule from those who govern costs the scroll scribe's desk anything this season.
  Those who will serve whoever wins: Börte Suldus (the guildmaster of thieves), because she heads the Thieves' Guild, which works outside the law. Wants to gain ground for Thieves' Guild at the expense of Merchant oligarchy before the season is out.
[What the players test first]
  Food: Secure. Stores: a granary, about nine months of grain.
  Defence: City walls and gates, Garrison, Professional city watch, Mercenary quarter, Multiple adventurers' guilds.
[Hooks]
  - Someone has been selling cheaper and worse goods under their mark, and customers are blaming them. (Onggur Besud)
  - An honest official they have never managed to buy has started asking about one of their fronts by name. (Börte Suldus)
  - Someone has been making inquiries about their past research. Not the published work, the unpublished work. (Ergene Olqunu'ud)

=== Oxteche (village, seed frame-calm-village-0) ===
[The trouble] Whether one person is taking more power than anyone granted is the quarrel of the day, and every new rule is read as a step toward tyranny.
  - Someone close to authority is gathering powers no one granted, and keeps the papers that show it locked away.
  - A household that spoke out against the new rules has had its goods seized on a pretext, and wants them back.
  - Someone is paying for praise of a strong hand in the street, and stands to profit if it comes.
[Its three sides]
  Those who want a strong hand: Chan Koh (Headman), because he heads the Headman's Authority. Wants to find out which members of Merchant Guilds are still friendly with Craft Guilds, and why.
  Those who fear a tyrant in the making: No one here is named for it.
  Those who will serve whoever wins: No one here is named for it.
[What the players test first]
  Food: Secure. No granary; about two months in household stores.
  Defence: No walls and no standing force.
[Hooks]
  - Someone has been selling cheaper and worse goods under their mark, and customers are blaming them. (Chan Koh)
  - The debt is due at the end of the month, and the man who signed for it has gone away. (Headman's Authority vs Craft Guilds)
  - What survives from that time says: the newcomers fled something, and that something has sent agents after them. (Demographic Event)

=== Dongdao (thorp, seed frame-calm-thorp-2) ===
[Active crisis] Religious Conversion. Each faith in Dongdao watches the other for an insult, and the next feast day could end in a fight. It is aimed at Chang Liu.
[People to voice]
  Chang Liu (Elder · seat): Wants to pay every hand at the shepherd collective in full and on time this season.
[What the players test first]
  Food: Secure. No granary; about a month and a half in household stores.
  Defence: No walls and no standing force.
[Hooks]
  - In the conversion, it is aimed at Chang Liu of Elder Council, who holds the seat, and the right to it is already in dispute. (Religious Conversion)
  - A regular customer has stopped coming. The reason they've been given doesn't make sense. (The High Priestess)
  - Three members crossed over in a single week, and the side they left wants to know what they were offered. (Elder Council vs Reform Congregation)

```
The town in crisis (Dongdao) is byte-identical before and after.

## Red and green

- RED FIRST: the three new files at the base archive: the two domain files fail to load (no module), the veil test 9 failed / 1 passed (no frame at base).
- GREEN at `535511009`: `tests/domain/tension` 13/13; `tests/security/frameShareVeil.test.jsx` 3/3; every existing test that reads the sheet, the cast, the PDF chapter or the journal (95 files): 978/979, the one red below; `tests/lint/mutationCoverageManifest` 10/10; `npm run typecheck:ratchet` exit 0 (167, ceiling 167); `npm run typecheck:domain:strict` exit 0; `npm run lint` exit 0.
- PLANTED CONTROLS (my files, cp backup, cmp restore): an unclassed label, a forgotten replaced side, the seed gate opened, the office cap lifted, the seat dial zeroed: each reds. Survivors recorded: the seat cap raised (equivalent at one trouble a sheet) and the authority-first order (no arm pins it).
- `tests/lint` WHOLE: 219 files; after my cures the reds are: `sovereigntyLightingContract` (the estate's test-file count 3701 → 3704, a stated figure; my three new test files), `tuningRegister` inventory (FRAME_TUNING measured, not in the inventory; CRISIS_CAST_TUNING's dependents moved: the refreeze ritual is the owner's signing), `proseWiringCensus` (the stamp's `producerIndexFiles` moves with any new src file; rows moved 0), `negativeAssertionAnchor` (`tests/build/ensurePlaywrightBrowsers.test.js:67`, PRE-EXISTING at the base, not mine), `ledgerCitationIntegrity` (environmental: needs the local ref `review-fixes-2026-07-08`; green once fetched).

## Stored figures my change moves (named, NOT re-frozen)

1. `tests/lint/sovereigntyLightingContract.walker.test.js` CENSUS.files 3701 → 3704.
2. `tests/lint`'s tuning inventory: FRAME_TUNING enters; CRISIS_CAST_TUNING's dependents gain `troubleCast.js` and `tonightSheet.js`'s new import path.
3. `docs/content/wiring-census.json` stamp (`producerIndexFiles`); no row moves.
Registered by me (rows, not figures): FRAME_TUNING as a DRAFT row in `tests/lint/.tuning-register.json`; the two guards' rationale rows in `scripts/mutation-coverage-manifest.json`; one reviewed exemption in `noLegacyFactionReaders.core.mjs` (the tension's own `factions`, its sides).

## What is left (pending the chair)

1. RULING 1 (B4): exports name the trouble instead of printing its sentence (built so; `restoredSubsections` green). Veto restores the sentence and needs B4's owner.
2. RULING 2: `tests/components/repeatOnceTonightTraditions.test.jsx` soak1k-11 pins a calm sheet's two own wants; the frame voices one there. It stays RED, untouched, until the chair says whether to re-seat its seed.
3. RULING 3: absent sides at 32.9% (truthful floor: a tie counts only where its kind speaks of the trouble). Widening a rung is a dial.
4. The three figures above, if the chair names them mine.

## Executed or plausible

Executed: every count and table above, the digests at base and tip, the planted controls, the gates. Plausible, not executed: the PDF chapter and the journal page as rendered pages (their text is covered by the existing suites, 95 files green but one; no new pixel check); that the security lane's mount gate composes with mine.

## How to re-measure (the scripts, run with node from any directory)

The pool (births 55 calm towns a tier and caches them; argv: per-tier count, output path):

```js
// Births the calm pool once and caches it (JSON), so every measure reads the same towns.
import fs from 'node:fs';
const R = '/home/user/settlement-engine/src/';
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

The measure (argv: the cached pool, and optionally a tree's src/ path to measure another commit in an archive):

```js
// CF7: over the cached calm pool, the face of every side, by kind and by archetype, and the owner's "usual three".
import fs from 'node:fs';
const R = process.argv[3] || '/home/user/settlement-engine/src/';
const { composeTonightSheet } = await import(R + 'domain/summary/tonightSheet.js');
const { rulingChainOf } = await import(R + 'domain/dossier/powerStrata.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const c = (m, k) => { m[k] = (m[k] || 0) + 1; };
const out = { towns: towns.length, frames: 0, sides: 0, kinds: {}, byArch: {}, byTier: {}, usual: { faces: 0, seat: 0, guildHead: 0, garrison: 0, townsAllThreeUsual: 0, townsNoUsual: 0 }, people: {} };
for (const { s, tier } of towns) {
  const sh = composeTonightSheet(s);
  for (const p of sh.people) c(out.people, p.why);
  if (!sh.frame) continue; out.frames++;
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

## ADDENDUM 2026-11-20T05:27Z: the chair's two rulings reached this session AFTER the build

The chair's messages of 04:15Z (the owner's correction: CF1 amended, CF9, CF10) and 04:50Z (the rulings on the proposal; (a) the explicit audience gate; (b) the count) were delivered to this session at 05:26Z, after `535511009` and the message "FRAME 535511009". **`535511009` does NOT meet them and should not land as it stands.** At the token mark; what is left, in order:

1. **CF1 amended (the frame only where the record holds a trouble of weight; a town with none keeps today's sheet byte for byte, held by a born test).** Measured now: the record's `severity` cannot be the test of weight. It is the TEMPLATE's list, so 320 of 330 calm towns admit "major" or worse and 10 admit only "minor"; that would put the frame on 97% of calm towns, which is the opposite of the owner's word. Candidates in the record's own terms, NOT measured: a conflict between powers on the record (`conflicts[]`) whose issue names the trouble's matter; a person's own hook that speaks of it (the tie rung's `words`); the tension the generator wrote first because the town's own facts called it (crime signal, neighbour, stress), which the record does not mark today. The count the owner reads first is therefore OPEN.
2. **CF9 (no drama).** The built headings "The trouble" / "Its three sides" and the reasons are level, but the opening still sits under the alarm accent, and no walker yet pins the frame's words to a closed level set.
3. **CF10 (counterparts for every kind, crises proposed where their cast is thin).** The 13 archetypes cover every tension type; the crisis side is not proposed.
4. **(a) the explicit audience gate:** `composeTonightSheet(settlement, { audience })`, today's sheet for any reader who is not the owner; the seed stays the second lock; the CF3 test to open the sheet ON the gallery page and the party link. Not built.
5. **Ruling 2:** re-seat `repeatOnceTonightTraditions` soak1k-11 to a town with no trouble of weight that still shows two own wants. Waits on item 1's definition.
6. **Ruling 3:** absent by archetype is in the measure above (the archetype table); accepted.
7. **Ruling 1:** built as approved.
