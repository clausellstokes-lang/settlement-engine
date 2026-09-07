import json,sys,urllib.parse,urllib.request,time,os,hashlib
ROSTER={
 'understandingurs0000cumm':'Cummins, Understanding Ursula K. Le Guin (1990)',
 'approachestofict0000bitt':'Bittner, Approaches to the Fiction of UKL (1984)',
 'approachestofict0000jame':'Bittner, Approaches to the Fiction of UKL (1984) [dup scan]',
 'farthestshoresof0000slus':'Slusser, The Farthest Shores of UKL (1976)',
 'ursulakleguin00bloo':'Bloom ed., UKL Modern Critical Views (1986)',
 'ursulakleguinsle0000unse':"Bloom ed., UKL's The Left Hand of Darkness (1987)",
 'ursulakleguinbey0000cadd':'Cadden, UKL Beyond Genre (2005)',
 'dancingwithdrago0000whit':'White, Dancing with Dragons (1999)',
 'ursulakleguin00olan':'Olander & Greenberg eds., Ursula K. Le Guin (1979)',
 'ursulakleguin0453spiv':'Spivack, Ursula K. Le Guin (Twayne 1984)',
 'ursulakleguin00buck':'Bucknall, Ursula K. Le Guin (1981)',
 'fantasytradition0000atte':'Attebery, The Fantasy Tradition in American Literature (1980)',
 'ursulakleguinvoy0000unse':'De Bolt ed., UKL: Voyager to Inner Lands and to Outer Space (1979)',
 'sciencefictionst0000unse_t6r8':'SFS: Selected Articles on SF 1973-1975 (1976)',
}
CACHE=os.path.dirname(os.path.abspath(__file__))+'/si-cache'
os.makedirs(CACHE,exist_ok=True)
def q(query, only=None, n=30):
    key=hashlib.sha1(query.encode()).hexdigest()[:16]
    p=CACHE+'/'+key+'.json'
    if os.path.exists(p):
        d=json.load(open(p))
    else:
        url='https://openlibrary.org/search/inside.json?q='+urllib.parse.quote(query)
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'})
        d=json.load(urllib.request.urlopen(req,timeout=120))
        json.dump(d,open(p,'w'))
        time.sleep(1)
    out=[]
    for r in d.get('hits',{}).get('hits',[])[:200]:
        f=r.get('fields',{})
        ident=(f.get('identifier') or [''])[0]
        if only and ident not in (only if isinstance(only,(list,set)) else [only]): continue
        out.append({'id':ident,'title':(f.get('meta_title') or [''])[0],'creator':(f.get('meta_creator') or [''])[0],
                    'year':(f.get('meta_year') or [''])[0],'page':f.get('page_num'),
                    'hl':(r.get('highlight',{}) or {}).get('text',[])})
    return d.get('hits',{}).get('total'),out
if __name__=='__main__':
    query=sys.argv[1]
    only=sys.argv[2].split(',') if len(sys.argv)>2 and sys.argv[2]!='-' else None
    tot,out=q(query,only)
    print('TOTAL',tot,'shown',len(out))
    for r in out:
        print('=== [%s] %s | %s | p.%s'%(r['id'],r['title'][:60],r['creator'][:30],r['page']))
        for h in r['hl']:
            print('   >',h.replace('\n',' '))
