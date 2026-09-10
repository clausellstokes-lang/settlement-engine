import sys,json,subprocess,urllib.parse,time,os
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
def curl(u,o=None,extra=()):
    a=['curl','-sSL','-m','80','-A',UA,*extra]
    if o: a+=['-o',o,'-w','%{http_code} %{size_download}']
    a.append(u)
    r=subprocess.run(a,capture_output=True,text=True)
    return r.stdout
def ts(url):
    for i in range(3):
        s=curl('https://archive.org/wayback/available?url='+urllib.parse.quote(url,safe=''))
        try:
            j=json.loads(s); c=j.get('archived_snapshots',{}).get('closest')
            if c: return c['timestamp']
        except Exception: pass
        time.sleep(4)
    return None
def grab(url,out):
    if os.path.exists(out) and os.path.getsize(out)>2000: return 'cached'
    t=ts(url)
    if not t: return 'NO-SNAPSHOT'
    time.sleep(2)
    for i in range(3):
        r=curl('https://web.archive.org/web/%sid_/%s'%(t,url),out,extra=('--compressed',))
        p=r.strip().split()
        if len(p)==2 and p[0]=='200' and int(p[1])>2000: return 'OK '+t+' '+r.strip()
        time.sleep(5*(i+1))
    return 'FAIL '+t+' '+r.strip()
if __name__=='__main__':
    for line in sys.argv[1:]:
        out,url=line.split('=',1)
        print(out, grab(url,out), flush=True); time.sleep(2)
