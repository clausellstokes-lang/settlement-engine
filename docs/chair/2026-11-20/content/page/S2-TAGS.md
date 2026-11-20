# S9: the role-free secrets, tagged by the holder they fit (for PAGE-2 and the chair; vetoable)

The table is `src/data/npcData.js :: CRIMINAL_SECRET_HOLDER_TAGS`, at the end of the file. It is keyed by each row's secret text, so the row objects are untouched.

**How the draw reads it.** `npc/factionLeaderSecret.js :: generateFactionLeaderSecret` makes its roll as before. If the drawn row's tag does not name the holder's role class, the card takes a different row, with no new draw:
1. the next admitted, unheld row of the same pool, in order, wrapping
2. if none, the personal bucket's next admitted row, starting from the drawn row's place
3. if none, the safe line

The drawn text stays held, so every later card refuses what it refused before.

**The temperament.** The same walk refuses a venal row to a card whose drawn temperament is `principled`. "Venal" means the `incorruptible` words of `SECRETS_DENIED_BY_TEMPERAMENT`; that table is read, not edited. The same check applies to L4's office rows.

**Untagged rows.** A row with no tag fits every holder.

**`other` is in every tag.** `domain/roles/roleClass.js` cannot class most trades and keepers, so it calls them `other` and leaves them unjudged (the cooper, the chandler, the toll-keeper and so on). Refusing a business line to them would refuse it to a trade.

| Row (secret) | Tag | Why |
| --- | --- | --- |
| Runs a protection scheme targeting the very merchants they're supposed to serve | office, military, other | The holder is supposed to serve merchants: an office of the market, or the watch that keeps it. |
| Has been falsifying inspection records for a fee | office, other | The holder inspects, which is an office. |
| Their legitimate business is a front for moving contraband | trade, merchant, criminal, other | The holder keeps a business. A criminal house's front is one. |
| Their appointment was secured through forged credentials | office, clergy, military, other | The holder was appointed: an office, a see, a command. |
| Has agreed to hand over authority to an external power in exchange for personal safety | office, noble, military, clergy, other | The holder holds an authority of the town to hand over. |
| Has been quietly betting against the ventures they talk their neighbours into, and profiting when they fail | merchant, trade, noble, other | The holder deals in ventures. |
| The goods they sell as locally produced are sourced from somewhere with exploitative labour practices | trade, merchant, other | The holder sells goods. |
| Has been paying a health official to suppress a finding about their product | trade, merchant, other | The holder makes or sells a product. |
| Has information about a competitor that would ruin them, obtained through clearly illegal means | trade, merchant, criminal, other | The holder has a competitor, in a trade or a racket. |
| Their business partner died of natural causes that weren't entirely natural | trade, merchant, criminal, other | The holder has a business partner. |

**Left untagged, judged to fit every holder:**
- **Embezzling from "the organisation they oversee":** every face oversees its own house.
- **On the thieves' guild's payroll, costing "their post":** every face has a post.
- **Delaying "vital information":** anyone can do it.
- **Feeding intelligence to outsiders:** anyone can do it.
- **Covering up an institutional failure:** every face has its house.
- **The military bucket's two role-free rows (captured; a victory won by treachery):** anyone can be captured, or know.
