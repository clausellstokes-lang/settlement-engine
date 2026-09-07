import re,html,json,sys,os,glob
BASE=os.path.dirname(os.path.abspath(__file__))
def urth(n):
    s=open(os.path.join(BASE,'u%s.html'%n),encoding='utf-8',errors='replace').read()
    pre=re.search(r'<PRE>(.*?)</PRE>',s,re.S|re.I)
    return html.unescape(re.sub(r'<[^>]+>','',pre.group(1))) if pre else ''
def reddit(pid):
    s=open(os.path.join(BASE,'rs-prose.xml'),encoding='utf-8',errors='replace').read()
    for e in re.findall(r'<entry>(.*?)</entry>',s,re.S):
        if pid in e:
            c=re.search(r'<content type="html">(.*?)</content>',e,re.S)
            b=html.unescape(html.unescape(c.group(1)))
            return re.sub(r'<[^>]+>','',b)
    return ''
def cw(slug):
    return open(os.path.join(BASE,'cw-%s.txt'%slug),encoding='utf-8',errors='replace').read()
