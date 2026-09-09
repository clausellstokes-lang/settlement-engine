#!/bin/sh
# consist-defense.sh <block-dock> [<block-dock> ...] — THE 8b CONSIST: fold each landed block dock's ANNEX diff into the
# consist dock laneRW-DEF (cut at the §919 CAS f73bdbf16), regenerate the leaves ONCE per block, and commit one car per block.
# WHY THE ANNEX DIFF AND NOT A CHERRY-PICK: every block dock regenerates the six leaves wholesale, so two blocks' leaf
# commits conflict on every line; the annex, by contrast, is edited section by section (one block per section), so its
# hunks are disjoint and apply cleanly. The leaves are a projection of the annex and are rebuilt here by the projector,
# never carried. Tests a block re-seeded (tests/ui, tests/domain) are carried as their own diff and must apply cleanly or stop.
# Every step prints; a failure stops before the commit. The register rituals (census re-take, lighting, OSR, the manifest
# amendment) are the CHAIR's register car after the last block, never inside a block car.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
BASE=f73bdbf16; D=$SC/laneRW-DEF; ANNEX=docs/content/RECEIPT_POOLS_DOSSIER_STATE.md
[ -d "$D" ] || sh $SC/mkdock.sh laneRW-DEF $BASE
cd "$D"; [ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: consist dock dirty"; exit 8; }
for B in "$@"; do
  BD=$SC/$B; BLOCK=$(python3 -c "import re,sys;print(re.sub(r'^laneRW-','DS-',sys.argv[1]).replace('DEF','DEF-'))" "$B")
  TIP=$(git -C "$BD" rev-parse --short HEAD); N=$(git -C "$BD" rev-list --count $BASE..HEAD)
  echo "=== $B ($BLOCK) tip $TIP · $N commits over $BASE"
  [ -z "$(git -C "$BD" status --porcelain -uall)" ] || { echo "REFUSED: $B dirty"; exit 8; }
  git -C "$BD" diff $BASE..HEAD -- "$ANNEX" > $SC/rewrite/consist-$B.annex.diff
  git -C "$BD" diff $BASE..HEAD -- tests > $SC/rewrite/consist-$B.tests.diff
  echo "  annex diff $(wc -l < $SC/rewrite/consist-$B.annex.diff) lines · tests diff $(wc -l < $SC/rewrite/consist-$B.tests.diff) lines"
  git apply --check $SC/rewrite/consist-$B.annex.diff || { echo "REFUSED: $B annex diff does not apply cleanly — stop and read"; exit 7; }
  git apply $SC/rewrite/consist-$B.annex.diff
  if [ -s $SC/rewrite/consist-$B.tests.diff ]; then git apply --check $SC/rewrite/consist-$B.tests.diff || { echo "REFUSED: $B tests diff conflicts — stop and read"; exit 7; }; git apply $SC/rewrite/consist-$B.tests.diff; fi
  node scripts/generate-dossier-state-prose.mjs > $SC/rewrite/consist-$B.project.log 2>&1 || { tail -5 $SC/rewrite/consist-$B.project.log; echo "REFUSED: the projector refused $B's rows"; exit 6; }
  node scripts/generate-dossier-state-prose.mjs --check > /dev/null 2>&1 || { echo "REFUSED: --check red after $B"; exit 6; }
  git add "$ANNEX" src/data/dossierStateProse/ tests 2>/dev/null || true
  git commit -q -F - <<MSG
REWRITE 8b $BLOCK: the block's rewritten rows folded into the defense consist ($N commits in $B, tip $TIP; the leaves regenerated here by the projector)

The annex diff of $B over $BASE applied as disjoint hunks; the six leaves rebuilt by generate-dossier-state-prose.mjs and --check green; the block's re-seeded tests carried as their own diff. The block's JUDGMENT.md ($SC/rewrite/$BLOCK/JUDGMENT.md) is the record of every keep and revert; the chair's fold over it stands at SITTING §V.

Seat: Opus 5 — Fable-unvalidated
Lane: REWRITE-8b

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
  echo "  -> $(git rev-parse --short HEAD) · porcelain $(git status --porcelain -uall | wc -l | tr -d ' ')"
done
echo "CONSIST at $(git rev-parse --short HEAD): $(git rev-list --count $BASE..HEAD) cars over $BASE"
