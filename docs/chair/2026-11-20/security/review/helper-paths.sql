-- helper-paths.sql (REVIEW-GRANTS-1): every catalogue path to each of 213's 21 invoker helpers, wider than the builder's
-- closure: pg_depend of ANY class, text of every function body in ANY schema (comments kept: over-match is safe),
-- argument defaults, views, policies, constraints (incl. domains), defaults/generated columns, index expressions and
-- predicates, trigger WHEN clauses, rules, casts, operators, aggregates, event triggers.
\pset format unaligned
\pset tuples_only on
with h(oid, nm) as (
  select p.oid, p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in (
  '_civility_stem_hits','_civility_token_hits','_gallery_apply_member_overrides','_gallery_chronicle_entry','_gallery_chronicle_json',
  '_gallery_dm_full_json','_gallery_map_backdrop','_gallery_npc_key','_gallery_sanitize_public_json','_gc_dim_sql','_make_public_slug',
  '_make_unlisted_slug','_trunc_unit','civility_blocked','civility_normalize','is_allowed_email_category','is_allowed_security_question_id',
  'market_k_min_campaigns','market_k_min_users','mask_email','normalize_external_name'))
select 'DEPEND', h.nm, d.classid::regclass::text, pg_describe_object(d.classid, d.objid, d.objsubid), d.deptype
  from h join pg_depend d on d.refclassid='pg_proc'::regclass and d.refobjid=h.oid
union all
select 'BODY', h.nm, p.oid::regprocedure::text, case when p.prosecdef then 'DEFINER' else 'invoker' end
       || ' anon=' || has_function_privilege('anon', p.oid, 'execute') || ' auth=' || has_function_privilege('authenticated', p.oid, 'execute')
       || ' trig=' || (p.prorettype='trigger'::regtype), ''
  from h join pg_proc p on p.oid<>h.oid and p.prosrc ~ ('\m'||h.nm||'\M')
union all
select 'ARGDEF', h.nm, p.oid::regprocedure::text, '', '' from h join pg_proc p on pg_get_expr(p.proargdefaults, 0) ~ ('\m'||h.nm||'\M')
union all
select 'VIEW', h.nm, c.oid::regclass::text, c.relkind::text, '' from h join pg_class c on c.relkind in ('v','m') and pg_get_viewdef(c.oid) ~ ('\m'||h.nm||'\M')
union all
select 'POLICY', h.nm, pol.polname||' on '||pol.polrelid::regclass, '', '' from h join pg_policy pol on coalesce(pg_get_expr(pol.polqual, pol.polrelid),'')||coalesce(pg_get_expr(pol.polwithcheck, pol.polrelid),'') ~ ('\m'||h.nm||'\M')
union all
select 'CONSTRAINT', h.nm, c.conname||' on '||coalesce(c.conrelid::regclass::text, 'domain '||c.contypid::regtype::text), '', '' from h join pg_constraint c on pg_get_constraintdef(c.oid) ~ ('\m'||h.nm||'\M')
union all
select 'ATTRDEF', h.nm, a.adrelid::regclass::text, '', '' from h join pg_attrdef a on pg_get_expr(a.adbin, a.adrelid) ~ ('\m'||h.nm||'\M')
union all
select 'INDEX', h.nm, i.indexrelid::regclass::text, '', '' from h join pg_index i on pg_get_indexdef(i.indexrelid) ~ ('\m'||h.nm||'\M')
union all
select 'TRIGGER', h.nm, t.tgname||' on '||t.tgrelid::regclass, '', '' from h join pg_trigger t on not t.tgisinternal and pg_get_triggerdef(t.oid) ~ ('\m'||h.nm||'\M')
union all
select 'RULE', h.nm, r.rulename, '', '' from h join pg_rewrite r on r.rulename<>'_RETURN' and pg_get_ruledef(r.oid) ~ ('\m'||h.nm||'\M')
union all
select 'CAST/OP/AGG', h.nm, 'x', '', '' from h where exists (select 1 from pg_cast where castfunc=h.oid) or exists (select 1 from pg_operator where oprcode=h.oid)
   or exists (select 1 from pg_aggregate where aggtransfn=h.oid or aggfinalfn=h.oid)
union all
select 'EVTTRIG', h.nm, e.evtname, '', '' from h join pg_event_trigger e on e.evtfoid=h.oid
order by 2,1,3;
