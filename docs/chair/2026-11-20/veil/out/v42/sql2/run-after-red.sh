#!/bin/sh
# wait for both reds' EXIT lines (red first, in time), then every green step
D=$(cd "$(dirname "$0")" && pwd)
until grep -q '^EXIT' $D/logs/1b-ctrl-red.log 2>/dev/null; do sleep 30; done
sh $D/run-green.sh "$@"
