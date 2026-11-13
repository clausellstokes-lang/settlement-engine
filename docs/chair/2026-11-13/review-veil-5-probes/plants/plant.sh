#!/bin/sh
# REVIEW-VEIL-5 — MY OWN FAULTS, planted in a throwaway worktree of 333b33973 (never on the lane), each alone, and the
# builder's composition pin (V5) run against it. A pin that stays green on a fault does not hold that fault's class.
#   plant.sh <throwaway worktree> <out dir> <fault> [vitest -t pattern, default V5]
# Faults (each one line added to migration 211's _gallery_veil_card or _gallery_veil_card_id):
#   A  a person ranked FIRST in a power (the powers lane's leader, new shape) keeps every field an eye shut
#   B  a person stored in MASTER'S shape (a factionAffiliation key) keeps every field an eye shut
#   C  a claimant's face (institution.kind = 'power') keeps every field an eye shut
#   D  a tie WITHOUT an id of its own is addressed by its ends swapped (master-shape ties lose their eyes)
#   E  the whole-card hide of a leader is dropped (a revealDm:false member that is ranked first is not a card delta)
set -u
WT=$1; OUT=$2; F=$3; PAT=${4:-V5}
M=$WT/supabase/migrations/211_server_side_share_veil.sql
git -C $WT checkout -q 333b33973 -- supabase/migrations/211_server_side_share_veil.sql
python3 - "$M" "$F" <<'PY'
import sys
p, f = sys.argv[1], sys.argv[2]
s = open(p).read()
anchor = "  if jsonb_typeof(cls) is distinct from 'array' then cls := '[]'; end if;\n"
assert s.count(anchor) == 1
if f == 'A': s = s.replace(anchor, anchor + "  if kind = 'npc' and c -> 'memberships' @> '[{\"rank\": 1}]' then return c; end if;\n")
elif f == 'B': s = s.replace(anchor, anchor + "  if kind = 'npc' and c ? 'factionAffiliation' then return c; end if;\n")
elif f == 'C': s = s.replace(anchor, anchor + "  if kind = 'npc' and c -> 'institution' ->> 'kind' = 'power' then return c; end if;\n")
elif f == 'D':
    a = "  if kind = 'relationship' then return public._gallery_veil_own_id(c, 'relationship', jsonb_build_array(\n      public._gallery_veil_or(c -> 'from', c -> 'npc1Id', c -> 'npc1Name'), public._gallery_veil_or(c -> 'to', c -> 'npc2Id', c -> 'npc2Name'), c -> 'type')); end if;"
    assert s.count(a) == 1
    s = s.replace(a, "  if kind = 'relationship' then return public._gallery_veil_own_id(c, 'relationship', jsonb_build_array(\n      public._gallery_veil_or(c -> 'to', c -> 'npc2Id', c -> 'npc2Name'), public._gallery_veil_or(c -> 'from', c -> 'npc1Id', c -> 'npc1Name'), c -> 'type')); end if;")
elif f == 'E':
    a = "     where p <> '$veil' and jsonb_typeof(ov -> p) = 'object' and ov -> p -> 'revealDm' = 'false'::jsonb\n"
    assert s.count(a) == 1
    s = s.replace(a, a.rstrip('\n') + "\n       and not exists (select 1 from jsonb_array_elements(case when jsonb_typeof(s -> 'npcs') = 'array' then s -> 'npcs' else '[]' end) n where public._gallery_veil_npc_id(n) = p and n -> 'memberships' @> '[{\"rank\": 1}]')\n")
else: raise SystemExit('unknown fault')
open(p, 'w').write(s)
PY
[ $? = 0 ] || { echo "PLANT $F: could not plant"; exit 2; }
( cd $WT && sh scripts/gate-tail.sh npx vitest run --maxWorkers=1 tests/security/galleryVeilCures.pglite.test.js -t "$PAT" ) > $OUT/plant-$F-$(echo $PAT | tr -c 'A-Za-z0-9' '_').log 2>&1
echo "PLANT $F against -t \"$PAT\": exit $? · $(grep -a -E 'Tests +[0-9]' $OUT/plant-$F-$(echo $PAT | tr -c 'A-Za-z0-9' '_').log | tail -1 | sed 's/\x1b\[[0-9;]*m//g')"
git -C $WT checkout -q 333b33973 -- supabase/migrations/211_server_side_share_veil.sql
