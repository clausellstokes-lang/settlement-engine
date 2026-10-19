# (run with: set -- W L words...; source tokenCensus.sh  — rg is a zsh function in this harness)
# R2 token census: rg -w -i file counts over the master worktree src/tests/docs and the ledger docs,
# plus string-literal identifier hits in src ('word' or 'word_x' / 'x_word' inside quotes).
W="$1"; L="$2"; shift 2
for t in "$@"; do
  s=$(rg -i -l -w -- "$t" "$W/src" --glob '!**/*.test.*' 2>/dev/null | wc -l | tr -d ' ')
  te=$(rg -i -l -w -- "$t" "$W/tests" 2>/dev/null | wc -l | tr -d ' ')
  d=$(rg -i -l -w -- "$t" "$W/docs" 2>/dev/null | wc -l | tr -d ' ')
  ld=$(rg -i -l -w -- "$t" "$L" 2>/dev/null | wc -l | tr -d ' ')
  lit=$(rg -o -N --no-filename -- "['\"][a-z_]*\b$t[a-z_]*['\"]" "$W/src" --glob '!**/*.test.*' 2>/dev/null | sort | uniq -c | sort -rn | head -4 | awk '{printf "%s×%s ", $2, $1}')
  printf '%s\tsrc=%s\ttests=%s\twtdocs=%s\tledgerdocs=%s\tliterals: %s\n' "$t" "$s" "$te" "$d" "$ld" "$lit"
done
