# -*- coding: utf-8 -*-
import json, os, re, sys, io

OUT="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/prose-research/sweep/found-kay-transcripts-and-readers.json"
HERE=os.path.dirname(os.path.abspath(__file__))

# corpus for verification: local file -> normalised text
def load(fn):
    p=os.path.join(HERE,fn)
    if fn.endswith('.reviews.json'):
        rs=json.load(open(p))
        return "\n".join(r['text'] for r in rs)
    return open(p,encoding='utf8',errors='replace').read()

CORPUS={}
def corpus(fn):
    if fn not in CORPUS: CORPUS[fn]=load(fn)
    return CORPUS[fn]

def norm(s):
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','-').replace('–','-')
    return re.sub(r'\s+',' ',s)

CLAIMS=[]
def C(local, feature, claim, source, url, quote, page, kind, polarity, date, routeHint, registerHint, confidence):
    if quote:
        hay=norm(corpus(local)); ned=norm(quote)
        if ned not in hay:
            print("QUOTE MISS ->", local, "|", quote); quote=""
        elif len(quote.split())>12:
            print("TOO LONG ->", quote); quote=""
    CLAIMS.append(dict(feature=feature, claim=claim, source=source, url=url, quote=quote, page=page,
                       kind=kind, polarity=polarity, date=date, routeHint=routeHint,
                       registerHint=registerHint, confidence=confidence))

RD="https://www.reddit.com/r/Fantasy/comments/%s/"
WB="Wayback raw capture web.archive.org/web/<ts>id_/ of the www.reddit.com thread (every live Reddit route is walled: old.reddit .json interstitial, www .json 403, pullpush 429, arctic-shift 422)"
GRR="browser user agent on the live page; review text read from the __NEXT_DATA__ apolloState Review: nodes"

# ---------------- Reddit readers ----------------
C('rd-15kr5yn.txt','place and institution description',
  "A reader who disliked Tigana overall nevertheless singles out Kay's description of settings as the book's strongest element.",
  "u/sybar142857, r/Fantasy, 'Just finished Tigana; I'm disappointed', Aug 2023",
  RD%'15kr5yn/just_finished_tigana_im_disappointed',
  "the man can describe settings really well","opening post, 'Pros'",'reader','asserts','2023-08',WB,'dossier-archivist','high')

C('rd-15kr5yn.txt','other: divided reader verdict on the prose',
  "The same reader rates the book 2.5/5 while calling the prose top notch, splitting his verdict on the prose from his verdict on the book.",
  "u/sybar142857, r/Fantasy, 'Just finished Tigana; I'm disappointed', Aug 2023",
  RD%'15kr5yn/just_finished_tigana_im_disappointed',
  "I think GGK's prose is top notch","opening post, 'Pros'",'reader','asserts','2023-08',WB,'none','high')

C('rd-tizob2.txt','adjective and adverb discipline',
  "A reader who says he normally tolerates heavy prose reports that Tigana was the first book in which he met what others call purple prose.",
  "u/god935, r/Fantasy, 'Tigana (review/rant)', Mar 2022",
  RD%'tizob2/tigana_reviewrant',
  "this was first time I encountered what others call purple prose","opening post",'reader','rejects','2022-03',WB,'none','high')

C('rd-tizob2.txt','sentence length variation',
  "The same reader names long sentences loaded with adjectives as the specific fault.",
  "u/god935, r/Fantasy, 'Tigana (review/rant)', Mar 2022",
  RD%'tizob2/tigana_reviewrant',
  "the sentences were too long and full of adjectives","opening post",'reader','rejects','2022-03',WB,'none','high')

C('rd-tizob2.txt','repetition and refrain',
  "A commenter attributes the padding to adjectives and to characters restating the same thing in synonyms.",
  "u/grembu, comment in r/Fantasy 'Tigana (review/rant)', Mar 2022",
  RD%'tizob2/tigana_reviewrant',
  "because of all the adjectives and repeating","top comment",'reader','rejects','2022-03',WB,'none','high')

C('rd-1goa369.txt','other: divided reader verdict on the prose',
  "A reviewer who ranks Tigana in his top tier states in the same sentence that Kay's prose will definitely annoy some readers.",
  "u/aroseandawritingdesk, r/Fantasy, 'Tigana - A Review', Nov 2024",
  RD%'1goa369/tigana_a_review',
  "Kay's prose is lyrical and beautiful, but will definitely annoy some","review body",'reader','asserts','2024-11',WB,'none','high')

C('rd-1goa369.txt','plainness and economy',
  "The same reviewer argues that a plainer or clipped action style would have made the novel worse, because the prose is what carries the characters' attachment to their homeland.",
  "u/aroseandawritingdesk, r/Fantasy, 'Tigana - A Review', Nov 2024",
  RD%'1goa369/tigana_a_review',
  "Simpler prose, or even a brisk, clipped, action-oriented style, however, would lessen","review body",'reader','rejects','2024-11',WB,'none','high')

C('rd-1goa369.txt','concrete sensory noun',
  "The same reviewer says the prose works by impressing small overlooked details of a homeland on the reader.",
  "u/aroseandawritingdesk, r/Fantasy, 'Tigana - A Review', Nov 2024",
  RD%'1goa369/tigana_a_review',
  "the fine and easily overlooked details that make something truly theirs","review body",'reader','asserts','2024-11',WB,'dossier-archivist','high')

C('rd-1goa369.txt','other: divided reader verdict on the prose',
  "A commenter in the same thread reports that readers on Reddit commonly attack Tigana when Kay comes up, and declares his own liking for the flowery prose against them.",
  "u/drossmo12, comment in r/Fantasy 'Tigana - A Review', Nov 2024",
  RD%'1goa369/tigana_a_review',
  "I love how flowery GGK's prose is","comment thread",'reader','asserts','2024-11',WB,'none','high')

C('rd-ve636z.txt','other: divided reader verdict on the prose',
  "A commenter frames the question of whether Kay's prose is beautiful or too dry as one of the arguments the book leaves open to its readers.",
  "u/wgr-aw, comment in r/Fantasy 'Tigana.. Why do people like this book?', Jun 2022",
  RD%'ve636z/tigana_why_do_people_like_this_book',
  "Is GGK prose beautiful or too dry initially","comment thread",'reader','mentions','2022-06',WB,'none','high')

C('rd-ve636z.txt','withheld information and inference',
  "A reader who abandoned Tigana twice complains that the book announces its emotion instead of enacting it.",
  "u/_____michel_____, r/Fantasy, 'Tigana.. Why do people like this book?', Jun 2022",
  RD%'ve636z/tigana_why_do_people_like_this_book',
  "The author is doing a lot of telling and very little showing","opening post",'reader','rejects','2022-06',WB,'none','high')

C('rd-fkdpfg.txt','place and institution description',
  "A reviewer describes Kay's handling of his invented peninsula's history as withheld and timed rather than delivered in bulk.",
  "u/joshua-bush, r/Fantasy, '[Review] Tigana: A Misguided Masterpiece?', Mar 2020",
  RD%'fkdpfg/review_tigana_a_misguided_masterpiece',
  "never bludgeons the reader with it, instead planting seeds early on","review body",'reader','asserts','2020-03',WB,'dossier-archivist','high')

