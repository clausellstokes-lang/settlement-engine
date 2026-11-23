-- ════════════════════════════════════════════════════════════════════════════════════════════
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
--     Measured on a local scratch PostgreSQL 16 under load (not your server's figure), the same 96 stored shares
--     (every eye shut, master's shape) at 203 + 211 and at 203 + 211 + 212, the slowest of each read: gallery 310 -> 342 ms,
--     import 176 -> 193, link 147 -> 161, map 1,618 -> 1,639 (a map read here is slow at 211 alone too). 212 adds about a tenth.
--     A timed-out read shows "This settlement is not available." and cannot be told from a missing town.
select r.rolname, r.rolconfig as role_settings,
       (select array_agg(array_to_string(s.setconfig, ',')) from pg_db_role_setting s
         where s.setrole = r.oid and s.setdatabase in (0, (select oid from pg_database where datname = current_database()))) as role_in_db_settings
  from pg_roles r where r.rolname in ('anon', 'authenticated', 'authenticator', 'service_role') order by 1;
select (select array_to_string(s.setconfig, ',') from pg_db_role_setting s
          where s.setrole = 0 and s.setdatabase = (select oid from pg_database where datname = current_database())) as every_role_in_this_db,
       (select reset_val || coalesce(' ' || unit, '') from pg_settings where name = 'statement_timeout') as server_default_at_session_start;

-- (2) 211 IS IN PLACE, AS FROZEN, AND 212 IS NOT YET. Each function 211 left (its forty helpers, the four
--     reads and the member splice) against its fingerprint at 211 (the body, volatility, definer flag and
--     settings; grants are read in (3)), built on a local chain at 203 + 211 and equal on 001..211.
--     EXPECT: 45 | 45 | (empty) | (empty) | (empty).
--     STOP if `matching` is under 45, or `different` or `missing` names anything: production is not at the
--       211 the review cleared; tell the chair, with the names.
--     If `not_expected` names the ten helpers of 212 (_gallery_veil_pieces ... _gallery_veil_roster_splice)
--       and the five in `different` are get_gallery_dossier, import_gallery_dossier, _gallery_apply_member_overrides,
--       _gallery_veil_card and _gallery_veil_apply: 212 is ALREADY applied. Run 3-check-after.sql instead; do not
--       apply it again (it would change nothing, but there is nothing to do).
with expected(sig, h) as (values
    ('_gallery_apply_member_overrides(base jsonb, dm_full jsonb, overrides jsonb, settlement_share_dm boolean, settlement_importable boolean, for_import boolean)', '3266d10a7273441ac9e2d19d829005d9'),
    ('_gallery_veil(pub jsonb, overrides jsonb, link boolean, copy boolean)', 'a66f4c4c2a834abe4811154c0902d481'),
    ('_gallery_veil_apply(pub jsonb, res jsonb)', 'b77f49a93820d4a141654d9c4b11de64'),
    ('_gallery_veil_card(kind text, c jsonb, cls jsonb, byid jsonb, excj jsonb, legacy jsonb)', '11d92b276fbaa93934fbe0bf09903266'),
    ('_gallery_veil_card_id(kind text, c jsonb)', '21c596870b11a149b11f2a691fc4acc0'),
    ('_gallery_veil_cards(s jsonb, kind text)', '9c8d7609ad4eaa6ace535259020c8ad2'),
    ('_gallery_veil_clandestine(i jsonb)', 'dfa49188eefd97f060085d5ae01d67ed'),
    ('_gallery_veil_copy_bound()', 'facd9901248223b52bbd53c66ba77ff7'),
    ('_gallery_veil_criminal(i jsonb)', '32dcdde97259d4366789fe6d2e6efec7'),
    ('_gallery_veil_drop_hooks(j jsonb)', '56cb75a2107cb09c3b8c6836c6c0fb8b'),
    ('_gallery_veil_facet(e jsonb, k text)', '8ee2dce9d4170edb2d656cbcbfe66be2'),
    ('_gallery_veil_grouping(s jsonb, g text)', 'ed04449d0ef875bcc30f16fb1610556a'),
    ('_gallery_veil_groupings()', 'ce45552b85f07038d31f7a5f92df469d'),
    ('_gallery_veil_hideable(a text)', 'bd7e0190761e8fa8fc6710ef18410e8c'),
    ('_gallery_veil_hideable_p(p jsonb, a text)', 'a60811789479e1fe04cf530e79e6f970'),
    ('_gallery_veil_house(i jsonb)', '2762b72438d495fa81579dce7b29b241'),
    ('_gallery_veil_illegal_brokerage(i jsonb)', 'c7c7dd5dd7ce5b3a651100f0b0742e33'),
    ('_gallery_veil_inst_id(c jsonb)', 'ead363272f4d95c0bacad75398c85985'),
    ('_gallery_veil_join(j jsonb, sep text)', 'cf609a0009c95a213f2917a48b4535c6'),
    ('_gallery_veil_jslen(v text)', '27d976b0ccf25a4fddf7b2ee48983ffd'),
    ('_gallery_veil_jsstr(j jsonb)', '13ddaa22ebc1b7245cf19ad2dd3a49bf'),
    ('_gallery_veil_kind_order()', '10025b573a4068647ab48c3fae1e087a'),
    ('_gallery_veil_kinds()', 'd66a00105a4dcd2fbc61791a4d2c14e3'),
    ('_gallery_veil_lower(v text)', '38ef2a3892d56c2961425b4da9e6bd27'),
    ('_gallery_veil_map(s jsonb, kind text, mode text, a jsonb)', '9157d187e9835b29f0cbaf8c10e736aa'),
    ('_gallery_veil_map_list(arr jsonb, kind text, mode text, a jsonb)', 'cbc91ea326196059114651a09080dd6b'),
    ('_gallery_veil_npc_house(n jsonb)', '1b08dc42b6652e1a1e0ddae5971b56f9'),
    ('_gallery_veil_npc_id(c jsonb)', '0809bfe2b30676b59eafff863415fed2'),
    ('_gallery_veil_npc_pass(n jsonb, a jsonb)', 'a7f005483be28a56d9164bc6879b4d6b'),
    ('_gallery_veil_num_inf(x numeric)', '8cd799f75ab9db09c08ad31bbe5e9d9d'),
    ('_gallery_veil_num_zero(x numeric)', 'dae30a05f28e47d65f73b5eb88228099'),
    ('_gallery_veil_numstr(t text)', '6d94c759ea975d9b4eed3ca34c34e7ce'),
    ('_gallery_veil_or(a jsonb, b jsonb, c jsonb)', 'a0170ed57552a2ffe9066c2e09040e64'),
    ('_gallery_veil_own_id(c jsonb, prefix text, parts jsonb)', '9a4f99d7564a98177ac288b5937393ff'),
    ('_gallery_veil_parse(a text)', 'f55d429ceab17ae1cc3e7fe417fd1803'),
    ('_gallery_veil_resolve(pub jsonb, overrides jsonb, link boolean, people text[])', '2c699dd7901ac530c614664c2de821f5'),
    ('_gallery_veil_served(overrides jsonb, groupings jsonb, people jsonb, copy boolean)', '4f0f33dd13f5e8bc14ea6e489067ddc5'),
    ('_gallery_veil_slug(v text)', '2e93eed361c08dcef1063089df4f4223'),
    ('_gallery_veil_snake(v text)', '12454ada1324a860fc56caa0edcfbf46'),
    ('_gallery_veil_str(j jsonb)', 'f27cf825bb73766ff901493b217c4f61'),
    ('_gallery_veil_truthy(j jsonb)', '75d13b6b3096f1e6d3145a0d1c7a9d02'),
    ('get_gallery_dossier(dossier_slug text)', 'ec330913212ca3bcbed9026209c05a32'),
    ('get_gallery_map(p_slug text)', 'cd71b026590a11616fa1f23247dd914a'),
    ('get_unlisted_dossier(p_slug text)', 'fbebbb955d5c1758b55953c1a17203a8'),
    ('import_gallery_dossier(dossier_slug text)', '9f32ae9800100395a6aa7390357f29e7')
), here as (
  select p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' as sig,
         md5(p.prosrc || '|' || p.provolatile::text || '|' || p.prosecdef::text || '|' || coalesce(array_to_string(p.proconfig, ';'), '')) as h
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and (p.proname like '\_gallery\_veil%' or p.proname in ('_gallery_apply_member_overrides', 'get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map'))
)
select 45 as functions_expected,
       (select count(*) from expected e join here h using (sig) where e.h = h.h) as matching,
       (select coalesce(string_agg(sig, ', ' order by sig), '') from expected e join here h using (sig) where e.h <> h.h) as different,
       (select coalesce(string_agg(sig, ', ' order by sig), '') from expected e where not exists (select 1 from here h where h.sig = e.sig)) as missing,
       (select coalesce(string_agg(sig, ', ' order by sig), '') from here h where not exists (select 1 from expected e where e.sig = h.sig)) as not_expected;

-- (3) NO HELPER IS CALLABLE BY A READER. EXPECT: 40 | 0. STOP if the second number is above zero.
select count(*) as helpers,
       count(*) filter (where has_function_privilege('anon', p.oid, 'execute')
                           or has_function_privilege('authenticated', p.oid, 'execute')) as callable_by_readers
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.proname like '\_gallery\_veil%';

-- (4) For your information, not a hold: what 212 closes, counted (the security review's block two, (D)).
--     d1  shares exported before the veil, Reveal DM on, with a person hidden by the per-person switch: 212
--         reduces that person's copy in the power roster to their public card;
--     d2  Reveal-DM shares whose town carries the author's custom-content records: 212 stops sending them;
--     d3  shares that hide a tie by hand and carry a prominentRelationship or a pressureSentence: the upper bound
--         of the shares where a hidden tie's words travel today and stop at 212;
--     d4  veiled shares whose town has an economy chain: the upper bound for a hidden house named in a chain.
select
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

rollback;
