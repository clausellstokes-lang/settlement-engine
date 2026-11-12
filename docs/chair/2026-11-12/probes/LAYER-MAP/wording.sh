#!/bin/sh
# LAYER-MAP wording.sh — REGEX shape counts: code that tests or parses already-chosen prose to decide what to say.
# (a) a string test on a prose field; (b) a regex .test() on a prose field; (c) a first-word / split-word test;
# (d) a display label matched by its text. Over src/, comments included (a shape count). Run from the tree root.
P='(sentence|text|line|lineText|desc|description|phrasing|summary|narrative|reason|note|prose|situationDesc|pressureSentence|arrivalScene)'
a=$(grep -rEn --include=*.js --include=*.jsx "\.${P}\b[^;]{0,30}\.(includes|startsWith|endsWith|match|indexOf|search)\(" src | grep -v '^\S*:\s*\*' )
b=$(grep -rEn --include=*.js --include=*.jsx "\.test\(\s*[A-Za-z_.?]*\.${P}\b" src | grep -v '^\S*:\s*\*')
c=$(grep -rEn --include=*.js --include=*.jsx "split\(\s*(/\\\\s\+/|' ')\s*\)\[0\]" src | grep -v '^\S*:\s*\*')
d=$(grep -rEn --include=*.js --include=*.jsx "\.label\b\s*(===|!==)\s*['\"]|\.label\)?\s*\.(includes|startsWith|match)\(|\.test\(\s*[A-Za-z_.?]*\.label\b" src | grep -v '^\S*:\s*\*')
for k in a b c d; do eval "v=\$$k"; n=$(printf '%s\n' "$v" | grep -c . ); f=$(printf '%s\n' "$v" | grep . | cut -d: -f1 | sort -u | wc -l); echo "$k lines $n files $f"; done
printf '%s\n' "$a" "$b" "$c" "$d" | grep . | cut -d: -f1 | sed 's#^src/\([a-z]*\)/.*#\1#' | sort | uniq -c
printf '%s\n' "$a" "$b" "$c" "$d" | grep . > "${OUT:-/dev/null}"
