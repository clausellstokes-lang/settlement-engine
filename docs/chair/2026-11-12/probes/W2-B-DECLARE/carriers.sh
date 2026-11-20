#!/bin/sh
# Build variants of the walker's shared module with a reduced carrier set and compare arm-1 hits.
L=$1; OUT=$2
cd $L/tests/lint
for v in full enforced nomarks nocast norequires notags; do
  case $v in
    full) S="'needs', 'excludes', 'tags', 'marks', 'cast', 'poolDeclares', 'requires'";;
    enforced) S="'needs', 'excludes', 'poolDeclares'";;
    nomarks) S="'needs', 'excludes', 'tags', 'cast', 'poolDeclares', 'requires'";;
    nocast) S="'needs', 'excludes', 'tags', 'marks', 'poolDeclares', 'requires'";;
    norequires) S="'needs', 'excludes', 'tags', 'marks', 'cast', 'poolDeclares'";;
    notags) S="'needs', 'excludes', 'marks', 'cast', 'poolDeclares', 'requires'";;
  esac
  sed "s/const DECL_PROPS = new Set(\[.*\]);/const DECL_PROPS = new Set([$S]);/; s#export const ARM1_ROOTS = Object.freeze(\[.*\]);#export const ARM1_ROOTS = Object.freeze(['src/data', 'src/generators', 'src/domain', 'src/components']);#" presumedThings.shared.mjs > .probe-$v.mjs
done
cat > .probe-run.mjs <<'JS'
import { writeFileSync } from 'node:fs';
const out = {};
for (const v of ['full','enforced','nomarks','nocast','norequires','notags']) {
  const m = await import(`./.probe-${v}.mjs`);
  out[v] = m.scanTree(process.argv[2]);
}
writeFileSync(process.argv[3], JSON.stringify(out));
JS
node .probe-run.mjs $L $OUT; echo exit $?
rm -f .probe-*.mjs
