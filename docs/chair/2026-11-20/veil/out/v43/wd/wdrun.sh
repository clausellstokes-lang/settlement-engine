#!/bin/sh
# VEIL-43: run chain B's whole-document comparer (meas.sh, meas.probe.jsx, meas-an.mjs, UNCHANGED from aa5e3f30f on
# lane/veil-42-2026-11-23-meas-wip; personIdBijection.shared.mjs from the same commit) on the JOINED tree. meas.sh resolves
# its helpers by paths relative to its own directory, so it is run from a scratch mirror of the same depth:
#   <mirror>/docs/chair/2026-11-20/veil/out/v43/wd/{the three}  <mirror>/docs/chair/2026-11-20/veil/out/v27/tell/  <mirror>/tests/security/personIdBijection.shared.mjs
#   sh wdrun.sh <tree> <outdir> <tpl> <set> [dir]      (env MEAS_BIJ etc. pass through)
H=$(cd "$(dirname "$0")" && pwd); C=$(cd $H/../../../../../.. && pwd); R=/var/tmp/v18/wdmirror
mkdir -p $R/docs/chair/2026-11-20/veil/out/v43/wd $R/docs/chair/2026-11-20/veil/out/v27 $R/tests/security
cp $H/meas.sh $H/meas.probe.jsx $H/meas-an.mjs $R/docs/chair/2026-11-20/veil/out/v43/wd/
rm -rf $R/docs/chair/2026-11-20/veil/out/v27/tell && cp -r $C/docs/chair/2026-11-20/veil/out/v27/tell $R/docs/chair/2026-11-20/veil/out/v27/
cp $H/personIdBijection.shared.mjs $R/tests/security/
sh $R/docs/chair/2026-11-20/veil/out/v43/wd/meas.sh "$@"