C('rd-fkdpfg.txt','omission as information',
  "The same reviewer says Kay withholds most of the world he could describe and shows only the part the reader is hungry for.",
  "u/joshua-bush, r/Fantasy, '[Review] Tigana: A Misguided Masterpiece?', Mar 2020",
  RD%'fkdpfg/review_tigana_a_misguided_masterpiece',
  "he shows us only what is most interesting","review body",'reader','asserts','2020-03',WB,'dossier-archivist','high')

C('rd-fkdpfg.txt','point of view and distance',
  "The same reviewer says the novel's turning points are perceived through its humbler characters rather than its great ones.",
  "u/joshua-bush, r/Fantasy, '[Review] Tigana: A Misguided Masterpiece?', Mar 2020",
  RD%'fkdpfg/review_tigana_a_misguided_masterpiece',
  "the eyes of these more humble characters that we perceive the moments","review body",'reader','asserts','2020-03',WB,'chronicle-line','high')

C('rd-7p5ro9.txt','other: reader parody of the register',
  "A reader forty per cent through Tigana writes a parody of the novel's lament register in block capitals to show what tires him, while granting the prose is gorgeous.",
  "u/fincoherent, r/Fantasy, 'Tigana by GGK - should I keep going?', Jan 2018",
  RD%'7p5ro9/tigana_by_ggk_should_i_keep_going',
  "the prose is gorgeous and I like the characterisation and world","opening post",'reader','disputes','2018-01',WB,'none','high')

C('rd-1bep250.txt','plainness and economy',
  "A commenter who abandoned the book calls Kay's sentences grammatically competent but not enjoyable to read.",
  "u/Assiniboia, comment in r/Fantasy 'Is Tigana a good representation of Guy Gavriel Kay?', Mar 2024",
  RD%'1bep250/is_tigana_a_good_representation_of_guy_gavriel_kay',
  "he writes grammatically competent sentences but not fun to read","comment thread",'reader','rejects','2024-03',WB,'none','high')

C('rd-15u1pk0.txt','other: divided reader verdict on the prose',
  "A reader who calls the writing lovely reports that the same book's treatment of its villain divides earlier threads on the subreddit.",
  "u/contrasupra, r/Fantasy, 'Some thoughts about Tigana (heavy spoilers)', Aug 2023",
  RD%'15u1pk0/some_thoughts_about_tigana_heavy_spoilers',
  "I thought the writing was lovely, the ideas intriguing","opening post",'reader','asserts','2023-08',WB,'none','high')

# ---------------- Goodreads reviews ----------------
GT="https://www.goodreads.com/book/show/104089.Tigana"
GL="https://www.goodreads.com/book/show/104101.The_Lions_of_Al_Rassan"

C('gr-tigana.reviews.json','other: divided reader verdict on the prose',
  "On the same Goodreads page a one-star reviewer says the prose is so flowery it made his eyes bleed.",
  "Pietro, Goodreads review of Tigana, 9 Aug 2012 (431 likes)", GT,
  "the prose is so flowery it made my eyes bleed","reviews list",'reader','rejects','2012-08-09',GRR,'none','high')

C('gr-tigana.reviews.json','adjective and adverb discipline',
  "A four-star Goodreads reviewer of Tigana praises the prose precisely for never becoming too flowery.",
  "Petrik, Goodreads review of Tigana, 31 Jul 2017 (304 likes)", GT,
  "beautiful, elegant, enchanting, and never gets too flowery to read","reviews list",'reader','asserts','2017-07-31',GRR,'none','high')

C('gr-tigana.reviews.json','repetition and refrain',
  "A two-star Goodreads reviewer names melodrama and garrulousness, saying each chapter restates the same things.",
  "Hamad, Goodreads review of Tigana, 22 Mar 2021 (41 likes)", GT,
  "it was so melodramatic and garrulous","reviews list",'reader','rejects','2021-03-22',GRR,'none','high')

C('gr-tigana.reviews.json','adjective and adverb discipline',
  "A three-star Goodreads reviewer of Tigana calls the writing too descriptive and flowery at times.",
  "Nicole, Goodreads review of Tigana, 26 Mar 2021 (129 likes)", GT,
  "The writing was too descriptive sometimes and flowery","reviews list",'reader','rejects','2021-03-26',GRR,'none','high')

C('gr-tigana.reviews.json','cadence and rhythm',
  "A five-star Goodreads reviewer locates Kay's effect in a lyrical quality carried at the level of the sentence.",
  "Choko, Goodreads review of Tigana, 6 Aug 2017 (75 likes)", GT,
  "it carries a lyrical magic which simmers in every sentence","reviews list",'reader','asserts','2017-08-06',GRR,'chronicle-line','high')

C('gr-tigana.reviews.json','plainness and economy',
  "A five-star Goodreads reviewer describes Kay's language as beautiful and at the same time ascetic, stopping short of flowery baroque.",
  "Mayim de Vries, Goodreads review of Tigana, 8 Sep 2016 (119 likes)", GT,
  "beautiful and the same time ascetic without going full-fledge flowery baroque","reviews list",'reader','asserts','2016-09-08',GRR,'dossier-archivist','high')

C('gr-tigana.reviews.json','concrete sensory noun',
  "The same reviewer says the smallest background details in Tigana each contribute to the whole picture.",
  "Mayim de Vries, Goodreads review of Tigana, 8 Sep 2016 (119 likes)", GT,
  "even the most meaningless background details contribute to the overall picture","reviews list",'reader','asserts','2016-09-08',GRR,'dossier-archivist','high')

C('gr-tigana.reviews.json','cadence and rhythm',
  "A four-star Goodreads reviewer characterises Kay's writing as prose-poetical, smooth and impressionistic.",
  "Bradley, Goodreads review of Tigana, 20 Mar 2020 (50 likes)", GT,
  "His writing is often prose-poetical, smooth and impressionistic","reviews list",'reader','asserts','2020-03-20',GRR,'none','high')

C('gr-tigana.reviews.json','other: divided reader verdict on the prose',
  "A two-star Goodreads reviewer separates the prose from the story explicitly in his headline verdict.",
  "Matt's Fantasy Book Reviews, Goodreads review of Tigana, 17 Mar 2022 (151 likes)", GT,
  "Beautiful prose, but the story falls incredibly flat","reviews list",'reader','disputes','2022-03-17',GRR,'none','high')

C('gr-tigana.reviews.json','place and institution description',
  "A five-star Goodreads reviewer reports feeling the atmosphere of each individual city and tavern in the book.",
  "Ivan, Goodreads review of Tigana, 25 May 2014 (58 likes)", GT,
  "I could feel atmosphere of every city and every tavern","reviews list",'reader','asserts','2014-05-25',GRR,'dossier-archivist','high')

C('gr-lions.reviews.json','register modulation',
  "A five-star Goodreads reviewer of The Lions of Al-Rassan calls the style versatile, listing lavish description, witty dialogue and poetry as separate registers within one book.",
  "Alissa, Goodreads review of The Lions of Al-Rassan, 29 Oct 2014 (41 likes)", GL,
  "it offers both lavish descriptions, witty dialogues, elegant poetry","reviews list",'reader','asserts','2014-10-29',GRR,'none','high')

