# TIES-3: the second tranche of tie pairs (DEPTH-2's line writer, 2026-11-20)

For the brief `docs/chair/2026-11-20/content/depth/briefs/WRITE-TRANCHE-2.md` (at `cb201e866`), under the writing rules of
`../briefs/WRITE-TIES.md`, word for word. Review lines only: nothing here is in a source file. 77 pairs: mutual_leverage 17,
peer_rivalry 16, old_debt 15, wary_alliance 14, mentor_legacy 10, genuine_respect 5.

R stands for `${r.name}` (the tie's first card), S for `${s.name}`. Each NEW pair is APPENDED after the first tranche's pairs at
one index (desc and tension together, `{ line: (r, s) => \`…\`, colour: true }`; old_debt: debtor first, R owes S). Each
`beside` line quotes one EXISTING pair of the archetype (the line's own eight) at one index, verbatim. One pair is marked
`[trust: full]` (genuine_respect 5); no line states a trust of none, and no mutual_leverage line states full trust. No pair
repeats or re-words a pair of the pool or of TIES-1/TIES-2.

## Step 1: the placement and its measured gain (EXECUTED in DEPTH-2's line writer's container, 2026-11-20)

The tree: a detached worktree at `7fdc73bbb` (src identical to the line `43ab0f5eb`), with DEPTH-1's `measure/probe3.patch` (the
placeholder first tranche) committed detached; the chair's `bill.mjs` and `measures.mjs` (origin/lane/chair-2026-11-08
`docs/chair/2026-11-20/seventh/measures/owner-q3/`) beside DEPTH-1's `measure/born.mjs`. `bill.mjs` on the probe3 tree,
section (D), city, AFTER the first tranche (`measure-2/bill.probe3.out.txt`): share of the city's remaining cross-town repeats
by group, and where the second tranche goes.

| group | share of city repeats after tranche 1 (metropolis) | rows: line + tranche 1 | tranche 2 adds | rows after |
|---|---|---|---|---|
| tie: mutual_leverage | 18.7% (16.7%) | 8 + 14 | **17** | 39 |
| tie: peer_rivalry | 17.5% (19.3%) | 8 + 14 | **16** | 38 |
| tie: old_debt | 16.4% (19.8%) | 8 + 14 | **15** | 37 |
| tie: wary_alliance | 15.9% (12.4%) | 8 + 14 | **14** | 36 |
| tie: mentor_legacy | 12.6% (12.8%) | 8 + 12 | **10** | 30 |
| tie: genuine_respect | 8.3% (8.0%) | 8 + 12 | **5** | 25 |
| tie: family_complication · bitter_history | 5.5% · 4.6% (4.5% · 5.6%) | 8 · 8 | 0 | 8 · 8 |
| tie: every other archetype | under 0.5% each | | 0 | |
| hook: `other` | 51.2% (51.0%) | 40 + 30 | **30** | 100 |
| hook: `economy` | 18.1% (17.8%) | 24 + 14 | **6** | 44 |
| hook: `government` · `criminal` | 9.6% · 8.9% (12.2% · 6.7%) | 24 + 8 · 18 + 8 | 0 | 32 · 26 |
| hook: `religious` · `magic` · `military` | 4.9% · 3.6% · 3.5% | 18 · 8 · 24 | 0 | |

HOW PLACED: a group whose town prints `d` of its `n` rows repeats about `d²/n` across two towns, so its repeats fall as
`R·n/(n+k)` when `k` rows are added; the 77 pairs and 36 hooks are spread to equalise the marginal gain `R·n/(n+k)²` over the
groups, from the city's (D) shares above (the metropolis gives the same order). That optimum gives `government` and `criminal`
nothing (their marginal at their present size stays below `other`'s and `economy`'s after the adds; at metropolis it would give
`government` one). `family_complication` and `bitter_history` stand at a few percent (4.5-5.6% at city and metropolis) and are
left out as the brief says; the optimum would have given them 4 pairs each, worth about 0.4 point at city by the same model; and
every `bitter_history` description declares `trust: 'none'`, which WRITE-TIES rule 3 forbids a new line to state.

THE MEASURE: the probe extended with this placement (`measure-2/probe4.patch`, cumulative from `7fdc73bbb`: probe3's block
unchanged, then a second block appending letter-only placeholders, `PROBE second <archetype> d|t <letters>` pairs and
`PROBE second hook <pool> <letters>` hooks, each hook tagged in `AUTHORED_HOOK_THEMES` with EXACTLY the theme its real line
below carries), then `measures.mjs` on it (`measure-2/measures.probe4.out.txt`), section (A), PAIR share:

| size | ties: line -> after tranche 1 -> after tranche 2 | hooks: line -> after tranche 1 -> after tranche 2 |
|---|---|---|
| town | 35.4% -> 16.5% -> **11.1%** | 25.3% -> 17.1% -> **12.3%** |
| city | 62.8% -> 37.2% -> **23.6%** | 46.5% -> 31.5% -> **25.5%** |
| metropolis | 73.4% -> 48.9% -> **32.2%** | 63.5% -> 42.5% -> **35.0%** |

