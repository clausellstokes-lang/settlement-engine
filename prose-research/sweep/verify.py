import json,sys,unicodedata
def load(n): return open(f"raw/{n}.txt",encoding='utf-8').read()
def check(name,qs):
    t=load(name)
    for q in qs:
        print(("OK  " if q in t else "MISS"), name, "|", q)
check('winterson',["I think of AI as alternative intelligence","its understanding of its lack of understanding","That, perhaps, is my grief: not that I feel loss","AI reads us. Now it’s time for us to read AI"])
check('jtimes',["about 5% of the whole text is written directly from","Hundreds of comments poured in on social media platform X"])
check('lawrence-results',["After a minimum 370 votes 3 of the 8 cases","The 2nd and 3rd highest rated pieces were AI-written","I asked for 19th century language, clearly unpopular choice!","the AI pieces all introduced the dragon in the opening statement","enticed by the AI's simplistic nonsense prose","enticed by the AI’s simplistic nonsense prose","The people voting on this included MANY writers"])
check('lawrence-setup',["8 pieces of flash fiction, all of them ~350 words","written by ChatGPT 4"])
check('ghosts-wb',["Candor, apparently, begat candor","I authored the sentences in bold and GPT-3 filled in the rest","adding paragraph breaks in some instances and shortening the length","I had never read such an accurate Modern Love in my life","inconsistencies and untruths appear"])
check('muse',["The first AI model made for fiction","Basic AI spews clichés","Basic AI loves happy endings","Varied Sentence Length","too much exposition! way too telly","flowery language, nothing is happening","Muse writes unique prose every single time","avoids the pitfalls of other models"])
check('friedman',["it was like reading ChatGPT responses I had generated myself","Please provide us with any trademark registration numbers that relate"])
check('ag90',["23 percent of writers reported using generative AI as part","Only around 7 percent of writers who employ generative AI","89 percent reported that less than 10 percent of their","91 percent of authors surveyed believe readers should know when"])
check('clarke',["the number of spam submissions resulting in bans has hit 38%","There are some very obvious patterns and I have no","they are prone to false negatives and positives"])
check('npr',["we had received 700 legitimate submissions and 500 machine-written ones"])
check('techscape',["break the systems out of their default register","half a percent of all articles on research site PubMed","all appear far more frequently in the system’s output","is much more frequently used in business English than it","If AI-ese sounds like African English, then African English sounds like AI-ese","A tendency to offer both sides of an argument in","The fawning obsequiousness of a wild language model hammered into","ineffably generated"])
check('enworld',["of AI-generated writing will not be allowed","trust in the goodwill of our partners to offer customers"])
check('dtrpg-wb',["Artwork was made by an artist practicing their craft, without"])
