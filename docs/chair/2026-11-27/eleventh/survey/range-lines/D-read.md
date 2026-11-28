# (D) THE TEN TOWNS READ BACK (RANGE-LINES, 2026-11-28)

The ten towns of `survey/voices/F-towns/` were born again on the stack tip 003fd3b07 (their records' names match the
F-towns pages: Grudko, Copanchihua, Glenfield, Chernoko, Grudka, Wadizamin, Niederbach, Flachwalde, Celoets, Megachorio).

What prints today comes from two places. For the houses it is each record's own stored description. For the view-time
lines it is the F-towns pages' "AS IT PRINTS TODAY" sections: only the tabs those pages walked (three a town), and a key is
found there by its fixed words. The seat, the DM hall and patronage lines, the legacy key and the crises were read from the
record through the composers.

THE COUNTERFACTUAL RULE (mine, stated so it can be checked): for each key on a page, the candidates are TODAY's line and
those of my four lines whose marks the town meets. One is chosen by the kernel's rendezvous on `<seed>::<key or house name>`
(`kernel/proseHash.js :: pickRendezvous`). The builder's own pick will differ, but this is what one ranked pick would print.
The full list is `D-picks.txt`; the scripts are in `tools/`. CONFIRMED = a script picked it; the reading is mine (PLAUSIBLE).

## Town by town (my lines picked / keys of mine on the page)

**Grudko (city, C-dp-city-59): 19 / 27.**
- Institutions reads a different thing on each card: pelts hanging by colour, hoists swinging bales to the top floors, a
  mill stopped until a wright mends its wheel, the glassmakers' fuel, the forge's charcoal and iron.
- No card repeats its catalogue line, and no card says what the next one says.
- Defense: "News reaches Grudko first at its gates" follows the walls line well. The appended walls clause "Whoever is
  caught inside the walls after the gates close has nowhere to run" reads as a jump after the corners sentence (a
  least-trusted line, below).

**Copanchihua (hamlet, C-dp-hamlet-85): 6 / 8.**
- The seat now reads "Orders in Copanchihua go out in the name of the Feudal Stewardship. Malinalxochitl Chan, the steward,
  sits at its head." It is plain, and the steward's name lands at the end.
- Daily Life: "When the Feudal Stewardship wants something done, people here hurry to do it" holds for a one-person office.
  It replaced "Members of …", which did not hold for one and was struck while reading this town.
- The DM hall line "The Feudal Stewardship takes no money and no orders from a criminal house" says the rung in seven words.

**Glenfield (village, C-dp-village-128): 9 / 9.**
- The three church-and-mill cards now read as a village: the grindstones re-cut by hand, each family cutting the grass
  round its own graves, the priest's house the first door knocked on in trouble.
- Daily Life's "Some here have started taking their troubles to someone other than the Elder Council" sits beside the
  priest's card and agrees with it, unplanned.
- Every key of mine on this page changed its line. That is the size of the change in a small place: every repeated
  card is new.

**Chernoko (metropolis, V-dp-metropolis-149): 9 / 11.**
- "The barracks wake to a drum or a bell before dawn" and "Fees are high, and most students come from families that can
  pay them" are the kind of thing a surveyor writes down.
- Economics: "The trades that sell outward from Chernoko argue over which of them matters most" is a judgment of the
  posture, true of any place that sells several things.
- The charter hall's "Not everyone who sets out from Chernoko's charter hall comes back" is the darkest line on the
  Defense tab. It is fair to the trade.

**Grudka (metropolis, V-dp-metropolis-41): 8 / 10.**
- "Soldiers off duty fill the taverns and cookshops near each barracks" puts people on a card that held only an
  arrangement.
- The two DM patronage lines now say two different things: the head's share ("the Consortium hears what the Merchant
  Guilds want early"), and the third's weight ("the Guard's requests … are seldom refused").
- Daily Life: "Those too young to remember the Siege have heard about it all the same" ages the event without a number.

**Wadizamin (metropolis, V-dp-metropolis-91): 13 / 14.**
- Five magic and defence cards now notice five things: scorched practice-room floors, doors the neighbours keep away
  from, the poorest houses between the two walls, the barracks' drum, and morning carts at the gates.
- Defense's patrol line "The guard walks the usual rounds, so people know roughly when to expect them" keeps the
  stem the supply-cut rewrite reads.