C('gr-lions.reviews.json','place and institution description',
  "A two-star Goodreads reviewer of The Lions of Al-Rassan notes as a structural habit that scenes open with a view of the city or enclave the next characters occupy.",
  "Molly Ison, Goodreads review of The Lions of Al-Rassan, 15 Jul 2013 (38 likes)", GL,
  "Scenes open with a view of the city or enclave","reviews list",'reader','mentions','2013-07-15',GRR,'dossier-archivist','high')

C('gr-lions.reviews.json','cadence and rhythm',
  "A four-star Goodreads reviewer of The Lions of Al-Rassan calls its prose elegant with a flowing feel.",
  "mark monday, Goodreads review of The Lions of Al-Rassan, 30 Nov 2012 (133 likes)", GL,
  "its prose is elegant and has such a lovely flowing feel","reviews list",'reader','asserts','2012-11-30',GRR,'none','high')

C('gr-lions.reviews.json','other: divided reader verdict on the prose',
  "A two-star Goodreads reviewer of The Lions of Al-Rassan says the writing never engaged him at any point.",
  "Terence, Goodreads review of The Lions of Al-Rassan, 7 Mar 2011 (66 likes)", GL,
  "at no point did the writing engage me","reviews list",'reader','rejects','2011-03-07',GRR,'none','high')

C('gr-lions.reviews.json','other: divided reader verdict on the prose',
  "A four-star Goodreads reviewer of The Lions of Al-Rassan enjoys Kay's prose but declines to rank it among her favourites.",
  "Booksblabbering (Cait), Goodreads review of The Lions of Al-Rassan, 9 Jan 2026 (38 likes)", GL,
  "whilst I enjoy GGK’s prose, it’s not a favourite of mine","reviews list",'reader','disputes','2026-01-09',GRR,'none','high')

C('gr-lions.reviews.json','plainness and economy',
  "A four-star Goodreads reviewer of The Lions of Al-Rassan calls the prose purposeful and engaging without being overly dense.",
  "Tori Tecken, Goodreads review of The Lions of Al-Rassan, 25 Aug 2025 (31 likes)", GL,
  "The prose is really purposeful and engaging, without being overly dense","reviews list",'reader','asserts','2025-08-25',GRR,'dossier-archivist','high')

# ---------------- Goodreads group topic (split room) ----------------
GTOP="https://www.goodreads.com/topic/show/917171-tig-who-s-better-guy-gavriel-kay-or-george-r-r-martin"
C('grtopic-kaymartin.txt','other: divided reader verdict on the prose',
  "In a 2012 Sword and Laser topic one reader dismisses Kay's language as flowery padding.",
  "terpkristin, message 32, Goodreads Sword and Laser topic, 14 Jun 2012", GTOP,
  "Kay uses too much flowery language without saying anything extra","message 32",'reader','rejects','2012-06-14','browser user agent on the live Goodreads topic page','none','high')

C('grtopic-kaymartin.txt','other: divided reader verdict on the prose',
  "In the same topic another reader credits Kay's language with evoking imagery he had not previously conceived.",
  "Devin, message 31, Goodreads Sword and Laser topic, 14 Jun 2012", GTOP,
  "Kay is able to use language to evoke emotions & imagery","message 31",'reader','asserts','2012-06-14','browser user agent on the live Goodreads topic page','none','high')

C('grtopic-kaymartin.txt','other: reader image for the register',
  "A reader offers a camera metaphor for the difference in register between Martin and Kay.",
  "Vance, message 2, Goodreads Sword and Laser topic, 6 Jun 2012", GTOP,
  "Martin seems to write in HD, where Kay uses a soft filter","message 2",'reader','asserts','2012-06-06','browser user agent on the live Goodreads topic page','none','high')

C('grtopic-kaymartin.txt','place and institution description',
  "A reader in the same topic names as a distinguishing habit that Kay will stay in a place and meditate on it.",
  "Amanda, message 6, Goodreads Sword and Laser topic, 6 Jun 2012", GTOP,
  "Kay has nothing against staying in a place and meditating on it","message 6",'reader','asserts','2012-06-06','browser user agent on the live Goodreads topic page','dossier-archivist','high')

# ---------------- reader essay ----------------
C('b3en.txt','plainness and economy',
  "A reader-reviewer who enjoys Kay's prose says he nevertheless wishes there were less of it.",
  "Brok3n Engines, 'Tigana, by Guy Gavriel Kay - GGK in transition', Substack, 16 Apr 2025",
  "https://b3en.substack.com/p/ggk-in-transition",
  "I often wish there was less of it","review body",'reader','disputes','2025-04-16','browser user agent','none','high')

# ---------------- the lecture, second-hand ----------------
C('cheryl.txt','withheld information and inference',
  "A listener reporting the 2021 Tolkien Lecture the same evening records Kay's stated reason for leaving magic unexplained as making the book a dialogue rather than a monologue.",
  "Cheryl Morgan, 'Guy Kay's Tolkien Lecture', Cheryl's Mewsings, 11 May 2021",
  "https://www.cheryl-morgan.com/?p=28717",
  "a dialogue with the reader, and not just a monologue","post body",'reception','asserts','2021-05-11','browser user agent; the lecture video itself is caption-blocked','dossier-archivist','medium')

C('cheryl.txt','omission as information',
  "The same reporter states that the lecture's whole topic was how much light an author should shed on the workings of magic.",
  "Cheryl Morgan, 'Guy Kay's Tolkien Lecture', Cheryl's Mewsings, 11 May 2021",
  "https://www.cheryl-morgan.com/?p=28717",
  "how much light an author should shed upon the workings of magic","post body",'reception','asserts','2021-05-11','browser user agent','dossier-archivist','high')

# ================= second batch =================
GU="https://www.goodreads.com/book/show/7139892-under-heaven"
GC="https://www.goodreads.com/book/show/25938417-children-of-earth-and-sky"

C('gr-under.reviews.json','adjective and adverb discipline',
  "A Goodreads reviewer of Under Heaven says its prose is the most adjective-free Kay has written and that an immediacy comes from that simplicity.",
  "Brad, Goodreads review of Under Heaven, 5 Jul 2012 (25 likes)", GU,
  "His prose was as adjective free as it has ever been","reviews list",'reader','asserts','2012-07-05',GRR,'dossier-archivist','high')

C('gr-under.reviews.json','plainness and economy',
  "A five-star Goodreads reviewer of Under Heaven describes the writing as never saying more or less than was needed.",
  "Mike, Goodreads review of Under Heaven, 11 Feb 2014 (14 likes)", GU,
  "never saying more or less than was needed","reviews list",'reader','asserts','2014-02-11',GRR,'dossier-archivist','high')

C('gr-under.reviews.json','plainness and economy',
  "A four-star Goodreads reviewer of Under Heaven contrasts Kay with verbose writers and assigns him to a less-is-more school.",
  "Veronica, Goodreads review of Under Heaven, 5 May 2019 (16 likes)", GU,
  "Kay subscribes to the \u201cless is more\u201d school of writing","reviews list",'reader','asserts','2019-05-05',GRR,'dossier-archivist','high')

C('gr-under.reviews.json','adjective and adverb discipline',
  "A four-star Goodreads reviewer of Under Heaven says Kay's language never veers near purple prose.",
  "Mayim de Vries, Goodreads review of Under Heaven, 15 Jun 2019 (34 likes)", GU,
  "never veering near the purple prose so many of us detest","reviews list",'reader','asserts','2019-06-15',GRR,'none','high')

