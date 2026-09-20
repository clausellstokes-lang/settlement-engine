# Your part of the deploy: a runsheet

Written by the chair on 2026-09-20 from the read-only deploy pre-flight (`findings/DEPLOY-PREFLIGHT/` in the kit). Everything here needs your login or your dashboard, which is the only reason it is yours. Four stops, about ten minutes of typing in total. Do them in this order. After each stop, tell me the one thing the stop asks for and I carry on.

Why the order matters: Vercel's build gate refuses to deploy while the repository's newest migration (203) is ahead of what `supabase/applied-head.json` says production has (200). So the migrations go first, then I record them, then the merge deploys.

---

## Stop 1 — apply migrations 201, 202 and 203 (before the merge)

All three are `create or replace function` and nothing else: no table change, no data rewrite, nothing dropped. They are safe to run again and safe to apply while the old client is still live.

- 201: staff (`developer` and `admin` roles) hold the Surveyor entitlement, so the client stops showing staff a door the server answers 403 on. This is the one genuine loosening in the whole release; you ordered it (§934.28).
- 202 and 203: the gallery scanner refuses more keys than before (the editor's two private save keys, then three DM-truth ledgers). 203 closes a gap that is open in production today.

From a terminal where the Supabase CLI is installed and logged in (it is not installed on this machine):

```bash
npx supabase login
```

```bash
npx supabase link --project-ref uhozyhcdccbhigvlacdu
```

```bash
npx supabase db push
```

```bash
npx supabase migration list
```

Expected: `db push` lists exactly 201, 202 and 203 as pending and applies them; `migration list` then shows 203 applied with nothing pending.

**Tell me:** the newest applied migration number that `migration list` shows (it should be 203). I then run the head check with that number, commit `supabase/applied-head.json` = 203 on the branch, and the PR's checks re-run.

If `db push` lists anything other than 201, 202 and 203, stop and tell me what it listed. Do not apply it.

---

## Stop 2 — the merge deploys (nothing to type, one thing to watch)

I announce the merge in chat before I do it, and I merge only on fully green CI. After the merge, CI runs on `master` for about an hour. The `Coverage floors` job is the slow one (41 to 43 minutes measured; its cap is 60 on this branch, because the old 45 is what cut the last deploy).

Then one of two things happens:

- If neither `VERCEL_TOKEN` nor `VERCEL_DEPLOY_HOOK_URL` is set as a GitHub Actions secret (the 09-16 evidence says neither is): both deploy jobs log a no-op, and **you press Redeploy** in the Vercel dashboard on the merge commit. The build log should say the ignored-build step is proceeding, not skipping.
- If you would rather never click that again: create a Deploy Hook in Vercel (Project → Settings → Git → Deploy Hooks, branch `master`), and add its URL as the repository secret `VERCEL_DEPLOY_HOOK_URL` (GitHub → Settings → Secrets and variables → Actions). From then on the `Retrigger Vercel deploy` job does it after every green `master` run.

**Tell me:** that production is serving the new build (or that Vercel skipped, with the reason line it printed).

---

## Stop 3 — redeploy eight edge functions (after the merge)

Their shared bundles changed, and edge functions are the one path to production that no gate checks. Deploy them from a CLEAN checkout of the merge commit, never from `~/Desktop/settlement-engine` (that checkout is deliberately stale and would ship the wrong bytes).

```bash
git clone https://github.com/clausellstokes-lang/settlement-engine.git /tmp/sf-deploy && cd /tmp/sf-deploy && git checkout master && git log -1 --oneline
```

Check that the commit shown is the merge commit I named in chat. Then:

```bash
npx supabase functions deploy generate-narrative
```

```bash
npx supabase functions deploy custom-content
```

```bash
npx supabase functions deploy interpret-session
```

```bash
npx supabase functions deploy surveyor-autonomy
```

```bash
npx supabase functions deploy construct-realm
```

```bash
npx supabase functions deploy construct-settlement
```

```bash
npx supabase functions deploy surveyor-byok
```

```bash
npx supabase functions deploy ai-analyst
```

No ordinary user's path breaks if these wait: all eight sit behind the Surveyor entitlement, and purchases are locked. They matter the first time you or staff test the AI layer after migration 201.

**Tell me:** that all eight deployed (or which one failed and what it printed).

---

## Stop 4 — the post-deploy receipt

This one needs a read-only production database URL and the service role key, so it is yours. Fill the four values from your Supabase dashboard; they are never pasted into this chat.

```bash
POST_DEPLOY_DATABASE_URL='...' SF_PRODUCTION_DATABASE_HOST='...' SUPABASE_URL='...' SUPABASE_SERVICE_ROLE_KEY='...' npm run ops:post-deploy -- --health 'edge=https://uhozyhcdccbhigvlacdu.functions.supabase.co/health?deep=1' --receipt /secure/release/post-deploy.json
```

It requires a contiguous migration history through 203, which is why Stop 1 comes first.

**Tell me:** pass or fail, and the failing probe's name if any.

---

## Four things to know before you approve the merge

1. **Purchases.** The purchases lock (`src/lib/launchGate.js`, the `VITE_PURCHASES_OPEN` flag) does not exist on `master`. This merge is what first puts your 09-16 "purchases locked until launch" order into the shipped client. Opening sales later is a Vercel environment variable, not a code change.
2. **The data-loss cure is one-way.** It stops shelved NPCs and roads hostages being erased at a tick. It does not repair a save that was already damaged. And rolling the client back after this deploy would re-open the defect: one committed tick under the old client erases whoever the cure had protected. Treat a rollback as destructive.
3. **Same-seed output moves.** Nine signed shift records ride in this release. A seed generated on production today will not reproduce byte for byte after the deploy. Saved settlements keep their stored records.
4. **Behaviour your users may notice.** World locks are gone (a coup in a save that had locked its incumbent now falls without an approval queue). Anonymous visitors can no longer forge a Thorpe or use the pre-generation options. An anonymous visitor's first dossier now survives a refresh (a new `anonDraft` browser key).

Also: the repository is now private. On GitHub's free tier that means the `master` protection rules recorded on 09-16 are very probably not enforced any more, and Actions minutes are billed. The Vercel build gate is the only armed gate between a merge and production.
