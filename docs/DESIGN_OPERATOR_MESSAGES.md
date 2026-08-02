# DESIGN — OPERATOR MESSAGES (mass dispatches + direct notices; one substrate)

## Fable 5 architecture, 2026-08-02, from owner dictation ("messaging, both private
## and mass... mass goes to email where available and a new Account section...
## also lets developers and admin message individual users regarding concerns —
## something reported or observed on our side"). Implementation = the external
## implementer.

## §0 THE SCOPING RULING (first, because the trap is famous)
The owner's elaboration describes OPERATOR→USER messaging in two lanes: broadcast
(mass) and direct (individual, for concerns/reports/observations from the
operator side). **This design is therefore OPERATOR MESSAGING — it is NOT
user-to-user DMs, deliberately and explicitly.** User↔user private messaging is
a different product with a different cost: a full moderation surface, abuse
vectors, block/report machinery, minors-adjacent liability — none of it needed
by a commons that already has gallery comments. RULED OUT-OF-SCOPE (vetoable;
if the owner ever wants user DMs, that is its own design with its own legal
review, never a rider on this one).

## §1 THE TWO LANES, ONE SUBSTRATE
```
operator_messages: { id, kind: 'broadcast' | 'direct',
                     class: 'service' | 'announcement',      // §3 — load-bearing
                     senderRole: 'admin' | 'developer' | 'system',
                     recipientUserId | audience,              // direct | broadcast
                     subject, body,                           // plain/markdown-lite
                     createdAt, template? }
message_receipts:  { messageId, userId, deliveredAt, readAt, dismissedAt }
```
- Broadcast = ONE message row; per-user receipts materialize LAZILY (on first
  Account visit or email send) — never a fan-out insert of N rows at send time.
- Body is plain text / markdown-lite rendered through the house renderer —
  never arbitrary HTML (the injection surface stays closed by construction).
- Both lanes are OUT-OF-WORLD BY REGISTER (the Bound Book's register map:
  `chrome/parchment`, operator voice): **the Herald is fiction, Messages is the
  company speaking, and the two must never be confusable** — no in-world
  flavor, no Herald typography, sender is always "SettlementForge" with a role
  line, never a personal staff name (consistency + staff privacy).

## §2 THE ACCOUNT SECTION — "Messages"
- A new Account tab, plain name **Messages** (vetoable; the plain word is the
  trust-correct one — a moderation notice must not arrive costumed) — joining
  the LD-5 menu as its seventh item (the map amends; the dropdown grammar
  holds).
- The list: newest first, unread emphasized, class-labeled chips (Service /
  Announcement), read-state per receipt; detail view renders the body + date +
  a single reply affordance (§4).
- **THE UNREAD BADGE (owner order 2026-08-02, superseding the chair's quiet-dot
  ruling — the owner's eye wins and is RIGHT: service notices are must-see, and
  candlelight under-signals a moderation or security notice):** a small
  RED-FILLED CIRCLE with a WHITE NUMERAL at the BOTTOM-RIGHT of the ribbon's
  Account control, counting UNOPENED messages across both classes.
  - ONE TRUTH, THREE RENDER POINTS: the count derives from receipts
    (readAt null) and renders identically on (a) the Account button when the
    dropdown is closed, (b) the MESSAGES ITEM inside the open dropdown — the
    owner's "moves" behavior: on hover-open the button badge HIDES and the
    item badge SHOWS, a simultaneous swap that reads as the count travelling
    to its destination (no flying animation — the motion law permits the
    settle micro-fade at most; nothing loops, nothing bounces), and (c) the
    Messages tab label inside the Account page.
  - ANATOMY + LAW: numeral caps at "9+"; ZERO IS ABSENT (the presence law — no
    empty badge ever renders); the red is a NAMED TOKEN (the palette gains its
    alert-register member — permitted in the CHROME register only, fenced from
    parchment/manuscript surfaces by the Bound Book's chip law: operational
    red never bleeds into the fiction).
  - READ SEMANTICS: the count is per-MESSAGE (opening a message marks it read
    and decrements live; visiting the section alone clears nothing — the
    numeral means unopened messages, exactly as the owner said).
  - A11Y: the control's accessible name carries the count ("Account — three
    unread messages"); the badge itself is aria-hidden (the numeral is visual
    reinforcement, never the only carrier).
  - PINS: zero-absent both arms; the swap (button badge hidden while open +
    item badge present, one fixture); the three render points against one
    receipts read; the 9+ cap; the accessible-name count.
