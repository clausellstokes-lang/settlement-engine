import sys,re,urllib.parse,urllib.request
q=sys.argv[1]
url="http://export.arxiv.org/api/query?search_query="+urllib.parse.quote(q)+"&start=0&max_results=25&sortBy=relevance"
t=urllib.request.urlopen(url,timeout=60).read().decode()
for m in re.finditer(r'<entry>(.*?)</entry>',t,re.S):
    e=m.group(1)
    ti=' '.join(re.search(r'<title>(.*?)</title>',e,re.S).group(1).split())
    idu=re.search(r'<id>(.*?)</id>',e,re.S).group(1).strip()
    pub=re.search(r'<published>(.*?)</published>',e,re.S).group(1)[:10]
    print(pub, idu, '|', ti[:120])
