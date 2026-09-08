import re,json,html,sys,subprocess,os
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
def fetch(url,out):
    subprocess.run(["curl","-sL","-m","40","-A",UA,"-H","Accept-Language: en-US,en;q=0.9",url,"-o",out],check=False)
    return open(out,encoding='utf8',errors='replace').read()
def reviews(t):
    m=re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',t,re.S)
    if not m: return []
    d=json.loads(m.group(1))
    ap=d['props']['pageProps'].get('apolloState',{}) or {}
    out=[]
    for k,v in ap.items():
        if k.startswith('Review') and isinstance(v,dict) and v.get('text'):
            txt=re.sub(r'<br\s*/?>','\n',v['text'])
            txt=html.unescape(re.sub('<[^>]+>','',txt))
            out.append({'id':k.split('.')[-1],'rating':v.get('rating'),'created':v.get('createdAt'),'text':txt})
    return out
if __name__=='__main__':
    url,out=sys.argv[1],sys.argv[2]
    t=fetch(url,out+'.html')
    rs=reviews(t)
    json.dump(rs,open(out+'.json','w'),indent=1)
    print(out,len(rs),'reviews', sum(len(r['text']) for r in rs),'chars')
