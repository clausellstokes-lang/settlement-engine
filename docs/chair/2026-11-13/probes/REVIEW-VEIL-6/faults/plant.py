#!/usr/bin/env python3
"""REVIEW-VEIL-6 — one fault, planted alone in a THROWAWAY worktree of the lane (never the lane itself).
   plant.py <worktree> <fault>
F1  212: _gallery_veil_second_homes returns its input (the server withholds no second home)
F2  the client twin: withholdSecondHomes returns at once (the client withholds no second home)
F3  212: _gallery_veil_hidden_name knows a hidden house by its own spelling only (the eleventh home's rule is off)
F4  212: the Reveal-DM strip keeps customContentRoster and customContentProvenance (V5-3 undone)
F5  212: _gallery_veil_roster_splice returns its input (V5-4 undone)
F6  the composer draws every site from the OWNER's record again (V5-2 undone)
F7  212's down file no longer drops _gallery_veil_second_homes (a helper left behind by the rollback)
"""
import sys
wt, fault = sys.argv[1], sys.argv[2]
UP = f'{wt}/supabase/migrations/212_share_veil_later_cures.sql'; DOWN = f'{wt}/supabase/rollback/212_share_veil_later_cures.down.sql'
def edit(path, old, new, count=1):
    s = open(path).read(); assert s.count(old) >= count, f'{fault}: anchor found {s.count(old)} times in {path}'
    open(path, 'w').write(s.replace(old, new) if count != 1 else s.replace(old, new, 1))
if fault == 'F1':
    edit(UP, "  named jsonb;\nbegin\n", "  named jsonb;\nbegin\n  return s; -- REVIEW-VEIL-6 FAULT F1\n")
elif fault == 'F2':
    edit(f'{wt}/src/domain/display/gallerySecondHomes.js', "export function withholdSecondHomes(s, src, gone, openNames, houseFields) {\n", "export function withholdSecondHomes(s, src, gone, openNames, houseFields) {\n  if (s) return; // REVIEW-VEIL-6 FAULT F2\n")
elif fault == 'F3':
    edit(UP, "where g = q.v or position(left(lower(q.v), 12) in lower(g)) > 0)\n     and not exists", "where g = q.v)\n     and not exists")
elif fault == 'F4':
    edit(UP, "- array['decrees', 'dmLayer', 'customContentRoster', 'customContentProvenance']", "- array['decrees', 'dmLayer']", count=2)
elif fault == 'F5':
    edit(UP, "returns jsonb language plpgsql immutable as $$\nbegin\n  if not coalesce(share_dm, false) or jsonb_typeof(doc) is distinct from 'object' then return doc; end if;", "returns jsonb language plpgsql immutable as $$\nbegin\n  return doc; -- REVIEW-VEIL-6 FAULT F5\n  if not coalesce(share_dm, false) or jsonb_typeof(doc) is distinct from 'object' then return doc; end if;")
elif fault == 'F6':
    edit(f'{wt}/src/components/new/publicProseCompose.js', "const source = ctx.veiledRecord || settlement;", "const source = settlement; // REVIEW-VEIL-6 FAULT F6")
elif fault == 'F7':
    edit(DOWN, "drop function if exists public._gallery_veil_second_homes(jsonb, jsonb, jsonb);\n", "")
else: raise SystemExit('unknown fault')
print('planted', fault)
