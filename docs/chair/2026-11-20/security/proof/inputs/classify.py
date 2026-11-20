import re,collections,json
def rows(fn):
    d=[r for r in open(fn).read().split('\x1e') if r.strip()]
    return [r.split('\x00') for r in d[1:]]
cat={}
for f in rows('cat203.bin'):
    sig,definer,anon,authd,svc,ret,lang,uid,role,acl=f[:10]
    sig=sig.strip()
    if anon!='t' and authd!='t': continue
    cat[sig]=dict(sig=sig,name=sig.split('(')[0],definer=definer=='t',anon=anon=='t',authd=authd=='t',svc=svc=='t',ret=ret,lang=lang,uid=uid=='t',role=role=='t',acl=acl)
refs={}
for f in rows('refs203.bin'): refs[f[0].strip()]=(f[3],f[4],f[5]=='t')
ment=dict(l.rstrip('\n').split('|') for l in open('mentions.txt'))
src=set(x.strip() for x in open('browser_rpc_names.txt'))
edgeuser={'has_surveyor_entitlement','spend_credits','list_my_tickets','list_ticket_thread','surveyor_byok_status','my_transfer_case_status','current_user_is_privileged','get_gallery_dossier','unsubscribe_via_token','surveyor_settings_get'}
out=collections.defaultdict(list)
for s,c in sorted(cat.items()):
    n=c['name']; o,b,inv=refs.get(s,('','',False)); m=ment.get(n,'')
    c['objrefs']=o; c['bodycallers']=b; c['m']=m
    if c['ret']=='trigger': k='TRIGGER'
    elif re.search('pg_policy|pg_constraint|pg_attrdef|pg_rewrite',o): k='VISITOR_SQL'
    elif inv: k='INVOKER_BODY'
    elif n in src: k='BROWSER_RPC'
    elif n in edgeuser: k='EDGE_USER'
    elif 'src' in m or 'api' in m: k='SRC_MENTION'
    else: k='INTERNAL?'
    c['k']=k; out[k].append(c)
for k,v in out.items(): print(k,len(v))
json.dump(cat,open('classed.json','w'),indent=0)
print('\nSRC_MENTION:', ' '.join(c['name'] for c in out['SRC_MENTION']))
print('\nBROWSER_RPC names not exposed in catalogue:', sorted(src-set(c['name'] for c in cat.values())))
print('\nedgeuser not exposed:', sorted(edgeuser-set(c['name'] for c in cat.values())))
