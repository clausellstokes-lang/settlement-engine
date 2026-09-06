import re,json,subprocess,html,sys,os
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
def curl(url,out=None):
    cmd=["curl","-sL","-A",UA,"-H","Accept-Language: en-US,en;q=0.9","--compressed",url]
    if out: cmd+=["-o",out]
    r=subprocess.run(cmd,capture_output=True)
    return r.stdout.decode("utf-8",errors="replace") if not out else ""
ids=["EYT3NeS_mVQ","H02ZPoR3tlI","-9T-BlR5io0","jfhl1jnaAPY"]
for vid in ids:
    wp=f"watch_{vid}.html"
    if not os.path.exists(wp):
        curl(f"https://www.youtube.com/watch?v={vid}",wp)
    h=open(wp,encoding="utf-8",errors="replace").read()
    i=h.find('"captionTracks"')
    if i<0:
        print(vid,"NO captionTracks", len(h)); continue
    seg=h[i:i+3000]
    m=re.search(r'"baseUrl":"(.*?)"',seg)
    if not m:
        print(vid,"no baseUrl"); continue
    url=m.group(1).encode().decode("unicode_escape")
    for fmt in ["&fmt=json3",""]:
        body=curl(url+fmt)
        if len(body)>200: break
    if not body.strip():
        print(vid,"EMPTY caption body"); continue
    if body.lstrip().startswith("{"):
        d=json.loads(body)
        text=" ".join(html.unescape(s.get("utf8","")) for ev in d.get("events",[]) for s in ev.get("segs",[]))
    else:
        text=" ".join(html.unescape(x) for x in re.findall(r"<text[^>]*>(.*?)</text>",body,re.S))
    text=re.sub(r"\s+"," ",text).strip()
    open(f"tx_{vid}.txt","w").write(text)
    print(vid,"OK",len(text),"chars ::",text[:120])
