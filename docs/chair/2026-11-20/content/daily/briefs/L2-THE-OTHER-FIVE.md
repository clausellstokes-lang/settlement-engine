# DAILY-1 · L2 — LINES FOR `food_culture`, `commoner_resentments`, `outsider_impressions`, `unspoken_topics`, `recent_changes`

Read `briefs/LINES-COMMON.md` first: it binds you word for word. Write under `docs/chair/2026-11-20/content/daily/lines/L2/`.

- `food_culture` (every place fills it; "Hearty grain bread and turnip-and-onion stews… the wealthier streets" top
  65/46/45/51/33/28%, false at thorp/hamlet for "streets" (98/69) and, by the battery's own word check, for "grain
  bread"/"meat" where the record holds no grain or livestock source: 98/69/68/73/47/42). What people eat is said from
  the place's own food sources (`factsOf(r).foodSources`: fish, game, grain, livestock, mill; imports where listed)
  and its prosperity (`factsOf(r).prosperity`), inside the food band as today (surplus / adequate / strained /
  critical / collapsed; a famine or siege keeps today's twin rule). "Markets close their stalls" only where
  `marketOf` holds; "temple kitchens" only where a sacred house stands.
- `commoner_resentments` (fallback "the small grievances of any town: the gate fee, the rain on market day, the
  council's favorite tavern." false on 30/12/7-12 small places; "the council's" false where the ruling body is not a
  council: 10/46/39/34). RE-CUT: the criminal-opportunity branches (K, K7) and `corruption_exposed` GO (rule 6: no
  crime fact). Grievances only from what the record holds: food strain (bread prices; "merchants" only where a market
  stands), strained legitimacy said of the body the record names (`rulingBodyOf`, `rulerKindOf`: the elder, the
  lord, the council, the mayor), and any other grievance the record holds that you can name from a fact home (say
  which). Where none holds: the EMPTY string (rule 5). Measure the empty share by size.
- `outsider_impressions` (top 43/38/44% thorp→village; today prints the engine's label "civic stability at risk is
  the obvious unspoken weight" and "Visitors notice missing watch" where no watch stands). Re-say each part plainly:
  the dominant power's presence (its name through the line's possessive helper `powerPossessive`, which today's line
  already uses; a veiled power never named: M1 found 1 town), the top threat said as an outsider would see it (one
  plain pool per threat kind, need-gated), the strained services said of what the place has. Several frames.
- `unspoken_topics` (ONE text on 900 of 900: `Locals will not openly discuss the matter referenced as "the wound".`).
  Read `src/domain/historyBeats.js` (whole) for what `unresolvedWound` holds (its label, its text, its source event)
  and say the wound BY WHAT IT IS, plainly, in several frames ("Nobody brings up <the event> in company…"), with
  needs on what the beat names. Hidden/rumored threats and corruption take 0 places (M1): drop the corruption clause
  (rule 6). If the record holds no wound for a place, the slot is EMPTY.
- `recent_changes` (passes the share test, fails on its words: "<threat label> has come to a head" in about half of
  all places, the label an engine string like "Civic stability at risk"). Keep the three sources (the recent
  disruption beat's own text, a new condition, an acute threat) but say a condition and a threat in plain words: a
  small pool per threat kind and stage (imminent vs realized said differently) and per condition archetype (list
  every archetype `src/domain/activeConditions.js` can produce; read it whole). The fallback pool says a calm season
  plainly with no season named (rule 7).
