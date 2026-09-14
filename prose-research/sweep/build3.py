import json, os, sys
os.chdir('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/prose-research/sweep')
sys.path.insert(0,'.')
from exact import exact

SOURCES=[]; CLAIMS=[]; MISS=[]
def S(**k): SOURCES.append(k)
def C(file=None, quote="", **k):
    if quote:
        e=exact(file,quote)
        if e is None:
            MISS.append((file,quote)); quote=""
        else: quote=e
    k['quote']=quote
    CLAIMS.append(k)

# ============ 1. Fafnir review of Young ============
U="https://journal.finfar.org/articles/book-review-george-r-r-martin-and-the-fantasy-form/"
R="curl with browser user agent (live page)"
S(title="C. Palmer-Patel, 'Book Review: George R. R. Martin and the Fantasy Form', Fafnir 9.1: 117-121", url=U, kind="analysis", substantive=True, date="2022", route=R)
C(file="fafnir.txt", feature="concrete sensory noun",
  claim="Palmer-Patel reports that Young finds Martin repeatedly making authorial choices that direct the reader to take note of filth and other low mimetic markers.",
  source="C. Palmer-Patel, book review, Fafnir - Nordic Journal of Science Fiction and Fantasy Research 9.1 (2022), reporting Joseph Rex Young",
  url=U, quote="makes authorial choices that direct the reader to take note of", page="review body, on Chapter 1",
  kind="analysis", polarity="asserts", date="2022", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="fafnir.txt", feature="point of view and distance",
  claim="Palmer-Patel reports that Young classifies A Song of Ice and Fire mostly as immersive fantasy, a structure whose world is focalised by characters already familiar with it.",
  source="C. Palmer-Patel, book review, Fafnir 9.1 (2022), reporting Joseph Rex Young",
  url=U, quote="focalised by characters already familiar with it", page="review body, on Chapter 3 (citing Young p.74)",
  kind="analysis", polarity="applies", date="2022", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="fafnir.txt", feature="other: genre convention use vs subversion",
  claim="Palmer-Patel quotes Young's thesis that Martin is using his genre's conventions particularly well rather than abandoning them.",
  source="Joseph Rex Young, quoted at p.5 in C. Palmer-Patel's review, Fafnir 9.1 (2022)",
  url=U, quote="is actually using them particularly well", page="review body, quoting Young p.5",
  kind="analysis", polarity="asserts", date="2022", routeHint=R, registerHint="none", confidence="high")

# ============ 2. JTR review ============
U="https://scholar.valpo.edu/journaloftolkienresearch/vol18/iss1/7/"
R="live PDF 403; Wayback raw capture web.archive.org/web/20250602181043id_/ the viewcontent.cgi PDF; pypdf text extract"
S(title="Andrew Higgins, review of Young (2019) and Honegger (2023), Journal of Tolkien Research 18.1 art.7", url=U, kind="analysis", substantive=True, date="2023", route=R)
C(file="jtr.txt", feature="register modulation",
  claim="Higgins reports that Young finds Martin using a low mimetic register in both his characters and his descriptions.",
  source="Andrew Higgins, review, Journal of Tolkien Research 18.1 (2023), reporting Joseph Rex Young",
  url=U, quote="register in both his characters and descriptions", page="PDF p.3, on Young's Chapter 1",
  kind="analysis", polarity="asserts", date="2023", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="jtr.txt", feature="place and institution description",
  claim="Higgins observes in his own voice that Tolkien never gives details of what the refuse situation must have been like in a besieged Gondor.",
  source="Andrew Higgins, review, Journal of Tolkien Research 18.1 (2023)",
  url=U, quote="the refuse situation must have been like in a besieged Gondor", page="PDF p.3",
  kind="analysis", polarity="asserts", date="2023", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="jtr.txt", feature="annalist voice and deep time",
  claim="Higgins quotes Young that Martin's entire written world appears to be a shadow of its former self.",
  source="Joseph Rex Young, quoted at p.69 in Andrew Higgins's review, Journal of Tolkien Research 18.1 (2023)",
  url=U, quote="appears to be a shadow of its former self", page="PDF p.4, quoting Young p.69",
  kind="analysis", polarity="asserts", date="2023", routeHint=R, registerHint="chronicle-line", confidence="high")
C(file="jtr.txt", feature="annalist voice and deep time",
  claim="Higgins quotes Young that Martin's narrative is shot through with references to and insinuations of a cleaner, nobler past.",
  source="Joseph Rex Young, quoted at p.67 in Andrew Higgins's review, Journal of Tolkien Research 18.1 (2023)",
  url=U, quote="references to and insinuations of a cleaner, nobler past", page="PDF p.4, quoting Young p.67",
  kind="analysis", polarity="asserts", date="2023", routeHint=R, registerHint="chronicle-line", confidence="high")
C(file="jtr.txt", feature="omission as information",
  claim="Higgins reports that Honegger applies Hemingway's literary iceberg to Martin, the idea that stories are strengthened by leaving things or events out.",
  source="Andrew Higgins, review, Journal of Tolkien Research 18.1 (2023), reporting Thomas Honegger",
  url=U, quote="stories are strengthened by leaving things or events out", page="PDF p.5",
  kind="analysis", polarity="applies", date="2023", routeHint=R, registerHint="dossier-archivist",
  confidence="medium — Honegger's argument reported at one remove by the reviewer")
C(file="jtr.txt", feature="other: worldbuilding order",
  claim="Higgins reports Honegger's finding that Martin invented his world from the top down, with the backstories invented after the main narratives.",
  source="Andrew Higgins, review, Journal of Tolkien Research 18.1 (2023), reporting Thomas Honegger",
  url=U, quote="with the backstories being invented after the main narratives", page="PDF p.5",
  kind="analysis", polarity="asserts", date="2023", routeHint=R, registerHint="chronicle-line",
  confidence="medium — Honegger's argument reported at one remove by the reviewer")
