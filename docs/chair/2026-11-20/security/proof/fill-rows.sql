-- fill-rows.sql — SEC-GRANTS-2: give every table of schema public that has a uuid `id` column and no row ONE row,
-- so a door's uuid argument can be fed a REAL row of every table it reads. Generic: a NOT NULL column with no default
-- takes a referenced row's key (foreign key), the first literal of a `= ANY (ARRAY[...])` check, or a value by type.
-- Five passes (parents before children); a table whose insert still fails is reported, not forced.
\set ON_ERROR_STOP 0
do $do$
declare t record; c record; cols text; vals text; v text; pass int; ok int; lit text;
begin
  for pass in 1..5 loop
    for t in select cl.oid, cl.relname from pg_class cl join pg_namespace n on n.oid = cl.relnamespace
             where n.nspname = 'public' and cl.relkind = 'r'
               and exists (select 1 from pg_attribute a where a.attrelid = cl.oid and a.attname = 'id' and a.atttypid = 'uuid'::regtype)
    loop
      execute format('select count(*) from public.%I', t.relname) into ok;
      continue when ok > 0;
      cols := ''; vals := '';
      for c in select a.attname, a.atttypid, format_type(a.atttypid, a.atttypmod) ft from pg_attribute a
               where a.attrelid = t.oid and a.attnum > 0 and not a.attisdropped and a.attnotnull and a.attidentity = '' and a.attgenerated = ''
                 and not exists (select 1 from pg_attrdef d where d.adrelid = t.oid and d.adnum = a.attnum)
      loop
        v := null;
        select format('(select %I from %s limit 1)', fa.attname, fk.confrelid::regclass) into v
          from pg_constraint fk join pg_attribute fa on fa.attrelid = fk.confrelid and fa.attnum = fk.confkey[1]
         where fk.conrelid = t.oid and fk.contype = 'f' and fk.conkey[1] = (select attnum from pg_attribute where attrelid = t.oid and attname = c.attname) limit 1;
        if v is null then
          select substring(pg_get_constraintdef(k.oid) from '''([^'']*)''') into lit from pg_constraint k
           where k.conrelid = t.oid and k.contype = 'c' and pg_get_constraintdef(k.oid) ~ ('\m' || c.attname || '\M') and pg_get_constraintdef(k.oid) ~ 'ARRAY\[' limit 1;
          if lit is not null then v := quote_literal(lit) || '::' || c.ft; end if;
        end if;
        if v is null then
          v := case when c.atttypid = 'uuid'::regtype then '''22222222-2222-2222-2222-222222222222''::uuid'
                    when c.atttypid in ('text'::regtype, 'varchar'::regtype) then '''probe'''
                    when c.atttypid in ('int2'::regtype, 'int4'::regtype, 'int8'::regtype, 'numeric'::regtype, 'float8'::regtype) then '1'
                    when c.atttypid = 'bool'::regtype then 'false'
                    when c.atttypid in ('jsonb'::regtype, 'json'::regtype) then '''{}'''
                    when c.atttypid in ('timestamptz'::regtype, 'timestamp'::regtype, 'date'::regtype) then 'now()'
                    when c.atttypid = 'bytea'::regtype then '''\x00''::bytea'
                    else 'null' end || '::' || c.ft;
        end if;
        cols := cols || case when cols = '' then '' else ', ' end || quote_ident(c.attname);
        vals := vals || case when vals = '' then '' else ', ' end || v;
      end loop;
      begin
        if cols = '' then execute format('insert into public.%I default values', t.relname);
        else execute format('insert into public.%I (%s) values (%s)', t.relname, cols, vals); end if;
      exception when others then
        if pass = 5 then raise notice 'UNFILLED %: %', t.relname, left(sqlerrm, 140); end if;
      end;
    end loop;
  end loop;
end $do$;
