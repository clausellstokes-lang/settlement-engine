import json,re,sys,html
fn=sys.argv[1]
t=open(fn,encoding='utf8',errors='replace').read()
m=re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',t,flags=re.S)
d=json.loads(m.group(1))
ap=d['props']['pageProps']['apolloState']
out=[]
for k,v in ap.items():
    if k.startswith('Review:'):
        txt=v.get('text') or ''
        txt=re.sub(r'<[^>]+>',' ',txt)
        txt=html.unescape(re.sub(r'\s+',' ',txt)).strip()
        cr=v.get('creator')
        name=''
        if isinstance(cr,dict):
            ref=cr.get('__ref')
            if ref and ref in ap: name=ap[ref].get('name','')
        import datetime
        ts=v.get('createdAt')
        dt=datetime.datetime.utcfromtimestamp(ts/1000).strftime('%Y-%m-%d') if ts else ''
        out.append({'name':name,'date':dt,'rating':v.get('rating'),'likes':v.get('likeCount'),'text':txt})
out.sort(key=lambda r:r['date'],reverse=True)
json.dump(out,open(fn.replace('.html','.reviews.json'),'w'),indent=1)
for r in out:
    print('###',r['name'],r['date'],'rating',r['rating'],'likes',r['likes'])
    print(r['text'][:1400])
    print()