C(file="jtr.txt", feature="annalist voice and deep time",
  claim="Higgins reports Honegger's argument that Martin's in-narrative poems create the sense of an older transmitted oral tradition.",
  source="Andrew Higgins, review, Journal of Tolkien Research 18.1 (2023), reporting Thomas Honegger",
  url=U, quote="the sense of an older transmitted oral tradition", page="PDF p.5, on three poems",
  kind="analysis", polarity="asserts", date="2023", routeHint=R, registerHint="herald-pools",
  confidence="medium — Honegger's argument reported at one remove by the reviewer")
C(file="jtr.txt", feature="diction (native vs latinate)",
  claim="Higgins reproduces Martin's own statement, cited by Honegger, that he does not have a gift for languages.",
  source="George R. R. Martin, interview quoted by Honegger at p.159, reproduced in Higgins's review, Journal of Tolkien Research 18.1 (2023)",
  url=U, quote="have a gift for languages", page="PDF p.6, quoting Honegger p.159",
  kind="relay", polarity="asserts", date="2023", routeHint=R, registerHint="none",
  confidence="medium — Martin's words at two removes; the original interview is not dated on this page")
C(file="jtr.txt", feature="naming and forms of address",
  claim="Higgins reports Honegger's finding that Martin's language invention amounts to a handful of invented words for the Dothraki.",
  source="Andrew Higgins, review, Journal of Tolkien Research 18.1 (2023), reporting Thomas Honegger",
  url=U, quote="a handful of invented words for the Dothraki", page="PDF p.6",
  kind="analysis", polarity="asserts", date="2023", routeHint=R, registerHint="none",
  confidence="medium — Honegger's argument reported at one remove by the reviewer")

# ============ 3. Math Horizons ============
U="https://digitaleditions.walsworthprintgroup.com/article/Network+Of+Thrones/2426397/294160/article.html"
R="tandfonline abs 403 and no Wayback capture; full text via the Math Horizons digital edition (Walsworth), curl with browser user agent"
S(title="Andrew Beveridge and Jie Shan, 'Network of Thrones', Math Horizons 23.4 (April 2016) 18-22", url=U, kind="measurement", substantive=True, date="2016-04", route=R)
C(file="mh_de.txt", feature="stylometry",
  claim="Beveridge and Shan built their A Storm of Swords character network on 107 vertices representing characters.",
  source="Andrew Beveridge and Jie Shan, 'Network of Thrones', Math Horizons 23.4 (2016)",
  url=U, quote="The 107 vertices represent the characters", page="section 'The Social Network'",
  kind="measurement", polarity="asserts", date="2016-04", routeHint=R, registerHint="none", confidence="high")
C(file="mh_de.txt", feature="naming and forms of address",
  claim="Beveridge and Shan generated edges by incrementing a weight whenever two characters' names or nicknames appeared within 15 words of one another in the ebook.",
  source="Andrew Beveridge and Jie Shan, 'Network of Thrones', Math Horizons 23.4 (2016)",
  url=U, quote="appeared within 15 words of one another", page="section 'The Social Network'",
  kind="measurement", polarity="applies", date="2016-04", routeHint=R, registerHint="none", confidence="high")
C(file="mh_de.txt", feature="other: narrative community structure",
  claim="Beveridge and Shan report that the King's Landing community accounts for 37 percent of their A Storm of Swords network.",
  source="Andrew Beveridge and Jie Shan, 'Network of Thrones', Math Horizons 23.4 (2016)",
  url=U, quote="community accounts for 37 percent of the network", page="section 'Community Detection'",
  kind="measurement", polarity="asserts", date="2016-04", routeHint=R, registerHint="none", confidence="high")
C(file="mh_de.txt", feature="other: narrative community structure",
  claim="Beveridge and Shan report that the network layout and colours identify seven communities in A Storm of Swords.",
  source="Andrew Beveridge and Jie Shan, 'Network of Thrones', Math Horizons 23.4 (2016)",
  url=U, quote="clearly identify seven communities", page="section 'Community Detection'",
  kind="measurement", polarity="asserts", date="2016-04", routeHint=R, registerHint="none", confidence="high")
C(file="mh_de.txt", feature="other: character prominence measurement",
  claim="Beveridge and Shan report that betweenness centrality is the only one of their measures in which Tyrion does not come out on top.",
  source="Andrew Beveridge and Jie Shan, 'Network of Thrones', Math Horizons 23.4 (2016)",
  url=U, quote="the only measure in which Tyrion does not come out on top", page="section 'Centrality Measures'",
  kind="measurement", polarity="asserts", date="2016-04", routeHint=R, registerHint="none", confidence="high")

# ============ 4. PNAS ============
U="https://www.pnas.org/doi/10.1073/pnas.2006465117"
R="pnas.org 403; author PDF from Warwick Research Archive Portal wrap.warwick.ac.uk/144216; pypdf text extract"
S(title="Gessey-Jones et al., 'Narrative structure of A Song of Ice and Fire creates a fictional world with realistic measures of social complexity', PNAS 117.46 (2020)", url=U, kind="measurement", substantive=True, date="2020-11", route=R)
C(file="pnas.txt", feature="stylometry",
  claim="Gessey-Jones and colleagues counted characters across the five books of whom 1,806 interact with another at least once.",
  source="Gessey-Jones et al., PNAS 117.46 (2020)", url=U,
  quote="of which 1,806 interact with another at least once", page="Results, 'Evolution of the Social Network Structure'",
  kind="measurement", polarity="asserts", date="2020-11", routeHint=R, registerHint="none", confidence="high")
C(file="pnas.txt", feature="other: cast size per unit of text",
  claim="Gessey-Jones and colleagues found the number of characters per chapter settles at around 35 after the opening book.",
  source="Gessey-Jones et al., PNAS 117.46 (2020)", url=U,
  quote="the number of characters per chapter settles at around 35", page="Results, 'Evolution of the Social Network Structure'",
  kind="measurement", polarity="asserts", date="2020-11", routeHint=R, registerHint="none", confidence="high")
