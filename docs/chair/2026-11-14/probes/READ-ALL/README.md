# READ-ALL: every distinct sentence the tabs print, read once against the hardest town that prints it

- `build_packets.py <census out-dir (720)> <bar out-dir (10)> <out-dir> [words a packet]`: the packets (`main-NN`, `crisis-NN`, `cal-NN`) and `index.json` (id: the folded sentence, the towns that print it, its sections, the town it was shown under). The census out-dirs are the CENSUS-3 command's (`census3.sh <tree> <out> 4`, and again with `--seeds seeds.bar0.txt`), run at the joined line's e5b421802.
- `packets/*.txt.gz`: the packets as the readers were given them. `index.compact.json.gz`: the index without the town lists (a count instead).
- `merge_flags.py <packets dir> <repo with the readers' branches fetched> <bar list json> <bar dumps dir> <out dir>`: the flags merged, one row a sentence ranked by the towns that print it, and the read's recall on the calibration pages against the bar's first read.
- `sentences.py`: the first measure (how many distinct sentences there are).
- The readers' brief: `docs/chair/2026-11-14/briefs/BRIEF-READ-ALL.md`. Their flags: `docs/chair/2026-11-14/read-all/<packet>.flags.jsonl` on `lane/read-all-2026-11-14-<packet>` (crisis-07's file is on the crisis-06 branch).