C('gr-under.reviews.json','other: punctuation habit',
  "A four-star Goodreads reviewer of Under Heaven names comma use as a habit of the style.",
  "Paul O\u2019Neill, Goodreads review of Under Heaven, 6 Apr 2017 (82 likes)", GU,
  "Kay does go a bit overboard with commas","reviews list",'reader','mentions','2017-04-06',GRR,'none','high')

C('gr-under.reviews.json','other: divided reader verdict on the prose',
  "A four-star Goodreads reviewer of Under Heaven says Kay's poetic lushness can sound like a bodice-ripper.",
  "D. Pow, Goodreads review of Under Heaven, 18 Jul 2010 (13 likes)", GU,
  "a poetic lushness in the language that can sound a bit","reviews list",'reader','disputes','2010-07-18',GRR,'none','high')

C('gr-under.reviews.json','other: divided reader verdict on the prose',
  "A three-star Goodreads reviewer of Under Heaven states that beautiful prose was not sufficient for her.",
  "agata, Goodreads review of Under Heaven, 26 Jun 2012 (15 likes)", GU,
  "beautiful prose is not enough, if you start out promising more","reviews list",'reader','disputes','2012-06-26',GRR,'none','high')

C('gr-under.reviews.json','cadence and rhythm',
  "A five-star Goodreads reviewer of Under Heaven contrasts merely coherent sentences with woven ones and says a well-woven sentence sings.",
  "Khanh, Goodreads review of Under Heaven, 9 Jan 2011 (367 likes)", GU,
  "A well-woven sentence speaks to the heart, it sings to the spirit","reviews list",'reader','asserts','2011-01-09',GRR,'none','high')

C('gr-coes.reviews.json','other: competing accounts of one event',
  "A Goodreads reviewer of Children of Earth and Sky reports the novel makes the reader read one event two or three times as different characters describe it.",
  "Mogsy, Goodreads review of Children of Earth and Sky, 15 Jul 2015 (61 likes)", GC,
  "read about the same event two or three times as multiple characters","reviews list",'reader','mentions','2015-07-15',GRR,'chronicle-line','high')

C('gr-coes.reviews.json','place and institution description',
  "A Goodreads reviewer of Children of Earth and Sky calls the setting richly described through its competing maritime city-states.",
  "Krell75, Goodreads review of Children of Earth and Sky, 6 May 2025 (78 likes; reviewer's own English rendering below the Italian)", GC,
  "richly described with its competing maritime city-states","reviews list",'reader','asserts','2025-05-06',GRR,'dossier-archivist','high')

C('gr-coes.reviews.json','plainness and economy',
  "A five-star Goodreads reviewer of Children of Earth and Sky credits Kay's clarity of prose with making a complex world accessible.",
  "Tadiana, Goodreads review of Children of Earth and Sky, 17 May 2016 (138 likes)", GC,
  "made so accessible by Kay\u2019s clarity of prose","reviews list",'reader','asserts','2016-05-17',GRR,'dossier-archivist','high')

C('gr-coes.reviews.json','metaphor discipline',
  "A three-star Goodreads reviewer of Children of Earth and Sky calls the fantasy minimalistic and oblique and credits a disciplined imagination.",
  "Lyn, Goodreads review of Children of Earth and Sky, 23 Mar 2016 (70 likes)", GC,
  "The fantasy is minimalistic and oblique","reviews list",'reader','asserts','2016-03-23',GRR,'dossier-archivist','high')

C('gr-coes.reviews.json','other: divided reader verdict on the prose',
  "A three-star Goodreads reviewer of Children of Earth and Sky calls the style repetitive and dense in places.",
  "tiffany, Goodreads review of Children of Earth and Sky, 18 May 2024 (26 likes)", GC,
  "the writing style was a bit repetitive and dense at times","reviews list",'reader','disputes','2024-05-18',GRR,'none','high')

C('gr-coes.reviews.json','point of view and distance',
  "A five-star Goodreads reviewer of Children of Earth and Sky notes the prose moves between protagonists within a single scene.",
  "Melissa McShane, Goodreads review of Children of Earth and Sky, 19 Mar 2016 (17 likes)", GC,
  "a prose style that leaps from one to another, sometimes within","reviews list",'reader','mentions','2016-03-19',GRR,'chronicle-line','high')

C('gr-coes.reviews.json','other: reader label for the register',
  "A Goodreads reviewer relays the novelist Janny Wurts's description of Kay's writing as lyrical nostalgia and endorses it.",
  "Joshua Thompson relaying Janny Wurts, Goodreads review of Children of Earth and Sky, 1 Mar 2025 (39 likes)", GC,
  "describe Kay's writing as \"lyrical nostalgia\"","reviews list",'reader','asserts','2025-03-01',GRR,'none','medium')

# ---- Goodreads 'where should I start' topic ----
GTOP2="https://www.goodreads.com/topic/show/565852-guy-gavriel-kay-where-should-i-start"
C('grtopic-start.txt','other: divided reader verdict on the prose',
  "A dissenting reader in a Goodreads recommendation thread concedes Kay's superior writing and still judges the books more smoke than fire.",
  "an anonymised member, message 4, Goodreads SciFi and Fantasy Book Club topic, 30 May 2011", GTOP2,
  "He writes better than I ever could, but for me his","message 4",'reader','disputes','2011-05-30','browser user agent','none','high')

C('grtopic-start.txt','other: divided reader verdict on the prose',
  "The same reader says Kay's writing flies high only intermittently.",
  "an anonymised member, message 4, Goodreads SciFi and Fantasy Book Club topic, 30 May 2011", GTOP2,
  "There are moments his writing really flighs high","message 4",'reader','disputes','2011-05-30','browser user agent','none','high')

# ---- the lecture, as transcribed by a reporter ----
TOR="https://reactormag.com/jrr-tolkien-guy-gavriel-kay-lecture-just-enough-light-some-thoughts-on-fantasy-and-literature-watch/"
C('tor.txt','withheld information and inference',
  "A reporter transcribing the 2021 Tolkien Lecture records Kay taking Walter Bagehot's line against letting daylight in upon magic as the lecture's governing text.",
  "Guy Gavriel Kay quoting Walter Bagehot, transcribed by Andrew Liptak, Tor.com, 13 May 2021", TOR,
  "We must not let in daylight upon magic","body, Kay's quoted opening",'own-words','asserts','2021-05-13','browser user agent on the reactormag redirect of the tor.com post','dossier-archivist','medium')

C('tor.txt','withheld information and inference',
  "In the same transcribed passage Kay says anyone writing fantasy must contend with the reverberations of that line.",
  "Guy Gavriel Kay, transcribed by Andrew Liptak, Tor.com, 13 May 2021", TOR,
  "needs to contend with the reverberations of Bagehot\u2019s line","body, Kay's quoted paragraph",'own-words','asserts','2021-05-13','browser user agent; the transcription garbles a later clause, so only this span is claimed','dossier-archivist','medium')

# ================= third batch: book club and forums =================
QU="https://thequilltolive.com/2016/03/17/book-club-discussion-tigana-by-guy-gabriel-kay/"
C('quill.txt','other: divided reader verdict on the prose',
  "A book club reports that Tigana split its members into two camps rather than a spectrum of opinion.",
  "Andrew Mather, 'Book Club Discussion: Tigana By Guy Gavriel Kay', The Quill to Live, 17 Mar 2016", QU,
  "more of a splitting into two camps: people who loved it","post body",'reader','asserts','2016-03-17','browser user agent','none','high')