C(file="pnas.txt", feature="point of view and distance",
  claim="Gessey-Jones and colleagues state that A Song of Ice and Fire is presented from the personal perspectives of 24 point of view characters.",
  source="Gessey-Jones et al., PNAS 117.46 (2020)", url=U,
  quote="presented from the personal perspectives of 24 point of view", page="Results, opening paragraph",
  kind="measurement", polarity="asserts", date="2020-11", routeHint=R, registerHint="none", confidence="high")
C(file="pnas.txt", feature="point of view and distance",
  claim="Gessey-Jones and colleagues measured the 14 major point of view characters as having an average degree of 154.0 within the network of all characters.",
  source="Gessey-Jones et al., PNAS 117.46 (2020)", url=U,
  quote="have an average degree of 154.0 within the network", page="Results, 'Evolution of the Social Network Structure'",
  kind="measurement", polarity="asserts", date="2020-11", routeHint=R, registerHint="none", confidence="high")
C(file="pnas.txt", feature="other: event scheduling and unpredictability",
  claim="Gessey-Jones and colleagues found the distribution of intervals between significant deaths measured in chapters to be geometric rather than power law.",
  source="Gessey-Jones et al., PNAS 117.46 (2020)", url=U,
  quote="geometric rather than power law", page="Abstract",
  kind="measurement", polarity="asserts", date="2020-11", routeHint=R, registerHint="chronicle-line", confidence="high")
C(file="pnas.txt", feature="other: interaction extraction method",
  claim="Gessey-Jones and colleagues counted two characters as interacting if they directly meet or the text makes it explicitly clear they knew one another.",
  source="Gessey-Jones et al., PNAS 117.46 (2020)", url=U,
  quote="if they directly meet each other or it is explicitly", page="Materials and Methods",
  kind="measurement", polarity="applies", date="2020-11", routeHint=R, registerHint="none", confidence="high")

# ============ 5. Fafnir review of Carroll ============
U="https://journal.finfar.org/articles/book-review-medievalism-in-a-song-of-ice-and-fire-and-game-of-thrones/"
R="curl with browser user agent (live page)"
S(title="Don Riggs, 'Book Review: Medievalism in A Song of Ice and Fire and Game of Thrones', Fafnir 6.2: 73-75", url=U, kind="analysis", substantive=True, date="2019", route=R)
C(file="carroll_fafnir.txt", feature="other: authenticity claim",
  claim="Riggs reports that Carroll's main thrust is that Martin uses an argument from authenticity to justify his treatment of women, violence and non-Westerosi characters.",
  source="Don Riggs, book review, Fafnir 6.2 (2019), reporting Shiloh Carroll",
  url=U, quote="Martin uses an argument from", page="review body, opening paragraph",
  kind="analysis", polarity="disputes", date="2019", routeHint=R, registerHint="none", confidence="high")
C(file="carroll_fafnir.txt", feature="withheld information and inference",
  claim="Riggs reports that Carroll sees Martin taking up medieval romance tropes only to subvert them by curtailing the reader's expectation with real-life intrusions.",
  source="Don Riggs, book review, Fafnir 6.2 (2019), reporting Shiloh Carroll",
  url=U, quote="curtailing the reader", page="review body, on the chapter 'Romance and Anti-Romance'",
  kind="analysis", polarity="asserts", date="2019", routeHint=R, registerHint="none", confidence="high")
C(file="carroll_fafnir.txt", feature="place and institution description",
  claim="Riggs quotes Carroll's closing judgement that in reaching for realism Martin created compelling characters, complex plots and subplots, and a masterpiece of worldbuilding.",
  source="Shiloh Carroll, quoted at p.182 in Don Riggs's review, Fafnir 6.2 (2019)",
  url=U, quote="Martin has created compelling characters, complex plots and subplots", page="review body, quoting Carroll p.182",
  kind="analysis", polarity="asserts", date="2019", routeHint=R, registerHint="none", confidence="high")

# ============ 6. Carroll, Public Medievalist ============
U="https://publicmedievalist.com/grimdark-medievalism/"
R="curl with browser user agent (live page)"
S(title="Shiloh Carroll, 'Grimdark Medievalism in A Song of Ice and Fire', The Public Medievalist, 15 May 2018", url=U, kind="analysis", substantive=True, date="2018-05-15", route=R)
C(file="grimdark.txt", feature="register modulation",
  claim="Carroll characterises Martin's way of reimagining the Middle Ages as violent, dark, brutal, and relentlessly masculine.",
  source="Shiloh Carroll, The Public Medievalist (2018)", url=U,
  quote="violent, dark, brutal, and relentlessly masculine", page="section 'Fantasy for People Who Hate Fantasy'",
  kind="analysis", polarity="asserts", date="2018-05-15", routeHint=R, registerHint="none", confidence="high")
C(file="grimdark.txt", feature="concrete sensory noun",
  claim="Carroll argues Martin goes too far in counteracting a rosy vision of the past with one covered in mud.",
  source="Shiloh Carroll, The Public Medievalist (2018)", url=U,
  quote="counteracting a rosy vision of the past with one covered in mud", page="section 'Fantasy for People Who Hate Fantasy'",
  kind="analysis", polarity="disputes", date="2018-05-15", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="grimdark.txt", feature="other: realism justification",
  claim="Carroll quotes Martin's defence that it is fundamentally dishonest to write a war story and leave rape out.",
  source="George R. R. Martin, quoted by Shiloh Carroll, The Public Medievalist (2018)", url=U,
  quote="if you write a war story and you leave that out", page="section 'A Savage Beast in Every Man'",
  kind="own-words", polarity="asserts", date="2018-05-15", routeHint=R, registerHint="none",
  confidence="medium — Martin's words as quoted on this page; the original interview is not identified there")

