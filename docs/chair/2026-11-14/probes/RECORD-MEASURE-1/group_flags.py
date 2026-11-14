import json,re,collections,sys
d=json.load(open(sys.argv[1]))
C=[
 ('a_founder',r'found(er|ed|ing)|origin|decree|charter|gathered|settled by|first settl'),
 ('b_water',r'dock|harbou?r|wharf|pier|ship|boat|barge|ferry|river|maritime|waterborne|coast|sea |sea-|port|landlocked|fish'),
 ('c_makes',r'makes|made here|export|produc|craft|smith|mill|flour|salt|gems?|mine|\bas goods|toll (income|revenue)|trade access|schooling|education'),
 ('d_power',r'power|guard|military|militia|garrison|headman|thie|criminal|free company|mercenar|hired|faction|suppressed'),
 ('e_size',r'\(\d+\s*[-–]\s*\d+\)|size|of \d[\d,]* (holds|has)|too (many|few)|guilds?|parish|count'),
 ('f_defended',r'lightly defended|defen[cs]e (lines? )?(empty|none)|undefended'),
 ('g_stability',r'stabil|legitim|rigid|theocra|democra|assembly|unrest|tension'),
]
out=collections.defaultdict(list)
for x in d:
  w=x['why'].lower(); hit=[k for k,r in C if re.search(r,w)]
  out[hit[0] if hit else 'zz_none'].append(x)
  x['_cls']=hit
co=collections.Counter(tuple(x['_cls']) for x in d)
for k,v in sorted(out.items()): print(k,len(v),collections.Counter(y['sev'] for y in v))
print('multi:',sum(1 for x in d if len(x['_cls'])>1))
json.dump(d,open(sys.argv[2],'w'),indent=0)
