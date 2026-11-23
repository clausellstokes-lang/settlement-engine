-- ════════════════════════════════════════════════════════════════════════════════════════════
-- THE CHECKS AFTER MIGRATION 212 (the owner's step; COHERENCE-VEIL-7). Read only; ends in ROLLBACK.
-- NOT TO BE RUN BY ANYONE BUT THE OWNER.
-- ════════════════════════════════════════════════════════════════════════════════════════════
begin transaction read only;

-- (1) EXPECT: 50 | 0 (211's forty helpers and 212's ten; none callable by anon or authenticated).
select count(*) as helpers,
       count(*) filter (where has_function_privilege('anon', p.oid, 'execute')
                           or has_function_privilege('authenticated', p.oid, 'execute')) as callable_by_readers
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.proname like '\_gallery\_veil%';

-- (2) Every function 212 leaves against its fingerprint at 211 + 212, built on a local chain at 203 + 211 + 212
--     (equal on 001..212, and equal to the lane's 211 as it stood at 28f52b1e4).
--     EXPECT: 55 | 55 | (empty) | (empty) | (empty). Anything else: run 4-rollback-ONLY-IF-NEEDED.sql and tell the chair.
with expected(sig, h) as (values
    ('_gallery_apply_member_overrides(base jsonb, dm_full jsonb, overrides jsonb, settlement_share_dm boolean, settlement_importable boolean, for_import boolean)', '466f881821e159f920ea327dfc248665'),
    ('_gallery_veil(pub jsonb, overrides jsonb, link boolean, copy boolean)', 'a66f4c4c2a834abe4811154c0902d481'),
    ('_gallery_veil_apply(pub jsonb, res jsonb)', '1951cc3bd6c5f185307c3f82694b0ebd'),
    ('_gallery_veil_card(kind text, c jsonb, cls jsonb, byid jsonb, excj jsonb, legacy jsonb)', '87f891079a4f277e26a7b915bcb9b625'),
    ('_gallery_veil_card_id(kind text, c jsonb)', '21c596870b11a149b11f2a691fc4acc0'),
    ('_gallery_veil_cards(s jsonb, kind text)', '9c8d7609ad4eaa6ace535259020c8ad2'),
    ('_gallery_veil_clandestine(i jsonb)', 'dfa49188eefd97f060085d5ae01d67ed'),
    ('_gallery_veil_copy_bound()', 'facd9901248223b52bbd53c66ba77ff7'),
    ('_gallery_veil_criminal(i jsonb)', '32dcdde97259d4366789fe6d2e6efec7'),
    ('_gallery_veil_drop_hooks(j jsonb)', '56cb75a2107cb09c3b8c6836c6c0fb8b'),
    ('_gallery_veil_embeds(txt jsonb, pieces text[])', '65e00ffaa8316dc073cc821015103739'),
    ('_gallery_veil_facet(e jsonb, k text)', '8ee2dce9d4170edb2d656cbcbfe66be2'),
    ('_gallery_veil_grouping(s jsonb, g text)', 'ed04449d0ef875bcc30f16fb1610556a'),
    ('_gallery_veil_groupings()', 'ce45552b85f07038d31f7a5f92df469d'),
    ('_gallery_veil_hidden_name(x jsonb, gone jsonb, open_names text[])', 'ba96b092c5329601f68a82cf93ce1f7c'),
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
    ('_gallery_veil_member_revealed(m jsonb, overrides jsonb, share_dm boolean, importable boolean, for_import boolean)', '4781b95a998faa146974e6344d565b9a'),
    ('_gallery_veil_names(v jsonb, gone jsonb)', '4b2ff8b0cba5f04a8a519e5e294478d2'),
    ('_gallery_veil_npc_house(n jsonb)', '1b08dc42b6652e1a1e0ddae5971b56f9'),
    ('_gallery_veil_npc_id(c jsonb)', '0809bfe2b30676b59eafff863415fed2'),
    ('_gallery_veil_npc_pass(n jsonb, a jsonb)', 'a7f005483be28a56d9164bc6879b4d6b'),
    ('_gallery_veil_num_inf(x numeric)', '8cd799f75ab9db09c08ad31bbe5e9d9d'),
    ('_gallery_veil_num_zero(x numeric)', 'dae30a05f28e47d65f73b5eb88228099'),
    ('_gallery_veil_numstr(t text)', '6d94c759ea975d9b4eed3ca34c34e7ce'),
    ('_gallery_veil_or(a jsonb, b jsonb, c jsonb)', 'a0170ed57552a2ffe9066c2e09040e64'),
    ('_gallery_veil_own_id(c jsonb, prefix text, parts jsonb)', '9a4f99d7564a98177ac288b5937393ff'),
    ('_gallery_veil_parse(a text)', 'f55d429ceab17ae1cc3e7fe417fd1803'),
    ('_gallery_veil_pieces(v jsonb)', '05a37f73086fa734abc94e5c83846512'),
    ('_gallery_veil_resolve(pub jsonb, overrides jsonb, link boolean, people text[])', '2c699dd7901ac530c614664c2de821f5'),
    ('_gallery_veil_roster_members(factions jsonb, overrides jsonb, share_dm boolean, importable boolean, for_import boolean)', '0a3feb503c7d9b44b355d2123a4aa7f1'),
    ('_gallery_veil_roster_splice(doc jsonb, overrides jsonb, share_dm boolean, importable boolean, for_import boolean)', '1c36c7061aa6341623acb9d5c2503d80'),
    ('_gallery_veil_second_homes(s jsonb, src jsonb, gone jsonb)', '43c26d9a06901370ae6f892803043e2d'),
    ('_gallery_veil_served(overrides jsonb, groupings jsonb, people jsonb, copy boolean)', '4f0f33dd13f5e8bc14ea6e489067ddc5'),
    ('_gallery_veil_slug(v text)', '2e93eed361c08dcef1063089df4f4223'),
    ('_gallery_veil_snake(v text)', '12454ada1324a860fc56caa0edcfbf46'),
    ('_gallery_veil_sources(s jsonb, fields jsonb, classes jsonb, excj jsonb)', '9cc6168720ec0c03e8b30de50958c658'),
    ('_gallery_veil_str(j jsonb)', 'f27cf825bb73766ff901493b217c4f61'),
    ('_gallery_veil_tie_pieces(ties jsonb)', 'acd2b64486be536e2879bac590c4d536'),
    ('_gallery_veil_truthy(j jsonb)', '75d13b6b3096f1e6d3145a0d1c7a9d02'),
    ('get_gallery_dossier(dossier_slug text)', 'be0e5c74749a3c2277f2db769c4c6cf5'),
    ('get_gallery_map(p_slug text)', 'cd71b026590a11616fa1f23247dd914a'),
    ('get_unlisted_dossier(p_slug text)', 'fbebbb955d5c1758b55953c1a17203a8'),
    ('import_gallery_dossier(dossier_slug text)', 'e91716b862008638c70c465832f18f0e')
), here as (
  select p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' as sig,
         md5(p.prosrc || '|' || p.provolatile::text || '|' || p.prosecdef::text || '|' || coalesce(array_to_string(p.proconfig, ';'), '')) as h
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and (p.proname like '\_gallery\_veil%' or p.proname in ('_gallery_apply_member_overrides', 'get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map'))
)
select 55 as functions_expected,
       (select count(*) from expected e join here h using (sig) where e.h = h.h) as matching,
       (select coalesce(string_agg(sig, ', ' order by sig), '') from expected e join here h using (sig) where e.h <> h.h) as different,
       (select coalesce(string_agg(sig, ', ' order by sig), '') from expected e where not exists (select 1 from here h where h.sig = e.sig)) as missing,
       (select coalesce(string_agg(sig, ', ' order by sig), '') from here h where not exists (select 1 from expected e where e.sig = h.sig)) as not_expected;

-- (3) EXPECT `search_path=public, pg_temp` on each of the four reads.
select proname, proconfig from pg_proc
 where proname in ('get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map');
rollback;
