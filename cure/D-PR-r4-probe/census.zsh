# usage (zsh, sourced so the rg function exists): census <master> <ledgerdocs> tokens...
census() {
  local M=$1 L=$2; shift 2
  for t in "$@"; do
    local s=$(rg -w -l -- "$t" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
    local lit=$(rg -l -e "'$t'" -e "\"$t\"" -e "\`$t\`" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
    local te=$(rg -w -l -- "$t" "$M/tests" 2>/dev/null | wc -l | tr -d ' ')
    local md=$(rg -w -l -- "$t" "$M/docs" 2>/dev/null | wc -l | tr -d ' ')
    local ld=$(rg -w -l -- "$t" "$L" 2>/dev/null | wc -l | tr -d ' ')
    echo "$t | src-w $s · quoted-literal $lit · tests $te · master docs $md · ledger docs $ld"
  done
}
