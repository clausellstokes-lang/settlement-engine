# DESIGN — THE PROFILE IMAGE (one identity, three surfaces, one scaling program)

## Fable 5 architecture, 2026-08-02, from owner dictation ("people should be able to
## upload an image in place of their profile [letter]; it shows in their settlements,
## maps, and campaigns in the galleries along with their display name; also the
## founders page; circular frame; be judicious and exhaustive on all the settings and
## requirements and scaling"). Implementation = the external implementer.
## ⚠️ This is the product's FIRST user-supplied public imagery — the pipeline and
## moderation discipline below are the feature, not overhead.

## §0 The owner's orders (binding)
1. Account page: upload an image replacing the letter-circle.
2. It renders beside the display name on the user's gallery items — settlements,
   maps, campaigns — and on the Founders' Hall plates.
3. Circular frame. Exhaustive on settings, requirements, scaling, and the
   scaling program.

## §1 ONE IDENTITY OBJECT (the ruling that keeps three surfaces coherent)
Display name + profile image are ONE public display identity, not two switches:
a single opt-in state governs whether the pair renders anywhere public. Every
consumer — gallery author lines (composing with DESIGN_GALLERY_SHOWCASE's G-A
author-slot work item: today sanitizeTile drops author identity; the slot this
feature fills is that one), Founders' Hall plates (a numeral-only chair shows
no image by the same single consent), comments — reads the SAME identity
projection from one resolver (`publicIdentityOf(userId)` → `{ displayName,
imageUrl | null, optedIn }`). No surface composes name and image independently;
consent withdrawal blanks both everywhere at once.

## §2 THE ASSET CONTRACT (what is stored — judicious, exact)
- **The canonical asset is ONE SQUARE MASTER: 512×512, WebP (quality band
  authored), content-hash named** (`avatars/{userId}/{sha256-16}.webp`) — the
  hash IS the cache-buster; objects are immutable with long-cache headers;
  replacing the avatar writes a new object and updates the profile pointer;
  the old object is garbage-collected on a sweep (never trusted to expire).
- **The frame is circular AT RENDER, the asset is square AT REST** (CSS
  border-radius mask). Never store a pre-masked circle: surfaces choose ring
  treatments (plain ring in galleries; the ceremonial gold ring on hall
  plates) and future surfaces stay free.
- **The size ladder:** master 512 + derived 128 (author lines, plates) + 32
  (micro contexts: comments, compact rows). BUILD-TIME CHECK: if Supabase
  image transformations are available on the project's plan, store the master
  ONLY and derive 128/32 via transform params; otherwise the upload pipeline
  pre-derives all three and stores them beside the master (same hash stem,
  `-128`/`-32` suffixes). `srcset` serves 1x/2x from the ladder; the 512 never
  ships to a 32px slot.

## §3 THE UPLOAD PIPELINE (client-side, privacy-first — the scaling program)
1. **Accept:** PNG, JPEG, WebP; HEIC converted client-side where the browser
   decodes it, otherwise refused with a plain sentence; animated anything →
   first frame with a notice (no animation in identity, anywhere, ever —
   a taste law worth stating). Source caps: ≤ 10 MB, ≥ 128×128 source pixels
   (below that the letter-circle is honestly better).
2. **Crop:** an in-account circular-preview crop UI over a SQUARE selection
   (pan + zoom, the standard gesture set, keyboard-operable per the house
   a11y bar). The stored master is the cropped square.
3. **Scale:** client-side canvas downscale to 512 (premultiplied, proper
   resampling — the browser canvas path is sufficient; no native dependency),
   encode WebP at the authored quality band.
4. **⚠️ EXIF DIES HERE, STRUCTURALLY:** the canvas re-encode strips ALL
   metadata — GPS, device, timestamps — by construction, not by a scrubbing
   step that can be forgotten. PINNED: a fixture upload carrying full EXIF
   round-trips to a stored object with zero metadata blocks.
5. **Deliver:** upload to the avatars bucket (NEW bucket — the gallery bucket
   is public-write-patterned for a different lane and is NOT reused; the
   recorded audit lesson) with RLS storage policies: a user writes only under
   `avatars/{their-id}/`, public READ (the asset is public by function),
   size/type enforced server-side AGAIN (client checks are courtesy, server
   checks are law).
6. **Rate + failure honesty:** an authored per-day upload band; every failure
   states its reason in a sentence (too large, wrong kind, too small, rate).

## §4 SETTINGS (Account ▸ Profile — the exhaustive list, each with its behavior)
- **Upload / replace** (the pipeline above; the current image always previewed
  in the circular frame at 128 and 32 so the user sees every size they ship).
- **Remove** → reverts to the letter-circle immediately, everywhere (the
  letter-circle is the PERMANENT fallback: initial + the deterministic gold
  hue — no avatar is never a broken state; alt text = the display name).
