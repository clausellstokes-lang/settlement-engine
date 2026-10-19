#!/bin/sh
# census-r2: tokens D-PT-r2 mints or re-uses; counts quoted-literal files in src, word files in src / tests / ledger docs
M="$1"  # NOTE: run under zsh with the session rg; plain sh lacks rg on PATH; L=/Users/cstokes/Desktop/settlement-engine/docs
for t in partySeq party_cleared_site party_revealed_site party_reached_site refoldPartyCredibility seq credited site_revealed made_good fell_short correctsRef voidsRef; do
  q=$(rg -l -e "['\"\`]$t['\"\`]" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  s=$(rg -l -w "$t" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  te=$(rg -l -w "$t" "$M/tests" 2>/dev/null | wc -l | tr -d ' ')
  d=$(rg -l -w "$t" "$L" 2>/dev/null | wc -l | tr -d ' ')
  echo "$t quoted_src=$q word_src=$s word_tests=$te ledger_docs=$d"
done
