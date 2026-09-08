import json, os
base="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep"
claims=json.load(open(base+"/.claims-dnd-i947.json"))
V=[
 (947,"VERIFIED_VERBATIM","its size and its basic form of government.",None,
  "Raw OCR of the archive.org _djvu.txt (1,207,785 bytes, HTTP 200, curl direct). Quote exact at the head of 'Random Settlements'. The section carries exactly five tables in this order before the p.112 footer and the next section ('Random Buildings'): Race Relations, Ruler's Status, Notable Traits, Known For Its ..., Current Calamity. All five headings match the claim."),
 (948,"VERIFIED_VERBATIM","Known For Its ...",None,
  "Quote exact, including the ellipsis, as the table heading. Its d20 column is headed 'Feature' and every result is a completing noun ('Delicious cuisine', 'Rude people', 'Piety', 'Gambling', 'Patriotism'), so the heading does read as a stem the rolled result finishes. Both limbs supported."),
 (949,"PARTIAL","Undead stirring in cemeteries","the entries are noun phrases rather than sentences - several are unpunctuated finite clauses",
  "The quote is exact and is itself a noun phrase, and no entry carries terminal punctuation, so 'unpunctuated' holds. But the generalisation over the table fails: at least five of the twenty results are subject-verb clauses, not noun phrases - 'New cult seeks converts', 'Important figure died (murder suspected)', 'Powerful wizard has moved into town', 'Scandal threatens powerful families', 'Religious sects struggle for power'. Two more carry parenthetical punctuation ('Plague or famine (sparks riots)', 'Economic depression (trade disrupted)'). The table's register is 'unpunctuated fragment', which covers both shapes; 'noun phrase' does not."),
 (950,"VERIFIED_VERBATIM","concentrate instead on the major features.",None,
  "Quote exact. The sentence opens 'Mapping a Settlement' and reads, in full, that when you draw a settlement map you should not worry about the placement of every building and should concentrate instead on the major features. The claim's 'ignore' is a fair rendering of the book's 'don't worry about'; every limb is on the page."),
 (951,"VERIFIED_VERBATIM","the kinds of trades that dominate the neighborhood",None,
  "Quote exact. The same paragraph in 'Mapping a Settlement' tells the DM to give wards names reflecting their personalities, which identify the trades, a geographical characteristic, or a dominant site - and all three of the claim's cited examples are the book's own, in its own parentheses: Tannery Square (with Temple Row), Riverside (with Hilltop), and the Lords' Quarter."),
 (952,"PARTIAL","What does it look, smell, and sound like?","'second' - the sensory question is the third bullet in the list, and the only sensory one",
  "Quote exact, and the list does open the ch.1 'Settlements' guidance ('Consider the following questions as you create any settlement in your world'). But the position is wrong. The bullets run: purpose in your game; how big / who lives there; look, smell, sound; who governs; defenses; goods and services; temples and organizations; fantastic elements; why characters should care - nine in all. The sensory question is third, not second, and it is the list's only sensory question, so 'second sensory question' fails on either reading."),
 (953,"VERIFIED_VERBATIM","Sensory details help bring a settlement to life",None,
  "Quote exact under the 'Atmosphere' subhead; the sentence continues that they vividly communicate the settlement's personality to your players, so the 'for the players' limb is the book's own. One calibration for downstream use: the DMG hedges with 'help bring', where the claim says 'are what bring'. The assertion is the book's; the exclusivity is not, so do not quote the claim as though the DMG said sensory details alone do the work."),
 (954,"VERIFIED_VERBATIM","Settle on a single defining factor that sums up a",None,
  "Quote exact; the sentence completes with the settlement's personality and an instruction to extrapolate from there, and the paragraph then demonstrates it - a canal city like Venice yields sights, sounds, smells and the feel of humidity; a fog-shrouded city yields cold mist, muffled hooves, the smell of rain. Both limbs, the single factor and the extrapolation, are supported."),
 (955,"VERIFIED_VERBATIM","of this sort needs no more than a brief description.",None,
  "Quote exact, and the preceding sentence in 'Local Color' supplies the antecedent the claim depends on: a settlement that serves as a place where the characters stop to rest and to buy supplies. 'A settlement of this sort' is that settlement, so the rest-and-resupply limb is the book's own."),
 (956,"VERIFIED_VERBATIM","Create only the features of a settlement",None,
  "Quote exact (the claim's longer form, carrying the tail of the previous sentence, also matches the OCR byte for byte). Under 'Purpose'. The passage continues that you create the features you know you'll need, with notes on general features, then allow the place to grow organically as the adventurers interact with more of it - so the 'let the place grow later' limb is supported too."),
 (957,"VERIFIED_VERBATIM","Disregard any advice here that runs counter to",None,
  "Quote exact; the sentence completes with the DM's vision for a settlement, and the sentence before it frames the whole section as guidelines to help you build the settlement you want. The licence is explicit and it is scoped to this settlement section, exactly as claimed."),
 (958,"VERIFIED_VERBATIM","Organizations: A village might contain one or two",None,
  "Quote exact. Checked all three size entries, not just the quoted one: Village, Town and City each carry the same five labelled fields in the same order - Population, Government, Defense, Commerce, Organizations - before their running prose. The record shape holds across the set, so the 'each settlement size' limb is confirmed rather than inferred from one entry."),
 (959,"VERIFIED_VERBATIM","Cities that hold more than twenty-five thousand people",None,
  "Quote exact, in the running prose beneath the City record, in a sentence saying such cities are extremely rare before naming Waterdeep, Sharn and the Free City of Greyhawk. The threshold is spelled out in words in prose, as claimed."),
 (960,"PARTIAL","Population: Up to about 25,000","'a few lines above' - roughly thirty lines, four labelled fields and two paragraphs separate them",
  "Quote exact, in the City entry's labelled Population field, and the numeral/word contrast the claim is really about is real: the same 25,000 figure appears as digits in the field and as words in the prose, on the same page and in the same entry. The proximity limb overstates it. Between them stand the Government, Defense, Commerce and Organizations fields plus two full paragraphs of prose - about thirty printed lines, not a few. Worth noting for the register work: the field states a ceiling ('Up to about 25,000') and the prose sentence a floor ('more than twenty-five thousand'), so they are the same figure doing opposite duty."),
 (961,"VERIFIED_VERBATIM","worth 50 gp in Waterdeep and 30 gp",None,
  "Quote exact. The sentence, about Waterdeep's harbor moon, completes with 'elsewhere', so both coin values sit as numerals inside one sentence of running prose under 'Example: The Forgotten Realms'. The surrounding paragraphs do the same repeatedly (the toal at 2 gp, Silverymoon's electrum moon at 1 gp / 1 ep, the eclipsed moon at 5 ep / 2 ep), so the pattern is the section's habit, not a one-off."),
]
verdicts=[]
for idx,v,tw,limb,note in V:
    d={"index":idx,"verdict":v,"trueWording":tw,"note":note}
    if limb: d["unsupportedLimb"]=limb
    verdicts.append(d)
for d in verdicts:
    w=len(d["trueWording"].split())
    assert w<=12,(d["index"],w)
assert [c["index"] for c in claims]==[d["index"] for d in verdicts]
out={"name":"dnd","chunk":5,"claims":claims,"verdicts":verdicts}
p=base+"/verdicts-dnd-i947-961.json"
json.dump(out,open(p,"w"),indent=1,ensure_ascii=False)
print("WROTE",p,os.path.getsize(p),"bytes")
print("max trueWording words:",max(len(d["trueWording"].split()) for d in verdicts))
from collections import Counter
print(Counter(d["verdict"] for d in verdicts))
