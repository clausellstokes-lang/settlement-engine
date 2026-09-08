import json,re,subprocess,sys,time,urllib.parse,html
VOL="9uAsEAAAQBAJ"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
def fetch(q):
    url = "https://books.google.com/books?id=%s&q=%s" % (VOL, urllib.parse.quote('"%s"' % q))
    r = subprocess.run(["curl","-sSL","-m","60","--compressed","-A",UA,url],capture_output=True,text=True)
    s = r.stdout
    i = s.find('"search_query_escaped"')
    seg = s[max(0,i-40000):i] if i>=0 else ""
    j = seg.rfind('"number_of_results"')
    seg = seg[j:] if j>=0 else seg
    n = None
    mm = re.match(r'"number_of_results":(\d+)', seg)
    if mm: n=int(mm.group(1))
    res=[]
    k = seg.find('"search_results":')
    m = None
    if k>=0:
        start = seg.find('[', k)
        depth=0; instr=False; esc=False; end=None
        for idx in range(start, len(seg)):
            c=seg[idx]
            if instr:
                if esc: esc=False
                elif c=='\\': esc=True
                elif c=='"': instr=False
                continue
            if c=='"': instr=True
            elif c=='[': depth+=1
            elif c==']':
                depth-=1
                if depth==0: end=idx+1; break
        if end: m=seg[start:end]
    if m:
        try:
            for it in json.loads(m):
                sn = it.get("snippet_text","")
                sn = html.unescape(sn); sn = re.sub(r'<[^>]+>','',sn); sn = html.unescape(sn)
                res.append({"page":it.get("page_number"),"snippet":sn})
        except Exception as e:
            res=[{"parse_error":str(e),"raw":m[:1500]}]
    return {"query":q,"n":n,"results":res,"len":len(s)}
qs=json.load(open(sys.argv[1]))
for q in qs:
    d=fetch(q)
    print(json.dumps(d,ensure_ascii=False))
    print("-----")
    time.sleep(2.0)
