import json
src='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/chunks/hobb-03.json'
out='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/verdicts-hobb-i45-59.json'
d=json.load(open(src))
V=[
 (45,"VERIFIED_VERBATIM","Hobb's writing is closer the slice-of-life style than to action.",
  "cscsnews.com fetched HTTP 200 (browser UA). Byline matches: Madalen Erez, Literary Arts Editor, November 19, 2020. Quote verbatim, including the page's own missing 'to': 'Hobb's writing is closer the slice-of-life style than to action.' Second limb verbatim too: 'But when she does write fight scenes, she writes them effectively. Her physical conflicts serve the characters instead of the plot.'",None),
 (46,"VERIFIED_VERBATIM","I like primary documents when I can get them, diaries, journals and things of that sort.",
  "fantasy-faction.com fetched HTTP 200. Quote verbatim. Full sentence: 'And then I began to read. I like primary documents when I can get them, diaries, journals and things of that sort. Then I like to find well researched and foot-noted books written on whatever topic I am covering.' The 'over histories' limb is supported as a RANKING, not a rejection: primary documents first ('when I can get them'), secondary works second ('Then I like to find...'). The page never uses the word 'histories'; its term is 'well researched and foot-noted books'.",None),
 (47,"VERIFIED_VERBATIM","For the Liveships, I wanted the smells and sensations of a sailing vessel, and so I booked some time on The Adventuress and the Lady Washington, two local tall ships.",
  "fantasy-faction.com, same paragraph as 46. Quote verbatim; both limbs (booked time, tall ships, smells and sensations) explicit in one sentence.",None),
 (48,"VERIFIED_VERBATIM","I do not care for 'message' stories, regardless of genre.",
  "huffpost.com fetched HTTP 200 (no paywall interception). Quote verbatim. Questions limb verbatim two paragraphs on: 'I often think that I write not because I have answers, but because I have questions.' Note the page's immediate self-qualification, which does not defeat the claim: 'Wait, I take that back. I love Aesop's Fables. But that is because there is a clear contract between the reader and that ancient author.'",None),
 (49,"VERIFIED_VERBATIM","Events in Jamaillia or Bingtown inevitably have repercussions in the Six Duchies.",
  "huffpost.com, same article. Quote 'inevitably have repercussions in the Six Duchies' verbatim; the claim's generalisation to 'one place / elsewhere in the world' is exactly the page's point, which continues: 'And so Fitz's mission would affect, not just his own family and lands, but the dragons and the Liveship Traders and the Pirate Isles and the dragon keepers of Jamiallia.'",None),
 (50,"VERIFIED_VERBATIM","I wrote Cloven Hooves entirely in First Person, Present Tense (something I will NEVER attempt again!)",
  "scifinow.co.uk fetched HTTP 200. Byline matches: By Jodie Tyley, 30-05-12. Quote verbatim including the capitalised NEVER. The 'one novel' limb is named on the page: Cloven Hooves.",None),
 (51,"VERIFIED_VERBATIM","I wanted it to unfold slowly",
  "scifinow.co.uk, same interview. Quote verbatim. Antecedent supports the 'deep history' limb: 'In the Realm of the Elderlings, I wanted the sense that we had entered a world that had a tremendous amount of history, much of it obscured by a cataclysm in the past. I wanted it to unfold slowly...'",None),
 (52,"VERIFIED_VERBATIM","My dog ... will care far less about what is on television as opposed to how much butter is on the popcorn.",
  "scifinow.co.uk, same interview. Quote verbatim. Self-interest limb explicit just before: 'react to what is going on from that character's self interest'; sensory limb explicit just after: 'I'm going to be writing from his sensory input as he smells the butter and popcorn.'",None),
 (53,"VERIFIED_VERBATIM","After I finished the Ships trilogy, Fitz's voice kept taking me over (even when I was writing e-mails!), so I went right on and picked up the story of Fitz and the Fool in The Tawny Man trilogy.",
  "locusmag.com fetched HTTP 200; page is the December 2005 Locus interview excerpts. Quote verbatim. All three limbs in the one sentence; the page's 'Ships trilogy' is the Liveship Traders trilogy, which the same page's profile names.",None),
 (54,"PARTIAL","But that doesn't reflect that I ... inserting chapter headings for bridge work I need to create, researched diseases of sheep (it's relevant!)",
  "robinhobb.com/blog/posts/41755 fetched HTTP 200; post is 'How to Write a Book When You Don't Have Time to Write', article:published_time 2022-11-03, so the November 2022 attribution holds. Quote 'researched diseases of sheep' is verbatim, and the chapter-headings-for-bridge-work limb is verbatim. What the page does NOT support is the framing: the log records start/stop times and word count ('Keep a writing log. Jot down when you start, how many words/pages you have at the beginning of your session, and then log when you stop writing'), and the sheep research and chapter headings are introduced precisely as what the day's 585-word count 'doesn't reflect' -- they are outside the log, not recorded in it.",
  "that the writing log records these tasks -- the post presents them as what the log's word count does NOT reflect"),
 (55,"VERIFIED_VERBATIM","Started reading, admired the controlled point of view, the leisurely pace.",
  "reactormag.com fetched HTTP 200. Byline matches: By Steven Erikson, published April 27, 2016. Quote verbatim. Seduction and dog-scene limbs verbatim in the same paragraph: 'Liked the boy-and-his-dog riff that was going on... that relationship ends with a brutal event, shocking in its seeming cruelty. Yet, it was in that moment that I realised the fullest extent of that quiet seduction.'",None),
 (56,"VERIFIED_VERBATIM","Knowledge is fed piecemeal, at a child's pace of comprehension",
  "reactormag.com, same essay. Quote verbatim, and 'piecemeal' is the page's own word. Child-narrator limb immediately precedes: 'It's no accident the child POV is popular in fantasy fiction, as those \"uneducated\" eyes provide an easy vehicle to introduce to the reader the strangeness of the fantasy world.'",None),
 (57,"VERIFIED_VERBATIM","Told in the first person -- an unusual approach in epic fantasy -- these books offer complete immersion in Fitz's complicated personality",
  "lareviewofbooks.org fetched HTTP 200. Byline matches: By Ilana Teitelbaum, September 8, 2014. Quote verbatim; both limbs sit in the one sentence.",None),
 (58,"VERIFIED_VERBATIM","reminiscent of Laura Ingalls Wilder's Little House books, another milieu in which the objects of daily life are concrete and treasured",
  "lareviewofbooks.org, same review. Quote verbatim. Objects limb verbatim: 'Writing tablets and books are luxuries, as are handkerchiefs, beeswax candles, and lace.' Withywoods is the subject of the passage: it opens 'her depiction of Withywoods reaches a new level of what Tolkien names \"the wonder of things\"' and closes 'Such a setting as Withywoods feels almost radical for epic fantasy.'",None),
 (59,"VERIFIED_VERBATIM","Rather than being of battle or intrigue, conversations turn to the uses of herbs, the seasons for crops, and fair treatment of servants.",
  "lareviewofbooks.org, same review, sentence immediately after the Withywoods passage. Quote verbatim and every limb -- herbs, crop seasons, fair treatment of servants, rather than battle -- is in that one sentence.",None),
]
verdicts=[]
for idx,v,tw,note,limb in V:
    o={"index":idx,"verdict":v,"trueWording":tw,"note":note}
    if limb: o["unsupportedLimb"]=limb
    verdicts.append(o)
assert [c["index"] for c in d["claims"]]==[x["index"] for x in verdicts]
json.dump({"name":"hobb","chunk":3,"claims":d["claims"],"verdicts":verdicts},open(out,'w'),indent=1)
print("wrote",out)
