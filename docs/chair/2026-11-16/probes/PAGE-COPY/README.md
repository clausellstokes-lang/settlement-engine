# PAGE-COPY: the page as printed, for a detector or a reader

A copy of the census probe (`lane/census-3-2026-11-14 :: docs/chair/2026-11-14/probes/CENSUS-3`) with ITS RENDER MENDED on 2026-11-16 (`render.census3.jsx`): a row's cells are joined by ` · ` (before, the walk glued them); a tab is read AS PRINTED (the first view whole; each part opened by a click after it under a line `[opened] <label>`; nothing de-duplicated, so a list under a heading `(N)` holds N items); every snapshot waits until the panel's text holds still (two runs of one tree give the same dump, byte for byte).

ONE COMMAND, from any checkout that has `node_modules` (run `npm ci` there first), the output OUTSIDE the repository:

    HOLDERS=<this dir>/holders.tipA.json sh <this dir>/census3.sh <tree-root> <out-dir> 4 --seeds <seeds file> --count-only

It births every seed of the file in that tree (default `seeds.txt`: the census's 720), renders every dossier tab through the tree's own `OutputContainer`, and writes `<out-dir>/dumps/<seed>.txt` (headings `== <group>/<tab> ==`, then the tab's lines; after the tabs the Tonight sheet, the printed export `== PDF/<section> ==` and the journal) and `<out-dir>/corpus.ndjson.gz` (one JSON object a line: `seed` and the stored settlement under `s`). About five seconds a town at four workers. A seed's form: `bar0-<tier>-<crisis or calm>-rand-<n>` or one of the census's own names in `seeds.txt`.

`build_packets5.py` packs dumps into readers' packets (a header of the record's own facts, then every line with an id). The census's own counting stages (`count2.mjs`, the patterns) were written for the copy before the mending: with this render run `--count-only` and read the dumps; the pattern `i` (surfaces disagree) is not valid on these dumps.
