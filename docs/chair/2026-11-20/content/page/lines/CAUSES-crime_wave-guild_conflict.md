<!-- PAGE-7, from PAGE-5's ae06f1618 with the chair's six rewordings of 15:18 UTC applied verbatim; old_crime_wave dropped; the 15:18 notes ruled: live roster for every house test, no custom house matched by name; hideable adds law_thin, no_force, force_unpaid_or_cut, guilds_rule, rival_power. -->
# CAUSE LINES, BATCH 1: crime_wave and guild_conflict (written 2026-11-20 14:43 UTC by PAGE-5's builder, brief `briefs/CAUSE-LINES-1.md`)

The causes, ranks, predicates and rates are the chair's rulings of 14:21 and 14:33 (`PAGE-5-HANDBACK.md` section 5); the
rates are its `causes.ranks.150.out.txt` (900 towns `hxd-<size>-0..149`), `raw → share`: the share of the kind's
tensions where the predicate holds, then the share the cause speaks for after the two ranks. This file holds WORDS only:
the display seat builds the reader, and the stored description is never changed. VETOABLE wording (the owner's).

**HIDEABLE ROWS (for the data file's header, as ruled; listed for the security reader at the join).** A cause naming or
implying a criminal house holds ONLY where the document in hand shows the house: here `criminal_power`, `rival_rings`,
`thieves_house`, `contraband_water`, `underground`, `assassins`, `black_market`, `whisper_market`, `outlaws_near`.

**Two readings the reader must keep (noticed while wording; not ruled here).** (1) Every house predicate below
(`inst(t, re)` in `sim.mjs`) reads the RAW roster `t.institutions`, not the live one (`institutionRoster.js ::
liveInstitutions`); each line is worded for a STANDING house, so a house that is ruined, removed, destroyed or a remnant
would make it false. None was found in a 300-town probe (`hxd-<size>-0..49`), but the reader should test the live
roster. (2) Each house regex is worded for every catalogue name it can match (listed per row), read from
`src/data/institutionalCatalog.js`; a custom house name that matches a regex is not covered.

---

## crime_wave

### Its stored sentence today

The tension's description is `historyGenerator.js :: buildHistoricalEvent`'s, after `tensionByMemory` (the memory table),
`sizedHistoryText` (no sibling is declared for either sentence), `substituteNames` (no name token in either sentence) and
`apartFromOwnEvent`:

- **Unanchored** (the timeline holds no `crime_wave` event: `historyData.js`, `crime_wave.byMemory.unanchored`): "Crime is
  rising faster than those in charge can answer it, and some talk of taking the law into their own hands". Every
  crime_wave tension of the 300-town probe (77 of 77) prints this.
- **Base** (`HISTORICAL_EVENTS_DATA`, `crime_wave.description`; reached only where the timeline holds its own event, at
  any age, since the row has no `dated` form): "A surge in criminal activity overwhelmed the authorities; vigilantes began
  to form". Where that event printed this very sentence, `apartFromOwnEvent` takes the first variant that differs
  (`historyDescVariants.js`): "A wave of crime outpaced the guards, and citizens started taking justice into their own
  hands". The timeline held no crime_wave event in the 900 towns (`old_crime_wave` raw 0.0%).
- **Dated**: none declared (`byMemory` holds `unanchored` only), so an event older than 80 years keeps the base.
- **Small-place variant** (`buildHistoricalEvent`, thorp, hamlet or village with a fence, smuggling, bandit or outlaw
  house and no primary stress): `.replace('overwhelms authorities', 'circulates openly').replace('vigilantes are forming',
  'and there is no authority to stop it')`. Neither phrase occurs in the base sentence, so both replaces change nothing;
  the description still equals the template's own, so `tensionByMemory` puts the unanchored words in its place. Small
  places print the unanchored sentence above (12 of 12 in the probe).

### Causes, in the ruled order

**criminal_power** · rank 1 · a power of category `criminal` stands on the power list, at any standing (Minor and
Suppressed included) (`t.powerStructure.factions[].category`) · raw 5.2% → 4.3% · HIDEABLE
1. Crime is rising, and a criminal power is counted among the powers of this place.
2. The powers of this place include a criminal one, and crime is rising.

**law_thin** · rank 1 · the law's band on the Foundations row is Critical or Collapsed (`factsOf(t).lawBand`,
`lawBand.js :: lawBandOf`) · raw 14.7% → 6.5%
1. Crime is rising, and the law here is too weak to hold it back.
2. The law in this place has broken down or come close to it, and crime is rising.

**rival_rings** · rank 1 · rival rings stand: two criminal powers that do not govern, or the roster's "Multiple criminal
factions", and no one organisation rules the trade (`factsOf(t).rivalRings`, `rivalRings.js :: rivalRingsStand`) ·
raw 30.7% → 29.4% · THREE wordings · HIDEABLE
1. Crime is rising as rival rings work this place and no one of them rules the rest.
2. More than one criminal crew operates here, none master of the others, and crime is rising.
3. With rival rings at odds and no single organisation over them, crime here is rising.

**no_force** · rank 1 · no garrison, watch or militia stands on the live roster (`!factsOf(t).orderForce.kept`,
`orderForce.js :: orderForceOf`; a hired company is not counted, so no line says the place has no force at all) ·
raw 13.0% → 8.2%
1. Crime is rising, and the place keeps no garrison, watch or militia to answer it.
2. With no watch, no militia and no garrison of its own, this place sees crime rising.

**force_unpaid_or_cut** · rank 1 · a force is kept AND it is unpaid volunteers (`orderForce.volunteers`), or the pay of a
person under arms is cut (`orderForce.payCut`), or its pay is short or unpaid (`orderForce.pay` ∈ `'short'`, `'unpaid'`,
`guardPay.js :: guardPayOf`) · raw 8.7% → 7.4%
1. Crime is rising, and those who keep order here serve unpaid, or on pay that is short or has been cut.
2. The force that keeps order goes unpaid, or its pay falls short or has been cut, and crime is rising.

**old_crime_wave** · rank 1 · the timeline holds a `crime_wave` event · raw 0.0% → 0.0% · DROPPED by the chair's ruling of
14:33 ("a past crime wave: dropped"). No lines.

**thieves_house** · rank 2 · a house named /thieves'? guild/ ("Thieves' guild chapter", "Thieves' guild (powerful)") ·
raw 20.8% → 6.1% · HIDEABLE
1. Crime is rising, and a thieves' guild works out of this place.
2. A thieves' guild has a footing here, and crime is rising.

**contraband_water** · rank 2 · a house named /smuggl/ ("Smuggling waypoint", "Smuggling operation", "Smuggling
network") AND navigable water (`factsOf(t).water.navigable`); both are said, nothing joins them · raw 24.7% → 3.0% ·
HIDEABLE
1. Crime is rising here, where smuggling goes on and boats can come and go by water.
2. Smugglers ply their trade here, boats can reach the place by water, and crime is rising.

**underground** · rank 2 · a house named /underground/ ("Underground network": dug smuggling tunnels; "Underground city":
tunnels and catacombs used as a criminal sanctuary) · raw 29.4% → 6.9% · HIDEABLE
1. Crime is rising, and tunnels beneath the place give it somewhere to hide.
2. Those outside the law have tunnels beneath this place, and crime is rising.

**assassins** · rank 2 · a house named /assassin|contract killer/ ("Assassins' guild", "Contract killer") ·
raw 32.0% → 3.9% · HIDEABLE
1. Crime is rising, and killing can be bought here.
2. In this place a killer can be hired, and crime is rising.

**black_market** · rank 2 · a house named /black market/ ("Black market", "Black market bazaar") · raw 49.4% → 10.0% ·
HIDEABLE
1. Crime is rising, and there is a black market here.
2. Illicit goods change hands at a black market in this place, and crime is rising.

**whisper_market** · rank 2 · a house named /whisper market/ ("Whisper market": brokers who buy and sell knowledge) ·
raw 36.8% → 5.2% · HIDEABLE
1. Crime is rising, and a whisper market here buys and sells what people know.
2. There is a whisper market in this place, and crime is rising.

**outlaws_near** · rank 2 · a house named /fence|outlaw|bandit/ ("Local fence", "Fence (word of mouth)", "Outlaw
shelter", "Bandit affiliate") · raw 17.3% → 1.3% · HIDEABLE
1. Crime is rising, and someone here deals with thieves or outlaws.
2. Those outside the law have a contact or a hiding place here, and crime is rising.

### Plain (none holds) · 7.8%

No cause and no house is presumed (a hidden house may stand behind a plain line).
1. Crime is on the rise here.
2. There is more crime in this place than there was, and it is still growing.
3. Crime here keeps climbing.

---

## guild_conflict

### Its stored sentence today

Built as crime_wave's above (no sibling, no name token, no `dated` form):

- **Unanchored** (the timeline holds no `guild_conflict` event: `guild_conflict.byMemory.unanchored`): "Guild and
  non-guild traders are fighting over who may sell what, and over a say in how the place is run". 56 of the probe's 66.
- **Base** (`HISTORICAL_EVENTS_DATA`, `guild_conflict.description`; reached wherever the timeline holds its own event, at
  any age): "Rival guilds fought over who may sell what, and over a say in how the place is run" (9 of 66). Where that
  event printed this very sentence, `apartFromOwnEvent` takes the first variant that differs (`historyDescVariants.js`):
  "Competing guilds struggled for control of the market and a voice in local politics" (1 of 66).
- **Dated**: none declared, so an event older than 80 years keeps the base.

Note for the reader: the base and its variant are past tense and guild against guild. They print exactly where
`old_guild_war` holds (the same timeline event), so that cause's lines always stand beside one of them; per the brief's
law (5) the lines below keep the kind's meaning (the guild against those who would trade outside it).

### Causes, in the ruled order

**old_guild_war** · rank 1 · the timeline holds a `guild_conflict` event, "The Guild War", at any age
(`t.history.historicalEvents[].templateType`) · raw 14.0% → 10.2%
1. Trade has been fought over here before, in an earlier guild war, and now the guild and those outside it are at odds.
2. The place has had a guild war in its past, and the fight over trade has opened again.

**guilds_rule** · rank 1 · the governing power is of category `economy` (`powerStructure.factions[]` with `isGoverning`;
in the probe a merchant oligarchy, a guild consortium or a guild council) · raw 34.0% → 29.3% · THREE wordings
1. This place is governed by a power of trade, so the quarrel over who may sell is also one over how it is run.
2. Those who hold the hall here hold it by trade, and the guild and those outside it fight over who may sell and who has the say.
3. Where trade governs, as it does here, who may sell outside the guild is a question of power as much as of business.

**rival_power** · rank 1 · a power that does not govern stands at Significant, Strong or Dominant (`factsOf(t).rivalPower`,
`rivalPower.js :: rivalPowerOf`) · raw 32.1% → 24.7% · THREE wordings
1. The guild and those who would trade outside it are at odds, and here the say in how the place is run is not held by those who govern alone.
2. Another power of real weight stands beside those who govern, so the quarrel over who may sell is also a quarrel over whose say counts.
3. Those who govern here are not the only power of standing, and guild and non-guild traders each look for a say in how the place is run.

**caravans** · rank 2 · a house named /caravan/ ("Caravan masters' exchange", "Caravaneer's post", "Caravanserai") ·
raw 33.0% → 3.3%
1. Caravan trade comes through here, and the guild and those who would trade outside it are at odds over who may sell.
2. Goods come by caravan to this place, and who may sell them, guild or not, is in dispute.

**ships** · rank 2 · a house named /docks|port facilities|harbou?r/ ("Docks/port facilities", "Harbour master's office") ·
raw 32.6% → 4.2%
1. Vessels put in here, and the guild and those who would trade outside it are at odds over who may sell their cargo.
2. Cargo comes and goes by water here, and who may sell it outside the guild is in dispute.

**crossroads** · rank 2 · the trade-route kind is `crossroads` (`factsOf(t).route`, `terrain.js`) · raw 17.7% → 0.9%
1. Roads meet at this place, and the guild and those who would trade outside it are at odds over who may sell.
2. This place stands where roads cross, and who may sell here outside the guild is in dispute.

**fair** · rank 2 · a house named /annual fair/ ("Annual fair": regional merchants; "Major annual fairs": international
merchants); worded for one fair or several · raw 77.2% → 13.0% · THREE wordings
1. Fair time brings sellers from elsewhere, and the guild and those outside it are at odds over who may trade.
2. Each year at fair time traders come who are not of the guild, and who may sell becomes a quarrel.
3. Not everyone who sells here at fair time is of the guild, and who may trade is fought over.

**trade_center** · rank 2 · a house named /international trade center|auction house|money changers/; worded, as ruled, as
a place where trade passes outside the guild, no new party, and for any of the three · raw 54.9% → 6.0%
1. Some trade here passes outside the guild, through a house of exchange or sale, and who may sell is fought over.
2. Goods or coin change hands here away from the guild, at a place of exchange, and the guild and those outside it are at odds.

**luxury_quarter** · rank 2 · a house named /luxury goods quarter/; worded, as ruled, as a place where trade passes outside
the guild, no new party · raw 70.7% → 7.0%
1. Trade in the luxury goods quarter passes outside the guild, and who may sell there is in dispute.
2. The luxury goods quarter does business beyond the guild's hold, and guild and non-guild traders are at odds over it.

### Plain (none holds) · 1.4%

No cause and no house beyond the guild the kind itself needs (`HISTORY_TEMPLATE_RECORD_DECLARATIONS.guild_conflict`).
1. The guild and those who would trade outside it are at odds here over who may sell.
2. Who may sell in this place, and who may not, is a quarrel between the guild and those outside it.
3. Traders who are not of the guild are pressing for the right to sell here.

---

**Count.** crime_wave: 28 lines (11 causes × 2, `rival_rings` × 3, plain 3; `old_crime_wave` dropped, no lines).
guild_conflict: 24 lines (6 causes × 2, `guilds_rule`, `rival_power` and `fair` × 3 each, plain 3).
