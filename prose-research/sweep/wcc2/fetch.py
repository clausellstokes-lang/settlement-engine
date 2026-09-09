import sys,os,time,urllib.request,gzip,io,re,html
OUT=os.path.dirname(os.path.abspath(__file__))
def get(url,tries=4):
    for i in range(tries):
        try:
            r=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36','Accept-Encoding':'gzip'})
            with urllib.request.urlopen(r,timeout=45) as f:
                b=f.read()
                if f.headers.get('Content-Encoding')=='gzip':
                    b=gzip.decompress(b)
                return b.decode('utf-8',errors='replace')
        except Exception as e:
            sys.stderr.write('ERR %s %s\n'%(url,e)); time.sleep(4+4*i)
    return None
def strip(h):
    m=re.search(r'<PRE>(.*?)</PRE>',h,re.S|re.I)
    body=m.group(1) if m else h
    t=re.search(r'<H1>(.*?)</H1>',h,re.S|re.I)
    au=re.search(r'<B>(.*?)</B>',h,re.S|re.I)
    dt=re.search(r'<I>(.*?)</I>',h,re.S|re.I)
    txt=re.sub(r'<[^>]+>','',body)
    return html.unescape((t.group(1) if t else '')+'\n'+(au.group(1) if au else '')+' | '+(dt.group(1) if dt else '')+'\n'+txt)
if __name__=='__main__':
    month=sys.argv[1]; ids=sys.argv[2:]
    for n in ids:
        p=os.path.join(OUT,'%s-%s.txt'%(month,n))
        if os.path.exists(p) and os.path.getsize(p)>200: continue
        u='https://web.archive.org/web/2021id_/http://lists.urth.net/pipermail/urth-urth.net/%s/%s.html'%(month,n)
        h=get(u)
        if h is None:
            open(p,'w').write('FETCH-FAILED'); continue
        open(p,'w').write(strip(h))
        print('ok',n,os.path.getsize(p))
        time.sleep(2.5)
