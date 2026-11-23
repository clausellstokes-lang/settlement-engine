# genpack.py <wt> <fp before> <fp after> <section-1 sql> <timing sentence> : writes docs/chair/2026-11-13/veil-212/
import sys, os
wt, fpb, fpa, sec1p, timing = sys.argv[1:6]
D = os.path.join(wt, 'docs/chair/2026-11-13/veil-212'); os.makedirs(D, exist_ok=True)
mig = open(os.path.join(wt, 'supabase/migrations/212_share_veil_later_cures.sql'), encoding='utf8').read()
down = open(os.path.join(wt, 'supabase/rollback/212_share_veil_later_cures.down.sql'), encoding='utf8').read()
def vals(p):
    rows = [l.split('|') for l in open(p).read().split('\n') if l]
    return ',\n'.join("    ('%s', '%s')" % (s, h) for s, h in rows), len(rows)
vb, nb = vals(fpb); va, na = vals(fpa)
NEW10 = ['_gallery_veil_pieces', '_gallery_veil_embeds', '_gallery_veil_names', '_gallery_veil_hidden_name', '_gallery_veil_sources',
         '_gallery_veil_tie_pieces', '_gallery_veil_second_homes', '_gallery_veil_member_revealed', '_gallery_veil_roster_members', '_gallery_veil_roster_splice']
