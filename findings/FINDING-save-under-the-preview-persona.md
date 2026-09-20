# LANE 36 car 9 → the chair (and whoever holds `src/store/authSlice.js`, lane 35 this wave)

## VERDICT: PERSONA-ONLY. A signed-in user's save binds correctly; the preview persona's save
## is REFUSED BY THE SERVER, and the client presents the refusal as silence.

### The trace, link by link (every link read in the tree at 1d5c79a34 + this lane's tip)

1. `authSlice.resolveRole(null)` → `previewPersonaRole() || role || 'user'` → **'admin'**
   under `VITE_PREVIEW_ROLE=admin`.
2. `authSlice.resolveTier('anon', 'admin')` → `staffUnlocksPaidFeatures(role) ? 'premium' : …`
   → **'premium'**. The persona supplies a ROLE and the tier follows it, which is documented
   ("every tier gate open") and is the first half of the defect.
3. `canSave()` → `staffUnlocksPaidFeatures(role)` → **true**, so `SaveToLibraryButton` renders
   its REAL save arm (`handleSave`), not the anonymous sign-up door.
4. `handleSave` → `savesService.save(payload)`. `saves.save` is
   `isConfigured ? supabaseSave : localSaveEntry`, and a preview worktree IS Supabase-configured
   (that is how the app boots) → **`supabaseSave`**.
5. `supabaseSave` → `assertExpectedSupabaseOwner()` → `supabase.auth.getUser()` → **no user**
   (the persona claims nothing to the server, by design) → **`throw new Error('Not authenticated')`**.
6. So `setSaved(true)` never runs → **no success chrome**; `setActiveSaveId(saveId)` never runs
   → `activeSaveId` stays **null**. The `catch` sets `saveError` = `t('errors.saveFailed')`,
   rendered as a small `role="alert"` under the button.
7. `GenerateWizard.requestExit`: `settlement && !activeSaveId && authTier !== 'anon'` — and the
   tier is 'premium' from link 2 → **"This settlement hasn't been saved yet"**. The dialog is
   correct about the store; nothing was bound.

EXECUTED EVIDENCE: `tests/store/wizardSaveBinding.test.js` (3 tests, green) pins links 6 and 7 —
`bindActiveSaveId` binds a real id and refuses a nullish one, the transcribed exit condition
warns exactly when the id is unbound, and `staffUnlocksPaidFeatures('admin')` is true.

### Why the signed-in path is NOT affected
`supabaseSave` returns `data.id` and `SaveToLibraryButton` binds it BEFORE the success chrome
("Bind the returned id into the store BEFORE the success chrome so a re-render sees the draft as
saved"). That cure landed as finding components-shell-commerce-2 and is intact.

### What the pass ALSO saw — "the row appears in the library"
NOT REPRODUCED and NOT EXPLAINED by this trace: link 5 throws before any insert, so no row is
written by this path. Candidates the chair may want re-walked in a browser: a row left by an
earlier genuinely-signed-in session, or the local-mode library if that preview run was
unconfigured. This lane did not have a browser and does not assert it.

### The cure, which is the persona's and not this lane's
The persona's safety argument is that the SERVER keeps every gate — so a persona save SHOULD be
refused. The defect is that the client offers an affordance it knows cannot succeed, and then
says nothing loud enough. Two honest shapes, in preference order:

  A. **THE PERSONA DOES NOT OPEN THE SAVE DOOR.** `canSave()` (and any other gate whose action
     needs a real session) reads the persona's role today; it could require a session too —
     `staffUnlocksPaidFeatures(role) && !!get().auth.user`. The preview then renders the
     anonymous save door, which is the truth: this session cannot save. One line, in authSlice,
     and every other staff gate is untouched.
  B. **THE REFUSAL IS LEGIBLE.** Keep the door open and make `handleSave`'s catch say what
     happened — 'Not authenticated' under a persona is a preview fact, not a save failure. This
     is a copy change plus a persona-aware message, and it leaves the dead affordance in place.

A is the recommendation: an affordance that cannot work is worse than an absent one, and the
persona's whole claim is that it changes the VIEW and not the identity.
