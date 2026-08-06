---
name: no-ffmpeg-on-manager-machine
description: ✅ RESOLVED 2026-07-25 — ffmpeg 8.1.2 + ffprobe + Homebrew NOW INSTALLED on the manager Mac; media-encode lanes unblocked. Encode recipe + open owner master-fork still recorded here.
metadata:
  node_type: memory
  type: project
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-26T03:26:11.165Z
---

HISTORY: confirmed 2026-07-19 that the manager Mac had NO ffmpeg/ffprobe/HandBrakeCLI/
gstreamer and no Homebrew — media-encode lanes were briefed to emit script + manifest
instead of encoding. **That is no longer true.** Verified 2026-07-25: Homebrew present,
`/opt/homebrew/bin/ffmpeg` (version 8.1.2) and `ffprobe` both installed (owner evidently
installed them). Media-encode lanes may now run locally.

**Why:** briefs written before 2026-07-25 (and the runtime-condensation workaround chosen
for the loading journey) assumed no local encode; do not repeat that constraint in new
briefs, and re-evaluate deferred media-derivation lanes (C2 legs, film variants in the
post-launch owed list) — they can now execute on this machine.

**How to apply:** the ready recipe lives at
`~/Desktop/settlementforge-marketing-masters/derived-legs/encode-legs.sh` (+ MANIFEST.md).
⛔OWNER fork still open at writing: master = bg.mp4 (1600×900, 30.25s — what the microsite
actually plays; conductor law = duration/6 ⇒ 5.042s legs) vs
settlementforge-journey-scrub.mp4 (1920×1080, 15.042s ⇒ 2.507s legs — the file
[[comprehensive-review-fix-program]]'s playbook names). Manager recommended bg.mp4.
marketing/assets/videos/ no longer exists in the repo (masters archived to Desktop
2026-07-18) — the Desktop archive is the only copy.
