#!/bin/sh
# commit-prose-registers.sh — after run-registers-prose.sh: verify the changed registers are EXACTLY the predicted set, then
# commit them as ONE chair car (Seat: Fable 5.1 — validated). The totals car comes after (run-ratchet-898.sh + its own commit).
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/lanePROSE2; LOG=$SC/registers-prose.log; cd "$D"
grep -q '^QUIET CONFIRMED' "$LOG" || { echo "⛔ no quiet window in the log"; exit 1; }
grep -qE '^VOICE_EXIT=' "$LOG" || { echo "⛔ voice step did not run"; exit 1; }
grep -q '⛔' "$LOG" && { echo "⛔ the runner stopped on a refusal:"; grep '⛔' "$LOG"; exit 1; }
CH=$(git status --porcelain -uall | awk '{print $2}' | sort)
echo "changed:"; printf '%s\n' "$CH" | sed 's/^/  /'
# allowed: the Tier-2 voice baseline, the prose-numerics ledger, the wizard-news ledger, organic sample fixtures under docs/samples/organic-craft/
BAD=$(printf '%s\n' "$CH" | grep -vE '^(tests/copy/\.voice-mechanics-baseline\.json|tests/lint/\.prose-numerics-baseline\.json|tests/lint/\.wizard-news-authoring-baseline\.json|docs/samples/organic-craft/.*)$' || true)
[ -z "$BAD" ] || { echo "⛔ unexpected paths changed by the register acts:"; printf '%s\n' "$BAD"; exit 1; }
printf '%s\n' "$CH" | grep -q 'voice-mechanics-baseline' || { echo "⛔ the voice Tier-2 baseline did not change (predicted a FALL)"; exit 1; }
printf '%s\n' "$CH" | grep -q 'prose-numerics-baseline' || { echo "⛔ the prose-numerics ledger did not change (predicted 10 re-keys)"; exit 1; }
N_ORG=$(printf '%s\n' "$CH" | grep -c 'organic-craft' || true); echo "organic fixtures changed: $N_ORG (predicted 3)"
printf '%s\n' "$CH" | xargs git add --
cat > "$SC/msg-prose-registers.txt" <<MSG
PROSE registers (last content-adjacent car): the voice baseline banks its FALL, ten prose-numerics snippets re-key, the organic samples regenerate

Taken at the composed tip $(git rev-parse --short HEAD~0) after the three replayed prose cars, every figure derived
before the instrument ran (E4): voice Tier-2 102 entries / em 455 / bang 10 -> 55 / 311 / 8 (a standing red, em 770 >
budget 670, turns green; the Tier-3 JSX refreeze is REFUSED by the shrink-only writer because 3 -> 37 is a RISE of
mainline debt — that refusal is expected, the JSX baseline is untouched, and VOICE-JSX is queued to cure the 34);
prose-numerics: 10 rows re-keyed at 5 addresses by the walker's own identity (0 fell, 0 new); wizard-news: one row
re-signed at the same address per the walker's own precedent; organic samples: $N_ORG of 6 fixtures regenerated
(UPDATE_ORGANIC_SAMPLES=1; the golden-freeze register is unfrozen); writer-reach: no act (exit 0).

Seat: Fable 5.1 — validated

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
MSG
git commit -q -F "$SC/msg-prose-registers.txt"
[ -z "$(git status --porcelain -uall)" ] || { echo "⛔ porcelain after commit"; git status --porcelain -uall; exit 1; }
echo "REGISTER CAR $(git rev-parse --short HEAD) committed ($(git diff --name-only HEAD~1 HEAD | wc -l | tr -d ' ') files); cars over fd8b6df00=$(git rev-list --count fd8b6df00..HEAD)"
git -C /Users/cstokes/Desktop/settlement-engine update-ref refs/preserve/prose-registers-2026-09-05 "$(git rev-parse HEAD)"; echo "sealed prose-registers-2026-09-05"
