import json
base="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/"
src=json.load(open(base+"chunks/wolfe-07.json"))
V=[
 (105,"PARTIAL","Latro writes with limited ability per the scrolls' translator",
  "the translator, rather than the essayist, noting the haste of composition",
  "Raw page (aidanmoher.com, HTTP 200). Verbatim: 'he is an otherwise uneducated mercenary with limited ability to write (per the \"translator\" of the found scrolls) ... and who would have been writing his recollections in haste in often difficult circumstances'. The parenthetical attributes only the writing-ability limb to the translator; the haste is Gerwel's own inference. Translator-framed scrolls and layered unreliability ('Latro is unreliable on many levels') are supported."),
 (106,"PARTIAL","Wolfe's prose is not dense; omission gives it its depth",
  "that the prose has density - the page explicitly denies Wolfe's prose is particularly dense",
  "Raw page (murrayewing.co.uk, HTTP 200). Verbatim: \"It's what Wolfe's leaves out that gives it its depth.\" But the preceding sentences read 'I don't think Wolfe's prose is particularly dense. In fact, it's quite cut back and simplified'. The page attributes DEPTH, not density, to omission, and the 'rather than elaborate description' limb is supported ('cut back and simplified')."),
 (107,"VERIFIED_VERBATIM","Sentences clear, cut back, Hemmingwayesque; exotic nouns give alien tinge","",
  "Raw page (murrayewing.co.uk). Verbatim: 'it's quite cut back and simplified, almost Hemmingwayesque'; 'he generally only uses exotic nouns. The meanings of his sentences are quite clear, they're just given an alien tinge by having, for instance, a helmet referred to as as burginot' and 'you can often guess the rough meaning of the noun by its context, without having to resort to a dictionary' - estrangement without obscurity. Page spelling 'Hemmingwayesque' and 'burginot' both match the claim."),
 (108,"PARTIAL","'The key to Wolfe's narrators ... is this passage from Tracking Song'",
  "that the passage OPENS 'Tracking Song' and is addressed to its narrator - the page gives it no position in the story and names no addressee",
  "Raw page (murrayewing.co.uk). 'You know nothing.' is verbatim, as the first words of a block quotation introduced only as 'this passage from \"Tracking Song\"'. The knowing-little limb is fully supported: they're 'unreliable' mainly because they know so little' and amnesiac narrators are 'putting them in exactly the same position as the reader'."),
 (109,"VERIFIED_VERBATIM","Wolfe just takes Heinlein's unexplained detail to the next level","",
  "Raw page (murrayewing.co.uk). Verbatim: 'ever since Robert A Heinlein wrote \"the door dilated\" -- an unexplained background detail that (literally) opened a portal through which the reader could imagine an entire futuristic world. Wolfe just takes this to the next level.' Half-answered questions as a feature: 'those half-answered, or unanswered, questions are part of Wolfe's worlds, just as they're part of ours.'"),
 (110,"VERIFIED_VERBATIM","Wolfe encoder, reader decoder; choice confounds the reader","",
  "Raw page (lareviewofbooks.org, HTTP 200, full article present). Verbatim: 'Wolfe is \"encoder\" and reader \"decoder of elliptical yet elegantly labyrinthine conundrums\" - or, as Wright says later ... \"This element of choice is Wolfe's principal device for confounding the reader.\"' Source named earlier as 'Peter Wright's Attending Daedalus'. Minor context: the second Wright quote is glossed as being about The Book of the New Sun, but its own wording says 'Wolfe's principal device'."),
 (111,"VERIFIED_VERBATIM","No reviewer recognised Weer's deathly state; first misinterpreted narrative","",
  "Raw page (lareviewofbooks.org). Verbatim, attributed to Wright: 'as Wright points out, \"no reviewer recognised Weer's deathly state ... and the ghost's story quickly became Wolfe's first misinterpreted narrative.\"' Both limbs (Wright as recorder; Peace as the first misinterpreted narrative) supported."),
 (112,"VERIFIED_VERBATIM","Many readings as readers; disagrees Wolfe's goal is confounding","",
  "Raw page (lareviewofbooks.org). Verbatim: 'this novel contains many readings, as many readings perhaps as there are readers, which is as it should be' (prefaced 'I would maintain'). Resistance limb verbatim too: 'I vehemently disagree that Wolfe's goal is to confound the reader.'"),
 (113,"VERIFIED_VERBATIM","First section collapses SF's cosmic view with religion, ecstatically","",
  "Raw page (lareviewofbooks.org). Verbatim: 'Just in the first section, \"Alden Dennis Weer,\" look how Wolfe collapses the cosmic perspective of science fiction with that of religion in an ecstatic description'; and after the second excerpt, 'And the passage goes on, cascading from metaphor to metaphor. No one else writes like that.' All three limbs supported."),
 (114,"VERIFIED_VERBATIM","Wolfe has said of Weer, 'we have similar souls'","",
  "Raw page (lareviewofbooks.org). Verbatim: 'But Gene Wolfe is not evil, nor is he sympathetic with the devil, and Wolfe has said of Weer, \"we have similar souls.\"' The sentence stands in the reviewer's resistance to Borski's reading that 'Alden Dennis Weer may be the Devil incarnate', so the 'against readings of Weer as the devil' limb holds."),
 (115,"VERIFIED_VERBATIM","Weer withholds the Gold's trip; reader sifts evidence; Weer killed her","",
  "Raw page (blog.ayjay.org, HTTP 200). Verbatim: 'the reader has to sift the evidence to figure out what really happened' - said of Severian, then explicitly extended: 'The same is true of Weer's narration in Peace.' Also 'Often he leaves stories unfinished'; 'He explicitly says that he will not tell us what happened when he and the librarian Lois Arbuthnot visited a farm outside of town'; Weer's own line 'the trip Lois and I made to Gold's'; 'later it becomes pretty clear what happened: Weer killed her.'"),
 (116,"PARTIAL","Interpolated tales comment on events Weer narrates and people he knew",
  "that the reader must decide WHICH tales comment on the frame - the page asserts no such reader task and instead states its own examples",
  "Raw page (blog.ayjay.org). Verbatim: 'The various interpolated tales in Peace comment in various ways on the events that Weer narrates and the people that he knew.' Jacobs then supplies his own identifications ('one story about a princess and her suitors clearly mirrors Aunt Olivia'; a tale 'I think is meant to describe to Weer his own situation') without saying the reader must decide. The nearest reader-task line, 'we are left to draw inferences', is about Weer's unfinished stories, not about which tales comment."),
 (117,"VERIFIED_VERBATIM","Rambling memory palace of his own making; rooms lost temporarily or permanently","",
  "Raw page (blog.ayjay.org). Verbatim and contiguous: 'He clearly lives, or \"lives,\" in a rambling memory palace of his own making, each room of which is related to some season of his life. But the palace is not complete, and he can temporarily or permanently lose access to some of its rooms.' Every limb supported."),
 (118,"PARTIAL","Key rule: characters lie in dialogue but not in narration",
  "that narrative statements can therefore be TRUSTED - the same page says 'when a Wolfe narrator lies to you or tricks you' and calls Weer's narration 'essentially utter manipulation', biased and evasive",
  "Raw page (the-solute.com, HTTP 200). The rule is verbatim (capitalised on the page): '(Key rules: Characters will lie in dialogue but not in narration.)'. The page supports only the narrower point that the narration does not fabricate - 'he is not making up events which did not happen, though his perspective is heavily biased' - and wallflower's method is to check 'if he's being honest about the what and the why', i.e. narration is not to be trusted wholesale."),
 (119,"VERIFIED_VERBATIM","Stops just before a death, resumes after; narrative defined by what isn't narrated","",
  "Raw page (the-solute.com). Verbatim: 'he often stops just before a character dies and resumes some time after, beginning with Bobby Black and ending with his secretary.' Inference-from-absence limb: 'crafting a narrative that's largely defined by what isn't narrated' and 'especially important if it's the last time he mentions a character, because that's the sign he doesn't want to tell us ... something'. The term appears hyphenated on the page - 'What's the shadow-narrative of his life' (also 'Shadow Life', 'Shadow Plot')."),
]
verdicts=[]
for idx,v,tw,ul,note in V:
    d={"index":idx,"verdict":v,"trueWording":tw,"note":note}
    if ul: d["unsupportedLimb"]=ul
    verdicts.append(d)
assert [c["index"] for c in src["claims"]]==[d["index"] for d in verdicts]
out={"name":"wolfe","chunk":7,"claims":src["claims"],"verdicts":verdicts}
p=base+"verdicts-wolfe-i105-119.json"
json.dump(out,open(p,"w"),indent=1,ensure_ascii=False)
print("wrote",p)
chk=json.load(open(p))
print("claims",len(chk["claims"]),"verdicts",len(chk["verdicts"]))
from collections import Counter
print(Counter(d["verdict"] for d in chk["verdicts"]))
