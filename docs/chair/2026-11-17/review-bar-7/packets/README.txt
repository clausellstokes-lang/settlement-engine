REVIEW-BAR-7's PACKETS (PREP-READ-7, 2026-11-17): thirty FRESH towns (seeds.bar7.txt: the ten shapes of the sixth read's
seeds.bar6.txt, three new seeds each: rand-45, rand-46, rand-47), born and rendered with PAGE-COPY's census3.sh (the mended
reading copy) and packed by PAGE-COPY's build_packets5.py at 16000 words a packet, exactly as bar6_at.sh packed the sixth read.

THE TREE: the working line's ed1d43529bdfcf6e513bb2eb234c5a4c0305746d with the supply rule merged LOCALLY, never pushed:
  git worktree add --detach <t7> ed1d43529bdfcf6e513bb2eb234c5a4c0305746d
  cd <t7> && git -c commit.gpgsign=false merge --no-ff --no-edit 8b0506eae      (git fetch origin lane/birth-3-2026-11-17)
  git rev-parse HEAD^{tree}  ->  4a9735d2f9ed4ef8e21aa19ec145de2e719e11f0  (read; the merge commit itself was 0c85eb6fb, local)
  npm ci
THE COMMAND (from the lane's root; 30 seeds, 4 workers, births+render about two minutes):
  sh docs/chair/2026-11-17/review-bar-7/packets/bar7_at.sh <t7> <scratch>      -> census-exit=0, packets-exit=0, <scratch>/publish
  cp <scratch>/publish/{bar7-*.txt.gz,index.bar7.json.gz,MANIFEST.txt} docs/chair/2026-11-17/review-bar-7/packets/
  At another tree: the same command with that tree; the files are replaced whole (the packet count may change: remove the old set first).
THE SET: 22 packets, bar7-01 .. bar7-22 (MANIFEST.txt: packet, the builder's file, towns, lines, the towns); 318669 words; the
  ids C0001.. run across the thirty towns in seed order; index.bar7.json.gz holds {"cal": {id: {town, section, text}}} (the id map
  bar7_merge.py reads). The gzip files are written with mtime 0 (the same tree and seeds give the same bytes).
THE 720: build_packets5.py's first argument (a render of the census's 720) feeds only its main and crisis packets and the index's
  "ids"; the bar's packets (cal-NN) and the index's "cal" read the second argument alone. bar7_at.sh gives it an EMPTY corpus.
  PROVEN on the sixth read (../PROOF-P1.txt): the sixth's thirty rendered at cfc2b680a and packed this way give the published
  packets13/bar6-01..21.txt.gz and index.bar6.json.gz byte-for-byte (uncompressed: 21 of 21 equal, the index equal).
THE MERGE after the read: python3 docs/chair/2026-11-17/review-bar-7/bar7_merge.py --read bar7 --packets docs/chair/2026-11-17/review-bar-7/packets
  --census <scratch>/render --flags-dir <dir of bar7-NN.<a|b>.flags.jsonl> --out <dir>      (or --repo with --branch-fmt/--path-fmt)
  (--census: the render of THIS tree, for the towns' names and tiers; the counts themselves read only the index and the flags.)