C('quill.txt','other: divided reader verdict on the prose',
  "The same book club reports its scores fell at the two ends of the scale, half at nine or above and half below five, averaging seven with nobody content.",
  "Andrew Mather, 'Book Club Discussion: Tigana By Guy Gavriel Kay', The Quill to Live, 17 Mar 2016", QU,
  "half of the group had scores of nine or above","post body",'measurement','asserts','2016-03-17','browser user agent','none','high')

C('quill.txt','plainness and economy',
  "The dissenting half of that book club called the writing pretentious and said they preferred more austere prose.",
  "Andrew Mather reporting the club's 'con' group, The Quill to Live, 17 Mar 2016", QU,
  "found the writing pretentious and that they preferred more austere prose","post body, 'Team Anti-Tigana'",'reader','rejects','2016-03-17','browser user agent','none','high')

C('quill.txt','point of view and distance',
  "The same dissenting group found the pacing jarring because the perspective jumps from point-of-view to point-of-view.",
  "Andrew Mather reporting the club's 'con' group, The Quill to Live, 17 Mar 2016", QU,
  "the perspective often jumps from point-of-view to point-of-view","post body, 'Team Anti-Tigana'",'reader','rejects','2016-03-17','browser user agent','none','high')

SFF="https://www.sffworld.com/forum/threads/question-regarding-guy-gavriel-kays-books.32913/"
C('sffworld.txt','other: reader label for the register',
  "A forum member characterises Kay's manner of writing as controlled and orchestrated.",
  "Erfael, SFFWorld forum, 6 Dec 2011", SFF,
  "Kay writes in a very controlled, orchestrated way","post #5",'reader','asserts','2011-12-06','browser user agent','none','high')

C('sffworld.txt','other: divided reader verdict on the prose',
  "A forum member warns that a reader wanting a fast paced tight narrative will not suit Kay, while naming evocative prose as his best trait.",
  "a member replying at post #4, SFFWorld forum, 6 Dec 2011", SFF,
  "His best traits are his evocative prose, quality characterization and flair","post #4",'reader','asserts','2011-12-06','browser user agent','none','high')

C('sffworld.txt','register modulation',
  "A forum member who reread two Kay novels back to back reports subtle differences of tone and manner of writing between them.",
  "a member at post #2, SFFWorld forum, 6 Dec 2011", SFF,
  "lovely, subtle differences in his tone and manner of writing","post #2",'reader','asserts','2011-12-06','browser user agent','none','high')

G111="https://www.goodreads.com/topic/show/111082-guy-gavriel-kay"
C('grtopic-111082.txt','diction (native vs latinate)',
  "A reader in a Goodreads Fantasy Book Club topic finds Kay's writing unnatural, saying he reaches for obscure words instead of his honest voice.",
  "Josh, message 8, Goodreads Fantasy Book Club topic on Guy Gavriel Kay, 27 Feb 2009", G111,
  "he tries too hard to wow the reader with tons","message 8",'reader','rejects','2009-02-27','browser user agent','none','high')

C('grtopic-111082.txt','other: divided reader verdict on the prose',
  "Another member of the same topic states she has no issue with the style and calls his use of language precise and lyric.",
  "Janny, message 12, Goodreads Fantasy Book Club topic on Guy Gavriel Kay, 12 Mar 2009", G111,
  "his use of language is precise, and lyric, and highly creative","message 12",'reader','asserts','2009-03-12','browser user agent','none','high')

C('grtopic-111082.txt','register modulation',
  "The same member distinguishes Ysabel as quicker and less atmospheric, recommending it to a reader who wants a leaner prose style.",
  "Janny, message 12, Goodreads Fantasy Book Club topic on Guy Gavriel Kay, 12 Mar 2009", G111,
  "a reader looking for a leaner prose style","message 12",'reader','asserts','2009-03-12','browser user agent','none','high')

C('grtopic-111082.txt','place and institution description',
  "A member of the same topic describes Kay's method as travelling to a locale to absorb local colour and then writing on the region's theme.",
  "a member of the Goodreads Fantasy Book Club topic on Guy Gavriel Kay, 2009", G111,
  "travels to a locale to soak up local color","topic thread",'reader','asserts','2009','browser user agent','dossier-archivist','medium')

# ================= fourth batch: reader blogs =================
OLS="https://onelastsketch.wordpress.com/2011/12/12/flippant-reviews-guy-gavriel-kay/"
C('ols.txt','register modulation',
  "A reader-blogger reviewing Kay's whole run says Tigana's prose is very different from the often lean prose of The Fionavar Tapestry.",
  "Michal, 'Flippant Reviews: Guy Gavriel Kay', One Last Sketch, 12 Dec 2011", OLS,
  "very different from the often lean prose of The Fionavar Tapestry","post body, Tigana",'reader','asserts','2011-12-12','browser user agent','none','high')

C('ols.txt','register modulation',
  "The same blogger says that in The Last Light of the Sun Kay's ornate style is cut down to a rougher language of sentence fragments and strong images.",
  "Michal, 'Flippant Reviews: Guy Gavriel Kay', One Last Sketch, 12 Dec 2011", OLS,
  "ornate style is cut down here to a much rougher use","post body, The Last Light of the Sun",'reader','asserts','2011-12-12','browser user agent','chronicle-line','high')

C('ols.txt','withheld information and inference',
  "The same blogger objects that the reader is too often told how to feel and given overwrought reminiscence about the lost province.",
  "Michal, 'Flippant Reviews: Guy Gavriel Kay', One Last Sketch, 12 Dec 2011", OLS,
  "We\u2019re all too often told how to feel","post body, Tigana",'reader','rejects','2011-12-12','browser user agent','none','high')

C('ols.txt','other: divided reader verdict on the prose',
  "The same blogger names as an annoyance Kay's habit of long tangents describing the vast import of a historical moment.",
  "Michal, 'Flippant Reviews: Guy Gavriel Kay', One Last Sketch, 12 Dec 2011", OLS,
  "long tangents describing the vast import of some historical moment","post body",'reader','rejects','2011-12-12','browser user agent','chronicle-line','high')

FF="https://fantasy-faction.com/2013/tigana-by-guy-gavriel-kay"
C('ff.txt','other: divided reader verdict on the prose',
  "A reviewer for a fan site calls the prose technically superb and in the same review says it often felt cold and clinical.",
  "Alister, 'Tigana by Guy Gavriel Kay', Fantasy-Faction, 2013", FF,
  "the prose often felt cold and clinical, even lacking in emotion","review body",'reader','disputes','2013','browser user agent','none','high')

C('ff.txt','civic record register',
  "The same reviewer says Tigana can feel academic in its structure and its descriptions, and links that to Kay's Silmarillion work.",
  "Alister, 'Tigana by Guy Gavriel Kay', Fantasy-Faction, 2013", FF,
  "can feel quite academic in its structure and descriptions","review body",'reader','asserts','2013','browser user agent','dossier-archivist','high')