# ============ 7. Mendlesohn, Rhetorics of Fantasy introduction ============
U="http://fantasyliterature.pbworks.com/w/file/fetch/86904445/farah%20mendlesohn%20-%20rhetorics%20of%20fantasy%20intro.pdf"
R="author-hosted extract of the Introduction, mirrored as PDF on fantasyliterature.pbworks.com; curl with browser user agent, pypdf text extract"
S(title="Farah Mendlesohn, Rhetorics of Fantasy (Wesleyan UP, 2008), Introduction (author's extract)", url=U, kind="analysis", substantive=True, date="2008", route=R)
C(file="mend.txt", feature="place and institution description",
  claim="Mendlesohn writes that the immersive fantasy depends for its effectiveness on an assumption of realism that denies the need for explication.",
  source="Farah Mendlesohn, Rhetorics of Fantasy (2008), Introduction", url=U,
  quote="an assumption of realism that denies the need for explication", page="Introduction, section 'The Immersive Fantasy'",
  kind="analysis", polarity="asserts", date="2008", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="mend.txt", feature="point of view and distance",
  claim="Mendlesohn writes that in immersive fantasy the reader has access to the protagonist's eyes and ears but is not provided with an explanatory narrative.",
  source="Farah Mendlesohn, Rhetorics of Fantasy (2008), Introduction", url=U,
  quote="we are not provided with an explanatory narrative", page="Introduction, section 'The Immersive Fantasy'",
  kind="analysis", polarity="asserts", date="2008", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="mend.txt", feature="other: expository pressure of the chosen rhetoric",
  claim="Mendlesohn writes that the quest fantasy's transitional narrative forces the author to describe and explain what the point of view character sees.",
  source="Farah Mendlesohn, Rhetorics of Fantasy (2008), Introduction", url=U,
  quote="forcing the author to describe and explain what", page="Introduction, on quest and portal fantasy",
  kind="analysis", polarity="asserts", date="2008", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="mend.txt", feature="place and institution description",
  claim="Mendlesohn characterises the portal fantasy's language as the elaboration of the anthropologist, intensely descriptive and exploratory rather than assumptive.",
  source="Farah Mendlesohn, Rhetorics of Fantasy (2008), Introduction", url=U,
  quote="intensely descriptive and exploratory rather than assumptive", page="Introduction, on the portal fantasy",
  kind="analysis", polarity="asserts", date="2008", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="mend.txt", feature="point of view and distance",
  claim="Mendlesohn writes that in portal fantasy the protagonist provides the reader with a guided tour of the landscapes.",
  source="Farah Mendlesohn, Rhetorics of Fantasy (2008), Introduction", url=U,
  quote="provides us with a guided tour of the landscapes", page="Introduction, on the portal fantasy",
  kind="analysis", polarity="asserts", date="2008", routeHint=R, registerHint="dm-page", confidence="high")
C(file="mend.txt", feature="point of view and distance",
  claim="Mendlesohn writes that the point of view character of an immersive fantasy must take for granted the fantastic elements surrounding him or her.",
  source="Farah Mendlesohn, Rhetorics of Fantasy (2008), Introduction", url=U,
  quote="must take for granted the fantastic elements", page="Introduction, section 'The Immersive Fantasy'",
  kind="analysis", polarity="asserts", date="2008", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="mend.txt", feature="plainness and economy",
  claim="Mendlesohn writes that successful immersive fantasy consciously negates the sense of wonder in favour of an atmosphere of ennui.",
  source="Farah Mendlesohn, Rhetorics of Fantasy (2008), Introduction", url=U,
  quote="consciously negates the sense of wonder", page="Introduction, section 'The Immersive Fantasy'",
  kind="analysis", polarity="asserts", date="2008", routeHint=R, registerHint="dossier-archivist", confidence="high")

# ============ 8. Medievally Speaking review of Larrington ============
U="http://medievallyspeaking.blogspot.com/2016/02/larrington-winter-is-coming.html"
R="curl with browser user agent (live page)"
S(title="Stephen Basdeo, review of Carolyne Larrington, Winter is Coming (I.B. Tauris 2016), Medievally Speaking, 17 Feb 2016", url=U, kind="analysis", substantive=True, date="2016-02-17", route=R)
C(file="larrington_rev.txt", feature="place and institution description",
  claim="Basdeo reports that after her introductory chapter Larrington adopts the persona of a travel writer for her region-by-region chapters.",
  source="Stephen Basdeo, review, Medievally Speaking (2016), describing Carolyne Larrington's method", url=U,
  quote="Larrington adopts the persona of a travel writer", page="review body, on the book's structure",
  kind="analysis", polarity="asserts", date="2016-02-17", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="larrington_rev.txt", feature="naming and forms of address",
  claim="Basdeo quotes Larrington that before surnames a patronymic was the only way to distinguish someone from others bearing the same given name.",
  source="Carolyne Larrington, Winter is Coming (2016) pp.14-15, quoted in Stephen Basdeo's review, Medievally Speaking", url=U,
  quote="a patronymic was the only way to distinguish someone from others", page="review body, quoting Larrington pp.14-15",
  kind="analysis", polarity="asserts", date="2016-02-17", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="larrington_rev.txt", feature="place and institution description",
  claim="Basdeo reports Larrington's argument that Ned Stark's dominion over Winterfell resembles that of an Anglo-Saxon earl rather than later medieval kingship.",
  source="Stephen Basdeo, review, Medievally Speaking (2016), reporting Carolyne Larrington p.57", url=U,
  quote="the dominion that an Anglo-Saxon Earl had over his people", page="review body, citing Larrington p.57",
  kind="analysis", polarity="asserts", date="2016-02-17", routeHint=R, registerHint="dossier-archivist", confidence="high")

