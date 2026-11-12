import re, sys
mig, bodies, out = sys.argv[1:4]
m = open(mig).read()
sigs = sorted(set(re.findall(r"^create or replace function (public\._gallery_veil[a-z_]*)\(([^)]*)\)", m, re.M)))
def types(args):
    ts=[]
    for a in [x.strip() for x in args.split(',') if x.strip()]:
        a = re.sub(r'\s+default\s+.*$', '', a)
        ts.append(a.split()[-1])
    return ', '.join(ts)
drops = '\n'.join(f"drop function if exists {n}({types(a)});" for n, a in sigs)
b = open(bodies).read().rstrip()
head = """-- 211_server_side_share_veil.down.sql — reversal for migration 211 (COHERENCE-VEIL).
--
-- DATA-SAFE and WHOLE, per supabase/rollback/README.md: 211 wrote no row, column, constraint or
-- policy, so its reversal is entirely schema: the four reads it restated go back to their previous
-- bodies, then every helper it created is dropped.
--
-- ORDER (last in, first out): run this BEFORE reversing 210, 207, 206, 205 or 208's set. 211 restates
-- 208's party-link read, so undoing 208 first would leave this script recreating a body that is no
-- longer the one 211 replaced. The reads go back FIRST because they call the helpers; dropping a
-- helper first would leave them raising "function does not exist" for the width of the script.
--
-- THE BODIES are pg_get_functiondef of a chain stopped at 210 (001..210 applied in order): the net-
-- current definitions of migrations 147 (get_gallery_dossier, its bare `set search_path = public`
-- included), 208 as amended (get_unlisted_dossier), 131 (import_gallery_dossier) and 088
-- (get_gallery_map). CREATE OR REPLACE keeps each function's grants, which 211 restated unchanged;
-- they are restated here too, as the migrations that made them state them.
--
-- PROVEN BY EXECUTION: tests/security/galleryVeilCures.pglite.test.js applies 001..211, runs this
-- file, and compares every function in `public` (body, volatility, definer flag, settings, grants,
-- owner) and the four reads' full definitions with a chain stopped at 210: equal, byte for byte.
--
-- NOT reversed, because there is nothing to: no stored row was written by 211. The new client draws a
-- share without the served marker (v 1) as it did before 211, so no client revert goes with this.

-- ── 1. the four reads at their previous bodies ──────────────────────────────────────────────────
"""
grants = """
revoke execute on function public.get_gallery_dossier(text) from public;
grant execute on function public.get_gallery_dossier(text) to authenticated, anon;
grant execute on function public.get_unlisted_dossier(text) to authenticated, anon;
revoke execute on function public.import_gallery_dossier(text) from public;
grant execute on function public.import_gallery_dossier(text) to authenticated;
grant execute on function public.get_gallery_map(text) to anon, authenticated;

-- ── 2. the helpers 211 created, every one, by signature ─────────────────────────────────────────
"""
open(out,'w').write(head + b + '\n' + grants + drops + '\n')
print(len(sigs))
