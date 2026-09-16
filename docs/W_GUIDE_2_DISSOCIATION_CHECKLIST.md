# W-GUIDE-2 — The Dissociation Review (the wave's UI-review artifact)

Per DESIGN_GUIDANCE_LAYER.md §0 (THE IMMERSION LAW), every hint this wave ships
is reviewed against **THE DISSOCIATION TEST**: *could this be screenshotted and
mistaken for the world's own furniture?* — plus the three precedence guards:
(1) comprehension outranks costume, (2) the rescue lifeline stays boring and
findable, (3) commerce never wears the costume.

Verdicts: PASS = furniture; FLAG = needs a follow-up.

---

## 1. The Surveyor's note (SurveyorNote.jsx + guidanceNotes.js) — the note register

| Immersion-law facet | Finding | Verdict |
| --- | --- | --- |
| Theme tokens / typography | Card `suggestion` variant (soft amber, an existing primitive), serif prose at 1.65, the ✦ glyph + "A NOTE FROM THE SURVEYOR" eyebrow — the DossierNarrativeBanner grammar already in the wild. No new chrome. | PASS |
| Margin / rest-point placement | Mounted at the empty library (SampleDashboard) — a rest-point, nothing in flight. Never floats, dims, or blocks. | PASS |
| Two-register voice law | Note register: second person REQUIRED, UI-verbs (click/tap/button/menu) BANNED — walker-enforced (guidanceNotes.test.js). Reads as the world's marginalia, not software copy. | PASS |
| Dissociation test | A serif "note from the Surveyor" on parchment-amber, signed "— S." — reads as the study's own furniture. | PASS |
| Comprehension ≥ costume | The note teaches (begin here, keep your first, let places touch) before it charms. | PASS |
| Commerce guard | NOT on a commerce surface — the empty library is non-paid. The gallery + realm empty states stay PLAIN (registered plain, no persona). | PASS |

## 2. The empty-state invitations (SampleDashboard / GalleryList / CampaignEmptyState)

| Facet | Finding | Verdict |
| --- | --- | --- |
| Registration | All three registered in the guidance registry; library = note register, gallery + realm = plain. Walker enforces registration; SampleDashboard + CampaignEmptyState burned off the legacy ledger (8 → 6). | PASS |
| Commerce guard | Gallery (publish/discovery) + realm (campaigns are paid) speak PLAIN — the persona precedence guard holds. | PASS |
| Dissociation test | The library invitation is a Surveyor note; the gallery + realm invitations keep their existing themed house-voice callouts (already furniture). | PASS |

## 3. The "what am I reading?" glossary affordance (SurveyorGlossary.jsx) — first wiring HealthPip

| Facet | Finding | Verdict |
| --- | --- | --- |
| Theme tokens / grammar | The InstitutionCard popover grammar (role=dialog, aria-modal, focus trap, Escape + click-outside, focus restore); the ✦ header + serif-adjacent card. An existing visual language. | PASS |
| Rest-point / non-blocking | Opens on demand (a "?" text glyph), in place; never auto-opens, never blocks the pip. Dismisses to nothing. | PASS |
| Honesty gate (§9) | A term with no backing glossary entry renders as PLAIN text — never dressed as clickable; the card never invents a fact (definitions are code-read or coverage-pinned). | PASS |
| Rescue lifeline stays boring | The card deep-links to the Compendium (`?tab=` + `#anchor`) — a plain, findable "Read more" link, no costume. | PASS |
| Comprehension ≥ costume | The affordance exists to answer "what does Strained mean?" in place — comprehension first. | PASS |

---

## Deferrals recorded (not bugs — documented follow-ups)

- **The Keeper's Handbook (design §6c).** Compressing HowToUse (614 lines, 8 tabs)
  into narrative chapters + FAQ with Reference delegating to the Compendium is a
  large content refactor with SEO deep-link + test surface; DEFERRED as the
  wave's resume point rather than rushed.
- **The deeper title= tranche.** LivingWorldGates' gate descriptions and
  WorldMapToolbar's action/teaching titles sit on TEXT-BEARING controls where an
  aria-label swap would clobber the accessible name. Each needs per-title
  glossary-affordance wiring or an inline-help conversion — a careful pass, not a
  mechanical swap. Tranche 1 landed the safe subset (HealthPip band → glossary
  affordance; two redundant WorldMapToolbar `<select>` titles). Baseline 476 → 471.
- **Facets + credibility in the glossary.** The facet vocabulary is un-exported
  inside the spatial engine (off-limits this wave); credibility is a continuous
  weight, not a labelled ladder. Both documented in glossary.js + docs/glossary.md.
