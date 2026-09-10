import json,re,subprocess,sys,time,urllib.parse,html,os
VOL="9uAsEAAAQBAJ"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
OUT="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/raw-t3/gbresults.jsonl"
def fetch(q, exact=True):
    term = '"%s"' % q if exact else q
    url = "https://books.google.com/books?id=%s&q=%s" % (VOL, urllib.parse.quote(term))
    r = subprocess.run(["curl","-sSL","-m","60","--compressed","-A",UA,url],capture_output=True,text=True)
    s = r.stdout
    res=[]
    for m in re.finditer(r'"search_results":\s*(\[.*?\])\s*,\s*"search_query_escaped"', s, re.S):
        try:
            arr=json.loads(m.group(1))
        except Exception as e:
            continue
        for it in arr:
            sn=html.unescape(re.sub(r'<[^>]+>','',html.unescape(it.get("snippet_text",""))))
            res.append({"page":it.get("page_number"),"snippet":sn})
        break
    nres=None
    mm=re.search(r'"number_of_results":(\d+)', s)
    if mm: nres=int(mm.group(1))
    return {"query":q,"n":nres,"results":res,"httpsize":len(s)}
qs=json.load(open(sys.argv[1]))
with open(OUT,"a") as f:
    for q in qs:
        d=fetch(q)
        f.write(json.dumps(d)+"\n"); f.flush()
        print(json.dumps(d,ensure_ascii=False)[:1800]); print("-----")
        time.sleep(2.5)
