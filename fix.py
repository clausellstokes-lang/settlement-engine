# -*- coding: utf-8 -*-
import json
out = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/verdicts-tolkien-i763-777.json"
d = json.load(open(out, encoding="utf-8"))

REP = [
 ("mes desballestat", "més desballestat"),
 ("aixo si", "això sí"),
 ("col.leccio escolar", "col·lecció escolar"),
 ("Per aixo", "Per això"),
 ("El hobbit es mes farcit", "El hòbbit és més farcit"),
 ("arcaiques o desuetes", "arcaiques o desuetes"),
 ("unics detalls linguistics", "únics detalls lingüístics"),
 ("Boromir, Faramir...", "Bóromir, Fàramir…"),
 ("existents es invers", "existents és invers"),
 ("gaudeix de mes 'prestigi'", "gaudeix de més «prestigi»"),
 ("publicada entre 1969 i 1970", "publicada entre 1969 i 1970"),
 ("Stroembom", "Strömbom"),
 ("Ake Ohlmarks", "Åke Ohlmarks"),
 ("Ake_Ohlmarks", "%C3%85ke_Ohlmarks"),
 ("Lavskaegge", "Lavskägge"),
 ("Bjoernavad", "Björnavad"),
 ("Snabba solstralen", "Snabba solstrålen"),
 ("Snabba solstralen", "Snabba solstrålen"),
 ("Goeteborgsposten", "Göteborgsposten"),
 ("Goeteborgs-Posten", "Göteborgs-Posten"),
 ("Oeversaettning_av_Sagan_om_ringen_till_svenska", "%C3%96vers%C3%A4ttning_av_Sagan_om_ringen_till_svenska"),
 ("foersiktig beroem", "försiktig beröm"),
 ("ville faa fram en aalderdomlig kaensla med ett avskalat spraak", "ville få fram en ålderdomlig känsla med ett avskalat språk"),
 ("gjorde precis tvaertom", "gjorde precis tvärtom"),
 ("Resultatet blev en foertjusande bok, men ocksaa en helt annan bok aen den Tolkien hade skrivit",
  "Resultatet blev en förtjusande bok, men också en helt annan bok än den Tolkien hade skrivit"),
 ("sex vaellagade maaltider om dagen", "sex vällagade måltider om dagen"),
 ("har granskat Ohlmarks oeversaettning", "har granskat Ohlmarks översättning"),
 ("att oeversaettaren genomgaaende broderar ut texten och laegger till information som inte finns i originalet",
  "att översättaren genomgående broderar ut texten och lägger till information som inte finns i originalet"),
 ("Exempel som han lyfter fram aer", "Exempel som han lyfter fram är"),
 ("som i Ohlmarks oeversaettning blev", "som i Ohlmarks översättning blev"),
 ("en levande sagovaerld", "en levande sagovärld"),
 ("levande sagovaerld", "levande sagovärld"),
 ("uppger denne att den egna uppgiften varit att goera en tolkning av Tolkien",
  "uppger denne att den egna uppgiften varit att göra en tolkning av Tolkien"),
 ("Jag gjorde foerst en noggrann slaetoeversaettning av hela boken och skrev sedan radikalt om den, hela tiden ledd av en straevan att soeka skildra",
  "Jag gjorde först en noggrann slätöversättning av hela boken och skrev sedan radikalt om den, hela tiden ledd av en strävan att söka skildra"),
 ("som hade precis saa lite att goera med England och engelskan som Tolkien tydligen avsett",
  "som hade precis så lite att göra med England och engelskan som Tolkien tydligen avsett"),
 ("aalderdomlig kaensla", "ålderdomlig känsla"),
 ("missfoerstaand, felsyftningar, inkonsekvenser och godtyckliga tillaegg",
  "missförstånd, felsyftningar, inkonsekvenser och godtyckliga tillägg"),
 ("Den aer saa spaeckad med", "Den är så späckad med"),
 ("Haexmaestarens doed", "Häxmästartens död"),
 ("I de flesta upplagor... aer det felaktigt hoben Meriadoc som ger Haexmaestaren av Angmar det doedande hugget, medan det i sjaelva verket aer Eowyn",
  "I de flesta upplagor… är det felaktigt hoben Meriadoc som ger Häxmästaren av Angmar det dödande hugget, medan det i själva verket är Éowyn"),
]

def fix(s):
    for a,b in REP:
        s = s.replace(a,b)
    return s

for v in d["verdicts"]:
    for k in ("trueWording","note","unsupportedLimb"):
        if k in v:
            v[k] = fix(v[k])

# targeted corrections
for v in d["verdicts"]:
    if v["index"] == 770:
        v["unsupportedLimb"] = "Lavskägge (reading 'beam' as light)"
        v["trueWording"] = "Lavskägge = 'Lichenbeard'; beam-as-light is Quickbeam → Snabba solstrålen"
    if v["index"] == 777:
        v["note"] = v["note"].replace("Häxmästartens död","Häxmästarens död")

json.dump(d, open(out,"w",encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok")
for v in d["verdicts"]:
    print(v["index"], v["verdict"], "|", v.get("unsupportedLimb",""), "|", v["trueWording"][:70])
