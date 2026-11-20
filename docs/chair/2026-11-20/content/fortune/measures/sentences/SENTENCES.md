# U5b SENTENCES: the one merit's sentence, three DRAFT wordings (FORTUNE U5b-SENTENCES; for the chair's eye; no src, no tests)

The merit: `fortuneMerits.js :: meritsOf` -> `'weathered'`, the event `weatheredCatastrophe(record)` returns (catastrophe
grade, `yearsAgo <= weatheredWithinYears` = 40, its kind no tension of today, no unresolved legacy note; gates: law 2,
base score >= Tolerated, no ruler-trouble tension). `{place}` = the record's `name`; `{event}` = that event's stored `name`,
verbatim. No figure (the desk's section 0d digit ban): "within a generation" / "in living memory" band the 40 years.
Seen on six whole pages: `PAGES.md` (w1 on 1 and 4, w2 on 2 and 5, w3 on 3 and 6; page 1 the captured hall, also shared).

**w1** `{event} hit {place} within a generation; the place came through it, and its people accept the hall.`
- Prints with: `Approved` vid 1 "{settlement} thinks well enough of the {seat}, not warmly, but well enough that what it
  decides carries in most quarters without an argument first." / `breakdown dominated by PROSPERITY, favourable` vid 1
  "{settlement} is doing well and gives the {seat} the credit. While the money keeps coming, nobody looks hard at how it governs."
- Needs: `name`; the merit's event `name`; `meritsOf` (its inputs below). "accept" = the base score's Tolerated gate.

**w2** `{place} came through {event} in living memory, and its people accept the seat today.`
- Prints with: `Endorsed` vid 3 "Ask anyone at {settlement} who rules and they name the {seat} without a pause; nobody
  disputes it." / `Approved` vid 3 "There is grumbling at {settlement}, but it stays grumbling; nobody talks of replacing the {seat}."
- Needs: as w1.

**w3** `{place} came through {event} within a generation, and the hall's standing there is the better for it.`
- Prints with: `Tolerated` vid 1 "{settlement} obeys the {seat} out of habit, not liking. Orders are followed; nobody
  speaks up for it." / `breakdown dominated by PROSPERITY, favourable` vid 3 "{settlement} likes the {seat} because times
  are good. If the money stops, the goodwill stops with it."
- Needs: as w1, and "the better for it" = `publicLegitimacy.breakdown.merits > 0` (the points the merit added).

All lines quoted from `src/data/dossierStateProse/power.generated.js` (`DS-POW-1`), by pool key and `vid`.

## Where each need is served (READ; and EXECUTED: each of the 3 wordings on each of the 6 records, computed on the owner's
## record, on `toPublicSafe(record)` and on that under the widest veil, was one string on all three: 18 of 18)

| need | `toPublicSafe` default | widest veil (`applyVeil`, every hideable grouping and card field class) |
|---|---|---|
| `name` | `PUBLIC_TOPLEVEL_KEYS` | `SETTLEMENT_FLOOR` (`galleryVeil.js`) |
| law 2 (`config._fortuneLawVersion`) | `config` allowlisted; key matches no `PRIVATE_KEY_RE` token | `SETTLEMENT_FLOOR` |
| `history.historicalEvents[]` `name` `severity` `yearsAgo` `templateType` | `history` allowlisted; no token | event card `floor` |
| `history.currentTensions[].type` | as above | tension card `floor` |
| `history.legacyAnnotations[]` `eventName` `yearsAgo` `annotation` | as above | no card kind lists them: untouched |
| `powerStructure.publicLegitimacy` `score` `breakdown` (gate; w3) | `powerStructure` allowlisted; `publicVeilPass` drops only the capture state, seeds, capture/corrupted ties, hidden rows | no card field class names them |

NO NEED IS UNSERVED. None reads the capture rung, which power governs, a person, a card's traits or a fact about crime.

## Where it would sit, and three things for the chair

1. THE DS-POW-1 BANNER PRINTS NO SENTENCE TODAY. `power.legitimacyBanner` is a GLANCE rung (`dossierMounts.js`, the
   owner's word of 2026-11-09), so `drawnAtMount` strips both DS-POW-1 draws on the screen (`PowerTab.jsx`) and in print
   (`printProse.js` -> `StateProse`). The printed reading of the band is the governance paragraph's standing sentence
   (`governanceAccount.js`, "2. THE STANDING": e.g. "Prosperity has earned the Royal Authority the approval of Bailton.").
   The drafts sit at the banner's position (the head of the page); a sentence there prints only if the rung is raised or the
   reason joins the standing sentence. Which is the chair's ruling, before U5b.
2. "UNDER THIS RULE" IS NOT SAID: no record field says who held the seat when the event fell (the captured hall's event is
   The Occupation, five years ago, when occupiers held it), so the drafts say only that the place came through it and accepts
   the hall now. w3 credits the hall's standing (the points the branch adds); on "The Tyranny" (page 3) it may read as the hall
   having ended it.
3. The event's stored name keeps its capital "The" mid-sentence (w2, w3); no event-name helper lowers it as
   `powerSentenceName` does for powers. The brief's `src/lib/publicSafe.js` is `src/domain/display/publicSafe.js`.
