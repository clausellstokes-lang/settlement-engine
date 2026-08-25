---
name: gallery-optin-reload-wipe-fix
description: The gallery_importable/member-overrides silent-wipe-on-reload data loss is FIXED @ e0d0c29c and FOLDED into w7-prep @ 469db96a (2026-07-17 resume session); mount-wiring walker pin added; nothing pending.
metadata: 
  node_type: memory
  type: project
  originSessionId: c94efddd-335c-401f-95bf-0e0053390784
---

Fixed 2026-07-17 on branch `claude/fix-gallery-list-importable` (one commit e0d0c29c off the
w7-prep tip 62bc04da; NOT merged, NOT pushed — merge is owner-gated as usual).

**The bug (pre-existing on the w7-prep lineage only — master already had the fix + a pre-092
fallback):** saves.js `supabaseList`/`supabaseListMeta` selected/mapped neither
`gallery_importable` nor `gallery_member_overrides`, while ShareToGallery's metadata bag ALWAYS
writes both keys on "Save gallery details" — so after any reload, saving any gallery detail
silently cleared the owner's import opt-in + per-member overrides. `galleryMetadataPatch`'s
merge-patch protection never engages because the keys are always present.

**Class fix:** both selects + both mappings in saves.js, PLUS SettlementDetail.jsx's
ShareToGallery mount, which had never wired the two props (a third instance of the same class —
DossierActionBand/GalleryDetail were wired).

**Guards:** tests/lib/saves.galleryOptIns.test.js + tests/components/shareToGalleryReloadSeed.test.jsx
(drives the real reload→save-details flow; plus a mount-walker pin: every `<ShareToGallery` mount
in src/components must wire both props — CANNOT-CATCH spread-prop mounts or wrong-source props).

**Why:** the map twin (MapShareEditor) solved this class differently — `useState(undefined)` +
omit-when-undefined so the merge-patch preserves. If ShareToGallery is ever hardened the same way,
that's the prior art. [[w-doctrine-3-corruption-web]] GALLERY-2 work is adjacent but untouched.

**How to apply:** DONE — FOLDED into claude/w7-prep @ 469db96a (2026-07-17, resume session).
The predicted gallery_title conflict DID materialize (gallery-p2 folded first); resolved by
UNION in both list-projection SELECTs + both row mappings (gallery_importable +
gallery_member_overrides + gallery_title all carried). Receipts on the merged tree: lane pins
8/8, saves/gallery collision suites 20 files / 134 tests green, tsc 0. Nothing pending.
