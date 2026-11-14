#!/bin/sh
D=/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/render-tip/dumps
for t in "$@"; do echo "######## $t"; sed -n '2p' $D/$t.txt | cut -c1-120; awk '/^== Summary\/Crisis ==/{f=1;next} /^== /{f=0} f' $D/$t.txt | cut -c1-260; done
