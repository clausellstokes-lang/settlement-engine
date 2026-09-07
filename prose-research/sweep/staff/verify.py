# -*- coding: utf-8 -*-
import sys, re, json
sys.path.insert(0,'.')
import data
FILES={
 data.SV:"mohan-svtpk.html", data.ST:"mohan-honor.txt", data.MP:"mohan-mopop.txt",
 data.HSG19:"hsg2019.txt", data.HSG13:"hsg2018.txt", data.EB:"vallese-planes.txt",
 data.PK:"perkins2011.txt", data.DC:"dungeoncraft.txt",
 data.PDG:"paizo-dungeon.txt", data.PDR:"paizo-dragon.txt",
 data.CS:"sims-gen.txt", data.AL:"alpha-fmt.txt", data.MM:"mimir-perkins.txt",
 data.SW:"grog-winter.txt", data.WDH:"wdh.raw", data.DG:"dmsg-267467.txt", data.ADG:"adg.txt",
}
def norm(s):
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')
    s=s.replace('—','-').replace('–','-').replace(' ',' ')
    return re.sub(r'\s+',' ',s).strip()
cache={}
bad=0
for i,c in enumerate(data.claims):
    q=c.get("quote","")
    if not q: print(i,"EMPTY QUOTE (ok, declared)"); continue
    f=FILES.get(c["url"])
    if not f: print(i,"NO LOCAL FILE",c["url"]); bad+=1; continue
    if f not in cache:
        t=open(f,encoding='utf-8',errors='replace').read()
        if f.endswith('.html'):
            import html as H
            t=re.sub(r'<[^>]+>',' ',re.sub(r'<script.*?</script>|<style.*?</style>','',t,flags=re.S)); t=H.unescape(t)
        cache[f]=norm(t)
    if norm(q) in cache[f]:
        w=len(q.split())
        print(i,"OK",w,"words")
        if w>12: print("   !! TOO LONG"); bad+=1
    else:
        print(i,"*** NOT FOUND:",q); bad+=1
print("bad:",bad)
