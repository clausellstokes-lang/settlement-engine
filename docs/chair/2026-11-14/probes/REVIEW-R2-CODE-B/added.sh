#!/bin/sh
# added.sh <repo> <commits file> <tip> <outdir>: for each src file touched by the stage's own commits, every line an own
# commit added that still stands at the tip, with its tip line number (grep -nF), one file per src file.
R=$1; C=$2; TIP=$3; O=$4; mkdir -p $O
cd $R
for c in $(cat $C); do git diff-tree -p --no-commit-id -U0 $c -- src/ | awk -v c=$(echo $c|cut -c1-9) '/^\+\+\+ b\//{f=substr($0,7);next} /^\+[^+]/ || /^\+$/{ if(f!="") print f "\t" c "\t" substr($0,2)}'; done > $O/all.tsv
cut -f1 $O/all.tsv | sort -u | while read f; do
  git show $TIP:$f > $O/tipfile 2>/dev/null || { echo "GONE $f"; continue; }
  out=$O/$(echo $f | tr / _).txt; : > $out
  awk -F'\t' -v f="$f" '$1==f' $O/all.tsv | cut -f2- | while IFS="$(printf '\t')" read c line; do
    t=$(printf '%s' "$line" | sed 's/^[[:space:]]*//'); [ ${#t} -lt 3 ] && continue
    n=$(grep -nF -- "$t" $O/tipfile | head -1 | cut -d: -f1); [ -n "$n" ] && printf '%s\t%s\t%s\n' "$n" "$c" "$t"; done | sort -n -u -k1,1 >> $out
done
wc -l $O/*.txt | tail -1
