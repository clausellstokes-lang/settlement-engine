#!/bin/zsh
# run by sourcing in a shell where rg is defined: `. measure-r5.sh` (rg is a shell function in this environment)
# D-PL-r5 measurement-first probe: read-only greps against the master worktree (81f1cd963) and the ledger docs.
M=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963
D=/Users/cstokes/Desktop/settlement-engine/docs
cd "$M" || exit 2
echo "## HEAD"; git -C "$M" rev-parse HEAD
echo "## token census (src / tests / worktree docs / ledger docs word hits)"
for t in oathSince riders_quartered weeksCovered reliefAnswerOf huntOrderOf peace_unkept; do
  s=$(rg -w -c "$t" src 2>/dev/null | awk -F: '{n+=$2} END{print n+0}')
  te=$(rg -w -c "$t" tests 2>/dev/null | awk -F: '{n+=$2} END{print n+0}')
  wd=$(rg -w -c "$t" docs 2>/dev/null | awk -F: '{n+=$2} END{print n+0}')
  ld=$(rg -w -l "$t" "$D" 2>/dev/null | xargs -n1 basename 2>/dev/null | tr '\n' ' ')
  echo "$t src=$s tests=$te worktree-docs=$wd ledger-docs-files: $ld"
done
echo "## landed regexes"
rg -n "const ESCALATION_HINT|const DEESCALATION_HINT" src/domain/worldPulse/relationshipRuleHelpers.js
rg -n "const WOUND_TYPE_RE" src/domain/worldPulse/grievanceRead.js
echo "## the seniority-stamp clear inside the one relationship writer (oathSince's clear sits beside it)"
rg -n "a transition away from vassal/patron clears them|if \(outcome.proposalPayload.toType !== \"vassal\"\)|if \(patch.overlordSaveId === undefined\) patch.overlordSaveId = null" src/domain/worldPulse/relationshipEvolution.js
rg -n "^export function applyRelationshipPatch" src/domain/worldPulse/relationshipEvolution.js
echo "## stage order: rumor -> calamity (MN's leaf) -> army transit -> polity stage (pulseKernel.js)"
rg -n "advanceRumorLedgers\(|const calamity = advanceCalamity\(\{|const armyTransit = advanceArmyTransit\(\{|const treatyAdvance = advanceTreatiesWithDisposition\(\{" src/domain/worldPulse/pulseKernel.js | head -8
echo "## a hop is at least one tick (rumor travel)"
rg -n "const travelTicks = Math.max\(1" src | head -3
echo "## computeAllyRelief reads the snapshot's worldState; the polity stage host receives the snapshot"
rg -n "export function computeAllyRelief|snapshot\?\.worldState\?\.relationshipStates" src/domain/worldPulse/warCapacityReads.js | head -4
rg -n "export function advanceTreatiesWithDisposition" src/domain/worldPulse/dispositionChannels.js
echo "## INTERVAL_WEEKS"
rg -n "one_month|one_season|one_year" src/domain/worldPulse/intervalWeeks.js | head -4
echo "## raid kinds on master (the war volume's designed kinds: expect 0 built)"
echo "bought_off src hits: $(rg -c 'bought_off' src | wc -l)"; echo "'supply_raid' quoted src hits: $(rg -c "'supply_raid'" src | wc -l)"
echo "## the fold's two raid rows (ledger)"
rg -n '^\| `raid` \||^\| `supply_raid` \||^\| `road` \| `armies_meet`' "$D/DESIGN_FP_COHERENCE_FOLD.md" | cut -c1-260
