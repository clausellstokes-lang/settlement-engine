#!/bin/bash
# data-shape grep helper: $1 = pattern, rest = extra opts
cd /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/lane-longtail-recon-slot
SURF=(src/domain/settlement.schema.js src/domain/goods.schema.js src/domain/worldPulse/worldState.js src/domain/worldPulse/worldStateHydration.js src/domain/worldPulse/simulationRules.js src/domain/worldPulse/pulseShapes.js src/domain/worldPulse/worldSnapshot.js src/store src/domain/certification supabase tests/fixtures src/domain/campaignSchema.js)
grep -rniE "$1" "${SURF[@]}" 2>/dev/null