(The line's and probe3's figures are DEPTH-1's `measure/measures.line-43ab0f5eb.out.txt` and `measures.probe3.out.txt`;
REPRODUCED here: `measures.mjs` on the probe3 tree gives `measures.probe3.out.txt` byte for byte bar the timing line; every
other field of `measures.probe4.out.txt` (goals, secrets, the town tensions, section C) is byte-identical to the line's.)
The model above predicted 24.6% (ties) and 25.9% (hooks) at city. Placeholders reach every town (no
`needs`), so the real gain is at most this: PLAUSIBLE, not CONFIRMED, until the built lines are measured.

## mutual_leverage (Mutual Leverage): 17 pairs

1. NEW desc: "R and S were each present, long ago, when the other said something they would now give a good deal to unsay. Each remembers the exact words."
   tension: "Someone else who was there that day has come back to live nearby. R and S have each called on that person, separately."
     beside: desc "R and S each hold information or resources the other needs. They cooperate efficiently and neither trusts the other at all." / tension "The balance between R and S has recently shifted. S has noticed; R has not, yet."
     beside: desc "R knows enough to ruin S, and S holds enough to finish R, so the two of them work together very carefully." / tension "A document R and S each believed only they possessed has turned up in someone else's hands."

2. NEW desc: "R keeps letters S wrote long ago, and S keeps R's. Neither has offered to give them back."
   tension: "S has offered to exchange the letters, both bundles at once. R has asked to read S's bundle first."
     beside: desc "R and S deal with each other slowly and politely, each knowing one slip could ruin them both." / tension "S has recently secured something that makes R's hold obsolete. The politeness continues, for now."
     beside: desc "R and S trade favours on a strict count. Neither has ever been more than one favour ahead." / tension "R has asked S for a second favour before repaying the first, which would put R two favours ahead."

3. NEW desc: "R and S each know who the other was before they became what they are now, and each is careful to speak of the other only as they are now."
   tension: "A newcomer has asked R where S comes from. R gave a short answer, and has told S exactly what it was."
     beside: desc "R controls a vote S needs, and S controls a supply R needs. Their meetings are short and their bargains hold." / tension "S has found a new source for what R supplies. R has not been told."
     beside: desc "R and S each have something to trade and nothing to give away. They meet in private, bargain hard, and keep every bargain." / tension "The vote S needs from R comes up next week, and R has named a new price."

4. NEW desc: "R and S each vouched for the other once, and either could still take the word back. Both are careful to keep it standing."
   tension: "R has been asked, plainly, whether R still stands by what R once said of S. R said yes, and has let S know what the yes was worth."
     beside: desc "S needs R's seal on certain papers; R needs S's silence about certain others. Neither has asked for more than the other could pay." / tension "R's secret is about to come out by other means. Once it does, S holds nothing over R."
     beside: desc "R and S sit on opposite sides of most questions and vote together on the few that touch their shared interests." / tension "S has written down what R owes and left a sealed copy with a third party."

5. NEW desc: "R and S know each other's households better than either would like: who quarrels, who drinks, who owes whom."
   tension: "Someone from R's household has started calling at S's door. R has not asked why, and S has not said."
     beside: desc "R and S each hold information or resources the other needs. They cooperate efficiently and neither trusts the other at all." / tension "The balance between R and S has recently shifted. S has noticed; R has not, yet."
     beside: desc "R knows enough to ruin S, and S holds enough to finish R, so the two of them work together very carefully." / tension "A document R and S each believed only they possessed has turned up in someone else's hands."

6. NEW desc: "R and S have each covered for the other once, and each made sure the other knew the cover could be lifted."
   tension: "R needs covering again, on a small matter. S has agreed and named no price, which troubles R more than a price would."
     beside: desc "R and S deal with each other slowly and politely, each knowing one slip could ruin them both." / tension "S has recently secured something that makes R's hold obsolete. The politeness continues, for now."
     beside: desc "R and S trade favours on a strict count. Neither has ever been more than one favour ahead." / tension "R has asked S for a second favour before repaying the first, which would put R two favours ahead."

7. NEW desc: "R and S are each the only person who could contradict the other's favourite story about themselves."
   tension: "S has told that story again in R's hearing, with a new detail. R has let it stand and is deciding what it is worth."
     beside: desc "R controls a vote S needs, and S controls a supply R needs. Their meetings are short and their bargains hold." / tension "S has found a new source for what R supplies. R has not been told."
     beside: desc "R and S each have something to trade and nothing to give away. They meet in private, bargain hard, and keep every bargain." / tension "The vote S needs from R comes up next week, and R has named a new price."

8. NEW desc: "R and S still hold each other's spare keys from an easier time. Neither has asked for theirs back."
   tension: "R has changed a lock and said nothing. S has noticed, and has kept the old key all the same."
     beside: desc "S needs R's seal on certain papers; R needs S's silence about certain others. Neither has asked for more than the other could pay." / tension "R's secret is about to come out by other means. Once it does, S holds nothing over R."
     beside: desc "R and S sit on opposite sides of most questions and vote together on the few that touch their shared interests." / tension "S has written down what R owes and left a sealed copy with a third party."

9. NEW desc: "R knows the one thing S would least like told of S's younger days, and S knows R's."
   tension: "Someone who knew S when S was young has come to stay nearby, and S has made sure R knows it."
     beside: desc "R and S each hold information or resources the other needs. They cooperate efficiently and neither trusts the other at all." / tension "The balance between R and S has recently shifted. S has noticed; R has not, yet."
     beside: desc "R knows enough to ruin S, and S holds enough to finish R, so the two of them work together very carefully." / tension "A document R and S each believed only they possessed has turned up in someone else's hands."

10. NEW desc: "R and S each know what the other has said, in private, about a person both of them now depend on."
   tension: "That person has invited R and S to the same table. Both have accepted, and both are being very agreeable."
     beside: desc "R and S deal with each other slowly and politely, each knowing one slip could ruin them both." / tension "S has recently secured something that makes R's hold obsolete. The politeness continues, for now."
     beside: desc "R and S trade favours on a strict count. Neither has ever been more than one favour ahead." / tension "R has asked S for a second favour before repaying the first, which would put R two favours ahead."

11. NEW desc: "R and S settled an old quarrel on terms that either could still break. Both keep to the terms, and both keep their copies."
   tension: "S has mislaid S's copy and has asked R, politely, to read R's aloud. R is deciding whether to read it exactly."
     beside: desc "R controls a vote S needs, and S controls a supply R needs. Their meetings are short and their bargains hold." / tension "S has found a new source for what R supplies. R has not been told."
     beside: desc "R and S each have something to trade and nothing to give away. They meet in private, bargain hard, and keep every bargain." / tension "The vote S needs from R comes up next week, and R has named a new price."

12. NEW desc: "R and S made the same mistake together once, and each has told the story since as the other's."
   tension: "Someone has heard both versions and has asked R and S, together, which is true. Each said it was the other's."
     beside: desc "S needs R's seal on certain papers; R needs S's silence about certain others. Neither has asked for more than the other could pay." / tension "R's secret is about to come out by other means. Once it does, S holds nothing over R."
     beside: desc "R and S sit on opposite sides of most questions and vote together on the few that touch their shared interests." / tension "S has written down what R owes and left a sealed copy with a third party."

13. NEW desc: "R and S deal with each other only before witnesses, so that neither can later claim a promise that was never made."
   tension: "S has asked to speak with R alone, for the first time. R has agreed, and has brought a friend to wait outside."
     beside: desc "R and S each hold information or resources the other needs. They cooperate efficiently and neither trusts the other at all." / tension "The balance between R and S has recently shifted. S has noticed; R has not, yet."
     beside: desc "R knows enough to ruin S, and S holds enough to finish R, so the two of them work together very carefully." / tension "A document R and S each believed only they possessed has turned up in someone else's hands."

14. NEW desc: "R and S have each made the other a gift that could not be refused, and both know what a refusal would have cost."
   tension: "R has sent S another gift, smaller than the last. S is trying to work out whether smaller is a message."
     beside: desc "R and S deal with each other slowly and politely, each knowing one slip could ruin them both." / tension "S has recently secured something that makes R's hold obsolete. The politeness continues, for now."
     beside: desc "R and S trade favours on a strict count. Neither has ever been more than one favour ahead." / tension "R has asked S for a second favour before repaying the first, which would put R two favours ahead."

15. NEW desc: "R can damage S's standing and S can damage R's plans, so each keeps a careful eye on the other's."
   tension: "R has a new plan in hand, and S has started asking polite questions about it. R is answering every one of them."
     beside: desc "R controls a vote S needs, and S controls a supply R needs. Their meetings are short and their bargains hold." / tension "S has found a new source for what R supplies. R has not been told."
     beside: desc "R and S each have something to trade and nothing to give away. They meet in private, bargain hard, and keep every bargain." / tension "The vote S needs from R comes up next week, and R has named a new price."

16. NEW desc: "R and S are each the other's best excuse: either can say the other required something of them, and neither has ever contradicted the other."
   tension: "S has been asked whether S really required what R says S required. S has not answered yet, and R knows S was asked."
     beside: desc "S needs R's seal on certain papers; R needs S's silence about certain others. Neither has asked for more than the other could pay." / tension "R's secret is about to come out by other means. Once it does, S holds nothing over R."
     beside: desc "R and S sit on opposite sides of most questions and vote together on the few that touch their shared interests." / tension "S has written down what R owes and left a sealed copy with a third party."

17. NEW desc: "R and S each hold a small piece of the other's past, and keep it the way some people keep a coin against a bad day."
   tension: "S has had a bad day and has not spent the coin. R has noticed the restraint and is wary of it."
     beside: desc "R and S each hold information or resources the other needs. They cooperate efficiently and neither trusts the other at all." / tension "The balance between R and S has recently shifted. S has noticed; R has not, yet."
     beside: desc "R knows enough to ruin S, and S holds enough to finish R, so the two of them work together very carefully." / tension "A document R and S each believed only they possessed has turned up in someone else's hands."


## peer_rivalry (Professional Rivalry): 16 pairs

1. NEW desc: "R and S each try to be up and about before the other. People here set their mornings by whichever of them is out first."
   tension: "S has been out first every day for a week. R has stopped trying, or wants S to think so."
     beside: desc "R and S want the same thing and compete hard for it, but neither has let it turn into hatred." / tension "A decision coming next season will favour R or S heavily, and both of them know it."
     beside: desc "Only one of R and S can come out ahead, and both know it. They stay polite and give no ground." / tension "A patron they share has let it be known there is room for only R or S at the next table."

2. NEW desc: "R and S each keep the better table, by their own account. Anyone who dines with one is asked about the other's."
   tension: "A guest has praised S's table at R's. R has invited the guest back, and is planning the meal with great care."
     beside: desc "Every gain R makes, S answers within the season, and people here have learned to expect it." / tension "R has recently broken an unwritten rule of the contest. S is deciding what that permits."
     beside: desc "R and S bid for the same contracts and sit at the same tables. Each counts the other's wins more carefully than their own." / tension "R has hired away S's best assistant. S has said nothing about it, to anyone."

3. NEW desc: "R and S each tell the same old story of the settlement, and each tells it as though the other had got it wrong."
   tension: "Someone has asked R and S to tell it together. Both have agreed, and neither has said who begins."
     beside: desc "R and S trained together and have competed ever since. The settlement keeps score, and so do they." / tension "A post opens at midsummer, and only R or S can fill it."
     beside: desc "R wants S's position, and S wants R's reputation. They are civil in public and unforgiving in private." / tension "S has been telling clients that R's work is slipping. Two of the clients have repeated it to R."

4. NEW desc: "R and S each take care to be the better turned out in any room they share, and each claims not to notice the other."
   tension: "S came out in plain clothes yesterday. R, dressed for the occasion, is wondering what S knows."
     beside: desc "Every client R wins is one S lost, and the reverse. The two keep a polite distance and an exact tally." / tension "R and S will both present proposals at the next council session. Only one will be accepted."
     beside: desc "R and S are rivals for the same patron's favour. Each has spent the year trying to be first through the patron's door." / tension "R lost the last contract to S by a single vote, and has learned who cast it."

5. NEW desc: "R and S were friends once, and the rivalry began over something both now call trivial. Neither has let it go."
   tension: "S has called it trivial in R's hearing and offered a hand. R has taken the hand and kept the score."
     beside: desc "R and S want the same thing and compete hard for it, but neither has let it turn into hatred." / tension "A decision coming next season will favour R or S heavily, and both of them know it."
     beside: desc "Only one of R and S can come out ahead, and both know it. They stay polite and give no ground." / tension "A patron they share has let it be known there is room for only R or S at the next table."

6. NEW desc: "R and S each make a point of helping whoever the other has just turned away."
   tension: "S turned someone away in front of R, plainly expecting R to step in. R has not stepped in, and the someone has gone elsewhere."
     beside: desc "Every gain R makes, S answers within the season, and people here have learned to expect it." / tension "R has recently broken an unwritten rule of the contest. S is deciding what that permits."
     beside: desc "R and S bid for the same contracts and sit at the same tables. Each counts the other's wins more carefully than their own." / tension "R has hired away S's best assistant. S has said nothing about it, to anyone."

7. NEW desc: "R and S have each waited years for the other to slip in public. Both have grown careful, and neither has obliged."
   tension: "R made a small slip in public. S set it right so gently that people noticed the gentleness more than the slip."
     beside: desc "R and S trained together and have competed ever since. The settlement keeps score, and so do they." / tension "A post opens at midsummer, and only R or S can fill it."
     beside: desc "R wants S's position, and S wants R's reputation. They are civil in public and unforgiving in private." / tension "S has been telling clients that R's work is slipping. Two of the clients have repeated it to R."

8. NEW desc: "R and S pick up whatever the other learns as soon as they hear of it, so neither stays ahead for long."
   tension: "S has learned something R cannot easily pick up, and has let it be known. R has begun asking, quietly, who could teach it."
     beside: desc "Every client R wins is one S lost, and the reverse. The two keep a polite distance and an exact tally." / tension "R and S will both present proposals at the next council session. Only one will be accepted."
     beside: desc "R and S are rivals for the same patron's favour. Each has spent the year trying to be first through the patron's door." / tension "R lost the last contract to S by a single vote, and has learned who cast it."

9. NEW desc: "R and S both expect to be greeted first wherever they arrive, and hosts here have learned to meet them at the door together."
   tension: "A host greeted S first yesterday. R has been gracious about it to everyone but the host."
     beside: desc "R and S want the same thing and compete hard for it, but neither has let it turn into hatred." / tension "A decision coming next season will favour R or S heavily, and both of them know it."
     beside: desc "Only one of R and S can come out ahead, and both know it. They stay polite and give no ground." / tension "A patron they share has let it be known there is room for only R or S at the next table."

10. NEW desc: "R and S have each beaten the other often enough that a loss between them no longer shames either. A loss to anyone else would."
   tension: "Someone new has beaten S at the thing they compete over. R has been surprisingly kind to S about it."
     beside: desc "Every gain R makes, S answers within the season, and people here have learned to expect it." / tension "R has recently broken an unwritten rule of the contest. S is deciding what that permits."
     beside: desc "R and S bid for the same contracts and sit at the same tables. Each counts the other's wins more carefully than their own." / tension "R has hired away S's best assistant. S has said nothing about it, to anyone."

11. NEW desc: "R and S each keep the other's old failures in mind, and bring them up only when asked."
   tension: "Someone asked R about one of S's old failures, and R told it fairly. S has heard, and does not know whether to be grateful."
     beside: desc "R and S trained together and have competed ever since. The settlement keeps score, and so do they." / tension "A post opens at midsummer, and only R or S can fill it."
     beside: desc "R wants S's position, and S wants R's reputation. They are civil in public and unforgiving in private." / tension "S has been telling clients that R's work is slipping. Two of the clients have repeated it to R."

12. NEW desc: "R and S once agreed to stop competing and lasted less than a month. They have not tried since."
   tension: "S has proposed trying again. R has agreed in principle and has started competing over the terms."
     beside: desc "Every client R wins is one S lost, and the reverse. The two keep a polite distance and an exact tally." / tension "R and S will both present proposals at the next council session. Only one will be accepted."
     beside: desc "R and S are rivals for the same patron's favour. Each has spent the year trying to be first through the patron's door." / tension "R lost the last contract to S by a single vote, and has learned who cast it."

13. NEW desc: "R and S are spoken of in the same breath here, and each of them resents it for a different reason."
   tension: "Someone has spoken of R without S, in company. R found it less pleasant than R had expected."
     beside: desc "R and S want the same thing and compete hard for it, but neither has let it turn into hatred." / tension "A decision coming next season will favour R or S heavily, and both of them know it."
     beside: desc "Only one of R and S can come out ahead, and both know it. They stay polite and give no ground." / tension "A patron they share has let it be known there is room for only R or S at the next table."

14. NEW desc: "R and S give to the same causes, and each makes sure the other's gift is known to be the smaller."
   tension: "S has given without a name this time. R cannot tell how much, and that bothers R more than a large sum would."
     beside: desc "Every gain R makes, S answers within the season, and people here have learned to expect it." / tension "R has recently broken an unwritten rule of the contest. S is deciding what that permits."
     beside: desc "R and S bid for the same contracts and sit at the same tables. Each counts the other's wins more carefully than their own." / tension "R has hired away S's best assistant. S has said nothing about it, to anyone."

15. NEW desc: "R and S each think the other has the easier life, and say so to anyone who asks."
   tension: "R has had a hard time of it, and S was the first to call. R has been grateful and suspicious in equal measure."
     beside: desc "R and S trained together and have competed ever since. The settlement keeps score, and so do they." / tension "A post opens at midsummer, and only R or S can fill it."
     beside: desc "R wants S's position, and S wants R's reputation. They are civil in public and unforgiving in private." / tension "S has been telling clients that R's work is slipping. Two of the clients have repeated it to R."

16. NEW desc: "R and S cannot share a room without one of them being better at something in it, and both look for what it is."
   tension: "R and S have been seated side by side at a neighbour's table. Both have already thought about what to say."
     beside: desc "Every client R wins is one S lost, and the reverse. The two keep a polite distance and an exact tally." / tension "R and S will both present proposals at the next council session. Only one will be accepted."
     beside: desc "R and S are rivals for the same patron's favour. Each has spent the year trying to be first through the patron's door." / tension "R lost the last contract to S by a single vote, and has learned who cast it."


## old_debt (Outstanding Debt (debtor first: R owes S)): 15 pairs

1. NEW desc: "S took R in when R first came here with nowhere to stay. R has never found the right way to repay a roof."
   tension: "S needs a roof for a relative for a while. R offered at once, and S is hesitating to accept."
     beside: desc "R owes S a great deal, and neither has ever said so aloud." / tension "S is about to call it in."
     beside: desc "Years ago S did R a favour too large to repay, and R has been paying it back in small ways ever since." / tension "R has begun to act like someone who considers the debt paid. S does not."

2. NEW desc: "S taught R to read when R was grown and ashamed to ask anyone else. R owes S for it and has never said so in company."
   tension: "S's eyes are failing, and S has asked R to read something aloud. R is glad to, and finds it harder than expected to be thanked."
     beside: desc "R owes S for an old kindness. Neither mentions it, and both know exactly how much is still owed." / tension "Someone else has learned what favour R owes S, and now has a hold on R too."
     beside: desc "S paid R's bail eleven years ago and has never mentioned it. R mentions it to no one." / tension "S has asked R for a vote against R's own interests. It is the first payment S has asked for."

3. NEW desc: "S lent R something of value years ago and has never asked for it back. R still has it, and keeps it better than anything R owns."
   tension: "S has mentioned the thing in passing, fondly. R is deciding whether to return it unasked."
     beside: desc "R owes S a large sum in coin, borrowed in a bad year and repaid in small amounts ever since." / tension "R has offered to clear what is left of the debt in one payment. S would rather be repaid in favours."
     beside: desc "S kept R's name out of a scandal that ruined two others. R has voted with S ever since." / tension "S has mentioned the debt aloud, at a dinner, in front of R's partners."

4. NEW desc: "S sat with R through the worst of a grief, night after night, and R has never forgotten whose company it was."
   tension: "S is low in spirits and will not say why. R has started calling every evening, and S has not yet told R to stop."
     beside: desc "S nursed R through a winter fever when no one else would come. R still owes the debt and still knows it." / tension "R has refused S a small favour for the first time in years."
     beside: desc "R borrowed S's good name to win a post. S has never asked for it back." / tension "S has begun to count the debt R owes among S's assets, and has had it written down before witnesses."

5. NEW desc: "S found R work when R had none, and never told R that it cost S a favour of S's own."
   tension: "R has just learned what it cost S, and has gone to settle it. S is mostly annoyed that R found out."
     beside: desc "R owes S a great deal, and neither has ever said so aloud." / tension "S is about to call it in."
     beside: desc "Years ago S did R a favour too large to repay, and R has been paying it back in small ways ever since." / tension "R has begun to act like someone who considers the debt paid. S does not."

6. NEW desc: "S once forgave R half of what R owed, and R has insisted on paying the other half twice over."
   tension: "S has sent the latest payment back. R has left it on S's doorstep."
     beside: desc "R owes S for an old kindness. Neither mentions it, and both know exactly how much is still owed." / tension "Someone else has learned what favour R owes S, and now has a hold on R too."
     beside: desc "S paid R's bail eleven years ago and has never mentioned it. R mentions it to no one." / tension "S has asked R for a vote against R's own interests. It is the first payment S has asked for."

7. NEW desc: "S fed R for a long while when R could not feed themselves, and asked nothing for it."
   tension: "R has sent S a fine dinner, unasked. S has sent half of it back to R, with thanks."
     beside: desc "R owes S a large sum in coin, borrowed in a bad year and repaid in small amounts ever since." / tension "R has offered to clear what is left of the debt in one payment. S would rather be repaid in favours."
     beside: desc "S kept R's name out of a scandal that ruined two others. R has voted with S ever since." / tension "S has mentioned the debt aloud, at a dinner, in front of R's partners."

8. NEW desc: "S once took the blame for something small that R had done, and has never said so to anyone."
   tension: "Someone has brought up that old matter, still blaming S. R has started to set it straight, and S has asked R to leave it be."
     beside: desc "S nursed R through a winter fever when no one else would come. R still owes the debt and still knows it." / tension "R has refused S a small favour for the first time in years."
     beside: desc "R borrowed S's good name to win a post. S has never asked for it back." / tension "S has begun to count the debt R owes among S's assets, and has had it written down before witnesses."

9. NEW desc: "R once owed a debt to S's family, and has gone on paying it to S without being asked."
   tension: "S has found the family's old note of the debt, and it names a smaller sum than R has already paid. S has not yet said so."
     beside: desc "R owes S a great deal, and neither has ever said so aloud." / tension "S is about to call it in."
     beside: desc "Years ago S did R a favour too large to repay, and R has been paying it back in small ways ever since." / tension "R has begun to act like someone who considers the debt paid. S does not."

10. NEW desc: "S once kept R's household going while R was away, and handed it all back in better order than R left it."
   tension: "R has learned that S wants to make a journey and cannot afford it. R is looking for a way to pay without S knowing."
     beside: desc "R owes S for an old kindness. Neither mentions it, and both know exactly how much is still owed." / tension "Someone else has learned what favour R owes S, and now has a hold on R too."
     beside: desc "S paid R's bail eleven years ago and has never mentioned it. R mentions it to no one." / tension "S has asked R for a vote against R's own interests. It is the first payment S has asked for."

11. NEW desc: "S once brought R and R's family back to speaking terms, when they had stopped and nobody else would try."
   tension: "S has fallen out with S's own family. R has offered to do for S what S once did, and S is not sure R is the one for it."
     beside: desc "R owes S a large sum in coin, borrowed in a bad year and repaid in small amounts ever since." / tension "R has offered to clear what is left of the debt in one payment. S would rather be repaid in favours."
     beside: desc "S kept R's name out of a scandal that ruined two others. R has voted with S ever since." / tension "S has mentioned the debt aloud, at a dinner, in front of R's partners."

12. NEW desc: "S once sat up all night finishing a task R had promised and could not finish. R still counts that night as owed."
   tension: "R has seen S struggling to finish something late. R has rolled up their sleeves without a word, and S is letting R."
     beside: desc "S nursed R through a winter fever when no one else would come. R still owes the debt and still knows it." / tension "R has refused S a small favour for the first time in years."
     beside: desc "R borrowed S's good name to win a post. S has never asked for it back." / tension "S has begun to count the debt R owes among S's assets, and has had it written down before witnesses."

13. NEW desc: "S once talked R out of a promise R would have regretted. R has been grateful ever since, and a little resentful."
   tension: "S is about to make a promise of the same kind. R has gone round to talk S out of it, and is enjoying it slightly."
     beside: desc "R owes S a great deal, and neither has ever said so aloud." / tension "S is about to call it in."
     beside: desc "Years ago S did R a favour too large to repay, and R has been paying it back in small ways ever since." / tension "R has begun to act like someone who considers the debt paid. S does not."

14. NEW desc: "S paid for R's schooling when R's family could not, and has never once brought it up."
   tension: "R has started paying for the schooling of a young relative of S's. S has not said thank you, which is how R knows S understands."
     beside: desc "R owes S for an old kindness. Neither mentions it, and both know exactly how much is still owed." / tension "Someone else has learned what favour R owes S, and now has a hold on R too."
     beside: desc "S paid R's bail eleven years ago and has never mentioned it. R mentions it to no one." / tension "S has asked R for a vote against R's own interests. It is the first payment S has asked for."

15. NEW desc: "S kept a promise to R at a time when breaking it would have been easy and forgiven. R has felt in S's debt ever since."
   tension: "R has a promise to S that has become hard to keep. R is keeping it, and S has noticed what it costs."
     beside: desc "R owes S a large sum in coin, borrowed in a bad year and repaid in small amounts ever since." / tension "R has offered to clear what is left of the debt in one payment. S would rather be repaid in favours."
     beside: desc "S kept R's name out of a scandal that ruined two others. R has voted with S ever since." / tension "S has mentioned the debt aloud, at a dinner, in front of R's partners."


## wary_alliance (Pragmatic Alliance): 14 pairs

1. NEW desc: "R and S agreed long ago never to speak against each other in public, and both have kept to it with visible effort."
   tension: "S was asked in public what S thought of R, and gave a careful answer that pleased no one. R has thanked S for it, coolly."
     beside: desc "R and S work together because fighting each other would cost them both more, and both of them know it." / tension "Someone else is working to pull R and S apart."
     beside: desc "R and S are allies because each has reckoned what the other would cost as an enemy. The friendship is courteous, and it lasts only while that reckoning holds." / tension "The threat that brought R and S together is gone. Neither has said so aloud."

2. NEW desc: "R and S keep the alliance because the other's enemies would otherwise be their own."
   tension: "One of S's enemies has made overtures to R. R has told S, and asked what it is worth to S that R refuses."
     beside: desc "R and S joined against a threat that has since passed, and each is now asking what the alliance is still for." / tension "R has taken a precaution against S that S was not meant to discover. S has discovered it."
     beside: desc "R and S share a council bloc and a list of enemies. They do not share their plans." / tension "S has been dining with R's rivals. R heard about it from a servant."

3. NEW desc: "R and S do not visit each other's homes. They meet on neutral ground and keep the meetings short."
   tension: "R has proposed meeting at R's own house next time. S has agreed, and is wondering who else will be there."
     beside: desc "R and S back each other in public and check each other's work in private." / tension "R wants to bring a third member into the alliance. S thinks the newcomer would take S's place."
     beside: desc "R brings the votes and S brings the money. The alliance is three years old and has won every vote it needed." / tension "S voted against R on a small matter last week. R is waiting to see whether it was small."

4. NEW desc: "R and S are allies only in what they oppose. On what they want, they have never agreed."
   tension: "R and S have found something they both want, which has never happened before. Neither knows how to share it."
     beside: desc "R and S signed a pact after their last quarrel cost them both. They keep to its terms exactly." / tension "R and S both want the same office, and the alliance cannot survive one of them winning it."
     beside: desc "R and S are allies with separate interests. They meet to coordinate and leave by different doors." / tension "S has asked R to back a candidate R distrusts. Refusing would cost the alliance its majority."

5. NEW desc: "R and S came together because neither could manage alone, and each has been growing stronger since."
   tension: "S could now manage alone, and R has seen it before S has said so."
     beside: desc "R and S work together because fighting each other would cost them both more, and both of them know it." / tension "Someone else is working to pull R and S apart."
     beside: desc "R and S are allies because each has reckoned what the other would cost as an enemy. The friendship is courteous, and it lasts only while that reckoning holds." / tension "The threat that brought R and S together is gone. Neither has said so aloud."

6. NEW desc: "R and S were set against each other once by a third person, and allied mainly to deny that person the satisfaction."
   tension: "That third person has made peace with S. R is waiting to learn whether the alliance survived it."
     beside: desc "R and S joined against a threat that has since passed, and each is now asking what the alliance is still for." / tension "R has taken a precaution against S that S was not meant to discover. S has discovered it."
     beside: desc "R and S share a council bloc and a list of enemies. They do not share their plans." / tension "S has been dining with R's rivals. R heard about it from a servant."

7. NEW desc: "R and S each think the alliance does more for the other, and both say so to keep the other grateful."
   tension: "S has done R a turn that plainly helps R alone. R is wary of the generosity and looking for the bill."
     beside: desc "R and S back each other in public and check each other's work in private." / tension "R wants to bring a third member into the alliance. S thinks the newcomer would take S's place."
     beside: desc "R brings the votes and S brings the money. The alliance is three years old and has won every vote it needed." / tension "S voted against R on a small matter last week. R is waiting to see whether it was small."

8. NEW desc: "R and S trade introductions: each opens doors for the other that would stay shut to a stranger."
   tension: "S has asked R to open a door R would rather keep shut. R has not refused, and has not opened it."
     beside: desc "R and S signed a pact after their last quarrel cost them both. They keep to its terms exactly." / tension "R and S both want the same office, and the alliance cannot survive one of them winning it."
     beside: desc "R and S are allies with separate interests. They meet to coordinate and leave by different doors." / tension "S has asked R to back a candidate R distrusts. Refusing would cost the alliance its majority."

9. NEW desc: "R and S lean on the same people for support, and stand together so that those people cannot play one against the other."
   tension: "One of those people has offered R better terms than S gets. R has not yet told S."
     beside: desc "R and S work together because fighting each other would cost them both more, and both of them know it." / tension "Someone else is working to pull R and S apart."
     beside: desc "R and S are allies because each has reckoned what the other would cost as an enemy. The friendship is courteous, and it lasts only while that reckoning holds." / tension "The threat that brought R and S together is gone. Neither has said so aloud."

10. NEW desc: "R and S are each too proud to ask the other for help, so they offer it before it is needed."
   tension: "S needed help and the offer came late. S has said nothing, and R has noticed the nothing."
     beside: desc "R and S joined against a threat that has since passed, and each is now asking what the alliance is still for." / tension "R has taken a precaution against S that S was not meant to discover. S has discovered it."
     beside: desc "R and S share a council bloc and a list of enemies. They do not share their plans." / tension "S has been dining with R's rivals. R heard about it from a servant."

11. NEW desc: "R and S reckoned years ago that together they were harder to ignore. People here still speak of them as a pair."
   tension: "Someone has spoken to R as if S were not part of the pair. R corrected them, and wondered afterwards why."
     beside: desc "R and S back each other in public and check each other's work in private." / tension "R wants to bring a third member into the alliance. S thinks the newcomer would take S's place."
     beside: desc "R brings the votes and S brings the money. The alliance is three years old and has won every vote it needed." / tension "S voted against R on a small matter last week. R is waiting to see whether it was small."

12. NEW desc: "R and S keep a careful balance: whenever one of them gains, the other is offered a matching share."
   tension: "R has gained something that cannot be shared. S is waiting to see what R offers instead."
     beside: desc "R and S signed a pact after their last quarrel cost them both. They keep to its terms exactly." / tension "R and S both want the same office, and the alliance cannot survive one of them winning it."
     beside: desc "R and S are allies with separate interests. They meet to coordinate and leave by different doors." / tension "S has asked R to back a candidate R distrusts. Refusing would cost the alliance its majority."

13. NEW desc: "R and S stood together once when it mattered, and have lived on the memory since without repeating it."
   tension: "Something has come up that may need R and S to stand together again. Both have found reasons to be busy."
     beside: desc "R and S work together because fighting each other would cost them both more, and both of them know it." / tension "Someone else is working to pull R and S apart."
     beside: desc "R and S are allies because each has reckoned what the other would cost as an enemy. The friendship is courteous, and it lasts only while that reckoning holds." / tension "The threat that brought R and S together is gone. Neither has said so aloud."

14. NEW desc: "R and S dislike the same people more than they like each other, and the alliance rests on that."
   tension: "One of those people has done R a kindness. S has heard of it, and is watching R's manners closely."
     beside: desc "R and S joined against a threat that has since passed, and each is now asking what the alliance is still for." / tension "R has taken a precaution against S that S was not meant to discover. S has discovered it."
     beside: desc "R and S share a council bloc and a list of enemies. They do not share their plans." / tension "S has been dining with R's rivals. R heard about it from a servant."


## mentor_legacy (Mentor and Successor (R the teacher, S the pupil)): 10 pairs

1. NEW desc: "R taught S to keep their temper, which R has never managed to do."
   tension: "R lost their temper in S's presence. S stayed calm, and R cannot tell whether to be proud or ashamed."
     beside: desc "R made S's career, and S rarely says so." / tension "S now operates in ways R would not approve of. Neither discusses the divergence directly."
     beside: desc "S owes their place to R and has kept others from climbing the same way. The two of them remember it differently." / tension "R has one favour left to call in, and is saving it. S knows, and is watching for it."

2. NEW desc: "R taught S what to say to people in trouble, and S now says it better than R does."
   tension: "S has been asked to speak where R expected to be asked. R has helped S find the words."
     beside: desc "R taught S everything, including how to get the better of R." / tension "A third party has asked R, quietly, whether S can be trusted. The answer took too long."
     beside: desc "R took S in as an apprentice and taught them the trade, the clients, and the names worth knowing." / tension "S has taken on a client R turned away on principle."

3. NEW desc: "S was a difficult young person, and R was the only one who would put up with S. S has never forgotten it."
   tension: "R has grown difficult with age, and S is the only one who will put up with R."
     beside: desc "S learned the work at R's side for seven years. Half of S's clients first came through R's door." / tension "R has taken a new apprentice, and S has heard the apprentice is being taught things S never was."
     beside: desc "R vouched for S when nobody else would. S's first post came from that word." / tension "S corrected R in public last month, and was right."

4. NEW desc: "R gave S the books that shaped S, and still asks after them as if they had only been lent."
   tension: "S has given one of those books to someone younger. R has asked for it back, half in jest."
     beside: desc "S still uses R's methods and R's ledger format. Everyone who sees S's work recognises the teacher." / tension "R has asked S for a loan. It is the first time a debt between teacher and student has run that way."
     beside: desc "R named S as successor in front of witnesses. The formal handover has not happened." / tension "S has begun teaching R's methods as S's own."

5. NEW desc: "R taught S to say no, and S says it to R more often than R expected."
   tension: "S has said no to R on a matter R cares about. R has said, a little stiffly, that S was taught well."
     beside: desc "R made S's career, and S rarely says so." / tension "S now operates in ways R would not approve of. Neither discusses the divergence directly."
     beside: desc "S owes their place to R and has kept others from climbing the same way. The two of them remember it differently." / tension "R has one favour left to call in, and is saving it. S knows, and is watching for it."

6. NEW desc: "R singled S out for attention among many young people here, and some of those passed over still remember it."
   tension: "One of those passed over has asked S for help. S is giving it, partly for R's sake."
     beside: desc "R taught S everything, including how to get the better of R." / tension "A third party has asked R, quietly, whether S can be trusted. The answer took too long."
     beside: desc "R took S in as an apprentice and taught them the trade, the clients, and the names worth knowing." / tension "S has taken on a client R turned away on principle."

7. NEW desc: "R taught S to keep accounts of everything: money, promises and slights. S keeps them more strictly than R ever did."
   tension: "S has reminded R of a promise R made long ago. R remembers it, and is impressed and uncomfortable at once."
     beside: desc "S learned the work at R's side for seven years. Half of S's clients first came through R's door." / tension "R has taken a new apprentice, and S has heard the apprentice is being taught things S never was."
     beside: desc "R vouched for S when nobody else would. S's first post came from that word." / tension "S corrected R in public last month, and was right."

8. NEW desc: "R gave S a second home when S's own was unhappy, and taught S more there than anyone else did."
   tension: "S has offered R a room now that R lives alone. R has not answered, and keeps visiting instead."
     beside: desc "S still uses R's methods and R's ledger format. Everyone who sees S's work recognises the teacher." / tension "R has asked S for a loan. It is the first time a debt between teacher and student has run that way."
     beside: desc "R named S as successor in front of witnesses. The formal handover has not happened." / tension "S has begun teaching R's methods as S's own."

9. NEW desc: "R taught S everything R knew about the people here: whom to rely on and whom to be careful of."
   tension: "S has come to rely on someone R warned S about. R has said nothing, and is watching."
     beside: desc "R made S's career, and S rarely says so." / tension "S now operates in ways R would not approve of. Neither discusses the divergence directly."
     beside: desc "S owes their place to R and has kept others from climbing the same way. The two of them remember it differently." / tension "R has one favour left to call in, and is saving it. S knows, and is watching for it."

10. NEW desc: "R made S practise the same things over and over until S hated them, and S is grateful for it now."
   tension: "S has started making someone younger practise the same way. R has watched once, and laughed."
     beside: desc "R taught S everything, including how to get the better of R." / tension "A third party has asked R, quietly, whether S can be trusted. The answer took too long."
     beside: desc "R took S in as an apprentice and taught them the trade, the clients, and the names worth knowing." / tension "S has taken on a client R turned away on principle."


## genuine_respect (Genuine Respect): 5 pairs

1. NEW desc: "R and S have lent each other everything from tools to money over the years, and every loan has come back on the day promised."
   tension: "S has asked R for a loan that S may not manage to return on the day, and has said so plainly. R has lent it anyway."
     beside: desc "R and S have each watched the other do good work. They argue, but each trusts the other's judgment in their own field." / tension "R and S are about to be on opposite sides of an important decision."
     beside: desc "R and S disagree often and trust completely. Each has watched the other be right at cost, and neither forgets it." / tension "R is being pressed to act against S, and has not mentioned it."

2. NEW desc: "R and S have each spoken up for the other where people expected them to stay silent. Neither has asked to be thanked."
   tension: "S spoke up for R on a matter where S was not sure R was right. R has gone to S to explain, not to thank."
     beside: desc "There is no arrangement between R and S, only a long record of kept words; in this settlement that makes them remarkable." / tension "R and S still respect each other, but what each of them wants is pulling apart, and both can see it."
     beside: desc "R sends difficult cases to S, and S sends them back solved. Neither has ever charged the other a fee." / tension "R has learned something about S's family that S does not know."

3. NEW desc: "R and S each know the other's limits and have never pressed past them."
   tension: "R needs to press S past one of those limits, and has said so honestly. S is considering it."
     beside: desc "R and S have stood on opposite sides of three disputes and praised each other after every one." / tension "S has been offered R's post by people who want R gone."
     beside: desc "S once told the council that R was right and S was wrong. R has not forgotten it." / tension "R has made a mistake that S is bound to report. S has not reported it."

4. NEW desc: "R and S ask each other the questions nobody else dares to ask either of them."
   tension: "S has asked R a question R cannot yet answer honestly. S is waiting, without pressing."
     beside: desc "R and S consult each other before any decision that matters. The advice is honest and is always taken seriously." / tension "The council has asked R and S to audit each other's accounts. Both agreed, and neither is comfortable."
     beside: desc "R trusts S's word over any written contract. S has never given a reason to regret it." / tension "S has publicly backed a plan that R thinks will fail. R has said so once, in private."

5. NEW desc: "R and S have each named the other to settle their affairs if they cannot, and neither thought twice about it." [trust: full]
   tension: "R has asked S to look over the arrangement and change anything S sees fit. S has changed nothing and has told R why."
     beside: desc "R and S have each watched the other do good work. They argue, but each trusts the other's judgment in their own field." / tension "R and S are about to be on opposite sides of an important decision."
     beside: desc "R and S disagree often and trust completely. Each has watched the other be right at cost, and neither forgets it." / tension "R is being pressed to act against S, and has not mentioned it."


INTEGRATOR'S EDITS (DEPTH-2, 16:10 UTC by `date -u`, read line by line): old_debt 9 (desc, tension): "S's parent ... since the parent's death" -> "S's family" (a living parent may stand in the record); mutual_leverage 9 (desc, tension): "why S left the place S came from" -> "the one thing S would least like told of S's younger days" (both cards may be born here); peer_rivalry 16 tension: "a neighbour's wedding next week" -> "a neighbour's table" (no event presumed). Every other pair as written.
