# Lane R-WATABOU — receipt (checkpoint 1, 2026-08-24 ~22:50)

## Status: IN FLIGHT — license verified, source corpus downloaded and read, devlog sweep in progress.

## Fetches executed (CONFIRMED class — source fetched, artifact on disk or content quoted from live fetch)

| # | What | How | Result |
|---|---|---|---|
| 1 | github.com/watabou/TownGeneratorOS repo page | WebFetch | Repo exists, owner watabou, license sidebar GPL-3.0, default branch master, Haxe/OpenFL |
| 2 | raw LICENSE (master) | curl → sources/LICENSE.txt (35,141 B, sha256 589ed823e9a84c56feb95ac58e7cf384626b9cbf4fda2a907bc36e103de1bad2) | Standard GNU GPL v3, 29 June 2007 text. Word-diff vs gnu.org current gpl-3.0.txt: identical except two URL modernizations the FSF made later (http://fsf.org → https, philosophy/why-not-lgpl → licenses/why-not-lgpl). NO added permissions, NO exceptions. |
| 3 | raw README.md | curl → sources/README.md | Quoted verbatim in dossier. No reuse grant beyond the LICENSE. |
| 4 | GitHub trees API (recursive) | curl api.github.com | 65 blobs; full file list captured. |
| 5 | 26 source files (building/, wards/, geom/, mapping/, utils/Random.hx, Main.hx) | curl → sources/*.hx | All read in-session: Model.hx, Patch.hx, Topology.hx, CurtainWall.hx, Cutter.hx, Ward.hx, all 13 ward subclasses, CityMap.hx, Voronoi.hx (head), Polygon.hx (pending read), Graph.hx (pending) |
| 6 | MFCG devlog listing | WebFetch + curl URL extraction | 45 posts, titles+dates+teasers captured; 45 post URLs extracted |
| 7 | Village Generator devlog listing | WebFetch | 19 posts, titles+dates+teasers captured |
| 8 | watabou.itch.io/neighbourhood | WebFetch | Project page captured; output-reuse statement quoted |
| 9 | patreon.com/collection/244236 (City Generator, Oleg Dolya) | WebFetch | JS shell only — post list NOT reachable unauthenticated/static. Title + creator confirmed. |
| 10 | patreon.com/collection/244214 (Village Generator, Oleg Dolya) | WebFetch | JS shell only; header says "26 posts"; list not reachable. |
| 11 | patreon.com/cw/fantasytowngenerator/posts (creator "Thomas") | WebFetch | JS shell only; posts not reachable. |

## Dead ends / honest gaps
- Patreon collections: static fetch returns the SPA shell. Browser-pane render attempt pending; no login will be used (rule: no authentication by agent).
- Polygon.hx shrink/buffer/cut internals: skimmed conceptually, not line-read (geometry utility, not architecture).

## Local reads (repo, READ-ONLY)
- docs/DESIGN_REGISTER_PROGRAM.md — full 577 lines (§0 north star, L-REG-1..36 law tables, A1–A12).
- git show 9de7290218d01d0777262787b013c397414834cf:src/domain/townMap/fabric/buildFabric.js — header + full stage-marker census (grep -n over the sealed blob).

## Next
- Devlog deep-dives (experiments/experimenting/districts/buildings posts) — in flight.
- Patreon via browser pane (public titles only).
- Dossier assembly at $SP/research/draft-R-WATABOU.md.