- **Public display identity opt-in** (the §1 single switch; copy states
  plainly where the pair appears: "your name and image appear on your
  published settlements, maps, campaigns, and — if you hold a chair — the
  Founders' Hall").
- **Data rights:** the image is included in the Account ▸ Data export
  (accountData manifest extends — named work); account deletion cascades the
  storage objects (pinned); consent withdrawal blanks all public renders
  without deleting the stored asset (the user chose privacy, not loss).

## §5 MODERATION (public UGC imagery = a new obligation, met minimally + honestly)
- **Report path:** every public avatar render carries the existing report
  affordance's reach (the gallery report lane extends to author identity).
- **Admin verbs (role-gated, audit-rowed):** REMOVE AVATAR (reverts the user
  to letter-circle + notice to the user) and, for repeat abuse, LOCK AVATAR
  (upload disabled until unlocked). Single-admin, not two-key (proportionate;
  reversible).
- **Proactive scanning is PARKED, honestly:** a third-party image-moderation
  service is a paid integration the owner activates by explicit order; until
  then the surface is report-and-remove, and the parked state is recorded
  here rather than implied to exist.
- The Founders' Hall carries an extra quiet guarantee: hall plates render
  only invitees the owner personally chose — the hall's moderation is the
  invitation itself.

## §6 RENDERING CONTRACT (every consumer, one rule set)
- Circular mask, ring per surface's register, the 128 rung for author lines
  and plates, 32 for micro rows; `loading="lazy"` everywhere below the fold;
  fixed-size boxes (zero layout shift); the letter-circle fallback renders
  IDENTICALLY sized so swap-in never jumps.
- Never content-bearing: alt = display name; decorative ring is aria-hidden;
  identity is always ALSO text (the image is never the only carrier — the
  legibility law's "never the only path").

## §7 PINS
- EXIF-zero round-trip (the §3.4 fixture).
- RLS: cross-user write refused; anonymous write refused; public read serves.
- Identity coherence: consent off ⇒ no surface renders name OR image (walk
  gallery tile, hall plate, comment row in one test).
- Fallback: no-avatar renders the letter-circle at every rung, same box.
- Cache: replacing the avatar changes the URL (hash pointer), old URL's
  object swept by the GC job (the job pinned, not hoped).
- Size ladder: the 512 never serves a ≤128 slot (srcset assertion).

## §9 THE CIVILITY GUARD (owner order, same session: display names + comments)
**The order:** obscene or abusive language in a DISPLAY NAME or a COMMENT is
simply prevented — the text cannot be saved or posted. NOTHING ELSE is
affected: no lockouts, no strikes, no shadow penalties ("it doesn't lock them
out of anything else" — the owner's proportionality ruling, and it is the
right one: the guard rejects a string, never a person).

- **ONE VALIDATOR, TWO MIRRORS:** a shared module (blocklist + normalizer)
  runs CLIENT-SIDE for the polite inline refusal and SERVER-SIDE as law (the
  save/post RPCs validate again — client checks are courtesy, server checks
  are law; the two mirrors share ONE test-vector file so they can never drift,
  the writer/reader-drift hazard applied to validation).
- **MATCHING DISCIPLINE (the Scunthorpe defense):** word-boundary matching
  over a NORMALIZED string (case fold, diacritic strip, homoglyph map,
  leet-fold, repeated-character collapse, zero-width strip) — NEVER bare
  substring matching, which convicts innocent words and, in a fantasy-name
  product, convicts them constantly. An ALLOWLIST rides beside the blocklist
  for known collisions. Both lists are DATA (authored, versioned, updatable
  without code); severity is one class in v1 (blocked is blocked).
- **HONESTY ABOUT THE CEILING (recorded so nobody oversells):** normalization
  catches casual evasion; determined evasion beats any filter. The guard is a
  CIVILITY FLOOR — the backstop remains the existing report + admin-remove
  lane (comments already carry moderation/tombstone machinery; names carry
  the §5 admin verbs). Pre-post filter + post-hoc human judgment, named as
  two layers on purpose.
- **THE REFUSAL IS POLITE AND NON-ACCUSATORY:** "That name can't be used
  here." / "That comment can't be posted." — no moralizing, no echo of the
  matched term, and a mistake path in the same breath ("Think this is wrong?
  Feedback & support."). False positives are support tickets, not appeals
  court.
- **SCOPE + THE PUBLICATION-BOUNDARY EXTENSION (chair recommendation,
  vetoable):** the ordered scope is display names + comments. The same guard
  SHOULD also run at the GALLERY PUBLISH boundary over user-authored text
  fields in shared content (renamed settlements, custom-content names) — the
  principle being: the guard gates where text BECOMES PUBLIC, and never
  polices private worlds (a DM's own campaign may say what it wants at home;
  the product law that the world is theirs holds absolutely). Default: in.
- **Limitations recorded:** the v1 lists are English-centric (i18n is a
  future list-versioning matter, not a code change); AI-assisted moderation
  stays PARKED with the avatar-scanning decision (§5 — one paid-service
  ruling covers both).
- **Pins:** shared vectors green on both mirrors; the Scunthorpe fixture set
  (innocent-containing-substring names PASS); the evasion fixture set
  (casual leet/spacing variants FAIL); the server refuses what a bypassed
  client submits; no other account capability is touched by a refusal (the
  proportionality pin — walk the account surface after a block and assert
  nothing else changed).

## §10 Parked owner calls
0. The §9 publication-boundary extension (chair default: in).
1. The product-voice name for it ("Profile image" ships; "emblem"/"sigil" is
   a voice-workstream candidate the owner may prefer).
2. Proactive moderation service activation (paid; §5).
3. Whether gallery COMMENTS show the image at 32 from day one or text-only
   until the comment surface's next pass.
