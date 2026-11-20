-- wide-harness.sql (REVIEW-GRANTS-1): every function a visitor may EXECUTE (anon or authenticated, extension members
-- excluded, triggers excluded), called as ANON and as the ATTACKER (authenticated 1111) with each uuid argument set in
-- turn to EVERY uuid stored in the database (every uuid column of every public table, auth.users), each uuid[] to the
-- whole pool, each text argument to every slug/code/marker in the text pool; the other arguments neutral (uuid: the
-- victim's id; text: 'other'; arguments with defaults omitted by named notation). Each call runs in a subtransaction
-- that is always rolled back; recorded: the outcome, the rows it wrote (pg_stat_xact_user_tables delta, by table),
-- whether the result carries VICTIMSECRET or the victim's id. Run as postgres on a seeded copy (seed-victim.sql).
create schema if not exists rg1;
create table if not exists rg1.results(fn text, role text, call text, status text, writes jsonb, leak boolean, vid boolean, res text);
create or replace function rg1.w() returns jsonb language sql as $$
  select coalesce(jsonb_object_agg(relid::regclass::text, n_tup_ins + n_tup_upd + n_tup_del), '{}')
  from pg_stat_xact_user_tables where n_tup_ins + n_tup_upd + n_tup_del > 0 and schemaname <> 'rg1' and relname <> '_rg1_ids' $$;
create or replace function rg1.try(p_role text, p_uid text, p_call text, out status text, out res text, out writes jsonb)
language plpgsql as $$
declare w0 jsonb; w1 jsonb; m text; d text; st text;
begin
  w0 := rg1.w();
  begin
    perform set_config('test.uid', p_uid, true);
    perform set_config('request.jwt.claim.role', p_role, true);
    execute 'set local role ' || p_role;
    execute 'select left(string_agg(x::text, '' | ''), 4000) from ' || p_call || ' x' into res;
    execute 'reset role';
    raise exception using errcode = 'RGOK1', message = coalesce(res, '<null>');
  exception when others then
    get stacked diagnostics st = returned_sqlstate, m = message_text;
    if st = 'RGOK1' then status := 'ok'; res := m; else status := 'ERR ' || st || ' ' || left(m, 160); res := null; end if;
  end;
  perform set_config('test.uid', '', true); perform set_config('request.jwt.claim.role', '', true);
  w1 := rg1.w();
  select coalesce(jsonb_object_agg(k, (w1->>k)::bigint - coalesce((w0->>k)::bigint, 0)), '{}') into writes
    from jsonb_object_keys(w1) k where (w1->>k)::bigint <> coalesce((w0->>k)::bigint, 0);
end $$;
create or replace function rg1.neutral(t oid) returns text language sql as $$
  select case format_type(t, null)
    when 'uuid' then quote_literal(coalesce(nullif(current_setting('rg1.nu', true), ''), '22222222-2222-2222-2222-222222222222')) || '::uuid'
    when 'text' then quote_literal(coalesce(nullif(current_setting('rg1.nt', true), ''), 'other')) || '::text'
    when 'integer' then '24' when 'bigint' then '1::bigint' when 'boolean' then 'true' when 'jsonb' then '''{}''::jsonb'
    when 'text[]' then '''{}''::text[]' when 'uuid[]' then '''{}''::uuid[]' when 'timestamp with time zone' then 'now()'
    when 'bytea' then '''\x00''::bytea' else 'null' end $$;
create table if not exists rg1.upool(v uuid primary key);
create table if not exists rg1.tpool(v text primary key);
do $$ declare r record; begin
  for r in select c.table_schema s, c.table_name t, c.column_name col from information_schema.columns c join pg_class k on k.relname=c.table_name
           join pg_namespace n on n.oid=k.relnamespace and n.nspname=c.table_schema
           where c.table_schema in ('public','auth') and c.data_type='uuid' and k.relkind='r' and c.table_name not like '_rg1%' loop
    execute format('insert into rg1.upool select distinct %I from %I.%I where %I is not null on conflict do nothing', r.col, r.s, r.t, r.col);
  end loop;
  for r in select c.table_name t, c.column_name col from information_schema.columns c join pg_class k on k.relname=c.table_name and k.relkind='r'
           where c.table_schema='public' and c.data_type='text' and (c.column_name ~ '(slug|code|token|provider|category|reason|kind)$') loop
    execute format('insert into rg1.tpool select distinct %I from public.%I where %I is not null on conflict do nothing', r.col, r.t, r.col);
  end loop;
  insert into rg1.tpool values ('anthropic'),('other'),('worth_walking'),('product_updates'),('first_street'),(''),('VICTIMSECRET'),
    ('22222222-2222-2222-2222-222222222222'),('victim-VICTIMSECRET@example.test'),('settlement'),('comment'),('map') on conflict do nothing;
  insert into rg1.tpool select v from public._rg1_ids where k='tid' on conflict do nothing;
end $$;
create or replace function rg1.run_fn(p regprocedure) returns int language plpgsql as $$
declare pr record; i int; j int; n int; names text[]; types oid[]; nd int; args text[]; call text; o record; cnt int := 0; role_ text; uid_ text;
begin
  select * into pr from pg_proc where oid = p;
  n := pr.pronargs; types := pr.proargtypes::oid[]; names := pr.proargnames; nd := pr.pronargdefaults;
  for role_, uid_ in values ('anon', ''), ('authenticated', '11111111-1111-1111-1111-111111111111') loop
    if not has_function_privilege(role_, p, 'execute') then continue; end if;
    -- variant list: (position, value) pairs; position 0 = all neutral
    for i, call in
      select 0, null::text
      union all select a.pos, quote_literal(up.v) || '::uuid' from generate_series(1, n) a(pos), rg1.upool up where format_type(types[a.pos-1], null)='uuid'
      union all select a.pos, quote_literal(tp.v) || '::text' from generate_series(1, n) a(pos), rg1.tpool tp where format_type(types[a.pos-1], null)='text'
      union all select a.pos, '(select array_agg(v) from rg1.upool)' from generate_series(1, n) a(pos) where format_type(types[a.pos-1], null)='uuid[]'
    loop
      args := '{}';
      for j in 1..n loop
        if j = i then args := args || (case when names is not null and names[j] <> '' then quote_ident(names[j]) || ' => ' else '' end || call);
        elsif j > n - nd and names is not null and names[j] <> '' then null; -- has a default: omitted
        else args := args || (case when names is not null and names[j] <> '' then quote_ident(names[j]) || ' => ' else '' end || rg1.neutral(types[j-1]));
        end if;
      end loop;
      call := p::regproc::text || '(' || array_to_string(args, ', ') || ')';
      select * into o from rg1.try(role_, uid_, call);
      insert into rg1.results values (p::text, role_, call, o.status, o.writes, coalesce(o.res ~ 'VICTIMSECRET', false), coalesce(o.res ~ '22222222-2222', false), left(o.res, 300));
      cnt := cnt + 1;
    end loop;
  end loop;
  return cnt;
end $$;
