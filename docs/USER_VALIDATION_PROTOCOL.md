# Uncoached persistent-campaign validation

**Status:** executable research protocol; no result exists until an external
cohort completes it  
**Protocol version:** 1.0  
**Evidence owner:** the named product-research lead; the release operator
co-signs the final decision receipt  
**Canonical evidence location:** the encrypted research store at
`research/validation/<YYYY-MM-DD>-<round-id>/`

The codebase can prove behavior, not first-use comprehension, preparation value,
retention, or willingness to pay. This protocol tests those product claims
without converting founder intuition, a coached demo, or a local browser check
into user evidence.

## 1. Claim and fixed introduction

Before the first task, show exactly this sentence and nothing else:

> SettlementForge is a settlement generator that lets you save a settlement as
> canon, connect it to a realm, and advance a living campaign world between
> sessions.

Do not give a product tour, define interface labels, point at navigation, or
explain the intended product loop. The research lead records the exact source
commit, deployed build identity, protocol version, fixture checksum, browser,
operating system, viewport, assistive technology, and session start time before
the participant begins.

## 2. Cohort and recruitment

Run one release-candidate round with **12 evaluable participants**. Recruit:

- DMs who currently run a persistent sandbox, political, domain, hexcrawl, West
  Marches, or long-running homebrew campaign;
- six tool-heavy and six lightweight-prep participants;
- at least four who already maintain canon across more than one digital tool;
- at least four who primarily use notes, documents, or paper;
- no contributor, prior tester of this build, close collaborator, or participant
  who has already received a SettlementForge tour.

Run in two operational waves of six, but do not change the build, task wording,
fixture, or scoring between waves. If a trust failure or repeated blocker
requires a product change, stop the round. The changed build begins a new
12-participant round; results from different builds are not pooled.

Record campaign style, years running games, current tools, typical preparation
time, and accessibility accommodations. Use participant IDs, not names, in the
analysis dataset.

## 3. Device and accessibility matrix

Participants may satisfy more than one row, but every minimum must be met:

| Evidence lane | Minimum | Required journey |
|---|---:|---|
| Desktop/laptop authoring | all 12 | Tasks 1–11 |
| Windows | 4 | Current Chrome or Firefox |
| macOS | 4 | Current Safari or Chrome |
| Mobile companion | 6: three iOS, three Android | Tasks 7–10; explain any honestly unsupported authoring boundary |
| Keyboard-only | 3 | Save/canon, attention triage, one decision, and return to its story |
| Screen reader | 2 | One NVDA + Chrome and one VoiceOver + Safari journey |
| Zoom/reflow or magnification | 2 | 200% zoom at 1280 CSS px or equivalent supported magnification |
| Touch | 4 | Mobile attention, decision, and story-return journey |

Record actual device, browser, browser version, viewport, input method, and
assistive-technology version. A participant who ordinarily uses assistive
technology uses their normal setup. Do not ask a non-user to impersonate a
screen-reader user.

## 4. Consent, privacy, and compensation

Read this before collecting research data:

> This session evaluates the product, not you. You may pause, skip a question,
> or stop at any time and still receive the full session payment. We will record
> task timing and anonymized observations. Screen or audio recording is optional
> and requires separate consent. Please use the supplied fictional campaign,
> not private player or campaign material. Recordings are deleted within 30
> days; anonymized notes and aggregate measures may be retained for 12 months.
> Your compensation does not depend on task success, praise, or a purchase.

Capture affirmative study consent and separate affirmative recording consent.
Pay **USD 75** for the 60–75 minute initial session and **USD 25** for the return
session. Pay the promised amount if the participant withdraws after beginning.
Four-week diary participants receive an additional **USD 25 per completed
weekly check-in**, up to USD 100. Compensation is never a discount, purchase
credit, or reimbursement for a product purchase.

Do not collect real campaign text, player data, billing credentials, access
tokens, or raw customer identifiers. Use supplied fictional fixtures and the
normal test-payment environment unless the pricing lane explicitly reaches the
public production checkout.

## 5. Fixtures

Freeze and checksum:

1. one generated settlement with a meaningful condition and inspectable cause;
2. one realm containing at least 24 settlements, a deterministic lead-three
   attention oracle, one pending decision, one lapsed order, one quiet
   settlement, and a 640-record history;
3. one structured SettlementForge account export containing:
   - a settlement that should be created;
   - an exact provenance match already in the target campaign;
   - an exact match attached exclusively to another campaign;
   - relationships and chronicle data that the current importer must disclose
     as visible but unapplied.

The fixture must contain no customer content. Its checksum and expected
attention/import oracle live beside the round receipt. A changed fixture starts
a new round.

## 6. Uncoached task script

Give one task card at a time. The observer may repeat its words verbatim. The
only neutral prompts are “Please continue as you normally would” and “Please
tell me what you expect to happen.” Naming a control, route, concept, or next
step is coaching and is recorded at that instant.

Ask the participant to:

1. forge a settlement they could use in the supplied campaign;
2. save it and explain what became durable;
3. find why one meaningful condition exists;
4. mark the settlement canon;
5. connect it to the supplied realm and start the clock;
6. advance the world;
7. identify the three things that most need attention now and choose the next
   useful action;
8. resolve or dismiss one consequence, then return to the story that produced
   it;
9. produce an artifact they would use to prepare the next session;
10. return 3–7 days later, explain what changed while away, and continue the
    campaign without a tour;