C('ff.txt','place and institution description',
  "The same reviewer credits the flowing lyrical prose with making the world vivid and real.",
  "Alister, 'Tigana by Guy Gavriel Kay', Fantasy-Faction, 2013", FF,
  "the prose flowing and lyrical, making the world vivid and real","review body",'reader','asserts','2013','browser user agent','dossier-archivist','high')

# ================= fifth batch: a reader blog on the register itself =================
ROW="https://therowanwoodchronicles.blog/2025/12/24/fantasy-as-memory-the-historical-imagination-of-guy-gavriel-kay/"
C('rowan.txt','metaphor discipline',
  "A reader-blogger says Kay does not bury the reader in invented terminology or ornate description.",
  "Chris McBean, 'Fantasy as Memory: The Historical Imagination of Guy Gavriel Kay', The Rowanwood Chronicles, 24 Dec 2025", ROW,
  "he does not bury the reader in invented terminology or ornate description","post body",'reader','asserts','2025-12-24','browser user agent',"dossier-archivist","medium (an uncredentialed 2025 blog post whose own prose reads formulaic; treat it as one reader's summary, not as criticism)")

C('rowan.txt','cadence and rhythm',
  "The same blogger says Kay favours cadence, balance and chosen imagery over density or excess.",
  "Chris McBean, 'Fantasy as Memory: The Historical Imagination of Guy Gavriel Kay', The Rowanwood Chronicles, 24 Dec 2025", ROW,
  "He favours cadence, balance, and carefully chosen imagery over density or excess","post body",'reader','asserts','2025-12-24','browser user agent','none',"medium (an uncredentialed 2025 blog post whose own prose reads formulaic; treat it as one reader's summary, not as criticism)")

C('rowan.txt','dialogue register',
  "The same blogger describes Kay's dialogue as formal without being stiff and shaped by the social world of the speaker.",
  "Chris McBean, 'Fantasy as Memory: The Historical Imagination of Guy Gavriel Kay', The Rowanwood Chronicles, 24 Dec 2025", ROW,
  "His dialogue is formal without being stiff","post body",'reader','asserts','2025-12-24','browser user agent','none',"medium (an uncredentialed 2025 blog post whose own prose reads formulaic; treat it as one reader's summary, not as criticism)")

C('rowan.txt','other: history as residue on ordinary people',
  "The same blogger says the writing turns away from grand national mythmaking towards human cost and quiet endurance.",
  "Chris McBean, 'Fantasy as Memory: The Historical Imagination of Guy Gavriel Kay', The Rowanwood Chronicles, 24 Dec 2025", ROW,
  "resists grand national mythmaking and instead focuses on human cost","post body",'reader','asserts','2025-12-24','browser user agent','chronicle-line',"medium (an uncredentialed 2025 blog post whose own prose reads formulaic; treat it as one reader's summary, not as criticism)")

# ================= sixth batch: Written on the Dark (2025) readers =================
GW="https://www.goodreads.com/book/show/218153843-written-on-the-dark"

C('gr-wotd.reviews.json','sentence length variation',
  "A Goodreads reviewer of Written on the Dark reports that the average phrase length in it is shorter than in Kay's other books.",
  "Jake Bishop, Goodreads review of Written on the Dark, 3 May 2025 (60 likes)", GW,
  "the average phrase length in this was shorter than most other","reviews list",'reader','asserts','2025-05-03',GRR,'chronicle-line','high')

C('gr-wotd.reviews.json','per-speaker register',
  "The same reviewer says that late in Kay's career too many characters' voices and dialogue sound slightly too similar to the narrator's.",
  "Jake Bishop, Goodreads review of Written on the Dark, 3 May 2025 (60 likes)", GW,
  "too many characters voices, and dialogue, sound slightly too similar","reviews list",'reader','rejects','2025-05-03',GRR,'herald-pools','high')

C('gr-wotd.reviews.json','register modulation',
  "A Goodreads reviewer of Written on the Dark says the writing here uses cut-short sentences rather than the flowing prose he expected.",
  "Ben Coleman, Goodreads review of Written on the Dark, 3 May 2025 (23 likes)", GW,
  "making use of cut-short sentences rather than using flowing, beautiful prose","reviews list",'reader','asserts','2025-05-03',GRR,'chronicle-line','high')

C('gr-wotd.reviews.json','plainness and economy',
  "A two-star Goodreads reviewer of Written on the Dark calls the writing downright spare and says that is not an improvement.",
  "Morgan, Goodreads review of Written on the Dark, 9 Jun 2025 (13 likes)", GW,
  "the writing is downright spare in this","reviews list",'reader','rejects','2025-06-09',GRR,'none','high')

C('gr-wotd.reviews.json','other: divided reader verdict on the prose',
  "The same reviewer says she read the other reviews first and was surprised at the glowing praise for the prose.",
  "Morgan, Goodreads review of Written on the Dark, 9 Jun 2025 (13 likes)", GW,
  "surprised at the glowing praise for the prose in this book","reviews list",'reader','disputes','2025-06-09',GRR,'none','high')

C('gr-wotd.reviews.json','other: divided reader verdict on the prose',
  "A two-star Goodreads reviewer of Written on the Dark writes that some readers will call this style rich and full of weight, while he finds it rambling.",
  "Gyan K, Goodreads review of Written on the Dark, 6 Jul 2025 (59 likes)", GW,
  "Some will call this style rich, full of weight","reviews list",'reader','disputes','2025-07-06',GRR,'none','high')

C('gr-wotd.reviews.json','withheld information and inference',
  "The same reviewer objects that the book leans on voice rather than deeds and tells the reader what a character feels, dreams and fears.",
  "Gyan K, Goodreads review of Written on the Dark, 6 Jul 2025 (59 likes)", GW,
  "much is told to us: what one feels, what one dreams","reviews list",'reader','rejects','2025-07-06',GRR,'none','high')

C('gr-wotd.reviews.json','other: divided reader verdict on the prose',
  "A two-star Goodreads reviewer of Written on the Dark nevertheless ranks Kay's flowery prose with the greats of the genre.",
  "Moby D, Goodreads review of Written on the Dark, 12 Jun 2025 (13 likes)", GW,
  "His flowery prose rivals that of the very greats of the genre","reviews list",'reader','asserts','2025-06-12',GRR,'none','high')

C('gr-wotd.reviews.json','other: divided reader verdict on the prose',
  "A one-star Goodreads reviewer of Written on the Dark dismisses the prose as elegance, French names and wannabe poetry.",
  "Jonathan Maki, Goodreads review of Written on the Dark, 3 Jul 2025 (8 likes)", GW,
  "fancy french names and wannabe poetry","reviews list",'reader','rejects','2025-07-03',GRR,'none','high')

C('gr-wotd.reviews.json','consequence on a household',
  "A Goodreads reviewer of Written on the Dark praises Kay for granting even the most minor characters a narrative arc, sometimes in a single sentence or paragraph.",
  "The Speculative Shelf, Goodreads review of Written on the Dark, 13 Feb 2025 (70 likes)", GW,
  "grants even the most minor characters narrative arcs","reviews list",'reader','asserts','2025-02-13',GRR,'dossier-archivist','high')

C('gr-wotd.reviews.json','place and institution description',
  "A five-star Goodreads reviewer of Written on the Dark says the lyrical style gives the setting weight and beauty alongside its costs.",
  "Chris, Goodreads review of Written on the Dark, 9 Jan 2025 (18 likes)", GW,
  "lyrical prose style, which provides his setting with weight, and beauty","reviews list",'reader','asserts','2025-01-09',GRR,'dossier-archivist','high')

