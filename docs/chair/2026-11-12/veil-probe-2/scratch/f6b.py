import re
s=open('211.f7b.sql').read()
# 1. every SQL helper whose body runs a query becomes plpgsql (a non-inlined SQL function is the slowest call there is)
pat=re.compile(r"(create or replace function (public\._gallery_veil[a-z_]*)\([^)]*\)\n)(returns (table \([^)]*\)\n)?[^\n]*?)language sql immutable as \$\$\n(.*?)\n\$\$;", re.S)
conv=[]
QUERYING={'_gallery_veil_own_id','_gallery_veil_facet','_gallery_veil_house','_gallery_veil_jslen','_gallery_veil_parse','_gallery_veil_cards','_gallery_veil_drop_hooks','_gallery_veil_illegal_brokerage','_gallery_veil_map_list','_gallery_veil_served','_gallery_veil_hideable_p'}
def fix(m):
    head, name, ret, tbl, body = m.group(1), m.group(2), m.group(3), m.group(4), m.group(5)
    if name.split('.')[1] not in QUERYING:
        return m.group(0)
    conv.append(name)
    lines=body.strip().split('\n'); lead=[]
    while lines and lines[0].strip().startswith('--'): lead.append(lines.pop(0))
    b='\n'.join(lines).strip()
    assert b.startswith('select') or b.startswith('with'), name
    if tbl:
        newbody = "begin\n" + ''.join(l + "\n" for l in lead) + "  return query\n  " + b.replace('\n', '\n  ') + ";\nend"
    else:
        newbody = "begin\n" + ''.join(l + "\n" for l in lead) + "  return (\n  " + b.replace('\n', '\n  ') + ");\nend"
    return f"{head}{ret}language plpgsql immutable as $$\n{newbody} $$;"
s=pat.sub(fix,s)
print('to plpgsql:', conv)
# 2. the institution id on its own, inlinable; the dispatcher in plpgsql (each branch planned once)
i=s.index("create or replace function public._gallery_veil_card_id(kind text, c jsonb)")
j=s.index("$$;", s.index("as $$", i))+3
old=s[i:j]
inst=old[old.index("    when 'institution' then case\n")+len("    when 'institution' then case\n"):old.index("      else 'institution' end\n")+len("      else 'institution' end\n")]
def branch(k):
    a=old.index(f"    when '{k}' then")
    rest=old[a+len(f"    when '{k}' then"):]
    ends=[x for x in [rest.find("\n    when '"), rest.find("\n    -- "), rest.find("\n  end\n")] if x>=0]
    return rest[:min(ends)].strip()
new=f"""-- entityIdFor('institution'): String(id || refId || slugifyEntity(name || label || 'institution')).
create or replace function public._gallery_veil_inst_id(c jsonb)
returns text language sql immutable as $$
  select case
{inst.replace('      ', '    ', 1).rstrip()}
$$;

create or replace function public._gallery_veil_card_id(kind text, c jsonb)
returns text language plpgsql immutable as $$
begin
  if kind = 'npc' then return public._gallery_veil_npc_id(c); end if;
  if kind = 'institution' then return public._gallery_veil_inst_id(c); end if;
  if kind = 'faction' then return {branch('faction')};
  end if;
  -- eventIdFor: a string id, else the first TRUTHY of name, title and label (a falsy label is no
  -- name: the review's F2 (a)), else NULL (an anonymous legacy event, read fail-closed)
  if kind = 'event' then return {branch('event')};
  end if;
  if kind = 'tension' then return {branch('tension')}; end if;
  if kind = 'conflict' then return {branch('conflict')}; end if;
  if kind = 'relationship' then return {branch('relationship')}; end if;
  return null;
end $$;"""
s=s[:i]+new+s[j:]
n1=s.count("public._gallery_veil_card_id('institution', "); n2=s.count("public._gallery_veil_card_id('npc', ")
s=s.replace("public._gallery_veil_card_id('institution', ","public._gallery_veil_inst_id(").replace("public._gallery_veil_card_id('npc', ","public._gallery_veil_npc_id(")
print('const calls', n1, n2)
open('211.f8.sql','w').write(s); open('211.sql','w').write(s)