11. import the supplied structured account export into the target campaign,
    decide create/reuse/rehome/defer or skip for every settlement, explain what
    will move or be created and what will remain unapplied, preview before
    committing, and recover the reviewed plan after a page reopen by reuploading
    the same export.

For task 7, run the Game Grade five-second orientation subtest with the same
frozen active-save fixture and scoring language in
`docs/GAME_GRADE_PROGRAM.md`. The timer starts when the settled view becomes
visible, not while the page is loading.

For task 11, the observer may simulate an interrupted browser response only in
the designated recovery build. The participant must use the visible journal
check/reupload path; the observer must not encourage a blind retry. The task
does not imply support for prose, third-party formats, relationships, maps,
chronicles, or version-history import.

## 7. Scoring

For every task record:

- completed, completed with neutral clarification, coached, abandoned, or
  failed;
- start, first meaningful action, first coaching, and completion times;
- navigation reversals and repeated dead ends;
- the participant's expectation before a canon-changing action;
- whether the visible receipt/result matched that expectation;
- terminology misunderstandings and trust concerns;
- the first point where a supported-device or accessibility journey becomes
  unreachable.

A neutral clarification repeats task language or asks the participant to think
aloud. Any explanation of a term or interface location is coaching. A
**trust failure** is silent state loss, duplicate canon mutation, cross-world or
cross-owner confusion, undisclosed destructive rehome, GM-only information
exposure, or UI copy that materially misstates what will be persisted.

Also record:

- time to first session-usable output;
- draft-to-canon and canon-to-first-advance conversion;
- time to identify the lead change and required action;
- consequence completion versus abandonment;
- estimated preparation minutes saved;
- an actual timed before/after preparation comparison for at least six
  participants;
- Surveyor proposal accept/revise/reject and correction reason;
- return comprehension after 3–7 days;
- weekly reopen/advance activity for the diary cohort.

Generation count is an acquisition measure. Consecutive-week advancement of a
canonical world is the primary habit measure.

## 8. Pre-registered decision thresholds

The build passes the uncoached comprehension round only when all are true:

- at least 10 of 12 complete tasks 1–9 without product coaching;
- each individual core task is completed without product coaching by at least
  9 of 12;
- at least 4 of the 5 participants in the frozen five-second subtest answer the
  three state questions and identify the next useful place within five seconds
  and no more than one interaction;
- at least 8 of 10 or more returning participants complete task 10 without a
  renewed tour;
- at least 9 of 12 correctly predict the create/reuse/exclusive-rehome and
  unapplied-data boundaries in task 11 before commit, and at least 10 of 12
  recover without a blind duplicate apply;
- at least 9 of 12 produce an artifact they say they would use, and at least 6
  complete the timed preparation comparison;
- every required keyboard, screen-reader, zoom/reflow, touch, iOS, and Android
  lane completes its supported journey;
- there are zero trust failures;
- no same blocking point requires coaching for three or more participants.

Failure of a threshold blocks default promotion of the affected journey. A
single trust failure stops the round for investigation. A feature request from
one participant is evidence, not a roadmap.

For habit evidence, invite at least eight successful participants into a
four-week diary. The habit hypothesis passes only if at least six reopen a
canonical world in three distinct weeks and at least five independently advance
or reconcile it in three distinct weeks. Attrition is reported, not removed
from the denominator.

## 9. Pricing protocol

Usability compensation and pricing evidence are separate. After all product
tasks, ask the participant what they expected a useful version to cost before
showing any price. Then show the same published offers, terms, trial, refund
policy, and feature boundaries shown to every customer. Do not use personalized
prices, countdowns, invented scarcity, a researcher discount, or a reimbursed
purchase.

Record:

1. expected price and why;
2. chosen offer or “none”;
3. the feature/value boundary that drove the choice;
4. checkout start;
5. completed real purchase, standard refund, or no purchase;
6. 14-day continued-use and refund state.

Stated intent is qualitative only. The current-offer willingness-to-pay
hypothesis requires a separate cohort of **30 activation-qualified DMs** who
have completed a session-usable output. It passes only if at least 6 complete a
real purchase at the published price and at least 4 of those 6 still use the
product and have not requested a refund after 14 days. This threshold admits or
rejects the tested offer; it does not claim an optimal price or forecast broad
market conversion.

## 10. Evidence package and decision receipt

The research lead writes the encrypted package to the canonical evidence
location with:

- `manifest.json`: protocol/build/fixture identities, cohort criteria, device
  matrix, dates, owner, and file hashes;
- `task-results.csv`: participant IDs, outcomes, timings, coaching, and device
  lanes;
- `issues.md`: anonymized recurring blockers and trust findings;
- `pricing.csv`: expected price, offer choice, checkout, purchase, refund, and
  14-day state without payment credentials;
- `decision.md`: every threshold, numerator, denominator, exclusions, result,
  and resulting product decision;
- optional recordings in a separately access-controlled `recordings/`
  directory with deletion dates.

The repository may retain only a redacted, source-bound aggregate receipt at
`artifacts/research/<round-id>.json`; it must not contain recordings, campaign
text, free-form participant quotes, names, emails, payment data, or raw
identifiers. The research lead and release operator sign the decision receipt.
Missing participants, abandoned tasks, accessibility gaps, and contradictory
results remain visible.

No local test, founder-led demo, synthetic browser receipt, or unretained manual
observation satisfies this protocol.