FP = """  select p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' as sig,
         md5(p.prosrc || '|' || p.provolatile::text || '|' || p.prosecdef::text || '|' || coalesce(array_to_string(p.proconfig, ';'), '')) as h
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and (p.proname like '\\_gallery\\_veil%%' or p.proname in ('_gallery_apply_member_overrides', 'get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map'))"""
def compare(values, n, label):
    return """with expected(sig, h) as (values
%s
), here as (
%s
)
select %d as functions_expected,
       (select count(*) from expected e join here h using (sig) where e.h = h.h) as matching,
       (select coalesce(string_agg(sig, ', ' order by sig), '') from expected e join here h using (sig) where e.h <> h.h) as different,
       (select coalesce(string_agg(sig, ', ' order by sig), '') from expected e where not exists (select 1 from here h where h.sig = e.sig)) as missing,
       (select coalesce(string_agg(sig, ', ' order by sig), '') from here h where not exists (select 1 from expected e where e.sig = h.sig)) as not_expected;
""" % (values, FP % (), n)
CALLABLE = """select count(*) as helpers,
       count(*) filter (where has_function_privilege('anon', p.oid, 'execute')
                           or has_function_privilege('authenticated', p.oid, 'execute')) as callable_by_readers
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.proname like '\\_gallery\\_veil%';
"""
sec1 = open(sec1p, encoding='utf8').read().split('\n')
# section (1)'s statements as 211's block one has them; its comment is this pack's own
sec1_sql = '\n'.join(l for l in sec1 if not l.startswith('--'))
D_COUNTS = """select
  (select count(*) from public.settlements s
    where s.is_public and s.gallery_share_dm and not (coalesce(s.gallery_member_overrides, '{}'::jsonb) ? '$veil')
      and exists (select 1 from jsonb_each(s.gallery_member_overrides) e where e.value -> 'revealDm' = 'false'::jsonb)) as d1_unmarked_reveal_shares_with_a_person_hidden,
  (select count(*) from public.settlements s
    where s.is_public and s.gallery_share_dm and (s.data ? 'customContentRoster' or s.data ? 'customContentProvenance')) as d2_reveal_shares_sending_custom_content,
  (select count(distinct s.id) from public.settlements s,
          jsonb_array_elements(case when jsonb_typeof(s.gallery_member_overrides #> '{$veil,deltas}') = 'array'
                                    then s.gallery_member_overrides #> '{$veil,deltas}' else '[]' end) e
    where (s.is_public or s.unlisted_slug is not null) and e -> 'hidden' = 'true'::jsonb
      and (e ->> 'address' like 'field:relationship:%' or e ->> 'address' like 'card:relationship:%' or e ->> 'address' like 'class:relationship:%')
      and (s.data ? 'prominentRelationship' or s.data ? 'pressureSentence')) as d3_shares_hiding_a_tie_with_a_second_home,
  (select count(*) from public.settlements s
    where (s.is_public or s.unlisted_slug is not null) and s.gallery_member_overrides ? '$veil'
      and jsonb_typeof(s.data #> '{economicState,activeChains}') = 'array' and jsonb_array_length(s.data #> '{economicState,activeChains}') > 0) as d4_veiled_shares_with_economy_chains;
"""
read_first = """-- ════════════════════════════════════════════════════════════════════════════════════════════
-- THE READ-ONLY CHECKS BEFORE MIGRATION 212 IS APPLIED (the owner's step; COHERENCE-VEIL-7).
-- NOT TO BE RUN BY ANYONE BUT THE OWNER, and only after a security reader has cleared this pack.
--
-- HOW TO RUN: in the hosted project's SQL editor, as the owner, the whole file at once, AFTER migration 211 has
-- been applied from its own pack (docs/chair/2026-11-13/APPLY-211/) and BEFORE 2-apply-212.sql. Every statement
-- READS: the transaction is READ ONLY (a write inside it is refused by the server, superuser included) and ends
-- in ROLLBACK, so pasting it whole can change nothing. Nothing here calls a function 211 or 212 creates.
-- EXECUTED on local scratch chains only (docs/chair/2026-11-13/veil-probe-7/out/pack-rehearsal.txt).
-- ════════════════════════════════════════════════════════════════════════════════════════════
begin transaction read only;
set local statement_timeout = '120s';

-- (1) THE REAL STATEMENT TIME LIMITS (the same queries as section (1) of 211's block one).
--     WORRIES: anon or authenticated under 1.5s (1500ms). 212 adds work to every veiled read.
--     %s
--     A timed-out read shows "This settlement is not available." and cannot be told from a missing town.
%s

-- (2) 211 IS IN PLACE, AS FROZEN, AND 212 IS NOT YET. Each function 211 left (its forty helpers, the four
--     reads and the member splice) against its fingerprint at 211 (the body, volatility, definer flag and
--     settings; grants are read in (3)), built on a local chain at 203 + 211 and equal on 001..211.
--     EXPECT: %d | %d | (empty) | (empty) | (empty).
--     STOP if `matching` is under %d, or `different` or `missing` names anything: production is not at the
--       211 the review cleared; tell the chair, with the names.
--     If `not_expected` names the ten helpers of 212 (_gallery_veil_pieces ... _gallery_veil_roster_splice)
--       and the five in `different` are get_gallery_dossier, import_gallery_dossier, _gallery_apply_member_overrides,
--       _gallery_veil_card and _gallery_veil_apply: 212 is ALREADY applied. Run 3-check-after.sql instead; do not
--       apply it again (it would change nothing, but there is nothing to do).
%s
-- (3) NO HELPER IS CALLABLE BY A READER. EXPECT: 40 | 0. STOP if the second number is above zero.
%s
-- (4) For your information, not a hold: what 212 closes, counted (the security review's block two, (D)).
--     d1  shares exported before the veil, Reveal DM on, with a person hidden by the per-person switch: 212
--         reduces that person's copy in the power roster to their public card;
--     d2  Reveal-DM shares whose town carries the author's custom-content records: 212 stops sending them;
--     d3  shares that hide a tie by hand and carry a prominentRelationship or a pressureSentence: the upper bound
--         of the shares where a hidden tie's words travel today and stop at 212;
--     d4  veiled shares whose town has an economy chain: the upper bound for a hidden house named in a chain.
%s
rollback;
""" % (timing, sec1_sql.strip(), nb, nb, nb, compare(vb, nb, 'before'), CALLABLE, D_COUNTS)
check_after = """-- ════════════════════════════════════════════════════════════════════════════════════════════
-- THE CHECKS AFTER MIGRATION 212 (the owner's step; COHERENCE-VEIL-7). Read only; ends in ROLLBACK.
-- NOT TO BE RUN BY ANYONE BUT THE OWNER.
-- ════════════════════════════════════════════════════════════════════════════════════════════
begin transaction read only;

-- (1) EXPECT: 50 | 0 (211's forty helpers and 212's ten; none callable by anon or authenticated).
%s
-- (2) Every function 212 leaves against its fingerprint at 211 + 212, built on a local chain at 203 + 211 + 212
--     (equal on 001..212, and equal to the lane's 211 as it stood at 28f52b1e4).
--     EXPECT: %d | %d | (empty) | (empty) | (empty). Anything else: run 4-rollback-ONLY-IF-NEEDED.sql and tell the chair.
%s
-- (3) EXPECT `search_path=public, pg_temp` on each of the four reads.
select proname, proconfig from pg_proc
 where proname in ('get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map');
rollback;
""" % (CALLABLE, na, na, compare(va, na, 'after'))
apply = 'begin;\n' + mig + 'commit;\n'
rb = 'begin;\n' + down + 'commit;\n'
for name, body in [('1-read-first.sql', read_first), ('2-apply-212.sql', apply), ('3-check-after.sql', check_after), ('4-rollback-ONLY-IF-NEEDED.sql', rb)]:
    open(os.path.join(D, name), 'w', encoding='utf8').write(body)
print('ok', nb, na)
