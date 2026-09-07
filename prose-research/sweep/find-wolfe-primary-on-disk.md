# FIND: Wolfe - angle "primary already fetched, never claimed" (+ the named off-disk roster)
Opus finder, 2026-09-06. Method: OPUS-FINDER-METHOD.md. Output: found-wolfe-primary-on-disk.json (152 claims, 18 sources).

## Path correction
The brief's paths `prose-research/wolfe-raw/...` and `prose-research/wolfe/...` do not exist.
The files live one level down: `prose-research/sweep/wolfe-raw/...`, `prose-research/sweep/wolfe/...`.
The three Ultan's Library essays live in `prose-research/sweep/wolfe-close-raw/ultan-{greek,catherine,lions}.txt`.
New raw text saved this round: `prose-research/sweep/wolfe-primary-raw/`.

## Roster status
FETCHED + CLAIMED (13 on disk, all read raw end to end)
 - wolfe-raw/gw-culture-2007.txt   "Nor the Summers as Golden" (2007)            12 claims
 - wolfe-raw/gw-wolfe-1987.txt     "Elfland" (1987), noisy OCR of the PDF         5 claims
 - wolfe-raw/gw-chat-2015.txt      live chat Q&A                                  6 claims
 - wolfe/davoortwilbo.txt          Wilbanks / Hellnotes 2005                       5 claims
 - wolfe/middletown-aramini.txt    Aramini, SFBC 2020                             13 claims
 - wolfe-raw/nyrsf-ksr.txt         Kim Stanley Robinson, "A Story" 2013           19 claims
 - wolfe-raw/larb-haunted-library  Joan Gordon, LARB 2016                          8 claims
 - wolfe-raw/blackgate-severian    Vredenburgh 2018 + two reader comments          7 claims
 - wolfe/guardian-gaiman.txt       Gaiman, "My hero" 2011                          2 claims
 - wolfe/lorehaven.txt             Mikalatos 2013 + comment thread                 5 claims
 - wolfe-close-raw/ultan-lions     Andre-Driussi 2003                              5 claims
 - wolfe-close-raw/ultan-catherine Andre-Driussi 1992/2008                          8 claims
 - wolfe-close-raw/ultan-greek     Crampton c.1988/2000                            14 claims
FETCHED + CLAIMED (off disk)
 - wolfe-raw/gw-locus-2002.txt     Locus 500, Sept 2002, Gaiman interviews Wolfe  13 claims  (was already on disk)
 - Thrust 19 (Winter/Spring 1983)  Frazier, "The Legerdemain of the Wolfe"        25 claims  (Internet Archive)
 - Locus 2011 "Engineering the Future" excerpts                                    5 claims  (browser UA)
BLOCKED
 - Castle of Days: IA item castleofdays00wolf is lending-restricted; _djvu.txt returns an empty <pre>;
   Open Library search-inside gives two ~15-word snippets only. No claim written from a snippet.
   Wolfe's Castle of the Otter material (incl. the "Feast of Saint Catherine" outline) is claimed instead
   from the block quotations inside Andre-Driussi and Black Gate, at confidence medium.
NOT FOUND
 - "What I Know About Writing". WebSearch budget for this session was already exhausted (200/200).
   Tried: Swanwick's blog search (4 matching posts, none mentions Wolfe), Ultan's site search,
   DuckDuckGo html + lite (bot-check 202), Mojeek, Marginalia. Carry to the next round.

## Two dating corrections the synthesis should carry
 1. `gw-chat-2015.txt` is named 2015 by Gwern's filename but the transcript's own log line reads
    `Since: (10:51AM @ 11/02/96)`, Wolfe is "working on the Book of the Short Sun", he says his last
    teaching was "probably since 1990" and he was "in Australia in 1985". It is a 1996 chat. Dated 1996 in every claim.
 2. Thrust 19 was NOT on fanac.org - every fanac.org/fanzines/Thrust* path 404s. The full issue is at
    archive.org/details/thrust19winspr1983 and its _djvu.txt was read whole.

## Where the value is (for the chair)
 - The single richest find is Thrust 19 (1983). Wolfe states THE DEVICE outright - "leave clues in the
   story that make an explanation unnecessary" - and, asked whether his archaic terms were invented,
   answers "None." He also answers a request to describe Severian with a flat physical inventory
   (6'1", 175 pounds, boots, trousers, cloak, no shirt): a dossier register in Wolfe's own hand.
 - Locus 2002 carries Gaiman on why he and Wolfe chose the tourist-guidebook form: "the incredibly dry
   tone", a style you "take" and "insert your own contents" into, with an appendix listing the questions
   the book does not answer. That is the closest thing in the whole Wolfe corpus to this program's dossier.
 - Robinson (2013) supplies the pacing case against uniform rhythm ("written entirely at the same pace,
   either plodding or frenetic"; "as on music after a metronome") and the exact formula for omission:
   "the not-telling is accompanied by the telling."
 - A genuine disagreement worth keeping: Robinson says Wolfe's stories are "not allegories but events in
   themselves"; Aramini says "Wolfe is always writing allegorically". Both are recorded with polarity.
 - Counter-evidence is recorded, not suppressed: a Lorehaven commenter reports the device failing
   ("the surface level of the text is not satisfying"), Aramini faults the late work for "too much
   emphasis on subtext", Gordon regrets the loss of "the elegant and baroque style", and Gunn (relayed)
   calls the early fiction "usually difficult, often ambiguous, sometimes obscure".

## Pre-verification
Every one of the 152 quotations was machine-checked with `qcheck.py` against the exact text fetched,
after normalising whitespace and curly quotation marks; all are 12 words or fewer. Zero misses.
Quotes were deliberately chosen to avoid OCR hyphenation breaks in the 1987, 2002 and 1983 scans.
