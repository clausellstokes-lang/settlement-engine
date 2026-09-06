# FINDER NOTES — Hobb x craft angle (Opus finder)
Working dir for raw captures: sweep/hobbcraft/ (own subdir; the shared sweep/ dir has concurrent writers — another agent overwrote a helper script named fetch.sh mid-run, so all my captures live under hobbcraft/ with hfetch.sh).

## Method notes
- WebFetch SUMMARISES rather than returning page text (it refused a "verbatim" request and mis-attributed a Goodreads blog page). Every source below was read RAW via `curl` with a browser user agent, HTML stripped to text locally. That is the routeHint on nearly every claim.
- aidanmoher.com returns HTTP 403 to WebFetch; curl with a browser UA returns 200.
- The Moher page is served with mojibake apostrophes (a-hat sequences). Quotations were chosen to avoid apostrophes so they match on both a raw byte read and a decoded read.
- Every quotation below was string-searched against the fetched text before being written (build.py fails closed on a miss or a >12-word quote).

## Roster status (the angle named categories, not URLs)
- Hobb's own craft essays/interviews: FETCHED — OF Blog 2003, Locus 1998, Locus 2005, Pat's Fantasy Hotlist 2005, A Dribble of Ink 2007, Fantasy Book Critic 2008, Writing Excuses 11.Bonus-01 2016 (fan transcript), robinhobb.com blog 2022.
- Hobb's own blog on robinhobb.com: FETCHED but THIN for prose craft — the writing posts are about protecting writing time, not about sentences.
- Critics / close readers on register and pacing: FETCHED — Geoffrey B. Elliott's 500+ entry chapter-by-chapter reread (elliottrwi.com), Vacuous Wastrel's review series (4 reviews).
- Craft-site analysis: FETCHED — Writers Write (Christopher Luke Dean, 2020).

## Highest-value findings so far
1. THE DEVICE, in Hobb's own words (Pat's Fantasy Hotlist 2005): "the story is really about how the events affect the characters rather than about the events themselves."
2. THE DEVICE, mechanism (Fantasy Book Critic 2008): the Joe/Ed example — a state change stated flat "seems more like a joke than a devastating occurrence"; the consequence must be ramped by prior detail.
3. HOUSEHOLD ECONOMY named by a close reader (Vacuous Wastrel, Golden Fool 2013): "worrying about the apprentice fees for dependants" as the thing most epic fantasy will not spend pages on; and "that motivations are personal, and that consequences will also be personal".
4. CIVIC-RECORD REGISTER: the chapter-opening epigraphs. Hobb calls them "little prologues at the beginning of each chapter" (Moher 2007) and says they exist to give the reader information the first-person narrator cannot. Elliott (medievalist) reads them as "the Asimovian move of grounding chapters in in-milieu reference materials" and as enacting "the piecing-together of disparate and not always complete sources".
5. PLACE/INSTITUTION scale rules in Hobb's own words (OF Blog 2003): "A tiny village isn't going to have an artisan who makes his living specializing in doorknockers"; "A medieval farm family didn't harvest its entire farm in one afternoon"; "Make your economy and geography make sense."
6. COUNTER-EVIDENCE on prose beauty: Vacuous Wastrel repeatedly rates her prose "unremarkable" / "solid and effective and occasionally pretty" while rating craft 4-5/5 — the effect is NOT in sentence-level ornament.
7. REGISTER MODULATION is documented by the author herself across two pen names: "Prose as Megan Lindholm is much leaner than prose as Robin Hobb"; "a fairly clean dividing line between the Robin Hobb voice and the Megan Lindholm voice".

## Still to chase
- Grimdark Magazine / Reddit AMA / Waterstones / Guardian interviews.
- Hobb's own essays (the Fan Fiction Rant; introductions).
- Game designers on Hobb (angle explicitly names game designers) — none found yet.
- Academic: Elliott's Fedwren Project bibliography as a route to scholarship.
- Tor.com / Strange Horizons / LARB critics.
