# -*- coding: utf-8 -*-
import json, io, os
OUT = "found-hobb-close.json"

sourcesRead = []
claims = []

def S(title,url,kind,substantive,date=None,route=None):
    d={"title":title,"url":url,"kind":kind,"substantive":substantive}
    if date: d["date"]=date
    if route: d["route"]=route
    sourcesRead.append(d)

def C(feature,claim,source,url,quote,page=None,kind=None,polarity=None,date=None,routeHint=None,registerHint=None,confidence=None,modelEra=None):
    d={"feature":feature,"claim":claim,"source":source,"url":url,"quote":quote}
    for k,v in [("page",page),("kind",kind),("polarity",polarity),("date",date),
                ("routeHint",routeHint),("registerHint",registerHint),
                ("confidence",confidence),("modelEra",modelEra)]:
        if v: d[k]=v
    claims.append(d)

def write(complete, coverage):
    json.dump({"complete":complete,"coverage":coverage,
               "sourcesRead":sourcesRead,"claims":claims},
              io.open(OUT,"w",encoding="utf-8"), ensure_ascii=False, indent=1)
    print("wrote",OUT,len(sourcesRead),"sources",len(claims),"claims")
