import sys,json,urllib.parse,subprocess,html,re
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
ID='9uAsEAAAQBAJ'
def q(term):
    u=f"https://books.google.com/books?id={ID}&newbks=0&printsec=frontcover&jscmd=SearchWithinVolume&q="+urllib.parse.quote(term)
    out=subprocess.run(['curl','-s','--compressed','-A',UA,u],capture_output=True,text=True).stdout
    try: d=json.loads(out)
    except Exception: print('  !! non-json:',out[:200]); return
    n=d.get('number_of_results',0)
    print(f'>>> "{term}"  results={n}')
    for r in d.get('search_results',[])[:6]:
        s=re.sub(r'<[^>]+>','',html.unescape(r.get('snippet_text','')))
        print(f'   p.{r.get("page_number")} [{r.get("page_id")}]: {s}')
    print()
for t in sys.argv[1:]:
    q(t)