C('gr-wotd.reviews.json','plainness and economy',
  "A four-star Goodreads reviewer of Written on the Dark calls its prose more accessible than that of Kay's other works.",
  "The Speculative Shelf, Goodreads review of Written on the Dark, 13 Feb 2025 (70 likes)", GW,
  "featuring more accessible prose and POVs that stay close","reviews list",'reader','asserts','2025-02-13',GRR,'none','high')

# ================= seventh batch =================
GDM="https://www.grimdarkmagazine.com/review-all-the-seas-of-the-world-by-guy-gavriel-kay/"
C('gdm.txt','other: divided reader verdict on the prose',
  "A magazine reviewer states that Kay's way of writing fantasy will make him either a reader's absolute favourite or of no interest at all.",
  "reviewer, 'REVIEW: All The Seas of The World by Guy Gavriel Kay', Grimdark Magazine, 2022", GDM,
  "your absolute favorite authors, or you may not care","review body",'reception','asserts','2022',
  'browser user agent','none','high')

C('gdm.txt','metaphor discipline',
  "The same reviewer describes the prose as filled with borderline-poetic lines about fate, faith and connection.",
  "reviewer, 'REVIEW: All The Seas of The World by Guy Gavriel Kay', Grimdark Magazine, 2022", GDM,
  "filled with borderline-poetic lines that question the capricious nature","review body",'reception','asserts','2022',
  'browser user agent','none','high')

SSD="https://superstardrifter.com/2022/05/09/review-all-the-seas-of-the-world-by-guy-gavriel-kay/"
C('ssd.txt','place and institution description',
  "A reader-blogger recommends All the Seas of the World to anyone who loves prose that carries the reader away to another world.",
  "superstardrifter, 'Review: All the Seas of the World by Guy Gavriel Kay', 9 May 2022", SSD,
  "loves beautiful prose that takes you away to another world","review body",'reader','asserts','2022-05-09',
  'browser user agent','dossier-archivist','high')

