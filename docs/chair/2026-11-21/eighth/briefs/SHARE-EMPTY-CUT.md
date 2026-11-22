# BRIEF SHARE-EMPTY-CUT: the players' page skims (the eighth chair, 2026-11-22 14:16 UTC; E66, E84)

FOR: PAGE-13 (the display lane), at its "GO". NOT one of the first deploy's three conditions: if it is landed before the
close it ships with the first deploy; if not, with the second. It is on the security reader's list either way.

## The owner's words (verbatim, 2026-11-22)

"Last thing. I noted how I made a rule saying don't cut pieces if the dossier if nothing is on that page tab or section.
The exception is the private share link for players maybe it should be a toggle. But those (post veil) can or should be
cut empty sections for players to skim more easily."

## What the chair measured before cutting this brief (a read-only helper on the line at 1ec3e81d1; each is CONFIRMED by the helper's reading unless marked; the builder re-reads before it builds)

- THE PLAYERS' PAGE IS THE OWNER'S TREE WITH FLAGS, not a second tree: `src/lib/gallery.js :: fetchPublicDossier` (then
  `galleryUnlisted.js :: fetchUnlistedDossier`, RPC `get_unlisted_dossier`), `sanitizeDossier(..., {partyLink:true})`
  (`projectShareVeil(toPublicSafe(source), veilOverrides)`); `GalleryDetail.jsx` sends `dossier.unlisted` to
  `PartyLinkView.jsx` (forces `shareDm:false`), which renders `PublicDossierView`, which renders
  `<OutputContainer settlement readOnly playerView={!shareDm} publicChronicle/>`. Inside `OutputContainer.jsx`:
  `readOnly`, `playerView`, `publicDossier = readOnly && !saveId`. NOTHING TODAY TELLS `OutputContainer` "party link, not
  gallery": `unlisted` stops at `PartyLinkView`. One new prop is needed.
- THE TAB LIST: `OutputContainer.jsx :: TAB_GROUPS`, `TABS`, assembled below them. ALREADY CUT BY DATA in both views:
  `plot_hooks` (`collectPlotHooks` empty), `relationships`, `dm_compass`, `crisis`, and `faith` on a public page without
  a deity. THE RULE THAT STANDS ON THE OWNER'S PAGE: `docs/UX_CONSOLIDATION_2026-10-30.md` (line 32, amended X-7a / X-7c:
  War and Rumors never hidden by the empty-tab resolver); `docs/DESIGN_GALLERY_SHOWCASE.md` ("an empty shipped tab keeps
  its EmptyState"). ITS PIN: `tests/components/dossierPhoneFloorAllViews.test.jsx` (`MIN_VIEWS = 20`; it walks the
  shared page with `readOnly` and expects "No chronicle yet.").
- THE EMPTY STATES A PLAYER SEES TODAY: `Primitives.jsx :: Empty` in Chronicle ("No chronicle yet.": PLAUSIBLY on every
  party link, the unlisted branch passes no chronicle), NPCs, Institutions, History, Economics, Resources, Viability,
  Relationships, Power, Substrate; Traditions' own sentence; the launch teasers of Rumors and War (PLAUSIBLY always, a
  public page has no campaign).
- NO STORED SWITCH REACHES A PLAYER TODAY, AND NONE IS ADDED HERE. A share has no options column;
  `settlements.gallery_member_overrides` (jsonb) carries the veil's record under `$veil`. What of it travels to a reader
  is an ALLOWLIST in the veil's SQL (`supabase/migrations/211_server_side_share_veil.sql :: _gallery_veil_served`, on the
  veil lane): each person's `revealDm` and `allowImport`, and the marker `{ v, mode, at, groupings }`: "no other key". A
  switch the OWNER stores per settlement would need one typed line there: that is the veil's migration text (one
  writer; the fresh security reading; the owner's hand at the deploy). IT IS NOT IN THIS UNIT.

## What is built (E84)

1. THE CUT, ON BY DEFAULT, ON THE PARTY LINK'S PAGE ONLY (and on the owner's own PREVIEW of what players see, if the
   product has one: the two must stay equal, `tests/components/publicProseEquality.test.jsx`; say what that preview is
   before you build). A tab whose content is empty in the SERVED document is not listed; a section of a shown tab that
   would print only its empty state is not printed. The overview is never cut. The owner's own dossier is untouched,
   and so is the public gallery page (a listed share) unless the chair says otherwise.
2. THE DECISION IS A PURE FUNCTION OF THE SERVED, ALREADY VEILED DOCUMENT: ONE helper (the plot hooks' and the
   relationships' predicates are the precedent), reading nothing but the document the page was handed: never the
   owner's record, never the marker's `groupings`, never a count of what was withheld. A section veiled to nothing and
   a section that never held anything are cut alike. That sentence is the unit's safety claim and its proof (below).
3. RUMORS AND WAR: on a party link their launch teaser is the whole tab: counted as empty THERE and cut (the chair's
   call, named to the owner for his veto); X-7a / X-7c stand everywhere else.
4. THE READER'S SWITCH: one control on the page ("Show empty sections"), off by default, kept in the browser only (no
   server field, no stored value): switched on, the page is today's page exactly.
5. TAB LEVEL FIRST. Section level only where the same helper can decide it from the document; a section whose
   emptiness is known only deep inside its component (the helper's reading: defense in part, magic, daily life) is
   NAMED in your landing line and left printed, never guessed.

## Proof owed (red first; the brief's order)

(a) THE NO-TELL ARM: a differential over at least 150 births a size and the veil's standard owner choices: the list of
    cut tabs and sections is a function of the served document ALONE: two owner records that project to the same
    served document give the same list; a planted difference that lives only in withheld content never moves it. Red
    on a planted helper that reads one owner-only key.
(b) THE SWITCH ARM: with the reader's switch on, the party link's page is today's page (the phone floor's walk of the
    shared page stays green: `MIN_VIEWS` is measured there with the switch on, or on the gallery path: say which, and
    change no baseline of that test without the chair).
(c) GREEN, WHOLE FILES: `publicProseEquality`, `publicProseVeilInvariance`, `publicProseVeilOnce`,
    `tests/security/publicPayloadVeilTotality`, `tests/domain/display/publicSafeVeil`, `tests/lib/partyLinkClient`,
    `tests/ui/partyLinkView`, `tests/components/defenseRingNoteProjection`; `tests/lint` whole.
(d) THE THREE FIRST-PAINT FIGURES before and after (the helper is small: a rise is named for the owner, never signed
    by a seat).

## For the owner, at the close (the chair carries it)

A switch the OWNER sets per settlement, remembered on the server, is one typed line in the share veil's allowlist: a
database change of his own hand (a migration after 212, or a line in 212 before its final reading). Offered for the
second deploy; not built unless he asks.
