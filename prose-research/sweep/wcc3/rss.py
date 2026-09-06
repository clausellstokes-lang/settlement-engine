import re,html,sys
def entries(f):
    t=open(f,encoding='utf-8',errors='replace').read()
    out=[]
    for e in re.findall(r'<entry>(.*?)</entry>',t,re.S):
        au=re.search(r'<author>.*?<name>(.*?)</name>',e,re.S)
        ct=re.search(r'<content type="html">(.*?)</content>',e,re.S)
        lk=re.search(r'<link href="(.*?)"',e)
        ti=re.search(r'<title>(.*?)</title>',e,re.S)
        up=re.search(r'<updated>(.*?)</updated>',e)
        body=html.unescape(html.unescape(ct.group(1))) if ct else ''
        body=re.sub(r'<.*?>',' ',body); body=re.sub(r'\s+',' ',body).strip()
        out.append(dict(author=au.group(1) if au else '?', title=html.unescape(ti.group(1)) if ti else '',
                        link=lk.group(1) if lk else '', body=body, date=up.group(1)[:10] if up else ''))
    return out
if __name__=='__main__':
    for e in entries(sys.argv[1]):
        if len(e['body'])<int(sys.argv[2] if len(sys.argv)>2 else 200): continue
        print('\n--- %s | %s | %s'%(e['author'],e['date'],e['link']))
        print(e['body'][:2600])
