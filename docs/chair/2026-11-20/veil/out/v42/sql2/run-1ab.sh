#!/bin/sh
# both red runs, in order, each its own mutex hold
D=$(cd "$(dirname "$0")" && pwd); sh $D/run-1a.sh; sh $D/run-1b.sh
