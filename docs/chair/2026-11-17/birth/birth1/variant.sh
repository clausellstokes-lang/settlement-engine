#!/bin/sh
# sh variant.sh <label> : copy wt-tip's files into wt-var, apply the variant, birth into b/<label>
S=/tmp/claude-0/-home-user-settlement-engine/5055c99b-8231-592b-92f6-f61dec944beb/scratchpad; V=/home/user/wt-var; L=$1
for f in src/domain/facts/houseKinds.js src/generators/resourceGenerator.js src/domain/facts/houseInputAtHand.js src/domain/display/validationOnPage.js; do cp /home/user/wt-tip/$f $V/$f; done
H=$V/src/domain/facts/houseInputAtHand.js; R=$V/src/generators/resourceGenerator.js
case $L in
  *full*) sed -i "s#//@@SOURCE_FULL@@#if (sourceHouse) return 'missing';#" $H;;
  *narrow*) sed -i "s#//@@SOURCE_NARROW@@#if (sourceHouse) return 'missing';#" $H;;
esac
case $L in *words*) sed -i "s#//@@WORDS@@#if (sourceHouse) { const fed = imports.filter((imp) => !BUYER_IMPORT_WORDS.has(imp)); imports.length = 0; imports.push(...fed); }#" $H;; esac
case $L in *nospent*) sed -i 's#if (!onSpent.has(inst.name) ||#if (true ||#' $R;; esac
case $L in *noR2*) sed -i 's#if (brought.length) economicState#if (false) economicState#' $R;; esac
case $L in *noR5*) sed -i "s#if (chainKey === 'desertSalt' \&\& !spentGround#if (false \&\& !spentGround#" $H;; esac
rm -rf $S/b/$L; sh $S/births3.sh $V $S/b/$L
