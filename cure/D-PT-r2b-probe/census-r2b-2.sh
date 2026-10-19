# D-PT-r2b token census, part 2 (read-only). Run in the session shell (rg is a shell function).
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
D=/Users/cstokes/Desktop/settlement-engine/docs
for t in RECORD_CLEARING party_made_known_site party_revealed_site made_known banKeys fromIds party_cleared_site party_reached_site; do
  q="[\"'\`]${t}[\"'\`]"
  echo "$t  src-word=$(rg -l -w "$t" $M/src | wc -l | tr -d ' ')  src-quoted=$(rg -l "$q" $M/src | wc -l | tr -d ' ')  tests-word=$(rg -l -w "$t" $M/tests | wc -l | tr -d ' ')  master-docs=$(rg -l -w "$t" $M/docs | wc -l | tr -d ' ')  ledger-docs=$(rg -l -w "$t" $D | wc -l | tr -d ' ')"
done
echo "--- ledger-doc files naming party_revealed_site"; rg -l -w party_revealed_site $D
echo "--- ledger-doc files naming banKeys"; rg -l -w banKeys $D
