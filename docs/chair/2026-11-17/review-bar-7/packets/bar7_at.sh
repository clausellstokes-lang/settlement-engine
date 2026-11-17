#!/bin/sh
# REVIEW-BAR-7's packets (PREP-READ-7, 2026-11-17): bar6_at.sh (docs/chair/2026-11-14/probes/READ-ALL/packets13/) made whole from
# the lane: every tool by a path relative to this file, nothing on a machine that is gone. ONE COMMAND, any tree:
#   sh docs/chair/2026-11-17/review-bar-7/packets/bar7_at.sh <tree with node_modules> <scratch dir> [seeds file] [read name]
# defaults: seeds.bar7.txt beside this file, read name bar7. It births and renders the seeds at <tree> with PAGE-COPY's census3.sh
# (the mended reading copy, --count-only, 4 workers, HOLDERS=holders.tipA.json, exactly as bar6_at.sh ran it), packs them with
# PAGE-COPY's build_packets5.py at 16000 words a packet, and writes the publishable set to <scratch>/publish:
#   <read>-NN.txt.gz (the builder's cal-NN.txt), index.<read>.json.gz (the builder's index.json, its "cal" part only, as
#   packets13/index.bar6.json.gz), MANIFEST.txt (packet, towns, lines), TREE.txt (the tree's commit and tree hash).
# THE 720: the builder's first argument is a census render of the 720; it feeds only the main and crisis packets and the index's
# "ids", never the bar's packets (cal-NN.txt and the index's "cal" read the second argument alone). It is given an empty corpus
# (<scratch>/empty720/corpus.ndjson.gz): no main or crisis packet is made. PROVEN on the sixth read: README.txt.
# REUSE=1 passes census3.sh's --reuse (a finished render in <scratch>/render is counted, not born again).
# Copy <scratch>/publish/* into the lane by hand. Every stage's exit is read; a failed stage exits non-zero.
set -u
[ $# -ge 2 ] || { echo "usage: bar7_at.sh <tree> <scratch> [seeds] [read]"; exit 2; }
H=$(cd "$(dirname "$0")" && pwd); L=$(cd "$H/../../../../.." && pwd); P=$L/docs/chair/2026-11-16/probes/PAGE-COPY
TREE=$(cd "$1" && pwd) || exit 2; mkdir -p "$2" || exit 2; S=$(cd "$2" && pwd)
SEEDS=${3:-$H/seeds.bar7.txt}; SEEDS=$(cd "$(dirname "$SEEDS")" && pwd)/$(basename "$SEEDS"); READ=${4:-bar7}
[ -d "$TREE/node_modules" ] || { echo "no node_modules in $TREE (npm ci there first)"; exit 2; }
echo "tree $(git -C "$TREE" rev-parse HEAD) · tree-hash $(git -C "$TREE" rev-parse 'HEAD^{tree}') · seeds $SEEDS ($(grep -c . "$SEEDS")) · read $READ"
HOLDERS=$P/holders.tipA.json sh "$P/census3.sh" "$TREE" "$S/render" 4 --seeds "$SEEDS" --count-only ${REUSE:+--reuse} > "$S/census.log" 2>&1; rc=$?
echo "census-exit=$rc"; [ "$rc" -eq 0 ] || { tail -5 "$S/census.log"; exit 1; }
rm -rf "$S/empty720" "$S/cal" "$S/publish"; mkdir -p "$S/empty720" "$S/cal" "$S/publish"
printf '' | gzip -n > "$S/empty720/corpus.ndjson.gz"
python3 "$P/build_packets5.py" "$S/empty720" "$S/render" "$S/cal" 16000 > "$S/packets.out" 2>&1; rc=$?
echo "packets-exit=$rc"; cat "$S/packets.out"; [ "$rc" -eq 0 ] || exit 1
python3 - "$S/cal" "$S/publish" "$READ" <<'PY' || exit 1
import io, os, re, sys, json, gzip
C, O, R = sys.argv[1:4]
d = json.load(io.open(C + '/index.json', encoding='utf-8'))
with gzip.GzipFile(os.path.join(O, 'index.%s.json.gz' % R), 'wb', mtime=0) as g: g.write(json.dumps({'cal': d['cal']}, ensure_ascii=False).encode('utf-8'))
man = []
for f in sorted(x for x in os.listdir(C) if re.match(r'^cal-\d+\.txt$', x)):
    b = io.open(os.path.join(C, f), 'rb').read(); n = f[4:6]
    with gzip.GzipFile(os.path.join(O, '%s-%s.txt.gz' % (R, n)), 'wb', mtime=0) as g: g.write(b)
    t = b.decode('utf-8'); towns = re.findall(r'^==== TOWN (\S+)', t, re.M)
    man.append('%s-%s %s %d towns %d lines: %s' % (R, n, f, len(towns), t.count('\n'), ' '.join(towns)))
io.open(os.path.join(O, 'MANIFEST.txt'), 'w', encoding='utf-8').write('\n'.join(man) + '\n')
print('\n'.join(man))
PY
echo "$(git -C "$TREE" rev-parse HEAD) $(git -C "$TREE" rev-parse 'HEAD^{tree}')" > "$S/publish/TREE.txt"
echo "done: $S/publish"
