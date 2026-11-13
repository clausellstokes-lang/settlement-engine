#!/bin/sh
# plant.sh <name> <file> <python-replace-old> <python-replace-new|APPEND:text> : apply, run the walker, revert
cd /home/user/wt/plant
N=$1; F=$2; OLD=$3; NEW=$4
python3 - "$F" "$OLD" "$NEW" <<'PY'
import sys
f,old,new=sys.argv[1:4]; s=open(f).read()
if new.startswith('APPEND:'): s=s+'\n'+new[7:]+'\n'
else:
  assert s.count(old)==1, ('old not unique/found', s.count(old)); s=s.replace(old,new)
open(f,'w').write(s)
PY
npx vitest run tests/lint/factLayers.walker.test.js > /home/user/wt/probes/plant-$N.log 2>&1; E=$?
git checkout -q -- "$F"; git status --short | head -3
echo "PLANT $N exit=$E :: $(grep -E '^\s+(×|✓).*(KEY|READERS|POOLS by)' /home/user/wt/probes/plant-$N.log | grep '×' | sed 's/^ *//' | cut -c1-150 | tr '\n' ';')"
