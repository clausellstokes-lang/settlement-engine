VOICES-CARDS DONE: branch lane/voices-cards-measure-2026-11-28 at 95708399d (the six; this report follows)

C and V: 1,800 towns rendered as the app renders them (owner and share), 0 errors. Mounted cards equal the record's count
on 1,800 of 1,800. Counts CONFIRMED, readings PLAUSIBLE.

| kind (mean a town, C) | thorp | village | town | metropolis | identity | slot |
|---|---|---|---|---|---|---|
| institution | 8.4 | 14.6 | 33 | 93 | name, no id | under description |
| power | 1.1 | 2.4 | 4.0 | 8.0 | name, no id | under members line |
| person | 1.3 | 8.0 | 25 | 84 | npc.id | visible face |
| tradition | 1.5 | 2.0 | 3.0 | 6.0 | draw index | under description |
| tension | 1.0 | 1.6 | 1.6 | 2.5 | type | under description |
| crisis | 0.3 | 0.4 | 0.4 | 0.3 | crisis.type | under summary |

V is within a few percent of C.

**Slots and surfaces.** All six kinds have a slot that keeps their flexible height. The phone only enlarges type. They
share no component, so one slot component would serve about 12 sites. A seat power has two cards on one tab. A tension
appears on both Overview and History. The PDF prints no tradition for a born town, and most people there are only name
rows. The share has no Crisis tab.

**Quotes under the ruled odds.** In towns and up, Institutions would carry 6 to 20 quotes and NPCs 5 to 16. A tab
exceeds three in 137 to 150 of 150 towns. With a tab budget (2 weighty, 1 lesser) a page holds 6 to 7 quotes, and a tab
exceeds three in 30 to 55 of 150. A thorp carries 0.8.

**No lawful speaker.** Tensions lack one in 73 to 93% of cases, because their parties are words, not powers.
Institutions lack one in 67 to 83% of thorp and hamlet cases and 16 to 44% above. The crisis lacks one in 2 to 46%. In
107 to 150 of 150 towns, one person is the only speaker for two or more cards. The reader test is
`cardPowers.js :: isHousePublic`.

**States.** Houses are standing (85%) or Vulnerable (15%). Powers are mostly Minor. Founding rites are 25% of all rites.
The four dispositions are nearly even.

**Proposal.**
1. A memoised `voicePlanOf`, read by `quoteFor`, decides in seeded order: speaks, who, line.
2. Cards are keyed by catalogId, element plus act, or type, all stable.
3. One `CardVoice` component and its PDF twin render nothing when silent.
4. A `VOICES_TUNING` table, plus an `IMPORTED_POOLS` row.
5. The share is fail-closed of necessity: `_seed` is stripped, so quotes must be stamped at publish.

**Not measured.** How the lines read (none exist yet), real PDF pagination, a real phone width, and re-deals in saved
towns. Ten duplicate-key warnings ("Thieves' Guild") from V's render are not attributed to a component.
