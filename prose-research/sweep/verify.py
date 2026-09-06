import sys,json,re,unicodedata
def norm(s):
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','-').replace('–','-').replace('�',"'")
    s=re.sub(r'\s+',' ',s)
    return s
pairs=json.load(open(sys.argv[1]))
for f,q in pairs:
    if not q: print("BLANK  ", f); continue
    t=norm(open(f,encoding='utf-8',errors='replace').read())
    print(("OK   " if norm(q) in t else "MISS "), f, "|", q)
