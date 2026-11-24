# The Daily Life page — for the owner (DAILY-4, the Daily Life lane's landing "DAILY-B")

Your order of 2026-11-22: "remove the button prompt for Daily life and simply generate it automatically … just skip
that step and have it generate with the rest of the dossier." The button went at point 95, and the page printed three
lines. With this landing THE PAGE PRINTS ALL ITS LINES: eight, on every place, from the place itself. Nothing is
asked of an AI and nothing is paid for. The same eight print in the PDF, in its chapter 15, "Identity & Daily Life".

## What a reader sees

Each line is one or two plain sentences with no heading of its own, in this order (the chair's): how the place strikes
a newcomer; how the day starts; what people eat; where they gather; what children are warned about; what ordinary
people resent; what is not talked about; what has changed lately. A line the place has nothing true to say for is left
out, never filled with a stock sentence. A calm place prints fewer lines: in the sample below the thorp prints 7 and
the town 6.

ONLY ON YOUR OWN PAGE (never on a shared page, never on a player's view, never in the PDF): one more line, after the
resentments, about what people resent that a reader should not be told (crime and the law), in the same "For the DM
only" box the Power page already uses. It prints only where the place gives cause (in the sample, the city).

## Six places, one of each size (seed hxd-<size>-0)

BEFORE (the working line today, point 102): `before.md` beside this file: three lines a place (how the day starts,
where people gather, what children are warned about).

AFTER (this landing): `after.md` beside this file, and below the city as you would read it on your own page:

> Ask who decides things here, and a visitor hears more than one name. The country around is overrun with beasts, and
> visitors are told so almost at once. Those who fall ill here cannot count on much care.
>
> Bakers light their ovens first, then the smiths; the watch changes as the gates open.
>
> There is less to eat than people would like, and nothing is thrown away.
>
> People meet where the water is drawn and again by the houses of worship, and most news passes between them.
>
> Children are warned about wandering beyond the last streets after dark, and about taking sides in arguments that are
> not theirs.
>
> Commoners resent rising bread prices and merchants who claim they cannot help it.
>
> [For the DM only] People resent how little is done about wrongdoing that everyone knows of.
>
> What the place is short of, and who is to blame for it, is not discussed with strangers.
>
> People here still talk of the Migration, and of what it changed. Beasts now roam the country around, and people keep
> close to home.

## What the chair saw, named for after the first deploy (nothing built now)
1. One fact twice on one page: the city opens and closes on its beasts.
2. A form's name in the possessive reads badly: "the Headman's Authority's mark is on every door that matters".
3. One line cut from this landing: "The lord's steward is obeyed, but not much liked." It returns when a steward's own
   house can be read (on four small places another officer held the seat, so the line would have named a second ruler).
4. A narrower import for the PDF chapter (it now loads more of the Daily Life code than the lines it prints need).

## What of yours moved, and what is yours to decide
- FIGURES (sizes, for your size signing; signed by nobody), both trees built in one container: what loads before the
  first page shows FELL: 1,184,741 to 1,180,816 bytes raw (-3,925), 376,987 to 376,063 gzip (-924), 316,646 to 315,822
  Brotli (-824), because the retired Daily Life request left the always-loaded store. The page generator's worker ROSE
  890 bytes (2,709,263 to 2,710,153: most likely the five office words and their readers, which the generator also loads). The engine chunk is unchanged (932,369).
  The size budgets these rows are judged against were already over on the line before this landing (first paint
  1,175,492 / 373,999 / 313,994; the worker 2,579,708; the engine 909,928): they stay red, one step closer for first
  paint, 890 bytes further for the worker.
- THE PDF: its code grew to print the eight, measured against the line at point 102: the SettlementPDF chunk 194,667
  to 194,977 bytes (+310); the PDF's render worker 3,024,568 to 3,116,415 (+91,847, the Daily Life derivation it now
  loads). The PDF loads only when asked for: none of this is in first paint.
- STORED FIGURES moved, each by its own door with its cause: the phone-size page checks (the Daily Life view now holds 9
  lines, was 4; three route counts +1 for the owner-only box's small caption); the registers listed in the landing line.
  No reference snapshot (golden) of yours moved.
- YOURS TO RETIRE, UNTOUCHED: the server's AI daily-life function and its price row (the page no longer calls them),
  and the AI copy keys `ai.dailyLife.*` in `src/copy/en.js`, which nothing reads now.
- No tuning table was added.
