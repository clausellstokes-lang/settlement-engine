#!/bin/zsh
cd /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/lane-longtail-recon-slot
for t in "$@"; do
  s=$(grep -rEil --include='*.js' --include='*.jsx' --include='*.ts' --include='*.sql' --include='*.json' -- "$t" src supabase 2>/dev/null | wc -l | tr -d ' ')
  te=$(grep -rEil --include='*.js' --include='*.jsx' -- "$t" tests 2>/dev/null | wc -l | tr -d ' ')
  d=$(grep -rEil -- "$t" docs 2>/dev/null | wc -l | tr -d ' ')
  printf "%-40s src=%-4s tests=%-4s docs=%-4s\n" "$t" "$s" "$te" "$d"
done
