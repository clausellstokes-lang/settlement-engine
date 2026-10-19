# D-PT-r2b token census (read-only). Run with `source` in the session shell: rg is a session
# shell function (a bare `bash` subshell has no rg and prints zeros).
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
D=/Users/cstokes/Desktop/settlement-engine/docs
for t in fromIds corps; do
  q="[\"'\`]${t}[\"'\`]"
  echo "$t  src-word-files=$(rg -l -w "$t" $M/src | wc -l | tr -d ' ')  src-quoted-files=$(rg -l "$q" $M/src | wc -l | tr -d ' ')  tests-word-files=$(rg -l -w "$t" $M/tests | wc -l | tr -d ' ')  master-docs=$(rg -l -w "$t" $M/docs | wc -l | tr -d ' ')  ledger-docs=$(rg -l -w "$t" $D | wc -l | tr -d ' ')"
done
echo "--- fromIds hits (tests, ledger docs)"; rg -n -w fromIds $M/tests $D | cut -c1-220
echo "--- quoted 'u:' prefix literals in master src"; up="[\"'\`]u:"; rg -n "$up" $M/src | head -10; echo "count=$(rg -l "$up" $M/src | wc -l | tr -d ' ')"
echo "--- corps (word) in master src"; rg -n -w corps $M/src | cut -c1-200