SOURCES=[
 dict(title="Guy Gavriel Kay, 'Just Enough Light: Some Thoughts on Fantasy and Literature,' Tolkien Lecture 2021 (YouTube video, metadata + caption-track listing only)",
      url="https://www.youtube.com/watch?v=z1TgX0alFuM", kind="own-words", substantive=False, date="2021-05-11",
      route="yt-dlp -J with player_client=android_vr; CAPTIONS BLOCKED - Google 429 on /api/timedtext by every route tried"),
 dict(title="Interviews - BrightWeavings (Guy Gavriel Kay's authorised site, interview index)",
      url="https://brightweavings.com/category/ggks-words/interviews/", kind="own-words", substantive=True, date="2026",
      route="browser user agent"),
 dict(title="University Book Store Presents Guy Gavriel Kay in conversation with Nancy Pearl (BrightWeavings post; YouTube embed aXn4eb5sKS0)",
      url="https://brightweavings.com/university-book-store-presents-guy-gavriel-kay-in-conversation-with-nancy-pearl/",
      kind="own-words", substantive=False, date="2022-05-29", route="browser user agent; the embedded video's captions are behind the same 429 wall"),
 dict(title="Watch GGK in conversation with Paul Blezard at the Lockdown Litfest (BrightWeavings post; YouTube embed DLgiRfhIe8k)",
      url="https://brightweavings.com/watch-ggk-in-conversation-with-paul-blezard-at-the-lockdown-litfest/",
      kind="own-words", substantive=False, date="2021-05-30", route="browser user agent; same caption wall"),
 dict(title="Rick Kleffel: Narrative Species - The Agony Column podcast feed (four Guy Gavriel Kay episodes, 2007/2010/2010/2016, with mp3 enclosures)",
      url="http://bookotron.com/agony/indexes/tac_podcast.xml", kind="own-words", substantive=False, date="2016-06-08",
      route="direct fetch of the RSS; the episodes are bare mp3s and no ASR toolchain exists on this machine"),
 dict(title="Guy Gavriel Kay Lecture Recording - The J.R.R. Tolkien Lecture on Fantasy Literature",
      url="https://tolkienlecture.org/2021/05/14/guy-gavriel-kay-lecture-recording/", kind="reception", substantive=True,
      date="2021-05-14", route="browser user agent"),
 dict(title="Cheryl Morgan, 'Guy Kay's Tolkien Lecture', Cheryl's Mewsings",
      url="https://www.cheryl-morgan.com/?p=28717", kind="reception", substantive=True, date="2021-05-11", route="browser user agent"),
 dict(title="Brenton Dickieson, '\"Just Enough Light...\" the 2021 Tolkien Lecture by Guy Gavriel Kay', A Pilgrim in Narnia",
      url="https://apilgriminnarnia.com/2021/05/20/2021-tolkien-lecture-by-guy-gavriel-kay/", kind="reception", substantive=False,
      date="2021-05-20", route="browser user agent; frames the lecture but reports none of its content"),
 dict(title="Guy Gavriel Kay - University of Oxford Podcasts (Katherine Olley introduction; the one audio route that publishes a .srt)",
      url="https://podcasts.ox.ac.uk/guy-gavriel-kay", kind="analysis", substantive=False, date="2020-11-24", route="browser user agent"),
 dict(title="Tigana - Goodreads book page (30 reviews read from __NEXT_DATA__)",
      url="https://www.goodreads.com/book/show/104089.Tigana", kind="reader", substantive=True, date="2026-09-06", route="browser user agent; apolloState Review: nodes"),
 dict(title="The Lions of Al-Rassan - Goodreads book page (30 reviews read from __NEXT_DATA__)",
      url="https://www.goodreads.com/book/show/104101.The_Lions_of_Al_Rassan", kind="reader", substantive=True, date="2026-09-06", route="browser user agent; apolloState Review: nodes"),
 dict(title="TIG: Who's better, Guy Gavriel Kay or George R.R. Martin? - Goodreads Sword and Laser topic (72 messages)",
      url="https://www.goodreads.com/topic/show/917171-tig-who-s-better-guy-gavriel-kay-or-george-r-r-martin", kind="reader", substantive=True, date="2012-06", route="browser user agent"),
 dict(title="Guy Gavriel Kay: where should I start? - Goodreads SciFi and Fantasy Book Club topic",
      url="https://www.goodreads.com/topic/show/565852-guy-gavriel-kay-where-should-i-start", kind="reader", substantive=True, date="2011-05", route="browser user agent"),
 dict(title="Under Heaven - Goodreads book page (30 reviews read from __NEXT_DATA__)",
      url="https://www.goodreads.com/book/show/7139892-under-heaven", kind="reader", substantive=True, date="2026-09-06", route="browser user agent; apolloState Review: nodes (third attempt; the first two returned HTTP 202 with zero bytes)"),
 dict(title="Children of Earth and Sky - Goodreads book page (30 reviews read from __NEXT_DATA__)",
      url="https://www.goodreads.com/book/show/25938417-children-of-earth-and-sky", kind="reader", substantive=True, date="2026-09-06", route="browser user agent; apolloState Review: nodes (third attempt)"),
 dict(title="Guy Gavriel Kay - Goodreads Fantasy Book Club topic 111082 (2009)",
      url="https://www.goodreads.com/topic/show/111082-guy-gavriel-kay", kind="reader", substantive=True, date="2009", route="browser user agent"),
 dict(title="Book Club Discussion: Tigana By Guy Gavriel Kay - The Quill to Live (a second book club, with its scores)",
      url="https://thequilltolive.com/2016/03/17/book-club-discussion-tigana-by-guy-gabriel-kay/", kind="reader", substantive=True, date="2016-03-17", route="browser user agent"),
 dict(title="Question regarding Guy Gavriel Kay's books - SFFWorld forum thread",
      url="https://www.sffworld.com/forum/threads/question-regarding-guy-gavriel-kays-books.32913/", kind="reader", substantive=True, date="2011-12-06", route="browser user agent"),
 dict(title="Andrew Liptak, 'Watch J.R.R. Tolkien Lecture ... Just Enough Light' (Tor.com, now reactormag) - carries a transcribed passage of Kay's lecture",
      url="https://reactormag.com/jrr-tolkien-guy-gavriel-kay-lecture-just-enough-light-some-thoughts-on-fantasy-and-literature-watch/", kind="own-words", substantive=True, date="2021-05-13", route="browser user agent"),
 dict(title="Michal, 'Flippant Reviews: Guy Gavriel Kay' - a reader-blogger's book-by-book run through Kay",
      url="https://onelastsketch.wordpress.com/2011/12/12/flippant-reviews-guy-gavriel-kay/", kind="reader", substantive=True, date="2011-12-12", route="browser user agent"),
 dict(title="Alister, 'Tigana by Guy Gavriel Kay' - Fantasy-Faction review",
      url="https://fantasy-faction.com/2013/tigana-by-guy-gavriel-kay", kind="reader", substantive=True, date="2013", route="browser user agent"),
 dict(title="Chris McBean, 'Fantasy as Memory: The Historical Imagination of Guy Gavriel Kay', The Rowanwood Chronicles",
      url="https://therowanwoodchronicles.blog/2025/12/24/fantasy-as-memory-the-historical-imagination-of-guy-gavriel-kay/", kind="reader", substantive=True, date="2025-12-24", route="browser user agent"),
 dict(title="Written on the Dark (2025) - Goodreads book page (30 reviews read from __NEXT_DATA__; the newest cohort of Kay readers)",
      url="https://www.goodreads.com/book/show/218153843-written-on-the-dark", kind="reader", substantive=True, date="2026-09-06", route="browser user agent; apolloState Review: nodes"),
 dict(title="Litopia Colony forum thread on the 2021 Tolkien Lecture",
      url="https://colony.litopia.com/threads/guy-gavriel-kay-just-enough-light-some-thoughts-on-fantasy-and-literature.12296/", kind="reader", substantive=False, date="2023-02-26", route="browser user agent; two posts only"),
 dict(title="REVIEW: All The Seas of The World by Guy Gavriel Kay - Grimdark Magazine",
      url="https://www.grimdarkmagazine.com/review-all-the-seas-of-the-world-by-guy-gavriel-kay/", kind="reception", substantive=True, date="2022", route="browser user agent"),
 dict(title="superstardrifter, 'Review: All the Seas of the World by Guy Gavriel Kay'",
      url="https://superstardrifter.com/2022/05/09/review-all-the-seas-of-the-world-by-guy-gavriel-kay/", kind="reader", substantive=True, date="2022-05-09", route="browser user agent"),
 dict(title="Brok3n Engines, 'Tigana, by Guy Gavriel Kay - GGK in transition' (Substack review)",
      url="https://b3en.substack.com/p/ggk-in-transition", kind="reader", substantive=True, date="2025-04-16", route="browser user agent"),
 dict(title="r/Fantasy, 'Tigana - A Review' (u/aroseandawritingdesk) with comment thread",
      url="https://www.reddit.com/r/Fantasy/comments/1goa369/tigana_a_review/", kind="reader", substantive=True, date="2024-11", route="Wayback raw capture 20241207151907id_"),
 dict(title="r/Fantasy, '[Review] Tigana: A Misguided Masterpiece?' (u/joshua-bush)",
      url="https://www.reddit.com/r/Fantasy/comments/fkdpfg/review_tigana_a_misguided_masterpiece/", kind="reader", substantive=True, date="2020-03", route="Wayback raw capture 20230608133320id_"),
 dict(title="r/Fantasy, 'Tigana by GGK - should I keep going?' (u/fincoherent)",
      url="https://www.reddit.com/r/Fantasy/comments/7p5ro9/tigana_by_ggk_should_i_keep_going/", kind="reader", substantive=True, date="2018-01", route="Wayback raw capture 20230607111129id_"),
 dict(title="r/Fantasy, 'Some thoughts about Tigana (heavy spoilers)' (u/contrasupra)",
      url="https://www.reddit.com/r/Fantasy/comments/15u1pk0/some_thoughts_about_tigana_heavy_spoilers/", kind="reader", substantive=True, date="2023-08", route="Wayback raw capture 20230910041956id_ of a comment permalink"),
 dict(title="r/Fantasy, 'Tigana.. Why do people like this book?' (u/_____michel_____) with comment thread",
      url="https://www.reddit.com/r/Fantasy/comments/ve636z/tigana_why_do_people_like_this_book/", kind="reader", substantive=True, date="2022-06", route="Wayback web/2024id_ nearest capture"),
 dict(title="r/Fantasy, 'Tigana (review/rant)' (u/god935) with comment thread",
      url="https://www.reddit.com/r/Fantasy/comments/tizob2/tigana_reviewrant/", kind="reader", substantive=True, date="2022-03", route="Wayback web/2024id_ nearest capture"),
 dict(title="r/Fantasy, 'Is Tigana a good representation of Guy Gavriel Kay?' with comment thread",
      url="https://www.reddit.com/r/Fantasy/comments/1bep250/is_tigana_a_good_representation_of_guy_gavriel_kay/", kind="reader", substantive=True, date="2024-03", route="Wayback web/2024id_ nearest capture"),
 dict(title="r/Fantasy, 'Just finished Tigana; I'm disappointed' (u/sybar142857) with comment thread",
      url="https://www.reddit.com/r/Fantasy/comments/15kr5yn/just_finished_tigana_im_disappointed/", kind="reader", substantive=True, date="2023-08", route="Wayback web/2024id_ nearest capture"),
 dict(title="r/Fantasy, 'Tigana by Guy Gavriel Kay - a brief review' with comment thread",
      url="https://www.reddit.com/r/Fantasy/comments/15i9i3y/tigana_by_guy_gavriel_kay_a_brief_review_spoiler/", kind="reader", substantive=True, date="2023-08", route="Wayback web/2024id_ nearest capture"),
]

COVERAGE=("PROVISIONAL - see the final write.")

def write(complete=False, coverage=COVERAGE):
    json.dump(dict(complete=complete, coverage=coverage, sourcesRead=SOURCES, claims=CLAIMS),
              open(OUT,'w'), indent=1, ensure_ascii=False)
    print('wrote', OUT, 'claims', len(CLAIMS), 'sources', len(SOURCES))

if __name__=='__main__':
    write(len(sys.argv)>1 and sys.argv[1]=='final', sys.argv[2] if len(sys.argv)>2 else COVERAGE)
