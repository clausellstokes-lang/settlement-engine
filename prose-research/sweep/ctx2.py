import re,os,unicodedata
def norm(s):
    s=unicodedata.normalize("NFKC",s).replace("­","").replace("’","'").replace("‘","'").replace("“",'"').replace("”",'"')
    return re.sub(r"\s+"," ",s)
SPEC={
 "kay-raw2/kleander.txt":["mosaic","non-focalized"],
 "kay-raw2/rettino-thesis.txt":["Jehane","disguis"],
 "kay-raw2/hatch.txt":["colour","dramatic over","seek the dramatic"],
 "kay-raw2/fantasycafe.txt":["negative pressure","Subtleties","show that in the books","epic"],
 "kay-raw2/transmissions.txt":["they're behind","even past","still affected"],
 "kay-raw2/allbery-uh.txt":["broadening","conversations"],
 "kay-raw2/home-away-globe.txt":["honest about limitations","Henry James"],
 "kay-raw2/toyryla.txt":["Ring Dive","Rhun","intermental","communal"],
 "kay-raw2/strangehorizons.txt":["must weep","mourn","November"],
 "kay-raw2/scotspec.txt":["Niall","2010","Posted"],
 "kay-raw2/jeroen.txt":["Posted on","April 11"],
 "kay-raw2/shoul.txt":["Simeon","2001"],
 "kay-raw2/soden.txt":["Oden","2026","Feb"],
 "kay-raw2/sffworld-2007.txt":["Posted","2007","Rob"],
 "kay-raw2/psychopomp.txt":["outline"],
 "kay-raw2/lovereading.txt":["Renault"],
 "kay-raw2/gregcook.txt":["magical realism"],
 "kay-raw2/ff-barnard.txt":["Ashley","2011"],
 "kay-raw2/camelot1989.txt":["double effect"],
}
for f,keys in SPEC.items():
    t=norm(open(f,encoding="utf-8",errors="replace").read())
    print("##",f)
    for k in keys:
        idx=[m.start() for m in re.finditer(re.escape(k),t,flags=re.I)]
        if not idx: print("   ??",k); continue
        for i in idx[:3]:
            print("   >",k,"::",t[max(0,i-140):i+len(k)+160])