# ============ 9. Routledge listing (vendor) ============
U="https://www.routledge.com/George-RR-Martin-and-the-Fantasy-Form/Young/p/book/9781032093482"
R="curl with browser user agent (live publisher page)"
S(title="Routledge listing for Joseph Young, George R.R. Martin and the Fantasy Form (2019), with table of contents", url=U, kind="vendor", substantive=False, date="accessed 2026-09-06", route=R)
C(file="routledge.txt", feature="other: monograph structure",
  claim="Routledge's listing gives Young's third chapter the title 'Look with Your Eyes - Immersion and Thinning'.",
  source="Routledge publisher listing for Young, George R.R. Martin and the Fantasy Form", url=U,
  quote="Look with Your Eyes", page="Table of Contents",
  kind="vendor", polarity="mentions", date="accessed 2026-09-06", routeHint=R, registerHint="none", confidence="high")

# ============ 10. Nine Worlds corpus abstract ============
U="https://nineworldsacademia.wordpress.com/2014/08/15/writing-westeros-a-corpus-linguistic-study-of-a-song-of-ice-and-fire/"
R="curl with browser user agent (live page); conference abstract only, no results published on the page"
S(title="Matthew Voice, 'Writing Westeros: a Corpus Linguistic Study of A Song of Ice and Fire' (Nine Worlds 2014, abstract)", url=U, kind="measurement", substantive=False, date="2014-08-15", route=R)
C(file="corpus.txt", feature="stylometry",
  claim="Voice's conference abstract states that the first four books of A Song of Ice and Fire were rendered searchable in their entirety for corpus analysis.",
  source="Matthew Voice, University of Sheffield, Nine Worlds 2014 conference abstract", url=U,
  quote="the first four books of ASOIAF are rendered searchable in their entirety", page="abstract, second paragraph",
  kind="measurement", polarity="applies", date="2014-08-15", routeHint=R, registerHint="none",
  confidence="low — abstract only; the page reports no findings, only the method proposed")

# ============ 11. BookPage interview ============
U="https://www.bookpage.com/interviews/17465-george-r-r-martin-fiction/"
R="curl with browser user agent (live page)"
S(title="Cat Acree, 'George R.R. Martin: History is written in blood', BookPage, December 2014", url=U, kind="own-words", substantive=True, date="2014-12", route=R)
C(file="bookpage.txt", feature="civic record register",
  claim="Acree writes that Maester Yandel, the narrator of The World of Ice and Fire, has presented a history that is undeniably distorted.",
  source="Cat Acree, BookPage interview feature, December 2014", url=U,
  quote="has presented a history that is undeniably distorted", page="feature body",
  kind="analysis", polarity="asserts", date="2014-12", routeHint=R, registerHint="chronicle-line", confidence="high")
C(file="bookpage.txt", feature="annalist voice and deep time",
  claim="Acree writes that where Tolkien was concerned with myth and languages, Martin is fascinated by history and the challenges of retelling it.",
  source="Cat Acree, BookPage interview feature, December 2014", url=U,
  quote="Martin is fascinated by history", page="feature body",
  kind="analysis", polarity="asserts", date="2014-12", routeHint=R, registerHint="chronicle-line", confidence="high")
C(file="bookpage.txt", feature="other: compilation method",
  claim="Acree reports that García and Antonsson pored over 10,000 pages of novels, pulling out all references to history, myths and legends, before Martin filled in the blanks.",
  source="Cat Acree, BookPage interview feature, December 2014", url=U,
  quote="pored over 10,000 pages of novels, pulling out all references to history", page="feature body",
  kind="analysis", polarity="asserts", date="2014-12", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="bookpage.txt", feature="withheld information and inference",
  claim="Martin told BookPage that he did not want to get too close to the so-called present day of Westeros in the companion history.",
  source="George R. R. Martin, interviewed by Cat Acree, BookPage, December 2014", url=U,
  quote="too close to the so-called present day of Westeros", page="feature body",
  kind="own-words", polarity="asserts", date="2014-12", routeHint=R, registerHint="chronicle-line", confidence="high")

# ============ 12. Slate / Vulture interview ============
U="https://slate.com/culture/2014/11/the-world-of-ice-and-fire-george-r-r-martin-breaks-down-to-believe-in-game-of-thrones.html"
R="curl with browser user agent (live page); the piece states it originally appeared in Vulture"
S(title="Jennifer Vineyard, 'George R.R. Martin on What Not to Believe in Game of Thrones', Slate (orig. Vulture), 7 Nov 2014", url=U, kind="own-words", substantive=True, date="2014-11-07", route=R)
C(file="slate.txt", feature="civic record register",
  claim="Vineyard reports that The World of Ice and Fire is written from the viewpoint of a maester at the Citadel.",
  source="Jennifer Vineyard, Slate (originally Vulture), 7 November 2014", url=U,
  quote="written from the viewpoint of a maester at the Citadel", page="article body",
  kind="analysis", polarity="asserts", date="2014-11-07", routeHint=R, registerHint="chronicle-line", confidence="high")
C(file="slate.txt", feature="withheld information and inference",
  claim="Vineyard reports that the maester's knowledge in The World of Ice and Fire comes from other scrolls that may themselves be unreliable.",
  source="Jennifer Vineyard, Slate (originally Vulture), 7 November 2014", url=U,
  quote="comes from other scrolls that, in turn, may be unreliable", page="article body",
  kind="analysis", polarity="asserts", date="2014-11-07", routeHint=R, registerHint="chronicle-line", confidence="high")
C(file="slate.txt", feature="withheld information and inference",
  claim="Martin told Vulture that people do know things, but the things they know may not be right.",
  source="George R. R. Martin, interviewed by Jennifer Vineyard, Vulture / Slate, 7 November 2014", url=U,
  quote="the things they ‘know’ may not be right", page="article body",
  kind="own-words", polarity="asserts", date="2014-11-07", routeHint=R, registerHint="chronicle-line", confidence="high")
C(file="slate.txt", feature="other: volume of pseudo-historical material",
  claim="Martin told Vulture he was supposed to write 50,000 words of text for sidebars and wrote 300,000 instead.",
  source="George R. R. Martin, interviewed by Jennifer Vineyard, Vulture / Slate, 7 November 2014", url=U,
  quote="I was supposed to write 50,000 words of text for sidebars", page="article body",
  kind="own-words", polarity="asserts", date="2014-11-07", routeHint=R, registerHint="chronicle-line", confidence="high")

