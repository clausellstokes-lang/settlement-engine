#!/usr/bin/env python3
"""HF-M1 classification of the 313-plate corpus.
RULE (stated so it is auditable and reproducible): first matching slug rule wins,
then the OVERRIDE table. Two axes are recorded:
  category = the plate's functional class (what it is a reference FOR)
  tier     = the settlement tier portrayed, where the plate portrays one ('-' otherwise)
This is HF-M1's own classification; it does NOT exactly reproduce laneHF4 §6's tally
(which is not fully enumerated). Divergences are reported in the receipt.
"""
import re, json

RULES = [
 ("EXP-",        "exp"),        ("-fant-",   "fantastical"), ("-under-", "underground"),
 ("-terrain-",   "terrain"),    ("-trade-",  "trade"),       ("-stress-", "stressor"),
 ("-spec-",      "specimen"),   ("zoom",     "zoom"),        ("lens",    "lens"),
 ("chrome",      "chrome"),     ("-series-", "series"),      ("countryside-", "systems"),
 ("metropolis",  "metropolis"), ("city",     "city"),        ("town",    "town"),
 ("village",     "village"),    ("hamlet",   "hamlet"),      ("thorp",   "thorp"),
]

OVERRIDE = {
 # HF-1 vocabulary plates and misc, placed by subject
 "hf5":"lens", "hf35":"zoom", "hf58":"town", "hf59":"village", "hf60":"town", "hf73":"town", "hf41":"town", "hf42":"town", "hf54":"zoom", "hf55":"zoom",
 "hf56":"zoom", "hf61":"chrome", "hf71":"specimen", "hf84":"underground",
 "hf110":"zoom","hf111":"zoom","hf112":"specimen","hf113":"specimen","hf114":"specimen",
 "hf115":"specimen","hf116":"specimen","hf121":"town","hf123":"zoom","hf124":"zoom",
 "hf120":"zoom","hf122":"zoom",
 "hf133":"city","hf138":"city",
 "hf171":"stressor","hf175":"fantastical",
 "hf190":"underground","hf191":"underground","hf192":"underground","hf193":"underground",
 "hf194":"underground","hf195":"underground","hf196":"underground","hf197":"underground",
 "hf198":"underground","hf200":"chrome","hf201":"chrome","hf202":"chrome",
 "hf206":"specimen","hf207":"specimen","hf208":"specimen",
 "hf233":"institution","hf236":"town","hf237":"village","hf238":"village","hf239":"town",
 "hf243":"fantastical","hf244":"fantastical","hf245":"fantastical","hf246":"fantastical","hf247":"fantastical",
 "hf257":"chrome","hf258":"chrome","hf261":"specimen","hf262":"specimen",
 "hf267":"town","hf268":"town","hf290":"town","hf291":"systems","hf292":"systems",
 "hf293":"institution","hf294":"systems","hf295":"systems","hf296":"town","hf297":"town","hf298":"city",
 "hf301":"underground","hf303":"specimen","hf304":"specimen","hf305":"specimen",
 "hf306":"town","hf307":"town","hf308":"systems","hf309":"town","hf310":"institution",
 "hf311":"zoom","hf312":"systems","hf319":"specimen",
 "hf334":"town","hf335":"village","hf336":"town",
 "hf360":"systems","hf367":"port","hf370":"systems","hf371":"systems","hf374":"metropolis",
 "hf381":"systems","hf388":"specimen","hf389":"metropolis","hf390":"chrome",
}

# settlement tier portrayed (only where the plate portrays a settlement at a tier)
TIER_OVERRIDE = {
 "hf3":"village","hf4":"city","hf5":"town","hf13":"village","hf14":"village","hf15":"village",
 "hf16":"village","hf17":"village","hf20":"town","hf21":"town","hf22":"town","hf23":"town",
 "hf24":"town","hf25":"town","hf26":"town","hf27":"town","hf30":"city","hf31":"city",
 "hf32":"city","hf33":"city","hf34":"metropolis","hf37":"town","hf40":"city","hf41":"town",
 "hf42":"town","hf50":"city","hf51":"city","hf52":"village","hf53":"town","hf57":"town",
 "hf58":"town","hf59":"village","hf60":"town","hf62":"town","hf63":"town","hf70":"city",
 "hf72":"town","hf73":"town","hf84":"city","hf121":"town",
 "hf125":"village","hf126":"village","hf127":"village","hf128":"village",
 "hf165":"town","hf166":"town","hf167":"town","hf168":"town","hf169":"town","hf171":"town",
 "hf172":"village","hf173":"town",
 "hf231":"village","hf232":"village","hf234":"town","hf236":"town","hf237":"village",
 "hf238":"village","hf239":"town","hf254":"city","hf255":"hamlet","hf256":"town","hf277":"town",
 "hf279":"town","hf280":"town","hf281":"town","hf282":"town","hf283":"village","hf284":"village",
 "hf285":"town","hf286":"town","hf287":"village","hf289":"city","hf290":"town",
 "hf296":"town","hf297":"town","hf298":"city","hf299":"thorp","hf300":"town","hf301":"city",
 "hf302":"town","hf306":"town","hf307":"town","hf309":"town","hf310":"village",
 "hf326":"city","hf327":"city","hf328":"city","hf335":"village",
 "hf337":"town","hf338":"town","hf339":"town","hf347":"town","hf348":"town",
 "hf361":"town","hf362":"city","hf363":"town","hf364":"town","hf365":"town","hf366":"town",
 "hf368":"city","hf369":"town","hf372":"town","hf373":"town","hf374":"metropolis",
 "hf380":"town","hf382":"city","hf383":"town","hf384":"town","hf385":"town","hf389":"metropolis",
 "hf215":"town","hf216":"town","hf217":"town","hf218":"town","hf241":"town","hf242":"town",
 "hf155":"town","hf156":"village","hf157":"village","hf158":"village",
 "hf175":"city","hf176":"city","hf177":"city","hf178":"city","hf179":"town","hf180":"city",
 "hf181":"city","hf182":"town","hf183":"town","hf244":"city","hf246":"city","hf247":"town",
 "hf243":"town","hf245":"town",
}

TIERS = ("thorp","hamlet","village","town","city","metropolis")

def classify(stem):
    pid = re.match(r"(hf\d+)", stem).group(1)
    cat = None
    if pid in OVERRIDE:
        cat = OVERRIDE[pid]
    else:
        for pat, c in RULES:
            if pat in stem:
                cat = c; break
    cat = cat or "other"
    tier = TIER_OVERRIDE.get(pid, cat if cat in TIERS else "-")
    return pid, cat, tier

if __name__ == "__main__":
    stems = [l.strip() for l in open("HFM1-stems.txt")]
    out = {}
    for s in stems:
        pid, cat, tier = classify(s)
        out[pid] = {"stem": s, "category": cat, "tier": tier}
    json.dump(out, open("HFM1-class.json","w"), indent=1)
    import collections
    print("CATEGORY:", json.dumps(collections.Counter(v["category"] for v in out.values()).most_common(), indent=0))
    print("TIER    :", json.dumps(collections.Counter(v["tier"] for v in out.values()).most_common(), indent=0))
    for c in sorted({v["category"] for v in out.values()}):
        mem=[k for k,v in out.items() if v["category"]==c]
        mem.sort(key=lambda x:int(x[2:]))
        print("%-12s n=%-3d %s" % (c, len(mem), " ".join(mem)))
