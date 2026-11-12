\timing on
select count(public._gallery_veil_parse(a)) from (select 'field:npc:npc_'||g||':secret' a from generate_series(1,2000) g) q;
select count(regexp_match(a, '^(?:(tab|block):(.+)|(class|card):([^:]+):(.+)|field:([^:]+):(.+):([^:]+))$')) from (select 'field:npc:npc_'||g||':secret' a from generate_series(1,2000) g) q;
select count(public._gallery_veil_card_id('institution', jsonb_build_object('name', 'House '||g))) from generate_series(1,2000) g;
select count(public._gallery_veil_slug('House '||g)) from generate_series(1,2000) g;
select count(public._gallery_veil_truthy(jsonb_build_object('name', 'House '||g)->'name')) from generate_series(1,2000) g;
explain verbose select public._gallery_veil_card_id('institution', jsonb_build_object('name', 'House '||g)) from generate_series(1,2) g;
