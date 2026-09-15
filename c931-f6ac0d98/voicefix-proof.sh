#!/bin/sh
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad
MY=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad
D=$SC/kit/laneCONSIST-930; cd $D || exit 9
echo "HEAD=$(git rev-parse --short HEAD) dirty=[$(git status --porcelain | awk '{print $2}' | tr '\n' ' ')] $(uptime)"
echo "=== PROOF: the voice suite whole + every suite the seven files feed ==="
sh scripts/gate-mutex.sh --run -- npx vitest run tests/copy tests/domain/npcInteriorityRead.test.js tests/domain/display/relationshipChronicle.test.js tests/components/npcTrailSection.test.jsx tests/components/relationshipChronicleSection.test.jsx tests/components/warFaithSurfacing.test.jsx tests/components/advanceReport.test.jsx tests/lint/vocabularyTotality.walker.test.js tests/lint/negativeAssertionAnchor.walker.test.js 2>&1 | grep -vE '^\s*$' | tail -14
echo "PROOF_DONE $(uptime)"
echo "=== ESLINT ==="; npx eslint src/components/map/NpcTrailSection.jsx src/components/map/RelationshipChronicleSection.jsx src/domain/display/npcInteriorityRead.js src/domain/display/humanizeEngineTokens.js && echo "ESLINT_OK" || echo "ESLINT_RED"
echo "=== NEGATIVE CONTROL: the voice suite at the committed tip (no fix) in a throwaway worktree ==="
NC=$MY/nc-voice-$(git rev-parse --short HEAD); git worktree add --detach $NC HEAD >/dev/null 2>&1; ln -s $D/node_modules $NC/node_modules 2>/dev/null
( cd $NC && sh $D/scripts/gate-mutex.sh --run -- npx vitest run tests/copy/voiceMechanics.test.js 2>&1 | grep -E 'baseline em:|Test Files|Tests ' | grep -v '^+' | head -12 )
git worktree remove --force $NC 2>/dev/null; git worktree prune
echo "ALL_DONE $(uptime)"
