VOICES-CARDS DONE: branch lane/voices-cards-measure-2026-11-28 at 95708399d (the six; this report follows)

C and V, 1,800 towns rendered as the app renders them (owner and share), 0 errors. The mounted cards equal the record's
own count on 1,800 of 1,800. Counts CONFIRMED; readings PLAUSIBLE.

**Card kinds, a town (mean, C · V; full table in A):**

| kind | thorp | village | town | metropolis | identity | slot (keeps height class) |
|---|---|---|---|---|---|---|
| institution | 8.4 · 8.1 | 14.6 · 14.9 | 33 · 32 | 93 · 89 | slug(name): **no id** | under the description |
| power (roster row) | 1.1 | 2.4 | 4.0 | 8.0 | name: **no id** | under the members line |
| person | 1.3 | 8.0 | 25 | 84 · 80 | npc.id | visible face (collapsed card) |
| tradition | 1.5 | 2.0 | 3.0 | 6.0 | index into a view-time draw | under the description |
| tension | 1.0 | 1.6 | 1.6 | 2.5 | type (unique a town) | under the description |
| crisis | in a third of towns | | | | crisis.\<type\> | under the summary |

All six have a fitting slot (flexible columns; phone only lifts font sizes). No card component is shared: about 12 sites
(6 screen, 5 PDF, 1 session) would use one slot component. A seat power has two cards on the Power tab, and a tension
appears on both Overview and History. **The PDF prints no tradition for a born town**, and most people there are name
rows. The shared page has no Crisis tab.

**Quotes a tab under the ruled odds (3 in 4 weighty, 1 in 4 lesser, size factor, one a person):** Institutions 6 to 20
and NPCs 5 to 16 in towns and up. A tab exceeds three in 137 to 150 of 150 towns from the town size up. **With a tab
budget (2 weighty, 1 lesser) a page holds 6 to 7 quotes,** a tab exceeds three in 30 to 55 of 150, and thorps hold 0.8.

**No lawful speaker:** tensions 73 to 93% (their parties are words, not powers), institutions 67 to 83% in thorps and
hamlets (the fabric of the place) and 16 to 44% above. A crisis lacks one in 2 to 46% of cases, and some person is the only
speaker of two or more cards in 107 to 150 of 150 towns. The one reader function is `people/cardPowers.js :: isHousePublic`.

**States (E):** most institutions are standing (85%) or Vulnerable (15%). Powers are mostly bound, none or contender ×
Minor. Founding is 25% of traditions, a third of them under a crisis. The four dispositions are nearly even.

**Proposal (F):** `voicePlanOf(settlement, {audience})`, memoised, which `quoteFor` reads. It decides in three seeded
steps: speaks, then who (rank, unspent, isHousePublic), then which line. It uses stable keys (catalogId, element+act,
type). One `CardVoice` component plus a react-pdf twin renders nothing when silent. `VOICES_TUNING` is a P1 table and
SAID_LINES gets an IMPORTED_POOLS row (`say`). The share is fail-closed, and must be: `_seed` is stripped, so
VOICES-ON-SHARE has to stamp quotes at publish.

**Could not measure:** how a quoted line reads (no lines exist). Height and pagination on the real PDF (view models only).
The phone at real width (jsdom). Whether a DM rename re-deals in saved towns (read, not run). Ten React duplicate-key
warnings ("Thieves' Guild") in V's render, which I did not attribute to a component.
