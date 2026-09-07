import sys,re,html,gzip,io,urllib.request,os
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
def raw(url):
    r=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'text/html,application/xhtml+xml,*/*','Accept-Language':'en-US,en;q=0.9'})
    d=urllib.request.urlopen(r,timeout=60)
    b=d.read()
    if d.headers.get('Content-Encoding')=='gzip' or b[:2]==b'\x1f\x8b':
        b=gzip.decompress(b)
    return b
def totext(b):
    s=b.decode('utf8','replace')
    s=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',s)
    s=re.sub(r'(?is)<!--.*?-->',' ',s)
    s=re.sub(r'(?i)<(br|/p|/div|/li|/h[1-6]|/tr)[^>]*>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=re.sub(r'[ \t\xa0]+',' ',s)
    s=re.sub(r'\n\s*\n\s*\n+','\n\n',s)
    return s.strip()
if __name__=='__main__':
    url=sys.argv[1]; out=sys.argv[2]
    try:
        b=raw(url)
    except Exception as e:
        print('FETCHFAIL',url,e); sys.exit(1)
    open(out+'.html','wb').write(b)
    t=totext(b)
    open(out+'.txt','w').write(t)
    print('OK',url,len(b),'bytes ->',out+'.txt',len(t),'chars')