- One risk: "When the harvest or the weather goes wrong, the Democratic assembly gets the blame for that too" names
  weather as a condition, not a fact. I would keep it.

**Niederbach (thorp, V-dp-thorp-21): 5 / 7.**
- The seat "Asked who governs Niederbach, people name the Feudal Stewardship. Its seat is held by Dietrich Weber, the
  reeve." is the best seat line on the ten pages.
- A DOUBLING: Daily Life's "Some families here are still paying for the Religious Conflict" and History's "the religious
  conflict is still spoken of as unfinished business" both speak of one event in one place. Today's lines double it too
  ("still shapes how people here go about things"). The page-admits relation of the design should hold the two apart.
- "A practitioner could walk into Niederbach and no one would know what they were" is right for a thorp with no
  arcane defence.

**Flachwalde (town, V-dp-town-8): 16 / 17.**
- The craft cards read well together: mending at the cobbler's, the guild deciding who may set up as a master, the
  ropewalk, families watching a new grave.
- The Defense paragraph is the weakest read of the ten. "Most fights here start over drink and are over the same
  night." followed by " Whoever is caught inside the walls after the gates close has nowhere to run." loses the
  inside/outside contrast the appended walls clause exists to make.
- The DM hall line "Whatever trouble crime brings here, it does not start in the hall" stands beside a semi-organized
  syndicate without denying it, which is the rule it was written to.

**Celoets (village, V-dp-village-23, at war): 10 / 12.**
- The no-watch line "There is no watch. A face nobody knows is noticed at once, and talked about." fits a village at
  war.
- The legacy line "Some of what troubles Celoets today began with the siege, which is a generation old" is plain and
  ties the past to the present.
- The war's mark: the ranked pick kept today's "Curtailed by the war." My "Working on what the war left." prints only
  where the pick favours it, one wording for the whole town.

**Megachorio (village, V-dp-village-76, in famine): 8 / 13.**
- The marks keep my export-posture lines out of a famine town (today's famine twin stays), as they must.
- The famine's mark becomes "Less of it each week of the famine.", which says time passing where "Scarce" did not.
- "Children at Megachorio are put to work at the {good} young" replaced "learn the {good}", which read wrongly with "the
  grain harvest" and "the mill" (struck while reading this town; the year line was re-worded the same way).

## What the reading changed in C (CONFIRMED, re-pushed with this file)
- OUTSIDER_IMPRESSIONS.power: "Members of {power} are easy to pick out" became "When {power} wants something done, people
  here hurry to do it" (a one-person office).
- DS-ECO-9: two {good} lines re-worded ("seasons of the {good}", "learn the {good}" did not hold for "the mill" or "the
  grain harvest").
- A NEW SAMENESS, caught before it shipped: 13 house lines are SMELL lines, and a city page can draw four of them (Grudko).
  Two city lines (the carpenters, the bakers) were made other notices; at most two smell lines can now print on Grudko's
  page. The builder should count a SENSE THEME across keys of one tab as the measure counted templates.

## The ten lines of mine I trust least
1. MODERATE_WALLS " Whoever is caught inside the walls after the gates close has nowhere to run." It loses the clause's
   inside/outside contrast, and it reads dramatic.
2. RECENT_CHANGES "Some families here are still paying for {event}." It is odd for "the Return" or "the Mandate", and it
   doubles History's legacy line on the same event.
3. OUTSIDER_IMPRESSIONS "Those who fall out with {power} soon find doors closing to them." It is a hostile impression of a
   power the town may like.
4. MIXED_CORNERS "A purse left on a bench would not be there for long." A turned phrase, and it may overstate a Moderate
   band.
5. DS-ECO-11 "{settlement}'s position shapes what it trades and who comes to it." Nearly empty.
6. CAPTURE_LINES.none "A complaint against a criminal, brought to {ruler}, is heard like any other." The rung guarantees
   no capture, not fair hearings.
7. The seat "When it is blamed or thanked, the name people use is {whoEnd}." Long once a role like "the senior guild master
   and Lord Mayor" fills it.
8. Citadel "In quiet years it holds more clerks and stores than soldiers." It is stored at birth with no crisis guard, and
   in a town at war it reads wrong.
9. Charter hall ABSENT "At {settlement}, children are kept close at dusk, because no one's work is the creatures." The
   wording is clumsy.
10. DS-DEF-9 "Magic at {settlement}, where there is any, is bought for comfort or show, not for the work." A judgment of
    the place, stated as fact.
