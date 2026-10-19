#!/bin/zsh  (run by sourcing in a shell where rg is defined: `. measure.sh`)
# D-PL-r4 measurement-first probe: read-only greps against the master worktree (81f1cd963).
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
cd "$M" || exit 2
echo "## stage order (pulseKernel.js)"
rg -n "coupVerdictOutcomes\(\{|const applied = applyWorldPulseOutcomes\(\{|const armyTransit = advanceArmyTransit\(\{|const treatyAdvance = advanceTreatiesWithDisposition\(\{" src/domain/worldPulse/pulseKernel.js
echo "## computeAllyRelief per-ally term + homeDefense derivation"
rg -n "ALLY_RELIEF_FRACTION = |relief \+= |besiegedSet.has\(ally\)" src/domain/worldPulse/warCapacityReads.js
rg -n "const homeDefense = " src/domain/worldPulse/warCapacityReads.js
echo "## siteDefense on master (expect 0: ST's design)"
rg -c "siteDefense" src | wc -l
echo "## INTERVAL_WEEKS"
rg -n "one_week|one_season|one_year" src/domain/worldPulse/intervalWeeks.js | head -5
echo "## MEMORY_WEAVE_INCIDENT_TYPES"
rg -n -A3 "MEMORY_WEAVE_INCIDENT_TYPES" src/domain/worldPulse/relationshipEvolution.js | head -8
echo "## ESCALATION_HINT / WOUND_TYPE_RE"
rg -n "ESCALATION_HINT\s*=" src/domain/worldPulse/relationshipRuleHelpers.js
rg -n "WOUND_TYPE_RE\s*=" src/domain
echo "## token census (src / tests word hits)"
for t in peace_unkept riders_lent huntOrderOf liegeAnswer bannerStackOf siteReadiness01 SITE_READINESS at_strength crownNetOf peace_kept brigandage_exported; do
  s=$(rg -w -c "$t" src 2>/dev/null | awk -F: '{n+=$2} END{print n+0}')
  te=$(rg -w -c "$t" tests 2>/dev/null | awk -F: '{n+=$2} END{print n+0}')
  echo "$t src=$s tests=$te"
done
echo "## quoted 'body: prefix literals in src"
rg -n "'body:|\"body:|\`body:" src | head -5; echo "count: $(rg -c "'body:|\"body:|\`body:" src | wc -l)"
echo "## readiness01 (landed homonym) files"
rg -l -w "readiness01" src | wc -l
