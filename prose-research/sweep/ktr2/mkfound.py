# -*- coding: utf-8 -*-
import json, os, re, sys, io

OUT="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-kay-transcripts-and-readers.json"
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
  "whilst I enjoy GGK's prose, it's not a favourite of mine","reviews list",'reader','disputes','2026-01-09',GRR,'none','high')

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
      url="https://www.goodreads.com/topic/show/565852-guy-gavriel-kay-where-should-i-start", kind="reader", substantive=False, date="2012", route="browser user agent"),
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
