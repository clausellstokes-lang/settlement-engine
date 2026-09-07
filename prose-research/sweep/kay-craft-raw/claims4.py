# -*- coding: utf-8 -*-
import sys, json, os
sys.path.insert(0, "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/kay-craft-raw")
from build import check, D

FW = "https://fantasy-faction.com/2011/the-world-of-guy-gavriel-kay"
FL = "https://fantasy-faction.com/2017/the-lions-of-al-rassan-by-guy-gavriel-kay"
FU = "https://fantasy-faction.com/2018/under-heaven-by-guy-gavriel-kay"
QS = "https://thequilltolive.com/2025/05/28/sailing-to-sarantium-sheer-perfection/"

S_FWI = "Ashley Barnard (interviewer), 'The World of Guy Gavriel Kay', Fantasy-Faction, 2011"
S_FWK = "Guy Gavriel Kay, interviewed by Ashley Barnard, 'The World of Guy Gavriel Kay', Fantasy-Faction, 2011"
S_FL = "T. L. Greylock (novelist), review of The Lions of Al-Rassan, Fantasy-Faction, 2017"
S_FU = "'Pippa', review of Under Heaven, Fantasy-Faction, 2018"
S_QS = "Cole Rush, 'Sailing To Sarantium - Sheer Perfection', The Quill to Live, 2025"

C = []
def add(**kw): C.append(kw)

add(_file="ff-world", feature="plainness and economy", claim="Barnard says Kay's writing is lyrical without being flowery.", source=S_FWI, url=FW, quote="His writing is lyrical without being flowery", page="editorial introduction", kind="analysis", polarity="asserts", date="2011-03-16", routeHint="direct curl; found via the site's own ?s= search", registerHint="none", confidence="high")
add(_file="ff-world", feature="cadence and rhythm", claim="Barnard says she often paused while reading Under Heaven to savour a beautifully crafted sentence or vivid metaphor.", source=S_FWI, url=FW, quote="savor a beautifully crafted sentence or vivid metaphor", page="editorial introduction", kind="analysis", polarity="asserts", date="2011-03-16", routeHint="direct curl; found via the site's own ?s= search", registerHint="none", confidence="high")
add(_file="ff-world", feature="place and institution description", claim="Asked what he begins a novel with, Kay answers in four one-word sentences that put setting first.", source=S_FWK, url=FW, quote="Setting. Themes. Characters. Plot.", page="answer to 'When you are ready to begin a new novel'", kind="own-words", polarity="asserts", date="2011-03-16", routeHint="direct curl; found via the site's own ?s= search", registerHint="dossier-archivist", confidence="high")
add(_file="ff-world", feature="translation and register", claim="Kay says phrasing changes are sometimes made in translated editions without the author being aware of them.", source=S_FWK, url=FW, quote="Sometimes text changes get made without the author aware of them", page="answer about translations", kind="own-words", polarity="asserts", date="2011-03-16", routeHint="direct curl; found via the site's own ?s= search", registerHint="none", confidence="high")
add(_file="ff-world", feature="civic record register", claim="Kay says he is often asked to write a Preface or Afterword for a foreign edition and enjoys doing it.", source=S_FWK, url=FW, quote="I’m often asked to write a Preface or Afterword", page="answer about translations", kind="own-words", polarity="asserts", date="2011-03-16", routeHint="direct curl; found via the site's own ?s= search", registerHint="dm-page", confidence="high")
add(_file="ff-world", feature="plainness and economy", claim="Barnard says Kay's words even in hurried emails were concise, witty and delightfully sparring.", source=S_FWI, url=FW, quote="his words were concise, witty and delightfully sparring", page="editorial introduction to the interview", kind="analysis", polarity="asserts", date="2011-03-16", routeHint="direct curl; found via the site's own ?s= search", registerHint="none", confidence="high")

add(_file="ff-lions", feature="plainness and economy", claim="Greylock says readers who dislike Kay invoke the label 'wordy' against him.", source=S_FL, url=FL, quote="they invoke the dreaded “wordy” label", page="body, first paragraph", kind="reception", polarity="mentions", date="2017-04-26", routeHint="direct curl; found via the site's own ?s= search", registerHint="none", confidence="high")
add(_file="ff-lions", feature="diction (native vs latinate)", claim="Greylock says a book consistent in its word-richness and in how those words develop the story can be beautiful, and that Lions is.", source=S_FL, url=FL, quote="consistent in its word-richness and how those words are used", page="body, numbered list item 1, 'The language'", kind="reception", polarity="asserts", date="2017-04-26", routeHint="direct curl; found via the site's own ?s= search", registerHint="none", confidence="high")

add(_file="ff-uh", feature="plainness and economy", claim="A reviewer says every word in Under Heaven is well placed.", source=S_FU, url=FU, quote="Every word is well placed", page="body, first review paragraph", kind="reader", polarity="asserts", date="2018-05-01", routeHint="direct curl; found via the site's own ?s= search", registerHint="none", confidence="high")
add(_file="ff-uh", feature="point of view and distance", claim="The same reviewer says the flow of Under Heaven is never disrupted by a switch of perspectives.", source=S_FU, url=FU, quote="the flow is never disrupted by a switch of perspectives", page="body, paragraph on the cast", kind="reader", polarity="asserts", date="2018-05-01", routeHint="direct curl; found via the site's own ?s= search", registerHint="none", confidence="high")

add(_file="qtl-sarantium", feature="dialogue register", claim="Rush says each sentence of Sailing to Sarantium is iced with possibility, leaving characters to separate truth from veiled lies.", source=S_QS, url=QS, quote="Each sentence is iced with possibility", page="body, paragraph beginning 'By packing so many adept characters'", kind="reception", polarity="asserts", date="2025-05-28", routeHint="direct curl; found via the site's own ?s= search", registerHint="none", confidence="high")
add(_file="qtl-sarantium", feature="withheld information and inference", claim="Rush says Kay creates an environment where every word contains hidden meaning.", source=S_QS, url=QS, quote="every word contains hidden meaning", page="body, paragraph beginning 'By packing so many adept characters'", kind="reception", polarity="asserts", date="2025-05-28", routeHint="direct curl; found via the site's own ?s= search", registerHint="none", confidence="high")

bad = check(C)
print("MISMATCHES:", len(bad))
for b in bad: print("   ", b)
json.dump(C, open(os.path.join(D, "kay-craft-raw", "claims4.json"), "w"), ensure_ascii=False, indent=1)
print("claims4:", len(C))