# ============ 13-20. At Sea Journal craft essays (Erik Germani) ============
def AS(slug, title):
    u=f"https://atseajournal.com/asoiaf/essays/{slug}.html"
    S(title=f"Erik Germani, '{title}', A Study of Ice and Fire, At Sea Journal", url=u, kind="analysis", substantive=True, date="undated (site index references 2015)", route="curl with browser user agent (live page)")
    return u, f"as_{slug}.txt"

U,F=AS("stealth_exposition","Now, As We All Know: Hiding Exposition")
C(file=F, feature="omission as information",
  claim="Germani describes Martin as setting his narrative atop an iceberg of history and using that background to give the text solidity.",
  source="Erik Germani, 'Now, As We All Know', At Sea Journal", url=U,
  quote="setting your narrative atop this iceberg of history", page="essay body",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")
C(file=F, feature="other: prior life of the cast",
  claim="Germani writes that part of why Martin's world feels lived-in is that everyone had a life before page one.",
  source="Erik Germani, 'Now, As We All Know', At Sea Journal", url=U,
  quote="Everyone had a life before page one", page="essay body",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")
C(file=F, feature="withheld information and inference",
  claim="Germani argues Martin sticks to the present because it lets him maintain mysteries.",
  source="Erik Germani, 'Now, As We All Know', At Sea Journal", url=U,
  quote="He sticks to the present because it lets him maintain mysteries", page="essay body",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="chronicle-line", confidence="high")
C(file=F, feature="civic record register",
  claim="Germani observes that facts one would look up in an encyclopedia of Westeros must instead be delivered by the cast, since no such reference exists in the text.",
  source="Erik Germani, 'Now, As We All Know', At Sea Journal", url=U,
  quote="the kind of fact one would look up in the Encyclopedia Westerosica", page="essay body, section 'Appendices'",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")

U,F=AS("psychic_distance","The Unseen Plane Crash: Psychic Distance")
C(file=F, feature="point of view and distance",
  claim="Germani reproduces Martin's statement that he is a strong believer in telling stories through a limited but very tight third person point of view.",
  source="George R. R. Martin, interview for Adria's News, quoted by Erik Germani, At Sea Journal", url=U,
  quote="telling stories through a limited but very tight third person", page="essay epigraph",
  kind="own-words", polarity="asserts", routeHint="curl with browser user agent", registerHint="none",
  confidence="medium — Martin's words reproduced at one remove; the interview is named but not dated on the page")
C(file=F, feature="point of view and distance",
  claim="Germani finds Martin generally hovering right over his point of view characters' shoulders, then stepping back at odd times.",
  source="Erik Germani, 'The Unseen Plane Crash', At Sea Journal", url=U,
  quote="hovering right over his POV’s shoulders", page="essay body",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")
C(file=F, feature="point of view and distance",
  claim="Germani identifies a passage naming Jaime Lannister in full from Tyrion's viewpoint as the author's voice rather than the character's.",
  source="Erik Germani, 'The Unseen Plane Crash', At Sea Journal", url=U,
  quote="that’s Martin talking", page="essay body, on a breakfast scene",
  kind="analysis", polarity="disputes", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")

U,F=AS("epithets","George R.R. Martin, The American Homer")
C(file=F, feature="cadence and rhythm",
  claim="Germani argues Martin keeps readers turning pages with a steady flow of low-density sentences.",
  source="Erik Germani, 'George R.R. Martin, The American Homer', At Sea Journal", url=U,
  quote="Martin keeps us turning pages with a steady flow of low-density sentences", page="essay body",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="chronicle-line", confidence="high")
C(file=F, feature="repetition and refrain",
  claim="Germani compared authors in his corpus for comparisons of the colour black and found Martin the runaway consumer of the construction.",
  source="Erik Germani, 'George R.R. Martin, The American Homer', At Sea Journal", url=U,
  quote="Martin was the runaway consumer of the construction", page="essay body, on 'black as night'",
  kind="measurement", polarity="asserts", routeHint="curl with browser user agent", registerHint="herald-pools",
  confidence="medium — the corpus and its size are not specified on the page")
C(file=F, feature="plainness and economy",
  claim="Germani writes that except in cases of emotional shock a reader never has to read a sentence of A Game of Thrones twice.",
  source="Erik Germani, 'George R.R. Martin, The American Homer', At Sea Journal", url=U,
  quote="you never have to read an AGOT sentence twice", page="essay body",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="chronicle-line", confidence="high")
C(file=F, feature="dialogue register",
  claim="Germani states that the prose constituting the other 60% of the text, beside dialogue, is forgettable.",
  source="Erik Germani, 'George R.R. Martin, The American Homer', At Sea Journal", url=U,
  quote="the prose that constitutes the other 60% of the text is forgettable", page="essay body",
  kind="analysis", polarity="disputes", routeHint="curl with browser user agent", registerHint="none",
  confidence="medium — the 60% figure is asserted on the page without a stated measurement method")

U,F=AS("linguistic_anachronism","Linguistic Anachronism")
C(file=F, feature="archaism",
  claim="Germani writes that most fantasists settle for a few linguistic relics to give a historical veneer, and names 'must needs', 'soon or late' and 'near as' among Martin's.",
  source="Erik Germani, 'Linguistic Anachronism', At Sea Journal", url=U,
  quote="a few linguistic relics to give a historical veneer", page="essay body",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")
C(file=F, feature="diction (native vs latinate)",
  claim="Germani argues that what a fantasy writer needs to build is cultures rather than worlds, and that a culture is before anything else a language and a voice.",
  source="Erik Germani, 'Linguistic Anachronism', At Sea Journal", url=U,
  quote="What we need to do is build cultures, not worlds", page="essay body",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")
C(file=F, feature="concrete sensory noun",
  claim="Germani argues that it matters what kind of trees a fantasy writer names and what sort of animals.",
  source="Erik Germani, 'Linguistic Anachronism', At Sea Journal", url=U,
  quote="It matters what kind of trees you name, what sort of animals", page="essay body",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")

U,F=AS("punctuation","Punctuation")
C(file=F, feature="other: punctuation practice",
  claim="Germani finds that in A Game of Thrones Martin uses semicolons and colons interchangeably.",
  source="Erik Germani, 'Punctuation', At Sea Journal", url=U,
  quote="Martin uses semicolons and colons interchangeably", page="essay body, opening",
  kind="analysis", polarity="disputes", routeHint="curl with browser user agent", registerHint="none", confidence="high")
C(file=F, feature="other: punctuation practice",
  claim="Germani reports finding three instances of a semicolon standing where a colon belongs on a single page of his edition of A Game of Thrones.",
  source="Erik Germani, 'Punctuation', At Sea Journal", url=U,
  quote="there are three examples of this on one page", page="essay body, citing p.239 of his edition",
  kind="measurement", polarity="asserts", routeHint="curl with browser user agent", registerHint="none", confidence="high")

U,F=AS("compressibility","Compressible Paragraphs")
C(file=F, feature="parataxis vs hypotaxis",
  claim="Germani likens Martin's paragraphs to Jenga towers from which several sentences can be removed before they wobble.",
  source="Erik Germani, 'Compressible Paragraphs', At Sea Journal", url=U,
  quote="Martin’s paragraphs are like Jenga towers", page="essay body, opening",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")
C(file=F, feature="opening sentence",
  claim="Germani assembled a readable 427-word passage out of the first sentences of 26 different paragraphs of A Game of Thrones totalling 1,897 words.",
  source="Erik Germani, 'Compressible Paragraphs', At Sea Journal", url=U,
  quote="built from the first sentences of 26 different paragraphs", page="essay body",
  kind="measurement", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")

U,F=AS("imprecision","Imprecise Sentences")
C(file=F, feature="adjective and adverb discipline",
  claim="Germani's verdict is that Martin is imprecise rather than incompetent as a sentence writer.",
  source="Erik Germani, 'Imprecise Sentences', At Sea Journal", url=U,
  quote="Martin is imprecise, not incompetent", page="essay body",
  kind="analysis", polarity="disputes", routeHint="curl with browser user agent", registerHint="none", confidence="high")
C(file=F, feature="cadence and rhythm",
  claim="Germani argues that flow between sentences, rather than great individual sentences, is the litmus test for a successful author, and that Martin passes it.",
  source="Erik Germani, 'Imprecise Sentences', At Sea Journal", url=U,
  quote="Flow between sentences is the litmus test for a successful author", page="essay body",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="chronicle-line", confidence="high")

U,F=AS("purple","Purple Prose in Green and Red")
C(file=F, feature="register modulation",
  claim="Germani observes Martin shifting into antiquated diction in a passage describing the haunted forest.",
  source="Erik Germani, 'Purple Prose in Green and Red', At Sea Journal", url=U,
  quote="Martin shifts into antiquated diction", page="essay body",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")
C(file=F, feature="register modulation",
  claim="Germani argues Martin's writing leaps into a high register when presented with the wordless sensations of nature and violence.",
  source="Erik Germani, 'Purple Prose in Green and Red', At Sea Journal", url=U,
  quote="leap into a high register", page="essay body",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="herald-pools", confidence="high")


# ============ 21. Interconnected Kingdoms (Amalvy et al. 2024) ============
U="https://doi.org/10.1007/s13278-024-01365-z"
R="arXiv preprint PDF arxiv.org/pdf/2410.05453 (green OA of the Social Network Analysis and Mining article); pypdf text extract"
S(title="Amalvy, Janickyj, Mannion, MacCarron, Labatut, 'Interconnected Kingdoms: comparing A Song of Ice and Fire adaptations across media using complex networks', Social Network Analysis and Mining 14 (2024)", url=U, kind="measurement", substantive=True, date="2024", route=R)
C(file="interk.txt", feature="stylometry",
  claim="Amalvy and colleagues count 777 characters in the novels for their U2 period, against 199 in the TV show annotations.",
  source="Amalvy et al., Social Network Analysis and Mining 14 (2024)", url=U,
  quote="there are 777 characters in the novels", page="section 2.5 'Character Sets'",
  kind="measurement", polarity="asserts", date="2024", routeHint=R, registerHint="none", confidence="high")
C(file="interk.txt", feature="naming and forms of address",
  claim="Amalvy and colleagues report that 731, or 94 percent, of the novels' characters in their U2 period are named.",
  source="Amalvy et al., Social Network Analysis and Mining 14 (2024)", url=U,
  quote="named characters in the novels", page="section 2.5 'Character Sets'",
  kind="measurement", polarity="asserts", date="2024", routeHint=R, registerHint="dossier-archivist", confidence="high")
C(file="interk.txt", feature="withheld information and inference",
  claim="Amalvy and colleagues note that their novel interaction data includes memories, because important plot information is frequently revealed through a character thinking of past events.",
  source="Amalvy et al., Social Network Analysis and Mining 14 (2024)", url=U,
  quote="Note that this does include memories", page="section 2.2, on the novels dataset",
  kind="measurement", polarity="asserts", date="2024", routeHint=R, registerHint="chronicle-line", confidence="high")

# ============ 22. Zeugma and Literary DNA ============
U,F=AS("proselike","Zeugma and Literary DNA")
C(file=F, feature="stylometry",
  claim="Germani counts 148,130 sentences in A Song of Ice and Fire.",
  source="Erik Germani, 'Zeugma and Literary DNA', At Sea Journal", url=U,
  quote="148,130 by my count", page="essay body",
  kind="measurement", polarity="asserts", routeHint="curl with browser user agent", registerHint="none",
  confidence="medium — an author's own count with no stated tokenisation method")
C(file=F, feature="parataxis vs hypotaxis",
  claim="Germani found roughly 250 examples in A Song of Ice and Fire of a zeugma structure in which one verb governs two comma-separated clauses.",
  source="Erik Germani, 'Zeugma and Literary DNA', At Sea Journal", url=U,
  quote="I found ~250 examples of it", page="essay body",
  kind="measurement", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist",
  confidence="medium — the search caught sentences whose first word repeated after the first comma, a proxy for the structure")
C(file=F, feature="place and institution description",
  claim="Germani identifies the zeugma structure as one Martin uses for describing sky and weather, with the human body as its most common subject.",
  source="Erik Germani, 'Zeugma and Literary DNA', At Sea Journal", url=U,
  quote="one verb controls multiple phrases", page="essay body, defining zeugma",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")

# ============ 23. Cultural Anachronism ============
U,F=AS("cultural_anachronism","Cultural Anachronism")
C(file=F, feature="dialogue register",
  claim="Germani finds Martin willing to be culturally anachronistic in dialogue, citing a Lannister line lifted from Robert Frost.",
  source="Erik Germani, 'Cultural Anachronism', At Sea Journal", url=U,
  quote="Martin is willing to be anachronistic with his dialogue", page="essay body, opening",
  kind="analysis", polarity="disputes", routeHint="curl with browser user agent", registerHint="none", confidence="high")

# ============ 24. Line Reading ============
U,F=AS("line_reading","Line Reading")
C(file=F, feature="dialogue register",
  claim="Germani reports that one of Theon's chapters in A Dance with Dragons features 33 different speakers.",
  source="Erik Germani, 'Line Reading', At Sea Journal", url=U,
  quote="chapters features 33 different speakers", page="essay body",
  kind="measurement", polarity="asserts", routeHint="curl with browser user agent", registerHint="none", confidence="high")

# ============ 25. Odds and Ends / Block Characterization ============
U,F=AS("snippets","Odds and Ends (including 'Block Characterization')")
C(file=F, feature="other: introduction formula for a person",
  claim="Germani finds that Martin's block characterisations follow a fixed order, hitting age, hair, eyes, clothes, and physique.",
  source="Erik Germani, 'Block Characterization', in 'Odds and Ends', At Sea Journal", url=U,
  quote="He hits on age, hair, eyes, clothes, and physique", page="section 'Block Characterization'",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")
C(file=F, feature="other: introduction formula for a person",
  claim="Germani defines a block characterisation as the block of description a character receives when first coming on stage.",
  source="Erik Germani, 'Block Characterization', in 'Odds and Ends', At Sea Journal", url=U,
  quote="block of description characters receive when they first come on stage", page="section 'Block Characterization'",
  kind="analysis", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")
C(file=F, feature="adjective and adverb discipline",
  claim="Germani judges the insistence on eye colour in Martin's block characterisations conspicuous and of dubious value.",
  source="Erik Germani, 'Block Characterization', in 'Odds and Ends', At Sea Journal", url=U,
  quote="the insistence on eye color is conspicuous, and of dubious value", page="section 'Block Characterization'",
  kind="analysis", polarity="disputes", routeHint="curl with browser user agent", registerHint="dossier-archivist", confidence="high")
C(file=F, feature="adjective and adverb discipline",
  claim="Germani reproduces Martin's 2011 statement to Vulture that he is beginning to wish he had never bothered with the colour of people's eyes.",
  source="George R. R. Martin, 2011 Vulture interview, quoted by Erik Germani, At Sea Journal", url=U,
  quote="wish I had never bothered with the color of people", page="section 'Block Characterization'",
  kind="own-words", polarity="asserts", routeHint="curl with browser user agent", registerHint="dossier-archivist",
  confidence="medium — Martin's words reproduced at one remove; dated 2011 on the page, original not fetched")

COV=("Named roster: Fafnir review of Young FETCHED (live, browser UA); Journal of Tolkien Research review of Young and Honegger FETCHED "
"(live 403, recovered via Wayback id_ raw PDF capture); Young's monograph itself NOT FETCHED in full (Google Books API quota-exceeded, "
"Perlego paywalled) but reached through two full-text reviews plus the publisher's table of contents; Larrington 2016 NOT FETCHED in full "
"(no free full text) but reached through a full scholarly review quoting it at pp.14-15 and p.57; Carroll's Boydell monograph NOT FETCHED in "
"full but reached through a full Fafnir review quoting pp.67, 173 and 182 plus Carroll's own signed article; Mendlesohn, Rhetorics of Fantasy "
"FETCHED at the primary (author's own Introduction extract as PDF); Beveridge and Shan, 'Network of Thrones' FETCHED IN FULL (tandfonline 403 "
"and no Wayback capture; recovered via the Math Horizons digital edition) - the phys.org summary was BLOCKED (403, no capture) and proved "
"unnecessary; the PNAS study FETCHED IN FULL (pnas.org 403, recovered via the Warwick repository PDF); 'Food Fantasies', JFA 24.3 BLOCKED - "
"the full ladder was walked and every route failed (Free Library Cloudflare 403 twice, no Wayback snapshot via the availability API or CDX, "
"archive.ph 429 on three attempts, Gale returned 202 with an empty body, ProQuest 302 to login, the author's academia.edu proofs 403, and the "
"article is indexed in neither OpenAlex nor Crossref). Substantive sources by route: named roster 6; bibliography chasing 2 (Honegger via the "
"JTR review, Gessey-Jones's dataset via Amalvy et al.); 'cited by' 1 (Amalvy et al. 2024, via OpenAlex cites: on the PNAS work); lateral search "
"11 (the maester-register interviews and the At Sea Journal craft essays). 24 sources logged, 21 substantive. WebSearch budget was exhausted at "
"200 calls partway through the lateral phase; later discovery ran on OpenAlex, Crossref and direct fetches.")

out={"complete": True, "coverage": COV, "sourcesRead":SOURCES, "claims":CLAIMS}
json.dump(out, open("found-martin-scholarship.json","w"), indent=1, ensure_ascii=False)
print("sources",len(SOURCES),"claims",len(CLAIMS),"missing quotes",MISS)