- Presence law: the tab always exists for signed-in users (an empty Messages
  tab with the honest empty state beats a tab that pops into being with bad
  news as its first impression).

## §3 THE CLASS SPLIT (the load-bearing legal architecture)
Every message declares a class, and the class decides delivery rights:
- **`service`** — security notices, terms/policy changes, moderation notices,
  founder/covenant matters: delivered to Account ALWAYS and to email
  REGARDLESS of marketing preferences (the standard transactional carve-out;
  these are messages a user cannot opt out of receiving somewhere).
- **`announcement`** — features, news, the launch letter: Account always;
  EMAIL ONLY WITH the marketing opt-in, honoring the Preferences tab's email
  controls (which is what that tab already means), with the unsubscribe link
  mandatory in every announcement email. An announcement sent down the
  service pipe is a CLASS VIOLATION and pins red — the carve-out survives
  audits only if it is never abused.
- "Email where available" = where an address exists AND (for announcements)
  consent exists; the Account copy always carries the message either way —
  the section is the source of truth, email is the courier.

## §4 REPLIES — ONE QUEUE, STILL
Messages are ONE-WAY DELIVERY. The reply affordance on a direct message opens a
PRE-LINKED support ticket ("Reply via Feedback & support," carrying the
messageId) — conversations live in the EXISTING one-queue support lane, never
in a second inbox. This preserves the owner's one-queue ruling verbatim, gives
moderation conversations a thread without building threading, and keeps
Messages architecturally tiny.

## §5 THE ADMIN SURFACES (role-gated; audit-rowed; templates first-class)
- **Direct notice:** admin/developer picks a user (the §4 admin lookup idiom
  from the Hall panel), a TEMPLATE (moderation notice, avatar/name reset
  notice, report outcome, custom), edits, sends. SINGLE-admin (communication,
  not entitlement — proportionate), every send audit-rowed. The moderation
  lanes that already promise "notice to the user" (avatar remove/lock, name
  reset) SEND THROUGH THIS CHANNEL — this design is that promise's missing
  delivery mechanism, composed rather than duplicated.
- **Broadcast:** TWO-KEY (a mass email to every user is among the most
  irreversible acts the product can perform — it gets the founder-grant
  discipline), class-declared at composition, preview-rendered (email + Account
  form both), send is queued with a short cancel window (the one mercy every
  mass-send system learns to want), audit-rowed with audience count.
- Audience v1: `all` only. Segments (tier, activity) are PARKED — a segmented
  audience is a marketing engine's first feature and this is not a marketing
  engine yet (§8).

## §6 DELIVERY MECHANICS
- Email rides the existing emailTemplates lane; per-class layouts (service =
  austere; announcement = the house letter register); broadcast email sends
  batched with provider rate limits respected; failures recorded per receipt
  (deliveredAt null + reason) — the Account copy makes email failure a
  non-event for correctness.
- Receipts update on view (readAt) — no tracking pixels in email, ever (the
  privacy posture extends: we know what you read IN the product, never in
  your inbox); email opens are deliberately unmeasured.

## §7 DATA RIGHTS + RETENTION
Messages received appear in the Account ▸ Data export; account deletion
removes receipts and direct messages addressed to the account (broadcast
rows persist — they are operator records, not user data); retention band for
direct-message bodies authored (long; moderation notices are records).

## §8 PINS + PARKED
- PINS: class-consent enforcement both directions (announcement respects
  opt-out; service delivers regardless — BOTH arms); broadcast two-key; no
  raw HTML renders from body (fixture with hostile markup); receipts
  round-trip; the reply affordance lands a ticket carrying the messageId;
  the unread dot derives from receipts (one truth); the Herald/Messages
  register separation (a Messages surface never renders Herald components —
  a source-scan, the fiction/reality firewall made structural).
- PARKED (owner calls): audience segmentation; the section's name if
  "Messages" feels too plain against the house voice (the chair holds plain
  is correct for this one surface); whether developers may send DIRECT
  notices or only admins (v1 ships both per the owner's words; narrowing is
  one config row).
